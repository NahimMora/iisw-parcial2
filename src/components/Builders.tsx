import { useMemo, useState } from 'react';
import type { SequenceDiagramSpec, Stereo, UseCaseDiagramSpec } from '../content/types';
import type { SeqBuilderSpec, UCBuilderSpec } from '../content/trainer';
import { shuffledIndices } from '../lib/grading';
import { validateSequence, validateUseCase, type SeqMsg, type SeqObj, type Validation } from '../lib/validators';
import { SequenceDiagram, STEREO_LABEL, UseCaseDiagram } from './Diagrams';

function Report({ v, onRetry }: { v: Validation; onRetry: () => void }) {
  const pct = Math.round(v.score * 100);
  const crit = v.checks.filter((c) => !c.ok && c.critical).length;
  return (
    <div className={`result ${pct >= 80 ? 'ok' : pct >= 60 ? 'partial' : 'bad'}`}>
      <div className="result-score"><span>{pct}</span><small>%</small></div>
      <div className="result-body">
        <p><b>{pct >= 60 ? 'Supera' : 'No llega a'}</b> el 60 % de la herramienta.{crit > 0 && ` ${crit} error(es) crítico(s).`}</p>
        <ul className="check-list">{v.checks.map((c, i) => <li key={i} className={c.ok ? 'ok' : 'bad'}>{c.text}</li>)}</ul>
        <button type="button" className="btn small" onClick={onRetry}>Seguir editando</button>
      </div>
    </div>
  );
}

// ---------------- Constructor de casos de uso ----------------
export function UCBuilder({ spec, optional, onValidated }: { spec: UCBuilderSpec; optional?: [string, string][]; onValidated?: (v: Validation) => void }) {
  const [actors, setActors] = useState<string[]>([]);
  const [cases, setCases] = useState<string[]>([]);
  const [links, setLinks] = useState<[string, string][]>([]);
  const [sides, setSides] = useState<Record<string, 'left' | 'right'>>({});
  const [v, setV] = useState<Validation | null>(null);
  const aOrder = useMemo(() => shuffledIndices(spec.actors.length, 'ucb-a'), [spec]);
  const cOrder = useMemo(() => shuffledIndices(spec.cases.length, 'ucb-c'), [spec]);
  const toggle = (arr: string[], set: (x: string[]) => void, n: string) => { set(arr.includes(n) ? arr.filter((x) => x !== n) : [...arr, n]); setV(null); };
  const hasLink = (a: string, c: string) => links.some((l) => l[0] === a && l[1] === c);
  const toggleLink = (a: string, c: string) => { setLinks(hasLink(a, c) ? links.filter((l) => !(l[0] === a && l[1] === c)) : [...links, [a, c]]); setV(null); };

  const preview: UseCaseDiagramSpec = {
    kind: 'usecase', system: spec.system,
    actors: actors.map((a, i) => ({ id: a, name: a, side: sides[a] ?? (i % 2 ? 'right' : 'left') })),
    cases: cases.map((c) => ({ id: c, name: c })),
    links: links.filter((l) => actors.includes(l[0]) && cases.includes(l[1])).map((l) => ({ actor: l[0], uc: l[1] })),
  };

  return (
    <div>
      <div className="editor">
        <div className="palette">
          <b>1 · Actores (arrastrables al lado izquierdo o derecho)</b>
          {aOrder.map((i) => { const a = spec.actors[i].name; const on = actors.includes(a); return (
            <div key={a} className="row">
              <button type="button" className={`opt ${on ? 'sel' : ''}`} style={{ flex: 1 }} draggable={on}
                onDragEnd={(e) => { const r = (e.currentTarget.closest('.editor') as HTMLElement)?.querySelector('.diagram')?.getBoundingClientRect(); if (r) setSides((s) => ({ ...s, [a]: e.clientX > r.left + r.width / 2 ? 'right' : 'left' })); }}
                onClick={() => toggle(actors, setActors, a)}>{on ? '☑' : '☐'} {a}</button>
              {on && <button type="button" className="btn small ghost" title="Cambiar de lado" onClick={() => setSides((s) => ({ ...s, [a]: (s[a] ?? 'left') === 'left' ? 'right' : 'left' }))}>⇄</button>}
            </div>
          ); })}
          <b>2 · Casos de uso</b>
          {cOrder.map((i) => { const c = spec.cases[i].name; const on = cases.includes(c); return (
            <button key={c} type="button" className={`opt ${on ? 'sel' : ''}`} onClick={() => toggle(cases, setCases, c)}>{on ? '☑' : '☐'} {c}</button>
          ); })}
        </div>
        <div>
          <UseCaseDiagram spec={preview} />
          <b>3 · Asociaciones</b> <span className="hint">Marcá qué actor participa en cada caso de uso.</span>
          {actors.length > 0 && cases.length > 0 ? (
            <div className="table-wrap"><table className="tbl"><thead><tr><th>Actor \ Caso de uso</th>{cases.map((c) => <th key={c}>{c}</th>)}</tr></thead>
              <tbody>{actors.map((a) => <tr key={a}><td><b>{a}</b></td>{cases.map((c) => <td key={c} style={{ textAlign: 'center' }}><input type="checkbox" aria-label={`${a} — ${c}`} checked={hasLink(a, c)} onChange={() => toggleLink(a, c)} /></td>)}</tr>)}</tbody></table></div>
          ) : <p className="hint">Elegí actores y casos de uso para conectarlos.</p>}
        </div>
      </div>
      <div className="quiz-actions"><button type="button" className="btn primary" onClick={() => { const r = validateUseCase(spec, { actors, cases, links }, optional); setV(r); onValidated?.(r); }}>Validar diagrama</button></div>
      {v && <Report v={v} onRetry={() => setV(null)} />}
    </div>
  );
}

