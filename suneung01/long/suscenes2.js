/* 수능 편 — 2막~결말. suscenes.js 다음에 불러온다. 이름은 su 접두사.
   물리 규칙: 컵라면·두유·영수증은 손이나 좌판·책상 윗면 위 · 앉을 땐 엉덩이가 면 위 · 역광 장면은 실루엣 · 소품이 얼굴을 가리지 않게. */
Object.assign(QBG, { elev: 'ai/elev.png', gate: 'ai/gate.png', exroom: 'ai/exroom.png', runway: 'ai/runway.png', gatedusk: 'ai/gatedusk.png', campus: 'ai/campus.png', oneroom: 'ai/oneroom.png', bedn: 'ai/bedn.png', living: 'ai/living.png', office: 'ai/office.png' });
['sureceipt', 'sumont', 'suadults', 'suelev', 'sugate', 'sulunch', 'suplane', 'sudusk', 'suend'].forEach(k => CAMS[k] = 'fixed');
P['su양반'] = Object.assign({}, P['서기'], { armL: [[148, 285], [118, 372], [112, 432]], hL: [110, 436], armR: [[252, 285], [282, 372], [288, 432]], hR: [290, 436], legL: [[188, 412], [104, 440], [224, 456]], fL: [236, 456, 0], legR: [[212, 412], [296, 440], [176, 456]], fR: [164, 456, 0], dy: 0 });
const SU_PANTS = '#8A8F9C';
const suPose = (base, o) => Object.assign({}, typeof base === 'string' ? P[base] : base, o);

/* ---------- 소품 ---------- */
// 트레이닝 바지(무릎 나온): 캐릭터 다음, 슬리퍼 전에 그린다
function suPants(x, y, s, pose) { const p = typeof pose === 'string' ? P[pose] : pose, dy = p.dy || 0;
  const pts = l => l.map(q => `${f1(q[0])},${f1(q[1] + dy)}`).join(' ');
  const knee = l => `<circle cx="${f1(l[1][0])}" cy="${f1(l[1][1] + dy)}" r="21" fill="${SU_PANTS}" stroke="${INK}" stroke-width="6"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000}) translate(-200 -560)"><g fill="none" stroke-linecap="round" stroke-linejoin="round">` +
    [p.legL, p.legR].map(l => `<polyline points="${pts(l)}" stroke="${INK}" stroke-width="42"/>`).join('') + [p.legL, p.legR].map(l => `<polyline points="${pts(l)}" stroke="${SU_PANTS}" stroke-width="30"/>`).join('') + `</g>` +
    knee(p.legL) + knee(p.legR) + `<rect x="142" y="${f1(394 + dy)}" width="116" height="30" rx="10" fill="${SU_PANTS}" stroke="${INK}" stroke-width="6"/></g>`; }
// 컵라면. 원점 = 바닥 가운데. o.open: 뚜껑 열림(면·김)
function suCup(x, y, s, t, o = {}) { let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})">`;
  h += `<path d="M-30 0 L-38 -62 L38 -62 L30 0 Z" fill="#FFF8EC" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-36 -46 L36 -46 L34 -30 L-34 -30 Z" fill="#E5484D"/><path d="M-30 0 L-38 -62 L38 -62 L30 0 Z" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  if (o.open) { h += `<ellipse cx="0" cy="-62" rx="38" ry="9" fill="#F2C76E" stroke="${INK}" stroke-width="4"/><path d="M-24 -64 q8 -6 16 0 q8 6 16 0 q8 -6 14 0" fill="none" stroke="#C99A3E" stroke-width="3"/>`;
    h += `<path d="M28 -66 L56 -96" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M34 -64 L64 -90" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`; // 나무젓가락
    for (let i = 0; i < 3; i++) { const k = (t * 0.6 + i / 3) % 1; h += `<path d="M${-16 + i * 16} ${f1(-70 - k * 70)} q-8 -12 0 -24 q8 -12 0 -24" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="${f1((1 - k) * 0.7 * 100) / 100}"/>`; } }
  else h += `<ellipse cx="0" cy="-62" rx="40" ry="10" fill="#F4F1EA" stroke="${INK}" stroke-width="4"/><path d="M-12 -66 l24 0" stroke="#E5484D" stroke-width="4"/>`;
  return h + `</g>`; }
// 따뜻한 두유(유리병). 원점 = 바닥 가운데
function suMilk(x, y, s, t, o = {}) { let h = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${f1(s * 1000) / 1000})">`;
  h += `<path d="M-16 0 L-16 -40 Q-16 -52 -8 -58 L-8 -66 L8 -66 L8 -58 Q16 -52 16 -40 L16 0 Z" fill="#F2E6C8" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="-10" y="-74" width="20" height="10" rx="3" fill="#8A5A34" stroke="${INK}" stroke-width="3"/><rect x="-16" y="-34" width="32" height="18" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
  if (o.warm !== false) for (let i = 0; i < 2; i++) { const k = (t * 0.5 + i / 2) % 1; h += `<path d="M${-6 + i * 12} ${f1(-82 - k * 30)} q-5 -8 0 -16" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="${f1((1 - k) * 0.6 * 100) / 100}"/>`; }
  return h + `</g>`; }
// 영수증 쪽지. o.lines: 손글씨 줄 수(뒷면), o.fold: 0~1 접힘
function suSlip2(x, y, s, o = {}) { const fold = o.fold || 0, sy = 1 - 0.8 * fold;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${f1(s * 1000) / 1000} ${f1(s * sy * 1000) / 1000})"><path d="M-30 -44 L30 -44 L30 40 l-6 5 l-6 -5 l-6 5 l-6 -5 l-6 5 l-6 -5 l-6 5 l-6 -5 l-6 5 l-6 -5 Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  for (let i = 0; i < (o.lines || 0); i++) h += `<line x1="-22" y1="${-30 + i * 11}" x2="${i % 2 ? 10 : 18}" y2="${-30 + i * 11}" stroke="#4B5E9A" stroke-width="3" stroke-linecap="round"/>`;
  return h + `</g>`; }
// 엄지 척
const suThumb = (x, y, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-20" y="-16" width="40" height="34" rx="12" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="-8" y="-46" width="18" height="36" rx="9" fill="#fff" stroke="${INK}" stroke-width="6"/></g>`;
// 낡은 예언이(어른들 머리 위): 빛바랜 색, 반창고 붙은 구슬, 쿨쿨
function suOldYe(t, x, y, s, seed = 0, o = {}) {
  const band = `<g transform="rotate(-30)"><rect x="-46" y="-14" width="92" height="28" rx="12" fill="#F2D3A8" stroke="${INK}" stroke-width="5"/><rect x="-14" y="-12" width="28" height="24" fill="#E6BE8A"/></g>`;
  let h = `<g opacity=".92" filter="url(#suFade)">` + suYe(t, { x, y, s, R: 32, inner: suDim('#D8D2EA') + band, eyes: o.awake ? 'wide' : 'shut', glow: o.awake ? 0.5 : 0, rot: o.awake ? 0 : 6, seed, id: 'old' + seed + (o.id || ''), still: !o.awake, raise: o.raise || 0, talk: o.talk || 0 }) + `</g>`;
  if (!o.awake) { const k = (t * 0.5 + seed * 0.3) % 1; h += `<g opacity="${f1(Math.sin(k * Math.PI) * 100) / 100}">${fT(x + 34 * s + k * 30 * s, y - 150 * s - k * 50 * s, 'z', 26 * s + 10, '#fff', { stroke: INK, sw: 5 })}</g>`; }
  return h; }
const suFadeDefs = () => `<defs><filter id="suFade"><feColorMatrix type="saturate" values=".45"/></filter></defs>`;

