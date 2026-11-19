/* 기게스의 반지 편 썸네일 3종(1920×1080, 글자는 mk.py가 PIL로 얹음). anim_gy.html 위에서 불러 씀.
   모두 첫 30초 안의 장면: 0:05 "안경테를 톡 → 눈앞에 정답", 0:11 "적발 확률 0.01%", 0:18 "아무도 모른다는 100%의 확신이 있다면 … 이 AI 안경을 쓰시겠습니까?"
   A 렌즈에 정답이 뜨는 제로(히죽)  B 어깨 위 악마의 속삭임(소름)  C 빛나는 안경을 앞에 두고 망설이는 제로(땀)
   규칙: 제로는 오른쪽 절반에 크게(머리 ≈ 화면 높이 44%), 왼쪽 40%는 글자 자리, 그림 안에 글자·숫자 없음, 다른 사람은 회색 둥근 머리, 실존 인물·철학자 얼굴 없음. */
const TG_STICK = `<defs><filter id="tgStick" x="-25%" y="-25%" width="150%" height="150%"><feMorphology in="SourceAlpha" operator="dilate" radius="12" result="d"/><feFlood flood-color="#fff"/><feComposite in2="d" operator="in" result="w"/>` +
  `<feDropShadow in="w" dx="0" dy="12" stdDeviation="12" flood-color="#000" flood-opacity=".45" result="ws"/><feMerge><feMergeNode in="ws"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
  `<radialGradient id="tgGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7FD8FF" stop-opacity=".75"/><stop offset="1" stop-color="#7FD8FF" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="tgRed" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FF4A4A" stop-opacity=".55"/><stop offset="1" stop-color="#FF4A4A" stop-opacity="0"/></radialGradient>` +
  `<linearGradient id="tgRoom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151C38"/><stop offset="1" stop-color="#26305A"/></linearGradient></defs>`;
