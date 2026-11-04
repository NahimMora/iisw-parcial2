import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ERRORS, GUIDED, GUIDED_REF, GUIDED_TEXT, KAMERAL_PROBLEM, OBSERVATION, PADEL_LINK_OPTIONAL, PADEL_SEQ, PADEL_TEXT, PADEL_UC, VIANDAS } from '../content/trainer';
import { CUTable, SequenceDiagram, UseCaseDiagram } from '../components/Diagrams';
import { Quiz } from '../components/Quiz';
import { SeqBuilder, UCBuilder } from '../components/Builders';
import { PaperExercise } from '../components/PaperExercise';
import { update, useProgress } from '../lib/progress';

const LEVELS = [
  ['1', 'Observación', 'Demostración completa de Kameral, paso a paso'],
  ['2', 'Reconstrucción guiada', 'Completá partes del servicio técnico de la profesora'],
  ['3', 'Detección de errores', 'Diagramas con errores reales: encontralos y justificá'],
  ['4', 'Práctica semiguiada', 'Narrativa nueva: armá el diagrama de CU y la secuencia en editores que validan'],
  ['5', 'Resolución autónoma', 'Problema completo como en el examen, en papel, con rúbrica'],
] as const;

export function Trainer() {
  const { '*': rest = '' } = useParams();
  const lvl = rest.split('/')[0] || '1';
  const p = useProgress();
  const best = (k: string) => { const a = p.trainer[k] ?? []; return a.length ? Math.round(Math.max(...a.map((x) => x.score)) * 100) : null; };
  return (
    <div className="page">
      <div className="crumbs"><Link to="/">Panel</Link> / Entrenador de diagramas</div>
      <h1>Entrenador de diagramas</h1>
      <p className="lead">De ver una resolución completa a resolver sola/o un problema de examen. Las cuatro herramientas de la práctica: <b>requerimientos, casos de uso, descripción y secuencia</b>.</p>
      <div className="levels">
        {LEVELS.map(([n, t, d]) => {
          const k = `n${n}`; const b = best(k);
          return <Link key={n} to={`/entrenador/${n}`} className={`card level ${lvl === n ? 'active' : ''}`}><b>Nivel {n} · {t}</b><span className="hint">{d}</span>{b !== null && <span className="badge ok">mejor: {b} %</span>}</Link>;
        })}
      </div>
      {lvl === '1' && <Observation />}
      {lvl === '2' && <Guided />}
      {lvl === '3' && <>
        <h2>Nivel 3 · Detección de errores</h2>
        <p className="hint">Cada caso reproduce errores que aparecieron en trabajos prácticos o que la cátedra señaló en clase.</p>
        <Quiz questions={ERRORS} chapterFor={() => 'trainer'} mode="review" onGraded={(r) => update((d) => { (d.trainer.n3 ??= []).push({ at: new Date().toISOString(), score: r.score }); })} />
      </>}
      {lvl === '4' && <Semi />}
      {lvl === '5' && <>
        <h2>Nivel 5 · Resolución autónoma</h2>
        <p className="hint">Sin pistas iniciales. Resolvé en papel y después corregí con la referencia y la rúbrica.</p>
        <Auto />
      </>}
    </div>
  );
}

function Observation() {
  const [i, setI] = useState(0);
  const s = OBSERVATION[i];
  return (
    <div className="card">
      <h2>Nivel 1 · Observación: Kameral completo</h2>
      <p className="hint">Paso {i + 1} de {OBSERVATION.length}. Para la versión animada con narración, mirá los videos de los capítulos <Link to="/capitulo/ch1/video">1</Link>, <Link to="/capitulo/ch2/video">2</Link> y <Link to="/capitulo/ch3/video">3</Link>.</p>
      <h3>{s.title}</h3>
      <p>{s.text}</p>
      {s.reqs && <ul>{s.reqs.map((r) => <li key={r}>{r}</li>)}</ul>}
      {s.uc && <UseCaseDiagram spec={s.uc} />}
      {s.cu && <CUTable desc={s.cu} />}
      {s.seq && <div style={{ overflowX: 'auto' }}><SequenceDiagram spec={s.seq} /></div>}
      <div className="pager">
        <button type="button" className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>← Anterior</button>
        {i < OBSERVATION.length - 1 ? <button type="button" className="btn primary" onClick={() => setI(i + 1)}>Siguiente →</button> : <Link className="btn primary" to="/entrenador/2" onClick={() => update((d) => { (d.trainer.n1 ??= []).push({ at: new Date().toISOString(), score: 1 }); })}>Ir al nivel 2 →</Link>}
      </div>
    </div>
  );
}

