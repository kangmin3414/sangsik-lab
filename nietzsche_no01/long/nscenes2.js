/* 니체 거절 편 scenes, acts 2-4. Same conventions as nscenes.js. */
Object.assign(CAMS, { nchapter: 'fixed', nmoral: [1.0, 1.05, 960, 540], nlamb: [1.0, 1.1, 960, 600], nhalo: [1.0, 1.06, 960, 560], nwrap: [1.0, 1.06, 960, 560],
  nreason: [1.0, 1.06, 960, 560], nstages: [1.0, 1.04, 960, 540], nload: [1.0, 1.08, 960, 560], ndry: [1.0, 1.1, 960, 600], ngate: [1.0, 1.08, 960, 560],
  nclaw: [1.0, 1.06, 960, 540], nchain: [1.0, 1.1, 960, 560], nrefuse: [1.0, 1.06, 1000, 560], ncaption: 'fixed', nkid: [1.0, 1.07, 960, 600],
  nlist: [1.0, 1.05, 960, 520], nslice: [1.0, 1.07, 960, 560], nworld: [1.0, 1.06, 960, 560], ntwo: [1.0, 1.05, 960, 560], nmirror: [1.0, 1.08, 960, 560] });
P['거절'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [300, 300], [316, 262]], hR: [320, 254] }, NLEGS);
P['안기'] = Object.assign({ armL: [[148, 285], [178, 330], [238, 318]], hL: [242, 314], armR: [[252, 285], [222, 330], [162, 318]], hR: [158, 314] }, NLEGS);
P['이고가기'] = Object.assign({ armL: [[148, 285], [100, 200], [112, 70]], hL: [114, 60], armR: [[252, 285], [300, 200], [288, 70]], hR: [286, 60] }, NLEGS);
P['건네기'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [306, 320], [352, 318]], hR: [360, 316] }, NLEGS);
const at = (t, lt, d) => t - lt + d;  // absolute time of "d seconds into this line"
const woolOn = (x, y, s) => { // sheep ears + wool tuft on Zero's head (local head coords)
  let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s}) translate(-200 -560)">`;
  g += `<ellipse cx="78" cy="170" rx="44" ry="22" transform="rotate(-24 78 170)" fill="#fff" stroke="${INK}" stroke-width="7"/><ellipse cx="80" cy="172" rx="26" ry="10" transform="rotate(-24 80 172)" fill="#F7B9C8"/>`;
  g += `<ellipse cx="322" cy="170" rx="44" ry="22" transform="rotate(24 322 170)" fill="#fff" stroke="${INK}" stroke-width="7"/><ellipse cx="320" cy="172" rx="26" ry="10" transform="rotate(24 320 172)" fill="#F7B9C8"/>`;
  for (const [cx, cy, r] of [[150, 78, 30], [190, 62, 34], [232, 66, 32], [262, 88, 26], [128, 100, 24]]) g += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="6"/>`;
  return g + `</g>`;
};
const haloAt = (x, y, k = 1) => `<g opacity="${f1(k * 100) / 100}"><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="82" ry="20" fill="none" stroke="#7A5A00" stroke-width="18"/><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="82" ry="20" fill="none" stroke="${GOLD}" stroke-width="11"/><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="130" ry="50" fill="url(#warm)" opacity=".6"/></g>`;
const nightField = () => BG('#141C3A') + `<circle cx="1600" cy="170" r="70" fill="#EEF1D8"/><circle cx="1600" cy="170" r="130" fill="#EEF1D8" opacity=".08"/>` + `<path d="M-600 880 Q300 820 960 860 T2520 850 L2520 1500 L-600 1500 Z" fill="#1E2B4A" stroke="${INK}" stroke-width="6"/>`;
const wolfShadow = (x, y, s, t, flipIt) => { const g = `<g transform="translate(${x} ${y}) scale(${flipIt ? -s : s} ${s})"><path d="M-160 40 Q-150 -70 -40 -90 L-10 -170 L20 -100 L60 -160 L80 -80 Q170 -50 190 30 Q120 60 40 50 Q-60 70 -160 40 Z" fill="#0A0F22" stroke="${INK}" stroke-width="6"/><circle cx="40" cy="-60" r="11" fill="#FFD84A"/><circle cx="90" cy="-50" r="11" fill="#FFD84A"/><path d="M60 0 l10 18 l10 -18 l10 18 l10 -18" stroke="#fff" stroke-width="5" fill="none"/></g>`; return `<g opacity=".95">${g}</g>`; };

/* chapter card */
function nchapterScene(t, lt, a) {
  let h = BG('#0B1020') + qStarsLite();
  h += `<rect x="0" y="0" width="1920" height="1080" fill="url(#vig)"/>`;
  const k = easeOutBack(prog(lt, 0.1, 0.6));
  h += `<g transform="translate(960 380) scale(${f1(k * 100) / 100})"><circle r="92" fill="${GOLD}" stroke="${INK}" stroke-width="10"/><text x="0" y="34" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="104" fill="${INK}">${a.n}</text></g>`;
  h += rp(t, lt, 0.35, 960, 590, outlined(0, 0, [a.title], { size: 92, sw: 18 }), {});
  h += rp(t, lt, 0.6, 960, 700, label(0, 0, a.sub, { size: 44, bg: '#fff' }), { rot: -2 });
  return h;
}
/* b1: 니체가 도덕을 해체 */
function nmoralScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('#1A1A24') + `<rect x="-600" y="880" width="3120" height="600" fill="#24242F" stroke="${INK}" stroke-width="6"/><polygon points="420,-60 660,-60 820,900 260,900" fill="#FFF3C4" opacity=".1"/>`;
  h += shadow(540, 904, 80) + NZ({ t, seed: 21, x: 540, y: 900, s: 1.0, pose: poseAt([[0, '서기'], [0.35 * D, '가리킴']], lt, 0.3), ex: exprAt([[0, '결심']], lt), look: [0.9, -0.1] });
  const crack = prog(lt, 0.4 * D, 0.75 * D), fall = prog(lt, 0.78 * D, D + 0.3);
  let tab = `<rect x="-230" y="-300" width="460" height="560" rx="40" fill="#B9B4A8" stroke="${INK}" stroke-width="10"/><rect x="-190" y="-260" width="380" height="480" rx="24" fill="#CFCABD"/>` + rtext(0, 30, '도덕', 150, '#5A564C');
  const cr = [[-60, -300, 10, -120, -40, 0, 40, 140, 0, 260], [120, -300, 80, -150, 140, 20, 60, 260]];
  cr.forEach(c => { let d = `M${c[0]} ${c[1]}`; const n = Math.floor((c.length - 2) / 2 * crack); for (let i = 1; i <= n; i++) d += ` L${c[i * 2]} ${c[i * 2 + 1]}`; if (n) tab += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>`; });
  if (fall > 0) { // split into two halves that fall apart
    const L = `<g transform="translate(${f1(-90 * fall)} ${f1(380 * fall * fall)}) rotate(${f1(-25 * fall)})"><g clip-path="url(#nTabL)">${tab}</g></g>`, R = `<g transform="translate(${f1(110 * fall)} ${f1(420 * fall * fall)}) rotate(${f1(30 * fall)})"><g clip-path="url(#nTabR)">${tab}</g></g>`;
    h += `<defs><clipPath id="nTabL"><path d="M-300 -320 L-60 -300 L10 -120 L-40 0 L40 140 L0 260 L0 300 L-300 300 Z"/></clipPath><clipPath id="nTabR"><path d="M-60 -300 L10 -120 L-40 0 L40 140 L0 260 L0 300 L300 300 L300 -320 Z"/></clipPath></defs>`;
    h += `<g transform="translate(1280 520)">${L}${R}</g>`;
  } else h += `<g transform="translate(${f1(1280 + (crack > 0 ? Math.sin(t * 50) * 4 * crack : 0))} 520)">${tab}</g>`;
  if (fall > 0.2) h += rfx(t, lt, 0.82 * D, 1280, 300, '와르르', WHITE, { size: 96, burst: 170, rot: -6 });
  return h;
}
/* b4: 발톱도 이빨도 없는 양 */
function nlambScene(t, lt, a) {
  const D = a._dur || 3;
  let h = nightField();
  h += wolfShadow(260, 760, 1.2, t, false) + wolfShadow(1700, 740, 1.3, t, true);
  const x = 960, y = 900, s = 1.0, peace = lt > 0.42 * D;
  h += shadow(x, y + 4, 80) + Z({ t, seed: 14, x, y, s, pose: '웅크림', ex: exprAt([[0, '겁먹음'], [0.42 * D, '뿌듯']], lt), look: [0, 0.2], shiver: !peace });
  const hp = ptOf(x, y, s, 200, 560 + P['웅크림'].dy); h += woolOn(x, y + (P['웅크림'].dy || 0) * s, s);
  if (peace) h += haloAt(x, y - 530 * s + (P['웅크림'].dy || 0) * s + Math.sin(t * 3) * 5, prog(lt, 0.42 * D, 0.42 * D + 0.4));
  h += rtg(t, lt, 0.08 * D, 560, 250, '발톱 ✕', '#fff', { size: 48, rot: -5 });
  h += rtg(t, lt, 0.2 * D, 1360, 250, '이빨 ✕', '#fff', { size: 48, rot: 4 });
  if (peace) h += pop(t, at(t, lt, 0.5 * D), t + 99, 960, 150, `<rect x="-420" y="-56" width="840" height="112" rx="40" fill="#fff" stroke="${INK}" stroke-width="7"/>` + rtext(0, 16, '난 평화를 사랑해서 안 싸우는 거야', 50, NAVY), { rot: -1, bob: 3 });
  return h;
}
/* b5: 니체가 천사 링을 지팡이로 깨부순다 -> 자기기만 */
function nhaloScene(t, lt, a) {
  const D = a._dur || 3;
  let h = nightField();
  const zx = 1180, zy = 900, s = 1.0;
  const hit = 0.42 * D, broken = lt > hit;
  h += shadow(zx, zy + 4, 80) + Z({ t, seed: 14, x: zx, y: zy, s, pose: '서기', ex: exprAt([[0, '뿌듯'], [hit, '놀람'], [hit + 1.0, '겁먹음']], lt), look: [-0.7, -0.4] });
  h += woolOn(zx, zy, s);
  const hx = zx, hy = zy - 530 * s;
  if (!broken) h += haloAt(hx, hy + Math.sin(t * 3) * 5);
  else { const k = prog(lt, hit, hit + 1.2); for (let i = 0; i < 10; i++) { const ang = i / 10 * 6.283 + 0.3, r = 40 + 420 * easeOut(k); h += `<path d="M${f1(hx + Math.cos(ang) * r)} ${f1(hy + Math.sin(ang) * r * 0.6 + 300 * k * k)} l18 -8 l-6 22 Z" fill="${GOLD}" stroke="#7A5A00" stroke-width="4" opacity="${f1((1 - k) * 100) / 100}" transform="rotate(${f1(k * 400 + i * 40)} ${f1(hx + Math.cos(ang) * r)} ${f1(hy + Math.sin(ang) * r * 0.6 + 300 * k * k)})"/>`; } }
  // Nietzsche steps in with the cane
  const nx = lerp(-200, 640, easeOut(prog(lt, 0, 0.3 * D))), ns = 1.0;
  h += shadow(nx, 904, 80) + NZ({ t, seed: 21, x: nx, y: 900, s: ns, pose: lt > 0.3 * D ? '가리킴' : walkPose(t * 8, 0.7), ex: exprAt([[0, '결심']], lt), look: [0.9, -0.5] });
  const hand = ptOf(nx, 900, ns, 374, 244);
  const target = Math.atan2(hy - hand[1], hx - hand[0]), swing = prog(lt, 0.3 * D, hit);
  const ang = lt < 0.3 * D ? Math.PI / 2 : lerp(-Math.PI * 0.62, target, easeIn(swing)) + (broken ? Math.sin((lt - hit) * 30) * 0.05 * Math.exp(-(lt - hit) * 5) : 0);
  const len = Math.hypot(hx - hand[0], hy - hand[1]) - 70;
  if (lt > 0.3 * D) h += `<line x1="${f1(hand[0])}" y1="${f1(hand[1])}" x2="${f1(hand[0] + Math.cos(ang) * len)}" y2="${f1(hand[1] + Math.sin(ang) * len)}" stroke="#2A1E16" stroke-width="16" stroke-linecap="round"/>`;
  if (broken) h += rfx(t, lt, hit, hx, hy, '쨍!', WHITE, { size: 90, burst: 160, rot: 6 });
  h += rtg(t, lt, 0.08 * D, 1180, 150, '착한 나 ♡', '#fff', { size: 44, rot: 3 });
  if (lt > 0.62 * D) h += rp(t, lt, 0.62 * D, 760, 210, outlined(0, 0, [[['도덕', '#9AA3AE']]], { size: 88, sw: 16 }) + `<line x1="-120" y1="-30" x2="120" y2="-30" stroke="${RED}" stroke-width="14" stroke-linecap="round"/>`, { rot: -4 });
  if (lt > 0.76 * D) h += rfx(t, lt, 0.76 * D, 1180, 300, '자기기만', RED, { size: 110, burst: 230, rot: -5 });
  return h;
}
/* b6: 두려움을 '착함'으로 포장 */
function nwrapScene(t, lt, a) {
  const D = a._dur || 3;
  let h = rRoom() + rFloor(880, '#C9A576');
  h += `<rect x="760" y="700" width="760" height="40" rx="10" fill="#9A6F3E" stroke="${INK}" stroke-width="8"/><rect x="800" y="740" width="30" height="140" fill="#7A5A32" stroke="${INK}" stroke-width="6"/><rect x="1450" y="740" width="30" height="140" fill="#7A5A32" stroke="${INK}" stroke-width="6"/>`;
  const bx = 1140, by = 560, wrapK = prog(lt, 0.64 * D, 0.82 * D), ribbon = lt > 0.82 * D;
  // the box of fear
  let box = `<rect x="-200" y="-150" width="400" height="290" rx="14" fill="#5B5F6E" stroke="${INK}" stroke-width="9"/>` + rtext(0, 0, '두려움', 64, '#D9DCE5') + `<path d="M-40 60 q10 -14 20 0 q10 14 20 0 q10 -14 20 0" stroke="#D9DCE5" stroke-width="6" fill="none"/>`;
  if (wrapK > 0) { const hh = 290 * wrapK; box += `<rect x="-206" y="-156" width="412" height="${f1(hh + 6)}" rx="14" fill="#FF8FB8" stroke="${INK}" stroke-width="9"/>`; for (let i = 0; i < 6; i++) { const yy = -130 + i * 50; if (yy < -150 + hh) box += `<circle cx="${-150 + (i % 2) * 60}" cy="${yy}" r="10" fill="#fff" opacity=".7"/><circle cx="${60 + (i % 2) * 70}" cy="${yy + 10}" r="10" fill="#fff" opacity=".7"/>`; } }
  if (ribbon) box += `<rect x="-24" y="-156" width="48" height="302" fill="${GOLD}" stroke="${INK}" stroke-width="6"/><rect x="-206" y="-24" width="412" height="48" fill="${GOLD}" stroke="${INK}" stroke-width="6"/><path d="M0 -156 q-80 -70 -100 -10 q40 20 100 10 q80 -70 100 -10 q-40 20 -100 10" fill="${GOLD}" stroke="${INK}" stroke-width="6"/>`;
  h += `<g transform="translate(${bx} ${by})">${box}</g>`;
  if (ribbon) h += pop(t, at(t, lt, 0.84 * D), t + 99, 1420, 380, `<g transform="rotate(10)"><rect x="-120" y="-50" width="240" height="100" rx="14" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="-90" cy="0" r="10" fill="none" stroke="${INK}" stroke-width="5"/>` + rtext(12, 18, '착함 ♡', 50, PINK) + `</g>`, { bob: 3 });
  // three fears drop into the box
  ['상처받기 싫어', '미움받기 무서워', '갈등은 못 견뎌'].forEach((w, i) => {
    const t0 = (0.05 + i * 0.17) * D, k = prog(lt, t0, t0 + 0.9);
    if (k <= 0 || k >= 1) return;
    const yy = lerp(180, 500, easeIn(prog(k, 0.45, 1))), op = 1 - prog(k, 0.85, 1);
    h += `<g opacity="${f1(op * 100) / 100}">${label(bx + (i - 1) * 60, yy, w, { size: 40, bg: '#E3E6EE' })}</g>`;
  });
  h += rz(t, lt, 520, 900, 0.95, '비비기', [[0, '걱정'], [0.82 * D, '신남']], { sweat: lt > 0.82 * D, look: [0.8, 0] });
  return h;
}
/* b7 / b8: 진짜 이유 */
function nreasonScene(t, lt, a) {
  const D = a._dur || 3;
  if (!a.fear) {
    let h = rRoom() + rFloor(880, '#C9A576');
    h += rz(t, lt, 960, 900, 1.0, '턱괴기', [[0, '기본'], [0.6 * D, '걱정']], { look: [0.4, -0.3] });
    h += rp(t, lt, 0.15 * D, 960, 230, label(0, 0, '배려해서?', { size: 80, bg: '#fff' }), { rot: -3 });
    if (lt > 0.6 * D) { const k = prog(lt, 0.6 * D, 0.75 * D); h += `<line x1="760" y1="${f1(280 - 100 * k)}" x2="${f1(760 + 400 * k)}" y2="${f1(180 + 0 * k)}" stroke="${RED}" stroke-width="22" stroke-linecap="round"/><line x1="760" y1="180" x2="${f1(760 + 400 * k)}" y2="${f1(180 + 100 * k)}" stroke="${RED}" stroke-width="22" stroke-linecap="round"/>`; }
    return h;
  }
  let h = BG('#1C1F2E');
  const faces = [[300, 300, 1.2], [1620, 300, 1.3], [180, 760, 1.0], [1760, 780, 1.1], [960, 160, 0.9]];
  faces.forEach(([fx0, fy0, fs], i) => {
    const k = prog(lt, 0.05 * D + i * 0.1 * D, 0.05 * D + i * 0.1 * D + 0.6), push = 1 + 0.08 * prog(lt, 0.5 * D, D);
    if (k <= 0) return;
    const cx = lerp(fx0, 960, 0.12 * prog(lt, 0.5 * D, D)), cy = lerp(fy0, 560, 0.12 * prog(lt, 0.5 * D, D));
    h += `<g transform="translate(${f1(cx)} ${f1(cy)}) scale(${f1(fs * push * k * 100) / 100})" opacity=".85"><circle r="150" fill="#5A6074" stroke="${INK}" stroke-width="9"/><path d="M-80 -40 L-20 -10 M80 -40 L20 -10" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><circle cx="-45" cy="20" r="12" fill="${INK}"/><circle cx="45" cy="20" r="12" fill="${INK}"/><path d="M-50 90 Q0 60 50 90" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/></g>`;
  });
  h += shadow(960, 904, 60) + Z({ t, seed: 15, x: 960, y: 900, s: 0.7, pose: '웅크림', ex: exprAt([[0, '겁먹음']], lt), look: [Math.sin(t * 2.5) * 0.9, 0], shiver: true });
  h += rtg(t, lt, 0.45 * D, 960, 470, '싫어하면 어떡하지…', '#fff', { size: 46, rot: -2 });
  h += rp(t, lt, 0.72 * D, 960, 690, label(0, 0, '유약한 자아', { size: 60, bg: YEL }), { rot: 3, bob: 3 });
  return h;
}
/* simple flat icons for the stages */
const camelIcon = (x, y, s, c = '#D9A55A') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-150 20 Q-150 -60 -90 -70 Q-60 -140 -20 -70 Q20 -140 60 -70 Q110 -60 110 0 L150 -90 Q160 -140 200 -130 L210 -100 L180 -90 L150 20 Q140 50 110 50 L-120 50 Q-150 50 -150 20 Z" fill="${c}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M-110 50 L-118 160 M-60 50 L-56 160 M50 50 L46 160 M95 50 L104 160" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><circle cx="188" cy="-118" r="7" fill="${INK}"/></g>`;
const lionIcon = (x, y, s) => { let g = `<g transform="translate(${x} ${y}) scale(${s})">`; for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283; g += `<path d="M${f1(Math.cos(a) * 70)} ${f1(Math.sin(a) * 70 - 40)} L${f1(Math.cos(a + 0.22) * 150)} ${f1(Math.sin(a + 0.22) * 150 - 40)} L${f1(Math.cos(a + 0.45) * 70)} ${f1(Math.sin(a + 0.45) * 70 - 40)} Z" fill="#E08A2E" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`; } return g + `<circle cx="0" cy="-40" r="90" fill="#F6C35A" stroke="${INK}" stroke-width="9"/><circle cx="-32" cy="-56" r="10" fill="${INK}"/><circle cx="32" cy="-56" r="10" fill="${INK}"/><path d="M-20 -14 L0 2 L20 -14 Z" fill="${INK}"/><path d="M-30 20 Q0 40 30 20" stroke="${INK}" stroke-width="7" fill="none"/></g>`; };
/* c1a: 정신의 세 단계 */
function nstagesScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('#F4EBDD') + `<rect x="0" y="0" width="1920" height="1080" fill="url(#paper)"/>`;
  const cards = [[400, '낙타', 0.15], [960, '사자', 0.4], [1520, '?', 0.65]];
  cards.forEach(([cx, nm, d], i) => {
    const inner = `<rect x="-230" y="-260" width="460" height="520" rx="30" fill="${i === 2 ? '#E5DED2' : '#fff'}" stroke="${INK}" stroke-width="9"/>` + `<circle cx="-170" cy="-200" r="34" fill="${GOLD}" stroke="${INK}" stroke-width="6"/>` + rtext(-170, -186, String(i + 1), 40) +
      (i === 0 ? camelIcon(0, -40, 0.85) : i === 1 ? lionIcon(0, -10, 0.95) : rtext(0, 20, '?', 200, '#B8AE9E')) + rtext(0, 210, nm, 64, i === 2 ? '#B8AE9E' : INK);
    h += rp(t, lt, d * D, cx, 520, inner, { rot: i === 1 ? 0 : (i ? 2 : -2) });
    if (i < 2) h += `<g opacity="${f1(prog(lt, (d + 0.1) * D, (d + 0.2) * D) * 100) / 100}">${rArrow(cx + 250, 520, cx + 310, 520, INK, 14)}</g>`;
  });
  return h;
}
const desert = (t) => `<defs><linearGradient id="dsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB45C"/><stop offset="1" stop-color="#FFE3A8"/></linearGradient></defs>` + BG('url(#dsk)') + `<circle cx="1560" cy="200" r="110" fill="#FFF6D8"/><circle cx="1560" cy="200" r="190" fill="#FFF6D8" opacity=".25"/>` +
  `<path d="M-600 760 Q200 690 760 760 T1900 740 T2600 760 L2600 1500 L-600 1500 Z" fill="#E8B566" stroke="${INK}" stroke-width="6"/><path d="M-600 880 Q400 830 1100 880 T2600 870 L2600 1500 L-600 1500 Z" fill="#D9A053" stroke="${INK}" stroke-width="6"/>`;
