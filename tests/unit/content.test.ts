import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { CHAPTERS, READY } from '../../src/content/registry';
import type { DiagramSpec, Question } from '../../src/content/types';

function checkDiagram(d: DiagramSpec) {
  if (d.kind === 'usecase') {
    const ids = new Set([...d.actors.map((a) => a.id), ...d.cases.map((c) => c.id)]);
    d.links.forEach((l) => { expect(ids.has(l.actor), `actor ${l.actor}`).toBe(true); expect(ids.has(l.uc), `uc ${l.uc}`).toBe(true); });
  } else {
    const ids = new Set(d.participants.map((p) => p.id));
    d.messages.forEach((m) => { expect(ids.has(m.from), m.from).toBe(true); expect(ids.has(m.to), m.to).toBe(true); });
  }
}

function checkQuestion(q: Question) {
  expect(q.prompt.length).toBeGreaterThan(5);
  expect(q.explain.length).toBeGreaterThan(5);
  if (q.type === 'mcq') { expect(q.answer).toBeGreaterThanOrEqual(0); expect(q.answer).toBeLessThan(q.options.length); }
  if (q.type === 'multi') { expect(q.answer.length).toBeGreaterThan(0); q.answer.forEach((a) => expect(a).toBeLessThan(q.options.length)); }
  if (q.type === 'fill') {
    const holes = q.text.match(/\{\d+\}/g) ?? [];
    expect(holes.length).toBe(q.blanks.length);
    q.blanks.forEach((b) => expect(b.answer).toBeLessThan(b.options.length));
  }
  if (q.type === 'match') expect(new Set(q.pairs.map((p) => p[1])).size).toBe(q.pairs.length);
  if (q.type === 'order') expect(q.items.length).toBeGreaterThan(2);
  if (q.type === 'open') expect(q.rubric.length).toBeGreaterThan(1);
  if (q.diagram) checkDiagram(q.diagram);
}

describe('integridad del contenido', () => {
  it('ids de pregunta únicos en toda la plataforma', () => {
    const ids = READY.flatMap((c) => [...c.quiz, ...c.mastery].map((q) => q.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('numeración de capítulos continua', () => {
    expect(CHAPTERS.map((c) => c.num)).toEqual(CHAPTERS.map((_, i) => i + 1));
  });
  for (const ch of READY) {
    describe(`capítulo ${ch.num}`, () => {
      it('tiene las 9 secciones con contenido real', () => {
        expect(ch.intro.hook.length).toBeGreaterThan(20);
        expect(ch.theory.length).toBeGreaterThan(1);
        expect(ch.videos.length).toBeGreaterThan(0);
        expect(ch.map.nodes.length).toBeGreaterThan(5);
        expect(ch.notebook.length).toBeGreaterThan(0);
        expect(ch.quiz.length).toBeGreaterThanOrEqual(8);
        expect(ch.mastery.length).toBeGreaterThanOrEqual(5);
        expect(ch.pitfalls.length).toBeGreaterThan(2);
      });
      it('usa varios formatos de pregunta', () => {
        expect(new Set(ch.quiz.map((q) => q.type)).size).toBeGreaterThanOrEqual(5);
      });
      it('preguntas válidas', () => { [...ch.quiz, ...ch.mastery].forEach(checkQuestion); });
      it('mapa conceptual consistente', () => {
        const ids = new Set(ch.map.nodes.map((n) => n.id));
        ch.map.edges.forEach((e) => { expect(ids.has(e.from)).toBe(true); expect(ids.has(e.to)).toBe(true); });
        ch.map.nodes.forEach((n) => { expect(ch.map.groups[n.group], n.group).toBeTruthy(); if (n.parent) expect(ids.has(n.parent)).toBe(true); });
      });
      it('diagramas de teoría válidos', () => {
        ch.theory.forEach((s) => s.blocks.forEach((b) => { if (b.t === 'figure') checkDiagram(b.diagram); }));
        ch.notebook.forEach((n) => n.refDiagram && checkDiagram(n.refDiagram));
      });
      it('los videos publicados existen', () => {
        ch.videos.forEach((v) => expect(existsSync(`public/${v.src}`), v.src).toBe(true));
      });
    });
  }
});
