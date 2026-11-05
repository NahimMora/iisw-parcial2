// Modo urgente: lo mínimo para aprobar el 2º parcial, armado a partir de la estructura
// de parciales anteriores (2022, 2023 y 2025). Contenido original y parafraseado.
import type { CUDescription, Question, SequenceDiagramSpec, UseCaseDiagramSpec } from './types';

export const URG_EXAM_FORMAT = [
  { t: 'Parte teórica', d: 'Afirmaciones Verdadero/Falso **con justificación corta** (≤ 5–6 líneas) y preguntas de "explique". Sin justificar = no cuenta. Se aprueba con **60 %**.' },
  { t: 'Parte práctica', d: 'Una narrativa de negocio (en 2023 y 2025 fue **la misma: alquiler de autos en Ezeiza**). Se aprueba con **60 % de cada ítem**: si un ítem falla, recuperás ese ítem.' },
  { t: 'Ítems que piden', d: '1) Lista de requerimientos · 2) Procesos de negocio (y graficar uno) · 3) Diagrama de casos de uso **+ descripción de un CU** · 4) Diagrama de secuencia **del mismo CU**.' },
];

export const URG_CASE_TEXT =
  'Una empresa ubicada en la zona del aeropuerto de Ezeiza alquila vehículos y necesita que el sistema le permita controlar la disponibilidad de autos y el cobro de los alquileres. El encargado que atiende en el local, al recibir el pedido de un cliente, verifica la disponibilidad del vehículo; si hay, registra los datos del cliente (si no estaba registrado de un alquiler anterior) y genera el contrato con los datos del cliente y del vehículo. Cuando el vehículo es devuelto se registra la devolución y se emite la factura por los días de alquiler; si se devolvió tarde, se cobra una multa adicional que debe verse resaltada en la factura. El gerente registra el ingreso de nuevos vehículos disponibles e indica los vehículos que no están disponibles por controles mecánicos.';

// ---------- Paso 1: requerimientos ----------
export const URG_REQS = [
  'a) El sistema debe gestionar la disponibilidad de los vehículos.',
  'b) El sistema debe gestionar el registro de clientes.',
  'c) El sistema debe gestionar los alquileres (registro del pedido y generación del contrato).',
  'd) El sistema debe gestionar la devolución de los vehículos.',
  'e) El sistema debe gestionar la facturación y el cobro de los alquileres, incluida la multa por devolución tardía.',
  'f) El sistema debe gestionar el ingreso de nuevos vehículos a la flota.',
  'g) El sistema debe gestionar la baja temporal de vehículos por controles mecánicos.',
];
export const URG_NFR = [
  'La multa por demora debe imprimirse en negrita y subrayada en la factura (restricción de presentación).',
  'El sistema será operado en el local del aeropuerto (restricción de ambiente).',
];

// ---------- Paso 2: procesos de negocio ----------
export const URG_PROCESSES = [
  { t: 'Alquiler de vehículo', d: 'pedido del cliente → verificar disponibilidad → registrar cliente si es nuevo → registrar alquiler → generar contrato' },
  { t: 'Devolución y facturación', d: 'recibir vehículo → registrar devolución → calcular días (y multa si hay demora) → emitir factura → cobrar' },
  { t: 'Gestión de la flota', d: 'el gerente da de alta vehículos nuevos y marca como no disponibles los que están en control mecánico' },
];
/** Diagrama de actividad del proceso de alquiler (carriles = responsables). */
export const URG_ACTIVITY = {
  lanes: ['Cliente', 'Empresa (encargado + sistema)'],
  steps: [
    { lane: 0, kind: 'start', t: '' },
    { lane: 0, kind: 'act', t: 'Pide un vehículo' },
    { lane: 1, kind: 'act', t: 'Verifica disponibilidad' },
    { lane: 1, kind: 'dec', t: '¿Hay vehículo?', no: 'Informa que no hay → fin' },
    { lane: 1, kind: 'dec', t: '¿Cliente registrado?', no: 'Registra los datos del cliente' },
    { lane: 1, kind: 'act', t: 'Registra alquiler y genera contrato' },
    { lane: 0, kind: 'act', t: 'Recibe contrato y vehículo' },
    { lane: 0, kind: 'end', t: '' },
  ],
} as const;

