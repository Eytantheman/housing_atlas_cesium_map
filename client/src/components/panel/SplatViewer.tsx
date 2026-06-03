import { useState } from 'react';
import { Skeleton } from '../shared/Skeleton';

export function SplatViewer({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);
  const src = `https://supersplat.playcanvas.com?url=${encodeURIComponent(url)}`;
  return (
    <div style={{ position: 'relative', height: 360, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      {!loaded && <Skeleton height={360} />}
      <iframe
        src={src}
        style={{ width: '100%', height: '100%', border: 'none', display: loaded ? 'block' : 'none' }}
        onLoad={() => setLoaded(true)}
        title="3D Scene"
      />
    </div>
  );
}
