/* 디오게네스 편 — 인트로~1막 (SCRIPT_v2 / STORYBOARD.md). 이름은 모두 dg 접두사. fatigue01의 fscenes·fscenes2를 도구로 쓴다.
   규칙: 해는 늘 화면 오른쪽 위 → 그림자는 왼쪽 · 배낭은 어깨끈이 보이고 몸 뒤에서 이어짐 · 원인 다음 결과 · 앉으면 엉덩이가 땅(면) 위. */
Object.assign(QBG, { genkan: 'ai/genkan.png', subway: 'ai/subway.png', corinth: 'ai/corinth.png', fount: 'ai/fount.png', street: 'ai/street.png' });
['dghall', 'dgstairs', 'dgcor', 'dgtitle', 'dgjar', 'dginv', 'dgfount', 'dgdog'].forEach(k => CAMS[k] = 'fixed');
const DG_SUN = [1820, 60];
const dgK = (t0, t1, x) => clamp((x - t0) / (t1 - t0), 0, 1);
const dgPose = (base, o) => Object.assign({}, typeof base === 'string' ? P[base] : base, o);
const dgDefs = () => `<defs>
<radialGradient id="dgSunG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE6A0" stop-opacity=".38"/><stop offset="1" stop-color="#FFE08A" stop-opacity="0"/></radialGradient>
<linearGradient id="dgBeam" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1B8" stop-opacity=".75"/><stop offset="1" stop-color="#FFF1B8" stop-opacity="0"/></linearGradient>
</defs>`;
const dgPlate = (k, cam, depth = 0.6, extra = '') => {
  const [cx, cy, z] = cam, zb = 1 + (z - 1) * depth; let bx = 960 + (cx - 960) * depth, by = 560 + (cy - 560) * depth;
  const hx = 960 / 0.88 / zb; bx = clamp(bx, -150 + hx + 4, 2070 - hx - 4); by = clamp(by, -30 + 573.6 / zb + 4, 1220 - 653.6 / zb - 4);
  return `<g transform="translate(960 560) scale(${f1(zb * 1000) / 1000}) translate(${f1(-bx)} ${f1(-by)})"><image href="${QBG[k]}" x="-150" y="-30" width="2220" height="1250" preserveAspectRatio="xMidYMid slice"/>${extra}</g>`;
};
const dgSunWarm = (x, y, r, k) => k > 0.01 ? `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="url(#dgSunG)" opacity="${f1(k * 0.6 * 100) / 100}"/>` : '';

/* ---------- 제로의 배낭: 몸 뒤(dgPackBack) + 어깨끈(dgPackStrap). size 0~1.2 ---------- */
function dgPackBack(x, y, s, size, o = {}) { const lean = o.lean || 0, w = (210 + 260 * size), top = 250 - (40 + 330 * size), bot = 436;
  const cx = 200, items = o.items || 0;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000}) translate(-200 -560) rotate(${f1(lean)} 200 300)">`;
  // 옆주머니(물병) — 몸 양옆으로 불룩
  h += `<rect x="${f1(cx - w / 2 - 34)}" y="${f1(lerp(top, bot, 0.45))}" width="60" height="${f1((bot - top) * 0.42)}" rx="22" fill="#3F5277" stroke="${INK}" stroke-width="7"/><rect x="${f1(cx + w / 2 - 26)}" y="${f1(lerp(top, bot, 0.5))}" width="60" height="${f1((bot - top) * 0.38)}" rx="22" fill="#3F5277" stroke="${INK}" stroke-width="7"/><rect x="${f1(cx + w / 2 - 14)}" y="${f1(lerp(top, bot, 0.5) - 40)}" width="34" height="56" rx="10" fill="#9ED8FF" stroke="${INK}" stroke-width="5"/>`;
  h += `<path d="M${f1(cx - w / 2)} ${bot} L${f1(cx - w / 2)} ${f1(top + w * 0.32)} Q${f1(cx - w / 2)} ${f1(top)} ${cx} ${f1(top)} Q${f1(cx + w / 2)} ${f1(top)} ${f1(cx + w / 2)} ${f1(top + w * 0.32)} L${f1(cx + w / 2)} ${bot} Q${cx} ${bot + 16} ${f1(cx - w / 2)} ${bot} Z" fill="#4F6489" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  // 덮개 + 가운데 버클 끈
  h += `<path d="M${f1(cx - w / 2 + 14)} ${f1(top + w * 0.3)} Q${f1(cx - w / 2 + 14)} ${f1(top + 10)} ${cx} ${f1(top + 10)} Q${f1(cx + w / 2 - 14)} ${f1(top + 10)} ${f1(cx + w / 2 - 14)} ${f1(top + w * 0.3)} Q${cx} ${f1(top + w * 0.42)} ${f1(cx - w / 2 + 14)} ${f1(top + w * 0.3)} Z" fill="#3B4C70" stroke="${INK}" stroke-width="6"/>`;
  // 윗구멍으로 삐져나온 물건들
  const pk = [[-0.26, '#E5484D', 'box'], [0.04, '#2B2F3A', 'remote'], [0.28, '#F2C14E', 'key'], [-0.08, '#9FC7F0', 'cloud'], [0.2, '#C99566', 'box']];
  for (let i = 0; i < Math.min(items, 5); i++) { const [dx, c, kind] = pk[i], px = cx + dx * w, py = top + 18;
    if (kind === 'box') h += `<rect x="${f1(px - 34)}" y="${f1(py - 46)}" width="68" height="56" rx="4" fill="${c}" stroke="${INK}" stroke-width="5" transform="rotate(${i * 7 - 10} ${f1(px)} ${f1(py)})"/>`;
    if (kind === 'remote') h += `<rect x="${f1(px - 12)}" y="${f1(py - 70)}" width="24" height="80" rx="8" fill="${c}" stroke="${INK}" stroke-width="5" transform="rotate(12 ${f1(px)} ${f1(py)})"/>`;
    if (kind === 'key') h += `<g transform="translate(${f1(px)} ${f1(py - 30)}) rotate(-20)"><circle r="20" fill="${c}" stroke="${INK}" stroke-width="5"/><rect x="14" y="-6" width="40" height="12" fill="${c}" stroke="${INK}" stroke-width="4"/></g>`;
    if (kind === 'cloud') h += `<path d="M${f1(px - 40)} ${f1(py)} q-6 -34 26 -34 q10 -24 36 -10 q30 -6 30 28 Z" fill="${c}" stroke="${INK}" stroke-width="5"/>`; }
  return h + `</g>`; }
function dgPackStrap(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000}) translate(-200 -560)"><path d="M156 262 Q150 330 158 404 M244 262 Q250 330 242 404" fill="none" stroke="${INK}" stroke-width="24" stroke-linecap="round"/><path d="M156 262 Q150 330 158 404 M244 262 Q250 330 242 404" fill="none" stroke="#3E4C68" stroke-width="14" stroke-linecap="round"/><rect x="146" y="338" width="108" height="10" rx="5" fill="#3E4C68" stroke="${INK}" stroke-width="4"/></g>`; }
// 떨어지는 물건(위에서 배낭 윗구멍으로)
function dgDropItem(kind, x, y, s = 1, rot = 0) { let g = '';
  if (kind === 'remote') g = `<rect x="-14" y="-46" width="28" height="92" rx="9" fill="#2B2F3A" stroke="${INK}" stroke-width="5"/><circle cy="-26" r="7" fill="#E5484D"/>`;
  if (kind === 'phones') g = `<path d="M-34 0 Q-34 -40 0 -40 Q34 -40 34 0" fill="none" stroke="${INK}" stroke-width="10"/><rect x="-44" y="-8" width="22" height="34" rx="8" fill="#7FB3D9" stroke="${INK}" stroke-width="5"/><rect x="22" y="-8" width="22" height="34" rx="8" fill="#7FB3D9" stroke="${INK}" stroke-width="5"/>`;
  if (kind === 'key') g = `<circle r="24" fill="#F2C14E" stroke="${INK}" stroke-width="5"/><rect x="18" y="-8" width="50" height="16" fill="#F2C14E" stroke="${INK}" stroke-width="5"/>`;
  if (kind === 'cloud') g = `<path d="M-50 20 q-8 -40 30 -40 q12 -28 44 -12 q36 -8 36 32 Z" fill="#9FC7F0" stroke="${INK}" stroke-width="5"/>`;
  if (kind === 'box') g = `<rect x="-40" y="-32" width="80" height="64" rx="5" fill="#C99566" stroke="${INK}" stroke-width="5"/><path d="M-40 -8 L40 -8" stroke="#8A5A34" stroke-width="6"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000})">${g}</g>`; }
