/* ---------- experiment 008 v2: Zhuangzi & Huizi, clearer scenes, no costume ---------- */
Object.assign(CAMS, {
  plan: [1.0, 1.05, 960, 520], king: [1.0, 1.05, 960, 520], hz: [1.0, 1.05, 960, 520], park: [1.0, 1.08, 960, 560], reuse: [1.0, 1.05, 960, 520],
  timer: [1.0, 1.06, 960, 540], sleep: [1.0, 1.05, 960, 540], useless: [1.0, 1.04, 960, 520], bridge: [1.0, 1.05, 960, 500],
  grave: [1.0, 1.06, 960, 520], axe: [1.0, 1.04, 960, 520], tree: [1.0, 1.04, 960, 520], cook: [1.0, 1.04, 960, 520], turtle: [1.0, 1.04, 960, 520]
});
P['내밀기'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [318, 300], [380, 292]], hR: [388, 290] }, LEGS);
P['집기'] = Object.assign({ armL: [[148, 285], [100, 318], [58, 330]], hL: [50, 332], armR: [[252, 285], [278, 345], [284, 398]], hR: [286, 406] }, LEGS);
P['가리키기'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [312, 330], [370, 360]], hR: [378, 364] }, LEGS);
P['지팡이'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [286, 340], [300, 392]], hR: [304, 400] }, LEGS);
const big = (x, y, lines, o = {}) => outlined(x, y, lines, Object.assign({ size: 72, sw: 14 }, o));
const ground = (y, c) => `<rect x="-600" y="${y}" width="3120" height="900" fill="${c}"/><line x1="-600" y1="${y}" x2="2520" y2="${y}" stroke="${INK}" stroke-width="7"/>`;
const PT = o => HALO(char(Object.assign({ goggles: 'none', vest: '#7CC7FF', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', hair: '#3A2A1E' }, o))); // a study participant / Zero's friend
function strike(x1, y1, x2, k, c = RED) { if (k <= 0) return ''; const xe = f1(lerp(x1, x2, clamp(k, 0, 1))); return `<line x1="${x1}" y1="${y1}" x2="${xe}" y2="${y1}" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${xe}" y2="${y1}" stroke="${c}" stroke-width="9" stroke-linecap="round"/>`; }
function timerG(x, y, txt, o = {}) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${o.s || 1})"><rect x="-22" y="-112" width="44" height="26" rx="8" fill="${INK}"/><circle r="94" fill="#fff" stroke="${INK}" stroke-width="9"/><circle r="78" fill="none" stroke="${o.ring || MINT}" stroke-width="10" stroke-dasharray="${f1(490 * (o.k == null ? 1 : o.k))} 600" transform="rotate(-90)"/>${T8(0, 18, txt, { size: 52 })}</g>`; }
const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
// speech balloon whose tail points at the speaker (tx, ty in scene coordinates)
function speech(x, y, w, hh, text, tx, ty, o = {}) {
  const dx = tx - x, dy = ty - y, bx = clamp(dx * 0.35, -w / 2 + 50, w / 2 - 50), by = dy > 0 ? hh / 2 : -hh / 2;
  const lines = Array.isArray(text) ? text : [text], fs = o.size || 40;
  let h = `<path d="M${f1(x + bx - 26)} ${f1(y + by - (dy > 0 ? 4 : -4))} L${f1(tx)} ${f1(ty)} L${f1(x + bx + 26)} ${f1(y + by - (dy > 0 ? 4 : -4))} Z" fill="${o.bg || '#fff'}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  h += `<rect x="${f1(x - w / 2)}" y="${f1(y - hh / 2)}" width="${w}" height="${hh}" rx="${Math.min(40, hh / 2)}" fill="${o.bg || '#fff'}" stroke="${INK}" stroke-width="7"/>`;
  h += `<path d="M${f1(x + bx - 22)} ${f1(y + by)} L${f1(x + bx + 22)} ${f1(y + by)}" stroke="${o.bg || '#fff'}" stroke-width="12"/>`;
  lines.forEach((ln, i) => h += T8(x, y + fs * 0.36 + (i - (lines.length - 1) / 2) * fs * 1.25, ln, { size: fs, fill: o.fill || NAVY }));
  return h;
}
function gnarled2(x, y, s, t = 0) { // a really crooked, knotted, half-bare tree
  const sw = Math.sin(t * 0.8) * 1.5;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  h += `<path d="M-110 0 Q-40 -50 -90 -130 Q-150 -220 -50 -270 Q30 -310 -20 -390 Q-50 -440 10 -470 L60 -460 Q20 -420 50 -370 Q100 -290 10 -240 Q-60 -200 10 -120 Q60 -50 100 0 Z" fill="#6E4A30" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  h += `<path d="M-60 -60 Q-30 -90 -50 -120 M-10 -300 Q20 -330 0 -360 M30 -200 Q50 -230 30 -250" fill="none" stroke="${INK}" stroke-width="5" opacity=".5"/>`;
  for (const [cx, cy, r] of [[-62, -170, 20], [30, -90, 15], [-20, -330, 14], [40, -260, 11]]) h += `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.3}" fill="#4A3020" stroke="${INK}" stroke-width="5"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.45}" ry="${r * 0.6}" fill="#2E1E14"/>`;
  h += `<g transform="rotate(${f1(sw)} 0 -400)">`;
  h += `<path d="M-60 -250 Q-170 -260 -200 -350 Q-215 -390 -290 -380 M-230 -365 Q-250 -420 -220 -450 M20 -420 Q120 -470 140 -540 Q150 -580 230 -575 M150 -560 Q170 -610 140 -640 M-20 -380 Q-110 -440 -90 -520 Q-80 -560 -130 -590 M40 -300 Q150 -300 210 -360 Q240 -390 300 -370" fill="none" stroke="#6E4A30" stroke-width="16" stroke-linecap="round"/>`;
  h += `<path d="M-60 -250 Q-170 -260 -200 -350 Q-215 -390 -290 -380 M20 -420 Q120 -470 140 -540 Q150 -580 230 -575 M-20 -380 Q-110 -440 -90 -520 Q-80 -560 -130 -590 M40 -300 Q150 -300 210 -360 Q240 -390 300 -370" fill="none" stroke="${INK}" stroke-width="4" opacity=".35"/>`;
  for (const [cx, cy, r] of [[-290, -390, 52], [-130, -600, 64], [230, -585, 58], [300, -380, 46], [-210, -450, 38], [60, -520, 44]]) h += `<path d="M${cx - r} ${cy} Q${cx - r} ${cy - r * 0.9} ${cx} ${cy - r * 0.8} Q${cx + r * 1.1} ${cy - r} ${cx + r} ${cy + r * 0.1} Q${cx + r * 0.6} ${cy + r * 0.7} ${cx} ${cy + r * 0.5} Q${cx - r * 0.8} ${cy + r * 0.7} ${cx - r} ${cy} Z" fill="#6F8F4E" stroke="${INK}" stroke-width="6"/>`;
  return h + `</g></g>`;
}
function oxG(x, y, s, k, t) { // a friendly side-view ox with dotted "grain" lines that light up
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  for (const lx of [-170, -110, 120, 180]) h += `<rect x="${lx - 18}" y="-10" width="36" height="150" rx="14" fill="#B98A5A" stroke="${INK}" stroke-width="7"/><rect x="${lx - 20}" y="118" width="40" height="26" rx="6" fill="#4A3828" stroke="${INK}" stroke-width="5"/>`;
  h += `<path d="M-250 -40 Q-250 ${f1(-30 + Math.sin(t * 3) * 10)} -290 ${f1(40 + Math.sin(t * 3) * 14)}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><circle cx="${f1(-292)}" cy="${f1(48 + Math.sin(t * 3) * 14)}" r="12" fill="#4A3828"/>`;
  h += `<ellipse cx="0" cy="-60" rx="260" ry="120" fill="#C99A66" stroke="${INK}" stroke-width="8"/><ellipse cx="-60" cy="-80" rx="70" ry="44" fill="#F1E2C8" opacity=".8"/><ellipse cx="120" cy="-30" rx="50" ry="36" fill="#F1E2C8" opacity=".8"/>`;
  h += `<g transform="translate(250 -120)"><ellipse cx="40" cy="0" rx="78" ry="64" fill="#C99A66" stroke="${INK}" stroke-width="8"/><ellipse cx="96" cy="26" rx="40" ry="30" fill="#F1C9B0" stroke="${INK}" stroke-width="6"/><circle cx="88" cy="22" r="5" fill="${INK}"/><circle cx="106" cy="26" r="5" fill="${INK}"/><circle cx="40" cy="-14" r="8" fill="${INK}"/><path d="M0 -50 Q-30 -100 10 -120 M70 -54 Q100 -100 74 -126" fill="none" stroke="#F1E2C8" stroke-width="14" stroke-linecap="round"/><path d="M0 -50 Q-30 -100 10 -120 M70 -54 Q100 -100 74 -126" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round" opacity=".5"/><ellipse cx="-24" cy="-20" rx="26" ry="14" transform="rotate(-30 -24 -20)" fill="#B98A5A" stroke="${INK}" stroke-width="5"/></g>`;
  const L = ['M-160 -170 Q-150 -60 -150 50', 'M-40 -178 Q-30 -60 -30 58', 'M80 -175 Q90 -60 90 56', 'M-250 -60 Q0 -40 250 -70', 'M180 -150 Q190 -60 190 30'];
  L.forEach((d, i) => { const on = i / L.length < k; h += `<path d="${d}" fill="none" stroke="${on ? '#1F9D6B' : '#8A6A44'}" stroke-width="${on ? 8 : 5}" stroke-dasharray="14 10" opacity="${on ? 1 : 0.6}"/>`; });
  return h + `</g>`;
}
function catG(x, y, s, t) { const tl = Math.sin(t * 4) * 12; return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-60 0 Q-100 ${f1(-30 + tl)} -96 ${f1(-70 + tl)}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M-60 0 Q-100 ${f1(-30 + tl)} -96 ${f1(-70 + tl)}" fill="none" stroke="#F2A33A" stroke-width="7" stroke-linecap="round"/><ellipse cx="0" cy="-30" rx="70" ry="44" fill="#F2A33A" stroke="${INK}" stroke-width="6"/><circle cx="56" cy="-74" r="40" fill="#F2A33A" stroke="${INK}" stroke-width="6"/><path d="M30 -104 L36 -140 L58 -110 Z M70 -110 L92 -138 L94 -100 Z" fill="#F2A33A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M42 -76 q6 -6 12 0 M66 -76 q6 -6 12 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M56 -62 q4 4 8 0" fill="none" stroke="${INK}" stroke-width="3"/></g>`; }
function grassField(t, y0, n = 30) { let h = ''; for (let i = 0; i < n; i++) { const x = hash(i * 1.7) * 1920, y = y0 + hash(i * 2.9) * 60, sw = Math.sin(t * 2 + i) * 6; h += `<path d="M${f1(x)} ${f1(y)} q${f1(sw)} -30 ${f1(sw * 1.5)} -46" fill="none" stroke="#6E9A44" stroke-width="5" stroke-linecap="round"/>`; } return h; }
function flowers(t, y0, n) { let h = ''; for (let i = 0; i < n; i++) { const x = 60 + i * (1800 / n), y = y0 + (i % 3) * 30; h += `<g transform="translate(${f1(x)} ${y})"><line x1="0" y1="0" x2="0" y2="-46" stroke="#4E9A3E" stroke-width="5"/>${[0, 72, 144, 216, 288].map(r => `<ellipse cx="0" cy="-58" rx="10" ry="17" transform="rotate(${r} 0 -46)" fill="${['#FF8FB1', '#FFD25A', '#B9A7FF', '#fff'][i % 4]}" stroke="${INK}" stroke-width="3"/>`).join('')}<circle cx="0" cy="-46" r="7" fill="${YEL}" stroke="${INK}" stroke-width="2"/></g>`; } return h; }
function zz(x, y, t, c = '#5A6B8C') { let h = ''; for (let i = 0; i < 3; i++) { const k = ((t * 0.45 + i / 3) % 1); h += T8(x + k * 80, y - k * 130, 'z', { size: 34 + i * 10, fill: c, op: f1(Math.sin(k * Math.PI) * 100) / 100 }); } return h; }
const lyingHead = (x, y, s) => [x - 390 * s, y]; // head centre of a character drawn with rot -88

/* ---------- hook kept; Zero plans even his day off ---------- */
function planScene(t, lt, a) {
  const D = D_(a);
  let h = livingRoom(t, false);
  h += `<g transform="translate(330 270)"><rect x="-120" y="-110" width="240" height="220" rx="14" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-120" y="-110" width="240" height="60" rx="14" fill="${RED}" stroke="${INK}" stroke-width="7"/>${T8(0, -66, '토요일', { size: 34, fill: '#fff' })}${T8(0, 40, '쉬는 날', { size: 46 })}</g>`;
  h += Z({ t, seed: 960, x: 700, y: 950, s: 0.8, pose: lt > 0.75 * D ? '손인사' : '책상', ex: exprAt([[0, '결심'], [0.75 * D, '뿌듯']], lt), look: [0.6, 0.4] });
  h += deskG(760, 760, 560);
  h += panel(1100, 110, 640, 680, { r: 20 }) + T8(1420, 200, '쉬는 날 계획표', { size: 46 });
  const items = ['09:00 독서 30분', '10:00 운동 1시간', '12:00 점심', '14:00 쉬기 (30분)', '15:00 자기계발'];
  items.forEach((it, i) => {
    const y = 320 + i * 96, at = 0.05 * D + i * 0.12 * D, ck = lt > at + 0.25 * D;
    if (lt < at) return;
    if (i === 3 && lt > 0.55 * D) h += `<rect x="1130" y="${y - 40}" width="580" height="70" rx="14" fill="${YEL}" opacity=".85"/>`;
    h += `<rect x="1140" y="${y - 28}" width="44" height="44" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/>` + (ck ? `<path d="M1148 ${y - 6} L1160 ${y + 8} L1180 ${y - 18}" fill="none" stroke="#1F9D6B" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>` : '') + T8(1206, y + 8, it, { anchor: 'start', size: 38, w: 800 });
  });
  if (lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, 1420, 860, label(0, 0, '쉬는 것도 계획대로!', { size: 40, bg: PINK, color: '#fff' }), { rot: -2 });
  return h;
}

/* ---------- Zhuangzi: poor but not worn down ---------- */
const _zhOld = zhScene;
zhScene = function (t, lt, a) {
  const D = D_(a);
  if (a.k !== 1) return _zhOld(t, lt, a);
  let h = inkBg(t, { sx: 1600, sy: 200 });
  for (let i = 0; i < 6; i++) { const x = 120 + i * 320, y = 880 + (i % 2) * 20; h += `<g transform="translate(${x} ${y}) scale(.8)"><rect x="-14" y="-240" width="28" height="240" fill="#6A4529" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="-280" rx="120" ry="90" fill="#6E9A54" stroke="${INK}" stroke-width="6"/><rect x="30" y="-90" width="34" height="40" rx="6" fill="#B57D48" stroke="${INK}" stroke-width="4"/></g>`; }
  const walk = prog(lt, 0, 0.55 * D), zx = lerp(560, 900, easeOut(walk));
  h += ZH({ t, seed: 901, x: zx, y: 940, s: 0.86, pose: walk < 1 ? walkPose(t * 5, 0.45) : '서기', ex: exprAt([[0, '뿌듯']], t), look: [0.5, -0.1], patches: true, tied: true });
  h += pop(t, t - lt + 0.1 * D, t + 99, 960, 130, label(0, 0, '옻나무 밭 관리인 · 평생 가난', { size: 42, bg: YEL }), {});
  if (lt > 0.55 * D) {
    h += pop(t, t - lt + 0.55 * D, t + 99, 1300, 520, label(0, 0, '기운 옷', { size: 40, bg: '#fff' }), { rot: 3 }) + `<line x1="1220" y1="540" x2="${f1(zx + 30)}" y2="${f1(940 - 0.86 * 230)}" stroke="${INK}" stroke-width="5" stroke-dasharray="10 8" opacity="${f1(prog(lt, 0.55 * D, 0.6 * D) * 100) / 100}"/>`;
    h += pop(t, t - lt + 0.7 * D, t + 99, 1340, 820, label(0, 0, '끈으로 동여맨 신발', { size: 40, bg: '#fff' }), { rot: -2 }) + `<line x1="1180" y1="820" x2="${f1(zx + 40)}" y2="925" stroke="${INK}" stroke-width="5" stroke-dasharray="10 8" opacity="${f1(prog(lt, 0.7 * D, 0.75 * D) * 100) / 100}"/>`;
  }
  return h;
};
function palace(t) {
  let h = BG('#E9DCC0') + BG('url(#paper)') + ground(880, '#B98A5A');
  for (const x of [180, 700, 1220, 1740]) h += `<rect x="${x - 34}" y="120" width="68" height="760" fill="${SILK}" stroke="${INK}" stroke-width="7"/><rect x="${x - 48}" y="110" width="96" height="30" fill="#8A2E26" stroke="${INK}" stroke-width="6"/>`;
  h += `<path d="M-600 120 L2520 120 L2520 60 L-600 60 Z" fill="#8A2E26" stroke="${INK}" stroke-width="7"/>`;
  return h;
}
function kingScene(t, lt, a) {
  const D = D_(a);
  let h = palace(t);
  h += `<rect x="1300" y="620" width="300" height="260" rx="20" fill="#C9A04A" stroke="${INK}" stroke-width="8"/><rect x="1270" y="520" width="360" height="110" rx="20" fill="#B8862E" stroke="${INK}" stroke-width="8"/>`;
  h += kingG(t, 1450, 900, 0.7);
  h += ZH({ t, seed: 961, x: 560, y: 940, s: 0.82, pose: lt > 0.55 * D ? '손인사' : '서기', ex: exprAt([[0, '기본'], [0.55 * D, '뿌듯']], lt), look: [0.7, -0.2], patches: true, tied: true });
  h += pop(t, t - lt + 0.1, t + 99, 1450, 200, label(0, 0, '위나라 왕', { size: 36, bg: '#fff' }), {});
  if (lt > 0.05 * D) h += pop(t, t - lt + 0.05 * D, t + 99, 0, 0, speech(1240, 330, 560, 120, '어찌 그리 고달파 보이시오?', 1420, 470), { noPop: true, inDur: 0.3 });
  if (lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 0, 0, speech(600, 300, 640, 150, ['가난한 거지,', '고달픈 건 아닙니다'], 580, 470, { size: 44 }), { noPop: true, inDur: 0.3 });
  if (lt > 0.8 * D) h += pop(t, t - lt + 0.8 * D, t + 99, 960, 640, big(0, 0, [[['가난', '#fff'], [' ≠ ', YEL], ['고달픔', '#fff']]], { size: 76 }), {});
  return h;
}

/* ---------- Huizi: the lifelong sparring partner ---------- */
function hzScene(t, lt, a) {
  const D = D_(a);
  let h = inkBg(t, { sx: 300, sy: 190 });
  h += `<g transform="translate(1480 880)"><rect x="-260" y="-260" width="520" height="260" fill="#E8D7B8" stroke="${INK}" stroke-width="7"/><path d="M-330 -250 Q0 -360 330 -250 L290 -300 Q0 -400 -290 -300 Z" fill="#5A4A6A" stroke="${INK}" stroke-width="7"/><rect x="-60" y="-160" width="120" height="160" fill="#8A2E26" stroke="${INK}" stroke-width="6"/></g>`;
  if (!a.k) {
    h += ZH({ t, seed: 962, x: 520, y: 940, s: 0.78, ex: exprAt([[0, '뿌듯']], t), look: [0.8, -0.2] });
    h += HZ({ t, seed: 963, x: 1060, y: 940, s: 0.82, pose: lt > 0.3 * D ? '손인사' : '서기', ex: exprAt([[0, '결심']], t), look: [-0.6, -0.2] });
    h += pop(t, t - lt + 0.35 * D, t + 99, 1060, 420, label(0, 0, '혜자 · 위나라 재상', { size: 42, bg: '#9DB8D9' }), {});
    if (lt > 0.05 * D) h += pop(t, t - lt + 0.05 * D, t + 99, 960, 140, big(0, 0, [[['평생의 ', '#fff'], ['말다툼 친구', YEL]]], { size: 76 }), {});
    return h;
  }
  const ping = lt > 0.45 * D;
  h += ZH({ t, seed: 962, x: 520, y: 940, s: 0.78, pose: ping ? '만세' : '서기', ex: exprAt([[0, '기본'], [0.45 * D, '신남']], lt), look: [0.8, -0.2] });
  h += HZ({ t, seed: 963, x: 1240, y: 940, s: 0.82, pose: ping ? '서기' : '가리키기', ex: exprAt([[0, '결심'], [0.5 * D, '화남']], lt), look: [-0.7, -0.2] });
  h += pop(t, t - lt + 0.05 * D, t + 99, 0, 0, speech(1300, 290, 560, 120, '그게 무슨 쓸모가 있나?', 1250, 470), { noPop: true, inDur: 0.3 });
  if (ping) h += pop(t, t - lt + 0.45 * D, t + 99, 0, 0, speech(560, 260, 520, 120, '쓸모없어서 좋은데?', 540, 480), { noPop: true, inDur: 0.3 });
  if (ping) for (let i = 0; i < 4; i++) { const k = (t * 1.5 + i / 4) % 1; h += `<path d="M${f1(880 + i * 30)} ${f1(560 - k * 40)} l20 -30 l-6 24 l22 -10" fill="none" stroke="${YEL}" stroke-width="6" stroke-linecap="round" opacity="${f1((1 - k) * 100) / 100}"/>`; }
  return h;
}

/* ---------- title: no costume; vertical list ---------- */
const LIST9B = ['쓸모없는 나무 아래 눕기', '큰 박을 다르게 쓰기', '아무것도 안 하고 가만히 있기', '힘 빼고 결 따라 하기', '진흙 속 거북처럼 살기'];
titleScene = function (t, lt, a) {
  let h = BG('url(#labG)') + BG('url(#grid)');
  h += particles(t, 5, 40, [0, 0, 1920, 1080], MINT, { speed: 40, r: 4, op: 0.6 });
  if (a.list) {
    h += big(960, 120, ['만약에, 장자처럼 쓸모없음을 즐긴다면?'], { size: 56, sw: 12, fill: YEL });
    LIST9B.forEach((it, i) => {
      const at = 0.15 * (a._dur || 8) + i * 0.45; if (lt < at) return;
      const k = easeOutBack(clamp((lt - at) / 0.4, 0, 1)), y = 270 + i * 118;
      h += `<g opacity="${f1(clamp(k, 0, 1) * 100) / 100}" transform="translate(${f1(lerp(-120, 0, clamp(k, 0, 1)))} 0)">${label(330, y, (i + 1) + '일 차', { size: 40, bg: i === 4 ? YEL : MINT })}${T8(450, y + 18, it, { anchor: 'start', size: 54, fill: '#fff' })}</g>`;
    });
    h += `<ellipse cx="1620" cy="900" rx="220" ry="50" fill="url(#glow)"/>`;
    h += Z({ t, seed: 7, x: 1620, y: 900, s: 0.62, pose: '손인사', ex: exprAt([[0, '신남']], lt), look: [-0.6, -0.2] });
    return h;
  }
  h += `<ellipse cx="960" cy="900" rx="320" ry="70" fill="url(#glow)"/><ellipse cx="960" cy="900" rx="260" ry="54" fill="#2E4260" stroke="${INK}" stroke-width="8"/>`;
  h += doctor(520, 960, 0.55, { t, expr: '미소', talk: env(t) });
  h += pop(t, t - lt + 0.2, t + 99, 960, 230, big(0, 0, [[['만약에, ', YEL], ['장자처럼', '#fff']], '쓸모없음을 즐긴다면?'], { size: 92, sw: 18 }), {});
  const land = 1.2;
  h += Z({ t, seed: 7, x: 960, y: 890, s: 0.6, pose: lt > land ? '만세' : '서기', ex: exprAt([[0, '기본'], [land, '신남']], lt) });
  if (lt > land) h += butterfly(1180 + Math.sin(t * 1.3) * 60, 560 + Math.sin(t * 2.1) * 30, 0.7, t);
  if (lt > land + 0.2) h += pop(t, t - lt + land + 0.2, t + 99, 1400, 700, label(0, 0, '쓸모없음 실험 5일', { size: 40, bg: YEL }), { rot: 4, bob: 4 });
  return h;
};

/* ---------- myth: uselessness is not laziness ---------- */
mythScene = function (t, lt, a) {
  const D = D_(a), x = prog(lt, 0.45 * D, 0.52 * D);
  let h = '';
  if (x < 1) {
    let g = BG(INKP) + BG('url(#paper)');
    g += panel(200, 220, 680, 560, { fill: '#EDE6D3' }) + panel(1040, 220, 680, 560, { fill: '#E3F0DA' });
    g += sofa(240, 520);
    g += Z({ t, seed: 911, x: 540, y: 760, s: 0.55, pose: '폰보기', ex: exprAt([[0, '지침']], t), look: [0, 0.9] }) + phone(...handG(540, 760, 0.55, [200, 318]), 0.28, { on: 1 });
    g += T8(540, 300, '할 일 미루며 늘어지기', { size: 40 });
    g += gnarled2(1460, 760, 0.42, t) + Z({ t, seed: 912, x: 1240, y: 760, s: 0.5, ex: exprAt([[0, '신남']], t), look: [0.4, -0.8] });
    g += T8(1380, 300, '잠시 쓸모를 내려놓기', { size: 40 });
    g += pop(t, t - lt + 0.1, t + 99, 960, 130, big(0, 0, [[['쓸모없음', YEL], [' ≠ ', '#fff'], ['게으름', '#fff']]], { size: 76, sw: 15 }), {});
    h += `<g opacity="${f1((1 - x) * 100) / 100}">${g}</g>`;
  }
  if (x > 0) {
    let g = inkBg(t, { sx: 260, sy: 170 });
    const bloom = prog(lt, 0.5 * D, 0.8 * D);
    for (let i = 0; i < 12; i++) { const k = clamp(bloom * 1.6 - hash(i) * 0.6, 0, 1); if (k <= 0) continue; const fx = 160 + i * 140 + hash(i * 3) * 40, fy = 900 + hash(i * 5) * 40; g += `<g transform="translate(${f1(fx)} ${f1(fy)}) scale(${f1(easeOutBack(k) * 100) / 100})"><line x1="0" y1="0" x2="0" y2="-60" stroke="#4E9A3E" stroke-width="6"/>${[0, 72, 144, 216, 288].map(r => `<ellipse cx="0" cy="-74" rx="12" ry="22" transform="rotate(${r} 0 -60)" fill="${['#FF8FB1', '#FFD25A', '#B9A7FF', '#fff'][i % 4]}" stroke="${INK}" stroke-width="3"/>`).join('')}<circle cx="0" cy="-60" r="9" fill="${YEL}" stroke="${INK}" stroke-width="3"/></g>`; }
    if (bloom > 0.3) g += butterfly(1300 + Math.sin(t) * 120, 560 + Math.sin(t * 1.7) * 40, 0.6, t);
    const down = easeInOut(prog(lt, 0.52 * D, 0.65 * D));
    g += Z({ t, seed: 910, x: 420, y: 940, s: 0.72, pose: down < 1 ? '손인사' : '서기', ex: exprAt([[0, '결심'], [0.65 * D, '신남']], lt), look: [0.6, 0.2] });
    g += rulerG(lerp(560, 640, down), lerp(560, 930, down), 0.7, lerp(-20, 0, down));
    g += quote(1100, 240, ['“쓸모 있음의 쓸모는 알아도,', '쓸모없음의 쓸모는 모른다”'], '— 『장자』 인간세', t, lt, 0.6 * D, { size: 54, srcDy: 150 });
    h += `<g opacity="${f1(x * 100) / 100}">${g}</g>`;
  }
  return h;
};

/* ---------- chapter cards ---------- */
chapterScene = function (t, lt, a) {
  let h = BG(NAVY) + BG('url(#grid)');
  h += particles(t, 9, 30, [0, 0, 1920, 1080], MINT, { speed: 30, r: 4, op: 0.5 });
  const k = easeOut(prog(lt, 0, 0.6));
  h += `<g opacity="${f1(k * 100) / 100}" transform="translate(${f1((1 - k) * -60)} 0)">`;
  h += big(960, 330, [[[a.n + '일 차', YEL]]], { size: 92, sw: 16 });
  h += big(960, 560, [a.name], { size: a.name.length > 11 ? 96 : 116, sw: 22 });
  h += `</g>`;
  for (let i = 1; i <= 5; i++) h += `<circle cx="${960 + (i - 3) * 70}" cy="700" r="${i === a.n ? 16 : 11}" fill="${i <= a.n ? MINT : '#33465F'}" stroke="${INK}" stroke-width="4"/>`;
  const zx = lerp(-200, 2100, prog(lt, 0, 6));
  h += Z({ t, seed: 9, x: zx, y: 880, s: 0.3, pose: walkPose(t * 9, 0.9), ex: exprAt([[0, '기본']], t) });
  return h;
};

/* ---------- day 1: the useless tree ---------- */
treeScene = function (t, lt, a) {
  const D = D_(a);
  if (a.k) {
    let h = inkBg(t, { y1: 560, y2: 680, gy: 880, gc: '#B7C98F', sx: 1650, sy: 190 });
    h += gnarled2(1480, 890, 1.0, t);
    const zx = 1290, zy = 880, zs = 0.62, [hx, hy] = lyingHead(zx, zy, zs);
    h += ZH({ t, seed: 921, x: zx, y: zy, s: zs, rot: -88, ex: { expr: '잠', prev: '잠', k: 1, blink: 0 }, noBlink: true });
    h += fanG(hx + 150, hy - 70, 0.45, 20 + Math.sin(t * 2) * 6);
    h += zz(hx + 10, hy - 110, t);
    if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 420, 470, axeG(0, 0, 1) + xMark(0, 0, 0.9), {}) + pop(t, t - lt + 0.66 * D, t + 99, 420, 640, label(0, 0, '도끼 걱정 없음', { size: 40, bg: YEL }), {});
    h += pop(t, t - lt + 0.2, t + 99, 640, 140, label(0, 0, '넓은 들판에 심어 두고, 그 아래 눕기', { size: 40, bg: '#fff' }), { rot: -2 });
    return h;
  }
  let h = inkBg(t, { sx: 1600, sy: 200 });
  h += gnarled2(1060, 900, 1.0, t);
  h += HZ({ t, seed: 923, x: 470, y: 940, s: 0.78, pose: lt > 0.15 * D ? '가리키기' : '서기', ex: exprAt([[0, '걱정'], [0.4 * D, '지침']], lt), look: [0.7, -0.3] });
  h += pop(t, t - lt + 0.05, t + 99, 470, 360, label(0, 0, '혜자', { size: 40, bg: '#9DB8D9' }), {});
  if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 1060, 150, label(0, 0, '줄기는 울퉁불퉁, 가지는 비비 꼬여', { size: 40, bg: YEL }), { rot: 2 });
  if (lt > 0.62 * D) { const cx = lerp(1300, 1900, prog(lt, 0.62 * D, D)); h += carpenter(t, cx, 940, 0.6, lt) + pop(t, t - lt + 0.66 * D, t + 99, 1560, 470, bubble(0, 0, 320, 110, T8(12, 14, '쓸 데가 없군', { size: 38 })), {}); }
  return h;
};
function parkScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#morning)') + clouds(t, 90, 16, 3, 5) + ground(880, '#9CCB72') + grassField(t, 900);
  h += `<rect x="1160" y="480" width="44" height="400" fill="#7A5235" stroke="${INK}" stroke-width="7"/><circle cx="1182" cy="400" r="170" fill="#58B868" stroke="${INK}" stroke-width="8"/><circle cx="1080" cy="470" r="110" fill="#58B868" stroke="${INK}" stroke-width="8"/><circle cx="1300" cy="460" r="110" fill="#58B868" stroke="${INK}" stroke-width="8"/>`;
  const zx = 1060, zy = 880, zs = 0.66, [hx, hy] = lyingHead(zx, zy, zs), out = lt > 0.38 * D;
  h += `<ellipse cx="${f1(hx + 100)}" cy="890" rx="260" ry="20" fill="#000" opacity=".12"/>`;
  h += Z({ t, seed: 964, x: zx, y: zy, s: zs, rot: -88, pose: out ? '누워폰' : '서기', ex: exprAt([[0, '뿌듯'], [0.38 * D, '기본'], [0.62 * D, '걱정']], lt), look: out ? [0.3, -0.9] : [0, -0.6] });
  if (out) { const [qx, qy] = rotPt(zx, zy, zs, -88, [282, 243]); h += phone(qx, qy - 40, 0.42, { back: 1 }); }
  h += pop(t, t - lt + 0.1, t + 99, 420, 300, timerG(0, 0, out ? '4:52' : '0:30', { k: out ? 0.98 : 0.1 }), {});
  if (out) h += pop(t, t - lt + 0.4 * D, t + 99, 420, 450, label(0, 0, '5분도 안 돼서…', { size: 40, bg: PINK, color: '#fff' }), {});
  if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 1000, 590, bubble(0, 0, 560, 130, T8(12, 16, '이렇게 시간을 버려도 되나?', { size: 42 })), { rot: -2, bob: 4 });
  return h;
}
const _leisOld = leisureScene;
leisureScene = function (t, lt, a) {
  const D = D_(a);
  if (a.res) {
    let h = BG(NAVY) + BG('url(#grid)');
    h += pop(t, t - lt + 0.1, t + 99, 960, 240, big(0, 0, [[['쉼 = 시간 낭비', YEL], ['라고 믿을수록', '#fff']]], { size: 70 }), {});
    const R = [['쉴 때 즐거움', '↓', PINK], ['우울 · 스트레스', '↑', '#B9A7FF']];
    R.forEach(([nm, ar, c], i) => { const at = 0.35 * D + i * 0.25 * D; if (lt > at) h += pop(t, t - lt + at, t + 99, 960, 400 + i * 190, `<rect x="-520" y="-70" width="1040" height="140" rx="70" fill="#1B2A44" stroke="${MINT}" stroke-width="4"/>${T8(-460, 20, nm, { anchor: 'start', size: 58, fill: '#fff' })}<circle cx="400" cy="0" r="54" fill="${c}" stroke="${INK}" stroke-width="6"/>${T8(400, 26, ar, { size: 72, fill: NAVY })}`, { noPop: true, inDur: 0.3 }); });
    h += pop(t, t - lt + 0.3, t + 99, 960, 860, label(0, 0, 'Tonietto et al., JESP (2021)', { size: 32, bg: '#fff' }), {});
    return h;
  }
  let h = _leisOld(t, lt, a);
  if (a.cat && lt > 0.2 * D) h += pop(t, t - lt + 0.2 * D, t + 99, 1400, 210, label(0, 0, '쉼은 낭비라는 사람', { size: 36, bg: '#7CC7FF' }), {});
  return h;
};

