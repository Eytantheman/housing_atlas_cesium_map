import type { ReactNode, CSSProperties } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}

export function Badge({ children, color, style }: BadgeProps) {
  return (
    <span style={{
      display: 'inline-block',
      padding: 'var(--space-1) var(--space-2)',
      borderRadius: 'var(--radius-pill)',
      fontSize: 'var(--text-xs)',
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      background: color ?? 'var(--color-bg)',
      color: 'var(--color-ink)',
      border: '1px solid var(--color-border)',
      ...style,
    }}>
      {children}
    </span>
  );
}