const DG_NOTI = [['OTT 구독료 결제', '#E5484D', 'remote'], ['음악 구독 결제', '#7CC7FF', 'phones'], ['자동차 할부 12/36회차', '#F2C14E', 'key'], ['클라우드 용량 부족', '#9FC7F0', 'cloud'], ['택배 3개 도착', '#C99566', 'box']];
function dgNoti(i, k) { const [txt, c] = DG_NOTI[i], y = 70 + i * 92, x = lerp(2200, 1500, easeOutBack(k));
  return `<g transform="translate(${f1(x)} ${y})"><rect x="0" y="0" width="420" height="76" rx="18" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="14" y="14" width="48" height="48" rx="12" fill="${c}" stroke="${INK}" stroke-width="4"/>${fT(80, 49, txt, 28, INK, { anchor: 'start' })}</g>`; }

/* ---------- 1. 현관: 알림마다 배낭에 쿵 ---------- */
function dghallScene(t, lt, a) {
  const ph = a.ph, x = 900, F = 1000, s = 1;
  const T = [0.35, 1.15, 1.95, 2.75, 3.55]; // 알림 시각(s0 안)
  const nIn = ph === 0 ? T.filter(v => lt > v + 0.55).length : 5;
  const size = 0.25 + 0.17 * nIn;
  let squash = 0; if (ph === 0) T.forEach(v => { const d = lt - (v + 0.55); if (d > 0 && d < 0.3) squash = Math.max(squash, Math.sin(d / 0.3 * Math.PI)); });
  const hug = ph === 1, cam = ph === 0 ? [920, 560, 1.12] : qLerpCam(lt / 2.5, [920, 600, 1.2], [900, 560, 1.5]);
  const pose = hug ? dgPose('서기', { armL: [[148, 285], [160, 340], [214, 336]], hL: [218, 334], armR: [[252, 285], [244, 340], [190, 336]], hR: [186, 334] }) : '서기';
  const ex = hug ? exprAt([[0, 'z하트눈'], [2.4, 'z당황']], lt) : exprAt([[0, 'z기본'], [0.9, 'z의심'], [2.4, 'z당황']], lt);
  let w = qShadow(x, F, 70) + dgPackBack(x, F, s, size, { items: nIn });
  w += `<g transform="translate(${f1(x)} ${F}) scale(${f1((1 + squash * 0.06) * 1000) / 1000} ${f1((1 - squash * 0.09) * 1000) / 1000}) translate(${-x} ${-F})">` + Z({ x, y: F, s, t, pose, ex, look: hug ? [0, 0.5] : [0.4, -0.5] }) + dgPackStrap(x, F, s) + `</g>`;
  // 떨어지는 물건: 화면 위 → 배낭 윗구멍
  if (ph === 0) T.forEach((v, i) => { const d = lt - v; if (d < 0 || d > 0.55) return; const k = d / 0.55, top = F + (250 - (40 + 330 * (0.25 + 0.17 * i)) - 560) * s;
    w += dgDropItem(DG_NOTI[i][2], x + (i % 2 ? 30 : -30), lerp(-120, top + 20, k * k), 1, k * 200 * (i % 2 ? 1 : -1)); });
  if (hug) { const [bx, by] = ptOf(x, F, s, 202, 330); w += dgDropItem('box', bx, by, 1.3) + `<g opacity=".8">${fx(t, t - lt + 0.2, t - lt + 2.2, bx + 70, by - 80, '♥', '#FF7A9A', { size: 50 })}</g>`; }
  let over = ''; if (ph === 0) T.forEach((v, i) => { if (lt > v) over += dgNoti(i, clamp((lt - v) / 0.35, 0, 1)); });
  if (ph === 0) T.forEach((v, i) => { if (lt > v + 0.55 && lt < v + 1.0) over += fx(t, t - lt + v + 0.55, t - lt + v + 1.0, x - 160, 260, '쿵', '#fff', { size: 50, rot: -8 }); });
  return dgDefs() + dgPlate('genkan', cam, 0.6) + qCam(cam, w) + over;
}

