/* 스피노자 편 — 3막·4막(대본_v4 15~35번). spscenes.js 다음에 불러온다.
   물리 규칙: 구름이 모인 뒤에 비 · 손은 어깨 위에 닿는다 · 전화기는 손 안에(뒷면) · 걷는 사람의 다리는 앞줄 좌석 뒤로 가려진다 · 꽃과 병은 손에.
   분위기 규칙: 번쩍·흔들림 없음, 밤 장면도 밝게, 우는 얼굴·빈소 안은 그리지 않는다. */
Object.assign(QBG, { bedmorn: 'ai/bedmorn.png', hill: 'ai/hill.png' });
['spstorm', 'spmap', 'spth2', 'spstudy', 'sphug', 'spbooth2', 'sptext', 'spwindow', 'spbed2', 'spmorn', 'spth3', 'sphill', 'splens2', 'sptown', 'spend'].forEach(k => CAMS[k] = 'fixed');
const spCloud = (x, y, s, fill = '#fff', op = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})" opacity="${spOp(op)}"><path d="M-96 22 Q-138 22 -126 -14 Q-118 -52 -74 -46 Q-58 -90 -8 -78 Q32 -104 66 -64 Q118 -64 116 -18 Q128 22 88 22 Z" fill="${fill}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/></g>`;
const spRain = (t, x0, x1, y0, y1, n, op) => { let g = ''; for (let i = 0; i < n; i++) { const x = x0 + hash(i * 7 + 1) * (x1 - x0), y = y0 + ((t * 420 + i * 61) % (y1 - y0)); g += `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x - 8)}" y2="${f1(y + 30)}" stroke="#7E93DA" stroke-width="5" stroke-linecap="round" opacity="${spOp(op * (0.5 + 0.5 * hash(i)))}"/>`; } return g; };
const spBackHead = (x, y, s, fill = '#fff') => { const p = spPt(x, y, s, 200, 170); return `<ellipse cx="${f1(p[0])}" cy="${f1(p[1])}" rx="${f1(111 * s)}" ry="${f1(105 * s)}" fill="${fill}"/>`; };
const ZSUIT = o => Z(Object.assign({ vest: '#2E3040', vshade: 'rgba(0,0,0,0.25)', collar: true, tie: '#15151C' }, o));
const PPL = o => HALO(char(Object.assign({ goggles: 'none', vest: '#B9C0D6', patch: false, tee: true, vshade: 'rgba(0,0,0,0.15)' }, o)));

/* ---------- 9. 폭풍은 누가 못나서 오지 않는다 ---------- */
function spstormScene(t, lt, a) {
  const D = a._dur || 13, tW = fAt(a, '폭풍이나', D * 0.3) - 0.2, tM = fAt(a, '오지', D * 0.75) - 0.2, tR = fAt(a, '옵니다', D - 0.6) - 0.2;
  const en = easeOut(qdK(0.2, 2.4, lt)), km = easeInOut(qdK(tM, tM + 1.9, lt)), rain = qdK(tR, tR + 0.7, lt);
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#DCE8FA"/><rect x="-400" y="500" width="2800" height="900" fill="url(#spPaperV)" opacity=".55"/>`;
  h += `<path d="M-400 900 Q300 780 900 880 Q1500 960 2400 840 L2400 1400 L-400 1400 Z" fill="#C9DDB0" stroke="${INK}" stroke-width="7"/>`;
  const col = km > 0.5 ? '#CBD2EA' : '#fff';
  const c = [[lerp(lerp(-260, 520, en), 800, km), 310, 1.7], [lerp(lerp(2180, 1420, en), 1120, km), 290, 1.6], [960, lerp(lerp(-220, 150, en), 230, km), 1.9]];
  if (rain > 0) h += spRain(t, 640, 1290, 360, 880, 46, rain);
  c.forEach(([x, y, s], i) => h += spCloud(x, y + Math.sin(t * 1.3 + i) * 6, s, col));
  if (lt > tW) { const k = qdK(tW, tW + 0.6, lt) * (1 - km); // 바람과 습기: 구름이 모이는 까닭
    h += `<g opacity="${spOp(k)}" fill="none" stroke="#8FA3E0" stroke-width="8" stroke-linecap="round"><path d="M240 520 Q420 470 560 500"/><path d="M530 478 L562 500 L528 522"/><path d="M1700 500 Q1520 450 1380 480"/><path d="M1410 458 L1378 480 L1412 502"/></g>`; }
  h += qShadow(430, 932, 60, 0.6) + SPZ({ x: 430, y: 930, s: 0.78, t, pose: Object.assign({}, P['서기'], { armR: [[252, 285], [320, 300], [372, 268]], hR: [380, 264] }), ex: fEx('z기본'), look: [0.7, -0.6], seed: 14 });
  let over = '';
  if (lt > tW && lt < tM) over += pop(t, t - lt + tW + 0.2, t - lt + tM, 330, 420, label(0, 0, '바람', { size: 38, bg: '#fff' }), { rot: -4, bob: 2 }) + pop(t, t - lt + tW + 0.5, t - lt + tM, 1590, 400, label(0, 0, '습기', { size: 38, bg: '#fff' }), { rot: 4, bob: 2 });
  return spDefs() + qCam(qLerpCam(lt / D, [960, 560, 1.0], [960, 540, 1.08]), h) + over;
}

