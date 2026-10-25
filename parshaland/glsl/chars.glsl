// ── Characters: shading (ink), the Person rig, presets ──
float PX = 0.002;                      // anti-alias width in local units (set per character)
vec3 LIGHT_TINT = vec3(1.0);            // scene light colour on characters
float RIM = 0.0; vec3 RIM_COL = vec3(1.0, 0.8, 0.5);

// Draw one shape with volume: outline, pillow shading (light upper-left front), cool shadows, warm bounce, rim light; optional cast shadow.
float SHADOW = 0.0;                     // characters switch this on for their inner layers
float VOL = 1.0;                        // 1 = full volume shading, 0 = classic soft shading (for fiddly detail shapes)
const vec3 LDIR = vec3(-0.55, 0.62, 0.6) / 1.0247;
void ink(inout vec3 col, float d, vec3 c, vec2 q) {
  const float o = 0.0045;
  vec2 g = vec2(dFdx(d), dFdy(d)) * (1.5 / PX);                                  // SDF gradient (outward), unit length on clean edges
  float g2 = dot(g, g); float gw = smoothstep(0.15, 0.5, g2) * smoothstep(6.0, 2.5, g2);   // fade out where the gradient is unreliable
  vec2 nrm = g * (inversesqrt(max(g2, 1e-6)) * gw * VOL);
  float edge = smoothstep(PX, -PX, d), fillA = smoothstep(PX, -PX, d + o);
  col *= 1.0 - 0.3 * SHADOW * gw * SAT((0.022 - d + dot(g, vec2(0.016, -0.022))) * 38.0) * (1.0 - edge);   // cast shadow on inner layers
  float depth = SAT((-d - o) * 14.0);                                          // 0 at the rim, 1 inside: pillow profile
  vec3 n = vec3(nrm * ((1.0 - depth) * 0.95), 0.35 + depth);
  float ndl = dot(n, LDIR) * inversesqrt(dot(n, n));
  vec3 tone = mix(vec3(0.6, 0.62, 0.78), vec3(1.06, 1.03, 0.98), SAT((ndl - 0.18) * 3.1));   // cool shadow side, warm lit side
  vec3 sh = c * (LIGHT_TINT * tone + vec3(0.16, 0.13, 0.1) * (SAT(-n.y) * (1.0 - depth)));  // warm bounce from below
  sh *= mix(0.86 + 0.24 * SAT(0.5 - q.x * 1.2 + (q.y - 0.5) * 0.6) + 0.1 * depth, 1.0, VOL);   // classic shading for detail shapes
  sh += RIM_COL * (RIM * 0.25 * SAT((0.02 + d + o) * 50.0) * fillA);
  col = mix(col, c * 0.26 * LIGHT_TINT, edge);
  col = mix(col, sh, fillA);
}
struct Person {
  vec3 robe, trim, skin, beard, wrap;
  float beardLen;       // 0 = short, 1 = long flowing (Noach), negative = no beard (a child)
  float facing;         // +1 right, -1 left
  vec2 armF;            // front arm: shoulder angle, elbow bend (radians, 0 = straight down)
  vec2 armB;            // back arm
  float talk;           // 0..1 mouth open
  float walk;           // walk phase (radians), 0 = standing
  float blink;          // 1 = eyes open
  float brow;           // eyebrow raise (surprise) 0..1
  int tool;             // 0 none 1 hammer 2 bucket 3 plank 4 staff 5 saw 6 brick
  float look;           // pupil offset (-1..1)
  float sit;            // 1 = sitting (on the ground or a cushion), legs forward
  float female;         // 1 = a woman, dressed modestly: tichel covering all the hair, high neckline, long sleeves, floor-length dress, no beard
};
Person defaultPerson() { Person P; P.robe = vec3(0.6, 0.45, 0.3); P.trim = vec3(0.8, 0.65, 0.3); P.skin = vec3(0.92, 0.72, 0.56); P.beard = vec3(0.3, 0.2, 0.12);
  P.wrap = vec3(0.9, 0.88, 0.82); P.beardLen = 0.3; P.facing = 1.0; P.armF = vec2(0.15, 0.3); P.armB = vec2(-0.1, 0.2); P.talk = 0.0; P.walk = 0.0; P.blink = 1.0; P.brow = 0.0; P.tool = 0; P.look = 0.3; P.female = 0.0; P.sit = 0.0; return P; }

