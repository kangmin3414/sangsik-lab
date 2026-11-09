/* 쇼펜하우어 편 — 1막~열린 결말. sscenes.js 다음에 불러온다. 이름은 s 접두사(장면)·sv 접두사(도구).
   물리 규칙: 앉는 건 직접 그린 판 위에 L자로, 꼬르륵이는 딛는 곳 위에, 소품·카드가 얼굴을 가리지 않게. */
Object.assign(QBG, { clocktower: 'ai/clocktower.png', beach: 'ai/beach.png', lecture: 'ai/lecture.png', frankfurt: 'ai/frankfurt.png', river: 'ai/river.png', living2: 'ai/living2.png' });
const SV = ['spend', 'sweek', 'ssunday', 'sbuy', 'ssea', 'szen', 'swheel', 'sclue', 'shegel', 'spoodle', 'sflute', 'sriver', 'sixion', 'sboxes', 'swalk', 'snight', 'send'];
SV.forEach(k => CAMS[k] = 'fixed');
const svSitY = (seat, s = 1) => seat - 12 * s + 148 * s;        // L자로 앉을 때 원점 y (엉덩이가 seat 위)
const svCard = (t, lt, t0, x, y, big, sub, col) => fCard(t, lt, t0, x, y, big, sub, col);
P['sv바닥'] = Object.assign({}, P['f앉기'], { legL: [[188, 412], [292, 416], [384, 420]], fL: [402, 410, -70], legR: [[212, 410], [300, 412], [392, 414]], fR: [410, 402, -70] }); // 바닥에 다리 뻗고
P['sv양반'] = Object.assign({}, P['서기'], { armL: [[148, 285], [118, 372], [112, 432]], hL: [110, 436], armR: [[252, 285], [282, 372], [288, 432]], hR: [290, 436], legL: [[188, 412], [104, 440], [224, 456]], fL: [236, 456, 0], legR: [[212, 412], [296, 440], [176, 456]], fR: [164, 456, 0], dy: 0 }); // 양반다리: 정강이가 방석 위
const SV_PHONE_SIT = Object.assign({}, P['f앉기'], { armL: [[148, 285], [146, 350], [182, 356]], hL: [186, 354], armR: [[252, 285], [254, 350], [218, 356]], hR: [214, 354] });
const svShoeHand = (x, y, s, lx, ly, o = {}) => { const [hx, hy] = ptOf(x, y, s, lx, ly); return soShoe(hx, hy + 10 * s, 0.75 * s, o); };

/* ---------- 1막: 시계추 ---------- */
const PEND = { px: 960, py: -80, L: 900, A: 0.42, T: 3.2 };
const SV_SEAT = 650; // 막대 위 앉는 판 높이(막대 로컬). 판은 핀에 매달려 늘 수평을 유지하고, 발은 추보다 위에 있다.
const svTheta = t => PEND.A * Math.sin(2 * Math.PI * t / PEND.T);
function svPendulum(t, th, o = {}) { // 시계추 + 그네처럼 매달린 판 위에 앉은 제로와 꼬르륵이 (o.zero, o.kko는 자세·표정)
  const { px, py, L } = PEND, S = SV_SEAT, deg = -th * 180 / Math.PI, zx = 10; // th<0 → 왼쪽(고통), th>0 → 오른쪽(권태)
  let g = `<line x1="0" y1="0" x2="0" y2="${L}" stroke="#7A5A2A" stroke-width="26" stroke-linecap="round"/><line x1="0" y1="0" x2="0" y2="${L}" stroke="#E8B84A" stroke-width="14"/>`;
  g += `<circle cx="0" cy="${L + 40}" r="100" fill="#E8B84A" stroke="${INK}" stroke-width="10"/><circle cx="-30" cy="${L + 6}" r="22" fill="#fff" opacity=".4"/><circle cx="0" cy="${L + 40}" r="58" fill="none" stroke="#C9952E" stroke-width="8"/>`;
  let seat = `<path d="M-12 ${S - 34} L-12 ${S} M12 ${S - 34} L12 ${S}" stroke="${INK}" stroke-width="7"/><rect x="-210" y="${S}" width="380" height="26" rx="12" fill="#B5845A" stroke="${INK}" stroke-width="8"/>`;
  if (o.kko) seat += soKko(t, Object.assign({ x: -150, y: S, s: 0.72 }, o.kko));
  seat += Z(Object.assign({ x: zx, y: svSitY(S), s: 1, t, pose: P['f앉기'], seed: 3 }, o.zero || {}));
  if (o.shoe) seat += svShoeHand(zx, svSitY(S), 1, 360, 232);
  g += `<g transform="rotate(${f1(-deg)} 0 ${S - 34})">${seat}</g><circle cx="0" cy="${S - 34}" r="11" fill="#7A5A2A" stroke="${INK}" stroke-width="5"/>`;
  return `<g transform="translate(${px} ${py}) rotate(${f1(deg)})"><circle r="30" fill="#7A5A2A" stroke="${INK}" stroke-width="8"/>${g}</g>`; }
