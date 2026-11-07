/* 쇼펜하우어 편 — 인트로 샘플. fatigue01의 fscenes.js·fscenes2.js를 도구로 불러 쓰고, 새 이름은 모두 so 접두사.
   연출 기준 v3 + 물리 규칙: 작은 캐릭터는 딛는 곳 위에, 소품·카드가 얼굴을 가리지 않게. */
Object.assign(QBG, { bedn: 'ai/bedn.png', street: 'ai/street.png', genkan: 'ai/genkan.png', study19: 'ai/study19.png' });
const SO = ['sodraw', 'soday1', 'soday3', 'soday14', 'sohall', 'sotitle', 'soname'];
SO.forEach(k => CAMS[k] = 'fixed');
const SO_MINT = '#7FD6C2', SO_PINK = '#FF6B8B';

/* ---------- 소품 ---------- */
// 운동화(옆모습). 원점 = 밑창 가운데. o.dust: 0~1 먼지, o.c: 몸통 색
function soShoe(x, y, s, o = {}) { const c = o.c || SO_MINT, ac = o.ac || SO_PINK, d = o.dust || 0;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1((o.flip ? -s : s) * 1000) / 1000} ${f1(s * 1000) / 1000}) rotate(${f1(o.rot || 0)})">` +
    `<path d="M-58 -6 L56 -6 Q68 -8 64 -20 Q58 -32 34 -34 L10 -40 Q-4 -58 -30 -56 L-54 -54 Q-64 -34 -58 -6 Z" fill="${c}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<rect x="-62" y="-10" width="130" height="14" rx="7" fill="#fff" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M-34 -40 Q-2 -22 34 -26" stroke="${ac}" stroke-width="8" fill="none" stroke-linecap="round"/>` +
    `<path d="M-14 -50 l10 8 M-2 -48 l10 8 M10 -44 l9 7" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` +
    (d > 0 ? `<g opacity="${f1(d * 100) / 100}"><path d="M-58 -6 L56 -6 Q68 -8 64 -20 Q58 -32 34 -34 L10 -40 Q-4 -58 -30 -56 L-54 -54 Q-64 -34 -58 -6 Z" fill="#9A9488" opacity=".55"/>${[[-40, -30], [-10, -20], [20, -24], [44, -16], [-30, -46]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="3" fill="#6E685E"/>`).join('')}</g>` : '') +
    (o.shine ? `<path d="M-40 -48 l6 -14 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 Z" fill="#FFF6B0" stroke="${INK}" stroke-width="3" transform="translate(70 -40) scale(${f1(o.shine * 100) / 100})"/>` : '') + `</g>`; }
// 신발 상자. 원점 = 바닥 가운데
function soBox(x, y, s, o = {}) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000}) rotate(${f1(o.rot || 0)})"><rect x="-100" y="-104" width="200" height="104" rx="8" fill="#F4A259" stroke="${INK}" stroke-width="7"/><rect x="-108" y="-122" width="216" height="30" rx="8" fill="#F7B977" stroke="${INK}" stroke-width="7"/>` +
    `<g transform="translate(0 -52) scale(.55)">${soShoe(0, 20, 1, { c: '#fff', ac: SO_MINT })}</g></g>`; }
// 신발장(열린 칸 3단). 위판 윗면 y = top
const CAB = { x0: 1100, x1: 1500, top: 760, floor: 1000 };
function soCabinet(dust, extra = '') { const { x0, x1, top, floor } = CAB, h = floor - top;
  let g = `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${h}" rx="10" fill="#C89A6A" stroke="${INK}" stroke-width="8"/><rect x="${x0 - 14}" y="${top - 16}" width="${x1 - x0 + 28}" height="22" rx="8" fill="#B5845A" stroke="${INK}" stroke-width="8"/>`;
  const tiers = [top + 80, top + 160, floor - 6];
  tiers.forEach((ty, i) => { g += `<rect x="${x0 + 14}" y="${ty - 66}" width="${x1 - x0 - 28}" height="66" fill="#8E6A48" opacity=".55"/>` + (i < 2 ? `<line x1="${x0}" y1="${ty}" x2="${x1}" y2="${ty}" stroke="${INK}" stroke-width="7"/>` : ''); });
  // 평범한 신발들
  const plain = [[1170, tiers[0], '#4A4A55'], [1300, tiers[0], '#B8A48A'], [1420, tiers[0], '#5B6B9A'], [1180, tiers[1], '#E9E2D4'], [1330, tiers[1], '#3B3F4E'], [1440, tiers[1], '#C9B79C']];
  plain.forEach(([sx, sy, c], i) => { g += soShoe(sx, sy, 0.62, { c, ac: '#fff', flip: i % 2 }); });
  g += soShoe(1190, tiers[2], 0.62, { c: '#8A8F99', ac: '#fff' }) + extra + soShoe(1430, tiers[2], 0.62, { c: '#6E5A48', ac: '#C9B79C', flip: 1 });
  return g; }
