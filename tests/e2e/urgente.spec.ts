import { expect, test } from '@playwright/test';

test('modo urgente: solución modelo, videos y corrección instantánea', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('./#/urgente');
  await expect(page.getByRole('heading', { name: 'Lo justo para aprobar el 2º parcial' })).toBeVisible();
  await expect(page.locator('#solucion svg.diagram')).toHaveCount(3);
  await expect(page.locator('#videos video')).toHaveCount(4);
  const q = page.locator('#practica .iq-q').first();
  await q.getByRole('button', { name: 'El Cliente' }).click();
  await expect(q.locator('.q-score')).toHaveText('✔ Correcta');
  await expect(q.locator('.q-feedback')).toContainText('negocio');
  const v = page.locator('#viejos .iq-q').first();
  await v.getByRole('button', { name: 'Verdadero' }).click();
  await expect(v.locator('.q-score')).toHaveText('✘ Incorrecta');
  await expect(page.locator('#resto .iq-q').first()).toBeVisible();
  expect(errors).toEqual([]);
});
