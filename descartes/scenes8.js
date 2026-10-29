/* ---------- experiment 007 · doubt everything like Descartes ---------- */
const WALNUT = '#7A5235', PARCH = '#F3E6CC', BAROQ = '#5B3A8E', TILE = '#5E9C8A';
var CAMS = {
  dc: [1.0, 1.05, 960, 540], zipper: [1.0, 1.05, 960, 540], bat: [1.0, 1.04, 960, 520], news: [1.0, 1.06, 960, 540],
  split: [1.0, 1.04, 960, 520], demon: [1.0, 1.08, 960, 540], faces: [1.0, 1.04, 960, 520], cogito: [1.0, 1.1, 960, 520],
  forest: [1.0, 1.03, 960, 540], grads: [1.0, 1.04, 960, 520], sweden: [1.0, 1.06, 960, 540], lamp: [1.0, 1.06, 960, 540]
};
const T8 = (x, y, txt, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${o.anchor || 'middle'}" font-family="${FONT}" font-weight="${o.w || 900}" font-size="${o.size || 36}" fill="${o.fill || NAVY}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 6}" paint-order="stroke"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}>${esc(txt)}</text>`;
function qmarks(t, seed, n, box, o = {}) {
  let h = '';
  for (let i = 0; i < n; i++) {
    const k = ((t * (o.speed || 0.12) + hash(seed + i * 1.7)) % 1);
    const x = box[0] + hash(seed + i * 3.1) * box[2], y = box[1] + box[3] - k * box[3], sz = (o.size || 60) * (0.7 + 0.6 * hash(seed + i));
    h += `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${f1(sz)}" fill="${o.color || YEL}" stroke="${INK}" stroke-width="5" paint-order="stroke" opacity="${f1(Math.sin(k * Math.PI) * (o.op || 0.9) * 100) / 100}" transform="rotate(${f1((hash(seed + i * 5) - 0.5) * 40)} ${f1(x)} ${f1(y)})">?</text>`;
  }
  return h;
}
const qStamp = (x, y, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><circle r="44" fill="${YEL}" stroke="${INK}" stroke-width="6"/>${T8(0, 22, '?', { size: 64 })}</g>`;
const check = (x, y, s = 1, c = MINT) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><circle r="34" fill="${c}" stroke="${INK}" stroke-width="6"/><path d="M-16 0 L-4 13 L18 -12" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></g>`;
const xMark = (x, y, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-60 -60 L60 60 M60 -60 L-60 60" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M-60 -60 L60 60 M60 -60 L-60 60" stroke="${RED}" stroke-width="18" stroke-linecap="round"/></g>`;
function panel(x, y, w, hh, o = {}) { return `<rect x="${x + 8}" y="${y + 10}" width="${w}" height="${hh}" rx="${o.r || 26}" fill="${INK}" opacity=".25"/><rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.r || 26}" fill="${o.fill || '#fff'}" stroke="${INK}" stroke-width="${o.sw || 7}"/>`; }
function hbar(x, y, w, hh, k, c, txt, o = {}) {
  let h = `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${hh / 2}" fill="${o.track || '#E6E0D4'}" stroke="${INK}" stroke-width="5"/>`;
  if (k > 0.001) h += `<rect x="${x}" y="${y}" width="${f1(Math.max(hh, w * k))}" height="${hh}" rx="${hh / 2}" fill="${c}" stroke="${INK}" stroke-width="5"/>`;
  if (txt) h += T8(x - 24, y + hh * 0.72, txt, { anchor: 'end', size: o.size || 38, fill: o.lc || NAVY });
  return h;
}
function vbar(x, base, w, maxH, k, c, top, bottom, o = {}) {
  const hh = maxH * k;
  let h = `<rect x="${x - w / 2}" y="${f1(base - hh)}" width="${w}" height="${f1(Math.max(1, hh))}" rx="12" fill="${c}" stroke="${INK}" stroke-width="6"/>`;
  if (top && k > 0.05) h += T8(x, base - hh - 26, top, { size: o.ts || 46, fill: o.tc || NAVY });
  if (bottom) h += T8(x, base + 52, bottom, { size: o.bs || 34, fill: o.bc || NAVY });
  return h;
}

/* ---------- small props ---------- */
function wigG(x, y, s) {
  let w = '';
  for (const sd of [-1, 1]) {
    for (let k = 0; k < 7; k++) { const yy = 112 + k * 34, xx = 200 + sd * (116 + (k > 4 ? -6 : 0) + Math.sin(k * 1.7) * 4); w += `<circle cx="${f1(xx)}" cy="${yy}" r="${k > 4 ? 30 : 34}"/>`; }
    for (let k = 0; k < 3; k++) w += `<circle cx="${f1(200 + sd * (84 - k * 4))}" cy="${292 + k * 26}" r="27"/>`;
  }
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000}) translate(-200 -170)"><g fill="#6B4A2E" stroke="${INK}" stroke-width="5">${w}</g><path d="M84 168 Q76 62 200 54 Q324 62 316 168 Q306 128 276 118 Q244 96 204 104 L200 70 L196 104 Q156 96 124 118 Q94 128 84 168 Z" fill="#6B4A2E" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`;
}
function collarG(x, y, s, rot = 0) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000}) translate(-200 -280)"><path d="M146 262 Q200 248 254 262 L262 302 Q230 314 200 300 Q170 314 138 302 Z" fill="#FBFAF6" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>`; }
function chalkboard(x, y, w, hh) { return `<rect x="${x - 16}" y="${y - 16}" width="${w + 32}" height="${hh + 32}" rx="14" fill="${WALNUT}" stroke="${INK}" stroke-width="8"/><rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="6" fill="#2F4A3E" stroke="${INK}" stroke-width="5"/>`; }
function study8(t, o = {}) { // a 17th-century room: panelled walls, window, tiled stove
  let h = BG(o.dark ? '#3A2E44' : '#E8D7B8') + BG('url(#hatch)').replace('/>', ' opacity=".25"/>');
  for (let i = 0; i < 8; i++) h += `<rect x="${-200 + i * 300}" y="560" width="250" height="300" rx="10" fill="none" stroke="#B89A6E" stroke-width="6" opacity=".7"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#8C6A44"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 12; i++) h += `<line x1="${-300 + i * 220}" y1="880" x2="${-420 + i * 260}" y2="1480" stroke="#7A5A38" stroke-width="5"/>`;
  return h;
}
function snowWindow(x, y, w, hh, t, night) {
  let h = `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="10" fill="${night ? '#1B2550' : '#B9D4EA'}" stroke="${INK}" stroke-width="10"/>`;
  for (let i = 0; i < 22; i++) { const k = (t * 0.15 + hash(i * 2.3)) % 1, sx = x + 14 + hash(i * 7.1) * (w - 28) + Math.sin(t * 2 + i) * 6, sy = y + 10 + k * (hh - 20); h += `<circle cx="${f1(sx)}" cy="${f1(sy)}" r="${f1(3 + hash(i) * 4)}" fill="#fff" opacity=".9"/>`; }
  h += `<path d="M${x} ${y + hh - 30} Q${x + w / 2} ${y + hh - 54} ${x + w} ${y + hh - 30} L${x + w} ${y + hh} L${x} ${y + hh} Z" fill="#fff"/>`;
  h += `<line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + hh}" stroke="${INK}" stroke-width="8"/><line x1="${x}" y1="${y + hh / 2}" x2="${x + w}" y2="${y + hh / 2}" stroke="${INK}" stroke-width="8"/>`;
  return h;
}
function stove(x, y, t) { // tiled stove, base at y
  let h = `<circle cx="${x}" cy="${y - 200}" r="260" fill="url(#amber)" opacity="${f1((0.55 + Math.sin(t * 5) * 0.05) * 100) / 100}"/>`;
  h += `<rect x="${x - 120}" y="${y - 440}" width="240" height="440" rx="18" fill="${TILE}" stroke="${INK}" stroke-width="8"/>`;
  for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) h += `<rect x="${x - 108 + c * 74}" y="${y - 428 + r * 70}" width="68" height="62" rx="8" fill="#6FB09C" stroke="#3E7565" stroke-width="4"/>`;
  h += `<rect x="${x - 60}" y="${y - 130}" width="120" height="90" rx="10" fill="#2A1B12" stroke="${INK}" stroke-width="6"/><path d="M${x - 34} ${y - 44} Q${x - 20} ${f1(y - 96 - Math.sin(t * 9) * 8)} ${x} ${y - 60} Q${x + 18} ${f1(y - 104 - Math.sin(t * 7) * 8)} ${x + 34} ${y - 44} Z" fill="#FFB547" stroke="${INK}" stroke-width="4"/>`;
  h += `<rect x="${x - 140}" y="${y - 470}" width="280" height="40" rx="10" fill="#4E8A78" stroke="${INK}" stroke-width="7"/>`;
  return h;
}
function deskG(x, y, w = 520) { return `<rect x="${x - w / 2}" y="${y}" width="${w}" height="30" rx="8" fill="${WALNUT}" stroke="${INK}" stroke-width="7"/><rect x="${x - w / 2 + 30}" y="${y + 30}" width="26" height="${880 - y - 30}" fill="#6A4529" stroke="${INK}" stroke-width="6"/><rect x="${x + w / 2 - 56}" y="${y + 30}" width="26" height="${880 - y - 30}" fill="#6A4529" stroke="${INK}" stroke-width="6"/>`; }

/* ---------- hook: what is really certain? ---------- */
function hookScene(t, lt, a) {
  const D = D_(a);
  let h = livingRoom(t, false);
  const x = 960, y = 1000, s = 0.84;
  h += Z({ t, seed: 700, x, y, s, pose: '폰보기', ex: exprAt([[0, '기본'], [0.05 * D, '놀람'], [0.3 * D, '기본'], [0.55 * D, '걱정'], [0.78 * D, '놀람']], lt), look: lt > 0.78 * D ? [0, -0.8] : [0, 0.9] });
  const [px, py] = handG(x, y, s, [200, 318]);
  h += phone(px, py - 6, 0.42, { on: 1 }) + hand(px - 24, py + 8, s) + hand(px + 24, py + 8, s);
  const cards = [
    [0.04, 460, 300, `<rect x="-300" y="-110" width="600" height="220" rx="24" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-300" y="-110" width="600" height="58" rx="24" fill="#FFE14D" stroke="${INK}" stroke-width="7"/>${T8(-270, -70, '단톡방 (23)', { anchor: 'start', size: 30 })}<rect x="-270" y="-28" width="540" height="110" rx="20" fill="#F2F4F7" stroke="${INK}" stroke-width="4"/>${T8(0, 14, '[속보] 충격!! 이거 실화?', { size: 38, fill: RED })}${T8(0, 62, '링크 ▶ 지금 바로 확인', { size: 28, fill: '#6B7A8C', w: 700 })}`],
    [0.3, 1460, 300, `<path d="M-280 -80 L280 -80 Q310 -80 310 -50 L310 50 Q310 80 280 80 L-60 80 L-110 140 L-100 80 L-280 80 Q-310 80 -310 50 L-310 -50 Q-310 -80 -280 -80 Z" fill="#fff" stroke="${INK}" stroke-width="7"/>${T8(0, 14, '그건 상식이지~ 다 알잖아', { size: 40 })}`],
    [0.55, 1420, 640, bubble(0, 0, 520, 150, `${T8(50, 14, '분명 여기 뒀는데…', { size: 40 })}<g transform="translate(-215 0) rotate(-20) scale(.8)"><circle r="22" fill="none" stroke="#C9A04A" stroke-width="9"/><rect x="18" y="-6" width="60" height="12" fill="#C9A04A" stroke="${INK}" stroke-width="3"/></g>`)]
  ];
  cards.forEach(([f, cx, cy, g], i) => {
    if (lt < f * D) return;
    h += pop(t, t - lt + f * D, t + 99, cx, cy, g, { rot: [-3, 3, -2][i], bob: 4 });
    if (lt > 0.78 * D + i * 0.15) h += pop(t, t - lt + 0.78 * D + i * 0.15, t + 99, cx + [260, 270, 230][i], cy - 90, qStamp(0, 0, 1), { rot: 12 });
  });
  if (lt > 0.82 * D) h += pop(t, t - lt + 0.82 * D, t + 99, 960, 130, outlined(0, 0, [[['정말 ', '#fff'], ['확실한 건?', YEL]]], { size: 84, sw: 16 }), {});
  return h;
}

