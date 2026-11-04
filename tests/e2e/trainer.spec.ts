import { expect, test } from '@playwright/test';

test('nivel 4: armar el diagrama de casos de uso correcto da 100 %', async ({ page }) => {
  await page.goto('./#/entrenador/4');
  for (const a of ['Persona', 'Jugador', 'Empresa de mantenimiento', 'Administrador']) await page.getByRole('button', { name: new RegExp(`☐ ${a}$`) }).click();
  for (const c of ['Registrar jugador', 'Reservar cancha', 'Informar reparación de cancha', 'Emitir informe de ocupación']) await page.getByRole('button', { name: new RegExp(`☐ ${c}$`) }).click();
  for (const [a, c] of [['Persona', 'Registrar jugador'], ['Jugador', 'Reservar cancha'], ['Empresa de mantenimiento', 'Informar reparación de cancha'], ['Administrador', 'Emitir informe de ocupación']]) await page.getByLabel(`${a} — ${c}`).check();
  await page.getByRole('button', { name: 'Validar diagrama' }).click();
  await expect(page.locator('.result-score')).toContainText('100');
});

test('nivel 4: secuencia con el actor hablando a una entidad se marca mal', async ({ page }) => {
  await page.goto('./#/entrenador/4');
  await page.getByRole('button', { name: /B · Secuencia/ }).click();
  await page.getByRole('button', { name: '＋ Jugador', exact: true }).click();
  await page.getByRole('button', { name: '＋ Canchas', exact: true }).click();
  await page.getByLabel('Estereotipo de Jugador').selectOption('actor');
  await page.getByRole('button', { name: 'Agregar' }).click();
  await page.getByRole('button', { name: 'Validar diagrama' }).click();
  await expect(page.locator('.check-list li.bad').filter({ hasText: 'no es una interfaz' })).toBeVisible();
});

test('simulacro teórico: comenzar, corregir e informe por tema', async ({ page }) => {
  await page.goto('./#/simulacros/teorico');
  await page.getByRole('button', { name: 'Comenzar' }).click();
  await expect(page.locator('.question')).toHaveCount(22);
  await page.getByRole('button', { name: 'Corregir' }).click();
  await expect(page.getByText('Informe por tema')).toBeVisible();
});

test('simulacro práctico: rúbrica y informe con umbral 60 %', async ({ page }) => {
  await page.goto('./#/simulacros/practico');
  await page.getByRole('button', { name: /Empezar/ }).click();
  await page.getByRole('button', { name: /Terminé/ }).click();
  const boxes = page.locator('.rub-item input');
  const n = await boxes.count();
  for (let i = 0; i < n; i++) await boxes.nth(i).check();
  await page.getByRole('button', { name: 'Calcular resultado' }).click();
  await expect(page.locator('#paper-report')).toContainText('≥ 60 %');
});
