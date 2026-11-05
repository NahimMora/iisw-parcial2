import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Contenedor para diagramas SVG. En pantallas chicas el diagrama mantiene un ancho
 * mínimo legible y se desliza horizontalmente; el botón "Ampliar" lo abre en
 * pantalla completa con zoom (botones y pellizco).
 */
export function Zoomable({ w, children }: { w: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const minW = Math.round(w * 0.9);
  return (
    <>
      <div className="dia-wrap">
        <div className="dia-scroll"><div style={{ ['--minw' as string]: `${minW}px` }} className="dia-inner">{children}</div></div>
        <button type="button" className="dia-zoom" onClick={() => setOpen(true)} aria-label="Ampliar diagrama">⤢ Ampliar</button>
      </div>
      {open && <Overlay w={w} onClose={() => setOpen(false)}>{children}</Overlay>}
    </>
  );
}

function Overlay({ w, onClose, children }: { w: number; onClose: () => void; children: ReactNode }) {
  const fit = Math.min(1.6, Math.max(0.5, (window.innerWidth - 24) / w));
  const [k, setK] = useState(Math.max(fit, window.innerWidth < 700 ? 1 : fit));
  const pts = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; k: number } | null>(null);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [onClose]);
  const dist = () => { const a = [...pts.current.values()]; return a.length < 2 ? 0 : Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); };
  const clamp = (v: number) => Math.min(3, Math.max(0.4, v));
  return (
    <div className="dia-overlay" role="dialog" aria-modal="true" aria-label="Diagrama ampliado">
      <div className="dia-bar">
        <button type="button" className="btn small" onClick={() => setK((v) => clamp(v / 1.25))} aria-label="Alejar">－</button>
        <span className="hint">{Math.round(k * 100)} %</span>
        <button type="button" className="btn small" onClick={() => setK((v) => clamp(v * 1.25))} aria-label="Acercar">＋</button>
        <button type="button" className="btn small" onClick={() => setK(fit)}>Ajustar</button>
        <button type="button" className="btn small primary" onClick={onClose} style={{ marginLeft: 'auto' }}>Cerrar ✕</button>
      </div>
      <div className="dia-overlay-body"
        onPointerDown={(e) => { pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pts.current.size === 2) pinch.current = { d: dist(), k }; }}
        onPointerMove={(e) => { if (!pts.current.has(e.pointerId)) return; pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pinch.current && pts.current.size === 2) { const d = dist(); if (pinch.current.d > 0) setK(clamp(pinch.current.k * (d / pinch.current.d))); } }}
        onPointerUp={(e) => { pts.current.delete(e.pointerId); if (pts.current.size < 2) pinch.current = null; }}
        onPointerCancel={(e) => { pts.current.delete(e.pointerId); pinch.current = null; }}>
        <div style={{ width: w * k, margin: '0 auto' }} className="dia-overlay-inner">{children}</div>
      </div>
    </div>
  );
}
