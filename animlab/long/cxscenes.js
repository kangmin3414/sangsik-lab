/* 복잡한 감정 갤러리: 섞인 감정 10가지. 한 감정마다 '자극 → 겉 감정 → 속 감정이 새어 나옴' 순서로 연기한다.
   actscenes.js(acZ·acBubble)와 act2.js(ACT)를 쓴다. 제로는 화면 왼쪽 가운데 클로즈업, 말하는 상대는 오른쪽 화면 끝(일부만 보임).
   v2(2026-11-09, 표정_물리검토_v1 반영): 말풍선 꼬리는 말하는 상대를 가리킴, 팔·손·볼·입김·땀 고침, 반응 폭 키움, 숨은 머리를 찌그러뜨리지 않음. */
const CXN = 10; for (let i = 1; i <= CXN; i++) CAMS['cx' + i] = 'fixed';
const CX = { X: 820, S: 2.2, Y: 1440 };
const CX_MIX = ['', '웃음(가면) + 슬픔', '웃음 + 아쉬움', '축하 + 분함', '토라짐 + 봐 줬으면', '하고 싶음 + 두려움', '긴장 → 풀림', '실망 + 받아들임', '눈물 + 웃음', '행복한 기억 + 아픔', '놀람 + 짜증 + 웃음'];
const cxBg = (name, recipe, lt) => { const k = ACT.symK(lt, 0.0, 99), n = ['괜찮은 척', '씁쓸함', '질투', '서운함', '망설임', '안도', '체념', '감동', '그리움', '어이없음'].indexOf(name) + 1, k2 = ACT.symK(lt, 0.25, 99);
  return `<rect x="-300" y="-200" width="2600" height="1500" fill="#F3EEE4"/><ellipse cx="${CX.X}" cy="700" rx="430" ry="340" fill="#fff" opacity=".45"/>` +
    `<g transform="translate(960 74) scale(${f1(k * 100) / 100})">${label(0, 0, name, { size: 52, bg: YEL })}</g>` + fT(960, 156, recipe, 36, INK) +
    `<g transform="translate(960 226) scale(${f1(k2 * 100) / 100})">${label(0, 0, '①②③④⑤⑥⑦⑧⑨⑩'[n - 1] + ' ' + CX_MIX[n], { size: 34, bg: '#fff' })}</g>`; };
// 말하는 상대: 오른쪽 화면 끝에 머리·어깨 일부만. tIn에 들어오고 tOut에 나간다(혼자 남는 순간이 보이게)
const cxPartner = (lt, tIn, tOut = 99) => { const k = easeOut(clamp((lt - tIn) / 0.35, 0, 1)) * (1 - easeIn(clamp((lt - tOut) / 0.4, 0, 1))); if (k <= 0.01) return '';
  const dx = (1 - k) * 320, bob = Math.sin(lt * 2.2) * 4;
  return `<g transform="translate(${f1(dx)} ${f1(bob)})"><path d="M1930 1010 Q1950 820 2120 800 Q2300 790 2330 1010 Z" fill="#7C8DA6" stroke="${INK}" stroke-width="9"/>` +
    `<ellipse cx="2150" cy="560" rx="255" ry="245" fill="#F2EEE6" stroke="${INK}" stroke-width="9"/><ellipse cx="1912" cy="590" rx="18" ry="30" fill="#F2EEE6" stroke="${INK}" stroke-width="7"/></g>`; };
// 상대의 말풍선: 꼬리는 오른쪽(상대) 쪽으로
const cxSay = (text, lt, t0, t1) => acBubble(1620, 300, text, lt, t0, t1, 1);
const cxPhone = `<g transform="translate(0 -50)"><rect x="-25" y="-44" width="50" height="88" rx="9" fill="#2B2F3A" stroke="${INK}" stroke-width="5"/><rect x="-19" y="-36" width="38" height="62" rx="3" fill="#CFE8FF"/>` +
  `<rect x="-13" y="-28" width="26" height="6" rx="3" fill="#fff"/><rect x="-13" y="-18" width="18" height="6" rx="3" fill="#fff"/><rect x="-14" y="10" width="28" height="12" rx="5" fill="#3BB273" stroke="${INK}" stroke-width="2.5"/></g>`;