/* ---------- 10. 일기도: 작년 그날 밤, 제로의 날씨 ---------- */
const SM = { c: [[600, 380, '오픈 전날의 장애'], [1320, 380, '처음 맡은 오픈'], [960, 250, '무슨 말을 해야 할지']], from: [[-280, 380], [2200, 380], [960, -220]], to: [[810, 410], [1110, 410], [960, 340]] };
function spMapArt(t, o = {}) {
  const c = o.c || [0, 0, 0], mg = o.merge || 0, hide = o.hide || 0;
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#DCEBFA"/>`;
  for (let i = 0; i < 14; i++) h += `<line x1="${i * 160 - 80}" y1="-300" x2="${i * 160 - 80}" y2="1400" stroke="#C6DAF2" stroke-width="3"/>`;
  for (let i = 0; i < 9; i++) h += `<line x1="-400" y1="${i * 160 - 20}" x2="2400" y2="${i * 160 - 20}" stroke="#C6DAF2" stroke-width="3"/>`;
  [[520, 300], [380, 210], [250, 130]].forEach(([rx, ry]) => h += `<ellipse cx="960" cy="720" rx="${rx}" ry="${ry}" fill="none" stroke="#A9C1E8" stroke-width="5" stroke-dasharray="18 14"/>`);
  h += label(960, 92, '작년 그날 밤, 제로의 날씨', { size: 46, bg: '#fff' });
  // 책상과 모니터, 그 뒤의 제로
  const zx = lerp(900, 1046, hide), zy = lerp(960, 1010, hide), sh = hide > 0.6 ? Math.sin(t * 30) * 2 : 0;
  h += ZWORK({ x: zx + sh, y: zy, s: 0.62, t, pose: hide > 0.5 ? '웅크림' : '서기', ex: fEx(hide > 0.5 ? 'z울먹' : 'z멍'), look: hide > 0.5 ? [0, 0.6] : [0.5, 0.3], seed: 3 });
  h += `<rect x="740" y="800" width="440" height="30" rx="8" fill="#E3BF96" stroke="${INK}" stroke-width="7"/><rect x="770" y="830" width="380" height="230" fill="#C99F74" stroke="${INK}" stroke-width="7"/>`;
  h += `<g opacity="${spOp(lerp(1, 0.32, hide))}"><rect x="1036" y="770" width="20" height="32" fill="#8D93A6" stroke="${INK}" stroke-width="5"/><rect x="966" y="660" width="160" height="114" rx="10" fill="#27304F" stroke="${INK}" stroke-width="7"/><path d="M1046 684 L1084 748 L1008 748 Z" fill="#E5484D" stroke="#fff" stroke-width="5" stroke-linejoin="round" opacity="${spOp(0.6 + 0.4 * Math.sin(t * 6))}"/></g>`;
  if (o.rain) h += spRain(t, 770, 1150, 470, 800, 34, o.rain);
  // 구름 셋
  SM.c.forEach(([x, y, lb], i) => { const k = easeOut(clamp(c[i], 0, 1)); if (k <= 0) return; const px = lerp(lerp(SM.from[i][0], x, k), SM.to[i][0], mg), py = lerp(lerp(SM.from[i][1], y, k), SM.to[i][1], mg) + Math.sin(t * 1.2 + i * 2) * 5;
    h += spCloud(px, py, 1.55, mg > 0.5 ? '#C6CDE8' : '#fff');
    const ic = i === 0 ? `<path d="M0 -30 L34 26 L-34 26 Z" fill="#E5484D" stroke="#fff" stroke-width="5" stroke-linejoin="round"/><rect x="-4" y="-8" width="8" height="20" rx="3" fill="#fff"/><circle cx="0" cy="19" r="4" fill="#fff"/>`
      : i === 1 ? `<rect x="-44" y="-30" width="88" height="56" rx="6" fill="#fff" stroke="${INK}" stroke-width="5"/><line x1="-28" y1="-10" x2="28" y2="-10" stroke="#E5484D" stroke-width="6"/><line x1="-28" y1="8" x2="12" y2="8" stroke="${SP_INKBLUE}" stroke-width="5"/>`
      : `<path d="M-46 -26 Q-46 -40 -30 -40 L30 -40 Q46 -40 46 -26 L46 2 Q46 16 30 16 L-8 16 L-26 34 L-22 16 L-30 16 Q-46 16 -46 2 Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle cx="-20" cy="-12" r="5" fill="${INK}"/><circle cx="0" cy="-12" r="5" fill="${INK}"/><circle cx="20" cy="-12" r="5" fill="${INK}"/>`;
    h += `<g transform="translate(${f1(px)} ${f1(py - 34)})" opacity="${spOp(k * (1 - mg * 0.6))}">${ic}</g>`;
    if (mg < 0.4 && k > 0.8) h += `<g opacity="${spOp((k - 0.8) * 5 * (1 - mg * 2.5))}">${label(px, py + 92, lb, { size: 36, bg: '#fff' })}</g>`; });
  return h; }
function spmapScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 10;
  if (ph === 0) { const k = easeInOut(qdK(0.6, 1.7, lt)), cam = qLerpCam(easeInOut(qdK(0.3, 3.0, lt)), [960, 520, 1.12], [960, 404, 1.76]);
    const scr = `<g opacity="${spOp(1 - k)}">${spScreenFilm(spTieInsert(9))}</g><g opacity="${spOp(k)}">${spScreenFilm(spMapArt(t, {}))}</g>`;
    return spDefs() + qCam(cam, spTheater(t, scr, { on: 1 })); }
  if (ph === 1) { const ts = [fAt(a, '오픈', D * 0.25) - 0.25, fAt(a, '처음', D * 0.45) - 0.25, fAt(a, '친구의', D * 0.72) - 0.25];
    return spDefs() + qCam(qLerpCam(lt / D, [960, 560, 1.0], [960, 575, 1.06]), spMapArt(t, { c: ts.map(x => qdK(x, x + 1.3, lt)) })) + fFull('#FFF6DC', Math.max(0, 1 - lt / 0.4) * 0.6); }
  const tR = fAt(a, '비가', 2.6) - 0.5, tD = fAt(a, '마감은', D * 0.42) - 0.15, tH = fAt(a, '뒤에', D * 0.62) - 0.3;
  const mg = easeInOut(qdK(0.2, Math.max(1.0, tR), lt)), hide = easeInOut(qdK(tH, tH + 1.2, lt)), zk = easeInOut(qdK(tH - 0.2, tH + 1.8, lt));
  const cam = [lerp(960, 1000, zk), lerp(575, 800, zk), lerp(1.06, 1.85, zk)];
  let over = ''; if (lt > tD && lt < tH) over += pop(t, t - lt + tD, t - lt + tH, 1330, 640, label(0, 0, '마감은 진짜', { size: 42, bg: '#FFE0E0' }), { rot: 3, bob: 2 });
  return spDefs() + qCam(cam, spMapArt(t, { c: [1, 1, 1], merge: mg, rain: qdK(tR, tR + 0.8, lt), hide })) + over;
}

/* ---------- 11. 객석에서: "나, 무서웠구나" / 같은 장면이 다르게 보인다 ---------- */
function spth2Scene(t, lt, a) {
  const ph = a.ph, D = a._dur || 4;
  if (ph === 0) { E['_spt4'] = qTalk('z울먹', env(t) * 0.8); const nod = lt > D - 1.2 ? Math.max(0, Math.sin((lt - (D - 1.2)) * 7)) * 5 : 0;
    return spDefs() + qCam(qLerpCam(lt / D, [960, 610, 1.14], [960, 620, 1.26]), spSeatFront(t, { ex: fEx('_spt4'), look: [0, -0.4 + nod * 0.08], tilt: nod })); }
  const tC = fAt(a, '다만', D * 0.5) - 0.2, k = qdK(tC, tC + 1.2, lt);
  let scr = spScreenFilm(spTieInsert(9)) + `<rect x="430" y="118" width="1060" height="566" fill="#B9B4D8" opacity=".16"/>`;
  [[610, 196, 1.5], [960, 170, 1.7], [1310, 196, 1.5]].forEach(([x, y, s], i) => scr += `<g opacity="${spOp(k * 0.6)}" transform="translate(0 ${f1((1 - k) * -40)})">${spCloud(x, y + Math.sin(t + i) * 4, s, '#D8D4F0')}</g>`);
  return spDefs() + qCam(qLerpCam(lt / D, [960, 570, 1.0], [960, 500, 1.15]), spTheater(t, scr, { on: 1 }));
}

