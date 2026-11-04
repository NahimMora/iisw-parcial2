// Validaciones reales sobre diagramas construidos por el estudiante.
import type { Stereo } from '../content/types';
import type { SeqBuilderSpec, UCBuilderSpec } from '../content/trainer';

export interface Check { ok: boolean; text: string; critical?: boolean }
export interface Validation { score: number; checks: Check[] }

const finish = (checks: Check[]): Validation => ({ score: checks.length ? checks.filter((c) => c.ok).length / checks.length : 0, checks });

// ---------------- Casos de uso ----------------
export interface UCState { actors: string[]; cases: string[]; links: [string, string][] }

export function validateUseCase(spec: UCBuilderSpec, st: UCState, optional: [string, string][] = []): Validation {
  const checks: Check[] = [];
  for (const a of spec.actors) {
    const has = st.actors.includes(a.name);
    if (a.ok) checks.push({ ok: has, text: has ? `Actor "${a.name}" incluido. ${a.why}` : `Falta el actor "${a.name}". ${a.why}`, critical: true });
    else if (has) checks.push({ ok: false, text: `"${a.name}" no es actor: ${a.why}`, critical: true });
  }
  for (const c of spec.cases) {
    const has = st.cases.includes(c.name);
    if (c.ok) checks.push({ ok: has, text: has ? `Caso de uso "${c.name}" incluido.` : `Falta el caso de uso "${c.name}". ${c.why}`, critical: true });
    else if (has) checks.push({ ok: false, text: `"${c.name}" no corresponde como caso de uso: ${c.why}` });
  }
  const key = (l: [string, string]) => `${l[0]}|${l[1]}`;
  const want = new Set(spec.links.map(key));
  const opt = new Set(optional.map(key));
  const have = new Set(st.links.map(key));
  for (const l of spec.links) {
    if (!st.actors.includes(l[0]) || !st.cases.includes(l[1])) continue; // ya penalizado arriba
    if (opt.has(key(l))) continue;
    checks.push({ ok: have.has(key(l)), text: have.has(key(l)) ? `Asociación ${l[0]} — ${l[1]} correcta.` : `Falta conectar ${l[0]} con "${l[1]}".` });
  }
  for (const l of st.links) {
    if (!want.has(key(l)) && !opt.has(key(l))) checks.push({ ok: false, text: `La asociación ${l[0]} — "${l[1]}" no corresponde según la narrativa.` });
  }
  // un único iniciador: no más de un actor "primario" por caso — aproximación: casos con >2 actores
  for (const c of st.cases) {
    const n = st.links.filter((l) => l[1] === c).length;
    if (n === 0) checks.push({ ok: false, text: `"${c}" no tiene ningún actor conectado.` });
  }
  for (const a of st.actors) {
    if (!st.links.some((l) => l[0] === a)) checks.push({ ok: false, text: `El actor "${a}" no está conectado a ningún caso de uso.` });
  }
  return finish(checks);
}

// ---------------- Secuencia ----------------
export interface SeqObj { name: string; kind: Stereo }
export interface SeqMsg { from: number; to: number; label: string; cond: string }
export interface SeqState { objects: SeqObj[]; messages: SeqMsg[] }

