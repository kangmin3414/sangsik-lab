/* 걱정 편 — 샘플(대본_v2 1~18번). 새 이름은 모두 qw 접두사. qdscenes.js(원자 꿈 편)의 qdPlate·qdK·qdFx를 함께 쓴다.
   물리 규칙: 앉은 제로는 의자 좌판 위 · 노트·폰·걱정이는 책상 윗면 위 · 종소리 고리는 종에서 퍼진다 · 원인 다음 결과. */
Object.assign(QBG, { desknight: 'ai/desknight.png' });
['qwdesk', 'qwbook', 'qwfall', 'qwdoors', 'qwnet'].forEach(k => CAMS[k] = 'fixed');
const QW_GOLD = '#F5C451', QW_GOLD2 = '#FFE9A8', QW_NAVY = '#27365E', QW_BODY = '#BFD4EE', QW_BRASS = '#D9A441';
const qwDefs = () => `<defs>
<radialGradient id="qwLamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".95"/><stop offset=".5" stop-color="#FFD36B" stop-opacity=".35"/><stop offset="1" stop-color="#FFD36B" stop-opacity="0"/></radialGradient>
<radialGradient id="qwDark" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#151B36"/><stop offset="1" stop-color="#04060F"/></radialGradient>
<radialGradient id="qwGoldGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".8"/><stop offset="1" stop-color="#F5C451" stop-opacity="0"/></radialGradient>
<linearGradient id="qwFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04060F" stop-opacity="1"/><stop offset=".35" stop-color="#04060F" stop-opacity="0"/></linearGradient>
</defs>`;
/* ---------- 걱정이: 꼬마 야간 경비원. 원점 = 발. o: ring(종 흔들림 -1~1), talk(0~1), eyes('wide'|'normal'|'shut'), look[-1~1], shrink, lanternUp(0~1), hug ---------- */
function qwGuard(x, y, s, t, o = {}) {
  const sc = s * (o.shrink || 1), bob = Math.sin(t * 9 + (o.seed || 0)) * (o.calm ? 1 : 3), ring = o.ring || 0, talk = o.talk || 0, lk = o.look || [0, 0], up = o.lanternUp || 0;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1((o.flip ? -1 : 1) * sc * 1000) / 1000} ${f1(sc * 1000) / 1000})">`;
  h += `<ellipse cx="0" cy="2" rx="52" ry="10" fill="#000" opacity=".28"/>`;
  h += `<g transform="translate(0 ${f1(bob)})">`;
  // 다리
  h += `<line x1="-20" y1="-22" x2="-22" y2="-2" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><line x1="20" y1="-22" x2="22" y2="-2" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><ellipse cx="-26" cy="-2" rx="15" ry="8" fill="${QW_NAVY}" stroke="${INK}" stroke-width="5"/><ellipse cx="26" cy="-2" rx="15" ry="8" fill="${QW_NAVY}" stroke="${INK}" stroke-width="5"/>`;
  // 등불(왼손, 화면 왼쪽)
  const lx = o.hug ? -30 : -78, ly = lerp(-66, -170, up);
  h += `<circle cx="${lx}" cy="${f1(ly + 26)}" r="${f1(70 + 6 * Math.sin(t * 7))}" fill="url(#qwLamp)" opacity=".8"/>`;
  h += `<line x1="-44" y1="-78" x2="${lx}" y2="${f1(ly)}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
  h += `<g transform="translate(${lx} ${f1(ly)})"><path d="M-6 0 Q0 -14 6 0" fill="none" stroke="${INK}" stroke-width="5"/><rect x="-17" y="2" width="34" height="42" rx="8" fill="#FFE27A" stroke="${INK}" stroke-width="5"/><rect x="-21" y="-2" width="42" height="9" rx="4" fill="${QW_NAVY}" stroke="${INK}" stroke-width="4"/><rect x="-21" y="41" width="42" height="9" rx="4" fill="${QW_NAVY}" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="24" r="7" fill="#fff"/></g>`;
  // 몸
  h += `<ellipse cx="0" cy="-74" rx="58" ry="60" fill="${QW_BODY}" stroke="${INK}" stroke-width="7"/><ellipse cx="-18" cy="-96" rx="20" ry="14" fill="#fff" opacity=".35"/>`;
  h += `<rect x="-30" y="-52" width="60" height="12" rx="5" fill="${QW_NAVY}" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-46" r="7" fill="${QW_BRASS}" stroke="${INK}" stroke-width="3"/>`;
  // 얼굴
  const ex = lk[0] * 6, ey = lk[1] * 4, er = o.eyes === 'wide' ? 11 : 8;
  if (o.eyes === 'shut') h += `<path d="M-26 -84 q8 6 16 0 M10 -84 q8 6 16 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  else h += `<circle cx="${f1(-18 + ex)}" cy="${f1(-84 + ey)}" r="${er}" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="${f1(18 + ex)}" cy="${f1(-84 + ey)}" r="${er}" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="${f1(-18 + ex * 1.5)}" cy="${f1(-84 + ey * 1.5)}" r="4.5" fill="${INK}"/><circle cx="${f1(18 + ex * 1.5)}" cy="${f1(-84 + ey * 1.5)}" r="4.5" fill="${INK}"/>`;
  h += `<ellipse cx="0" cy="-64" rx="${f1(7 + talk * 5)}" ry="${f1(2 + talk * 9)}" fill="#7A2E3A" stroke="${INK}" stroke-width="4"/>`;
  h += `<circle cx="-36" cy="-68" r="8" fill="#F5A3B5" opacity=".6"/><circle cx="36" cy="-68" r="8" fill="#F5A3B5" opacity=".6"/>`;
  // 경비 모자(눈썹까지 내려온다, 불안하면 들썩)
  const capY = (o.capDown ? 10 : 0) + (o.calm ? 0 : Math.abs(Math.sin(t * 11)) * -4);
  h += `<g transform="translate(0 ${f1(capY)})"><path d="M-56 -104 Q-58 -150 0 -152 Q58 -150 56 -104 Z" fill="${QW_NAVY}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-64 -102 Q0 -84 64 -102 L60 -112 Q0 -98 -60 -112 Z" fill="#1B2748" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><circle cx="0" cy="-128" r="11" fill="${QW_BRASS}" stroke="${INK}" stroke-width="4"/></g>`;
  // 종(오른손): ring으로 흔들린다
  const bx = o.hug ? 26 : 80, by = o.hug ? -50 : -92;
  h += `<line x1="44" y1="-78" x2="${bx}" y2="${by}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
  if (!o.noBell) h += `<g transform="translate(${bx} ${by}) rotate(${f1(ring * 34)})"><rect x="-5" y="-26" width="10" height="20" rx="4" fill="#8A5A2B" stroke="${INK}" stroke-width="4"/><path d="M-22 26 Q-22 -8 0 -8 Q22 -8 22 26 Z" fill="${QW_BRASS}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="-26" y="22" width="52" height="9" rx="4" fill="#C08A2E" stroke="${INK}" stroke-width="4"/><circle cx="${f1(ring * 8)}" cy="36" r="6" fill="${INK}"/></g>`;
  if (o.sweat) h += `<path d="M48 -128 q8 12 0 18 q-8 -6 0 -18Z" fill="#9ED8FF" stroke="${INK}" stroke-width="3"/>`;
  return h + `</g></g>`;
}
// 종소리 고리: (x,y)에서 퍼진다. flat = 바닥에 눕힌 타원 비율
function qwRings(x, y, t, o = {}) {
  const n = o.n || 4, sp = o.speed || 1.6, R = o.R || 420, flat = o.flat || 1; let h = '';
  for (let i = 0; i < n; i++) { const k = ((t * sp + i / n) % 1); h += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(20 + k * R)}" ry="${f1((20 + k * R) * flat)}" fill="none" stroke="${o.color || '#FFE27A'}" stroke-width="${f1(7 * (1 - k) + 1)}" opacity="${f1((1 - k) * (o.op || 0.8) * 100) / 100}"/>`; }
  return h;
}
const qwBellRing = (t, on) => on ? Math.sin(t * 34) : 0;

