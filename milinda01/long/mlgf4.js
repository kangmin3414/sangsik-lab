/* 불교 편(수레 문답·무아) — 43~57번(대본_v2.md, 화면연출_v2.md): 스티커를 떼다(mltue) · 발표 전날 밤(mleve) · 발표 날(mlday) · 석 달 뒤(mlend) · 굴러가는 수레(mlroll) · 빈칸 카드(mlcard). mlgf3.js 뒤에 읽는다.
   대화 장면(회의실)은 기본 연출: gfxDirect로 시선, gfxShots로 샷, gfxCompose로 초점, gfxMood로 이야기를 따라가는 빛(스티커를 뗀 순간 · '아직'이 붙는 순간에 햇살). */
Object.assign(E, {
  'ml팀장미소': Object.assign(zEyes(10, 12), { bL: [144, 150, 164, 146, 184, 150], bR: [216, 150, 236, 146, 256, 150] }, { mouth: 'M188 234 Q200 243 212 234', mouthFill: 'none', fxEye: zHL2(190, 0.7) }),
  'ml연습a': Object.assign(zEyes(11, 14), { bL: [146, 150, 164, 146, 182, 150], bR: [218, 150, 236, 146, 254, 150] }, { mouth: 'M192 236 L208 236', mouthFill: 'none', fxEye: zHL2(190, 0.85) }),
  'ml연습b': Object.assign(zEyes(11, 14), { bL: [146, 148, 164, 142, 182, 148], bR: [218, 148, 236, 142, 254, 148] }, { mouth: 'M190 232 Q200 250 210 232 Q200 226 190 232 Z', mouthFill: '#7A2E2E', fxEye: zHL2(190, 0.85) }),
});
P['ml떼기'] = mlPose({ armL: [[148, 285], [116, 332], [150, 328]], hL: [162, 324], armR: [[252, 285], [290, 350], [298, 408]], hR: [298, 420] });      // 왼손은 가슴 스티커 귀퉁이, 오른손은 허리 높이(딱지가 올라선다)
P['ml떼기2'] = mlPose({ armL: [[148, 285], [116, 332], [150, 328]], hL: [162, 324] });                                                                // 왼손만 가슴에
P['ml뗌'] = mlPose({ armL: [[148, 285], [96, 318], [62, 300]], hL: [52, 296] });                                                                      // 뗀 스티커를 옆으로 든 손
P['ml연습'] = mlPose({ armL: [[148, 285], [130, 346], [160, 404]], hL: [166, 412], armR: [[252, 285], [298, 326], [304, 268]], hR: [306, 256] });      // 오른손에 리모컨을 들고
const mlSY = o => zGirl(Object.assign({ hairStyle: 'bob', top: '#B9A6F0' }, mlHead('서윤', o)));                                                       // 서윤: 인턴, 단발
// 딱지가 두 손으로 눈을 가린다(k: 0 가림 → 1 손가락 사이로 봄)
const mlTakHands = (x, y, s, k) => [-1, 1].map(sd => { const hx = x + sd * (27 + 13 * k) * s, hy = y - (94 - 3 * k) * s; return `<path d="M${f1(x + sd * 60 * s)} ${f1(y - 66 * s)} Q${f1(x + sd * 74 * s)} ${f1(y - 96 * s)} ${f1(hx + sd * 8 * s)} ${f1(hy)}" fill="none" stroke="${INK}" stroke-width="${f1(9 * s)}" stroke-linecap="round"/><circle cx="${f1(hx)}" cy="${f1(hy)}" r="${f1(20 * s)}" fill="#fff" stroke="${INK}" stroke-width="${f1(6 * s)}"/><path d="M${f1(hx - 7 * s)} ${f1(hy - 9 * s)} v${f1(18 * s)} M${f1(hx + 5 * s)} ${f1(hy - 9 * s)} v${f1(18 * s)}" stroke="${INK}" stroke-width="${f1(3.5 * s)}" stroke-linecap="round" opacity=".5"/>`; }).join('');

