/* 걱정 편 — 뒷부분(대본_v2 19~40번): 다리의 방, 거울의 방, 3막, 결말. qwscenes.js 다음에 불러온다.
   물리 규칙: 판자는 발이 닿기 직전에 생긴다 · 그림자는 등불이 올라간 뒤에 줄어든다 · 걱정이는 손바닥 위에 올라선다 · 종은 책상 윗면 위에 놓인다. */
['qwbridge', 'qwstudy', 'qwmirror', 'qwnotes', 'qwmemory', 'qwdoor', 'qwend'].forEach(k => CAMS[k] = 'fixed');
const qwSkyBg = () => `<rect x="-2000" y="-1500" width="6000" height="1300" fill="#5B63C4"/><rect x="-2000" y="-300" width="6000" height="1900" fill="url(#qwSky)"/>`;
const qwLantern = (x, y, s, t) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><circle cy="26" r="${f1(90 + 8 * Math.sin(t * 7))}" fill="url(#qwLamp)" opacity=".85"/><path d="M-6 0 Q0 -14 6 0" fill="none" stroke="${INK}" stroke-width="5"/><rect x="-17" y="2" width="34" height="42" rx="8" fill="#FFE27A" stroke="${INK}" stroke-width="5"/><rect x="-21" y="-2" width="42" height="9" rx="4" fill="${QW_NAVY}" stroke="${INK}" stroke-width="4"/><rect x="-21" y="41" width="42" height="9" rx="4" fill="${QW_NAVY}" stroke="${INK}" stroke-width="4"/><circle cy="24" r="7" fill="#fff"/></g>`;
const qwBellObj = (x, y, s, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000})"><rect x="-5" y="-62" width="10" height="20" rx="4" fill="#8A5A2B" stroke="${INK}" stroke-width="4"/><path d="M-22 -10 Q-22 -44 0 -44 Q22 -44 22 -10 Z" fill="${QW_BRASS}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="-26" y="-14" width="52" height="9" rx="4" fill="#C08A2E" stroke="${INK}" stroke-width="4"/></g>`;

/* ---------- 6. 다리의 방 ---------- */
const QB = { gy: 780, edge: 640, far: 1400, step: 120 };
function qwCliffs(t, fog = 1) {
  let h = qwSkyBg();
  h += `<path d="M-900 ${QB.gy} L${QB.edge} ${QB.gy} L${QB.edge - 70} 1500 L-900 1500 Z" fill="#6C5FC4" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-900 ${QB.gy} L${QB.edge} ${QB.gy} L${QB.edge - 14} ${QB.gy + 44} L-900 ${QB.gy + 44} Z" fill="#8E84DC"/>`;
  h += `<path d="M${QB.far} ${QB.gy} L3000 ${QB.gy} L3000 1500 L${QB.far + 70} 1500 Z" fill="#6C5FC4" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M${QB.far} ${QB.gy} L3000 ${QB.gy} L3000 ${QB.gy + 44} L${QB.far + 14} ${QB.gy + 44} Z" fill="#8E84DC"/>`;
  for (let i = 0; i < 9; i++) { const x = 300 + i * 190 + Math.sin(t * 0.4 + i) * 60, y = 960 + (i % 3) * 70; h += `<ellipse cx="${f1(x)}" cy="${y}" rx="${260 + (i % 2) * 80}" ry="70" fill="#fff" opacity="${f1((0.35 + 0.12 * Math.sin(t * 0.7 + i)) * fog * 100) / 100}"/>`; }
  return h; }
function qwMirage(t, op) { const x = QB.far + 210, sh = 0.75 + 0.2 * Math.sin(t * 3);
  let h = `<g opacity="${f1(op * sh * 100) / 100}"><circle cx="${x}" cy="${QB.gy - 240}" r="380" fill="url(#qwGoldGlow)"/>`;
  h += Z({ x, y: QB.gy, s: 0.9, t, pose: '만세', ex: fEx('z빵긋'), look: [-0.4, -0.2], seed: 12, vest: '#FFD86B' });
  for (let i = 0; i < 8; i++) { const an = i / 8 * Math.PI * 2 + t * 0.6, r = 250 + 30 * Math.sin(t * 3 + i); h += zStar(x + Math.cos(an) * r, QB.gy - 250 + Math.sin(an) * r * 0.8, 12, '#FFF6D0', 2); }
  [-170, 170].forEach((dx, i) => { const c = Math.abs(Math.sin(t * 9 + i)) * 10; h += hand(x + dx - c, QB.gy - 40, 0.7) + hand(x + dx + 36 + c, QB.gy - 40, 0.7); });
  return h + `</g>` + (op > 0.5 ? `<g opacity="${f1(op * 100) / 100}">${label(x, QB.gy - 560, '발표를 끝낸 나', { size: 40, bg: '#FFF2C2' })}</g>` : ''); }
