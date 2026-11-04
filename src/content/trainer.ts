// Escenarios del entrenador de diagramas y del simulacro práctico.
import type { CUDescription, Question, SequenceDiagramSpec, Stereo, UseCaseDiagramSpec } from './types';
import { KAMERAL_CU2, KAMERAL_SEQ, KAMERAL_TEXT, KAMERAL_UC, SERVICIO_CU2, SERVICIO_REQS, SERVICIO_SEQ, SERVICIO_TEXT, SERVICIO_UC } from './cases';

// ---------------- Nivel 1: observación (Kameral) ----------------
export interface ObsStep { title: string; text: string; uc?: UseCaseDiagramSpec; seq?: SequenceDiagramSpec; reqs?: string[]; cu?: CUDescription }
const ucUpTo = (n: number): UseCaseDiagramSpec => {
  const order = ['pna-cu1', 'soc-cu1', 'soc-cu2', 'soc-cu3', 'coo-cu4', 'soc-cu4'];
  const links = KAMERAL_UC.links.filter((l) => order.indexOf(`${l.actor}-${l.uc}`) < n);
  return { ...KAMERAL_UC, links };
};
const seqUpTo = (n: number): SequenceDiagramSpec => ({ ...KAMERAL_SEQ, messages: KAMERAL_SEQ.messages.slice(0, n) });
export const OBSERVATION: ObsStep[] = [
  { title: 'La narrativa', text: 'Biblioteca Kameral: ' + KAMERAL_TEXT + ' Leela por párrafos y marcá quién viene de afuera y qué quiere.' },
  { title: 'Lista de requerimientos', text: 'Un "El sistema debe…" por proceso de negocio. Son las cuatro funciones básicas.', reqs: ['a) El sistema debe gestionar el alta de socios.', 'b) El sistema debe gestionar la solicitud de libros.', 'c) El sistema debe gestionar la devolución de libros.', 'd) El sistema debe proveer un informe de préstamos vencidos.'] },
  { title: 'Actores y frontera', text: 'Externos: Persona no asociada, Socio y Coordinador. El bibliotecario atiende → parte del sistema. Casos de uso adentro, actores afuera.', uc: ucUpTo(0) },
  { title: 'CU1 Alta de socio', text: 'Lo inicia la persona no asociada; al terminar, el socio queda registrado (participa).', uc: ucUpTo(2) },
  { title: 'CU2 y CU3', text: 'Solicitar libro y Devolver libro: objetivos del socio.', uc: ucUpTo(4) },
  { title: 'CU4 Informe de préstamos', text: 'Lo inicia el coordinador (P); el socio recibe el mail (S).', uc: ucUpTo(6) },
  { title: 'Descripción de CU-02', text: 'Encabezado, curso normal con R1 y FCU, alternativa 2.1–2.3.', cu: KAMERAL_CU2 },
  { title: 'Secuencia: objetos', text: 'Actor Socio, interfaz Préstamo, control Retirar, entidades Socios y Libros.', seq: seqUpTo(0) },
  { title: 'Secuencia: pedido y delegación', text: 'Socio → Préstamo (solo interfaz) → Retirar (la interfaz no procesa).', seq: seqUpTo(2) },
  { title: 'Secuencia: datos y validación', text: 'El control pide los datos a las entidades y valida (mensaje recursivo, R1).', seq: seqUpTo(5) },
  { title: 'Secuencia: alternativa', text: '[retiro sin devolución] Mensaje error(): la alternativa va en el mismo diagrama.', seq: seqUpTo(6) },
  { title: 'Secuencia: registro y respuesta', text: '[válido] Registrar retiro en las entidades y la respuesta vuelve por la interfaz. Mismo orden que la descripción.', seq: seqUpTo(10) },
];