vec2 armPoint(vec2 sh, vec2 a, float upper, float lower, out vec2 elbow) {
  elbow = sh + vec2(sin(a.x), -cos(a.x)) * upper;
  float a2 = a.x + a.y; return elbow + vec2(sin(a2), -cos(a2)) * lower;
}
void drawTool(inout vec3 col, vec2 q, vec2 hand, float ang, int tool) {
  vec2 dir = vec2(sin(ang), -cos(ang)); vec2 nrm = vec2(-dir.y, dir.x);
  if (tool == 1) { float h = sdCap2(q, hand - dir * 0.03, hand + dir * 0.17, 0.012); ink(col, h, vec3(0.55, 0.35, 0.18), q);
    vec2 hc = hand + dir * 0.17; vec2 l = vec2(dot(q - hc, nrm), dot(q - hc, dir)); ink(col, sdBox2(l, vec2(0.05, 0.022)) - 0.005, vec3(0.45, 0.47, 0.52), q); }
  else if (tool == 2) { vec2 b = q - hand - vec2(0.0, -0.08); float bucket = sdTrap(b, -0.06, 0.04, 0.045, 0.06, 0.0) - 0.006; ink(col, bucket, vec3(0.55, 0.38, 0.2), q);
    ink(col, sdBox2(b - vec2(0.0, -0.01), vec2(0.06, 0.008)), vec3(0.4, 0.3, 0.2), q); col = mix(col, vec3(0.8, 0.7, 0.3), smoothstep(PX, -PX, sdE2(b - vec2(0.0, 0.045), vec2(0.05, 0.012)))); }
  else if (tool == 3) { vec2 l = vec2(dot(q - hand, nrm), dot(q - hand, dir)); ink(col, sdBox2(l - vec2(0.0, 0.0), vec2(0.03, 0.32)) - 0.004, vec3(0.75, 0.55, 0.3), q); }
  else if (tool == 4) { ink(col, sdCap2(q, hand - dir * 0.35, hand + dir * 0.45, 0.012), vec3(0.5, 0.33, 0.18), q); }
  else if (tool == 5) { vec2 l = vec2(dot(q - hand, nrm), dot(q - hand, dir)); ink(col, sdBox2(l - vec2(0.0, 0.14), vec2(0.035, 0.12)) - 0.002, vec3(0.75, 0.77, 0.82), q); ink(col, sdBox2(l - vec2(0.0, 0.0), vec2(0.03, 0.03)), vec3(0.55, 0.35, 0.18), q); }
  else if (tool == 6) { ink(col, sdBox2(q - hand - vec2(0.0, 0.03), vec2(0.06, 0.03)) - 0.004, vec3(0.75, 0.4, 0.22), q); }
}
// Draw a person at `pos` with height `h` (screen units). Cartoon proportions: big head, flowing robe, open coat.
void drawPerson(inout vec3 col, vec2 p, vec2 pos, float h, Person P) {
  vec2 q = (p - pos) / h; q.x *= P.facing; PX = 1.5 / (uRes.y * h);
  if (abs(q.x) > 0.65 || q.y < -0.06 || q.y > 1.12) return;
  // soft contact shadow on the ground
  col *= 1.0 - 0.28 * smoothstep(1.0, 0.0, length(vec2(q.x / 0.28, (q.y + 0.005) / 0.035)));
  float bob = abs(sin(P.walk)) * 0.014 * step(0.001, abs(P.walk)); q.y -= bob;
  float qy0 = q.y; q.y += P.sit * 0.22;                                         // sitting: the body sinks, the robe folds into a lap
  float sway = sin(P.walk) * 0.02;
  vec3 coat = P.robe, tunic = P.trim;
  vec2 shF = vec2(0.105, 0.56), shB = vec2(-0.115, 0.56);
  vec2 elB; vec2 hB = armPoint(shB, P.armB, 0.17, 0.16, elB);
  vec2 elF; vec2 hF = armPoint(shF, P.armF, 0.17, 0.16, elF);
  // back arm: bell sleeve + hand
  ink(col, min(sdCap2(q, shB, elB, 0.05), sdSeg2(q, elB, hB, 0.05, 0.064)), coat * 0.78, q);
  VOL = 0.0; ink(col, sdE2(q - hB, vec2(0.03, 0.034)), P.skin * 0.88, q);
  // sandals peeking out under the hem
  float stepA = sin(P.walk) * 0.045;
  if (P.sit < 0.5) { ink(col, sdE2(q - vec2(0.075 + stepA, 0.018), vec2(0.055, 0.02)), vec3(0.42, 0.26, 0.14), q);
  ink(col, sdE2(q - vec2(-0.055 - stepA, 0.018), vec2(0.055, 0.02)), vec3(0.36, 0.22, 0.12), q); }
  // flowing A-line robe (coat colour), wavy hem
  vec2 rq = q - vec2(sway * (0.62 - q.y), 0.0);
  float k = SAT((rq.y - 0.03) / 0.57); float wdt = mix(0.235, 0.15, pow(k, 0.8));
  float hemY = 0.03 + 0.008 * sin(rq.x * 45.0 + P.walk);
  float robe = max(abs(rq.x - 0.01 * (1.0 - k)) - wdt, max(hemY - rq.y, rq.y - 0.6)) - 0.012;
  robe = smin(robe, sdE2(q - vec2(-0.005, 0.57), vec2(0.165, 0.065)), 0.05);
  float folds = 0.9 + 0.1 * sin(rq.x * 34.0 + 3.0 * sin(rq.y * 6.0)) * SAT(0.65 - rq.y);
  if (P.sit > 0.5) robe = max(robe, -qy0);
  VOL = 1.0; ink(col, robe, coat * folds, q);
  if (P.sit > 0.5) { vec2 lq = vec2(q.x, qy0); ink(col, sdE2(lq - vec2(0.3, 0.02), vec2(0.05, 0.02)), vec3(0.42, 0.26, 0.14), lq);
    ink(col, max(sdE2(lq - vec2(0.12, 0.08), vec2(0.22, 0.085)), -lq.y), coat * 0.93, lq); }
  VOL = 0.0;
  if (P.female < 0.5) {
  // the inner tunic shows in a V from the collar down to the belt (no vertical stripe below the belt)
  float vx = 0.03 + 0.0 * rq.y; float vW = mix(0.065, 0.0, SAT((0.59 - rq.y) / 0.25));
  float vneck = max(abs(rq.x - vx) - vW, max(0.34 - rq.y, rq.y - 0.6));
  col = mix(col, tunic * LIGHT_TINT * (0.9 + 0.1 * sin(rq.y * 90.0)), smoothstep(PX, -PX, max(vneck, robe + 0.01)));
  col = mix(col, coat * 0.35 * LIGHT_TINT, smoothstep(PX, -PX, max(abs(abs(rq.x - vx) - vW) - 0.004, max(max(0.34 - rq.y, rq.y - 0.6), robe + 0.01))));
  } else {   // a high, rounded neckline with a soft trim
    float collar = abs(length((rq - vec2(0.012, 0.6)) * vec2(1.0, 1.7)) - 0.075) - 0.011;
    col = mix(col, tunic * LIGHT_TINT, smoothstep(PX, -PX, max(collar, max(robe + 0.01, rq.y - 0.62))));
  }
  // belt / sash with a knot and hanging ends on the near side
  float belt = max(abs(rq.y - 0.335 - 0.03 * rq.x) - 0.02, robe + 0.008);
  col = mix(col, tunic * 0.8 * LIGHT_TINT, smoothstep(PX, -PX, belt));
  ink(col, min(sdCap2(q, vec2(0.13, 0.33), vec2(0.15 + sway, 0.2), 0.012), sdE2(q - vec2(0.125, 0.335), vec2(0.022, 0.018))), tunic * 0.75, q);
  // neck
  ink(col, sdBox2(q - vec2(0.012, 0.645), vec2(0.04, 0.035)), P.skin * 0.82, q);
  // head (bigger, rounder)
  vec2 hc = vec2(0.02, 0.785);
  float face = sdE2(q - hc, vec2(0.122, 0.135));
  ink(col, sdE2(q - vec2(-0.085, 0.775), vec2(0.026, 0.038)), P.skin * 0.95, q);
  VOL = 0.8; ink(col, face, P.skin, q); VOL = 0.0;
  col = mix(col, vec3(1.0, 0.5, 0.45) * LIGHT_TINT, smoothstep(0.035, 0.0, length(q - vec2(0.085, 0.75))) * 0.32);
  col = mix(col, vec3(1.0, 0.5, 0.45) * LIGHT_TINT, smoothstep(0.03, 0.0, length(q - vec2(-0.02, 0.75))) * 0.18);
  if (P.female < 0.5 && P.beardLen >= 0.0) {
  // beard: long & wavy for Noach, short and neat for younger men
  float bl = P.beardLen;
  vec2 bq = q - vec2(0.03, 0.7 - bl * 0.1);
  float beard = sdE2(bq, vec2(0.108 - bl * 0.012, 0.07 + bl * 0.1)) + 0.012 * sin(bq.x * 60.0) * smoothstep(0.0, -0.1, bq.y) * bl;
  beard = max(beard, q.y - 0.765); beard = min(beard, max(face - 0.004, max(q.y - 0.765, -q.x - 0.075)));
  float strands = 0.88 + 0.14 * sin(q.x * 140.0 + sin(q.y * 30.0) * 3.0);
  ink(col, beard, P.beard * strands, q);
  ink(col, min(sdE2(q - vec2(0.028, 0.744), vec2(0.034, 0.013)), sdE2(q - vec2(0.08, 0.744), vec2(0.03, 0.012))), P.beard * 1.04, q);
  }
  // mouth: smile, opens when talking
  float mo = P.talk * (0.5 + 0.5 * sin(uT * 15.0));
  vec2 mq = q - vec2(0.056, 0.722);
  float smile = abs(length(mq - vec2(0.0, 0.03)) - 0.032) - 0.0035; smile = max(smile, mq.y - 0.0);
  float open_ = sdE2(mq, vec2(0.022, 0.003 + mo * 0.014));
  col = mix(col, vec3(0.38, 0.1, 0.1), smoothstep(PX, -PX, mo > 0.15 ? open_ : max(smile, abs(mq.x) - 0.022)));
  // nose
  { float nose = sdE2(q - vec2(0.085, 0.772), vec2(0.018, 0.02)); col = mix(col, P.skin * 0.55 * LIGHT_TINT, smoothstep(PX, -PX, nose - 0.003)); col = mix(col, P.skin * 1.02 * LIGHT_TINT, smoothstep(PX, -PX, nose)); }
  // eyes: warm dark ovals with sparkles (classic kids'-animation style); blink squashes them
  for (int e = 0; e < 2; e++) { vec2 ec = e == 0 ? vec2(-0.008, 0.805) : vec2(0.068, 0.807); float s = e == 0 ? 0.88 : 1.0;
    ec.x += P.look * 0.006;
    float eyeD = sdE2(q - ec, vec2(0.0145, 0.021 * max(P.blink, 0.12)) * s);
    col = mix(col, vec3(0.12, 0.07, 0.05), smoothstep(PX, -PX, eyeD));
    col = mix(col, vec3(1.0), smoothstep(PX, -PX, length(q - ec - vec2(0.004, 0.007) * s) - 0.0055 * s) * step(0.5, P.blink));
    col = mix(col, vec3(1.0), smoothstep(PX, -PX, length(q - ec - vec2(-0.004, -0.007) * s) - 0.0025 * s) * step(0.5, P.blink));
    float brow = sdSeg2(q, ec + vec2(-0.019, 0.033 + P.brow * 0.014), ec + vec2(0.019, 0.038 + P.brow * 0.016), 0.0055 * s, 0.0035 * s);
    col = mix(col, P.beard * 0.7 * LIGHT_TINT, smoothstep(PX, -PX, brow)); }
  if (P.female > 0.5) {   // tichel: covers the top of the head and all the hair, drapes down the back to the shoulders, knotted at the back
    float dome = sdE2(q - vec2(0.008, 0.845), vec2(0.152, 0.112));
    dome = max(dome, min(0.826 - q.y + 0.03 * q.x, q.x + 0.045));                          // open only for the face, below the hairline
    float drape = max(sdSeg2(q, vec2(-0.075, 0.82), vec2(-0.11, 0.6), 0.075, 0.095), q.x + 0.04 - 0.3 * max(0.0, 0.74 - q.y));   // stays behind the face, widens below it
    float scarf = smin(dome, drape, 0.02);
    float knot = min(sdE2(q - vec2(-0.15, 0.86), vec2(0.042, 0.034)), min(sdSeg2(q, vec2(-0.16, 0.84), vec2(-0.2, 0.74), 0.022, 0.012), sdSeg2(q, vec2(-0.15, 0.84), vec2(-0.16, 0.72), 0.02, 0.01)));
    float folds = 0.88 + 0.12 * smoothstep(-0.5, 0.5, sin((q.x * 0.6 + q.y) * 70.0 + 2.0 * sin(q.x * 20.0)));
    VOL = 0.6; ink(col, knot, P.wrap * 0.9, q); ink(col, scarf, P.wrap * folds, q); VOL = 0.0;
    col = mix(col, P.trim * LIGHT_TINT, smoothstep(PX, -PX, max(abs(q.y - 0.832 - 0.03 * q.x) - 0.009, max(scarf + 0.004, -q.x - 0.03))));   // a soft band at the hairline
  } else {
  if (P.female > 0.5 && P.blink > 0.5) { for (int e = 0; e < 2; e++) { vec2 ec = e == 0 ? vec2(-0.008, 0.805) : vec2(0.068, 0.807); ec.x += P.look * 0.006;
      for (int l = 0; l < 2; l++) { vec2 a = ec + vec2(0.006 + 0.006 * float(l), 0.018 - 0.004 * float(l)); col = mix(col, vec3(0.1, 0.06, 0.05), smoothstep(PX, -PX, sdSeg2(q, a, a + vec2(0.012, 0.01 - 0.004 * float(l)), 0.0028, 0.0014))); } } }
  // turban: a lower wrap with layered bands and a coloured stripe
  float turban = sdE2(q - vec2(0.012, 0.872), vec2(0.14, 0.072)); turban = max(turban, -(q.y - 0.838 + 0.04 * (q.x - 0.02)));
  turban = smin(turban, sdE2(q - vec2(-0.005, 0.905), vec2(0.118, 0.05)), 0.03);
  float bands = 0.85 + 0.15 * smoothstep(-0.4, 0.4, sin((q.y - 0.12 * q.x) * 120.0));
  VOL = 0.5; ink(col, turban, P.wrap * bands, q); VOL = 0.0;
  col = mix(col, P.trim * 0.9 * LIGHT_TINT, smoothstep(PX, -PX, max(abs(q.y - 0.858 - 0.02 * q.x) - 0.009, turban + 0.006)));
  }
  // front arm: bell sleeve, hand with thumb, tool
  VOL = 1.0; SHADOW = 1.0; ink(col, min(sdCap2(q, shF, elF, 0.051), sdSeg2(q, elF, hF, 0.051, 0.066)), coat * 0.95, q); VOL = 0.0; SHADOW = 0.0;
  ink(col, min(sdE2(q - hF, vec2(0.032, 0.036)), sdCap2(q, hF, hF + vec2(0.03, 0.02), 0.012)), P.skin, q);
  if (P.tool > 0) drawTool(col, q, hF, P.armF.x + P.armF.y, P.tool);
  VOL = 1.0; SHADOW = 0.0;
}

