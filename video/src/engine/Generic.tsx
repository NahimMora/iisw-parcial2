// Video genérico guiado por datos: cada beat del script.json declara su escena.
import React from 'react';
import { C, Check, Cross, Heading, Ln, Scene, Stage, Txt, Video, useT, type Timing } from './engine';

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
  | { type: 'quote'; heading: string; quote: string; who: string; items?: Item[] };
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
