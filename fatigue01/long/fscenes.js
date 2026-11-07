/* 피로사회 편 — 인트로 샘플. 연출 기준 v3: z표정 23종, 리액션 묶음(깜짝 7단계·녹아내림), 만화 기호, 리액션 컷, 대기 연기.
   이름은 모두 f 접두사. */
Object.assign(QBG, { living2: 'ai/living2.png', bedn: 'ai/bedn.png', shower: 'ai/shower.png', subway: 'ai/subway.png', office: 'ai/office.png', gym: 'ai/gym.png', desknight: 'ai/desknight.png', living: 'ai/living.png' });
delete QBG.wide; delete QBG.close;
const FN = ['falarm', 'fmont', 'fgrid', 'fmelt', 'fcoach', 'ftake', 'fwho', 'fculprit', 'ftitle', 'fbook'];
FN.forEach(k => CAMS[k] = 'fixed');

/* ---------- shared ---------- */
const fAt = (a, key, fb) => { const w = (a._words || []).find(x => x.w.replace(/\s/g, '').includes(key)); return w ? w.t + 0.15 : fb; };
const fEx = k => ({ expr: k, prev: k, k: 1, blink: 0 });
const fFull = (c, op = 1) => `<rect x="-300" y="-200" width="2600" height="1500" fill="${c}" opacity="${op}"/>`;
const fT = (x, y, s, size, fill, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${o.anchor || 'middle'}" font-family="${FONT}" font-weight="${o.w || 900}" font-size="${size}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 6}" paint-order="stroke" stroke-linejoin="round"` : ''}>${esc(s)}</text>`;
const fPlate = (k, cam, depth = 0.55, o = {}) => {
  const [cx, cy, z] = cam, zb = 1 + (z - 1) * depth; let bx = 960 + (cx - 960) * depth, by = 560 + (cy - 560) * depth;
  const hx = 960 / 0.88 / zb; bx = clamp(bx, -150 + hx + 4, 2070 - hx - 4); by = clamp(by, -30 + 573.6 / zb + 4, 1220 - 653.6 / zb - 4);
  return `<g transform="translate(960 560) scale(${f1(zb * 1000) / 1000}) translate(${f1(-bx)} ${f1(-by)})"><image href="${QBG[k]}" x="-150" y="-30" width="2220" height="1250" preserveAspectRatio="xMidYMid slice"${o.blur ? ' filter="url(#qblur)"' : ''}/></g>`;
};
const fNeonDefs = () => `<defs><filter id="fneon" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
const fHead = (x, y, s = 1, sy = 1) => [x, y + (170 - 560) * s * sy];
const fShoulder = (x, y, s = 1, sy = 1, side = 1) => [x + side * 58 * s, y + (285 - 560) * s * sy];
// 깜짝 7단계 (리액션 시트): 평소 → 움찔 → 튀어오름 → 정점 → 착지 → 반동 → 정착
const fJump = (lt, t0, h = 1) => {
  const f = (lt - t0) * 24, K = [[0, 1, 1, 0], [4, 1.06, 0.9, 0], [7, 0.92, 1.14, -70], [10, 0.97, 1.05, -96], [13, 1.08, 0.88, 0], [16, 0.98, 1.04, 0], [22, 1, 1, 0]];
  if (f <= 0) return { sx: 1, sy: 1, dy: 0, ph: 0 };
  for (let i = 0; i < K.length - 1; i++) { const A = K[i], B = K[i + 1]; if (f < B[0]) { const k = i === 3 ? easeIn((f - A[0]) / (B[0] - A[0])) : easeInOut((f - A[0]) / (B[0] - A[0])); return { sx: lerp(A[1], B[1], k), sy: lerp(A[2], B[2], k), dy: lerp(A[3], B[3], k) * h, ph: i + 1 }; } }
  return { sx: 1, sy: 1, dy: 0, ph: 7 };
};
const fJumpPose = ph => ph <= 1 ? '웅크림' : ph <= 4 ? '만세' : '서기';
// 대기 연기: 시선이 조금씩 떠돌고, 가끔 갸웃
const fIdleLook = (t, seed) => [f1(Math.sin(t * 0.7 + seed) * 0.35) * 1, f1(Math.sin(t * 0.5 + seed * 2) * 0.2) * 1];
const fIdleTilt = (t, seed) => Math.max(0, Math.sin(t * 0.45 + seed)) ** 6 * 7;
// 미니 코치: 트레이닝복, 머리띠, 호루라기, 확성기
const COACH = '#3D7EC8';
function fCoach(t, o) {
  const s = o.s || 0.3, x = o.x, y = o.y, side = o.megaSide || -1;
  const tr = `translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${f1(s * (o.sx || 1) * 1000) / 1000} ${f1(s * (o.sy || 1) * 1000) / 1000}) translate(-200 -560)`;
  let pose = o.pose || '서기';
  if (o.mega) { const base = typeof pose === 'string' ? P[pose] : pose; // the megaphone hand grips the handle under the cone
    pose = side < 0 ? Object.assign({}, base, { armL: [[148, 285], [104, 316], [70, 298]], hL: [66, 294] }) : Object.assign({}, base, { armR: [[252, 285], [296, 316], [330, 298]], hR: [334, 294] }); }
  let h = HALO(char(Object.assign({ goggles: 'none', vest: COACH, patch: false, tee: true, vshade: 'rgba(0,20,80,0.25)', hairFront: `<path d="M86 118 Q200 88 314 118" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M86 118 Q200 88 314 118" fill="none" stroke="#FF4D6D" stroke-width="20" stroke-linecap="round"/>`, seed: 41, t }, o, { pose })));
  h += `<g transform="${tr}"><path d="M150 268 L138 410 M250 268 L262 410" stroke="#fff" stroke-width="10"/><path d="M200 262 Q186 300 200 330" fill="none" stroke="#FFD23F" stroke-width="5"/><circle cx="200" cy="334" r="12" fill="#C9D3E0" stroke="${INK}" stroke-width="5"/>`;
  if (o.mega) { const tilt = o.megaTilt || 0, place = side < 0 ? `translate(122 238) scale(-1 1) rotate(${tilt})` : `translate(278 238) rotate(${tilt})`;
    let m = `<g transform="${place}"><rect x="40" y="10" width="24" height="56" rx="8" fill="#E5484D" stroke="${INK}" stroke-width="8"/><path d="M0 -16 L140 -60 L140 60 L0 16 Z" fill="#FFD23F" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/><ellipse cx="140" cy="0" rx="16" ry="60" fill="#F2B90F" stroke="${INK}" stroke-width="8"/><rect x="-14" y="-16" width="18" height="32" rx="6" fill="#E5484D" stroke="${INK}" stroke-width="7"/>`;
    if (o.wave) for (let i = 0; i < 3; i++) { const ph = (t * 3 + i / 3) % 1, r = 60 + ph * 140; m += `<path d="M${f1(150 + Math.cos(-0.7) * r)} ${f1(Math.sin(-0.7) * r)} A${f1(r)} ${f1(r)} 0 0 1 ${f1(150 + Math.cos(0.7) * r)} ${f1(Math.sin(0.7) * r)}" fill="none" stroke="#FFD23F" stroke-width="16" stroke-linecap="round" opacity="${f1((1 - ph) * 100) / 100}"/>`; }
    h += m + `</g>`; }
  return h + `</g>`;
}
// 체크리스트 HUD (몽타주 동안 쌓인다)
const HUD_ITEMS = ['05:00 기상', '찬물 샤워', '영어 단어 50개', '점심 + 업무', '헬스 1시간', '부업 강의'];
function fHud(t, n, popT) { // n = checked count, popT = seconds since the latest check
  let h = `<g transform="translate(1420 40) scale(1.3)"><rect x="0" y="0" width="360" height="${60 + HUD_ITEMS.length * 46}" rx="22" fill="#FFFDF6" stroke="${INK}" stroke-width="6" opacity=".96"/>${fT(28, 42, '오늘의 갓생 루틴', 28, INK, { anchor: 'start' })}`;
  HUD_ITEMS.forEach((s, i) => { const y = 84 + i * 46, on = i < n, last = i === n - 1;
    const sc = last ? 1 + 0.5 * Math.exp(-popT * 9) * Math.max(0, 1 - popT * 2) : 1;
    h += `<rect x="26" y="${y - 22}" width="30" height="30" rx="8" fill="${on ? '#3DBA8A' : '#fff'}" stroke="${INK}" stroke-width="4"/>` + (on ? `<path transform="translate(41 ${y - 7}) scale(${f1(sc * 100) / 100})" d="M-9 0 L-2 7 L10 -8" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` : '') + fT(70, y, s, 24, on ? '#9AA1AE' : INK, { anchor: 'start', w: 700 });
    if (on) h += `<line x1="70" y1="${y - 8}" x2="${70 + s.length * 22}" y2="${y - 8}" stroke="#9AA1AE" stroke-width="3"/>`; });
  return h + `</g>`;
}
// 휙 전환: 컷 시작 6프레임 동안 옆에서 밀려 들어오고 속도선
const fWhip = (l2, inner) => { if (l2 >= 0.25) return inner; const k = easeOut(clamp(l2 / 0.25, 0, 1)), dx = 0, zs = 1 + 0.12 * (1 - k);
  let sl = ''; for (let i = 0; i < 14; i++) { const y = 60 + i * 72 + (i % 3) * 14; sl += `<line x1="${f1(-200 + (i * 137) % 900)}" y1="${y}" x2="${f1(400 + (i * 137) % 900 + 600)}" y2="${y}" stroke="#fff" stroke-width="${6 + (i % 3) * 4}" stroke-linecap="round" opacity="${f1((1 - k) * 0.8 * 100) / 100}"/>`; }
  return `<g transform="translate(960 540) scale(${f1(zs * 1000) / 1000}) translate(-960 -540)">${inner}</g>` + sl; };
