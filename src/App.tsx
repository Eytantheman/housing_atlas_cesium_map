import { useState, useMemo, useEffect } from 'react';
import { CesiumViewer, type FlyTarget } from './components/CesiumViewer';
import { ProjectPanel } from './components/ProjectPanel';
import { PROJECT_CAMERAS } from './config/cameras';
import type { HousingProject } from './types';
import allProjectsData from './data/housing-atlas.json';

const ALL_PROJECTS = allProjectsData as HousingProject[];

export default function App() {
  const [selected, setSelected] = useState<HousingProject | null>(null);
  const [flyTarget, setFlyTarget] = useState<FlyTarget | null>(null);
  const [bearing, setBearing] = useState(0);
  const [capture, setCapture] = useState<Record<string, number> | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [showDrawings, setShowDrawings] = useState(true);

  const sortedList = useMemo(
    () => [...ALL_PROJECTS].sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name)),
    [],
  );

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

  function flyTo(p: HousingProject) {
    if (p.lat == null || p.lng == null) return;
    const cam = PROJECT_CAMERAS[p.id] ?? { height: 250, pitch: -25, heading: 0 };
    setFlyTarget({ lat: cam.lat ?? p.lat, lng: cam.lng ?? p.lng, ...cam, id: Date.now() });
    setSelected(p);
  }

  function resetNorth() {
    window.dispatchEvent(new Event('cesium:reset-north'));
    setBearing(0);
  }

  const listRight = selected ? 396 : 16;

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden', background: '#000' }}>
      <CesiumViewer
        projects={ALL_PROJECTS.filter(p => p.lat != null)}
        tourProjects={[]}
        flyToTarget={flyTarget}
        onProjectSelect={p => flyTo(p)}
        showImagePlanes={showDrawings}
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

      {/* Persistent project list */}
      <div style={{
        position: 'absolute', top: 16, right: listRight,
        transition: 'right 0.38s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 10, width: 260, maxHeight: 'calc(100vh - 32px)',
        display: 'flex', flexDirection: 'column',
        background: 'rgba(15,15,15,0.92)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>Projects ({ALL_PROJECTS.length})</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setShowDrawings(v => !v)} title="Toggle drawings" style={{ ...glassBtn, width: 28, height: 28, padding: 0, borderRadius: 6, fontSize: 12, color: showDrawings ? '#C4623A' : 'rgba(255,255,255,0.4)' }}>
              ⬜
            </button>
            <button onClick={resetNorth} title="Reset to north" style={{ ...glassBtn, width: 28, height: 28, padding: 0, borderRadius: 6, fontSize: 14 }}>
              <span style={{ display: 'inline-block', transform: `rotate(${-bearing}deg)`, transition: 'transform 0.15s', color: bearing === 0 ? '#C4623A' : '#fff' }}>↑</span>
            </button>
          </div>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {sortedList.map((p, i) => (
            <button key={p.id} onClick={() => flyTo(p)}
              style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '9px 14px', background: selected?.id === p.id ? 'rgba(196,98,58,0.18)' : 'none', border: 'none', borderTop: i ? '1px solid rgba(255,255,255,0.06)' : 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              onMouseEnter={e => { if (selected?.id !== p.id) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = selected?.id === p.id ? 'rgba(196,98,58,0.18)' : 'none'; }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{p.name}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{p.city}</span>
            </button>
          ))}
        </div>
      </div>

      <ProjectPanel project={selected} onClose={() => setSelected(null)} />

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
    <div style={{ position: 'absolute', bottom: 24, right: 16, zIndex: 50, background: 'rgba(10,10,10,0.93)', border: '1px solid rgba(196,98,58,0.6)', borderRadius: 10, padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: '#fff', width: 340, boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ color: '#C4623A', fontWeight: 700 }}>Camera captured</span>
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14, padding: 0 }}>✕</button>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginBottom: 10 }}>
        h={capture.height}m · pitch={capture.pitch}° · heading={capture.heading}°
      </div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assign to project</div>
        <select value={assignedId} onChange={e => setAssignedId(e.target.value)}
          style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#fff', fontSize: 12, padding: '5px 8px', outline: 'none', cursor: 'pointer' }}>
          <option value="">— pick a project —</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.id}. {p.name}</option>)}
        </select>
        {assignedProject && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{assignedProject.city}</div>}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '7px 10px', lineHeight: 1.6, whiteSpace: 'pre', fontSize: 11, color: '#ccc' }}>{snippet}</div>
      <button onClick={() => navigator.clipboard.writeText(snippet)}
        style={{ marginTop: 8, background: '#C4623A', border: 'none', borderRadius: 6, color: '#fff', fontSize: 11, padding: '5px 12px', cursor: 'pointer', width: '100%', fontFamily: 'monospace' }}>
        Copy to clipboard
      </button>
    </div>
  );
}

const glassBtn: React.CSSProperties = { padding: '0 16px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, cursor: 'pointer', color: '#fff', fontSize: 13, boxShadow: '0 2px 8px rgba(0,0,0,0.3)', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' };