/* ---------- 벤치 2막·3막 (subenchScene이 ph ≥ 10일 때 부른다) ---------- */
const SB_CUP = [960, SB.S - 20]; // 좌판 위 컵라면 자리
const SB_MILK_SEAT = [1262, SB.S - 20];
function suBench2(t, lt, a) {
  const ph = a.ph, s = 0.95, wy = SB_SIT(s), zs = 1.0, zSitY = SB_SIT(zs);
  E['_suz'] = qTalk('z기본', env(t)); E['_suz2'] = qTalk('z빵긋', env(t)); E['_suz3'] = qTalk('z민망', env(t) * 0.8); E['_suz4'] = qTalk('z멍', env(t) * 0.8); E['_suz5'] = qTalk('z의심', env(t) * 0.8);
  E['_suw'] = qTalk('z기본', env(t) * 0.7); E['_suw3'] = qTalk('z의심', env(t) * 0.7); E['_suw4'] = qTalk('z히죽', env(t) * 0.7);
  const yeTop = wy + (40 - 560) * s, zTop = zSitY + (44 - 560) * zs;
  // 기본 상태
  let zx = SB_ZX, zy = zSitY, zSit = 1, zPose = P['f앉기'], zEx = fEx('z기본'), zLook = [0.7, 0.1], zFlipped = false, zOp = 1, zHold = null; // zHold: 'cup' | 'cupOpen' | 'give' | 'receipt'
  let wEx = fEx('z기본'), wLook = [-0.6, 0.2], wHold = 'milk', wPose = P['f앉기L'], wLap = false, cupOnSeat = false, milkOnSeat = false, wBounce = 0, zBounce = 0;
  let cam = [960, 650, 1.3], yeState = 'norm', zOld = false;
  const HOLD_W = suPose('f앉기L', { armL: [[148, 285], [146, 340], [176, 350]], hL: [180, 350], armR: [[252, 285], [236, 342], [206, 350]], hR: [202, 350] });
  const HOLD_Z = suPose('f앉기', { armL: [[148, 285], [170, 340], [228, 362]], hL: [232, 362], armR: [[252, 285], [282, 336], [268, 362]], hR: [266, 362] });
  const milkInW = () => { const [mx, my] = ptOf(SB_SX, wy, s, 191, 372); return suMilk(mx, my, 0.95, t); };
  if (ph === 10) { // 일어나 편의점에 들어갔다 나온다
    cam = [1060, 640, 1.08]; wHold = null; wEx = fEx('z멍'); wLook = [-0.1, 0.5];
    const up = suK(0, 0.4, lt), w1 = suK(0.4, 1.4, lt), w2 = suK(2.0, 3.4, lt);
    if (lt < 0.4) { zSit = 1 - up; zy = lerp(zSitY, SB.F, easeInOut(up)); zPose = up > 0.5 ? '서기' : P['f앉기']; }
    else if (lt < 2.0) { zSit = 0; zy = SB.F; zx = lerp(SB_ZX, 1520, easeInOut(w1)); zPose = lt < 1.4 ? walkPose(lt * 7.5, 0.7) : '서기'; zLook = [1, 0]; zOp = 1 - suK(1.2, 1.45, lt); }
    else { zSit = 0; zy = SB.F; zx = lerp(1520, 900, easeInOut(w2)); zPose = lt < 3.4 ? walkPose(lt * 7.5, 0.7) : '서기'; zFlipped = lt < 3.4; zLook = [0.6, 0]; zOp = suK(2.0, 2.25, lt); zHold = 'carry'; wLook = lt > 2.6 ? [-0.7, 0.1] : [-0.1, 0.5]; }
  }
  if (ph === 11) { cam = [1000, 640, 1.32]; zSit = 0; zy = SB.F; zx = 900; const tG = fAt(a, '이거', 0.5) + 0.25, give = suK(0, tG, lt), taken = lt > tG + 0.2;
    zPose = suPose('서기', { armR: [[252, 285], lerp(296, 330, give) > 0 ? [lerp(290, 320, give), lerp(330, 300, give)] : [290, 330], [lerp(286, 392, give), lerp(380, 306, give)]], hR: [lerp(286, 396, give), lerp(380, 304, give)], armL: [[148, 285], [128, 340], [134, 392]], hL: [134, 396] });
    zEx = lt < fAt(a, '라면', 1.6) - 0.2 ? fEx('_suz') : fEx('_suz2'); zLook = [0.8, 0.1]; zHold = taken ? 'cupOnly' : 'give';
    wHold = taken ? 'milk' : null; wEx = taken ? fEx('z기본') : exprAt([[0, 'z기본'], [0.3, 'z당황']], lt); wLook = [-0.8, -0.1];
    if (!taken) wPose = suPose('f앉기L', { armL: [[148, 285], [96, 300], [lerp(96, 60, give), 290]], hL: [lerp(96, 56, give), 288] }); }
  if (ph === 12) { cam = [960, 650, 1.25]; const sit = suK(0, 0.6, lt), put = suK(0.7, 1.1, lt), rec = suK(1.3, 2.1, lt);
    zx = lerp(900, SB_ZX, easeInOut(sit)); zSit = sit; zy = lerp(SB.F, zSitY, easeInOut(sit)) - Math.sin(sit * Math.PI) * 46; zPose = sit < 1 ? '서기' : P['f앉기'];
    zHold = put < 1 ? 'cupOnly' : rec > 0 ? 'receipt' : null; cupOnSeat = put >= 1; zLook = [0.7, 0.2]; zEx = fEx('z기본'); wHold = 'milk'; wLook = [-0.6, 0.3]; wEx = fEx('z멍'); }
  if (ph === 13) { cam = [960, 650, 1.36]; cupOnSeat = true; zHold = 'offer'; zPose = suPose('f앉기', { armR: [[252, 285], [300, 300], [356, 300]], hR: [360, 298] });
    const tS = fAt(a, '삼촌', 3.6); zEx = lt < tS - 0.2 ? fEx('_suz') : fEx('_suz3'); zLook = [0.8, -0.1]; wHold = 'milk'; wEx = exprAt([[0, 'z멍'], [1.2, 'z의심']], lt); wLook = [-0.8, 0]; }
  if (ph === 14) { cam = [1080, 640, 1.5]; cupOnSeat = true; const take = lt > 0.55; zHold = take ? null : 'offer'; if (!take) zPose = suPose('f앉기', { armR: [[252, 285], [300, 300], [356, 300]], hR: [360, 298] });
    wHold = take ? 'receipt' : null; milkOnSeat = true; wEx = fEx('_suw3'); wLook = [-0.8, -0.1]; zEx = fEx('z빵긋'); }
  if (ph >= 15) { cupOnSeat = false; zHold = 'cupOpen'; zPose = HOLD_Z; wLap = true; milkOnSeat = false; wHold = 'milk'; }
  if (ph === 15) { cam = qLerpCam(lt / 2, [960, 660, 1.25], [960, 650, 1.32]); zEx = fEx('z하트눈'); zLook = [0.1, 0.6]; wEx = fEx('z기본'); wLook = [-0.7, 0.1]; }
  if (ph === 16) { cam = [1080, 640, 1.52]; wEx = fEx('_suw'); wLook = [-0.85, -0.1]; zEx = fEx('z기본'); zLook = [0.6, 0.4]; }
  if (ph === 17) { cam = [800, 620, 1.55]; const tN = fAt(a, '근데', 3.6); zEx = lt < 0.6 ? fEx('_suz') : lt < tN - 0.2 ? fEx('_suz4') : fEx('_suz5'); zLook = lt < 0.6 ? [0.8, 0] : lt < tN ? [0.3, -0.9] : [0.4, -0.2];
    if (lt > tN) zPose = suPose(HOLD_Z, { armR: [[252, 285], [300, 240], [280, 150]], hR: [276, 142] }); wEx = fEx('z기본'); wLook = [-0.8, 0]; }
  if (ph === 18) { cam = [1080, 640, 1.52]; wEx = fEx('_suw4'); wLook = [-0.85, 0]; zEx = fEx('z민망'); }
  if (ph === 19) { cam = [960, 650, 1.3]; wEx = fEx('_suw3'); wLook = lt < 0.8 ? [-0.8, -0.6] : [-0.8, 0.6]; zEx = fEx('z기본'); zLook = [0.6, 0.2]; }
  if (ph === 20) { zEx = fEx('z멍'); zLook = [0.6, 0.2]; zOld = true; wLook = [-0.8, 0.6];
    const shots = [[790, 450, 2.6], [868, 880, 2.4], [884, 1000, 2.6], [858, 770, 2.7]]; cam = shots[Math.min(3, Math.floor(lt / 0.65))]; }
  if (ph === 21) { cam = [810, 560, 1.95]; zEx = fEx('_suz3'); zLook = [0.7, 0.2]; zOld = true; zPose = suPose(HOLD_Z, {}); }
  if (ph === 22) { cam = [960, 650, 1.3]; zOld = true; const laugh = lt > 0.6; zEx = fEx(laugh ? 'z빵긋' : 'z민망'); wEx = fEx(laugh ? 'z빵긋' : 'z멍');
    zLook = [0.7, 0]; wLook = [-0.7, 0]; if (laugh) { zBounce = Math.abs(Math.sin((lt - 0.6) * 10)) * Math.exp(-(lt - 0.6) * 0.8); wBounce = Math.abs(Math.sin((lt - 0.6) * 10 + 1)) * Math.exp(-(lt - 0.6) * 0.8); } }
  if (ph === 23) { cam = qLerpCam(lt / 3.2, [960, 650, 1.26], [990, 630, 1.36]); zOld = true; zEx = fEx('z기본'); zLook = [0.5, 0.4]; wEx = fEx('z기본'); wLook = [-0.2, 0.5]; yeState = 'sleep';
    const fold = suK(1.2, 1.8, lt), pocket = suK(1.9, 2.5, lt); wLap = fold < 1; if (fold > 0) { wHold = pocket < 1 ? 'fold' : 'milk'; } }
  // --- 그리기 ---
  let w = suBenchBack() + qShadow(SB_SX, SB.F, 70, 0.6);
  const wPoseNow = wHold === 'milk' || wHold === 'receipt' || wHold === 'fold' ? HOLD_W : wPose;
  w += `<g transform="translate(0 ${f1(-wBounce * 10)})">` + SY({ x: SB_SX, y: wy, s, t, pose: wPoseNow, ex: wEx, look: wLook }) + `</g>`;
  if (wLap) w += suSlip2(SB_SX - 62, wy - 158, 0.6, { lines: 6, rot: -90 }); // 무릎 위 영수증
  const zDraw = (x, y, pose) => { const z = ZS({ x, y, s: zs, t, pose, ex: zEx, look: zLook, seed: 3 }) + suPants(x, y, zs, pose) + suSlip(x, y, zs, typeof pose === 'string' ? P[pose] : pose);
    return zFlipped ? flip(x, z) : z; };
  if (zSit > 0) w += `<g transform="translate(0 ${f1(-zBounce * 10)})">` + zDraw(zx, zy, zSit >= 1 ? zPose : '서기') + `</g>`;
  w += suBenchSeat();
  if (cupOnSeat) w += suCup(SB_CUP[0], SB_CUP[1], 0.95, t);
  if (milkOnSeat) w += suMilk(SB_MILK_SEAT[0], SB_MILK_SEAT[1], 1, t);
  if (zSit === 0) w += `<g opacity="${f1(zOp * 100) / 100}">${qShadow(zx, SB.F, 62)}${zDraw(zx, zy, zPose)}</g>`;
  // 손에 든 것
  const zH = (lx, ly) => ptOf(zx, zy, zs, lx, ly);
  if (zHold === 'carry') { const [ax, ay] = zH(zPose.hL ? zPose.hL[0] : 134, zPose.hL ? zPose.hL[1] : 396), [bx, by] = zH(zPose.hR ? zPose.hR[0] : 266, zPose.hR ? zPose.hR[1] : 396);
    const pL = zFlipped ? [2 * zx - ax, ay] : [ax, ay], pR = zFlipped ? [2 * zx - bx, by] : [bx, by]; w += `<g opacity="${f1(zOp * 100) / 100}">${suCup(pL[0], pL[1] + 24, 0.7, t)}${suMilk(pR[0], pR[1] + 22, 0.8, t)}</g>`; }
  if (zHold === 'give' || zHold === 'cupOnly') { const [cx0, cy0] = zH(134, 396); w += suCup(cx0, cy0 + 26, 0.75, t); if (zHold === 'give') { const [gx, gy] = zH(zPose.hR[0], zPose.hR[1]); w += suMilk(gx, gy + 24, 0.85, t); } }
  if (zHold === 'receipt') { const k = suK(1.3, 2.1, lt), [rx, ry] = zH(lerp(250, 300, k), lerp(400, 330, k)); w += suSlip2(rx, ry - 30, 0.9, { rot: -10, lines: 0 }) + (lt > 2.0 ? `<path d="M${f1(rx + 20)} ${f1(ry - 70)} l26 -40" stroke="#2B2F3A" stroke-width="8" stroke-linecap="round"/>` : ''); }
  if (zHold === 'offer') { const [rx, ry] = zH(360, 298); w += suSlip2(rx + 6, ry - 40, 0.95, { rot: 8 }) + `<path d="M${f1(rx - 14)} ${f1(ry - 20)} l40 -44" stroke="#2B2F3A" stroke-width="8" stroke-linecap="round"/>`; }
  if (zHold === 'cupOpen') { const [cx0, cy0] = zH(249, 362); w += suCup(cx0, cy0 + 6, 0.85, t, { open: true }); }
  if (wHold === 'milk') w += milkInW();
  if (wHold === 'receipt') { const [rx, ry] = ptOf(SB_SX, wy, s, 191, 350); w += suSlip2(rx, ry - 30, 0.9, { rot: -6 }) + `<path d="M${f1(rx + 18)} ${f1(ry - 20)} l22 -36" stroke="#2B2F3A" stroke-width="7" stroke-linecap="round"/>`; }
  if (wHold === 'fold') { const k = suK(1.2, 1.8, lt), p2 = suK(1.9, 2.5, lt), [rx, ry] = ptOf(SB_SX, wy, s, lerp(191, 250, p2), lerp(350, 390, p2)); if (p2 < 0.95) w += suSlip2(rx, ry - 30, 0.9, { rot: -6, lines: 6, fold: k }); }
  // 입김
  const [wmx, wmy] = ptOf(SB_SX, wy - wBounce * 10, s, 190, 236);
  w += suBreath(wmx - 14, wmy, t, 0.1, -1);
  if (zSit >= 1) { const [zmx, zmy] = ptOf(zx, zy - zBounce * 10, zs, 214, 236); w += suBreath(zmx + 10, zmy, t, 0.6, 1); }
  // 예언이들
  if (ph <= 14 || ph === 15) { // 영수증을 쓰기 전·직후: 서윤의 예언이는 아직 경계 중
    w += suYe(t, { x: SB_SX + 4, y: yeTop + 4 - wBounce * 10, s: 0.82, R: 34, inner: ph >= 15 ? suDay(t, 0.8) : suV.exam(t, 0.8), eyes: ph >= 15 ? 'norm' : 'squint', glow: 0.4, id: 'bb' + ph }); }
  else if (yeState === 'sleep') { const yawn = lt < 1.1, sit = suK(0.9, 1.5, lt);
    w += suYe(t, { x: SB_SX + 4, y: yeTop + 4, s: 0.82, sy: 1 - 0.12 * sit, R: 34, inner: suDay(t, 0.7), eyes: yawn ? 'shut' : 'shut', mouth: yawn && lt > 0.2 ? 'o' : null, glow: 0.2, rot: 6 * sit, still: sit > 0.5, id: 'bslp' });
    if (!yawn) { const k = (t * 0.5) % 1; w += `<g opacity="${f1(Math.sin(k * Math.PI) * 100) / 100}">${fT(SB_SX + 40 + k * 26, yeTop - 120 - k * 40, 'z', 34, '#fff', { stroke: INK, sw: 5 })}</g>`; } }
  else w += suYe(t, { x: SB_SX + 4, y: yeTop + 4 - wBounce * 10, s: 0.82, R: 34, inner: suDay(t, 0.75), eyes: ph === 22 ? 'wide' : 'norm', glow: 0.35, id: 'bc' + ph });
  if (zOld && zSit >= 1) w += suOldYe(t, zx + 2, zTop - zBounce * 10, 0.7, 1, { id: 'z' });
  // 효과
  let over = '';
  if (ph === 10 && lt > 1.4 && lt < 2.2) over += fx(t, t - lt + 1.4, t - lt + 2.2, 1500, 300, '띵동~', '#fff', { size: 50, rot: -6 });
  if (ph === 22 && lt > 0.6) over += fx(t, t - lt + 0.6, t + 9, 960, 280, '풉!', '#FFE34D', { size: 70, rot: -6 });
  if (ph === 20) { const labels = ['까치집', '무릎 나온 바지', '삼선 슬리퍼', '컵라면']; const i = Math.min(3, Math.floor(lt / 0.65)); over += pop(t, t - lt + i * 0.65 + 0.05, t + 9, 960, 200, label(0, 0, labels[i], { size: 44, bg: '#fff' }), { rot: -4 }); }
  const light = `<circle cx="1500" cy="760" r="900" fill="url(#suLamp)" opacity=".55"/>`;
  return suDefs() + qDefs() + suFadeDefs() + suPlate('cvsapt', cam, 0.6) + qCam(cam, w + light) + fFull('#0A1238', 0.2) + warm(ph >= 15 ? 0.22 : 0.12) + over;
}

