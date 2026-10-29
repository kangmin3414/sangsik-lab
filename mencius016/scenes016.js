/* ---------- experiment 016: shrinking in front of others — Mencius' 浩然之氣, five attitudes ---------- */
// One image all the way: when Zero loses heart he literally shrinks (a 'bean'); the red cape is his 氣 —
// limp at first, a little lift after each experiment, flying at the end. Praise and blame are wind: the cape moves, the man doesn't.
// People: Mencius (topknot + cap, grey beard, brown robe), King of Qi (gold cap, red robe), 경추 (critic), 공손추 (disciple),
//   팀장 (grey-blue jacket), 임원1 (praises, long dark hair), 임원2 (frowns, grey hair), anonymous executives in dark suits.

if (!P['허리']) P['허리'] = { armL: [[148, 285], [98, 338], [140, 392]], hL: [144, 396], armR: [[252, 285], [302, 338], [260, 392]], hR: [256, 396],
  legL: [[180, 412], [166, 470], [154, 522]], fL: [142, 534, 0], legR: [[220, 412], [234, 470], [246, 522]], fR: [258, 534, 0], dy: 0 };
if (!P['움츠림']) P['움츠림'] = { armL: [[150, 290], [152, 346], [212, 356]], hL: [216, 354], armR: [[250, 290], [248, 344], [188, 350]], hR: [184, 348],
  legL: [[186, 412], [184, 470], [182, 522]], fL: [172, 534, 0], legR: [[214, 412], [216, 470], [218, 522]], fR: [228, 534, 0], dy: 6 };
if (!P['뽑기']) P['뽑기'] = { armL: [[148, 285], [150, 250], [176, 196]], hL: [180, 188], armR: [[252, 285], [250, 250], [224, 196]], hR: [220, 188],
  legL: [[180, 412], [150, 462], [146, 520]], fL: [134, 532, 0], legR: [[220, 412], [250, 462], [254, 520]], fR: [266, 532, 0], dy: 10 };
if (!P['주먹']) P['주먹'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [300, 250], [304, 186]], hR: [306, 176] }, LEGS);
if (!P['차']) P['차'] = Object.assign({ armL: [[148, 285], [150, 340], [190, 330]], hL: [196, 326], armR: [[252, 285], [252, 340], [212, 330]], hR: [206, 326] }, LEGS);
if (!P['문고리']) P['문고리'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [318, 318], [372, 336]], hR: [380, 338] }, LEGS);
if (!E['미소']) E['미소'] = Object.assign(dotEyes(10, 12), { bL: [140, 148, 163, 142, 186, 148], bR: [214, 148, 237, 142, 260, 148], mouth: 'M184 230 Q200 246 216 230', mouthFill: 'none' });
if (!E['생각']) E['생각'] = Object.assign(dotEyes(9, 12), { bL: [140, 146, 163, 136, 186, 142], bR: [214, 150, 237, 146, 260, 150], mouth: 'M190 236 Q198 231 210 234', mouthFill: 'none' });
if (!E['찡그림']) E['찡그림'] = Object.assign(dotEyes(9, 10), { bL: [140, 146, 163, 156, 186, 164], bR: [214, 164, 237, 156, 260, 146], mouth: 'M186 240 Q200 232 214 240', mouthFill: 'none' });

const ZB16 = { goggles: 'none', vest: TEE, patch: false, tee: true, vshade: 'rgba(150,60,0,0.22)', topknot: false, robe: false };
const RED16 = '#D7263D', RED16D = '#9E1B2C', GOLD16 = '#E8B83A';

/* ---------- the cape: drawn in Zero's local frame, behind him. lift 0 = limp, 1 = flying (wind from the right) ---------- */
function crPath16(p) { // closed Catmull-Rom through the points
  const n = p.length; let d = `M${f1(p[0][0])} ${f1(p[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
    d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d + ' Z';
}
function capeLocal16(t, lift, seed = 0) {
  const k = clamp(lift, 0, 1), cx = 200, cy = 262;
  const base = [[272, 296], [296, 400], [312, 524], [252, 534], [200, 528], [148, 534], [88, 524], [104, 400], [128, 296]];
  const pts = [[140, 252]].concat(base.map(([x, y], j) => {
    const dx = x - cx, dy = y - cy, dist = Math.hypot(dx, dy);
    const sway = (1 - k) * Math.sin(t * 1.4 + seed) * 2.5 + (1 - k) * 4;           // limp: hangs, a lazy sway
    const flut = k * Math.sin(t * 9 - dist * 0.035 + j * 0.9 + seed) * (4 + 10 * k) * (dist / 240);
    const ang = (k * 66 + sway + flut) * Math.PI / 180, st = 1 + 0.14 * k + (j >= 2 && j <= 6 ? (1 - k) * -0.04 : 0);
    const c = Math.cos(ang), s = Math.sin(ang);
    return [cx + (dx * c - dy * s) * st, cy + (dx * s + dy * c) * st];
  })).concat([[260, 252]]);
  const d = crPath16(pts);
  let h = `<path d="${d}" fill="${RED16}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  // inner fold shading
  const m1 = pts[4], m2 = pts[6];
  h += `<path d="M200 270 Q${f1((200 + m1[0]) / 2 + 6)} ${f1((270 + m1[1]) / 2)} ${f1(m1[0])} ${f1(m1[1])}" fill="none" stroke="${RED16D}" stroke-width="9" stroke-linecap="round" opacity=".7"/>`;
  h += `<path d="M178 272 Q${f1((178 + m2[0]) / 2 - 4)} ${f1((272 + m2[1]) / 2)} ${f1(m2[0] + 10)} ${f1(m2[1] - 8)}" fill="none" stroke="${RED16D}" stroke-width="7" stroke-linecap="round" opacity=".45"/>`;
  return h;
}
function capeG16(o, lift) { // behind the character: same transform as char()
  const s = o.s || 1, p = typeof o.pose === 'string' ? P[o.pose] : (o.pose || P['서기']);
  return `<g transform="translate(${f1(o.x)} ${f1(o.y)}) rotate(${f1(o.rot || 0)}) scale(${s}) translate(-200 -560) translate(0 ${f1(p.dy || 0)})">${capeLocal16(o.t || 0, lift, o.seed || 0)}</g>`;
}
function clasp16(o) {
  const s = o.s || 1, x = o.x, y = o.y + (o.pose && P[o.pose] ? P[o.pose].dy * s : 0);
  return [[156, 268], [244, 268]].map(([lx, ly]) => `<circle cx="${f1(x + (lx - 200) * s)}" cy="${f1(y + (ly - 560) * s)}" r="${f1(11 * s)}" fill="${GOLD16}" stroke="${INK}" stroke-width="${f1(4 * s)}"/>`).join('');
}
// Zero with (or without) the cape. o.cape = lift 0..1, undefined = no cape; o.hat = straw hat (the farmer of Song)
const ZC = o => { const q = Object.assign({}, ZB16, o); const cape = o.cape == null ? '' : capeG16(q, o.cape); let h = HALO(cape + char(q)) + (o.cape == null ? '' : clasp16(q)); if (o.hat) h += hat16(q); return h; };
function hat16(o) { const s = o.s || 1, x = o.x, y = o.y + (o.pose && P[o.pose] ? P[o.pose].dy * s : 0), hx = x, hy = y + (66 - 560) * s;
  return `<g transform="translate(${f1(hx)} ${f1(hy)}) scale(${f1(s)})"><ellipse cx="0" cy="10" rx="170" ry="34" fill="#E8C872" stroke="${INK}" stroke-width="7"/><path d="M-80 8 Q-70 -70 0 -76 Q70 -70 80 8 Z" fill="#E8C872" stroke="${INK}" stroke-width="7"/><path d="M-78 -4 Q0 12 78 -4" fill="none" stroke="#B5462F" stroke-width="12"/></g>`; }