/* ---------- 12. 2016년의 연구 ---------- */
function spstudyScene(t, lt, a) {
  const D = a._dur || 16, tL = fAt(a, '연구는', 1.6) - 0.8, tK = fAt(a, '너그러운', D * 0.45) - 0.3, tA = fAt(a, '받아들였고', D * 0.72) - 0.4, tI = fAt(a, '나아지고', D * 0.86) - 0.2;
  let h = spPaper(), front = '';
  [300, 520, 740, 1180, 1400, 1620].forEach((x, i) => { const R = i >= 3, y = 900, s = 0.58, up = R ? easeInOut(qdK(tA, tA + 0.8, lt)) : 0;
    h += PPL({ x, y, s, t, pose: '서기', ex: fEx(R && lt > tA ? 'z빵긋' : 'z멍'), look: [0, R && lt > tA ? -0.2 : 0.7], tilt: lerp(9, 0, up) * (i % 2 ? 1 : -1), seed: 30 + i, vest: R ? '#F2C9A8' : '#B9C0D6' });
    front += `<rect x="${x - 96}" y="800" width="192" height="24" rx="7" fill="#E3BF96" stroke="${INK}" stroke-width="6"/><rect x="${x - 80}" y="824" width="160" height="130" fill="#C99F74" stroke="${INK}" stroke-width="6"/><rect x="${x - 34}" y="784" width="68" height="18" rx="3" fill="#fff" stroke="${INK}" stroke-width="4" transform="rotate(-4 ${x} 793)"/>`;
    if (R && lt > tK + (i - 3) * 0.2) { const k = easeOutBack(qdK(tK + (i - 3) * 0.2, tK + 0.4 + (i - 3) * 0.2, lt)); front += `<g transform="translate(${x + 44} 772) scale(${f1(k * 1000) / 1000})"><path d="M0 14 C-34 -18 -16 -40 0 -20 C16 -40 34 -18 0 14Z" fill="#F08BA0" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>`; }
    if (R && lt > tI + (i - 3) * 0.18) { const k = easeOutBack(qdK(tI + (i - 3) * 0.18, tI + 0.45 + (i - 3) * 0.18, lt)), top = spPt(x, y, s, 200, 44); front += `<g transform="translate(${f1(top[0])} ${f1(top[1])}) scale(${f1(k * 1000) / 1000})"><path d="M0 0 L0 -34" stroke="#3E8E5A" stroke-width="7" stroke-linecap="round"/><path d="M0 -30 Q-34 -44 -40 -74 Q-8 -70 0 -30 Z M0 -30 Q34 -44 40 -74 Q8 -70 0 -30 Z" fill="#7CCB8E" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>`; } });
  h += front;
  let over = pop(t, t - lt + Math.max(0.3, tL), t + 99, 960, 130, label(0, 0, '2016년 · 후회를 다시 떠올리게 한 연구', { size: 44, bg: '#fff' }), { rot: -2, bob: 2 });
  if (lt > tK) over += pop(t, t - lt + tK, t + 99, 1450, 330, label(0, 0, '자기에게 너그러운 눈으로', { size: 40, bg: '#FFE3EA' }), { rot: 2, bob: 3 }) + pop(t, t - lt + tK + 0.2, t + 99, 470, 330, label(0, 0, '평소대로', { size: 40, bg: '#E6EAF6' }), { rot: -2, bob: 3 });
  return spDefs() + qCam(qLerpCam(lt / D, [960, 650, 1.28], [985, 655, 1.38]), h) + over;
}

