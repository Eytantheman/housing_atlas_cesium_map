import { useEffect, useRef, useState } from 'react';
import type { HousingProject } from '../types';
import { IMAGE_PLANES, type ImagePlane } from '../config/image-planes';
import { VIDEO_HOTSPOTS } from '../config/video-hotspots';

// Cesium is loaded via CDN script tag — access the global
declare const Cesium: typeof import('cesium');

const ACCENT = '#e02020'; // red — menus/tooltips use only black + white + this
const redA = (a: number) => `rgba(224, 32, 32, ${a})`;
const whiteA = (a: number) => `rgba(255, 255, 255, ${a})`;

export interface FlyTarget {
  lat: number;
  lng: number;
  height?: number;
  pitch?: number;
  heading?: number;
  id: number;
}

interface Props {
  tourProjects: HousingProject[];
  flyToTarget: FlyTarget | null;
  onProjectSelect: (p: HousingProject) => void;
  visiblePlanes: Record<string, boolean>;
  activePlaneId: string | null;
  show3dTiles: boolean;
}

export function CesiumViewer({ tourProjects, flyToTarget, onProjectSelect, visiblePlanes, activePlaneId, show3dTiles }: Props) {
  const containerRef       = useRef<HTMLDivElement>(null);
  const viewerRef          = useRef<any>(null);
  const tilesetRef         = useRef<any>(null);
  const tourPolyRef        = useRef<any>(null);
  const imagePlaneEntities = useRef<any[]>([]);
  const satelliteLayerRef  = useRef<any>(null);
  const savedSatCamRef     = useRef<{ lng: number; lat: number; height: number; heading: number } | null>(null);
  const show3dTilesRef     = useRef(show3dTiles);
  show3dTilesRef.current   = show3dTiles;

  // ── Image-plane live editor ──────────────────────────────────────────────
  const planeParamsRef    = useRef<ImagePlane[]>(IMAGE_PLANES.map(p => ({ ...p })));
  const planeEditStateRef = useRef({ on: false, idx: IMAGE_PLANES.length - 1 });
  const [planeEditOn, setPlaneEditOn]   = useState(false);
  const [planeEditIdx, setPlaneEditIdx] = useState(IMAGE_PLANES.length - 1);
  const [planeEditVals, setPlaneEditVals] = useState<ImagePlane | null>(null);
  const [planeLogMsg, setPlaneLogMsg]   = useState<string | null>(null);
  const STEP_LEVELS = [0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];
  const stepMultRef = useRef(5); // index into STEP_LEVELS — default 10× (5m/click), so movement is visible immediately
  const [stepMultIdx, setStepMultIdx] = useState(5);
  const setStepMult = (idx: number) => {
    const clamped = Math.max(0, Math.min(STEP_LEVELS.length - 1, idx));
    stepMultRef.current = clamped;
    setStepMultIdx(clamped);
  };
  // Always step relative to the ref (not the possibly-stale React state) so
  // rapid consecutive clicks each register instead of collapsing into one.
  const bumpStepMult = (delta: number) => setStepMult(stepMultRef.current + delta);

  // Applies planeParamsRef.current[idx] to the live Cesium entity — callable
  // from both the keyboard handler (inside the init effect) and click buttons.
  // In-place mutation of position/orientation/dimensions left the plane's
  // rendering primitive stuck mid-rebuild (blank/white, sometimes never
  // recovering). Destroying and re-adding the entity fresh — the same
  // construction that reliably works at initial load — sidesteps that
  // internal rebuild path entirely. nudgePlane() below debounces calls into
  // this so rapid clicks trigger one recreate instead of many.
  function applyPlaneParams(idx: number) {
    const p = planeParamsRef.current[idx];
    const viewer = viewerRef.current;
    const oldEnt = imagePlaneEntities.current[idx];
    if (!p || !viewer) return;
    const wasShown = oldEnt ? oldEnt.show : true;
    if (oldEnt) viewer.entities.remove(oldEnt);

    const pos = Cesium.Cartesian3.fromDegrees(p.lng, p.lat, p.height);
    const hpr = new Cesium.HeadingPitchRoll(
      Cesium.Math.toRadians(p.heading),
      Cesium.Math.toRadians(p.pitch ?? 0),
      Cesium.Math.toRadians(p.roll ?? 0),
    );
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(pos, hpr);
    const normal = p.type === 'plan' ? Cesium.Cartesian3.UNIT_Z : Cesium.Cartesian3.UNIT_Y;
    const ent = viewer.entities.add({
      id: `image-plane-${p.id}`,
      position: pos,
      orientation,
      show: wasShown,
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
    imagePlaneEntities.current[idx] = ent;
  }

  // Flies the camera to a near-nadir view centered on the plane so it's always
  // actually on screen when it becomes the active drawing (rather than wherever
  // the camera happened to be pointed already). Called from the keyboard/Tab
  // handler, the recenter button, and whenever activePlaneId changes from outside.
  function flyToPlane(idx: number) {
    const p = planeParamsRef.current[idx];
    const viewer = viewerRef.current;
    if (!p || !viewer) return;
    const span = Math.max(p.widthM, p.heightM);
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(p.lng, p.lat, p.height + span * 1.3),
      orientation: { heading: 0, pitch: Cesium.Math.toRadians(-89), roll: 0 },
      duration: 1.5,
    });
  }

  const applyDebounceRef = useRef<{ timer: ReturnType<typeof setTimeout> | null }>({ timer: null });
  function scheduleApplyPlaneParams(idx: number) {
    const d = applyDebounceRef.current;
    if (d.timer) clearTimeout(d.timer);
    d.timer = setTimeout(() => {
      applyPlaneParams(idx);
      d.timer = null;
    }, 180);
  }

  type NudgeAction = 'up' | 'down' | 'left' | 'right' | 'rotateCCW' | 'rotateCW'
    | 'tiltUp' | 'tiltDown' | 'rollCCW' | 'rollCW'
    | 'scaleUp' | 'scaleDown' | 'heightUp' | 'heightDown';

  function nudgePlane(action: NudgeAction, big = false) {
    const st = planeEditStateRef.current;
    const p = planeParamsRef.current[st.idx];
    if (!p) return;
    const mult   = STEP_LEVELS[stepMultRef.current];
    const factor = big ? 10 : 1;
    const moveM  = 0.5  * mult * factor;
    const rotDeg = 0.5  * mult * factor;
    const scaleF = 0.01 * mult * factor;
    const hM     = 0.2  * mult * factor;
    switch (action) {
      case 'up':         p.lat += moveM / 111320; break;
      case 'down':       p.lat -= moveM / 111320; break;
      case 'right':      p.lng += moveM / (111320 * Math.cos(p.lat * Math.PI / 180)); break;
      case 'left':       p.lng -= moveM / (111320 * Math.cos(p.lat * Math.PI / 180)); break;
      case 'rotateCCW':  p.heading = (p.heading - rotDeg + 360) % 360; break;
      case 'rotateCW':   p.heading = (p.heading + rotDeg) % 360; break;
      case 'tiltUp':     p.pitch = (p.pitch ?? 0) + rotDeg; break;
      case 'tiltDown':   p.pitch = (p.pitch ?? 0) - rotDeg; break;
      case 'rollCCW':    p.roll  = (p.roll  ?? 0) - rotDeg; break;
      case 'rollCW':     p.roll  = (p.roll  ?? 0) + rotDeg; break;
      case 'scaleUp':    p.widthM *= 1 + scaleF; p.heightM *= 1 + scaleF; break;
      case 'scaleDown':  p.widthM *= 1 - scaleF; p.heightM *= 1 - scaleF; break;
      case 'heightDown': p.height -= hM; break;
      case 'heightUp':   p.height += hM; break;
    }
    scheduleApplyPlaneParams(st.idx);
    setPlaneEditVals({ ...p });
  }

  // Direct-set from the height/opacity sliders (as opposed to nudgePlane's relative steps).
  function setPlaneHeight(value: number) {
    const st = planeEditStateRef.current;
    const p = planeParamsRef.current[st.idx];
    if (!p) return;
    p.height = value;
    scheduleApplyPlaneParams(st.idx);
    setPlaneEditVals({ ...p });
  }

  // Opacity only touches the material color, not position/dimensions, so it's applied
  // directly to the live entity — no need to recreate it (and no white-flash reload).
  function setPlaneOpacity(pct: number) {
    const st = planeEditStateRef.current;
    const p = planeParamsRef.current[st.idx];
    const ent = imagePlaneEntities.current[st.idx];
    if (!p) return;
    p.opacity = pct / 100;
    if (ent?.plane?.material) {
      ent.plane.material.color = new Cesium.Color(1, 1, 1, p.opacity);
    }
    setPlaneEditVals({ ...p });
  }

  function logActivePlanePosition() {
    const p = planeParamsRef.current[planeEditStateRef.current.idx];
    if (!p) return;
    const snippet = `{
    id: '${p.id}',
    imageUrl: '${p.imageUrl}',
    lat: ${p.lat.toFixed(6)},
    lng: ${p.lng.toFixed(6)},
    height: ${p.height.toFixed(1)},
    heading: ${p.heading.toFixed(1)},
    pitch: ${(p.pitch ?? 0).toFixed(1)},
    roll: ${(p.roll ?? 0).toFixed(1)},
    widthM: ${p.widthM.toFixed(1)},
    heightM: ${p.heightM.toFixed(1)},
    type: '${p.type}',
    opacity: ${p.opacity ?? 1},
    placement: 'surveyed', // tuned live against the tileset — update if you started from a rougher guess
  }`;
    console.log('🖼️ Image plane:', snippet);
    navigator.clipboard?.writeText(snippet).catch(() => {});
    setPlaneLogMsg('Logged to console + copied to clipboard');
    setTimeout(() => setPlaneLogMsg(null), 3000);
  }

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
    // React StrictMode double-invokes this effect in dev (mount → cleanup →
    // mount). viewerRef/tilesetRef get reset to null in cleanup, but this
    // array was never cleared, so entities from the destroyed first-mount
    // viewer stayed in it, shifting all indices for the second mount.
    imagePlaneEntities.current = [];

    // ── Image planes (architectural drawings) ────────────────────────────────
    for (const p of IMAGE_PLANES) {
      const pos = Cesium.Cartesian3.fromDegrees(p.lng, p.lat, p.height);
      const hpr = new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(p.heading),
        Cesium.Math.toRadians(p.pitch ?? 0),
        Cesium.Math.toRadians(p.roll ?? 0),
      );
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(pos, hpr);
      // facade: UNIT_Y = faces heading direction (vertical plane)
      // plan:   UNIT_Z = faces up (horizontal plane)
      // pitch/roll above additionally tilt/roll that base orientation.
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

    // ── Image-plane live editor (arrow keys move/rotate/scale) ──────────────
    const onPlaneEditKeyDown = (e: KeyboardEvent) => {
      const st = planeEditStateRef.current;
      if (!st.on) return;
      if (e.key === 'Tab') {
        e.preventDefault();
        st.idx = (st.idx + 1) % planeParamsRef.current.length;
        setPlaneEditIdx(st.idx);
        setPlaneEditVals({ ...planeParamsRef.current[st.idx] });
        flyToPlane(st.idx);
        return;
      }
      if (e.key === 'Escape') {
        st.on = false;
        setPlaneEditOn(false);
        return;
      }
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        bumpStepMult(1);
        return;
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        bumpStepMult(-1);
        return;
      }
      const actionByKey: Record<string, NudgeAction> = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowRight: 'right', ArrowLeft: 'left',
        q: 'rotateCCW', Q: 'rotateCCW', e: 'rotateCW', E: 'rotateCW',
        w: 'tiltUp', W: 'tiltUp', s: 'tiltDown', S: 'tiltDown',
        a: 'rollCCW', A: 'rollCCW', d: 'rollCW', D: 'rollCW',
        '.': 'scaleUp', '>': 'scaleUp', ',': 'scaleDown', '<': 'scaleDown',
        '[': 'heightDown', ']': 'heightUp',
      };
      const action = actionByKey[e.key];
      if (!action) return;
      e.preventDefault();
      nudgePlane(action, e.shiftKey);
    };
    window.addEventListener('keydown', onPlaneEditKeyDown);

    const onPlaneEditToggle = () => {
      const st = planeEditStateRef.current;
      st.on = !st.on;
      setPlaneEditOn(st.on);
      if (st.on) {
        setPlaneEditVals({ ...planeParamsRef.current[st.idx] });
        flyToPlane(st.idx);
      }
      setPlaneLogMsg(null);
    };
    window.addEventListener('cesium:edit-planes-toggle', onPlaneEditToggle);

    const onPlaneEditRecenter = () => flyToPlane(planeEditStateRef.current.idx);
    window.addEventListener('cesium:edit-planes-recenter', onPlaneEditRecenter);

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
    const emitTilesLoading = (loading: boolean, pending = 0, processing = 0) =>
      window.dispatchEvent(new CustomEvent('cesium:tiles-loading', { detail: { loading, pending, processing } }));

    const loadTileset = (isReload = false) => {
      emitTilesLoading(true);
      Cesium.Cesium3DTileset.fromIonAssetId(2275207, { showCreditsOnScreen: true })
        .then((tileset: any) => {
          if (tilesetRef.current) viewer.scene.primitives.remove(tilesetRef.current);
          tilesetRef.current = tileset;
          tileset.show = show3dTilesRef.current;
          viewer.scene.primitives.add(tileset);

          tileset.loadProgress.addEventListener((pending: number, processing: number) => {
            emitTilesLoading(pending > 0 || processing > 0, pending, processing);
          });
          tileset.allTilesLoaded.addEventListener(() => emitTilesLoading(false));

          if (!isReload) {
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(5.9836, 51.652305, 337476),
              orientation: {
                heading: Cesium.Math.toRadians(2.2),
                pitch:   Cesium.Math.toRadians(-78.4),
                roll:    0,
              },
              duration: 0,
            });
          }
        })
        .catch((e: any) => { console.error('Cesium Ion 3D Tiles failed:', e); emitTilesLoading(false, 0, 0); });
    };

    loadTileset();

    const onReload = () => loadTileset(true);
    window.addEventListener('cesium:reload-tiles', onReload);

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
      if (applyDebounceRef.current.timer) clearTimeout(applyDebounceRef.current.timer);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keydown', onPlaneEditKeyDown);
      window.removeEventListener('cesium:edit-planes-toggle', onPlaneEditToggle);
      window.removeEventListener('cesium:edit-planes-recenter', onPlaneEditRecenter);
      window.removeEventListener('cesium:reset-north', onReset);
      window.removeEventListener('cesium:reload-tiles', onReload);
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

  // ── Toggle image plane visibility (per-drawing, driven by the lightbox) ──
  useEffect(() => {
    imagePlaneEntities.current.forEach((ent, i) => {
      const id = IMAGE_PLANES[i]?.id;
      if (ent && id) ent.show = !!visiblePlanes[id];
    });
  }, [visiblePlanes]);

  // ── Activate a plane from outside (the "show in place" lightbox toggle) ──
  // Makes it the target for the sliders/edit-HUD and flies the camera to it.
  useEffect(() => {
    if (!activePlaneId) return;
    const idx = planeParamsRef.current.findIndex(p => p.id === activePlaneId);
    if (idx < 0) return;
    planeEditStateRef.current.idx = idx;
    setPlaneEditIdx(idx);
    setPlaneEditVals({ ...planeParamsRef.current[idx] });
    flyToPlane(idx);
  }, [activePlaneId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Closing the drawing (from the lightbox) also collapses the deep-edit HUD.
  useEffect(() => {
    if (!activePlaneId || !visiblePlanes[activePlaneId]) {
      planeEditStateRef.current.on = false;
      setPlaneEditOn(false);
    }
  }, [activePlaneId, visiblePlanes]);

  // ── Toggle 3D tiles / 2D satellite ─────────────────────────────────────
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (show3dTiles) {
      // Save 2D camera state before leaving satellite mode
      const cam2d = viewer.camera;
      const c2d = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cam2d.positionWC);
      savedSatCamRef.current = {
        lng: Cesium.Math.toDegrees(c2d.longitude),
        lat: Cesium.Math.toDegrees(c2d.latitude),
        height: c2d.height,
        heading: cam2d.heading,
      };
      if (tilesetRef.current) tilesetRef.current.show = true;
      viewer.scene.globe.show = false;
      if (satelliteLayerRef.current) {
        viewer.imageryLayers.remove(satelliteLayerRef.current);
        satelliteLayerRef.current = null;
      }
    } else {
      if (tilesetRef.current) tilesetRef.current.show = false;
      viewer.scene.globe.show = true;

      if (savedSatCamRef.current) {
        // Restore last 2D camera position
        const s = savedSatCamRef.current;
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(s.lng, s.lat, s.height),
          orientation: { heading: s.heading, pitch: -Math.PI / 2, roll: 0 },
          duration: 0.4,
        });
      } else {
        // First time: flatten to top-down over screen-center ground point
        const cam = viewer.camera;
        const camCarto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cam.positionWC);
        const canvasCenter = new Cesium.Cartesian2(
          viewer.canvas.clientWidth / 2,
          viewer.canvas.clientHeight / 2,
        );
        const groundPos = viewer.camera.pickEllipsoid(canvasCenter);
        const target = groundPos
          ? Cesium.Ellipsoid.WGS84.cartesianToCartographic(groundPos)
          : camCarto;
        // Cap altitude so a high 3D overview doesn't show the whole globe in 2D
        const height2d = Math.min(camCarto.height, 8000);
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromRadians(target.longitude, target.latitude, height2d),
          orientation: { heading: cam.heading, pitch: -Math.PI / 2, roll: 0 },
          duration: 0.6,
        });
      }

      if (!satelliteLayerRef.current) {
        Cesium.IonImageryProvider.fromAssetId(3)
          .then((provider: any) => {
            if (!viewer.isDestroyed() && !satelliteLayerRef.current) {
              const layer = viewer.imageryLayers.addImageryProvider(provider);
              layer.saturation = 0; // grayscale
              satelliteLayerRef.current = layer;
            }
          })
          .catch((e: any) => console.error('Satellite imagery failed:', e));
      }
    }
  }, [show3dTiles]);

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

  // Corner controls (edit button + sliders) only appear once a drawing has
  // been switched on from the "show in place" toggle in the lightbox — they
  // live outside the deep-edit HUD, not gated by planeEditOn.
  const activePlaneShown = !!activePlaneId && !!visiblePlanes[activePlaneId];

  return (
    <>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

      {activePlaneShown && (
        <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 15, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('cesium:edit-planes-toggle'))}
            title="Toggle drawing-alignment editor"
            style={{
              padding: '7px 14px', borderRadius: 8,
              background: planeEditOn ? ACCENT : 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${ACCENT}`, color: '#fff',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {planeEditOn ? '✥ Editing drawing' : '✥ Edit drawing'}
          </button>

          {planeEditVals && (
            <div style={{
              display: 'flex', gap: 16,
              background: 'rgba(0,0,0,0.85)', border: `1px solid ${redA(0.45)}`,
              borderRadius: 8, padding: '8px 14px 6px',
              backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              <SliderControl
                label="Height" value={planeEditVals.height} unit="m"
                min={0} max={150} step={0.5} decimals={1}
                onChange={setPlaneHeight}
              />
              <SliderControl
                label="Opacity" value={Math.round((planeEditVals.opacity ?? 1) * 100)} unit="%"
                min={20} max={100} step={1} decimals={0}
                onChange={setPlaneOpacity}
              />
            </div>
          )}
        </div>
      )}

      {activePlaneShown && planeEditOn && planeEditVals && (
        <div style={{
          position: 'absolute', bottom: 60, left: 16, zIndex: 15,
          background: 'rgba(0,0,0,0.93)', border: `1px solid ${redA(0.6)}`,
          borderRadius: 10, padding: '12px 14px', width: 250,
          fontFamily: 'monospace', fontSize: 11, color: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
        }}>
          <div style={{ color: ACCENT, fontWeight: 700, marginBottom: 6, fontSize: 12 }}>
            {planeEditVals.id} ({planeEditIdx + 1}/{IMAGE_PLANES.length})
          </div>
          <div style={{ lineHeight: 1.7, color: whiteA(0.85) }}>
            lat&nbsp;&nbsp;&nbsp;{planeEditVals.lat.toFixed(6)}<br />
            lng&nbsp;&nbsp;&nbsp;{planeEditVals.lng.toFixed(6)}<br />
            height&nbsp;{planeEditVals.height.toFixed(1)} m<br />
            head&nbsp;&nbsp;&nbsp;{planeEditVals.heading.toFixed(1)}°<br />
            tilt&nbsp;&nbsp;&nbsp;{(planeEditVals.pitch ?? 0).toFixed(1)}°<br />
            roll&nbsp;&nbsp;&nbsp;{(planeEditVals.roll ?? 0).toFixed(1)}°<br />
            size&nbsp;&nbsp;&nbsp;{planeEditVals.widthM.toFixed(1)} × {planeEditVals.heightM.toFixed(1)} m<br />
            opacity&nbsp;{Math.round((planeEditVals.opacity ?? 1) * 100)}%
          </div>

          <div style={{ display: 'flex', gap: 14, margin: '10px 0 4px', alignItems: 'flex-start' }}>
            {/* Move D-pad */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 22px)', gridTemplateRows: 'repeat(3, 22px)', gap: 2 }}>
              <div />
              <CtrlBtn label="↑" title="Move north" onClick={() => nudgePlane('up')} />
              <div />
              <CtrlBtn label="←" title="Move west" onClick={() => nudgePlane('left')} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: whiteA(0.4) }}>move</div>
              <CtrlBtn label="→" title="Move east" onClick={() => nudgePlane('right')} />
              <div />
              <CtrlBtn label="↓" title="Move south" onClick={() => nudgePlane('down')} />
              <div />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div>
                <div style={{ fontSize: 8, color: whiteA(0.4), marginBottom: 2 }}>rotate</div>
                <div style={{ display: 'flex', gap: 2 }}>
                  <CtrlBtn label="↺" title="Rotate CCW" onClick={() => nudgePlane('rotateCCW')} />
                  <CtrlBtn label="↻" title="Rotate CW" onClick={() => nudgePlane('rotateCW')} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 8, color: whiteA(0.4), marginBottom: 2 }}>tilt</div>
                <div style={{ display: 'flex', gap: 2 }}>
                  <CtrlBtn label="⤴" title="Tilt up" onClick={() => nudgePlane('tiltUp')} />
                  <CtrlBtn label="⤵" title="Tilt down" onClick={() => nudgePlane('tiltDown')} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 8, color: whiteA(0.4), marginBottom: 2 }}>roll</div>
                <div style={{ display: 'flex', gap: 2 }}>
                  <CtrlBtn label="⟲" title="Roll CCW" onClick={() => nudgePlane('rollCCW')} />
                  <CtrlBtn label="⟳" title="Roll CW" onClick={() => nudgePlane('rollCW')} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 8, color: whiteA(0.4), marginBottom: 2 }}>scale</div>
                <div style={{ display: 'flex', gap: 2 }}>
                  <CtrlBtn label="−" title="Scale down" onClick={() => nudgePlane('scaleDown')} />
                  <CtrlBtn label="+" title="Scale up" onClick={() => nudgePlane('scaleUp')} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 8, color: whiteA(0.4), marginBottom: 2 }}>height</div>
                <div style={{ display: 'flex', gap: 2 }}>
                  <CtrlBtn label="▼" title="Lower" onClick={() => nudgePlane('heightDown')} />
                  <CtrlBtn label="▲" title="Raise" onClick={() => nudgePlane('heightUp')} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0 8px' }}>
            <span style={{ color: whiteA(0.55), fontSize: 10 }}>
              step ×{STEP_LEVELS[stepMultIdx]} ({(0.5 * STEP_LEVELS[stepMultIdx]).toFixed(1)}m/click)
            </span>
            <CtrlBtn label="−" title="Smaller step" onClick={() => bumpStepMult(-1)} />
            <CtrlBtn label="+" title="Bigger step" onClick={() => bumpStepMult(1)} />
          </div>

          <div style={{ margin: '0 0 8px', color: whiteA(0.4), fontSize: 9.5, lineHeight: 1.6 }}>
            Click buttons above, or use keyboard:<br />
            ↑↓←→ move · Q/E rotate · W/S tilt · A/D roll<br />
            , / . scale · [ ] height<br />
            +/− step size · Shift = ×10 · Tab = switch · Esc = exit
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('cesium:edit-planes-recenter'))}
              title="Fly the camera back to this drawing"
              style={{
                flex: 1, padding: '6px 0', background: 'rgba(0,0,0,0.6)',
                border: `1px solid ${whiteA(0.3)}`, borderRadius: 6,
                color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Recenter camera
            </button>
            <button
              onClick={logActivePlanePosition}
              style={{
                flex: 1, padding: '6px 0', background: ACCENT, border: 'none',
                borderRadius: 6, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Log position
            </button>
          </div>
          {planeLogMsg && (
            <div style={{ marginTop: 6, color: ACCENT, fontSize: 10 }}>{planeLogMsg}</div>
          )}
        </div>
      )}
    </>
  );
}

function CtrlBtn({ label, title, onClick }: { label: string; title: string; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 22, height: 22, background: 'rgba(0,0,0,0.6)',
        border: `1px solid ${whiteA(0.3)}`, borderRadius: 5,
        color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
        lineHeight: 1, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
      }}
    >
      {label}
    </button>
  );
}

function SliderControl({ label, value, unit, min, max, step, decimals, onChange }: {
  label: string; value: number; unit: string;
  min: number; max: number; step: number; decimals: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 108 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: ACCENT, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        <span>{label}</span>
        <span style={{ color: whiteA(0.7) }}>{value.toFixed(decimals)}{unit}</span>
      </div>
      <input
        type="range" className="edit-slider"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  );
}

