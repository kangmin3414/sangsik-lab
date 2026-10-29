/* ---------- experiment 008 v3: put down other people's ruler ---------- */
Object.assign(CAMS, {
  hook3: [1.0, 1.05, 960, 540], idioms: [1.0, 1.04, 960, 520], salve: [1.0, 1.04, 960, 520], habit: [1.0, 1.05, 960, 540],
  lesson: [1.0, 1.03, 960, 540], oak: [1.0, 1.04, 960, 520], rest: [1.0, 1.05, 960, 540], legs: [1.0, 1.04, 960, 520],
  routine: [1.0, 1.04, 960, 520], sns: [1.0, 1.03, 960, 520], ending: [1.0, 1.05, 960, 540], candle: [1.0, 1.03, 960, 520]
});
P['전화'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [322, 262], [324, 206]], hR: [322, 198] }, LEGS);
P['들기'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [300, 320], [330, 300]], hR: [336, 296] }, LEGS);

/* ---------- the yellow 쓸모 ruler ---------- */
// held in a hand: one end at the hand, pointing along deg (0 = right, -90 = up)
function heldRuler(hx, hy, s, deg) { return `<g transform="translate(${f1(hx)} ${f1(hy)}) rotate(${f1(deg)})">${rulerG(250 * s, 0, s, 0)}</g>`; }
function heldRulerL(hx, hy, s) { return `<g transform="translate(${f1(hx)} ${f1(hy)})">${rulerG(-250 * s, 0, s, 0)}</g>`; }
// vertical height chart; bottom at yb, 2 units = 1 cm
function rulerV(x, yb, hh) {
  let h = `<rect x="${x - 36}" y="${yb - hh}" width="72" height="${hh}" rx="10" fill="#F2D27A" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 1; i * 20 < hh; i++) h += `<line x1="${x - 36}" y1="${yb - i * 20}" x2="${x - 36 + (i % 5 ? 16 : 32)}" y2="${yb - i * 20}" stroke="${INK}" stroke-width="3"/>`;
  return h + `<text x="${x + 10}" y="${yb - hh / 2}" transform="rotate(-90 ${x + 10} ${yb - hh / 2})" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="32" fill="${NAVY}">쓸모</text>`;
}
// a ruler that tips over around its bottom end: k = 0 standing, 1 lying flat to the right
function tipRuler(x, yb, s, k) { const a = lerp(-90, 0, easeInOut(clamp(k, 0, 1))), r = a * Math.PI / 180, L = 250 * s; return `<g transform="translate(${f1(x + Math.cos(r) * L)} ${f1(yb - 18 * s + Math.sin(r) * L)}) rotate(${f1(a)})">${rulerG(0, 0, s, 0)}</g>`; }

/* ---------- small props ---------- */
const BOSS = o => HALO(char(Object.assign({ goggles: 'none', vest: '#5C6B82', patch: false, tee: true, vshade: 'rgba(0,0,0,0.25)', hair: '#2B2B2B', collar: true, tie: '#B83A3A' }, o)));
const MOM = o => HALO(char(Object.assign({ goggles: 'none', vest: '#F2A7B8', patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', longHair: '#4A3426', hair: '#4A3426' }, o)));
const WASH = o => HALO(char(Object.assign({ goggles: 'none', vest: '#D8CBB4', patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', topknot: '#3A2A1E', robe: '#7A6A55' }, o)));
const TRV = o => HALO(char(Object.assign({ goggles: 'none', vest: '#9CC0D8', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', topknot: '#2B2B2B', robe: '#3E6E8E' }, o)));
const SOLD = (c, o) => char(Object.assign({ goggles: 'none', vest: c, patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', topknot: '#2B2B2B' }, o));
function strawHat(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><ellipse cx="0" cy="0" rx="170" ry="34" fill="#D9B86A" stroke="${INK}" stroke-width="7"/><path d="M-90 -6 Q0 -120 90 -6 Z" fill="#E6C77E" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/></g>`; }
function jarG(x, y, s, txt) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-50 -150 L50 -150 L46 -128 Q110 -100 104 -30 Q98 20 60 30 L-60 30 Q-98 20 -104 -30 Q-110 -100 -46 -128 Z" fill="#B5764A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-58" y="-166" width="116" height="22" rx="8" fill="#8A5634" stroke="${INK}" stroke-width="6"/><rect x="-46" y="-96" width="92" height="74" rx="8" fill="#F4E9D0" stroke="${INK}" stroke-width="5"/>${T8(0, -46, txt || '藥', { size: 44 })}</g>`; }
function floss(x, y, s, t) { let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`; for (const [dx, dy, r] of [[-30, 0, 30], [0, -16, 34], [32, -2, 28], [10, 16, 26], [-14, 18, 22]]) h += `<circle cx="${f1(dx + Math.sin(t * 2 + dx) * 2)}" cy="${dy}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="5"/>`; return h + `</g>`; }
function goldBag(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-60 -40 Q-80 40 -40 60 L40 60 Q80 40 60 -40 Q30 -60 0 -56 Q-30 -60 -60 -40 Z" fill="#C9A04A" stroke="${INK}" stroke-width="7"/><path d="M-30 -62 L0 -80 L30 -62" fill="#B8862E" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>${T8(0, 22, '金', { size: 46, fill: '#6A4A12' })}</g>`; }
function scrollG(x, y, s, txt, rot = 0) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})"><rect x="-110" y="-70" width="220" height="140" rx="6" fill="#F4E9D0" stroke="${INK}" stroke-width="6"/><rect x="-126" y="-80" width="18" height="160" rx="8" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/><rect x="108" y="-80" width="18" height="160" rx="8" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/>${T8(0, 18, txt, { size: 52 })}</g>`; }
function boatG(x, y, s, flag, fc) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><line x1="0" y1="-30" x2="0" y2="-330" stroke="${WALNUT}" stroke-width="12"/><path d="M6 -320 L150 -290 L6 -250 Z" fill="${fc}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>${T8(56, -270, flag, { size: 40, fill: '#fff' })}<path d="M-300 -30 L300 -30 Q270 60 200 70 L-200 70 Q-270 60 -300 -30 Z" fill="#8A5A36" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-280 0 L280 0" stroke="${INK}" stroke-width="4" opacity=".4"/></g>`; }
function snow(t, n, seed) { let h = ''; for (let i = 0; i < n; i++) { const k = ((t * 0.07 + hash(seed + i * 1.3)) % 1), x = hash(seed + i * 2.9) * 2000 - 40 + Math.sin(t + i) * 30, y = -40 + k * 1000; h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(4 + hash(i) * 5)}" fill="#fff" opacity=".85"/>`; } return h; }
function palaceMini(x, y, s, c) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-150" y="-140" width="300" height="140" fill="#E8D7B8" stroke="${INK}" stroke-width="7"/><path d="M-200 -130 Q0 -230 200 -130 L170 -170 Q0 -260 -170 -170 Z" fill="${c}" stroke="${INK}" stroke-width="7"/><rect x="-36" y="-90" width="72" height="90" fill="#8A2E26" stroke="${INK}" stroke-width="6"/></g>`; }
function stamp(x, y, txt, s = 1) { const w = txt.length * 30 + 30; return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(-8) scale(${s})"><rect x="${-w / 2}" y="-26" width="${w}" height="52" rx="8" fill="none" stroke="${RED}" stroke-width="6"/>${T8(0, 12, txt, { size: 30, fill: RED })}</g>`; }
function cakeCard(x, y, s, k) { // birthday card with a doodle drawn in progressively (k 0..1)
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-200" y="-150" width="400" height="300" rx="14" fill="#FFF8E8" stroke="${INK}" stroke-width="7"/>`;
  const L = 900, dash = f1(L * clamp(k, 0, 1));
  h += `<path d="M-120 60 L-120 0 L120 0 L120 60 Z M-90 0 L-90 -40 L90 -40 L90 0 M-40 -40 L-40 -80 M0 -40 L0 -90 M40 -40 L40 -80 M-120 30 Q-60 50 0 30 Q60 10 120 30" fill="none" stroke="${PINK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${dash} 2000"/>`;
  if (k > 0.7) h += `<circle cx="140" cy="-100" r="34" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="130" cy="-104" r="4" fill="${INK}"/><circle cx="150" cy="-104" r="4" fill="${INK}"/><path d="M128 -90 Q140 -80 152 -90" fill="none" stroke="${INK}" stroke-width="4"/>`;
  if (k > 0.85) h += T8(0, 120, 'HAPPY BIRTHDAY', { size: 30, fill: '#1F9D6B' });
  return h + `</g>`;
}
function frameG(x, y, s, inner) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-236" y="-186" width="472" height="372" rx="10" fill="#C9A04A" stroke="${INK}" stroke-width="8"/><rect x="-206" y="-156" width="412" height="312" fill="#FFF8E8" stroke="${INK}" stroke-width="5"/>${inner}</g>`; }

/* ---------- animals ---------- */
function duckG(x, y, s, t, o = {}) { // feet at (x, y); o.leg = leg length (normal 50), o.sad
  const L = o.leg || 50, bob = Math.sin(t * 3) * 3;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  for (const lx of [-22, 22]) h += `<line x1="${lx}" y1="${-L}" x2="${lx}" y2="-6" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><line x1="${lx}" y1="${-L}" x2="${lx}" y2="-6" stroke="#F28A2E" stroke-width="7" stroke-linecap="round"/><path d="M${lx - 24} 0 L${lx + 24} 0 L${lx} -14 Z" fill="#F28A2E" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  h += `<g transform="translate(0 ${f1(-L + bob)})"><ellipse cx="0" cy="-60" rx="110" ry="70" fill="#FFD25A" stroke="${INK}" stroke-width="8"/><path d="M-110 -70 Q-150 -100 -140 -40" fill="#FFD25A" stroke="${INK}" stroke-width="7"/><path d="M-30 -60 Q20 -30 60 -66" fill="none" stroke="#E0B23A" stroke-width="8" stroke-linecap="round"/>`;
  h += `<circle cx="80" cy="-150" r="56" fill="#FFD25A" stroke="${INK}" stroke-width="8"/><path d="M122 -150 Q176 -146 170 -128 Q150 -116 122 -130 Z" fill="#F28A2E" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  h += o.sad ? `<path d="M74 -164 Q86 -156 98 -164" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M70 -182 L96 -174" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` : `<circle cx="88" cy="-162" r="8" fill="${INK}"/><circle cx="91" cy="-165" r="3" fill="#fff"/>`;
  if (o.sad) h += `<path d="M104 -150 q6 14 0 22 q-6 -8 0 -22 Z" fill="#9ED8FF" stroke="${INK}" stroke-width="3"/>`;
  return h + `</g></g>`;
}
function craneG(x, y, s, t, o = {}) { // feet at (x, y); o.leg = leg length (normal 240), o.sad
  const L = o.leg || 240;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  for (const lx of [-16, 16]) h += `<line x1="${lx}" y1="${-L}" x2="${lx}" y2="-6" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><line x1="${lx}" y1="${-L}" x2="${lx}" y2="-6" stroke="#8A8F98" stroke-width="6" stroke-linecap="round"/><path d="M${lx - 26} 0 L${lx + 26} 0 M${lx} 0 L${lx - 6} -12" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  h += `<g transform="translate(0 ${-L})"><ellipse cx="0" cy="-60" rx="120" ry="66" fill="#fff" stroke="${INK}" stroke-width="8"/><path d="M-110 -70 Q-170 -70 -190 -20 Q-140 -30 -100 -30 Z" fill="#2B2B2B" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  h += `<path d="M80 -90 Q120 -180 90 -260" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M80 -90 Q120 -180 90 -260" fill="none" stroke="#fff" stroke-width="20" stroke-linecap="round"/><path d="M98 -200 Q112 -230 96 -258" fill="none" stroke="#2B2B2B" stroke-width="12" stroke-linecap="round"/>`;
  h += `<circle cx="96" cy="-284" r="40" fill="#fff" stroke="${INK}" stroke-width="7"/><ellipse cx="96" cy="-318" rx="18" ry="10" fill="${RED}" stroke="${INK}" stroke-width="4"/><path d="M130 -290 L210 -276 L130 -270 Z" fill="#9A8F7A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  h += o.sad ? `<path d="M96 -290 Q108 -282 120 -290" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M114 -278 q6 14 0 22 q-6 -8 0 -22 Z" fill="#9ED8FF" stroke="${INK}" stroke-width="3"/>` : `<circle cx="110" cy="-292" r="7" fill="${INK}"/>`;
  return h + `</g></g>`;
}
function frogWell(x, y, s, t) { const pk = Math.max(0, Math.sin(t * 2)) * 10; return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><ellipse cx="0" cy="40" rx="130" ry="40" fill="#5A6470" stroke="${INK}" stroke-width="7"/><path d="M-130 40 L-130 110 Q0 150 130 110 L130 40" fill="#9AA3AE" stroke="${INK}" stroke-width="7"/><path d="M-130 70 Q0 108 130 70 M-60 50 L-60 130 M40 52 L40 138" fill="none" stroke="${INK}" stroke-width="4" opacity=".5"/><g transform="translate(0 ${f1(10 - pk)})"><ellipse cx="0" cy="30" rx="66" ry="40" fill="#6DBE55" stroke="${INK}" stroke-width="6"/><circle cx="-30" cy="-2" r="20" fill="#6DBE55" stroke="${INK}" stroke-width="5"/><circle cx="30" cy="-2" r="20" fill="#6DBE55" stroke="${INK}" stroke-width="5"/><circle cx="-30" cy="-2" r="8" fill="${INK}"/><circle cx="30" cy="-2" r="8" fill="${INK}"/><path d="M-20 40 Q0 50 20 40" fill="none" stroke="${INK}" stroke-width="4"/></g><ellipse cx="0" cy="40" rx="130" ry="40" fill="none" stroke="${INK}" stroke-width="7"/><path d="M-130 40 Q0 80 130 40" fill="#5A6470" stroke="${INK}" stroke-width="7"/></g>`; }
function monkeyG(x, y, s, t) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(Math.sin(t * 2) * 4)}) scale(${s})"><circle cx="-92" cy="-10" r="34" fill="#9A6A44" stroke="${INK}" stroke-width="6"/><circle cx="92" cy="-10" r="34" fill="#9A6A44" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="0" r="96" fill="#9A6A44" stroke="${INK}" stroke-width="7"/><path d="M-62 20 Q-66 -50 -18 -40 Q0 -30 18 -40 Q66 -50 62 20 Q60 76 0 80 Q-60 76 -62 20 Z" fill="#F1D3B0" stroke="${INK}" stroke-width="5"/><circle cx="-26" cy="-4" r="9" fill="${INK}"/><circle cx="26" cy="-4" r="9" fill="${INK}"/><path d="M-20 44 Q0 58 20 44" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/></g>`; }
function fruitTree(x, y, s, t, c, k) { // k 0..1: fruit picked, a branch snapped
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-24 0 L-16 -200 L16 -200 L24 0 Z" fill="#6E4A30" stroke="${INK}" stroke-width="7"/>`;
  const br = clamp((k - 0.45) / 0.25, 0, 1);
  h += `<path d="M10 -170 L130 -240" stroke="#6E4A30" stroke-width="18" stroke-linecap="round"/>`;
  h += `<g transform="rotate(${f1(br * 55)} 130 -240)"><path d="M130 -240 L220 -290" stroke="#6E4A30" stroke-width="14" stroke-linecap="round"/><circle cx="230" cy="-300" r="44" fill="#5E8C4E" stroke="${INK}" stroke-width="6"/></g>`;
  if (br > 0) h += `<path d="M122 -252 l14 10 l-6 6 l14 8" fill="none" stroke="${RED}" stroke-width="5" stroke-linecap="round" opacity="${f1(br * 100) / 100}"/>`;
  h += `<circle cx="0" cy="-280" r="120" fill="#5E8C4E" stroke="${INK}" stroke-width="7"/><circle cx="-30" cy="-300" r="70" fill="#76A862"/>`;
  [[-60, -300], [30, -330], [60, -250], [-20, -230], [-80, -240]].forEach(([fx, fy], i) => {
    const pk = clamp((k - i * 0.08) / 0.3, 0, 1);
    h += `<circle cx="${f1(fx - pk * 160)}" cy="${f1(fy - pk * 140)}" r="20" fill="${c}" stroke="${INK}" stroke-width="5" opacity="${f1((1 - pk) * 100) / 100}"/>`;
    if (pk > 0 && pk < 1) h += `<circle cx="${f1(fx - pk * 160 - 20)}" cy="${f1(fy - pk * 140 - 6)}" r="18" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
  });
  return h + `</g>`;
}
// the big shrine oak (櫟社樹): huge, twisted, alive; o.face for the dream, o.rope for the shrine rope
function oakG(x, y, s, t, o = {}) {
  const sw = Math.sin(t * 0.6) * 1.2;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  h += `<path d="M-110 -380 Q-260 -420 -390 -560 M110 -380 Q270 -430 410 -560 M0 -420 Q-20 -560 10 -700" fill="none" stroke="${INK}" stroke-width="58" stroke-linecap="round"/><path d="M-110 -380 Q-260 -420 -390 -560 M110 -380 Q270 -430 410 -560 M0 -420 Q-20 -560 10 -700" fill="none" stroke="#6E4A30" stroke-width="44" stroke-linecap="round"/>`;
  h += `<path d="M-250 0 Q-160 -30 -150 -120 Q-136 -300 -116 -430 L116 -430 Q136 -300 150 -120 Q160 -30 250 0 Z" fill="#6E4A30" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>`;
  h += `<path d="M-80 -40 Q-66 -200 -90 -390 M10 -30 Q22 -200 0 -410 M90 -50 Q76 -220 96 -390" fill="none" stroke="${INK}" stroke-width="5" opacity=".3"/><ellipse cx="-60" cy="-120" rx="22" ry="30" fill="#4A3020" stroke="${INK}" stroke-width="5"/>`;
  h += `<g transform="rotate(${f1(sw)} 0 -420)">`;
  const C = [[-470, -600, 180], [-260, -760, 220], [10, -830, 250], [290, -760, 230], [500, -610, 180], [-160, -560, 200], [180, -560, 200], [10, -660, 230]];
  for (const [cx, cy, r] of C) h += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${o.night ? '#2E4A3A' : '#4E7A40'}" stroke="${INK}" stroke-width="9"/>`;
  for (const [cx, cy, r] of C) h += `<circle cx="${cx - r * 0.2}" cy="${cy - r * 0.25}" r="${f1(r * 0.55)}" fill="${o.night ? '#3E6050' : '#6A9A52'}"/>`;
  h += `</g>`;
  if (o.rope) { h += `<path d="M-142 -300 Q0 -270 142 -300" fill="none" stroke="#F4E9D0" stroke-width="12"/><path d="M-142 -300 Q0 -270 142 -300" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="10 10"/>`; for (let i = 0; i < 5; i++) h += `<path d="M${-90 + i * 45} ${-284 + Math.abs(i - 2) * 4} l10 18 l-10 10 l10 18" fill="none" stroke="#fff" stroke-width="6"/>`; }
  if (o.face) {
    const op = clamp(o.face, 0, 1), m = 6 + (o.talk || 0) * 26;
    h += `<g opacity="${f1(op * 100) / 100}"><ellipse cx="-50" cy="-260" rx="30" ry="22" fill="#FFF3B0" stroke="${INK}" stroke-width="6"/><ellipse cx="50" cy="-260" rx="30" ry="22" fill="#FFF3B0" stroke="${INK}" stroke-width="6"/><circle cx="-44" cy="-258" r="10" fill="${INK}"/><circle cx="56" cy="-258" r="10" fill="${INK}"/><path d="M-80 -300 Q-50 -316 -20 -302 M20 -302 Q50 -316 80 -300" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><ellipse cx="0" cy="-180" rx="40" ry="${f1(m)}" fill="#2E1E14" stroke="${INK}" stroke-width="6"/></g>`;
  }
  return h + `</g>`;
}

/* ---------- hook: the day off, measured ---------- */
function hook3Scene(t, lt, a) {
  const D = D_(a);
  let h = livingRoom(t, false);
  if (!a.k) {
    h += sofa(560, 680);
    h += Z({ t, seed: 900, x: 870, y: 910, s: 0.78, pose: '폰보기', ex: exprAt([[0, '기본'], [0.5 * D, '걱정']], lt), look: [0, 0.9] });
    const [px, py] = handG(870, 910, 0.78, [200, 318]);
    h += phone(px, py - 6, 0.4, { on: 1 }) + hand(px - 22, py + 8, 0.78) + hand(px + 22, py + 8, 0.78);
    const S = [[0.05, 400, 340, '새벽 5시 기상 인증', MINT, -4], [0.2, 1500, 330, '자격증 3개째', YEL, 3], [0.35, 1520, 560, '10km 러닝 완료', PINK, -2], [0.5, 380, 580, '주말 부업 인증', '#7CC7FF', 3]];
    S.forEach(([f, x, y, txt, c, r]) => { if (lt > f * D) h += pop(t, t - lt + f * D, t + 99, x, y, label(0, 0, txt, { size: 38, bg: c, color: c === PINK ? '#fff' : NAVY }), { rot: r, bob: 4 }); });
    h += pop(t, t - lt + 0.1, t + 99, 960, 140, big(0, 0, [[['오늘 하루, ', '#fff'], ['쓸모 있게', YEL], [' 보냈나요?', '#fff']]], { size: 68, sw: 14 }), {});
    return h;
  }
  if (a.k === 1) {
    h += panel(1060, 120, 620, 720, { r: 40, fill: '#1F2D44' }) + `<rect x="1084" y="150" width="572" height="660" rx="24" fill="#F6F8FB"/>`;
    const posts = [['새벽 5시 기상', MINT], ['자격증 3개째', YEL], ['10km 완주', PINK]];
    posts.forEach(([txt, c], i) => {
      const at = 0.05 * D + i * 0.15 * D; if (lt < at) return;
      const y = 250 + i * 200, k = easeOutBack(clamp((lt - at) / 0.35, 0, 1));
      h += `<g opacity="${f1(clamp(k, 0, 1) * 100) / 100}" transform="translate(0 ${f1((1 - clamp(k, 0, 1)) * 30)})"><rect x="1104" y="${y - 80}" width="532" height="170" rx="18" fill="#fff" stroke="#C9D3DF" stroke-width="4"/>${PT({ t, seed: 980 + i, x: 1180, y: y + 76, s: 0.26, ex: exprAt([[0, '신남']], t), hair: ['#3A2A1E', '#8A5A2E', '#2B2B2B'][i] })}${label(1440, y + 4, txt, { size: 34, bg: c, color: c === PINK ? '#fff' : NAVY })}</g>`;
    });
    const pull = lt > 0.55 * D;
    h += Z({ t, seed: 901, x: 560, y: 940, s: 0.8, pose: pull ? '들기' : '서기', ex: exprAt([[0, '걱정'], [0.55 * D, '결심']], lt), look: [0.7, -0.2] });
    if (pull) { const [hx, hy] = handG(560, 940, 0.8, P['들기'].hR); const k = easeOutBack(prog(lt, 0.55 * D, 0.75 * D)); h += heldRuler(hx, hy, 0.62 * Math.max(0.05, k), -30) + hand(hx, hy, 0.8); }
    if (lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, 520, 200, label(0, 0, '노란 자 · 쓸모 측정기', { size: 40, bg: YEL }), { rot: -3 });
    return h;
  }
  // k2: the chart — friends tower, Zero is 20 cm
  const base = 900, grow = easeOut(prog(lt, 0.05 * D, 0.45 * D));
  h += rulerV(300, base, 720);
  const bars = [[540, 640, '새벽 기상', MINT], [780, 580, '자격증', YEL], [1020, 690, '10km', PINK]];
  bars.forEach(([x, hh, nm, c], i) => {
    const top = base - hh * grow;
    h += `<rect x="${x - 70}" y="${f1(top)}" width="140" height="${f1(hh * grow)}" rx="10" fill="${c}" stroke="${INK}" stroke-width="7"/>`;
    h += PT({ t, seed: 980 + i, x, y: top - 4, s: 0.26, ex: exprAt([[0, '신남']], t), hair: ['#3A2A1E', '#8A5A2E', '#2B2B2B'][i] });
    h += T8(x, 950, nm, { size: 34 });
  });
  const zTop = base - 40 * grow;
  h += `<rect x="1190" y="${f1(zTop)}" width="140" height="${f1(40 * grow)}" rx="8" fill="${TEE}" stroke="${INK}" stroke-width="7"/>` + T8(1260, 950, '제로', { size: 34 });
  h += `<line x1="300" y1="${f1(zTop)}" x2="1190" y2="${f1(zTop)}" stroke="${INK}" stroke-width="4" stroke-dasharray="12 10" opacity="${f1(grow * 0.6 * 100) / 100}"/>`;
  if (lt > 0.4 * D) h += pop(t, t - lt + 0.4 * D, t + 99, 1260, 720, label(0, 0, '쓸모 20cm', { size: 44, bg: TEE, color: '#fff' }), { rot: -4, bob: 3 });
  h += Z({ t, seed: 902, x: 1560, y: 940, s: 0.66, ex: exprAt([[0, '놀람'], [0.45 * D, '지침']], lt), look: [-0.8, 0.5], tilt: lt > 0.45 * D ? -6 : 0 });
  if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 1640, 480, bubble(0, 0, 420, 130, T8(14, 16, '나, 좀 쓸모없나?', { size: 44 })), { bob: 4 });
  return h;
}

/* ---------- the book that gave us the idioms ---------- */
function idiomsScene(t, lt, a) {
  const D = D_(a);
  let h = BG(INKP) + BG('url(#paper)');
  const fly = easeInOut(prog(lt, 0.62 * D, 0.82 * D)), glow = prog(lt, 0.8 * D, 0.95 * D);
  if (glow > 0) h += `<circle cx="960" cy="600" r="${f1(260 + glow * 120)}" fill="url(#warm)" opacity="${f1(glow * 100) / 100}"/>`;
  h += `<g transform="translate(960 600)"><rect x="-156" y="-206" width="312" height="412" rx="14" fill="${INK}" opacity=".25"/><rect x="-160" y="-210" width="312" height="412" rx="14" fill="#3E5C4E" stroke="${INK}" stroke-width="8"/><rect x="-140" y="-210" width="20" height="412" fill="#2E4A3E" stroke="${INK}" stroke-width="5"/><rect x="-60" y="-160" width="120" height="300" rx="6" fill="#F4E9D0" stroke="${INK}" stroke-width="6"/>${T8(0, -70, '莊', { size: 92 })}${T8(0, 60, '子', { size: 92 })}</g>`;
  const items = [[0.05, 430, 420, '우물 안 개구리', (x, y, s) => frogWell(x, y, s, t)], [0.2, 960, 190, '조삼모사', (x, y, s) => monkeyG(x, y, s, t)], [0.35, 1490, 420, '호접몽', (x, y, s) => butterfly(x, y, s * 1.6, t)]];
  items.forEach(([f, x, y, nm, draw], i) => {
    if (lt < f * D || fly >= 1) return;
    const k = easeOutBack(clamp((lt - f * D) / 0.4, 0, 1)), px = lerp(x, 960, fly), py = lerp(y, 600, fly), sc = lerp(0.9, 0.1, fly) * clamp(k, 0, 1.2);
    h += `<g opacity="${f1((1 - fly * 0.6) * 100) / 100}">${draw(px, py, sc)}</g>`;
    if (fly < 0.1) h += label(x, i === 1 ? y + 140 : y + 190, nm, { size: 40, bg: i === 1 ? YEL : MINT });
  });
  if (glow > 0) h += pop(t, t - lt + 0.82 * D, t + 99, 960, 900, label(0, 0, '모두 『장자』에서 나온 말', { size: 42, bg: YEL }), {});
  return h;
}
const i0 = (lt, at) => lt > at;

/* ---------- the king: two beats ---------- */
kingScene = function (t, lt, a) {
  const D = D_(a);
  let h = palace(t);
  h += `<rect x="1300" y="620" width="300" height="260" rx="20" fill="#C9A04A" stroke="${INK}" stroke-width="8"/><rect x="1270" y="520" width="360" height="110" rx="20" fill="#B8862E" stroke="${INK}" stroke-width="8"/>`;
  h += kingG(t, 1450, 900, 0.7);
  h += pop(t, t - lt + 0.1, t + 99, 1450, 200, label(0, 0, '위나라 왕', { size: 36, bg: '#fff' }), {});
  const zx = 560, zs = 0.82;
  h += ZH({ t, seed: 961, x: zx, y: 940, s: zs, pose: a.k ? '손인사' : '서기', ex: exprAt([[0, a.k ? '뿌듯' : '기본']], t), look: [0.7, -0.2], patches: true, tied: true });
  if (!a.k) {
    h += pop(t, t - lt + 0.05 * D, t + 99, 930, 560, label(0, 0, '기운 옷', { size: 40, bg: '#fff' }), { rot: 3 }) + `<line x1="850" y1="575" x2="${zx + 40}" y2="${f1(940 - zs * 220)}" stroke="${INK}" stroke-width="5" stroke-dasharray="10 8" opacity="${f1(prog(lt, 0.05 * D, 0.1 * D) * 100) / 100}"/>`;
    h += pop(t, t - lt + 0.2 * D, t + 99, 960, 820, label(0, 0, '끈으로 동여맨 신발', { size: 40, bg: '#fff' }), { rot: -2 }) + `<line x1="790" y1="830" x2="${zx + 50}" y2="922" stroke="${INK}" stroke-width="5" stroke-dasharray="10 8" opacity="${f1(prog(lt, 0.2 * D, 0.25 * D) * 100) / 100}"/>`;
    if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 0, 0, speech(1240, 330, 580, 120, '어찌 그리 고달파 보이시오?', 1420, 470), { noPop: true, inDur: 0.3 });
    return h;
  }
  h += pop(t, t - lt + 0.25 * D, t + 99, 0, 0, speech(600, 300, 640, 150, ['가난할 뿐,', '고달픈 건 아닙니다'], 580, 470, { size: 44 }), { noPop: true, inDur: 0.3 });
  if (lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, 980, 660, big(0, 0, [[['가난', '#fff'], [' ≠ ', YEL], ['고달픔', '#fff']]], { size: 76 }), {});
  return h;
};

/* ---------- the turtle: the question, with both answers on screen ---------- */
const _turtV2 = turtleScene;
turtleScene = function (t, lt, a) {
  const D = D_(a);
  if (a.k !== 1) return _turtV2(t, lt, a);
  let h = inkBg(t, { ground: false, sx: 1640, sy: 200 });
  h += water(t, 760, '#9CC9DE', '#7DB0CC');
  h += `<path d="M-600 760 L820 760 Q880 800 820 880 L-600 900 Z" fill="#A9B98F" stroke="${INK}" stroke-width="6"/>`;
  const zx = 660, zy = 840, zs = 0.72;
  h += ZH({ t, seed: 1000, x: zx, y: zy, s: zs, pose: '낚시', ex: exprAt([[0, '기본']], t), look: [-0.6, 0] });
  const [rx, ry] = handG(zx, zy, zs, P['낚시'].hR);
  h += `<path d="M${f1(rx)} ${f1(ry)} Q${f1(rx + 260)} ${f1(ry - 300)} ${f1(rx + 480)} ${f1(ry - 260)}" fill="none" stroke="${WALNUT}" stroke-width="10" stroke-linecap="round"/><path d="M${f1(rx + 480)} ${f1(ry - 260)} L${f1(rx + 500)} ${f1(800 + Math.sin(t * 2) * 6)}" stroke="${INK}" stroke-width="2"/><circle cx="${f1(rx + 500)}" cy="${f1(800 + Math.sin(t * 2) * 6)}" r="9" fill="${RED}" stroke="${INK}" stroke-width="3"/>`;
  for (let i = 0; i < 2; i++) h += OF({ t, seed: 1001 + i, x: 360 - i * 170, y: 880, s: 0.6, pose: '서기', ex: exprAt([[0, '결심']], t), look: [0.8, -0.1] });
  h += pop(t, t - lt + 0.08 * D, t + 99, 1500, 470, shrineBox(0, 0, 0.55, t), {});
  h += pop(t, t - lt + 0.12 * D, t + 99, 1500, 170, label(0, 0, '죽은 지 3천 년 된 거북', { size: 36, bg: '#fff' }), {});
  if (lt > 0.5 * D) { h += pop(t, t - lt + 0.5 * D, t + 99, 1500, 880, mudPond(0, 0, 230) + turtleG(0, -30, 0.7, t, true), { noPop: true, inDur: 0.4 }); h += pop(t, t - lt + 0.55 * D, t + 99, 1500, 700, label(0, 0, '살아서 진흙 속에서', { size: 36, bg: MINT }), {}); }
  const zHead = [zx, zy - 400 * zs];
  if (lt > 0.42 * D) h += pop(t, t - lt + 0.42 * D, t + 99, 0, 0, speech(760, 190, 640, 150, ['죽어서 모셔질까,', '살아서 꼬리를 끌까?'], zHead[0] + 10, zHead[1] - 20, { size: 40 }), { noPop: true, inDur: 0.3 });
  return h;
};

/* ---------- Huizi carries the ruler ---------- */
hzScene = function (t, lt, a) {
  const D = D_(a);
  let h = inkBg(t, { sx: 300, sy: 190 });
  h += `<g transform="translate(1480 880)"><rect x="-260" y="-260" width="520" height="260" fill="#E8D7B8" stroke="${INK}" stroke-width="7"/><path d="M-330 -250 Q0 -360 330 -250 L290 -300 Q0 -400 -290 -300 Z" fill="#5A4A6A" stroke="${INK}" stroke-width="7"/><rect x="-60" y="-160" width="120" height="160" fill="#8A2E26" stroke="${INK}" stroke-width="6"/></g>`;
  if (!a.k) {
    h += ZH({ t, seed: 962, x: 520, y: 940, s: 0.78, ex: exprAt([[0, '뿌듯']], t), look: [0.8, -0.2] });
    h += HZ({ t, seed: 963, x: 1060, y: 940, s: 0.82, ex: exprAt([[0, '결심']], t), look: [-0.6, -0.2] });
    const [hx, hy] = handG(1060, 940, 0.82, P['서기'].hR); h += heldRuler(hx, hy + 10, 0.5, -68) + hand(hx, hy, 0.82);
    h += pop(t, t - lt + 0.55 * D, t + 99, 1060, 420, label(0, 0, '혜자 · 위나라 재상', { size: 42, bg: '#9DB8D9' }), {});
    if (lt > 0.05 * D) h += pop(t, t - lt + 0.05 * D, t + 99, 960, 140, big(0, 0, [[['평생의 ', '#fff'], ['단짝이자 맞수', YEL]]], { size: 76 }), {});
    return h;
  }
  const ping = lt > 0.6 * D, hx0 = 1240;
  h += ZH({ t, seed: 962, x: 520, y: 940, s: 0.78, pose: ping ? '만세' : '서기', ex: exprAt([[0, '기본'], [0.6 * D, '신남']], lt), look: [0.8, -0.2] });
  h += flip(hx0, HZ({ t, seed: 963, x: hx0, y: 940, s: 0.82, pose: '가리키기', ex: exprAt([[0, '결심']], t), look: [0.7, -0.2] }));
  const [px, py] = handG(hx0, 940, 0.82, P['가리키기'].hR); h += heldRulerL(2 * hx0 - px, py, 0.5);
  h += pop(t, t - lt + 0.1 * D, t + 99, 0, 0, speech(1300, 290, 560, 120, '그게 무슨 쓸모가 있나?', 1250, 470), { noPop: true, inDur: 0.3 });
  if (ping) h += pop(t, t - lt + 0.6 * D, t + 99, 0, 0, speech(520, 260, 520, 120, '쓸모없어서 좋은데?', 520, 480), { noPop: true, inDur: 0.3 });
  return h;
};

/* ---------- myth: not laziness — not one ruler ---------- */
mythScene = function (t, lt, a) {
  const D = D_(a), x = prog(lt, 0.4 * D, 0.47 * D);
  let h = '';
  if (x < 1) {
    let g = BG(INKP) + BG('url(#paper)');
    g += panel(200, 220, 680, 560, { fill: '#EDE6D3' }) + panel(1040, 220, 680, 560, { fill: '#E3F0DA' });
    g += sofa(240, 520);
    g += Z({ t, seed: 911, x: 540, y: 760, s: 0.55, pose: '폰보기', ex: exprAt([[0, '지침']], t), look: [0, 0.9] }) + phone(...handG(540, 760, 0.55, [200, 318]), 0.28, { on: 1 });
    g += T8(540, 300, '할 일 미루며 늘어지기', { size: 40 });
    g += gnarled2(1460, 760, 0.42, t) + Z({ t, seed: 912, x: 1240, y: 760, s: 0.5, ex: exprAt([[0, '신남']], t), look: [0.4, -0.8] });
    g += T8(1380, 300, '잣대를 잠시 내려놓기', { size: 40 });
    g += pop(t, t - lt + 0.1, t + 99, 960, 130, big(0, 0, [[['장자', YEL], [' ≠ ', '#fff'], ['게으름', '#fff']]], { size: 76, sw: 15 }), {});
    h += `<g opacity="${f1((1 - x) * 100) / 100}">${g}</g>`;
  }
  if (x > 0) {
    let g = inkBg(t, { sx: 260, sy: 170 });
    const down = easeInOut(prog(lt, 0.55 * D, 0.75 * D));
    g += Z({ t, seed: 910, x: 420, y: 940, s: 0.72, pose: down < 1 ? '손인사' : '서기', ex: exprAt([[0, '결심'], [0.75 * D, '신남']], lt), look: [0.6, 0.2] });
    g += rulerG(lerp(560, 640, down), lerp(560, 930, down), 0.7, lerp(-20, 0, down));
    g += pop(t, t - lt + 0.5 * D, t + 99, 1150, 260, big(0, 0, [[['세상이 쥐여 준 ', '#fff']], [['잣대 하나', YEL], ['로만', '#fff']], [['재지 않기', '#fff']]], { size: 70, sw: 14 }), {});
    h += `<g opacity="${f1(x * 100) / 100}">${g}</g>`;
  }
  return h;
};

/* ---------- title ---------- */
const LIST9C = ['같은 것을 다르게 보기', '누구의 잣대인지 묻기', '남의 잣대로 나를 깎지 않기'];
titleScene = function (t, lt, a) {
  let h = BG('url(#labG)') + BG('url(#grid)');
  h += particles(t, 5, 40, [0, 0, 1920, 1080], MINT, { speed: 40, r: 4, op: 0.6 });
  if (a.list) {
    h += big(960, 130, ['만약에, 장자처럼 남의 잣대를 내려놓는다면?'], { size: 54, sw: 12, fill: YEL });
    LIST9C.forEach((it, i) => {
      const at = 0.15 * (a._dur || 8) + i * 0.6; if (lt < at) return;
      const k = easeOutBack(clamp((lt - at) / 0.4, 0, 1)), y = 320 + i * 160;
      h += `<g opacity="${f1(clamp(k, 0, 1) * 100) / 100}" transform="translate(${f1(lerp(-120, 0, clamp(k, 0, 1)))} 0)">${label(330, y, (i + 1) + '일 차', { size: 44, bg: i === 2 ? YEL : MINT })}${T8(460, y + 20, it, { anchor: 'start', size: 62, fill: '#fff' })}</g>`;
    });
    h += `<ellipse cx="1640" cy="900" rx="220" ry="50" fill="url(#glow)"/>`;
    h += Z({ t, seed: 7, x: 1640, y: 900, s: 0.62, pose: '들기', ex: exprAt([[0, '신남']], lt), look: [-0.6, -0.2] });
    const [hx, hy] = handG(1640, 900, 0.62, P['들기'].hR); h += heldRuler(hx, hy, 0.4, -40) + hand(hx, hy, 0.62);
    return h;
  }
  h += `<ellipse cx="960" cy="900" rx="320" ry="70" fill="url(#glow)"/><ellipse cx="960" cy="900" rx="260" ry="54" fill="#2E4260" stroke="${INK}" stroke-width="8"/>`;
  h += doctor(520, 960, 0.55, { t, expr: '미소', talk: env(t) });
  h += pop(t, t - lt + 0.2, t + 99, 960, 230, big(0, 0, [[['만약에, ', YEL], ['장자처럼', '#fff']], '남의 잣대를 내려놓는다면?'], { size: 88, sw: 18 }), {});
  const drop = 1.4, fall = easeIn(prog(lt, drop, drop + 0.5));
  h += Z({ t, seed: 7, x: 960, y: 890, s: 0.6, pose: lt > drop ? '만세' : '들기', ex: exprAt([[0, '결심'], [drop + 0.3, '신남']], lt) });
  if (lt < drop) { const [hx, hy] = handG(960, 890, 0.6, P['들기'].hR); h += heldRuler(hx, hy, 0.4, -40) + hand(hx, hy, 0.6); }
  else h += rulerG(lerp(1080, 1180, fall), lerp(640, 870, fall), 0.4, lerp(-40, 0, fall));
  if (lt > drop + 0.4) h += pop(t, t - lt + drop + 0.4, t + 99, 1420, 700, label(0, 0, '잣대 실험 3일', { size: 40, bg: YEL }), { rot: 4, bob: 4 });
  return h;
};

/* ---------- chapter cards: three days ---------- */
chapterScene = function (t, lt, a) {
  let h = BG(NAVY) + BG('url(#grid)');
  h += particles(t, 9, 30, [0, 0, 1920, 1080], MINT, { speed: 30, r: 4, op: 0.5 });
  const k = easeOut(prog(lt, 0, 0.6));
  h += `<g opacity="${f1(k * 100) / 100}" transform="translate(${f1((1 - k) * -60)} 0)">`;
  h += big(960, 330, [[[a.n + '일 차', YEL]]], { size: 92, sw: 16 });
  h += big(960, 560, [a.name], { size: a.name.length > 11 ? 96 : 112, sw: 22 });
  h += `</g>`;
  for (let i = 1; i <= 3; i++) h += `<circle cx="${960 + (i - 2) * 80}" cy="700" r="${i === a.n ? 17 : 12}" fill="${i <= a.n ? MINT : '#33465F'}" stroke="${INK}" stroke-width="4"/>`;
  const zx = lerp(-200, 2100, prog(lt, 0, 6));
  h += Z({ t, seed: 9, x: zx, y: 880, s: 0.3, pose: walkPose(t * 9, 0.9), ex: exprAt([[0, '기본']], t) });
  return h;
};

/* ---------- day 1: the gourd (new labels) and the waist float ---------- */
const _gourdV2 = gourdScene;
gourdScene = function (t, lt, a) {
  const D = D_(a);
  if (a.float) {
    let h = inkBg(t, { ground: false, sx: 1600, sy: 210 });
    h += water(t, 760);
    const bob = Math.sin(t * 1.6) * 8, x = 1130 + Math.sin(t * 0.4) * 40, y = 880 + bob;
    h += gourdG(x - 150, y - 120, 0.42, -90) + gourdG(x + 150, y - 120, 0.42, 90);
    h += ZH({ t, seed: 941, x, y, s: 0.62, pose: '둥둥', ex: exprAt([[0, '신남']], t), look: [-0.6, -0.3] });
    h += `<path d="M${f1(x - 120)} ${f1(y - 124)} Q${f1(x)} ${f1(y - 96)} ${f1(x + 120)} ${f1(y - 124)}" fill="none" stroke="#8A6A44" stroke-width="9" stroke-linecap="round"/>`;
    h += water(t + 3, 800, '#7DB7E0', '#5E9CCB').replace(/stroke="#141414" stroke-width="6"/, 'stroke="none"').replace(/fill="#7DB7E0"/, 'fill="#7DB7E0" opacity=".7"');
    h += `<path d="M-600 740 L460 740 Q540 800 460 900 L-600 920 Z" fill="#A9B98F" stroke="${INK}" stroke-width="6"/>`;
    h += HZ({ t, seed: 945, x: 250, y: 880, s: 0.7, ex: exprAt([[0, '놀람']], t), look: [0.8, -0.1] });
    if (lt > 0.1 * D) h += pop(t, t - lt + 0.1 * D, t + 99, 960, 150, big(0, 0, [[['큰 박 = ', '#fff'], ['허리에 묶는 튜브!', YEL]]], { size: 72, sw: 14 }), {});
    if (lt > 0.52 * D) h += pop(t, t - lt + 0.52 * D, t + 99, 0, 0, speech(1500, 340, 480, 150, ['자네 생각이', '꽉 막혔군'], x + 60, y - 330, { size: 44 }), { noPop: true, inDur: 0.3 });
    return h;
  }
  if (!a.smash) return _gourdV2(t, lt, a);
  let h = inkBg(t, { sx: 1650, sy: 180 });
  const crack = prog(lt, 0.55 * D, 0.75 * D), broken = lt > 0.78 * D;
  if (!broken) h += gourdG(1080, 640, 1.2, 0, { crack });
  else for (let i = 0; i < 5; i++) { const k = easeOut(prog(lt, 0.78 * D, 0.95 * D)); h += `<path d="M0 -60 Q50 -40 60 20 L0 40 Z" transform="translate(${f1(1080 + (i - 2) * 80 * (1 + k))} ${f1(760 + k * 50 + (i % 2) * 30)}) rotate(${f1((i - 2) * 50 * k)})" fill="#D9B44A" stroke="${INK}" stroke-width="6"/>`; }
  h += pop(t, t - lt + 0.08 * D, t + 99, 1470, 330, label(0, 0, '물을 담으면 무거워 못 들고', { size: 38, bg: '#fff' }), { rot: 2 });
  if (lt > 0.32 * D) h += pop(t, t - lt + 0.32 * D, t + 99, 1470, 440, label(0, 0, '쪼개면 납작해 바가지도 못 해', { size: 38, bg: '#fff' }), { rot: -2 });
  h += HZ({ t, seed: 943, x: 560, y: 930, s: 0.78, pose: broken ? '만세' : '서기', ex: exprAt([[0, '걱정'], [0.55 * D, '화남']], lt), look: [0.7, -0.2] });
  if (broken) h += pop(t, t - lt + 0.8 * D, t + 99, 560, 300, big(0, 0, ['쓸모없어!'], { size: 64, sw: 12, fill: YEL }), { rot: -5 });
  return h;
};

/* ---------- day 1: the salve for chapped hands ---------- */
function riverBank(t, o = {}) {
  let h = o.winter ? BG('#C9D8E6') + `<circle cx="1600" cy="180" r="70" fill="#F4F6FA" opacity=".8"/>` : inkBg(t, { ground: false, sx: 1600, sy: 190 });
  h += water(t, o.wy || 780, o.winter ? '#A9C6DA' : '#9CC9DE', o.winter ? '#8AB0C8' : '#7DB0CC');
  const bx = o.bankX || 760;
  if (!o.noBank) h += `<path d="M-600 770 L${bx} 770 Q${bx + 100} 810 ${bx + 20} 900 L-600 920 Z" fill="${o.winter ? '#E6EDF3' : '#A9B98F'}" stroke="${INK}" stroke-width="6"/>`;
  return h;
}
function salveScene(t, lt, a) {
  const D = D_(a);
  if (!a.k) {
    let h = riverBank(t, { wy: 790, bankX: 300 });
    h += jarG(170, 880, 0.8) + pop(t, t - lt + 0.18 * D, t + 99, 200, 620, label(0, 0, '손 안 트는 약', { size: 38, bg: YEL }), {});
    [[620, 0.62, 0], [900, 0.52, 1], [1180, 0.62, 2]].forEach(([x, s, i]) => {
      const y = 900; h += WASH({ t, seed: 1200 + i, x, y, s, pose: '웅크림', ex: exprAt([[0, '뿌듯']], t), look: [0.6, 0.6] });
      const [hx, hy] = handG(x, y, s, P['웅크림'].hR); h += floss(hx + 40 * s, hy + 26 * s + Math.sin(t * 3 + i) * 5, s * 0.9, t + i);
      for (let j = 0; j < 3; j++) { const k = (t * 0.8 + j / 3 + i * 0.2) % 1; h += `<path d="M${f1(hx - 30 + j * 18)} ${f1(hy - 30 - k * 40)} l5 -10 l5 10 z" fill="${YEL}" opacity="${f1((1 - k) * 100) / 100}"/>`; }
    });
    h += water(t + 3, 812, '#9CC9DE', '#7DB0CC').replace(/stroke="#141414" stroke-width="6"/, 'stroke="none"').replace(/fill="#9CC9DE"/, 'fill="#9CC9DE" opacity=".6"');
    h += pop(t, t - lt + 0.45 * D, t + 99, 900, 170, label(0, 0, '송나라 · 대대로 솜 빨래', { size: 40, bg: '#fff' }), {});
    return h;
  }
  if (a.k === 1) {
    let h = inkBg(t, { sx: 1600, sy: 190 });
    h += palaceMini(1660, 700, 0.9, '#8A2E26') + pop(t, t - lt + 0.45 * D, t + 99, 1660, 360, label(0, 0, '오나라 왕', { size: 38, bg: '#fff' }), {});
    h += WASH({ t, seed: 1200, x: 380, y: 880, s: 0.7, pose: '내밀기', ex: exprAt([[0, '놀람'], [0.3 * D, '신남']], lt), look: [0.8, -0.2] });
    const walk = prog(lt, 0.45 * D, D), tx = lerp(720, 1360, easeInOut(walk)), ts = 0.7;
    h += TRV({ t, seed: 1210, x: tx, y: 880, s: ts, pose: walk > 0 && walk < 1 ? walkPose(t * 7, 0.6) : (lt < 0.45 * D ? '내밀기' : '서기'), ex: exprAt([[0, '결심'], [0.3 * D, '뿌듯']], lt), look: walk > 0 ? [0.8, 0] : [-0.8, -0.1] });
    h += strawHat(tx, 880 - 500 * ts, ts * 0.9);
    if (lt < 0.45 * D) { h += pop(t, t - lt + 0.05 * D, t + 99, 560, 600, goldBag(0, 0, 0.8), {}) + pop(t, t - lt + 0.12 * D, t + 99, 560, 470, label(0, 0, '백 금', { size: 40, bg: YEL }), {}); }
    if (lt > 0.25 * D) h += pop(t, t - lt + 0.25 * D, t + 99, tx + 120, 720, scrollG(0, 0, 0.42, '秘方', -8), { noPop: lt > 0.45 * D });
    if (walk > 0.05) h += `<path d="M${f1(tx + 200)} 640 L1480 640" stroke="${INK}" stroke-width="6" stroke-dasharray="16 12" opacity="${f1(Math.min(1, walk * 3) * 0.7 * 100) / 100}"/>`;
    return h;
  }
  if (a.k === 2) {
    let h = riverBank(t, { winter: 1, wy: 720, noBank: 1 }) + snow(t, 40, 31);
    const run = easeInOut(prog(lt, 0.48 * D, 0.75 * D));
    const wx = lerp(560, 760, run), yx = lerp(1360, 2050, run);
    const crew = (bx, c, wu) => { let g = ''; for (let i = 0; i < 3; i++) g += SOLD(c, { t, seed: 1220 + i + (wu ? 0 : 5), x: bx - 150 + i * 120, y: 690, s: 0.3, ex: exprAt([[0, wu ? '결심' : '겁먹음']], t), look: [wu ? 0.8 : -0.8, 0], shiver: !wu, pose: wu && run > 0.5 ? '만세' : '서기' }); return g; };
    h += crew(wx, '#E07A6A', true) + boatG(wx, 700, 0.62, '吳', '#C8423A');
    h += crew(yx, '#7A9AC8', false) + boatG(yx, 700, 0.62, '越', '#3E5C84');
    h += water(t + 3, 740, '#A9C6DA', '#8AB0C8').replace(/stroke="#141414" stroke-width="6"/, 'stroke="none"').replace(/fill="#A9C6DA"/, 'fill="#A9C6DA" opacity=".65"');
    h += pop(t, t - lt + 0.05 * D, t + 99, 960, 130, big(0, 0, [[['한겨울, ', '#fff'], ['강 위의 싸움', YEL]]], { size: 70 }), {});
    if (lt > 0.18 * D && run < 0.4) { h += pop(t, t - lt + 0.18 * D, t + 99, 560, 300, label(0, 0, '손이 멀쩡한 오나라', { size: 36, bg: MINT }), {}) + pop(t, t - lt + 0.28 * D, t + 99, 1380, 300, label(0, 0, '손이 튼 월나라', { size: 36, bg: '#fff' }), {}); }
    if (lt > 0.78 * D) { h += pop(t, t - lt + 0.78 * D, t + 99, 1300, 400, scrollG(0, 0, 0.9, '땅'), {}) + pop(t, t - lt + 0.82 * D, t + 99, 1300, 560, label(0, 0, '그 사람, 땅을 받다', { size: 40, bg: YEL }), {}); }
    return h;
  }
  // k3: same salve, two lives
  let h = BG(INKP) + BG('url(#paper)');
  h += panel(140, 220, 700, 580, { fill: '#DCEBF2' }) + panel(1080, 220, 700, 580, { fill: '#F2EAD0' });
  h += `<path d="M148 640 Q490 610 832 640 L832 792 L148 792 Z" fill="#9CC9DE"/>`;
  h += WASH({ t, seed: 1201, x: 470, y: 690, s: 0.52, pose: '웅크림', ex: exprAt([[0, '기본']], t), look: [0.6, 0.6] }) + floss(560, 650, 0.6, t);
  h += T8(490, 300, '평생 빨래', { size: 50 });
  for (let i = 0; i < 5; i++) h += `<rect x="${1110 + i * 130}" y="${640 + (i % 2) * 20}" width="110" height="120" fill="${['#B7C98F', '#D9C27A', '#A9B98F'][i % 3]}" stroke="${INK}" stroke-width="4"/>`;
  h += TRV({ t, seed: 1211, x: 1420, y: 700, s: 0.52, pose: '만세', ex: exprAt([[0, '신남']], t), look: [0, -0.3] }) + strawHat(1420, 700 - 500 * 0.52, 0.47);
  h += T8(1430, 300, '땅을 받다', { size: 50 });
  h += pop(t, t - lt + 0.1, t + 99, 960, 540, jarG(0, 60, 0.9) + label(0, -150, '같은 약', { size: 44, bg: YEL }), {});
  if (lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 960, 150, big(0, 0, [[['같은 약, ', '#fff'], ['다른 눈', YEL]]], { size: 80 }), {});
  return h;
}

/* ---------- day 1: Zero's "useless" habits ---------- */
function habitScene(t, lt, a) {
  const D = D_(a);
  if (!a.k) {
    let h = livingRoom(t, false);
    h += Z({ t, seed: 1300, x: 520, y: 950, s: 0.78, pose: '책상', ex: exprAt([[0, '지침']], t), look: [0.6, 0.4] }) + deskG(560, 760, 520);
    h += panel(1000, 110, 760, 700, { r: 20, fill: '#FFFDF5' }) + T8(1380, 210, '쓸모없는 버릇', { size: 54 });
    ['멍때리기', '늦잠', '낙서'].forEach((s, i) => {
      const at = 0.3 * D + i * 0.17 * D; if (lt < at) return;
      const y = 340 + i * 150;
      h += pop(t, t - lt + at, t + 99, 1080, y, T8(0, 18, '□ ' + s, { anchor: 'start', size: 52 }), { noPop: true, inDur: 0.25 });
      h += pop(t, t - lt + at + 0.25, t + 99, 1560, y, stamp(0, 0, '쓸모없음'), {});
    });
    return h;
  }
  if (a.k === 1) {
    const x = prog(lt, 0.42 * D, 0.5 * D);
    let h = '';
    if (x < 1) {
      let g = BG('#E9EEF3') + `<rect x="-600" y="860" width="3120" height="600" fill="#C9D3DF"/><line x1="-600" y1="860" x2="2520" y2="860" stroke="${INK}" stroke-width="6"/>`;
      g += deskG(800, 740, 600) + `<rect x="700" y="700" width="200" height="40" rx="4" fill="#fff" stroke="${INK}" stroke-width="5" transform="rotate(-4 800 720)"/><path d="M730 712 q20 -20 40 0 t40 0 M760 724 l20 6" fill="none" stroke="${PINK}" stroke-width="4"/>`;
      g += Z({ t, seed: 1301, x: 620, y: 950, s: 0.74, ex: exprAt([[0, '당황']], t), look: [0.7, -0.3], sweat: true });
      g += flip(1180, BOSS({ t, seed: 1302, x: 1180, y: 950, s: 0.8, pose: '가리키기', ex: exprAt([[0, '화남']], t), look: [0.7, 0.2] }));
      g += pop(t, t - lt + 0.05 * D, t + 99, 0, 0, speech(1320, 300, 400, 120, '또 낙서야?', 1200, 500), { noPop: true, inDur: 0.3 });
      g += pop(t, t - lt + 0.12 * D, t + 99, 460, 200, label(0, 0, '회사에선 혼나기만', { size: 38, bg: '#fff' }), {});
      h += `<g opacity="${f1((1 - x) * 100) / 100}">${g}</g>`;
    }
    if (x > 0) {
      let g = livingRoom(t, false) + deskG(760, 760, 640);
      g += Z({ t, seed: 1303, x: 520, y: 950, s: 0.74, pose: '책상', ex: exprAt([[0, '신남']], t), look: [0.6, 0.5] });
      g += cakeCard(880, 600, 0.9, prog(lt, 0.52 * D, 0.95 * D));
      g += pop(t, t - lt + 0.55 * D, t + 99, 1420, 240, label(0, 0, '다른 자리: 친구 생일 카드', { size: 40, bg: YEL }), {});
      h += `<g opacity="${f1(x * 100) / 100}">${g}</g>`;
    }
    return h;
  }
  let h = livingRoom(t, false);
  h += frameG(1120, 330, 0.66, cakeCard(0, 0, 0.9, 1));
  h += PT({ t, seed: 1310, x: 1420, y: 940, s: 0.8, pose: '손인사', ex: exprAt([[0, '신남']], t), look: [-0.6, -0.5] });
  h += Z({ t, seed: 1311, x: 560, y: 940, s: 0.74, ex: exprAt([[0, '놀람'], [0.3 * D, '신남']], lt), look: [0.8, -0.3] });
  h += pop(t, t - lt + 0.05 * D, t + 99, 0, 0, speech(1600, 330, 500, 140, ['이거 액자에', '걸어 둘래!'], 1450, 520, { size: 44 }), { noPop: true, inDur: 0.3 });
  if (lt > 0.5 * D) h += pop(t, t - lt + 0.5 * D, t + 99, 560, 300, label(0, 0, '제일 좋아한 선물', { size: 42, bg: YEL }), { rot: -3 });
  return h;
}

/* ---------- day 1: the candle box — empty boxes found the answer twice as often ---------- */
const _candleV1 = candleScene;
candleScene = function (t, lt, a) {
  const D = D_(a);
  if (!a.empty) return _candleV1(t, lt, a);
  let h = BG('#EDE3D0') + BG('url(#paper)');
  h += panel(160, 180, 760, 540, { fill: '#fff' }) + panel(1000, 180, 760, 540, { fill: '#fff' });
  const box = (x, y, full) => `<g transform="translate(${x} ${y})"><rect x="-90" y="-50" width="180" height="100" rx="8" fill="#E8C27A" stroke="${INK}" stroke-width="6"/>${full ? [...Array(12)].map((_, i) => `<circle cx="${-70 + (i % 6) * 28}" cy="${-30 - Math.floor(i / 6) * 14}" r="9" fill="#C9D2DC" stroke="${INK}" stroke-width="3"/>`).join('') : ''}</g>`;
  h += box(540, 380, true) + T8(540, 270, '압정이 담긴 상자', { size: 40 });
  h += box(1300, 380, false) + `<g transform="translate(1520 360)">${[...Array(10)].map((_, i) => `<circle cx="${(i % 5) * 26}" cy="${Math.floor(i / 5) * 26}" r="9" fill="#C9D2DC" stroke="${INK}" stroke-width="3"/>`).join('')}</g>` + T8(1380, 270, '빈 상자 + 압정 따로', { size: 40 });
  const k = easeOut(prog(lt, 0.15 * D, 0.45 * D));
  h += hbar(320, 520, 440, 54, 0.42 * k, PINK, '') + T8(540, 650, '정답 찾은 사람', { size: 36 });
  h += hbar(1160, 520, 440, 54, 0.84 * k, MINT, '') + T8(1380, 650, '정답 찾은 사람', { size: 36 });
  if (lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 1690, 470, big(0, 0, ['×2'], { size: 84, sw: 14, fill: YEL }), { rot: -6 });
  if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 960, 810, label(0, 0, '상자를 \'통\'으로만 보면, 받침대가 안 보인다', { size: 38, bg: YEL }), {});
  return h;
};

/* ---------- lesson cards, one ruler laid down per day ---------- */
const LESSON9 = {
  1: ['쓸모는 물건이 아니라,', [['보는 눈', YEL], ['에 있다', '#fff']]],
  2: ['남의 쓸모에 딱 맞추면,', [['따이고, 꺾인다', YEL]]],
  3: ['짧은 건', [['모자란 게 아니다', YEL]]]
};
function lessonScene(t, lt, a) {
  const D = D_(a);
  let h = BG(NAVY) + BG('url(#grid)') + `<ellipse cx="960" cy="420" rx="700" ry="300" fill="url(#warm)" opacity=".18"/>`;
  h += `<rect x="-600" y="860" width="3120" height="600" fill="#132238"/><line x1="-600" y1="860" x2="2520" y2="860" stroke="${MINT}" stroke-opacity=".3" stroke-width="4"/>`;
  if (a.turn) {
    h += Z({ t, seed: 1400, x: 760, y: 900, s: 0.7, ex: exprAt([[0, '놀람'], [0.55 * D, '결심']], lt), look: [0.5, -0.4], tilt: lt < 0.55 * D ? 10 : 0 });
    h += qmarks(t, 1401, 5, [600, 260, 320, 200], { size: 70 });
    h += pop(t, t - lt + 0.1, t + 99, 1000, 170, big(0, 0, [[['이것도 결국, ', '#fff'], ['\'쓸모\'', YEL], ['를 찾은 것?', '#fff']]], { size: 66 }), {});
    if (lt > 0.55 * D) { const k = easeOut(prog(lt, 0.55 * D, 0.8 * D)); h += `<path d="M1060 640 L${f1(1060 + 420 * k)} 640" stroke="${YEL}" stroke-width="18" stroke-linecap="round"/><path d="M${f1(1060 + 420 * k)} 600 L${f1(1110 + 420 * k)} 640 L${f1(1060 + 420 * k)} 680 Z" fill="${YEL}" stroke="${INK}" stroke-width="5"/>`; h += pop(t, t - lt + 0.6 * D, t + 99, 1270, 520, label(0, 0, '장자는 한 발 더', { size: 44, bg: MINT }), {}); }
    return h;
  }
  h += pop(t, t - lt + 0.05, t + 99, 960, 130, label(0, 0, a.n + '일 차 깨달음', { size: 40, bg: MINT }), {});
  h += pop(t, t - lt + 0.15, t + 99, 960, 330, big(0, 0, LESSON9[a.n], { size: 84, sw: 16, lh: 110 }), {});
  for (let i = 1; i <= 3; i++) {
    const x = 700 + (i - 1) * 260, k = i < a.n ? 1 : (i === a.n ? prog(lt, 0.25 * D, 0.65 * D) : 0);
    h += tipRuler(x, 860, 0.36, k);
    h += T8(x + (k > 0.5 ? 90 : 0), 930, i + '일 차', { size: 28, fill: k > 0.5 ? MINT : '#5A6E8A' });
  }
  h += Z({ t, seed: 1402, x: 1600, y: 900, s: 0.6, pose: lt > 0.65 * D ? '만세' : '서기', ex: exprAt([[0, '결심'], [0.65 * D, '뿌듯']], lt), look: [-0.8, 0.2] });
  return h;
}

/* ---------- day 2: Huizi's taunt ---------- */
const _treeV2 = treeScene;
treeScene = function (t, lt, a) {
  const D = D_(a);
  if (!a.taunt) return _treeV2(t, lt, a);
  let h = inkBg(t, { sx: 1600, sy: 200 });
  h += gnarled2(1000, 900, 0.9, t);
  h += ZH({ t, seed: 924, x: 460, y: 930, s: 0.76, ex: exprAt([[0, '뿌듯']], t), look: [0.7, -0.2] }) + fanG(...handG(460, 930, 0.76, P['서기'].hR), 0.5, -10 + Math.sin(t * 3) * 8);
  const hx0 = 1500;
  h += flip(hx0, HZ({ t, seed: 923, x: hx0, y: 930, s: 0.78, pose: '가리키기', ex: exprAt([[0, '화남']], t), look: [0.7, -0.2] }));
  const [px, py] = handG(hx0, 930, 0.78, P['가리키기'].hR); h += heldRulerL(2 * hx0 - px, py, 0.45);
  h += pop(t, t - lt + 0.05 * D, t + 99, 0, 0, speech(1420, 240, 640, 150, ['자네 말이 딱 그래.', '크기만 하고 쓸모가 없어!'], 1480, 520, { size: 42 }), { noPop: true, inDur: 0.3 });
  return h;
};

/* ---------- day 2: the shrine oak and the carpenter's dream ---------- */
function oakScene(t, lt, a) {
  const D = D_(a);
  if (!a.k) {
    let h = inkBg(t, { sx: 300, sy: 170, gy: 900 });
    h += oakG(1220, 900, 0.62, t, { rope: 1 });
    h += `<g transform="translate(1220 900)"><rect x="-70" y="-60" width="140" height="60" fill="#B8B4A8" stroke="${INK}" stroke-width="6"/><rect x="-90" y="-76" width="180" height="20" fill="#8A2E26" stroke="${INK}" stroke-width="5"/></g>`;
    for (let i = 0; i < 5; i++) h += char({ t, seed: 1500 + i, x: 820 + i * 70 + (i > 2 ? 520 : 0), y: 905, s: 0.2, goggles: 'none', vest: ['#C9B8A0', '#9CC0D8', '#E0A0A0', '#B7C98F', '#D9C27A'][i], patch: false, tee: true, topknot: '#2B2B2B', look: [i > 2 ? -0.6 : 0.6, -0.9], ex: exprAt([[0, '놀람']], t) });
    const walk = prog(lt, 0.15 * D, 0.85 * D), cx = lerp(80, 560, walk);
    h += carpenter(t, cx, 930, 0.62, lt);
    h += pop(t, t - lt + 0.1 * D, t + 99, 330, 220, label(0, 0, '목수 석(匠石)', { size: 40, bg: YEL }), {});
    h += pop(t, t - lt + 0.45 * D, t + 99, 1240, 90, label(0, 0, '사당 옆 거대한 상수리나무', { size: 38, bg: '#fff' }), {});
    return h;
  }
  if (a.k === 1) {
    let h = inkBg(t, { sx: 300, sy: 170, gy: 900 });
    h += `<g opacity=".45">${oakG(1700, 900, 0.5, t)}</g>`;
    h += char({ t, seed: 920, x: 460, y: 940, s: 0.8, goggles: 'none', vest: '#B88A5A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', topknot: '#3A2A1E', robe: '#6A4529', beard: '#3A2A1E', pose: '가리키기', ex: exprAt([[0, '결심']], t), look: [0.7, -0.2] });
    h += panel(860, 130, 900, 560, { r: 24, fill: '#FFFDF5' });
    const rows = [['배를 만들면 가라앉고', 'boat'], ['그릇을 만들면 깨지고', 'bowl'], ['기둥을 세우면 벌레 먹고', 'pillar']];
    rows.forEach(([txt, ic], i) => {
      const at = 0.04 * D + i * 0.24 * D; if (lt < at) return;
      const y = 250 + i * 160, gx = 960;
      let icon = '';
      if (ic === 'boat') icon = `<g transform="rotate(18)"><path d="M-60 -10 L60 -10 Q50 20 30 26 L-30 26 Q-50 20 -60 -10 Z" fill="#8A5A36" stroke="${INK}" stroke-width="5"/></g><path d="M-70 14 q20 -10 40 0 t40 0 t40 0" fill="none" stroke="#5E9CCB" stroke-width="6"/>`;
      if (ic === 'bowl') icon = `<path d="M-60 -20 L60 -20 Q56 40 0 44 Q-56 40 -60 -20 Z" fill="#C9A06A" stroke="${INK}" stroke-width="5"/><path d="M-10 -20 L4 6 L-8 20 L6 42" fill="none" stroke="${INK}" stroke-width="5"/>`;
      if (ic === 'pillar') icon = `<rect x="-26" y="-56" width="52" height="112" fill="#B98A5A" stroke="${INK}" stroke-width="5"/><circle cx="-8" cy="-20" r="6" fill="${INK}"/><circle cx="10" cy="14" r="5" fill="${INK}"/><g transform="translate(28 -40)"><ellipse rx="14" ry="9" fill="#4A3828" stroke="${INK}" stroke-width="3"/><path d="M-10 6 l-6 8 M0 8 l0 9 M10 6 l6 8" stroke="${INK}" stroke-width="3"/></g>`;
      h += pop(t, t - lt + at, t + 99, gx, y, icon + xMark(70, -30, 0.35), {});
      h += pop(t, t - lt + at + 0.1, t + 99, 1060, y, T8(0, 16, txt, { anchor: 'start', size: 48 }), { noPop: true, inDur: 0.25 });
    });
    if (lt > 0.76 * D) h += pop(t, t - lt + 0.76 * D, t + 99, 1310, 780, label(0, 0, '쓸모없는 나무(散木)', { size: 44, bg: YEL }), { rot: -2 });
    return h;
  }
  // dream world for k2..k4
  if (a.k === 2 || a.k === 3) {
    let h = BG('url(#dream9)');
    for (let i = 0; i < 40; i++) h += `<circle cx="${f1(hash(i) * 1920)}" cy="${f1(hash(i * 2) * 560)}" r="${f1(2 + hash(i * 3) * 3)}" fill="#fff" opacity="${f1((0.4 + 0.5 * Math.sin(t * 2 + i)) * 100) / 100}"/>`;
    h += ground(880, '#3A4868');
    const talk = Math.min(1, env(t) * 1.4);
    if (a.k === 2) {
      const wake = prog(lt, 0.15 * D, 0.4 * D);
      h += oakG(1300, 880, 0.66, t, { face: wake, talk: wake >= 1 ? talk : 0, night: 1 });
      const zx = 640, zy = 880, zs = 0.52, [hx, hy] = lyingHead(zx, zy, zs);
      h += char({ t, seed: 920, x: zx, y: zy, s: zs, rot: -88, goggles: 'none', vest: '#B88A5A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', topknot: '#3A2A1E', robe: '#6A4529', beard: '#3A2A1E', ex: { expr: '잠', prev: '잠', k: 1, blink: 0 }, noBlink: true });
      h += zz(hx + 10, hy - 90, t, '#C9D2F0');
      if (lt > 0.42 * D) h += pop(t, t - lt + 0.42 * D, t + 99, 0, 0, speech(600, 300, 760, 150, ['너는 나를 무엇에 견주느냐?', '좋은 목재에 견주느냐?'], 1250, 730, { size: 44, bg: '#FFF3B0' }), { noPop: true, inDur: 0.3 });
      return h;
    }
    h += oakG(1560, 880, 0.5, t, { face: 1, talk, night: 1 });
    const pk = prog(lt, 0.15 * D, 0.7 * D);
    h += fruitTree(400, 880, 1.15, t, '#E8D06A', pk) + fruitTree(930, 880, 1.15, t + 1, '#F2A33A', pk);
    h += T8(400, 940, '배나무', { size: 38, fill: '#fff' }) + T8(930, 940, '귤나무', { size: 38, fill: '#fff' });
    if (lt > 0.68 * D) h += pop(t, t - lt + 0.68 * D, t + 99, 680, 160, label(0, 0, '쓸모 때문에 제 삶을 괴롭힌다', { size: 42, bg: YEL }), {});
    return h;
  }
  // k4: the oak towers
  let h = inkBg(t, { sx: 1700, sy: 160, gy: 900 });
  h += oakG(960, 900, 0.82, t, { rope: 1 });
  h += char({ t, seed: 920, x: 520, y: 930, s: 0.34, goggles: 'none', vest: '#B88A5A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', topknot: '#3A2A1E', robe: '#6A4529', beard: '#3A2A1E', ex: exprAt([[0, '놀람']], t), look: [0.6, -0.9] });
  h += pop(t, t - lt + 0.2 * D, t + 99, 960, 160, big(0, 0, ['내가 쓸모 있었다면,', [['이렇게 클 수 있었을까?', YEL]]], { size: 70, sw: 14 }), {});
  return h;
}

/* ---------- day 2: whose voice is the ruler? ---------- */
function restScene(t, lt, a) {
  const D = D_(a);
  let h = livingRoom(t, false);
  if (!a.k) {
    h += sofa(560, 680);
    h += Z({ t, seed: 1600, x: 870, y: 910, s: 0.78, pose: '턱괴기', ex: exprAt([[0, '뿌듯'], [0.6 * D, '걱정']], lt), look: [0.4, -0.4] });
    h += `<g transform="translate(1440 760)"><rect x="-160" y="0" width="320" height="24" rx="6" fill="${WALNUT}" stroke="${INK}" stroke-width="6"/><rect x="-140" y="24" width="20" height="120" fill="#6A4529"/><rect x="120" y="24" width="20" height="120" fill="#6A4529"/></g>`;
    h += `<g transform="translate(1440 700) rotate(-4)"><rect x="-130" y="-70" width="260" height="140" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/>${T8(0, -20, '오늘의 점수', { size: 30 })}<line x1="-60" y1="40" x2="60" y2="40" stroke="${INK}" stroke-width="4"/></g>`;
    h += pop(t, t - lt + 0.12 * D, t + 99, 1440, 560, label(0, 0, '점수 안 매기기', { size: 36, bg: MINT }), {});
    if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 520, 330, bubble(0, 0, 520, 140, T8(14, 16, '이건 시간 낭비야…', { size: 44 }), { right: 1 }), { bob: 4 });
    return h;
  }
  if (a.k === 1) {
    h += Z({ t, seed: 1601, x: 760, y: 950, s: 0.82, pose: '들기', ex: exprAt([[0, '결심']], t), look: [0.6, -0.6] });
    const [hx, hy] = handG(760, 950, 0.82, P['들기'].hR); h += heldRuler(hx, hy, 0.62, -35) + hand(hx, hy, 0.82);
    h += qmarks(t, 1602, 4, [440, 260, 420, 220], { size: 70 });
    h += pop(t, t - lt + 0.25 * D, t + 99, 860, 150, big(0, 0, [[['이건, ', '#fff'], ['누구의 잣대', YEL], ['지?', '#fff']]], { size: 76 }), {});
    return h;
  }
  h = BG('#F3E9DA') + BG('url(#paper)') + `<rect x="-600" y="880" width="3120" height="600" fill="#C9A882"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="6"/>`;
  const cards = [[400, '팀장님', '그 시간에 일을 해!', 0.05], [960, '엄마', '놀면 뭐 하니?', 0.28], [1520, 'SNS', '남들은 다 하는데', 0.5]];
  cards.forEach(([x, who, said, f], i) => {
    if (lt < f * D) return;
    let g = panel(-220, -170, 440, 330, { r: 24, fill: '#FFFDF5' });
    if (i === 0) g += BOSS({ t, seed: 1610, x: -60, y: 150, s: 0.42, ex: exprAt([[0, '결심']], t), look: [0.4, 0] });
    if (i === 1) g += MOM({ t, seed: 1611, x: -60, y: 150, s: 0.42, ex: exprAt([[0, '걱정']], t), look: [0.4, 0] });
    if (i === 2) g += phone(-60, 20, 0.8, { on: 1 }) + heart(-10, -60, 0.5, PINK);
    g += rulerG(110, 40, 0.3, -70);
    g += label(0, -130, who, { size: 34, bg: i === 2 ? '#7CC7FF' : '#fff' });
    h += pop(t, t - lt + f * D, t + 99, x, 330, g, {});
    h += pop(t, t - lt + f * D + 0.2, t + 99, x, 560, label(0, 0, said, { size: 32, bg: '#fff' }), { rot: i % 2 ? 2 : -2 });
  });
  h += Z({ t, seed: 1603, x: 960, y: 960, s: 0.56, ex: exprAt([[0, '놀람'], [0.75 * D, '결심']], lt), look: [0, -0.8] });
  if (lt > 0.75 * D) h += pop(t, t - lt + 0.75 * D, t + 99, 1500, 760, label(0, 0, '제로의 잣대가 아니었다', { size: 40, bg: YEL }), { rot: -2 });
  return h;
}