/* ---------- Descartes intro ---------- */
function dcScene(t, lt, a) {
  const D = D_(a);
  if (a.k === 2) { // 1619 winter: a whole day in a stove-heated room
    let h = study8(t) + snowWindow(1240, 170, 380, 320, t, false) + `<g opacity="${f1(prog(lt, 0.55 * D, 0.75 * D) * 100) / 100}">${snowWindow(1240, 170, 380, 320, t, true)}</g>`;
    h += stove(560, 880, t);
    h += deskG(1180, 700) + candle(1360, 700, t) + notebook(1080, 690, 1.1, -8);
    h += DC({ t, seed: 701, x: 1060, y: 960, s: 0.78, pose: '턱괴기', ex: exprAt([[0, '기본'], [0.5 * D, '결심']], lt), look: [-0.4, -0.5] });
    h += pop(t, t - lt + 0.2, t + 99, 1500, 120, label(0, 0, '1619년 겨울 · 난로가 있는 방', { size: 36, bg: YEL }), { rot: 2 });
    h += bubble(1500, 560 - 0 * 0, 300, 120, `${T8(14, 18, '음…', { size: 46 })}`);
    const dk = prog(lt, 0.35 * D, 0.9 * D);
    if (dk > 0) h += pop(t, t - lt + 0.35 * D, t + 99, 330, 220, `<g>${wallClock(0, 0, 70, 9 + dk * 12, (dk * 720) % 60)}</g>`, {}) + pop(t, t - lt + 0.4 * D, t + 99, 330, 330, label(0, 0, '하루 종일', { size: 32, bg: '#fff' }), {});
    return h;
  }
  if (a.k === 1) { // coordinates
    let h = study8(t) + chalkboard(760, 150, 960, 600);
    const k = easeOut(prog(lt, 0.15 * D, 0.5 * D)), ox = 980, oy = 620;
    for (let i = 1; i < 8; i++) h += `<line x1="${ox + i * 90}" y1="${oy}" x2="${ox + i * 90}" y2="${oy - 420 * k}" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>`;
    for (let i = 1; i < 5; i++) h += `<line x1="${ox}" y1="${oy - i * 90}" x2="${ox + 660 * k}" y2="${oy - i * 90}" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>`;
    h += `<line x1="${ox - 40}" y1="${oy}" x2="${f1(ox + 680 * k)}" y2="${oy}" stroke="#F4F1EA" stroke-width="7" stroke-linecap="round"/><line x1="${ox}" y1="${oy + 40}" x2="${ox}" y2="${f1(oy - 440 * k)}" stroke="#F4F1EA" stroke-width="7" stroke-linecap="round"/>`;
    if (k > 0.95) h += T8(ox + 700, oy + 14, 'x', { size: 56, fill: '#F4F1EA' }) + T8(ox, oy - 470, 'y', { size: 56, fill: '#F4F1EA' });
    const pk = prog(lt, 0.5 * D, 0.7 * D);
    if (pk > 0) {
      const px = ox + 3 * 90, py = oy - 2 * 90;
      h += `<line x1="${px}" y1="${oy}" x2="${px}" y2="${py}" stroke="${YEL}" stroke-width="5" stroke-dasharray="14 10" opacity="${pk}"/><line x1="${ox}" y1="${py}" x2="${px}" y2="${py}" stroke="${YEL}" stroke-width="5" stroke-dasharray="14 10" opacity="${pk}"/>`;
      h += pop(t, t - lt + 0.5 * D, t + 99, px, py, `<circle r="16" fill="${YEL}" stroke="${INK}" stroke-width="5"/>${T8(70, -24, '(3, 2)', { size: 40, fill: YEL })}`, {});
    }
    h += DC({ t, seed: 702, x: 470, y: 960, s: 0.8, pose: '손인사', ex: exprAt([[0, '뿌듯']], t), look: [0.7, -0.3] });
    h += Z({ t, seed: 703, x: 1720, y: 1000, s: 0.5, ex: exprAt([[0, '기본'], [0.55 * D, '놀람']], lt), look: [-0.8, -0.4] });
    if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 1240, 830, label(0, 0, '좌표 = 데카르트 좌표계', { size: 36, bg: MINT }), { rot: -2 });
    return h;
  }
  if (a.k === 3) { // decision
    let h = BG('#2B2140') + BG('url(#dots)');
    h += `<circle cx="960" cy="560" r="420" fill="url(#warm)" opacity=".35"/>`;
    h += qmarks(t, 7, 18, [80, 80, 1760, 820], { size: 70, speed: 0.1 });
    h += DC({ t, seed: 704, x: 960, y: 1000, s: 0.85, pose: lt > 0.35 * D ? '만세' : '서기', ex: exprAt([[0, '결심'], [0.35 * D, '신남']], lt) });
    if (lt > 0.3 * D) h += pop(t, t - lt + 0.3 * D, t + 99, 960, 170, outlined(0, 0, [[['의심할 수 있는 건, ', '#fff'], ['전부 의심!', YEL]]], { size: 78, sw: 15 }), {});
    return h;
  }
  let h = BG(PARCH) + BG('url(#paper)');
  h += `<circle cx="760" cy="560" r="380" fill="url(#warm)" opacity=".6"/>`;
  h += qmarks(t, 3, 10, [1100, 160, 700, 600], { size: 64, speed: 0.08, op: 0.7 });
  h += pop(t, t - lt + 0.15, t + 99, 760, 960, shadow(0, 4, 110) + DC({ t, seed: 705, x: 0, y: 0, s: 0.92, ex: exprAt([[0, '결심']], t), look: [0.4, -0.2] }), { noPop: true, inDur: 0.4 });
  h += pop(t, t - lt + 0.2, t + 99, 1400, 300, outlined(0, 0, [[['약 ', '#fff'], ['400년 전', YEL]]], { size: 96, sw: 18 }), {});
  if (lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 1400, 470, label(0, 0, '르네 데카르트', { size: 52, bg: YEL }), {});
  if (lt > 0.65 * D) h += pop(t, t - lt + 0.65 * D, t + 99, 1400, 570, label(0, 0, '1596–1650 · 프랑스 철학자', { size: 32, bg: '#fff' }), {});
  return h;
}

/* ---------- title (wig + collar fly in) ---------- */
const LIST8 = ['① 당연한 것 의심', '② 빠른 답 의심', '③ 잘게 나누기', '④ 보이는 것 의심', '⑤ 숲에선 곧장'];
function titleScene(t, lt, a) {
  let h = BG('url(#labG)') + BG('url(#grid)');
  h += particles(t, 5, 40, [0, 0, 1920, 1080], MINT, { speed: 40, r: 4, op: 0.6 });
  h += `<ellipse cx="960" cy="900" rx="320" ry="70" fill="url(#glow)"/><ellipse cx="960" cy="900" rx="260" ry="54" fill="#2E4260" stroke="${INK}" stroke-width="8"/>`;
  h += doctor(520, 960, 0.55, { t, expr: '미소', talk: env(t) });
  if (a.list) {
    h += outlined(960, 130, ['만약에, 데카르트처럼 모든 걸 의심한다면?'], { size: 58, sw: 12, fill: YEL });
    const fs = 36; const rows = [LIST8.slice(0, 3), LIST8.slice(3)];
    let n = 0;
    rows.forEach((row, r) => {
      const ws = row.map(s => s.length * fs * 0.92 + 48), gap = 30, tot = ws.reduce((p, c) => p + c, 0) + gap * (row.length - 1);
      let x = 960 - tot / 2;
      row.forEach((it, i) => { h += pop(t, t - lt + 0.2 + n * 0.4, t + 99, f1(x + ws[i] / 2), 260 + r * 92, label(0, 0, it, { size: fs, bg: n === 4 ? YEL : MINT }), {}); x += ws[i] + gap; n++; });
    });
    h += Z({ t, seed: 7, x: 960, y: 890, s: 0.6, pose: walkPose(t * 7, 0.6), ex: exprAt([[0, '결심']], t) });
    return h;
  }
  h += pop(t, t - lt + 0.2, t + 99, 960, 230, outlined(0, 0, [[['만약에, ', YEL], ['데카르트처럼', '#fff']], '모든 걸 의심한다면?'], { size: 92, sw: 18 }), {});
  const land = 1.55, on = lt >= land, fly = easeInOut(prog(lt, 0.8, land));
  h += Z({ t, seed: 7, x: 960, y: 890, s: 0.6, pose: on ? '만세' : '서기', ex: exprAt([[0, '기본'], [land, '놀람'], [land + 0.7, '신남']], lt), wig: on ? '#6B4A2E' : false, bandCollar: on });
  if (!on && lt > 0.8) {
    h += wigG(lerp(1500, 960, fly), lerp(300, 656, fly) - Math.sin(fly * Math.PI) * 120, lerp(0.9, 0.6, fly));
    h += collarG(lerp(420, 960, fly), lerp(380, 722, fly) - Math.sin(fly * Math.PI) * 100, lerp(0.9, 0.6, fly), lerp(-200, 0, fly));
  }
  if (lt > land && lt < land + 0.5) { const k = prog(lt, land, land + 0.5); h += `<circle cx="960" cy="700" r="${f1(40 + 140 * k)}" fill="none" stroke="${YEL}" stroke-width="8" opacity="${f1((1 - k) * 100) / 100}"/>`; }
  if (lt > land) h += pop(t, t - lt + land + 0.1, t + 99, 1240, 600, label(0, 0, '곱슬 가발 + 흰 칼라 장착!', { size: 36, bg: YEL }), { rot: 5, bob: 4 });
  return h;
}