const svSign = (x, y, a, b, c, on = 1) => `<g transform="translate(${x} ${y})" opacity="${f1(on * 100) / 100}"><line x1="0" y1="-260" x2="0" y2="0" stroke="${INK}" stroke-width="6"/><rect x="-140" y="0" width="280" height="130" rx="18" fill="${c}" stroke="${INK}" stroke-width="8"/>${fT(0, 58, a, 50, '#fff', { stroke: INK, sw: 8 })}${fT(0, 104, b, 30, '#fff', { stroke: INK, sw: 6, w: 700 })}</g>`;
// 진열장: 바닥(floor)부터 받침대가 올라오고, 그 위 유리 상자 안에 운동화
function svCase(x, floor, top) { return `<rect x="${x - 70}" y="${top}" width="140" height="${floor - top}" fill="#8E6A48" stroke="${INK}" stroke-width="8"/><rect x="${x - 100}" y="${top - 16}" width="200" height="22" rx="6" fill="#A9825E" stroke="${INK}" stroke-width="7"/><rect x="${x - 110}" y="${top - 196}" width="220" height="180" rx="10" fill="#DDF3FF" opacity=".55" stroke="${INK}" stroke-width="8"/>` + soShoe(x, top - 28, 1.2, { c: '#FF8FB1', ac: '#FFD23F', shine: 0.8 }) + `<path d="M${x - 92} ${top - 178} l40 0 M${x - 92} ${top - 163} l20 0" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`; }
function spendScene(t, lt, a) {
  const ph = a.ph; let th = svTheta(t), cam = [960, 520, 0.95], zero = {}, kko = {}, shoe = false, over = '', w = '', dim = 0;
  const tP = fAt(a, '고통', 2.6), tB = fAt(a, '권태', 3.4);
  const mood = th2 => { const k = th2 / PEND.A; return { ex: fEx(k < -0.55 ? 'z울먹' : k > 0.55 ? 'z멍' : 'z빵긋'), puff: k < 0 ? 1 - 0.5 * k : 1 - 0.3 * k }; };
  if (ph === 1) { const m = mood(th); zero = { ex: m.ex, look: [-th * 2, 0.2] }; kko = { puff: m.puff, eyes: th < -0.25 ? 'heart' : th > 0.25 ? 'shut' : 'norm', mouth: th > 0.25 ? 'o' : 'grin' }; }
  if (ph === 2) { th = -PEND.A + Math.sin(t * 9) * 0.01; cam = qLerpCam(lt / 0.8, [960, 520, 0.95], [600, 480, 1.2]);
    zero = { ex: exprAt([[0, 'z결심'], [0.8, 'z울먹']], lt), look: [-0.9, -0.1], pose: Object.assign({}, P['f앉기'], { armL: [[148, 285], [90, 262], [36, 246]], hL: [32, 244] }) };
    kko = { puff: 1.2 + 0.3 * clamp(lt / 1.5, 0, 1), eyes: 'heart', mouth: 'grin', drool: true, rumble: 1, arms: 'point', look: [-0.9, -0.3] }; }
  if (ph === 3) { const k = easeInOut(clamp(lt / 0.7, 0, 1)); th = lerp(-PEND.A, PEND.A, k) + (k >= 1 ? Math.sin(t * 9) * 0.01 : 0); cam = qLerpCam(k, [600, 480, 1.2], [1260, 480, 1.2]);
    shoe = k > 0.6; zero = { ex: exprAt([[0, 'z반짝'], [1.2, 'z멍'], [2.0, 'z하품']], lt), look: [0.3, -0.5], pose: shoe ? Object.assign({}, P['f앉기'], { armR: [[252, 285], [316, 262], [356, 236]], hR: [360, 232] }) : P['f앉기'] };
    kko = { puff: lerp(1.4, 0.72, clamp((lt - 0.6) / 1.0, 0, 1)), eyes: lt > 1.4 ? 'shut' : 'norm', mouth: lt > 1.6 ? 'o' : 'smile' }; }
  if (ph >= 4) { const m = mood(th); zero = { ex: m.ex, look: [-th * 2, 0.2] }; kko = { puff: m.puff, eyes: th < -0.25 ? 'heart' : th > 0.25 ? 'shut' : 'norm', mouth: th > 0.25 ? 'o' : 'grin' }; cam = [960, 520, 1.0]; }
  if (ph === 5) { // 맨 아래에서 1초 슬로 모션 → 휙
    const slow = clamp((lt - 0.2) / 1.2, 0, 1), tt = lt < 0.2 ? 0 : lt < 1.4 ? 0.05 * slow : 0.06 + (lt - 1.4) * 1.6;
    th = PEND.A * Math.sin(2 * Math.PI * tt / PEND.T); const m = mood(th); zero = { ex: m.ex, look: [0, 0.2] }; kko.puff = m.puff; }
  if (ph === 6) { th = 0.28 * Math.sin(2 * Math.PI * t / 4.2); cam = qLerpCam(lt / 4, [960, 520, 1.0], [960, 540, 1.2]); dim = 0.3;
    zero = { ex: fEx('z멍'), sy: 0.94, look: [0, 0.4] }; kko = { puff: 0.9, eyes: 'shut', mouth: 'smile', still: true }; }
  // 바닥 "행복" 표시와 양 끝 팻말
  const near = Math.exp(-Math.pow(th / 0.1, 2));
  w += svSign(250, 300, '고통', '갖고 싶다', '#E5484D', ph === 1 ? clamp((lt - tP + 0.3) / 0.3, 0, 1) : 1) + svSign(1670, 300, '권태', '심심하다', '#8A8F99', ph === 1 ? clamp((lt - tB + 0.3) / 0.3, 0, 1) : 1);
  if (ph === 2) w += svCase(420, 1000, 470);
  if (ph >= 4 && ph !== 6) { const glow = ph === 5 && lt > 0.2 && lt < 1.4 ? 1 : near; w += `<g opacity="${f1(clamp(glow, 0, 1) * 100) / 100}">${rSparks(960, 860, t, 8, 150, '#FFE34D')}</g>`; }
  w += svPendulum(t, th, { zero, kko, shoe });
  if (ph >= 4 && ph !== 6) { const glow = ph === 5 && lt > 0.2 && lt < 1.4 ? 1 : near; w += `<g opacity="${f1(clamp(glow, 0, 1) * 100) / 100}">${fT(960, 882, '행복', 60, '#fff', { stroke: '#C9952E', sw: 10 })}</g>`; }
  if (ph === 4) { const tH = fAt(a, '행복', 1.0), tS = fAt(a, '멈춘', 4.8); if (lt > tS - 0.2) over += svCard(t, lt, tS - 0.2, 960, 200, '행복 = 아픔이 멈춘 순간', '『의지와 표상으로서의 세계』 §58', '#FFE34D'); }
  if (ph === 5 && lt > 1.4 && lt < 2.0) over += fx(t, t - lt + 1.4, t + 9, 960, 300, '휙!', '#fff', { size: 80 });
  if (ph === 1 && lt > 0.3) over += svCard(t, lt, fAt(a, '인생은', 1.8), 960, 160, '인생은 시계추', '고통 ↔ 권태', '#E8B84A');
  return fPlate('clocktower', cam, 0.4) + qCam(cam, w) + fFull('#0A1238', dim) + over;
}
// 달력: 평일 엿새는 결핍, 일요일은 권태
function sweekScene(t, lt, a) {
  const tW = fAt(a, '평일', 2.4), tS = fAt(a, '일요일', 4.6), cam = qLerpCam(lt / 6, [960, 560, 1.0], [960, 560, 1.05]);
  let h = `<rect x="-300" y="-200" width="2600" height="1500" fill="#F3EEE3"/><rect x="-300" y="-200" width="2600" height="1500" fill="url(#paper)"/>`;
  const days = ['월', '화', '수', '목', '금', '토', '일'], x0 = 230, cw = 205, y0 = 330;
  h += `<rect x="${x0 - 30}" y="${y0 - 150}" width="${cw * 7 + 60}" height="560" rx="24" fill="#fff" stroke="${INK}" stroke-width="9"/><rect x="${x0 - 30}" y="${y0 - 150}" width="${cw * 7 + 60}" height="70" rx="24" fill="#E5484D" stroke="${INK}" stroke-width="9"/>` + fT(960, y0 - 100, '이번 주', 44, '#fff');
  days.forEach((d, i) => { const x = x0 + i * cw, sun = i === 6;
    h += `<rect x="${x}" y="${y0 - 60}" width="${cw - 14}" height="380" rx="14" fill="${sun ? '#F3F4F8' : '#FFF8F0'}" stroke="${INK}" stroke-width="5"/>${fT(x + (cw - 14) / 2, y0 - 10, d, 44, sun ? '#E5484D' : INK)}`;
    // 칸 안 그림: 평일은 출근하는 작은 제로, 일요일은 누워서 폰
    h += sun ? `<g transform="translate(${x + 95} ${y0 + 150})"><rect x="-70" y="-14" width="140" height="28" rx="12" fill="#9FC7F0" stroke="${INK}" stroke-width="4"/><circle cx="-58" cy="-30" r="22" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M-66 -32 l6 0 M-54 -32 l6 0" stroke="${INK}" stroke-width="3"/><rect x="-40" y="-56" width="18" height="30" rx="4" fill="#1F2D44"/></g>`
      : `<g transform="translate(${x + 95} ${y0 + 170})"><circle cx="0" cy="-70" r="24" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M-8 -66 q8 -6 16 0" stroke="${INK}" stroke-width="3" fill="none"/><rect x="-18" y="-46" width="36" height="44" rx="6" fill="#FF9A55" stroke="${INK}" stroke-width="4"/><line x1="-8" y1="-2" x2="-12" y2="30" stroke="${INK}" stroke-width="4"/><line x1="8" y1="-2" x2="12" y2="30" stroke="${INK}" stroke-width="4"/><rect x="22" y="-40" width="30" height="24" rx="4" fill="#5B6478"/></g>`;
    const t0 = sun ? tS : tW + i * 0.22; if (lt > t0) h += pop(t, t - lt + t0, t + 99, x + 95, y0 + 260, `<g transform="rotate(${sun ? 8 : -8})"><rect x="-74" y="-34" width="148" height="68" rx="10" fill="none" stroke="${sun ? '#6E7480' : '#E5484D'}" stroke-width="7"/>${fT(0, 16, sun ? '권태' : '결핍', 40, sun ? '#6E7480' : '#E5484D')}</g>`, {}); });
  h += fT(960, 860, '"평범한 삶에서 권태는 일요일이, 결핍은 나머지 엿새가 대표한다"', 32, '#5B6478', { w: 700 }) + fT(960, 910, '— 『의지와 표상으로서의 세계』 §57', 26, '#9AA1AE', { w: 700 });
  h += soKko(t, { x: 1600, y: y0 - 150, s: 0.7, eyes: lt > tS ? 'shut' : 'norm', mouth: lt > tS ? 'o' : 'smile', look: [-0.8, 0.3] });
  return qCam(cam, h);
}
// 일요일 오후: 바닥에 앉아 폰만
function ssundayScene(t, lt, a) {
  const tW = fAt(a, '주말', 0.2), tS = fAt(a, '일요일', 2.6), tP = fAt(a, '폰만', 4.6), cam = qLerpCam(lt / 6, [960, 700, 1.25], [980, 720, 1.35]);
  const x = 880, floor = 1000, y = floor + 140;
  let w = `<ellipse cx="${x + 30}" cy="${floor - 6}" rx="230" ry="34" fill="#E8A87C" stroke="${INK}" stroke-width="7"/>`;
  const rush = lt < tS ? 1 : 0;
  w += Z({ x, y: floor + 130, s: 1, t, pose: Object.assign({}, P['sv바닥'], { armL: SV_PHONE_SIT.armL, hL: SV_PHONE_SIT.hL, armR: SV_PHONE_SIT.armR, hR: SV_PHONE_SIT.hR }), ex: exprAt([[0, 'z설렘'], [tS, 'z기본'], [tP, 'z멍']], lt), look: [0, 0.8], seed: 3 }) + phone(x, floor + 130 - 216, 0.4, { on: true, glow: 0.4 });
  w += soKko(t, { x: x - 250, y: floor - 20, s: 0.75, eyes: lt > tP ? 'shut' : 'norm', mouth: lt > tP ? 'o' : 'smile', look: [0.6, 0.2] });
  // 벽시계(바늘이 빙글빙글)와 달력(금→토→일)
  const cx = 1460, cy = 470, sp = lt * (lt > tS ? 9 : 2);
  w += `<circle cx="${cx}" cy="${cy}" r="90" fill="#fff" stroke="${INK}" stroke-width="9"/><line x1="${cx}" y1="${cy}" x2="${f1(cx + Math.sin(sp) * 60)}" y2="${f1(cy - Math.cos(sp) * 60)}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><line x1="${cx}" y1="${cy}" x2="${f1(cx + Math.sin(sp / 12) * 40)}" y2="${f1(cy - Math.cos(sp / 12) * 40)}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>`;
  const dayIdx = lt < tW + 0.6 ? 0 : lt < tS ? 1 : 2, dn = ['금', '토', '일'][dayIdx];
  w += `<g transform="translate(470 460)"><rect x="-90" y="-100" width="180" height="200" rx="12" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="-90" y="-100" width="180" height="50" rx="12" fill="#E5484D" stroke="${INK}" stroke-width="8"/>${fT(0, 60, dn, 90, dayIdx === 2 ? '#E5484D' : INK)}</g>`;
  if (lt > tP) w += `<g transform="translate(${x + 250} ${floor - 520})">${bubble(0, 0, 200, 110, fT(0, 18, '심심…', 44, '#5B6478'), {})}</g>`;
  return fPlate('living2', cam, 0.55) + qCam(cam, w) + fFull('#FFD9A0', 0.08);
}

