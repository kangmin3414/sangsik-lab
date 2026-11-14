/* 자소서 편 v4 — 3막(d2~d14: 그 줄을 지운 세계)과 4막(e1~e9: 7년 뒤). 되감기·서류 심사 화면·논어는 ../long의 장면을 그대로 쓴다. */
['v4erase', 'v4chat2', 'v4fourth', 'v4itv2', 'v4small', 'v4seven', 'v4seven2'].forEach(k => CAMS[k] = 'fixed');
const V4_PLAIN = '석 달 동안 박스를 셌습니다. 숫자는 끝까지 맞췄습니다.';
const RSY = rsChar('#7FD8B0', { longHair: '#3A2A22', hair: '#3A2A22' });   // 7년 뒤의 신입
const RSS2 = RSX('#C9B8E8', '#8A8A90');                                     // 작은 회사의 선배
const v4OK = k => k <= 0 ? '' : `<g transform="translate(902 56) scale(${rsSc(k)})"><circle r="34" fill="#3CC79A" stroke="${INK}" stroke-width="6"/>${rsCheck(0, 0, 1.5, '#fff', 8)}</g>`;   // 달력 띠 옆의 '답한 질문' 표시
/* ---------- d2~d3: "아니다. 박스 센 얘기나 쓰자." → 지우고 다시 써서 낸다 → 불합격 세 통 ---------- */
function v4eraseScene(t, lt, a) {
  if (a.ph === 0) { const tB = rsW(a, '박스', 1.15), tS = rsW(a, '쓰자', 1.97), g = 1 - easeInOut(rsK(0.1, 0.6, lt));
    const turn = actTrack([[0, 0], [0.12, -0.5, { f: 4, z: 0.6, ant: 0 }], [0.42, 0.5, { f: 4, z: 0.6, ant: 0 }], [0.74, 0, { f: 3.4, z: 0.7, ant: 0 }]], lt);   // 고개를 젓는다
    const gz = actGaze([[0, 0, 0.4], [tB - 0.2, 0, -0.7], [tS - 0.1, 0, 0.4]], lt, { turn: 0 }), sw = rsK(tS, tS + 0.4, lt);
    const strip = (sw < 1 ? `<g opacity="${rsOp(1 - sw)}">${rsStripAir(1, { dbl: g })}</g>` : '') + (sw > 0 ? rsStrip(960, 322, 0.7, { empty: true, op: 0.9 * sw }) : '');   // 머리 위의 한 줄이 빈칸이 된다
    return rsFaceLate(t, lt, { cam: qLerpCam(lt / 2.6, [960, 588, 1.56], [960, 592, 1.5]), z: { ex: v4Say('_v4e', lt < 0.8 ? 'v4눈감음' : lt < tS - 0.15 ? 'rs담담' : 'z히죽', 'd2', t), look: gz.look, turn, tilt: turn * 3, headDy: v4Bob('d2', t).headDy, still: lt < 0.1 }, ghost: g, ghostR: 1 - rsK(0.1, 0.45, lt), driftR: 90 * easeIn(rsK(0.1, 0.6, lt)), extra: strip }) + fFull('#fff', rsOp((1 - rsK(0, 0.3, lt)) * 0.9));
  }
  if (lt < 3.05) { const del = rsK(0.1, 0.75, lt), typ = rsK(0.85, 1.75, lt), pr = rsK(1.9, 2.05, lt) * (1 - rsK(2.17, 2.35, lt)), dn = (lt - 2.3) / 0.3;
    const body = rsEssay(t, { shown: 999, yl: del >= 1 ? -1 : Math.ceil(RS.LINE.length * (1 - del)), plain: typ > 0 ? V4_PLAIN.slice(0, Math.floor(V4_PLAIN.length * typ)) : '', cursor: dn <= 0 }) + rsDoneCard(dn, '오전 2:58 접수되었습니다');
    return rsDefs() + rsZoom(rsLaptop(t, rsForm({ tab: 3, mins: 2, clock: '오전 2:58', press: pr, body })), lerp(1.1, 1.16, easeInOut(rsK(0, 3, lt))), 900, 520) + rsRib((lt - 2.45) / 0.4, RSW2, '지원서를 낸 새벽') + v4Cut(lt, 0) + v4Cut(lt, 3.05); }
  const u = lt - 3.05, mk = (from, time, tt) => ({ from, subj: '[전형 결과] 불합격 안내', time, k: (u - tt) / 0.35, hot: '#EEF1F6' });
  const rows = [mk('채용 운영팀', '오전 11:20', 1.15), mk('인재채용팀', '오전 10:41', 0.7), mk('채용 담당', '오전 10:02', 0.25)].concat(RS_OLD);
  const droop = easeInOut(rsK(1.55, 2.3, u)), zk = easeInOut(rsK(0.2, 1.8, u));
  return rsDefs() + rsZoom(rsLaptop(t, rsMailUI(t, rows, { clock: '오전 11:21' }), { hy: 46 * droop }), lerp(1.0, 1.16, zk), lerp(900, 1000, zk), lerp(480, 280, zk)) + rsRib(u / 0.4, RSW2, '한 달 뒤') + v4Cut(lt, 3.05);
}
/* ---------- d4~d5: "거 봐. 내가 부풀리랬지." → "…그러게. 그냥 둘걸 그랬나." ---------- */
function v4chat2Scene(t, lt, a) {
  if (a.ph === 0) { const t2 = rsW(a, '내가', 1.09);
    let c = rsChatHead('민재', '') + fT(0, -306, '오후 11:46', 22, '#8B93A3', { w: 700 }) + rsBub(232, -250, '세 군데 다 떨어졌다', { mine: true });
    c += rsWho(-150, '민재', '#F5D7A8', 1) + rsBub(-172, -150, '거 봐', { k: (lt - 0.3) / 0.22 }) + rsBub(-172, -70, '내가 부풀리랬지', { k: (lt - t2) / 0.22 });
    return rsDefs() + rsZoom(rsPhone(t, lt, c, { buzz: 1 - rsK(0.3, 0.9, lt) }), lerp(1.0, 1.06, easeInOut(rsK(0, 3, lt))), 960, 500) + rsRib(lt / 0.4, RSW2, '한 달 뒤 · 밤') + v4Cut(lt, 0); }
  const tG = rsW(a, '그냥', 0.99), tD = rsW(a, '둘', 2.19), ex = rsK(tD + 0.9, tD + 1.6, lt), gz = actGaze([[0, 0, 0.6], [tG - 0.1, 0, -0.7], [tD + 0.9, 0, 0.6]], lt, { turn: 0 });
  const pose = Object.assign({}, P['턱괴기'], { armL: rsArmType.armL, hL: rsArmType.hL }), gh = Math.sin(Math.PI * rsK(tD - 0.1, tD + 0.9, lt));   // 빈칸에 그 줄이 잠깐 어른거린다
  const strip = rsStrip(960, 322, 0.7, { empty: true, op: 0.9 }) + (gh > 0 ? rsStrip(960, 322, 0.7, { op: 0.4 * gh }) : '');
  return rsFaceShot(t, qLerpCam(lt / 3.6, [960, 606, 1.38], [960, 602, 1.46]), { clock: '11:48', z: { pose, ex: v4Say('_v4e', 'v4긴장', 'd5', t), look: gz.look, tilt: 5 + gz.tilt, headDy: v4Bob('d5', t).headDy + 6 * ex, sy: 0.975 - 0.02 * Math.sin(Math.PI * ex) }, extra: strip }) + rsRib(1, RSW2, '한 달 뒤 · 밤') + v4Cut(lt, 0);
}
/* ---------- d6: 네 번째 지원서(rsfourth의 그림, 때만 이 줄에 맞춘다) ---------- */
function v4fourthScene(t, lt, a) {
  const W = (k, fb) => rsWd(a._words, k, fb), D = rsL('d6').t1 - rsL('d6').t0;
  const syn = [['네', 0.3], ['재고', W('제로는', 1.73)], ['밤새', W('창고', 3.21)], ['그대로', D + 0.9]].map(([w, x]) => ({ w, t: x - 0.15 }));
  return rsfourthScene(t, lt, { _words: syn }) + v4Cut(lt, 0);
}
/* ---------- d7~d11: 네 번째 면접. 해 본 일이라 손이 먼저 움직인다 ---------- */
function vjState(t, T) {
  const F = 'd7', tm = id => v4T(id, F), W = (id, k, fb) => v4W(id, F, k, fb);
  const tB = W('d7', '밤새', 0.75), tSe = W('d7', '세셨', 1.79), tQ = W('d7', '숫자', 3.23), tW = W('d7', '왜', 4.07), d8 = tm('d8'), tKa = W('d8', '칸에', 1.81), tSs = W('d8', '쌓아', 2.09), tDw = W('d8', '뒤로', 3.55), tNal = W('d8', '날짜', 4.61), tBu = W('d8', '붙였', 5.09), d9 = tm('d9'), d10 = tm('d10'), tJe = W('d10', '제가', 1.63), tSg = W('d10', '싫어', 3.73), d11 = tm('d11'), end10 = d10 + rsL('d10').t1 - rsL('d10').t0;
  const K = { tB, tSe, tQ, tW, d8, tKa, tSs, tDw, tNal, tBu, d9, d10, tJe, tSg, d11, end10 }, sit = rsSitY(VH.TY), SIT = V4SIT();
  // --- 면접관: 읽다가 고개를 들고, 궁금해서 묻고, 듣고, 웃는다
  const READ = v4Pose(SIT, { armL: [[148, 285], [116, 334], [138, 352]], hL: [144, 358] }), DOWN = v4Pose(SIT, { armL: [[148, 285], [124, 340], [152, 372]], hL: [158, 380] }), ASK = v4Pose(SIT, { armL: [[148, 285], [106, 302], [76, 290]], hL: [68, 288] }), PTZ = v4Pose(SIT, { armL: [[148, 285], [104, 290], [70, 272]], hL: [62, 268] });
  const jp = actPose([[0, READ], [tSe - 0.2, DOWN, { ant: 0.08 }], [tW - 0.1, ASK, { ant: 0.1 }], [d8 - 0.3, DOWN, { ant: 0, f: 2.4, z: 0.7 }], [d9 - 0.05, PTZ, { ant: 0.1 }], [d10 + 0.3, DOWN, { ant: 0, f: 2.4, z: 0.7 }]], T);
  const ask = T > tW - 0.1 && T < d8 - 0.3, ptz = T > d9 - 0.05 && T < d10 + 0.3, reading = T < tSe - 0.2;
  const jg = actGaze([[-1, -0.3, 0.6], [tSe - 0.15, -0.85, 0], [tBu + 0.9, -0.3, 0.6], [d9 - 0.15, -0.85, 0], [end10 + 0.8, -0.3, 0.65], [end10 + 2.3, -0.85, 0]], T);
  const jex = v4On('d7', t) ? v4Say('_vjj', T < tB ? 'rs평온' : 'z반짝', 'd7', t) : v4On('d9', t) ? v4Say('_vjj', 'z반짝', 'd9', t) : exprAt([[-1, 'rs평온'], [tB, 'z반짝'], [d8 + 0.3, 'z기본'], [tSs + 0.3, 'z반짝'], [tBu + 0.3, 'z빵긋'], [d9 - 0.2, 'z반짝'], [d10 + 0.5, 'z기본'], [tSg + 0.2, 'z빵긋'], [end10 + 2.2, 'z기본']], T);
  const jh = actMul(actHit(T, tSg + 0.25, 0.05, 6, 4), actHit(T, tB + 0.1, 0.025, 5, 9));
  const j = { x: VH.HX + actTrack([[0, 0], [d9 - 0.1, -18, { f: 2.4, z: 0.6, ant: 0.12 }], [d10 + 0.4, 0, { f: 2, z: 0.8 }]], T), y: sit, s: 1, t, pose: jp, ex: jex, look: jg.look, turn: jg.turn, tilt: jg.tilt + actTrack([[0, 0], [tQ + 0.2, -5, { f: 2.6, z: 0.55 }], [d8 - 0.2, 0, { f: 2, z: 0.8 }]], T),
    headDy: v4Bob('d7', t).headDy + v4Bob('d9', t).headDy + actNod(T, tSs + 0.3, 1, 8, 0.34) + actNod(T, tBu + 0.35, 2, 8, 0.3) + actNod(T, end10 + 0.3, 2, 8, 0.32), sy: jh.sy, sx: jh.sx,
    handL: ask ? 'open' : ptz ? 'point' : 'grip', handRotL: ask ? 180 : null, holdL: ask || ptz ? null : reading ? V4_PAPER(false) : V4_PEN, seed: 72 };
  // --- 제로: 듣고, 손으로 그려 가며 설명하고, 멋쩍게 털어놓는다
  const EXR = v4Pose(SIT, { armR: [[252, 285], [296, 318], [322, 276]], hR: [328, 268] }), BOTH = v4Pose(SIT, { armL: [[148, 285], [112, 318], [150, 300]], hL: [158, 292], armR: [[252, 285], [288, 318], [250, 300]], hR: [242, 292] }), PTU = v4Pose(SIT, { armR: [[252, 285], [300, 290], [316, 236]], hR: [320, 226] }), SCR = v4Pose(SIT, { armR: [[252, 285], [306, 246], [272, 150]], hR: [264, 140] });
  const zp = actPose([[0, SIT], [d8 + 0.05, EXR, { ant: 0.1 }], [tKa - 0.15, BOTH, { ant: 0.08 }], [tDw - 0.1, PTU, { ant: 0.1 }], [tBu + 0.5, SIT, { ant: 0, f: 2.4, z: 0.7 }], [tJe - 0.1, SCR, { ant: 0.1 }], [end10 + 0.5, SIT, { ant: 0, f: 2.2, z: 0.7 }]], T);
  const tap = T > tNal && T < tNal + 0.7 ? Math.abs(Math.sin((T - tNal) * 9)) * 10 : 0, tk = v4On('d8', t) ? actTalk(env(t)).hand : 0; zp.hR = [zp.hR[0], zp.hR[1] + tap + tk]; zp.armR[2] = [zp.armR[2][0], zp.armR[2][1] + tap + tk];
  const ptu = T > tDw - 0.1 && T < tBu + 0.5, exr = T > d8 + 0.05 && T < tKa - 0.15;
  const zg = actGaze([[-1, 0.85, 0], [tKa - 0.2, 0.5, 0.5], [tSs + 0.4, 0.85, 0], [tDw - 0.1, 0.6, -0.45], [tNal, 0.85, 0], [d10 + 0.5, 0.3, 0.6], [tJe + 0.2, 0.1, -0.3], [tSg, 0.85, 0]], T, { turn: 0.7 });
  const zex = v4On('d8', t) ? v4Say('_vjz', 'z기본', 'd8', t) : v4On('d10', t) ? v4Say('_vjz', T < tJe - 0.2 ? 'rs평온' : 'z민망', 'd10', t) : exprAt([[-1, 'rs평온'], [tSe, 'z기본'], [tQ + 0.5, 'rs평온'], [d8 - 0.2, 'z기본'], [d9 + 0.4, 'v4물음'], [end10 + 0.3, 'z히죽']], T);
  const shake = actTrack([[0, 0], [d10 + 0.05, -0.35, { f: 4, z: 0.6, ant: 0 }], [d10 + 0.3, 0.35, { f: 4, z: 0.6, ant: 0 }], [d10 + 0.58, 0, { f: 3.4, z: 0.7, ant: 0 }]], T);
  const z = { x: VH.ZX, y: sit, s: 1, t, pose: zp, ex: zex, look: zg.look, turn: zg.turn + shake, tilt: zg.tilt, headDy: v4Bob('d8', t).headDy + v4Bob('d10', t).headDy + actNod(T, tSe + 0.4, 1, 7, 0.34), sy: actInhale(T, d8, 0.3) * actInhale(T, tJe, 0.3) * actHit(T, tSg + 0.3, 0.03, 5, 7).sy,
    handR: ptu ? 'point' : exr ? 'open' : null, handRotR: ptu ? -90 : null, handL: T > tKa - 0.15 && T < tDw - 0.1 ? 'open' : null, seed: 3 };
  return { K, z, j };
}
function vjShot(t, T, S, cam, o = {}) {
  const w = `<g clip-path="url(#rsT)">${RSZW(S.z)}${RSJ(S.j)}</g>` + rsTable(480, 1440, VH.TY, VH.GY) + `<rect x="1090" y="${VH.TY - 10}" width="116" height="10" rx="3" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
  return rsDefs() + rsClipY('rsT', VH.TY) + v4Plate('rsinterview', cam, o) + qCam(cam, w) + v4Sun(true, 0.34);
}
function vjMem(t, T, K) { // 기억 창: 같은 자리에서 입이 막혔던 첫 번째 세계의 제로
  const k = Math.min((T - K.d11 - 0.35) / 0.35, (K.d11 + 2.95 - T) / 0.3); if (k <= 0) return '';
  let g = `<rect x="-250" y="96" width="500" height="70" fill="#D9C7A0"/>` + RSZW({ x: -70, y: 300, s: 0.66, t: 0, pose: '서기', ex: fEx('z충격'), look: [0.6, 0], seed: 3, still: true, noBlink: true }) + rsStrip(-70, 300 + (238 - 560) * 0.66, 0.2, {});
  for (let i = 0; i < 3; i++) g += `<g transform="translate(${70 + i * 66} -40)"><circle r="27" fill="#fff" stroke="${INK}" stroke-width="5"/>${fT(0, 13, '?', 36, RSW1[1])}</g>`;
  return rsMem(k, g, { x: 1540, y: 340 });
}
function v4itv2Scene(t, lt, a, T) {
  const S = vjState(t, T), K = S.K, rib = (ok = 0) => rsRib(T < 0.6 ? (T + 0.15) / 0.4 : 1, RSW2, '네 번째 지원 · 면접') + v4OK(ok);
  const shot = (cf, o = {}, ex) => (TT, s, e) => vjShot(t, TT, S, cf(TT, s, e), o) + (ex ? ex(TT, s, e) : '');
  return v4Shots(T, [
    [-9, (TT) => vjShot(t, TT, S, qLerpCam(TT / 1.6, [960, 598, 1.14], [1000, 598, 1.2])) + rib()],
    [K.tSe - 0.3, shot(v4L([1230, 640, 1.58], [1215, 638, 1.72]), { depth: 0.85 })],                                                    // 면접관이 고개를 든다. "숫자는 왜 안 맞았던 거죠?"
    [K.tW + 1.15, shot(v4L([700, 636, 1.66], [700, 634, 1.74]), { depth: 0.8 })],                                                       // 제로가 입을 뗀다
    [K.tKa - 0.25, shot(v4L([900, 610, 1.16], [880, 612, 1.22]), {}, (TT, s) => rsShelfBubble(TT, s + 0.1, K.tDw - 0.25) + rib())],     // 손으로 그리는 설명(칸과 날짜)
    [K.d9 - 0.2, shot(v4L([1215, 638, 1.66], [1200, 636, 1.74]), { depth: 0.85 })],                                                     // "그건 누가 시킨 거예요?"
    [K.d10 - 0.2, shot((TT, s, e) => [700, 632, lerp(1.86, 2.0, easeInOut(rsK(s, e, TT)))], { depth: 0.7, blur: 1 })],                   // "아니요. 제가… 또 세기 싫어서요."
    [K.tSg - 0.1, shot(v4L([960, 600, 1.2], [960, 598, 1.14]), {}, (TT) => rib((TT - K.end10 - 0.5) / 0.3) + vjMem(t, TT, K))],          // 면접관이 웃는다 → 기억 창
  ]);
}
/* ---------- d12~d14: 크지 않은 회사. "이건 제가 잘 모르겠습니다." "이리 와 봐요. 같이 봅시다." ---------- */
function vsState(t, T) {
  const F = 'd12', tm = id => v4T(id, F), W = (id, k, fb) => v4W(id, F, k, fb), GY = RSS.GY, sit = rsSitY(RSS.DY), SIT = V4SIT();
  const tW = W('d12', '월급', 2.83), tI = W('d12', '이름', 4.17), d13 = tm('d13'), tMo = W('d13', '모르', 2.27), d14 = tm('d14'), tGa = W('d14', '같이', 0.95), tUp = d14 + 0.6, tWalk = tUp + 0.35, tArr = tWalk + 1.0;
  const K = { tW, tI, d13, tMo, d14, tGa, tUp, tWalk, tArr };
  // --- 제로: 막힌다 → 망설인다 → 손을 들고 묻는다 → 일어나 건너간다
  const stand = clamp(actTrack([[0, 0], [tUp, 1, { f: 2.4, z: 0.6, ant: 0.14, amt: 0.12 }]], T), -0.2, 1.15), wk = easeInOut(rsK(tWalk, tArr, T)), zx = lerp(680, 1112, wk), walking = wk > 0 && wk < 1;
  const SCR = v4Pose(SIT, { armR: [[252, 285], [306, 246], [272, 150]], hR: [264, 140] }), UPH = v4Pose(SIT, { armR: [[252, 285], [300, 250], [318, 196]], hR: [322, 186] });
  let zp = actPose([[0, SIT], [tW + 0.2, SCR, { ant: 0.1 }], [tI + 0.2, SIT, { ant: 0, f: 2.4, z: 0.7 }], [d13 - 0.12, UPH, { ant: 0.12, z: 0.45 }], [tMo + 0.7, SIT, { ant: 0, f: 2.2, z: 0.7 }], [tUp, P['서기'], { ant: 0, f: 2.4, z: 0.7 }]], T);
  if (walking) zp = walkPose(zx * 0.045, 0.6);
  const zg = actGaze([[-1, 0, 0.6], [tW, -0.3, 0.7], [tI, 0.8, 0], [tI + 0.7, 0, 0.6], [d13 - 0.2, 0.85, -0.05], [tArr - 0.1, 0.7, 0.5]], T, { turn: 0.7 });
  const zex = v4On('d13', t) ? v4Say('_vsz', T < tMo ? 'rs평온' : 'z민망', 'd13', t) : exprAt([[-1, 'rs평온'], [tW, 'v4긴장'], [d13 - 0.2, 'rs평온'], [tMo + 0.9, 'z민망'], [d14 + 0.35, 'z기본'], [tArr, 'z반짝']], T);
  const z = { x: zx, y: lerp(sit, GY - 22, stand), s: 1, t, pose: zp, ex: zex, look: zg.look, turn: zg.turn, tilt: zg.tilt + 5 * rsK(tArr - 0.2, tArr + 0.3, T), headDy: v4Bob('d13', t).headDy + actNod(T, d14 + 0.5, 1, 8, 0.3), sy: actInhale(T, d13, 0.3), handR: T > d13 - 0.12 && T < tMo + 0.7 ? 'open' : null, handRotR: -90, seed: 3 };
  // --- 선배: 일하다가 돌아보고, 손짓으로 부른다
  const BK = v4Pose(SIT, { armL: [[148, 285], [104, 262], [84, 216]], hL: [80, 206] }), sp = actPose([[0, SIT], [d14 - 0.05, BK, { ant: 0.12, z: 0.45 }], [tGa + 0.7, SIT, { ant: 0, f: 2.2, z: 0.7 }]], T), bk = T > d14 - 0.05 && T < tGa + 0.7;
  if (bk) { const wv = Math.sin((T - d14) * 11) * 9; sp.hL = [sp.hL[0] + wv, sp.hL[1]]; sp.armL[2] = [sp.armL[2][0] + wv, sp.armL[2][1]]; }
  const sg = actGaze([[-1, 0, 0.6], [d13 + 0.35, -0.85, 0], [tArr - 0.2, -0.2, 0.6]], T);
  const s = { x: 1340, y: sit, s: 1, t, pose: sp, ex: v4On('d14', t) ? v4Say('_vss', 'z빵긋', 'd14', t) : exprAt([[-1, 'rs평온'], [d13 + 0.4, 'z기본'], [d14 - 0.2, 'z빵긋'], [tArr, 'z기본']], T), look: sg.look, turn: sg.turn, tilt: sg.tilt + actTrack([[0, 0], [d14, -5, { f: 2.6, z: 0.55 }], [tArr, 0, { f: 2, z: 0.8 }]], T), headDy: v4Bob('d14', t).headDy + actNod(T, tMo + 0.5, 1, 7, 0.34), handL: bk ? 'open' : null, handRotL: -90, seed: 81 };
  return { K, z, s };
}
function vsShot(t, T, S, cam, o = {}) {
  const GY = RSS.GY, DY = RSS.DY;
  const w = RSS2(S.s) + RSZW(S.z) + rsTable(430, 930, DY, GY) + rsLidAt(680, DY) + rsTable(1090, 1590, DY, GY) + rsLidAt(1340, DY) + `<rect x="840" y="${DY - 40}" width="34" height="40" rx="6" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="560" y="${DY - 10}" width="80" height="10" rx="3" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
  return rsDefs() + v4Plate('rssmall', cam, o) + qCam(cam, w) + v4Sun(true, 0.34);
}
function v4smallScene(t, lt, a, T) {
  const S = vsState(t, T), K = S.K, rib = () => rsRib(T < 0.6 ? (T + 0.15) / 0.4 : 1, RSW2, '입사 · 크지 않은 회사');
  const shot = (cf, o = {}, ex) => (TT, s, e) => vsShot(t, TT, S, cf(TT, s, e), o) + (ex ? ex(TT, s, e) : '');
  return v4Shots(T, [
    [-9, (TT) => vsShot(t, TT, S, qLerpCam(TT / K.tW, [960, 556, 1.0], [960, 560, 1.06])) + rib()],
    [K.tW - 0.1, shot(v4L([700, 626, 1.5], [705, 624, 1.58]), { depth: 0.85 })],                                                        // 막혔다. 옆자리를 흘끗 본다
    [K.tI + 0.95, shot(v4L([1000, 600, 1.2], [1010, 600, 1.24]), {}, () => rib())],                                                     // 손을 든다. "선배님,"
    [K.tMo - 0.2, shot(v4L([705, 624, 1.66], [705, 622, 1.72]), { depth: 0.8 })],                                                       // "잘 모르겠습니다."
    [K.d14 - 0.15, shot(v4L([1335, 626, 1.52], [1330, 624, 1.58]), { depth: 0.85 })],                                                   // "어, 이리 와 봐요."
    [K.tUp + 0.1, shot(v4L([1010, 600, 1.16], [1160, 606, 1.3]), {}, () => rib())],                                                     // 건너가서 같이 본다
  ]);
}
/* ---------- e1~e2, e4~e5: 7년 뒤. 신입이 가져온 지원서 ---------- */
const VN = { ZX: 1340, JX: 1010 };
function vnChars(t, T, o) { // 두 사람의 그리기 옵션. o: { z, j }에 덮어쓴다
  const sit = rsSitY(RSS.DY);
  return { z: Object.assign({ x: VN.ZX, y: sit, s: 1, t, pose: V4SIT(), tie: '#2E8B6F', ex: fEx('rs평온'), look: [0, 0.6], seed: 3 }, o.z), j: Object.assign({ x: VN.JX, y: RSS.GY, s: 1, t, pose: P['서기'], ex: fEx('z기본'), look: [0.85, -0.05], seed: 91 }, o.j) };
}
function vnShot(t, C, cam, o = {}) {
  const GY = RSS.GY, DY = RSS.DY;
  let w = RSZW(C.z) + rsTable(430, 930, DY, GY) + rsLidAt(680, DY) + rsTable(1090, 1590, DY, GY) + rsLidAt(1340, DY);
  w += `<path d="M1118 ${DY} L1136 ${DY - 52} L1268 ${DY - 52} L1286 ${DY} Z" fill="#3B2F2A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` + fT(1202, DY - 15, '과장 제로', 28, '#F5D98A');
  w += `<g transform="translate(1508 ${DY})">` + [0, 1, 2, 3, 4].map(i => `<rect x="${-56 + (i % 2) * 6}" y="${-12 - i * 9}" width="112" height="11" rx="2" fill="#fff" stroke="${INK}" stroke-width="4"/>`).join('') + `</g>`;
  w += qShadow(C.j.x, GY, 88, 0.5) + RSY(C.j);
  return rsDefs() + v4Plate('rssmall', cam, o) + qCam(cam, w) + v4Sun(true, 0.34);
}
function v4sevenScene(t, lt, a, T) {
  const F = 'e1', W = (k, fb) => v4W('e2', F, k, fb), e2 = v4T('e2', F), tI = W('이분', 0.87), tD = W('대단', 1.59), tP = W('프로젝트', 2.81), tM = W('매출', 4.05), t30 = W('30', 4.81);
  const jx = lerp(-140, VN.JX, easeOut(rsK(0.5, 1.8, T))), walking = T > 0.5 && T < 1.75;
  const CARRY = v4Pose(P['서기'], { armR: [[252, 285], [282, 330], [250, 352]], hR: [242, 354] }), SHOW = v4Pose(P['서기'], { armR: [[252, 285], [304, 292], [330, 250]], hR: [336, 240] }), WOW = v4Pose(SHOW, { armL: [[148, 285], [112, 300], [124, 252]], hL: [128, 242] });
  let jp = actPose([[0, CARRY], [e2 - 0.05, SHOW, { ant: 0.12, z: 0.45 }], [t30 - 0.1, WOW, { ant: 0.1, z: 0.45 }]], T); if (walking) jp = Object.assign({}, walkPose(jx * 0.045, 0.75), { armR: CARRY.armR, hR: CARRY.hR });
  const jg = actGaze([[-1, 0.6, 0], [1.9, 0.85, -0.05], [tI, 0.6, 0.3], [tD + 0.3, 0.85, -0.05], [tP, 0.6, 0.3], [t30 + 0.5, 0.85, -0.05]], T), jh = actMul(actHit(T, e2 + 0.05, 0.05, 5, 7), actHit(T, t30 + 0.2, 0.05, 5, 7));
  const zg = actGaze([[-1, 0, 0.6], [1.9, -0.85, -0.05], [tI, -0.6, 0.2], [tD + 0.4, -0.85, -0.05], [tP + 0.1, -0.6, 0.2], [t30 + 1.1, -0.2, 0.6]], T, { turn: 0.7 });
  const C = vnChars(t, T, { j: { x: jx, pose: jp, ex: v4Say('_vnj', T < tD ? 'z기본' : 'z반짝', 'e2', t), look: jg.look, turn: jg.turn, tilt: jg.tilt, headDy: v4Bob('e2', t).headDy, sy: jh.sy, sx: jh.sx, handR: 'grip', holdR: V4_PAPER(true), handL: T > t30 - 0.1 ? 'fist' : null },
    z: { ex: exprAt([[-1, 'rs평온'], [2.0, 'z기본'], [tP + 0.25, 'v4긴장'], [t30 + 1.0, 'rs평온']], T), look: zg.look, turn: zg.turn, tilt: zg.tilt, headDy: actNod(T, e2 + 0.6, 1, 7, 0.34), sy: actHit(T, t30 + 0.2, 0.04, 5, 8).sy } });
  const rib = () => rsRib(T < 0.6 ? (T + 0.15) / 0.4 : 1, RSW2, '7년 뒤'), shot = (cf, o = {}, ex) => (TT, s, e) => vnShot(t, C, cf(TT, s, e), o) + (ex ? ex(TT, s, e) : '');
  const badge = (() => { const k = Math.min((T - 0.5) / 0.3, (2.9 - T) / 0.25); return k <= 0 ? '' : `<g transform="translate(1660 300) scale(${rsSc(k)})"><circle r="170" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-40 -170 L0 -96 L40 -170" fill="none" stroke="#2E8B6F" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>${rsBadge(0, -100, 1.9, { title: '과장', col: '#2E8B6F' })}</g>`; })();
  return v4Shots(T, [
    [-9, (TT) => vnShot(t, C, qLerpCam(TT / 3.4, [1040, 578, 1.1], [1100, 586, 1.18])) + badge + rib()],
    [e2 - 0.15, shot(v4L([1000, 640, 1.5], [1010, 638, 1.58]), { depth: 0.85 })],                                                       // 신입이 지원서를 내민다
    [tP - 0.25, shot((TT, s, e) => [1420, 640, lerp(1.95, 2.18, easeInOut(rsK(s, e, TT)))], { depth: 0.7, blur: 1 })],                   // '프로젝트 리드'에 과장 제로의 눈이 멎는다
    [t30 + 0.9, shot(v4L([1180, 620, 1.36], [1180, 620, 1.4]), {}, () => rib())],
  ]);
}
function v4seven2Scene(t, lt, a, T) {
  const e5 = v4T('e5', 'e4'), up = T > e5 - 0.35;
  const STOP = v4Pose(V4SIT(), { armL: [[148, 285], [100, 282], [84, 238]], hL: [80, 228] }), CARRY = v4Pose(P['서기'], { armR: [[252, 285], [282, 330], [250, 352]], hR: [242, 354] });
  const zg = actGaze([[-1, -0.2, 0.6], [e5 + 1.1, -0.1, 0.35]], T, { turn: 0.7 });
  const C = vnChars(t, T, { j: { pose: CARRY, ex: v4On('e4', t) ? v4Say('_vnj', 'z기본', 'e4', t) : exprAt([[-1, 'z기본'], [e5 + 0.2, 'v4물음']], T), tilt: actTrack([[0, 5], [e5 + 0.2, -3, { f: 2.6, z: 0.55 }]], T), headDy: v4Bob('e4', t).headDy, handR: 'grip', holdR: V4_PAPER(true) },
    z: { pose: actPose([[0, V4SIT()], [e5 - 0.35, STOP, { ant: 0.1, z: 0.5 }], [e5 + 1.5, V4SIT(), { ant: 0, f: 2, z: 0.8 }]], T), ex: v4Say('_vnz', 'rs담담', 'e5', t), look: zg.look, turn: zg.turn, tilt: zg.tilt, headDy: v4Bob('e5', t).headDy, sy: actInhale(T, e5, 0.3), handL: up && T < e5 + 1.5 ? 'open' : null, handRotL: -90 } });
  const shot = (cf, o = {}, ex) => (TT, s, e) => vnShot(t, C, cf(TT, s, e), o) + (ex ? ex(TT, s, e) : '');
  return v4Shots(T, [
    [-9, (TT) => vnShot(t, C, qLerpCam(TT / 1.4, [1180, 620, 1.4], [1185, 620, 1.44])) + rsRib(1, RSW2, '7년 뒤')],
    [e5 - 0.5, shot((TT, s, e) => [1390, 640, lerp(1.95, 2.18, easeInOut(rsK(s, e, TT)))], { depth: 0.7, blur: 1 })],                     // "…잠깐만요."
  ]);
}
/* ---------- e7: 그 줄을 쓴 밤을 안다(rsknow의 그림, 때만 이 줄에 맞춘다) ---------- */
rsknowScene = function (t, lt, a) {
  const TF = rsL('a6').t0 + 0.8, tL = rsW(a, '줄을', 2.03), tN = rsW(a, '밤이', 2.97) - 0.3, see = lt > tN + 0.3, cam = qLerpCam(lt / 6, [960, 604, 1.34], [940, 598, 1.44]);
  let over = '';
  if (lt > tN) over += `<g transform="translate(1640 430) scale(${rsSc((lt - tN) / 0.35)})">${rsMini(0, 0, 1.3, TF, 'both', { shake: Math.sin(t * 30) * 1.0 })}<g transform="translate(0 250)">${label(0, 0, '7년 전, 새벽 2시', { size: 34, bg: '#fff' })}</g></g>`;
  return rsBossShot(t, cam, { z: { look: see ? [0.75, -0.45] : lt > tL ? [0, -0.6] : [0, 0.5], tilt: see ? 3 : 0 }, extra: rsStripAir((lt - tL) / 0.6) }) + over + rsRib(1, RSW2, '7년 뒤') + v4Cut(lt, 0);
};
/* ---------- e6: 논어 위정편(rsquote의 그림에 붓이 죽간을 써 내려가는 움직임을 더했다. 공자의 얼굴은 그리지 않는다) ---------- */
rsquoteScene = function (t, lt, a) {
  const tA = rsW(a, '아는', 5.87), tM = rsW(a, '모르는', 8.09), tG = rsW(a, '그것이', 10.67), tW0 = 0.9, tW1 = tA - 0.3;
  let w = `<rect x="-3000" y="-3000" width="8000" height="7000" fill="#F3E9D2"/><ellipse cx="960" cy="560" rx="1300" ry="760" fill="#FBF4E2"/>`;
  for (let i = 0; i < 9; i++) { const x = 150 + i * 44, k = rsK(0.2 + i * 0.05, 0.6 + i * 0.05, lt); w += `<rect x="${x}" y="${f1(lerp(300, 240, k))}" width="36" height="640" rx="8" fill="#D9B77A" stroke="${INK}" stroke-width="5" opacity="${rsOp(k)}"/>`; }
  if (lt > 0.7) w += [330, 560, 790].map(y => `<path d="M142 ${y} H554" stroke="#7A5A3A" stroke-width="7" stroke-dasharray="26 18" opacity=".8"/>`).join('');
  const NM = 54, n = Math.floor(NM * rsK(tW0, tW1, lt)); let bx = 0, by = 0;                    // 오른쪽 줄부터 세로로 써 내려간다
  for (let m = 0; m < Math.min(n + 1, NM); m++) { const col = 8 - Math.floor(m / 6), row = m % 6, x = 150 + col * 44 + 18, y = 270 + row * 98 + (row > 2 ? 26 : 0) - (row > 4 ? 0 : 0), h = 30 + ((m * 37) % 26), cur = m === n, kk = cur ? (NM * rsK(tW0, tW1, lt)) % 1 : 1;
    w += `<rect x="${x - 7}" y="${y}" width="14" height="${f1(h * kk)}" rx="5" fill="#3A2A22" opacity=".82"/>` + (m % 3 === 1 ? `<rect x="${x - 12}" y="${y + 10}" width="24" height="7" rx="3" fill="#3A2A22" opacity="${rsOp(0.82 * kk)}"/>` : ''); if (cur) { bx = x; by = y + h * kk; } }
  if (lt > tW0 - 0.3 && n < NM) { const k = rsK(tW0 - 0.3, tW0, lt), px = n < 1 && !bx ? 520 : bx, py = n < 1 && !by ? 270 : by; w += `<g transform="translate(${f1(px + 4)} ${f1(py - 40 * (1 - k))}) rotate(24)" opacity="${rsOp(k)}"><rect x="-7" y="-150" width="14" height="124" rx="6" fill="#8A5A2B" stroke="${INK}" stroke-width="4"/><path d="M-10 -28 Q0 12 10 -28 Z" fill="#2B2B2B" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></g>`; }
  if (lt > 0.3) w += `<g transform="translate(1170 210) scale(${rsSc((lt - 0.3) / 0.3)})">${label(0, 0, '2,500년 전 · 공자가 제자 자로에게', { size: 38, bg: '#fff' })}</g>`;
  const line = (y, s, t0, col, fs = 80) => { const k = easeOut(rsK(t0, t0 + 0.5, lt)), wd = rsTw(s, fs) * 0.92, u = easeOut(rsK(t0 + 0.25, t0 + 1.1, lt)); return k <= 0 ? '' : `<g opacity="${rsOp(k)}" transform="translate(0 ${f1(14 * (1 - k))})">${fT(1170, y, s, fs, col)}</g><path d="M${f1(1170 - wd / 2)} ${y + 26} H${f1(1170 - wd / 2 + wd * u)}" stroke="${col}" stroke-width="7" stroke-linecap="round" opacity=".35"/>`; };
  w += line(430, '아는 것을 안다고 하고,', tA, NAVY) + line(560, '모르는 것을 모른다고 하는 것.', tM, NAVY) + line(716, '그것이 아는 것이다.', tG, '#B23A1E', 88);
  if (lt > tG + 1.0) w += `<g opacity="${rsOp((lt - tG - 1.0) / 0.4)}">${fT(1170, 830, '『논어』 위정편 17장 · 뜻을 옮김', 34, '#7A6A4A', { w: 700 })}</g>`;
  return rsDefs() + qCam(qLerpCam(lt / 14, [940, 560, 1.0], [990, 560, 1.07]), w) + v4Cut(lt, 0);
};
