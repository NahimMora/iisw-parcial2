import type { Evidence, TheoryBlock } from '../content/types';
import { CUTable, Diagram } from './Diagrams';

export function EvidenceTag({ level }: { level: Evidence }) {
  return <span className={`ev ev-${level.toLowerCase()}`} title={EV_HELP[level]}>{level}</span>;
}
const EV_HELP: Record<Evidence, string> = {
  CONFIRMADO: 'Dicho explícitamente por la cátedra',
  PROBABLE: 'Inferido de clases, consignas y autoevaluaciones',
  COMPLEMENTARIO: 'Ayuda a entender; evaluación no confirmada',
};

/** Texto con **negritas** simples. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return <>{parts.map((p, i) => (p.startsWith('**') ? <b key={i}>{p.slice(2, -2)}</b> : <span key={i}>{p}</span>))}</>;
}

export function TheoryBlocks({ blocks }: { blocks: TheoryBlock[] }) {
  return (
    <div className="theory">
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'h': return <h3 key={i}>{b.text}</h3>;
          case 'p': return <p key={i}><Rich text={b.text} /></p>;
          case 'list': {
            const L = b.ordered ? 'ol' : 'ul';
            return <L key={i}>{b.items.map((x, j) => <li key={j}><Rich text={x} /></li>)}</L>;
          }
          case 'def': return <div key={i} className="def"><span className="def-term">{b.term}</span><span className="def-text"><Rich text={b.text} /></span></div>;
          case 'callout': return (
            <div key={i} className={`callout ${b.tone}`}>
              {(b.title || b.evidence) && <div className="callout-title">{b.title}{b.evidence && <EvidenceTag level={b.evidence} />}</div>}
              <p><Rich text={b.text} /></p>
            </div>
          );
          case 'table': return (
            <div key={i} className="table-wrap"><table className="tbl"><thead><tr>{b.head.map((h, j) => <th key={j}>{h}</th>)}</tr></thead>
              <tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}><Rich text={c} /></td>)}</tr>)}</tbody></table></div>
          );
          case 'figure': return <figure key={i} className="fig"><Diagram spec={b.diagram} /><figcaption>{b.caption}</figcaption></figure>;
          case 'cu': return <figure key={i} className="fig"><CUTable desc={b.desc} />{b.caption && <figcaption>{b.caption}</figcaption>}</figure>;
          case 'compare': return (
            <div key={i} className="compare">
              <div className="compare-head"><span /><b>{b.left}</b><b>{b.right}</b></div>
              {b.rows.map((r, j) => <div key={j} className="compare-row"><span className="compare-k">{r[0]}</span><span><Rich text={r[1]} /></span><span><Rich text={r[2]} /></span></div>)}
              {b.same && <div className="compare-same"><b>En común:</b> {b.same.join(' · ')}</div>}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