const cxSt = () => A2.pose({});
const cxZ = (key, face, o) => acZ(key, face, Object.assign({ x: CX.X, y: CX.Y, s: CX.S }, o));
const SHRUG = { hL: [94, 350], hR: [306, 350], bend: { aL: -1, aR: 1 } }; // 팔꿈치는 몸 옆, 앞팔만 바깥으로(손바닥 위)

/* 1. 괜찮은 척: 웃음(가면) + 슬픔 */
function cx1Scene(t, lt) {
  let w = cxBg('괜찮은 척', '입은 웃는데 눈은 안 웃는다 → 혼자 남으면 무너진다', lt) + cxPartner(lt, 0.1, 2.0) + cxSay('괜찮아?', lt, 0.3, 1.9);
  const LK = [[0, [-0.2, 0.7]], [0.5, [0.7, -0.15]], [2.15, [0.95, 0.05]], [2.6, [-0.1, 0.75]]], look = ACT.saccade(lt, LK, 0.06, 21);
  const bl = Math.max(ACT.blinks(lt, [0.47, 2.6], 0.17), ACT.blinks(lt, [3.6], 0.4));
  const pm = lt >= 0.62 ? A2.spring(lt, 0.62, 3.2, 0.38) : 0, fall = easeInOut(clamp((lt - 2.55) / 0.85, 0, 1)), gulp = ACT.pulse(lt, 0.45, 0.22);
  const tw = lt > 0.9 && lt < 2.6 ? Math.sin(lt * 30) * 2.2 : 0; // 굳은 웃음: 입꼬리가 계속 파르르
  const c = lt < 0.62 ? -3 : lerp(lerp(-3, 5.5, pm), -4, fall), mo = lt < 0.62 ? 0 : lerp(0.5 * pm, 0, Math.min(1, fall * 1.6));
  const sg = ACT.sigh(lt, 3.05, 0.45, 0.9);
  const wv = Math.sin(lt * 11) * 12 * clamp((lt - 0.9) / 0.2, 0, 1) * (lt < 1.9 ? 1 : 0);
  const st = cxSt(), wave = A2.pose({ hR: [330 + wv, 196] }), wk = clamp(A2.actK(lt, 0.7, 0.3, { anticAmt: 0.1 }), -0.1, 1.1) * (1 - clamp(A2.actK(lt, 2.0, 0.45, { antic: 0.05, anticAmt: 0, over: 0 }), 0, 1));
  w += cxZ('_c1', { t: lt, eyes: { open: 1 - bl - 0.28 * fall, squint: 0, wet: lt < 0.62 ? 0.45 : lerp(0.45, 0.9, fall) }, // 눈은 웃지 않는다(아래 눈꺼풀 그대로, 촉촉)
    brow: { worry: lt < 0.62 ? 0.7 : lerp(0.55, 1, fall) }, mouth: { v: ACT.VIS.E, o: mo, c: [c, c + tw] }, blush: 0.3,
    fx: tt => ACT.sym('sigh', 210, 248, lt, 3.5, 4.3) + ACT.sym('gloom', 0, 0, lt, 3.3, 99) },
    { t, pose: A2.blend(st, wave, wk, 0.25), look, tilt: 5 * pm * (1 - fall) - 4 * fall, handR: wk > 0.4 ? 'open' : null, handRotR: -80, headDy: 6 * fall - 4 * sg + 4 * gulp });
  return w;
}

