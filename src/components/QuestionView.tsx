import type { Grade, Question, Response } from '../content/types';
import { CUTable, Diagram } from './Diagrams';
import { shuffledIndices } from '../lib/grading';

const LEVEL = { 1: 'Comprensión', 2: 'Aplicación', 3: 'Evaluación' } as const;
const TYPE: Record<Question['type'], string> = {
  mcq: 'Opción múltiple', multi: 'Selección múltiple', tf: 'Verdadero o falso', match: 'Relacionar',
  order: 'Ordenar', fill: 'Completar', open: 'Desarrollo (autoevaluación con rúbrica)',
};

interface Props {
  q: Question; index: number; r: Response; onChange: (r: Response) => void;
  graded?: Grade; locked?: boolean;
}

export function QuestionView({ q, index, r, onChange, graded, locked }: Props) {
  const state = graded ? (graded.correct ? 'ok' : graded.score > 0 ? 'partial' : 'bad') : '';
  return (
    <article className={`question ${state}`} data-qid={q.id}>
      <header className="q-head">
        <span className="q-num">{index + 1}</span>
        <span className="q-type">{TYPE[q.type]} · {LEVEL[q.level]}</span>
        {graded && <span className={`q-score ${state}`}>{graded.correct ? '✔ Correcta' : graded.score > 0 ? `Parcial ${Math.round(graded.score * 100)} %` : '✘ Incorrecta'}</span>}
      </header>
      <p className="q-prompt">{q.prompt}</p>
      {q.diagram && <div className="q-diagram"><Diagram spec={q.diagram} /></div>}
      {q.cu && <div className="q-diagram"><CUTable desc={q.cu} /></div>}
      <Body q={q} r={r} onChange={onChange} graded={graded} locked={locked || !!graded} />
      {graded && (
        <div className="q-feedback">
          {graded.detail.map((d, i) => <p key={i} className="q-detail">{d}</p>)}
          <p><b>Razonamiento:</b> {q.explain}</p>
        </div>
      )}
    </article>
  );
}

