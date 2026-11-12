/* 10년 전 사진 편 — 샘플(대본_v3 1~17번). 새 이름은 모두 ph 접두사. qdscenes.js(원자 꿈 편)의 TH·qdRbc·qdDefs를 함께 쓴다.
   물리 규칙: 앉은 사람은 의자 좌판 위에 엉덩이 · 사진·캔은 테이블 윗면 위에 · 손에 든 사진은 손 위치에 · 원인 다음 결과. */
Object.assign(QBG, { moveroom: 'ai/moveroom.png', cvsapt: 'ai/cvsapt.png', vessel: 'ai/vessel.png' });
['phroom', 'phphoto', 'phtable', 'phskin', 'phbody', 'phcarbon', 'phbrain'].forEach(k => CAMS[k] = 'fixed');
const PH_SUIT = '#2E3A5C', PH_TIE = '#B8323A', PH_PINK = '#F2A7B8', PH_SEPIA = '#F3E2C0', PH_GREEN = '#7FD38A', PH_GOLD = '#FFD23F';
const phK = (t0, t1, x) => clamp((x - t0) / (t1 - t0), 0, 1);
const phFx = (t, lt, t0, t1, x, y, s, c, o = {}) => lt > t0 && lt < t1 ? fx(t, t - lt + t0, t - lt + t1, x, y, s, c, Object.assign({ size: 60, rot: -6 }, o)) : '';
const phPlate = (k, cam, depth = 0.6, extra = '') => qdPlate(k, cam, depth, extra);
const ZY = o => Z(Object.assign({ vest: PH_SUIT, vshade: 'rgba(0,0,0,0.22)', collar: true, tie: PH_TIE }, o));             // 스물네 살 제로(정장)
const GM = o => HALO(char(Object.assign({ goggles: 'none', vest: PH_PINK, patch: false, tee: true, vshade: 'rgba(120,40,60,0.18)', topknot: '#E4E4E4', robe: false }, o))); // 할머니
const phDefs = () => `<defs>
<linearGradient id="phSun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF6D8"/><stop offset="1" stop-color="#F3D9A6"/></linearGradient>
<radialGradient id="phStore" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE7B0" stop-opacity=".6"/><stop offset="1" stop-color="#FFE7B0" stop-opacity="0"/></radialGradient>
<radialGradient id="phBrain" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".9"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></radialGradient>
<filter id="phSepia"><feColorMatrix type="matrix" values="0.42 0.56 0.14 0 0.04  0.36 0.5 0.12 0 0.03  0.28 0.4 0.1 0 0.01  0 0 0 1 0"/></filter>
</defs>`;