const CAB_SNEAKER = [1310, CAB.floor - 6]; // 주인공 운동화 자리(맨 아래 칸 가운데)
// 꼬르륵이. 원점 = 발바닥 가운데. o.puff: 몸 부풀기(원함), o.mouth: 'smile'|'o'|'grin', o.talk: 0~1, o.eyes: 'norm'|'heart'|'shut'
function soKko(t, o) { const s = o.s || 1, pf = o.puff || 1, sq = o.sq || 1, look = o.look || [0, 0], R = 58 * pf;
  const bob = o.still ? 0 : Math.sin(t * 5 + 1) * 2.5, cy = -R * sq - 14 + bob;
  let h = `<g transform="translate(${f1(o.x)} ${f1(o.y)}) rotate(${f1(o.rot || 0)}) scale(${f1(s * (o.sx || 1) * 1000) / 1000} ${f1(s * 1000) / 1000})">`;
  h += `<ellipse cx="-22" cy="-6" rx="16" ry="9" fill="#8CC456" stroke="${INK}" stroke-width="5"/><ellipse cx="22" cy="-6" rx="16" ry="9" fill="#8CC456" stroke="${INK}" stroke-width="5"/>`;
  const arm = (sd) => { const up = o.arms === 'up', pt = o.arms === 'point' && sd < 0; const ex = sd * (R + 14), ey = up ? cy - R * 0.9 : pt ? cy - R * 0.5 : cy + R * 0.25;
    return `<path d="M${f1(sd * R * 0.8)} ${f1(cy + 4)} Q${f1(sd * (R + 4))} ${f1(cy + (up ? -20 : 10))} ${f1(ex + (pt ? sd * 26 : 0))} ${f1(ey)}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle cx="${f1(ex + (pt ? sd * 26 : 0))}" cy="${f1(ey)}" r="9" fill="#fff" stroke="${INK}" stroke-width="5"/>`; };
  h += arm(-1) + arm(1);
  h += `<ellipse cx="0" cy="${f1(cy)}" rx="${f1(R)}" ry="${f1(R * sq * 0.96)}" fill="#B5E36B" stroke="${INK}" stroke-width="7"/><ellipse cx="0" cy="${f1(cy + R * 0.35)}" rx="${f1(R * 0.58)}" ry="${f1(R * 0.42 * sq)}" fill="#E8F7C4"/>`;
  // 배 소용돌이(꼬르륵): o.rumble 0~1이면 돌아간다
  const rr = o.rumble ? t * 720 * o.rumble : 0;
  h += `<g transform="translate(0 ${f1(cy + R * 0.38)}) rotate(${f1(rr)})"><path d="M0 0 m-4 0 a4 4 0 1 1 8 0 a8 8 0 1 1 -16 0 a12 12 0 1 1 24 0" fill="none" stroke="#8CC456" stroke-width="4" stroke-linecap="round"/></g>`;
  h += `<path d="M-4 ${f1(cy - R * 0.95)} q-6 -22 10 -26 q10 -2 6 10" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  const ex = look[0] * 6, ey = look[1] * 5, eY = cy - R * 0.28;
  if (o.eyes === 'heart') [-1, 1].forEach(sd => { h += `<path transform="translate(${f1(sd * 20 + ex)} ${f1(eY + ey)}) scale(.9)" d="M0 8 C-14 -2 -12 -14 -4 -14 C0 -14 0 -10 0 -8 C0 -10 0 -14 4 -14 C12 -14 14 -2 0 8 Z" fill="#FF5A7A" stroke="${INK}" stroke-width="3"/>`; });
  else if (o.eyes === 'shut') [-1, 1].forEach(sd => { h += `<path d="M${f1(sd * 20 - 9)} ${f1(eY)} q9 8 18 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`; });
  else [-1, 1].forEach(sd => { h += `<ellipse cx="${f1(sd * 20)}" cy="${f1(eY)}" rx="11" ry="13" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="${f1(sd * 20 + ex)}" cy="${f1(eY + ey + 1)}" r="7" fill="${INK}"/><circle cx="${f1(sd * 20 + ex + 2.5)}" cy="${f1(eY + ey - 2)}" r="2.6" fill="#fff"/>`; });
  h += `<ellipse cx="-34" cy="${f1(eY + 16)}" rx="9" ry="5" fill="#FF8FA8" opacity=".55"/><ellipse cx="34" cy="${f1(eY + 16)}" rx="9" ry="5" fill="#FF8FA8" opacity=".55"/>`;
  const mY = cy + R * 0.08, tk = clamp(o.talk || 0, 0, 1);
  if (o.mouth === 'o' || tk > 0.08) { const mh = o.mouth === 'o' ? 14 : 4 + 16 * tk; h += `<ellipse cx="0" cy="${f1(mY + mh * 0.5)}" rx="${f1(14 + 6 * tk)}" ry="${f1(mh)}" fill="#7A2236" stroke="${INK}" stroke-width="5"/><ellipse cx="0" cy="${f1(mY + mh * 1.1)}" rx="9" ry="${f1(Math.max(2, mh * 0.35))}" fill="#FF8FA8"/>`; }
  else h += `<path d="M-26 ${f1(mY)} Q0 ${f1(mY + (o.mouth === 'grin' ? 30 : 20))} 26 ${f1(mY)}" fill="${o.mouth === 'grin' ? '#7A2236' : 'none'}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><rect x="-6" y="${f1(mY + 1)}" width="10" height="9" rx="2" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
  if (o.drool) { const k = (t * 0.9) % 1; h += `<path d="M14 ${f1(mY + 12)} q-6 ${f1(10 + 14 * k)} 0 ${f1(16 + 14 * k)} q6 -6 0 ${f1(-16 - 14 * k)} Z" fill="#9ED8FF" stroke="${INK}" stroke-width="3"/>`; }
  return HALO(h + `</g>`); }
// 새 운동화를 신은 발: 서 있는/걷는 자세의 발 위치에 작은 운동화를 겹친다
function soFeet(x, y, s, pose, o = {}) { const p = typeof pose === 'string' ? P[pose] : pose, dy = p.dy || 0, sy = o.sy || 1, sx = o.sx || 1;
  return [[p.fL, true], [p.fR, false]].map(([f, left]) => soShoe(x + (f[0] - 200) * s * sx, y + (f[1] + dy + 14 - 560) * s * sy, 0.5 * s, { flip: left, rot: (left ? -1 : 1) * (f[2] || 0) * 0.5, shine: o.shine, dust: o.dust })).join(''); }
const soTag = (t, lt, s0) => tag(t, t - lt + 0.1, t + 9, 260, 120, s0, '#FFE9A8', { size: 42 });

/* ---------- 1. 응모 23번 탈락 → 24번째 당첨 ---------- */
function sodrawScene(t, lt, a) {
  const tW = fAt(a, '당첨', fAt(a, '스물네', 3.0) + 0.6), tS = fAt(a, '스물세', 1.3), cam = qLerpCam(lt / 3, [880, 640, 1.18], [900, 630, 1.24]);
  const n = lt < tW ? Math.min(23, Math.floor(clamp((lt - 0.25) / (tW - 0.55), 0, 1) * 23) + (lt > 0.25 ? 1 : 0)) : 23, won = lt > tW;
  const J = fJump(lt, tW + 0.05, 0.9), x = 700, y = 1000;
  const ex = won ? exprAt([[tW, 'z충격'], [tW + 0.35, 'z반짝'], [tW + 1.1, 'z하트눈']], lt) : fEx(n > 18 ? 'z울먹' : n > 8 ? 'z멍' : 'z기본');
  const slump = won ? 1 : 1 - 0.004 * n;
  let w = qShadow(x, y, 66) + Z({ x, y: y + J.dy, s: 1, sx: J.sx, sy: J.sy * slump, t, pose: won && J.ph > 1 && J.ph < 6 ? '만세' : P['폰보기'], ex, look: won ? [0.6, -0.2] : [0.1, 0.8], seed: 3 });
  if (!(won && J.ph > 1 && J.ph < 6)) w += phone(x, y + J.dy - 236 * slump, 0.36, { on: true, glow: 0.4 });
  if (won && J.ph >= 2 && J.ph <= 4) w += speedLines(x, y - 420, 260, 380, 14, t, '#fff', 0.7);
  // 큰 폰 화면(인서트): 알림이 쌓인다
  let ui = `<g transform="translate(1440 530)"><rect x="-300" y="-430" width="600" height="860" rx="60" fill="#1F2D44" stroke="${INK}" stroke-width="12"/><rect x="-270" y="-398" width="540" height="796" rx="34" fill="${won ? '#FFF3C4' : '#EEF2F7'}"/>`;
  ui += fT(0, -330, '응모 결과', 40, '#5B6478');
  if (!won) { for (let i = 0; i < Math.min(5, n); i++) { const k = n - i, yy = -250 + i * 118, fresh = i === 0 ? easeOutBack(clamp(((lt - 0.25) * 23 / (tW - 0.55)) % 1 * 3, 0, 1)) : 1;
      ui += `<g transform="translate(0 ${yy}) scale(${f1(fresh * 100) / 100})" opacity="${f1((1 - i * 0.16) * 100) / 100}"><rect x="-240" y="-46" width="480" height="96" rx="20" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-190" cy="2" r="26" fill="#E5484D"/><path d="M-200 -8 l20 20 M-180 -8 l-20 20" stroke="#fff" stroke-width="6" stroke-linecap="round"/>${fT(-148, 14, '아쉽게도 미당첨', 32, INK, { anchor: 'start' })}${fT(214, 14, '#' + k, 26, '#9AA1AE', { anchor: 'end', w: 700 })}</g>`; }
    ui += fT(0, 370, n + '번째 탈락', 46, '#E5484D'); }
  else { const g = easeOutBack(clamp((lt - tW) / 0.45, 0, 1));
    ui += `<g transform="scale(${f1(g * 100) / 100})"><circle r="170" fill="#FFD23F" stroke="${INK}" stroke-width="8"/>${fT(0, 30, '당첨!', 96, INK)}</g>` + `<g transform="translate(0 270)">${soShoe(0, 30, 1.3, { shine: 0.8 + 0.2 * Math.sin(t * 8) })}</g>` + fT(0, 380, '#24', 40, '#8A6A2E'); }
  ui += `</g>`;
  let over = '';
  if (won) { for (let i = 0; i < 26; i++) { const k = clamp((lt - tW) / 1.6, 0, 1), ang = i * 2.4, r = 120 + 760 * easeOut(k), cx = 1440 + Math.cos(ang) * r, cy = 450 + Math.sin(ang) * r * 0.6 + k * k * 300; over += `<rect x="${f1(cx)}" y="${f1(cy)}" width="18" height="10" fill="${['#FF5A6E', '#FFD23F', '#7FD6C2', '#7EC8F0'][i % 4]}" transform="rotate(${f1(t * 300 + i * 40)} ${f1(cx)} ${f1(cy)})" opacity="${f1((1 - k * 0.6) * 100) / 100}"/>`; }
    if (lt < tW + 0.8) over += fx(t, t - lt + tW, t + 9, 980, 200, '당첨!!', '#FFD23F', { size: 80 }); }
  return fPlate('bedn', cam, 0.5) + qCam(cam, w) + fFull('#0A1238', won ? 0.05 : 0.22) + ui + over;
}

