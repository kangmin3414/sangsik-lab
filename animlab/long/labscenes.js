/* 애니메이션 기법 실험실: 왼쪽 '지금(기존 엔진)' / 오른쪽 '개선(anim2.js)'. 같은 시간, 같은 동작. */
['lab1', 'lab2', 'lab3', 'lab4'].forEach(k => CAMS[k] = 'fixed');
const LG = 880, LS = 0.78; // 땅 높이, 캐릭터 크기
const labBg = (lt, title) => `<rect x="-300" y="-200" width="2600" height="1500" fill="#F3EEE4"/>` +
  `<rect x="-300" y="${LG}" width="2600" height="400" fill="#E2D8C6"/><line x1="-300" y1="${LG}" x2="2300" y2="${LG}" stroke="${INK}" stroke-width="6"/>` +
  `<line x1="960" y1="-200" x2="960" y2="1300" stroke="${INK}" stroke-width="5" stroke-dasharray="18 14" opacity=".35"/>` +
  label(480, 70, '지금', { size: 44, bg: '#fff' }) + label(1440, 70, '개선', { size: 44, bg: YEL }) + fT(960, 150, title, 40, INK);
const feetW = (x, y, s, p, rot = 0) => ['fL', 'fR'].map(k => { const lx = (p[k][0] - 200) * s, ly = (p[k][1] + (p.dy || 0) - 560) * s, r = rot * Math.PI / 180; return [x + lx * Math.cos(r) - ly * Math.sin(r), y + lx * Math.sin(r) + ly * Math.cos(r)]; });
// 발자국: 지난 시간 동안 땅에 닿아 있던 발의 위치에 점을 찍는다(미끄러지면 줄이 된다)
function prints(fn, t, t0, color) { let g = ''; for (let tt = t0; tt <= t; tt += 1 / 24) { const fw = fn(tt); fw.forEach(([x, y]) => { if (y > LG - 22) g += `<circle cx="${f1(x)}" cy="${LG + 14}" r="5" fill="${color}" opacity=".55"/>`; }); } return g; }

/* 1. 걷기 */
function lab1Scene(t, lt, a) {
  const T0 = 0.8, T1 = 5.0;
  // 지금: x는 시간에 비례, 다리는 시간으로 흔듦 → 발이 미끄러짐
  const oldAt = tt => { const k = clamp((tt - T0) / (T1 - T0), 0, 1), x = lerp(120, 820, k), mv = tt > T0 && tt < T1; return { x, pose: mv ? walkPose(tt * 7, 0.8) : P['서기'] }; };
  // 개선: 발이 땅에 붙는 걷기
  const W = { x0: 1100, x1: 1800, t0: T0, t1: T1, s: LS };
  const o = oldAt(lt), n = A2.walk(lt, W);
  let w = labBg(lt, '걷기: 발이 땅에 붙고, 출발·정지에 속도가 붙었다 줄어든다');
  w += prints(tt => { const q = oldAt(tt); return feetW(q.x, LG, LS, q.pose); }, lt, 0, '#E5484D');
  w += prints(tt => { const q = A2.walk(tt, W); return feetW(q.x, LG, LS, q.pose, q.rot); }, lt, 0, '#2F9E6E');
  w += qShadow(o.x, LG, 60) + Z({ x: o.x, y: LG, s: LS, t, pose: o.pose, ex: fEx('z기본') });
  w += qShadow(n.x, LG, 60) + Z({ x: n.x, y: LG, s: LS, t, pose: n.pose, rot: n.rot, turn: n.turn, ex: fEx('z기본'), look: [n.turn, 0] });
  w += fT(480, 1000, '빨간 점 = 땅에 닿은 발(미끄러지면 줄)', 30, '#B03A3A') + fT(1440, 1000, '초록 점 = 디딘 자리에 그대로', 30, '#2F7A55');
  return w;
}

