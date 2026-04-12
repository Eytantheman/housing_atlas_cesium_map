/**
 * Architecture tour definitions — ordered project ID sequences per city.
 * Order follows a logical walking/cycling route through the streets.
 */

export interface CityView {
  lat: number;
  lng: number;
  zoom: number;
  pitch: number;
}

export const CITY_VIEWS: Record<string, CityView> = {
  Amsterdam:    { lat: 52.372, lng: 4.875, zoom: 13,   pitch: 45 },
  Rotterdam:    { lat: 51.910, lng: 4.475, zoom: 13,   pitch: 45 },
  Arnhem:       { lat: 51.991, lng: 5.879, zoom: 15.5, pitch: 35 },
  Delft:        { lat: 51.983, lng: 4.361, zoom: 15.5, pitch: 35 },
  'Den Dolder': { lat: 52.144, lng: 5.245, zoom: 15.5, pitch: 35 },
  Hengelo:      { lat: 52.266, lng: 6.829, zoom: 15.5, pitch: 35 },
  Mamelis:      { lat: 50.801, lng: 5.972, zoom: 15.5, pitch: 35 },
};

/**
 * Ordered project IDs forming a street-logical tour route.
 * Amsterdam: west → centre → east along main canal belt and ring roads.
 * Rotterdam: anti-clockwise loop from Pendrecht through the port and inner city.
 */
export const CITY_TOURS: Record<string, number[]> = {
  // De Drie Hoven → Het SchetsBlok → Orteliusstraat → Buurtfabriek →
  // Oranjehof singles → Tetterode → Rozenstraat → Landlust →
  // Spaarndammerhart → Nieuwe Houttuinen → Silodam →
  // Weesperflat → Hubertushuis → Pieter Vlamingstraat →
  // Ringdijk → Holendrechtstraat → De Warren
  Amsterdam: [24, 17, 2, 16, 3, 23, 19, 15, 18, 8, 13, 27, 20, 11, 12, 1, 25],

  // Mediterranean → Delfshaven → Block Dock → Kruisplein →
  // Touwslagersstraat → Zonnetrap
  Rotterdam: [14, 4, 9, 10, 5, 7],
};