/* ---------- 2막 ---------- */
// 더 빨리 다음 걸: 택배 상자 탑 + 장바구니 연타 + 점점 빨라지는 작은 시계추
function sbuyScene(t, lt, a) {
  const D = a._dur || 7, tC = fAt(a, '택배', D * 0.55), cam = qLerpCam(lt / D, [1000, 660, 1.2], [1060, 640, 1.28]), x = SOZ.x, y = SOZ.y;
  const n = Math.min(9, Math.floor(clamp(lt / D, 0, 1) * 10)), tap = Math.floor(t * (lt > tC ? 14 : 7)) % 2;
  let w = soCabinet(1, soShoe(CAB_SNEAKER[0], CAB_SNEAKER[1], 0.62, { dust: 1 }));
  for (let i = 0; i < n; i++) { const fresh = i === n - 1 ? easeOutBack(clamp((lt - (i + 1) * D / 10) / 0.3, 0, 1)) : 1, by = y - i * 74 - (1 - fresh) * 400; w += `<g transform="translate(${560 + (i % 2) * 14} ${f1(by)})"><rect x="-90" y="-72" width="180" height="72" fill="#C8955E" stroke="${INK}" stroke-width="6"/><path d="M-90 -40 L90 -40" stroke="#E8C79A" stroke-width="10"/></g>`; }
  w += qShadow(x, y, 66) + Z({ x, y, s: 1, t, pose: Object.assign({}, PHONE_LOOK, { hR: [212, 322 - tap * 8], armR: [[252, 285], [254, 346], [216, 326 - tap * 8]] }), ex: exprAt([[0, 'z결심'], [tC, 'z당황'], [D - 1.6, 'z멘붕']], lt), look: [0.1, 0.8], seed: 3 }) + phone(x, y - 236, 0.36, { on: true, glow: 0.5 });
  w += soKko(t, { x: KKO_ON[0], y: KKO_ON[1], puff: 1.05 + 0.25 * Math.abs(Math.sin(lt * 2.2)), eyes: 'heart', mouth: 'grin', drool: true, arms: 'up', look: [-0.6, -0.2] });
  if (tap && lt > 0.3) w += fT(x + 170, y - 170 - (t * 300) % 40, '담기!', 30, '#E5484D', { stroke: '#fff', sw: 6 });
  // 작은 시계추(오른쪽 위): 점점 빨라진다
  const sp = 1 + 2.5 * clamp(lt / D, 0, 1), th = 0.6 * Math.sin(lt * 2.2 * sp * sp);
  let over = `<g transform="translate(1660 120)"><rect x="-120" y="-70" width="240" height="330" rx="24" fill="#FFFDF6" stroke="${INK}" stroke-width="6" opacity=".95"/><g transform="rotate(${f1(th * 57.3)})"><line x1="0" y1="-40" x2="0" y2="170" stroke="#B08A50" stroke-width="10"/><circle cx="0" cy="190" r="32" fill="#E8B84A" stroke="${INK}" stroke-width="6"/></g><circle cx="0" cy="-40" r="10" fill="${INK}"/></g>`;
  if (lt > D - 1.6) over += fx(t, t - lt + D - 1.6, t + 9, 820, 260, '@_@', '#fff', { size: 60 });
  return fPlate('genkan', cam, 0.55) + qCam(cam, w) + over;
}
// 바닷물: 마실수록 목마르고, 꼬르륵이는 커진다
function sseaScene(t, lt, a) {
  const ph = a.ph, x = 760, y = 1000, cam = ph === 1 ? qLerpCam(lt / 8, [960, 620, 1.15], [1000, 600, 1.2]) : [1000, 600, 1.2];
  const tQ = fAt(a, '부는', 3.2), sips = ph === 1 ? [0.6, 2.6, 5.0].filter(s0 => s0 < lt) : [0, 1, 2], nS = sips.length;
  const drinking = ph === 1 && sips.some(s0 => lt > s0 && lt < s0 + 0.6);
  const pose = drinking ? Object.assign({}, P['서기'], { armR: [[252, 285], [300, 300], [240, 266]], hR: [236, 266] }) : Object.assign({}, P['서기'], { armR: [[252, 285], [292, 330], [300, 372]], hR: [302, 376] });
  let w = qShadow(x, y, 66) + Z({ x, y, s: 1, t, pose, ex: drinking ? fEx('z기본') : fEx(nS >= 2 ? 'z메롱' : nS === 1 ? 'z당황' : 'z결심'), look: [0.6, 0.2], seed: 3 });
  const [cx, cy] = drinking ? ptOf(x, y, 1, 230, 252) : ptOf(x, y, 1, 302, 368);
  w += `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${drinking ? -38 : 0})"><path d="M-26 -40 L26 -40 L20 20 L-20 20 Z" fill="#DDF3FF" stroke="${INK}" stroke-width="6"/><path d="M-22 -16 L22 -16 L19 16 L-19 16 Z" fill="#5BA8D8" opacity=".8"/></g>`;
  if (nS >= 1) w += `<path d="M${x + 96} ${y - 470} q-8 22 0 30 q8 -8 0 -30 Z" fill="#9ED8FF" stroke="${INK}" stroke-width="3"/>`;
  const grow = ph === 1 ? 0.8 + 0.35 * nS : 1.95, kx = 1300;
  w += soKko(t, { x: kx, y: y + 10, s: grow, puff: 1 + 0.1 * nS, eyes: ph === 2 ? 'heart' : 'norm', mouth: 'grin', drool: true, look: [-0.7, 0.1], arms: nS >= 2 || ph === 2 ? 'up' : 'down' });
  let over = '';
  if (ph === 1 && lt > tQ) over += pop(t, t - lt + tQ, t + 99, 960, 170, `<g><rect x="-460" y="-80" width="920" height="160" rx="26" fill="#fff" stroke="${INK}" stroke-width="8"/>${fT(0, -6, '"부는 바닷물과 같아서, 마실수록 목이 마르다"', 42, INK)}${fT(0, 50, '쇼펜하우어 『소품과 부록』', 28, '#5B6478', { w: 700 })}</g>`, {});
  if (ph === 1) sips.forEach(s0 => { if (lt > s0 + 0.6 && lt < s0 + 1.4) over += fx(t, t - lt + s0 + 0.6, t + 9, 620, 300, nS >= 2 ? '더 목말라…' : '짜!', '#BFE6FF', { size: 54 }); });
  if (ph === 2) [['♥ 1,024', 440, 330], ['팔로워 3,201', 870, 250], ['♥ 98', 1290, 390], ['조회수 12만', 1630, 290]].forEach(([s0, bx, by], i) => { const k = (lt * 0.5 + i * 0.25) % 1, yy = by + Math.sin(t * 2 + i) * 30; over += pop(t, t - lt + 0.2 + i * 0.3, t + 99, bx, yy, `<g><rect x="-150" y="-40" width="300" height="80" rx="40" fill="#fff" stroke="${INK}" stroke-width="6" opacity=".95"/>${fT(0, 14, s0, 36, '#E5484D')}</g>`, {}); });
  return fPlate('beach', cam, 0.45) + qCam(cam, w) + warm(0.25) + over;
}
// 아무것도 원하지 않기 → 권태 → 쇼츠
function szenScene(t, lt, a) {
  const ph = a.ph, cx = 900, floor = 1000, cam = ph === 1 ? qLerpCam(lt / 5, [960, 700, 1.25], [940, 720, 1.35]) : [960, 700, 1.3];
  const tB = fAt(a, '권태', 2.8), tN = fAt(a, '새로운', 1.6);
  let w = `<ellipse cx="${cx}" cy="${floor - 10}" rx="200" ry="40" fill="#C8A2D8" stroke="${INK}" stroke-width="7"/>`;
  const sitY = floor + 80; // local 466(발 아래) → 방석 윗면
  if (ph === 1) { w += Z({ x: cx, y: sitY, s: 1, t, pose: P['sv양반'], ex: lt < tB ? fEx('z졸음') : fEx('z멍'), look: [0, 0], seed: 3 });
    if (lt < tB) w += fT(cx + 170, floor - 520, '옴~', 44, '#7A6AA8', { stroke: '#fff', sw: 6 });
    else { for (let i = 0; i < 3; i++) w += `<circle cx="${cx - 40 + i * 40}" cy="${floor - 560}" r="9" fill="#5B6478" opacity="${f1(clamp((lt - tB - i * 0.3) / 0.2, 0, 1) * 100) / 100}"/>`; } }
  else { w += Z({ x: cx, y: sitY, s: 1, t, pose: Object.assign({}, P['sv양반'], { armL: SV_PHONE_SIT.armL, hL: SV_PHONE_SIT.hL, armR: SV_PHONE_SIT.armR, hR: SV_PHONE_SIT.hR }), ex: exprAt([[0, 'z멍'], [tN, 'z반짝']], lt), look: [0, 0.8], seed: 3 });
    w += phone(cx, sitY - 216, 0.4, { on: true, glow: 0.5, content: `<g transform="translate(0 ${f1(-((lt * 260) % 196))})">${[0, 1, 2].map(i => `<rect x="-52" y="${-98 + i * 196}" width="104" height="196" fill="${['#FFD36E', '#9ED8B4', '#FF8FB1'][i]}"/>`).join('')}</g>` });
    if (lt > tN) w += `<g transform="translate(${cx + 300} ${floor - 560})">${bubble(0, 0, 240, 140, `<g transform="translate(0 30)">${soShoe(0, 0, 1, { c: '#7EC8F0', ac: '#FFD23F', shine: 0.8 })}</g>${fT(0, -36, 'AD', 26, '#E5484D')}`, {})}</g>`; }
  // 꼬르륵이: 입에 반창고 → (ph2) 반창고가 떨어지고 부푼다
  const kx = cx + 300, gag = ph === 1 || lt < tN - 0.2;
  w += soKko(t, { x: kx, y: floor - 6, s: 0.8, puff: ph === 1 ? 0.9 : 0.9 + 0.5 * clamp((lt - tN) / 0.6, 0, 1), eyes: gag ? (ph === 1 && lt > tB ? 'shut' : 'norm') : 'heart', mouth: gag ? 'smile' : 'grin', drool: !gag, arms: gag ? 'down' : 'up', look: [-0.6, -0.2] });
  if (gag) w += `<g transform="translate(${kx} ${floor - 6 - 0.8 * 58})"><path d="M-30 -14 L30 14 M-30 14 L30 -14" stroke="#F2D2A9" stroke-width="16" stroke-linecap="round"/><path d="M-30 -14 L30 14 M-30 14 L30 -14" stroke="${INK}" stroke-width="2" opacity=".4"/></g>`;
  else if (lt < tN + 0.8) w += `<g transform="translate(${kx + 60} ${f1(floor - 120 + (lt - tN) * 300)}) rotate(${f1((lt - tN) * 400)})"><path d="M-30 -14 L30 14 M-30 14 L30 -14" stroke="#F2D2A9" stroke-width="16" stroke-linecap="round"/></g>`;
  return fPlate('living2', cam, 0.55) + qCam(cam, w) + fFull('#2A2F4A', ph === 1 && lt > tB ? 0.15 : 0.05);
}
// 쾌락의 쳇바퀴
function swheelScene(t, lt, a) {
  const D = a._dur || 6, tT = fAt(a, '쳇바퀴', 1.6), tZ = fAt(a, '제자리', D - 1.4), cam = qLerpCam(lt / D, [960, 600, 1.05], [960, 620, 1.15]);
  const cx = 960, cy = 610, R = 400, rot = lt * 260;
  let w = `<g stroke="${INK}" stroke-width="14" stroke-linecap="round"><line x1="${cx}" y1="${cy}" x2="${cx - 260}" y2="1060"/><line x1="${cx}" y1="${cy}" x2="${cx + 260}" y2="1060"/></g><rect x="${cx - 320}" y="1050" width="640" height="24" rx="10" fill="#8E6A48" stroke="${INK}" stroke-width="7"/>`;
  w += `<g transform="rotate(${f1(rot)} ${cx} ${cy})"><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#C9D3E0" stroke-width="30"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: 24 }, (_, i) => { const an = i * Math.PI / 12; return `<line x1="${f1(cx + Math.cos(an) * (R - 14))}" y1="${f1(cy + Math.sin(an) * (R - 14))}" x2="${f1(cx + Math.cos(an) * (R + 14))}" y2="${f1(cy + Math.sin(an) * (R + 14))}" stroke="${INK}" stroke-width="5"/>`; }).join('') + Array.from({ length: 6 }, (_, i) => { const an = i * Math.PI / 3; return `<line x1="${cx}" y1="${cy}" x2="${f1(cx + Math.cos(an) * R)}" y2="${f1(cy + Math.sin(an) * R)}" stroke="#AAB6C6" stroke-width="10"/>`; }).join('') + `</g><circle cx="${cx}" cy="${cy}" r="30" fill="#8E6A48" stroke="${INK}" stroke-width="7"/>`;
  const y = cy + R - 15;
  w += Z({ x: cx, y, s: 0.95, t, pose: walkPose(lt * 13, 1.1), ex: exprAt([[0, 'z결심'], [tZ, 'z멘붕']], lt), look: [0.8, 0], seed: 3 });
  let over = `<g transform="translate(1600 260)"><rect x="-200" y="-60" width="400" height="120" rx="20" fill="#fff" stroke="${INK}" stroke-width="6"/>${fT(0, -8, '이동 거리', 30, '#5B6478', { w: 700 })}${fT(0, 42, '0 m', 48, '#E5484D')}</g>` + soKko(t, { x: 1700, y: 200, s: 0.6, eyes: 'heart', mouth: 'grin', arms: 'up', look: [-0.8, 0.6] });
  if (lt > tT) over += svCard(t, lt, tT, 460, 200, '쾌락의 쳇바퀴', 'hedonic treadmill', '#7EC8F0');
  for (let i = 0; i < 4; i++) { const k = (lt * 2 + i / 4) % 1; over += `<line x1="${f1(1300 + k * 260)}" y1="${880 + i * 30}" x2="${f1(1360 + k * 260)}" y2="${880 + i * 30}" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="${f1((1 - k) * 80) / 100}"/>`; }
  return fPlate('clocktower', cam, 0.35) + fFull('#0A1238', 0.15) + qCam(cam, w) + over;
}

/* ---------- 3막 앞: 비관 철학자의 반전 일상 ---------- */
const svSilP = (x, y, s, t, seed) => `<g filter="url(#sil)">${char({ goggles: 'none', vest: '#555', patch: false, tee: true, hair: '#333', x, y, s, t, seed, pose: '서기', ex: fEx('z기본') })}</g>`;
// 답의 실마리: 흔들리던 시계추가 느려지고, 벽에 걸린 쇼펜하우어의 옛 액자로 시선이 간다
function svFrame(t, x, y, k) { // 못에 걸린 세피아 액자(쇼펜하우어 + 푸들). k: 0~1 등장(위에서 내려와 흔들리다 멈춤)
  const dy = -420 * (1 - easeOutBack(k)), rot = 8 * Math.sin(k * 9) * (1 - k);
  return `<circle cx="${x}" cy="${y - 150}" r="8" fill="#5A4130" stroke="${INK}" stroke-width="4"/><g transform="translate(0 ${f1(dy)}) rotate(${f1(rot)} ${x} ${y - 150})"><path d="M${x} ${y - 150} L${x - 120} ${y - 100} M${x} ${y - 150} L${x + 120} ${y - 100}" stroke="#5A4130" stroke-width="4"/>` +
    `<rect x="${x - 170}" y="${y - 110}" width="340" height="380" rx="10" fill="#8A5A34" stroke="${INK}" stroke-width="9"/><rect x="${x - 140}" y="${y - 80}" width="280" height="320" fill="#EBD9B4" stroke="${INK}" stroke-width="5"/>` +
    `<defs><clipPath id="svFrClip"><rect x="${x - 140}" y="${y - 80}" width="280" height="320"/></clipPath></defs><g clip-path="url(#svFrClip)" opacity=".9">${SCH({ x: x - 20, y: y + 236, s: 0.5, t, pose: '주머니', ex: fEx('z삐짐'), look: [0.2, 0.1], still: true })}${soPoodle(x + 80, y + 236, 0.4, 0, {})}</g>` +
    `<rect x="${x - 140}" y="${y - 80}" width="280" height="320" fill="#B08A50" opacity=".25" style="mix-blend-mode:multiply"/></g>`; }
function sclueScene(t, lt, a) {
  const D = a._dur || 5, tS = fAt(a, '쇼펜', 1.4), tD = fAt(a, '일상', 3.2), cam = qLerpCam(lt / D, [960, 520, 1.0], [1120, 500, 1.1]);
  const amp = 0.28 * Math.max(0.15, 1 - lt / D), th = amp * Math.sin(2 * Math.PI * t / 4.2);
  let w = svSign(250, 300, '고통', '갖고 싶다', '#E5484D') + svSign(1670, 300, '권태', '심심하다', '#8A8F99');
  const k = clamp((lt - tS + 0.4) / 0.7, 0, 1);
  w += svPendulum(t, th, { zero: { ex: exprAt([[0, 'z멍'], [tS, 'z의심'], [tD, 'z반짝']], lt), look: lt > tS ? [0.9, -0.4] : [0, 0.4] }, kko: { puff: 0.9, eyes: lt > tS ? 'norm' : 'shut', mouth: 'smile', look: [0.9, -0.4] } });
  let over = '';
  if (k > 0) over += qCam(cam, svFrame(t, 1450, 580, k));
  if (lt > tD) over += pop(t, t - lt + tD, t + 99, 1450, 930, label(0, 0, '쇼펜하우어의 일상', { size: 38, bg: '#F3E7CC' }), {});
  return fPlate('clocktower', cam, 0.4) + qCam(cam, w) + fFull('#0A1238', 0.2) + over;
}
// 헤겔과 같은 시간에 강의 → 첫 수업만 하고 폐강. 꼬르륵이(인정받고 싶은 마음)가 커졌다가 시계추가 고통 쪽으로
function svMiniPend(t, lt, t0) { const k = easeOutBack(clamp((lt - t0) / 0.8, 0, 1)), th = -0.55 * k + 0.04 * Math.sin(t * 5) * k;
  return `<g transform="translate(960 210)"><rect x="-230" y="-70" width="460" height="250" rx="22" fill="#FFFDF6" stroke="${INK}" stroke-width="7"/><rect x="-210" y="120" width="130" height="44" rx="10" fill="#E5484D" stroke="${INK}" stroke-width="5"/>${fT(-145, 152, '고통', 30, '#fff')}<rect x="80" y="120" width="130" height="44" rx="10" fill="#8A8F99" stroke="${INK}" stroke-width="5"/>${fT(145, 152, '권태', 30, '#fff')}` +
    `<g transform="rotate(${f1(-th * 57.3)})"><line x1="0" y1="-40" x2="0" y2="110" stroke="#B08A50" stroke-width="10"/><circle cx="0" cy="118" r="26" fill="#E8B84A" stroke="${INK}" stroke-width="6"/></g><circle cx="0" cy="-40" r="9" fill="${INK}"/></g>`; }
const svClock = (x, y, s0) => `<g transform="translate(${x} ${y})"><circle r="44" fill="#FFF6E0" stroke="${INK}" stroke-width="6"/><line x1="0" y1="0" x2="0" y2="-30" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><line x1="0" y1="0" x2="22" y2="0" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>${fT(0, 78, s0, 28, '#fff', { stroke: INK, sw: 6 })}</g>`;
function shegelScene(t, lt, a) {
  const ph = a.ph, cam = [960, 600, 1.0];
  const tK = ph === 1 ? fAt(a, '꼬르륵', 1.0) : -9, tSame = ph === 1 ? fAt(a, '같은', 5.6) : -9;
  const tFull = ph === 2 ? fAt(a, '꽉', 1.6) : 99, tE = ph === 2 ? fAt(a, '첫', 3.0) : 99, tP = ph === 2 ? fAt(a, '시계추', 5.6) : 99;
  let L0 = '', R0 = '';
  const rows = [[690, 0.40], [790, 0.46], [895, 0.52]], desk = (x0, x1, ry, s) => `<rect x="${x0}" y="${ry - 26 * s / 0.46}" width="${x1 - x0}" height="${70 * s / 0.46}" fill="#8E6A48" stroke="${INK}" stroke-width="5"/>`;
  const cheer = lt > tFull;
  rows.forEach(([ry, s], ri) => { for (let i = 0; i < 4; i++) L0 += fGrey(590 + i * 120 * s / 0.46 + (ri % 2) * 45, ry + 148 * s - (cheer ? Math.abs(Math.sin(t * 7 + i + ri)) * 10 : 0), s, t, ri * 4 + i, { ex: fEx(['z반짝', 'z빵긋', 'z설렘'][(ri + i) % 3]), look: [-0.8, -0.2] }); L0 += desk(520, 1000, ry, s); });
  L0 += qShadow(330, 990, 40) + fGrey(330, 990, 0.62, t, 3, { collar: true, tie: '#1E2230', hair: '#5A5A60', pose: Object.assign({}, P['서기'], { armL: [[148, 285], [96, 230], [60, 170]], hL: [56, 164] }), ex: fEx('z빵긋'), look: [0.8, 0] }) + fT(640, 120, '헤겔', 48, '#fff', { stroke: INK, sw: 8 });
  if (cheer) L0 += rSparks(760, 560, t, 8, 220, '#FFE34D');
  rows.forEach(([ry, s]) => { R0 += desk(1000, 1960, ry, s); });
  R0 += fT(1340, 120, '쇼펜하우어', 48, '#fff', { stroke: INK, sw: 8 });
  const sx = 1230, sy = 990, fume = lt > tE;
  R0 += `<rect x="${sx + 110}" y="${sy - 230}" width="150" height="230" fill="#7A5634" stroke="${INK}" stroke-width="7"/><rect x="${sx + 96}" y="${sy - 246}" width="178" height="22" fill="#8E6A48" stroke="${INK}" stroke-width="6"/>`;
  const sEx = ph === 1 ? exprAt([[0, 'z기본'], [tK, 'z히죽'], [tSame, 'z결심']], lt) : exprAt([[0, 'z의심'], [tFull, 'z충격'], [tE, 'z버럭'], [tP, 'z울먹']], lt);
  R0 += SCH({ x: sx, y: sy, s: 0.7, t, pose: '주머니', ex: sEx, look: [-0.8, 0.2] });
  // 머리 위 꼬르륵이: 인정받고 싶어 부풀었다가, 폐강 뒤엔 그대로 울상(원하는데 못 가짐 = 고통)
  const big = ph === 1 ? 1 + 0.5 * easeOutBack(clamp((lt - tK) / 0.6, 0, 1)) : 1.5;
  R0 += soKko(t, { x: sx + 13, y: sy - 500 * 0.7 + 4, s: ph === 1 ? 0.5 + 0.3 * clamp((lt - tK) / 0.6, 0, 1) : 0.8, puff: big, eyes: ph === 1 && lt > tK ? 'heart' : 'norm', mouth: fume ? 'o' : 'grin', drool: ph === 1 && lt > tK, look: [-0.8, 0], arms: ph === 1 && lt > tK ? 'up' : 'down' });
  if (fume && lt < tP) for (let i = 0; i < 3; i++) { const k = (t * 1.5 + i / 3) % 1; R0 += `<circle cx="${f1(sx + 30 + i * 20)}" cy="${f1(sy - 520 - k * 120)}" r="${f1(14 + k * 20)}" fill="#fff" opacity="${f1((1 - k) * 80) / 100}"/>`; }
  let over = '';
  if (ph === 1 && lt > tK + 0.3) over += pop(t, t - lt + tK + 0.3, t + 99, 1640, 330, `<g><rect x="-170" y="-46" width="340" height="92" rx="46" fill="#fff" stroke="${INK}" stroke-width="6"/>${fT(0, 14, '인정받고 싶다!', 36, '#E5484D')}</g>`, {});
  if (ph === 1 && lt > tSame) over += pop(t, t - lt + tSame, t + 99, 480, 230, svClock(0, 0, '같은 시간'), {}) + pop(t, t - lt + tSame + 0.15, t + 99, 1440, 230, svClock(0, 0, '같은 시간'), {});
  if (ph === 1 && lt < 1.8) over += fT(960, 160, '1820년, 베를린 대학', 44, '#fff', { stroke: INK, sw: 8 });
  if (ph === 2 && lt > tE) over += pop(t, t - lt + tE, t + 99, 1640, 680, `<g transform="rotate(-14)"><rect x="-150" y="-70" width="300" height="140" rx="14" fill="none" stroke="#E5484D" stroke-width="12"/>${fT(0, 30, '폐강', 80, '#E5484D')}</g>`, {});
  if (ph === 2 && lt > tP - 0.2) over += svMiniPend(t, lt, tP - 0.2);
  return `<g clip-path="url(#leftHalf)">${fPlate('lecture', cam, 0.5)}${qCam(cam, L0)}</g><g clip-path="url(#rightHalf)">${fPlate('lecture', cam, 0.5)}${qCam(cam, R0)}${fFull('#1A1A2A', 0.15)}</g><line x1="960" y1="-100" x2="960" y2="1300" stroke="${INK}" stroke-width="12"/>` + fSepia(0.5) + over;
}
// 말년, 프랑크푸르트: 푸들과 산책하다 시계를 보고 멈춘다 → "매일 지킨 일과가 하나"
function spoodleScene(t, lt, a) {
  const D = a._dur || 8, tJ = fAt(a, '일과', D - 2.0), cam = qLerpCam(lt / D, [940, 620, 1.1], [1000, 640, 1.2]);
  const wk = clamp(lt / Math.max(1, tJ - 0.4), 0, 1), sx = lerp(380, 880, wk), sy = 1000, px = sx + 300, py = 1000, walking = wk < 1;
  let w = qShadow(sx, sy, 60) + SCH({ x: sx, y: sy, s: 1, t, pose: walking ? walkPose(lt * 6, 0.5) : Object.assign({}, P['서기'], { armL: [[148, 285], [120, 330], [150, 300]], hL: [154, 298] }), ex: exprAt([[0, 'z삐짐'], [tJ, 'z기본']], lt), look: walking ? [0.9, 0.3] : [-0.2, 0.6] });
  const [hx, hy] = walking ? ptOf(sx, sy, 1, 300, 372) : ptOf(sx, sy, 1, 300, 372);
  w += `<path d="M${f1(hx)} ${f1(hy)} Q${f1((hx + px) / 2)} ${f1(Math.max(hy, py - 100) + 60)} ${f1(px + 60)} ${f1(py - 110)}" fill="none" stroke="#8A5A34" stroke-width="5"/>`;
  w += qShadow(px, py, 50) + soPoodle(px, py - (walking ? Math.abs(Math.sin(lt * 6)) * 8 : 0), 0.95, t, {});
  if (!walking) { const [wx, wy] = ptOf(sx, sy, 1, 154, 298); w += `<g transform="translate(${f1(wx)} ${f1(wy - 10)})"><circle r="26" fill="#E8C24A" stroke="${INK}" stroke-width="5"/><circle r="18" fill="#FFF6E0"/><line x1="0" y1="0" x2="0" y2="-14" stroke="${INK}" stroke-width="4"/><line x1="0" y1="0" x2="0" y2="-10" stroke="${INK}" stroke-width="5"/></g>`; }
  let over = '';
  if (lt < 1.8) over += fT(960, 150, '프랑크푸르트, 말년', 44, '#fff', { stroke: INK, sw: 8 });
  if (lt > tJ) over += pop(t, t - lt + tJ, t + 99, 640, 330, `<g><rect x="-150" y="-46" width="300" height="92" rx="46" fill="#fff" stroke="${INK}" stroke-width="6"/>${fT(0, 14, '정오 12:00', 38, INK)}</g>`, {});
  return fPlate('frankfurt', cam, 0.5) + qCam(cam, w) + warm(0.2) + over;
}
// 점심 30분 플루트: 음악이 퍼지면 탁자 위 꼬르륵이가 하품하고 잠든다
function sfluteScene(t, lt, a) { // 쇼펜하우어는 눈을 뜨고 플루트를 분다. 머리 위 그의 꼬르륵이가 음악에 꾸벅꾸벅하다 잠든다
  const D = a._dur || 7, tF = fAt(a, '플루트', 1.6), tQ = fAt(a, '동안', 3.4), tZ = fAt(a, '잠들', D - 1.6), cam = qLerpCam(lt / D, [1060, 560, 1.15], [1080, 520, 1.3]), x = 1080, y = 1000, play = lt > 0.3;
  const pose = play ? Object.assign({}, P['서기'], { armL: [[148, 285], [196, 310], [244, 262]], hL: [248, 260], armR: [[252, 285], [306, 288], [334, 250]], hR: [338, 248] }) : '주머니';
  const asleep = lt > tZ, calm = clamp((lt - tF) / (tZ - tF + 0.01), 0, 1);
  let w = qShadow(x, y, 66) + SCH({ x, y, s: 1, t, pose, ex: fEx(asleep ? 'z설렘' : 'z기본'), look: lt > tQ ? [0.1, -0.8] : [0.5, -0.1], tilt: play ? 5 * Math.sin(t * 2) : 0 });
  let bx = 0, by = 0;
  if (play) { const [ax, ay] = ptOf(x, y, 1, 214, 246); [bx, by] = ptOf(x, y, 1, 420, 232); w += `<line x1="${f1(ax)}" y1="${f1(ay)}" x2="${f1(bx)}" y2="${f1(by)}" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><line x1="${f1(ax)}" y1="${f1(ay)}" x2="${f1(bx)}" y2="${f1(by)}" stroke="#D9C9A8" stroke-width="9" stroke-linecap="round"/>`; }
  // 머리 위 꼬르륵이: 처음엔 들썩이며 배가 꼬르륵 → 음표가 닿을수록 작아지고 꾸벅 → 잠듦
  const kx = x + 13, ky = y - 496, nod = !asleep && lt > tQ ? Math.max(0, Math.sin((lt - tQ) * 5)) * 14 : 0;
  if (play) for (let i = 0; i < 5; i++) { const k = (t * 0.45 + i / 5) % 1, nx = lerp(bx + 20, kx + 40, k) + Math.sin(k * 7 + i) * 14, ny = lerp(by - 20, ky - 120, k) - Math.sin(k * Math.PI) * 60; w += `<g opacity="${f1(Math.sin(k * Math.PI) * 100) / 100}">${fT(nx, ny, ['♪', '♫'][i % 2], 46, '#7A5634')}</g>`; }
  w += soKko(t, { x: kx, y: ky, s: 0.55, puff: lerp(1.3, 0.9, calm), sq: asleep ? 0.88 : 1, rot: asleep ? 10 : nod, eyes: asleep || lt > tQ ? 'shut' : 'norm', mouth: asleep ? 'smile' : lt > tQ ? 'o' : 'grin', rumble: lt < tF ? 1 : 0, arms: lt < tF ? 'up' : 'down', look: [Math.sin(t * 6) * 0.8, -0.2], still: asleep });
  if (asleep) w += pop(t, t - lt + tZ, t + 99, kx + 70, ky - 110, fT(0, 0, 'z z z', 40, '#fff', { stroke: INK, sw: 5 }), {});
  w += soPoodle(1460, 1000, 0.7, t * 0.1, { flip: true });
  const hand = lerp(0, Math.PI, clamp((lt - tF) / (D - tF), 0, 1));
  w += `<g transform="translate(1560 300)"><circle r="70" fill="#FFF6E0" stroke="${INK}" stroke-width="7"/><line x1="0" y1="0" x2="${f1(Math.sin(hand) * 50)}" y2="${f1(-Math.cos(hand) * 50)}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><line x1="0" y1="0" x2="0" y2="-36" stroke="${INK}" stroke-width="10" stroke-linecap="round"/></g>`;
  let over = '';
  if (lt > tF - 0.3) over += pop(t, t - lt + tF - 0.3, t + 99, 1640, 470, label(0, 0, '12:00 ~ 12:30', { size: 34, bg: '#F3E7CC' }), {});
  return fPlate('study19', cam, 0.5) + qCam(cam, w) + warm(0.35) + over;
}