/* 2. 동작 바꾸기: 손 흔들기 → 가리키기 → 차렷 */
const L2K = { stand: { hL: [114, 406], hR: [286, 406] }, wave: { hL: [114, 406], hR: [322, 172] }, point: { hL: [118, 400], hR: [376, 262] } };
function lab2Scene(t, lt, a) {
  // 지금: 관절 좌표를 직선으로 섞음(팔 길이가 줄었다 늘었다), 손은 동그라미 그대로
  const oldPose = poseAt([[0, '서기'], [1.0, '손인사'], [3.0, P['폰넣기'] || '손인사'], [4.6, '서기']], lt, 0.22);
  // 개선: 손 위치만 섞고 팔꿈치는 IK, 예비 동작 + 지나쳤다 돌아옴, 손은 휘는 길로, 손 모양 바꿈
  const k1 = A2.actK(lt, 1.0, 0.32), k2 = A2.actK(lt, 3.0, 0.26, { antic: 0.12, anticAmt: 0.18 }), k3 = A2.actK(lt, 4.6, 0.38, { anticAmt: 0.06, over: 0.06 });
  const mix = (p, q, k) => ({ hL: [lerp(p.hL[0], q.hL[0], k), lerp(p.hL[1], q.hL[1], k)], hR: [lerp(p.hR[0], q.hR[0], k), lerp(p.hR[1], q.hR[1], k)] });
  let tg = lt < 3.0 - 0.12 ? mix(L2K.stand, L2K.wave, k1) : lt < 4.6 - 0.14 ? mix(L2K.wave, L2K.point, k2) : mix(L2K.point, L2K.stand, k3);
  // 흔드는 손목: 시작 때 크게, 점점 작게(follow-through)
  if (lt > 1.25 && lt < 2.95) { const u = lt - 1.25, amp = 26 * Math.exp(-u * 0.9) + 6; tg.hR = [tg.hR[0] + Math.sin(u * 13) * amp, tg.hR[1] + Math.abs(Math.cos(u * 13)) * 4]; }
  const np = A2.pose(tg), hand = lt > 1.05 && lt < 3.0 ? 'open' : lt >= 3.0 && lt < 4.65 ? 'point' : null;
  // 눈이 먼저, 머리가 따라, 몸은 마지막(겹치는 동작)
  const turnFn = tt => tt > 3.0 && tt < 4.6 ? 0.7 : 0, look = [lt > 2.9 && lt < 4.5 ? 1 : 0, 0], turn = A2.follow(turnFn, lt, 2.2, 0.45, 1.0, 20), rot = A2.follow(tt => turnFn(tt) * 4, lt, 1.4, 0.4, 1.4, 20);
  const ex = exprAt([[0, 'z기본'], [1.0, 'z빵긋'], [3.0, 'z결심'], [4.6, 'z기본']], lt);
  let w = labBg(lt, '동작 바꾸기: 예비 동작 → 동작 → 지나쳤다 돌아옴, 팔 길이 유지, 손 모양');
  w += qShadow(480, LG, 60) + Z({ x: 480, y: LG, s: LS * 1.1, t, pose: oldPose, ex });
  w += qShadow(1400, LG, 60) + Z({ x: 1400, y: LG, s: LS * 1.1, t, pose: np, ex, look, turn, rot, handR: hand });
  if (lt > 3.0 && lt < 4.6) w += `<circle cx="1830" cy="${LG - 300}" r="34" fill="#FFE27A" stroke="${INK}" stroke-width="6"/>` + `<circle cx="900" cy="${LG - 300}" r="34" fill="#FFE27A" stroke="${INK}" stroke-width="6"/>`;
  return w;
}

