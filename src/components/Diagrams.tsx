import type { CUDescription, DiagramSpec, SequenceDiagramSpec, Stereo, UseCaseDiagramSpec } from '../content/types';

export function Diagram({ spec, highlight }: { spec: DiagramSpec; highlight?: Set<string> }) {
  return spec.kind === 'usecase' ? <UseCaseDiagram spec={spec} highlight={highlight} /> : <SequenceDiagram spec={spec} highlight={highlight} />;
}

// ---------------- Casos de uso ----------------
export function useCaseLayout(spec: UseCaseDiagramSpec) {
  const W = 760;
  const cols = spec.cases.length > 5 ? 2 : 1;
  const rows = Math.ceil(spec.cases.length / cols);
  const H = Math.max(260, 70 + rows * 78);
  const sysX = 190, sysW = 380;
  const cases = spec.cases.map((c, i) => {
    const col = cols === 1 ? 0 : i % 2;
    const row = cols === 1 ? i : Math.floor(i / 2);
    const cx = cols === 1 ? sysX + sysW / 2 : sysX + sysW * (col === 0 ? 0.29 : 0.71);
    return { ...c, cx, cy: 62 + row * 78 + (cols === 2 && col === 1 ? 26 : 0) };
  });
  const place = (side: 'left' | 'right') => {
    const list = spec.actors.filter((a) => a.side === side);
    return list.map((a, i) => ({ ...a, ax: a.x ?? (side === 'left' ? 82 : W - 82), ay: a.y ?? Math.round(((i + 1) * H) / (list.length + 1)) }));
  };
  const inside = new Set(spec.insideActors ?? []);
  const actors = [...place('left'), ...place('right')].map((a) => (inside.has(a.id) ? { ...a, ax: a.side === 'left' ? sysX + 50 : sysX + sysW - 50 } : a));
  return { W, H, sysX, sysW, cases, actors };
}

const RX = 74, RY = 25;
function ellipseEdge(cx: number, cy: number, tx: number, ty: number) {
  const dx = tx - cx, dy = ty - cy;
  const t = 1 / Math.sqrt((dx * dx) / (RX * RX) + (dy * dy) / (RY * RY));
  return [cx + dx * t, cy + dy * t];
}

export function StickFigure({ x, y, s = 1, color = 'var(--ink)' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={-26} r={8} fill="var(--paper)" />
      <line x1={0} y1={-18} x2={0} y2={6} />
      <line x1={-13} y1={-9} x2={13} y2={-9} />
      <line x1={0} y1={6} x2={-11} y2={22} />
      <line x1={0} y1={6} x2={11} y2={22} />
    </g>
  );
}

function wrap(text: string, max = 18): string[] {
  const words = text.split(' '); const lines: string[] = []; let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
  if (cur) lines.push(cur);
  return lines;
}

