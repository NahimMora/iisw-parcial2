import type { CUDescription, Chapter, UseCaseDiagramSpec } from '../types';
import { META } from './stubs';
import { KAMERAL_CU2, SERVICIO_CU2 } from '../cases';

export const KAMERAL_CU3: CUDescription = {
  id: 'CU-03', name: 'Devolver libro', actors: 'Socio (P)',
  objective: 'Devolver el libro retirado', pre: 'El socio tiene un retiro registrado', post: 'Devolución registrada',
  normal: [
    'Socio entrega el libro para devolverlo.',
    'Sistema busca el retiro del socio.',
    'Sistema verifica el vencimiento del préstamo.',
    'R1 = devolución dentro de los 10 días.',
    'Sistema registra la devolución.',
    'Sistema informa al socio la devolución registrada.',
    'FCU',
  ],
  alternatives: ['3.1 El préstamo está vencido.', '3.2 Sistema inhabilita al socio por un mes.', '3.3 Continúa en el paso 4.'],
};

const SERVICIO_CU1: CUDescription = {
  id: 'CU_1', name: 'Solicitar alta', actors: 'Persona (P), Cliente (S)',
  objective: 'Lograr inscribirse en el servicio técnico', pre: 'La persona posee aparatos telefónicos; el local funciona', post: 'Emitido el número de cliente',
  normal: ['Persona solicita el alta del servicio.', 'Sistema valida la información recibida.', 'R1: que tenga datos personales, datos de los aparatos y el plan elegido.', 'Sistema registra el nuevo cliente.', 'Sistema entrega el número de cliente.', 'FCU'],
  alternatives: ['2.1 Datos incorrectos.', '2.2 Sistema informa el problema.', '2.3 FCU'],
};

const badCU: CUDescription = {
  id: 'CU-02', name: 'Retiro de libros del bibliotecario', actors: 'Bibliotecario (P)',
  objective: 'Cargar el retiro en la computadora', pre: '—', post: '—',
  normal: ['El bibliotecario abre la pantalla de préstamos.', 'Ingresa el número de socio.', 'Presiona Guardar.'],
  alternatives: ['a) Si el socio debe un libro, se rechaza.'],
};

const extendFig: UseCaseDiagramSpec = {
  kind: 'usecase', system: 'Ejemplos de relaciones',
  actors: [{ id: 'p', name: 'Comensal', side: 'left', y: 85 }, { id: 's', name: 'Socio', side: 'left', y: 260 }],
  cases: [{ id: 'cenar', name: 'Cenar' }, { id: 'cafe', name: 'Tomar café' }, { id: 'pres', name: 'Registrar préstamo' }, { id: 'cons', name: 'Consultar socio' }, { id: 'dev', name: 'Registrar devolución' }, { id: 'x', name: ' ' }],
  links: [{ actor: 'p', uc: 'cenar' }, { actor: 's', uc: 'pres' }, { actor: 's', uc: 'dev' }],
  rels: [{ from: 'cafe', to: 'cenar', kind: 'extend' }, { from: 'pres', to: 'cons', kind: 'include' }, { from: 'dev', to: 'cons', kind: 'include' }],
};
extendFig.cases = extendFig.cases.filter((c) => c.id !== 'x');