/* ---------- 2. 지하철역 계단: 배낭이 머리 위로 넘어와 출구 햇빛을 가린다 ---------- */
const DG_ST = { x0: 420, y0: 1010, w: 150, h: 58, n: 9 };
const dgStepTop = i => [DG_ST.x0 + DG_ST.w * (i + 0.5), DG_ST.y0 - DG_ST.h * i];
function dgStairs() { let h = ''; for (let i = 0; i < DG_ST.n; i++) { const x = DG_ST.x0 + DG_ST.w * i, y = DG_ST.y0 - DG_ST.h * (i + 1);
    h += `<rect x="${x}" y="${y}" width="${DG_ST.w + 2}" height="${DG_ST.h * (i + 1) + 80}" fill="${i % 2 ? '#B9BCC6' : '#C4C7D0'}" stroke="${INK}" stroke-width="6"/><rect x="${x}" y="${y}" width="${DG_ST.w + 2}" height="12" fill="#E9C46A" stroke="${INK}" stroke-width="4"/>`; }
  h += `<path d="M${DG_ST.x0} ${DG_ST.y0 - 170} L${DG_ST.x0 + DG_ST.w * DG_ST.n} ${DG_ST.y0 - DG_ST.h * DG_ST.n - 170}" stroke="#8A8F9C" stroke-width="12" stroke-linecap="round"/><path d="M${DG_ST.x0} ${DG_ST.y0 - 170} L${DG_ST.x0 + DG_ST.w * DG_ST.n} ${DG_ST.y0 - DG_ST.h * DG_ST.n - 170}" stroke="${INK}" stroke-width="4" stroke-linecap="round" opacity=".5"/>`;
  return h; }
function dgstairsScene(t, lt, a) {
  const ph = a.ph, s = 0.95;
  // ph0: 2→5칸 오르며 배낭이 커지고 앞으로 넘어온다. ph1: "끌고"에서 한 칸 뒤로 끌려 내려감, 다시 버팀
  let step, hop = 0, size, lean, ex, slip = 0;
  if (ph === 0) { const k = lt / 0.6, i = Math.min(4, Math.floor(k)), f = clamp(k - i, 0, 1); step = 1 + i + (i < 4 ? easeInOut(clamp((f - 0.45) / 0.55, 0, 1)) : 0); hop = i < 4 ? Math.sin(clamp((f - 0.45) / 0.55, 0, 1) * Math.PI) * 26 : 0;
    size = lerp(0.95, 1.25, dgK(0, 2.6, lt)); lean = lerp(0, 22, dgK(1.2, 2.6, lt)); ex = exprAt([[0, 'z결심'], [1.6, 'z당황']], lt); }
  else { const tP = fAt(a, '끌고', 2.4); slip = easeOutBack(dgK(tP - 0.1, tP + 0.35, lt)); step = 5 - slip; size = 1.25; lean = 22 - 6 * slip + Math.sin(t * 6) * 2 * (lt > tP ? 1 : 0); ex = lt < tP ? fEx('z당황') : fEx('z멘붕'); }
  const [fx0] = dgStepTop(Math.floor(step)), [fx1] = dgStepTop(Math.ceil(step)), fr = step - Math.floor(step);
  const x = lerp(fx0, fx1, fr), F = lerp(DG_ST.y0 - DG_ST.h * Math.floor(step), DG_ST.y0 - DG_ST.h * Math.ceil(step), fr) - hop;
  const cam = ph === 0 ? qLerpCam(lt / 2.6, [1000, 560, 1.0], [1060, 460, 1.18]) : [1080, 470, 1.2];
  const shade = clamp((lean - 8) / 14, 0, 1);
  let w = dgStairs();
  w += `<path d="M2000 -100 L1500 -100 L700 1100 L2200 1100 Z" fill="url(#dgBeam)" opacity=".7"/>`; // 출구에서 쏟아지는 햇빛
  w += qShadow(x, F, 64) + dgPackBack(x, F, s, size, { lean, items: 5 });
  w += Z({ x, y: F, s, t, pose: ph === 1 && slip > 0.2 ? dgPose('서기', { armL: [[148, 285], [100, 240], [70, 200]], hL: [66, 196], armR: [[252, 285], [300, 240], [330, 200]], hR: [334, 196] }) : '서기', ex, look: ph === 1 ? [0.6, -0.6] : [0.9, -0.4] }) + dgPackStrap(x, F, s);
  // 배낭이 가린 그림자: 배낭 아래쪽(제로 쪽)으로 어두운 쐐기
  if (shade > 0) { const [hx, hy] = ptOf(x, F, s, 200, 170); w += `<path d="M${f1(hx + 260)} ${f1(hy - 420)} L${f1(hx - 200)} ${f1(hy + 520)} L${f1(hx + 160)} ${f1(hy + 560)} L${f1(hx + 520)} ${f1(hy - 360)} Z" fill="#141022" opacity="${f1(shade * 0.42 * 100) / 100}"/>`; }
  let over = ''; if (ph === 1) { const tP = fAt(a, '끌고', 2.4); if (lt > tP) over += fx(t, t - lt + tP, t + 9, 860, 300, '주르륵', '#fff', { size: 54, rot: 10 }); }
  return dgDefs() + dgPlate('subway', cam, 0.55) + qCam(cam, w) + over;
}

