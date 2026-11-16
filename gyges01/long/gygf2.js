/* 기게스의 반지 편 — 1단계: 뉴스 → 2,400년 전 그리스 → 플라톤 『국가』 → 기게스(리디아 들판·왕궁) → 질문 → 반지 = 안경 → 유혹. gygf.js 다음에 읽는다.
   원문(『국가』 2권)은 왕을 죽이지만 대본은 "몰아내고" — 화면도 왕이 왕좌에서 밀려나 도망가는 정도(죽음 장면 금지). 기사 제목은 우리 말로 줄인 것(언론사 이름·브랜드 없음). */

/* ---------- 무대 ---------- */
function gyTemple(x, y, s) {
  let h = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-300 -330 L0 -430 L300 -330 Z" fill="#FFF8EA" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-200 -350 L0 -410 L200 -350 Z" fill="#F2E6CE"/><rect x="-320" y="-344" width="640" height="34" rx="6" fill="#F2E6CE" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 6; i++) { const cx = -250 + i * 100; h += `<rect x="${cx - 24}" y="-310" width="48" height="280" fill="#FFF8EA" stroke="${INK}" stroke-width="6"/><line x1="${cx - 8}" y1="-300" x2="${cx - 8}" y2="-40" stroke="${INK}" stroke-width="3" opacity=".22"/><line x1="${cx + 8}" y1="-300" x2="${cx + 8}" y2="-40" stroke="${INK}" stroke-width="3" opacity=".22"/>`; }
  return h + `<rect x="-340" y="-32" width="680" height="32" rx="6" fill="#F2E6CE" stroke="${INK}" stroke-width="7"/></g>`;
}
function gyGreece(t, o = {}) {
  let h = gfFull('url(#gfDay)') + gfSun(1700, 150, 54, t) + gfClouds(t, 110, 3, 5);
  h += `<rect x="-600" y="560" width="3120" height="220" fill="#5BB8E8"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${f1(-300 + i * 420 + (t * 24) % 420)} ${600 + (i % 2) * 40} q30 -14 60 0" stroke="#fff" stroke-width="5" fill="none" opacity=".6"/>`).join('');
  h += gfHill(660, 70, 900, '#C9E39A', 0) + gyTemple(1380, 690, 0.78) + gfHill(780, 40, 700, '#A9D27A', 300);
  h += gfTree(240, 860, 0.85, t, '#8AAE6A') + gfTree(1760, 880, 0.75, t, '#8AAE6A');
  h += `<rect x="-600" y="${GY.FY}" width="3120" height="600" fill="#EAD9AC"/><rect x="-600" y="${GY.FY}" width="3120" height="14" fill="#D9C38E"/>`;
  return h;
}
function gyLydia(t, o = {}) { // 리디아 들판(양 떼)
  let h = gfFull('url(#gfDay)') + gfSun(300, 150, 52, t) + gfClouds(t, 120, 3, 9);
  h += gfHill(560, 90, 1100, '#BFE39A', 100) + gfHill(700, 60, 800, '#9CD27A', 500) + gfPine(1650, 760, 0.8, t) + gfTree(180, 800, 0.8, t, '#7FBF5A');
  h += `<rect x="-600" y="${GY.FY}" width="3120" height="600" fill="#8CCB62"/><rect x="-600" y="${GY.FY}" width="3120" height="14" fill="#77B652"/>`;
  for (let i = 0; i < 9; i++) h += gfGrass(100 + i * 220, GY.FY + 40 + (i % 3) * 30, 1.1, '#5FA84A');
  return h;
}
function gyPalace(t) {
  let h = gfFull('#F6E3C2') + `<rect x="-600" y="-600" width="3120" height="2280" fill="url(#gfDots)" opacity=".4"/>`;
  for (let i = 0; i < 5; i++) { const x = 200 + i * 380; h += `<rect x="${x - 40}" y="80" width="80" height="${GY.FY - 80}" fill="#FFF3DC" stroke="${INK}" stroke-width="7"/><rect x="${x - 56}" y="60" width="112" height="34" rx="8" fill="#F2DDB4" stroke="${INK}" stroke-width="6"/><rect x="${x - 56}" y="${GY.FY - 34}" width="112" height="34" rx="8" fill="#F2DDB4" stroke="${INK}" stroke-width="6"/>`; }
  h += `<path d="M560 ${GY.FY} L1360 ${GY.FY} L1700 1300 L220 1300 Z" fill="#D9485A" stroke="${INK}" stroke-width="7"/><path d="M600 ${GY.FY} L1320 ${GY.FY}" stroke="#FFD84A" stroke-width="10"/>`;
  h += `<rect x="-600" y="${GY.FY}" width="1160" height="600" fill="#E8D2A8"/><rect x="1360" y="${GY.FY}" width="1160" height="600" fill="#E8D2A8"/>`;
  return h;
}
const GY_SITUP = Object.assign({}, SP_P.sit, { armL: P['만세'].armL, hL: P['만세'].hL, armR: P['만세'].armR, hR: P['만세'].hR });   // 왕좌에 앉아 만세
const gyThrone = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-150" y="-560" width="300" height="420" rx="40" fill="#8E5BD8" stroke="${INK}" stroke-width="9"/><rect x="-110" y="-520" width="220" height="340" rx="28" fill="#B48AF0"/><circle cx="0" cy="-470" r="26" fill="#FFD84A" stroke="${INK}" stroke-width="6"/>` +
  `<rect x="-190" y="-190" width="380" height="80" rx="20" fill="#FFD84A" stroke="${INK}" stroke-width="8"/><rect x="-170" y="-110" width="40" height="110" rx="8" fill="#E0A83A" stroke="${INK}" stroke-width="6"/><rect x="130" y="-110" width="40" height="110" rx="8" fill="#E0A83A" stroke="${INK}" stroke-width="6"/></g>`;