const qwPlank = (i, k) => { const x = QB.edge + 60 + i * QB.step; return `<g transform="translate(${x} ${QB.gy}) scale(${f1(easeOutBack(k) * 1000) / 1000})"><rect x="-57" y="-6" width="114" height="24" rx="6" fill="#E7B877" stroke="${INK}" stroke-width="6"/><line x1="-40" y1="6" x2="40" y2="6" stroke="#B88A4C" stroke-width="4"/><circle r="70" cy="6" fill="url(#qwGoldGlow)" opacity="${f1((1 - k) * 100) / 100}"/></g>`; };
function qwbridgeScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 3, GY = QB.gy;
  E['_qwb'] = qTalk('z히죽', env(t) * 0.8);
  let zx = 480, zy = GY, pose = '서기', ex = fEx('z반짝'), look = [0.9, -0.2], g = { eyes: 'normal', look: [0.6, -0.2], calm: true }, gx = 300, cam = [960, 620, 1.0], over = '', rings = '', planks = '', mir = 1, fog = 1, zdy = 0;
  if (ph === 0) { cam = qLerpCam(lt / 3.4, [1080, 560, 0.9], [900, 600, 1.05]); const sit = lt > 2.0; pose = sit ? '웅크림' : '서기'; ex = lt < 0.8 ? fEx('z멍') : sit ? fEx('z빵긋') : fEx('z반짝');
    over += qdFx(t, lt, 0.4, 2.0, 1150, 330, '짝짝짝', '#FFF6D0', { size: 56 }); if (sit && lt < 2.7) over += qdFx(t, lt, 2.0, 2.7, 760, 600, '털썩', '#fff', { size: 54 });
    over += pop(t, t - lt + 2.3, t + 99, 1060, 720, label(0, 0, '다리: 한 칸도 없음', { size: 42, bg: '#fff' }), { rot: -3, bob: 3 }); }
  if (ph === 1) { const tS = fAt(a, '멈추는', D * 0.75); cam = qLerpCam(lt / D, [620, 640, 1.7], [600, 650, 1.95]); pose = '웅크림'; ex = lt < tS ? fEx('z빵긋') : fEx('z졸음'); look = [0.9, -0.1];
    if (lt > tS) for (let i = 0; i < 2; i++) { const k = ((lt - tS) * 0.7 + i / 2) % 1; over += `<g opacity="${f1(Math.sin(k * Math.PI) * 100) / 100}">${fT(1050 + k * 50, 300 - k * 120, 'z', 44 + i * 10, '#fff', { stroke: INK, sw: 7 })}</g>`; } }
  if (ph === 2) { const tN = fAt(a, '숫자', D * 0.65); cam = qLerpCam(lt / D, [560, 660, 1.75], [540, 660, 1.9]); pose = lt < 0.5 ? '웅크림' : '서기'; ex = lt < 0.5 ? fEx('z졸음') : lt > tN ? fEx('z충격') : fEx('z당황'); look = [-0.8, 0.3]; gx = 300;
    g = { eyes: 'wide', look: [0.8, -0.5], ring: qwBellRing(t * 1.3, true), talk: env(t), sweat: true }; rings = qwRings(gx + 68, GY - 78, t, { n: 3, speed: 2.4, R: 300 });
    if (lt > tN) over += qdFx(t, lt, tN, tN + 1.2, 1300, 260, '헉!', '#fff', { size: 70 }); }
  const STEP = (i) => 0.5 + i * 0.6;
  if (ph === 3) { cam = qLerpCam(lt / 3.2, [760, 640, 1.25], [1040, 620, 1.0]); let n = 0, k = 0; for (let i = 0; i < 4; i++) if (lt >= STEP(i)) { n = i + 1; k = easeInOut(qdK(STEP(i), STEP(i) + 0.42, lt)); }
    zx = 580 + (n - 1 + k) * QB.step * (n > 0 ? 1 : 0); if (n === 0) zx = 580; zdy = n > 0 ? -Math.sin(k * Math.PI) * 30 : 0; ex = fEx(n > 1 ? 'z반짝' : 'z결심'); look = [0.8, 0.5];
    for (let i = 0; i < n; i++) planks += qwPlank(i, qdK(STEP(i) - 0.02, STEP(i) + 0.25, lt));
    mir = 1 - qdK(0.8, 3.0, lt) * 0.75; fog = 1 - qdK(0.8, 3.0, lt) * 0.6; gx = 300 + qdK(1.2, 3.2, lt) * 260; g = { eyes: 'wide', look: [0.7, 0], calm: true };
    for (let i = 0; i < n; i++) if (lt - STEP(i) < 0.6) over += qdFx(t, lt, STEP(i) + 0.1, STEP(i) + 0.6, 700 + i * 150, 480 - i * 20, '탁', '#FFF6D0', { size: 50 }); }
  if (ph === 4) { cam = qLerpCam(lt / D, [940, 640, 1.55], [960, 640, 1.7]); zx = 580 + 4 * QB.step; for (let i = 0; i < 5; i++) planks += qwPlank(i, 1); mir = 0.25; fog = 0.4; ex = fEx('_qwb'); look = [-0.8, 0.5]; gx = 580 + 2 * QB.step + 20;
    g = { eyes: 'normal', look: [0.6, -0.5], capDown: true, calm: true, hug: true }; }
  const s = 0.85;
  let w = qwCliffs(t, fog) + qwMirage(t, mir) + planks + qwGuard(gx, GY + 4, 0.8, t, g) + rings;
  w += `<ellipse cx="${f1(zx)}" cy="${GY + 8}" rx="70" ry="12" fill="#1B2260" opacity=".3"/>` + Z({ x: zx, y: zy + zdy, s, t, pose, ex, look, seed: 3 });
  return qwDefs() + qCam(cam, w) + over;
}
/* ---------- 7. 도식: 성공을 자주 상상한 학생일수록 ---------- */
function qwstudyScene(t, lt, a) {
  const D = a._dur || 14, tG = fAt(a, '독일', 1.6), tQ = fAt(a, '상상하느냐고', D * 0.45) - 0.9, t2 = fAt(a, '뒤', D * 0.6) - 0.4, tA = fAt(a, '지원서를', D * 0.78), tS = fAt(a, '연봉도', D * 0.9);
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#4450A8"/><rect x="-400" y="-300" width="2800" height="1700" fill="url(#qwDark)"/>`;
  const cap = (x, y) => `<path d="M${x - 70} ${y} L${x} ${y - 30} L${x + 70} ${y} L${x} ${y + 26} Z" fill="#1B2748" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><line x1="${x + 56}" y1="${y + 4}" x2="${x + 60}" y2="${y + 50}" stroke="${QW_GOLD}" stroke-width="5"/>`;
  [[560, 1, '#F59E5B'], [1360, 0.35, '#6FB3E8']].forEach(([x, dream, col], i) => { const y = 800, s = 0.8, top = ptOf(x, y, s, 200, 76);
    h += Z({ x, y, s, t, pose: '서기', ex: fEx(i === 0 ? (lt > tA ? 'z멍' : 'z빵긋') : 'z결심'), look: [0, -0.3], seed: 5 + i, vest: col }) + cap(top[0], top[1] + 6);
    if (lt > tQ) { const g = easeOutBack(qdK(tQ + i * 0.25, tQ + i * 0.25 + 0.4, lt)) * dream, bx = x + 30, by = 200; // 상상 말풍선(클수록 자주 상상)
      h += `<g transform="translate(${bx} ${by}) scale(${f1(g * 1000) / 1000})"><ellipse rx="190" ry="130" fill="#fff" stroke="${INK}" stroke-width="8"/><circle cx="-90" cy="150" r="22" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="-120" cy="196" r="12" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M-44 -50 L44 -50 L36 20 Q0 50 -36 20 Z" fill="${QW_GOLD}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="-12" y="34" width="24" height="26" fill="${QW_GOLD}" stroke="${INK}" stroke-width="5"/><rect x="-40" y="58" width="80" height="16" rx="5" fill="#C08A2E" stroke="${INK}" stroke-width="5"/>${zStar(-110, -50, 14, '#FFE27A', 2)}${zStar(110, -30, 12, '#FFE27A', 2)}</g>`; }
    if (lt > tA) { const n = Math.round((i === 0 ? 2 : 9) * easeOut(qdK(tA, tA + 1.0 + i * 0.3, lt))); // 지원서 더미
      for (let k = 0; k < n; k++) h += `<g transform="translate(${x + 230} ${800 - k * 22}) rotate(${(k % 2 ? 3 : -3)})"><rect x="-70" y="-14" width="140" height="18" rx="3" fill="#FBF7EE" stroke="${INK}" stroke-width="5"/><line x1="-50" y1="-5" x2="30" y2="-5" stroke="#9AA" stroke-width="3"/></g>`;
      h += label(x + 230, 860, `지원서`, { size: 34, bg: '#fff' }); }
    if (lt > tS) { const n = Math.round((i === 0 ? 2 : 6) * easeOut(qdK(tS, tS + 0.9, lt)));
      for (let k = 0; k < n; k++) h += `<ellipse cx="${x - 230}" cy="${804 - k * 18}" rx="46" ry="14" fill="${QW_GOLD}" stroke="${INK}" stroke-width="5"/>`;
      h += label(x - 230, 860, '연봉', { size: 34, bg: '#fff' }); }
    if (lt > tQ) h += label(x, 860, i === 0 ? '자주 상상' : '가끔 상상', { size: 36, bg: i === 0 ? '#FFE9A8' : '#DCEBFF' }); });
  let over = '';
  if (lt > tG - 0.3 && lt < t2 - 0.2) over += pop(t, t - lt + tG - 0.3, t - lt + t2 - 0.2, 960, 120, label(0, 0, '2002년 · 졸업을 앞둔 독일 대학생', { size: 46, bg: '#fff' }), { rot: -2, bob: 3 });
  if (lt > t2) over += pop(t, t - lt + t2, t + 99, 960, 120, label(0, 0, '2년 뒤', { size: 60, bg: YEL }), { rot: -3, bob: 3 });
  return qwDefs() + qCam(qLerpCam(lt / D, [960, 560, 1.0], [960, 570, 1.06]), h) + over;
}

