import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
const [, , input, output] = process.argv;
const b = await chromium.launch();
const p = await b.newPage();
await p.goto(pathToFileURL(input).href, { waitUntil: 'networkidle' });
await p.pdf({ path: output, format: 'A4', printBackground: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="font-size:8px;width:100%;text-align:center;color:#888">Roadmap IISW · <span class="pageNumber"></span>/<span class="totalPages"></span></div>', margin: { top: '14mm', bottom: '16mm', left: '14mm', right: '14mm' } });
await b.close();
console.log('ok', output);
