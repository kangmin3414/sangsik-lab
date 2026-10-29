/* ===== 만약에연구소 animation engine v2 ===== */
const FONT = "'Noto Sans CJK KR', sans-serif";
const MONO = "'DejaVu Sans Mono', monospace";
const INK = '#141414', NAVY = '#0B1626', MINT = '#3DF2B0', YEL = '#F7E733', PINK = '#FF5FA2', RED = '#FF4D4D', WHITE = '#FFFFFF';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const easeInOut = k => k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
const easeOut = k => 1 - Math.pow(1 - k, 3);
const easeIn = k => k * k * k;
const easeOutBack = k => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const f1 = v => Math.round(v * 10) / 10;

/* ---------- expressions ---------- */
const ell = (cx, cy, rx, ry) => `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
const dotEyes = (rx, ry) => ({ eyeL: ell(165, 188, rx, ry), eyeR: ell(235, 188, rx, ry), eyeFill: INK, eyeSW: 0 });
const E = {
  '기본': Object.assign(dotEyes(10, 14), { bL: [140, 150, 163, 147, 186, 152], bR: [214, 152, 237, 147, 260, 150], mouth: 'M190 232 Q200 237 210 232', mouthFill: 'none' }),
  '신남': { eyeL: 'M149 194 Q165 172 181 194', eyeR: 'M219 194 Q235 172 251 194', eyeFill: 'none', eyeSW: 9, bL: [142, 140, 164, 126, 186, 136], bR: [214, 136, 236, 126, 258, 140], mouth: 'M180 222 Q200 254 220 222 Z', mouthFill: INK, blush: true },
  '놀람': { eyeL: ell(165, 190, 9, 10), eyeR: ell(235, 190, 9, 10), eyeFill: INK, eyeSW: 0, whites: true, bL: [140, 136, 163, 118, 186, 128], bR: [214, 128, 237, 118, 260, 136], mouth: ell(200, 238, 10, 14), mouthFill: INK },
  '결심': Object.assign(dotEyes(10, 12), { bL: [138, 148, 163, 154, 188, 166], bR: [212, 166, 237, 154, 262, 148], mouth: 'M188 234 L212 234', mouthFill: 'none' }),
  '걱정': Object.assign(dotEyes(10, 14), { bL: [142, 164, 164, 152, 186, 146], bR: [214, 146, 236, 152, 258, 164], mouth: 'M182 236 Q191 228 200 236 Q209 244 218 236', mouthFill: 'none', sweat: true }),
  '겁먹음': { eyeL: ell(165, 192, 6, 7), eyeR: ell(235, 192, 6, 7), eyeFill: INK, eyeSW: 0, whites: true, bL: [142, 160, 164, 146, 186, 138], bR: [214, 138, 236, 146, 258, 160], mouth: 'M180 244 L188 236 L196 244 L204 236 L212 244 L220 236', mouthFill: 'none', sweat: true },
  '지침': { eyeL: 'M152 184 L178 184 Q178 200 165 200 Q152 200 152 184 Z', eyeR: 'M222 184 L248 184 Q248 200 235 200 Q222 200 222 184 Z', eyeFill: INK, eyeSW: 0, bL: [142, 166, 164, 166, 186, 170], bR: [214, 170, 236, 166, 258, 166], mouth: 'M190 236 L210 233', mouthFill: 'none' },
  '졸림': { eyeL: 'M152 190 L178 190 Q178 200 165 200 Q152 200 152 190 Z', eyeR: 'M222 190 L248 190 Q248 200 235 200 Q222 200 222 190 Z', eyeFill: INK, eyeSW: 0, bL: [142, 160, 164, 158, 186, 162], bR: [214, 162, 236, 158, 258, 160], mouth: 'M192 236 Q200 240 208 236', mouthFill: 'none' },
  '뿌듯': Object.assign(dotEyes(10, 11), { bL: [142, 152, 164, 150, 186, 154], bR: [214, 140, 236, 126, 258, 136], mouth: 'M184 230 Q204 240 218 224', mouthFill: 'none' })
};

/* ---------- poses (numeric so they can be blended) ---------- */
const pts = s => s.split(' ').map(p => p.split(',').map(Number));
const RAW = {
  '서기': { armL: '148,285 122,345 116,398', hL: [114, 406], armR: '252,285 278,345 284,398', hR: [286, 406], legL: '180,412 176,470 172,522', fL: [160, 534, 0], legR: '220,412 224,470 228,522', fR: [240, 534, 0], dy: 0 },
  '손인사': { armL: '148,285 122,345 116,398', hL: [114, 406], armR: '252,285 302,245 320,180', hR: [322, 170], legL: '180,412 176,470 172,522', fL: [160, 534, 0], legR: '220,412 224,470 228,522', fR: [240, 534, 0], dy: 0 },
  '둥둥': { armL: '148,285 100,300 72,270', hL: [66, 262], armR: '252,285 300,300 328,270', hR: [334, 262], legL: '180,412 172,468 160,514', fL: [150, 526, 20], legR: '220,412 228,468 240,514', fR: [250, 526, -20], dy: 0 },
  '점프': { armL: '148,285 104,230 86,170', hL: [82, 160], armR: '252,285 296,230 314,170', hR: [318, 160], legL: '180,412 140,450 168,494', fL: [160, 504, 0], legR: '220,412 262,448 236,494', fR: [244, 504, 0], dy: 0 },
  '웅크림': { armL: '148,285 118,330 140,372', hL: [146, 378], armR: '252,285 282,330 260,372', hR: [254, 378], legL: '180,412 146,452 166,492', fL: [160, 504, 0], legR: '220,412 254,452 234,492', fR: [240, 504, 0], dy: 30 },
  '미끄럼': { armL: '148,285 96,240 70,190', hL: [66, 180], armR: '252,285 304,236 334,200', hR: [340, 192], legL: '180,412 214,462 262,488', fL: [276, 494, -30], legR: '220,412 262,452 312,466', fR: [326, 470, -30], dy: 0 },
  '납작': { armL: '148,285 92,262 52,230', hL: [44, 222], armR: '252,285 308,262 348,230', hR: [356, 222], legL: '180,412 150,470 120,520', fL: [108, 532, 0], legR: '220,412 250,470 280,520', fR: [292, 532, 0], dy: 0 },
  '만세': { armL: '148,285 110,220 96,150', hL: [94, 140], armR: '252,285 290,220 304,150', hR: [306, 140], legL: '180,412 176,470 172,522', fL: [160, 534, 0], legR: '220,412 224,470 228,522', fR: [240, 534, 0], dy: 0 },
  '턱괴기': { armL: '148,285 122,345 116,398', hL: [114, 406], armR: '252,290 288,332 246,292', hR: [238, 284], legL: '180,412 176,470 172,522', fL: [160, 534, 0], legR: '220,412 224,470 228,522', fR: [240, 534, 0], dy: 0 },
  '허우적': { armL: '148,285 96,250 64,200', hL: [58, 190], armR: '252,285 312,300 344,340', hR: [350, 350], legL: '180,412 150,466 128,506', fL: [118, 516, 25], legR: '220,412 246,470 258,520', fR: [266, 530, -10], dy: 0 }
};
const P = {};
for (const k in RAW) { const r = RAW[k]; P[k] = { armL: pts(r.armL), armR: pts(r.armR), legL: pts(r.legL), legR: pts(r.legR), hL: r.hL, hR: r.hR, fL: r.fL, fR: r.fR, dy: r.dy }; }
const lp = (a, b, k) => a.map((v, i) => Array.isArray(v) ? lp(v, b[i], k) : lerp(v, b[i], k));
function mixPose(a, b, k) {
  a = typeof a === 'string' ? P[a] : a; b = typeof b === 'string' ? P[b] : b;
  if (k <= 0) return a; if (k >= 1) return b;
  const o = {};
  for (const key of ['armL', 'armR', 'legL', 'legR', 'hL', 'hR', 'fL', 'fR']) o[key] = lp(a[key], b[key], k);
  o.dy = lerp(a.dy, b.dy, k);
  return o;
}
// procedural walk / run cycle, facing right
function walkPose(phase, amp = 1) {
  const leg = (hip, ph) => {
    const a = 0.5 * amp * Math.sin(ph);
    const knee = [hip[0] + 62 * Math.sin(a), hip[1] + 62 * Math.cos(a)];
    const a2 = a - 0.85 * amp * Math.max(0, Math.sin(ph + Math.PI / 2)) * 0.8;
    const foot = [knee[0] + 58 * Math.sin(a2), knee[1] + 58 * Math.cos(a2)];
    return { line: [hip, knee, foot], foot: [foot[0] + 12, foot[1] + 10, a2 * 20] };
  };
  const arm = (sh, ph) => {
    const a = -0.65 * amp * Math.sin(ph);
    const el = [sh[0] + 54 * Math.sin(a), sh[1] + 54 * Math.cos(a)];
    const b = a + 0.6 * amp + 0.2;
    const hd = [el[0] + 48 * Math.sin(b), el[1] + 48 * Math.cos(b)];
    return { line: [sh, el, hd], hand: hd };
  };
  const L = leg([182, 412], phase), R = leg([218, 412], phase + Math.PI);
  const aL = arm([150, 285], phase), aR = arm([250, 285], phase + Math.PI);
  return { armL: aL.line, hL: aL.hand, armR: aR.line, hR: aR.hand, legL: L.line, fL: L.foot, legR: R.line, fR: R.foot, dy: -Math.abs(Math.sin(phase)) * 8 * amp };
}
// keyframed pose: keys = [[t, poseName], ...]
function poseAt(keys, t, dur = 0.22) {
  let i = 0;
  while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
  if (i === 0 || t < keys[0][0]) return P[keys[0][1]] || keys[0][1];
  const prev = keys[i - 1][1], cur = keys[i][1];
  return mixPose(prev, cur, easeInOut(prog(t, keys[i][0], keys[i][0] + dur)));
}
// keyframed expression with a blink to hide the swap
function exprAt(keys, t) {
  let i = 0;
  while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
  const cur = keys[i][1], prev = i ? keys[i - 1][1] : cur, t0 = keys[i][0];
  const k = i ? easeInOut(prog(t, t0, t0 + 0.18)) : 1;
  const d = Math.abs(t - t0);
  const blink = i && d < 0.09 ? 1 - d / 0.09 : 0;
  return { expr: cur, prev, k, blink };
}
function naturalBlink(t, seed) {
  const per = 2.6 + hash(seed) * 1.6;
  const ph = ((t + hash(seed + 3) * per) % per);
  return ph < 0.14 ? Math.sin(ph / 0.14 * Math.PI) : 0;
}

/* ---------- character ---------- */
function char(o) {
  const t = o.t || 0, seed = o.seed || 1;
  const ex = o.ex || { expr: o.expr || '기본', prev: o.expr || '기본', k: 1, blink: 0 };
  const e = E[ex.k > 0.5 ? ex.expr : ex.prev] || E['기본'];
  const ea = E[ex.prev] || e, eb = E[ex.expr] || e;
  const bL = lp(ea.bL, eb.bL, ex.k), bR = lp(ea.bR, eb.bR, ex.k);
  let p = o.pose || '서기';
  if (typeof p === 'string') p = P[p];
  const s = o.s || 1, sx = o.sx || 1, sy = o.sy || 1, rot = o.rot || 0;
  const vest = o.vest || YEL, gog = o.goggles || 'up', down = gog === 'down';
  const breath = o.still ? 0 : Math.sin(t * 2.3 + seed) * 3.2;
  const tilt = (o.tilt || 0) + (o.still ? 0 : Math.sin(t * 1.1 + seed * 2) * 1.6);
  const blink = Math.max(ex.blink, o.noBlink ? 0 : naturalBlink(t, seed));
  const look = o.look || [0, 0];
  const L = o.light == null ? 1 : o.light;
  const shade = o.shade || '#D5E2EE', vshade = o.vshade || 'rgba(120,90,0,0.22)';
  const sh = o.shiver ? Math.sin(t * 95) * 3 : 0;
  const lw = o.lw || 1;
  let h = `<g transform="translate(${f1(o.x)} ${f1(o.y)}) rotate(${f1(rot)}) scale(${s * sx} ${s * sy}) translate(-200 -560)">`;
  h += `<g transform="translate(0 ${f1(p.dy)})">`;
  h += `<g stroke="${INK}" stroke-width="${10 * lw}" stroke-linecap="round" stroke-linejoin="round" fill="none"><polyline points="${p.legL.map(q => q.map(f1).join(',')).join(' ')}"/><polyline points="${p.legR.map(q => q.map(f1).join(',')).join(' ')}"/></g>`;
  const foot = f => `<ellipse cx="${f1(f[0])}" cy="${f1(f[1])}" rx="27" ry="14" fill="#fff" stroke="${INK}" stroke-width="7" transform="rotate(${f1(f[2])} ${f1(f[0])} ${f1(f[1])})"/><path d="M${f1(f[0] - 22)} ${f1(f[1] + 6)} Q${f1(f[0])} ${f1(f[1] + 14)} ${f1(f[0] + 22)} ${f1(f[1] + 6)}" fill="none" stroke="${INK}" stroke-width="4" transform="rotate(${f1(f[2])} ${f1(f[0])} ${f1(f[1])})"/>`;
  h += foot(p.fL) + foot(p.fR);
  // upper body breathes
  h += `<g transform="translate(${sh} ${f1(-breath)})">`;
  h += `<path d="M142 262 Q200 248 258 262 L270 412 Q200 424 130 412 Z" fill="${vest}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  h += `<g clip-path="url(#vestClip)"><rect x="${L > 0 ? 226 : 120}" y="240" width="56" height="200" fill="${vshade}"/><path d="M135 404 Q200 396 268 404 L270 420 L130 420 Z" fill="${vshade}"/></g>`;
  if (o.tie) h += `<path d="M200 262 L190 290 L200 360 L210 290 Z" fill="${o.tie}" stroke="${INK}" stroke-width="4"/>`;
  if (o.patch !== false) {
    h += `<line x1="200" y1="256" x2="200" y2="416" stroke="${INK}" stroke-width="4"/>`;
    h += `<rect x="148" y="298" width="40" height="26" rx="5" fill="#1F2D44"/><text x="168" y="318" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="18" fill="${MINT}">00</text>`;
  }
  h += `<g stroke="${INK}" stroke-width="${10 * lw}" stroke-linecap="round" stroke-linejoin="round" fill="none"><polyline points="${p.armL.map(q => q.map(f1).join(',')).join(' ')}"/><polyline points="${p.armR.map(q => q.map(f1).join(',')).join(' ')}"/></g>`;
  // head tilts around the neck
  h += `<g transform="rotate(${f1(tilt)} 200 280)">`;
  const hx = o.puffy ? 1.12 : 1;
  h += `<ellipse cx="200" cy="170" rx="${118 * hx}" ry="${o.puffy ? 118 : 112}" fill="#fff"/>`;
  h += `<g clip-path="url(#headClip)"><ellipse cx="200" cy="170" rx="140" ry="130" fill="${shade}"/><ellipse cx="${200 - 30 * L}" cy="${150}" rx="${118 * hx}" ry="112" fill="#fff"/></g>`;
  h += `<ellipse cx="200" cy="170" rx="${118 * hx}" ry="${o.puffy ? 118 : 112}" fill="none" stroke="${INK}" stroke-width="8"/>`;
  if (o.hair) h += `<path d="M86 152 Q84 62 200 58 Q316 62 314 152 Q296 112 250 104 Q200 120 150 104 Q104 112 86 152 Z" fill="${o.hair}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  if (e.blush) h += `<ellipse cx="148" cy="214" rx="16" ry="8" fill="#FF9BB0" opacity=".8"/><ellipse cx="252" cy="214" rx="16" ry="8" fill="#FF9BB0" opacity=".8"/>`;
  const by = 1 - 0.92 * blink;
  h += `<g transform="translate(${f1(look[0] * 7)} ${f1(look[1] * 5)}) translate(0 188) scale(1 ${f1(by * 100) / 100}) translate(0 -188)">`;
  if (e.whites) h += `<circle cx="165" cy="188" r="25" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="235" cy="188" r="25" fill="#fff" stroke="${INK}" stroke-width="6"/>`;
  const pl = e.whites ? `translate(${f1(look[0] * 8)} ${f1(look[1] * 6)})` : '';
  h += `<g transform="${pl}"><path d="${e.eyeL}" fill="${e.eyeFill}" stroke="${INK}" stroke-width="${e.eyeSW}" stroke-linecap="round"/><path d="${e.eyeR}" fill="${e.eyeFill}" stroke="${INK}" stroke-width="${e.eyeSW}" stroke-linecap="round"/>`;
  if (e.eyeFill === INK && !e.whites && blink < 0.3) h += `<circle cx="168" cy="181" r="3.2" fill="#fff"/><circle cx="238" cy="181" r="3.2" fill="#fff"/>`;
  h += `</g></g>`;
  if (gog !== 'none') {
    const strap = down ? 'M84 188 L316 188' : 'M86 138 Q200 52 314 138';
    const gy = down ? 188 : 90, gl = down ? 165 : 163, gr = down ? 235 : 237, op = down ? 0.35 : 1;
    h += `<path d="${strap}" fill="none" stroke="#1F2D44" stroke-width="16" stroke-linecap="round"/>`;
    h += `<circle cx="${gl}" cy="${gy}" r="31" fill="${MINT}" fill-opacity="${op}" stroke="#1F2D44" stroke-width="9"/><circle cx="${gr}" cy="${gy}" r="31" fill="${MINT}" fill-opacity="${op}" stroke="#1F2D44" stroke-width="9"/>`;
    h += `<path d="M${gl - 18} ${gy - 6} Q${gl - 14} ${gy - 18} ${gl - 2} ${gy - 20}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/><path d="M${gr - 18} ${gy - 6} Q${gr - 14} ${gy - 18} ${gr - 2} ${gy - 20}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/>`;
  }
  const bq = b => `M${f1(b[0])} ${f1(b[1])} Q${f1(b[2])} ${f1(b[3])} ${f1(b[4])} ${f1(b[5])}`;
  h += `<path d="${bq(bL)}" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="${bq(bR)}" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/>`;
  const mk = ex.k < 1 ? 0.7 + 0.3 * ex.k : 1;
  h += `<g transform="translate(200 235) scale(${f1(mk * 100) / 100}) translate(-200 -235)"><path d="${e.mouth}" fill="${e.mouthFill}" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  if (e.sweat || o.sweat) { const sd = (t * 40) % 30; h += `<path d="M306 ${112 + sd * 0.4} Q292 ${138 + sd * 0.4} 306 ${148 + sd * 0.4} Q320 ${138 + sd * 0.4} 306 ${112 + sd * 0.4} Z" fill="#9ED8FF" stroke="${INK}" stroke-width="5"/>`; }
  h += `</g>`; // head
  const hand = q => `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="22" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M${f1(q[0] - 10)} ${f1(q[1] + 8)} Q${f1(q[0])} ${f1(q[1] + 16)} ${f1(q[0] + 10)} ${f1(q[1] + 8)}" fill="none" stroke="${shade === '#D5E2EE' ? '#C9D6E2' : shade}" stroke-width="5" stroke-linecap="round"/>`;
  h += hand(p.hL) + hand(p.hR);
  h += `</g></g></g>`;
  return h;
}
const shadow = (x, y, w, op = 0.22) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(Math.max(10, w))}" ry="${f1(Math.max(2, w * 0.14))}" fill="#000" opacity="${op}"/>`;

