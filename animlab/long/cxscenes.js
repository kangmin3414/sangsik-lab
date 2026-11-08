/* 복잡한 감정 갤러리: 섞인 감정 10가지. 한 감정마다 '자극 → 겉 감정 → 속 감정이 새어 나옴' 순서로 연기한다.
   actscenes.js(acZ·acBubble)와 act2.js(ACT)를 쓴다. 제로는 화면 왼쪽 가운데 클로즈업, 자극(말풍선)은 오른쪽에서. */
const CXN = 10; for (let i = 1; i <= CXN; i++) CAMS['cx' + i] = 'fixed';
const CX = { X: 820, S: 2.2, Y: 1500 };
const CX_MIX = ['', '웃음(가면) + 슬픔', '웃음 + 아쉬움', '축하 + 분함', '토라짐 + 봐 줬으면', '하고 싶음 + 두려움', '긴장 → 풀림', '실망 + 받아들임', '눈물 + 웃음', '행복한 기억 + 아픔', '놀람 + 짜증 + 웃음'];
const cxBg = (name, recipe, lt) => { const k = ACT.symK(lt, 0.0, 99), n = ['괜찮은 척', '씁쓸함', '질투', '서운함', '망설임', '안도', '체념', '감동', '그리움', '어이없음'].indexOf(name) + 1, k2 = ACT.symK(lt, 0.25, 99);
  return `<rect x="-300" y="-200" width="2600" height="1500" fill="#F3EEE4"/><ellipse cx="${CX.X}" cy="700" rx="430" ry="340" fill="#fff" opacity=".45"/>` +
    `<g transform="translate(960 74) scale(${f1(k * 100) / 100})">${label(0, 0, name, { size: 52, bg: YEL })}</g>` + fT(960, 156, recipe, 36, INK) +
    `<g transform="translate(960 226) scale(${f1(k2 * 100) / 100})">${label(0, 0, '①②③④⑤⑥⑦⑧⑨⑩'[n - 1] + ' ' + CX_MIX[n], { size: 34, bg: '#fff' })}</g>`; };
const cxPhone = `<g transform="translate(0 -50)"><rect x="-25" y="-44" width="50" height="88" rx="9" fill="#2B2F3A" stroke="${INK}" stroke-width="5"/><rect x="-19" y="-36" width="38" height="62" rx="3" fill="#CFE8FF"/>` +
  `<rect x="-13" y="-28" width="26" height="6" rx="3" fill="#fff"/><rect x="-13" y="-18" width="18" height="6" rx="3" fill="#fff"/><rect x="-14" y="10" width="28" height="12" rx="5" fill="#3BB273" stroke="${INK}" stroke-width="2.5"/></g>`;
const cxSt = () => A2.pose({});
const cxZ = (key, face, o) => acZ(key, face, Object.assign({ x: CX.X, y: CX.Y, s: CX.S }, o));

