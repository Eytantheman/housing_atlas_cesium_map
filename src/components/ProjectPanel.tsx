import { useState, useEffect, useRef } from 'react';
import type { HousingProject } from '../types';
import { PANEL_CONTENT } from '../data/panel-content';

const TAB_BG  = 'rgba(14, 14, 12, 0.96)';   // solid for the tab
const PANEL_BG = 'rgba(14, 14, 12, 0.82)';  // semi-transparent panel
const GRID    = [
  'linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)',
  'linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)',
  'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px)',
  'linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
].join(',');
const GRID_SZ = '80px 80px, 80px 80px, 16px 16px, 16px 16px';
const INK   = '#e8e4dc';
const INK60 = 'rgba(232,228,220,0.55)';
const INK25 = 'rgba(232,228,220,0.22)';
const INK10 = 'rgba(232,228,220,0.08)';
const HV    = "'Helvetica Neue', Helvetica, Arial, sans-serif";

interface Props {
  project: HousingProject | null;
  onClose: () => void;
}

export function ProjectPanel({ project, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [shown, setShown]     = useState<HousingProject | null>(null);
  const [axoIdx, setAxoIdx]   = useState(0);
  const [lbImg, setLbImg]     = useState<{ src: string; cap: string } | null>(null);
  const timerRef              = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (project) {
      setShown(project);
      setAxoIdx(0);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      timerRef.current = setTimeout(() => setShown(null), 400);
    }
    return () => clearTimeout(timerRef.current);
  }, [project]);

  useEffect(() => {
    if (!lbImg) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setLbImg(null); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [lbImg]);

  if (!shown) return null;

  const content  = PANEL_CONTENT[shown.id];
  const axos     = content?.axos ?? [];
  const thumbs   = content?.thumbs ?? [];
  const axo      = axos[axoIdx];
  const bodyText = content?.description ?? shown.description;
  const paras    = bodyText ? bodyText.split('\n\n').filter(Boolean) : [];
  const coords   = formatCoords(shown.lat, shown.lng);

  function switchAxo(delta: number) {
    setAxoIdx(i => (i + delta + axos.length) % axos.length);
  }

  return (
    <>
      {/*
        Outer shell: handles the slide animation.
        Does NOT scroll — the tab is positioned here so it stays fixed.
      */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 380,
        zIndex: 30,
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '-16px 0 64px rgba(0,0,0,0.55), -2px 0 0 rgba(255,255,255,0.06)',
      }}>

        {/* Tab sticking out — anchored to outer shell, never scrolls */}
        <button
          onClick={onClose}
          title="Collapse panel"
          style={{
            position: 'absolute', left: -28, top: '50%',
            transform: 'translateY(-50%)',
            width: 28, height: 64,
            background: TAB_BG, border: 'none',
            borderRadius: '6px 0 0 6px',
            boxShadow: '-6px 0 18px rgba(0,0,0,0.6)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <svg width="9" height="16" viewBox="0 0 9 16" fill="none"
               stroke={INK60} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2,1 7,8 2,15"/>
          </svg>
        </button>

        {/* Inner panel — this part scrolls */}
        <div style={{
          position: 'absolute', inset: 0,
          background: PANEL_BG,
          backgroundImage: GRID,
          backgroundSize: GRID_SZ,
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          fontFamily: HV,
          overflowY: 'auto', overflowX: 'hidden',
          scrollbarWidth: 'thin', scrollbarColor: `${INK25} transparent`,
          boxSizing: 'border-box',
        }}>

          {/* Header */}
          <div style={{ padding: '2rem 1.8rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span style={microLabel}>{shown.id}</span>
              <span style={microLabel}>{shown.city}</span>
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 400, color: INK, lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 1.3rem' }}>
              {shown.name}
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.2rem' }}>
              <MetaItem label="Architect" value={shown.architect} />
              <MetaItem label={content?.period ? 'Period' : 'Era'} value={content?.period ?? shown.era} />
              {(content?.programme || shown.social_org) &&
                <MetaItem label="Programme" value={content?.programme ?? shown.social_org!} />}
              {(content?.units || shown.scale) &&
                <MetaItem label="Units" value={content?.units ?? shown.scale!} />}
              {coords && <MetaItem label="Coordinates" value={coords} full />}
            </div>
          </div>

          <div style={{ height: 0.5, background: INK10 }} />

          {/* Axo carousel */}
          {axo && (
            <div>
              <div
                style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', position: 'relative', cursor: 'zoom-in' }}
                onClick={() => setLbImg({ src: axo.src, cap: axo.caption })}
              >
                <img key={axo.src} src={axo.src} alt="Axonometric"
                     style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.5rem 0.85rem 0.55rem',
                  background: 'linear-gradient(transparent,rgba(18,17,14,0.5))',
                  pointerEvents: 'none',
                }}>
                  <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.04em', lineHeight: 1.3, flex: 1, paddingRight: '0.7rem' }}>
                    {axo.caption}
                  </span>
                  <div style={{ display: 'flex', gap: 5, pointerEvents: 'all' }}>
                    <AxoBtn onClick={e => { e.stopPropagation(); switchAxo(-1); }} dir="prev" />
                    <AxoBtn onClick={e => { e.stopPropagation(); switchAxo(1);  }} dir="next" />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', borderBottom: `0.5px solid ${INK10}` }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  {axos.map((_, i) => (
                    <div key={i} onClick={() => setAxoIdx(i)} style={{ width: 5, height: 5, borderRadius: '50%', background: i === axoIdx ? INK : INK25, cursor: 'pointer', transition: 'background 0.15s' }} />
                  ))}
                </div>
                <a href={axo.pdfUrl} target="_blank" rel="noopener"
                   style={{ fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: INK60, textDecoration: 'none', borderBottom: `0.5px solid ${INK25}`, paddingBottom: 1 }}>
                  Download PDF
                </a>
              </div>
            </div>
          )}

          {/* Description */}
          {paras.length > 0 && (
            <div style={{ padding: '1.5rem 1.8rem 0' }}>
              {paras.map((p, i) => (
                <p key={i} style={{ margin: i > 0 ? '0.8em 0 0' : 0, fontSize: 12.5, lineHeight: 1.65, color: INK }}>{p}</p>
              ))}
            </div>
          )}
          {shown.note && (
            <div style={{ padding: '0.75rem 1.8rem 0' }}>
              <p style={{ margin: 0, fontSize: 12, color: INK60, fontStyle: 'italic', lineHeight: 1.6 }}>{shown.note}</p>
            </div>
          )}

          {/* Archive thumbnails */}
          {thumbs.length > 0 && (
            <>
              <div style={{ height: 0.5, background: INK10, margin: '1.5rem 1.8rem' }} />
              <div style={{ padding: '0 1.8rem 2rem' }}>
                <p style={{ fontSize: 7.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: INK25, margin: '0 0 0.6rem' }}>Archive</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3 }}>
                  {thumbs.map((t, i) => (
                    <Thumb key={i} src={t.src} caption={t.caption}
                           onOpen={(src, cap) => setLbImg({ src, cap })} />
                  ))}
                </div>
              </div>
            </>
          )}

          <div style={{ height: 32 }} />
        </div>{/* end inner scrollable */}
      </div>{/* end outer shell */}

      {/* Lightbox */}
      {lbImg && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(18,17,14,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, cursor: 'zoom-out' }}
          onClick={() => setLbImg(null)}
        >
          <div
            style={{ position: 'relative', maxWidth: '92vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setLbImg(null)} style={{ position: 'absolute', top: '-2rem', right: 0, width: 28, height: 28, background: 'transparent', border: '0.5px solid rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 10 10" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none">
                <line x1="1" y1="1" x2="9" y2="9"/><line x1="9" y1="1" x2="1" y2="9"/>
              </svg>
            </button>
            <img src={lbImg.src} alt=""
                 style={{ maxWidth: '100%', maxHeight: '82vh', objectFit: 'contain', display: 'block' }} />
            <p style={{ fontSize: 9, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.55)', textAlign: 'center', margin: 0 }}>{lbImg.cap}</p>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Sub-components ── */

function MetaItem({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, ...(full ? { gridColumn: '1 / -1' } : {}) }}>
      <span style={{ fontSize: 7.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: INK25 }}>{label}</span>
      <span style={{ fontSize: 11.5, color: INK, lineHeight: 1.3 }}>{value}</span>
    </div>
  );
}

function AxoBtn({ onClick, dir }: { onClick: React.MouseEventHandler; dir: 'prev' | 'next' }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: 24, height: 24, border: '0.5px solid rgba(255,255,255,0.4)', background: hovered ? 'rgba(255,255,255,0.1)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}>
      <svg width="9" height="9" viewBox="0 0 10 10" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" fill="none">
        {dir === 'prev' ? <polyline points="7,1 3,5 7,9"/> : <polyline points="3,1 7,5 3,9"/>}
      </svg>
    </button>
  );
}