/* ---------- 13. 화면 속 자기 어깨에 손을 얹는다 ---------- */
function sphugScene(t, lt, a) {
  const D = a._dur || 5.4, up = easeInOut(qdK(3.7, 4.4, lt)), ck = qdK(0.3, 1.1, lt), soft = easeInOut(qdK(4.3, 5.3, lt));
  let cl = ''; [[540, 652], [640, 590], [742, 652]].forEach(([x, y], i) => cl += spCloud(x, y - soft * 34 + Math.sin(t * 1.4 + i) * 4, 0.62, '#C6CDE8', ck * lerp(0.9, 0.3, soft)));
  const film = spOfficeArt(t, { zero: spOfficeZero(t, { phone: 0, typing: true, ex: { expr: 'z멍', prev: 'z멍', k: 1, blink: 0.4 }, look: [0.7, 0.3], tilt: 5 }), front: cl });
  const rise = easeInOut(qdK(0.9, 1.5, lt)) * 70, gone = lt > 1.5, wk = easeInOut(qdK(1.5, 3.6, lt)), x = lerp(380, 630, wk), y = lerp(950, 860, wk), s = 0.9, walking = wk < 1;
  let mid = '';
  if (gone) { const pose = walking ? walkPose((lt - 1.5) * 6.5, 0.7) : Object.assign({}, P['서기'], { armR: [[252, 285], [lerp(278, 300, up), lerp(345, 240, up)], [lerp(284, 326, up), lerp(398, 198, up)]], hR: [lerp(286, 330, up), lerp(406, 190, up)] });
    const by = y - (walking ? Math.abs(Math.sin((lt - 1.5) * 6.5)) * 8 : 0);
    mid = QZ({ x, y: by, s, t, pose, ex: fEx('z멍'), seed: 3, still: true }) + spBackHead(x, by, s);
    if (up > 0.9) { const p = spPt(x, by, s, 330, 190); mid += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(50 + 6 * Math.sin(t * 3))}" fill="url(#spCandle)" opacity="${spOp((up - 0.9) * 10 * 0.7)}"/>` + hand(p[0], p[1], 0.75); } }
  const zk = easeInOut(qdK(1.0, 3.8, lt)), cam = [lerp(960, 850, zk), lerp(600, 545, zk), lerp(1.0, 1.42, zk)];
  return spDefs() + qCam(cam, spTheater(t, spScreenFilm(film), { on: 1, noZero: gone, rise, mid })) + fFull('#FFE9C0', soft * 0.12);
}

/* ---------- 14. 영사기를 돌리던 손이 멈춘다 ---------- */
function spbooth2Scene(t, lt, a) {
  const D = a._dur || 9, tS = fAt(a, '멈춥니다', 2.6) - 0.4, tO = fAt(a, '다른', D * 0.8) - 0.3;
  const rot = 140 * (t - Math.max(0, lt - tS)), off = easeInOut(qdK(tS, tS + 0.9, lt)), beam = 1 - qdK(tS + 0.3, tS + 1.6, lt), tu = easeInOut(qdK(tO, tO + 0.8, lt));
  const art = spBooth(t, 99, { full: true, rot, off, beam, ex: lt > tO ? fEx('z기본') : { expr: 'z멍', prev: 'z멍', k: 1, blink: 0.3 }, look: [lerp(-0.8, 0.7, tu), lerp(-0.2, -0.3, tu)] });
  return spDefs() + qCam(qLerpCam(lt / D, [900, 650, 1.25], [1060, 640, 1.5]), art);
}

/* ---------- 15. 문자: 제로 시점(두 손 + 기기) ---------- */
const SP_MSG = ['태호야, 자냐.', '작년에 아버님 가실 때', '못 간 거, 계속 마음에 걸렸다.', '미안하다.'];
function sptextScene(t, lt, a) {
  const total = SP_MSG.join('').length, n = Math.floor(clamp((lt - 0.6) / 3.7, 0, 1) * total), sent = lt > 4.9, sk = easeOut(qdK(4.9, 5.3, lt));
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#B4C0F0"/><path d="M-400 300 Q500 200 1100 320 Q1700 420 2400 300" fill="none" stroke="#fff" stroke-width="10" opacity=".35"/><path d="M-400 820 Q600 720 1300 860 Q1900 960 2400 840" fill="none" stroke="#9AA8E0" stroke-width="12" opacity=".6"/><path d="M1100 -300 L1700 -300 L900 1400 L300 1400 Z" fill="#fff" opacity=".1"/>`;
  let p = `<rect x="-330" y="-500" width="660" height="1000" rx="64" fill="#1F2D44" stroke="${INK}" stroke-width="10"/><rect x="-306" y="-476" width="612" height="952" rx="44" fill="#F4F6FC"/><rect x="-306" y="-476" width="612" height="120" rx="44" fill="#E3E8F6"/><rect x="-306" y="-400" width="612" height="44" fill="#E3E8F6"/><circle cx="-236" cy="-416" r="34" fill="#C2C9DC" stroke="${INK}" stroke-width="5"/>` + fT(-180, -398, '태호', 50, SP_INKBLUE, { anchor: 'start' });
  const lines = (cnt) => { let out = [], left = cnt; SP_MSG.forEach(s => { if (left > 0) { out.push(s.slice(0, left)); left -= s.length; } }); return out; };
  if (!sent) { const ls = lines(n), hh = Math.max(1, ls.length) * 56 + 40; p += `<rect x="-280" y="${440 - hh}" width="560" height="${hh}" rx="30" fill="#fff" stroke="#C2C9DC" stroke-width="5"/>`;
    ls.forEach((s, i) => p += fT(-250, 440 - hh + 62 + i * 56, s, 38, SP_INKBLUE, { anchor: 'start' }));
    if (n < total && Math.sin(t * 9) > 0) { const last = ls.length ? ls[ls.length - 1] : ''; p += `<rect x="${-250 + last.length * 35 + 4}" y="${440 - hh + 30 + Math.max(0, ls.length - 1) * 56}" width="4" height="40" fill="${SP_INKBLUE}"/>`; }
  } else { const hh = 4 * 56 + 44, y0 = lerp(440 - hh, -300, sk);
    p += `<rect x="-250" y="${f1(y0)}" width="530" height="${hh}" rx="34" fill="#FFE9A8" stroke="${INK}" stroke-width="6"/>`; SP_MSG.forEach((s, i) => p += fT(-222, y0 + 64 + i * 56, s, 38, SP_INKBLUE, { anchor: 'start' }));
    p += `<g opacity="${spOp(qdK(5.3, 5.6, lt))}">${fT(250, y0 + hh + 44, '보냄 ✓', 30, '#7C86A8', { anchor: 'end' })}</g><rect x="-280" y="360" width="560" height="80" rx="30" fill="#fff" stroke="#C2C9DC" stroke-width="5"/>`; }
  h += `<g transform="translate(960 560) rotate(-2)">${p}</g>`;
  [[-1, 610], [1, 1310]].forEach(([sd, x]) => h += `<path d="M${x + sd * 330} 1400 Q${x + sd * 200} 1080 ${x + sd * 40} 1000 L${x - sd * 30} 1090 Q${x + sd * 60} 1220 ${x + sd * 150} 1400 Z" fill="#8FB3E8" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><ellipse cx="${x}" cy="1020" rx="62" ry="52" fill="#fff" stroke="${INK}" stroke-width="9"/>`);
  return spDefs() + qCam(qLerpCam(lt / 6.4, [960, 560, 1.0], [960, 550, 1.05]), h) + (sent ? fFull('#FFF6DC', Math.max(0, 1 - (lt - 4.9) / 0.5) * 0.15) : '');
}

/* ---------- 16. 창밖: 그건 태호의 날씨 ---------- */
function spwindowScene(t, lt, a) {
  const D = a._dur || 7, tT = fAt(a, '태호의', D * 0.7) - 0.3, g = qdK(tT, tT + 0.8, lt);
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#7482D6"/><ellipse cx="960" cy="900" rx="1500" ry="520" fill="#C9B8F0" opacity=".75"/>`;
  h += `<circle cx="430" cy="250" r="150" fill="url(#spScreenGlow)"/><circle cx="430" cy="250" r="66" fill="#FFF8DC" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 16; i++) h += `<g opacity="${spOp(0.5 + 0.5 * Math.sin(t * 2 + i))}">${zStar(140 + (i * 211) % 1700, 90 + (i * 83) % 330, 8, '#fff', 0)}</g>`;
  h += `<path d="M-400 760 Q400 640 1000 730 Q1600 800 2400 690 L2400 1400 L-400 1400 Z" fill="#8C8ADB"/>`;
  [[250, 0], [520, 1], [820, 2], [1110, 1], [1400, 3], [1690, 0]].forEach(([x, k], i) => { const w = 200 + (i % 2) * 40, hh = 150 + (i * 37) % 60, y = 800, me = k === 3;
    h += `<rect x="${x - w / 2}" y="${y - hh}" width="${w}" height="${hh + 300}" fill="${['#E8DDF5', '#F3E3D3', '#D9E6F5', '#EDE6F7'][k]}" stroke="${INK}" stroke-width="7"/><path d="M${x - w / 2 - 22} ${y - hh} L${x} ${y - hh - 90} L${x + w / 2 + 22} ${y - hh} Z" fill="${['#B5475A', '#5E6B8C', '#8E86CC', '#6C7BB8'][k]}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    h += `<rect x="${x - 34}" y="${y - hh + 40}" width="68" height="64" rx="6" fill="${me ? '#4B5596' : '#FFE9A8'}" stroke="${INK}" stroke-width="6"/><line x1="${x}" y1="${y - hh + 40}" x2="${x}" y2="${y - hh + 104}" stroke="${INK}" stroke-width="4"/>`; });
  h += `<circle cx="${f1(1400 + Math.sin(t * 0.5) * 30)}" cy="430" r="${f1(170 * g)}" fill="url(#spScreenGlow)" opacity="${spOp(g * 0.9)}"/>` + spCloud(1400 + Math.sin(t * 0.5) * 30, 440, 1.25, '#EEE9FF') + spCloud(560 + Math.sin(t * 0.4 + 2) * 24, 480, 0.8, '#DAD6F5', 0.8);
  // 창틀과 커튼(앞)
  h += `<path d="M-400 -300 H2400 V1400 H-400 Z M150 90 V990 H1770 V90 Z" fill="#F4EFE6" fill-rule="evenodd" stroke="${INK}" stroke-width="10"/><line x1="960" y1="90" x2="960" y2="990" stroke="${INK}" stroke-width="22"/><line x1="960" y1="90" x2="960" y2="990" stroke="#F4EFE6" stroke-width="12"/>`;
  [-1, 1].forEach(sd => h += `<path d="M${960 + sd * 900} 40 Q${960 + sd * 760} 500 ${960 + sd * 830} 1040 L${960 + sd * 1100} 1040 L${960 + sd * 1100} 40 Z" fill="#D9D2F2" stroke="${INK}" stroke-width="8" opacity=".95"/>`);
  return spDefs() + qCam(qLerpCam(lt / D, [960, 560, 1.0], [1150, 540, 1.22]), h);
}

/* ---------- 17. 극장의 불이 꺼지고, 잠든다 ---------- */
function spbed2Scene(t, lt, a) {
  const ph = a.ph, D = a._dur || 3.6; let ex, cam, extra = '';
  const phone = `<g transform="translate(1196 918) rotate(12)"><rect x="-34" y="-58" width="68" height="116" rx="12" fill="#1F2D44" stroke="${INK}" stroke-width="6"/><circle cx="-14" cy="-38" r="6" fill="#3B4A66"/></g>`;
  if (ph === 0) { const cl = easeInOut(qdK(0.5, 2.0, lt)), away = easeIn(qdK(2.2, 3.1, lt));
    ex = { expr: 'z기본', prev: 'z멍', k: qdK(0.6, 1.4, lt), blink: qdK(1.9, 2.9, lt) }; cam = qLerpCam(lt / D, [940, 655, 1.3], [960, 630, 1.12]);
    // 머리 위 작은 극장: 막이 닫히고 불이 꺼진다
    extra = `<g transform="translate(960 372) scale(${f1((1 - away) * 0.8 * 1000) / 1000})" opacity="${spOp(1 - away)}"><clipPath id="spMini"><circle r="150"/></clipPath><circle r="158" fill="#fff" stroke="${INK}" stroke-width="8"/><g clip-path="url(#spMini)"><rect x="-160" y="-160" width="320" height="320" fill="${SP_WALL}"/><rect x="-104" y="-80" width="208" height="130" rx="8" fill="#FFF8E7" stroke="${SP_GOLD}" stroke-width="8" opacity="${spOp(1 - cl * 0.7)}"/><rect x="${f1(-160 - 10)}" y="-160" width="${f1(60 + cl * 112)}" height="320" fill="#B5384E" stroke="${INK}" stroke-width="6"/><rect x="${f1(100 - cl * 112 + 10)}" y="-160" width="${f1(60 + cl * 112)}" height="320" fill="#B5384E" stroke="${INK}" stroke-width="6"/><rect x="-160" y="-160" width="320" height="320" fill="#3A2F44" opacity="${spOp(cl * 0.5)}"/></g></g><circle cx="${f1(960 - 50 * (1 - away))}" cy="${f1(520 + away * 20)}" r="${f1(12 * (1 - away))}" fill="#fff" stroke="${INK}" stroke-width="5"/>`; }
  else { ex = { expr: 'z기본', prev: 'z기본', k: 1, blink: 1 }; cam = qLerpCam(lt / D, [960, 630, 1.12], [960, 600, 1.0]);
    const mx = 500 + lt * 26; extra = `<path d="M${f1(mx)} 760 L${f1(mx + 220)} 760 L${f1(mx + 60)} 1160 L${f1(mx - 200)} 1160 Z" fill="#fff" opacity=".13"/>`; }
  return spDefs() + qdPlate('bedmoon', cam, 0.6) + qCam(cam, spBedArt(t, { ex, look: [-0.3, 0.2], tilt: -8, dx: -12 }) + phone + extra);
}

/* ---------- 18. 아침, 답장 ---------- */
function spmornScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 4.6, X = 960, Y = 1030, s = 0.95;
  let ex, look, hold, face = 0, cam, over = '';
  if (ph === 0) { hold = easeInOut(qdK(1.6, 2.4, lt)); const op = qdK(1.0, 1.4, lt);
    ex = lt < 2.4 ? { expr: 'z멍', prev: 'z기본', k: op, blink: 1 - op } : lt < 3.3 ? fEx('z멍') : lt < 4.0 ? { expr: 'z울먹', prev: 'z멍', k: qdK(3.3, 3.6, lt), blink: 0 } : { expr: 'z빵긋', prev: 'z울먹', k: qdK(4.0, 4.3, lt), blink: 0 };
    look = lt < 1.6 ? [0.8, 0.6] : [0, 0.8]; face = qdK(2.3, 2.7, lt); cam = qLerpCam(lt / D, [960, 640, 1.05], [960, 665, 1.3]);
    if (lt > 0.45 && lt < 1.5) over += qdFx(t, lt, 0.45, 1.5, 1290, 700, '띵', '#F5C451', { size: 46 }); }
  else { E['_spm'] = qTalk('z빵긋', env(t)); ex = fEx('_spm'); look = [0.1, -0.7]; hold = 1; face = 0.4; cam = qLerpCam(lt / D, [960, 665, 1.3], [960, 650, 1.4]); }
  let w = `<rect x="600" y="420" width="720" height="320" rx="44" fill="#8E86CC" stroke="${INK}" stroke-width="9"/><rect x="630" y="448" width="660" height="40" rx="16" fill="#A8A0E0"/><ellipse cx="${X}" cy="632" rx="236" ry="72" fill="#F4F6FC" stroke="${INK}" stroke-width="8"/>`;
  const pose = Object.assign({}, P['서기'], { armR: [[252, 285], [lerp(278, 292, hold), lerp(345, 348, hold)], [lerp(284, 238, hold), lerp(398, 344, hold)]], hR: [lerp(286, 232, hold), lerp(406, 340, hold)], armL: [[148, 285], [lerp(122, 108, hold), lerp(345, 348, hold)], [lerp(116, 162, hold), lerp(398, 344, hold)]], hL: [lerp(114, 168, hold), lerp(406, 340, hold)] });
  w += QZ({ x: X, y: Y, s, t, pose, ex, look, tilt: ph === 1 ? -4 : 2, seed: 3, still: true });
  w += `<path d="M556 886 Q${X} 846 1364 886 L1396 1180 L524 1180 Z" fill="#B4C0F0" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M610 926 Q${X} 892 1310 926" fill="none" stroke="#fff" stroke-width="8" opacity=".45"/>`;
  const hp = spPt(X, Y, s, 200, 344), px = lerp(1196, hp[0], hold), py = lerp(950, hp[1], hold), pr = lerp(12, 0, hold);
  if (face > 0) { const f = spPt(X, Y, s, 200, 190); w += `<circle cx="${f1(f[0])}" cy="${f1(f[1] + 30)}" r="190" fill="url(#spScreenGlow)" opacity="${spOp(face * 0.22)}"/>`; }
  w += `<g transform="translate(${f1(px)} ${f1(py)}) rotate(${f1(pr)})"><rect x="-38" y="-62" width="76" height="124" rx="13" fill="#1F2D44" stroke="${INK}" stroke-width="6"/><circle cx="-16" cy="-40" r="6" fill="#3B4A66"/></g>`;
  if (hold > 0.9) w += hand(px - 40, py + 26, 0.75) + hand(px + 40, py + 26, 0.75);
  w += `<g transform="translate(452 430) rotate(-2)"><rect x="-84" y="-100" width="168" height="200" rx="8" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="-84" y="-100" width="168" height="40" rx="8" fill="#E5737F" stroke="${INK}" stroke-width="6"/><circle cx="60" cy="56" r="15" fill="none" stroke="#E5484D" stroke-width="5"/></g>`;
  return spDefs() + qdPlate('bedmorn', cam, 0.6) + qCam(cam, w) + over;
}

/* ---------- 19. 태호의 극장 ---------- */
function spHallArt(t) { // 그날 새벽, 장례식장 복도 의자. 빈소 안은 보이지 않는다.
  let h = `<rect x="-200" y="-200" width="2400" height="1100" fill="#EEF1F8"/><rect x="-200" y="880" width="2400" height="500" fill="#D3D8E6"/><line x1="-200" y1="880" x2="2200" y2="880" stroke="${INK}" stroke-width="7"/>`;
  h += `<rect x="170" y="160" width="420" height="420" rx="8" fill="#6877C4" stroke="${INK}" stroke-width="9"/><line x1="380" y1="160" x2="380" y2="580" stroke="${INK}" stroke-width="7"/>` + [0, 1, 2, 3, 4].map(i => zStar(230 + i * 78, 230 + (i * 67) % 240, 7, '#fff', 0)).join('');
  h += `<g transform="translate(1560 250)"><circle r="74" fill="#fff" stroke="${INK}" stroke-width="8"/><line x1="0" y1="0" x2="40" y2="0" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><line x1="0" y1="0" x2="0" y2="-58" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle r="7" fill="${INK}"/></g>`;
  h += `<rect x="620" y="800" width="900" height="34" rx="10" fill="#B9794A" stroke="${INK}" stroke-width="8"/><rect x="680" y="834" width="26" height="130" fill="#9C6238" stroke="${INK}" stroke-width="6"/><rect x="1434" y="834" width="26" height="130" fill="#9C6238" stroke="${INK}" stroke-width="6"/><rect x="620" y="640" width="900" height="30" rx="10" fill="#B9794A" stroke="${INK}" stroke-width="8"/>`;
  const tx = 980, ty = 968, ts = 0.92, lap = spPt(tx, ty, ts, 250, 396);
  h += `<circle cx="${f1(lap[0])}" cy="${f1(lap[1] - 90)}" r="${f1(210 + 10 * Math.sin(t * 2))}" fill="url(#spScreenGlow)" opacity=".8"/>`;
  h += TH({ x: tx, y: ty, s: ts, t, pose: 'f앉기', ex: fEx('z멍'), look: [0.3, 0.8], tilt: 7, seed: 8, still: true });
  h += `<g transform="translate(${f1(lap[0])} ${f1(lap[1] - 30)}) rotate(-8)"><rect x="-24" y="-44" width="48" height="84" rx="9" fill="#1F2D44" stroke="${INK}" stroke-width="5"/></g>`;
  // 긴 문자(글자는 읽을 수 없게)
  h += `<g transform="translate(1340 420) rotate(3)"><path d="M-190 -170 H190 Q214 -170 214 -146 V150 Q214 174 190 174 H-90 L-150 226 L-140 174 H-190 Q-214 174 -214 150 V-146 Q-214 -170 -190 -170 Z" fill="#FFF6DC" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="-170" y="${-134 + i * 40}" width="${[330, 300, 340, 260, 320, 290, 150][i]}" height="16" rx="8" fill="#C9C2A8"/>`).join('')}</g>` + label(1210, 220, '제로', { size: 38, bg: '#FFE9A8' });
  return h; }
function spth3Scene(t, lt, a) {
  const D = a._dur || 8; let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#52729A"/><circle cx="960" cy="400" r="900" fill="url(#spScreenGlow)" opacity=".8"/>`;
  [-1, 1].forEach(sd => { h += `<path d="M${960 + sd * 1300} -200 L${960 + sd * 610} -200 Q${960 + sd * 660} 400 ${960 + sd * 600} 900 L${960 + sd * 1300} 900 Z" fill="#3F7F92" stroke="${INK}" stroke-width="8"/>`; for (let i = 0; i < 4; i++) h += `<path d="M${960 + sd * (700 + i * 140)} -200 Q${960 + sd * (730 + i * 140)} 400 ${960 + sd * (690 + i * 140)} 900" fill="none" stroke="#2F6577" stroke-width="7"/>`; });
  h += `<rect x="404" y="92" width="1112" height="618" rx="26" fill="${SP_GOLD}" stroke="${INK}" stroke-width="9"/><rect x="430" y="118" width="1060" height="566" rx="14" fill="#FFF8E7" stroke="${INK}" stroke-width="7"/><g clip-path="url(#spScr)">${spScreenFilm(spHallArt(t))}</g>`;
  h += label(960, 52, '태호의 극장 · 상영작: 새벽 3시에 온 문자', { size: 38, bg: '#FFF2C2' });
  const seat = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-96" y="-120" width="192" height="230" rx="40" fill="#5FA3B0" stroke="${INK}" stroke-width="8"/><path d="M-70 -92 Q0 -112 70 -92" fill="none" stroke="#9CD0D8" stroke-width="10" stroke-linecap="round"/></g>`;
  for (let i = 0; i < 9; i++) h += seat(240 + i * 180, 860, 0.8);
  h += TH({ x: 960, y: 1240, s: 1.0, t, pose: '서기', ex: fEx('z멍'), seed: 8, still: true }) + spBackHead(960, 1240, 1.0);
  for (let i = 0; i < 7; i++) h += seat(120 + i * 280, 1130, 1.25);
  return spDefs() + qCam(qLerpCam(lt / D, [960, 600, 1.0], [960, 480, 1.2]), h) + fFull('#FFF6DC', Math.max(0, 1 - lt / 0.5) * 0.5);
}