/* ---------- day 2: leisure-as-waste result card (with anxiety) ---------- */
const _leisV3 = leisureScene;
leisureScene = function (t, lt, a) {
  const D = D_(a);
  if (!a.res) return _leisV3(t, lt, a);
  let h = BG(NAVY) + BG('url(#grid)');
  h += pop(t, t - lt + 0.1, t + 99, 960, 240, big(0, 0, [[['쉼 = 시간 낭비', YEL], ['라고 믿을수록', '#fff']]], { size: 70 }), {});
  const R = [['쉬어도 즐거움', '↓', PINK], ['우울 · 불안 · 스트레스', '↑', '#B9A7FF']];
  R.forEach(([nm, ar, c], i) => { const at = 0.3 * D + i * 0.25 * D; if (lt > at) h += pop(t, t - lt + at, t + 99, 960, 400 + i * 190, `<rect x="-560" y="-70" width="1120" height="140" rx="70" fill="#1B2A44" stroke="${MINT}" stroke-width="4"/>${T8(-500, 20, nm, { anchor: 'start', size: 56, fill: '#fff' })}<circle cx="440" cy="0" r="54" fill="${c}" stroke="${INK}" stroke-width="6"/>${T8(440, 26, ar, { size: 72, fill: NAVY })}`, { noPop: true, inDur: 0.3 }); });
  h += pop(t, t - lt + 0.3, t + 99, 960, 860, label(0, 0, 'Tonietto et al., JESP (2021) · 경향(상관관계)', { size: 30, bg: '#fff' }), {});
  return h;
};

