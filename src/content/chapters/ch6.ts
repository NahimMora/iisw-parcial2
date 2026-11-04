import type { Chapter } from '../types';
import { META } from './stubs';

export const ch6: Chapter = {
  ...META[5],
  status: 'ready',
  prereq: [],
  outcome: 'Definir sistema y sistema de información, y clasificar un ejemplo nuevo como de tiempo real, distribuido o embebido justificando con al menos dos características.',
  intro: {
    hook: 'Un controlador de vuelo, un home banking y el reloj de un taxi son software… pero con exigencias muy distintas. Este capítulo enseña a **clasificarlos**.',
    why: 'La autoevaluación de la plataforma está **entera dedicada a este tema**: es un buen indicador del estilo de preguntas (verdadero/falso y opción múltiple).',
    evidence: [
      { level: 'PROBABLE', text: 'La autoevaluación "Sistemas de información" tiene 6 preguntas sobre distribuidos, tiempo real y embebidos.' },
    ],
  },
  theory: [
    {
      title: '1. Sistema y sistema de información',
      blocks: [
        { t: 'def', term: 'Sistema', text: 'Conjunto de elementos que se relacionan para alcanzar un fin.' },
        { t: 'def', term: 'Sistema de información', text: 'Según Schach, logra un **resultado empresarial**: recopila, manipula, almacena y crea reportes de información sobre las actividades del negocio para ayudar a la administración a manejar las operaciones.' },
        { t: 'p', text: 'Hay muchas clasificaciones; la materia se enfoca en **tiempo real, distribuidos y embebidos**.' },
      ],
    },
    {
      title: '2. Sistemas de tiempo real',
      blocks: [
        { t: 'list', items: [
          'Interactúan con el entorno de forma **rápida** y responden **en el tiempo dictado o especificado**.',
          'El intervalo entre entrada y salida suele ser **muy pequeño**.',
          'Su eficiencia depende de la **exactitud** de los resultados **y del momento** en que los entregan.',
          'Característica principal: la **predictibilidad**.',
          'Son más complejos de lo que parece: las interacciones entre componentes afectan el resultado temporal y cualquier cambio puede generar alteraciones impensadas.',
        ] },
        { t: 'table', head: ['Fases de diseño', ''], rows: [['1', 'Identificar todas las tareas y las restricciones temporales que deben cumplirse'], ['2', 'Codificar los programas que ejecutarán las tareas'], ['3', 'Medir el tiempo de cómputo de cada tarea y analizar la planificación']] },
        { t: 'list', items: ['Requieren técnicas de análisis, diseño y prueba poco usadas en otras áreas.', 'Se acoplan al mundo externo y operan en condiciones de rendimiento muy rigurosas.', 'Los afectan hardware, software, sistema operativo, requisitos y diseño.', 'Uso habitual: **control de entornos**, a veces con sensores.'] },
        { t: 'p', text: 'Elementos: integración y rendimiento, manejo de interrupciones, bases de datos de tiempo real, **sistemas operativos de tiempo real** (importan los procesos, no el usuario; ej. VxWorks, Solaris, Lynx OS), lenguajes de tiempo real, sincronización y comunicación de tareas.' },
      ],
    },
    {
      title: '3. Sistemas distribuidos',
      blocks: [
        { t: 'callout', tone: 'key', title: 'Sommerville (2005)', text: 'El procesamiento de información se distribuye sobre **varias computadoras** en vez de estar confinado a una única máquina. "En la actualidad, prácticamente todos los grandes sistemas informáticos son distribuidos."' },
        { t: 'p', text: 'Computadoras separadas físicamente, cada una con su hardware y software, conectadas por una red; se diseñan como **un sistema único con múltiples destinatarios**. El fallo de una no implica el fallo del sistema completo.' },
        { t: 'table', head: ['Ventaja', 'Detalle'], rows: [['Compartir recursos', 'Hardware y software: impresoras, discos'], ['Sistemas abiertos', 'Protocolos estándar: combinar equipos de distintos proveedores'], ['Concurrencia', 'Procesos concurrentes'], ['Escalabilidad', 'Nuevos recursos, según la red'], ['Tolerancia a fallos', 'Si falla una computadora no cae toda la red (servicio algo degradado)']] },
        { t: 'callout', tone: 'warn', title: 'Pruebas', evidence: 'PROBABLE', text: 'Probar sistemas distribuidos (p. ej. cliente-servidor) cuesta **más tiempo y dinero** que sistemas independientes: influyen la red, plataformas heterogéneas, etc. (tema de la autoevaluación).' },
      ],
    },
    {
      title: '4. Sistemas embebidos',
      blocks: [
        { t: 'list', items: [
          'Las funciones del software **no suelen estar a la vista** del usuario.',
          'Realizan **una o pocas funciones**, generalmente en **tiempo real**.',
          'Componentes en una **placa base**; pueden no parecer computadoras (reloj de taxi, microondas, reloj digital).',
          'Se suelen programar en **lenguaje ensamblador** sobre el microprocesador.',
          'Fabricación **masiva** para reducir costos; **procesador y memoria pequeños**.',
          'Un fallo en un elemento obliga a **reparar o reemplazar la placa** entera.',
          'Sus controladores pueden ser **más lentos** que los de una PC.',
        ] },
        { t: 'compare', left: 'Tiempo real', right: 'Embebido', rows: [['Se define por', 'Responder a tiempo, de forma predecible', 'Estar oculto en un dispositivo con pocas funciones'], ['Relación', 'Puede no ser embebido (control industrial en PC)', 'Generalmente es de tiempo real']] },
      ],
    },
  ],
  videos: [{ id: 'ch6-v1', title: 'Tiempo real, distribuidos y embebidos', src: 'videos/ch6-tipos-sistemas.mp4', poster: 'videos/ch6-tipos-sistemas.jpg', minutes: 3, summary: 'Definiciones, características, fases de diseño, ventajas y cómo distinguirlos.' }],
  map: {
    width: 1000, height: 600,
    groups: { b: { color: '#cfe3ff', label: 'Base' }, tr: { color: '#ffe3b3', label: 'Tiempo real' }, d: { color: '#e2dcfb', label: 'Distribuido' }, e: { color: '#c9f0d6', label: 'Embebido' } },
    nodes: [
      { id: 's', label: 'Sistema', x: 500, y: 50, group: 'b', desc: 'Elementos relacionados para alcanzar un fin.' },
      { id: 'si', label: 'Sistema de información (Schach)', x: 500, y: 150, group: 'b', desc: 'Recopila, manipula, almacena y reporta para un resultado empresarial.' },
      { id: 'tr', label: 'Tiempo real', x: 170, y: 290, group: 'tr', desc: 'Responde en el tiempo especificado; exactitud + momento.' },
      { id: 'pre', label: 'Predictibilidad', x: 90, y: 420, group: 'tr', parent: 'tr', desc: 'Característica principal.' },
      { id: 'fas', label: '3 fases: tareas → código → medir', x: 250, y: 520, group: 'tr', parent: 'tr', desc: 'Identificar tareas y restricciones, codificar, medir tiempos y planificar.' },
      { id: 'so', label: 'SO de tiempo real', x: 80, y: 540, group: 'tr', parent: 'tr', desc: 'Importan los procesos, no el usuario (VxWorks, Lynx OS).' },
      { id: 'd', label: 'Distribuido', x: 500, y: 300, group: 'd', desc: 'Procesamiento en varias computadoras en red (Sommerville).' },
      { id: 'dv', label: 'Ventajas: recursos · abiertos · concurrencia · escala · tolerancia', x: 500, y: 440, group: 'd', parent: 'd', desc: 'El fallo de una no tira el sistema.' },
      { id: 'dp', label: 'Pruebas más costosas', x: 500, y: 550, group: 'd', parent: 'd', desc: 'Más tiempo y costo que uno independiente.' },
      { id: 'e', label: 'Embebido', x: 830, y: 290, group: 'e', desc: 'Oculto en una placa; pocas funciones.' },
      { id: 'ec', label: 'Masivo · pequeño · placa entera · ensamblador', x: 840, y: 440, group: 'e', parent: 'e', desc: 'Bajo costo, recursos pequeños, reemplazo de placa, más lento.' },
    ],
    edges: [
      { from: 's', to: 'si' }, { from: 'si', to: 'tr' }, { from: 'si', to: 'd' }, { from: 'si', to: 'e' },
      { from: 'tr', to: 'pre' }, { from: 'tr', to: 'fas' }, { from: 'tr', to: 'so' }, { from: 'd', to: 'dv' }, { from: 'd', to: 'dp' }, { from: 'e', to: 'ec' },
      { from: 'e', to: 'tr', label: 'suele ser' },
    ],
  },
  notebook: [
    { minutes: 3, prompt: 'Hacé una tabla de tres columnas (tiempo real, distribuido, embebido) con definición, dos características y un ejemplo.', reference: 'TR: responde en el tiempo dictado; predictibilidad, exactitud + momento; control con sensores. Distribuido: procesamiento en varias computadoras en red; tolerancia a fallos, escalable; grandes sistemas actuales. Embebido: oculto en placa, pocas funciones; masivo, recursos pequeños; microondas.' },
    { minutes: 2, prompt: 'Clasificá y justificá: (a) el sistema de frenos ABS de un auto, (b) un home banking con servidores en varios países, (c) un termostato digital.', reference: '(a) Embebido y de tiempo real (oculto, una función, respuesta en tiempo estricto). (b) Distribuido (procesamiento en varias computadoras en red). (c) Embebido (oculto en una placa, pocas funciones; probablemente de tiempo real).' },
  ],
  quiz: [
    { id: 'c6q1', type: 'tf', level: 1, concept: 'Sistema', exam: true, prompt: 'Un sistema es un conjunto de elementos relacionados entre sí, con un objetivo o grupo de objetivos en común.', answer: true, explain: 'Definición base (también en la autoevaluación).' },
    { id: 'c6q2', type: 'mcq', level: 1, concept: 'Tiempo real', exam: true, prompt: 'La correctitud de los resultados y el tiempo de respuesta en que se brindan es más crítico para los…', options: ['Sistemas de tiempo real', 'Sistemas embebidos', 'Sistemas distribuidos', 'Sistemas de información administrativos'], answer: 0, explain: 'Su eficiencia depende de la exactitud y del momento de entrega.' },
    { id: 'c6q3', type: 'tf', level: 1, concept: 'Distribuidos', exam: true, prompt: 'Los sistemas distribuidos están casi fuera de uso en el mercado actual.', answer: false, explain: 'Sommerville: prácticamente todos los grandes sistemas informáticos son distribuidos.' },
    { id: 'c6q4', type: 'tf', level: 2, concept: 'Distribuidos', exam: true, prompt: 'El costo y el tiempo de las pruebas en sistemas distribuidos, como las arquitecturas cliente-servidor, es mayor que en sistemas independientes.', answer: true, explain: 'Intervienen la red y plataformas diversas.' },
    { id: 'c6q5', type: 'tf', level: 1, concept: 'Embebidos', exam: true, prompt: 'Un sistema embebido se emplea para controlar máquinas o equipos, puede ser un circuito integrado que forma parte del sistema y quedar oculto para quien lo usa, como en un reloj digital.', answer: true, explain: 'Funciones no visibles, placa, pocas funciones.' },
    { id: 'c6q6', type: 'mcq', level: 1, concept: 'Tiempo real', exam: true, prompt: '¿Cuál es la característica principal de los sistemas de tiempo real?', options: ['La predictibilidad', 'La portabilidad', 'La escalabilidad', 'La interfaz gráfica'], answer: 0, explain: 'Así lo indica la teoría.' },
    { id: 'c6q7', type: 'order', level: 2, concept: 'Tiempo real', exam: true, prompt: 'Ordená las fases de diseño de un sistema de tiempo real.', items: ['Identificar las tareas y sus restricciones temporales', 'Codificar los programas que ejecutan las tareas', 'Medir el tiempo de cómputo de cada tarea y analizar la planificación'], explain: 'Son las tres fases de la teoría.' },
    { id: 'c6q8', type: 'multi', level: 1, concept: 'Distribuidos', exam: true, prompt: '¿Cuáles son ventajas de los sistemas distribuidos?', options: ['Compartir hardware y software', 'Basarse en sistemas abiertos con protocolos estándar', 'Ejecutar procesos concurrentes', 'Escalabilidad', 'Mayor tolerancia a fallos', 'Pruebas más baratas que un sistema independiente'], answer: [0, 1, 2, 3, 4], explain: 'Las pruebas son más costosas, no más baratas.' },
    { id: 'c6q9', type: 'multi', level: 1, concept: 'Embebidos', exam: true, prompt: '¿Qué características tienen los sistemas embebidos?', options: ['Fabricación masiva para reducir costos', 'Procesador y memoria relativamente pequeños', 'Un fallo implica reparar o reemplazar la placa', 'Controladores posiblemente más lentos que una PC', 'Siempre tienen una interfaz gráfica compleja'], answer: [0, 1, 2, 3], explain: 'Sus funciones no suelen estar a la vista del usuario.' },
    { id: 'c6q10', type: 'mcq', level: 2, concept: 'Tiempo real', prompt: 'En los sistemas operativos de tiempo real, ¿qué tiene mayor importancia?', options: ['Los procesos', 'El usuario', 'La interfaz', 'El almacenamiento en la nube'], answer: 0, explain: 'En los SOTR no importa el usuario sino los procesos.' },
    { id: 'c6q11', type: 'match', level: 2, concept: 'Clasificar sistemas', prompt: 'Relacioná cada ejemplo con el tipo que mejor lo describe.', pairs: [['Reloj de un taxi', 'Embebido'], ['Sistema bancario con servidores en varias ciudades', 'Distribuido'], ['Control de una planta con sensores que debe reaccionar en milisegundos', 'Tiempo real']], explain: 'Embebido: oculto en placa. Distribuido: procesamiento en red. Tiempo real: respuesta en tiempo estricto.' },
    { id: 'c6q12', type: 'mcq', level: 1, concept: 'Sistema de información', exam: true, prompt: 'Según Schach, un sistema de información…', options: ['Recopila, manipula, almacena y reporta información de las actividades del negocio para ayudar a la administración', 'Controla dispositivos físicos en tiempo real', 'Es un conjunto de computadoras conectadas por red', 'Es software programado en ensamblador'], answer: 0, explain: 'Logra un resultado empresarial.' },
  ],
  mastery: [
    { id: 'c6m1', type: 'mcq', level: 2, concept: 'Clasificar sistemas', prompt: 'El controlador del airbag de un auto es, principalmente…', options: ['Embebido y de tiempo real', 'Distribuido', 'Un sistema de información administrativo', 'Ninguno de los anteriores'], answer: 0, explain: 'Oculto, una función, respuesta en tiempo estricto.' },
    { id: 'c6m2', type: 'tf', level: 2, concept: 'Distribuidos', exam: true, prompt: 'En un sistema distribuido, el fallo de una computadora implica necesariamente la caída de todo el sistema.', answer: false, explain: 'Tolerancia a fallos: puede seguir con un servicio algo degradado.' },
    { id: 'c6m3', type: 'tf', level: 1, concept: 'Embebidos', exam: true, prompt: 'Los sistemas embebidos suelen programarse en lenguaje ensamblador sobre el microprocesador.', answer: true, explain: 'Así lo indica la teoría.' },
    { id: 'c6m4', type: 'mcq', level: 2, concept: 'Tiempo real', prompt: 'Un sistema que da el resultado correcto pero un segundo tarde, en un contexto de tiempo real…', options: ['Es ineficiente: también importa el momento de entrega', 'Es eficiente porque el resultado es correcto', 'Se convierte en distribuido', 'Es un sistema embebido'], answer: 0, explain: 'La eficiencia incluye el tiempo de respuesta.' },
    { id: 'c6m5', type: 'mcq', level: 1, concept: 'Distribuidos', exam: true, prompt: 'Según Sommerville, en un sistema distribuido…', options: ['El procesamiento se distribuye sobre varias computadoras', 'Todo se procesa en una única máquina potente', 'El usuario no interviene nunca', 'No se usan protocolos estándar'], answer: 0, explain: 'Definición de Sommerville (2005).' },
    { id: 'c6m6', type: 'multi', level: 2, concept: 'Tiempo real', prompt: '¿Qué elementos componen un sistema de tiempo real?', options: ['Manejo de interrupciones', 'Bases de datos de tiempo real', 'Sistemas operativos de tiempo real', 'Sincronización y comunicación de tareas', 'Historias de usuario'], answer: [0, 1, 2, 3], explain: 'También integración y rendimiento, y lenguajes de tiempo real.' },
  ],
  pitfalls: [
    { error: 'Pensar que los distribuidos están en desuso.', fix: 'Casi todos los grandes sistemas actuales son distribuidos.' },
    { error: 'Creer que en tiempo real basta con el resultado correcto.', fix: 'Importa también el momento de entrega: predictibilidad.' },
    { error: 'Confundir embebido con tiempo real.', fix: 'Embebido = oculto en un dispositivo; suele ser de tiempo real, pero son criterios distintos.' },
    { error: 'Olvidar que las pruebas de distribuidos son más costosas.', fix: 'Red, plataformas y concurrencia aumentan tiempo y costo.' },
  ],
};