/* ---------- 2. 1일째: 상자를 안고 빙글 → 침대에서 상자 옆에 잠듦 ---------- */
const HUG = Object.assign({}, P['서기'], { armL: [[148, 285], [124, 338], [160, 372]], hL: [164, 374], armR: [[252, 285], [276, 338], [240, 372]], hR: [236, 374] });
function soday1Scene(t, lt, a) {
  const D = a._dur || 2.5, cutT = Math.min(1.2, D * 0.45);
  if (lt < cutT) { const cam = [960, 640, 1.25], x = 960, y = 1000, sp = 0.93 + 0.07 * Math.cos(lt * 12), hop = Math.abs(Math.sin(lt * 6)) * 30, tw = Math.sin(lt * 6) * 9;
    let w = qShadow(x, y, 66) + `<g transform="rotate(${f1(tw)} ${x} ${y - hop})">` + Z({ x, y: y - hop, s: 1, sx: sp, t, pose: HUG, ex: fEx('z하트눈'), seed: 3 }) + `<g transform="translate(${x} 0) scale(${f1(sp * 100) / 100} 1) translate(${-x} 0)">` + soBox(x, y - hop - 168, 0.9) + `</g></g>`;
    for (let i = 0; i < 5; i++) { const ang = lt * 3 + i * 1.26; w += `<path transform="translate(${f1(x + Math.cos(ang) * 300)} ${f1(y - 420 + Math.sin(ang) * 120)}) scale(1.2)" d="M0 8 C-14 -2 -12 -14 -4 -14 C0 -14 0 -10 0 -8 C0 -10 0 -14 4 -14 C12 -14 14 -2 0 8 Z" fill="#FF8FB1" stroke="${INK}" stroke-width="3"/>`; }
    return fPlate('bedn', cam, 0.5) + qCam(cam, w) + fFull('#FFD9A0', 0.08) + soTag(t, lt, '1일째'); }
  const l2 = lt - cutT, cam = qLerpCam(l2 / 2, [960, 690, 1.35], [960, 680, 1.45]);
  let w = `<rect x="620" y="440" width="680" height="330" rx="44" fill="#5B6B9A" stroke="${INK}" stroke-width="9"/><rect x="650" y="470" width="620" height="40" rx="16" fill="#6E7EB0"/>`;
  w += `<ellipse cx="960" cy="660" rx="260" ry="74" fill="#fff" stroke="${INK}" stroke-width="8"/>`;
  w += Z({ x: 880, y: 1010, s: 1, t, pose: '서기', ex: fEx('z뿌듯'), tilt: 10, seed: 3 });
  w += soBox(1110, 712, 0.78, { rot: -6 });
  w += `<path d="M590 760 Q960 704 1330 760 L1360 1120 L560 1120 Z" fill="#8FA6D8" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M640 800 Q960 760 1280 800" fill="none" stroke="#fff" stroke-width="8" opacity=".35"/>`;
  // 이불 밖으로 나온 팔이 상자를 감싼다
  w += `<path d="M1000 770 Q1040 700 1090 690" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>` + hand(1094, 688, 1.1);
  for (let i = 0; i < 3; i++) { const k = (l2 * 0.7 + i / 3) % 1; w += `<g opacity="${f1(Math.sin(k * Math.PI) * 100) / 100}">${fT(760 - k * 60, 470 - k * 160, 'z', 40 + i * 8, '#fff', { stroke: INK, sw: 6 })}</g>`; }
  return fWhip(l2, fPlate('bedn', cam, 0.6) + qCam(cam, w) + fFull('#0A1238', 0.28)) + soTag(t, lt, '1일째');
}