/* ---------- 20. 첫 기일, 언덕길 ---------- */
const spMum = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><path d="M0 0 L8 120" stroke="#3E8E5A" stroke-width="9" stroke-linecap="round"/><path d="M4 60 Q40 40 50 70 Q24 84 4 60Z" fill="#6DB37E" stroke="${INK}" stroke-width="4"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(r => `<ellipse cx="0" cy="-26" rx="13" ry="28" fill="#fff" stroke="${INK}" stroke-width="4" transform="rotate(${r})"/>`).join('')}<circle r="14" fill="#FFE9A8" stroke="${INK}" stroke-width="4"/></g>`;
const spSoju = (x, y, s, r = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${r}) scale(${f1(s * 1000) / 1000})"><rect x="-10" y="-96" width="20" height="34" rx="5" fill="#5FA873" stroke="${INK}" stroke-width="5"/><rect x="-12" y="-104" width="24" height="12" rx="4" fill="#3E7CC0" stroke="${INK}" stroke-width="4"/><path d="M-10 -64 Q-24 -52 -24 -30 V40 Q-24 50 -14 50 H14 Q24 50 24 40 V-30 Q24 -52 10 -64 Z" fill="#7CC68E" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="-24" y="-18" width="48" height="36" fill="#fff" stroke="${INK}" stroke-width="4"/></g>`;
function sphillScene(t, lt, a) {
  const D = a._dur || 5.0, B = lt > 1.9;
  if (!B) { const cam = qLerpCam(lt / 1.9, [960, 560, 1.0], [960, 570, 1.06]), adj = Math.sin(lt * 5) * 3, zs = 1.15, zx = 740, zy = 1210, tx = 1190;
    const zp = Object.assign({}, P['서기'], { armR: [[252, 285], [286, 340], [226 + adj, 318]], hR: [220 + adj, 314], armL: [[148, 285], [104, 340], [130, 392]], hL: [132, 400] });
    const tp = P['서기'];
    let w = ZSUIT({ x: zx, y: zy, s: zs, t, pose: zp, ex: fEx('z기본'), look: lt > 0.9 ? [0.7, -0.1] : [0.1, 0.7], seed: 3 }) + TH({ x: tx, y: zy, s: zs, t, pose: tp, ex: fEx('z히죽'), look: [-0.7, -0.1], seed: 8, collar: true, tie: '#15151C' });
    const b = spPt(zx, zy, zs, 132, 400), f = spPt(tx, zy, zs, 114, 406); w += spSoju(b[0] - 4, b[1] + 6, 1.0, -6) + spMum(f[0] - 34, f[1] - 112, 0.85) + spMum(f[0] + 22, f[1] - 126, 0.85) + spMum(f[0] - 8, f[1] - 150, 0.85);
    return spDefs() + qdPlate('hill', cam, 0.5) + qCam(cam, w) + fFull('#fff', Math.max(0, (lt - 1.65) / 0.25) * 0.9); }
  const k = easeInOut(qdK(1.9, D + 1.5, lt)), s = lerp(0.98, 0.5, k), zx = lerp(840, 1240, k), y = lerp(1120, 745, k), gap = 252 * s, ph = (lt - 1.9) * 6.0, cam = qLerpCam((lt - 1.9) / (D - 1.9), [960, 600, 1.0], [1080, 560, 1.12]);
  const pat = easeInOut(qdK(3.3, 3.7, lt)) * (1 - easeInOut(qdK(4.1, 4.5, lt))), zb = y - Math.abs(Math.sin(ph)) * 8 * s, tb = y - Math.abs(Math.sin(ph + 1.2)) * 8 * s;
  const tpz = walkPose(ph + 1.2, 0.7); const tp = Object.assign({}, tpz, pat > 0 ? { armL: [[148, 285], [lerp(122, 86, pat), lerp(345, 300, pat)], [lerp(116, 30, pat), lerp(398, 286, pat)]], hL: [lerp(114, 22, pat), lerp(406, 282, pat)] } : {});
  let w = qShadow(zx, y, 66 * s, 0.6) + qShadow(zx + gap, y, 66 * s, 0.6);
  w += ZSUIT({ x: zx, y: zb, s, t, pose: walkPose(ph, 0.7), ex: fEx('z멍'), seed: 3, still: true }) + spBackHead(zx, zb, s);
  w += TH({ x: zx + gap, y: tb, s, t, pose: tp, ex: fEx('z멍'), seed: 8, still: true }) + spBackHead(zx + gap, tb, s);
  const zh = spPt(zx, zb, s, 114, 406), th = spPt(zx + gap, tb, s, 286, 406);
  w += spSoju(zh[0], zh[1] + 30 * s, s * 0.9) + spMum(th[0] + 6 * s, th[1] - 110 * s, s * 0.8) + spMum(th[0] + 40 * s, th[1] - 130 * s, s * 0.8);
  return spDefs() + qdPlate('hill', cam, 0.5) + qCam(cam, w) + fFull('#fff', Math.max(0, 1 - (lt - 1.9) / 0.3) * 0.9);
}