/* ---------- day 3: the duck and the crane ---------- */
function pond(t) { return `<ellipse cx="960" cy="930" rx="1100" ry="70" fill="#9CC9DE" stroke="${INK}" stroke-width="6"/>`; }
function legsScene(t, lt, a) {
  const D = D_(a);
  if (!a.k) {
    let h = inkBg(t, { sx: 1650, sy: 200 });
    h += ZH({ t, seed: 1700, x: 520, y: 930, s: 0.78, pose: lt > 0.75 * D ? '가리키기' : '서기', ex: exprAt([[0, '기본'], [0.75 * D, '뿌듯']], lt), look: [0.7, -0.2] });
    const hx0 = 1340;
    h += flip(hx0, HZ({ t, seed: 1701, x: hx0, y: 930, s: 0.8, pose: '가리키기', ex: exprAt([[0, '결심']], t), look: [0.7, -0.2] }));
    const [px, py] = handG(hx0, 930, 0.8, P['가리키기'].hR); h += heldRulerL(2 * hx0 - px, py, 0.45);
    h += pop(t, t - lt + 0.05 * D, t + 99, 0, 0, speech(1300, 250, 620, 130, '사람은 남들만큼은 해야지!', 1320, 520, { size: 42 }), { noPop: true, inDur: 0.3 });
    return h;
  }
  if (a.k === 1) {
    let h = inkBg(t, { sx: 1650, sy: 200, gy: 900 }) + pond(t);
    const st = easeInOut(prog(lt, 0.1 * D, 0.35 * D)), cut = prog(lt, 0.55 * D, 0.75 * D);
    h += duckG(560, 900, 0.95, t, { leg: lerp(50, 230, st), sad: st > 0.6 });
    if (st > 0 && st < 1) h += `<path d="M470 ${f1(880 - st * 100)} l0 60 m-14 -14 l14 14 l14 -14 M650 ${f1(880 - st * 100)} l0 60 m-14 -14 l14 14 l14 -14" fill="none" stroke="${RED}" stroke-width="6"/>`;
    h += rulerG(330, 760, 0.4, -90);
    h += pop(t, t - lt + 0.12 * D, t + 99, 560, 200, label(0, 0, '짧다고 늘여 주면 → 근심', { size: 40, bg: '#fff' }), {});
    if (lt > 0.48 * D) {
      h += craneG(1360, 900, 0.95, t, { sad: cut > 0.5 });
      h += rulerG(1600, 640, 0.6, -90);
      if (cut > 0) h += `<line x1="1300" y1="${f1(900 - 120 * 0.95)}" x2="${f1(1300 + 140 * cut)}" y2="${f1(900 - 120 * 0.95)}" stroke="${RED}" stroke-width="7" stroke-dasharray="14 10"/>`;
      h += pop(t, t - lt + 0.5 * D, t + 99, 1360, 200, label(0, 0, '길다고 잘라 주면 → 슬픔', { size: 40, bg: '#fff' }), {});
    }
    return h;
  }
  const sw = prog(lt, 0.5 * D, 0.58 * D);
  let h = '';
  if (sw < 1) {
    let g = inkBg(t, { sx: 1650, sy: 200, gy: 900 }) + pond(t);
    g += duckG(640, 900, 0.95, t) + craneG(1300, 900, 0.95, t);
    g += pop(t, t - lt + 0.05, t + 99, 960, 160, big(0, 0, ['긴 것은 남는 게 아니고,', [['짧은 것은 모자란 게 아니다', YEL]]], { size: 64, sw: 13 }), {});
    h += `<g opacity="${f1((1 - sw) * 100) / 100}">${g}</g>`;
  }
  if (sw > 0) {
    let g = inkBg(t, { sx: 300, sy: 190 });
    const ping = Math.sin(t * 3) > 0;
    g += ZH({ t, seed: 1702, x: 620, y: 930, s: 0.78, pose: ping ? '가리키기' : '서기', ex: exprAt([[0, '신남']], t), look: [0.8, -0.2] });
    g += flip(1300, HZ({ t, seed: 1703, x: 1300, y: 930, s: 0.8, pose: ping ? '서기' : '가리키기', ex: exprAt([[0, '신남']], t), look: [0.8, -0.2] }));
    for (let i = 0; i < 4; i++) { const k = (t * 1.5 + i / 4) % 1; g += `<path d="M${f1(900 + i * 34)} ${f1(560 - k * 40)} l20 -30 l-6 24 l22 -10" fill="none" stroke="${YEL}" stroke-width="6" stroke-linecap="round" opacity="${f1((1 - k) * 100) / 100}"/>`; }
    g += pop(t, t - lt + 0.6 * D, t + 99, 960, 180, big(0, 0, [[['오늘도 ', '#fff'], ['티격태격', YEL]]], { size: 70 }), {});
    h += `<g opacity="${f1(sw * 100) / 100}">${g}</g>`;
  }
  return h;
}

