import React from 'react';
import { Actor, C, Card, Check, Cross, Heading, Ln, Rect, Scene, Stage, Txt, UC, Video, useT, type Timing } from '../../engine/engine';
import timing from './timing.json';

const T = timing as Timing;
export const ch2Timing = T;

interface Row { k: string; v: string; p: number; glow?: string }
function Board({ x, y, w, title, rows, steps, alts, size = 21 }: { x: number; y: number; w: number; title?: string; rows: Row[]; steps: { n?: string; t: string; p: number; who?: 'a' | 's' | 'r'; glow?: boolean; strike?: boolean }[]; alts: { t: string; p: number; glow?: boolean }[]; size?: number }) {
  const col = (who?: string) => (who === 'a' ? C.actor : who === 'r' ? C.warn : C.iface);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, fontSize: size, border: `2px solid ${C.line}`, borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,.03)' }}>
      {title && <div style={{ padding: '6px 14px', background: 'rgba(110,168,255,.12)', fontWeight: 800, color: C.iface }}>{title}</div>}
      {rows.map((r) => (
        <div key={r.k} style={{ display: 'grid', gridTemplateColumns: '190px 1fr', borderTop: `1px solid ${C.line}`, opacity: Math.max(0.0, r.p), background: r.glow ? `${r.glow}22` : undefined }}>
          <div style={{ padding: '5px 14px', color: C.muted, fontWeight: 700 }}>{r.k}</div>
          <div style={{ padding: '5px 14px', borderLeft: `1px solid ${C.line}`, transform: `translateX(${(1 - r.p) * 16}px)` }}>{r.v}</div>
        </div>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', borderTop: `1px solid ${C.line}` }}>
        <div style={{ padding: '6px 14px' }}>
          <div style={{ color: C.muted, fontWeight: 700, marginBottom: 2, opacity: steps[0]?.p ?? 0 }}>Flujo normal</div>
          {steps.map((s, i) => (
            <div key={i} style={{ opacity: s.p, transform: `translateY(${(1 - s.p) * 10}px)`, padding: '2px 6px', borderRadius: 6, background: s.glow ? `${col(s.who)}2a` : undefined, paddingLeft: s.who === 'r' ? 34 : 6, color: s.who === 'r' ? C.warn : C.ink, fontStyle: s.who === 'r' ? 'italic' : undefined, textDecoration: s.strike ? 'line-through' : undefined }}>
              {s.n && <b style={{ color: col(s.who), display: 'inline-block', width: 26 }}>{s.n}</b>}{s.t}
            </div>
          ))}
        </div>
        <div style={{ padding: '6px 14px', borderLeft: `1px solid ${C.line}` }}>
          <div style={{ color: C.muted, fontWeight: 700, marginBottom: 2, opacity: alts[0]?.p ?? 0 }}>Alternativa</div>
          {alts.map((a, i) => <div key={i} style={{ opacity: a.p, padding: '2px 6px', borderRadius: 6, background: a.glow ? `${C.bad}2a` : undefined }}>{a.t}</div>)}
        </div>
      </div>
    </div>
  );
}

function Body() {
  const { p, pf, on } = useT();
  const now = (a: string, b: string) => on(a) && !on(b);
  return (
    <>
      <Scene from="b01" to="b03">
        <Heading text="Del diagrama a la descripción" p={p('b01')} />
        <Stage>
          <Rect x={110} y={140} w={430} h={420} p={p('b01', 0.2)} />
          {['CU1: Alta de socio', 'CU2: Solicitar libro', 'CU3: Devolver libro', 'CU4: Informe'].map((t, i) => (
            <UC key={t} cx={325} cy={210 + i * 95} rx={150} ry={36} text={t} p={p('b01', 0.3 + i * 0.1)} color={i === 1 && on('b01') && pf('b01', 0.55) > 0.5 ? C.warn : C.ink} />
          ))}
          <Ln x1={480} y1={305} x2={700} y2={305} p={pf('b01', 0.65)} color={C.warn} arrow="ahw" />
        </Stage>
        <Card x={720} y={170} w={500} p={pf('b01', 0.7)} border={C.warn} size={24}>
          <div style={{ color: C.warn, fontWeight: 800 }}>Descripción del CU</div>
          <div>¿Cómo se desarrolla? ¿Qué hace el actor? ¿Qué hace el sistema? ¿Qué pasa si algo falla?</div>
        </Card>
        <Card x={720} y={380} w={500} p={p('b02', 0.2)} border={C.good} size={21}>
          <div style={{ color: C.good, fontWeight: 800 }}>Herramienta 3 · ≥ 60 %</div>
          Blanco: la piden para comprobar que la secuencia <b>se corresponde</b> con ella.
        </Card>
      </Scene>

      <Scene from="b03" to="b10">
        <Heading text="CU-02 · Solicitar libro" p={p('b03')} />
        <Board x={60} y={110} w={1160} size={21}
          rows={[
            { k: 'Id', v: 'CU-02', p: pf('b03', 0.3), glow: now('b03', 'b04') ? C.warn : undefined },
            { k: 'Nombre', v: 'Solicitar libro   ← igual que la elipse', p: pf('b03', 0.55), glow: now('b03', 'b04') ? C.warn : undefined },
            { k: 'Actores', v: 'Socio (P)', p: pf('b04', 0.2), glow: now('b04', 'b05') && pf('b04', 0.7) < 0.5 ? C.actor : undefined },
            { k: 'Objetivo', v: 'Retirar un libro por parte de un socio', p: pf('b04', 0.72), glow: now('b04', 'b05') && pf('b04', 0.7) >= 0.5 ? C.warn : undefined },
            { k: 'Precondición', v: 'Tiene el libro a retirar', p: pf('b05', 0.05), glow: now('b05', 'b06') && pf('b05', 0.5) < 0.5 ? C.warn : undefined },
            { k: 'Postcondición', v: 'Retiro del libro registrado', p: pf('b05', 0.55), glow: now('b05', 'b06') && pf('b05', 0.5) >= 0.5 ? C.warn : undefined },
          ]}
          steps={[
            { n: '1', t: 'Socio solicita el retiro de un libro.', p: pf('b07', 0.02), who: 'a', glow: now('b07', 'b08') && pf('b07', 0.2) < 0.5 },
            { n: '2', t: 'Se valida al socio.', p: pf('b07', 0.18), who: 's', glow: now('b07', 'b08') && pf('b07', 0.33) < 0.5 && pf('b07', 0.18) > 0.5 },
            { t: 'R1 = no tenga un retiro registrado sin devolución', p: pf('b07', 0.38), who: 'r', glow: now('b07', 'b08') && pf('b07', 0.38) > 0.5 },
            { n: '3', t: 'Se registra el retiro del libro.', p: pf('b08', 0.02), who: 's' },
            { n: '4', t: 'Se entrega el libro (la información) al socio.', p: pf('b08', 0.2), who: 's', glow: now('b08', 'b09') && pf('b08', 0.35) > 0.5 && pf('b08', 0.8) < 0.5 },
            { n: '5', t: 'FCU', p: pf('b08', 0.82), who: 's' },
          ]}
          alts={[
            { t: '2.1 Tiene un retiro sin devolución', p: pf('b09', 0.3), glow: now('b09', 'b10') },
            { t: '2.2 Se rechaza el pedido de retiro', p: pf('b09', 0.6) },
            { t: '2.3 FCU', p: pf('b09', 0.85) },
          ]} />
        <Stage>
          <Txt x={640} y={655} p={now('b06', 'b07') ? p('b06', 0.5) : 0} size={22} color={C.muted}>
            <tspan fill={C.actor}>■ actor</tspan>   <tspan fill={C.iface}>■ sistema</tspan>   pasos numerados · todo sale bien
          </Txt>
          <Ln x1={360} y1={434} x2={705} y2={404} p={now('b09', 'b10') ? pf('b09', 0.2) : 0} color={C.bad} arrow="ahr" dash />
        </Stage>
      </Scene>

      <Scene from="b10" to="b12">
        <Heading text="CU-03 · Devolver libro (la alternativa continúa)" p={p('b10')} />
        <Board x={60} y={110} w={1160} size={21}
          rows={[{ k: 'Actores', v: 'Socio (P)', p: 1 }, { k: 'Pre / Post', v: 'Retiro registrado → Devolución registrada', p: 1 }]}
          steps={[
            { n: '1', t: 'Socio entrega el libro para devolverlo.', p: p('b10', 0.2), who: 'a' },
            { n: '2', t: 'Sistema busca el retiro del socio.', p: p('b10', 0.4), who: 's' },
            { n: '3', t: 'Sistema verifica el vencimiento.', p: p('b10', 0.6), who: 's', glow: true },
            { t: 'R1 = dentro de los 10 días', p: p('b10', 0.8), who: 'r' },
            { n: '4', t: 'Sistema registra la devolución.', p: p('b10', 1), who: 's', glow: pf('b10', 0.75) > 0.5 },
            { n: '5', t: 'Sistema informa la devolución.', p: p('b10', 1.2), who: 's' },
            { n: '6', t: 'FCU', p: p('b10', 1.4), who: 's' },
          ]}
          alts={[{ t: '3.1 El préstamo está vencido', p: pf('b10', 0.3), glow: true }, { t: '3.2 Inhabilita al socio un mes', p: pf('b10', 0.5) }, { t: '3.3 Continúa en el paso 4', p: pf('b10', 0.7), glow: true }]} />
        <div style={{ position: 'absolute', left: 120, top: 520, width: 1040, display: 'flex', gap: 18, opacity: p('b11', 0.2) }}>
          {['"si…"', '"en caso de…"', '"en caso contrario…"'].map((t, i) => (
            <div key={t} style={{ flex: 1, background: `${C.warn}22`, border: `2px solid ${C.warn}`, borderRadius: 12, padding: '10px 14px', fontSize: 26, fontWeight: 800, color: C.warn, textAlign: 'center', opacity: pf('b11', 0.3 + i * 0.12) }}>{t}</div>
          ))}
        </div>
      </Scene>

      <Scene from="b12" to="b13">
        <Heading text="Resolución de la profesora · Servicio técnico" p={p('b12')} />
        <Board x={60} y={110} w={1160} size={20}
          rows={[{ k: 'Nombre', v: 'Solicitar reparación', p: pf('b12', 0.02) }, { k: 'Actores', v: 'Cliente (P), Servicio Técnico (S)', p: pf('b12', 0.06) }, { k: 'Pre / Post', v: 'Cliente abonado → Se entrega comprobante de recepción', p: pf('b12', 0.12) }]}
          steps={[
            { n: '1', t: 'Cliente solicita reparación de aparato.', p: pf('b12', 0.2), who: 'a' },
            { n: '2', t: 'Sistema valida aparato.', p: pf('b12', 0.3), who: 's' },
            { t: 'R1: el aparato existe en el abono', p: pf('b12', 0.38), who: 'r' },
            { n: '3', t: 'Sistema registra la recepción.', p: pf('b12', 0.48), who: 's' },
            { n: '4', t: 'Entrega comprobante al cliente.', p: pf('b12', 0.56), who: 's' },
            { n: '5', t: 'Avisa al Servicio Técnico.', p: pf('b12', 0.64), who: 's' },
            { n: '6', t: 'FCU', p: pf('b12', 0.7), who: 's' },
          ]}
          alts={[{ t: '2.1 Datos incorrectos', p: pf('b12', 0.78), glow: true }, { t: '2.2 Informa el problema', p: pf('b12', 0.86) }, { t: '2.3 FCU', p: pf('b12', 0.93) }]} />
      </Scene>

      <Scene from="b13" to="b16">
        <Heading text="Relaciones entre casos de uso (teoría)" p={p('b13')} />
        <Card x={60} y={115} w={1160} p={p('b13', 0.4)} border={C.good} size={21}>
          <span style={{ color: C.good, fontWeight: 800 }}>Taboada: </span>en la práctica no se exigen «include» ni «extend». En la teoría, sí pueden aparecer.
        </Card>
        <Stage>
          <Txt x={320} y={240} p={p('b14')} size={30} color={C.ctrl} weight={800}>«extend»</Txt>
          <Actor x={90} y={360} name="Comensal" p={pf('b14', 0.3)} />
          <UC cx={320} cy={340} text="Cenar" p={pf('b14', 0.35)} />
          <UC cx={320} cy={520} text="Tomar café" p={pf('b14', 0.45)} color={C.ctrl} />
          <Ln x1={115} y1={348} x2={200} y2={340} p={pf('b14', 0.4)} />
          <Ln x1={320} y1={484} x2={320} y2={380} p={pf('b14', 0.55)} color={C.ctrl} dash arrow="ahw" />
          <Txt x={420} y={440} p={pf('b14', 0.6)} size={20} color={C.ctrl}>no siempre ocurre</Txt>
          <Txt x={930} y={240} p={p('b15')} size={30} color={C.entity} weight={800}>«include»</Txt>
          <UC cx={790} cy={340} rx={130} text="Registrar préstamo" p={pf('b15', 0.2)} />
          <UC cx={1080} cy={340} rx={130} text="Registrar devolución" p={pf('b15', 0.25)} />
          <UC cx={935} cy={520} rx={130} text="Consultar socio" p={pf('b15', 0.4)} color={C.entity} />
          <Ln x1={810} y1={377} x2={900} y2={482} p={pf('b15', 0.5)} color={C.entity} dash arrow="ah" />
          <Ln x1={1060} y1={377} x2={970} y2={482} p={pf('b15', 0.55)} color={C.entity} dash arrow="ah" />
          <Txt x={935} y={600} p={pf('b15', 0.6)} size={20} color={C.entity}>escenario común a varios</Txt>
        </Stage>
      </Scene>

      <Scene from="b16" to="b17">
        <Heading text="Un cuadro que pierde puntos" p={p('b16')} color={C.bad} />
        <Board x={60} y={110} w={1160} size={21}
          rows={[{ k: 'Nombre', v: 'Retiro de libros del bibliotecario', p: p('b16', 0.2) }, { k: 'Actores', v: 'Bibliotecario (P)', p: p('b16', 0.25), glow: pf('b16', 0.05) > 0.5 && pf('b16', 0.25) < 0.5 ? C.bad : undefined }]}
          steps={[
            { n: '1', t: 'Abre la pantalla de préstamos.', p: p('b16', 0.3), who: 's', glow: pf('b16', 0.25) > 0.5 && pf('b16', 0.5) < 0.5 },
            { n: '2', t: 'Ingresa el número de socio.', p: p('b16', 0.35), who: 's' },
            { n: '3', t: 'Presiona "Guardar".', p: p('b16', 0.4), who: 's', glow: pf('b16', 0.25) > 0.5 && pf('b16', 0.5) < 0.5 },
          ]}
          alts={[{ t: 'a) Si debe un libro, se rechaza', p: p('b16', 0.45), glow: pf('b16', 0.5) > 0.5 }]} />
        <Stage>
          <Cross x={420} y={172} s={16} p={pf('b16', 0.1)} />
          <Cross x={420} y={300} s={22} p={pf('b16', 0.3)} />
          <Cross x={1190} y={244} s={16} p={pf('b16', 0.55)} />
          <Txt x={640} y={520} p={pf('b16', 0.8)} size={26} color={C.bad} weight={700}>sin R1 · sin FCU · sin pre/post</Txt>
        </Stage>
      </Scene>

      <Scene from="b17">
        <Heading text="Checklist de la descripción" p={p('b17')} />
        {['Nombre igual al diagrama', 'Actores con (P) y (S)', 'Objetivo, precondición y postcondición', 'Pasos que alternan actor y sistema', 'Reglas R1 bajo cada validación', 'Alternativas numeradas desde su paso', 'Cierre con FCU'].map((t, i) => (
          <React.Fragment key={t}>
            <svg width={1280} height={720} style={{ position: 'absolute', inset: 0 }}><Check x={240} y={150 + i * 62} p={pf('b17', 0.05 + i * 0.09)} /></svg>
            <div style={{ position: 'absolute', left: 280, top: 132 + i * 62, fontSize: 28, opacity: pf('b17', 0.04 + i * 0.09) }}>{t}</div>
          </React.Fragment>
        ))}
        <div style={{ position: 'absolute', left: 280, top: 580, fontSize: 24, color: C.warn, opacity: pf('b17', 0.85) }}>→ mismo orden en el diagrama de secuencia</div>
      </Scene>
    </>
  );
}

export function Ch2() {
  return <Video timing={T} vid="ch2" title="Cap. 2 · Descripción de casos de uso"><Body /></Video>;
}
