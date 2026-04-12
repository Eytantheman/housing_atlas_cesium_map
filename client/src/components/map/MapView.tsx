import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl/maplibre';
import type { MapRef, MapMouseEvent, ViewStateChangeEvent } from 'react-map-gl/maplibre';
import type { Feature, FeatureCollection } from 'geojson';
import type { HousingProject, ProjectFeatureCollection, BuildingSelection } from '../../types';
import { ProjectMarker } from './ProjectMarker';
import { MAP_DEFAULTS, MAP_STYLE, MIN_3D_ZOOM } from '../../config';
// MIN_3D_ZOOM still used for layer minzoom — tiles now fetch at any zoom

/**
 * Tile zoom level used for fetching. Each tile at z=15 covers ~0.75km × ~0.75km
 * in the Netherlands — small enough that PDOK returns all buildings (<500) in one request.
 */
const FETCH_ZOOM = 15;
/** Max concurrent tile fetches — PDOK rate-limits aggressively above 2-3. */
const MAX_CONCURRENT = 3;
/** Minimum ms between starting successive tile fetches. */
const FETCH_INTERVAL_MS = 250;
/** Keep at most this many tiles in the client cache. */
const MAX_CACHED_TILES = 80;

interface Props {
  features: ProjectFeatureCollection;
  onProjectSelect: (project: HousingProject) => void;
  onBuildingSelect: (selection: BuildingSelection) => void;
  selectedProject: HousingProject | null;
  flyToTarget?: { lng: number; lat: number; zoom?: number; pitch?: number; id: number } | null;
  tourProjects?: HousingProject[];
}

// ── Web Mercator tile math ────────────────────────────────────────────────────

function lngToTileX(lng: number, z: number) {
  return Math.floor((lng + 180) / 360 * (1 << z));
}
function latToTileY(lat: number, z: number) {
  const r = lat * Math.PI / 180;
  return Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * (1 << z));
}
function tileToBbox(x: number, y: number, z: number): [number, number, number, number] {
  const n = 1 << z;
  const west  = x / n * 360 - 180;
  const east  = (x + 1) / n * 360 - 180;
  const north = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * 180 / Math.PI;
  const south = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + 1) / n))) * 180 / Math.PI;
  return [west, south, east, north];
}

// ─────────────────────────────────────────────────────────────────────────────