/* ---------- 3. 3일째: 아껴 신기 (물웅덩이 까치발) ---------- */
function soday3Scene(t, lt, a) {
  const D = a._dur || 2.2, hopT = Math.min(0.75, D * 0.32), x = 960 + (lt - (hopT + 0.3)) * 330, y = 1000;
  const cam = [lerp(860, 1060, clamp(lt / D, 0, 1)), 640, 1.22], J = fJump(lt, hopT, 0.7);
  const air = J.ph > 1 && J.ph < 5, pose = air ? Object.assign({}, P['만세'], { legL: P['웅크림'].legL, legR: P['웅크림'].legR, fL: P['웅크림'].fL, fR: P['웅크림'].fR }) : walkPose(lt * 7, 0.55);
  const ex = exprAt([[0, 'z빵긋'], [hopT - 0.25, 'z당황'], [hopT + 0.7, 'z뿌듯']], lt);
  let w = `<ellipse cx="960" cy="1012" rx="170" ry="30" fill="#6E8FB0" stroke="${INK}" stroke-width="6" opacity=".9"/><ellipse cx="930" cy="1006" rx="70" ry="9" fill="#BFE0FF" opacity=".7"/>`;
  w += qShadow(x, y, 60, air ? 0.5 : 1) + Z({ x, y: y + J.dy, s: 1, sx: J.sx, sy: J.sy, t, pose, ex, look: lt < hopT + 0.7 ? [0.3, 0.9] : [0.4, 0.7], seed: 3 });
  w += soFeet(x, y + J.dy, 1, pose, { sx: J.sx, sy: J.sy, shine: lt > hopT + 0.6 ? 0.6 + 0.3 * Math.sin(t * 9) : 0 });
  return fPlate('street', cam, 0.5) + qCam(cam, w) + warm(0.15) + soTag(t, lt, '3일째') + (lt > hopT + 0.25 && lt < hopT + 0.9 ? fx(t, t - lt + hopT + 0.25, t + 9, 1120, 330, '휴~', '#BFE6FF', { size: 54 }) : '');
}

