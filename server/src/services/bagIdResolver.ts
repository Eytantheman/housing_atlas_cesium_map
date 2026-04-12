/**
 * Resolves BAG IDs for all housing atlas projects using PDOK BAG WFS.
 * PDOK returns proper GeoJSON with polygon footprints and `identificatie`.
 * Runs once at startup, caches to bag-ids-cache.json.
 */
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { getAllProjects } from './projectsService';
import { wgs84ToRd } from '../utils/rdConvert';

const cachePath = path.join(__dirname, '../../data/bag-ids-cache.json');

const PDOK_WFS = 'https://service.pdok.nl/lv/bag/wfs/v2_0';

interface BagIdCache {
  resolvedAt: string;
  ids: Record<number, string | null>;
}

function loadCache(): BagIdCache | null {
  try {
    if (fs.existsSync(cachePath)) {
      return JSON.parse(fs.readFileSync(cachePath, 'utf-8')) as BagIdCache;
    }
  } catch {
    // corrupt — ignore
  }
  return null;
}

function saveCache(ids: Record<number, string | null>): void {
  try {
    fs.writeFileSync(cachePath, JSON.stringify({ resolvedAt: new Date().toISOString(), ids }, null, 2));
    console.log(`[bagIdResolver] Cache saved → ${cachePath}`);
  } catch (e) {
    console.warn('[bagIdResolver] Could not save cache:', e);
  }
}

/** Ray-casting point-in-polygon for WGS84 ring coordinates [lng, lat][]. */
function pointInRing(lng: number, lat: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect = (yi > lat) !== (yj > lat) &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** Distance² between a point and a polygon ring's first vertex (cheap proxy for sorting). */
function distToRing(lng: number, lat: number, ring: number[][]): number {
  let minD = Infinity;
  for (const [x, y] of ring) {
    const d = (x - lng) ** 2 + (y - lat) ** 2;
    if (d < minD) minD = d;
  }
  return minD;
}

type PdokPand = {
  properties: { identificatie: string };
  geometry: { type: string; coordinates: number[][][] | number[][][][] };
};

async function resolveBagId(lat: number, lng: number): Promise<string | null> {
  // Fetch up to 20 buildings in a 50 m radius — then pick the one that
  // actually contains the project point (or the closest one as fallback).
  const delta = 50; // metres in RD New
  const [cx, cy] = wgs84ToRd(lat, lng);
  const bbox = `${cx - delta},${cy - delta},${cx + delta},${cy + delta},EPSG:28992`;

  const params = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeName: 'bag:pand',
    outputFormat: 'application/json',
    count: '20',
    bbox,
    srsName: 'EPSG:4326',
  });

  try {
    const res = await fetch(`${PDOK_WFS}?${params}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const json = await res.json() as { features?: PdokPand[] };
    const features = json.features ?? [];
    if (!features.length) return null;

    // Prefer a building whose polygon actually contains the point.
    for (const f of features) {
      const geo = f.geometry;
      const rings: number[][][] = geo.type === 'Polygon'
        ? (geo.coordinates as number[][][])
        : (geo.coordinates as number[][][][]).flat();
      if (rings[0] && pointInRing(lng, lat, rings[0])) {
        return `NL.IMBAG.Pand.${f.properties.identificatie}`;
      }
    }

    // Fallback: nearest building by vertex proximity
    let best: PdokPand | null = null;
    let bestDist = Infinity;
    for (const f of features) {
      const geo = f.geometry;
      const rings: number[][][] = geo.type === 'Polygon'
        ? (geo.coordinates as number[][][])
        : (geo.coordinates as number[][][][]).flat();
      const d = rings[0] ? distToRing(lng, lat, rings[0]) : Infinity;
      if (d < bestDist) { bestDist = d; best = f; }
    }
    if (!best) return null;
    return `NL.IMBAG.Pand.${best.properties.identificatie}`;
  } catch {
    return null;
  }
}

export async function resolveBagIds(): Promise<void> {
  const projects = getAllProjects();

  const cached = loadCache();
  if (cached) {
    let applied = 0;
    for (const p of projects) {
      if (cached.ids[p.id] !== undefined) {
        p.bag_id = cached.ids[p.id];
        if (p.bag_id) applied++;
      }
    }
    console.log(`[bagIdResolver] Loaded ${applied} BAG IDs from cache`);
    return;
  }

  console.log('[bagIdResolver] Resolving BAG IDs via PDOK WFS — runs once then caches…');
  const ids: Record<number, string | null> = {};
  let resolved = 0;

  for (const p of projects) {
    if (p.lat === null || p.lng === null) {
      ids[p.id] = null;
      continue;
    }
    const bagId = await resolveBagId(p.lat, p.lng);
    ids[p.id] = bagId;
    p.bag_id = bagId;
    if (bagId) {
      resolved++;
      console.log(`  [${p.id}] ${p.name} → ${bagId}`);
    } else {
      console.warn(`  [${p.id}] ${p.name} → null`);
    }
  }

  console.log(`[bagIdResolver] Done — ${resolved}/${projects.filter(p => p.lat !== null).length} resolved`);
  saveCache(ids);
}