/* ---------- 영수증 뒷면에 다음 주 화요일 쓰기 + 구슬이 넓어진다 ---------- */
const SU_DAY = ['7:00 기상', '학교', '급식 (화요일은 돈가스!)', '지은이랑 떡볶이', '웹툰', '잠'];
function suDayWide(t, zoom) { // suDay + 바깥 고리(알람·학교·이불): zoom < 1이면 보인다
  const it = (x, y, g) => `<g transform="translate(${x} ${y})">${g}</g>`;
  let outer = `<rect x="-300" y="-300" width="600" height="600" fill="#EFE3CC"/>`;
  outer += it(-150, -10, `<circle r="22" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M0 0 L0 -12 M0 0 L9 4" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="-18" cy="-20" r="7" fill="#E5484D" stroke="${INK}" stroke-width="3"/><circle cx="18" cy="-20" r="7" fill="#E5484D" stroke="${INK}" stroke-width="3"/>`); // 알람
  outer += it(150, -6, `<rect x="-30" y="-24" width="60" height="44" fill="#F4E1C1" stroke="${INK}" stroke-width="4"/><path d="M-36 -24 L0 -48 L36 -24 Z" fill="#C9564A" stroke="${INK}" stroke-width="4"/><rect x="-8" y="0" width="16" height="20" fill="#8A5A34"/>`); // 학교
  outer += it(0, 150, `<rect x="-40" y="-12" width="80" height="26" rx="8" fill="#9FB4E8" stroke="${INK}" stroke-width="4"/><ellipse cx="-24" cy="-14" rx="16" ry="9" fill="#fff" stroke="${INK}" stroke-width="3"/>`); // 잠
  outer += it(0, -150, `<circle r="14" fill="#FFD23F" stroke="${INK}" stroke-width="4"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="0" y1="-20" x2="0" y2="-28" stroke="#F2A93B" stroke-width="4" stroke-linecap="round" transform="rotate(${i * 45})"/>`).join('')}`); // 아침
  return `<g transform="scale(${f1(zoom * 1000) / 1000})">${outer}${suDay(t, 1)}</g>`;
}
function sureceiptScene(t, lt, a) {
  const ph = a.ph, D = 6.0;
  const n = ph === 1 ? clamp(Math.floor((lt - 0.4) / 0.85) + 1, 0, 6) : 6, nk = ph === 1 ? clamp((lt - 0.4) / (0.85 * 6), 0, 1) : 1;
  const zoom = lerp(4.2, 0.62, easeInOut(nk)), shake = ph === 1 && lt > 2.6 && lt < 3.5 ? Math.sin(t * 40) * 8 : 0;
  let w = `<rect x="-300" y="-200" width="2600" height="1500" fill="#1C1838"/><circle cx="1360" cy="520" r="560" fill="url(#suGlow)" opacity=".5"/>`;
  // 왼쪽: 무릎 위 영수증(크게) — 손글씨 줄이 하나씩
  const rx = 560, ry = 540;
  w += `<g transform="translate(${rx} ${ry}) rotate(-4)"><path d="M-300 -400 L300 -400 L300 390 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 l-25 20 l-25 -20 Z" fill="#FFFDF6" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>`;
  w += fT(-250, -320, '다음 주 화요일', 56, '#2C3D7A', { anchor: 'start' }) + `<path d="M-252 -300 Q-60 -288 120 -302" stroke="#2C3D7A" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  SU_DAY.forEach((s0, i) => { if (i >= n) return; const k = ph === 1 ? clamp((lt - 0.4 - i * 0.85) / 0.6, 0, 1) : 1, txt = s0.slice(0, Math.ceil(s0.length * k));
    w += fT(-240, -200 + i * 100, '· ' + txt, 46, '#2C3D7A', { anchor: 'start', w: 700 }); });
  if (ph >= 2) { const k = ph === 2 ? easeOut(suK(0.3, 1.0, lt)) : 1; w += `<ellipse cx="-30" cy="${-200 + 3 * 100 - 14}" rx="${f1(240 * k)}" ry="46" fill="none" stroke="#E5484D" stroke-width="7" opacity="${f1(k * 100) / 100}"/>`; }
  // 펜(쓰는 줄 끝을 따라간다)
  if (ph === 1) { const i = Math.min(5, Math.max(0, n - 1)), k = clamp((lt - 0.4 - i * 0.85) / 0.6, 0, 1), px = -240 + 60 + SU_DAY[i].length * 46 * k * 0.9, py = -200 + i * 100;
    w += `<g transform="translate(${f1(px)} ${f1(py - 10 + Math.sin(t * 30) * 3)}) rotate(35)"><rect x="-10" y="-130" width="20" height="130" rx="8" fill="#2B2F3A" stroke="${INK}" stroke-width="4"/><path d="M-10 0 L0 22 L10 0 Z" fill="#E9E4F7" stroke="${INK}" stroke-width="4"/></g>${hand(px + 40, py - 70, 1.2)}`; }
  w += `</g>`;
  // 오른쪽: 예언이의 구슬(크게) — 줄이 늘 때마다 줌 아웃
  const bx = 1380 + shake, by = 560, R = 330;
  const yeEyes = ph === 1 ? (lt < 2.4 ? 'squint' : 'wide') : ph === 2 ? 'wide' : 'norm';
  w += `<g transform="translate(${bx} ${by - R - 50})"><path d="M-46 0 Q0 -10 46 0 L16 -96 Q8 -108 -2 -100 Z" fill="${SU_PUR_D}" stroke="${INK}" stroke-width="7"/><ellipse cx="0" cy="0" rx="56" ry="13" fill="${SU_PUR}" stroke="${INK}" stroke-width="7"/>` +
    `<g transform="translate(8 -104)">${zStar(0, 0, 18, SU_GOLD, 4)}</g></g>`;
  // 구슬 위로 빼꼼 나온 눈
  const ey = by - R - 18; w += `<g transform="translate(${bx} ${ey})"><ellipse cx="0" cy="0" rx="70" ry="30" fill="#fff" stroke="${INK}" stroke-width="7"/>` +
    (yeEyes === 'squint' ? `<path d="M-40 -2 l26 -4 M14 -6 l26 4" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>` : [-1, 1].map(sd => `<circle cx="${sd * 26}" cy="-2" r="${yeEyes === 'wide' ? 16 : 12}" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="${sd * 26 + (shake ? sd * 3 : 0)}" cy="0" r="${yeEyes === 'wide' ? 6 : 7}" fill="${INK}"/>`).join('')) + `</g>`;
  w += suBall(bx, by, R, t, suDayWide(t, zoom), { glow: 0.5, id: 'rc' });
  w += [-1, 1].map(sd => `<circle cx="${bx + sd * (R - 26)}" cy="${by + R * 0.64}" r="48" fill="#fff" stroke="${INK}" stroke-width="9"/>`).join('');
  let over = '';
  if (shake) over += fx(t, t - lt + 2.6, t - lt + 3.5, 1760, 230, '어? 어?', '#fff', { size: 54, rot: 6 });
  if (ph === 3) { const tA = fAt(a, '아무리', 3.0); if (lt > tA) over += pop(t, t - lt + tA, t + 99, 1380, 960, label(0, 0, '시험은 하루 중 한 칸', { size: 40, bg: YEL }), { rot: -2 }); }
  return suDefs() + w + over;
}

