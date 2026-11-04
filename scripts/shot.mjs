import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
const [, , input, output, w = '900', h = '1300'] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto(input.startsWith('http') ? input : pathToFileURL(input).href, { waitUntil: 'networkidle' });
await p.screenshot({ path: output, fullPage: false });
await b.close();