const fDesk = (x0, x1, top, col = '#C8A27A') => `<rect x="${x0 - 10}" y="${top - 22}" width="${x1 - x0 + 20}" height="26" rx="6" fill="${col}" stroke="${INK}" stroke-width="7"/><rect x="${x0 + 20}" y="${top + 4}" width="26" height="${1300 - top}" fill="#8A6A4E" stroke="${INK}" stroke-width="6"/><rect x="${x1 - 46}" y="${top + 4}" width="26" height="${1300 - top}" fill="#8A6A4E" stroke="${INK}" stroke-width="6"/>`;
const fLaptop = (x, y, s, screen) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-130 0 L130 0 L150 20 L-150 20 Z" fill="#B8C4D6" stroke="${INK}" stroke-width="6"/><rect x="-120" y="-170" width="240" height="166" rx="12" fill="#2B3445" stroke="${INK}" stroke-width="6"/><rect x="-106" y="-156" width="212" height="138" rx="6" fill="#DDEBFA"/>${screen || ''}</g>`;

/* ---------- 0. 05:00 알람 ---------- */
function falarmScene(t, lt, a) {
  const cam = qLerpCam(lt / 2.8, [1120, 640, 1.3], [1100, 620, 1.38]), tJ = 0.9, J = fJump(lt, tJ, 0.6);
  let w = '';
  const x = 1000, y = 1000;
  const ex = exprAt([[0, 'z졸음'], [tJ + 0.1, 'z충격'], [tJ + 0.75, 'z당황']], lt);
  w += qShadow(x, y, 66) + Z({ x, y: y + J.dy, s: 1, sx: J.sx, sy: J.sy, t, pose: lt < tJ ? '서기' : fJumpPose(J.ph), ex, look: lt > tJ + 0.75 ? [0.8, 0.3] : [0, 0], tilt: lt < tJ ? 8 * Math.sin(t * 2) : 0, seed: 3 });
  // the phone alarm on the nightstand
  const ring = lt < tJ + 1.4, sh = ring ? Math.sin(t * 60) * 6 : 0;
  w += `<g transform="translate(${f1(1380 + sh)} 560) rotate(${f1(sh)}) scale(.7)"><rect x="-44" y="-74" width="88" height="148" rx="16" fill="#1F2D44" stroke="${INK}" stroke-width="6"/><rect x="-36" y="-62" width="72" height="118" rx="8" fill="${ring && Math.floor(t * 6) % 2 ? '#FFE34D' : '#BFE6FF'}"/>${fT(0, 6, '05:00', 22, INK)}</g>`;
  if (ring) for (let i = 0; i < 3; i++) w += `<path d="M${1430 + i * 22} ${520 - i * 10} q14 16 0 32" fill="none" stroke="#FFD23F" stroke-width="6" stroke-linecap="round" opacity="${f1((0.5 + 0.5 * Math.sin(t * 20 + i)) * 100) / 100}"/>`;
  if (J.ph >= 2 && J.ph <= 4) w += speedLines(x, y - 420, 260, 380, 14, t, '#fff', 0.7);
  return fPlate('bedn', cam, 1) + qCam(cam, w) + fFull('#0A1238', 0.25 * (1 - prog(lt, 1.2, 2.6))) + (lt > 0.1 && lt < tJ + 0.5 ? fx(t, t - lt + 0.1, t - lt + tJ + 0.5, 1360, 230, '삐비빅!', '#FFE34D', { size: 70, rot: -6 }) : '');
}

