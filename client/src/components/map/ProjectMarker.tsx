import type { HousingProject } from '../../types';
import { getEraColorHex } from '../../utils/eraColors';

interface Props {
  project: HousingProject;
  zoom: number;
  onClick: () => void;
}

export function ProjectMarker({ project, zoom, onClick }: Props) {
  const color = getEraColorHex(project.era);
  const size = zoom > 11 ? 20 : 12;

  return (
    <div
      className="map-marker"
      onClick={onClick}
      title={project.name}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        border: '2px solid white',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {zoom > 11 && (
        <span style={{ fontSize: 8, color: 'white', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          {project.id}
        </span>
      )}
    </div>
  );
}