/* ---------- myth: doubt is a tool, not a refusal to believe ---------- */
function houseG(x, y, s, crack = 0, built = 1) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  const rows = 6;
  for (let r = 0; r < rows; r++) for (let c = 0; c < 6; c++) {
    const idx = r * 6 + c; if (idx / 36 > built) continue;
    const fall = crack > 0 ? clamp(crack * 1.6 - hash(idx) * 0.6, 0, 1) : 0;
    const dx = (hash(idx * 3) - 0.5) * 200 * fall, dy = fall * fall * 420, rot = (hash(idx * 7) - 0.5) * 120 * fall;
    h += `<rect x="${-180 + c * 60 + (r % 2) * 0}" y="${-50 - r * 50}" width="58" height="48" rx="4" fill="${crack > 0 ? '#B99A7A' : '#D9805F'}" stroke="${INK}" stroke-width="4" transform="translate(${f1(dx)} ${f1(dy)}) rotate(${f1(rot)} ${-151 + c * 60} ${-26 - r * 50})"/>`;
  }
  if (built >= 1) {
    const rf = crack > 0 ? clamp(crack * 1.4, 0, 1) : 0;
    h += `<path d="M-210 -350 L0 -500 L210 -350 Z" fill="${crack > 0 ? '#8A7A6A' : '#C8423A'}" stroke="${INK}" stroke-width="7" stroke-linejoin="round" transform="translate(${f1(-60 * rf)} ${f1(rf * rf * 500)}) rotate(${f1(-40 * rf)} 0 -400)"/>`;
  }
  return h + `</g>`;
}
function mythScene(t, lt, a) {
  const D = D_(a);
  if (a.build) {
    let h = BG('url(#morning)') + `<rect x="-600" y="860" width="3120" height="620" fill="#9CCB72"/><line x1="-600" y1="860" x2="2520" y2="860" stroke="${INK}" stroke-width="7"/>`;
    h += clouds(t, 80, 20, 3, 4);
    const crack = prog(lt, 0.15 * D, 0.5 * D);
    h += houseG(520, 860, 1, Math.max(0.0001, crack));
    if (lt < 0.2 * D) h += `<path d="M420 640 L470 700 L440 740 L500 800" fill="none" stroke="${INK}" stroke-width="6"/>`;
    h += `<rect x="1170" y="840" width="560" height="60" rx="10" fill="#9AA3AE" stroke="${INK}" stroke-width="8"/>`;
    h += pop(t, t - lt + 0.1, t + 99, 1450, 950, label(0, 0, '단단한 바닥', { size: 34, bg: YEL }), {});
    const bk = prog(lt, 0.45 * D, 0.95 * D);
    if (bk > 0) h += houseG(1450, 840, 1, 0, bk);
    h += pop(t, t - lt + 0.05, t + 99, 520, 180, label(0, 0, '낡은 생각 허물기', { size: 38, bg: '#fff' }), { rot: -2 });
    if (lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 1450, 180, label(0, 0, '처음부터 튼튼하게 다시', { size: 38, bg: MINT }), { rot: 2 });
    h += Z({ t, seed: 710, x: 960, y: 1000, s: 0.55, pose: '손인사', ex: exprAt([[0, '놀람'], [0.5 * D, '신남']], lt), look: [lt > 0.45 * D ? 0.8 : -0.8, -0.3] });
    return h;
  }
  let h = BG(PARCH) + BG('url(#paper)');
  h += Z({ t, seed: 711, x: 700, y: 1000, s: 0.86, pose: '손인사', ex: exprAt([[0, '결심']], t), look: [0.6, -0.3] });
  // magnifier in the raised hand
  const [mx, my] = handG(700, 1000, 0.86, P['손인사'].hR);
  h += `<g transform="translate(${f1(mx + 90)} ${f1(my - 110)}) rotate(20)"><rect x="-12" y="40" width="24" height="110" rx="10" fill="${WALNUT}" stroke="${INK}" stroke-width="6"/><circle r="66" fill="#DFF4FF" fill-opacity=".7" stroke="${INK}" stroke-width="10"/>${T8(0, 26, '?', { size: 76 })}</g>`;
  if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 1340, 420, outlined(0, 0, [[['의심', YEL], [' ≠ ', '#fff']], [['아무것도 안 믿기', '#fff']]], { size: 84, sw: 16 }), {});
  return h;
}

