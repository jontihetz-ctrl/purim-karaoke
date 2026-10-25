# Step 3 of the parsha template: visuals.
# Builds build/<id>/film.html — a self-contained WebGL2 film: one fragment-shader program per scene (GLSL in glsl/),
# crossfades between scenes, bloom + ACES grade (POST), and a 2D overlay for text (overlay.js) on top.
# window.render(t) draws the frame at time t onto <canvas id="out"> (used by render.mjs and stills.mjs).
# Usage: python3 build.py <episode-id>
import json, sys, pathlib
EP = sys.argv[1]
here = pathlib.Path(__file__).parent
TL = json.load(open(here / 'build' / EP / 'timeline.json'))
G = here / 'glsl'
LIB = ''.join((G / f).read_text() + '\n' for f in ['lib.glsl', 'chars.glsl', 'animals.glsl', 'kit.glsl', 'life.glsl', 'scenes_common.glsl', 'scenes_bereishis.glsl', 'scenes_lechlecha.glsl', 'scenes_vayera.glsl'] if (G / f).exists())
SCENE_FN = {0: 'sceneIntro', 1: 'sceneTitle', 11: 'sceneCard', 12: 'sceneOutro',
            15: 'sceneCreation', 16: 'sceneCreation2', 17: 'sceneAdam', 18: 'sceneShabbos', 19: 'sceneGan', 20: 'sceneNachash', 21: 'sceneExile', 22: 'sceneKayin', 23: 'sceneGenerations',
            24: 'sceneCall', 25: 'sceneJourney', 26: 'sceneMitzrayim', 27: 'sceneParting', 28: 'sceneWar', 29: 'sceneMalki', 30: 'sceneStars', 31: 'sceneName', 32: 'scenePromise',
            33: 'sceneVisit', 34: 'sceneGuests', 35: 'sceneLaugh', 36: 'scenePrayer', 37: 'sceneSedom', 38: 'sceneBirth', 39: 'sceneMoriah', 40: 'sceneAkeidah', 41: 'sceneBlessing'}
# scenes with a slow cinematic push-in (not the cards, and not scenes whose overlay labels sit on scene positions)
PUSH = {15, 16, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41}
# per-scene exposure
EXPO = {0: 1.0, 1: 1.0, 11: 1.0, 12: 1.1, 15: 1.0, 16: 0.95, 17: 0.9, 18: 0.85, 19: 0.88, 20: 0.95, 21: 1.0, 22: 0.92, 23: 1.0,
        24: 0.78, 25: 0.8, 26: 0.82, 27: 0.78, 28: 1.1, 29: 0.8, 30: 1.15, 31: 0.78, 32: 0.76,
        33: 0.74, 34: 0.78, 35: 0.78, 36: 0.95, 37: 0.92, 38: 0.78, 39: 0.82, 40: 0.74, 41: 1.0}