const gyNews = (lines, o = {}) => { const w = 470, hh = 300; return `<g><rect x="${-w / 2 + 8}" y="${-hh / 2 + 12}" width="${w}" height="${hh}" rx="10" fill="${GFC.navy}" opacity=".25"/><rect x="${-w / 2}" y="${-hh / 2}" width="${w}" height="${hh}" rx="10" fill="#FFFDF5" stroke="${INK}" stroke-width="7"/>` +
  `<rect x="${-w / 2}" y="${-hh / 2}" width="${w}" height="56" rx="10" fill="${o.col || '#E5484D'}" stroke="${INK}" stroke-width="7"/>` + gfT(-w / 2 + 26, -hh / 2 + 40, o.tag || '뉴스', 30, '#fff', { anchor: 'start' }) +
  lines.map((s, i) => gfT(0, -hh / 2 + 122 + i * 56, s, 44, GFC.navy)).join('') + [0, 1].map(i => `<rect x="${-w / 2 + 34}" y="${hh / 2 - 70 + i * 24}" width="${w - 68 - i * 120}" height="12" rx="6" fill="#D5DBE4"/>`).join('') +
  `<circle cx="${w / 2 - 18}" cy="${-hh / 2 + 8}" r="14" fill="#FF6B6B" stroke="${INK}" stroke-width="5"/></g>`; };
const gyCard = (inner, label, o = {}) => { const w = o.w || 420, hh = o.h || 420; return `<g>${gfPanel(w, hh, { r: 40, bg: o.bg || GFC.cream })}${inner}<g transform="translate(0 ${hh / 2 - 62})">${gfChip(label, { size: o.size || 44, bg: o.chip || GFC.sun })}</g></g>`; };