/* ---------- 사진 한 장(인화지). 원점 = 사진 가운데, 600x420. cover = 오른쪽 반을 엄지로 가림(0~1) ---------- */
function phPhoto(t, o = {}) {
  const W2 = 300, H2 = 210, id = 'php' + (o.id || 'a');
  let inner = `<rect x="-${W2}" y="-${H2}" width="${W2 * 2}" height="${H2 * 2}" fill="url(#phSun)"/>`;
  // 병실 창: 왼쪽 위, 햇빛 사선
  inner += `<rect x="-270" y="-190" width="230" height="170" fill="#CFE8F7" stroke="${INK}" stroke-width="5"/><line x1="-155" y1="-190" x2="-155" y2="-20" stroke="${INK}" stroke-width="4"/><line x1="-270" y1="-105" x2="-40" y2="-105" stroke="${INK}" stroke-width="4"/>`;
  inner += `<path d="M-270 -20 L-40 -20 L120 210 L-110 210 Z" fill="#FFF3C4" opacity=".55"/>`;
  // 침대(오른쪽): 머리판, 이불
  inner += `<rect x="20" y="-60" width="300" height="120" rx="14" fill="#DDE6EE" stroke="${INK}" stroke-width="5"/><path d="M10 40 Q160 10 320 40 L320 220 L10 220 Z" fill="#EEF3F8" stroke="${INK}" stroke-width="5"/>`;
  // 할머니: 침대에 기대 앉아, 링거 손으로 손주 넥타이를 고쳐 준다
  inner += GM({ x: 150, y: 260, s: 0.5, t: 0, pose: Object.assign({}, P['서기'], { armL: [[148, 285], [100, 300], [40, 268]], hL: [32, 262] }), ex: fEx('z빵긋'), look: [-0.9, 0], seed: 21, still: true });
  inner += `<line x1="128" y1="-150" x2="104" y2="104" stroke="#9BB8D0" stroke-width="3"/><rect x="118" y="-196" width="22" height="44" rx="6" fill="#E8F4FF" stroke="${INK}" stroke-width="3"/>`;
  // 스물네 살 제로: 정장, 손목시계를 본다(왼손을 얼굴 앞으로)
  const watchPose = Object.assign({}, P['서기'], { armL: [[148, 285], [96, 320], [150, 250]], hL: [156, 244] });
  inner += ZY({ x: -110, y: 300, s: 0.74, t: 0, pose: watchPose, ex: fEx('z기본'), look: [-0.3, 0.4], seed: 3, still: true });
  const id2 = id + 'c';
  let h = `<g transform="translate(${f1(o.x || 0)} ${f1(o.y || 0)}) rotate(${f1(o.rot == null ? -3 : o.rot)}) scale(${f1((o.s || 1) * 1000) / 1000})">`;
  h += `<rect x="-${W2 + 26}" y="-${H2 + 26}" width="${(W2 + 26) * 2}" height="${(H2 + 26) * 2 + 40}" rx="10" fill="#FBF7EE" stroke="${INK}" stroke-width="6"/>`;
  h += `<clipPath id="${id2}"><rect x="-${W2}" y="-${H2}" width="${W2 * 2}" height="${H2 * 2}"/></clipPath><g clip-path="url(#${id2})"><g filter="url(#phSepia)" opacity=".96">${inner}</g><rect x="-${W2}" y="-${H2}" width="${W2 * 2}" height="${H2 * 2}" fill="#F5C77E" opacity=".12"/></g>`;
  if (o.cover) { const c = o.cover, dx = lerp(560, 0, c); // 사진 오른쪽 가장자리를 쥔 손: 손바닥은 사진 밖, 엄지가 오른쪽 반을 덮는다
    h += `<g transform="translate(${f1(dx)} 0)"><circle cx="372" cy="70" r="150" fill="#fff" stroke="${INK}" stroke-width="10"/>` +
      `<path d="M330 -40 Q330 -210 150 -220 L40 -220 Q-40 -220 -40 -140 L-40 160 Q-40 240 40 240 L230 240 Q330 230 340 150 Z" fill="#fff" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>` +
      `<path d="M-18 -150 Q-20 -196 26 -198 L80 -198 Q112 -196 112 -160 L112 -110 Q110 -82 80 -82 L20 -82 Q-16 -84 -18 -120 Z" fill="#F4F1EA" stroke="${INK}" stroke-width="6"/><path d="M200 120 Q240 150 300 130" fill="none" stroke="${INK}" stroke-width="5" opacity=".35"/></g>`; }
  return h + `</g>`;
}
// 사진 뒷면(엎어 둔 사진)
const phPhotoBack = (x, y, s, rot) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000})"><rect x="-326" y="-236" width="652" height="512" rx="10" fill="#EFE8D8" stroke="${INK}" stroke-width="9"/><path d="M-260 -170 L260 -170" stroke="#D8CFBB" stroke-width="10"/></g>`;

