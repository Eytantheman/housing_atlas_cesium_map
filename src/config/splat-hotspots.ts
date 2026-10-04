export interface SplatHotspot {
  id: string;
  projectId: number; // project whose panel lists the scan (keyboard / screen-reader way in)
  title: string;
  content: string;   // .sog scene in /public, e.g. '/splats/groenhoven/bijlmer04.sog'
  settings: string;  // SuperSplat viewer settings.json (start camera, background, …)
  lat: number;
  lng: number;
  height: number;    // pin foot height (meters above ellipsoid) — Shift+click the facade in dev to get it
}

const query = (h: SplatHotspot) =>
  `content=${encodeURIComponent(h.content)}&settings=${encodeURIComponent(h.settings)}`;

/** The atlas embed of the self-hosted SuperSplat viewer (public/splat-viewer, v1.37.0): no viewer UI. */
export const splatEmbedUrl = (h: SplatHotspot) => `/splat-viewer/embed.html?${query(h)}`;
/** The full SuperSplat viewer with its own controls, for "New tab". */
export const splatViewerUrl = (h: SplatHotspot) => `/splat-viewer/index.html?noanim&${query(h)}`;

export interface SplatOpenDetail {
  id: string;
  at?: { x: number; y: number }; // screen point of the clicked pin, kept clear by the window
}
export const openSplat = (detail: SplatOpenDetail) =>
  window.dispatchEvent(new CustomEvent<SplatOpenDetail>('cesium:splat-open', { detail }));

export const SPLAT_HOTSPOTS: SplatHotspot[] = [
  {
    id: 'groenhoven-interior',
    projectId: 37,
    title: 'Groenhoven interior',
    content: '/splats/groenhoven/bijlmer04.sog',
    settings: '/splats/groenhoven/settings.json',
    lat: 52.326302,
    lng: 4.976538,
    height: 44.4,
  },
];
