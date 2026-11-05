import { useMemo, useState } from 'react';
import type { Question, Response } from '../content/types';
import { emptyResponse, gradeAll, isAnswered, type QuizResult } from '../lib/grading';
import { chapterOf, recordAnswer, update } from '../lib/progress';
import { QuestionView } from './QuestionView';

export interface QuizProps {
  questions: Question[];
  /** capítulo de cada pregunta (para banco de errores) */
  chapterFor: (q: Question) => string;
  mode: 'quiz' | 'mastery' | 'review' | 'exam';
  chapterId?: string;
  title?: string;
  onGraded?: (res: QuizResult) => void;
  conceptNames?: Record<string, string>;
}

export function Quiz({ questions, chapterFor, mode, chapterId, title, onGraded, conceptNames }: QuizProps) {
  const init = () => Object.fromEntries(questions.map((q) => [q.id, emptyResponse(q)])) as Record<string, Response>;
  const [rs, setRs] = useState<Record<string, Response>>(init);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [round, setRound] = useState(0);
  const pending = useMemo(() => questions.filter((q) => !isAnswered(q, rs[q.id] ?? emptyResponse(q))).length, [questions, rs]);

  const correct = () => {
    const res = gradeAll(questions, rs);
    setResult(res);
    update((p) => {
      for (const q of questions) recordAnswer(p, chapterFor(q), q.id, q.concept, res.grades[q.id].correct);
      if (chapterId && (mode === 'quiz' || mode === 'mastery')) {
        const cp = chapterOf(p, chapterId);
        cp[mode].push({ at: new Date().toISOString(), score: res.score, correct: res.correct, total: res.total });
      }
    });
    onGraded?.(res);
    setTimeout(() => document.getElementById(`quiz-result-${mode}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };
  const retry = () => { setRs(init()); setResult(null); setRound((x) => x + 1); window.scrollTo({ top: 0 }); };

  return (
    <div className="quiz" key={round}>
      {title && <h3>{title}</h3>}
      {result && <ResultBox id={`quiz-result-${mode}`} res={result} questions={questions} conceptNames={conceptNames} onRetry={retry} />}
      {questions.map((q, i) => (
        <QuestionView key={q.id} q={q} index={i} r={rs[q.id] ?? emptyResponse(q)} graded={result?.grades[q.id]}
          onChange={(r) => setRs((prev) => ({ ...prev, [q.id]: r }))} />
      ))}
      {!result ? (
        <div className="quiz-actions">
          <button type="button" className="btn primary" onClick={correct}>Corregir</button>
          {pending > 0 && <span className="hint">{pending} sin responder (cuentan como incorrectas)</span>}
        </div>
      ) : (
        <div className="quiz-actions"><button type="button" className="btn" onClick={retry}>Volver a intentarlo</button></div>
      )}
    </div>
  );
}

function ResultBox({ id, res, questions, conceptNames, onRetry }: { id: string; res: QuizResult; questions: Question[]; conceptNames?: Record<string, string>; onRetry: () => void }) {
  const pct = Math.round(res.score * 100);
  const wrong = questions.filter((q) => !res.grades[q.id].correct);
  return (
    <section id={id} className={`result ${pct >= 70 ? 'ok' : pct >= 50 ? 'partial' : 'bad'}`} aria-live="polite">
      <div className="result-score"><span>{pct}</span><small>/100</small></div>
      <div className="result-body">
        <p><b>{res.correct}</b> de {res.total} correctas.{pct >= 70 ? ' Buen nivel: pasá a la comprobación o al siguiente tema.' : ' Revisá las explicaciones de cada error antes de reintentar.'}</p>
        {wrong.length > 0 && (
          <>
            <p className="result-label">Errores (quedan en tu banco de errores):</p>
            <ul>{wrong.map((q) => <li key={q.id}><a href={`#${''}`} onClick={(e) => { e.preventDefault(); document.querySelector(`[data-qid="${q.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}>Pregunta {questions.indexOf(q) + 1}</a> — {conceptNames?.[q.concept] ?? q.concept}</li>)}</ul>
            <p className="result-label">Conceptos para repasar: {res.weakConcepts.map((c) => conceptNames?.[c] ?? c).join(' · ')}</p>
          </>
        )}
        <button type="button" className="btn small" onClick={onRetry}>Reintentar</button>
      </div>
    </section>
  );
}
