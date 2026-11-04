import type { Chapter, Question } from './types';
import { ch1 } from './chapters/ch1';
import { stubs } from './chapters/stubs';

const ready: Chapter[] = [ch1];
const readyIds = new Set(ready.map((c) => c.id));

/** Todos los capítulos en orden; los no publicados aparecen "En preparación". */
export const CHAPTERS: Chapter[] = [...ready, ...stubs.filter((s) => !readyIds.has(s.id))].sort((a, b) => a.num - b.num);
export const READY = CHAPTERS.filter((c) => c.status === 'ready');

export const EXAM_DATE = '2026-11-05';

export function getChapter(id: string) { return CHAPTERS.find((c) => c.id === id); }

let qi: Record<string, { q: Question; chapter: Chapter }> | null = null;
export function questionIndex() {
  if (!qi) {
    qi = {};
    for (const ch of READY) for (const q of [...ch.quiz, ...ch.mastery]) qi[q.id] = { q, chapter: ch };
  }
  return qi;
}