/* ---------- 1~2. 갓생 몽타주 ---------- */
const SHOT = {
  wake: (t, l, d) => { const cam = [960, 620, 1.3], st = 1 + 0.05 * Math.sin(Math.min(l, 0.9) / 0.9 * Math.PI);
    let w = qShadow(900, 1000, 66) + Z({ x: 900, y: 1000, s: 1, sy: st, t, pose: '만세', ex: exprAt([[0, 'z하품'], [0.7, 'z결심']], l), seed: 3 });
    if (l > 0.7) w += rSparks(900, 420, t, 6, 180, '#FFE34D');
    return fPlate('bedn', cam, 0.5) + qCam(cam, w) + fFull('#FFD9A0', 0.12); },
  shower: (t, l, d) => { const cam = [960, 600, 1.3];
    let w = '';
    for (let i = 0; i < 16; i++) { const x = 920 + (i % 8) * 17 + (i > 7 ? 8 : 0), ph = (t * 3 + i * 0.13) % 1; w += `<line x1="${x}" y1="${f1(110 + ph * 620)}" x2="${x - 4}" y2="${f1(160 + ph * 620)}" stroke="#8FD3FF" stroke-width="7" stroke-linecap="round" opacity=".85"/>`; }
    w += qShadow(960, 1000, 66) + Z({ x: 960, y: 1000, s: 1, sy: 0.96, t, pose: '가슴' in P ? '가슴' : '웅크림', shiver: true, ex: fEx('z소름'), seed: 3 });
    return fPlate('shower', cam, 1) + qCam(cam, w) + fx(t, t - l + 0.15, t + 9, 1260, 300, '으아아!', '#BFE6FF', { size: 60, rot: 6 }); },
  subway: (t, l, d) => { const cam = [960, 600, 1.3], x = 960, y = 1000, sway = Math.sin(t * 2.2) * 4;
    const pose = Object.assign({}, P['서기'], { armR: [[252, 285], [282, 200], [290, 120]], hR: [290, 112], armL: [[148, 285], [130, 330], [170, 352]], hL: [176, 352] });
    let w = `<line x1="${x + 52}" y1="-100" x2="${x + 52}" y2="300" stroke="#9AA6B8" stroke-width="12"/><path d="M${x + 22} 300 Q${x + 52} 270 ${x + 82} 300 Q${x + 52} 340 ${x + 22} 300 Z" fill="none" stroke="#E9EEF5" stroke-width="12"/>`;
    w += qShadow(x, y, 66) + Z({ x, y, s: 1, rot: sway, t, pose, ex: exprAt([[0, 'z멍'], [0.6, 'z결심']], l), seed: 3 });
    const [hx, hy] = fHead(x, y); w += `<circle cx="${hx - 116}" cy="${hy + 20}" r="12" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="${hx + 116}" cy="${hy + 20}" r="12" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
    w += `<g transform="translate(${x - 30} ${y - 220}) rotate(-12)"><rect x="-56" y="-38" width="112" height="76" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/>${fT(0, 10, 'grit', 30, INK)}</g>`;
    ['efficiency', 'deadline', 'resilience', 'growth'].forEach((s, i) => { const ph = (l * 1.4 + i * 0.25) % 1; w += `<g opacity="${f1(Math.sin(ph * Math.PI) * 100) / 100}">${fT(hx + (i % 2 ? 1 : -1) * (160 + ph * 80), hy - 120 - ph * 160, s, 34, '#3D7EC8', { stroke: '#fff', sw: 6 })}</g>`; });
    return fPlate('subway', cam, 0.5) + qCam(cam, w) + tag(t, t - l + 0.1, t + 9, 380, 220, '재생 속도 2배', '#BFE6FF', { size: 40 }); },
  lunch: (t, l, d) => { const cam = [960, 640, 1.35], x = 960, y = 980;
    const typ = Math.floor(t * 12) % 2, pose = Object.assign({}, P['서기'], { armR: [[252, 285], [300, 340], [312, 392 - typ * 8]], hR: [312, 392 - typ * 8], armL: [[148, 285], [118, 250], [168, 214]], hL: [172, 210] });
    let w = qShadow(x, y, 66) + Z({ x, y, s: 1, t, pose, ex: fEx('z당황'), look: [0.6, 0.6], seed: 3 }) + fDesk(560, 1360, 800) + fLaptop(1110, 778, 1, `${fT(0, -80, '보고서_최종_진짜최종', 18, INK)}<rect x="-90" y="-60" width="180" height="10" fill="#9AA6B8"/><rect x="-90" y="-40" width="140" height="10" fill="#9AA6B8"/>`);
    const [hx, hy] = fHead(x, y); w += `<g transform="translate(${hx - 70} ${hy + 50}) rotate(-30)"><rect x="-4" y="-60" width="8" height="70" fill="#C89A5A"/><rect x="6" y="-60" width="8" height="70" fill="#C89A5A"/><circle cx="5" cy="-62" r="14" fill="#2E3B2E" stroke="${INK}" stroke-width="4"/><circle cx="5" cy="-62" r="7" fill="#fff"/></g>`;
    w += `<ellipse cx="760" cy="782" rx="90" ry="20" fill="#fff" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3].map(i => `<circle cx="${712 + i * 32}" cy="770" r="15" fill="#2E3B2E" stroke="${INK}" stroke-width="4"/><circle cx="${712 + i * 32}" cy="770" r="7" fill="#fff"/>`).join('');
    return fPlate('office', cam, 0.5) + qCam(cam, w) + fx(t, t - l + 0.2, t + 9, 1360, 330, '타닥타닥', '#fff', { size: 50, rot: -4 }); },
  gym: (t, l, d) => { const cam = [960, 620, 1.3], x = 960, y = 1000, rep = (Math.sin(t * 7) + 1) / 2;
    const up = rep > 0.5, hy = up ? 40 : 330, pose = Object.assign({}, P['서기'], { armL: [[148, 285], [84, up ? 170 : 310], [96, hy]], hL: [96, hy], armR: [[252, 285], [316, up ? 170 : 310], [304, hy]], hR: [304, hy] });
    let w = qShadow(x, y, 66) + Z({ x, y, s: 1, sy: up ? 1.03 : 0.98, t, pose, ex: fEx('z결심'), sweat: true, seed: 3 });
    for (const sx of [96, 304]) { const [px, py] = ptOf(x, y, 1, sx, hy); w += `<g transform="translate(${f1(px)} ${f1(py)})"><rect x="-46" y="-8" width="92" height="16" fill="#5B5B66" stroke="${INK}" stroke-width="4"/><rect x="-60" y="-26" width="22" height="52" rx="5" fill="#3B3F4E" stroke="${INK}" stroke-width="5"/><rect x="38" y="-26" width="22" height="52" rx="5" fill="#3B3F4E" stroke="${INK}" stroke-width="5"/></g>`; }
    return fPlate('gym', cam, 0.5) + qCam(cam, w) + pop(t, t - l + 0.1, t + 9, 400, 260, label(0, 0, `${10 + Math.min(2, Math.floor(l * 2.2))} / 12`, { size: 52, bg: '#FFE34D' }), {}); },
  night: (t, l, d) => { const cam = [1000, 640, 1.35], x = 1000, y = 980, nod = Math.max(0, Math.sin(t * 2.6)) ** 3;
    let w = qShadow(x, y, 66) + Z({ x, y, s: 1, t, pose: '카운터' in P ? '카운터' : '서기', ex: fEx('z졸음'), tilt: 14 * nod, seed: 3 }) + fDesk(640, 1400, 800, '#B88A62') + fLaptop(1180, 778, 1, `<polygon points="-16,-104 -16,-64 18,-84" fill="#E5484D"/>${fT(0, -36, '부업 강의 7강', 20, INK)}`);
    return fPlate('desknight', cam, 0.5) + qCam(cam, w) + pop(t, t - l + 0.1, t + 9, 400, 230, label(0, 0, '23:00', { size: 48, bg: '#BFE6FF' }), {}); },
};
function fmontScene(t, lt, a) {
  const cuts = a.cuts, base = a.base || 0, D = a._dur || 4;
  const starts = cuts.map((c, i) => i === 0 ? 0 : Math.max(0.2, fAt(a, c[1], i * D / cuts.length) - 0.25));
  let k = 0; starts.forEach((s, i) => { if (lt >= s) k = i; });
  const l2 = lt - starts[k], end = k + 1 < cuts.length ? starts[k + 1] : D, checkT = end - 0.35;
  const n = base + k + (lt > checkT ? 1 : 0), popT = lt > checkT ? lt - checkT : (k > 0 ? lt - (starts[k] - 0.35) : (base ? 9 : 9));
  return fWhip(l2, SHOT[cuts[k][0]](t, l2, end - starts[k])) + fHud(t, n, popT) + (lt > checkT && lt < checkT + 0.6 ? fx(t, t - lt + checkT, t + 9, 1300, 160, '띵!', '#3DBA8A', { size: 50 }) : '');
}
function fgridScene(t, lt, a) {
  const K = ['wake', 'shower', 'subway', 'lunch', 'gym', 'night'], tS = fAt(a, '열심히', 2.6), pw = 600, ph = 337, gx = 30, gy = 40, x0 = (1920 - (3 * pw + 2 * gx)) / 2, y0 = 150;
  let h = fFull('#1E2433');
  K.forEach((k, i) => { const c = i % 3, r = Math.floor(i / 3), x = x0 + c * (pw + gx), y = y0 + r * (ph + gy), g = easeOutBack(clamp((lt - i * 0.12) / 0.35, 0, 1));
    h += `<defs><clipPath id="fg${i}"><rect x="0" y="0" width="1920" height="1080"/></clipPath></defs><g transform="translate(${f1(x + pw / 2)} ${f1(y + ph / 2)}) scale(${f1(g * 100) / 100}) translate(${-pw / 2} ${-ph / 2})"><rect x="-8" y="-8" width="${pw + 16}" height="${ph + 16}" rx="18" fill="#fff"/><svg x="0" y="0" width="${pw}" height="${ph}" viewBox="0 0 1920 1080">${SHOT[k](t + i, 1.2 + i * 0.1, 2)}</svg></g>`; });
  if (lt > tS) h += fFull('#000', 0.35 * clamp((lt - tS) / 0.3, 0, 1)) + pop(t, t - lt + tS, t + 9, 960, 560, `<g transform="rotate(-8) scale(1.5)"><rect x="-300" y="-80" width="600" height="160" rx="26" fill="none" stroke="#3DBA8A" stroke-width="16"/>${fT(0, 30, '갓생 인증 ✔', 84, '#3DBA8A')}</g>`, {}) + rSparks(960, 560, t, 12, 520, '#FFE34D');
  return h;
}