/* ---------- 4. 14일째: 그냥 신발 ---------- */
const SOZ = { x: 820, y: 1000 };
const PHONE_LOOK = P['폰보기'];
function soday14Scene(t, lt, a) {
  const D = a._dur || 3, tJ = fAt(a, '그냥', D * 0.55), cam = qLerpCam(prog(lt, 0.2, tJ + 0.4), [1400, 950, 2.6], [1080, 700, 1.2]);
  let w = soCabinet(0, soShoe(CAB_SNEAKER[0], CAB_SNEAKER[1], 0.62, { dust: clamp(lt / 1.2, 0, 1) }));
  w += qShadow(SOZ.x, SOZ.y, 66) + Z({ x: SOZ.x, y: SOZ.y, s: 1, t, pose: PHONE_LOOK, ex: fEx('z멍'), look: [0.1, 0.8], seed: 3 }) + phone(SOZ.x, SOZ.y - 236, 0.36, { on: true, glow: 0.5 });
  let over = '';
  if (lt > tJ) over += pop(t, t - lt + tJ, t + 99, 1185, 540, label(0, 0, '다음 드롭 D-3', { size: 40, bg: '#FFE34D' }), { rot: -4 });
  return fPlate('genkan', cam, 0.55) + qCam(cam, w) + soTag(t, lt, '14일째') + over;
}

