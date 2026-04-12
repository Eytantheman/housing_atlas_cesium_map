import type { FilterState, Era } from '../../types';
import { EraFilter } from './EraFilter';
import { CityFilter } from './CityFilter';

interface Props {
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  clearFilters: () => void;
  cities: string[];
}

export function FilterPanel({ filters, setFilter, clearFilters, cities }: Props) {
  return (
    <div style={{
      position: 'absolute',
      top: 'var(--space-4)',
      left: 'var(--space-4)',
      zIndex: 10,
      width: 260,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(13px, 1.35vw, 17px)',
        fontWeight: 800,
        lineHeight: 1.15,
        letterSpacing: '0.03em',
        color: 'var(--color-ink)',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        userSelect: 'none',
        paddingLeft: 2,
      }}>
        Augmented Atlas<br />
        <span style={{ fontWeight: 400, letterSpacing: '0.06em', fontSize: '0.78em', color: 'var(--color-ink-muted)' }}>
          of Social Housing in the NL
        </span>
      </div>
      <div style={{
        background: 'var(--color-bg-overlay)',
        backdropFilter: 'blur(8px)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>Filters</span>
        <button onClick={clearFilters} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent)', fontSize: 'var(--text-sm)' }}>Clear all</button>
      </div>
      <EraFilter selected={filters.eras} onChange={v => setFilter('eras', v as Era[])} />
      <CityFilter cities={cities} selected={filters.cities} onChange={v => setFilter('cities', v)} />
      <div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', letterSpacing: '0.05em' }}>Search</div>
        <input
          type="search"
          placeholder="Name, architect, community…"
          value={filters.searchQuery}
          onChange={e => setFilter('searchQuery', e.target.value)}
          style={{
            width: '100%',
            padding: 'var(--space-2)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-bg-card)',
            color: 'var(--color-ink)',
            fontSize: 'var(--text-sm)',
          }}
        />
      </div>
      </div>
    </div>
  );
}
