/* ---------- experiment 009 · ask questions like Socrates ---------- */
Object.assign(CAMS, {
  qmeeting: [1.0, 1.04, 960, 540], qchat: [1.0, 1.03, 960, 520], qagora: [1.0, 1.04, 960, 540], qoracle: [1.0, 1.04, 960, 520],
  qwise: [1.0, 1.04, 960, 540], qknow: [1.0, 1.03, 960, 520], qday1: [1.0, 1.04, 960, 540], qadvice: [1.0, 1.03, 960, 520],
  qlesson: [1.0, 1.03, 960, 540], qeuthy: [1.0, 1.04, 960, 540], qchat2: [1.0, 1.03, 960, 520], qexplain: [1.0, 1.03, 960, 520],
  qmidwife: [1.0, 1.04, 960, 540], qmeno: [1.0, 1.02, 960, 540], qfriend: [1.0, 1.04, 960, 540], qlike: [1.0, 1.03, 960, 520],
  qtrial: [1.0, 1.03, 960, 540], qcell: [1.0, 1.04, 960, 540], qnote: [1.0, 1.04, 960, 540], qask: [1.0, 1.04, 960, 540]
});

/* ---------- expressions + poses ---------- */
E['당황'] = { eyeL: ell(165, 190, 9, 10), eyeR: ell(235, 190, 9, 10), eyeFill: INK, eyeSW: 0, whites: true, bL: [140, 150, 163, 140, 186, 146], bR: [214, 146, 237, 140, 260, 150], mouth: 'M182 240 L190 234 L198 240 L206 234 L214 240', mouthFill: 'none', sweat: true };
E['생각'] = Object.assign(dotEyes(9, 12), { bL: [140, 146, 163, 136, 186, 142], bR: [214, 150, 237, 146, 260, 150], mouth: 'M190 236 Q198 231 210 234', mouthFill: 'none' });
E['미소'] = Object.assign(dotEyes(10, 12), { bL: [140, 148, 163, 142, 186, 148], bR: [214, 148, 237, 142, 260, 148], mouth: 'M184 230 Q200 246 216 230', mouthFill: 'none' });
P['팔짱'] = Object.assign({ armL: [[148, 285], [134, 340], [230, 348]], hL: [236, 346], armR: [[252, 285], [266, 338], [170, 334]], hR: [164, 332] }, LEGS);
P['설명'] = Object.assign({ armL: [[148, 285], [104, 338], [76, 306]], hL: [70, 300], armR: [[252, 285], [296, 338], [324, 306]], hR: [330, 300] }, LEGS);
P['어깨'] = Object.assign({ armL: [[148, 285], [98, 304], [82, 264]], hL: [78, 256], armR: [[252, 285], [302, 304], [318, 264]], hR: [322, 256] }, LEGS);
P['막대'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [300, 338], [340, 376]], hR: [346, 382] }, LEGS);
P['앉기'] = { armL: [[148, 285], [124, 340], [152, 392]], hL: [158, 396], armR: [[252, 285], [276, 340], [248, 392]], hR: [242, 396], legL: [[180, 412], [150, 452], [156, 500]], fL: [150, 512, 0], legR: [[220, 412], [250, 452], [244, 500]], fR: [250, 512, 0], dy: 40 };
P['앉아손'] = Object.assign({}, P['앉기'], { armR: [[252, 285], [302, 245], [320, 180]], hR: [322, 170] });
P['앉아설명'] = Object.assign({}, P['앉기'], { armL: [[148, 285], [104, 338], [76, 306]], hL: [70, 300], armR: [[252, 285], [296, 338], [324, 306]], hR: [330, 300] });
P['앉아턱'] = Object.assign({}, P['앉기'], { armR: P['턱괴기'].armR, hR: P['턱괴기'].hR });
P['앉아폰'] = Object.assign({}, P['앉기'], { armL: P['폰보기'].armL, hL: P['폰보기'].hL, armR: P['폰보기'].armR, hR: P['폰보기'].hR });

/* ---------- small helpers ---------- */
const r3 = v => Math.round(v * 1000) / 1000;
const hd = (x, y, s, dy = 0) => [x, y - (390 - dy) * s];           // head centre of a char() at feet (x, y)
const at = (lt, f, D) => lt > f * D;
// pop something in at f*D (and optionally out at f2*D)
const PA = (t, lt, D, f, x, y, inner, o = {}) => (lt > f * D && (o.f2 == null || lt < o.f2 * D)) ? pop(t, t - lt + f * D, o.f2 == null ? t + 99 : t - lt + o.f2 * D, x, y, inner, o) : '';
// speech balloon in at f*D (and out at f2*D), tail to (tx, ty)
const SPK = (t, lt, D, f, f2, x, y, w, hh, text, tx, ty, o = {}) => (lt > f * D && (f2 == null || lt < f2 * D)) ? pop(t, t - lt + f * D, f2 == null ? t + 99 : t - lt + f2 * D, 0, 0, speech(x, y, w, hh, text, tx, ty, o), { noPop: true, inDur: 0.25 }) : '';
// thought cloud in at f*D
const THK = (t, lt, D, f, f2, x, y, w, hh, text, o = {}) => PA(t, lt, D, f, x, y, bubble(0, 0, w, hh, (Array.isArray(text) ? text : [text]).map((s, i, A) => T8(0, (o.size || 40) * 0.36 + (i - (A.length - 1) / 2) * (o.size || 40) * 1.25, s, { size: o.size || 40, fill: o.fill || NAVY })).join(''), o), { f2, bob: 4 });
const tw = (s, fs) => s.length * fs * 0.95 + 70;                  // rough width of a text line
const fadeG = (op, inner) => op <= 0 ? '' : `<g opacity="${f1(clamp(op, 0, 1) * 100) / 100}">${inner}</g>`;
const xf = (lt, D, f, d = 0.06) => prog(lt, f * D, f * D + d * D);  // crossfade 0..1
function qSign(x, y, s = 1, rot = 0) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><rect x="-8" y="0" width="16" height="170" rx="6" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="-10" r="78" fill="${YEL}" stroke="${INK}" stroke-width="8"/>${T8(0, 30, '?', { size: 112 })}</g>`; }
function heldSign(x, y, s, pose, sc = 0.55, rot = 8) { const [hx, hy] = handG(x, y, s, P[pose].hR); return qSign(hx, hy - 120 * sc, sc, rot) + hand(hx, hy, s); }
function glowQ(x, y, s, t, c = YEL) { const p = 1 + Math.sin(t * 3) * 0.05; return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * p * 1000) / 1000})"><circle r="110" fill="url(#warm)"/>${T8(0, 40, '?', { size: 120, fill: c, stroke: INK, sw: 9 })}</g>`; }
function scrollRoll(x, y, s, rot = 0) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><rect x="-60" y="-22" width="120" height="44" rx="20" fill="#F4E9D0" stroke="${INK}" stroke-width="6"/><ellipse cx="-60" cy="0" rx="12" ry="22" fill="#E4D2AE" stroke="${INK}" stroke-width="5"/><path d="M-30 -6 L40 -6 M-30 8 L30 8" stroke="#B9A57E" stroke-width="5" stroke-linecap="round"/></g>`; }
function xStamp(x, y, s = 1) { return xMark(x, y, s); }
function coinBag(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-50 -30 Q-70 40 -34 54 L34 54 Q70 40 50 -30 Q26 -50 0 -46 Q-26 -50 -50 -30 Z" fill="#B88A4A" stroke="${INK}" stroke-width="6"/><path d="M-26 -50 L0 -66 L26 -50" fill="#9A6E34" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle cx="0" cy="12" r="16" fill="${YEL}" stroke="${INK}" stroke-width="4"/></g>`; }
function keyG(x, y, s, rot = 0) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})"><circle cx="-40" cy="0" r="22" fill="none" stroke="#C9A04A" stroke-width="12"/><circle cx="-40" cy="0" r="22" fill="none" stroke="${INK}" stroke-width="3"/><path d="M-18 0 L50 0 M30 0 L30 18 M44 0 L44 14" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M-18 0 L50 0 M30 0 L30 18 M44 0 L44 14" stroke="#C9A04A" stroke-width="9" stroke-linecap="round"/></g>`; }
function bulbQ(x, y, s, t) { return bulb(x, y, s, 0.8 + Math.sin(t * 4) * 0.2); }
function sparkle(x, y, s, t, c = YEL) { const k = (Math.sin(t * 5) + 1) / 2; return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * (0.7 + 0.3 * k) * 100) / 100})"><path d="M0 -30 L8 -8 L30 0 L8 8 L0 30 L-8 8 L-30 0 L-8 -8 Z" fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>`; }
function steam(x, y, t, c = RED) { let h = ''; for (let i = 0; i < 3; i++) { const k = ((t * 1.4 + i / 3) % 1); h += `<path d="M${f1(x - 30 + i * 30)} ${f1(y - k * 70)} q-10 -14 0 -28 q10 -14 0 -28" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" opacity="${f1((1 - k) * 90) / 100}"/>`; } return h; }
function nodK(t, on) { return on ? Math.max(0, Math.sin(t * 8)) : 0; }
function nodC(fn, o, t, on) { const k = nodK(t, on), L = o.look || [0, 0]; return `<g transform="translate(0 ${f1(k * 7 * (o.s || 1))})">${fn(Object.assign({}, o, { look: [L[0], lerp(L[1], 0.9, k)] }))}</g>`; }
function shake(fn, o, t, on) { return fn(Object.assign({}, o, { tilt: (o.tilt || 0) + (on ? Math.sin(t * 9) * 9 : 0) })); }