export const ch2: Chapter = {
  ...META[1],
  status: 'ready',
  prereq: ['Cap. 1: caso de uso y actores'],
  outcome: 'Escribir sin ayuda la descripción de un caso de uso con el formato de la cátedra, con reglas de validación y al menos una alternativa bien numerada.',
  intro: {
    hook: 'El diagrama dice **qué** casos de uso hay. La descripción cuenta **cómo** se desarrolla uno: paso a paso, qué hace el actor y qué hace el sistema, y qué pasa cuando algo sale mal.',
    why: 'Es la tercera herramienta de la práctica (60 %) y además es **la base del diagrama de secuencia**: la cátedra la pide justamente para poder comprobar que tu secuencia se corresponde con ella.',
    evidence: [
      { level: 'CONFIRMADO', text: 'Se pide "la descripción de un caso de uso particular" y luego el diagrama de secuencia **de ese mismo** caso de uso (Blanco).' },
      { level: 'CONFIRMADO', text: 'Blanco: "para que podamos evaluar si la aplican correctamente, les vamos a pedir que hagan la descripción del caso de uso".' },
      { level: 'CONFIRMADO', text: 'Formato usado por la cátedra: Id, Nombre, Actores (P)/(S), Objetivo, Precondición, Postcondición, Flujo normal con R1 y FCU, Alternativa 2.1, 2.2…' },
      { level: 'CONFIRMADO', text: '«include»/«extend» no se exigen en la práctica; están en la teoría.' },
    ],
  },
  theory: [
    {
      title: '1. Qué es la descripción de un caso de uso',
      blocks: [
        { t: 'p', text: 'Cada caso de uso es una **descripción de las posibles secuencias de interacciones entre el sistema y sus actores** para alcanzar un objetivo. El diagrama lo muestra como una elipse; el **cuadro descriptivo** detalla esas interacciones.' },
        { t: 'list', items: [
          'El **nombre** del cuadro tiene que coincidir con el de la elipse del diagrama.',
          'Se indica **quién inicia** el caso (actor primario) y quién más participa.',
          'Primero se escribe el **curso normal**: cómo sería si todos los controles salieran bien.',
          'Después, en cada paso donde algo puede fallar, aparece un **curso alternativo**.',
        ] },
      ],
    },
    {
      title: '2. El formato que usa la cátedra',
      blocks: [
        { t: 'cu', desc: KAMERAL_CU2, caption: 'Descripción del CU-02 de Kameral presentada por Taboada en la clase de consulta (transcripta).' },
        { t: 'table', head: ['Campo', 'Qué va', 'Pista'], rows: [
          ['Id', 'CU-02, CU_2…', 'El mismo número que en el diagrama'],
          ['Nombre', 'Igual que en la elipse', 'Verbo en infinitivo + objeto'],
          ['Actores', 'Socio (P) · Servicio Técnico (S)', '(P) inicia · (S) es requerido'],
          ['Objetivo', 'Qué quiere lograr el actor', '"Retirar un libro por parte de un socio"'],
          ['Precondición', 'Qué debe cumplirse antes', '"Cliente abonado", "Tiene el libro a retirar"'],
          ['Postcondición', 'Cómo queda todo si termina bien', '"Libro registrado", "Emitido el nro. de cliente"'],
          ['Flujo normal', 'Pasos numerados: actor y sistema', 'Reglas R1 bajo el paso que valida · termina en **FCU**'],
          ['Alternativa', 'Numerada desde el paso donde surge', '2.1, 2.2, 2.3 FCU'],
        ] },
        { t: 'callout', tone: 'teacher', title: 'FCU y R1', evidence: 'CONFIRMADO', text: 'En los ejemplos de la cátedra el flujo termina con **FCU** (fin de caso de uso) y la validación se explicita con una regla debajo del paso: **"R1 = no tenga un retiro registrado sin devolución"**.' },
        { t: 'p', text: 'La teoría también muestra un formato más completo (identificador, actor principal y secundario, descripción "el sistema deberá comportarse tal como se describe", secuencia normal, postcondición, excepciones "si <condición>, el sistema…, a continuación este caso de uso continúa/aborta", importancia y comentarios). Cualquiera de los dos sirve si tiene los elementos esenciales.' },
      ],
    },
    {
      title: '3. Curso normal',
      blocks: [
        { t: 'list', items: [
          'Describe el camino en que **todo sale bien**.',
          'Incluye **lo que hace el actor y lo que hace el sistema**, alternando.',
          'Pasos **numerados** y cortos, en presente: "Socio solicita…", "Sistema valida…".',
          'Cada control importante lleva su **regla** (R1, R2…) para que se entienda qué se valida.',
          'Termina con **FCU**.',
        ] },
        { t: 'callout', tone: 'warn', title: 'Corrección de Blanco', evidence: 'CONFIRMADO', text: '"Entrega el libro" en realidad significa que **el sistema entrega la información**; no se entrega nada físico. Describí lo que hace el sistema.' },
      ],
    },
    {
      title: '4. Cursos alternativos',
      blocks: [
        { t: 'p', text: 'Una vez escrito el curso normal, se revisa en qué pasos puede surgir algo que **obligue a cambiar el curso de acción**. La alternativa se numera con el **número del paso donde ocurre**: si el problema aparece en el paso 2, la alternativa es **2.1**, después **2.2**, etc.' },
        { t: 'compare', left: 'Curso normal', right: 'Alternativa', rows: [
          ['Numeración', '1, 2, 3, 4, FCU', '2.1, 2.2, 2.3 (desde el paso 2)'],
          ['Contenido', 'Todo sale bien', 'Qué pasa si falla el control'],
          ['Cómo termina', 'FCU', 'FCU (aborta) o "continúa en el paso n"'],
        ] },
        { t: 'cu', desc: KAMERAL_CU3, caption: 'Ejemplo trabajado (propio, mismo formato): Devolver libro. La alternativa no aborta: inhabilita al socio y continúa.' },
        { t: 'callout', tone: 'key', title: 'Alternativa ≠ error de sistema', text: 'Las alternativas surgen de la **narrativa**: socio con préstamo pendiente, datos incorrectos, aparato que no corresponde al abono, aparato no reparado aún. Buscá en el enunciado frases como "si…", "en caso de…", "en caso contrario…".' },
      ],
    },
    {
      title: '5. Relaciones entre casos de uso: «include» y «extend»',
      blocks: [
        { t: 'callout', tone: 'teacher', title: 'Para el parcial práctico', evidence: 'CONFIRMADO', text: 'Taboada: "por el nivel de práctica que buscamos no nos metemos ni en el include ni en el extend". **Pueden aparecer en la parte teórica.**' },
        { t: 'p', text: 'Se identifican al **refinar** el modelo, después de tener los casos de uso principales, y **solo pueden darse entre casos de uso**. En ambos casos el caso relacionado **debe ser un caso de uso en sí mismo**.' },
        { t: 'compare', left: '«extend» (extensión)', right: '«include» (uso)', rows: [
          ['Cuándo', 'Una parte de la funcionalidad **no siempre ocurre**', 'Un **escenario común** a más de un caso de uso'],
          ['Ejemplo de la teoría', 'Cenar ← Tomar café (Jacobson)', 'Registrar préstamo y Registrar devolución → Consultar socio'],
          ['¿Es un error o excepción?', 'No: simplemente puede darse o no', 'No: siempre se ejecuta como parte del base'],
          ['Suele aparecer', 'Al analizar variantes', 'Después de especificar varios casos'],
        ], same: ['Ambos deben cumplir la definición de caso de uso', 'Se dibujan con flecha punteada y estereotipo'] },
        { t: 'figure', caption: 'Notación UML estándar: «extend» apunta desde la extensión hacia el caso base; «include» apunta desde el caso base hacia el incluido.', diagram: extendFig },
      ],
    },
    {
      title: '6. Procedimiento para el parcial',
      blocks: [
        { t: 'list', ordered: true, items: [
          'Elegí (o te asignan) **un caso de uso** del diagrama y copiá su **Id y nombre** exactos.',
          'Escribí **Actores** con (P) y (S), el **Objetivo** en una línea, la **Precondición** y la **Postcondición**.',
          'Releé el párrafo de la narrativa de ese proceso y escribí el **curso normal**: pedido del actor → validaciones del sistema (con R1) → registro → respuesta al actor → **FCU**.',
          'Por cada "si…/en caso contrario" del enunciado, una **alternativa** numerada desde ese paso.',
          'Controlá que **cada paso tenga sujeto** (actor o sistema) y que el orden sea el que después vas a dibujar en la secuencia.',
        ] },
        { t: 'cu', desc: SERVICIO_CU1, caption: 'Resolución de la profesora para el servicio técnico (CU_1), transcripta.' },
        { t: 'cu', desc: SERVICIO_CU2, caption: 'Resolución de la profesora para el servicio técnico (CU_2), transcripta.' },
      ],
    },
  ],
  videos: [
    { id: 'ch2-v1', title: 'Cómo escribir la descripción de un caso de uso', src: 'videos/ch2-descripcion-cu.mp4', poster: 'videos/ch2-descripcion-cu.jpg', minutes: 6, summary: 'Del óvalo al cuadro: campos, curso normal con R1 y FCU, alternativas numeradas, include y extend, errores típicos y un ejemplo nuevo.' },
  ],
  map: {
    width: 1040, height: 640,
    groups: {
      cu: { color: '#c9f0d6', label: 'Caso de uso' }, head: { color: '#cfe3ff', label: 'Encabezado' },
      flow: { color: '#ffe3b3', label: 'Flujos' }, rel: { color: '#e2dcfb', label: 'Relaciones (teoría)' }, sec: { color: '#f8d3dc', label: 'Conexión con la secuencia' },
    },
    nodes: [
      { id: 'cu', label: 'Caso de uso (elipse)', x: 520, y: 70, group: 'cu', desc: 'El cuadro describe UN caso de uso del diagrama; el nombre tiene que coincidir.' },
      { id: 'desc', label: 'Cuadro descriptivo', x: 520, y: 200, group: 'cu', desc: 'Secuencia de interacciones actor–sistema para alcanzar el objetivo.' },
      { id: 'enc', label: 'Encabezado', x: 210, y: 200, group: 'head', desc: 'Id, Nombre, Actores (P)/(S), Objetivo.' },
      { id: 'act', label: 'Actores (P) y (S)', x: 110, y: 330, group: 'head', parent: 'enc', desc: '(P) inicia el caso; (S) es requerido (p. ej. se lo notifica).' },
      { id: 'pre', label: 'Precondición', x: 250, y: 420, group: 'head', parent: 'enc', desc: 'Lo que debe ser cierto antes: "Cliente abonado".' },
      { id: 'post', label: 'Postcondición', x: 110, y: 510, group: 'head', parent: 'enc', desc: 'Estado al terminar bien: "Emitido el nro. de cliente".' },
      { id: 'norm', label: 'Curso normal', x: 520, y: 350, group: 'flow', desc: 'Todo sale bien. Pasos numerados del actor y del sistema. Termina en FCU.' },
      { id: 'r1', label: 'Regla R1', x: 420, y: 480, group: 'flow', parent: 'norm', desc: 'Explicita qué se valida en un paso: "R1 = no tenga un retiro sin devolución".' },
      { id: 'fcu', label: 'FCU', x: 610, y: 480, group: 'flow', parent: 'norm', desc: 'Fin de caso de uso.' },
      { id: 'alt', label: 'Curso alternativo', x: 780, y: 350, group: 'flow', desc: 'Surge en un paso del normal y se numera desde él: 2.1, 2.2… Termina en FCU o continúa en un paso.' },
      { id: 'seq', label: 'Diagrama de secuencia', x: 650, y: 590, group: 'sec', desc: 'Debe seguir el mismo orden que la descripción y mostrar normal y alternativa juntos, con condición [ ].' },
      { id: 'inc', label: '«include»: escenario común', x: 880, y: 120, group: 'rel', desc: 'Parte común a varios casos de uso (Consultar socio). Solo teoría.' },
      { id: 'ext', label: '«extend»: no siempre ocurre', x: 880, y: 230, group: 'rel', desc: 'Funcionalidad que puede darse o no (Cenar ← Tomar café). Solo teoría.' },
    ],
    edges: [
      { from: 'cu', to: 'desc', label: 'se detalla en' }, { from: 'desc', to: 'enc' }, { from: 'enc', to: 'act' }, { from: 'enc', to: 'pre' }, { from: 'enc', to: 'post' },
      { from: 'desc', to: 'norm' }, { from: 'norm', to: 'r1' }, { from: 'norm', to: 'fcu' }, { from: 'norm', to: 'alt', label: 'si falla un paso' },
      { from: 'norm', to: 'seq', label: 'mismo orden' }, { from: 'alt', to: 'seq', label: 'condición [ ]' },
      { from: 'cu', to: 'inc', label: 'relación' }, { from: 'cu', to: 'ext', label: 'relación' },
    ],
  },
  notebook: [
    { minutes: 4, prompt: 'Sin mirar: escribí el cuadro del **CU-02 Solicitar libro** de Kameral con todos sus campos, el flujo normal (con R1 y FCU) y la alternativa.', reference: 'Id CU-02 · Solicitar libro · Socio (P) · Objetivo: retirar un libro · Pre: tiene el libro a retirar · Post: retiro registrado. 1 Socio solicita retiro; 2 Valida socio (R1 = no tenga un retiro sin devolución); 3 Registra el retiro; 4 Entrega la información del retiro al socio; 5 FCU. Alternativa: 2.1 Socio con retiro pendiente; 2.2 Se rechaza el pedido; 2.3 FCU.' },
    { minutes: 3, prompt: 'Del servicio técnico: escribí la descripción de **Retirar aparato** ("se verifica si fue devuelto por el Servicio Técnico; si es así se registra quién lo retira y la fecha y se informa el valor; en caso contrario se informa que aún no fue reparado").', reference: 'Actores: Cliente (P). Pre: solicitud de reparación registrada. Post: retiro registrado y valor informado. 1 Cliente solicita retirar el aparato; 2 Sistema verifica que el aparato fue devuelto por el ST (R1 = reparación informada); 3 Sistema registra nombre de quien retira y fecha; 4 Sistema informa el valor de la reparación; 5 FCU. Alternativa: 2.1 Aparato aún no reparado; 2.2 Sistema informa que aún no fue reparado; 2.3 FCU.' },
    { minutes: 2, prompt: 'Dibujá un ejemplo propio de «include» y uno de «extend» y escribí en una línea la diferencia.', reference: '«include»: escenario común a varios casos (Validar socio, usado por Solicitar y Devolver). «extend»: funcionalidad que no siempre ocurre (Cobrar cuota impaga extiende Solicitar libro). Ambos deben ser casos de uso en sí mismos.' },
  ],
  quiz: [
    { id: 'c2q1', type: 'tf', level: 1, concept: 'Nombre igual al diagrama', exam: true, prompt: 'El nombre en el cuadro de descripción debe coincidir con el nombre del caso de uso en el diagrama.', answer: true, explain: 'La teoría lo indica explícitamente: identifica a qué caso de uso corresponde el cuadro.' },
    { id: 'c2q2', type: 'mcq', level: 1, concept: 'Curso normal', exam: true, prompt: '¿Qué describe el curso normal?', options: ['La secuencia de interacciones cuando todas las condiciones y controles salen bien', 'Solo las acciones que realiza el actor', 'Los errores técnicos que puede tener el sistema', 'El orden en que se programan las pantallas'], answer: 0, explain: 'Es el camino "feliz" e incluye tanto lo que hace el actor como lo que hace el sistema.', why: { 1: 'La teoría pide incluir lo que hace el actor y lo que hace el sistema.' } },
    { id: 'c2q3', type: 'mcq', level: 2, concept: 'Numeración de alternativas', exam: true, prompt: 'En el curso normal, el paso 3 valida que el aparato corresponda al abono. ¿Cómo se numera la alternativa si no corresponde?', options: ['3.1', '1', 'A', '4'], answer: 0, explain: 'La alternativa se numera desde el paso donde se produce: 3.1, 3.2…' },
    { id: 'c2q4', type: 'match', level: 1, concept: 'Campos del cuadro', prompt: 'Relacioná cada campo con su contenido en el servicio técnico (CU_2).', pairs: [['Actores', 'Cliente (P), Servicio Técnico (S)'], ['Objetivo', 'Lograr reparar un aparato del cliente'], ['Precondición', 'Cliente abonado'], ['Postcondición', 'Se entrega comprobante de recepción'], ['R1', 'Debe existir el aparato en el abono del cliente']], explain: 'Así lo resolvió la profesora en el ejemplo de práctica.' },
    { id: 'c2q5', type: 'order', level: 2, concept: 'Curso normal', prompt: 'Ordená el curso normal de "Solicitar reparación".', items: ['Cliente solicita reparación de aparato', 'Sistema valida el aparato (R1)', 'Sistema registra la recepción', 'Sistema entrega comprobante de recepción al cliente', 'Sistema avisa al Servicio Técnico', 'FCU'], explain: 'Pedido del actor → validación → registro → respuesta → notificación al secundario → fin.' },
    { id: 'c2q6', type: 'multi', level: 3, concept: 'Errores en la descripción', prompt: '¿Qué problemas tiene este cuadro?', cu: badCU, options: ['El actor primario es un empleado interno en vez del socio', 'El nombre no coincide con el caso de uso del diagrama (Solicitar libro)', 'Describe pantallas y botones en lugar de la interacción de negocio', 'La alternativa no está numerada desde el paso donde ocurre', 'Falta FCU y faltan pre y postcondición', 'Tiene demasiados pasos'], answer: [0, 1, 2, 3, 4], explain: 'Es la visión "computadora": actor interno, pantallas, sin reglas ni numeración docente. El problema no es la cantidad de pasos.', why: { 5: 'Son tres pasos: el problema es qué describen, no cuántos son.' } },
    { id: 'c2q7', type: 'fill', level: 2, concept: 'Numeración de alternativas', prompt: 'Completá la alternativa del CU-02 de Kameral.', text: '{0} Socio tiene un retiro registrado sin devolución. 2.2 Se {1} el pedido de retiro. 2.3 {2}', blanks: [{ options: ['2.1', '1.1', 'A)'], answer: 0 }, { options: ['rechaza', 'registra', 'entrega'], answer: 0 }, { options: ['FCU', 'Continúa en 3', 'R1'], answer: 0 }], explain: 'La validación del socio está en el paso 2; si falla, se rechaza y termina el caso de uso.' },
    { id: 'c2q8', type: 'mcq', level: 1, concept: 'Extend', exam: true, prompt: 'Según la teoría, un caso de uso extiende a otro cuando…', options: ['Tiene una parte de la funcionalidad que no siempre ocurre', 'Es un escenario común a varios casos de uso', 'Representa un error o una excepción del caso base', 'Lo inicia un actor secundario'], answer: 0, explain: 'Ejemplo de Jacobson: Cenar puede extenderse con Tomar café; no es un error, simplemente puede darse o no.', why: { 1: 'Eso describe la relación de uso («include»).', 2: 'La teoría aclara que la extensión no es un error ni una excepción.' } },
    { id: 'c2q9', type: 'mcq', level: 1, concept: 'Include', exam: true, prompt: 'La relación de uso («include») se da cuando…', options: ['Un caso de uso está incluido en otro y es un escenario común a más de un caso', 'Una funcionalidad puede o no ocurrir', 'Dos actores inician el mismo caso de uso', 'Un caso de uso se divide en historias de usuario'], answer: 0, explain: 'Suele aparecer después de especificar varios casos, como funcionalidad común (Consultar socio para préstamo y devolución).' },
    { id: 'c2q10', type: 'tf', level: 1, concept: 'Include y extend', exam: true, prompt: 'Las relaciones de extensión y uso pueden darse entre un actor y un caso de uso.', answer: false, explain: 'Se presentan únicamente entre casos de uso, y ambos deben ser casos de uso en sí mismos.' },
    { id: 'c2q11', type: 'tf', level: 2, concept: 'Include y extend', prompt: 'En la práctica del parcial es obligatorio representar al menos un «include» o un «extend» en el diagrama de casos de uso.', answer: false, explain: 'Taboada: por el nivel de práctica que buscan no se meten ni con include ni con extend.' },
    { id: 'c2q12', type: 'mcq', level: 2, concept: 'Pre y postcondición', prompt: 'Para "Solicitar alta" del servicio técnico, ¿cuál es la postcondición adecuada?', options: ['Emitido el número de cliente', 'La persona posee aparatos telefónicos', 'Sistema valida la información', 'Datos incorrectos'], answer: 0, explain: 'La postcondición es el estado al terminar bien. Poseer aparatos es precondición; validar es un paso; datos incorrectos es una alternativa.' },
    { id: 'c2q13', type: 'open', level: 3, concept: 'Curso normal', prompt: 'Narrativa: "En una cochera, al retirar el auto el conductor entrega el ticket; si lo perdió, se le cobra una tarifa fija; si no, se cobra según las horas." Escribí curso normal y alternativa de "Retirar vehículo".', model: 'Conductor (P). Pre: vehículo ingresado. Post: retiro y cobro registrados. 1 Conductor solicita retirar el vehículo y entrega el ticket; 2 Sistema valida el ticket (R1 = ticket existente y sin retirar); 3 Sistema calcula el importe por horas; 4 Sistema registra el cobro y el retiro; 5 Sistema informa el importe/entrega el comprobante; 6 FCU. Alternativa: 2.1 Ticket perdido; 2.2 Sistema aplica tarifa fija; 2.3 Continúa en el paso 4.', rubric: ['Actor primario correcto (conductor) y campos de encabezado', 'Pasos numerados que alternan actor y sistema', 'Regla de validación explícita', 'Alternativa numerada desde el paso de la validación (2.1…)', 'Cierra con FCU o indica en qué paso continúa'], explain: 'Mismo patrón que Kameral y el servicio técnico.' },
    { id: 'c2q14', type: 'mcq', level: 3, concept: 'Coherencia con la secuencia', prompt: '¿Por qué la cátedra pide la descripción del mismo caso de uso que el diagrama de secuencia?', options: ['Para verificar que la secuencia se corresponda en orden con la descripción', 'Porque la descripción reemplaza al diagrama de casos de uso', 'Porque así se evalúa la ortografía', 'Porque el diagrama de secuencia no tiene alternativas'], answer: 0, explain: 'Blanco: tiene que haber coherencia entre la descripción y la secuencia; sin la descripción no pueden validar que esté bien aplicada.' },
  ],
  mastery: [
    { id: 'c2m1', type: 'mcq', level: 2, concept: 'Numeración de alternativas', prompt: 'Curso normal: 1 Cliente pide turno; 2 Sistema verifica disponibilidad; 3 Sistema registra el turno; 4 FCU. Si no hay disponibilidad, la alternativa correcta es…', options: ['2.1 No hay turno disponible · 2.2 Sistema informa y ofrece otra fecha · 2.3 FCU', '1.1 No hay turno · FCU', 'A) No hay turno', '5. No hay turno · FCU'], answer: 0, explain: 'La falta de disponibilidad se detecta en el paso 2.' },
    { id: 'c2m2', type: 'multi', level: 2, concept: 'Campos del cuadro', prompt: '¿Qué elementos debe tener el cuadro según el formato de la cátedra?', options: ['Id y Nombre', 'Actores con (P)/(S)', 'Objetivo', 'Precondición y Postcondición', 'Flujo normal y Alternativa', 'Diseño de la pantalla'], answer: [0, 1, 2, 3, 4], explain: 'El diseño de pantallas corresponde a prototipos/mockups, no a la descripción del caso de uso.' },
    { id: 'c2m3', type: 'tf', level: 1, concept: 'Curso normal', exam: true, prompt: 'En la descripción del curso normal debe incluirse tanto lo que hará el actor como lo que hará el sistema, y los pasos deben numerarse.', answer: true, explain: 'Es lo que indica la teoría.' },
    { id: 'c2m4', type: 'mcq', level: 2, concept: 'Extend', prompt: 'En una biblioteca, si al pedir un libro la cuota está impaga, se cobra en ese momento. En teoría, ¿qué relación representaría mejor "Cobrar cuota" respecto de "Solicitar libro"?', options: ['«extend»: no siempre ocurre', '«include»: siempre ocurre en varios casos', 'Herencia de actores', 'Asociación con el socio solamente'], answer: 0, explain: 'Solo ocurre si la cuota está impaga: funcionalidad que puede darse o no. (En la práctica del parcial no se exige representarlo).' },
    { id: 'c2m5', type: 'fill', level: 2, concept: 'Pre y postcondición', prompt: 'Completá para "Solicitar reparación".', text: 'Precondición: {0}. Postcondición: {1}. Actor secundario: {2}.', blanks: [{ options: ['Cliente abonado', 'Comprobante entregado', 'Aparato reparado'], answer: 0 }, { options: ['Se entrega comprobante de recepción', 'Cliente abonado', 'El cliente paga'], answer: 0 }, { options: ['Servicio Técnico', 'Cliente', 'Recepcionista'], answer: 0 }], explain: 'Resolución de la profesora: Cliente (P), Soporte Técnico (S); pre: cliente abonado; post: comprobante entregado.' },
    { id: 'c2m6', type: 'order', level: 3, concept: 'Curso normal', prompt: 'Ordená el curso normal de "Devolver libro" (Kameral).', items: ['Socio entrega el libro para devolverlo', 'Sistema busca el retiro del socio', 'Sistema verifica el vencimiento (R1 = dentro de los 10 días)', 'Sistema registra la devolución', 'Sistema informa la devolución registrada', 'FCU'], explain: 'Pedido → búsqueda → control → registro → respuesta → fin. La inhabilitación va como alternativa del paso del control.' },
    { id: 'c2m7', type: 'mcq', level: 3, concept: 'Errores en la descripción', prompt: '¿Cuál de estos pasos está mal redactado para el flujo normal?', options: ['Presionar el botón Guardar', 'Sistema registra el retiro del libro', 'Socio solicita el retiro de un libro', 'Sistema valida al socio'], answer: 0, explain: 'Describe un detalle de interfaz sin sujeto; los pasos dicen quién hace qué a nivel de negocio.' },
  ],
  pitfalls: [
    { error: 'Nombre del cuadro distinto del de la elipse.', fix: 'Copiá Id y nombre exactos del diagrama.', evidence: 'CONFIRMADO' },
    { error: 'Escribir solo lo que hace el actor (o solo el sistema).', fix: 'Alterná: actor pide → sistema valida/registra/responde.' },
    { error: 'Alternativas con letras o sin referencia al paso.', fix: 'Numerá desde el paso: 2.1, 2.2, 2.3 FCU.', evidence: 'CONFIRMADO' },
    { error: 'Validar sin decir qué se valida.', fix: 'Agregá la regla: "R1 = no tenga un retiro sin devolución".', evidence: 'CONFIRMADO' },
    { error: 'Pasos de pantalla: "presiona Guardar", "abre el menú".', fix: 'Nivel de negocio: "Sistema registra el retiro".' },
    { error: 'Confundir precondición con postcondición.', fix: 'Pre = lo que debe ser cierto antes; Post = cómo queda si terminó bien.' },
    { error: 'Usar include/extend en la práctica y complicarte.', fix: 'No se exigen en la práctica; reservalos para la teoría.', evidence: 'CONFIRMADO' },
  ],
};