/* ---------- 몽타주: 열여덟 살부터 지금까지 (말 없이) ---------- */
const SU_MONT = [['2010년 11월', 'bedn'], ['2011년 3월', 'campus'], ['2013년', 'oneroom'], ['2017년', 'living'], ['2026년 11월', 'cvsapt']];
function suHeart(t, n, lt0) { // 오른쪽 위 하트: 금 + 반창고 n장(마지막 장은 일꾼이 붙이는 중)
  const BP = [[-30, -24, -30], [32, 10, 28], [-18, 34, 12], [26, -40, -18]];
  let h = `<g transform="translate(1690 230)"><circle r="150" fill="#1C1838" opacity=".55"/><path d="M0 92 C-70 40 -112 -4 -112 -46 C-112 -84 -82 -108 -50 -108 C-26 -108 -8 -94 0 -76 C8 -94 26 -108 50 -108 C82 -108 112 -84 112 -46 C112 -4 70 40 0 92 Z" fill="${n >= 4 ? '#FF8FA8' : '#F08A9E'}" stroke="${INK}" stroke-width="8"/>`;
  if (n < 4) h += `<path d="M-6 -70 L10 -40 L-12 -10 L12 22 L-4 52" fill="none" stroke="${INK}" stroke-width="7" stroke-linejoin="round" opacity="${f1((1 - n / 4) * 100) / 100}"/>`;
  for (let i = 0; i < n; i++) { const [x, y, r] = BP[i], k = i === n - 1 ? easeOutBack(clamp((lt0 - 0.5) / 0.4, 0, 1)) : 1;
    h += `<g transform="translate(${x} ${y}) rotate(${r}) scale(${f1(k * 1000) / 1000})"><rect x="-38" y="-13" width="76" height="26" rx="12" fill="#F2D3A8" stroke="${INK}" stroke-width="5"/><rect x="-12" y="-11" width="24" height="22" fill="#E6BE8A"/></g>`; }
  if (n > 0 && lt0 < 1.2) { const [x, y] = BP[n - 1], k = clamp(lt0 / 0.5, 0, 1), wx = lerp(170, x + 30, easeOut(k)), wy = lerp(80, y + 20, easeOut(k)); // 반창고 일꾼
    h += `<g transform="translate(${f1(wx)} ${f1(wy)})"><circle cx="0" cy="-26" r="10" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M-8 -16 L8 -16 L10 4 L-10 4 Z" fill="#F2D3A8" stroke="${INK}" stroke-width="3"/><path d="M-4 4 l-3 10 M4 4 l3 10" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>`; }
  return h + `</g>`; }