/* ---------- 1. 원룸 이삿짐: 상자 바닥에서 사진을 꺼낸다 ---------- */
function phroomScene(t, lt, a) {
  const cam = qLerpCam(lt / 2.6, [960, 640, 1.12], [1000, 660, 1.42]);
  const x = 980, y = 1000, s = 0.95, lift = easeOut(phK(0.6, 1.6, lt)), look = phK(1.4, 1.9, lt);
  let w = qShadow(x, y, 90);
  const pose = Object.assign({}, P['웅크림'], { armR: [[252, 285], [300, lerp(360, 300, lift)], [lerp(330, 300, lift), lerp(420, 250, lift)]], hR: [lerp(334, 300, lift), lerp(426, 244, lift)] });
  w += Z({ x, y, s, t, pose, ex: exprAt([[0, 'z기본'], [0.8, 'z의심'], [1.7, 'z멍']], lt), look: [0.6, lerp(0.6, -0.1, look)], seed: 3 });
  const [hx, hy] = ptOf(x, y + 30 * s, s, pose.hR[0], pose.hR[1]);
  if (lift > 0) w += phPhotoBack(hx + 10, hy - 30 * lift, 0.14, -10 + 20 * lift);
  // 앞쪽 상자(열린 상자): 사람 아래쪽을 가린다
  w += `<g transform="translate(1110 1010)"><path d="M-150 -170 L150 -170 L150 0 L-150 0 Z" fill="#C99A62" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-150 -170 L-200 -230 L90 -230 L150 -170 Z" fill="#D9AE74" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M150 -170 L210 -220 L210 -40 L150 0 Z" fill="#B88850" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-150" y="-110" width="300" height="22" fill="#E8D2A6" opacity=".8"/></g>`;
  let over = '';
  if (lt > 0.55 && lt < 1.3) w += puff(1110, 820, t, t - lt + 0.55, 0.9, '#E9DCC4');
  over += phFx(t, lt, 0.6, 1.4, 1350, 300, '퍽', '#F3E2C0', { size: 60 });
  return phDefs() + phPlate('moveroom', cam, 0.6) + qCam(cam, w) + warm(0.12) + over;
}
/* ---------- 2. 사진 클로즈업 ---------- */
function phphotoScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 3;
  const cam = ph === 0 ? qLerpCam(lt / 2.4, [960, 520, 1.0], [960, 520, 1.08]) : qLerpCam(lt / D, [960, 520, 1.08], [880, 520, 1.55]);
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#3B2E28"/><rect x="-400" y="-300" width="2800" height="1700" fill="url(#paper)" opacity=".5"/>`;
  h += phPhoto(t, { x: 960, y: 520, s: 1.25, cover: 1, id: 'cu' });
  // 지금 제로의 굳은 얼굴이 위에 살짝 겹친다(ph0)
  let over = '';
  if (ph === 0) { const k = phK(0.6, 1.4, lt); over += `<g opacity="${f1(k * 0.35 * 100) / 100}">${Z({ x: 1560, y: 980, s: 0.9, t, pose: '서기', ex: fEx('z멍'), look: [-0.8, 0.4], seed: 3, still: true })}</g>`; }
  if (ph === 1) { const tick = Math.floor(t * 2) % 2; over += `<g transform="translate(1560 200)" opacity=".85"><circle r="56" fill="#FBF7EE" stroke="${INK}" stroke-width="6"/><line x1="0" y1="0" x2="0" y2="-40" stroke="${INK}" stroke-width="6" stroke-linecap="round" transform="rotate(${Math.floor(t) * 6})"/><circle r="6" fill="${INK}"/></g>`; }
  return phDefs() + qCam(cam, h) + over;
}
/* ---------- 3. 편의점 앞 파라솔 테이블 ---------- */
const PT = { x: 960, top: 800, seat: 880, zx: 690, tx: 1230, s: 0.95 };
const phSitY = s => PT.seat - 12 + 148 * s;
function phChair(x, flipIt) { const S = PT.seat;
  const g = `<rect x="${x - 70}" y="${S - 150}" width="22" height="160" rx="8" fill="#E9E4DA" stroke="${INK}" stroke-width="6"/><rect x="${x - 90}" y="${S - 14}" width="170" height="26" rx="10" fill="#F2EEE6" stroke="${INK}" stroke-width="6"/>` +
    `<line x1="${x - 76}" y1="${S + 12}" x2="${x - 86}" y2="1010" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><line x1="${x + 66}" y1="${S + 12}" x2="${x + 76}" y2="1010" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>`;
  return flipIt ? flip(x, g) : g; }
function phTableTop(t) { const { x, top } = PT;
  return `<ellipse cx="${x}" cy="${top}" rx="250" ry="46" fill="#F7F4EE" stroke="${INK}" stroke-width="8"/><ellipse cx="${x}" cy="${top - 6}" rx="230" ry="36" fill="#fff" opacity=".6"/>` +
    `<line x1="${x}" y1="${top + 40}" x2="${x}" y2="1000" stroke="${INK}" stroke-width="14"/><line x1="${x}" y1="${top + 40}" x2="${x}" y2="1000" stroke="#DDD8CE" stroke-width="7"/><ellipse cx="${x}" cy="1004" rx="90" ry="16" fill="#CFC9BD" stroke="${INK}" stroke-width="6"/>`; }
function phParasol() { const { x, top } = PT;
  let h = `<line x1="${x}" y1="${top}" x2="${x}" y2="40" stroke="#8C8C8C" stroke-width="12"/><line x1="${x}" y1="${top}" x2="${x}" y2="40" stroke="${INK}" stroke-width="3" opacity=".5"/>`;
  const segs = 8; let d = '';
  for (let i = 0; i < segs; i++) { const a0 = Math.PI * (i / segs), a1 = Math.PI * ((i + 1) / segs), r = 620;
    const p = (a) => [x - Math.cos(a) * r, 120 + Math.sin(a) * 40];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    h += `<path d="M${x} -40 L${f1(x0)} ${f1(y0)} Q${f1((x0 + x1) / 2)} ${f1((y0 + y1) / 2 + 26)} ${f1(x1)} ${f1(y1)} Z" fill="${i % 2 ? '#F4F1EA' : '#3E8E6E'}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`; }
  return h; }