/* 2. 씁쓸함: 웃음 + 아쉬움 */
function cx2Scene(t, lt) {
  let w = cxBg('씁쓸함', '한쪽 입꼬리만 올라가고, 눈썹은 걱정, 시선은 아래로', lt);
  const LK = [[0, [0.05, 0]], [0.55, [-0.45, 0.85]]], look = ACT.saccade(lt, LK, 0.07, 22);
  const sm = easeInOut(prog(lt, 0.9, 1.45)), hu = ACT.pulse(lt, 1.75, 0.35);
  const bl = Math.max(ACT.blinks(lt, ACT.saccadeBlinks(LK, 0.5), 0.17), ACT.blinks(lt, [2.55], 0.45));
  w += cxZ('_c2', { t: lt, eyes: { open: (0.9 - 0.08 * sm) * (1 - bl), squint: 0.18 * sm, wet: 0.35 * sm }, brow: { worry: lerp(0.2, 0.85, easeInOut(prog(lt, 0.6, 1.2))) },
    mouth: { v: ACT.VIS.M, o: 0, c: [lerp(1, 8, sm), lerp(1, -3, sm)], dx: 6 * sm }, blush: 0.3,
    fx: tt => ACT.sym('hut', 226, 232, lt, 1.75, 2.5) },
    { t, look, tilt: -6 * sm, headDy: 5 * hu, turn: -0.15 * sm });
  return w;
}

/* 3. 질투: 축하 + 분함 */
function cx3Scene(t, lt) {
  let w = cxBg('질투', '얼굴은 축하, 주먹은 꽉 → 돌아서면 곁눈질·볼 부풀림', lt) + cxPartner(lt, 0.1, 2.05) + cxSay('나 합격했어!', lt, 0.3, 2.0);
  const cg = lt >= 0.55 && lt < 2.15, after = lt >= 2.15, dk = after ? A2.spring(lt, 2.15, 4, 0.5) : 0, pf = after ? A2.spring(lt, 2.3, 2.6, 0.35) : 0;
  const LK = [[0, [0, 0.1]], [0.5, [0.75, -0.1]], [2.15, [0.98, 0.12]]], look = ACT.saccade(lt, LK, 0.06, 23);
  const sh = Math.sin(lt * 42) * 3 * (lt > 0.9 ? 1 : 0), turn = after ? 0.35 * dk : 0.2;
  const pose = A2.pose({ hL: lt > 0.9 ? [118 + sh, 384] : [150, 412], hR: cg ? [312, 300] : after ? [282 + sh, 384] : [252, 412] });
  const face = after ? { turn, eyes: { flat: 0.45 * dk, size: 0.97, open: 1 - ACT.blinks(lt, [3.4], 0.2) }, brow: { angry: 0.38 * dk, knit: 0.45 * dk }, puff: [0.6 * pf, 0.6 * pf], mouth: { style: 'pout', dx: -4 }, blush: 0.55 }
    : { eyes: { squint: cg ? 0.55 : 0, open: 1 - ACT.blinks(lt, [0.48], 0.15) }, brow: { raise: cg ? 5 : 0 }, mouth: cg ? { v: ACT.VIS.A, o: 0.7, c: 5 } : { v: ACT.VIS.M, o: 0, c: 2 }, blush: 0.5 };
  w += cxZ('_c3', Object.assign({ t: lt, fx: tt => ACT.sym('vein', 266, 98, lt, 1.3, 2.1), hfx: tt => ACT.sym('storm', 352, 74, lt, 2.5, 99) }, face),
    { t, pose, look, handL: lt > 0.9 ? 'fist' : null, handR: cg ? 'thumb' : (after ? 'fist' : null), tilt: cg ? 5 : -3 * dk, turn });
  return w;
}