const MZ = o => HALO(char(Object.assign({ goggles: 'none', vest: '#C9B48A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.16)', topknot: '#2B2B2B', guan: '#2A2A2A', longBeard: '#6A6A6A', robe: '#5B3A29' }, o)));
const KQ = o => HALO(char(Object.assign({ goggles: 'none', vest: '#C08A2E', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', topknot: '#2B2B2B', guan: '#C9A04A', beard: '#2B2B2B', robe: '#7A1F1F' }, o)));
const GS = o => HALO(char(Object.assign({ goggles: 'none', vest: '#B9C7D9', patch: false, tee: true, vshade: 'rgba(0,0,0,0.16)', topknot: '#2B2B2B', robe: '#3E5C84' }, o)));
const JC = o => HALO(char(Object.assign({ goggles: 'none', vest: '#C9B8A0', patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', topknot: '#2B2B2B', pencil: '#2B2B2B', robe: '#6A5A48' }, o)));
const TLD = o => HALO(char(Object.assign({ goggles: 'none', vest: '#55657A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.22)', collar: true, tie: '#2E4057', hair: '#2B2B2B' }, o)));
const EX = o => HALO(char(Object.assign({ goggles: 'none', vest: '#27303F', patch: false, tee: true, vshade: 'rgba(0,0,0,0.3)', collar: true, tie: '#9B2335', hair: '#4A4A4A' }, o)));
const EX1 = o => EX(Object.assign({ hair: '#3A2A20', longHair: '#3A2A20', tie: '#C9A04A', vest: '#3A2F45' }, o));
const EX2 = o => EX(Object.assign({ hair: '#9A9A9A', tie: '#2E4057', vest: '#2F3540' }, o));
function watch16(x, y, s, t) { const sp = (Math.sin(t * 5) + 1) / 2; return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s)})"><circle r="26" fill="${GOLD16}" stroke="${INK}" stroke-width="6"/><circle r="15" fill="#FFF7DA"/><path d="M0 0 L0 -10 M0 0 L7 3" stroke="${INK}" stroke-width="3"/><path d="M28 -30 l6 -14 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 Z" fill="#fff" opacity="${f1(sp * 100) / 100}"/></g>`; }

Object.assign(CAMS, {
  hlift: [1.0, 1.06, 960, 560], hhook: [1.0, 1.04, 960, 540], hmeet: [1.0, 1.05, 960, 560], hcape: [1.0, 1.05, 960, 560], hmen: [1.0, 1.04, 960, 540],
  hquote: [1.0, 1.03, 960, 540], hqi: [1.0, 1.08, 960, 560], hpose: [1.0, 1.04, 960, 540], hposes: [1.0, 1.03, 960, 520], hpose2: [1.0, 1.05, 960, 560],
  hbig: [1.0, 1.04, 960, 540], hbigq: [1.0, 1.03, 960, 540], hhalo: [1.0, 1.03, 960, 520], hlist: [1.0, 1.04, 960, 540], hslide: [1.0, 1.05, 960, 560],
  hself: [1.0, 1.04, 960, 540], hselfq: [1.0, 1.04, 960, 560], hvalue: [1.0, 1.03, 960, 520], hfix: [1.0, 1.05, 960, 560], hrush: [1.0, 1.05, 960, 560],
  hsong: [1.0, 1.05, 960, 560], hsongq: [1.0, 1.03, 960, 540], hsmall: [1.0, 1.05, 960, 560], hpres: [1.0, 1.05, 960, 560], hbudong: [1.0, 1.04, 960, 560],
  hpres2: [1.0, 1.05, 960, 560], hpeak: [1.0, 1.06, 960, 520], hheaven: [1.0, 1.04, 960, 540], hrecap: [1.0, 1.03, 960, 520], hcare: [1.0, 1.03, 960, 520]
});
const D16 = a => a._dur || 5;
const at16 = (t, a, phrase, d = 0) => fracOf13(t, phrase) * D16(a) + d;
const segAt16 = (t, lt, j) => segLt(t, lt, j);
const dim16 = (o, c = '#0B1626') => `<rect x="-600" y="-600" width="3120" height="2280" fill="${c}" opacity="${f1(o * 100) / 100}"/>`;
const floor16 = (y, c, line = INK) => `<rect x="-600" y="${y}" width="3120" height="${1480 - y}" fill="${c}"/><line x1="-600" y1="${y}" x2="2520" y2="${y}" stroke="${line}" stroke-width="7"/>`;

/* ---------- places ---------- */
function elevator16(t, floorN) {
  let h = BG('#9AA6B2') + `<rect x="160" y="60" width="1600" height="840" fill="#B8C2CC" stroke="${INK}" stroke-width="9"/>`;
  for (let i = 0; i < 4; i++) h += `<rect x="${200 + i * 390}" y="100" width="360" height="760" rx="8" fill="#C9D2DA" stroke="#8C98A4" stroke-width="5"/><path d="M${230 + i * 390} 130 L${300 + i * 390} 820" stroke="#fff" stroke-width="10" opacity=".25"/>`;
  h += `<rect x="190" y="560" width="1540" height="18" rx="9" fill="#E4E9EE" stroke="${INK}" stroke-width="5"/>`;
  h += `<rect x="820" y="10" width="280" height="80" rx="12" fill="#14171C" stroke="${INK}" stroke-width="6"/>` + T8(905, 68, '▲', { size: 40, fill: '#FF7A3D' }) + T8(1010, 70, String(floorN), { size: 50, fill: '#FF7A3D' });
  h += floor16(880, '#6E7883');
  return h;
}
function office16(t, o = {}) {
  let h = BG('#E7ECF1') + BG('url(#hatch)').replace('/>', ' opacity=".12"/>');
  h += `<rect x="1160" y="110" width="620" height="420" rx="10" fill="#BFE0F5" stroke="${INK}" stroke-width="9"/>`;
  for (let i = 0; i < 7; i++) h += `<rect x="${1190 + i * 84}" y="${300 - (i % 3) * 60}" width="64" height="${230 + (i % 3) * 60}" fill="#9DB4C8" stroke="${INK}" stroke-width="4"/>`;
  h += `<line x1="1470" y1="110" x2="1470" y2="530" stroke="${INK}" stroke-width="7"/>`;
  if (o.night) h += `<rect x="1160" y="110" width="620" height="420" rx="10" fill="#0B1430" opacity=".75"/><circle cx="1650" cy="190" r="34" fill="#FFF2C0"/>`;
  h += floor16(880, '#B9A88E');
  return h;
}
function meeting16(t, o = {}) {
  let h = BG('#E9E4DA') + BG('url(#hatch)').replace('/>', ' opacity=".1"/>');
  h += `<rect x="560" y="90" width="800" height="450" rx="14" fill="#1C2433" stroke="${INK}" stroke-width="9"/><rect x="580" y="110" width="760" height="410" rx="8" fill="${o.screen || '#F6F8FB'}"/>`;
  h += floor16(880, '#8E7B66');
  return h;
}
function slide16(x, y, s, t, o = {}) { // a bar chart; o.bad = bar 3 is the wrong one; o.fixed = corrected with a tick
  let h = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-380" y="-205" width="760" height="410" rx="8" fill="#F6F8FB"/>` + T8(-350, -150, '분기별 성과', { anchor: 'start', size: 40, fill: NAVY });
  h += `<line x1="-320" y1="150" x2="340" y2="150" stroke="${INK}" stroke-width="5"/>`;
  const v = [120, 170, o.fixed ? 150 : 235, 205];
  v.forEach((hh, j) => { const bx = -270 + j * 160, bad = j === 2 && o.bad && !o.fixed;
    h += `<rect x="${bx}" y="${150 - hh}" width="100" height="${hh}" rx="6" fill="${bad ? '#FF8A8A' : (j === 2 && o.fixed ? '#48C88A' : '#7FA8D6')}" stroke="${INK}" stroke-width="4"/>`;
    if (bad && o.note) h += `<g transform="translate(${bx + 50} ${150 - hh - 40}) rotate(-6)"><rect x="-70" y="-40" width="140" height="80" rx="6" fill="#FFE36E" stroke="${INK}" stroke-width="4"/>` + T8(0, 14, '쉿', { size: 40, fill: NAVY }) + '</g>';
    if (j === 2 && o.fixed) h += `<path d="M${bx + 20} ${150 - hh - 50} l22 22 l40 -44" fill="none" stroke="#2E9E5B" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`; });
  return h + '</g>';
}
function ancient16(t, o = {}) { // parchment hills, a walled city
  let h = BG(o.dusk ? '#E9C9A0' : '#EFE2C4') + BG('url(#hatch)').replace('/>', ' opacity=".12"/>');
  h += `<path d="M-600 640 Q-200 420 200 600 Q560 380 980 590 Q1380 400 1780 600 Q2100 470 2520 620 L2520 900 L-600 900 Z" fill="#C9B88E" stroke="${INK}" stroke-width="6"/>`;
  h += floor16(880, '#BFA77A');
  return h;
}
function castle16(x, y, s, c = '#A8865A') {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-160" y="-150" width="320" height="150" fill="${c}" stroke="${INK}" stroke-width="7"/>${[-140, -80, -20, 40, 100].map(cx => `<rect x="${cx}" y="-180" width="40" height="34" fill="${c}" stroke="${INK}" stroke-width="6"/>`).join('')}<path d="M-50 0 L-50 -70 Q0 -110 50 -70 L50 0 Z" fill="#5A3E2C" stroke="${INK}" stroke-width="6"/><path d="M-100 -150 L-100 -260 L0 -320 L100 -260 L100 -150" fill="${c}" stroke="${INK}" stroke-width="7"/><path d="M-130 -255 L0 -340 L130 -255 Z" fill="#7A2A20" stroke="${INK}" stroke-width="7"/></g>`;
}
function palace16(t) {
  let h = BG('#5A1E1E') + BG('url(#hatch)').replace('/>', ' opacity=".18"/>');
  for (let i = 0; i < 4; i++) h += `<rect x="${140 + i * 520}" y="40" width="70" height="840" fill="#A3302A" stroke="${INK}" stroke-width="7"/><rect x="${126 + i * 520}" y="40" width="98" height="40" fill="${GOLD16}" stroke="${INK}" stroke-width="6"/>`;
  h += floor16(880, '#3A1A14');
  return h;
}
function throne16(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-150" y="-330" width="300" height="330" rx="20" fill="${GOLD16}" stroke="${INK}" stroke-width="8"/><rect x="-190" y="-150" width="380" height="60" rx="14" fill="#C9962A" stroke="${INK}" stroke-width="7"/><rect x="-200" y="-20" width="400" height="40" rx="10" fill="#8A5A20" stroke="${INK}" stroke-width="7"/></g>`; }
function paddy16(t, o = {}) {
  let h = BG(o.dusk ? 'url(#sunset)' : 'url(#morning)') + clouds(t, 90, 14, 3, 7);
  h += `<path d="M-600 560 Q0 470 700 540 Q1300 470 2520 560 L2520 700 L-600 700 Z" fill="#9CC48A" stroke="${INK}" stroke-width="5"/>`;
  h += `<rect x="-600" y="640" width="3120" height="900" fill="#8FB0C9"/>`;
  for (let r = 0; r < 4; r++) h += `<line x1="-600" y1="${700 + r * 70}" x2="2520" y2="${700 + r * 70}" stroke="#6D8FA8" stroke-width="4" opacity=".6"/>`;
  h += `<line x1="-600" y1="640" x2="2520" y2="640" stroke="${INK}" stroke-width="6"/>`;
  return h;
}
function sprout16(x, y, s, t, o = {}) { // o.tall pulled (0..1), o.dead withered, o.grow (0..1) healthy height
  const tall = o.tall || 0, dead = o.dead || 0, g = o.grow == null ? 0.5 : o.grow;
  const hh = 60 + 70 * g + 110 * tall, sw = Math.sin(t * 2 + x * 0.01) * (dead ? 0 : 4);
  const c = dead > 0.5 ? '#8A6A3A' : '#4CAF50', droop = dead * 50;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  if (tall > 0.2) h += `<path d="M0 0 L-8 ${f1(26 * tall)} M0 0 L6 ${f1(30 * tall)} M0 0 L0 ${f1(34 * tall)}" stroke="#8A6A3A" stroke-width="4"/>`; // bare roots
  h += `<g transform="translate(0 ${f1(-34 * tall)}) rotate(${f1(sw)})"><path d="M0 0 Q${f1(4 + droop * 0.3)} ${f1(-hh * 0.5)} ${f1(droop)} ${f1(-hh + droop * 0.6)}" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`;
  h += `<path d="M0 ${f1(-hh * 0.45)} Q-36 ${f1(-hh * 0.6 + droop)} ${f1(-48 + droop * 0.2)} ${f1(-hh * 0.55 + droop * 1.2)}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/><path d="M2 ${f1(-hh * 0.6)} Q38 ${f1(-hh * 0.8 + droop)} ${f1(50 - droop * 0.2)} ${f1(-hh * 0.72 + droop * 1.2)}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/></g>`;
  return h + '</g>';
}
function mountain16(t, k = 1) {
  let h = BG('url(#sunset)') + `<circle cx="1420" cy="560" r="130" fill="#FFD27A"/><circle cx="1420" cy="560" r="320" fill="url(#warm)"/>` + clouds(t, 160, 10, 3, 4);
  h += `<path d="M-600 760 L-100 520 L300 700 L760 430 L1200 680 L1600 500 L2520 760 L2520 1480 L-600 1480 Z" fill="#7B5E8E" stroke="${INK}" stroke-width="6" opacity=".7"/>`;
  h += `<path d="M300 1480 L760 860 Q960 800 1160 860 L1620 1480 Z" fill="#5B4A6A" stroke="${INK}" stroke-width="8"/>`;
  return h;
}

/* ---------- shared cards ---------- */
const DAY16 = ['', '월요일', '화요일', '수요일', '목요일', '금요일'];
const EXPT16 = ['', '몸부터 펴기', '크게 보이는 것을, 작게 보기', '스스로 돌아보아, 걸리는 것 바로잡기', '억지로 키우지 않기', '칭찬에도 비난에도, 중심 지키기'];
function expCard16(t, lt, a, n, icon) {
  const T0 = t - lt;
  let h = BG('#2A1A1E') + BG('url(#dots)') + particles(t, 160 + n, 18, [0, 0, 1920, 1080], '#FF9A8A', { speed: 12, r: 3, op: 0.35 });
  h += `<ellipse cx="960" cy="480" rx="780" ry="420" fill="url(#redglow)" opacity=".55"/>`;
  const inner = `<circle cx="-500" cy="0" r="104" fill="${RED16}" stroke="${INK}" stroke-width="8"/>` + T8(-500, 38, String(n), { size: 116, fill: '#fff' }) +
    T8(-360, -44, `실험 ${n} · ${DAY16[n]}`, { anchor: 'start', size: 44, fill: '#9E1B2C' }) + T8(-360, 52, EXPT16[n], { anchor: 'start', size: EXPT16[n].length > 12 ? 52 : 66, fill: NAVY });
  h += pop(t, T0 + 0.1, t + 99, 960, 420, card14(0, 0, 1340, 300, inner, { bg: '#FFF7EC' }), { inDur: 0.4 });
  for (let i = 1; i <= 5; i++) h += `<circle cx="${960 + (i - 3) * 64}" cy="640" r="${i === n ? 17 : 12}" fill="${i <= n ? RED16 : '#4A3238'}" stroke="${INK}" stroke-width="4"/>`;
  if (icon) h += pop(t, T0 + 0.6, t + 99, 960, 800, icon, { bob: 4 });
  return h;
}
function quoteBig16(t, T0, x, y, lines, src, o = {}) { return pop(t, T0, t + 99, x, y, quote14(lines, src, Object.assign({ w: 1240 }, o)), { rot: o.rot || -1, inDur: 0.4 }); }
const capeIcon16 = lift => `<g transform="scale(.9)">${HALO(capeLocal16(0, lift).replace(/^/, '<g transform="translate(-200 -380)">') + '</g>')}</g>`;

/* ================= scenes ================= */
// 0 Monday elevator: executives, Zero shrinks
function hliftScene(t, lt, a) {
  const D = D16(a), T0 = t - lt;
  let h = elevator16(t, 12 + Math.floor(clamp(lt, 0, 6)));
  const sk = easeInOut(prog(lt, 0.45 * D, D + 0.6)), zs = lerp(0.58, 0.24, sk);
  h += EX({ t, seed: 1601, x: 470, y: 880, s: 0.66, pose: '팔짱', ex: exprAt([[0, '기본']], t), look: [0.5, -0.3] });
  h += EX2({ t, seed: 1602, x: 1450, y: 880, s: 0.68, pose: '서기', ex: exprAt([[0, '결심']], t), look: [-0.6, -0.2] });
  h += watch16(1450 + (114 - 200) * 0.68, 880 + (406 - 560) * 0.68, 0.8, t);
  h += EX1({ t, seed: 1603, x: 1180, y: 880, s: 0.64, pose: '서기', ex: exprAt([[0, '미소']], t), look: [-0.3, -0.3] });
  h += ZC({ t, seed: 1604, x: 820, y: 880, s: zs, pose: '움츠림', ex: exprAt([[0, '걱정']], t), look: [0, 0.9], tilt: 6 });
  if (sk > 0.05) for (let i = 0; i < 3; i++) { const ph = (t * 0.8 + i / 3) % 1; h += `<path d="M${f1(820 - 120 - ph * 60)} ${f1(880 - 300 * zs - i * 30)} l-24 0 M${f1(820 + 120 + ph * 60)} ${f1(880 - 300 * zs - i * 30)} l24 0" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="${f1((1 - ph) * sk * 100) / 100}"/>`; }
  h += pop(t, T0 + 0.15, t + 99, 330, 150, label(0, 0, '월요일 아침', { size: 44, bg: '#fff' }), { rot: -3 });
  return h;
}
// 1-2 the question, and Mencius
function hhookScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  if (k === 0) {
    let h = elevator16(t, 18) + dim16(0.55);
    h += EX({ t, seed: 1601, x: 470, y: 880, s: 0.66, pose: '팔짱', ex: exprAt([[0, '기본']], t) }) + EX2({ t, seed: 1602, x: 1450, y: 880, s: 0.68, pose: '서기', ex: exprAt([[0, '결심']], t) });
    h += ZC({ t, seed: 1604, x: 820, y: 880, s: 0.24, pose: '움츠림', ex: exprAt([[0, '걱정']], t), look: [0, 0.9] });
    h += pop(t, T0 + 0.1, t + 99, 960, 330, big(0, 0, [[['잘나 보이는 사람 앞에서,', '#fff']], [['우리는 왜 ', '#fff'], ['작아질까', YEL], ['?', '#fff']]], { size: 88, sw: 16, lh: 116 }), { noPop: true, inDur: 0.45 });
    return h;
  }
  let h = palace16(t);
  h += throne16(1380, 880, 0.9) + KQ({ t, seed: 1610, x: 1380, y: 800, s: 0.5, pose: '팔짱', ex: exprAt([[0, '결심']], t), look: [-0.7, 0] });
  h += MZ({ t, seed: 1611, x: 620, y: 880, s: 0.64, pose: '서기', ex: exprAt([[0, '결심']], t), look: [0.8, -0.1] });
  h += pop(t, T0 + 0.1, t + 99, 620, 300, label(0, 0, '맹자', { size: 56, bg: YEL }), { rot: -3 });
  const kk = at16(t, a, '다섯', -0.1);
  h += pop(t, T0 + kk, t + 99, 960, 140, big(0, 0, [[['다섯 가지 태도', '#fff'], [' · 하루에 하나씩', YEL]]], { size: 64, sw: 13 }), { noPop: true, inDur: 0.4 });
  for (let i = 0; i < 5; i++) h += pop(t, T0 + kk + 0.3 + i * 0.15, t + 99, 760 + i * 100, 240, `<circle r="30" fill="${RED16}" stroke="${INK}" stroke-width="6"/>` + T8(0, 14, String(i + 1), { size: 36, fill: '#fff' }), {});
  return h;
}
// 3-4 Friday's presentation
function hmeetScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  let h = office16(t);
  h += `<g transform="translate(360 330) rotate(-3)"><rect x="-190" y="-170" width="380" height="340" rx="12" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-190" y="-170" width="380" height="70" rx="12" fill="${RED16}" stroke="${INK}" stroke-width="7"/>` + T8(0, -120, '이번 주', { size: 36, fill: '#fff' });
  ['월', '화', '수', '목', '금'].forEach((d, j) => { h += T8(-150 + j * 75, -50, d, { size: 32, fill: NAVY }); h += `<rect x="${-180 + j * 75}" y="-30" width="62" height="70" rx="8" fill="#F1F4F8" stroke="${INK}" stroke-width="3"/>`; });
  h += `<circle cx="${-150 + 4 * 75}" cy="5" r="${f1(46 * easeOutBack(prog(lt, 0.5, 0.9)))}" fill="none" stroke="${RED16}" stroke-width="8"/>` + T8(0, 120, '금 · 임원 발표', { size: 38, fill: RED16 }) + '</g>';
  if (k === 0) {
    h += desk12(1100, 760, t, 1) + chair12(1000, 900, 0.56);
    h += ZC({ t, seed: 1620, x: 1000, y: 900, s: 0.56, pose: '앉기', ex: exprAt([[0, '기본'], [0.5 * D, '겁먹음']], lt), look: [-0.7, -0.2], sweat: lt > 0.5 * D });
    return h;
  }
  const sk = easeInOut(prog(lt, 0.2, 1.4)), zs = lerp(0.56, 0.2, sk);
  h += ZC({ t, seed: 1621, x: 1040, y: 880, s: zs, pose: '움츠림', ex: exprAt([[0, '걱정']], t), look: [0, 0.6] });
  if (sk > 0.9) h += pop(t, T0 + 1.4, t + 99, 1040, 880 - 520 * zs - 70, label(0, 0, '콩알', { size: 40, bg: '#C9E8A0' }), { rot: 4, bob: 3 });
  return h;
}
// 5-6 the doctor's red cape
function hcapeScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  let h = labBg(t);
  h += doctor(520, 960, 0.6, { t, expr: '미소', talk: k === 0 ? env(t) : 0, pose: k === 0 ? 'point' : undefined });
  if (k === 0) {
    h += ZC({ t, seed: 1630, x: 1400, y: 890, s: 0.3, pose: '움츠림', ex: exprAt([[0, '걱정']], t), look: [-0.8, -0.3] });
    const cx = lerp(760, 1180, easeInOut(prog(lt, 0.3 * D, 0.8 * D)));
    h += pop(t, T0 + 0.25 * D, t + 99, cx, 520, `<g transform="rotate(-12)">${HALO(`<g transform="translate(-200 -380)">${capeLocal16(t, 0.25)}</g>`)}</g>`, { bob: 4 });
    return h;
  }
  const grow = easeInOut(prog(lt, 0, 0.8)), zs = lerp(0.3, 0.5, grow);
  h += ZC({ t, seed: 1631, x: 1340, y: 890, s: zs, pose: '서기', cape: 0, ex: exprAt([[0, '서운함']], t), look: [-0.3, 0.5] });
  h += pop(t, T0 + 0.3, t + 99, 1340, 270, label(0, 0, '축 처진 망토', { size: 42, bg: '#fff' }), { rot: 3, bob: 3 });
  h += pop(t, T0 + 0.6, t + 99, 900, 200, label(0, 0, '망토 = 기운', { size: 40, bg: YEL }), { rot: -3 });
  return h;
}
// 7-9 Mencius and the King of Qi
function hmenScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  if (k === 0) {
    let h = ancient16(t);
    h += castle16(330, 880, 0.9) + castle16(1600, 880, 0.8, '#9A7A50');
    const x = lerp(620, 1300, prog(lt, 0, D + 1));
    h += shadow(x, 884, 60) + MZ({ t, seed: 1640, x, y: 880, s: 0.5, pose: walkPose(t * 6, 0.7), ex: exprAt([[0, '결심']], t), look: [0.6, 0] });
    for (let i = 0; i < 6; i++) { const ph = (t * 0.25 + i / 6) % 1; h += `<path d="M${f1(200 + ph * 1600)} ${780 + (i % 3) * 30} l30 -20" stroke="#8A6A44" stroke-width="5" opacity="${f1(Math.sin(ph * Math.PI) * 0.5 * 100) / 100}"/>`; }
    h += pop(t, T0 + 0.2, t + 99, 960, 150, label(0, 0, '전국 시대 · 기원전 4세기', { size: 42, bg: '#fff' }), { rot: -2 });
    return h;
  }
  if (k === 1) {
    let h = BG('#EFE2C4') + `<line x1="960" y1="-600" x2="960" y2="1680" stroke="${INK}" stroke-width="10"/>`;
    let L = palace16(t) + throne16(520, 880, 0.8) + KQ({ t, seed: 1641, x: 520, y: 810, s: 0.46, pose: '서기', ex: exprAt([[0, '지친']], t), look: [0.5, 0] });
    L += pop(t, T0 + 0.3, t + 99, 640, 360, label(0, 0, '에취… 감기라서, 그대가 오시오', { size: 30, bg: '#fff' }), { rot: -3 });
    let R = ancient16(t) + MZ({ t, seed: 1642, x: 1440, y: 880, s: 0.52, pose: '팔짱', ex: exprAt([[0, '기본'], [at16(t, a, '맹자도', 0), '결심']], lt), look: [-0.6, 0] });
    R += pop(t, T0 + at16(t, a, '맹자도', 0.2), t + 99, 1440, 360, label(0, 0, '나도 아프오', { size: 40, bg: YEL }), { rot: 3 });
    return h + `<g clip-path="url(#leftHalf)">${L}</g><g clip-path="url(#rightHalf)">${R}</g><line x1="960" y1="-600" x2="960" y2="1680" stroke="${INK}" stroke-width="12"/>`;
  }
  let h = ancient16(t);
  h += JC({ t, seed: 1643, x: 1300, y: 880, s: 0.54, pose: '가리키기', ex: exprAt([[0, '화남']], t), look: [-0.8, 0] });
  h += pop(t, T0 + 0.2, t + 99, 1340, 330, label(0, 0, '왕께 너무 무례하오!', { size: 40, bg: '#FFB0A0' }), { rot: 3 });
  h += MZ({ t, seed: 1644, x: 620, y: 880, s: 0.56, pose: '설명', ex: exprAt([[0, '미소']], t), look: [0.6, 0] });
  h += pop(t, T0 + at16(t, a, '증자', 0), t + 99, 620, 330, label(0, 0, '증자의 말을 빌리면…', { size: 38, bg: YEL }), { rot: -3 });
  return h;
}
// 10-11 Zengzi's words
function hquoteScene(t, lt, a) {
  const k = a.k || 0, T0 = t - lt;
  let h = ancient16(t, { dusk: true });
  if (k === 0) {
    h += MZ({ t, seed: 1650, x: 300, y: 880, s: 0.5, pose: '설명', ex: exprAt([[0, '결심']], t), look: [0.7, -0.2] });
    h += quoteBig16(t, T0 + 0.1, 1120, 420, ['저들이 부유함을 내세우면 나는 어진 마음으로,', '벼슬을 내세우면 나는 의로움으로.', '내가 무엇이 모자라겠는가.'], '증자의 말, 『맹자』 공손추 하', { size: 48, w: 1300 });
    return h;
  }
  h += `<g transform="translate(1120 330) scale(.62)" opacity=".8">${quote14(['저들이 부유함을 내세우면 나는 어진 마음으로,', '벼슬을 내세우면 나는 의로움으로.', '내가 무엇이 모자라겠는가.'], '증자의 말', { w: 1300, size: 48 })}</g>`;
  h += ZC({ t, seed: 1651, x: 900, y: 880, s: 0.42, pose: '놀람' in P ? '놀람' : '만세', cape: 0, ex: exprAt([[0, '놀람']], t), look: [0.4, -0.5] });
  h += pop(t, T0 + 0.2, t + 99, 900, 520, label(0, 0, '왕한테요?!', { size: 44, bg: YEL }), { rot: -4, wobble: 2 });
  return h;
}
// 12 浩然之氣 fills heaven and earth
function hqiScene(t, lt, a) {
  const D = D16(a), T0 = t - lt;
  let h = BG('#1B1430') + BG('url(#dots)');
  const k = easeOut(prog(lt, 0.2, 0.8 * D));
  h += `<path d="M-600 900 Q0 820 960 860 Q1900 820 2520 900 L2520 1480 L-600 1480 Z" fill="#2E2448" stroke="${INK}" stroke-width="6"/>`;
  h += `<circle cx="960" cy="640" r="${f1(120 + 1300 * k)}" fill="url(#amber)" opacity="${f1((0.9 - 0.3 * k) * 100) / 100}"/>`;
  for (let i = 0; i < 14; i++) { const ang = i * 0.449 + t * 0.4, r = 160 + 700 * k + Math.sin(t * 2 + i) * 30; h += `<path d="M${f1(960 + Math.cos(ang) * r * 0.6)} ${f1(640 + Math.sin(ang) * r * 0.45)} q30 -30 60 0 q30 30 60 0" fill="none" stroke="${YEL}" stroke-width="6" stroke-linecap="round" opacity="${f1(0.6 * k * 100) / 100}"/>`; }
  h += MZ({ t, seed: 1652, x: 960, y: 880, s: 0.52, pose: '만세', ex: exprAt([[0, '미소']], t), look: [0, -0.4] });
  h += pop(t, T0 + at16(t, a, '호연지기', -0.1), t + 99, 960, 220, big(0, 0, [[['호연지기', YEL], [' 浩然之氣', '#fff']]], { size: 92, sw: 16 }), { noPop: true, inDur: 0.5 });
  h += pop(t, T0 + 0.4 * D, t + 99, 960, 360, label(0, 0, '하늘과 땅 사이를 가득 채우는 기운', { size: 38, bg: '#fff' }), {});
  return h;
}
// 13-16 experiment 1: open the body first
function hposeScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  if (k === 0) return expCard16(t, lt, a, 1, ZC({ t, seed: 1660, x: 0, y: 180, s: 0.36, pose: '허리', cape: 0.1, ex: exprAt([[0, '결심']], t) }));
  if (k === 1) {
    let h = ancient16(t);
    h += MZ({ t, seed: 1661, x: 290, y: 880, s: 0.48, pose: '설명', ex: exprAt([[0, '기본']], t), look: [0.7, -0.2] });
    h += quoteBig16(t, T0 + 0.1, 1130, 330, ['뜻은 기운의 장수이고,', '기운은 몸을 채우는 것이다.'], '『맹자』 공손추 상', { w: 1060 });
    // a little general (will) leading a crowd of dots (energy) into a body outline
    const gx = 1130, gy = 730, kk = prog(lt, 0.5 * D, D);
    h += `<g transform="translate(1130 760) scale(1.35) translate(-1130 -760)">`;
    h += `<path d="M${gx + 240} 620 q-40 0 -40 40 l0 160 l80 0 l0 -160 q0 -40 -40 -40 Z" fill="#fff" stroke="${INK}" stroke-width="5" opacity=".9"/><circle cx="${gx + 240}" cy="595" r="32" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
    for (let i = 0; i < 10; i++) { const x = lerp(gx - 260 + (i % 5) * 40, gx + 220 + (i % 3) * 14, easeInOut(clamp(kk * 1.3 - i * 0.05, 0, 1))), y = lerp(gy + Math.floor(i / 5) * 40, 680 + (i % 4) * 34, easeInOut(clamp(kk * 1.3 - i * 0.05, 0, 1))); h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="12" fill="${YEL}" stroke="${INK}" stroke-width="4"/>`; }
    h += `<g transform="translate(${gx - 330} ${gy + 10})"><path d="M0 -60 L0 30" stroke="${INK}" stroke-width="5"/><path d="M0 -60 L44 -48 L0 -36 Z" fill="${RED16}" stroke="${INK}" stroke-width="4"/><circle cx="-14" cy="-10" r="18" fill="#fff" stroke="${INK}" stroke-width="5"/></g>`;
    h += T8(gx - 340, gy + 90, '뜻', { size: 34, fill: NAVY }) + T8(gx - 160, gy + 130, '기운', { size: 34, fill: NAVY }) + T8(gx + 240, 870, '몸', { size: 34, fill: NAVY }) + '</g>';
    return h;
  }
  if (k === 2) {
    let h = labBg(t);
    h += doctor(480, 960, 0.6, { t, expr: '미소', talk: env(t), pose: 'point' });
    const st = easeInOut(prog(lt, 0.5 * D, 0.9 * D));
    h += ZC({ t, seed: 1662, x: 1400, y: 890, s: 0.5, pose: mixPose('움츠림', '허리', st), cape: 0, ex: exprAt([[0, '걱정'], [0.7 * D, '결심']], lt), look: [-0.6, lerp(0.6, -0.2, st)], tilt: lerp(8, 0, st) });
    h += pop(t, T0 + 0.2, t + 99, 960, 200, label(0, 0, '몸 ⇄ 마음', { size: 48, bg: MINT }), {});
    return h;
  }
  // k3: two minutes at the bathroom mirror
  let h = BG('#DCEBEB') + `<g>${[...Array(12)].map((_, i) => `<line x1="${-600 + i * 260}" y1="-600" x2="${-600 + i * 260}" y2="1680" stroke="#B9D1D1" stroke-width="3"/>`).join('')}${[...Array(8)].map((_, i) => `<line x1="-600" y1="${-600 + i * 260}" x2="2520" y2="${-600 + i * 260}" stroke="#B9D1D1" stroke-width="3"/>`).join('')}</g>`;
  h += floor16(880, '#A9BFC0');
  h += `<rect x="1040" y="150" width="560" height="640" rx="40" fill="#CFE6F2" stroke="${INK}" stroke-width="10"/><path d="M1100 220 L1180 220 M1100 260 L1140 260" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".6"/>`;
  const st = easeInOut(prog(lt, 0.3, 1.2));
  const zo = { t, seed: 1663, s: 0.52, pose: mixPose('움츠림', '허리', st), cape: 0.05, ex: exprAt([[0, '걱정'], [1.2, '결심']], lt), look: [0.6, 0] };
  h += `<g clip-path="url(#mir16)"><defs><clipPath id="mir16"><rect x="1050" y="160" width="540" height="620" rx="34"/></clipPath></defs><g opacity=".75">${flip(1320, ZC(Object.assign({}, zo, { x: 1320, y: 860, s: 0.46, seed: 1664 })))}</g></g>`;
  h += ZC(Object.assign({ x: 700, y: 900 }, zo));
  h += timer14(420, 300, 0.9, Math.max(0, 120 - lt * 120 / Math.max(2, D)));
  return h;
}
// 17-20 the posture study (Nair et al. 2015)
function chairFig16(x, y, t, up, seed) {
  let h = `<rect x="${x - 70}" y="${y - 150}" width="22" height="170" rx="8" fill="#8A6A44" stroke="${INK}" stroke-width="5"/><rect x="${x - 80}" y="${y - 20}" width="150" height="22" rx="8" fill="#8A6A44" stroke="${INK}" stroke-width="5"/>`;
  h += P14(x, y + 30, 0.62, up ? '#7FA8D6' : '#B0A090', { t, seed, pose: '앉기', ex: exprAt([[0, up ? '결심' : '걱정']], t), rot: up ? 0 : 14, tilt: up ? 0 : 18, look: up ? [0.4, 0] : [0, 0.8] });
  if (up) h += `<path d="M${x - 46} ${y - 120} L${x - 46} ${y - 10}" stroke="#E8E2CC" stroke-width="16" opacity=".9"/>`; // tape on the back
  return h;
}
function hposesScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  let h = labBg(t);
  if (k === 0) {
    h += chairFig16(640, 860, t, true, 1670) + chairFig16(1280, 860, t, false, 1671);
    h += pop(t, T0 + 0.3, t + 99, 640, 360, label(0, 0, '바르게', { size: 42, bg: MINT }), {}) + pop(t, T0 + 0.5, t + 99, 1280, 360, label(0, 0, '구부정하게', { size: 42, bg: '#C3CDD8' }), {});
    h += pop(t, T0 + at16(t, a, '74명', 0), t + 99, 960, 200, label(0, 0, '74명 · 등을 테이프로 고정', { size: 40, bg: '#fff' }), { rot: -2 });
    h += pop(t, T0 + at16(t, a, '즉석 발표', 0), t + 99, 960, 560, label(0, 0, '🎤 즉석 발표', { size: 38, bg: YEL }), { bob: 3 });
    return h;
  }
  if (k === 1) {
    const rows = [['자존감', 0.82, 0.58], ['기분', 0.78, 0.52]];
    rows.forEach(([nm, u, s2], j) => { const y = 380 + j * 200, kk = easeOut(prog(lt, 0.3 + j * 0.4, 1.2 + j * 0.4));
      h += T8(420, y + 18, nm, { anchor: 'end', size: 46, fill: '#fff' });
      h += `<rect x="460" y="${y - 50}" width="${f1(900 * u * kk)}" height="44" rx="10" fill="${MINT}" stroke="${INK}" stroke-width="5"/><rect x="460" y="${y + 6}" width="${f1(900 * s2 * kk)}" height="44" rx="10" fill="#8C98A4" stroke="${INK}" stroke-width="5"/>`; });
    h += pop(t, T0 + 0.2, t + 99, 1500, 220, label(0, 0, '■ 바르게  ■ 구부정', { size: 32, bg: '#fff' }), {});
    h += pop(t, T0 + at16(t, a, '구부정한', 0), t + 99, 1240, 820, label(0, 0, '"나는… 못해…"  부정적인 말 ↑', { size: 38, bg: '#FFB0A0' }), { rot: 2 });
    h += T8(1740, 900, '개념도', { anchor: 'end', size: 26, fill: '#9FB4D8', w: 700 });
    return h;
  }
  if (k === 2) {
    h += pop(t, T0 + 0.1, t + 99, 700, 420, card14(0, 0, 640, 300, T8(0, -30, '자세 2분 → 호르몬 변화?', { size: 44 }) + T8(0, 50, '(2010년, 42명)', { size: 32, fill: '#6B6255', w: 700 }), { bg: '#FFF7EC' }), { rot: -2 });
    const x = prog(lt, at16(t, a, '더 큰', 0), at16(t, a, '더 큰', 0.5));
    if (x > 0) h += `<path d="M420 300 L${f1(lerp(420, 980, x))} ${f1(lerp(300, 540, x))}" stroke="${RED}" stroke-width="18" stroke-linecap="round"/><path d="M980 300 L${f1(lerp(980, 420, x))} ${f1(lerp(300, 540, x))}" stroke="${RED}" stroke-width="18" stroke-linecap="round"/>`;
    h += pop(t, T0 + at16(t, a, '더 큰', 0.3), t + 99, 1340, 640, card14(0, 0, 640, 220, T8(0, -14, '200명 재실험', { size: 44 }) + T8(0, 54, '호르몬 변화 확인 안 됨', { size: 38, fill: '#C2410C' }), { bg: '#EAF4FF' }), { rot: 2 });
    return h;
  }
  h += pop(t, T0 + 0.1, t + 99, 960, 300, big(0, 0, [[['몸을 펴면,', '#fff']], [['마음이 ', '#fff'], ['덜 쪼그라든다', YEL]]], { size: 90, sw: 16, lh: 118 }), { noPop: true, inDur: 0.5 });
  h += ZC({ t, seed: 1672, x: 960, y: 890, s: 0.42, pose: '허리', cape: 0.08, ex: exprAt([[0, '뿌듯']], t) });
  return h;
}
// 21 a little lift... then the executive walks in
function hpose2Scene(t, lt, a) {
  const D = D16(a), T0 = t - lt, cut = at16(t, a, '그런데', 0);
  if (lt < cut) {
    let h = labBg(t);
    const lift = 0.05 + 0.25 * Math.sin(prog(lt, 0.2, cut) * Math.PI);
    h += ZC({ t, seed: 1673, x: 960, y: 890, s: 0.5, pose: '허리', cape: lift, ex: exprAt([[0, '놀람'], [0.6, '신남']], lt), look: [-0.4, -0.4] });
    h += pop(t, T0 + 0.3, t + 99, 1300, 330, label(0, 0, '들썩!', { size: 48, bg: YEL }), { rot: 6, wobble: 2 });
    return h;
  }
  let h = meeting16(t) + slide16(960, 315, 1, t, {}) + `<rect x="560" y="560" width="800" height="40" rx="10" fill="#6A5240" stroke="${INK}" stroke-width="7"/>`;
  const ent = easeOut(prog(lt, cut, cut + 1.2)), sk = easeInOut(prog(lt, cut + 0.6, cut + 2.2));
  h += EX2({ t, seed: 1674, x: lerp(2100, 1520, ent), y: 880, s: 0.66, pose: ent < 1 ? walkPose(t * 7, 0.7) : '팔짱', ex: exprAt([[0, '결심']], t), look: [-0.6, 0] });
  h += ZC({ t, seed: 1675, x: 760, y: 880, s: lerp(0.5, 0.28, sk), pose: mixPose('허리', '움츠림', sk), cape: 0.02, ex: exprAt([[0, '기본'], [cut + 0.5, '겁먹음']], lt), look: [0.8, -0.2] });
  return h;
}
