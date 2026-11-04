import type { Chapter } from '../types';
import { META } from './stubs';

export const ch5: Chapter = {
  ...META[4],
  status: 'ready',
  prereq: ['SRS y requerimientos (1er parcial)'],
  outcome: 'Distinguir validación de verificación, enumerar los 5 pasos de la aceptación, ubicar fases y tipos de prueba, explicar las direcciones de trazabilidad y las ideas del testing ágil.',
  intro: {
    hook: '¿Cómo sabemos que el sistema hace lo que el usuario necesita? Con **trazabilidad**, **aceptación**, **V&V** y una **estrategia de prueba**.',
    why: 'Concentra varias definiciones "de pregunta segura" (V&V de Boehm, fases de prueba, aceptación). Es un tema corto con alto rendimiento en la parte teórica.',
    evidence: [
      { level: 'PROBABLE', text: 'Bloque "Pruebas de los requerimientos" de la teoría nueva; formato típico verdadero/falso y opción múltiple.' },
      { level: 'COMPLEMENTARIO', text: 'La autoevaluación disponible relaciona pruebas con sistemas distribuidos (cap. 6).' },
    ],
  },
  theory: [
    {
      title: '1. Traza de requerimientos',
      blocks: [
        { t: 'p', text: 'Parte del **SRS**: si se establece claramente dónde se originó cada requerimiento, sirve para referenciarlo en las etapas futuras.' },
        { t: 'compare', left: 'Trazabilidad remota', right: 'Trazabilidad futura', rows: [
          ['Mira hacia', 'Las fases **previas** al desarrollo: el origen o fuente del requerimiento', 'Las fases **posteriores** del desarrollo'],
          ['Necesita', 'Registrar la fuente', 'Que cada requerimiento tenga un **nombre o referencia única**'],
          ['Cobra importancia', 'Cuando el software pasa a **operación y mantenimiento**: identificar qué requerimientos afecta un cambio', 'Durante diseño, código y pruebas'],
        ] },
        { t: 'table', head: ['Tipo', 'Qué permite'], rows: [
          ['Hacia atrás **desde** los requerimientos', 'Conocer **por qué** existe cada requerimiento del SRS'],
          ['Hacia adelante **hasta** los requerimientos', 'Que todos los documentos que **preceden** al SRS puedan referenciarse a él'],
          ['Hacia atrás **hasta** los requerimientos', 'Que cada **comportamiento del software** refiera explícitamente los requerimientos que satisface'],
          ['Hacia adelante **desde** los requerimientos', 'Entender qué **componentes del software** satisfacen cada requerimiento'],
        ] },
      ],
    },
    {
      title: '2. Revisión y aceptación',
      blocks: [
        { t: 'p', text: 'La **prueba de aceptación** la realizan los **usuarios** para verificar que el sistema se ajusta a sus requerimientos. Los casos de prueba se basan en la especificación: es una técnica de **caja negra**.' },
        { t: 'list', ordered: true, items: ['Determinar el rol del usuario.', 'Definir los criterios de aceptación.', 'Desarrollar un plan de aceptación.', 'Ejecutar el plan de aceptación.', 'Determinar decisiones de aceptación.'] },
        { t: 'p', text: 'Se lleva a cabo con **datos proporcionados por el cliente** (reales, no ficticios). Esa diferencia puede disparar errores del sistema o revelar errores en los requerimientos.' },
        { t: 'callout', tone: 'key', title: 'ISTQB', text: 'Pruebas **formales** respecto de las necesidades del usuario, los requisitos y los procesos de negocio, para determinar si el sistema cumple los **criterios de aceptación** y permitir que el usuario, cliente u otra entidad autorizada decida si **acepta o no** el sistema.' },
        { t: 'p', text: 'Las pruebas de aceptación **basadas en los requerimientos** son pruebas de **validación y no de búsqueda de defectos**: buscan demostrar que el sistema implementó correctamente lo establecido. Ej.: para "el usuario podrá consultar un producto indicando un dato", probar con un producto existente, uno inexistente y un dato que coincida con varios productos.' },
      ],
    },
    {
      title: '3. Validación y verificación (V&V)',
      blocks: [
        { t: 'compare', left: 'Validación', right: 'Verificación', rows: [
          ['Boehm (1979)', '¿Estamos construyendo **el producto correcto**?', '¿Estamos construyendo **el producto correctamente**?'],
          ['Compara', 'La especificación con lo que el usuario **necesita o espera**', 'El producto con la **especificación** previamente generada'],
          ['Implica', 'Que el **cliente valide el SRS** (sin errores ni inconsistencias)', 'Comprobar el software contra el SRS'],
        ], same: ['V&V = tarea de revisión y pruebas', 'Se aplica en cada etapa: requerimientos, diseño, código y producto final'] },
      ],
    },
    {
      title: '4. Estrategias de prueba',
      blocks: [
        { t: 'p', text: 'La estrategia define el **enfoque** y los **objetivos generales** de las pruebas: qué **fases** seguir y qué **clases de prueba** hacer en cada una, además de técnicas, herramientas y criterios de satisfacción y finalización. Se basa en lo definido en los requisitos.' },
        { t: 'table', head: ['Fase', 'Qué prueba'], rows: [
          ['**Unidad**', 'Un módulo o componente; generalmente lo hace **quien lo construyó**'],
          ['**Integración**', 'Grupos de módulos interconectados: detectar **fallos en la interacción**'],
          ['**Sistema**', 'El sistema en un **ambiente similar al real** (puede ser parte de un sistema mayor)'],
        ] },
        { t: 'p', text: 'Tipos de prueba que pueden ejecutarse: **recuperación, seguridad, resistencia o stress, rendimiento, aceptación y regresión**.' },
      ],
    },
    {
      title: '5. Testing ágil',
      blocks: [
        { t: 'p', text: 'Práctica de prueba en proyectos ágiles que incorpora técnicas como la **programación extrema (XP)**, trata el desarrollo como cliente de las pruebas y enfatiza el **diseño de prueba primero**: el equipo diseña las pruebas mientras analiza (ISTQB).' },
        { t: 'list', items: [
          'Comunicación continua: requisitos, pruebas y comportamiento esperado se definen en conjunto.',
          'Cada miembro posee varios roles; **todos tienen habilidades de probador** → desaparece la fase de pruebas de los métodos tradicionales.',
          'El probador ágil integra las necesidades del interesado y transforma historias de usuario en parámetros de prueba.',
          '**Factor de éxito**: automatizar las pruebas de **regresión**; también deberían automatizarse las de **aceptación**.',
        ] },
        { t: 'table', head: ['Rol', 'Descripción'], rows: [['Tester', 'Puede desempeñar varios roles; desarrolla y ejecuta pruebas'], ['Interesado', 'Persona o entidad que, apoyada en un analista, propone resolver un problema; elabora el discurso de los requisitos'], ['Equipo ágil', 'Expertos en software y en el dominio del negocio, trabajando hacia un fin en iteraciones cortas']] },
      ],
    },
  ],
  videos: [{ id: 'ch5-v1', title: 'Trazabilidad, aceptación, V&V y testing', src: 'videos/ch5-pruebas.mp4', poster: 'videos/ch5-pruebas.jpg', minutes: 5, summary: 'Direcciones de trazabilidad, 5 pasos de aceptación, Boehm, fases y tipos de prueba, testing ágil.' }],
  map: {
    width: 1040, height: 620,
    groups: { tr: { color: '#e2dcfb', label: 'Trazabilidad' }, ac: { color: '#c9f0d6', label: 'Aceptación' }, vv: { color: '#ffe3b3', label: 'V&V' }, es: { color: '#cfe3ff', label: 'Estrategia' }, ag: { color: '#f8d3dc', label: 'Ágil' } },
    nodes: [
      { id: 'srs', label: 'SRS', x: 520, y: 60, group: 'tr', desc: 'Especificación de requerimientos: punto de partida de la trazabilidad y de las pruebas.' },
      { id: 'rem', label: 'Remota: hacia el origen', x: 230, y: 70, group: 'tr', desc: 'Fases previas: fuente del requerimiento. Clave en mantenimiento.' },
      { id: 'fut', label: 'Futura: fases posteriores', x: 810, y: 70, group: 'tr', desc: 'Requiere id único por requerimiento.' },
      { id: 'acc', label: 'Prueba de aceptación', x: 170, y: 260, group: 'ac', desc: 'La hacen los usuarios; caja negra; datos reales.' },
      { id: 'pas', label: '5 pasos: rol · criterios · plan · ejecutar · decidir', x: 170, y: 400, group: 'ac', parent: 'acc', desc: 'Rol del usuario, criterios de aceptación, plan, ejecución, decisiones.' },
      { id: 'vv', label: 'V&V (Boehm)', x: 520, y: 240, group: 'vv', desc: 'Revisión y pruebas en cada etapa.' },
      { id: 'val', label: 'Validación: producto correcto', x: 420, y: 370, group: 'vv', parent: 'vv', desc: '¿Es lo que el usuario necesita? El cliente valida el SRS.' },
      { id: 'ver', label: 'Verificación: correctamente', x: 640, y: 370, group: 'vv', parent: 'vv', desc: '¿Cumple la especificación?' },
      { id: 'est', label: 'Estrategia de prueba', x: 860, y: 260, group: 'es', desc: 'Enfoque, objetivos, fases y tipos de prueba.' },
      { id: 'fas', label: 'Unidad → Integración → Sistema', x: 880, y: 400, group: 'es', parent: 'est', desc: 'Módulo; módulos interconectados; ambiente similar al real.' },
      { id: 'tip', label: 'Recuperación · seguridad · stress · rendimiento · aceptación · regresión', x: 860, y: 530, group: 'es', parent: 'est', desc: 'Tipos de prueba del sistema.' },
      { id: 'ag', label: 'Testing ágil', x: 520, y: 530, group: 'ag', desc: 'Prueba primero (XP), todos prueban, automatizar regresión y aceptación.' },
    ],
    edges: [
      { from: 'srs', to: 'rem' }, { from: 'srs', to: 'fut' }, { from: 'srs', to: 'acc', label: 'casos de prueba' }, { from: 'acc', to: 'pas' },
      { from: 'srs', to: 'vv' }, { from: 'vv', to: 'val' }, { from: 'vv', to: 'ver' }, { from: 'acc', to: 'val', label: 'es validación' },
      { from: 'srs', to: 'est', label: 'se basa en' }, { from: 'est', to: 'fas' }, { from: 'est', to: 'tip' }, { from: 'tip', to: 'ag', label: 'automatizar regresión' },
    ],
  },
  notebook: [
    { minutes: 2, prompt: 'Escribí de memoria la diferencia entre **validación** y **verificación** con las preguntas de Boehm y un ejemplo de cada una.', reference: 'Validación: ¿construimos el producto correcto? (el cliente revisa que el SRS refleje lo que necesita). Verificación: ¿lo construimos correctamente? (probar que el software cumple el SRS).' },
    { minutes: 2, prompt: 'Listá los **5 pasos** de la prueba de aceptación y dos características (quién la hace, qué datos usa).', reference: 'Rol del usuario, criterios de aceptación, plan de aceptación, ejecutar el plan, decisiones de aceptación. La hacen los usuarios, con datos reales, como caja negra.' },
    { minutes: 3, prompt: 'Dibujá un esquema con las **4 direcciones de trazabilidad** usando flechas entre "documentos previos", "SRS" y "software".', reference: 'Hacia atrás desde: SRS → por qué existe (origen). Hacia adelante hasta: documentos previos → SRS. Hacia atrás hasta: software → requerimiento que satisface. Hacia adelante desde: SRS → componentes que lo satisfacen.' },
  ],
  quiz: [
    { id: 'c5q1', type: 'match', level: 1, concept: 'V&V', exam: true, prompt: 'Relacioná según Boehm.', pairs: [['Validación', '¿Estamos construyendo el producto correcto?'], ['Verificación', '¿Estamos construyendo el producto correctamente?']], explain: 'Validación = lo que el usuario necesita; verificación = conformidad con la especificación.' },
    { id: 'c5q2', type: 'tf', level: 1, concept: 'Aceptación', exam: true, prompt: 'La prueba de aceptación es realizada por los usuarios y es una técnica de caja negra basada en la especificación de requerimientos.', answer: true, explain: 'Definición de la teoría.' },
    { id: 'c5q3', type: 'order', level: 1, concept: 'Aceptación', exam: true, prompt: 'Ordená los pasos de la prueba de aceptación.', items: ['Determinar el rol del usuario', 'Definir los criterios de aceptación', 'Desarrollar un plan de aceptación', 'Ejecutar el plan de aceptación', 'Determinar decisiones de aceptación'], explain: 'Rol → criterios → plan → ejecución → decisión.' },
    { id: 'c5q4', type: 'mcq', level: 2, concept: 'Aceptación', exam: true, prompt: 'Las pruebas de aceptación basadas en los requerimientos son…', options: ['Pruebas de validación, no de búsqueda de defectos', 'Pruebas de unidad hechas por el programador', 'Pruebas de stress con datos ficticios', 'Pruebas que reemplazan a la verificación'], answer: 0, explain: 'Buscan demostrar que el sistema implementó correctamente los requerimientos establecidos.' },
    { id: 'c5q5', type: 'match', level: 1, concept: 'Fases de prueba', exam: true, prompt: 'Relacioná cada fase con lo que prueba.', pairs: [['Unidad', 'Un módulo; lo suele probar quien lo construyó'], ['Integración', 'Grupos de módulos interconectados'], ['Sistema', 'El sistema en un ambiente similar al real']], explain: 'Las tres fases de la estrategia de prueba.' },
    { id: 'c5q6', type: 'mcq', level: 2, concept: 'Trazabilidad', exam: true, prompt: '¿Qué permite la trazabilidad "hacia atrás desde los requerimientos"?', options: ['Conocer por qué existe cada requerimiento del SRS', 'Saber qué componentes satisfacen cada requerimiento', 'Que cada comportamiento del software refiera el requerimiento que satisface', 'Probar la integración de módulos'], answer: 0, explain: 'Hacia atrás desde = hacia su origen.', why: { 1: 'Eso es hacia adelante desde los requerimientos.', 2: 'Eso es hacia atrás hasta los requerimientos.' } },
    { id: 'c5q7', type: 'tf', level: 2, concept: 'Trazabilidad', exam: true, prompt: 'Cuando el software pasa a ser operado y mantenido, la trazabilidad remota cobra más importancia.', answer: true, explain: 'Al modificar diseño o código hay que identificar los requerimientos afectados.' },
    { id: 'c5q8', type: 'multi', level: 1, concept: 'Tipos de prueba', exam: true, prompt: '¿Cuáles son tipos de prueba que pueden ejecutarse en el sistema según la teoría?', options: ['Recuperación', 'Seguridad', 'Resistencia o stress', 'Rendimiento', 'Regresión', 'Prototipación'], answer: [0, 1, 2, 3, 4], explain: 'Prototipación no es un tipo de prueba (también se menciona aceptación).' },
    { id: 'c5q9', type: 'mcq', level: 2, concept: 'Testing ágil', exam: true, prompt: 'Según la teoría, el factor de éxito del testing ágil es…', options: ['Automatizar las pruebas de regresión', 'Tener una fase de pruebas separada al final', 'Que solo el tester pruebe', 'Eliminar las pruebas de aceptación'], answer: 0, explain: 'Además deberían automatizarse las de aceptación. En ágil todos son probadores y desaparece la fase separada.' },
    { id: 'c5q10', type: 'tf', level: 2, concept: 'Testing ágil', prompt: 'En un equipo ágil, la fase de pruebas tradicional desaparece porque todos los miembros son probadores.', answer: true, explain: 'Es lo que plantea la teoría.' },
    { id: 'c5q11', type: 'fill', level: 2, concept: 'V&V', prompt: 'Completá.', text: 'La {0} demuestra que los requerimientos definidos corresponden a lo que el cliente necesita; por eso el cliente debe {1} el SRS. La {2} comprueba que el producto está de acuerdo con la especificación.', blanks: [{ options: ['validación', 'verificación', 'integración'], answer: 0 }, { options: ['validar', 'programar', 'ignorar'], answer: 0 }, { options: ['verificación', 'validación', 'trazabilidad'], answer: 0 }], explain: 'Definiciones de la teoría (Boehm).' },
    { id: 'c5q12', type: 'mcq', level: 3, concept: 'Aceptación', prompt: 'Requerimiento: "el usuario podrá consultar un producto indicando un dato". ¿Qué conjunto de pruebas de aceptación propone la teoría?', options: ['Producto existente, producto inexistente y dato que coincida con varios productos', 'Solo un producto existente', 'Probar el código de la función de búsqueda línea por línea', 'Medir el tiempo de respuesta con 10.000 usuarios'], answer: 0, explain: 'Cubren los comportamientos esperados desde la especificación (caja negra).' },
  ],
  mastery: [
    { id: 'c5m1', type: 'mcq', level: 2, concept: 'V&V', exam: true, prompt: 'Revisar con el cliente que el SRS refleje lo que realmente necesita es una actividad de…', options: ['Validación', 'Verificación', 'Prueba de unidad', 'Regresión'], answer: 0, explain: '¿Construimos el producto correcto?' },
    { id: 'c5m2', type: 'tf', level: 1, concept: 'Aceptación', exam: true, prompt: 'La prueba de aceptación se realiza con datos ficticios preparados por el equipo de desarrollo.', answer: false, explain: 'Se usan datos proporcionados por el cliente (reales).' },
    { id: 'c5m3', type: 'mcq', level: 1, concept: 'Fases de prueba', exam: true, prompt: 'La prueba que busca fallos en la interacción entre componentes es la de…', options: ['Integración', 'Unidad', 'Aceptación', 'Recuperación'], answer: 0, explain: 'Revisa grupos de módulos interconectados.' },
    { id: 'c5m4', type: 'mcq', level: 2, concept: 'Trazabilidad', prompt: 'La trazabilidad futura necesita, sobre todo, que…', options: ['Cada requerimiento tenga un nombre o referencia única', 'Los usuarios ejecuten el plan de aceptación', 'Se automatice la regresión', 'Se registre el costo de cada módulo'], answer: 0, explain: 'Para poder referenciarlo en fases posteriores.' },
    { id: 'c5m5', type: 'multi', level: 2, concept: 'Testing ágil', prompt: '¿Qué roles giran alrededor de la prueba ágil?', options: ['Tester', 'Interesado', 'Equipo ágil', 'Auditor externo obligatorio'], answer: [0, 1, 2], explain: 'Son los tres roles de la teoría.' },
    { id: 'c5m6', type: 'tf', level: 2, concept: 'Estrategia de prueba', prompt: 'La estrategia de prueba define el enfoque, los objetivos, las fases y las clases de prueba, basándose en lo definido en los requisitos.', answer: true, explain: 'También técnicas, herramientas y criterios de finalización.' },
  ],
  pitfalls: [
    { error: 'Invertir validación y verificación.', fix: 'Validación = producto Correcto (lo que necesita el usuario). Verificación = correctaMENTE (según el SRS).' },
    { error: 'Pensar que la aceptación la hace el desarrollador o con datos ficticios.', fix: 'La hacen los usuarios, con datos reales, caja negra.' },
    { error: 'Confundir las cuatro direcciones de trazabilidad.', fix: '"Desde" los requerimientos: parto del SRS. "Hasta" los requerimientos: llego al SRS.' },
    { error: 'Creer que en ágil hay una fase de pruebas final.', fix: 'Todos prueban; se automatizan regresión y aceptación.' },
  ],
};