/* ---------- g1·g2: 요즘 뉴스 → 2,400년 전 그리스 ---------- */
gynewsScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 4;
  let h = fkDefs() + GY_DEFS;
  const board = (k = 1) => gfFull('#CFE6F5') + `<rect x="-600" y="-600" width="3120" height="2280" fill="url(#gfDots)"/>` + `<g opacity="${f1(k * 100) / 100}"><rect x="250" y="80" width="1420" height="820" rx="26" fill="#D9A86C" stroke="${INK}" stroke-width="10"/><rect x="250" y="80" width="1420" height="820" rx="26" fill="url(#gyCork)"/></g>`;
  const NEWS = [[['시험장에', "'AI 안경' 적발"], -6, 560, 330, '뉴스'], [['국가자격시험', '또 적발'], 4, 1100, 300, '뉴스'], [['수능 앞두고', '범부처 대책'], -3, 820, 640, '뉴스']];
  if (ph === 0) {
    const ts = [gyW(a, 'AI', 0.4) - 0.1, gyW(a, '시험', 1.75) - 0.1, gyW(a, '부정', 2.1)], tL = gyW(a, '논란', 2.8);
    let w = board();
    NEWS.forEach(([ls, rot, x, y], i) => { if (lt > ts[i]) { const k = gfIn(lt, ts[i], 3.4, 0.42); w += fkAt(x, y - 60 * (1 - Math.min(1, k)), gyNews(ls) + `<circle cx="0" cy="-150" r="16" fill="${['#FF6B6B', '#3DDBB4', '#FFD84A'][i]}" stroke="${INK}" stroke-width="5"/>`, ((2 - k) * 0.5 + 0.5 * k) * 1.15, rot); } });
    w += fkAt(1460, 740, `<circle r="120" fill="#fff" stroke="${INK}" stroke-width="8"/><g transform="scale(.95)">${gyGlasses(0.6, t)}</g>`, gfIn(lt, 0.1, 3, 0.45), 6) + gfEmote(lt, ts[0] + 0.3, 1540, 590, 'bang', { hold: 3 });
    if (lt > tL - 0.12) w += fkAt(1330, 560, gfStamp(lt, tL, '논란!', { size: 92 }));
    h += qCam(camLerp(lt / D, [960, 520, 1.0], [960, 520, 1.06]), w);
  } else {
    const tQ = gyW(a, '질문', 1.45), tY = gyW(a, '2400', 1.99) - 0.1, tG = gyW(a, '고대', 3.5) - 0.1, tS = gyW(a, '시작', 5.3);
    const fadeB = 1 - gfK(tY, tY + 0.5, lt), spin = easeOut(gfK(tY, tY + 0.9, lt)), greece = gfK(tG - 0.1, tG + 0.4, lt);
    let w = '';
    if (greece < 1) { w += board(fadeB); if (spin < 0.5) { NEWS.forEach(([ls, rot, x, y], i) => { const fly = gfK(0.2 + i * 0.1, 0.9 + i * 0.1, lt); w += fkAt(x + (i - 1) * 900 * easeIn(fly), y - 300 * easeIn(fly), gyNews(ls), 1.15, rot + 40 * fly); });
        const fz = gfK(0.5, 1.2, lt); w += fkAt(1330 + 900 * easeIn(fz), 560 - 300 * easeIn(fz), gfStamp(lt, -9, '논란!', { size: 92 }), 1, 30 * fz) + fkAt(1460 + 900 * easeIn(fz), 740, `<circle r="120" fill="#fff" stroke="${INK}" stroke-width="8"/><g transform="scale(.95)">${gyGlasses(0.6, t)}</g>`, 1, 6); }
      if (lt > tY) { // 시간 되감기: 도는 띠 + 숫자
        w += `<g opacity="${f1(Math.min(1, gfK(tY, tY + 0.3, lt) * (1 - greece)) * 100) / 100}"><rect x="-600" y="-600" width="3120" height="2280" fill="#2A2350"/>` + Array.from({ length: 16 }, (_, i) => `<path d="M960 520 L${f1(960 + Math.cos(i * Math.PI / 8 - lt * 3) * 2400)} ${f1(520 + Math.sin(i * Math.PI / 8 - lt * 3) * 2400)} L${f1(960 + Math.cos((i + 0.5) * Math.PI / 8 - lt * 3) * 2400)} ${f1(520 + Math.sin((i + 0.5) * Math.PI / 8 - lt * 3) * 2400)} Z" fill="${i % 2 ? '#3B3270' : '#2A2350'}"/>`).join('') +
          gfClock(960, 400, 150, 12 - spin * 40, 60 - (spin * 2400) % 60) + fkAt(960, 720, gfT(0, 0, `${(Math.round(spin * 24) * 100).toLocaleString()}년 전`, 120, GFC.sun, { sw: 16, stroke: GFC.navy }), spin >= 1 ? gfBeat(lt, tY + 0.9, 0.25, 3, 5) : 1) + `</g>`; }
    }
    if (greece > 0) w += `<g opacity="${f1(greece * 100) / 100}">${gyGreece(t)}${gfActor(GY_PL, { x: 600, y: GY.FY, s: 0.92, t, pose: '서기', ex: fEx('z멍'), look: [0.5, -0.2], seed: 50, holdR: GY_SCROLL }, {})}</g>`;
    // 이 질문(?)이 날아와 그리스까지 따라감
    if (lt > tQ - 0.2) { const k = gfIn(lt, tQ - 0.2, 3, 0.45), fx = lerp(lt > tY && greece < 0.5 ? 1500 : 960, 860, greece), fy = lerp(lt > tY && greece < 0.5 ? 220 : 470, 260, greece) + Math.sin(t * 2.4) * 10;
      w += fkAt(fx, fy, gfPanel(330, 170, { r: 34, head: '이 질문', headBg: GFC.sun }) + `<g transform="translate(-86 4) scale(.55)">${gyGlasses(0.4, t)}</g>` + gfT(70, 22, '쓸까?', 52, GFC.grape), k * (1 - 0.35 * greece) * (lt > tS ? gfBeat(lt, tS, 0.14, 4, 8) : 1)); }
    if (greece > 0.5) w += fkAt(960, 160, gfChip('기원전 · 고대 그리스', { size: 40, icon: 'scroll', bg: '#fff' }), gfIn(lt, tG + 0.3, 3, 0.45), -2);
    h += qCam([960, 540, 1], w);
  }
  return h;
};