function Body({ q, r, onChange, graded, locked }: Omit<Props, 'index'>) {
  if (q.type === 'mcq' && r.type === 'mcq') {
    const order = shuffledIndices(q.options.length, q.id + 'o');
    return (
      <div className="opts" role="radiogroup">
        {order.map((i) => {
          const cls = graded ? (i === q.answer ? 'right' : r.value === i ? 'wrong' : '') : r.value === i ? 'sel' : '';
          return (
            <button key={i} type="button" role="radio" aria-checked={r.value === i} className={`opt ${cls}`} disabled={locked} onClick={() => onChange({ type: 'mcq', value: i })}>
              {q.options[i]}
            </button>
          );
        })}
      </div>
    );
  }
  if (q.type === 'multi' && r.type === 'multi') {
    const order = shuffledIndices(q.options.length, q.id + 'o');
    const toggle = (i: number) => onChange({ type: 'multi', value: r.value.includes(i) ? r.value.filter((x) => x !== i) : [...r.value, i] });
    return (
      <div className="opts">
        <p className="hint">Marcá todas las que correspondan.</p>
        {order.map((i) => {
          const sel = r.value.includes(i);
          const cls = graded ? (q.answer.includes(i) ? (sel ? 'right' : 'missed') : sel ? 'wrong' : '') : sel ? 'sel' : '';
          return (
            <button key={i} type="button" role="checkbox" aria-checked={sel} className={`opt check ${cls}`} disabled={locked} onClick={() => toggle(i)}>
              <span className="box">{sel ? '■' : '□'}</span> {q.options[i]}
            </button>
          );
        })}
      </div>
    );
  }
  if (q.type === 'tf' && r.type === 'tf') {
    return (
      <div className="opts tf">
        {[true, false].map((v) => {
          const cls = graded ? (v === q.answer ? 'right' : r.value === v ? 'wrong' : '') : r.value === v ? 'sel' : '';
          return <button key={String(v)} type="button" className={`opt ${cls}`} disabled={locked} onClick={() => onChange({ type: 'tf', value: v })}>{v ? 'Verdadero' : 'Falso'}</button>;
        })}
      </div>
    );
  }
  if (q.type === 'match' && r.type === 'match') {
    const order = shuffledIndices(q.pairs.length, q.id + 'm');
    return (
      <div className="match">
        {q.pairs.map((p, i) => (
          <label key={i} className={`match-row ${graded ? (r.value[i] === i ? 'right' : 'wrong') : ''}`}>
            <span className="match-left">{p[0]}</span>
            <select disabled={locked} value={r.value[i] ?? ''} onChange={(e) => { const v = [...r.value]; v[i] = e.target.value === '' ? null : +e.target.value; onChange({ type: 'match', value: v }); }}>
              <option value="">— elegir —</option>
              {order.map((j) => <option key={j} value={j}>{q.pairs[j][1]}</option>)}
            </select>
          </label>
        ))}
      </div>
    );
  }
  if (q.type === 'order' && r.type === 'order') {
    const move = (pos: number, d: number) => {
      const v = [...r.value]; const t = pos + d; if (t < 0 || t >= v.length) return;
      [v[pos], v[t]] = [v[t], v[pos]]; onChange({ type: 'order', value: v });
    };
    return (
      <ol className="order">
        {r.value.map((itemIdx, pos) => (
          <li key={itemIdx} className={graded ? (itemIdx === pos ? 'right' : 'wrong') : ''}>
            <span className="order-text">{q.items[itemIdx]}</span>
            {!locked && <span className="order-btns">
              <button type="button" aria-label="Subir" onClick={() => move(pos, -1)} disabled={pos === 0}>▲</button>
              <button type="button" aria-label="Bajar" onClick={() => move(pos, 1)} disabled={pos === r.value.length - 1}>▼</button>
            </span>}
            {graded && itemIdx !== pos && <span className="order-fix">debía ir en el lugar {itemIdx + 1}</span>}
          </li>
        ))}
      </ol>
    );
  }
  if (q.type === 'fill' && r.type === 'fill') {
    const parts = q.text.split(/(\{\d+\})/);
    return (
      <p className="fill">
        {parts.map((part, k) => {
          const m = part.match(/^\{(\d+)\}$/);
          if (!m) return <span key={k}>{part}</span>;
          const i = +m[1]; const b = q.blanks[i];
          const cls = graded ? (r.value[i] === b.answer ? 'right' : 'wrong') : '';
          return (
            <select key={k} className={cls} disabled={locked} value={r.value[i] ?? ''} aria-label={`Hueco ${i + 1}`}
              onChange={(e) => { const v = [...r.value]; v[i] = e.target.value === '' ? null : +e.target.value; onChange({ type: 'fill', value: v }); }}>
              <option value="">……</option>
              {shuffledIndices(b.options.length, q.id + i).map((j) => <option key={j} value={j}>{b.options[j]}</option>)}
            </select>
          );
        })}
      </p>
    );
  }
  if (q.type === 'open' && r.type === 'open') {
    const v = r.value;
    return (
      <div className="open">
        <textarea rows={5} placeholder="Escribí tu respuesta sin mirar el material (o hacela en el cuaderno y anotá aquí lo esencial)." value={v.text} disabled={locked && v.revealed}
          onChange={(e) => onChange({ type: 'open', value: { ...v, text: e.target.value } })} />
        {!v.revealed ? (
          <button type="button" className="btn ghost" disabled={locked} onClick={() => onChange({ type: 'open', value: { ...v, revealed: true } })}>Ya respondí: mostrar respuesta modelo y rúbrica</button>
        ) : (
          <div className="rubric">
            <p className="model"><b>Respuesta modelo:</b> {q.model}</p>
            <p className="hint">Marcá con honestidad cada criterio que tu respuesta cumple. La nota sale de esta rúbrica (no es una corrección automática del texto).</p>
            {q.rubric.map((c, i) => (
              <label key={i} className="rub-item">
                <input type="checkbox" checked={v.checks[i]} disabled={!!graded}
                  onChange={(e) => { const checks = [...v.checks]; checks[i] = e.target.checked; onChange({ type: 'open', value: { ...v, checks } }); }} />
                {c}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
}
