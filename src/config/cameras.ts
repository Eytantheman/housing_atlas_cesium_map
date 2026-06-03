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
  13: { lat: 52.391982,  lng: 4.895683, height: 263.9, pitch: -31.9, heading: 281.6 },
  20: { lat: 52.366018,  lng: 4.91137,  height: 101,   pitch: -27,   heading: 358.3 },
  27: { lat: 52.362898,  lng: 4.905787, height: 206,   pitch: -39.1, heading: 24.9  }, // Weesperflat
};
