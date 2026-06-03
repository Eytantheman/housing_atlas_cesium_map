
interface Props {
  count: number;
  onClick: () => void;
}

export function MarkerCluster({ count, onClick }: Props) {
  const size = count > 20 ? 40 : count > 10 ? 32 : 24;
  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--color-accent)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        cursor: 'pointer',
        transform: 'translate(-50%, -50%)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {count}
    </div>
  );
}