/* ---------- day 3: the 5 a.m. routine ---------- */
function routineScene(t, lt, a) {
  const D = D_(a);
  if (!a.k) {
    let h = BG('#E9EEF3') + BG('url(#paper)');
    const P3 = [['05:00 기상', 0.03], ['찬물 샤워', 0.32], ['10km 달리기', 0.6]];
    P3.forEach(([nm, f], i) => {
      if (lt < f * D) return;
      const x = 140 + i * 560;
      let g = panel(0, 0, 520, 600, { r: 24, fill: ['#2A3358', '#DCEBF2', '#E3F0DA'][i] });
      if (i === 0) g += `<g transform="translate(150 200)">${wallClock(0, 0, 80, 5, 0)}</g>` + `<path d="M60 120 l-30 -20 M240 120 l30 -20" stroke="${YEL}" stroke-width="7" stroke-linecap="round"/>` + Z({ t, seed: 1800, x: 340, y: 560, s: 0.5, ex: exprAt([[0, '졸림']], t), look: [-0.4, 0] });
      if (i === 1) { g += `<path d="M300 60 L300 120 L250 120" fill="none" stroke="${INK}" stroke-width="10"/><ellipse cx="240" cy="130" rx="50" ry="20" fill="#9AA3AE" stroke="${INK}" stroke-width="6"/>`; for (let j = 0; j < 8; j++) { const k = (t * 1.6 + j / 8) % 1; g += `<line x1="${200 + j * 12}" y1="${150 + k * 200}" x2="${196 + j * 12}" y2="${170 + k * 200}" stroke="#4E86B8" stroke-width="5"/>`; } g += Z({ t, seed: 1801, x: 240, y: 560, s: 0.5, ex: exprAt([[0, '겁먹음']], t), look: [0, -0.6], shiver: true }); }
      if (i === 2) { g += `<path d="M0 470 L520 470" stroke="#C9A06A" stroke-width="40"/>` + Z({ t, seed: 1802, x: 260, y: 520, s: 0.5, pose: walkPose(t * 12, 1), ex: exprAt([[0, '지침']], t), look: [0.8, 0], sweat: true }); }
      h += pop(t, t - lt + f * D, t + 99, x, 220, g, { noPop: true, inDur: 0.3 });
      h += pop(t, t - lt + f * D + 0.1, t + 99, x + 260, 180, label(0, 0, nm, { size: 40, bg: i === 0 ? YEL : MINT }), {});
    });
    return h;
  }
  if (a.k === 1) {
    let h = BG('url(#morning)') + clouds(t, 90, 16, 3, 5) + ground(880, '#9CCB72') + grassField(t, 900);
    const fx = 1120 + ((lt * 200) % 1100);
    h += PT({ t, seed: 1810, x: fx, y: 830, s: 0.42, pose: walkPose(t * 11, 1), ex: exprAt([[0, '신남']], t), look: [0.8, 0] });
    if (lt > 0.4 * D) h += pop(t, t - lt + 0.4 * D, t + 99, 1460, 300, label(0, 0, '친구: 진짜 즐거워!', { size: 40, bg: '#7CC7FF' }), {});
    const zx = 900, zy = 880, zs = 0.62;
    h += Z({ t, seed: 1811, x: zx, y: zy, s: zs, rot: -88, ex: exprAt([[0, '지침']], t), look: [0.4, -0.6], still: true });
    h += battery(560, 560, 1.2, 0.08 + 0.04 * Math.sin(t * 6), RED);
    h += pop(t, t - lt + 0.08 * D, t + 99, 560, 420, label(0, 0, '이틀 만에 녹초', { size: 42, bg: PINK, color: '#fff' }), {});
    return h;
  }
  let h = BG('url(#morning)') + clouds(t, 90, 16, 3, 5) + ground(880, '#9CCB72') + grassField(t, 900);
  const fx = lerp(980, 1640, prog(lt, 0, D)), zx = lerp(380, 640, prog(lt, 0, D));
  h += PT({ t, seed: 1820, x: fx, y: 900, s: 0.62, pose: walkPose(t * 11, 1), ex: exprAt([[0, '신남']], t), look: [0.8, 0] });
  h += Z({ t, seed: 1821, x: zx, y: 900, s: 0.62, pose: walkPose(t * 4, 0.4), ex: exprAt([[0, '뿌듯']], t), look: [0.8, -0.1] });
  h += pop(t, t - lt + 0.08 * D, t + 99, fx, 470, craneG(0, 0, 0.3, t) + label(0, 40, '학', { size: 36, bg: '#fff' }), { noPop: true, inDur: 0.3 });
  h += pop(t, t - lt + 0.14 * D, t + 99, zx, 520, duckG(0, -10, 0.36, t) + label(0, 40, '오리', { size: 36, bg: '#fff' }), { noPop: true, inDur: 0.3 });
  h += pop(t, t - lt + 0.25 * D, t + 99, 960, 150, big(0, 0, [[['다리 길이가 ', '#fff'], ['다를 뿐', YEL]]], { size: 72 }), {});
  if (lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, 560, 300, label(0, 0, 'SNS는 줄이고, 내 속도로', { size: 38, bg: MINT }), { rot: 2 });
  return h;
}