// ---------------- Constructor de secuencia ----------------
const KINDS: Stereo[] = ['actor', 'interface', 'control', 'entity'];
export function SeqBuilder({ spec, onValidated }: { spec: SeqBuilderSpec; onValidated?: (v: Validation) => void }) {
  const [objects, setObjects] = useState<SeqObj[]>([]);
  const [msgs, setMsgs] = useState<SeqMsg[]>([]);
  const [draft, setDraft] = useState<SeqMsg>({ from: 0, to: 1, label: spec.labels[0].text, cond: '' });
  const [v, setV] = useState<Validation | null>(null);
  const [showRef, setShowRef] = useState(false);
  const order = useMemo(() => shuffledIndices(spec.objects.length, 'sqb'), [spec]);
  const reset = () => setV(null);

  const addObj = (name: string, kind: Stereo) => { if (objects.some((o) => o.name === name)) return; setObjects([...objects, { name, kind }]); reset(); };
  const setKind = (i: number, kind: Stereo) => { setObjects(objects.map((o, j) => (j === i ? { ...o, kind } : o))); reset(); };
  const moveObj = (i: number, d: number) => {
    const t = i + d; if (t < 0 || t >= objects.length) return;
    const o = [...objects]; [o[i], o[t]] = [o[t], o[i]];
    const remap = (k: number) => (k === i ? t : k === t ? i : k);
    setObjects(o); setMsgs(msgs.map((m) => ({ ...m, from: remap(m.from), to: remap(m.to) }))); reset();
  };
  const removeObj = (i: number) => {
    setObjects(objects.filter((_, j) => j !== i));
    setMsgs(msgs.filter((m) => m.from !== i && m.to !== i).map((m) => ({ ...m, from: m.from > i ? m.from - 1 : m.from, to: m.to > i ? m.to - 1 : m.to }))); reset();
  };
  const moveMsg = (i: number, d: number) => { const t = i + d; if (t < 0 || t >= msgs.length) return; const m = [...msgs]; [m[i], m[t]] = [m[t], m[i]]; setMsgs(m); reset(); };

  const preview: SequenceDiagramSpec = {
    kind: 'sequence', numbered: true, activations: false,
    participants: objects.map((o, i) => ({ id: String(i), name: o.name, kind: o.kind })),
    messages: msgs.filter((m) => objects[m.from] && objects[m.to]).map((m) => ({ from: String(m.from), to: String(m.to), label: m.label, cond: m.cond || undefined })),
  };

  return (
    <div>
      <div className="editor">
        <div className="palette">
          <b>1 · Objetos (en orden de izquierda a derecha)</b>
          <span className="hint">Agregá solo los que correspondan y elegí su estereotipo.</span>
          {order.map((i) => { const o = spec.objects[i]; const used = objects.some((x) => x.name === o.name); return (
            <button key={o.name} type="button" className={`opt ${used ? 'sel' : ''}`} disabled={used} onClick={() => addObj(o.name, 'entity')}>＋ {o.name}</button>
          ); })}
          {objects.length > 0 && <b>Objetos elegidos</b>}
          {objects.map((o, i) => (
            <div key={o.name} className="row" style={{ gap: 4 }}>
              <span style={{ flex: 1, fontWeight: 600 }}>{i + 1}. {o.name}</span>
              <select value={o.kind} onChange={(e) => setKind(i, e.target.value as Stereo)} aria-label={`Estereotipo de ${o.name}`}>{KINDS.map((k) => <option key={k} value={k}>{STEREO_LABEL[k]}</option>)}</select>
              <button type="button" className="btn small ghost" onClick={() => moveObj(i, -1)} aria-label="Mover a la izquierda">◀</button>
              <button type="button" className="btn small ghost" onClick={() => moveObj(i, 1)} aria-label="Mover a la derecha">▶</button>
              <button type="button" className="btn small ghost danger" onClick={() => removeObj(i)} aria-label="Quitar">✕</button>
            </div>
          ))}
        </div>
        <div style={{ overflowX: 'auto' }}>
          {objects.length > 0 ? <SequenceDiagram spec={preview} /> : <p className="hint">Agregá objetos para empezar.</p>}
        </div>
      </div>
      {objects.length >= 2 && (
        <div className="card">
          <b>2 · Mensajes</b> <span className="hint">Emisor → receptor, nombre y condición opcional (sin corchetes). Se agregan al final; reordenalos con ▲▼.</span>
          <div className="msg-row">
            <span>＋</span>
            <select value={draft.from} onChange={(e) => setDraft({ ...draft, from: +e.target.value })} aria-label="Emisor">{objects.map((o, i) => <option key={i} value={i}>{o.name}</option>)}</select>
            <select value={draft.to} onChange={(e) => setDraft({ ...draft, to: +e.target.value })} aria-label="Receptor">{objects.map((o, i) => <option key={i} value={i}>{o.name}</option>)}</select>
            <select value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} aria-label="Mensaje">{spec.labels.map((l) => <option key={l.key} value={l.text}>{l.text}</option>)}</select>
            <input value={draft.cond} placeholder="condición (opcional)" onChange={(e) => setDraft({ ...draft, cond: e.target.value })} aria-label="Condición" style={{ font: 'inherit', padding: 6, borderRadius: 8, border: '1.5px solid var(--line)', background: 'var(--paper)', color: 'var(--ink)' }} />
            <button type="button" className="btn primary small" onClick={() => { setMsgs([...msgs, draft]); setDraft({ ...draft, cond: '' }); reset(); }}>Agregar</button>
          </div>
          {msgs.map((m, i) => (
            <div key={i} className="msg-row">
              <b>{i + 1}</b><span>{objects[m.from]?.name}</span><span>→ {objects[m.to]?.name}</span><span>{m.cond ? `[${m.cond}] ` : ''}{m.label}</span><span />
              <span className="row" style={{ gap: 2 }}>
                <button type="button" className="btn small ghost" onClick={() => moveMsg(i, -1)} aria-label="Subir">▲</button>
                <button type="button" className="btn small ghost" onClick={() => moveMsg(i, 1)} aria-label="Bajar">▼</button>
                <button type="button" className="btn small ghost danger" onClick={() => { setMsgs(msgs.filter((_, j) => j !== i)); reset(); }} aria-label="Borrar">✕</button>
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="quiz-actions">
        <button type="button" className="btn primary" onClick={() => { const r = validateSequence(spec, { objects, messages: msgs }); setV(r); onValidated?.(r); }}>Validar diagrama</button>
        <button type="button" className="btn ghost" onClick={() => setShowRef((s) => !s)}>{showRef ? 'Ocultar' : 'Comparar con'} la solución de referencia</button>
      </div>
      {v && <Report v={v} onRetry={() => setV(null)} />}
      {showRef && <div className="card"><h4>Solución de referencia</h4><SequenceDiagram spec={spec.reference} /></div>}
    </div>
  );
}