/* ---------- 1. 원룸 책상 ---------- */
const QD0 = { zx: 720, top: 800, seat: 880, s: 0.95, nb: [960, 792], ph: [1130, 800], gx: 1290 };
const qwSitY = () => QD0.seat - 12 + 148 * QD0.s;
function qwFurniture() { const { top, seat } = QD0, cx = QD0.zx - 10;
  let h = `<rect x="${cx - 70}" y="${seat - 150}" width="22" height="160" rx="8" fill="#6A5A78" stroke="${INK}" stroke-width="6"/><rect x="${cx - 90}" y="${seat - 14}" width="170" height="26" rx="10" fill="#7C6A8C" stroke="${INK}" stroke-width="6"/><line x1="${cx - 76}" y1="${seat + 12}" x2="${cx - 86}" y2="1040" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><line x1="${cx + 66}" y1="${seat + 12}" x2="${cx + 76}" y2="1040" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>`;
  return h; }
function qwDesk(t, o = {}) { const { top } = QD0;
  let h = `<rect x="860" y="${top}" width="620" height="30" rx="8" fill="#A9794E" stroke="${INK}" stroke-width="8"/><rect x="890" y="${top + 30}" width="24" height="212" fill="#8B6038" stroke="${INK}" stroke-width="7"/><rect x="1426" y="${top + 30}" width="24" height="212" fill="#8B6038" stroke="${INK}" stroke-width="7"/><rect x="1180" y="${top + 30}" width="246" height="90" fill="#9A6C42" stroke="${INK}" stroke-width="7"/><circle cx="1303" cy="${top + 76}" r="8" fill="${QW_BRASS}" stroke="${INK}" stroke-width="3"/>`;
  // 스탠드
  h += `<path d="M1420 ${top} L1420 ${top - 150} L1350 ${top - 200}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M1300 ${top - 176} L1372 ${top - 226} L1352 ${top - 168} Z" fill="#E86A5C" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><ellipse cx="1420" cy="${top}" rx="34" ry="8" fill="#555" stroke="${INK}" stroke-width="5"/>`;
  h += `<circle cx="1180" cy="${top - 60}" r="330" fill="url(#qwLamp)" opacity=".45"/>`;
  // 노트(펼친 채 책상 위)
  if (!o.noNote) h += `<g transform="translate(${QD0.nb[0]} ${QD0.nb[1]})"><path d="M-78 4 L-64 -18 L64 -18 L78 4 Z" fill="#FBF7EE" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><line x1="0" y1="-18" x2="0" y2="4" stroke="${INK}" stroke-width="4"/>` + [-52, -30, 20, 44].map(x => `<line x1="${x}" y1="-8" x2="${x + 18}" y2="-8" stroke="#9AA" stroke-width="3"/>`).join('') + `</g>`;
  // 폰(세워 둠, 뒷면이 카메라 쪽)
  if (!o.noPhone) { const gl = 0.6 + 0.3 * Math.sin(t * 6) * Math.sin(t * 2.3);
    h += `<circle cx="${QD0.ph[0] - 70}" cy="${top - 90}" r="190" fill="url(#screenGlow)" opacity="${f1((o.phoneOn ? gl : 0.25) * 100) / 100}"/><g transform="translate(${QD0.ph[0]} ${top}) rotate(12)"><rect x="-26" y="-112" width="52" height="108" rx="10" fill="#1F2D44" stroke="${INK}" stroke-width="6"/><circle cx="10" cy="-94" r="6" fill="#3B4A66" stroke="${INK}" stroke-width="3"/></g><path d="M${QD0.ph[0] + 12} ${top - 30} L${QD0.ph[0] + 46} ${top}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`; }
  return h; }
