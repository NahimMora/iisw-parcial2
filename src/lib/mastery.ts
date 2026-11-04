import type { Chapter, Question } from '../content/types';
import type { Progress } from './progress';

export const MASTERY_PASS = 0.7;

const best = (a: { score: number }[]) => a.reduce((m, x) => Math.max(m, x.score), 0);
const last = (a: { score: number }[]) => (a.length ? a[a.length - 1].score : 0);

/**
 * Dominio estimado de un capítulo (0..1). Solo cuentan actividades que exigen
 * recordar o producir: ver el video no suma.
 *   45 % comprobación de dominio (último intento, para no quedar inflado)
 *   35 % mejor nota de ejercicios
 *   10 % actividades de cuaderno hechas
 *   10 % penalización por errores sin resolver del capítulo
 */
export function chapterMastery(ch: Chapter, p: Progress): number {
  const cp = p.chapters[ch.id];
  if (!cp) return 0;
  const m = last(cp.mastery);
  const q = best(cp.quiz);
  const nb = ch.notebook.length ? cp.notebookDone.length / ch.notebook.length : 0;
  const open = Object.values(p.errors).filter((e) => e.chapter === ch.id && !e.resolved).length;
  const total = ch.quiz.length + ch.mastery.length || 1;
  const errPenalty = Math.min(1, open / total);
  const v = 0.45 * m + 0.35 * q + 0.1 * Math.min(1, nb) + 0.1 * (1 - errPenalty) * (q > 0 ? 1 : 0);
  return Math.max(0, Math.min(1, v));
}

export function chapterCompleted(ch: Chapter, p: Progress): boolean {
  const cp = p.chapters[ch.id];
  return !!cp && last(cp.mastery) >= MASTERY_PASS;
}

export type ChapterState = 'nuevo' | 'en-curso' | 'refuerzo' | 'dominado';
export function chapterState(ch: Chapter, p: Progress): ChapterState {
  const cp = p.chapters[ch.id];
  if (!cp || (cp.visited.length === 0 && cp.quiz.length === 0)) return 'nuevo';
  if (chapterCompleted(ch, p)) return 'dominado';
  if (cp.mastery.length > 0 || cp.quiz.length > 0) return 'refuerzo';
  return 'en-curso';
}

/** Minutos restantes estimados según lo que falta de cada capítulo disponible. */
export function remainingMinutes(chs: Chapter[], p: Progress): number {
  return chs.reduce((acc, ch) => {
    const st = chapterState(ch, p);
    const full = ch.minutes.video + ch.minutes.practice;
    if (st === 'dominado') return acc;
    if (st === 'refuerzo') return acc + Math.round(ch.minutes.practice * 0.5);
    if (st === 'en-curso') return acc + Math.round(full * 0.7);
    return acc + full;
  }, 0);
}

// ---------- Repaso adaptativo ----------
const PRIORITY_W: Record<Chapter['priority'], number> = { 'MÁXIMA': 3, 'ALTA': 2, 'MEDIA': 1 };

export interface ScoredQuestion { q: Question; chapter: Chapter; priority: number; reason: string }

/**
 * Prioriza preguntas según: errores (fallos sin resolver), dificultad del capítulo,
 * relevancia para el parcial, nivel de la pregunta y precisión previa en el concepto.
 * Excluye conceptos ya dominados (≥ 85 % de aciertos con ≥ 3 intentos) salvo errores abiertos.
 */
export function adaptiveQueue(chs: Chapter[], p: Progress, n = 12): ScoredQuestion[] {
  const out: ScoredQuestion[] = [];
  for (const ch of chs) {
    for (const q of [...ch.quiz, ...ch.mastery]) {
      if (q.type === 'open') continue;
      const err = p.errors[q.id];
      const c = p.concepts[q.concept];
      const acc = c && c.seen ? c.ok / c.seen : 0.5;
      const mastered = c && c.seen >= 3 && acc >= 0.85;
      const openErr = err && !err.resolved;
      if (mastered && !openErr) continue;
      let pr = PRIORITY_W[ch.priority] + ch.difficulty / 4 + q.level * 0.5 + (1 - acc) * 3;
      let reason = `Relevancia ${ch.priority.toLowerCase()} · precisión en el concepto ${Math.round(acc * 100)} %`;
      if (openErr) { pr += 4 + err.fails; reason = `Fallaste ${err.fails} ${err.fails === 1 ? 'vez' : 'veces'} esta pregunta`; }
      else if (!c) { pr -= 1; reason = 'Concepto todavía no practicado'; }
      out.push({ q, chapter: ch, priority: pr, reason });
    }
  }
  out.sort((a, b) => b.priority - a.priority || a.q.id.localeCompare(b.q.id));
  // diversidad: como máximo 3 preguntas por concepto
  const per: Record<string, number> = {};
  return out.filter((s) => { per[s.q.concept] = (per[s.q.concept] ?? 0) + 1; return per[s.q.concept] <= 3; }).slice(0, n);
}