/* 3. 잡고 던지기 */
const CUP = `<g transform="translate(0 -18)"><path d="M-22 -18 L22 -18 L16 22 Q0 28 -16 22 Z" fill="#C2703F" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="0" cy="-18" rx="22" ry="6" fill="#8E4A26" stroke="${INK}" stroke-width="4"/></g>`;
function lab3Scene(t, lt, a) {
  const tW = 1.4, tT = 2.3, tR = 2.42, FL = 0.8; // 준비, 던짐, 놓음, 날아가는 시간
  // 지금: 손 옆에 컵이 떠 있고, 팔은 직선으로 섞임, 놓으면 직선으로 날아감
  const oldPose = poseAt([[0, '서기'], [tW, '만세'], [tT, '폰넣기'], [tR + 0.6, '서기']], lt, 0.22), ox = 420, H0 = (q, x0) => [x0 + (q.hR[0] - 200) * LS, LG + (q.hR[1] - 560) * LS];
  let w = labBg(lt, '잡고 던지기: 손이 컵을 쥐고, 뒤로 젖혔다가, 휘둘러 놓고, 팔이 따라 나간다');
  w += qShadow(ox, LG, 60) + Z({ x: ox, y: LG, s: LS, t, pose: oldPose, ex: fEx('z결심') });
  if (lt < tR) { const [hx, hy] = H0(oldPose, ox); w += `<g transform="translate(${f1(hx + 34)} ${f1(hy - 30)})">${CUP}</g>`; }
  else { const k = clamp((lt - tR) / FL, 0, 1); w += `<g transform="translate(${f1(lerp(ox + 180, 900, k))} ${f1(lerp(LG - 380, LG - 10, k))})">${CUP}</g>`; }
  // 개선
  const nx = 1180, kWind = A2.actK(lt, tW, 0.5, { anticAmt: 0, over: 0.04 }), kThrow = A2.actK(lt, tT, 0.16, { antic: 0, anticAmt: 0, over: 0.18, settle: 0.5 });
  const rest = { hL: [114, 406], hR: [286, 406] }, wind = { hL: [80, 330], hR: [150, 168] }, thr = { hL: [130, 360], hR: [400, 330] };
  const m = (p, q, k) => ({ hL: [lerp(p.hL[0], q.hL[0], k), lerp(p.hL[1], q.hL[1], k)], hR: [lerp(p.hR[0], q.hR[0], k), lerp(p.hR[1], q.hR[1], k)] });
  let tg = lt < tT ? m(rest, wind, kWind) : m(wind, thr, kThrow); if (lt > tT + 0.9) tg = m(thr, rest, A2.actK(lt, tT + 0.9, 0.4, { anticAmt: 0, over: 0.05 }));
  const crouch = 22 * clamp(kWind, 0, 1) * (1 - clamp(kThrow, 0, 1)) + 10 * Math.max(0, Math.sin(clamp((lt - tT) / 0.5, 0, 1) * Math.PI));
  const np = A2.pose(Object.assign(tg, { dy: crouch }));
  const rot = lt < tT ? -7 * clamp(kWind, 0, 1) : lerp(-7, 9, clamp(kThrow, 0, 1.2)) * (lt > tT + 0.9 ? 1 - prog(lt, tT + 0.9, tT + 1.4) : 1);
  const held = lt < tR;
  w += qShadow(nx, LG, 60);
  // 휘두르는 손 궤적(스우시)
  const handW = tt => { const kk = A2.actK(tt, tT, 0.16, { antic: 0, anticAmt: 0, over: 0.18, settle: 0.5 }), q = A2.pose(m(wind, thr, kk)); return [nx + (q.hR[0] - 200) * LS, LG + (q.hR[1] + crouch - 560) * LS]; };
  if (lt > tT && lt < tT + 0.22) w += A2.swoosh(handW, lt, 0.12, 14);
  w += Z({ x: nx, y: LG, s: LS, t, pose: np, rot, ex: lt < tW ? fEx('z기본') : lt < tR + 0.1 ? fEx('z결심') : fEx('z빵긋'), look: lt < tR ? [-0.3, -0.3] : [1, 0], handR: held ? 'grip' : 'open', holdR: held ? { svg: CUP, rot: 0 } : null });
  if (!held) { // 포물선 + 회전 + 잔상 → 착지 찌그러짐·튐
    const [rx, ry] = handW(tR), gx = 1840, cupAt = tt => { const k = clamp((tt - tR) / FL, 0, 1); if (k < 1) return [lerp(rx, gx, k), lerp(ry, LG - 4, k) - Math.sin(k * Math.PI) * 260, k * 720];
      const d = tt - tR - FL, bx = gx + 50 * (1 - Math.exp(-d * 3)), by = LG - 4 - Math.abs(Math.sin(d * 8)) * 60 * Math.exp(-d * 4); return [bx, by, 720 + d * 200 * Math.exp(-d)]; };
    const drawCup = tt => { const [cx, cy, r] = cupAt(tt), [sx, sy] = A2.squash(tt, tR + FL, 0.3, 0.25); return `<g transform="translate(${f1(cx)} ${f1(cy)}) scale(${f1(sx * 100) / 100} ${f1(sy * 100) / 100}) rotate(${f1(r)})">${CUP}</g>`; };
    if (lt < tR + FL) w += A2.ghost(drawCup, lt, 3, 1 / 36, 0.25);
    w += drawCup(lt);
    if (lt > tR + FL && lt < tR + FL + 0.5) w += fx(t, t - lt + tR + FL, t - lt + tR + FL + 0.5, gx, LG - 60, '탁', '#fff', { size: 44 });
  }
  const [sx, sy] = A2.shake(lt, tR + FL, 9, 0.3);
  return `<g transform="translate(${f1(sx)} ${f1(sy)})">${w}</g>`;
}

