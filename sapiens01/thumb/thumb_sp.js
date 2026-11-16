/* 사피엔스 편 썸네일 3종(1920×1080 그대로 그림, 글자는 mk.py가 PIL로 얹음). anim_sp.html 위에서 불러 씀.
   A 파스텔 그림책(Grok 거리 배경 + 큰 제로, 0:27~0:33 "출근길이 가벼워집니다")
   B 게임 화면(평면 UI, 아이템 카드: 5만 원권 느낌 지폐·대리 명찰·회사, 0:14~0:27 "돈·회사·직급 … 상상 게임이라면")
   C 도트 레트로(하트가 다시 차오름, 0:27~0:33 하트 1→3)
   규칙: 제로는 오른쪽 절반에 크게(머리 ≈ 화면 높이 44%), 왼쪽 40%는 글자 자리, 그림 안에 글자 없음. */
const TZ = (x, headY, s, o = {}) => gfActor(SPZW, Object.assign({ x, y: headY + 390 * s, s, t: 1.2, pose: '서기', look: [-0.3, -0.1], seed: 3, sweat: false }, o, { ex: fEx(o.ex || 'z빵긋') }), o.m || {});
const tHeart = (x, y, k, fill = '#FF6B8A', rot = 0) => fkAt(x, y, `<path d="M0 26 C-40 -4 -40 -34 -16 -38 C-4 -40 0 -30 0 -24 C0 -30 4 -40 16 -38 C40 -34 40 -4 0 26 Z" fill="${fill}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><ellipse cx="-14" cy="-22" rx="7" ry="5" fill="#fff" opacity=".7"/>`, k, rot);
const tSpark = (x, y, k, c = '#FFE38A') => fkAt(x, y, `<path d="M0 -30 L7 -7 L30 0 L7 7 L0 30 L-7 7 L-30 0 L-7 -7 Z" fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`, k);
const tFeather = (x, y, k, rot) => fkAt(x, y, `<path d="M0 -60 Q34 -20 10 50 Q0 60 -10 50 Q-34 -20 0 -60 Z" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M0 -50 L0 58" stroke="${INK}" stroke-width="3"/>${[-30, -10, 10, 30].map(y => `<path d="M0 ${y} l14 -10 M0 ${y} l-14 -10" stroke="#C9D2E8" stroke-width="3"/>`).join('')}`, k, rot);
function spThumb(kind, bg) {
  let h = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">` + fkDefs();
  if (kind === 'A') {   // 파스텔 그림책: 아침 햇살 거리, 몸이 가벼워져 살짝 뜬 제로
    h += `<image href="${bg}" x="0" y="0" width="1920" height="1080" preserveAspectRatio="xMidYMid slice"/>`;
    h += `<defs><radialGradient id="tGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6D6" stop-opacity=".95"/><stop offset="1" stop-color="#FFF6D6" stop-opacity="0"/></radialGradient></defs><ellipse cx="1400" cy="500" rx="600" ry="560" fill="url(#tGlow)"/>`;
    h += TZ(1400, 500, 2.45, { ex: 'z빵긋', pose: '만세', rot: -4 });
    [[960, 230, 1.7, -14], [1830, 260, 1.4, 16], [990, 780, 1.2, -8], [1840, 800, 1.5, 12]].forEach(([x, y, k, r]) => { h += tHeart(x, y, k, '#FF8FB1', r); });
    [[1160, 120, 1.0], [1700, 140, 1.2], [930, 520, 0.9], [1880, 560, 0.8]].forEach(([x, y, k]) => { h += tSpark(x, y, k); });
    h += tFeather(950, 500, 1.4, -30) + tFeather(1860, 520, 1.2, 24);
  }
  if (kind === 'B') {   // 게임 화면: 아이템 카드(점선 = 함께 믿는 약속), 제로가 지폐를 들고 반짝
    h += `<defs><linearGradient id="tSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BDE7FF"/><stop offset="1" stop-color="#FFF3D6"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#tSky)"/>`;
    for (let i = 0; i < 26; i++) h += `<line x1="${i * 80}" y1="0" x2="${i * 80}" y2="1080" stroke="#fff" stroke-width="2" opacity=".5"/>`;
    for (let i = 0; i < 14; i++) h += `<line x1="0" y1="${i * 80}" x2="1920" y2="${i * 80}" stroke="#fff" stroke-width="2" opacity=".5"/>`;
    h += `<rect x="760" y="40" width="1120" height="1000" rx="46" fill="#fff" fill-opacity=".35" stroke="${INK}" stroke-width="9" stroke-dasharray="40 24"/>`;
    h += TZ(1330, 470, 1.95, { ex: 'z반짝', pose: { armL: P['서기'].armL, hL: P['서기'].hL, armR: [[252, 285], [300, 220], [318, 150]], hR: [320, 140], legL: P['서기'].legL, fL: P['서기'].fL, legR: P['서기'].legR, fR: P['서기'].fR, dy: 0 }, look: [0.4, -0.4] });
    const card = (x, y, inner, rot) => fkAt(x, y, `<rect x="-120" y="-110" width="240" height="220" rx="30" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="-104" y="-94" width="208" height="188" rx="22" fill="none" stroke="#5B4FCF" stroke-width="5" stroke-dasharray="16 10"/>${inner}`, 1, rot);
    h += fkAt(1590, 210, spBill('#F6C35A', 1), 1.55, -10);
    h += card(1010, 330, `<g transform="scale(1.6)">${spTag('대리', 1.3)}</g>`, -8) + card(1760, 640, `<g transform="scale(3)">${GF_ICON.building(1)}</g>`, 8);
    h += gfEmote(1, 0, 1080, 560, 'bang', { hold: 9, s: 1.3 });
    [[1180, 110, 1.1], [1840, 400, 0.9], [960, 620, 0.9]].forEach(([x, y, k]) => { h += tSpark(x, y, k); });
    h += fkAt(1640, 990, fkHearts(9, 5, {}), 1.4);
  }
  if (kind === 'C') {   // 도트 레트로: 새벽하늘, 하트가 다시 차오르는 제로
    let b = `<defs><linearGradient id="tDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B3F8C"/><stop offset=".55" stop-color="#C77DBA"/><stop offset="1" stop-color="#FFC48A"/></linearGradient></defs><rect x="-200" y="-100" width="2400" height="1300" fill="url(#tDawn)"/>`;
    for (let i = 0; i < 40; i++) b += `<rect x="${(i * 397) % 1900}" y="${(i * 173) % 520}" width="12" height="12" fill="#FFF3C4" opacity="${0.4 + (i % 3) * 0.2}"/>`;
    b += `<circle cx="1780" cy="900" r="230" fill="#FFE38A"/><circle cx="1780" cy="900" r="300" fill="#FFE38A" opacity=".35"/><rect x="-200" y="900" width="2400" height="300" fill="#6E5AA8"/><rect x="-200" y="980" width="2400" height="300" fill="#4E3F84"/>`;
    let f = TZ(1390, 560, 2.3, { ex: 'z빵긋', look: [0, -0.2] });
    const hy = 130; for (let i = 0; i < 5; i++) { const x = 1010 + i * 185, full = i < 3; f += tHeart(x, hy, 1.9, full ? '#FF5A7A' : '#2E2A5A'); }
    f += tSpark(1470, hy - 70, 1.0) + tSpark(1300, hy + 80, 0.8) + `<path d="M1380 ${hy + 160} l0 -84 m-40 40 l40 -40 l40 40" fill="none" stroke="#7CF29A" stroke-width="22" stroke-linecap="square"/>`;
    h += gfStyleDefs('pixel') + gfStyled('pixel', b, f, 1);
  }
  return h + `</svg>`;
}