// ── Animals: coloured, outlined, with eyes (facing +x, feet at 0, height ~0.3) ──
void eye(inout vec3 col, vec2 q, vec2 c, float r) { col = mix(col, vec3(0.08), smoothstep(PX, -PX, length(q - c) - r * 1.25)); col = mix(col, vec3(0.98), smoothstep(PX, -PX, length(q - c) - r));
  col = mix(col, vec3(0.06), smoothstep(PX, -PX, length(q - c - vec2(r * 0.25, 0.0)) - r * 0.6)); col = mix(col, vec3(1.0), smoothstep(PX, -PX, length(q - c - vec2(r * 0.45, r * 0.35)) - r * 0.25)); }
void leg(inout vec3 col, vec2 q, vec2 top, float len, float ph, float w, vec3 c) { vec2 foot = top + vec2(sin(ph) * 0.04, -len); ink(col, sdCap2(q, top, foot, w), c, q); }

// ── CAST ────────────────────────────────────────────────────────────────────
float blinkAt(float seed) { float t = fract(uT * 0.31 + seed); return 1.0 - smoothstep(0.0, 0.02, t) * (1.0 - smoothstep(0.02, 0.05, t)) * 0.92; }
Person noach() { Person P = defaultPerson(); P.robe = vec3(0.24, 0.36, 0.62); P.trim = vec3(0.93, 0.78, 0.38); P.beard = vec3(0.95, 0.95, 0.93); P.beardLen = 1.0;
  P.wrap = vec3(0.97, 0.95, 0.9); P.skin = vec3(0.93, 0.74, 0.6); P.blink = blinkAt(0.0); return P; }
