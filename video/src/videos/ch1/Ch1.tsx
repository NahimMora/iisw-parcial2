import React from 'react';
import { Actor, C, Card, Check, Chip, Cross, Heading, Ln, Rect, Scene, Stage, Stick, Title, Txt, UC, Video, useT, interpolate, type Timing } from '../../engine/engine';
import timing from './timing.json';

const T = timing as Timing;
export const ch1Timing = T;

// ---- geometría del diagrama de Kameral ----
const SYS = { x: 360, y: 92, w: 560, h: 510 };
const A = { pna: [205, 200], coo: [205, 470], soc: [1085, 345] } as const;
const U = { cu1: [640, 175], cu2: [640, 295], cu3: [640, 415], cu4: [640, 535] } as const;
const RX = 140, RY = 40;
function edge(c: readonly [number, number], t: readonly [number, number]) {
  const dx = t[0] - c[0], dy = t[1] - c[1];
  const k = 1 / Math.sqrt((dx * dx) / (RX * RX) + (dy * dy) / (RY * RY));
  return [c[0] + dx * k, c[1] + dy * k];
}
function Assoc({ a, u, p, color = C.ink }: { a: readonly [number, number]; u: readonly [number, number]; p: number; color?: string }) {
  const sx = a[0] + (a[0] < u[0] ? 24 : -24), sy = a[1] - 12;
  const [ex, ey] = edge(u, [sx, sy]);
  return <Ln x1={sx} y1={sy} x2={ex} y2={ey} p={p} color={color} />;
}

function Kameral({ show }: { show: (k: string) => number }) {
  const hl = show('hl');
  const lc = hl > 0 ? C.warn : C.ink;
  return (
    <g>
      <Rect x={SYS.x} y={SYS.y} w={SYS.w} h={SYS.h} p={show('sys')} color={C.sys} fill="rgba(179,157,255,.06)" />
      <Txt x={SYS.x + SYS.w / 2} y={SYS.y + 34} p={show('sys')} size={22} color={C.sys} weight={700}>Biblioteca "Kameral"</Txt>
      <Actor x={A.pna[0]} y={A.pna[1]} name={'Persona\nno asociada'} p={show('pna')} />
      <Actor x={A.coo[0]} y={A.coo[1]} name={'Coordinador'} p={show('coo')} />
      <Actor x={A.soc[0]} y={A.soc[1]} name={'Socio'} p={show('soc')} />
      <UC cx={U.cu1[0]} cy={U.cu1[1]} rx={RX} ry={RY} text="CU1: Alta de socio" p={show('cu1')} />
      <UC cx={U.cu2[0]} cy={U.cu2[1]} rx={RX} ry={RY} text="CU2: Solicitar libro" p={show('cu2')} />
      <UC cx={U.cu3[0]} cy={U.cu3[1]} rx={RX} ry={RY} text="CU3: Devolver libro" p={show('cu3')} />
      <UC cx={U.cu4[0]} cy={U.cu4[1]} rx={RX} ry={RY} text={'CU4: Informe\nde préstamos'} p={show('cu4')} />
      <Assoc a={A.pna} u={U.cu1} p={show('l1')} color={lc} />
      <Assoc a={A.soc} u={U.cu1} p={show('l2')} color={lc} />
      <Assoc a={A.soc} u={U.cu2} p={show('l3')} color={lc} />
      <Assoc a={A.soc} u={U.cu3} p={show('l4')} color={lc} />
      <Assoc a={A.coo} u={U.cu4} p={show('l5')} color={lc} />
      <Assoc a={A.soc} u={U.cu4} p={show('l6')} color={lc} />
      <Chip x={312} y={505} text="(P) inicia" p={show('ps')} color={C.actor} size={17} />
      <Chip x={990} y={470} text="(S) es requerido" p={show('ps')} color={C.entity} size={17} />
    </g>
  );
}

const PARAS = [
  { b: 'b03', t: 'La biblioteca permite que las personas se asocien para acceder al préstamo de libros. El trámite se hace en la sede, atendido por un bibliotecario.' },
  { b: 'b04', t: 'Cada socio paga una cuota anual. Retira un solo libro por vez pidiéndolo al bibliotecario; plazo: 10 días. Si la cuota está impaga, se cobra en ese momento.' },
  { b: 'b05', t: 'Periódicamente el coordinador revisa préstamos vencidos y envía un mail al socio.' },
  { b: 'b05', t: 'Al recibir una devolución, el bibliotecario verifica el vencimiento y, si corresponde, inhabilita al socio un mes.' },
];