function qwNotePage(lt) { // 노트 클로즈업: 같은 문장 열 줄 + 열한 번째 줄 쓰다 멈춤
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#3A2E2A"/><g transform="translate(960 560) rotate(-3)"><rect x="-560" y="-470" width="1120" height="1000" rx="14" fill="#FBF7EE" stroke="${INK}" stroke-width="9"/>`;
  for (let i = 0; i < 12; i++) h += `<line x1="-500" y1="${-372 + i * 72}" x2="500" y2="${-372 + i * 72}" stroke="#C9D6E8" stroke-width="3"/>`;
  for (let i = 0; i < 10; i++) h += fT(-480, -386 + i * 72, '나는 발표를 완벽하게 해냈다.', 46, '#2B2B55', { anchor: 'start' });
  const full = '나는 발표를 완벽하게 해냈다.', n = Math.min(7, Math.floor(lt * 5.5)), part = full.slice(0, n);
  h += fT(-480, -386 + 10 * 72, part, 46, '#2B2B55', { anchor: 'start' });
  const px = -480 + n * 44 + 10, py = -386 + 10 * 72 - 12, jit = n < 7 ? Math.sin(lt * 40) * 3 : 0;
  h += `<g transform="translate(${f1(px + jit)} ${f1(py)}) rotate(28)"><rect x="-8" y="-190" width="16" height="170" rx="6" fill="#3E6FB8" stroke="${INK}" stroke-width="5"/><path d="M-8 -20 L0 6 L8 -20 Z" fill="#EED9B5" stroke="${INK}" stroke-width="4"/></g>`;
  return h + `</g>`;
}
function qwdeskScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 3, s = QD0.s, y = qwSitY(), zx = QD0.zx, top = QD0.top;
  if (ph === 0 && lt < 1.7) return qwDefs() + qCam(qLerpCam(lt / 1.7, [960, 600, 1.0], [980, 640, 1.12]), qwNotePage(lt)) + fFull('#0A1238', 0.12)
    + pop(t, t - lt + 0.1, t + 99, 330, 150, label(0, 0, '일요일 밤 11:40', { size: 44, bg: '#BFE6FF' }), { rot: -4, bob: 2 });
  E['_qwz'] = qTalk('z당황', env(t)); E['_qwz2'] = qTalk('z졸음', env(t) * 0.7);
  const WRITE = Object.assign({}, P['f앉기'], { armR: [[252, 285], [300, 330], [336, 334]], hR: [340, 332] });
  const EARS = Object.assign({}, P['f앉기'], { armL: [[148, 285], [104, 236], [128, 184]], hL: [134, 176], armR: [[252, 285], [296, 236], [272, 184]], hR: [266, 176] });
  let pose = WRITE, ex = fEx('z기본'), look = [0.6, 0.6], tilt = 0, phoneOn = false, guard = null, rings = '', over = '', chest = '';
  let cam = [1040, 700, 1.3];
  const chestXY = ptOf(zx, y, s, 214, 318);
  if (ph === 0) { cam = qLerpCam((lt - 1.7) / 1.3, [1040, 700, 1.25], [1040, 700, 1.32]); ex = fEx('z멍'); look = [0.8, 0.5]; }
  if (ph === 1) { phoneOn = true; const tP = fAt(a, '끌려옵니다', D * 0.4); cam = qLerpCam(lt / D, [860, 640, 1.9], [840, 630, 2.15]);
    ex = lt < tP ? fEx('z반짝') : fEx('z당황'); look = [0.9, 0.2];
    for (let i = 0; i < 3; i++) { const k = ((t * 1.2 + i / 3) % 1); over += ''; chest += `<path d="M${QD0.ph[0] - 40 - k * 120} ${top - 120} q-${f1(16 + k * 20)} 44 0 88" fill="none" stroke="#BFE6FF" stroke-width="6" stroke-linecap="round" opacity="${f1((1 - k) * 0.8 * 100) / 100}"/>`; } }
  if (ph === 2) { phoneOn = true; cam = [880, 650, 1.8]; ex = fEx('_qwz'); look = [0.9, 0.3]; pose = Object.assign({}, WRITE, { armR: [[252, 285], [300, 320], [320, 300]], hR: [324, 296] }); }
  if (ph === 3) { // 가슴에서 종소리 → 문이 열림 → 걱정이 튀어나와 책상에 착지
    cam = qLerpCam(lt / 2.6, [820, 720, 1.9], [1040, 720, 1.5]); ex = lt < 0.9 ? fEx('z의심') : fEx('z충격'); look = lt < 0.9 ? [0.2, 0.9] : [0.9, 0.5];
    pose = Object.assign({}, P['f앉기'], { armL: [[148, 285], [110, 250], [120, 200]], hL: [124, 194], armR: [[252, 285], [300, 250], [290, 200]], hR: [286, 194] });
    if (lt < 1.3) rings = qwRings(chestXY[0], chestXY[1], lt, { n: 3, speed: 2.4, R: 200 });
    const open = qdK(0.9, 1.15, lt);
    chest += `<g transform="translate(${f1(chestXY[0])} ${f1(chestXY[1])})"><rect x="-22" y="-28" width="44" height="56" rx="8" fill="#1B2748" stroke="${INK}" stroke-width="5"/><g transform="scale(${f1(1 - open * 0.85)} 1) translate(-22 0)"><rect x="0" y="-28" width="44" height="56" rx="8" fill="#F4A04C" stroke="${INK}" stroke-width="5"/><circle cx="34" cy="2" r="4" fill="${INK}"/></g></g>`;
    if (lt > 1.15) { const k = qdK(1.15, 1.95, lt), gx = lerp(chestXY[0], QD0.gx, k), gy = lerp(chestXY[1], top, k) - Math.sin(k * Math.PI) * 190, sq = k >= 1 ? 1 + 0.12 * Math.exp(-(lt - 1.95) * 9) * Math.cos((lt - 1.95) * 30) : 1;
      guard = `<g transform="translate(${f1(gx)} ${f1(gy)}) scale(${f1(lerp(0.3, 1, k) * 1000) / 1000} ${f1(lerp(0.3, 1, k) * sq * 1000) / 1000}) rotate(${f1((1 - k) * -200)})">${qwGuard(0, 0, 0.95, t, { eyes: 'wide', look: [-0.6, 0], ring: 0 })}</g>`;
      if (k >= 1 && lt < 2.3) over += qdFx(t, lt, 1.95, 2.5, 1400, 420, '착!', '#FFE27A', { size: 64 }); }
    over += qdFx(t, lt, 0.05, 1.1, 560, 330, '땡땡땡', '#FFE27A', { size: 62 }); }
  const gOn = ph >= 4;
  if (ph === 4) { const tA = fAt(a, '아니', D * 0.4), tB = fAt(a, '종 친', D * 0.75); cam = qLerpCam(lt / D, [1230, 690, 1.9], [1250, 680, 2.2]);
    const freeze = lt > tA - 0.1 && lt < tA + 0.7, ringing = !freeze, hard = lt > tB;
    guard = qwGuard(QD0.gx, top, 0.95, t, { eyes: 'wide', look: freeze ? [0.8, -0.3] : [-0.5, 0], ring: ringing ? qwBellRing(t * (hard ? 1.5 : 1), true) : 0, talk: env(t), sweat: lt > tA });
    if (ringing) rings = qwRings(QD0.gx + 76, top - 92, t, { n: hard ? 5 : 3, speed: hard ? 2.6 : 1.8, R: hard ? 520 : 380 });
    ex = fEx('z당황'); look = [0.9, 0.3]; pose = EARS;
    if (freeze) over += qdFx(t, lt, tA, tA + 0.7, 1560, 300, '헉!', '#fff', { size: 70 }); }
  if (ph === 5) { cam = qLerpCam(lt / D, [1060, 690, 1.3], [1060, 690, 1.42]); const run = Math.sin(lt * 2.2), gx = QD0.gx - 90 + run * 110;
    guard = qwGuard(gx, top, 0.95, t, { eyes: 'wide', look: [Math.cos(lt * 2.2) > 0 ? 0.6 : -0.6, 0], flip: Math.cos(lt * 2.2) < 0, ring: qwBellRing(t, true), talk: 0.3 + 0.3 * Math.abs(Math.sin(t * 8)), sweat: true });
    rings = qwRings(gx + (Math.cos(lt * 2.2) < 0 ? -76 : 76), top - 92, t, { n: 4, speed: 2.2, R: 460 });
    ex = fEx('z울먹'); look = [0.8, 0.3]; pose = EARS; tilt = Math.sin(lt * 3) * 3;
    const tN = fAt(a, '걱정이', 2.0); if (lt > tN - 0.2) over += pop(t, t - lt + tN - 0.2, t + 99, 1500, 250, label(0, 0, '걱정이 · 가슴 속 야간 경비원', { size: 42, bg: YEL }), { rot: -3, bob: 3 }); }
  if (ph === 6) { cam = [900, 720, 1.7]; const dn = easeInOut(qdK(0.1, 0.6, lt)); ex = fEx('_qwz2'); look = [0.5, 1]; tilt = dn * 26;
    pose = Object.assign({}, P['f앉기'], { armL: [[148, 285], [200, 320], [280, 332]], hL: [286, 332], armR: [[252, 285], [300, 326], [350, 334]], hR: [356, 334] });
    guard = qwGuard(QD0.gx, top, 0.95, t, { eyes: 'wide', look: [-0.8, 0], ring: qwBellRing(t, lt % 0.9 < 0.45), talk: 0 });
    if (lt % 0.9 < 0.45) rings = qwRings(QD0.gx + 76, top - 92, t, { n: 2, speed: 2.2, R: 260 });
    if (lt > 0.55 && lt < 1.2) over += qdFx(t, lt, 0.55, 1.2, 1100, 420, '쿵', '#fff', { size: 58 }); }
  let w = qwFurniture() + Z({ x: zx, y, s, t, pose, ex, look, tilt, seed: 3 }) + chest + qwDesk(t, { phoneOn }) + (guard || '') + rings;
  return qwDefs() + qdPlate('desknight', cam, 0.6) + qCam(cam, w) + fFull('#0A1238', 0.16) + over;
}

