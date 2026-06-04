export interface CameraPos {
  height: number;
  pitch: number;
  heading: number;
  lat?: number; // override project lat if needed
  lng?: number; // override project lng if needed
}

export const PROJECT_CAMERAS: Record<number, CameraPos> = {
  22: { lat: 52.26378,   lng: 6.830387, height: 196.8, pitch: -25,   heading: 360   }, // Kasbah
  8:  { lat: 52.383889,  lng: 4.888074, height: 160.1, pitch: -44.9, heading: 263.5 }, // Nieuwe Houttuinen
  13: { lat: 52.389411, lng: 4.887388, height: 350.8, pitch: -38.6, heading: 49.6 },
  20: { lat: 52.366018,  lng: 4.91137,  height: 101,   pitch: -27,   heading: 358.3 },
  27: { lat: 52.364665, lng: 4.905244, height: 149.9, pitch: -39.1, heading: 24.9 }, // Weesperflat
};