/* ---------- 3. 금요일 밤: 녹아내림 ---------- */
// 소파는 직접 그린다: 등받이·받침(제로 뒤) → 제로 → 쿠션 앞면·팔걸이(제로 앞). 앉으면 엉덩이가 쿠션에 묻힌다.
const SOFA = { x: 960, S: 890, floor: 1000 }; // S = seat (cushion) top
const SOFA_C = { back: '#C98F2E', cush: '#E8B24A', dark: '#A8701E', arm: '#D99B36' };
function fSofaBack() { const x = SOFA.x, S = SOFA.S, F = SOFA.floor;
  return `<g stroke="${INK}" stroke-width="9" stroke-linejoin="round"><path d="M${x - 380} ${F - 6} L${x - 380} ${S - 214} Q${x - 380} ${S - 286} ${x - 312} ${S - 286} L${x + 312} ${S - 286} Q${x + 380} ${S - 286} ${x + 380} ${S - 214} L${x + 380} ${F - 6} Z" fill="${SOFA_C.back}"/>` +
    `<rect x="${x - 304}" y="${S - 262}" width="296" height="244" rx="50" fill="${SOFA_C.cush}"/><rect x="${x + 8}" y="${S - 262}" width="296" height="244" rx="50" fill="${SOFA_C.cush}"/>` +
    `<rect x="${x - 320}" y="${S - 12}" width="640" height="40" rx="14" fill="${SOFA_C.cush}"/><rect x="${x - 330}" y="${S + 48}" width="660" height="${F - S - 54}" rx="10" fill="${SOFA_C.dark}"/></g>` +
    `<path d="M${x - 250} ${S - 238} Q${x - 160} ${S - 248} ${x - 60} ${S - 236}" stroke="#fff" stroke-width="8" fill="none" opacity=".3" stroke-linecap="round"/>`; }