/* ---------- day 3: social media result card ---------- */
function snsScene(t, lt, a) {
  const D = D_(a);
  let h = BG(NAVY) + BG('url(#grid)');
  h += pop(t, t - lt + 0.1, t + 99, 960, 230, big(0, 0, [[['SNS 앱마다 ', '#fff'], ['하루 10분', YEL], [' · 3주', '#fff']]], { size: 70 }), {});
  const R = [['우울', '↓', PINK], ['외로움', '↓', PINK]];
  R.forEach(([nm, ar, c], i) => { const at = 0.4 * D + i * 0.18 * D; if (lt > at) h += pop(t, t - lt + at, t + 99, 960, 420 + i * 190, `<rect x="-460" y="-70" width="920" height="140" rx="70" fill="#1B2A44" stroke="${MINT}" stroke-width="4"/>${T8(-400, 20, nm, { anchor: 'start', size: 58, fill: '#fff' })}<circle cx="340" cy="0" r="54" fill="${c}" stroke="${INK}" stroke-width="6"/>${T8(340, 26, ar, { size: 72, fill: NAVY })}`, { noPop: true, inDur: 0.3 }); });
  h += pop(t, t - lt + 0.3, t + 99, 960, 860, label(0, 0, 'Hunt et al., JSCP (2018) · 대학생 143명', { size: 30, bg: '#fff' }), {});
  return h;
}