// ---------------- Nivel 2: reconstrucción guiada (servicio técnico) ----------------
export const GUIDED_TEXT = SERVICIO_TEXT;
const parts = SERVICIO_SEQ.participants.map((p) => p.name);
export const GUIDED: Question[] = [
  { id: 't2q1', type: 'fill', level: 2, concept: 'Entrenador: actores', prompt: 'Completá los actores de cada caso de uso del servicio técnico.', text: 'Solicitar alta: {0} (P) y Cliente (S). Solicitar reparación: Cliente (P) y {1} (S). Informar reparación (costo): {2} (P). Retirar aparato: {3} (P).', blanks: [{ options: ['Persona', 'Recepcionista', 'Servicio Técnico'], answer: 0 }, { options: ['Servicio Técnico', 'Persona', 'Empleado de mostrador'], answer: 0 }, { options: ['Servicio Técnico', 'Cliente', 'Persona'], answer: 0 }, { options: ['Cliente', 'Servicio Técnico', 'Cajero'], answer: 0 }], explain: 'Resolución de la profesora: Personas (P) y Cliente (S); Cliente (P), Soporte Técnico (S). Quien atiende el mostrador es parte del sistema.' },
  { id: 't2q2', type: 'order', level: 2, concept: 'Entrenador: descripción', prompt: 'Ordená el flujo normal de CU_2 Solicitar reparación.', items: SERVICIO_CU2.normal.filter((s) => !/^R\d/.test(s)), explain: 'Pedido → validación (R1: aparato en el abono) → registro → comprobante → aviso al ST → FCU.' },
  { id: 't2q3', type: 'fill', level: 2, concept: 'Entrenador: descripción', prompt: 'Completá la alternativa de CU_2.', text: '{0} Datos incorrectos. 2.2 Sistema {1} al cliente. 2.3 {2}', blanks: [{ options: ['2.1', '1.1', '5.1'], answer: 0 }, { options: ['informa el problema', 'registra la recepción', 'avisa al Servicio Técnico'], answer: 0 }, { options: ['FCU', 'Continúa en 3', 'R1'], answer: 0 }], explain: 'La validación del aparato está en el paso 2.' },
  { id: 't2q4', type: 'fill', level: 2, concept: 'Entrenador: secuencia', prompt: 'Elegí el estereotipo de cada objeto del diagrama de secuencia de CU_2.', text: 'Recepción: {0}. Gestor reparación: {1}. Abonos: {2}. Solicitudes: {3}. Aviso ST: {4}.', blanks: [{ options: ['interfaz', 'control', 'entidad'], answer: 0 }, { options: ['control', 'interfaz', 'entidad'], answer: 0 }, { options: ['entidad', 'control', 'interfaz'], answer: 0 }, { options: ['entidad', 'interfaz', 'control'], answer: 0 }, { options: ['interfaz', 'entidad', 'control'], answer: 0 }], explain: 'Dos interfaces (una por actor), un control y dos entidades.' },
  { id: 't2q5', type: 'fill', level: 2, concept: 'Entrenador: secuencia', prompt: 'Completá el receptor de cada mensaje.', diagram: { ...SERVICIO_SEQ, messages: SERVICIO_SEQ.messages.slice(0, 3) },
    text: '1 Cliente → {0}: Solicitar reparación(). 2 Recepción → {1}: Validar aparato(). 3 Gestor → {2}: Dame abono(). 6 Gestor → {3}: [válido] Registrar recepción(). 9 Gestor → {4}: Avisar nueva solicitud().',
    blanks: [{ options: [parts[1], parts[2], parts[3]], answer: 0 }, { options: [parts[2], parts[3], parts[0]], answer: 0 }, { options: [parts[3], parts[1], parts[6]], answer: 0 }, { options: [parts[4], parts[1], parts[6]], answer: 0 }, { options: [parts[5], parts[6], parts[3]], answer: 0 }],
    explain: 'Actor → interfaz → control → entidades; al secundario se llega por otra interfaz.' },
  { id: 't2q6', type: 'mcq', level: 2, concept: 'Entrenador: secuencia', prompt: '¿Dónde va el mensaje "[datos incorrectos] Informar problema()"?', options: ['Del control a la interfaz Recepción, después de Validar()', 'De la entidad Abonos al cliente', 'En un diagrama aparte', 'Del Servicio Técnico al control'], answer: 0, explain: 'La alternativa va en el mismo diagrama, con condición, y vuelve por la interfaz.' },
];
export const GUIDED_REF = { reqs: SERVICIO_REQS, uc: SERVICIO_UC, cu: SERVICIO_CU2, seq: SERVICIO_SEQ };