/* 1. 괜찮은 척: 웃음(가면) + 슬픔 */
function cx1Scene(t, lt) {
  let w = cxBg('괜찮은 척', '입은 웃는데 눈은 안 웃는다 → 혼자 남으면 무너진다', lt) + acBubble(1430, 330, '괜찮아?', lt, 0.3, 1.9, -1);
  const LK = [[0, [-0.2, 0.7]], [0.5, [0.7, -0.15]], [2.15, [0.95, 0.05]], [2.6, [-0.1, 0.75]]], look = ACT.saccade(lt, LK, 0.06, 21);
  const bl = Math.max(ACT.blinks(lt, [0.47, 2.6], 0.17), ACT.blinks(lt, [3.6], 0.4));
  const pm = lt >= 0.62 ? A2.spring(lt, 0.62, 3.2, 0.38) : 0, fall = easeInOut(clamp((lt - 2.55) / 0.85, 0, 1));
  const tw = lt > 1.15 && lt < 2.6 && hash(Math.floor(lt * 5) + 7) > 0.45 ? Math.sin(lt * 34) * 1.6 : 0; // 웃는 입꼬리가 가끔 파르르
  const c = lt < 0.62 ? -3 : lerp(lerp(-3, 6, pm), -4, fall), mo = lt < 0.62 ? 0 : lerp(0.42 * pm, 0, Math.min(1, fall * 1.6));
  const sg = ACT.sigh(lt, 3.05, 0.45, 0.9);
  const st = cxSt(), wave = A2.pose({ hR: [298 + Math.sin(lt * 11) * 14 * clamp((lt - 0.9) / 0.2, 0, 1) * (lt < 1.9 ? 1 : 0), 296] }), wk = clamp(A2.actK(lt, 0.7, 0.3, { anticAmt: 0.1 }), -0.1, 1.1) * (1 - clamp(A2.actK(lt, 2.0, 0.45, { antic: 0.05, anticAmt: 0, over: 0 }), 0, 1));
  w += cxZ('_c1', { t: lt, eyes: { open: 1 - bl - 0.28 * fall, size: lt >= 0.62 && fall < 0.5 ? 1.06 : 1, squint: 0, wet: lt < 0.62 ? 0.4 : lerp(0.4, 0.9, fall) },
    brow: { raise: 3 * pm * (1 - fall), worry: lt < 0.62 ? 0.7 : lerp(lerp(0.7, 0.35, pm), 1, fall) }, mouth: { v: ACT.VIS.E, o: mo, c: [c, c + tw] }, blush: 0.35,
    fx: tt => ACT.sym('sigh', 236, 246, lt, 3.5, 4.3) + ACT.sym('gloom', 0, 0, lt, 3.3, 99) },
    { t, pose: A2.blend(st, wave, wk, 0.25), look, tilt: 6 * pm * (1 - fall) - 4 * fall, handR: wk > 0.4 ? 'open' : null, headDy: 6 * fall - 4 * sg, sy: 1 + 0.02 * sg });
  return w;
}

/* 2. 씁쓸함: 웃음 + 아쉬움 */
function cx2Scene(t, lt) {
  let w = cxBg('씁쓸함', '한쪽 입꼬리만 올라가고, 눈썹은 걱정, 시선은 아래로', lt);
  const LK = [[0, [0.05, 0]], [0.55, [-0.45, 0.85]]], look = ACT.saccade(lt, LK, 0.07, 22);
  const sm = easeInOut(prog(lt, 0.9, 1.45)), hu = ACT.pulse(lt, 1.75, 0.35);
  const bl = Math.max(ACT.blinks(lt, ACT.saccadeBlinks(LK, 0.5), 0.17), ACT.blinks(lt, [2.55], 0.45));
  w += cxZ('_c2', { t: lt, eyes: { open: (0.9 - 0.08 * sm) * (1 - bl), squint: 0.18 * sm, wet: 0.35 * sm }, brow: { worry: lerp(0.2, 0.85, easeInOut(prog(lt, 0.6, 1.2))) },
    mouth: { v: ACT.VIS.M, o: 0, c: [lerp(1, 4, sm), lerp(1, -2, sm)] }, blush: 0.3,
    fx: tt => ACT.sym('sigh', 226, 244, lt, 1.75, 2.5) },
    { t, look, tilt: -6 * sm, headDy: 5 * hu, turn: -0.15 * sm });
  return w;
}