Person son(int i) { Person P = defaultPerson(); P.beardLen = 0.25; P.blink = blinkAt(0.17 * float(i + 1));
  if (i == 0) { P.robe = vec3(0.3, 0.55, 0.32); P.trim = vec3(0.85, 0.85, 0.7); P.beard = vec3(0.32, 0.2, 0.1); P.wrap = vec3(0.85, 0.8, 0.65); }
  else if (i == 1) { P.robe = vec3(0.62, 0.22, 0.2); P.trim = vec3(0.9, 0.7, 0.35); P.beard = vec3(0.1, 0.07, 0.05); P.wrap = vec3(0.9, 0.86, 0.78); P.skin = vec3(0.8, 0.58, 0.42); }
  else { P.robe = vec3(0.78, 0.6, 0.28); P.trim = vec3(0.5, 0.3, 0.15); P.beard = vec3(0.5, 0.32, 0.15); P.wrap = vec3(0.7, 0.55, 0.4); }
  return P; }
Person townsperson(float id) { Person P = defaultPerson(); float h = hash1(id * 7.3);
  P.robe = 0.35 + 0.45 * cos(6.28 * (h + vec3(0.0, 0.33, 0.67))); P.trim = 0.5 + 0.4 * cos(6.28 * (h * 3.0 + vec3(0.1, 0.4, 0.7)));
  P.beard = mix(vec3(0.08, 0.05, 0.03), vec3(0.45, 0.3, 0.15), hash1(id * 3.1)); P.wrap = mix(vec3(0.6, 0.3, 0.2), vec3(0.85, 0.8, 0.7), hash1(id * 5.7));
  P.skin = mix(vec3(0.92, 0.72, 0.56), vec3(0.7, 0.5, 0.36), hash1(id * 2.2)); P.beardLen = 0.2 + 0.2 * hash1(id); P.blink = blinkAt(hash1(id)); return P; }