/* ---------- 3. 코린토스: "비켜 주시겠소? 햇빛 가리니까" ---------- */
const DG_GROUND = 1010, DG_JAR = [470, DG_GROUND], DG_DX = 760, DG_AX = 1190, DG_AX2 = 1420;
function dgJar(x, y, s = 1, o = {}) { // 커다란 항아리(피토스). 원점 = 바닥 가운데
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><path d="M-110 0 Q-190 -130 -170 -300 Q-150 -430 -96 -470 L96 -470 Q150 -430 170 -300 Q190 -130 110 0 Z" fill="#C2703F" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>` +
    `<ellipse cx="0" cy="-470" rx="104" ry="24" fill="#8E4A26" stroke="${INK}" stroke-width="8"/><ellipse cx="0" cy="-470" rx="80" ry="14" fill="#3A2216"/>` +
    `<path d="M-176 -250 Q0 -220 176 -250" fill="none" stroke="#2B1A12" stroke-width="16"/><path d="M-176 -250 Q0 -220 176 -250" fill="none" stroke="#E0A06A" stroke-width="6" stroke-dasharray="18 14"/>` +
    `<path d="M-130 -380 Q-150 -300 -140 -200" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".25"/>${o.extra || ''}</g>`; }
function dgDog(x, y, s, t, o = {}) { const yawn = o.yawn || 0, sit = o.sit; let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * (o.flip ? -1 : 1) * 1000) / 1000} ${f1(s * 1000) / 1000})">`;
  if (sit) h += `<ellipse cx="0" cy="-60" rx="46" ry="62" fill="#E2B35C" stroke="${INK}" stroke-width="7"/><ellipse cx="-24" cy="-6" rx="20" ry="10" fill="#E2B35C" stroke="${INK}" stroke-width="6"/><ellipse cx="24" cy="-6" rx="20" ry="10" fill="#E2B35C" stroke="${INK}" stroke-width="6"/>`;
  else h += `<ellipse cx="0" cy="-34" rx="110" ry="40" fill="#E2B35C" stroke="${INK}" stroke-width="7"/><path d="M-104 -44 Q-150 -60 -160 -30" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-104 -44 Q-150 -60 -160 -30" fill="none" stroke="#E2B35C" stroke-width="5" stroke-linecap="round" transform="rotate(${f1(Math.sin(t * 5) * 8)} -104 -44)"/>`;
  const hx = sit ? 0 : 96, hy = sit ? -134 : -54;
  h += `<g transform="translate(${hx} ${hy})"><circle r="40" fill="#E2B35C" stroke="${INK}" stroke-width="7"/><path d="M-30 -30 Q-58 -24 -54 10 Q-48 26 -34 14 Q-30 -6 -24 -24 Z M30 -30 Q58 -24 54 10 Q48 26 34 14 Q30 -6 24 -24 Z" fill="#B97E3A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  h += o.eyes === 'shut' || yawn > 0.3 ? `<path d="M-20 -6 q7 6 14 0 M6 -6 q7 6 14 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` : `<circle cx="-13" cy="-6" r="5" fill="${INK}"/><circle cx="13" cy="-6" r="5" fill="${INK}"/>`;
  h += `<ellipse cx="0" cy="12" rx="18" ry="13" fill="#F4E2B8" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="6" rx="7" ry="5" fill="${INK}"/>`;
  if (yawn > 0.05) h += `<ellipse cx="0" cy="24" rx="${f1(10 + 6 * yawn)}" ry="${f1(4 + 16 * yawn)}" fill="#7A2A36" stroke="${INK}" stroke-width="4"/>`;
  return h + `</g></g>`; }