/* ---------- characters (same family as Zero) ---------- */
// Socrates: bald crown with a white fringe, white curly beard, snub nose, bare feet, worn tan himation over a pale chiton
const SOCB = '#E2E2E2';
function socHead(s) {
  const bi = s.indexOf('<path d="M90 176 Q94 300 200 322');
  if (bi < 0) return s;
  const q = (p0, p1, p2, k) => [(1 - k) * (1 - k) * p0[0] + 2 * (1 - k) * k * p1[0] + k * k * p2[0], (1 - k) * (1 - k) * p0[1] + 2 * (1 - k) * k * p1[1] + k * k * p2[1]];
  let curls = '';
  for (let i = 1; i <= 6; i++) { const [x, y] = q([90, 176], [94, 300], [200, 322], i / 6.3); curls += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${i > 4 ? 22 : 19}" fill="${SOCB}" stroke="${INK}" stroke-width="5"/>`; }
  for (let i = 0; i <= 5; i++) { const [x, y] = q([200, 322], [306, 300], [310, 176], 0.06 + i / 6.3); curls += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${i < 2 ? 22 : 19}" fill="${SOCB}" stroke="${INK}" stroke-width="5"/>`; }
  s = s.slice(0, bi) + curls + s.slice(bi);
  const mk = `<path d="M176 248 Q200 240 224 248" fill="none" stroke="${SOCB}" stroke-width="12" stroke-linecap="round"/>`;
  const mi = s.indexOf(mk);
  if (mi >= 0) {
    const add = `<path d="M116 222 q9 -11 18 0 M266 222 q9 -11 18 0 M146 276 q9 -11 18 0 M236 278 q9 -11 18 0 M190 300 q9 -11 18 0 M120 252 q8 -9 16 0 M264 254 q8 -9 16 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" opacity=".45"/><ellipse cx="200" cy="212" rx="15" ry="12" fill="#F4F0EC" stroke="${INK}" stroke-width="5"/><ellipse cx="205" cy="207" rx="5" ry="3.5" fill="#fff"/>`;
    s = s.slice(0, mi + mk.length) + add + s.slice(mi + mk.length);
  }
  const hk = `<ellipse cx="200" cy="170" rx="118" ry="112" fill="none" stroke="${INK}" stroke-width="8"/>`;
  const hi = s.indexOf(hk);
  if (hi >= 0) {
    const fr = [[104, 120, 18], [90, 150, 24], [84, 184, 22], [296, 120, 18], [310, 150, 24], [316, 184, 22]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SOCB}" stroke="${INK}" stroke-width="5"/>`).join('') + `<path d="M162 112 Q200 102 238 112 M172 130 Q200 122 228 130" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round" opacity=".25"/>`;
    s = s.slice(0, hi + hk.length) + fr + s.slice(hi + hk.length);
  }
  return s;
}
const TOES = s => s.replace(/<ellipse cx="([\d.-]+)" cy="([\d.-]+)" rx="27" ry="14" fill="#fff" stroke="#141414" stroke-width="7" transform="rotate\(([\d.-]+) [^"]*"\/>/g, (m, cx, cy, r) => m + `<g transform="rotate(${r} ${cx} ${cy})">${[-10, 0, 10].map(d => `<line x1="${f1(+cx + d)}" y1="${f1(+cy + 1)}" x2="${f1(+cx + d)}" y2="${f1(+cy + 11)}" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`).join('')}</g>`);
const SOC = o => HALO(TOES(socHead(char(Object.assign({ goggles: 'none', vest: '#EFE8D8', patch: false, tee: true, vshade: 'rgba(0,0,0,0.14)', beard: SOCB, dress: '#C9AE7E', toga: '#C9AE7E' }, o)))));
const GREEK = (c, o) => HALO(char(Object.assign({ goggles: 'none', vest: c.v, patch: false, tee: true, vshade: 'rgba(0,0,0,0.16)', toga: c.t, dress: c.d }, c.x || {}, o)));
const EUTH = o => GREEK({ v: '#DCE6F2', t: '#3E5C84', d: '#3E5C84', x: { hair: '#2B2B2B' } }, o);
const CHAER = o => GREEK({ v: '#F2E2D0', t: '#B5523A', d: '#B5523A', x: { hair: '#2B2B2B', beard: '#2B2B2B' } }, o);
const CRITO = o => GREEK({ v: '#E4E9EF', t: '#5C6B82', d: '#5C6B82', x: { hair: '#A8A8A8', beard: '#A8A8A8' } }, o);
const PLATO = o => GREEK({ v: '#E8EEF2', t: '#4E7A6A', d: '#4E7A6A', x: { hair: '#6B4A2E', beard: '#6B4A2E' } }, o);
const POL = o => GREEK({ v: '#F4F1EA', t: '#F4F1EA', d: '#F4F1EA', x: { hair: '#8A8A8A', beard: '#8A8A8A', togaStripe: '#7A3E8E' } }, o);
const POET = o => GREEK({ v: '#EDE2F4', t: '#7A5A9E', d: '#7A5A9E', x: { hair: '#6B4A2E', wreath: true } }, o);
const SMITH = o => HALO(char(Object.assign({ goggles: 'none', vest: '#C98A5A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', hair: '#3A2A1E', beard: '#3A2A1E' }, o)));
const PYTHIA = o => HALO(char(Object.assign({ goggles: 'none', vest: '#F4F1EA', patch: false, tee: true, vshade: 'rgba(0,0,0,0.12)', longHair: '#2B2B2B', hair: '#2B2B2B', wreath: true, dress: '#F4F1EA', lashes: true }, o)));
const BOY = o => HALO(char(Object.assign({ goggles: 'none', vest: '#E8C27A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.16)', hair: '#4A3426' }, o)));
const MOTHER = o => HALO(char(Object.assign({ goggles: 'none', vest: '#E9D9C0', patch: false, tee: true, vshade: 'rgba(0,0,0,0.14)', longHair: '#4A3426', hair: '#4A3426', dress: '#B9714A', lashes: true }, o)));
const CIT = (i, o) => HALO(char(Object.assign({ goggles: 'none', vest: ['#F2E2D0', '#DCE6F2', '#E9F0DA', '#F4E3E8', '#EDE6D3'][i % 5], patch: false, tee: true, vshade: 'rgba(0,0,0,0.16)', toga: ['#B5523A', '#3E5C84', '#5E8C4E', '#9E5A7A', '#8A6A44'][i % 5], dress: ['#B5523A', '#3E5C84', '#5E8C4E', '#9E5A7A', '#8A6A44'][i % 5], hair: ['#2B2B2B', '#6B4A2E', '#3A2A1E', '#8A8A8A', '#4A3426'][i % 5] }, i % 2 ? { beard: ['#2B2B2B', '#6B4A2E', '#3A2A1E', '#8A8A8A', '#4A3426'][i % 5] } : {}, o)));
const COW = (i, o) => HALO(char(Object.assign({ goggles: 'none', vest: ['#7CC7FF', '#B9A7FF', '#FFB3C7', '#8FD694'][i % 4], patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', hair: ['#2B2B2B', '#6B3E26', '#3A2A1E', '#8A5A2E'][i % 4] }, i % 2 ? { longHair: ['#2B2B2B', '#6B3E26', '#3A2A1E', '#8A5A2E'][i % 4] } : {}, o)));

/* ---------- Greek architecture ---------- */
function templeG(x, y, s, o = {}) {
  const n = o.n || 6, w = o.w || 600, ch = o.ch || 300, c = o.c || MARBLE, cw = o.cw || Math.min(64, w / n * 0.5);
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  h += `<rect x="${-w / 2 - 50}" y="-26" width="${w + 100}" height="26" fill="${c}" stroke="${INK}" stroke-width="6"/><rect x="${-w / 2 - 28}" y="-50" width="${w + 56}" height="24" fill="${c}" stroke="${INK}" stroke-width="6"/>`;
  if (o.inner) h += `<rect x="${-w / 2 + 10}" y="${-50 - ch}" width="${w - 20}" height="${ch}" fill="${o.inner}"/>`;
  for (let i = 0; i < n; i++) {
    const cx = -w / 2 + cw / 2 + 6 + i * (w - cw - 12) / (n - 1);
    h += `<rect x="${f1(cx - cw / 2)}" y="${-50 - ch}" width="${cw}" height="${ch}" fill="${c}" stroke="${INK}" stroke-width="6"/>`;
    for (let k = 1; k < 3; k++) h += `<line x1="${f1(cx - cw / 2 + k * cw / 3)}" y1="${-40 - ch}" x2="${f1(cx - cw / 2 + k * cw / 3)}" y2="-60" stroke="#C9C0AE" stroke-width="4"/>`;
    h += `<rect x="${f1(cx - cw / 2 - 10)}" y="${-50 - ch - 16}" width="${cw + 20}" height="16" fill="${c}" stroke="${INK}" stroke-width="5"/>`;
  }
  const top = -50 - ch - 16;
  h += `<rect x="${-w / 2 - 26}" y="${top - 60}" width="${w + 52}" height="60" fill="${c}" stroke="${INK}" stroke-width="6"/>`;
  if (o.frieze) h += `<text x="0" y="${top - 18}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${o.fs || 34}" fill="#9C8F78" letter-spacing="6">${esc(o.frieze)}</text>`;
  if (o.ped !== false) h += `<path d="M${-w / 2 - 40} ${top - 60} L0 ${f1(top - 60 - w * 0.17)} L${w / 2 + 40} ${top - 60} Z" fill="${c}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M${-w / 2 + 30} ${top - 72} L0 ${f1(top - 60 - w * 0.17 + 22)} L${w / 2 - 30} ${top - 72} Z" fill="none" stroke="#C9C0AE" stroke-width="4"/>`;
  return h + `</g>`;
}
function skyDefs(id, a, b) { return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`; }
function athensBg(t, o = {}) {
  let h = skyDefs('qSkyA', '#8FCDF0', '#FFF1D8') + BG('url(#qSkyA)');
  h += `<circle cx="1660" cy="150" r="62" fill="#FFF3B0"/><circle cx="1660" cy="150" r="180" fill="url(#warm)" opacity=".6"/>` + clouds(t, 60, 12, 3, 21);
  h += `<path d="M-600 600 Q100 520 520 556 Q900 500 1240 540 Q1700 470 2520 560 L2520 1480 L-600 1480 Z" fill="#C7D3AE" stroke="${INK}" stroke-width="5"/>`;
  if (o.acro !== false) h += `<path d="M1160 610 Q1210 476 1330 456 L1820 446 Q1910 476 1940 610 Z" fill="#D9C7A0" stroke="${INK}" stroke-width="6"/><path d="M1240 560 Q1300 520 1380 530 M1700 520 Q1780 510 1850 560" fill="none" stroke="${INK}" stroke-width="4" opacity=".3"/>` + templeG(1580, 458, 0.34, { n: 8, w: 640, ch: 210 });
  // stoa colonnade, middle ground
  const sy = o.gy || 770;
  h += `<rect x="-600" y="${sy - 250}" width="${o.stoaW || 1500}" height="250" fill="#E9E1CF" stroke="${INK}" stroke-width="6"/><rect x="-600" y="${sy - 250}" width="${o.stoaW || 1500}" height="250" fill="#C9BFA8" opacity=".55"/>`;
  for (let i = 0; i < 12; i++) { const cx = -560 + i * 128; if (cx > (o.stoaW || 1500) - 640) break; h += `<rect x="${cx}" y="${sy - 236}" width="40" height="236" fill="${MARBLE}" stroke="${INK}" stroke-width="5"/>`; }
  h += `<rect x="-600" y="${sy - 290}" width="${(o.stoaW || 1500) + 30}" height="48" fill="${MARBLE}" stroke="${INK}" stroke-width="6"/><path d="M-600 ${sy - 290} L${(o.stoaW || 1500) - 570} ${sy - 290} L${(o.stoaW || 1500) - 600} ${sy - 330} L-600 ${sy - 330} Z" fill="#B5523A" stroke="${INK}" stroke-width="6"/>`;
  h += `<rect x="-600" y="${sy}" width="3120" height="900" fill="#E7D8B6"/><line x1="-600" y1="${sy}" x2="2520" y2="${sy}" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 14; i++) h += `<line x1="${-200 + i * 170}" y1="${sy + 6}" x2="${-330 + i * 190}" y2="1100" stroke="#CDBB94" stroke-width="4"/>`;
  for (let j = 1; j < 4; j++) h += `<line x1="-600" y1="${sy + j * 70}" x2="2520" y2="${sy + j * 70}" stroke="#CDBB94" stroke-width="4"/>`;
  if (o.olive !== false) h += oliveTree(o.ox || 1820, sy + 20, 0.9, t);
  return h;
}
function oliveTree(x, y, s, t) {
  const sw = Math.sin(t * 0.9) * 1.5;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-26 0 Q-10 -80 -40 -160 Q-20 -200 0 -230 L20 -230 Q10 -170 30 -130 Q46 -60 26 0 Z" fill="#8A6A4A" stroke="${INK}" stroke-width="6"/>`;
  h += `<g transform="rotate(${f1(sw)} 0 -230)">`;
  for (const [cx, cy, r] of [[-120, -260, 80], [0, -320, 100], [120, -260, 84], [-50, -230, 70], [60, -220, 70]]) h += `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${f1(r * 0.7)}" fill="#8FA36A" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 9; i++) h += `<ellipse cx="${f1(-140 + i * 34)}" cy="${f1(-300 + Math.sin(i * 2.1) * 40)}" rx="10" ry="5" fill="#C9D6A2" transform="rotate(${i * 30} ${f1(-140 + i * 34)} ${f1(-300 + Math.sin(i * 2.1) * 40)})"/>`;
  return h + `</g></g>`;
}

/* ---------- office (Zero's meeting room) ---------- */
function officeBg(t, board) {
  let h = BG('#E4EAF0') + BG('url(#hatch)').replace('/>', ' opacity=".12"/>');
  h += `<rect x="1430" y="120" width="420" height="320" rx="12" fill="#CFE9FF" stroke="${INK}" stroke-width="10"/>`;
  [[1460, 290, 70, 145], [1540, 240, 60, 195], [1610, 310, 80, 125], [1700, 260, 60, 175], [1770, 320, 60, 115]].forEach(([x, y, w, hh], i) => { h += `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${['#9FB6CC', '#8AA4BD', '#A9BED2'][i % 3]}"/>`; for (let k = 0; k < 4; k++) h += `<rect x="${x + 12}" y="${y + 18 + k * 30}" width="${w - 24}" height="10" fill="#E8F4FF" opacity=".7"/>`; });
  h += `<line x1="1640" y1="120" x2="1640" y2="440" stroke="${INK}" stroke-width="8"/>`;
  h += `<rect x="60" y="130" width="560" height="340" rx="10" fill="#fff" stroke="${INK}" stroke-width="9"/><rect x="60" y="470" width="560" height="16" fill="#C3CDD8" stroke="${INK}" stroke-width="5"/>`;
  h += board || '';
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#B4BFCA"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  return h;
}
const marker = (x, y, txt, c, fs = 52, rot = 0) => `<text x="${x}" y="${y}" transform="rotate(${rot} ${x} ${y})" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${fs}" fill="${c}">${esc(txt)}</text>`;
function meetTable(t) {
  let h = `<rect x="820" y="690" width="940" height="40" rx="12" fill="#C9A06A" stroke="${INK}" stroke-width="8"/><rect x="850" y="730" width="880" height="150" fill="#A97E4E" stroke="${INK}" stroke-width="7"/>`;
  h += `<rect x="930" y="664" width="110" height="26" rx="4" fill="#fff" stroke="${INK}" stroke-width="4" transform="rotate(-4 985 677)"/><rect x="1460" y="664" width="110" height="26" rx="4" fill="#fff" stroke="${INK}" stroke-width="4" transform="rotate(5 1515 677)"/>`;
  h += mug(1690, 660, 0.42, t);
  return h;
}
const SEATY = 806, SEATS = 0.62, SX = [1010, 1300, 1590];  // coworker, Zero, coworker
function team(t, o) { // o: {nod, looks:[...], ex:[...], zpose, zfn}
  let h = '';
  const ex = o.ex || ['기본', '기본', '기본'], lk = o.looks || [[-0.6, 0], [-0.6, 0], [-0.7, 0]];
  h += nodC(p => COW(0, p), { t, seed: 2001, x: SX[0], y: SEATY, s: SEATS, ex: typeof ex[0] === 'string' ? exprAt([[0, ex[0]]], t) : ex[0], look: lk[0] }, t + 0.4, o.nod && o.nod[0]);
  h += nodC(Z, { t, seed: 2002, x: SX[1], y: SEATY - (o.zrise || 0), s: SEATS, pose: o.zpose || '서기', ex: typeof ex[1] === 'string' ? exprAt([[0, ex[1]]], t) : ex[1], look: lk[1], sweat: o.zsweat }, t, o.nod && o.nod[1]);
  h += nodC(p => COW(1, p), { t, seed: 2003, x: SX[2], y: SEATY, s: SEATS, ex: typeof ex[2] === 'string' ? exprAt([[0, ex[2]]], t) : ex[2], look: lk[2] }, t + 0.9, o.nod && o.nod[2]);
  return h;
}
function boardHook(lt, D) {
  let h = T8(340, 186, '3분기 전략', { size: 40 }) + `<line x1="200" y1="200" x2="480" y2="200" stroke="${INK}" stroke-width="4"/>`;
  h += marker(220, 280, '린하게!', RED, 58, -4) + marker(470, 300, '피벗 각', '#2F6FD6', 54, 3);
  h += marker(250, 400, 'MVP → 스케일업', '#1F9D6B', 40, -2) + `<path d="M420 250 Q520 330 470 410" fill="none" stroke="${INK}" stroke-width="5" stroke-dasharray="10 8"/>`;
  return h;
}

/* ---------- HOOK: nodding along ---------- */
function qmeetingScene(t, lt, a) {
  const D = D_(a);
  let h = officeBg(t, boardHook(lt, D));
  const bx = 700, by = 930, bs = 0.78, [bhx, bhy] = hd(bx, by, bs);
  h += BOSS({ t, seed: 2000, x: bx, y: by, s: bs, pose: a.k === 1 && Math.sin(t * 2.4) > -0.3 ? '설명' : (a.k ? '서기' : '가리키기'), ex: exprAt([[0, '뿌듯']], t), look: [0.7, -0.1] });
  if (!a.k) {
    h += team(t, { nod: [1, 1, 1], ex: ['미소', '미소', '미소'] });
    h += meetTable(t);
    const [zx, zy] = hd(SX[1], SEATY, SEATS);
    h += qmarks(t, 2010, 4, [zx - 120, zy - 330, 240, 200], { size: 56 });
    h += PA(t, lt, D, 0.1, 960, 90, big(0, 0, [[['아는 척 ', '#fff'], ['끄덕인', YEL], [' 적 있나요?', '#fff']]], { size: 70, sw: 14 }), {});
    h += PA(t, lt, D, 0.45, SX[0], 480, label(0, 0, '끄덕끄덕', { size: 30, bg: '#fff' }), { bob: 3 });
    h += PA(t, lt, D, 0.55, SX[2], 480, label(0, 0, '끄덕끄덕', { size: 30, bg: '#fff' }), { bob: 3 });
    return h;
  }
  if (a.k === 1) {
    h += team(t, { ex: ['기본', '놀람', '기본'], looks: [[-0.7, 0], [-0.8, -0.1], [-0.8, 0]] });
    h += meetTable(t);
    h += SPK(t, lt, D, 0.18, null, 1080, 255, 600, 156, ['이번 분기는 린하게,', '피벗 각 보면서 가죠.'], bhx + 70, bhy - 80, { size: 44 });
    // the jargon on the board lights up as it is said
    if (at(lt, 0.42, D)) h += `<rect x="130" y="228" width="190" height="70" rx="16" fill="${YEL}" opacity="${r3(0.35 + 0.15 * Math.sin(t * 6))}"/>`;
    if (at(lt, 0.68, D)) h += `<rect x="380" y="250" width="180" height="70" rx="16" fill="${YEL}" opacity="${r3(0.35 + 0.15 * Math.sin(t * 6))}"/>`;
    h += PA(t, lt, D, 0.05, 960, 70, label(0, 0, '회의 시간', { size: 36, bg: '#fff' }), {});
    return h;
  }
  // k2: Zero nods hard… and wonders
  const nodOn = lt < 0.55 * D;
  h += team(t, { nod: [0, nodOn, 0], ex: ['기본', exprAt([[0, '신남'], [0.5 * D, '걱정']], lt), '기본'], looks: [[-0.7, 0], [-0.7, 0], [-0.8, 0]], zsweat: lt > 0.5 * D });
  h += meetTable(t);
  const [zx, zy] = hd(SX[1], SEATY, SEATS);
  h += SPK(t, lt, D, 0.08, 0.5, 1020, 360, 300, 110, '네, 네!', zx - 60, zy - 70, { size: 48 });
  if (nodOn) for (let i = 0; i < 2; i++) h += `<path d="M${zx + 120 + i * 18} ${zy - 40} q14 20 0 40" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity=".55"/>`;
  h += THK(t, lt, D, 0.55, null, 1480, 330, 400, 120, '린이 뭐지?', { size: 48 });
  return h;
}

/* ---------- HOOK 2: the group-chat fight ---------- */
function chatUI(t, lt, D, msgs, o = {}) {
  const x0 = 960 - 370, y0 = 100, w = 740, hh = 770, top = y0 + 116, bot = y0 + hh - 30;
  let h = panel(x0, y0, w, hh, { r: 46, fill: '#1F2D44' });
  h += `<rect x="${x0 + 22}" y="${y0 + 22}" width="${w - 44}" height="${hh - 44}" rx="28" fill="#DDE6EF"/>`;
  h += `<path d="M${x0 + 22} ${y0 + 100} L${x0 + 22} ${y0 + 50} Q${x0 + 22} ${y0 + 22} ${x0 + 50} ${y0 + 22} L${x0 + w - 50} ${y0 + 22} Q${x0 + w - 22} ${y0 + 22} ${x0 + w - 22} ${y0 + 50} L${x0 + w - 22} ${y0 + 100} Z" fill="#C2D0DE"/>`;
  h += T8(960, y0 + 74, o.title || '단톡방 · 2명', { size: 34 }) + `<path d="M${x0 + 64} ${y0 + 48} L${x0 + 46} ${y0 + 62} L${x0 + 64} ${y0 + 76}" fill="none" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/>`;
  const fs = 36, lh = 46, gap = 18;
  const vis = msgs.filter(m => lt > m[0] * D);
  const H = vis.map(m => (Array.isArray(m[2]) ? m[2].length : 1) * lh + 28);
  const total = H.reduce((s, x) => s + x + gap, 0), avail = bot - top;
  // smooth scroll: the newest message slides in
  const last = vis.length ? vis[vis.length - 1] : null, kIn = last ? easeOut(clamp((lt - last[0] * D) / 0.3, 0, 1)) : 1;
  const prevTotal = total - (H.length ? H[H.length - 1] + gap : 0);
  const off = lerp(Math.max(0, prevTotal - avail), Math.max(0, total - avail), kIn);
  h += `<clipPath id="qchatClip"><rect x="${x0 + 22}" y="${top - 10}" width="${w - 44}" height="${bot - top + 10}"/></clipPath><g clip-path="url(#qchatClip)">`;
  let y = top - off;
  vis.forEach((m, i) => {
    const [f, side, txt, kind] = m, lines = Array.isArray(txt) ? txt : [txt], bh = H[i];
    const bwid = Math.min(560, Math.max(...lines.map(s => s.length)) * fs * 0.96 + 44);
    const k = easeOutBack(clamp((lt - f * D) / 0.28, 0, 1));
    const fill = kind === 'hot' ? '#FFD9D6' : kind === 'calm' ? '#CFF6E4' : kind === 'link' ? '#fff' : (side === 'R' ? '#FFC79A' : '#fff');
    const stroke = kind === 'hot' ? RED : kind === 'calm' ? '#1F9D6B' : INK;
    const bx = side === 'R' ? x0 + w - 50 - bwid : x0 + 112;
    let g = '';
    if (side === 'L') g += `<circle cx="${x0 + 70}" cy="${y + 28}" r="26" fill="#7CC7FF" stroke="${INK}" stroke-width="4"/><circle cx="${x0 + 62}" cy="${y + 24}" r="3.5" fill="${INK}"/><circle cx="${x0 + 78}" cy="${y + 24}" r="3.5" fill="${INK}"/><path d="M${x0 + 50} ${y + 14} Q${x0 + 70} ${y - 2} ${x0 + 90} ${y + 14}" fill="#3A2A1E"/>`;
    if (kind === 'typing') { g += `<rect x="${bx}" y="${y}" width="120" height="${bh}" rx="22" fill="#fff" stroke="${INK}" stroke-width="4"/>`; for (let d = 0; d < 3; d++) g += `<circle cx="${bx + 32 + d * 28}" cy="${y + bh / 2 + Math.sin(t * 9 - d) * 5}" r="8" fill="#8A97A6"/>`; }
    else if (kind === 'link') {
      g += `<rect x="${bx}" y="${y}" width="${bwid}" height="${bh}" rx="22" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="${bx + 14}" y="${y + 14}" width="70" height="${bh - 28}" rx="10" fill="#9FC7E8"/><path d="M${bx + 24} ${y + bh - 24} L${bx + 44} ${y + 40} L${bx + 62} ${y + bh - 30}" fill="none" stroke="#fff" stroke-width="5"/>`;
      lines.forEach((s, j) => g += T8(bx + 100, y + 14 + lh * 0.72 + j * lh, s, { anchor: 'start', size: j ? 26 : fs, fill: j ? '#5A6B80' : NAVY }));
    } else {
      g += `<rect x="${bx}" y="${y}" width="${bwid}" height="${bh}" rx="22" fill="${fill}" stroke="${stroke}" stroke-width="${kind === 'hot' || kind === 'calm' ? 5 : 4}"/>`;
      lines.forEach((s, j) => g += T8(bx + 22, y + 14 + lh * 0.72 + j * lh, s, { anchor: 'start', size: fs, fill: NAVY }));
    }
    const ox = side === 'R' ? bx + bwid : bx;
    h += `<g opacity="${f1(clamp(k, 0, 1) * (m[4] == null ? 1 : m[4]) * 100) / 100}" transform="translate(${f1(ox)} ${f1(y + bh / 2)}) scale(${f1(lerp(0.6, 1, k) * 1000) / 1000}) translate(${f1(-ox)} ${f1(-(y + bh / 2))})">${g}</g>`;
    y += bh + gap;
  });
  return h + `</g>`;
}
const FIGHT = [[0.02, 'L', 'AI가 5년 안에 일자리 절반 없앤대!', 'hot'], [0.16, 'R', '말도 안 돼. 절대 아니거든?', 'hot'], [0.3, 'L', '기사에 다 나왔다니까!!', 'hot'], [0.42, 'R', '그 기사를 믿어?', 'hot'], [0.54, 'L', '그럼 넌 뭘 아는데?', 'hot'], [0.66, 'R', '너보단 알아!!!', 'hot'], [0.78, 'L', '하… 진짜', 'hot']];
function chatPeople(t, lt, D, o) {
  let h = '';
  const zx = 260, fx = 1620, y = 940, s = 0.72;
  h += Z({ t, seed: 2100, x: zx, y, s, pose: '폰보기', ex: exprAt([[0, o.zex || '화남']], t), look: [0.4, 0.8], sweat: o.sweat });
  h += phone(...handG(zx, y, s, [200, 318]), 0.36, { on: 1 });
  h += PT({ t, seed: 2101, x: fx, y, s, pose: '폰보기', ex: exprAt([[0, o.fex || '화남']], t), look: [-0.4, 0.8], sweat: o.sweat });
  h += phone(...handG(fx, y, s, [200, 318]), 0.36, { on: 1 });
  if (o.hot) { const [a1, b1] = hd(zx, y, s), [a2, b2] = hd(fx, y, s); h += steam(a1, b1 - 110, t) + steam(a2, b2 - 110, t + 0.5); }
  return h;
}
function qchatScene(t, lt, a) {
  const D = D_(a);
  if (!a.k) {
    let h = BG('url(#feedBg)') + BG('url(#dots)');
    h += chatPeople(t, lt, D, { hot: 1 });
    h += chatUI(t, lt, D, FIGHT);
    h += PA(t, lt, D, 0.62, 1640, 220, `<g>${wallClock(0, 0, 66, 0, 30 * Math.min(1, lt / D))}</g>`, {});
    h += PA(t, lt, D, 0.66, 1640, 350, label(0, 0, '30분째', { size: 44, bg: PINK, color: '#fff' }), { rot: 4, bob: 3 });
    h += PA(t, lt, D, 0.1, 250, 300, label(0, 0, '그날 밤', { size: 40, bg: '#fff' }), { rot: -3 });
    return h;
  }
  // k1: neither of them really knew… then 2 a.m.
  const sw = xf(lt, D, 0.36);
  let h = '';
  if (sw < 1) {
    let g = BG('url(#feedBg)') + BG('url(#dots)');
    g += chatPeople(t, lt, D, { zex: '당황', fex: '당황', sweat: 1 });
    g += fadeG(0.45, chatUI(t, 99, 1, FIGHT));
    g += THK(t, lt, D, 0.04, null, 430, 440, 380, 110, '(사실 잘 모름)', { size: 38 });
    g += THK(t, lt, D, 0.14, null, 1450, 440, 380, 110, '(나도 잘 모름)', { size: 38, right: 1 });
    h += fadeG(1 - sw, g);
  }
  if (sw > 0) {
    let g = bedroom(t, { clock: '02:00' }) + BG('#000').replace('/>', ' opacity=".35"/>');
    g += `<ellipse cx="620" cy="770" rx="150" ry="46" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
    const x = 820, y = 900, s = 0.74;
    g += `<circle cx="${x}" cy="660" r="330" fill="url(#screenGlow)"/>`;
    g += Z({ t, seed: 2102, x, y, s, pose: '폰보기', ex: exprAt([[0, '걱정']], t), look: [Math.sin(t * 2.2) > 0.5 ? 0.8 : (Math.sin(t * 2.2) < -0.5 ? -0.8 : 0), 0.4], light: 1, shade: '#C9D9F0' });
    g += blanket(800);
    const [px, py] = handG(x, y, s, [200, 318]);
    g += phone(px, py - 6, 0.42, { on: 1, glow: 0 }) + hand(px - 24, py + 8, s) + hand(px + 24, py + 8, s);
    const q = '린하다 뜻', n = Math.floor(clamp((lt - 0.62 * D) / (0.22 * D), 0, 1) * q.length);
    g += PA(t, lt, D, 0.5, 1180, 300, `<rect x="-330" y="-56" width="660" height="112" rx="56" fill="#fff" stroke="${INK}" stroke-width="8"/><circle cx="-262" cy="-6" r="24" fill="none" stroke="${NAVY}" stroke-width="8"/><line x1="-244" y1="12" x2="-224" y2="32" stroke="${NAVY}" stroke-width="9" stroke-linecap="round"/>` + T8(-196, 18, q.slice(0, n) + (Math.floor(t * 3) % 2 ? '|' : ''), { anchor: 'start', size: 52 }), {});
    g += PA(t, lt, D, 0.42, 1180, 170, label(0, 0, '몰래 검색', { size: 38, bg: PINK, color: '#fff' }), { rot: -3 });
    h += fadeG(sw, g);
  }
  return h;
}

/* ---------- Socrates in the agora ---------- */
function qagoraScene(t, lt, a) {
  const D = D_(a);
  let h = athensBg(t, {});
  if (!a.k) {
    const people = [[1060, 0], [1360, 1], [1620, 2]];
    const walk = prog(lt, 0.02 * D, 0.42 * D), sx = lerp(80, 760, easeInOut(walk));
    people.forEach(([x, i], j) => {
      const asked = at(lt, 0.48 + j * 0.12, D);
      h += CIT(i, { t, seed: 2200 + i, x, y: 930, s: 0.62, ex: exprAt([[0, '기본'], [(0.52 + j * 0.12) * D, '놀람']], lt), look: [-0.7, -0.1], pose: asked ? '턱괴기' : '서기' });
      if (asked) h += PA(t, lt, D, 0.5 + j * 0.12, x, 470 - (j % 2) * 30, T8(0, 0, '?!', { size: 60, fill: YEL, stroke: INK, sw: 8 }), { bob: 4 });
    });
    const walking = walk > 0 && walk < 1;
    h += SOC({ t, seed: 2210, x: sx, y: 940, s: 0.72, pose: walking ? walkPose(t * 6.5, 0.6) : '설명', ex: exprAt([[0, '미소']], t), look: [0.8, -0.1] });
    h += PA(t, lt, D, 0.04, 960, 90, big(0, 0, [[['약 ', '#fff'], ['2,400년 전', YEL], [' · 아테네', '#fff']]], { size: 72 }), {});
    h += SPK(t, lt, D, 0.47, null, 860, 330, 380, 110, '그게 뭔가?', sx + 80, 940 - 0.72 * 470, { size: 44 });
    if (at(lt, 0.66, D)) { h += PA(t, lt, D, 0.66, sx - 230, 860, label(0, 0, '맨발', { size: 40, bg: YEL }), { rot: -4 }); h += `<path d="M${f1(sx - 170)} 880 Q${f1(sx - 120)} 930 ${f1(sx - 60)} 930" fill="none" stroke="${INK}" stroke-width="5" stroke-dasharray="10 8" opacity="${r3(prog(lt, 0.66 * D, 0.72 * D))}"/>`; }
    return h;
  }
  // k1: name card, no books, Plato writes it down
  const sx = 600;
  h += SOC({ t, seed: 2211, x: sx, y: 940, s: 0.8, pose: lt > 0.3 * D ? '설명' : '서기', ex: exprAt([[0, '미소']], t), look: [0.6, -0.1] });
  h += PA(t, lt, D, 0.05, sx, 210, label(0, 0, '철학자 소크라테스', { size: 48, bg: YEL }), {});
  h += PA(t, lt, D, 0.1, sx, 290, label(0, 0, '기원전 470년경 ~ 399년', { size: 30, bg: '#fff' }), {});
  if (at(lt, 0.3, D)) h += PA(t, lt, D, 0.3, 190, 540, book(0, 0, 120, 150, '#8A4B32', '') + xMark(0, 0, 0.7), {}) + PA(t, lt, D, 0.34, 190, 680, label(0, 0, '쓴 책 0권', { size: 36, bg: '#fff' }), {});
  const px = 1400;
  if (at(lt, 0.52, D)) {
    const op = prog(lt, 0.52 * D, 0.6 * D);
    h += fadeG(op, PLATO({ t, seed: 2212, x: px, y: 940, s: 0.74, pose: '책상', ex: exprAt([[0, '생각']], t), look: [-0.4, 0.6] }) + deskG(px + 20, 770, 420) + scrollRoll(px + 30, 752, 1.1, -4));
    h += PA(t, lt, D, 0.58, px, 290, label(0, 0, '제자 플라톤', { size: 44, bg: MINT }), {});
    // the talk flows into the scroll
    for (let i = 0; i < 6; i++) { const k = ((t * 0.5 + i / 6) % 1), x = lerp(sx + 140, px + 30, k), y = lerp(560, 720, k) - Math.sin(k * Math.PI) * 220; h += `<g opacity="${f1(Math.sin(k * Math.PI) * op * 100) / 100}">${T8(x, y, i % 2 ? '?' : '…', { size: 52, fill: i % 2 ? YEL : '#fff', stroke: INK, sw: 7 })}</g>`; }
    h += PA(t, lt, D, 0.72, px + 250, 660, label(0, 0, '대화편', { size: 36, bg: '#fff' }), { rot: -4 });
  }
  return h;
}

/* ---------- Delphi ---------- */
function delphiBg(t) {
  let h = skyDefs('qSkyD', '#F6C99A', '#FFF4E0') + BG('url(#qSkyD)');
  h += `<circle cx="300" cy="190" r="60" fill="#FFF3B0"/><circle cx="300" cy="190" r="170" fill="url(#warm)" opacity=".6"/>`;
  h += `<path d="M-600 620 L-200 330 L80 470 L420 210 L760 420 L1100 160 L1500 380 L1800 250 L2520 520 L2520 1480 L-600 1480 Z" fill="#B7A7A0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  h += `<path d="M420 210 L520 330 L470 420 M1100 160 L1180 300 L1120 380 M1800 250 L1860 340" fill="none" stroke="${INK}" stroke-width="4" opacity=".3"/>`;
  h += `<path d="M-600 700 Q200 600 700 660 Q1200 600 1700 650 Q2100 620 2520 660 L2520 1480 L-600 1480 Z" fill="#9AA387" stroke="${INK}" stroke-width="5"/>`;
  for (const [x, s] of [[150, 1], [260, 0.8], [1780, 1.1], [1890, 0.85]]) h += `<g transform="translate(${x} 780) scale(${s})"><rect x="-6" y="-20" width="12" height="20" fill="#6A4A30"/><path d="M0 -260 Q40 -150 26 -20 L-26 -20 Q-40 -150 0 -260 Z" fill="#3F6B4A" stroke="${INK}" stroke-width="5"/></g>`;
  h += `<rect x="-600" y="830" width="3120" height="700" fill="#D9C7A0"/><line x1="-600" y1="830" x2="2520" y2="830" stroke="${INK}" stroke-width="6"/>`;
  h += templeG(1260, 836, 0.95, { n: 6, w: 680, ch: 330, frieze: 'ΓΝΩΘΙ ΣΑΥΤΟΝ', inner: '#5A4A40', fs: 36 });
  return h;
}
function tripod(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-60 0 L-20 -150 M60 0 L20 -150 M0 6 L0 -150" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M-60 0 L-20 -150 M60 0 L20 -150 M0 6 L0 -150" stroke="#C9A04A" stroke-width="8" stroke-linecap="round"/><path d="M-80 -160 L80 -160 Q70 -110 0 -104 Q-70 -110 -80 -160 Z" fill="#C9A04A" stroke="${INK}" stroke-width="6"/></g>`; }
function smoke(x, y, t, n = 9, spread = 60, hgt = 420) { let h = ''; for (let i = 0; i < n; i++) { const k = ((t * 0.22 + i / n) % 1), xx = x + Math.sin(k * 6 + i * 2.1) * spread * (0.4 + k), yy = y - k * hgt; h += `<circle cx="${f1(xx)}" cy="${f1(yy)}" r="${f1(18 + k * 46)}" fill="#DCD6E8" opacity="${f1(Math.sin(k * Math.PI) * 72) / 100}"/>`; } return h; }
function qoracleScene(t, lt, a) {
  const D = D_(a);
  const px = 1260;
  if (!a.k) {
    let h = delphiBg(t);
    h += smoke(px, 700, t, 10, 70, 460);
    h += tripod(px, 830, 0.9) + PYTHIA({ t, seed: 2300, x: px, y: 752, s: 0.52, pose: '앉기', ex: exprAt([[0, '잠']], t), look: [0, 0.3], noBlink: true });
    h += smoke(px, 640, t + 2, 5, 50, 300);
    const walk = prog(lt, 0, 0.32 * D), cx = lerp(-80, 560, easeOut(walk));
    h += CHAER({ t, seed: 2301, x: cx, y: 940, s: 0.76, pose: walk < 1 ? walkPose(t * 7, 0.7) : '설명', ex: exprAt([[0, '결심']], t), look: [0.8, -0.2] });
    h += PA(t, lt, D, 0.08, 1260, 80, label(0, 0, '델포이 신전', { size: 40, bg: '#fff' }), {});
    h += PA(t, lt, D, 0.2, 300, 470, label(0, 0, '친구 카이레폰', { size: 40, bg: YEL }), {});
    h += SPK(t, lt, D, 0.48, null, 640, 230, 640, 156, ['소크라테스보다', '지혜로운 사람이 있습니까?'], cx + 40, 940 - 0.76 * 480, { size: 44 });
    h += PA(t, lt, D, 0.5, px + 170, 520, label(0, 0, '무녀', { size: 34, bg: '#fff' }), {});
    return h;
  }
  const sw = xf(lt, D, 0.42);
  let h = '';
  if (sw < 1) {
    let g = delphiBg(t) + smoke(px, 700, t, 12, 80, 480);
    g += `<circle cx="${px}" cy="560" r="${f1(260 + 30 * Math.sin(t * 3))}" fill="url(#warm)"/>`;
    g += tripod(px, 830, 0.9) + PYTHIA({ t, seed: 2300, x: px, y: 752, s: 0.52, pose: '앉아설명', ex: exprAt([[0, '결심']], t), look: [-0.5, 0] });
    g += CHAER({ t, seed: 2301, x: 560, y: 940, s: 0.76, ex: exprAt([[0, '놀람']], t), look: [0.8, -0.2] });
    g += PA(t, lt, D, 0.04, 820, 300, big(0, 0, [[['없다.', YEL]]], { size: 150, sw: 22 }), { rot: -4 });
    g += PA(t, lt, D, 0.12, 820, 120, label(0, 0, '신탁의 대답', { size: 40, bg: '#fff' }), {});
    h += fadeG(1 - sw, g);
  }
  if (sw > 0) {
    let g = athensBg(t, { olive: false });
    g += SOC({ t, seed: 2302, x: 760, y: 940, s: 0.82, pose: '턱괴기', ex: exprAt([[0, '놀람'], [0.6 * D, '생각']], lt), look: [0.4, -0.6], tilt: 8 });
    g += qmarks(t, 2303, 4, [380, 220, 300, 260], { size: 64 });
    g += THK(t, lt, D, 0.55, null, 1110, 330, 560, 130, '나는 아는 게 없는데?', { size: 46 });
    h += fadeG(sw, g);
  }
  return h;
}

/* ---------- the "wise" people ---------- */
function wiseTracker(n, t) {
  let h = '';
  ['정치가', '시인', '장인'].forEach((nm, i) => {
    const x = 760 + i * 200, on = i === n, done = i < n;
    h += `<g transform="translate(${x} 96)">${label(0, 0, nm, { size: 32, bg: on ? YEL : (done ? '#DDE6EF' : '#fff') })}${done ? check(66, -20, 0.5) : ''}</g>`;
    if (i < 2) h += `<path d="M${x + 70} 96 L${x + 128} 96" stroke="${INK}" stroke-width="5" stroke-dasharray="8 8" opacity=".5"/>`;
  });
  return h;
}
function potWheel(x, y, s, t) { const sp = t * 6; return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-20" y="-80" width="40" height="80" fill="${WALNUT}" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="-80" rx="110" ry="22" fill="#9A7A5A" stroke="${INK}" stroke-width="6"/><path d="M-56 -86 Q-80 -150 -40 -190 L-30 -220 L30 -220 L40 -190 Q80 -150 56 -86 Z" fill="#C8723A" stroke="${INK}" stroke-width="6"/><path d="M${f1(-40 + Math.sin(sp) * 20)} -120 L${f1(-40 + Math.sin(sp) * 20)} -180 M${f1(10 + Math.sin(sp + 2) * 20)} -110 L${f1(10 + Math.sin(sp + 2) * 20)} -190" stroke="#A9572A" stroke-width="5"/></g>`; }
function lyreG(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-40 40 Q-70 -40 -40 -100 M40 40 Q70 -40 40 -100" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M-40 40 Q-70 -40 -40 -100 M40 40 Q70 -40 40 -100" fill="none" stroke="#C9A04A" stroke-width="9" stroke-linecap="round"/><line x1="-50" y1="-80" x2="50" y2="-80" stroke="${INK}" stroke-width="8"/><rect x="-46" y="30" width="92" height="30" rx="10" fill="#C9A04A" stroke="${INK}" stroke-width="5"/>${[-24, -8, 8, 24].map(d => `<line x1="${d}" y1="-80" x2="${d}" y2="32" stroke="${INK}" stroke-width="2.5"/>`).join('')}</g>`; }
function qwiseScene(t, lt, a) {
  const D = D_(a), n = a.k || 0;
  let h = athensBg(t, { acro: n !== 1, stoaW: 1100, olive: n === 1 });
  h += wiseTracker(n, t);
  const sx = 470, sy = 940, ss = 0.74, ox = 1330, oy = 940, os = 0.76;
  const [shx, shy] = hd(sx, sy, ss), [ohx, ohy] = hd(ox, oy, os);
  const askOn = n === 2 ? false : at(lt, n ? 0.4 : 0.55, D);
  h += SOC({ t, seed: 2400, x: sx, y: sy, s: ss, pose: askOn ? '가리키기' : '서기', ex: exprAt([[0, '미소']], t), look: [0.8, -0.1] });
  if (n === 0) {
    h += `<rect x="${ox - 150}" y="${oy - 40}" width="300" height="60" rx="8" fill="${MARBLE}" stroke="${INK}" stroke-width="6"/>`;
    const stuck = at(lt, 0.78, D);
    h += POL({ t, seed: 2401, x: ox, y: oy - 40, s: os, pose: stuck ? '서기' : '설명', ex: exprAt([[0, '뿌듯'], [0.78 * D, '당황']], lt), look: [-0.7, -0.2], tilt: stuck ? -6 : 4 });
    h += PA(t, lt, D, 0.22, ox, 300, label(0, 0, '정치가', { size: 44, bg: '#fff' }), {});
    h += THK(t, lt, D, 0.36, 0.62, 1560, 440, 360, 110, '난 지혜롭지!', { size: 40, right: 1 });
    h += SPK(t, lt, D, 0.55, null, 760, 330, 470, 110, '그게 정확히 뭔가요?', shx + 60, shy - 60, { size: 42 });
    h += SPK(t, lt, D, 0.8, null, 1560, 440, 360, 110, '어… 그러니까…', ohx + 60, ohy - 120, { size: 40 });
    return h;
  }
  if (n === 1) {
    const stuck = at(lt, 0.72, D);
    h += POET({ t, seed: 2402, x: ox, y: oy, s: os, pose: '들기', ex: exprAt([[0, '뿌듯'], [0.72 * D, '당황']], lt), look: [-0.7, -0.2] });
    const [hx, hy] = handG(ox, oy, os, P['들기'].hR); h += `<g transform="translate(${f1(hx + 50)} ${f1(hy - 40)}) rotate(-8)"><rect x="-90" y="-60" width="180" height="120" rx="6" fill="#F4E9D0" stroke="${INK}" stroke-width="6"/>${[0, 1, 2, 3].map(i => `<path d="M-70 ${-34 + i * 24} q30 -8 60 0 t70 0" fill="none" stroke="#9A8A6A" stroke-width="5"/>`).join('')}</g>` + hand(hx, hy, os);
    h += lyreG(ox - 150, oy - 120, 0.7);
    h += PA(t, lt, D, 0.06, ox, 300, label(0, 0, '시인', { size: 44, bg: '#fff' }), {});
    h += PA(t, lt, D, 0.16, ox + 250, 470, label(0, 0, '멋진 시 ✓', { size: 36, bg: MINT }), { rot: 4 });
    h += SPK(t, lt, D, 0.4, null, 760, 330, 520, 110, '이 구절은 무슨 뜻이죠?', shx + 60, shy - 60, { size: 42 });
    h += SPK(t, lt, D, 0.74, null, 1020, 200, 440, 110, '그건… 영감이 와서…', ohx - 40, ohy - 110, { size: 40 });
    return h;
  }
  // artisan: knows his craft… and thinks he knows everything
  h += potWheel(ox + 70, oy, 0.9, t);
  const boast = at(lt, 0.5, D);
  h += SMITH({ t, seed: 2403, x: ox - 120, y: oy, s: os, pose: boast ? '만세' : '설명', ex: exprAt([[0, '뿌듯'], [0.5 * D, '신남']], lt), look: [-0.6, -0.2] });
  h += `<path d="M${ox - 120 - 60 * os} ${oy - 250 * os} L${ox - 120 + 60 * os} ${oy - 250 * os} L${ox - 120 + 70 * os} ${oy - 120 * os} L${ox - 120 - 70 * os} ${oy - 120 * os} Z" fill="#8A6A44" stroke="${INK}" stroke-width="5"/>`;
  h += PA(t, lt, D, 0.05, ox - 120, 300, label(0, 0, '장인', { size: 44, bg: '#fff' }), {});
  h += PA(t, lt, D, 0.18, 1560, 420, label(0, 0, '자기 일은 정말 잘 앎', { size: 34, bg: MINT }), {}) + PA(t, lt, D, 0.2, 1780, 420, check(0, 0, 0.7), {});
  h += SPK(t, lt, D, 0.5, null, 800, 250, 560, 110, '나랏일도 제가 다 알죠!', ohx - 120 + 10, ohy - 120, { size: 42 });
  h += PA(t, lt, D, 0.74, 1560, 540, label(0, 0, '다른 일까지 안다는 착각', { size: 34, bg: '#FFD6D6' }), {}) + PA(t, lt, D, 0.76, 1820, 540, xMark(0, 0, 0.3), {});
  return h;
}

/* ---------- the conclusion + the famous misquote ---------- */
function qknowScene(t, lt, a) {
  const D = D_(a), n = a.k || 0;
  if (n === 0) {
    let h = BG('#EDE3D0') + BG('url(#paper)');
    h += PA(t, lt, D, 0.02, 960, 110, label(0, 0, '소크라테스의 결론', { size: 44, bg: YEL }), {});
    h += panel(140, 190, 780, 600, { fill: '#fff' }) + panel(1000, 190, 780, 600, { fill: '#fff' });
    h += POL({ t, seed: 2500, x: 300, y: 720, s: 0.42, ex: exprAt([[0, '뿌듯']], t), look: [0.6, -0.2] }) + SOC({ t, seed: 2501, x: 1160, y: 720, s: 0.42, ex: exprAt([[0, '미소']], t), look: [0.6, -0.2] });
    h += T8(300, 290, '저 사람', { size: 40 }) + T8(1160, 290, '나', { size: 40 });
    const row = (x, y, txt, ok, f) => PA(t, lt, D, f, x, y, T8(0, 16, txt, { anchor: 'start', size: 42 }) + (ok ? check(-46, 0, 0.6) : xMark(-46, 0, 0.26)), { noPop: true, inDur: 0.25 });
    h += row(480, 430, '모른다', true, 0.14) + row(480, 540, '안다고 생각한다', true, 0.3);
    h += row(1340, 430, '모른다', true, 0.55) + row(1340, 540, '안다고 생각하지', true, 0.7) + PA(t, lt, D, 0.7, 1340, 600, T8(0, 16, '않는다', { anchor: 'start', size: 42 }), { noPop: true });
    h += PA(t, lt, D, 0.42, 560, 700, label(0, 0, '착각', { size: 40, bg: '#FFD6D6' }), { rot: -4 });
    h += PA(t, lt, D, 0.86, 1420, 700, label(0, 0, '착각 없음', { size: 40, bg: MINT }), { rot: 3 });
    return h;
  }
  if (n === 1) {
    let h = BG('#EDE3D0') + BG('url(#paper)');
    const tilt = lerp(0, 7, easeOutBack(prog(lt, 0.25 * D, 0.6 * D)));
    h += `<g transform="translate(960 300)"><rect x="-14" y="0" width="28" height="460" fill="#C9A04A" stroke="${INK}" stroke-width="6"/><path d="M-120 470 L120 470 L80 430 L-80 430 Z" fill="#C9A04A" stroke="${INK}" stroke-width="6"/><circle r="22" fill="#C9A04A" stroke="${INK}" stroke-width="6"/>`;
    h += `<g transform="rotate(${f1(tilt)})"><rect x="-470" y="-10" width="940" height="20" rx="8" fill="#C9A04A" stroke="${INK}" stroke-width="6"/>`;
    for (const sd of [-1, 1]) {
      const px = sd * 440;
      h += `<g transform="translate(${px} 0) rotate(${f1(-tilt)})"><line x1="-80" y1="0" x2="-110" y2="200" stroke="${INK}" stroke-width="4"/><line x1="80" y1="0" x2="110" y2="200" stroke="${INK}" stroke-width="4"/><path d="M-140 200 L140 200 Q120 250 0 254 Q-120 250 -140 200 Z" fill="#E8C27A" stroke="${INK}" stroke-width="6"/>`;
      h += sd < 0 ? POL({ t, seed: 2502, x: 0, y: 200, s: 0.3, ex: exprAt([[0, '뿌듯']], t), look: [0.5, 0] }) : SOC({ t, seed: 2503, x: 0, y: 200, s: 0.3, ex: exprAt([[0, '미소']], t), look: [-0.5, 0] });
      h += `</g>`;
    }
    h += `</g></g>`;
    h += PA(t, lt, D, 0.08, 520, 210, label(0, 0, '안다는 착각', { size: 38, bg: '#FFD6D6' }), {}) + PA(t, lt, D, 0.12, 1400, 210, label(0, 0, '모르는 걸 앎', { size: 38, bg: MINT }), {});
    h += PA(t, lt, D, 0.55, 960, 860, big(0, 0, [[['그만큼 ', '#fff'], ['조금 더', YEL], [' 지혜롭다', '#fff']]], { size: 66 }), {});
    return h;
  }
  if (n === 2) {
    let h = BG(NAVY) + BG('url(#grid)');
    h += PA(t, lt, D, 0.04, 960, 120, label(0, 0, '우리가 흔히 아는 말', { size: 40, bg: '#fff' }), {});
    h += PA(t, lt, D, 0.08, 960, 300, `<rect x="-720" y="-110" width="1440" height="220" rx="30" fill="#1B2A44" stroke="${MINT}" stroke-width="5"/>` + big(0, 26, ['“나는 아무것도 모른다는 것을 안다”'], { size: 66, sw: 13 }), {});
    h += PA(t, lt, D, 0.4, 1340, 230, `<g transform="rotate(-10)"><rect x="-230" y="-48" width="460" height="96" rx="12" fill="#fff" fill-opacity=".9" stroke="${RED}" stroke-width="8"/>${T8(0, 16, '플라톤 책에 그대로는 없음', { size: 36, fill: RED })}</g>`, {});
    if (at(lt, 0.62, D)) { const k = easeOut(prog(lt, 0.62 * D, 0.72 * D)); h += `<path d="M960 430 L960 ${f1(430 + 120 * k)}" stroke="${YEL}" stroke-width="14" stroke-linecap="round"/><path d="M930 ${f1(520 + 30 * k)} L960 ${f1(560 + 30 * k)} L990 ${f1(520 + 30 * k)}" fill="none" stroke="${YEL}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`; }
    h += PA(t, lt, D, 0.7, 960, 700, `<rect x="-640" y="-90" width="1280" height="180" rx="30" fill="${MINT}" stroke="${INK}" stroke-width="6"/>` + T8(0, -14, '원래 결론: 모르는 걸 안다고', { size: 52 }) + T8(0, 54, '생각하지 않는다', { size: 52 }), {});
    h += PA(t, lt, D, 0.76, 1500, 820, label(0, 0, '『소크라테스의 변명』 21d', { size: 30, bg: '#fff' }), {});
    return h;
  }
  // n3: drop the know-it-all mask, start asking
  let h = athensBg(t, { olive: false });
  const zx = 1080, zy = 940, zs = 0.8, off = easeInOut(prog(lt, 0.45 * D, 0.62 * D)), [hx, hy] = hd(zx, zy, zs);
  const ask = lt > 0.62 * D;
  h += SOC({ t, seed: 2504, x: 520, y: 940, s: 0.72, pose: ask ? '설명' : '서기', ex: exprAt([[0, '미소']], t), look: [0.8, -0.1] });
  h += Z({ t, seed: 2505, x: zx, y: zy, s: zs, pose: ask ? '손인사' : '서기', ex: exprAt([[0, '결심'], [0.62 * D, '신남']], lt), look: [-0.3, -0.2] });
  // the mask: a fake grin labelled '아는 척'
  const mx = hx + off * 300, my = hy + off * 290, mr = off * 70;
  h += `<g transform="translate(${f1(mx)} ${f1(my)}) rotate(${f1(mr)})"><ellipse rx="${f1(112 * zs)}" ry="${f1(104 * zs)}" fill="#F4E9D0" stroke="${INK}" stroke-width="7"/><path d="M-40 -18 q14 -14 28 0 M12 -18 q14 -14 28 0" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-46 22 Q0 70 46 22 Z" fill="${INK}"/>${T8(0, -46, '아는 척', { size: 26, fill: RED })}</g>`;
  if (ask) { h += heldSign(zx, zy, zs, '손인사', 0.62, 6); }
  h += PA(t, lt, D, 0.08, 960, 100, big(0, 0, [[['모름 자랑', '#fff'], [' ✗', RED]]], { size: 60 }), { f2: 0.42 });
  h += PA(t, lt, D, 0.66, 960, 100, big(0, 0, [[['아는 척 멈추고, ', '#fff'], ['묻기 시작', YEL]]], { size: 66 }), {});
  return h;
}

/* ---------- title + chapter + lessons ---------- */
const LIST11 = ['모른다고 말하기', "'어떻게?'라고 묻기", '답 대신 질문으로 돕기'];
titleScene = function (t, lt, a) {
  let h = BG('url(#labG)') + BG('url(#grid)');
  h += particles(t, 5, 40, [0, 0, 1920, 1080], MINT, { speed: 40, r: 4, op: 0.6 });
  if (a.list) {
    h += big(960, 130, ['만약에, 소크라테스처럼 질문하며 산다면?'], { size: 54, sw: 12, fill: YEL });
    LIST11.forEach((it, i) => {
      const at0 = 0.15 * (a._dur || 8) + i * 0.6; if (lt < at0) return;
      const k = easeOutBack(clamp((lt - at0) / 0.4, 0, 1)), y = 320 + i * 160;
      h += `<g opacity="${f1(clamp(k, 0, 1) * 100) / 100}" transform="translate(${f1(lerp(-120, 0, clamp(k, 0, 1)))} 0)">${label(330, y, (i + 1) + '일 차', { size: 44, bg: i === 2 ? YEL : MINT })}${T8(460, y + 20, it, { anchor: 'start', size: 62, fill: '#fff' })}</g>`;
    });
    h += `<ellipse cx="1640" cy="900" rx="220" ry="50" fill="url(#glow)"/>`;
    h += Z({ t, seed: 7, x: 1640, y: 900, s: 0.62, pose: '들기', ex: exprAt([[0, '신남']], lt), look: [-0.6, -0.2] }) + heldSign(1640, 900, 0.62, '들기', 0.5, 10);
    return h;
  }
  h += `<ellipse cx="960" cy="900" rx="320" ry="70" fill="url(#glow)"/><ellipse cx="960" cy="900" rx="260" ry="54" fill="#2E4260" stroke="${INK}" stroke-width="8"/>`;
  h += doctor(520, 960, 0.55, { t, expr: '미소', talk: env(t) });
  h += pop(t, t - lt + 0.2, t + 99, 960, 230, big(0, 0, [[['만약에, ', YEL], ['소크라테스처럼', '#fff']], '질문하며 산다면?'], { size: 88, sw: 18 }), {});
  const up = 1.3, rise = easeOutBack(prog(lt, up, up + 0.5));
  h += Z({ t, seed: 7, x: 960, y: 890, s: 0.6, pose: lt > up ? '손인사' : '서기', ex: exprAt([[0, '결심'], [up + 0.2, '신남']], lt) });
  if (lt > up) { const [hx, hy] = handG(960, 890, 0.6, P['손인사'].hR); h += qSign(hx, hy - 70 - 30 * rise, 0.55 * rise, 8) + hand(hx, hy, 0.6); }
  h += SOC({ t, seed: 8, x: 1400, y: 960, s: 0.55, pose: lt > up + 0.4 ? '손인사' : '서기', ex: exprAt([[0, '미소']], t), look: [-0.6, -0.1] });
  if (lt > up + 0.6) h += pop(t, t - lt + up + 0.6, t + 99, 1500, 560, label(0, 0, '질문 실험 3일', { size: 40, bg: YEL }), { rot: 4, bob: 4 });
  return h;
};
function qLamp(x, y, k, t, txt) {
  const on = clamp(k, 0, 1);
  let h = `<g transform="translate(${f1(x)} ${f1(y)})">`;
  if (on > 0) h += `<circle r="${f1(90 + 10 * Math.sin(t * 3))}" fill="url(#warm)" opacity="${f1(on * 100) / 100}"/>`;
  h += `<circle r="52" fill="${on > 0.5 ? YEL : '#33465F'}" stroke="${INK}" stroke-width="6"/>` + T8(0, 24, '?', { size: 66, fill: on > 0.5 ? NAVY : '#5A6E8A' });
  h += T8(0, 100, txt, { size: 28, fill: on > 0.5 ? MINT : '#5A6E8A' });
  return h + `</g>`;
}
const LESSON11 = {
  1: [['모른다고 말하는 순간,'], [['배움', YEL], ['이 시작된다', '#fff']]],
  2: [["'왜 내가 맞아?' 대신"], [["'그게 어떻게 되는 건데?'", YEL]], ['싸움이 대화가 된다']],
  3: [['답을 주는 사람보다'], [['질문을 건네는 사람', YEL], ['이', '#fff']], ['오래 남는다']]
};
function qlessonScene(t, lt, a) {
  const D = D_(a);
  let h = BG(NAVY) + BG('url(#grid)') + `<ellipse cx="960" cy="420" rx="700" ry="300" fill="url(#warm)" opacity=".18"/>`;
  h += `<rect x="-600" y="860" width="3120" height="600" fill="#132238"/><line x1="-600" y1="860" x2="2520" y2="860" stroke="${MINT}" stroke-opacity=".3" stroke-width="4"/>`;
  h += pop(t, t - lt + 0.05, t + 99, 960, 120, label(0, 0, a.n + '일 차 깨달음', { size: 40, bg: MINT }), {});
  const L = LESSON11[a.n].map(x => Array.isArray(x[0]) ? x : x[0]);
  h += pop(t, t - lt + 0.15, t + 99, 960, L.length > 2 ? 280 : 320, big(0, 0, L, { size: L.length > 2 ? 76 : 84, sw: 16, lh: L.length > 2 ? 100 : 110 }), {});
  for (let i = 1; i <= 3; i++) h += qLamp(700 + (i - 1) * 260, 760, i < a.n ? 1 : (i === a.n ? prog(lt, 0.3 * D, 0.6 * D) : 0), t, i + '일 차');
  h += Z({ t, seed: 1402, x: 1600, y: 900, s: 0.6, pose: lt > 0.65 * D ? '만세' : '서기', ex: exprAt([[0, '결심'], [0.65 * D, '뿌듯']], lt), look: [-0.8, 0.2] });
  return h;
}

/* ---------- day 1: "what exactly does that mean?" ---------- */
function boardDay1(lt, D, k) {
  let h = T8(340, 186, '이번 프로젝트', { size: 40 }) + `<line x1="190" y1="200" x2="490" y2="200" stroke="${INK}" stroke-width="4"/>`;
  if (k < 3) return h + marker(340, 300, 'KPI 얼라인', RED, 66, -3) + marker(340, 400, '→ 다음 주까지', '#2F6FD6', 40, 0);
  const n1 = '핵심 성과 지표', n2 = '방향 맞추기', p = prog(lt, 0.12 * D, 0.5 * D);
  h += marker(170, 290, 'KPI', RED, 54, 0) + T8(240, 290, '= ' + n1.slice(0, Math.floor(p * 2 * n1.length)), { anchor: 'start', size: 40, fill: '#2F6FD6' });
  h += marker(190, 400, '얼라인', RED, 50, 0) + T8(280, 400, '= ' + n2.slice(0, Math.floor(clamp(p * 2 - 1, 0, 1) * n2.length)), { anchor: 'start', size: 40, fill: '#2F6FD6' });
  return h;
}
function qday1Scene(t, lt, a) {
  const D = D_(a), k = a.k || 0;
  let h = officeBg(t, boardDay1(lt, D, k));
  const bx = 700, by = 930, bs = 0.78, [bhx, bhy] = hd(bx, by, bs), [zx, zy] = hd(SX[1], SEATY, SEATS);
  if (k === 0) {
    h += BOSS({ t, seed: 2600, x: bx, y: by, s: bs, pose: '가리키기', ex: exprAt([[0, '뿌듯']], t), look: [0.7, -0.1] });
    h += team(t, { nod: [0, at(lt, 0.78, D) && lt < 0.9 * D, 0], ex: ['기본', exprAt([[0, '기본'], [0.5 * D, '걱정']], lt), '기본'], zsweat: at(lt, 0.5, D) });
    h += meetTable(t);
    h += PA(t, lt, D, 0.04, 960, 70, label(0, 0, '다음 날 회의', { size: 36, bg: '#fff' }), {});
    h += SPK(t, lt, D, 0.5, null, 1080, 270, 600, 120, '이번 건, KPI 얼라인부터 하죠.', bhx + 70, bhy - 80, { size: 40 });
    h += PA(t, lt, D, 0.62, zx + 110, zy - 110, T8(0, 0, '?', { size: 80, fill: YEL, stroke: INK, sw: 9 }), { bob: 4 });
    return h;
  }
  if (k === 1) {
    const up = at(lt, 0.08, D);
    h += BOSS({ t, seed: 2600, x: bx, y: by, s: bs, ex: exprAt([[0, '뿌듯'], [0.15 * D, '놀람']], lt), look: [0.9, -0.1] });
    const rise = 70 * easeOutBack(prog(lt, 0.06 * D, 0.16 * D));
    h += team(t, { zrise: rise, zpose: up ? '손인사' : '서기', ex: [exprAt([[0, '기본'], [0.2 * D, '놀람']], lt), exprAt([[0, '걱정'], [0.08 * D, '결심']], lt), exprAt([[0, '기본'], [0.2 * D, '놀람']], lt)], looks: [[0.8, 0], [-0.6, -0.1], [-0.8, 0]] });
    h += meetTable(t);
    if (up) { const kk = prog(lt, 0.08 * D, 0.2 * D), hy0 = zy - rise - 150; for (let i = 0; i < 6; i++) { const an = -Math.PI / 2 + (i - 2.5) * 0.32; h += `<line x1="${f1(SX[1] + 76 + Math.cos(an) * 90)}" y1="${f1(hy0 + Math.sin(an) * 90)}" x2="${f1(SX[1] + 76 + Math.cos(an) * (90 + 50 * kk))}" y2="${f1(hy0 + Math.sin(an) * (90 + 50 * kk))}" stroke="${YEL}" stroke-width="8" stroke-linecap="round" opacity="${f1((1 - prog(lt, 0.25 * D, 0.4 * D)) * 100) / 100}"/>`; } }
    h += SPK(t, lt, D, 0.3, null, 960, 230, 620, 156, ['죄송한데,', '그게 정확히 무슨 뜻이에요?'], zx - 70, zy - 70 - 110, { size: 44 });
    return h;
  }
  if (k === 2) {
    h += BOSS({ t, seed: 2600, x: bx, y: by, s: bs, ex: exprAt([[0, '놀람'], [0.6 * D, '미소']], lt), look: [0.9, -0.1] });
    const relief = at(lt, 0.42, D);
    h += team(t, { zpose: '서기', ex: [exprAt([[0, '걱정'], [0.42 * D, '신남']], lt), exprAt([[0, '걱정'], [0.7 * D, '뿌듯']], lt), exprAt([[0, '걱정'], [0.5 * D, '신남']], lt)], looks: relief ? [[0.8, 0], [0, 0], [-0.8, 0]] : [[0, 0.4], [0, 0.4], [0, 0.4]] });
    h += meetTable(t);
    if (lt < 0.42 * D) h += PA(t, lt, D, 0.02, 1300, 260, big(0, 0, ['……'], { size: 96, sw: 14 }), { f2: 0.42 });
    h += PA(t, lt, D, 0.02, 1150, 180, wallClock(0, 0, 54, 10, 10 + Math.floor(lt * 2)), { f2: 0.42 });
    h += SPK(t, lt, D, 0.45, null, 880, 330, 360, 104, '사실 저도…', SX[0] - 30, hd(SX[0], SEATY, SEATS)[1] - 110, { size: 40 });
    h += SPK(t, lt, D, 0.56, null, 1720, 300, 300, 104, '저도요…', SX[2] + 40, hd(SX[2], SEATY, SEATS)[1] - 110, { size: 40 });
    return h;
  }
  h += BOSS({ t, seed: 2600, x: bx - 80, y: by, s: bs, pose: Math.sin(t * 2.2) > 0 ? '가리키기' : '설명', ex: exprAt([[0, '미소']], t), look: [0.6, -0.1] });
  h += team(t, { ex: ['신남', '뿌듯', '신남'], looks: [[-0.7, 0], [-0.7, 0], [-0.8, 0]] });
  h += meetTable(t);
  const spin = prog(lt, 0.45 * D, 0.75 * D);
  h += PA(t, lt, D, 0.42, 1150, 190, wallClock(0, 0, 60, 10, 20 + spin * 20), {});
  h += PA(t, lt, D, 0.66, 1150, 330, label(0, 0, '회의, 오히려 더 빨리 끝!', { size: 38, bg: MINT }), { rot: -2 });
  return h;
}

/* ---------- study 1: asking for advice looks competent ---------- */
function meterH(x, y, w, k, c, lab) { return T8(x, y - 18, lab, { anchor: 'start', size: 32 }) + `<rect x="${x}" y="${y}" width="${w}" height="44" rx="22" fill="#E6E0D4" stroke="${INK}" stroke-width="5"/>` + (k > 0.01 ? `<rect x="${x}" y="${y}" width="${f1(Math.max(44, w * k))}" height="44" rx="22" fill="${c}" stroke="${INK}" stroke-width="5"/>` : ''); }
function qadviceScene(t, lt, a) {
  const D = D_(a);
  let h = BG('#EDE3D0') + BG('url(#paper)');
  if (!a.k) {
    h += PA(t, lt, D, 0.02, 1060, 120, big(0, 0, [[['질문하면 ', '#fff'], ['바보처럼', YEL], [' 보일까?', '#fff']]], { size: 66 }), {});
    if (at(lt, 0.3, D)) {
      h += panel(160, 230, 760, 560, { fill: '#fff' }) + panel(1000, 230, 760, 560, { fill: '#fff' });
      h += T8(540, 300, '조언을 구한 파트너', { size: 42 }) + T8(1380, 300, '조언을 안 구한 파트너', { size: 42 });
      h += PT({ t, seed: 2700, x: 400, y: 640, s: 0.46, pose: '손인사', ex: exprAt([[0, '미소']], t), look: [0.6, -0.2] }) + SPK(t, lt, D, 0.36, null, 640, 420, 380, 96, '어떻게 하면 좋을까요?', 470, 470, { size: 30 });
      h += COW(1, { t, seed: 2701, x: 1240, y: 640, s: 0.46, pose: '책상', ex: exprAt([[0, '기본']], t), look: [0.3, 0.6] }) + `<rect x="1300" y="560" width="160" height="20" rx="4" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
      const k = easeOut(prog(lt, 0.55 * D, 0.85 * D));
      h += meterH(250, 700, 580, 0.82 * k, MINT, '유능해 보임') + meterH(1090, 700, 580, 0.56 * k, '#C3CDD8', '유능해 보임');
      h += PA(t, lt, D, 0.86, 840, 640, `<path d="M0 30 L0 -30 M-18 -12 L0 -30 L18 -12" fill="none" stroke="#1F9D6B" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`, {});
    }
    h += T8(960, 850, 'Brooks, Gino & Schweitzer · Management Science (2015)', { size: 28, fill: '#6B6255', w: 500 });
    return h;
  }
  h += PA(t, lt, D, 0.02, 960, 120, big(0, 0, [[['단, ', '#fff'], ['이럴 때', YEL], ['만', '#fff']]], { size: 66 }), {});
  const card = (x, y, ok, txt, icon, f) => PA(t, lt, D, f, x, y, `<rect x="-370" y="-90" width="740" height="180" rx="28" fill="${ok ? '#E1F8EE' : '#F2EEE6'}" stroke="${INK}" stroke-width="6"/>${icon}${T8(-170, 15, txt, { anchor: 'start', size: 40, fill: ok ? NAVY : '#8A8276' })}${ok ? check(310, 0, 0.9) : xMark(310, 0, 0.32)}`, {});
  const hard = `<g transform="translate(-260 0)"><rect x="-56" y="-56" width="112" height="112" rx="14" fill="#fff" stroke="${INK}" stroke-width="5"/>${T8(0, 18, '∑?', { size: 50 })}</g>`;
  const easy = `<g transform="translate(-260 0)"><rect x="-56" y="-56" width="112" height="112" rx="14" fill="#fff" stroke="${INK}" stroke-width="5"/>${T8(0, 18, '1+1', { size: 44, fill: '#8A8276' })}</g>`;
  const pro = `<g transform="translate(-260 50)">${COW(2, { t, seed: 2702, x: 0, y: 0, s: 0.26, ex: exprAt([[0, '뿌듯']], t) })}</g>`;
  const non = `<g transform="translate(-260 50)" opacity=".6">${COW(3, { t, seed: 2703, x: 0, y: 0, s: 0.26, ex: exprAt([[0, '당황']], t) })}</g>`;
  h += card(560, 330, true, '문제가 어려울 때', hard, 0.12) + card(560, 560, true, '그 일을 아는 사람에게', pro, 0.45);
  h += card(1380, 330, false, '쉬운 문제', easy, 0.72) + card(1380, 560, false, '모르는 사람에게', non, 0.8);
  h += PA(t, lt, D, 0.06, 560, 200, label(0, 0, '더 유능해 보임', { size: 34, bg: MINT }), {}) + PA(t, lt, D, 0.7, 1380, 200, label(0, 0, '효과 없음', { size: 34, bg: '#fff' }), {});
  h += T8(960, 820, '어려운 문제를 푼 사람에게, 파트너가 조언을 구한 실험', { size: 32, fill: '#6B6255' });
  return h;
}

/* ---------- day 2: Euthyphro ---------- */
function courtBg(t) {
  let h = skyDefs('qSkyC', '#9CCBEA', '#FFF4E0') + BG('url(#qSkyC)') + clouds(t, 50, 12, 3, 41);
  h += `<path d="M-600 560 Q300 500 960 530 Q1600 500 2520 560 L2520 1480 L-600 1480 Z" fill="#C7D3AE" stroke="${INK}" stroke-width="5"/>`;
  h += templeG(960, 790, 1, { n: 10, w: 1500, ch: 300, cw: 56, frieze: 'ΒΑΣΙΛΕΙΟΣ ΣΤΟΑ', inner: '#6E6050', ped: false, fs: 38 });
  h += `<path d="M156 364 L1764 364 L1700 300 L220 300 Z" fill="#B5523A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  h += `<rect x="-600" y="790" width="3120" height="700" fill="#E7D8B6"/><line x1="-600" y1="790" x2="2520" y2="790" stroke="${INK}" stroke-width="6"/>`;
  for (let j = 1; j < 4; j++) h += `<line x1="-600" y1="${790 + j * 60}" x2="2520" y2="${790 + j * 60}" stroke="#CDBB94" stroke-width="4"/>`;
  return h;
}
function godsCloud(x, y, s, t) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><ellipse cx="0" cy="40" rx="280" ry="80" fill="#fff" stroke="${INK}" stroke-width="6"/><ellipse cx="-150" cy="10" rx="110" ry="70" fill="#fff" stroke="${INK}" stroke-width="6"/><ellipse cx="150" cy="10" rx="110" ry="70" fill="#fff" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="44" rx="270" ry="70" fill="#fff"/>`;
  const g1 = char({ t, seed: 2801, x: -120, y: 60, s: 0.32, goggles: 'none', vest: '#F4F1EA', patch: false, tee: true, beard: '#DDDDDD', hair: '#DDDDDD', wreath: true, toga: '#C9A04A', pose: Math.sin(t * 6) > 0 ? '가리키기' : '설명', ex: exprAt([[0, '화남']], t), look: [0.8, 0] });
  const g2 = char({ t, seed: 2802, x: 120, y: 60, s: 0.32, goggles: 'none', vest: '#F4F1EA', patch: false, tee: true, longHair: '#6B3E26', hair: '#6B3E26', wreath: true, toga: '#7A3E8E', pose: '팔짱', ex: exprAt([[0, '화남']], t), look: [-0.8, 0] });
  h += g1 + g2;
  const k = (t * 3) % 1;
  h += `<path d="M-30 -110 L0 -70 L-16 -64 L18 -20" fill="none" stroke="${YEL}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity="${r3(0.5 + 0.5 * Math.sin(k * Math.PI * 2))}"/>`;
  return h + `</g>`;
}
function qeuthyScene(t, lt, a) {
  const D = D_(a), k = a.k || 0;
  let h = courtBg(t);
  const sx = 560, ex0 = 1360, y = 940, s = 0.76;
  const [shx, shy] = hd(sx, y, s), [ehx, ehy] = hd(ex0, y, s);
  if (!k) h += PA(t, lt, D, 0.02, 300, 250, label(0, 0, '아테네 법정 앞', { size: 36, bg: '#fff' }), {});
  if (k === 0) {
    const walk = prog(lt, 0, 0.4 * D), x = lerp(2150, ex0, easeOut(walk));
    h += SOC({ t, seed: 2800, x: sx, y, s, ex: exprAt([[0, '미소']], t), look: [0.8, -0.1] });
    if (walk < 1) h += flip(x, EUTH({ t, seed: 2810, x, y, s, pose: walkPose(t * 7, 0.7), ex: exprAt([[0, '결심']], t), look: [0.8, -0.1] }));
    else { h += EUTH({ t, seed: 2810, x, y, s, ex: exprAt([[0, '결심']], t), look: [-0.8, -0.1] }); const [hx, hy] = handG(x, y, s, P['서기'].hR); h += scrollRoll(hx + 10, hy - 6, 0.55, 70); }
    h += PA(t, lt, D, 0.36, ex0, 400, label(0, 0, '젊은이 에우티프론', { size: 42, bg: '#9DB8D9' }), {});
    h += PA(t, lt, D, 0.6, ex0, 490, label(0, 0, '아버지를 고발하러 가는 길', { size: 32, bg: '#fff' }), {});
    return h;
  }
  if (k === 1) {
    h += SOC({ t, seed: 2800, x: sx, y, s, ex: exprAt([[0, '미소']], t), look: [0.8, -0.1] });
    h += EUTH({ t, seed: 2810, x: ex0, y, s, pose: '팔짱', ex: exprAt([[0, '뿌듯']], t), look: [-0.6, -0.3], tilt: -6 });
    h += SPK(t, lt, D, 0.22, null, 1250, 300, 620, 156, ['저는 경건함이 뭔지,', '확실히 압니다!'], ehx - 20, ehy - 120, { size: 46 });
    if (at(lt, 0.4, D)) h += sparkle(ehx + 150, ehy - 60, 0.9, t) + sparkle(ehx - 150, ehy - 20, 0.7, t + 1);
    h += PA(t, lt, D, 0.08, 1640, 560, label(0, 0, '자신만만', { size: 40, bg: YEL }), { rot: -3 });
    return h;
  }
  if (k === 2) {
    const turn = lt < 0.3 * D ? 0 : (lt < 0.56 * D ? 1 : 2);
    h += SOC({ t, seed: 2800, x: sx, y, s, pose: turn !== 1 ? '설명' : '서기', ex: exprAt([[0, '미소']], t), look: [0.8, -0.1] });
    h += EUTH({ t, seed: 2810, x: ex0, y, s, pose: turn === 1 ? '가리키기' : '서기', ex: exprAt([[0, '뿌듯'], [0.6 * D, '당황']], lt), look: [-0.8, -0.1] });
    h += SPK(t, lt, D, 0.02, 0.56, 640, 300, 540, 110, '그럼 경건함이란 뭔가?', shx + 60, shy - 120, { size: 44 });
    h += SPK(t, lt, D, 0.3, 0.92, 1280, 420, 520, 110, '지금 제가 하는 일이요!', ehx - 30, ehy - 120, { size: 42 });
    h += SPK(t, lt, D, 0.58, null, 660, 240, 600, 156, ['그건 예시일 뿐.', '경건함 자체는 뭔가?'], shx + 60, shy - 120, { size: 44 });
    // a little "?" ball bouncing between them
    const bk = (lt / D * 3) % 1, side = Math.floor(lt / D * 3) % 2, bxp = side ? lerp(ehx - 120, shx + 120, bk) : lerp(shx + 120, ehx - 120, bk);
    h += T8(bxp, shy - 40 - Math.sin(bk * Math.PI) * 120, '?', { size: 60, fill: YEL, stroke: INK, sw: 8 });
    return h;
  }
  if (k === 3) {
    h += SOC({ t, seed: 2800, x: sx, y, s, pose: at(lt, 0.42, D) ? '설명' : '서기', ex: exprAt([[0, '미소']], t), look: [0.8, -0.1] });
    h += EUTH({ t, seed: 2810, x: ex0, y, s, pose: lt < 0.4 * D ? '손인사' : '서기', ex: exprAt([[0, '뿌듯'], [0.6 * D, '당황']], lt), look: [-0.8, -0.1] });
    h += SPK(t, lt, D, 0.02, 0.45, 1280, 420, 540, 110, '신들이 좋아하는 일이요!', ehx - 30, ehy - 120, { size: 42 });
    h += PA(t, lt, D, 0.3, 960, 180, godsCloud(0, 0, 1.15, t), {});
    h += SPK(t, lt, D, 0.45, null, 660, 380, 560, 156, ['그런데 신들끼리', '다투면?'], shx + 60, shy - 120, { size: 44 });
    h += PA(t, lt, D, 0.72, 1360, 400, `<rect x="-250" y="-60" width="500" height="120" rx="20" fill="#fff" stroke="${INK}" stroke-width="6"/>` + T8(-110, 18, '경건', { size: 46, fill: '#1F9D6B' }) + T8(0, 18, '=', { size: 46 }) + T8(110, 18, '불경?', { size: 46, fill: RED }), {});
    return h;
  }
  // k4: round and round… "another time, Socrates!"
  const run = prog(lt, 0.5 * D, 0.85 * D), rx = lerp(ex0, 2200, easeIn(run));
  h += SOC({ t, seed: 2800, x: sx, y, s, pose: run > 0.5 ? '어깨' : '서기', ex: exprAt([[0, '미소'], [0.7 * D, '놀람']], lt), look: [0.8, -0.1] });
  h += EUTH({ t, seed: 2810, x: rx, y, s, pose: run > 0 ? walkPose(t * 14, 1.2) : '서기', ex: exprAt([[0, '당황']], t), look: [run > 0 ? 0.9 : -0.8, -0.1], sweat: true });
  if (run > 0 && run < 1) h += motionLines(rx - 120, 760, 1, 4, 90, t);
  if (lt < 0.55 * D) {
    const ang = t * 120;
    h += `<g transform="translate(960 300)"><g transform="rotate(${f1(ang)})"><circle r="170" fill="none" stroke="${YEL}" stroke-width="14" stroke-dasharray="210 60"/>${[0, 1, 2].map(i => `<path d="M${f1(Math.cos(i * 2.094 + 0.5) * 170)} ${f1(Math.sin(i * 2.094 + 0.5) * 170)} l-26 -14 l4 30 Z" fill="${YEL}" stroke="${INK}" stroke-width="4" transform="rotate(${f1(i * 120 + 120)} ${f1(Math.cos(i * 2.094 + 0.5) * 170)} ${f1(Math.sin(i * 2.094 + 0.5) * 170)})"/>`).join('')}</g>${T8(0, 22, '빙빙', { size: 60, fill: '#fff', stroke: INK, sw: 9 })}</g>`;
    h += PA(t, lt, D, 0.05, 640, 200, label(0, 0, '내가 하는 일', { size: 32, bg: '#fff' }), { f2: 0.55 }) + PA(t, lt, D, 0.12, 1290, 200, label(0, 0, '신들이 좋아하는 것', { size: 32, bg: '#fff' }), { f2: 0.55 }) + PA(t, lt, D, 0.2, 960, 520, label(0, 0, '처음으로…', { size: 32, bg: '#fff' }), { f2: 0.55 });
  }
  h += SPK(t, lt, D, 0.56, null, 1380, 300, 560, 156, ['다음에 하시죠!', '지금은 바빠서요!'], Math.min(rx, 1900), ehy - 100, { size: 44 });
  return h;
}

/* ---------- day 2: Zero asks "how?" in the group chat ---------- */
const ASK = [[-1, 'L', 'AI가 일자리 절반 없앤다니까!', 'hot', 0.55], [-1, 'R', '아니라니까!!', 'hot', 0.55], [-1, 'L', '넌 뭘 아는데?', 'hot', 0.55]];
function heatMeter(x, y, k, t) { const c = k > 0.6 ? RED : (k > 0.3 ? '#FFB547' : '#48C88A'); return `<g transform="translate(${x} ${y})"><rect x="-34" y="-280" width="68" height="300" rx="34" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="30" r="46" fill="${c}" stroke="${INK}" stroke-width="6"/><rect x="-18" y="${f1(-262 + 262 * (1 - k))}" width="36" height="${f1(262 * k + 10)}" rx="18" fill="${c}"/>${T8(0, 120, '말싸움 온도', { size: 30, fill: '#fff' })}</g>`; }
function qchat2Scene(t, lt, a) {
  const D = D_(a), k = a.k || 0;
  let h = BG('url(#feedBg)') + BG('url(#dots)');
  if (k === 0) {
    h += chatPeople(t, lt, D, { hot: lt < 0.5 * D, zex: lt > 0.4 * D ? '결심' : '화남', fex: lt > 0.75 * D ? '놀람' : '화남' });
    h += chatUI(t, lt, D, ASK.concat([[0.45, 'R', ['어떤 일자리가,', '어떻게 없어진다는 거야?'], 'calm']]));
    h += heatMeter(1840, 380, lerp(0.9, 0.7, prog(lt, 0.5 * D, 0.9 * D)), t);
    h += PA(t, lt, D, 0.3, 250, 330, label(0, 0, '반박 대신 질문', { size: 38, bg: MINT }), { rot: -3 });
    return h;
  }
  if (k === 1) {
    const M = ASK.map(m => [m[0], m[1], m[2], lt > 0.82 * D ? 'calm' : 'hot', 0.55]).concat([[-1, 'R', ['어떤 일자리가,', '어떻게 없어진다는 거야?'], 'calm']]);
    if (lt < 0.18 * D) M.push([0.02, 'L', '…', 'typing']);  // typing dots until the reply lands
    M.push([0.18, 'L', '음… 그러니까… 그게…'], [0.45, 'R', '나도 설명하려니까… 어…'], [0.72, 'L', '우리 둘 다 잘 모르네ㅋㅋ', 'calm']);
    h += chatPeople(t, lt, D, { zex: lt > 0.45 * D ? (lt > 0.75 * D ? '신남' : '당황') : '기본', fex: lt > 0.75 * D ? '신남' : '당황', sweat: lt > 0.2 * D && lt < 0.75 * D });
    h += chatUI(t, lt, D, M);
    h += heatMeter(1840, 380, lerp(0.7, 0.12, prog(lt, 0.3 * D, 0.9 * D)), t);
    return h;
  }
  const M = [[-1, 'L', '우리 둘 다 잘 모르네ㅋㅋ', 'calm'], [-1, 'R', '같이 찾아보자', 'calm'], [0.1, 'L', ['기사 · AI는 일자리를', '어떻게 바꿀까'], 'link'], [0.4, 'R', '오 이 부분 봐 봐'], [0.62, 'L', '아~ 이런 거였구나', 'calm']];
  h += chatPeople(t, lt, D, { zex: '신남', fex: '신남' });
  h += chatUI(t, lt, D, M);
  h += heatMeter(1840, 380, 0.1, t);
  h += PA(t, lt, D, 0.5, 250, 330, label(0, 0, '같이 찾아보기', { size: 38, bg: MINT }), { rot: -3 });
  return h;
}

/* ---------- study 2: explain HOW it works ---------- */
function slider(x, y, w, k, lab) { const px = x + w * k; return `<g><rect x="${x}" y="${y - 10}" width="${w}" height="20" rx="10" fill="#33465F" stroke="${INK}" stroke-width="4"/><line x1="${x + w / 2}" y1="${y - 26}" x2="${x + w / 2}" y2="${y + 26}" stroke="${MINT}" stroke-width="4" opacity=".7"/>${T8(x, y + 64, '극단', { size: 28, fill: '#9FB0C8' })}${T8(x + w / 2, y + 64, '중간', { size: 28, fill: MINT })}${T8(x + w, y + 64, '극단', { size: 28, fill: '#9FB0C8' })}<circle cx="${f1(px)}" cy="${y}" r="26" fill="${YEL}" stroke="${INK}" stroke-width="6"/>${lab ? T8(x + w / 2, y - 46, lab, { size: 32, fill: '#fff' }) : ''}</g>`; }
function gear(x, y, r, t, c) { let d = ''; const n = 10; for (let i = 0; i < n * 2; i++) { const an = i / (n * 2) * Math.PI * 2 + t, rr = i % 2 ? r : r * 0.8; d += (i ? 'L' : 'M') + f1(x + Math.cos(an) * rr) + ' ' + f1(y + Math.sin(an) * rr); } return `<path d="${d}Z" fill="${c}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle cx="${x}" cy="${y}" r="${f1(r * 0.3)}" fill="#fff" stroke="${INK}" stroke-width="5"/>`; }
function qexplainScene(t, lt, a) {
  const D = D_(a);
  let h = BG(NAVY) + BG('url(#grid)');
  if (!a.k) {
    h += PA(t, lt, D, 0.05, 1020, 150, big(0, 0, [[['정책이 ', '#fff'], ["'어떻게'", YEL], [' 작동하는지', '#fff']], '하나하나 설명해 보세요'], { size: 62, lh: 78 }), {});
    h += PT({ t, seed: 2900, x: 520, y: 940, s: 0.72, pose: '턱괴기', ex: exprAt([[0, '결심'], [0.62 * D, '당황']], lt), look: [0.6, -0.5] });
    h += PA(t, lt, D, 0.3, 1000, 520, gear(0, 0, 90, t * 0.8, '#7CC7FF') + gear(140, -80, 60, -t * 1.2, MINT) + gear(150, 90, 50, -t * 1.1, YEL), {});
    const steps = [['1단계: 세금을 걷어서…', 0.36], ['2단계: 그다음에…', 0.5], ['3단계: 어… 그러니까…', 0.64]];
    steps.forEach(([s, f], i) => h += PA(t, lt, D, f, 1300, 420 + i * 100, T8(0, 14, s, { anchor: 'start', size: 38, fill: i === 2 ? YEL : '#fff' }), { noPop: true, inDur: 0.2 }));
    h += PA(t, lt, D, 0.74, 1520, 760, label(0, 0, '생각보다 잘 모르네?', { size: 38, bg: YEL }), { rot: -3 });
    return h;
  }
  h += panel(130, 200, 800, 560, { fill: '#1B2A44', sw: 6 }) + panel(990, 200, 800, 560, { fill: '#1B2A44', sw: 6 });
  h += T8(530, 290, "'어떻게' 작동하는지 설명", { size: 44, fill: YEL }) + T8(1390, 290, "'왜' 찬성하는지 이유 대기", { size: 44, fill: '#fff' });
  const k1 = easeInOut(prog(lt, 0.12 * D, 0.45 * D)), k2 = prog(lt, 0.62 * D, 0.95 * D);
  h += PA(t, lt, D, 0.06, 530, 400, label(0, 0, '이해한다는 착각 ↓', { size: 34, bg: MINT }), {});
  h += slider(230, 560, 600, lerp(0.04, 0.38, k1), '내 입장');
  h += PA(t, lt, D, 0.42, 530, 690, label(0, 0, '덜 극단적으로', { size: 36, bg: YEL }), {});
  if (lt > 0.58 * D) {
    h += PA(t, lt, D, 0.58, 1390, 400, label(0, 0, '이유만 줄줄', { size: 34, bg: '#fff' }), {});
    h += slider(1090, 560, 600, 0.04 + Math.sin(k2 * Math.PI * 3) * 0.02, '내 입장');
    h += PA(t, lt, D, 0.8, 1390, 690, label(0, 0, '그대로', { size: 36, bg: '#C3CDD8' }), {});
  }
  h += T8(960, 850, 'Fernbach, Rogers, Fox & Sloman · Psychological Science (2013)', { size: 28, fill: '#9FB0C8' });
  return h;
}

/* ---------- day 3: the midwife ---------- */
function babyG(x, y, s, t) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(Math.sin(t * 2) * 3)}) scale(${s})"><ellipse cx="0" cy="0" rx="70" ry="44" fill="#F4F1EA" stroke="${INK}" stroke-width="6"/><circle cx="-44" cy="-6" r="32" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M-56 -8 q6 -6 12 0 M-38 -8 q6 -6 12 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M-10 -30 Q30 -10 60 -30 M-10 30 Q30 10 60 30" fill="none" stroke="#C9BFA8" stroke-width="5"/></g>`; }
function homeBg(t, sep) {
  let h = BG(sep ? '#E9D3A8' : '#F3E6CC') + BG('url(#paper)');
  h += `<rect x="1300" y="160" width="300" height="260" rx="10" fill="#A9DBFF" stroke="${INK}" stroke-width="9"/><line x1="1450" y1="160" x2="1450" y2="420" stroke="${INK}" stroke-width="7"/>`;
  h += `<rect x="-600" y="860" width="3120" height="600" fill="#C9A882"/><line x1="-600" y1="860" x2="2520" y2="860" stroke="${INK}" stroke-width="6"/>`;
  return h;
}
function qmidwifeScene(t, lt, a) {
  const D = D_(a), sw = xf(lt, D, 0.48);
  let h = '';
  if (sw < 1) {
    let g = homeBg(t, 1);
    const mx = 820, my = 930, ms = 0.78;
    g += MOTHER({ t, seed: 3000, x: mx, y: my, s: ms, pose: '폰보기', ex: exprAt([[0, '미소']], t), look: [0.3, 0.6] });
    const [hx, hy] = handG(mx, my, ms, [200, 318]); g += babyG(hx + 10, hy - 4, 0.62, t) + hand(hx - 40, hy + 14, ms) + hand(hx + 50, hy + 14, ms);
    g += BOY({ t, seed: 3001, x: 1240, y: 930, s: 0.5, ex: exprAt([[0, '놀람']], t), look: [-0.8, -0.2], pose: '턱괴기' });
    g += PA(t, lt, D, 0.08, mx, 260, label(0, 0, '소크라테스의 어머니', { size: 40, bg: '#fff' }), {});
    g += PA(t, lt, D, 0.2, mx, 345, label(0, 0, '산파 = 아기를 받는 사람', { size: 34, bg: YEL }), {});
    g += PA(t, lt, D, 0.26, 1240, 520, label(0, 0, '어린 소크라테스', { size: 30, bg: '#fff' }), {});
    g += BG('#C9A060').replace('/>', ' opacity=".14"/>');
    h += fadeG(1 - sw, g);
  }
  if (sw > 0) {
    let g = athensBg(t, { olive: false });
    const px = 1240, py = 940, ps = 0.74, [phx, phy] = hd(px, py, ps);
    g += SOC({ t, seed: 3002, x: 620, y: 940, s: 0.74, pose: '설명', ex: exprAt([[0, '미소']], t), look: [0.8, -0.2] });
    const born = easeOutBack(prog(lt, 0.66 * D, 0.86 * D));
    g += PT({ t, seed: 3003, x: px, y: py, s: ps, pose: born > 0.5 ? '만세' : '턱괴기', ex: exprAt([[0, '생각'], [0.7 * D, '신남']], lt), look: [-0.2, -0.8] });
    g += pop(t, t - lt + 0.55 * D, t + 99, phx, phy - 210 - 60 * born, bubble(0, 0, 260, 150, born > 0.05 ? bulbQ(0, 6, 0.8 * clamp(born, 0, 1.2), t) : T8(0, 16, '…', { size: 50 })), { bob: 4 });
    g += PA(t, lt, D, 0.62, 960, 120, big(0, 0, [[['생각을 낳도록 돕는 ', '#fff'], ['산파', YEL]]], { size: 72 }), {});
    h += fadeG(sw, g);
  }
  return h;
}

/* ---------- day 3: Meno's boy — doubling the square, step by step ---------- */
const MU = 125, MX = 720, MY = 290;   // unit length + top-left corner of the 4×4 frame (scene coords)
const MP = (i, j) => [MX + i * MU, MY + j * MU];
function sandBg(t) {
  let h = skyDefs('qSkyM', '#9FD4F2', '#FFF4E0') + BG('url(#qSkyM)');
  h += `<rect x="-600" y="40" width="3120" height="160" fill="#F2EEE4" stroke="${INK}" stroke-width="6"/><rect x="-600" y="20" width="3120" height="26" fill="#B5523A" stroke="${INK}" stroke-width="5"/>`;
  h += oliveTree(1800, 210, 0.45, t) + oliveTree(120, 210, 0.42, t + 2);
  h += `<rect x="-600" y="190" width="3120" height="1300" fill="#E8D3A6"/><line x1="-600" y1="190" x2="2520" y2="190" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 160; i++) h += `<circle cx="${f1(hash(i * 3.3) * 2400 - 240)}" cy="${f1(210 + hash(i * 5.1) * 840)}" r="${f1(1.5 + hash(i) * 3)}" fill="#C9AE7E" opacity=".7"/>`;
  return h;
}
const groove = (d, k = 1, c = '#6E4E2E', w = 9) => { const L = 4000; return `<path d="${d}" fill="none" stroke="#F8EBCF" stroke-width="${w * 0.45}" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 4)" stroke-dasharray="${f1(L * k)} ${L}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${f1(L * k)} ${L}"/>`; };
const sq = (n, i0 = 0, j0 = 0) => { const [a1, b1] = MP(i0, j0), [a2, b2] = MP(i0 + n, j0 + n); return `M${a1} ${b1} L${a2} ${b1} L${a2} ${b2} L${a1} ${b2} Z`; };
function cellGrid(n, op = 0.5) { let h = ''; for (let i = 1; i < n; i++) { const [x, y0] = MP(i, 0), [, y1] = MP(i, n), [x0, y] = MP(0, i), [x1] = MP(n, i); h += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" stroke="#8A6A44" stroke-width="4" stroke-dasharray="10 10" opacity="${op}"/><line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="#8A6A44" stroke-width="4" stroke-dasharray="10 10" opacity="${op}"/>`; } return h; }
function cellCount(n, k, op = 0.75) { let h = ''; const N = n * n, m = Math.floor(clamp(k, 0, 1) * N); for (let c = 0; c < m; c++) { const i = c % n, j = Math.floor(c / n), [x, y] = MP(i + 0.5, j + 0.5); h += T8(x, y + 12, String(c + 1), { size: 34, fill: '#8A6A44', op: r3(op) }); } return h; }
const areaNum = (i, j, txt, c = NAVY, fs = 110) => { const [x, y] = MP(i, j); return T8(x, y + fs * 0.36, txt, { size: fs, fill: c, stroke: '#fff', sw: 12 }); };
const sideLab = (txt, i, j, dx, dy) => { const [x, y] = MP(i, j); return T8(x + dx, y + dy, txt, { size: 48, fill: '#6E4E2E', stroke: '#F8EBCF', sw: 8 }); };
function menoPeople(t, lt, D, o = {}) {
  let h = '';
  const sx = 470, sy = 930, ss = 0.68;
  h += SOC({ t, seed: 3100, x: sx, y: sy, s: ss, pose: o.spose || '막대', ex: exprAt([[0, o.sex || '미소']], t), look: [0.8, 0.3] });
  const [hx, hy] = handG(sx, sy, ss, P[o.spose || '막대'].hR);
  if ((o.spose || '막대') === '막대') {
    const tip = o.tip || MP(0, 2), x0 = hx - 30, y0 = hy + 40, dx = tip[0] - x0, dy = tip[1] - y0, L = Math.hypot(dx, dy) || 1, len = Math.min(L, 330), ex = x0 + dx / L * len, ey = y0 + dy / L * len;
    h += `<line x1="${f1(x0)}" y1="${f1(y0)}" x2="${f1(ex)}" y2="${f1(ey)}" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><line x1="${f1(x0)}" y1="${f1(y0)}" x2="${f1(ex)}" y2="${f1(ey)}" stroke="#9A6E44" stroke-width="7" stroke-linecap="round"/>` + hand(hx, hy, ss);
    if (o.drawing) h += sparkle(tip[0], tip[1], 0.5, t, '#FFF3B0');
  }
  h += BOY({ t, seed: 3101, x: 1600, y: 940, s: 0.6, pose: o.bpose || '웅크림', ex: exprAt([[0, o.bex || '기본']], t), look: [-0.7, 0.4] });
  return h;
}
function qmenoScene(t, lt, a) {
  const D = D_(a), k = a.k || 0;
  let h = sandBg(t);
  const BHX = 1600, BHY = 940 - (390 - 30) * 0.6;  // boy's head while crouching
  if (k === 0) {
    const dk = prog(lt, 0.38 * D, 0.72 * D);
    h += `<path d="${sq(2)}" fill="#7FD8F5" opacity="${r3(prog(lt, 0.72 * D, 0.8 * D) * 0.45)}"/>` + groove(sq(2), dk);
    if (at(lt, 0.74, D)) h += cellGrid(2);
    h += menoPeople(t, lt, D, { tip: dk < 1 ? (() => { const L = dk * 4; const s = Math.floor(L), f = L - s; const C = [MP(0, 0), MP(2, 0), MP(2, 2), MP(0, 2), MP(0, 0)]; return [lerp(C[s][0], C[Math.min(4, s + 1)][0], f), lerp(C[s][1], C[Math.min(4, s + 1)][1], f)]; })() : MP(0, 2), drawing: dk > 0 && dk < 1, bex: '놀람' });
    if (at(lt, 0.78, D)) h += sideLab('2', 1, 0, 0, -22) + sideLab('2', 0, 1, -40, 16);
    h += PA(t, lt, D, 0.84, MP(1, 1)[0], MP(1, 1)[1], T8(0, 40, '4', { size: 110, fill: NAVY, stroke: '#fff', sw: 12 }), {});
    h += PA(t, lt, D, 0.1, BHX, 470, label(0, 0, '기하학을 배운 적 없는 소년', { size: 32, bg: '#fff' }), {});
    h += PA(t, lt, D, 0.86, 1600, 260, label(0, 0, '넓이 4', { size: 46, bg: '#7FD8F5' }), {});
    return h;
  }
  if (k === 1) {
    h += `<path d="${sq(2)}" fill="#7FD8F5" opacity=".45"/>` + groove(sq(2)) + cellGrid(2) + areaNum(1, 1, '4');
    h += sideLab('2', 1, 0, 0, -22) + sideLab('?', 0, 1, -40, 16);
    const g = prog(lt, 0.2 * D, 0.4 * D);
    if (g > 0) h += `<rect x="${MP(0, 0)[0]}" y="${MP(0, 0)[1]}" width="${f1(MU * 2.83 * g)}" height="${f1(MU * 2.83 * g)}" fill="none" stroke="${YEL}" stroke-width="8" stroke-dasharray="18 14" opacity=".95"/>`;
    h += menoPeople(t, lt, D, { spose: '설명', bex: '생각' });
    h += PA(t, lt, D, 0.14, 1560, 230, `<rect x="-260" y="-70" width="520" height="140" rx="24" fill="#fff" stroke="${INK}" stroke-width="6"/>` + T8(0, -8, '넓이 4 × 2 = 8', { size: 46 }) + T8(0, 46, '두 배인 정사각형', { size: 30, fill: '#6B6255' }), {});
    h += PA(t, lt, D, 0.55, 1560, 400, label(0, 0, '한 변은 얼마?', { size: 44, bg: YEL }), {});
    if (at(lt, 0.6, D)) h += qmarks(t, 3110, 3, [MP(2, 0)[0] + 40, MP(0, 1)[1], 260, 300], { size: 70 });
    return h;
  }
  if (k === 2) {
    const grow = easeInOut(prog(lt, 0.3 * D, 0.52 * D)), n = lerp(2, 4, grow);
    const [x0, y0] = MP(0, 0);
    h += `<rect x="${x0}" y="${y0}" width="${f1(n * MU)}" height="${f1(n * MU)}" fill="${PINK}" opacity="${r3(0.18 + 0.17 * grow)}"/>`;
    h += `<path d="M${x0} ${y0} L${f1(x0 + n * MU)} ${y0} L${f1(x0 + n * MU)} ${f1(y0 + n * MU)} L${x0} ${f1(y0 + n * MU)} Z" fill="none" stroke="#6E4E2E" stroke-width="9" stroke-linejoin="round"/>`;
    h += `<path d="${sq(2)}" fill="#7FD8F5" opacity="${r3(0.45 * (1 - grow * 0.6))}"/>`;
    if (grow >= 1) { h += cellGrid(4, 0.6) + cellCount(4, prog(lt, 0.54 * D, 0.72 * D), lerp(0.75, 0.22, prog(lt, 0.74 * D, 0.8 * D))); }
    if (grow >= 1) h += sideLab('4', 2, 0, 0, -22) + sideLab('4', 0, 2, -40, 16);
    h += menoPeople(t, lt, D, { spose: '서기', bpose: lt < 0.3 * D ? '손인사' : '웅크림', bex: lt < 0.75 * D ? '신남' : '놀람' });
    h += SPK(t, lt, D, 0.06, 0.5, 1480, 380, 440, 110, '변을 두 배로요!', BHX - 20, BHY - 90, { size: 44 });
    if (at(lt, 0.74, D)) h += PA(t, lt, D, 0.74, MP(2, 2)[0], MP(2, 2)[1], T8(0, 50, '16', { size: 140, fill: NAVY, stroke: '#fff', sw: 14 }), {});
    h += PA(t, lt, D, 0.78, 1590, 300, `<rect x="-250" y="-60" width="500" height="120" rx="24" fill="#fff" stroke="${RED}" stroke-width="7"/>` + T8(0, 18, '두 배가 아니라 네 배!', { size: 40, fill: RED }), { rot: -3 });
    return h;
  }
  if (k === 3) {
    const shrink = easeInOut(prog(lt, 0.14 * D, 0.3 * D)), n = lerp(4, 3, shrink);
    const [x0, y0] = MP(0, 0);
    h += `<path d="${sq(4)}" fill="none" stroke="#6E4E2E" stroke-width="5" stroke-dasharray="14 12" opacity="${r3(0.5 * (1 - shrink) + 0.2)}"/>`;
    h += `<rect x="${x0}" y="${y0}" width="${f1(n * MU)}" height="${f1(n * MU)}" fill="#FFB547" opacity=".38"/><path d="M${x0} ${y0} L${f1(x0 + n * MU)} ${y0} L${f1(x0 + n * MU)} ${f1(y0 + n * MU)} L${x0} ${f1(y0 + n * MU)} Z" fill="none" stroke="#6E4E2E" stroke-width="9" stroke-linejoin="round"/>`;
    if (shrink >= 1) { h += cellGrid(3, 0.6) + cellCount(3, prog(lt, 0.3 * D, 0.42 * D), lerp(0.75, 0.22, prog(lt, 0.42 * D, 0.48 * D))) + sideLab('3', 1.5, 0, 0, -22) + sideLab('3', 0, 1.5, -40, 16); }
    if (at(lt, 0.42, D)) h += PA(t, lt, D, 0.42, MP(1.5, 1.5)[0], MP(1.5, 1.5)[1], T8(0, 46, '9', { size: 130, fill: NAVY, stroke: '#fff', sw: 14 }), {});
    h += menoPeople(t, lt, D, { spose: '서기', bpose: lt < 0.2 * D ? '손인사' : '웅크림', bex: lt < 0.5 * D ? '신남' : '걱정' });
    h += SPK(t, lt, D, 0.03, 0.4, 1480, 380, 360, 110, '그럼 3이요!', BHX - 20, BHY - 90, { size: 44 });
    h += PA(t, lt, D, 0.5, 1590, 230, `<rect x="-250" y="-60" width="500" height="120" rx="24" fill="#fff" stroke="${RED}" stroke-width="7"/>` + T8(0, 18, '이번에도 8이 아니다', { size: 40, fill: RED }), { rot: 3 });
    h += PA(t, lt, D, 0.56, 1590, 360, T8(0, 0, '4 < 8 < 9', { size: 56, fill: NAVY, stroke: '#fff', sw: 10 }), {});
    h += SPK(t, lt, D, 0.74, null, 1460, 500, 380, 110, '모르겠어요…', BHX - 30, BHY - 90, { size: 44 });
    return h;
  }
  if (k === 4) {
    h += `<rect x="${MP(0, 0)[0]}" y="${MP(0, 0)[1]}" width="${3 * MU}" height="${3 * MU}" fill="#FFB547" opacity=".2"/>` + groove(sq(3), 1, '#8A6A44', 6) + groove(sq(2));
    const crack = prog(lt, 0.42 * D, 0.62 * D), shat = prog(lt, 0.62 * D, 0.75 * D);
    h += menoPeople(t, lt, D, { spose: '설명', sex: '미소', bex: lt < 0.7 * D ? '걱정' : '결심' });
    // the "I know" bubble cracks and breaks — then the wish to know lights up
    if (shat < 1) {
      let g = `<circle r="130" fill="#DFF3FF" fill-opacity=".85" stroke="${INK}" stroke-width="6"/>` + T8(0, 16, '안다는 착각', { size: 38 });
      if (crack > 0) g += `<path d="M-40 -126 L-10 -60 L-40 -20 L10 30 L-20 80 L10 126" fill="none" stroke="${INK}" stroke-width="5" stroke-dasharray="${f1(400 * crack)} 400"/><path d="M-10 -60 L60 -90 M10 30 L90 20" fill="none" stroke="${INK}" stroke-width="4" stroke-dasharray="${f1(200 * crack)} 200"/>`;
      h += `<g transform="translate(1420 300) scale(${r3(1 + shat * 0.3)})" opacity="${r3(1 - shat)}">${g}</g>`;
    }
    h += PA(t, lt, D, 0.08, 960, 110, big(0, 0, [[["'모르겠어요'", YEL], [' = 좋은 출발', '#fff']]], { size: 70 }), {});
    if (at(lt, 0.7, D)) { h += PA(t, lt, D, 0.7, 1420, 300, bulbQ(0, 0, 1.4, t), {}) + PA(t, lt, D, 0.74, 1420, 470, label(0, 0, '진짜로 알고 싶다!', { size: 38, bg: YEL }), {}); }
    return h;
  }
  if (k === 5) {
    // four 2×2 squares, then one diagonal in each, then the inner halves
    h += `<path d="${sq(2)}" fill="#7FD8F5" opacity=".35"/>`;
    h += groove(sq(4)) + groove(`M${MP(2, 0)[0]} ${MP(2, 0)[1]} L${MP(2, 4)[0]} ${MP(2, 4)[1]} M${MP(0, 2)[0]} ${MP(0, 2)[1]} L${MP(4, 2)[0]} ${MP(4, 2)[1]}`, 1, '#6E4E2E', 7);
    const D4 = [[MP(0, 2), MP(2, 0)], [MP(2, 0), MP(4, 2)], [MP(4, 2), MP(2, 4)], [MP(2, 4), MP(0, 2)]];
    const C4 = [[0, 0], [4, 0], [4, 4], [0, 4]];
    D4.forEach(([p, q], i) => {
      const fk = prog(lt, (0.62 + i * 0.07) * D, (0.66 + i * 0.07) * D);
      if (fk > 0) h += `<path d="M${p[0]} ${p[1]} L${q[0]} ${q[1]} L${MP(2, 2)[0]} ${MP(2, 2)[1]} Z" fill="${YEL}" opacity="${r3(fk * 0.75)}"/>` + (fk > 0.5 ? T8((p[0] + q[0] + MP(2, 2)[0]) / 3, (p[1] + q[1] + MP(2, 2)[1]) / 3 + 16, '2', { size: 46, fill: NAVY }) : '');
      const dk = prog(lt, (0.22 + i * 0.08) * D, (0.29 + i * 0.08) * D);
      if (dk > 0) h += groove(`M${p[0]} ${p[1]} L${q[0]} ${q[1]}`, dk, '#B5523A', 10);
    });
    const tipI = Math.min(3, Math.floor(prog(lt, 0.22 * D, 0.54 * D) * 4)), tp = D4[tipI], tk = prog(lt, (0.22 + tipI * 0.08) * D, (0.29 + tipI * 0.08) * D);
    h += menoPeople(t, lt, D, { tip: [lerp(tp[0][0], tp[1][0], tk), lerp(tp[0][1], tp[1][1], tk)], drawing: tk > 0 && tk < 1, bex: lt > 0.62 * D ? '놀람' : '생각' });
    h += PA(t, lt, D, 0.06, 1590, 230, label(0, 0, '큰 정사각형의 네 칸 (각 4)', { size: 34, bg: '#fff' }), {});
    if (at(lt, 0.06, D)) h += [[1, 1], [3, 1], [1, 3], [3, 3]].map(([i, j], n) => fadeG(prog(lt, (0.06 + n * 0.02) * D, (0.1 + n * 0.02) * D) * (1 - prog(lt, 0.2 * D, 0.26 * D)), T8(MP(i, j)[0], MP(i, j)[1] + 22, '4', { size: 64, fill: '#8A6A44' }))).join('');
    h += PA(t, lt, D, 0.34, 1590, 330, label(0, 0, '모서리에서 모서리로 반씩', { size: 34, bg: '#FFD9C9' }), {});
    h += PA(t, lt, D, 0.66, 1590, 430, label(0, 0, '반쪽(2) 네 개를 모으면?', { size: 34, bg: YEL }), {});
    return h;
  }
  // k6: the square on the diagonal — area 8
  const D4 = [MP(0, 2), MP(2, 0), MP(4, 2), MP(2, 4)];
  h += groove(sq(4), 1, '#8A6A44', 6) + cellGrid(4, 0.25);
  h += `<path d="${sq(2)}" fill="#7FD8F5" opacity=".35"/>` + groove(sq(2), 1, '#6E4E2E', 7);
  h += `<path d="M${D4.map(p => p.join(' ')).join(' L')} Z" fill="${YEL}" opacity=".8"/>` + groove(`M${D4.map(p => p.join(' ')).join(' L')} Z`, 1, '#B5523A', 11);
  const glow = 0.5 + 0.5 * Math.sin(t * 4);
  h += `<path d="M${MP(0, 2).join(' ')} L${MP(2, 0).join(' ')}" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity="${r3(prog(lt, 0.2 * D, 0.3 * D) * (0.3 + 0.4 * glow))}"/>`;
  h += PA(t, lt, D, 0.06, MP(2, 2)[0], MP(2, 2)[1], T8(0, 50, '8', { size: 150, fill: NAVY, stroke: '#fff', sw: 14 }), {});
  h += PA(t, lt, D, 0.2, MP(0.6, 0.6)[0] - 120, MP(0.6, 0.6)[1] - 70, label(0, 0, '대각선', { size: 34, bg: '#fff' }), { rot: -45 });
  h += menoPeople(t, lt, D, { spose: lt > 0.6 * D ? '설명' : '서기', bpose: lt > 0.4 * D ? '만세' : '웅크림', bex: lt > 0.4 * D ? '신남' : '놀람' });
  h += PA(t, lt, D, 0.1, 1590, 220, label(0, 0, '대각선 위에 세운 정사각형', { size: 34, bg: YEL }), {}) + PA(t, lt, D, 0.16, 1590, 310, label(0, 0, '2 × 4 = 8', { size: 40, bg: '#fff' }), {});
  h += SPK(t, lt, D, 0.42, null, 1480, 420, 300, 104, '찾았다!', BHX - 10, 940 - 0.6 * 470, { size: 44 });
  h += PA(t, lt, D, 0.66, 400, 480, label(0, 0, '소크라테스: 질문만 했다', { size: 34, bg: MINT }), {});
  return h;
}

/* ---------- day 3: helping a friend with questions ---------- */
function cafeBg(t) {
  let h = BG('#F3E1C8') + BG('url(#hatch)').replace('/>', ' opacity=".25"/>');
  h += `<rect x="40" y="120" width="380" height="420" rx="12" fill="#A9DBFF" stroke="${INK}" stroke-width="10"/><line x1="230" y1="120" x2="230" y2="540" stroke="${INK}" stroke-width="8"/><ellipse cx="140" cy="430" rx="60" ry="20" fill="#fff" opacity=".9"/>`;
  for (const x of [760, 1160]) h += `<line x1="${x}" y1="-200" x2="${x}" y2="90" stroke="${INK}" stroke-width="5"/><path d="M${x - 60} 140 Q${x} 60 ${x + 60} 140 Z" fill="#2F4A3E" stroke="${INK}" stroke-width="6"/><circle cx="${x}" cy="150" r="70" fill="url(#warm)" opacity=".6"/>`;
  h += `<rect x="1700" y="760" width="90" height="120" rx="10" fill="#C77B4A" stroke="${INK}" stroke-width="6"/>${[-40, 0, 40].map((d, i) => `<ellipse cx="${1745 + d}" cy="${700 - (i % 2) * 40}" rx="34" ry="70" transform="rotate(${d / 2} ${1745 + d} 760)" fill="#58B868" stroke="${INK}" stroke-width="6"/>`).join('')}`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#B88C66"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  return h;
}
function cafeTable(t) { return `<rect x="500" y="700" width="920" height="36" rx="12" fill="#8C6638" stroke="${INK}" stroke-width="8"/><path d="M520 736 L1400 736 L1420 884 L500 884 Z" fill="#E9D2B0" stroke="${INK}" stroke-width="7"/><path d="M560 760 L1360 760" stroke="#D2B48C" stroke-width="6"/>` + mug(830, 668, 0.42, t) + mug(1110, 668, 0.42, t + 1); }
function tangle(cx, cy, r, k, t, seed = 7) { // k = 0 tangled ball … 1 straight thread
  const N = 46, pts = [];
  for (let i = 0; i < N; i++) {
    const a = hash(seed + i * 1.31) * Math.PI * 2, rr = r * (0.25 + 0.75 * hash(seed + i * 2.7));
    const tx = cx + Math.cos(a + t * 0.3 * (1 - k)) * rr, ty = cy + Math.sin(a + t * 0.3 * (1 - k)) * rr * 0.8;
    const sx = cx - r * 1.4 + (i / (N - 1)) * r * 2.8, sy = cy + Math.sin(i / (N - 1) * Math.PI * 2 + t) * 8 * (1 - k * 0.6);
    const kk = easeInOut(clamp(k * 1.3 - (1 - i / N) * 0.3, 0, 1));
    pts.push([lerp(tx, sx, kk), lerp(ty, sy, kk)]);
  }
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 1; i < N - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; d += ` Q${f1(pts[i][0])} ${f1(pts[i][1])} ${f1(mx)} ${f1(my)}`; }
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${k > 0.9 ? MINT : '#E05A5A'}" stroke-width="5" stroke-linecap="round"/>`;
}
function qfriendScene(t, lt, a) {
  const D = D_(a), k = a.k || 0;
  let h = cafeBg(t);
  const zx = 700, fx = 1240, y = 840, s = 0.66, [zhx, zhy] = hd(zx, y, s), [fhx, fhy] = hd(fx, y, s);
  const untg = k === 0 ? 0 : (k === 1 ? lerp(0, 0.18, prog(lt, 0.25 * D, 0.45 * D)) + lerp(0, 0.22, prog(lt, 0.65 * D, 0.9 * D)) : lerp(0.4, 1, easeInOut(prog(lt, 0.05 * D, 0.45 * D))));
  h += Z({ t, seed: 3200, x: zx, y, s, pose: k === 1 ? '설명' : '서기', ex: exprAt([[0, k === 2 ? '뿌듯' : (k === 1 ? '미소' : '기본')]], t), look: [0.8, -0.1] });
  h += PT({ t, seed: 3201, x: fx, y, s, pose: k === 2 && lt > 0.5 * D ? '만세' : (k === 1 ? '턱괴기' : '서기'), ex: exprAt([[0, k === 2 ? '신남' : (k === 1 ? '생각' : '걱정')]], t), look: [-0.8, k === 1 ? -0.4 : 0], tilt: k === 0 ? -5 : 0 });
  h += cafeTable(t);
  h += tangle(fx, fhy - 230, 120, untg, t);
  if (k === 2 && at(lt, 0.42, D)) h += PA(t, lt, D, 0.42, fx + 270, fhy - 190, bulbQ(0, 0, 1, t), {});
  if (k === 0) {
    h += PA(t, lt, D, 0.16, fx, fhy - 400, label(0, 0, '이직 고민', { size: 40, bg: '#fff' }), {});
    h += SPK(t, lt, D, 0.62, null, 560, 300, 400, 120, '당장 옮겨!', zhx + 20, zhy - 110, { size: 50, bg: '#F2F2F2' });
    h += PA(t, lt, D, 0.62, 330, 200, label(0, 0, '예전 같으면…', { size: 34, bg: '#fff' }), {});
    if (at(lt, 0.8, D)) h += PA(t, lt, D, 0.8, 560, 300, xMark(0, 0, 0.6), {});
    return h;
  }
  if (k === 1) {
    h += SPK(t, lt, D, 0.12, null, 560, 250, 540, 110, '제일 걱정되는 게 뭐야?', zhx + 20, zhy - 110, { size: 42 });
    h += SPK(t, lt, D, 0.5, null, 560, 420, 520, 156, ['1년 뒤에, 어떤 하루를', '보내고 싶어?'], zhx + 40, zhy - 100, { size: 42 });
    h += PA(t, lt, D, 0.3, fx + 270, fhy - 120, label(0, 0, '음…', { size: 36, bg: '#fff' }), { bob: 3 });
    return h;
  }
  h += SPK(t, lt, D, 0.56, null, 1460, 260, 560, 156, ['너랑 얘기하니까', '정리된다!'], fhx + 40, fhy - 120, { size: 44 });
  h += PA(t, lt, D, 0.2, 560, 330, label(0, 0, '답은 친구가 스스로', { size: 38, bg: MINT }), {});
  return h;
}

/* ---------- study 3: questions make you liked ---------- */
function qlikeScene(t, lt, a) {
  const D = D_(a);
  let h = BG('#EDE3D0') + BG('url(#paper)');
  if (!a.k) {
    h += PA(t, lt, D, 0.03, 960, 110, big(0, 0, [[['질문을 많이, 특히 ', '#fff'], ['후속 질문', YEL]]], { size: 64 }), {});
    h += panel(130, 200, 1000, 600, { fill: '#fff' });
    const ax = 380, bx = 880, y = 780, s = 0.46, [ahx, ahy] = hd(ax, y, s), [bhx, bhy] = hd(bx, y, s);
    h += PT({ t, seed: 3300, x: ax, y, s, pose: '설명', ex: exprAt([[0, '미소']], t), look: [0.7, -0.1] });
    h += COW(1, { t, seed: 3301, x: bx, y, s, ex: exprAt([[0, '기본'], [0.62 * D, '신남']], lt), look: [-0.7, -0.1] });
    h += SPK(t, lt, D, 0.15, null, 410, 280, 360, 88, '주말에 뭐 했어?', ahx + 30, ahy - 70, { size: 34 });
    h += SPK(t, lt, D, 0.3, null, 880, 375, 280, 88, '등산 갔어!', bhx - 20, bhy - 70, { size: 34 });
    h += SPK(t, lt, D, 0.45, null, 430, 470, 400, 88, '오, 어디로? 어땠어?', ahx + 30, ahy - 70, { size: 34, bg: '#CFF6E4' });
    h += PA(t, lt, D, 0.5, 740, 482, label(0, 0, '후속 질문', { size: 30, bg: MINT }), { rot: -4 });
    if (at(lt, 0.62, D)) for (let i = 0; i < 5; i++) { const kk = ((t * 0.5 + i / 5) % 1); h += `<g opacity="${f1(Math.sin(kk * Math.PI) * 100) / 100}">${heart(bx + 100 + i * 16 + Math.sin(t * 2 + i) * 10, 660 - kk * 200, 1.1, PINK)}</g>`; }
    const kb = easeOut(prog(lt, 0.55 * D, 0.85 * D));
    h += panel(1200, 200, 590, 600, { fill: '#fff' }) + T8(1495, 290, '호감도', { size: 44 });
    h += vbar(1380, 700, 130, 320, 0.48 * kb, '#C3CDD8', '', '질문 적게', { bs: 30 }) + vbar(1610, 700, 130, 320, 0.9 * kb, PINK, '', '질문 많이', { bs: 30 });
    h += `<line x1="1260" y1="700" x2="1730" y2="700" stroke="${INK}" stroke-width="6"/>`;
    h += T8(960, 850, 'Huang, Yeomans, Brooks, Minson & Gino · JPSP (2017)', { size: 28, fill: '#6B6255' });
    return h;
  }
  h += PA(t, lt, D, 0.03, 960, 110, big(0, 0, [[['스피드 데이팅', YEL], ['에서는', '#fff']]], { size: 66 }), {});
  h += PA(t, lt, D, 0.22, 960, 220, label(0, 0, '질문을 더 많이 한 사람이', { size: 38, bg: MINT }), {});
  for (let i = 0; i < 3; i++) {
    const cx = 380 + i * 580, y = 700, win = i === 1;
    h += COW(i, { t, seed: 3310 + i, x: cx - 110, y, s: 0.42, ex: exprAt([[0, win ? '미소' : '기본']], t), look: [0.7, 0] });
    h += COW(i + 1, { t, seed: 3320 + i, x: cx + 110, y, s: 0.42, ex: exprAt([[0, win && lt > 0.5 * D ? '신남' : '기본']], t), look: [-0.7, 0] });
    h += `<rect x="${cx - 190}" y="610" width="380" height="26" rx="8" fill="#8C6638" stroke="${INK}" stroke-width="6"/><path d="M${cx - 180} 636 L${cx + 180} 636 L${cx + 190} 780 L${cx - 190} 780 Z" fill="#F2E6D6" stroke="${INK}" stroke-width="6"/>${heart(cx, 712, 1.2, '#FFB3C7')}`;
    if (win) h += PA(t, lt, D, 0.12, cx - 110, 360, `<g>${[0, 1, 2].map(j => T8(-40 + j * 40, 0, '?', { size: 50, fill: YEL, stroke: INK, sw: 7 })).join('')}</g>`, { bob: 4 });
    if (win && at(lt, 0.5, D)) for (let j = 0; j < 4; j++) { const kk = ((t * 0.5 + j / 4) % 1); h += `<g opacity="${f1(Math.sin(kk * Math.PI) * 100) / 100}">${heart(cx + 80 + j * 22, 440 - kk * 120, 1, PINK)}</g>`; }
  }
  h += PA(t, lt, D, 0.42, 960, 870, `<rect x="-320" y="-60" width="640" height="120" rx="30" fill="#fff" stroke="${INK}" stroke-width="6"/>${heart(-240, 6, 1.6, PINK)}` + T8(30, 16, '두 번째 만남 약속 ↑', { size: 44 }), {});
  return h;
}

/* ---------- twist: the trial ---------- */
function courtroom(t, dim = 0) {
  let h = BG('#D8CDB8') + BG('url(#paper)');
  h += `<rect x="-600" y="80" width="3120" height="40" fill="#B5523A" stroke="${INK}" stroke-width="5"/>`;
  for (let i = 0; i < 9; i++) h += `<rect x="${60 + i * 230}" y="120" width="40" height="190" fill="${MARBLE}" stroke="${INK}" stroke-width="5"/>`;
  const rows = [[330, 13, 0.25], [470, 12, 0.27], [610, 11, 0.29]];
  rows.forEach(([fy, n, s], r) => {
    for (let i = 0; i < n; i++) {
      const x = 120 + (i + (r % 2) * 0.5) * (1700 / n), seed = 3400 + r * 20 + i;
      h += char({ t, seed, x, y: fy + 40, s, goggles: 'none', vest: ['#F2E2D0', '#DCE6F2', '#E9F0DA', '#F4E3E8', '#EDE6D3'][(i + r) % 5], patch: false, tee: true, toga: ['#B5523A', '#3E5C84', '#5E8C4E', '#9E5A7A', '#8A6A44'][(i * 3 + r) % 5], hair: ['#2B2B2B', '#6B4A2E', '#3A2A1E', '#8A8A8A', '#4A3426'][(i + r * 2) % 5], beard: (i + r) % 3 ? ['#2B2B2B', '#6B4A2E', '#3A2A1E', '#8A8A8A', '#4A3426'][(i + r * 2) % 5] : null, ex: { expr: (i * 7 + r) % 4 ? '기본' : '결심', prev: '기본', k: 1, blink: 0 }, look: [(960 - x) / 1400, 0.2] });
    }
    h += `<rect x="-600" y="${fy}" width="3120" height="56" fill="#8A6A44" stroke="${INK}" stroke-width="6"/><line x1="-600" y1="${fy + 20}" x2="2520" y2="${fy + 20}" stroke="#6A4E30" stroke-width="4"/>`;
  });
  h += `<rect x="-600" y="740" width="3120" height="800" fill="#C9B79A"/><line x1="-600" y1="740" x2="2520" y2="740" stroke="${INK}" stroke-width="6"/>`;
  if (dim) h += BG('#0B1626').replace('/>', ` opacity="${r3(dim)}"/>`);
  return h;
}
function urn(x, y, s, c, txt) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-60 -150 L60 -150 L52 -120 Q110 -80 100 -10 Q90 40 50 50 L-50 50 Q-90 40 -100 -10 Q-110 -80 -52 -120 Z" fill="${c}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-66" y="-166" width="132" height="22" rx="8" fill="${c}" stroke="${INK}" stroke-width="6"/>${T8(0, -30, txt, { size: 46, fill: '#fff', stroke: INK, sw: 7 })}</g>`; }
function qtrialScene(t, lt, a) {
  const D = D_(a), k = a.k || 0;
  const sx = 960, sy = 960, ss = 0.74, [shx, shy] = hd(sx, sy, ss);
  if (k === 0) {
    let h = BG('#141A2E') + BG('url(#grid)');
    h += `<path d="M760 -100 L1160 -100 L1340 1000 L580 1000 Z" fill="#FFF3C8" opacity=".14"/><ellipse cx="960" cy="${sy}" rx="260" ry="50" fill="#FFF3C8" opacity=".2"/>`;
    h += SOC({ t, seed: 3500, x: sx, y: sy, s: ss, ex: exprAt([[0, '생각']], t), look: [0, -0.5] });
    h += PA(t, lt, D, 0.1, 960, 150, big(0, 0, [[['왜 이렇게까지', '#fff']], [['질문', YEL], ['을 고집했을까?', '#fff']]], { size: 74, lh: 92 }), {});
    h += qmarks(t, 3501, 5, [560, 300, 800, 300], { size: 60, op: 0.6 });
    return h;
  }
  let h = courtroom(t, k === 4 ? lerp(0, 0.45, prog(lt, 0.4 * D, 0.7 * D)) : 0);
  h += `<rect x="${sx - 170}" y="${sy - 30}" width="340" height="50" rx="8" fill="${MARBLE}" stroke="${INK}" stroke-width="6"/>`;
  if (k === 1) {
    h += SOC({ t, seed: 3500, x: sx, y: sy - 30, s: ss, ex: exprAt([[0, '미소']], t), look: [0, -0.1] });
    h += PA(t, lt, D, 0.05, 1330, 660, label(0, 0, '일흔이 넘은 나이', { size: 38, bg: '#fff' }), {});
    const k1 = easeOut(prog(lt, 0.25 * D, 0.4 * D));
    if (k1 > 0) {
      h += `<g transform="translate(420 300) scale(${r3(k1)} 1)"><rect x="-300" y="-120" width="600" height="300" rx="10" fill="#F4E9D0" stroke="${INK}" stroke-width="7"/><rect x="-320" y="-136" width="30" height="332" rx="12" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/><rect x="290" y="-136" width="30" height="332" rx="12" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/>`;
      h += T8(0, -60, '고발장', { size: 46, fill: '#8A2E26' }) + `<line x1="-220" y1="-36" x2="220" y2="-36" stroke="#8A2E26" stroke-width="4"/>`;
      if (at(lt, 0.42, D)) h += T8(-250, 30, '① 젊은이들을 타락시킴', { anchor: 'start', size: 38 });
      if (at(lt, 0.6, D)) h += T8(-250, 110, '② 나라의 신을 믿지 않음', { anchor: 'start', size: 38 });
      h += `</g>`;
    }
    return h;
  }
  if (k === 2) {
    h += SOC({ t, seed: 3500, x: sx, y: sy - 30, s: ss, pose: '설명', ex: exprAt([[0, '결심']], t), look: [0, -0.2] });
    h += SPK(t, lt, D, 0.3, null, 960, 200, 980, 170, ['묻는 걸 그만두면 풀어 준다 해도,', '나는 멈추지 않겠소.'], shx, shy - 150, { size: 48 });
    if (at(lt, 0.7, D)) for (const [x, y] of [[300, 260], [1640, 300], [520, 420], [1460, 440]]) h += PA(t, lt, D, 0.7 + (x % 7) * 0.01, x, y, T8(0, 0, '!', { size: 64, fill: RED, stroke: INK, sw: 8 }), { bob: 3 });
    h += PA(t, lt, D, 0.04, 1420, 740, label(0, 0, '배심원들 앞에서', { size: 34, bg: '#fff' }), { f2: 0.3 });
    return h;
  }
  if (k === 3) {
    h += SOC({ t, seed: 3500, x: sx, y: sy - 30, s: ss, ex: exprAt([[0, '기본']], t), look: [0, 0.2] });
    const gx = 420, ix = 1500, uy = 900;
    h += urn(gx, uy, 0.95, '#5A4A40', '유죄') + urn(ix, uy, 0.95, '#B8925A', '무죄');
    for (let i = 0; i < 22; i++) { const g = i % 9 < 5, tx = g ? gx : ix, kk = prog(lt, (0.02 + i * 0.012) * D, (0.12 + i * 0.012) * D); if (kk <= 0 || kk >= 1) continue; const x0 = 140 + hash(i * 3.3) * 1640, y0 = 380 + hash(i * 1.7) * 200; h += `<circle cx="${f1(lerp(x0, tx, kk))}" cy="${f1(lerp(y0, uy - 160, kk) - Math.sin(kk * Math.PI) * 140)}" r="12" fill="${g ? '#3A2E26' : '#F4F1EA'}" stroke="${INK}" stroke-width="4"/>`; }
    // tally: guilty passes the half-way line by a hair — 30 votes would have flipped it
    if (at(lt, 0.28, D)) {
      const kb = easeOut(prog(lt, 0.3 * D, 0.5 * D)), X0 = 560, W = 800, op = prog(lt, 0.28 * D, 0.34 * D);
      let g = `<rect x="${X0 - 190}" y="150" width="${W + 300}" height="270" rx="28" fill="#fff" fill-opacity=".94" stroke="${INK}" stroke-width="7"/>`;
      g += T8(X0 - 30, 228, '유죄', { anchor: 'end', size: 44, fill: '#5A4A40' }) + T8(X0 - 30, 338, '무죄', { anchor: 'end', size: 44, fill: '#9A7444' });
      g += `<rect x="${X0}" y="186" width="${f1(W * 0.56 * kb)}" height="60" rx="12" fill="#5A4A40" stroke="${INK}" stroke-width="5"/><rect x="${X0}" y="296" width="${f1(W * 0.44 * kb)}" height="60" rx="12" fill="#D8B27A" stroke="${INK}" stroke-width="5"/>`;
      g += `<line x1="${X0 + W / 2}" y1="166" x2="${X0 + W / 2}" y2="376" stroke="${INK}" stroke-width="5" stroke-dasharray="12 9"/>` + T8(X0 + W / 2, 405, '절반', { size: 26, fill: '#6B6255' });
      if (at(lt, 0.52, D)) {
        const k2 = prog(lt, 0.52 * D, 0.6 * D);
        g += `<rect x="${X0 + W / 2}" y="186" width="${f1(W * 0.06)}" height="60" fill="${RED}" opacity="${r3(0.85 * k2)}"/><rect x="${X0 + W * 0.44}" y="296" width="${f1(W * 0.06)}" height="60" fill="none" stroke="${RED}" stroke-width="5" stroke-dasharray="8 6" opacity="${r3(k2)}"/>`;
        g += `<path d="M${X0 + W * 0.53} 252 Q${X0 + W * 0.6} 272 ${X0 + W * 0.47} 290" fill="none" stroke="${RED}" stroke-width="6" opacity="${r3(k2)}"/><path d="M${X0 + W * 0.47 + 4} 274 L${X0 + W * 0.47} 290 L${X0 + W * 0.47 + 18} 292" fill="none" stroke="${RED}" stroke-width="6" stroke-linecap="round" opacity="${r3(k2)}"/>`;
        g += T8(X0 + W * 0.56 + 60, 228, '30표', { anchor: 'start', size: 40, fill: RED });
      }
      h += fadeG(op, g);
    }
    h += PA(t, lt, D, 0.66, 1560, 560, `<rect x="-250" y="-62" width="500" height="124" rx="30" fill="#fff" stroke="${RED}" stroke-width="7"/>` + T8(0, -6, '30표만 반대로 갔어도', { size: 38, fill: RED }) + T8(0, 40, '무죄', { size: 34, fill: NAVY }), { rot: 2 });
    h += PA(t, lt, D, 0.04, 960, 180, `<g transform="rotate(-6)"><rect x="-170" y="-64" width="340" height="128" rx="14" fill="#fff" fill-opacity=".85" stroke="${RED}" stroke-width="10"/>${T8(0, 30, '유죄', { size: 84, fill: RED })}</g>`, { f2: 0.26 });
    return h;
  }
  // k4: "the unexamined life is not worth living"
  h += `<ellipse cx="${sx}" cy="${sy - 300}" rx="420" ry="460" fill="url(#warm)" opacity="${r3(prog(lt, 0.4 * D, 0.7 * D) * 0.8)}"/>`;
  h += SOC({ t, seed: 3500, x: sx, y: sy - 30, s: ss, ex: exprAt([[0, '결심'], [0.55 * D, '미소']], lt), look: [0, -0.2] });
  h += SPK(t, lt, D, 0.04, 0.48, 520, 250, 620, 156, ['입 다물고 조용히', '살면 되지 않소?'], 360, 330, { size: 44, bg: '#EDEDED' });
  h += PA(t, lt, D, 0.52, 960, 210, `<rect x="-640" y="-110" width="1280" height="230" rx="34" fill="#1B2A44" fill-opacity=".92" stroke="${YEL}" stroke-width="6"/>` + big(0, -16, ['성찰하지 않는 삶은'], { size: 70, sw: 13 }) + big(0, 76, [[['살 가치가 없다', YEL]]], { size: 70, sw: 13 }), {});
  h += PA(t, lt, D, 0.66, 1380, 430, label(0, 0, '『소크라테스의 변명』 38a', { size: 30, bg: '#fff' }), {});
  return h;
}

/* ---------- the prison: dawn, the last day, dusk ---------- */
function cellBg(t, sky) {
  let h = BG('#7E7A72');
  for (let r = 0; r < 12; r++) for (let c = 0; c < 14; c++) { const x = -300 + c * 180 + (r % 2) * 90, y = -60 + r * 84; h += `<rect x="${x}" y="${y}" width="174" height="78" rx="8" fill="${['#8E897F', '#857F74', '#938D82'][(r * 3 + c) % 3]}" stroke="#5E5A52" stroke-width="4"/>`; }
  // high barred window
  h += `<rect x="760" y="170" width="400" height="290" rx="10" fill="${sky.c1}"/>`;
  h += `<defs><linearGradient id="qWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky.c1}"/><stop offset="1" stop-color="${sky.c2}"/></linearGradient></defs><rect x="760" y="170" width="400" height="290" fill="url(#qWin)"/>`;
  if (sky.sun) h += `<circle cx="${sky.sun[0]}" cy="${sky.sun[1]}" r="46" fill="#FFD27A"/><circle cx="${sky.sun[0]}" cy="${sky.sun[1]}" r="140" fill="url(#warm)"/>`;
  if (sky.star) h += sparkle(1080, 230, 0.5, t, '#FFF3B0');
  h += `<path d="M760 420 Q860 380 960 410 Q1060 370 1160 400 L1160 460 L760 460 Z" fill="${sky.hill || '#5E6E58'}"/>`;
  h += `<rect x="760" y="170" width="400" height="290" rx="10" fill="none" stroke="${INK}" stroke-width="12"/>`;
  for (let i = 1; i < 5; i++) h += `<line x1="${760 + i * 80}" y1="170" x2="${760 + i * 80}" y2="460" stroke="#3A3A44" stroke-width="12"/><line x1="${760 + i * 80}" y1="170" x2="${760 + i * 80}" y2="460" stroke="${INK}" stroke-width="3" opacity=".5"/>`;
  // light falling from the window
  h += `<path d="M760 460 L1160 460 L1300 900 L620 900 Z" fill="${sky.light || '#FFF3C8'}" opacity="${sky.lop == null ? 0.12 : sky.lop}"/>`;
  // door with bars (right)
  h += `<rect x="1560" y="360" width="260" height="520" rx="8" fill="#4A3E34" stroke="${INK}" stroke-width="9"/>${[0, 1, 2, 3].map(i => `<line x1="${1600 + i * 60}" y1="400" x2="${1600 + i * 60}" y2="560" stroke="#2A2620" stroke-width="10"/>`).join('')}<rect x="1590" y="390" width="200" height="180" fill="none" stroke="#2A2620" stroke-width="8"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#5E5A52"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  // bench
  h += `<rect x="300" y="790" width="520" height="36" rx="8" fill="#6E5A44" stroke="${INK}" stroke-width="7"/><rect x="330" y="826" width="30" height="54" fill="#5A4A38" stroke="${INK}" stroke-width="5"/><rect x="760" y="826" width="30" height="54" fill="#5A4A38" stroke="${INK}" stroke-width="5"/>`;
  return h;
}
const SKY = {
  dawn: { c1: '#2B3A6E', c2: '#8C8FC9', hill: '#3A4458', light: '#B9C4F0', lop: 0.08, star: 1 },
  day: { c1: '#8FCDF0', c2: '#EAF6FF', hill: '#6E8A5E', sun: [1080, 240], lop: 0.14 },
  dusk: { c1: '#6E6AB8', c2: '#F6A86A', hill: '#4A4A5E', sun: [960, 420], light: '#FFC890', lop: 0.2 },
  night: { c1: '#1E2448', c2: '#5E4E8A', hill: '#2A2E44', light: '#B9A7FF', lop: 0.07, star: 1 }
};
function qcellScene(t, lt, a) {
  const D = D_(a), k = a.k || 0;
  const sky = k === 0 ? SKY.dawn : (k === 1 ? (lt > 0.45 * D ? SKY.day : SKY.dawn) : (k === 2 ? SKY.dusk : SKY.night));
  let h = '';
  const scx = 540, scy = 868, scs = 0.72;
  if (k === 0) {
    h += cellBg(t, sky);
    h += oilLamp(980, 878, true, t);
    const sleep = lt < 0.55 * D;
    h += SOC({ t, seed: 3600, x: scx, y: scy, s: scs, pose: '앉기', ex: sleep ? { expr: '잠', prev: '잠', k: 1, blink: 0 } : exprAt([[0, '미소']], t), noBlink: sleep, look: [0.8, 0], tilt: sleep ? -8 : 0 });
    if (sleep) h += zz(scx + 120, scy - 420, t, '#C9D2F0');
    const walk = prog(lt, 0.3 * D, 0.62 * D), cx = lerp(1700, 1240, easeOut(walk));
    if (walk > 0) h += walk < 1 ? flip(cx, CRITO({ t, seed: 3601, x: cx, y: 900, s: 0.74, pose: walkPose(t * 6, 0.5), ex: exprAt([[0, '걱정']], t), look: [0.8, -0.1] })) : CRITO({ t, seed: 3601, x: cx, y: 900, s: 0.74, pose: '설명', ex: exprAt([[0, '걱정']], t), look: [-0.8, -0.1] });
    if (walk >= 1) h += coinBag(1370, 820, 0.7) + keyG(1450, 760, 0.6, -20);
    h += PA(t, lt, D, 0.04, 960, 90, label(0, 0, '사형 선고 · 감옥', { size: 36, bg: '#fff' }), {});
    h += PA(t, lt, D, 0.4, 900, 545, label(0, 0, '친구 크리톤 · 새벽', { size: 36, bg: YEL }), {});
    h += SPK(t, lt, D, 0.72, null, 1490, 250, 500, 156, ['탈출 준비는', '다 해 뒀네.'], hd(1240, 900, 0.74)[0] + 30, hd(1240, 900, 0.74)[1] - 110, { size: 46 });
    return h;
  }
  if (k === 1) {
    h += cellBg(t, sky);
    const gather = prog(lt, 0.45 * D, 0.6 * D);
    h += shake(SOC, { t, seed: 3600, x: scx, y: scy, s: scs, pose: '앉기', ex: exprAt([[0, '결심'], [0.45 * D, '미소']], lt), look: [0.8, 0] }, t, lt < 0.3 * D);
    if (gather < 1) h += fadeG(1 - gather, CRITO({ t, seed: 3601, x: 1240, y: 900, s: 0.74, pose: '설명', ex: exprAt([[0, '걱정']], t), look: [-0.8, -0.1] }));
    h += SPK(t, lt, D, 0.06, 0.45, 430, 300, 540, 156, ['잘못에 잘못으로', '갚을 수는 없네.'], hd(scx, scy, scs, 40)[0] + 30, hd(scx, scy, scs, 40)[1] - 110, { size: 46 });
    if (gather > 0) {
      h += `<rect x="900" y="800" width="720" height="30" rx="8" fill="#6E5A44" stroke="${INK}" stroke-width="6" opacity="${r3(gather)}"/>`;
      const F = [[CRITO, 1000, 0], [p => CIT(1, p), 1260, 1], [p => CIT(3, p), 1500, 2]];
      F.forEach(([fn, x, i]) => h += fadeG(gather, fn({ t, seed: 3610 + i, x, y: 878, s: 0.66, pose: '앉기', ex: exprAt([[0, i === 1 ? '생각' : '미소']], t), look: [-0.7, -0.1] })));
      for (let i = 0; i < 5; i++) { const kk = ((t * 0.4 + i / 5) % 1), x = lerp(600, 1500, (i % 2 ? kk : 1 - kk)), y = 470 - Math.sin(kk * Math.PI) * 120; h += fadeG(gather * Math.sin(kk * Math.PI), T8(x, y, '?', { size: 56, fill: YEL, stroke: INK, sw: 7 })); }
    }
    h += PA(t, lt, D, 0.66, 960, 90, label(0, 0, '마지막 날까지, 질문과 대화', { size: 38, bg: YEL }), {});
    return h;
  }
  if (k === 2) {
    // dusk: warm light through the window; friends sit quietly together (no cup, nothing shown)
    const z = lerp(1, 1.22, easeInOut(prog(lt, 0, D)));
    let g = cellBg(t, sky);
    g += `<rect x="900" y="800" width="720" height="30" rx="8" fill="#6E5A44" stroke="${INK}" stroke-width="6"/>`;
    g += SOC({ t, seed: 3600, x: scx, y: scy, s: scs, pose: '앉기', ex: exprAt([[0, '미소']], t), look: [0.5, -0.5] });
    [[CRITO, 1000, 0], [p => CIT(1, p), 1260, 1], [p => CIT(3, p), 1500, 2]].forEach(([fn, x, i]) => g += fn({ t, seed: 3610 + i, x, y: 878, s: 0.66, pose: '앉기', ex: exprAt([[0, '기본']], t), look: [-0.7, -0.2] }));
    g += BG('#FF9A5A').replace('/>', ' opacity=".16"/>') + BG('#2A1E3A').replace('/>', ' opacity=".18"/>');
    h += `<g transform="translate(960 330) scale(${r3(z)}) translate(-960 -330)">${g}</g>`;
    h += PA(t, lt, D, 0.1, 960, 90, label(0, 0, '해 질 무렵', { size: 36, bg: '#fff' }), {});
    return h;
  }
  let g = cellBg(t, sky) + BG('#141A2E').replace('/>', ' opacity=".35"/>');
  g += `<rect x="740" y="452" width="440" height="22" rx="6" fill="#857F74" stroke="${INK}" stroke-width="5"/>`;
  h += `<g transform="translate(960 330) scale(1.5) translate(-960 -330)">${g}${PA(t, lt, D, 0.1, 960, 410, glowQ(0, 0, 0.55, t), {})}</g>`;
  h += PA(t, lt, D, 0.4, 960, 760, big(0, 0, [[['질문', YEL], ['은 기술이 아니라,', '#fff']], [['삶을 살피는 방식', YEL]]], { size: 68, lh: 88 }), {});
  return h;
}

/* ---------- ending: the notebook ---------- */
function roomNight(t) {
  let h = BG('url(#nightRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".25"/>');
  h += windowNight(120, 150, 380, 300, t);
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#10152B"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  return h;
}
function deskLamp(x, y, t) { return `<circle cx="${x - 40}" cy="${y + 60}" r="${f1(330 + Math.sin(t * 2) * 8)}" fill="url(#amber)" opacity=".75"/><path d="M${x} ${y + 80} L${x} ${y - 60} L${x - 90} ${y - 140}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${x - 150} ${y - 120} L${x - 40} ${y - 170} L${x - 10} ${y - 100} Z" fill="#FFC56E" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><ellipse cx="${x}" cy="${y + 84}" rx="50" ry="12" fill="#3A3A44" stroke="${INK}" stroke-width="5"/>`; }
function noteBook(x, y, s, txt, n, o = {}) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${o.rot || -2}) scale(${s})"><rect x="-300" y="-180" width="600" height="360" rx="16" fill="#7A4A2A" stroke="${INK}" stroke-width="7"/><rect x="-286" y="-168" width="282" height="336" rx="6" fill="#FFF8E8"/><rect x="4" y="-168" width="282" height="336" rx="6" fill="#FFF8E8"/><line x1="0" y1="-170" x2="0" y2="170" stroke="${INK}" stroke-width="5"/>`;
  for (let i = 0; i < 6; i++) h += `<line x1="-270" y1="${-110 + i * 50}" x2="-20" y2="${-110 + i * 50}" stroke="#D9C9A8" stroke-width="3"/><line x1="20" y1="${-110 + i * 50}" x2="270" y2="${-110 + i * 50}" stroke="#D9C9A8" stroke-width="3"/>`;
  let used = 0;
  txt.forEach((ln, i) => { const take = clamp(n - used, 0, ln.length); used += ln.length; if (take > 0) h += `<text x="${o.right ? 40 : -260}" y="${-120 + i * 50}" font-family="${FONT}" font-weight="700" font-size="40" fill="#2F4AA0">${esc(ln.slice(0, take))}</text>`; });
  return h + `</g>`;
}
const NOTE = ['나는 오늘,', '왜 고개를', '끄덕였지?'];
function qnoteScene(t, lt, a) {
  const D = D_(a), k = a.k || 0;
  let h = roomNight(t);
  const zx = 900, zy = 960, zs = 0.8;
  if (k === 2) {
    // then and now: the same question lantern
    const L = athensBg(t, { olive: false }) + SOC({ t, seed: 3700, x: 480, y: 940, s: 0.7, pose: '들기', ex: exprAt([[0, '미소']], t), look: [0.6, -0.4] }) + glowQ(handG(480, 940, 0.7, P['들기'].hR)[0] + 30, handG(480, 940, 0.7, P['들기'].hR)[1] - 90, 0.6, t);
    let R = roomNight(t) + deskLamp(1700, 640, t) + Z({ t, seed: 3701, x: 1380, y: 960, s: 0.72, pose: '들기', ex: exprAt([[0, '미소']], t), look: [-0.6, -0.4] });
    R += glowQ(handG(1380, 960, 0.72, P['들기'].hR)[0] + 30, handG(1380, 960, 0.72, P['들기'].hR)[1] - 90, 0.6, t + 1);
    h = `<g clip-path="url(#leftHalf)">${L}</g><g clip-path="url(#rightHalf)">${R}</g><line x1="960" y1="-600" x2="960" y2="1680" stroke="${INK}" stroke-width="12"/>`;
    h += PA(t, lt, D, 0.05, 480, 200, label(0, 0, '2,400년 전', { size: 40, bg: YEL }), {}) + PA(t, lt, D, 0.12, 1440, 200, label(0, 0, '오늘 밤', { size: 40, bg: MINT }), {});
    h += PA(t, lt, D, 0.5, 960, 420, `<rect x="-470" y="-90" width="940" height="180" rx="30" fill="#1B2A44" fill-opacity=".92" stroke="${YEL}" stroke-width="6"/>` + big(0, -8, [[['정답', '#fff'], ['이 아니라,', '#fff']]], { size: 54, sw: 11 }) + big(0, 60, [[['그 질문들', YEL]]], { size: 54, sw: 11 }), {});
    return h;
  }
  h += deskLamp(1500, 620, t);
  if (k === 3) {
    h += Z({ t, seed: 3702, x: zx, y: zy, s: zs, pose: '책상', ex: exprAt([[0, '미소']], t), look: [0.3, -0.3] });
    h += deskG(960, 740, 1000);
    const close = easeInOut(prog(lt, 0.15 * D, 0.35 * D));
    h += `<g transform="translate(980 730) scale(${r3(lerp(1, 0.5, close))} 1)"><rect x="-150" y="-20" width="300" height="24" rx="6" fill="#7A4A2A" stroke="${INK}" stroke-width="5"/></g>`;
    const rise = easeOut(prog(lt, 0.35 * D, 0.8 * D));
    h += glowQ(980, lerp(690, 380, rise), lerp(0.2, 0.7, rise), t);
    h += PA(t, lt, D, 0.45, 960, 140, big(0, 0, [[['답 대신, ', '#fff'], ['질문 하나', YEL]]], { size: 72 }), {});
    return h;
  }
  if (k === 1) {
    h += Z({ t, seed: 3702, x: zx, y: zy, s: zs, pose: '턱괴기', ex: exprAt([[0, '생각']], t), look: [0.4, -0.6] });
    h += deskG(960, 740, 1000) + noteBook(1210, 688, 0.28, NOTE, 99, {});
    h += PA(t, lt, D, 0.04, 960, 130, big(0, 0, ['모든 답을 알아야', [['어른', YEL], ['이 되는 건 아니다', '#fff']]], { size: 64, lh: 80 }), {});
    const items = [['모른다고 말하고', '✋', 0.45], ['묻고', '?', 0.62], ['함께 찾기', '👥', 0.76]];
    items.forEach(([s, ic, f], i) => h += PA(t, lt, D, f, 520 + i * 440, 400, `<rect x="-190" y="-50" width="380" height="100" rx="50" fill="${[YEL, MINT, '#7CC7FF'][i]}" stroke="${INK}" stroke-width="6"/>` + T8(0, 16, s, { size: 40 }), {}));
    return h;
  }
  // k0: phone face down, notebook open, write the question
  const flipK = prog(lt, 0.12 * D, 0.24 * D);
  h += Z({ t, seed: 3702, x: zx, y: zy, s: zs, pose: '책상', ex: exprAt([[0, '기본'], [0.3 * D, '결심']], lt), look: [0.4, 0.6] });
  h += deskG(960, 740, 1000);
  if (flipK < 1) h += `<circle cx="1260" cy="700" r="${f1(160 * (1 - flipK))}" fill="url(#screenGlow)"/>`;
  h += phone(1260, 728, 0.3, flipK < 0.5 ? { on: 1, rot: 90 } : { back: 1, rot: 90 });
  const open = easeOut(prog(lt, 0.26 * D, 0.38 * D));
  h += `<g transform="translate(980 726) scale(${r3(lerp(0.5, 1, open))} 1)"><rect x="-150" y="-16" width="300" height="20" rx="6" fill="#FFF8E8" stroke="${INK}" stroke-width="5"/></g>`;
  const n = Math.floor(prog(lt, 0.55 * D, 0.95 * D) * NOTE.join('').length);
  h += PA(t, lt, D, 0.3, 1430, 330, noteBook(0, 0, 0.95, NOTE, n, { right: 0 }), {});
  h += PA(t, lt, D, 0.06, 440, 560, label(0, 0, '검색창 대신, 수첩', { size: 38, bg: YEL }), {});
  return h;
}
function qaskScene(t, lt, a) {
  const D = D_(a);
  let h = roomNight(t) + deskLamp(1660, 620, t);
  h += Z({ t, seed: 3800, x: 760, y: 960, s: 0.8, pose: '손인사', ex: exprAt([[0, '신남']], t), look: [0, -0.1] });
  h += deskG(960, 740, 1000);
  h += noteBook(1130, 690, 0.3, ['?'], 1, { rot: -6, right: 0 });
  h += SPK(t, lt, D, 0.08, null, 1260, 300, 640, 170, ['요즘 품고 있는', '질문 하나는?'], 900, 520, { size: 54 });
  h += PA(t, lt, D, 0.55, 1300, 470, label(0, 0, '댓글로 들려주세요', { size: 40, bg: YEL }), {});
  return h;
}

/* ---------- thanks: Socrates waves too ---------- */
const _thanks11 = thanksScene;
thanksScene = function (t, lt) {
  let h = _thanks11(t, lt);
  h += SOC({ t, seed: 79, x: 1500, y: 960, s: 0.5, pose: '손인사', ex: exprAt([[0, '미소']], t), look: [-0.5, -0.1] });
  return h;
};