/* ---------- g3·g6·g7: 플라톤 『국가』 → 섬뜩한 질문 → 선해서? 보고 있어서? ---------- */
gyplatoScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 4;
  let h = fkDefs() + GY_DEFS, w = gyGreece(t);
  if (ph === 0) {
    const tP = gyW(a, '플라톤', 0.5), tK = gyW(a, '국가', 1.2), tG = gyW(a, '기계스', 2.1) - 0.1;
    const unroll = gfK(tG, tG + 0.5, lt);
    w += gfActor(GY_PL, { x: 600, y: GY.FY, s: 0.95, t, pose: lt > tK ? '가리킴' : '서기', ex: fEx(lt > tG ? 'z뿌듯' : 'z빵긋'), look: [0.6, -0.1], seed: 50, holdR: lt > tK ? null : GY_SCROLL }, lt > tK ? gfJelly(lt, tK, 0.08, 5, 8) : {});
    if (lt > tP - 0.1) w += fkAt(600, GY.FY - 600, gfChip('플라톤', { size: 40, bg: '#fff' }), gfIn(lt, tP - 0.1, 3.2, 0.45), -3);
    if (lt > tK - 0.1) { // 두루마리 『국가』가 펼쳐져 '기게스의 반지'
      const bw = lerp(140, 760, easeOut(unroll)), cx = 1240;
      w += `<g opacity="${f1(gfIn(lt, tK - 0.1, 3, 0.45) * 100) / 100}"><path d="M1150 640 L1090 ${GY.FY} M1330 640 L1390 ${GY.FY} M1240 640 L1240 ${GY.FY - 20}" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M1150 640 L1090 ${GY.FY} M1330 640 L1390 ${GY.FY} M1240 640 L1240 ${GY.FY - 20}" stroke="#B98552" stroke-width="9" stroke-linecap="round"/><rect x="1110" y="660" width="260" height="20" rx="8" fill="#B98552" stroke="${INK}" stroke-width="5"/></g>`;
      w += fkAt(cx, 440, `<rect x="${f1(-bw / 2)}" y="-230" width="${f1(bw)}" height="460" rx="20" fill="#F6E7C8" stroke="${INK}" stroke-width="8"/><rect x="${f1(-bw / 2 - 26)}" y="-250" width="40" height="500" rx="16" fill="#B98552" stroke="${INK}" stroke-width="7"/><rect x="${f1(bw / 2 - 14)}" y="-250" width="40" height="500" rx="16" fill="#B98552" stroke="${INK}" stroke-width="7"/>` +
        gfT(0, -158, '『국가』', 56, GFC.navy) + gfT(0, -108, '(국가론)', 38, '#7A5232', { wt: 900 }) + (unroll > 0.6 ? `<g opacity="${f1(gfK(0.6, 1, unroll) * 100) / 100}">` + `<g transform="translate(0 34) scale(1.25)">${gyRing(t, 0)}</g>` + gfT(0, 186, '기게스의 반지', 58, '#B0642E') + `</g>` : ''), gfIn(lt, tK - 0.1, 3, 0.45), -2);
      if (unroll > 0.8) w += fkAt(1520, 220, gfChip('2권에 나와요', { size: 38, bg: GFC.sun }), gfIn(lt, tG + 0.5, 3.2, 0.45), 4);
    }
    h += qCam(camLerp(lt / D, [920, 540, 1.1], [930, 520, 1.16]), w);
  } else if (ph === 1) { // 섬뜩한 질문
    const tS = gyW(a, '섬뜩', 1.5), tQ = gyW(a, '질문', 2.3), dark = gfK(tS - 0.3, tS + 0.3, lt);
    w += `<rect x="-600" y="-600" width="3120" height="2280" fill="#1B1640" opacity="${f1(0.62 * dark * 100) / 100}"/>` + (dark > 0 ? `<ellipse cx="760" cy="${GY.FY - 260}" rx="300" ry="420" fill="url(#gfGlow)" opacity="${f1(0.55 * dark * 100) / 100}"/>` : '');
    w += gfActor(GY_PL, { x: 760, y: GY.FY, s: 1.0, t, pose: lt > tS ? '가리킴' : '서기', ex: fEx(lt > tS ? 'z의심' : 'z결심'), look: [0.4, 0], seed: 50 }, lt > tS ? gfJelly(lt, tS, 0.08, 5, 8) : {});
    if (lt > tQ - 0.1) w += fkAt(1120 + Math.sin(t * 3) * 10, 300, `<g transform="rotate(${f1(Math.sin(t * 2.2) * 6)})">${gfT(0, 90, '?', 300, '#B48AF0', { sw: 18, stroke: '#2A2350' })}</g>`, gfIn(lt, tQ - 0.1, 3, 0.45));
    if (lt > tS) w += gfEmote(lt, tS, 900, GY.FY - 600, 'shock', { hold: 1.4 });
    h += qCam(camLerp(lt / D, [900, 540, 1.0], [880, 500, 1.12]), w);
  } else { // 우리가 착하게 사는 건 진짜 선해서일까, 아니면 남들이 보고 있어서일까?
    const tG = gyW(a, '진짜', 1.6), tE = gyW(a, '보고', 5.4) - 0.2, tO = gyW(a, '아니면', 3.95);
    w += `<rect x="-600" y="-600" width="3120" height="2280" fill="#1B1640" opacity=".55"/>`;
    const L = gyCard(`<g transform="translate(0 -60)"><ellipse cx="0" cy="-100" rx="80" ry="22" fill="none" stroke="${GFC.sun}" stroke-width="12"/><g transform="scale(2.6)">${GF_ICON.heart()}</g></g>`, '진짜 선해서?', { chip: '#FFE1EE' });
    const eyes = [[-90, -110], [80, -140], [0, -40], [-110, 20], [100, 0]].map(([x, y], i) => `<g transform="translate(${x} ${y})">${gyEye(0.7 + 0.3 * Math.abs(Math.sin(t * 2 + i)), 0.8)}</g>`).join('');
    const R = gyCard(eyes, '보고 있어서?', { chip: '#DDEBFF' });
    if (lt > tG - 0.3) w += fkAt(520, 470, L, gfIn(lt, tG - 0.3, 3, 0.45) * 1.18, -3);
    if (lt > tO) w += fkAt(960, 470, `<circle r="70" fill="${GFC.coral}" stroke="${INK}" stroke-width="8"/>` + gfT(0, 18, 'VS', 52, '#fff'), gfIn(lt, tO, 3.4, 0.4) * 1.2);
    if (lt > tE) w += fkAt(1400, 470, R, gfIn(lt, tE, 3, 0.45) * 1.18, 3);
    h += qCam([960, 540, 1], w);
  }
  return h;
};

