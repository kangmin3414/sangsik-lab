/* 회의 장면 — 연기 층 적용판(대본_v4 18~19번 구간, 2026-11-14 엔진 개선 시험). mtscenes.js 뒤에 불러 mtmeetScene을 덮어쓴다. 새 이름은 ma 접두사.
   바꾼 것: ① 엔진에 있던 기능을 쓴다(고개 돌리기 turn · 손 모양 handL/handR · 쥔 물건 holdR · 이마 짚는 팔 armFront · 끄덕임 headDy · 빛 방향 light · 먼지 puff · 배경 원근과 흐림)
            ② 연기 층 zw/act.js(예비 동작 · 탄력 · 뒤따름 · 눈 → 머리 순서의 시선)
            ③ 연기는 끊기지 않는 시계 T(runLt)로 한 번만 정하고, 컷은 카메라만 바꾼다(컷이 바뀌어도 동작이 이어진다). */
const maT = id => rsL(id).t0 - rsL('m0').t0;
const maW = (id, key, fb) => maT(id) + rsWd(rsL(id).words, key, fb);
const MA_CLK = { svg: `<rect x="-4" y="-8" width="50" height="16" rx="6" fill="#3A4252" stroke="${INK}" stroke-width="4"/><circle cx="36" cy="0" r="3.5" fill="#FF5A4A"/>`, follow: true };
const MA_PEN = { svg: `<rect x="-2" y="-5" width="58" height="10" rx="4" fill="${RS.BLUE}" stroke="${INK}" stroke-width="3"/>`, follow: true };
E['ma긴장'] = Object.assign({}, E['z기본'], zWorryBrow, { mouth: 'M190 239 L210 239', mouthFill: 'none', fxUnder: null }); // 굳은 얼굴(땀 없이, 눈썹만 걱정)
const maArm = (base, o) => Object.assign({}, base, o);
const MA_Z = (() => { const S = P['서기'], up = { armR: [[252, 285], [300, 296], [334, 262]], hR: [342, 254] }, mid = { armR: [[252, 285], [296, 318], [318, 296]], hR: [324, 290] }, low = { armR: [[252, 285], [284, 340], [296, 372]], hR: [300, 380] };
  const fist = { armL: [[148, 285], [124, 336], [122, 376]], hL: [122, 384] }, ex1 = { armL: [[148, 285], [100, 296], [82, 238]], hL: [78, 228] }, shL = { armL: [[148, 285], [96, 300], [62, 258]], hL: [54, 250] }, shR = { armR: [[252, 285], [304, 300], [338, 258]], hR: [346, 250] };
  return { up: maArm(S, up), mid: maArm(S, mid), tense: maArm(S, Object.assign({}, low, fist)), ex1: maArm(S, Object.assign({}, mid, ex1)), shrug: maArm(S, Object.assign({}, shL, shR)), ask: maArm(S, Object.assign({}, low, ex1)), drop: S }; })();
const MA_C = (() => { const S = Object.assign({}, P['서기'], rsArmType), L = (a, h) => maArm(S, { armL: a, hL: h });
  return { sit: S, up: L([[148, 285], [114, 252], [102, 198]], [100, 188]), point: L([[148, 285], [102, 262], [60, 224]], [52, 216]), mid: L([[148, 285], [118, 302], [110, 262]], [108, 252]), bl: L([[148, 285], [110, 300], [88, 264]], [82, 256]), br: L([[148, 285], [128, 306], [138, 262]], [140, 252]), fore: maArm(S, { armR: [[252, 285], [292, 246], [256, 158]], hR: [246, 148] }) }; })();
