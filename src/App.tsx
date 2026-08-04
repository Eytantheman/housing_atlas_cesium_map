import { useState, useMemo, useEffect, useRef } from 'react';
import { CesiumViewer, type FlyTarget } from './components/CesiumViewer';
import { ProjectPanel } from './components/ProjectPanel';
import { PROJECT_CAMERAS } from './config/cameras';
import { IMAGE_PLANES } from './config/image-planes';
import type { HousingProject } from './types';
import allProjectsData from './data/housing-atlas.json';

const ALL_PROJECTS = allProjectsData as HousingProject[];

// Menu / toast UI uses only these three colors (plus opacity variations for hierarchy)
const RED = '#e02020';
const redA = (a: number) => `rgba(224, 32, 32, ${a})`;
const whiteA = (a: number) => `rgba(255, 255, 255, ${a})`;

function nearestNeighborSort(projects: HousingProject[]): HousingProject[] {
  const withCoords = projects.filter(p => p.lat != null && p.lng != null);
  const noCoords   = projects.filter(p => p.lat == null || p.lng == null);
  if (withCoords.length === 0) return projects;

  const remaining = [...withCoords];
  const result: HousingProject[] = [];

  // start from the westernmost project
  let cur = remaining.splice(
    remaining.reduce((mi, p, i) => (p.lng! < remaining[mi].lng! ? i : mi), 0), 1
  )[0];
  result.push(cur);

  while (remaining.length > 0) {
    let nearestIdx = 0, nearestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const dl = remaining[i].lat! - cur.lat!;
      const dg = remaining[i].lng! - cur.lng!;
      const d  = dl * dl + dg * dg;
      if (d < nearestDist) { nearestDist = d; nearestIdx = i; }
    }
    cur = remaining.splice(nearestIdx, 1)[0];
    result.push(cur);
  }

  return [...result, ...noCoords];
}