// ---------------- Nivel 3: detección de errores ----------------
const P = (id: string, name: string, kind: Stereo) => ({ id, name, kind });
export const ERRORS: Question[] = [
  { id: 't3q1', type: 'multi', level: 3, concept: 'Entrenador: errores CU', prompt: 'Diagrama de casos de uso de un supermercado entregado en un TP. ¿Qué está mal?',
    diagram: { kind: 'usecase', system: 'Supermercado', actors: [{ id: 'v', name: 'Ventas', side: 'left' }, { id: 'd', name: 'Depósito', side: 'left' }, { id: 'g', name: 'Gerencia', side: 'right' }], cases: [{ id: 'a', name: 'ABM productos' }, { id: 'b', name: 'Consultar stock' }, { id: 'c', name: 'Iniciar sesión' }, { id: 'e', name: 'Generar reporte' }], links: [{ actor: 'v', uc: 'a' }, { actor: 'd', uc: 'b' }, { actor: 'v', uc: 'c' }, { actor: 'd', uc: 'c' }, { actor: 'g', uc: 'e' }] },
    options: ['Las áreas internas figuran como actores y faltan cliente y proveedor', 'Faltan casos de uso de negocio como "Comprar mercadería" o "Entregar mercadería"', '"Iniciar sesión" es técnico y además lo inician dos actores', 'Los actores están fuera del sistema', 'El sistema tiene nombre'],
    answer: [0, 1, 2], explain: 'Es la corrección real: "deberían aparecer cliente compra mercadería, compras genera orden de compra a proveedor, proveedor entrega mercadería".', why: { 3: 'Que estén afuera es correcto.', 4: 'Debe tener nombre.' } },
  { id: 't3q2', type: 'multi', level: 3, concept: 'Entrenador: errores descripción', prompt: 'Descripción de "Reservar cancha". ¿Qué errores encontrás?',
    cu: { id: 'CU-2', name: 'Reserva', actors: 'Recepcionista', objective: 'Cargar la reserva', pre: 'El sistema está encendido', post: '—', normal: ['Abre el menú de reservas.', 'Elige la cancha.', 'Verifica.', 'Guarda.'], alternatives: ['Si está ocupada, avisa.'] },
    options: ['El actor es interno (debería ser el Jugador)', 'El nombre no es verbo en infinitivo + objeto y no coincidiría con la elipse', 'La validación no dice qué se verifica (falta R1)', 'La alternativa no está numerada desde su paso y falta FCU', 'Tiene pocos pasos'],
    answer: [0, 1, 2, 3], explain: 'Actor externo, nombre igual al diagrama, R1 explícita, alternativa 3.1… y FCU. La cantidad de pasos no es el problema.' },
  { id: 't3q3', type: 'multi', level: 3, concept: 'Entrenador: errores secuencia', prompt: 'Secuencia de "Reservar cancha". ¿Qué está mal?',
    diagram: { kind: 'sequence', numbered: true, participants: [P('r', 'Reserva', 'interface'), P('j', 'Jugador', 'actor'), P('c', 'Canchas', 'entity'), P('g', 'Gestionar reserva', 'control')], messages: [{ from: 'j', to: 'c', label: 'Dame cancha()' }, { from: 'j', to: 'r', label: 'Reservar()' }, { from: 'r', to: 'c', label: 'Registrar reserva()' }, { from: 'c', to: 'j', label: 'Confirmar()' }] },
    options: ['El actor está en el medio en lugar de un extremo', 'El actor le pide datos directo a una entidad', 'La interfaz registra en la entidad sin pasar por el control', 'Una entidad le responde al actor', 'El control nunca participa', 'Hay demasiados objetos'],
    answer: [0, 1, 2, 3, 4], explain: 'Viola todo el patrón: actor en extremo, actor ↔ interfaz, interfaz → control, control → entidades, respuesta por la interfaz.' },
  { id: 't3q4', type: 'mcq', level: 3, concept: 'Entrenador: errores secuencia', prompt: 'La descripción dice: 1 Jugador reserva · 2 Sistema verifica cancha libre y que no tenga deudas · 3 Registra · 4 Confirma. En la secuencia, "Registrar reserva()" está antes de "Dame jugador()". ¿Por qué se descuenta?',
    options: ['El orden no se corresponde con la descripción', 'Porque faltan períodos de actividad', 'Porque "Dame jugador()" debería ser de la interfaz', 'No se descuenta: el orden es libre'], answer: 0, explain: 'La cátedra evalúa la coherencia descripción–secuencia.' },
  { id: 't3q5', type: 'multi', level: 3, concept: 'Entrenador: errores secuencia', prompt: 'Este diagrama de "Solicitar reparación", ¿qué problemas tiene?',
    diagram: { kind: 'sequence', numbered: true, participants: [P('a', 'Cliente', 'actor'), P('i', 'Recepción', 'interface'), P('c', 'Gestor', 'control'), P('st', 'Servicio Técnico', 'actor'), P('s', 'Solicitudes', 'entity')], messages: [{ from: 'a', to: 'i', label: 'Solicitar reparación()' }, { from: 'i', to: 'c', label: 'Validar aparato()' }, { from: 'c', to: 'st', label: 'Avisar()' }, { from: 'c', to: 's', label: 'Registrar()' }, { from: 'c', to: 'i', label: 'Entregar comprobante()' }] },
    options: ['El actor secundario está en el medio y el control le habla directo (falta otra interfaz)', 'No se valida el aparato contra el abono (falta la entidad Abonos y Validar())', 'No hay alternativa para datos incorrectos', 'La respuesta no llega al cliente', 'No tiene control'], answer: [0, 1, 2, 3], explain: 'Otra interfaz al final para el ST, validación con datos de Abonos, alternativa con condición y respuesta hasta el actor. Sí tiene control (Gestor).' },
];