/* 4. 서운함: 토라짐 + 그래도 봐 줬으면 */
function cx4Scene(t, lt) {
  let w = cxBg('서운함', '삐죽 입·볼 부풀림 → 고개는 돌렸는데 눈은 자꾸 흘끗', lt) + cxPartner(lt, 0.1) + cxSay('아… 깜빡했다', lt, 0.3, 1.5);
  const away = lt >= 0.95, fl = ACT.pulse(lt, 0.5, 0.45);
  // 고개: 돌림(-0.85) → 흘끗할 때 반쯤 돌아옴(-0.4) → "흥" 하고 더 크게 돌림(-1)
  const tk = away ? A2.spring(lt, 0.95, 2.4, 0.45) : 0, pk1 = clamp((lt - 1.9) / 0.08, 0, 1) * (1 - clamp((lt - 2.25) / 0.08, 0, 1)), pk2 = clamp((lt - 3.1) / 0.08, 0, 1) * (1 - clamp((lt - 3.32) / 0.08, 0, 1));
  const toss = lt > 2.25 ? A2.spring(lt, 2.25, 3, 0.4) : 0, turn = -0.85 * tk + 0.55 * Math.max(pk1, pk2 * 0.8) - 0.15 * toss;
  const LK = [[0, [0.6, -0.1]], [0.95, [-1, 0.45]], [1.9, [0.85, 0.02]], [2.25, [-1, 0.45]], [3.1, [0.8, 0]], [3.32, [-1, 0.45]]], look = ACT.saccade(lt, LK, 0.05, 24);
  const tossP = ACT.pulse(lt, 2.28, 0.32), pf = away ? 0.6 + 0.3 * clamp((lt - 2.28) / 0.2, 0, 1) : 0;
  const face = lt < 0.95 ? { eyes: { size: 1 + 0.24 * fl, open: 1 - ACT.blinks(lt, [0.75], 0.17) }, brow: { raise: 10 * fl, worry: 0.5 * clamp((lt - 0.6) / 0.3, 0, 1) }, mouth: { v: ACT.VIS.M, o: 0, c: -2, wob: 0.4 }, blush: 0.45 }
    : { turn, eyes: { open: 1 - ACT.blinks(lt, [2.27, 3.33], 0.15), wet: 0.35, flat: 0.25 * (1 - Math.max(pk1, pk2)), size: 1 + 0.15 * Math.max(pk1, pk2) }, brow: { worry: 0.45, angry: 0.25 }, puff: [pf * 0.8, pf * 0.8], mouth: { style: 'pout', dx: -6 }, blush: 0.8,
        fx: tt => ACT.sym('huff', 186, 238, lt, 2.27, 2.9, -1) };
  w += cxZ('_c4', Object.assign({ t: lt }, face), { t, pose: cxSt(), crossArms: lt > 1.05, look, turn, tilt: -5 * tk - 12 * tossP, headDy: -6 * fl - 3 * tossP });
  return w;
}

/* 5. 망설임: 하고 싶음 + 두려움 */
function cx5Scene(t, lt) {
  let w = cxBg('망설임', '손이 나갔다 들어오기 두 번 · 입술 깨물기 · 시선이 왔다 갔다', lt);
  const KR = [[0, 0], [0.5, 0], [0.95, 0.6], [1.12, 0.6], [1.4, 0.1], [1.8, 0.1], [2.3, 0.97], [2.6, 0.95], [3.0, 0], [9, 0]];
  let i = 0; while (i + 1 < KR.length && lt >= KR[i + 1][0]) i++; const [ta, va] = KR[i], [tb, vb] = KR[i + 1], rk = lerp(va, vb, easeInOut(clamp((lt - ta) / (tb - ta), 0, 1)));
  const hover = lt > 2.3 && lt < 2.6 ? Math.sin(lt * 38) * 5 : 0, down = easeInOut(prog(lt, 3.3, 3.8));
  // 폰은 왼손, 전송 버튼은 손 위 34px. 검지 끝(손 중심에서 왼쪽 56px)은 버튼 오른쪽 끝 바로 앞에서 멈춘다(누르지 않음)
  const hL = [lerp(186, 168, down), lerp(388, 432, down)], tip = 200 + 6 + (1 - rk) * 50, hR = [tip + 56 + hover, lerp(404, hL[1] - 34, rk)];
  const LK = [[0, [0, 0.1]], [0.45, [0.1, 0.85]], [1.05, [-0.6, -0.3]], [1.5, [0.6, -0.2]], [1.8, [0.1, 0.85]], [2.65, [-0.5, 0.1]], [3.3, [0, 0.2]]], look = ACT.saccade(lt, LK, 0.06, 25);
  const bite = lt > 0.6 && lt < 3.2, sg = ACT.sigh(lt, 3.15, 0.35, 0.8), sq = (lt > 1.12 && lt < 1.28) || (lt > 2.6 && lt < 2.76);
  w += cxZ('_c5', { t: lt, eyes: { squeeze: sq ? 1 : 0, open: 1 - ACT.blinks(lt, ACT.saccadeBlinks(LK, 0.9), 0.15), size: 1 + 0.12 * rk }, brow: { knit: 0.4, worry: lt > 3.2 ? 0.85 : 0.75, raise: 4 * rk }, blush: 0.35,
    mouth: bite ? { style: 'bite', c: 0 } : { v: ACT.VIS.M, o: 0, c: -3, wob: lt >= 3.2 ? 0.35 : 0 },
    hfx: tt => ACT.sym('sweat', 280, 100, lt, 2.0, 99), fx: tt => ACT.sym('sigh', 210, 248, lt, 3.5, 4.3) },
    { t, pose: A2.pose({ hL, hR }), look, holdL: { svg: cxPhone, rot: 0 }, handL: 'grip', handR: rk > 0.25 ? 'point' : null, handRotR: 180, tilt: -3 + 4 * rk, headDy: -3 * sg });
  return w;
}