/* ---------- twist: the question, the bickering, then one of them is gone ---------- */
const _graveV2 = graveScene;
graveScene = function (t, lt, a) {
  const D = D_(a);
  if (a.k) return _graveV2(t, lt, a);
  let h = bridgeBg(t, { sky: 'url(#autumn)', w1: '#8FA6B8', w2: '#6E8AA0' });
  h += leaves(t, 21, 16, [0, -40, 1920, 940]);
  const zx = 820, hx = 1120, s = 0.6, gone = prog(lt, 0.7 * D, 0.92 * D);
  h += ZH({ t, seed: 1100, x: zx, y: deckY(zx), s, ex: exprAt([[0, '신남'], [0.7 * D, '기본'], [0.9 * D, '지침']], lt), look: [0.8, -0.2] });
  if (gone < 1) h += `<g opacity="${f1((1 - gone) * 100) / 100}">${HZ({ t, seed: 1101, x: hx, y: deckY(hx), s, pose: lt > 0.35 * D && lt < 0.68 * D && Math.sin(t * 3) > 0 ? '가리키기' : '서기', ex: exprAt([[0, '신남']], t), look: [-0.8, -0.2] })}</g>`;
  if (lt < 0.36 * D) h += pop(t, t - lt + 0.05, t - lt + 0.36 * D, 960, 190, big(0, 0, [[['잴 필요조차 ', '#fff'], ['없었던 것은?', YEL]]], { size: 66 }), {});
  else if (lt < 0.68 * D) h += pop(t, t - lt + 0.36 * D, t - lt + 0.68 * D, 960, 190, big(0, 0, ['티격태격…'], { size: 58, sw: 12, fill: '#fff' }), { wobble: 2 });
  return h;
};

