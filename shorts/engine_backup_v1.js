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
  if (o.dress) h += `<path d="M132 392 L268 392 L300 468 Q200 488 100 468 Z" fill="${o.dress}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M150 440 Q200 452 250 440" fill="none" stroke="#fff" stroke-width="4" opacity=".35"/>`; // skirt
  if (o.toga) { // draped toga sash over the shoulder
    const tc = o.toga === true ? '#F4F1EA' : o.toga;
    h += `<path d="M136 268 Q160 252 184 256 L276 398 Q270 414 252 416 L226 414 Z" fill="${tc}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M166 262 L250 408" fill="none" stroke="${INK}" stroke-width="3" opacity=".25"/>`;
    if (o.togaStripe) h += `<path d="M178 258 L270 402" fill="none" stroke="${o.togaStripe}" stroke-width="8" stroke-linecap="round"/>`;
  }
  if (o.robe) { // East Asian cross-collar robe: long hem, crossed collar band, sash
    const tr = o.robe === true ? '#4E6E58' : o.robe;
    h += `<path d="M130 398 L270 398 L290 484 Q200 498 110 484 Z" fill="${vest}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M112 474 Q200 490 288 474" fill="none" stroke="${tr}" stroke-width="9"/>`;
    h += `<path d="M246 262 L200 318" fill="none" stroke="${tr}" stroke-width="16" stroke-linecap="round"/><path d="M152 262 L238 372" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M152 262 L238 372" fill="none" stroke="${tr}" stroke-width="14" stroke-linecap="round"/>`;
    h += `<rect x="134" y="366" width="132" height="24" rx="6" fill="${tr}" stroke="${INK}" stroke-width="5"/>`;
  }
  if (o.bandCollar) h += `<path d="M146 262 Q200 248 254 262 L262 302 Q230 314 200 300 Q170 314 138 302 Z" fill="#FBFAF6" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M200 262 L200 300" stroke="${INK}" stroke-width="3" opacity=".4"/>`; // flat white falling-band collar (17th c.)
  if (o.collar) h += `<path d="M172 256 L200 300 L228 256 L200 268 Z" fill="#F4F1EA" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  if (o.tie) h += `<path d="M200 262 L190 290 L200 360 L210 290 Z" fill="${o.tie}" stroke="${INK}" stroke-width="4"/>`;
  if (o.patch !== false) {
    h += `<line x1="200" y1="256" x2="200" y2="416" stroke="${INK}" stroke-width="4"/>`;
    h += `<rect x="148" y="298" width="40" height="26" rx="5" fill="#1F2D44"/><text x="168" y="318" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="18" fill="${MINT}">00</text>`;
  }
  h += `<g stroke="${INK}" stroke-width="${10 * lw}" stroke-linecap="round" stroke-linejoin="round" fill="none"><polyline points="${p.armL.map(q => q.map(f1).join(',')).join(' ')}"/><polyline points="${p.armR.map(q => q.map(f1).join(',')).join(' ')}"/></g>`;
  if (o.tee) { // short t-shirt sleeves over the arm roots
    const sl = a => { const [x0, y0] = a[0], [x1, y1] = a[1]; const ang = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI; const cx = x0 + (x1 - x0) * 0.22, cy = y0 + (y1 - y0) * 0.22;
      if (o.robe) { const rx = x0 + (x1 - x0) * 0.4, ry = y0 + (y1 - y0) * 0.4; return `<g transform="translate(${f1(rx)} ${f1(ry)}) rotate(${f1(ang)})"><path d="M-40 -24 L30 -34 Q42 0 30 34 L-40 24 Z" fill="${vest}"/><path d="M-40 -24 L30 -34 Q42 0 30 34 L-40 24" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`; }
      return `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(ang)})"><path d="M-30 -21 L16 -18 Q24 0 16 18 L-30 21 Z" fill="${vest}"/><path d="M-30 -21 L16 -18 Q24 0 16 18 L-30 21" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`; };
    h += sl(p.armL) + sl(p.armR);
  }
  // head tilts around the neck
  h += `<g transform="rotate(${f1(tilt)} 200 280)">`;
  if (o.longHair) h += `<path d="M86 160 Q80 56 200 50 Q320 56 314 160 Q322 240 330 300 Q318 336 284 326 Q270 300 268 252 L132 252 Q130 300 116 326 Q82 336 70 300 Q78 240 86 160 Z" fill="${o.longHair}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`; // long hair behind the head
  if (o.wig) { // long curly baroque wig falling on the shoulders (behind the head)
    let w = '';
    for (const sd of [-1, 1]) {
      for (let k = 0; k < 7; k++) { const y = 112 + k * 34, x = 200 + sd * (116 + (k > 4 ? -6 : 0) + Math.sin(k * 1.7) * 4); w += `<circle cx="${f1(x)}" cy="${y}" r="${k > 4 ? 30 : 34}"/>`; }
      for (let k = 0; k < 3; k++) w += `<circle cx="${f1(200 + sd * (84 - k * 4))}" cy="${292 + k * 26}" r="27"/>`;
    }
    h += `<g fill="${o.wig}" stroke="${INK}" stroke-width="5">${w}</g>`;
  }
  const hx = o.puffy ? 1.12 : 1;
  h += `<ellipse cx="200" cy="170" rx="${118 * hx}" ry="${o.puffy ? 118 : 112}" fill="#fff"/>`;
  h += `<g clip-path="url(#headClip)"><ellipse cx="200" cy="170" rx="140" ry="130" fill="${shade}"/><ellipse cx="${200 - 30 * L}" cy="${150}" rx="${118 * hx}" ry="112" fill="#fff"/></g>`;
  h += `<ellipse cx="200" cy="170" rx="${118 * hx}" ry="${o.puffy ? 118 : 112}" fill="none" stroke="${INK}" stroke-width="8"/>`;
  if (o.hair) h += `<path d="M86 152 Q84 62 200 58 Q316 62 314 152 Q296 112 250 104 Q200 120 150 104 Q104 112 86 152 Z" fill="${o.hair}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  if (o.wig) h += `<path d="M84 168 Q76 62 200 54 Q324 62 316 168 Q306 128 276 118 Q244 96 204 104 L200 70 L196 104 Q156 96 124 118 Q94 128 84 168 Z" fill="${o.wig}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M120 92 q14 -10 26 0 M254 92 q14 -10 26 0 M156 70 q12 -8 24 0 M222 70 q12 -8 24 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" opacity=".35"/>`;
  if (o.topknot) { // hair pulled up into a topknot with a pin
    h += `<ellipse cx="200" cy="48" rx="32" ry="27" fill="${o.topknot}" stroke="${INK}" stroke-width="6"/><line x1="156" y1="40" x2="246" y2="54" stroke="#C9A04A" stroke-width="7" stroke-linecap="round"/><line x1="156" y1="40" x2="246" y2="54" stroke="${INK}" stroke-width="2" opacity=".4"/>`;
    h += `<path d="M86 156 Q82 70 200 64 Q318 70 314 156 Q300 112 258 100 Q200 90 142 100 Q100 112 86 156 Z" fill="${o.topknot}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M150 96 Q200 86 250 96" fill="none" stroke="#fff" stroke-width="3" opacity=".25"/>`;
  }
  if (o.ribbon) h +=`<g transform="translate(272 84) rotate(18)"><path d="M0 0 L-34 -22 L-34 22 Z M0 0 L34 -22 L34 22 Z" fill="${o.ribbon}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle r="10" fill="${o.ribbon}" stroke="${INK}" stroke-width="5"/></g>`;
  if (o.beard) h += `<path d="M90 176 Q94 300 200 322 Q306 300 310 176 Q296 236 252 252 Q226 262 200 262 Q174 262 148 252 Q104 236 90 176 Z" fill="${o.beard}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M176 248 Q200 240 224 248" fill="none" stroke="${o.beard}" stroke-width="12" stroke-linecap="round"/>`;
  if (o.wreath) {
    const leaf = (x0, y0, cx, cy, x1, y1, side) => { let w = ''; for (let i = 0; i < 7; i++) { const k = 0.06 + i * 0.145, a = 1 - k; const x = a * a * x0 + 2 * a * k * cx + k * k * x1, y = a * a * y0 + 2 * a * k * cy + k * k * y1; const tx = 2 * a * (cx - x0) + 2 * k * (x1 - cx), ty = 2 * a * (cy - y0) + 2 * k * (y1 - cy); const ang = Math.atan2(ty, tx) * 180 / Math.PI; for (const sgn of [-1, 1]) w += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="17" ry="8" transform="rotate(${f1(ang + sgn * 38 * side)} ${f1(x)} ${f1(y)}) translate(${f1(12 * side)} 0)" fill="${sgn > 0 ? '#6DBE55' : '#4E9A3E'}" stroke="${INK}" stroke-width="4"/>`; } return w; };
    h += leaf(96, 168, 92, 80, 186, 58, 1) + leaf(304, 168, 308, 80, 214, 58, -1);
  }
  if (e.blush) h += `<ellipse cx="148" cy="214" rx="16" ry="8" fill="#FF9BB0" opacity=".8"/><ellipse cx="252" cy="214" rx="16" ry="8" fill="#FF9BB0" opacity=".8"/>`;
  const by = 1 - 0.92 * blink;
  h += `<g transform="translate(${f1(look[0] * 7)} ${f1(look[1] * 5)}) translate(0 188) scale(1 ${f1(by * 100) / 100}) translate(0 -188)">`;
  if (e.whites) h += `<circle cx="165" cy="188" r="25" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="235" cy="188" r="25" fill="#fff" stroke="${INK}" stroke-width="6"/>`;
  const pl = e.whites ? `translate(${f1(look[0] * 8)} ${f1(look[1] * 6)})` : '';
  h += `<g transform="${pl}"><path d="${e.eyeL}" fill="${e.eyeFill}" stroke="${INK}" stroke-width="${e.eyeSW}" stroke-linecap="round"/><path d="${e.eyeR}" fill="${e.eyeFill}" stroke="${INK}" stroke-width="${e.eyeSW}" stroke-linecap="round"/>`;
  if (e.eyeFill === INK && !e.whites && blink < 0.3) h += `<circle cx="168" cy="181" r="3.2" fill="#fff"/><circle cx="238" cy="181" r="3.2" fill="#fff"/>`;
  if (o.lashes) h += e.eyeFill === INK ? `<path d="M152 178 L140 170 M157 173 L149 162 M248 178 L260 170 M243 173 L251 162" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` : `<path d="M150 192 L137 187 M153 186 L143 177 M250 192 L263 187 M247 186 L257 177" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
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
  if (!o.noMouth) h += `<g transform="translate(0 ${o.stache ? 24 : (o.longBeard ? 16 : 0)}) translate(200 235) scale(${f1(mk * 100) / 100}) translate(-200 -235)"><path d="${e.mouth}" fill="${e.mouthFill}" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  if (o.stache) { // bushy walrus moustache (Nietzsche)
    const c = o.stache === true ? '#4A3426' : o.stache;
    h += `<path d="M200 210 C184 198 150 200 136 218 C126 232 124 250 132 262 C142 246 160 240 178 240 C190 240 196 234 200 229 C204 234 210 240 222 240 C240 240 258 246 268 262 C276 250 274 232 264 218 C250 200 216 198 200 210 Z" fill="${c}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    h += `<path d="M160 216 Q172 210 186 214 M214 214 Q228 210 240 216" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".28"/>`;
  }
  if (o.pencil) { // thin 17th-century moustache + small tuft under the lip
    h += `<path d="M198 222 Q182 212 164 224 Q158 228 152 222 M202 222 Q218 212 236 224 Q242 228 248 222" fill="none" stroke="${o.pencil}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
    h += `<path d="M192 262 Q200 284 208 262 Q200 268 192 262 Z" fill="${o.pencil}" stroke="${INK}" stroke-width="3"/>`;
  }
  if (o.longBeard) { // long flowing sage beard + droopy moustache
    h += `<path d="M138 232 Q150 266 178 272 Q200 278 222 272 Q250 266 262 232 Q268 306 236 352 Q218 380 200 404 Q182 380 164 352 Q132 306 138 232 Z" fill="${o.longBeard}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    h += `<path d="M180 300 Q192 330 196 360 M220 300 Q208 330 204 360" fill="none" stroke="${INK}" stroke-width="3" opacity=".25" stroke-linecap="round"/>`;
    h += `<path d="M200 224 Q180 218 168 232 Q160 246 156 258 M200 224 Q220 218 232 232 Q240 246 244 258" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M200 224 Q180 218 168 232 Q160 246 156 258 M200 224 Q220 218 232 232 Q240 246 244 258" fill="none" stroke="${o.longBeard}" stroke-width="7" stroke-linecap="round"/>`;
  }
  if (e.sweat || o.sweat) { const sd = (t * 40) % 30; h += `<path d="M306 ${112 + sd * 0.4} Q292 ${138 + sd * 0.4} 306 ${148 + sd * 0.4} Q320 ${138 + sd * 0.4} 306 ${112 + sd * 0.4} Z" fill="#9ED8FF" stroke="${INK}" stroke-width="5"/>`; }
  h += `</g>`; // head
  const hand = q => `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="22" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M${f1(q[0] - 10)} ${f1(q[1] + 8)} Q${f1(q[0])} ${f1(q[1] + 16)} ${f1(q[0] + 10)} ${f1(q[1] + 8)}" fill="none" stroke="${shade === '#D5E2EE' ? '#C9D6E2' : shade}" stroke-width="5" stroke-linecap="round"/>`;
  h += hand(p.hL) + hand(p.hR);
  h += `</g></g></g>`;
  return h;
}
const shadow = (x, y, w, op = 0.22) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(Math.max(10, w))}" ry="${f1(Math.max(2, w * 0.14))}" fill="#000" opacity="${op}"/>`;