/* ---------- 2. 책이 떠오른다 → 글자가 금빛 실로 풀리고, 바닥이 넘어간다 ---------- */
function qwBookArt(x, y, s, t, rot = -6) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000})"><circle r="330" fill="url(#qwGoldGlow)" opacity=".7"/><rect x="-170" y="-230" width="340" height="460" rx="14" fill="#1A2244" stroke="${INK}" stroke-width="10"/><rect x="-170" y="-230" width="34" height="460" fill="#101733" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 6; i++) h += `<path d="M-120 ${-170 + i * 66} Q0 ${-200 + i * 66 + Math.sin(t * 2 + i) * 14} 150 ${-170 + i * 66}" fill="none" stroke="${QW_GOLD}" stroke-width="4" opacity=".8"/>`;
  for (let i = 0; i < 5; i++) h += `<path d="M${-100 + i * 58} -200 Q${-110 + i * 58 + Math.sin(t * 2 + i) * 12} 0 ${-100 + i * 58} 200" fill="none" stroke="${QW_GOLD}" stroke-width="4" opacity=".8"/>`;
  for (let i = 0; i < 12; i++) h += `<circle cx="${f1(-110 + hash(i * 3.1) * 250)}" cy="${f1(-190 + hash(i * 7.7) * 380)}" r="${f1(4 + 3 * Math.abs(Math.sin(t * 3 + i)))}" fill="${QW_GOLD2}"/>`;
  return h + `</g>`;
}
function qwbookScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 5, s = QD0.s, y = qwSitY(), zx = QD0.zx, top = QD0.top;
  const tB = ph === 0 ? fAt(a, '디바인', D * 0.6) : 0, rise = ph === 0 ? easeOut(qdK(0.4, 1.6, lt)) : 1;
  const cam = ph === 0 ? qLerpCam(lt / D, [1060, 680, 1.3], [1100, 620, 1.5]) : qLerpCam(lt / 2.6, [1100, 620, 1.5], [1040, 700, 1.15]);
  let w = qwFurniture(), over = '';
  const fall = ph === 1 ? easeIn(qdK(1.3, 2.5, lt)) : 0, dy = fall * 900;
  w += `<g transform="translate(0 ${f1(dy)}) rotate(${f1(fall * 14)} ${zx} ${y})">${Z({ x: zx, y, s, t, pose: ph === 1 && lt > 1.2 ? '허우적' : P['f앉기'], ex: fEx(ph === 1 && lt > 0.8 ? 'z충격' : 'z멍'), look: [0.9, -0.4], seed: 3 })}</g>`;
  w += qwDesk(t, { phoneOn: true, noNote: ph === 1 && lt > 0.4 });
  w += `<g transform="translate(0 ${f1(dy * 1.1)})">${qwGuard(QD0.gx, top, 0.95, t, { eyes: 'wide', look: [-0.5, -0.6], ring: 0, talk: 0, hug: ph === 1 && lt > 0.8 })}</g>`;
  w += qwBookArt(QD0.ph[0] - 40, lerp(top - 60, top - 330, rise), lerp(0.1, 0.62, rise), t, -6 + Math.sin(t * 1.5) * 3);
  if (ph === 0 && lt > tB) over += pop(t, t - lt + tB, t + 99, 1480, 240, label(0, 0, '『디바인 매트릭스』 · 2007', { size: 44, bg: '#FFF2C2' }), { rot: -3, bob: 3 });
  let threads = '';
  if (ph === 1) { const g = qdK(0.2, 1.6, lt); // 노트 글자가 금빛 실로 풀려 방을 채운다
    for (let i = 0; i < 26; i++) { const an = -Math.PI + (i / 26) * Math.PI * 2 + Math.sin(i) * 0.3, L = g * (500 + hash(i * 3.3) * 900), x0 = QD0.nb[0], y0 = QD0.nb[1] - 10, x1 = x0 + Math.cos(an) * L, y1 = y0 + Math.sin(an) * L * 0.7, wob = Math.sin(t * 3 + i) * 60;
      threads += `<path d="M${x0} ${y0} Q${f1((x0 + x1) / 2 + wob)} ${f1((y0 + y1) / 2 - 80)} ${f1(x1)} ${f1(y1)}" fill="none" stroke="${i % 3 ? QW_GOLD : QW_GOLD2}" stroke-width="${f1(3 + hash(i) * 3)}" stroke-linecap="round" opacity="${f1(g * 0.9 * 100) / 100}"/><circle cx="${f1(x1)}" cy="${f1(y1)}" r="6" fill="${QW_GOLD2}" opacity="${f1(g * 100) / 100}"/>`; }
    over += `<rect x="-100" y="-100" width="2200" height="1400" fill="#04060F" opacity="${f1(qdK(1.9, 2.55, lt) * 100) / 100}"/>`; }
  return qwDefs() + qdPlate('desknight', cam, 0.6) + qCam(cam, w + threads) + fFull('#0A1238', 0.16 + (ph === 1 ? qdK(0.2, 1.6, lt) * 0.3 : 0)) + over;
}