function fSofaFront() { const x = SOFA.x, S = SOFA.S, F = SOFA.floor;
  return `<g stroke="${INK}" stroke-width="9" stroke-linejoin="round"><rect x="${x - 326}" y="${S - 4}" width="652" height="58" rx="22" fill="${SOFA_C.cush}"/><line x1="${x}" y1="${S + 2}" x2="${x}" y2="${S + 50}" stroke-width="5" opacity=".5"/>` +
    [-1, 1].map(sd => `<rect x="${sd < 0 ? x - 416 : x + 316}" y="${S - 110}" width="100" height="${F - S + 104}" rx="42" fill="${SOFA_C.arm}"/>`).join('') +
    [-1, 1].map(sd => `<rect x="${x + sd * 330 - 14}" y="${F - 6}" width="28" height="22" rx="6" fill="#6A4A2A"/>`).join('') + `</g>`; }
const ARM_R = () => [SOFA.x + 366, SOFA.S - 112]; // coach stands on the right armrest
P['f앉기'] = { armL: [[148, 285], [156, 352], [214, 396]], hL: [218, 398], armR: [[252, 285], [282, 344], [282, 394]], hR: [284, 396], legL: [[188, 412], [282, 420], [284, 512]], fL: [302, 522, 0], legR: [[212, 408], [304, 410], [308, 504]], fR: [326, 514, 0], dy: 0 }; // L-shape: thighs flat on the cushion, shins down
const fSitY = sy => SOFA.S - 12 + 148 * sy; // origin y so the hips rest ON the cushion top
function fMelted(t, lt, k, o = {}) { // k: 0..1 melt amount (hips stay on the cushion)
  const x = SOFA.x, sy = 1 - 0.42 * k, sx = 1 + 0.22 * k, y = fSitY(sy);
  const sw = Math.sin(t * 4.2) * 6, pz = Object.assign({}, P['f앉기'], { legL: [[188, 412], [282, 420], [284 + sw, 512]], fL: [302 + sw, 522, sw], legR: [[212, 408], [304, 410], [308 - sw, 504]], fR: [326 - sw, 514, -sw] });
  let w = Z({ x, y, s: 1, sx, sy, t, pose: pz, ex: o.ex || fEx(k > 0.5 ? 'z기절' : 'z멍'), look: o.look || [0, 0.2], tilt: o.tilt || 0, seed: 3 });
  if (k > 0.4 && !o.noSoul) { const [hx, hy] = fHead(x, y, 1, sy), r = 0.5 + 0.5 * Math.sin(t * 1.5);
    w += `<g opacity=".85"><path d="M${hx} ${f1(hy - 100 * sy)} Q${hx + 20} ${f1(hy - 150)} ${f1(hx + 10 + r * 10)} ${f1(hy - 190)}" stroke="#fff" stroke-width="10" fill="none"/><g transform="translate(${f1(hx + 10 + r * 10)} ${f1(hy - 220 - r * 16)})"><path d="M-34 24 Q-40 -38 0 -40 Q40 -38 34 24 Q24 14 16 26 Q8 14 0 26 Q-8 14 -16 26 Q-24 14 -34 24 Z" fill="#F4F8FF" stroke="${INK}" stroke-width="5"/><path d="M-16 -8 L-6 -14 M6 -14 L16 -8" stroke="${INK}" stroke-width="4"/></g></g>`; }
  return w;
}
const fRoom = (cam, back, front) => fPlate('living2', cam, 0.6) + qCam(cam, fSofaBack() + fSofaFront() + back + front); // the whole sofa is behind the sitter
function fmeltScene(t, lt, a) {
  const tQ = fAt(a, '이상', 0.9), tS = fAt(a, '이렇게', 2.0), tM = fAt(a, '피곤', 3.6);
  const cam = qLerpCam(prog(lt, tS, tM + 1), [960, 660, 1.15], [960, 720, 1.35]);
  let back = '', front = '';
  if (lt < tS) { const g = clamp(lt / Math.max(0.6, tQ), 0, 1), x = lerp(300, 820, easeOut(g)), stop = lt > tQ;
    front += qShadow(x, SOFA.floor + 10, 66) + Z({ x, y: SOFA.floor + 20, s: 1, sy: 0.97, t, pose: stop ? '서기' : walkPose(lt * 5, 0.5), ex: stop ? exprAt([[tQ, 'z의심']], lt) : fEx('z멍'), look: stop ? [0, 0] : [0.4, 0.3], tilt: stop ? -8 : 4, seed: 3 });
    if (stop) front += pop(t, t - lt + tQ, t + 9, x + 150, 560, fT(0, 0, '?', 90, '#fff', { stroke: INK, sw: 10 }), {});
  } else {
    const sit = clamp((lt - tS) / 0.3, 0, 1), k = easeInOut(clamp((lt - tM) / 1.1, 0, 1));
    if (sit < 1) { // turn and drop onto the cushion: a small hop, then a squash on landing
      const x = lerp(820, SOFA.x, easeInOut(sit)), y = lerp(SOFA.floor + 20, fSitY(1), sit) - Math.sin(sit * Math.PI) * 60;
      back += Z({ x, y, s: 1, sy: 1 + 0.06 * Math.sin(sit * Math.PI), t, pose: sit > 0.5 ? P['f앉기'] : '서기', ex: fEx('z멍'), seed: 3 });
    } else { const land = Math.exp(-(lt - tS - 0.3) * 9) * 0.08;
      back += fMelted(t, lt, k, { ex: lt < tM ? fEx('z멍') : exprAt([[tM, 'z울먹'], [tM + 0.6, 'z기절']], lt), tilt: -3 }).replace('', '');
      if (land > 0.005) back = `<g transform="translate(${SOFA.x} ${SOFA.S}) scale(${f1((1 + land) * 1000) / 1000} ${f1((1 - land) * 1000) / 1000}) translate(${-SOFA.x} ${-SOFA.S})">${back}</g>`; }
    if (lt > tM + 0.5) front += pop(t, t - lt + tM + 0.5, t + 9, 1250, 960, `<g transform="rotate(8) scale(.8)"><rect x="-80" y="-130" width="160" height="260" rx="22" fill="#1F2D44" stroke="${INK}" stroke-width="6"/><rect x="-68" y="-112" width="136" height="214" rx="10" fill="#EAF0F6"/>${fT(0, -66, '이번 주', 22, INK)}${fT(0, -36, '목표 달성률', 22, INK)}${fT(0, 22, '94%', 52, '#3DBA8A')}<rect x="-54" y="44" width="108" height="14" rx="7" fill="#D5DEEA"/><rect x="-54" y="44" width="101" height="14" rx="7" fill="#3DBA8A"/></g>`, {});
  }
  const dim = prog(lt, tM, tM + 1.4);
  return fRoom(cam, back, front) + fFull('#0A1030', 0.25 * dim) + (lt > tM + 0.2 ? fx(t, t - lt + tM + 0.2, t + 9, 700, 320, '스르륵…', '#E9DFF5', { size: 52, rot: -6 }) : '');
}

