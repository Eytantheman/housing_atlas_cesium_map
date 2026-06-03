import type { HousingProject } from '../../types';
import { ProjectCard } from './ProjectCard';

interface Props {
  projects: HousingProject[];
  onProjectClick: (p: HousingProject) => void;
  onClose: () => void;
}

export function ProjectList({ projects, onProjectClick, onClose }: Props) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'var(--color-bg)',
      zIndex: 30,
      overflowY: 'auto',
      padding: 'var(--space-6)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700 }}>
          Archive In-Situ
        </h1>
        <button
          onClick={onClose}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            background: 'var(--color-accent)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
        >Map view</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        {projects.map(p => (
          <ProjectCard key={p.id} project={p} onClick={() => onProjectClick(p)} />
        ))}
      </div>
    </div>
  );
}