function doctor(x, y, s, o = {}) {
  const t = o.t || 0, glass = o.glass || MINT, shake = o.shake ? Math.sin(t * 40) * 3 : 0;
  const breath = Math.sin(t * 1.9) * 4, tilt = (o.tilt || 0) + Math.sin(t * 0.8) * 1.5;
  const glint = (Math.sin(t * 1.3) + 1) / 2;
  return `<g transform="translate(${f1(x + shake)} ${f1(y)}) scale(${s})">
  <ellipse cx="0" cy="4" rx="120" ry="18" fill="#000" opacity=".25"/>
  <ellipse cx="-34" cy="-6" rx="34" ry="14" fill="#1F2D44" stroke="${INK}" stroke-width="6"/><ellipse cx="34" cy="-6" rx="34" ry="14" fill="#1F2D44" stroke="${INK}" stroke-width="6"/>
  <g transform="translate(0 ${f1(-breath)})">
  <path d="M-96 -40 L-74 -540 Q0 -580 74 -540 L96 -40 Q0 -20 -96 -40 Z" fill="#E9EEF3" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
  <path d="M30 -540 L74 -540 L96 -40 L40 -34 Z" fill="#C3CDD8" opacity=".7"/>
  <path d="M-24 -548 L0 -400 L24 -548 Z" fill="#1F2D44" stroke="${INK}" stroke-width="6"/>
  <line x1="0" y1="-400" x2="0" y2="-60" stroke="${INK}" stroke-width="5"/>
  <path d="M-72 -520 Q-118 -400 -112 -260" fill="none" stroke="${INK}" stroke-width="50" stroke-linecap="round"/><path d="M-72 -520 Q-118 -400 -112 -260" fill="none" stroke="#E9EEF3" stroke-width="36" stroke-linecap="round"/>
  <path d="M72 -520 Q118 -400 112 -260" fill="none" stroke="${INK}" stroke-width="50" stroke-linecap="round"/><path d="M72 -520 Q118 -400 112 -260" fill="none" stroke="#C9D3DD" stroke-width="36" stroke-linecap="round"/>
  <circle cx="-112" cy="-240" r="24" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="112" cy="-240" r="24" fill="#fff" stroke="${INK}" stroke-width="7"/>
  <g transform="rotate(${f1(tilt)} 0 -580)">
  <ellipse cx="0" cy="-668" rx="104" ry="98" fill="#1F2D44" stroke="${INK}" stroke-width="9"/>
  <path d="M-60 -740 Q0 -770 60 -740" fill="none" stroke="#33465F" stroke-width="10" stroke-linecap="round"/>
  <circle cx="-38" cy="-670" r="27" fill="${glass}" fill-opacity="${0.15 + glint * 0.25}" stroke="${glass}" stroke-width="7"/><circle cx="38" cy="-670" r="27" fill="${glass}" fill-opacity="${0.15 + glint * 0.25}" stroke="${glass}" stroke-width="7"/>
  <line x1="-11" y1="-670" x2="11" y2="-670" stroke="${glass}" stroke-width="6"/>
  <line x1="${-50 + glint * 10}" y1="-686" x2="${-32 + glint * 10}" y2="-664" stroke="#fff" stroke-width="5" opacity="${0.4 + glint * 0.6}"/><line x1="${26 + glint * 10}" y1="-686" x2="${44 + glint * 10}" y2="-664" stroke="#fff" stroke-width="5" opacity="${0.4 + glint * 0.6}"/>
  </g></g></g>`;
}