/* ---------- 4. 미니 코치 등장 (코치 목소리): 오른쪽 팔걸이 위에서 확성기 ---------- */
function fcoachScene(t, lt, a) {
  const cam = qLerpCam(lt / 3, [1110, 760, 1.55], [1120, 750, 1.65]);
  const [ax, ay] = ARM_R(), g = easeOutBack(clamp(lt / 0.35, 0, 1)), J = fJump(lt, 0.9, 0.35);
  E['_fc'] = Object.assign({}, qTalk('z결심', env(t)));
  const coach = fCoach(t, { x: ax, y: ay + J.dy, s: 0.32 * g, sx: J.sx, sy: J.sy, pose: '서기', ex: fEx('_fc'), look: [-0.7, 0.2], mega: true, megaSide: -1, megaTilt: -8, wave: env(t) > 0.2 }) + (lt < 0.5 ? puff(ax, ay - 80, t, t - lt, 0.7, '#fff') : '');
  return fRoom(cam, fMelted(t, lt, 1, { ex: fEx('z기절'), noSoul: lt > 0.3 }), coach) + fFull('#0A1030', 0.25) + (lt < 0.6 ? fx(t, t - lt, t - lt + 0.6, 1400, 280, '뿅!', '#FFE34D', { size: 64 }) : '');
}
/* ---------- 5. 눈이 마주침 → 깜짝 7단계 → 코치가 어깨로 폴짝 ---------- */
function ftakeScene(t, lt, a) {
  const tT = 0.15, tM = 0.9, tJ = 1.25, J = fJump(lt, tJ, 0.7), tH = 1.75, tL = 2.25;
  const cam = qLerpCam(lt / 2.4, [1100, 740, 1.6], [1040, 700, 1.45]);
  const turn = easeInOut(clamp((lt - tT) / 0.6, 0, 1)), up = lt > tJ;
  const ex = exprAt([[0, 'z멍'], [tM, 'z의심'], [tJ + 0.12, 'z충격']], lt);
  const x = SOFA.x, standY = SOFA.floor + 20;
  let back = '', front = '';
  if (!up) back += fMelted(t, lt, 1, { ex, look: [turn * 0.95, -turn * 0.3], tilt: -turn * 10, noSoul: true });
  else front += Z({ x, y: standY + J.dy, s: 1, sx: J.sx, sy: J.sy, t, pose: J.ph <= 1 ? P['f앉기'] : J.ph <= 4 ? '만세' : '서기', ex, look: [0.6, 0], seed: 3 });
  // the coach: waves from the armrest, gets startled, then hops onto Zero's shoulder
  const [ax, ay] = ARM_R(), sh = [x + 18, standY - 500], hop = clamp((lt - tH) / (tL - tH), 0, 1);
  const cx = lerp(ax, sh[0], easeInOut(hop)), cy = lerp(ay, sh[1], hop) - Math.sin(hop * Math.PI) * 130;
  front += fCoach(t, { x: cx, y: cy, s: 0.32, rot: up && hop === 0 ? Math.sin(t * 40) * 8 : 0, pose: hop > 0 && hop < 1 ? '만세' : lt > tM && lt < tJ ? '손인사' : '서기', ex: fEx(lt > tJ && hop < 1 ? 'z당황' : 'z빵긋'), look: [-0.8, 0.2], mega: true, megaSide: -1, megaTilt: -8 });
  if (lt > tJ + 0.15 && lt < tH) front += speedLines(x, standY - 400, 300, 460, 16, t, '#fff', 0.75);
  return fRoom(cam, back, front) + fFull('#0A1030', 0.22) + (lt > tM - 0.05 && lt < tJ ? `<g opacity=".9">${fT(960, 260, '…', 90, '#fff', { stroke: INK, sw: 10 })}</g>` : '') + (lt > tJ + 0.1 && lt < tH + 0.4 ? fx(t, t - lt + tJ + 0.1, t + 9, 960, 200, '!!', '#FFE34D', { size: 110, burst: 120, burstColor: '#FF6B3D' }) : '');
}

