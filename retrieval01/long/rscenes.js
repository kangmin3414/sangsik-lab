/* retrieval (인출 연습) long-form scenes. 1920x1080 world. Signature: rXxxScene(t, lt, a, run). lt = seconds into this line's scene (starts 0.15 before the voice). */
const GOLD = '#F7C948', YV2 = '#FFD23F', PAPER = '#FFF8EA', GRAY = '#9AA3AE', GREEN = '#2FBF71';
window.CAMS = window.CAMS || {};
Object.assign(CAMS, { rdesk: [1.0, 1.06, 960, 540], rexam: [1.0, 1.06, 960, 540], rash: [1.0, 1.04, 960, 540], rfeel: [1.0, 1.04, 960, 540], rquestion: [1.0, 1.06, 960, 540], rtitle: [1.0, 1.05, 960, 540],
  rchapter: 'fixed', rbrain: [1.0, 1.07, 960, 560], rread: [1.0, 1.05, 960, 540], rsignal: [1.0, 1.04, 960, 540], rterm: [1.0, 1.05, 960, 540], rpaper: [1.0, 1.05, 960, 540], rgroups: [1.0, 1.05, 960, 540],
  rbars: [1.0, 1.04, 960, 540], rcal: [1.0, 1.1, 960, 540], rterm2: [1.0, 1.05, 960, 540], rdisk: [1.0, 1.04, 960, 540], rstruggle: [1.0, 1.08, 960, 560], rneuron: [1.0, 1.06, 960, 540], rnobel: [1.0, 1.05, 960, 540],
  rresearch: [1.0, 1.04, 960, 540], rpose: [1.0, 1.06, 960, 560], rfeynman: [1.0, 1.05, 960, 540], rsteps: [1.0, 1.04, 960, 540], rteach: [1.0, 1.06, 960, 560], rjargon: [1.0, 1.04, 960, 540], rprotege: [1.0, 1.04, 960, 540],
  rthree: [1.0, 1.03, 960, 540], rblank: [1.0, 1.06, 960, 560], rmindmap: [1.0, 1.04, 960, 540], rbearday: [1.0, 1.06, 960, 560], rduck: [1.0, 1.06, 960, 560], rgap: [1.0, 1.06, 960, 560], rease: [1.0, 1.06, 960, 560],
  rgym: [1.0, 1.06, 960, 560], rno10: [1.0, 1.06, 960, 540], rdo: [1.0, 1.05, 960, 560], rcomment: [1.0, 1.05, 960, 540], rend: 'fixed' });