/* ---------- 3. 떨어지며 보는 세 낱말 ---------- */
function qwWeb(t, speed, op = 0.5) { // 위로 흘러가는 금빛 그물(떨어지는 느낌)
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="url(#qwDark)"/>`;
  for (let i = 0; i < 16; i++) { const x = -200 + i * 150; h += `<path d="M${x} -200 Q${f1(x + Math.sin(t * 0.8 + i) * 50)} 540 ${x} 1300" fill="none" stroke="${QW_GOLD}" stroke-width="3" opacity="${op}"/>`; }
  for (let i = 0; i < 12; i++) { const y = ((i * 130 - t * speed) % 1560 + 1560) % 1560 - 200; h += `<path d="M-300 ${f1(y)} Q960 ${f1(y + Math.sin(t + i) * 40)} 2300 ${f1(y)}" fill="none" stroke="${QW_GOLD}" stroke-width="3" opacity="${op}"/>`; }
  return h;
}
function qwfallScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 10;
  let h = qwWeb(t, ph === 0 ? 520 : 200, 0.4), over = '';
  if (ph === 1) { // 걱정이 클로즈업: 종을 끌어안고 떤다
    E['_qwg'] = 0; const sh = Math.sin(t * 46) * 5;
    h += `<g transform="translate(${f1(960 + sh)} 760)">${qwGuard(0, 0, 3.0, t, { eyes: 'wide', look: [0, -0.5], hug: true, talk: env(t), sweat: true, ring: Math.sin(t * 46) * 0.15 })}</g>`;
    return qwDefs() + h + qdFx(t, lt, 0.2, D, 1500, 300, '덜덜', '#BFE6FF', { size: 64 });
  }
  const zx = 520 + Math.sin(lt * 0.9) * 30, zy = 620 + Math.cos(lt * 0.7) * 30;
  h += `<g transform="translate(${f1(zx)} ${f1(zy)}) rotate(${f1(Math.sin(lt * 0.8) * 16)})">${Z({ x: 0, y: 190, s: 0.7, t, pose: lt < 2 ? '허우적' : '둥둥', ex: exprAt([[0, 'z충격'], [2, 'z멍'], [5, 'z반짝']], lt), look: [0.9, -0.2], seed: 3 })}</g>`;
  h += `<g transform="translate(${f1(zx + 190)} ${f1(zy + 150 + Math.sin(lt * 1.3) * 20)}) rotate(${f1(Math.sin(lt * 1.1 + 1) * 20)})">${qwGuard(0, 60, 0.8, t, { eyes: 'wide', look: [0.6, -0.3], hug: true })}</g>`;
  const tW = [fAt(a, '그물은', 8.0) + 0.8, fAt(a, '다리이자', 10.6), fAt(a, '거울이라고', 11.9)], tF = fAt(a, '느낌이', 14.0), tN = fAt(a, '그물로', 5.3);
  if (lt > tN - 0.3 && lt < tW[0] - 0.2) over += pop(t, t - lt + tN - 0.3, t - lt + tW[0] - 0.2, 1340, 430, outlined(0, 0, ['보이지 않는 그물'], { size: 72, sw: 15, fill: QW_GOLD2 }), { rot: -3, bob: 3 });
  const icons = [
    `<path d="M-110 -40 Q0 130 110 -40" fill="none" stroke="${QW_GOLD}" stroke-width="10" stroke-linecap="round"/>` + [-70, -35, 0, 35, 70].map(x => `<path d="M${x} ${-40 + Math.abs(x) * 0.25} Q${x * 0.7} 40 ${x * 0.3} ${72 - Math.abs(x) * 0.2}" fill="none" stroke="${QW_GOLD}" stroke-width="4"/>`).join('') + `<path d="M-84 0 Q0 30 84 0 M-56 34 Q0 56 56 34" fill="none" stroke="${QW_GOLD}" stroke-width="4"/><circle cx="-20" cy="-6" r="9" fill="${QW_GOLD2}"/><circle cx="26" cy="10" r="7" fill="#fff"/>`,
    `<path d="M-120 30 Q0 -70 120 30" fill="none" stroke="${QW_GOLD}" stroke-width="10" stroke-linecap="round"/><line x1="-120" y1="30" x2="120" y2="30" stroke="${QW_GOLD}" stroke-width="8"/>` + [-80, -40, 0, 40, 80].map(x => `<line x1="${x}" y1="30" x2="${x}" y2="${-36 + x * x * 0.008}" stroke="${QW_GOLD}" stroke-width="4"/>`).join(''),
    `<ellipse rx="78" ry="104" fill="#1A2244" stroke="${QW_GOLD}" stroke-width="10"/><path d="M-40 -50 L-10 -80 M-48 -10 L10 -70" stroke="${QW_GOLD2}" stroke-width="6" stroke-linecap="round"/><rect x="-14" y="104" width="28" height="30" fill="${QW_GOLD}"/>`];
  ['그릇', '다리', '거울'].forEach((nm, i) => { if (lt < tW[i] - 0.15) return; const g = easeOutBack(qdK(tW[i] - 0.15, tW[i] + 0.25, lt)), x = 1060 + i * 290;
    over += `<g transform="translate(${x} 440) scale(${f1(g * 1000) / 1000})"><circle r="150" fill="url(#qwGoldGlow)" opacity=".5"/>${icons[i]}</g>` + (g > 0.9 ? outlined(x, 680, [nm], { size: 70, sw: 14, fill: '#fff' }) : ''); });
  if (lt > tF) { const k = qdK(tF, tF + 1.2, lt); // 느낌(하트)이 그물에 말을 건다
    over += `<g transform="translate(${f1(lerp(zx + 60, 1350, k))} ${f1(lerp(zy - 60, 860, k))}) scale(${f1(0.8 + 0.3 * Math.sin(t * 8))})"><path d="M0 26 C -60 -14 -48 -58 -18 -58 C 0 -58 0 -42 0 -36 C 0 -42 0 -58 18 -58 C 48 -58 60 -14 0 26 Z" fill="#FF8FA3" stroke="${INK}" stroke-width="6"/></g>`;
    if (k >= 1) over += qwRings(1350, 860, t, { n: 3, speed: 1.2, R: 300, color: '#FF8FA3' }) + pop(t, t - lt + tF + 1.2, t + 99, 1350, 990, label(0, 0, '책: “느낌이 그물의 언어”', { size: 40, bg: '#FFE0E6' }), { rot: -2 }); }
  return qwDefs() + h + over;
}

/* ---------- 금빛 그물의 바다(원근). 지평선 y=430, 소실점 (960,430) ---------- */
const QN = { hy: 430, vx: 960 };
const qwFloorY = d => QN.hy + 640 / (d + 0.9);          // d: 0(가까움)~ 큼(멂)
function qwNetSea(t, o = {}) {
  let h = `<rect x="-2000" y="-1500" width="6000" height="4000" fill="#04060F"/><rect x="-2000" y="-1500" width="6000" height="${1500 + QN.hy}" fill="url(#qwDark)"/>`;
  for (let i = 0; i < 70; i++) h += `<circle cx="${f1(-600 + hash(i * 3.7) * 3100)}" cy="${f1(-300 + hash(i * 9.1) * 700)}" r="${f1(1 + hash(i) * 2.4)}" fill="#DDE6FF" opacity="${f1((0.2 + 0.5 * Math.abs(Math.sin(t * (0.5 + hash(i)) + i))) * 100) / 100}"/>`;
  h += `<ellipse cx="${QN.vx}" cy="${QN.hy}" rx="1500" ry="60" fill="url(#qwGoldGlow)" opacity=".5"/>`;
  const col = o.color || QW_GOLD;
  for (let i = -18; i <= 18; i++) { const xb = QN.vx + i * 230; h += `<line x1="${QN.vx + i * 14}" y1="${QN.hy}" x2="${xb}" y2="1400" stroke="${col}" stroke-width="3" opacity=".55"/>`; }
  for (let j = 0; j < 14; j++) { const d = j * 0.55 - ((t * (o.flow || 0)) % 0.55), y = qwFloorY(d); if (y > 1400 || d < -0.6) continue; h += `<line x1="-2000" y1="${f1(y)}" x2="4000" y2="${f1(y)}" stroke="${col}" stroke-width="${f1(clamp(4 - d * 0.4, 1, 4))}" opacity="${f1(clamp(0.7 - d * 0.07, 0.15, 0.7) * 100) / 100}"/>`; }
  for (let i = 0; i < 30; i++) { const d = hash(i * 5.1) * 6, ix = Math.round((hash(i * 2.3) - 0.5) * 20), y = qwFloorY(Math.round(d / 0.55) * 0.55), k = (y - QN.hy) / (1400 - QN.hy), x = QN.vx + ix * (14 + (230 - 14) * k);
    h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1((2 + 5 * k) * (0.6 + 0.4 * Math.abs(Math.sin(t * 2 + i))))}" fill="${QW_GOLD2}"/>`; }
  return h + `<rect x="-2000" y="${QN.hy - 4}" width="6000" height="300" fill="url(#qwFade)" opacity=".7"/>`;
}
// 바닥 물결(발걸음): 눕힌 타원이 퍼진다. age 초
function qwRipple(x, y, age, o = {}) { if (age < 0) return ''; let h = '';
  for (let i = 0; i < 3; i++) { const a2 = age - i * 0.28; if (a2 < 0) continue; const r = a2 * (o.v || 420), op = clamp(1 - a2 / (o.life || 2.6), 0, 1);
    h += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * 0.24)}" fill="none" stroke="#FFF6D0" stroke-width="${f1(8 * op + 1)}" opacity="${f1(op * 100) / 100}"/>`; }
  return h; }

