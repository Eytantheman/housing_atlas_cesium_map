/**
 * 3DBAG + PDOK services for building data.
 *
 * - getBuildingsInBbox: fetches polygon footprints from PDOK WFS (proper GeoJSON)
 *   and merges height attributes from 3DBAG collection (CityJSON).
 * - getBuildingMetadata: fetches single-building detail from 3DBAG.
 *
 * 3DBAG API notes:
 *  - bbox queries require RD New (EPSG:28992) coordinates (no f=json param — use Accept header)
 *  - Single-item response: { feature: { CityObjects: { [bagId]: { attributes: {...} } } } }
 *  - Collection response features: [{ id, CityObjects: { [bagId]: { attributes } } }]
 *  - identificatie in PDOK is bare "0363100012165490"; in 3DBAG it's "NL.IMBAG.Pand.0363100012165490"
 */
import fetch from 'node-fetch';
import { wgs84BboxToRd } from '../utils/rdConvert';

const PDOK_WFS = 'https://service.pdok.nl/lv/bag/wfs/v2_0';
const THREEDBBAG = 'https://api.3dbag.nl/collections/pand';

export interface ThreeDBagMetadata {
  identificatie: string;
  oorspronkelijkbouwjaar: number | null;
  b3_h_dak_50p: number | null;
  b3_h_dak_max: number | null;
  b3_h_maaiveld: number | null;
  status: string | null;
  gebruiksdoel: string[] | null;
  oppervlaktemin: number | null;
  oppervlaktemax: number | null;
  documentdatum: string | null;
}

// ── Caches ──────────────────────────────────────────────────────────────────
const metaCache = new Map<string, { ts: number; data: ThreeDBagMetadata | null }>();
const bboxCache = new Map<string, { ts: number; data: object }>();
const ONE_HOUR = 3_600_000;
const FIVE_MIN = 300_000;

// ── Helpers ──────────────────────────────────────────────────────────────────

function attrsToMeta(bagId: string, attrs: Record<string, unknown>): ThreeDBagMetadata {
  return {
    identificatie: bagId,
    oorspronkelijkbouwjaar: (attrs['oorspronkelijkbouwjaar'] as number) ?? null,
    b3_h_dak_50p: (attrs['b3_h_dak_50p'] as number) ?? null,
    b3_h_dak_max: (attrs['b3_h_dak_max'] as number) ?? null,
    b3_h_maaiveld: (attrs['b3_h_maaiveld'] as number) ?? null,
    status: (attrs['status'] as string) ?? null,
    gebruiksdoel: (attrs['gebruiksdoel'] as string[]) ?? null,
    oppervlaktemin: (attrs['oppervlakte_min'] as number) ?? (attrs['oppervlaktemin'] as number) ?? null,
    oppervlaktemax: (attrs['oppervlakte_max'] as number) ?? (attrs['oppervlaktemax'] as number) ?? null,
    documentdatum: (attrs['documentdatum'] as string) ?? null,
  };
}

function bareId(bagId: string): string {
  return bagId.replace(/^NL\.IMBAG\.Pand\./, '');
}

type PdokFeature = {
  type: string;
  id: string;
  geometry: object;
  properties: Record<string, unknown>;
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch specific buildings from PDOK WFS by bare identificatie ID using a
 * tight 50 m radius bbox around the known project centroid.
 * We do this per-building because PDOK ignores CQL_FILTER for this layer.
 */
export async function getBuildingByIdNearPoint(
  bareId: string, lat: number, lng: number,
): Promise<PdokFeature | null> {
  const bbox = wgs84BboxToRd(lng - 0.0007, lat - 0.0004, lng + 0.0007, lat + 0.0004);
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
    const json = await res.json() as { features?: PdokFeature[] };
    return (json.features ?? []).find(
      f => String(f.properties['identificatie'] ?? '') === bareId,
    ) ?? null;
  } catch {
    return null;
  }}

