import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CHAPTERS, getChapter, questionIndex } from '../content/registry';
import type { Chapter } from '../content/types';
import { ConceptMap } from '../components/ConceptMap';
import { Quiz } from '../components/Quiz';
import { EvidenceTag, Rich, TheoryBlocks } from '../components/Theory';
import { Diagram } from '../components/Diagrams';
import { QuestionView } from '../components/QuestionView';
import { chapterOf, update, useProgress } from '../lib/progress';
import { chapterMastery, chapterState, MASTERY_PASS } from '../lib/mastery';
import { emptyResponse } from '../lib/grading';
import TRANSCRIPTS_JSON from '../content/transcripts.json';

const TRANSCRIPTS = TRANSCRIPTS_JSON as Record<string, string[]>;

export const SECTIONS = [
  ['intro', 'Introducción'], ['teoria', 'Teoría'], ['video', 'Video'], ['mapa', 'Mapa conceptual'],
  ['cuaderno', 'Cuaderno'], ['ejercicios', 'Ejercicios'], ['correccion', 'Corrección'],
  ['errores', 'Errores frecuentes'], ['dominio', 'Comprobación de dominio'],
] as const;
type SectionId = (typeof SECTIONS)[number][0];

export function ChapterPage() {
  const { id = '', section } = useParams();
  const ch = getChapter(id);
  const nav = useNavigate();
  const p = useProgress();
  const sec = (SECTIONS.find((s) => s[0] === section)?.[0] ?? p.chapters[id]?.lastSection ?? 'intro') as SectionId;

  useEffect(() => {
    if (!ch || ch.status !== 'ready') return;
    update((d) => {
      const cp = chapterOf(d, ch.id);
      if (!cp.visited.includes(sec)) cp.visited.push(sec);
      cp.lastSection = sec; d.lastChapter = ch.id;
    });
    window.scrollTo({ top: 0 });
    document.querySelector('.tab.active')?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [ch, sec]);

  if (!ch) return <div className="page"><p>Capítulo inexistente. <Link to="/">Volver</Link></p></div>;
  if (ch.status !== 'ready') return (
    <div className="page"><div className="card"><h2>Capítulo {ch.num} · {ch.title}</h2><p className="badge building">En preparación</p><p>Este capítulo todavía se está produciendo. Aparecerá habilitado cuando su video, ejercicios y correcciones estén verificados.</p><Link className="btn" to="/">Volver al panel</Link></div></div>
  );

  const idx = SECTIONS.findIndex((s) => s[0] === sec);
  const go = (s: SectionId) => nav(`/capitulo/${ch.id}/${s}`);
  const cp = p.chapters[ch.id];
  const mastery = chapterMastery(ch, p);
  const next = CHAPTERS.find((c) => c.num === ch.num + 1);

  return (
    <div className="page chapter">
      <div className="ch-header">
        <div>
          <div className="crumbs"><Link to="/">Panel</Link> / Capítulo {ch.num}</div>
          <h1>{ch.num}. {ch.title}</h1>
          <div className="ch-meta">
            <span className={`kind ${ch.kind}`}>{ch.kind === 'practica' ? 'Práctica + teoría' : 'Teoría'}</span>
            <span>Prioridad {ch.priority}</span><span>Dificultad {ch.difficulty}/10</span>
            <span>~{ch.minutes.video + ch.minutes.practice} min</span>
            <span className={`state st-${chapterState(ch, p)}`}>{stateLabel(chapterState(ch, p))}</span>
          </div>
        </div>
        <div className="ch-mastery" title="Se calcula con ejercicios y comprobación de dominio; ver el video no suma.">
          <div className="ring" style={{ ['--v' as string]: mastery }}><span>{Math.round(mastery * 100)}%</span></div>
          <small>Dominio estimado</small>
        </div>
      </div>

      <nav className="tabs" aria-label="Secciones del capítulo">
        {SECTIONS.map(([sid, label], i) => (
          <button key={sid} type="button" className={`tab ${sid === sec ? 'active' : ''} ${cp?.visited.includes(sid) ? 'seen' : ''}`} onClick={() => go(sid)}>
            <span className="tab-n">{i + 1}</span>{label}
          </button>
        ))}
      </nav>

      <section className="section" data-section={sec}>
        {sec === 'intro' && <Intro ch={ch} />}
        {sec === 'teoria' && <TheorySection ch={ch} />}
        {sec === 'video' && <VideoSection ch={ch} />}
        {sec === 'mapa' && <><p className="lead">Síntesis visual de lo que viste. Usalo para repasar sin volver a ver el video.</p><ConceptMap spec={ch.map} /></>}
        {sec === 'cuaderno' && <Notebook ch={ch} />}
        {sec === 'ejercicios' && <><p className="lead">Empiezan por comprensión y avanzan hacia aplicación y evaluación. Respondé sin mirar la teoría; después presioná <b>Corregir</b>.</p>
          <Quiz key={`${ch.id}-quiz`} questions={ch.quiz} chapterFor={() => ch.id} mode="quiz" chapterId={ch.id} /></>}
        {sec === 'correccion' && <Correction ch={ch} />}
        {sec === 'errores' && <Pitfalls ch={ch} />}
        {sec === 'dominio' && <><p className="lead">Preguntas nuevas, sin pistas. Con <b>{Math.round(MASTERY_PASS * 100)} % o más</b> el capítulo queda dominado. Si no llegás, repasá la corrección y volvé a intentarlo.</p>
          <Quiz key={`${ch.id}-mastery`} questions={ch.mastery} chapterFor={() => ch.id} mode="mastery" chapterId={ch.id} /></>}
      </section>

      <div className="pager">
        {idx > 0 ? <button type="button" className="btn" onClick={() => go(SECTIONS[idx - 1][0])}>← {SECTIONS[idx - 1][1]}</button> : <span />}
        {idx < SECTIONS.length - 1 ? <button type="button" className="btn primary" onClick={() => go(SECTIONS[idx + 1][0])}>{SECTIONS[idx + 1][1]} →</button>
          : next ? <Link className="btn primary" to={`/capitulo/${next.id}`}>Capítulo {next.num} →</Link> : <Link className="btn primary" to="/simulacros">Ir a simulacros →</Link>}
      </div>
    </div>
  );
}

export function stateLabel(s: string) {
  return ({ nuevo: 'Sin empezar', 'en-curso': 'En curso', refuerzo: 'Necesita refuerzo', dominado: 'Dominado' } as Record<string, string>)[s] ?? s;
}

function Intro({ ch }: { ch: Chapter }) {
  return (
    <div className="intro">
      <p className="hook"><Rich text={ch.intro.hook} /></p>
      <div className="grid2">
        <div className="card"><h3>Objetivo</h3><p>{ch.objective}</p><h3>Por qué importa</h3><p><Rich text={ch.intro.why} /></p></div>
        <div className="card"><h3>Qué sabemos del examen</h3><ul className="evlist">{ch.intro.evidence.map((e, i) => <li key={i}><EvidenceTag level={e.level} /> <Rich text={e.text} /></li>)}</ul>
          <h3>Al terminar vas a poder…</h3><p>{ch.outcome}</p>
          {ch.prereq.length > 0 && <p className="hint">Requisitos previos: {ch.prereq.join(' · ')}</p>}</div>
      </div>
    </div>
  );
}

function TheorySection({ ch }: { ch: Chapter }) {
  const p = useProgress();
  return (
    <div>
      {ch.theory.map((s, i) => {
        const key = `${ch.id}:teoria:${i}`;
        const marked = p.bookmarks.includes(key);
        return (
          <div key={i} className="theory-sec card">
            <div className="theory-head"><h2>{s.title}</h2>
              <button type="button" className={`bm ${marked ? 'on' : ''}`} aria-pressed={marked} title="Marcador de estudio"
                onClick={() => update((d) => { d.bookmarks = marked ? d.bookmarks.filter((b) => b !== key) : [...d.bookmarks, key]; })}>{marked ? '★ Marcado' : '☆ Marcar'}</button>
            </div>
            <TheoryBlocks blocks={s.blocks} />
          </div>
        );
      })}
    </div>
  );
}

function VideoSection({ ch }: { ch: Chapter }) {
  const refs = useRef<Record<string, HTMLVideoElement | null>>({});
  const p = useProgress();
  return (
    <div>
      <p className="lead">Mirá el video con atención y pausalo cuando haga falta. <b>Ver el video no marca el capítulo como aprendido:</b> el dominio se mide con los ejercicios.</p>
      {ch.videos.map((v) => {
        const seen = p.chapters[ch.id]?.videoSeconds[v.id] ?? 0;
        return (
          <div key={v.id} className="video card">
            <h3>{v.title} <small>· {v.minutes} min</small></h3>
            <video ref={(el) => { refs.current[v.id] = el; }} controls preload="metadata" playsInline poster={v.poster ? `${import.meta.env.BASE_URL}${v.poster}` : undefined}
              src={`${import.meta.env.BASE_URL}${v.src}`} data-testid={`video-${v.id}`}
              onLoadedMetadata={(e) => { if (seen > 5 && seen < e.currentTarget.duration - 5) e.currentTarget.currentTime = seen; }}
              onTimeUpdate={(e) => {
                const t = Math.floor(e.currentTarget.currentTime);
                if (t % 5 === 0 && t !== seen) update((d) => { chapterOf(d, ch.id).videoSeconds[v.id] = t; });
              }} />
            <p className="hint mobile-only">📱 Girá el celular y usá pantalla completa para ver mejor el video.</p>
            {TRANSCRIPTS[v.id] && <details className="transcript"><summary>Ver transcripción de la narración</summary>{TRANSCRIPTS[v.id].map((t, i) => <p key={i}>{t}</p>)}</details>}
            <p className="hint">{v.summary}{seen > 5 ? ` · Retomás desde ${Math.floor(seen / 60)}:${String(seen % 60).padStart(2, '0')}` : ''}</p>
          </div>
        );
      })}
    </div>
  );
}

function Notebook({ ch }: { ch: Chapter }) {
  const p = useProgress();
  const [open, setOpen] = useState<Set<number>>(new Set());
  const done = p.chapters[ch.id]?.notebookDone ?? [];
  return (
    <div>
      <p className="lead">Cerrá el mapa y el video. Resolvé en tu cuaderno, <b>sin mirar</b>. Recién después revelá la referencia y comparala.</p>
      {ch.notebook.map((t, i) => (
        <div key={i} className="card notebook">
          <div className="nb-head"><span className="nb-time">⏱ {t.minutes} min</span>{done.includes(i) && <span className="badge ok">Hecha</span>}</div>
          <p className="nb-prompt"><Rich text={t.prompt} /></p>
          {!open.has(i) ? (
            <button type="button" className="btn" onClick={() => setOpen((s) => new Set(s).add(i))}>Ya lo intenté: revelar referencia</button>
          ) : (
            <div className="nb-ref">
              <p><b>Referencia:</b> <Rich text={t.reference} /></p>
              {t.refDiagram && <Diagram spec={t.refDiagram} />}
              {!done.includes(i) && <button type="button" className="btn primary small" onClick={() => update((d) => { const cp = chapterOf(d, ch.id); if (!cp.notebookDone.includes(i)) cp.notebookDone.push(i); })}>Marcar como hecha</button>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Correction({ ch }: { ch: Chapter }) {
  const p = useProgress();
  const cp = p.chapters[ch.id];
  const qi = questionIndex();
  const errs = Object.values(p.errors).filter((e) => e.chapter === ch.id && !e.resolved);
  const fmt = (s: number) => `${Math.round(s * 100)} %`;
  return (
    <div>
      <div className="grid2">
        <div className="card"><h3>Intentos de ejercicios</h3>{cp?.quiz.length ? <ul>{cp.quiz.slice(-6).map((a, i) => <li key={i}>{new Date(a.at).toLocaleString('es-AR')} — <b>{fmt(a.score)}</b> ({a.correct}/{a.total})</li>)}</ul> : <p className="hint">Todavía no corregiste los ejercicios.</p>}</div>
        <div className="card"><h3>Comprobaciones de dominio</h3>{cp?.mastery.length ? <ul>{cp.mastery.slice(-6).map((a, i) => <li key={i}>{new Date(a.at).toLocaleString('es-AR')} — <b>{fmt(a.score)}</b> ({a.correct}/{a.total})</li>)}</ul> : <p className="hint">Sin intentos.</p>}</div>
      </div>
      <h3>Preguntas que fallaste y todavía no resolviste ({errs.length})</h3>
      {errs.length === 0 && <p className="hint">Nada pendiente en este capítulo. Una pregunta queda resuelta al acertarla dos veces seguidas.</p>}
      {errs.map((e) => {
        const q = qi[e.qid]?.q; if (!q) return null;
        return <div key={e.qid} className="corr-item"><p className="hint">Concepto: {e.concept} · fallada {e.fails} {e.fails === 1 ? 'vez' : 'veces'}</p>
          <QuestionView q={q} index={0} r={emptyResponse(q)} onChange={() => { }} locked graded={{ score: 0, correct: false, answered: true, detail: [] }} /></div>;
      })}
      {errs.length > 0 && <Link className="btn primary" to={`/repaso?capitulo=${ch.id}`}>Reintentar mis errores de este capítulo</Link>}
    </div>
  );
}

function Pitfalls({ ch }: { ch: Chapter }) {
  const p = useProgress();
  const mine: Record<string, number> = {};
  Object.values(p.errors).filter((e) => e.chapter === ch.id && !e.resolved).forEach((e) => { mine[e.concept] = (mine[e.concept] ?? 0) + e.fails; });
  return (
    <div>
      <p className="lead">Los errores que más cuestan puntos en este tema y cómo reconocerlos en un problema nuevo.</p>
      <div className="pitfalls">{ch.pitfalls.map((x, i) => (
        <div key={i} className="pitfall card"><p className="pf-err">✘ <Rich text={x.error} /> {x.evidence && <EvidenceTag level={x.evidence} />}</p><p className="pf-fix">✔ <Rich text={x.fix} /></p></div>
      ))}</div>
      <h3>Tus conceptos con errores abiertos</h3>
      {Object.keys(mine).length === 0 ? <p className="hint">Sin errores abiertos.</p> : <ul>{Object.entries(mine).sort((a, b) => b[1] - a[1]).map(([c, n]) => <li key={c}>{c} — {n} fallo(s)</li>)}</ul>}
    </div>
  );
}