/* ---------- 1 · doubt the obvious (illusion of explanatory depth) ---------- */
function zipperIcon(x, y, s) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-70" y="-120" width="140" height="240" rx="16" fill="#3E7CC0" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 9; i++) h += `<rect x="${i % 2 ? -2 : -16}" y="${-104 + i * 22}" width="18" height="14" rx="3" fill="#E0E4EA" stroke="${INK}" stroke-width="3"/>`;
  return h + `<rect x="-22" y="-10" width="44" height="34" rx="8" fill="#C9D2DC" stroke="${INK}" stroke-width="5"/><rect x="-8" y="22" width="16" height="44" rx="6" fill="#C9D2DC" stroke="${INK}" stroke-width="5"/></g>`;
}
function toiletIcon(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="10" y="-130" width="90" height="120" rx="12" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="34" y="-150" width="40" height="18" rx="6" fill="#C9D2DC" stroke="${INK}" stroke-width="5"/><path d="M-110 -20 L100 -20 Q100 60 20 80 L0 120 L-60 120 L-50 70 Q-110 50 -110 -20 Z" fill="#fff" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><ellipse cx="-10" cy="-20" rx="100" ry="18" fill="#DFF4FF" stroke="${INK}" stroke-width="6"/></g>`; }
function lockIcon(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-50 -20 L-50 -70 Q0 -130 50 -70 L50 -20" fill="none" stroke="#9AA3AE" stroke-width="22"/><path d="M-50 -20 L-50 -70 Q0 -130 50 -70 L50 -20" fill="none" stroke="${INK}" stroke-width="6" opacity=".5"/><rect x="-80" y="-24" width="160" height="140" rx="18" fill="#E8B83A" stroke="${INK}" stroke-width="7"/><circle cx="0" cy="34" r="16" fill="${INK}"/><rect x="-6" y="40" width="12" height="40" fill="${INK}"/></g>`; }
function meter(x, y, k, title, c) {
  let h = `<g transform="translate(${x} ${y})">${T8(0, -60, title, { size: 34 })}<rect x="-280" y="-30" width="560" height="56" rx="28" fill="#E6E0D4" stroke="${INK}" stroke-width="6"/>`;
  h += `<rect x="-280" y="-30" width="${f1(Math.max(56, 560 * k))}" height="56" rx="28" fill="${c}" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 1; i < 7; i++) h += `<line x1="${-280 + i * 80}" y1="-30" x2="${-280 + i * 80}" y2="26" stroke="${INK}" stroke-width="3" opacity=".25"/>`;
  return h + `</g>`;
}
function zipperScene(t, lt, a) {
  const D = D_(a);
  if (a.study || a.explain) {
    let h = BG('#EAF2F8') + BG('url(#paper)');
    h += pop(t, t - lt + 0.1, t + 99, 420, 420, zipperIcon(0, 0, 1.1), {}) + pop(t, t - lt + 0.3, t + 99, 760, 450, toiletIcon(0, 0, 1.0), {}) + pop(t, t - lt + 0.5, t + 99, 1060, 440, lockIcon(0, 0, 1.1), {});
    if (a.study) {
      const k = easeOut(prog(lt, 0.45 * D, 0.8 * D));
      h += meter(760, 780, 0.12 + 0.7 * k, '“나 이거 잘 알아!”', MINT);
      h += Z({ t, seed: 720, x: 1560, y: 1000, s: 0.62, pose: '만세', ex: exprAt([[0, '뿌듯']], t), look: [-0.6, -0.3] });
      if (lt > 0.75 * D) h += pop(t, t - lt + 0.75 * D, t + 99, 1460, 300, label(0, 0, '자신감 높음', { size: 36, bg: MINT }), { rot: 3 });
      return h;
    }
    // explain: whiteboard, confidence collapses
    h += panel(1260, 160, 560, 440, { r: 12 });
    h += T8(1300, 240, '지퍼의 원리', { anchor: 'start', size: 40 });
    const lines = ['1. 손잡이를 당기면', '2. 이빨이… 맞물려서', '3. ???'];
    lines.forEach((ln, i) => { if (lt > (0.1 + i * 0.18) * D) h += T8(1300, 320 + i * 80, ln, { anchor: 'start', size: 38, fill: i === 2 ? RED : '#2A3A55', w: 700 }); });
    const k = easeInOut(prog(lt, 0.45 * D, 0.85 * D));
    h += meter(760, 780, lerp(0.82, 0.32, k), '설명해 보기 전 → 설명해 본 뒤', lerp(0, 1, k) > 0.5 ? PINK : MINT);
    if (k > 0.5) h += pop(t, t - lt + 0.65 * D, t + 99, 1150, 700, outlined(0, 0, [['뚝!']], { size: 70, sw: 12, fill: YEL }), { rot: 10 });
    h += Z({ t, seed: 721, x: 1560, y: 1020, s: 0.55, pose: '턱괴기', ex: exprAt([[0, '결심'], [0.45 * D, '걱정']], lt), look: [-0.2, -0.6] });
    return h;
  }
  if (a.name) {
    let h = BG(NAVY) + BG('url(#grid)');
    h += pop(t, t - lt + 0.1, t + 99, 960, 200, outlined(0, 0, [[['설명 깊이의 ', '#fff'], ['착각', YEL]]], { size: 96, sw: 18 }), {});
    const k = easeOut(prog(lt, 0.25 * D, 0.7 * D));
    h += vbar(700, 800, 220, 420, 0.95 * k, MINT, '', '안다는 느낌', { bc: '#fff', bs: 40 });
    h += vbar(1220, 800, 220, 420, 0.38 * k, PINK, '', '정말 아는 것', { bc: '#fff', bs: 40 });
    if (lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, 960, 560, outlined(0, 0, [['≠']], { size: 160, sw: 20, fill: YEL }), {});
    h += pop(t, t - lt + 0.3, t + 99, 1500, 330, label(0, 0, 'Rozenblit & Keil (2002)', { size: 26, bg: '#fff' }), {});
    return h;
  }
  if (a.zero) { // Zero tries to explain his own zipper
    let h = livingRoom(t, false);
    const k = prog(lt, 0.15 * D, 0.6 * D), stuck = lt > 0.6 * D;
    h += `<g transform="translate(1180 620)">${panel(-300, -260, 600, 520, { r: 30 })}<rect x="-30" y="-230" width="60" height="460" fill="#3E7CC0" stroke="${INK}" stroke-width="5"/>`;
    for (let i = 0; i < 16; i++) h += `<rect x="${i % 2 ? -4 : -20}" y="${-224 + i * 28}" width="24" height="18" rx="3" fill="#E0E4EA" stroke="${INK}" stroke-width="3"/>`;
    const sy = lerp(-180, 60, easeInOut(k)) + (stuck ? Math.sin(t * 40) * 6 : 0);
    h += `<rect x="-34" y="${f1(sy)}" width="68" height="54" rx="10" fill="#C9D2DC" stroke="${INK}" stroke-width="6"/><rect x="-12" y="${f1(sy + 50)}" width="24" height="70" rx="8" fill="#C9D2DC" stroke="${INK}" stroke-width="6"/></g>`;
    h += qmarks(t, 22, 6, [880, 200, 600, 500], { size: 56 });
    h += Z({ t, seed: 722, x: 560, y: 1000, s: 0.86, pose: stuck ? '허우적' : '턱괴기', ex: exprAt([[0, '결심'], [0.6 * D, '당황'], [0.62 * D, '걱정']], lt), look: [0.8, -0.2], sweat: stuck });
    if (stuck) h += pop(t, t - lt + 0.62 * D, t + 99, 640, 230, outlined(0, 0, ['어, 왜 안 풀리지?'], { size: 60, sw: 12, fill: YEL }), { rot: -4, wobble: 2 });
    return h;
  }
  // rule 1 card
  let h = BG(PARCH) + BG('url(#paper)');
  h += DC({ t, seed: 723, x: 300, y: 1000, s: 0.72, pose: '손인사', ex: exprAt([[0, '결심']], t), look: [0.7, -0.3] });
  h += pop(t, t - lt + 0.1, t + 99, 1040, 190, label(0, 0, '데카르트의 규칙 1', { size: 40, bg: YEL }), {});
  h += quote(1040, 380, ['“확실히 알기 전에는,', '아무것도 참이라 받아들이지 말 것”'], '— 데카르트, 『방법서설』 2부', t, lt, 0.32 * D, { size: 60, srcDy: 170 });
  h += Z({ t, seed: 724, x: 1660, y: 1000, s: 0.5, ex: exprAt([[0, '결심']], t), look: [-0.6, -0.4] });
  return h;
}

/* ---------- 2 · doubt the fast answer (bat & ball) ---------- */
function batG(x, y, s, rot = -30) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})"><path d="M-20 -200 Q-34 -40 -14 120 L14 120 Q34 -40 20 -200 Q0 -216 -20 -200 Z" fill="#D9A066" stroke="${INK}" stroke-width="7"/><rect x="-18" y="110" width="36" height="20" rx="6" fill="#7A5235" stroke="${INK}" stroke-width="5"/></g>`; }
function ballG(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><circle r="56" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-36 -42 Q-12 0 -36 42 M36 -42 Q12 0 36 42" fill="none" stroke="${RED}" stroke-width="5" stroke-dasharray="8 6"/></g>`; }
function priceTag(x, y, txt, c = YEL, rot = 0) { const w = txt.length * 34 + 60; return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot})"><path d="M${-w / 2} -36 L${w / 2 - 20} -36 L${w / 2 + 10} 0 L${w / 2 - 20} 36 L${-w / 2} 36 Z" fill="${c}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><circle cx="${w / 2 - 16}" cy="0" r="7" fill="#fff" stroke="${INK}" stroke-width="3"/>${T8(-8, 13, txt, { size: 38 })}</g>`; }
function batScene(t, lt, a) {
  const D = D_(a);
  if (a.elite) {
    let h = BG('#EEF1F6') + BG('url(#paper)');
    const U = [['하버드', '#A51C30', 480], ['MIT', '#8A8B8C', 960], ['프린스턴', '#E87722', 1440]];
    U.forEach(([nm, c, x], i) => {
      const at = 0.15 * D + i * 0.35; if (lt < at) return;
      const k = easeOut(prog(lt, at + 0.3, at + 1.3)), ang = 0.55 * 2 * Math.PI * k;
      const px = Math.sin(ang) * 130, py = -Math.cos(ang) * 130, large = ang > Math.PI ? 1 : 0;
      let g = `<path d="M-90 -320 L90 -290 L-90 -260 Z" fill="${c}" stroke="${INK}" stroke-width="6"/><line x1="-90" y1="-330" x2="-90" y2="-180" stroke="${INK}" stroke-width="8"/>`;
      g += `<circle r="130" fill="#E6F7EF" stroke="${INK}" stroke-width="7"/>`;
      if (k > 0.01) g += `<path d="M0 0 L0 -130 A130 130 0 ${large} 1 ${f1(px)} ${f1(py)} Z" fill="${PINK}" stroke="${INK}" stroke-width="6"/>`;
      g += `<g transform="translate(0 200)">${label(0, 0, nm, { size: 40, bg: '#fff' })}</g>`;
      h += pop(t, t - lt + at, t + 99, x, 470, g, {});
    });
    if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 960, 770, label(0, 0, '절반 넘게, 바로 떠오른 틀린 답', { size: 42, bg: PINK, color: '#fff' }), {});
    return h;
  }
  let h = BG('#F4EFE4') + BG('url(#paper)');
  if (!a.q && !a.ans) {
    h += DC({ t, seed: 730, x: 420, y: 1000, s: 0.78, pose: '손인사', ex: exprAt([[0, '결심']], t), look: [0.7, -0.2] });
    h += pop(t, t - lt + 0.2, t + 99, 1060, 380, `<g><rect x="-260" y="-150" width="520" height="300" rx="30" fill="${YEL}" stroke="${INK}" stroke-width="9"/><rect x="-236" y="-126" width="472" height="252" rx="20" fill="none" stroke="${INK}" stroke-width="5"/>${T8(0, -30, '⚠ 성급한 판단', { size: 56 })}${T8(0, 60, '주의!', { size: 72, fill: RED })}</g>`, { rot: -3, bob: 3 });
    if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 1500, 700, label(0, 0, '문제 나갑니다!', { size: 44, bg: MINT }), { rot: 4 });
    h += Z({ t, seed: 731, x: 1640, y: 1000, s: 0.55, ex: exprAt([[0, '기본'], [0.6 * D, '놀람']], lt), look: [-0.6, -0.3] });
    return h;
  }
  h += batG(560, 520, 1.05) + ballG(860, 640, 1.1);
  h += pop(t, t - lt + 0.15, t + 99, 620, 210, priceTag(0, 0, '방망이 + 공 = 1,100원', '#fff', -2), {});
  if (a.q) {
    if (lt > 0.4 * D) h += pop(t, t - lt + 0.4 * D, t + 99, 620, 320, priceTag(0, 0, '방망이 = 공 + 1,000원', '#fff', 2), {});
    if (lt > 0.72 * D) h += pop(t, t - lt + 0.72 * D, t + 99, 980, 780, priceTag(0, 0, '공 = ?', YEL, -4), { bob: 4 });
    h += Z({ t, seed: 732, x: 1480, y: 1000, s: 0.78, pose: '턱괴기', ex: exprAt([[0, '결심'], [0.85 * D, '신남']], lt), look: [-0.7, -0.3] });
    if (lt > 0.86 * D) h += pop(t, t - lt + 0.86 * D, t + 99, 1520, 330, bubble(0, 0, 300, 130, `${T8(14, 20, '100원!', { size: 56 })}`), { rot: 3 });
    return h;
  }
  // answer
  h += pop(t, t - lt + 0.05, t + 99, 1500, 280, `<g>${bubble(0, 0, 300, 130, `${T8(14, 20, '100원?', { size: 56 })}`)}</g>`, {});
  if (lt > 0.18 * D) h += pop(t, t - lt + 0.18 * D, t + 99, 1510, 290, xMark(0, 0, 0.9), {});
  if (lt > 0.3 * D) h += pop(t, t - lt + 0.3 * D, t + 99, 980, 780, `${priceTag(0, 0, '공 = 50원', MINT, -4)}${check(200, -40, 1)}`, {});
  if (lt > 0.55 * D) {
    h += pop(t, t - lt + 0.55 * D, t + 99, 1440, 540, panel(-330, -130, 660, 260, { r: 20 }) + T8(0, -50, '공 100원이면', { size: 38 }) + T8(0, 10, '방망이 1,100원', { size: 38 }) + T8(0, 80, '합계 1,200원 ✗', { size: 46, fill: RED }), { rot: 2 });
  }
  h += Z({ t, seed: 733, x: 1740, y: 1000, s: 0.5, pose: '서기', ex: exprAt([[0, '신남'], [0.18 * D, '놀람'], [0.6 * D, '뿌듯']], lt), look: [-0.7, -0.2] });
  return h;
}
function headline(x, y, txt, fake, k, t) { // a news card on a feed
  let h = `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="-300" y="-58" width="600" height="116" rx="18" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="-282" y="-40" width="90" height="80" rx="10" fill="${fake ? '#FFC7D9' : '#C7E7FF'}" stroke="${INK}" stroke-width="4"/>${T8(-176, 11, txt, { anchor: 'start', size: 28 })}`;
  if (k > 0) h += `<g transform="translate(300 -10) rotate(-12) scale(${f1(lerp(1.6, 1, easeOutBack(k)) * 100) / 100})" opacity="${f1(Math.min(1, k * 3) * 100) / 100}"><rect x="-80" y="-34" width="160" height="68" rx="10" fill="none" stroke="${fake ? RED : '#1F9D6B'}" stroke-width="8"/>${T8(0, 14, fake ? '가짜' : '진짜', { size: 40, fill: fake ? RED : '#1F9D6B' })}</g>`;
  return h + `</g>`;
}
function newsScene(t, lt, a) {
  const D = D_(a);
  if (a.pause) {
    let h = BG('#2A1F4A') + BG('url(#dots)');
    const near = easeInOut(prog(lt, 0.1 * D, 0.45 * D)), stop = lt > 0.45 * D;
    h += panel(560, 240, 800, 420, { r: 40, fill: '#fff' });
    h += T8(960, 340, '[단독] 외계인 서울 착륙?!', { size: 44, fill: RED });
    h += `<rect x="790" y="460" width="340" height="110" rx="55" fill="${MINT}" stroke="${INK}" stroke-width="7"/>` + T8(960, 532, '공유하기 ↗', { size: 46 });
    const fy = lerp(900, stop ? 620 : 600, near) + (stop ? Math.sin(t * 30) * 2 : 0);
    h += `<g transform="translate(1000 ${f1(fy)})"><rect x="-26" y="0" width="52" height="200" rx="26" fill="#fff" stroke="${INK}" stroke-width="7"/><ellipse cx="0" cy="10" rx="26" ry="16" fill="#FFE1E8" stroke="${INK}" stroke-width="4"/></g>`;
    if (stop) h += pop(t, t - lt + 0.45 * D, t + 99, 1460, 380, `<g><path d="M-100 -240 L100 -240 L240 -100 L240 100 L100 240 L-100 240 L-240 100 L-240 -100 Z" transform="scale(.6)" fill="${RED}" stroke="${INK}" stroke-width="12"/>${T8(0, 20, '잠깐!', { size: 56, fill: '#fff' })}</g>`, { rot: 8, bob: 3 });
    if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 960, 820, label(0, 0, '데카르트식 브레이크 · 딱 한 번 더 생각', { size: 42, bg: YEL }), {});
    return h;
  }
  let h = BG('#EAF2F8') + BG('url(#paper)');
  h += `<rect x="190" y="190" width="700" height="700" rx="44" fill="#1F2D44" stroke="${INK}" stroke-width="9"/><rect x="214" y="218" width="652" height="644" rx="28" fill="#F3F6FA"/>`;
  const H = [['[단독] 외계인 서울 착륙?!', 1], ['기상청: 주말 전국에 비', 0], ['○○ 먹으면 하루 만에 10kg?', 1], ['시내버스 요금 조정 예정', 0]];
  H.forEach(([tx, fk], i) => { const at = 0.05 * D + i * 0.18; if (lt > at) h += pop(t, t - lt + at, t + 99, 520, 300 + i * 145, headline(0, 0, tx, fk, prog(lt, 0.45 * D + i * 0.25, 0.45 * D + i * 0.25 + 0.3), t), { noPop: true, inDur: 0.25 }); });
  h += Z({ t, seed: 740, x: 1380, y: 1000, s: 0.78, pose: '턱괴기', ex: exprAt([[0, '결심'], [0.5 * D, '뿌듯']], lt), look: [-0.7, -0.2] });
  h += bubble(1500, 300, 360, 140, `${T8(14, 20, '차분히, 한 번 더…', { size: 40 })}`);
  if (lt > 0.72 * D) h += pop(t, t - lt + 0.72 * D, t + 99, 1380, 560, label(0, 0, '정치 성향과 상관없이', { size: 38, bg: YEL }), { rot: 3 });
  return h;
}

/* ---------- 3 · divide the problem ---------- */
function kid(t, seed, x, y, s, vest, o = {}) { return char(Object.assign({ t, seed, x, y, s, goggles: 'none', vest, patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', hair: o.hair || '#3A2A1E' }, o)); }
function workbook(x, y, n, lbl) { let h = ''; for (let i = 0; i < n; i++) h += `<rect x="${x - 80 + (i % 2) * 4}" y="${y - i * 16}" width="160" height="16" rx="3" fill="${['#FFD25A', '#7CC7FF', '#FF8FB1'][i % 3]}" stroke="${INK}" stroke-width="3"/>`; if (lbl) h += `<g transform="translate(${x} ${y - n * 16 - 40})">${label(0, 0, lbl, { size: 32, bg: '#fff' })}</g>`; return h; }
function splitScene(t, lt, a) {
  const D = D_(a);
  if (a.study) {
    let h = BG('#F6EBDD') + BG('url(#hatch)').replace('/>', ' opacity=".25"/>');
    h += `<rect x="560" y="120" width="800" height="300" rx="14" fill="#2F4A3E" stroke="${INK}" stroke-width="9"/>` + T8(960, 250, '15 − 8 = ?', { size: 80, fill: '#F4F1EA' }) + T8(960, 350, '102 − 47 = ?', { size: 56, fill: '#F4F1EA', op: 0.8 });
    h += `<rect x="-600" y="880" width="3120" height="600" fill="#C9AE8C"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
    [[420, '#7CC7FF'], [960, '#FFD25A'], [1500, '#FF8FB1']].forEach(([x, c], i) => {
      h += kid(t, 750 + i, x, 980, 0.5, c, { ex: exprAt([[0, '걱정']], t), look: [0.3, -0.5], hair: ['#3A2A1E', '#6B4A2E', '#1E1E1E'][i] });
      h += `<rect x="${x - 170}" y="820" width="340" height="24" rx="6" fill="${WALNUT}" stroke="${INK}" stroke-width="6"/>`;
      if (lt > 0.4 * D + i * 0.2) h += pop(t, t - lt + 0.4 * D + i * 0.2, t + 99, x + 110, 812, workbook(0, 0, 14, i === 1 ? '42쪽' : ''), { noPop: true, inDur: 0.3 });
    });
    return h;
  }
  if (a.groups) {
    let h = BG('url(#morning)') + `<rect x="-600" y="880" width="3120" height="600" fill="#9CCB72"/>`;
    const lane = (y, small, at) => {
      let g = `<rect x="160" y="${y - 30}" width="1600" height="60" rx="30" fill="#E8D7B8" stroke="${INK}" stroke-width="6"/>`;
      if (small) for (let i = 1; i <= 7; i++) g += `<g transform="translate(${160 + i * 228} ${y - 30})"><line x1="0" y1="0" x2="0" y2="-90" stroke="${INK}" stroke-width="6"/><path d="M0 -90 L60 -72 L0 -54 Z" fill="${MINT}" stroke="${INK}" stroke-width="5"/>${T8(30, 40, '6쪽', { size: 22 })}</g>`;
      else g += `<g transform="translate(1720 ${y - 30})"><line x1="0" y1="0" x2="0" y2="-130" stroke="${INK}" stroke-width="7"/><path d="M0 -130 L90 -106 L0 -82 Z" fill="${PINK}" stroke="${INK}" stroke-width="5"/></g>`;
      return g;
    };
    const k1 = lt > 0.05 * D, k2 = lt > 0.5 * D;
    if (k1) {
      h += lane(400, false) + pop(t, t - lt + 0.05 * D, t + 99, 1250, 230, label(0, 0, '큰 목표 · 42쪽 끝까지!', { size: 38, bg: PINK, color: '#fff' }), {});
      h += kid(t, 760, 260, 400, 0.38, '#7CC7FF', { ex: exprAt([[0, '걱정']], t), look: [0.8, -0.2], pose: walkPose(t * 3, 0.3) });
    }
    if (k2) {
      h += lane(800, true) + pop(t, t - lt + 0.5 * D, t + 99, 1450, 580, label(0, 0, '작은 목표 · 한 번에 6쪽씩', { size: 38, bg: MINT }), {});
      const run = (lt - 0.5 * D) / (0.5 * D), hop = (run * 3.2) % 1, seg = Math.floor(run * 3.2);
      const kx = 160 + Math.min(7, seg) * 228 + 228 * easeInOut(hop) * (seg < 7 ? 1 : 0), ky = 800 - Math.sin(hop * Math.PI) * 60;
      h += kid(t, 761, kx, ky, 0.38, '#FFD25A', { ex: exprAt([[0, '신남']], t), look: [0.8, -0.2], pose: '점프' });
    }
    return h;
  }
  if (a.free) { // free-choice: icon arrays of kids picking subtraction problems
    let h = BG(NAVY) + BG('url(#grid)');
    h += pop(t, t - lt + 0.1, t + 99, 960, 120, outlined(0, 0, [[['자유 시간에 ', '#fff'], ['스스로 뺄셈', YEL], ['을 고른 아이', '#fff']]], { size: 62, sw: 12 }), {});
    const row = (y, n, c, lbl, at) => {
      let g = T8(330, y + 18, lbl, { anchor: 'end', size: 40, fill: '#fff' });
      for (let i = 0; i < 10; i++) {
        const on = i < n && lt > at + i * 0.12;
        g += `<g transform="translate(${400 + i * 124} ${y})"><circle cy="-36" r="30" fill="${on ? c : '#33465F'}" stroke="${INK}" stroke-width="5"/><path d="M-40 50 Q-40 0 0 0 Q40 0 40 50 Z" fill="${on ? c : '#33465F'}" stroke="${INK}" stroke-width="5"/>${on ? `<rect x="-14" y="10" width="28" height="34" rx="4" fill="#fff" stroke="${INK}" stroke-width="3"/>` : ''}</g>`;
      }
      return g;
    };
    h += row(400, 9, MINT, '작은 목표', 0.25 * D) + row(720, 4, PINK, '다른 그룹', 0.55 * D);
    if (lt > 0.25 * D + 1.2) h += pop(t, t - lt + 0.25 * D + 1.2, t + 99, 1720, 400, label(0, 0, '약 90%', { size: 44, bg: MINT }), {});
    if (lt > 0.55 * D + 0.6) h += pop(t, t - lt + 0.55 * D + 0.6, t + 99, 1720, 720, label(0, 0, '약 40%', { size: 44, bg: PINK, color: '#fff' }), {});
    return h;
  }
  if (a.room) { // Zero splits cleaning into "just the desk, 5 minutes"
    let h = livingRoom(t, false);
    const tidy = prog(lt, 0.25 * D, 0.55 * D), all = prog(lt, 0.55 * D, 0.9 * D);
    h += deskG(560, 700, 460);
    for (let i = 0; i < 7; i++) { const x0 = 400 + i * 50, gone = tidy > (i + 1) / 8; if (!gone) h += `<rect x="${x0}" y="${650 - (i % 3) * 14}" width="40" height="50" rx="6" fill="${[PINK, YEL, MINT, '#7CC7FF'][i % 4]}" stroke="${INK}" stroke-width="4" transform="rotate(${(i % 2 ? 1 : -1) * 14} ${x0 + 20} 675)"/>`; }
    for (let i = 0; i < 9; i++) { const gone = all > (i + 1) / 10, x0 = 900 + (i % 5) * 170, y0 = 900 + Math.floor(i / 5) * 60; if (!gone) h += `<ellipse cx="${x0}" cy="${y0}" rx="60" ry="22" fill="${['#8C6BD9', '#4FA3E0', '#E0884F'][i % 3]}" stroke="${INK}" stroke-width="5"/>`; }
    if (tidy >= 1) h += particles(t, 31, 10, [380, 560, 380, 160], YEL, { speed: 30, r: 6, op: 0.9 });
    if (all >= 1) h += particles(t, 32, 22, [100, 300, 1700, 600], YEL, { speed: 30, r: 6, op: 0.9 });
    const secs = Math.max(0, 300 - Math.floor(prog(lt, 0.1 * D, 0.6 * D) * 300));
    h += pop(t, t - lt + 0.1, t + 99, 560, 300, `<g><circle r="90" fill="#fff" stroke="${INK}" stroke-width="8"/>${T8(0, 18, `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`, { size: 52 })}</g>`, {});
    h += pop(t, t - lt + 0.15, t + 99, 560, 440, label(0, 0, '책상 위만, 5분!', { size: 36, bg: YEL }), {});
    const zx = lerp(1000, 1300, all);
    h += Z({ t, seed: 770, x: zx, y: 1000, s: 0.8, pose: all > 0 && all < 1 ? walkPose(t * 8, 0.6) : (all >= 1 ? '만세' : '서기'), ex: exprAt([[0, '결심'], [0.55 * D, '신남']], lt), look: [-0.6, -0.2] });
    if (all >= 1) h += pop(t, t - lt + 0.9 * D, t + 99, 1300, 260, outlined(0, 0, ['어느새 방 전체가!'], { size: 60, sw: 12, fill: YEL }), { rot: -3 });
    return h;
  }
  // rule 2: a boulder becomes pebbles
  let h = BG('#E9E1D0') + BG('url(#paper)') + `<rect x="-600" y="880" width="3120" height="600" fill="#BFA98A"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  const k = prog(lt, 0.4 * D, 0.7 * D);
  if (k < 0.01) {
    h += `<path d="M560 880 Q520 640 700 560 Q900 470 1100 560 Q1300 640 1260 880 Z" fill="#9AA3AE" stroke="${INK}" stroke-width="9"/>` + T8(910, 740, '어려운 문제', { size: 64, fill: '#fff', stroke: INK, sw: 10 });
  } else {
    for (let i = 0; i < 6; i++) { const x = lerp(910, 520 + i * 170, easeOut(k)), y = lerp(720, 830, easeOut(k)); h += `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M-70 50 Q-80 -20 -20 -46 Q40 -60 70 -10 Q84 40 60 50 Z" fill="#9AA3AE" stroke="${INK}" stroke-width="6"/>${T8(0, 20, String(i + 1), { size: 44, fill: '#fff', stroke: INK, sw: 8 })}</g>`; }
  }
  if (lt > 0.3 * D && lt < 0.45 * D) h += `<g transform="translate(1180 470) rotate(${f1(-30 + 60 * prog(lt, 0.3 * D, 0.4 * D))})"><rect x="-10" y="-120" width="20" height="160" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/><rect x="-50" y="-150" width="100" height="44" rx="8" fill="#6B7A8C" stroke="${INK}" stroke-width="6"/></g>`;
  h += pop(t, t - lt + 0.1, t + 99, 960, 160, label(0, 0, '데카르트의 규칙 2 · 잘게 나누기', { size: 42, bg: YEL }), {});
  h += Z({ t, seed: 771, x: 1620, y: 1000, s: 0.62, pose: k >= 1 ? '만세' : '서기', ex: exprAt([[0, '걱정'], [0.7 * D, '신남']], lt), look: [-0.7, -0.2] });
  return h;
}