// ---------------- Nivel 4: práctica semiguiada (club de pádel) ----------------
export const PADEL_TEXT = `Club de pádel "La Red".
Las personas que quieran jugar deben registrarse como jugadores en la recepción, presentando DNI y teléfono.
El jugador reserva una cancha para un día y horario. La recepcionista verifica que la cancha esté libre y que el jugador no tenga deudas; si todo está bien, registra la reserva y le confirma el turno. Si la cancha está ocupada se le informa, y si tiene deudas no se le permite reservar.
Cuando una cancha se daña, se avisa a una empresa de mantenimiento externa, que informa cuándo la cancha quedó reparada para habilitarla nuevamente.
Cada lunes el administrador del club recibe un informe de ocupación de las canchas.`;

export interface UCBuilderSpec {
  system: string;
  actors: { name: string; ok: boolean; why: string }[];
  cases: { name: string; ok: boolean; why: string }[];
  links: [string, string][];       // [actor, caso] correctos
}
export const PADEL_UC: UCBuilderSpec = {
  system: 'Club de pádel "La Red"',
  actors: [
    { name: 'Persona', ok: true, why: 'Viene de afuera a registrarse como jugador.' },
    { name: 'Jugador', ok: true, why: 'Reserva canchas: objetivo principal del negocio.' },
    { name: 'Empresa de mantenimiento', ok: true, why: 'Organización externa que informa la reparación.' },
    { name: 'Administrador', ok: true, why: 'Recibe el informe de ocupación.' },
    { name: 'Recepcionista', ok: false, why: 'Atiende y procesa: es parte del sistema.' },
    { name: 'Cancha', ok: false, why: 'Es información del negocio (entidad), no un actor.' },
    { name: 'Base de datos', ok: false, why: 'Detalle técnico.' },
  ],
  cases: [
    { name: 'Registrar jugador', ok: true, why: 'Objetivo de la persona.' },
    { name: 'Reservar cancha', ok: true, why: 'Objetivo del jugador.' },
    { name: 'Informar reparación de cancha', ok: true, why: 'Objetivo de la empresa de mantenimiento.' },
    { name: 'Emitir informe de ocupación', ok: true, why: 'Lo recibe el administrador.' },
    { name: 'Iniciar sesión', ok: false, why: 'Técnico, no es objetivo de negocio.' },
    { name: 'Verificar deudas', ok: false, why: 'Es un paso (validación) dentro de Reservar cancha.' },
    { name: 'ABM de canchas', ok: false, why: 'Demasiado bajo nivel para este enunciado.' },
  ],
  links: [['Persona', 'Registrar jugador'], ['Jugador', 'Registrar jugador'], ['Jugador', 'Reservar cancha'], ['Empresa de mantenimiento', 'Informar reparación de cancha'], ['Administrador', 'Emitir informe de ocupación']],
};
export const PADEL_LINK_OPTIONAL: [string, string][] = [['Jugador', 'Registrar jugador']];

