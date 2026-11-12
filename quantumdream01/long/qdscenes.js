/* 원자 꿈 편 — 샘플(대본_v1 1~22번). 새 이름은 모두 qd 접두사.
   물리 규칙: 잠든 제로는 베개 위에 머리, 이불이 허리 위를 덮는다 · 상자는 두 손 사이에 · 원자들은 서로 닿기 직전에 튕긴다(겹치지 않는다) · 원인 다음 결과. */
Object.assign(QBG, { bedn: 'ai/bedn.png', vessel: 'ai/vessel.png', stadium: 'ai/stadium.png' });
['qdroom', 'qdsuck', 'qdtunnel', 'qdcard', 'qdvessel', 'qdbody', 'qdatom', 'qdstadium', 'qdmemory', 'qddiagram'].forEach(k => CAMS[k] = 'fixed');
const QD_PJ = '#9DB8E8', QD_RED = '#E5484D', QD_RED_D = '#B8323A', QD_CY = '#8FDBFF', QD_GOLD = '#FFD23F';
const QZ = o => Z(Object.assign({ vest: QD_PJ, vshade: 'rgba(20,30,80,0.18)' }, o));      // 잠옷 제로
const QZday = o => Z(Object.assign({}, o));                                               // 평소 제로(주황 티)
const TH = o => HALO(char(Object.assign({ goggles: 'none', vest: '#3A3F4B', patch: false, tee: true, vshade: 'rgba(0,0,0,0.25)', topknot: false, robe: false }, o))); // 태호(검은 점퍼)
const qdK = (t0, t1, x) => clamp((x - t0) / (t1 - t0), 0, 1);
const qdDefs = () => `<defs>
<radialGradient id="qdGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${QD_CY}" stop-opacity=".9"/><stop offset=".55" stop-color="#5FB6F0" stop-opacity=".35"/><stop offset="1" stop-color="#5FB6F0" stop-opacity="0"/></radialGradient>
<radialGradient id="qdCloud" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#E8F7FF" stop-opacity=".55"/><stop offset=".6" stop-color="#8FC8FF" stop-opacity=".28"/><stop offset="1" stop-color="#8FC8FF" stop-opacity="0"/></radialGradient>
<radialGradient id="qdCloud2" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF0E0" stop-opacity=".5"/><stop offset=".6" stop-color="#FFB98F" stop-opacity=".25"/><stop offset="1" stop-color="#FFB98F" stop-opacity="0"/></radialGradient>
<radialGradient id="qdVoid" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#101A3A"/><stop offset="1" stop-color="#03050F"/></radialGradient>
<radialGradient id="qdWarm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE3B0" stop-opacity=".7"/><stop offset="1" stop-color="#FFE3B0" stop-opacity="0"/></radialGradient>
<linearGradient id="qdDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2A86B"/><stop offset="1" stop-color="#FFE1B5"/></linearGradient>
<radialGradient id="qdNuc" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#FFFBE0"/><stop offset="1" stop-color="#FFC94A"/></radialGradient>
</defs>`;
// 배경 판 + 판에 붙은 소품(같은 시차)
const qdPlate = (k, cam, depth = 0.6, extra = '') => {
  const [cx, cy, z] = cam, zb = 1 + (z - 1) * depth; let bx = 960 + (cx - 960) * depth, by = 560 + (cy - 560) * depth;
  const hx = 960 / 0.88 / zb; bx = clamp(bx, -150 + hx + 4, 2070 - hx - 4); by = clamp(by, -30 + 573.6 / zb + 4, 1220 - 653.6 / zb - 4);
  return `<g transform="translate(960 560) scale(${f1(zb * 1000) / 1000}) translate(${f1(-bx)} ${f1(-by)})"><image href="${QBG[k]}" x="-150" y="-30" width="2220" height="1250" preserveAspectRatio="xMidYMid slice"/>${extra}</g>`;
};
// 우주 배경(별은 카메라보다 느리게)
function qdSpace(t, cam, o = {}) {
  let h = `<rect x="-4000" y="-3000" width="10000" height="7000" fill="#03050F"/><circle cx="960" cy="540" r="4200" fill="url(#qdVoid)"/>`;
  const [cx, cy] = cam, dep = 0.25;
  for (let i = 0; i < 170; i++) { const x = (hash(i * 3.7) * 6800 - 2400) + (cx - 960) * dep, y = (hash(i * 9.1) * 4600 - 1800) + (cy - 540) * dep, r = 1 + hash(i * 1.3) * 2.6;
    h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#DDEBFF" opacity="${f1((0.25 + 0.55 * Math.abs(Math.sin(t * (0.6 + hash(i)) + i))) * (o.dim == null ? 1 : o.dim) * 100) / 100}"/>`; }
  return h;
}
// 전자 구름으로 감싼 원자. 원점 = 원자 중심. who = 안에 그릴 것(제로 등)
function qdAtom(x, y, R, t, inner = '', o = {}) {
  const jit = o.jit || 0, sx = 1 + (o.squash || 0), sy = 1 - (o.squash || 0) * 0.6;
  let h = `<g transform="translate(${f1(x + Math.sin(t * 70) * jit)} ${f1(y)}) scale(${f1(sx * 1000) / 1000} ${f1(sy * 1000) / 1000})">`;
  h += `<circle r="${f1(R * 1.25)}" fill="url(#${o.warm ? 'qdCloud2' : 'qdCloud'})"/>`;
  for (let i = 0; i < 22; i++) { const a = hash(i * 4.1 + (o.seed || 0)) * Math.PI * 2 + t * (0.4 + hash(i) * 0.8) * (i % 2 ? 1 : -1), r = R * (0.35 + 0.6 * hash(i * 2.3 + (o.seed || 0)));
    h += `<circle cx="${f1(Math.cos(a) * r)}" cy="${f1(Math.sin(a) * r * 0.9)}" r="${f1(2 + hash(i * 5.5) * 3)}" fill="#fff" opacity="${f1((0.35 + 0.5 * Math.abs(Math.sin(t * 3 + i))) * 100) / 100}"/>`; }
  h += `<circle r="${f1(R)}" fill="none" stroke="${o.warm ? '#FFCDA8' : '#BFE3FF'}" stroke-width="3" stroke-dasharray="4 14" opacity=".55"/>`;
  return h + inner + `</g>`;
}
// 화면 위 짧은 효과 글자(장면 공용)
const qdFx = (t, lt, t0, t1, x, y, s, c, o = {}) => lt > t0 && lt < t1 ? fx(t, t - lt + t0, t - lt + t1, x, y, s, c, Object.assign({ size: 60, rot: -6 }, o)) : '';

/* ---------- 1. 제로 방, 새벽 1:20 (침대) ---------- */
const QR = { x: 960, pil: 640, body: 1040 }; // 베개 위치, 몸 원점 y
function qdBed(t, lt, a, k) { // k: 0 자는 중, 1 = 몸이 빨려 들어가 사라짐
  const sleep = a.ph >= 1 || a._suck, ph = a.ph;
  let w = `<rect x="600" y="430" width="720" height="320" rx="44" fill="#4A5784" stroke="${INK}" stroke-width="9"/><rect x="630" y="458" width="660" height="40" rx="16" fill="#5C6A9A"/>`;
  w += `<ellipse cx="${QR.x}" cy="${QR.pil}" rx="230" ry="70" fill="#E9EEF7" stroke="${INK}" stroke-width="8"/>`;
  // 숨쉬기
  const br = 1 + 0.018 * Math.sin(t * 2.2);
  const ex = ph === 0 ? exprAt([[0, 'z졸음'], [1.6, 'z하품'], [2.3, 'z졸음']], lt) : fEx('z졸음');
  const eyesShut = sleep ? { expr: 'z졸음', prev: 'z졸음', k: 1, blink: ph === 1 ? clamp(lt / 0.8, 0, 1) : 1 } : ex;
  if (k < 1) {
    const sc = 1 - k * 0.85, rot = k * 260, dx = k * 120, dy = -k * 60;
    let body = QZ({ x: QR.x, y: QR.body, s: 0.95, t, pose: '서기', ex: eyesShut, look: sleep ? [0, 0] : [0.5, -0.2], tilt: sleep ? 9 : 4, seed: 3, still: !!sleep });
    w += `<g transform="translate(${QR.x + dx} ${720 + dy}) rotate(${f1(rot)}) scale(${f1(sc * 1000) / 1000} ${f1(sc * br * 1000) / 1000}) translate(${-QR.x} -720)">${body}</g>`;
  }
  // 이불(빨려 들어가면 납작해진다)
  const flat = k * 40;
  w += `<path d="M560 ${f1(770 + flat)} Q${QR.x} ${f1(712 + flat)} 1360 ${f1(770 + flat)} L1390 1130 L530 1130 Z" fill="#7F96CF" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M610 ${f1(812 + flat)} Q${QR.x} ${f1(772 + flat)} 1310 ${f1(812 + flat)}" fill="none" stroke="#fff" stroke-width="8" opacity=".3"/>`;
  // 폰: 손에 쥐고 뒷면만 보인다 → 잠들며 이불 위로 미끄러짐
  const drop = ph === 0 ? 0 : ph === 1 ? easeInOut(qdK(0.6, 1.6, lt)) : 1;
  const px = lerp(1110, 1150, drop), py = lerp(700, 775, drop), pr = lerp(-18, -78, drop);
  if (k < 0.15 || !a._suck) {
    w += `<g transform="translate(${f1(px)} ${f1(py)}) rotate(${f1(pr)})"><rect x="-34" y="-62" width="68" height="124" rx="14" fill="#1F2D44" stroke="${INK}" stroke-width="6"/><circle cx="-14" cy="-40" r="7" fill="#3B4A66" stroke="${INK}" stroke-width="3"/></g>`;
    if (drop < 0.5) w += hand(px - 18, py + 40, 0.75) + hand(px + 22, py + 40, 0.75);
  }
  return { w, px, py, drop };
}
function qdroomScene(t, lt, a) {
  const ph = a.ph;
  const cam = ph === 0 ? qLerpCam(lt / 3, [1000, 640, 1.18], [1010, 650, 1.32]) : ph === 1 ? qLerpCam(lt / 2, [1010, 650, 1.32], [1000, 660, 1.4]) : qLerpCam(lt / 6, [960, 620, 1.28], [1020, 670, 1.55]);
  const { w, px, py, drop } = qdBed(t, lt, a, 0);
  // 화면 불빛: 얼굴과 벽에 푸른빛(폰이 떨어질수록 천장 쪽으로)
  const gl = 0.75 + 0.15 * Math.sin(t * 5.3) * Math.sin(t * 2.1);
  let light = `<circle cx="${f1(px - 60)}" cy="${f1(py - 40)}" r="${f1(lerp(320, 420, drop))}" fill="url(#screenGlow)" opacity="${f1(gl * 100) / 100}"/>`;
  let over = '';
  if (ph === 2) for (let i = 0; i < 3; i++) { const k = (lt * 0.7 + i / 3) % 1; over += `<g opacity="${f1(Math.sin(k * Math.PI) * 100) / 100}">${fT(820 - k * 60, 470 - k * 150, 'z', 40 + i * 8, '#fff', { stroke: INK, sw: 6 })}</g>`; }
  if (ph === 0) over += pop(t, t - lt + 0.2, t + 99, 300, 150, label(0, 0, '새벽 1:20', { size: 46, bg: '#BFE6FF' }), { rot: -4, bob: 2 });
  if (ph >= 1) over += pop(t, t - lt - 9, t + 99, 300, 150, label(0, 0, '새벽 1:20', { size: 46, bg: '#BFE6FF' }), { rot: -4, bob: 2 });
  return qdDefs() + qdPlate('bedn', cam, 0.6) + qCam(cam, w + over) + fFull('#0A1238', 0.28) + qCam(cam, light);
}
/* ---------- 2. 빛에 빨려 들어감 ---------- */
function qdsuckScene(t, lt, a) {
  const cam = qLerpCam(lt / 2.4, [1000, 660, 1.4], [1120, 720, 1.7]);
  const g = easeIn(qdK(0.1, 1.5, lt)), k = easeInOut(qdK(1.0, 1.9, lt)), white = qdK(1.9, 2.5, lt);
  const { w, px, py } = qdBed(t, lt, Object.assign({}, a, { ph: 2, _suck: true }), k);
  const R = lerp(60, 1400, g);
  let h = qdDefs() + qdPlate('bedn', cam, 0.6) + qCam(cam, w) + fFull('#0A1238', 0.28);
  // 폰 가장자리에서 번지는 빛 + 소용돌이 줄
  let v = `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(R)}" fill="url(#qdGlow)"/>`;
  for (let i = 0; i < 10; i++) { const an = i / 10 * Math.PI * 2 + lt * (2 + g * 6), r0 = R * 0.15, r1 = R * 0.55;
    v += `<path d="M${f1(px + Math.cos(an) * r1)} ${f1(py + Math.sin(an) * r1)} Q${f1(px + Math.cos(an + 0.8) * r1 * 0.6)} ${f1(py + Math.sin(an + 0.8) * r1 * 0.6)} ${f1(px + Math.cos(an + 1.4) * r0)} ${f1(py + Math.sin(an + 1.4) * r0)}" fill="none" stroke="#E6F7FF" stroke-width="6" stroke-linecap="round" opacity="${f1(g * 0.8 * 100) / 100}"/>`; }
  h += qCam(cam, v);
  h += qdFx(t, lt, 0.9, 2.2, 1300, 260, '슈우웅—', '#BFE6FF', { size: 72 });
  h += `<rect x="-100" y="-100" width="2200" height="1400" fill="#E6F7FF" opacity="${f1(white * 100) / 100}"/>`;
  return h;
}
/* ---------- 3. 빛의 터널 ---------- */
function qdtunnelScene(t, lt, a) {
  const D = a._dur || 6, cx = 960, cy = 500;
  let h = `<rect x="-100" y="-100" width="2200" height="1400" fill="#071433"/>`;
  for (let i = 0; i < 14; i++) { const k = ((lt * 0.55 + i / 14) % 1), r = 40 + k * k * 1500;
    h += `<ellipse cx="${cx}" cy="${cy}" rx="${f1(r * 1.25)}" ry="${f1(r)}" fill="none" stroke="${i % 3 ? '#4FA8E8' : '#BFE6FF'}" stroke-width="${f1(3 + k * 16)}" opacity="${f1((1 - k) * 0.9 * 100) / 100}"/>`; }
  for (let i = 0; i < 40; i++) { const an = hash(i * 2.9) * Math.PI * 2, k = ((lt * 0.9 + hash(i * 6.1)) % 1), r0 = 60 + k * k * 1100;
    h += `<line x1="${f1(cx + Math.cos(an) * r0)}" y1="${f1(cy + Math.sin(an) * r0 * 0.8)}" x2="${f1(cx + Math.cos(an) * (r0 + 40 + k * 160))}" y2="${f1(cy + Math.sin(an) * (r0 + 40 + k * 160) * 0.8)}" stroke="#fff" stroke-width="${f1(2 + k * 5)}" stroke-linecap="round" opacity="${f1(k * 0.8 * 100) / 100}"/>`; }
  h += `<circle cx="${cx}" cy="${cy}" r="${f1(140 + 20 * Math.sin(t * 4))}" fill="url(#qdGlow)"/>`;
  // 빙글빙글 떨어지며 작아지는 제로
  const tP = fAt(a, '일부가', D * 0.7), sc = lerp(0.95, 0.38, easeInOut(qdK(0, D, lt))), rot = Math.sin(lt * 1.6) * 30 + lt * 40;
  const ex = exprAt([[0, 'z충격'], [1.4, 'z당황'], [tP, 'z반짝']], lt);
  const zx = cx + Math.sin(lt * 1.3) * 60, zy = cy + 120 + Math.cos(lt * 1.1) * 30;
  h += `<g transform="translate(${f1(zx)} ${f1(zy)}) rotate(${f1(rot)})">${QZ({ x: 0, y: 200 * sc, s: sc, t, pose: lt < tP ? '허우적' : '둥둥', ex, look: [0, -0.3], seed: 3 })}</g>`;
  const fl = lt > tP ? Math.exp(-(lt - tP) * 3) : 0;
  h += `<rect x="-100" y="-100" width="2200" height="1400" fill="#fff" opacity="${f1(Math.max(fl * 0.6, 1 - qdK(0, 0.4, lt)) * 100) / 100}"/>`;
  return qdDefs() + h;
}
/* ---------- 단계 카드 ---------- */
function qdcardScene(t, lt, a) {
  const n = a.n || 1, k = easeInOut(qdK(0.5, 1.8, lt));
  let h = n === 1 ? `<rect x="-100" y="-100" width="2200" height="1400" fill="#3A0E16"/>` : `<rect x="-100" y="-100" width="2200" height="1400" fill="#050816"/>`;
  h += `<circle cx="960" cy="520" r="520" fill="${n === 1 ? 'url(#redglow)' : 'url(#qdGlow)'}" opacity=".5"/>`;
  // 줄어드는 그림: 1단계 사람 → 점, 2단계 적혈구 → 점
  const sc = lerp(1, 0.03, k);
  if (n === 1) h += `<g transform="translate(1380 660) scale(${f1(sc * 1000) / 1000})">${QZ({ x: 0, y: 260, s: 0.75, t, pose: '서기', ex: fEx('z당황'), seed: 3 })}</g>`;
  else h += `<g transform="translate(1380 560) scale(${f1(sc * 1000) / 1000})"><ellipse rx="170" ry="60" fill="${QD_RED}" stroke="${INK}" stroke-width="10"/><ellipse rx="80" ry="24" fill="${QD_RED_D}"/></g>`;
  if (k > 0.97) h += `<circle cx="1380" cy="${n === 1 ? 600 : 560}" r="${f1(6 + 3 * Math.sin(t * 8))}" fill="#fff"/>`;
  h += pop(t, t - lt + 0.1, t + 99, 640, 430, outlined(0, 0, [n === 1 ? '1단계' : '2단계'], { size: 120, sw: 22, fill: n === 1 ? '#FFB3B8' : '#BFE6FF' }), { rot: -3 });
  h += pop(t, t - lt + 0.45, t + 99, 640, 590, outlined(0, 0, [n === 1 ? '20만 배 작아짐' : '10만 배 더 작아짐'], { size: 64, sw: 13 }), { rot: -2 });
  h += pop(t, t - lt + 0.8, t + 99, 640, 700, label(0, 0, n === 1 ? '적혈구 크기' : '원자 크기', { size: 40, bg: YEL }), { rot: 3 });
  return qdDefs() + h;
}

/* ---------- 4. 혈관 고속도로: 적혈구 제로 ---------- */
// 적혈구 링(허리) + 산소 상자(두 손 사이). 원점 = 제로 발
function qdRbcZero(x, y, s, t, o) {
  const pose = o.pose || P['들기'], p = typeof pose === 'string' ? P[pose] : pose, carryBox = o.box !== false;
  let h = '';
  const [rx, ry] = ptOf(x, y, s, 200, 372 + (p.dy || 0));
  const ring = `<g transform="translate(${f1(rx)} ${f1(ry)})"><ellipse rx="${f1(185 * s)}" ry="${f1(70 * s)}" fill="${QD_RED}" stroke="${INK}" stroke-width="${f1(8 * s)}"/><ellipse cy="${f1(-6 * s)}" rx="${f1(92 * s)}" ry="${f1(28 * s)}" fill="${QD_RED_D}"/><path d="M${f1(-150 * s)} ${f1(-18 * s)} Q${f1(-120 * s)} ${f1(-48 * s)} ${f1(-60 * s)} ${f1(-54 * s)}" fill="none" stroke="#fff" stroke-width="${f1(7 * s)}" stroke-linecap="round" opacity=".5"/></g>`;
  // 링 뒤쪽 반 → 몸 → 링 앞쪽 반 (허리에 낀 튜브처럼)
  h += `<g clip-path="url(#qdTop${o.id || 'a'})">${ring}</g>`;
  h += `<clipPath id="qdTop${o.id || 'a'}"><rect x="${f1(rx - 300 * s)}" y="${f1(ry - 120 * s)}" width="${f1(600 * s)}" height="${f1(116 * s)}"/></clipPath>`;
  h += QZ(Object.assign({ x, y, s, t, pose, seed: 3 }, o.z || {}));
  h += `<clipPath id="qdBot${o.id || 'a'}"><rect x="${f1(rx - 300 * s)}" y="${f1(ry - 4 * s)}" width="${f1(600 * s)}" height="${f1(130 * s)}"/></clipPath><g clip-path="url(#qdBot${o.id || 'a'})">${ring}</g>`;
  if (carryBox) { const bp = o.boxPose || p, [hx1, hy1] = ptOf(x, y, s, bp.hL[0], bp.hL[1] + (p.dy || 0)), [hx2, hy2] = ptOf(x, y, s, bp.hR[0], bp.hR[1] + (p.dy || 0)), bx = (hx1 + hx2) / 2, by = (hy1 + hy2) / 2 + (o.lag || 0);
    h += `<g transform="translate(${f1(bx)} ${f1(by + 14 * s)})"><rect x="${f1(-62 * s)}" y="${f1(-52 * s)}" width="${f1(124 * s)}" height="${f1(96 * s)}" rx="${f1(8 * s)}" fill="#E7B877" stroke="${INK}" stroke-width="${f1(7 * s)}"/><line x1="${f1(-62 * s)}" y1="${f1(-20 * s)}" x2="${f1(62 * s)}" y2="${f1(-20 * s)}" stroke="#B88A4C" stroke-width="${f1(6 * s)}"/>${fT(0, 30 * s, 'O₂', 38 * s, '#3E6FB8')}</g>`; }
  return h;
}
// 다른 적혈구들: 얼굴 점 두 개 + 상자, 왼→오 흐름
function qdRbc(x, y, s, t, seed, box = true) {
  const wob = Math.sin(t * 6 + seed) * 4;
  let h = `<g transform="translate(${f1(x)} ${f1(y + wob)}) scale(${f1(s * 1000) / 1000})"><ellipse rx="120" ry="46" fill="${QD_RED}" stroke="${INK}" stroke-width="8"/><ellipse cy="-4" rx="58" ry="18" fill="${QD_RED_D}"/>`;
  h += `<circle cx="40" cy="-8" r="6" fill="${INK}"/><circle cx="66" cy="-8" r="6" fill="${INK}"/>`;
  if (box) h += `<g transform="translate(-10 -58)"><rect x="-40" y="-30" width="80" height="58" rx="6" fill="#E7B877" stroke="${INK}" stroke-width="6"/><line x1="-40" y1="-10" x2="40" y2="-10" stroke="#B88A4C" stroke-width="5"/></g>`;
  return h + `</g>`;
}
function qdFlow(t, n, y0, y1, speed, sMin, sMax, seed, o = {}) {
  let h = '';
  for (let i = 0; i < n; i++) { const span = 2900, ph = (t * speed * (0.7 + hash(seed + i) * 0.6) + hash(seed + i * 3) * span) % span, x = -500 + ph, y = y0 + hash(seed + i * 7) * (y1 - y0), s = sMin + hash(seed + i * 5) * (sMax - sMin);
    if (o.skip && Math.abs(x - o.skip[0]) < 260 && Math.abs(y - o.skip[1]) < 200) continue;
    h += qdRbc(x, y, s, t, i + seed); }
  return h;
}
function qdvesselScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 3, s = 0.9, zx = 960, zy = 900;
  E['_qdz'] = qTalk('z당황', env(t)); E['_qdz2'] = qTalk('z멍', env(t) * 0.7); E['_qdz3'] = qTalk('z민망', env(t) * 0.8);
  const CAMV = { 0: qLerpCam(lt / 2, [960, 680, 1.35], [960, 700, 1.45]), 1: qLerpCam(lt / D, [960, 600, 1.0], [960, 600, 1.08]), 2: qLerpCam(lt / D, [960, 680, 1.2], [960, 700, 1.38]),
    3: qLerpCam(lt / D, [980, 620, 1.3], [980, 560, 1.18]), 4: [960, 700, 1.45], 5: qLerpCam(lt / 2.6, [960, 620, 1.1], [960, 610, 1.0]) };
  const cam = CAMV[ph];
  // 달리기 속도: ph0·1 빠름, ph2 점점 멈춤, ph3·4 멈춤(숨 고르기), ph5 서서 본다
  const run = ph <= 1 ? 1 : ph === 2 ? 1 - easeInOut(qdK(0.2, D * 0.8, lt)) : 0;
  const phase = t * 11 * Math.max(0.15, run), amp = 0.9 * run;
  let pose = run > 0.05 ? carry(zx, zy, s, phase, amp) : P['들기'], ex = fEx('z기본'), look = [0.8, 0], tilt = run * 6, lag = run * Math.sin(phase * 2) * 8;
  if (ph === 0) { ex = fEx('_qdz'); look = [0.3, -0.1]; }
  if (ph === 1) ex = fEx('z결심');
  if (ph === 2) ex = exprAt([[0, 'z기본'], [D * 0.6, 'z멍']], lt);
  if (ph === 3) { ex = fEx('_qdz2'); look = [0, -1]; tilt = -4; }
  let wipe = 0;
  if (ph === 4) { const tW = fAt(a, '회사', D * 0.55); ex = lt < tW - 0.2 ? fEx('_qdz2') : fEx('_qdz3'); look = [0.3, 0.3];
    wipe = qdK(0.0, 0.4, lt) * (1 - qdK(1.2, 1.6, lt));
    if (wipe > 0) pose = Object.assign({}, P['들기'], { armR: [[252, 285], [300, 220], [236, 168]], hR: [230, 160] }); }
  if (ph === 5) { ex = fEx('z멍'); look = [-0.7, 0.1]; }
  // 흐름: 배경 판은 느리게, 적혈구들은 빠르게 스쳐 간다
  const flowT = ph >= 3 ? t * 0.55 : t;
  let back = qdFlow(flowT, 8, 560, 760, ph >= 2 ? 260 : 420, 0.35, 0.55, 11);
  let front = qdFlow(flowT, 4, 980, 1080, ph >= 2 ? 360 : 640, 0.9, 1.1, 37, { skip: [zx, zy] });
  let w = back;
  if (ph === 3) { const k = qdK(0.2, 1.4, lt); w += `<g opacity="${f1(0.28 * k * 100) / 100}" filter="url(#sil)">${QZday({ x: 960, y: 1300, s: 2.6, t, pose: '서기', ex: fEx('z기본'), seed: 9, still: true })}</g>`; }
  w += qShadow(zx, zy, 140, 0.5) + qdRbcZero(zx, zy, s, t, { pose, z: { ex, look, tilt }, lag, id: 'v' + ph, boxPose: wipe > 0 ? P['들기'] : null });
  // 땀방울·숨
  if (ph <= 1 || ph === 3) for (let i = 0; i < 2; i++) { const k = ((t * 1.4 + i * 0.5) % 1); w += `<path d="M${f1(zx + 90 + i * 30)} ${f1(zy - 470 + k * 60)} q10 14 0 22 q-10 -8 0 -22Z" fill="#9ED8FF" stroke="${INK}" stroke-width="3" opacity="${f1((1 - k) * 100) / 100}"/>`; }
  w += front;
  if (ph <= 1) w += speedLines(zx, zy - 250, 520, 900, 18, t, '#FFD6D6', 0.35);
  let over = '';
  if (ph === 0) over += qdFx(t, lt, 0.05, 1.6, 1380, 260, '헉헉', '#FFD6D6', { size: 64 });
  if (ph === 1) { const tB = fAt(a, '배달부', D * 0.7); if (lt > tB - 0.2) over += pop(t, t - lt + tB - 0.2, t + 99, 1460, 230, label(0, 0, '적혈구 = 산소 배달부', { size: 44, bg: YEL }), { rot: -3, bob: 3 }); }
  if (ph === 3) { const tQ = fAt(a, '웃고', 1.6); if (lt > tQ) over += qdFx(t, lt, tQ, tQ + 2.4, 1380, 300, '?', '#fff', { size: 90, rot: 8 }); }
  if (ph === 4 && wipe > 0.5) over += qdFx(t, lt, 0.3, 1.4, 1250, 330, '휴…', '#fff', { size: 56 });
  return qdDefs() + qdPlate('vessel', cam, ph >= 3 ? 0.35 : 0.5, '') + qCam(cam, w) + fFull('#4A0A14', 0.08) + over;
}
/* ---------- 5. 몸 지도: 37조 개, 1초도 쉬지 않고 ---------- */
function qdbodyScene(t, lt, a) {
  const D = a._dur || 9, t37 = fAt(a, '37조', 2.2), t1 = fAt(a, '1초도', D * 0.7);
  let h = `<rect x="-100" y="-100" width="2200" height="1400" fill="#2A0C14"/><circle cx="760" cy="520" r="620" fill="url(#redglow)" opacity=".55"/>`;
  // 사람 실루엣(밝은 윤곽) + 순환 고리
  h += `<g opacity=".95">${QZday({ x: 760, y: 1000, s: 1.45, t, pose: '서기', ex: fEx('z기본'), seed: 4, still: true, vest: '#5A2230' })}</g>`;
  const loop = 'M760 470 C 900 470 980 560 940 700 C 900 860 820 940 760 940 C 700 940 620 860 580 700 C 540 560 620 470 760 470 Z';
  h += `<path d="${loop}" fill="none" stroke="${QD_RED}" stroke-width="16" opacity=".55"/><path d="${loop}" fill="none" stroke="#FFB3B8" stroke-width="6" stroke-dasharray="18 26" stroke-dashoffset="${f1(-lt * 260)}"/>`;
  h += `<g transform="translate(760 560) scale(${f1((1 + 0.12 * Math.max(0, Math.sin(t * 7.5))) * 1000) / 1000})"><path d="M0 22 C -50 -10 -40 -48 -14 -48 C 0 -48 0 -36 0 -30 C 0 -36 0 -48 14 -48 C 40 -48 50 -10 0 22 Z" fill="${QD_RED}" stroke="${INK}" stroke-width="6"/></g>`;
  for (let i = 0; i < 14; i++) { const k = ((lt * 0.22 + i / 14) % 1), p = qdLoopPt(k); h += qdRbc(p[0], p[1], 0.16, t, i, false); }
  let over = '';
  if (lt > t37 - 0.2) { const n = Math.round(37 * easeOut(qdK(t37 - 0.2, t37 + 0.9, lt))); over += pop(t, t - lt + t37 - 0.2, t + 99, 1420, 360, outlined(0, 0, [`세포 약 ${n}조 개`], { size: 84, sw: 16, fill: '#FFE27A' }), { rot: -3 }); }
  if (lt > t1 - 0.2) over += pop(t, t - lt + t1 - 0.2, t + 99, 1420, 560, `<g><circle r="90" fill="#fff" stroke="${INK}" stroke-width="8"/><line x1="0" y1="0" x2="0" y2="-66" stroke="${QD_RED}" stroke-width="7" stroke-linecap="round" transform="rotate(${f1(lt * 720)})"/><circle r="8" fill="${INK}"/></g>` + outlined(0, 170, ['쉬는 시간 0초'], { size: 50, sw: 11 }), { rot: 3 });
  return qdDefs() + qCam(qLerpCam(lt / D, [900, 560, 1.02], [960, 540, 1.08]), h + over);
}
function qdLoopPt(k) { // 몸 지도 순환 고리 위의 점(대략적인 원)
  const an = k * Math.PI * 2 - Math.PI / 2; return [760 + Math.cos(an) * 180, 705 + Math.sin(an) * 235];
}