/* ---------- effects ---------- */
function puff(x, y, t, t0, scale = 1, color = '#fff') {
  const k = prog(t, t0, t0 + 0.55);
  if (k <= 0 || k >= 1) return '';
  let h = '';
  for (let i = 0; i < 7; i++) {
    const a = Math.PI * (0.05 + 0.9 * i / 6);
    const r = (30 + 120 * easeOut(k)) * scale;
    h += `<circle cx="${f1(x - Math.cos(a) * r)}" cy="${f1(y - Math.sin(a) * r * 0.35)}" r="${f1((16 + 22 * k) * scale * (1 - k * 0.5))}" fill="${color}" stroke="${INK}" stroke-width="4" opacity="${f1((1 - k) * 100) / 100}"/>`;
  }
  return h;
}
function particles(t, seed, n, box, color, o = {}) {
  let h = '';
  for (let i = 0; i < n; i++) {
    const hx = hash(seed + i * 3.1), hy = hash(seed + i * 7.7), hs = hash(seed + i * 1.9);
    const sp = (o.speed || 60) * (0.5 + hs);
    const life = (box[3]) / sp;
    const ph = ((t + hy * life) % life) / life;
    const x = box[0] + hx * box[2] + Math.sin(t * 1.5 + i) * (o.sway || 10);
    const y = o.down ? box[1] + ph * box[3] : box[1] + box[3] - ph * box[3];
    const r = (o.r || 5) * (0.5 + hs);
    const op = Math.sin(ph * Math.PI) * (o.op || 0.7);
    h += o.petal ? `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * 1.6)}" ry="${f1(r)}" fill="${color}" opacity="${f1(op * 100) / 100}" transform="rotate(${f1(t * 200 + i * 40)} ${f1(x)} ${f1(y)})"/>`
      : `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${color}" opacity="${f1(op * 100) / 100}"/>`;
  }
  return h;
}
function speedLines(cx, cy, r0, r1, n, t, color = '#fff', op = 0.7) {
  let h = '';
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2 + Math.sin(i * 12.9) * 0.08;
    const j = (Math.sin(i * 7.3 + t * 30) + 1) * 0.5;
    const ra = r0 + j * 60;
    h += `<line x1="${f1(cx + Math.cos(a) * ra)}" y1="${f1(cy + Math.sin(a) * ra)}" x2="${f1(cx + Math.cos(a) * r1)}" y2="${f1(cy + Math.sin(a) * r1)}" stroke="${color}" stroke-width="${6 + (i % 3) * 4}" opacity="${op}"/>`;
  }
  return h;
}
function motionLines(x, y, dir, n, len, t, color = INK) {
  let h = '';
  for (let i = 0; i < n; i++) {
    const yy = y + (i - n / 2) * 26, jitter = Math.sin(t * 40 + i * 3) * 14;
    h += `<line x1="${f1(x - dir * (40 + jitter))}" y1="${f1(yy)}" x2="${f1(x - dir * (40 + len + jitter))}" y2="${f1(yy)}" stroke="${color}" stroke-width="6" stroke-linecap="round" opacity=".6"/>`;
  }
  return h;
}
function clouds(t, y, sp, n = 3, seed = 1) {
  let h = '';
  for (let i = 0; i < n; i++) {
    const x = ((hash(seed + i) * 1500 + t * sp * (0.6 + hash(seed + i * 2))) % 1500) - 250, yy = y + hash(seed + i * 5) * 260;
    h += `<g transform="translate(${f1(x)} ${f1(yy)})" opacity=".95"><ellipse cx="0" cy="0" rx="110" ry="46" fill="#fff" stroke="${INK}" stroke-width="5"/><ellipse cx="-50" cy="-26" rx="60" ry="44" fill="#fff" stroke="${INK}" stroke-width="5"/><ellipse cx="40" cy="-36" rx="66" ry="52" fill="#fff" stroke="${INK}" stroke-width="5"/><ellipse cx="0" cy="6" rx="104" ry="38" fill="#fff"/></g>`;
  }
  return h;
}

