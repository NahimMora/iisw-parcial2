import type { Grade, Question, Response } from '../content/types';

/** Respuesta vacía para una pregunta. */
export function emptyResponse(q: Question): Response {
  switch (q.type) {
    case 'mcq': return { type: 'mcq', value: null };
    case 'multi': return { type: 'multi', value: [] };
    case 'tf': return { type: 'tf', value: null };
    case 'match': return { type: 'match', value: q.pairs.map(() => null) };
    case 'order': return { type: 'order', value: shuffledIndices(q.items.length, q.id) };
    case 'fill': return { type: 'fill', value: q.blanks.map(() => null) };
    case 'open': return { type: 'open', value: { text: '', checks: q.rubric.map(() => false), revealed: false } };
  }
}

/** Permutación determinista (no idéntica a la identidad) a partir de una semilla de texto. */
export function shuffledIndices(n: number, seed: string): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  if (n > 1 && idx.every((v, i) => v === i)) [idx[0], idx[1]] = [idx[1], idx[0]];
  return idx;
}

export function isAnswered(q: Question, r: Response): boolean {
  switch (r.type) {
    case 'mcq': return r.value !== null;
    case 'tf': return r.value !== null;
    case 'multi': return r.value.length > 0;
    case 'match': return r.value.every((v) => v !== null);
    case 'order': return true;
    case 'fill': return r.value.every((v) => v !== null);
    case 'open': return r.value.revealed;
  }
  void q;
}

/** Corrección determinista. Para "open" se usa la autoevaluación por rúbrica. */
export function grade(q: Question, r: Response): Grade {
  const answered = isAnswered(q, r);
  const detail: string[] = [];
  let score = 0;
  if (q.type === 'mcq' && r.type === 'mcq') {
    score = r.value === q.answer ? 1 : 0;
    if (score === 0 && r.value !== null && q.why?.[r.value]) detail.push(q.why[r.value]);
  } else if (q.type === 'tf' && r.type === 'tf') {
    score = r.value === q.answer ? 1 : 0;
  } else if (q.type === 'multi' && r.type === 'multi') {
    const sel = new Set(r.value); const ans = new Set(q.answer);
    let hits = 0, wrong = 0;
    q.options.forEach((_, i) => {
      if (sel.has(i) && ans.has(i)) hits++;
      else if (sel.has(i) && !ans.has(i)) { wrong++; if (q.why?.[i]) detail.push(q.why[i]); }
    });
    // crédito parcial: aciertos menos errores, sobre el total de correctas
    score = Math.max(0, (hits - wrong) / ans.size);
    if (hits === ans.size && wrong === 0) score = 1;
  } else if (q.type === 'match' && r.type === 'match') {
    let ok = 0;
    q.pairs.forEach((p, i) => { if (r.value[i] === i) ok++; else detail.push(`"${p[0]}" corresponde a "${p[1]}".`); });
    score = ok / q.pairs.length;
  } else if (q.type === 'order' && r.type === 'order') {
    let ok = 0;
    r.value.forEach((itemIdx, pos) => { if (itemIdx === pos) ok++; });
    score = ok === q.items.length ? 1 : ok / q.items.length * 0.8; // orden exacto = 100 %
  } else if (q.type === 'fill' && r.type === 'fill') {
    let ok = 0;
    q.blanks.forEach((b, i) => { if (r.value[i] === b.answer) ok++; else detail.push(`Hueco ${i + 1}: era "${b.options[b.answer]}".`); });
    score = ok / q.blanks.length;
  } else if (q.type === 'open' && r.type === 'open') {
    const n = q.rubric.length;
    score = n ? r.value.checks.filter(Boolean).length / n : 0;
  }
  score = Math.round(score * 100) / 100;
  return { score, correct: score >= 0.999, answered, detail };
}

export interface QuizResult {
  score: number;          // 0..1
  correct: number;
  total: number;
  grades: Record<string, Grade>;
  weakConcepts: string[];
}

export function gradeAll(qs: Question[], rs: Record<string, Response>): QuizResult {
  const grades: Record<string, Grade> = {};
  let sum = 0, correct = 0;
  const weak = new Set<string>();
  for (const q of qs) {
    const g = grade(q, rs[q.id] ?? emptyResponse(q));
    grades[q.id] = g;
    sum += g.score;
    if (g.correct) correct++; else weak.add(q.concept);
  }
  return { score: qs.length ? sum / qs.length : 0, correct, total: qs.length, grades, weakConcepts: [...weak] };
}
