/* 자소서 편 v4 — 회의 장면 전체(m0~m7)와 훅(h1~h2). 연기는 vmState(t, T) 하나로 정하고 컷은 카메라만 바꾼다. 새 이름은 vm 접두사.
   ../meet/mtscenes.js의 MT·mtSlide·mtHand·mtOTS를 쓴다(mtmeetScene은 여기서 덮어쓴다). */
CAMS['v4hook'] = 'fixed';
const VM_Z = (() => { const S = P['서기'], up = { armR: [[252, 285], [300, 296], [334, 262]], hR: [342, 254] }, scr = { armR: [[252, 285], [306, 280], [348, 232]], hR: [356, 222] }, mid = { armR: [[252, 285], [296, 318], [318, 296]], hR: [324, 290] }, low = { armR: [[252, 285], [284, 340], [296, 372]], hR: [300, 380] };
  const fist = { armL: [[148, 285], [124, 336], [122, 376]], hL: [122, 384] }, ex1 = { armL: [[148, 285], [100, 296], [82, 238]], hL: [78, 228] }, shL = { armL: [[148, 285], [96, 300], [62, 258]], hL: [54, 250] }, shR = { armR: [[252, 285], [304, 300], [338, 258]], hR: [346, 250] };
  return { up: v4Pose(S, up), scr: v4Pose(S, scr), mid: v4Pose(S, mid), tense: v4Pose(S, Object.assign({}, low, fist)), ex1: v4Pose(S, Object.assign({}, mid, ex1)), shrug: v4Pose(S, Object.assign({}, shL, shR)), ask: v4Pose(S, Object.assign({}, low, ex1)), drop: S }; })();
const VM_C = (() => { const S = V4SIT(), L = (a, h) => v4Pose(S, { armL: a, hL: h });
  return { sit: S, up: L([[148, 285], [114, 252], [102, 198]], [100, 188]), point: L([[148, 285], [102, 262], [60, 224]], [52, 216]), mid: L([[148, 285], [118, 302], [110, 262]], [108, 252]), bl: L([[148, 285], [110, 300], [88, 264]], [82, 256]), br: L([[148, 285], [128, 306], [138, 262]], [140, 252]), fore: v4Pose(S, { armR: [[252, 285], [292, 246], [256, 158]], hR: [246, 148] }), reach: L([[148, 285], [104, 300], [70, 290]], [62, 288]) }; })();
