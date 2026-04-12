import fetch from 'node-fetch';

interface CacheEntry { ts: number; data: RijksObject[] }
interface RijksObject {
  objectNumber: string;
  title: string;
  dating: { presentingDate: string };
  webImage: { url: string } | null;
}

const cache = new Map<string, CacheEntry>();
const ONE_HOUR = 3600_000;

export async function searchArchive(projectName: string, architect: string): Promise<RijksObject[]> {
  const key = process.env.RIJKSMUSEUM_API_KEY;
  if (!key) return [];

  const q = `${projectName.split(' ')[0]} ${architect.split(',')[0].split(' ').pop()}`;
  const cacheKey = q;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < ONE_HOUR) return cached.data;

  try {
    const url = `https://www.rijksmuseum.nl/api/nl/collection?key=${key}&q=${encodeURIComponent(q)}&imgonly=True&ps=5`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json() as { artObjects: RijksObject[] };
    const data = json.artObjects ?? [];
    cache.set(cacheKey, { ts: Date.now(), data });
    return data;
  } catch {
    return [];
  }
}
