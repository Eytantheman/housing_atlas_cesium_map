import { useState, useMemo, useEffect } from 'react';
import { CesiumViewer, type FlyTarget } from './components/CesiumViewer';
import { ProjectPanel } from './components/ProjectPanel';
import { CITY_VIEWS, CITY_TOURS } from './config/tours';
import { PROJECT_CAMERAS } from './config/cameras';
import type { HousingProject } from './types';
import allProjectsData from './data/housing-atlas.json';

const ALL_PROJECTS = allProjectsData as HousingProject[];

export default function App() {
  const [selected, setSelected]     = useState<HousingProject | null>(null);
  const [cityFilter, setCityFilter]  = useState('');
  const [search, setSearch]          = useState('');
  const [flyTarget, setFlyTarget]    = useState<FlyTarget | null>(null);
  const [activeCity, setActiveCity]  = useState<string | null>(null);
  const [bearing, setBearing]        = useState(0);
  const [capture, setCapture]        = useState<Record<string, number> | null>(null);

  const cities = useMemo(() => [...new Set(ALL_PROJECTS.map(p => p.city))].sort(), []);

  const filtered = useMemo(() => ALL_PROJECTS.filter(p => {
    if (cityFilter && p.city !== cityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!`${p.name} ${p.architect} ${p.social_org ?? ''}`.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [cityFilter, search]);

  const tourProjects = useMemo(() => {
    if (!activeCity) return [];
    return (CITY_TOURS[activeCity] ?? [])
      .map(id => ALL_PROJECTS.find(p => p.id === id))
      .filter((p): p is HousingProject => p != null && p.lat != null && p.lng != null);
  }, [activeCity]);

  const sortedList = useMemo(
    () => [...filtered].sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name)),
    [filtered],
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

  function flyTo(p: HousingProject) {
    if (p.lat == null || p.lng == null) return;
    const cam = PROJECT_CAMERAS[p.id] ?? { height: 250, pitch: -25, heading: 0 };
    setFlyTarget({ lat: cam.lat ?? p.lat, lng: cam.lng ?? p.lng, ...cam, id: Date.now() });
    setSelected(p);
  }

  function handleCityChange(city: string) {
    setCityFilter(city);
    setActiveCity(city || null);
    if (!city) return;
    const v = CITY_VIEWS[city];
    if (v) setFlyTarget({ lat: v.lat, lng: v.lng, height: v.height, pitch: v.pitch, id: Date.now() });
  }

  function resetNorth() {
    window.dispatchEvent(new Event('cesium:reset-north'));
    setBearing(0);
  }

  // List panel right edge: 380 (panel) + 16 (gap) = 396 when panel is open
  const listRight = selected ? 396 : 16;

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden', background: '#000' }}>
      <CesiumViewer
        projects={filtered.filter(p => p.lat != null)}
        tourProjects={tourProjects}
        flyToTarget={flyTarget}
        onProjectSelect={p => flyTo(p)}
      />

      {/* Title + Filters — top left */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, width: 260, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontFamily: 'system-ui', fontSize: 'clamp(13px,1.35vw,17px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '0.03em', color: '#fff', textTransform: 'uppercase', textShadow: '0 1px 4px rgba(0,0,0,0.6)', pointerEvents: 'none', userSelect: 'none' }}>
          Augmented Atlas<br />
          <span style={{ fontWeight: 400, letterSpacing: '0.06em', fontSize: '0.78em', opacity: 0.65 }}>of Social Housing in the NL</span>
        </div>
        <div style={glassCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>Filters</span>
            <button onClick={() => { setCityFilter(''); setSearch(''); setActiveCity(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4623A', fontSize: 12 }}>Clear all</button>
          </div>
          <div>
            <div style={labelSt}>City</div>
            <select value={cityFilter} onChange={e => handleCityChange(e.target.value)} style={inputSt}>
              <option value="">All cities</option>
              {cities.map(c => <option key={c} value={c}>{c}{CITY_TOURS[c] ? ' ✦' : ''}</option>)}
            </select>
          </div>
          <div>
            <div style={labelSt}>Search</div>
            <input type="search" placeholder="Name, architect…" value={search} onChange={e => setSearch(e.target.value)} style={inputSt} />
          </div>
        </div>
      </div>

      {/* Persistent project list — top right, slides left when panel opens */}
      <div style={{
        position: 'absolute',
        top: 16,
        right: listRight,
        transition: 'right 0.38s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 10,
        width: 260,
        maxHeight: 'calc(100vh - 32px)',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(15,15,15,0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        overflow: 'hidden',
      }}>
        {/* List header with north button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>Projects ({filtered.length})</span>
          <button onClick={resetNorth} title="Reset to north" style={{ ...glassBtn, width: 28, height: 28, padding: 0, borderRadius: 6, fontSize: 14 }}>
            <span style={{ display: 'inline-block', transform: `rotate(${-bearing}deg)`, transition: 'transform 0.15s', color: bearing === 0 ? '#C4623A' : '#fff' }}>↑</span>
          </button>
        </div>

        {/* Scrollable project rows */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {sortedList.length === 0 && (
            <div style={{ padding: 16, color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center' }}>No results</div>
          )}
          {sortedList.map((p, i) => (
            <button
              key={p.id}
              onClick={() => flyTo(p)}
              style={{
                display: 'flex', flexDirection: 'column', gap: 2,
                padding: '9px 14px',
                background: selected?.id === p.id ? 'rgba(196,98,58,0.18)' : 'none',
                border: 'none',
                borderTop: i ? '1px solid rgba(255,255,255,0.06)' : 'none',
                width: '100%', textAlign: 'left', cursor: 'pointer',
              }}
              onMouseEnter={e => { if (selected?.id !== p.id) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = selected?.id === p.id ? 'rgba(196,98,58,0.18)' : 'none'; }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{p.name}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{p.city}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tour legend */}
      {activeCity && tourProjects.length > 0 && (
        <div style={{ position: 'absolute', bottom: 24, left: 16, zIndex: 10, maxWidth: 260, background: 'rgba(15,15,15,0.88)', backdropFilter: 'blur(12px)', borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tour · {activeCity}</span>
            <button onClick={() => { setActiveCity(null); setCityFilter(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4623A', fontSize: 12, padding: 0 }}>✕</button>
          </div>
          {tourProjects.map((p, i) => (
            <div key={p.id} onClick={() => flyTo(p)} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '4px 0', cursor: 'pointer', borderTop: i ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#C4623A', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>{p.name}</span>
            </div>
          ))}
        </div>
      )}

      <ProjectPanel project={selected} onClose={() => setSelected(null)} />

      {capture && <CameraToast capture={capture} defaultId={selected?.id ?? null} projects={ALL_PROJECTS} onDismiss={() => setCapture(null)} />}
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

const glassCard: React.CSSProperties = { background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', borderRadius: 12, padding: '14px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.13)', display: 'flex', flexDirection: 'column', gap: 12 };
const glassBtn: React.CSSProperties  = { padding: '0 16px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, cursor: 'pointer', color: '#fff', fontSize: 13, boxShadow: '0 2px 8px rgba(0,0,0,0.3)', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const labelSt: React.CSSProperties   = { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.05em' };
const inputSt: React.CSSProperties   = { width: '100%', padding: '7px 10px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 13, outline: 'none', cursor: 'pointer', boxSizing: 'border-box' };