/* ---------- text ---------- */
function outlined(x, y, lines, o = {}) {
  const fs = o.size || 72, lh = o.lh || fs * 1.18, fill = o.fill || WHITE, stroke = o.stroke || INK, sw = o.sw || fs * 0.2;
  let h = '';
  lines.forEach((ln, i) => {
    const yy = y + i * lh;
    const inner = Array.isArray(ln) ? ln.map(([tx, c]) => `<tspan fill="${c || fill}">${esc(tx)}</tspan>`).join('') : esc(ln);
    if (o.shadow !== false) h += `<text x="${x + 6}" y="${yy + 8}" text-anchor="${o.anchor || 'middle'}" font-family="${FONT}" font-weight="900" font-size="${fs}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round" fill="${INK}" opacity=".45">${Array.isArray(ln) ? ln.map(([tx]) => esc(tx)).join('') : esc(ln)}</text>`;
    h += `<text x="${x}" y="${yy}" text-anchor="${o.anchor || 'middle'}" font-family="${FONT}" font-weight="900" font-size="${fs}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke" fill="${fill}">${inner}</text>`;
  });
  return h;
}
function pop(t, t0, t1, cx, cy, inner, o = {}) {
  if (t < t0 || t > t1) return '';
  const k = prog(t, t0, t0 + (o.inDur || 0.3));
  const sc = o.noPop ? 1 : lerp(0.2, 1, easeOutBack(k));
  const out = prog(t, t1 - 0.15, t1);
  const op = (o.noPop ? k : Math.min(1, k * 3)) * (1 - out);
  const wob = o.wobble ? Math.sin((t - t0) * 14) * o.wobble : 0;
  const bob = o.bob ? Math.sin((t - t0) * 3) * o.bob : 0;
  return `<g opacity="${f1(op * 100) / 100}" transform="translate(${cx} ${f1(cy + bob)}) rotate(${f1((o.rot || 0) + wob)}) scale(${f1(sc * 1000) / 1000})">${inner}</g>`;
}
function burst(r, color, points = 14) {
  let d = '';
  for (let i = 0; i < points * 2; i++) {
    const a = Math.PI * i / points, rr = i % 2 ? r * 0.62 : r;
    d += (i ? 'L' : 'M') + f1(Math.cos(a) * rr) + ' ' + f1(Math.sin(a) * rr * 0.72);
  }
  return `<path d="${d}Z" fill="${color}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
}
function fx(t, t0, t1, x, y, text, color, o = {}) {
  const size = o.size || 130;
  let inner = '';
  if (o.burst) inner += burst(o.burst, o.burstColor || YEL);
  inner += outlined(0, size * 0.35, [text], { size, fill: color, sw: size * 0.16 });
  return pop(t, t0, t1, x, y, inner, { rot: o.rot || -6, wobble: o.wobble || 0, bob: 6 });
}
function tag(t, t0, t1, x, y, text, bg, o = {}) {
  const fs = o.size || 50, w = text.length * fs * 0.98 + 56, hgt = fs + 34;
  const inner = `<rect x="${-w / 2 + 6}" y="${-hgt / 2 + 8}" width="${w}" height="${hgt}" rx="${hgt / 2}" fill="${INK}" opacity=".35"/><rect x="${-w / 2}" y="${-hgt / 2}" width="${w}" height="${hgt}" rx="${hgt / 2}" fill="${bg}" stroke="${INK}" stroke-width="6"/>
  <text x="0" y="${fs * 0.36}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${fs}" fill="${o.color || INK}">${esc(text)}</text>`;
  return pop(t, t0, t1, x, y, inner, { rot: o.rot || 4, bob: 4 });
}
function cap(t, t0, t1, lines, o = {}) {
  return pop(t, t0, t1, 540, o.y || 1330, outlined(0, 0, lines, { size: o.size || 66, sw: 15 }), { noPop: true, inDur: 0.18 });
}
function drBox(t, t0, t1, lines, o = {}) {
  if (t < t0 || t > t1) return '';
  const k = prog(t, t0, t0 + 0.22), out = prog(t, t1 - 0.15, t1);
  const y = o.y || 1190, fs = o.size || 50, lh = fs * 1.38, hgt = 70 + lines.length * lh;
  const n = lines.join('').length;
  const shown = Math.floor(prog(t, t0, t0 + Math.min(1.4, n * 0.045)) * n);
  let used = 0;
  const shake = o.shake ? Math.sin(t * 60) * 4 : 0;
  let h = `<g opacity="${f1(k * (1 - out) * 100) / 100}" transform="translate(${f1(shake)} ${f1((1 - easeOut(k)) * 30)})">`;
  h += `<rect x="78" y="${y + 10}" width="940" height="${hgt}" rx="24" fill="#000" opacity=".35"/>`;
  h += `<rect x="70" y="${y}" width="940" height="${hgt}" rx="24" fill="${NAVY}" fill-opacity=".95" stroke="${o.border || MINT}" stroke-width="6"/>`;
  h += `<rect x="100" y="${y - 30}" width="150" height="60" rx="30" fill="${o.border || MINT}" stroke="${INK}" stroke-width="5"/>`;
  h += `<text x="175" y="${y + 12}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="36" fill="${NAVY}">박사</text>`;
  lines.forEach((ln, i) => {
    const take = clamp(shown - used, 0, ln.length); used += ln.length;
    h += `<text x="110" y="${y + 70 + i * lh + fs * 0.25}" font-family="${FONT}" font-weight="700" font-size="${fs}" fill="#fff">${esc(ln.slice(0, take))}</text>`;
  });
  if (shown < n && Math.floor(t * 6) % 2) h += `<rect x="${110 + 0}" y="${y + 70 + (lines.length - 1) * lh + fs * 0.4}" width="0" height="0"/>`;
  return h + `</g>`;
}
function hud(v) {
  let h = '';
  [['중력', v.g, v.gc], ['체중계', v.w, v.wc], ['경과', v.d, v.dc]].forEach(([lab, val, col], i) => {
    const x = 60 + i * 330;
    h += `<rect x="${x}" y="170" width="300" height="112" rx="18" fill="${NAVY}" fill-opacity=".86" stroke="${col || MINT}" stroke-width="4"/>`;
    h += `<circle cx="${x + 270}" cy="200" r="7" fill="${col || MINT}" opacity="${Math.floor((v.t || 0) * 2) % 2 ? 1 : 0.3}"/>`;
    h += `<text x="${x + 24}" y="210" font-family="${FONT}" font-weight="700" font-size="26" fill="${col || MINT}">${lab}</text>`;
    h += `<text x="${x + 24}" y="262" font-family="${FONT}" font-weight="900" font-size="46" fill="${col === RED ? RED : '#fff'}">${esc(val)}</text>`;
  });
  return h;
}
