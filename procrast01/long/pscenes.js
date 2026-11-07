/* 미루기 편 v2 intro scenes (meme style). 1920x1080 world. Signature: pXxxScene(t, lt, a, run). */
Object.assign(CAMS, { pdrop: [1.28, 1.36, 900, 640], pchin: [1.0, 1.05, 960, 540], pcal: 'fixed', ppump: [1.15, 1.24, 960, 540], pvow: [1.1, 1.2, 960, 560],
  pflex: [1.05, 1.12, 960, 540], pceremony: [1.05, 1.12, 960, 540], pdays: 'fixed', pclock: 'fixed', pbrain: [1.05, 1.1, 960, 540], pshorts: [1.05, 1.1, 960, 540],
  pyasik: [1.15, 1.25, 960, 620], pstickers: [1.15, 1.25, 960, 560], pstop: 'fixed', phook: [1.05, 1.12, 960, 560] });
P['머리감싸'] = Object.assign({ armL: [[148, 285], [104, 210], [146, 120]], hL: [152, 112], armR: [[252, 285], [296, 210], [254, 120]], hR: [248, 112] }, NLEGS);
P['한손불끈'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [300, 220], [312, 140]], hR: [314, 130] }, NLEGS);
const BAD = '#FF3B5C', GOOD = '#2FBF71';
const meme = (t, lt, d, x, y, txt, o = {}) => rp(t, lt, d, x, y, outlined(0, 0, [[[txt, o.fill || YEL]]], { size: o.size || 96, sw: o.sw || 20 }), { rot: o.rot || -3, bob: 3 });
const pBox = (x, y, w, h, o = {}) => `<g transform="translate(${x} ${y}) rotate(${o.rot || 0})"><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="#C8955C" stroke="${INK}" stroke-width="7"/><path d="M${-w / 2} ${-h} l${w * 0.18} -${h * 0.22} M${w / 2} ${-h} l-${w * 0.18} -${h * 0.22}" stroke="${INK}" stroke-width="6" fill="#D9A86E"/><rect x="${-w * 0.08}" y="${-h}" width="${w * 0.16}" height="${h * 0.55}" fill="#E9D8B0" opacity=".8"/></g>`;
const pShoe = (x, y, s = 1, c = '#FF5A36') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-90 0 L-90 -40 Q-80 -70 -40 -66 L10 -60 Q40 -40 80 -30 Q110 -22 110 0 Z" fill="${c}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-96" y="-8" width="212" height="18" rx="8" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M-50 -50 L0 -30 M-30 -60 L10 -40" stroke="#fff" stroke-width="6"/></g>`;
const pPhone = (x, y, s = 1, inner = '', o = {}) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(${o.rot || 0})"><rect x="-70" y="-130" width="140" height="260" rx="22" fill="#1A1D26" stroke="${INK}" stroke-width="8"/><rect x="-58" y="-114" width="116" height="228" rx="12" fill="${o.screen || '#BFE6FF'}"/>${inner}</g>`;
function pRoom(t, o = {}) { // dark small bedroom
  let h = BG(o.lit ? '#3A4266' : '#1B2038') + `<rect x="1320" y="150" width="340" height="300" rx="10" fill="#0B1030" stroke="${INK}" stroke-width="8"/><line x1="1490" y1="150" x2="1490" y2="450" stroke="${INK}" stroke-width="6"/><circle cx="1580" cy="230" r="34" fill="#F4F1D0"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="${o.lit ? '#4A4F6E' : '#262B45'}" stroke="${INK}" stroke-width="6"/>`;
  if (!o.noClutter) h += pBox(260, 900, 220, 150, { rot: -4 }) + pBox(430, 905, 170, 110, { rot: 6 }) + pShoe(1660, 890, 0.8) + `<rect x="1760" y="840" width="160" height="56" rx="28" fill="#3DB6A0" stroke="${INK}" stroke-width="7"/>`;
  return h;
}
function pBed(x0 = 560, x1 = 1460, y = 780) {
  return `<rect x="${x0 - 30}" y="${y - 200}" width="60" height="300" rx="14" fill="#5A4A6E" stroke="${INK}" stroke-width="8"/><rect x="${x0}" y="${y - 20}" width="${x1 - x0}" height="80" rx="16" fill="#E9E4F4" stroke="${INK}" stroke-width="8"/><rect x="${x0 + 10}" y="${y + 56}" width="${x1 - x0 - 20}" height="44" fill="#4A3D5E" stroke="${INK}" stroke-width="7"/><rect x="${x0 + 40}" y="${y - 80}" width="240" height="80" rx="36" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
}
const pBlanket = (x0, x1, y) => `<path d="M${x0} ${y - 60} Q${x0 + 40} ${y - 150} ${x0 + 160} ${y - 140} L${x1} ${y - 120} Q${x1 + 20} ${y - 60} ${x1} ${y + 10} L${x0 - 10} ${y + 20} Z" fill="#7F8FD8" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M${x0 + 60} ${y - 100} Q${x0 + 200} ${y - 110} ${x0 + 320} ${y - 90} M${x0 + 80} ${y - 40} Q${x0 + 260} ${y - 60} ${x1 - 40} ${y - 40}" stroke="#6474C0" stroke-width="6" fill="none" stroke-linecap="round"/>`;

/* a0 is the AI room picture (ai_p.js). z0 + n1: the phone drops on his nose */
function pdropScene(t, lt, a, run) {
  let h = pRoom(t) + pBed();
  const zx = 1200, zy = 712, s = 0.82, headX = zx - 390 * s;
  const fall = a.after ? 1 : easeIn(prog(lt, 0.0, 0.22)), hit = a.after || lt > 0.22;
  h += Z({ t, seed: 31, x: zx, y: zy, s, rot: -90, pose: '서기', ex: exprAt(a.after ? [[0, '지침']] : [[0, '졸림'], [0.22, '놀람']], lt), look: [1, 0], shiver: !a.after && lt > 0.22 && lt < 0.8 });
  h += pBlanket(1010, 1480, 790);
  // arms up holding the phone
  const px = headX + 10, py = lerp(560, 640, fall);
  if (!hit || a.after) h += rArm(975, 755, px + 40, py + 70) + rArm(975, 669, px + 40, py - 10);
  h += pPhone(px, py, 0.55, `<rect x="-58" y="-114" width="116" height="228" rx="12" fill="#8FD0FF" opacity="${f1((0.5 + 0.3 * Math.sin(t * 7)) * 100) / 100}"/>`, { rot: hit && !a.after ? 80 : 0, screen: '#BFE6FF' });
  h += `<ellipse cx="${f1(headX)}" cy="600" rx="260" ry="200" fill="url(#screenGlow)" opacity=".5"/>`;
  if (hit && !a.after) { h += rfx(t, lt, 0.22, headX + 160, 470, '쿵!', WHITE, { size: 110, burst: 160, rot: -8 }); for (let i = 0; i < 4; i++) { const k = (t * 1.3 + i / 4) % 1, an = i * 1.57 + t * 3; h += `<text x="${f1(headX + Math.cos(an) * 110)}" y="${f1(560 + Math.sin(an) * 40)}" font-size="44" text-anchor="middle" opacity="${f1((1 - k) * 100) / 100}">⭐</text>`; } }
  if (a.after) h += rp(t, lt, 0.1, 460, 330, label(0, 0, '제로의 세계', { size: 40, bg: '#fff' }), { rot: -3 });
  return h;
}
/* n2: viewer POV — Zero stares at you, double chin appears */
function pchinScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('#1B2038') + `<rect x="0" y="0" width="1920" height="1080" fill="url(#vig)"/>`;
  const x = 960, y = 1500, s = 2.4;
  h += Z({ t, seed: 32, x, y, s, pose: '서기', ex: exprAt([[0, '기본'], [0.35 * D, '뿌듯']], lt), look: [0, 0.1] });
  if (lt > 0.62 * D) { const k = easeOutBack(prog(lt, 0.62 * D, 0.62 * D + 0.4)); const c = ptOf(x, y, s, 200, 285); h += `<g transform="translate(${f1(c[0])} ${f1(c[1] - 10)}) scale(${f1(k * 100) / 100})"><path d="M-110 0 Q0 46 110 0" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-80 30 Q0 64 80 30" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/></g>`;
    h += rtg(t, lt, 0.66 * D, 1480, 760, '투턱 감지', BAD, { size: 54, rot: 5, color: '#fff' }); }
  h += rtg(t, lt, 0.1, 380, 160, '지금 이 영상 보는 자세', '#fff', { size: 40, rot: -3 });
  // phone frame edges = "you are looking at a screen"
  h += `<rect x="40" y="40" width="1840" height="1000" rx="70" fill="none" stroke="#111" stroke-width="40" opacity=".9"/>`;
  return h;
}
/* n3: calendar triggers */
function pcalScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('#F4EBDD') + `<rect width="1920" height="1080" fill="url(#paper)"/>`;
  const cards = [['1월 1일', '새해', 0.02], ['매월 1일', '이번 달은 진짜', 0.3], ['일요일 23:00', '내일부터', 0.62]];
  cards.forEach(([big, small, d], i) => {
    const inner = `<rect x="-240" y="-260" width="480" height="520" rx="26" fill="#fff" stroke="${INK}" stroke-width="9"/><rect x="-240" y="-260" width="480" height="120" rx="26" fill="${[BAD, '#4F86C6', '#7A5AC9'][i]}" stroke="${INK}" stroke-width="9"/><rect x="-240" y="-170" width="480" height="30" fill="${[BAD, '#4F86C6', '#7A5AC9'][i]}"/>` + rtext(0, -185, small, 44, '#fff') + rtext(0, 60, big, big.length > 6 ? 76 : 96, INK);
    h += rp(t, lt, d * D, 380 + i * 580, 520, inner, { rot: [-4, 2, -2][i] });
  });
  return h;
}
/* n4: chest pumped, "갓생 호소인 모드 ON" */
function ppumpScene(t, lt, a) {
  const D = a._dur || 3;
  let h = pRoom(t, { lit: true });
  const k = prog(lt, 0.1, 0.55 * D), on = lt > 0.6 * D;
  h += shadow(960, 904, 80) + Z({ t, seed: 33, x: 960, y: 900, s: 1.0, sx: 1 + 0.12 * k, sy: 1 + 0.05 * k, pose: on ? '만세' : '서기', ex: exprAt([[0, '기본'], [0.3 * D, '결심'], [0.6 * D, '신남']], lt), look: [0, -0.2] });
  // pump
  const pu = Math.sin(lt * 14) * 20 * (1 - prog(lt, 0.55 * D, 0.6 * D));
  h += `<rect x="620" y="${f1(560 + pu)}" width="20" height="160" fill="#888" stroke="${INK}" stroke-width="5"/><rect x="580" y="${f1(546 + pu)}" width="100" height="22" rx="10" fill="#555" stroke="${INK}" stroke-width="5"/><rect x="600" y="700" width="60" height="180" rx="10" fill="#4F86C6" stroke="${INK}" stroke-width="7"/><path d="M660 760 Q760 760 860 640" stroke="${INK}" stroke-width="9" fill="none"/>`;
  const hs = 0.6 + 0.8 * k; h += `<text x="960" y="${f1(640)}" text-anchor="middle" font-size="${f1(90 * hs)}" opacity=".95">❤️</text>`;
  // toggle
  const tg = `<rect x="-330" y="-60" width="660" height="120" rx="60" fill="${on ? GOOD : '#555'}" stroke="${INK}" stroke-width="8"/><circle cx="${on ? 270 : -270}" cy="0" r="46" fill="#fff" stroke="${INK}" stroke-width="6"/>` + rtext(on ? -40 : 40, 20, on ? '갓생 호소인 모드 ON' : '갓생 호소인 모드 OFF', 48, '#fff');
  h += rp(t, lt, 0.05, 960, 170, tg, {});
  if (on) h += rSparks(960, 450, t, 10, 260);
  return h;
}
/* n5: the vow (Zero's inner voice) */
function pvowScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('#3A0C12');
  for (let i = 0; i < 9; i++) { const fx0 = 80 + i * 230, fh = 300 + Math.sin(t * 7 + i * 1.7) * 70 + hash(i) * 140; h += `<path d="M${fx0 - 90} 1100 Q${fx0 - 70} ${1100 - fh * 0.5} ${fx0 + Math.sin(t * 5 + i) * 24} ${1100 - fh} Q${fx0 + 70} ${1100 - fh * 0.5} ${fx0 + 90} 1100 Z" fill="${i % 2 ? '#FF6A2A' : '#FF3B2F'}" opacity=".85"/>`; }
  h += shadow(960, 904, 90) + Z({ t, seed: 34, x: 960, y: 900, s: 1.1, pose: '한손불끈', ex: exprAt([[0, '결심']], lt), look: [0.1, -0.3], shiver: true });
  h += meme(t, lt, 0.15 * D, 560, 300, '이따위로 살 순 없다', { size: 70, fill: WHITE, rot: -4 });
  h += meme(t, lt, 0.55 * D, 1400, 420, '인생 리셋', { size: 120, rot: 5 });
  return h;
}
/* n6-n9: capitalism flex — items pile up */
function pflexScene(t, lt, a, run) {
  const D = a._dur || 3, k = a.k || 0;
  let h = BG('#2A2150') + `<rect width="1920" height="1080" fill="url(#dots)"/><rect x="-600" y="880" width="3120" height="600" fill="#3A2E66" stroke="${INK}" stroke-width="6"/>`;
  h += shadow(960, 904, 80) + Z({ t, seed: 35, x: 960, y: 900, s: 0.95, pose: k === 2 ? '서기' : '만세', ex: exprAt(k === 2 ? [[0, '졸림']] : [[0, '신남']], lt), look: [0, -0.1] });
  if (k === 0) { // card swipe
    const sx = lerp(300, 1600, easeInOut(prog(lt, 0.2, 0.9)));
    h += `<g transform="translate(${f1(sx)} 300) rotate(-8)"><rect x="-170" y="-105" width="340" height="210" rx="22" fill="#2F6FDB" stroke="${INK}" stroke-width="8"/><rect x="-130" y="-50" width="70" height="52" rx="8" fill="#F2C94C" stroke="${INK}" stroke-width="5"/><rect x="-130" y="40" width="240" height="18" rx="9" fill="#fff" opacity=".7"/></g>`;
    h += meme(t, lt, 0.55 * D, 960, 160, '자본주의 플렉스', { size: 100, fill: '#FFD23F' });
  }
  const paid = (x, y, d) => rp(t, lt, d, x, y, label(0, 0, '결제 완료 ✓', { size: 40, bg: GOOD }), { rot: -4 });
  if (k >= 1) { const dk = k === 1 ? easeOutBack(prog(lt, 0.25 * D, 0.25 * D + 0.4)) : 1; h += `<g transform="translate(0 ${f1((1 - dk) * -500)})">${pShoe(460, 820, 1.4)}</g>`; if (k === 1) { h += paid(460, 640, 0.5 * D); h += rtg(t, lt, 0.2, 460, 520, '신상 러닝화', '#fff', { size: 40, rot: -3 }); } }
  if (k >= 2) { h += `<g transform="translate(1420 640)"><rect x="-230" y="-150" width="460" height="300" rx="16" fill="#1B2438" stroke="${INK}" stroke-width="9"/>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${-200 + (i % 3) * 140}" y="${-120 + Math.floor(i / 3) * 130}" width="120" height="110" rx="12" fill="${['#FF8FB8', '#8FD0FF', '#FFE27A', '#B6F09C', '#C9A7FF', '#FFB26B'][i]}"/>`).join('')}<rect x="-260" y="150" width="520" height="30" rx="10" fill="#9AA3AE" stroke="${INK}" stroke-width="6"/></g>`;
    if (k === 2) { h += digiClock(1420, 280, '03:00', true); h += rtg(t, lt, 0.2, 1420, 410, '템플릿 스크랩 중…', '#fff', { size: 36, rot: 3 }); const c = ptOf(960, 900, 0.95, 200, 188); h += `<g opacity=".8"><line x1="${c[0] - 50}" y1="${c[1] - 6}" x2="${c[0] - 20}" y2="${c[1] + 4}" stroke="${BAD}" stroke-width="4"/><line x1="${c[0] + 20}" y1="${c[1] + 4}" x2="${c[0] + 50}" y2="${c[1] - 6}" stroke="${BAD}" stroke-width="4"/></g>`; } }
  if (k >= 3) { const cols = ['#FF5FA2', '#FFE14D', '#7CFFB2', '#7FD6FF', '#FFB26B', '#C9A7FF']; cols.forEach((c, i) => { const d = (0.1 + i * 0.08) * D, kk = k === 3 ? easeOutBack(prog(lt, d, d + 0.3)) : 1; h += `<g transform="translate(${760 + i * 80} ${f1(560 - 40 * Math.sin(i))}) rotate(${-30 + i * 12}) scale(${f1(kk * 100) / 100})"><rect x="-18" y="-80" width="36" height="160" rx="10" fill="${c}" stroke="${INK}" stroke-width="6"/><rect x="-18" y="-80" width="36" height="40" rx="10" fill="#fff" stroke="${INK}" stroke-width="6"/></g>`; }); if (k === 3) h += meme(t, lt, 0.55 * D, 960, 200, '색깔별 세팅 완료', { size: 80, fill: WHITE }); }
  return h;
}
/* n10: national-team send-off */
function pceremonyScene(t, lt, a) {
  let h = BG('#1E3A6E') + `<polygon points="300,-50 520,-50 760,900 160,900" fill="#FFF3C4" opacity=".12"/><polygon points="1620,-50 1400,-50 1160,900 1760,900" fill="#FFF3C4" opacity=".12"/>` + `<rect x="-600" y="880" width="3120" height="600" fill="#24426E" stroke="${INK}" stroke-width="6"/>`;
  h += `<rect x="760" y="700" width="400" height="180" fill="${GOLD}" stroke="${INK}" stroke-width="9"/>` + rtext(960, 815, '1', 110, INK);
  h += shadow(960, 704, 70) + Z({ t, seed: 36, x: 960, y: 700, s: 0.9, pose: '만세', ex: exprAt([[0, '신남']], lt), look: [0, -0.2] });
  h += pShoe(560, 870, 0.9) + `<rect x="1300" y="790" width="240" height="90" rx="10" fill="#1B2438" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 40; i++) { const x = (i * 157) % 1920, y = ((t * 220 + i * 97) % 1100) - 50, c = ['#FF5FA2', '#FFE14D', '#7CFFB2', '#7FD6FF', '#FFB26B'][i % 5]; h += `<rect x="${x}" y="${f1(y)}" width="16" height="26" fill="${c}" transform="rotate(${f1(t * 200 + i * 30)} ${x + 8} ${f1(y + 13)})"/>`; }
  h += `<rect x="560" y="150" width="800" height="110" rx="14" fill="${BAD}" stroke="${INK}" stroke-width="8"/>` + rtext(960, 228, '갓생 국가대표 출정식', 60, '#fff');
  return h;
}
/* n11-n14: day 1/2/3 */
function pdaysScene(t, lt, a) {
  const D = a._dur || 3, d = a.d || 0;
  if (d === 0) { let h = BG('#0E0E16'); h += rp(t, lt, 0.1, 960, 480, outlined(0, 0, ['3일 뒤…'], { size: 160, sw: 26 }), {}); h += rp(t, lt, 0.5 * D, 960, 660, label(0, 0, '결과는?', { size: 60, bg: YEL }), { rot: -3 }); return h; }
  if (d === 3) { let h = BG('#07070C') + `<circle cx="960" cy="500" r="${f1(200 + 40 * Math.sin(t * 6))}" fill="url(#redglow)" opacity=".6"/>`; h += rp(t, lt, 0.1, 960, 470, outlined(0, 0, [[['DAY 3', BAD]]], { size: 190, sw: 30 }), {}); h += rp(t, lt, 0.45 * D, 960, 660, label(0, 0, '운명의 셋째 날', { size: 56, bg: '#fff' }), {}); return h; }
  let h = pRoom(t, { lit: true, noClutter: true });
  h += rp(t, lt, 0.05, 260, 140, outlined(0, 0, [[['DAY ' + d, d === 1 ? GOOD : '#FFB26B']]], { size: 110, sw: 22 }), { rot: -4 });
  if (d === 1) {
    h += shadow(620, 904, 70) + Z({ t, seed: 37, x: 620, y: 900, s: 0.9, pose: '만세', ex: exprAt([[0, '신남']], lt), look: [0.4, -0.1] });
    h += rp(t, lt, 0.25 * D, 1280, 520, pPhone(0, 0, 1.6, `<rect x="-58" y="-114" width="116" height="228" rx="12" fill="url(#sunset)"/><rect x="-40" y="-20" width="80" height="34" rx="10" fill="#fff"/>` + rtext(0, 6, '오운완🔥', 20, BAD) + `<circle cx="-36" cy="-90" r="12" fill="${PINK}"/>`), { rot: 4 });
    h += rp(t, lt, 0.6 * D, 1280, 200, label(0, 0, '스토리 업로드 완료', { size: 44, bg: PINK }), { rot: 3 });
  } else {
    const sq = (Math.sin(lt * 5) + 1) / 2;
    h += shadow(960, 904, 70) + Z({ t, seed: 38, x: 960, y: 900, s: 0.95, pose: mixPose('서기', '웅크림', sq), ex: exprAt([[0, '결심']], lt), look: [0, 0], sweat: true, shiver: true });
    h += rp(t, lt, 0.3 * D, 1420, 330, label(0, 0, '피곤해 죽겠는데…', { size: 48, bg: '#fff' }), { rot: 3 });
    h += rp(t, lt, 0.6 * D, 520, 420, outlined(0, 0, ['이 악물고'], { size: 80, sw: 16 }), { rot: -4 });
  }
  return h;
}
/* n15: home after overtime — 20:14 */
function pclockScene(t, lt, a) {
  const D = a._dur || 3, rev = 0.62 * D;
  let h = pRoom(t, { noClutter: true });
  if (lt < rev) {
    const x = lerp(1900, 1100, easeOut(prog(lt, 0, 0.45 * D)));
    h += shadow(x, 904, 70) + Z({ t, seed: 39, x, y: 900, s: 0.95, pose: lt < 0.45 * D ? walkPose(t * 5, 0.5) : '서기', ex: exprAt([[0, '지침']], lt), look: [-0.8, -0.5] });
    h += digiClock(600, 320, '20:14', false);
    return h;
  }
  const z = easeOutBack(prog(lt, rev, rev + 0.35));
  h += `<rect width="1920" height="1080" fill="#000" opacity=".55"/><g transform="translate(960 470) scale(${f1((1 + 2.4 * z) * 100) / 100})">${digiClock(0, 0, '20:14', false)}</g>`;
  h += rp(t, lt, rev + 0.3, 960, 860, label(0, 0, '저녁 8시 14분', { size: 64, bg: YEL }), { rot: -2 });
  return h;
}
/* n16-n17: the "o'clock" dopamine circuit */
function pbrainScene(t, lt, a) {
  const D = a._dur || 3;
  if (!a.k) {
    let h = BG('#14233A') + `<rect width="1920" height="1080" fill="url(#grid)"/>`;
    h += rBrain(760, 560, 1.6, {});
    const nodes = [[560, 470], [700, 400], [860, 440], [960, 540], [820, 640], [640, 610]];
    nodes.forEach(([x, y], i) => { const on = lt > (0.15 + i * 0.08) * D; h += `<circle cx="${x}" cy="${y}" r="22" fill="${on ? '#FFE14D' : '#555'}" stroke="${INK}" stroke-width="6"/>` + (on ? `<circle cx="${x}" cy="${y}" r="50" fill="url(#warm)" opacity=".8"/>` : ''); if (i) { const [px, py] = nodes[i - 1]; h += `<line x1="${px}" y1="${py}" x2="${x}" y2="${y}" stroke="${on ? '#FFE14D' : '#555'}" stroke-width="8"/>`; } });
    if (lt > 0.65 * D) h += `<g opacity="${f1(prog(lt, 0.65 * D, 0.8 * D) * 100) / 100}">${rArrow(1080, 540, 1300, 540, YEL, 16)}</g>` + `<g transform="translate(1560 540) scale(1.3)">${digiClock(0, 0, '21:00', false)}</g>`;
    h += rp(t, lt, 0.1, 760, 170, label(0, 0, '정각병 도파민 회로', { size: 60, bg: YEL }), { rot: -3 });
    return h;
  }
  let h = pRoom(t) + pBed();
  h += Z({ t, seed: 40, x: 1200, y: 712, s: 0.82, rot: -90, pose: '서기', ex: exprAt([[0, '뿌듯']], lt), look: [1, 0.3] }) + pBlanket(1010, 1480, 790);
  h += digiClock(1500, 300, '20:14', false) + rArrow(1500, 380, 1500, 470, YEL, 12) + `<g transform="translate(1500 540)">${digiClock(0, 0, '21:00', false)}</g>`;
  h += rp(t, lt, 0.35 * D, 1500, 660, label(0, 0, '애매하니까 정각에!', { size: 44, bg: '#fff' }), { rot: 3 });
  h += rp(t, lt, 0.7 * D, 600, 300, label(0, 0, '완벽하게 각 잡고', { size: 48, bg: YEL }), { rot: -3 });
  return h;
}
/* n18: three shorts later it's 23:40 */
function pshortsScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('#0E1222');
  const sw = Math.min(3, Math.floor(prog(lt, 0.15 * D, 0.7 * D) * 3.999)), sub = (prog(lt, 0.15 * D, 0.7 * D) * 3) % 1;
  const cols = ['#FF8FB8', '#8FD0FF', '#FFE27A', '#B6F09C'];
  const scr = `<g clip-path="url(#pclip)">${[0, 1].map(j => `<rect x="-260" y="${f1(-270 + j * 460 - (sw < 3 && sub > 0.7 ? (sub - 0.7) / 0.3 * 460 : 0))}" width="520" height="460" fill="${cols[(sw + j) % 4]}"/>`).join('')}</g>`;
  h += `<g transform="translate(760 540)"><rect x="-290" y="-300" width="580" height="620" rx="40" fill="#1A1D26" stroke="${INK}" stroke-width="10"/>${scr}<rect x="-260" y="-270" width="520" height="460" rx="22" fill="none" stroke="${INK}" stroke-width="6"/></g>`;
  h += rp(t, lt, 0.15 * D, 760, 120, label(0, 0, `쇼츠 ${Math.max(1, sw)}개째`, { size: 50, bg: '#fff' }), { rot: -3 });
  const mins = Math.round(lerp(20 * 60 + 14, 23 * 60 + 40, easeIn(prog(lt, 0.15 * D, 0.85 * D))));
  const cs = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
  h += `<g transform="translate(1440 460) scale(1.5)">${digiClock(0, 0, cs, true)}</g>`;
  if (lt > 0.85 * D) h += meme(t, lt, 0.85 * D, 1440, 700, '밤 11시 40분', { size: 90, fill: BAD });
  return h;
}
/* n19: late-night delivery + head grabbing */
function pyasikScene(t, lt, a) {
  const D = a._dur || 3;
  let h = pRoom(t, { lit: true });
  const eat = lt > 0.45 * D;
  h += shadow(860, 904, 80) + Z({ t, seed: 41, x: 860, y: 900, s: 0.95, pose: eat ? '머리감싸' : '서기', ex: exprAt(eat ? [[0.45 * D, '걱정']] : [[0, '신남']], lt), look: [0.5, 0.4], shiver: eat });
  if (!eat) h += pPhone(1160, 560, 0.9, `<rect x="-58" y="-114" width="116" height="228" rx="12" fill="#2AC1BC"/><rect x="-46" y="20" width="92" height="40" rx="12" fill="#fff"/>` + rtext(0, 48, '주문하기', 22, '#2AC1BC'), {});
  else { h += `<g transform="translate(1240 830)"><rect x="-130" y="-70" width="260" height="140" rx="12" fill="#F2A541" stroke="${INK}" stroke-width="8"/><path d="M-110 -70 q20 -60 60 -40 q30 -50 70 -10 q40 -40 70 20" fill="#C9772A" stroke="${INK}" stroke-width="6"/></g>`; h += rp(t, lt, 0.45 * D, 1240, 640, label(0, 0, '띵동! 야식 도착', { size: 44, bg: '#fff' }), { rot: 4 }); }
  if (eat) h += meme(t, lt, 0.6 * D, 520, 250, '현타', { size: 130, fill: BAD });
  return h;
}
/* n20: labels stuck on Zero (inner voice) */
function pstickersScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('#2B2140') + `<rect x="-600" y="880" width="3120" height="600" fill="#3A2E52" stroke="${INK}" stroke-width="6"/>`;
  h += shadow(960, 904, 80) + Z({ t, seed: 42, x: 960, y: 900, s: 1.05, pose: '머리감싸', ex: exprAt([[0, '걱정'], [0.75 * D, '지침']], lt), look: [0, 0.4], shiver: true });
  const st = [['작심삼일', 760, 330, -12, 0.2], ['개복치 🐟', 1180, 420, 10, 0.42], ['헬스장 기부천사 😇', 940, 640, -5, 0.62], ['글러 먹음', 1220, 760, 8, 0.82]];
  st.forEach(([w, x, y, r, d]) => { if (lt < d * D) return; const k = easeOutBack(prog(lt, d * D, d * D + 0.25)); h += `<g transform="translate(${x} ${y}) rotate(${r}) scale(${f1((2 - k) * 100) / 100})" opacity="${f1(Math.min(1, k) * 100) / 100}">${label(0, 0, w, { size: 52, bg: '#FFF7B0' })}</g>`; });
  return h;
}
/* n21: hit by bones -> STOP */
function pstopScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('#E9E2D0') + `<rect width="1920" height="1080" fill="url(#paper)"/><rect x="-600" y="880" width="3120" height="600" fill="#CDBE9E" stroke="${INK}" stroke-width="6"/>`;
  const stop = lt > 0.72 * D, wob = stop ? 0 : Math.sin(t * 18) * 6;
  h += shadow(960, 904, 80) + Z({ t, seed: 43, x: 960 + wob, y: 900, s: 1.0, rot: wob, pose: '허우적', ex: exprAt([[0, '겁먹음']], lt), look: [0.2, 0] });
  for (let i = 0; i < 6; i++) { const tb = (0.05 + i * 0.1) * D, k = prog(lt, tb, tb + 0.35); if (k <= 0 || k >= 1 || stop) continue; const from = [[-100, 200], [2020, 260], [-100, 600], [2020, 640], [400, -100], [1500, -100]][i]; const x = lerp(from[0], 960, k), y = lerp(from[1], 520, k);
    h += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(k * 540)})"><rect x="-60" y="-14" width="120" height="28" rx="12" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="-60" cy="-14" r="20" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="-60" cy="14" r="20" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="60" cy="-14" r="20" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="60" cy="14" r="20" fill="#fff" stroke="${INK}" stroke-width="6"/></g>`;
    if (k > 0.9) h += `<text x="${f1(960 + (i % 2 ? 120 : -140))}" y="${f1(430 + i * 30)}" font-family="${FONT}" font-weight="900" font-size="60" fill="${BAD}" stroke="${INK}" stroke-width="6" paint-order="stroke">퍽!</text>`; }
  if (!stop && lt > 0.45 * D) h += rtg(t, lt, 0.45 * D, 1480, 300, '순살 되기 직전', '#fff', { size: 46, rot: 5 });
  if (stop) { const k = easeOutBack(prog(lt, 0.72 * D, 0.72 * D + 0.3)); h += `<g transform="translate(960 470) scale(${f1(k * 100) / 100}) rotate(-6)"><polygon points="-150,-362 150,-362 362,-150 362,150 150,362 -150,362 -362,150 -362,-150" fill="${BAD}" stroke="#fff" stroke-width="24"/><polygon points="-150,-362 150,-362 362,-150 362,150 150,362 -150,362 -362,150 -362,-150" fill="none" stroke="${INK}" stroke-width="8"/>` + rtext(0, 70, 'STOP', 200, '#fff') + `</g>`; }
  return h;
}
/* n22-n24: not lazy — hooked by "perfectionism" */
function phookScene(t, lt, a, run) {
  const D = a._dur || 3, k = a.k || 0;
  let h = BG('#10243A') + `<rect width="1920" height="1080" fill="url(#grid)"/><rect x="-600" y="880" width="3120" height="600" fill="#1C3350" stroke="${INK}" stroke-width="6"/>`;
  if (k === 0) {
    h += shadow(960, 904, 80) + Z({ t, seed: 44, x: 960, y: 900, s: 1.0, pose: '서기', ex: exprAt([[0, '걱정'], [0.6 * D, '놀람']], lt), look: [0, -0.2] });
    h += rp(t, lt, 0.1, 960, 220, label(0, 0, '게을러터진 쓰레기?', { size: 66, bg: '#fff' }), { rot: -2 });
    if (lt > 0.55 * D) { const kk = prog(lt, 0.55 * D, 0.7 * D); h += `<g transform="translate(960 220)"><line x1="-330" y1="-60" x2="${f1(-330 + 660 * kk)}" y2="${f1(-60 + 120 * kk)}" stroke="${BAD}" stroke-width="26" stroke-linecap="round"/><line x1="330" y1="-60" x2="${f1(330 - 660 * kk)}" y2="${f1(-60 + 120 * kk)}" stroke="${BAD}" stroke-width="26" stroke-linecap="round"/></g>`; }
    if (lt > 0.75 * D) h += meme(t, lt, 0.75 * D, 960, 420, '아닙니다', { size: 110, fill: GOOD });
    return h;
  }
  // brain sets a trap; then the hook pulls Zero up
  const up = k === 2 ? easeIn(prog(lt, 0.45 * D, D + 0.2)) : 0;
  const zy = 900 - 520 * up;
  if (k === 1) { h += rBrain(1480, 420, 1.3, {}); h += `<g transform="translate(1480 280)">${outlined(0, 0, ['지능적'], { size: 50, sw: 10, fill: YEL })}</g>`; h += `<g transform="translate(960 880) scale(1.8)"><path d="M-170 0 L170 0" stroke="#888" stroke-width="16"/>${[...Array(9)].map((_, i) => `<path d="M${-160 + i * 40} 0 l20 -${50 + (i % 2) * 20} l20 ${50 + (i % 2) * 20}" fill="#ccc" stroke="${INK}" stroke-width="5"/>`).join('')}</g>` + rp(t, lt, 0.3 * D, 960, 760, label(0, 0, '덫', { size: 56, bg: BAD }), {}); }
  h += shadow(k === 1 ? 560 : 960, 904, 80 * (1 - up * 0.7)) + Z({ t, seed: 44, x: k === 1 ? 560 : 960, y: zy, s: 1.0, pose: k === 2 && up > 0 ? '허우적' : '서기', ex: exprAt(k === 2 ? [[0, '기본'], [0.45 * D, '놀람']] : [[0, '기본']], lt), look: k === 1 ? [0.9, 0] : [0, -0.6] });
  if (k === 2) {
    const hookY = lerp(-200, 900 - 300, easeOut(prog(lt, 0, 0.4 * D))) - 520 * up;
    h += `<line x1="960" y1="-100" x2="960" y2="${f1(hookY - 60)}" stroke="#ddd" stroke-width="5"/><path d="M960 ${f1(hookY - 60)} L960 ${f1(hookY + 20)} Q960 ${f1(hookY + 70)} 1010 ${f1(hookY + 60)} Q1040 ${f1(hookY + 40)} 1030 ${f1(hookY + 10)}" fill="none" stroke="#C9D2DC" stroke-width="12" stroke-linecap="round"/>`;
    h += `<g transform="translate(1120 ${f1(hookY - 140)})">${label(0, 0, '완벽주의', { size: 54, bg: YEL })}</g>`;
    if (lt > 0.6 * D) h += meme(t, lt, 0.6 * D, 520, 260, '홀라당 낚임', { size: 96, fill: BAD });
  }
  return h;
}