/* ---------- 21. 벌 대신, 이해 ---------- */
function splens2Scene(t, lt, a) {
  const D = a._dur || 14, tU = fAt(a, '벌', D * 0.78) - 0.2, fl = Math.sin(t * 13) * 3 + Math.sin(t * 7.3) * 2, lk = easeInOut(qdK(0.5, 2.5, lt));
  let h = spPaper();
  h += `<rect x="150" y="170" width="250" height="360" rx="120" fill="#FFF1D0" stroke="${INK}" stroke-width="9"/><line x1="275" y1="170" x2="275" y2="530" stroke="${INK}" stroke-width="6"/><line x1="150" y1="360" x2="400" y2="360" stroke="${INK}" stroke-width="6"/>`;
  h += `<path d="M400 260 L742 640 L742 760 L400 440 Z" fill="#FFF3C4" opacity="${spOp(0.5 * lk)}"/><path d="M800 660 L1120 790 L900 790 L800 740 Z" fill="#FFF3C4" opacity="${spOp(0.6 * lk)}"/>`;
  const sx = 1220, sy = 950, s = 0.95;
  h += SPZ({ x: sx, y: sy, s, t, pose: '서기', ex: fEx(lt > 2.5 ? 'z빵긋' : 'z기본'), look: [-0.7, 0.1], seed: 14 });
  h += `<rect x="380" y="790" width="1180" height="44" rx="10" fill="#B9794A" stroke="${INK}" stroke-width="8"/><rect x="440" y="834" width="1060" height="400" fill="#9C6238" stroke="${INK}" stroke-width="8"/>`;
  h += `<rect x="540" y="700" width="40" height="90" rx="6" fill="#FFF8E7" stroke="${INK}" stroke-width="6"/><ellipse cx="560" cy="790" rx="56" ry="12" fill="#C9A04A" stroke="${INK}" stroke-width="6"/><path d="M560 692 q6 -14 -2 -26" fill="none" stroke="#9A9AA8" stroke-width="4" stroke-linecap="round" opacity=".6"/>`;
  h += `<ellipse cx="1010" cy="792" rx="${f1(120 * lk)}" ry="${f1(22 * lk)}" fill="#FFF6C8" opacity=".95"/><circle cx="1010" cy="770" r="${f1(230 * lk)}" fill="url(#spCandle)" opacity="${spOp(lk * 0.8)}"/>`;
  h += `<rect x="762" y="760" width="16" height="32" fill="#C9A04A" stroke="${INK}" stroke-width="5"/><ellipse cx="770" cy="792" rx="44" ry="10" fill="#C9A04A" stroke="${INK}" stroke-width="5"/><circle cx="770" cy="696" r="66" fill="#DCEBFA" opacity=".6"/><circle cx="770" cy="696" r="66" fill="none" stroke="${SP_GOLD}" stroke-width="10"/><circle cx="770" cy="696" r="72" fill="none" stroke="${INK}" stroke-width="4"/><path d="M736 668 q20 -24 46 -18" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`;
  let over = '';
  if (lt > tU) { const tI = fAt(a, '이해를', D - 1.5) - 0.2; over += `<g opacity="${spOp(qdK(tU, tU + 0.5, lt))}">${outlined(600, 300, ['벌 대신,'], { size: 80, sw: 15, fill: '#fff' })}</g>` + (lt > tI ? `<g opacity="${spOp(qdK(tI, tI + 0.6, lt))}">${outlined(600, 430, ['이해'], { size: 130, sw: 22, fill: '#FFE9A8' })}</g>` : ''); }
  return spDefs() + qCam(qLerpCam(lt / D, [960, 610, 1.24], [990, 600, 1.34]), h) + over;
}