/* ---------- THE DOCTOR v2: friendly scientist, same family as ZERO ---------- */
// feet anchor at (x, y); head centre sits at local (0, -668) like v1 so old framings still work
const DOC_EX = {
  '기본': { bL: [138, 150, 163, 140, 188, 148], bR: [212, 148, 237, 140, 262, 150], mouth: 'M186 246 Q200 256 214 246', eyes: 'dot' },
  '미소': { bL: [138, 144, 163, 132, 188, 142], bR: [212, 142, 237, 132, 262, 144], mouth: 'M182 244 Q200 262 218 244', eyes: 'happy' },
  '진지': { bL: [138, 150, 163, 152, 188, 160], bR: [212, 160, 237, 152, 262, 150], mouth: 'M188 250 L212 250', eyes: 'dot' },
  '놀람': { bL: [138, 132, 163, 116, 188, 128], bR: [212, 128, 237, 116, 262, 132], mouth: 'O', eyes: 'wide' },
  '당황': { bL: [140, 158, 163, 144, 186, 136], bR: [214, 136, 237, 144, 260, 158], mouth: 'M184 252 L190 246 L196 252 L202 246 L208 252 L214 246', eyes: 'wide', sweat: true }
};
function doctor(x, y, s, o = {}) {
  const t = o.t || 0, seed = o.seed || 77;
  const glass = o.glass || MINT;
  const alert = glass === RED;
  const exName = o.expr || (alert ? '당황' : '기본');
  const ex = DOC_EX[exName] || DOC_EX['기본'];
  const shake = o.shake ? Math.sin(t * 40) * 3 : 0;
  const breath = Math.sin(t * 1.9 + 1) * 4;
  const tilt = (o.tilt || 0) + Math.sin(t * 0.8) * 1.6;
  const blink = naturalBlink(t, seed);
  const talkK = typeof o.talk === 'number' ? clamp(o.talk, 0, 1) : (o.talk ? (Math.sin(t * 17) + 1) / 2 * 0.9 : 0);
  const L = o.light == null ? 1 : o.light;
  const coat = '#F7F9FB', coatShade = '#D6E0EA';
  let h = `<g transform="translate(${f1(x + shake)} ${f1(y)}) scale(${s})">`;
  h += `<ellipse cx="0" cy="4" rx="130" ry="18" fill="#000" opacity=".22"/>`;
  // legs + shoes
  h += `<g stroke="${INK}" stroke-width="12" stroke-linecap="round" fill="none"><polyline points="-26,-170 -30,-90 -34,-18"/><polyline points="26,-170 30,-90 34,-18"/></g>`;
  h += `<ellipse cx="-44" cy="-8" rx="36" ry="15" fill="#2A3A52" stroke="${INK}" stroke-width="7"/><ellipse cx="44" cy="-8" rx="36" ry="15" fill="#2A3A52" stroke="${INK}" stroke-width="7"/>`;
  h += `<g transform="translate(0 ${f1(-breath)})">`;
  // lab coat
  h += `<path d="M-84 -540 Q0 -568 84 -540 L112 -150 Q0 -128 -112 -150 Z" fill="${coat}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>`;
  h += `<path d="${L > 0 ? 'M40 -548 L84 -540 L112 -150 L54 -136 Z' : 'M-40 -548 L-84 -540 L-112 -150 L-54 -136 Z'}" fill="${coatShade}" opacity=".75"/>`;
  // turtleneck + lapels
  h += `<path d="M-34 -556 L0 -420 L34 -556 Z" fill="#1F2D44" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  h += `<rect x="-30" y="-572" width="60" height="26" rx="10" fill="#1F2D44" stroke="${INK}" stroke-width="6"/>`;
  h += `<path d="M-34 -556 L-6 -400 L-30 -380" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M34 -556 L6 -400 L30 -380" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  h += `<line x1="0" y1="-400" x2="0" y2="-142" stroke="${INK}" stroke-width="5"/>`;
  h += `<circle cx="-12" cy="-330" r="6" fill="${INK}"/><circle cx="-12" cy="-250" r="6" fill="${INK}"/>`;
  // chest pocket with pens, name badge
  h += `<rect x="-78" y="-480" width="48" height="40" rx="6" fill="${coat}" stroke="${INK}" stroke-width="5"/><rect x="-70" y="-506" width="9" height="34" rx="4" fill="${MINT}" stroke="${INK}" stroke-width="3"/><rect x="-56" y="-500" width="9" height="28" rx="4" fill="${PINK}" stroke="${INK}" stroke-width="3"/>`;
  h += `<rect x="30" y="-486" width="58" height="34" rx="6" fill="${MINT}" stroke="${INK}" stroke-width="5"/>${o.badge === false ? '' : `<text x="59" y="-462" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="18" fill="${NAVY}">박사</text>`}`;
  // arms: left holds a clipboard, right relaxed or pointing
  const sleeve = (d) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="52" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${coat}" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>`;
  const point = o.pose === 'point';
  h += sleeve('M-74 -520 Q-120 -420 -96 -330');
  h += `<g transform="rotate(-10 -140 -320)"><rect x="-198" y="-392" width="106" height="138" rx="10" fill="#C08A4F" stroke="${INK}" stroke-width="7"/><rect x="-186" y="-374" width="82" height="108" rx="4" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="-164" y="-404" width="38" height="20" rx="5" fill="#9AA6B2" stroke="${INK}" stroke-width="4"/>${[0, 1, 2, 3].map(i => `<line x1="-176" y1="${-350 + i * 22}" x2="${-118 - (i % 2) * 14}" y2="${-350 + i * 22}" stroke="#9CB3C8" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>`;
  h += `<circle cx="-94" cy="-326" r="24" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
  if (point) { h += sleeve('M74 -520 Q170 -520 226 -588'); h += `<circle cx="234" cy="-598" r="24" fill="#fff" stroke="${INK}" stroke-width="7"/><line x1="246" y1="-612" x2="268" y2="-644" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>`; }
  else { h += sleeve('M74 -520 Q122 -420 112 -270'); h += `<circle cx="112" cy="-256" r="24" fill="#fff" stroke="${INK}" stroke-width="7"/>`; }
  // ---- head (drawn in ZERO's head coordinates so it shares clips and proportions) ----
  h += `<g transform="rotate(${f1(tilt)} 0 -572) translate(-200 -838)">`;
  // fluffy side hair (behind the head)
  const puff = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#EEF1F5" stroke="${INK}" stroke-width="6"/>`;
  h += puff(84, 132, 34) + puff(66, 176, 32) + puff(80, 218, 28) + puff(316, 132, 34) + puff(334, 176, 32) + puff(320, 218, 28);
  h += `<ellipse cx="200" cy="170" rx="118" ry="112" fill="#fff"/>`;
  h += `<g clip-path="url(#headClip)"><ellipse cx="200" cy="170" rx="140" ry="130" fill="#DCE6F0"/><ellipse cx="${200 - 30 * L}" cy="150" rx="118" ry="112" fill="#fff"/></g>`;
  h += `<ellipse cx="200" cy="170" rx="118" ry="112" fill="none" stroke="${INK}" stroke-width="8"/>`;
  // little curl on top
  h += `<path d="M178 62 Q172 34 196 34 Q218 36 208 58" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M204 60 Q214 40 230 50" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  // cheeks
  h += `<ellipse cx="140" cy="226" rx="15" ry="8" fill="#FFB3C1" opacity=".55"/><ellipse cx="260" cy="226" rx="15" ry="8" fill="#FFB3C1" opacity=".55"/>`;
  // eyes (behind the lenses), with blink
  const by = Math.max(0.08, 1 - 0.92 * blink);
  h += `<g transform="translate(0 188) scale(1 ${f1(by * 100) / 100}) translate(0 -188)">`;
  if (ex.eyes === 'happy' && blink < 0.5) h += `<path d="M151 194 Q165 176 179 194" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M221 194 Q235 176 249 194" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
  else if (ex.eyes === 'wide') h += `<circle cx="165" cy="188" r="14" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="235" cy="188" r="14" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="165" cy="189" r="6" fill="${INK}"/><circle cx="235" cy="189" r="6" fill="${INK}"/>`;
  else h += `<ellipse cx="165" cy="188" rx="9" ry="12" fill="${INK}"/><ellipse cx="235" cy="188" rx="9" ry="12" fill="${INK}"/><circle cx="168" cy="183" r="3" fill="#fff"/><circle cx="238" cy="183" r="3" fill="#fff"/>`;
  h += `</g>`;
  // big round glasses
  h += `<line x1="84" y1="182" x2="132" y2="186" stroke="#1F2D44" stroke-width="7" stroke-linecap="round"/><line x1="316" y1="182" x2="268" y2="186" stroke="#1F2D44" stroke-width="7" stroke-linecap="round"/>`;
  h += `<circle cx="163" cy="188" r="33" fill="${glass}" fill-opacity=".16" stroke="#1F2D44" stroke-width="9"/><circle cx="237" cy="188" r="33" fill="${glass}" fill-opacity=".16" stroke="#1F2D44" stroke-width="9"/>`;
  h += `<path d="M196 186 Q200 178 204 186" fill="none" stroke="#1F2D44" stroke-width="7" stroke-linecap="round"/>`;
  const gl = (Math.sin(t * 1.3) + 1) / 2;
  h += `<path d="M142 178 Q147 164 160 160" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="${f1((0.5 + gl * 0.5) * 100) / 100}"/><path d="M216 178 Q221 164 234 160" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="${f1((0.5 + gl * 0.5) * 100) / 100}"/>`;
  if (alert) h += `<circle cx="163" cy="188" r="33" fill="${RED}" opacity=".18"/><circle cx="237" cy="188" r="33" fill="${RED}" opacity=".18"/>`;
  // bushy grey brows
  const bq = b => `M${f1(b[0])} ${f1(b[1] - 8)} Q${f1(b[2])} ${f1(b[3] - 8)} ${f1(b[4])} ${f1(b[5] - 8)}`;
  h += `<path d="${bq(ex.bL)}" fill="none" stroke="#6B7684" stroke-width="16" stroke-linecap="round"/><path d="${bq(ex.bR)}" fill="none" stroke="#6B7684" stroke-width="16" stroke-linecap="round"/>`;
  // moustache + mouth (talks)
  if (ex.mouth === 'O' || talkK > 0.15) {
    const oy = ex.mouth === 'O' ? 14 : 4 + talkK * 12;
    h += `<ellipse cx="200" cy="250" rx="${f1(ex.mouth === 'O' ? 11 : 10 + talkK * 3)}" ry="${f1(oy)}" fill="#7A2E3A" stroke="${INK}" stroke-width="5"/>`;
  } else h += `<path d="${ex.mouth}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
  h += `<path d="M168 230 Q184 214 200 226 Q216 214 232 230 Q216 242 200 234 Q184 242 168 230 Z" fill="#D5DAE1" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  if (ex.sweat) h += `<path d="M314 112 Q300 138 314 148 Q328 138 314 112 Z" fill="#9ED8FF" stroke="${INK}" stroke-width="5"/>`;
  h += `</g>`; // head
  h += `</g></g>`;
  return h;
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
