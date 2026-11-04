import { describe, expect, it } from 'vitest';
import { validateSequence, validateUseCase, type SeqState } from '../../src/lib/validators';
import { ERRORS, GUIDED, KAMERAL_PROBLEM, LAVADERO, PADEL_LINK_OPTIONAL, PADEL_SEQ, PADEL_UC, VIANDAS } from '../../src/content/trainer';

const refUC = () => ({ actors: PADEL_UC.actors.filter((a) => a.ok).map((a) => a.name), cases: PADEL_UC.cases.filter((c) => c.ok).map((c) => c.name), links: [...PADEL_UC.links] });

function refSeq(): SeqState {
  const r = PADEL_SEQ.reference;
  const idx = Object.fromEntries(r.participants.map((p, i) => [p.id, i]));
  return {
    objects: r.participants.map((p) => ({ name: p.name, kind: p.kind })),
    messages: r.messages.map((m) => ({ from: idx[m.from], to: idx[m.to], label: m.label, cond: m.cond ?? '' })),
  };
}

describe('validador de casos de uso', () => {
  it('la referencia obtiene 100 %', () => {
    const v = validateUseCase(PADEL_UC, refUC(), PADEL_LINK_OPTIONAL);
    expect(v.checks.filter((c) => !c.ok)).toEqual([]);
    expect(v.score).toBe(1);
  });
  it('detecta un empleado interno como actor', () => {
    const s = refUC(); s.actors.push('Recepcionista'); s.links.push(['Recepcionista', 'Reservar cancha']);
    const v = validateUseCase(PADEL_UC, s, PADEL_LINK_OPTIONAL);
    expect(v.checks.some((c) => !c.ok && /Recepcionista/.test(c.text))).toBe(true);
    expect(v.score).toBeLessThan(1);
  });
  it('detecta asociaciones faltantes y sobrantes y casos técnicos', () => {
    const s = refUC(); s.links = s.links.filter((l) => l[1] !== 'Reservar cancha'); s.links.push(['Administrador', 'Reservar cancha']); s.cases.push('Iniciar sesión');
    const v = validateUseCase(PADEL_UC, s, PADEL_LINK_OPTIONAL);
    const bad = v.checks.filter((c) => !c.ok).map((c) => c.text).join(' | ');
    expect(bad).toMatch(/Falta conectar Jugador/);
    expect(bad).toMatch(/Administrador — "Reservar cancha" no corresponde/);
    expect(bad).toMatch(/Iniciar sesión/);
  });
  it('un diagrama vacío no aprueba', () => {
    expect(validateUseCase(PADEL_UC, { actors: [], cases: [], links: [] }).score).toBe(0);
  });
});

describe('validador de secuencia', () => {
  it('la referencia obtiene 100 %', () => {
    const v = validateSequence(PADEL_SEQ, refSeq());
    expect(v.checks.filter((c) => !c.ok)).toEqual([]);
  });
  it('actor hablando con una entidad', () => {
    const s = refSeq(); s.messages[0] = { ...s.messages[0], to: 3 };
    const v = validateSequence(PADEL_SEQ, s);
    expect(v.checks.find((c) => /actor solo|que no es una interfaz/.test(c.text))?.ok).toBe(false);
  });
  it('sin control', () => {
    const s = refSeq(); s.objects[2] = { ...s.objects[2], kind: 'interface' };
    const v = validateSequence(PADEL_SEQ, s);
    expect(v.checks.find((c) => /objeto de control/.test(c.text))?.ok).toBe(false);
  });
  it('orden invertido (registrar antes de validar)', () => {
    const s = refSeq(); const reg = s.messages.splice(7, 1)[0]; s.messages.splice(2, 0, reg);
    const v = validateSequence(PADEL_SEQ, s);
    expect(v.checks.find((c) => /orden/.test(c.text))?.ok).toBe(false);
  });
  it('sin alternativa ni actor en extremo', () => {
    const s = refSeq(); s.messages = s.messages.map((m) => ({ ...m, cond: '' }));
    [s.objects[0], s.objects[1]] = [s.objects[1], s.objects[0]];
    const v = validateSequence(PADEL_SEQ, s);
    expect(v.checks.find((c) => /condición/.test(c.text))?.ok).toBe(false);
    expect(v.checks.find((c) => /extremos/.test(c.text))?.ok).toBe(false);
  });
  it('incluir a la recepcionista se penaliza', () => {
    const s = refSeq(); s.objects.push({ name: 'Recepcionista', kind: 'actor' });
    expect(validateSequence(PADEL_SEQ, s).checks.some((c) => !c.ok && /Recepcionista/.test(c.text))).toBe(true);
  });
});

describe('contenido del entrenador', () => {
  it('preguntas válidas y únicas', () => {
    const qs = [...GUIDED, ...ERRORS];
    expect(new Set(qs.map((q) => q.id)).size).toBe(qs.length);
    qs.forEach((q) => {
      if (q.type === 'multi') q.answer.forEach((a) => expect(a).toBeLessThan(q.options.length));
      if (q.type === 'fill') expect((q.text.match(/\{\d+\}/g) ?? []).length).toBe(q.blanks.length);
    });
  });
  it('problemas de papel con referencia completa y 4 herramientas', () => {
    for (const pr of [VIANDAS, LAVADERO, KAMERAL_PROBLEM]) {
      expect(pr.rubric).toHaveLength(4);
      const ids = new Set([...pr.ref.uc.actors.map((a) => a.id), ...pr.ref.uc.cases.map((c) => c.id)]);
      pr.ref.uc.links.forEach((l) => { expect(ids.has(l.actor)).toBe(true); expect(ids.has(l.uc)).toBe(true); });
      const kinds = new Set(pr.ref.seq.participants.map((p) => p.kind));
      expect(kinds.has('interface') && kinds.has('control') && kinds.has('entity')).toBe(true);
      // el actor solo habla con interfaces en las referencias
      const k = Object.fromEntries(pr.ref.seq.participants.map((p) => [p.id, p.kind]));
      pr.ref.seq.messages.forEach((m) => { if (k[m.from] === 'actor' || k[m.to] === 'actor') expect([k[m.from], k[m.to]]).toContain('interface'); });
    }
  });
});
