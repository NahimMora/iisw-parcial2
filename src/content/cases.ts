// Casos de referencia de la cátedra (reconstruidos y parafraseados) usados en varios capítulos.
import type { CUDescription, SequenceDiagramSpec, UseCaseDiagramSpec } from './types';

export const KAMERAL_TEXT =
  'una biblioteca histórica asocia personas que pagan una cuota anual en la sede, atendidas por un bibliotecario. El socio retira un solo libro por vez, pidiéndolo al bibliotecario, con un plazo de 10 días; si la cuota está impaga se le puede cobrar en ese momento. Periódicamente el coordinador revisa préstamos vencidos y le manda un mail al socio. Al recibir una devolución, el bibliotecario verifica si estaba vencida y, en ese caso, inhabilita al socio por un mes.';

export const KAMERAL_UC: UseCaseDiagramSpec = {
  kind: 'usecase', system: 'Biblioteca "Kameral"',
  actors: [
    { id: 'pna', name: 'Persona no asociada', side: 'left', y: 75 },
    { id: 'coo', name: 'Coordinador de biblioteca', side: 'left', y: 290 },
    { id: 'soc', name: 'Socio', side: 'right' },
  ],
  cases: [
    { id: 'cu1', name: 'CU1: Alta de socio' }, { id: 'cu2', name: 'CU2: Solicitar libro' },
    { id: 'cu3', name: 'CU3: Devolver libro' }, { id: 'cu4', name: 'CU4: Informe de préstamos' },
  ],
  links: [
    { actor: 'pna', uc: 'cu1' }, { actor: 'soc', uc: 'cu1' }, { actor: 'soc', uc: 'cu2' },
    { actor: 'soc', uc: 'cu3' }, { actor: 'soc', uc: 'cu4' }, { actor: 'coo', uc: 'cu4' },
  ],
};

/** Descripción del CU-02 tal como la presentó Taboada (formato de la cátedra). */
export const KAMERAL_CU2: CUDescription = {
  id: 'CU-02', name: 'Solicitar libro', actors: 'Socio (P)',
  objective: 'Retirar un libro por parte de un socio',
  pre: 'Tiene el libro a retirar', post: 'Libro registrado (retiro registrado)',
  normal: [
    'Socio solicita el retiro de un libro.',
    'Bibliotecario valida al socio.',
    'R1 = no tenga un retiro registrado sin devolución.',
    'Bibliotecario registra el retiro del libro.',
    'Bibliotecario entrega el libro (la información del retiro) al socio.',
    'FCU',
  ],
  alternatives: ['2.1 Socio tiene un retiro registrado sin devolución.', '2.2 Se rechaza el pedido de retiro.', '2.3 FCU'],
};

/** Diagrama de secuencia del CU-02 (reconstruido de la clase; actor corregido a "Socio" como indicó Blanco). */
export const KAMERAL_SEQ: SequenceDiagramSpec = {
  kind: 'sequence',
  participants: [
    { id: 'a', name: 'Socio', kind: 'actor' },
    { id: 'i', name: 'Préstamo', kind: 'interface' },
    { id: 'c', name: 'Retirar', kind: 'control' },
    { id: 's', name: 'Socios', kind: 'entity' },
    { id: 'l', name: 'Libros', kind: 'entity' },
  ],
  messages: [
    { from: 'a', to: 'i', label: 'Solicitar libro()' },
    { from: 'i', to: 'c', label: 'Validar socio()' },
    { from: 'c', to: 's', label: 'Dame socio()' },
    { from: 'c', to: 'l', label: 'Dame libro()' },
    { from: 'c', to: 'c', label: 'Validar()' },
    { from: 'c', to: 'i', label: 'Mensaje error()', cond: 'retiro sin devolución' },
    { from: 'c', to: 's', label: 'Registrar retiro()', cond: 'válido' },
    { from: 'c', to: 'l', label: 'Registrar retiro()', cond: 'válido' },
    { from: 'c', to: 'i', label: 'Entregar libro()' },
    { from: 'i', to: 'a', label: 'Entregar libro()' },
  ],
};