/* ---------- 4 · doubt your eyes: the evil demon, dreams, AI faces ---------- */
function demonScene(t, lt, a) {
  const D = D_(a);
  if (a.dream) {
    let h = BG('#1B1E44') + BG('url(#dots)');
    for (let i = 0; i < 30; i++) h += `<circle cx="${f1(hash(i) * 1920)}" cy="${f1(hash(i * 2) * 700)}" r="${f1(2 + hash(i * 3) * 3)}" fill="#fff" opacity="${f1((0.4 + 0.5 * Math.sin(t * 2 + i)) * 100) / 100}"/>`;
    h += clouds(t, 640, 25, 4, 9).replace(/fill="#fff"/g, 'fill="#C9D2F0"');
    const fy = Math.sin(t * 1.2) * 18 - 90;
    h += `<g transform="translate(0 ${f1(fy)})"><path d="M560 780 Q520 700 640 690 Q700 620 800 670 Q900 610 1000 670 Q1120 640 1160 720 Q1260 730 1230 800 Q1200 850 1100 840 L640 840 Q560 840 560 780 Z" fill="#E8ECFF" stroke="${INK}" stroke-width="8"/>`;
    h += Z({ t, seed: 780, x: 880, y: 820, s: 0.62, rot: -90, ex: { expr: '잠', prev: '잠', k: 1, blink: 0 }, noBlink: true }) + `</g>`;
    for (let i = 0; i < 3; i++) { const k = ((t * 0.5 + i / 3) % 1); h += T8(1000 + k * 120, 560 - k * 180, 'z', { size: 40 + i * 12, fill: '#fff', op: f1(Math.sin(k * Math.PI) * 100) / 100 }); }
    if (lt > 0.2 * D) h += pop(t, t - lt + 0.2 * D, t + 99, 960, 200, outlined(0, 0, [[['지금 이 순간이 ', '#fff'], ['꿈', YEL], ['이라면?', '#fff']]], { size: 76, sw: 15 }), {});
    return h;
  }
  let h = BG('#1E1530') + BG('url(#dots)');
  // a painted world held up like a stage backdrop
  const lift = easeInOut(prog(lt, 0.6 * D, 0.9 * D));
  h += `<g transform="translate(0 ${f1(-lift * 120)})">`;
  h += `<rect x="440" y="300" width="1040" height="520" rx="10" fill="#A9DBFF" stroke="${INK}" stroke-width="9"/><circle cx="1300" cy="400" r="54" fill="#FFF3B0"/><path d="M440 700 Q700 600 960 680 Q1220 760 1480 660 L1480 820 L440 820 Z" fill="#9CCB72" stroke="${INK}" stroke-width="6"/>`;
  h += `<path d="M640 700 L640 600 M600 640 Q640 520 680 640 Z" fill="#4E9A3E" stroke="${INK}" stroke-width="6"/>`;
  for (const sx of [560, 1360]) h += `<line x1="${sx}" y1="300" x2="${sx + (sx < 900 ? 60 : -60)}" y2="150" stroke="#C9C0E8" stroke-width="3" opacity=".8"/>`;
  h += `</g>`;
  h += imp(960, 170 - lift * 120, 0.9 + Math.sin(t * 2) * 0.02, t);
  h += Z({ t, seed: 781, x: 960, y: 1020, s: 0.6, ex: exprAt([[0, '기본'], [0.6 * D, '겁먹음']], lt), look: [0, -0.9] });
  if (lt > 0.3 * D) h += pop(t, t - lt + 0.3 * D, t + 99, 1640, 520, label(0, 0, '교활한 악마?', { size: 40, bg: '#B9A7FF' }), { rot: 4, bob: 4 });
  if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 330, 520, outlined(0, 0, ['다', '가짜라면?'], { size: 60, sw: 12, fill: YEL }), { rot: -5 });
  return h;
}
function faceCard(x, y, s, i, reveal, ai) { // stylised portrait (not a real photo)
  const skin = ['#F2D3B6', '#E0B48F', '#C68E66', '#F5DCC4', '#D9A57E', '#EBC6A6'][i % 6], hair = ['#3A2A1E', '#1E1E1E', '#8A5A30', '#C9A26B', '#5A4130', '#2B2B33'][i % 6];
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-120" y="-150" width="240" height="300" rx="20" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-104" y="-134" width="208" height="230" rx="12" fill="${['#DDE8F3', '#F3E6CC', '#E6F3E8'][i % 3]}"/>`;
  h += `<path d="M-70 96 Q-70 30 0 30 Q70 30 70 96 Z" fill="${['#7CC7FF', '#FF8FB1', '#9CCB72', '#FFD25A'][i % 4]}" stroke="${INK}" stroke-width="4"/>`;
  h += `<ellipse cx="0" cy="-36" rx="56" ry="66" fill="${skin}" stroke="${INK}" stroke-width="4"/><path d="M-58 -50 Q-56 -110 0 -108 Q56 -110 58 -50 Q40 -86 0 -82 Q-40 -86 -58 -50 Z" fill="${hair}"/>`;
  h += `<circle cx="-20" cy="-36" r="6" fill="${INK}"/><circle cx="20" cy="-36" r="6" fill="${INK}"/><path d="M-14 0 Q0 ${i % 2 ? 10 : 6} 14 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  if (reveal > 0) h += `<g opacity="${f1(Math.min(1, reveal * 2) * 100) / 100}"><rect x="-90" y="104" width="180" height="40" rx="20" fill="${ai ? '#B9A7FF' : MINT}" stroke="${INK}" stroke-width="4"/>${T8(0, 134, ai ? 'AI가 만듦' : '진짜 사진', { size: 26 })}</g>`;
  else h += `${T8(0, 136, '진짜? AI?', { size: 28, fill: '#6B7A8C' })}`;
  return h + `</g>`;
}
function facesScene(t, lt, a) {
  const D = D_(a);
  if (a.tip) {
    let h = BG('#EAF2F8') + BG('url(#paper)');
    h += panel(860, 200, 820, 560, { r: 24 });
    const L = ['출처가 어디인지 확인하기', '다른 곳에서 한 번 더 찾아보기', '너무 자극적이면 잠깐 멈추기'];
    L.forEach((s, i) => { const at = 0.2 * D + i * 0.5; if (lt > at) h += pop(t, t - lt + at, t + 99, 960, 330 + i * 150, check(0, 0, 1.1) + T8(60, 16, s, { anchor: 'start', size: 42 }), { noPop: true, inDur: 0.25 }); });
    h += Z({ t, seed: 790, x: 470, y: 1000, s: 0.8, pose: '손인사', ex: exprAt([[0, '결심']], t), look: [0.7, -0.2] });
    const [mx, my] = handG(470, 1000, 0.8, P['손인사'].hR);
    h += `<g transform="translate(${f1(mx + 80)} ${f1(my - 100)}) rotate(20)"><rect x="-12" y="40" width="24" height="100" rx="10" fill="${WALNUT}" stroke="${INK}" stroke-width="6"/><circle r="60" fill="#DFF4FF" fill-opacity=".7" stroke="${INK}" stroke-width="10"/></g>`;
    return h;
  }
  let h = BG('#F4EFE4') + BG('url(#paper)');
  if (a.trust) {
    h += faceCard(560, 400, 1.2, 0, 1, false) + faceCard(1360, 400, 1.2, 3, 1, true);
    const k = easeOut(prog(lt, 0.25 * D, 0.7 * D));
    h += hbar(380, 690, 360, 50, 0.6 * k, MINT, '') + hbar(1180, 690, 360, 50, 0.6 * 1.077 * k, '#B9A7FF', '');
    h += T8(560, 800, '믿음직함', { size: 36 }) + T8(1360, 800, '믿음직함 +7.7%', { size: 36, fill: '#5B3A8E' });
    if (lt > 0.7 * D) h += pop(t, t - lt + 0.7 * D, t + 99, 960, 140, outlined(0, 0, [[['AI 얼굴이 ', '#fff'], ['조금 더 믿음직', YEL]]], { size: 64, sw: 13 }), {});
    return h;
  }
  const rev = prog(lt, 0.75 * D, 0.95 * D), AI = [1, 0, 1, 1, 0, 0];
  for (let i = 0; i < 6; i++) { const at = 0.1 * D + i * 0.12; if (lt > at) h += pop(t, t - lt + at, t + 99, 520 + (i % 3) * 300, 330 + Math.floor(i / 3) * 360, faceCard(0, 0, 0.95, i, rev, AI[i]), { rot: (i % 2 ? 2 : -2) }); }
  h += Z({ t, seed: 791, x: 1600, y: 1000, s: 0.6, pose: '턱괴기', ex: exprAt([[0, '결심'], [0.75 * D, '놀람']], lt), look: [-0.7, -0.3] });
  if (lt > 0.4 * D) h += pop(t, t - lt + 0.4 * D, t + 99, 1600, 300, label(0, 0, '어느 쪽이 진짜?', { size: 38, bg: YEL }), { rot: 3, bob: 3 });
  return h;
}