/* 3. 질투: 축하 + 분함 */
function cx3Scene(t, lt) {
  let w = cxBg('질투', '얼굴은 축하, 주먹은 꽉 → 돌아서면 곁눈질·볼 부풀림', lt) + acBubble(1430, 330, '나 합격했어!', lt, 0.3, 2.0, -1);
  const cg = lt >= 0.55 && lt < 2.15, after = lt >= 2.15, dk = after ? A2.spring(lt, 2.15, 4, 0.5) : 0, pf = after ? A2.spring(lt, 2.3, 2.6, 0.35) : 0;
  const LK = [[0, [0, 0.1]], [0.5, [0.75, -0.1]], [2.15, [0.98, 0.12]]], look = ACT.saccade(lt, LK, 0.06, 23);
  const sh = Math.sin(lt * 42) * 3 * (lt > 0.9 ? 1 : 0);
  const pose = A2.pose({ hL: lt > 0.9 ? [118 + sh, 384] : [150, 412], hR: cg ? [302, 300] : [252 + sh, 412] });
  const face = after ? { eyes: { flat: 0.45 * dk, size: 0.97, open: 1 - ACT.blinks(lt, [3.4], 0.2) }, brow: { angry: 0.38 * dk, knit: 0.45 * dk }, puff: [0.85 * pf, 0.85 * pf], mouth: { style: 'pout', dx: -4 }, blush: 0.55 }
    : { eyes: { squint: cg ? 0.55 : 0, open: 1 - ACT.blinks(lt, [0.48], 0.15) }, brow: { raise: cg ? 5 : 0 }, mouth: cg ? { v: ACT.VIS.A, o: 0.7, c: 5 } : { v: ACT.VIS.M, o: 0, c: 2 }, blush: 0.5 };
  w += cxZ('_c3', Object.assign({ t: lt, fx: tt => ACT.sym('vein', 300, 98, lt, 1.3, 2.1) + ACT.sym('storm', 330, 52, lt, 2.5, 99) }, face),
    { t, pose, look, handL: lt > 0.9 ? 'fist' : null, handR: cg ? 'thumb' : (after ? 'fist' : null), tilt: cg ? 5 : -3 * dk, turn: after ? 0.35 * dk : 0.2 });
  return w;
}

/* 4. 서운함: 토라짐 + 그래도 봐 줬으면 */
function cx4Scene(t, lt) {
  let w = cxBg('서운함', '삐죽 입·볼 부풀림 → 고개는 돌렸는데 눈은 자꾸 흘끗', lt) + acBubble(1430, 330, '아… 깜빡했다', lt, 0.3, 1.5, -1);
  const away = lt >= 0.95, tk = away ? A2.spring(lt, 0.95, 2.4, 0.45) : 0;
  const LK = [[0, [0.6, -0.1]], [0.95, [-1, 0.45]], [1.9, [0.85, 0.02]], [2.25, [-1, 0.45]], [3.1, [0.8, 0]], [3.32, [-1, 0.45]]], look = ACT.saccade(lt, LK, 0.05, 24);
  const toss = ACT.pulse(lt, 2.28, 0.32), pf = away ? 0.6 + 0.3 * clamp((lt - 2.28) / 0.2, 0, 1) : 0;
  const st = cxSt(), cross = A2.pose({ hL: [238, 352], hR: [162, 352], dy: 2 }), ck = clamp(A2.actK(lt, 1.0, 0.35, { anticAmt: 0.08 }), 0, 1.1);
  const face = lt < 0.95 ? { eyes: { size: 1 + 0.06 * ACT.pulse(lt, 0.5, 0.4), open: 1 - ACT.blinks(lt, [0.55], 0.17) }, brow: { worry: 0.5 * clamp((lt - 0.5) / 0.3, 0, 1) }, mouth: { v: ACT.VIS.M, o: 0, c: -2, wob: 0.3 }, blush: 0.45 }
    : { eyes: { open: 1 - ACT.blinks(lt, [2.27, 3.33], 0.15), wet: 0.45, size: lt > 1.9 && lt < 2.25 ? 1.05 : 1 }, brow: { worry: 0.7 }, puff: [pf * 0.7, pf * 0.7], mouth: { style: 'pout', dx: -6 }, blush: 0.75 };
  w += cxZ('_c4', Object.assign({ t: lt }, face), { t, pose: A2.blend(st, cross, ck, 0.15), look, turn: -0.85 * tk, tilt: -5 * tk - 9 * toss, headDy: -3 * toss });
  return w;
}

