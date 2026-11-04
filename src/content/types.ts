// Tipos de contenido de la plataforma. Todo capítulo se describe con datos;
// la UI no se modifica al agregar capítulos.

export type Evidence = 'CONFIRMADO' | 'PROBABLE' | 'COMPLEMENTARIO';

// ---------- Diagramas (usados en teoría, preguntas, entrenador y soluciones) ----------
export interface UCActor { id: string; name: string; side: 'left' | 'right'; y?: number; x?: number }
export interface UCCase { id: string; name: string }
export interface UCLink { actor: string; uc: string; mark?: 'bad' | 'num'; num?: number }
export interface UCRel { from: string; to: string; kind: 'include' | 'extend' }
export interface UseCaseDiagramSpec {
  kind: 'usecase';
  system: string;
  actors: UCActor[];
  cases: UCCase[];
  links: UCLink[];
  rels?: UCRel[];
  generalizations?: { child: string; parent: string }[];
  /** actores dibujados (erróneamente) dentro de la frontera — para ejercicios de error */
  insideActors?: string[];
  numbered?: boolean;
}

export type Stereo = 'actor' | 'interface' | 'control' | 'entity';
export interface SeqParticipant { id: string; name: string; kind: Stereo }
export interface SeqMessage {
  from: string; to: string; label: string;
  cond?: string; iter?: boolean; reply?: boolean;
}
export interface SequenceDiagramSpec {
  kind: 'sequence';
  participants: SeqParticipant[];
  messages: SeqMessage[];
  numbered?: boolean;
  activations?: boolean;
}

export interface CUDescription {
  id: string; name: string; actors: string; objective: string;
  pre: string; post: string;
  normal: string[];          // pasos (las reglas R1 van como líneas que empiezan con "R")
  alternatives: string[];    // p. ej. "2.1 Socio tiene un retiro sin devolución"
}

export type DiagramSpec = UseCaseDiagramSpec | SequenceDiagramSpec;

// ---------- Teoría ----------
export type TheoryBlock =
  | { t: 'h'; text: string }
  | { t: 'p'; text: string }
  | { t: 'list'; items: string[]; ordered?: boolean }
  | { t: 'def'; term: string; text: string }
  | { t: 'callout'; tone: 'key' | 'warn' | 'teacher' | 'tip'; title?: string; text: string; evidence?: Evidence }
  | { t: 'table'; head: string[]; rows: string[][] }
  | { t: 'figure'; diagram: DiagramSpec; caption: string }
  | { t: 'cu'; desc: CUDescription; caption?: string }
  | { t: 'compare'; left: string; right: string; rows: [string, string, string][]; same?: string[] };

// ---------- Mapa conceptual ----------
export interface MapNode { id: string; label: string; x: number; y: number; group: string; desc: string; parent?: string }
export interface MapEdge { from: string; to: string; label?: string }
export interface ConceptMapSpec {
  width: number; height: number;
  groups: Record<string, { color: string; label: string }>;
  nodes: MapNode[]; edges: MapEdge[];
}

// ---------- Preguntas ----------
interface QBase {
  id: string;
  concept: string;          // concepto que mide (para banco de errores y repaso)
  level: 1 | 2 | 3;         // 1 comprensión · 2 aplicación · 3 evaluación
  prompt: string;
  explain: string;          // razonamiento correcto
  diagram?: DiagramSpec;    // contexto gráfico opcional
  cu?: CUDescription;       // contexto de descripción opcional
  exam?: boolean;           // elegible para simulacro teórico
}
export interface QMCQ extends QBase { type: 'mcq'; options: string[]; answer: number; why?: Record<number, string> }
export interface QMulti extends QBase { type: 'multi'; options: string[]; answer: number[]; why?: Record<number, string> }
export interface QTF extends QBase { type: 'tf'; answer: boolean }
export interface QMatch extends QBase { type: 'match'; pairs: [string, string][] }
export interface QOrder extends QBase { type: 'order'; items: string[] }   // items en orden correcto
export interface QFill extends QBase { type: 'fill'; text: string; blanks: { options: string[]; answer: number }[] } // "{0}" marca huecos
export interface QOpen extends QBase { type: 'open'; model: string; rubric: string[] }
export type Question = QMCQ | QMulti | QTF | QMatch | QOrder | QFill | QOpen;

export type Response =
  | { type: 'mcq'; value: number | null }
  | { type: 'multi'; value: number[] }
  | { type: 'tf'; value: boolean | null }
  | { type: 'match'; value: (number | null)[] }   // índice de la derecha elegido para cada izquierda
  | { type: 'order'; value: number[] }            // permutación de índices de items
  | { type: 'fill'; value: (number | null)[] }
  | { type: 'open'; value: { text: string; checks: boolean[]; revealed: boolean } };

export interface Grade { score: number; correct: boolean; answered: boolean; detail: string[] }

// ---------- Capítulo ----------
export interface NotebookTask { prompt: string; minutes: number; reference: string; refDiagram?: DiagramSpec }
export interface VideoRef { id: string; title: string; src: string; poster?: string; minutes: number; summary: string }

export interface Chapter {
  id: string;               // "ch1"
  num: number;
  title: string;
  short: string;
  kind: 'practica' | 'teoria';
  status: 'ready' | 'building';
  difficulty: number;       // 1..10
  priority: 'MÁXIMA' | 'ALTA' | 'MEDIA';
  minutes: { video: number; practice: number };
  prereq: string[];
  objective: string;
  outcome: string;
  intro: { hook: string; why: string; evidence: { text: string; level: Evidence }[] };
  theory: { title: string; blocks: TheoryBlock[] }[];
  videos: VideoRef[];
  map: ConceptMapSpec;
  notebook: NotebookTask[];
  quiz: Question[];
  mastery: Question[];
  pitfalls: { error: string; fix: string; evidence?: Evidence }[];
}