function maState(t, T) { // 이 순간의 연기 전체(인물마다 char 옵션)
  const a = maT('m2'), b = maT('m3'), tIt = maW('m2', '30', 1.73), tKi = maW('m2', '기준', 2.71), tMw = maW('m2', '뭐죠', 3.89), tJn = maW('m2', '전년', 5.05), tJb = maW('m2', '전분기', 6.07), tGe = b + 0.15, tJc = maW('m3', '전체', 0.45), tGr = maW('m3', '그러니까', 2.13), tJh = maW('m3', '종합', 2.87), tBw = maW('m3', '봤을', 4.15), tTh = tMw + 0.75, tTh2 = tJh + 0.75, end = maT('m4');
  const K = { a, b, tIt, tKi, tMw, tJn, tJb, tGe, tJc, tGr, tJh, tBw, tTh, tTh2, end }, e = env(t), zTalk = (T >= maT('m1') && T < a - 0.3) || (T >= b && T < end - 0.3), cTalk = T >= a && T < b - 0.35;
  // --- 제로
  const press = actTrack([[0, 0], [tTh, 0.34, { f: 2.6, z: 0.35, ant: 0 }], [tGe + 0.4, 0.5, { f: 0.8, z: 1, ant: 0 }], [tTh2, 0.85, { f: 2.6, z: 0.35, ant: 0 }]], T);
  const ss = actTrack([[0, 0.36], [tTh, 0.56, { f: 3, z: 0.4, ant: 0 }], [tGe + 0.4, 0.7, { f: 0.8, z: 1, ant: 0 }], [tTh2, 0.92, { f: 3, z: 0.4, ant: 0 }]], T);
  const zg = actGaze([[0, 0.75, -0.15], [a + 0.12, 0.92, 0], [tKi + 0.3, 0.5, -0.65], [tMw + 0.1, 0.92, 0], [tJb + 0.1, 0.35, -0.55], [tJb + 0.5, 0.95, 0.1], [tJb + 0.9, 0.5, 0.6], [tGe, 0.9, 0.05], [tJc + 0.35, 0.35, -0.45], [tGr + 0.05, 1.0, 0.0], [tJh + 0.15, 0.45, 0.65], [tBw + 0.3, 0.15, 0.85]], T);
  const zp = actPose([[0, MA_Z.up], [a + 0.18, MA_Z.mid, { ant: 0.06, f: 5, z: 0.45 }], [tTh, MA_Z.tense, { ant: 0, f: 4, z: 0.4 }], [tGe - 0.05, MA_Z.ex1, { ant: 0.14 }], [tJc + 0.25, MA_Z.shrug, { ant: 0.12, z: 0.45 }], [tGr - 0.05, MA_Z.ask, { ant: 0.1 }], [tJh + 0.2, MA_Z.drop, { ant: 0, f: 2.2, z: 0.6 }]], T);
  const zh = actMul(actHit(T, a + 0.14, 0.05, 6, 9), actHit(T, tMw + 0.3, 0.035, 5, 8), actHit(T, tTh, 0.1, 4.5, 5), actHit(T, tTh2, 0.09, 4.5, 5)), zsw = T > tGe && T < tJh ? Math.sin((T - tGe) * 4.2) * 7 : 0, zsy = zh.sy * (1 - 0.12 * press) * actInhale(T, tGe, 0.3);
  const tk = zTalk ? actTalk(e) : { headDy: 0, hand: 0 }; if (zTalk && T > tGe - 0.1) { zp.hL = [zp.hL[0], zp.hL[1] + tk.hand]; zp.armL[2] = [zp.armL[2][0], zp.armL[2][1] + tk.hand]; }
  E['_maz'] = qTalk('z당황', zTalk ? e : 0);
  const zex = T >= b ? fEx('_maz') : exprAt([[0, 'z히죽'], [a + 0.16, 'ma긴장'], [tTh, 'z당황']], T);
  if (zTalk && T < a) { E['_maz0'] = qTalk('z히죽', e); }
  const z = { x: MT.ZX + 7 * press + zsw, y: MT.GY, s: 1, sy: zsy, sx: zh.sx * (1 + 0.04 * press), t, pose: zp, ex: zTalk && T < a ? fEx('_maz0') : zex, look: zg.look, turn: zg.turn, tilt: zg.tilt + 6 * press + zsw * 0.35, headDy: tk.headDy + actTrack([[0, 0], [tJh + 0.15, 13, { f: 1.6, z: 0.8, ant: 0 }]], T),
    handR: 'grip', holdR: MA_CLK, handL: T > tTh - 0.05 && T < tGe - 0.1 ? 'fist' : T >= tGe - 0.1 && T < tJh + 0.25 ? 'open' : null, handRotL: T >= tGe - 0.1 && T < tJh + 0.25 ? -100 : null, light: -1, seed: 3 };
  // --- 고객사 담당자(탁자 뒤)
  const cg = actGaze([[0, -0.75, -0.5], [a - 0.12, -0.92, -0.05], [tIt - 0.12, -0.6, -0.55], [tKi + 0.12, -0.92, -0.05]], T);
  const cp = actPose([[0, MA_C.sit], [a - 0.02, MA_C.up, { ant: 0.16, amt: 0.16 }], [tIt - 0.18, MA_C.point, { ant: 0.1 }], [tKi + 0.3, MA_C.mid, { ant: 0.08 }], [tJn - 0.05, MA_C.bl, { ant: 0.06, f: 4.5 }], [tJb - 0.05, MA_C.br, { ant: 0.06, f: 4.5 }], [b - 0.25, MA_C.mid, { ant: 0.05, f: 2.4, z: 0.7 }]], T);
  const ck = cTalk ? actTalk(e) : { headDy: 0, hand: 0 }; E['_mac'] = qTalk(T < tMw + 0.4 ? 'z기본' : 'rs평온', cTalk ? e : 0);
  const pointing = T >= tIt - 0.2 && T < tKi + 0.3, tap = T > b ? Math.max(0, Math.sin(T * 9)) * 4 : 0; if (tap) { cp.hL = [cp.hL[0], cp.hL[1] + tap]; cp.armL[2] = [cp.armL[2][0], cp.armL[2][1] + tap]; }
  const c = { x: 1170 + actTrack([[0, 0], [a, -16, { f: 2.4, z: 0.6, ant: 0.15 }]], T), y: rsSitY(MT.TY), s: 1, t, pose: cp, ex: fEx('_mac'), look: cg.look, turn: cg.turn, tilt: cg.tilt + actTrack([[0, 0], [tKi + 0.15, -5, { f: 3, z: 0.5 }], [tJn - 0.1, 0, { f: 3, z: 0.6 }]], T), headDy: ck.headDy + actNod(T, tJn, 1, 8, 0.34) + actNod(T, tJb, 1, 8, 0.34),
    handL: T < a - 0.05 ? null : pointing ? 'point' : T < b - 0.25 ? 'open' : 'grip', handRotL: pointing ? null : T >= a - 0.05 && T < b - 0.25 ? -95 : null, holdL: T >= b - 0.25 ? MA_PEN : null, light: -1, seed: 51 };
  // --- 동료
  const xg = actGaze([[0, -0.75, -0.5], [a + 0.28, -0.85, 0], [tIt + 0.2, -0.75, -0.5], [tMw + 0.3, -0.92, -0.05], [tGr + 0.5, 0.85, 0], [tJh + 0.7, -0.92, -0.05]], T);
  const x = { x: 1440, y: rsSitY(MT.TY), s: 1, t, pose: MA_C.sit, ex: exprAt([[0, 'rs평온'], [tGr + 0.5, 'z민망']], T), look: xg.look, turn: xg.turn, tilt: xg.tilt, light: -1, seed: 52 };
  // --- 팀장
  const bg = actGaze([[0, -0.75, -0.5], [a + 0.4, -0.85, 0], [tMw + 0.45, -0.95, -0.05], [tGr + 0.3, 0.15, 0.85]], T, { f: 3.2 });
  const bp = actPose([[0, MA_C.sit], [tGr + 0.4, MA_C.fore, { ant: 0.1, f: 3.2, z: 0.6 }]], T), fore = T > tGr + 0.5;
  const bo = { x: 1710, y: rsSitY(MT.TY), s: 1, t, pose: bp, ex: fore && T > tGr + 0.75 ? { expr: 'z민망', prev: 'z민망', k: 1, blink: 1 } : exprAt([[0, 'z기본'], [a + 0.4, 'rs평온'], [tJc + 0.2, 'z민망']], T), look: bg.look, turn: bg.turn, tilt: bg.tilt, headDy: actNod(T, tMw + 0.9, 1, 7, 0.36) + actTrack([[0, 0], [tGr + 0.45, 10, { f: 2.4, z: 0.7 }]], T), armFront: fore ? 'R' : null, light: -1, seed: 21 };
  return { K, z, c, x, bo, press, ss, pop: 1 };
}
function maRoom(t, T, S, o = {}) { // 방 전체(세계 좌표)
  const GY = MT.GY, TY = MT.TY, K = S.K, z = S.z; let w = mtSlide(430, 150, 620, 380, S.pop);
  w += qShadow(z.x, GY, 92 + 10 * S.press, 0.5) + RSZW(z);
  const ZP = (lx, ly) => [z.x + (lx - 200), GY + (ly - 560) * z.sy], sp = ZP(206, 290), wob = Math.sin(t * 3.1) * 1.2;
  w += `<ellipse cx="${f1(sp[0])}" cy="${f1(sp[1] + 40 * S.ss + 6)}" rx="${f1(300 * S.ss)}" ry="9" fill="${INK}" opacity="${S.ss > 0.42 ? 0.2 : 0}"/>` + rsStrip(sp[0], sp[1], S.ss, { rot: -9 + wob - 3 * (S.press - 0.3) });
  for (const tt of [K.tTh, K.tTh2]) { const u = T - tt; if (u > 0 && u < 0.5) { w += puff(sp[0], sp[1] + 30, T, tt, 0.55, '#FFF6CF'); for (let i = 0; i < 5; i++) { const an = -Math.PI / 2 + (i - 2) * 0.42, r0 = 150 * S.ss + 70 + 60 * u, r1 = r0 + 34; w += `<line x1="${f1(sp[0] + Math.cos(an) * r0 * 1.5)}" y1="${f1(sp[1] - 30 + Math.sin(an) * r0 * 0.5)}" x2="${f1(sp[0] + Math.cos(an) * r1 * 1.5)}" y2="${f1(sp[1] - 30 + Math.sin(an) * r1 * 0.5)}" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity="${rsOp(1 - u / 0.5)}"/>`; } } }
  if (!o.noPpl) w += `<g clip-path="url(#rsT)">${RSC(S.c)}${RSX('#B7C9A8', '#5A3A22')(S.x)}${RSB(S.bo)}</g>`;
  w += rsTable(960, 2010, TY, GY) + `<rect x="1196" y="${TY - 10}" width="96" height="10" rx="3" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="1392" y="${TY - 12}" width="96" height="12" rx="4" fill="#8E97A6" stroke="${INK}" stroke-width="4"/><rect x="1300" y="${TY - 44}" width="30" height="44" rx="6" fill="#DDEBFA" stroke="${INK}" stroke-width="4"/><rect x="1640" y="${TY - 10}" width="70" height="10" rx="3" fill="${RS.BLUE}" stroke="${INK}" stroke-width="4"/><rect x="1710" y="${TY - 10}" width="70" height="10" rx="3" fill="${RS.BLUE}" stroke="${INK}" stroke-width="4"/><rect x="1648" y="${TY - 16}" width="124" height="6" rx="2" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
  return w;
}
const maSun = () => `<defs><linearGradient id="maSun" x1="1" y1="0" x2="0.35" y2="0.6"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".42"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></linearGradient></defs><rect x="-200" y="-200" width="2400" height="1600" fill="url(#maSun)"/>`;
function maShot(t, T, S, cam, o = {}) { // 컷: 카메라와 배경 깊이만 다르다
  const d = o.depth == null ? 1.0 : o.depth, pl = qdPlate('rsmeeting', cam, d);
  return rsDefs() + rsClipY('rsT', MT.TY) + (o.blur ? `<g filter="url(#rsBlur)">${pl}</g>` : pl) + qCam(cam, maRoom(t, T, S, o)) + maSun();
}
const maMtOld = mtmeetScene;
mtmeetScene = function (t, lt, a, T) {
  const S = maState(t, T), K = S.K, s1 = K.a - 0.15, e7 = K.end - 0.15;
  if (T < s1 || T >= e7) return maMtOld(t, lt, a, T);   // 이 판은 질문~더듬는 구간만 다시 만든다
  const rib = rsRib(1, RSW1, '석 달째 · 고객사 회의', 1), cut = tc => rsVeil(T, tc, 0.08, 0.3), jolt = tt => { const u = T - tt; return u > 0 && u < 0.6 ? 9 * Math.exp(-9 * u) * Math.cos(38 * u) : 0; };
  const c2 = K.tIt - 0.2, c3 = K.tMw + 0.5, c4 = K.tJb - 0.1, c5 = K.b - 0.15, c2b = K.tKi + 0.2, c6 = K.tGr - 0.12, c7 = K.tJh + 0.3;
  if (T < c2) return maShot(t, T, S, qLerpCam((T - s1) / (c2 - s1), [1420, 630, 1.4], [1400, 628, 1.48]), { depth: 0.85 }) + cut(c2);                       // ① 손을 드는 담당자, 차례로 돌아보는 두 사람
  if (T < c2b) return maShot(t, T, S, qLerpCam((T - c2) / (c2b - c2), [920, 592, 1.08], [905, 594, 1.12])) + rib + cut(c2) + cut(c2b);                        // ② 화면을 가리킨다
  if (T < c3) return maShot(t, T, S, qLerpCam((T - c2b) / (c3 - c2b), [340, 632, 1.62], [330, 628, 1.7]), { depth: 0.7, blur: 1 }) + cut(c2b) + cut(c3);       // ②-2 제로가 화면을 흘끗 보고 침을 삼킨다                            // ② 화면을 가리킨다, 제로가 화면을 흘끗 본다
  if (T < c4) return maShot(t, T, S, [430, 548 + jolt(K.tTh), 1.5], { noPpl: 1 }) + mtOTS() + cut(c3) + cut(c4);                                                // ③ 어깨 너머: 한 줄이 '쿵'
  if (T < c5) return maShot(t, T, S, [290, 600, lerp(1.95, 2.05, rsK(c4, c5, T))], { depth: 0.6, blur: 1 }) + cut(c4) + cut(c5);                                 // ④ 눈이 흔들린다
  if (T < c6) return maShot(t, T, S, qLerpCam((T - c5) / (c6 - c5), [330, 640, 1.6], [320, 636, 1.68]), { depth: 0.7, blur: 1 }) + cut(c5) + cut(c6);            // ⑤ 손짓하며 더듬는다
  if (T < c7) return maShot(t, T, S, qLerpCam((T - c6) / (c7 - c6), [1570, 630, 1.5], [1580, 628, 1.56]), { depth: 0.85 }) + cut(c6) + cut(c7);                  // ⑥ 팀장은 눈을 피한다
  return maShot(t, T, S, (() => { const c = qLerpCam((T - c7) / (e7 - c7), [920, 592, 1.08], [900, 596, 1.18]); return [c[0], c[1] + jolt(K.tTh2), c[2]]; })()) + rib + cut(c7);   // ⑦ 한 줄에 눌려 내려앉는다
};
