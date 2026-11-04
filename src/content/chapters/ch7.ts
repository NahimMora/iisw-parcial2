import type { Chapter } from '../types';
import { META } from './stubs';

export const ch7: Chapter = {
  ...META[6],
  status: 'ready',
  prereq: [],
  outcome: 'Explicar evolución, mantenimiento y reingeniería (con sus ventajas) y describir los métodos formales: definición, por qué no se adoptaron, aproximaciones, lenguajes y puntos clave.',
  intro: {
    hook: 'El software no termina cuando se entrega: **evoluciona, se mantiene y a veces se reconstruye**. Y para sistemas críticos existe una forma matemática de especificarlo.',
    why: 'Bloque final de la teoría nueva. Pocas ideas, muy definibles: ideal para preguntas de verdadero/falso y para asociar lenguajes con aproximaciones.',
    evidence: [{ level: 'PROBABLE', text: 'Bloque "Reingeniería y métodos formales" de la teoría nueva.' }],
  },
  theory: [
    {
      title: '1. Evolución y mantenimiento',
      blocks: [
        { t: 'p', text: 'Una vez desarrollado, un sistema inevitablemente sufre **modificaciones para adaptarse a cambios del entorno** y seguir siendo útil. Las organizaciones dependen de esos sistemas y deben seguir invirtiendo en mantenerlos o evolucionarlos. Problema: si el sistema es útil se le pedirá que se adapte, y esa adaptación **degrada su estructura** en forma paulatina.' },
        { t: 'def', term: 'Mantenimiento', text: 'Cambiar algo del sistema **después de entregado** al cliente: desde corregir un error en una línea de código hasta corregir errores de diseño o incorporar nuevos requerimientos.' },
        { t: 'list', items: ['Costos **altos**: agregar funcionalidad con el sistema funcionando es mucho más caro que durante el desarrollo.', 'Introducir cambios **inevitablemente introduce defectos**.'] },
      ],
    },
    {
      title: '2. Reingeniería',
      blocks: [
        { t: 'p', text: 'Proceso mediante el cual se busca **mejorar un software existente**. Las sucesivas modificaciones hacen estragos en programas que quizá estaban optimizados; la reingeniería mejora su estructura y comprensión.' },
        { t: 'callout', tone: 'key', title: 'Sommerville', text: 'Puede implicar **redocumentar** el sistema, **organizarlo y reestructurarlo**, **traducirlo** a un lenguaje más moderno y **modificar y actualizar la estructura y valores de los datos**. Generalmente se hace **sin cambiar su funcionalidad ni su arquitectura**.' },
        { t: 'compare', left: 'Reingeniería', right: 'Sistema nuevo desde cero', rows: [['Riesgo', '**Menor**', 'Alto, sobre todo en sistemas críticos: un retraso puede causar daños severos'], ['Costo', '**Menor** (aunque tiene costo)', 'Siempre mayor']] },
      ],
    },
    {
      title: '3. Métodos formales',
      blocks: [
        { t: 'def', term: 'Métodos formales', text: 'Técnicas con **bases matemáticas** para describir las propiedades del sistema; dan marcos conceptuales para **especificar, desarrollar y verificar** sistemas de manera rigurosa y no ad hoc (Encyclopedia of Software Engineering).' },
        { t: 'p', text: 'En ingenierías como la electrónica o la civil se usan técnicas matemáticas; en software, aunque desde los 80 se los señaló como el camino para mejorar la calidad, **no se incorporaron a todos los desarrollos**:' },
        { t: 'list', items: ['Otras herramientas lograron avances en calidad: nuevas metodologías, lenguajes orientados a objetos, administración de configuraciones.', 'El mercado prioriza la **interfaz con el usuario** y los **desarrollos rápidos**, y las especificaciones formales no son aptas para ninguna de las dos.', 'Los métodos formales **no son escalables**: exitosos en aplicaciones críticas pequeñas; se descontrolan si el tamaño crece.'] },
      ],
    },
    {
      title: '4. Aproximaciones y lenguajes',
      blocks: [
        { t: 'compare', left: 'Algebraica', right: 'Basada en modelos', rows: [
          ['Idea', 'Describe el sistema mediante **operaciones y sus relaciones**', 'Construye un **modelo** con conjuntos y sucesiones; indica cómo cada operación **modifica el estado**'],
          ['Útil para', 'Especificar **interfaces** (clases de objetos, tipos abstractos de datos): **oculta el estado**', 'Mostrar el **estado** y simplificar el **comportamiento** con pre y postcondiciones'],
          ['Secuencial', 'Larch, OBJ', 'Z, VDM, B'],
          ['Concurrente', 'Lotos', 'CSP, redes de Petri'],
        ] },
        { t: 'callout', tone: 'key', title: 'Puntos clave', text: 'Complementan las especificaciones informales por ser **precisas y no ambiguas**; **fuerzan a analizar los requerimientos temprano**, cuando corregir es menos costoso; son excelentes para **sistemas críticos** donde se prioriza seguridad y confiabilidad.' },
      ],
    },
  ],
  videos: [{ id: 'ch7-v1', title: 'Mantenimiento, reingeniería y métodos formales', src: 'videos/ch7-reingenieria-formales.mp4', poster: 'videos/ch7-reingenieria-formales.jpg', minutes: 3, summary: 'Evolución y degradación, mantenimiento, reingeniería y por qué conviene, métodos formales, aproximaciones y lenguajes.' }],
  map: {
    width: 1000, height: 600,
    groups: { ev: { color: '#ffe3b3', label: 'Evolución' }, re: { color: '#c9f0d6', label: 'Reingeniería' }, mf: { color: '#cfe3ff', label: 'Métodos formales' } },
    nodes: [
      { id: 'ev', label: 'Evolución del software', x: 180, y: 60, group: 'ev', desc: 'Adaptarse al entorno cambiante para seguir siendo útil.' },
      { id: 'deg', label: 'Degradación de la estructura', x: 180, y: 180, group: 'ev', desc: 'Cada adaptación deteriora la estructura.' },
      { id: 'man', label: 'Mantenimiento', x: 60 + 80, y: 310, group: 'ev', desc: 'Cambios post-entrega; caro; introduce defectos.' },
      { id: 're', label: 'Reingeniería', x: 330, y: 310, group: 're', desc: 'Mejorar software existente sin cambiar funcionalidad ni arquitectura.' },
      { id: 'reac', label: 'Redocumentar · reestructurar · traducir · datos', x: 250, y: 450, group: 're', parent: 're', desc: 'Actividades según Sommerville.' },
      { id: 'repq', label: 'Menos riesgo y menos costo', x: 330, y: 560, group: 're', parent: 're', desc: 'Frente a desarrollar desde cero.' },
      { id: 'mf', label: 'Métodos formales', x: 720, y: 80, group: 'mf', desc: 'Bases matemáticas para especificar, desarrollar y verificar.' },
      { id: 'no', label: 'No adoptados: otras técnicas · UI y rapidez · no escalan', x: 720, y: 200, group: 'mf', parent: 'mf', desc: 'Tres razones de la teoría.' },
      { id: 'alg', label: 'Algebraica: Larch, OBJ · Lotos', x: 600, y: 360, group: 'mf', parent: 'mf', desc: 'Operaciones y relaciones; interfaces; oculta el estado.' },
      { id: 'mod', label: 'Modelos: Z, VDM, B · CSP, Petri', x: 860, y: 360, group: 'mf', parent: 'mf', desc: 'Conjuntos y sucesiones; estado; pre y postcondiciones.' },
      { id: 'pk', label: 'Precisos · análisis temprano · sistemas críticos', x: 730, y: 500, group: 'mf', parent: 'mf', desc: 'Puntos clave.' },
    ],
    edges: [
      { from: 'ev', to: 'deg', label: 'provoca' }, { from: 'deg', to: 'man' }, { from: 'deg', to: 're', label: 'se mejora con' }, { from: 're', to: 'reac' }, { from: 're', to: 'repq' },
      { from: 'mf', to: 'no' }, { from: 'mf', to: 'alg' }, { from: 'mf', to: 'mod' }, { from: 'mf', to: 'pk' },
    ],
  },
  notebook: [
    { minutes: 2, prompt: 'Explicá en tres líneas qué es la reingeniería, qué actividades incluye y por qué conviene frente a un sistema nuevo.', reference: 'Mejorar un software existente (redocumentar, reestructurar, traducir a un lenguaje moderno, actualizar datos) sin cambiar funcionalidad ni arquitectura. Conviene por menor riesgo y menor costo.' },
    { minutes: 2, prompt: 'Armá una tabla 2×2: aproximación (algebraica / modelos) × tipo de sistema (secuencial / concurrente) con sus lenguajes.', reference: 'Algebraica secuencial: Larch, OBJ. Algebraica concurrente: Lotos. Modelos secuencial: Z, VDM, B. Modelos concurrente: CSP, redes de Petri.' },
  ],
  quiz: [
    { id: 'c7q1', type: 'tf', level: 1, concept: 'Reingeniería', exam: true, prompt: 'La reingeniería generalmente se realiza sin cambiar la funcionalidad ni la arquitectura del sistema.', answer: true, explain: 'Busca mejorar estructura y comprensión.' },
    { id: 'c7q2', type: 'multi', level: 1, concept: 'Reingeniería', exam: true, prompt: 'Según Sommerville, la reingeniería puede implicar…', options: ['Redocumentar el sistema', 'Organizarlo y reestructurarlo', 'Traducirlo a un lenguaje más moderno', 'Modificar la estructura y valores de los datos', 'Agregar nuevos casos de uso de negocio'], answer: [0, 1, 2, 3], explain: 'No apunta a agregar funcionalidad.' },
    { id: 'c7q3', type: 'mcq', level: 1, concept: 'Reingeniería', exam: true, prompt: '¿Qué ventajas tiene la reingeniería frente a desarrollar un sistema completamente nuevo?', options: ['Menor riesgo y menor costo', 'Mayor funcionalidad y nueva arquitectura', 'Elimina la necesidad de mantenimiento', 'No tiene ningún costo'], answer: 0, explain: 'Tiene costo, pero siempre menor que un sistema nuevo; y reduce el riesgo en sistemas críticos.' },
    { id: 'c7q4', type: 'tf', level: 1, concept: 'Mantenimiento', exam: true, prompt: 'Incorporar una nueva funcionalidad durante el mantenimiento suele ser más barato que hacerlo durante el desarrollo.', answer: false, explain: 'Es mucho más costoso con el sistema funcionando, y además introduce defectos.' },
    { id: 'c7q5', type: 'mcq', level: 1, concept: 'Métodos formales', exam: true, prompt: 'Los métodos formales son…', options: ['Técnicas con bases matemáticas para describir propiedades del sistema', 'Reuniones formales con el cliente', 'Formularios estándar para documentar casos de uso', 'Pruebas de aceptación con datos reales'], answer: 0, explain: 'Permiten especificar, desarrollar y verificar en forma rigurosa.' },
    { id: 'c7q6', type: 'multi', level: 2, concept: 'Métodos formales', exam: true, prompt: '¿Por qué no se incorporaron los métodos formales a todos los desarrollos?', options: ['Otras técnicas lograron avances en calidad', 'El mercado prioriza la interfaz de usuario y la rapidez', 'No son escalables', 'Son ambiguos', 'No sirven para sistemas críticos'], answer: [0, 1, 2], explain: 'Son precisos y justamente ideales para sistemas críticos.' },
    { id: 'c7q7', type: 'match', level: 2, concept: 'Lenguajes formales', exam: true, prompt: 'Relacioná cada lenguaje con su aproximación.', pairs: [['Larch, OBJ', 'Algebraica secuencial'], ['Lotos', 'Algebraica concurrente'], ['Z, VDM, B', 'Basada en modelos secuencial'], ['CSP, redes de Petri', 'Basada en modelos concurrente']], explain: 'Tabla de la teoría.' },
    { id: 'c7q8', type: 'mcq', level: 2, concept: 'Aproximaciones formales', exam: true, prompt: 'La aproximación basada en modelos…', options: ['Usa construcciones como conjuntos y sucesiones e indica cómo las operaciones modifican el estado', 'Describe el sistema solo con operaciones y relaciones, ocultando el estado', 'Se usa solo para interfaces gráficas', 'No admite pre ni postcondiciones'], answer: 0, explain: 'Muestra el estado; se basa en pre y postcondiciones.', why: { 1: 'Esa es la algebraica.' } },
    { id: 'c7q9', type: 'tf', level: 2, concept: 'Aproximaciones formales', prompt: 'Las especificaciones algebraicas son útiles para especificar interfaces porque ocultan el estado y se basan en las relaciones entre operaciones.', answer: true, explain: 'Interfaces como conjuntos de clases o tipos abstractos de datos.' },
    { id: 'c7q10', type: 'multi', level: 1, concept: 'Métodos formales', exam: true, prompt: '¿Cuáles son puntos clave de los métodos de especificación formal?', options: ['Complementan las especificaciones informales por ser precisos y no ambiguos', 'Fuerzan a analizar los requerimientos en una etapa inicial', 'Son excelentes para sistemas críticos', 'Reemplazan completamente a las pruebas'], answer: [0, 1, 2], explain: 'No reemplazan las pruebas.' },
    { id: 'c7q11', type: 'fill', level: 2, concept: 'Evolución', prompt: 'Completá.', text: 'Si un sistema es útil se le pide que se {0} al entorno cambiante, pero esa adaptación hace que su estructura se {1}. Para mejorarla puede aplicarse {2}.', blanks: [{ options: ['adapte', 'elimine', 'congele'], answer: 0 }, { options: ['degrade', 'optimice', 'duplique'], answer: 0 }, { options: ['reingeniería', 'prototipación', 'prueba de aceptación'], answer: 0 }], explain: 'Evolución → degradación → reingeniería.' },
  ],
  mastery: [
    { id: 'c7m1', type: 'mcq', level: 2, concept: 'Lenguajes formales', exam: true, prompt: 'VDM pertenece a la aproximación…', options: ['Basada en modelos, sistemas secuenciales', 'Algebraica, sistemas concurrentes', 'Basada en modelos, sistemas concurrentes', 'Algebraica, sistemas secuenciales'], answer: 0, explain: 'Z, VDM y B: modelos secuenciales.' },
    { id: 'c7m2', type: 'tf', level: 1, concept: 'Métodos formales', exam: true, prompt: 'Los métodos formales son fácilmente escalables a sistemas de gran tamaño.', answer: false, explain: 'No son escalables: se descontrolan cuando el tamaño crece.' },
    { id: 'c7m3', type: 'mcq', level: 1, concept: 'Mantenimiento', exam: true, prompt: 'El mantenimiento refiere a…', options: ['Cambiar algo del sistema después de haberlo entregado al cliente', 'Las pruebas previas a la entrega', 'La redacción del SRS', 'El diseño de prototipos'], answer: 0, explain: 'Desde corregir una línea hasta nuevos requerimientos.' },
    { id: 'c7m4', type: 'mcq', level: 2, concept: 'Lenguajes formales', prompt: 'Las redes de Petri corresponden a la aproximación…', options: ['Basada en modelos, concurrente', 'Algebraica, secuencial', 'Algebraica, concurrente', 'Basada en modelos, secuencial'], answer: 0, explain: 'CSP y redes de Petri: modelos concurrentes.' },
    { id: 'c7m5', type: 'tf', level: 2, concept: 'Mantenimiento', prompt: 'Introducir cambios o nuevas funcionalidades en un sistema inevitablemente introduce defectos en él.', answer: true, explain: 'Afirmación de la teoría.' },
    { id: 'c7m6', type: 'mcq', level: 3, concept: 'Reingeniería', prompt: 'Una empresa depende de un sistema crítico viejo y difícil de mantener. ¿Qué argumento de la teoría apoya la reingeniería en lugar de reemplazarlo?', options: ['Disminuye el riesgo de un retraso que podría causar daños severos y cuesta menos', 'Permite cambiar toda la arquitectura sin costo', 'Elimina la necesidad de documentar', 'Garantiza que no aparezcan defectos'], answer: 0, explain: 'Menor riesgo y menor costo.' },
  ],
  pitfalls: [
    { error: 'Creer que la reingeniería agrega funcionalidad o cambia la arquitectura.', fix: 'Generalmente las mantiene; mejora estructura y comprensión.' },
    { error: 'Asignar Z o VDM a la aproximación algebraica.', fix: 'Algebraica: Larch, OBJ, Lotos. Modelos: Z, VDM, B, CSP, Petri.' },
    { error: 'Pensar que los formales no se usan por ser imprecisos.', fix: 'Son precisos; no se adoptan por escalabilidad, rapidez/UI y otras técnicas.' },
  ],
};