function Guided() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <h2>Nivel 2 · Reconstrucción guiada: servicio técnico</h2>
      <div className="narrative">{GUIDED_TEXT}</div>
      <Quiz questions={GUIDED} chapterFor={() => 'trainer'} mode="review" onGraded={(r) => update((d) => { (d.trainer.n2 ??= []).push({ at: new Date().toISOString(), score: r.score }); })} />
      <button type="button" className="btn ghost" onClick={() => setShow(!show)}>{show ? 'Ocultar' : 'Ver'} la resolución completa</button>
      {show && <div className="card">
        <h4>Requerimientos (profesora)</h4><ul>{GUIDED_REF.reqs.map((r) => <li key={r}>{r}</li>)}</ul>
        <h4>Casos de uso (reconstrucción)</h4><UseCaseDiagram spec={GUIDED_REF.uc} />
        <h4>CU_2 (profesora)</h4><CUTable desc={GUIDED_REF.cu} />
        <h4>Secuencia de CU_2</h4><div style={{ overflowX: 'auto' }}><SequenceDiagram spec={GUIDED_REF.seq} /></div>
      </div>}
    </div>
  );
}

function Semi() {
  const [part, setPart] = useState<'uc' | 'seq'>('uc');
  return (
    <div>
      <h2>Nivel 4 · Práctica semiguiada: club de pádel</h2>
      <div className="narrative">{PADEL_TEXT}</div>
      <div className="tabs">
        <button type="button" className={`tab ${part === 'uc' ? 'active' : ''}`} onClick={() => setPart('uc')}>A · Diagrama de casos de uso</button>
        <button type="button" className={`tab ${part === 'seq' ? 'active' : ''}`} onClick={() => setPart('seq')}>B · Secuencia de "Reservar cancha"</button>
      </div>
      {part === 'uc' ? (
        <UCBuilder spec={PADEL_UC} optional={PADEL_LINK_OPTIONAL} onValidated={(v) => update((d) => { (d.trainer.n4 ??= []).push({ at: new Date().toISOString(), score: v.score }); })} />
      ) : (
        <>
          <p className="hint">Tenés la descripción del caso de uso (en el parcial la escribís vos). Construí la secuencia correspondiente.</p>
          <CUTable desc={PADEL_SEQ.cu} />
          <SeqBuilder spec={PADEL_SEQ} onValidated={(v) => update((d) => { (d.trainer.n4 ??= []).push({ at: new Date().toISOString(), score: v.score }); })} />
        </>
      )}
    </div>
  );
}

function Auto() {
  const [which, setWhich] = useState<'viandas' | 'kameral'>('viandas');
  return (
    <div>
      <div className="tabs">
        <button type="button" className={`tab ${which === 'viandas' ? 'active' : ''}`} onClick={() => setWhich('viandas')}>Viandas (nuevo)</button>
        <button type="button" className={`tab ${which === 'kameral' ? 'active' : ''}`} onClick={() => setWhich('kameral')}>Kameral (consignas 13/10 y 20/10 no entregadas)</button>
      </div>
      {which === 'viandas' ? <PaperExercise key="v" problem={VIANDAS} recordKey="n5" mode="trainer" /> : <PaperExercise key="k" problem={KAMERAL_PROBLEM} recordKey="n5" mode="trainer" />}
    </div>
  );
}
