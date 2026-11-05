import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Question } from '../content/types';
import { CHAPTERS } from '../content/registry';
import {
  URG_ACTIVITY, URG_CASE_TEXT, URG_CHECKLIST, URG_CHEATSHEET, URG_CU1, URG_EXAM_FORMAT, URG_NFR, URG_OLD,
  URG_PRACTICE, URG_PROCESSES, URG_REQS, URG_SEQ, URG_UC,
} from '../content/urgente';
import { CUTable, Diagram } from '../components/Diagrams';
import { Rich } from '../components/Theory';
import { Zoomable } from '../components/Zoomable';
import { shuffledIndices } from '../lib/grading';

export interface UrgVideo { id: string; title: string; src: string; poster: string; minutes: number; summary: string }
export const URG_VIDEOS: UrgVideo[] = [
  { id: 'urg1', title: 'Práctico 1 · Requerimientos y procesos de negocio', src: 'videos/urg1-req-procesos.mp4', poster: 'videos/urg1-req-procesos.jpg', minutes: 4, summary: 'Cómo es el parcial, cómo sacar la lista de requerimientos y los procesos, y cómo graficar uno con un diagrama de actividad.' },
  { id: 'urg2', title: 'Práctico 2 · Casos de uso y descripción', src: 'videos/urg2-cu-descripcion.mp4', poster: 'videos/urg2-cu-descripcion.jpg', minutes: 5, summary: 'Actores, diagrama de casos de uso y descripción completa del CU "Registrar pedido de alquiler" en el formato de la cátedra.' },
  { id: 'urg3', title: 'Práctico 3 · Diagrama de secuencia', src: 'videos/urg3-secuencia.mp4', poster: 'videos/urg3-secuencia.jpg', minutes: 4, summary: 'El diagrama de secuencia del mismo CU, paso a paso, con interfaz, control y entidades.' },
  { id: 'urg4', title: 'Teoría express · lo que siempre toman', src: 'videos/urg4-teoria.mp4', poster: 'videos/urg4-teoria.jpg', minutes: 5, summary: 'Las afirmaciones V/F que más se repiten, y cómo justificarlas en dos líneas.' },
];
const READY_VIDEOS = new Set<string>([]);

const STEPS = [
  { id: 'formato', t: '1. Cómo es el parcial', min: 3 },
  { id: 'videos', t: '2. Videos del práctico', min: 18 },
  { id: 'solucion', t: '3. Solución modelo', min: 15 },
  { id: 'practica', t: '4. Práctico en choice', min: 15 },
  { id: 'viejos', t: '5. Preguntas de parciales viejos', min: 25 },
  { id: 'machete', t: '6. Machete de teoría', min: 10 },
  { id: 'resto', t: '7. Teoría que no viste (caps. 4–7)', min: 25 },
];