export function UseCaseDiagram({ spec, highlight }: { spec: UseCaseDiagramSpec; highlight?: Set<string> }) {
  const { W, H, sysX, sysW, cases, actors } = useCaseLayout(spec);
  const cById = Object.fromEntries(cases.map((c) => [c.id, c]));
  const aById = Object.fromEntries(actors.map((a) => [a.id, a]));
  const hl = (id: string) => highlight?.has(id);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="diagram" role="img" aria-label={`Diagrama de casos de uso: ${spec.system}`}>
      <defs>
        <marker id="tri-open" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse"><path d="M1,1 L11,6 L1,11 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.3" /></marker>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10" fill="none" stroke="var(--muted)" strokeWidth="1.5" /></marker>
      </defs>
      <rect x={sysX} y={14} width={sysW} height={H - 28} rx={6} fill="var(--sys-fill)" stroke="var(--ink)" strokeWidth={1.6} />
      <text x={sysX + sysW / 2} y={32} textAnchor="middle" className="d-sys">{spec.system}</text>
      {spec.links.map((l, i) => {
        const a = aById[l.actor], c = cById[l.uc];
        if (!a || !c) return null;
        const [ex, ey] = ellipseEdge(c.cx, c.cy, a.ax, a.ay - 8);
        const bad = l.mark === 'bad' || hl(`${l.actor}-${l.uc}`);
        const mx = (a.ax + ex) / 2, my = (a.ay - 8 + ey) / 2;
        return (
          <g key={i}>
            <line x1={a.ax + (a.side === 'left' ? 16 : -16)} y1={a.ay - 8} x2={ex} y2={ey} stroke={bad ? 'var(--bad)' : 'var(--ink)'} strokeWidth={bad ? 2.6 : 1.5} />
            {l.num !== undefined && <g><circle cx={mx} cy={my} r={10} fill="var(--accent)" /><text x={mx} y={my + 4} textAnchor="middle" className="d-num">{l.num}</text></g>}
          </g>
        );
      })}
      {spec.rels?.map((r, i) => {
        const f = cById[r.from], t = cById[r.to];
        if (!f || !t) return null;
        const [x1, y1] = ellipseEdge(f.cx, f.cy, t.cx, t.cy);
        const [x2, y2] = ellipseEdge(t.cx, t.cy, f.cx, f.cy);
        return (
          <g key={`r${i}`}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted)" strokeWidth={1.4} strokeDasharray="6 4" markerEnd="url(#arr)" />
            <text x={(x1 + x2) / 2 + 6} y={(y1 + y2) / 2 - 4} className="d-stereo">«{r.kind}»</text>
          </g>
        );
      })}
      {spec.generalizations?.map((g, i) => {
        const c = aById[g.child], p = aById[g.parent];
        if (!c || !p) return null;
        return <line key={`g${i}`} x1={c.ax} y1={c.ay - 36} x2={p.ax} y2={p.ay + 26} stroke="var(--ink)" strokeWidth={1.5} markerEnd="url(#tri-open)" />;
      })}
      {cases.map((c) => (
        <g key={c.id}>
          <ellipse cx={c.cx} cy={c.cy} rx={RX} ry={RY} fill={hl(c.id) ? 'var(--bad-soft)' : 'var(--uc-fill)'} stroke={hl(c.id) ? 'var(--bad)' : 'var(--ink)'} strokeWidth={1.5} />
          {wrap(c.name).map((ln, i, arr) => (
            <text key={i} x={c.cx} y={c.cy + 4 + (i - (arr.length - 1) / 2) * 13} textAnchor="middle" className="d-uc">{ln}</text>
          ))}
        </g>
      ))}
      {actors.map((a) => (
        <g key={a.id}>
          <StickFigure x={a.ax} y={a.ay} color={hl(a.id) ? 'var(--bad)' : 'var(--ink)'} />
          {wrap(a.name, 16).map((ln, i) => <text key={i} x={a.ax} y={a.ay + 38 + i * 13} textAnchor="middle" className="d-actor" fill={hl(a.id) ? 'var(--bad)' : undefined}>{ln}</text>)}
        </g>
      ))}
    </svg>
  );
}

// ---------------- Secuencia ----------------
export function StereoIcon({ kind, x, y, r = 17, color = 'var(--ink)' }: { kind: Stereo; x: number; y: number; r?: number; color?: string }) {
  if (kind === 'actor') return <StickFigure x={x} y={y + 8} s={r / 17} color={color} />;
  const fill = kind === 'interface' ? 'var(--if-fill)' : kind === 'control' ? 'var(--ct-fill)' : 'var(--en-fill)';
  return (
    <g stroke={color} strokeWidth={1.8} fill={fill}>
      <circle cx={x} cy={y} r={r} />
      {kind === 'interface' && <g fill="none"><line x1={x - r - 9} y1={y - r * 0.8} x2={x - r - 9} y2={y + r * 0.8} /><line x1={x - r - 9} y1={y} x2={x - r} y2={y} /></g>}
      {kind === 'control' && <path d={`M${x + 1},${y - r} l-7,-6 M${x + 1},${y - r} l-7,6`} fill="none" strokeWidth={2} />}
      {kind === 'entity' && <line x1={x - r} y1={y + r + 3} x2={x + r} y2={y + r + 3} />}
    </g>
  );
}

export const STEREO_LABEL: Record<Stereo, string> = { actor: 'Actor', interface: 'Interfaz', control: 'Control', entity: 'Entidad' };

