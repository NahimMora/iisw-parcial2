import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  use: { baseURL: process.env.E2E_URL ?? 'http://localhost:4173/iisw-parcial2/' },
  webServer: process.env.E2E_URL ? undefined : { command: 'npx vite preview --port 4173 --strictPort', port: 4173, reuseExistingServer: true },
  projects: [
    { name: 'chrome-desktop', use: { channel: 'chrome', viewport: { width: 1280, height: 860 } } },
    { name: 'edge-mobile', use: { channel: 'msedge', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
});