// ---------- Paso 3: diagrama de casos de uso + descripción ----------
export const URG_UC: UseCaseDiagramSpec = {
  kind: 'usecase', system: 'Alquiler de vehículos (Ezeiza)',
  actors: [
    { id: 'cli', name: 'Cliente', side: 'left', y: 150 },
    { id: 'ger', name: 'Gerente', side: 'right', y: 230 },
  ],
  cases: [
    { id: 'cu1', name: 'CU1: Registrar pedido de alquiler' },
    { id: 'cu2', name: 'CU2: Registrar devolución' },
    { id: 'cu3', name: 'CU3: Registrar nuevo vehículo' },
    { id: 'cu4', name: 'CU4: Indicar vehículo no disponible' },
  ],
  links: [
    { actor: 'cli', uc: 'cu1' }, { actor: 'cli', uc: 'cu2' },
    { actor: 'ger', uc: 'cu3' }, { actor: 'ger', uc: 'cu4' },
  ],
};

export const URG_CU1: CUDescription = {
  id: 'CU-01', name: 'Registrar pedido de alquiler', actors: 'Cliente (P)',
  objective: 'Alquilar un vehículo disponible y entregar el contrato al cliente.',
  pre: 'El cliente se presenta en el local con sus datos.',
  post: 'Alquiler registrado, vehículo marcado como no disponible y contrato generado.',
  normal: [
    'Cliente solicita alquilar un vehículo (tipo y fechas).',
    'Se verifica la disponibilidad de vehículos.',
    'R1 = exista un vehículo disponible para esas fechas.',
    'Se identifica al cliente.',
    'R2 = el cliente esté registrado.',
    'Se registra el alquiler y el vehículo queda no disponible.',
    'Se genera el contrato con los datos del cliente y del vehículo.',
    'Se entrega el contrato al cliente.',
    'FCU',
  ],
  alternatives: [
    '2.1 No hay vehículo disponible.', '2.2 Se informa al cliente y se rechaza el pedido.', '2.3 FCU',
    '3.1 El cliente no está registrado.', '3.2 Se registran los datos del cliente.', '3.3 Continúa en el paso 4.',
  ],
};

// ---------- Paso 4: diagrama de secuencia del mismo CU ----------
export const URG_SEQ: SequenceDiagramSpec = {
  kind: 'sequence', numbered: true,
  participants: [
    { id: 'a', name: 'Cliente', kind: 'actor' },
    { id: 'i', name: 'Pantalla Alquiler', kind: 'interface' },
    { id: 'c', name: 'Control Alquiler', kind: 'control' },
    { id: 'v', name: 'Vehículos', kind: 'entity' },
    { id: 'k', name: 'Clientes', kind: 'entity' },
    { id: 'l', name: 'Alquileres', kind: 'entity' },
  ],
  messages: [
    { from: 'a', to: 'i', label: 'Solicitar alquiler(tipo, fechas)' },
    { from: 'i', to: 'c', label: 'Verificar disponibilidad()' },
    { from: 'c', to: 'v', label: 'Dame vehículos disponibles()' },
    { from: 'c', to: 'i', label: 'Informar sin disponibilidad()', cond: 'no hay vehículo' },
    { from: 'c', to: 'k', label: 'Buscar cliente(dni)' },
    { from: 'c', to: 'k', label: 'Registrar cliente(datos)', cond: 'no registrado' },
    { from: 'c', to: 'l', label: 'Registrar alquiler()' },
    { from: 'c', to: 'v', label: 'Marcar no disponible()' },
    { from: 'c', to: 'c', label: 'Generar contrato()' },
    { from: 'c', to: 'i', label: 'Mostrar contrato()' },
    { from: 'i', to: 'a', label: 'Entregar contrato()' },
  ],
};