/* ---------- day 2: gourd boat, Zero's reused things ---------- */
const _gourdOld = gourdScene;
gourdScene = function (t, lt, a) {
  const D = D_(a);
  if (!a.boat) return _gourdOld(t, lt, a);
  let h = inkBg(t, { ground: false, sx: 1600, sy: 210 });
  h += water(t, 700);
  const bob = Math.sin(t * 1.6) * 10, x = 960 + Math.sin(t * 0.4) * 60;
  h += `<g transform="translate(${f1(x)} ${f1(700 + bob)}) rotate(${f1(Math.sin(t * 1.2) * 3)})">`;
  h += gourdG(-150, -10, 0.75, 90) + gourdG(150, -10, 0.75, 90) + `<rect x="-300" y="-56" width="600" height="26" rx="10" fill="${WALNUT}" stroke="${INK}" stroke-width="6"/><path d="M-200 -40 L-200 10 M0 -40 L0 10 M200 -40 L200 10" stroke="#C9A04A" stroke-width="8"/>`;
  h += ZH({ t, seed: 941, x: 0, y: -50, s: 0.55, pose: '만세', ex: exprAt([[0, '신남']], t), look: [0.3, -0.3] }) + `</g>`;
  h += water(t + 3, 820, '#7DB7E0', '#5E9CCB').replace(/stroke="#141414" stroke-width="6"/, 'stroke="none"').replace(/fill="#7DB7E0"/, 'fill="#7DB7E0" opacity=".55"');
  if (lt > 0.3 * D) h += pop(t, t - lt + 0.3 * D, t + 99, 960, 160, big(0, 0, [[['큰 박 = ', '#fff'], ['커다란 배!', YEL]]], { size: 80, sw: 15 }), {});
  return h;
};
function mugG(x, y, s, crack, plant) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M60 -80 Q120 -80 120 -40 Q120 0 60 -4" fill="none" stroke="${INK}" stroke-width="16"/><path d="M60 -80 Q120 -80 120 -40 Q120 0 60 -4" fill="none" stroke="#7CC7FF" stroke-width="9"/><rect x="-70" y="-120" width="140" height="130" rx="16" fill="#7CC7FF" stroke="${INK}" stroke-width="7"/>`;
  if (crack) h += `<path d="M-20 -120 L-6 -90 L-24 -66 L-4 -40" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  if (plant > 0) {
    const k = easeOutBack(clamp(plant, 0, 1));
    h += `<rect x="-60" y="-124" width="120" height="16" rx="6" fill="#6A4529"/><g transform="translate(0 -120) scale(${f1(k * 100) / 100})"><path d="M0 0 Q-6 -60 0 -110" fill="none" stroke="#4E9A3E" stroke-width="8"/><ellipse cx="-34" cy="-60" rx="34" ry="16" transform="rotate(-30 -34 -60)" fill="#6DBE55" stroke="${INK}" stroke-width="5"/><ellipse cx="34" cy="-86" rx="34" ry="16" transform="rotate(30 34 -86)" fill="#6DBE55" stroke="${INK}" stroke-width="5"/><ellipse cx="-20" cy="-118" rx="26" ry="14" transform="rotate(-40 -20 -118)" fill="#6DBE55" stroke="${INK}" stroke-width="5"/></g>`;
  }
  return h + `</g>`;
}
function boxHouse(x, y, s, k) { // cardboard box -> cat house
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-120" y="-150" width="240" height="150" fill="#C9A06A" stroke="${INK}" stroke-width="7"/><line x1="-120" y1="-120" x2="120" y2="-120" stroke="#A9824E" stroke-width="5"/>`;
  if (k > 0) {
    h += `<path d="M-50 0 L-50 -60 Q0 -110 50 -60 L50 0 Z" fill="#3A2A1E" stroke="${INK}" stroke-width="6" opacity="${f1(Math.min(1, k * 2) * 100) / 100}"/>`;
    h += `<path d="M-140 -150 L0 ${f1(-150 - 90 * easeOut(k))} L140 -150 Z" fill="#D9805F" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  } else h += `<path d="M-120 -150 L-150 -190 M120 -150 L150 -190" stroke="${INK}" stroke-width="7"/><rect x="-60" y="-110" width="120" height="40" fill="#fff" opacity=".5"/>${T8(0, -80, '택배', { size: 30, fill: '#7A5A32' })}`;
  return h + `</g>`;
}
function reuseScene(t, lt, a) {
  const D = D_(a);
  let h = livingRoom(t, false);
  h += deskG(560, 760, 560);
  const pk = a.k ? 1 : prog(lt, 0.25 * D, 0.45 * D), bk = a.k ? 1 : prog(lt, 0.55 * D, 0.72 * D);
  h += mugG(560, 760, 1.1, true, pk);
  h += boxHouse(1130, 880, 1.2, bk);
  if (bk >= 1) { const ck = a.k ? 1 : easeOut(prog(lt, 0.75 * D, 0.9 * D)); h += catG(lerp(1500, 1140, ck), 880, 0.9, t); }
  if (pk > 0.6) h += pop(t, a.k ? -99 : t - lt + 0.45 * D, t + 99, 560, 420, label(0, 0, '금 간 머그컵 → 화분', { size: 38, bg: MINT }), {});
  if (bk > 0.6) h += pop(t, a.k ? -99 : t - lt + 0.72 * D, t + 99, 1130, 440, label(0, 0, '택배 상자 → 고양이 집', { size: 38, bg: YEL }), {});
  h += Z({ t, seed: 965, x: 1620, y: 940, s: 0.72, pose: a.k ? '만세' : '손인사', ex: exprAt([[0, '결심'], [0.45 * D, '신남']], lt), look: [-0.7, -0.2] });
  if (a.k && lt > 0.15 * D) h += pop(t, t - lt + 0.15 * D, t + 99, 740, 170, big(0, 0, [[['쓸모없음 = ', '#fff'], ['아직 못 찾은 쓸모', YEL]]], { size: 64 }), {});
  return h;
}

/* ---------- day 3: sitting still ---------- */
sitScene = function (t, lt, a) {
  const D = D_(a);
  let h = inkBg(t, { sx: 1500, sy: 230, sr: 70 });
  h += pine(1520, 900, 1.0);
  for (let i = 0; i < 6; i++) { const k = (t * 0.08 + i / 6) % 1; h += `<path d="M${f1(-200 + k * 2400)} ${300 + i * 60} q60 -20 120 0 t120 0" fill="none" stroke="#fff" stroke-width="6" opacity=".55" stroke-linecap="round"/>`; }
  h += `<ellipse cx="900" cy="860" rx="260" ry="40" fill="#8A8F86" stroke="${INK}" stroke-width="7"/>`;
  h += ZH({ t, seed: 960, x: 900, y: 860, s: 0.82, pose: '좌선', ex: exprAt([[0, '잠']], t), noBlink: true });
  h += pop(t, t - lt + 0.25 * D, t + 99, 900, 160, big(0, 0, [[['좌망', YEL], [' (坐忘)', '#fff']], '앉아서, 나조차 잊기'], { size: 64, sw: 13 }), {});
  return h;
};
function emptyRoom() { return BG('#F2F4F7') + `<path d="M-600 860 L2520 860 L2520 1480 L-600 1480 Z" fill="#DDE2EA"/><line x1="-600" y1="860" x2="2520" y2="860" stroke="${INK}" stroke-width="6"/><rect x="160" y="120" width="1600" height="740" fill="none" stroke="#C3CDD8" stroke-width="6"/>`; }
shockScene = function (t, lt, a) {
  const D = D_(a);
  let h = emptyRoom();
  if (!a.btn) {
    const secs = Math.round(900 - prog(lt, 0.4 * D, D) * 120);
    h += pop(t, t - lt + 0.1, t + 99, 1500, 300, `<g><rect x="-150" y="-60" width="300" height="120" rx="20" fill="#1F2D44" stroke="${INK}" stroke-width="7"/>${T8(0, 22, mmss(secs), { size: 64, fill: MINT })}</g>`, {});
    h += PT({ t, seed: 970, x: 760, y: 940, s: 0.8, ex: exprAt([[0, '기본'], [0.6 * D, '지침']], lt), look: [Math.sin(t * 0.7) * 0.8, -0.3] });
    if (lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 760, 360, label(0, 0, '혼자 · 15분 · 생각만', { size: 42, bg: YEL }), {});
    return h;
  }
  h += `<rect x="900" y="700" width="420" height="26" rx="6" fill="#9AA3AE" stroke="${INK}" stroke-width="6"/><rect x="920" y="726" width="18" height="134" fill="#9AA3AE" stroke="${INK}" stroke-width="5"/><rect x="1282" y="726" width="18" height="134" fill="#9AA3AE" stroke="${INK}" stroke-width="5"/>`;
  const press = lt > 0.62 * D, reach = easeInOut(prog(lt, 0.4 * D, 0.62 * D));
  h += bigButton(1000, 690, 0.8, press);
  const px = 790, py = 940, ps = 0.8;
  h += PT({ t, seed: 971, x: px, y: py, s: ps, pose: reach > 0.5 ? '내밀기' : '서기', ex: exprAt([[0, '기본'], [0.4 * D, '걱정'], [0.62 * D, '겁먹음']], lt), look: [0.8, 0.5], shiver: press });
  if (press) h += zap(1100, 560, 0.9, t) + zap(880, 520, 0.7, t + 1) + pop(t, t - lt + 0.62 * D, t + 99, 1240, 440, big(0, 0, ['따끔!'], { size: 64, fill: YEL }), { rot: 6 });
  h += pop(t, t - lt + 0.15 * D, t + 99, 1100, 230, label(0, 0, '누르면 전기 충격 버튼', { size: 40, bg: PINK, color: '#fff' }), {});
  return h;
};
const _statOld9 = statScene;
statScene = function (t, lt, a) {
  if (!a.big.includes('·')) return _statOld9(t, lt, a);
  let h = BG('url(#cream)') + BG('url(#paper)');
  const k = easeOut(prog(lt, 0.1, 1.2));
  [['67%', '남성', '#4FA3E0', 600, 0.1], ['25%', '여성', PINK, 1240, 0.7]].forEach(([v, who, c, x, at]) => {
    if (lt < at) return;
    const kk = easeOut(prog(lt, at, at + 1.0));
    h += pop(t, t - lt + at, t + 99, x, 380, `<text x="0" y="40" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="190" fill="${NAVY}">${esc(countUp(v, kk))}</text>` + `<g transform="translate(0 150)">${label(0, 0, who, { size: 48, bg: c, color: '#fff' })}</g>`, {});
  });
  h += `<rect x="${900 - 420}" y="610" width="840" height="10" rx="5" fill="${PINK}" transform="scale(${f1(k * 1000) / 1000} 1)" transform-origin="900 615"/>`;
  h += T8(920, 700, a.sub, { size: 48, w: 800 }) + T8(920, 780, a.src, { size: 34, w: 600, fill: '#5E5548' });
  h += Z({ t, seed: 10, x: 1700, y: 950, s: 0.5, ex: exprAt([[0, '놀람']], lt), light: 1 });
  return h;
};
function timerScene(t, lt, a) {
  const D = D_(a);
  let h = livingRoom(t, false);
  for (let i = 0; i < 3; i++) { const k = (t * 0.02 + i / 3) % 1; h += `<g transform="translate(${f1(1320 + k * 360)} ${200 + i * 70})" opacity=".95"><ellipse rx="54" ry="20" fill="#fff"/><ellipse cx="30" cy="-10" rx="34" ry="18" fill="#fff"/></g>`; }
  h += `<rect x="1300" y="130" width="380" height="300" rx="12" fill="none" stroke="${INK}" stroke-width="10"/><line x1="1490" y1="130" x2="1490" y2="430" stroke="${INK}" stroke-width="8"/><line x1="1300" y1="280" x2="1680" y2="280" stroke="${INK}" stroke-width="8"/>`;
  h += `<ellipse cx="900" cy="880" rx="200" ry="34" fill="#C77B4A" stroke="${INK}" stroke-width="7"/>`;
  const itch = lt > 0.28 * D && lt < 0.5 * D, calm = lt >= 0.5 * D;
  h += Z({ t, seed: 966, x: 900 + (itch ? Math.sin(t * 30) * 4 : 0), y: 870, s: 0.82, pose: '좌선', ex: exprAt([[0, '결심'], [0.25 * D, '걱정'], [0.55 * D, '기본'], [0.7 * D, '뿌듯']], lt), look: calm ? [0.9, -0.8] : [0, 0], shiver: itch });
  const secs = lt < 0.28 * D ? lerp(900, 720, prog(lt, 0, 0.28 * D)) : (lt < 0.52 * D ? lerp(720, 300, prog(lt, 0.28 * D, 0.52 * D)) : lerp(300, 200, prog(lt, 0.52 * D, D)));
  h += timerG(420, 300, mmss(secs), { k: secs / 900 });
  if (itch) h += pop(t, t - lt + 0.28 * D, t - lt + 0.5 * D, 600, 520, big(0, 0, ['근질근질…'], { size: 56, sw: 12, fill: YEL }), { rot: -5, wobble: 3 });
  if (calm && lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 1490, 520, label(0, 0, '구름이 보이기 시작했다', { size: 40, bg: MINT }), {});
  return h;
}
const _incOld = incubScene;
incubScene = function (t, lt, a) {
  const D = D_(a);
  if (!a.res) return _incOld(t, lt, a);
  let h = BG(NAVY) + BG('url(#grid)');
  h += pop(t, t - lt + 0.1, t + 99, 960, 240, big(0, 0, [[['같은 문제를 다시 풀 때, ', '#fff'], ['아이디어', YEL]]], { size: 64, sw: 12 }), {});
  const k = easeOut(prog(lt, 0.3 * D, 0.75 * D));
  h += vbar(560, 760, 230, 420, 0.12 * k, '#6B7A8C', '', '어려운 일', { bc: '#fff', bs: 40 });
  h += vbar(960, 760, 230, 420, 0.14 * k, '#6B7A8C', '', '그냥 쉬기', { bc: '#fff', bs: 40 });
  h += vbar(1360, 760, 230, 420, 0.82 * k, MINT, k > 0.9 ? '+41%' : '', '딴생각한 사람', { bc: YEL, bs: 40, tc: YEL, ts: 56 });
  h += pop(t, t - lt + 0.3, t + 99, 960, 900, label(0, 0, 'Baird et al., Psychological Science (2012)', { size: 30, bg: '#fff' }), {});
  return h;
};

/* ---------- day 4: Cook Ding holds the knife; Zero sleeps on it ---------- */
cookScene = function (t, lt, a) {
  const D = D_(a);
  let h = BG('#F1E6D0') + BG('url(#paper)') + ground(880, '#D9C4A0');
  if (a.k === 2) {
    const K = [['보통 요리사', '달마다 새 칼', { chip: true, dull: true }, '뼈를 내리쳐서', RED], ['포정', '19년째 새것처럼', { shine: true, t }, '결과 틈을 따라', '#1F9D6B']];
    K.forEach(([who, how, o, why, c], i) => {
      const at = i ? 0.45 * D : 0.05 * D; if (lt < at) return;
      const x = 560 + i * 800;
      const chop = !i ? Math.max(0, Math.sin(t * 6)) : 0;
      h += pop(t, t - lt + at, t + 99, x, 470, `${panel(-330, -300, 660, 600, { fill: i ? '#FFF7D6' : '#fff' })}${T8(0, -220, who, { size: 52 })}<g transform="rotate(${f1(-chop * 25)} -60 -20)">${knifeG(-110, -40, 1.0, 0, o)}</g>${!i && chop > 0.9 ? burst(30, YEL, 8).replace('<path', '<path transform="translate(140 30)"') : ''}${T8(0, 130, how, { size: 50, fill: c })}${T8(0, 210, why, { size: 40, fill: '#6B6255' })}`, {});
    });
    if (lt > 0.75 * D) h += pop(t, t - lt + 0.75 * D, t + 99, 960, 900, label(0, 0, '억지로 힘주지 않기', { size: 42, bg: YEL }), { rot: -3 });
    return h;
  }
  const k = prog(lt, 0.1 * D, 0.95 * D);
  h += oxG(1280, 700, 1.0, k, t);
  const sway = Math.sin(t * 3) * 0.5;
  const cx = 640 + Math.sin(t * 1.5) * 30, cy = 940, cs = 0.82;
  h += COOK({ t, seed: 990, x: cx, y: cy, s: cs, pose: mixPose('내밀기', '손인사', (sway + 0.5) * 0.5), ex: exprAt([[0, '뿌듯']], t), look: [0.8, -0.2], tilt: sway * 6 });
  const pp = mixPose('내밀기', '손인사', (sway + 0.5) * 0.5), [kx, ky] = handG(cx, cy, cs, pp.hR);
  h += knifeG(kx + 6, ky, 0.5, -20 + sway * 30, { t, shine: true }) + hand(kx, ky, cs);
  for (let i = 0; i < 3; i++) { const q = ((t * 0.5 + i / 3) % 1); h += `<text x="${f1(520 + q * 140)}" y="${f1(420 - q * 160)}" font-family="${FONT}" font-weight="900" font-size="52" fill="#fff" stroke="${INK}" stroke-width="5" paint-order="stroke" opacity="${f1(Math.sin(q * Math.PI) * 100) / 100}">♪</text>`; }
  h += pop(t, t - lt + 0.2, t + 99, 640, 170, label(0, 0, '요리사 포정', { size: 44, bg: YEL }), {});
  if (lt > 0.5 * D) h += pop(t, t - lt + 0.5 * D, t + 99, 1280, 300, label(0, 0, '결을 따라 춤추듯', { size: 40, bg: MINT }), {});
  return h;
};
function sleepScene(t, lt, a) {
  const D = D_(a), A = 0.32 * D, B = 0.6 * D;
  const fA = 1 - prog(lt, A - 0.15, A + 0.15), fC = prog(lt, B - 0.15, B + 0.15);
  let h = '';
  if (fA > 0) {
    let g = livingRoom(t, true) + `<rect x="-600" y="-600" width="3120" height="2280" fill="#000" opacity=".2"/>`;
    g += `<circle cx="980" cy="640" r="320" fill="url(#screenGlow)"/>`;
    g += Z({ t, seed: 967, x: 760, y: 950, s: 0.8, pose: lt > 0.22 * D ? '서기' : '책상', ex: exprAt([[0, '지침'], [0.22 * D, '결심']], lt), look: [0.3, 0.6], sweat: lt < 0.22 * D });
    g += deskG(860, 760, 720);
    const cl = easeInOut(prog(lt, 0.22 * D, 0.3 * D));
    g += `<g transform="translate(1030 760)"><rect x="-130" y="-8" width="260" height="14" rx="4" fill="#3A4A66" stroke="${INK}" stroke-width="5"/><g transform="translate(0 -6) scale(1 ${f1((1 - 0.92 * cl) * 100) / 100}) translate(0 6)"><rect x="-130" y="-170" width="260" height="164" rx="10" fill="#3A4A66" stroke="${INK}" stroke-width="6"/>${cl < 0.5 ? `<rect x="-114" y="-156" width="228" height="136" rx="6" fill="#E6F7FF"/>${T8(0, -76, '???', { size: 48, fill: RED })}` : ''}</g></g>`;
    g += pop(t, t - lt + 0.03 * D, t + 99, 330, 260, `<g>${wallClock(0, 0, 70, 1, 40)}</g>`, {});
    if (lt < 0.22 * D) g += qmarks(t, 51, 5, [560, 380, 400, 140], { size: 50 });
    h += `<g opacity="${f1(fA * 100) / 100}">${g}</g>`;
  }
  if (lt > A - 0.15 && lt < B + 0.15) {
    let g = bedroom(t, { clock: '02:00' }) + `<ellipse cx="1180" cy="770" rx="150" ry="46" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
    g += Z({ t, seed: 968, x: 930, y: 775, s: 0.62, rot: 90, ex: { expr: '잠', prev: '잠', k: 1, blink: 0 }, noBlink: true, light: 1, shade: '#C9D9F0' });
    g += `<path d="M394 760 Q640 730 900 752 Q1000 760 1060 740 L1080 900 L390 902 Z" fill="#5C7AD6" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>`;
    g += zz(1260, 620, t, '#fff');
    const op = Math.min(prog(lt, A - 0.15, A + 0.15), 1 - prog(lt, B - 0.15, B + 0.15));
    h += `<g opacity="${f1(op * 100) / 100}">${g}</g>`;
  }
  if (fC > 0) {
    let g = livingRoom(t, false);
    g += `<circle cx="1490" cy="280" r="300" fill="url(#warm)" opacity=".6"/>`;
    g += Z({ t, seed: 969, x: 760, y: 950, s: 0.8, pose: '책상', ex: exprAt([[0, '신남']], t), look: [0.3, 0.6] });
    g += deskG(860, 760, 720) + `<g transform="translate(1030 760)"><rect x="-130" y="-8" width="260" height="14" rx="4" fill="#3A4A66" stroke="${INK}" stroke-width="5"/><rect x="-130" y="-170" width="260" height="164" rx="10" fill="#3A4A66" stroke="${INK}" stroke-width="6"/><rect x="-114" y="-156" width="228" height="136" rx="6" fill="#E6F7FF"/>${[0, 1, 2].map(i => `<rect x="-90" y="${-136 + i * 36}" width="${[150, 120, 170][i]}" height="14" rx="7" fill="#9CB3C8"/>`).join('')}</g>`;
    for (let i = 0; i < 3; i++) { const k2 = (t * 0.7 + i / 3) % 1; g += `<g opacity="${f1(Math.sin(k2 * Math.PI) * 100) / 100}">${check(1000 + i * 120, 560 - k2 * 160, 0.8)}</g>`; }
    g += pop(t, t - lt + B + 0.3, t + 99, 1200, 300, big(0, 0, ['술술!'], { size: 72, fill: YEL }), { rot: -4 });
    h += `<g opacity="${f1(fC * 100) / 100}">${g}</g>`;
  }
  return h;
}
hoursScene = function (t, lt, a) {
  const D = D_(a);
  let h = BG(NAVY) + BG('url(#grid)');
  h += pop(t, t - lt + 0.1, t + 99, 960, 230, big(0, 0, [[['1차 세계대전 · ', '#fff'], ['영국 공장 기록', YEL]]], { size: 58, sw: 12 }), {});
  const k = easeOut(prog(lt, 0.15 * D, 0.45 * D)), k2 = easeOut(prog(lt, 0.4 * D, 0.65 * D));
  const col = (x, hrs, outK, c) => `${T8(x, 350, '주 ' + hrs + '시간 일하면', { size: 46, fill: '#fff' })}<rect x="${x - 220}" y="385" width="${f1(440 * hrs / 70 * k)}" height="40" rx="20" fill="#6B7A8C" stroke="${INK}" stroke-width="5"/>${vbar(x, 800, 200, 360, outK, c, outK > 0.6 ? '생산량' : '', '', { tc: '#fff', ts: 38 })}`;
  h += col(620, 56, 0.86 * k2, MINT) + col(1300, 70, 0.88 * k2, PINK);
  if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 960, 560, big(0, 0, ['≈'], { size: 160, sw: 20, fill: YEL }), {});
  if (lt > 0.72 * D) h += pop(t, t - lt + 0.72 * D, t + 99, 960, 880, label(0, 0, '더 오래 ≠ 더 많이', { size: 46, bg: YEL }), {});
  return h;
};