/* ---------- 4. 문 세 개 ---------- */
function qwdoorsScene(t, lt, a) {
  const D = a._dur || 9, tP = fAt(a, '받아들이지', 2.4), tW = fAt(a, '걸어가', D * 0.7), land = easeOut(qdK(0, 0.8, lt));
  const cam = qLerpCam(lt / D, [960, 620, 1.0], [960, 600, 1.12]);
  let w = qwNetSea(t), over = '';
  ['그릇', '다리', '거울'].forEach((nm, i) => { const x = 620 + i * 340, y = 700, open = i === 0 ? easeInOut(qdK(tW, tW + 0.9, lt)) : 0;
    w += `<g transform="translate(${x} ${y})"><circle cy="-150" r="${f1(230 + open * 120)}" fill="url(#qwGoldGlow)" opacity="${f1((0.35 + open * 0.5) * 100) / 100}"/><rect x="-82" y="-300" width="164" height="300" rx="80" fill="#FFF3C4" opacity="${f1(open * 100) / 100}"/><g transform="translate(-82 0) scale(${f1(1 - open * 0.8)} 1)"><rect x="0" y="-300" width="164" height="300" rx="80" fill="#1A2244" stroke="${QW_GOLD}" stroke-width="9"/><circle cx="134" cy="-140" r="9" fill="${QW_GOLD2}"/></g>${outlined(0, -340, [nm], { size: 54, sw: 12, fill: QW_GOLD2 })}</g>`; });
  const zy = lerp(300, 980, land), sq = land >= 1 ? 1 - 0.1 * Math.exp(-(lt - 0.8) * 8) * Math.cos((lt - 0.8) * 26) : 1;
  w += qwRipple(900, 985, lt - 0.8) + qwRipple(1085, 990, lt - 0.9, { v: 220 });
  w += `<g transform="translate(900 ${f1(zy)}) scale(1 ${f1(sq * 1000) / 1000})">${Z({ x: 0, y: 0, s: 0.72, t, pose: land < 1 ? '허우적' : '서기', ex: fEx(land < 1 ? 'z충격' : lt > tW ? 'z반짝' : 'z멍'), look: [lt > tW ? -0.5 : 0, -0.3], seed: 3 })}</g>`;
  w += `<g transform="translate(0 ${f1(lerp(-700, 0, land))})">${qwGuard(1085, 990, 0.8, t, { eyes: 'wide', look: [-0.5, -0.4], hug: lt < tW, ring: 0 })}</g>`;
  if (lt > tP - 0.3 && lt < tW - 0.4) over += pop(t, t - lt + tP - 0.3, t - lt + tW - 0.4, 960, 170, label(0, 0, '물리학계: 책의 양자 해석은 받아들이지 않음', { size: 44, bg: '#fff' }), { rot: -2, bob: 3 });
  if (lt > tW) over += pop(t, t - lt + tW, t + 99, 960, 170, label(0, 0, '그래도, 직접 걸어가 보면', { size: 46, bg: YEL }), { rot: -2, bob: 3 });
  return qwDefs() + qCam(cam, w) + over;
}
/* ---------- 5. 그릇의 방: 종을 쳐도 그물은 안 변한다, 걸으면 물결 ---------- */
function qwnetScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 3, FY = 960;
  E['_qwn'] = qTalk('z반짝', env(t) * 0.9);
  let zx = 760, gx = 1160, cam = [960, 600, 1.0], over = '', w = qwNetSea(t), ex = fEx('z멍'), look = [0.7, 0.2], g = { eyes: 'wide', look: [0.5, 0.3] }, rings = '', rip = '', zdy = 0, pose = '서기';
  if (ph === 0) { cam = qLerpCam(lt / 3.2, [960, 560, 0.82], [1000, 620, 1.05]); const on = lt > 0.5 && lt < 2.7;
    g = { eyes: 'wide', look: [0.6, 0.5], ring: qwBellRing(t * 1.4, on), talk: on ? 0.5 : 0, sweat: true };
    if (on) rings = qwRings(gx + 76, FY - 92, t, { n: 5, speed: 2.4, R: 900 }) + qwRings(gx + 76, FY, t, { n: 3, speed: 1.6, R: 900, flat: 0.24, op: 0.5 });
    over += qdFx(t, lt, 0.5, 2.7, 1500, 300, '땡땡땡땡!', '#FFE27A', { size: 70 });
    if (lt > 1.6) over += pop(t, t - lt + 1.6, t + 99, 520, 240, label(0, 0, '그물: 변화 없음', { size: 46, bg: '#fff' }), { rot: -3, bob: 3 }); ex = fEx('z의심'); }
  if (ph === 1) { cam = [1260, 800, 2.3]; g = { eyes: 'wide', look: [0.9, 0.2], ring: 0, talk: env(t), calm: true }; }
  if (ph === 2) { const tM = fAt(a, '몸도', D * 0.45), tG = fAt(a, '기분에', D * 0.75); cam = qLerpCam(lt / D, [960, 640, 1.05], [900, 660, 1.3]);
    // 제로의 몸이 그물 위의 물결로 잠깐 보인다
    const k = qdK(tM - 0.2, tM + 0.6, lt) * (1 - qdK(tG - 0.6, tG - 0.1, lt));
    if (k > 0) { let wv = ''; for (let i = 0; i < 9; i++) { const yy = FY - 60 - i * 44, wd = [40, 46, 60, 70, 66, 50, 84, 90, 70][i]; wv += `<path d="M${zx - wd} ${yy} q${wd / 2} ${-18 * Math.sin(t * 5 + i)} ${wd} 0 t${wd} 0" fill="none" stroke="${QW_GOLD2}" stroke-width="6" stroke-linecap="round" opacity="${f1(k * 100) / 100}"/>`; } over += ''; w += `<g>${wv}</g>`; }
    if (lt > tG - 0.2) { // 걱정이가 기분(빨강·파랑)을 던져도 그물 색은 그대로
      [['#FF6B6B', 0], ['#6BA8FF', 0.5]].forEach(([c, dl], i) => { const kk = qdK(tG - 0.2 + dl, tG + 0.5 + dl, lt); if (kk <= 0) return; const bx = lerp(gx, 1000 + i * 420, kk), by = lerp(FY - 120, FY + 40, kk) - Math.sin(kk * Math.PI) * 220;
        w += kk < 1 ? `<circle cx="${f1(bx)}" cy="${f1(by)}" r="30" fill="${c}" stroke="${INK}" stroke-width="5"/>` : `<ellipse cx="${f1(bx)}" cy="${f1(by)}" rx="${f1(60 * Math.max(0, 1 - (lt - tG - 0.5 - dl) * 1.2))}" ry="${f1(14 * Math.max(0, 1 - (lt - tG - 0.5 - dl) * 1.2))}" fill="${c}" opacity=".7"/>`; });
      over += pop(t, t - lt + tG + 0.6, t + 99, 1380, 250, label(0, 0, '기분에는 반응하지 않는다', { size: 46, bg: '#fff' }), { rot: -3, bob: 3 }); }
    const tJ = fAt(a, '장', 2.2); if (lt > tJ - 0.2 && lt < tM - 0.3) over += pop(t, t - lt + tJ - 0.2, t - lt + tM - 0.3, 960, 190, outlined(0, 0, ['장(場)'], { size: 96, sw: 18, fill: QW_GOLD2 }), { rot: -3 });
    g = { eyes: 'wide', look: [-0.6, 0.5], ring: 0, noBell: false }; }
  const step = (t0) => easeInOut(qdK(t0, t0 + 0.5, lt));
  if (ph === 3) { cam = lt < 1.0 ? [800, 900, 2.2] : qLerpCam((lt - 1.0) / 1.4, [900, 700, 1.2], [960, 620, 0.9]); const k = step(0.3); zx = 760 + k * 70; zdy = -Math.sin(k * Math.PI) * 26;
    rip = qwRipple(zx + 10, FY + 6, lt - 0.8, { v: 620, life: 2.2 }); ex = fEx(lt > 0.9 ? 'z충격' : 'z멍'); look = [0.3, 0.9]; g = { eyes: 'wide', look: [-0.8, 0.6], ring: 0 };
    over += qdFx(t, lt, 0.8, 1.6, 1240, 420, '톡', '#FFF6D0', { size: 60 }); }
  if (ph === 4) { const tW = fAt(a, '걸으니까', D * 0.55); cam = qLerpCam(lt / D, [900, 660, 1.35], [920, 650, 1.45]); const k = step(tW); zx = 830 + k * 70; zdy = -Math.sin(k * Math.PI) * 26;
    rip = qwRipple(zx + 10, FY + 6, lt - tW - 0.5, { v: 620, life: 2.2 }); ex = fEx('_qwn'); look = lt < tW ? [0.8, 0.1] : [0.3, 0.9]; g = { eyes: 'wide', look: [-0.8, 0.3], ring: 0, calm: true }; }
  if (ph === 5) { cam = qLerpCam(lt / 2.4, [960, 620, 1.0], [1000, 560, 0.85]); const n = Math.floor(lt / 0.7), k = step(n * 0.7); zx = 900 + (n + k) * 70; zdy = -Math.sin(k * Math.PI) * 22; gx = 1160 + (lt * 90);
    for (let i = 0; i <= n; i++) rip += qwRipple(900 + (i + 1) * 70 + 10, FY + 6, lt - i * 0.7 - 0.5, { v: 520, life: 2.0 });
    ex = fEx('z빵긋'); look = [0.8, 0.2]; g = { eyes: 'normal', look: [0.5, 0.3], ring: 0, calm: true }; }
  w += rip + qwGuard(gx, FY + 10, 0.85, t, g) + rings;
  w += `<ellipse cx="${f1(zx)}" cy="${FY + 8}" rx="80" ry="14" fill="#000" opacity=".35"/>` + Z({ x: zx, y: FY + zdy, s: 0.8, t, pose, ex, look, seed: 3 });
  const fade = ph === 5 ? qdK(1.7, 2.4, lt) : 0;
  return qwDefs() + qCam(cam, w) + over + `<rect x="-100" y="-100" width="2200" height="1400" fill="#04060F" opacity="${f1(fade * 100) / 100}"/>`;
}
