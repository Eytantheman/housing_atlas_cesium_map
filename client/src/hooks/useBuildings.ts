import { useState, useEffect, useRef } from 'react';
import type maplibregl from 'maplibre-gl';
import { MIN_3D_ZOOM } from '../config';

interface FeatureCollection {
  type: string;
  features: object[];
}

export function useBuildings(map: maplibregl.Map | null, zoom: number) {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!map || zoom < MIN_3D_ZOOM) {
      setGeojson(null);
      return;
    }

    const fetchBuildings = async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      const bounds = map.getBounds();
      const pad = 0.1;
      const w = bounds.getWest();
      const s = bounds.getSouth();
      const e = bounds.getEast();
      const n = bounds.getNorth();
      const dLng = (e - w) * pad;
      const dLat = (n - s) * pad;

      const params = new URLSearchParams({
        minLng: String(w - dLng),
        minLat: String(s - dLat),
        maxLng: String(e + dLng),
        maxLat: String(n + dLat),
      });

      try {
        setLoading(true);
        const res = await fetch(`/api/buildings/bbox?${params}`, {
          signal: abortRef.current.signal,
        });
        const data = await res.json();
        setGeojson(data);
        setError(null);
      } catch (e: unknown) {
        if ((e as Error).name !== 'AbortError') setError(String(e));
      } finally {
        setLoading(false);
      }
    };

    const onMove = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(fetchBuildings, 300);
    };

    fetchBuildings();
    map.on('moveend', onMove);
    return () => {
      map.off('moveend', onMove);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, zoom >= MIN_3D_ZOOM]);

  return { geojson, loading, error };
}