const tgAt = (x, y, inner, s = 1, r = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${r}) scale(${s})">${inner}</g>`;
const TGZ = (x, headY, s, o = {}) => gyZero(Object.assign({ x, y: headY + 390 * s, s, t: 1.2, pose: '서기', look: [-0.3, -0.1], glow: 1 }, o), o.m || {});
/* 회색 둥근 머리 수험생(뒷모습, 책상 줄) */
const tgCrowd = (y, n, s, x0 = 60, gap = 210, op = 1) => { let h = ''; for (let i = 0; i < n; i++) { const x = x0 + i * gap; h += `<g opacity="${op}"><rect x="${x - 70 * s}" y="${y + 40 * s}" width="${140 * s}" height="${140 * s}" rx="${30 * s}" fill="#4A5476"/><circle cx="${x}" cy="${y}" r="${54 * s}" fill="#5E6888" stroke="#20263F" stroke-width="${6 * s}"/><rect x="${x - 110 * s}" y="${y + 110 * s}" width="${220 * s}" height="${26 * s}" rx="6" fill="#6B5A4A" stroke="#20263F" stroke-width="${5 * s}"/></g>`; } return h; };
/* 홀로그램 정답 판(글자 대신 체크 표시와 줄) */
const tgHolo = (w = 260, hgt = 120) => `<g><rect x="${-w / 2}" y="${-hgt / 2}" width="${w}" height="${hgt}" rx="18" fill="#0E2A52" fill-opacity=".72" stroke="#3FA9FF" stroke-width="6"/><circle cx="${-w / 2 + 46}" cy="0" r="26" fill="#3FE08A" stroke="#0E2A52" stroke-width="5"/><path d="M${-w / 2 + 32} 0 l10 11 l20 -22" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="M${-w / 2 + 92} -16 H${w / 2 - 26} M${-w / 2 + 92} 16 H${w / 2 - 70}" stroke="#9FDBFF" stroke-width="10" stroke-linecap="round"/></g>`;
function gyThumb(kind) {
  let h = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">` + GY_DEFS + TG_STICK;
  h += `<rect width="1920" height="1080" fill="url(#tgRoom)"/>`;
  // 시험장 뒤 칠판 + 시계(숫자 없음) + 수험생 줄
  h += `<rect x="760" y="70" width="1100" height="300" rx="14" fill="#1F3A35" stroke="#0E1424" stroke-width="12" opacity=".75"/><circle cx="1790" cy="150" r="56" fill="#D9D3C4" stroke="#0E1424" stroke-width="9" opacity=".8"/><path d="M1790 150 L1790 112 M1790 150 L1818 166" stroke="#222" stroke-width="7" stroke-linecap="round"/>`;
  h += tgCrowd(560, 9, 1.0, 40, 230, 0.55) + tgCrowd(760, 9, 1.25, -40, 260, 0.75);
  if (kind === 'A') {   // 렌즈에 정답이 뜨는 제로, 히죽
    h += `<ellipse cx="1390" cy="470" rx="760" ry="640" fill="url(#tgGlow)"/>`;
    [[1090, 200, 1.1, -8], [1830, 170, 0.95, 9], [1060, 600, 0.95, -5], [1840, 560, 1.05, 7]].forEach(([x, y, s, r]) => { h += tgAt(x, y, tgHolo(), s, r); });
    h += `<g filter="url(#tgStick)">${TGZ(1400, 520, 2.2, { ex: 'z히죽', look: [0.35, -0.2] })}</g>`;
    h += tgAt(1555, 395, `<path d="M0 0 L60 -40 M10 20 L84 8 M0 40 L60 76" stroke="#BFF0FF" stroke-width="10" stroke-linecap="round"/>`, 1);   // 렌즈 빛줄기
  }
  if (kind === 'B') {   // 어깨 위 악마의 속삭임, 소름
    h += `<ellipse cx="1180" cy="330" rx="560" ry="480" fill="url(#tgRed)"/><ellipse cx="1520" cy="560" rx="560" ry="520" fill="url(#tgGlow)" opacity=".7"/>`;
    h += tgAt(1080, 380, gyDevil(1.3, 1, { grin: 1, look: 1, point: 1 }), 1.25);
    h += `<g filter="url(#tgStick)">${TGZ(1500, 540, 2.15, { ex: 'z소름', look: [-0.6, -0.15], sweat: true })}</g>`;
    h += tgAt(1240, 470, `<path d="M0 0 q30 -20 60 0 t60 0" stroke="#FF8A8A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M10 34 q30 -20 60 0 t60 0" stroke="#FF8A8A" stroke-width="9" fill="none" stroke-linecap="round" opacity=".7"/>`, 1, -12);   // 속삭임
  }
  if (kind === 'C') {   // 책상 위 빛나는 안경을 내려다보며 망설이는 제로(땀)
    h += `<ellipse cx="1420" cy="820" rx="720" ry="460" fill="url(#tgGlow)"/>`;
    h += `<g filter="url(#tgStick)">${TGZ(1430, 400, 2.35, { ex: 'z당황', look: [0, 0.8], glow: 0, noGlass: true, sweat: true })}</g>`;
    h += `<rect x="820" y="880" width="1200" height="40" rx="10" fill="#8A6A4E" stroke="${INK}" stroke-width="9"/><rect x="840" y="920" width="1160" height="200" fill="#6B5240" stroke="${INK}" stroke-width="9"/>`;
    h += hand(1180, 880, 2.0) + hand(1680, 880, 2.0);
    h += `<g filter="url(#tgStick)">${tgAt(1430, 832, gyGlasses(1, 1.1), 2.3, -4)}</g>`;
    [[1150, 690, 1.0], [1720, 680, 1.1], [1260, 760, 0.7], [1620, 770, 0.8]].forEach(([x, y, s2]) => { h += tgAt(x, y, `<path d="M0 -30 L7 -7 L30 0 L7 7 L0 30 L-7 7 L-30 0 L-7 -7 Z" fill="#BFF0FF" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`, s2); });
    h += gfEmote(1, 0, 1760, 260, 'q', { hold: 9, s: 1.5 });
  }
  return h + `</svg>`;
}
