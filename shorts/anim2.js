/* anim2.js — 애니메이션 기법 2단계(engine.js 위에 얹어 쓴다). 모든 함수는 시간 t만 받아 계산한다(프레임을 나눠 병렬 렌더해도 같은 결과).
   1) IK 팔다리: 손·발 위치만 정하면 팔꿈치·무릎을 뼈 길이 그대로 계산 → 포즈를 섞을 때 팔다리가 줄었다 늘었다 하지 않는다.
   2) walk2: 발이 땅에 붙는 걷기(미끄러짐 없음), 출발·정지 가감속, 몸 오르내림, 속도만큼 앞으로 기울기, 마지막 반걸음 정리.
   3) actK: 예비 동작(반대로 살짝) → 큰 동작 → 지나쳤다 돌아옴(오버슈트·안착).
   4) follow: 스프링 지연(망토·머리카락·배낭·꼬리가 몸보다 늦게 따라오고 출렁이다 멈춤).
   5) squash, ghost/swoosh(빠른 동작 잔상), camShake. */
const A2 = {};
// ---- 뼈 길이(engine.js '서기' 기준, 캐릭터 local 단위) ----
A2.SH = { L: [148, 285], R: [252, 285] }; A2.HIP = { L: [182, 412], R: [218, 412] };
A2.ARM = [65, 62]; A2.LEG = [58, 52];
// 두 마디 IK: root에서 target까지, bend = +1/-1(팔꿈치·무릎이 꺾이는 쪽)
A2.ik = (root, target, L1, L2, bend) => {
  const dx = target[0] - root[0], dy = target[1] - root[1]; let d = Math.hypot(dx, dy);
  const dm = Math.min(Math.max(d, Math.abs(L1 - L2) + 1), L1 + L2 - 0.5), a = Math.atan2(dy, dx);
  const c = clamp((L1 * L1 + dm * dm - L2 * L2) / (2 * L1 * dm), -1, 1), b = Math.acos(c) * bend;
  const mid = [root[0] + L1 * Math.cos(a + b), root[1] + L1 * Math.sin(a + b)];
  const end = d > dm ? [root[0] + dx / d * dm, root[1] + dy / d * dm] : target; // 너무 멀면 닿는 데까지만
  return [root, mid, end];
};
// 손·발 위치로 포즈 만들기. o = { hL, hR, fL:[x,y,rot], fR, dy, bend:{aL,aR,lL,lR} }
A2.pose = o => {
  const b = Object.assign({ aL: 1, aR: -1, lL: -1, lR: 1 }, o.bend || {}), dy = o.dy || 0, keep = o.keepFeet !== false;
  const st = P['서기'], hL = o.hL || st.hL, hR = o.hR || st.hR, fL = o.fL || st.fL, fR = o.fR || st.fR;
  // 발은 땅에 그대로(dy로 몸 전체가 내려가도 발은 같은 자리): local 발 목표에서 dy를 뺀다
  const ankle = (f, side) => [f[0] - side * 12, f[1] - 12 - (keep ? dy : 0)];
  const armL = A2.ik(A2.SH.L, hL, A2.ARM[0], A2.ARM[1], b.aL), armR = A2.ik(A2.SH.R, hR, A2.ARM[0], A2.ARM[1], b.aR);
  const legL = A2.ik(A2.HIP.L, ankle(fL, -1), A2.LEG[0], A2.LEG[1], b.lL), legR = A2.ik(A2.HIP.R, ankle(fR, 1), A2.LEG[0], A2.LEG[1], b.lR);
  return { armL, armR, legL, legR, hL: armL[2], hR: armR[2], fL: [legL[2][0] - 12, legL[2][1] + 12, fL[2] || 0], fR: [legR[2][0] + 12, legR[2][1] + 12, fR[2] || 0], dy };
};
// 두 포즈 사이를 '손 위치'로 섞고, 손은 직선 대신 바깥으로 휘는 길(arc)로 움직인다
A2.blend = (a, b, k, arc = 0.25) => {
  const m = (p, q, side) => { const x = lerp(p[0], q[0], k), y = lerp(p[1], q[1], k), d = Math.hypot(q[0] - p[0], q[1] - p[1]), bulge = Math.sin(k * Math.PI) * d * arc;
    const nx = -(q[1] - p[1]) / (d || 1), ny = (q[0] - p[0]) / (d || 1), s = (nx * side < 0 ? -1 : 1); return [x + nx * bulge * s, y + ny * bulge * s]; };
  const f = (p, q) => [lerp(p[0], q[0], k), lerp(p[1], q[1], k), lerp(p[2] || 0, q[2] || 0, k)];
  return A2.pose({ hL: m(a.hL, b.hL, -1), hR: m(a.hR, b.hR, 1), fL: f(a.fL, b.fL), fR: f(a.fR, b.fR), dy: lerp(a.dy || 0, b.dy || 0, k), bend: a.bend });
};
// ---- 시간 곡선 ----
// 예비 동작 + 오버슈트: t0에 시작(예비 antic초 전부터), dur 동안 주 동작, 끝나면 over만큼 지나쳤다가 안착
A2.actK = (t, t0, dur, o = {}) => {
  const an = o.antic == null ? 0.14 : o.antic, aa = o.anticAmt == null ? 0.12 : o.anticAmt, ov = o.over == null ? 0.1 : o.over, st = o.settle || 0.35;
  if (t < t0 - an) return 0;
  if (t < t0) return -aa * Math.sin(prog(t, t0 - an, t0) * Math.PI / 2);
  if (t < t0 + dur) { const u = prog(t, t0, t0 + dur); return lerp(-aa, 1 + ov, 1 - Math.pow(1 - u, 3)); }
  const u = prog(t, t0 + dur, t0 + dur + st); return 1 + ov * Math.cos(u * Math.PI * 1.5) * (1 - u);
};
// 감쇠 스프링 응답(계단 입력에 대한): 0 → 1, 지나쳤다 돌아옴
A2.spring = (t, t0, f = 2.2, z = 0.35) => { if (t <= t0) return 0; const w = 2 * Math.PI * f, wd = w * Math.sqrt(1 - z * z), u = t - t0; return 1 - Math.exp(-z * w * u) * (Math.cos(wd * u) + z / Math.sqrt(1 - z * z) * Math.sin(wd * u)); };
// 스프링 지연: 신호 fn(t)를 늦게, 출렁이며 따라간다(망토·머리·꼬리용). 반환값 = 따라간 값
A2.follow = (fn, t, f = 1.6, z = 0.3, win = 1.6, n = 32) => {
  const w = 2 * Math.PI * f, wd = w * Math.sqrt(1 - z * z), dt = win / n; let acc = 0, ws = 0;
  for (let i = 0; i <= n; i++) { const u = i * dt, h = Math.exp(-z * w * u) * Math.sin(wd * u + 1e-3) + 1e-4; acc += h * fn(t - u); ws += h; }
  return acc / ws;
};
// 착지 찌그러짐: [sx, sy]
A2.squash = (t, tl, amp = 0.14, dur = 0.32) => { if (t < tl || t > tl + dur) return [1, 1]; const u = (t - tl) / dur, k = Math.sin(u * Math.PI) * (1 - u) * 1.6; return [1 + amp * k, 1 - amp * k]; };
// 빠른 동작 잔상: draw(tt)를 조금 전 시간들로 여러 번(옅게)
A2.ghost = (draw, t, n = 3, dt = 1 / 40, op = 0.28) => { let g = ''; for (let i = n; i >= 1; i--) g += `<g opacity="${f1(op * (1 - (i - 1) / n) * 100) / 100}">${draw(t - i * dt)}</g>`; return g; };
// 휘두름 궤적(스우시): pos(tt) → [x,y]를 지난 len초 동안 이어 그린 선
A2.swoosh = (pos, t, len = 0.12, w = 16, color = '#fff') => { const pts = []; for (let i = 0; i <= 8; i++) pts.push(pos(t - len * i / 8)); const d = pts.map((p, i) => (i ? 'L' : 'M') + f1(p[0]) + ' ' + f1(p[1])).join(' ');
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 6}" stroke-linecap="round" opacity=".18"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" opacity=".75"/>`; };
// 카메라 흔들림(충격): [dx, dy]
A2.shake = (t, t0, amp = 10, dur = 0.35) => { if (t < t0 || t > t0 + dur) return [0, 0]; const k = 1 - (t - t0) / dur; return [Math.sin(t * 91) * amp * k, Math.cos(t * 73) * amp * k * 0.7]; };

// ---- 발이 붙는 걷기 ----
// o = { x0, x1, t0, t1, s(캐릭터 크기), step(한 걸음, local 단위), lift, bob, lean }
// 반환 { x, pose, rot, turn, b(이동 거리 local), moving }
A2.walk = (t, o) => {
  const s = o.s || 1, dir = Math.sign(o.x1 - o.x0) || 1, D = Math.abs(o.x1 - o.x0) / s, stepL = o.step || 64;
  const n = Math.max(1, Math.round(D / stepL)), Ls = D / n, T = o.t1 - o.t0, lift = o.lift == null ? 28 : o.lift, bob = o.bob == null ? 7 : o.bob, W = o.width || 36;
  // 거리 곡선: 처음과 끝 22%는 가감속
  const dist = tt => { const u = clamp((tt - o.t0) / T, 0, 1), a = 0.22; let v;
    if (u < a) v = u * u / (2 * a * (1 - a)); else if (u > 1 - a) v = 1 - (1 - u) * (1 - u) / (2 * a * (1 - a)); else v = (u - a / 2) / (1 - a); return v * D; };
  // 위상: 시작과 끝은 '한 발로 서고 다른 발이 바로 옆에서 막 들리는/내려앉는' 자세(b0 = Ls/2)라서 출발·정지 때 디딘 발이 미끄러지지 않는다
  const b = dist(t), B = b + Ls / 2, sp = (dist(t + 0.02) - dist(t - 0.02)) / 0.04, vmax = D / T * 1.3, spd = clamp(sp / vmax, 0, 1);
  const ramp = clamp(Math.min(b, D - b) / (0.35 * Ls), 0, 1); // 처음·끝에서 드는 발 높이를 줄인다
  const foot = (off, side) => { const c = (B / Ls + off) / 2, f = c - Math.floor(c); let rel, up = 0, rot = 0;
    if (f < 0.5) rel = Ls / 2 - 2 * f * Ls; else { const g = (f - 0.5) * 2; rel = -Ls / 2 + g * Ls; up = Math.sin(g * Math.PI) * lift * ramp; rot = -Math.sin(g * Math.PI) * 14 * dir * ramp; }
    return [200 + side * W + dir * rel, 534 - up, rot]; };
  const fL = foot(0, -1), fR = foot(1, 1);
  // 몸: 두 발이 벌어질 때 가장 낮고(무릎이 닿도록), 한 발로 지날 때 원래 높이
  const dy = bob * (1 + Math.cos(2 * Math.PI * B / Ls)) / 2;
  // 팔: 같은 쪽 다리와 반대로
  const swing = (fx, side) => { const a = -((fx - 200 - side * W) / Ls) * 0.9 * Math.max(spd, ramp * 0.6), sh = A2.SH[side < 0 ? 'L' : 'R']; return [sh[0] + side * 14 + Math.sin(a) * 118 * dir, sh[1] + Math.cos(a) * 112]; };
  const pose = A2.pose({ hL: swing(fL[0], -1), hR: swing(fR[0], 1), fL, fR, dy, bend: { aL: 1, aR: -1, lL: dir > 0 ? -1 : 1, lR: dir > 0 ? -1 : 1 } });
  const rot = (o.lean == null ? 5 : o.lean) * spd * dir, turn = 0.55 * dir * clamp(spd * 2.5, 0, 1);
  return { x: o.x0 + dir * b * s, pose, rot, turn, b, moving: t > o.t0 && t < o.t1, dir };
};
window.A2 = A2;
