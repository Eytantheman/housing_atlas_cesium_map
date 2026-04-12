import type maplibregl from 'maplibre-gl';

export function viewportBounds(map: maplibregl.Map, padding = 0.1): [number, number, number, number] {
  const bounds = map.getBounds();
  const w = bounds.getWest();
  const s = bounds.getSouth();
  const e = bounds.getEast();
  const n = bounds.getNorth();
  const dLng = (e - w) * padding;
  const dLat = (n - s) * padding;
  return [w - dLng, s - dLat, e + dLng, n + dLat];
}
