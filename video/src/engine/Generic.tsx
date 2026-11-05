// Video genérico guiado por datos: cada beat del script.json declara su escena.
import React from 'react';
import { Actor, C, Check, Cross, Heading, Ln, Rect, Scene, Stage, StereoIcon, Txt, UC, Video, stereoColor, useT, type Timing } from './engine';

export type Item = { t: string; d?: string; c?: string; at?: number; l?: string };
export type SceneSpec =
  | { type: 'title'; title: string; sub?: string }
  | { type: 'flow'; heading: string; items: Item[]; note?: Item }
  | { type: 'tree'; heading: string; root: string; items: Item[]; note?: Item }
  | { type: 'compare'; heading: string; left: string; right: string; rows: { k: string; l: string; r: string; at?: number }[]; same?: Item }
  | { type: 'cards'; heading: string; items: Item[]; cols?: number; note?: Item }
  | { type: 'check'; heading: string; items: Item[] }
  | { type: 'quiz'; heading: string; q: string; options: string[]; answer: number; at?: number; why?: string }
  | { type: 'letters'; heading: string; items: Item[] }
  | { type: 'quote'; heading: string; quote: string; who: string; items?: Item[] }
  | { type: 'uc'; heading: string; system: string; actors: { n: string; side: 'l' | 'r'; y: number; at?: number; bad?: boolean }[]; cases: { t: string; at?: number }[]; links: { a: number; c: number; at?: number }[]; note?: Item }
  | { type: 'seq'; heading: string; parts: { n: string; k: 'actor' | 'interface' | 'control' | 'entity'; at?: number }[]; msgs: { f: number; t: number; l: string; at?: number; c?: string }[]; note?: Item }
  | { type: 'desc'; heading: string; rows: { k: string; v: string; at?: number; c?: string }[] }
  | { type: 'act'; heading: string; lanes: string[]; steps: { lane: number; kind: 'start' | 'end' | 'act' | 'dec'; t?: string; no?: string; at?: number }[] };
export interface GenericBeat { id: string; text: string; scene?: SceneSpec }

const PAL = [C.iface, C.ctrl, C.entity, C.actor, C.sys, C.warn];
const col = (i: number, c?: string) => c ?? PAL[i % PAL.length];

function treePos(i: number, n: number) {
  const w = Math.min(280, 1120 / n - 14);
  const x = 80 + (i + 0.5) * (1120 / n);
  const mid = (n - 1) / 2;
  const curve = n <= 1 ? 0 : 1 - Math.pow((i - mid) / Math.max(1, mid), 2);
  const y = n > 4 ? 345 + (i % 2) * 105 + curve * 20 : 330 + curve * 120;
  return { x, y, w };
}

function Note({ id, n }: { id: string; n?: Item }) {
  const { pf } = useT();
  if (!n) return null;
  return <div style={{ position: 'absolute', left: 80, right: 80, top: 545, textAlign: 'center', fontSize: 25, fontWeight: 700, color: n.c ?? C.warn, opacity: pf(id, n.at ?? 0.85) }}>{n.t}</div>;
}