/* ---------- day 5: the turtle — speech balloons point at the speakers ---------- */
const _turtOld = turtleScene;
turtleScene = function (t, lt, a) {
  const D = D_(a);
  if (a.k === 2) return _turtOld(t, lt, a);
  let h = inkBg(t, { ground: false, sx: 1640, sy: 200 });
  h += water(t, 760, '#9CC9DE', '#7DB0CC');
  h += `<path d="M-600 760 L820 760 Q880 800 820 880 L-600 900 Z" fill="#A9B98F" stroke="${INK}" stroke-width="6"/>`;
  const zx = 660, zy = 840, zs = 0.72;
  h += ZH({ t, seed: 1000, x: zx, y: zy, s: zs, pose: '낚시', ex: exprAt([[0, a.k === 3 ? '뿌듯' : '기본']], t), look: [a.k ? -0.6 : 0.6, 0] });
  const [rx, ry] = handG(zx, zy, zs, P['낚시'].hR);
  h += `<path d="M${f1(rx)} ${f1(ry)} Q${f1(rx + 260)} ${f1(ry - 300)} ${f1(rx + 480)} ${f1(ry - 260)}" fill="none" stroke="${WALNUT}" stroke-width="10" stroke-linecap="round"/><path d="M${f1(rx + 480)} ${f1(ry - 260)} L${f1(rx + 500)} ${f1(800 + Math.sin(t * 2) * 6)}" stroke="${INK}" stroke-width="2"/><circle cx="${f1(rx + 500)}" cy="${f1(800 + Math.sin(t * 2) * 6)}" r="9" fill="${RED}" stroke="${INK}" stroke-width="3"/>`;
  const zHead = [zx, zy - 400 * zs];
  if (!a.k) {
    const arrive = easeOut(prog(lt, 0.15 * D, 0.5 * D));
    for (let i = 0; i < 2; i++) h += OF({ t, seed: 1001 + i, x: lerp(-200, 360, arrive) - i * 170, y: 880, s: 0.6, pose: arrive < 1 ? walkPose(t * 7 + i, 0.6) : '손인사', ex: exprAt([[0, '결심']], t), look: [0.8, -0.1] });
    if (arrive >= 1) h += pop(t, t - lt + 0.55 * D, t + 99, 0, 0, speech(430, 330, 600, 120, '나랏일을 맡아 주십시오!', 360, 560), { noPop: true, inDur: 0.3 });
    h += pop(t, t - lt + 0.1, t + 99, 1380, 170, label(0, 0, '초나라 왕의 신하들', { size: 40, bg: '#D9826B', color: '#fff' }), {});
    return h;
  }
  for (let i = 0; i < 2; i++) h += OF({ t, seed: 1001 + i, x: 360 - i * 170, y: 880, s: 0.6, pose: '서기', ex: exprAt([[0, a.k === 3 ? '놀람' : '결심']], t), look: [0.8, -0.1] });
  if (a.k === 1) {
    h += pop(t, t - lt + 0.3 * D, t + 99, 0, 0, `<g>${speech(700, 200, 640, 140, ['죽은 지 3천 년 된', '거북을 비단에 싸서 모신다지요?'], zHead[0] + 10, zHead[1] - 20, { size: 38 })}</g>`, { noPop: true, inDur: 0.3 });
    if (lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 1500, 560, shrineBox(0, 0, 0.55, t), {});
    return h;
  }
  h += mudPond(1450, 870, 260) + turtleG(1450, 840, 0.8, t, true);
  if (lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 0, 0, speech(720, 200, 720, 150, ['그럼 돌아가시오.', '나도 진흙 속에서 꼬리를 끌겠소'], zHead[0] + 10, zHead[1] - 20, { size: 40 }), { noPop: true, inDur: 0.3 });
  return h;
};
function uselessScene(t, lt, a) {
  const D = D_(a);
  let h = livingRoom(t, false);
  h += `<rect x="208" y="168" width="1100" height="640" rx="20" fill="${INK}" opacity=".2"/><rect x="200" y="160" width="1100" height="640" rx="20" fill="#FFFDF5" stroke="${INK}" stroke-width="8"/><line x1="750" y1="180" x2="750" y2="780" stroke="#C9B89A" stroke-width="6"/>`;
  for (let i = 0; i < 6; i++) h += `<line x1="230" y1="${330 + i * 80}" x2="1270" y2="${330 + i * 80}" stroke="#DDE6EE" stroke-width="3"/>`;
  h += T8(475, 260, '할 일', { size: 50 }) + T8(1025, 260, '쓸모없는 일', { size: 50, fill: '#1F9D6B' });
  ['빨래', '장보기', '메일 답장'].forEach((s, i) => h += T8(300, 360 + i * 110, '□ ' + s, { anchor: 'start', size: 42, w: 700 }));
  const icon = i => i === 0 ? `<g transform="translate(-40 -14)"><ellipse rx="30" ry="14" fill="#BFE3FF" stroke="${INK}" stroke-width="4"/><ellipse cx="18" cy="-8" rx="18" ry="12" fill="#BFE3FF" stroke="${INK}" stroke-width="4"/></g>` : (i === 1 ? `<path d="M-64 -10 q14 -26 28 0 t28 0" fill="none" stroke="${PINK}" stroke-width="6" stroke-linecap="round"/>` : `<g transform="translate(-44 -14)"><ellipse cx="-8" cy="0" rx="9" ry="14" fill="${INK}"/><ellipse cx="12" cy="-12" rx="9" ry="14" fill="${INK}"/></g>`);
  ['구름 구경', '낙서', '목적지 없는 산책'].forEach((s, i) => { const at = 0.3 * D + i * 0.18 * D; if (lt > at) h += pop(t, t - lt + at, t + 99, 860, 360 + i * 110, `${icon(i)}${T8(0, 14, s, { anchor: 'start', size: 44, fill: '#1F9D6B' })}`, { noPop: true, inDur: 0.3 }); });
  h += Z({ t, seed: 1013, x: 1560, y: 940, s: 0.74, pose: lt > 0.85 * D ? '만세' : '손인사', ex: exprAt([[0, '결심'], [0.3 * D, '신남']], lt), look: [-0.7, -0.2] });
  return h;
}

