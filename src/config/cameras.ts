export interface CameraPos {
  height: number;
  pitch: number;
  heading: number;
  lat?: number; // override project lat if needed
  lng?: number; // override project lng if needed
  focusRadius?: number; // metres of colour around the project in the greyscale model (default FOCUS_RADIUS)
}

/** Default radius (m) of the coloured area around a selected project */
export const FOCUS_RADIUS = 180;

export const PROJECT_CAMERAS: Record<number, CameraPos> = {
  1:  { lat: 52.34765,  lng: 4.908561, height: 131.7, pitch: -38.1, heading: 48.1  },
  3:  { lat: 52.37087,  lng: 4.864007, height: 129.1, pitch: -44.8, heading: 90.1  },
  4:  { lat: 51.920617, lng: 4.454327, height: 180.2, pitch: -34.1, heading: 52.5  },
  6:  { lat: 51.87751,  lng: 4.466106, height: 133.4, pitch: -37.6, heading: 244.2 },
  7:  { lat: 51.876733, lng: 4.521149, height: 191,   pitch: -35.6, heading: 47.9  },
  8:  { lat: 52.383401, lng: 4.888306, height: 150.5, pitch: -41.7, heading: 287.1 },
  9:  { lat: 51.920491, lng: 4.474765, height: 172.1, pitch: -46,   heading: 279   },
  10: { lat: 51.920373, lng: 4.472551, height: 179,   pitch: -35.5, heading: 317.2 },
  13: { lat: 52.390913, lng: 4.888747, height: 128.8, pitch: -19.4, heading: 48    },
  14: { lat: 51.911875, lng: 4.437527, height: 194.1, pitch: -40,   heading: 165.2 },
  15: { lat: 52.381124, lng: 4.862129, height: 270.2, pitch: -42.3, heading: 266   },
  16: { lat: 52.366697, lng: 4.861269, height: 114.6, pitch: -37.9, heading: 119.9 },
  18: { lat: 52.38882,  lng: 4.875486, height: 236.6, pitch: -41.4, heading: 3.2   },
  19: { lat: 52.371942, lng: 4.881171, height: 114.2, pitch: -43.7, heading: 307.5 },
  20: { lat: 52.366322, lng: 4.911294, height: 106.4, pitch: -42.8, heading: 13.9  },
  21: { lat: 50.799168, lng: 5.973616, height: 423.3, pitch: -41.2, heading: 351.4 },
  22: { lat: 52.263867, lng: 6.831752, height: 275,   pitch: -35.8, heading: 345.1 }, // Kasbah
  23: { lat: 52.367922, lng: 4.871525, height: 108.6, pitch: -36.9, heading: 106.3 },
  24: { lat: 52.356283, lng: 4.825886, height: 163.9, pitch: -25.5, heading: 244.7 },
  25: { lat: 52.350044, lng: 5.015604, height: 141.1, pitch: -38.8, heading: 280.6 },
  26: { lat: 51.988996, lng: 5.88238,  height: 364.3, pitch: -42.8, heading: 349.4 },
  27: { lat: 52.3646,   lng: 4.905027, height: 136.3, pitch: -31,   heading: 29.2  }, // Weesperflat
  28: { lat: 52.146625, lng: 5.247016, height: 288.2, pitch: -48.1, heading: 345.1 },
  29: { lat: 51.982682, lng: 4.363008, height: 188.1, pitch: -48.6, heading: 320.6 },
  30: { lat: 52.368114, lng: 4.901747, height: 146.6, pitch: -46.4, heading: 15.4  },
  31: { lat: 52.36961,  lng: 4.901898, height: 145.7, pitch: -44.2, heading: 291.6 },
  32: { lat: 52.386499, lng: 4.888157, height: 100.4, pitch: -37.5, heading: 122.4 },
  33: { lat: 52.386584, lng: 4.887011, height: 125.7, pitch: -35.5, heading: 40.5  },
  34: { lat: 52.369345, lng: 4.895285, height: 179.8, pitch: -48.9, heading: 225.6 },
  35: { lat: 51.918094, lng: 4.493509, height: 224.9, pitch: -36.1, heading: 349.8 },
  36: { lat: 52.381197, lng: 4.884559, height: 127,   pitch: -48.6, heading: 302.1 }, // Palmdwarsstraat
  37: { lat: 52.326545, lng: 4.979383, height: 207.4, pitch: -30.7, heading: 241.8, focusRadius: 240 }, // Groenhoven (8 towers, ~470 m across)
};