/* ---------- 5. 현관: 질문 → 꼬르륵 → 꼬르륵이 등장 → "다음 거!" → 범인 ---------- */
const KKO_ON = [1240, CAB.top - 16]; // 꼬르륵이가 서는 곳: 신발장 위판
function sohallScene(t, lt, a) {
  const ph = a.ph, x = SOZ.x, y = SOZ.y;
  let cam = [960, 660, 1.2], w = '', over = '', zEx = fEx('z기본'), look = [0.1, 0.8], pose = PHONE_LOOK, holdPhone = true, kko = null;
  const dustShoe = soShoe(CAB_SNEAKER[0], CAB_SNEAKER[1], 0.62, { dust: 1 });
  if (ph === 1) { const tL = fAt(a, '그렇게', 0.1), tQ = fAt(a, '행복', 2.4), tS = fAt(a, '짧을', 3.4);
    cam = qLerpCam(lt / 4, [980, 660, 1.2], [960, 640, 1.3]);
    look = lt < tQ ? [0.9, 0.7] : [0.1, 0.8]; zEx = lt < tQ ? fEx('z멍') : exprAt([[tQ, 'z기본'], [tS, 'z의심']], lt);
  }
  if (ph === 2) { // 꼬르륵… 배를 내려다봄 → 뿅
    const tR = 0.25, tPop = 1.0, tLand = 1.55, k = clamp((lt - tPop) / (tLand - tPop), 0, 1);
    cam = qLerpCam(prog(lt, 0.2, 1.0), [960, 640, 1.3], [1040, 730, 1.55]);
    zEx = exprAt([[0, 'z기본'], [tR + 0.05, 'z당황'], [tPop + 0.1, 'z충격']], lt); look = lt > tR ? [0, 0.95] : [0.1, 0.8];
    if (lt > tR && lt < tPop) w += `<g transform="translate(${x} ${y - 175})">${[0, 1, 2].map(i => `<path d="M${-30 + i * 30} 0 q8 -14 16 0" fill="none" stroke="#8CC456" stroke-width="5" opacity="${f1((0.5 + 0.5 * Math.sin(t * 20 + i)) * 100) / 100}"/>`).join('')}</g>`;
    if (lt > tPop) { const sx0 = x + 40, sy0 = y - 170, ex0 = KKO_ON[0], ey0 = KKO_ON[1];
      const kx = lerp(sx0, ex0, easeOut(k)), ky = lerp(sy0, ey0, k) - Math.sin(k * Math.PI) * 230, landSq = k >= 1 ? 1 - 0.18 * Math.exp(-(lt - tLand) * 9) * Math.cos((lt - tLand) * 20) : 1;
      kko = { x: kx, y: ky, s: lerp(0.3, 1, easeOutBack(clamp((lt - tPop) / 0.35, 0, 1))), sq: landSq, rot: k < 1 ? k * 360 : 0, eyes: lt > tLand + 0.35 ? 'heart' : 'norm', mouth: lt > tLand + 0.35 ? 'grin' : 'o', look: [-0.5, 0.2], drool: lt > tLand + 0.5, arms: k < 1 ? 'up' : 'down' };
      if (lt < tPop + 0.5) over += fx(t, t - lt + tPop, t + 9, 1010, 540, '뿅!', '#B5E36B', { size: 64 }); } }
  if (ph === 3) { cam = [1060, 720, 1.5]; zEx = fEx('z당황'); look = [0.9, 0.3];
    kko = { x: KKO_ON[0], y: KKO_ON[1], puff: 1 + 0.25 * clamp(lt / 1.2, 0, 1), talk: env(t), eyes: lt < 0.9 ? 'norm' : 'heart', arms: lt > 1.0 ? 'point' : 'down', look: [-0.6, -0.5], rumble: lt < 1.0 ? 1 : 0, drool: lt < 1.0 }; }
  if (ph === 4) { const tB = fAt(a, '범인', 0.1), tY = fAt(a, '200', fAt(a, '이백', 2.8));
    cam = qLerpCam(prog(lt, 0, 0.6), [1060, 720, 1.5], [1150, 700, 1.7]); zEx = fEx('z당황'); look = [0.9, 0.3];
    kko = { x: KKO_ON[0], y: KKO_ON[1], puff: 1.25, eyes: 'heart', mouth: 'grin', arms: 'point', look: [-0.6, -0.5], drool: true, still: lt > tB && lt < tY };
    if (lt > tB) over += pop(t, t - lt + tB, t + 99, 1450, 250, `<g transform="rotate(3)"><rect x="-300" y="-150" width="600" height="300" rx="26" fill="#fff" stroke="${INK}" stroke-width="9"/><rect x="-300" y="-150" width="600" height="24" rx="12" fill="#B5E36B"/>${fT(0, -64, '꼬르륵이', 64, INK)}${fT(-250, 6, '특기: 끝없이 원하기', 34, '#5B6478', { anchor: 'start', w: 700 })}${fT(-250, 60, '배부름: ', 34, '#5B6478', { anchor: 'start', w: 700 })}<rect x="-80" y="38" width="300" height="30" rx="15" fill="#EEF2F7" stroke="${INK}" stroke-width="4"/><rect x="-78" y="40" width="${f1(10 + 6 * Math.abs(Math.sin(t * 5)))}" height="26" rx="13" fill="#E5484D"/></g>`, {});
    if (lt > tY) over += fFull('#B08A50', 0.35 * clamp((lt - tY) / 1.2, 0, 1)); }
  w += soCabinet(1, dustShoe);
  w += qShadow(x, y, 66) + Z({ x, y, s: 1, t, pose, ex: zEx, look, seed: 3 }) + (holdPhone ? phone(x, y - 236, 0.36, { on: true, glow: 0.4 }) : '');
  if (kko) w += soKko(t, kko);
  if (ph >= 3 || (ph === 2 && lt > 1.9)) w += `<g transform="translate(${x + 260} ${y - 560})">${bubble(0, 0, 260, 150, `<g transform="translate(0 38)">${soShoe(0, 0, 1.1, { c: '#FF8FB1', ac: '#FFD23F', shine: 0.7 + 0.3 * Math.sin(t * 7) })}</g>${fT(0, -36, 'NEW', 28, '#E5484D')}`, {})}</g>`;
  return fPlate('genkan', cam, 0.55) + qCam(cam, w) + over;
}

