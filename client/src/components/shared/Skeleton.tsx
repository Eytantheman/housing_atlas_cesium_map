import type { CSSProperties } from 'react';

export function Skeleton({ height = 16, width = '100%', style }: {
  height?: number;
  width?: number | string;
  style?: CSSProperties;
}) {
  return (
    <div style={{
      height,
      width,
      borderRadius: 'var(--radius-sm)',
      background: 'linear-gradient(90deg, var(--color-border) 0%, var(--color-bg) 50%, var(--color-border) 100%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style,
    }} />
  );
}
