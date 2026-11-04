import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { READY, questionIndex } from '../content/registry';
import { Quiz } from '../components/Quiz';
import { useProgress } from '../lib/progress';
import { adaptiveQueue } from '../lib/mastery';
import type { Question } from '../content/types';

export function Review() {
  const p = useProgress();
  const [params] = useSearchParams();
  const only = params.get('capitulo');
  const qi = questionIndex();
  const [mode, setMode] = useState<'errores' | 'adaptativo'>(only ? 'errores' : 'errores');
  const [session, setSession] = useState(0);

  const openErrors = Object.values(p.errors).filter((e) => !e.resolved && (!only || e.chapter === only) && qi[e.qid]);
  // congelamos la lista al iniciar cada sesión para que no cambie mientras respondés
  const errQs = useMemo(() => openErrors.sort((a, b) => b.fails - a.fails).map((e) => qi[e.qid].q),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session, only]);
  const adaptive = useMemo(() => adaptiveQueue(READY, p, 10),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session]);
  const chapterFor = (q: Question) => qi[q.id]?.chapter.id ?? 'x';
  const byConcept: Record<string, number> = {};
  openErrors.forEach((e) => { byConcept[e.concept] = (byConcept[e.concept] ?? 0) + e.fails; });

  return (
    <div className="page">
      <div className="crumbs"><Link to="/">Panel</Link> / Repaso</div>
      <h1>Repaso</h1>
      <div className="tabs">
        <button type="button" className={`tab ${mode === 'errores' ? 'active' : ''}`} onClick={() => { setMode('errores'); setSession((s) => s + 1); }}>Repasar mis errores ({openErrors.length})</button>
        <button type="button" className={`tab ${mode === 'adaptativo' ? 'active' : ''}`} onClick={() => { setMode('adaptativo'); setSession((s) => s + 1); }}>Repaso adaptativo</button>
      </div>
      {mode === 'errores' ? (
        <>
          <p className="lead">Las preguntas que fallaste, sin mostrarte la respuesta anterior. Una pregunta sale del banco cuando la acertás <b>dos veces seguidas</b>.</p>
          {Object.keys(byConcept).length > 0 && <div className="chips">{Object.entries(byConcept).sort((a, b) => b[1] - a[1]).map(([c, n]) => <span key={c} className="chip">{c} · {n}</span>)}</div>}
          {errQs.length === 0 ? <div className="card"><p>No tenés errores pendientes{only ? ' en este capítulo' : ''}. 🎯 Probá el repaso adaptativo o una comprobación de dominio.</p></div>
            : <Quiz key={`e${session}`} questions={errQs} chapterFor={chapterFor} mode="review" onGraded={() => { }} />}
          {errQs.length > 0 && <button type="button" className="btn" onClick={() => setSession((s) => s + 1)}>Nueva ronda con los errores que queden</button>}
        </>
      ) : (
        <>
          <p className="lead">Selección priorizada por: errores cometidos, dificultad del tema, relevancia para el parcial y tu precisión previa en cada concepto. Los conceptos que ya dominás (≥ 85 % con 3 o más intentos) se saltean.</p>
          {adaptive.length === 0 ? <div className="card"><p>No queda nada prioritario en los capítulos disponibles.</p></div> : (
            <>
              <ul className="why-list">{adaptive.map((s, i) => <li key={s.q.id}><b>{i + 1}.</b> Cap. {s.chapter.num} · {s.q.concept} — <span className="hint">{s.reason}</span></li>)}</ul>
              <Quiz key={`a${session}`} questions={adaptive.map((s) => s.q)} chapterFor={chapterFor} mode="review" />
              <button type="button" className="btn" onClick={() => setSession((s) => s + 1)}>Recalcular prioridades</button>
            </>
          )}
        </>
      )}
    </div>
  );
}