function Body() {
  const { p, pf, on, frame, at } = useT();
  return (
    <>
      {/* 1. Las cuatro herramientas */}
      <Scene from="b01" to="b03">
        <Heading text="La parte práctica del parcial" p={p('b01')} />
        {['Lista de\nrequerimientos', 'Diagrama de\ncasos de uso', 'Descripción de\nun caso de uso', 'Diagrama de\nsecuencia'].map((t, i) => {
          const focus = on('b02') && i < 2;
          const dim = on('b02') && i >= 2;
          return (
            <Card key={i} x={70 + i * 290} y={230} w={250} p={pf('b01', 0.25 + i * 0.12)} glow={focus ? C.warn : undefined} size={27}>
              <div style={{ fontSize: 46, fontWeight: 800, color: focus ? C.warn : C.muted }}>{i + 1}</div>
              <div style={{ whiteSpace: 'pre-line', fontWeight: 700, opacity: dim ? 0.45 : 1 }}>{t}</div>
              <div style={{ marginTop: 14, fontSize: 21, color: C.good, opacity: p('b02', 0.4) }}>≥ 60 %</div>
            </Card>
          );
        })}
        <Stage><Txt x={640} y={520} p={pf('b02', 0.55)} size={30} color={C.warn} weight={700}>Ejemplo de la cátedra: biblioteca "Kameral"</Txt></Stage>
      </Scene>

      {/* 2. Lectura por párrafos */}
      <Scene from="b03" to="b07">
        <Heading text="1 · Leer la narrativa por párrafos" p={p('b03')} />
        {PARAS.map((x, i) => {
          const start = i === 3 ? pf('b05', 0.45) : p(x.b, i === 2 ? 0 : 0);
          const active = frame >= at(x.b) && (i === 3 ? pf('b05', 0.45) > 0.5 : i === 2 ? pf('b05', 0.45) < 0.5 : true) && !on(x.b === 'b03' ? 'b04' : x.b === 'b04' ? 'b05' : 'b06');
          return (
            <Card key={i} x={60} y={120 + i * 118} w={660} p={start} size={21} glow={active ? [C.accent, C.actor, C.ctrl, C.entity][i] : undefined}>{x.t}</Card>
          );
        })}
        <div style={{ position: 'absolute', left: 790, top: 130, fontSize: 24, color: C.muted, opacity: p('b06') }}>¿Quiénes aparecen?</div>
        {['Persona no asociada', 'Socio', 'Bibliotecario', 'Coordinador'].map((n, i) => (
          <svg key={n} width={1280} height={720} style={{ position: 'absolute', inset: 0 }}><Chip x={985} y={215 + i * 82} text={n} p={pf('b06', 0.12 + i * 0.1)} color={[C.actor, C.actor, C.muted, C.actor][i]} size={24} /></svg>
        ))}
        <Stage><Txt x={985} y={590} p={pf('b06', 0.7)} size={26} color={C.warn} weight={700}>¿Todos son actores?</Txt></Stage>
      </Scene>

      {/* 3. Externos vs internos */}
      <Scene from="b07" to="b10">
        <Stage>
          <Rect x={640} y={120} w={590} h={470} p={p('b07')} color={C.sys} fill="rgba(179,157,255,.06)" />
          <Txt x={935} y={160} p={p('b07')} size={26} color={C.sys} weight={700}>ADENTRO: el sistema</Txt>
          <Txt x={320} y={160} p={p('b07')} size={26} color={C.actor} weight={700}>AFUERA: entidades externas</Txt>
          {[['Persona no asociada', 'quiere asociarse'], ['Socio', 'quiere retirar y devolver'], ['Coordinador', 'quiere detectar vencidos']].map(([n, g], i) => (
            <g key={n}>
              <Stick x={130} y={250 + i * 125} p={pf('b07', 0.15 + i * 0.25)} />
              <Txt x={185} y={240 + i * 125} anchor="start" p={pf('b07', 0.15 + i * 0.25)} size={25} weight={700} color={C.actor}>{n}</Txt>
              <Txt x={185} y={272 + i * 125} anchor="start" p={pf('b07', 0.22 + i * 0.25)} size={21} color={C.muted}>objetivo: {g}</Txt>
            </g>
          ))}
          {(() => {
            const m = p('b08', 0.2, 1.1);
            const x = interpolate(m, [0, 1], [420, 935]);
            return (
              <g opacity={on('b08') ? 1 : 0}>
                <Stick x={x} y={300} p={1} color={C.muted} />
                <Txt x={x} y={362} size={24} color={C.muted} weight={700}>Bibliotecario</Txt>
                <Txt x={935} y={400} p={p('b08', 1.3)} size={22} color={C.sys}>procesa lo que otros piden →</Txt>
                <Txt x={935} y={430} p={p('b08', 1.5)} size={24} color={C.sys} weight={700}>parte del sistema</Txt>
              </g>
            );
          })()}
        </Stage>
        <Card x={660} y={470} w={560} p={pf('b08', 0.45)} size={19} border={C.good}>
          <span style={{ color: C.good, fontWeight: 700 }}>Taboada: </span>"Modelamos el negocio. Hay un sistema y hay entidades externas."
        </Card>
        {on('b09') && (
          <div style={{ position: 'absolute', inset: 0, background: C.bg, opacity: p('b09', 0, 0.4) }}>
            <Heading text="Analogía: el supermercado" p={p('b09')} />
            <svg width={1280} height={720} style={{ position: 'absolute', inset: 0 }}>
              <Rect x={420} y={140} w={780} h={420} p={p('b09', 0.2)} color={C.sys} fill="rgba(179,157,255,.05)" />
              <Txt x={810} y={180} p={p('b09', 0.3)} size={24} color={C.sys} weight={700}>Supermercado</Txt>
              <Actor x={200} y={360} name="Cliente" p={pf('b09', 0.1)} />
              {['entra', 'toma mercadería', 'paga en caja'].map((s, i) => (
                <g key={s}><Chip x={560 + i * 210} y={300} text={s} p={pf('b09', 0.22 + i * 0.1)} color={C.warn} size={21} />
                  {i < 2 && <Ln x1={630 + i * 210} y1={295} x2={680 + i * 210} y2={295} p={pf('b09', 0.3 + i * 0.1)} arrow="ah" />}</g>
              ))}
              <Ln x1={240} y1={330} x2={480} y2={300} p={pf('b09', 0.2)} arrow="ah" color={C.actor} />
              <Txt x={810} y={460} p={pf('b09', 0.6)} size={22} color={C.muted}>repositor · limpieza → adentro, no son actores</Txt>
              <Stick x={650} y={510} p={pf('b09', 0.6)} color={C.muted} s={0.7} /><Stick x={970} y={510} p={pf('b09', 0.62)} color={C.muted} s={0.7} />
            </svg>
          </div>
        )}
      </Scene>

      {/* 4. Construcción del diagrama */}
      <Scene from="b10" to="b16">
        <Stage>
          <Kameral show={(k) => ({
            sys: p('b10', 0.2, 1.2),
            pna: pf('b11', 0.3), coo: pf('b11', 0.45), soc: pf('b11', 0.62),
            cu1: pf('b13', 0.02), l1: pf('b13', 0.15), l2: pf('b13', 0.27),
            cu2: pf('b13', 0.42), l3: pf('b13', 0.55), cu3: pf('b13', 0.75), l4: pf('b13', 0.88),
            cu4: pf('b14', 0.02), l5: pf('b14', 0.18), l6: pf('b14', 0.3), ps: pf('b14', 0.55),
            hl: on('b15') ? 1 : 0,
          } as Record<string, number>)[k] ?? 0} />
          <Txt x={640} y={70} p={on('b12') && !on('b13') ? p('b12', 0.3) : 0} size={23} color={C.warn} weight={600}>caso de uso = objetivo del actor · verbo en infinitivo + objeto</Txt>
          <Txt x={640} y={70} p={on('b15') ? p('b15', 0.2) : 0} size={23} color={C.warn} weight={600}>asociaciones: ¿quién inicia? ¿quién más participa?</Txt>
          {on('b12') && !on('b13') && <UC cx={640} cy={175} rx={RX} ry={RY} text="Verbo + objeto" p={p('b12', 0.9)} color={C.warn} />}
        </Stage>
      </Scene>

      {/* 5. Lista de requerimientos */}
      <Scene from="b16" to="b18">
        <Stage zoom={1}>
          <g transform="translate(-70 75) scale(0.68)"><Kameral show={(k) => (k === 'hl' || k === 'ps' ? 0 : 1)} /></g>
        </Stage>
        <Heading text="2 · La lista de requerimientos" p={p('b16')} />
        <Card x={760} y={120} w={480} p={p('b16', 0.6)} border={C.req} size={20}>
          <div style={{ color: C.req, fontWeight: 700 }}>Formato de la profesora</div>
          "El sistema debe gestionar / proveer" + proceso de negocio
        </Card>
        {['a) gestionar el alta de socios', 'b) gestionar la solicitud de libros', 'c) gestionar las devoluciones', 'd) proveer un informe de préstamos vencidos'].map((t, i) => (
          <Card key={t} x={760} y={250 + i * 82} w={480} p={pf('b17', 0.02 + i * 0.16)} size={21} glow={pf('b17', 0.02 + i * 0.16) > 0.5 && pf('b17', 0.18 + i * 0.16) < 0.5 ? C.req : undefined}>
            <span style={{ color: C.muted }}>El sistema debe </span>{t.slice(3)}
          </Card>
        ))}
        <div style={{ position: 'absolute', left: 760, top: 588, fontSize: 21, color: C.good, opacity: pf('b17', 0.75) }}>4 funciones básicas = 4 requerimientos = 4 casos de uso</div>
      </Scene>

      {/* 6. Herencia de actores */}
      <Scene from="b18" to="b19">
        <Heading text="Un solo actor inicia cada caso de uso" p={p('b18')} />
        <Stage>
          <Actor x={330} y={250} name={'Usuario de\nbiblioteca'} p={pf('b18', 0.35)} />
          <Actor x={200} y={490} name="Alumno" p={pf('b18', 0.3)} color={C.iface} />
          <Actor x={460} y={490} name="Docente" p={pf('b18', 0.33)} color={C.iface} />
          <Ln x1={210} y1={445} x2={300} y2={348} p={pf('b18', 0.62)} arrow="tri" />
          <Ln x1={450} y1={445} x2={360} y2={348} p={pf('b18', 0.66)} arrow="tri" />
          <Rect x={640} y={150} w={470} h={300} p={pf('b18', 0.4)} />
          <UC cx={875} cy={300} text="Solicitar libro" p={pf('b18', 0.42)} />
          <Ln x1={355} y1={238} x2={738} y2={290} p={pf('b18', 0.5)} />
          <Txt x={330} y={630} p={pf('b18', 0.7)} size={22} color={C.muted}>flecha de punta triangular hueca → hacia el actor general</Txt>
        </Stage>
      </Scene>

      {/* 7. Errores */}
      <Scene from="b19" to="b22">
        <Heading text="Errores que cuestan puntos" p={p('b19')} color={C.bad} />
        <Stage>
          <Rect x={360} y={110} w={560} h={470} p={p('b19', 0.2)} />
          <Txt x={640} y={145} p={p('b19', 0.2)} size={21} color={C.sys} weight={700}>Biblioteca "Kameral"</Txt>
          <Actor x={205} y={230} name="Bibliotecario" p={p('b19', 0.3)} />
          <Actor x={205} y={470} name="Coordinador" p={p('b19', 0.35)} />
          <Actor x={1085} y={350} name="Juan Pérez" p={p('b19', 0.4)} />
          <UC cx={640} cy={215} text="Alta de socio" p={p('b19', 0.3)} />
          <UC cx={640} cy={330} text="Solicitar libro" p={p('b19', 0.35)} />
          <UC cx={640} cy={445} text="Pantalla de login" p={p('b19', 0.4)} />
          <UC cx={640} cy={540} text="Informe de préstamos" p={p('b19', 0.45)} />
          {[[215, 230], [330, 230], [445, 230], [540, 470]].map(([cy, ay], i) => <Ln key={i} x1={230} y1={ay - 12} x2={520} y2={cy} p={p('b19', 0.5)} />)}
          <Ln x1={1060} y1={338} x2={772} y2={540} p={p('b19', 0.5)} />
          <Cross x={205} y={215} s={42} p={pf('b20', 0.02)} />
          <Txt x={205} y={330} p={pf('b20', 0.08)} size={19} color={C.good} weight={700}>es parte del sistema</Txt>
          <Cross x={1085} y={335} s={42} p={pf('b20', 0.25)} />
          <Txt x={1085} y={450} p={pf('b20', 0.3)} size={22} color={C.good} weight={700}>→ Socio</Txt>
          <Cross x={640} y={445} s={30} p={pf('b20', 0.5)} />
          <Txt x={640} y={498} p={pf('b20', 0.55)} size={19} color={C.good} weight={700}>detalle técnico, no objetivo</Txt>
          <Txt x={205} y={605} p={pf('b20', 0.78)} size={22} color={C.good} weight={700}>falta: Persona no asociada</Txt>
        </Stage>
        {on('b21') && (
          <div style={{ position: 'absolute', inset: 0, background: C.bg, opacity: p('b21', 0, 0.4) }}>
            <Heading text="Error de nivel" p={p('b21')} color={C.bad} />
            <svg width={1280} height={720} style={{ position: 'absolute', inset: 0 }}>
              {['Alta socio', 'Baja socio', 'Modif. socio', 'Login', 'Alta libro', 'Baja libro', 'Consultar stock', 'Imprimir', 'Buscar socio', 'Menú', 'Cobrar cuota', 'Validar mail', 'Backup', 'Reporte', 'Logout'].map((n, i) => (
                <UC key={n} cx={170 + (i % 5) * 235} cy={170 + Math.floor(i / 5) * 105} rx={100} ry={30} size={16} text={n} p={pf('b21', 0.05 + i * 0.025)} color={C.muted} />
              ))}
              <Cross x={640} y={275} s={150} p={pf('b21', 0.55)} />
              <Txt x={640} y={560} p={pf('b21', 0.7)} size={40} color={C.good} weight={800}>Kameral: 4 casos de uso</Txt>
            </svg>
          </div>
        )}
      </Scene>

      {/* 8. Variante */}
      <Scene from="b22" to="b24">
        <Heading text="Variante nueva: bicicletería" p={p('b22')} />
        <Card x={50} y={115} w={470} p={p('b22', 0.3)} size={19}>
          Una bicicletería alquila por hora. La persona <b style={{ color: C.actor }}>se registra como cliente</b>. El <b style={{ color: C.actor }}>cliente</b> alquila y devuelve en el local, atendido por un <b style={{ color: C.muted }}>encargado</b>. Si hay daño va a un <b style={{ color: C.actor }}>taller externo</b>, que avisa cuando la reparó. Cada semana el <b style={{ color: C.actor }}>dueño</b> recibe un resumen.
        </Card>
        <Stage>
          <Stick x={180} y={505} p={pf('b23', 0.03)} color={C.muted} s={0.8} />
          <Txt x={180} y={560} p={pf('b23', 0.05)} size={18} color={C.muted}>Encargado → adentro</Txt>
          <Cross x={180} y={490} s={30} p={pf('b23', 0.08)} />
          <Rect x={640} y={120} w={390} h={480} p={pf('b23', 0.15)} />
          {['Registrar cliente', 'Alquilar bicicleta', 'Devolver bicicleta', 'Informar reparación', 'Emitir resumen semanal'].map((n, i) => (
            <UC key={n} cx={835} cy={175 + i * 92} rx={130} ry={33} size={18} text={n} p={pf('b23', 0.55 + i * 0.08)} />
          ))}
          <Actor x={570} y={200} name={'Persona no\nregistrada'} p={pf('b23', 0.2)} size={16} />
          <Actor x={1150} y={250} name="Cliente" p={pf('b23', 0.25)} size={16} />
          <Actor x={1150} y={450} name={'Taller\nexterno'} p={pf('b23', 0.3)} size={16} />
          <Actor x={570} y={520} name="Dueño" p={pf('b23', 0.35)} size={16} />
          <Ln x1={592} y1={188} x2={705} y2={175} p={pf('b23', 0.62)} />
          <Ln x1={1128} y1={238} x2={965} y2={175} p={pf('b23', 0.65)} />
          <Ln x1={1128} y1={238} x2={965} y2={267} p={pf('b23', 0.7)} />
          <Ln x1={1128} y1={238} x2={965} y2={359} p={pf('b23', 0.78)} />
          <Ln x1={1128} y1={438} x2={965} y2={359} p={pf('b23', 0.8)} />
          <Ln x1={1128} y1={438} x2={965} y2={451} p={pf('b23', 0.86)} />
          <Ln x1={592} y1={508} x2={705} y2={543} p={pf('b23', 0.94)} />
        </Stage>
      </Scene>

      {/* 9. Checklist */}
      <Scene from="b24">
        <Heading text="Checklist antes de seguir" p={p('b24')} />
        {['Actores externos, con su rol', 'Ningún empleado que atiende como actor', 'Casos de uso: verbo + objeto, nivel de negocio', 'Un único iniciador por caso de uso', 'Actores afuera de la frontera', 'Todas las asociaciones revisadas'].map((t, i) => (
          <React.Fragment key={t}>
            <svg width={1280} height={720} style={{ position: 'absolute', inset: 0 }}><Check x={250} y={160 + i * 72} p={pf('b24', 0.08 + i * 0.14)} /></svg>
            <div style={{ position: 'absolute', left: 290, top: 140 + i * 72, fontSize: 30, opacity: pf('b24', 0.06 + i * 0.14) }}>{t}</div>
          </React.Fragment>
        ))}
      </Scene>

    </>
  );
}

export function Ch1() {
  return <Video timing={T} vid="ch1" title="Cap. 1 · Requerimientos y casos de uso"><Body /></Video>;
}