/* ---------- cogito ---------- */
function cogitoScene(t, lt, a) {
  const D = D_(a);
  let h = BG('#0E0F1E');
  const glow = a.k ? 1 : easeOut(prog(lt, 0.4 * D, 0.95 * D));
  h += qmarks(t, 41, 26, [0, 60, 1920, 900], { size: 64, speed: 0.08, color: '#7A7FA8', op: 0.7 });
  h += `<circle cx="960" cy="560" r="${f1(120 + 380 * glow)}" fill="url(#warm)" opacity="${f1((0.25 + 0.6 * glow) * 100) / 100}"/>`;
  if (a.k === 2) {
    h += DC({ t, seed: 800, x: 360, y: 1000, s: 0.74, ex: exprAt([[0, '뿌듯']], t), look: [0.7, -0.3] });
    h += quote(1080, 330, [[['나는 생각한다,', '#fff']], [['그러므로 ', '#fff'], ['나는 존재한다', YEL]]], 'Je pense, donc je suis · 『방법서설』 1637', t, lt, 0.05, { size: 80, srcDy: 200 });
    return h;
  }
  h += Z({ t, seed: 801, x: 960, y: 1000, s: 0.82, pose: a.k ? '만세' : '서기', ex: exprAt([[0, a.k ? '놀람' : '걱정'], [a.k ? 0.5 * D : 99, '신남']], lt), look: [0, -0.5] });
  if (!a.k && lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, 960, 180, outlined(0, 0, [[['딱 하나, ', '#fff'], ['의심할 수 없는 것', YEL]]], { size: 70, sw: 14 }), {});
  if (a.k === 1) {
    h += pop(t, t - lt + 0.1, t + 99, 1460, 300, bubble(0, 0, 440, 150, `${T8(18, 18, '속고 있는 내가 있다', { size: 38 })}`), { bob: 4 });
    if (lt > 0.5 * D) h += pop(t, t - lt + 0.5 * D, t + 99, 480, 300, label(0, 0, '의심하는 나 = 생각하는 나', { size: 40, bg: YEL }), { rot: -3, bob: 3 });
  }
  return h;
}

