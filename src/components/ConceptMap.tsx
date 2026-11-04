import { useRef, useState } from 'react';
import type { ConceptMapSpec, MapNode } from '../content/types';

const NW = 150, NH = 44;

export function ConceptMap({ spec }: { spec: ConceptMapSpec }) {
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const [sel, setSel] = useState<MapNode | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const hidden = (n: MapNode): boolean => {
    let p = n.parent;
    while (p) { if (collapsed.has(p)) return true; p = spec.nodes.find((m) => m.id === p)?.parent; }
    return false;
  };
  const visible = spec.nodes.filter((n) => !hidden(n));
  const vis = new Set(visible.map((n) => n.id));
  const byId = Object.fromEntries(spec.nodes.map((n) => [n.id, n]));
  const hasKids = (id: string) => spec.nodes.some((n) => n.parent === id);

  const zoom = (f: number) => setView((v) => ({ ...v, k: Math.min(2.6, Math.max(0.5, v.k * f)) }));
  const scale = () => { const r = svgRef.current?.getBoundingClientRect(); return r ? spec.width / r.width : 1; };

  return (
    <div className="cmap">
      <div className="cmap-tools">
        <button type="button" className="btn small" onClick={() => zoom(1.2)} aria-label="Acercar">＋</button>
        <button type="button" className="btn small" onClick={() => zoom(1 / 1.2)} aria-label="Alejar">－</button>
        <button type="button" className="btn small" onClick={() => setView({ x: 0, y: 0, k: 1 })}>Centrar</button>
        <span className="hint">Arrastrá para moverte · rueda o botones para zoom · tocá un nodo para ver su explicación · ⊕/⊖ expande o contrae</span>
      </div>
      <div className="cmap-legend">
        {Object.entries(spec.groups).map(([k, g]) => <span key={k}><i style={{ background: g.color }} />{g.label}</span>)}
      </div>
      <div className="cmap-stage">
        <svg ref={svgRef} viewBox={`0 0 ${spec.width} ${spec.height}`} className="cmap-svg"
          onWheel={(e) => { zoom(e.deltaY < 0 ? 1.1 : 1 / 1.1); }}
          onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y }; }}
          onPointerMove={(e) => { const d = drag.current; if (!d) return; const s = scale(); setView((v) => ({ ...v, x: d.vx + (e.clientX - d.x) * s / v.k, y: d.vy + (e.clientY - d.y) * s / v.k })); }}
          onPointerUp={() => { drag.current = null; }} onPointerLeave={() => { drag.current = null; }}>
          <defs><marker id="cm-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="var(--muted)" /></marker></defs>
          <g transform={`translate(${spec.width / 2} ${spec.height / 2}) scale(${view.k}) translate(${-spec.width / 2 + view.x} ${-spec.height / 2 + view.y})`}>
            {spec.edges.filter((e) => vis.has(e.from) && vis.has(e.to)).map((e, i) => {
              const a = byId[e.from], b = byId[e.to];
              const [x1, y1] = clip(a, b), [x2, y2] = clip(b, a);
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted)" strokeWidth={1.4} markerEnd="url(#cm-arr)" />
                  {e.label && <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 4} textAnchor="middle" className="cm-edge">{e.label}</text>}
                </g>
              );
            })}
            {visible.map((n) => {
              const g = spec.groups[n.group];
              const active = sel?.id === n.id;
              return (
                <g key={n.id} className="cm-node" onPointerDown={(e) => e.stopPropagation()} onClick={() => setSel(n)} style={{ cursor: 'pointer' }}>
                  <rect x={n.x - NW / 2} y={n.y - NH / 2} width={NW} height={NH} rx={10} fill={g?.color ?? '#ccc'} fillOpacity={active ? 1 : 0.88} stroke={active ? 'var(--ink)' : 'none'} strokeWidth={2.5} />
                  {lines(n.label).map((ln, i, arr) => <text key={i} x={n.x} y={n.y + 4 + (i - (arr.length - 1) / 2) * 14} textAnchor="middle" className="cm-label">{ln}</text>)}
                  {hasKids(n.id) && (
                    <g onClick={(e) => { e.stopPropagation(); setCollapsed((c) => { const s = new Set(c); if (s.has(n.id)) s.delete(n.id); else s.add(n.id); return s; }); }}>
                      <circle cx={n.x + NW / 2 - 2} cy={n.y - NH / 2 + 2} r={9} fill="var(--paper)" stroke="var(--ink)" />
                      <text x={n.x + NW / 2 - 2} y={n.y - NH / 2 + 6} textAnchor="middle" className="cm-toggle">{collapsed.has(n.id) ? '+' : '−'}</text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
        <aside className={`cmap-panel ${sel ? 'open' : ''}`}>
          {sel ? (<><h4>{sel.label}</h4><p>{sel.desc}</p><button type="button" className="btn small" onClick={() => setSel(null)}>Cerrar</button></>) : <p className="hint">Elegí un nodo.</p>}
        </aside>
      </div>
    </div>
  );
}

function lines(t: string): string[] {
  const w = t.split(' '); const out: string[] = []; let cur = '';
  for (const x of w) { if ((cur + ' ' + x).trim().length > 19 && cur) { out.push(cur); cur = x; } else cur = (cur + ' ' + x).trim(); }
  if (cur) out.push(cur);
  return out.slice(0, 3);
}

function clip(a: MapNode, b: MapNode): [number, number] {
  const dx = b.x - a.x, dy = b.y - a.y;
  if (!dx && !dy) return [a.x, a.y];
  const tx = Math.abs(dx) > 0 ? (NW / 2) / Math.abs(dx) : Infinity;
  const ty = Math.abs(dy) > 0 ? (NH / 2) / Math.abs(dy) : Infinity;
  const t = Math.min(tx, ty);
  return [a.x + dx * t, a.y + dy * t];
}
