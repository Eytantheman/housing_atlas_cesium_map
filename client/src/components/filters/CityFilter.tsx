import { CITY_VIEWS } from '../../config/tours';

interface Props {
  cities: string[];
  selected: string[];
  onChange: (cities: string[]) => void;
  onCityFly: (city: string | null) => void;
}

export function CityFilter({ cities, selected, onChange, onCityFly }: Props) {
  function handleChange(city: string) {
    onChange(city ? [city] : []);
    onCityFly(city || null);
  }

  return (
    <div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', letterSpacing: '0.05em' }}>City</div>
      <select
        value={selected[0] ?? ''}
        onChange={e => handleChange(e.target.value)}
        style={{
          width: '100%',
          padding: 'var(--space-2)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-bg-card)',
          color: 'var(--color-ink)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
        }}
      >
        <option value="">All cities</option>
        {cities.map(c => (
          <option key={c} value={c}>
            {c}{CITY_VIEWS[c] && ' ✦'}
          </option>
        ))}
      </select>
    </div>
  );
}
