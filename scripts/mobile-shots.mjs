import { chromium } from '@playwright/test';
const out = process.argv[2];
const b = await chromium.launch({ channel: 'msedge' });
const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
const base = 'http://localhost:4176/iisw-parcial2/#';
const pages = [['home', '/'], ['intro', '/capitulo/ch1/intro'], ['teoria1', '/capitulo/ch1/teoria'], ['teoria2', '/capitulo/ch2/teoria'], ['teoria3', '/capitulo/ch3/teoria'], ['mapa', '/capitulo/ch1/mapa'], ['video', '/capitulo/ch1/video'], ['ej1', '/capitulo/ch1/ejercicios'], ['ej3', '/capitulo/ch3/ejercicios'], ['cuaderno', '/capitulo/ch3/cuaderno'], ['tr4', '/entrenador/4'], ['tr1', '/entrenador/1'], ['simp', '/simulacros/practico'], ['prog', '/progreso']];
const report = [];
for (const [n, u] of pages) {
  await p.goto(base + u); await p.waitForTimeout(500);
  const ov = await p.evaluate(() => {
    const W = document.documentElement.clientWidth;
    const bad = [];
    document.querySelectorAll('body *').forEach((e) => { const r = e.getBoundingClientRect(); if (r.width > 0 && r.right > W + 2 && !e.closest('.table-wrap,.q-diagram,.tabs,.cmap-stage,[style*="overflow"]')) bad.push(e.tagName + '.' + (e.className?.baseVal ?? e.className) + ':' + Math.round(r.right)); });
    return { sw: document.documentElement.scrollWidth, W, bad: bad.slice(0, 6) };
  });
  report.push(n + ' ' + JSON.stringify(ov));
  await p.screenshot({ path: `${out}/m-${n}.png`, fullPage: true });
}
console.log(report.join('\n'));
await b.close();