/* ---------- 22. 동네의 밤: 지붕마다 다른 구름 ---------- */
function spTownArt(t, k) { // k: 0..1 (극장 불이 하나둘 꺼지는 정도)
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#7482D6"/><ellipse cx="960" cy="1000" rx="1700" ry="640" fill="#C9B8F0" opacity=".8"/><circle cx="1520" cy="210" r="170" fill="url(#spScreenGlow)"/><circle cx="1520" cy="210" r="64" fill="#FFF8DC" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 18; i++) h += `<g opacity="${spOp(0.5 + 0.5 * Math.sin(t * 2 + i))}">${zStar(100 + (i * 197) % 1740, 70 + (i * 71) % 300, 8, '#fff', 0)}</g>`;
  const cols = ['#E8DDF5', '#F3E3D3', '#D9E6F5', '#EDE6F7'], roofs = ['#B5475A', '#5E6B8C', '#8E86CC', '#6C7BB8'];
  for (let r = 0; r < 3; r++) { const y = 560 + r * 170, sc = 0.72 + r * 0.22, n = 7 - r;
    h += `<path d="M-400 ${y + 40} Q960 ${y - 30} 2400 ${y + 40} L2400 1500 L-400 1500 Z" fill="${['#8C8ADB', '#7F7FD4', '#7274CC'][r]}"/>`;
    for (let i = 0; i < n; i++) { const id = r * 10 + i, x = 150 + (i + (r % 2) * 0.5) * (1700 / n), w = 190 * sc, hh = (130 + hash(id) * 70) * sc, theater = hash(id + 3) > 0.45, off = theater && k > hash(id + 9) * 0.9;
      h += `<rect x="${f1(x - w / 2)}" y="${f1(y - hh)}" width="${f1(w)}" height="${f1(hh + 200)}" fill="${cols[id % 4]}" stroke="${INK}" stroke-width="6"/><path d="M${f1(x - w / 2 - 18)} ${f1(y - hh)} L${f1(x)} ${f1(y - hh - 80 * sc)} L${f1(x + w / 2 + 18)} ${f1(y - hh)} Z" fill="${roofs[id % 4]}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
      h += `<rect x="${f1(x - 30 * sc)}" y="${f1(y - hh + 34 * sc)}" width="${f1(60 * sc)}" height="${f1(56 * sc)}" rx="5" fill="${off ? '#59639F' : theater ? '#FFB7A8' : '#FFE9A8'}" stroke="${INK}" stroke-width="5"/>`;
      if (theater && !off) h += `<circle cx="${f1(x)}" cy="${f1(y - hh + 60 * sc)}" r="${f1(70 * sc)}" fill="url(#spScreenGlow)" opacity=".6"/>`;
      if (hash(id + 5) > 0.35) h += spCloud(x + Math.sin(t * 0.5 + id) * 10, y - hh - (150 + hash(id + 7) * 40) * sc, (0.42 + hash(id + 2) * 0.22) * sc * 1.2, ['#fff', '#EEE9FF', '#DAD6F5'][id % 3], 0.92); } }
  return h; }
function sptownScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 13;
  if (ph === 0) { const tW = fAt(a, '날씨를', D * 0.5) - 0.3; return spDefs() + qCam(qLerpCam(lt / D, [960, 640, 1.28], [960, 570, 1.02]), spTownArt(t, qdK(tW, D, lt) * 0.6)); }
  const k = qdK(0.3, 1.1, lt);
  return spDefs() + qCam(qLerpCam(lt / D, [960, 570, 1.02], [960, 560, 1.0]), spTownArt(t, 0.6 + qdK(0, D, lt) * 0.3)) + fFull('#2B2B55', 0.3 * k) + `<g opacity="${spOp(k)}">${outlined(960, 420, ['그날의 나를 다시 벌주기 전에,', '그날의 날씨를 알아주기.'], { size: 80, sw: 16, fill: '#FFF6DA' })}</g>`;
}
function spendScene(t, lt, a) {
  const D = a._dur || 5.4, k1 = qdK(0.3, 1.0, lt), k2 = qdK(1.5, 2.3, lt), out = qdK(D - 0.9, D, lt);
  let h = spPaper() + `<circle cx="960" cy="330" r="420" fill="url(#spCandle)" opacity=".5"/>` + spCloud(960 + Math.sin(t * 0.8) * 14, 250, 1.5, '#fff');
  h += `<g opacity="${spOp(k1)}">${outlined(960, 480, ['당신이 아직도 틀어 보는 그 장면.'], { size: 64, sw: 13, fill: '#fff' })}</g><g opacity="${spOp(k2)}">${outlined(960, 620, ['그날 당신 위에는,', '어떤 구름이 있었나요?'], { size: 86, sw: 17, fill: '#FFE9A8' })}</g>`;
  return spDefs() + h + `<rect x="-100" y="-100" width="2200" height="1400" fill="#2B2B55" opacity="${spOp(out)}"/>`;
}
