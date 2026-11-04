import React from 'react';
import { C, Card, Check, Cross, Heading, Ln, Rect, Scene, Stage, StereoIcon, Txt, Video, stereoColor, useT, type Timing } from '../../engine/engine';
import timing from './timing.json';

const T = timing as Timing;
export const ch3Timing = T;

type K = 'actor' | 'interface' | 'control' | 'entity';
interface Part { id: string; name: string; kind: K; x: number; p: number; glow?: boolean }
interface Msg { from: string; to: string; label: string; p: number; glow?: boolean; bad?: boolean; num?: number }

/** Diagrama de secuencia animado. */
function Seq({ parts, msgs, top = 120, row = 40, life = 1, act = 0, size = 18 }: { parts: Part[]; msgs: Msg[]; top?: number; row?: number; life?: number; act?: number; size?: number }) {
  const x = Object.fromEntries(parts.map((q) => [q.id, q.x]));
  const y0 = top + 95;
  const bottom = y0 + msgs.length * row + 10;
  const span: Record<string, [number, number]> = {};
  msgs.forEach((m, i) => [m.from, m.to].forEach((id) => { const s = span[id]; span[id] = s ? [Math.min(s[0], i), Math.max(s[1], i)] : [i, i]; }));
  return (
    <g>
      {parts.map((q) => (
        <g key={q.id} opacity={q.p}>
          {q.glow && <circle cx={q.x} cy={top + 22} r={48} fill={stereoColor[q.kind]} opacity={0.18} />}
          <StereoIcon kind={q.kind} x={q.x} y={top + 22} p={q.p} r={24} />
          <Txt x={q.x} y={top + 80} size={size + 1} weight={700} color={stereoColor[q.kind]} p={q.p}>{q.name}</Txt>
          <line x1={q.x} y1={top + 92} x2={q.x} y2={top + 92 + (bottom - top - 92) * life} stroke={C.line} strokeWidth={2} strokeDasharray="7 7" />
          {act > 0 && span[q.id] && <rect x={q.x - 6} y={y0 + span[q.id][0] * row - 4} width={12} height={((span[q.id][1] - span[q.id][0]) * row + 18) * act} fill={C.bg} stroke={C.muted} strokeWidth={1.6} />}
        </g>
      ))}
      {msgs.map((m, i) => {
        const y = y0 + i * row + 6;
        const x1 = x[m.from], x2 = x[m.to];
        const col = m.bad ? C.bad : m.glow ? C.warn : C.ink;
        const lab = `${m.num !== undefined ? `${m.num}: ` : ''}${m.label}`;
        if (m.p <= 0) return null;
        if (m.from === m.to) {
          return (
            <g key={i} opacity={Math.min(1, m.p * 1.5)}>
              <path d={`M${x1 + 7},${y - 8} h46 v22 h-40`} fill="none" stroke={col} strokeWidth={2.4} markerEnd={m.p > 0.9 ? (m.bad ? 'url(#ahr)' : m.glow ? 'url(#ahw)' : 'url(#ah)') : undefined} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - m.p} />
              <Txt x={x1 + 60} y={y + 8} anchor="start" size={size} color={col} p={m.p}>{lab}</Txt>
            </g>
          );
        }
        const d = x2 > x1 ? 1 : -1;
        return (
          <g key={i}>
            <Ln x1={x1 + d * 7} y1={y} x2={x2 - d * 8} y2={y} p={m.p} color={col} arrow={m.bad ? 'ahr' : m.glow ? 'ahw' : 'ah'} />
            <Txt x={(x1 + x2) / 2} y={y - 8} size={size} color={col} p={m.p} weight={m.glow ? 700 : 500}>{lab}</Txt>
          </g>
        );
      })}
    </g>
  );
}

function Why({ text, p, color = C.warn }: { text: string; p: number; color?: string }) {
  return <div style={{ position: 'absolute', left: 60, right: 60, top: 40, textAlign: 'center', fontSize: 25, fontWeight: 700, color, opacity: p, transform: `translateY(${(1 - p) * -10}px)` }}>{text}</div>;
}