function sumontScene(t, lt, a) {
  const D = 2.7, i = Math.min(4, Math.floor(lt / D)), l2 = lt - i * D, sat = [0.15, 0.35, 0.55, 0.8, 1][i];
  const cam = i === 0 ? qLerpCam(l2 / D, [1300, 700, 1.5], [1310, 680, 1.65]) : qLerpCam(l2 / D, [960, 600, 1.12], [960, 590, 1.2]);
  let w = '', ex = '';
  if (i === 0) { // 열여덟 살 제로, 이불 속. 젊은 예언이의 폭풍 구슬
    w += `<rect x="1060" y="600" width="560" height="260" rx="26" fill="#6E5A48" stroke="${INK}" stroke-width="8"/><ellipse cx="1330" cy="772" rx="170" ry="46" fill="#F4F1EA" stroke="${INK}" stroke-width="7"/>`;
    w += ZS({ x: 1330, y: 1046, s: 0.8, t, pose: '서기', ex: fEx('z울먹'), look: [0, -0.8], still: true });
    w += `<path d="M1010 790 Q1330 750 1650 790 L1720 1150 L940 1150 Z" fill="#7C8FC4" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>`;
    w += suYe(t, { x: 1336, y: 612, s: 1.1, raise: 1, R: 56, inner: suSeq(t, l2, [suV.x, suV.stairs, suV.rain], 0.8), eyes: 'wide', talk: Math.abs(Math.sin(t * 9)) * 0.7, glow: 0.8, id: 'm0' });
  }
  if (i === 1) { const tap = l2 > 1.2; // 캠퍼스 첫날: 어색하게 혼자 → 어깨를 툭
    w += qShadow(900, 1000, 62) + ZS({ x: 900, y: 1000, s: 1, t, pose: tap ? '서기' : suPose('서기', { armL: [[148, 285], [130, 300], [170, 330]], hL: [174, 330] }), ex: fEx(tap ? 'z빵긋' : 'z당황'), look: tap ? [0.9, 0] : [-0.3, 0.3] }) + suPants(900, 1000, 1, '서기');
    const fx0 = lerp(1500, 1140, easeOut(suK(0.2, 1.1, l2)));
    w += qShadow(fx0, 1000, 60) + fGrey(fx0, 1000, 1, t, 2, { pose: l2 > 1.0 ? suPose('서기', { armL: [[148, 285], [90, 270], [40, 250]], hL: [34, 246] }) : walkPose(l2 * 7, 0.6), ex: fEx('z빵긋'), look: [-0.9, 0] });
  }
  if (i === 2) { // 좁은 자취방, 친구들과 컵라면 (양반다리로 바닥에)
    const T = 860; w += `<rect x="700" y="${T}" width="520" height="26" rx="8" fill="#C99566" stroke="${INK}" stroke-width="7"/><path d="M740 ${T + 26} L740 ${T + 120} M1180 ${T + 26} L1180 ${T + 120}" stroke="#8E6A48" stroke-width="14" stroke-linecap="round"/>`;
    const sitY = 1000 + 60; [[620, 'Z'], [1300, 'G']].forEach(([x, k], j) => { w += k === 'Z' ? ZS({ x, y: sitY, s: 0.95, t, pose: P['su양반'], ex: fEx('z빵긋'), look: [0.8, 0.2] }) : fGrey(x, sitY, 0.95, t, 3, { pose: P['su양반'], ex: fEx('z빵긋'), look: [-0.8, 0.2] }); });
    w += fGrey(960, sitY - 30, 0.85, t, 1, { pose: P['su양반'], ex: fEx('z빵긋'), look: [0, 0.4] });
    w += suCup(800, T, 0.9, t, { open: true }) + suCup(960, T, 0.9, t, { open: true }) + suCup(1120, T, 0.9, t, { open: true });
  }
  if (i === 3) { // 첫 월급날, 부모님께 내복 상자
    const give = easeOut(suK(0.2, 1.0, l2));
    w += qShadow(760, 1000, 60) + ZS({ x: 760, y: 1000, s: 1, t, pose: suPose('서기', { armL: [[148, 285], [190, 330], [262, 330]], hL: [266, 330], armR: [[252, 285], [300, 330], [330, 330]], hR: [334, 330] }), ex: fEx('z뿌듯'), look: [0.9, 0], rot: 6 * give }) + suPants(760, 1000, 1, '서기');
    const bx0 = lerp(860, 900, give); w += `<g transform="translate(${f1(bx0)} 760)"><rect x="-70" y="-50" width="140" height="100" rx="8" fill="#E5484D" stroke="${INK}" stroke-width="7"/><path d="M0 -50 L0 50 M-70 0 L70 0" stroke="${SU_GOLD}" stroke-width="10"/><path d="M-20 -62 q20 -20 20 12 q0 -32 20 -12" fill="none" stroke="${SU_GOLD}" stroke-width="7"/></g>`;
    w += qShadow(1150, 1000, 60) + fGrey(1150, 1000, 1, t, 0, { vest: '#E8A0B4', hair: '#4A3A3A', pose: suPose('서기', { armL: [[148, 285], [120, 260], [150, 220]], hL: [156, 214] }), ex: fEx('z울먹'), look: [-0.9, 0] });
    w += qShadow(1400, 1000, 62) + fGrey(1400, 1000, 1.04, t, 1, { vest: '#8A6A4E', hair: '#3A3A3A', ex: fEx('z빵긋'), look: [-0.9, 0] });
  }
  if (i === 4) { // 지금, 그 벤치. 반창고 붙은 낡은 예언이가 잔다
    const wy = SB_SIT(0.95), zy = SB_SIT(1);
    w += suBenchBack() + SY({ x: SB_SX, y: wy, s: 0.95, t, pose: P['f앉기L'], ex: fEx('z기본'), look: [-0.7, 0.1] }) + ZS({ x: SB_ZX, y: zy, s: 1, t, pose: P['f앉기'], ex: fEx('z기본'), look: [0.4, 0.5] }) + suPants(SB_ZX, zy, 1, P['f앉기']) + suSlip(SB_ZX, zy, 1, P['f앉기']) + suBenchSeat();
    w += suOldYe(t, SB_ZX + 2, zy + (44 - 560), 0.7, 1, { id: 'mz' });
    const [cx0, cy0] = ptOf(SB_ZX, zy, 1, 249, 362); w += suCup(cx0, cy0 + 6, 0.85, t, { open: true });
  }
  const plate = SU_MONT[i][1];
  const fade = Math.min(suK(0, 0.25, l2), 1 - suK(D - 0.2, D, l2) * (i < 4 ? 1 : 0));
  let h = `<defs><filter id="suSat${i}"><feColorMatrix type="saturate" values="${sat}"/></filter></defs><g filter="url(#suSat${i})">` + suPlate(plate, cam, 0.6) + qCam(cam, w) + (plate === 'cvsapt' ? fFull('#0A1238', 0.2) : '') + `</g>`;
  h += (i < 4 ? fSepia(1 - sat) : '') + `<g opacity="${f1(fade * 100) / 100}"></g>`;
  h += pop(t, t - l2 + 0.1, t + 9, 260, 120, label(0, 0, SU_MONT[i][0], { size: 40, bg: '#fff' }), { rot: -3 });
  h += suHeart(t, i, l2);
  return suDefs() + qDefs() + suFadeDefs() + h + fFull('#000', (1 - fade) * 0.9);
}