/* ---------- [화요일] 회의실 문 앞: 스티커를 떼다(43~46번) ---------- */
const ML_T = { ZX: 900, Y: 930, S: 1.0 };
function mlDoorSet(t) {
  const FY = 930;
  let wall = `<rect x="-300" y="-300" width="2520" height="1700" fill="url(#mlOWall)"/><rect x="-300" y="${FY - 110}" width="2520" height="110" fill="#B4C6D8"/><rect x="-300" y="${FY}" width="2520" height="600" fill="#8FA3BA"/><rect x="-300" y="${FY - 6}" width="2520" height="18" fill="#E8F0F7" stroke="${INK}" stroke-width="5"/>`;
  wall += `<rect x="40" y="150" width="400" height="460" rx="18" fill="#fff" stroke="${INK}" stroke-width="9"/><rect x="62" y="172" width="356" height="416" fill="url(#mlOSky)"/>` + Array.from({ length: 12 }, (_, i) => `<rect x="62" y="${178 + i * 35}" width="356" height="17" fill="#F7FAFD" stroke="#B9C8D8" stroke-width="2.5"/>`).join('') + `<rect x="44" y="136" width="392" height="30" rx="8" fill="#E3EBF3" stroke="${INK}" stroke-width="7"/>`;
  wall += `<g opacity=".5" style="mix-blend-mode:screen">` + Array.from({ length: 7 }, (_, i) => `<path d="M${520 + i * 26} ${270 + i * 46} L${900 + i * 26} ${270 + i * 46} L${880 + i * 26} ${292 + i * 46} L${500 + i * 26} ${292 + i * 46} Z" fill="#FFF4D0"/>`).join('') + `</g>`;
  // 회의실 문 + 팻말
  wall += `<rect x="1330" y="232" width="340" height="${FY - 232}" rx="12" fill="#E8D7B8" stroke="${INK}" stroke-width="10"/><rect x="1354" y="256" width="292" height="${FY - 256}" fill="#C99A62" stroke="${INK}" stroke-width="7"/><rect x="1392" y="300" width="216" height="170" rx="12" fill="#DCE8F2" stroke="${INK}" stroke-width="6"/><path d="M1410 440 L1470 318 M1470 440 L1530 318" stroke="#fff" stroke-width="9" opacity=".6" stroke-linecap="round"/><rect x="1392" y="520" width="216" height="330" rx="12" fill="#B5864F" opacity=".5"/><circle cx="1618" cy="650" r="16" fill="#F2C14E" stroke="${INK}" stroke-width="6"/>` +
    `<g transform="translate(1500 176)"><rect x="-112" y="-38" width="224" height="76" rx="14" fill="#fff" stroke="${INK}" stroke-width="7"/>${gfT(0, 15, '회의실', 42, GFC.navy)}</g>`;
  wall += `<rect x="1010" y="250" width="200" height="150" rx="10" fill="#FDFEFF" stroke="${INK}" stroke-width="8"/><path d="M1036 366 L1076 316 L1110 346 L1150 290 L1186 330" fill="none" stroke="#3DDBB4" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
  return { wall, plant: gfPlant(560, FY, 1.05, t) };
}
function mlTueDoor(t) {
  const { ZX, Y, S } = ML_T, c = mlCur(t), id = c ? c.id : 't43', t43 = mlL('t43'), t44 = mlL('t44'), t45 = mlL('t45'), t46 = mlL('t46');
  const chest = [ZX - 2, Y - 226 * S], head = [ZX + 26 * S, Y - 494 * S], palm = gfHand(ZX, Y, S, [298, 420]), shoulder = [ZX - 74 * S, Y - 288 * S];
  const tGrab = t43.t0 + 0.55, tJump = t44.t0 - 0.24, tThen = mlAt('t44', '그때', 0.31), tHow = mlAt('t44', '어떡', 0.72), tBut = mlAt('t45', '그래도', 0.33), tStage = mlAt('t45', '무대', 0.64);
  const tBack = t46.t0 - 0.3, tPl = t46.t0 + 0.2, tOff = tPl + 1.2, tFold = tOff + 0.3, tPocket = tFold + 0.4, tPeek = tPl + 0.85;
  const mood = gfxMood(t, [[tThen - 0.2, -0.4, 1.4], [tStage, -0.1, 1.2], [tOff + 0.05, 0.75, 1.3]]);      // 딱지의 걱정에 그늘 → "무대엔 섰잖아"에서 걷히고 → 스티커를 떼면 햇살
  let cam = gfxCam([[0, { x: 1040, y: 566, z: 1.1 }], [t43.t0 - 0.13, { x: 1030, y: 562, z: 1.16 }, { d: tGrab + 0.3 - t43.t0, ease: 'lin' }], [tGrab + 0.35, { x: ZX + 10, y: Y - 318, z: 1.9 }, { d: 0.8, ease: 'io' }],
    [t44.t0 - 0.15, { x: ZX + 70, y: Y - 262, z: 2.42 }, { ease: 'cut' }], [t44.t0, { x: ZX + 74, y: Y - 266, z: 2.56 }, { d: 3.8, ease: 'lin' }], [t45.t0 - 0.15, { x: ZX + 30, y: Y - 348, z: 1.7 }, { ease: 'cut' }], [t45.t0, { x: ZX + 30, y: Y - 356, z: 1.82 }, { d: 4.2, ease: 'lin' }],
    [t46.t0 - 0.15, { x: ZX - 40, y: Y - 262, z: 2.4 }, { ease: 'cut' }], [t46.t0, { x: ZX - 44, y: Y - 264, z: 2.54 }, { d: tOff - t46.t0, ease: 'lin' }], [tFold, { x: ZX + 40, y: Y - 336, z: 1.5 }, { d: 0.85, ease: 'io' }]], t);
  cam = gfxShake(gfxDrift(cam, t, 3, 8), t, [[tOff, 9, 0.25]]);
  /* --- 제로 --- */
  const zt = gfxTalkAct(t, 'Z', 2), inh = t > tGrab && t < t44.t0 ? 0.045 * Math.sin(Math.PI * gfK(tGrab, tGrab + 1.3, t)) : 0, jz = actHit(t, tOff, 0.06, 5, 8);
  const zPose = actPose([[0, '서기'], [tGrab - 0.25, 'ml떼기2', { f: 3, z: 0.65 }], [tJump - 0.2, 'ml떼기', { f: 3.4, z: 0.6 }], [tBack + 0.1, 'ml떼기2', { f: 2.8, z: 0.7 }], [tOff, 'ml뗌', { f: 3.2, z: 0.6 }], [tPocket, '서기', { f: 2.6, z: 0.8 }]], t);
  const shk = id === 't45' && t < tBut ? 1 : (t > tPl && t < tOff ? 0.6 : 0), jx = Math.sin(t * 39) * 2.4 * shk;
  const zP2 = shk ? Object.assign({}, zPose, { hL: [zPose.hL[0] + jx, zPose.hL[1]], armL: zPose.armL.map((q, i) => i === 2 ? [q[0] + jx, q[1]] : q) }) : zPose;
  const zBase = t < tGrab ? 'z기본' : t < t44.t0 ? 'z결심' : t < t45.t0 ? 'z당황' : t < tBut ? 'ml쓴웃음' : t < tStage ? 'z기본' : t < t46.t0 ? 'z뿌듯' : t < tOff ? 'z결심' : 'z뿌듯';
  const zLook = t < tGrab ? [0.75, 0] : t < tJump ? [0, 0.9] : t < tBut ? [0.55, 0.85] : t < tStage ? [0.3, 0.3] : t < t46.t0 ? [0.7, -0.1] : t < tOff ? [-0.25, 0.9] : t < tPocket ? [-0.6, 0.5] : [0.75, 0];
  const zero = mlZ({ x: ZX, y: Y, s: S, t, pose: zP2, ex: gfxFace('mlzf', zBase, t, 'Z'), look: zLook, turn: zLook[0] * 0.5, turnK: 34, turnSq: 0.1, headDy: zt.headDy + (t > tOff ? actNod(t, tOff + 0.5, 1, 8, 0.4) : 0), tilt: zt.tilt, sx: jz.sx, sy: jz.sy * zt.sy * (1 + inh), light: -1 }, true);
  /* --- 가슴의 스티커: 귀퉁이를 잡음 → 천천히 떼어짐(실이 늘어났다 끊어짐) → 반으로 접어 주머니에 --- */
  const kPeel = t < tGrab ? 0 : t < tPl ? 0.26 * mlS(t, tGrab, 0.3) : lerp(0.26, 1, easeInOut(gfK(tPl, tOff, t))), kGo = easeInOut(gfK(tOff, tFold, t)), kFold = easeInOut(gfK(tFold, tFold + 0.3, t)), kPk = easeInOut(gfK(tPocket, tPocket + 0.4, t));
  const sx0 = lerp(lerp(chest[0], ZX - 150 * S, kGo), ZX - 96 * S, kPk), sy0 = lerp(lerp(chest[1], Y - 262 * S, kGo), Y - 96 * S, kPk);
  let stk = kPk >= 0.98 ? '' : mlOp(1 - gfK(0.6, 1, kPk), `<g transform="translate(${f1(sx0 + (shk ? jx : 0))} ${f1(sy0)}) rotate(${f1(-5 - 14 * kGo)}) scale(${f1((1 - 0.5 * kFold) * 1000) / 1000} 1)">${mlSt(['원래', '무대 체질 아님'], 20, { peel: kPeel * (1 - kGo) })}</g>`);
  if (t > tPl + 0.35 && t < tOff) { const u = gfK(tPl + 0.35, tOff, t); stk += [0, 1].map(i => `<path d="M${f1(chest[0] + 30 - i * 40)} ${f1(chest[1] - 10 + i * 18)} Q${f1(chest[0] + 10 - i * 30)} ${f1(chest[1] - 30 - 16 * u)} ${f1(chest[0] - 30 - i * 26 - 34 * u)} ${f1(chest[1] - 22 + i * 22 - 26 * u)}" fill="none" stroke="#FFF6D8" stroke-width="${f1(4 - 2.4 * u)}" stroke-linecap="round" opacity=".9"/>`).join(''); }
  const mark = t > tOff ? mlOp(0.5 * (1 - gfK(tOff, tOff + 2.2, t)), `<rect x="${f1(chest[0] - 58)}" y="${f1(chest[1] - 30)}" width="116" height="60" rx="8" fill="#fff" fill-opacity=".25" stroke="#fff" stroke-width="4" stroke-dasharray="8 8" transform="rotate(-5 ${f1(chest[0])} ${f1(chest[1])})"/>`) : '';
  /* --- 딱지: 머리 위 → 제로 손바닥으로 뛰어내려 스티커를 끌어안음 → 어깨로 올라가 눈을 가림 --- */
  const kJ = easeInOut(gfK(tJump, tJump + 0.34, t)), kB = easeInOut(gfK(tBack, tBack + 0.34, t)), tv = gfxVoice(t, 'T');
  const A0 = [head[0], head[1] + zt.headDy], A1 = [palm[0] - 6, palm[1] - 20 * S], A2 = [shoulder[0], shoulder[1]];
  const tp = kB > 0 ? [lerp(A1[0], A2[0], kB), lerp(A1[1], A2[1], kB) - Math.sin(Math.PI * kB) * 110] : [lerp(A0[0], A1[0], kJ), lerp(A0[1], A1[1], kJ) - Math.sin(Math.PI * kJ) * 70];
  const tEx = t < tGrab + 0.15 ? 'on' : t < tJump ? 'shock' : t < tStage ? 'worry' : t < tBack ? 'on' : t < tOff + 0.5 ? 'on' : 'on';
  const tLook = t < tGrab ? [0.6, 0.2] : t < tJump ? [-0.2, 0.95] : t < tBack ? (t > tHow ? [-0.3, 0.7] : [-0.9, 0.1]) : t > tOff + 0.3 ? [0.6, -0.5] : [0.5, 0.6];
  const tS2 = lerp(0.6, 0.56, Math.max(kJ, 0)), land = gfM(actHit(t, tJump + 0.34, 0.14, 5, 9), actHit(t, tBack + 0.34, 0.14, 5, 9));
  const tak = mlTak(tp[0], tp[1], tS2, Object.assign({ t, look: tLook, talk: tv ? tv.e : 0, ex: tEx, rot: kJ > 0.95 && kB <= 0 ? -13 : 0, arm: t > t46.t0 + 0.05 && t < tOff + 0.9 ? 'none' : (kJ > 0.95 && kB <= 0 ? 'up' : 'down') }, gfHop(t, tGrab + 0.1, 16, 0.22), { sx: land.sx, sy: land.sy }));
  const hands = t > t46.t0 + 0.05 && t < tOff + 0.9 ? mlTakHands(tp[0], tp[1], tS2, easeInOut(gfK(tPeek, tPeek + 0.3, t))) : '';
  // 44번 "그때처럼": 딱지의 생각 풍선에 10년 전 사진(떨리는 손)
  let bub = ''; if (t > tThen && t < t45.t0 - 0.1) { const k = gfIn(t, tThen, 3.2, 0.42) * (1 - mlS(t, t45.t0 - 0.4, 0.25)), bx = ZX + 232, by = Y - 372;
    bub = `<g transform="translate(${bx} ${by}) scale(${f1(k * 1000) / 1000})"><circle cx="-128" cy="92" r="11" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-104" cy="70" r="16" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-100" y="-66" width="200" height="124" rx="26" fill="#fff" stroke="${INK}" stroke-width="6"/><g transform="translate(0 -4) scale(.105)">${mlStagePhoto(t, 1)}</g></g>`; }
  const em = gfEmote(t, tGrab + 0.2, head[0] + 70, head[1] - 90, 'bang', { hold: 0.9, s: 0.7 }) + gfEmote(t, tHow + 0.1, A1[0] + 70, A1[1] - 96, 'sweat', { hold: 1.0, s: 0.6 }) + gfStarBurst(t, tOff, chest[0], chest[1], { n: 8, r0: 30, r1: 170 }) + gfPuff(t, tOff, chest[0] - 30, chest[1], 0.8, '#FFF6D8');
  const lines = shk ? mlShakeLines(gfHand(ZX, Y, S, zP2.hL)[0] - 16, gfHand(ZX, Y, S, zP2.hL)[1], t, shk, 2, -1) : '';
  const set = mlDoorSet(t), actors = set.plant + shadow(ZX, Y + 2, 118, 0.22) + zero + mark + stk + lines + tak + hands, kp = gfxProj(cam, 240, 300);
  return gfxCompose({ cam, defs: gfDefs() + ML_DEFS + ML_DEFS3 + gfxDefs({ shadow: '#2A3655', lights: [{ id: 'mlLt', amb: '#C4C9DC', key: { x: kp[0], y: kp[1], z: 700 * cam.z, col: '#FFF0CC', k: 0.62 * mood.light }, rim: { dx: -6, dy: -3, col: '#FFF4D0', k: 0.55 }, bump: 5, relief: 7 }] }),
    far: [[0.93, set.wall]], cast: [zero, { dx: 46, dy: 6, s: 1.03, cx: 960, cy: 700, op: 0.18, soft: 2 }], lit: actors, light: 'mlLt',
    glow: gfxShafts(t, { x: 260, y: 170, ang: -52, n: 4, gap: 86, w: 60, len: 1500, op: 0.2 * mood.shafts, col: '#FFF3CC', spread: 1.5 }) + gfxDust(t, { box: [380, 200, 900, 560], n: 24, seed: 8, op: 0.55 }) + bub + em,
    fg: mlOfficeSet(t).fg, fgDepth: 1.4, fgFd: 1.9, grade: gfxGrade('warm', 0.28), mood: mood.over, vig: gfxVignette(0.3, '#1A2440'), hud: gfChipAt(t, t43.t0 + 0.1, 262, 96, '화요일 09:00', { size: 34, icon: 'sun' }) });
}
/* ---------- 47번: 회의실 안(10번의 거울 구도). 이번엔 리모컨이 제로 쪽으로 온다 ---------- */
function mlTueRoom(t) {
  const { BX, ZX, Y, S, TY } = ML_O, t47 = mlL('t47'), tYet = mlAt('t47', '아직', 0.36), tDo = mlAt('t47', '해보', 0.68), tSl = t47.t1 - 0.2, xA = BX + 206, xB = ZX - 200, k1 = easeOut(gfK(tSl, tSl + 0.75, t)), rx = lerp(xA, xB, k1);
  const remote = mlRemote(rx, TY - 2, (1 - k1) * -8 + Math.sin(k1 * 9) * 4 * (1 - k1));
  const CAST = { Z: { x: ZX, y: Y - 390 * S, to: 'B', seed: 2 }, B: { x: BX, y: Y - 390 * S, to: 'Z', seed: 4 } };
  const D = gfxDirect(t, CAST, { focus: [[tSl - 0.1, tSl + 1.0, rx, TY - 40]], think: false });
  let cam = gfxCam([[0, { x: 965, y: 566, z: 1.1 }], [t47.t0 - 0.13, { x: 965, y: 564, z: 1.15 }, { d: tYet - t47.t0, ease: 'lin' }], [tYet - 0.15, { x: 1336, y: 556, z: 1.62 }, { ease: 'cut' }], [tYet - 0.13, { x: 1336, y: 552, z: 1.72 }, { d: tSl - tYet, ease: 'lin' }],
    [tSl - 0.12, { x: 930, y: 640, z: 1.42 }, { ease: 'cut' }], [tSl, { x: 1090, y: 640, z: 1.5 }, { d: 0.85, ease: 'io' }], [tSl + 1.0, { x: 980, y: 570, z: 1.16 }, { d: 0.8, ease: 'io' }]], t);
  cam = gfxDrift(cam, t, 3, 9);
  const single = t >= tYet - 0.15 && t < tSl - 0.12; if (single) gfxUnmark('팀장');
  const lookUp = mlS(t, t47.t0 + 0.25, 0.35), bPose = actPose([[0, 'ml앉음'], [tSl - 0.25, 'ml내밂R', { f: 3.4, z: 0.7 }], [tSl + 0.7, 'ml앉음', { f: 2.4, z: 0.8 }]], t);
  const bA = gfxAct(D.B), boss = mlB(Object.assign({ x: BX, y: Y, s: S, t, pose: bPose }, bA, { look: lookUp < 1 ? [lerp(0.2, bA.look[0], lookUp), lerp(0.9, bA.look[1], lookUp)] : bA.look, headDy: bA.headDy + 10 * (1 - lookUp), ex: gfxEx(fEx(t > tDo + 0.7 ? 'ml팀장미소' : 'ml팀장'), D.B), light: -1 }));
  const zt = gfxTalkAct(t, 'Z', 2), zBase = t < tYet ? 'z당황' : t < tDo ? 'ml쓴웃음' : t < tSl + 0.8 ? 'z결심' : 'z반짝';
  const zPose = actPose([[0, 'ml앉음'], [tSl + 0.6, 'ml내밂L', { f: 3.2, z: 0.7 }]], t);
  const zero = mlZ(Object.assign({ x: ZX, y: Y, s: S, t, pose: zPose }, gfxAct(D.Z), { ex: gfxEx(gfxFace('mlzf', zBase, t, 'Z'), D.Z), sy: zt.sy, light: -1 }), true);
  const sticker = mlAtP(BX + 66 * S, Y - 262 * S, 1, mlSt(['원래', '차가운 사람'], 20), 7);
  const tak = mlTak(ZX + 28 * S, Y - 494 * S + (D.Z.headDy || 0), 0.6, { t, look: t > tSl ? [-0.8, 0.6] : [-0.9, 0.2], ex: 'on' });
  const set = mlOfficeSet(t), actors = set.back + (single ? '' : boss + sticker) + zero + set.table + remote + set.plant + tak, kp = gfxProj(cam, 340, 300);
  const em = gfEmote(t, tSl + 0.8, ZX + 150, Y - 520 * S, 'spark', { hold: 1.0, s: 0.9 });
  return gfxCompose({ cam, defs: gfDefs() + ML_DEFS + ML_DEFS3 + gfxDefs({ shadow: '#2A3655', lights: [{ id: 'mlLo', amb: '#C4C9DC', key: { x: kp[0], y: kp[1], z: 700 * cam.z, col: '#FFF0CC', k: 0.7 }, rim: { dx: -6, dy: -3, col: '#FFF4D0', k: 0.55 }, bump: 5, relief: 7 }] }),
    far: [[0.93, set.wall]], cast: [(single ? '' : boss) + zero, { dx: 44, dy: 6, s: 1.03, cx: 960, cy: 700, op: 0.2, soft: 2 }], lit: actors, light: 'mlLo',
    glow: gfxShafts(t, { x: 330, y: 150, ang: -52, n: 4, gap: 86, w: 60, len: 1500, op: 0.26, col: '#FFF3CC', spread: 1.5 }) + gfxDust(t, { box: [420, 180, 1000, 560], n: 26, seed: 5, op: 0.55 }) + em,
    fg: set.fg, fgDepth: 1.4, fgFd: 1.9, grade: gfxGrade('warm', 0.32), mood: gfxMood(t, [[-1, 0.45, 0.1]]).over, vig: gfxVignette(0.3, '#1A2440'), hud: gfChipAt(t, -1, 262, 96, '화요일 09:00', { size: 34, icon: 'sun' }) });
}
function mltueScene(t, lt, a) { const c = mlCur(t); return c && c.id === 't47' ? mlTueRoom(t) : mlTueDoor(t); }

/* ---------- [발표 전날] 밤 10시(48~50번) ---------- */
// 말풍선 한 장(왼쪽 = 받은 말). lines: 글줄 배열
function mlChatBub(x, y, lines, k, mine) { if (k <= 0) return ''; const fs = 40, w = Math.max(...lines.map(s => gfTextW(s, fs, 800))) + 64, h = lines.length * 54 + 40, x0 = mine ? x - w : x;
  return `<g transform="translate(${f1(mine ? x : x0)} ${f1(y + (1 - Math.min(1, k)) * 34)}) scale(${f1(Math.min(1.05, k) * 1000) / 1000}) translate(${f1(mine ? -w : 0)} 0)"><rect x="0" y="0" width="${f1(w)}" height="${h}" rx="34" fill="${mine ? '#FF9A55' : '#fff'}" stroke="${INK}" stroke-width="5"/>` + lines.map((s, i) => gfT(32, 60 + i * 54, s, fs, mine ? '#fff' : '#1E2A4A', { anchor: 'start', wt: 800 })).join('') + `</g>`; }
function mlEveChat(t) {
  const e49 = mlL('e49'), t1 = e49.t0 + 0.05, t2 = mlAt('e49', '나도', 0.44), tTr = mlAt('e49', '떨렸', 0.85), sk = gfM ? 0 : 0, j1 = gfShake(t, t1, 5, 0.2), j2 = gfShake(t, t2, 5, 0.2); gfxMarksProject({ x: 960, y: 540, z: 1 });
  let p = `<rect x="630" y="62" width="660" height="1110" fill="#EEF2FA"/><rect x="630" y="150" width="660" height="104" fill="#fff"/><path d="M630 254 H1290" stroke="#DCE2EE" stroke-width="3"/><circle cx="706" cy="202" r="34" fill="#C9D2E3" stroke="${INK}" stroke-width="5"/><circle cx="706" cy="194" r="13" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M684 224 Q706 204 728 224" fill="#fff" stroke="${INK}" stroke-width="4"/>` + gfT(760, 216, '팀장님', 42, '#1E2A4A', { anchor: 'start' });
  p += `<g transform="translate(960 304)">${gfChip('오늘', { size: 26, bg: '#E4E8F1' })}</g>` + mlChatBub(1262, 352, ['발표 자료 보냅니다!'], 1, true) + gfT(1254, 500, '오후 9:41', 24, '#8E9BB8', { anchor: 'end', wt: 700 });
  p += mlChatBub(700, 596, ['3쪽 표 좋네요.'], gfIn(t, t1, 3.6, 0.5), false);
  if (t > t1 + 0.9 && t < t2) p += `<g transform="translate(700 736)"><rect width="150" height="76" rx="34" fill="#fff" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2].map(i => `<circle cx="${42 + i * 34}" cy="${f1(38 - 8 * Math.max(0, Math.sin((t - t1) * 8 - i * 0.9)))}" r="10" fill="#8E9BB8"/>`).join('') + `</g>`;
  p += mlChatBub(700, 736, ['나도 첫 발표 땐', '손이 떨렸어요.'], gfIn(t, t2, 3.6, 0.5), false) + (t > t2 + 0.3 ? gfT(712, 940, '오후 10:00', 24, '#8E9BB8', { anchor: 'start', wt: 700 }) : '');
  // 머리 위의 딱지가 화면 위에서 거꾸로 내려다본다
  const kp = gfIn(t, tTr, 3.2, 0.42), tak = kp > 0 ? `<g transform="translate(960 ${f1(-120 + 190 * Math.min(1, kp))}) rotate(180)">${mlTak(0, 0, 1.5, { t, look: [0, -0.9], ex: 'shock' })}</g>` + gfEmote(t, tTr + 0.1, 1130, 150, 'bang', { hold: 1.4, s: 1.2 }) : '';
  return gfxScreen(gfDefs() + ML_DEFS + ML_DEFS3 + mlPov(t, p, { clock: '10:00', z: 1.02 + 0.03 * gfK(e49.t0, e49.t1 + 0.5, t), dx: j1[0] + j2[0], dy: j1[1] + j2[1] }) + tak + gfxGrade('night', 0.25) + gfxVignette(0.55) + gfChipAt(t, -1, 268, 96, '발표 전날 22:00', { size: 34, icon: 'moon' }));
}
// 회상 한 컷: 팀장 어깨의 "원래 차가운 사람"이 소리 없이 떨어진다(색이 바랜 화면)
function mlEveFlash(t) {
  const { BX, Y, S, TY } = ML_O, e50 = mlL('e50'), t0 = e50.t0 - 0.15, tF = t0 + 0.95, kp = mlS(t, t0 + 0.2, 0.7), u = Math.max(0, t - tF), sx = BX + 66 * S, sy = Y - 262 * S;
  let cam = gfxDrift(gfxCam([[0, { x: BX + 96, y: Y - 330, z: 2.2 }], [t0 + 0.02, { x: BX + 104, y: Y - 300, z: 2.34 }, { d: 1.9, ease: 'lin' }]], t), t, 2, 11);
  const boss = mlB({ x: BX, y: Y, s: S, t, pose: P['ml앉음'], ex: fEx('ml팀장'), look: [0.25, 0.85], headDy: 8, light: -1 });
  const stk = u <= 0 ? mlAtP(sx, sy, 1, mlSt(['원래', '차가운 사람'], 20, { peel: 0.85 * kp }), 7 + 6 * kp) : mlOp(1 - gfK(1.0, 1.5, u), mlAtP(sx + Math.sin(u * 6) * 40 * Math.min(1, u * 2) + 30 * u, sy + 30 * u + 170 * u * u, 1, mlSt(['원래', '차가운 사람'], 20, { peel: 0.7 }), 13 + Math.sin(u * 6 + 1) * 30 + u * 46));
  const set = mlOfficeSet(t), kpL = gfxProj(cam, 340, 300);
  return gfxCompose({ cam, defs: gfDefs() + ML_DEFS + ML_DEFS3 + gfxDefs({ shadow: '#2A3655', lights: [{ id: 'mlLo', amb: '#C4C9DC', key: { x: kpL[0], y: kpL[1], z: 700 * cam.z, col: '#FFF0CC', k: 0.62 }, rim: { dx: -6, dy: -3, col: '#FFF4D0', k: 0.55 }, bump: 5, relief: 7 }] }),
    far: [[0.93, set.wall]], lit: set.back + boss + set.table + stk, light: 'mlLo', grade: gfxGrade('old', 0.6), vig: gfxVignette(0.55, '#FFF8E6'), hud: '' });
}
function mlEveRoom(t) {
  const { ZX, ZY, S } = ML_N, c = mlCur(t), id = c ? c.id : 'e48', e48 = mlL('e48'), e50 = mlL('e50'), late = id === 'e50', tBz = e48.t0 + 1.25, tak0 = [ZX + 30, ZY - 494 * S];
  let cam = late ? gfxCam([[0, { x: ZX + 34, y: ZY - 452, z: 2.15 }], [e50.t0 + 1.62, { x: ZX + 36, y: ZY - 462, z: 2.3 }, { d: 2.2, ease: 'lin' }]], t) :
    gfxCam([[0, { x: 1010, y: 584, z: 1.1 }], [e48.t0 - 0.13, { x: 1010, y: 580, z: 1.17 }, { d: 1.3, ease: 'lin' }], [tBz - 0.05, { x: 800, y: 664, z: 1.8 }, { d: 0.5, ease: 'io' }]], t);
  cam = gfxShake(gfxDrift(cam, t, 3, 12), t, late ? [] : [[tBz, 5, 0.3], [tBz + 0.45, 5, 0.3]]);
  // 제로: 리모컨을 들고 입을 달싹이며 연습 → 폰이 떨리자 돌아봄 / (50번 뒤) 폰을 내려다보며 미소
  const prac = !late && t < tBz, mo = prac && Math.sin(t * 11) > 0.1, wav = prac ? Math.sin(t * 5) * 7 : 0;
  const P0 = late ? P['ml폰'] : P['ml연습'], pose = wav ? Object.assign({}, P0, { hR: [P0.hR[0], P0.hR[1] + wav], armR: P0.armR.map((q, i) => i === 2 ? [q[0], q[1] + wav] : q) }) : P0;
  const zero = mlZ({ x: ZX, y: ZY, s: S, t, pose, ex: fEx(late ? 'z뿌듯' : prac ? (mo ? 'ml연습b' : 'ml연습a') : 'z당황'), look: late ? [0, 0.8] : prac ? [0.1, 0.5] : [-0.85, 0.4], turn: late || prac ? 0 : -0.5, turnK: 34, turnSq: 0.1, headDy: prac ? Math.sin(t * 5) * 2 : 0, light: 1 });
  const hr = gfHand(ZX, ZY, S, pose.hR), remote = late ? '' : mlRemote(hr[0] + 4, hr[1] - 26, -72), py = ZY - 196 * S;
  const laptop = late ? `<g transform="translate(${ZX} ${f1(py)}) rotate(-4)"><rect x="-37" y="-62" width="74" height="124" rx="13" fill="#232A42" stroke="${INK}" stroke-width="7"/><circle cx="-18" cy="-42" r="7" fill="#3A4466" stroke="${INK}" stroke-width="3"/></g>` :
    `<g transform="translate(${ZX - 20} ${ZY - 172})"><path d="M-150 86 L150 86 L164 108 L-164 108 Z" fill="#C9CEDA" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-136" y="-96" width="272" height="184" rx="16" fill="#3A4466" stroke="${INK}" stroke-width="8"/><circle cx="0" cy="-6" r="20" fill="#56628A"/><path d="M-112 -74 H40" stroke="#fff" stroke-width="5" opacity=".18" stroke-linecap="round"/></g>`;
  // 협탁 위의 폰: '징'
  const bz = !late && t > tBz ? Math.sin((t - tBz) * 70) * 4 * Math.max(Math.exp(-(t - tBz) * 5), t > tBz + 0.45 ? Math.exp(-(t - tBz - 0.45) * 5) : 0) : 0;
  const on = !late && t > tBz, phone = late ? '' : `<g transform="translate(${f1(726 + bz)} 730) rotate(${f1(bz * 0.8)})"><rect x="-50" y="-11" width="100" height="22" rx="9" fill="${on ? '#DCEBFF' : '#3A4466'}" stroke="${INK}" stroke-width="6"/></g>` +
    (on ? gfxGlow(726, 716, 170, '#CFEAFF', 0.55) + [-1, 1].map(sd => `<path d="M${726 + sd * 70} 706 l${sd * 12} 10 l${-sd * 12} 10 l${sd * 12} 10" fill="none" stroke="#CFEAFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="${f1((0.5 + 0.5 * Math.sin(t * 40)) * 100) / 100}"/>`).join('') + gfRing(t, tBz, 726, 722, 20, 110, '#CFEAFF', 8, 0.4) + gfRing(t, tBz + 0.45, 726, 722, 20, 110, '#CFEAFF', 8, 0.4) : '');
  const tak = mlTak(tak0[0], tak0[1], 0.62, { t, look: late ? (t > e50.t0 + 2.6 ? [-0.2, 0.9] : [-0.75, 0.25]) : (t > tBz ? [-0.9, 0.5] : [-0.2, 0.7]), ex: 'on', arm: late ? 'up' : 'down', ls: 0.72 });
  const set = mlNightSet(t, 10), lp = late ? [ZX, py - 12] : [ZX - 20, ZY - 250], kp = gfxProj(cam, lp[0], lp[1]), moon = gfxProj(cam, 402, 282, 0.94);
  const actors = set.back + zero + (late ? laptop : '') + set.front + (late ? '' : laptop + remote + `<circle cx="${f1(hr[0])}" cy="${f1(hr[1])}" r="${f1(22 * S)}" fill="#fff" stroke="${INK}" stroke-width="${f1(7 * S)}"/>`) + tak;
  const em = late ? gfEmote(t, e50.t0 + 1.95, tak0[0] + 96, tak0[1] - 96, 'dots', { hold: 1.5, s: 0.62 }) : gfEmote(t, tBz + 0.1, ZX + 150, ZY - 520, 'bang', { hold: 0.8, s: 0.85 });
  return gfxCompose({ cam, defs: gfDefs() + ML_DEFS + ML_DEFS3 + gfxDefs({ shadow: '#070B20', lights: [{ id: 'mlLn', amb: '#3A4576', key: { x: kp[0], y: kp[1], z: 190 * cam.z, col: '#CFEAFF', k: 1.25 }, rim: { dx: -7, dy: -3, col: '#8FB0FF', k: 0.7 }, bump: 5, relief: 9 }] }),
    far: [[0.94, set.wall]], cast: [zero, { dx: -30, dy: -70, s: 1.32, cx: ZX, cy: ZY - 200, op: 0.42, soft: 3 }], lit: actors, light: 'mlLn',
    glow: gfxGlow(lp[0], lp[1] - 10, late ? 260 : 330, '#CFEAFF', 0.4) + phone + em, grade: gfxGrade('night', 0.42) + `<g>${gfxGlow(moon[0], moon[1], 300 * cam.z, '#BFD0FF', 0.3)}</g>`, vig: gfxVignette(0.55),
    hud: gfChipAt(t, late ? -1 : e48.t0 + 0.1, 268, 96, '발표 전날 22:00', { size: 34, icon: 'moon' }) });
}
function mleveScene(t, lt, a) { const c = mlCur(t), id = c ? c.id : 'e48'; if (id === 'e49') return mlEveChat(t); if (id === 'e50' && t < mlL('e50').t0 + 1.6) return mlEveFlash(t); return mlEveRoom(t); }