export const URG_CHECKLIST = [
  'Los actores son **externos** al negocio (Cliente, Gerente). El encargado que atiende es **parte del sistema**: no lo dibujes como actor.',
  'Nombres de CU con **verbo en infinitivo + objeto** ("Registrar devolución"), con número CU1, CU2…',
  'Actores **fuera** del rectángulo del sistema; casos de uso **dentro**; líneas actor–CU sin flechas raras.',
  'La descripción lleva **Id, Nombre, Actores (P)/(S), Objetivo, Precondición, Postcondición, Flujo normal numerado con reglas R1… y FCU, y alternativas 2.1, 2.2…**',
  'El diagrama de secuencia es **del mismo CU que describiste** y sigue **el mismo orden** que los pasos de la descripción.',
  'En la secuencia van **los 3 estereotipos**: interfaz (círculo con T acostada), control (círculo con flecha) y entidad (círculo con raya abajo).',
  'El actor solo habla con la **interfaz**; la interfaz con el **control**; el control con las **entidades**. Las condiciones van entre corchetes [no hay vehículo].',
  '**include/extend no son obligatorios** en el práctico. Si no estás seguro, no los pongas.',
];

// ---------- Preguntas ----------
const tf = (id: string, concept: string, prompt: string, answer: boolean, explain: string): Question =>
  ({ id, concept, level: 2, type: 'tf', prompt, answer, explain });
const mcq = (id: string, concept: string, prompt: string, options: string[], answer: number, explain: string, extra: Partial<Question> = {}): Question =>
  ({ id, concept, level: 2, type: 'mcq', prompt, options, answer, explain, ...extra } as Question);