export function validateSequence(spec: SeqBuilderSpec, st: SeqState): Validation {
  const checks: Check[] = [];
  const kinds = new Set(st.objects.map((o) => o.kind));
  for (const k of ['interface', 'control', 'entity'] as Stereo[]) {
    const label = { interface: 'interfaz', control: 'control', entity: 'entidad', actor: 'actor' }[k];
    checks.push({ ok: kinds.has(k), text: kinds.has(k) ? `Hay al menos un objeto de ${label}.` : `Falta un objeto de ${label}: todo diagrama necesita los tres estereotipos.`, critical: true });
  }
  // estereotipos asignados
  for (const ref of spec.objects) {
    const mine = st.objects.find((o) => o.name === ref.name);
    if (ref.kind === 'none') { if (mine) checks.push({ ok: false, text: `"${ref.name}" no debería aparecer: ${ref.why}`, critical: true }); continue; }
    if (!mine) { checks.push({ ok: false, text: `Falta "${ref.name}". ${ref.why}` }); continue; }
    checks.push({ ok: mine.kind === ref.kind, text: mine.kind === ref.kind ? `"${ref.name}" con el estereotipo correcto.` : `"${ref.name}" debería ser ${ref.kind === 'interface' ? 'interfaz' : ref.kind === 'control' ? 'control' : ref.kind === 'entity' ? 'entidad' : 'actor'}. ${ref.why}` });
  }
  // actores en los extremos
  const actorIdx = st.objects.map((o, i) => (o.kind === 'actor' ? i : -1)).filter((i) => i >= 0);
  const extremes = actorIdx.every((i) => i === 0 || i === st.objects.length - 1);
  checks.push({ ok: actorIdx.length > 0 && extremes, text: extremes && actorIdx.length ? 'Los actores están en los extremos.' : 'Los actores deben ubicarse en los extremos (el primario a la izquierda).', critical: true });

  const M = st.messages;
  if (M.length === 0) { checks.push({ ok: false, text: 'Todavía no hay mensajes.', critical: true }); return finish(checks); }
  const kindOf = (i: number) => st.objects[i]?.kind;
  let actorOk = true, ifaceOk = true, entOk = true, named = true;
  M.forEach((m) => {
    const a = kindOf(m.from), b = kindOf(m.to);
    if ((a === 'actor' && b !== 'interface') || (b === 'actor' && a !== 'interface')) actorOk = false;
    if ((a === 'interface' && b === 'entity') || (a === 'entity' && b === 'interface')) ifaceOk = false;
    if (a === 'entity' && b !== 'entity') entOk = false;
    if (!m.label.trim()) named = false;
  });
  checks.push({ ok: actorOk, text: actorOk ? 'El actor solo se comunica con interfaces.' : 'Un actor envía o recibe un mensaje de algo que no es una interfaz.', critical: true });
  checks.push({ ok: ifaceOk, text: ifaceOk ? 'La interfaz no accede a entidades directamente.' : 'La interfaz no debe hablar con entidades: tiene que pasar por el control.', critical: true });
  checks.push({ ok: entOk, text: entOk ? 'Las entidades no le "responden" ni deciden por su cuenta.' : 'Una entidad está enviando mensajes: las entidades solo dan o guardan datos cuando el control se los pide.' });
  checks.push({ ok: named, text: named ? 'Todas las flechas tienen nombre.' : 'Hay flechas sin nombre.' });
  checks.push({ ok: kindOf(M[0].from) === 'actor' && kindOf(M[0].to) === 'interface', text: 'El primer mensaje va del actor a la interfaz.' });
  const last = M[M.length - 1];
  checks.push({ ok: kindOf(last.to) === 'actor', text: kindOf(last.to) === 'actor' ? 'El diagrama termina respondiendo a un actor.' : 'Falta la respuesta final al actor (control → interfaz → actor).' });
  const hasCond = M.some((m) => m.cond.trim().length > 0);
  checks.push({ ok: hasCond, text: hasCond ? 'La alternativa aparece con [condición].' : 'Falta la alternativa con su [condición] (p. ej. [ocupada o con deudas]).', critical: true });
  const hasSelf = M.some((m) => m.from === m.to && kindOf(m.from) === 'control');
  checks.push({ ok: hasSelf, text: hasSelf ? 'El control valida (mensaje recursivo).' : 'Falta que el control valide (p. ej. Validar() sobre sí mismo).' });
  // orden relativo según la descripción
  const rank = Object.fromEntries(spec.labels.map((l) => [l.text, l.rank]));
  const ranks = M.map((m) => rank[m.label]).filter((r): r is number => r !== undefined);
  let ordered = true;
  for (let i = 1; i < ranks.length; i++) if (ranks[i] < ranks[i - 1] && !(ranks[i] === 5 || ranks[i - 1] === 5)) ordered = false;
  const need = ['req', 'del', 'reg', 'ok'].every((k) => M.some((m) => spec.labels.find((l) => l.key === k)?.text === m.label));
  checks.push({ ok: ordered && need, text: ordered && need ? 'El orden de los mensajes sigue la descripción.' : 'El orden no sigue la descripción (pedido → delegación → datos → validación → registro → confirmación) o falta algún paso clave.', critical: true });
  const regOk = M.some((m) => kindOf(m.from) === 'control' && kindOf(m.to) === 'entity' && /Registrar/.test(m.label));
  checks.push({ ok: regOk, text: regOk ? 'El control ordena registrar en una entidad.' : 'El registro de la reserva debe ser un mensaje del control a una entidad.' });
  return finish(checks);
}