/* ---------- 3막: 힌트 ---------- */
function svBench(cx, seat) { return `<rect x="${cx - 360}" y="${seat - 190}" width="720" height="36" rx="14" fill="#8E6A48" stroke="${INK}" stroke-width="8"/><rect x="${cx - 360}" y="${seat - 132}" width="720" height="36" rx="14" fill="#8E6A48" stroke="${INK}" stroke-width="8"/><rect x="${cx - 380}" y="${seat - 22}" width="760" height="40" rx="14" fill="#A9825E" stroke="${INK}" stroke-width="8"/><g stroke="${INK}" stroke-width="12" stroke-linecap="round"><line x1="${cx - 320}" y1="${seat + 18}" x2="${cx - 320}" y2="${seat + 120}"/><line x1="${cx + 320}" y1="${seat + 18}" x2="${cx + 320}" y2="${seat + 120}"/></g>`; }
const SV_PHONES = `<path d="M80 182 Q74 34 200 30 Q326 34 320 182" fill="none" stroke="${INK}" stroke-width="24" stroke-linecap="round"/><path d="M80 182 Q74 34 200 30 Q326 34 320 182" fill="none" stroke="#3D7EC8" stroke-width="13" stroke-linecap="round"/><rect x="58" y="150" width="40" height="78" rx="16" fill="#E5484D" stroke="${INK}" stroke-width="7"/><rect x="302" y="150" width="40" height="78" rx="16" fill="#E5484D" stroke="${INK}" stroke-width="7"/>`; // 머리 로컬 좌표(hairFront로 넣어 머리와 같이 움직인다)
const svPhonesFlat = (x, y, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-56 -12 Q0 -86 56 -12" fill="none" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M-56 -12 Q0 -86 56 -12" fill="none" stroke="#3D7EC8" stroke-width="10" stroke-linecap="round"/><rect x="-78" y="-34" width="40" height="34" rx="12" fill="#E5484D" stroke="${INK}" stroke-width="6"/><rect x="38" y="-34" width="40" height="34" rx="12" fill="#E5484D" stroke="${INK}" stroke-width="6"/></g>`;
function sriverScene(t, lt, a) {
  const tH = fAt(a, '힌트', 0.6), tQ = fAt(a, '조용', 4.8), cam = qLerpCam(lt / 7, [960, 640, 1.15], [960, 660, 1.3]);
  const bx = 960, seat = 900, zx = 860;
  let w = '';
  const stop = clamp((lt - tQ + 1.5) / 2.5, 0, 1), th = 0.35 * (1 - easeOut(stop)) * Math.sin(lt * 2.2);
  w += `<g opacity=".35" transform="translate(1500 -120) rotate(${f1(th * 57.3)})"><line x1="0" y1="0" x2="0" y2="520" stroke="#FFF2D6" stroke-width="10"/><circle cx="0" cy="560" r="50" fill="#FFF2D6"/></g>`;
  w += svBench(bx, seat);
  w += Z({ x: zx, y: svSitY(seat, 1) - 10, s: 1, t, pose: P['f앉기'], ex: fEx(lt > tQ - 1 ? 'z설렘' : 'z기본'), look: [0.4, -0.4], tilt: 4 * Math.sin(t * 1.4), seed: 3, hairFront: SV_PHONES });
  w += soKko(t, { x: zx + 330, y: seat - 22, s: 0.7, puff: 0.9, eyes: lt > tQ - 1 ? 'shut' : 'norm', mouth: 'smile', look: [0.3, -0.5], still: lt > tQ });
  for (let i = 0; i < 3; i++) { const k = (t * 0.5 + i / 3) % 1; w += `<g opacity="${f1(Math.sin(k * Math.PI) * 80) / 100}">${fT(zx - 170 - k * 60, 560 - k * 200, ['♪', '♫', '♪'][i], 46, '#FFF2D6', { stroke: INK, sw: 4 })}</g>`; }
  const over = lt > tH ? svCard(t, lt, tH, 520, 190, '힌트 1', '푹 빠져 바라보기', '#FFB27A') : '';
  return fPlate('river', cam, 0.45) + qCam(cam, w) + warm(0.45) + over;
}
// 익시온의 수레바퀴: 그리스 항아리 그림(적갈색 바탕 + 검은 그림)
function sixionScene(t, lt, a) {
  const tS = fAt(a, '멈춰', (a._dur || 6) - 1.6), D = a._dur || 6;
  const k = clamp((lt - (tS - 1.2)) / 1.8, 0, 1), speed = 1 - easeOut(k), ang = lt < tS - 1.2 ? lt * 240 : (tS - 1.2) * 240 + 240 * 1.8 * (k - k * k / 2) / 1;
  let h = `<defs><filter id="svblk"><feColorMatrix type="matrix" values="0 0 0 0 0.12 0 0 0 0 0.08 0 0 0 0 0.05 0 0 0 1 0"/></filter></defs><rect x="-300" y="-200" width="2600" height="1500" fill="#1E140E"/><ellipse cx="960" cy="560" rx="760" ry="560" fill="#C8642F" stroke="#1E140E" stroke-width="10"/>`;
  const meander = y => { let p = ''; for (let x = 300; x < 1620; x += 60) p += `<path d="M${x} ${y + 30} L${x} ${y} L${x + 40} ${y} L${x + 40} ${y + 20} L${x + 20} ${y + 20} L${x + 20} ${y + 10}" fill="none" stroke="#1E140E" stroke-width="7"/>`; return p; };
  h += meander(130) + meander(940);
  const cx = 960, cy = 560;
  h += `<g transform="rotate(${f1(ang)} ${cx} ${cy})"><circle cx="${cx}" cy="${cy}" r="250" fill="none" stroke="#1E140E" stroke-width="26"/>` + Array.from({ length: 8 }, (_, i) => { const an = i * Math.PI / 4; return `<line x1="${cx}" y1="${cy}" x2="${f1(cx + Math.cos(an) * 250)}" y2="${f1(cy + Math.sin(an) * 250)}" stroke="#1E140E" stroke-width="12"/>`; }).join('');
  for (let i = 0; i < 12; i++) { const an = i * Math.PI / 6, fx0 = cx + Math.cos(an) * 270, fy0 = cy + Math.sin(an) * 270, fl = 30 + 20 * Math.sin(t * 12 + i); h += `<path d="M${f1(fx0)} ${f1(fy0)} q${f1(Math.cos(an) * fl * 0.6 - 10)} ${f1(Math.sin(an) * fl * 0.6)} ${f1(Math.cos(an) * fl)} ${f1(Math.sin(an) * fl)}" stroke="#1E140E" stroke-width="10" stroke-linecap="round" fill="none" opacity="${f1(speed * 100) / 100}"/>`; }
  h += `<g stroke="#1E140E" stroke-linecap="round" fill="none"><line x1="${cx}" y1="${cy - 110}" x2="${cx}" y2="${cy + 70}" stroke-width="22"/><path d="M${cx - 200} ${cy - 150} L${cx} ${cy - 80} L${cx + 200} ${cy - 150} M${cx - 160} ${cy + 200} L${cx} ${cy + 70} L${cx + 160} ${cy + 200}" stroke-width="16"/></g><circle cx="${cx}" cy="${cy - 150}" r="38" fill="#1E140E"/>` + [[-200, -150], [200, -150], [-160, 200], [160, 200]].map(([dx, dy]) => `<circle cx="${cx + dx}" cy="${cy + dy}" r="13" fill="#C8642F" stroke="#1E140E" stroke-width="6"/>`).join('') + `</g><circle cx="${cx}" cy="${cy}" r="24" fill="#1E140E"/>`;
  if (k >= 1) h += `<g opacity="${f1(clamp((lt - tS - 0.4) / 0.6, 0, 1) * 100) / 100}">${fT(960, 900, '…멈춰 선다', 54, '#1E140E')}</g>`;
  h += fT(960, 70, '익시온: 그리스 신화에서 영원히 도는 불 바퀴에 묶인 죄인', 32, '#E8C79A', { w: 700 });
  return qCam([960, 560, 1.0 + 0.06 * clamp(lt / D, 0, 1)], h);
}
// 상자 셋: ① 나인 것 ② 가진 것 ③ 남에게 보이는 것
function svGift(x, y, s, col, lab, num, open, inner = '') { const lid = 0, rot = open ? -118 * easeOut(open) : 0; // 뚜껑은 왼쪽 경첩에 붙은 채 열린다
  return `<g transform="translate(${x} ${y}) scale(${s})">` + (open ? `<circle cx="0" cy="-120" r="${f1(120 + 40 * open)}" fill="#FFE34D" opacity="${f1(0.35 * open * 100) / 100}"/>` + inner : '') + `<rect x="-110" y="-150" width="220" height="150" rx="10" fill="${col}" stroke="${INK}" stroke-width="8"/><rect x="-14" y="-150" width="28" height="150" fill="#fff" opacity=".6"/><g transform="translate(0 ${lid}) rotate(${rot} -112 -150)"><rect x="-124" y="-182" width="248" height="40" rx="10" fill="${col}" stroke="${INK}" stroke-width="8"/></g>${fT(0, -64, num, 54, '#fff', { stroke: INK, sw: 8 })}${lab ? `<g transform="translate(0 ${open ? -400 : -300})"><rect x="${-lab.length * 17 - 22}" y="-30" width="${lab.length * 34 + 44}" height="60" rx="30" fill="#fff" stroke="${INK}" stroke-width="5"/>${fT(0, 12, lab, 32, INK)}</g>` : ''}</g>`; }
function sboxesScene(t, lt, a) {
  const ph = a.ph, cam = [960, 600, 1.05], tA = fAt(a, '어떤', 3.4), tB = fAt(a, '가진', 5.0), tC = fAt(a, '보이는', 7.2);
  let h = `<rect x="-300" y="-200" width="2600" height="1500" fill="#F6EEDD"/><rect x="-300" y="-200" width="2600" height="1500" fill="url(#paper)"/><rect x="-300" y="980" width="2600" height="400" fill="#E3D3B4"/>`;
  const pod = [[960, 860, '#E8B84A', 1], [660, 920, '#C9D3E0', 2], [1260, 950, '#E3A87C', 3]];
  pod.forEach(([x, top, c, n]) => { h += `<rect x="${x - 140}" y="${top}" width="280" height="${1000 - top}" fill="${c}" stroke="${INK}" stroke-width="8"/>${fT(x, top + 70, n + '위', 40, '#fff', { stroke: INK, sw: 6 })}`; });
  const show = i => ph === 2 ? lt > [tA, tB, tC][i] - 0.2 : false;
  const open1 = ph === 2 ? clamp((lt - (a._dur || 9) + 1.4) / 0.6, 0, 1) : 0;
  const zeroIn = `<g transform="translate(0 -150)">${Z({ x: 0, y: 0, s: 0.4, t, pose: '만세', ex: fEx('z빵긋'), seed: 3 })}${fT(-160, -120, '건강', 28, '#8A6A2E')}${fT(160, -120, '성격', 28, '#8A6A2E')}${fT(0, -230, '마음', 28, '#8A6A2E')}</g>`;
  const labs = [['내가 어떤 사람인지', '①'], ['내가 가진 것', '②'], ['남에게 보이는 것', '③']];
  h += svGift(960, 860, 1, '#FFD23F', show(0) || ph === 1 ? labs[0][0] : '', labs[0][1], open1, open1 ? zeroIn : '');
  h += svGift(660, 920, 0.9, '#7EC8F0', show(1) || ph === 1 ? labs[1][0] : '', labs[1][1], 0) + (show(1) ? soShoe(660, 760, 0.9, { shine: 0.5 }) : '');
  h += svGift(1260, 950, 0.9, '#FF8FB1', show(2) || ph === 1 ? labs[2][0] : '', labs[2][1], 0) + (show(2) ? `<g transform="translate(1260 790)">${fT(0, 0, '♥ 1,024', 40, '#E5484D', { stroke: '#fff', sw: 6 })}</g>` : '');
  h += soKko(t, { x: 560, y: 920 - 182 * 0.9, s: 0.55, eyes: show(1) ? 'heart' : 'norm', mouth: 'grin', drool: show(1), look: [0.5, 0.4] });
  const zx = ph === 2 && open1 > 0 ? lerp(300, 380, open1) : 300;
  h += qShadow(zx, 1000, 60) + Z({ x: zx, y: 1000, s: 0.9, t, pose: open1 > 0 ? Object.assign({}, P['서기'], { armR: [[252, 285], [320, 280], [370, 250]], hR: [374, 248] }) : '서기', ex: exprAt([[0, 'z기본'], [tA, 'z의심'], [(a._dur || 9) - 1.0, 'z반짝']], ph === 2 ? lt : 0), look: [0.8, -0.3], seed: 3 });
  const over = ph === 1 ? svCard(t, lt, 0.3, 960, 190, '힌트 2', '가진 것보다 나인 것', '#E8B84A') : '';
  return qCam(cam, h) + over;
}
// 그 신발로 걸은 길: 강변 산책. 낡은 운동화, 지나온 길의 발자국, 그 신발로 쌓은 추억이 생각 풍선으로 떠오른다
const svMem = [
  ['3일째 물웅덩이', () => `<ellipse cx="0" cy="34" rx="70" ry="14" fill="#6E8FB0" stroke="${INK}" stroke-width="4"/>${soShoe(0, -6, 0.9, { rot: -12 })}<path d="M-30 -40 q30 -30 60 0" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="6 6"/>`],
  ['강변 노을', () => `<rect x="-80" y="-10" width="160" height="44" fill="#F5A97A"/><circle cx="0" cy="-10" r="34" fill="#FFD36E" stroke="${INK}" stroke-width="4"/><rect x="-80" y="14" width="160" height="30" fill="#6E8FB0"/><path d="M-60 26 h30 M10 32 h40" stroke="#fff" stroke-width="4"/>`],
  ['친구랑 떡볶이', () => `<path d="M-64 0 Q0 60 64 0 Z" fill="#fff" stroke="${INK}" stroke-width="5"/>${[[-30, -6], [-6, -12], [18, -6], [40, -10], [-14, 2]].map(([px, py]) => `<rect x="${px - 14}" y="${py - 7}" width="28" height="14" rx="7" fill="#E5484D" stroke="${INK}" stroke-width="3"/>`).join('')}`],
];
function swalkScene(t, lt, a) {
  const D = a._dur || 5, x = 640 + lt * 120, y = 1000, cam = [x + 60, 620, 1.25], pose = walkPose(lt * 6, 0.6);
  let w = '';
  for (let i = 1; i <= 7; i++) { const fx0 = x - i * 90, side = i % 2 ? -1 : 1; w += `<ellipse cx="${f1(fx0)}" cy="${y + 6 + side * 6}" rx="22" ry="8" fill="#7A5A3A" opacity="${f1((0.45 - i * 0.05) * 100) / 100}"/>`; }
  w += qShadow(x, y, 60) + Z({ x, y, s: 1, t, pose, ex: fEx('z뿌듯'), look: [-0.5, -0.4], seed: 3 }) + soFeet(x, y, 1, pose, { dust: 0.7 });
  w += soKko(t, { x: x + 230, y: y - Math.abs(Math.sin(lt * 6)) * 24, s: 0.55, eyes: 'shut', mouth: 'smile' });
  svMem.forEach(([s0, draw], i) => { const t0 = 0.5 + i * (D - 1.2) / 3; if (lt < t0) return;
    const bxw = x - 420 + i * 250, byw = 330 + (i % 2) * 40;
    w += pop(t, t - lt + t0, t + 99, bxw, byw, bubble(0, 0, 230, 170, `<g transform="translate(0 -14)">${draw()}</g>${fT(0, 66, s0, 26, INK, { w: 700 })}`, { right: true }), {}); });
  return fPlate('river', cam, 0.45) + qCam(cam, w) + warm(0.5);
}

/* ---------- 결말: 꼬르륵이는 사라지지 않는다. 다만 먼저 알아차린다 ---------- */
const SVN = { step: 960, x: 760 };
// 목에 건 헤드셋 → 귀로(머리 로컬 좌표, k: 0 목 ~ 1 귀)
const svNeckPhones = k => { const e = easeInOut(k), lx = lerp(100, 58, e), rx = lerp(260, 302, e), cy = lerp(250, 150, e), band = k < 0.5 ? `<path d="M${f1(lx + 20)} ${f1(cy + 30)} Q200 ${f1(cy + 92)} ${f1(rx + 20)} ${f1(cy + 30)}" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M${f1(lx + 20)} ${f1(cy + 30)} Q200 ${f1(cy + 92)} ${f1(rx + 20)} ${f1(cy + 30)}" fill="none" stroke="#3D7EC8" stroke-width="11" stroke-linecap="round"/>` : `<path d="M${f1(lx + 22)} ${f1(cy + 32)} Q200 ${f1(cy - 150)} ${f1(rx + 18)} ${f1(cy + 32)}" fill="none" stroke="${INK}" stroke-width="24" stroke-linecap="round"/><path d="M${f1(lx + 22)} ${f1(cy + 32)} Q200 ${f1(cy - 150)} ${f1(rx + 18)} ${f1(cy + 32)}" fill="none" stroke="#3D7EC8" stroke-width="13" stroke-linecap="round"/>`;
  return band + `<rect x="${f1(lx)}" y="${f1(cy)}" width="40" height="${f1(lerp(56, 78, e))}" rx="16" fill="#E5484D" stroke="${INK}" stroke-width="7"/><rect x="${f1(rx)}" y="${f1(cy)}" width="40" height="${f1(lerp(56, 78, e))}" rx="16" fill="#E5484D" stroke="${INK}" stroke-width="7"/>`; };
