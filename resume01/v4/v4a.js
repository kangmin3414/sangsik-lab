/* 자소서 편 v4 — 1막(a1~a7: 새벽 두 시)과 합격(b1~b2). ../long/rsscenes*.js의 그림 도구와 v4lib.js·act.js를 쓴다. 새 이름은 v4 접두사.
   규칙: 기기 화면은 제로 시점에서만 · 누르는 손가락 없음 · 실존 서비스 이름 없음. */
['v4night', 'v4home', 'v4worlds', 'v4pass'].forEach(k => CAMS[k] = 'fixed');
const v4Cap = (txt, k, x = 330, y = 150) => k <= 0 ? '' : `<g transform="translate(${x} ${y}) scale(${rsSc(k)})">${label(0, 0, txt, { size: 44, bg: '#fff' })}</g>`;
const v4Confetti = (x, y, u, n = 12, R = 300) => { let g = ''; if (u <= 0) return g; for (let i = 0; i < n; i++) { const an = i * 0.55 + 0.2, r = 60 + R * easeOut(rsK(0, 0.8, u)), px = x + Math.cos(an) * r * 1.5, py = y + Math.sin(an) * r * 0.5; g += `<rect x="${f1(px)}" y="${f1(py)}" width="14" height="14" rx="3" fill="${['#F08A6B', '#F5C451', '#7FD8B0', '#7C8BE0'][i % 4]}" opacity="${rsOp(1.2 - rsK(0.5, 1.6, u))}" transform="rotate(${i * 40} ${f1(px)} ${f1(py)})"/>`; } return g; };
/* ---------- a1~a3: 빈 지원서 → 친구의 메시지 → AI가 지어낸 한 줄 ---------- */
function v4nightScene(t, lt, a) {
  if (a.ph === 'open') {
    const tS = rsW(a, '새벽', 1.05), tC = rsW(a, '2시', 2.17) + 1.0, tH = rsW(a, '한', 4.75), cap = v4Cap('석 달 전 · 새벽 2시', (lt - tS + 0.2) / 0.3);
    if (lt < tC) { const g = actGaze([[0, 0, 0.55], [tS + 0.5, 0.75, 0.45], [tS + 1.5, 0, 0.55]], lt), cam = qLerpCam(lt / tC, [960, 628, 1.12], [960, 612, 1.3]);
      const pose = Object.assign({}, P['턱괴기'], { armL: rsArmType.armL, hL: rsArmType.hL });
      return rsFaceShot(t, cam, { z: { pose, ex: exprAt([[0, 'z멍'], [tS + 0.62, 'z당황'], [tS + 1.6, 'z멍']], lt), look: g.look, turn: g.turn * 0.5, tilt: 4 + g.tilt, sy: actHit(lt, tS + 0.62, 0.035).sy }, tag: lt > tS + 0.55 ? '마감까지 58분' : null, tagK: (lt - tS - 0.55) / 0.3 }) + cap + v4Cut(lt, tC); }
    const u = lt - tC, tyA = (s, v) => v < 0 || v > 1.5 ? '' : s.slice(0, v < 0.9 ? Math.min(s.length, Math.floor(v / 0.22) + 1) : Math.max(0, s.length - 1 - Math.floor((v - 0.9) / 0.14))), ty = tyA('저는', u - 0.35) || tyA('제가 한', u - 1.95);
    return rsDefs() + rsZoom(rsLaptop(t, rsForm({ tab: 3, body: rsEssay(t, { draft: ty, cntPulse: lt > tH ? rsK(tH, tH + 0.7, lt) % 1 : 0, cntHot: lt > tH }) })), lerp(1.05, 1.16, easeInOut(rsK(0, 4, u))), 760, 520) + cap + v4Cut(lt, tC);
  }
  if (a.ph === 'chat') { const t1 = 0.38, t2 = rsW(a, 'AI', 2.57), t3 = rsW(a, '서류', 4.76);
    let c = rsChatHead('민재', '') + fT(0, -306, '오전 2:03', 22, '#8B93A3', { w: 700 }) + rsBub(232, -250, '자소서 아직 한 줄도 못 썼다', { mine: true });
    const dots = (y, k) => k > 0 && k < 1 ? `<rect x="-172" y="${y - 30}" width="96" height="60" rx="22" fill="#fff" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2].map(i => `<circle cx="${-146 + i * 22}" cy="${f1(y + Math.sin(lt * 9 - i) * 4)}" r="6" fill="#8B93A3"/>`).join('') : '';
    c += rsWho(-150, '민재', '#F5D7A8', 1) + rsBub(-172, -150, '야, 아직도 쌩으로 쓰냐', { k: (lt - t1) / 0.22 });
    c += dots(-70, rsK(t2 - 0.7, t2, lt)) + rsBub(-172, -70, 'AI 돌리고 좀 부풀려', { k: (lt - t2) / 0.22 });
    c += dots(10, rsK(t3 - 0.6, t3, lt)) + rsBub(-172, 10, '서류만 붙으면 다 똑같아', { k: (lt - t3) / 0.22 });
    return rsDefs() + rsZoom(rsPhone(t, lt, c, { buzz: 1 - rsK(0.3, 0.9, lt) }), lerp(1.0, 1.08, easeInOut(rsK(0, 6, lt))), 960, 500) + v4Cut(lt, 0);
  }
  const total = RS_ESSAY.join('').length, shown = Math.floor(total * rsK(0.45, 1.5, lt)), yl = lt < 2.45 ? -1 : Math.floor(RS.LINE.length * rsK(2.45, 3.2, lt));
  const body = rsEssay(t, { pw: 1140, shown, yl, ylGlow: lt > 3.25 ? 0.5 + 0.5 * Math.sin((lt - 3.25) * 6) : 0 }) + rsAiPanel(lt, { busy: lt > 0.4 && shown < total, done: shown >= total, chip: lt > 1.55 ? (lt - 1.55) / 0.3 : 0, chipPress: rsK(2.0, 2.5, lt) });
  const zk = easeInOut(rsK(2.2, 3.3, lt));
  return rsDefs() + rsZoom(rsLaptop(t, rsForm({ tab: 3, mins: 12, clock: '오전 2:48', body })), lerp(1.04, 1.36, zk), lerp(900, 640, zk), lerp(480, 640, zk)) + v4Cut(lt, 0);
}
/* ---------- a4~a6: "나 창고에서 박스 셌는데" → "붙기만 하면 되잖아" → 제출 직전에 멈춘다 ---------- */
function v4homeScene(t, lt, a) {
  const ph = a.ph, TF = rsL('a6').t0 - 0.15 + 0.95, camF = [960, 588, 1.56];
  if (ph === 0) { const tR = rsW(a, '리드', 0.95), tN = rsW(a, '나', 2.43), tW = rsW(a, '창고', 2.85), tB = rsW(a, '박스', 3.91);
    const g = actGaze([[0, 0, -0.75], [tN - 0.25, 0, 0.2], [tW - 0.1, 0.8, -0.5], [tB + 0.6, 0.15, -0.65]], lt, { turn: 0.5 });
    const SELF = v4Pose(V4SIT(), { armL: [[148, 285], [106, 316], [150, 304]], hL: [162, 300] });
    const pose = actPose([[0, V4SIT()], [tN - 0.05, SELF, { ant: 0.1 }], [tB + 0.9, V4SIT(), { ant: 0, f: 2.4, z: 0.7 }]], lt);
    const base = lt < tR - 0.1 ? 'z멍' : lt < tN - 0.1 ? 'z당황' : 'z민망', h = actMul(actHit(lt, tR, 0.04, 5, 7), actHit(lt, tN, 0.03, 5, 8));
    const cam = qLerpCam(lt / 5, [960, 606, 1.38], [960, 598, 1.48]);
    return rsFaceLate(t, lt, { cam, z: { pose, ex: v4Say('_v4h', base, 'a4', t), look: g.look, turn: g.turn, tilt: g.tilt + actTrack([[0, 0], [tR - 0.05, 7, { f: 3, z: 0.5 }], [tN, 0, { f: 2.5, z: 0.7 }]], lt), headDy: v4Bob('a4', t).headDy, sy: h.sy, sx: h.sx, handL: lt > tN - 0.05 && lt < tB + 0.9 ? 'point' : null }, extra: rsStripAir((lt + 0.25) / 0.55) }) + rsInsetWare(t, (lt - tW) / 0.35, Math.max(0, (lt - tW - 0.3) / 0.3)) + v4Cut(lt, 0);
  }
  if (ph === 1) { const tD = rsW(a, '되잖아', 0.79), ex = rsK(tD + 0.9, tD + 1.5, lt), cam = qLerpCam(lt / 2.6, [960, 598, 1.48], camF);
    return rsFaceLate(t, lt, { cam, z: { ex: Object.assign({}, v4Say('_v4h', 'rs담담', 'a5', t), { blink: 1 - easeOut(rsK(0, 0.3, lt)) }), look: [0, lerp(0.1, 0.4, rsK(0, 0.5, lt))], headDy: v4Bob('a5', t).headDy + 6 * ex, sy: 1 + 0.04 * (1 - easeOut(rsK(0, 0.45, lt))) - 0.02 * Math.sin(Math.PI * ex) }, extra: rsStripAir(1) }) + rsInsetWare(t, 1 - lt / 0.25, 9);
  }
  if (lt < 0.95) { const body = rsEssay(t, { shown: 999, yl: RS.LINE.length, cursor: false, ylGlow: 0.5 + 0.4 * Math.sin(lt * 5) });   // 제출 단추가 눌리기 직전
    return rsDefs() + rsZoom(rsLaptop(t, rsForm({ tab: 3, mins: 9, clock: '오전 2:51', press: 0.28 * rsK(0.25, 0.9, lt), body })), lerp(1.16, 1.5, easeIn(rsK(0, 0.95, lt))), 1400, 720) + v4Cut(lt, 0) + v4Cut(lt, 0.95); }
  const g = easeOut(rsK(1.0, 1.6, lt)), sh = Math.sin(t * 34) * 2.2 * g;
  return rsFaceLate(TF, lt, { cam: camF, tz: TF, z: { ex: fEx('rs담담'), look: [0, 0.4], still: true, noBlink: true }, ghost: g, shake: sh, extra: rsStripAir(1, { dbl: g, shake: sh * 0.5 }) }) + fFull('#fff', rsOp(0.1 * g + rsK(1.8, 2.3, lt) * 0.8)) + v4Cut(lt, 0.95);
}
/* ---------- a7: 다세계 해석(짧게). rsWorlds의 그림을 쓰고 때만 이 줄의 낱말에 맞춘다 ---------- */
function v4worldsScene(t, lt, a) {
  const W = (k, fb) => rsWd(a._words, k, fb), D = rsL('a7').t1 - rsL('a7').t0, tC = W('갈림길', 3.65), tSp = W('갈라져', 5.03), tU = Math.max(tSp + 0.6, W('두', 6.15)), tN = W('여러', 9.85), tT = D - 2.3;
  const syn = [['에버렛', 2], ['양자', 2.5], ['가능한', tC], ['갈라진', tSp], ['세계에서', tU], ['저마다', tU + 0.35], ['일어난', W('일어난', 7.65)], ['지금도', tN], ['사람의', tN + 0.5], ['상상입니다', tN + 1.0], ['오늘은', tT]].map(([w, x]) => ({ w, t: x - 0.15 }));
  return rsZoom(rsWorlds(t, lt, { _words: syn }, rsL('a6').t0 + 0.8), lerp(1.0, 1.06, rsK(0.9, tT, lt)), 960, 560);
}
/* ---------- b1~b2: 제출 완료 → 합격 메일 → 벌떡 → 엄마에게 전화 ---------- */
function v4passScene(t, lt, a) {
  if (a.ph === 0) {
    if (lt < 1.25) { const pr = rsK(0.15, 0.3, lt) * (1 - rsK(0.42, 0.6, lt)), body = rsEssay(t, { shown: 999, yl: RS.LINE.length, cursor: false }) + rsDoneCard((lt - 0.55) / 0.3, '오전 2:51 접수되었습니다');
      return rsDefs() + rsZoom(rsLaptop(t, rsForm({ tab: 3, mins: 9, clock: '오전 2:51', press: pr, body })), lerp(1.1, 1.16, easeInOut(rsK(0, 1.4, lt))), 900, 500) + rsRib((lt - 0.2) / 0.4, RSW1, '지원서를 낸 새벽') + fFull('#fff', rsOp((1 - rsK(0, 0.3, lt)) * 0.9)) + v4Cut(lt, 1.25); }
    if (lt < 2.7) { const u = lt - 1.25, zk = easeInOut(rsK(0.4, 1.3, u)), joy = Math.sin(Math.PI * rsK(0.95, 1.4, u));
      const rows = [{ from: '채용 담당', subj: '[전형 결과] 최종 합격을 축하드립니다', time: '오후 9:02', k: (u - 0.3) / 0.35, hot: '#E7F8F0', strip: 1 }].concat(RS_OLD);
      return rsDefs() + rsZoom(rsLaptop(t, rsMailUI(t, rows, { clock: '오후 9:03', extra: v4Confetti(1070, 190, u - 0.45) }), { hy: -70 * joy }), lerp(1.0, 1.24, zk), lerp(900, 1040, zk), lerp(480, 210, zk)) + rsRib(u / 0.4, RSW1, '한 달 뒤') + v4Cut(lt, 1.25) + v4Cut(lt, 2.7); }
    const u = lt - 2.7, an = Math.sin(Math.PI * rsK(0, 0.16, u)), up = Math.sin(Math.PI * rsK(0.16, 0.8, u)), land = actHit(u, 0.8, 0.07, 5, 8);
    return rsFaceShot(t, [960, 606, 1.3], { clock: '9:03', z: { y: RS.ZY - 90 * up + 14 * an, pose: mixPose(V4SIT(), '만세', easeOut(rsK(0.1, 0.32, u))), ex: fEx('z빵긋'), look: [0, -0.3], sy: (1 - 0.06 * an) * (1 + 0.05 * up) * land.sy, sx: land.sx } }) + rsRib(1, RSW1, '한 달 뒤') + v4Cut(lt, 2.7);
  }
  const tB = rsW(a, '붙었어', 1.29), tE = rsW(a, '응', 2.65), tJ = rsW(a, '진짜야', 3.35), tR = rsW(a, '진짜라니까', 3.99);
  const B0 = v4Pose(V4SIT(), { armR: [[252, 285], [308, 296], [280, 214]], hR: [274, 204] }), PUMP = v4Pose(B0, { armL: [[148, 285], [108, 262], [98, 214]], hL: [96, 204] }), WIPE = v4Pose(B0, { armL: [[148, 285], [118, 300], [150, 212]], hL: [156, 204] });
  const pose = actPose([[0, B0], [tB, PUMP, { ant: 0.12, z: 0.4 }], [tE - 0.1, B0, { ant: 0, f: 2.4, z: 0.7 }], [tR + 0.75, WIPE, { ant: 0.08, f: 2.8, z: 0.7 }]], lt);
  const h = actMul(actHit(lt, tB, 0.06, 4.5, 6), actHit(lt, tR, 0.03, 5, 8)), cam = qLerpCam(lt / 6, [960, 606, 1.36], [960, 594, 1.52]);
  const phone = `<rect x="-13" y="-56" width="26" height="66" rx="7" fill="#1F2D44" stroke="${INK}" stroke-width="4"/>`;
  return rsFaceShot(t, cam, { clock: '9:05', z: { pose, ex: v4Say('_v4h', lt < tR - 0.1 ? 'z빵긋' : 'z울먹', 'b2', t), look: [0.35, lt > tR ? 0.3 : -0.25], turn: 0.25, tilt: actTrack([[0, 3], [tR, -4, { f: 2, z: 0.7 }]], lt), headDy: v4Bob('b2', t).headDy + actNod(lt, tE, 1, 9, 0.32) + actNod(lt, tJ, 2, 8, 0.3), sy: h.sy * actInhale(lt, 0.05, 0.3), sx: h.sx, handL: lt > tB - 0.1 && lt < tE - 0.1 ? 'fist' : null, holdR: phone, handR: 'grip' } }) + rsRib(1, RSW1, '한 달 뒤') + v4Cut(lt, 0);
}