/* ---------- 어른들 머리 위에도: 낡은 예언이가 잔다 ---------- */
function suadultsScene(t, lt, a) {
  const ph = a.ph, cam = ph === 1 ? qLerpCam(lt / 3.0, [520, 620, 1.35], [1500, 620, 1.35]) : qLerpCam(lt / 7, [960, 600, 1.0], [960, 620, 1.1]);
  const wy = SB_SIT(0.95), zy = SB_SIT(1);
  let w = suBenchBack() + SY({ x: SB_SX, y: wy, s: 0.95, t, pose: P['f앉기L'], ex: fEx('z빵긋'), look: ph === 1 ? [lerp(-0.8, 0.8, suK(0, 3, lt)), -0.2] : [0.2, -0.3] });
  w += ZS({ x: SB_ZX, y: zy, s: 1, t, pose: P['f앉기'], ex: fEx('z빵긋'), look: [0.5, 0.2] }) + suPants(SB_ZX, zy, 1, P['f앉기']) + suSlip(SB_ZX, zy, 1, P['f앉기']) + suBenchSeat();
  const [cx0, cy0] = ptOf(SB_ZX, zy, 1, 249, 362); w += suCup(cx0, cy0 + 6, 0.85, t, { open: true });
  w += suYe(t, { x: SB_SX + 4, y: wy + (40 - 560) * 0.95 + 4, s: 0.82, R: 34, inner: suDay(t, 0.75), eyes: 'norm', glow: 0.3, id: 'ad' });
  w += suOldYe(t, SB_ZX + 2, zy + (44 - 560), 0.7, 1, { id: 'adz' });
  // 경비 아저씨(왼쪽, 손전등 순찰)
  const gx = lerp(150, 330, suK(0, 10, lt + (ph === 2 ? 3 : 0))), gp = walkPose(t * 4, 0.4);
  w += qShadow(gx, 1010, 60) + fGrey(gx, 1010, 0.95, t, 2, { vest: '#2F3D5C', hair: '#3A3A3A', pose: suPose(gp, { armR: [[252, 285], [292, 320], [330, 330]], hR: [334, 330] }), ex: fEx('z기본'), look: [0.8, 0.2] });
  w += `<g transform="translate(${f1(gx + 128)} ${f1(1010 - 220)})"><rect x="-14" y="-10" width="40" height="20" rx="6" fill="#3B3F4E" stroke="${INK}" stroke-width="4"/><path d="M26 -10 L180 -50 L180 50 L26 10 Z" fill="#FFF2B0" opacity=".35"/></g>`;
  w += suOldYe(t, gx + 2, 1010 + (50 - 560) * 0.95, 0.62, 2, { id: 'g' });
  // 택배 기사님(오른쪽, 수레)
  const kx = lerp(1880, 1700, suK(0, 10, lt + (ph === 2 ? 3 : 0)));
  w += `<g transform="translate(${f1(kx - 150)} 1010)"><rect x="-80" y="-150" width="120" height="70" rx="6" fill="#C99566" stroke="${INK}" stroke-width="6"/><rect x="-74" y="-220" width="100" height="70" rx="6" fill="#D9B07A" stroke="${INK}" stroke-width="6"/><rect x="-90" y="-80" width="150" height="16" rx="6" fill="#5B6478" stroke="${INK}" stroke-width="5"/><circle cx="-70" cy="-20" r="18" fill="#3B3F4E" stroke="${INK}" stroke-width="5"/><circle cx="40" cy="-20" r="18" fill="#3B3F4E" stroke="${INK}" stroke-width="5"/><path d="M60 -72 L100 -230" stroke="#5B6478" stroke-width="10" stroke-linecap="round"/></g>`;
  w += qShadow(kx, 1010, 60) + fGrey(kx, 1010, 0.95, t, 1, { vest: '#4E6E58', hair: '#2F2F33', pose: suPose(walkPose(t * 4 + 1, 0.4), { armL: [[148, 285], [100, 300], [64, 230]], hL: [60, 224] }), ex: fEx('z기본'), look: [-0.8, 0.2] });
  w += suOldYe(t, kx + 2, 1010 + (50 - 560) * 0.95, 0.62, 3, { id: 'k' });
  // 편의점 사장님(문 옆 의자에서 꾸벅)
  const ox = 1820, oy = 1010 - 10; w += `<rect x="${ox - 70}" y="${oy - 150}" width="140" height="20" rx="6" fill="#5B6478" stroke="${INK}" stroke-width="5"/><path d="M${ox - 60} ${oy - 130} L${ox - 60} ${oy} M${ox + 60} ${oy - 130} L${ox + 60} ${oy}" stroke="#5B6478" stroke-width="10"/>`;
  w += fGrey(ox, oy - 150 - 12 + 148 * 0.9, 0.9, t, 0, { vest: '#C9564A', hair: '#555', pose: P['f앉기L'], ex: fEx('z졸음'), look: [0, 0.4], tilt: 8 });
  w += suOldYe(t, ox + 4, oy - 162 + 148 * 0.9 + (50 - 560) * 0.9, 0.6, 4, { id: 'o' });
  const light = `<circle cx="1500" cy="760" r="900" fill="url(#suLamp)" opacity=".55"/>`;
  return suDefs() + qDefs() + suFadeDefs() + suPlate('cvsapt', cam, 0.6) + qCam(cam, w + light) + fFull('#0A1238', 0.2) + warm(0.24);
}

/* ---------- 결말 1: 수능 날 아침, 엘리베이터 ---------- */
function suelevScene(t, lt, a) {
  const ph = a.ph, zx = 760, wx = 1160, F = 1000, wS = 0.95;
  let cam = ph === 1 ? (lt > 1.1 && lt < 2.2 ? [wx - 20, 740, 2.6] : [960, 600, 1.15]) : ph === 2 ? [1060, 600, 1.4] : [960, 600, 1.2];
  E['_suwE'] = qTalk('z빵긋', env(t) * 0.7);
  const thumb = ph === 1 && lt > 2.5 || ph === 3, zPose = thumb ? suPose('서기', { armR: [[252, 285], [300, 300], [330, 250]], hR: [334, 246] }) : suPose('서기', { armL: [[148, 285], [124, 340], [120, 396]], hL: [118, 400] });
  const zEx = ph === 1 ? (lt > 2.2 && lt < 2.6 ? fEx('z기본') : lt > 2.6 ? fEx('z빵긋') : fEx('z졸음')) : fEx('z빵긋');
  let w = qShadow(zx, F, 62) + ZS({ x: zx, y: F, s: 1, t, pose: zPose, ex: zEx, look: ph === 1 && lt > 0.8 ? [0.8, 0.4] : [0.6, 0] }) + suPants(zx, F, 1, zPose) + suSlip(zx, F, 1, zPose);
  const [bx, by] = ptOf(zx, F, 1, 118, 400); // 분리수거 봉투
  w += `<g transform="translate(${f1(bx)} ${f1(by + 70)})"><path d="M-40 -70 Q-48 0 -36 40 L36 40 Q48 0 40 -70 Z" fill="#E9F2FF" opacity=".85" stroke="${INK}" stroke-width="5"/><rect x="-26" y="-20" width="20" height="36" rx="5" fill="#E5484D" stroke="${INK}" stroke-width="3"/><rect x="4" y="-10" width="20" height="36" rx="5" fill="#7CC7FF" stroke="${INK}" stroke-width="3"/></g>`;
  if (thumb) { const [hx, hy] = ptOf(zx, F, 1, 334, 246); w += suThumb(hx, hy, 1); }
  const HOLDW = suPose('서기', { armL: [[148, 285], [150, 340], [184, 356]], hL: [188, 356], armR: [[252, 285], [250, 340], [214, 356]], hR: [210, 356] });
  w += qShadow(wx, F, 60) + SY({ x: wx, y: F, s: wS, t, pose: HOLDW, ex: ph === 2 ? fEx('_suwE') : fEx('z기본'), look: ph === 2 ? [-0.8, 0] : [-0.2, 0.4] });
  const [px, py] = ptOf(wx, F, wS, 199, 356); // 투명 수험표 지갑(접힌 영수증이 비친다)
  w += `<g transform="translate(${f1(px)} ${f1(py)})"><rect x="-56" y="-40" width="112" height="80" rx="10" fill="#E8F4FF" opacity=".75" stroke="${INK}" stroke-width="5"/><rect x="-46" y="-30" width="58" height="60" rx="4" fill="#fff" stroke="${INK}" stroke-width="3"/>${fT(-17, -10, '수험표', 13, INK)}<rect x="16" y="-22" width="30" height="40" rx="3" fill="#FFFDF6" stroke="${INK}" stroke-width="3" transform="rotate(8 31 -2)"/><line x1="20" y1="-10" x2="40" y2="-8" stroke="#4B5E9A" stroke-width="2.5"/><line x1="20" y1="-2" x2="38" y2="0" stroke="#4B5E9A" stroke-width="2.5"/></g>`;
  const yawn = Math.sin(t * 1.3) > 0.6;
  w += suYe(t, { x: wx + 4, y: F + (40 - 560) * wS + 4, s: 0.8, R: 32, inner: suDay(t, 0.75), eyes: yawn ? 'shut' : 'norm', mouth: yawn ? 'o' : null, glow: 0.3, id: 'el' });
  w += suOldYe(t, zx + 2, F + (44 - 560), 0.7, 1, { id: 'elz' });
  // 층수 표시
  const floor = ph === 1 ? Math.max(1, 12 - Math.floor(lt * 2.4)) : ph === 2 ? 3 : 1;
  const over0 = `<g transform="translate(960 70)"><rect x="-70" y="-34" width="140" height="68" rx="10" fill="#0E0E12" stroke="${INK}" stroke-width="5"/>${fT(-18, 16, '▼', 34, '#FF8A3D')}${fT(26, 18, String(floor), 44, '#FF8A3D')}</g>`;
  let over = '';
  if (ph === 1 && lt < 1.6) over += pop(t, t - lt + 0.2, t - lt + 1.6, 380, 240, label(0, 0, '오늘 출근 10시', { size: 36, bg: '#fff' }), { rot: -4 });
  if (ph === 1 && lt > 2.2 && lt < 2.6) over += fx(t, t - lt + 2.2, t - lt + 2.6, 760, 300, '…', '#fff', { size: 60 });
  if (ph === 3 && lt > 0.6) over += fx(t, t - lt + 0.6, t + 9, 960, 180, '띵', '#FFE34D', { size: 56 });
  return suDefs() + qDefs() + suFadeDefs() + suPlate('elev', cam, 0.6) + qCam(cam, w) + warm(0.15) + over + (ph === 1 && cam[2] < 2 ? over0 : '');
}