/* 6. 안도: 긴장 → 풀림 */
function cx6Scene(t, lt) {
  let w = cxBg('안도', '굳은 어깨 → 길게 "후~" → 가슴을 쓸어내림', lt) + cxPartner(lt, 0.55, 2.5) + cxSay('합격이래!', lt, 0.75, 2.4);
  const rel = lt >= 1.05, sg = ACT.sigh(lt, 1.05, 0.35, 1.2), rx = easeInOut(prog(lt, 1.3, 2.3)), sh = rel ? 0 : Math.sin(lt * 50) * 2;
  // 가슴 쓸어내리기(안도의 몸짓): 손바닥을 가슴에 대고 천천히 아래로. 머리가 큰 체형이라 이마 닦기보다 손이 자연스럽게 닿는다
  const wk = lt > 2.4 && lt < 3.7 ? clamp(A2.actK(lt, 2.4, 0.25), 0, 1) * (1 - clamp(A2.actK(lt, 3.4, 0.3, { antic: 0, over: 0 }), 0, 1)) : 0, wy = lerp(298, 360, easeInOut(prog(lt, 2.6, 3.35)));
  const pose = wk > 0 ? A2.blend(A2.pose({ dy: 3 }), A2.pose({ hR: [214, wy], dy: 3 }), wk, 0.25)
    : A2.blend(A2.pose({ hL: [182 + sh, 338], hR: [218 + sh, 338], dy: 0 }), A2.pose({ dy: 3 }), rx, 0.2);
  const LK = [[0, [0.5, -0.1]], [0.8, [0.72, -0.2]], [2.4, [0.1, 0.05]]], look = ACT.saccade(lt, LK, 0.05, 26);
  const face = !rel ? { eyes: { size: lt > 0.85 ? 1.18 : 1.06, open: 1 }, brow: { worry: 0.55, raise: lt > 0.85 ? 8 : 0 }, mouth: { v: ACT.VIS.M, o: 0, c: -1, wob: lt > 0.85 ? 0 : 0.6 }, blush: 0.25 }
    : { eyes: { open: lt < 2.3 ? 0 : 1 - ACT.blinks(lt, [3.0], 0.2), squint: lt < 2.3 ? 0.85 : 0.35 }, brow: { worry: 0.35 }, mouth: lt > 1.35 && lt < 2.4 ? { v: ACT.VIS.U, o: 0.55 } : { v: ACT.VIS.M, o: 0, c: lerp(-1, 4, rx) }, blush: 0.5 };
  w += cxZ('_c6', Object.assign({ t: lt, hfx: tt => ACT.sym('sweat', 280, 100, lt, 0, 1.5), fx: tt => ACT.sym('sigh', 210, 248, lt, 1.4, 2.6) }, face),
    { t, pose, look, handL: rel ? null : 'fist', handR: rel ? (wk > 0.3 ? 'open' : null) : 'fist', handRotR: 100, headDy: (rel ? lerp(8, -2, rx) - 3 * sg : 8) + 2 * wk, tilt: 4 * rx });
  return w;
}