/* ---------- g4: 리디아 들판 — 반지를 줍고, 안쪽으로 돌리면 투명인간 ---------- */
gyfieldScene = function (t, lt, a) {
  const D = a._dur || 8, FY = GY.FY;
  const tN = gyW(a, '양치기', 0.8), tC = gyW(a, '우연히', 1.6) - 0.1, tR = gyW(a, '반지', 2.5), tPk = gyW(a, '줍는', 3.1), tIn = gyW(a, '안쪽', 4.5) - 0.2, tV = gyW(a, '투명', 5.6) - 0.1, tAb = gyW(a, '능력', 6.9);
  let h = fkDefs() + GY_DEFS, w = gyLydia(t);
  const sheep = [[300, 0.75, 0], [1430, 0.8, 1.3], [1640, 0.65, 2.1]];
  sheep.forEach(([x, s, sd]) => { w += gySheep(x, FY + 10, s, t, sd); });
  // 땅이 갈라지고 반지가 솟음
  const crack = gfK(tC, tC + 0.4, lt);
  if (crack > 0) w += `<path d="M960 ${FY - 2} L1010 ${FY - 14} L1040 ${FY + 2} L1080 ${FY - 12} L1120 ${FY} L1080 ${FY + 10} L1040 ${FY + 20} L1000 ${FY + 8} Z" fill="#3A2A1E" stroke="${INK}" stroke-width="7" stroke-linejoin="round" opacity="${f1(crack * 100) / 100}"/><ellipse cx="1040" cy="${FY + 24}" rx="${f1(140 * crack)}" ry="${f1(34 * crack)}" fill="#FFE38A" opacity="${f1(0.6 * crack * (1 - gfK(tPk + 0.4, tPk + 1, lt)) * 100) / 100}"/>`;
  // 기게스
  const gx = lerp(560, 860, gfK(0, tR, lt)), vis = gfK(tV, tV + 0.6, lt), holding = lt > tPk;
  if (lt > tPk) w += `<g transform="translate(${f1(gx - 170)} ${FY - 8}) rotate(-84)">${GY_CROOK}</g>`;   // 지팡이는 바닥에 내려놓음
  const wk = lt < tR ? gfWalk(gx * 1.2, 0.8) : null;
  const gg = gfActor(GY_GG, { x: gx, y: FY, s: 0.95, t, pose: wk ? wk.pose : holding ? '들기' : '서기', ex: fEx(lt > tPk ? 'z반짝' : lt > tC ? 'z충격' : 'z빵긋'), look: [0.6, lt > tC && lt < tPk ? 0.4 : -0.1], seed: 60, holdR: holding ? `<g transform="scale(.62)">${gyRing(t, lt > tIn ? gfK(tIn, tIn + 0.8, lt) : 0)}</g>` : GY_CROOK }, wk ? { sy: wk.sy, dy: wk.dy } : (lt > tC && lt < tC + 0.5 ? gfJelly(lt, tC, 0.12, 5, 8) : {}));
  w += gyGhost(gg, vis);
  if (!holding && lt > tR - 0.3) w += fkAt(1040, FY - 40 - 160 * easeOut(gfK(tR - 0.3, tR + 0.3, lt)), `<g transform="scale(.7)">${gyRing(t, 0)}</g>`, 1) + gfRays(t, 1040, FY - 200, 160, GFC.sun, 10, 0.4);
  if (lt > tC) w += gfEmote(lt, tC, gx + 120, FY - 560, 'bang', { hold: 0.9 });
  if (lt > tN - 0.1) w += fkAt(gx, FY - 640, gfChip('양치기 기게스', { size: 40, bg: '#fff' }), gfIn(lt, tN - 0.1, 3.2, 0.45) * (1 - gfK(tV - 0.1, tV + 0.2, lt)), -3);
  if (lt > tPk && lt < tIn + 0.2) w += fkAt(gx + 430, FY - 470, gfItem(lt, tPk, { svg: `<g transform="scale(.9)">${gyRing(t, 0)}</g>`, name: '기게스의 반지', sub: '획득!', w: 420 }), gfOut(lt, tIn - 0.1, 0.25));
  if (vis > 0) { w += gfStarBurst(lt, tV, gx, FY - 300, { n: 8, r0: 40, r1: 220, cols: ['#7FD8FF', '#fff', GFC.sun] }); if (lt > tV + 0.3) w += fkAt(gx, FY - 660, gfChip('투명화 버프 적용!', { size: 40, bg: '#BFF0FF' }), gfIn(lt, tV + 0.3, 3.2, 0.45), -3); }
  if (lt > tAb) sheep.forEach(([x, s], i) => { w += gfEmote(lt, tAb + i * 0.15, x + 60 * s, FY - 200 * s - 40, 'q', { hold: 1.4, s: 0.8 }); });
  // 안쪽으로 돌리기: 확대 창
  let ins = '';
  if (lt > tIn - 0.1 && lt < tV + 0.5) { const k = gfIn(lt, tIn - 0.1, 3, 0.45) * gfOut(lt, tV + 0.25, 0.25), turn = gfK(tIn + 0.2, tV - 0.1, lt);
    ins = fkAt(1380, 380, `<clipPath id="gyIns"><circle r="250"/></clipPath><circle r="262" fill="${GFC.navy}" opacity=".25" transform="translate(8 10)"/><g clip-path="url(#gyIns)"><rect x="-300" y="-300" width="600" height="600" fill="#FFF3D6"/><circle cx="0" cy="40" r="150" fill="#fff" stroke="${INK}" stroke-width="12"/>` +
      `<g transform="translate(0 40) scale(2.2)">${gyRing(t, turn)}</g><path d="M150 -120 A190 190 0 0 1 170 110" fill="none" stroke="${GFC.coral}" stroke-width="14" stroke-linecap="round"/><path d="M170 110 l-34 -8 l18 -30 Z" fill="${GFC.coral}"/></g><circle r="250" fill="none" stroke="${INK}" stroke-width="10"/>` +
      `<g transform="translate(0 280)">${gfChip('받침을 손바닥 쪽으로', { size: 30, bg: '#fff' })}</g>`, k); }
  h += qCam(camLerp(lt / D, [880, 570, 1.16], [930, 550, 1.24]), w) + ins;
  return h;
};