/* ---------- helpers ---------- */
const rp = (t, lt, d, cx, cy, inner, o = {}) => pop(t, t - lt + d, t + 999, cx, cy, inner, o);
const rfx = (t, lt, d, x, y, text, color, o = {}) => fx(t, t - lt + d, t + 999, x, y, text, color, o);
const rtg = (t, lt, d, x, y, text, bg, o = {}) => tag(t, t - lt + d, t + 999, x, y, text, bg, o);
const rtext = (x, y, s, size, fill = INK, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.anchor || 'middle'}" font-family="${FONT}" font-weight="900" font-size="${size}" fill="${fill}"${o.op ? ` opacity="${o.op}"` : ''}>${esc(s)}</text>`;
const rbox = (x, y, w, h, fill, o = {}) => `<g transform="translate(${x} ${y})${o.rot ? ` rotate(${o.rot})` : ''}"><rect x="${-w / 2 + 7}" y="${-h / 2 + 9}" width="${w}" height="${h}" rx="${o.rx || 22}" fill="#000" opacity=".22"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${o.rx || 22}" fill="${fill}" stroke="${INK}" stroke-width="${o.sw || 7}"/>${o.inner || ''}</g>`;
const rz = (t, lt, x, y, s, pose, ex, o = {}) => shadow(x, y + 4, 70 * s) + Z(Object.assign({ t, seed: 11, x, y, s, pose: typeof pose === 'string' ? pose : poseAt(pose, lt, 0.3), ex: exprAt(ex, lt), look: [0.2, 0.2] }, o));
const rch = (t, lt, x, y, s, vest, pose, ex, o = {}) => shadow(x, y + 4, 70 * s) + char(Object.assign({ goggles: 'none', patch: false, tee: true, vest, t, seed: 5, x, y, s, vshade: 'rgba(0,0,0,0.14)', pose: typeof pose === 'string' ? pose : poseAt(pose, lt, 0.3), ex: exprAt(ex, lt), look: [0, 0.1] }, o));
const rFloor = (y, c = '#E7C99A') => `<rect x="-600" y="${y}" width="3120" height="1400" fill="${c}" stroke="${INK}" stroke-width="6"/>`;
const rRoom = () => `<defs><linearGradient id="rrm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1DE"/><stop offset="1" stop-color="#F6D3AE"/></linearGradient></defs>` + BG('url(#rrm)');
const rBook = (x, y, w, h, stripes = [], o = {}) => {
  let g = `<g transform="translate(${x} ${y})${o.rot ? ` rotate(${o.rot})` : ''}"><rect x="${-w / 2 + 8}" y="${-h / 2 + 10}" width="${w}" height="${h}" rx="10" fill="#000" opacity=".25"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="10" fill="#fff" stroke="${INK}" stroke-width="7"/><line x1="0" y1="${-h / 2}" x2="0" y2="${h / 2}" stroke="${INK}" stroke-width="5"/>`;
  for (let i = 0; i < 5; i++) { const yy = -h / 2 + h * 0.16 + i * (h * 0.68) / 4; g += `<line x1="${-w / 2 + 20}" y1="${f1(yy)}" x2="-14" y2="${f1(yy)}" stroke="#9aa" stroke-width="5"/><line x1="14" y1="${f1(yy)}" x2="${w / 2 - 20}" y2="${f1(yy)}" stroke="#9aa" stroke-width="5"/>`; }
  stripes.forEach(([sx, sy, sw, k]) => { g += `<rect x="${sx}" y="${sy}" width="${f1(sw * k)}" height="18" fill="#FFE14D" opacity=".9"/>`; });
  return g + `</g>`;
};
const rClosedBook = (x, y, w, h, c = '#4F86C6', o = {}) => `<g transform="translate(${x} ${y})${o.rot ? ` rotate(${o.rot})` : ''}"><rect x="${-w / 2 + 8}" y="${-h / 2 + 10}" width="${w}" height="${h}" rx="10" fill="#000" opacity=".25"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="10" fill="${c}" stroke="${INK}" stroke-width="7"/><rect x="${-w / 2}" y="${-h / 2}" width="${w * 0.12}" height="${h}" fill="#000" opacity=".18"/><rect x="${-w * 0.28}" y="${-h * 0.28}" width="${w * 0.56}" height="${h * 0.2}" rx="6" fill="#fff" opacity=".85"/></g>`;
const rPaper = (x, y, w, h, k, o = {}) => {
  let g = `<g transform="translate(${x} ${y}) rotate(${o.rot === undefined ? -3 : o.rot})"><rect x="${-w / 2 + 8}" y="${-h / 2 + 10}" width="${w}" height="${h}" rx="8" fill="#000" opacity=".22"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="8" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 4; i++) { const aa = clamp(k - i, 0, 1); if (aa > 0) g += `<path d="M${-w / 2 + 28} ${-h / 2 + 50 + i * h * 0.2} q${(w - 56) * aa * 0.25} -16 ${(w - 56) * aa * 0.5} 0 t${(w - 56) * aa * 0.5} 0" fill="none" stroke="#2a58d6" stroke-width="7" stroke-linecap="round"/>`; }
  return g + `</g>`;
};
const rDesk = (cx, y, w = 900) => `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="36" rx="10" fill="#9A6F3E" stroke="${INK}" stroke-width="8"/><rect x="${cx - w / 2 + 40}" y="${y + 36}" width="${w - 80}" height="360" fill="#7A5A32" stroke="${INK}" stroke-width="8"/>`;
const rBrain = (cx, cy, s, o = {}) => `<g transform="translate(${cx} ${cy}) scale(${s})"><path d="M-170 20 C-190 -90 -110 -150 -20 -150 C70 -165 180 -110 185 -10 C190 60 150 95 90 100 L70 150 L30 150 L25 105 C-40 115 -160 105 -170 20 Z" fill="${o.fill || '#FFD6DC'}" stroke="${INK}" stroke-width="8"/><path d="M-90 -70 q20 -26 40 0 t40 0 M-120 -10 q30 -22 50 8 M20 -20 q30 -30 60 0 M-60 40 q30 -22 60 0" fill="none" stroke="${o.line || '#E58AA5'}" stroke-width="7" stroke-linecap="round"/></g>`;
const rBear = (x, y, s, o = {}) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="80" rx="95" ry="105" fill="#B77A45" stroke="${INK}" stroke-width="8"/><ellipse cx="0" cy="100" rx="55" ry="68" fill="#E2B27A"/><circle cx="-82" cy="-48" r="34" fill="#B77A45" stroke="${INK}" stroke-width="8"/><circle cx="82" cy="-48" r="34" fill="#B77A45" stroke="${INK}" stroke-width="8"/><circle cx="0" cy="-10" r="92" fill="#C98B52" stroke="${INK}" stroke-width="8"/><ellipse cx="0" cy="18" rx="44" ry="34" fill="#E8C597" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="6" rx="14" ry="10" fill="${INK}"/>` + (o.happy ? `<path d="M-42 -26 q14 -16 28 0 M14 -26 q14 -16 28 0" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M-18 30 q18 20 36 0" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` : `<circle cx="-30" cy="-26" r="9" fill="${INK}"/><circle cx="30" cy="-26" r="9" fill="${INK}"/><path d="M-14 34 q14 8 28 0" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`) + `<circle cx="-62" cy="22" r="14" fill="#FF8FA8" opacity=".6"/><circle cx="62" cy="22" r="14" fill="#FF8FA8" opacity=".6"/></g>`;
const rBulb = (x, y, s, k = 1) => `<g transform="translate(${x} ${y}) scale(${s})" opacity="${f1(k * 100) / 100}"><circle cx="0" cy="0" r="120" fill="url(#glow)"/><path d="M-34 24 C-62 -6 -56 -62 0 -66 C56 -62 62 -6 34 24 L34 48 L-34 48 Z" fill="#FFE27A" stroke="${INK}" stroke-width="7"/><rect x="-28" y="48" width="56" height="18" rx="6" fill="#ccc" stroke="${INK}" stroke-width="6"/></g>`;
const rBar = (x, base, h, color, label, o = {}) => `<rect x="${x - 110}" y="${f1(base - h)}" width="220" height="${f1(Math.max(0, h))}" rx="16" fill="${color}" stroke="${INK}" stroke-width="9"/>` + (h > 20 ? `<rect x="${x - 84}" y="${f1(base - h + 16)}" width="34" height="${f1(Math.max(0, h - 32))}" rx="8" fill="#fff" opacity=".35"/>` : '') + outlined(x, base - h - 26, [label], { size: o.size || 92, sw: 20 });
const rArrow = (x1, y1, x2, y2, c = INK, w = 12) => { const a = Math.atan2(y2 - y1, x2 - x1), hx = 34; return `<line x1="${x1}" y1="${y1}" x2="${f1(x2 - Math.cos(a) * 10)}" y2="${f1(y2 - Math.sin(a) * 10)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/><path d="M${x2} ${y2} L${f1(x2 - Math.cos(a - 0.5) * hx)} ${f1(y2 - Math.sin(a - 0.5) * hx)} L${f1(x2 - Math.cos(a + 0.5) * hx)} ${f1(y2 - Math.sin(a + 0.5) * hx)} Z" fill="${c}" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`; };
const rSparks = (cx, cy, t, n = 8, r = 90, c = GOLD) => { let h = ''; for (let i = 0; i < n; i++) { const a = i / n * 6.283 + t * 1.5, rr = r + Math.sin(t * 4 + i) * 12; h += `<path d="M${f1(cx + Math.cos(a) * rr)} ${f1(cy + Math.sin(a) * rr - 14)} l6 14 l-6 14 l-6 -14 Z" fill="${c}" stroke="${INK}" stroke-width="3"/>`; } return h; };
const rSweat = (x, y, t) => { const k = (t * 1.3) % 1; return `<path d="M${x} ${f1(y + k * 30)} q-12 22 0 34 q12 -12 0 -34 Z" fill="#8EDCFF" stroke="${INK}" stroke-width="4" opacity="${f1(1 - k * 0.6)}"/>`; };
const rCheck = (x, y, s, c = GREEN) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="40" fill="${c}" stroke="${INK}" stroke-width="7"/><path d="M-18 2 L-6 16 L20 -14" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/></g>`;
const rCross = (x, y, s, c = RED) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="40" fill="${c}" stroke="${INK}" stroke-width="7"/><path d="M-16 -16 L16 16 M16 -16 L-16 16" stroke="#fff" stroke-width="11" stroke-linecap="round"/></g>`;
const rNavy = () => BG('#0F1B33') + qStarsLite();
function qStarsLite() { let h = ''; for (let i = 0; i < 30; i++) h += `<circle cx="${(i * 233) % 1920}" cy="${(i * 131) % 900 + 20}" r="${1.4 + (i % 3)}" fill="#fff" opacity="${0.2 + (i % 4) * 0.08}"/>`; return h; }

/* ---------- INTRO ---------- */
function rdeskScene(t, lt, a) {
  let h = rRoom() + rFloor(860, '#C9A576');
  h += `<rect x="1340" y="180" width="360" height="420" rx="14" fill="#E9F4FF" stroke="${INK}" stroke-width="8"/><line x1="1520" y1="180" x2="1520" y2="600" stroke="${INK}" stroke-width="6"/><line x1="1340" y1="390" x2="1700" y2="390" stroke="${INK}" stroke-width="6"/>`;
  h += rClosedBook(420, 640, 180, 50, '#C45A3A') + rClosedBook(424, 596, 170, 46, '#4F86C6') + rClosedBook(416, 554, 176, 44, '#6BAA6B');
  const k = a.think ? 1 : easeInOut(prog(lt, 0.3, 5));
  h += rz(t, lt, 960, 880, 0.95, '책상', a.think ? [[0, '기본'], [1.2, '뿌듯'], [3.5, '신남']] : [[0, '기본'], [2, '결심']]);
  h += rDesk(960, 700, 1000);
  const st = [[-100, -62, 200, a.think ? 1 : clamp(k * 3, 0, 1)], [-100, -30, 200, a.think ? 1 : clamp(k * 3 - 1, 0, 1)], [-100, 2, 200, a.think ? 1 : clamp(k * 3 - 2, 0, 1)], [14, -46, 190, a.think ? 1 : clamp(k * 3 - 0.5, 0, 1)], [14, -14, 190, a.think ? 1 : clamp(k * 3 - 1.5, 0, 1)]];
  h += rBook(960, 650, 420, 120, st.map(s => [s[0] - 20, s[1] + 10, s[2] + 20, s[3]]));
  if (!a.think) { const sx = 880 + 220 * ((lt * 0.7) % 1); h += `<g transform="translate(${f1(sx)} ${f1(640 + Math.sin(lt * 9) * 6)}) rotate(-35)"><rect x="-9" y="-44" width="18" height="70" rx="6" fill="#FFE14D" stroke="${INK}" stroke-width="5"/></g>`; }
  h += rtg(t, lt, 0.2, 400, 330, '형광펜 ✎', YEL, { size: 44, rot: -4 });
  if (a.think) {
    h += bubble(960, 250, 760, 170, rtext(0, 22, '이제 다 이해했다. 완벽하게 외웠네.', 44, NAVY), {});
    h += rp(t, lt, 0.5, 1540, 330, label(0, 0, '3회독 완료', { size: 52, bg: MINT }), { rot: 4, bob: 4 });
    h += rp(t, lt, 3.2, 1180, 470, rSparks(0, 0, t, 8, 70), {});
  }
  return h;
}
function rexamScene(t, lt, a) {
  let h = BG('#CFD8E3') + `<rect x="-600" y="860" width="3120" height="600" fill="#A9B4C3" stroke="${INK}" stroke-width="6"/>`;
  h += `<g transform="translate(1500 230)"><circle r="96" fill="#fff" stroke="${INK}" stroke-width="9"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<line x1="0" y1="-78" x2="0" y2="-90" stroke="${INK}" stroke-width="5" transform="rotate(${i * 30})"/>`).join('')}<line x1="0" y1="0" x2="0" y2="-62" stroke="${INK}" stroke-width="9" stroke-linecap="round" transform="rotate(${f1(lt * 40)})"/><line x1="0" y1="0" x2="40" y2="0" stroke="${INK}" stroke-width="9" stroke-linecap="round"/></g>`;
  const blank = prog(lt, 2.8, 3.6);
  h += rz(t, lt, 760, 890, 0.95, '책상', [[0, '뿌듯'], [2.6, '놀람'], [3.8, '걱정']]);
  h += rDesk(760, 700, 760);
  h += rPaper(760, 668, 340, 190, 0, { rot: 0 });
  h += rtext(760, 690, '1. ?   2. ?   3. ?', 40, '#9aa');
  if (lt > 2.5) h += `<g opacity="${f1(blank * 0.95 * 100) / 100}"><circle cx="760" cy="${f1(390 - 20 * blank)}" r="${f1(40 + 150 * blank)}" fill="#fff"/><circle cx="760" cy="${f1(390 - 20 * blank)}" r="${f1(40 + 150 * blank)}" fill="url(#glow)" opacity=".3"/></g>`;
  if (lt > 3.1) { h += rp(t, lt, 3.1, 760, 160, outlined(0, 0, ['새하얘졌다…'], { size: 96, sw: 20 }), { rot: -3, bob: 4 }); h += rSweat(840, 330, t); }
  h += rtg(t, lt, 0.2, 1100, 560, '시험지', '#fff', { size: 44, rot: 5 });
  return h;
}
function rashScene(t, lt, a) {
  let h = BG('#1C2233');
  h += `<rect x="560" y="250" width="800" height="22" fill="#6B4A2E" stroke="${INK}" stroke-width="6"/><rect x="560" y="520" width="800" height="22" fill="#6B4A2E" stroke="${INK}" stroke-width="6"/><rect x="560" y="790" width="800" height="22" fill="#6B4A2E" stroke="${INK}" stroke-width="6"/>`;
  const cols = ['#C45A3A', '#4F86C6', '#6BAA6B', '#E0A83A', '#9B6BC6', '#D5658F'];
  for (let i = 0; i < 20; i++) {
    const row = Math.floor(i / 7), col = i % 7, x = 600 + col * 108, base = 140 + (row + 1) * 300 - 300 + (row === 0 ? 0 : 0) + 10;
    const rowY = [250, 520, 790][row] || 790, hh = 130 + (i * 37) % 60;
    const k = easeInOut(prog(lt, 1.0 + i * 0.16, 2.2 + i * 0.16));
    const c = k > 0.5 ? '#6D7480' : cols[i % cols.length];
    const dy = k * k * 30, op = 1 - 0.65 * k;
    h += `<g opacity="${f1(op * 100) / 100}" transform="translate(${x} ${f1(rowY - hh + dy)}) rotate(${f1(k * (i % 2 ? 7 : -9))})"><rect width="76" height="${hh}" rx="8" fill="${c}" stroke="${INK}" stroke-width="7"/><rect x="12" y="20" width="52" height="16" fill="#fff" opacity=".5"/></g>`;
    if (k > 0.05 && k < 0.95) for (let j = 0; j < 3; j++) h += `<circle cx="${f1(x + 38 + Math.sin(i + j * 2 + t * 2) * 24)}" cy="${f1(rowY - hh * 0.5 + k * 160 + j * 24)}" r="${3 + j}" fill="#B9BEC6" opacity="${f1((1 - k) * 0.9 * 100) / 100}"/>`;
  }
  h += rz(t, lt, 330, 900, 0.8, '서기', [[0, '걱정'], [2, '겁먹음']]);
  h += bubble(360, 360, 360, 130, rtext(0, 16, '분명 봤는데…', 44, NAVY), {});
  return h;
}
function rfeelScene(t, lt, a) {
  let h = rRoom() + rFloor(880, '#C9A576');
  const m1 = easeInOut(prog(lt, 0.6, 3.4)), m2 = 0.18 + 0.05 * Math.sin(t * 2);
  const meter = (x, k, c, name) => `<rect x="${x - 70}" y="200" width="140" height="520" rx="30" fill="#fff" stroke="${INK}" stroke-width="9"/><rect x="${x - 54}" y="${f1(704 - 488 * k)}" width="108" height="${f1(488 * k)}" rx="20" fill="${c}"/>` + outlined(x, 790, [name], { size: 56, sw: 14 }) + outlined(x, 150, [Math.round(k * 100) + '%'], { size: 80, sw: 16 });
  h += meter(420, m1, MINT, '공부한 느낌') + meter(1500, m2, '#FF8A8A', '실제 기억');
  h += rz(t, lt, 960, 900, 1.0, '서기', [[0, '기본'], [1.8, '뿌듯'], [3.6, '걱정']]);
  h += rp(t, lt, 3.8, 960, 220, outlined(0, 0, ['착각일 수 있다'], { size: 80, sw: 18 }), { rot: -2, bob: 4 });
  h += rBook(960, 650, 240, 150, [[-100, -40, 90, 1], [8, -20, 90, 1]]);
  return h;
}
function rquestionScene(t, lt, a) {
  let h = rNavy();
  h += rz(t, lt, 640, 900, 1.0, '서기', [[0, '걱정'], [3, '기본']]);
  h += bubble(640, 250, 520, 190, rBook(-100, 0, 200, 120, []) + `<g opacity="${f1(1 - prog(lt, 1.5, 4) * 0.85)}">${rtext(120, 22, '눈으로 읽기', 40, NAVY)}</g>`, {});
  h += rp(t, lt, 0.4, 400, 330, outlined(0, 0, ['?'], { size: 190, fill: YEL, sw: 34 }), { rot: -10, bob: 6 });
  const k = prog(lt, 4.2, 5);
  if (lt > 4.2) h += rp(t, lt, 4.2, 1400, 480, rbox(0, 0, 520, 360, '#FFF', { inner: rtext(0, -70, '리처드 파인만', 58, INK) + rtext(0, 0, '노벨 물리학상', 46, '#456') + rtext(0, 78, '"학습법은?"', 56, RED) + rBulb(0, -170, 0.9, 0.9) }), { rot: 3, bob: 4 });
  return h;
}
function rtitleScene(t, lt, a) {
  let h = BG('#0F1B33') + `<circle cx="960" cy="520" r="${f1(420 + 30 * Math.sin(t * 2))}" fill="${GOLD}" opacity=".12"/>`;
  const k = easeInOut(prog(lt, 0.2, 1.4));
  h += `<g transform="translate(960 560)"><g opacity="${f1(1 - k)}"><rect x="-230" y="-150" width="460" height="300" rx="14" fill="#fff" stroke="${INK}" stroke-width="9"/><line x1="0" y1="-150" x2="0" y2="150" stroke="${INK}" stroke-width="6"/></g><g opacity="${f1(k)}">${rClosedBook(0, 0, 340 + 0, 300, '#4F86C6')}</g></g>`;
  h += outlined(960, 270, ['책을 덮고 하는 공부'], { size: 130, fill: GOLD, sw: 28 });
  h += rp(t, lt, 1.6, 960, 860, label(0, 0, '인출 연습 · 파인만 테크닉', { size: 54, bg: MINT }), { rot: -2, bob: 3 });
  h += rSparks(960, 560, t, 10, 330);
  return h;
}
function rchapterScene(t, lt, a) {
  let h = BG('#0F1B33') + qStarsLite() + `<circle cx="960" cy="540" r="460" fill="${GOLD}" opacity=".09"/>`;
  const k = easeOutBack(prog(lt, 0, 0.5));
  h += `<g transform="translate(960 380) scale(${f1(k * 100) / 100})"><circle r="120" fill="${GOLD}" stroke="${INK}" stroke-width="10"/>${rtext(0, 44, String(a.n), 130, INK)}</g>`;
  h += rp(t, lt, 0.3, 960, 640, outlined(0, 0, [a.title], { size: 96, sw: 22 }), { noPop: false });
  h += rp(t, lt, 0.7, 960, 790, label(0, 0, a.sub, { size: 52, bg: MINT }), { rot: -2 });
  return h;
}
