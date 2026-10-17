// Render frames [a, b) of film.html (FILM env) to an MP4: each frame is drawn with window.render(t) and piped as JPEG into ffmpeg.
// Usage: FILM=…/film.html node render.mjs <firstFrame> <endFrame> <out.mp4>
import { chromium } from '/home/user/parshaland_work/node/node_modules/playwright/index.mjs';
import { spawn } from 'child_process';
const [a, b, outFile] = [+process.argv[2], +process.argv[3], process.argv[4]]; const FPS = 24;
const br = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: 1920, height: 1080 } });
await pg.goto('file://' + process.env.FILM, { waitUntil: 'load' });
for (let i = 0; i < 600; i++) { if (await pg.evaluate(() => window.__ready || window.__err)) break; await pg.waitForTimeout(100); }
const err = await pg.evaluate(() => window.__err); if (err) { console.error('SHADER ERROR\n' + err.slice(0, 3000)); process.exit(1); }
const ff = spawn(process.env.FFMPEG || 'ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-r', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', outFile], { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let f = a; f < b; f++) {
  const data = await pg.evaluate(t => { window.render(t); return document.getElementById('out').toDataURL('image/jpeg', 0.93); }, f / FPS);
  if (!ff.stdin.write(Buffer.from(data.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
  if ((f - a) % 24 === 0) console.log(`${outFile}: frame ${f}/${b} (${Math.round((Date.now() - t0) / 1000)}s)`);
}
ff.stdin.end(); await new Promise(r => ff.on('close', r)); await br.close();
