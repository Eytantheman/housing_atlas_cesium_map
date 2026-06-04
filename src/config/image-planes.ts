export interface ImagePlane {
  id: string;
  imageUrl: string;   // path in /public (e.g. '/drawings/plan.png') or absolute URL
  lat: number;        // center latitude
  lng: number;        // center longitude
  height: number;     // center height above ellipsoid (meters)
  heading: number;    // degrees clockwise from north
                      //   facade: which direction the plane faces (0=N, 90=E, 180=S, 270=W)
                      //   plan:   which edge of the image points north (0 = top of image = north)
  widthM: number;     // plane width in meters
  heightM: number;    // plane height in meters (vertical extent for facades; depth for plans)
  type: 'facade' | 'plan'; // facade = vertical plane, plan = horizontal plane
  opacity?: number;   // 0–1, default 1
}

export const IMAGE_PLANES: ImagePlane[] = [
  {
    id: 'silodam-elevation',
    imageUrl: '/drawings/silodam-elevation.webp',
    lat: 52.392416,   // shifted 1 m outward (heading 255°) from facade
    lng: 4.890433,
    height: 58,       // ground ≈ 42m ellipsoid + half building height (32m / 2)
    heading: 255,     // SW-facing — perpendicular to the NW→SE facade, toward IJ/camera
    widthM: 149.5,    // 130 × 1.15
    heightM: 36.8,    // 32 × 1.15
    type: 'facade',
    opacity: 0.9,
  },
];
