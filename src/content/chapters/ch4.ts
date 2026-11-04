import type { Chapter } from '../types';
import { META } from './stubs';

export const ch4: Chapter = {
  ...META[3],
  status: 'ready',
  prereq: ['Cap. 1: caso de uso'],
  outcome: 'Distinguir prototipo de mockup, explicar cuándo conviene prototipar y su desventaja, redactar una historia de usuario válida y explicar cada letra de INVEST.',
  intro: {
    hook: 'Antes de construir, hay que **ver** lo que el usuario necesita. Prototipos y mockups lo muestran; las historias de usuario lo cuentan en una línea.',
    why: 'Es teoría de memoria rápida y muy preguntable en formato verdadero/falso u opción múltiple: definiciones, ventajas/desventajas e INVEST.',
    evidence: [
      { level: 'PROBABLE', text: 'Integra el bloque "Modelado de requerimientos" de la teoría nueva, base de la parte teórica.' },
      { level: 'COMPLEMENTARIO', text: 'No se pide en la práctica: allí se piden requerimientos, casos de uso, descripción y secuencia.' },
    ],
  },
  theory: [
    {
      title: '1. Prototipación de requerimientos',
      blocks: [
        { t: 'def', term: 'Prototipo', text: 'Modelo o maqueta de las **interfaces entre el sistema y el usuario**. Simula los aspectos más visuales (entradas, salidas, elementos gráficos) y la **interactividad**, buscando la mayor similitud con el sistema final.' },
        { t: 'p', text: 'Muchos errores provienen de una **comunicación deficiente** entre usuario y analista al obtener requisitos. Son de los más caros porque se ven **tarde** y multiplican el costo inicial. Los problemas típicos: requisitos **incompletos, ambiguos o inconsistentes**.' },
        { t: 'list', items: ['Definir a qué usuarios va dirigido y responder a sus necesidades.', 'Usar conceptos, términos y simbología familiares.', 'Mantener coherencia dentro del sistema y con otros existentes.', 'Agrupar las funciones en forma lógica.', 'Mostrar el estado de ejecución de las funciones.', 'Obstaculizar acciones que puedan destruir datos.', 'Generar diálogos eficientes.'] },
        { t: 'compare', left: 'Cuándo conviene', right: 'Principal desventaja', rows: [
          ['Situación', 'Requerimientos que **cambian rápido**; cliente poco abierto a dar una lista completa; ni cliente ni equipo conocen el área', 'Es imposible saber desde el comienzo **cuánto tiempo** llevará un producto aceptable (no se sabe cuántas iteraciones harán falta)'],
        ] },
        { t: 'callout', tone: 'key', title: 'Gordon y Bieman (1995), 39 proyectos', text: 'Beneficios: mejor **usabilidad**, mayor **coherencia** entre necesidades y sistema, **diseño** de mejor calidad, mejor **mantenimiento** y **menos esfuerzo** de desarrollo. La forma de evitar problemas posteriores es una buena gestión del proceso de requerimientos.' },
      ],
    },
    {
      title: '2. Diseño centrado en el usuario y mockups',
      blocks: [
        { t: 'p', text: 'Al determinar requerimientos se revisan primero los aspectos **más visibles** y se trabaja con los usuarios: qué verá el cliente y qué interacciones tendrá. Es la herramienta para obtener **feedback** y acordar los requerimientos.' },
        { t: 'compare', left: 'Prototipo', right: 'Mockup', rows: [
          ['Qué es', 'Maqueta que **simula la interactividad**', 'Representación visual **estática** de un diseño'],
          ['Muestra', 'Entradas, salidas y comportamiento', 'Estructura de la información, contenidos y funciones básicas'],
          ['Ejemplo', 'Pantallas que responden a acciones', 'Un video se representa con una imagen y un ícono de reproducción'],
          ['Uso', 'Acordar requerimientos', 'Que el equipo visualice el diseño y pedir feedback al cliente'],
        ], same: ['Ambos son herramientas de diseño centrado en el usuario', 'Ambos sirven para revisiones con el cliente'] },
      ],
    },
    {
      title: '3. Historias de usuario',
      blocks: [
        { t: 'def', term: 'Historia de usuario', text: 'Descripción de una funcionalidad **desde el punto de vista del usuario o cliente**, en párrafos breves (idealmente hasta dos oraciones) cargados en tarjetas.' },
        { t: 'table', head: ['Pregunta', 'Responde'], rows: [['¿Quién es el beneficiario?', 'Interesados/actores que se benefician'], ['¿Qué se quiere hacer?', 'Visión de alto nivel de la funcionalidad'], ['¿Cuál es el beneficio?', 'El "por qué": valor de negocio']] },
        { t: 'callout', tone: 'tip', title: 'Formato', text: '**Como** (rol) **yo quiero** (algo) **para** (beneficiarme). Ej.: "Como bibliotecario de la institución quiero revisar el historial de préstamos para identificar los libros con mayor demanda para reponer".' },
        { t: 'p', text: 'Para comprender un caso de uso se **narran historias**: cómo se alcanza el objetivo y cómo se manejan los problemas. Los **casos de uso 2.0** (Ivar Jacobson) proponen narrativas más livianas: las historias ayudan a entender el caso de uso y a **implementarlo porción por porción**.' },
        { t: 'def', term: 'Épica', text: 'Historia de usuario **tan grande** que difícilmente se implemente en una iteración: hay que **desagregarla** en historias menores.' },
      ],
    },
    {
      title: '4. Criterio INVEST (Bill Wake, 2003)',
      blocks: [
        { t: 'table', head: ['Letra', 'Atributo', 'Significa'], rows: [
          ['I', 'Independiente', 'Autosuficiente, sin depender de otra historia'],
          ['N', 'Negociable', 'Puede cambiarse hasta que forme parte de una iteración'],
          ['V', 'Valorable', 'Entrega valor al cliente o usuario final'],
          ['E', 'Estimable', 'Siempre se debería poder estimar su esfuerzo'],
          ['S', 'Pequeña (Small)', 'Nunca tan grande que no pueda planificarse o priorizarse'],
          ['T', 'Comprobable (Testable)', 'Brinda la información necesaria para probar su desarrollo'],
        ] },
      ],
    },
  ],
  videos: [{ id: 'ch4-v1', title: 'Prototipos, mockups e historias de usuario', src: 'videos/ch4-prototipos-hu.mp4', poster: 'videos/ch4-prototipos-hu.jpg', minutes: 4, summary: 'Por qué prototipar, cuándo conviene, desventaja y beneficios; mockup; historias de usuario, épicas e INVEST con un ejercicio.' }],
  map: {
    width: 1000, height: 600,
    groups: { pro: { color: '#cfe3ff', label: 'Prototipación' }, hu: { color: '#c9f0d6', label: 'Historias de usuario' }, inv: { color: '#ffe3b3', label: 'INVEST' } },
    nodes: [
      { id: 'dcu', label: 'Diseño centrado en el usuario', x: 250, y: 60, group: 'pro', desc: 'Se revisan primero los aspectos visibles con los usuarios para obtener feedback y acordar requerimientos.' },
      { id: 'pro', label: 'Prototipo', x: 120, y: 200, group: 'pro', desc: 'Maqueta interactiva de las interfaces sistema–usuario.' },
      { id: 'mock', label: 'Mockup', x: 380, y: 200, group: 'pro', desc: 'Representación visual estática del diseño.' },
      { id: 'cuando', label: 'Conviene: req. cambiantes / dominio desconocido', x: 120, y: 340, group: 'pro', parent: 'pro', desc: 'También cuando el cliente no entrega una lista completa.' },
      { id: 'desv', label: 'Desventaja: tiempo incierto', x: 120, y: 460, group: 'pro', parent: 'pro', desc: 'No se sabe cuántas iteraciones harán falta.' },
      { id: 'ben', label: 'Beneficios (Gordon y Bieman)', x: 360, y: 400, group: 'pro', parent: 'pro', desc: 'Usabilidad, coherencia, diseño, mantenimiento, menos esfuerzo.' },
      { id: 'hu', label: 'Historia de usuario', x: 700, y: 140, group: 'hu', desc: 'Funcionalidad desde el punto de vista del usuario: Como… quiero… para…' },
      { id: 'q3', label: 'Quién · Qué · Para qué', x: 880, y: 230, group: 'hu', parent: 'hu', desc: 'Beneficiario, funcionalidad, valor de negocio.' },
      { id: 'epi', label: 'Épica', x: 560, y: 260, group: 'hu', parent: 'hu', desc: 'Historia demasiado grande: se divide.' },
      { id: 'cu2', label: 'Casos de uso 2.0', x: 700, y: 40, group: 'hu', desc: 'Jacobson: narrativas livianas; historias que implementan el CU por porciones.' },
      { id: 'inv', label: 'INVEST', x: 760, y: 400, group: 'inv', desc: 'Atributos de una buena historia (Bill Wake, 2003).' },
      { id: 'inv1', label: 'Independiente · Negociable · Valorable', x: 640, y: 520, group: 'inv', parent: 'inv', desc: 'No depende de otras; cambia hasta la iteración; aporta valor.' },
      { id: 'inv2', label: 'Estimable · Pequeña · Comprobable', x: 880, y: 520, group: 'inv', parent: 'inv', desc: 'Se estima; se planifica; se puede probar.' },
    ],
    edges: [
      { from: 'dcu', to: 'pro' }, { from: 'dcu', to: 'mock' }, { from: 'pro', to: 'cuando' }, { from: 'pro', to: 'desv' }, { from: 'pro', to: 'ben' },
      { from: 'cu2', to: 'hu', label: 'se narra con' }, { from: 'hu', to: 'q3' }, { from: 'hu', to: 'epi', label: 'si es grande' }, { from: 'hu', to: 'inv', label: 'se evalúa con' }, { from: 'inv', to: 'inv1' }, { from: 'inv', to: 'inv2' },
    ],
  },
  notebook: [
    { minutes: 2, prompt: 'Sin mirar: escribí las seis letras de **INVEST** con su significado en tres palabras cada una.', reference: 'Independiente (no depende de otra) · Negociable (cambia hasta la iteración) · Valorable (aporta valor) · Estimable (se estima el esfuerzo) · Pequeña/Small (planificable) · Comprobable/Testable (se puede probar).' },
    { minutes: 3, prompt: 'Redactá dos historias de usuario para la bicicletería del capítulo 1 (una para el cliente y otra para el dueño).', reference: 'Como cliente quiero alquilar una bicicleta por horas para moverme por la ciudad sin comprar una. · Como dueño quiero recibir un resumen semanal de alquileres para saber qué bicicletas rinden más.' },
    { minutes: 2, prompt: 'Dibujá una tabla de dos columnas: prototipo vs. mockup (qué es, qué muestra, para qué sirve).', reference: 'Prototipo: simula la interactividad; entradas/salidas; acordar requerimientos. Mockup: visual estático; estructura de la información y funciones; visualizar el diseño y pedir feedback.' },
  ],
  quiz: [
    { id: 'c4q1', type: 'mcq', level: 1, concept: 'Prototipo', exam: true, prompt: 'Un prototipo es…', options: ['Un modelo o maqueta que muestra las interfaces entre el sistema y el usuario y simula su interactividad', 'La versión final del sistema con datos reales', 'Un documento con la lista de requerimientos', 'Una prueba de rendimiento del sistema'], answer: 0, explain: 'Simula entradas, salidas y la interactividad buscando parecerse al sistema final.' },
    { id: 'c4q2', type: 'tf', level: 1, concept: 'Desventaja del prototipo', exam: true, prompt: 'La principal desventaja de desarrollar un prototipo es que no puede conocerse desde el comienzo cuánto tiempo llevará obtener un producto aceptable para el cliente.', answer: true, explain: 'No se sabe cuántas iteraciones de ida y vuelta serán necesarias.' },
    { id: 'c4q3', type: 'multi', level: 2, concept: 'Cuándo prototipar', exam: true, prompt: '¿En qué situaciones resulta especialmente útil un prototipo?', options: ['Requerimientos que cambian rápidamente', 'Cliente poco abierto a entregar una lista completa de requerimientos', 'Ni el cliente ni el equipo conocen bien el área de aplicación', 'Requerimientos totalmente estables y documentados', 'Cuando se necesita estimar exactamente el tiempo del proyecto'], answer: [0, 1, 2], explain: 'Son las tres situaciones que menciona la teoría; con requisitos estables no hace falta y el prototipo justamente dificulta estimar tiempos.' },
    { id: 'c4q4', type: 'mcq', level: 1, concept: 'Mockup', exam: true, prompt: '¿Qué caracteriza a un mockup?', options: ['Es una representación visual estática de un diseño', 'Simula toda la interactividad del sistema', 'Es código funcionando en producción', 'Es una historia de usuario con criterios de aceptación'], answer: 0, explain: 'Muestra estructura y contenidos en forma estática (un video = imagen con ícono de play).' },
    { id: 'c4q5', type: 'match', level: 1, concept: 'INVEST', exam: true, prompt: 'Relacioná cada atributo INVEST con su significado.', pairs: [['Independiente', 'No depende de ninguna otra historia'], ['Negociable', 'Puede cambiarse hasta que forme parte de una iteración'], ['Valorable', 'Entrega valor al usuario o cliente'], ['Estimable', 'Se puede estimar su esfuerzo'], ['Pequeña', 'Se puede planificar y priorizar'], ['Comprobable', 'Brinda información para probar su desarrollo']], explain: 'Criterio de Bill Wake (2003).' },
    { id: 'c4q6', type: 'fill', level: 2, concept: 'Historia de usuario', prompt: 'Completá el formato de una historia de usuario.', text: '{0} bibliotecario {1} revisar el historial de préstamos {2} identificar los libros con mayor demanda.', blanks: [{ options: ['Como', 'Si', 'Cuando'], answer: 0 }, { options: ['quiero', 'debo', 'puedo'], answer: 0 }, { options: ['para', 'porque', 'sin'], answer: 0 }], explain: 'Como (rol) quiero (algo) para (beneficio).' },
    { id: 'c4q7', type: 'mcq', level: 1, concept: 'Épica', exam: true, prompt: 'Una épica es…', options: ['Una historia de usuario tan grande que debe dividirse en historias menores', 'La historia más importante del proyecto', 'Un caso de uso con include y extend', 'Un prototipo de alta fidelidad'], answer: 0, explain: 'Difícilmente se implementa en una iteración, por eso se desagrega.' },
    { id: 'c4q8', type: 'mcq', level: 3, concept: 'INVEST', prompt: '"Como usuario quiero que el sistema sea fácil de usar." ¿Qué atributo INVEST incumple más claramente?', options: ['Comprobable', 'Independiente', 'Negociable', 'Valorable'], answer: 0, explain: '"Fácil de usar" no brinda información para probarlo: no hay criterio de verificación.' },
    { id: 'c4q9', type: 'multi', level: 1, concept: 'Beneficios del prototipo', exam: true, prompt: 'Según Gordon y Bieman (1995), ¿qué beneficios trae el prototipado?', options: ['Mejor usabilidad', 'Mayor coherencia entre necesidades y sistema', 'Diseño de mejor calidad', 'Mejor mantenimiento', 'Menor esfuerzo de desarrollo', 'Eliminación total de las pruebas'], answer: [0, 1, 2, 3, 4], explain: 'Las pruebas siguen siendo necesarias.' },
    { id: 'c4q10', type: 'tf', level: 2, concept: 'Casos de uso 2.0', prompt: 'Según los casos de uso 2.0, las historias de usuario permiten implementar un caso de uso porción por porción.', answer: true, explain: 'Jacobson propone narrativas livianas; cada historia captura una parte del caso de uso.' },
    { id: 'c4q11', type: 'order', level: 2, concept: 'Problema de los requisitos', prompt: 'Ordená la cadena causal que motiva el prototipado.', items: ['Comunicación deficiente entre usuario y analista', 'Requisitos incompletos, ambiguos o inconsistentes', 'Los errores se detectan tarde', 'El costo de corrección se multiplica'], explain: 'Por eso conviene acordar temprano con el usuario mediante prototipos.' },
    { id: 'c4q12', type: 'open', level: 3, concept: 'Historia de usuario', prompt: 'Escribí una historia de usuario para el servicio técnico (cliente que retira su aparato) y explicá por qué cumple INVEST.', model: 'Como cliente abonado quiero consultar si mi aparato ya fue reparado y su costo para retirarlo sin viajar en vano. Es independiente (no requiere otra), negociable, aporta valor al cliente, estimable, pequeña y comprobable (aparato reparado/no reparado y costo informado).', rubric: ['Usa el formato Como… quiero… para…', 'El rol es un actor externo (cliente)', 'El "para" expresa un beneficio real', 'Justifica al menos cuatro letras de INVEST'], explain: 'Formato y criterio de la teoría.' },
  ],
  mastery: [
    { id: 'c4m1', type: 'tf', level: 1, concept: 'Mockup', exam: true, prompt: 'El mockup simula la interactividad completa del sistema con los usuarios.', answer: false, explain: 'Es estático; quien simula la interactividad es el prototipo.' },
    { id: 'c4m2', type: 'mcq', level: 2, concept: 'INVEST', exam: true, prompt: 'Una historia que depende de que otra se haya implementado antes incumple…', options: ['Independiente', 'Estimable', 'Valorable', 'Comprobable'], answer: 0, explain: 'Debe ser autosuficiente.' },
    { id: 'c4m3', type: 'mcq', level: 1, concept: 'Historia de usuario', exam: true, prompt: 'Las tres preguntas que responde una historia de usuario son…', options: ['Quién es el beneficiario, qué se quiere hacer y cuál es el beneficio', 'Cuánto cuesta, cuándo se entrega y quién la programa', 'Qué pantalla, qué botón y qué color', 'Precondición, curso normal y postcondición'], answer: 0, explain: 'Beneficiario, funcionalidad y valor de negocio.' },
    { id: 'c4m4', type: 'multi', level: 2, concept: 'Pautas del prototipo', prompt: '¿Cuáles son pautas para desarrollar un prototipo?', options: ['Usar términos familiares para los usuarios', 'Obstaculizar acciones destructivas de datos', 'Mostrar el estado de ejecución de las funciones', 'Agrupar funciones de forma lógica', 'Usar la mayor cantidad posible de tecnicismos'], answer: [0, 1, 2, 3], explain: 'Los tecnicismos van contra la pauta de usar simbología familiar.' },
    { id: 'c4m5', type: 'tf', level: 2, concept: 'INVEST', prompt: 'Que una historia sea "negociable" significa que puede cambiarse hasta que forme parte de una iteración.', answer: true, explain: 'Definición de la teoría.' },
    { id: 'c4m6', type: 'mcq', level: 3, concept: 'Cuándo prototipar', prompt: 'Un cliente sabe exactamente lo que quiere, los requisitos están firmados y son estables. ¿Prototipar es lo más indicado para reducir riesgos?', options: ['No especialmente: el prototipo rinde más con requisitos cambiantes o dominio desconocido', 'Sí, siempre es obligatorio', 'Sí, porque permite estimar el tiempo con precisión', 'No, porque los prototipos están prohibidos con requisitos firmados'], answer: 0, explain: 'Las situaciones donde conviene son otras; además el prototipo dificulta estimar el tiempo.' },
  ],
  pitfalls: [
    { error: 'Confundir mockup (estático) con prototipo (interactivo).', fix: 'Mockup = imagen del diseño; prototipo = simula la interacción.' },
    { error: 'Decir que el prototipo permite estimar mejor el tiempo.', fix: 'Al revés: su desventaja es que el tiempo es incierto.' },
    { error: 'Historias sin beneficio ("Como usuario quiero un botón").', fix: 'Siempre el "para" con valor de negocio.' },
    { error: 'Escribir INVEST con "P" o "C".', fix: 'Letras en inglés: S = Small (Pequeña), T = Testable (Comprobable).' },
  ],
};