/* ---------- 8. 거울의 방 ---------- */
const QM = { fy: 960, mx: 1290, zx: 680, gx: 900 };
function qwMonster(t, m) { const wob = Math.sin(t * 3) * 10;
  return `<g transform="translate(${QM.mx} 884) scale(${f1(m * 1000) / 1000})"><path d="M-190 0 Q-230 -420 -70 -560 L-110 -700 L-14 -596 Q0 -606 14 -596 L110 -700 L70 -560 Q230 -420 190 0 Z" fill="#1B1440" stroke="#0D0926" stroke-width="10" stroke-linejoin="round" transform="skewX(${f1(wob * 0.3)})"/><ellipse cx="-62" cy="-430" rx="30" ry="${f1(22 + 6 * Math.sin(t * 5))}" fill="#FFE27A"/><ellipse cx="62" cy="-430" rx="30" ry="${f1(22 + 6 * Math.sin(t * 5))}" fill="#FFE27A"/><path d="M-90 -320 L-60 -290 L-30 -320 L0 -290 L30 -320 L60 -290 L90 -320" fill="none" stroke="#FFE27A" stroke-width="10" stroke-linejoin="round"/><path d="M-190 -260 Q-300 -300 -280 -400 M190 -260 Q300 -300 280 -400" fill="none" stroke="#1B1440" stroke-width="34" stroke-linecap="round"/></g>`; }
