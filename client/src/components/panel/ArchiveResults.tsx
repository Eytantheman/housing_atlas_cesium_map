import type { RijksmuseumObject } from '../../types';

export function ArchiveResults({ results }: { results: RijksmuseumObject[] }) {
  if (!results.length) return (
    <p style={{ color: 'var(--color-ink-muted)', fontSize: 'var(--text-sm)' }}>No archival records found.</p>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {results.map(r => (
        <div key={r.objectNumber} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
          {r.webImage && (
            <img src={r.webImage.url} alt={r.title} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
          )}
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{r.title}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>{r.dating?.presentingDate}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
