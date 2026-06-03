import { useState } from 'react';
import type { ReactNode } from 'react';
import type { BuildingSelection, ThreeDBagMetadata } from '../../types';
import { Badge } from '../shared/Badge';
import { Skeleton } from '../shared/Skeleton';
import { SplatViewer } from './SplatViewer';
import { ArchiveResults } from './ArchiveResults';
import { useArchive } from '../../hooks/useArchive';
import { getEraColorHex } from '../../utils/eraColors';

interface Props {
  selection: BuildingSelection | null;
  onClose: () => void;
}

function MetaRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--space-2)', padding: 'var(--space-1) 0' }}>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-body)' }}>{label}</span>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink)' }}>{value ?? '—'}</span>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', margin: 'var(--space-4) 0 var(--space-2)' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
      <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-ink-muted)', whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
    </div>
  );
}

function ThreeDBagSection({ meta }: { meta: ThreeDBagMetadata }) {
  const shortId = meta.identificatie.length > 24 ? meta.identificatie.slice(0, 24) + '…' : meta.identificatie;
  return (
    <>
      <SectionDivider label="From 3DBAG" />
      <MetaRow label="BAG ID" value={<span title={meta.identificatie}>{shortId}</span>} />
      <MetaRow label="Built" value={meta.oorspronkelijkbouwjaar} />
      <MetaRow label="Roof height" value={meta.b3_h_dak_50p != null ? `${meta.b3_h_dak_50p.toFixed(1)} m` : null} />
      <MetaRow label="Ground level" value={meta.b3_h_maaiveld != null ? `+${meta.b3_h_maaiveld.toFixed(1)} m NAP` : null} />
      <MetaRow label="Status" value={meta.status} />
      <MetaRow label="Use type" value={meta.gebruiksdoel?.join(', ')} />
      <MetaRow label="Floor area" value={
        meta.oppervlaktemin != null && meta.oppervlaktemax != null
          ? `${meta.oppervlaktemin.toLocaleString()}–${meta.oppervlaktemax.toLocaleString()} m²`
          : null
      } />
    </>
  );
}

export function ProjectPanel({ selection, onClose }: Props) {
  const [showArchive, setShowArchive] = useState(false);
  const [splatUrl, setSplatUrl] = useState<string | null>(null);
  const archive = useArchive();

  const visible = selection !== null;
  const atlasProject = selection?.atlasProject ?? null;
  const threeDBAG = selection?.threeDBAG ?? null;

  const handleShowArchive = () => {
    if (!atlasProject) return;
    setShowArchive(true);
    archive.fetch(atlasProject.id);
  };

  const handleShowSplat = async () => {
    if (!atlasProject) return;
    const res = await fetch(`/api/projects/${atlasProject.id}/splat`);
    const data = await res.json() as { url: string | null };
    setSplatUrl(data.url);
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: 'var(--panel-width)',
      background: 'var(--color-bg-panel)',
      boxShadow: 'var(--shadow-lg)',
      transform: visible ? 'translateX(0)' : 'translateX(100%)',
      transition: `transform var(--transition-slow)`,
      zIndex: 20,
      overflowY: 'auto',
      padding: 'var(--space-6)',
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 'var(--text-lg)', color: 'var(--color-ink-muted)',
        }}
        aria-label="Close"
      >×</button>

      {atlasProject ? (
        <>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
            <Badge style={{ background: getEraColorHex(atlasProject.era), color: 'white', border: 'none' }}>
              {atlasProject.era}
            </Badge>
            {atlasProject.scale && <Badge>{atlasProject.scale} units</Badge>}
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 600,
            lineHeight: 1.2,
            marginBottom: 'var(--space-1)',
          }}>
            {atlasProject.name}
          </h2>
          <div style={{ color: 'var(--color-ink-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
            #{String(atlasProject.id).padStart(2, '0')} · {atlasProject.city}
          </div>

          <SectionDivider label="Archival description" />
          <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'var(--color-ink)', marginBottom: 'var(--space-4)' }}>
            {atlasProject.description}
          </p>

          <SectionDivider label="From our datasheet" />
          <MetaRow label="Architect" value={atlasProject.architect} />
          <MetaRow label="Era" value={atlasProject.era} />
          <MetaRow label="Community" value={atlasProject.social_org} />
          <MetaRow label="Scale" value={atlasProject.scale} />
          {atlasProject.note && <MetaRow label="Note" value={atlasProject.note} />}

          {threeDBAG && threeDBAG.identificatie && <ThreeDBagSection meta={threeDBAG} />}

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            <button
              onClick={() => { void handleShowSplat(); }}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-accent)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
              }}
            >View 3D scene ↗</button>
            <button
              onClick={handleShowArchive}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                color: 'var(--color-accent)',
                border: '1px solid var(--color-accent)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
              }}
            >View archive ↗</button>
          </div>

          {splatUrl && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <SplatViewer url={splatUrl} />
            </div>
          )}

          {showArchive && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <SectionDivider label="Archival records" />
              {archive.loading ? <Skeleton height={60} /> : <ArchiveResults results={archive.data} />}
            </div>
          )}
        </>
      ) : threeDBAG ? (
        <>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>Building</h2>
          <Badge style={{ background: 'var(--color-bg)', color: 'var(--color-ink-muted)' }}>Not in Housing Atlas</Badge>
          <ThreeDBagSection meta={threeDBAG} />
        </>
      ) : null}
    </div>
  );
}