used = sorted({s['scene'] for s in TL['segments']})
missing = [u for u in used if u not in SCENE_FN]
if missing: raise SystemExit(f'no shader for scene ids {missing}')
def program(sid):
    push = 'p = p * (1.0 - 0.05 * k) + vec2(0.0, 0.01 * k);' if sid in PUSH else ''
    return f"""#version 300 es
precision highp float;
out vec4 fragColor;
{LIB}
void main() {{
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float k = smoothstep(0.0, 1.0, SAT(uLT / max(uDur, 1.0))); {push}
  vec3 col = {SCENE_FN[sid]}(p, uLT);
  fragColor = vec4(max(col, 0.0), 1.0);
}}"""
SHADERS = {str(s): program(s) for s in used}
POST = r'''#version 300 es
precision highp float;
uniform sampler2D uA, uB; uniform float uMix; uniform vec2 uRes; uniform int uMode; uniform vec2 uDir;
uniform sampler2D uBloom; uniform float uT, uExposure;
out vec4 o;
vec3 src(vec2 uv) { return mix(texture(uA, uv).rgb, texture(uB, uv).rgb, uMix); }
float h(vec2 p) { p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }
vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  if (uMode == 0) { // bright pass + downsample
    vec3 c = vec3(0); for (int i = 0; i < 4; i++) { vec2 o2 = vec2(i % 2, i / 2) - 0.5; c += src(uv + o2 * 1.5 / vec2(textureSize(uA, 0))); }
    c *= 0.25; float l = max(c.r, max(c.g, c.b)); o = vec4(c * smoothstep(0.8, 2.0, l), 1); return; }
  if (uMode == 1) { // separable gaussian blur
    vec3 c = vec3(0); float w[5] = float[](0.227, 0.194, 0.121, 0.054, 0.016);
    c += texture(uA, uv).rgb * w[0];
    for (int i = 1; i < 5; i++) { c += texture(uA, uv + uDir * float(i) / uRes).rgb * w[i]; c += texture(uA, uv - uDir * float(i) / uRes).rgb * w[i]; }
    o = vec4(c, 1); return; }
  // composite: slight chromatic aberration, bloom, ACES, grade, vignette, grain
  vec2 d = uv - 0.5; float r2 = dot(d, d);
  vec3 c = vec3(src(uv + d * 0.0035 * r2 * 4.0).r, src(uv).g, src(uv - d * 0.0035 * r2 * 4.0).b);
  c += texture(uBloom, uv).rgb * 0.5;
  c *= uExposure;
  c = aces(c);
  c = pow(c, vec3(0.95));
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  c = mix(c, c * vec3(0.96, 1.0, 1.04), smoothstep(0.45, 0.0, lum) * 0.2);
  c = mix(c, c * vec3(1.1, 1.0, 0.85), smoothstep(0.35, 1.0, lum) * 0.35);  // warm highlights
  c = mix(vec3(lum), c, 1.32); c = smoothstep(0.0, 1.0, c) * 0.4 + c * 0.6; // punchier contrast
  c *= 1.0 - smoothstep(0.15, 0.75, r2) * 0.55;                              // vignette
  c += (h(gl_FragCoord.xy + fract(uT * 7.3) * 100.0) - 0.5) * 0.025;           // fine film grain
  o = vec4(c, 1);
}'''
fonts = (here / 'fonts').resolve()
HTML = r'''<!doctype html><html><head><meta charset="utf-8"><title>Parshaland film</title>
<style>
@font-face{font-family:'HebSans';src:url('file://%FONTS%/NotoSansHebrew.ttf');font-weight:700;unicode-range:U+0590-05FF,U+FB1D-FB4F}
@font-face{font-family:'HebSerif';src:url('file://%FONTS%/FrankRuhlLibre.ttf');font-weight:700;unicode-range:U+0590-05FF,U+FB1D-FB4F}
@font-face{font-family:'LatSans';src:url('file://%FONTS%/NotoSans.ttf');font-weight:700}
@font-face{font-family:'LatSerif';src:url('file://%FONTS%/FrankRuhlLibre.ttf');font-weight:700}
html,body{margin:0;background:#000}canvas{display:block}#gl{display:none}</style></head><body>
<canvas id="gl" width="1920" height="1080"></canvas><canvas id="out" width="1920" height="1080"></canvas>
<script>
const TL = %TL%; const SH = %SHADERS%; const POST = %POST%; const EXPO = %EXPO%;
const W = 1920, H = 1080;
const glc = document.getElementById('gl'); const gl = glc.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
const out = document.getElementById('out'); const o2 = out.getContext('2d');
const hdr = !!gl.getExtension('EXT_color_buffer_float');
const VS = '#version 300 es\nvoid main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.0-1.0,0,1);}';
function compile(src) { const p = gl.createProgram(); for (const [t, s] of [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, src]]) { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { const e = gl.getShaderInfoLog(sh); window.__err = e; throw new Error(e); } gl.attachShader(p, sh); }
  gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { window.__err = gl.getProgramInfoLog(p); throw new Error(window.__err); } return p; }
function target(w, h) { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, hdr ? gl.RGBA16F : gl.RGBA8, w, h, 0, gl.RGBA, hdr ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE, null);
  for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
  const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0); return { t, f, w, h }; }
let progs = {}, post, A, B, B1, B2;
function u(p, n) { return gl.getUniformLocation(p, n); }
function drawScene(seg, t, tgt) { const p = progs[seg.scene]; gl.useProgram(p); gl.bindFramebuffer(gl.FRAMEBUFFER, tgt.f); gl.viewport(0, 0, tgt.w, tgt.h);
  gl.uniform2f(u(p, 'uRes'), tgt.w, tgt.h); gl.uniform1f(u(p, 'uT'), t); gl.uniform1f(u(p, 'uLT'), t - seg.start); gl.uniform1f(u(p, 'uDur'), seg.end - seg.start);
  const ls = seg.lines.map(l => l.start - seg.start).slice(0, 6); while (ls.length < 6) ls.push(seg.end - seg.start); gl.uniform1fv(u(p, 'uLS[0]'), new Float32Array(ls)); gl.drawArrays(gl.TRIANGLES, 0, 3); }
function postPass(mode, tA, tB, mix, tgt, dir, bloom, expo, t) { gl.useProgram(post); gl.bindFramebuffer(gl.FRAMEBUFFER, tgt ? tgt.f : null); const w = tgt ? tgt.w : W, h = tgt ? tgt.h : H; gl.viewport(0, 0, w, h);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tA); gl.uniform1i(u(post, 'uA'), 0);
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tB || tA); gl.uniform1i(u(post, 'uB'), 1);
  gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, bloom || tA); gl.uniform1i(u(post, 'uBloom'), 2);
  gl.uniform1f(u(post, 'uMix'), mix); gl.uniform2f(u(post, 'uRes'), w, h); gl.uniform1i(u(post, 'uMode'), mode); gl.uniform2f(u(post, 'uDir'), dir ? dir[0] : 0, dir ? dir[1] : 0);
  gl.uniform1f(u(post, 'uExposure'), expo || 1.0); gl.uniform1f(u(post, 'uT'), t || 0); gl.drawArrays(gl.TRIANGLES, 0, 3); }
const XF = 0.4;   // half-length of the crossfade between scenes
function segAt(t) { const S = TL.segments; for (let i = 0; i < S.length; i++) if (t < S[i].end) return i; return S.length - 1; }
window.render = function (t) {
  const S = TL.segments, i = segAt(t), seg = S[i]; let other = null, mix = 0;
  if (i > 0 && t - seg.start < XF) { other = S[i - 1]; mix = 0.5 * (1 - (t - seg.start) / XF); }
  else if (i + 1 < S.length && seg.end - t < XF) { other = S[i + 1]; mix = 0.5 * (1 - (seg.end - t) / XF); }
  drawScene(seg, t, A); if (other) drawScene(other, t, B);
  const expo = (EXPO[seg.scene] || 1) * (1 - mix) + (other ? (EXPO[other.scene] || 1) : 0) * mix;
  postPass(0, A.t, other ? B.t : null, mix, B1);
  postPass(1, B1.t, null, 0, B2, [1.5, 0]); postPass(1, B2.t, null, 0, B1, [0, 1.5]); postPass(1, B1.t, null, 0, B2, [3, 0]); postPass(1, B2.t, null, 0, B1, [0, 3]);
  postPass(2, A.t, other ? B.t : null, mix, null, null, B1.t, expo, t);
  o2.globalAlpha = 1; o2.drawImage(glc, 0, 0);
  drawOverlay(t, i, seg);
};
%OVERLAY%
Promise.all(['HebSans', 'HebSerif'].map(f => document.fonts.load(`bold 40px ${f}`, 'אָ'))).then(() => Promise.all(['LatSans', 'LatSerif'].map(f => document.fonts.load(`bold 40px ${f}`, 'Aa')))).then(() => document.fonts.ready).then(() => {
  try { post = compile(POST); for (const s of Object.keys(SH)) progs[s] = compile(SH[s]);
    A = target(W, H); B = target(W, H); B1 = target(W / 4, H / 4); B2 = target(W / 4, H / 4); window.__ready = true; } catch (e) { window.__err = window.__err || String(e); }
});
</script></body></html>'''
html = HTML.replace('%FONTS%', str(fonts)).replace('%TL%', json.dumps(TL, ensure_ascii=False)).replace('%SHADERS%', json.dumps(SHADERS)).replace('%POST%', json.dumps(POST)) \
           .replace('%EXPO%', json.dumps({str(k): v for k, v in EXPO.items()})).replace('%OVERLAY%', (here / 'overlay.js').read_text())
(here / 'build' / EP / 'film.html').write_text(html)
print('film.html', len(html), 'scenes', used)