/* ---------- 6. 누가 시켰지? (코치는 제로 오른쪽 어깨 위) ---------- */
const fSil = (x, y, s, o = {}) => `<g filter="url(#sil)">${char(Object.assign({ goggles: 'none', vest: '#444', patch: false, tee: true, x, y, s, t: 0, still: true, pose: '서기', ex: fEx('기본') }, o))}</g>`;
function fwhoScene(t, lt, a) {
  const tB = fAt(a, '상사', 0.2), tP = fAt(a, '부모님', 1.6), tW = fAt(a, '누가', 3.4), x = SOFA.x, y = SOFA.floor + 20;
  const cam = lt < tW - 0.1 ? qLerpCam(lt / tW, [960, 640, 1.2], [960, 640, 1.26]) : qLerpCam((lt - tW + 0.1) / 0.35, [960, 640, 1.26], [990, 560, 1.75]);
  let w = qShadow(x, y, 66) + Z({ x, y, s: 1, t, pose: '턱괴기', ex: exprAt([[0, 'z의심'], [tW, 'z기본']], lt), look: lt < tP ? [-0.9, -0.3] : lt < tW ? [0.9, -0.3] : [0.2, 0], seed: 3 });
  const bub = (bx, by, inner, t0) => pop(t, t - lt + t0, t + 99, bx, by, `<g>${bubble(0, 0, 360, 260, inner)}</g>` + (lt > t0 + 0.7 ? `<g transform="scale(${f1(easeOutBack(clamp((lt - t0 - 0.7) / 0.25, 0, 1)) * 100) / 100})"><path d="M-110 -90 L110 90 M110 -90 L-110 90" stroke="#E5484D" stroke-width="22" stroke-linecap="round"/></g>` : ''), { bob: 3 });
  if (lt < tW - 0.05) w += bub(560, 420, fSil(0, 110, 0.36, { collar: true, tie: '#1E2230' }) + fT(0, 116, '상사', 28, INK), tB);
  if (lt < tW - 0.05) w += bub(1360, 420, fSil(-50, 110, 0.32, {}) + fSil(50, 110, 0.32, { hairBack: HAIR.bob().hairBehind }) + fT(0, 116, '부모님', 28, INK), tP);
  const innocent = lt > tW, sh = [x + 18, y - 500];
  w += fCoach(t, { x: sh[0], y: sh[1], s: 0.32, pose: '서기', ex: fEx(innocent ? 'z히죽' : 'z기본'), look: innocent ? [0.9, -0.6] : [-0.4, 0.4], mega: true, megaSide: 1, megaTilt: 25 });
  if (innocent) for (let i = 0; i < 2; i++) { const ph = (lt * 1.2 + i * 0.5) % 1; w += `<g opacity="${f1(Math.sin(ph * Math.PI) * 100) / 100}">${fT(sh[0] + 70 + ph * 50, sh[1] - 140 - ph * 60, '♪', 46, '#3D7EC8', { stroke: '#fff', sw: 6 })}</g>`; }
  return fRoom(cam, '', w);
}
/* ---------- 7. 범인은 가까이 ---------- */
function fculpritScene(t, lt, a) {
  const x = SOFA.x, y = SOFA.floor + 20, sh = [x + 18, y - 500], cam = qLerpCam(lt / 2.6, [990, 560, 1.75], [990, 540, 1.95]), tT = fAt(a, '가까이', 1.3);
  let w = qShadow(x, y, 66) + Z({ x, y, s: 1, t, pose: '서기', ex: fEx('z기본'), look: [0, -0.6], seed: 3 });
  w += fCoach(t, { x: sh[0], y: sh[1], s: 0.32, pose: '서기', ex: exprAt([[0, 'z당황'], [tT + 0.4, 'z메롱']], lt), look: [-0.3, 0], mega: true, megaSide: 1, megaTilt: 30 });
  const dk = clamp(lt / 0.4, 0, 1), scx = sh[0], scy = sh[1] - 50;
  w += `<defs><radialGradient id="fspot" gradientUnits="userSpaceOnUse" cx="${f1(scx)}" cy="${f1(scy)}" r="230"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${f1(0.8 * dk * 100) / 100}"/></radialGradient></defs><rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#fspot)"/>`;
  if (lt > 0.2) w += `<g opacity=".5">${speedLines(scx, scy, 260, 900, 22, t, '#fff', 0.6)}</g>`;
  let over = '';
  if (lt > tT - 0.3) over += pop(t, t - lt + tT - 0.3, t + 9, 1500, 260, `<g transform="rotate(-6)"><rect x="-130" y="-60" width="260" height="120" rx="20" fill="#E5484D" stroke="${INK}" stroke-width="8"/>${fT(0, 26, '범인', 72, '#fff')}</g><path d="M-140 50 Q-260 160 -330 260" fill="none" stroke="#E5484D" stroke-width="14" stroke-linecap="round" stroke-dasharray="4 26"/>`, {});
  return fRoom(cam, '', w) + over;
}
/* ---------- 8. 타이틀 ---------- */
const fFlicker = (lt, t0) => { const k = lt - t0; if (k < 0) return 0; if (k > 0.8) return 0.94 + 0.06 * Math.sin(lt * 40); return [1, 0, 1, 1, 0, 0, 1, 0, 1, 1][Math.floor(k * 12) % 10]; };
function ftitleScene(t, lt, a) {
  const on = fFlicker(lt, 0.2);
  let h = fFull('#120E1C') + `<g opacity="${f1((0.25 + 0.75 * on) * 100) / 100}" filter="url(#fneon)">${fT(960, 600, '[제로의 세계]', 150, '#FFF4FB', { stroke: '#FF4FA6', sw: 12 })}</g>`;
  return fNeonDefs() + h;
}
/* ---------- 9. 책 카드: 피로사회 ---------- */
function fbookScene(t, lt, a) {
  const tN = fAt(a, '한병철', 3.6), tF = fAt(a, '피로사회', (a._dur || 7) - 1.0), cam = qLerpCam(lt / (a._dur || 7), [960, 560, 1.0], [960, 560, 1.08]);
  let w = fFull('#EDE6D8') + `<rect x="-300" y="-200" width="2600" height="1500" fill="url(#paper)"/>`;
  const bk = easeOutBack(clamp(lt / 0.5, 0, 1)), zoom = lt > tF ? 1 + 0.06 * Math.exp(-(lt - tF) * 6) : 1;
  w += `<g transform="translate(960 560) scale(${f1(bk * zoom * 100) / 100}) rotate(-3)"><rect x="-230" y="-310" width="460" height="620" rx="16" fill="#000" opacity=".2" transform="translate(14 16)"/><rect x="-230" y="-310" width="460" height="620" rx="16" fill="#C9D6E4" stroke="${INK}" stroke-width="9"/><rect x="-230" y="-310" width="40" height="620" fill="#A9BAD0" stroke="${INK}" stroke-width="6"/>` +
    fT(20, -120, '피로사회', 92, '#2B3445') + `<line x1="-120" y1="-80" x2="160" y2="-80" stroke="#2B3445" stroke-width="5"/>` + (lt > tN ? fT(20, 170, '한병철', 46, '#2B3445') : '') + fT(20, 240, '2010', 34, '#5B6478') + `</g>`;
  // Zero peeks from the left, the coach sits on top of the book
  const peek = easeOut(clamp((lt - 0.4) / 0.5, 0, 1));
  w += `<g transform="translate(${f1(560 + 80 * peek)} 0)">${Z({ x: 0, y: 1100, s: 1, t, pose: '만세', ex: exprAt([[0, 'z멍'], [tF, 'z하품']], lt), look: [0.8, -0.2], seed: 3 })}</g>`;
  w += fCoach(t, { x: 1060, y: 268 + (lt > tF ? 0 : Math.abs(Math.sin(t * 3)) * -6), s: 0.34, pose: P['f앉기'], ex: fEx(lt > tF ? 'z졸음' : 'z빵긋'), look: [-0.5, 0.3] });
  if (lt > tF) w += pop(t, t - lt + tF, t + 99, 1420, 360, fT(0, 0, 'z z z', 60, '#5B6478'), {});
  return qCam(cam, w);
}
// shared defs for every scene (blur, warm light, neon)
FN.forEach(k => { const f = window[k + 'Scene']; window[k + 'Scene'] = (...x) => qDefs() + fNeonDefs() + f(...x); });