const phCan = (x, y, c) => `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="-20" y="-58" width="40" height="58" rx="7" fill="${c}" stroke="${INK}" stroke-width="5"/><rect x="-20" y="-46" width="40" height="12" fill="#fff" opacity=".5"/><ellipse cx="0" cy="-58" rx="20" ry="6" fill="#D8D8D8" stroke="${INK}" stroke-width="4"/></g>`;
function phtableScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 3, s = PT.s, y = phSitY(s);
  E['_phz'] = qTalk('z기본', env(t) * 0.8); E['_phz2'] = qTalk('z울먹', env(t) * 0.6); E['_phz3'] = qTalk('z민망', env(t) * 0.8); E['_phz4'] = qTalk('z반짝', env(t));
  E['_pht'] = qTalk('z기본', env(t) * 0.8);
  const CAMT = { 0: qLerpCam(lt / D, [800, 690, 1.45], [790, 690, 1.62]), 1: lt < 1.0 ? [960, 760, 1.9] : [1180, 690, 1.6], 2: qLerpCam(lt / D, [1150, 680, 1.45], [1170, 680, 1.6]),
    3: [780, 690, 1.6], 4: qLerpCam(lt / D, [960, 680, 1.15], [960, 680, 1.25]), 5: qLerpCam(lt / D, [770, 650, 1.8], [760, 640, 2.0]), 6: qLerpCam(lt / D, [960, 640, 1.2], [960, 600, 1.0]) };
  const cam = CAMT[ph];
  // 제로
  let zEx = fEx('z기본'), zLook = [0.8, 0.2], zPose = P['f앉기'], zTilt = 0;
  if (ph === 0) { const tD = fAt(a, '돌아가셨고', D * 0.45); zEx = lt < tD - 0.3 ? fEx('_phz') : fEx('_phz2'); zLook = [0.5, 0.6]; zTilt = lt > tD ? -5 : 0; }
  if (ph === 1) { zEx = fEx('z울먹'); zLook = [0.5, 0.6]; }
  if (ph === 2) { zEx = fEx('z멍'); zLook = [0.8, 0.1]; }
  if (ph === 3) { zEx = fEx('_phz3'); zLook = [0.8, 0]; const pat = Math.abs(Math.sin(lt * 9)) * phK(0.3, 0.5, lt) * (1 - phK(1.4, 1.6, lt));
    zPose = Object.assign({}, P['f앉기'], { armR: [[252, 285], [292, 330], [lerp(230, 214, pat), lerp(330, 312, pat)]], hR: [lerp(226, 210, pat), lerp(336, 316, pat)] }); }
  if (ph === 4) { zEx = fEx('_phz4'); zLook = [0.9, -0.1]; zPose = Object.assign({}, P['f앉기'], { armR: [[252, 285], [310, 280], [360, 250]], hR: [368, 246] }); }
  if (ph === 5) { zEx = fEx('_phz3'); zLook = [0.3, 0.7]; zTilt = -8; }
  if (ph === 6) { zEx = fEx('z멍'); zLook = [0.3, 0.6]; zTilt = -6; }
  // 태호(왼쪽을 보고 앉는다)
  let tEx = fEx('z기본'), tLook = [-0.8, 0.2], tPose = P['f앉기L'], canUp = 0;
  if (ph === 0) { tEx = fEx('z기본'); tLook = [-0.8, 0.3]; }
  if (ph === 1) { canUp = phK(0.9, 1.3, lt); tEx = lt > 1.4 ? fEx('z멍') : fEx('z기본'); tLook = lt > 1.0 ? [-0.6, 0.7] : [-0.8, 0.2]; }
  if (ph === 2) { tEx = fEx('_pht'); tLook = [-0.7, 0.4]; tPose = Object.assign({}, P['f앉기L'], { armL: [[148, 285], [100, 330], [52, 360]], hL: [44, 364] }); }
  if (ph === 3 || ph === 4) { tEx = fEx(ph === 4 ? 'z의심' : 'z히죽'); tLook = [-0.8, 0]; }
  if (ph >= 5) { tEx = fEx('z기본'); tLook = [-0.7, 0.3]; }
  if (ph === 1 && canUp > 0) tPose = Object.assign({}, P['f앉기L'], { armR: [[252, 285], [250, 300], [216, 222]], hR: [212, 216] });
  let w = phParasol();
  w += phChair(PT.zx - 10, false) + phChair(PT.tx + 10, true);
  w += Z({ x: PT.zx, y, s, t, pose: zPose, ex: zEx, look: zLook, tilt: zTilt, seed: 3 });
  w += TH({ x: PT.tx, y, s, t, pose: tPose, ex: tEx, look: tLook, seed: 8 });
  // 태호 손의 캔커피
  { const [hx, hy] = ptOf(PT.tx, y, s, tPose.hR[0], tPose.hR[1]); w += canUp > 0 ? phCan(hx, hy + 20, '#7A5236') : phCan(PT.x + 150, PT.top - 4, '#7A5236'); }
  w += phTableTop(t) + phCan(PT.x - 170, PT.top - 4, '#4F8FD6');
  // 사진: ph0 제로 손에 → ph1 테이블에 엎어 둠 → 이후 엎어진 채
  if (ph === 0) { const [hx, hy] = ptOf(PT.zx, y, s, zPose.hR[0], zPose.hR[1]); w += `<g transform="translate(${f1(hx + 30)} ${f1(hy - 40)}) rotate(-12)">${phPhoto(t, { s: 0.16, rot: 0, cover: 1, id: 'tb' })}</g>`; }
  else { const k = ph === 1 ? easeInOut(phK(0.1, 0.7, lt)) : 1; const px = lerp(PT.zx + 110, PT.x - 40, k), py = lerp(PT.top - 120, PT.top - 6, k);
    w += k < 0.5 ? `<g transform="translate(${f1(px)} ${f1(py)}) rotate(-12)">${phPhoto(t, { s: 0.16, rot: 0, cover: 1, id: 'tb2' })}</g>` : phPhotoBack(px, py, 0.17, -6) + `<ellipse cx="${f1(px)}" cy="${f1(py + 6)}" rx="0" ry="0"/>`; }
  let over = '';
  if (ph === 1 && lt > 0.6 && lt < 1.3) over += phFx(t, lt, 0.62, 1.3, 860, 520, '탁', '#fff', { size: 54 });
  const light = `<circle cx="1700" cy="700" r="900" fill="url(#phStore)" opacity=".7"/>`;
  return phDefs() + qDefs() + phPlate('cvsapt', cam, 0.55) + qCam(cam, w + light) + fFull('#0A1238', 0.18) + over;
}