// 디오게네스: 회색 머리·수염, 낡은 갈색 외투, 맨발
const dgGreek = (c, o) => HALO(char(Object.assign({ goggles: 'none', vest: c.v, patch: false, tee: true, vshade: 'rgba(0,0,0,0.16)', toga: c.t, dress: c.d }, c.x || {}, o)));
const DG_D = { v: '#CDB892', t: '#7A5A3E', d: '#7A5A3E', x: { hair: '#A9A39A', beard: '#BDB7AC' } };
const DIO = o => HALO(char(Object.assign({ goggles: 'none', vest: DG_D.v, patch: false, tee: true, vshade: 'rgba(0,0,0,0.16)', toga: DG_D.t, dress: o.sit ? null : DG_D.d }, DG_D.x, o)));
// 알렉산더: 금빛 투구(붉은 깃털), 붉은 망토
const DG_HELM = (crest = '#C9302C') => `<path d="M80 150 Q78 40 200 30 Q322 40 320 150 L300 150 Q290 90 200 84 Q110 90 100 150 Z" fill="#E3B341" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M110 40 Q200 -60 290 40 Q240 10 200 12 Q160 10 110 40 Z" fill="${crest}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M130 22 Q200 -30 270 22" fill="none" stroke="${INK}" stroke-width="3" opacity=".4"/>`;
const ALEX = o => HALO(char(Object.assign({ goggles: 'none', vest: '#E3C26B', patch: false, tee: true, vshade: 'rgba(0,0,0,0.16)', toga: '#B33A3A', dress: '#B33A3A', hairFront: DG_HELM() }, o)));
const SOLD = (o, i) => HALO(char(Object.assign({ goggles: 'none', vest: '#B88A4A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', dress: '#7A4E2A', hairFront: DG_HELM(['#5A3A2A', '#2B2B2B', '#5A3A2A', '#2B2B2B'][i % 4]), seed: 50 + i }, o)));
const dgSpear = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><line x1="0" y1="60" x2="0" y2="-520" stroke="#6B4A2E" stroke-width="10" stroke-linecap="round"/><path d="M-14 -510 L0 -570 L14 -510 Z" fill="#C9C3B8" stroke="${INK}" stroke-width="4"/></g>`;
// 앉아 기대기(땅에): 엉덩이가 땅, 다리는 오른쪽으로 쭉, 팔은 배 위
const DG_RECL = dgPose('서기', { armL: [[148, 285], [150, 350], [190, 362]], hL: [194, 362], armR: [[252, 285], [252, 350], [212, 356]], hR: [208, 356], legL: [[188, 412], [290, 420], [390, 424]], fL: [400, 420, 70], legR: [[212, 408], [310, 412], [404, 414]], fR: [414, 408, 70], dy: 0 });
const DG_SHOO = dgPose(DG_RECL, { armR: [[252, 285], [300, 250], [344, 220]], hR: [348, 216] });
const dgRecY = s => DG_GROUND - 4 + (560 - 420) * s; // 엉덩이(local 420)가 땅에 닿는 원점 y
function dgcorScene(t, lt, a) {
  const ph = a.ph, s = 0.95, dy = dgRecY(s);
  E['_dga'] = qTalk('z결심', env(t)); E['_dgd'] = qTalk('z졸음', env(t) * 0.8); E['_dgd2'] = qTalk('z의심', env(t) * 0.8);
  // 알렉산더 위치: ph0 걸어 들어옴 → ph1~3 디오게네스 오른쪽(해를 등짐) → ph4 한 걸음 옆으로
  let ax = DG_AX, aPose = '서기', aEx = fEx('z결심'), aLook = [-0.8, 0.3];
  if (ph === 0) { const k = easeOut(dgK(0.6, 2.6, lt)); ax = lerp(2150, DG_AX, k); aPose = lt < 2.6 ? walkPose(lt * 6, 0.6) : '서기'; }
  if (ph === 1) { aEx = fEx('_dga'); const tW = fAt(a, '무엇이든', 2.8); aPose = lt > tW - 0.2 ? dgPose('서기', { armL: [[148, 285], [90, 250], [40, 230]], hL: [34, 226], armR: [[252, 285], [310, 250], [360, 230]], hR: [366, 226] }) : '서기'; }
  if (ph === 2 || ph === 3) { aEx = ph === 3 ? exprAt([[0, 'z결심'], [fAt(a, '비켜', 1.4), 'z충격']], lt) : fEx('z결심'); }
  if (ph === 4) { const k = easeInOut(dgK(0.15, 0.85, lt)); ax = lerp(DG_AX, DG_AX2, k); aPose = k > 0 && k < 1 ? walkPose(lt * 7, 0.5) : '서기'; aEx = fEx('z멍'); aLook = [-0.9, 0.2]; }
  if (ph === 5) { ax = DG_AX2; aEx = fEx('z멍'); }
  // 햇빛: 알렉산더가 앞을 막으면 그림자, 비키면(ph4 이후) 햇빛
  const block = ph === 0 ? easeInOut(dgK(1.9, 2.6, lt)) : ph <= 3 ? 1 : ph === 4 ? 1 - easeInOut(dgK(0.5, 0.95, lt)) : 0;
  // 디오게네스 표정
  let dEx = fEx('z뿌듯'), dPose = DG_RECL, dLook = [0.1, -0.6];
  if (ph === 0) dEx = exprAt([[0, 'z뿌듯'], [2.4, 'z졸음']], lt);
  if (ph === 1) dEx = fEx('z졸음');
  if (ph === 2) { dEx = exprAt([[0, 'z졸음'], [0.5, 'z의심']], lt); dLook = [0.8, -0.3]; }
  if (ph === 3) { dEx = fEx('_dgd2'); dLook = [0.8, -0.3]; const tB = fAt(a, '비켜', 1.4); if (lt > tB - 0.1 && lt < tB + 1.4) dPose = dgPose(DG_RECL, { armR: [[252, 285], [300, 250], [lerp(330, 360, (Math.sin((lt - tB) * 14) + 1) / 2), 220]], hR: [lerp(334, 364, (Math.sin((lt - tB) * 14) + 1) / 2), 216] }); }
  if (ph >= 4) { dEx = ph === 4 && lt < 0.9 ? fEx('z의심') : fEx('z뿌듯'); dLook = [0.2, -0.6]; }
  // 카메라
  const CM = { 0: qLerpCam(lt / 3.0, [1000, 600, 1.0], [980, 620, 1.05]), 1: qLerpCam(lt / 3.5, [980, 620, 1.05], [1120, 560, 1.32]), 2: [800, 760, 2.3], 3: [940, 680, 1.45], 4: qLerpCam(lt / 2.4, [960, 660, 1.3], [1000, 620, 1.08]), 5: qLerpCam(lt / 4, [880, 700, 1.35], [860, 700, 1.5]) };
  const cam = CM[ph];
  let w = dgJar(DG_JAR[0], DG_JAR[1], 1.05);
  w += qShadow(DG_DX + 90, DG_GROUND, 150, 0.5) + DIO({ x: DG_DX, y: dy, s, t, pose: dPose, ex: dEx, look: dLook, rot: -8, sit: true });
  // 지팡이(항아리에 기대어 세움)·자루
  w = `<line x1="${DG_JAR[0] - 230}" y1="${DG_GROUND}" x2="${DG_JAR[0] - 170}" y2="${DG_GROUND - 480}" stroke="#6B4A2E" stroke-width="14" stroke-linecap="round"/><path d="M${DG_JAR[0] - 330} ${DG_GROUND} q-8 -70 34 -84 q42 14 34 84 Z" fill="#A8875A" stroke="${INK}" stroke-width="6"/>` + w;
  w += dgDog(1010, DG_GROUND, 0.8, t, { yawn: ph === 4 ? Math.sin(dgK(1.0, 2.0, lt) * Math.PI) : 0, eyes: ph >= 4 ? 'shut' : null });
  // 병사 넷(따로따로 선다) + 창
  const sx0 = ph === 0 ? lerp(2400, 0, easeOut(dgK(0.9, 2.8, lt))) : 0;
  [[1560, 0.86], [1700, 0.9], [1830, 0.84], [1960, 0.88]].forEach(([x0, ss], i) => { const x = x0 + sx0, frozen = ph === 4 || ph === 5, p = ph === 0 && lt < 2.8 ? walkPose(lt * 6 + i, 0.5) : '서기';
    w += qShadow(x, DG_GROUND, 50) + SOLD({ x, y: DG_GROUND, s: ss, t, pose: p, ex: fEx(frozen ? 'z충격' : 'z기본'), look: [-0.8, 0.1] }, i) + dgSpear(x + 70 * ss, DG_GROUND - 170 * ss, ss); });
  w += qShadow(ax, DG_GROUND, 60) + ALEX({ x: ax, y: DG_GROUND, s: 1.02, t, pose: aPose, ex: aEx, look: aLook, seed: 7 });
  // 알렉산더의 그림자(해가 오른쪽 위 → 왼쪽으로 길게, 디오게네스를 덮음)
  if (block > 0.01) { const op = f1(block * 0.42 * 100) / 100; w += `<defs><radialGradient id="dgShd" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#120A24" stop-opacity="1"/><stop offset=".7" stop-color="#120A24" stop-opacity=".8"/><stop offset="1" stop-color="#120A24" stop-opacity="0"/></radialGradient></defs>` +
    `<path d="M${f1(ax + 10)} ${DG_GROUND + 6} Q${f1((ax + DG_DX) / 2)} ${DG_GROUND + 30} ${DG_DX + 40} ${DG_GROUND + 4} L${DG_DX + 40} ${DG_GROUND - 16} Q${f1((ax + DG_DX) / 2)} ${DG_GROUND - 4} ${f1(ax + 10)} ${DG_GROUND - 12} Z" fill="#120A24" opacity="${op}"/>` +
    `<ellipse cx="${DG_DX + 10}" cy="${DG_GROUND - 250}" rx="230" ry="300" fill="url(#dgShd)" opacity="${op}"/>`; }
  // 해가 드는 얼굴(가리지 않을 때)
  const [hx, hy] = ptOf(DG_DX, dy, s, 200, 170);
  w += dgSunWarm(hx, hy, 260, (1 - block) * 0.8);
  let over = `<circle cx="${DG_SUN[0]}" cy="${DG_SUN[1]}" r="300" fill="url(#dgSunG)" opacity=".9"/>`;
  if (ph === 0) over += pop(t, t - lt + 0.3, t - lt + 2.8, 330, 110, label(0, 0, '이천삼백여 년 전, 코린토스', { size: 38, bg: '#fff' }), { rot: -3 });
  if (ph === 3) { const tH = fAt(a, '햇빛', 2.6); if (lt > tH) over += fx(t, t - lt + tH, t + 9, 1500, 200, '☀', '#FFE34D', { size: 80 }); }
  if (ph === 5) { const tN = fAt(a, '디오게네스', 3.0); if (lt > tN - 0.2) over += pop(t, t - lt + tN - 0.2, t + 99, 960, 130, label(0, 0, '디오게네스 · 기원전 4세기', { size: 46, bg: YEL }), { rot: -2, bob: 3 }); }
  const fade = ph === 0 ? 1 - dgK(0, 0.5, lt) : 0;
  return dgDefs() + dgPlate('corinth', cam, 0.55) + qCam(cam, w) + over + (fade > 0 ? `<rect width="1920" height="1080" fill="#E9C98A" opacity="${f1(fade * 100) / 100}"/>` : '');
}
function dgtitleScene(t, lt, a) { return window.ftitleScene(t, lt, a); }

