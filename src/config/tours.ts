export interface CityView {
  lat: number;
  lng: number;
  height: number; // camera height in metres above ground
  pitch: number;  // degrees from horizontal (0 = horizontal, -90 = straight down)
}

export const CITY_VIEWS: Record<string, CityView> = {
  Amsterdam:    { lat: 52.372, lng: 4.875, height: 2500, pitch: -45 },
  Rotterdam:    { lat: 51.910, lng: 4.475, height: 2500, pitch: -45 },
  Arnhem:       { lat: 51.991, lng: 5.879, height: 600,  pitch: -35 },
  Delft:        { lat: 51.983, lng: 4.361, height: 600,  pitch: -35 },
  'Den Dolder': { lat: 52.144, lng: 5.245, height: 600,  pitch: -35 },
  Hengelo:      { lat: 52.266, lng: 6.829, height: 600,  pitch: -35 },
  Mamelis:      { lat: 50.801, lng: 5.972, height: 600,  pitch: -35 },
};

export const CITY_TOURS: Record<string, number[]> = {
  Amsterdam: [24, 17, 2, 16, 3, 23, 19, 15, 18, 8, 13, 27, 20, 11, 12, 1, 25],
  Rotterdam:  [14, 4, 9, 10, 5, 7],
};
