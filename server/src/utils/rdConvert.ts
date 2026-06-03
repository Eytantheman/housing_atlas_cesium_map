/**
 * WGS84 (lat, lng) → RD New (EPSG:28992) [x, y]
 * Based on the official Dutch Kadaster series expansion.
 * Accurate to ~0.1 m within the Netherlands.
 */
export function wgs84ToRd(lat: number, lng: number): [number, number] {
  const phi0 = 52.15517440;
  const lam0 = 5.38720621;
  const dphi = 0.36 * (lat - phi0);
  const dlam = 0.36 * (lng - lam0);

  // Coefficients for x (Easting)
  const Rpq: Array<[number, number, number]> = [
    [0, 1, 190094.945],
    [2, 0, -11832.228],
    [0, 2, -114.221],
    [2, 1, -32.391],
    [0, 3, -0.705],
    [2, 2, -2.340],
    [1, 0, -0.608],
    [4, 0, -0.008],
    [2, 3, 0.148],
    [4, 1, 0.022],
    [1, 1, -0.022],
  ];

  // Coefficients for y (Northing)
  const Spq: Array<[number, number, number]> = [
    [1, 0, 309056.544],
    [1, 1, 3638.893],
    [1, 2, 73.077],
    [3, 0, -157.984],
    [1, 3, 59.788],
    [3, 1, 0.433],
    [0, 1, -6.439],
    [3, 2, -0.032],
    [1, 4, 0.092],
    [0, 2, -0.054],
    [2, 0, -0.055],
  ];

  let x = 0;
  let y = 0;
  for (const [p, q, c] of Rpq) x += c * Math.pow(dphi, p) * Math.pow(dlam, q);
  for (const [p, q, c] of Spq) y += c * Math.pow(dphi, p) * Math.pow(dlam, q);

  return [155000 + x, 463000 + y];
}

/**
 * Returns an RD New bbox string "minX,minY,maxX,maxY,EPSG:28992"
 * given a WGS84 bounding box.
 */
export function wgs84BboxToRd(
  minLng: number, minLat: number,
  maxLng: number, maxLat: number,
): string {
  const [x0, y0] = wgs84ToRd(minLat, minLng);
  const [x1, y1] = wgs84ToRd(maxLat, maxLng);
  return `${Math.min(x0, x1)},${Math.min(y0, y1)},${Math.max(x0, x1)},${Math.max(y0, y1)},EPSG:28992`;
}
