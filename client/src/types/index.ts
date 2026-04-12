export type Era =
  | '1921-1930' | '1941-1950' | '1951-1960' | '1961-1970' | '1971-1980'
  | '1981-1990' | '1991-2000' | '2001-2010' | '2011-2020' | '2021-2030';

export type Scale = '21-50' | '51-100' | '101-200' | '>201' | null;

export interface HousingProject {
  id: number;
  name: string;
  lat: number | null;
  lng: number | null;
  city: string;
  architect: string;
  era: Era;
  social_org: string | null;
  scale: Scale;
  note: string | null;
  bag_id: string | null;
  description: string;
}

export interface ProjectFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: HousingProject;
}

export interface ProjectFeatureCollection {
  type: 'FeatureCollection';
  features: ProjectFeature[];
}

export interface RijksmuseumObject {
  objectNumber: string;
  title: string;
  dating: { presentingDate: string };
  webImage: { url: string } | null;
}

export interface FilterState {
  eras: Era[];
  cities: string[];
  socialOrg: string;
  searchQuery: string;
}

export interface ThreeDBagMetadata {
  identificatie: string;
  oorspronkelijkbouwjaar: number | null;
  b3_h_dak_50p: number | null;
  b3_h_dak_max: number | null;
  b3_h_maaiveld: number | null;
  status: string | null;
  gebruiksdoel: string[] | null;
  oppervlaktemin: number | null;
  oppervlaktemax: number | null;
  documentdatum: string | null;
}

export interface BuildingSelection {
  threeDBAG: ThreeDBagMetadata;
  atlasProject: HousingProject | null;
}