/* ---------- 6. 타이틀 ---------- */
function sotitleScene(t, lt, a) { return window.ftitleScene(t, lt, a); }

/* ---------- 7. 이름 카드: 아르투어 쇼펜하우어 + 푸들 + 시계추 ---------- */
// 쇼펜하우어: 대머리 + 양옆으로 뻗친 흰 머리 + 어두운 코트
const SO_TUFT = `<g fill="#F4F4F4" stroke="${INK}" stroke-width="6" stroke-linejoin="round">${[-1, 1].map(sd => { const c = 200 + sd * 96, X = d => f1(c + sd * d); return `<path d="M${X(0)} 96 L${X(74)} 58 L${X(46)} 112 L${X(104)} 118 L${X(52)} 158 L${X(96)} 196 L${X(34)} 200 L${X(56)} 240 L${X(4)} 214 Z"/>`; }).join('')}</g>`;
const SCH = o => HALO(char(Object.assign({ goggles: 'none', vest: '#3B3F4E', patch: false, tee: true, vshade: 'rgba(0,0,0,0.3)', collar: true, tie: '#F4F1EA', hairBack: SO_TUFT, browW: 15, seed: 71 }, o)));
function soPoodle(x, y, s, t, o = {}) { const wag = Math.sin(t * 9) * 14;
  const puffC = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
  return HALO(`<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1((o.flip ? -s : s) * 1000) / 1000} ${f1(s * 1000) / 1000})">` +
    `<g stroke="${INK}" stroke-width="7" stroke-linecap="round"><line x1="-50" y1="-50" x2="-54" y2="-6"/><line x1="-30" y1="-50" x2="-28" y2="-6"/><line x1="36" y1="-50" x2="38" y2="-6"/><line x1="56" y1="-50" x2="60" y2="-6"/></g>` +
    puffC(-54, -4, 11) + puffC(-28, -4, 11) + puffC(38, -4, 11) + puffC(60, -4, 11) +
    `<ellipse cx="4" cy="-70" rx="76" ry="38" fill="#fff" stroke="${INK}" stroke-width="6"/>` + `<g transform="rotate(${f1(wag)} -70 -86)"><line x1="-70" y1="-86" x2="-96" y2="-120" stroke="${INK}" stroke-width="6"/>${puffC(-100, -126, 16)}</g>` +
    puffC(70, -120, 34) + puffC(56, -150, 22) + `<ellipse cx="108" cy="-110" rx="22" ry="14" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="128" cy="-112" r="6" fill="${INK}"/><circle cx="78" cy="-124" r="5" fill="${INK}"/><ellipse cx="54" cy="-104" rx="14" ry="22" fill="#EDEDED" stroke="${INK}" stroke-width="5"/></g>`); }