function svNight(t, lt, a, ph) {
  const D = a._dur || 6, { step, x } = SVN, y = svSitY(step);
  const cams = { 1: [[900, 640, 1.2], [880, 640, 1.28]], 2: [[960, 660, 1.25], [980, 660, 1.3]], 3: [[1000, 600, 1.05], [1000, 600, 1.1]], 4: [[880, 660, 1.3], [860, 660, 1.36]], 5: [[900, 680, 1.3], [880, 690, 1.38]], 6: [[920, 660, 1.2], [960, 640, 1.05]] };
  const cam = qLerpCam(lt / D, cams[ph][0], cams[ph][1]);
  const clock = { 1: '23:49', 2: '23:49', 3: '23:50', 4: '23:51', 5: '23:53', 6: '23:54' }[ph];
  let w = `<rect x="200" y="${step - 6}" width="1500" height="26" fill="#B5845A" stroke="${INK}" stroke-width="7"/><rect x="200" y="${step + 20}" width="1500" height="200" fill="#9A8E80"/>`;
  w += soCabinet(0, soShoe(CAB_SNEAKER[0], CAB_SNEAKER[1], 0.62, { c: SO_MINT, dust: 0.6 }));
  w += `<g transform="translate(1420 ${CAB.top - 16})"><rect x="-70" y="-60" width="140" height="60" rx="10" fill="#0E0E12" stroke="${INK}" stroke-width="6"/>${fT(0, -16, clock, 38, '#FF4D4D')}</g>`; // 신발장 위 탁상시계
  // 쇼펜하우어 액자(ph3부터): 그도 평생 꼬르륵이와 살았다
  const tS = ph === 3 ? fAt(a, '쇼펜', 2.4) : -9, fk = ph < 3 ? 0 : clamp((lt - tS + 0.3) / 0.7, 0, 1);
  if (fk > 0) w += svFrame(t, 1380, 400, fk);
  // 알아차림: 벽에 비친 커다란 시계추 그림자가 흔들리기 시작한다(ph3) → 헤드셋 뒤로 잦아든다(ph4~6)
  const tA = ph === 3 ? fAt(a, '알아차', 5.4) : -9, tSw = ph === 3 ? fAt(a, '흔들리', 7.2) : -9;
  const amp = ph === 3 ? 0.28 * clamp((lt - tA) / 1.2, 0, 1) : ph === 4 ? 0.28 * (1 - 0.5 * clamp(lt / D, 0, 1)) : ph === 5 ? 0.14 * (1 - clamp(lt / D, 0, 1)) : 0;
  const pop0 = ph === 3 ? clamp((lt - tA + 0.2) / 0.5, 0, 1) : ph >= 4 ? (ph === 6 ? 0 : 1 - (ph === 5 ? clamp(lt / D, 0, 1) : 0)) : 0;
  if (pop0 > 0) { const th = amp * Math.sin(lt * 2.4); w += `<g opacity="${f1(0.4 * pop0 * 100) / 100}"><g transform="translate(960 -90) rotate(${f1(-th * 57.3)})"><line x1="0" y1="0" x2="0" y2="560" stroke="#E8B84A" stroke-width="14"/><circle cx="0" cy="600" r="58" fill="#E8B84A" stroke="${INK}" stroke-width="6"/></g></g>`; }
  // 폰: ph1~2 손에(화면이 보이게), ph4에서 계단 위에 엎어 둔다
  const tB = ph === 4 ? fAt(a, '버튼', 0.6) : -9, tH = ph === 4 ? fAt(a, '헤드셋', 1.9) : -9;
  const down = ph < 4 ? 0 : ph === 4 ? clamp((lt - tB + 0.3) / 0.6, 0, 1) : 1;
  const puton = ph < 4 ? 0 : ph === 4 ? clamp((lt - tH + 0.3) / 0.6, 0, 1) : 1;
  const hold = SV_PHONE_SIT, reachL = Object.assign({}, P['f앉기'], { armL: [[148, 285], [96, 360], [40, 430]], hL: [40, 430] });
  const toEars = Object.assign({}, P['f앉기'], { armL: [[148, 285], [96, 250], [80, 196]], hL: [80, 196], armR: [[252, 285], [304, 250], [320, 196]], hR: [320, 196] });
  let pose = P['f앉기'];
  if (ph <= 3) pose = hold;
  if (ph === 4) pose = down > 0 && down < 1 ? reachL : puton > 0 && puton < 1 ? toEars : P['f앉기'];
  const zEx = ph === 1 ? exprAt([[0, 'z기본'], [fAt(a, '마감', 2.6), 'z설렘']], lt) : ph === 2 ? fEx('z당황') : ph === 3 ? exprAt([[0, 'z기본'], [tA, 'z반짝'], [tSw, 'z빵긋']], lt) : ph === 4 ? fEx('z기본') : ph === 5 ? exprAt([[0, 'z기본'], [fAt(a, '응모', 2.4), 'z의심'], [fAt(a, '허기', 4.6), 'z설렘']], lt) : fEx('z설렘');
  const look = ph <= 1 ? [0, 0.8] : ph === 2 ? [0.9, 0.5] : ph === 3 ? (lt > tA ? [0.3, -0.8] : lt > tS ? [0.9, -0.5] : [0.9, 0.5]) : ph === 5 && lt > fAt(a, '응모', 2.4) && lt < fAt(a, '허기', 4.6) ? [-0.8, 0.7] : ph === 6 ? [0, 0] : [0.5, 0.6];
  w += Z({ x, y, s: 1, t, pose, ex: zEx, look, tilt: ph >= 5 ? 4 * Math.sin(t * 2.2) : 0, seed: 3, hairFront: puton >= 1 ? SV_PHONES : svNeckPhones(puton) });
  // 폰 그리기
  const chest = [x, y + (354 - 560) - 10], stepP = [x - 190, step - 8];
  if (down <= 0) w += phone(chest[0], chest[1], 0.4, { on: true, glow: 0.45 });
  else if (down < 1) { const [hx, hy] = ptOf(x, y, 1, 40, 430); w += phone(lerp(chest[0], hx, down), lerp(chest[1], hy, down), 0.4, { on: true, rot: -60 * down }); }
  else w += `<g transform="translate(${stepP[0]} ${stepP[1]})"><rect x="-74" y="-16" width="148" height="16" rx="6" fill="#1F2D44" stroke="${INK}" stroke-width="5"/></g>`;
  if (puton >= 1 && ph >= 4) for (let i = 0; i < 3; i++) { const k = (t * 0.5 + i / 3) % 1, [hx, hy] = ptOf(x, y, 1, 330, 160); w += `<g opacity="${f1(Math.sin(k * Math.PI) * 90) / 100}">${fT(hx + 30 + k * 120, hy - k * 160, ['♪', '♫', '♪'][i], 44, '#FFE9A8', { stroke: INK, sw: 4 })}</g>`; }
  // 꼬르륵이
  const belly = ptOf(x, y, 1, 200, 380), stepK = [x + 250, step - 6], lap = [x + 55, y + (404 - 560)];
  if (ph === 2) { const k = clamp((lt - 0.15) / 0.55, 0, 1), kx = lerp(belly[0], stepK[0], easeOut(k)), ky = lerp(belly[1], stepK[1], k) - Math.sin(k * Math.PI) * 200;
    w += soKko(t, { x: kx, y: ky, s: lerp(0.3, 0.75, easeOutBack(clamp(k * 1.6, 0, 1))), rot: k < 1 ? k * 360 : 0, puff: 1.2, talk: k >= 1 ? env(t) : 0, eyes: 'heart', drool: k >= 1, arms: k >= 1 ? 'point' : 'up', look: [-0.8, -0.4], rumble: k >= 1 ? 1 : 0 }); }
  if (ph === 3) w += soKko(t, { x: stepK[0], y: stepK[1], s: 0.75, puff: 1.25, eyes: 'heart', mouth: 'grin', drool: true, arms: 'point', look: [-0.8, -0.4] });
  if (ph === 4) { const calm = puton; w += soKko(t, { x: stepK[0], y: stepK[1], s: 0.75, puff: lerp(1.25, 1.05, calm), eyes: calm > 0.5 ? 'norm' : 'heart', mouth: calm > 0.5 ? 'o' : 'grin', drool: calm < 0.5, arms: 'down', look: [-0.6, -0.5] }); }
  if (ph >= 5) { const k = ph === 5 ? clamp((lt - 0.2) / 0.6, 0, 1) : 1, asleep = ph === 6 || lt > 1.4, kx = lerp(stepK[0], lap[0], easeInOut(k)), ky = lerp(stepK[1], lap[1], k) - Math.sin(k * Math.PI) * 120;
    w += soKko(t, { x: kx, y: ky, s: lerp(0.75, 0.55, k), puff: 0.9, sq: asleep ? 0.86 : 1, eyes: asleep ? 'shut' : 'norm', mouth: asleep ? 'smile' : 'o', still: asleep, look: [-0.3, -0.6] });
    if (asleep) w += fT(lap[0] + 70, lap[1] - 110, 'z z', 36, '#fff', { stroke: INK, sw: 5 }); }
  let over = '';
  if (ph === 1) { const tN = fAt(a, '알림', 1.0); if (lt > tN) over += pop(t, t - lt + tN, t + 99, 1460, 230, `<g><rect x="-330" y="-80" width="660" height="160" rx="26" fill="#fff" stroke="${INK}" stroke-width="7"/><g transform="translate(-250 20)">${soShoe(0, 10, 0.9, { c: '#FF8FB1', ac: '#FFD23F' })}</g>${fT(-150, -14, '다음 드롭 응모', 40, INK, { anchor: 'start' })}${fT(-150, 44, '마감 23:59', 36, '#E5484D', { anchor: 'start' })}</g>`, {}); }
  if (ph === 2 && lt > 0.2 && lt < 1.0) over += fx(t, t - lt + 0.2, t + 9, 980, 520, '뿅!', '#B5E36B', { size: 64 });
  if (ph === 3 && lt > tA) over += pop(t, t - lt + tA, t + 99, 820, 200, label(0, 0, '알아차림', { size: 40, bg: '#FFE9A8' }), {});
  return fPlate('genkan', cam, 0.55) + qCam(cam, w) + fFull('#0A1238', 0.32) + warm(ph >= 5 ? 0.35 : ph === 4 ? 0.2 : 0) + over;
}
function snightScene(t, lt, a) { return svNight(t, lt, a, a.ph); }
function sendScene(t, lt, a) { return svNight(t, lt, a, 6); }
SV.forEach(k => { const f = window[k + 'Scene']; if (!f) { console.error('missing ' + k); return; } window[k + 'Scene'] = (...x) => qDefs() + fNeonDefs() + f(...x); });