export function Urgente() {
  const resto = useMemo(() => CHAPTERS.filter((c) => c.num >= 4).flatMap((c) => [...c.quiz, ...c.mastery].filter((q) => q.type === 'mcq' || q.type === 'tf').map((q) => ({ q, ch: c.title }))), []);
  return (
    <div className="page urg">
      <section className="hero urg-hero">
        <p className="eyebrow">🚨 Modo urgente · 2 horas</p>
        <h1>Lo justo para aprobar el 2º parcial</h1>
        <p className="lead">Armado con los parciales de <b>2022, 2023 y 2025</b>. En 2023 y en 2025 el práctico fue <b>el mismo caso: alquiler de autos en Ezeiza</b>, así que lo resolvemos completo. Todo se practica con <b>opción múltiple</b> y, al tocar una respuesta, ves al instante por qué es así.</p>
        <ol className="urg-steps">
          {STEPS.map((s) => <li key={s.id}><a href={`#${s.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>{s.t}</a><span>{s.min}′</span></li>)}
        </ol>
      </section>

      <section id="formato" className="card urg-sec">
        <h2>1. Cómo es el parcial</h2>
        <div className="urg-grid">{URG_EXAM_FORMAT.map((f) => <div key={f.t} className="urg-tile"><b>{f.t}</b><p><Rich text={f.d} /></p></div>)}</div>
        <div className="callout warn"><div className="callout-title">Clave para la teoría</div><p>En los V/F <b>primero escribí "Verdadero" o "Falso"</b> y después una justificación de 1–2 líneas. Si no ponés V/F, o no justificás, la pregunta no cuenta. En cada pregunta de abajo te dejamos la justificación lista para escribir.</p></div>
      </section>

      <section id="videos" className="card urg-sec">
        <h2>2. Videos: cómo se resuelve cada parte del práctico</h2>
        <p className="lead">Miralos en orden. Si estás con el celular, giralo y ponelo en pantalla completa.</p>
        {URG_VIDEOS.map((v) => (
          <div key={v.id} className="urg-video">
            <h3>{v.title} <small className="hint">~{v.minutes} min</small></h3>
            {READY_VIDEOS.has(v.id)
              ? <video controls preload="metadata" playsInline poster={`${import.meta.env.BASE_URL}${v.poster}`} src={`${import.meta.env.BASE_URL}${v.src}`} data-testid={`video-${v.id}`} />
              : <div className="urg-pending">⏳ Este video se está renderizando y aparece acá en unos minutos. Mientras tanto, avanzá con la <a href="#solucion">solución modelo</a>.</div>}
            <p className="hint">{v.summary}</p>
          </div>
        ))}
      </section>

      <section id="solucion" className="card urg-sec">
        <h2>3. Solución modelo: alquiler de autos (Ezeiza)</h2>
        <details className="urg-case"><summary>Ver la narrativa (resumida)</summary><p>{URG_CASE_TEXT}</p></details>

        <h3>Paso 1 · Lista de requerimientos</h3>
        <p className="hint">Se lee la narrativa por párrafos. Cada proceso del negocio se convierte en <b>"El sistema debe gestionar…"</b>.</p>
        <ul className="urg-list">{URG_REQS.map((r) => <li key={r}>{r}</li>)}</ul>
        <p className="hint"><b>No funcionales</b> (si te los piden): {URG_NFR.join(' · ')}</p>

        <h3>Paso 2 · Procesos de negocio (y graficar uno)</h3>
        <div className="urg-grid">{URG_PROCESSES.map((p) => <div key={p.t} className="urg-tile"><b>{p.t}</b><p>{p.d}</p></div>)}</div>
        <p className="hint">Para "graficar uno" usá un <b>diagrama de actividad</b> con carriles:</p>
        <ActivityDiagram />

        <h3>Paso 3 · Diagrama de casos de uso</h3>
        <figure className="fig"><Diagram spec={URG_UC} /><figcaption>El <b>encargado no es actor</b>: atiende al cliente, así que es parte del sistema (criterio de la cátedra: se modela el negocio). El Gerente sí es actor porque inicia sus propios procesos.</figcaption></figure>

        <h3>Paso 3b · Descripción del CU (el que piden: registrar el pedido de alquiler)</h3>
        <figure className="fig"><CUTable desc={URG_CU1} /></figure>

        <h3>Paso 4 · Diagrama de secuencia del mismo CU</h3>
        <figure className="fig"><Diagram spec={URG_SEQ} /><figcaption>Mismo orden que la descripción: pedido → disponibilidad → [no hay] → cliente → [no registrado] → alquiler → vehículo no disponible → contrato.</figcaption></figure>

        <h3>Checklist antes de entregar</h3>
        <ul className="urg-check">{URG_CHECKLIST.map((c) => <li key={c}><Rich text={c} /></li>)}</ul>
      </section>

      <section id="practica" className="card urg-sec">
        <h2>4. El práctico en opción múltiple</h2>
        <p className="lead">Estas son las decisiones que tenés que tomar en la hoja. Elegí una respuesta y vas a ver al instante el porqué.</p>
        <InstantQuiz id="practica" items={URG_PRACTICE.map((q) => ({ q }))} />
      </section>

      <section id="viejos" className="card urg-sec">
        <h2>5. Preguntas de parciales anteriores</h2>
        <p className="lead">Son reformulaciones de lo que tomaron en 2022, 2023, 2025 y en la autoevaluación. En cada explicación tenés la <b>justificación lista para escribir</b>.</p>
        <InstantQuiz id="viejos" items={URG_OLD.map((q) => ({ q }))} />
      </section>

      <section id="machete" className="card urg-sec">
        <h2>6. Machete de teoría (leelo 2 veces)</h2>
        <div className="urg-cheat">{URG_CHEATSHEET.map((c) => <div key={c.t}><b>{c.t}</b><span><Rich text={c.d} /></span></div>)}</div>
      </section>

      <section id="resto" className="card urg-sec">
        <h2>7. Teoría que no viste: capítulos 4 a 7</h2>
        <p className="lead">Prototipos e historias de usuario, pruebas, tipos de sistemas, reingeniería y métodos formales: {resto.length} preguntas con explicación. Si te sobra tiempo, cada capítulo tiene su video en el <Link to="/">panel</Link>.</p>
        <InstantQuiz id="resto" items={resto.map(({ q, ch }) => ({ q, tag: ch }))} />
      </section>
    </div>
  );
}

function load(id: string): Record<string, number | boolean> {
  try { return JSON.parse(localStorage.getItem(`iisw2-urg-${id}`) ?? '{}'); } catch { return {}; }
}
function save(id: string, v: Record<string, number | boolean>) {
  try { localStorage.setItem(`iisw2-urg-${id}`, JSON.stringify(v)); } catch { /* sin almacenamiento */ }
}

function isRight(q: Question, v: number | boolean | undefined) {
  if (v === undefined) return false;
  return q.type === 'tf' ? v === q.answer : q.type === 'mcq' ? v === q.answer : false;
}

export function InstantQuiz({ id, items }: { id: string; items: { q: Question; tag?: string }[] }) {
  const [ans, setAns] = useState<Record<string, number | boolean>>(() => load(id));
  const done = items.filter(({ q }) => ans[q.id] !== undefined).length;
  const ok = items.filter(({ q }) => isRight(q, ans[q.id])).length;
  const pick = (qid: string, v: number | boolean) => setAns((a) => { if (a[qid] !== undefined) return a; const n = { ...a, [qid]: v }; save(id, n); return n; });
  const reset = () => { setAns({}); save(id, {}); };
  const retryWrong = () => setAns((a) => { const n = Object.fromEntries(Object.entries(a).filter(([k, v]) => { const it = items.find((x) => x.q.id === k); return it && isRight(it.q, v); })); save(id, n); return n; });
  return (
    <div className="iq">
      <div className="iq-bar">
        <span><b>{ok}</b> bien de <b>{done}</b> respondidas · {items.length} en total{done > 0 && <> · <b>{Math.round((ok / done) * 100)} %</b></>}</span>
        <span className="iq-actions">
          {done > ok && <button type="button" className="btn small" onClick={retryWrong}>Reintentar las que erré</button>}
          {done > 0 && <button type="button" className="btn small ghost" onClick={reset}>Empezar de nuevo</button>}
        </span>
      </div>
      {items.map(({ q, tag }, i) => <InstantQ key={q.id} q={q} n={i + 1} tag={tag} v={ans[q.id]} onPick={(v) => pick(q.id, v)} />)}
    </div>
  );
}

function InstantQ({ q, n, tag, v, onPick }: { q: Question; n: number; tag?: string; v: number | boolean | undefined; onPick: (v: number | boolean) => void }) {
  const answered = v !== undefined;
  const right = isRight(q, v);
  const opts: { label: string; value: number | boolean }[] = q.type === 'tf'
    ? [{ label: 'Verdadero', value: true }, { label: 'Falso', value: false }]
    : q.type === 'mcq' ? shuffledIndices(q.options.length, q.id + 'u').map((i) => ({ label: q.options[i], value: i })) : [];
  const correct = q.type === 'tf' || q.type === 'mcq' ? q.answer : undefined;
  return (
    <article className={`question iq-q ${answered ? (right ? 'ok' : 'bad') : ''}`} data-qid={q.id}>
      <header className="q-head"><span className="q-num">{n}</span><span className="q-type">{q.type === 'tf' ? 'Verdadero o falso' : 'Opción múltiple'}{tag ? ` · ${tag}` : ''}</span>
        {answered && <span className={`q-score ${right ? 'ok' : 'bad'}`}>{right ? '✔ Correcta' : '✘ Incorrecta'}</span>}</header>
      <p className="q-prompt"><Rich text={q.prompt} /></p>
      {q.diagram && <div className="q-diagram"><Diagram spec={q.diagram} /></div>}
      {q.cu && <div className="q-diagram"><CUTable desc={q.cu} /></div>}
      <div className={`opts ${q.type === 'tf' ? 'tf' : ''}`}>
        {opts.map((o) => {
          const cls = answered ? (o.value === correct ? 'right' : o.value === v ? 'wrong' : '') : '';
          return <button key={String(o.value)} type="button" className={`opt ${cls}`} disabled={answered} onClick={() => onPick(o.value)}>{o.label}</button>;
        })}
      </div>
      {answered && (
        <div className="q-feedback">
          {!right && q.type === 'mcq' && q.why?.[v as number] && <p className="q-detail">{q.why[v as number]}</p>}
          <p><b>Por qué:</b> <Rich text={q.explain} /></p>
        </div>
      )}
    </article>
  );
}

function ActivityDiagram() {
  const W = 620, laneW = W / 2, rowH = 74, top = 46;
  const steps = URG_ACTIVITY.steps;
  const H = top + steps.length * rowH + 10;
  const cx = (lane: number) => laneW * lane + laneW / 2;
  const cy = (i: number) => top + i * rowH + rowH / 2;
  return (
    <figure className="fig">
      <Zoomable w={W}>
        <svg viewBox={`0 0 ${W} ${H}`} className="diagram" role="img" aria-label="Diagrama de actividad del proceso de alquiler">
          <defs><marker id="act-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="currentColor" /></marker></defs>
          {URG_ACTIVITY.lanes.map((l, i) => (
            <g key={l}>
              <rect x={i * laneW + 1} y={1} width={laneW - 2} height={H - 2} fill="none" stroke="currentColor" strokeOpacity={0.35} />
              <text x={cx(i)} y={28} textAnchor="middle" fontWeight={700} fontSize={16} fill="currentColor">{l}</text>
            </g>
          ))}
          {steps.slice(1).map((s, k) => {
            const i = k + 1, a = steps[k];
            return <line key={i} x1={cx(a.lane)} y1={cy(k) + (a.kind === 'start' ? 10 : 20)} x2={cx(s.lane)} y2={cy(i) - (s.kind === 'end' ? 13 : 21)} stroke="currentColor" strokeWidth={1.6} markerEnd="url(#act-ah)" />;
          })}
          {steps.map((s, i) => {
            const x = cx(s.lane), y = cy(i);
            if (s.kind === 'start') return <circle key={i} cx={x} cy={y} r={10} fill="currentColor" />;
            if (s.kind === 'end') return <g key={i}><circle cx={x} cy={y} r={12} fill="none" stroke="currentColor" strokeWidth={2} /><circle cx={x} cy={y} r={7} fill="currentColor" /></g>;
            if (s.kind === 'dec') return (
              <g key={i}>
                <polygon points={`${x},${y - 21} ${x + 80},${y} ${x},${y + 21} ${x - 80},${y}`} fill="var(--paper)" stroke="#e0a030" strokeWidth={2} />
                <text x={x} y={y + 5} textAnchor="middle" fontSize={13} fill="currentColor">{s.t}</text>
                <text x={x + 8} y={y + 36} fontSize={12} fill="#2e9d5b">[sí]</text>
                {'no' in s && <><line x1={x - 80} y1={y} x2={laneW - 6} y2={y} stroke="currentColor" strokeWidth={1.4} markerEnd="url(#act-ah)" />
                  <text x={x - 100} y={y - 6} fontSize={12} fill="#d04545">[no]</text>
                  <text x={laneW - 12} y={y + 5} fontSize={12.5} fill="currentColor" textAnchor="end">{s.no}</text></>}
              </g>
            );
            return <g key={i}><rect x={x - 115} y={y - 20} width={230} height={40} rx={18} fill="none" stroke="#4f8ef7" strokeWidth={2} /><text x={x} y={y + 5} textAnchor="middle" fontSize={14} fill="currentColor">{s.t}</text></g>;
          })}
        </svg>
      </Zoomable>
      <figcaption>Inicio ● · actividades ▭ · decisión ◇ con guardas [sí]/[no] · fin ◉ · un carril por responsable.</figcaption>
    </figure>
  );
}