function Render({ id, s }: { id: string; s: SceneSpec }) {
  const { p, pf } = useT();
  const at = (it: { at?: number }, i: number, n: number) => pf(id, it.at ?? 0.08 + (0.8 * i) / Math.max(1, n));
  switch (s.type) {
    case 'title':
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <div><div style={{ fontSize: 62, fontWeight: 800, opacity: p(id), transform: `translateY(${(1 - p(id)) * 20}px)` }}>{s.title}</div>
            {s.sub && <div style={{ fontSize: 28, color: C.muted, marginTop: 16, opacity: p(id, 0.5) }}>{s.sub}</div>}</div>
        </div>
      );
    case 'flow': {
      const n = s.items.length; const w = Math.min(260, (1160 - (n - 1) * 40) / n);
      const x0 = (1280 - (n * w + (n - 1) * 40)) / 2;
      return (
        <>
          <Heading text={s.heading} p={p(id)} />
          <Stage>{s.items.map((it, i) => i < n - 1 && <Ln key={i} x1={x0 + i * (w + 40) + w + 4} y1={330} x2={x0 + (i + 1) * (w + 40) - 6} y2={330} p={at(s.items[i + 1], i + 1, n)} arrow="ah" />)}</Stage>
          {s.items.map((it, i) => {
            const q = at(it, i, n);
            return (
              <div key={i} style={{ position: 'absolute', left: x0 + i * (w + 40), top: 250, width: w, minHeight: 160, opacity: q, transform: `translateY(${(1 - q) * 18}px)`, border: `3px solid ${col(i, it.c)}`, background: `${col(i, it.c)}1c`, borderRadius: 16, padding: '14px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: n > 4 ? 22 : 26, fontWeight: 800, color: col(i, it.c) }}>{it.t}</div>
                {it.d && <div style={{ fontSize: n > 4 ? 17 : 19, marginTop: 8, color: C.ink }}>{it.d}</div>}
              </div>
            );
          })}
          <Note id={id} n={s.note} />
        </>
      );
    }
    case 'tree': {
      const n = s.items.length;
      return (
        <>
          <Heading text={s.heading} p={p(id)} />
          <Stage>
            {s.items.map((it, i) => {
              const { x, y } = treePos(i, n);
              return <Ln key={i} x1={640} y1={250} x2={x} y2={y - 26} p={at(it, i, n)} color={col(i, it.c)} />;
            })}
          </Stage>
          <div style={{ position: 'absolute', left: 490, top: 205, width: 300, textAlign: 'center', fontSize: 30, fontWeight: 800, padding: '12px 10px', borderRadius: 16, background: C.bg2, border: `3px solid ${C.ink}`, opacity: p(id, 0.2) }}>{s.root}</div>
          {s.items.map((it, i) => {
            const { x, y, w } = treePos(i, n);
            const q = at(it, i, n);
            return (
              <div key={i} style={{ position: 'absolute', left: x - w / 2, top: y - 26, width: w, textAlign: 'center', opacity: q, transform: `scale(${0.9 + 0.1 * q})`, background: C.bg, border: `2.5px solid ${col(i, it.c)}`, borderRadius: 14, padding: '8px 10px' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: col(i, it.c) }}>{it.t}</div>
                {it.d && <div style={{ fontSize: 16, color: C.ink, marginTop: 3 }}>{it.d}</div>}
              </div>
            );
          })}
          <Note id={id} n={s.note} />
        </>
      );
    }
    case 'compare':
      return (
        <>
          <Heading text={s.heading} p={p(id)} />
          <div style={{ position: 'absolute', left: 60, right: 60, top: 120, fontSize: 22 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr', gap: 10, opacity: p(id, 0.2), fontWeight: 800, fontSize: 28 }}>
              <span /><span style={{ color: C.ctrl }}>{s.left}</span><span style={{ color: C.iface }}>{s.right}</span>
            </div>
            {s.rows.map((r, i) => {
              const q = at(r, i, s.rows.length);
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr', gap: 10, marginTop: 10, opacity: q, transform: `translateX(${(1 - q) * -16}px)` }}>
                  <span style={{ color: C.muted, fontWeight: 700 }}>{r.k}</span>
                  <span style={{ background: `${C.ctrl}1c`, border: `2px solid ${C.ctrl}66`, borderRadius: 10, padding: '8px 12px' }}>{r.l}</span>
                  <span style={{ background: `${C.iface}1c`, border: `2px solid ${C.iface}66`, borderRadius: 10, padding: '8px 12px' }}>{r.r}</span>
                </div>
              );
            })}
          </div>
          <Note id={id} n={s.same} />
        </>
      );
    case 'cards': {
      const cols = s.cols ?? Math.min(3, s.items.length);
      const w = (1160 - (cols - 1) * 20) / cols;
      return (
        <>
          <Heading text={s.heading} p={p(id)} />
          {s.items.map((it, i) => {
            const q = at(it, i, s.items.length);
            const r = Math.floor(i / cols), c = i % cols;
            return (
              <div key={i} style={{ position: 'absolute', left: 60 + c * (w + 20), top: 125 + r * 140, width: w, height: 122, opacity: q, transform: `translateY(${(1 - q) * 14}px)`, borderLeft: `7px solid ${col(i, it.c)}`, background: 'rgba(255,255,255,.05)', borderRadius: 12, padding: '10px 16px' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: col(i, it.c) }}>{it.t}</div>
                {it.d && <div style={{ fontSize: 19, marginTop: 4 }}>{it.d}</div>}
              </div>
            );
          })}
          <Note id={id} n={s.note} />
        </>
      );
    }
    case 'letters':
      return (
        <>
          <Heading text={s.heading} p={p(id)} />
          {s.items.map((it, i) => {
            const q = at(it, i, s.items.length);
            return (
              <div key={i} style={{ position: 'absolute', left: 70 + i * 190, top: 170, width: 170, textAlign: 'center', opacity: q }}>
                <div style={{ fontSize: 120, fontWeight: 900, color: col(i, it.c), lineHeight: 1, transform: `scale(${0.6 + 0.4 * q})` }}>{it.l ?? it.t[0]}</div>
                <div style={{ fontSize: 23, fontWeight: 800, marginTop: 6 }}>{it.t}</div>
                {it.d && <div style={{ fontSize: 16, color: C.muted, marginTop: 6 }}>{it.d}</div>}
              </div>
            );
          })}
        </>
      );
    case 'check':
      return (
        <>
          <Heading text={s.heading} p={p(id)} />
          {s.items.map((it, i) => {
            const q = at(it, i, s.items.length);
            return (
              <React.Fragment key={i}>
                <svg width={1280} height={720} style={{ position: 'absolute', inset: 0 }}><Check x={210} y={160 + i * 66} p={q} /></svg>
                <div style={{ position: 'absolute', left: 250, top: 140 + i * 66, fontSize: 28, opacity: q }}>{it.t}</div>
              </React.Fragment>
            );
          })}
        </>
      );
    case 'quiz': {
      const rv = pf(id, s.at ?? 0.7);
      return (
        <>
          <Heading text={s.heading} p={p(id)} color={C.warn} />
          <div style={{ position: 'absolute', left: 80, right: 80, top: 120, fontSize: 30, fontWeight: 700, opacity: p(id, 0.2) }}>{s.q}</div>
          {s.options.map((o, i) => {
            const right = i === s.answer;
            return (
              <div key={i} style={{ position: 'absolute', left: 100, right: 100, top: 230 + i * 80, fontSize: 25, opacity: pf(id, 0.1 + i * 0.06), border: `2.5px solid ${rv > 0.5 ? (right ? C.good : C.line) : C.line}`, background: rv > 0.5 && right ? `${C.good}22` : 'rgba(255,255,255,.04)', borderRadius: 12, padding: '12px 18px' }}>
                <b style={{ color: C.muted, marginRight: 12 }}>{String.fromCharCode(65 + i)}</b>{o}
              </div>
            );
          })}
          <Stage>{s.options.map((_, i) => i !== s.answer && <Cross key={i} x={1150} y={260 + i * 80} s={14} p={rv} />)}<Check x={1150} y={262 + s.answer * 80} p={rv} /></Stage>
          {s.why && <div style={{ position: 'absolute', left: 100, right: 100, top: 240 + s.options.length * 80, fontSize: 22, color: C.good, opacity: pf(id, (s.at ?? 0.7) + 0.08) }}>{s.why}</div>}
        </>
      );
    }
    case 'uc': {
      const n = s.cases.length; const top = 165, bot = 610; const gap = (bot - top) / n;
      const cy = (i: number) => top + gap * (i + 0.5);
      const ax = (side: 'l' | 'r') => (side === 'l' ? 175 : 1105);
      return (
        <>
          <Heading text={s.heading} p={p(id)} />
          <Stage>
            <Rect x={330} y={118} w={620} h={505} p={p(id, 0.2, 1)} />
            <Txt x={640} y={148} size={20} color={C.sys} weight={700} p={p(id, 0.5)}>{s.system}</Txt>
            {s.links.map((l, i) => { const a = s.actors[l.a]; const left = a.side === 'l'; return <Ln key={i} x1={ax(a.side) + (left ? 30 : -30)} y1={a.y - 10} x2={640 + (left ? -205 : 205)} y2={cy(l.c)} p={at(l, i, s.links.length)} color={C.muted} />; })}
            {s.cases.map((c, i) => <UC key={i} cx={640} cy={cy(i)} rx={205} ry={Math.min(36, gap / 2 - 6)} text={c.t} p={at(c, i, n)} size={20} />)}
            {s.actors.map((a, i) => <g key={i}><Actor x={ax(a.side)} y={a.y} name={a.n} p={at(a, i, s.actors.length)} color={a.bad ? C.bad : C.actor} />{a.bad && <Cross x={ax(a.side)} y={a.y - 5} s={70} p={pf(id, a.at ?? 0.5, 0.5)} />}</g>)}
          </Stage>
          <Note id={id} n={s.note} />
        </>
      );
    }
    case 'seq': {
      const n = s.parts.length; const xs = s.parts.map((_, i) => 110 + (i * 1060) / Math.max(1, n - 1));
      const top = 92, y0 = 200; const row = Math.min(42, (700 - y0) / Math.max(1, s.msgs.length));
      return (
        <>
          <Stage>
            {s.parts.map((q, i) => { const pp = at(q, i, n); return (
              <g key={i} opacity={pp}>
                <StereoIcon kind={q.k} x={xs[i]} y={top + 18} p={pp} r={22} />
                <Txt x={xs[i]} y={top + 70} size={18} weight={700} color={stereoColor[q.k]} p={pp}>{q.n}</Txt>
                <line x1={xs[i]} y1={top + 82} x2={xs[i]} y2={y0 + s.msgs.length * row} stroke={C.line} strokeWidth={2} strokeDasharray="7 7" />
              </g>); })}
            {s.msgs.map((m, i) => {
              const q = at(m, i, s.msgs.length); if (q <= 0) return null;
              const y = y0 + i * row + 6; const x1 = xs[m.f], x2 = xs[m.t];
              const lab = `${i + 1}: ${m.c ? `[${m.c}] ` : ''}${m.l}`;
              if (m.f === m.t) return (
                <g key={i} opacity={Math.min(1, q * 1.5)}>
                  <path d={`M${x1 + 7},${y - 8} h46 v20 h-40`} fill="none" stroke={C.warn} strokeWidth={2.4} markerEnd="url(#ahw)" />
                  <Txt x={x1 + 60} y={y + 8} anchor="start" size={17} color={C.warn} p={q}>{lab}</Txt>
                </g>);
              const d = x2 > x1 ? 1 : -1;
              return (
                <g key={i}>
                  <Ln x1={x1 + d * 7} y1={y} x2={x2 - d * 8} y2={y} p={q} color={m.c ? C.warn : C.ink} arrow={m.c ? 'ahw' : 'ah'} />
                  <Txt x={(x1 + x2) / 2} y={y - 7} size={17} color={m.c ? C.warn : C.ink} p={q}>{lab}</Txt>
                </g>);
            })}
          </Stage>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 16, textAlign: 'center', fontSize: 32, fontWeight: 800, opacity: p(id) }}>{s.heading}</div>
          <Note id={id} n={s.note} />
        </>
      );
    }
    case 'desc':
      return (
        <>
          <Heading text={s.heading} p={p(id)} />
          <div style={{ position: 'absolute', left: 110, right: 110, top: 108, border: `2px solid ${C.line}`, borderRadius: 12, overflow: 'hidden' }}>
            {s.rows.map((r, i) => {
              const q = at(r, i, s.rows.length);
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', borderTop: i ? `1px solid ${C.line}` : 'none', opacity: Math.max(0.06, q), background: q > 0.5 && r.c ? `${r.c}22` : 'transparent' }}>
                  <div style={{ padding: '4px 14px', fontWeight: 800, color: r.c ?? C.iface, fontSize: 19, background: 'rgba(255,255,255,.04)' }}>{r.k}</div>
                  <div style={{ padding: '4px 14px', fontSize: 19 }}>{r.v}</div>
                </div>
              );
            })}
          </div>
        </>
      );
    case 'act': {
      const lw = 1000 / s.lanes.length; const lx = (l: number) => 140 + lw * l + lw / 2;
      const rowH = Math.min(62, 500 / s.steps.length); const sy = (i: number) => 178 + i * rowH + rowH / 2;
      return (
        <>
          <Heading text={s.heading} p={p(id)} />
          <Stage>
            {s.lanes.map((l, i) => <g key={i}><Rect x={140 + lw * i} y={112} w={lw} h={596} p={p(id, 0.1, 0.8)} color={C.line} r={0} /><Txt x={lx(i)} y={150} size={22} weight={700} color={C.sys} p={p(id, 0.3)}>{l}</Txt></g>)}
            {s.steps.slice(1).map((st, k) => { const a = s.steps[k]; return <Ln key={k} x1={lx(a.lane)} y1={sy(k) + (a.kind === 'start' ? 11 : 21)} x2={lx(st.lane)} y2={sy(k + 1) - (st.kind === 'end' ? 15 : 22)} p={at(st, k + 1, s.steps.length)} arrow="ah" color={C.muted} />; })}
            {s.steps.map((st, i) => {
              const q = at(st, i, s.steps.length); const x = lx(st.lane), y = sy(i);
              if (st.kind === 'start') return <circle key={i} cx={x} cy={y} r={11} fill={C.ink} opacity={q} />;
              if (st.kind === 'end') return <g key={i} opacity={q}><circle cx={x} cy={y} r={14} fill="none" stroke={C.ink} strokeWidth={2.5} /><circle cx={x} cy={y} r={8} fill={C.ink} /></g>;
              if (st.kind === 'dec') return (
                <g key={i} opacity={q}>
                  <polygon points={`${x},${y - 22} ${x + 125},${y} ${x},${y + 22} ${x - 125},${y}`} fill={C.bg} stroke={C.warn} strokeWidth={2.5} />
                  <Txt x={x} y={y + 7} size={18}>{st.t}</Txt>
                  <Txt x={x + 12} y={y + 38} size={15} color={C.good} anchor="start">[sí]</Txt>
                  {st.no && <><Ln x1={x - 125} y1={y} x2={x - 200} y2={y} arrow="ahr" color={C.bad} /><Txt x={x - 160} y={y - 8} size={15} color={C.bad}>[no]</Txt><Txt x={x - 208} y={y + 6} size={17} anchor="end" color={C.bad}>{st.no}</Txt></>}
                </g>);
              return <g key={i} opacity={q}><rect x={x - 170} y={y - 21} width={340} height={42} rx={21} fill={C.bg} stroke={C.iface} strokeWidth={2.4} /><Txt x={x} y={y + 7} size={19}>{st.t}</Txt></g>;
            })}
          </Stage>
        </>
      );
    }
    case 'quote':
      return (
        <>
          <Heading text={s.heading} p={p(id)} />
          <div style={{ position: 'absolute', left: 120, right: 120, top: 160, fontSize: 34, fontStyle: 'italic', lineHeight: 1.4, opacity: p(id, 0.3), borderLeft: `8px solid ${C.good}`, paddingLeft: 28 }}>“{s.quote}”
            <div style={{ fontSize: 22, color: C.muted, fontStyle: 'normal', marginTop: 12 }}>— {s.who}</div></div>
          {s.items?.map((it, i) => <div key={i} style={{ position: 'absolute', left: 150, top: 400 + i * 52, fontSize: 25, opacity: at(it, i, s.items!.length), color: col(i, it.c) }}>• {it.t}</div>)}
        </>
      );
  }
}

export function GenericVideo({ timing, beats, vid, title }: { timing: Timing; beats: GenericBeat[]; vid: string; title: string }) {
  // un beat sin escena continúa la escena del anterior
  const groups: { from: string; to?: string; id: string; s: SceneSpec }[] = [];
  beats.forEach((b) => { if (b.scene) groups.push({ from: b.id, id: b.id, s: b.scene }); });
  groups.forEach((g, i) => { g.to = groups[i + 1]?.from; });
  return (
    <Video timing={timing} vid={vid} title={title}>
      {groups.map((g) => <Scene key={g.id} from={g.from} to={g.to}><Render id={g.id} s={g.s} /></Scene>)}
      <Stage><Txt x={0} y={0} p={0}> </Txt></Stage>
    </Video>
  );
}
