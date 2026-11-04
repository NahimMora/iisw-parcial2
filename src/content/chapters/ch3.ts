import type { Chapter, SequenceDiagramSpec } from '../types';
import { META } from './stubs';
import { KAMERAL_CU2, KAMERAL_SEQ, SERVICIO_SEQ } from '../cases';

const P = (id: string, name: string, kind: 'actor' | 'interface' | 'control' | 'entity') => ({ id, name, kind });

const badDirect: SequenceDiagramSpec = {
  kind: 'sequence', numbered: true,
  participants: [P('a', 'Socio', 'actor'), P('i', 'Préstamo', 'interface'), P('c', 'Retirar', 'control'), P('s', 'Socios', 'entity')],
  messages: [
    { from: 'a', to: 's', label: 'Dame socio()' },
    { from: 'a', to: 'i', label: 'Solicitar libro()' },
    { from: 'i', to: 'c', label: 'Validar socio()' },
    { from: 'c', to: 's', label: 'Registrar retiro()' },
    { from: 'c', to: 'i', label: 'Entregar libro()' },
  ],
};

const badNoControl: SequenceDiagramSpec = {
  kind: 'sequence', numbered: true,
  participants: [P('a', 'Cliente', 'actor'), P('i', 'Recepción', 'interface'), P('ab', 'Abonos', 'entity'), P('so', 'Solicitudes', 'entity')],
  messages: [
    { from: 'a', to: 'i', label: 'Solicitar reparación()' },
    { from: 'i', to: 'ab', label: 'Dame abono()' },
    { from: 'i', to: 'i', label: 'Validar()' },
    { from: 'i', to: 'so', label: 'Registrar recepción()' },
    { from: 'i', to: 'a', label: 'Entregar comprobante()' },
  ],
};

const badOrder: SequenceDiagramSpec = {
  kind: 'sequence', numbered: true,
  participants: [P('a', 'Socio', 'actor'), P('i', 'Préstamo', 'interface'), P('c', 'Retirar', 'control'), P('s', 'Socios', 'entity'), P('l', 'Libros', 'entity')],
  messages: [
    { from: 'a', to: 'i', label: 'Solicitar libro()' },
    { from: 'i', to: 'c', label: 'Validar socio()' },
    { from: 'c', to: 's', label: 'Registrar retiro()' },
    { from: 'c', to: 's', label: 'Dame socio()' },
    { from: 'c', to: 'c', label: 'Validar()' },
    { from: 'c', to: 'i', label: 'Entregar libro()' },
    { from: 'i', to: 'a', label: 'Entregar libro()' },
  ],
};

const iterSpec: SequenceDiagramSpec = {
  kind: 'sequence',
  participants: [P('a', 'Coordinador', 'actor'), P('i', 'Informe', 'interface'), P('c', 'Controlar vencidos', 'control'), P('r', 'Retiros', 'entity'), P('i2', 'Aviso por mail', 'interface'), P('s', 'Socio', 'actor')],
  messages: [
    { from: 'a', to: 'i', label: 'Solicitar informe()' },
    { from: 'i', to: 'c', label: 'Buscar vencidos()' },
    { from: 'c', to: 'r', label: 'Dame retiros vencidos()' },
    { from: 'c', to: 'i2', label: 'Enviar reclamo()', cond: 'hay vencidos', iter: true },
    { from: 'i2', to: 's', label: 'Mail de reclamo()', iter: true, cond: 'hay vencidos' },
    { from: 'c', to: 'i', label: 'Mostrar informe()' },
    { from: 'i', to: 'a', label: 'Mostrar informe()' },
  ],
};

const secondActor: SequenceDiagramSpec = {
  kind: 'sequence',
  participants: [P('a', 'Persona', 'actor'), P('i', 'Alta', 'interface'), P('c', 'Registrar socio', 'control'), P('s', 'Socios', 'entity'), P('i2', 'Credencial', 'interface'), P('so', 'Socio', 'actor')],
  messages: [
    { from: 'a', to: 'i', label: 'Solicitar alta(datos)' },
    { from: 'i', to: 'c', label: 'Validar datos()' },
    { from: 'c', to: 'c', label: 'Validar()' },
    { from: 'c', to: 'i', label: 'Informar error()', cond: 'datos incompletos' },
    { from: 'c', to: 's', label: 'Registrar socio()', cond: 'válido' },
    { from: 'c', to: 'i2', label: 'Entregar nro. de socio()' },
    { from: 'i2', to: 'so', label: 'Entregar nro. de socio()' },
  ],
};

