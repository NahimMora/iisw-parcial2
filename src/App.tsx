import { HashRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { ChapterPage } from './pages/ChapterPage';
import { Review } from './pages/Review';
import { ProgressPage } from './pages/ProgressPage';
import { FEATURES } from './content/features';
import { Trainer } from './pages/Trainer';
import { Exams } from './pages/Exams';

export function App() {
  return (
    <HashRouter>
      <header className="topbar">
        <Link to="/" className="brand"><span className="logo">◇</span> IISW · 2º parcial</Link>
        <nav>
          <NavLink to="/" end>Panel</NavLink>
          <NavLink to="/repaso">Repaso</NavLink>
          {FEATURES.trainer && <NavLink to="/entrenador">Entrenador</NavLink>}
          {FEATURES.exams && <NavLink to="/simulacros">Simulacros</NavLink>}
          <NavLink to="/progreso">Progreso</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/capitulo/:id" element={<ChapterPage />} />
          <Route path="/capitulo/:id/:section" element={<ChapterPage />} />
          <Route path="/repaso" element={<Review />} />
          <Route path="/progreso" element={<ProgressPage />} />
          <Route path="/entrenador/*" element={FEATURES.trainer ? <Trainer /> : <Soon what="El entrenador de diagramas" />} />
          <Route path="/simulacros/*" element={FEATURES.exams ? <Exams /> : <Soon what="Los simulacros" />} />
          <Route path="*" element={<Soon what="Esta página" />} />
        </Routes>
      </main>
      <footer className="foot">Material de estudio original basado en la cursada de IISW (UP). No reemplaza ni reproduce el material de la cátedra. El progreso se guarda solo en este navegador.</footer>
    </HashRouter>
  );
}

function Soon({ what }: { what: string }) {
  return <div className="page"><div className="card"><h2>En preparación</h2><p>{what} todavía se está construyendo y se habilitará cuando esté verificado.</p><Link className="btn" to="/">Volver al panel</Link></div></div>;
}