/* 7. 체념: 실망 + 받아들임 */
function cx7Scene(t, lt) {
  let w = cxBg('체념', '들숨에 올라갔다 날숨에 내려앉기 · 반쯤 감은 눈 · 으쓱', lt);
  const sg = ACT.sigh(lt, 0.3, 0.6, 1.1), inh = Math.max(0, sg), shr = lt >= 2.3, sk = shr ? clamp(A2.actK(lt, 2.3, 0.3, { anticAmt: 0.1 }), -0.1, 1.1) : 0, up = ACT.pulse(lt, 2.35, 0.45);
  const look = ACT.saccade(lt, [[0, [-0.25, 0.6]], [2.3, [0.05, 0.35]]], 0.08, 27); // 시선은 끝까지 아래(위로 굴리면 '짜증'으로 읽힘)
  const pose = A2.blend(A2.pose({ hL: [140, 412 - 12 * inh], hR: [260, 412 - 12 * inh] }), A2.pose(SHRUG), sk, 0.2);
  const ex = lt > 0.9 && lt < 2.0, smile = lt >= 2.0;
  w += cxZ('_c7', { t: lt, eyes: { open: 0.85 * (1 - ACT.blinks(lt, [2.95], 0.42)), flat: 0.38 }, brow: { worry: 0.6 },
    mouth: lt > 0.3 && lt < 0.9 ? { v: ACT.VIS.O, o: 0.28 } : ex ? { v: ACT.VIS.U, o: 0.38 } : { v: ACT.VIS.M, o: 0, c: smile ? [0.5, 3.2] : -1, dx: smile ? 4 : 0 }, blush: 0.25,
    fx: tt => ACT.sym('sigh', 210, 248, lt, 0.9, 2.0) },
    { t, pose, look, handL: sk > 0.4 ? 'open' : null, handR: sk > 0.4 ? 'open' : null, handRotL: 195, handRotR: -15, headDy: -6 * sg + 7 * up, tilt: 8 * clamp(sk, 0, 1) });
  return w;
}

/* 8. 감동(울컥): 눈물 + 웃음 */
function cx8Scene(t, lt) {
  let w = cxBg('감동', '입술이 떨리고 눈물이 맺힌 위로 웃음이 번진다', lt) + cxPartner(lt, 0.1) + cxSay('늘 고마워', lt, 0.3, 2.6);
  const pk = ACT.pulse(lt, 0.55, 0.45), wob = clamp((lt - 0.8) / 0.4, 0, 1), wet = clamp((lt - 0.9) / 0.5, 0, 1), tear = clamp((lt - 1.4) / 0.3, 0, 1), sm = easeInOut(prog(lt, 2.1, 2.5));
  const sob = ACT.pulse(lt, 1.5, 0.28) + ACT.pulse(lt, 1.9, 0.28);
  const look = ACT.saccade(lt, [[0, [0, 0.1]], [0.45, [0.72, -0.2]], [2.2, [0.35, -0.05]]], 0.06, 28);
  const hk = clamp(A2.actK(lt, 1.2, 0.35, { anticAmt: 0.08 }), 0, 1.1);
  const mouth = lt > 0.5 && lt < 0.85 ? { v: ACT.VIS.O, o: 0.4 } : sm > 0.05 ? { v: ACT.VIS.E, o: 0.32 * sm, c: lerp(0, 4, sm), wob: lerp(1, 0.5, sm) * wob } : { v: ACT.VIS.M, o: 0, c: 0, wob };
  w += cxZ('_c8', { t: lt, eyes: { size: 1 + 0.24 * pk + 0.04 * wet, wet: wet, squint: 0.55 * sm, open: 1 - ACT.blinks(lt, [1.15], 0.2) }, brow: { raise: 10 * pk, worry: 0.75 * clamp((lt - 0.8) / 0.3, 0, 1) },
    mouth, tear, blush: lerp(0.45, 0.85, sm), fx: tt => ACT.sym('heart', 352, 150, lt, 2.6, 99) },
    { t, pose: A2.blend(cxSt(), A2.pose({ hR: [212, 318] }), hk, 0.2), look, headDy: 4 * sob - 5 * pk, tilt: 4 * sm });
  return w;
}