function soPendulum(cx, top, len, ang, o = {}) {
  const bx = cx + Math.sin(ang) * len, by = top + Math.cos(ang) * len;
  return `<g opacity="${f1((o.op == null ? 1 : o.op) * 100) / 100}"><circle cx="${cx}" cy="${top}" r="12" fill="#B08A50" stroke="${INK}" stroke-width="6"/><line x1="${cx}" y1="${top}" x2="${f1(bx)}" y2="${f1(by)}" stroke="#B08A50" stroke-width="12"/><line x1="${cx}" y1="${top}" x2="${f1(bx)}" y2="${f1(by)}" stroke="${INK}" stroke-width="4" opacity=".4"/><circle cx="${f1(bx)}" cy="${f1(by)}" r="${o.r || 70}" fill="#E8B84A" stroke="${INK}" stroke-width="9"/><circle cx="${f1(bx - 20)}" cy="${f1(by - 22)}" r="16" fill="#fff" opacity=".45"/></g>`; }
function sonameScene(t, lt, a) {
  const D = a._dur || 7, tN = fAt(a, '아르투어', 0.8), tP = fAt(a, '시계추', D - 2.0), cam = qLerpCam(lt / D, [980, 600, 1.12], [1000, 590, 1.2]);
  const x = 1180, y = 1000, enter = easeOut(clamp(lt / 0.8, 0, 1)), pointing = lt > tP;
  let w = '';
  const pose = pointing ? Object.assign({}, P['주머니'], { armL: [[148, 285], [96, 230], [70, 170]], hL: [66, 160] }) : '주머니';
  w += qShadow(x + 300 * (1 - enter), y, 66) + SCH({ x: x + 300 * (1 - enter), y, s: 1, t, pose: lt < 0.8 ? walkPose(lt * 7, 0.5) : pose, ex: exprAt([[0, 'z의심'], [tN + 0.6, 'z삐짐'], [tP, 'z히죽']], lt), look: pointing ? [-0.4, -0.6] : [-0.8, 0.1] });
  w += soPoodle(x - 230 + 300 * (1 - enter), y, 0.75, t);
  // 이름 카드(왼쪽)
  let over = '';
  if (lt > tP - 0.6) { const k = clamp((lt - tP + 0.6) / 0.6, 0, 1), ang = Math.sin((lt - tP) * 2.8) * 0.32 * Math.min(1, k * 1.5); over += `<g transform="translate(0 ${f1(-520 * (1 - easeOutBack(k)))})">${soPendulum(990, -60, 400, ang, { r: 62 })}</g>`; }
  if (lt > tN - 0.3) over += pop(t, t - lt + tN - 0.3, t + 99, 470, 520, `<g transform="rotate(-2)"><rect x="-330" y="-190" width="660" height="380" rx="20" fill="#F3E7CC" stroke="${INK}" stroke-width="9"/><rect x="-306" y="-166" width="612" height="332" rx="12" fill="none" stroke="#B08A50" stroke-width="4"/>${fT(0, -70, '아르투어', 56, '#3B2F22')}${fT(0, 10, '쇼펜하우어', 82, '#3B2F22')}${fT(0, 92, '1788 ~ 1860 · 독일', 34, '#7A6650', { w: 700 })}</g>`, {});
  return fPlate('study19', cam, 0.5) + qCam(cam, w) + warm(0.25) + over;
}
SO.forEach(k => { const f = window[k + 'Scene']; if (!f) { console.error('missing ' + k); return; } window[k + 'Scene'] = (...x) => qDefs() + fNeonDefs() + f(...x); });
