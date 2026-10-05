import { useState, useEffect, useRef } from 'react';
import type { HousingProject } from '../types';
import { PANEL_CONTENT } from '../data/panel-content';
import type { CamPos } from '../data/panel-content';
import { IMAGE_PLANES } from '../config/image-planes';
import { SPLAT_HOTSPOTS, openSplat } from '../config/splat-hotspots';
import { useFloatingWindow, announceFloatOpen, FLOAT_OPEN_EVENT } from './useFloatingWindow';
import type { FloatKind } from './useFloatingWindow';

// Styling lives in src/App.css (.panel, .axo, .thumb, .lb …) — see DESIGN.md.

interface Props {
  project: HousingProject | null;
  onClose: () => void;
  visiblePlanes: Record<string, boolean>;
  onTogglePlane: (id: string) => void;
}

export function ProjectPanel({ project, onClose, visiblePlanes, onTogglePlane }: Props) {
  const [visible, setVisible] = useState(false);
  const [shown, setShown]     = useState<HousingProject | null>(null);
  const [axoIdx, setAxoIdx]   = useState(0);
  const [lbImg, setLbImg]     = useState<{ src: string; cap: string; camPos?: CamPos; planeId?: string } | null>(null);

  function openImage(src: string, cap: string, camPos?: CamPos) {
    // If this image is also registered as a 3D image-plane drawing, the lightbox
    // gets a "show in place" toggle that projects it onto the model.
    const planeId = IMAGE_PLANES.find(p => p.imageUrl === src)?.id;
    announceFloatOpen('image');
    setLbImg({ src, cap, camPos, planeId });
    if (camPos) window.dispatchEvent(new CustomEvent('cesium:image-cam', { detail: { ...camPos, id: Date.now() } }));
  }
  const timerRef              = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Presentation only: scroll container (reset per project) and the phone
  // bottom-sheet "peek" state (collapsed to its header so the building shows).
  const scrollRef             = useRef<HTMLDivElement>(null);
  const [peek, setPeek]       = useState(false);

  useEffect(() => {
    clearTimeout(timerRef.current);
    setLbImg(null); // a window belongs to the project it was opened from
    if (project) {
      setShown(project);
      setAxoIdx(0);
      setPeek(false);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      timerRef.current = setTimeout(() => setShown(null), 400);
    }
    return () => clearTimeout(timerRef.current);
  }, [project]);

  useEffect(() => {
    const h = (e: Event) => { if ((e as CustomEvent<FloatKind>).detail !== 'image') setLbImg(null); };
    window.addEventListener(FLOAT_OPEN_EVENT, h);
    return () => window.removeEventListener(FLOAT_OPEN_EVENT, h);
  }, []);

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
  const scans    = SPLAT_HOTSPOTS.filter(h => h.projectId === shown.id);
  const axo      = axos[axoIdx];
  const bodyText = content?.description ?? shown.description;
  const paras    = bodyText ? bodyText.split('\n\n').filter(Boolean) : [];
  const coords   = formatCoords(shown.lat, shown.lng);

  function switchAxo(delta: number) {
    setAxoIdx(i => (i + delta + axos.length) % axos.length);
  }

  const pad2 = (n: number) => String(n).padStart(2, '0');
  const isEmpty = !axo && paras.length === 0 && !shown.note && thumbs.length === 0 && scans.length === 0;

  return (
    <>
      {/* Outer shell: handles the slide animation. Does NOT scroll. */}
      <aside className={`panel${visible ? ' is-visible' : ''}${peek ? ' is-peek' : ''}`} aria-label={`Project: ${shown.name}`}>

        {/* Inner panel — this part scrolls */}
        <div className="panel__scroll" ref={scrollRef}>

          {/* Header */}
          <header className="panel__head">
            <div className="panel__kicker">
              <span>No. {pad2(shown.id)}</span>
              <span>{shown.city}</span>
              <button className="link panel__peek"
                      onClick={() => { setPeek(v => !v); if (scrollRef.current) scrollRef.current.scrollTop = 0; }}
                      aria-expanded={!peek}>
                {peek ? 'Expand' : 'Collapse'}
              </button>
              <button className="link panel__close" onClick={onClose}>Close</button>
            </div>
            <h2 className="panel__title">{shown.name}</h2>
            <dl className="meta">
              <MetaItem label="Architect" value={shown.architect} />
              <MetaItem label={content?.period ? 'Period' : 'Era'} value={content?.period ?? shown.era} />
              {(content?.programme || shown.social_org) &&
                <MetaItem label="Programme" value={content?.programme ?? shown.social_org!} />}
              {(content?.units || shown.scale) &&
                <MetaItem label="Units" value={content?.units ?? shown.scale!} />}
              {coords && <MetaItem label="Coordinates" value={coords} full />}
            </dl>
          </header>

          {/* Axo carousel */}
          {axo && (
            <figure className="axo">
              <button className="axo__frame" onClick={() => openImage(axo.src, axo.caption)} aria-label="Enlarge axonometric drawing">
                <SafeImg key={axo.src} src={axo.src} alt={`Axonometric drawing: ${axo.caption}`} />
              </button>

              <figcaption className="axo__cap">
                <div className="axo__row">
                  <span className="cap">Axonometric {pad2(axoIdx + 1)} / {pad2(axos.length)}</span>
                  {axos.length > 1 && (
                    <span className="axo__nav">
                      <AxoBtn onClick={e => { e.stopPropagation(); switchAxo(-1); }} dir="prev" />
                      <AxoBtn onClick={e => { e.stopPropagation(); switchAxo(1);  }} dir="next" />
                    </span>
                  )}
                </div>
                <p className="axo__text">{axo.caption}</p>
                <div className="axo__row">
                  {axos.length > 1 ? (
                    <span className="axo__dots">
                      {axos.map((_, i) => (
                        <button key={i} onClick={() => setAxoIdx(i)}
                                className={`axo__dot${i === axoIdx ? ' is-active' : ''}`}
                                aria-label={`Drawing ${i + 1}`} aria-current={i === axoIdx ? 'true' : undefined}>
                          {pad2(i + 1)}
                        </button>
                      ))}
                    </span>
                  ) : <span />}
                  <a href={axo.pdfUrl} target="_blank" rel="noopener" className="link cap">
                    Download PDF
                  </a>
                </div>
              </figcaption>
            </figure>
          )}

          {/* Description */}
          {paras.length > 0 && (
            <div className="panel__text">
              {paras.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
          {shown.note && (
            <div className="panel__note">
              <span className="cap">Note</span>
              <p>{shown.note}</p>
            </div>
          )}

          {/* 3D scans — the in-map pin's keyboard / screen-reader twin, and the focus target on close */}
          {scans.length > 0 && (
            <section className="scans" aria-label="3D scans">
              <h3 className="section-head">
                <span>3D scan</span>
                <span>{pad2(scans.length)}</span>
              </h3>
              {scans.map(sc => (
                <button key={sc.id} className="scan-row" onClick={() => openSplat({ id: sc.id })}>
                  <span className="dot" aria-hidden="true" />
                  <span className="scan-row__title">{sc.title}</span>
                  <span className="scan-row__go">Enter&nbsp;→</span>
                </button>
              ))}
            </section>
          )}

          {/* Archive thumbnails */}
          {thumbs.length > 0 && (
            <section className="archive" aria-label="Archive">
              <h3 className="section-head">
                <span>Archive</span>
                <span>{pad2(thumbs.length)}</span>
              </h3>
              <div className="archive__grid">
                {thumbs.map((t, i) => (
                  <Thumb key={i} src={t.src} caption={t.caption} camPos={t.camPos}
                         onOpen={(src, cap, camPos) => openImage(src, cap, camPos)} />
                ))}
              </div>
            </section>
          )}

          {isEmpty && (
            <p className="empty panel__empty">
              Documentation for this project is still being assembled.
            </p>
          )}

          <div className="panel__end" />
        </div>{/* end inner scrollable */}
      </aside>{/* end outer shell */}

      {lbImg && (
        <ImageLightbox
          key={lbImg.src}
          src={lbImg.src} caption={lbImg.cap} onClose={() => setLbImg(null)}
          planeId={lbImg.planeId}
          shown={lbImg.planeId ? !!visiblePlanes[lbImg.planeId] : false}
          onToggleInPlace={lbImg.planeId ? () => onTogglePlane(lbImg.planeId!) : undefined}
        />
      )}
    </>
  );
}

/* ── Image lightbox (red-framed, randomly positioned) ── */

function ImageLightbox({ src, caption, onClose, planeId, shown, onToggleInPlace }: {
  src: string; caption: string; onClose: () => void;
  planeId?: string; shown?: boolean; onToggleInPlace?: () => void;
}) {
  // Placement, clamping, pointer drag, phone sheet and focus handling
  const { ref: winRef, sheet: winSheet, dragging: winDragging, style: winStyle, handlers: winHandlers } = useFloatingWindow(600);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!fullscreen) return;
    // Capture phase + stopPropagation: Escape leaves full screen only, instead of
    // also reaching the panel's listener that closes the whole lightbox.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      setFullscreen(false);
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [fullscreen]);

  return (
    <div className="lb-layer">
      <div
        ref={winRef}
        className={`float lb${winSheet ? ' is-sheet' : ''}${winDragging ? ' is-dragging' : ''}`}
        {...winHandlers}
        role="dialog"
        aria-label={caption || 'Enlarged image'}
        tabIndex={-1}
        style={winStyle}
      >
        <div className="float__bar lb__bar">
          {winSheet ? (
            <span className="float__meta">Image</span>
          ) : (
            <span className="float__meta lb__grip" aria-hidden="true">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><rect x="0" y="0" width="10" height="1"/><rect x="0" y="5" width="10" height="1"/></svg>
              Drag
            </span>
          )}
          <span className="float__actions">
            <button onClick={() => setFullscreen(true)} title="Full screen" className="link">Full screen</button>
            <button onClick={onClose} title="Close" className="link">Close</button>
          </span>
        </div>
        <SafeImg key={src} src={src} alt={caption} draggable={false} className="lb__img" />
        {planeId && (
          <button onClick={onToggleInPlace} aria-pressed={!!shown}
                  className={`lb__inplace${shown ? ' is-on' : ''}`}>
            <span className="tool__mark" aria-hidden="true" />
            {shown ? 'Showing in place on model' : 'Show in place on model'}
          </button>
        )}
        {caption && (
          <p className="lb__cap">{displayCaption(caption)}</p>
        )}
      </div>

      {fullscreen && (
        <div className="lb-full" onClick={() => setFullscreen(false)} role="dialog" aria-label="Full screen image">
          <img src={src} alt={caption} draggable={false} onClick={e => e.stopPropagation()}
               className="lb-full__img"
               style={{ maxHeight: caption ? 'calc(100% - 40px)' : '100%' }} />
          {caption && (
            <p className="lb-full__cap" onClick={e => e.stopPropagation()}>
              {displayCaption(caption)}
            </p>
          )}
          <button onClick={() => setFullscreen(false)} title="Close full screen" className="link lb-full__close">
            Close
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function MetaItem({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={`meta__item${full ? ' meta__item--full' : ''}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function AxoBtn({ onClick, dir }: { onClick: React.MouseEventHandler; dir: 'prev' | 'next' }) {
  return (
    <button onClick={onClick} className="axo__arrow" aria-label={dir === 'prev' ? 'Previous drawing' : 'Next drawing'}>
      <svg width="14" height="8" viewBox="0 0 14 8" stroke="currentColor" strokeWidth="1" fill="none" aria-hidden="true">
        {dir === 'prev'
          ? <><line x1="1" y1="4" x2="14" y2="4"/><polyline points="4.5,0.5 1,4 4.5,7.5"/></>
          : <><line x1="0" y1="4" x2="13" y2="4"/><polyline points="9.5,0.5 13,4 9.5,7.5"/></>}
      </svg>
    </button>
  );
}

function Thumb({ src, caption, camPos, onOpen }: { src: string; caption: string; camPos?: CamPos; onOpen: (src: string, cap: string, camPos?: CamPos) => void }) {
  return (
    <figure className="thumb">
      <button className="thumb__frame" onClick={() => onOpen(src, caption, camPos)}
              aria-label={camPos ? `Enlarge and fly to view: ${caption}` : `Enlarge: ${caption}`}>
        <SafeImg src={src} alt="" loading="lazy" />
        {camPos && <span className="thumb__tag">View</span>}
      </button>
      <figcaption className="thumb__cap">{displayCaption(caption)}</figcaption>
    </figure>
  );
}

/* Image with a quiet loading tone and a typeset error state */
function SafeImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  if (state === 'error') {
    return <span className="img-missing" role="img" aria-label={props.alt || 'Image unavailable'}>Image unavailable</span>;
  }
  return (
    <img
      {...props}
      className={`${props.className ?? ''} img-${state}`.trim()}
      onLoad={() => setState('ready')}
      onError={() => setState('error')}
    />
  );
}

/* ── Helpers ── */

/** Display-only: a caption that is just "<index> unknown" / "<index> author unknown" reads "<index>  Source unknown". */
function displayCaption(cap: string): string {
  const m = cap.match(/^(\S+)\s+(?:author\s+)?unknown\.?$/i);
  return m ? `${m[1]}  Source unknown` : cap;
}

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
