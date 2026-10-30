/* ---------- experiment 017 scenes ---------- */
if (!E['미소']) E['미소'] = Object.assign(dotEyes(10, 12), { bL: [140, 148, 163, 142, 186, 148], bR: [214, 148, 237, 142, 260, 148], mouth: 'M184 230 Q200 246 216 230', mouthFill: 'none' });
if (!E['생각']) E['생각'] = Object.assign(dotEyes(9, 12), { bL: [140, 146, 163, 136, 186, 142], bR: [214, 150, 237, 146, 260, 150], mouth: 'M190 236 Q198 231 210 234', mouthFill: 'none' });
if (!E['찡그림']) E['찡그림'] = Object.assign(dotEyes(9, 10), { bL: [140, 146, 163, 156, 186, 164], bR: [214, 164, 237, 156, 260, 146], mouth: 'M186 240 Q200 232 214 240', mouthFill: 'none' });
if (!P['허리']) P['허리'] = { armL: [[148, 285], [98, 338], [140, 392]], hL: [144, 396], armR: [[252, 285], [302, 338], [260, 392]], hR: [256, 396], legL: [[180, 412], [166, 470], [154, 522]], fL: [142, 534, 0], legR: [[220, 412], [234, 470], [246, 522]], fR: [258, 534, 0], dy: 0 };
if (!P['던지기']) P['던지기'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [306, 262], [352, 220]], hR: [360, 212] }, LEGS);
if (!P['앉아던지기']) P['앉아던지기'] = Object.assign({}, P['앉기'], { armR: [[252, 285], [306, 262], [352, 220]], hR: [360, 212] });
if (!P['앉아안기']) P['앉아안기'] = Object.assign({}, P['앉기'], { armL: P['안기'].armL, hL: P['안기'].hL, armR: P['안기'].armR, hR: P['안기'].hR });
if (!P['입막기']) P['입막기'] = Object.assign({}, P['앉기'], { armR: [[252, 285], [250, 300], [214, 248]], hR: [208, 240] });
if (!P['앉아턱']) P['앉아턱'] = Object.assign({}, P['앉기'], { armR: [[252, 290], [288, 332], [246, 292]], hR: [238, 284] });

