import fs from 'fs';
import path from 'path';

const splatsPath = path.join(__dirname, '../../data/splats-index.json');

export function getSplatUrl(projectId: number): string | null {
  try {
    const index = JSON.parse(fs.readFileSync(splatsPath, 'utf-8'));
    return index[String(projectId)] ?? null;
  } catch {
    return null;
  }
}
