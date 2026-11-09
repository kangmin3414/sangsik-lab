/* 축의금 편(gift01) 장면 2: 깨달음(1979 실험) → 감동(서랍 속 쪽지·도서관) → 여운(예식장). gfscenes.js 다음에 불러온다. */
Object.assign(CAMS, { gfbal: 'fixed', gflab: 'fixed', gfsplit: 'fixed', gfcounter: 'fixed', gfmorning: 'fixed', gfnote: 'fixed', gflib: 'fixed', gferror: 'fixed', gfguard: 'fixed', gfsuit: 'fixed', gfhall: 'fixed' });
// 다른 인물(얼굴은 ACT 리그). o: char 옵션(vest·hair·collar·tie 등)
const gfP = (key, face, o) => { E[key] = ACT.face(Object.assign({ id: key, t: o.t }, face)); return HALO(char(Object.assign({ goggles: 'none', patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', ex: fEx(key), noBlink: true, noMouth: true }, o))); };
const gfSepia = (k = 1) => `<rect x="-300" y="-200" width="2600" height="1500" fill="#7A5A30" style="mix-blend-mode:color" opacity="${f1(0.7 * k * 100) / 100}"/><rect x="-300" y="-200" width="2600" height="1500" fill="#F3DFB8" opacity="${f1(0.12 * k * 100) / 100}"/>`;
const gfWarmAM = (k = 1) => `<circle cx="300" cy="200" r="1100" fill="url(#gfLamp)" opacity="${f1(0.35 * k * 100) / 100}"/>`;
const GF_GLASS = `<g fill="none" stroke="#3A2A1A" stroke-width="7"><rect x="138" y="166" width="54" height="46" rx="12"/><rect x="208" y="166" width="54" height="46" rx="12"/><path d="M192 184 Q200 178 208 184"/></g>`; // 1979년 뿔테
const gfHeart = (x, y, s, op = 1) => `<path d="${zHeartP(x, y, s)}" fill="#FF6B8B" stroke="${INK}" stroke-width="${f1(4 / Math.max(0.4, s) * 0.9)}" opacity="${f1(op * 100) / 100}"/>`;
// 호감 게이지(세로 막대 + 하트). v: 0~1
const gfGauge = (x, y, v, tag) => `<g transform="translate(${x} ${y})"><rect x="-26" y="-190" width="52" height="200" rx="16" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="-18" y="${f1(2 - 184 * v)}" width="36" height="${f1(184 * v)}" rx="10" fill="#FF6B8B"/>` +
  `<path d="${zHeartP(0, -224, 0.75)}" fill="#FF6B8B" stroke="${INK}" stroke-width="4"/>${fT(0, 50, tag || '호감', 30, '#fff', { stroke: INK })}</g>`;

/* =========== 9. 셈이 딱 맞는 순간: 저울이 수평 → 위의 하트가 사라짐 =========== */
function gfbalScene(t, lt, a) {
  const tEq = gfW(a, ['딱', '맞는'], 1.6), tGone = gfW(a, ['사라지는'], 3.2);
  const cam = qLerpCam(lt / 5, [960, 520, 1.2], [960, 505, 1.27]), cx = 960, cy = 600;
  const tilt = lerp(9, 0, easeInOut(gfK(lt, tEq - 0.3, tEq + 0.3))) + (lt > tEq + 0.3 ? 0 : Math.sin(lt * 4) * 0.8), rad = tilt * Math.PI / 180;
  let g = `<rect x="-300" y="-200" width="2600" height="1500" fill="#EFE3CB"/><rect x="-300" y="860" width="2600" height="500" fill="#D9C7A6"/><line x1="-300" y1="860" x2="2300" y2="860" stroke="${INK}" stroke-width="7"/>`;
  const pan = (sd, n, lab) => { const px = cx + sd * 260 * Math.cos(rad), py = cy - 280 + sd * 260 * Math.sin(rad);
    return `<path d="M${f1(px)} ${f1(py)} L${f1(px - 100)} ${f1(py + 170)} M${f1(px)} ${f1(py)} L${f1(px + 100)} ${f1(py + 170)}" stroke="${INK}" stroke-width="6"/><path d="M${f1(px - 125)} ${f1(py + 170)} Q${f1(px)} ${f1(py + 225)} ${f1(px + 125)} ${f1(py + 170)} Z" fill="#E8C873" stroke="${INK}" stroke-width="7"/>` +
      [...Array(n)].map((_, i) => `<rect x="${f1(px - 68 + i * 48)}" y="${f1(py + 124)}" width="42" height="42" rx="6" fill="#FFF8EC" stroke="${INK}" stroke-width="5"/>`).join('') + label(px, py + 262, lab, { size: 40, bg: '#fff' }); };
  const nL = lt > tEq - 0.35 ? 2 : 1;
  g += `<rect x="${cx - 140}" y="${cy + 210}" width="280" height="50" rx="12" fill="#5B4636" stroke="${INK}" stroke-width="7"/><path d="M${cx} ${cy + 210} L${cx} ${cy - 280}" stroke="${INK}" stroke-width="14"/><circle cx="${cx}" cy="${cy - 282}" r="19" fill="#E8C873" stroke="${INK}" stroke-width="6"/>` +
    `<path d="M${f1(cx - 260 * Math.cos(rad))} ${f1(cy - 280 - 260 * Math.sin(rad))} L${f1(cx + 260 * Math.cos(rad))} ${f1(cy - 280 + 260 * Math.sin(rad))}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
    pan(-1, nL, '받은 것') + pan(1, 2, '준 것');
  // 수평이 되는 순간 '딱!', 위에 떠 있던 하트가 흐려지며 사라짐
  if (lt > tEq && lt < tEq + 0.7) g += `<g transform="translate(${cx + 190} ${cy - 400}) scale(${f1(ACT.symK(lt, tEq, tEq + 0.45) * 100) / 100})">${fT(0, 0, '딱!', 70, '#fff', { stroke: INK })}</g>`;
  const hk = 1 - easeInOut(gfK(lt, tGone - 0.1, tGone + 1.0)), bob = Math.sin(lt * 2.4) * 8;
  if (hk > 0.01) g += `<g opacity="${f1(hk * 100) / 100}" transform="translate(0 ${f1(bob - 30 * (1 - hk))})">${gfHeart(cx, cy - 430, 1.5)}</g>` + (hk < 0.95 ? [0, 1, 2, 3].map(i => `<circle cx="${f1(cx + (i - 1.5) * 50 * (2 - hk))}" cy="${f1(cy - 430 - 70 * (1 - hk) - i * 6)}" r="${f1(6 * hk + 2)}" fill="#FF9AAE" opacity="${f1(hk * 100) / 100}"/>`).join('') : '');
  return gfDefs() + qCam(cam, g) + gfSepia(0.8);
}

/* =========== 10. 1979 실험실 =========== */
// 제로(참가자, 뿔테)는 왼쪽 칸, 상대는 오른쪽 칸. 칸막이 구멍으로 글자 타일을 넘겨 과제를 돕는다
const GF_L = { FY: 985, ZX: 560, PX: 1380, SLOT: [982, 640] };
const gfLabZ = (key, face, o) => acZ(key, Object.assign({ fx: GF_GLASS }, face), Object.assign({ x: GF_L.ZX, y: GF_L.FY, s: 1.0, seed: 61 }, o));
const gfTile = (x, y, ch, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><rect x="-24" y="-24" width="48" height="48" rx="7" fill="#FFF3D6" stroke="${INK}" stroke-width="5"/>${fT(0, 14, ch, 34, INK)}</g>`;
const gfToken = (x, y, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><circle r="24" fill="#F2C94C" stroke="${INK}" stroke-width="5"/>${fT(0, 10, '+1', 24, INK)}</g>`;
const gfNote = (x, y, txt, s = 1, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><rect x="-70" y="-34" width="140" height="68" rx="6" fill="#fff" stroke="${INK}" stroke-width="5"/>${fT(0, 10, txt, 26, INK)}</g>`;
function gflabScene(t, lt, a) {
  const ph = a.ph, run = a._run;
  if (ph === 0) return gfbalScene(t, lt, a);
  // n5: '1979년'에 이름표, '도와주면'에 타일 넘김, '고맙다고만'에 쪽지 돌아옴, '바로 갚았습니다'에 토큰 돌아옴
  const tHelp = gfW(a, ['도와주면'], 6.5), tThank = gfW(a, ['고맙다고만'], 8.2), tRepay = gfW(a, ['갚았습니다', '바로'], 9.7);
  const cam = lt < tHelp - 0.6 ? qLerpCam(lt / 5, [960, 560, 1.0], [960, 560, 1.06]) : qLerpCam((lt - tHelp + 0.6) / 3, [960, 600, 1.25], [980, 590, 1.32]);
  let ch = qShadow(GF_L.ZX, GF_L.FY, 74) + qShadow(GF_L.PX, GF_L.FY, 74);
  // 타일 3장: 제로 손 → 구멍 → 상대 쪽 탁자
  const push = gfK(lt, tHelp - 0.35, tHelp + 0.5), [sx, sy] = GF_L.SLOT;
  const zh = ptOf(GF_L.ZX, GF_L.FY, 1.0, 296, 336);
  const TBL = 862;   // 탁자 윗면(배경 판)
  const tiles = ['ㄱ', 'ㅏ', 'ㄴ'].map((c, i) => { const u = clamp(push * 1.4 - i * 0.2, 0, 1); let x, y;
    if (u <= 0) { x = zh[0] + 8 + i * 14; y = zh[1] - 26 - i * 6; }                    // 손에 쥔 채
    else if (u < 0.5) { x = lerp(zh[0] + 8, sx, u * 2); y = lerp(zh[1] - 26, sy, u * 2); }
    else { const v = (u - 0.5) * 2; x = lerp(sx, sx + 150 + i * 56, v); y = lerp(sy, TBL - 24, easeIn(v)); }
    return gfTile(x, y, c, (i - 1) * 8); }).join('');
  const back1 = gfK(lt, tThank - 0.2, tThank + 0.5), back2 = gfK(lt, tRepay - 0.3, tRepay + 0.4);
  const ph1 = ptOf(GF_L.PX, GF_L.FY, 1.0, 70, 330);
  const fly = (k, draw) => { if (k <= 0) return draw(ph1[0] - 10, ph1[1] - 20); const x = k < 0.5 ? lerp(ph1[0], sx, k * 2) : lerp(sx, 780, (k - 0.5) * 2), y = k < 0.5 ? lerp(ph1[1] - 20, sy, k * 2) : lerp(sy, TBL - 30, easeIn((k - 0.5) * 2)); return draw(x, y); };
  const retNote = lt > tThank - 0.6 && back2 === 0 ? fly(back1, (x, y) => gfNote(x, y, '고마워요', 0.9, -6)) : '';
  const retTok = lt > tRepay - 0.7 ? fly(back2, (x, y) => gfToken(x, y, 1.2)) : '';
  // 제로: 타일을 내밀고(오른손) → 돌아온 걸 받아 봄
  const reach = clamp(A2.actK(lt, tHelp - 0.45, 0.35, { anticAmt: 0.1 }), -0.1, 1.05) * (1 - clamp(A2.actK(lt, tHelp + 0.6, 0.35, { antic: 0, anticAmt: 0, over: 0 }), 0, 1));
  const zPose = A2.blend(A2.pose({ hR: [270, 380] }), A2.pose({ hR: [296, 336], bend: { aR: 1 } }), reach, 0.2);
  const zLook = ACT.saccade(lt, [[0, [0.3, 0.1]], [tHelp - 0.5, [0.85, 0.2]], [tThank, [0.8, 0.4]]], 0.06, 51);
  const zero = gfLabZ('_gl1', { eyes: { open: 1 - ACT.natBlink(lt, 51), size: 1 + 0.15 * ACT.pulse(lt, tRepay + 0.3, 0.35) }, brow: { raise: 4 + 6 * ACT.pulse(lt, tRepay + 0.3, 0.4) }, mouth: { v: ACT.VIS.M, o: 0, c: 2 }, blush: 0.3 }, { t, pose: zPose, look: zLook, handR: push <= 0 ? 'grip' : (reach > 0.4 ? 'open' : null), handRotR: -10 });
  // 상대: 고개 끄덕 → 쪽지/토큰을 구멍으로
  const give = Math.max(ACT.pulse(lt, tThank - 0.3, 0.6), ACT.pulse(lt, tRepay - 0.35, 0.6));
  const partner = gfP('_gl2', { eyes: { open: 1 - ACT.natBlink(lt, 52) }, brow: {}, mouth: { v: ACT.VIS.M, o: 0, c: 3 }, blush: 0.25 },
    { x: GF_L.PX, y: GF_L.FY, s: 1.0, t, seed: 52, vest: '#8FB3C9', hair: '#3A3030', pose: A2.blend(A2.pose({ hL: [130, 380] }), A2.pose({ hL: [92, 336], bend: { aL: -1 } }), give, 0.2), look: [-0.85, 0.15], handL: 'grip', handRotL: 190 });
  ch += zero + partner + tiles + retNote + retTok;
  const lk = ACT.symK(lt, 0.15, 99), lab = lk > 0.01 ? `<g transform="translate(960 70) scale(${f1(lk * 100) / 100})">${label(0, 0, '1979년 · 클라크 & 밀스 실험(재연)', { size: 44, bg: YEL })}</g>` : '';
  return gfDefs() + qDefs() + qPlate('lab', cam, 0.5) + qCam(cam, ch) + gfSepia(0.45) + lab;
}

/* =========== 11. 두 상대 비교(왼쪽: 친구 될 일 없는 상대 / 오른쪽: 친해지고 싶은 상대) =========== */
function gfsplitScene(t, lt, a) {
  const ph = a.ph, run = a._run;
  // 왼쪽 판(n6): 토큰이 오면 게이지 '띵' 위로 / 오른쪽 판(n7): 같은 토큰에 게이지 '뚝'
  const L6 = TL.lines.find(l => l.id === 'n6'), L7 = TL.lines.find(l => l.id === 'n7'), T = t; // 절대 시각으로 계산(줄을 넘어 이어짐)
  const W6 = k => { const w = (L6.words || []).find(x => x.w.includes(k)); return L6.t0 + (w ? w.t : 1.5); }, W7 = k => { const w = (L7.words || []).find(x => x.w.includes(k)); return L7.t0 + (w ? w.t : 2.5); };
  const tA = W6('갚을') - 0.4, tB = W7('바로') - 0.3, tDrop = W7('떨어졌습니다');
  const upA = easeOutBack(gfK(T, tA + 0.5, tA + 0.9)), dnB = easeInOut(gfK(T, tDrop - 0.2, tDrop + 0.5)), activeR = T > L7.t0 - 0.2;
  let g = `<rect x="-300" y="-200" width="2600" height="1500" fill="#EFE3CB"/>`;
  const panel = (x0, on, inner) => `<g opacity="${on ? 1 : 0.45}"><rect x="${x0}" y="90" width="900" height="900" rx="30" fill="#F9F1E0" stroke="${INK}" stroke-width="8"/><rect x="${x0}" y="840" width="900" height="150" fill="#E2D2B2"/><line x1="${x0}" y1="840" x2="${x0 + 900}" y2="840" stroke="${INK}" stroke-width="6"/>${inner}</g>`;
  // 왼쪽: 제로 + 상대 A(곧 떠날 사람: 여행 가방)
  const gA = easeInOut(gfK(T, tA - 0.35, tA + 0.15)), tkA = T > tA + 0.3;   // 내밂 → 제로 손으로 넘어감
  const TOK = `<g transform="translate(0 -30) scale(0.8)"><circle r="24" fill="#F2C94C" stroke="${INK}" stroke-width="5"/>${fT(0, 10, '+1', 24, INK)}</g>`;
  const zA = gfLabZ('_gs1', { eyes: { open: 1 - ACT.natBlink(T, 61), squint: 0.3 * upA }, brow: { raise: 3 }, mouth: { v: ACT.VIS.M, o: 0, c: lerp(2, 5, upA) }, blush: 0.35 },
    { x: 330, y: 970, s: 0.92, t, look: [0.8, 0.1], pose: A2.pose({ hR: [lerp(250, 300, gA), lerp(412, 336, gA)], bend: { aR: 1 } }), handR: 'grip', holdR: tkA ? TOK : null });
  const pA = gfP('_gs2', { eyes: { open: 1 - ACT.natBlink(T, 62) }, mouth: { v: ACT.VIS.M, o: 0, c: 3 }, blush: 0.2 }, { x: 760, y: 970, s: 0.92, t, seed: 62, vest: '#B9A27E', hair: '#5A4A3A', collar: true, look: [-0.8, 0.1],
    pose: A2.pose({ hL: [lerp(150, 100, gA), lerp(412, 336, gA)], bend: { aL: -1 } }), handL: 'grip', holdL: !tkA ? TOK : null });
  const bag = `<g transform="translate(900 970)"><rect x="-55" y="-110" width="110" height="110" rx="14" fill="#C0392B" stroke="${INK}" stroke-width="6"/><path d="M-22 -110 L-22 -136 L22 -136 L22 -110" fill="none" stroke="${INK}" stroke-width="7"/><rect x="-55" y="-70" width="110" height="10" fill="#8E2A20"/></g>`;
  const left = zA + pA + bag + gfGauge(120, 520, lerp(0.45, 0.85, upA)) + label(510, 150, '친구가 될 일 없는 상대', { size: 40, bg: '#fff' }) +
    (upA > 0.3 ? `<g transform="translate(545 330) scale(${f1(clamp(upA, 0, 1.2) * 100) / 100})">${fT(0, 0, '깔끔!', 52, '#fff', { stroke: INK })}</g>` : '');
  // 오른쪽: 제로 + 상대 B(친해지고 싶은 사람: 손 흔듦)
  const sad = dnB;
  const wave = T < tB - 0.4 ? Math.sin(T * 10) * 14 : 0, gB = easeInOut(gfK(T, tB - 0.35, tB + 0.15)), tkB = T > tB + 0.3;
  const zB2 = gfLabZ('_gs3', { eyes: { open: 1 - ACT.natBlink(T, 63), wet: 0.4 * sad, size: 1 + 0.18 * ACT.pulse(T, tDrop - 0.3, 0.4) }, brow: { worry: 0.8 * sad, raise: 6 * ACT.pulse(T, tDrop - 0.3, 0.4) }, mouth: { v: ACT.VIS.M, o: 0, c: lerp(3, -2, sad), wob: 0.4 * sad }, blush: 0.35 },
    { x: 1310, y: 970, s: 0.92, t, look: [0.8, 0.1 + 0.4 * sad], pose: A2.pose({ hR: [lerp(250, 300, gB), lerp(412, 336, gB)], bend: { aR: 1 } }), handR: 'grip', holdR: tkB ? TOK : null, headDy: 6 * sad });
  const pB = gfP('_gs4', { eyes: { open: 1 - ACT.natBlink(T, 64), squint: 0.4 }, mouth: { v: ACT.VIS.E, o: 0.25, c: 5 }, blush: 0.5 }, { x: 1740, y: 970, s: 0.92, t, seed: 64, vest: '#7ED6A7', hair: '#2F2F33', look: [-0.8, 0],
    pose: T < tB - 0.4 ? A2.pose({ hR: [330 + wave, 200], bend: { aR: 1 } }) : A2.pose({ hL: [lerp(150, 100, gB), lerp(412, 336, gB)], bend: { aL: -1 } }), handR: T < tB - 0.4 ? 'open' : null, handRotR: -80, handL: T < tB - 0.4 ? null : 'grip', holdL: T >= tB - 0.4 && !tkB ? TOK : null });
  const right = zB2 + pB + gfGauge(1080, 520, lerp(0.65, 0.25, dnB)) + label(1470, 150, '친해지고 싶은 상대', { size: 40, bg: YEL }) +
    (dnB > 0.3 ? `<g transform="translate(1310 330) scale(${f1(clamp(dnB, 0, 1.2) * 100) / 100})">${fT(0, 0, '…어?', 52, '#fff', { stroke: INK })}</g>` : '');
  g += panel(60, !activeR || ph === 3, left) + panel(1000, activeR, right);
  // b4: 본전이가 아래에서 튀어나와 항의(계산기 화면은 보이지 않게: 두 팔만 휘저음)
  if (ph === 3) { const pk = A2.spring(lt, 0.05, 3, 0.4), y = lerp(1300, 1000, clamp(pk, 0, 1.1)), sh = Math.sin(lt * 30) * 4;
    g += gfCoin(960 + sh, y, 1.9, { t, eyes: 'wide', brow: 'angry', mouth: 'O', talk: gfTalk(t), look: [0, -0.3], hL: [-90 + Math.sin(lt * 20) * 20, -150], hR: [90 - Math.sin(lt * 20) * 20, -150], legs: 'jump' }) +
      (lt > 0.4 ? label(980, 230, '+1 −1 = 0 인데?!', { size: 48, bg: YEL }) : ''); }
  return gfDefs() + qCam([960, 540, 1.0], g) + gfSepia(0.35);
}

/* =========== 12. 셈하는 사이 vs 가까운 사이 =========== */
function gfcounterScene(t, lt, a) {
  const tSig = gfW(a, ['사이라는', '신호'], 3.0), tNear = gfW(a, ['가까운'], 5.1), tNeed = gfW(a, ['필요할'], 8.1);
  const near = lt >= tNear - 0.2;
  const cam = near ? qLerpCam((lt - tNear + 0.2) / 4, [960, 560, 1.05], [960, 550, 1.12]) : qLerpCam(lt / 4, [960, 560, 1.05], [960, 550, 1.12]);
  let g = `<rect x="-300" y="-200" width="2600" height="1500" fill="#EFE3CB"/><rect x="-300" y="930" width="2600" height="500" fill="#D9C7A6"/><line x1="-300" y1="930" x2="2300" y2="930" stroke="${INK}" stroke-width="7"/>`;
  const FY = 930, AX = 640, BX = 1280;
  if (!near) {
    // 두 사람 사이에 계산대가 쑥 → 영수증 지이익 → 어색한 목례
    const up = easeOutBack(gfK(lt, 0.4, 0.9)), rc = gfK(lt, tSig - 0.6, tSig + 0.8), bow = ACT.pulse(lt, tSig + 0.5, 0.7);
    const zA = acZ('_gc1', { eyes: { open: 1 - ACT.natBlink(lt, 71), flat: 0.2 }, brow: { worry: 0.3 }, mouth: { v: ACT.VIS.M, o: 0, c: 0 }, blush: 0.2 }, { x: AX, y: FY, s: 1.0, t, seed: 61, look: [0.8, 0.2], pose: A2.pose({}), headDy: 14 * bow, tilt: 6 * bow });
    const pB = gfP('_gc2', { eyes: { open: 1 - ACT.natBlink(lt, 72), flat: 0.2 }, mouth: { v: ACT.VIS.M, o: 0, c: 0 }, blush: 0.2 }, { x: BX, y: FY, s: 1.0, t, seed: 72, vest: '#7ED6A7', hair: '#2F2F33', look: [-0.8, 0.2], pose: A2.pose({}), headDy: 14 * bow, tilt: -6 * bow });
    const cy = lerp(FY + 40, FY - 250, clamp(up, 0, 1.1));
    const counter = `<g><rect x="830" y="${f1(cy)}" width="300" height="${f1(FY - cy + 8)}" fill="#5D6E8A" stroke="${INK}" stroke-width="8"/><rect x="810" y="${f1(cy - 24)}" width="340" height="30" rx="8" fill="#8EA3C2" stroke="${INK}" stroke-width="7"/>` +
      `<rect x="900" y="${f1(cy - 110)}" width="160" height="86" rx="10" fill="#2E3440" stroke="${INK}" stroke-width="6"/><rect x="915" y="${f1(cy - 98)}" width="130" height="40" rx="4" fill="#CFE3C2"/>${fT(980, cy - 68, '0원', 28, '#1E2A1A')}` +
      (rc > 0 ? `<path d="M950 ${f1(cy - 110)} L950 ${f1(cy - 110 - 220 * rc)} L1010 ${f1(cy - 110 - 220 * rc)} L1010 ${f1(cy - 110)}" fill="#FBFAF4" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2].map(i => cy - 130 - i * 34 > cy - 110 - 220 * rc ? `<rect x="960" y="${f1(cy - 136 - i * 34)}" width="40" height="7" fill="#C9C5BA"/>` : '').join('') : '') + `</g>`;
    g += qShadow(AX, FY, 74) + qShadow(BX, FY, 74) + zA + pB + counter + label(960, 120, '셈하는 사이', { size: 48, bg: '#fff' });
  } else {
    // 계산대가 내려가 사라지고 두 사람이 가까워짐 → 지친 친구에게 음료 한 병을 건넴(영수증 없음)
    const u = lt - (tNear - 0.2), down = easeIn(gfK(u, 0, 0.5)), close = easeInOut(gfK(u, 0.3, 1.3)), give = easeInOut(gfK(lt, tNeed - 0.7, tNeed - 0.1)), took = lt > tNeed;
    const ax = AX + 180 * close, bx2 = BX - 160 * close, tired = 1 - easeInOut(gfK(lt, tNeed + 0.2, tNeed + 0.8));
    const BOT = `<g transform="translate(0 -26)"><rect x="-13" y="-30" width="26" height="46" rx="7" fill="#B5651D" stroke="${INK}" stroke-width="4"/><rect x="-9" y="-42" width="18" height="13" rx="3" fill="#F2C94C" stroke="${INK}" stroke-width="3.5"/></g>`;
    const zA = acZ('_gc3', { eyes: { open: 1 - ACT.natBlink(lt, 73), squint: took ? 0.4 : 0 }, brow: { worry: 0.4 * (1 - give), raise: 3 }, mouth: took ? { v: ACT.VIS.E, o: 0.25, c: 5 } : { v: ACT.VIS.M, o: 0, c: 1 }, blush: 0.4 },
      { x: ax, y: FY, s: 1.0, t, seed: 61, look: [0.8, 0.3], pose: A2.pose({ hR: [lerp(250, 330, give), lerp(412, 320, give)], bend: { aR: 1 } }), handR: 'grip', holdR: !took ? BOT : null });
    const pB = gfP('_gc4', { eyes: { open: 1 - ACT.natBlink(lt, 74), flat: 0.35 * tired, size: took ? 1.1 : 1 }, brow: { worry: 0.7 * tired }, mouth: took ? { v: ACT.VIS.E, o: 0.3, c: 5 } : { v: ACT.VIS.M, o: 0, c: -2 }, blush: 0.4,
        fx: tt => tired > 0.5 ? ACT.sym('sigh', 210, 248, lt, tNear + 0.3, tNear + 1.4, -1) : '' },
      { x: bx2, y: FY, s: 1.0, t, seed: 72, vest: '#7ED6A7', hair: '#2F2F33', look: [-0.6, 0.3 * tired], headDy: 8 * tired, pose: A2.pose({ hL: [lerp(150, 70, give), lerp(412, 320, give)], bend: { aL: -1 } }), handL: 'grip', holdL: took ? BOT : null });
    const cy = lerp(FY - 250, FY + 60, down);
    if (down < 1) g += `<rect x="830" y="${f1(cy)}" width="300" height="${f1(Math.max(0, FY - cy + 8))}" fill="#5D6E8A" stroke="${INK}" stroke-width="8"/>`;
    g += `<rect x="-300" y="${FY}" width="2600" height="500" fill="#D9C7A6"/><line x1="-300" y1="${FY}" x2="2300" y2="${FY}" stroke="${INK}" stroke-width="7"/>` +
      qShadow(ax, FY, 74) + qShadow(bx2, FY, 74) + zA + pB + label(960, 120, '가까운 사이', { size: 48, bg: YEL }) + (took ? ACT.sym('heart', 960, 380, lt, tNeed + 0.1, 99) : '');
  }
  return gfDefs() + qCam(cam, g) + gfSepia(0.25);
}

/* =========== 13. 결혼식 날 아침 → 서랍(제로 시점) =========== */
const GF_PJ = '#9CC3E6'; // 잠옷
const gfAM = () => `<rect x="-300" y="-200" width="2600" height="1500" fill="#FFE6B0" opacity=".1"/>` + gfWarmAM(1);
// 내려다본 서랍: open(0~1)만큼 당겨 나옴. lift: 봉투 묶음을 들어 올린 정도. 쪽지는 봉투 밑(구석만 보임 → 드러남)
function gfDrawerTop(t, open, lift, glow = 0) {
  GF_SLEEVE = GF_PJ;
  const dy = 230 * open;
  let g = `<rect x="-300" y="-200" width="2600" height="1500" fill="#B98552"/><rect x="-300" y="-200" width="2600" height="1500" fill="url(#gfGrain)" transform="scale(1 3)"/>` +
    `<rect x="-300" y="-200" width="2600" height="1500" fill="#FFE6B0" opacity=".12"/>` +
    // 책상 앞 모서리(위) → 서랍 상자(아래로 당겨짐)
    `<rect x="320" y="${f1(170 + dy)}" width="1280" height="${f1(620)}" rx="14" fill="#8A5C34" stroke="${INK}" stroke-width="9"/><rect x="350" y="${f1(200 + dy)}" width="1220" height="${f1(560)}" rx="8" fill="#6E4626"/>` +
    `<rect x="-300" y="-200" width="2600" height="${f1(370)}" fill="#B98552"/><rect x="-300" y="-200" width="2600" height="370" fill="url(#gfGrain)" transform="scale(1 3)"/><line x1="-300" y1="170" x2="2300" y2="170" stroke="${INK}" stroke-width="9"/>`;
  // 서랍 속: 펜·클립 + 쪽지(봉투 밑) + 봉투 묶음
  const iy = 380 + dy;
  g += `<rect x="440" y="${f1(iy + 120)}" width="260" height="22" rx="10" fill="#3D7BF7" stroke="${INK}" stroke-width="5" transform="rotate(-12 570 ${f1(iy + 131)})"/><rect x="1350" y="${f1(iy + 150)}" width="150" height="18" rx="8" fill="#E5484D" stroke="${INK}" stroke-width="5" transform="rotate(20 1425 ${f1(iy + 159)})"/>` +
    `<g transform="translate(980 ${f1(iy + 60)}) rotate(-8)"><path d="M-150 -95 L140 -110 L158 -10 L150 96 L-140 104 L-160 10 Z" fill="#FFE27A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-120 -40 L120 -52 M-60 -100 L-40 100 M60 -105 L80 98" stroke="#E2B93B" stroke-width="5"/><path d="M-140 60 L-90 30 L-40 70 L10 40 L70 80 L130 50 M-100 -80 L-70 -20 L-110 20" fill="none" stroke="#D9A92B" stroke-width="4" stroke-linejoin="round"/>` +
    (glow > 0 ? `<path d="M-150 -95 L140 -110 L158 -10 L150 96 L-140 104 L-160 10 Z" fill="none" stroke="#FFF3B0" stroke-width="${f1(10 + 10 * glow)}" opacity="${f1(glow * 0.8 * 100) / 100}"/>` : '') + `</g>`;
  const ly = iy + 40 - 380 * easeInOut(lift), ls = 1 + 0.2 * lift;
  g += `<g transform="translate(${f1(960 + 120 * lift)} ${f1(ly)}) rotate(${f1(4 - 10 * lift)}) scale(${f1(ls * 100) / 100})">` + [2, 1, 0].map(i => `<rect x="${-210 + i * 8}" y="${-130 - i * 10}" width="420" height="260" rx="10" fill="#fff" stroke="${INK}" stroke-width="7"/>`).join('') +
    `<rect x="-215" y="-20" width="430" height="20" fill="#E5484D" stroke="${INK}" stroke-width="4"/></g>`;
  return g;
}
function gfmorningScene(t, lt, a) {
  const ph = a.ph, run = a._run;
  const tOpen = ph === 1 ? gfW(a, ['서랍을'], 5.2) : 99;
  if (ph === 1 && lt >= tOpen - 0.25) {
    // 제로 시점: 두 손이 서랍 손잡이를 잡아당김
    const op = easeOutBack(gfK(lt, tOpen - 0.15, tOpen + 0.45)), dy = 230 * clamp(op, 0, 1.1);
    let g = gfDrawerTop(t, clamp(op, 0, 1.1), 0) + `<rect x="-300" y="760" width="2600" height="500" fill="url(#gfBody)"/>`;
    g += gfPovHand(-120, 1350, 640, 830 + dy * 0.9, 74) + gfPovHand(2040, 1350, 1280, 830 + dy * 0.9, 74);
    return gfDefs() + qCam(qLerpCam((lt - tOpen) / 1.5, [960, 560, 1.0], [960, 600, 1.06]), g);
  }
  // 아침 책상: 잠옷 차림 제로가 기지개 → 청첩장을 보다 한숨 → 머리 긁적
  const stretch = ph === 0 ? clamp(A2.actK(run, 0.2, 0.45, { anticAmt: 0.1 }), -0.1, 1.1) * (1 - clamp(A2.actK(run, 1.2, 0.4, { antic: 0, anticAmt: 0, over: 0 }), 0, 1)) : 0;
  const scratch = ph === 1 && lt > 2.2 && lt < 4.2 ? 1 : 0, sg = ph === 1 ? ACT.sigh(lt, 0.5, 0.45, 0.9) : 0;
  const pose = stretch > 0.02 ? A2.blend(A2.pose({ hL: [168, 392], hR: [236, 392] }), A2.pose({ hL: [36, 196], hR: [364, 196], bend: { aL: -1, aR: 1 } }), stretch, 0.2)
    : scratch ? A2.pose({ hL: [168, 392], hR: [292 + Math.sin(lt * 18) * 6, 132], bend: { aR: 1 } }) : A2.pose({ hL: [168, 392], hR: [236, 392] });
  const look = ph === 0 ? (run < 1.4 ? [0, -0.6] : [-0.75, 0.45]) : ACT.saccade(lt, [[0, [-0.75, 0.45]], [2.2, [0.2, -0.5]], [4.2, [0.4, 0.6]]], 0.07, 81);
  const face = { eyes: { open: ph === 0 && run < 1.3 ? 0.15 : 1 - ACT.natBlink(run, 81), flat: 0.3, squeeze: ph === 0 && stretch > 0.5 ? 1 : 0 }, brow: { worry: ph === 1 ? 0.55 : 0.2 },
    mouth: ph === 0 && stretch > 0.3 ? { v: ACT.VIS.O, o: 0.9 } : { v: ACT.VIS.M, o: 0, c: -1 }, blush: 0.3, fx: tt => ph === 1 ? ACT.sym('sigh', 210, 248, lt, 0.95, 1.9) : '' };
  const zero = gfZero('_gm1', face, { t, pose, look, vest: GF_PJ, vshade: 'rgba(40,80,140,0.18)', headDy: -4 * sg, handR: scratch ? 'open' : null, armFront: scratch ? 'R' : undefined });
  const cam = ph === 0 ? qLerpCam(run / 2, [1000, 600, 1.12], [990, 600, 1.16]) : qLerpCam(lt / 5, [960, 600, 1.4], [960, 590, 1.5]);
  return gfDefs() + qDefs() + qPlate('morning', cam, 0.5) + qCam(cam, gfLampSvg(false) + zero + gfDesk() + gfInvSmall() + gfCalcFlat(GF.CALC) + gfWallet(GF.WAL)) + gfAM();
}

/* =========== 14. 봉투 밑 쪽지 → 쪽지 글씨(제로 시점) =========== */
function gfnoteScene(t, lt, a) {
  const ph = a.ph;
  if (ph === 0) {
    const tUnder = gfW(a, ['밑에'], 0.5), tNote = gfW(a, ['쪽지'], 2.3);
    const lift = gfK(lt, tUnder - 0.3, tUnder + 0.6), glow = ACT.pulse(lt, tNote - 0.1, 0.8);
    let g = gfDrawerTop(t, 1, lift, glow) + `<rect x="-300" y="760" width="2600" height="500" fill="url(#gfBody)"/>`;
    // 오른손이 봉투 묶음을 들어 올림
    const hx = 960 + 120 * lift + 160, hy = 380 + 230 + 40 - 380 * easeInOut(lift) + 140;
    g += gfPovHand(2040, 1400, hx, hy, 78) + gfPovHand(-120, 1350, 640, 1037, 74);
    const cam = qLerpCam(lt / 2.5, [960, 600, 1.06], [980, 660, 1.3]);
    return gfDefs() + qCam(cam, g);
  }
  // m1: 두 손으로 펼쳐 든 쪽지(구겨진 자국) + 손글씨가 한 줄씩
  const tEat = gfW(a, ['밥은'], 0.15), tYou = gfW(a, ['넌'], 2.0);
  const r1 = gfK(lt, tEat - 0.05, tEat + 0.75), r2 = gfK(lt, tYou - 0.05, tYou + 0.45), r3 = gfK(lt, tYou + 0.15, tYou + 0.3);
  const hand = (txt, x, y, size, k, rot) => { const n = Math.floor([...txt].length * k + 0.001); return [...txt].slice(0, n).map((c, i) => `<text x="${f1(x + i * size * 0.98)}" y="${f1(y + Math.sin(i * 1.7) * 4)}" transform="rotate(${f1(rot + Math.sin(i * 2.3) * 3)} ${f1(x + i * size * 0.98)} ${f1(y)})" font-family="${FONT}" font-weight="700" font-size="${size}" fill="#2A3A6A">${esc(c)}</text>`).join(''); };
  GF_SLEEVE = GF_PJ;
  let g = gfDeskTop() + `<g transform="translate(960 520) rotate(-3)"><path d="M-520 -330 L500 -350 L540 -20 L520 340 L-500 360 L-540 20 Z" fill="#FFE27A" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>` +
    `<path d="M-480 -120 L500 -140 M-200 -340 L-160 350 M220 -345 L250 340 M-500 160 L520 130" stroke="#E2B93B" stroke-width="6" opacity=".8"/><path d="M-500 260 L-380 200 L-250 270 L-120 215 M300 -300 L360 -200 L300 -120 M420 200 L480 280" fill="none" stroke="#D9A92B" stroke-width="5" stroke-linejoin="round" opacity=".8"/>` +
    hand('밥은 먹고 해라.', -380, -90, 92, r1, -2) + hand('넌 된다.', -300, 90, 110, r2, -3) + hand('— 민재', 160, 260, 64, r3, -4) + `</g>`;
  g += gfPovHand(-200, 1300, 380, 860, 82) + gfPovFinger(380, 860, 430, 800, 58) + gfPovHand(2120, 1300, 1560, 840, 82) + gfPovFinger(1560, 840, 1500, 790, 58);
  return gfDefs() + qCam(qLerpCam(lt / 3, [960, 540, 1.0], [960, 520, 1.05]), g);
}

/* =========== 15. 6년 전 겨울, 도서관(회상) =========== */
function gflibScene(t, lt, a) {
  const tLib = gfW(a, ['도서관'], 4.0), tDrink = gfW(a, ['음료'], 6.2), tNote = gfW(a, ['쪽지'], 8.1), tThx = gfW(a, ['고맙다는'], 10.4);
  const TT = 745, s = 1.0, ZY = TT + 200;   // 탁자 윗면, 제로 원점(탁자 뒤)
  // 민재의 팔(초록 소매)이 오른쪽에서 들어와 병과 쪽지를 두고 나감
  const armIn = easeInOut(gfK(lt, tLib + 0.4, tDrink + 0.1)), armOut = easeInOut(gfK(lt, tNote - 0.2, tNote + 0.6)), arm = armIn * (1 - armOut);
  const placed = lt > tDrink + 0.3;
  const wake = gfK(lt, tNote + 0.4, tNote + 0.9), find = lt > tNote + 0.9, around = find && lt < tThx + 0.3;
  const LK = [[0, [0, 0.8]], [tNote + 0.9, [0.7, 0.7]], [tNote + 1.4, [-0.9, 0.0]], [tNote + 1.9, [0.95, 0.0]], [tThx + 0.3, [0.5, 0.75]]], look = ACT.saccade(lt, LK, 0.06, 91);
  const hold = lt > tThx + 0.3 ? easeInOut(gfK(lt, tThx + 0.3, tThx + 0.8)) : 0;
  const sleepHead = 1 - wake;
  const face = { eyes: { open: sleepHead > 0.5 ? 0 : 1 - ACT.blinks(lt, [tNote + 1.0, tNote + 1.35], 0.18), size: 1 + 0.15 * ACT.pulse(lt, tNote + 0.95, 0.35), wet: 0.3 * hold }, brow: { worry: 0.3 + 0.3 * hold, raise: 6 * ACT.pulse(lt, tNote + 0.95, 0.4) },
    mouth: sleepHead > 0.5 ? { v: ACT.VIS.U, o: 0.25 } : { v: ACT.VIS.M, o: 0, c: lerp(-1, 3, hold), wob: 0.3 * hold }, blush: 0.3,
    hfx: tt => sleepHead > 0.5 ? `<g opacity=".9">${fT(320 + Math.sin(lt * 2) * 6, 60 - (lt * 30) % 40, 'z', 44, '#fff', { stroke: INK })}${fT(352, 18 - (lt * 30 + 20) % 40, 'z', 34, '#fff', { stroke: INK })}</g>` : '' };
  const pose = hold > 0 ? A2.blend(A2.pose({ hL: [150, 360], hR: [250, 360] }), A2.pose({ hL: [176, 330], hR: [228, 330] }), hold, 0.2) : A2.pose({ hL: [150, 360], hR: [250, 360] });
  const zero = gfZero('_gb1', face, { t, x: 900, y: ZY, s, pose, look, vest: '#8E9AAF', vshade: 'rgba(0,0,0,0.2)', tilt: -10 * sleepHead, headDy: 62 * sleepHead, holdL: hold > 0.3 ? { svg: `<g transform="translate(24 -30)"><rect x="-14" y="-40" width="28" height="56" rx="8" fill="#B5651D" stroke="${INK}" stroke-width="4"/><rect x="-9" y="-52" width="18" height="14" rx="3" fill="#F2C94C" stroke="${INK}" stroke-width="3.5"/><rect x="-14" y="-16" width="28" height="16" fill="#F4E3C1"/></g>`, rot: 0 } : null, handL: hold > 0.3 ? 'grip' : null });
  // 탁자(앞판) + 책 더미 + 병·쪽지
  let fg = `<rect x="200" y="${TT - 12}" width="1520" height="24" rx="6" fill="#7A5232" stroke="${INK}" stroke-width="7"/><rect x="220" y="${TT + 12}" width="1480" height="480" fill="#5E3E25" stroke="${INK}" stroke-width="7"/>` +
    [0, 1, 2, 3].map(i => `<rect x="${420 - i * 6}" y="${TT - 12 - 34 * (i + 1)}" width="${300 - i * 14}" height="34" rx="5" fill="${['#5DA9E9', '#E5484D', '#7ED6A7', '#F2B84B'][i]}" stroke="${INK}" stroke-width="5"/>`).join('');
  const bx = 1130, by = TT - 12;
  if (placed && hold < 0.3) fg += `<g transform="translate(${bx} ${by})"><rect x="-18" y="-64" width="36" height="64" rx="9" fill="#B5651D" stroke="${INK}" stroke-width="5"/><rect x="-12" y="-80" width="24" height="18" rx="4" fill="#F2C94C" stroke="${INK}" stroke-width="4"/><rect x="-18" y="-36" width="36" height="18" fill="#F4E3C1"/></g>`;
  if (placed) fg += `<g transform="translate(${bx + 74} ${by - 2}) rotate(-8)"><rect x="-44" y="-30" width="88" height="30" rx="4" fill="#FFE27A" stroke="${INK}" stroke-width="5"/></g>`;
  if (arm > 0.01) { const hx = lerp(2050, bx + 10, arm), hy = lerp(420, by - 70, arm);
    fg += `<path d="M2350 120 L${f1(hx + 30)} ${f1(hy - 20)}" stroke="${INK}" stroke-width="58" stroke-linecap="round"/><path d="M2350 120 L${f1(hx + 30)} ${f1(hy - 20)}" stroke="#2E8B57" stroke-width="44" stroke-linecap="round"/><path d="M${f1(hx + 74)} ${f1(hy - 52)} L${f1(hx + 50)} ${f1(hy - 2)}" stroke="#1F6B42" stroke-width="10" stroke-linecap="round"/>` +
      (!placed ? `<g transform="translate(${f1(hx - 6)} ${f1(hy + 72)})"><rect x="-18" y="-64" width="36" height="64" rx="9" fill="#B5651D" stroke="${INK}" stroke-width="5"/><rect x="-12" y="-80" width="24" height="18" rx="4" fill="#F2C94C" stroke="${INK}" stroke-width="4"/><rect x="-18" y="-36" width="36" height="18" fill="#F4E3C1"/></g>` +
        `<g transform="translate(${f1(hx + 80)} ${f1(hy + 60)}) rotate(-8)"><rect x="-44" y="-30" width="88" height="30" rx="4" fill="#FFE27A" stroke="${INK}" stroke-width="5"/></g>` : '') +
      `<circle cx="${f1(hx)}" cy="${f1(hy)}" r="32" fill="#fff" stroke="${INK}" stroke-width="7"/>`; }
  const cam = lt < tLib - 0.2 ? qLerpCam(lt / 4, [960, 520, 1.0], [960, 540, 1.1]) : find ? qLerpCam((lt - tNote - 0.9) / 3, [980, 560, 1.35], [990, 560, 1.45]) : qLerpCam((lt - tLib + 0.2) / 4, [1060, 600, 1.3], [1080, 600, 1.38]);
  const lab = ACT.symK(lt, 0.2, tLib) > 0.01 ? `<g transform="translate(960 70) scale(${f1(ACT.symK(lt, 0.2, tLib) * 100) / 100})">${label(0, 0, '6년 전 겨울', { size: 44, bg: '#fff' })}</g>` : '';
  return gfDefs() + qDefs() + qPlate('library', cam, 0.5) + qCam(cam, qShadow(900, TT, 120, 0.5) + zero + fg) +
    `<rect x="-300" y="-200" width="2600" height="1500" fill="#9DB4D6" style="mix-blend-mode:color" opacity=".25"/><rect x="-300" y="-200" width="2600" height="1500" fill="url(#vig)"/>` + lab;
}

/* =========== 16. 이건 얼마지? → ERROR → 울컥 =========== */
function gferrorScene(t, lt, a) {
  const ph = a.ph, run = a._run;
  const B5 = TL.lines.find(l => l.id === 'b5'), wB = k => { const w = (B5.words || []).find(x => x.w.includes(k)); return B5.t0 + (w ? w.t : 2.5); };
  const tWon = wB('천'), tNote = wB('쪽지'), tErr = TL.lines.find(l => l.id === 's4').t0 + 0.05;
  if (t < tErr + 1.15) {
    // 내려다본 책상: 펼친 쪽지(뒷면 아님: 책상에 놓인 종이) + 눕힌 계산기(화면 위). 본전이의 작은 손이 키를 누름
    const err = t >= tErr, n = [tWon - 0.3, tWon - 0.12, tWon + 0.05, tWon + 0.22].filter(x => t >= x).length, plus = t > tWon + 0.55;
    const big = err ? (Math.floor((t - tErr) * 6) % 2 ? 'ERROR' : '') : plus ? (t > tNote ? '?' : '1,000') : ['0', '1', '10', '100', '1,000'][n];
    const top = err ? '' : plus ? '1,000 +' : '';
    const shake = err ? Math.sin((t - tErr) * 70) * 6 * Math.exp(-(t - tErr) * 2) : 0;
    let g = `<rect x="-300" y="-200" width="2600" height="1500" fill="#B98552"/><rect x="-300" y="-200" width="2600" height="1500" fill="url(#gfGrain)" transform="scale(1 3)"/>`;
    g += `<g transform="translate(620 560) rotate(-6)"><path d="M-300 -200 L290 -212 L312 -12 L300 206 L-290 216 L-312 12 Z" fill="#FFE27A" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-280 -70 L290 -82 M-120 -205 L-100 210 M130 -208 L150 206" stroke="#E2B93B" stroke-width="5" opacity=".8"/>` +
      fT(-40, -40, '밥은 먹고 해라.', 56, '#2A3A6A') + fT(-60, 60, '넌 된다.', 66, '#2A3A6A') + fT(160, 160, '— 민재', 40, '#2A3A6A') + `</g>`;
    g += `<g transform="translate(${f1(1360 + shake)} 520) rotate(8) scale(4.2)">${gfCalcSvg(top, big, { red: err, size: big === 'ERROR' ? 16 : 18 })}</g>`;
    // 본전이: 쪽지와 계산기 사이 아래쪽에 서서(위에서 내려다본 책상 위) 팔을 뻗어 키를 누르고, 쪽지를 가리킨다
    const press = [tWon - 0.3, tWon - 0.12, tWon + 0.05, tWon + 0.22, tWon + 0.55].reduce((m, x) => Math.max(m, ACT.pulse(t, x - 0.04, 0.12)), 0);
    const toNote = gfK(t, tNote - 0.2, tNote + 0.3) * (err ? 0 : 1), CX0 = 1040, CY0 = 925, S0 = 1.7;
    const kx = lerp(lerp(1395, 1380, press), 820, toNote), ky = lerp(lerp(640, 625, press), 600, toNote);
    g += gfCoin(CX0, CY0, S0, { t, eyes: err ? 'wide' : 'norm', brow: err ? 'up' : 'angry', mouth: err ? 'O' : 'flat', talk: gfTalk(t), look: toNote > 0.5 ? [-0.8, -0.6] : [0.7, -0.8], hL: [-70, -60], hR: [(kx - CX0) / S0, (ky - CY0) / S0] });
    return gfDefs() + qCam([1000, 560, 1.06 + 0.04 * clamp((t - B5.t0) / 6, 0, 1)], g) + gfAM();
  }
  // 제로 얼굴(아침): 쪽지(뒷면)를 두 손으로 든 채 → 눈물 맺히고 웃음이 번짐 → 쪽지를 가슴에
  const u = t - (tErr + 1.15), pk = ACT.pulse(u, 0.15, 0.45), wob = gfK(u, 0.5, 0.9), wet = gfK(u, 0.7, 1.3), tear = gfK(u, 1.6, 2.0), sm = easeInOut(gfK(u, 3.2, 3.8)), chest = easeInOut(gfK(u, 2.6, 3.2));
  const sob = ACT.pulse(u, 1.9, 0.3) + ACT.pulse(u, 2.3, 0.3);
  const look = ACT.saccade(u, [[0, [0.05, 0.85]], [2.4, [0.1, 0.3]], [3.4, [0.3, -0.1]]], 0.08, 92);
  const mouth = sm > 0.05 ? { v: ACT.VIS.E, o: 0.25 * sm, c: lerp(0, 4, sm), wob: lerp(0.8, 0.4, sm) * wob } : { v: ACT.VIS.M, o: 0, c: 0, wob };
  const back = `<g transform="translate(26 -40)"><path d="M-46 -34 L44 -38 L50 30 L-44 36 Z" fill="#F2D35E" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-30 -36 L-24 34 M10 -37 L16 33" stroke="#D9B53B" stroke-width="3"/></g>`;
  const pose = A2.blend(A2.pose({ hL: [170, 352], hR: [244, 352], elbowL: [128, 352], elbowR: [272, 352] }), A2.pose({ hL: [188, 330], hR: [214, 338] }), chest, 0.2);
  const zero = gfZero('_ge1', { eyes: { size: 1 + 0.22 * pk, wet, squint: 0.5 * sm, open: 1 - ACT.blinks(u, [1.35], 0.2) }, brow: { raise: 10 * pk, worry: 0.75 * wob }, mouth, tear, blush: lerp(0.4, 0.85, sm), fx: tt => sm > 0.5 ? ACT.sym('heart', 352, 150, u, 3.9, 99) : '' },
    { t, pose, look, vest: GF_PJ, vshade: 'rgba(40,80,140,0.18)', holdL: { svg: back, rot: 0 }, handL: 'grip', handR: chest > 0.5 ? 'open' : 'grip', handRotR: 90, headDy: 4 * sob - 5 * pk, tilt: 4 * sm });
  const coin = qShadow(GF.CALC, GF_CTOP, 46, 0.8) + gfCoin(GF.CALC, GF_CTOP, 1.1, { t, eyes: sm > 0.3 ? 'happy' : 'wide', brow: 'worry', mouth: sm > 0.3 ? 'smile' : 'O', look: [-0.8, -0.6], hL: [-50, -30], hR: [50, -30] });
  const cam = qLerpCam(u / 5, [990, 580, 1.75], [985, 570, 1.9]);
  return gfDefs() + qDefs() + qPlate('morning', cam, 0.45, { blur: true }) + qCam(cam, zero + gfDesk() + gfInvSmall() + gfCalcFlat(GF.CALC) + gfWallet(GF.WAL) + coin) + gfAM();
}

/* =========== 17. 본전이가 나쁜 건 아니다 → 쪽지는 계산기 밖에 =========== */
function gfguardScene(t, lt, a) {
  const tProt = gfW(a, ['나를', '지키려고'], 2.4), tBut = gfW(a, ['다만'], 4.9);
  let g = `<rect x="-300" y="-200" width="2600" height="1500" fill="url(#gfLeather)"/><rect x="-200" y="-100" width="2320" height="1300" rx="60" fill="none" stroke="#D9A86C" stroke-width="8" stroke-dasharray="26 18"/>` +
    `<rect x="-300" y="850" width="2600" height="500" fill="#4A2A12"/><line x1="-300" y1="850" x2="2300" y2="850" stroke="${INK}" stroke-width="7"/>`;
  if (lt < tBut - 0.15) {
    // ① 수상한 '당첨!' 메시지를 걷어참 ② '보증 좀 서 줘'를 두 팔 벌려 막음
    const scam = lt < tProt - 0.1, bx = 960;
    let co, extra = '';
    if (scam) { const come = easeOut(gfK(lt, 0.1, 0.9)), kick = gfK(lt, 1.05, 1.6), mx = lerp(1800, 1170, come) + 900 * kick * kick, my = 560 - 500 * kick, rot = 700 * kick;
      extra = `<g transform="translate(${f1(mx)} ${f1(my)}) rotate(${f1(rot)})"><rect x="-230" y="-90" width="460" height="180" rx="24" fill="#fff" stroke="${INK}" stroke-width="8"/>${fT(0, -14, '스팸: 당첨!', 54, '#C0392B')}${fT(0, 54, '링크를 누르세요', 40, INK)}</g>`;
      const kk = ACT.pulse(lt, 1.0, 0.35);
      co = { t, eyes: kk > 0.2 ? 'shut' : 'norm', brow: 'angry', mouth: kk > 0.2 ? 'grin' : 'flat', look: [0.8, 0], hL: [-70, -40], hR: [70, -60], legs: kk > 0.2 ? 'jump' : 'stand', rot: -10 * kk }; }
    else { const u = lt - tProt + 0.1, come = easeOut(gfK(u, 0, 0.6)), back = easeIn(gfK(u, 1.3, 1.9)), ax = lerp(-500, 520, come) - 700 * back;
      extra = `<path d="M-400 600 L${f1(ax)} 600" stroke="${INK}" stroke-width="64" stroke-linecap="round"/><path d="M-400 600 L${f1(ax)} 600" stroke="#9AA3AF" stroke-width="50" stroke-linecap="round"/><circle cx="${f1(ax + 10)}" cy="600" r="40" fill="#fff" stroke="${INK}" stroke-width="7"/>` +
        (come > 0.5 && back < 0.5 ? `<g transform="translate(${f1(ax - 40)} 400)">${acBubble(0, 0, '보증 좀 서 줘~', u, 0.4, 1.4, -1)}</g>` : '');
      const block = easeOutBack(gfK(u, 0.5, 0.8)), shake = u > 0.8 && u < 1.4 ? Math.sin(u * 30) * 8 : 0;
      co = { t, eyes: 'norm', brow: 'angry', mouth: 'frown', look: [-0.8, 0], hL: [-60 - 70 * block, -60 - 50 * block], hR: [60 + 70 * block, -60 - 50 * block], rot: shake * 0.6, legs: 'stand' }; }
    g += qShadow(bx, 850, 80, 0.8) + gfCoin(bx, 850, 2.3, co) + extra;
    const tag = ACT.symK(lt, 0.3, tBut - 0.3);
    if (tag > 0.01) g += `<g transform="translate(960 120) scale(${f1(tag * 100) / 100})">${label(0, 0, '본전이는 나를 지킨다', { size: 46, bg: YEL })}</g>`;
    return gfDefs() + qCam([960, 540, 1.0], g);
  }
  // ③ 지갑 속 벽: 제로의 손이 쪽지를 영수증 사이에 붙여 줌 → 본전이가 계산기를 내려놓고 그 앞에 앉음
  const u = lt - tBut + 0.15, pin = easeOutBack(gfK(u, 0.1, 0.8)), handOut = easeIn(gfK(u, 1.0, 1.5)), sit = easeInOut(gfK(u, 2.2, 2.9)), glow = gfK(u, 1.0, 2.0);
  for (let i = 0; i < 6; i++) { const x = 420 + (i % 3) * 190 + (i < 3 ? 0 : 900), y = 220 + (i % 2) * 120; g += `<g transform="translate(${x + (i >= 3 ? 330 : 0)} ${y}) rotate(${f1((hash(i * 9) - 0.5) * 10)})"><path d="M-58 0 L58 0 L58 160 L-58 160 Z" fill="#FBFAF4" stroke="${INK}" stroke-width="5"/>${[0, 1, 2].map(j => `<rect x="-42" y="${24 + j * 32}" width="${f1(56 + hash(i + j) * 28)}" height="10" rx="5" fill="#C9C5BA"/>`).join('')}<circle cx="0" cy="-6" r="9" fill="#E5484D" stroke="${INK}" stroke-width="3.5"/></g>`; }
  const ny = lerp(-300, 330, pin);
  g += `<circle cx="1000" cy="420" r="${f1(260 * glow)}" fill="url(#gfLamp)" opacity="${f1(glow * 0.9 * 100) / 100}"/><g transform="translate(1000 ${f1(ny)}) rotate(-3)"><path d="M-170 -110 L160 -118 L176 -6 L168 112 L-160 118 L-178 6 Z" fill="#FFE27A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` +
    fT(-10, -30, '밥은 먹고 해라.', 40, '#2A3A6A') + fT(-30, 36, '넌 된다.', 46, '#2A3A6A') + fT(90, 92, '— 민재', 28, '#2A3A6A') + `<circle cx="0" cy="-126" r="12" fill="#E5484D" stroke="${INK}" stroke-width="4"/></g>`;
  if (handOut < 1) g += `<path d="M1000 -400 L1000 ${f1(ny - 150 - 600 * handOut)}" stroke="${INK}" stroke-width="150" stroke-linecap="round"/><path d="M1000 -400 L1000 ${f1(ny - 150 - 600 * handOut)}" stroke="${GF_PJ}" stroke-width="130" stroke-linecap="round"/><circle cx="1000" cy="${f1(ny - 130 - 600 * handOut)}" r="80" fill="#fff" stroke="${INK}" stroke-width="9"/>`;
  const cx = 1000, cy = 850 + 30 * sit;
  g += qShadow(cx, 850, 80, 0.8) + gfCoin(cx, cy - 4, 2.1, { t, eyes: sit > 0.5 ? 'happy' : 'wide', brow: sit > 0.5 ? null : 'up', mouth: sit > 0.5 ? 'smile' : 'O', look: [0, -0.9], hL: [-70, lerp(-50, -10, sit)], hR: [70, lerp(-50, -10, sit)], legs: 'stand',
    holdL: sit < 0.5 ? `<g transform="translate(-6 -30) scale(0.42)">${gfCalcBack}</g>` : '' }) + (sit > 0.5 ? `<g transform="translate(${cx - 230} 850) scale(1.3)">${gfCalcFlat(0).replace('translate(0 ' + (GF.DT - 6) + ')', 'translate(0 0)')}</g>` : '');
  return gfDefs() + qCam(qLerpCam(u / 4, [1000, 560, 1.0], [1000, 540, 1.08]), g);
}

/* =========== 18. 오래된 정장 → 봉투(제로 시점, 금액은 안 보임) =========== */
function gfsuitScene(t, lt, a) {
  const tEnv = gfW(a, ['봉투에'], 3.3), tOnly = gfW(a, ['제로만'], 4.9);
  if (lt < tEnv - 0.2) {
    // 옷장 앞에서 정장: 어깨가 끼어서 팔을 한 번 돌림
    const dressed = lt >= 1.3, roll = gfK(lt, 1.6, 2.6), ang = roll * Math.PI * 2, tug = ACT.pulse(lt, 1.35, 0.4);
    const HANGER = `<g transform="translate(0 -10)"><path d="M0 -6 Q0 -22 10 -22" fill="none" stroke="${INK}" stroke-width="4"/><path d="M-56 30 L0 0 L56 30" fill="none" stroke="#8A6A50" stroke-width="6"/><path d="M-56 30 L-50 150 L50 150 L56 30 L20 24 L0 70 L-20 24 Z" fill="#2B3440" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M0 70 L0 150" stroke="${INK}" stroke-width="3"/></g>`;
    const pose = !dressed ? A2.pose({ hL: [160, 412], hR: [326, 200], bend: { aR: 1 } }) : roll > 0 && roll < 1 ? A2.pose({ hL: [150, 412], hR: [200 + Math.cos(ang - Math.PI / 2) * 110 + 60, 285 + Math.sin(ang - Math.PI / 2) * 110], bend: { aR: 1 } }) : A2.pose({ hL: [170, 300 + 60 * (1 - tug)], hR: [230, 300 + 60 * (1 - tug)] });
    const zero = qShadow(980, 1000, 80) + acZ('_gu1', { eyes: { open: 1 - ACT.natBlink(lt, 95), squeeze: roll > 0.2 && roll < 0.8 ? 1 : 0 }, brow: { worry: 0.3 }, mouth: roll > 0.2 && roll < 0.8 ? { v: ACT.VIS.I, o: 0.4, c: -2 } : { v: ACT.VIS.M, o: 0, c: 2 }, blush: 0.35 },
      Object.assign({ x: 980, y: 1000, s: 1.05, t, seed: 61, pose, look: dressed ? [0.2, 0.1] : [0.6, -0.5], tilt: roll > 0 && roll < 1 ? -5 : 0, handL: tug > 0.3 ? 'grip' : null, handR: !dressed ? 'grip' : (tug > 0.3 ? 'grip' : null), holdR: !dressed ? { svg: HANGER, rot: 0 } : null },
        dressed ? { vest: '#2B3440', vshade: 'rgba(0,0,0,0.25)', collar: true, tie: '#C0392B' } : { vest: GF_PJ, vshade: 'rgba(40,80,140,0.18)' }));
    const cam = qLerpCam(lt / 3, [980, 700, 1.35], [980, 690, 1.42]);
    return gfDefs() + qDefs() + qPlate('morning', cam, 0.5) + qCam(cam, zero) + gfAM() + (roll > 0.3 && roll < 0.8 ? fx(t, t - lt + 1.55, t - lt + 2.1, 1250, 260, '끼익', '#fff', { size: 56, rot: -8 }) : '');
  }
  // 제로 시점: 책상 위 봉투의 입구를 접어 누름(안은 보이지 않음)
  const u = lt - tEnv + 0.2, fold = easeInOut(gfK(u, 0.3, 1.0)), press = gfK(u, 1.0, 1.8), lift = easeInOut(gfK(lt, tOnly + 0.3, tOnly + 1.0));
  GF_SLEEVE = '#2B3440';
  let g = gfDeskTop();
  const ey = 560 - 120 * lift;
  g += `<g transform="translate(960 ${f1(ey)}) rotate(-4) scale(${f1(1 + 0.08 * lift)})"><rect x="-330" y="-190" width="660" height="380" rx="12" fill="#000" opacity=".2" transform="translate(16 20)"/><rect x="-330" y="-190" width="660" height="380" rx="12" fill="#fff" stroke="${INK}" stroke-width="9"/>` +
    `<path d="M-330 -190 L0 ${f1(lerp(-420, 40, fold))} L330 -190 Z" fill="${fold > 0.5 ? '#F4F1EA' : '#E9E3D6'}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>` + fT(0, 120, '축 결혼', 64, INK) + `</g>`;
  const hx = lerp(1180, 820, press), hy = ey - 150 + 60 * fold;
  g += gfPovHand(2040, 1350, hx + 90, hy + 150, 76) + gfPovFinger(hx + 70, hy + 110, hx, hy, 56) + gfPovHand(-120, 1350, 560, 880 - 120 * lift, 74);
  return gfDefs() + qCam([960, 560, 1.04], g);
}

/* =========== 19. 예식장 입구: 민재가 제로를 발견 → 멈춤 =========== */
const GF_H = { FY: 1040, ZX: 430, MX: 1000, GX: 1225 }; // 접수대(x 1390~)보다 왼쪽에 선다
function gfhallScene(t, lt, a) {
  const ph = a.ph, run = a._run;
  const s5 = TL.lines.find(l => l.id === 's5'), N15 = TL.lines.find(l => l.id === 'n15'), tFreeze = N15.t0 + 0.75;
  const T = Math.min(t, tFreeze), r = T - (s5.t0 - 0.15); // 정지 뒤에는 시간이 멈춤
  if (ph === 2 && lt > 1.0) {
    // 마지막: 지갑 속 벽의 노란 쪽지(따뜻한 빛)
    let g = `<rect x="-300" y="-200" width="2600" height="1500" fill="url(#gfLeather)"/><circle cx="960" cy="520" r="520" fill="url(#gfLamp)" opacity=".85"/><g transform="translate(960 520) rotate(-3) scale(1.6)"><path d="M-170 -110 L160 -118 L176 -6 L168 112 L-160 118 L-178 6 Z" fill="#FFE27A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` +
      fT(-10, -30, '밥은 먹고 해라.', 40, '#2A3A6A') + fT(-30, 36, '넌 된다.', 46, '#2A3A6A') + fT(90, 92, '— 민재', 28, '#2A3A6A') + `<circle cx="0" cy="-126" r="12" fill="#E5484D" stroke="${INK}" stroke-width="4"/></g>`;
    return gfDefs() + qCam(qLerpCam((lt - 1.0) / 2, [960, 540, 1.0], [960, 530, 1.06]), g);
  }
  // 제로: 왼쪽에서 걸어 들어와 멈춤(정장, 봉투는 안주머니)
  const wk = gfK(r, 0.1, 1.9), zx = lerp(-160, GF_H.ZX, easeOut(wk)), walking = wk > 0 && wk < 1;
  const zPose = walking ? walkPose(r * 7.5, 0.7) : A2.pose({});
  const zero = qShadow(zx, GF_H.FY, 72) + acZ('_gh1', { eyes: { open: 1 - ACT.natBlink(r, 97), size: 1 + 0.1 * (T > tFreeze - 0.4 ? 1 : 0) }, brow: { raise: 3, worry: walking ? 0.3 : 0.15 }, mouth: { v: ACT.VIS.M, o: 0, c: walking ? 0 : 3 }, blush: 0.4 },
    { x: zx, y: GF_H.FY, s: 1.0, t: T, seed: 61, vest: '#2B3440', vshade: 'rgba(0,0,0,0.25)', collar: true, tie: '#C0392B', pose: zPose, look: [0.85, 0.05], handR: 'grip', holdR: `<g transform="translate(0 8)"><rect x="-24" y="-15" width="48" height="30" rx="3" fill="#fff" stroke="${INK}" stroke-width="3.5"/><path d="M-24 -15 L0 3 L24 -15" fill="none" stroke="${INK}" stroke-width="2.5"/></g>` });
  // 민재: 하객에게 인사(꾸벅) → 고개 돌려 제로 발견(두 번 보기) → 활짝 웃으며 손 번쩍
  const tSee = N15.t0 - 0.55, see = T > tSee, pop = ACT.pop(T, tSee + 0.2, 2.6, 0.32), wave = easeOutBack(gfK(T, tSee + 0.25, tSee + 0.75));
  const bow = !see ? ACT.pulse(T, s5.t0 + 0.4, 0.9) : 0;
  const mj = qShadow(GF_H.MX, GF_H.FY, 72) + gfP('_gh2', { eyes: { open: 1, size: 1 + 0.25 * clamp(pop, 0, 1.3), squint: wave > 0.6 ? 0.4 : 0 }, brow: { raise: 10 * clamp(pop, 0, 1) }, mouth: see ? { v: ACT.VIS.A, o: 0.8 * clamp(wave, 0, 1), c: 6 } : { v: ACT.VIS.E, o: 0.2, c: 4 }, blush: 0.55 },
    { x: GF_H.MX, y: GF_H.FY, s: 1.02, t: T, seed: 98, vest: '#22252C', vshade: 'rgba(0,0,0,0.3)', hair: '#2A2420', collar: true, tie: '#2E8B57', look: see ? [-0.9, 0.05] : [0.8, 0.1], headDy: 0, tilt: see ? 0 : 4,
      pose: A2.blend(A2.pose({}), A2.pose({ hL: [40, 196], bend: { aL: -1 } }), clamp(wave, 0, 1.1), 0.2), handL: wave > 0.4 ? 'open' : null, handRotL: -100, armFront: wave > 0.3 ? 'L' : undefined, sy: 1 + 0.03 * clamp(pop, 0, 1) });
  // 신부(이수아): 흰 드레스·베일·부케. 처음엔 민재와 마주 보고 웃다가, 민재가 제로를 보면 같이 돌아봄
  const bLook = see && T > tSee + 0.35 ? [-0.9, 0.05] : [-0.7, 0.1], bs = 1.0, bx = GF_H.GX, by = GF_H.FY;
  const HAIR = '#3A2A20';
  const veil = `<path d="M110 120 Q60 260 70 470 L330 470 Q340 260 290 120 Z" fill="#FFFFFF" opacity=".55" stroke="#D9DDE6" stroke-width="4"/>`;
  const bride = qShadow(bx, by, 80) + gfP('_gh3', { eyes: { open: 1 - ACT.natBlink(T, 99), squint: 0.45 }, brow: { raise: 2 }, mouth: { v: ACT.VIS.E, o: see ? 0.3 : 0.15, c: 5 }, blush: 0.7 },
    { x: bx, y: by, s: bs, t: T, seed: 99, vest: '#FFFFFF', vshade: 'rgba(120,130,150,0.18)', longHair: HAIR, lashes: true, look: bLook, pose: A2.pose({ hL: [186, 372], hR: [214, 372] }),
      hairBack: veil, hairFront: `<path d="M86 156 Q90 60 200 54 Q310 60 314 156 Q292 104 244 98 Q206 126 156 100 Q112 106 86 156 Z" fill="${HAIR}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
        [150, 175, 200, 225, 250].map((x, i) => `<circle cx="${x}" cy="${f1(66 - Math.sin(i / 4 * Math.PI) * 10)}" r="11" fill="${i % 2 ? '#FFD1DC' : '#FFFFFF'}" stroke="${INK}" stroke-width="3.5"/>`).join('') });
  // 드레스 치마(허리 아래, 바닥까지) + 부케(두 손 위)
  const gown = `<g transform="translate(${f1(bx - 200 * bs)} ${f1(by - 560 * bs)}) scale(${bs})"><path d="M130 388 L270 388 L330 556 Q200 574 70 556 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` +
    `<path d="M150 430 Q200 446 250 430 M120 500 Q200 520 280 500" fill="none" stroke="#D9DDE6" stroke-width="4"/>` +
    `<g transform="translate(200 366)"><path d="M-8 10 L0 44 L8 10 Z" fill="#7BAE6E" stroke="${INK}" stroke-width="3.5"/>${[[-20, -4, '#FFB4C2'], [0, -14, '#FFFFFF'], [20, -4, '#FFD1DC'], [-10, 10, '#FFFFFF'], [12, 10, '#FFB4C2']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="14" fill="${c}" stroke="${INK}" stroke-width="3.5"/>`).join('')}</g></g>`;
  const guest = bride + gown;
  const cam = !see ? qLerpCam(r / 2.5, [900, 640, 1.08], [900, 630, 1.12]) : qLerpCam((t - tSee) / 6, [860, 620, 1.15], [800, 610, 1.25]);
  const frozen = t >= tFreeze;
  return gfDefs() + qDefs() + qPlate('hall', cam, 0.5) + qCam(cam, guest + mj + zero) + `<rect x="-300" y="-200" width="2600" height="1500" fill="#FFE2B0" opacity=".1"/>` +
    (frozen ? `<rect x="-300" y="-200" width="2600" height="1500" fill="#fff" opacity="${f1(0.35 * Math.max(0, 1 - (t - tFreeze) / 0.25) * 100) / 100}"/>` : '');
}