Object.assign(CAMS, {
  cdate: [1.0, 1.05, 960, 560], chook: [1.0, 1.04, 960, 540], cweek: [1.0, 1.04, 960, 560], cdoc: [1.0, 1.05, 960, 560], ckong: [1.0, 1.04, 960, 540],
  cmon: [1.0, 1.05, 960, 560], cself: [1.0, 1.03, 960, 520], cpause: [1.0, 1.05, 960, 560], ctue: [1.0, 1.05, 960, 560], cask: [1.0, 1.03, 960, 520],
  cwed: [1.0, 1.05, 960, 560], cboom: [1.0, 1.03, 960, 520], csan: [1.0, 1.04, 960, 540], cgrand: [1.0, 1.06, 960, 560], crule: [1.0, 1.05, 960, 540],
  cthu: [1.0, 1.04, 960, 560], cmap: [1.0, 1.05, 960, 560], cfri: [1.0, 1.05, 960, 560], cscore: [1.0, 1.06, 960, 560], cgap: [1.0, 1.03, 960, 520],
  creply: [1.0, 1.05, 960, 560], csat: [1.0, 1.06, 960, 560], cend: [1.0, 1.04, 960, 560], cmagic: [1.0, 1.04, 960, 540]
});
const D17 = a => a._dur || 5;
const at17 = (t, a, phrase, d = 0) => fracOf13(t, phrase) * D17(a) + d;
const seg17 = (t, lt, j) => segLt(t, lt, j);
const dim17 = (o, c = '#0B1626') => `<rect x="-600" y="-600" width="3120" height="2280" fill="${c}" opacity="${f1(o * 100) / 100}"/>`;
const floor17 = (y, c, line = INK) => `<rect x="-600" y="${y}" width="3120" height="${1480 - y}" fill="${c}"/><line x1="-600" y1="${y}" x2="2520" y2="${y}" stroke="${line}" stroke-width="7"/>`;
const handAt = (o, hk) => { const s = o.s || 1, p = typeof o.pose === 'string' ? P[o.pose] : o.pose; const h = p[hk]; return [o.x + (h[0] - 200) * s, o.y + (h[1] - 560) * s + ((p.dy || 0) * s)]; };
const T17 = (x, y, txt, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${o.anchor || 'middle'}" font-family="${FONT}" font-weight="${o.w || 900}" font-size="${o.size || 36}" fill="${o.fill || NAVY}">${esc(txt)}</text>`;
const card17 = (x, y, w, hh, inner, o = {}) => `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="${-w / 2 + 8}" y="${-hh / 2 + 10}" width="${w}" height="${hh}" rx="26" fill="${INK}" opacity=".3"/><rect x="${-w / 2}" y="${-hh / 2}" width="${w}" height="${hh}" rx="26" fill="${o.bg || '#FFFDF4'}" stroke="${INK}" stroke-width="7"/>${inner}</g>`;
function quote17(t, T0, x, y, lines, src, o = {}) {
  const w = o.w || 1180, hh = 110 + lines.length * 78, fs = o.size || 50;
  const inner = `<text x="${-w / 2 + 30}" y="${-hh / 2 + 92}" font-family="Georgia, serif" font-size="110" fill="#E2C46B">“</text>` + lines.map((l, j) => T17(0, -hh / 2 + 90 + j * 78, l, { size: fs })).join('') + T17(w / 2 - 36, hh / 2 - 24, src, { anchor: 'end', size: 26, fill: '#8A6A44', w: 700 });
  return pop(t, T0, t + 99, x, y, card17(0, 0, w, hh, inner), { rot: o.rot || -1, inDur: 0.4 });
}
function arc17(x0, y0, x1, y1, k, hgt = 160) { const x = lerp(x0, x1, k), y = lerp(y0, y1, k) - Math.sin(k * Math.PI) * hgt; return [x, y]; }

/* ---------- places ---------- */
function cafe17(t, o = {}) { // the café of the first and the last date; table centre 960, Zero left, partner right
  let h = BG(o.night ? '#3A2C2A' : '#EBDDC8') + BG('url(#hatch)').replace('/>', ' opacity=".12"/>');
  h += `<rect x="560" y="120" width="800" height="420" rx="14" fill="${o.night ? '#1B2440' : '#BFE0F0'}" stroke="${INK}" stroke-width="9"/><line x1="960" y1="120" x2="960" y2="540" stroke="${INK}" stroke-width="7"/>`;
  if (o.night) { for (let i = 0; i < 6; i++) h += `<circle cx="${620 + i * 130}" cy="${300 + (i % 3) * 50}" r="10" fill="#FFE29A" opacity=".8"/>`; }
  else h += `<rect x="600" y="380" width="320" height="160" fill="#C8D8C2"/><rect x="1000" y="340" width="320" height="200" fill="#C9CFDA"/>`;
  [700, 1220].forEach(x => h += `<line x1="${x}" y1="0" x2="${x}" y2="120" stroke="${INK}" stroke-width="4"/><path d="M${x - 50} 160 Q${x} 110 ${x + 50} 160 Z" fill="#F2B84B" stroke="${INK}" stroke-width="5"/><ellipse cx="${x}" cy="230" rx="140" ry="80" fill="url(#warm)" opacity=".5"/>`);
  h += floor17(880, '#A88468') + seatL17(ZSEAT) + seatR17(PSEAT);
  return h;
}
function cafeTable17(t, cups = true) {
  let h = `<rect x="760" y="700" width="400" height="28" rx="10" fill="#7A5236" stroke="${INK}" stroke-width="7"/><rect x="946" y="728" width="28" height="152" fill="#5E3E28" stroke="${INK}" stroke-width="6"/><rect x="890" y="868" width="140" height="16" rx="6" fill="#5E3E28" stroke="${INK}" stroke-width="5"/>`;
  if (cups) h += `<path d="M840 700 L846 662 L886 662 L892 700 Z" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M1030 700 L1036 662 L1076 662 L1082 700 Z" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
  return h;
}
const ZSEAT = { x: 640, y: 880, s: 0.6 }, PSEAT = { x: 1280, y: 880, s: 0.6 };
// seats: chair12 puts the seat under a seated character drawn at (x, y, s); the right-hand chair is mirrored
const seatL17 = o => chair12(o.x, o.y, o.s), seatR17 = o => flip(o.x, chair12(o.x, o.y, o.s));
// ball in a hand: left person uses the right hand (towards the partner), right person the left hand
const ballL17 = o => { const [x, y] = handAt(o, 'hR'); return [x + 18 * o.s, y - 10 * o.s]; };
const ballR17 = o => { const [x, y] = handAt(o, 'hL'); return [x - 18 * o.s, y - 10 * o.s]; };
function office17(t, o = {}) {
  let h = BG('#E7ECF1') + BG('url(#hatch)').replace('/>', ' opacity=".12"/>');
  h += `<rect x="1160" y="110" width="620" height="420" rx="10" fill="${o.night ? '#0B1430' : '#BFE0F5'}" stroke="${INK}" stroke-width="9"/>`;
  for (let i = 0; i < 7; i++) h += `<rect x="${1190 + i * 84}" y="${300 - (i % 3) * 60}" width="64" height="${230 + (i % 3) * 60}" fill="${o.night ? '#22305A' : '#9DB4C8'}" stroke="${INK}" stroke-width="4"/>`;
  h += `<line x1="1470" y1="110" x2="1470" y2="530" stroke="${INK}" stroke-width="7"/>`;
  if (o.night) h += `<circle cx="1660" cy="180" r="32" fill="#FFF2C0"/>`;
  h += `<rect x="160" y="300" width="140" height="240" rx="12" fill="#5A6470" stroke="${INK}" stroke-width="7"/><rect x="185" y="330" width="90" height="60" rx="6" fill="#2A3038"/><path d="M215 440 L215 470 L245 470 L245 440" fill="none" stroke="#C9D6E2" stroke-width="5"/>` + T17(230, 520, '커피', { size: 24, fill: '#fff' });
  h += floor17(880, '#B9A88E');
  return h;
}
const LZ17 = { x: 640, y: 880, s: 0.56 }, LH17 = { x: 1280, y: 880, s: 0.56 };
function lunch17(t) { // break-room table: Zero (left chair), 하린 (right chair)
  return office17(t) + seatL17(LZ17) + seatR17(LH17) + `<rect x="740" y="720" width="440" height="28" rx="10" fill="#E8E2D6" stroke="${INK}" stroke-width="7"/><rect x="770" y="748" width="22" height="132" fill="#9AA6B2" stroke="${INK}" stroke-width="5"/><rect x="1128" y="748" width="22" height="132" fill="#9AA6B2" stroke="${INK}" stroke-width="5"/>` + lunchBowls17();
}
// bowls sit ON the table top (y 720): rim at 686, base on the table
const lunchBowls17 = () => [810, 1110].map(x => `<rect x="${x - 18}" y="712" width="36" height="8" rx="3" fill="#E9E4DA" stroke="${INK}" stroke-width="4"/><path d="M${x - 46} 688 Q${x - 40} 716 ${x - 14} 714 L${x + 14} 714 Q${x + 40} 716 ${x + 46} 688 Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="${x}" cy="688" rx="46" ry="9" fill="#F2C14E" stroke="${INK}" stroke-width="4"/>`).join('');
const CW17 = o => HALO(char(Object.assign({ goggles: 'none', vest: '#7FA8D6', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', hair: '#4A3A2A' }, o)));
function meeting17(t) {
  let h = BG('#E9E4DA') + BG('url(#hatch)').replace('/>', ' opacity=".1"/>');
  h += `<rect x="560" y="90" width="800" height="430" rx="14" fill="#1C2433" stroke="${INK}" stroke-width="9"/><rect x="580" y="110" width="760" height="390" rx="8" fill="#F6F8FB"/>` + T17(960, 300, '주간 회의', { size: 64, fill: '#9AA6B2' });
  return h + floor17(880, '#8E7B66');
}
function ancient17(t, o = {}) {
  let h = BG(o.dusk ? '#E9C9A0' : '#EFE2C4') + BG('url(#hatch)').replace('/>', ' opacity=".12"/>');
  h += `<path d="M-600 640 Q-200 420 200 600 Q560 380 980 590 Q1380 400 1780 600 Q2100 470 2520 620 L2520 900 L-600 900 Z" fill="#C9B88E" stroke="${INK}" stroke-width="6"/>`;
  return h + floor17(880, '#BFA77A');
}
function court17(t) {
  let h = BG('#5A1E1E') + BG('url(#hatch)').replace('/>', ' opacity=".18"/>');
  for (let i = 0; i < 4; i++) h += `<rect x="${140 + i * 520}" y="40" width="70" height="840" fill="#A3302A" stroke="${INK}" stroke-width="7"/><rect x="${126 + i * 520}" y="40" width="98" height="40" fill="#E8B83A" stroke="${INK}" stroke-width="6"/>`;
  return h + floor17(880, '#3A1A14');
}
const OFF17 = o => HALO(char(Object.assign({ goggles: 'none', vest: '#D9826B', patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', topknot: '#2B2B2B', robe: '#8A3A2A', guan: '#5A2A1E' }, o)));
const VIL17 = (o, c) => HALO(char(Object.assign({ goggles: 'none', vest: c, patch: false, tee: true, vshade: 'rgba(0,0,0,0.15)', topknot: '#3A3A3A', robe: '#8A7A60' }, o)));
function porch17(t) { // memory: grandma's wooden platform on a summer night (sepia)
  let h = BG('#2E2438') + particles(t, 71, 26, [0, 0, 1920, 500], '#FFF4C8', { speed: 4, r: 3, op: 0.6 });
  h += `<circle cx="1560" cy="170" r="56" fill="#FFF2C0"/>`;
  h += `<path d="M-600 760 Q200 640 900 700 Q1500 650 2520 740 L2520 1480 L-600 1480 Z" fill="#3E3446" stroke="${INK}" stroke-width="6"/>`;
  h += `<rect x="1300" y="380" width="420" height="360" fill="#5A4636" stroke="${INK}" stroke-width="8"/><path d="M1260 400 L1510 260 L1760 400 Z" fill="#3A2C26" stroke="${INK}" stroke-width="8"/><rect x="1440" y="520" width="120" height="220" fill="#FFD98A" opacity=".85" stroke="${INK}" stroke-width="6"/>`;
  h += `<rect x="420" y="780" width="900" height="40" rx="6" fill="#B07A44" stroke="${INK}" stroke-width="7"/><rect x="450" y="820" width="30" height="80" fill="#8A5A30" stroke="${INK}" stroke-width="5"/><rect x="1260" y="820" width="30" height="80" fill="#8A5A30" stroke="${INK}" stroke-width="5"/>`;
  for (let i = 0; i < 9; i++) h += `<line x1="${470 + i * 96}" y1="782" x2="${470 + i * 96}" y2="818" stroke="#8A5A30" stroke-width="4"/>`;
  for (let i = 0; i < 7; i++) { const ph = (t * 0.3 + i / 7) % 1; h += `<circle cx="${f1(300 + i * 230 + Math.sin(t + i) * 30)}" cy="${f1(560 - ph * 120)}" r="6" fill="#E9FF8A" opacity="${f1(Math.sin(ph * Math.PI) * 0.9 * 100) / 100}"/>`; }
  return h;
}
const sepia17 = inner => `<g filter="url(#sil)" opacity="0">${''}</g><g style="filter: sepia(.75) saturate(.8)">${inner}</g>`;
function river17(t) { // Saturday riverside bench at sunset
  let h = BG('url(#sunset)') + `<circle cx="1500" cy="480" r="110" fill="#FFD27A"/><circle cx="1500" cy="480" r="260" fill="url(#warm)"/>` + clouds(t, 120, 10, 3, 5);
  h += `<rect x="-600" y="560" width="3120" height="180" fill="url(#river)"/>`;
  for (let i = 0; i < 12; i++) { const x = ((i * 190 - t * 30) % 2400 + 2400) % 2400 - 200; h += `<line x1="${f1(x)}" y1="${600 + (i % 4) * 30}" x2="${f1(x + 60)}" y2="${600 + (i % 4) * 30}" stroke="#fff" stroke-width="4" opacity=".55"/>`; }
  h += `<path d="M-600 560 L200 520 L240 560" fill="#6A6A8A" opacity=".5"/>` + floor17(740, '#8CCB7A') + `<rect x="-600" y="800" width="3120" height="700" fill="#D9C7B0"/>`;
  h += `<rect x="560" y="740" width="800" height="26" rx="8" fill="#8A5A34" stroke="${INK}" stroke-width="6"/><rect x="560" y="680" width="800" height="20" rx="8" fill="#8A5A34" stroke="${INK}" stroke-width="6"/><rect x="600" y="766" width="20" height="110" fill="#5E3E28"/><rect x="1300" y="766" width="20" height="110" fill="#5E3E28"/>`;
  return h + `<rect x="-600" y="-600" width="3120" height="2280" fill="#FF9A5A" opacity=".08"/>`;
}
const BSEAT_Z = { x: 820, y: 792, s: 0.56 }, BSEAT_S = { x: 1100, y: 792, s: 0.56 };  // bench seat top 740 = y - 92s
function phone17(x, y, s, msgs, k = 1, name = '수아') { // big phone with chat bubbles: msgs = [[text, mine, appearAt01]]
  let h = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-220" y="-380" width="440" height="760" rx="50" fill="#1F2D44" stroke="${INK}" stroke-width="10"/><rect x="-196" y="-350" width="392" height="700" rx="30" fill="#EAF2F8"/>`;
  h += `<rect x="-196" y="-350" width="392" height="80" rx="30" fill="#C9D6E2"/>` + T17(0, -296, name, { size: 34 });
  let yy = -220;
  msgs.forEach(([txt, mine, ap]) => { if (k < ap) return; const lines = txt.length > 14 ? [txt.slice(0, Math.ceil(txt.length / 2)), txt.slice(Math.ceil(txt.length / 2))] : [txt];
    const words = []; let cur = ''; txt.split(' ').forEach(w => { if ((cur + ' ' + w).trim().length > 13) { words.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }); if (cur) words.push(cur);
    const hh = 30 + words.length * 40, w = 330, x0 = mine ? 190 - w : -180;
    h += `<rect x="${x0}" y="${yy}" width="${w}" height="${hh}" rx="22" fill="${mine ? '#FFE36E' : '#fff'}" stroke="${INK}" stroke-width="4"/>`;
    words.forEach((wd, j) => h += T17(x0 + w / 2, yy + 46 + j * 40, wd, { size: 28, w: 700 }));
    yy += hh + 24; });
  return h + '</g>';
}

/* ---------- shared cards / HUD ---------- */
const DAY17 = ['', '월요일', '화요일', '수요일', '목요일', '금요일'];
const EXPT17 = ['', '내 말, 시간 재 보기', '상대 말에, 이어서 묻기', '질문을, 더 많이!', '말보다, 행동 먼저', '끝난 뒤, 혼자 채점하지 않기'];
function expCard17(t, lt, a, n, icon, title) {
  const T0 = t - lt, tt = title || EXPT17[n];
  let h = BG('#14213A') + BG('url(#dots)') + particles(t, 170 + n, 18, [0, 0, 1920, 1080], '#FFE29A', { speed: 12, r: 3, op: 0.35 });
  h += `<ellipse cx="960" cy="480" rx="780" ry="420" fill="url(#amber)" opacity=".35"/>`;
  const inner = `<circle cx="-500" cy="0" r="104" fill="#F2B84B" stroke="${INK}" stroke-width="8"/>` + T17(-500, 38, String(n), { size: 116, fill: NAVY }) +
    T17(-360, -44, `실험 ${n} · ${DAY17[n]}`, { anchor: 'start', size: 44, fill: '#9A6A1E' }) + T17(-360, 52, tt, { anchor: 'start', size: tt.length > 11 ? 54 : 66, fill: NAVY });
  h += pop(t, T0 + 0.1, t + 99, 960, 420, card17(0, 0, 1340, 300, inner, { bg: '#FFF7EC' }), { inDur: 0.4 });
  for (let i = 1; i <= 5; i++) h += `<circle cx="${960 + (i - 3) * 64}" cy="640" r="${i === n ? 17 : 12}" fill="${i <= n ? '#F2B84B' : '#33405A'}" stroke="${INK}" stroke-width="4"/>`;
  if (icon) h += pop(t, T0 + 0.6, t + 99, 960, 800, icon, { bob: 4 });
  return h;
}
const EXP17 = i => (i >= 10 && i <= 18) ? 1 : (i >= 19 && i <= 28) ? 2 : (i >= 29 && i <= 44) ? 3 : (i >= 45 && i <= 53) ? 4 : (i >= 54 && i <= 67) ? 5 : 0;
const CARD17 = [10, 19, 29, 45, 54];
const SHARE17 = i => i < 11 ? null : i <= 16 ? 82 : i <= 18 ? 70 : i <= 21 ? 62 : i <= 28 ? 52 : i <= 33 ? 30 : i <= 44 ? 30 : i <= 53 ? 45 : 40;
function hud17(t) {
  const i = lineIdx12(t), n = EXP17(i); if (!n || CARD17.includes(i) || (i >= 40 && i <= 42)) return '';  // no HUD over the childhood flashback
  const l = TL.lines[i], lt = t - (l.t0 - 0.15), op = (CARD17.includes(i - 1) || EXP17(i - 1) !== n) ? prog(lt, 0, 0.4) : 1;
  let h = `<g transform="translate(1600 74) scale(.85)" opacity="${f1(op * 100) / 100}"><rect x="-370" y="-46" width="740" height="150" rx="34" fill="${NAVY}" opacity=".9" stroke="#F2B84B" stroke-width="4"/>`;
  [1, 2, 3, 4, 5].forEach(j => { const on = j === n, past = j < n; h += `<circle cx="${-330 + (j - 1) * 44}" cy="0" r="17" fill="${on ? '#F2B84B' : past ? '#5A4A30' : 'none'}" stroke="${on ? INK : '#6B6050'}" stroke-width="3"/>` + T17(-330 + (j - 1) * 44, 8, String(j), { size: 20, fill: on ? NAVY : '#C9C0B0' }); });
  h += T17(-100, 11, `${DAY17[n].slice(0, 1)} · ${EXPT17[n]}`, { anchor: 'start', size: EXPT17[n].length > 11 ? 24 : 28, fill: '#fff' });
  let sh = SHARE17(i);
  if (i === 11) sh = Math.round(82 * easeOut(prog(lt, at17(t, l.args || {}, '82', -0.6), at17(t, l.args || {}, '82', 0.4))));
  if (sh != null) {
    const c = sh >= 70 ? '#FF6B6B' : sh >= 50 ? '#F2B84B' : '#48C88A';
    h += T17(-330, 70, '내 말', { anchor: 'start', size: 24, fill: '#C9D6E2' }) + `<rect x="-250" y="50" width="480" height="28" rx="14" fill="#2A3A52"/><rect x="-250" y="50" width="${f1(480 * sh / 100)}" height="28" rx="14" fill="${c}"/>` + T17(300, 74, `${sh}%`, { size: 28, fill: c });
  }
  return h + '</g>';
}
render = function (t) { _render12(t); const h = hud17(t); if (h) document.getElementById('v').insertAdjacentHTML('beforeend', h); };
window.render = render;
