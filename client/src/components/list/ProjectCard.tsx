import type { HousingProject } from '../../types';
import { Badge } from '../shared/Badge';
import { getEraColorHex } from '../../utils/eraColors';

interface Props {
  project: HousingProject;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: Props) {
  return (
    <div
      data-testid="project-card"
      onClick={onClick}
      style={{
        background: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-border)',
        transition: 'box-shadow var(--transition-fast)',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
    >
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Badge style={{ background: getEraColorHex(project.era), color: 'white', border: 'none' }}>{project.era}</Badge>
        {!project.lat && <Badge style={{ background: '#F0EBE3', color: 'var(--color-ink-muted)' }}>location TBC</Badge>}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-1)', lineHeight: 1.3 }}>
        {project.name}
      </div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)' }}>
        {project.architect}
      </div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)', marginTop: 'var(--space-1)' }}>
        {project.city}
      </div>
    </div>
  );
}