const loadBoxes = (x, yTop, t, labels, n, s = 1) => { // stacked boxes carried on the head, bottom box at yTop
  let g = ''; const cols = ['#C98A4B', '#B9783E', '#D9A06A', '#A86A34', '#C98A4B'];
  for (let i = 0; i < n; i++) { const w = (380 - i * 22) * s, hh = 72 * s, yy = yTop - i * hh, sw = Math.sin(t * 1.6 + i * 0.7) * (2 + i * 1.6);
    g += `<g transform="translate(${f1(x + sw)} ${f1(yy)}) rotate(${f1(sw * 0.4)})"><rect x="${-w / 2}" y="${-hh}" width="${w}" height="${hh}" rx="8" fill="${cols[i % 5]}" stroke="${INK}" stroke-width="7"/>` + (labels[i] ? rtext(0, -22 * s, labels[i], 38 * s, '#fff') : '') + `</g>`; }
  return g;
};
/* c4a / c5a: 짐을 이고 사막을 걷는 낙타 같은 우리 */
const carryPose = (t, amp, sink) => Object.assign({}, walkPose(t * 3.2, amp), { armL: P['이고가기'].armL, hL: P['이고가기'].hL, armR: P['이고가기'].armR, hR: P['이고가기'].hR });
function nloadScene(t, lt, a, run) {
  const D = a._dur || 3;
  let h = desert(t);
  if (a.many) for (let i = 0; i < 7; i++) { const x = 100 + i * 280 + ((run * 24) % 280), s = 0.42, pz = carryPose(t + i * 0.7, 0.4);
    h += `<g opacity=".85">` + shadow(x, 804, 26) + char({ goggles: 'none', patch: false, tee: true, vest: '#9AA3AE', vshade: 'rgba(0,0,0,0.14)', t, seed: 40 + i, x, y: 800, s, pose: pz, ex: exprAt([[0, '지침']], lt) }) + loadBoxes(x, 800 + (52 - 560 + pz.dy) * s, t + i, [], 4, s) + `</g>`; }
  const x = 900 + Math.min(run, 12) * 8, s = 1.0, pz = carryPose(t, 0.45);
  const labels = ['부탁', '착해야 해', '기대', '실망시키면 안 돼', '눈치'];
  const n = a.many ? 5 : clamp(1 + Math.floor(lt / (D / 5)), 1, 5);
  h += shadow(x, 904, 80) + Z({ t, seed: 16, x, y: 900, s, pose: pz, ex: exprAt([[0, '지침']], lt), look: [0.6, 0.4], sweat: true, sy: 0.96 });
  h += loadBoxes(x, 900 + (52 - 560 + pz.dy) * s * 0.96, t, labels, n);
  if (a.many) h += rp(t, lt, 0.2, 470, 150, outlined(0, 0, ['우리 대부분의 모습'], { size: 76, sw: 16 }), { rot: -2 });
  else h += rtg(t, lt, 0.1, 340, 170, '1단계 · 낙타', YEL, { size: 48, rot: -4 });
  return h;
}
/* c6a: 영혼이 메말라 간다 */
function ndryScene(t, lt, a) {
  const D = a._dur || 3;
  let h = desert(t) + `<rect x="0" y="0" width="1920" height="1080" fill="#7A3B12" opacity="${f1(prog(lt, 0, D) * 0.25 * 100) / 100}"/>`;
  for (let i = 0; i < 9; i++) { const cx = 200 + i * 200, cy = 960 + (i % 2) * 40; h += `<path d="M${cx - 60} ${cy} l30 -10 l20 16 l40 -8 l30 14" stroke="#8A5A26" stroke-width="5" fill="none"/>`; }
  const x = 900, s = 1.0, k = prog(lt, 0, 0.55 * D);
  const pz = mixPose(Object.assign({}, P['이고가기']), Object.assign({}, P['웅크림'], { armL: P['이고가기'].armL, hL: P['이고가기'].hL, armR: P['이고가기'].armR, hR: P['이고가기'].hR }), easeInOut(k));
  h += shadow(x, 904, 80) + Z({ t, seed: 16, x, y: 900, s, pose: pz, ex: exprAt([[0, '지침'], [0.55 * D, '졸림']], lt), look: [0.3, 0.6], sweat: true, shiver: k > 0.5 });
  h += loadBoxes(x + (k > 0.5 ? Math.sin(t * 40) * 3 : 0), 900 + (52 - 560 + pz.dy) * s, t * 0.3, ['부탁', '착해야 해', '기대', '실망시키면 안 돼', '눈치'], 5);
  // a small plant (the soul) wilting beside him
  const w = prog(lt, 0.3 * D, D), px = 1320, py = 900;
  const leafC = `rgb(${f1(lerp(76, 150, w))},${f1(lerp(190, 110, w))},${f1(lerp(90, 50, w))})`;
  h += `<path d="M${px - 60} ${py} L${px + 60} ${py} L${px + 44} ${py - 90} L${px - 44} ${py - 90} Z" fill="#C45A3A" stroke="${INK}" stroke-width="7"/>`;
  const bend = w * 70;
  h += `<path d="M${px} ${py - 90} Q${px} ${py - 170} ${f1(px + bend)} ${f1(py - 230 + bend * 1.2)}" stroke="${leafC}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  h += `<path d="M${f1(px + bend)} ${f1(py - 230 + bend * 1.2)} q-60 -40 -80 10 q50 20 80 -10 Z" fill="${leafC}" stroke="${INK}" stroke-width="6"/><path d="M${f1(px + bend)} ${f1(py - 230 + bend * 1.2)} q60 -40 80 10 q-50 20 -80 -10 Z" fill="${leafC}" stroke="${INK}" stroke-width="6"/>`;
  if (w > 0.5) h += `<path d="M${f1(px + 90)} ${f1(py - 60 + (w - 0.5) * 120)} q-30 -20 -40 6 q24 10 40 -6 Z" fill="#9A6A32" stroke="${INK}" stroke-width="5" opacity="${f1((1 - w) * 2 * 100) / 100}"/>`;
  h += rtg(t, lt, 0.4 * D, 1320, 520, '영혼', '#fff', { size: 44, rot: 4 });
  return h;
}
/* c10a: 관문, 야성을 되찾다 */
function ngateScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('#2A2140') + `<circle cx="960" cy="470" r="420" fill="url(#amber)" opacity="${f1((0.4 + 0.4 * prog(lt, 0.3 * D, D)) * 100) / 100}"/>` + `<rect x="-600" y="880" width="3120" height="600" fill="#3A2E52" stroke="${INK}" stroke-width="6"/>`;
  h += `<path d="M660 880 L660 420 Q660 230 960 230 Q1260 230 1260 420 L1260 880 L1180 880 L1180 440 Q1180 310 960 310 Q740 310 740 440 L740 880 Z" fill="#8C7A6A" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/><path d="M740 880 L740 440 Q740 310 960 310 Q1180 310 1180 440 L1180 880 Z" fill="#FFD98A" opacity=".55"/>`;
  h += `<rect x="830" y="190" width="260" height="80" rx="14" fill="#5E5048" stroke="${INK}" stroke-width="8"/>` + rtext(960, 248, '관문', 54, '#FFE7B0');
  const x = lerp(380, 960, easeInOut(prog(lt, 0, 0.6 * D))), walking = lt < 0.6 * D;
  h += shadow(x, 904, 70) + Z({ t, seed: 17, x, y: 900, s: 0.85, pose: walking ? walkPose(t * 7, 0.7) : '서기', ex: exprAt([[0, '결심']], lt), look: [0.4, 0] });
  h += rtg(t, lt, 0.36 * D, 1560, 420, '상처를 줄 수 있는 힘', '#fff', { size: 40, rot: 4 });
  h += rp(t, lt, 0.7 * D, 960, 140, outlined(0, 0, [[['정당한 분노', YEL], [' + ', WHITE], ['거절', MINT], [' = 야성', '#FFB26B']]], { size: 74, sw: 16 }), { rot: -2 });
  return h;
}
/* c11a: 발톱을 세우고, 통제하라 */
function nclawScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('#14233A') + `<rect x="0" y="0" width="1920" height="1080" fill="url(#dots)"/>`;
  const out = prog(lt, 0.08 * D, 0.2 * D) * (1 - prog(lt, 0.55 * D, 0.68 * D)), cx = 700, cy = 560, r = 200;
  for (let i = 0; i < 4; i++) { const ang = -Math.PI / 2 + (i - 1.5) * 0.42, ux = Math.cos(ang), uy = Math.sin(ang), px = -uy, py = ux, bx = cx + ux * r * 0.8, by = cy + uy * r * 0.8, L = r * 0.2 + 190 * out, tx = cx + ux * (r + L) + px * 30 * out, ty = cy + uy * (r + L) + py * 30 * out;
    h += `<path d="M${f1(bx - px * 30)} ${f1(by - py * 30)} Q${f1(cx + ux * (r + L * 0.6) - px * 20)} ${f1(cy + uy * (r + L * 0.6) - py * 20)} ${f1(tx)} ${f1(ty)} Q${f1(cx + ux * (r + L * 0.4) + px * 26)} ${f1(cy + uy * (r + L * 0.4) + py * 26)} ${f1(bx + px * 30)} ${f1(by + py * 30)} Z" fill="#F4F1EA" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>`; }
  h += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="12"/><path d="M${cx - 90} ${cy + 40} q90 60 180 0" stroke="#D5E2EE" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  h += rp(t, lt, 0.12 * D, 1360, 360, label(0, 0, '발톱 = 존엄을 지키는 힘', { size: 52, bg: '#fff' }), { rot: -2 });
  h += rp(t, lt, 0.55 * D, 1360, 520, label(0, 0, '발톱을 통제할 줄 알 때', { size: 52, bg: MINT }), { rot: 2 });
  if (lt > 0.78 * D) h += rp(t, lt, 0.78 * D, 1360, 720, outlined(0, 0, [[['진짜 선함', GOLD]]], { size: 120, sw: 22 }), { rot: -2 }) + rSparks(1360, 690, t, 10, 220);
  return h;
}
/* d0: 다시 사무실. 쇠사슬이 하나씩 끊어진다 */
function nchainScene(t, lt, a) {
  const D = a._dur || 4;
  let h = nOffice(t, false);
  const x = 960, y = 900, s = 1.0;
  h += shadow(x, y + 4, 80) + Z({ t, seed: 18, x, y, s, pose: lt > 3.0 ? '만세' : '서기', ex: exprAt([[0, '지침'], [1.0, '결심'], [3.0, '신남']], lt), look: [0, -0.1], sy: 1 + 0.03 * Math.sin(prog(lt, 0.6, 1.6) * Math.PI) });
  const chains = [[[600, 380], [1320, 760], 1.6, '남의 시선'], [[1320, 380], [600, 760], 2.1, '인정 욕구'], [[560, 560], [1360, 560], 2.6, '착한 사람'], [[720, 260], [1200, 880], 3.0, '눈치']];
  chains.forEach(([p0, p1, tb, lab], i) => {
    const k = prog(lt, tb, tb + 0.9);
    const n = 14;
    for (let j = 0; j < n; j++) {
      const u = j / (n - 1); let px = lerp(p0[0], p1[0], u), py = lerp(p0[1], p1[1], u);
      if (k > 0) { const side = u < 0.5 ? -1 : 1; px += side * 260 * easeOut(k) * Math.abs(u - 0.5) * 2 + side * 60 * k; py += 400 * k * k; }
      const ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 57.3 + (k ? (j % 2 ? 40 : -40) * k : 0);
      h += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="30" ry="15" transform="rotate(${f1(ang)} ${f1(px)} ${f1(py)})" fill="none" stroke="${INK}" stroke-width="15" opacity="${f1((1 - k) * 0.8 * 100) / 100}"/><ellipse cx="${f1(px)}" cy="${f1(py)}" rx="30" ry="15" transform="rotate(${f1(ang)} ${f1(px)} ${f1(py)})" fill="none" stroke="#B9C9DC" stroke-width="8" opacity="${f1((1 - k) * 100) / 100}"/>`;
    }
    if (k <= 0) h += `<g opacity=".9">${label(p0[0] + (p0[0] < 960 ? -70 : 70), p0[1] - 50, lab, { size: 42, bg: '#fff' })}</g>`;
    if (k > 0 && k < 0.6) h += fx(t, tb, tb + 0.6, 960 + (i - 1.5) * 200, 300, '챙!', WHITE, { size: 70, burst: 110, rot: (i % 2 ? 6 : -6) });
  });
  return h;
}
/* d0b-d2: 다시 부탁하러 온 팀장, 그리고 거절 */
function nrefuseScene(t, lt, a, run) {
  const D = a._dur || 2;
  let h = nOffice(t, false);
  h += digiClock(560, 210, '17:50', false);
  h += rDesk(560, 760, 560) + nMonitor(500, 700, false, t) + nStack(700, 726, 3, { w: 160 });
  // Zero stands next to his desk
  const zx = 980, zy = 900, s = 1.0, saying = a.ok === undefined && !a.enter;
  const zex = a.enter ? [[0, '기본'], [1.0, '걱정']] : a.ok ? [[0, '결심'], [0.6 * D, '놀람'], [D + 0.8, '뿌듯']] : [[0, '결심']];
  h += shadow(zx, zy + 4, 80) + Z({ t, seed: 19, x: zx, y: zy, s, rot: saying ? Math.sin(lt * 7) * 3 * (1 - prog(lt, 0, D)) : 0, pose: saying ? poseAt([[0, '서기'], [0.3, '거절']], lt, 0.25) : (a.ok ? poseAt([[0, '거절'], [0.4, '서기']], lt, 0.3) : '서기'), ex: exprAt(zex, lt), look: a.ok && lt > D * 0.9 ? [0.2, 0] : [0.9, 0] });
  // team leader
  let tx, pose, tlook = [0.9, 0], flipped = true, walking = false;
  if (a.enter) { tx = lerp(2150, 1420, easeOut(prog(lt, 0, 1.5))); walking = lt < 1.5; }
  else if (a.ok) { const go = prog(lt, D + 0.2, D + 2.4); tx = lerp(1420, 2250, easeIn(go)); walking = go > 0; flipped = go <= 0; }
  else tx = 1420;
  if (walking) pose = Object.assign({}, walkPose(t * 9, 0.8), { armL: P['들기'].armL, hL: P['들기'].hL, armR: P['들기'].armR, hR: P['들기'].hR });
  else pose = P['들기'];
  const tex = a.enter ? exprAt([[0, '신남']], lt) : a.ok ? exprAt([[0, '놀람'], [0.5 * D, '기본']], lt) : exprAt([[0, '신남'], [0.5 * D, '놀람']], lt);
  const tch = TJ({ t, x: tx, y: 860, s: 0.95, pose, ex: tex, look: tlook });
  h += shadow(tx, 864, 66) + (flipped ? flip(tx, tch) : tch);
  const hold = ptOf(tx, 860, 0.95, 200, 364); h += nStack(hold[0], hold[1] + 6, 9);
  if (a.ok && lt > D + 1.4) h += rp(t, lt, D + 1.4, 980, 220, label(0, 0, '…세상은 무너지지 않았다', { size: 50, bg: '#fff' }), { rot: -2 });
  return h;
}
/* d4: 화면 자막 */
function ncaptionScene(t, lt, a) {
  let h = BG('#07080D') + `<rect width="1920" height="1080" fill="url(#vig)"/>`;
  const L = [['착한 사람이 되려다,', WHITE, 0.2], ['단 한 번뿐인 당신 자신에게', WHITE, 1.4], ['가장 잔인한 사람이 되지 마라.', GOLD, 2.6]];
  L.forEach(([s, c, d], i) => { const k = prog(lt, d, d + 0.8); h += `<g opacity="${f1(k * 100) / 100}" transform="translate(0 ${f1((1 - easeOut(k)) * 20)})">${outlined(960, 380 + i * 130, [s], { size: i === 2 ? 84 : 70, sw: 14, fill: c, shadow: false })}</g>`; });
  return h;
}
/* e1: 어릴 때부터 배운 양보 */
function nkidScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('url(#dayRoom)') + rFloor(880, '#E2C79C');
  h += `<rect x="1300" y="160" width="360" height="300" rx="12" fill="#BFE6FF" stroke="${INK}" stroke-width="8"/><line x1="1480" y1="160" x2="1480" y2="460" stroke="${INK}" stroke-width="6"/>`;
  const give = prog(lt, 0.55 * D, 0.75 * D);
  h += shadow(760, 904, 50) + Z({ t, seed: 20, x: 760, y: 900, s: 0.62, pose: give > 0 ? '건네기' : '서기', ex: exprAt([[0, '기본'], [0.75 * D, '뿌듯']], lt), look: [0.8, 0.2] });
  h += rch(t, lt, 1120, 900, 0.62, '#9DB8D9', '서기', [[0, '기본'], [0.75 * D, '신남']], { look: [-0.8, 0.2] });
  const hz = ptOf(760, 900, 0.62, 360, 316), hk = ptOf(1120, 900, 0.62, 86, 330);
  const cx = lerp(hz[0], hk[0] - 10, give), cy = lerp(hz[1], hk[1], give);
  h += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="30" fill="#C98A4B" stroke="${INK}" stroke-width="6"/><circle cx="${f1(cx - 8)}" cy="${f1(cy - 6)}" r="5" fill="#5A3A1A"/><circle cx="${f1(cx + 9)}" cy="${f1(cy + 6)}" r="5" fill="#5A3A1A"/>`;
  h += rp(t, lt, 0.12 * D, 520, 260, `<rect x="-230" y="-56" width="460" height="112" rx="40" fill="#fff" stroke="${INK}" stroke-width="7"/>` + rtext(0, 16, '배려해야지~', 50, NAVY), { rot: -3, bob: 3 });
  h += rp(t, lt, 0.45 * D, 1400, 560, `<rect x="-230" y="-56" width="460" height="112" rx="40" fill="#fff" stroke="${INK}" stroke-width="7"/>` + rtext(0, 16, '양보해야지~', 50, NAVY), { rot: 3, bob: 3 });
  h += rtg(t, lt, 0.05, 300, 120, '어릴 때', YEL, { size: 44, rot: -4 });
  return h;
}
/* e2: 배려의 목록 */
function nlistScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('#E9DFCF') + `<rect width="1920" height="1080" fill="url(#paper)"/>`;
  h += `<g transform="translate(960 520) rotate(-2)"><rect x="-372" y="-412" width="760" height="830" rx="16" fill="#000" opacity=".2"/><rect x="-380" y="-420" width="760" height="830" rx="16" fill="#FFFDF5" stroke="${INK}" stroke-width="9"/>` + rtext(0, -330, '배려할 사람', 64, NAVY) + `<line x1="-300" y1="-300" x2="300" y2="-300" stroke="${INK}" stroke-width="5"/>`;
  const items = ['엄마', '친구', '팀장님', '동료', '거래처', '옆집 사람'];
  items.forEach((it, i) => { const k = prog(lt, (0.05 + i * 0.07) * D, (0.05 + i * 0.07) * D + 0.3); if (k <= 0) return; const yy = -230 + i * 86; h += `<g opacity="${f1(k * 100) / 100}">${rCheck(-250, yy - 14, 0.6)}` + rtext(-190, yy, it, 50, INK, { anchor: 'start' }) + `</g>`; });
  const yy = -230 + 6 * 86;
  if (lt > 0.55 * D) h += `<line x1="-200" y1="${yy + 6}" x2="180" y2="${yy + 6}" stroke="#B8AE9E" stroke-width="5" stroke-dasharray="14 10"/>` + rtext(-250, yy, '?', 54, '#B8AE9E');
  h += `</g>`;
  if (lt > 0.75 * D) h += rp(t, lt, 0.75 * D, 1520, 760, label(0, 0, '자기 자신은?', { size: 56, bg: YEL }), { rot: 4, bob: 3 });
  return h;
}
/* e3 / e4: 모두에게 좋은 사람 = 영혼을 조각내 팔기 */
function nsliceScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('#2B2140') + `<circle cx="960" cy="520" r="460" fill="url(#warm)" opacity=".25"/>` + `<rect x="-600" y="900" width="3120" height="600" fill="#3A2E52" stroke="${INK}" stroke-width="6"/>`;
  const x = 960, y = 920, s = 0.9;
  const hands = [[260, 300], [1660, 300], [180, 680], [1740, 680], [560, 90], [1360, 90]];
  const pieDone = a.cut ? prog(lt, 0.15 * D, 0.85 * D) : 0;
  hands.forEach(([hx0, hy0], i) => {
    const reach = a.cut ? 0.55 : 0.3 + 0.25 * easeOut(prog(lt, i * 0.08 * D, i * 0.08 * D + 0.6));
    const hx = lerp(hx0, x, reach * 0.55), hy = lerp(hy0, 500, reach * 0.55);
    h += `<line x1="${hx0 < 960 ? -300 : 2220}" y1="${f1(hy0)}" x2="${f1(hx)}" y2="${f1(hy)}" stroke="${INK}" stroke-width="44" stroke-linecap="round"/><line x1="${hx0 < 960 ? -300 : 2220}" y1="${f1(hy0)}" x2="${f1(hx)}" y2="${f1(hy)}" stroke="#7D8394" stroke-width="30" stroke-linecap="round"/><circle cx="${f1(hx)}" cy="${f1(hy)}" r="34" fill="#C9CED8" stroke="${INK}" stroke-width="7"/>`;
    if (a.cut) { const k = prog(pieDone * 6, i, i + 1); if (k > 0) { const ang = i / 6 * 6.283; const px = lerp(x, hx, easeInOut(k)), py = lerp(520, hy, easeInOut(k)); h += `<path d="M${f1(px)} ${f1(py)} l${f1(Math.cos(ang) * 70)} ${f1(Math.sin(ang) * 70)} A70 70 0 0 1 ${f1(px + Math.cos(ang + 1.047) * 70)} ${f1(py + Math.sin(ang + 1.047) * 70)} Z" fill="#FF7A9A" stroke="${INK}" stroke-width="6"/>`; } }
  });
  h += shadow(x, y + 4, 70) + Z({ t, seed: 22, x, y, s, pose: a.cut ? '들기' : '만세', ex: exprAt(a.cut ? [[0, '걱정'], [0.85 * D, '지침']] : [[0, '신남'], [0.6 * D, '걱정']], lt), look: [Math.sin(t * 2) * 0.8, -0.2], sweat: !a.cut });
  if (a.cut) { // the soul as a pie in front of his chest; slices leave one by one
    const left = 6 - Math.floor(pieDone * 6);
    h += `<ellipse cx="${x}" cy="${y - 190}" rx="140" ry="26" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
    for (let i = 0; i < left; i++) { const a0 = i / 6 * 6.283 - 1.57, a1 = a0 + 1.047; h += `<path d="M${x} ${y - 290} L${f1(x + Math.cos(a0) * 100)} ${f1(y - 290 + Math.sin(a0) * 100)} A100 100 0 0 1 ${f1(x + Math.cos(a1) * 100)} ${f1(y - 290 + Math.sin(a1) * 100)} Z" fill="#FF7A9A" stroke="${INK}" stroke-width="6"/>`; }
    h += rtg(t, lt, 0.05, x, y - 440, '내 영혼', '#fff', { size: 40, rot: -3 });
  } else h += rp(t, lt, 0.2 * D, 960, 130, outlined(0, 0, ['모두에게 좋은 사람?'], { size: 76, sw: 16 }), { rot: -2 });
  return h;
}
/* e5: 거절해도 세상은 무너지지 않는다 */
function nworldScene(t, lt, a) {
  const D = a._dur || 3;
  const quake = lt > 0.35 * D && lt < 0.6 * D ? Math.sin(t * 60) * 8 : 0;
  let h = BG('url(#morning)') + `<g transform="translate(${f1(quake)} 0)">`;
  [[120, 260, 380], [420, 200, 470], [1380, 240, 420], [1640, 220, 500]].forEach(([bx, bw, bh]) => { h += `<rect x="${bx}" y="${880 - bh}" width="${bw}" height="${bh}" fill="#9CB4CC" stroke="${INK}" stroke-width="8"/>`; for (let i = 0; i < 6; i++) h += `<rect x="${bx + 30 + (i % 2) * (bw / 2 - 10)}" y="${900 - bh + Math.floor(i / 2) * 90}" width="${bw / 2 - 60}" height="50" fill="#E6F2FF" stroke="${INK}" stroke-width="5"/>`; });
  h += `</g><rect x="-600" y="880" width="3120" height="600" fill="#B9C4CE" stroke="${INK}" stroke-width="6"/>`;
  h += shadow(960, 904, 80) + Z({ t, seed: 23, x: 960, y: 900, s: 1.0, pose: poseAt([[0, '서기'], [0.15 * D, '거절']], lt, 0.25), ex: exprAt([[0, '결심'], [0.4 * D, '걱정'], [0.7 * D, '뿌듯']], lt), look: lt > 0.4 * D && lt < 0.7 * D ? [Math.sin(t * 4), -0.4] : [0, 0] });
  h += rfx(t, lt, 0.15 * D, 1240, 380, '아니오', RED, { size: 110, burst: 200, rot: -6 });
  if (lt > 0.72 * D) h += rp(t, lt, 0.72 * D, 960, 170, label(0, 0, '…멀쩡하다', { size: 64, bg: '#fff' }), { rot: 2, bob: 3 });
  // a little bird lands on his head at the end
  const bk = prog(lt, 0.75 * D, 0.95 * D);
  if (bk > 0) { const bx = lerp(1500, 960, easeOut(bk)), by = lerp(200, 900 - 530 - 20, easeOut(bk)); h += `<g transform="translate(${f1(bx)} ${f1(by)})"><ellipse rx="34" ry="26" fill="#FFD23F" stroke="${INK}" stroke-width="6"/><circle cx="22" cy="-16" r="16" fill="#FFD23F" stroke="${INK}" stroke-width="6"/><path d="M36 -16 l18 4 l-18 6 Z" fill="#FF8A3D" stroke="${INK}" stroke-width="4"/><circle cx="26" cy="-20" r="4" fill="${INK}"/></g>`; }
  return h;
}
/* e6: 존중하는 사람 vs 이용하려던 사람 */
function ntwoScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('#EEF2F5') + `<rect x="960" y="0" width="1600" height="1080" fill="#F6E3E0"/><rect x="-600" y="880" width="3120" height="600" fill="#C9D2DA" stroke="${INK}" stroke-width="6"/>`;
  const right = lt > 0.5 * D;
  h += rch(t, lt, 520, 900, 0.95, '#8FC8A8', [[0, '서기'], [0.2 * D, '손인사']], [[0, '기본'], [0.15 * D, '신남']], { look: [0.4, 0] });
  h += rp(t, lt, 0.12 * D, 520, 250, label(0, 0, '존중하는 사람', { size: 52, bg: MINT }), { rot: -3 });
  h += rp(t, lt, 0.3 * D, 520, 360, label(0, 0, '"그래, 알겠어"', { size: 44, bg: '#fff' }), { rot: 2 });
  if (right) {
    h += rch(t, lt, 1400, 900, 0.95, '#C45A5A', '주먹', [[0, '화남']], { look: [-0.4, 0], shiver: true });
    for (let i = 0; i < 3; i++) { const k = ((t * 0.9 + i / 3) % 1); h += `<circle cx="${1400 + (i - 1) * 70}" cy="${f1(380 - k * 140)}" r="${f1(20 + k * 24)}" fill="#fff" opacity="${f1((1 - k) * 0.8 * 100) / 100}"/>`; }
    h += rp(t, lt, 0.52 * D, 1400, 250, label(0, 0, '화내는 사람', { size: 52, bg: '#FF9A8A' }), { rot: 3 });
    if (lt > 0.8 * D) h += rfx(t, lt, 0.8 * D, 1400, 520, '이용하려던 사람', RED, { size: 70, burst: 220, rot: -4 });
  }
  return h;
}
/* e7: 거울 속 지친 나를 안아 주기 */
function nmirrorScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('#DCE6EC') + rFloor(880, '#B9C4CE');
  const hug = lt > 0.55 * D;
  const mx = 1260, my = 520;
  h += `<ellipse cx="${mx}" cy="${my}" rx="300" ry="400" fill="#8C6A4A" stroke="${INK}" stroke-width="10"/><ellipse cx="${mx}" cy="${my}" rx="262" ry="362" fill="#CFE3EE" stroke="${INK}" stroke-width="6"/>`;
  h += `<defs><clipPath id="mirC"><ellipse cx="${mx}" cy="${my}" rx="258" ry="358"/></clipPath></defs>`;
  const ex = hug ? [[0, '잠']] : [[0, '신남'], [0.3 * D, '지침']];
  const me = (x, look) => Z({ t, seed: 24, x, y: 900, s: 0.95, pose: hug ? '안기' : '서기', ex: exprAt(hug ? [[0.55 * D, '잠']] : ex, lt), look, sweat: !hug && lt < 0.3 * D });
  h += `<g clip-path="url(#mirC)" opacity=".92">${flip(mx + 40, me(mx + 40, [0.6, 0]))}${hug ? '' : darkC(mx + 40, 900, 0.95)}<rect x="${mx - 300}" y="${my - 400}" width="600" height="800" fill="#fff" opacity=".12"/></g>`;
  h += `<path d="M${mx - 160} ${my - 260} L${mx - 110} ${my - 300} M${mx - 190} ${my - 190} L${mx - 90} ${my - 270}" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".7"/>`;
  h += shadow(700, 904, 80) + me(700, [0.6, 0]);
  if (!hug && lt < 0.3 * D) h += rtg(t, lt, 0.05, 700, 220, '억지 미소', '#fff', { size: 44, rot: -3 });
  if (hug) { h += `<circle cx="700" cy="560" r="300" fill="url(#warm)" opacity="${f1(prog(lt, 0.55 * D, 0.75 * D) * 0.9 * 100) / 100}"/>`; for (let i = 0; i < 4; i++) { const k = ((t * 0.6 + i / 4) % 1); h += `<text x="${f1(560 + i * 90)}" y="${f1(380 - k * 160)}" text-anchor="middle" font-size="56" fill="${PINK}" opacity="${f1((1 - k) * 100) / 100}">♥</text>`; } }
  return h;
}
