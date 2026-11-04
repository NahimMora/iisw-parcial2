// Persistencia del progreso en localStorage, con versión de esquema,
// migración tolerante y exportación/importación JSON.
import { useSyncExternalStore } from 'react';

export const STORAGE_KEY = 'iisw2-progress';
export const SCHEMA_VERSION = 1;

export interface Attempt { at: string; score: number; correct: number; total: number }
export interface ChapterProgress {
  visited: string[];            // secciones vistas
  videoSeconds: Record<string, number>;
  notebookDone: number[];
  quiz: Attempt[];
  mastery: Attempt[];
  lastSection?: string;
}
export interface ErrorEntry {
  qid: string; chapter: string; concept: string;
  fails: number; streak: number;       // streak = aciertos seguidos desde el último error
  lastAt: string; resolved: boolean;
}
export interface ExamRecord { kind: 'teorico' | 'practico'; at: string; score: number; detail: Record<string, number> }
export interface TrainerRecord { at: string; score: number }
export interface Progress {
  version: number;
  createdAt: string;
  updatedAt: string;
  lastChapter?: string;
  chapters: Record<string, ChapterProgress>;
  errors: Record<string, ErrorEntry>;
  bookmarks: string[];               // "ch1:teoria:2"
  exams: ExamRecord[];
  trainer: Record<string, TrainerRecord[]>;   // "n3-kameral" -> intentos
  concepts: Record<string, { seen: number; ok: number }>;
}

export function emptyProgress(): Progress {
  const now = new Date().toISOString();
  return { version: SCHEMA_VERSION, createdAt: now, updatedAt: now, chapters: {}, errors: {}, bookmarks: [], exams: [], trainer: {}, concepts: {} };
}

export function emptyChapter(): ChapterProgress {
  return { visited: [], videoSeconds: {}, notebookDone: [], quiz: [], mastery: [] };
}

/** Normaliza datos de cualquier origen (versiones anteriores, importaciones parciales). */
export function normalize(raw: unknown): Progress {
  const base = emptyProgress();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<Progress>;
  const chapters: Record<string, ChapterProgress> = {};
  for (const [k, v] of Object.entries(r.chapters ?? {})) chapters[k] = { ...emptyChapter(), ...(v as ChapterProgress) };
  return {
    ...base,
    ...r,
    version: SCHEMA_VERSION,
    chapters,
    errors: { ...(r.errors ?? {}) },
    bookmarks: Array.isArray(r.bookmarks) ? r.bookmarks : [],
    exams: Array.isArray(r.exams) ? r.exams : [],
    trainer: { ...(r.trainer ?? {}) },
    concepts: { ...(r.concepts ?? {}) },
  };
}

// ---------- store ----------
type Listener = () => void;
const listeners = new Set<Listener>();
let memory: Progress | null = null;

function storage(): Storage | null {
  try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch { return null; }
}

export function load(): Progress {
  if (memory) return memory;
  try {
    const txt = storage()?.getItem(STORAGE_KEY);
    memory = txt ? normalize(JSON.parse(txt)) : emptyProgress();
  } catch { memory = emptyProgress(); }
  return memory;
}

export function save(p: Progress) {
  memory = { ...p, updatedAt: new Date().toISOString() };
  try { storage()?.setItem(STORAGE_KEY, JSON.stringify(memory)); } catch { /* sin almacenamiento */ }
  listeners.forEach((l) => l());
}

export function update(fn: (p: Progress) => void) {
  const draft = structuredClone(load());
  fn(draft);
  save(draft);
}

export function chapterOf(p: Progress, id: string): ChapterProgress {
  if (!p.chapters[id]) p.chapters[id] = emptyChapter();
  return p.chapters[id];
}

export function resetMemoryForTests() { memory = null; }

export function useProgress(): Progress {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, load, load);
}

// ---------- registro de respuestas ----------
export function recordAnswer(p: Progress, chapter: string, qid: string, concept: string, correct: boolean) {
  const c = (p.concepts[concept] ??= { seen: 0, ok: 0 });
  c.seen++; if (correct) c.ok++;
  const e = p.errors[qid];
  if (!correct) {
    p.errors[qid] = { qid, chapter, concept, fails: (e?.fails ?? 0) + 1, streak: 0, lastAt: new Date().toISOString(), resolved: false };
  } else if (e) {
    e.streak++;
    if (e.streak >= 2) e.resolved = true;   // dos aciertos seguidos = resuelto
  }
}

// ---------- exportar / importar ----------
export function exportJSON(): string {
  return JSON.stringify({ app: 'iisw-parcial2', ...load() }, null, 2);
}

export function importJSON(text: string): { ok: boolean; msg: string } {
  try {
    const data = JSON.parse(text);
    if (!data || typeof data !== 'object' || !('chapters' in data)) return { ok: false, msg: 'El archivo no parece un progreso de esta plataforma.' };
    save(normalize(data));
    return { ok: true, msg: 'Progreso importado.' };
  } catch {
    return { ok: false, msg: 'JSON inválido.' };
  }
}