/* ---------- 결말 2: 시험장 교문 ---------- */
function sugateScene(t, lt, a) {
  const cam = qLerpCam(lt / 5, [1060, 620, 1.05], [960, 610, 1.12]), F = 1010;
  let w = '';
  // 후배들 응원(오른쪽 울타리 앞) — 손팻말에 글자
  [[1380, '수능 대박!', '#FFE34D'], [1560, '찍어도 정답!', '#7FD6C2'], [1740, '선배님 화이팅', '#FF9AB0']].forEach(([x, s0, c], i) => { const jump = Math.max(0, Math.sin(t * 6 + i * 1.3)) * 18;
    w += qShadow(x, F - 40, 46) + fGrey(x, F - 40 - jump, 0.78, t, i, { pose: suPose('서기', { armL: [[148, 285], [120, 220], [140, 150]], hL: [144, 144], armR: [[252, 285], [280, 220], [262, 150]], hR: [258, 144] }), ex: fEx('z빵긋'), look: [-0.4, 0] });
    w += `<g transform="translate(${x} ${f1(F - 40 - jump + (144 - 560) * 0.78 - 40)})"><rect x="-90" y="-44" width="180" height="76" rx="8" fill="${c}" stroke="${INK}" stroke-width="5"/>${fT(0, 6, s0, 26, INK)}</g>`; });
  // 엄마와 포옹 → 서윤이 왼쪽 교문 안으로
  const hug = lt < 2.2, go = suK(2.4, 4.6, lt), wx = hug ? 1060 : lerp(1040, 560, easeInOut(go)), op = 1 - suK(4.2, 4.7, lt);
  const HUG_W = suPose('서기', { armR: [[252, 285], [290, 300], [330, 300]], hR: [334, 300], armL: [[148, 285], [190, 320], [250, 310]], hL: [254, 308] });
  const HUG_M = suPose('서기', { armL: [[148, 285], [110, 300], [70, 300]], hL: [66, 300], armR: [[252, 285], [210, 320], [150, 310]], hR: [146, 308] });
  if (hug) { w += qShadow(1220, F, 60) + fGrey(1220, F, 1.0, t, 0, { vest: '#E8A0B4', hair: '#4A3A3A', pose: HUG_M, ex: fEx('z울먹'), look: [-0.9, 0], rot: -6 });
    w += qShadow(1060, F, 58) + SY({ x: 1060, y: F, s: 0.95, t, pose: HUG_W, ex: fEx('z기본'), look: [0.9, 0], rot: 6 }); }
  else { w += qShadow(1220, F, 60) + fGrey(1220, F, 1.0, t, 0, { vest: '#E8A0B4', hair: '#4A3A3A', pose: suPose('서기', { armL: [[148, 285], [100, 240], [70, 180]], hL: [66, 172] }), ex: fEx('z빵긋'), look: [-0.9, 0] });
    const wp = go < 1 ? walkPose(lt * 7, 0.7) : '서기'; w += `<g opacity="${f1(op * 100) / 100}">${qShadow(wx, F, 58)}${SY({ x: wx, y: F, s: 0.95, t, pose: wp, ex: fEx('z결심'), look: [-0.9, 0] })}</g>`;
    w += `<g opacity="${f1(op * 100) / 100}">${suYe(t, { x: wx + 4, y: F + (40 - 560) * 0.95 + 4 + (wp.dy || 0) * 0.95, s: 0.8, R: 32, inner: suDay(t, 0.75), eyes: 'norm', glow: 0.3, id: 'gt' })}</g>`; }
  if (hug) w += suYe(t, { x: 1064, y: F + (40 - 560) * 0.95 + 4, s: 0.8, R: 32, inner: suDay(t, 0.75), eyes: 'norm', glow: 0.3, id: 'gt0' });
  let over = pop(t, t - lt + 0.1, t + 9, 300, 110, label(0, 0, '11월 19일 아침', { size: 38, bg: '#fff' }), { rot: -3 });
  if (lt > 2.6) over += fx(t, t - lt + 2.6, t + 9, 1560, 260, '화이팅!', '#FFE34D', { size: 60, rot: -6 });
  return suDefs() + suPlate('gate', cam, 0.6) + qCam(cam, w) + over;
}

/* ---------- 결말 3: 점심시간, 시험실 ---------- */
const SL_DESK = 846;
function sulunchScene(t, lt, a) {
  const ph = a.ph, x = 960, F = 1040, s = 1.0, yTop = F + (40 - 560) * s;
  let cam = ph === 1 ? qLerpCam(lt / 1.2, [960, 600, 1.2], [960, 560, 1.4]) : lt < 1.0 ? [960, 620, 1.35] : lt < 2.3 ? [600, SL_DESK - 150, 2.6] : [960, 580, 1.42];
  const open = ph === 2 ? suK(0.3, 0.9, lt) : 0, rec = ph === 2 ? suK(2.4, 2.9, lt) : 0, eat = ph === 2 ? suK(3.9, 4.4, lt) : 0;
  const calm = ph === 2 ? suK(3.0, 3.6, lt) : 0;
  const pose = rec > 0 && eat === 0 ? suPose('서기', { armL: [[148, 285], [130, 340], [170, 332]], hL: [174, 332], armR: [[252, 285], [270, 340], [230, 332]], hR: [226, 332] }) :
    eat > 0 ? suPose('서기', { armR: [[252, 285], [282, 300], [236, 266]], hR: [232, 262], armL: [[148, 285], [126, 340], [150, 334]], hL: [146, 334] }) : suPose('서기', { armL: [[148, 285], [126, 340], [150, 334]], hL: [146, 334], armR: [[252, 285], [274, 340], [250, 334]], hR: [254, 334] });
  const ex = ph === 1 ? exprAt([[0, 'z기본'], [0.4, 'z당황']], lt) : lt < 2.4 ? fEx(lt > 1.0 ? 'z울먹' : 'z당황') : lt < 3.9 ? fEx('z멍') : fEx('z기본');
  let w = SY({ x, y: F, s, t, pose, ex, look: ph === 2 && lt > 2.4 && lt < 3.9 ? [0, 0.8] : ph === 2 ? [0, 0.7] : [0, -0.6] });
  // 책상(앞판이 다리를 가린다)
  w += `<rect x="620" y="${SL_DESK - 22}" width="680" height="30" rx="8" fill="#D9B07A" stroke="${INK}" stroke-width="8"/><rect x="650" y="${SL_DESK + 8}" width="620" height="260" fill="#B88A5C" stroke="${INK}" stroke-width="8"/>`;
  // 보온 도시락(뚜껑 + 포스트잇)
  const bx = 760, by = SL_DESK - 22;
  w += `<g transform="translate(${bx} ${by})"><rect x="-80" y="-50" width="160" height="50" rx="14" fill="#7FB3D9" stroke="${INK}" stroke-width="6"/>` + (open > 0 ? `<ellipse cx="0" cy="-50" rx="74" ry="14" fill="#fff" stroke="${INK}" stroke-width="5"/><ellipse cx="-24" cy="-54" rx="30" ry="9" fill="#F4F1EA"/><circle cx="28" cy="-54" r="10" fill="#E5A64A"/><rect x="34" y="-62" width="18" height="8" rx="3" fill="#7BB86F"/>` : '') + `</g>`;
  const lidX = bx - 160 * open, lidY = by - 50 - 20 * Math.sin(open * Math.PI) + 20 * open, lidR = 10 * open;
  w += `<g transform="translate(${f1(lidX)} ${f1(lidY)}) rotate(${f1(lidR)})"><rect x="-84" y="-22" width="168" height="26" rx="12" fill="#5E95C2" stroke="${INK}" stroke-width="6"/>` + (open >= 1 ? `<g transform="translate(0 -60) rotate(-4)"><rect x="-56" y="-34" width="112" height="70" fill="#FFE34D" stroke="${INK}" stroke-width="4"/>${fT(0, 8, '천천히 먹어', 20, INK)}</g>` : '') + `</g>`;
  // 수험표 지갑 → 영수증 펼침
  w += `<g transform="translate(1150 ${SL_DESK - 30})"><rect x="-56" y="-14" width="112" height="22" rx="6" fill="#E8F4FF" opacity=".8" stroke="${INK}" stroke-width="4"/></g>`;
  if (rec > 0 && eat === 0) { const [hx, hy] = ptOf(x, F, s, 200, 332); w += suSlip2(hx, hy - 2, 0.85, { lines: 6, rot: 0 }); }
  if (eat > 0) { w += suSlip2(1160, SL_DESK - 60, 1.0, { lines: 6, rot: 80 }); const [sx0, sy0] = ptOf(x, F, s, 232, 262); w += `<path d="M${f1(sx0)} ${f1(sy0)} l-26 50" stroke="#C9D3E0" stroke-width="7" stroke-linecap="round"/><ellipse cx="${f1(sx0 + 2)}" cy="${f1(sy0 - 6)}" rx="12" ry="8" fill="#C9D3E0" stroke="${INK}" stroke-width="3"/>`; }
  // 예언이: 1교시가 끝나면 다시 깨어난다 → 영수증을 보면 구슬이 넓어지고 도로 앉는다
  const wake = ph === 1 ? suK(0.2, 0.6, lt) : 1 - calm, R = lerp(32, 52, wake);
  const inner = wake > 0.4 && calm < 0.5 ? suSeq(t, (ph === 1 ? lt : lt + 3) - 0.5, [suV.x, suV.stairs, suV.rain], 0.8) : suDay(t, lerp(2.4, 0.75, calm));
  w += suYe(t, { x: x + 4, y: yTop + 4, s: 0.85, raise: wake * (1 - calm), R, inner, eyes: calm > 0.5 ? 'norm' : wake > 0.3 ? 'wide' : 'shut', talk: 0, glow: 0.3 + 0.5 * wake, id: 'ln' + ph });
  let over = '';
  if (ph === 1 && lt > 0.2 && lt < 0.9) over += fx(t, t - lt + 0.2, t - lt + 0.9, 1180, 230, '벌떡!', '#FFE34D', { size: 60, rot: -6 });
  if (ph === 1) over += pop(t, t - lt + 0.1, t + 9, 300, 110, label(0, 0, '점심시간', { size: 38, bg: '#fff' }), { rot: -3 });
  return suDefs() + suPlate('exroom', cam, 0.6) + qCam(cam, w) + over;
}

