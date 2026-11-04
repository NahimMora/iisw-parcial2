import { Link } from 'react-router-dom';
import { CHAPTERS, EXAM_DATE, READY } from '../content/registry';
import { useProgress } from '../lib/progress';
import { chapterMastery, chapterState, remainingMinutes } from '../lib/mastery';
import { stateLabel } from './ChapterPage';
import { FEATURES } from '../content/features';

function daysLeft() {
  const now = new Date();
  const ex = new Date(`${EXAM_DATE}T08:00:00-03:00`);
  const h = Math.round((ex.getTime() - now.getTime()) / 36e5);
  if (h <= 0) return 'El parcial es hoy: se puede rendir de 8 a 20 h';
  return h < 48 ? `Faltan ~${h} h para la apertura (8:00)` : `Faltan ${Math.ceil(h / 24)} días`;
}

export function Home() {
  const p = useProgress();
  const total = CHAPTERS.length;
  const mastered = READY.filter((c) => chapterState(c, p) === 'dominado').length;
  const avg = READY.length ? READY.reduce((s, c) => s + chapterMastery(c, p), 0) / total : 0;
  const remaining = remainingMinutes(READY, p) + CHAPTERS.filter((c) => c.status !== 'ready').reduce((s, c) => s + c.minutes.video + c.minutes.practice, 0);
  const openErrors = Object.values(p.errors).filter((e) => !e.resolved).length;
  const cont = (p.lastChapter && READY.find((c) => c.id === p.lastChapter && chapterState(c, p) !== 'dominado'))
    ?? READY.find((c) => chapterState(c, p) !== 'dominado') ?? READY[0];

  return (
    <div className="page home">
      <section className="hero">
        <div>
          <p className="eyebrow">Introducción a la Ingeniería de Software · UP</p>
          <h1>Segundo parcial</h1>
          <p className="hero-date"><b>Jueves 5 de noviembre de 2026</b> · {daysLeft()}</p>
          <p className="hero-sum">Teoría (máx. 60 min, sin papel) + práctica en papel: <b>lista de requerimientos, diagrama de casos de uso, descripción de un caso de uso y su diagrama de secuencia</b>. Hace falta 60 % en cada herramienta.</p>
          <div className="hero-actions">
            {cont && <Link className="btn primary big" to={`/capitulo/${cont.id}`}>{p.lastChapter ? 'Continuar estudiando' : 'Empezar'} · Cap. {cont.num}</Link>}
            <Link className="btn" to="/repaso">Repasar mis errores{openErrors ? ` (${openErrors})` : ''}</Link>
          </div>
        </div>
        <div className="hero-stats">
          <Stat label="Progreso" value={`${Math.round((mastered / total) * 100)}%`} sub={`${mastered}/${total} capítulos dominados`} />
          <Stat label="Dominio estimado" value={`${Math.round(avg * 100)}%`} sub="según ejercicios y comprobaciones" />
          <Stat label="Tiempo restante" value={`${Math.floor(remaining / 60)} h ${remaining % 60} min`} sub="estimado para todo el recorrido" />
        </div>
      </section>

      <section>
        <h2>Ruta de estudio</h2>
        <p className="hint">Primero el núcleo práctico (1 → 3), que construye cada herramienta del parcial sobre la anterior; después la teoría (4 → 7); al final entrenador y simulacros.</p>
        <ol className="roadmap">
          {CHAPTERS.map((c) => {
            const st = c.status === 'ready' ? chapterState(c, p) : 'building';
            const m = c.status === 'ready' ? chapterMastery(c, p) : 0;
            return (
              <li key={c.id} className={`rm-item ${c.kind} st-${st}`}>
                <span className="rm-dot">{st === 'dominado' ? '✔' : c.num}</span>
                <div className="rm-body">
                  {c.status === 'ready' ? <Link to={`/capitulo/${c.id}`} className="rm-title">{c.title}</Link> : <span className="rm-title muted">{c.title}</span>}
                  <span className="rm-sub">{c.short}</span>
                  <span className="rm-meta">
                    <span className={`kind ${c.kind}`}>{c.kind === 'practica' ? 'Práctica' : 'Teoría'}</span>
                    <span>~{c.minutes.video + c.minutes.practice} min</span><span>Dif. {c.difficulty}/10</span><span>Prioridad {c.priority}</span>
                    {c.status === 'ready' ? <span className={`state st-${st}`}>{stateLabel(st)}</span> : <span className="badge building">En preparación</span>}
                  </span>
                  {c.status === 'ready' && <span className="rm-bar"><i style={{ width: `${Math.round(m * 100)}%` }} /></span>}
                </div>
              </li>
            );
          })}
          <li className={`rm-item extra ${FEATURES.trainer ? '' : 'st-building'}`}><span className="rm-dot">◆</span><div className="rm-body">
            {FEATURES.trainer ? <Link to="/entrenador" className="rm-title">Entrenador de diagramas</Link> : <span className="rm-title muted">Entrenador de diagramas</span>}
            <span className="rm-sub">5 niveles: observación → reconstrucción guiada → detección de errores → práctica semiguiada → resolución autónoma</span>
            {!FEATURES.trainer && <span className="rm-meta"><span className="badge building">En preparación</span></span>}</div></li>
          <li className={`rm-item extra ${FEATURES.exams ? '' : 'st-building'}`}><span className="rm-dot">★</span><div className="rm-body">
            {FEATURES.exams ? <Link to="/simulacros" className="rm-title">Simulacros teórico y práctico</Link> : <span className="rm-title muted">Simulacros teórico y práctico</span>}
            <span className="rm-sub">Con informe final de fortalezas, debilidades y qué repasar</span>
            {!FEATURES.exams && <span className="rm-meta"><span className="badge building">En preparación</span></span>}</div></li>
        </ol>
      </section>

      <section className="quick">
        <Link to="/repaso" className="card qlink"><b>Repaso de errores y adaptativo</b><span>{openErrors} pregunta(s) pendiente(s). Prioriza lo que más puntos te puede costar.</span></Link>
        {FEATURES.exams ? <Link to="/simulacros" className="card qlink"><b>Simulacros</b><span>Teórico cronometrado y práctico con rúbrica.</span></Link> : <div className="card qlink disabled"><b>Simulacros</b><span>En preparación.</span></div>}
        {FEATURES.trainer ? <Link to="/entrenador" className="card qlink"><b>Entrenamiento de diagramas</b><span>Casos de uso y secuencia, de la demostración a la resolución sin ayuda.</span></Link> : <div className="card qlink disabled"><b>Entrenamiento de diagramas</b><span>En preparación.</span></div>}
        <Link to="/progreso" className="card qlink"><b>Mi progreso</b><span>Marcadores, exportar o importar el progreso (JSON).</span></Link>
      </section>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return <div className="stat"><span className="stat-label">{label}</span><span className="stat-value">{value}</span><span className="stat-sub">{sub}</span></div>;
}