const KX = { a: 110, i: 340, c: 590, s: 850, l: 1100 };

function Body() {
  const { p, pf, on, frame, at } = useT();
  const cur = (a: string, b: string) => frame >= at(a) && frame < at(b);
  const g = (a: string, b: string) => cur(a, b);
  // apariciones de objetos
  const parts: Part[] = [
    { id: 'a', name: 'Socio', kind: 'actor', x: KX.a, p: pf('b03', 0.15), glow: g('b03', 'b04') },
    { id: 'i', name: 'Préstamo', kind: 'interface', x: KX.i, p: pf('b05', 0.1), glow: g('b05', 'b06') },
    { id: 'c', name: 'Retirar', kind: 'control', x: KX.c, p: pf('b06', 0.1), glow: g('b06', 'b07') },
    { id: 's', name: 'Socios', kind: 'entity', x: KX.s, p: pf('b07', 0.25), glow: g('b07', 'b08') },
    { id: 'l', name: 'Libros', kind: 'entity', x: KX.l, p: pf('b07', 0.35), glow: g('b07', 'b08') },
  ];
  const msgs: Msg[] = [
    { from: 'a', to: 'i', label: 'Solicitar libro()', p: pf('b09', 0.1), glow: g('b09', 'b10') },
    { from: 'i', to: 'c', label: 'Validar socio()', p: pf('b10', 0.1), glow: g('b10', 'b11') },
    { from: 'c', to: 's', label: 'Dame socio()', p: pf('b11', 0.1), glow: g('b11', 'b12') },
    { from: 'c', to: 'l', label: 'Dame libro()', p: pf('b11', 0.45), glow: g('b11', 'b12') },
    { from: 'c', to: 'c', label: 'Validar()   R1', p: pf('b12', 0.1), glow: g('b12', 'b13') },
    { from: 'c', to: 'i', label: '[retiro sin devolución] Mensaje error()', p: pf('b13', 0.12), glow: g('b13', 'b14'), bad: !g('b13', 'b14') && on('b13') ? false : false },
    { from: 'c', to: 's', label: '[válido] Registrar retiro()', p: pf('b14', 0.1), glow: g('b14', 'b15') },
    { from: 'c', to: 'l', label: '[válido] Registrar retiro()', p: pf('b14', 0.3), glow: g('b14', 'b15') },
    { from: 'c', to: 'i', label: 'Entregar libro()', p: pf('b15', 0.05), glow: g('b15', 'b16') },
    { from: 'i', to: 'a', label: 'Entregar libro()', p: pf('b15', 0.25), glow: g('b15', 'b16') },
  ];
  // en b17 se resaltan grupos según el paso de la descripción
  const step = on('b17') ? (pf('b17', 0.69, 0.2) > 0.5 ? 4 : pf('b17', 0.58, 0.2) > 0.5 ? 3 : pf('b17', 0.43, 0.2) > 0.5 ? 25 : pf('b17', 0.26, 0.2) > 0.5 ? 2 : pf('b17', 0.13, 0.2) > 0.5 ? 1 : 0) : 0;
  const groups: Record<number, number[]> = { 1: [0], 2: [1, 2, 3, 4], 25: [5], 3: [6, 7], 4: [8, 9] };
  const msgs17 = msgs.map((m, i) => ({ ...m, p: 1, glow: (groups[step] ?? []).includes(i) }));

  return (
    <>
      <Scene from="b01" to="b03">
        <Heading text="Diagrama de secuencia" p={p('b01')} />
        <Card x={60} y={130} w={520} p={pf('b01', 0.2)} size={22}>
          <div style={{ color: C.muted, fontWeight: 700 }}>Descripción (afuera)</div>
          El socio pide un libro y se lo dan.
        </Card>
        <Card x={700} y={130} w={520} p={pf('b01', 0.45)} size={22} border={C.warn}>
          <div style={{ color: C.warn, fontWeight: 700 }}>Secuencia (adentro)</div>
          ¿Quién le habla a quién? ¿En qué orden? ¿Por qué?
        </Card>
        <Card x={60} y={300} w={1160} p={p('b02', 0.2)} size={21} border={C.iface}>
          <div style={{ color: C.iface, fontWeight: 800 }}>CU-02 · Solicitar libro · Socio (P)</div>
          <div style={{ opacity: pf('b02', 0.25) }}>1 Socio solicita el retiro · 2 Se valida al socio <i style={{ color: C.warn }}>(R1 = sin retiro pendiente)</i></div>
          <div style={{ opacity: pf('b02', 0.5) }}>3 Se registra el retiro · 4 Se entrega la información al socio · 5 FCU</div>
          <div style={{ opacity: pf('b02', 0.62), color: C.bad }}>2.1 Tiene retiro sin devolución · 2.2 Se rechaza · 2.3 FCU</div>
          <div style={{ opacity: pf('b02', 0.85), color: C.good, fontWeight: 700, marginTop: 6 }}>← este es el guion</div>
        </Card>
      </Scene>

      <Scene from="b03" to="b17">
        <Why text="El actor va en un extremo, con su ROL: Socio (no &quot;Solicita libro&quot;)" p={cur('b03', 'b04') ? p('b03', 0.3) : 0} />
        <Why text="Patrón de análisis: INTERFAZ · CONTROL · ENTIDAD — siempre los tres" p={cur('b04', 'b05') ? p('b04', 0.2) : 0} />
        <Why text="Interfaz: el único que recibe al actor · captura, no procesa" p={cur('b05', 'b06') ? p('b05', 0.2) : 0} color={C.iface} />
        <Why text="Control: coordina el caso de uso · no guarda información" p={cur('b06', 'b07') ? p('b06', 0.2) : 0} color={C.ctrl} />
        <Why text="Entidades: la información que persiste (sustantivos del negocio)" p={cur('b07', 'b08') ? p('b07', 0.2) : 0} color={C.entity} />
        <Why text="Líneas de vida · el tiempo corre hacia abajo" p={cur('b08', 'b09') ? p('b08', 0.2) : 0} />
        <Why text="1 · Actor → Interfaz: el actor solo habla con la interfaz" p={cur('b09', 'b10') ? p('b09', 0.2) : 0} />
        <Why text="2 · Interfaz → Control: la interfaz delega, no procesa" p={cur('b10', 'b11') ? p('b10', 0.2) : 0} />
        <Why text="3-4 · Control → Entidades: el control no tiene datos, los pide" p={cur('b11', 'b12') ? p('b11', 0.2) : 0} />
        <Why text="5 · Mensaje recursivo: el control aplica R1" p={cur('b12', 'b13') ? p('b12', 0.2) : 0} />
        <Why text="6 · Alternativa con [condición], en el MISMO diagrama" p={cur('b13', 'b14') ? p('b13', 0.2) : 0} color={C.bad} />
        <Why text="7-8 · Las entidades guardan; el control decide" p={cur('b14', 'b15') ? p('b14', 0.2) : 0} />
        <Why text="9-10 · La respuesta vuelve por la interfaz (información, no un objeto)" p={cur('b15', 'b16') ? p('b15', 0.2) : 0} />
        <Why text="Diagrama completo · períodos de actividad: opcionales en la práctica" p={cur('b16', 'b17') ? p('b16', 0.2) : 0} color={C.good} />
        {cur('b04', 'b05') && (
          <Stage>
            {(['interface', 'control', 'entity'] as K[]).map((k, i) => (
              <g key={k}><StereoIcon kind={k} x={360 + i * 280} y={330} p={pf('b04', 0.3 + i * 0.15)} r={46} />
                <Txt x={360 + i * 280} y={430} size={28} weight={800} color={stereoColor[k]} p={pf('b04', 0.35 + i * 0.15)}>{['Interfaz', 'Control', 'Entidad'][i]}</Txt></g>
            ))}
          </Stage>
        )}
        {!cur('b04', 'b05') && (
          <Stage>
            <Seq parts={parts} msgs={msgs.map((m, i) => ({ ...m, num: i + 1 }))} top={100} row={40} life={on('b08') ? pf('b08', 0.2, 1.2) : 0} act={on('b16') ? pf('b16', 0.35, 1) : 0} />
          </Stage>
        )}
      </Scene>

      <Scene from="b17" to="b18">
        <Stage>
          <g transform="translate(-10 95) scale(0.62)">
            <Seq parts={parts.map((q) => ({ ...q, p: 1, glow: false }))} msgs={msgs17.map((m, i) => ({ ...m, num: i + 1 }))} top={100} row={42} size={19} />
          </g>
        </Stage>
        <Heading text="¿Se corresponde con la descripción?" p={p('b17')} />
        <div style={{ position: 'absolute', left: 820, top: 130, width: 420, fontSize: 21, lineHeight: 1.5 }}>
          {[[1, '1 Socio solicita el retiro', 'msj 1'], [2, '2 Se valida al socio (R1)', 'msj 2–5'], [25, '2.1 Retiro pendiente → rechazo', 'msj 6'], [3, '3 Se registra el retiro', 'msj 7–8'], [4, '4 Se entrega al socio', 'msj 9–10']].map(([k, t, m]) => (
            <div key={String(k)} style={{ padding: '8px 12px', marginBottom: 8, borderRadius: 10, border: `2px solid ${step === k ? C.warn : C.line}`, background: step === k ? `${C.warn}22` : 'transparent', opacity: p('b17', 0.2) }}>
              <div style={{ fontWeight: 700 }}>{t}</div><div style={{ color: C.warn, fontSize: 18 }}>{m}</div>
            </div>
          ))}
          <div style={{ color: C.good, fontWeight: 800, opacity: pf('b17', 0.88), fontSize: 24 }}>Mismo orden = misma historia ✔</div>
        </div>
      </Scene>

      <Scene from="b18" to="b19">
        <Heading text="Errores frecuentes" p={p('b18')} color={C.bad} />
        <Stage>
          {[0, 1, 2, 3].map((k) => {
            const ox = 40 + (k % 2) * 620, oy = 110 + Math.floor(k / 2) * 255;
            const pk = pf('b18', 0.08 + k * 0.22);
            return (
              <g key={k} opacity={pk}>
                <Rect x={ox} y={oy} w={590} h={235} color={C.line} />
                <g transform={`translate(${ox + 10} ${oy - 40}) scale(0.5)`}>
                  {k === 0 && <Seq parts={[{ id: 'a', name: 'Socio', kind: 'actor', x: 90, p: 1 }, { id: 'i', name: 'Préstamo', kind: 'interface', x: 380, p: 1 }, { id: 'c', name: 'Retirar', kind: 'control', x: 680, p: 1 }, { id: 's', name: 'Socios', kind: 'entity', x: 980, p: 1 }]} msgs={[{ from: 'a', to: 's', label: 'Dame socio()', p: 1, bad: true }, { from: 'a', to: 'i', label: 'Solicitar libro()', p: 1 }]} size={26} row={60} />}
                  {k === 1 && <Seq parts={[{ id: 'a', name: 'Cliente', kind: 'actor', x: 90, p: 1 }, { id: 'i', name: 'Recepción', kind: 'interface', x: 420, p: 1 }, { id: 'ab', name: 'Abonos', kind: 'entity', x: 760, p: 1 }, { id: 'so', name: 'Solicitudes', kind: 'entity', x: 1060, p: 1 }]} msgs={[{ from: 'i', to: 'ab', label: 'Dame abono()', p: 1, bad: true }, { from: 'i', to: 'so', label: 'Registrar()', p: 1, bad: true }]} size={26} row={60} />}
                  {k === 2 && <Seq parts={[{ id: 'i', name: 'Préstamo', kind: 'interface', x: 120, p: 1 }, { id: 'a', name: 'Socio', kind: 'actor', x: 420, p: 1 }, { id: 'c', name: 'Retirar', kind: 'control', x: 720, p: 1 }, { id: 's', name: 'Socios', kind: 'entity', x: 1020, p: 1 }]} msgs={[{ from: 'a', to: 'i', label: 'Solicitar()', p: 1 }, { from: 'i', to: 'c', label: 'Validar()', p: 1 }]} size={26} row={60} />}
                  {k === 3 && <Seq parts={[{ id: 'a', name: 'Socio', kind: 'actor', x: 90, p: 1 }, { id: 'i', name: 'Préstamo', kind: 'interface', x: 380, p: 1 }, { id: 'c', name: 'Retirar', kind: 'control', x: 680, p: 1 }, { id: 's', name: 'Socios', kind: 'entity', x: 980, p: 1 }]} msgs={[{ from: 'c', to: 's', label: '1: Registrar retiro()', p: 1, bad: true }, { from: 'c', to: 's', label: '2: Dame socio()', p: 1, bad: true }]} size={26} row={60} />}
                </g>
                <Txt x={ox + 295} y={oy + 220} size={20} color={C.bad} weight={700}>{['Actor → entidad directo', 'Sin control: la interfaz procesa', 'Actor en el medio', 'Registrar antes de validar'][k]}</Txt>
                <Cross x={ox + 560} y={oy + 30} s={16} p={pk} />
              </g>
            );
          })}
        </Stage>
      </Scene>

      <Scene from="b19" to="b21">
        <Heading text="Variante: Solicitar reparación (actor secundario)" p={p('b19')} />
        <Stage>
          <Seq top={135} row={36} size={16}
            parts={[
              { id: 'a', name: 'Cliente', kind: 'actor', x: 70, p: pf('b20', 0.02) },
              { id: 'i', name: 'Recepción', kind: 'interface', x: 245, p: pf('b20', 0.06) },
              { id: 'c', name: 'Gestor', kind: 'control', x: 430, p: pf('b20', 0.1) },
              { id: 'ab', name: 'Abonos', kind: 'entity', x: 610, p: pf('b20', 0.14) },
              { id: 'so', name: 'Solicitudes', kind: 'entity', x: 790, p: pf('b20', 0.18) },
              { id: 'i2', name: 'Aviso ST', kind: 'interface', x: 980, p: pf('b20', 0.3), glow: pf('b20', 0.3) > 0.5 && pf('b20', 0.7) < 0.5 },
              { id: 'st', name: 'Servicio Técnico', kind: 'actor', x: 1175, p: pf('b20', 0.34), glow: pf('b20', 0.34) > 0.5 && pf('b20', 0.7) < 0.5 },
            ]}
            msgs={[
              { from: 'a', to: 'i', label: 'Solicitar reparación()', p: pf('b20', 0.4) },
              { from: 'i', to: 'c', label: 'Validar aparato()', p: pf('b20', 0.45) },
              { from: 'c', to: 'ab', label: 'Dame abono()', p: pf('b20', 0.5) },
              { from: 'c', to: 'c', label: 'Validar()', p: pf('b20', 0.55) },
              { from: 'c', to: 'i', label: '[datos incorrectos] Informar problema()', p: pf('b20', 0.6) },
              { from: 'c', to: 'so', label: '[válido] Registrar recepción()', p: pf('b20', 0.65) },
              { from: 'c', to: 'i', label: 'Entregar comprobante()', p: pf('b20', 0.7) },
              { from: 'i', to: 'a', label: 'Entregar comprobante()', p: pf('b20', 0.74) },
              { from: 'c', to: 'i2', label: 'Avisar solicitud()', p: pf('b20', 0.8), glow: true },
              { from: 'i2', to: 'st', label: 'Avisar solicitud()', p: pf('b20', 0.86), glow: true },
            ]} />
        </Stage>
        <Card x={300} y={200} w={680} p={cur('b19', 'b20') ? p('b19', 0.4) : 0} size={21} border={C.iface}>
          1 Cliente solicita · 2 Valida aparato (R1: en su abono) · 3 Registra recepción · 4 Entrega comprobante · 5 Avisa al Servicio Técnico · 2.1 Datos incorrectos → informa
        </Card>
      </Scene>

      <Scene from="b21" to="b22">
        <Heading text="Iteración: *[condición]" p={p('b21')} />
        <Stage>
          <Seq top={150} row={46} size={18}
            parts={[{ id: 'a', name: 'Coordinador', kind: 'actor', x: 90, p: 1 }, { id: 'i', name: 'Informe', kind: 'interface', x: 300, p: 1 }, { id: 'c', name: 'Controlar', kind: 'control', x: 520, p: 1 }, { id: 'r', name: 'Retiros', kind: 'entity', x: 740, p: 1 }, { id: 'i2', name: 'Aviso mail', kind: 'interface', x: 960, p: 1 }, { id: 's', name: 'Socio', kind: 'actor', x: 1170, p: 1 }]}
            msgs={[{ from: 'a', to: 'i', label: 'Pedir informe()', p: pf('b21', 0.05) }, { from: 'i', to: 'c', label: 'Buscar vencidos()', p: pf('b21', 0.1) }, { from: 'c', to: 'r', label: 'Dame vencidos()', p: pf('b21', 0.15) }, { from: 'c', to: 'i2', label: '*[hay vencidos] Enviar reclamo()', p: pf('b21', 0.5), glow: true }, { from: 'i2', to: 's', label: '*[hay vencidos] Mail()', p: pf('b21', 0.6), glow: true }]} />
        </Stage>
      </Scene>

      <Scene from="b22" to="b23">
        <Heading text="Diagrama de colaboración (solo teoría)" p={p('b22')} />
        <Stage>
          {[['Socio', 140, 330, C.actor], ['Préstamo', 430, 200, C.iface], ['Retirar', 760, 330, C.ctrl], ['Socios', 1060, 200, C.entity], ['Libros', 1060, 470, C.entity]].map(([n, x, y, c], i) => (
            <g key={String(n)} opacity={pf('b22', 0.1 + i * 0.05)}><Rect x={(x as number) - 85} y={(y as number) - 30} w={170} h={60} color={c as string} fill={`${c}22`} /><Txt x={x as number} y={(y as number) + 8} size={22} weight={700} color={c as string}>{n as string}</Txt></g>
          ))}
          <Ln x1={225} y1={315} x2={345} y2={215} p={pf('b22', 0.35)} /><Ln x1={515} y1={215} x2={675} y2={315} p={pf('b22', 0.38)} />
          <Ln x1={845} y1={315} x2={975} y2={215} p={pf('b22', 0.41)} /><Ln x1={845} y1={345} x2={975} y2={455} p={pf('b22', 0.44)} />
          <Txt x={260} y={250} size={18} color={C.warn} p={pf('b22', 0.5)}>1: Solicitar libro()</Txt>
          <Txt x={610} y={245} size={18} color={C.warn} p={pf('b22', 0.53)}>2: Validar socio()</Txt>
          <Txt x={880} y={245} size={18} color={C.warn} p={pf('b22', 0.56)}>3: Dame socio()</Txt>
          <Txt x={880} y={430} size={18} color={C.warn} p={pf('b22', 0.59)}>4: Dame libro()</Txt>
          <Txt x={640} y={580} size={24} color={C.good} p={pf('b22', 0.7)} weight={700}>misma información · links + mensajes numerados</Txt>
        </Stage>
      </Scene>

      <Scene from="b23">
        <Heading text="Checklist de la secuencia" p={p('b23')} />
        {['Interfaz, control y entidad: los tres', 'Actor → solo a la interfaz', 'Actores en los extremos', 'Actor secundario → otra interfaz al final', 'Alternativa con [condición] en el mismo diagrama', 'Nombre en cada flecha', 'Mismo orden que la descripción'].map((t, i) => (
          <React.Fragment key={t}>
            <svg width={1280} height={720} style={{ position: 'absolute', inset: 0 }}><Check x={230} y={150 + i * 64} p={pf('b23', 0.05 + i * 0.12)} /></svg>
            <div style={{ position: 'absolute', left: 270, top: 132 + i * 64, fontSize: 28, opacity: pf('b23', 0.04 + i * 0.12) }}>{t}</div>
          </React.Fragment>
        ))}
      </Scene>
    </>
  );
}

export function Ch3() {
  return <Video timing={T} vid="ch3" title="Cap. 3 · Diagrama de secuencia"><Body /></Video>;
}