Person sarai() { Person P = defaultPerson(); P.female = 1.0; P.robe = vec3(0.28, 0.45, 0.62); P.trim = vec3(0.92, 0.8, 0.5); P.wrap = vec3(0.93, 0.85, 0.78);
  P.skin = vec3(0.93, 0.74, 0.6); P.beardLen = 0.0; P.blink = blinkAt(0.53); return P; }
Person womanP(float id) { Person P = defaultPerson(); P.female = 1.0; float h = hash1(id * 5.1); P.robe = 0.4 + 0.35 * cos(6.28 * (h + vec3(0.0, 0.33, 0.67)));
  P.trim = vec3(0.9, 0.82, 0.6); P.wrap = mix(vec3(0.85, 0.75, 0.7), vec3(0.6, 0.5, 0.7), hash1(id * 2.3)); P.skin = mix(vec3(0.92, 0.72, 0.56), vec3(0.72, 0.52, 0.38), hash1(id * 3.7)); P.blink = blinkAt(h); return P; }
Person kidP(float id) { Person P = townsperson(id + 300.0); P.beardLen = -1.0; P.wrap = 0.55 + 0.4 * cos(6.28 * (hash1(id * 4.3) + vec3(0.2, 0.5, 0.8))); return P; }   // a child (draw smaller)