/* ---------- the axe: the trust it takes ---------- */
const _axeV2 = axeScene;
axeScene = function (t, lt, a) {
  const D = D_(a);
  if (a.k !== 2) return _axeV2(t, lt, a).replace('translate(1500 380)', 'translate(1460 380)');
  let h = _axeV2(t, lt, { k: 0, _dur: 600 });
  const op = prog(lt, 0.15 * D, 0.4 * D);
  h += `<path d="M720 430 Q950 300 1120 430" fill="none" stroke="${PINK}" stroke-width="7" stroke-dasharray="14 12" opacity="${f1(op * 100) / 100}"/>`;
  if (op > 0) h += pop(t, t - lt + 0.3 * D, t + 99, 920, 345, heart(0, 0, 0.9, PINK), {});
  h += pop(t, t - lt + 0.35 * D, t + 99, 960, 200, label(0, 0, '끝까지 믿고 코를 내밀어 줄 상대', { size: 42, bg: YEL }), {});
  return h;
};

/* ---------- ending: the ruler leans on the tree ---------- */
function endingBg(t) {
  let h = BG('url(#dusk9)') + `<circle cx="1640" cy="380" r="80" fill="#FFD27A"/><circle cx="1640" cy="380" r="240" fill="url(#warm)"/>` + clouds(t, 300, 18, 2, 11);
  h += `<path d="M-600 860 Q500 820 960 850 Q1500 880 2520 830 L2520 1480 L-600 1480 Z" fill="#9CB86A" stroke="${INK}" stroke-width="7"/>` + grassField(t, 880);
  h += oakG(1260, 870, 0.55, t);
  return h;
}
function endingScene(t, lt, a) {
  const D = D_(a);
  let h = endingBg(t);
  if (!a.k) {
    const walk = prog(lt, 0, 0.3 * D), zx = lerp(200, 980, easeOut(walk)), zs = 0.66;
    if (lt < 0.32 * D) { h += Z({ t, seed: 1900, x: zx, y: 900, s: zs, pose: walk < 1 ? walkPose(t * 6, 0.6) : '들기', ex: exprAt([[0, '뿌듯']], t), look: [0.8, -0.1] }); const [hx, hy] = handG(zx, 900, zs, walk < 1 ? [330, 300] : P['들기'].hR); h += heldRuler(hx, hy, 0.42, -60); }
    else {
      h += rulerG(1160, 770, 0.42, -76);
      const call = lt > 0.38 * D;
      h += Z({ t, seed: 1900, x: 980, y: 900, s: zs, pose: call ? '전화' : '서기', ex: exprAt([[0, '뿌듯'], [0.8 * D, '신남']], lt), look: [-0.4, -0.2] });
      if (call) { const [hx, hy] = handG(980, 900, zs, P['전화'].hR); h += phone(hx - 4, hy + 10, 0.3, { rot: 12 }); }
      if (lt > 0.42 * D) h += pop(t, t - lt + 0.42 * D, t - lt + 0.78 * D, 0, 0, speech(560, 380, 300, 110, '뭐 해?', 900, 560), { noPop: true, inDur: 0.25 });
      if (lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, 1660, 660, phone(0, 0, 0.6, { on: 1 }) + `<g transform="translate(0 -190)">${speech(0, 0, 320, 100, '아무것도.', 0, 70, { size: 38, bg: '#DDF4FF' })}</g>`, {});
      if (lt > 0.78 * D) h += pop(t, t - lt + 0.78 * D, t + 99, 0, 0, speech(560, 380, 440, 110, '그럼, 너도 와.', 900, 560), { noPop: true, inDur: 0.25 });
    }
    return h;
  }
  h += rulerG(1160, 770, 0.42, -76);
  h += Z({ t, seed: 1901, x: 700, y: 870, s: 0.6, rot: -88, ex: exprAt([[0, '신남']], t), look: [0.2, -0.9] });
  h += PT({ t, seed: 1902, x: 1080, y: 880, s: 0.6, rot: -88, ex: exprAt([[0, '신남']], t), look: [-0.6, -0.9] });
  if (Math.sin(t * 1.3) > -0.2) h += T8(780 + Math.sin(t) * 20, 600, 'ㅋㅋ', { size: 44, fill: '#fff', stroke: INK, sw: 6, op: 0.9 });
  if (a.k === 1) {
    if (lt > 0.42 * D) h += pop(t, t - lt + 0.42 * D, t + 99, 900, 160, big(0, 0, ['모자라서가 아니라,', [['잣대 하나로만', YEL], [' 재고 있어서', '#fff']]], { size: 64, sw: 13 }), {});
    return h;
  }
  h += pop(t, t - lt + 0.18 * D, t + 99, 900, 140, big(0, 0, [[['베이지 않은, ', '#fff'], ['온전한 나', YEL]]], { size: 66, sw: 13 }), {});
  if (lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 900, 250, big(0, 0, [[['쓸모없이 수다 떨 ', '#fff'], ['친구', YEL]]], { size: 60, sw: 12 }), {});
  return h;
}
const _meadowV3 = meadowScene;
meadowScene = function (t, lt, a) {
  if (!a.ask) return _meadowV3(t, lt, a);
  let h = endingBg(t);
  h += rulerG(1160, 770, 0.42, -76);
  h += Z({ t, seed: 1901, x: 700, y: 870, s: 0.6, rot: -88, ex: exprAt([[0, '신남']], t), look: [0.2, -0.9] });
  h += PT({ t, seed: 1902, x: 1080, y: 880, s: 0.6, rot: -88, ex: exprAt([[0, '뿌듯']], t), look: [-0.6, -0.9] });
  h += pop(t, t - lt + 0.3, t + 99, 0, 0, speech(760, 260, 860, 140, '나를 재던 남의 잣대는?', 640, 700, { size: 50 }), { noPop: true, inDur: 0.3 });
  return h;
};