/* ---------- 4. 항아리가 집 ---------- */
function dgjarScene(t, lt, a) {
  const cam = qLerpCam(lt / 5, [700, 560, 1.25], [660, 580, 1.4]), jx = 660, s = 0.95;
  const pk = easeOutBack(dgK(0.4, 1.0, lt)), tJ = fAt(a, '항아리', 4.0);
  let w = `<rect x="-300" y="${DG_GROUND}" width="2600" height="400" fill="none"/>`;
  // 항아리 안의 디오게네스: 머리와 두 손만 입구 위로(항아리 앞판이 몸을 가린다)
  const rimY = DG_GROUND - 470 * 1.15, headY = rimY + 30 - 250 * pk;
  w += DIO({ x: jx, y: headY + (560 - 170) * s, s, t, pose: dgPose('서기', { armL: [[148, 285], [110, 270], [100, 300]], hL: [96, 300], armR: [[252, 285], [290, 270], [300, 300]], hR: [304, 300] }), ex: exprAt([[0, 'z기본'], [1.0, 'z빵긋']], lt), look: [0.3, 0], sit: true });
  w += dgJar(jx, DG_GROUND, 1.15);
  w += [-1, 1].map(sd => `<circle cx="${jx + sd * 100}" cy="${f1(rimY + 4)}" r="22" fill="#fff" stroke="${INK}" stroke-width="7"/>`).join(''); // 입구를 짚은 손
  w += dgDog(1060, DG_GROUND, 0.8, t, { eyes: 'shut' });
  let over = `<circle cx="${DG_SUN[0]}" cy="${DG_SUN[1]}" r="300" fill="url(#dgSunG)" opacity=".9"/>`;
  if (lt > tJ - 0.2) over += pop(t, t - lt + tJ - 0.2, t + 99, 1180, 320, label(0, 0, '집', { size: 60, bg: YEL }), { rot: -4 }) + `<path d="M1110 360 Q980 420 900 470" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M900 470 l30 -6 l-14 26 Z" fill="${INK}"/>`;
  return dgDefs() + dgPlate('corinth', cam, 0.55) + qCam(cam, w) + over;
}

/* ---------- 5. 전 재산 인벤토리 ---------- */
const DG_INV = [['외투', 'cloak'], ['지팡이', 'staff'], ['자루', 'sack'], ['컵', 'cup']];
function dgInvIcon(kind, s = 1) { let g = '';
  if (kind === 'cloak') g = `<path d="M-50 -46 Q0 -64 50 -46 L64 56 Q0 70 -64 56 Z" fill="${DG_D.t}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-20 -50 L0 10 L20 -50" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="-26" cy="20" r="5" fill="#5A3E28"/><circle cx="30" cy="34" r="6" fill="#5A3E28"/>`;
  if (kind === 'staff') g = `<line x1="-30" y1="64" x2="30" y2="-64" stroke="#6B4A2E" stroke-width="14" stroke-linecap="round"/><path d="M30 -64 q14 -6 12 10" fill="none" stroke="#6B4A2E" stroke-width="12" stroke-linecap="round"/>`;
  if (kind === 'sack') g = `<path d="M-46 60 Q-60 -10 -20 -36 L20 -36 Q60 -10 46 60 Z" fill="#A8875A" stroke="${INK}" stroke-width="6"/><path d="M-26 -40 Q0 -54 26 -40" fill="none" stroke="#5A3E28" stroke-width="8"/>`;
  if (kind === 'cup') g = `<path d="M-40 -30 L40 -30 L30 40 Q0 52 -30 40 Z" fill="#C2703F" stroke="${INK}" stroke-width="6"/><path d="M40 -10 q24 6 0 30" fill="none" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="-30" rx="40" ry="10" fill="#8E4A26" stroke="${INK}" stroke-width="5"/>`;
  return `<g transform="scale(${s})">${g}</g>`; }