export interface SeqBuilderSpec {
  cu: CUDescription;
  objects: { name: string; kind: Stereo | 'none'; why: string }[];   // kind 'none' = no debería estar
  labels: { text: string; key: string; rank: number }[];             // rank: orden relativo esperado
  reference: SequenceDiagramSpec;
}
export const PADEL_CU: CUDescription = {
  id: 'CU-2', name: 'Reservar cancha', actors: 'Jugador (P)', objective: 'Reservar una cancha para un día y horario', pre: 'Jugador registrado', post: 'Reserva registrada y confirmada',
  normal: ['Jugador solicita reservar una cancha (día y horario).', 'Sistema verifica la cancha y al jugador.', 'R1 = cancha libre en ese horario.', 'R2 = jugador sin deudas.', 'Sistema registra la reserva.', 'Sistema confirma el turno al jugador.', 'FCU'],
  alternatives: ['2.1 Cancha ocupada o jugador con deudas.', '2.2 Sistema informa el motivo y no registra.', '2.3 FCU'],
};
export const PADEL_SEQ: SeqBuilderSpec = {
  cu: PADEL_CU,
  objects: [
    { name: 'Jugador', kind: 'actor', why: 'Actor primario, en el extremo izquierdo.' },
    { name: 'Reserva', kind: 'interface', why: 'Recibe el pedido del jugador.' },
    { name: 'Gestionar reserva', kind: 'control', why: 'Coordina el caso de uso.' },
    { name: 'Canchas', kind: 'entity', why: 'Información de las canchas y su ocupación.' },
    { name: 'Jugadores', kind: 'entity', why: 'Información de los jugadores y sus deudas.' },
    { name: 'Reservas', kind: 'entity', why: 'Donde se registra la reserva.' },
    { name: 'Recepcionista', kind: 'none', why: 'Es parte del sistema: no aparece como objeto ni actor.' },
  ],
  labels: [
    { text: 'Reservar cancha(día, hora)', key: 'req', rank: 1 },
    { text: 'Verificar reserva()', key: 'del', rank: 2 },
    { text: 'Dame cancha()', key: 'get1', rank: 3 },
    { text: 'Dame jugador()', key: 'get2', rank: 3 },
    { text: 'Validar()', key: 'val', rank: 4 },
    { text: 'Informar motivo()', key: 'err', rank: 5 },
    { text: 'Registrar reserva()', key: 'reg', rank: 6 },
    { text: 'Confirmar turno()', key: 'ok', rank: 7 },
  ],
  reference: {
    kind: 'sequence',
    participants: [P('a', 'Jugador', 'actor'), P('i', 'Reserva', 'interface'), P('c', 'Gestionar reserva', 'control'), P('ca', 'Canchas', 'entity'), P('ju', 'Jugadores', 'entity'), P('re', 'Reservas', 'entity')],
    messages: [
      { from: 'a', to: 'i', label: 'Reservar cancha(día, hora)' }, { from: 'i', to: 'c', label: 'Verificar reserva()' },
      { from: 'c', to: 'ca', label: 'Dame cancha()' }, { from: 'c', to: 'ju', label: 'Dame jugador()' }, { from: 'c', to: 'c', label: 'Validar()' },
      { from: 'c', to: 'i', label: 'Informar motivo()', cond: 'ocupada o con deudas' }, { from: 'i', to: 'a', label: 'Informar motivo()', cond: 'ocupada o con deudas' },
      { from: 'c', to: 're', label: 'Registrar reserva()', cond: 'válido' }, { from: 'c', to: 'i', label: 'Confirmar turno()' }, { from: 'i', to: 'a', label: 'Confirmar turno()' },
    ],
  },
};

