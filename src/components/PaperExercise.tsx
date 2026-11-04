import { useEffect, useState } from 'react';
import type { PaperProblem } from '../content/trainer';
import { CUTable, SequenceDiagram, UseCaseDiagram } from './Diagrams';
import { update } from '../lib/progress';

export interface PaperResult { tools: { tool: string; score: number; failed: string[]; criticalFailed: string[] }[]; total: number }

const CHAPTER_FOR_TOOL = ['Capítulo 1 (lista de requerimientos)', 'Capítulo 1 (diagrama de casos de uso)', 'Capítulo 2 (descripción)', 'Capítulo 3 (secuencia)'];

export function Timer({ minutes, running, onEnd }: { minutes: number; running: boolean; onEnd?: () => void }) {
  const [left, setLeft] = useState(minutes * 60);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((s) => { if (s <= 1) { clearInterval(t); onEnd?.(); return 0; } return s - 1; }), 1000);
    return () => clearInterval(t);
  }, [running, onEnd]);
  return <span className={`timer ${left < 300 ? 'low' : ''}`}>⏱ {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</span>;
}

/** Ejercicio en papel: enunciado, cronómetro, solución de referencia y rúbrica por herramienta (umbral 60 %). */
export function PaperExercise({ problem, recordKey, mode }: { problem: PaperProblem; recordKey: string; mode: 'trainer' | 'exam' }) {
  const [phase, setPhase] = useState<'idle' | 'running' | 'review' | 'done'>('idle');
  const [checks, setChecks] = useState<boolean[][]>(problem.rubric.map((t) => t.items.map(() => false)));
  const [result, setResult] = useState<PaperResult | null>(null);

  const finish = () => {
    const tools = problem.rubric.map((t, i) => {
      const n = t.items.length;
      const ok = checks[i].filter(Boolean).length;
      return { tool: t.tool, score: ok / n, failed: t.items.filter((_, j) => !checks[i][j]).map((x) => x.text), criticalFailed: t.items.filter((x, j) => x.critical && !checks[i][j]).map((x) => x.text) };
    });
    const total = tools.reduce((s, t) => s + t.score, 0) / tools.length;
    const res = { tools, total };
    setResult(res); setPhase('done');
    update((p) => {
      if (mode === 'exam') p.exams.push({ kind: 'practico', at: new Date().toISOString(), score: total, detail: Object.fromEntries(tools.map((t) => [t.tool, t.score])) });
      else (p.trainer[recordKey] ??= []).push({ at: new Date().toISOString(), score: total });
    });
    setTimeout(() => document.getElementById('paper-report')?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <div>
      <div className="narrative"><b>{problem.title}</b>{'\n'}{problem.text}</div>
      <div className="card">
        <p><b>Consigna</b> (en papel, sin mirar material):</p>
        <ol><li>Lista de requerimientos.</li><li>Diagrama de casos de uso.</li><li>Descripción del caso de uso <b>"{problem.askCU}"</b>.</li><li>Diagrama de secuencia de <b>"{problem.askCU}"</b>.</li></ol>
        <p className="hint">Tiempo sugerido: {problem.minutes} min (la duración real de la práctica no fue confirmada por la cátedra). Usá 3–4 hojas, como en el parcial.</p>
        {phase === 'idle' && <button type="button" className="btn primary" onClick={() => setPhase('running')}>Empezar (inicia el cronómetro)</button>}
        {phase === 'running' && <div className="row"><Timer minutes={problem.minutes} running onEnd={() => setPhase('review')} /><button type="button" className="btn primary" onClick={() => setPhase('review')}>Terminé: corregir con la referencia</button></div>}
      </div>

      {(phase === 'review' || phase === 'done') && (
        <>
          <h3>Solución de referencia</h3>
          <p className="hint">Puede haber soluciones válidas distintas (nombres, cantidad de entidades). Compará la <b>estructura</b>: actores externos, casos de uso de negocio, formato de la descripción y patrón interfaz–control–entidad.</p>
          <div className="grid2">
            <div className="card"><h4>1 · Requerimientos</h4><ul>{problem.ref.reqs.map((r) => <li key={r}>{r}</li>)}</ul></div>
            <div className="card"><h4>2 · Casos de uso</h4><UseCaseDiagram spec={problem.ref.uc} /></div>
          </div>
          <div className="card"><h4>3 · Descripción</h4><CUTable desc={problem.ref.cu} /></div>
          <div className="card" style={{ overflowX: 'auto' }}><h4>4 · Secuencia</h4><SequenceDiagram spec={problem.ref.seq} /></div>

          <h3>Rúbrica (marcá lo que tu hoja cumple)</h3>
          <p className="hint">Esta corrección es una autoevaluación guiada: la plataforma no puede leer tu dibujo en papel. Sé exigente: marcá solo lo que realmente está en tu hoja.</p>
          {problem.rubric.map((t, i) => (
            <div key={t.tool} className="card">
              <h4>{t.tool}</h4>
              {t.items.map((it, j) => (
                <label key={j} className="rub-item"><input type="checkbox" checked={checks[i][j]} disabled={phase === 'done'}
                  onChange={(e) => setChecks((c) => c.map((row, a) => (a === i ? row.map((v, b) => (b === j ? e.target.checked : v)) : row)))} />
                  {it.text} {it.critical && <span className="ev ev-probable">clave</span>}</label>
              ))}
            </div>
          ))}
          {phase === 'review' && <button type="button" className="btn primary" onClick={finish}>Calcular resultado</button>}
        </>
      )}

      {result && (
        <section id="paper-report" className="card">
          <h3>Informe final</h3>
          {result.tools.map((t, i) => (
            <div key={t.tool} className="tool-score"><span>{t.tool}</span><b>{Math.round(t.score * 100)} %</b><span className={t.score >= 0.6 ? 'pass' : 'fail'}>{t.score >= 0.6 ? '≥ 60 % ✔' : 'recuperaría ✘'}</span>
              {t.score < 0.6 && <span className="hint" style={{ gridColumn: '1 / -1' }}>Repasar: {CHAPTER_FOR_TOOL[i]}</span>}</div>
          ))}
          <h4>Fortalezas</h4>
          <ul>{result.tools.filter((t) => t.score >= 0.8).map((t) => <li key={t.tool}>{t.tool}: {Math.round(t.score * 100)} %</li>)}{result.tools.every((t) => t.score < 0.8) && <li>Todavía ninguna herramienta llega al 80 %.</li>}</ul>
          <h4>Errores críticos</h4>
          <ul>{result.tools.flatMap((t) => t.criticalFailed.map((f) => <li key={t.tool + f}><b>{t.tool}:</b> {f}</li>))}{result.tools.every((t) => !t.criticalFailed.length) && <li>Sin errores críticos.</li>}</ul>
          <h4>Recomendaciones</h4>
          <ul>
            {result.tools.map((t, i) => t.score < 0.6 ? <li key={t.tool}>Prioridad: {CHAPTER_FOR_TOOL[i]} → sección Errores frecuentes y Comprobación de dominio; luego repetí el nivel 4 del entrenador.</li> : null)}
            {result.tools.every((t) => t.score >= 0.6) && <li>Las cuatro herramientas superan el 60 %. Repetí con otro enunciado para confirmar, cuidando los ítems no marcados.</li>}
          </ul>
        </section>
      )}
    </div>
  );
}
