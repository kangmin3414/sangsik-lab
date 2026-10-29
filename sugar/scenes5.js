/* ---------- experiment 004 · sugar scenes ---------- */
const CREAM = '#FFF4E2';
function donut(x, y, s, rot = 0) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})"><circle r="60" fill="#E0A060" stroke="${INK}" stroke-width="7"/><path d="M-54 -14 Q-40 -58 0 -58 Q44 -58 56 -12 Q40 6 20 -4 Q0 8 -20 -2 Q-40 8 -54 -14 Z" fill="#FF8FB1" stroke="${INK}" stroke-width="6"/><circle r="20" fill="#2A1A10" stroke="${INK}" stroke-width="6"/>${[[-30, -36, 20], [10, -46, -30], [34, -26, 60], [-14, -24, 90]].map(([a, b, r]) => `<rect x="${a}" y="${b}" width="12" height="5" rx="2.5" fill="${['#fff', YEL, MINT, '#7CC7FF'][Math.abs(r) % 4]}" transform="rotate(${r} ${a} ${b})"/>`).join('')}</g>`;
}
function cookie(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><circle r="50" fill="#D9A066" stroke="${INK}" stroke-width="7"/>${[[-18, -14], [16, -20], [-6, 14], [22, 12], [-26, 16]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="7" fill="#4A2A14"/>`).join('')}</g>`; }
function cake(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-60 40 L-60 -10 L60 -40 L60 40 Z" fill="#FFE6C8" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-60 -10 L60 -40 L60 -20 L-60 10 Z" fill="#FF8FB1"/><path d="M-60 12 L60 -18" stroke="#fff" stroke-width="6"/><circle cx="34" cy="-50" r="14" fill="${RED}" stroke="${INK}" stroke-width="5"/></g>`; }
function latte(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-44 -80 L44 -80 L36 70 Q0 82 -36 70 Z" fill="#F7E7D2" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-41 -20 L41 -20 L38 30 L-38 30 Z" fill="#C88A52"/><path d="M-38 30 L38 30 L36 70 Q0 82 -36 70 Z" fill="#7A4A2A"/><path d="M-50 -80 Q-40 -126 0 -120 Q40 -130 50 -80 Z" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M-30 -104 Q0 -90 30 -108" fill="none" stroke="#C88A52" stroke-width="7" stroke-linecap="round"/><rect x="12" y="-170" width="10" height="90" rx="4" fill="${PINK}" stroke="${INK}" stroke-width="4" transform="rotate(12 17 -125)"/></g>`; }
function cube(x, y, s = 1) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-30 -10 L0 -26 L30 -10 L0 6 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-30 -10 L0 6 L0 40 L-30 24 Z" fill="#E8EEF6" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M30 -10 L0 6 L0 40 L30 24 Z" fill="#CFD8E4" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle cx="-12" cy="10" r="2.5" fill="#B9C6D6"/><circle cx="14" cy="18" r="2.5" fill="#A9B6C6"/></g>`; }
function soda(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-58" y="-110" width="116" height="220" rx="22" fill="#E8414A" stroke="${INK}" stroke-width="8"/><rect x="-50" y="-128" width="100" height="26" rx="10" fill="#C9D3E2" stroke="${INK}" stroke-width="6"/><path d="M-58 -10 Q0 30 58 -10 L58 30 Q0 70 -58 30 Z" fill="#fff" opacity=".9"/><text x="0" y="-40" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="#fff">탄산</text><rect x="-40" y="-96" width="14" height="180" rx="7" fill="#fff" opacity=".25"/></g>`; }
function pudding(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-44 40 L-34 -30 Q0 -44 34 -30 L44 40 Z" fill="#FFD27A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-34 -30 Q0 -44 34 -30 Q30 -10 0 -8 Q-30 -10 -34 -30 Z" fill="#8A4A1A" stroke="${INK}" stroke-width="5"/><ellipse cx="0" cy="44" rx="58" ry="12" fill="#fff" stroke="${INK}" stroke-width="5"/></g>`; }
function mug(x, y, s, steamT) { const st = (steamT * 40) % 60; return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-46 -40 L46 -40 L40 50 Q0 62 -40 50 Z" fill="${MINT}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M44 -20 Q86 -16 82 14 Q78 40 42 34" fill="none" stroke="${INK}" stroke-width="9"/><ellipse cx="0" cy="-40" rx="46" ry="10" fill="#C88A52" stroke="${INK}" stroke-width="6"/>${[0, 1, 2].map(i => `<path d="M${-18 + i * 18} ${-56 - st * 0.4} q-10 -16 0 -32 q10 -16 0 -32" fill="none" stroke="#fff" stroke-width="5" opacity="${f1((1 - st / 60) * 80) / 100}"/>`).join('')}</g>`; }
function heart(x, y, s, c = PINK) { return `<path transform="translate(${f1(x)} ${f1(y)}) scale(${s})" d="M0 14 C-30 -6 -24 -30 -10 -30 C-2 -30 0 -22 0 -18 C0 -22 2 -30 10 -30 C24 -30 30 -6 0 14 Z" fill="${c}" stroke="${INK}" stroke-width="4"/>`; }
function wallClock(x, y, r, hh, mm) { const ma = mm / 60 * 360, ha = (hh % 12 + mm / 60) / 12 * 360; return `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#fff" stroke="${INK}" stroke-width="8"/>${[...Array(12)].map((_, i) => `<line x1="${f1(Math.cos(i * 0.5236) * r * .75)}" y1="${f1(Math.sin(i * 0.5236) * r * .75)}" x2="${f1(Math.cos(i * 0.5236) * r * .87)}" y2="${f1(Math.sin(i * 0.5236) * r * .87)}" stroke="${INK}" stroke-width="5"/>`).join('')}<line x1="0" y1="0" x2="${f1(Math.sin(ha * Math.PI / 180) * r * .45)}" y2="${f1(-Math.cos(ha * Math.PI / 180) * r * .45)}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><line x1="0" y1="0" x2="${f1(Math.sin(ma * Math.PI / 180) * r * .68)}" y2="${f1(-Math.cos(ma * Math.PI / 180) * r * .68)}" stroke="${RED}" stroke-width="7" stroke-linecap="round"/><circle r="8" fill="${INK}"/></g>`; }
function cafeRoom(t) {
  let h = BG('#F3E1C8') + BG('url(#hatch)').replace('/>', ' opacity=".3"/>');
  h += windowDay(1260, 120, 460, 330, t);
  h += `<rect x="160" y="200" width="420" height="22" fill="#8C6638" stroke="${INK}" stroke-width="6"/>${[0, 1, 2, 3].map(i => `<g transform="translate(${210 + i * 100} 150)"><rect x="-30" y="-46" width="60" height="96" rx="12" fill="#fff" opacity=".85" stroke="${INK}" stroke-width="5"/><rect x="-24" y="-6" width="48" height="50" rx="8" fill="${['#C88A52', '#FFD27A', '#FF8FB1', '#7A4A2A'][i]}"/></g>`).join('')}`;
  h += wallClock(840, 230, 80, 3, 0);
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#B88C66"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  return h;
}
function cafeScene(t, lt, a) {
  let h = cafeRoom(t);
  const happy = a.sweets && lt > 1.2;
  h += Z({ t, seed: 60, x: 900, y: 960, s: 0.82, pose: '책상', ex: exprAt([[0, happy ? '신남' : '지침']], t), look: [0.4, 0.5], tilt: happy ? 0 : -6 + Math.sin(t * 0.7) * 3 });
  h += `<rect x="460" y="740" width="980" height="40" rx="10" fill="#8C6638" stroke="${INK}" stroke-width="8"/><rect x="500" y="780" width="900" height="320" fill="#7A5A32" stroke="${INK}" stroke-width="8"/>`;
  if (!a.sweets) {
    for (let i = 0; i < 4; i++) { const a2 = t * 1.5 + i * 1.57; h += `<circle cx="${f1(900 + Math.cos(a2) * 170)}" cy="${f1(540 + Math.sin(a2) * 40)}" r="${f1(26 + 8 * Math.sin(t * 2 + i))}" fill="#fff" opacity=".55" stroke="${INK}" stroke-width="3"/>`; }
    h += pop(t, t - lt + 0.6, t + 99, 1180, 420, label(0, 0, '머리가 멍…', { size: 40, bg: '#fff' }), { rot: 4, bob: 4 });
  } else {
    h += pop(t, t - lt + 0.3, t + 99, 1120, 640, latte(0, 0, 0.9), {});
    h += pop(t, t - lt + 0.7, t + 99, 700, 715, `<ellipse cx="0" cy="18" rx="90" ry="20" fill="#fff" stroke="${INK}" stroke-width="6"/>` + cookie(-26, 0, 0.7) + cookie(30, -6, 0.6), {});
    h += pop(t, t - lt + 1.2, t + 99, 1240, 420, label(0, 0, '당 충전!', { size: 48, bg: YEL }), { rot: -5, bob: 5 });
  }
  return h;
}
function cubesScene(t, lt, a) {
  let h = BG('url(#cream)') + BG('url(#paper)');
  // left: WHO (6 cubes)
  const L = [[-70, 60], [0, 60], [70, 60], [-35, 0], [35, 0], [0, -60]];
  h += `<g transform="translate(560 520)"><rect x="-300" y="-330" width="600" height="560" rx="34" fill="#fff" stroke="${INK}" stroke-width="8"/>`;
  h += label(0, -260, 'WHO 권장', { size: 44, bg: MINT });
  L.forEach(([x, y], i) => { const k = a.k === 1 ? easeOutBack(clamp((lt - 0.3 - i * 0.25) / 0.35, 0, 1)) : 1; if (k > 0) h += `<g transform="translate(${x} ${y + (1 - Math.min(1, k)) * -80}) scale(${f1(k * 100) / 100})">${cube(0, 0, 1.15)}</g>`; });
  h += `<text x="0" y="170" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="54" fill="${NAVY}">하루 25g 아래</text><text x="0" y="210" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="30" fill="#6B6255">티스푼 약 6개 · 더 바람직한 기준</text></g>`;
  // right: one can of soda (10 cubes)
  h += `<g transform="translate(1340 520)"><rect x="-300" y="-330" width="600" height="560" rx="34" fill="#fff" stroke="${INK}" stroke-width="8"/>`;
  h += label(0, -260, '탄산음료 1캔', { size: 44, bg: PINK });
  if (a.k === 2) {
    h += pop(t, t - lt + 0.2, t + 99, -170, -10, soda(0, 0, 0.95), {});
    const R = [[-10, 90], [60, 90], [130, 90], [200, 90], [25, 30], [95, 30], [165, 30], [60, -30], [130, -30], [95, -90]];
    R.forEach(([x, y], i) => { const k = easeOutBack(clamp((lt - 0.6 - i * 0.18) / 0.3, 0, 1)); if (k > 0) h += `<g transform="translate(${x} ${y + (1 - Math.min(1, k)) * -80}) scale(${f1(k * 100) / 100})">${cube(0, 0, 1.05)}</g>`; });
    h += `<text x="0" y="200" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="54" fill="#D14545">최대 40g · 티스푼 10개</text>`;
  } else h += `<text x="0" y="40" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="160" fill="#E2D8C8">?</text>`;
  h += `</g>`;
  h += `<text x="960" y="840" text-anchor="middle" font-family="${FONT}" font-weight="500" font-size="28" fill="#6B6255">WHO, Guideline: Sugars intake for adults and children (2015)</text>`;
  if (a.k === 2) h += Z({ t, seed: 61, x: 1820, y: 1010, s: 0.42, ex: exprAt([[0, '놀람']], t), pose: '만세' });
  return h;
}
function sugarboxScene(t, lt) {
  let h = livingRoom(t, false);
  h += `<rect x="1000" y="740" width="560" height="34" rx="10" fill="#8C6638" stroke="${INK}" stroke-width="8"/><rect x="1040" y="774" width="30" height="110" fill="#7A5A32" stroke="${INK}" stroke-width="6"/><rect x="1490" y="774" width="30" height="110" fill="#7A5A32" stroke="${INK}" stroke-width="6"/>`;
  const drop = prog(lt, 0.5, 1.3), close = easeInOut(prog(lt, 1.4, 1.9));
  h += `<rect x="1150" y="600" width="260" height="140" rx="10" fill="#9C6B3E" stroke="${INK}" stroke-width="8"/>`;
  if (drop < 1) { const x = lerp(1060, 1280, easeInOut(drop)), y = lerp(560, 640, drop * drop); h += donut(x, y, 0.8, lerp(-30, 0, drop)); }
  h += `<rect x="1140" y="650" width="280" height="100" rx="12" fill="#B57D48" stroke="${INK}" stroke-width="8"/><text x="1280" y="718" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="42" fill="#5A3A1C">단것 금고</text>`;
  h += `<g transform="rotate(${f1(lerp(-72, 0, close))} 1146 604)"><rect x="1140" y="586" width="282" height="34" rx="10" fill="#C48B54" stroke="${INK}" stroke-width="8"/></g>`;
  if (lt > 2.0) h += pop(t, t - lt + 2.0, t + 99, 1280, 760, `<rect x="-30" y="-10" width="60" height="50" rx="8" fill="${YEL}" stroke="${INK}" stroke-width="6"/><path d="M-18 -10 L-18 -30 Q0 -52 18 -30 L18 -10" fill="none" stroke="${INK}" stroke-width="8"/>`, {});
  if (lt > 2.3) h += pop(t, t - lt + 2.3, t + 99, 1440, 540, label(0, 0, '30일', { size: 44, bg: PINK }), { rot: 8, bob: 4 });
  h += Z({ t, seed: 62, x: 820, y: 960, s: 0.82, pose: lt < 1.3 ? '폰넣기' : '손인사', ex: exprAt([[0, '결심'], [1.6, '뿌듯']], lt), look: [0.8, 0.2] });
  return h;
}
function cravingScene(t, lt, a) {
  let h = livingRoom(t, false) + sofa(420, 600);
  h += Z({ t, seed: 63, x: 860, y: 960, s: 0.82, pose: '턱괴기', ex: exprAt([[0, '걱정']], t), look: [0.8, -0.4], shiver: true });
  // headache marks
  [[760, 500, -20], [960, 480, 20]].forEach(([x, y, r], i) => { const k = (Math.sin(t * 6 + i) + 1) / 2; h += `<path transform="translate(${x} ${y}) rotate(${r}) scale(${f1((0.9 + 0.2 * k) * 100) / 100})" d="M-20 0 L-6 -18 L6 0 L20 -18" fill="none" stroke="${RED}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`; });
  h += bubble(1260, 380, 300, 170, donut(-60, 0, 0.75) + cake(70, 10, 0.75));
  if (a.study) h += pop(t, t - lt + 0.8, t + 99, 1260, 640, label(0, 0, '사흘 동안 물·우유만', { size: 38, bg: '#7CC7FF' }), { rot: -3, bob: 3 });
  return h;
}
const ICONS = {
  head: `<circle r="50" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-26 -4 L-12 -22 L0 -4 L12 -22 L26 -4" fill="none" stroke="${RED}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
  down: `<circle r="50" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M0 -26 L0 22 M-18 6 L0 24 L18 6" fill="none" stroke="#4FA3E0" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`,
  fog: `<circle r="50" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="-14" cy="4" r="16" fill="#C3CDD8"/><circle cx="10" cy="-6" r="20" fill="#C3CDD8"/><circle cx="18" cy="10" r="14" fill="#C3CDD8"/>`,
  crave: `<circle r="50" fill="#fff" stroke="${INK}" stroke-width="7"/>` + `<g transform="scale(.55)"><circle r="60" fill="#E0A060" stroke="${INK}" stroke-width="8"/><path d="M-54 -14 Q-40 -58 0 -58 Q44 -58 56 -12 Q40 6 20 -4 Q0 8 -20 -2 Q-40 8 -54 -14 Z" fill="#FF8FB1"/><circle r="20" fill="#2A1A10"/></g>`,
  heart: `<circle r="50" fill="#fff" stroke="${INK}" stroke-width="7"/><path transform="scale(1.3)" d="M0 14 C-30 -6 -24 -30 -10 -30 C-2 -30 0 -22 0 -18 C0 -22 2 -30 10 -30 C24 -30 30 -6 0 14 Z" fill="${PINK}" stroke="${INK}" stroke-width="3"/>`,
  drop: `<circle r="50" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M0 -26 L0 22 M-18 6 L0 24 L18 6" fill="none" stroke="#2FB37A" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`,
};
function listScene(t, lt, a) {
  let h = BG('url(#cream)') + BG('url(#paper)');
  h += outlined(860, 150, [a.title], { size: 64, sw: 13, fill: '#fff' });
  const D = a._dur || 8, F = [0, 0.27, 0.5, 0.72];
  a.rows.forEach(([txt, icon], i) => {
    const k = easeOutBack(clamp((lt - 0.2 - F[i] * D) / 0.45, 0, 1)), y = 290 + i * 128;
    h += `<g opacity="${f1(clamp(k, 0, 1) * 100) / 100}" transform="translate(${f1(lerp(-200, 0, clamp(k, 0, 1)))} 0)"><g transform="translate(400 ${y})">${ICONS[icon] || ICONS.down}</g><text x="490" y="${y + 20}" font-family="${FONT}" font-weight="900" font-size="56" fill="${NAVY}">${esc(txt)}</text></g>`;
  });
  h += `<text x="860" y="810" text-anchor="middle" font-family="${FONT}" font-weight="500" font-size="30" fill="#6B6255">${esc(a.src)}</text>`;
  h += Z({ t, seed: 64, x: 1660, y: 1000, s: 0.5, ex: exprAt([[0, '놀람']], t), pose: '서기', look: [-0.6, 0] });
  return h;
}
function coasterScene(t, lt0, a) {
  const lt = a.flat ? lt0 : (a._run != null ? a._run : lt0);
  let h = BG('url(#labG)') + BG('url(#grid)');
  const X0 = 240, X1 = 1680, BASE = 600;
  const yAt = x => a.flat ? BASE - 40 + Math.sin((x - X0) / 140) * 22 : BASE - 300 * Math.exp(-Math.pow((x - 640) / 120, 2)) + 170 * Math.exp(-Math.pow((x - 1000) / 130, 2)) - 20 * Math.exp(-Math.pow((x - 1400) / 300, 2));
  h += `<rect x="${X0 - 60}" y="180" width="${X1 - X0 + 120}" height="600" rx="24" fill="#06101C" stroke="${INK}" stroke-width="10"/>`;
  h += `<line x1="${X0}" y1="${BASE}" x2="${X1}" y2="${BASE}" stroke="#fff" stroke-width="4" stroke-dasharray="14 12" opacity=".4"/>`;
  h += `<text x="${X0}" y="230" font-family="${FONT}" font-weight="900" font-size="34" fill="${MINT}">혈당</text><text x="${X1}" y="760" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="28" fill="#9CB3C8">시간 →</text>`;
  const end = lerp(X0, X1, easeInOut(prog(lt, 0.2, 4.2)));
  let d = `M${X0} ${f1(yAt(X0))}`; for (let x = X0; x <= end; x += 12) d += ` L${x} ${f1(yAt(x))}`;
  h += `<path d="${d}" fill="none" stroke="${a.flat ? MINT : PINK}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (!a.flat) {
    h += pop(t, t - lt + 0.6, t + 99, 520, 300, cookie(0, 0, 0.7), {});
    if (end > 700) h += pop(t, t - lt + 1.6, t + 99, 700, 260, label(0, 0, '반짝!', { size: 40, bg: YEL }), { rot: -4 });
    if (end > 1000) h += pop(t, t - lt + 2.6, t + 99, 1060, 720, label(0, 0, '당 떨어짐…', { size: 40, bg: '#7CC7FF' }), { rot: 3 });
  } else h += pop(t, t - lt + 1.0, t + 99, 1500, 420, label(0, 0, '잔잔하게', { size: 44, bg: MINT }), { rot: -3 });
  // tiny Zero riding the line
  const ex = a.flat ? '뿌듯' : (end > 900 && end < 1150 ? '지침' : (end > 560 && end < 760 ? '신남' : '기본'));
  h += Z({ t, seed: 65, x: end, y: yAt(end) + 4, s: 0.26, pose: a.flat ? walkPose(t * 8, 0.8) : '서기', ex: exprAt([[0, ex]], t) });
  h += Z({ t, seed: 66, x: 1780, y: 1010, s: 0.5, pose: '턱괴기', ex: exprAt([[0, a.flat ? '뿌듯' : '걱정']], t), look: [-0.8, -0.4], light: -1, shade: '#B9D3E3' });
  return h;
}
function kidsScene(t, lt) {
  let h = BG('url(#cream)') + BG('url(#paper)');
  const plate = (x, y, items, c) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="40" rx="250" ry="70" fill="#fff" stroke="${INK}" stroke-width="8"/><ellipse cx="0" cy="34" rx="200" ry="50" fill="${c}" opacity=".25"/>${items}</g>`;
  h += plate(520, 500, soda(-120, -60, 0.55) + cake(20, -10, 0.9) + donut(140, -10, 0.7), PINK);
  const k = easeOut(prog(lt, 0.8, 1.4));
  h += `<g opacity="${f1(k * 100) / 100}"><line x1="300" y1="300" x2="740" y2="620" stroke="${RED}" stroke-width="18" stroke-linecap="round"/><line x1="740" y1="300" x2="300" y2="620" stroke="${RED}" stroke-width="18" stroke-linecap="round"/></g>`;
  h += `<path d="M860 500 L1020 500 M990 470 L1020 500 L990 530" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="${f1(k * 100) / 100}"/>`;
  const potato = `<ellipse cx="-110" cy="-10" rx="70" ry="44" fill="#C9965A" stroke="${INK}" stroke-width="7"/><path d="M-140 -20 Q-110 -40 -80 -20" fill="none" stroke="#fff" stroke-width="8"/>`;
  const pizza = `<path d="M10 -60 L90 40 L-50 40 Z" fill="#FFD27A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><circle cx="20" cy="10" r="12" fill="${RED}"/><circle cx="-10" cy="28" r="10" fill="${RED}"/>`;
  const corn = `<path d="M130 40 L110 -30 L190 -30 L170 40 Z" fill="#fff" stroke="${INK}" stroke-width="6"/>${[[130, -40], [150, -50], [170, -40], [140, -60], [160, -62]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#FFF3C8" stroke="${INK}" stroke-width="3"/>`).join('')}`;
  h += pop(t, t - lt + 1.4, t + 99, 1340, 500, plate(0, 0, potato + pizza + corn, MINT), {});
  h += pop(t, t - lt + 1.8, t + 99, 1340, 680, label(0, 0, '같은 열량 · 녹말 음식', { size: 38, bg: MINT }), {});
  h += label(520, 680, '설탕 음식', { size: 38, bg: PINK });
  const done = Math.floor(clamp((lt - 2.2) * 2.4, 0, 9));
  h += `<g transform="translate(760 140)"><rect x="-10" y="-50" width="420" height="110" rx="18" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 9; i++) h += `<rect x="${10 + i * 44}" y="-30" width="36" height="70" rx="8" fill="${i < done ? MINT : '#EEF2F6'}" stroke="${INK}" stroke-width="3"/>${i < done ? `<path d="M${18 + i * 44} 4 L${26 + i * 44} 14 L${40 + i * 44} -8" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` : ''}`;
  h += `</g>`;
  return h;
}
function liverScene(t, lt, a) {
  let h = BG('url(#labG)') + BG('url(#grid)');
  h += `<rect x="-600" y="840" width="3120" height="600" fill="#0E1C30"/>`;
  h += `<rect x="520" y="110" width="880" height="640" rx="28" fill="#06101C" stroke="${INK}" stroke-width="12"/><rect x="540" y="130" width="840" height="600" rx="18" fill="url(#grid)"/>`;
  h += `<ellipse cx="960" cy="440" rx="420" ry="280" fill="url(#glow)" opacity="${a.light ? .55 : .25}"/>`;
  const shrink = a.light ? 1 - 0.55 * easeInOut(prog(lt, 0.3, 3)) : 1;
  let L = `<g transform="translate(960 450)"><path d="M-300 -60 Q-300 -170 -150 -170 Q60 -180 250 -130 Q330 -100 300 -40 Q260 40 120 90 Q-60 160 -180 150 Q-300 130 -300 -60 Z" fill="#C0504D" stroke="${INK}" stroke-width="10"/><path d="M-260 -80 Q-150 -140 -40 -140" fill="none" stroke="#E07A70" stroke-width="16" stroke-linecap="round"/><path d="M40 -160 Q10 0 -60 140" fill="none" stroke="#8A3030" stroke-width="7" opacity=".6"/>`;
  const drops = [[-200, -40, 26], [-120, 30, 22], [-40, -60, 30], [60, -20, 24], [150, -70, 20], [100, 40, 26], [-160, 90, 18], [-20, 60, 20], [200, 0, 18], [-240, 20, 16]];
  drops.forEach(([x, y, r], i) => { const rr = r * (a.light ? shrink : (0.6 + 0.4 * clamp(lt / 2 - i * 0.05, 0, 1))); if (rr > 2) L += `<circle cx="${x}" cy="${y}" r="${f1(rr)}" fill="#FFD25A" stroke="${INK}" stroke-width="4" opacity=".95"/>`; });
  if (a.light) L += `<circle cx="-40" cy="-40" r="52" fill="#C0504D"/><circle cx="60" cy="-50" r="52" fill="#C0504D"/><ellipse cx="10" cy="20" rx="70" ry="34" fill="#C0504D"/><circle cx="-40" cy="-40" r="13" fill="${INK}"/><circle cx="60" cy="-50" r="13" fill="${INK}"/><circle cx="-36" cy="-44" r="4" fill="#fff"/><circle cx="64" cy="-54" r="4" fill="#fff"/><path d="M-26 6 Q12 44 50 2" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><ellipse cx="-90" cy="0" rx="20" ry="10" fill="#FF8A9A" opacity=".7"/><ellipse cx="110" cy="-14" rx="20" ry="10" fill="#FF8A9A" opacity=".7"/>`;
  L += `</g>`;
  h += L;
  if (!a.light) {
    h += soda(640, 300, 0.6);
    for (let i = 0; i < 7; i++) { const k = ((t * 0.5 + i / 7) % 1); const x = lerp(690, 900, k), y = lerp(280, 400, k) + Math.sin(k * 8 + i) * 12; h += `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M-12 -7 L0 -14 L12 -7 L12 7 L0 14 L-12 7 Z" fill="#FF9A55" stroke="${INK}" stroke-width="3"/></g>`; }
    h += label(1180, 180, '과당 → 지방', { size: 36, bg: '#FF9A55' });
  } else {
    h += particles(t, 31, 14, [620, 180, 1300, 700], YEL, { speed: 50, r: 6, op: 0.8 });
    h += label(1180, 180, '간이 가벼워졌다', { size: 36, bg: MINT });
  }
  h += doctor(300, 960, 0.6, { t, tilt: 4, pose: 'point', expr: a.light ? '미소' : '진지', talk: env(t) });
  h += Z({ t, seed: 67, x: 1620, y: 960, s: 0.62, ex: exprAt([[0, a.light ? '신남' : '걱정']], t), look: [-0.8, -0.5], light: -1, shade: '#B9D3E3' });
  return h;
}
function tasteScene(t, lt, a) {
  let h = BG('url(#dayRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".25"/>');
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#C9AE8C"/>`;
  const amazed = a.sweet && lt > 0.8, sad = a.back && lt > 1.5;
  h += Z({ t, seed: 68, x: 820, y: 960, s: 0.8, pose: '책상', ex: exprAt([[0, amazed ? '놀람' : (sad ? '걱정' : '기본')]], t), look: [0.2, 0.6] });
  h += `<rect x="440" y="740" width="900" height="40" rx="10" fill="#8C6638" stroke="${INK}" stroke-width="8"/><rect x="480" y="780" width="820" height="320" fill="#7A5A32" stroke="${INK}" stroke-width="8"/>`;
  h += a.back ? cake(640, 712, 0.8) : pudding(650, 708, 0.95);
  // sweetness meter
  const base = 0.38, lvl = a.sweet ? lerp(base, 0.9, easeOut(prog(lt, 0.3, 1.6))) : (a.back ? lerp(0.9, base, easeInOut(prog(lt, 0.8, 2.6))) : base);
  h += `<g transform="translate(1560 720)"><rect x="-56" y="-470" width="112" height="470" rx="56" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="-40" y="${f1(-12 - 440 * lvl)}" width="80" height="${f1(440 * lvl)}" rx="40" fill="${PINK}"/><text x="0" y="60" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="38" fill="${NAVY}">단맛 느낌</text></g>`;
  if (amazed) { h += particles(t, 33, 18, [600, 450, 1050, 700], YEL, { speed: 60, r: 7, op: 0.9 }); h += pop(t, t - lt + 0.9, t + 99, 1200, 380, label(0, 0, '더 달다!', { size: 48, bg: YEL }), { rot: -5, bob: 5 }); }
  if (a.back && lt > 1.0) h += pop(t, t - lt + 1.0, t + 99, 1180, 380, label(0, 0, '다시 예전 입맛', { size: 44, bg: '#C3CDD8' }), { rot: 4, bob: 4 });
  if (!a.sweet && !a.back) {
    h += `<g transform="translate(330 300)"><rect x="-130" y="-110" width="260" height="230" rx="16" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-130" y="-110" width="260" height="66" rx="16" fill="${RED}" stroke="${INK}" stroke-width="7"/><text x="0" y="-62" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="36" fill="#fff">당 줄이기</text><text x="0" y="70" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="84" fill="${NAVY}">${Math.min(3, 1 + Math.floor(lt / 2))}개월</text></g>`;
  }
  return h;
}
function comfortScene(t, lt) {
  let h = BG('url(#nightRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".3"/>');
  h += windowNight(1300, 140, 380, 300, t);
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#10152B"/>`;
  h += `<path d="M300 300 L360 300 L360 760" fill="none" stroke="${INK}" stroke-width="8"/><path d="M250 300 L410 300 L380 230 L280 230 Z" fill="#FFC56E" stroke="${INK}" stroke-width="6"/><circle cx="330" cy="420" r="380" fill="url(#amber)" opacity=".8"/>`;
  h += sofa(560, 600);
  h += Z({ t, seed: 69, x: 870, y: 930, s: 0.8, pose: '폰보기', ex: exprAt([[0, lt > 3.5 ? '신남' : '지침']], t), look: [0, 0.7], light: 1, shade: '#E8C9A8' });
  const [hx, hy] = handG(870, 930, 0.8, [200, 318]);
  h += cookie(hx, hy - 4, 0.62) + hand(hx - 26, hy + 8, 0.8) + hand(hx + 26, hy + 8, 0.8);
  h += pop(t, t - lt + 3.4, t + 99, 1200, 560, heart(0, 0, 2.2, PINK), { bob: 6 });
  return h;
}
function momentsScene(t, lt, a) {
  let h = BG('url(#sunset)');
  const D = a._dur || 9, F = [0.45, 0.61, 0.76];
  const panel = (i, inner, title) => { const k = easeOutBack(clamp((lt - 0.1 - F[i] * D) / 0.45, 0, 1)); const x = 340 + i * 620; return `<g transform="translate(${x} 470) scale(${f1(clamp(k, 0, 1.15) * 1000) / 1000})" opacity="${f1(clamp(k, 0, 1) * 100) / 100}"><rect x="-270" y="-280" width="540" height="480" rx="30" fill="#fff" stroke="${INK}" stroke-width="9"/><g clip-path="url(#pclip)">${inner}</g>${label(0, 250, title, { size: 36, bg: [YEL, PINK, MINT][i] })}</g>`; };
  const sky1 = `<rect x="-260" y="-270" width="520" height="460" rx="22" fill="#FFE9C8"/><circle cx="120" cy="-170" r="60" fill="#FFD27A"/><rect x="-260" y="60" width="520" height="130" fill="#E3E8F4"/>` + Z({ t, seed: 70, x: -20, y: 170, s: 0.5, pose: '만세', ex: exprAt([[0, '신남']], t) });
  const fr = `<rect x="-260" y="-270" width="520" height="460" rx="22" fill="#E6F2FF"/><rect x="-260" y="90" width="520" height="100" fill="#B88C66"/>` + char({ t, seed: 71, x: -130, y: 170, s: 0.42, pose: '손인사', ex: { expr: '신남', prev: '신남', k: 1, blink: 0 }, goggles: 'none', vest: '#7CC7FF', patch: false, tee: true, hair: '#2A2A2A' }) + Z({ t, seed: 72, x: 0, y: 170, s: 0.42, pose: '서기', ex: exprAt([[0, '신남']], t) }) + char({ t, seed: 73, x: 130, y: 170, s: 0.42, pose: '서기', ex: { expr: '뿌듯', prev: '뿌듯', k: 1, blink: 0 }, goggles: 'none', vest: '#FF8FB1', patch: false, tee: true, hair: '#6B3E26' }) + `<g transform="translate(-60 -170)">${label(0, 0, 'ㅋㅋㅋ', { size: 30, bg: YEL })}</g>`;
  const walk = `<rect x="-260" y="-270" width="520" height="460" rx="22" fill="#F59A6A"/><circle cx="-100" cy="-100" r="70" fill="#FFD27A"/><rect x="-260" y="80" width="520" height="110" fill="#D9C7B0"/>` + Z({ t, seed: 74, x: 0, y: 160, s: 0.45, pose: walkPose(t * 7, 0.8), ex: exprAt([[0, '뿌듯']], t), light: -1, shade: '#F3C9A8' });
  const fade = 1 - clamp((lt - (F[0] * D - 0.4)) / 0.5, 0, 1);
  if (fade > 0) h += `<g opacity="${f1(fade * 100) / 100}">${outlined(960, 330, [[['진짜 ', '#fff'], ['달콤함', YEL], ['은?', '#fff']]], { size: 110, sw: 20 })}${heart(960, 560, 3.2, PINK)}${Z({ t, seed: 76, x: 960, y: 900, s: 0.5, pose: '턱괴기', ex: exprAt([[0, '기본']], t), look: [0, -0.6], light: -1, shade: '#F3C9A8' })}</g>`;
  h += panel(0, sky1, '푹 자고 일어난 아침') + panel(1, fr, '친구와의 수다') + panel(2, walk, '천천히 걷는 저녁');
  h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#FF9A5A" opacity=".08"/>`;
  return h;
}
function teaScene(t, lt, a) {
  let h = BG('url(#sunset)');
  h += `<circle cx="1450" cy="430" r="90" fill="#FFD27A" opacity=".95"/><circle cx="1450" cy="430" r="240" fill="url(#warm)"/>`;
  h += clouds(t, 80, 18, 4, 3);
  h += `<rect x="-600" y="860" width="3120" height="600" fill="#D9A07A"/><line x1="-600" y1="860" x2="2520" y2="860" stroke="${INK}" stroke-width="7"/>`;
  h += Z({ t, seed: 75, x: 900, y: 960, s: 0.85, pose: '폰보기', ex: exprAt([[0, '신남']], t), look: [0, 0.3], light: -1, shade: '#F3C9A8' });
  const [hx, hy] = handG(900, 960, 0.85, [200, 318]);
  h += mug(hx, hy - 10, 0.8, t) + hand(hx - 34, hy + 10, 0.85) + hand(hx + 34, hy + 10, 0.85);
  for (let i = 0; i < 6; i++) { const k = ((t * 0.25 + i / 6) % 1); const hx0 = [560, 640, 720, 1080, 1160, 1240][i]; h += `<g opacity="${f1(Math.sin(k * Math.PI) * 100) / 100}">${heart(hx0 + Math.sin(t + i) * 16, 760 - k * 460, 1 + (i % 3) * 0.3, [PINK, YEL, MINT][i % 3])}</g>`; }
  if (a.ask) h += pop(t, t - lt + 0.3, t + 99, 1340, 360, `<path d="M-300 -90 L300 -90 Q330 -90 330 -60 L330 50 Q330 80 300 80 L-60 80 L-110 140 L-100 80 L-300 80 Q-330 80 -330 50 L-330 -60 Q-330 -90 -300 -90 Z" fill="#fff" stroke="${INK}" stroke-width="7"/><text x="0" y="12" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="44" fill="${NAVY}">나만의 작은 달콤함은?</text>`, { rot: 3, bob: 5 });
  h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#FF9A5A" opacity=".1"/>`;
  return h;
}
function thanksScene(t, lt) {
  let h = BG(NAVY) + BG('url(#grid)');
  h += `<ellipse cx="960" cy="520" rx="760" ry="420" fill="url(#warm)" opacity=".35"/>`;
  h += particles(t, 77, 30, [0, 0, 1920, 1080], YEL, { speed: 30, r: 5, op: 0.6 });
  for (let i = 0; i < 8; i++) { const k = ((t * 0.2 + i / 8) % 1); const hx0 = [140, 260, 380, 500, 1420, 1540, 1660, 1780][i]; h += `<g opacity="${f1(Math.sin(k * Math.PI) * 80) / 100}">${heart(hx0, 900 - k * 800, 1.2, [PINK, YEL, MINT][i % 3])}</g>`; }
  h += pop(t, t - lt + 0.2, t + 99, 960, 250, outlined(0, 0, [[['끝까지 함께해 주셔서', '#fff']], [['고맙습니다', YEL]]], { size: 100, sw: 18 }), {});
  h += `<ellipse cx="960" cy="905" rx="420" ry="66" fill="url(#glow)"/><ellipse cx="960" cy="905" rx="360" ry="54" fill="#2E4260" stroke="${INK}" stroke-width="8"/>`;
  h += doctor(760, 960, 0.55, { t, expr: '미소', talk: env(t) });
  h += Z({ t, seed: 78, x: 1160, y: 890, s: 0.62, pose: '손인사', ex: exprAt([[0, '신남']], t) });
  h += pop(t, t - lt + 1.2, t + 99, 960, 445, label(0, 0, '상식실험실', { size: 46, bg: MINT }), {});
  return h;
}