// ---------------- Nivel 5 y simulacro práctico: problemas completos ----------------
export interface RubricItem { text: string; critical?: boolean }
export interface PaperProblem {
  id: string; title: string; text: string; askCU: string; minutes: number;
  ref: { reqs: string[]; uc: UseCaseDiagramSpec; cu: CUDescription; seq: SequenceDiagramSpec };
  rubric: { tool: string; items: RubricItem[] }[];
}

const RUBRIC_BASE = (cu: string): PaperProblem['rubric'] => [
  { tool: 'Lista de requerimientos', items: [
    { text: 'Un ítem por cada proceso de negocio del enunciado (sin omitir ninguno)', critical: true },
    { text: 'Redacción "El sistema debe gestionar/proveer…"' },
    { text: 'No incluye detalles técnicos ni de pantalla' },
    { text: 'Se corresponde con los casos de uso del diagrama' },
  ] },
  { tool: 'Diagrama de casos de uso', items: [
    { text: 'Los actores son entidades externas; ningún empleado que atiende figura como actor', critical: true },
    { text: 'Actores con su rol y fuera de la frontera; sistema con nombre' },
    { text: 'Casos de uso de negocio con verbo en infinitivo + objeto (sin login/ABM)', critical: true },
    { text: 'Cada caso de uso tiene un único iniciador' },
    { text: 'Asociaciones correctas: cada actor conectado con los casos en que participa', critical: true },
  ] },
  { tool: `Descripción de "${cu}"`, items: [
    { text: 'Id y nombre iguales a la elipse; actores con (P)/(S); objetivo' },
    { text: 'Precondición y postcondición coherentes' },
    { text: 'Curso normal numerado que alterna actor y sistema y termina en FCU', critical: true },
    { text: 'Regla(s) de validación R1 explícitas' },
    { text: 'Alternativa numerada desde el paso donde ocurre (x.1, x.2…)', critical: true },
  ] },
  { tool: `Diagrama de secuencia de "${cu}"`, items: [
    { text: 'Tiene objetos de interfaz, control y entidad', critical: true },
    { text: 'El actor solo se comunica con la interfaz y está en un extremo', critical: true },
    { text: 'El control coordina y pide/guarda datos en las entidades', critical: true },
    { text: 'La alternativa aparece con [condición] en el mismo diagrama' },
    { text: 'Mismo orden que la descripción y todas las flechas con nombre', critical: true },
    { text: 'Si hay actor secundario, otra interfaz al final' },
  ] },
];