/* 4. 따라오는 것들: 목도리·머리카락·배낭이 늦게 따라오고 출렁이다 멈춤 + 착지 찌그러짐 */
function lab4Scene(t, lt, a) {
  const Wl = { x0: 140, x1: 700, t0: 0.6, t1: 2.6, s: LS, step: 80, lift: 34, bob: 9, lean: 9 }, Wr = Object.assign({}, Wl, { x0: 1100, x1: 1660 });
  let w = labBg(lt, '따라오는 것들: 목도리·머리카락이 늦게 따라오고, 착지할 때 찌그러진다');
  const tJ = 3.6, air = 0.55;
  [[Wl, false], [Wr, true]].forEach(([W, good]) => {
    const q = A2.walk(lt, W); let x = q.x, y = LG, pose = q.pose, sx = 1, sy = 1, rot = q.rot;
    // 점프: 웅크림(예비) → 공중 → 착지 찌그러짐
    const air_ = lt > tJ && lt < tJ + air, u = clamp((lt - tJ) / air, 0, 1);
    if (lt > tJ - 0.25) { y = LG - (lt > tJ ? Math.sin(u * Math.PI) * 170 : 0);
      if (good) { const c = lt < tJ ? Math.sin(prog(lt, tJ - 0.25, tJ) * Math.PI / 2) * 24 : lt > tJ + air ? 24 * Math.max(0, 1 - (lt - tJ - air) / 0.25) * 0.8 : 0, tuck = air_ ? Math.sin(u * Math.PI) * 46 : 0;
        pose = A2.pose({ dy: c, hL: air_ ? [36, 218] : [114, 406], hR: air_ ? [364, 218] : [286, 406], fL: [178, 534 - tuck, 0], fR: [222, 534 - tuck, 0], bend: { aL: 1, aR: -1, lL: 1, lR: -1 } });
        const st = air_ ? 1 + 0.12 * Math.sin(u * Math.PI) : 1; [sx, sy] = A2.squash(lt, tJ + air, 0.16, 0.3); sy *= st; sx /= Math.sqrt(st); }
      else pose = air_ ? P['만세'] : P['서기']; rot = 0; }
    // 목도리 꼬리: 몸 속도를 스프링으로 늦게 따라감(마디마다 더 늦게 → 채찍처럼). 걸으면 뒤로 날리고, 멈추면 앞으로 한 번 넘어갔다 돌아온다.
    const vel = tt => { const a1 = A2.walk(tt + 0.02, W).x, a0 = A2.walk(tt - 0.02, W).x; return (a1 - a0) / 0.04 / 300; };
    const jumpV = tt => tt > tJ && tt < tJ + air ? Math.cos(((tt - tJ) / air) * Math.PI) : 0; // +올라감, -떨어짐
    const dir = q.dir, neckY = y + (pose.dy + 266 - 560) * LS, anchor = [x - dir * 26 * LS, neckY + 6];
    let pts = [anchor];
    for (let i = 1; i <= 5; i++) {
      let th = 0.1;
      if (good) { const lag = A2.follow(tt => vel(tt - i * 0.045), lt, 1.3, 0.25, 1.4, 22), jv = A2.follow(tt => jumpV(tt - i * 0.035), lt, 1.8, 0.3, 1.0, 16);
        th += clamp(lag, -0.9, 1.25) * (0.3 + 0.62 * i / 5) + clamp(-jv, 0, 1.2) * 2.1 * (i / 5) - clamp(jv, 0, 1) * 0.08 + Math.sin(lt * 12 - i * 1.1) * 0.24 * clamp(Math.abs(lag), 0, 1) * (i / 5); }
      const p0 = pts[pts.length - 1], sg = 31; pts.push([p0[0] - dir * Math.sin(th) * sg, p0[1] + Math.cos(th) * sg]); }
    const sp = pts.map(p => p.map(f1).join(' ')).join(' L');
    const scarf = `<path d="M${sp}" fill="none" stroke="${INK}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><path d="M${sp}" fill="none" stroke="#E5484D" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>`;
    const cw = 56 * LS, collar = `<path d="M${f1(x - cw)} ${f1(neckY)} Q${f1(x)} ${f1(neckY + 22)} ${f1(x + cw)} ${f1(neckY)}" fill="none" stroke="${INK}" stroke-width="34" stroke-linecap="round"/><path d="M${f1(x - cw)} ${f1(neckY)} Q${f1(x)} ${f1(neckY + 22)} ${f1(x + cw)} ${f1(neckY)}" fill="none" stroke="#E5484D" stroke-width="24" stroke-linecap="round"/>`;
    // 머리 위 삐친 머리카락: 오르내림과 속도를 늦게 따라감
    const hb = good ? A2.follow(tt => (A2.walk(tt, W).pose.dy || 0) / 9 + jumpV(tt) * 1.5, lt, 2.4, 0.22, 1.0, 20) : 0, tuftAng = -10 + hb * 34 - (good ? clamp(A2.follow(vel, lt, 1.5, 0.3, 1.2, 20), -1, 1.5) * 26 : 0);
    const hair = `<g transform="translate(200 58) rotate(${f1(tuftAng)})"><path d="M0 0 Q-8 -40 16 -64" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/></g>`;
    w += qShadow(x, LG, 60 * (1 - (LG - y) / 400));
    w += `<g transform="translate(${f1(x)} ${f1(LG)}) scale(${f1(sx * 1000) / 1000} ${f1(sy * 1000) / 1000}) translate(${f1(-x)} ${f1(-LG)})">` + scarf + Z({ x, y, s: LS, t, pose, rot, turn: good ? q.turn : 0, ex: fEx(lt > tJ && lt < tJ + air ? 'z신남' in E ? 'z신남' : 'z빵긋' : 'z기본'), hairFront: hair }) + collar + `</g>`;
    if (good && lt > tJ + air && lt < tJ + air + 0.4) w += puff(x, LG, t, t - lt + tJ + air, 1);
  });
  return w;
}