export const SERVICIO_TEXT =
  'Una empresa repara aparatos telefónicos solo a personas abonadas. Para abonarse, la persona presenta sus datos, los de sus aparatos y elige un abono. Para pedir una reparación, el cliente indica su código y el aparato descompuesto; se controla que el aparato corresponda al abono y, si está todo bien, se le da una constancia de recepción y se avisa al Servicio Técnico. Cuando el Servicio Técnico repara, informa el costo. Cuando el cliente viene a retirar, se verifica si el aparato volvió del Servicio Técnico; si volvió, se registra quién lo retira y la fecha y se le informa el valor; si no, se le avisa que aún no está reparado. A fin de mes se envía a cada cliente un listado de trabajos y montos a pagar.';

export const SERVICIO_REQS = [
  'a) El sistema debe gestionar el registro de clientes (alta de abonados).',
  'b) El sistema debe gestionar las solicitudes de reparación.',
  'c) El sistema debe gestionar la reparación de los aparatos (informe de costo).',
  'd) El sistema debe gestionar la devolución de los aparatos.',
  'e) El sistema debe proveer un listado mensual de servicios realizados.',
];

export const SERVICIO_UC: UseCaseDiagramSpec = {
  kind: 'usecase', system: 'Servicio Técnico de telefonía',
  actors: [
    { id: 'per', name: 'Persona', side: 'left', y: 70 },
    { id: 'cli', name: 'Cliente', side: 'left', y: 250 },
    { id: 'st', name: 'Servicio Técnico', side: 'right', y: 170 },
  ],
  cases: [
    { id: 'u1', name: 'CU1: Solicitar alta' }, { id: 'u2', name: 'CU2: Solicitar reparación' },
    { id: 'u3', name: 'CU3: Informar reparación' }, { id: 'u4', name: 'CU4: Retirar aparato' },
    { id: 'u5', name: 'CU5: Emitir listado mensual' },
  ],
  links: [
    { actor: 'per', uc: 'u1' }, { actor: 'cli', uc: 'u1' }, { actor: 'cli', uc: 'u2' }, { actor: 'st', uc: 'u2' },
    { actor: 'st', uc: 'u3' }, { actor: 'cli', uc: 'u4' }, { actor: 'cli', uc: 'u5' },
  ],
};

export const SERVICIO_CU2: CUDescription = {
  id: 'CU_2', name: 'Solicitar reparación', actors: 'Cliente (P), Servicio Técnico (S)',
  objective: 'Lograr reparar un aparato del cliente', pre: 'Cliente abonado', post: 'Se entrega comprobante de recepción',
  normal: [
    'Cliente solicita reparación de aparato.',
    'Sistema valida aparato.',
    'R1: debe existir registro del aparato en el abono del cliente.',
    'Sistema registra la recepción.',
    'Sistema entrega comprobante de recepción al cliente.',
    'Sistema envía (avisa) el aparato al Servicio Técnico.',
    'FCU',
  ],
  alternatives: ['2.1 Datos incorrectos.', '2.2 Sistema informa el problema al cliente.', '2.3 FCU'],
};

export const SERVICIO_SEQ: SequenceDiagramSpec = {
  kind: 'sequence',
  participants: [
    { id: 'a', name: 'Cliente', kind: 'actor' },
    { id: 'i', name: 'Recepción', kind: 'interface' },
    { id: 'c', name: 'Gestor reparación', kind: 'control' },
    { id: 'ab', name: 'Abonos', kind: 'entity' },
    { id: 'so', name: 'Solicitudes', kind: 'entity' },
    { id: 'i2', name: 'Aviso ST', kind: 'interface' },
    { id: 'st', name: 'Servicio Técnico', kind: 'actor' },
  ],
  messages: [
    { from: 'a', to: 'i', label: 'Solicitar reparación(código, aparato)' },
    { from: 'i', to: 'c', label: 'Validar aparato()' },
    { from: 'c', to: 'ab', label: 'Dame abono(código)' },
    { from: 'c', to: 'c', label: 'Validar()' },
    { from: 'c', to: 'i', label: 'Informar problema()', cond: 'datos incorrectos' },
    { from: 'c', to: 'so', label: 'Registrar recepción()', cond: 'válido' },
    { from: 'c', to: 'i', label: 'Entregar comprobante()' },
    { from: 'i', to: 'a', label: 'Entregar comprobante()' },
    { from: 'c', to: 'i2', label: 'Avisar nueva solicitud()' },
    { from: 'i2', to: 'st', label: 'Avisar nueva solicitud()' },
  ],
};
