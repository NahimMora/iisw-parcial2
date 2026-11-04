import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CHAPTERS, getChapter, READY } from '../content/registry';
import { emptyProgress, exportJSON, importJSON, save, update, useProgress } from '../lib/progress';
import { chapterMastery, chapterState } from '../lib/mastery';
import { stateLabel } from './ChapterPage';

export function ProgressPage() {
  const p = useProgress();
  const [msg, setMsg] = useState('');
  const file = useRef<HTMLInputElement>(null);

  const download = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `progreso-iisw-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const onFile = async (f?: File) => {
    if (!f) return;
    const r = importJSON(await f.text());
    setMsg(r.msg);
  };

  return (
    <div className="page">
      <div className="crumbs"><Link to="/">Panel</Link> / Mi progreso</div>
      <h1>Mi progreso</h1>
      <div className="card">
        <h3>Capítulos</h3>
        <table className="tbl"><thead><tr><th>Capítulo</th><th>Estado</th><th>Dominio</th><th>Mejor nota ejercicios</th><th>Última comprobación</th></tr></thead>
          <tbody>{CHAPTERS.map((c) => {
            const cp = p.chapters[c.id];
            const best = cp?.quiz.reduce((m, a) => Math.max(m, a.score), 0) ?? 0;
            const last = cp?.mastery.length ? cp.mastery[cp.mastery.length - 1].score : undefined;
            return <tr key={c.id}><td>{c.num}. {c.title}</td><td>{c.status === 'ready' ? stateLabel(chapterState(c, p)) : 'En preparación'}</td>
              <td>{c.status === 'ready' ? `${Math.round(chapterMastery(c, p) * 100)} %` : '—'}</td><td>{cp?.quiz.length ? `${Math.round(best * 100)} %` : '—'}</td><td>{last !== undefined ? `${Math.round(last * 100)} %` : '—'}</td></tr>;
          })}</tbody></table>
      </div>
      <div className="card">
        <h3>Marcadores de estudio</h3>
        {p.bookmarks.length === 0 ? <p className="hint">Marcá secciones de teoría con ☆ para encontrarlas acá.</p> : (
          <ul>{p.bookmarks.map((b) => {
            const [cid, , i] = b.split(':'); const ch = getChapter(cid);
            if (!ch || ch.status !== 'ready') return null;
            return <li key={b}><Link to={`/capitulo/${cid}/teoria`}>Cap. {ch.num} · {ch.theory[+i]?.title}</Link> <button type="button" className="btn small ghost" onClick={() => update((d) => { d.bookmarks = d.bookmarks.filter((x) => x !== b); })}>quitar</button></li>;
          })}</ul>
        )}
      </div>
      <div className="card">
        <h3>Exportar / importar</h3>
        <p>El progreso se guarda <b>solo en este navegador</b> (almacenamiento local). GitHub Pages no sincroniza entre computadoras: si cambiás de equipo o navegador, exportá el archivo y luego importalo en el otro.</p>
        <div className="row">
          <button type="button" className="btn primary" onClick={download}>Exportar progreso (JSON)</button>
          <button type="button" className="btn" onClick={() => file.current?.click()}>Importar progreso…</button>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          <button type="button" className="btn ghost danger" onClick={() => { if (window.confirm('¿Borrar todo el progreso de este navegador?')) { save(emptyProgress()); setMsg('Progreso reiniciado.'); } }}>Reiniciar</button>
        </div>
        {msg && <p className="hint">{msg}</p>}
        <p className="hint">Última actualización: {new Date(p.updatedAt).toLocaleString('es-AR')} · {READY.length} capítulos disponibles · {Object.values(p.errors).filter((e) => !e.resolved).length} errores abiertos</p>
      </div>
    </div>
  );
}