/** Práctica en formato choice sobre el caso de alquiler. */
export const URG_PRACTICE: Question[] = [
  mcq('u-p01', 'actores', 'En el caso del alquiler de autos, ¿quién es el **actor primario** del CU "Registrar pedido de alquiler"?',
    ['El Cliente', 'El Encargado del local', 'El Sistema', 'La Factura'], 0,
    'Se modela **el negocio**: el cliente es la entidad externa que inicia el pedido. El encargado lo atiende y procesa, así que es parte del sistema (igual que el bibliotecario en Kameral). Sistema y Factura nunca son actores.'),
  mcq('u-p02', 'actores', '¿Por qué el **Gerente** sí aparece como actor?',
    ['Porque inicia procesos propios (alta de vehículos, baja por control mecánico) que no son atender a un cliente', 'Porque es el jefe y siempre es actor', 'Porque usa la computadora', 'No debería aparecer'], 0,
    'Un actor es quien **inicia o recibe** un proceso del negocio. El gerente dispara "Registrar nuevo vehículo" e "Indicar vehículo no disponible", igual que el coordinador en Kameral pide su informe. Que use la computadora no alcanza para ser actor.'),
  mcq('u-p03', 'req', '¿Cuál está bien escrito como **requerimiento funcional** según el formato de la cátedra?',
    ['El sistema debe gestionar la devolución de los vehículos.', 'Botón "Devolver" en la pantalla principal.', 'El encargado abre el sistema y busca el auto.', 'Devoluciones.'], 0,
    'La lista de la cátedra es corta, con letras a), b), c)… y cada ítem empieza con "**El sistema debe gestionar…**" más un objeto del negocio. Un botón es diseño de pantalla y "el encargado abre…" es un paso, no un requerimiento.'),
  mcq('u-p04', 'req', '"La multa debe imprimirse en negrita y subrayada en la factura" es un requerimiento…',
    ['No funcional (restricción sobre cómo se presenta)', 'Funcional', 'Un caso de uso', 'Un actor'], 0,
    'No dice **qué** hace el sistema, sino **cómo** debe presentarse una salida: es una restricción, o sea un requerimiento **no funcional**. El funcional es "gestionar la facturación con multa por demora".'),
  mcq('u-p05', 'procesos', '¿Cuál de estos es un **proceso de negocio** del caso?',
    ['Devolución y facturación del vehículo', 'Imprimir', 'Base de datos de autos', 'Pantalla de login'], 0,
    'Un proceso de negocio es un conjunto de actividades que produce un resultado de valor (vehículo devuelto y cobrado). Imprimir es una acción suelta; la base de datos y el login son tecnología.'),
  mcq('u-p06', 'actividad', 'Para **graficar** un proceso de negocio, ¿qué diagrama corresponde?',
    ['Diagrama de actividad (con carriles por responsable)', 'Diagrama de secuencia', 'Diagrama de colaboración', 'Diagrama de casos de uso'], 0,
    'El proceso de negocio se modela con un **diagrama de actividad**: inicio (círculo negro), actividades (cajas redondeadas), decisiones (rombo con guardas [sí]/[no]), fin (círculo con punto) y **carriles** que muestran quién hace cada cosa.'),
  mcq('u-p07', 'actividad', 'En un diagrama de actividad, el **rombo** representa…',
    ['Una decisión con salidas con condición de guarda', 'Una actividad', 'El estado final', 'Una barra de sincronización'], 0,
    'El rombo es la **decisión**: varias salidas, cada una con su guarda entre corchetes y mutuamente excluyentes. La barra de sincronización (línea gruesa) divide o une hilos **paralelos**.'),
  mcq('u-p08', 'desc', 'En la descripción del CU-01, ¿dónde va "**R1 = exista un vehículo disponible**"?',
    ['Debajo del paso que verifica la disponibilidad, como regla de ese paso', 'En la precondición', 'En la postcondición', 'En el objetivo'], 0,
    'Formato de la cátedra: las reglas de negocio **R1, R2…** van en el flujo normal, debajo del paso que las controla. Si la regla no se cumple, se abre la alternativa de **ese** paso (2.1, 2.2…).'),
  mcq('u-p09', 'desc', 'Si el paso 2 es "Se verifica la disponibilidad", la alternativa "no hay vehículo" se numera…',
    ['2.1, 2.2, 2.3 FCU', 'A1, A2', '7, 8, 9', 'No se numera'], 0,
    'Las alternativas se numeran con el **número del paso donde nacen**, más un punto y un correlativo: 2.1, 2.2… y terminan en **FCU** (fin del caso de uso) o en "continúa en el paso X".'),
  mcq('u-p10', 'desc', '¿Cuál es una **postcondición** correcta para "Registrar pedido de alquiler"?',
    ['Alquiler registrado, vehículo no disponible y contrato generado', 'El cliente quiere un auto', 'El encargado está en el local', 'Verificar disponibilidad'], 0,
    'La postcondición es el **estado en que queda el sistema** si el flujo normal termina bien. "El cliente quiere un auto" sería el disparador, no un estado; "verificar disponibilidad" es un paso.'),
  mcq('u-p11', 'desc', '¿Qué significa "Cliente **(P)**" en el campo Actores?',
    ['Que es el actor primario: inicia el caso de uso', 'Que es un actor pasivo', 'Que es el proveedor', 'Que es opcional'], 0,
    '(P) = **primario**, el que inicia el CU para obtener algo. (S) = **secundario**, participa o recibe algo, pero no lo inicia. Un mismo actor puede ser primario en un CU y secundario en otro.'),
  mcq('u-p12', 'seq', 'En el diagrama de secuencia, el **Cliente** le envía el primer mensaje a…',
    ['La interfaz (Pantalla Alquiler)', 'El control', 'La entidad Vehículos', 'La entidad Clientes'], 0,
    'El actor solo interactúa con el **objeto interfaz**. La interfaz delega en el **control**, y el control trabaja con las **entidades**. Si el actor le habla directo a una entidad, el ejercicio está mal.'),
  mcq('u-p13', 'seq', '¿Qué objeto debe ser "Alquileres", "Vehículos" o "Clientes"?',
    ['Entidad: información que el sistema guarda en el tiempo', 'Interfaz', 'Control', 'Actor'], 0,
    'Las **entidades** modelan información persistente que sobrevive al caso de uso. Son fáciles de identificar porque suelen ser sustantivos del negocio.'),
  mcq('u-p14', 'seq', '"Generar contrato()" como mensaje del control **a sí mismo** es…',
    ['Correcto: un mensaje reflexivo (el control resuelve algo internamente)', 'Un error: los mensajes siempre van a otro objeto', 'Algo que va en la interfaz', 'Un caso de uso'], 0,
    'El control coordina la lógica que no le corresponde naturalmente a ninguna interfaz ni entidad. Los mensajes **recursivos o reflexivos** (flecha que vuelve al mismo objeto) son válidos.'),
  mcq('u-p15', 'seq', '¿Cómo se indica que "Registrar cliente(datos)" solo ocurre si el cliente es nuevo?',
    ['Con una condición entre corchetes: [no registrado] Registrar cliente(datos)', 'Con un include', 'Con otro diagrama de casos de uso', 'No se puede indicar'], 0,
    'En la secuencia las condiciones van como **guardas entre corchetes** sobre el mensaje. Así el diagrama cubre la alternativa 3.1 de la descripción sin dibujar otro diagrama.'),
  mcq('u-p16', 'seq', 'La secuencia **no** coincide con el orden de la descripción del CU. ¿Qué pasa?',
    ['Está mal: debe seguir el mismo orden que la descripción', 'No importa, son independientes', 'Está bien si tiene más mensajes', 'Sólo importa si hay barras de activación'], 0,
    'Criterio de la cátedra: el diagrama de secuencia **refleja el escenario descripto**, paso por paso y en el mismo orden. Las barras de activación son opcionales.'),
  mcq('u-p17', 'uc', '¿Qué está **mal** en un diagrama de casos de uso?',
    ['Dibujar al actor "Encargado" dentro del rectángulo del sistema', 'Poner al Cliente a la izquierda', 'Numerar los CU', 'No usar include ni extend'], 0,
    'Los actores siempre van **fuera** de la frontera del sistema. Además, en este caso el encargado ni siquiera es actor. El lado del dibujo da igual, numerar ayuda, e include/extend no son obligatorios.'),
  mcq('u-p18', 'uc', '"Registrar cliente" solo ocurre **a veces** durante el alquiler (si el cliente es nuevo). Si querés dibujarlo como CU aparte, la relación es…',
    ['extend (Registrar cliente extiende Registrar pedido de alquiler)', 'include', 'generalización', 'asociación con el Gerente'], 0,
    '**extend** = comportamiento **opcional o condicional** que se agrega a un CU base. **include** = comportamiento que **siempre** se ejecuta. Recordá que en el práctico no son obligatorios.'),
];

