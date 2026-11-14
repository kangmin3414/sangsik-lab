/* 자소서 편 v4 — 2막의 나머지(b3~b7 사무실·검색, c1~c8 인사팀·반납·면접). 회의(m0~m7)는 v4meet.js.
   연기는 장면마다 상태 함수(voState·vhState·viState) 하나로 정하고, 컷은 카메라만 바꾼다. */
['v4office', 'v4search', 'v4hr', 'v4return', 'v4itv1'].forEach(k => CAMS[k] = 'fixed');
E['v4물음'] = Object.assign({}, E['rs평온'], { bL: [140, 138, 163, 128, 186, 136], bR: [214, 136, 237, 128, 260, 138] });   // 눈썹만 올라간 얼굴(되묻는다)
const v4Gasp = (key, k) => { E[key] = Object.assign({}, E['z당황'], { mouth: ell(200, 238, 10 + 4 * k, 3 + 13 * k), mouthFill: '#5A1E2A' }); return fEx(key); };
const v4L = (c0, c1) => (TT, s, e) => qLerpCam((TT - s) / (e - s), c0, c1);
/* ---------- b3~b6: 팀장의 부탁 → "아… 네! 그럼요." → 혼자 남은 어깨에 한 줄이 내려앉는다 ---------- */
function voState(t, T) {
  const F = 'b3', tm = id => v4T(id, F), W = (id, k, fb) => v4W(id, F, k, fb);
  const tJ = W('b3', '자소서', 1.09), tM = W('b3', '매출', 2.19), tG = W('b3', '금요일', 3.97), tD = W('b3', '직접', 5.39), b4 = tm('b4'), tNe = W('b4', '네', 1.03), tGr = W('b4', '그럼요', 1.91), b5 = tm('b5'), tRi = W('b5', '리드', 0.63), b6 = tm('b6'), tGo = b6 - 0.1, tLand = b6 + 1.25;
  const K = { tJ, tM, tG, tD, b4, tNe, tGr, b5, tRi, b6, tGo, tLand }, GY = RSO.GY;
  // --- 팀장: 서류를 들고 와서 묻고, 엄지를 들고, 돌아간다
  const out = rsK(tGo, tGo + 2.0, T), bx = lerp(1700, 1380, easeOut(rsK(-0.35, 0.55, T))) + 900 * easeIn(out), walking = T < 0.5 || out > 0;
  const BS = P['서기'], CARRY = v4Pose(BS, { armR: [[252, 285], [282, 334], [262, 366]], hR: [258, 374] }), SHOW = v4Pose(BS, { armR: [[252, 285], [298, 300], [312, 252]], hR: [316, 242] }), PT = v4Pose(CARRY, { armL: [[148, 285], [100, 272], [58, 256]], hL: [50, 252] }), TH = v4Pose(CARRY, { armL: [[148, 285], [108, 262], [100, 214]], hL: [98, 204] });
  let bp = actPose([[0, CARRY], [tJ - 0.1, SHOW, { ant: 0.1 }], [tD - 0.15, PT, { ant: 0.1 }], [b4 - 0.2, CARRY, { ant: 0, f: 2.4, z: 0.7 }], [b5 - 0.05, TH, { ant: 0.12, z: 0.45 }], [tGo - 0.25, CARRY, { ant: 0, f: 2.6, z: 0.7 }]], T);
  if (walking) { const wp = walkPose(bx * 0.045, 0.7); bp = Object.assign({}, wp, { armR: CARRY.armR, hR: CARRY.hR }); }
  const bg = actGaze([[-1, -0.6, 0.3], [0, -0.85, 0.1], [tJ, -0.2, 0.45], [tM + 0.45, -0.85, 0.1], [tGo, 0.85, 0]], T);
  const bex = v4On('b3', t) ? v4Say('_vob', 'z기본', 'b3', t) : v4On('b5', t) ? v4Say('_vob', 'z빵긋', 'b5', t) : exprAt([[-1, 'z기본'], [b5 - 0.2, 'z빵긋'], [tGo + 0.2, 'z기본']], T);
  const b = { x: bx, y: GY, s: 1, t, pose: bp, ex: bex, look: bg.look, turn: bg.turn, tilt: bg.tilt, headDy: v4Bob('b3', t).headDy + v4Bob('b5', t).headDy + actNod(T, tNe + 0.25, 1, 7, 0.34) + actNod(T, tRi + 0.9, 1, 8, 0.34), sy: actHit(T, b5 + 0.05, 0.03, 5, 8).sy,
    handR: 'grip', holdR: V4_PAPER(true), handL: T > tD - 0.15 && T < b4 - 0.2 ? 'point' : T > b5 - 0.05 && T < tGo - 0.25 ? 'thumb' : null, seed: 21 };
  // --- 제로: 웃다가 굳고, 과하게 씩씩하게 대답하고, 혼자 남아 내려앉는다
  const zg = actGaze([[-1, 0, 0.6], [0.15, 0.85, -0.15], [tM + 0.15, 0.6, 0.35], [tM + 0.9, 0.85, -0.15], [tD + 0.5, 0.2, 0.7], [b4 + 0.1, -0.35, 0.6], [tNe - 0.1, 0.85, -0.15], [tGo + 0.5, 0.6, 0.1], [tGo + 1.0, 0, 0.6], [tLand + 0.3, 0, -0.6], [tLand + 1.1, 0, 0.65]], T, { turn: 0.7 });
  const UPR = v4Pose(V4SIT(), { armR: [[252, 285], [300, 262], [312, 216]], hR: [314, 206] });
  const zp = actPose([[0, V4SIT()], [tNe, UPR, { ant: 0.1, z: 0.4 }], [b5 + 0.2, V4SIT(), { ant: 0, f: 2.2, z: 0.7 }]], T);
  const zh = actMul(actHit(T, tM + 0.1, 0.025, 5, 9), actHit(T, tD + 0.25, 0.06, 5, 7), actHit(T, tNe, 0.04, 5, 8), actHit(T, tLand, 0.09, 4.5, 5));
  const zex = v4On('b4', t) ? v4Say('_voz', T < tNe - 0.1 ? 'z당황' : 'z히죽', 'b4', t) : exprAt([[-1, 'z기본'], [0.2, 'z히죽'], [tM + 0.15, 'v4긴장'], [tD + 0.25, 'z당황'], [b4 + 2.6, 'z히죽'], [b5 + 0.5, 'z민망'], [tGo + 0.7, 'v4긴장'], [tLand, 'z당황']], T);
  const sunk = easeOut(rsK(tLand, tLand + 0.3, T));
  const z = { x: RSO.ZX, y: rsSitY(RSO.DY), s: 1, t, pose: zp, ex: zex, look: zg.look, turn: zg.turn, tilt: zg.tilt + 4 * sunk, headDy: v4Bob('b4', t).headDy + actNod(T, tGr, 2, 8, 0.28) + 8 * sunk, sy: zh.sy * (1 - 0.03 * sunk) * actInhale(T, b4, 0.3), sx: zh.sx, handR: T > tNe - 0.05 && T < b5 + 0.2 ? 'thumb' : null, seed: 3 };
  return { K, z, b, fall: clamp((T - (tLand - 0.55)) / 0.55, 0, 1) };
}
function voShot(t, T, S, cam, o = {}) {
  const z = S.z, K = S.K, sp = [z.x + 6, z.y + (290 - 560) * (z.sy || 1)]; let st = '';
  if (S.fall > 0 && S.fall < 1) st = rsStrip(sp[0], sp[1] - 330 * (1 - easeIn(S.fall)), 0.36, { rot: lerp(9, -9, S.fall) });   // 위에서 내려오는 한 줄
  else if (S.fall >= 1) st = v4Yoke(t, z, 0.36, { press: 0.3 }) + v4Thud(T, K.tLand, sp[0], sp[1], 0.36);
  const w = `<g clip-path="url(#rsT)">${RSZW(z)}</g>` + rsODesk() + st + qShadow(S.b.x, RSO.GY, 92, 0.5) + RSB(S.b);
  return rsDefs() + rsClipY('rsT', RSO.DY) + v4Plate('rsoffice', cam, o) + qCam(cam, w) + v4Sun(true, 0.3);
}
function v4officeScene(t, lt, a, T) {
  const S = voState(t, T), K = S.K, rib = (q = 0, qk = 1) => rsRib(T < 0.6 ? (T + 0.15) / 0.4 : 1, RSW1, '입사 첫 주', q, qk);
  const shot = (cf, o = {}, ex) => (TT, s, e) => voShot(t, TT, S, cf(TT, s, e), o) + (ex ? ex(TT, s, e) : '');
  return v4Shots(T, [
    [-9, (TT) => voShot(t, TT, S, qLerpCam(TT / K.tM, [1090, 612, 1.16], [1060, 608, 1.24])) + rib()],                                   // 팀장이 서류를 들고 온다
    [K.tM - 0.2, shot(v4L([680, 646, 1.76], [676, 644, 1.84]), { depth: 0.8 })],                                                          // '매출 분석'에 웃음이 굳는다
    [K.tG - 0.15, shot(v4L([1330, 640, 1.46], [1320, 638, 1.52]), { depth: 0.85 })],                                                      // 팀장: 금요일 고객사 회의
    [K.tD - 0.1, shot((TT, s, e) => [730, 646 + v4Jolt(TT, K.tD + 0.25, 6), lerp(1.9, 2.06, rsK(s, e, TT))], { depth: 0.7, blur: 1 })],   // '직접 설명' → "아…"
    [K.tNe - 0.15, shot(v4L([1070, 610, 1.22], [1060, 608, 1.28]), {}, () => rib())],                                                     // "네! 그럼요."
    [K.b5 - 0.15, shot(v4L([1330, 640, 1.5], [1320, 638, 1.56]), { depth: 0.85 })],                                                       // "역시."
    [K.tGo + 0.1, shot(v4L([1060, 608, 1.26], [960, 608, 1.3]), {}, () => rib())],                                                        // 팀장이 돌아간다
    [K.tLand - 0.8, shot((TT, s, e) => [745, 650 + v4Jolt(TT, K.tLand), lerp(1.7, 1.86, rsK(s, e, TT))], { depth: 0.7 }, (TT) => rib(TT > K.tLand + 0.35 ? 1 : 0, (TT - K.tLand - 0.35) / 0.3))],   // 한 줄이 어깨에 앉는다
  ]);
}
/* ---------- b7: 밤마다 검색창 ---------- */
function v4SearchUI(t, u, Q, per) { // 지어낸 검색 화면
  const i = clamp(Math.floor(u / per), 0, Q.length - 1), uu = u - i * per, cur = Q[i][0], typed = cur.slice(0, Math.floor(cur.length * rsK(0.05, 0.56 * per, uu)));
  let g = rsChrome('검색', Q[i][1]) + `<rect x="470" y="140" width="980" height="88" rx="44" fill="#fff" stroke="${RS.BLUE}" stroke-width="6"/><circle cx="524" cy="182" r="16" fill="none" stroke="${INK}" stroke-width="6"/><line x1="536" y1="194" x2="550" y2="208" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` + fT(576, 198, typed, 40, NAVY, { anchor: 'start' });
  if (Math.floor(t * 2.2) % 2 === 0) g += `<rect x="${f1(582 + rsTw(typed, 40))}" y="162" width="4" height="44" fill="${INK}"/>`;
  g += fT(480, 296, '최근 검색', 28, '#7A8394', { anchor: 'start', w: 700 });
  for (let j = i - 1, r = 0; j >= 0; j--, r++) { const y = 326 + r * 92; g += `<g opacity="${rsOp(r === 0 ? rsK(0, 0.25, uu) : 1)}"><rect x="470" y="${y}" width="980" height="76" rx="14" fill="#fff" stroke="#C9CED8" stroke-width="3"/><circle cx="512" cy="${y + 38}" r="15" fill="none" stroke="#8B93A3" stroke-width="4"/><path d="M512 ${y + 29} V${y + 39} H520" fill="none" stroke="#8B93A3" stroke-width="4" stroke-linecap="round"/>${fT(548, y + 50, Q[j][0], 34, '#3A4252', { anchor: 'start', w: 700 })}${fT(1426, y + 49, Q[j][1], 26, '#8B93A3', { anchor: 'end', w: 700 })}</g>`; }
  return g;
}
function v4searchScene(t, lt, a) {
  const Q = [['매출 분석 하는 법', '오전 12:40'], ['프로젝트 리드 뜻', '오전 1:35'], ['3일 만에 전문가 되는 법', '오전 2:20']];
  return rsDefs() + rsZoom(rsLaptop(t, v4SearchUI(t, lt - 0.1, Q, 1.3)), lerp(1.03, 1.12, easeInOut(rsK(0, 4, lt))), 900, 440) + rsStrip(1500, 250, lerp(0.5, 0.82, easeInOut(rsK(0.3, 4, lt))), { rot: 3 }) + rsRib(lt / 0.4, RSW1, '그날부터 · 밤마다', 1) + v4Cut(lt, 0);
}
/* ---------- c1~c4: 인사팀. "…없습니다." "하나도요?" "네. 제가… 지어냈습니다." ---------- */
const VH = { GY: 985, TY: 852, ZX: 700, HX: 1220 };
function vhState(t, T) {
  const F = 'c1', tm = id => v4T(id, F), W = (id, k, fb) => v4W(id, F, k, fb);
  const tK = W('c1', '경력', 1.57), tH = W('c1', '확인', 2.79), tS = W('c1', '서류', 3.59), tG = W('c1', '같이', 6.01), tQ = W('c1', '괜찮', 7.63), c2 = tm('c2'), c3 = tm('c3'), c4 = tm('c4'), tJe = W('c4', '제가', 1.17), tJi = W('c4', '지어', 1.55), end = c4 + rsL('c4').t1 - rsL('c4').t0;
  const K = { tK, tH, tS, tG, tQ, c2, c3, c4, tJe, tJi, end }, sit = rsSitY(VH.TY);
  // --- 인사 담당자: 서류를 보다가 고개를 들고, 도와주려는 손짓, 조용히 되묻고, 끝에는 천천히 끄덕인다
  const HB = v4Pose(V4SIT(), { armL: [[148, 285], [124, 330], [156, 350]], hL: [164, 352] }), OFFER = v4Pose(V4SIT(), { armL: [[148, 285], [106, 302], [76, 290]], hL: [68, 288] });
  const hp = actPose([[0, HB], [tG - 0.1, OFFER, { ant: 0.1 }], [tQ + 0.9, HB, { ant: 0, f: 2.4, z: 0.7 }]], T), offer = T > tG - 0.1 && T < tQ + 0.9;
  const hg = actGaze([[-1, -0.3, 0.7], [tH - 0.1, -0.85, 0], [tG - 0.35, -0.4, 0.5], [tG + 0.45, -0.85, 0], [end + 1.5, -0.3, 0.7]], T);
  const hex = v4On('c1', t) ? v4Say('_vhh', 'rs평온', 'c1', t) : v4On('c3', t) ? v4Say('_vhh', 'v4물음', 'c3', t) : T > end + 0.75 && T < end + 1.5 ? fEx('v4눈감음') : exprAt([[-1, 'rs평온'], [c3 - 0.2, 'v4물음'], [c4 + 0.3, 'rs평온']], T);
  const h = { x: VH.HX, y: sit, s: 1, t, pose: hp, ex: hex, look: hg.look, turn: hg.turn, tilt: hg.tilt + actTrack([[0, 0], [tG + 0.3, -4, { f: 2.4, z: 0.6 }], [tQ + 0.9, 0, { f: 2, z: 0.8 }], [c3 - 0.1, -7, { f: 3, z: 0.5 }], [c4, 0, { f: 2, z: 0.8 }]], T), headDy: v4Bob('c1', t).headDy + v4Bob('c3', t).headDy + actNod(T, end + 0.8, 1, 11, 0.7),
    handL: offer ? 'open' : 'grip', handRotL: offer ? 180 : null, holdL: offer ? null : V4_PEN, seed: 61 };
  // --- 제로: 눈을 못 맞추다가, 마지막 한마디만은 보고 말한다
  const zg = actGaze([[-1, 0.2, 0.75], [tK + 0.1, 0.75, 0.45], [tK + 0.9, 0.2, 0.75], [tS + 0.2, 0.85, 0], [tS + 1.0, 0.15, 0.8], [c3 - 0.1, 0.85, 0], [c3 + 1.0, 0.3, 0.7], [tJi - 0.2, 0.9, 0], [end + 0.3, 0.2, 0.8]], T, { turn: 0.7 });
  const zex = v4On('c2', t) ? v4Say('_vhz', 'v4긴장', 'c2', t) : v4On('c4', t) ? v4Say('_vhz', T < tJe - 0.25 ? 'v4긴장' : 'rs담담', 'c4', t) : exprAt([[-1, 'v4긴장'], [tK + 0.1, 'z당황'], [tS + 1.0, 'v4긴장'], [c2 - 0.6, 'v4눈감음'], [c2 - 0.08, 'v4긴장'], [end + 0.3, 'v4눈감음']], T);
  const press = actTrack([[0, 0.55], [tK + 0.1, 0.7, { f: 2.6, z: 0.4, ant: 0 }], [end + 0.2, 0.95, { f: 2.6, z: 0.35, ant: 0 }]], T), ss = actTrack([[0, 0.6], [tK + 0.1, 0.66, { f: 3, z: 0.4, ant: 0 }], [end + 0.2, 0.76, { f: 3, z: 0.4, ant: 0 }]], T);
  const zh = actMul(actHit(T, tK + 0.1, 0.05, 5, 7), actHit(T, end + 0.2, 0.08, 4.5, 5));
  const z = { x: VH.ZX, y: sit, s: 1, t, pose: rsSitPose(), ex: zex, look: zg.look, turn: zg.turn, tilt: zg.tilt + 5 * press, headDy: v4Bob('c2', t).headDy + v4Bob('c4', t).headDy + actNod(T, c4 + 0.05, 1, 9, 0.45) + actTrack([[0, 7], [tJi - 0.2, 0, { f: 2.4, z: 0.7 }], [end + 0.3, 15, { f: 1.8, z: 0.8, ant: 0 }]], T),
    sy: zh.sy * (1 - 0.1 * press) * actInhale(T, c2, 0.4, 0.04) * actInhale(T, c4 + tJe - c4, 0.4, 0.04), sx: zh.sx, seed: 3 };
  return { K, z, h, press, ss };
}
function vhShot(t, T, S, cam, o = {}) {
  const K = S.K, z = S.z, sp = [z.x + 6, z.y + (290 - 560) * (z.sy || 1)];
  const w = `<g clip-path="url(#rsT)">${RSZW(z)}${RSH(S.h)}</g>` + v4Yoke(t, z, S.ss, { press: S.press }) + v4Thud(T, K.tK + 0.1, sp[0], sp[1], S.ss) + v4Thud(T, K.end + 0.2, sp[0], sp[1], S.ss) + rsTable(480, 1440, VH.TY, VH.GY) + `<rect x="1090" y="${VH.TY - 10}" width="116" height="10" rx="3" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
  return rsDefs() + rsClipY('rsT', VH.TY) + v4Plate('rsinterview', cam, Object.assign({ mirror: 1 }, o)) + qCam(cam, w) + v4Sun(false, 0.3);
}
function vhInset(T, K) { // 지원서의 그 줄에 연필이 밑줄을 긋는다
  const k = Math.min((T - 0.25) / 0.35, (K.tG - 0.5 - T) / 0.25); if (k <= 0) return '';
  const uk = rsK(K.tK, K.tK + 0.9, T), px = -300 + 540 * uk, py = 64 + 8 * Math.sin(uk * Math.PI);
  let g = `<g transform="translate(1060 288) scale(${rsSc(k)})"><rect x="-374" y="-142" width="760" height="300" rx="20" fill="${INK}" opacity=".2"/><rect x="-380" y="-150" width="760" height="300" rx="20" fill="#fff" stroke="${INK}" stroke-width="7"/>` + fT(-344, -94, '입사지원서 · 경력', 30, '#5B6478', { anchor: 'start', w: 700 }) + `<rect x="-344" y="-64" width="520" height="16" rx="8" fill="#D9DEE8"/><rect x="-344" y="100" width="420" height="16" rx="8" fill="#D9DEE8"/>` + rsStrip(-34, 12, 0.92, {});
  if (uk > 0) g += `<path d="M-300 64 Q-30 78 ${f1(px)} ${f1(py)}" fill="none" stroke="#4A4A4A" stroke-width="6" stroke-linecap="round"/>` + (uk < 1 ? `<g transform="translate(${f1(px)} ${f1(py)}) rotate(38)"><rect x="-7" y="-150" width="14" height="128" rx="5" fill="#F5C451" stroke="${INK}" stroke-width="4"/><path d="M-7 -22 L0 0 L7 -22 Z" fill="#E9D9B0" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>` : '');
  return g + `</g>`;
}
function v4hrScene(t, lt, a, T) {
  const S = vhState(t, T), K = S.K, rib = () => rsRib(T < 0.6 ? (T + 0.15) / 0.4 : 1, RSW1, '그 주 금요일 · 인사팀', 2);
  const shot = (cf, o = {}, ex) => (TT, s, e) => vhShot(t, TT, S, cf(TT, s, e), o) + (ex ? ex(TT, s, e) : '');
  return v4Shots(T, [
    [-9, (TT) => vhShot(t, TT, S, qLerpCam(TT / 5.5, [960, 598, 1.14], [960, 600, 1.2])) + vhInset(TT, K) + rib()],                       // 마주 앉은 두 사람, 지원서의 그 줄
    [K.tG - 0.2, shot(v4L([1230, 640, 1.58], [1220, 638, 1.66]), { depth: 0.85 })],                                                     // "같이 일한 분 연락처도 괜찮아요"
    [K.c2 - 0.75, shot((TT, s, e) => [700, 634, lerp(1.9, 2.0, rsK(s, e, TT))], { depth: 0.7, blur: 1 })],                               // "…없습니다."
    [K.c3 - 0.15, shot(v4L([1220, 636, 1.74], [1220, 636, 1.8]), { depth: 0.85 })],                                                     // "하나도요?"
    [K.c4 - 0.2, shot((TT, s, e) => [700, 632 + v4Jolt(TT, K.end + 0.2, 7), lerp(1.95, 2.16, easeInOut(rsK(s, e, TT)))], { depth: 0.7, blur: 1 })],   // "네. 제가… 지어냈습니다."
    [K.end + 0.7, shot(v4L([960, 600, 1.2], [960, 598, 1.14]), {}, () => rib())],                                                       // 담당자가 천천히 끄덕인다
  ]);
}
/* ---------- c5: 사원증 반납. 사원증은 떨어지는데, 한 줄은 손끝에서 떨어지지 않는다 ---------- */
function v4returnScene(t, lt, a) {
  const bx = 800, by = 640, dn = easeInOut(rsK(0.3, 1.25, lt)), drop = easeIn(rsK(1.35, 1.7, lt)), cx = bx + 6, cy0 = lerp(300, 520, dn), cy = cy0 + 136 * drop, rel = easeOut(rsK(1.5, 2.2, lt));
  const su = lt - 2.35, shk = su > 0 && su < 1.0 ? Math.sin(su * 27) * 18 * Math.sin(Math.PI * su) : 0;
  let w = `<rect x="-300" y="880" width="2600" height="500" fill="#C89B6A"/><rect x="-300" y="880" width="2600" height="28" fill="#DDB88A" stroke="${INK}" stroke-width="6"/>`;
  w += `<path d="M${bx - 250} ${by} L${bx - 206} ${by - 50} L${bx + 206} ${by - 50} L${bx + 250} ${by} Z" fill="#AEB8C8" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  const hx = cx + 96 + 250 * rel + shk, hy = cy0 - 190 - 24 * rel - Math.abs(shk) * 0.5, sway = Math.sin(lt * 4) * 3 * (1 - drop), stuck = lt >= 1.35;
  if (lt < 1.37) w += rsCord([hx - 30, hy + 16], [hx + 6, hy + 20], [cx, cy + 4]);
  w += rsBadge(cx, cy, 1.7, { rot: sway, strip: !stuck });
  w += `<rect x="${bx - 250}" y="${by}" width="500" height="244" rx="10" fill="#E3E8F1" stroke="${INK}" stroke-width="8"/><rect x="${bx - 176}" y="${by + 74}" width="352" height="100" rx="12" fill="#fff" stroke="${INK}" stroke-width="5"/>` + fT(bx, by + 142, '사원증 반납', 50, NAVY);
  w += rsSleeve(hx + 20, hy - 10, hx + 520, hy - 520) + hand(hx, hy, 2.4);
  if (stuck) { const gl = lt > 3.35 ? 0.5 + 0.5 * Math.sin((lt - 3.35) * 7) : 0, sx = hx - 112, sy = hy + 80, rot = -12 + shk * 0.9;
    w += rsStrip(sx, sy, 0.5, { rot }) + (gl ? `<g transform="translate(${f1(sx)} ${f1(sy)}) rotate(${f1(rot)})"><rect x="-166" y="-30" width="332" height="60" rx="12" fill="none" stroke="${RS.YL}" stroke-width="9" opacity="${rsOp(gl)}"/></g>` : '');
    if (Math.abs(shk) > 3) for (let i = 0; i < 3; i++) w += `<path d="M${f1(hx - 150 - i * 30)} ${f1(hy - 60 + i * 44)} q-18 10 0 26" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity=".55"/><path d="M${f1(hx + 96 + i * 26)} ${f1(hy - 20 + i * 40)} q18 10 0 26" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity=".55"/>`; }
  const cam0 = [960, 560, 1.15];
  return rsDefs() + `<g filter="url(#rsBlur)">${qdPlate('rsoffice', cam0, 1.0)}</g>` + fFull('#F4EBD6', 0.3) + rsZoom(w, lerp(1.15, 1.26, easeInOut(rsK(0, 3.8, lt))), 900, 420) + rsRib(lt / 0.4, RSW1, '수습 석 달이 끝나는 날', 2) + v4Cut(lt, 0);
}
/* ---------- c6~c8: 그 뒤의 면접. 한 줄이 또 입을 덮는다 → 지울 수 없는 한 줄 → 이 세계는 여기까지 ---------- */
function viState(t, T) {
  const F = 'c6', tm = id => v4T(id, F), W = (id, k, fb) => v4W(id, F, k, fb);
  const tS = W('c6', '석', 0.93), tN = W('c6', '나오', 1.99), tI = W('c6', '이유', 3.25), c7 = tm('c7'), c8 = tm('c8'), tTape = c7 + 1.0, tJ = W('c8', '지어낸', 0.89), tV = W('c8', '값으로', 1.43), tG = W('c8', '지울', 1.93), tE = W('c8', '세계는', 6.61) - 0.45;
  const K = { tS, tN, tI, c7, c8, tTape, tJ, tV, tG, tE }, sit = rsSitY(VH.TY);
  const READ = v4Pose(V4SIT(), { armL: [[148, 285], [116, 334], [138, 352]], hL: [144, 358] }), DOWN = v4Pose(V4SIT(), { armL: [[148, 285], [124, 340], [152, 372]], hL: [158, 380] });
  const ig = actGaze([[-1, -0.3, 0.6], [tN - 0.1, -0.85, 0], [tTape + 1.3, -0.3, 0.65]], T);
  const i = { x: VH.HX, y: sit, s: 1, t, pose: actPose([[0, READ], [tI - 0.2, DOWN, { ant: 0.08 }]], T), ex: v4On('c6', t) ? v4Say('_vii', 'rs평온', 'c6', t) : exprAt([[-1, 'rs평온'], [tS, 'v4물음'], [tN + 0.4, 'rs평온']], T), look: ig.look, turn: ig.turn, tilt: ig.tilt + actTrack([[0, 0], [tI + 0.2, -5, { f: 2.6, z: 0.55 }], [c7 + 1.6, 0, { f: 2, z: 0.8 }]], T), headDy: v4Bob('c6', t).headDy, handL: 'grip', holdL: V4_PAPER(false), seed: 71 };
  const sk = clamp(actTrack([[0, 0], [tTape, 1, { f: 2.6, z: 0.75, ant: 0.14, amt: 0.05 }]], T), 0, 1), gasp = clamp((T - (c7 + 0.45)) / 0.3, 0, 1) * (1 - sk);
  const zg = actGaze([[-1, 0.85, 0], [tS + 0.1, 0.3, 0.6], [tN + 0.3, 0.85, 0], [tTape + 0.8, 0.2, 0.75]], T, { turn: 0.7 });
  const zh = actMul(actHit(T, tS + 0.1, 0.05, 5, 7), actHit(T, tTape + 0.5, 0.05, 6, 8));
  const z = { x: VH.ZX, y: sit, s: 1, t, pose: rsSitPose(), ex: sk > 0.6 ? fEx('z충격') : gasp > 0 ? v4Gasp('_vig', gasp) : exprAt([[-1, 'rs담담'], [tS + 0.1, 'z당황'], [tN + 0.6, 'v4긴장']], T), look: zg.look, turn: zg.turn, tilt: zg.tilt + 3, headDy: actTrack([[0, 3], [tTape + 0.9, 12, { f: 1.8, z: 0.8, ant: 0 }]], T), sy: zh.sy * 0.95 * actInhale(T, c7 + 0.75, 0.35, 0.04), sx: zh.sx, seed: 3, noBlink: gasp > 0 && sk < 1 };
  return { K, z, i, sk };
}
function viShot(t, T, S, cam, o = {}) {
  const K = S.K, z = S.z, mp = [z.x, z.y + (238 - 560) * (z.sy || 1)]; let fx = '';
  if (S.sk > 0.85 && T < K.tTape + 0.9) { const u = T - K.tTape - 0.4; for (let j = 0; j < 6; j++) { const an = j * Math.PI / 3 + 0.3; fx += `<line x1="${f1(mp[0] + Math.cos(an) * 150)}" y1="${f1(mp[1] + Math.sin(an) * 60)}" x2="${f1(mp[0] + Math.cos(an) * (176 + 40 * u))}" y2="${f1(mp[1] + Math.sin(an) * (72 + 16 * u))}" stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity="${rsOp(1 - Math.abs(u) / 0.5)}"/>`; } }
  const w = `<g clip-path="url(#rsT)">${RSZW(z)}${RSI(S.i)}</g>` + v4Yoke(t, z, 0.6, { k: S.sk, press: 0.6 }) + fx + rsTable(480, 1440, VH.TY, VH.GY);
  return rsDefs() + rsClipY('rsT', VH.TY) + v4Plate('rsinterview', cam, o) + qCam(cam, w) + v4Sun(true, 0.3) + (o.cool ? fFull('#24304A', rsOp(o.cool)) : '');
}
function v4itv1Scene(t, lt, a, T) {
  const K0 = viState(t, T).K, fz = T > K0.tE, Tz = fz ? K0.tE : T, S = viState(fz ? t - (T - K0.tE) : t, Tz), K = S.K;
  if (fz) { S.z.still = true; S.z.noBlink = true; S.i.still = true; S.i.noBlink = true; }
  const rib = (q, qk = 1) => rsRib(T < 0.6 ? (T + 0.15) / 0.4 : 1, RSW1, '그 뒤의 면접', q, qk);
  const shot = (cf, o = {}, ex) => (TT, s, e) => viShot(t, Tz, S, cf(TT, s, e), o) + (ex ? ex(TT, s, e) : '');
  return v4Shots(T, [
    [-9, (TT) => viShot(t, TT, S, qLerpCam(TT / 1.2, [960, 598, 1.14], [950, 597, 1.18])) + rib(2)],
    [K.tS - 0.25, shot(v4L([1230, 640, 1.55], [1220, 638, 1.62]), { depth: 0.85 })],                                                    // 면접관이 이력서에서 눈을 든다
    [K.tI - 0.15, shot((TT, s, e) => [700, 634 + v4Jolt(TT, K.tTape + 0.45, 6), lerp(1.8, 2.12, easeInOut(rsK(s, e, TT)))], { depth: 0.7, blur: 1 }, () => fFull('#24304A', rsOp(0.1 * S.sk)))],   // 한 줄이 또 입을 덮는다
    [K.c8 - 0.2, (TT, s) => viShot(t, Tz, S, qLerpCam((TT - s) / 2.2, [960, 600, 1.3], [960, 598, 1.36]), { cool: 0.08 }) + viEq(TT, K) + rib(3, (TT - s - 0.2) / 0.3)],   // 지어낸 한 줄의 값
    [K.tG - 0.15, (TT) => viInsert(t, TT, K)],                                                                                          // 이력서에 생긴, 지워지지 않는 한 줄
    [K.tE - 0.1, (TT) => { const pull = easeInOut(rsK(K.tE, K.tE + 2.6, TT));                                                            // 이 세계는 여기까지
      return viShot(t, Tz, S, [960, 598, lerp(1.36, 1.14, pull)], { cool: 0.08 }) + viEq(TT, K) + rib(3) + fFull('#F7F2E6', rsOp(rsK(K.tE + 1.5, K.tE + 2.9, TT))); }],
  ]);
}
function viEq(T, K) { // 화면 위쪽의 셈: 노란 한 줄 → 회색 한 줄
  const yk = (T - K.tJ) / 0.4, gk = (T - K.tG) / 0.4, ak = rsK(K.tV, K.tV + 0.5, T); let g = '';
  if (yk > 0) g += `<g transform="translate(640 300) scale(${rsSc(yk)})">${rsStrip(0, 0, 0.9, {})}</g>`;
  if (ak > 0) g += `<path d="M928 300 L${f1(928 + 64 * ak)} 300" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>` + (ak > 0.9 ? `<path d="M978 280 L1002 300 L978 320" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>` : '');
  if (gk > 0) g += `<g transform="translate(1290 300) scale(${rsSc(gk)})">${rsStripG(0, 0, 0.9, {})}</g>`;
  return g;
}
function viInsert(t, T, K) { // 이력서에 새로 생긴 한 줄. 지우개로 문질러도 그대로다
  const u = T - K.tG, drop = easeOutBack(rsK(0, 0.3, u)), rub = u > 1.0 && u < 2.95, ph = (u - 1.0) * 7.5, lift = easeIn(rsK(2.6, 2.95, u)), ex = 960 + Math.sin(ph) * 200, ey = 640 + Math.cos(ph * 2) * 8 - 220 * lift;
  let w = rsPaperBg() + `<g transform="translate(960 560)"><rect x="-652" y="-372" width="1320" height="760" rx="26" fill="${INK}" opacity=".16"/><rect x="-660" y="-380" width="1320" height="760" rx="26" fill="#fff" stroke="${INK}" stroke-width="8"/>` + fT(-600, -296, '이력서 · 경력 사항', 52, NAVY, { anchor: 'start' }) + `<line x1="-600" y1="-262" x2="600" y2="-262" stroke="#D5DAE3" stroke-width="4"/>`;
  w += `<rect x="-600" y="-222" width="1200" height="120" rx="14" fill="#fff" stroke="#B8BECB" stroke-width="5"/>` + fT(-560, -146, '물류창고 아르바이트', 48, NAVY, { anchor: 'start' }) + fT(560, -146, '3개월', 44, '#3A4252', { anchor: 'end' }) + `<rect x="-600" y="180" width="1200" height="120" rx="14" fill="#F9FAFC" stroke="#C9CED8" stroke-width="5" stroke-dasharray="18 14"/></g>`;
  if (u > 0) w += `<g transform="translate(960 ${f1(640 - 70 * (1 - drop))}) scale(${f1(lerp(2.3, 1.9, drop) * 100) / 100})">${rsStripG(0, 0, 1, {})}</g>` + v4Thud(T, K.tG + 0.22, 960, 640, 1.3);
  if (rub) { for (let i = 0; i < 7; i++) { const a0 = rsK(i * 0.2, i * 0.2 + 0.5, u - 1.0); if (a0 > 0) w += `<rect x="${f1(700 + i * 86 + Math.sin(i * 3.1) * 20)}" y="${f1(722 + 26 * a0 + (i % 3) * 9)}" width="16" height="8" rx="4" fill="#F2A7B5" stroke="${INK}" stroke-width="2" transform="rotate(${i * 37} ${f1(708 + i * 86)} ${f1(726 + 26 * a0)})"/>`; }
    w += rsSleeve(ex + 60, ey - 210, ex + 520, ey - 760) + `<g transform="translate(${f1(ex)} ${f1(ey - 66)}) rotate(${f1(-16 + 7 * Math.sin(ph))})"><rect x="-48" y="-96" width="96" height="156" rx="14" fill="#F2A7B5" stroke="${INK}" stroke-width="7"/><rect x="-48" y="-96" width="96" height="78" rx="14" fill="#7FA6E8" stroke="${INK}" stroke-width="7"/></g>` + hand(ex + 44, ey - 180, 2.3); }
  return rsDefs() + qCam(qLerpCam(u / 4.4, [960, 560, 1.0], [960, 590, 1.1]), w) + `<g transform="translate(330 150)">${label(0, 0, '그 뒤의 이력서', { size: 44, bg: '#fff' })}</g>`;
}