export const VIANDAS: PaperProblem = {
  id: 'viandas', title: 'Viandas "Buen Plato"', askCU: 'Realizar pedido', minutes: 60,
  text: `Una empresa elabora viandas saludables y las entrega a domicilio a empresas y particulares.
Para comprar, el interesado debe registrarse como cliente indicando sus datos y dirección de entrega.
El cliente realiza su pedido por teléfono, indicando las viandas y la fecha de entrega. La operadora verifica que el cliente no tenga pagos pendientes y que haya cupo de producción para esa fecha; si todo está bien, registra el pedido y le informa el número de pedido y el importe. Si tiene pagos pendientes, no se toma el pedido hasta que regularice.
Los pedidos del día se envían a la empresa de logística, que informa cuando cada pedido fue entregado.
A fin de mes, a cada cliente empresa se le envía una factura con el detalle de los pedidos entregados.`,
  ref: {
    reqs: ['a) El sistema debe gestionar el registro de clientes.', 'b) El sistema debe gestionar los pedidos de viandas.', 'c) El sistema debe gestionar el envío de pedidos a logística y su entrega.', 'd) El sistema debe proveer la facturación mensual a clientes empresa.'],
    uc: { kind: 'usecase', system: 'Viandas "Buen Plato"', actors: [{ id: 'in', name: 'Interesado', side: 'left', y: 70 }, { id: 'cl', name: 'Cliente', side: 'left', y: 230 }, { id: 'lo', name: 'Empresa de logística', side: 'right', y: 120 }, { id: 'ce', name: 'Cliente empresa', side: 'right', y: 260 }], cases: [{ id: 'u1', name: 'CU1: Registrar cliente' }, { id: 'u2', name: 'CU2: Realizar pedido' }, { id: 'u3', name: 'CU3: Informar entrega' }, { id: 'u4', name: 'CU4: Emitir factura mensual' }], links: [{ actor: 'in', uc: 'u1' }, { actor: 'cl', uc: 'u1' }, { actor: 'cl', uc: 'u2' }, { actor: 'lo', uc: 'u3' }, { actor: 'ce', uc: 'u4' }] },
    cu: { id: 'CU2', name: 'Realizar pedido', actors: 'Cliente (P)', objective: 'Pedir viandas para una fecha de entrega', pre: 'Cliente registrado', post: 'Pedido registrado; número e importe informados', normal: ['Cliente solicita un pedido (viandas y fecha).', 'Sistema verifica al cliente y el cupo.', 'R1 = cliente sin pagos pendientes.', 'R2 = cupo de producción disponible para la fecha.', 'Sistema registra el pedido.', 'Sistema informa número de pedido e importe al cliente.', 'FCU'], alternatives: ['2.1 Cliente con pagos pendientes (o sin cupo).', '2.2 Sistema informa el motivo y no registra el pedido.', '2.3 FCU'] },
    seq: { kind: 'sequence', participants: [P('a', 'Cliente', 'actor'), P('i', 'Pedido', 'interface'), P('c', 'Tomar pedido', 'control'), P('cl', 'Clientes', 'entity'), P('cu', 'Cupos', 'entity'), P('pe', 'Pedidos', 'entity')], messages: [
      { from: 'a', to: 'i', label: 'Realizar pedido(viandas, fecha)' }, { from: 'i', to: 'c', label: 'Verificar pedido()' }, { from: 'c', to: 'cl', label: 'Dame cliente()' }, { from: 'c', to: 'cu', label: 'Dame cupo(fecha)' }, { from: 'c', to: 'c', label: 'Validar()' },
      { from: 'c', to: 'i', label: 'Informar motivo()', cond: 'pagos pendientes o sin cupo' }, { from: 'c', to: 'pe', label: 'Registrar pedido()', cond: 'válido' }, { from: 'c', to: 'i', label: 'Informar nro. e importe()' }, { from: 'i', to: 'a', label: 'Informar nro. e importe()' }] },
  },
  rubric: RUBRIC_BASE('Realizar pedido'),
};

