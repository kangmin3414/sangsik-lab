/* thumbnails v2 "poster" set — flat saturated bg + burst rays, Zero cutout (sticker outline), 2 giant lines. 1920x1080 world. */
const TK = { yellow: '#FFD21F', orange: '#FF8A2A', cyan: '#27C6E8', green: '#3FD36E', navy: '#101A3A', purple: '#4B2E9B', blue: '#1E5BFF', pink: '#FF5C9A', dark: '#0B0F1E' };
const hexa = (c, a) => c + Math.round(a * 255).toString(16).padStart(2, '0');
function rays(cx, cy, c1, c2, n = 22, rot = 0) {
  let s = `<rect x="-50" y="-50" width="2020" height="1180" fill="${c1}"/>`;
  for (let i = 0; i < n; i++) { const a0 = rot + i / n * 6.2832, a1 = rot + (i + 0.5) / n * 6.2832, R = 2600; s += `<path d="M${cx} ${cy} L${f1(cx + Math.cos(a0) * R)} ${f1(cy + Math.sin(a0) * R)} L${f1(cx + Math.cos(a1) * R)} ${f1(cy + Math.sin(a1) * R)} Z" fill="${c2}"/>`; }
  return s;
}
function dots(c, op = .18, x0 = 0, x1 = 1920, y0 = 0, y1 = 1080, step = 34) {
  let s = ''; for (let y = y0; y < y1; y += step) for (let x = x0 + ((y / step) % 2) * step / 2; x < x1; x += step) s += `<circle cx="${x}" cy="${y}" r="${f1(5 + 5 * (1 - (x - x0) / (x1 - x0)))}" fill="${c}" opacity="${op}"/>`;
  return s;
}
const TX = (x, y, t, size, fill, o = {}) => { const sw = o.sw || size * 0.22; return `<g transform="translate(${x} ${y}) rotate(${o.rot || 0})"><text x="3" y="${size * 0.1 + 9}" font-family="${FONT}" font-weight="900" font-size="${size}" stroke="#000" stroke-width="${sw}" stroke-linejoin="round" fill="#000" opacity=".55" text-anchor="${o.anchor || 'start'}">${esc(t)}</text><text x="0" y="0" font-family="${FONT}" font-weight="900" font-size="${size}" stroke="#000" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke" fill="${fill}" text-anchor="${o.anchor || 'start'}">${esc(t)}</text></g>`; };
const TB = (x, y, t, size, fill, bar, o = {}) => { const w = t.length * size * 0.93 + 60, h = size * 1.32; return `<g transform="translate(${x} ${y}) rotate(${o.rot || 0})"><rect x="9" y="${-size * 1.05 + 12}" width="${w}" height="${h}" rx="18" fill="#000" opacity=".5"/><rect x="0" y="${-size * 1.05}" width="${w}" height="${h}" rx="18" fill="${bar}" stroke="#000" stroke-width="10"/><text x="${w / 2}" y="${size * 0.02}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${size}" fill="${fill}">${esc(t)}</text></g>`; };
const KICK = (x, y, t, size, bg = '#fff', col = '#111', o = {}) => { const w = t.length * size * 0.9 + 56, h = size * 1.5; return `<g transform="translate(${x} ${y}) rotate(${o.rot || 0})"><rect x="6" y="${-h * 0.72 + 8}" width="${w}" height="${h}" rx="${h / 2}" fill="#000" opacity=".5"/><rect x="0" y="${-h * 0.72}" width="${w}" height="${h}" rx="${h / 2}" fill="${bg}" stroke="#000" stroke-width="8"/><text x="${w / 2}" y="${size * 0.1}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${size}" fill="${col}">${esc(t)}</text></g>`; };
const ZS = (t, x, y, s, pose, ex, o = {}) => `<g filter="url(#sticker)">${char(Object.assign({ goggles: 'none', vest: TEE, patch: false, tee: true, vshade: 'rgba(150,60,0,0.22)', topknot: false, robe: false, t, seed: 11, x, y, s, pose, ex: exprAt([[0, ex]], 3), look: [0.1, 0.1] }, o))}</g>`;
const GREY = (t, x, y, s, ex = '기본', seed = 3, pose = '서기') => char({ goggles: 'none', vest: '#8A93A3', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', t, seed, x, y, s, pose, ex: exprAt([[0, ex]], 3), look: [0.6, 0.1] });
const bigQ = (x, y, size, c, rot = 0) => `<text x="${x}" y="${y}" text-anchor="middle" transform="rotate(${rot} ${x} ${y})" font-family="${FONT}" font-weight="900" font-size="${size}" stroke="#000" stroke-width="${size * 0.1}" stroke-linejoin="round" paint-order="stroke" fill="${c}">?</text>`;
const STICKER_DEFS = `<defs><filter id="sticker" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="9" result="d"/><feFlood flood-color="#fff"/><feComposite in2="d" operator="in" result="w"/><feMorphology in="SourceAlpha" operator="dilate" radius="14" result="d2"/><feFlood flood-color="#000"/><feComposite in2="d2" operator="in" result="k"/><feMerge><feMergeNode in="k"/><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
const TNS = {};
const ZX = 1520, ZY = 1250, ZSC = 2.05;
const HG = (lx, ly, x = ZX, y = ZY, s = ZSC) => [x + (lx - 200) * s, y + (ly - 560) * s];
const HND = (lx, ly, x = ZX, y = ZY, s = ZSC) => { const [a, b] = HG(lx, ly, x, y, s); return hand(a, b, s * 0.95); };
const TXT = (l1, s1, l2, s2, bar, kick, kbg, o = {}) => { const yb = Math.max(570, 372 + 1.05 * s2), yk = yb + 0.27 * s2 + 92; return TX(70, 330, l1, s1, '#fff') + TB(70, yb, l2, s2, o.barText || '#111', bar, { rot: -2 }) + KICK(80, yk, kick, o.ks || 60, o.kc || kbg || '#111', o.kt || (kbg ? '#111' : bar), { rot: -2 }); };
// 005 니체 A — everybody runs, Zero stops
TNS['005_니체_A'] = (t) => {
  let h = rays(ZX, 520, TK.yellow, '#FFC400', 20, 0.1) + dots('#E8A200', .35, 0, 1920, 640, 1080);
  for (let i = 0; i < 8; i++) h += char({ goggles: 'none', vest: '#8A93A3', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', t, seed: 3 + i, x: 110 + i * 140, y: 1075, s: 0.6, pose: walkPose(i * 0.9, 1.5), ex: exprAt([[0, '지침']], 3), look: [0.8, 0.1] });
  h += ZS(t, ZX, ZY, ZSC, '손인사', '뿌듯');
  h += TXT('다들 달리는데', 175, '나만 멈췄다', 200, '#fff', '니체가 답했다', null, { barText: '#111', kc: '#111', kt: TK.yellow });
  return h;
};
// 005 니체 B — giant ? and a lost Zero
TNS['005_니체_B'] = (t) => {
  let h = rays(ZX, 540, '#1B2B6B', '#22388A', 20, 0.3) + `<circle cx="${ZX}" cy="520" r="560" fill="url(#glow)" opacity=".8"/>`;
  h += bigQ(1790, 640, 900, TK.yellow, 10) + bigQ(1200, 220, 260, '#fff', -14);
  h += ZS(t, ZX - 40, ZY, ZSC, '서기', '걱정');
  h += TXT('뭘 위해 사는지', 160, '모르겠다면', 190, TK.yellow, '140년 전 니체의 답', null, { kc: TK.yellow, kt: '#111', ks: 60 });
  return h;
};
// 006 스토아 — storm outside, Zero calm with tea
TNS['006_스토아'] = (t) => {
  let h = rays(ZX, 520, '#3A2A88', '#4B38A8', 18, 0.2);
  h += `<path d="M1190 -20 L1110 260 L1220 250 L1130 520 L1340 190 L1230 200 L1320 -20 Z" fill="${TK.yellow}" stroke="#000" stroke-width="10" stroke-linejoin="round"/>`;
  [[1260, 560, -14, '99+'], [1810, 160, 12, '!!'], [1840, 760, -8, '99+'], [1180, 880, 10, '!']].forEach(([x, y, r, tx]) => h += `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-70" y="-100" width="140" height="200" rx="28" fill="#1F2D44" stroke="#000" stroke-width="9"/><circle cx="52" cy="-92" r="38" fill="${TK.orange}" stroke="#000" stroke-width="7"/>${rtext(52, -78, tx, 36, '#fff')}</g>`);
  [[1270, 130, -25], [1850, 450, 30], [1700, 900, 15]].forEach(([x, y, r]) => h += `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-80" y="-56" width="160" height="112" fill="#fff" stroke="#000" stroke-width="7"/><path d="M-56 -22 H56 M-56 4 H40 M-56 30 H52" stroke="#9aa" stroke-width="7"/></g>`);
  h += ZS(t, ZX, ZY, ZSC, '책상', '졸림');
  const [mx, my] = HG(203, 376);
  h += `<g transform="translate(${mx} ${my + 20})"><rect x="-75" y="-62" width="150" height="124" rx="22" fill="#fff" stroke="#000" stroke-width="10"/><path d="M75 -30 q60 0 60 42 q0 42 -60 42" fill="none" stroke="#000" stroke-width="12"/><path d="M-30 -92 q-20 -30 0 -60 M22 -92 q-20 -30 0 -60" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/></g>` + HND(182, 376) + HND(224, 376);
  h += TXT('난리 났는데', 175, '나만 평온', 195, TK.cyan, '로마 황제의 습관', TK.yellow);
  return h;
};
// 007 데카르트 — breaking-news banner + magnifier
TNS['007_데카르트'] = (t) => {
  let h = rays(ZX, 520, TK.orange, '#FF7A12', 20, 0.4) + dots('#C95600', .3, 0, 1920, 0, 1080, 40);
  h += `<g transform="translate(420 930) rotate(-5)"><rect x="-340" y="-70" width="700" height="150" rx="14" fill="#111" stroke="#000" stroke-width="8"/><rect x="-340" y="-70" width="250" height="150" rx="14" fill="${TK.yellow}" stroke="#000" stroke-width="8"/>${rtext(-215, 28, '속보', 90, '#111')}${rtext(150, 24, '충격 발언 "…"', 52, '#fff')}</g>`;
  h += ZS(t, ZX, ZY, ZSC, '손인사', '결심');
  const [hx, hy] = HG(322, 170);
  h += `<path d="M${ZX + 150} ${hy - 6} L${hx + 160} ${hy + 40}" stroke="#000" stroke-width="64" stroke-linecap="round"/><path d="M${ZX + 150} ${hy - 6} L${hx + 160} ${hy + 40}" stroke="#6B4A2E" stroke-width="40" stroke-linecap="round"/>`;
  h += `<g transform="translate(${ZX - 20} ${hy - 30})"><circle r="205" fill="#bfe8ff" opacity=".4" stroke="#000" stroke-width="24"/><circle r="205" fill="none" stroke="${TK.yellow}" stroke-width="8"/><path d="M-120 -110 q30 -60 100 -80" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity=".7"/></g>`;
  h += HND(322, 170);
  h += TXT('똑똑해도', 190, '속는다', 220, '#fff', '하버드생 절반도', null, { kc: '#111', kt: TK.yellow, ks: 62 });
  return h;
};
// 008 장자 — uselessness wins: relaxed Zero + snapped ruler
TNS['008_장자'] = (t) => {
  let h = rays(ZX, 540, '#2FC764', '#27B558', 20, 0.2) + dots('#1E9E48', .3, 0, 1920, 500, 1080);
  h += `<g transform="translate(1330 960) rotate(-4)"><g transform="rotate(-6 -300 0)"><rect x="-620" y="-48" width="520" height="96" fill="#F2D39B" stroke="#000" stroke-width="10"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="${-590 + i * 60}" y1="-48" x2="${-590 + i * 60}" y2="${i % 2 ? -14 : 4}" stroke="#000" stroke-width="6"/>`).join('')}</g><g transform="rotate(7 300 0)"><rect x="60" y="-40" width="560" height="96" fill="#F2D39B" stroke="#000" stroke-width="10"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<line x1="${90 + i * 60}" y1="-40" x2="${90 + i * 60}" y2="${i % 2 ? -6 : 12}" stroke="#000" stroke-width="6"/>`).join('')}</g></g>`;
  h += ZS(t, ZX, ZY, ZSC, '서기', '졸림');
  h += TXT('쓸모없어서', 185, '살아남았다', 200, '#fff', '2,300년 전 반전', TK.yellow).replace(`fill="#111">${esc('살아남았다')}`, `fill="#111">${esc('살아남았다')}`);
  return h;
};
// 009 소크라테스 — one raised hand vs blank crowd
TNS['009_소크라테스'] = (t) => {
  let h = rays(ZX, 520, TK.cyan, '#17B6DA', 20, 0.5);
  for (let i = 0; i < 4; i++) h += GREY(t, 900 + i * 180, 1070, 0.95, '졸림', 4 + i);
  h += bigQ(1190, 250, 240, '#fff', -12);
  h += ZS(t, ZX, ZY, ZSC, '손인사', '결심');
  h += TXT('"모르겠어요"', 165, '했더니?', 225, TK.yellow, '연구 결과는 반대', null, { kc: '#fff', kt: '#111', ks: 62 });
  return h;
};
// 010 붓다 — pie chart: 46.9% mind wandering
TNS['010_붓다'] = (t) => {
  let h = rays(1350, 540, '#FF9A3D', '#FF8A20', 18, 0.1);
  const cx = 1350, cy = 430, R = 340, a = 0.469 * 2 * Math.PI, sa = -Math.PI / 2;
  const px = (ang) => [f1(cx + Math.cos(ang) * R), f1(cy + Math.sin(ang) * R)];
  const [x0, y0] = px(sa), [x1, y1] = px(sa + a);
  h += `<circle cx="${cx + 12}" cy="${cy + 16}" r="${R}" fill="#000" opacity=".4"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="#000" stroke-width="12"/><path d="M${cx} ${cy} L${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1} Z" fill="${TK.navy}" stroke="#000" stroke-width="12" stroke-linejoin="round"/>`;
  h += `<g transform="translate(1560 300) rotate(12)">${phone(0, 0, 0.8, { on: false })}</g>` + rtext(1585, 480, '딴생각', 70, '#fff');
  h += TX(cx - 50, 640, '46.9%', 190, TK.yellow, { anchor: 'middle', rot: -4 });
  h += ZS(t, 1720, 1430, 1.35, '서기', '뿌듯');
  h += TXT('밥 먹는 시간의', 150, '절반은 딴생각', 140, '#fff', '깨어 있는 시간의 평균', null, { kc: '#111', kt: TK.yellow, ks: 54 });
  return h;
};
// 011 시간 — calendar pages flying
TNS['011_시간'] = (t) => {
  let h = rays(ZX, 540, '#7A4DFF', '#6A3DF0', 20, 0.3);
  for (let i = 0; i < 9; i++) h += `<line x1="${1200 + i * 80}" y1="${120 + (i * 97) % 760}" x2="${1700 + i * 80}" y2="${120 + (i * 97) % 760}" stroke="#fff" stroke-width="7" opacity=".35" stroke-linecap="round"/>`;
  [[1230, 170, -20, 1], [1260, 850, 15, 2], [1830, 140, 22, 3], [1850, 760, -14, 4]].forEach(([x, y, r, n]) => h += `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-120" y="-100" width="240" height="200" rx="12" fill="#fff" stroke="#000" stroke-width="9"/><rect x="-120" y="-100" width="240" height="60" rx="12" fill="${TK.pink}" stroke="#000" stroke-width="9"/>${rtext(0, 70, String(n * 2 + 1), 100, '#111')}</g>`);
  h += ZS(t, ZX, ZY, ZSC, '허우적', '놀람');
  h += TXT('1년이 왜', 190, '이렇게 빠를까', 160, TK.yellow, '시간을 늘리는 법', '#fff');
  return h;
};
// 012 화 — finger over SEND
TNS['012_화'] = (t) => {
  let h = rays(ZX, 540, '#2A1030', '#3A1640', 20, 0.2) + `<circle cx="${ZX}" cy="560" r="560" fill="${TK.orange}" opacity=".28"/>`;
  h += ZS(t, ZX, ZY, ZSC, '책상', '화남');
  const [px_, py_] = HG(203, 400);
  h += `<g transform="translate(${px_} ${py_ - 30}) rotate(-6)"><rect x="-240" y="-125" width="480" height="250" rx="30" fill="#fff" stroke="#000" stroke-width="12"/><rect x="-210" y="-97" width="420" height="76" rx="16" fill="#E9EEF7" stroke="#000" stroke-width="6"/>${rtext(0, -42, '너 진짜 왜 그래?', 44, '#444')}<rect x="-125" y="8" width="250" height="88" rx="44" fill="${TK.orange}" stroke="#000" stroke-width="10"/>${rtext(0, 70, '전송', 58, '#fff')}</g>`;
  h += HND(182, 376) + HND(224, 376);
  [[1830, 300], [1230, 180]].forEach(([x, y]) => h += `<g transform="translate(${x} ${y})"><circle r="48" fill="#fff" opacity=".85" stroke="#000" stroke-width="7"/><circle cx="46" cy="-20" r="32" fill="#fff" opacity=".85" stroke="#000" stroke-width="7"/></g>`);
  h += TXT('화났을 때', 190, '보내기 전에', 190, TK.orange, '딱 하루만', TK.yellow);
  return h;
};
// 013 행복 — three stars + notebook
TNS['013_행복'] = (t) => {
  let h = rays(ZX, 560, '#14224F', '#1A2C66', 20, 0.4);
  const star = (x, y, s, r) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><circle r="140" fill="url(#warm)"/><path d="M0 -100 L29 -32 L100 -26 L46 20 L62 90 L0 54 L-62 90 L-46 20 L-100 -26 L-29 -32 Z" fill="${TK.yellow}" stroke="#000" stroke-width="12" stroke-linejoin="round"/></g>`;
  h += star(1190, 200, 1.3, -12) + star(1520, 90, 1.6, 0) + star(1830, 220, 1.3, 14);
  h += ZS(t, ZX, ZY + 40, ZSC, '책상', '뿌듯');
  const [nx, ny] = HG(203, 400, ZX, ZY + 40);
  h += `<g transform="translate(${nx} ${ny + 40}) rotate(-6)"><rect x="-230" y="-110" width="460" height="220" rx="14" fill="#8A5A2B" stroke="#000" stroke-width="10"/><rect x="-208" y="-90" width="416" height="180" fill="#FFF3CF" stroke="#000" stroke-width="6"/><path d="M-160 -45 H130 M-160 0 H100 M-160 45 H120" stroke="#B9A57A" stroke-width="8"/></g>`;
  h += HND(182, 376, ZX, ZY + 40) + HND(224, 376, ZX, ZY + 40);
  h += TXT('좋은 일 없는 날', 150, '별 세 개', 230, TK.yellow, '일주일 뒤 달라진 것', null, { kc: '#fff', kt: '#111', ks: 60 });
  return h;
};
// 몰아보기 — 4 moods grid
TNS['몰아보기01'] = (t) => {
  let h = rays(1500, 540, '#35D6A0', '#2CC592', 20, 0.2);
  [['걱정', '#FFD21F', 1160, 70], ['놀람', '#FF8A2A', 1540, 100], ['졸림', '#27C6E8', 1170, 520], ['신남', '#FF5C9A', 1550, 550]].forEach(([ex, c, x, y], i) => {
    h += `<g transform="translate(${x} ${y}) rotate(${i % 2 ? 3 : -3})"><clipPath id="cc${i}"><rect x="0" y="0" width="340" height="400" rx="34"/></clipPath><rect x="0" y="0" width="340" height="400" rx="34" fill="${c}" stroke="#000" stroke-width="12"/><g clip-path="url(#cc${i})">${char({ goggles: 'none', vest: TEE, patch: false, tee: true, vshade: 'rgba(150,60,0,0.22)', t, seed: 10 + i, x: 170, y: 640, s: 0.9, pose: '서기', ex: exprAt([[0, ex]], 3), look: [0.1, 0.1] })}</g></g>`;
  });
  h += TXT('흔들릴 때 꺼내 보는', 108, '철학 4편', 240, TK.yellow, '한 번에 몰아보기', null, { kc: '#fff', kt: '#111', ks: 66 });
  return h;
};
window.TNS = TNS;
window.thumb = (name) => { document.getElementById('v').innerHTML = defs(2) + STICKER_DEFS + TNS[name](2); };