/* ---------- 4. 손가락 밴드 → 피부 속 ---------- */
function phskinScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 5;
  if (ph === 0) { // 손 클로즈업 → 밴드 속으로 줌
    const z = lerp(1.0, 7.5, easeIn(phK(0.6, 2.5, lt))), cam = [968, 520, z];
    let w = `<rect x="-400" y="-300" width="2800" height="1700" fill="#2B2440"/><circle cx="1500" cy="300" r="700" fill="url(#phStore)" opacity=".5"/>`;
    w += `<path d="M520 1200 Q700 760 880 640" fill="none" stroke="${INK}" stroke-width="40" stroke-linecap="round"/>`;
    w += `<circle cx="960" cy="520" r="200" fill="#fff" stroke="${INK}" stroke-width="16"/>`;
    w += `<g transform="translate(968 520) rotate(-24)"><rect x="-150" y="-48" width="300" height="96" rx="46" fill="#E9C9A0" stroke="${INK}" stroke-width="10"/><rect x="-44" y="-36" width="88" height="72" rx="10" fill="#F6E4CC" stroke="${INK}" stroke-width="5"/>` + [-110, -80, 80, 110].map(xx => [-18, 0, 18].map(yy => `<circle cx="${xx}" cy="${yy}" r="4" fill="#C9A47A"/>`).join('')).join('') + `</g>`;
    const wh = phK(2.1, 2.6, lt);
    return phDefs() + qCam(cam, w) + `<rect x="-100" y="-100" width="2200" height="1400" fill="#FFE3E0" opacity="${f1(wh * 100) / 100}"/>`;
  }
  // 피부 속: 상처 틈이 새 세포로 채워진다 + 적혈구가 흐른다
  const cam = qLerpCam(lt / D, [960, 560, 1.15], [960, 560, 1.25]);
  let w = '';
  const tS = fAt(a, '사라지죠', D * 0.75), fill = phK(0.8, tS + 0.3, lt);
  const cols = 15, cw = 120;
  for (let r = 0; r < 3; r++) for (let c = 0; c < cols; c++) { const x = 60 + c * cw + (r % 2) * 60, y = 760 + r * 90, gap = Math.abs(c - 7) <= 1 && r < 2;
    const born = gap ? clamp((fill * 3 - (Math.abs(c - 7) * 0.5 + (1 - r) * 0.8)), 0, 1) : 1;
    if (born <= 0) continue; const sc = gap ? easeOutBack(born) : 1;
    w += `<g transform="translate(${x} ${y}) scale(${f1(sc * 1000) / 1000})"><ellipse rx="56" ry="40" fill="${gap ? '#FFC2C8' : '#F29AA6'}" stroke="${INK}" stroke-width="6"/><circle r="12" fill="${gap ? '#E26A7C' : '#C7586A'}"/>${gap && born > 0.6 ? zStar(30, -26, 9, '#fff', 0) : ''}</g>`; }
  w += qdFlow(t, 9, 380, 600, 380, 0.45, 0.7, 23).replace(/<g transform="translate\(-10 -58\)">.*?<\/g>/g, '');
  let over = '';
  if (lt > tS - 0.3) over += pop(t, t - lt + tS - 0.3, t + 99, 960, 160, label(0, 0, '새 세포가 메운다', { size: 46, bg: '#FFD6DA' }), { rot: -3, bob: 3 });
  return phDefs() + qdDefs() + phPlate('vessel', cam, 0.4) + qCam(cam, w) + fFull('#4A0A14', 0.1) + over;
}

