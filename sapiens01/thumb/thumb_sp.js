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