/** Preguntas tomadas de parciales anteriores (reformuladas) con justificación lista para escribir. */
export const URG_OLD: Question[] = [
  tf('u-o01', 'analisis', '(Parcial 2023) "El modelo de análisis es un esquema de implementación, a diferencia del modelo de diseño, que es un esquema conceptual."', false,
    '**FALSO.** Está al revés: el **análisis** es conceptual (qué debe hacer el sistema, en términos del problema) y el **diseño** es el esquema de implementación (cómo se va a construir). **Para justificar:** "Es al revés: el modelo de análisis es conceptual y describe el qué; el de diseño es de implementación y describe el cómo."'),
  tf('u-o02', 'extend', '(Parcial 2023) "La diferencia entre una relación de uso (include) y una de extensión es que esta última siempre proviene de un error o excepción."', false,
    '**FALSO.** El **include** se ejecuta **siempre** que se ejecuta el CU base. El **extend** se ejecuta **solo bajo ciertas condiciones**, pero no tiene por qué ser un error: puede ser una opción, como "Tomar café" extendiendo "Cenar". **Para justificar:** "Falso: el extend agrega comportamiento condicional u opcional, no necesariamente un error; el include se ejecuta siempre."'),
  tf('u-o03', 'formales', '(Parcial 2023) "Las especificaciones formales son algo requerido por el cliente en cualquier desarrollo de software."', false,
    '**FALSO.** Los métodos formales usan bases matemáticas, como el lenguaje Z, para especificar sin ambigüedad. Se justifican en **sistemas críticos**, pero no escalan bien, son costosos y no sirven para desarrollos rápidos ni para interfaces de usuario. Por eso no se usan en cualquier desarrollo. **Para justificar:** "Falso: se usan en sistemas críticos y chicos; no escalan, son costosos y no aptos para desarrollos rápidos."'),
  tf('u-o04', 'embebidos', '(Parcial 2023 y autoevaluación) "Un sistema embebido se emplea para controlar máquinas o equipos, puede ser un circuito integrado que forma parte del sistema y quedar oculto para el usuario, por ejemplo en un reloj digital."', true,
    '**VERDADERO.** Es la definición de sistema embebido o empotrado: software dedicado dentro de un equipo (reloj, microondas, reloj de taxi), invisible para quien lo usa.'),
  tf('u-o05', 'embebidos', '(Parcial 2025) "Los sistemas embebidos, generalmente, están escritos en lenguaje ensamblador."', true,
    '**VERDADERO.** La teoría lo dice textualmente: generalmente se programan en **lenguaje ensamblador** sobre el microprocesador, porque necesitan control directo del hardware y pocos recursos.'),
  tf('u-o06', 'actores', '(Parcial 2025) "En el diagrama de casos de uso, un actor primario en un caso de uso no puede ser actor secundario en otro caso de uso."', false,
    '**FALSO.** Primario o secundario es un rol **dentro de cada CU**. El mismo actor puede iniciar un CU (P) y solo participar en otro (S). **Para justificar:** "Falso: el carácter de primario o secundario es relativo a cada caso de uso; el mismo actor puede ser primario en uno y secundario en otro."'),
  tf('u-o07', 'vyv', '(Parcial 2025) "La validación y verificación de requerimientos son actividades a realizar al finalizar el desarrollo del sistema."', false,
    '**FALSO.** Se hacen **durante todo el ciclo**. Cuanto antes se detecta un error de requerimientos, más barato es corregirlo. **Verificar** = ¿lo construimos bien? (cumple la especificación). **Validar** = ¿construimos lo correcto? (es lo que el cliente necesita). **Para justificar:** "Falso: se realizan a lo largo de todo el desarrollo, porque un error detectado tarde cuesta mucho más."'),
  tf('u-o08', 'colaboracion', '(Parcial 2025) "En el diagrama de colaboración es necesario numerar la secuencia en que se dan los mensajes."', true,
    '**VERDADERO.** El diagrama de colaboración no tiene eje temporal, porque los objetos se dibujan libremente unidos por enlaces. Por eso el orden se indica **numerando los mensajes** (1, 2, 3…). En el de secuencia el orden lo da la posición vertical.'),
  tf('u-o09', 'cuantif', '(Parcial 2022) "Al momento de relevar hay que cuantificar los procesos y los almacenamientos, aunque esto no afectará la solución a implementar."', false,
    '**FALSO** por la segunda parte. Hay que saber **qué** hacer y también **cuánto**: un mismo problema con distintos volúmenes lleva a **soluciones distintas**. No es lo mismo 20 autorizaciones por día que 5000 por hora. **Para justificar:** "Falso: sí afecta, porque distintos volúmenes llevan a soluciones distintas."'),
  tf('u-o10', 'cuantif', '(Parcial 2022) "La cuantificación sólo puede realizarse sobre las entidades o los almacenamientos de datos."', false,
    '**FALSO.** Se cuantifican requisitos **estáticos** (cantidad de terminales, usuarios simultáneos, volumen de información) y **dinámicos** (transacciones por período, tiempos de respuesta: "95 % en menos de 1 s"). No solo entidades.'),
  mcq('u-o11', 'tiemporeal', '(Parcial 2022 y autoevaluación) La correctitud de los resultados y el tiempo de respuesta con que se brindan es más crítico para los…',
    ['Sistemas de tiempo real', 'Sistemas embebidos', 'Sistemas empotrados'], 0,
    'En un **sistema de tiempo real** el resultado debe ser correcto **y** llegar a tiempo: una respuesta correcta pero tardía es una falla. Ejemplos: control de vuelo o un ABS. Embebido y empotrado son sinónimos y se refieren a dónde vive el software, no al tiempo.'),
  tf('u-o12', 'ieee', '(Parcial 2022) "IEEE es un modelo empleado como guía por las organizaciones que desarrollan software para organizar las actividades de especificación de requerimientos."', true,
    '**Respuesta defendible: VERDADERO, justificando.** El estándar **IEEE 830** es la guía para la especificación de requerimientos (SRS). Las organizaciones se basan en él y lo **adaptan** a sus necesidades. **Para justificar:** "Verdadero: el estándar IEEE 830 es una guía para especificar requerimientos; en la práctica las organizaciones lo adaptan." Si lo marcás falso, aclará que IEEE es el instituto y el 830 es el estándar.'),
  mcq('u-o13', 'traza', '(Parcial 2022) "Trazabilidad hacia **atrás desde** los requerimientos" significa…',
    ['Podemos conocer por qué existe cada requerimiento del SRS (su origen)', 'Cada componente del software sabe qué requerimiento satisface', 'Los documentos posteriores referencian al SRS', 'Se pueden borrar requerimientos viejos'], 0,
    'Las 4 trazabilidades: **atrás desde** = por qué existe cada requerimiento (origen). **Adelante hasta** = los documentos que preceden al SRS se pueden referenciar a él. **Atrás hasta** = cada comportamiento del software indica qué requerimiento satisface. **Adelante desde** = qué componentes satisfacen cada requerimiento.'),
  mcq('u-o14', 'srs', '(Parcial 2022/2023) ¿Cuál **NO** es un atributo de una buena especificación de requerimientos (SRS)?',
    ['Estar escrita en un lenguaje de programación', 'No ambigua', 'Verificable', 'Trazable (rastreable)'], 0,
    'Atributos de una buena SRS: **correcta, no ambigua, completa, verificable, consistente, entendible por no especialistas, modificable, trazable y anotada** (por necesidad: E/D/O, y por estabilidad). Una SRS describe el qué, no se escribe en código.'),
  mcq('u-o15', 'srs', '"El sistema debe tener una interfaz amigable" viola principalmente el atributo…',
    ['Verificable (y no ambigua)', 'Modificable', 'Trazable', 'Anotada'], 0,
    'No existe un proceso concreto y finito para comprobar qué es "amigable". Los requerimientos ambiguos **no son verificables**. Hay que reescribirlos con algo medible.'),
  mcq('u-o16', 'smart', 'Según SMART, un requerimiento **rastreable** es aquel que…',
    ['Permite saber su origen, quién lo pidió, dónde está especificado, diseñado e implementado', 'Se puede cumplir con los recursos disponibles', 'Se puede medir', 'No tiene ambigüedad'], 0,
    'SMART: **E**specífico (sin ambigüedad), **M**edible (se puede probar), **A**lcanzable (factible), **R**ealizable (con los recursos disponibles) y **T**rasable/rastreable (origen, quién, dónde).'),
  mcq('u-o17', 'secuencia', '(Parcial 2022/2023) ¿Para qué se usa el diagrama de secuencia?',
    ['Para mostrar en el tiempo cómo colaboran los objetos para realizar un caso de uso', 'Para mostrar los actores y los casos de uso del sistema', 'Para mostrar procesos en paralelo de un negocio', 'Para modelar la base de datos'], 0,
    'Muestra la interacción entre objetos **desde un punto de vista temporal** (de arriba hacia abajo): captura el comportamiento de **un** caso de uso como una secuencia de mensajes. **Para escribir:** "Muestra en orden temporal los mensajes que intercambian los objetos para realizar un caso de uso."'),
  mcq('u-o18', 'objetos', 'El objeto que **modela la información que el sistema maneja a lo largo del tiempo** y sobrevive al caso de uso es…',
    ['Entidad (círculo con una raya abajo)', 'Interfaz (círculo con una T acostada)', 'Control (círculo con una flecha)', 'Actor'], 0,
    '**Entidad**: información persistente, fácil de identificar y casi siempre un concepto del mundo real. **Interfaz**: comunica a los actores con el sistema. **Control**: lógica que no le corresponde a ninguna de las otras dos y coordina entre interfaz y entidades.'),
  mcq('u-o19', 'objetos', 'El objeto que **comunica a los actores con el sistema** (pantalla, formulario, web service) es…',
    ['Interfaz', 'Entidad', 'Control', 'Caso de uso'], 0,
    'La **interfaz** recibe los mensajes del actor y los pasa al control, y devuelve las respuestas al actor. Se identifica fácilmente leyendo la descripción del CU: cada interacción con el actor pasa por ella.'),
  mcq('u-o20', 'objetos', 'El objeto que **modela la funcionalidad que no se asigna naturalmente a ningún otro** y coordina entidades es…',
    ['Control', 'Interfaz', 'Entidad', 'Actor'], 0,
    'El **control** recibe el pedido de la interfaz, opera sobre una o varias entidades (puede mandarse mensajes a sí mismo) y devuelve el resultado a la interfaz.'),
  mcq('u-o21', 'hu', '(Parcial 2022/2023) ¿Cuál es el formato de una **historia de usuario**?',
    ['Como <rol> quiero <funcionalidad> para <beneficio>', 'Id, Nombre, Actores, Pre, Post, Flujo', 'El sistema debe gestionar…', 'Dado / Cuando / Entonces'], 0,
    'Una HU es una descripción **corta e informal** de una funcionalidad, escrita desde el punto de vista del usuario: rol + funcionalidad + beneficio. Se usa en metodologías ágiles. Ejemplo: "Como cliente quiero pagar con tarjeta para no ir al banco". Dado/Cuando/Entonces se usa para los **criterios de aceptación**.'),
  mcq('u-o22', 'pruebas', '(Parcial 2023) ¿Cuál es la secuencia de **fases de prueba** de una estrategia de testing?',
    ['Unidad → integración → sistema (y luego aceptación)', 'Sistema → unidad → integración', 'Aceptación → unidad → sistema', 'Sólo pruebas de aceptación'], 0,
    'La estrategia de prueba define el enfoque y las fases: **unidad** (un módulo, la hace quien lo construyó), **integración** (módulos interconectados, fallas en la interacción) y **sistema** (todo junto, en un ambiente similar al real). Otros tipos: recuperación, seguridad, stress, rendimiento, aceptación y regresión.'),
  tf('u-o23', 'distribuidos', '(Autoevaluación) "El costo y tiempo de las pruebas en sistemas distribuidos (cliente-servidor) es mayor que en sistemas independientes."', true,
    '**VERDADERO.** Influyen la complejidad de la red, el hardware heterogéneo y si la base es centralizada o no. Todo eso multiplica los escenarios a probar.'),
  tf('u-o24', 'distribuidos', '(Autoevaluación) "Los sistemas distribuidos están casi fuera de uso en el mercado actual."', false,
    '**FALSO.** La web, la nube y las apps cliente-servidor son sistemas distribuidos y son la norma hoy.'),
  tf('u-o25', 'sistema', '(Autoevaluación) "Un sistema es un conjunto de elementos relacionados entre sí con un objetivo o grupo de objetivos en común."', true,
    '**VERDADERO.** Es la definición general de sistema que usa la materia.'),
];

