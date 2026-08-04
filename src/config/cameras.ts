export interface CameraPos {
  height: number;
  pitch: number;
  heading: number;
  lat?: number; // override project lat if needed
  lng?: number; // override project lng if needed
}

export const PROJECT_CAMERAS: Record<number, CameraPos> = {
  1:  { lat: 52.346889, lng: 4.908618, height: 201.9, pitch: -41.9, heading: 33.8  },
  3:  { lat: 52.369922, lng: 4.865728, height: 116.2, pitch: -31,   heading: 350.9 },
  8:  { lat: 52.383375, lng: 4.888191, height: 87.3,  pitch: -23.2, heading: 301.6 },
  13: { lat: 52.389411, lng: 4.887388, height: 350.8, pitch: -38.6, heading: 49.6  },
  15: { lat: 52.381454, lng: 4.864632, height: 306.5, pitch: -34.3, heading: 269.6 },
  16: { lat: 52.367204, lng: 4.861306, height: 159.4, pitch: -47.7, heading: 161.6 },
  19: { lat: 52.371894, lng: 4.881459, height: 120.3, pitch: -40,   heading: 318.4 },
  20: { lat: 52.366379, lng: 4.91143,  height: 77.6,  pitch: -27,   heading: 358.3 },
  22: { lat: 52.26378,  lng: 6.830387, height: 196.8, pitch: -25,   heading: 360   }, // Kasbah
  24: { lat: 52.352994, lng: 4.820473, height: 199.8, pitch: -27.6, heading: 54.7  },
  25: { lat: 52.350731, lng: 5.014928, height: 134.7, pitch: -42.6, heading: 193.7 },
  27: { lat: 52.364665, lng: 4.905244, height: 149.9, pitch: -39.1, heading: 24.9  }, // Weesperflat
  29: { lat: 51.982821, lng: 4.362383, height: 150,   pitch: -55,   heading: 326.6 },
  37: { lat: 52.327942, lng: 4.980395, height: 286.3, pitch: -30.7, heading: 241.8 }, // Groenhoven
};