function qwMirrorRoom(t, o = {}) { const m = o.m == null ? 1 : o.m, paper = o.paper || 0;
  let h = `<rect x="-2000" y="-1500" width="6000" height="2400" fill="#9A8FE0"/><rect x="-2000" y="-300" width="6000" height="1200" fill="url(#qwSky)" opacity=".55"/><rect x="-2000" y="900" width="6000" height="900" fill="#5E66C2"/><line x1="-2000" y1="900" x2="4000" y2="900" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 9; i++) h += `<line x1="${-600 + i * 400}" y1="900" x2="${-1100 + i * 520}" y2="1500" stroke="#4A52AE" stroke-width="5"/>`;
  h += `<circle cx="${QM.mx}" cy="520" r="620" fill="url(#qwGoldGlow)" opacity=".45"/>`;
  h += `<clipPath id="qwMc"><rect x="${QM.mx - 250}" y="130" width="500" height="760" rx="230"/></clipPath><rect x="${QM.mx - 270}" y="110" width="540" height="800" rx="250" fill="${QW_GOLD}" stroke="${INK}" stroke-width="10"/><rect x="${QM.mx - 250}" y="130" width="500" height="760" rx="230" fill="#CFC8F5" stroke="${INK}" stroke-width="8"/>`;
  h += `<g clip-path="url(#qwMc)"><rect x="${QM.mx - 250}" y="130" width="500" height="760" fill="#B9B0EE"/><path d="M${QM.mx - 200} 130 L${QM.mx - 60} 130 L${QM.mx - 250} 480 Z" fill="#fff" opacity=".25"/>${m > 0.02 ? qwMonster(t, m) : ''}`;
  if (paper > 0) { h += `<rect x="${QM.mx - 250}" y="130" width="500" height="760" fill="#FBF7EE" opacity="${f1(paper * 100) / 100}"/>`; for (let i = 0; i < 9; i++) h += `<line x1="${QM.mx - 200}" y1="${250 + i * 66}" x2="${QM.mx + 200}" y2="${250 + i * 66}" stroke="#C9D6E8" stroke-width="4" opacity="${f1(paper * 100) / 100}"/>`; }
  h += `</g><rect x="${QM.mx - 60}" y="906" width="120" height="26" rx="8" fill="#C08A2E" stroke="${INK}" stroke-width="6"/>`;
  if (o.pebble) h += `<ellipse cx="${QM.mx - 150}" cy="952" rx="17" ry="11" fill="#B9B4C8" stroke="${INK}" stroke-width="5"/>` + (o.spark ? zStar(QM.mx - 126, 926, 12, '#FFF6D0', 2) : '');
  return h; }
function qwmirrorScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 3, FY = QM.fy, s = 0.85;
  E['_qwm'] = qTalk('z빵긋', env(t) * 0.8); E['_qwm2'] = qTalk('z히죽', env(t)); E['_qwm3'] = qTalk('z울먹', env(t) * 0.6);
  let zx = QM.zx, gx = QM.gx, pose = '서기', ex = fEx('z멍'), look = [0.9, -0.3], g = { eyes: 'wide', look: [0.7, -0.6] }, cam = [960, 600, 1.0], over = '', extra = '', m = 1, pebble = false, spark = false, paper = 0, gdy = 0, zdy = 0, whiteOut = 0;
  const shr = 0.72;
  if (ph === 0) { m = easeOutBack(qdK(0.5, 1.3, lt)); cam = qLerpCam(lt / 2.8, [960, 640, 1.05], [1040, 560, 0.95]); ex = lt > 0.9 ? fEx('z충격') : fEx('z멍');
    g = { eyes: 'wide', look: [0.7, -0.8], sweat: lt > 1.1, noBell: lt > 1.1 }; if (lt > 1.1) { const k = easeIn(qdK(1.1, 1.45, lt)), bnc = lt > 1.45 ? Math.abs(Math.sin((lt - 1.45) * 14)) * 26 * Math.exp(-(lt - 1.45) * 5) : 0; extra += qwBellObj(lerp(gx + 68, gx + 104, k), lerp(FY - 70, FY + 4, k) - bnc, 0.85, k * 84); if (lt > 1.45) over += qdFx(t, lt, 1.45, 2.3, 1450, 560, '쨍그랑', '#F5C451', { size: 52 }); } gdy = lt > 1.1 && lt < 1.5 ? -Math.sin((lt - 1.1) / 0.4 * Math.PI) * 60 : 0;
    over += qdFx(t, lt, 0.6, 1.8, 560, 260, '쿠구궁', '#2A1F5C', { size: 72 }); }
  if (ph === 1) { cam = qLerpCam(lt / D, [760, 700, 1.6], [780, 690, 1.75]); ex = fEx('z당황'); gx = 540; g = { eyes: 'wide', look: [0.9, -0.6], talk: env(t), sweat: true, noBell: true };
    extra += hand(gx + 70 + Math.sin(t * 40) * 3, FY - 74 + Math.sin(t * 37) * 4, 0.5) + qwBellObj(QM.gx + 104, FY + 4, 0.85, 84); }
  let lanternAt = null;
  if (ph === 2) { // 등불을 들어 올린다 → 그림자가 줄어든다 → 돌멩이
    const offer = easeInOut(qdK(0.0, 0.35, lt)), take = easeInOut(qdK(0.2, 0.6, lt)), up = easeInOut(qdK(0.7, 1.5, lt)); gx = 860; m = lerp(1, 0, easeInOut(qdK(1.3, 2.9, lt))); pebble = lt > 2.2; spark = lt > 3.0;
    cam = lt < 2.6 ? qLerpCam(lt / 2.6, [960, 620, 1.0], [1000, 600, 1.05]) : qLerpCam((lt - 2.6) / 1.0, [1000, 600, 1.05], [1160, 800, 1.9]);
    const hx = lerp(lerp(290, 334, take), 318, up), hy = lerp(lerp(400, 396, take), 120, up);
    pose = Object.assign({}, P['서기'], { armR: [[252, 285], [lerp(lerp(280, 296, take), 306, up), lerp(345, 210, up)], [hx - 4, hy + (up > 0.5 ? 8 : -6)]], hR: [hx, hy] }); ex = fEx(lt > 2.9 ? 'z반짝' : 'z결심'); look = [0.9, lt > 2.6 ? 0.6 : -0.3];
    if (take >= 1) { const p = ptOf(zx, FY, s, hx, hy); lanternAt = [p[0], p[1] + 6]; }
    g = { eyes: 'wide', look: [0.5, -0.8], noLantern: take >= 1, lanternUp: offer };
    if (lt > 1.4 && lt < 2.8) over += qdFx(t, lt, 1.4, 2.8, 1620, 300, '스르르…', '#fff', { size: 58 });
    if (spark) over += pop(t, t - lt + 3.0, t + 99, 960, 200, label(0, 0, '손톱만 한 돌멩이 하나', { size: 46, bg: '#fff' }), { rot: -3, bob: 3 }); }
  if (ph >= 3) { m = 0; pebble = ph === 3 ? false : true; }
  if (ph === 3) { cam = qLerpCam(lt / D, [800, 680, 1.5], [800, 680, 1.62]); ex = fEx('_qwm'); look = [0.7, 0.4]; pose = Object.assign({}, P['서기'], { armR: [[252, 285], [310, 300], [372, 290]], hR: [380, 288], armL: [[148, 285], [112, 230], [100, 170]], hL: [98, 162] });
    { const q = ptOf(zx, FY, s, 98, 162); lanternAt = [q[0], q[1] + 6]; }
    const p = ptOf(zx, FY, s, 380, 288); extra += `<ellipse cx="${f1(p[0] + 8)}" cy="${f1(p[1] - 22)}" rx="15" ry="10" fill="#B9B4C8" stroke="${INK}" stroke-width="5"/>`; g = { eyes: 'wide', look: [-0.8, -0.4], calm: true, noLantern: true }; }
  if (ph === 4) { cam = qLerpCam(lt / D, [780, 680, 1.5], [780, 680, 1.6]); ex = fEx('_qwm2'); look = [0.8, 0.5]; const wv = Math.sin(lt * 7) * 14;
    pose = Object.assign({}, P['서기'], { armR: [[252, 285], [306, 270], [340 + wv, 220]], hR: [344 + wv, 212] }); g = { eyes: 'normal', look: [-0.8, -0.4], calm: true }; }
  let shrink = 1;
  if (ph === 5) { cam = qLerpCam(lt / 2.6, [860, 720, 1.6], [900, 760, 2.0]); const k = easeInOut(qdK(0.3, 1.5, lt)); shrink = lerp(1, shr, k); ex = lt > 1.6 ? fEx('z멍') : fEx('z히죽'); look = [0.8, 0.6];
    g = { eyes: 'normal', look: [0.2, 0.8], capDown: true, calm: true, hug: lt > 0.4 }; }
  if (ph >= 6) shrink = shr;
  if (ph === 6) { cam = qLerpCam(lt / D, [800, 760, 1.7], [810, 770, 1.85]); pose = Object.assign({}, P['웅크림'], { armR: [[252, 285], [316, 330], [384, 352]], hR: [392, 352] }); ex = fEx('_qwm3'); look = [0.8, 0.5];
    g = { eyes: 'normal', look: [-0.8, -0.3], capDown: lt < D * 0.6, calm: true, hug: true }; }
  if (ph === 7) { const tJ = fAt(a, '적어', D * 0.5), hop = easeInOut(qdK(0.3, 1.0, lt)); cam = qLerpCam(lt / D, [840, 740, 1.6], [1100, 560, 1.25]); pose = Object.assign({}, P['웅크림'], { armR: [[252, 285], [316, 330], [384, 352]], hR: [392, 352] }); ex = fEx('z빵긋'); look = [0.8, 0.3];
    const p = ptOf(zx, FY + 30 * s, s, 392, 352); gx = lerp(QM.gx, p[0] + 6, hop); gdy = lerp(0, p[1] - 16 - FY, hop) - Math.sin(hop * Math.PI) * 110;
    g = { eyes: 'normal', look: [-0.6, -0.3], calm: true, hug: true }; paper = qdK(tJ - 0.3, tJ + 0.9, lt); whiteOut = qdK(D - 0.7, D, lt); }
  let w = qwMirrorRoom(t, { m, pebble, spark, paper });
  w += `<ellipse cx="${f1(zx)}" cy="${FY + 8}" rx="76" ry="13" fill="#1B2260" opacity=".3"/>` + Z({ x: zx, y: FY + zdy, s, t, pose, ex, look, seed: 3 });
  w += qwGuard(gx, FY + 6 + gdy, 0.85, t, Object.assign({ shrink }, g)) + extra;
  if (lanternAt) w += `<line x1="${f1(lanternAt[0])}" y1="${f1(lanternAt[1] - 8)}" x2="${f1(lanternAt[0])}" y2="${f1(lanternAt[1])}" stroke="${INK}" stroke-width="5"/>` + qwLantern(lanternAt[0], lanternAt[1], 0.85, t);
  return qwDefs() + qCam(cam, w) + over + `<rect x="-100" y="-100" width="2200" height="1400" fill="#FBF7EE" opacity="${f1(whiteOut * 100) / 100}"/>`;
}
/* ---------- 9. 도식: 걱정 쪽지 100장 ---------- */
function qwnotesScene(t, lt, a) {
  const D = a._dur || 16, tU = fAt(a, '미국에서', 1.6), tW = fAt(a, '적고', D * 0.35), t91 = fAt(a, '91', D * 0.6), tN = fAt(a, '않았습니다', D * 0.72), t3 = fAt(a, '셋은', D * 0.88);
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#4450A8"/><rect x="-400" y="-300" width="2800" height="1700" fill="url(#qwDark)"/>`;
  const keep = [7, 23, 38, 41, 56, 64, 79, 85, 92], better = [23, 56, 85];
  for (let i = 0; i < 100; i++) { const c = i % 20, r = Math.floor(i / 20), x0 = 390 + c * 60, y0 = 330 + r * 96, born = qdK(tU + i * (tW + 1.2 - tU) / 100, tU + 0.2 + i * (tW + 1.2 - tU) / 100, lt); if (born <= 0) continue;
    const isKeep = keep.includes(i), gone = !isKeep && lt > tN - 0.5 ? easeIn(qdK(tN - 0.5 + hash(i) * 0.6, tN + 0.6 + hash(i) * 0.6, lt)) : 0;
    const x = x0 + gone * (hash(i * 3) - 0.5) * 500, y = y0 - gone * (300 + hash(i * 7) * 500), rot = (hash(i) - 0.5) * 12 + gone * 200, bright = better.includes(i) && lt > t3 ? qdK(t3, t3 + 0.5, lt) : 0;
    h += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(easeOutBack(born) * (1 + bright * 0.5) * 1000) / 1000})" opacity="${f1((1 - gone) * 100) / 100}"><rect x="-22" y="-30" width="44" height="60" rx="5" fill="${bright > 0 ? '#FFF2A8' : isKeep && lt > tN ? '#FFD0D0' : '#FBF7EE'}" stroke="${INK}" stroke-width="4"/><line x1="-12" y1="-12" x2="12" y2="-12" stroke="#9AA" stroke-width="3"/><line x1="-12" y1="2" x2="8" y2="2" stroke="#9AA" stroke-width="3"/>${bright > 0.5 ? zStar(20, -30, 9, '#fff', 0) : ''}</g>`; }
  let over = '';
  if (lt < tU) { const k = easeOutBack(qdK(0.1, 0.5, lt)) * (1 - qdK(tU - 0.3, tU, lt)); h += `<g transform="translate(960 520) scale(${f1(k * 1000) / 1000})"><rect x="-150" y="-230" width="300" height="440" rx="140" fill="${QW_GOLD}" stroke="${INK}" stroke-width="10"/><rect x="-128" y="-208" width="256" height="396" rx="120" fill="#CFC8F5" stroke="${INK}" stroke-width="7"/><path d="M-90 -150 L-20 -190 L-110 0 Z" fill="#fff" opacity=".4"/><rect x="-50" y="208" width="100" height="24" rx="8" fill="#C08A2E" stroke="${INK}" stroke-width="6"/>${fT(0, 30, '거울', 96, '#2B2B55')}</g>`; }
  if (lt > tU - 0.3 && lt < t91 - 0.3) over += pop(t, t - lt + tU - 0.3, t - lt + t91 - 0.3, 960, 150, label(0, 0, '2020년 · 걱정이 많은 대학생들 · 열흘 동안 기록', { size: 44, bg: '#fff' }), { rot: -2, bob: 3 });
  if (lt > t91 - 0.2) { const n = Math.round(91 * easeOut(qdK(t91 - 0.2, t91 + 0.8, lt))); over += pop(t, t - lt + t91 - 0.2, t + 99, 960, 170, outlined(0, 0, [`걱정의 ${n}%는 일어나지 않았다`], { size: 72, sw: 15, fill: '#FFE9A8' }), { rot: -2 }); }
  if (lt > t3) over += pop(t, t - lt + t3, t + 99, 960, 900, label(0, 0, '일어난 걱정도 열에 셋은 예상보다 괜찮았다', { size: 46, bg: '#FFF2A8' }), { rot: -2, bob: 3 });
  return qwDefs() + qCam(qLerpCam(lt / D, [960, 540, 1.0], [960, 550, 1.05]), h) + over;
}
/* ---------- 10. 거울 속 기억: 학예회 날 → 밤마다 ---------- */
function qwBedPanel(x, y, t, lbl, k) { if (k <= 0) return '';
  let h = `<g transform="translate(${x} ${y}) scale(${f1(easeOutBack(k) * 1000) / 1000})"><rect x="-250" y="-270" width="500" height="540" rx="34" fill="#5560B8" stroke="${QW_GOLD}" stroke-width="10"/>`;
  h += `<rect x="-200" y="-220" width="130" height="110" rx="8" fill="#39428F" stroke="${INK}" stroke-width="5"/>${zStar(-160, -180, 8, '#fff', 0)}${zStar(-110, -150, 6, '#fff', 0)}`;
  h += `<rect x="-220" y="60" width="330" height="150" rx="20" fill="#DDE3F5" stroke="${INK}" stroke-width="7"/><ellipse cx="-130" cy="70" rx="80" ry="34" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="-130" cy="40" r="56" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-156 44 q10 8 20 0 M-120 44 q10 8 20 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-70 90 Q20 60 110 96 L110 210 L-220 210 L-220 110 Z" fill="#8FA3E0" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  h += qwGuard(170, 216, 0.72, t, { eyes: 'wide', look: [-0.8, 0], calm: true, noBell: false, seed: x });
  return h + label(0, -310, lbl, { size: 38, bg: '#fff' }) + `</g>`; }
function qwmemoryScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 8;
  let h = '', over = '';
  if (ph === 0) { const tG = fAt(a, '그날부터', D * 0.45), born = qdK(tG, tG + 0.7, lt), tC = fAt(a, '다시는', D * 0.8);
    h += `<rect x="-400" y="-300" width="2800" height="1700" fill="#8377D2"/><rect x="-400" y="820" width="2800" height="600" fill="#C99A62"/><line x1="-400" y1="820" x2="2400" y2="820" stroke="${INK}" stroke-width="8"/>`;
    h += `<path d="M-100 -100 L420 -100 Q340 400 420 860 L-100 860 Z" fill="#C2434F" stroke="${INK}" stroke-width="8"/><path d="M2020 -100 L1500 -100 Q1580 400 1500 860 L2020 860 Z" fill="#C2434F" stroke="${INK}" stroke-width="8"/><rect x="-100" y="-100" width="2120" height="120" fill="#A8323E" stroke="${INK}" stroke-width="8"/>`;
    h += `<path d="M860 20 L560 900 L1160 900 Z" fill="#FFF6D0" opacity=".35"/>`;
    const x = 860, y = 900, s = 0.62, top = ptOf(x, y, s, 200, 78);
    h += Z({ x, y, s, t, pose: '서기', ex: fEx('z울먹'), look: [0, 0.5], seed: 3, vest: '#7FD1B9' });
    h += `<path d="M${top[0] - 44} ${top[1] + 14} L${top[0] - 44} ${top[1] - 26} L${top[0] - 20} ${top[1] - 4} L${top[0]} ${top[1] - 34} L${top[0] + 20} ${top[1] - 4} L${top[0] + 44} ${top[1] - 26} L${top[0] + 44} ${top[1] + 14} Z" fill="#FFE27A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    for (let i = 0; i < 4; i++) { const k = ((t * 1.3 + i / 4) % 1), eye = ptOf(x, y, s, i % 2 ? 228 : 172, 190); h += `<path d="M${f1(eye[0])} ${f1(eye[1] + k * 90)} q7 12 0 18 q-7 -6 0 -18Z" fill="#9ED8FF" stroke="${INK}" stroke-width="3" opacity="${f1((1 - k) * 100) / 100}"/>`; }
    if (born > 0) { const c = ptOf(x, y, s, 214, 318), gx = lerp(c[0], 1080, born), gy = lerp(c[1], 900, born) - Math.sin(born * Math.PI) * 120;
      h += `<circle cx="${f1(gx - 50)}" cy="${f1(gy - 40)}" r="${f1(born * (260 + 120 * qdK(tC, tC + 1, lt)))}" fill="url(#qwLamp)" opacity=".8"/>` + qwGuard(gx, gy, 0.55 * lerp(0.3, 1, born), t, { eyes: 'wide', look: [-0.8, -0.3], calm: true });
      if (born >= 1) over += pop(t, t - lt + tG + 0.7, t + 99, 1340, 300, label(0, 0, '그날 밤, 처음 켠 등불', { size: 42, bg: '#FFF2C2' }), { rot: -3, bob: 3 }); }
    over += pop(t, t - lt + 0.3, t - lt + tG, 960, 150, label(0, 0, '초등학교 학예회 날', { size: 44, bg: '#fff' }), { rot: -2, bob: 3 });
  } else {
    h += `<rect x="-400" y="-300" width="2800" height="1700" fill="#7D74D0"/><rect x="-400" y="-300" width="2800" height="1700" fill="url(#qwDark)" opacity=".5"/>`;
    ['시험 전날 밤', '면접 전날 밤', '입사 전날 밤'].forEach((lb, i) => { h += qwBedPanel(380 + i * 580, 510, t, lb, qdK(0.2 + i * D * 0.2, 0.6 + i * D * 0.2, lt)); });
    const tA = fAt(a, '혼자', D * 0.75); if (lt > tA) over += pop(t, t - lt + tA, t + 99, 960, 868, outlined(0, 0, ['한 번도 쉬지 않고, 혼자'], { size: 56, sw: 12, fill: '#FFE9A8' }), { rot: -2 });
  }
  const frame = `<rect x="14" y="14" width="1892" height="1052" rx="70" fill="none" stroke="${QW_GOLD}" stroke-width="30"/><rect x="14" y="14" width="1892" height="1052" rx="70" fill="none" stroke="${INK}" stroke-width="6"/>`;
  return qwDefs() + qCam(qLerpCam(lt / D, [960, 540, 1.0], [960, 550, 1.06]), h) + frame + over;
}
/* ---------- 11. 경비 일지(노트 클로즈업) ---------- */
function qwJournalPage(lt) {
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#5A4A44"/><g transform="translate(960 560) rotate(2)"><rect x="-560" y="-470" width="1120" height="1000" rx="14" fill="#FBF7EE" stroke="${INK}" stroke-width="9"/>`;
  for (let i = 0; i < 12; i++) h += `<line x1="-500" y1="${-372 + i * 72}" x2="500" y2="${-372 + i * 72}" stroke="#C9D6E8" stroke-width="3"/>`;
  h += fT(0, -384, '경비 일지', 64, '#2B2B55');
  const items = ['· 세 번째 장 숫자가 틀리면?', '· 질문에 대답을 못 하면?', '· 팀장님 표정이 굳으면?'];
  items.forEach((s, i) => { const n = Math.floor(clamp((lt - 0.3 - i * 0.75) * 26, 0, s.length)); if (n > 0) h += fT(-470, -242 + i * 144, s.slice(0, n), 50, '#2B2B55', { anchor: 'start' }); });
  if (lt > 2.6) { const k = easeOutBack(qdK(2.6, 3.0, lt)); h += `<g transform="translate(0 330) scale(${f1(k * 1000) / 1000})"><rect x="-330" y="-52" width="660" height="92" rx="14" fill="#FFE27A" stroke="${INK}" stroke-width="6"/>${fT(0, 14, '확인할 날: 금요일', 56, '#2B2B55')}</g>`; }
  return h + `</g>`;
}
/* ---------- 12. 회의실 문 앞 ---------- */
const QDR = { fy: 960, dx: 1300, zx: 880 };
function qwCorridor(t, open = 0) { const { dx } = QDR;
  let h = `<rect x="-2000" y="-1500" width="6000" height="2500" fill="#EFEAF8"/><rect x="-2000" y="940" width="6000" height="900" fill="#D9CBAE"/><rect x="-2000" y="900" width="6000" height="40" fill="#CFC6E6" stroke="${INK}" stroke-width="5"/>`;
  h += `<rect x="120" y="220" width="420" height="460" rx="8" fill="#FFF3C4" stroke="${INK}" stroke-width="8"/><line x1="330" y1="220" x2="330" y2="680" stroke="${INK}" stroke-width="6"/><line x1="120" y1="450" x2="540" y2="450" stroke="${INK}" stroke-width="6"/><path d="M120 680 L540 680 L900 1100 L300 1100 Z" fill="#FFF3C4" opacity=".45"/>`;
  h += `<rect x="${dx - 180}" y="250" width="360" height="690" fill="#FFF6D0" stroke="${INK}" stroke-width="10"/>`;
  if (open > 0) h += `<circle cx="${dx}" cy="600" r="${f1(open * 1500)}" fill="url(#qwLamp)" opacity="${f1(open * 100) / 100}"/>`;
  h += `<g transform="translate(${dx + 170} 0) scale(${f1(1 - open * 0.8)} 1)"><rect x="-340" y="260" width="340" height="680" fill="#B98556" stroke="${INK}" stroke-width="9"/><rect x="-250" y="330" width="160" height="230" rx="6" fill="#D8ECF7" stroke="${INK}" stroke-width="6"/><rect x="-322" y="610" width="46" height="16" rx="6" fill="#DADADA" stroke="${INK}" stroke-width="5"/></g>`;
  h += `<rect x="${dx + 230}" y="420" width="130" height="64" rx="8" fill="#fff" stroke="${INK}" stroke-width="6"/>${fT(dx + 295, 464, '회의실', 32, '#2B2B55')}`;
  h += `<g transform="translate(1760 940)"><path d="M-44 0 L-34 -90 L34 -90 L44 0 Z" fill="#C97B5A" stroke="${INK}" stroke-width="7"/><path d="M0 -90 Q-70 -220 -30 -300 M0 -90 Q10 -240 60 -290 M0 -90 Q-10 -200 0 -340" fill="none" stroke="#3E8E6E" stroke-width="16" stroke-linecap="round"/></g>`;
  return h; }
function qwdoorScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 3, FY = QDR.fy, s = 0.9;
  let zx = QDR.zx, pose = '서기', ex = fEx('z기본'), look = [0.9, 0], cam = [960, 600, 1.0], over = '', open = 0, extra = '', whiteOut = 0, bob = 0;
  const chest = (x) => ptOf(x, FY, s, 226, 322);
  if (ph === 0) { const tP = fAt(a, '셔츠', D * 0.6); const zk = easeInOut(qdK(tP - 0.2, tP + 0.9, lt)), c = chest(zx); cam = [lerp(1000, c[0], zk), lerp(600, c[1], zk), lerp(1.0, 3.0, zk)]; ex = fEx('z기본');
    over += pop(t, t - lt + 0.2, t - lt + tP, 400, 150, label(0, 0, '월요일 아침 9:55', { size: 46, bg: '#BFE6FF' }), { rot: -4, bob: 2 }); }
  if (ph === 1) { const c = chest(zx); if (lt < 1.8) { cam = [c[0], c[1], 3.0]; const tap = lt > 0.9 ? Math.max(0, Math.sin((lt - 0.9) * 14)) * qdK(0.9, 1.0, lt) * (1 - qdK(1.55, 1.7, lt)) : 0;
        if (lt > 0.8) pose = Object.assign({}, P['서기'], { armR: [[252, 285], [296, 336], [250 - tap * 6, 330]], hR: [246 - tap * 8, 330] });
        if (lt > 0.25 && lt < 0.95) { extra += qwRings(c[0], c[1] + 4, (lt - 0.25) * 0.9, { n: 1, speed: 1, R: 60 }); over += qdFx(t, lt, 0.25, 1.0, 1300, 380, '땡', '#F5C451', { size: 44 }); }
        ex = fEx(lt > 0.5 ? 'z빵긋' : 'z결심'); look = [0.3, 0.8]; }
      else { const k = easeInOut(qdK(1.8, 2.6, lt)); zx = lerp(QDR.zx, 1000, k); cam = qLerpCam((lt - 1.8) / 1.2, [1000, 620, 1.3], [1060, 620, 1.4]); bob = -Math.abs(Math.sin(k * Math.PI * 2)) * 14;
        pose = Object.assign({}, P['서기'], { armR: [[252, 285], [lerp(296, 300, k), lerp(336, 250, k)], [lerp(250, 340, k), lerp(330, 196, k)]], hR: [lerp(246, 348, k), lerp(330, 190, k)] }); ex = fEx('z결심'); } }
  if (ph === 2) { zx = 1000; open = easeInOut(qdK(0.5, 2.2, lt)); cam = qLerpCam(lt / D, [1060, 620, 1.4], [1160, 600, 1.15]); const dn = easeInOut(qdK(0.9, 1.7, lt)); pose = Object.assign({}, P['서기'], { armR: [[252, 285], [lerp(300, 278, dn), lerp(250, 345, dn)], [lerp(340, 284, dn), lerp(196, 398, dn)]], hR: [lerp(348, 286, dn), lerp(190, 406, dn)] }); ex = fEx(open > 0.4 ? 'z반짝' : 'z결심'); whiteOut = qdK(D - 1.0, D, lt); }
  let w = qwCorridor(t, open);
  w += `<ellipse cx="${f1(zx)}" cy="${FY + 8}" rx="76" ry="13" fill="#6B5E48" opacity=".3"/>` + Z({ x: zx, y: FY + bob, s, t, pose, ex, look, seed: 3, vest: '#F7F7FA', vshade: 'rgba(60,70,120,0.15)', collar: true, tie: '#3E6FB8' });
  const c = chest(zx); w += `<g transform="translate(${f1(c[0])} ${f1(c[1] + bob)})"><path d="M-13 -22 L11 -26 L13 -6 L-11 -4 Z" fill="#FFF2A8" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><rect x="-18" y="-10" width="36" height="34" rx="5" fill="#F0F0F6" stroke="${INK}" stroke-width="4"/></g>` + extra;
  return qwDefs() + qCam(cam, w) + over + `<rect x="-100" y="-100" width="2200" height="1400" fill="#FFF6D0" opacity="${f1(whiteOut * 100) / 100}"/>`;
}
/* ---------- 13. 마지막 질문 ---------- */
function qwendScene(t, lt, a) {
  const D = a._dur || 4.6, k = qdK(0.2, 0.9, lt), out = qdK(D - 0.7, D, lt);
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#3F4AA6"/><rect x="-400" y="-300" width="2800" height="1700" fill="url(#qwDark)" opacity=".8"/>`;
  h += `<g opacity="${f1(k * 100) / 100}">${outlined(960, 330, ['당신 안의 걱정이는,', '오늘 무엇을 지키려고 종을 쳤나요?'], { size: 74, sw: 15, fill: '#fff' })}</g>`;
  h += qwGuard(900, 880, 1.5, t, { eyes: 'shut', calm: true, noBell: true, look: [0, 0] }) + qwBellObj(1080, 880, 1.5);
  for (let i = 0; i < 2; i++) { const kk = (lt * 0.5 + i / 2) % 1; h += `<g opacity="${f1(Math.sin(kk * Math.PI) * 100) / 100}">${fT(1010 + kk * 50, 640 - kk * 90, 'z', 36 + i * 8, '#fff', { stroke: INK, sw: 6 })}</g>`; }
  return qwDefs() + h + `<rect x="-100" y="-100" width="2200" height="1400" fill="#0B1030" opacity="${f1(out * 100) / 100}"/>`;
}