export const LAVADERO: PaperProblem = {
  id: 'lavadero', title: 'Lavadero de autos "Brillo"', askCU: 'Retirar vehículo', minutes: 60,
  text: `Un lavadero ofrece planes mensuales de lavado. Para adherirse, el interesado se registra como abonado indicando sus datos, la patente del vehículo y el plan elegido.
Cuando el abonado deja el auto, el encargado controla que la patente corresponda a un abonado con el plan al día y que le queden lavados disponibles en el mes; si es así, registra el ingreso y le entrega un ticket. Si no le quedan lavados, se le ofrece pagar un lavado individual.
Cuando el abonado retira el vehículo presenta el ticket; se verifica que el lavado esté terminado. Si está terminado, se registra el retiro con fecha y hora y se descuenta un lavado del plan; si no, se le informa el tiempo estimado de espera.
Los productos de limpieza los provee un distribuidor, al que se le envía un pedido cuando el stock baja del mínimo, y que informa la fecha de entrega.
Cada viernes el dueño recibe un resumen de lavados realizados.`,
  ref: {
    reqs: ['a) El sistema debe gestionar el registro de abonados.', 'b) El sistema debe gestionar el ingreso de vehículos.', 'c) El sistema debe gestionar el retiro de vehículos.', 'd) El sistema debe gestionar los pedidos de productos al distribuidor.', 'e) El sistema debe proveer un resumen semanal de lavados.'],
    uc: { kind: 'usecase', system: 'Lavadero "Brillo"', actors: [{ id: 'in', name: 'Interesado', side: 'left', y: 60 }, { id: 'ab', name: 'Abonado', side: 'left', y: 210 }, { id: 'di', name: 'Distribuidor', side: 'right', y: 120 }, { id: 'du', name: 'Dueño', side: 'right', y: 290 }], cases: [{ id: 'u1', name: 'CU1: Registrar abonado' }, { id: 'u2', name: 'CU2: Ingresar vehículo' }, { id: 'u3', name: 'CU3: Retirar vehículo' }, { id: 'u4', name: 'CU4: Pedir productos' }, { id: 'u5', name: 'CU5: Emitir resumen semanal' }], links: [{ actor: 'in', uc: 'u1' }, { actor: 'ab', uc: 'u1' }, { actor: 'ab', uc: 'u2' }, { actor: 'ab', uc: 'u3' }, { actor: 'di', uc: 'u4' }, { actor: 'du', uc: 'u5' }] },
    cu: { id: 'CU3', name: 'Retirar vehículo', actors: 'Abonado (P)', objective: 'Retirar el vehículo lavado', pre: 'Ingreso del vehículo registrado (ticket)', post: 'Retiro registrado y lavado descontado del plan', normal: ['Abonado solicita retirar el vehículo y presenta el ticket.', 'Sistema verifica el estado del lavado.', 'R1 = lavado terminado.', 'Sistema registra el retiro con fecha y hora.', 'Sistema descuenta un lavado del plan.', 'Sistema informa el retiro registrado al abonado.', 'FCU'], alternatives: ['2.1 El lavado no está terminado.', '2.2 Sistema informa el tiempo estimado de espera.', '2.3 FCU'] },
    seq: { kind: 'sequence', participants: [P('a', 'Abonado', 'actor'), P('i', 'Retiro', 'interface'), P('c', 'Retirar vehículo', 'control'), P('in', 'Ingresos', 'entity'), P('pl', 'Planes', 'entity')], messages: [
      { from: 'a', to: 'i', label: 'Retirar vehículo(ticket)' }, { from: 'i', to: 'c', label: 'Verificar lavado()' }, { from: 'c', to: 'in', label: 'Dame ingreso(ticket)' }, { from: 'c', to: 'c', label: 'Validar()' },
      { from: 'c', to: 'i', label: 'Informar espera()', cond: 'no terminado' }, { from: 'c', to: 'in', label: 'Registrar retiro()', cond: 'terminado' }, { from: 'c', to: 'pl', label: 'Descontar lavado()' }, { from: 'c', to: 'i', label: 'Informar retiro()' }, { from: 'i', to: 'a', label: 'Informar retiro()' }] },
  },
  rubric: RUBRIC_BASE('Retirar vehículo'),
};

export const KAMERAL_PROBLEM: PaperProblem = {
  id: 'kameral', title: 'Biblioteca "Kameral" (consigna 13/10 y 20/10)', askCU: 'Solicitar libro', minutes: 40,
  text: 'Biblioteca Kameral: ' + KAMERAL_TEXT,
  ref: { reqs: OBSERVATION[1].reqs!, uc: KAMERAL_UC, cu: KAMERAL_CU2, seq: KAMERAL_SEQ },
  rubric: RUBRIC_BASE('Solicitar libro'),
};
export { SERVICIO_UC };
