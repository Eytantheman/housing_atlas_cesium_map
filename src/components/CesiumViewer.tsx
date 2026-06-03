import { useEffect, useRef } from 'react';
import type { HousingProject } from '../types';

// Cesium is loaded via CDN script tag — access the global
declare const Cesium: typeof import('cesium');

const ACCENT = '#C4623A';

export interface FlyTarget {
  lat: number;
  lng: number;
  height?: number;
  pitch?: number;
  heading?: number;
  id: number;
}

interface Props {
  projects: HousingProject[];
  tourProjects: HousingProject[];
  flyToTarget: FlyTarget | null;
  onProjectSelect: (p: HousingProject) => void;
}

export function CesiumViewer({ projects, tourProjects, flyToTarget, onProjectSelect }: Props) {
  const containerRef   = useRef<HTMLDivElement>(null);
  const viewerRef      = useRef<any>(null);
  const tilesetRef     = useRef<any>(null);
  const tourPolyRef    = useRef<any>(null);
  const markerEntities = useRef<any[]>([]);

  // ── Initialise viewer once ───────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN as string;

    const viewer = new Cesium.Viewer(containerRef.current, {
      animation:            false,
      baseLayerPicker:      false,
      fullscreenButton:     false,
      geocoder:             false,
      homeButton:           false,
      infoBox:              false,
      navigationHelpButton: false,
      sceneModePicker:      false,
      selectionIndicator:   false,
      timeline:             false,
      creditContainer:      document.createElement('div'),
      imageryProvider:      false as any,
    });

    viewer.scene.skyBox.show          = false;
    viewer.scene.backgroundColor      = Cesium.Color.BLACK;
    viewer.scene.globe.show           = false;
    viewer.scene.fog.enabled          = false;
    viewer.scene.skyAtmosphere.show   = false;

    viewerRef.current = viewer;

    // ── Google Photorealistic 3D Tiles ────────────────────────────────────
    Cesium.Cesium3DTileset.fromIonAssetId(2275207, { showCreditsOnScreen: true })
    .then((tileset: any) => {
      tilesetRef.current = tileset;
      viewer.scene.primitives.add(tileset);

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(4.895, 52.370, 1800),
        orientation: {
          heading: Cesium.Math.toRadians(-10),
          pitch:   Cesium.Math.toRadians(-35),
          roll:    0,
        },
        duration: 0,
      });
    }).catch((e: any) => console.error('Google 3D Tiles failed:', e));

    // ── Bearing events ────────────────────────────────────────────────────
    viewer.scene.postRender.addEventListener(() => {
      const h = Cesium.Math.toDegrees(viewer.camera.heading);
      window.dispatchEvent(new CustomEvent('cesium:bearing', { detail: h }));
    });

    // ── Camera capture (press C) ──────────────────────────────────────────
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'c' && e.key !== 'C') return;
      const cam = viewer.camera;
      const carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cam.positionWC);
      const result = {
        lat:     parseFloat(Cesium.Math.toDegrees(carto.latitude).toFixed(6)),
        lng:     parseFloat(Cesium.Math.toDegrees(carto.longitude).toFixed(6)),
        height:  parseFloat(carto.height.toFixed(1)),
        heading: parseFloat(Cesium.Math.toDegrees(cam.heading).toFixed(1)),
        pitch:   parseFloat(Cesium.Math.toDegrees(cam.pitch).toFixed(1)),
      };
      console.log('📷 Camera:', JSON.stringify(result));
      window.dispatchEvent(new CustomEvent('cesium:capture', { detail: result }));
    };
    window.addEventListener('keydown', onKeyDown);

    // ── North reset ───────────────────────────────────────────────────────
    const onReset = () => {
      viewer.camera.flyTo({
        destination: viewer.camera.positionWC,
        orientation: { heading: 0, pitch: viewer.camera.pitch, roll: 0 },
        duration: 0.6,
      });
    };
    window.addEventListener('cesium:reset-north', onReset);

    // ── Click handler ─────────────────────────────────────────────────────
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click: any) => {
      const picked = viewer.scene.pick(click.position);
      if (picked?.id instanceof Cesium.Entity) {
        const proj = picked.id.properties?.getValue(Cesium.JulianDate.now())?.project as HousingProject | undefined;
        if (proj) onProjectSelect(proj);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('cesium:reset-north', onReset);
      if (!viewer.isDestroyed()) viewer.destroy();
      viewerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync project markers ─────────────────────────────────────────────────
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    for (const e of markerEntities.current) viewer.entities.remove(e);
    markerEntities.current = [];

    for (const p of projects) {
      if (p.lat == null || p.lng == null) continue;
      const entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(p.lng, p.lat, 2),
        properties: { project: p },
        billboard: {
          image: makeLabelCanvas(p.id),
          verticalOrigin:           Cesium.VerticalOrigin.BOTTOM,
          heightReference:          Cesium.HeightReference.RELATIVE_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scale: 1,
        },
      });
      markerEntities.current.push(entity);
    }
  }, [projects]);

  // ── Sync tour route polyline ─────────────────────────────────────────────
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (tourPolyRef.current) { viewer.entities.remove(tourPolyRef.current); tourPolyRef.current = null; }
    if (tourProjects.length < 2) return;

    const positions = tourProjects
      .filter((p: HousingProject) => p.lat != null && p.lng != null)
      .flatMap((p: HousingProject) => [p.lng!, p.lat!, 5]);

    tourPolyRef.current = viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
        width: 3,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.fromCssColorString(ACCENT),
          dashLength: 24,
        }),
        clampToGround: false,
        arcType: Cesium.ArcType.NONE,
      },
    });
  }, [tourProjects]);

  // ── Fly to target ────────────────────────────────────────────────────────
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !flyToTarget) return;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(flyToTarget.lng, flyToTarget.lat, flyToTarget.height ?? 300),
      orientation: {
        heading: Cesium.Math.toRadians(flyToTarget.heading ?? 0),
        pitch:   Cesium.Math.toRadians(flyToTarget.pitch ?? -25),
        roll:    0,
      },
      duration: 3.5,
      easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
    });
  }, [flyToTarget]);

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />;
}

function makeLabelCanvas(id: number): HTMLCanvasElement {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
  ctx.fillStyle = ACCENT;
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = `bold ${id > 9 ? 11 : 13}px system-ui`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(id), size / 2, size / 2 + 0.5);
  return canvas;
}