function vmState(t, T, o = {}) { // 이 순간의 연기 전체. o.cLine: 담당자의 입을 움직일 줄(훅에서 h1)
  const F = 'm0', tm = id => v4T(id, F), W = (id, key, fb) => v4W(id, F, key, fb);
  const t1 = tm('m1'), t30 = W('m1', '30', 2.0), a = tm('m2'), b = tm('m3'), d = tm('m4'), s5 = tm('m5'), g = tm('m6'), h = tm('m7');
  const tIt = W('m2', '30', 1.6), tKi = W('m2', '기준', 2.5), tMw = W('m2', '뭐죠', 3.9), tJn = W('m2', '전년', 5.1), tJb = W('m2', '전분기', 6.2), tGe = b + 0.15, tJc = W('m3', '전체', 0.45), tGr = W('m3', '그러니까', 2.15), tJh = W('m3', '종합', 2.85), tBw = W('m3', '봤을', 4.15), tTh = tMw + 0.75, tTh2 = tJh + 0.75, tTape = s5 + 0.75;
  const K = { t1, t30, a, b, d, s5, g, h, tIt, tKi, tMw, tJn, tJb, tGe, tJc, tGr, tJh, tBw, tTh, tTh2, tTape }, e = env(t);
  // --- 제로
  const press = actTrack([[0, 0], [tTh, 0.34, { f: 2.6, z: 0.35, ant: 0 }], [tGe + 0.4, 0.5, { f: 0.8, z: 1, ant: 0 }], [tTh2, 0.85, { f: 2.6, z: 0.35, ant: 0 }]], T);
  const ss = actTrack([[0, 0.36], [tTh, 0.56, { f: 3, z: 0.4, ant: 0 }], [tGe + 0.4, 0.7, { f: 0.8, z: 1, ant: 0 }], [tTh2, 0.92, { f: 3, z: 0.4, ant: 0 }]], T);
  const sk = clamp(actTrack([[0, 0], [tTape, 1, { f: 2.6, z: 0.75, ant: 0.14, amt: 0.05 }]], T), 0, 1);
  const zg = actGaze([[0, 0.8, -0.1], [t1 + 0.1, 0.45, -0.55], [t30 - 0.25, 0.85, -0.1], [a + 0.12, 0.92, 0], [tKi + 0.3, 0.5, -0.65], [tMw + 0.1, 0.92, 0], [tJb + 0.1, 0.35, -0.55], [tJb + 0.5, 0.95, 0.1], [tJb + 0.9, 0.5, 0.6], [tGe, 0.9, 0.05], [tJc + 0.35, 0.35, -0.45], [tGr + 0.05, 1.0, 0.0], [tJh + 0.15, 0.45, 0.65], [tBw + 0.3, 0.15, 0.85], [d + 0.35, 0.92, 0.05], [g + 0.5, 1.0, -0.05], [h + 0.3, 0.4, 0.75]], T);
  const zp = actPose([[0, VM_Z.up], [t1 + 0.05, VM_Z.scr, { ant: 0.12 }], [t30 - 0.3, VM_Z.up, { ant: 0.08 }], [a + 0.18, VM_Z.mid, { ant: 0.06, f: 5, z: 0.45 }], [tTh, VM_Z.tense, { ant: 0, f: 4, z: 0.4 }], [tGe - 0.05, VM_Z.ex1, { ant: 0.14 }], [tJc + 0.25, VM_Z.shrug, { ant: 0.12, z: 0.45 }], [tGr - 0.05, VM_Z.ask, { ant: 0.1 }], [tJh + 0.2, VM_Z.drop, { ant: 0, f: 2.2, z: 0.6 }], [s5 + 0.2, VM_Z.ask, { ant: 0.1, f: 3 }], [tTape + 0.35, VM_Z.drop, { ant: 0, f: 2.2, z: 0.6 }]], T);
  const zh = actMul(actHit(T, 1.2, 0.02, 7, 10), actHit(T, a + 0.14, 0.05, 6, 9), actHit(T, tMw + 0.3, 0.035, 5, 8), actHit(T, tTh, 0.1, 4.5, 5), actHit(T, tTh2, 0.09, 4.5, 5), actHit(T, tTape + 0.5, 0.05, 6, 8));
  const zsw = T > tGe && T < tJh ? Math.sin((T - tGe) * 4.2) * 7 : 0, zsy = zh.sy * (1 - 0.12 * press) * actInhale(T, tGe, 0.3) * actInhale(T, s5 + 0.55, 0.35, 0.04);
  const zTalk = v4On('m1', t) || v4On('m3', t), tk = zTalk ? actTalk(e) : { headDy: 0, hand: 0 }; if (v4On('m3', t)) { zp.hL = [zp.hL[0], zp.hL[1] + tk.hand]; zp.armL[2] = [zp.armL[2][0], zp.armL[2][1] + tk.hand]; }
  const gasp = clamp((T - (s5 + 0.3)) / 0.3, 0, 1) * (1 - sk); E['_vmg'] = Object.assign({}, E['z당황'], { mouth: ell(200, 238, 10 + 4 * gasp, 3 + 13 * gasp), mouthFill: '#5A1E2A' });
  const zex = sk > 0.6 ? fEx('z충격') : gasp > 0 ? fEx('_vmg') : v4On('m3', t) ? v4Say('_vmz', 'z당황', 'm3', t) : v4On('m1', t) ? v4Say('_vmz', 'z히죽', 'm1', t) : exprAt([[0, 'z히죽'], [a + 0.16, 'v4긴장'], [tTh, 'z당황']], T);
  const openL = (T >= tGe - 0.1 && T < tJh + 0.25) || (T > s5 + 0.2 && T < tTape + 0.35), back = easeInOut(rsK(h + 0.1, h + 1.0, T));
  const z = { x: MT.ZX + 7 * press + zsw - 46 * back, y: MT.GY, s: 1, sy: zsy, sx: zh.sx * (1 + 0.04 * press), t, pose: zp, ex: zex, look: zg.look, turn: zg.turn, tilt: zg.tilt + 6 * press + zsw * 0.35, headDy: tk.headDy + actTrack([[0, 0], [tJh + 0.15, 13, { f: 1.6, z: 0.8, ant: 0 }], [d + 0.35, 4, { f: 2, z: 0.8, ant: 0 }]], T),
    handR: 'grip', holdR: V4_CLK, handL: T > tTh - 0.05 && T < tGe - 0.1 ? 'fist' : openL ? 'open' : null, handRotL: openL ? -100 : null, light: -1, seed: 3, still: sk >= 1, noBlink: gasp > 0 && sk < 1 };
  // --- 고객사 담당자
  const cg = actGaze([[0, -0.75, -0.5], [a - 0.12, -0.92, -0.05], [tIt - 0.12, -0.6, -0.55], [tKi + 0.12, -0.92, -0.05], [g + 0.35, 0.85, 0]], T);
  const cp = actPose([[0, VM_C.sit], [a - 0.02, VM_C.up, { ant: 0.16, amt: 0.16 }], [tIt - 0.18, VM_C.point, { ant: 0.1 }], [tKi + 0.3, VM_C.mid, { ant: 0.08 }], [tJn - 0.05, VM_C.bl, { ant: 0.06, f: 4.5 }], [tJb - 0.05, VM_C.br, { ant: 0.06, f: 4.5 }], [b - 0.25, VM_C.mid, { ant: 0.05, f: 2.4, z: 0.7 }], [d + 0.15, VM_C.sit, { ant: 0.1, f: 2.6, z: 0.7 }]], T);
  const cLine = o.cLine || (v4On('m2', t) ? rsL('m2') : v4On('m4', t) ? rsL('m4') : null), cTalk = !!cLine && t >= cLine.t0 - 0.05 && t < cLine.t1 + 0.12, ck = cTalk ? actTalk(e) : { headDy: 0, hand: 0 };
  const pointing = T >= tIt - 0.2 && T < tKi + 0.3, tap = T > b && T < d - 0.2 ? Math.max(0, Math.sin(T * 9)) * 4 : 0; if (tap) { cp.hL = [cp.hL[0], cp.hL[1] + tap]; cp.armL[2] = [cp.armL[2][0], cp.armL[2][1] + tap]; }
  const c = { x: 1170 + actTrack([[0, 0], [a, -16, { f: 2.4, z: 0.6, ant: 0.15 }], [d + 0.2, -8, { f: 2, z: 0.8 }]], T), y: rsSitY(MT.TY), s: 1, t, pose: cp, ex: actSay('_vmc', T < tMw + 0.4 ? 'z기본' : 'rs평온', cTalk ? cLine : null, t, e), look: cg.look, turn: cg.turn, tilt: cg.tilt + actTrack([[0, 0], [tKi + 0.15, -5, { f: 3, z: 0.5 }], [tJn - 0.1, 0, { f: 3, z: 0.6 }], [d + 0.6, -4, { f: 2.4, z: 0.6 }]], T), headDy: ck.headDy + actNod(T, tJn, 1, 8, 0.34) + actNod(T, tJb, 1, 8, 0.34) + actNod(T, t30 + 0.5, 1, 6, 0.36),
    handL: T < a - 0.05 ? null : pointing ? 'point' : T < b - 0.25 ? 'open' : T < d + 0.15 ? 'grip' : null, handRotL: pointing ? null : T >= a - 0.05 && T < b - 0.25 ? -95 : null, holdL: T >= b - 0.25 && T < d + 0.15 ? V4_PEN : null, light: -1, seed: 51 };
  // --- 동료
  const xg = actGaze([[0, -0.75, -0.5], [a + 0.28, -0.85, 0], [tIt + 0.2, -0.75, -0.5], [tMw + 0.3, -0.92, -0.05], [tGr + 0.5, 0.85, 0], [tJh + 0.7, -0.92, -0.05], [g + 0.2, 0.85, -0.1]], T);
  const x = { x: 1440, y: rsSitY(MT.TY), s: 1, t, pose: VM_C.sit, ex: exprAt([[0, 'rs평온'], [tGr + 0.5, 'z민망']], T), look: xg.look, turn: xg.turn, tilt: xg.tilt, headDy: actNod(T, t30 + 0.7, 1, 5, 0.36), light: -1, seed: 52 };
  // --- 팀장
  const bg = actGaze([[0, -0.75, -0.5], [a + 0.4, -0.85, 0], [tMw + 0.45, -0.95, -0.05], [tGr + 0.3, 0.15, 0.85], [d + 0.4, -0.9, 0], [s5 + 2.6, -0.2, 0.8], [g + 0.1, -0.85, -0.05]], T, { f: 3.2 });
  const stand = clamp(actTrack([[0, 0], [g + 0.25, 1, { f: 2.4, z: 0.6, ant: 0.16, amt: 0.12 }]], T), -0.2, 1.2), fold = clamp(actTrack([[0, 0], [s5 + 2.7, 1, { f: 2.2, z: 0.8, ant: 0.1 }]], T), 0, 1);
  const bp = actPose([[0, VM_C.sit], [tGr + 0.4, VM_C.fore, { ant: 0.1, f: 3.2, z: 0.6 }], [d + 0.3, VM_C.sit, { ant: 0.05, f: 2.2, z: 0.8 }], [g + 1.5, VM_C.reach, { ant: 0.14 }]], T), fore = T > tGr + 0.5 && T < d + 0.4;
  const bex = v4On('m6', t) ? v4Say('_vmb', 'rs담담', 'm6', t) : fore && T > tGr + 0.75 ? fEx('v4눈감음') : T > s5 + 2.9 && T < g ? fEx('v4눈감음') : exprAt([[0, 'z기본'], [a + 0.4, 'rs평온'], [tJc + 0.2, 'z민망'], [g, 'rs담담']], T);
  const bo = { x: 1710, y: lerp(rsSitY(MT.TY), MT.GY - 22, stand), s: 1, t, pose: bp, ex: bex, look: bg.look, turn: bg.turn, tilt: bg.tilt, headDy: actNod(T, t30 + 0.35, 1, 7, 0.36) + actNod(T, tMw + 0.9, 1, 7, 0.36) + actTrack([[0, 0], [tGr + 0.45, 10, { f: 2.4, z: 0.7 }], [d + 0.3, 2, { f: 2, z: 0.8 }], [s5 + 2.7, 9, { f: 2, z: 0.8 }], [g, 0, { f: 3, z: 0.6 }]], T) + (v4On('m6', t) ? actTalk(e).headDy : 0), armFront: fore ? 'R' : null, handL: T > g + 1.5 ? 'open' : null, handRotL: T > g + 1.5 ? 180 : null, crossArms: T < a + 0.3, light: -1, seed: 21 };
  return { K, z, c, x, bo, press, ss, sk, fold, pop: T < t30 - 0.03 ? 0 : (T - t30 + 0.03) / 0.3, led: (T > 1.2 && T < 1.42) || (T > t30 - 0.06 && T < t30 + 0.2) };
}
function vmRoom(t, T, S, o = {}) { // 방 전체(세계 좌표)
  const GY = MT.GY, TY = MT.TY, K = S.K, z = S.z; let w = mtSlide(430, 150, 620, 380, S.pop);
  w += qShadow(z.x, GY, 92 + 10 * S.press, 0.5) + RSZW(z) + v4Yoke(t, z, S.ss, { k: S.sk, press: S.press });
  const sp = [z.x + 6, GY + (290 - 560) * (z.sy || 1)]; w += v4Thud(T, K.tTh, sp[0], sp[1], S.ss) + v4Thud(T, K.tTh2, sp[0], sp[1], S.ss);
  if (S.sk > 0.85 && T < K.tTape + 0.9) { const u = T - K.tTape - 0.4, mp = [z.x, GY + (238 - 560) * (z.sy || 1)]; for (let i = 0; i < 6; i++) { const an = i * Math.PI / 3 + 0.3; w += `<line x1="${f1(mp[0] + Math.cos(an) * 150)}" y1="${f1(mp[1] + Math.sin(an) * 60)}" x2="${f1(mp[0] + Math.cos(an) * (176 + 40 * u))}" y2="${f1(mp[1] + Math.sin(an) * (72 + 16 * u))}" stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity="${rsOp(1 - Math.abs(u) / 0.5)}"/>`; } }
  if (!o.noPpl) w += `<g clip-path="url(#rsT)">${RSC(S.c)}${RSX('#B7C9A8', '#5A3A22')(S.x)}${RSB(S.bo)}</g>`;
  w += rsTable(960, 2010, TY, GY) + `<rect x="1196" y="${TY - 10}" width="96" height="10" rx="3" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="1392" y="${TY - 12}" width="96" height="12" rx="4" fill="#8E97A6" stroke="${INK}" stroke-width="4"/><rect x="1300" y="${TY - 44}" width="30" height="44" rx="6" fill="#DDEBFA" stroke="${INK}" stroke-width="4"/>`;
  if (T >= K.d + 0.15) w += `<g transform="translate(1104 ${TY - 5}) rotate(-4)"><rect x="-30" y="-5" width="60" height="10" rx="4" fill="${RS.BLUE}" stroke="${INK}" stroke-width="3"/></g>`;   // 내려놓은 펜
  w += `<rect x="1640" y="${TY - 10}" width="70" height="10" rx="3" fill="${RS.BLUE}" stroke="${INK}" stroke-width="4"/><g transform="rotate(${f1(-180 * S.fold)} 1710 ${TY})"><rect x="1710" y="${TY - 10}" width="70" height="10" rx="3" fill="${RS.BLUE}" stroke="${INK}" stroke-width="4"/></g>` + (S.fold < 0.5 ? `<rect x="1648" y="${TY - 16}" width="124" height="6" rx="2" fill="#fff" stroke="${INK}" stroke-width="3"/>` : '');
  return w;
}
function vmShot(t, T, S, cam, o = {}) {
  return rsDefs() + rsClipY('rsT', MT.TY) + v4Plate('rsmeeting', cam, o) + qCam(cam, vmRoom(t, T, S, o)) + v4Sun(true) + (o.cool ? fFull('#24304A', rsOp(o.cool)) : '');
}
const VM_W = [920, 592, 1.08];
function vmShots(t, T, S, noRib) { // 회의 전체의 컷
  const K = S.K, rib = (q = 1, qk = 1) => noRib ? '' : rsRib(1, RSW1, '석 달째 · 고객사 회의', q, qk), L = (c0, c1) => (TT, s, e) => qLerpCam((TT - s) / (e - s), c0, c1);
  const shot = (cf, o = {}, ex) => (TT, s, e) => vmShot(t, TT, S, cf(TT, s, e), o) + (ex ? ex(TT, s, e) : '');
  return v4Shots(T, [
    [-9, (TT) => vmShot(t, TT, S, qLerpCam(TT / (K.t1 - 0.15), [1040, 596, 1.08], VM_W)) + (noRib ? '' : rsRib(TT / 0.4, RSW1, '석 달째 · 고객사 회의', 1))],
    [K.t1 - 0.15, shot(L([540, 566, 1.36], [520, 560, 1.44]), { depth: 0.85, noPpl: 1 })],                                              // 화면을 짚으며 발표한다
    [K.t30 - 0.15, shot((TT, s) => [760, lerp(346, 338, rsK(0, 1.5, TT - s)), lerp(2.2, 2.34, easeOut(rsK(0, 1.5, TT - s)))], { noPpl: 1 })],   // 인서트: +30%
    [K.t30 + 1.3, (TT, s) => mtHand(t, TT - s)],                                                                                       // 인서트: 떨리는 손
    [K.a - 0.15, shot(L([1420, 630, 1.4], [1400, 628, 1.48]), { depth: 0.85 })],                                                        // 손을 드는 담당자
    [K.tIt - 0.2, shot(L(VM_W, [905, 594, 1.12]), {}, () => rib())],                                                                    // 화면을 가리킨다
    [K.tKi + 0.2, shot(L([340, 632, 1.62], [330, 628, 1.7]), { depth: 0.7, blur: 1 })],                                                 // 제로가 화면을 흘끗 본다
    [K.tMw + 0.5, shot(TT => [430, 548 + v4Jolt(TT, K.tTh), 1.5], { noPpl: 1 }, () => mtOTS())],                                         // 어깨 너머: '쿵'
    [K.tJb - 0.1, shot((TT, s, e) => [290, 600, lerp(1.95, 2.05, rsK(s, e, TT))], { depth: 0.6, blur: 1 })],                             // 눈이 흔들린다
    [K.b - 0.15, shot(L([330, 640, 1.6], [320, 636, 1.68]), { depth: 0.7, blur: 1 })],                                                  // 손짓하며 더듬는다
    [K.tGr - 0.12, shot(L([1570, 630, 1.5], [1580, 628, 1.56]), { depth: 0.85 })],                                                      // 팀장은 눈을 피한다
    [K.tJh + 0.3, shot((TT, s, e) => { const c = qLerpCam((TT - s) / (e - s), VM_W, [900, 596, 1.18]); return [c[0], c[1] + v4Jolt(TT, K.tTh2), c[2]]; }, {}, () => rib())],   // 한 줄에 눌린다
    [K.d - 0.15, shot((TT, s, e) => [1170, 634, lerp(1.9, 2.08, easeInOut(rsK(s, e, TT)))], { depth: 0.85 })],                           // 담당자가 펜을 내려놓고 묻는다
    [K.s5 - 0.15, shot((TT, s, e) => [285, 600, lerp(2.0, 2.16, easeInOut(rsK(s, s + 2, TT)))], { depth: 0.6, blur: 1, cool: 0 }, (TT) => fFull('#24304A', rsOp(0.1 * S.sk)))],   // 한 줄이 입을 덮는다
    [K.s5 + 2.05, shot(L(VM_W, [890, 598, 1.2]), { cool: 0.1 }, (TT) => rib(2, (TT - K.s5 - 2.25) / 0.3))],                                           // 모두가 본다
    [K.g - 0.15, shot((TT, s) => [1560, lerp(606, 582, easeInOut(rsK(0.3, 1.0, TT - s))), 1.42], { depth: 0.9 }, () => rib(2))],         // 팀장이 일어선다
    [K.g + 1.75, shot(L([890, 598, 1.2], [1000, 588, 1.08]), {}, () => rib(2))],                                                                   // 손을 내민다, 제로가 물러난다
  ]);
}
mtmeetScene = function (t, lt, a, T) { return vmShots(t, T, vmState(t, T)); };
/* ---------- 훅: 같은 방의 그 질문(1번)과 입이 막힌 제로(2번) ---------- */
function v4hookScene(t, lt, a, T) {
  const d = v4T('m4', 'm0'), s5 = v4T('m5', 'm0'), tQ = rsW(a, '이', 0.95) - 0.15;
  if (a.ph === 0) { const Tm = d - 0.15 + (lt - tQ), S = vmState(t, Tm, { cLine: rsL('h1') });   // "제로 씨." 뒤에 펜을 내려놓고 묻는다
    if (lt < tQ - 0.1) return vmShot(t, Tm, S, qLerpCam(lt / 2.2, [940, 594, 1.1], [900, 596, 1.18])) + v4Cut(lt, tQ - 0.1);
    return vmShot(t, Tm, S, [1170, 634, lerp(1.9, 2.1, easeInOut(rsK(tQ - 0.1, tQ + 3, lt)))], { depth: 0.85 }) + v4Cut(lt, tQ - 0.1); }
  const Tm = s5 - 0.15 + lt, S = vmState(t, Tm);
  return vmShot(t, Tm, S, [285, 600, lerp(2.0, 2.2, easeInOut(rsK(0, 2.4, lt)))], { depth: 0.6, blur: 1 }) + fFull('#24304A', rsOp(0.1 * S.sk));
}