function dgInvPanel(x, y, sc, n, o = {}) { // n칸까지 찼음, o.cross: 컵 칸 X
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc * 1000) / 1000})"><rect x="-470" y="-190" width="940" height="380" rx="28" fill="#2A2238" stroke="${INK}" stroke-width="8"/>${fT(-430, -128, o.title || '디오게네스의 전 재산', 44, '#FFE9A8', { anchor: 'start' })}`;
  for (let i = 0; i < 4; i++) { const cx = -330 + i * 220, cy = 50, k = clamp(n - i, 0, 1);
    h += `<rect x="${cx - 95}" y="${cy - 95}" width="190" height="190" rx="18" fill="#3E3452" stroke="#7A6C96" stroke-width="5"/>`;
    if (k > 0) h += `<g transform="translate(${cx} ${cy - 16}) scale(${f1(easeOutBack(k) * 1000) / 1000})">${dgInvIcon(DG_INV[i][1], 0.95)}</g>${fT(cx, cy + 82, DG_INV[i][0], 30, '#fff')}`;
    if (o.cross && i === 3) h += `<path d="M${cx - 80} ${cy - 80} L${cx + 80} ${cy + 80} M${cx + 80} ${cy - 80} L${cx - 80} ${cy + 80}" stroke="#E5484D" stroke-width="16" stroke-linecap="round" opacity="${f1(o.cross * 100) / 100}"/>`; }
  return h + `</g>`; }
function dginvScene(t, lt, a) {
  const keys = ['외투', '항이', '자루', '컵'], ts = keys.map((k, i) => fAt(a, k, 0.6 + i * 1.1));
  const n = ts.reduce((acc, tk, i) => acc + clamp((lt - tk + 0.1) / 0.3, 0, 1), 0);
  return dgDefs() + dgPlate('corinth', [700, 600, 1.2], 0.55) + `<rect width="1920" height="1080" fill="#140E22" opacity=".55"/>` + dgInvPanel(960, 470, 1.25, n);
}

/* ---------- 6. 샘터: 아이가 손으로 물을 마신다 → 컵을 던진다 ---------- */
function dgCup(x, y, s, rot) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000})">${dgInvIcon('cup', 0.6)}</g>`; }
function dgfountScene(t, lt, a) {
  const ph = a.ph, dx = 760, kx = 1380, F = 1010, ds = 0.95, ks = 0.7;
  E['_dgd3'] = qTalk('z빵긋', env(t) * 0.8);
  // 아이: 물받이 앞에서 두 손을 오므려 떠 마신다(손은 턱 아래까지만)
  const sip = (Math.sin(t * 2.2) + 1) / 2, kPose = dgPose('서기', { armL: [[148, 285], [170, 320], [lerp(196, 190, sip), lerp(330, 300, sip)]], hL: [lerp(196, 190, sip), lerp(330, 296, sip)], armR: [[252, 285], [230, 320], [lerp(204, 210, sip), lerp(330, 300, sip)]], hR: [lerp(204, 210, sip), lerp(330, 296, sip)] });
  const thumbs = ph === 2 && lt > 1.6;
  let w = qShadow(kx, F, 40) + dgGreek({ v: '#DCE6F2', t: '#5A8FBF', d: '#5A8FBF', x: { hair: '#4A3A2A' } }, { x: kx, y: F, s: ks, t, pose: thumbs ? dgPose('서기', { armL: [[148, 285], [100, 250], [80, 200]], hL: [76, 196] }) : kPose, ex: fEx(thumbs ? 'z빵긋' : 'z기본'), look: thumbs ? [-0.9, 0] : [0.2, 0.7], seed: 9 });
  if (!thumbs) { const [wx, wy] = ptOf(kx, F, ks, 200, lerp(318, 300, sip)); w += `<ellipse cx="${f1(wx)}" cy="${f1(wy)}" rx="16" ry="7" fill="#9ED8FF" opacity=".9"/>`; }
  // 디오게네스: 지켜보다가(ph0) → 자루에서 컵을 꺼내 던짐(ph1) → 엄지(ph2)
  let dPose = dgPose('서기', { armR: [[252, 285], [282, 340], [300, 392]], hR: [304, 396] }), dEx = exprAt([[0, 'z멍'], [1.6, 'z의심'], [2.6, 'z충격']], lt), dLook = [0.9, 0.2], cup = null;
  if (ph === 1) { const tT = fAt(a, '구먼', 2.3), wind = dgK(0, tT - 0.1, lt), rel = lt > tT;
    dEx = fEx('_dgd3'); dPose = rel ? dgPose('서기', { armR: [[252, 285], [200, 200], [140, 140]], hR: [134, 134] }) : dgPose('서기', { armR: [[252, 285], [lerp(280, 300, wind), lerp(330, 250, wind)], [lerp(300, 330, wind), lerp(380, 200, wind)]], hR: [lerp(304, 334, wind), lerp(384, 196, wind)] });
    if (!rel) { const [hx, hy] = ptOf(dx, F, ds, lerp(304, 334, wind), lerp(384, 196, wind)); cup = dgCup(hx, hy, 1, 0); }
    else { const d = lt - tT, [h0x, h0y] = ptOf(dx, F, ds, 134, 134); // 포물선 → 튐 → 굴러 멈춤
      if (d < 0.8) { const k = d / 0.8; cup = dgCup(lerp(h0x, 260, k), h0y + (-260 * k + 380 * k * k) + (F - 30 - h0y - 120) * k, 1, d * 720); }
      else { const d2 = d - 0.8, bx = 260 - 120 * (1 - Math.exp(-d2 * 2.5)), by = F - 30 - Math.abs(Math.sin(d2 * 9)) * 50 * Math.exp(-d2 * 4); cup = dgCup(bx, by, 1, 720 + d2 * 300 * Math.exp(-d2 * 2)); } } }
  if (ph === 2) { dEx = fEx('z빵긋'); dPose = lt > 1.4 ? dgPose('서기', { armR: [[252, 285], [300, 250], [320, 200]], hR: [324, 196] }) : '서기'; cup = dgCup(140, F - 30, 1, 760); }
  w += qShadow(dx, F, 60) + DIO({ x: dx, y: F, s: ds, t, pose: dPose, ex: dEx, look: dLook });
  const [sx, sy] = ptOf(dx, F, ds, 300, 392); w += ph === 0 ? `<path d="M${f1(sx - 10)} ${f1(sy)} q-8 60 30 76 q40 -10 32 -76 Z" fill="#A8875A" stroke="${INK}" stroke-width="6"/>` : `<path d="M${f1(sx - 10)} ${f1(sy + 10)} q-8 60 30 76 q40 -10 32 -76 Z" fill="#A8875A" stroke="${INK}" stroke-width="6"/>`; // 허리춤 자루
  if (thumbs || (ph === 2 && lt > 1.4)) { const [tx, ty] = ptOf(dx, F, ds, 324, 196); w += `<g transform="translate(${f1(tx)} ${f1(ty)})"><rect x="-16" y="-34" width="14" height="30" rx="7" fill="#fff" stroke="${INK}" stroke-width="5"/></g>`; }
  if (cup) w += cup;
  const cam = ph === 0 ? qLerpCam(lt / 3.2, [1150, 640, 1.15], [1060, 640, 1.2]) : ph === 1 ? [900, 620, 1.18] : [960, 640, 1.12];
  let over = `<circle cx="${DG_SUN[0]}" cy="${DG_SUN[1]}" r="300" fill="url(#dgSunG)" opacity=".9"/>`;
  if (ph >= 1) { const cr = ph === 1 ? dgK(fAt(a, '구먼', 2.3) + 0.6, fAt(a, '구먼', 2.3) + 1.0, lt) : 1; over += dgInvPanel(1640, 150, 0.36, 4, { cross: cr }); }
  return dgDefs() + dgPlate('fount', cam, 0.55) + qCam(cam, w) + over;
}

