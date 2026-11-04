import type { Chapter } from '../types';

type Meta = Pick<Chapter, 'id' | 'num' | 'title' | 'short' | 'kind' | 'difficulty' | 'priority' | 'minutes' | 'objective'>;

const meta: Meta[] = [
  { id: 'ch1', num: 1, title: 'Requerimientos y casos de uso', short: 'Lista de requerimientos, actores y diagrama de casos de uso', kind: 'practica', difficulty: 6, priority: 'MÁXIMA', minutes: { video: 7, practice: 25 }, objective: 'Pasar de una narrativa de negocio a la lista de requerimientos y al diagrama de casos de uso.' },
  { id: 'ch2', num: 2, title: 'Descripción de casos de uso', short: 'Cuadro descriptivo, curso normal y alternativas, include y extend', kind: 'practica', difficulty: 6, priority: 'MÁXIMA', minutes: { video: 6, practice: 25 }, objective: 'Completar el cuadro descriptivo de un caso de uso con el formato de la cátedra.' },
  { id: 'ch3', num: 3, title: 'Diagrama de secuencia', short: 'Interfaz, control y entidad; mensajes, condiciones e iteraciones', kind: 'practica', difficulty: 8, priority: 'MÁXIMA', minutes: { video: 10, practice: 40 }, objective: 'Transformar la descripción de un caso de uso en un diagrama de secuencia correcto.' },
  { id: 'ch4', num: 4, title: 'Prototipos, mockups e historias de usuario', short: 'Prototipación, mockups, historias de usuario, épicas e INVEST', kind: 'teoria', difficulty: 3, priority: 'ALTA', minutes: { video: 4, practice: 12 }, objective: 'Explicar prototipos y mockups y redactar historias de usuario que cumplan INVEST.' },
  { id: 'ch5', num: 5, title: 'Pruebas de requerimientos', short: 'Trazabilidad, aceptación, V&V, estrategias y testing ágil', kind: 'teoria', difficulty: 5, priority: 'ALTA', minutes: { video: 5, practice: 15 }, objective: 'Distinguir validación de verificación y ubicar cada tipo de prueba y de trazabilidad.' },
  { id: 'ch6', num: 6, title: 'Tipos de sistemas', short: 'Tiempo real, distribuidos y embebidos', kind: 'teoria', difficulty: 3, priority: 'ALTA', minutes: { video: 4, practice: 10 }, objective: 'Clasificar sistemas y justificar con sus características.' },
  { id: 'ch7', num: 7, title: 'Mantenimiento, reingeniería y métodos formales', short: 'Evolución del software, reingeniería y especificación formal', kind: 'teoria', difficulty: 4, priority: 'MEDIA', minutes: { video: 4, practice: 12 }, objective: 'Explicar mantenimiento vs reingeniería y las aproximaciones formales.' },
];

export const META = meta;

export const stubs: Chapter[] = meta.map((m) => ({
  ...m, status: 'building', prereq: [], outcome: '',
  intro: { hook: '', why: '', evidence: [] }, theory: [], videos: [],
  map: { width: 100, height: 100, groups: {}, nodes: [], edges: [] },
  notebook: [], quiz: [], mastery: [], pitfalls: [],
}));