export default function App() {
  const [selected, setSelected] = useState<HousingProject | null>(null);
  const [flyTarget, setFlyTarget] = useState<FlyTarget | null>(null);
  const [bearing, setBearing] = useState(0);
  const [capture, setCapture] = useState<Record<string, number> | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  // Which image-plane drawings are shown in the 3D scene — starts empty (nothing
  // shown) and is driven per-drawing from the "show in place" toggle in the
  // enlarged image lightbox, keyed by ImagePlane id.
  const [visiblePlanes, setVisiblePlanes] = useState<Record<string, boolean>>({});
  const [activePlaneId, setActivePlaneId] = useState<string | null>(null);
  const [introVisible, setIntroVisible] = useState(true);
  const [show3dTiles, setShow3dTiles] = useState(true);
  const [tileLoading, setTileLoading] = useState(false);
  const [tileFrozen, setTileFrozen] = useState(false);
  const [tilePct, setTilePct] = useState(0);
  const loaderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const freezeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tileMaxRef = useRef(0);

  const sortedList = useMemo(() => {
    const amsterdam = nearestNeighborSort(ALL_PROJECTS.filter(p => p.city === 'Amsterdam'));
    const others    = ALL_PROJECTS.filter(p => p.city !== 'Amsterdam')
      .sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name));
    return [...amsterdam, ...others];
  }, []);

  useEffect(() => {
    const h = (e: Event) => setBearing((e as CustomEvent<number>).detail);
    window.addEventListener('cesium:bearing', h);
    return () => window.removeEventListener('cesium:bearing', h);
  }, []);

  useEffect(() => {
    const h = (e: Event) => {
      setCapture((e as CustomEvent).detail);
      setTimeout(() => setCapture(null), 8000);
    };
    window.addEventListener('cesium:capture', h);
    return () => window.removeEventListener('cesium:capture', h);
  }, []);

  useEffect(() => {
    const h = (e: Event) => setVideoSrc((e as CustomEvent<string>).detail);
    window.addEventListener('cesium:video-open', h);
    return () => window.removeEventListener('cesium:video-open', h);
  }, []);

  useEffect(() => {
    const h = (e: Event) => setFlyTarget((e as CustomEvent).detail);
    window.addEventListener('cesium:image-cam', h);
    return () => window.removeEventListener('cesium:image-cam', h);
  }, []);

  useEffect(() => {
    const h = (e: Event) => {
      const { loading, pending, processing } = (e as CustomEvent<{ loading: boolean; pending: number; processing: number }>).detail;
      if (loading) {
        const current = pending + processing;
        if (current > tileMaxRef.current) tileMaxRef.current = current;
        const pct = tileMaxRef.current > 0
          ? Math.min(99, Math.round(100 * (1 - current / tileMaxRef.current)))
          : 0;
        setTilePct(pct);
        if (!loaderTimerRef.current)
          loaderTimerRef.current = setTimeout(() => setTileLoading(true), 500);
        if (!freezeTimerRef.current)
          freezeTimerRef.current = setTimeout(() => setTileFrozen(true), 8000);
      } else {
        tileMaxRef.current = 0;
        setTilePct(100);
        if (loaderTimerRef.current) { clearTimeout(loaderTimerRef.current); loaderTimerRef.current = null; }
        if (freezeTimerRef.current) { clearTimeout(freezeTimerRef.current); freezeTimerRef.current = null; }
        setTileLoading(false);
        setTileFrozen(false);
      }
    };
    window.addEventListener('cesium:tiles-loading', h);
    return () => {
      window.removeEventListener('cesium:tiles-loading', h);
      if (loaderTimerRef.current) clearTimeout(loaderTimerRef.current);
      if (freezeTimerRef.current) clearTimeout(freezeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIntroVisible(false), 28000);
    return () => clearTimeout(t);
  }, []);

  function flyTo(p: HousingProject) {
    if (p.lat == null || p.lng == null) return;
    const cam = PROJECT_CAMERAS[p.id] ?? { height: 250, pitch: -25, heading: 0 };
    setFlyTarget({ lat: cam.lat ?? p.lat, lng: cam.lng ?? p.lng, ...cam, id: Date.now() });
    setSelected(p);
    setIntroVisible(false);
  }

  function reloadTiles() {
    setTileFrozen(false);
    setTileLoading(false);
    window.dispatchEvent(new Event('cesium:reload-tiles'));
  }

  function resetNorth() {
    window.dispatchEvent(new Event('cesium:reset-north'));
    setBearing(0);
  }

  // Called from the "show in place" toggle under an enlarged image in the
  // project panel — shows/hides that one drawing and makes it the active
  // plane so the height/opacity sliders and edit button appear for it.
  function togglePlaneVisible(id: string) {
    const nowVisible = !visiblePlanes[id];
    setVisiblePlanes(v => ({ ...v, [id]: nowVisible }));
    setActivePlaneId(nowVisible ? id : null);
  }

  const anyPlaneVisible = IMAGE_PLANES.some(p => visiblePlanes[p.id]);
  const listRight = selected ? 396 : 16;

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden', background: '#000' }}>
      <CesiumViewer
        tourProjects={[]}
        flyToTarget={flyTarget}
        onProjectSelect={p => flyTo(p)}
        visiblePlanes={visiblePlanes}
        activePlaneId={activePlaneId}
        show3dTiles={show3dTiles}
      />

      {/* Title — top left */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: 28, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.01em', color: '#fff', textTransform: 'uppercase', textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>
          Augmented Atlas
        </div>
        <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: 12, fontWeight: 400, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginTop: 4 }}>
          of Social Housing in the NL
        </div>
      </div>

      {/* Intro text — hovers over the map on load, stretching to meet the project list */}
      <div style={{
        position: 'absolute', top: 78, left: 20, right: 296, zIndex: 9,
        pointerEvents: 'none', userSelect: 'none',
        opacity: introVisible ? 1 : 0,
        transform: introVisible ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'opacity 1s ease, transform 1s ease',
      }}>
        <p style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontSize: 'clamp(16px, 2vw, 23px)', fontWeight: 300, lineHeight: 1.32,
          color: '#fff', margin: '0 0 0.7em', textShadow: '0 2px 16px rgba(0,0,0,0.75)',
        }}>
          Welcome to Augmented Atlas, a living archive of Dutch collective housing seen through an intersectional lens. This platform brings together the research, drawings, oral histories, and 3D scans produced within the course into a single interactive environment, where each case study can be explored not only through its architectural form but through the social histories and lived experiences that shaped it.
        </p>
        <p style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontSize: 'clamp(16px, 2vw, 23px)', fontWeight: 300, lineHeight: 1.32,
          color: '#fff', margin: '0 0 0.7em', textShadow: '0 2px 16px rgba(0,0,0,0.75)',
        }}>
          A dynamic 3D map interface situates every project within the Dutch housing landscape, letting visitors move between site, structure, and story, while embedded Augmented Reality components layer contemporary voices and archival material directly onto the buildings themselves.
        </p>
        <p style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontSize: 'clamp(16px, 2vw, 23px)', fontWeight: 300, lineHeight: 1.32,
          color: '#fff', margin: 0, textShadow: '0 2px 16px rgba(0,0,0,0.75)',
        }}>
          Rather than presenting housing history as a fixed record, Augmented Atlas treats the archive as an open, evolving structure, one shaped collectively by students, communities, and institutions including Nieuwe Instituut, and offered here as both a research tool and a public exhibition space.
        </p>
      </div>

      {/* Persistent project list */}
      <div style={{
        position: 'absolute', top: 16, right: listRight,
        transition: 'right 0.38s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 10, width: 260, maxHeight: 'calc(100vh - 32px)',
        display: 'flex', flexDirection: 'column',
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)',
        border: `1px solid ${redA(0.3)}`, borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: `1px solid ${redA(0.2)}`, flexShrink: 0 }}>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>Projects ({ALL_PROJECTS.length})</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setShow3dTiles(v => !v)} title={show3dTiles ? 'Switch to 2D satellite' : 'Switch to 3D tiles'} style={{ ...glassBtn, width: 36, height: 28, padding: 0, borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: '0.03em', color: show3dTiles ? RED : whiteA(0.4) }}>
              {show3dTiles ? '3D' : '2D'}
            </button>
            <button onClick={() => {
              const next = !anyPlaneVisible;
              setVisiblePlanes(Object.fromEntries(IMAGE_PLANES.map(p => [p.id, next])));
              if (!next) setActivePlaneId(null);
            }} title="Toggle drawings" style={{ ...glassBtn, width: 28, height: 28, padding: 0, borderRadius: 6, fontSize: 12, color: anyPlaneVisible ? RED : whiteA(0.4) }}>
              ⬜
            </button>
            <button onClick={resetNorth} title="Reset to north" style={{ ...glassBtn, width: 28, height: 28, padding: 0, borderRadius: 6, fontSize: 14 }}>
              <span style={{ display: 'inline-block', transform: `rotate(${-bearing}deg)`, transition: 'transform 0.15s', color: bearing === 0 ? RED : whiteA(0.5) }}>↑</span>
            </button>
          </div>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {sortedList.map((p, i) => (
            <button key={p.id} onClick={() => flyTo(p)}
              style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '9px 14px', background: selected?.id === p.id ? redA(0.18) : 'none', border: 'none', borderTop: i ? `1px solid ${redA(0.12)}` : 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              onMouseEnter={e => { if (selected?.id !== p.id) e.currentTarget.style.background = whiteA(0.07); }}
              onMouseLeave={e => { e.currentTarget.style.background = selected?.id === p.id ? redA(0.18) : 'none'; }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: '#fff', textTransform: 'uppercase' }}>{p.name}</span>
              <span style={{ fontSize: 11, color: whiteA(0.4) }}>{p.city}</span>
            </button>
          ))}
        </div>
      </div>

      {show3dTiles && (tileLoading || tileFrozen) && (
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)', border: `1px solid ${redA(0.3)}`, borderRadius: 20, padding: '6px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.4)', pointerEvents: tileFrozen ? 'auto' : 'none' }}>
          {tileFrozen ? (
            <button onClick={reloadTiles} style={{ background: 'none', border: 'none', color: RED, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
              <span style={{ fontSize: 16 }}>↺</span> Reload tiles
            </button>
          ) : (
            <>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: RED, display: 'inline-block', animation: 'pulse 1.2s ease-in-out infinite' }} />
              <span style={{ color: whiteA(0.6), fontSize: 12 }}>Loading tiles…</span>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 600, minWidth: 32, textAlign: 'right' }}>{tilePct}%</span>
            </>
          )}
        </div>
      )}

      <ProjectPanel project={selected} onClose={() => setSelected(null)} visiblePlanes={visiblePlanes} onTogglePlane={togglePlaneVisible} />

      {videoSrc && <VideoOverlay videoSrc={videoSrc} onClose={() => setVideoSrc(null)} />}

      {capture && <CameraToast capture={capture} defaultId={selected?.id ?? null} projects={ALL_PROJECTS} onDismiss={() => setCapture(null)} />}
    </div>
  );
}