export const URG_CHEATSHEET: { t: string; d: string }[] = [
  { t: 'Análisis vs diseño', d: 'Análisis = **qué** (conceptual). Diseño = **cómo** (implementación).' },
  { t: 'include vs extend', d: 'include = **siempre** se ejecuta. extend = **a veces**, bajo condición (no es necesariamente un error).' },
  { t: 'Actor primario / secundario', d: 'P inicia el CU; S participa. Es relativo a **cada** CU.' },
  { t: '3 objetos de análisis', d: '**Interfaz** (actor ↔ sistema, T acostada) · **Control** (lógica, flecha) · **Entidad** (datos persistentes, raya abajo).' },
  { t: 'Secuencia vs colaboración', d: 'Secuencia: orden por **tiempo** (vertical). Colaboración: orden por **números** en los mensajes.' },
  { t: 'Verificación vs validación', d: 'Verificar = ¿lo construí **bien**? Validar = ¿construí **lo correcto**? Ambas durante **todo** el ciclo.' },
  { t: 'Buena SRS', d: 'Correcta, no ambigua, completa, verificable, consistente, entendible, modificable, **trazable**, anotada (E/D/O).' },
  { t: 'Trazabilidad', d: 'Atrás desde (origen) · adelante hasta (docs previos → SRS) · atrás hasta (software → req.) · adelante desde (req. → componentes).' },
  { t: 'Cuantificación', d: 'Qué **y cuánto**. Volúmenes distintos → soluciones distintas. Estáticos (usuarios, terminales, datos) y dinámicos (transacciones/tiempo).' },
  { t: 'Historia de usuario', d: 'Como <rol> quiero <algo> para <beneficio>. INVEST. Criterios de aceptación (Dado/Cuando/Entonces).' },
  { t: 'Pruebas', d: 'Unidad → integración → sistema → aceptación. Regresión: volver a probar tras un cambio.' },
  { t: 'Tiempo real / embebido', d: 'Tiempo real: resultado correcto **y a tiempo**. Embebido: software dentro de un equipo, oculto y en general en ensamblador.' },
  { t: 'Métodos formales', d: 'Base matemática (Z). Sin ambigüedad. Para sistemas **críticos**; no escalan, son caros y no sirven para desarrollos rápidos ni para UI.' },
  { t: 'Diagrama de actividad', d: 'Inicio ●, actividad ▭, decisión ◇ con [guardas], barra de sincronización (paralelo), fin ◉ y carriles por responsable.' },
];