/* 5. 망설임: 하고 싶음 + 두려움 */
function cx5Scene(t, lt) {
  let w = cxBg('망설임', '손이 나갔다 들어오기 두 번 · 입술 깨물기 · 시선이 왔다 갔다', lt);
  const KR = [[0, 0], [0.5, 0], [0.95, 0.82], [1.12, 0.82], [1.4, 0.1], [1.8, 0.1], [2.3, 0.97], [2.6, 0.95], [3.0, 0], [9, 0]];
  let i = 0; while (i + 1 < KR.length && lt >= KR[i + 1][0]) i++; const [ta, va] = KR[i], [tb, vb] = KR[i + 1], rk = lerp(va, vb, easeInOut(clamp((lt - ta) / (tb - ta), 0, 1)));
  const hover = lt > 2.3 && lt < 2.6 ? Math.sin(lt * 38) * 3 : 0, down = easeInOut(prog(lt, 3.3, 3.8));
  const hL = [lerp(186, 160, down), lerp(388, 410, down)], hR = [lerp(292, 216, rk) + hover, lerp(404, 352, rk)];
  const LK = [[0, [0, 0.1]], [0.45, [0.1, 0.85]], [1.05, [-0.6, -0.3]], [1.5, [0.6, -0.2]], [1.8, [0.1, 0.85]], [2.65, [-0.5, 0.1]], [3.3, [0, 0.2]]], look = ACT.saccade(lt, LK, 0.06, 25);
  const bite = lt > 0.6 && lt < 3.2, sg = ACT.sigh(lt, 3.15, 0.35, 0.8);
  w += cxZ('_c5', { t: lt, eyes: { open: 1 - ACT.blinks(lt, ACT.saccadeBlinks(LK, 0.9), 0.15), size: rk > 0.8 ? 1.05 : 1 }, brow: { knit: 0.7, worry: 0.5 }, blush: 0.35,
    mouth: bite ? { style: 'bite', c: 0 } : { v: ACT.VIS.M, o: 0, c: -1, wob: lt >= 3.2 ? 0.35 : 0 },
    fx: tt => ACT.sym('sweat', 312, 90, lt, 2.0, 99) + ACT.sym('sigh', 232, 246, lt, 3.5, 4.3) },
    { t, pose: A2.pose({ hL, hR }), look, holdL: { svg: cxPhone, rot: 0 }, handL: 'grip', handR: rk > 0.3 ? 'point' : null, tilt: -3 + 4 * rk, headDy: -3 * sg });
  return w;
}

/* 6. 안도: 긴장 → 풀림 */
function cx6Scene(t, lt) {
  let w = cxBg('안도', '굳은 어깨 → 길게 "후~" → 몸이 풀려 내려앉음', lt) + acBubble(1430, 330, '합격!', lt, 0.75, 2.4, -1);
  const rel = lt >= 1.05, sg = ACT.sigh(lt, 1.05, 0.35, 1.2), rx = easeInOut(prog(lt, 1.3, 2.3)), sh = rel ? 0 : Math.sin(lt * 50) * 2;
  const wipe = lt > 2.6 && lt < 3.4, wx = wipe ? 336 - 32 * Math.sin(prog(lt, 2.6, 3.4) * Math.PI * 2) : 336;
  const pose = wipe || (lt > 2.4 && lt < 3.7) ? A2.blend(A2.pose({}), A2.pose({ hR: [wx, 150] }), clamp(A2.actK(lt, 2.4, 0.25), 0, 1) * (1 - clamp(A2.actK(lt, 3.4, 0.3, { antic: 0, over: 0 }), 0, 1)), 0.25)
    : A2.blend(A2.pose({ hL: [182 + sh, 338], hR: [218 + sh, 338], dy: 0 }), A2.pose({ dy: 3 }), rx, 0.2);
  const LK = [[0, [0.5, -0.1]], [0.8, [0.72, -0.2]], [2.4, [0.1, 0.05]]], look = ACT.saccade(lt, LK, 0.05, 26);
  const face = !rel ? { eyes: { size: lt > 0.85 ? 1.14 : 1.06, open: 1 }, brow: { worry: 0.55, raise: lt > 0.85 ? 4 : 0 }, mouth: { v: ACT.VIS.M, o: 0, c: -1, wob: lt > 0.85 ? 0 : 0.6 }, blush: 0.25 }
    : { eyes: { open: lt < 2.3 ? 0 : 1 - ACT.blinks(lt, [3.0], 0.2), squint: lt < 2.3 ? 0.85 : 0.35 }, brow: { worry: 0.35 }, mouth: lt > 1.35 && lt < 2.4 ? { v: ACT.VIS.U, o: 0.55 } : { v: ACT.VIS.M, o: 0, c: lerp(-1, 4, rx) }, blush: 0.5 };
  w += cxZ('_c6', Object.assign({ t: lt, fx: tt => ACT.sym('sweat', 312, 90, lt, 0, 1.5) + ACT.sym('sigh', 232, 248, lt, 1.4, 2.6) }, face),
    { t, pose, look, handL: rel ? null : 'fist', handR: rel ? null : 'fist', headDy: rel ? lerp(8, -2, rx) - 3 * sg : 8, sy: 1 + 0.025 * sg - 0.02 * rx, tilt: 4 * rx });
  return w;
}

