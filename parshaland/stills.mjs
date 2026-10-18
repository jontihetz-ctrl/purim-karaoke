// Render single frames for checking: FILM=…/film.html node stills.mjs <seconds> …   → stills/sNNN.N.jpg
import { chromium } from '/home/user/parshaland_work/node/node_modules/playwright/index.mjs';
import fs from 'fs';
const times = process.argv.slice(2).map(Number);
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('file://' + process.env.FILM, { waitUntil: 'load' });
for (let i = 0; i < 600; i++) { if (await p.evaluate(() => window.__ready || window.__err)) break; await p.waitForTimeout(100); }
const err = await p.evaluate(() => window.__err); if (err) { console.log('SHADER ERROR:\n' + err.slice(0, 3000)); process.exit(1); }
fs.mkdirSync('stills', { recursive: true });
for (const t of times) { const t0 = Date.now();
  const data = await p.evaluate(t => { window.render(t); return document.getElementById('out').toDataURL('image/jpeg', 0.85); }, t);
  fs.writeFileSync(`stills/s${t.toFixed(1).padStart(6, '0')}.jpg`, Buffer.from(data.split(',')[1], 'base64')); console.log(`t=${t} ${Date.now() - t0}ms`); }
console.log(errs.length ? errs.slice(0, 5).join('\n') : 'no errors'); await b.close();