export const ch3: Chapter = {
  ...META[2],
  status: 'ready',
  prereq: ['Cap. 2: descripción del caso de uso'],
  outcome: 'Dibujar el diagrama de secuencia del caso de uso que describiste, con los tres estereotipos, la alternativa como condición y el mismo orden que la descripción.',
  intro: {
    hook: 'La descripción cuenta el caso de uso **en palabras**. El diagrama de secuencia muestra **quién le habla a quién y en qué orden** dentro del sistema, flecha por flecha.',
    why: 'Es la cuarta herramienta de la práctica (60 %) y la que más dudas generó en la cursada: por eso la cátedra dedicó la clase de consulta a resolverla. La consigna individual del 20/10 (secuencia del préstamo de Kameral) quedó sin entregar: este capítulo la resuelve.',
    evidence: [
      { level: 'CONFIRMADO', text: 'Se pide el diagrama de secuencia **del caso de uso que describiste** (Blanco).' },
      { level: 'CONFIRMADO', text: '"Cualquier diagrama de secuencia tiene que tener **los tres tipos de objetos**", si no, no cumple el patrón (Blanco).' },
      { level: 'CONFIRMADO', text: 'La secuencia tiene que **corresponderse en orden** con la descripción del caso de uso (Blanco).' },
      { level: 'CONFIRMADO', text: 'Los **períodos de actividad** pueden omitirse en la práctica; se acepta igual (Blanco y Taboada).' },
      { level: 'CONFIRMADO', text: 'El **diagrama de colaboración** no se toma en la práctica; está en la teoría (Taboada).' },
    ],
  },
  theory: [
    {
      title: '1. Qué muestra un diagrama de secuencia',
      blocks: [
        { t: 'list', items: [
          'La **interacción entre objetos desde un punto de vista temporal**.',
          'Cómo **colaboran** un grupo de objetos para realizar una actividad.',
          'Generalmente **atrapa el comportamiento de un caso de uso** en particular.',
          'La **secuencia de mensajes**, con su objeto emisor y receptor, para realizar una tarea.',
        ] },
        { t: 'p', text: 'Pertenece al **modelo de análisis**, que se empieza a desarrollar una vez aprobado el modelo de requerimientos. Este modelo estructura el sistema **independientemente del ambiente de implementación**: se enfoca en su estructura lógica, no en pantallas ni en código.' },
        { t: 'callout', tone: 'teacher', title: 'Para qué sirve (Taboada)', evidence: 'CONFIRMADO', text: 'Aplica el principio de **separación de incumbencias**: saber qué entidades internas tienen responsabilidad en cada escenario. "Dentro de dos años, en diseño, cada uno de estos se puede convertir en una clase y cada mensaje en un método; pero no es este nivel".' },
      ],
    },
    {
      title: '2. Los tres estereotipos del patrón de análisis',
      blocks: [
        { t: 'table', head: ['Estereotipo', 'Símbolo', 'Responsabilidad', 'Ejemplo Kameral'], rows: [
          ['**Interfaz**', 'Círculo con una "T" acostada a la izquierda', 'Comunica actores y sistema (entradas y salidas). **Es el único que recibe mensajes del actor.** Captura datos pero **no los procesa**.', 'Préstamo'],
          ['**Control**', 'Círculo con flecha arriba', 'Coordina el caso de uso: sabe cómo responder la solicitud, marca dónde empieza y dónde termina. **No guarda información.** Opera sobre entidades y devuelve el resultado a la interfaz.', 'Retirar'],
          ['**Entidad**', 'Círculo subrayado', 'Modela la información que el sistema maneja en el tiempo: **sobrevive a los casos de uso**. Suele corresponder a conceptos del mundo real.', 'Socios, Libros'],
        ] },
        { t: 'callout', tone: 'teacher', title: 'Cómo lo explicó Blanco', evidence: 'CONFIRMADO', text: 'Si un actor tiene que comunicarse con el sistema, **sí o sí** lo hace a través de un objeto de interfaz. La interfaz solo captura los datos y se los pasa al **control**, que sabe cómo responder. El control no guarda datos: por eso le pide a las **entidades** lo que necesita o les pide que guarden el resultado.' },
        { t: 'list', items: [
          'Los objetos de interfaz se identifican fácilmente **leyendo la descripción del caso de uso** (cada interacción con un actor).',
          'Los objetos de entidad "suelen ser obvios": los sustantivos del negocio cuya información persiste (Socios, Libros, Abonos, Solicitudes).',
          'Se pone **un control** como base; puede haber más de uno.',
        ] },
      ],
    },
    {
      title: '3. Elementos del diagrama',
      blocks: [
        { t: 'def', term: 'Línea de vida', text: 'Línea vertical punteada debajo de cada objeto.' },
        { t: 'def', term: 'Mensaje', text: 'Flecha del **emisor al receptor** con el **nombre** del mensaje (puede incluir parámetros, restricciones o valor de retorno). **Las flechas más altas ocurren antes.**' },
        { t: 'def', term: 'Período de actividad', text: 'Rectángulo sobre la línea de vida: el tiempo que el objeto tarda en ejecutar una acción. (Opcional en la práctica.)' },
        { t: 'def', term: 'Mensaje recursivo', text: 'Mensaje de un objeto a sí mismo; se representa duplicando el rectángulo de activación, como si el objeto se activara varias veces. Ej.: Validar().' },
        { t: 'def', term: 'Condición', text: 'Entre corchetes antes del mensaje: **solo si es verdadera se ejecuta**. Puede escribirse en lenguaje coloquial: [hay producto].' },
        { t: 'def', term: 'Iteración', text: 'Asterisco antes de la condición: ***[hay vencidos]** — el mensaje se repite mientras la condición sea verdadera.' },
        { t: 'figure', caption: 'Iteración y segundo actor: el coordinador pide el informe y, por cada préstamo vencido, se envía un mail al socio por otra interfaz.', diagram: iterSpec },
      ],
    },
    {
      title: '4. Las reglas que corrige la cátedra',
      blocks: [
        { t: 'table', head: ['Regla', 'Por qué'], rows: [
          ['Actor → **Interfaz** (nunca a control o entidad)', 'La interfaz es el único objeto que puede resolver un mensaje del actor'],
          ['Interfaz → **Control**', 'La interfaz no procesa; el control sabe qué hacer'],
          ['Control → **Entidades** (pedir o guardar datos)', 'El control no recuerda información'],
          ['Control → Interfaz → Actor (respuesta)', 'La salida también pasa por la interfaz'],
          ['Los **tres tipos** presentes siempre', 'Si falta uno no cumple el patrón (Blanco)'],
          ['Actores en los **extremos**, nunca en el medio', 'El actor es externo (igual que en el diagrama de CU)'],
          ['Segundo actor → **otra interfaz** al final', '"Empieza en una interfaz y termina en otra" (Taboada)'],
          ['Normal y alternativa **en un solo diagrama**, con [condición]', 'En la descripción van separados; en la secuencia, de punta a punta'],
          ['**Mismo orden** que la descripción', 'Lo que permite validar tu trabajo'],
          ['Actor nombrado con su **rol** (Socio), no con el nombre del caso de uso', 'Corrección de Blanco al ejemplo'],
          ['Las entidades **no resuelven** el caso', 'Siempre el control maneja (separación de incumbencias)'],
        ] },
      ],
    },
    {
      title: '5. Ejemplo trabajado: Kameral · Solicitar libro',
      blocks: [
        { t: 'cu', desc: KAMERAL_CU2, caption: 'Partimos de la descripción (capítulo 2).' },
        { t: 'table', head: ['Paso de la descripción', 'Mensajes', 'Por qué ese emisor y receptor'], rows: [
          ['1 Socio solicita el retiro', 'Socio → Préstamo: Solicitar libro()', 'El actor solo puede hablarle a la interfaz'],
          ['2 Se valida al socio (R1)', 'Préstamo → Retirar: Validar socio()', 'La interfaz captura y delega al control'],
          ['', 'Retirar → Socios: Dame socio() · Retirar → Libros: Dame libro()', 'El control no tiene datos: los pide a las entidades'],
          ['', 'Retirar → Retirar: Validar()', 'El control compara (mensaje recursivo)'],
          ['2.1–2.3 Alternativa', 'Retirar → Préstamo: [retiro sin devolución] Mensaje error()', 'La alternativa aparece en el mismo diagrama, con condición'],
          ['3 Se registra el retiro', 'Retirar → Socios / Libros: [válido] Registrar retiro()', 'Guardar es tarea de las entidades, ordenada por el control'],
          ['4 Se entrega al socio', 'Retirar → Préstamo → Socio: Entregar libro()', 'La respuesta vuelve por la interfaz'],
        ] },
        { t: 'figure', caption: 'Secuencia de Kameral (reconstruida de la clase de consulta; actor corregido a "Socio").', diagram: KAMERAL_SEQ },
        { t: 'callout', tone: 'tip', title: 'Datos de las entidades (consigna 20/10)', text: '**Socios**: nro. de socio, nombre, DNI, estado de la cuota, inhabilitado hasta, retiro vigente (libro y fecha). **Libros**: código, título, autor, estado (disponible/prestado). Detallarlos ayuda a justificar cada "Dame…()" y "Registrar…()".' },
      ],
    },
    {
      title: '6. Con actor secundario: servicio técnico',
      blocks: [
        { t: 'p', text: 'Cuando el caso de uso tiene un actor secundario (Servicio Técnico), el diagrama **empieza en una interfaz** para el actor primario y **termina en otra interfaz** que se comunica con el secundario, ubicado en el **extremo derecho**.' },
        { t: 'figure', caption: 'Solicitar reparación: dos interfaces, una delante y otra atrás.', diagram: SERVICIO_SEQ },
        { t: 'figure', caption: 'Mismo patrón para Alta de socio: la persona inicia; el número de socio sale por otra interfaz hacia el socio.', diagram: secondActor },
      ],
    },
    {
      title: '7. Diagramas de colaboración e interacción (teoría)',
      blocks: [
        { t: 'compare', left: 'Secuencia', right: 'Colaboración', rows: [
          ['Información', 'Mensajes entre objetos', '**La misma** que el de secuencia'],
          ['Cómo se ordena', 'Por la posición vertical de las flechas', 'Los mensajes se **numeran** para indicar la secuencia'],
          ['Objetos', 'En fila, con línea de vida', 'Únicos, unidos por **links**, con los mensajes sobre ellos'],
          ['Selección e iteración', '[condición] y *', 'Se denotan **igual**'],
          ['En el parcial', 'Práctica y teoría', 'Solo teoría (no se toma en la práctica)'],
        ] },
        { t: 'p', text: 'Ambos son **diagramas de interacción**: existen esos dos tipos y **el usuario elige cuál emplear**. Taboada contó su origen: con las tarjetas CRC se pensaba "quién puede colaborar conmigo" más que "qué mensaje viene después de otro".' },
      ],
    },
    {
      title: '8. Procedimiento para el parcial',
      blocks: [
        { t: 'list', ordered: true, items: [
          'Tené a la vista **la descripción** del caso de uso (es el guion).',
          'Ubicá al **actor primario** a la izquierda, con su rol.',
          'Creá **una interfaz** para ese actor y **un control** para el caso de uso.',
          'Leé los sustantivos cuya información se consulta o guarda → **entidades**.',
          'Si hay **actor secundario**: otra interfaz y el actor en el extremo derecho.',
          'Dibujá las **líneas de vida**.',
          'Recorré la descripción paso a paso y dibujá **cada mensaje**: actor→interfaz, interfaz→control, control→entidades, control→sí mismo para validar.',
          'Agregá la **alternativa** con su **[condición]** en el lugar donde ocurre.',
          'Terminá con la **respuesta** control→interfaz→actor (y la notificación al secundario si corresponde).',
          'Controlá: **tres estereotipos**, actor solo con interfaz, mismo orden que la descripción, nombres en todas las flechas.',
        ] },
      ],
    },
  ],
  videos: [
    { id: 'ch3-v1', title: 'Diagrama de secuencia paso a paso', src: 'videos/ch3-secuencia.mp4', poster: 'videos/ch3-secuencia.jpg', minutes: 10, summary: 'Kameral de la narrativa a la última flecha: estereotipos, líneas de vida, cada mensaje con su motivo, alternativa con condición, comparación con la descripción, errores y una variante con actor secundario.' },
  ],
  map: {
    width: 1060, height: 660,
    groups: {
      base: { color: '#cfe3ff', label: 'Diagrama' }, st: { color: '#ffe3b3', label: 'Estereotipos' },
      el: { color: '#c9f0d6', label: 'Elementos' }, rule: { color: '#f8d3dc', label: 'Reglas de la cátedra' }, col: { color: '#e2dcfb', label: 'Interacción (teoría)' },
    },
    nodes: [
      { id: 'cu', label: 'Descripción del CU', x: 120, y: 70, group: 'base', desc: 'El guion del diagrama: mismo orden, misma alternativa.' },
      { id: 'ds', label: 'Diagrama de secuencia', x: 420, y: 70, group: 'base', desc: 'Interacción entre objetos en el tiempo; un caso de uso; mensajes con emisor y receptor.' },
      { id: 'ma', label: 'Modelo de análisis', x: 720, y: 70, group: 'base', desc: 'Estructura lógica del sistema, independiente de la implementación; se hace tras aprobar los requerimientos.' },
      { id: 'act', label: 'Actor (extremos)', x: 110, y: 230, group: 'st', desc: 'Externo, a la izquierda (primario) o al final (secundario). Solo habla con interfaces.' },
      { id: 'if', label: 'Interfaz', x: 320, y: 230, group: 'st', desc: 'Entradas y salidas actor–sistema. Captura, no procesa.' },
      { id: 'ct', label: 'Control', x: 530, y: 230, group: 'st', desc: 'Coordina el caso de uso; no guarda datos; inicio y fin.' },
      { id: 'en', label: 'Entidad', x: 740, y: 230, group: 'st', desc: 'Información que sobrevive al caso de uso (Socios, Libros).' },
      { id: 'lv', label: 'Línea de vida', x: 140, y: 420, group: 'el', desc: 'Línea vertical punteada bajo cada objeto.' },
      { id: 'msg', label: 'Mensaje (flecha)', x: 340, y: 420, group: 'el', desc: 'Emisor → receptor, con nombre. Más arriba = antes.' },
      { id: 'pa', label: 'Período de actividad', x: 140, y: 560, group: 'el', parent: 'lv', desc: 'Rectángulo sobre la línea de vida. Opcional en la práctica.' },
      { id: 'rec', label: 'Mensaje recursivo', x: 340, y: 560, group: 'el', parent: 'msg', desc: 'Un objeto se envía un mensaje a sí mismo: Validar().' },
      { id: 'cond', label: '[condición]', x: 540, y: 470, group: 'el', parent: 'msg', desc: 'El mensaje solo se ejecuta si es verdadera. Así entra la alternativa.' },
      { id: 'it', label: '*[iteración]', x: 540, y: 590, group: 'el', parent: 'msg', desc: 'Se repite mientras la condición sea verdadera.' },
      { id: 'r3', label: 'Siempre los 3 tipos', x: 900, y: 330, group: 'rule', desc: 'Interfaz, control y entidad. Si falta uno, no cumple el patrón.' },
      { id: 'ord', label: 'Mismo orden que la descripción', x: 900, y: 450, group: 'rule', desc: 'Coherencia descripción–secuencia: es lo que se evalúa.' },
      { id: 'sec', label: '2º actor → otra interfaz', x: 900, y: 570, group: 'rule', desc: 'Empieza en una interfaz y termina en otra, con el secundario a la derecha.' },
      { id: 'col', label: 'Diagrama de colaboración', x: 720, y: 600, group: 'col', desc: 'Misma información; objetos con links y mensajes numerados. Solo teoría.' },
    ],
    edges: [
      { from: 'cu', to: 'ds', label: 'es el guion de' }, { from: 'ma', to: 'ds', label: 'se expresa en' },
      { from: 'act', to: 'if', label: 'pide' }, { from: 'if', to: 'ct', label: 'delega' }, { from: 'ct', to: 'en', label: 'consulta / guarda' },
      { from: 'ds', to: 'if' }, { from: 'ds', to: 'msg' }, { from: 'ds', to: 'lv' },
      { from: 'lv', to: 'pa' }, { from: 'msg', to: 'rec' }, { from: 'msg', to: 'cond' }, { from: 'msg', to: 'it' },
      { from: 'ma', to: 'r3' }, { from: 'cu', to: 'ord' }, { from: 'r3', to: 'ord' }, { from: 'ord', to: 'sec' },
      { from: 'ds', to: 'col', label: 'misma info' },
    ],
  },
  notebook: [
    { minutes: 3, prompt: 'Sin mirar: explicá los **tres tipos de objetos** del diagrama de secuencia (qué hace cada uno y qué NO hace) y dibujá cómo interactúan con el actor.', reference: 'Interfaz: único que recibe al actor; captura datos, no procesa. Control: coordina, sabe responder, no guarda datos. Entidad: guarda la información que persiste. Actor → Interfaz → Control → Entidades; respuesta Control → Interfaz → Actor.' },
    { minutes: 5, prompt: 'Dibujá el diagrama de secuencia de **Solicitar libro** (Kameral) a partir de su descripción, con la alternativa entre corchetes.', reference: 'Socio → Préstamo: Solicitar libro(); Préstamo → Retirar: Validar socio(); Retirar → Socios: Dame socio(); Retirar → Libros: Dame libro(); Retirar → Retirar: Validar(); Retirar → Préstamo: [retiro sin devolución] Mensaje error(); Retirar → Socios/Libros: [válido] Registrar retiro(); Retirar → Préstamo → Socio: Entregar libro().', refDiagram: KAMERAL_SEQ },
    { minutes: 5, prompt: 'Dibujá la secuencia de **Solicitar reparación** del servicio técnico (actor secundario: Servicio Técnico).', reference: 'Dos interfaces: Recepción (cliente) y Aviso ST (servicio técnico, extremo derecho). Control: Gestor reparación. Entidades: Abonos, Solicitudes. Condición [datos incorrectos] Informar problema().', refDiagram: SERVICIO_SEQ },
  ],
  quiz: [
    { id: 'c3q1', type: 'mcq', level: 1, concept: 'Qué muestra la secuencia', exam: true, prompt: 'El diagrama de secuencia muestra principalmente…', options: ['La interacción entre objetos desde un punto de vista temporal', 'La estructura de la base de datos', 'Los actores y casos de uso del sistema', 'El diseño de las pantallas'], answer: 0, explain: 'Representa la secuencia de mensajes (emisor y receptor) para realizar una tarea, generalmente un caso de uso.' },
    { id: 'c3q2', type: 'match', level: 1, concept: 'Estereotipos', exam: true, prompt: 'Relacioná cada tipo de objeto con su responsabilidad.', pairs: [['Interfaz', 'Permite la comunicación entre actores y sistema'], ['Control', 'Coordina el caso de uso sin guardar información'], ['Entidad', 'Modela información que sobrevive a los casos de uso']], explain: 'Es el patrón de análisis de tres estereotipos que enseña la cátedra.' },
    { id: 'c3q3', type: 'tf', level: 1, concept: 'Orden de los mensajes', exam: true, prompt: 'En un diagrama de secuencia, las flechas ubicadas más arriba se ejecutan antes que las de abajo.', answer: true, explain: 'El orden temporal está dado por la altura de la flecha.' },
    { id: 'c3q4', type: 'mcq', level: 1, concept: 'Iteración y condición', exam: true, prompt: '¿Qué significa *[hay vencidos] antes de un mensaje?', options: ['El mensaje se repite mientras haya vencidos', 'El mensaje se ejecuta una sola vez si hay vencidos', 'El mensaje es opcional para el usuario', 'El mensaje devuelve una lista de vencidos'], answer: 0, explain: 'El asterisco indica iteración: se repite mientras la condición sea verdadera. Sin asterisco, [condición] ejecuta el mensaje solo si es verdadera.' },
    { id: 'c3q5', type: 'multi', level: 3, concept: 'Errores en la secuencia', prompt: 'Observá este diagrama de Solicitar libro. ¿Qué errores tiene?', diagram: badDirect, options: ['El actor le envía un mensaje directamente a una entidad (1)', 'Falta la validación del socio por parte del control antes de registrar', 'No aparece ningún objeto de control', 'La respuesta no llega al actor', 'El orden no coincide con la descripción (el actor pide datos antes de solicitar)'], answer: [0, 1, 3, 4], explain: 'El actor solo habla con la interfaz; el control debe pedir los datos y validar antes de registrar; la respuesta debe volver interfaz → actor. Sí hay control (Retirar).', why: { 2: 'Retirar es un objeto de control.' } },
    { id: 'c3q6', type: 'mcq', level: 3, concept: 'Tres estereotipos', prompt: '¿Cuál es el error principal de este diagrama?', diagram: badNoControl, options: ['No tiene objeto de control: la interfaz está procesando el caso de uso', 'Tiene demasiadas entidades', 'El actor debería estar en el medio', 'Faltan los períodos de actividad'], answer: 0, explain: 'Todo diagrama debe tener los tres tipos; la interfaz captura pero no procesa. Los períodos de actividad son opcionales en la práctica.', why: { 3: 'Blanco: si no hacen los períodos de actividad se toma igual.' } },
    { id: 'c3q7', type: 'order', level: 2, concept: 'Orden de los mensajes', prompt: 'Ordená los mensajes de "Solicitar libro".', items: ['Socio → Préstamo: Solicitar libro()', 'Préstamo → Retirar: Validar socio()', 'Retirar → Socios: Dame socio()', 'Retirar → Retirar: Validar()', 'Retirar → Socios: [válido] Registrar retiro()', 'Retirar → Préstamo: Entregar libro()', 'Préstamo → Socio: Entregar libro()'], explain: 'Pedido → delegación → datos → validación → registro → respuesta por la interfaz.' },
    { id: 'c3q8', type: 'fill', level: 2, concept: 'Estereotipos', prompt: 'Completá según lo explicado por Blanco.', text: 'La {0} solo captura los datos y no los procesa; se los pasa al {1}, que sabe cómo responder pero no guarda datos; por eso le pide a las {2} la información que necesita.', blanks: [{ options: ['interfaz', 'entidad', 'actor'], answer: 0 }, { options: ['control', 'actor', 'caso de uso'], answer: 0 }, { options: ['entidades', 'interfaces', 'líneas de vida'], answer: 0 }], explain: 'Es la cadena interfaz → control → entidades.' },
    { id: 'c3q9', type: 'tf', level: 2, concept: 'Alternativa en la secuencia', prompt: 'Como en la descripción, en el diagrama de secuencia el curso normal y la alternativa se dibujan en diagramas separados.', answer: false, explain: 'Taboada: en la secuencia la alternativa aparece en el medio, con condición; es una sola de punta a punta.' },
    { id: 'c3q10', type: 'mcq', level: 2, concept: 'Segundo actor', prompt: 'En Solicitar reparación hay que avisar al Servicio Técnico (actor secundario). ¿Cómo se representa?', options: ['Con otra interfaz al final que se comunica con el Servicio Técnico, ubicado en el extremo derecho', 'Con el Servicio Técnico en el medio del diagrama, junto al control', 'Con una entidad "Servicio Técnico" que recibe el mensaje', 'No se representa: los secundarios no aparecen en la secuencia'], answer: 0, explain: 'Taboada: empieza en una interfaz y termina en otra; los actores siempre en los extremos (Blanco).' },
    { id: 'c3q11', type: 'multi', level: 3, concept: 'Errores en la secuencia', prompt: 'Comparado con la descripción del CU-02, ¿qué está mal en este diagrama?', diagram: badOrder, options: ['Registra el retiro (3) antes de obtener y validar al socio (4 y 5)', 'No muestra la alternativa del socio con retiro pendiente', 'Le falta la entidad Libros en los mensajes', 'El actor está bien ubicado a la izquierda'], answer: [0, 1, 2], explain: 'El orden debe seguir la descripción: pedir datos, validar, y recién registrar; además falta la alternativa [retiro sin devolución] y Libros nunca participa. Que el actor esté a la izquierda es correcto, no un error.', why: { 3: 'Eso es correcto, no un error.' } },
    { id: 'c3q12', type: 'mcq', level: 1, concept: 'Colaboración', exam: true, prompt: 'Respecto del diagrama de secuencia, el de colaboración…', options: ['Muestra la misma información, pero con objetos unidos por links y mensajes numerados', 'Muestra información diferente: los atributos de cada objeto', 'No permite representar condiciones ni iteraciones', 'Reemplaza al diagrama de casos de uso'], answer: 0, explain: 'La diferencia es gráfica; selección e iteración se denotan igual.' },
    { id: 'c3q13', type: 'tf', level: 1, concept: 'Período de actividad', prompt: 'El período de actividad se representa con un rectángulo sobre la línea de vida y en la práctica del parcial es obligatorio dibujarlo.', answer: false, explain: 'Se representa así, pero la cátedra aclaró que si se omite en la práctica se acepta igual.' },
    { id: 'c3q14', type: 'open', level: 3, concept: 'Construcción de la secuencia', prompt: 'Describí (o dibujá en el cuaderno y resumí) la secuencia de "Devolver libro": el socio entrega el libro; el sistema busca su retiro, verifica el vencimiento, si está vencido lo inhabilita un mes, y registra la devolución.', model: 'Socio → Devolución (interfaz): Devolver libro(); Devolución → Recibir devolución (control): Procesar devolución(); control → Socios: Dame retiro(); control → control: Verificar vencimiento(); control → Socios: [vencido] Inhabilitar socio(); control → Socios/Libros: Registrar devolución(); control → Devolución → Socio: Informar devolución().', rubric: ['Actor a la izquierda que solo habla con una interfaz', 'Un control que coordina y entidades que guardan/proveen datos', 'Verificación del vencimiento antes de registrar', 'Condición [vencido] para la inhabilitación dentro del mismo diagrama', 'Respuesta al socio pasando por la interfaz y orden igual a la descripción'], explain: 'Mismo patrón que Solicitar libro, con una alternativa que no aborta.' },
    { id: 'c3q15', type: 'mcq', level: 2, concept: 'Estereotipos', prompt: 'En una narrativa, el sistema debe "registrar la reparación con su costo". ¿Qué objeto guarda ese costo?', options: ['Una entidad (p. ej. Solicitudes o Reparaciones)', 'El control', 'La interfaz', 'El actor Servicio Técnico'], answer: 0, explain: 'La información que persiste se guarda en entidades; el control no recuerda datos.' },
  ],
  mastery: [
    { id: 'c3m1', type: 'mcq', level: 2, concept: 'Estereotipos', prompt: 'Un alumno dibuja: Cliente → Turnos (entidad): Pedir turno(). ¿Qué corrección corresponde?', options: ['El cliente debe hablar con una interfaz, que delega en un control, que consulta la entidad Turnos', 'Está bien porque Turnos tiene la información', 'Hay que agregar un período de actividad', 'Turnos debería ser un actor'], answer: 0, explain: 'Actor → Interfaz → Control → Entidad.' },
    { id: 'c3m2', type: 'multi', level: 2, concept: 'Tres estereotipos', prompt: '¿Qué condiciones debe cumplir todo diagrama de secuencia según la cátedra?', options: ['Tener objetos de interfaz, control y entidad', 'Seguir el orden de la descripción del caso de uso', 'Ubicar los actores en los extremos', 'Incluir obligatoriamente períodos de actividad', 'Mostrar la alternativa con su condición en el mismo diagrama'], answer: [0, 1, 2, 4], explain: 'Los períodos de actividad son opcionales en la práctica.' },
    { id: 'c3m3', type: 'tf', level: 1, concept: 'Estereotipos', exam: true, prompt: 'Los objetos de entidad modelan información que el sistema debe manejar a lo largo del tiempo y que sobrevive a los casos de uso.', answer: true, explain: 'Definición de la teoría.' },
    { id: 'c3m4', type: 'mcq', level: 1, concept: 'Estereotipos', exam: true, prompt: 'Los objetos de control…', options: ['Modelan la funcionalidad que no se asigna naturalmente a la interfaz ni a la información', 'Representan las pantallas del sistema', 'Almacenan los datos de los usuarios', 'Son los actores internos'], answer: 0, explain: 'Su comportamiento son operaciones sobre entidades, devolviendo el resultado a una interfaz.' },
    { id: 'c3m5', type: 'order', level: 3, concept: 'Construcción de la secuencia', prompt: 'Ordená los mensajes de "Solicitar reparación".', items: ['Cliente → Recepción: Solicitar reparación()', 'Recepción → Gestor: Validar aparato()', 'Gestor → Abonos: Dame abono()', 'Gestor → Gestor: Validar()', 'Gestor → Solicitudes: [válido] Registrar recepción()', 'Gestor → Recepción → Cliente: Entregar comprobante()', 'Gestor → Aviso ST → Servicio Técnico: Avisar nueva solicitud()'], explain: 'Sigue la descripción de la profesora: valida, registra, entrega comprobante y avisa al servicio técnico.' },
    { id: 'c3m6', type: 'mcq', level: 2, concept: 'Iteración y condición', prompt: 'En el diagrama, "[stock suficiente] Registrar venta()" significa…', options: ['Registrar venta se ejecuta solo si hay stock suficiente', 'Registrar venta se repite mientras haya stock', 'Registrar venta es un mensaje recursivo', 'Registrar venta devuelve el stock'], answer: 0, explain: 'Los corchetes expresan una condición; el asterisco indicaría repetición.' },
    { id: 'c3m7', type: 'tf', level: 2, concept: 'Segundo actor', prompt: 'Un actor puede ubicarse entre el objeto de control y las entidades si eso simplifica el dibujo.', answer: false, explain: 'Los actores quedan siempre en los extremos; si hay otro actor, se agrega otra interfaz al final.' },
    { id: 'c3m8', type: 'mcq', level: 3, concept: 'Coherencia con la descripción', prompt: 'La descripción dice: "2 Sistema valida al socio · 3 Sistema registra el retiro". En tu secuencia, Registrar retiro() aparece antes que Dame socio(). ¿Qué pasa en la corrección?', options: ['Se considera incorrecto porque el orden no se corresponde con la descripción', 'Da igual, el orden de las flechas no importa', 'Es correcto si Registrar retiro tiene condición', 'Es correcto porque el diagrama de secuencia no se compara con la descripción'], answer: 0, explain: 'Blanco: tiene que haber coherencia entre la descripción y el diagrama de secuencia; el orden vertical es el orden temporal.' },
  ],
  pitfalls: [
    { error: 'El actor le habla directo al control o a una entidad.', fix: 'Actor → Interfaz siempre. La interfaz es el único que resuelve mensajes del actor.', evidence: 'CONFIRMADO' },
    { error: 'Faltan estereotipos (sin control, o sin entidades).', fix: 'Los tres tipos, siempre. Si la interfaz "valida", te falta el control.', evidence: 'CONFIRMADO' },
    { error: 'Orden distinto al de la descripción.', fix: 'Dibujá mirando la descripción paso por paso.', evidence: 'CONFIRMADO' },
    { error: 'Alternativa en otro diagrama o sin condición.', fix: 'Mismo diagrama, mensaje con [condición] donde ocurre.', evidence: 'CONFIRMADO' },
    { error: 'Actor secundario en el medio.', fix: 'Otra interfaz al final y el actor en el extremo derecho.', evidence: 'CONFIRMADO' },
    { error: 'Nombrar el actor con el nombre del caso de uso ("Solicita libro").', fix: 'El actor va con su rol: Socio.', evidence: 'CONFIRMADO' },
    { error: 'Entidades que "deciden" o le responden al actor.', fix: 'Las entidades solo dan o guardan datos; el control decide.', evidence: 'CONFIRMADO' },
    { error: 'Flechas sin nombre.', fix: 'Cada mensaje lleva su nombre (verbo + objeto, con paréntesis).' },
  ],
};
