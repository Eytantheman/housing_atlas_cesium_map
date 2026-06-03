import type { Era } from '../types';

export function getEraColor(era: Era): string {
  const map: Record<Era, string> = {
    '1921-1930': 'var(--era-1921)',
    '1941-1950': 'var(--era-1941)',
    '1951-1960': 'var(--era-1951)',
    '1961-1970': 'var(--era-1961)',
    '1971-1980': 'var(--era-1971)',
    '1981-1990': 'var(--era-1981)',
    '1991-2000': 'var(--era-1991)',
    '2001-2010': 'var(--era-2001)',
    '2011-2020': 'var(--era-2011)',
    '2021-2030': 'var(--era-2021)',
  };
  return map[era] ?? '#888';
}

export function getEraColorHex(era: Era): string {
  const map: Record<Era, string> = {
    '1921-1930': '#8B5E3C',
    '1941-1950': '#C4893A',
    '1951-1960': '#D4A820',
    '1961-1970': '#7A9E3B',
    '1971-1980': '#2E8B57',
    '1981-1990': '#3A6FD8',
    '1991-2000': '#8A52C8',
    '2001-2010': '#E05A3A',
    '2011-2020': '#C4186A',
    '2021-2030': '#00A8B0',
  };
  return map[era] ?? '#888888';
}

export function getMarkerSize(scale: string | null): string {
  const map: Record<string, string> = {
    'null':    'var(--map-marker-base-size)',
    '21-50':   'var(--map-marker-sm-size)',
    '51-100':  'var(--map-marker-md-size)',
    '101-200': 'var(--map-marker-lg-size)',
    '>201':    'var(--map-marker-xl-size)',
  };
  return map[scale ?? 'null'] ?? 'var(--map-marker-base-size)';
}