export function SequenceDiagram({ spec, highlight }: { spec: SequenceDiagramSpec; highlight?: Set<string> }) {
  const colW = 138, top = 30, headH = 78, rowH = 44;
  const W = Math.max(420, spec.participants.length * colW + 40);
  const H = top + headH + spec.messages.length * rowH + 40;
  const xOf: Record<string, number> = {};
  spec.participants.forEach((p, i) => { xOf[p.id] = 20 + colW / 2 + i * colW; });
  const y0 = top + headH;
  // períodos de actividad: del primer al último mensaje en que participa cada objeto
  const span: Record<string, [number, number]> = {};
  spec.messages.forEach((m, i) => {
    for (const id of [m.from, m.to]) { const s = span[id]; span[id] = s ? [Math.min(s[0], i), Math.max(s[1], i)] : [i, i]; }
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="diagram" role="img" aria-label="Diagrama de secuencia">
      <defs>
        <marker id="sq-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--ink)" /></marker>
        <marker id="sq-arr-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--bad)" /></marker>
        <marker id="sq-open" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M0,0 L10,5 L0,10" fill="none" stroke="var(--ink)" strokeWidth="1.5" /></marker>
      </defs>
      {spec.participants.map((p) => {
        const x = xOf[p.id];
        const bad = highlight?.has(p.id);
        return (
          <g key={p.id}>
            <StereoIcon kind={p.kind} x={x} y={top + 18} color={bad ? 'var(--bad)' : 'var(--ink)'} />
            <text x={x} y={top + 58} textAnchor="middle" className="d-part" fill={bad ? 'var(--bad)' : undefined}>{p.name}</text>
            <line x1={x} y1={top + headH - 10} x2={x} y2={H - 14} stroke="var(--muted)" strokeDasharray="5 5" strokeWidth={1.2} />
            {spec.activations !== false && span[p.id] && (
              <rect x={x - 5} y={y0 + span[p.id][0] * rowH + 8} width={10} height={(span[p.id][1] - span[p.id][0]) * rowH + 22} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.1} />
            )}
          </g>
        );
      })}
      {spec.messages.map((m, i) => {
        const y = y0 + i * rowH + 22;
        const x1 = xOf[m.from], x2 = xOf[m.to];
        if (x1 === undefined || x2 === undefined) return null;
        const bad = highlight?.has(`m${i}`);
        const col = bad ? 'var(--bad)' : 'var(--ink)';
        const label = `${spec.numbered ? `${i + 1}: ` : ''}${m.cond ? `${m.iter ? '*' : ''}[${m.cond}] ` : m.iter ? '* ' : ''}${m.label}`;
        if (m.from === m.to) {
          return (
            <g key={i}>
              <path d={`M${x1 + 5},${y - 6} h34 v18 h-30`} fill="none" stroke={col} strokeWidth={1.6} markerEnd={bad ? 'url(#sq-arr-bad)' : 'url(#sq-arr)'} />
              <text x={x1 + 44} y={y + 2} className="d-msg" fill={bad ? 'var(--bad)' : undefined}>{label}</text>
            </g>
          );
        }
        const dir = x2 > x1 ? 1 : -1;
        return (
          <g key={i}>
            <line x1={x1 + dir * 5} y1={y} x2={x2 - dir * 6} y2={y} stroke={col} strokeWidth={bad ? 2.4 : 1.6} strokeDasharray={m.reply ? '6 4' : undefined} markerEnd={m.reply ? 'url(#sq-open)' : bad ? 'url(#sq-arr-bad)' : 'url(#sq-arr)'} />
            <text x={(x1 + x2) / 2} y={y - 7} textAnchor="middle" className="d-msg" fill={bad ? 'var(--bad)' : undefined}>{label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ---------------- Cuadro descriptivo ----------------
/** Numera los pasos; las líneas de regla ("R1 = …") no llevan número. */
export function numberSteps(steps: string[]): [number | null, string][] {
  let n = 0;
  return steps.map((s) => (/^R\d/.test(s) ? [null, s] : [++n, s]));
}

export function CUTable({ desc }: { desc: CUDescription }) {
  return (
    <table className="cu-table">
      <tbody>
        <tr><th>Id</th><td>{desc.id}</td></tr>
        <tr><th>Nombre</th><td>{desc.name}</td></tr>
        <tr><th>Actores</th><td>{desc.actors}</td></tr>
        <tr><th>Objetivo</th><td>{desc.objective}</td></tr>
        <tr><th>Precondición</th><td>{desc.pre}</td></tr>
        <tr><th>Postcondición</th><td>{desc.post}</td></tr>
        <tr><th>Flujo normal</th><td><div className="cu-steps">{numberSteps(desc.normal).map(([n, s], i) => (n === null ? <div key={i} className="rule">{s}</div> : <div key={i}><b>{n}</b> {s}</div>))}</div></td></tr>
        <tr><th>Alternativas</th><td><ul className="cu-alt">{desc.alternatives.map((s, i) => <li key={i}>{s}</li>)}</ul></td></tr>
      </tbody>
    </table>
  );
}