/* ---------- 7. '개'라 불린 사람, 견유학파 ---------- */
function dgdogScene(t, lt, a) {
  const ph = a.ph, dx = 900, dyS = dgRecY(0.95);
  const SIT_UP = dgPose(DG_RECL, { armL: [[148, 285], [150, 350], [190, 362]], hL: [194, 362] });
  let w = '';
  // 지나가는 사람 셋: 따로따로, 손가락질
  [[260, '#DCE6F2', '#3E5C84', 0], [430, '#F2E2D0', '#B5523A', 1], [1500, '#E4E9EF', '#5C6B82', 2]].forEach(([x, v, c, i]) => { const point = dgPose('서기', { armR: [[252, 285], [300, 260], [350, 250]], hR: [356, 248] }), pointL = dgPose('서기', { armL: [[148, 285], [100, 260], [50, 250]], hL: [44, 248] });
    w += qShadow(x, DG_GROUND, 50) + dgGreek({ v, t: c, d: c, x: { hair: ['#2B2B2B', '#6B4A2E', '#8A8A8A'][i], beard: i === 1 ? '#6B4A2E' : null } }, { x, y: DG_GROUND, s: 0.85, t, pose: x < dx ? point : pointL, ex: fEx(ph === 1 ? 'z버럭' : 'z의심'), look: [x < dx ? 0.8 : -0.8, 0], seed: 20 + i }); });
  // 디오게네스와 개: ph2부터 똑같은 자세(턱을 들고 눈 감고 햇볕)
  const same = ph >= 2;
  w += qShadow(dx + 90, DG_GROUND, 150, 0.5) + DIO({ x: dx, y: dyS, s: 0.95, t, pose: SIT_UP, ex: fEx(same ? 'z뿌듯' : 'z졸음'), look: same ? [0, -0.9] : [0.2, -0.3], rot: same ? -4 : -8, sit: true });
  w += dgDog(1220, DG_GROUND, 0.85, t, { sit: same, eyes: same ? 'shut' : null });
  const [hx, hy] = ptOf(dx, dyS, 0.95, 200, 170); w += dgSunWarm(hx, hy, 240, 0.7) + dgSunWarm(1220, DG_GROUND - 130, 140, same ? 0.7 : 0.3);
  const cam = ph === 1 ? [880, 620, 1.05] : qLerpCam(lt / 5, [1000, 680, 1.3], [1040, 660, 1.45]);
  let over = `<circle cx="${DG_SUN[0]}" cy="${DG_SUN[1]}" r="300" fill="url(#dgSunG)" opacity=".9"/>`;
  if (ph === 1) { const tD = fAt(a, '개', 1.2); if (lt > tD - 0.2) over += pop(t, t - lt + tD - 0.2, t + 9, 420, 250, `<g><rect x="-200" y="-50" width="400" height="100" rx="40" fill="#fff" stroke="${INK}" stroke-width="7"/>${fT(0, 14, '개 같은 영감!', 40, INK)}</g>`, { rot: -4 }); }
  if (ph >= 2) { const tK = ph === 2 ? fAt(a, '견유', 4.6) : -1; if (lt > tK - 0.2) over += pop(t, t - lt + tK - 0.2, t + 99, 960, 140, label(0, 0, '견유학파 = 개 같은 사람들', { size: 46, bg: YEL }), { rot: -2, bob: 3 }); }
  return dgDefs() + dgPlate('street', cam, 0.55) + qCam(cam, w) + over;
}
