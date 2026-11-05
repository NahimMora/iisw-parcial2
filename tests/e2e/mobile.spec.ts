import { expect, test } from '@playwright/test';

const ROUTES = ['/', '/capitulo/ch1/teoria', '/capitulo/ch3/teoria', '/capitulo/ch1/mapa', '/capitulo/ch1/ejercicios', '/capitulo/ch3/ejercicios', '/capitulo/ch5/teoria', '/entrenador/4', '/entrenador/3', '/simulacros/practico', '/repaso', '/progreso'];

test('celular: ninguna pantalla se desborda y la navegación inferior está visible', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'solo móvil');
  for (const r of ROUTES) {
    await page.goto('./#' + r);
    await page.waitForTimeout(250);
    const { sw, w } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: document.documentElement.clientWidth }));
    expect(sw, `desborde en ${r}`).toBeLessThanOrEqual(w + 1);
  }
  await expect(page.locator('.mainnav')).toBeVisible();
  const box = await page.locator('.mainnav').boundingBox();
  expect(box!.y).toBeGreaterThan(700); // abajo de la pantalla
});

test('celular: los diagramas se pueden ampliar y cerrar', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'solo móvil');
  await page.goto('./#/capitulo/ch3/teoria');
  await page.getByRole('button', { name: 'Ampliar diagrama' }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: /Acercar/ }).click();
  await page.getByRole('button', { name: 'Cerrar ✕' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
