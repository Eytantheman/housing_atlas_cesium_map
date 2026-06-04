import { useEffect, useRef } from 'react';
import type { HousingProject } from '../types';
import { IMAGE_PLANES } from '../config/image-planes';
import { VIDEO_HOTSPOTS } from '../config/video-hotspots';

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
  showImagePlanes: boolean;
}

export function CesiumViewer({ projects, tourProjects, flyToTarget, onProjectSelect, showImagePlanes }: Props) {
  const containerRef      = useRef<HTMLDivElement>(null);
  const viewerRef         = useRef<any>(null);
  const tilesetRef        = useRef<any>(null);
  const tourPolyRef       = useRef<any>(null);
  const imagePlaneEntities = useRef<any[]>([]);

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
      // @ts-expect-error: imageryProvider:false disables the default imagery layer
      imageryProvider:      false,
    });

    viewer.scene.skyBox.show          = false;
    viewer.scene.backgroundColor      = Cesium.Color.BLACK;
    viewer.scene.globe.show           = false;
    viewer.scene.fog.enabled          = false;
    viewer.scene.skyAtmosphere.show   = false;

    viewerRef.current = viewer;

    // ── Image planes (architectural drawings) ────────────────────────────────
    for (const p of IMAGE_PLANES) {
      const pos = Cesium.Cartesian3.fromDegrees(p.lng, p.lat, p.height);
      const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(p.heading), 0, 0);
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(pos, hpr);
      // facade: UNIT_Y = faces heading direction (vertical plane)
      // plan:   UNIT_Z = faces up (horizontal plane)
      const normal = p.type === 'plan' ? Cesium.Cartesian3.UNIT_Z : Cesium.Cartesian3.UNIT_Y;
      const ent = viewer.entities.add({
        id: `image-plane-${p.id}`,
        position: pos,
        orientation,
        plane: {
          plane: new Cesium.Plane(normal, 0),
          dimensions: new Cesium.Cartesian2(p.widthM, p.heightM),
          material: new Cesium.ImageMaterialProperty({
            image: p.imageUrl,
            transparent: true,
            color: new Cesium.Color(1, 1, 1, p.opacity ?? 1),
          }),
          outline: false,
        },
      });
      imagePlaneEntities.current.push(ent);
    }

    // ── Video hotspots (red frame in 3D, hover → video overlay) ─────────────
    const videoEntities: Record<string, any> = {};
    for (const h of VIDEO_HOTSPOTS) {
      const pos = Cesium.Cartesian3.fromDegrees(h.lng, h.lat, h.height);
      const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(h.heading), 0, 0);
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(pos, hpr);
      videoEntities[h.id] = viewer.entities.add({
        id: `video-hotspot-${h.id}`,
        position: pos,
        orientation,
        plane: {
          plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0),
          dimensions: new Cesium.Cartesian2(h.widthM, h.heightM),
          material: Cesium.Color.RED.withAlpha(0.12),
          outline: true,
          outlineColor: Cesium.Color.RED,
        },
      });

      // Perpendicular line from frame center, 10 m in the facing direction
      const transform = Cesium.Transforms.headingPitchRollToFixedFrame(pos, hpr);
      const fwd = Cesium.Matrix4.multiplyByPointAsVector(
        transform, new Cesium.Cartesian3(0, 1, 0), new Cesium.Cartesian3()
      );
      const lineEnd = Cesium.Cartesian3.add(
        pos,
        Cesium.Cartesian3.multiplyByScalar(fwd, 200, new Cesium.Cartesian3()),
        new Cesium.Cartesian3()
      );
      viewer.entities.add({
        polyline: {
          positions: [pos, lineEnd],
          width: 2,
          material: Cesium.Color.RED,
          arcType: Cesium.ArcType.NONE,
        },
      });
    }

    // ── Cesium Ion (asset 2275207 = Google Photorealistic 3D Tiles, works in EEA) ──
    // NOTE: Direct Google Maps Tiles API is blocked in the EEA (Netherlands).
    // Cesium Ion proxies the same tiles without the regional restriction.
    Cesium.Cesium3DTileset.fromIonAssetId(2275207, { showCreditsOnScreen: true })
    .then((tileset: any) => {
      tilesetRef.current = tileset;
      viewer.scene.primitives.add(tileset);
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(5.9836, 51.652305, 337476),
        orientation: {
          heading: Cesium.Math.toRadians(2.2),
          pitch:   Cesium.Math.toRadians(-78.4),
          roll:    0,
        },
        duration: 0,
      });
    }).catch((e: any) => console.error('Cesium Ion 3D Tiles failed:', e));

    // ── Direct Google Maps Tiles API option (blocked in EEA) ────────────────
    // Cesium.Cesium3DTileset.fromUrl(
    //   `https://tile.googleapis.com/v1/3dtiles/root.json?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`,
    //   { showCreditsOnScreen: true }
    // ).then((tileset: any) => { ... });

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
      if (!picked?.id) return;
      const entId: string | undefined = picked.id?.id;
      // Video hotspot click
      if (entId?.startsWith('video-hotspot-')) {
        const id = entId.slice('video-hotspot-'.length);
        const hotspot = VIDEO_HOTSPOTS.find(h => h.id === id);
        if (hotspot) window.dispatchEvent(new CustomEvent('cesium:video-open', { detail: hotspot.videoSrc }));
        return;
      }
      // Project marker click
      if (picked.id instanceof Cesium.Entity) {
        const proj = picked.id.properties?.getValue(Cesium.JulianDate.now())?.project as HousingProject | undefined;
        if (proj) onProjectSelect(proj);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // ── Shift+Click → log world position (helps align image planes) ──────────
    handler.setInputAction((click: any) => {
      const pos = viewer.scene.pickPosition(click.position);
      if (!pos) return;
      const carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pos);
      const result = {
        lat:    parseFloat(Cesium.Math.toDegrees(carto.latitude).toFixed(6)),
        lng:    parseFloat(Cesium.Math.toDegrees(carto.longitude).toFixed(6)),
        height: parseFloat(carto.height.toFixed(1)),
      };
      console.log('📍 Picked:', JSON.stringify(result));
      window.dispatchEvent(new CustomEvent('cesium:pick', { detail: result }));
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK, Cesium.KeyboardEventModifier.SHIFT);

    // ── Hover over video hotspot → highlight + cursor ─────────────────────
    let hoveredVideoId: string | null = null;
    handler.setInputAction((move: any) => {
      const picked = viewer.scene.pick(move.endPosition);
      const entId: string | undefined = picked?.id?.id;
      const newId = entId?.startsWith('video-hotspot-')
        ? entId.slice('video-hotspot-'.length)
        : null;
      if (newId === hoveredVideoId) return;

      if (hoveredVideoId && videoEntities[hoveredVideoId]) {
        videoEntities[hoveredVideoId].plane.material = Cesium.Color.RED.withAlpha(0.12);
      }
      hoveredVideoId = newId;
      viewer.scene.canvas.style.cursor = newId ? 'pointer' : '';
      if (newId && videoEntities[newId]) {
        videoEntities[newId].plane.material = Cesium.Color.RED.withAlpha(0.4);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    return () => {
      handler.destroy();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('cesium:reset-north', onReset);
      if (!viewer.isDestroyed()) viewer.destroy();
      viewerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


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

  // ── Toggle image plane visibility ───────────────────────────────────────
  useEffect(() => {
    for (const ent of imagePlaneEntities.current) ent.show = showImagePlanes;
  }, [showImagePlanes]);

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

