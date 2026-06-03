import { useState, useMemo, useRef, useEffect } from 'react';
import { MapView } from './components/map/MapView';
import { ProjectPanel } from './components/panel/ProjectPanel';
import { FilterPanel } from './components/filters/FilterPanel';
import { useProjects } from './hooks/useProjects';
import { useFilters } from './hooks/useFilters';
import { CITY_VIEWS, CITY_TOURS } from './config/tours';
import type { HousingProject, BuildingSelection, ProjectFeatureCollection } from './types';

const EMPTY_FC: ProjectFeatureCollection = { type: 'FeatureCollection', features: [] };

export default function App() {
  const { features, allProjects, loading } = useProjects();
  const { filters, setFilter, clearFilters, filteredFeatures, filteredList } = useFilters(features, allProjects);
  const [selection, setSelection] = useState<BuildingSelection | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [flyToTarget, setFlyToTarget] = useState<{ lng: number; lat: number; zoom?: number; pitch?: number; id: number } | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cities = useMemo(() => [...new Set(allProjects.map(p => p.city))].sort(), [allProjects]);

  // Build tour project list for the active city
  const tourProjects = useMemo(() => {
    if (!activeCity) return [];
    const tourIds = CITY_TOURS[activeCity];
    if (!tourIds) return [];
    return tourIds
      .map(id => allProjects.find(p => p.id === id))
      .filter((p): p is HousingProject => p != null && p.lat != null && p.lng != null);
  }, [activeCity, allProjects]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const handleProjectSelect = (project: HousingProject) => {
    setSelection({
      threeDBAG: {
        identificatie: project.bag_id ?? '',
        oorspronkelijkbouwjaar: null,
        b3_h_dak_50p: null,
        b3_h_dak_max: null,
        b3_h_maaiveld: null,
        status: null,
        gebruiksdoel: null,
        oppervlaktemin: null,
        oppervlaktemax: null,
        documentdatum: null,
      },
      atlasProject: project,
    });
  };

  const handleBuildingSelect = (sel: BuildingSelection) => {
    setSelection(sel);
  };

  const handleListItemClick = (project: HousingProject) => {
    setDropdownOpen(false);
    if (project.lat != null && project.lng != null) {
      setFlyToTarget({ lng: project.lng, lat: project.lat, zoom: 16, pitch: 55, id: Date.now() });
    }
    handleProjectSelect(project);
  };

  const handleCityFly = (city: string | null) => {
    setActiveCity(city);
    if (!city) return;
    const view = CITY_VIEWS[city];
    if (view) {
      setFlyToTarget({ lng: view.lng, lat: view.lat, zoom: view.zoom, pitch: view.pitch, id: Date.now() });
    }
  };

  const sortedList = useMemo(
    () => [...filteredList].sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name)),
    [filteredList],
  );

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <MapView
        features={features ? filteredFeatures : EMPTY_FC}
        onProjectSelect={handleProjectSelect}
        onBuildingSelect={handleBuildingSelect}
        selectedProject={selection?.atlasProject ?? null}
        flyToTarget={flyToTarget}
        tourProjects={tourProjects}
      />
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)', zIndex: 50, fontFamily: 'var(--font-body)', color: 'var(--color-ink-muted)' }}>
          Loading…
        </div>
      )}

      <FilterPanel
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
        cities={cities}
        onCityFly={handleCityFly}
      />

      {/* Tour legend — shown when a city tour is active */}
      {activeCity && tourProjects.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 'var(--space-6)',
          left: 'var(--space-4)',
          background: 'var(--color-bg-overlay)',
          backdropFilter: 'blur(8px)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3) var(--space-4)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 10,
          maxWidth: 260,
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Architecture Tour · {activeCity}</span>
            <button onClick={() => { setActiveCity(null); clearFilters(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent)', fontSize: 'var(--text-xs)', padding: 0, marginLeft: 8 }}>✕</button>
          </div>
          {tourProjects.map((p, i) => (
            <div
              key={p.id}
              onClick={() => handleListItemClick(p)}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '4px 0', cursor: 'pointer', borderTop: i > 0 ? '1px solid var(--color-border)' : 'none' }}
            >
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#C4623A', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink)', lineHeight: 1.4 }}>{p.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* List dropdown */}
      <div ref={dropdownRef} style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', zIndex: 20 }}>
        <button
          onClick={() => setDropdownOpen(o => !o)}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            background: dropdownOpen ? 'var(--color-accent)' : 'var(--color-bg-overlay)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            color: dropdownOpen ? '#fff' : 'var(--color-ink)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'background 0.15s, color 0.15s',
          }}
        >
          List ({filteredList.length})
        </button>

        {dropdownOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: 260,
            maxHeight: 380,
            overflowY: 'auto',
            background: 'var(--color-bg-overlay)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {sortedList.length === 0 && (
              <div style={{ padding: 'var(--space-4)', color: 'var(--color-ink-muted)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
                No projects match filters
              </div>
            )}
            {sortedList.map((p, i) => (
              <button
                key={p.id}
                onClick={() => handleListItemClick(p)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  padding: '10px var(--space-4)',
                  background: 'none',
                  border: 'none',
                  borderTop: i === 0 ? 'none' : '1px solid var(--color-border)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink)', fontWeight: 500, lineHeight: 1.3 }}>{p.name}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>{p.city}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <ProjectPanel selection={selection} onClose={() => setSelection(null)} />
    </div>
  );
}