/* ---------- g5: 깨달은 순간 → 왕궁으로 → 왕을 몰아내고 나라를 훔침 ---------- */
gypalaceScene = function (t, lt, a) {
  const D = a._dur || 6.5, FY = GY.FY;
  const tK = gyW(a, '깨달은', 1.75), tG = gyW(a, '착하던', 2.4), tX = gyW(a, '순식간', 3.85) - 0.15, tW = gyW(a, '왕을', 4.8), tN = gyW(a, '나라를', 5.55);
  let h = fkDefs() + GY_DEFS, w = '';
  if (lt < tX) { // 들판: 전구 + 착한 후광이 깨짐
    w = gyLydia(t) + gySheep(1500, FY + 10, 0.8, t, 1.3);
    const gg = gfActor(GY_GG, { x: 860, y: FY, s: 1.0, t, pose: '들기', ex: fEx(lt > tK ? 'z히죽' : 'z반짝'), look: [0, 0], seed: 60, holdR: `<g transform="scale(.42)">${gyRing(t, 1)}</g>` }, lt > tK ? gfJelly(lt, tK, 0.1, 5, 8) : {});
    w += gyGhost(gg, 1);
    if (lt > tK - 0.2) w += gfEmote(lt, tK - 0.2, 980, FY - 600, 'idea', { hold: 1.2 });
    const hb = gfK(tG, tG + 0.5, lt);   // 후광: 깨져 떨어짐
    w += hb < 1 ? `<g transform="translate(860 ${f1(FY - 590 + 300 * easeIn(hb))}) rotate(${f1(30 * hb)})" opacity="${f1((1 - hb) * 100) / 100}"><ellipse rx="96" ry="24" fill="none" stroke="${GFC.sun}" stroke-width="13"/>${hb > 0 ? `<path d="M-10 -26 l14 24 l-10 20" stroke="${INK}" stroke-width="6" fill="none"/>` : ''}</g>` : '';
    if (lt > tG) w += fkAt(860, FY - 690, gfChip('착함 −100', { size: 42, bg: '#FFE1E1' }), gfIn(lt, tG, 3.2, 0.45) * gfOut(lt, tX - 0.2, 0.2), 4);
    h += qCam(camLerp(lt / tX, [880, 560, 1.15], [870, 500, 1.3]), w);
  } else { // 왕궁
    w = gyPalace(t) + gyThrone(1180, FY, 1);
    const push = gfK(tW - 0.1, tW + 0.45, lt), run = lt > tW + 0.45;
    // 경비병 둘(? ?)
    [[420, 1], [1680, -1]].forEach(([x, d], i) => { w += gfActor(GY_GD, { x, y: FY, s: 0.82, t, pose: '서기', ex: fEx('z멍'), look: [-d * 0.4, 0], seed: 70 + i, holdR: GY_SPEAR }, {}) + gfEmote(lt, tX + 0.3 + i * 0.2, x + 60, FY - 520, 'q', { hold: 1.6, s: 0.8 }); });
    // 왕: 왕좌에서 밀려나 도망
    if (lt < tN + 0.6) { const kx = 1180 - 700 * easeOut(push) - (run ? (lt - tW - 0.45) * 900 : 0), kr = -25 * push + (run ? Math.sin(lt * 20) * 6 : 0), ky = (push > 0 ? FY : FY - 142) - 60 * Math.sin(Math.PI * push);
      w += gfActor(GY_KG, { x: kx, y: ky, s: 0.92, t, pose: run ? walkPose(lt * 9, 1) : push > 0 ? '만세' : SP_P.sit, ex: fEx(push > 0 ? 'z충격' : 'z빵긋'), look: [-0.5, 0], seed: 80, rot: kr, headFx: push > 0.2 ? null : GY_CROWN, sweat: push > 0 }, {}); }
    // 기게스(투명 → 나타남)
    const gx = lerp(-100, 1080, easeOut(gfK(tX, tW, lt))), seat = lt > tW + 0.2, vis = lt > tN ? 1 - gfK(tN, tN + 0.4, lt) : 1;
    const crownOn = lt > tW + 0.55;
    const gg = gfActor(GY_GG, { x: seat ? 1180 : gx, y: seat ? FY - 142 : FY, s: 0.95, t, pose: seat ? GY_SITUP : walkPose(gx * 0.05, 1), ex: fEx('z히죽'), look: [0, 0], seed: 60, headFx: crownOn ? GY_CROWN : null }, seat ? gfJelly(lt, tW + 0.2, 0.1, 5, 8) : {});
    w += gyGhost(gg, vis);
    if (lt < tW && lt > tX) w += [0, 1, 2].map(i => `<line x1="${f1(gx - 140 - i * 30)}" y1="${FY - 380 + i * 60}" x2="${f1(gx - 260 - i * 30)}" y2="${FY - 380 + i * 60}" stroke="#7FD8FF" stroke-width="8" stroke-linecap="round" opacity=".7"/>`).join('');
    if (push > 0 && !crownOn) { const u = gfK(tW + 0.05, tW + 0.55, lt), cx = lerp(1060, 1180, u), cy = FY - 560 - 220 * Math.sin(Math.PI * u) - 120 * u; w += `<g transform="translate(${f1(cx - 200)} ${f1(cy - 50)}) rotate(${f1(360 * u)} 200 50)">${GY_CROWN}</g>`; }
    if (lt > tN) w += `<rect x="-600" y="-600" width="3120" height="2280" fill="#2A1030" opacity="${f1(0.3 * gfK(tN, tN + 0.4, lt) * 100) / 100}"/>` + fkAt(700, 340, gfStamp(lt, tN + 0.1, '나라 강탈!', { size: 80, col: '#B3202C' }));
    h += qCam(camLerp((lt - tX) / (D - tX), [1000, 560, 1.05], [1060, 520, 1.15]), w);
  }
  return h;
};

