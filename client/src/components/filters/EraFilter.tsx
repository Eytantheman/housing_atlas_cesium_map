import type { Era } from '../../types';
import { getEraColorHex } from '../../utils/eraColors';

const ERAS: Era[] = ['1921-1930','1941-1950','1951-1960','1961-1970','1971-1980','1981-1990','1991-2000','2001-2010','2011-2020','2021-2030'];

interface Props {
  selected: Era[];
  onChange: (eras: Era[]) => void;
}

export function EraFilter({ selected, onChange }: Props) {
  function toggle(era: Era) {
    onChange(selected.includes(era) ? selected.filter(e => e !== era) : [...selected, era]);
  }
  return (
    <div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', letterSpacing: '0.05em' }}>Era</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
        {ERAS.map(era => (
          <button
            key={era}
            onClick={() => toggle(era)}
            style={{
              padding: '2px 6px',
              borderRadius: 'var(--radius-pill)',
              border: `2px solid ${getEraColorHex(era)}`,
              background: selected.includes(era) ? getEraColorHex(era) : 'transparent',
              color: selected.includes(era) ? 'white' : getEraColorHex(era),
              cursor: 'pointer',
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
            }}
          >{era.slice(0, 4)}</button>
        ))}
      </div>
    </div>
  );
}