/* ===== v2(운영자 2026-11-16 "좀 더 매력적으로, 클릭하고 싶게"): 대비·이야기·큰 감정·스티커 테두리 =====
   A2 전후 대비: 왼쪽 회색 만원 지하철에서 찌부된 제로 → 오른쪽 햇살 거리에서 활짝 뜬 제로 ("출근길이 / 가벼워진 이유", 0:27)
   B2 게임 머니: 진한 남보라 집중선 + 놀란 제로 손의 5만 원권 느낌 지폐가 반쯤 도트 동전으로 바뀌며 터짐 ("내 월급이 / 게임 머니?", 0:13·1:06)
   C2 도트 보스전: 왕관 쓴 밀 대왕이 점선 목줄로 작은 직장인 제로를 끌고 있음 ("밀한테 / 길들여졌다고?", 2:05~2:16) */
const T_STICK = `<defs><filter id="tStick" x="-25%" y="-25%" width="150%" height="150%"><feMorphology in="SourceAlpha" operator="dilate" radius="12" result="d"/><feFlood flood-color="#fff"/><feComposite in2="d" operator="in" result="w"/>` +
  `<feDropShadow in="w" dx="0" dy="12" stdDeviation="12" flood-color="#000" flood-opacity=".38" result="ws"/><feMerge><feMergeNode in="ws"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
  `<filter id="tGray" x="0" y="0" width="100%" height="100%"><feColorMatrix type="saturate" values=".12"/><feComponentTransfer><feFuncR type="linear" slope=".62" intercept=".03"/><feFuncG type="linear" slope=".64" intercept=".04"/><feFuncB type="linear" slope=".72" intercept=".08"/></feComponentTransfer></filter></defs>`;
const tBurst = (cx, cy, n, c1, c2) => { let s = `<rect width="1920" height="1080" fill="${c1}"/>`; for (let i = 0; i < n; i++) { const a0 = i * 2 * Math.PI / n, a1 = a0 + Math.PI / n; s += `<path d="M${cx} ${cy} L${f1(cx + Math.cos(a0) * 2600)} ${f1(cy + Math.sin(a0) * 2600)} L${f1(cx + Math.cos(a1) * 2600)} ${f1(cy + Math.sin(a1) * 2600)} Z" fill="${c2}"/>`; } return s; };
function spThumb2(kind, bg) {
  let h = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">` + fkDefs() + T_STICK;
  if (kind === 'A2') {
    // 오른쪽: 햇살 거리 + 큰 제로
    h += `<image href="${bg}" x="0" y="0" width="1920" height="1080" preserveAspectRatio="xMidYMid slice"/>`;
    h += `<defs><radialGradient id="tGlow2" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6D6" stop-opacity="1"/><stop offset="1" stop-color="#FFF6D6" stop-opacity="0"/></radialGradient></defs><ellipse cx="1440" cy="470" rx="640" ry="600" fill="url(#tGlow2)"/>`;
    [[1080, 200, 1.6, -14], [1850, 250, 1.5, 16], [1110, 760, 1.2, -8], [1860, 780, 1.5, 12]].forEach(([x, y, k, r]) => { h += tHeart(x, y, k, '#FF7AA2', r); });
    [[1250, 90, 1.1], [1700, 110, 1.3], [1000, 520, 1.0]].forEach(([x, y, k]) => { h += tSpark(x, y, k); });
    h += `<g filter="url(#tStick)">${TZ(1450, 470, 2.4, { ex: 'z빵긋', pose: '만세', rot: -5 })}</g>`;
    // 왼쪽: 회색 만원 지하철(전) — 대각선으로 잘라 붙임
    let L = `<rect width="1920" height="1080" fill="#3C4560"/>`;
    for (let i = 0; i < 4; i++) L += `<rect x="${60 + i * 260}" y="140" width="200" height="190" rx="22" fill="#232B45" stroke="#1A1F33" stroke-width="6"/>`;
    for (let i = 0; i < 9; i++) L += `<line x1="${(i * 137) % 900}" y1="0" x2="${(i * 137) % 900 - 60}" y2="1080" stroke="#9AA6C4" stroke-width="3" opacity=".35"/>`;
    [[110, 1.05, 0], [330, 1.1, 1], [650, 1.0, 5], [820, 1.08, 8]].forEach(([x, s, i]) => { L += gfActor(spPass(i), { x, y: 1260, s, t: 1, pose: '서기', ex: fEx('z멍'), look: [x < 480 ? 0.6 : -0.6, 0], seed: 80 + i }); });
    L += gfActor(SPZW, { x: 470, y: 1250, s: 1.25, t: 1, pose: SP_P.strap, ex: fEx('z멘붕'), look: [0, -0.3], seed: 3, sweat: true, headSq: [0.82, 1.08] }, { sx: 0.7, sy: 1.1 });
    h += `<defs><clipPath id="tCut"><path d="M0 0 L900 0 L700 1080 L0 1080 Z"/></clipPath></defs><g clip-path="url(#tCut)"><g filter="url(#tGray)">${L}</g></g>`;
    h += `<path d="M900 -10 L700 1090" stroke="#fff" stroke-width="22"/><path d="M900 -10 L700 1090" stroke="${INK}" stroke-width="6" stroke-dasharray="26 18"/>`;
    h += fkAt(800, 560, `<circle r="70" fill="#FFE14A" stroke="${INK}" stroke-width="8"/><path d="M-30 0 H22 M2 -22 L26 0 L2 22" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`);
  }
  if (kind === 'B2') {
    h += tBurst(1380, 470, 36, '#2E2A6E', '#3E3A92');
    h += `<defs><radialGradient id="tGlow3" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE38A" stop-opacity=".55"/><stop offset="1" stop-color="#FFE38A" stop-opacity="0"/></radialGradient></defs><ellipse cx="1380" cy="470" rx="700" ry="620" fill="url(#tGlow3)"/>`;
    h += `<g filter="url(#tStick)">${TZ(1400, 520, 2.35, { ex: 'z충격', look: [0.35, -0.55], pose: { armL: [[148, 285], [96, 230], [70, 160]], hL: [64, 150], armR: [[252, 285], [304, 228], [330, 160]], hR: [336, 150], legL: P['서기'].legL, fL: P['서기'].fL, legR: P['서기'].legR, fR: P['서기'].fR, dy: 0 } })}</g>`;
    // 머리 위의 지폐: 오른쪽 절반이 도트 동전으로 부서짐
    const bill = `<g filter="url(#tStick)"><g transform="scale(2.2)">${spBill('#F6C35A', 1)}</g></g>`;
    h += `<defs><clipPath id="tHalf"><rect x="-400" y="-200" width="400" height="400"/></clipPath></defs>` + fkAt(1330, 140, `<g clip-path="url(#tHalf)">${bill}</g>`, 1, -8);
    for (let i = 0; i < 26; i++) { const r = (i * 0.618) % 1, x = 1330 + 20 + (i % 6) * 46 + r * 30, y = 70 + Math.floor(i / 6) * 40 + ((i % 2) * 12); h += `<rect x="${f1(x)}" y="${f1(y)}" width="30" height="30" fill="${['#F6C35A', '#EFA24A', '#FFE38A', '#E08A2A'][i % 4]}" stroke="${INK}" stroke-width="3" transform="rotate(-8 1330 140)"/>`; }
    [[1720, 120, 1.5], [1810, 300, 1.2], [1650, 360, 1.0], [1880, 520, 1.3], [1760, 680, 1.1]].forEach(([x, y, k], i) => { h += fkAt(x, y, `<rect x="-26" y="-26" width="52" height="52" fill="#FFD84A" stroke="${INK}" stroke-width="6"/><rect x="-12" y="-12" width="24" height="24" fill="#FFF3A8"/><rect x="-26" y="-26" width="52" height="52" fill="none" stroke="#E0A92A" stroke-width="4"/>`, k, i * 12); });
    [[1060, 160, 1.3], [1100, 640, 1.0], [1880, 860, 1.2]].forEach(([x, y, k]) => { h += tSpark(x, y, k); });
    h += gfEmote(1, 0, 1700, 470, 'bang', { hold: 9, s: 1.6 });
  }
  if (kind === 'C2') {
    let b = `<defs><linearGradient id="tBoss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A1E4E"/><stop offset=".6" stop-color="#8E3B5E"/><stop offset="1" stop-color="#E88A4A"/></linearGradient></defs><rect x="-200" y="-100" width="2400" height="1300" fill="url(#tBoss)"/>`;
    for (let i = 0; i < 30; i++) b += `<rect x="${(i * 397) % 1900}" y="${(i * 173) % 420}" width="12" height="12" fill="#FFF3C4" opacity="${0.35 + (i % 3) * 0.2}"/>`;
    b += `<path d="M-200 900 Q400 860 960 900 Q1500 940 2200 880 L2200 1300 L-200 1300 Z" fill="#E0A93E"/><path d="M-200 990 Q500 960 1100 1000 Q1600 1030 2200 980 L2200 1300 L-200 1300 Z" fill="#C98A2E"/>`;
    for (let i = 0; i < 60; i++) b += `<rect x="${(i * 97) % 2100 - 100}" y="${900 + (i % 5) * 30}" width="14" height="40" fill="#F2C14E"/>`;
    let f = fkAt(1430, 520, spWheatKing(1.1, { smirk: 1, armUp: true }), 1.12);
    const zx = 660, zy = 1075, zs = 1.0, lx = 1430 + SP_KING_L(true)[0] * 1.12, ly = 520 + SP_KING_L(true)[1] * 1.12;
    f += `<path d="M${f1(lx)} ${f1(ly)} Q${f1((lx + zx) / 2)} ${f1(ly + 60)} ${zx + 20} ${f1(zy - 330 * zs)}" fill="none" stroke="${INK}" stroke-width="34" stroke-dasharray="44 22"/><path d="M${f1(lx)} ${f1(ly)} Q${f1((lx + zx) / 2)} ${f1(ly + 60)} ${zx + 20} ${f1(zy - 330 * zs)}" fill="none" stroke="#FFD84A" stroke-width="22" stroke-dasharray="44 22"/>`;
    f += gfActor(SPZW, { x: zx, y: zy, s: zs, t: 1, pose: SP_P.pant, ex: fEx('z충격'), look: [0.7, -0.6], seed: 3, rot: 10, headDy: 10, sweat: true, holdL: SP_BAG });
    f += `<ellipse cx="${zx + 10}" cy="${f1(zy - 318 * zs)}" rx="62" ry="16" fill="none" stroke="#FFC85A" stroke-width="10" stroke-dasharray="14 10"/>`;
    f += fkAt(1430, 60, `<rect x="-330" y="-26" width="660" height="52" rx="14" fill="#2A1E4E" stroke="#fff" stroke-width="6"/><rect x="-316" y="-14" width="632" height="28" rx="8" fill="#FF5A7A"/>`);
    h += gfStyleDefs('pixel') + `<g filter="url(#tStick)">${gfStyled('pixel', b, f, 1)}</g>`;
  }
  return h + `</svg>`;
}
