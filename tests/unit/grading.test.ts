import { describe, expect, it } from 'vitest';
import { emptyResponse, grade, gradeAll, shuffledIndices } from '../../src/lib/grading';
import type { Question } from '../../src/content/types';

const base = { concept: 'c', level: 1 as const, prompt: 'p', explain: 'e' };

describe('grade', () => {
  it('mcq: solo la opción correcta suma', () => {
    const q: Question = { ...base, id: 'a', type: 'mcq', options: ['x', 'y', 'z'], answer: 1 };
    expect(grade(q, { type: 'mcq', value: 1 }).correct).toBe(true);
    expect(grade(q, { type: 'mcq', value: 0 }).score).toBe(0);
    expect(grade(q, { type: 'mcq', value: null }).answered).toBe(false);
  });
  it('tf', () => {
    const q: Question = { ...base, id: 'b', type: 'tf', answer: false };
    expect(grade(q, { type: 'tf', value: false }).correct).toBe(true);
    expect(grade(q, { type: 'tf', value: true }).correct).toBe(false);
  });
  it('multi: crédito parcial y penalización por marcas incorrectas', () => {
    const q: Question = { ...base, id: 'c', type: 'multi', options: ['a', 'b', 'c', 'd'], answer: [0, 2] };
    expect(grade(q, { type: 'multi', value: [0, 2] }).score).toBe(1);
    expect(grade(q, { type: 'multi', value: [0] }).score).toBe(0.5);
    expect(grade(q, { type: 'multi', value: [0, 1] }).score).toBe(0);
    expect(grade(q, { type: 'multi', value: [0, 1, 2, 3] }).score).toBe(0);
  });
  it('match: proporción de pares correctos', () => {
    const q: Question = { ...base, id: 'd', type: 'match', pairs: [['1', 'a'], ['2', 'b'], ['3', 'c'], ['4', 'd']] };
    expect(grade(q, { type: 'match', value: [0, 1, 2, 3] }).correct).toBe(true);
    expect(grade(q, { type: 'match', value: [0, 1, 3, 2] }).score).toBe(0.5);
  });
  it('order: 100 % solo con el orden exacto', () => {
    const q: Question = { ...base, id: 'e', type: 'order', items: ['a', 'b', 'c', 'd'] };
    expect(grade(q, { type: 'order', value: [0, 1, 2, 3] }).score).toBe(1);
    const g = grade(q, { type: 'order', value: [1, 0, 2, 3] });
    expect(g.correct).toBe(false);
    expect(g.score).toBeCloseTo(0.4);
  });
  it('fill', () => {
    const q: Question = { ...base, id: 'f', type: 'fill', text: '{0} {1}', blanks: [{ options: ['x', 'y'], answer: 1 }, { options: ['x', 'y'], answer: 0 }] };
    expect(grade(q, { type: 'fill', value: [1, 0] }).correct).toBe(true);
    expect(grade(q, { type: 'fill', value: [1, 1] }).score).toBe(0.5);
  });
  it('open: rúbrica de autoevaluación', () => {
    const q: Question = { ...base, id: 'g', type: 'open', model: 'm', rubric: ['a', 'b', 'c', 'd'] };
    expect(grade(q, { type: 'open', value: { text: 't', checks: [true, true, false, false], revealed: true } }).score).toBe(0.5);
  });
});

describe('gradeAll', () => {
  it('promedia y lista conceptos débiles', () => {
    const qs: Question[] = [
      { ...base, id: 'x1', concept: 'A', type: 'tf', answer: true },
      { ...base, id: 'x2', concept: 'B', type: 'tf', answer: true },
    ];
    const r = gradeAll(qs, { x1: { type: 'tf', value: true }, x2: { type: 'tf', value: false } });
    expect(r.score).toBe(0.5);
    expect(r.correct).toBe(1);
    expect(r.weakConcepts).toEqual(['B']);
  });
});

describe('shuffledIndices', () => {
  it('es determinista, una permutación válida y nunca la identidad', () => {
    for (const n of [2, 3, 5, 8]) {
      const a = shuffledIndices(n, 'seed' + n);
      expect(a).toEqual(shuffledIndices(n, 'seed' + n));
      expect([...a].sort((x, y) => x - y)).toEqual(Array.from({ length: n }, (_, i) => i));
      expect(a.every((v, i) => v === i)).toBe(false);
    }
  });
  it('la respuesta vacía de "order" no viene ya resuelta', () => {
    const q: Question = { ...base, id: 'ord', type: 'order', items: ['a', 'b', 'c'] };
    const r = emptyResponse(q);
    expect(grade(q, r).correct).toBe(false);
  });
});