/* ---------- review fixes: one carpenter design; the cat-video skeptic thinks his own thought ---------- */
carpenter = function (t, x, y, s, lt) { return char({ t, seed: 920, x, y, s, goggles: 'none', vest: '#B88A5A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', topknot: '#3A2A1E', robe: '#6A4529', beard: '#3A2A1E', pose: walkPose(t * 7, 0.6), ex: exprAt([[0, '결심']], t), look: [0.8, 0] }) + `<g transform="translate(${f1(x + 60 * s)} ${f1(y - 240 * s)}) rotate(20) scale(${s})"><path d="M0 0 L140 0 L140 40 L0 50 Z" fill="#C9D2DC" stroke="${INK}" stroke-width="5"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${10 + i * 22} 46 l10 12 l10 -12" fill="none" stroke="${INK}" stroke-width="3"/>`).join('')}<rect x="-50" y="-6" width="56" height="40" rx="10" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/></g>`; };
const _leisV4 = leisureScene;
leisureScene = function (t, lt, a) {
  const D = D_(a);
  if (!a.cat) return _leisV4(t, lt, a);
  let h = livingRoom(t, false);
  h += `<rect x="560" y="200" width="600" height="380" rx="20" fill="#1F2D44" stroke="${INK}" stroke-width="9"/><rect x="584" y="224" width="552" height="332" rx="10" fill="#FFF1D6"/>`;
  const by = Math.abs(Math.sin(t * 5)) * 60;
  h += `<g transform="translate(860 ${f1(490 - by)})"><ellipse rx="80" ry="54" fill="#F2A33A" stroke="${INK}" stroke-width="6"/><circle cx="60" cy="-50" r="44" fill="#F2A33A" stroke="${INK}" stroke-width="6"/><path d="M30 -84 L40 -120 L62 -90 Z M74 -88 L96 -118 L100 -80 Z" fill="#F2A33A" stroke="${INK}" stroke-width="5"/><circle cx="50" cy="-54" r="5" fill="${INK}"/><circle cx="76" cy="-54" r="5" fill="${INK}"/><path d="M-80 0 Q-130 -30 -120 -80" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/></g>`;
  h += Z({ t, seed: 930, x: 460, y: 930, s: 0.7, ex: exprAt([[0, '신남']], t), look: [0.6, -0.5] });
  h += pop(t, t - lt + 0.2, t + 99, 420, 360, outlined(0, 0, ['ㅋㅋㅋ'], { size: 60, sw: 12, fill: YEL }), { rot: -6, bob: 6 });
  h += PT({ t, seed: 931, x: 1400, y: 930, s: 0.7, ex: exprAt([[0, '결심']], t), look: [-0.6, -0.5] });
  h += pop(t, t - lt + 0.2 * D, t + 99, 1400, 470, label(0, 0, '쉼은 낭비라는 사람', { size: 36, bg: '#7CC7FF' }), {});
  h += pop(t, t - lt + 0.35 * D, t + 99, 1160, 690, bubble(0, 0, 360, 120, T8(16, 14, '이거 볼 시간에…', { size: 36 }), { right: 1 }), {});
  return h;
};