/** Fetch multiple buildings by bareId+centroid, in parallel. */
export async function getBuildingsByIds(
  items: Array<{ bareId: string; lat: number; lng: number }>,
): Promise<PdokFeature[]> {
  if (!items.length) return [];
  const results = await Promise.all(items.map(({ bareId, lat, lng }) => getBuildingByIdNearPoint(bareId, lat, lng)));
  return results.filter((f): f is PdokFeature => f !== null);
}

export async function getBuildingMetadata(bagId: string): Promise<ThreeDBagMetadata | null> {
  const cached = metaCache.get(bagId);
  if (cached && Date.now() - cached.ts < ONE_HOUR) return cached.data;

  try {
    const url = `${THREEDBBAG}/items/${encodeURIComponent(bagId)}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/geo+json' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) { metaCache.set(bagId, { ts: Date.now(), data: null }); return null; }

    const json = await res.json() as {
      feature?: { CityObjects?: Record<string, { attributes: Record<string, unknown> }> };
    };

    const cityObjects = json.feature?.CityObjects;
    if (!cityObjects) { metaCache.set(bagId, { ts: Date.now(), data: null }); return null; }

    const attrs = cityObjects[bagId]?.attributes ?? {};
    const data = attrsToMeta(bagId, attrs);
    metaCache.set(bagId, { ts: Date.now(), data });
    return data;
  } catch {
    metaCache.set(bagId, { ts: Date.now(), data: null });
    return null;
  }
}

/**
 * Estimate roof height (m) from BAG attributes and polygon footprint.
 *
 * Strategy:
 *   estimated_floors = (unit_count × avg_unit_area) / footprint_area
 *   height           = floors × 3.0 m/floor + 1.0 m (floor slab)
 *
 * Clamped to [3, 60] m. Falls back to 8 m when geometry or counts are missing.
 */
function estimateHeight(properties: Record<string, unknown>, geometry: unknown): number {
  const unitCount = (properties['aantal_verblijfsobjecten'] as number) ?? 0;
  if (unitCount === 0) return 8;

  const minM2 = (properties['oppervlakte_min'] as number) ?? 0;
  const maxM2 = (properties['oppervlakte_max'] as number) ?? 0;
  const avgUnitM2 = minM2 > 0 && maxM2 > 0 ? (minM2 + maxM2) / 2 : minM2 || maxM2 || 60;

  // Compute footprint area from polygon coords (WGS84 → approximate metres at 52°N)
  const LAT_M = 111_320;
  const LNG_M = 68_500; // 111320 × cos(52°)

  const geo = geometry as { type: string; coordinates: number[][][] | number[][][][] } | null;
  if (!geo) return 8;

  let ring: number[][] | null = null;
  if (geo.type === 'Polygon') {
    ring = (geo.coordinates as number[][][])[0] ?? null;
  } else if (geo.type === 'MultiPolygon') {
    ring = ((geo.coordinates as number[][][][])[0]?.[0]) ?? null;
  }
  if (!ring || ring.length < 3) return 8;

  // Shoelace formula
  let area = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    area += x1 * LNG_M * y2 * LAT_M - x2 * LNG_M * y1 * LAT_M;
  }
  const footprintM2 = Math.abs(area / 2);
  if (footprintM2 < 10) return 8;

  const floors = Math.max(1, Math.round((unitCount * avgUnitM2) / footprintM2));
  return Math.min(60, Math.max(3, floors * 3.0 + 1.0));
}

/** Fetch building heights from 3DBAG bbox endpoint with a tight timeout.
 *  Returns a map of bare-id → { b3_h_dak_50p, b3_h_maaiveld }.
 *  Never throws — returns empty map on any failure or timeout. */
async function fetch3DBAGHeights(
  rdBbox: string,
): Promise<Record<string, { b3_h_dak_50p: number; b3_h_maaiveld: number }>> {
  // Strip the "EPSG:28992" suffix — 3DBAG expects plain "minx,miny,maxx,maxy"
  // and its default bbox-crs is already EPSG:28992 (RD New).
  const plain = rdBbox.replace(/,EPSG:\d+$/, '');
  const url = `${THREEDBBAG}/items?bbox=${plain}&limit=500`;

  type ThreeDBagItem = {
    id?: string;
    CityObjects?: Record<string, { attributes?: Record<string, unknown> }>;
  };

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/city+json, application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return {};

    const json = await res.json() as { features?: ThreeDBagItem[] };
    const out: Record<string, { b3_h_dak_50p: number; b3_h_maaiveld: number }> = {};

    for (const item of json.features ?? []) {
      if (!item.CityObjects) continue;
      for (const [fullId, obj] of Object.entries(item.CityObjects)) {
        const attrs = obj.attributes ?? {};
        const dak = attrs['b3_h_dak_50p'] as number | undefined;
        const maai = attrs['b3_h_maaiveld'] as number | undefined;
        if (dak == null) continue;
        const bare = bareId(fullId);
        out[bare] = {
          b3_h_dak_50p: dak,
          b3_h_maaiveld: maai ?? 0,
        };
      }
    }
    return out;
  } catch {
    return {};
  }
}

export async function getBuildingsInBbox(
  minLng: number, minLat: number,
  maxLng: number, maxLat: number,
): Promise<object> {
  const cacheKey = `${minLng.toFixed(4)},${minLat.toFixed(4)},${maxLng.toFixed(4)},${maxLat.toFixed(4)}`;
  const cached = bboxCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < FIVE_MIN) return cached.data;

  const rdBbox = wgs84BboxToRd(minLng, minLat, maxLng, maxLat);

  // Paginate 2× in parallel — tile-sized areas fit in one page, larger areas need two
  const makePdokPage = (startIndex: number): Promise<PdokFeature[]> => {
    const p = new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeName: 'bag:pand',
      outputFormat: 'application/json',
      count: '500',
      STARTINDEX: String(startIndex),
      bbox: rdBbox,
      srsName: 'EPSG:4326',
    });
    return fetch(`${PDOK_WFS}?${p}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(12000),
    }).then(r => r.ok ? r.json() as Promise<{ features?: PdokFeature[] }> : { features: [] as PdokFeature[] })
      .then(j => (j as { features?: PdokFeature[] }).features ?? [])
      .catch(() => [] as PdokFeature[]);
  };

  let pdokFeatures: PdokFeature[] = [];

  // Run PDOK (authoritative footprints) and 3DBAG heights in parallel.
  // 3DBAG has a 4 s timeout — if it's slow or down we fall back to 8 m defaults.
  let heightMap: Record<string, { b3_h_dak_50p: number; b3_h_maaiveld: number }> = {};

  try {
    const [page0, page1, heights] = await Promise.all([
      makePdokPage(0),
      makePdokPage(500),
      fetch3DBAGHeights(rdBbox),
    ]);
    heightMap = heights;
    const seen = new Set<string>();
    for (const f of [...page0, ...page1]) {
      const id = String(f.properties['identificatie'] ?? '');
      if (id && !seen.has(id)) { seen.add(id); pdokFeatures.push(f); }
    }
  } catch {
    const empty = { type: 'FeatureCollection', features: [] };
    bboxCache.set(cacheKey, { ts: Date.now(), data: empty });
    return empty;
  }

  // Merge footprints with heights.
  // Priority: 3DBAG LiDAR height (when available) > BAG-derived estimate > 8 m flat.
  const features = pdokFeatures.map(f => {
    const id = String(f.properties['identificatie'] ?? '');
    const h = heightMap[id];
    const estimatedHeight = h?.b3_h_dak_50p ?? estimateHeight(f.properties, f.geometry);
    return {
      ...f,
      properties: {
        ...f.properties,
        identificatie: `NL.IMBAG.Pand.${id}`,
        b3_h_dak_50p: estimatedHeight,
        b3_h_maaiveld: h?.b3_h_maaiveld ?? 0,
      },
    };
  });

  const result = { type: 'FeatureCollection', features };
  bboxCache.set(cacheKey, { ts: Date.now(), data: result });
  return result;
}
