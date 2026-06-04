export interface VideoHotspot {
  id: string;
  videoSrc: string;  // path in /public, e.g. '/videos/nieuwe-houttuinen.mp4'
  lat: number;
  lng: number;
  height: number;   // center height of the frame (meters above ellipsoid)
  heading: number;  // degrees clockwise from north — which direction the frame faces
  widthM: number;   // frame width in meters
  heightM: number;  // frame height in meters
}

export const VIDEO_HOTSPOTS: VideoHotspot[] = [
  {
    id: 'nieuwe-houttuinen',
    videoSrc: '/videos/nieuwe-houttuinen.mp4',
    lat: 52.392291,
    lng: 4.890288,
    height: 56,
    heading: 90,    // east-facing — adjust if needed
    widthM: 15,
    heightM: 10,
  },
];