/* ---------- 5 · in the forest, walk straight ---------- */
function treeTop(x, y, r, c) { return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${c}" stroke="${INK}" stroke-width="5"/>`; }
function forestMap(x0, y0, w, hh, t, k, straight, seed) {
  let h = `<rect x="${x0}" y="${y0}" width="${w}" height="${hh}" rx="24" fill="#CFE6B8" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 26; i++) { const tx = x0 + 50 + hash(seed + i) * (w - 100), ty = y0 + 50 + hash(seed + i * 2) * (hh - 100); h += treeTop(tx, ty, 26 + hash(i) * 12, ['#4E9A3E', '#6DBE55', '#3F7F33'][i % 3]); }
  const cx = x0 + w / 2, cy = y0 + hh / 2;
  const path = [];
  for (let s = 0; s <= 1; s += 0.01) {
    if (straight) path.push([cx + s * (w / 2 + 40), cy - s * 20]);
    else { const ang = s * Math.PI * 5; path.push([cx + Math.cos(ang) * (60 + 70 * Math.sin(s * 9)) - 60, cy + Math.sin(ang) * (50 + 50 * Math.cos(s * 7))]); }
  }
  const n = Math.max(2, Math.floor(path.length * k));
  h += `<polyline points="${path.slice(0, n).map(p => p.map(f1).join(',')).join(' ')}" fill="none" stroke="${straight ? '#1F9D6B' : RED}" stroke-width="8" stroke-dasharray="16 12" stroke-linecap="round"/>`;
  const p = path[n - 1]; h += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="20" fill="${TEE}" stroke="${INK}" stroke-width="5"/>`;
  return h;
}
function forestScene(t, lt, a) {
  const D = D_(a);
  if (a.out) {
    let h = BG('url(#morning)') + `<circle cx="1560" cy="200" r="90" fill="#FFF3B0"/><circle cx="1560" cy="200" r="240" fill="url(#warm)"/>` + `<rect x="-600" y="860" width="3120" height="620" fill="#9CCB72"/>`;
    for (let i = 0; i < 9; i++) { const x = -40 + i * 90, hh = 380 + hash(i) * 160; h += `<rect x="${x + 30}" y="${860 - hh * 0.4}" width="26" height="${hh * 0.4}" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/><path d="M${x - 40} ${860 - hh * 0.35} L${x + 43} ${860 - hh} L${x + 126} ${860 - hh * 0.35} Z" fill="${['#3F7F33', '#4E9A3E'][i % 2]}" stroke="${INK}" stroke-width="6"/>`; }
    const zx = lerp(620, 1180, easeOut(prog(lt, 0, 0.6 * D)));
    h += shadow(zx, 1004, 70) + Z({ t, seed: 810, x: zx, y: 1000, s: 0.8, pose: lt < 0.6 * D ? walkPose(t * 8, 0.8) : '만세', ex: exprAt([[0, '결심'], [0.6 * D, '신남']], lt), look: [0.6, -0.3] });
    if (lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, 1460, 420, outlined(0, 0, ['적어도 숲 밖으로!'], { size: 70, sw: 14, fill: YEL }), { rot: -3 });
    return h;
  }
  let h = BG('#E9E1D0') + BG('url(#paper)');
  const k1 = prog(lt, 0.05 * D, 0.5 * D), k2 = prog(lt, 0.5 * D, 0.8 * D);
  h += forestMap(140, 220, 760, 540, t, Math.max(0.02, k1), false, 3) + forestMap(1020, 220, 760, 540, t, Math.max(0.02, k2), true, 9);
  h += `<g transform="translate(520 160)">${label(0, 0, '이리저리 헤매면', { size: 38, bg: PINK, color: '#fff' })}</g><g transform="translate(1400 160)">${label(0, 0, '한 방향으로 곧장', { size: 38, bg: MINT })}</g>`;
  if (k2 >= 1) h += pop(t, t - lt + 0.8 * D, t + 99, 1700, 540, label(0, 0, '탈출!', { size: 40, bg: YEL }), { rot: 6 });
  h += pop(t, t - lt + 0.2, t + 99, 960, 830, label(0, 0, '— 데카르트, 『방법서설』 3부 · 숲 속 나그네의 비유', { size: 30, bg: '#fff' }), {});
  return h;
}
function capG(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-110 0 L0 -44 L110 0 L0 44 Z" fill="#1E2230" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-60 20 L-60 60 Q0 84 60 60 L60 20" fill="#1E2230" stroke="${INK}" stroke-width="6"/><path d="M80 10 L90 80" stroke="${YEL}" stroke-width="7"/><circle cx="90" cy="86" r="10" fill="${YEL}" stroke="${INK}" stroke-width="3"/></g>`; }
function jobCard(x, y, i, rot) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><rect x="-90" y="-60" width="180" height="120" rx="12" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-74" y="-44" width="40" height="40" rx="8" fill="${[MINT, PINK, YEL, '#7CC7FF'][i % 4]}" stroke="${INK}" stroke-width="3"/><line x1="-24" y1="-34" x2="70" y2="-34" stroke="#9AA6B2" stroke-width="7" stroke-linecap="round"/><line x1="-24" y1="-12" x2="40" y2="-12" stroke="#C3CDD8" stroke-width="7" stroke-linecap="round"/>${T8(0, 40, '연봉 ' + (3000 + (i * 137) % 900) + '만', { size: 22, fill: '#6B7A8C' })}</g>`; }
function gradsScene(t, lt, a) {
  const D = D_(a);
  if (a.res) {
    let h = BG(NAVY) + BG('url(#grid)');
    const k = easeOut(prog(lt, 0.1 * D, 0.5 * D)), k2 = easeOut(prog(lt, 0.45 * D, 0.85 * D));
    h += T8(560, 170, '연봉', { size: 50, fill: '#fff' }) + T8(1360, 170, '내 선택에 대한 만족', { size: 50, fill: '#fff' });
    h += vbar(440, 760, 170, 440, 0.62 * k, '#9AA6B2', '', '충분하면 OK', { bc: '#fff', bs: 30 }) + vbar(680, 760, 170, 440, 0.62 * 1.2 * k, PINK, k > 0.9 ? '+20%' : '', '끝없이 비교', { bc: '#fff', bs: 30, tc: '#fff' });
    h += vbar(1240, 760, 170, 440, 0.74 * k2, '#9AA6B2', '', '충분하면 OK', { bc: '#fff', bs: 30 }) + vbar(1480, 760, 170, 440, 0.48 * k2, PINK, k2 > 0.9 ? '↓' : '', '끝없이 비교', { bc: '#fff', bs: 30, tc: '#fff' });
    if (lt > 0.8 * D) h += pop(t, t - lt + 0.8 * D, t + 99, 1360, 240, label(0, 0, '더 불안 · 더 스트레스', { size: 34, bg: PINK, color: '#fff' }), {});
    return h;
  }
  if (a.menu) {
    let h = BG('#F6E3C4') + BG('url(#hatch)').replace('/>', ' opacity=".2"/>');
    h += `<rect x="260" y="120" width="760" height="560" rx="16" fill="#2F3A2E" stroke="${INK}" stroke-width="9"/>` + T8(640, 200, 'MENU', { size: 56, fill: YEL });
    const M = ['김치찌개', '된장찌개', '비빔밥', '제육볶음', '칼국수', '돈가스', '냉면', '떡볶이'];
    const pick = lt > 0.55 * D;
    M.forEach((m, i) => h += T8(i < 4 ? 440 : 820, 290 + (i % 4) * 90, m, { size: 42, fill: pick && i === 0 ? YEL : '#F4F1EA', op: pick && i ? 0.4 : 1 }));
    if (pick) h += `<rect x="320" y="245" width="240" height="64" rx="32" fill="none" stroke="${YEL}" stroke-width="7"/>`;
    const secs = Math.max(0, 180 - Math.floor(prog(lt, 0.05 * D, 0.55 * D) * 180));
    h += pop(t, t - lt + 0.1, t + 99, 1300, 230, `<g><circle r="90" fill="#fff" stroke="${INK}" stroke-width="8"/>${T8(0, 18, `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`, { size: 52 })}</g>`, {});
    h += `<rect x="1080" y="760" width="700" height="30" rx="8" fill="${WALNUT}" stroke="${INK}" stroke-width="7"/>`;
    if (pick) h += pop(t, t - lt + 0.6 * D, t + 99, 1240, 720, `<path d="M-110 0 Q-110 70 0 76 Q110 70 110 0 Z" fill="#C8423A" stroke="${INK}" stroke-width="7"/><ellipse cx="0" cy="0" rx="110" ry="24" fill="#E8734A" stroke="${INK}" stroke-width="6"/>${[0, 1, 2].map(i => `<path d="M${-30 + i * 30} -30 q10 -20 0 -40" fill="none" stroke="#fff" stroke-width="5" opacity=".7"/>`).join('')}`, {});
    h += Z({ t, seed: 820, x: 1600, y: 1000, s: 0.62, pose: pick ? '만세' : '턱괴기', ex: exprAt([[0, '결심'], [0.6 * D, '신남']], lt), look: [-0.6, -0.3] });
    if (lt > 0.75 * D) for (let i = 0; i < 3; i++) h += `<g opacity="${f1(Math.sin(((t * 0.6 + i / 3) % 1) * Math.PI) * 100) / 100}">${heart(1250 + i * 160, 520 - ((t * 0.6 + i / 3) % 1) * 160, 1.3, [PINK, YEL, MINT][i])}</g>`;
    return h;
  }
  let h = BG('#EEF1F6') + BG('url(#paper)');
  const n = Math.floor(prog(lt, 0.2 * D, D) * 26);
  for (let i = 0; i < n; i++) { const ang = -150 + i * 12, r = 330 + (i % 3) * 40; h += jobCard(960 + Math.cos(ang * Math.PI / 180) * r, 600 + Math.sin(ang * Math.PI / 180) * r * 0.75, i, (hash(i) - 0.5) * 30); }
  h += Z({ t, seed: 821, x: 960, y: 960, s: 0.7, pose: '턱괴기', ex: exprAt([[0, '결심'], [0.6 * D, '걱정']], lt), look: [Math.sin(t * 3) * 0.8, -0.4], wig: false, bandCollar: false }) + capG(960, 960 - 0.7 * 530, 0.7);
  h += pop(t, t - lt + 0.3, t + 99, 960, 190, label(0, 0, `비교 중… ${n}곳`, { size: 40, bg: YEL }), {});
  return h;
}

/* ---------- the human side: Stockholm, 5 a.m. ---------- */
function crownG(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-60 20 L-70 -40 L-32 -6 L0 -54 L32 -6 L70 -40 L60 20 Z" fill="#FFD25A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><circle cx="0" cy="-54" r="9" fill="${PINK}" stroke="${INK}" stroke-width="3"/></g>`; }
function swedenScene(t, lt, a) {
  const D = D_(a);
  if (a.queen) {
    let h = BG('#141A3A') + BG('url(#dots)');
    for (let i = 0; i < 60; i++) { const k = (t * 0.2 + hash(i * 1.3)) % 1; h += `<circle cx="${f1(hash(i * 3.7) * 1920 + Math.sin(t + i) * 10)}" cy="${f1(-20 + k * 1100)}" r="${f1(3 + hash(i) * 4)}" fill="#fff" opacity=".85"/>`; }
    h += `<path d="M1060 880 L1060 360 L1140 360 L1140 300 L1200 300 L1200 360 L1360 360 L1360 260 L1440 200 L1520 260 L1520 360 L1680 360 L1680 300 L1740 300 L1740 880 Z" fill="#3B4470" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
    for (let i = 0; i < 6; i++) h += `<rect x="${1110 + i * 100}" y="480" width="44" height="70" rx="20" fill="${i === 2 ? '#FFD27A' : '#22284A'}" stroke="${INK}" stroke-width="5"/>`;
    h += `<rect x="-600" y="880" width="3120" height="600" fill="#E8EEF6"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
    h += pop(t, t - lt + 0.1, t + 99, 330, 220, wallClock(0, 0, 90, 5, 0), {}) + pop(t, t - lt + 0.2, t + 99, 330, 360, label(0, 0, '새벽 5시', { size: 38, bg: YEL }), {});
    h += candle(760, 900, t);
    h += DC({ t, seed: 830, x: 620, y: 1000, s: 0.74, ex: exprAt([[0, '걱정']], t), look: [0.7, -0.2], shiver: true });
    if (lt > 0.25 * D) h += pop(t, t - lt + 0.25 * D, t + 99, 1000, 1000, QC({ t, seed: 831, x: 0, y: 0, s: 0.74, ex: exprAt([[0, '뿌듯']], t), look: [-0.7, -0.2] }) + crownG(0, -0.74 * 520, 0.74), { noPop: true, inDur: 0.4 });
    if (lt > 0.3 * D) h += pop(t, t - lt + 0.3 * D, t + 99, 1000, 380, label(0, 0, '크리스티나 여왕', { size: 36, bg: '#fff' }), {});
    if (lt > 0.7 * D) h += pop(t, t - lt + 0.7 * D, t + 99, 1240, 150, label(0, 0, '1650년 2월 · 스톡홀름', { size: 38, bg: '#B9C6E8' }), {});
    return h;
  }
  let h = study8(t) + `<rect x="1240" y="150" width="380" height="320" rx="10" fill="#A9DBFF" stroke="${INK}" stroke-width="10"/><circle cx="1500" cy="230" r="46" fill="#FFF3B0"/><circle cx="1500" cy="230" r="120" fill="url(#warm)"/><line x1="1430" y1="150" x2="1430" y2="470" stroke="${INK}" stroke-width="8"/><line x1="1240" y1="310" x2="1620" y2="310" stroke="${INK}" stroke-width="8"/>`;
  h += pop(t, t - lt + 0.1, t + 99, 330, 230, wallClock(0, 0, 80, 11, 0), {}) + pop(t, t - lt + 0.2, t + 99, 330, 360, label(0, 0, '늦은 아침', { size: 32, bg: '#fff' }), {});
  h += `<rect x="440" y="560" width="70" height="330" rx="16" fill="#6A4529" stroke="${INK}" stroke-width="7"/><rect x="470" y="720" width="900" height="120" rx="20" fill="#8C6638" stroke="${INK}" stroke-width="8"/><rect x="500" y="680" width="860" height="60" rx="24" fill="#F4F1EA" stroke="${INK}" stroke-width="7"/>`;
  h += `<ellipse cx="610" cy="672" rx="90" ry="40" fill="#fff" stroke="${INK}" stroke-width="6"/>`;
  h += DC({ t, seed: 832, x: 980, y: 700, s: 0.6, rot: -90, ex: exprAt([[0, '뿌듯']], t), look: [0.4, -0.8] });
  h += `<path d="M720 690 Q1000 640 1340 676 L1350 744 L716 744 Z" fill="#7C8FD6" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M760 700 Q1000 670 1320 690" fill="none" stroke="#5E70B8" stroke-width="6"/>`;
  h += pop(t, t - lt + 0.3 * D, t + 99, 1000, 380, bubble(0, 0, 360, 170, `<circle cx="-60" cy="0" r="40" fill="none" stroke="${INK}" stroke-width="6"/><path d="M20 30 L70 -40 L120 30 Z" fill="none" stroke="${INK}" stroke-width="6"/>`), { bob: 4 });
  if (lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 960, 140, label(0, 0, '침대에 누워 생각하기를 즐겼다고', { size: 38, bg: YEL }), { rot: -2 });
  return h;
}

/* ---------- recap ---------- */
const RECAP8 = [['1', '당연한 것 의심하기'], ['2', '빠른 답 의심하기'], ['3', '문제를 잘게 나누기'], ['4', '눈에 보이는 것도 의심하기'], ['5', '정했다면 곧장 걷기']];
function recapScene(t, lt, a) {
  let h = BG(NAVY) + BG('url(#grid)');
  h += outlined(960, 120, ['만약에, 데카르트처럼 모든 걸 의심한다면?'], { size: 56, sw: 12, fill: YEL });
  RECAP8.forEach((it, i) => {
    if (i >= a.k) return;
    const appear = a.k === 3 ? i * 1.3 : (a.k === 5 && i >= 3 ? (i - 3) * 1.6 : -1);
    const k = a.k === 5 && i < 3 ? 1 : easeOutBack(clamp((lt - appear) / 0.4, 0, 1));
    const y = 250 + i * 120;
    h += `<g transform="translate(${f1(lerp(-300, 0, clamp(k, 0, 1.2)))} 0)" opacity="${f1(clamp(k, 0, 1) * 100) / 100}">${label(480, y, it[0], { size: 44, bg: i === 4 ? YEL : MINT })}<text x="560" y="${y + 18}" font-family="${FONT}" font-weight="900" font-size="54" fill="#fff">${esc(it[1])}</text></g>`;
  });
  h += Z({ t, seed: 15, x: 1660, y: 980, s: 0.55, pose: walkPose(t * 7, 0.6), ex: exprAt([[0, '신남']], t) });
  return h;
}

/* ---------- ending ---------- */
function lantern(x, y, s, t) { const fl = 1 + Math.sin(t * 9) * 0.04; return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><circle r="${f1(300 * fl)}" fill="url(#warm)" opacity=".9"/><path d="M-30 -110 Q0 -150 30 -110" fill="none" stroke="${INK}" stroke-width="7"/><rect x="-46" y="-110" width="92" height="20" rx="6" fill="#3A3A44" stroke="${INK}" stroke-width="5"/><rect x="-40" y="-90" width="80" height="120" rx="12" fill="#FFE9A8" fill-opacity=".9" stroke="${INK}" stroke-width="6"/><path d="M0 ${f1(-50 * fl)} Q14 -20 0 0 Q-14 -20 0 ${f1(-50 * fl)} Z" fill="#FFB547" stroke="${INK}" stroke-width="3"/><rect x="-46" y="30" width="92" height="18" rx="6" fill="#3A3A44" stroke="${INK}" stroke-width="5"/></g>`; }
function lampScene(t, lt, a) {
  const D = D_(a);
  if (!a.me && !a.ask) { // doubt as a tool to build
    let h = BG('url(#sunset)') + `<rect x="-600" y="860" width="3120" height="620" fill="#B58C5E"/><line x1="-600" y1="860" x2="2520" y2="860" stroke="${INK}" stroke-width="7"/>`;
    h += `<rect x="1170" y="840" width="560" height="50" rx="10" fill="#9AA3AE" stroke="${INK}" stroke-width="8"/>`;
    h += houseG(1450, 840, 1, 0, Math.max(0.05, prog(lt, 0.05 * D, 0.85 * D)));
    h += Z({ t, seed: 840, x: 900, y: 1000, s: 0.8, pose: '서기', ex: exprAt([[0, '결심'], [0.85 * D, '신남']], lt), look: [0.8, -0.3] });
    const [hx, hy] = handG(900, 1000, 0.8, P['서기'].hR);
    h += `<g transform="translate(${f1(hx)} ${f1(hy)}) rotate(${f1(40 + Math.sin(t * 6) * 25)})"><rect x="-8" y="-130" width="16" height="150" rx="6" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/>${T8(0, -110, '?', { size: 100, fill: YEL, stroke: INK, sw: 8 })}</g>`;
    h += pop(t, t - lt + 0.2, t + 99, 640, 220, outlined(0, 0, [[['의심은 ', '#fff'], ['부수는 망치', '#C3CDD8'], ['가 아니라', '#fff']], [['더 단단한 생각을 짓는 ', '#fff'], ['연장', YEL]]], { size: 58, sw: 12 }), {});
    return h;
  }
  let h = BG('#1A1C33');
  h += qmarks(t, 61, 20, [0, 80, 1920, 860], { size: 60, speed: 0.07, color: '#5B607F', op: 0.6 });
  h += Z({ t, seed: 841, x: 960, y: 1000, s: 0.86, pose: '손인사', ex: exprAt([[0, '뿌듯']], t), look: [0.4, -0.4] });
  { const [lx, ly] = handG(960, 1000, 0.86, P['손인사'].hR); h += lantern(lx + 4, ly + 150, 1.0, t) + hand(lx, ly, 0.86); }
  if (a.me && lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 960, 170, outlined(0, 0, [[['흔들려도, ', '#fff'], ['질문하는 나는 여기', YEL]]], { size: 72, sw: 14 }), {});
  if (a.ask) h += pop(t, t - lt + 0.3, t + 99, 520, 330, `<path d="M-380 -90 L380 -90 Q410 -90 410 -60 L410 50 Q410 80 380 80 L180 80 L230 140 L120 80 L-380 80 Q-410 80 -410 50 L-410 -60 Q-410 -90 -380 -90 Z" fill="#fff" stroke="${INK}" stroke-width="7"/>${T8(0, 14, '오늘 무엇을 의심해 볼까요?', { size: 44 })}`, { rot: -2, bob: 5 });
  return h;
}