function Thumb({ src, caption, onOpen }: { src: string; caption: string; onOpen: (src: string, cap: string) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => onOpen(src, caption)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', aspectRatio: '1/1', background: '#2a2825', overflow: 'hidden', cursor: 'zoom-in' }}>
      <img src={src} loading="lazy"
           style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: hovered ? 0.75 : 1, transition: 'opacity 0.2s' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: '0.35rem 0.4rem', background: 'linear-gradient(transparent 40%,rgba(18,17,14,0.58))', fontSize: 7, color: 'rgba(255,255,255,0.82)', lineHeight: 1.3, opacity: hovered ? 1 : 0, transition: 'opacity 0.2s' }}>
        {caption}
      </div>
    </div>
  );
}

/* ── Helpers ── */

const microLabel: React.CSSProperties = {
  fontSize: 8.5, fontWeight: 400, letterSpacing: '0.2em',
  textTransform: 'uppercase', color: INK60,
};

function formatCoords(lat: number | null, lng: number | null): string | null {
  if (lat == null || lng == null) return null;
  const fmt = (deg: number, dir: [string, string]) => {
    const d = Math.floor(Math.abs(deg));
    const m = Math.floor((Math.abs(deg) - d) * 60);
    const s = ((Math.abs(deg) - d - m / 60) * 3600).toFixed(1);
    return `${d}°${m}′${s}″${deg >= 0 ? dir[0] : dir[1]}`;
  };
  return `${fmt(lat, ['N', 'S'])}  ${fmt(lng, ['E', 'W'])}`;
}