/* ---------- 결말 4: 오후 1시 10분, 멈춘 비행기 / 사무실의 제로 ---------- */
function suplaneScene(t, lt, a) {
  const ph = a.ph;
  if (ph === 1 || lt < 1.0) { const cam = qLerpCam((ph === 1 ? lt : lt + 2.2) / 3.4, [960, 560, 1.0], [1000, 560, 1.08]);
    return suPlate('runway', cam, 0.8) + pop(t, t - (ph === 1 ? lt : lt + 2.2) + 0.2, t + 9, 300, 110, label(0, 0, '오후 1:10 영어 듣기', { size: 38, bg: '#fff' }), { rot: -3 }); }
  const cam = qLerpCam((lt - 1.0) / 3, [960, 600, 1.25], [960, 580, 1.4]), x = 960, F = 1000;
  let w = qShadow(x, F, 62) + ZS({ x, y: F, s: 1, t, pose: suPose('서기', { armR: [[252, 285], [290, 330], [258, 352]], hR: [254, 352] }), ex: fEx('z기본'), look: [-0.4, -0.7] });
  w += `<rect x="-300" y="0" width="0" height="0"/>`;
  const [mx, my] = ptOf(x, F, 1, 254, 352); w += `<g transform="translate(${f1(mx)} ${f1(my)})"><rect x="-18" y="-30" width="36" height="40" rx="6" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M18 -20 q16 6 0 20" fill="none" stroke="${INK}" stroke-width="5"/></g>`;
  w += suOldYe(t, x + 2, F + (44 - 560), 0.7, 1, { id: 'pl' });
  return suDefs() + suFadeDefs() + suPlate('office', cam, 0.6) + qCam(cam, w);
}

/* ---------- 결말 5: 해 질 녘, 시험장을 나서는 서윤(역광) ---------- */
function suduskScene(t, lt, a) {
  const ph = a.ph, F = 1010;
  if (ph === 2 && lt > fAt(a, '다만', 3.2) - 0.1) { // 영수증 클로즈업(노을빛)
    const k = easeOut(suK(fAt(a, '다만', 3.2) - 0.1, fAt(a, '다만', 3.2) + 0.5, lt));
    let h = `<rect width="1920" height="1080" fill="#F59A6A"/><circle cx="960" cy="1000" r="900" fill="#FFD9A0" opacity=".6"/>`;
    h += `<g transform="translate(960 ${f1(560 + (1 - k) * 80)}) scale(${f1((0.9 + 0.1 * k) * 1000) / 1000}) rotate(-3)"><path d="M-260 -360 L260 -360 L260 340 l-26 20 l-26 -20 l-26 20 l-26 -20 l-26 20 l-26 -20 l-26 20 l-26 -20 l-26 20 l-26 -20 l-26 20 l-26 -20 l-26 20 l-26 -20 l-26 20 l-26 -20 l-26 20 l-26 -20 l-26 20 l-26 -20 Z" fill="#FFFDF6" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>`;
    h += fT(-210, -280, '다음 주 화요일', 50, '#2C3D7A', { anchor: 'start' }) + SU_DAY.map((s0, i) => fT(-200, -180 + i * 88, '· ' + s0, 40, '#2C3D7A', { anchor: 'start', w: 700 })).join('');
    h += `<ellipse cx="-20" cy="${-180 + 3 * 88 - 12}" rx="220" ry="40" fill="none" stroke="#E5484D" stroke-width="7"/></g>`;
    h += hand(700, 820, 1.6) + hand(1220, 820, 1.6);
    return h + `<rect width="1920" height="1080" fill="#FFB46A" opacity=".12"/>`; }
  const cam = qLerpCam(ph === 1 ? lt / 3 : ph === 2 ? 1 : 0, [1000, 600, 1.05], [1040, 620, 1.12]);
  let w = '';
  // 쏟아져 나오는 수험생들과 기다리는 부모들 — 역광이라 모두 실루엣
  const crowd = [[700, 0.62, 0, 1], [1420, 0.6, 2, -1], [1600, 0.58, 3, 1], [360, 0.66, 2, 0], [200, 0.64, 3, 0]];
  crowd.forEach(([x0, s0, sd, dir], i) => { const x = x0 + dir * ((t * 30 + i * 30) % 100); const p = dir ? walkPose(t * 5 + i, 0.5) : '서기'; w += `<g filter="url(#suSil)">${fGrey(x, F - 70 + i % 2 * 10, s0, t, sd, { pose: p })}</g>`; });
  // 서윤(역광 실루엣): 걸어 나와 멈춤 → (클로즈업) → 접어 넣고 노을 쪽으로 걸어간다
  let wx = 1120, wp = '서기', op = 1;
  if (ph === 1) { wx = lerp(1300, 1060, easeOut(suK(0.3, 2.6, lt))); wp = lt < 2.6 ? walkPose(lt * 6, 0.6) : '서기'; }
  if (ph === 2) { wx = 1060; wp = suPose('서기', { armL: [[148, 285], [150, 330], [184, 320]], hL: [188, 318], armR: [[252, 285], [250, 330], [216, 320]], hR: [212, 318] }); }
  if (ph === 3) { const g = suK(0.8, 3.0, lt); wx = lerp(1060, 1560, easeIn(g)); wp = g > 0 ? walkPose(lt * 6, 0.6) : '서기'; op = 1 - suK(2.3, 3.0, lt); }
  w += `<g opacity="${f1(op * 100) / 100}"><g filter="url(#suSil)">${qShadow(wx, F + 30, 66)}${SY({ x: wx, y: F + 30, s: 1.05, t, pose: wp, ex: fEx('z기본'), noQuilt: true })}</g>`;
  if (ph === 2) { const [hx, hy] = ptOf(wx, F + 30, 1.05, 200, 318); w += suSlip2(hx, hy - 10, 1.1, { lines: 6 }); }
  w += `</g>`;
  const silDefs = `<defs><filter id="suSil" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0.13  0 0 0 0 0.08  0 0 0 0 0.12  0 0 0 1 0"/></filter></defs>`;
  return silDefs + suPlate('gatedusk', cam, 0.6) + qCam(cam, w) + `<rect width="1920" height="1080" fill="#FF9A55" opacity=".1"/>`;
}

/* ---------- 마지막 질문: 빈 영수증 ---------- */
function suendScene(t, lt, a) {
  let h = `<rect width="1920" height="1080" fill="#2A1F3A"/><circle cx="960" cy="560" r="640" fill="#FFB46A" opacity=".18"/>`;
  const k = easeOut(clamp(lt / 0.8, 0, 1));
  h += `<g transform="translate(960 ${f1(540 + (1 - k) * 60)}) rotate(2)" opacity="${f1(k * 100) / 100}"><path d="M-240 -330 L240 -330 L240 310 l-24 18 l-24 -18 l-24 18 l-24 -18 l-24 18 l-24 -18 l-24 18 l-24 -18 l-24 18 l-24 -18 l-24 18 l-24 -18 l-24 18 l-24 -18 l-24 18 l-24 -18 l-24 18 l-24 -18 l-24 18 l-24 -18 Z" fill="#FFFDF6" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>`;
  h += fT(-190, -250, '다음 주 화요일', 48, '#2C3D7A', { anchor: 'start' }) + [0, 1, 2, 3, 4, 5].map(i => `<line x1="-190" y1="${-150 + i * 80}" x2="190" y2="${-150 + i * 80}" stroke="#C9C3D8" stroke-width="4" stroke-dasharray="10 10"/><text x="-200" y="${-160 + i * 80}" font-family="${FONT}" font-size="36" fill="#9A93B4">·</text>`).join('');
  h += `</g><g transform="translate(1290 640) rotate(30)"><rect x="-10" y="-140" width="20" height="140" rx="8" fill="#2B2F3A" stroke="${INK}" stroke-width="4"/><path d="M-10 0 L0 22 L10 0 Z" fill="#E9E4F7" stroke="${INK}" stroke-width="4"/></g>`;
  return h;
}
