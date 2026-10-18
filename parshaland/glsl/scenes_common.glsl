// ── Shared scenes: channel intro, title card, Good Shabbos ──────────────────
// 0 — intro: golden sparks spiral in out of a deep night sky and burst into light (the overlay writes PARSHALAND)
vec3 sceneIntro(vec2 p, float lt) {
  vec3 col = mix(vec3(0.02, 0.025, 0.08), vec3(0.08, 0.09, 0.25), SAT(1.0 - length(p) * 0.9));
  col += vec3(0.25, 0.2, 0.5) * pow(fbm(p * 2.5 + vec2(uT * 0.03, 0.0)), 3.0) * 0.6;
  col += stars(p, uT) * 0.8;
  float gather = smoothstep(0.0, 3.2, lt); float burst = smoothstep(2.9, 3.5, lt) * (1.0 - smoothstep(4.5, 7.0, lt) * 0.6);
  for (int i = 0; i < 46; i++) { float fi = float(i); float a0 = hash1(fi * 3.7) * 6.2832; float r0 = 0.35 + 0.6 * hash1(fi * 1.3);
    float r = mix(r0, 0.02 + 0.03 * hash1(fi), gather) ; float a = a0 + (1.0 - gather) * 3.0 + uT * (0.2 + 0.3 * hash1(fi * 9.1));
    vec2 sp = vec2(cos(a), sin(a) * 0.62) * r; float d = length(p - sp);
    col += vec3(1.0, 0.82, 0.42) * (0.0009 / (d * d + 0.00025)) * 0.05 * (1.0 - burst * 0.8); }
  col += vec3(1.0, 0.85, 0.5) * burst * (0.05 / (dot(p, p) * 3.0 + 0.05)) * 0.6;
  col += vec3(1.0, 0.9, 0.6) * burst * pow(0.5 + 0.5 * sin(atan(p.y, p.x) * 18.0 + uT * 0.4), 10.0) * exp(-length(p) * 2.0) * 0.5;
  col += motes(p, uT, 0.02, 0.05, vec3(1.0, 0.85, 0.5) * 0.5, 0.03) * smoothstep(3.0, 4.0, lt);
  return col;
}
// 1 — title card: illuminated parchment (the overlay writes the parsha name)
vec3 sceneTitle(vec2 p, float lt) { return parchment(p, uT) + motes(p, uT, 0.03, 0.06, vec3(1.0, 0.85, 0.5) * 0.35, 0.03); }
vec3 sceneCard(vec2 p, float lt) { return parchment(p, uT) * 0.97 + motes(p, uT, 0.02, 0.05, vec3(1.0, 0.8, 0.5) * 0.25, 0.03); }
// 12 — Good Shabbos: two Shabbos candles and a covered challah on a white tablecloth, warm bokeh behind
vec3 sceneOutro(vec2 p, float lt) {
  vec3 col = mix(vec3(0.12, 0.05, 0.03), vec3(0.28, 0.12, 0.06), SAT(p.y + 0.6));
  for (int i = 0; i < 14; i++) { float fi = float(i); vec2 c = vec2(hash1(fi * 2.1) * 1.9 - 0.95, hash1(fi * 5.3) * 0.7 - 0.05); float r = 0.04 + 0.05 * hash1(fi * 7.7);
    col += vec3(1.0, 0.7, 0.35) * smoothstep(r, r * 0.8, length(p - c)) * (0.1 + 0.08 * sin(uT * 0.8 + fi)); }
  // table and tablecloth
  float table = -0.18; if (p.y < table) { col = vec3(0.92, 0.9, 0.86) * (0.78 + 0.22 * smoothstep(-0.55, table, p.y)) * (0.95 + 0.05 * sin(p.x * 60.0 + p.y * 10.0)); }
  // candlesticks and candles
  PX = 1.5 / uRes.y; LIGHT_TINT = vec3(1.0, 0.85, 0.65);
  for (int s = 0; s < 2; s++) { float x = s == 0 ? -0.33 : 0.33;
    ink(col, min(sdTrap(p - vec2(x, -0.2), 0.0, 0.03, 0.06, 0.02, 0.0), sdBox2(p - vec2(x, -0.1), vec2(0.012, 0.08))) - 0.004, vec3(0.85, 0.85, 0.88), p * 4.0);
    ink(col, sdBox2(p - vec2(x, 0.06), vec2(0.022, 0.09)) - 0.004, vec3(0.97, 0.96, 0.92), p * 4.0);
    vec2 fq = (p - vec2(x, 0.155)) / 0.06; col += flame(fq, uT, float(s) * 3.0) * 1.5;
    col += vec3(1.0, 0.7, 0.35) * 0.25 * exp(-length(p - vec2(x, 0.19)) * 5.0); }
  // challah under its embroidered cover
  vec2 ch = p - vec2(0.0, -0.17); float cover = sdE2(ch - vec2(0.0, 0.05), vec2(0.2, 0.08)); cover = max(cover, -ch.y + 0.0);
  col = mix(col, vec3(0.55, 0.12, 0.15) * (0.6 + 0.4 * SAT(ch.y * 10.0 + 0.5)) + vec3(0.8, 0.6, 0.2) * 0.25 * step(abs(abs(ch.x) - 0.15), 0.008), fill(cover));
  col = mix(col, vec3(0.9, 0.72, 0.3), fill(max(abs(ch.y - 0.035) - 0.006, cover + 0.004)));
  return col;
}