/* 9. 그리움: 행복한 기억 + 아픔 */
function cx9Scene(t, lt) {
  let w = cxBg('그리움', '먼 곳을 보는 눈 · 느린 깜빡임 · 옅은 미소 · 가슴에 손', lt);
  const LK = [[0, [0, 0.1]], [0.4, [-0.65, -0.55]]], look = ACT.saccade(lt, LK, 0.12, 29);
  const turn = A2.follow(tt => ACT.saccade(tt, LK, 0.12, 29)[0] * 0.4, lt, 1.4, 0.6, 1.2, 20), tl = A2.follow(tt => ACT.saccade(tt, LK, 0.12, 29)[0] * 9, lt, 1.2, 0.6, 1.2, 20);
  const hk = clamp(A2.actK(lt, 0.6, 0.6, { anticAmt: 0.05, over: 0.04 }), 0, 1.05), sm = easeInOut(prog(lt, 0.8, 1.6));
  w += cxZ('_c9', { t: lt, eyes: { open: 0.86 * (1 - ACT.blinks(lt, [1.4, 3.05], 0.5)), squint: 0.28, wet: 0.35 * sm }, brow: { worry: 0.3, raise: 2 }, mouth: { v: ACT.VIS.M, o: 0, c: lerp(1, 2.8, sm) }, blush: 0.45,
    hfx: tt => ACT.sym('memory', -14, 94, lt, 0.9, 99) }, // 생각 풍선은 머리 왼쪽 옆, 꼬리 원은 머리 쪽
    { t, pose: A2.blend(cxSt(), A2.pose({ hR: [214, 318], hL: [190, 332] }), hk, 0.15), look, turn, tilt: tl + Math.sin(lt * 1.6 + 0.6) * 2, rot: Math.sin(lt * 1.6) * 1.5 });
  return w;
}

/* 10. 어이없음: 놀람 + 짜증 + 웃음 */
function cx10Scene(t, lt) {
  let w = cxBg('어이없음', '무표정으로 멈춤 · 느린 깜빡 두 번 · 눈썹 씰룩 · 코웃음', lt) + cxPartner(lt, 0.1) + cxSay('그거 내가 다 했어~', lt, 0.3, 1.6);
  const dead = lt >= 0.5, tw = ACT.pulse(lt, 2.2, 0.3) + 0.6 * ACT.pulse(lt, 2.45, 0.25), hm = lt >= 2.62;
  const look = ACT.saccade(lt, [[0, [0.3, 0]], [0.5, [0.72, -0.05]], [2.9, [0.03, 0.02]]], 0.06, 30);
  w += cxZ('_c10', { t: lt, eyes: { flat: dead ? 0.45 : 0, hl: !dead, open: 1 - ACT.blinks(lt, [1.0, 1.75], 0.42) }, brow: { asymR: 16 * tw },
    mouth: dead && !hm ? null : { v: ACT.VIS.M, o: 0, c: hm ? [4.5, -1.5] : 0, dx: hm ? 5 : 0 }, mouthPath: 'M184 238 L216 238', blush: 0.2,
    fx: tt => ACT.sym('dots', 318, 92, lt, 1.2, 2.2) + ACT.sym('huff', 224, 230, lt, 2.62, 3.5) },
    { t, look, headDy: -4 * ACT.pulse(lt, 2.62, 0.3), tilt: 5 * tw });
  return w;
}