/* 7. 체념: 실망 + 받아들임 */
function cx7Scene(t, lt) {
  let w = cxBg('체념', '들숨에 올라갔다 날숨에 내려앉기 · 반쯤 감은 눈 · 으쓱', lt);
  const sg = ACT.sigh(lt, 0.3, 0.6, 1.1), inh = Math.max(0, sg), shr = lt >= 2.3, sk = shr ? clamp(A2.actK(lt, 2.3, 0.3, { anticAmt: 0.1 }), -0.1, 1.1) : 0, up = ACT.pulse(lt, 2.35, 0.45);
  const look = ACT.saccade(lt, [[0, [-0.3, 0.45]], [2.3, [0.05, 0.1]]], 0.08, 27);
  const pose = A2.blend(A2.pose({ hL: [150, 412 - 12 * inh], hR: [250, 412 - 12 * inh] }), A2.pose({ hL: [92, 350], hR: [308, 350] }), sk, 0.2);
  const ex = lt > 0.9 && lt < 2.0, smile = lt >= 2.0;
  w += cxZ('_c7', { t: lt, eyes: { open: (0.88 - 0.1 * (1 - inh)) * (1 - ACT.blinks(lt, [2.95], 0.42)), flat: lt < 0.3 ? 0.35 : lerp(0.5, 0.2, inh) }, brow: { worry: 0.45 + 0.2 * (1 - inh), raise: 3 * up },
    mouth: lt > 0.3 && lt < 0.9 ? { v: ACT.VIS.O, o: 0.28 } : ex ? { v: ACT.VIS.U, o: 0.38 } : { v: ACT.VIS.M, o: 0, c: smile ? [1.5, 2.8] : -1 }, blush: 0.25,
    fx: tt => ACT.sym('sigh', 232, 246, lt, 0.9, 2.0) },
    { t, pose, look, handL: sk > 0.4 ? 'open' : null, handR: sk > 0.4 ? 'open' : null, headDy: -6 * sg + 6 * up, sy: 1 + 0.03 * sg, tilt: 8 * clamp(sk, 0, 1) });
  return w;
}

/* 8. 감동(울컥): 눈물 + 웃음 */
function cx8Scene(t, lt) {
  let w = cxBg('감동', '입술이 떨리고 눈물이 맺힌 위로 웃음이 번진다', lt) + acBubble(1430, 330, '늘 고마워', lt, 0.3, 2.6, -1);
  const pk = ACT.pulse(lt, 0.55, 0.45), wob = clamp((lt - 0.8) / 0.4, 0, 1), wet = clamp((lt - 0.9) / 0.5, 0, 1), tear = clamp((lt - 1.4) / 0.3, 0, 1), sm = easeInOut(prog(lt, 2.1, 2.5));
  const sob = ACT.pulse(lt, 1.5, 0.28) + ACT.pulse(lt, 1.9, 0.28);
  const look = ACT.saccade(lt, [[0, [0, 0.1]], [0.45, [0.72, -0.2]], [2.2, [0.35, -0.05]]], 0.06, 28);
  const hk = clamp(A2.actK(lt, 1.2, 0.35, { anticAmt: 0.08 }), 0, 1.1);
  w += cxZ('_c8', { t: lt, eyes: { size: 1 + 0.1 * pk + 0.04 * wet, wet: wet, squint: 0.55 * sm, open: 1 - ACT.blinks(lt, [1.15], 0.2) }, brow: { raise: 4 * pk, worry: 0.75 * clamp((lt - 0.8) / 0.3, 0, 1) },
    mouth: sm > 0.05 ? { v: ACT.VIS.E, o: 0.32 * sm, c: lerp(0, 4, sm), wob: lerp(1, 0.5, sm) * wob } : { v: ACT.VIS.M, o: 0, c: 0, wob }, tear, blush: lerp(0.45, 0.85, sm),
    fx: tt => ACT.sym('heart', 330, 40, lt, 2.6, 99) },
    { t, pose: A2.blend(cxSt(), A2.pose({ hR: [212, 330] }), hk, 0.2), look, headDy: 4 * sob, tilt: 4 * sm });
  return w;
}

