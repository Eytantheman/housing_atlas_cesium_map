import fs from 'fs';
import path from 'path';

export interface Project {
  id: number;
  name: string;
  lat: number | null;
  lng: number | null;
  city: string;
  architect: string;
  era: string;
  social_org: string | null;
  scale: string | null;
  note: string | null;
  bag_id: string | null;
  description: string;
}

const dataPath = path.join(__dirname, '../../data/housing-atlas.json');
const projects: Project[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectById(id: number): Project | undefined {
  return projects.find(p => p.id === id);
}

export function filterProjects(params: {
  city?: string;
  era?: string;
  social_org?: string;
  q?: string;
}): Project[] {
  return projects.filter(p => {
    if (params.city && !p.city.toLowerCase().includes(params.city.toLowerCase())) return false;
    if (params.era && !p.era.toLowerCase().includes(params.era.toLowerCase())) return false;
    if (params.social_org && !(p.social_org ?? '').toLowerCase().includes(params.social_org.toLowerCase())) return false;
    if (params.q) {
      const q = params.q.toLowerCase();
      const searchable = `${p.name} ${p.architect} ${p.social_org ?? ''}`.toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
}

export function toGeoJSON(ps: Project[]): { type: 'FeatureCollection'; features: object[] } {
  return {
    type: 'FeatureCollection',
    features: ps
      .filter(p => p.lat !== null && p.lng !== null)
      .map(p => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
        properties: p,
      })),
  };
}

export function getBagIdMap(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const p of projects) {
    if (p.bag_id) map[p.bag_id] = p.id;
  }
  return map;
}
