import { expect, test } from '@playwright/test';

test('panel → capítulo 1 → secciones → corregir → progreso persistente', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Segundo parcial' })).toBeVisible();
  await expect(page.locator('.rm-item a.rm-title')).toHaveCount(9);
  await page.getByRole('link', { name: /Empezar|Continuar estudiando/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Requerimientos y casos de uso');

  for (const name of ['Teoría', 'Video', 'Mapa conceptual', 'Cuaderno', 'Ejercicios']) {
    await page.getByRole('button', { name: new RegExp(name) }).first().click();
    await expect(page.locator('.section')).toBeVisible();
  }
  // responder la primera pregunta y corregir
  await page.locator('.question').first().locator('.opt').first().click();
  await page.getByRole('button', { name: 'Corregir' }).click();
  await expect(page.locator('.result')).toBeVisible();
  await expect(page.locator('.result-score')).toBeVisible();

  // persiste tras recargar
  await page.reload();
  await page.getByRole('button', { name: /Corrección/ }).first().click();
  await expect(page.getByText(/Intentos de ejercicios/)).toBeVisible();
  await expect(page.locator('.card li').first()).toContainText('%');

  // banco de errores con contenido
  await page.goto('./#/repaso');
  await expect(page.getByRole('button', { name: /Repasar mis errores \(\d+\)/ })).toBeVisible();
});

test('el video del capítulo 1 carga y se reproduce', async ({ page }) => {
  await page.goto('./#/capitulo/ch1/video');
  const v = page.getByTestId('video-ch1-v1');
  await expect(v).toBeVisible();
  const ok = await v.evaluate(async (el: HTMLVideoElement) => {
    el.muted = true;
    await el.play();
    await new Promise((r) => setTimeout(r, 2500));
    return { t: el.currentTime, d: el.duration, w: el.videoWidth, err: el.error?.code ?? null };
  });
  expect(ok.err).toBeNull();
  expect(ok.d).toBeGreaterThan(120);
  expect(ok.w).toBe(1280);
  expect(ok.t).toBeGreaterThan(0.5);
});

test('exportar progreso descarga un JSON válido', async ({ page }) => {
  await page.goto('./#/progreso');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Exportar progreso/ }).click()]);
  const path = await dl.path();
  const fs = await import('node:fs');
  const data = JSON.parse(fs.readFileSync(path!, 'utf8'));
  expect(data.app).toBe('iisw-parcial2');
  expect(data.chapters).toBeTruthy();
});