/* 9. 그리움: 행복한 기억 + 아픔 */
function cx9Scene(t, lt) {
  let w = cxBg('그리움', '먼 곳을 보는 눈 · 느린 깜빡임 · 옅은 미소 · 가슴에 손', lt);
  const LK = [[0, [0, 0.1]], [0.4, [-0.65, -0.55]]], look = ACT.saccade(lt, LK, 0.12, 29);
  const turn = A2.follow(tt => ACT.saccade(tt, LK, 0.12, 29)[0] * 0.4, lt, 1.4, 0.6, 1.2, 20), tl = A2.follow(tt => ACT.saccade(tt, LK, 0.12, 29)[0] * 9, lt, 1.2, 0.6, 1.2, 20);
  const hk = clamp(A2.actK(lt, 0.6, 0.6, { anticAmt: 0.05, over: 0.04 }), 0, 1.05), sm = easeInOut(prog(lt, 0.8, 1.6));
  w += cxZ('_c9', { t: lt, eyes: { open: 0.86 * (1 - ACT.blinks(lt, [1.4, 3.05], 0.5)), squint: 0.28, wet: 0.35 * sm }, brow: { worry: 0.3, raise: 2 }, mouth: { v: ACT.VIS.M, o: 0, c: lerp(1, 2.8, sm) }, blush: 0.45,
    fx: tt => ACT.sym('memory', 78, -34, lt, 0.9, 99) },
    { t, pose: A2.blend(cxSt(), A2.pose({ hR: [214, 334], hL: [188, 350] }), hk, 0.15), look, turn, tilt: tl + Math.sin(lt * 1.6 + 0.6) * 2, rot: Math.sin(lt * 1.6) * 1.5 });
  return w;
}

/* 10. 어이없음: 놀람 + 짜증 + 웃음 */
function cx10Scene(t, lt) {
  let w = cxBg('어이없음', '무표정으로 멈춤 · 느린 깜빡 두 번 · 눈썹 씰룩 · 코웃음', lt) + acBubble(1430, 330, '그거 내가 다 했어~', lt, 0.3, 1.6, -1);
  const dead = lt >= 0.5, tw = ACT.pulse(lt, 2.2, 0.3) + 0.6 * ACT.pulse(lt, 2.45, 0.25), hm = lt >= 2.62;
  const look = ACT.saccade(lt, [[0, [0.3, 0]], [0.5, [0.72, -0.05]], [2.9, [0.03, 0.02]]], 0.06, 30);
  w += cxZ('_c10', { t: lt, eyes: { flat: dead ? 0.45 : 0, hl: !dead, open: 1 - ACT.blinks(lt, [1.0, 1.75], 0.42) }, brow: { asymR: 7 * tw },
    mouth: dead && !hm ? null : { v: ACT.VIS.M, o: 0, c: hm ? [3.2, -0.5] : 0 }, mouthPath: 'M184 238 L216 238', blush: 0.2,
    fx: tt => ACT.sym('dots', 300, 22, lt, 1.2, 2.2) + ACT.sym('sigh', 214, 222, lt, 2.62, 3.3) },
    { t, look, headDy: -4 * ACT.pulse(lt, 2.62, 0.3), tilt: 3 * tw });
  return w;
}