/* ---------- [발표 날] 어땠는지는 말하지 않는다: 뒷모습 그림자 → 리모컨을 쥔 손 → (말이 끝난 뒤) 맨 앞줄에서 지켜보는 서윤(51번) ----------
   서윤 컷을 말 가운데에 넣었더니 '다만 그날'이 0.65초라 얼굴이 스쳐 지나갔다 → 말이 끝난 뒤의 쉼으로 옮겼다(다음 장면 '석 달 뒤'가 서윤으로 시작한다) */
function mldayScene(t, lt, a) {
  const d = mlL('d51'), tB = mlAt('d51', '다만', 0.52) - 0.15, tC = d.t1 + 0.3, tR = mlAt('d51', '리모', 0.78), chip = gfChipAt(t, d.t0 + 0.1, 214, 96, '발표 날', { size: 36, icon: 'sun' });
  const wrap = (inner, z, cx = 960, cy = 540) => `<g transform="translate(${cx} ${cy}) scale(${f1(z * 1000) / 1000}) translate(${-cx} ${-cy})">${inner}</g>`; gfxMarksProject({ x: 960, y: 540, z: 1 });
  const D = '#0C1026';
  if (t < tB) {      // 발표장 뒤에서: 환한 화면, 그 옆의 제로(그림자뿐), 객석 뒷머리
    let s = `<rect x="-60" y="-60" width="2040" height="1200" fill="#151B40"/>` + gfxGlow(1020, 400, 1100, '#BFD6FF', 0.55, { blend: false });
    s += `<rect x="560" y="130" width="960" height="540" rx="16" fill="#F4F8FF" stroke="${D}" stroke-width="12"/>` + [[700, 470, 110, '#8FD3FF'], [820, 400, 180, '#FFB38A'], [940, 330, 250, '#3DDBB4'], [1060, 430, 150, '#FFD84A']].map(([x, y, h, c]) => `<rect x="${x}" y="${y}" width="84" height="${h}" rx="8" fill="${c}"/>`).join('') + `<path d="M660 592 H1200" stroke="#9AA6B8" stroke-width="7" stroke-linecap="round"/><path d="M1260 250 H1440 M1260 306 H1410 M1260 362 H1440 M1260 418 H1380" stroke="#C3CCD6" stroke-width="13" stroke-linecap="round"/>`;
    s += `<rect x="-60" y="760" width="2040" height="400" fill="#0F1432"/><path d="M-60 760 H1980" stroke="#2A3470" stroke-width="6"/>`;
    // 제로: 화면 옆에 선 그림자(얼굴은 보이지 않는다). 든 손에 리모컨
    s += `<g transform="translate(410 762)"><ellipse cx="0" cy="4" rx="90" ry="12" fill="#000" opacity=".35"/><path d="M-30 0 V-110 M30 0 V-110" stroke="${D}" stroke-width="18" stroke-linecap="round"/><path d="M-66 -100 Q-74 -262 0 -270 Q74 -262 66 -100 Z" fill="${D}"/><circle cy="-372" r="112" fill="${D}"/><path d="M58 -226 Q120 -250 150 -306" fill="none" stroke="${D}" stroke-width="20" stroke-linecap="round"/><rect x="134" y="-346" width="44" height="18" rx="8" fill="${D}" transform="rotate(-58 156 -337)"/><path d="M-60 -220 Q-96 -180 -92 -130" fill="none" stroke="${D}" stroke-width="20" stroke-linecap="round"/></g>`;
    s += `<path d="M1980 -60 L1300 -60 L560 130 L560 670 L1980 300 Z" fill="#BFD6FF" opacity=".07"/>`;
    s += [[-40, 1050, 150], [250, 1076, 140], [560, 1060, 150], [870, 1082, 144], [1190, 1064, 150], [1500, 1078, 140], [1800, 1056, 150]].map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#070A1E"/>` + (i === 3 ? `<path d="M${x - r} ${y - 10} Q${x - r - 6} ${y - r - 30} ${x} ${y - r - 26} Q${x + r + 6} ${y - r - 30} ${x + r} ${y - 10} Z" fill="#070A1E"/>` : '')).join('');
    return gfxScreen(gfDefs() + ML_DEFS + ML_DEFS3 + wrap(s, 1.02 + 0.05 * gfK(d.t0 - 0.2, tB, t), 960, 480) + gfxVignette(0.6, '#050818') + chip); }
  if (t >= tC) {      // 맨 앞줄의 서윤: 눈을 크게 뜨고 본다
    const bg = `<rect x="-60" y="-60" width="2040" height="1200" fill="#141A3C"/>` + gfxGlow(200, 200, 900, '#BFD6FF', 0.45, { blend: false }) + [[330, 960, 190], [1640, 990, 200], [1350, 700, 120], [640, 660, 110]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#0A0E28"/><path d="M${x - r * 0.9} ${y + r * 2.4} Q${x - r} ${y + r * 0.8} ${x} ${y + r * 0.8} Q${x + r} ${y + r * 0.8} ${x + r * 0.9} ${y + r * 2.4} Z" fill="#0A0E28"/>`).join('');
    const sy = mlSY({ x: 1040, y: 1380, s: 2.3, t, pose: P['서기'], ex: fEx('z반짝'), look: [-0.7, -0.45], turn: -0.75, turnK: 40, turnSq: 0.13, headDy: -4 * mlS(t, tC + 0.1, 0.4), light: -1 });
    return gfxScreen(gfDefs() + ML_DEFS + ML_DEFS3 + gfxDefs({ shadow: '#070B20', lights: [{ id: 'mlLd', amb: '#5A64A0', key: { x: 240, y: 180, z: 620, col: '#DCE9FF', k: 1.0 }, rim: { dx: -8, dy: -4, col: '#BFD6FF', k: 0.9 }, bump: 5, relief: 9 }] }) + wrap(`<g filter="url(#gfxB7)">${bg}</g>` + gfxLit('mlLd', sy), 1.0 + 0.05 * gfK(tC, tC + 2.2, t), 1000, 520) + gfxVignette(0.55, '#050818') + chip); }
  // 리모컨을 쥔 손. 떨림 선 하나, 그래도 쥐고 있다. 손가락이 단추를 누르지 않는다
  const u = t - tB, jx = Math.sin(t * 37) * 2.2, jy = Math.cos(t * 31) * 1.6, HX = 1010, HY = 560, sq = gfBeat(t, tR, 0.03, 4, 8);
  let s = `<rect x="-60" y="-60" width="2040" height="1200" fill="#141A3C"/>` + gfxGlow(260, 330, 1200, '#BFD6FF', 0.6, { blend: false }) + `<g filter="url(#gfxB12)"><rect x="-200" y="80" width="760" height="520" rx="20" fill="#DCE9FF"/><rect x="60" y="330" width="90" height="200" fill="#8FD3FF"/><rect x="200" y="250" width="90" height="280" fill="#3DDBB4"/><rect x="340" y="370" width="90" height="160" fill="#FFD84A"/></g>`;
  s += `<g transform="translate(${f1(HX + jx)} ${f1(HY + jy)}) scale(${f1(sq * 1000) / 1000})"><path d="M360 660 Q250 420 90 120" fill="none" stroke="${INK}" stroke-width="196" stroke-linecap="round"/><path d="M360 660 Q250 420 90 120" fill="none" stroke="#3D4F7A" stroke-width="176" stroke-linecap="round"/><path d="M150 232 L32 300" stroke="#fff" stroke-width="40" stroke-linecap="round"/><path d="M150 232 L32 300" stroke="${INK}" stroke-width="10" stroke-linecap="round" opacity=".0"/>` +
    `<g transform="rotate(-24) scale(4.4)">${mlRemote(-6, -4, 0)}</g><circle r="176" cx="40" cy="40" fill="#fff" stroke="${INK}" stroke-width="16"/><path d="M-70 -50 Q-120 20 -78 104" fill="none" stroke="#C9D6E2" stroke-width="14" stroke-linecap="round"/>` +
    `<g transform="rotate(-24)"><g transform="scale(4.4)"><g transform="translate(-6 -4)"><rect x="-46" y="-15" width="50" height="30" rx="13" fill="#2B3148" stroke="${INK}" stroke-width="6"/><circle cx="-22" cy="0" r="7" fill="#FF5A5A" stroke="${INK}" stroke-width="3"/><path d="M-38 -9 H0" stroke="#fff" stroke-width="3" opacity=".25" stroke-linecap="round"/></g></g></g>` +
    `<rect x="-60" y="-116" width="150" height="74" rx="37" fill="#fff" stroke="${INK}" stroke-width="14" transform="rotate(-24)"/></g>`;
  s += mlShakeLines(HX + 250, HY + 30, t, 1, 2, 1) + gfTwinkle(t, HX - 250, HY - 120, 16, 2, '#fff') + (t > tR ? gfStarBurst(t, tR, HX - 120, HY - 60, { n: 6, r0: 60, r1: 240, size: 18 }) : '');
  return gfxScreen(gfDefs() + ML_DEFS + ML_DEFS3 + gfxDefs({}) + wrap(s, 1.0 + 0.06 * gfK(tB, d.t1 + 1, t), 960, 540) + gfxGlow(420, 400, 700, '#CFE2FF', 0.25) + gfxVignette(0.55, '#050818') + chip);
}

/* ---------- [엔딩] 석 달 뒤: 같은 회의실, 자리가 바뀌었다(52~54번) ---------- */
function mlendScene(t, lt, a) {
  const { BX, ZX, Y, S, TY } = ML_O, c = mlCur(t), id = c ? c.id : 'f52', f52 = mlL('f52'), f53 = mlL('f53'), f54 = mlL('f54');
  // 리모컨: 제로가 내민 것(서윤 앞) → 서윤이 되민다(52번 끝) → 제로가 다시 건넨다(54번)
  const tPu = mlAt('f52', '아니라', 0.76) + 0.2, tGv = f54.t0 + 0.25, xA = BX + 206, xB = ZX - 200, k1 = easeOut(gfK(tPu, tPu + 0.85, t)), k2 = easeOut(gfK(tGv, tGv + 0.9, t)), rx = lerp(lerp(xB, xA, k1), xB, k2);
  const remote = mlRemote(rx, TY - 2, Math.sin(k1 * 8) * 5 * (1 - k1) + Math.sin(k2 * 9) * 4 * (1 - k2));
  // 딱지: "원래…" 반쯤 뽑다가 도로 넣고 → 고개를 흔들고 → 노란 "아직"을 뽑아 서윤 어깨에 톡
  const tak0 = [BX + 28 * S, Y - 494 * S], mouth = [tak0[0], tak0[1] - 36], tNo = mlAt('f53', '아니', 0.22), tAj = mlAt('f53', '아직', 0.61), tHit = f53.t1 + 0.42, shoulder = [ZX - 68 * S, Y - 262 * S];
  const out1 = t < f53.t0 - 0.1 ? 0 : t < tNo ? 0.55 * gfK(f53.t0 - 0.1, tNo - 0.05, t) : 0.55 * (1 - easeIn(gfK(tNo, tNo + 0.14, t))), shakeH = t > tNo && t < tNo + 0.5 ? Math.sin((t - tNo) * 30) * 11 * (1 - gfK(tNo, tNo + 0.5, t)) : 0;
  const ev = { t0: tHit, from: mouth, to: shoulder, text: '아직', fs: 34, rot: 5, arc: 250, fly: 0.36, tp: tAj - 0.22, te: tAj + 0.34, s: 1, so: { bg: '#FFE27A', band: '#22B893' } }, st = t > tAj - 0.25 ? mlStickers(t, [ev]) : { svg: '', fx: '', tak: { out: 0, arm: 'down' } };
  const mood = gfxMood(t, [[tPu, -0.3, 1.2], [tHit, 0.85, 1.3]]);      // 서윤이 물러설 때 옅은 그늘 → '아직'이 붙으면 햇살
  /* --- 샷: 52번은 자동(두 사람 → 서윤), 53번 딱지 → 스티커를 따라 서윤 어깨, 54번 탁자 위 리모컨 → 두 사람 --- */
  const CAST = { Z: { x: BX, y: Y - 390 * S, to: 'S', seed: 2 }, S: { x: ZX, y: Y - 390 * S, to: 'Z', seed: 9 } };
  if (!window._mlPlanE) window._mlPlanE = gfxShots([f52, f53, f54], CAST, { wide: { x: 965, y: 566, z: 1.12, r: 0, f: 1, p: 0 }, react: false, over: {
    f53: [[-0.15, { x: tak0[0] + 6, y: tak0[1] - 40, z: 2.5, r: 0, f: 1, p: 0 }, { ease: 'cut' }], [-0.13, { z: 2.64 }, { d: tHit - 0.5 - f53.t0, ease: 'lin' }], [tHit - 0.34 - f53.t0, { x: ZX - 30, y: Y - 318, z: 1.85 }, { d: 0.36, ease: 'io' }], [tHit + 0.05 - f53.t0, { z: 1.95 }, { d: 1.2, ease: 'lin' }]],
    f54: [[-0.15, { x: 1010, y: 644, z: 1.46, r: 0, f: 1, p: 0 }, { ease: 'cut' }], [tGv - f54.t0, { x: 1082, y: 640, z: 1.5 }, { d: 0.9, ease: 'io' }], [tGv + 1.05 - f54.t0, { x: 965, y: 566, z: 1.14 }, { d: 0.85, ease: 'io' }], [tGv + 1.9 - f54.t0, { z: 1.2 }, { d: 3, ease: 'lin' }]] } });
  const plan = window._mlPlanE, sh = gfxShotAt(plan, t), hide = sh.type === 'manual' ? [] : sh.hide, whip = t > tHit - 0.32 && t < tHit - 0.04;
  let cam = gfxShake(gfxDrift(gfxCam(plan.keys, t), t, 3, 13), t, [[tHit, 10, 0.28]]);
  const D = gfxDirect(t, CAST, { focus: [[tPu - 0.1, tPu + 0.9, rx, TY - 40], [tHit - 0.3, tHit + 1.0, shoulder[0], shoulder[1], ['Z']], [tGv - 0.15, tGv + 1.0, rx, TY - 40]], think: false });
  /* --- 제로(팀장이 앉던 자리) --- */
  const zPose = actPose([[0, 'ml앉음'], [tGv - 0.25, 'ml내밂R', { f: 3.2, z: 0.7 }], [tGv + 0.85, 'ml앉음', { f: 2.4, z: 0.8 }]], t), zBase = t < tPu ? 'z기본' : t < tHit ? 'ml쓴웃음' : 'z뿌듯';
  const zA = gfxAct(D.Z), zero = mlZ(Object.assign({ x: BX, y: Y, s: S, t, pose: zPose }, zA, { ex: gfxEx(fEx(zBase), D.Z), headDy: zA.headDy + actNod(t, tGv + 1.5, 1, 11, 0.42), light: -1 }), true);
  /* --- 서윤(제로가 앉던 자리) --- */
  const sta = gfxTalkAct(t, 'S', 9), sPose = actPose([[0, 'ml앉음'], [mlAt('f52', '원래', 0.3), 'ml손사래', { f: 3.4, z: 0.6 }], [tPu - 0.22, 'ml내밂L', { f: 3.2, z: 0.7 }], [tPu + 0.8, 'ml앉음', { f: 2.4, z: 0.8 }], [tGv + 0.8, 'ml내밂L', { f: 2.6, z: 0.75 }]], t);
  const sBase = t < tPu + 0.5 ? 'z당황' : t < tHit ? 'z민망' : t < tGv + 1.0 ? 'z기본' : 'z설렘', js = actHit(t, tHit, 0.06, 5, 8);
  const seo = mlSY(Object.assign({ x: ZX, y: Y, s: S, t, pose: sPose }, gfxAct(D.S), { ex: gfxEx(gfxFace('mlsf', sBase, t, 'S'), D.S), sx: js.sx, sy: js.sy * sta.sy, light: -1 }));
  const tv = gfxVoice(t, 'T'), hop = gfHop(t, tHit - 0.45, 20, 0.28);
  const tak = mlTak(tak0[0] + shakeH, tak0[1] + (D.Z.headDy || 0), 0.6, Object.assign({ t, look: t < f53.t0 - 0.2 ? [0.9, 0.3] : t > tHit - 0.3 ? [0.9, 0.2] : [0.5, 0.1], talk: tv ? tv.e : 0, ex: t > tHit + 0.2 ? 'proud' : 'on', ls: 0.72 },
    out1 > 0.01 && t < tAj - 0.25 ? { out: out1, label: mlSt('원래…', 30), outLen: 72 } : st.tak, hop));
  const sh2 = gfHand(ZX, Y, S, sPose.hL), lines = t > tGv + 0.95 ? mlShakeLines(sh2[0] - 20, sh2[1], t, 0.9, 1, -1) : '';
  const vis = k => !hide.includes(k); if (!vis('Z')) gfxUnmark('제로'); if (!vis('S')) gfxUnmark('서윤');
  const set = mlOfficeSet(t), actors = set.back + (vis('Z') ? zero : '') + (vis('S') ? seo : '') + set.table + remote + set.plant + (vis('Z') ? tak : '') + (vis('S') ? st.svg + lines : ''), kp = gfxProj(cam, 340, 300);
  const em = gfEmote(t, tPu + 0.9, BX + 150, Y - 520 * S, 'dots', { hold: 0.7, s: 0.8 }) + gfEmote(t, tHit + 0.35, ZX + 150, Y - 520 * S, 'bang', { hold: 0.9, s: 0.85 }) + gfEmote(t, tGv + 1.6, ZX + 150, Y - 520 * S, 'spark', { hold: 1.2, s: 0.9 });
  return gfxCompose({ cam, defs: gfDefs() + ML_DEFS + ML_DEFS3 + gfxDefs({ shadow: '#2A3655', lights: [{ id: 'mlLo', amb: '#C4C9DC', key: { x: kp[0], y: kp[1], z: 700 * cam.z, col: '#FFF0CC', k: 0.64 * mood.light }, rim: { dx: -6, dy: -3, col: '#FFF4D0', k: 0.55 }, bump: 5, relief: 7 }] }),
    far: [[0.93, set.wall]], cast: [(vis('Z') ? zero : '') + (vis('S') ? seo : ''), { dx: 44, dy: 6, s: 1.03, cx: 960, cy: 700, op: 0.2, soft: 2 }], lit: actors, light: 'mlLo',
    ots: sh.ots ? gfxOTS(sh.ots.side, Object.assign({ t, cam }, sh.ots.who === 'Z' ? { cloth: '#3D4F7A' } : { cloth: '#B9A6F0', hair: '#5A3A2E' })) : '',
    glow: gfxShafts(t, { x: 330, y: 150, ang: -52, n: 4, gap: 86, w: 60, len: 1500, op: 0.2 * mood.shafts, col: '#FFF3CC', spread: 1.5 }) + gfxDust(t, { box: [420, 180, 1000, 560], n: 26, seed: 5, op: 0.55 }) + em + (vis('S') ? st.fx : ''),
    fg: set.fg, fgDepth: 1.4, fgFd: 1.9, grade: gfxGrade('warm', 0.3), mood: mood.over, vig: gfxVignette(0.3, '#1A2440'), whip, hud: gfChipAt(t, f52.t0 + 0.1, 220, 96, '석 달 뒤', { size: 36, icon: 'clock' }) });
}

/* ---------- 55번: 수레는 오늘도 굴러간다(한 편을 꿰는 표시의 마지막. 카드 위의 그림이라 스스로 굴러간다) ---------- */
function mlrollScene(t, lt, a) {
  const f = mlL('f55'), tGo = mlAt('f55', '굴러', 0.28), tNew = mlAt('f55', '다른', 0.75), x = 420 + 1100 * easeInOut(gfK(tGo, f.t1 + 1.3, t)), rot = (x - 420) / 96 * 57.3, bob = Math.sin(x * 0.06) * 3, k0 = gfIn(t, f.t0 - 0.1, 3, 0.5); gfxMarksProject({ x: 960, y: 540, z: 1 });
  let s = `<rect x="-60" y="-60" width="2040" height="1200" fill="#FFF6D8"/><rect x="-60" y="-60" width="2040" height="1200" fill="url(#gfDots)" opacity=".5"/><path d="M120 742 H1800" stroke="#E3D4A6" stroke-width="12" stroke-linecap="round"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M${f1(((i * 330 - x * 0.9) % 1680 + 1680) % 1680 + 120)} 770 h70" stroke="#E3D4A6" stroke-width="9" stroke-linecap="round"/>`).join('');
  // 부품 칸 다섯: '버릇' 칸이 노란색(어제와 조금 다른 부품)
  const parts = [['몸', 'hand'], ['기분', 'heart'], ['기억', 'book'], ['버릇', 'clock'], ['생각', 'bulb']], kn = mlS(t, tNew, 0.3);
  parts.forEach(([tx, ic], i) => { const kk = gfIn(t, f.t0 + 0.15 + i * 0.08, 3.2, 0.42), px = x - 330 + i * 165, py = 262 + Math.sin(t * 2.4 + i) * 6 + (i === 3 ? -14 * kn : 0);
    s += `<path d="M${f1(px)} ${f1(py + 40)} L${f1(x + (i - 2) * 30)} 440" stroke="#C9B988" stroke-width="5" stroke-dasharray="5 11" stroke-linecap="round"/><g transform="translate(${f1(px)} ${f1(py)}) scale(${f1(kk * (i === 3 ? gfBeat(t, tNew, 0.22, 5, 8) : 1) * 1000) / 1000})">${gfChip(tx, { size: 36, icon: ic, bg: i === 3 ? gfMix('#ffffff', '#FFE27A', kn) : '#fff' })}</g>`; });
  s += gfStarBurst(t, tNew, x + 165, 262, { n: 8, r0: 50, r1: 200 });
  s += `<g transform="translate(${f1(x)} ${f1(742 + bob)}) scale(${f1(0.86 * Math.min(1.04, k0) * 1000) / 1000})"><ellipse cx="0" cy="4" rx="260" ry="16" fill="#C9B988" opacity=".5"/>${mlWheel(44, -126, 108, rot, true)}${mlBody()}${mlPole()}${mlWheel(-10, -118, 118, rot, false)}</g>`;
  s += mlTak(x - 20, 742 + bob - 262, 0.9, Object.assign({ t, look: [0.8, -0.1], ex: 'proud', arm: 'up' }, gfHop(t, tGo, 18, 0.3)));
  for (let i = 0; i < 6; i++) { const t0 = tGo + 0.25 + i * 0.5; s += gfPuff(t, t0, 420 + 1100 * easeInOut(gfK(tGo, f.t1 + 1.3, t0)) - 230, 736, 0.8, '#EADBAE'); }
  return gfxScreen(gfDefs() + ML_DEFS + ML_DEFS3 + s + gfxVignette(0.25, '#B89A5A'));
}
/* ---------- 56~57번: 빈칸 카드. 딱지가 뽑은 큰 스티커 두 장 ---------- */
function mlcardScene(t, lt, a) {
  const f56 = mlL('f56'), f57 = mlL('f57'), tA = f56.t0 + 0.3, tPe = tA + 1.05, tB = tA + 1.7, s1 = gfxSlap(t, tA, { fly: 0.2, s0: 2.5, r0: -16 }), s2 = gfxSlap(t, tB, { fly: 0.2, s0: 2.5, r0: 14 }), sk = gfM ? [gfShake(t, tA, 11, 0.3), gfShake(t, tB, 13, 0.32)] : [[0, 0], [0, 0]]; gfxMarksProject({ x: 960, y: 540, z: 1 });
  const dx = sk[0][0] + sk[1][0], dy = sk[0][1] + sk[1][1], kd = mlS(t, tB, 0.3), fs = 88, T2 = '나는 요즘 ＿＿＿ 중';
  let s = `<rect x="-60" y="-60" width="2040" height="1200" fill="#FFF6D8"/><rect x="-60" y="-60" width="2040" height="1200" fill="url(#gfDots)" opacity=".5"/><g transform="translate(${f1(dx)} ${f1(dy)})">`;
  if (s1.op > 0) s += `<g opacity="${f1(s1.op * (1 - 0.3 * kd) * 100) / 100}">${mlAtP(900, 300 - 24 * kd, 0.92 * s1.s * (1 - 0.08 * kd), gfxSticker('나는 원래 ＿＿＿', { fs, band: '#FF5A5A', peel: 0.7 * mlS(t, tPe, 0.4) }), -4 + s1.rot)}</g>`;
  if (s2.op > 0) { const cx = (gfTextW('나는 요즘 ', fs) + gfTextW('＿＿＿', fs) / 2 - gfTextW(T2, fs) / 2) + fs * 0.25, cur = t > tB + 0.5 && Math.floor(t * 2.2) % 2 === 0 ? `<rect x="${f1(cx - 5)}" y="${f1(-fs * 0.62)}" width="10" height="${f1(fs * 0.9)}" rx="4" fill="#22B893"/>` : '';
    s += `<g opacity="${s2.op}"><g transform="translate(1000 560) rotate(${f1(3 + s2.rot)}) scale(${f1(s2.s * 1000) / 1000})">${gfxSticker(T2, { fs, bg: '#FFE27A', band: '#22B893' })}${cur}</g></g>`; }
  s += gfxImpact(t, tA, 900, 300, { col: '#FF9A55', r: 380, n: 14, flash: false }) + gfxImpact(t, tB, 1000, 560, { col: '#3DDBB4', r: 420, n: 16, flash: false }) + gfStarBurst(t, tB, 1000, 560, { n: 9, r0: 200, r1: 620, size: 28 }) + `</g>`;
  s += mlTak(1640, 900, 1.25, Object.assign({ t, look: [-0.8, -0.5], ex: t > tB + 0.15 ? 'proud' : 'on', arm: t < tA || (t > tPe && t < tB) ? 'throw' : 'up' }, gfHop(t, tB + 0.2, 34, 0.34)));
  return gfxScreen(gfDefs() + ML_DEFS + ML_DEFS3 + s);
}
