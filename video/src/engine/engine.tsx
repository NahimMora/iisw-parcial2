import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';

export interface BeatTiming { id: string; file: string; start: number; dur: number; audio: number; text: string }
export interface Timing { fps: number; total: number; beats: BeatTiming[] }

export const W = 1280, H = 720;
export const C = {
  bg: '#0f1626', bg2: '#16203a', ink: '#eef2fb', muted: '#8f9bb8', line: '#3a4766',
  actor: '#ff8fab', iface: '#6ea8ff', ctrl: '#ffb35c', entity: '#6fd69a', sys: '#b39dff',
  bad: '#ff5d5d', good: '#53d88a', warn: '#ffd166', req: '#ffd166', accent: '#6ea8ff',
};
export const FONT = '"Segoe UI", "Helvetica Neue", Arial, sans-serif';

interface Ctx { frame: number; t: Timing; idx: Record<string, BeatTiming> }
const TCtx = createContext<Ctx | null>(null);

export function useT() {
  const c = useContext(TCtx)!;
  const at = (id: string) => { const b = c.idx[id]; if (!b) throw new Error('beat ' + id); return b.start; };
  const end = (id: string) => { const b = c.idx[id]; return b.start + b.dur; };
  const ease = Easing.bezier(0.33, 0, 0.2, 1);
  /** progreso 0..1 desde el inicio del beat (+ delay en segundos), con duración en segundos */
  const p = (id: string, delay = 0, dur = 0.7) => interpolate(c.frame, [at(id) + delay * c.t.fps, at(id) + (delay + dur) * c.t.fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  /** progreso relativo a la fracción del audio del beat (0..1) — para sincronizar con frases */
  const pf = (id: string, frac: number, dur = 0.6) => { const b = c.idx[id]; return p(id, (b.audio * frac) / c.t.fps, dur); };
  const on = (id: string) => c.frame >= at(id);
  return { frame: c.frame, fps: c.t.fps, at, end, p, pf, on, timing: c.t };
}

/** Escena visible entre dos beats con fundido. */
export function Scene({ from, to, children }: { from: string; to?: string; children: React.ReactNode }) {
  const { frame, at, timing } = useT();
  const a = at(from), b = to ? at(to) : timing.total + 100;
  if (frame < a - 1 || frame > b + 14) return null;
  const op = Math.min(interpolate(frame, [a, a + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), interpolate(frame, [b, b + 12], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
}

export function Video({ timing, children, title, vid }: { timing: Timing; children: React.ReactNode; title: string; vid: string }) {
  const frame = useCurrentFrame();
  const idx = Object.fromEntries(timing.beats.map((b) => [b.id, b]));
  return (
    <TCtx.Provider value={{ frame, t: timing, idx }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 20%, ${C.bg2}, ${C.bg} 70%)`, fontFamily: FONT, color: C.ink }}>
        {children}
        <Subtitles timing={timing} />
        <div style={{ position: 'absolute', top: 18, left: 26, fontSize: 15, color: C.muted, letterSpacing: 1 }}>IISW · {title}</div>
      </AbsoluteFill>
      {timing.beats.map((b) => (
        <Sequence key={b.id} from={b.start} durationInFrames={b.audio + 6}>
          <Audio src={staticFile(`audio/${vid}/${b.file}`)} />
        </Sequence>
      ))}
    </TCtx.Provider>
  );
}

/** Subtítulos inferiores: el texto del beat en fragmentos de ~13 palabras, por proporción de caracteres. */
function Subtitles({ timing }: { timing: Timing }) {
  const frame = useCurrentFrame();
  const b = timing.beats.find((x) => frame >= x.start && frame < x.start + x.audio + 4);
  if (!b) return null;
  const words = b.text.split(/\s+/);
  const chunks: string[] = []; let cur: string[] = [];
  for (const w of words) { cur.push(w); if (cur.join(' ').length > 72 || /[.;:?!]$/.test(w) && cur.join(' ').length > 30) { chunks.push(cur.join(' ')); cur = []; } }
  if (cur.length) chunks.push(cur.join(' '));
  const total = chunks.reduce((s, c) => s + c.length, 0);
  let acc = 0; const rel = (frame - b.start) / Math.max(1, b.audio);
  let chunk = chunks[chunks.length - 1];
  for (const c of chunks) { acc += c.length; if (rel <= acc / total) { chunk = c; break; } }
  return (
    <div style={{ position: 'absolute', bottom: 22, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(5,9,18,.78)', padding: '7px 16px', borderRadius: 8, fontSize: 24, maxWidth: 1100, textAlign: 'center', lineHeight: 1.3 }}>{chunk}</div>
    </div>
  );
}

// ---------------- Primitivas SVG ----------------
export function Stage({ children, zoom = 1, cx = W / 2, cy = H / 2 }: { children: React.ReactNode; zoom?: number; cx?: number; cy?: number }) {
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill={C.ink} /></marker>
        <marker id="ahw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill={C.warn} /></marker>
        <marker id="ahr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill={C.bad} /></marker>
        <marker id="tri" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="13" markerHeight="13" orient="auto"><path d="M1,1 L11,6 L1,11 Z" fill={C.bg} stroke={C.ink} strokeWidth="1.4" /></marker>
      </defs>
      <g transform={`translate(${W / 2} ${H / 2}) scale(${zoom}) translate(${-cx} ${-cy})`}>{children}</g>
    </svg>
  );
}

export function Txt({ x, y, p = 1, size = 26, color = C.ink, anchor = 'middle', weight = 500, children, italic }: { x: number; y: number; p?: number; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number; children: React.ReactNode; italic?: boolean }) {
  return <text x={x} y={y + (1 - p) * 12} opacity={p} fontSize={size} fill={color} textAnchor={anchor} fontWeight={weight} fontFamily={FONT} fontStyle={italic ? 'italic' : undefined}>{children}</text>;
}

export function Stick({ x, y, p = 1, color = C.actor, s = 1 }: { x: number; y: number; p?: number; color?: string; s?: number }) {
  const d = (k: number) => Math.max(0, Math.min(1, p * 5 - k));
  return (
    <g stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={-34} r={11} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d(0)} />
      <line x1={0} y1={-23} x2={0} y2={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d(1)} />
      <line x1={-17} y1={-12} x2={17} y2={-12} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d(2)} />
      <line x1={0} y1={8} x2={-14} y2={30} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d(3)} />
      <line x1={0} y1={8} x2={14} y2={30} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d(4)} />
    </g>
  );
}

export function Actor({ x, y, name, p = 1, color = C.actor, size = 19 }: { x: number; y: number; name: string; p?: number; color?: string; size?: number }) {
  return <g><Stick x={x} y={y} p={p} color={color} />{name.split('\n').map((l, i) => <Txt key={i} x={x} y={y + 56 + i * (size + 3)} p={Math.max(0, p * 2 - 1)} size={size} color={color} weight={600}>{l}</Txt>)}</g>;
}

export function UC({ cx, cy, rx = 120, ry = 36, text, p = 1, color = C.ink, fill = 'rgba(255,255,255,.04)', size = 19 }: { cx: number; cy: number; rx?: number; ry?: number; text: string; p?: number; color?: string; fill?: string; size?: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} fillOpacity={p} stroke={color} strokeWidth={2.4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      {text.split('\n').map((l, i, a) => <Txt key={i} x={cx} y={cy + 7 + (i - (a.length - 1) / 2) * (size + 2)} p={Math.max(0, p * 2 - 1)} size={size} color={color}>{l}</Txt>)}
    </g>
  );
}

export function Rect({ x, y, w, h, p = 1, color = C.sys, fill = 'none', r = 10, sw = 2.4, dash }: { x: number; y: number; w: number; h: number; p?: number; color?: string; fill?: string; r?: number; sw?: number; dash?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} fillOpacity={p} stroke={color} strokeWidth={sw} pathLength={dash ? undefined : 1} strokeDasharray={dash ?? 1} strokeDashoffset={dash ? 0 : 1 - p} opacity={dash ? p : 1} />;
}

export function Ln({ x1, y1, x2, y2, p = 1, color = C.ink, sw = 2.4, arrow, dash }: { x1: number; y1: number; x2: number; y2: number; p?: number; color?: string; sw?: number; arrow?: 'ah' | 'ahw' | 'ahr' | 'tri'; dash?: boolean }) {
  if (p <= 0) return null;
  const x = x1 + (x2 - x1) * p, y = y1 + (y2 - y1) * p;
  return <line x1={x1} y1={y1} x2={x} y2={y} stroke={color} strokeWidth={sw} strokeDasharray={dash ? '9 7' : undefined} markerEnd={arrow && p > 0.92 ? `url(#${arrow})` : undefined} strokeLinecap="round" />;
}

export function Cross({ x, y, s = 40, p = 1, color = C.bad }: { x: number; y: number; s?: number; p?: number; color?: string }) {
  return <g stroke={color} strokeWidth={6} strokeLinecap="round"><Ln x1={x - s} y1={y - s} x2={x + s} y2={y + s} p={Math.min(1, p * 2)} color={color} sw={6} /><Ln x1={x + s} y1={y - s} x2={x - s} y2={y + s} p={Math.max(0, p * 2 - 1)} color={color} sw={6} /></g>;
}

export function Check({ x, y, p = 1, color = C.good, s = 1 }: { x: number; y: number; p?: number; color?: string; s?: number }) {
  return <path d={`M${x - 14 * s},${y} l${10 * s},${11 * s} l${20 * s},-${24 * s}`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
}

export function Chip({ x, y, text, p = 1, color = C.accent, w, size = 20, textColor = C.bg }: { x: number; y: number; text: string; p?: number; color?: string; w?: number; size?: number; textColor?: string }) {
  const ww = w ?? text.length * size * 0.56 + 30;
  return <g opacity={p} transform={`translate(${x} ${y + (1 - p) * 14})`}><rect x={-ww / 2} y={-size} width={ww} height={size * 1.75} rx={size * 0.85} fill={color} /><text x={0} y={size * 0.28} textAnchor="middle" fontSize={size} fontWeight={700} fill={textColor} fontFamily={FONT}>{text}</text></g>;
}

/** Tarjeta de texto HTML posicionada (para párrafos y listas). */
export function Card({ x, y, w, p = 1, children, border = C.line, bg = 'rgba(255,255,255,.05)', size = 22, glow }: { x: number; y: number; w: number; p?: number; children: React.ReactNode; border?: string; bg?: string; size?: number; glow?: string }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y + (1 - p) * 16, width: w, opacity: p, border: `2px solid ${glow ?? border}`, background: glow ? `${glow}22` : bg, borderRadius: 14, padding: '12px 18px', fontSize: size, lineHeight: 1.4, boxShadow: glow ? `0 0 24px ${glow}55` : undefined, transition: 'none' }}>
      {children}
    </div>
  );
}

export function Title({ title, sub, p = 1 }: { title: string; sub?: string; p?: number }) {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', opacity: p }}>
      <div style={{ fontSize: 58, fontWeight: 800, letterSpacing: -0.5, transform: `translateY(${(1 - p) * 20}px)` }}>{title}</div>
      {sub && <div style={{ fontSize: 26, color: C.muted, marginTop: 14 }}>{sub}</div>}
    </div>
  );
}

export function Heading({ text, p = 1, color = C.ink }: { text: string; p?: number; color?: string }) {
  return <div style={{ position: 'absolute', left: 60, top: 52, fontSize: 36, fontWeight: 800, opacity: p, color, transform: `translateX(${(1 - p) * -20}px)` }}>{text}</div>;
}

// --------- Estereotipos de análisis ---------
export function StereoIcon({ kind, x, y, p = 1, r = 30 }: { kind: 'interface' | 'control' | 'entity' | 'actor'; x: number; y: number; p?: number; r?: number }) {
  if (kind === 'actor') return <Stick x={x} y={y + 12} p={p} />;
  const color = kind === 'interface' ? C.iface : kind === 'control' ? C.ctrl : C.entity;
  const q = Math.max(0, p * 1.6 - 0.6);
  return (
    <g stroke={color} strokeWidth={3} fill="none" strokeLinecap="round">
      <circle cx={x} cy={y} r={r} fill={`${color}22`} fillOpacity={p} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, p * 1.6)} />
      {kind === 'interface' && <g opacity={q}><line x1={x - r - 14} y1={y - r * 0.8} x2={x - r - 14} y2={y + r * 0.8} /><line x1={x - r - 14} y1={y} x2={x - r} y2={y} /></g>}
      {kind === 'control' && <path opacity={q} d={`M${x + 2},${y - r} l-11,-9 M${x + 2},${y - r} l-11,9`} strokeWidth={3.4} />}
      {kind === 'entity' && <line opacity={q} x1={x - r} y1={y + r + 6} x2={x + r} y2={y + r + 6} />}
    </g>
  );
}

export const stereoColor = { actor: C.actor, interface: C.iface, control: C.ctrl, entity: C.entity } as const;

export function audioPath(vid: string, file: string) { return `audio/${vid}/${file}`; }
export { AbsoluteFill, interpolate };