function VideoOverlay({ videoSrc, onClose }: { videoSrc: string; onClose: () => void }) {
  const [pos] = useState(() => {
    const w = Math.min(window.innerWidth * 0.41, 550);
    const h = w * (9 / 16);
    const pad = 30; // clears the X button overhang
    const x = pad + Math.random() * (window.innerWidth  - w - pad * 2);
    const y = pad + Math.random() * (window.innerHeight - h - pad * 2);
    return { x: Math.round(x), y: Math.round(y), w: Math.round(w) };
  });

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 200, pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: pos.x, top: pos.y, width: pos.w,
          aspectRatio: '16/9',
          border: '3px solid #e02020',
          boxShadow: '0 0 0 1px rgba(224,32,32,0.25), 0 0 40px rgba(224,32,32,0.2)',
          background: '#000',
          pointerEvents: 'auto',
        }}
      >
        <video
          src={videoSrc}
          autoPlay
          controls
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: -18, right: -18,
            width: 36, height: 36,
            background: '#e02020', border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '50%', color: '#fff',
            fontSize: 17, fontWeight: 700, lineHeight: 1,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
          }}
        >✕</button>
      </div>
    </div>
  );
}

function CameraToast({ capture, defaultId, projects, onDismiss }: {
  capture: Record<string, number>;
  defaultId: number | null;
  projects: HousingProject[];
  onDismiss: () => void;
}) {
  const [assignedId, setAssignedId] = useState<string>(defaultId != null ? String(defaultId) : '');
  const snippet = `  ${assignedId || '??'}: { lat: ${capture.lat}, lng: ${capture.lng}, height: ${capture.height}, pitch: ${capture.pitch}, heading: ${capture.heading} },`;
  const assignedProject = projects.find(p => p.id === Number(assignedId));

  return (
    <div style={{ position: 'absolute', bottom: 24, right: 16, zIndex: 50, background: 'rgba(0,0,0,0.93)', border: `1px solid ${RED}`, borderRadius: 10, padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: '#fff', width: 340, boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ color: RED, fontWeight: 700 }}>Camera captured</span>
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: whiteA(0.4), cursor: 'pointer', fontSize: 14, padding: 0 }}>✕</button>
      </div>
      <div style={{ color: whiteA(0.5), fontSize: 10, marginBottom: 10 }}>
        h={capture.height}m · pitch={capture.pitch}° · heading={capture.heading}°
      </div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: whiteA(0.4), marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assign to project</div>
        <select value={assignedId} onChange={e => setAssignedId(e.target.value)}
          style={{ width: '100%', background: 'rgba(0,0,0,0.6)', border: `1px solid ${redA(0.35)}`, borderRadius: 6, color: '#fff', fontSize: 12, padding: '5px 8px', outline: 'none', cursor: 'pointer' }}>
          <option value="">— pick a project —</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.id}. {p.name}</option>)}
        </select>
        {assignedProject && <div style={{ fontSize: 10, color: whiteA(0.4), marginTop: 4 }}>{assignedProject.city}</div>}
      </div>
      <div style={{ background: whiteA(0.06), borderRadius: 6, padding: '7px 10px', lineHeight: 1.6, whiteSpace: 'pre', fontSize: 11, color: whiteA(0.85) }}>{snippet}</div>
      <button onClick={() => navigator.clipboard.writeText(snippet)}
        style={{ marginTop: 8, background: RED, border: 'none', borderRadius: 6, color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 12px', cursor: 'pointer', width: '100%', fontFamily: 'monospace' }}>
        Copy to clipboard
      </button>
    </div>
  );
}

const glassBtn: React.CSSProperties = { padding: '0 16px', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', border: `1px solid ${redA(0.35)}`, borderRadius: 8, cursor: 'pointer', color: '#fff', fontSize: 13, boxShadow: '0 2px 8px rgba(0,0,0,0.3)', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' };
