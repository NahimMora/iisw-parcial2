import type React from 'react';
import { HashRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Home } from './pages/Home';
import { ChapterPage } from './pages/ChapterPage';
import { Review } from './pages/Review';
import { ProgressPage } from './pages/ProgressPage';
import { FEATURES } from './content/features';
import { Trainer } from './pages/Trainer';
import { Exams } from './pages/Exams';
import { Urgente } from './pages/Urgente';

export function App() {
  return (
    <HashRouter>
      <header className="topbar">
        <Link to="/" className="brand"><span className="logo">◇</span> IISW · 2º parcial</Link>
        <nav className="mainnav" aria-label="Navegación principal">
          <NavLink to="/urgente" className="nav-urg"><i className="nav-ico">🚨</i>Urgente</NavLink>
          <NavLink to="/" end><i className="nav-ico">⌂</i>Panel</NavLink>
          <NavLink to="/repaso"><i className="nav-ico">↻</i>Repaso</NavLink>
          {FEATURES.trainer && <NavLink to="/entrenador"><i className="nav-ico">◆</i>Entrenar</NavLink>}
          {FEATURES.exams && <NavLink to="/simulacros"><i className="nav-ico">★</i>Simulacros</NavLink>}
          <NavLink to="/progreso"><i className="nav-ico">☰</i>Progreso</NavLink>
        </nav>
      </header>
      <main>
        <Guarded>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/urgente" element={<Urgente />} />
          <Route path="/capitulo/:id" element={<ChapterPage />} />
          <Route path="/capitulo/:id/:section" element={<ChapterPage />} />
          <Route path="/repaso" element={<Review />} />
          <Route path="/progreso" element={<ProgressPage />} />
          <Route path="/entrenador/*" element={FEATURES.trainer ? <Trainer /> : <Soon what="El entrenador de diagramas" />} />
          <Route path="/simulacros/*" element={FEATURES.exams ? <Exams /> : <Soon what="Los simulacros" />} />
          <Route path="*" element={<Soon what="Esta página" />} />
        </Routes>
        </Guarded>
      </main>
      <footer className="foot">Material de estudio original basado en la cursada de IISW (UP). No reemplaza ni reproduce el material de la cátedra. El progreso se guarda solo en este navegador.</footer>
    </HashRouter>
  );
}

function Soon({ what }: { what: string }) {
  return <div className="page"><div className="card"><h2>En preparación</h2><p>{what} todavía se está construyendo y se habilitará cuando esté verificado.</p><Link className="btn" to="/">Volver al panel</Link></div></div>;
}

function Guarded({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  return <ErrorBoundary resetKey={loc.pathname}>{children}</ErrorBoundary>;
}