/* ---------- recap ---------- */
recapScene = function (t, lt, a) {
  let h = BG(NAVY) + BG('url(#grid)');
  h += big(960, 120, ['만약에, 장자처럼 쓸모없음을 즐긴다면?'], { size: 56, sw: 12, fill: YEL });
  LIST9B.forEach((it, i) => {
    if (i >= a.k) return;
    const appear = a.k === 3 ? 0.2 + i * 1.3 : (a.k === 5 && i >= 3 ? 0.2 + (i - 3) * 1.8 : -1);
    const k = a.k === 5 && i < 3 ? 1 : easeOutBack(clamp((lt - appear) / 0.4, 0, 1));
    const y = 260 + i * 118;
    h += `<g transform="translate(${f1(lerp(-300, 0, clamp(k, 0, 1.2)))} 0)" opacity="${f1(clamp(k, 0, 1) * 100) / 100}">${label(400, y, (i + 1) + '일 차', { size: 40, bg: i === 4 ? YEL : MINT })}<text x="520" y="${y + 18}" font-family="${FONT}" font-weight="900" font-size="56" fill="#fff">${esc(it)}</text></g>`;
  });
  h += Z({ t, seed: 15, x: 1660, y: 920, s: 0.55, pose: a.k ? '손인사' : '서기', ex: exprAt([[0, '신남']], t), look: [-0.6, -0.2] });
  return h;
};