/* ---------- g8: 오늘날의 AI 안경 = 기게스의 반지 ---------- */
gyequalScene = function (t, lt, a) {
  const tA = Math.min(0.45, gyW(a, 'AI', 0.7) - 0.1), tB = gyW(a, '바로', 1.45), tR = gyW(a, '반지', 2.65);
  let h = fkDefs() + GY_DEFS;
  let w = `<rect x="-600" y="-600" width="1560" height="2280" fill="#F6E3B8"/><rect x="960" y="-600" width="1560" height="2280" fill="#DDEBFF"/><rect x="-600" y="-600" width="3120" height="2280" fill="url(#gfDots)" opacity=".5"/>`;
  w += `<g opacity=".4">${gyTemple(420, 930, 0.62)}</g><g opacity=".4">${[[1180, 330], [1420, 470], [1660, 260]].map(([x, top]) => `<rect x="${x - 100}" y="${top}" width="200" height="${930 - top}" rx="10" fill="#fff" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2, 3, 4].filter(r => top + 40 + r * 90 < 880).map(r => `<rect x="${x - 70}" y="${top + 40 + r * 90}" width="50" height="46" rx="6" fill="#BFE6FF"/><rect x="${x + 20}" y="${top + 40 + r * 90}" width="50" height="46" rx="6" fill="#BFE6FF"/>`).join('')).join('')}</g>`;
  w += fkAt(560, 450, gyCard(`<g transform="translate(0 -40) scale(1.8)">${gyRing(t, 0)}</g>`, '기게스의 반지', { chip: GFC.sun }), gfIn(lt, 0.05, 3, 0.45) * (lt > tR ? gfBeat(lt, tR, 0.1, 4, 8) : 1), -3);
  if (lt > tA) w += fkAt(1360, 450, gyCard(`<g transform="translate(0 -40) scale(1.5)">${gyGlasses(1, t)}</g>`, 'AI 안경', { chip: '#BFF0FF' }), gfIn(lt, tA, 3, 0.45) * (lt > tR ? gfBeat(lt, tR, 0.1, 4, 8) : 1), 3);
  if (lt > tB) w += fkAt(960, 450, `<circle r="84" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="-44" y="-30" width="88" height="20" rx="8" fill="${GFC.navy}"/><rect x="-44" y="10" width="88" height="20" rx="8" fill="${GFC.navy}"/>`, gfIn(lt, tB, 3.6, 0.4) * gfBeat(lt, tR, 0.2, 3, 6)) + gfStarBurst(lt, tB, 960, 450, {});
  if (lt > tR) w += fkAt(960, 800, gfChip('2,400년 전 = 지금', { size: 50, bg: '#fff' }), gfIn(lt, tR + 0.1, 3.2, 0.45), -2);
  h += qCam(camLerp(lt / (a._dur || 3.4), [960, 520, 1.0], [960, 520, 1.05]), w);
  return h;
};

/* ---------- g9: 감시자의 눈이 사라진 자리 → '나만 안 쓰면 바보?' → 유혹이 고개를 든다 ---------- */
gytemptScene = function (t, lt, a) {
  const D = a._dur || 7, FY = GY.FY, ZX = GY.ZX;
  const tE = gyW(a, '감시자', 0.15), tV = gyW(a, '사라진', 1.07), tM = gyW(a, '나만', 2.75), tT = gyW(a, '유혹', 5.4) - 0.1, tH = gyW(a, '고개', 6.15);
  let h = fkDefs() + GY_DEFS;
  let w = gyBackRoom(t, { clock: 120 }) + gyExaminees(t, { glowOthers: gfK(tM, tM + 0.5, lt) });
  // 감시자의 눈들: 하나씩 감기고 사라짐
  const EYES = [[520, 330], [960, 470], [1420, 330], [300, 600], [1640, 600]];
  EYES.forEach(([x, y], i) => { const t0 = tV + i * 0.12, cl = gfK(t0, t0 + 0.25, lt), gone = gfK(t0 + 0.3, t0 + 0.5, lt);
    if (gone < 1) w += fkAt(x, y + Math.sin(t * 2 + i) * 6, gyEye(1 - cl, 1.3), gfIn(lt, tE + i * 0.08, 3, 0.45) * (1 - gone)); w += gfPuff(lt, t0 + 0.3, x, y, 1.1); });
  // 유혹 = 악마: '나만'에 책상 뒤에서 뿔과 눈만 내밀고 속삭임 → '유혹이'에 눈이 번뜩 → '고개를 들죠'에 연기와 함께 어깨 높이로 솟아올라 안경을 가리킴
  const peek = gfK(tM - 0.3, tM + 0.2, lt), rise = easeOut(gfK(tH - 0.15, tH + 0.45, lt)), DX = ZX + 230;
  const dy = lerp(FY - 110, FY - 222, easeOut(peek)) - 250 * rise + (rise > 0.9 ? Math.sin(t * 3) * 6 : 0);
  if (peek > 0) w += `<g transform="translate(${DX} ${f1(dy)})">${gyDevil(t, 0.8, { grin: lerp(0.35, 1, rise), look: -0.8, point: gfK(tH + 0.5, tH + 0.8, lt), wing: rise })}</g>`;
  if (lt > tT && lt < tH) w += gfTwinkle(t, DX - 20, dy - 92, 16, 1, '#FFE14A') + gfTwinkle(t, DX + 30, dy - 92, 16, 2, '#FFE14A');
  w += gyPoof(lt, tH - 0.1, DX, dy + 20, 1.1);
  const tempted = lt > tH + 0.7;   // 끝: 제로 손이 안경테 쪽으로 슬금슬금(누르지 않음)
  w += gyAtDesk({ x: ZX, y: FY, s: 1, t, pose: tempted ? 'gy톡' : 'gy쓰기', ex: lt > tH ? 'z당황' : lt > tM ? 'z의심' : 'z멍', look: [lt > tM ? 0.7 : -0.3, lt > tM ? -0.1 : 0.2], holdR: tempted ? null : GY_PENCIL, glow: lt > tM ? 0.35 + 0.25 * Math.sin(t * 5) : 0, sweat: lt > tH }, lt > tH ? gfJelly(lt, tH, 0.08, 5, 8) : {}, { extra: tempted ? `<g transform="translate(90 -190) rotate(-20)">${GY_PENCIL}</g>` : '' });
  // 악마의 속삭임(점선 말풍선, 꼬리는 악마 쪽)
  if (lt > tM - 0.1) { const k = gfIn(lt, tM - 0.1, 3, 0.45), bx = DX + 400, by = FY - 640;
    w += fkAt(bx, by, `<g transform="scale(${f1(k * 1000) / 1000})"><path d="M-90 60 L-150 120 L-40 66 Z" fill="#FFF0F0" stroke="#B3202C" stroke-width="6" stroke-linejoin="round"/><rect x="-250" y="-70" width="500" height="140" rx="60" fill="#FFF0F0" stroke="#B3202C" stroke-width="6" stroke-dasharray="18 10"/>` +
      gfT(0, 16, '나만 안 쓰면 바보?', 44, '#B3202C') + `<g transform="translate(220 -64) scale(.8)">${gfIcon('note', 0.7, t)}</g></g>`); }
  if (lt > tH) w += gfEmote(lt, tH, ZX + 150, FY - 560, 'sweat', { hold: 3 });
  h += qCam(camLerp(lt / D, [1000, 560, 1.12], [1060, 520, 1.28]), w);
  return h;
};