export function MapView({ features, onProjectSelect, onBuildingSelect, flyToTarget, tourProjects }: Props) {
  const mapRef = useRef<MapRef>(null);
  const [zoom, setZoom] = useState(MAP_DEFAULTS.zoom);
  const [geojson, setGeojson] = useState<FeatureCollection>({ type: 'FeatureCollection', features: [] });
  const [loadingCount, setLoadingCount] = useState(0);

  // Client-side tile cache: tileKey → Feature[]
  // Note: using plain objects to avoid collision with react-map-gl's Map import
  const tileCache     = useRef<Record<string, Feature[]>>({});
  const tileOrder     = useRef<string[]>([]);
  const inFlight      = useRef<Record<string, true>>({});
  const fetchQueue    = useRef<string[]>([]);
  const activeFetches = useRef(0);
  const lastFetchAt   = useRef(0);
  const drainTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Rebuild the merged GeoJSON from all cached tiles
  const rebuildGeojson = useCallback(() => {
    const all: Feature[] = [];
    for (const feats of Object.values(tileCache.current)) all.push(...feats);
    setGeojson({ type: 'FeatureCollection', features: all });
  }, []);

  const processQueue = useCallback(() => {
    if (drainTimer.current) return; // already scheduled

    const drain = () => {
      drainTimer.current = null;
      if (activeFetches.current >= MAX_CONCURRENT || fetchQueue.current.length === 0) return;

      const now = Date.now();
      const wait = FETCH_INTERVAL_MS - (now - lastFetchAt.current);
      if (wait > 0) {
        drainTimer.current = setTimeout(drain, wait);
        return;
      }

      // Pick next uncached, not-in-flight tile
      let key: string | undefined;
      while (fetchQueue.current.length > 0) {
        const candidate = fetchQueue.current.shift()!;
        if (tileCache.current[candidate] === undefined && !inFlight.current[candidate]) {
          key = candidate; break;
        }
      }
      if (!key) return;

      const [zs, xs, ys] = key.split('/').map(Number);
      const [minLng, minLat, maxLng, maxLat] = tileToBbox(xs, ys, zs);
      const params = new URLSearchParams({
        minLng: String(minLng), minLat: String(minLat),
        maxLng: String(maxLng), maxLat: String(maxLat),
      });

      inFlight.current[key] = true;
      activeFetches.current++;
      lastFetchAt.current = Date.now();
      setLoadingCount(n => n + 1);

      const tileKey = key; // capture for closure
      fetch(`/api/buildings/bbox?${params}`)
        .then(r => {
          if (r.status === 429) throw new Error('rate-limited');
          return r.json() as Promise<FeatureCollection>;
        })
        .then(data => {
          tileCache.current[tileKey] = data.features ?? [];
          tileOrder.current.push(tileKey);
          if (tileOrder.current.length > MAX_CACHED_TILES) {
            const evict = tileOrder.current.shift()!;
            delete tileCache.current[evict];
          }
          rebuildGeojson();
        })
        .catch(err => {
          if ((err as Error).message === 'rate-limited') {
            // Re-queue tile to try again after a longer pause
            fetchQueue.current.unshift(tileKey);
            lastFetchAt.current = Date.now() + 2000; // extra 2s penalty
          }
        })
        .finally(() => {
          delete inFlight.current[tileKey];
          activeFetches.current--;
          setLoadingCount(n => Math.max(0, n - 1));
          // Schedule next drain
          drainTimer.current = setTimeout(drain, FETCH_INTERVAL_MS);
        });

      // Schedule next slot if capacity allows
      if (activeFetches.current < MAX_CONCURRENT && fetchQueue.current.length > 0) {
        drainTimer.current = setTimeout(drain, FETCH_INTERVAL_MS);
      }
    };

    drainTimer.current = setTimeout(drain, 0);
  }, [rebuildGeojson]);

  const fetchVisibleTiles = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();

    const b   = map.getBounds();
    const x0  = lngToTileX(b.getWest(),  FETCH_ZOOM);
    const x1  = lngToTileX(b.getEast(),  FETCH_ZOOM);
    const y0  = latToTileY(b.getNorth(), FETCH_ZOOM);
    const y1  = latToTileY(b.getSouth(), FETCH_ZOOM);
    const ctr = map.getCenter();
    const cx  = lngToTileX(ctr.lng, FETCH_ZOOM);
    const cy  = latToTileY(ctr.lat, FETCH_ZOOM);

    // Collect uncached tiles and sort center-first so the most visible
    // part of the viewport loads before the edges.
    const pending: Array<{ key: string; d: number }> = [];
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        const key = `${FETCH_ZOOM}/${x}/${y}`;
        if (tileCache.current[key] === undefined && !inFlight.current[key]) {
          pending.push({ key, d: (x - cx) ** 2 + (y - cy) ** 2 });
        }
      }
    }
    pending.sort((a, b) => a.d - b.d);

    // Prepend center tiles so they jump the queue ahead of earlier viewport edges
    fetchQueue.current.unshift(...pending.map(p => p.key));
    // Deduplicate without changing order
    const seen = new Set<string>();
    fetchQueue.current = fetchQueue.current.filter(k => seen.has(k) ? false : (seen.add(k), true));

    processQueue();
  }, [processQueue]);

  const moveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleZoom = useCallback((e: ViewStateChangeEvent) => setZoom(e.viewState.zoom), []);

  const handleLoad    = useCallback(() => fetchVisibleTiles(), [fetchVisibleTiles]);
  const handleMoveEnd = useCallback(() => {
    if (moveTimer.current) clearTimeout(moveTimer.current);
    moveTimer.current = setTimeout(fetchVisibleTiles, 100);
  }, [fetchVisibleTiles]);

  useEffect(() => {
    if (!flyToTarget || !mapRef.current) return;
    mapRef.current.getMap().flyTo({
      center: [flyToTarget.lng, flyToTarget.lat],
      zoom:  flyToTarget.zoom  ?? 16,
      pitch: flyToTarget.pitch ?? 55,
      duration: 1800,
    });
  }, [flyToTarget]);

  const handleMapClick = useCallback(async (e: MapMouseEvent) => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    const rendered = map.queryRenderedFeatures(e.point, { layers: ['3dbag-buildings'] });
    if (!rendered.length) return;
    const bagId = rendered[0].properties?.['identificatie'];
    if (!bagId) return;
    try {
      const res  = await fetch(`/api/buildings/${encodeURIComponent(String(bagId))}/metadata`);
      const data = await res.json() as BuildingSelection;
      onBuildingSelect(data);
    } catch { /* ignore */ }
  }, [onBuildingSelect]);

  const show3D = zoom >= MIN_3D_ZOOM;
  const isLoading = loadingCount > 0;

  // Build tour GeoJSON from ordered project list
  const tourGeojson = useMemo((): FeatureCollection => {
    if (!tourProjects || tourProjects.length < 2) return { type: 'FeatureCollection', features: [] };
    const coords = tourProjects
      .filter(p => p.lat != null && p.lng != null)
      .map(p => [p.lng!, p.lat!]);
    if (coords.length < 2) return { type: 'FeatureCollection', features: [] };
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: coords },
          properties: {},
        },
        ...tourProjects
          .filter(p => p.lat != null && p.lng != null)
          .map((p, i) => ({
            type: 'Feature' as const,
            geometry: { type: 'Point' as const, coordinates: [p.lng!, p.lat!] },
            properties: { stop: i + 1, name: p.name },
          })),
      ],
    };
  }, [tourProjects]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Map
        ref={mapRef}
        initialViewState={MAP_DEFAULTS}
        mapStyle={MAP_STYLE}
        style={{ position: 'absolute', inset: 0 }}
        onClick={handleMapClick}
        onZoom={handleZoom}
        onLoad={handleLoad}
        onMoveEnd={handleMoveEnd}
      >
        {/* 3D buildings — Source stays mounted; minzoom on Layers controls visibility */}
        {geojson.features.length > 0 && (
          <Source id="3dbag-src" type="geojson" data={geojson} buffer={0}>
            <Layer
              id="3dbag-buildings"
              type="fill-extrusion"
              minzoom={MIN_3D_ZOOM}
              paint={{
                'fill-extrusion-color': [
                  'case',
                  ['boolean', ['get', 'is_atlas_project'], false],
                  '#C4623A',
                  '#C8C2B8',
                ],
                'fill-extrusion-height':  ['coalesce', ['to-number', ['get', 'b3_h_dak_50p']], 8],
                'fill-extrusion-base':    ['coalesce', ['to-number', ['get', 'b3_h_maaiveld']], 0],
                'fill-extrusion-opacity': 0.85,
                'fill-extrusion-vertical-gradient': true,
              }}
            />
            <Layer
              id="3dbag-atlas-outline"
              type="line"
              minzoom={MIN_3D_ZOOM}
              filter={['==', ['get', 'is_atlas_project'], true]}
              paint={{ 'line-color': '#8A3D20', 'line-width': 2 }}
            />
            {/* Number labels rendered on the polygon itself — guaranteed co-location */}
            <Layer
              id="3dbag-atlas-labels"
              type="symbol"
              minzoom={MIN_3D_ZOOM}
              filter={['==', ['get', 'is_atlas_project'], true]}
              layout={{
                'text-field': ['to-string', ['get', 'atlas_id']],
                'text-size': 12,
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-allow-overlap': true,
                'text-ignore-placement': true,
              }}
              paint={{
                'text-color': '#fff',
                'text-halo-color': '#7A2D10',
                'text-halo-width': 1.5,
              }}
            />
          </Source>
        )}

        {/* Architecture tour route */}
        {tourGeojson.features.length > 0 && (
          <Source id="tour-src" type="geojson" data={tourGeojson}>
            {/* Dashed route line */}
            <Layer
              id="tour-line-casing"
              type="line"
              filter={['==', ['geometry-type'], 'LineString']}
              paint={{ 'line-color': '#fff', 'line-width': 5, 'line-opacity': 0.6 }}
            />
            <Layer
              id="tour-line"
              type="line"
              filter={['==', ['geometry-type'], 'LineString']}
              paint={{
                'line-color': '#C4623A',
                'line-width': 2.5,
                'line-dasharray': [4, 3],
              }}
            />
            {/* Stop circles */}
            <Layer
              id="tour-stops"
              type="circle"
              filter={['==', ['geometry-type'], 'Point']}
              paint={{
                'circle-radius': 10,
                'circle-color': '#C4623A',
                'circle-stroke-color': '#fff',
                'circle-stroke-width': 2,
              }}
            />
            {/* Stop numbers */}
            <Layer
              id="tour-stop-labels"
              type="symbol"
              filter={['==', ['geometry-type'], 'Point']}
              layout={{
                'text-field': ['to-string', ['get', 'stop']],
                'text-size': 11,
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-allow-overlap': true,
                'text-ignore-placement': true,
              }}
              paint={{ 'text-color': '#fff' }}
            />
          </Source>
        )}

        {/* 2D markers — only at low zoom; at high zoom labels come from the polygon layer above */}
        {!show3D && features.features.map(f => (
          <Marker
            key={f.properties.id}
            longitude={f.geometry.coordinates[0]}
            latitude={f.geometry.coordinates[1]}
            anchor="center"
          >
            <ProjectMarker
              project={f.properties}
              zoom={MAP_DEFAULTS.zoom}
              onClick={() => onProjectSelect(f.properties)}
            />
          </Marker>
        ))}
      </Map>

      {/* Loading indicator */}
      {isLoading && (
        <>
          <style>{`@keyframes _spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{
            position: 'absolute', bottom: 28, left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(30,30,30,0.75)', backdropFilter: 'blur(4px)',
            color: '#fff', borderRadius: 20, padding: '6px 14px',
            fontSize: 12, fontFamily: 'system-ui,sans-serif',
            display: 'flex', alignItems: 'center', gap: 8,
            pointerEvents: 'none', zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            <span style={{
              width: 11, height: 11,
              border: '2px solid rgba(255,255,255,0.35)',
              borderTopColor: '#fff', borderRadius: '50%',
              display: 'inline-block',
              animation: '_spin 0.75s linear infinite',
            }} />
            Loading buildings ({loadingCount})
          </div>
        </>
      )}
    </div>
  );
}