/* ---------- Zhuangzi & Huizi: the fish bridge, the grave, the carpenter ---------- */
function bridgeBg(t, o = {}) {
  let h = o.sky ? BG(o.sky) + BG('url(#paper)') : inkBg(t, { ground: false, sx: 1640, sy: 190 });
  h += water(t, 740, o.w1 || '#9CC9DE', o.w2 || '#7DB0CC');
  h += `<path d="M200 760 Q960 420 1720 760" fill="none" stroke="${INK}" stroke-width="40" stroke-linecap="round"/><path d="M200 760 Q960 420 1720 760" fill="none" stroke="${o.bc || '#B98A5A'}" stroke-width="28" stroke-linecap="round"/>`;
  h += `<path d="M260 700 Q960 380 1660 700" fill="none" stroke="${INK}" stroke-width="5" opacity=".6"/>`;
  for (let i = 0; i <= 10; i++) { const u = 0.1 + i * 0.08, x = lerp(200, 1720, u), y = 760 * (1 - u) ** 2 + 2 * (1 - u) * u * 420 + u * u * 760; h += `<line x1="${f1(x)}" y1="${f1(y - 14)}" x2="${f1(x)}" y2="${f1(y - 70)}" stroke="${INK}" stroke-width="6"/>`; }
  return h;
}
const deckY = x => { const u = (x - 200) / 1520; return 760 * (1 - u) ** 2 + 2 * (1 - u) * u * 420 + u * u * 760 - 14; };
function fishSwim(t, n, y0) { let h = ''; for (let i = 0; i < n; i++) { const x = ((i * 380 + t * 70 * (i % 2 ? 1 : -1)) % 2200 + 2200) % 2200 - 140, y = y0 + (i % 3) * 50 + Math.sin(t * 2 + i) * 8; h += fishG(x, y, 0.7, i % 2 ? 0 : 180, ['#F2A33A', '#FF8FB1', '#FFD25A'][i % 3]); } return h; }
function bridgeScene(t, lt, a) {
  const D = D_(a);
  let h = bridgeBg(t);
  h += fishSwim(t, 7, 830);
  const jk = (lt * 0.5) % 1; if (a.k === 2 && lt > 0.6 * D) h += fishG(1300 + jk * 160, 800 - Math.sin(jk * Math.PI) * 150, 0.9, -40 + jk * 80);
  const zx = 820, hx = 1120, s = 0.6, zy = deckY(zx), hy = deckY(hx);
  h += ZH({ t, seed: 1100, x: zx, y: zy, s, pose: !a.k ? '가리키기' : (a.k === 2 && lt > 0.7 * D ? '만세' : '서기'), ex: exprAt([[0, a.k === 2 ? '신남' : '뿌듯']], t), look: !a.k ? [0.5, 0.9] : [0.8, -0.2] });
  h += HZ({ t, seed: 1101, x: hx, y: hy, s, pose: a.k === 1 ? '가리키기' : '서기', ex: exprAt([[0, a.k === 1 ? '결심' : '기본'], [a.k === 2 ? 0.7 * D : 99, '신남']], lt), look: [-0.8, -0.2] });
  const zh = [zx, zy - 420 * s], hh = [hx, hy - 420 * s];
  if (!a.k && lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 0, 0, speech(560, 150, 600, 120, '물고기들이 참 즐거워 보이네', zh[0] - 30, zh[1] - 10), { noPop: true, inDur: 0.3 });
  if (a.k === 1 && lt > 0.15 * D) h += pop(t, t - lt + 0.15 * D, t + 99, 0, 0, speech(1360, 150, 700, 150, ['자네가 물고기도 아닌데,', '즐거운지 어떻게 아나?'], hh[0] + 30, hh[1] - 10), { noPop: true, inDur: 0.3 });
  if (a.k === 2 && lt > 0.15 * D) h += pop(t, t - lt + 0.15 * D, t + 99, 0, 0, speech(560, 150, 720, 150, ['자네는 내가 아닌데,', '내가 모른다는 건 어떻게 아나?'], zh[0] - 30, zh[1] - 10), { noPop: true, inDur: 0.3 });
  if (!a.k) h += pop(t, t - lt + 0.1, t + 99, 1500, 330, label(0, 0, '다리 위에서', { size: 38, bg: '#fff' }), {});
  return h;
}
function moundG(x, y, s, t) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-220 0 Q-200 -170 0 -180 Q200 -170 220 0 Z" fill="#8A7A56" stroke="${INK}" stroke-width="8"/>${[...Array(9)].map((_, i) => `<path d="M${-180 + i * 45} ${-60 - Math.sin(i) * 40} q6 -24 14 -30" fill="none" stroke="#6E8E3A" stroke-width="5" stroke-linecap="round"/>`).join('')}<rect x="-50" y="-250" width="100" height="250" rx="10" fill="#B8B4A8" stroke="${INK}" stroke-width="7"/>${T8(0, -170, '惠', { size: 54 })}${T8(0, -100, '子', { size: 54 })}</g>`; }
function graveScene(t, lt, a) {
  const D = D_(a);
  if (a.k === 3) { // warm memory of the bridge
    let h = bridgeBg(t, { sky: 'url(#sepia)', w1: '#C9B48E', w2: '#B8A27A', bc: '#A88A5E' });
    const zx = 820, hx = 1120, s = 0.6;
    h += ZH({ t, seed: 1100, x: zx, y: deckY(zx), s, pose: '만세', ex: exprAt([[0, '신남']], t), look: [0.8, -0.2] }) + HZ({ t, seed: 1101, x: hx, y: deckY(hx), s, pose: '만세', ex: exprAt([[0, '신남']], t), look: [-0.8, -0.2] });
    h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#C9A06A" opacity=".18"/>`;
    if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 960, 170, big(0, 0, [[['쓸모없던 말다툼 = ', '#fff'], ['가장 소중한 시간', YEL]]], { size: 66 }), {});
    return h;
  }
  if (!a.k) { // years of arguing; then one of them is gone
    let h = bridgeBg(t, { sky: 'url(#autumn)', w1: '#8FA6B8', w2: '#6E8AA0' });
    h += leaves(t, 21, 16, [0, -40, 1920, 940]);
    const zx = 820, hx = 1120, s = 0.6, gone = prog(lt, 0.55 * D, 0.8 * D);
    h += ZH({ t, seed: 1100, x: zx, y: deckY(zx), s, ex: exprAt([[0, '신남'], [0.6 * D, '기본'], [0.8 * D, '지침']], lt), look: [0.8, -0.2] });
    if (gone < 1) h += `<g opacity="${f1((1 - gone) * 100) / 100}">${HZ({ t, seed: 1101, x: hx, y: deckY(hx), s, pose: lt < 0.5 * D && Math.sin(t * 3) > 0 ? '가리키기' : '서기', ex: exprAt([[0, '화남']], t), look: [-0.8, -0.2] })}</g>`;
    if (lt < 0.5 * D) h += pop(t, t - lt + 0.05, t - lt + 0.5 * D, 960, 200, big(0, 0, ['티격태격…'], { size: 56, sw: 12, fill: '#fff' }), { wobble: 2 });
    return h;
  }
  let h = BG('url(#autumn)') + BG('url(#paper)') + ground(880, '#9A8A66');
  h += leaves(t, 31, 12, [0, -40, 1920, 940]);
  h += moundG(1250, 880, 1.0, t);
  if (a.k === 1) {
    const walk = prog(lt, 0, 0.6 * D), zx = lerp(300, 820, easeOut(walk));
    h += ZH({ t, seed: 1102, x: zx, y: 940, s: 0.8, pose: walk < 1 ? mixPose(walkPose(t * 4, 0.35), '지팡이', 0.5) : '지팡이', ex: exprAt([[0, '기본'], [0.6 * D, '지침']], lt), look: [0.8, -0.2] });
    const [sx, sy] = handG(zx, 940, 0.8, P['지팡이'].hR);
    h += `<line x1="${f1(sx)}" y1="${f1(sy - 20)}" x2="${f1(sx + 20)}" y2="940" stroke="${WALNUT}" stroke-width="12" stroke-linecap="round"/>` + hand(sx, sy, 0.8);
    if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 1250, 520, label(0, 0, '혜자의 무덤', { size: 40, bg: '#fff' }), {});
    return h;
  }
  // k2: "since Huizi died, I have no one to talk with"
  h += ZH({ t, seed: 1103, x: 800, y: 940, s: 0.8, pose: '지팡이', ex: exprAt([[0, '지침']], t), look: [0.8, 0.4], tilt: -6 });
  const [sx, sy] = handG(800, 940, 0.8, P['지팡이'].hR);
  h += `<line x1="${f1(sx)}" y1="${f1(sy - 20)}" x2="${f1(sx + 20)}" y2="940" stroke="${WALNUT}" stroke-width="12" stroke-linecap="round"/>` + hand(sx, sy, 0.8);
  for (let i = 0; i < 26; i++) { const k = ((t * 0.5 + hash(i * 2.1)) % 1); const x = hash(i * 3.7) * 1920, y = -40 + k * 1000; h += `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x - 6)}" y2="${f1(y + 26)}" stroke="#DDE6F2" stroke-width="3" opacity=".7"/>`; }
  if (lt > 0.25 * D) h += pop(t, t - lt + 0.25 * D, t + 99, 960, 200, big(0, 0, ['혜자가 죽은 뒤로,', [['더불어 이야기할 사람', YEL], ['을 잃었다', '#fff']]], { size: 62, sw: 13 }), {});
  return h;
}
function leaves(t, seed, n, box) { let h = ''; for (let i = 0; i < n; i++) { const k = ((t * 0.09 + hash(seed + i * 1.9)) % 1), x = box[0] + hash(seed + i * 2.7) * box[2] + Math.sin(t * 1.4 + i) * 40, y = box[1] + k * box[3]; h += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(t * 60 + i * 47)})" opacity="${f1(Math.sin(k * Math.PI) * 90) / 100}"><path d="M0 -18 Q16 -4 0 18 Q-16 -4 0 -18 Z" fill="${['#D9822B', '#C9562E', '#E0A841'][i % 3]}" stroke="${INK}" stroke-width="3"/></g>`; } return h; }
function axeScene(t, lt, a) {
  const D = D_(a);
  let h = BG('#2E2A36') + BG('url(#dots)');
  h += `<rect x="150" y="90" width="1620" height="820" rx="16" fill="#F3E6CC" stroke="${INK}" stroke-width="10"/><rect x="150" y="90" width="1620" height="40" fill="#8A2E26" stroke="${INK}" stroke-width="8"/><rect x="150" y="870" width="1620" height="40" fill="#8A2E26" stroke="${INK}" stroke-width="8"/>`;
  h += `<path d="M180 840 Q700 800 1740 830 L1740 870 L180 870 Z" fill="#D8C49E"/>`;
  const MY = o => HALO(char(Object.assign({ goggles: 'none', vest: '#A9B4C2', patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', topknot: '#3A2A1E', robe: '#6E7A8C' }, o)));
  const CP = o => HALO(char(Object.assign({ goggles: 'none', vest: '#B88A5A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', topknot: '#3A2A1E', robe: '#6A4529', beard: '#3A2A1E' }, o)));
  const mx = 1180, my = 860, ms = 0.78, cx = 640, cs = 0.82;
  if (!a.k) {
    const flyK = prog(lt, 0.78 * D, 0.95 * D), swing = prog(lt, 0.55 * D, 0.78 * D);
    h += MY({ t, seed: 1110, x: mx, y: my, s: ms, ex: exprAt([[0, '기본'], [0.82 * D, '신남']], lt), look: [-0.8, 0], still: true, noBlink: lt > 0.5 * D && lt < 0.8 * D });
    const nx = mx - 4 * ms, ny = my - 330 * ms;
    if (flyK < 1) h += `<ellipse cx="${f1(nx + flyK * 60)}" cy="${f1(ny - Math.sin(flyK * Math.PI) * 60 + flyK * 80)}" rx="16" ry="10" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
    const ang = lt < 0.55 * D ? -155 + Math.sin(t * 2) * 6 : lerp(-160, -70, easeInOut(swing));
    h += CP({ t, seed: 1111, x: cx, y: my, s: cs, pose: '내밀기', ex: exprAt([[0, '결심']], t), look: [0.8, -0.2] });
    const [ax, ay] = handG(cx, my, cs, P['내밀기'].hR);
    h += `<g transform="translate(${f1(ax)} ${f1(ay)}) rotate(${f1(ang)})"><rect x="-8" y="-20" width="16" height="220" rx="6" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/><path d="M-6 150 L-86 132 Q-122 190 -86 252 L-6 232 Z" fill="#9AA3AE" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-86 132 Q-122 190 -86 252" fill="none" stroke="#E6ECF2" stroke-width="6"/></g>` + hand(ax, ay, cs);
    if (swing > 0 && swing < 1) for (let i = 0; i < 4; i++) h += `<path d="M${f1(ax + 60 + i * 50)} ${f1(ay - 80 + i * 40)} q80 40 160 0" fill="none" stroke="#7A8A9C" stroke-width="6" stroke-linecap="round" opacity="${f1((1 - swing) * 100) / 100}"/>`;
    if (swing > 0.2) h += pop(t, t - lt + 0.6 * D, t + 99, 900, 300, big(0, 0, ['휘익—'], { size: 64, sw: 12, fill: '#fff' }), { rot: -6 });
    if (lt > 0.12 * D) h += pop(t, t - lt + 0.12 * D, t + 99, 1500, 380, label(0, 0, '코끝에 파리 날개만큼 얇은 흙', { size: 34, bg: '#fff' }), { rot: 2 }) + `<line x1="1380" y1="400" x2="${f1(nx + 18)}" y2="${f1(ny)}" stroke="${INK}" stroke-width="4" stroke-dasharray="8 6" opacity="${flyK < 1 ? 0.8 : 0}"/>`;
    if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 520, 200, label(0, 0, '도끼질의 달인, 목수', { size: 36, bg: YEL }), {});
    if (flyK >= 1) h += pop(t, t - lt + 0.95 * D, t + 99, 1180, 230, label(0, 0, '코는 멀쩡!', { size: 40, bg: MINT }), {});
    return h;
  }
  h += `<rect x="150" y="90" width="1620" height="820" fill="#2E2A36" opacity=".25"/>`;
  h += `<g opacity=".55"><path d="M${mx - 70} ${my} L${mx - 70} ${my - 230} Q${mx} ${my - 300} ${mx + 70} ${my - 230} L${mx + 70} ${my} Z" fill="none" stroke="${INK}" stroke-width="5" stroke-dasharray="14 10"/><circle cx="${mx}" cy="${my - 380}" r="90" fill="none" stroke="${INK}" stroke-width="5" stroke-dasharray="14 10"/></g>`;
  h += CP({ t, seed: 1111, x: cx, y: my, s: cs, pose: '서기', ex: exprAt([[0, '지침']], t), look: [0.8, 0.4], tilt: -5 });
  const [ax, ay] = handG(cx, my, cs, P['서기'].hR);
  h += `<g transform="translate(${f1(ax)} ${f1(ay)}) rotate(205)"><rect x="-8" y="-20" width="16" height="220" rx="6" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/><path d="M-6 150 L-86 132 Q-122 190 -86 252 L-6 232 Z" fill="#9AA3AE" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-86 132 Q-122 190 -86 252" fill="none" stroke="#E6ECF2" stroke-width="6"/></g>` + hand(ax, ay, cs);
  if (lt > 0.4 * D) h += pop(t, t - lt + 0.4 * D, t + 99, 1180, 300, label(0, 0, '짝이 없으면, 솜씨도 없다', { size: 40, bg: '#fff' }), {});
  return h;
}

/* ---------- ending: the dream comes from Zhuangzi's head; the butterfly is Zhuangzi ---------- */
butterflyScene = function (t, lt, a) {
  const D = D_(a);
  if (a.k) {
    let h = BG('url(#morning)') + clouds(t, 90, 20, 3, 8) + ground(860, '#A8D27E') + flowers(t, 900, 16);
    const bx = 960 + Math.sin(t * 0.7) * 420, by = 450 + Math.sin(t * 1.3) * 110;
    h += butterfly(bx, by, 1.8, t);
    h += `<g transform="translate(${f1(bx)} ${f1(by - 40)})"><ellipse cx="0" cy="-44" rx="12" ry="10" fill="#D9D9D9" stroke="${INK}" stroke-width="4"/><path d="M-10 26 Q0 60 10 26" fill="#F4F4F4" stroke="${INK}" stroke-width="3"/></g>`;
    h += butterfly(bx - 360 + Math.sin(t * 1.1) * 80, by + 160, 0.6, t + 1, '#7CC7FF');
    if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 960, 170, big(0, 0, [[['나비였던 순간, ', '#fff'], ['그저 즐거웠다', YEL]]], { size: 70 }), {});
    return h;
  }
  let h = BG('url(#dream9)');
  for (let i = 0; i < 40; i++) h += `<circle cx="${f1(hash(i) * 1920)}" cy="${f1(hash(i * 2) * 600)}" r="${f1(2 + hash(i * 3) * 3)}" fill="#fff" opacity="${f1((0.4 + 0.5 * Math.sin(t * 2 + i)) * 100) / 100}"/>`;
  h += `<circle cx="1640" cy="170" r="70" fill="#FFF3B0"/>` + ground(860, '#4A5A78');
  h += gnarled2(1600, 870, 0.6, t);
  const zx = 640, zy = 860, zs = 0.6, [hx, hy] = lyingHead(zx, zy, zs);
  h += ZH({ t, seed: 1041, x: zx, y: zy, s: zs, rot: -88, ex: { expr: '잠', prev: '잠', k: 1, blink: 0 }, noBlink: true });
  h += pop(t, t - lt + 0.1 * D, t + 99, hx + 170, hy - 330, bubble(0, 0, 320, 220, butterfly(0, 0, 0.9, t)), { bob: 4 });
  if (lt > 0.55 * D) {
    const fx = 1220, fy = 560;
    h += pop(t, t - lt + 0.55 * D, t + 99, fx, fy, butterfly(0, 0, 1.0, t) + `<g transform="translate(140 -200)">${bubble(0, 0, 300, 200, `<g transform="translate(0 70)">${ZH({ t, seed: 1042, x: 0, y: 0, s: 0.3, ex: exprAt([[0, '잠']], t), noBlink: true })}</g>`)}</g>`, { bob: 4 });
    h += pop(t, t - lt + 0.7 * D, t + 99, 960, 200, big(0, 0, ['내가 나비 꿈을?', [['나비가 내 꿈을?', YEL]]], { size: 62, sw: 13 }), {});
  }
  return h;
};
meadowScene = function (t, lt, a) {
  const D = D_(a);
  let h = BG('url(#dusk9)') + `<circle cx="1500" cy="420" r="90" fill="#FFD27A"/><circle cx="1500" cy="420" r="260" fill="url(#warm)"/>` + clouds(t, 380, 18, 2, 11);
  h += `<path d="M-600 840 Q500 780 960 820 Q1500 860 2520 800 L2520 1480 L-600 1480 Z" fill="#9CB86A" stroke="${INK}" stroke-width="7"/>` + grassField(t, 870);
  h += Z({ t, seed: 1050, x: 900, y: 850, s: 0.66, rot: -88, ex: exprAt([[0, '신남']], t), look: [0.2, -0.9] });
  h += PT({ t, seed: 1051, x: 1300, y: 860, s: 0.66, rot: -88, ex: exprAt([[0, a.ask ? '신남' : '뿌듯']], t), look: [-0.6, -0.9] });
  if (!a.ask && Math.sin(t * 1.3) > -0.2) h += T8(1000 + Math.sin(t) * 20, 560, 'ㅋㅋ', { size: 44, fill: '#fff', stroke: INK, sw: 6, op: 0.9 });
  h += butterfly(1100 + Math.sin(t * 0.6) * 300, 460 + Math.sin(t * 1.4) * 60, 0.6, t);
  if (!a.ask && lt > 0.3 * D) h += pop(t, t - lt + 0.3 * D, t + 99, 900, 200, big(0, 0, [[['쓸모로 증명하지 않아도, ', '#fff']], [['충분히 소중해', YEL]]], { size: 74, sw: 14 }), {});
  if (a.ask) h += pop(t, t - lt + 0.3, t + 99, 0, 0, speech(760, 300, 900, 140, '쓸모는 없지만 소중한 건?', 660, 760, { size: 48 }), { noPop: true, inDur: 0.3 });
  return h;
};

/* ---------- review fixes ---------- */
CAMS.gourd = [1.0, 1.02, 960, 520]; CAMS.leisure = [1.0, 1.02, 960, 520]; CAMS.zh = [1.0, 1.03, 960, 520];
kingG = function (t, x, y, s) { return char({ t, seed: 940, x, y, s, goggles: 'none', vest: '#C9A04A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', topknot: '#2B2B2B', robe: '#7A3E8E', beard: '#2B2B2B', ex: exprAt([[0, '뿌듯']], t), look: [0.6, -0.2] }) + `<g transform="translate(${f1(x)} ${f1(y - 548 * s)}) scale(${s})"><rect x="-90" y="-20" width="180" height="40" rx="6" fill="#2B2B2B" stroke="${INK}" stroke-width="5"/>${[-60, -30, 0, 30, 60].map(dx => `<line x1="${dx}" y1="20" x2="${dx}" y2="56" stroke="${YEL}" stroke-width="6"/>`).join('')}</g>`; };
P['누워폰'] = Object.assign({ armL: [[148, 285], [196, 262], [262, 252]], hL: [270, 250], armR: [[252, 285], [286, 262], [290, 240]], hR: [294, 236] }, LEGS);
const rotPt = (x, y, s, deg, h) => { const dx = (h[0] - 200) * s, dy = (h[1] - 560) * s, r = deg * Math.PI / 180; return [x + dx * Math.cos(r) - dy * Math.sin(r), y + dx * Math.sin(r) + dy * Math.cos(r)]; };
hookScene = function (t, lt, a) {
  const D = D_(a);
  let h = livingRoom(t, false);
  h += sofa(560, 680);
  const guilt = lt > 0.5 * D;
  h += Z({ t, seed: 900, x: 870, y: 910, s: 0.78, pose: '폰보기', ex: exprAt([[0, '기본'], [0.3 * D, '걱정'], [0.75 * D, '지침']], lt), look: [0, 0.9], sweat: guilt });
  const [px, py] = handG(870, 910, 0.78, [200, 318]);
  h += phone(px, py - 6, 0.4, { on: 1 }) + hand(px - 22, py + 8, 0.78) + hand(px + 22, py + 8, 0.78);
  const S = [[0.02, 420, 270, '그거 해서 뭐 해?', '#fff', -4], [0.18, 1480, 560, '그게 무슨 쓸모가 있어?', '#fff', 3], [0.42, 1460, 760, '주말에도 자기계발!', YEL, -2], [0.55, 380, 500, '갓생 루틴 30가지', PINK, 3]];
  S.forEach(([f, x, y, txt, c, r], i) => { if (lt > f * D) h += pop(t, t - lt + f * D, t + 99, x, y, i < 2 ? `<rect x="-330" y="-80" width="660" height="160" rx="40" fill="#fff" stroke="${INK}" stroke-width="7"/>${T8(0, 14, txt, { size: 44 })}` : label(0, 0, txt, { size: 40, bg: c, color: c === PINK ? '#fff' : NAVY }), { rot: r, bob: 4 }); });
  if (lt > 0.78 * D) h += pop(t, t - lt + 0.78 * D, t + 99, 960, 150, outlined(0, 0, [[['쉬는 날에도 ', '#fff'], ['쓸모 있어야 할까?', YEL]]], { size: 72, sw: 14 }), {});
  return h;
};
const _zhOld2 = zhScene;
zhScene = function (t, lt, a) {
  const D = D_(a);
  if (a.k) return _zhOld2(t, lt, a);
  let h = inkBg(t, { sx: 330, sy: 190 });
  h += pine(260, 880, 1.1) + pine(1720, 900, 0.9);
  h += pop(t, t - lt + 0.15, t + 99, 760, 930, `<path d="M-200 -40 Q-160 -110 0 -110 Q170 -110 210 -30 L220 0 L-210 0 Z" fill="#8A8F86" stroke="${INK}" stroke-width="7"/>` + ZH({ t, seed: 903, x: 0, y: -90, s: 0.86, ex: exprAt([[0, '뿌듯']], t), look: [0.4, -0.2] }) + fanG(...handG(0, -90, 0.86, P['서기'].hR), 0.65, -10 + Math.sin(t * 2) * 8), { noPop: true, inDur: 0.5 });
  h += pop(t, t - lt + 0.2, t + 99, 1380, 260, outlined(0, 0, [[['약 ', '#fff'], ['2,300년 전', YEL]]], { size: 92, sw: 18 }), {});
  if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 1380, 430, label(0, 0, '장자 (莊子)', { size: 54, bg: YEL }), {});
  if (lt > 0.7 * D) h += pop(t, t - lt + 0.7 * D, t + 99, 1380, 530, label(0, 0, '기원전 4세기 · 중국 전국시대', { size: 34, bg: '#fff' }), {});
  return h;
};
const _gourdOld2 = gourdScene;
gourdScene = function (t, lt, a) {
  const D = D_(a);
  if (a.boat) return _gourdOld2(t, lt, a);
  let h = inkBg(t, { sx: 1650, sy: 180 });
  if (a.smash) {
    const crack = prog(lt, 0.55 * D, 0.75 * D), broken = lt > 0.78 * D;
    if (!broken) {
      h += gourdG(1080, 640, 1.2, 0, { crack });
      if (lt < 0.5 * D) for (let i = 0; i < 5; i++) { const k = (t * 1.5 + i / 5) % 1; h += `<path d="M${1000 + i * 40} ${680 + k * 160} q6 14 0 22 q-6 -8 0 -22 Z" fill="#7DB7E0" stroke="${INK}" stroke-width="3"/>`; }
    } else {
      for (let i = 0; i < 5; i++) { const k = easeOut(prog(lt, 0.78 * D, 0.95 * D)); h += `<path d="M0 -60 Q50 -40 60 20 L0 40 Z" transform="translate(${f1(1080 + (i - 2) * 80 * (1 + k))} ${f1(760 + k * 50 + (i % 2) * 30)}) rotate(${f1((i - 2) * 50 * k)})" fill="#D9B44A" stroke="${INK}" stroke-width="6"/>`; }
    }
    h += pop(t, t - lt + 0.1 * D, t + 99, 1480, 330, label(0, 0, '물 담기엔 너무 약하고', { size: 38, bg: '#fff' }), { rot: 2 });
    if (lt > 0.3 * D) h += pop(t, t - lt + 0.3 * D, t + 99, 1480, 440, label(0, 0, '바가지로 쓰기엔 너무 넓적', { size: 38, bg: '#fff' }), { rot: -2 });
    h += HZ({ t, seed: 943, x: 560, y: 930, s: 0.78, pose: broken ? '만세' : '서기', ex: exprAt([[0, '걱정'], [0.55 * D, '화남']], lt), look: [0.7, -0.2] });
    if (broken) h += pop(t, t - lt + 0.8 * D, t + 99, 560, 300, outlined(0, 0, ['쓸모없어!'], { size: 64, sw: 12, fill: YEL }), { rot: -5 });
    return h;
  }
  const grow = easeOutBack(prog(lt, 0.4 * D, 0.8 * D));
  h += kingG(t, 360, 930, 0.66) + pop(t, t - lt + 0.05, t + 99, 360, 250, label(0, 0, '위나라 왕', { size: 36, bg: '#fff' }), {});
  h += HZ({ t, seed: 944, x: 760, y: 930, s: 0.72, pose: '손인사', ex: exprAt([[0, '뿌듯'], [0.6 * D, '놀람']], lt), look: [0.7, -0.3] });
  if (lt < 0.4 * D) h += pop(t, t - lt + 0.1 * D, t + 99, 600, 680, `<g>${[0, 1, 2].map(i => `<ellipse cx="${i * 22}" cy="${(i % 2) * 8}" rx="9" ry="14" fill="#F4E9D0" stroke="${INK}" stroke-width="3"/>`).join('')}</g>`, {});
  if (grow > 0.01) h += gourdG(1300, 860 - 172 * grow, Math.max(0.05, 1.3 * grow));
  if (lt > 0.8 * D) h += pop(t, t - lt + 0.8 * D, t + 99, 1300, 330, label(0, 0, '다섯 섬(五石)이 들어가는 크기!', { size: 38, bg: YEL }), { rot: 3 });
  return h;
};
const _leisOld2 = leisureScene;
leisureScene = function (t, lt, a) {
  const D = D_(a);
  if (!a.cat) return _leisOld2(t, lt, a);
  let h = livingRoom(t, false);
  h += `<rect x="560" y="200" width="600" height="380" rx="20" fill="#1F2D44" stroke="${INK}" stroke-width="9"/><rect x="584" y="224" width="552" height="332" rx="10" fill="#FFF1D6"/>`;
  const by = Math.abs(Math.sin(t * 5)) * 60;
  h += `<g transform="translate(860 ${f1(490 - by)})"><ellipse rx="80" ry="54" fill="#F2A33A" stroke="${INK}" stroke-width="6"/><circle cx="60" cy="-50" r="44" fill="#F2A33A" stroke="${INK}" stroke-width="6"/><path d="M30 -84 L40 -120 L62 -90 Z M74 -88 L96 -118 L100 -80 Z" fill="#F2A33A" stroke="${INK}" stroke-width="5"/><circle cx="50" cy="-54" r="5" fill="${INK}"/><circle cx="76" cy="-54" r="5" fill="${INK}"/><path d="M-80 0 Q-130 -30 -120 -80" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/></g>`;
  h += Z({ t, seed: 930, x: 460, y: 930, s: 0.7, ex: exprAt([[0, '신남']], t), look: [0.6, -0.5] });
  h += pop(t, t - lt + 0.2, t + 99, 420, 360, outlined(0, 0, ['ㅋㅋㅋ'], { size: 60, sw: 12, fill: YEL }), { rot: -6, bob: 6 });
  h += PT({ t, seed: 931, x: 1400, y: 930, s: 0.7, ex: exprAt([[0, '결심']], t), look: [-0.6, -0.5] });
  h += pop(t, t - lt + 0.2 * D, t + 99, 1400, 470, label(0, 0, '쉼은 낭비라는 사람', { size: 36, bg: '#7CC7FF' }), {});
  h += pop(t, t - lt + 0.35 * D, t + 99, 1150, 700, bubble(0, 0, 360, 120, T8(16, 14, '이거 볼 시간에…', { size: 36 })), {});
  return h;
};
treeScene = (function (old) {
  return function (t, lt, a) {
    const D = D_(a);
    if (a.k) {
      let h = inkBg(t, { y1: 560, y2: 680, gy: 880, gc: '#B7C98F', sx: 1650, sy: 190 });
      h += gnarled2(1480, 890, 1.0, t);
      if (lt < 0.5 * D) {
        h += ZH({ t, seed: 921, x: 1000, y: 920, s: 0.74, pose: '손인사', ex: exprAt([[0, '뿌듯']], t), look: [0.6, -0.3] }) + fanG(...handG(1000, 920, 0.74, P['손인사'].hL), 0.5, 10);
        h += pop(t, t - lt + 0.05, t + 99, 0, 0, speech(800, 260, 620, 140, ['그럼 그 아래', '누워 쉬면 되잖아'], 980, 520, { size: 42 }), { noPop: true, inDur: 0.3 });
        h += pop(t, t - lt + 0.15, t + 99, 640, 120, label(0, 0, '넓은 들판에 심어 두고', { size: 40, bg: '#fff' }), { rot: -2 });
        return h;
      }
      const zx = 1290, zy = 880, zs = 0.62, [hx, hy] = lyingHead(zx, zy, zs);
      h += ZH({ t, seed: 921, x: zx, y: zy, s: zs, rot: -88, ex: { expr: '잠', prev: '잠', k: 1, blink: 0 }, noBlink: true });
      h += zz(hx + 10, hy - 110, t);
      h += pop(t, t - lt + 0.55 * D, t + 99, 420, 470, axeG(0, 0, 1) + xMark(0, 0, 0.9), {}) + pop(t, t - lt + 0.6 * D, t + 99, 420, 640, label(0, 0, '도끼 걱정 없음', { size: 40, bg: YEL }), {});
      return h;
    }
    let h = inkBg(t, { sx: 1600, sy: 200 });
    h += gnarled2(1000, 900, 1.0, t);
    h += HZ({ t, seed: 923, x: 430, y: 930, s: 0.78, pose: lt > 0.15 * D ? '가리키기' : '서기', ex: exprAt([[0, '걱정'], [0.4 * D, '지침']], lt), look: [0.7, -0.3] });
    h += pop(t, t - lt + 0.05, t + 99, 430, 360, label(0, 0, '혜자', { size: 40, bg: '#9DB8D9' }), {});
    if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 1000, 150, label(0, 0, '줄기는 울퉁불퉁, 가지는 비비 꼬여', { size: 40, bg: YEL }), { rot: 2 });
    if (lt > 0.62 * D) {
      const cx = lerp(1300, 1620, prog(lt, 0.62 * D, D));
      h += carpenter(t, cx, 930, 0.6, lt);
      h += pop(t, t - lt + 0.66 * D, t + 99, cx + 134, 930 - 0.6 * 390 - 150, bubble(0, 0, 320, 110, T8(12, 14, '쓸 데가 없군', { size: 38 })), {});
    }
    return h;
  };
})(treeScene);