/* ---------- 5. 몸 지도: 바뀌는 속도 → 대부분 젊다 → 머리만 그대로 ---------- */
const PB = { x: 700, y: 1010, s: 1.55 };
function phBodyDots(t, mode, k, headK) { // mode 0: 없음, 1: 초록으로 바뀜(k), 2: 머리만 노랑(headK)
  let h = ''; const P0 = (lx, ly) => ptOf(PB.x, PB.y, PB.s, lx, ly);
  const pts = [];
  for (let i = 0; i < 46; i++) { const an = hash(i * 3.3) * Math.PI * 2, r = Math.sqrt(hash(i * 7.1)) * 92; pts.push([...P0(200 + Math.cos(an) * r, 170 + Math.sin(an) * r * 0.9), 1]); }
  for (let i = 0; i < 40; i++) pts.push([...P0(150 + hash(i * 2.2) * 100, 280 + hash(i * 5.7) * 120), 0]);
  for (let i = 0; i < 26; i++) { const sd = i % 2 ? 1 : -1, u = hash(i * 4.4); pts.push([...P0(200 + sd * (18 + u * 10), 420 + u * 100), 0]); }
  for (let i = 0; i < 20; i++) { const sd = i % 2 ? 1 : -1, u = hash(i * 9.9); pts.push([...P0(200 + sd * (55 + u * 40), 300 + u * 70), 0]); }
  pts.forEach(([x, y, head], i) => { let c = '#C9C2D6', g = 0;
    if (mode >= 1) { const kk = clamp(k * 1.6 - hash(i * 1.7) * 0.6, 0, 1); if (kk > 0.5) { c = PH_GREEN; g = kk; } }
    if (mode === 2 && head) { c = headK > hash(i * 2.9) * 0.5 ? PH_GOLD : PH_GREEN; }
    const r = 7 + 3 * Math.sin(t * 3 + i) * (mode === 2 && head ? 1 : 0.3);
    h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${c}" stroke="${INK}" stroke-width="2.5"/>`; });
  return h;
}
const phClock = (x, y, r, txt, t, col) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#fff" stroke="${INK}" stroke-width="6"/><line x1="0" y1="0" x2="0" y2="${-r * 0.7}" stroke="${col}" stroke-width="6" stroke-linecap="round" transform="rotate(${f1(t * 240)})"/><circle r="5" fill="${INK}"/></g>` + fT(x + r + 18, y + 16, txt, 50, '#fff', { anchor: 'start', stroke: INK, sw: 8 });
function phbodyScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 6;
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#1E2236"/><rect x="-400" y="-300" width="2800" height="1700" fill="url(#grid)"/>`;
  h += `<g opacity=".9">${Z({ x: PB.x, y: PB.y, s: PB.s, t, pose: '서기', ex: fEx(ph === 2 ? 'z멍' : 'z기본'), look: [0.6, 0], seed: 3, still: true, vest: '#3B4260' })}</g>`;
  let over = '';
  if (ph === 0) {
    const items = [['위장', '며칠', 360, 250, 415, '#FF8A5B'], ['피부', '한 달 남짓', 268, 420, 330, '#F2A7B8'], ['적혈구', '넉 달', 228, 590, 290, QD_RED], ['뼈', '10년', 480, 760, 470, '#E8E2CF']];
    items.forEach(([k, v, ly, yy, lyy, col], i) => { const tk = fAt(a, k, 0.6 + i * 1.8); if (lt < tk - 0.2) return;
      const p = ptOf(PB.x, PB.y, PB.s, i === 1 ? 100 : 200, lyy), g = easeOutBack(phK(tk - 0.2, tk + 0.2, lt));
      h += `<line x1="${f1(p[0])}" y1="${f1(p[1])}" x2="1160" y2="${yy}" stroke="#fff" stroke-width="4" stroke-dasharray="8 8" opacity="${f1(g * 0.7 * 100) / 100}"/><circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(14 * g)}" fill="${col}" stroke="${INK}" stroke-width="4"/>`;
      over += pop(t, t - lt + tk - 0.2, t + 99, 1240, yy, phClock(0, 0, 54, `${k} · ${v}`, t, col), { rot: 0, noPop: false }); });
  }
  if (ph >= 1) h += phBodyDots(t, ph === 1 ? 1 : 2, ph === 1 ? phK(0.3, 2.4, lt) : 1, ph === 2 ? phK(0.2, 1.0, lt) : 0);
  if (ph === 1) { const tY = fAt(a, '젊다', D * 0.7); if (lt > tY - 0.3) over += pop(t, t - lt + tY - 0.3, t + 99, 1380, 330, label(0, 0, '대부분 그 사람보다 젊다', { size: 46, bg: '#D8F5DC' }), { rot: -3, bob: 3 }); }
  let cam = [960, 540, 1.0];
  if (ph === 2) { const tC = fAt(a, '대뇌', 2.4), zk = easeInOut(phK(tC - 0.3, tC + 1.0, lt)); const head = ptOf(PB.x, PB.y, PB.s, 200, 170);
    cam = [lerp(960, head[0] + 180, zk), lerp(540, head[1] + 60, zk), lerp(1.0, 1.9, zk)];
    if (lt > tC) h += `<circle cx="${f1(head[0])}" cy="${f1(head[1])}" r="${f1(220 + 10 * Math.sin(t * 4))}" fill="url(#phBrain)" opacity="${f1(phK(tC, tC + 0.8, lt) * 0.8 * 100) / 100}"/>`;
    const tA = fAt(a, '나이와', tC + 1.6); if (lt > tA) over += pop(t, t - lt + tA, t + 99, 1380, 300, label(0, 0, '제로와 같은 나이', { size: 54, bg: PH_GOLD }), { rot: -3, bob: 3 }); }
  return phDefs() + qdDefs() + qCam(cam, h) + over;
}
/* ---------- 6. 탄소 시계: 핵실험이 남긴 흔적 ---------- */
function phcarbonScene(t, lt, a) {
  const D = a._dur || 8, tN = fAt(a, '핵실험', D * 0.55), tC = fAt(a, '시계처럼', D * 0.85), tY = fAt(a, '2005년', 0.3);
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#1B2440"/>`;
  // 위: 1960년대 하늘과 먼 사막, 아주 작은 버섯구름 실루엣(사람·피해 없음)
  h += `<rect x="-400" y="620" width="2800" height="800" fill="#C9A87A"/><rect x="-400" y="-300" width="2800" height="920" fill="#8FB3D9"/>`;
  if (lt > tN - 0.4) { const k = easeOut(phK(tN - 0.4, tN + 1.2, lt));
    h += `<g transform="translate(420 620) scale(${f1(0.3 + 0.7 * k)})" opacity=".55"><rect x="-14" y="-160" width="28" height="160" fill="#9C9284"/><ellipse cx="0" cy="-190" rx="90" ry="56" fill="#A9A094"/><ellipse cx="-50" cy="-200" rx="50" ry="36" fill="#B5AC9F"/><ellipse cx="48" cy="-206" rx="54" ry="40" fill="#B5AC9F"/></g>`;
    for (let i = 0; i < 40; i++) { const u = hash(i * 3.7), v = hash(i * 8.1), spread = k * 1500; const x = 420 + (u - 0.3) * spread, y = 380 - v * 400 * k + Math.sin(t + i) * 10;
      h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="9" fill="#FFD23F" stroke="${INK}" stroke-width="2.5" opacity="${f1(k * 100) / 100}"/>`; }
    h += pop(t, t - lt + tN, t + 99, 420, 160, label(0, 0, '1950~60년대 핵실험', { size: 40, bg: '#fff' }), { rot: -3 }); }
  // 아래: 대기 중 탄소 흔적 그래프(올라갔다 천천히 내려옴) → 세포마다 '태어난 해' 꼬리표
  if (lt > tC - 1.2) { const g = phK(tC - 1.2, tC + 0.6, lt), X0 = 900, X1 = 1820, Y0 = 560, Y1 = 220;
    const yr = x => X0 + (x - 1950) / 70 * (X1 - X0), cv = yy => { const p = yy < 1963 ? Math.max(0, (yy - 1955) / 8) : Math.exp(-(yy - 1963) / 16); return Y0 - (Y0 - Y1) * p; };
    h += `<rect x="860" y="160" width="1000" height="460" rx="20" fill="#fff" stroke="${INK}" stroke-width="8"/><line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="${INK}" stroke-width="5"/>`;
    let d = ''; for (let yy = 1950; yy <= 1950 + 70 * g; yy += 1) d += (yy === 1950 ? 'M' : 'L') + f1(yr(yy)) + ' ' + f1(cv(yy));
    h += `<path d="${d}" fill="none" stroke="${QD_RED}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
    [1950, 1980, 2010].forEach(yy => h += fT(yr(yy), Y0 + 40, String(yy), 28, INK));
    if (lt > tC) [[1987, '#9ED8FF'], [2003, PH_GREEN], [1979, '#F2A7B8']].forEach(([yy, c], i) => { const k2 = easeOutBack(phK(tC + i * 0.3, tC + i * 0.3 + 0.4, lt)); if (k2 <= 0) return;
      h += `<g transform="translate(${f1(yr(yy))} ${f1(cv(yy))}) scale(${f1(k2)})"><circle r="26" fill="${c}" stroke="${INK}" stroke-width="5"/><circle r="9" fill="${INK}" opacity=".5"/><g transform="translate(0 -62)"><rect x="-56" y="-22" width="112" height="40" rx="8" fill="${PH_GOLD}" stroke="${INK}" stroke-width="4"/>${fT(0, 10, String(yy), 26, INK)}</g></g>`; }); }
  let over = '';
  if (lt > tY && lt < tN - 0.4) over += pop(t, t - lt + tY, t - lt + tN - 0.4, 960, 300, label(0, 0, '2005년 · 세포의 나이를 재다', { size: 50, bg: '#fff' }), { rot: -2, bob: 3 });
  return phDefs() + qCam(qLerpCam(lt / D, [960, 540, 1.0], [960, 520, 1.04]), h) + over;
}
/* ---------- 7. 머리 속: 기억하는 세포들(필름) ---------- */
function phbrainScene(t, lt, a) {
  const D = a._dur || 6;
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#1A1630"/>`;
  // 큰 옆얼굴 머리(왼쪽) + 뇌 윤곽
  h += `<circle cx="760" cy="520" r="430" fill="#fff" stroke="${INK}" stroke-width="14"/><path d="M500 430 Q520 230 760 210 Q1020 220 1040 430 Q1060 600 900 660 Q760 700 620 650 Q470 590 500 430 Z" fill="#F6E9F2" stroke="#B7A3C9" stroke-width="8"/>`;
  for (let i = 0; i < 18; i++) { const x = 560 + hash(i * 3.1) * 440, y = 260 + hash(i * 5.3) * 360, r = 10 + hash(i) * 6, gl = 0.5 + 0.5 * Math.sin(t * 3 + i);
    for (let j = 0; j < 3; j++) { const an = hash(i * 7 + j) * Math.PI * 2; h += `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x + Math.cos(an) * 46)}" y2="${f1(y + Math.sin(an) * 46)}" stroke="#E2B93B" stroke-width="4" stroke-linecap="round"/>`; }
    h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${PH_GOLD}" stroke="${INK}" stroke-width="3"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 2.6)}" fill="url(#phBrain)" opacity="${f1(gl * 0.6 * 100) / 100}"/>`; }
  // 필름 띠: 창가 햇빛 → 할머니 손(카디건 소매) → 서두르는 발걸음
  const frames = [
    `<rect x="-120" y="-80" width="240" height="160" fill="#FFF3C4"/><rect x="-90" y="-60" width="110" height="90" fill="#CFE8F7" stroke="${INK}" stroke-width="4"/><path d="M-90 30 L20 30 L90 80 L-40 80 Z" fill="#FFE59A" opacity=".8"/>`,
    `<rect x="-120" y="-80" width="240" height="160" fill="#F7E7EE"/><path d="M-120 20 Q-40 0 0 10 L0 50 Q-60 60 -120 60 Z" fill="${PH_PINK}" stroke="${INK}" stroke-width="4"/><circle cx="16" cy="28" r="26" fill="#fff" stroke="${INK}" stroke-width="5"/><line x1="10" y1="10" x2="80" y2="-60" stroke="#9BB8D0" stroke-width="3"/>`,
    `<rect x="-120" y="-80" width="240" height="160" fill="#E9EEF3"/><line x1="-120" y1="40" x2="120" y2="40" stroke="#B9C3CE" stroke-width="4"/>` + [[-40, 30], [30, 20]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="30" ry="14" fill="${INK}"/>`).join(''),
  ];
  const tStop = D - 1.4, off = lt < tStop ? lt * 160 : tStop * 160;
  let film = `<rect x="-1200" y="-120" width="2400" height="240" fill="#2A2A2A"/>`;
  for (let i = 0; i < 9; i++) { const x = -900 + i * 300 + (off % 300); film += `<g transform="translate(${f1(x)} 0)">${frames[i % 3]}<rect x="-124" y="-84" width="248" height="168" fill="none" stroke="#2A2A2A" stroke-width="8"/></g>`;
    for (let k = 0; k < 4; k++) film += `<rect x="${f1(x - 110 + k * 64)}" y="-108" width="30" height="16" rx="3" fill="#EEE"/><rect x="${f1(x - 110 + k * 64)}" y="92" width="30" height="16" rx="3" fill="#EEE"/>`; }
  h += `<g transform="translate(1180 760) rotate(-6)">${film}</g>`;
  return phDefs() + qCam(qLerpCam(lt / D, [960, 540, 1.0], [880, 560, 1.12]), h) + warm(0.08);
}
