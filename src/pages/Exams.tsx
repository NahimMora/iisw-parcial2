import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { READY, questionIndex } from '../content/registry';
import { LAVADERO } from '../content/trainer';
import { Quiz } from '../components/Quiz';
import { PaperExercise, Timer } from '../components/PaperExercise';
import { update, useProgress } from '../lib/progress';
import type { QuizResult } from '../lib/grading';
import type { Question } from '../content/types';

function pickTheory(seed: number): Question[] {
  const pool = READY.flatMap((c) => [...c.quiz, ...c.mastery]);
  const objective = pool.filter((q) => q.exam && q.type !== 'open');
  const open = pool.filter((q) => q.type === 'open');
  let h = seed * 9301 + 49297;
  const rnd = () => { h = (h * 9301 + 49297) % 233280; return h / 233280; };
  const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  // reparto proporcional por capítulo para cubrir todo el temario disponible
  const byCh = READY.map((c) => shuffle(objective.filter((q) => [...c.quiz, ...c.mastery].includes(q))));
  const out: Question[] = [];
  for (let r = 0; out.length < 20 && byCh.some((l) => l.length > r); r++) byCh.forEach((l) => { if (l[r] && out.length < 20) out.push(l[r]); });
  return [...shuffle(out), ...shuffle(open).slice(0, 2)];
}

export function Exams() {
  const { '*': rest = '' } = useParams();
  const kind = rest.split('/')[0] || '';
  const p = useProgress();
  const last = (k: 'teorico' | 'practico') => p.exams.filter((e) => e.kind === k).slice(-3).reverse();
  return (
    <div className="page">
      <div className="crumbs"><Link to="/">Panel</Link> / Simulacros</div>
      <h1>Simulacros</h1>
      <p className="hint">Inspirados en el formato informado por la cátedra (teoría máx. 60 min sin papel; práctica en papel con las cuatro herramientas). No es el formato exacto del examen real.</p>
      <div className="levels">
        <Link to="/simulacros/teorico" className={`card level ${kind === 'teorico' ? 'active' : ''}`}><b>Simulacro teórico</b><span className="hint">20 preguntas objetivas + 2 de desarrollo · 60 min</span>
          {last('teorico').map((e) => <span key={e.at} className="hint">{new Date(e.at).toLocaleString('es-AR')}: {Math.round(e.score * 100)} %</span>)}</Link>
        <Link to="/simulacros/practico" className={`card level ${kind === 'practico' ? 'active' : ''}`}><b>Simulacro práctico</b><span className="hint">Narrativa nueva · las cuatro herramientas · rúbrica con umbral de 60 %</span>
          {last('practico').map((e) => <span key={e.at} className="hint">{new Date(e.at).toLocaleString('es-AR')}: {Math.round(e.score * 100)} %</span>)}</Link>
      </div>
      {kind === 'teorico' && <Theory />}
      {kind === 'practico' && <><h2>Simulacro práctico</h2><PaperExercise problem={LAVADERO} recordKey="sim-practico" mode="exam" /></>}
    </div>
  );
}

function Theory() {
  const [seed, setSeed] = useState<number | null>(null);
  const [res, setRes] = useState<QuizResult | null>(null);
  const qs = useMemo(() => (seed === null ? [] : pickTheory(seed)), [seed]);
  const qi = questionIndex();
  if (seed === null) return (
    <div className="card"><h2>Simulacro teórico</h2>
      <p>Respondé sin material. Al terminar, presioná <b>Corregir</b> para ver la nota, el detalle de cada error y un informe por tema. Los errores pasan a tu banco de errores.</p>
      <p className="hint">Incluye solo capítulos ya publicados ({READY.length} de 7). Cada intento sortea preguntas distintas.</p>
      <button type="button" className="btn primary" onClick={() => { setRes(null); setSeed(Date.now() % 100000); }}>Comenzar</button></div>
  );
  const byCh: Record<string, { ok: number; n: number; title: string; num: number }> = {};
  if (res) for (const q of qs) { const ch = qi[q.id]?.chapter; if (!ch) continue; const e = (byCh[ch.id] ??= { ok: 0, n: 0, title: ch.title, num: ch.num }); e.n++; e.ok += res.grades[q.id].score; }
  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between' }}><h2>Simulacro teórico</h2>{!res && <Timer minutes={60} running />}</div>
      {res && (
        <div className="card">
          <h3>Informe por tema</h3>
          {Object.entries(byCh).sort((a, b) => a[1].num - b[1].num).map(([id, e]) => {
            const pct = Math.round((e.ok / e.n) * 100);
            return <div key={id} className="tool-score"><span>Cap. {e.num} · {e.title}</span><b>{pct} %</b><span className={pct >= 70 ? 'pass' : 'fail'}>{pct >= 70 ? 'fortaleza' : <Link to={`/capitulo/${id}/errores`}>reforzar →</Link>}</span></div>;
          })}
          <p className="hint">Recomendación: repasá primero los temas por debajo de 70 % con <Link to="/repaso">Repasar mis errores</Link> y luego hacé otro simulacro.</p>
          <button type="button" className="btn" onClick={() => { setRes(null); setSeed(Date.now() % 100000); }}>Nuevo simulacro</button>
        </div>
      )}
      <Quiz key={seed} questions={qs} chapterFor={(q) => qi[q.id]?.chapter.id ?? 'x'} mode="exam"
        onGraded={(r) => { setRes(r); update((d) => { d.exams.push({ kind: 'teorico', at: new Date().toISOString(), score: r.score, detail: {} }); }); }} />
    </div>
  );
}
