
const ERAS = [
  { label: '1921–30', cssVar: '--era-1921' },
  { label: '1941–50', cssVar: '--era-1941' },
  { label: '1951–60', cssVar: '--era-1951' },
  { label: '1961–70', cssVar: '--era-1961' },
  { label: '1971–80', cssVar: '--era-1971' },
  { label: '1981–90', cssVar: '--era-1981' },
  { label: '1991–00', cssVar: '--era-1991' },
  { label: '2001–10', cssVar: '--era-2001' },
  { label: '2011–20', cssVar: '--era-2011' },
  { label: '2021–30', cssVar: '--era-2021' },
];

export function Legend() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 'var(--space-6)',
      left: 'var(--space-4)',
      background: 'var(--color-bg-overlay)',
      backdropFilter: 'blur(8px)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-3)',
      boxShadow: 'var(--shadow-md)',
      zIndex: 10,
      maxWidth: 200,
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Era</div>
      {ERAS.map(era => (
        <div key={era.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: `var(${era.cssVar})`, flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>{era.label}</span>
        </div>
      ))}
    </div>
  );
}
