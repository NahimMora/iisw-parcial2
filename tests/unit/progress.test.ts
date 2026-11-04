import { beforeEach, describe, expect, it } from 'vitest';
import { emptyProgress, exportJSON, importJSON, load, normalize, recordAnswer, resetMemoryForTests, save, STORAGE_KEY, update } from '../../src/lib/progress';
import { adaptiveQueue, chapterCompleted, chapterMastery } from '../../src/lib/mastery';
import { READY } from '../../src/content/registry';

beforeEach(() => { localStorage.clear(); resetMemoryForTests(); });

describe('persistencia', () => {
  it('guarda y recupera desde localStorage', () => {
    update((p) => { p.lastChapter = 'ch1'; p.bookmarks.push('ch1:teoria:0'); });
    resetMemoryForTests();
    const p = load();
    expect(p.lastChapter).toBe('ch1');
    expect(p.bookmarks).toEqual(['ch1:teoria:0']);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).lastChapter).toBe('ch1');
  });
  it('tolera datos corruptos', () => {
    localStorage.setItem(STORAGE_KEY, '{no es json');
    resetMemoryForTests();
    expect(load().chapters).toEqual({});
  });
  it('normaliza progresos viejos o parciales sin perder datos', () => {
    const n = normalize({ chapters: { ch1: { quiz: [{ at: 'x', score: 1, correct: 1, total: 1 }] } }, lastChapter: 'ch1' });
    expect(n.chapters.ch1.quiz).toHaveLength(1);
    expect(n.chapters.ch1.mastery).toEqual([]);
    expect(n.errors).toEqual({});
    expect(n.lastChapter).toBe('ch1');
  });
  it('exporta e importa JSON', () => {
    update((p) => { p.lastChapter = 'ch1'; });
    const json = exportJSON();
    save(emptyProgress());
    expect(load().lastChapter).toBeUndefined();
    expect(importJSON(json).ok).toBe(true);
    expect(load().lastChapter).toBe('ch1');
    expect(importJSON('{"x":1}').ok).toBe(false);
    expect(importJSON('nope').ok).toBe(false);
  });
});

describe('banco de errores', () => {
  it('un error se resuelve con dos aciertos seguidos', () => {
    const p = emptyProgress();
    recordAnswer(p, 'ch1', 'q', 'C', false);
    expect(p.errors.q.resolved).toBe(false);
    recordAnswer(p, 'ch1', 'q', 'C', true);
    expect(p.errors.q.resolved).toBe(false);
    recordAnswer(p, 'ch1', 'q', 'C', false);
    expect(p.errors.q.fails).toBe(2);
    expect(p.errors.q.streak).toBe(0);
    recordAnswer(p, 'ch1', 'q', 'C', true);
    recordAnswer(p, 'ch1', 'q', 'C', true);
    expect(p.errors.q.resolved).toBe(true);
    expect(p.concepts.C).toEqual({ seen: 5, ok: 3 });
  });
});

describe('dominio', () => {
  const ch = READY[0];
  it('ver el video no suma dominio', () => {
    const p = emptyProgress();
    p.chapters[ch.id] = { visited: ['video'], videoSeconds: { v: 999 }, notebookDone: [], quiz: [], mastery: [] };
    expect(chapterMastery(ch, p)).toBe(0);
    expect(chapterCompleted(ch, p)).toBe(false);
  });
  it('se completa con la comprobación ≥ 70 %', () => {
    const p = emptyProgress();
    p.chapters[ch.id] = { visited: [], videoSeconds: {}, notebookDone: [], quiz: [{ at: '', score: 0.9, correct: 9, total: 10 }], mastery: [{ at: '', score: 0.75, correct: 6, total: 8 }] };
    expect(chapterCompleted(ch, p)).toBe(true);
    expect(chapterMastery(ch, p)).toBeGreaterThan(0.7);
  });
  it('el repaso adaptativo prioriza errores abiertos', () => {
    const p = emptyProgress();
    const q = ch.quiz[5];
    recordAnswer(p, ch.id, q.id, q.concept, false);
    const queue = adaptiveQueue(READY, p, 5);
    expect(queue[0].q.id).toBe(q.id);
  });
});