/* ---------- 6. 원자의 우주 ---------- */
function qdatomScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 3;
  E['_qda'] = qTalk('z당황', env(t));
  const zs = 0.42, R = 230;
  let zx = 900, zy = 560, ex = fEx('z멍'), look = [0, 0], pose = '둥둥', squash = 0, jit = 0, other = null, sx = 1, sy = 1;
  const bob = Math.sin(t * 1.4) * 10;
  if (ph === 0) { ex = exprAt([[0, 'z당황'], [1.2, 'z멍'], [2.4, 'z반짝']], lt); look = [Math.sin(lt * 1.3), -0.2]; }
  if (ph === 1) { // 다가오는 원자 → 팔 벌림 → 닿기 직전 튕김
    const tC = 1.55, k = easeInOut(qdK(0, tC, lt)), ox = lerp(1900, 900 + 2 * R + 6, k);
    const back = lt > tC ? easeOut(qdK(tC, tC + 0.7, lt)) : 0;
    zx = 900 - back * 330; other = [ox + back * 140, 560];
    pose = lt < 0.6 ? '둥둥' : lt < tC ? '만세' : '허우적'; ex = lt < 0.5 ? fEx('z멍') : lt < tC ? fEx('z빵긋') : fEx('z충격'); look = [1, 0];
    jit = lt > tC - 0.15 && lt < tC + 0.25 ? 4 : 0; squash = lt > tC && lt < tC + 0.35 ? 0.12 * Math.sin((lt - tC) / 0.35 * Math.PI) : 0;
  }
  if (ph === 2) { zx = 570; other = [1310, 560]; ex = fEx('_qda'); look = [0.3, 0.6]; pose = Object.assign({}, P['서기'], { armR: [[252, 285], [306, 316], [330, 270]], hR: [336, 262] }); }
  if (ph === 3) { ex = fEx('z울먹'); look = [-0.3, 0.4]; }
  if (ph === 5) { pose = '웅크림'; ex = fEx('z울먹'); look = [0, 0.6]; }
  const CAMA = { 0: qLerpCam(lt / D, [960, 540, 0.75], [900, 540, 1.15]), 1: qLerpCam(lt / D, [1000, 540, 0.95], [920, 540, 1.0]), 2: [700, 520, 1.5],
    3: qLerpCam(lt / D, [900, 560, 1.2], [900, 560, 0.55]), 4: qLerpCam(lt / D, [960, 540, 0.62], [960, 540, 0.45]), 5: qLerpCam(lt / D, [900, 580, 1.25], [900, 580, 1.45]) };
  const cam = CAMA[ph];
  let w = '';
  // 멀리 떠 있는 다른 원자들(섬)
  const isl = ph >= 3 ? 14 : 6;
  for (let i = 0; i < isl; i++) { const ax = -900 + hash(i * 7.3) * 3700, ay = -700 + hash(i * 3.1) * 2400; if (Math.abs(ax - 900) < 500 && Math.abs(ay - 560) < 420) continue;
    w += qdAtom(ax + Math.sin(t * 0.3 + i) * 20, ay, 120 + hash(i) * 120, t, `<circle r="10" fill="url(#qdNuc)"/>`, { seed: i, warm: i % 3 === 0 }); }
  if (other) w += qdAtom(other[0], other[1] + Math.sin(t * 1.2 + 1) * 8, R, t, `<circle r="12" fill="url(#qdNuc)"/>` + `<circle cx="-8" cy="-34" r="7" fill="${INK}"/><circle cx="14" cy="-34" r="7" fill="${INK}"/>`, { seed: 5, warm: true, jit });
  const inner = QZ({ x: 0, y: 110 + (ph === 5 ? -10 : 0), s: zs, sx, sy, t, pose, ex, look, seed: 3, tilt: ph === 1 && lt > 1.55 ? -14 : 0 });
  w += qdAtom(zx, zy + bob, R, t, inner, { seed: 1, jit, squash });
  if (ph === 1 && lt > 1.4 && lt < 1.9) { const gx = 900 + R + 3; w += `<g opacity="${f1((1 - qdK(1.55, 1.9, lt)) * 100) / 100}"><line x1="${gx}" y1="420" x2="${gx}" y2="700" stroke="#fff" stroke-width="8" stroke-dasharray="10 12"/>${[0, 1, 2].map(i => `<path d="M${gx - 30 - i * 26} ${470 + i * 70} l-36 0 m10 -12 l-10 12 l10 12 M${gx + 30 + i * 26} ${470 + i * 70} l36 0 m-10 -12 l10 12 l-10 12" stroke="#FFE27A" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}</g>`; }
  let over = '';
  if (ph === 1) { over += qdFx(t, lt, 1.45, 2.1, 1000, 260, '지잉—', '#BFE6FF', { size: 66 }); over += qdFx(t, lt, 1.6, 2.6, 560, 330, '통!', '#FFE27A', { size: 80, rot: 8 }); }
  if (ph === 2) over += qdFx(t, lt, 0.1, 1.8, 500, 230, '?!', '#fff', { size: 80, rot: -8 });
  return qdDefs() + qCam(cam, qdSpace(t, cam, { dim: ph >= 3 ? 0.7 : 1 }) + w) + over;
}
/* ---------- 7. 축구장 비유: 원자핵은 쌀알 ---------- */
function qdstadiumScene(t, lt, a) {
  const D = a._dur || 7, tR = fAt(a, '쌀알', D * 0.45), tE = fAt(a, '텅', D * 0.85);
  const zk = easeInOut(qdK(tR - 0.6, tR + 0.6, lt)), zo = easeInOut(qdK(tE - 0.4, tE + 0.8, lt));
  const NX = 1032, NY = 620, cam = [lerp(960, NX, zk * (1 - zo)), lerp(560, NY, zk * (1 - zo)), lerp(1.0, 4.2, zk * (1 - zo)) + zo * 0.04];
  // 원자 껍데기(경기장 전체를 덮는 투명한 구) + 한가운데 쌀알 원자핵
  let ex = `<ellipse cx="${NX}" cy="${NY}" rx="1000" ry="560" fill="#BFE6FF" opacity=".16" stroke="#E6F7FF" stroke-width="10" stroke-dasharray="20 18"/>`;
  ex += `<ellipse cx="${NX}" cy="${NY}" rx="12" ry="7" fill="#FFF6DC" stroke="${INK}" stroke-width="3"/><circle cx="${NX}" cy="${NY}" r="${f1(30 + 10 * Math.sin(t * 5))}" fill="url(#qdNuc)" opacity="${f1((0.3 + 0.5 * zk) * 100) / 100}"/>`;
  let over = '';
  over += pop(t, t - lt + 0.3, t - lt + tR - 0.4, 960, 150, label(0, 0, '원자 = 축구장', { size: 52, bg: YEL }), { rot: -3, bob: 3 });
  if (lt > tR + 0.2) over += pop(t, t - lt + tR + 0.2, t - lt + tE - 0.2, 1240, 380, label(0, 0, '원자핵 = 쌀알 하나', { size: 52, bg: '#fff' }), { rot: 3, bob: 3 });
  if (lt > tE) over += pop(t, t - lt + tE, t + 99, 960, 160, label(0, 0, '나머지는 거의 전부 빈 공간', { size: 52, bg: YEL }), { rot: -2, bob: 3 });
  return qdDefs() + qCam(cam, `<image href="${QBG.stadium}" x="-150" y="-30" width="2220" height="1250" preserveAspectRatio="xMidYMid slice"/>` + ex) + over;
}
/* ---------- 8. 어제의 어깨동무(회상 말풍선) ---------- */
function qdmemoryScene(t, lt, a) {
  const D = a._dur || 4, tA = fAt(a, '어깨동무', 1.4), tN = fAt(a, '안', D * 0.75);
  E['_qdm'] = qTalk('z울먹', env(t) * 0.8);
  const cam = [960, 540, 1.0];
  let h = qdSpace(t, cam, { dim: 0.6 });
  // 아래 왼쪽: 원자 제로가 회상을 올려다본다
  h += qdAtom(330, 820, 170, t, QZ({ x: 0, y: 80, s: 0.32, t, pose: '둥둥', ex: fEx('_qdm'), look: [0.8, -0.8], seed: 3 }), { seed: 1 });
  // 회상 창(세피아, 노을 퇴근길)
  const ok = easeOutBack(qdK(0.1, 0.5, lt));
  let m = `<rect x="-560" y="-330" width="1120" height="660" rx="40" fill="url(#qdDusk)" stroke="#fff" stroke-width="10"/>`;
  m += `<rect x="-560" y="120" width="1120" height="210" fill="#C98C64" opacity=".55"/>` + [-420, -200, 260, 430].map((x, i) => `<rect x="${x}" y="${-200 + i * 30}" width="120" height="${320 - i * 30}" fill="#B07856" opacity=".45"/>`).join('');
  const hug = qdK(0.15, 0.6, lt);
  // 제로(왼) + 태호(오). 태호 왼팔이 제로 오른어깨 위로
  m += QZday({ x: -110, y: 300, s: 0.78, t, pose: '서기', ex: fEx('z빵긋'), look: [0.6, 0], seed: 3 });
  const thPose = Object.assign({}, P['서기'], { armL: [[148, 285], [70, 230], [lerp(40, -120, hug), lerp(260, 250, hug)]], hL: [lerp(30, -126, hug), lerp(262, 250, hug)] });
  m += TH({ x: 170, y: 300, s: 0.8, t, pose: thPose, ex: fEx('z히죽'), look: [-0.6, 0], seed: 8 });
  // 어깨 사이 '틈' 돋보기
  if (lt > tN - 0.3) { const g = easeOutBack(qdK(tN - 0.3, tN + 0.2, lt)), [sx0, sy0] = [-360, -10];
    m += `<line x1="-290" y1="10" x2="-110" y2="60" stroke="${INK}" stroke-width="6" stroke-dasharray="6 8"/>`;
    m += `<g transform="translate(${sx0} ${sy0}) scale(${f1(g * 1000) / 1000})"><circle r="90" fill="#fff" fill-opacity=".85" stroke="${INK}" stroke-width="9"/><line x1="64" y1="64" x2="120" y2="120" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>` +
      `<path d="M-70 18 Q-10 6 60 18" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M-70 -14 Q-10 -26 60 -14" fill="none" stroke="#3A3F4B" stroke-width="16" stroke-linecap="round"/><line x1="-10" y1="-6" x2="-10" y2="8" stroke="${QD_RED}" stroke-width="5"/>${zStar(30, 0, 9, '#FFE27A', 2)}</g>`; }
  h += `<g transform="translate(1100 470) scale(${f1(ok * 0.9 * 1000) / 1000})" opacity=".96">${m}</g>`;
  h += `<path d="M520 760 Q620 700 640 640" fill="none" stroke="#fff" stroke-width="8" stroke-dasharray="4 18" stroke-linecap="round" opacity="${f1(ok * 0.7 * 100) / 100}"/>`;
  let over = '';
  if (lt > tA) over += pop(t, t - lt + tA, t + 99, 1100, 110, label(0, 0, '어제, 퇴근길', { size: 42, bg: '#FFE9C7' }), { rot: -3, bob: 2 });
  return qdDefs() + h + over;
}
/* ---------- 9. 도식: 전자는 서로 밀어낸다 ---------- */
function qddiagramScene(t, lt, a) {
  const D = a._dur || 7, tP = fAt(a, '밀어냅니다', 2.6), tN = fAt(a, '원자핵끼리는', D * 0.6), tX = fAt(a, '맞닿지', D * 0.8);
  let h = `<rect x="-100" y="-100" width="2200" height="1400" fill="#0B1226"/>` + `<rect x="-100" y="-100" width="2200" height="1400" fill="url(#grid)"/>`;
  const push = lt > tP ? easeOut(qdK(tP, tP + 0.6, lt)) : 0, gap = 8 + 30 * push;
  const R = 260, ax = 960 - R - gap / 2, bx = 960 + R + gap / 2, y = 500;
  h += qdAtom(ax, y, R, t, `<circle r="13" fill="url(#qdNuc)" stroke="${INK}" stroke-width="3"/>`, { seed: 2, squash: -0.05 * push });
  h += qdAtom(bx, y, R, t, `<circle r="13" fill="url(#qdNuc)" stroke="${INK}" stroke-width="3"/>`, { seed: 6, warm: true, squash: -0.05 * push });
  if (lt > tP - 0.2) { const k = easeOutBack(qdK(tP - 0.2, tP + 0.3, lt)); h += `<g opacity="${f1(k * 100) / 100}">` + [-1, 1].map(sd => `<g transform="translate(${960 + sd * 60} ${y})"><path d="M0 0 L${sd * 120 * k} 0" stroke="#FF8A8A" stroke-width="16" stroke-linecap="round"/><path d="M${sd * 120 * k} -26 L${sd * 160 * k} 0 L${sd * 120 * k} 26 Z" fill="#FF8A8A" stroke="${INK}" stroke-width="5"/></g>`).join('') + `</g>`;
    h += pop(t, t - lt + tP, t + 99, 960, 160, label(0, 0, '전자끼리 밀어냄', { size: 46, bg: '#FFD6D6' }), { rot: -2, bob: 2 }); }
  if (lt > tN - 0.2) { const k = qdK(tN - 0.2, tN + 0.6, lt);
    h += `<line x1="${f1(ax)}" y1="${y + 300}" x2="${f1(lerp(ax, bx, k))}" y2="${y + 300}" stroke="#FFE27A" stroke-width="6" stroke-dasharray="14 12"/>` + [ax, bx].map(x => `<line x1="${f1(x)}" y1="${y + 20}" x2="${f1(x)}" y2="${y + 300}" stroke="#FFE27A" stroke-width="3" opacity=".6"/>`).join('');
    h += pop(t, t - lt + tN, t + 99, ax, y - 60, label(0, 0, '원자핵', { size: 34, bg: '#FFF2C2' }), { rot: -4 }) + pop(t, t - lt + tN + 0.1, t + 99, bx, y - 60, label(0, 0, '원자핵', { size: 34, bg: '#FFF2C2' }), { rot: 4 }); }
  if (lt > tX) h += pop(t, t - lt + tX, t + 99, 960, 900, outlined(0, 0, ['끝내 맞닿지 않는다'], { size: 64, sw: 13, fill: '#FFE27A' }), { rot: -2 });
  return qdDefs() + qCam(qLerpCam(lt / D, [960, 540, 1.0], [960, 540, 1.05]), h);
}
