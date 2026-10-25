// ── Overlay: everything drawn as text on top of the shaders (titles, pasuk label, subtitles, scene labels) ──
const SANS = '"HebSans", "LatSans", "DejaVu Sans", sans-serif';
const SERIF = '"HebSerif", "LatSerif", "DejaVu Serif", serif';
const GOLD = '#e8b84a', GOLD_L = '#ffd98a', BROWN = '#5a3412';
function sm(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
function fadeIn(t, a, d = 0.6) { if (d === undefined || typeof a !== 'number') return 1; return sm(a, a + d, t); }
function wrap(ctx, text, maxW) { const words = text.split(' '); const lines = []; let line = '';
  for (const w of words) { const test = line ? line + ' ' + w : w; if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test; }
  if (line) lines.push(line); return lines; }
function txt(s, x, y, font, color, alpha = 1, align = 'center', shadow = null) {
  if (alpha <= 0) return; o2.save(); o2.globalAlpha = Math.min(1, alpha); o2.font = font; o2.fillStyle = color; o2.textAlign = align; o2.textBaseline = 'middle';
  if (shadow) { o2.shadowColor = shadow; o2.shadowBlur = 18; o2.shadowOffsetY = 4; } o2.fillText(s, x, y); o2.restore(); }
function scrollIcon(x, y, a) { o2.save(); o2.globalAlpha = a; o2.fillStyle = '#f3e2b8'; o2.strokeStyle = '#8a5a26'; o2.lineWidth = 2.5;
  o2.beginPath(); o2.roundRect(x - 11, y - 12, 22, 24, 3); o2.fill(); o2.stroke(); o2.fillStyle = '#a0682c';
  for (const dx of [-13, 13]) { o2.beginPath(); o2.roundRect(x + dx - 3, y - 15, 6, 30, 3); o2.fill(); } o2.restore(); }
function drawOverlay(t, i, g) {
  const lt = t - g.start, L = g.end - g.start, out = 1 - sm(L - 0.5, L, lt);
  // channel intro
  if (g.name === 'intro') { const k = sm(3.2, 4.2, lt) * out;
    txt(TL.channel || 'PARSHALAND', 960, 520, `bold 150px ${SERIF}`, GOLD_L, k, 'center', 'rgba(255,190,80,0.9)');
    txt('Torah stories for kids', 960, 640, `italic 46px ${SERIF}`, '#fff1d6', sm(3.8, 4.8, lt) * out, 'center', 'rgba(0,0,0,0.6)'); return; }
  // title card on parchment
  if (g.name === 'title') { const k = sm(0.2, 1.0, lt) * out;
    txt('PARSHAS', 960, 300, `bold 44px ${SERIF}`, '#b07a2a', k);
    txt(TL.parsha, 960, 420, `bold 150px ${SERIF}`, BROWN, k);
    txt(TL.parshaHeb, 960, 560, `bold 96px ${SERIF}`, '#7a4a1e', sm(0.6, 1.4, lt) * out);
    txt(TL.range, 960, 680, `bold 40px ${SERIF}`, '#6a4a2a', sm(1.0, 1.8, lt) * out);
    txt(TL.shabbos, 960, 740, `italic 30px ${SERIF}`, '#8a6a4a', sm(1.2, 2.0, lt) * out); return; }
  // Good Shabbos
  if (g.name === 'outro') { const k = sm(0.4, 1.4, lt);
    txt('Good Shabbos!', 960, 330, `bold 120px ${SERIF}`, GOLD_L, k, 'center', 'rgba(255,170,60,0.9)');
    txt('שַׁבָּת שָׁלוֹם', 960, 460, `bold 80px ${SERIF}`, '#fff1d6', sm(1.0, 2.0, lt), 'center', 'rgba(0,0,0,0.6)');
    txt('See you next week!', 960, 1010, `italic 34px ${SERIF}`, '#8a6a4a', sm(1.6, 2.6, lt)); }
  // the pasuk reference, top left
  if (g.src) { const k = fadeIn(lt, 0.2, 0.6) * out; o2.save(); o2.globalAlpha = k * 0.92; o2.fillStyle = 'rgba(25,14,6,0.55)'; o2.font = `bold 30px ${SANS}`;
    const sw = o2.measureText(g.src).width; o2.beginPath(); o2.roundRect(70, 60, 100 + sw, 64, 32); o2.fill(); o2.restore();
    scrollIcon(112, 92, k); txt(g.src, 140, 93, `bold 30px ${SANS}`, GOLD_L, k, 'left'); }
  // Noach: the year counter while building
  if (g.name === 'building') { const yr = Math.max(1, Math.min(120, Math.round(1 + 119 * Math.min(1, lt / Math.max(1, L - 2))))); const k = fadeIn(lt, 0.5) * out;
    txt('YEAR', 1720, 95, `bold 30px ${SANS}`, GOLD_L, k, 'center', 'rgba(0,0,0,0.8)'); txt(String(yr), 1720, 160, `bold 90px ${SERIF}`, '#fff3d6', k, 'center', 'rgba(0,0,0,0.8)'); }
  // Bereishis: Adam names the animals (Hebrew names above each animal as it is named)
  if (g.name === 'adam') { const N = ['אַרְנֶבֶת', 'כֶּבֶשׂ', 'אַרְיֵה', 'פִּיל']; const Hh = [0.11, 0.17, 0.26, 0.36]; const kk = lt / Math.max(1, L);
    N.forEach((w, j) => { const t0 = 0.2 + j * 0.08; const k = Math.min(1, Math.max(0, (kk - t0) / 0.03)) * out; if (k <= 0) return;
      const x = 0.1 + j * 0.22, y = -0.3 + 0.01 * j + Hh[j] + 0.06; txt(w, 960 + x * 1080, 540 - y * 1080, `bold 46px ${SANS}`, '#fff6dc', k, 'center', 'rgba(0,0,0,0.85)'); }); }
  // Bereishis: the first Shabbos
  if (g.name === 'shabbos') { const k = fadeIn(lt, 2.5, 1.5) * out; txt('שַׁבָּת', 960, 250, `bold 120px ${SERIF}`, '#fff1c8', k * 0.95, 'center', 'rgba(120,60,0,0.6)'); }
  // Bereishis: ten generations, each name beside its lantern as it lights
  if (g.name === 'generations') { const N = ['אָדָם', 'שֵׁת', 'אֱנוֹשׁ', 'קֵינָן', 'מַהֲלַלְאֵל', 'יֶרֶד', 'חֲנוֹךְ', 'מְתוּשֶׁלַח', 'לֶמֶךְ', 'נֹחַ']; const kk = lt / Math.max(1, L);
    N.forEach((w, j) => { const k = Math.min(1, Math.max(0, (kk - (0.06 + j * 0.08)) / 0.04)) * out; if (k <= 0) return;
      const x = -0.78 + j * 0.172, y = -0.38 + 0.065 * Math.sin(j * 1.3) + j * 0.048; const big = j === 0 || j === 6 || j === 7 || j === 9;
      txt(w, 960 + x * 1080, 540 - (y + 0.07) * 1080, `bold ${big ? 40 : 32}px ${SANS}`, j === 9 ? '#d8f0ff' : '#fff1d0', k, 'center', 'rgba(0,0,0,0.85)');
      if (j === 0) txt('930', 960 + x * 1080, 540 - (y + 0.135) * 1080, `bold 26px ${SANS}`, GOLD_L, k, 'center', 'rgba(0,0,0,0.85)');
      if (j === 7) txt('969', 960 + x * 1080, 540 - (y + 0.135) * 1080, `bold 26px ${SANS}`, GOLD_L, k, 'center', 'rgba(0,0,0,0.85)'); }); }
  // Lech Lecha: the new name — אַבְרָם, then the ה is added: אַבְרָהָם
  if (g.name === 'name') { const kk = lt / Math.max(1, L);
    const a = Math.min(1, Math.max(0, (kk - 0.36) / 0.05)) * out, b = Math.min(1, Math.max(0, (kk - 0.5) / 0.06)) * out;
    if (a > 0 && b < 1) txt('אַבְרָם', 1240, 250, `bold 130px ${SERIF}`, '#fff6dc', a * (1 - b), 'center', 'rgba(60,30,0,0.7)');
    if (b > 0) { txt('אַבְרָהָם', 1240, 250, `bold 130px ${SERIF}`, '#fff6dc', b, 'center', 'rgba(60,30,0,0.7)');
      const pulse = 0.6 + 0.4 * Math.sin(lt * 4); txt('ה', 1400, 120, `bold 90px ${SERIF}`, GOLD_L, b * pulse, 'center', 'rgba(120,60,0,0.8)'); } }
  // Vayera: Avraham's prayer for Sedom — the numbers count down with his words (50, then 45 … 10, then the ? of "not even ten")
  if (g.name === 'prayer' && g.lines.length >= 3) { const l1 = g.lines[1], l2 = g.lines[2]; let n = null, k = 0;
    if (t >= l1.start + 0.3 * l1.dur && t < l2.start) { n = '50'; k = sm(l1.start + 0.3 * l1.dur, l1.start + 0.3 * l1.dur + 0.4, t); }
    else if (t >= l2.start) { const NN = ['45', '40', '30', '20', '10']; const f = (t - l2.start) / (0.62 * l2.dur); const i = Math.min(4, Math.floor(f)); n = f < 5.4 ? NN[i] : '?'; k = 1; }
    if (n) { const pop = 1 + 0.25 * Math.max(0, 1 - ((t - l2.start) / (0.62 * l2.dur) % 1) * 4) * (t >= l2.start ? 1 : 0);
      o2.save(); o2.translate(1500, 300); o2.scale(pop, pop); txt(n, 0, 0, `bold 170px ${SERIF}`, GOLD_L, k * out, 'center', 'rgba(120,60,0,0.85)'); o2.restore(); } }
  // Vayera: the baby's name, יִצְחָק, as it is said
  if (g.name === 'birth' && g.lines.length >= 2) { const l1 = g.lines[1]; const k = sm(l1.start + 0.15, l1.start + 0.8, t) * (1 - sm(l1.start + l1.dur + 0.3, l1.start + l1.dur + 0.9, t));
    if (k > 0) { const pulse = 1 + 0.04 * Math.sin(t * 4); o2.save(); o2.translate(560, 240); o2.scale(pulse, pulse); txt('יִצְחָק', 0, 0, `bold 140px ${SERIF}`, '#fff6dc', k, 'center', 'rgba(140,70,0,0.75)'); o2.restore(); } }
  // subtitles (kids read along)
  const ln = g.lines.find(l => t >= l.start - 0.1 && t < l.start + l.dur + 0.25);
  if (ln && g.name !== 'title') { const k = Math.min(sm(ln.start - 0.1, ln.start + 0.1, t), 1 - sm(ln.start + ln.dur + 0.05, ln.start + ln.dur + 0.25, t));
    o2.save(); o2.font = `bold 40px ${SANS}`; const lines = wrap(o2, ln.text, 1500); const w = Math.max(...lines.map(l => o2.measureText(l).width)) + 70; o2.restore();
    const h = lines.length * 54 + 30, y0 = 1040 - h; o2.save(); o2.globalAlpha = k * 0.78; o2.fillStyle = 'rgba(12,8,4,0.7)'; o2.beginPath(); o2.roundRect(960 - w / 2, y0, w, h, 24); o2.fill(); o2.restore();
    lines.forEach((l, j) => txt(l, 960, y0 + 42 + j * 54, `bold 40px ${SANS}`, '#fffaf0', k)); }
}
