var OVL = ''; // screen-space overlay (phone cards) set by scenes, drawn by overlayEp
/* Season 1 · ep 1 — 회식 2차, 아무도 가고 싶지 않았다. Scenes for anim_ep01.html (story format, FORMAT.md). */

// ---------- people ----------
E['말'] = Object.assign({}, E['기본'], { mouth: ell(200, 236, 13, 11), mouthFill: '#7A2E3A' });
E['억지미소'] = Object.assign(dotEyes(10, 12), { bL: [142, 156, 164, 150, 186, 152], bR: [214, 152, 236, 150, 258, 156], mouth: 'M178 228 Q200 240 222 228', mouthFill: 'none', sweat: true });
E['무표정'] = Object.assign(dotEyes(9, 11), { bL: [142, 156, 164, 156, 186, 158], bR: [214, 158, 236, 156, 258, 156], mouth: 'M186 236 L214 236', mouthFill: 'none' });
const PEOPLE = {
  Z: { vest: '#FF9A55', collar: true, tie: '#2F4A7A', vshade: 'rgba(150,60,0,0.22)' },
  T: { vest: '#3E4A5C', collar: true, tie: '#C8423A', hair: '#6A6A6A', vshade: 'rgba(0,0,0,0.25)' },
  P: { vest: '#C0647A', collar: true, longHair: '#3B2A22', lashes: true, vshade: 'rgba(0,0,0,0.2)' },
  H: { vest: '#4F8FD9', collar: true, tie: '#F2C14E', hair: '#2B2B2B', vshade: 'rgba(0,0,0,0.2)' },
  M: { vest: '#9BCB9F', collar: true, longHair: '#2E2019', lashes: true, vshade: 'rgba(0,0,0,0.16)' },
};
const SEEDS = { Z: 11, T: 23, P: 37, H: 41, M: 53 };
function spk(v, t) {
  for (const l of TL.lines) {
    if (t < l.t0 - 0.05 || t > l.t1 + 0.05) continue;
    for (const s of (l.segs || [])) if (s.v === v && t >= s.t0 && t <= s.t1) return true;
  }
  return false;
}
function exOf(v, base, t) {
  if (spk(v, t) && env(t) > 0.16) return base === '신남' ? '신남' : (Math.sin(t * 23) > -0.2 ? '말' : base);
  return base;
}
function P_(v, o) { // a coloured coworker; o: x, y, s, t, expr, pose, flip, headband, still
  const base = Object.assign({ goggles: 'none', patch: false, tee: true, seed: SEEDS[v] }, PEOPLE[v]);
  if (o.headband) { base.tie = false; }
  const expr = o.noTalk ? (o.expr || '기본') : exOf(v, o.expr || '기본', o.t);
  let g = char(Object.assign(base, o, { expr }));
  if (o.flip) g = `<g transform="translate(${f1(o.x)} 0) scale(-1 1) translate(${f1(-o.x)} 0)">${g}</g>`;
  if (o.headband) { // necktie tied around the head
    const s = o.s || 1, hx = o.x, hy = o.y - 560 * s + 120 * s;
    g += `<g transform="translate(${f1(hx)} ${f1(hy)}) scale(${s})"><path d="M-112 -6 Q0 -30 112 -6 L112 14 Q0 -10 -112 14 Z" fill="#F2C14E" stroke="${INK}" stroke-width="6"/><path d="M104 0 L150 -34 L160 -20 Z M104 6 L156 30 L148 44 Z" fill="#F2C14E" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`;
  }
  return HALO(g);
}
const bob = (t, s = 1, sp = 3) => Math.sin(t * sp) * 4 * s;

// ---------- props ----------
function tambourine(x, y, s, t, shake = 0) {
  const r = Math.sin(t * 50) * 14 * shake;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(r)}) scale(${s})">`;
  h += `<ellipse cx="0" cy="0" rx="62" ry="26" fill="#F7E08A" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="-6" rx="46" ry="16" fill="#FFF6D6" stroke="${INK}" stroke-width="4"/>`;
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; h += `<ellipse cx="${f1(Math.cos(a) * 58)}" cy="${f1(Math.sin(a) * 23)}" rx="10" ry="6" fill="#C9CED6" stroke="${INK}" stroke-width="3"/>`; }
  if (shake > 0.2) h += `<g stroke="${YEL}" stroke-width="6" stroke-linecap="round"><path d="M-90 -40 L-110 -60"/><path d="M90 -40 L110 -60"/><path d="M0 -50 L0 -78"/></g>`;
  return h + '</g>';
}
function soju(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-18" y="-90" width="36" height="90" rx="8" fill="#5FBF7A" stroke="${INK}" stroke-width="5"/><rect x="-9" y="-122" width="18" height="34" rx="4" fill="#5FBF7A" stroke="${INK}" stroke-width="5"/><rect x="-18" y="-62" width="36" height="26" fill="#EAF7EE" stroke="${INK}" stroke-width="3"/></g>`; }
function glassCup(x, y, s, fill = '#FFD36B') { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-20 -50 L20 -50 L16 0 L-16 0 Z" fill="#EAF4FF" stroke="${INK}" stroke-width="4"/><path d="M-18 -30 L18 -30 L16 0 L-16 0 Z" fill="${fill}" opacity=".8"/></g>`; }
function mic(x, y, s, rot = 0) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})"><rect x="-10" y="-10" width="20" height="90" rx="9" fill="#2A2A33" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-26" r="24" fill="#B8BEC8" stroke="${INK}" stroke-width="5"/></g>`; }
function clockTag(text, t, lt) {
  const k = easeOutBack(prog(lt, 0.05, 0.45));
  return `<g transform="translate(150 70) scale(${f1(k * 100) / 100})"><rect x="-110" y="-34" width="220" height="68" rx="34" fill="${NAVY}" opacity=".88" stroke="#fff" stroke-width="3"/><circle cx="-70" cy="0" r="18" fill="none" stroke="#fff" stroke-width="4"/><path d="M-70 -10 L-70 0 L-62 6" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><text x="22" y="13" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="38" fill="#fff">${text}</text></g>`;
}
function phoneCard(lines, o = {}) { // big phone in the centre-right with message bubbles; lines: [{from, text, me}] or {app}
  const k = easeOutBack(prog(o.lt || 1, 0, 0.35)), x = o.x || 1250, y = o.y || 470;
  let h = `<g transform="translate(${x} ${f1(y + (1 - k) * 80)}) scale(${f1(k * 100) / 100})">`;
  h += `<rect x="-250" y="-390" width="500" height="780" rx="56" fill="#1F2D44" stroke="${INK}" stroke-width="10"/><rect x="-226" y="-360" width="452" height="720" rx="36" fill="${o.bg || '#F2F5FA'}"/>`;
  h += `<rect x="-60" y="-378" width="120" height="16" rx="8" fill="#0A0F18"/>`;
  if (o.head) h += `<rect x="-226" y="-360" width="452" height="90" rx="36" fill="${o.headBg || '#DDE5F0'}"/><rect x="-226" y="-300" width="452" height="30" fill="${o.headBg || '#DDE5F0'}"/><text x="0" y="-302" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="${INK}">${esc(o.head)}</text>`;
  h += o.body || '';
  return h + '</g>';
}
function wrap(text, n) { const out = []; let cur = ''; for (const w of text.split(' ')) { if ((cur + ' ' + w).trim().length > n) { if (cur) out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); } if (cur) out.push(cur); return out; }
function msgBubble(x, y, text, me, o = {}) {
  const ls = wrap(text, o.n || 14), fs = o.size || 34, w = Math.min(400, Math.max(...ls.map(l => l.length)) * fs * 0.95 + 40), hh = ls.length * (fs + 10) + 26;
  const bx = me ? x + 200 - w : x - 200;
  let h = `<rect x="${f1(bx)}" y="${f1(y)}" width="${f1(w)}" height="${hh}" rx="22" fill="${me ? YEL : '#fff'}" stroke="${INK}" stroke-width="4"/>`;
  ls.forEach((l, i) => { h += `<text x="${f1(bx + 20)}" y="${f1(y + 18 + fs + i * (fs + 10) - 6)}" font-family="${FONT}" font-weight="700" font-size="${fs}" fill="${INK}">${esc(l)}</text>`; });
  return h;
}

// ---------- backgrounds ----------
function karaokeBG(t, o = {}) {
  let h = `<rect width="1920" height="1080" fill="#241338"/>`;
  // wallpaper stripes + disco beams
  for (let i = 0; i < 12; i++) h += `<rect x="${i * 170}" y="0" width="85" height="1080" fill="#2C1844" opacity=".7"/>`;
  const cols = ['#FF5FA2', '#3DF2B0', '#7CC7FF', '#F7E733'];
  if (!o.stopped) for (let i = 0; i < 4; i++) { const a = Math.sin(t * (0.6 + i * 0.17) + i * 1.7) * 38; h += `<path d="M960 -40 L${f1(960 + Math.tan((a - 10) * Math.PI / 180) * 1100)} 1080 L${f1(960 + Math.tan((a + 10) * Math.PI / 180) * 1100)} 1080 Z" fill="${cols[i]}" opacity=".07"/>`; }
  // mirror ball
  h += `<line x1="1480" y1="0" x2="1480" y2="40" stroke="#888" stroke-width="4"/><circle cx="1480" cy="70" r="32" fill="#C9CED6" stroke="${INK}" stroke-width="5"/>`;
  // TV screen
  h += `<rect x="610" y="40" width="700" height="360" rx="14" fill="#11111A" stroke="${INK}" stroke-width="10"/>`;
  if (o.stopped) h += `<rect x="626" y="56" width="668" height="328" fill="#0E1626"/><g fill="#fff" opacity=".85"><rect x="910" y="170" width="34" height="100" rx="6"/><rect x="976" y="170" width="34" height="100" rx="6"/></g>`;
  else {
    h += `<rect x="626" y="56" width="668" height="328" fill="#3B2A6E"/><rect x="626" y="56" width="668" height="328" fill="url(#screen)" opacity=".25"/>`;
    for (let i = 0; i < 9; i++) { const hh = 40 + 80 * Math.abs(Math.sin(t * (3 + i * 0.7) + i)); h += `<rect x="${680 + i * 64}" y="${f1(370 - hh * 0.8)}" width="40" height="${f1(hh * 0.8)}" rx="6" fill="${cols[i % 4]}" opacity=".85"/>`; }
    for (let i = 0; i < 3; i++) { const yy = 170 - ((t * 60 + i * 60) % 100); h += `<text x="${760 + i * 200}" y="${f1(yy)}" font-family="DejaVu Sans" font-size="64" fill="#fff" opacity=".85">♪</text>`; }
  }
  // room number on the door (right)
  h += `<rect x="1700" y="300" width="200" height="620" rx="8" fill="#3A2350" stroke="${INK}" stroke-width="8"/><rect x="1730" y="340" width="140" height="160" rx="6" fill="#5A3E7A" stroke="${INK}" stroke-width="5"/><text x="1800" y="450" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="90" fill="${YEL}">5</text><circle cx="1730" cy="620" r="12" fill="#C9CED6" stroke="${INK}" stroke-width="4"/>`;
  // sofa back
  h += `<rect x="40" y="600" width="1640" height="260" rx="40" fill="#7A2846" stroke="${INK}" stroke-width="9"/><path d="M70 640 L1650 640" stroke="#95355A" stroke-width="10"/>`;
  return h;
}
function karaokeTable(t, o = {}) {
  let h = `<rect x="160" y="900" width="1440" height="200" rx="14" fill="#2A2A35" stroke="${INK}" stroke-width="8"/><rect x="160" y="900" width="1440" height="22" rx="10" fill="#3A3A48"/>`;
  h += tambourine(o.tx || 960, 900, 1.0, t, o.shake || 0);
  h += glassCup(560, 910, 1.0) + glassCup(630, 910, 1.0, '#FF9AB5') + glassCup(1260, 910, 1.0, '#9AE6FF') + glassCup(1330, 910, 1.0);
  h += `<rect x="1100" y="890" width="100" height="22" rx="8" fill="#3A3A48" stroke="${INK}" stroke-width="4"/>`; // remote
  return h;
}
function bbqBG(t, o = {}) {
  let h = `<rect width="1920" height="1080" fill="#7A4E32"/><rect width="1920" height="560" fill="#9A6A44"/>`;
  for (let i = 0; i < 5; i++) h += `<rect x="${140 + i * 340}" y="90" width="260" height="120" rx="8" fill="#F4E7C8" stroke="${INK}" stroke-width="6"/><text x="${270 + i * 340}" y="168" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="44" fill="#8A3A2A">${['돼지갈비', '삼겹살', '목살', '된장찌개', '냉면'][i]}</text>`;
  h += `<rect x="0" y="540" width="1920" height="16" fill="#5A361F"/>`;
  // hood + duct over the grill
  h += `<rect x="920" y="230" width="80" height="260" fill="#B8BEC8" stroke="${INK}" stroke-width="7"/><path d="M820 490 L1100 490 L1060 560 L860 560 Z" fill="#C9CED6" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  return h;
}
function bbqTable(t, o = {}) {
  let h = `<rect x="100" y="880" width="1720" height="220" rx="14" fill="#5A3A26" stroke="${INK}" stroke-width="8"/>`;
  h += `<ellipse cx="960" cy="882" rx="190" ry="44" fill="#3A3A40" stroke="${INK}" stroke-width="8"/><ellipse cx="960" cy="876" rx="150" ry="30" fill="#55555E"/>`;
  for (let i = 0; i < 5; i++) h += `<line x1="${830 + i * 65}" y1="854" x2="${830 + i * 65}" y2="898" stroke="#22222A" stroke-width="5"/>`;
  if (!o.empty) for (let i = 0; i < 4; i++) h += `<rect x="${860 + i * 52}" y="${858 + (i % 2) * 10}" width="40" height="18" rx="6" fill="#C8604A" stroke="${INK}" stroke-width="3"/>`;
  for (let i = 0; i < 3; i++) { const yy = 820 - ((t * 40 + i * 70) % 220), op = 0.35 * (1 - ((t * 40 + i * 70) % 220) / 220); h += `<circle cx="${f1(930 + i * 30 + Math.sin(t + i) * 20)}" cy="${f1(yy)}" r="${f1(30 + ((t * 40 + i * 70) % 220) / 6)}" fill="#fff" opacity="${f1(op * 100) / 100}"/>`; }
  h += soju(440, 890, 0.9) + soju(500, 890, 0.9) + soju(1460, 890, 0.9) + glassCup(580, 892, 0.8, '#EAF7EE') + glassCup(1360, 892, 0.8, '#EAF7EE');
  return h;
}
function nightStreet(t, o = {}) {
  let h = `<rect width="1920" height="1080" fill="#0F1A33"/>`;
  for (let i = 0; i < 9; i++) { const x = i * 220 - 40, hh = 380 + (i * 97 % 260); h += `<rect x="${x}" y="${760 - hh}" width="200" height="${hh}" fill="#18264A" stroke="#0A1122" stroke-width="4"/>`; for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) if (hash(i * 31 + r * 7 + c) > 0.45) h += `<rect x="${x + 24 + c * 56}" y="${780 - hh + r * 60}" width="32" height="32" fill="#F7E08A" opacity=".55"/>`; }
  const neon = (x, y, txt, c) => `<g transform="translate(${x} ${y})"><rect x="-120" y="-44" width="240" height="88" rx="16" fill="#1A1030" stroke="${c}" stroke-width="7"/><text x="0" y="20" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="54" fill="${c}" opacity="${0.75 + 0.25 * Math.sin(t * 7 + x)}">${txt}</text></g>`;
  h += neon(380, 330, '노래방', PINK) + neon(1500, 260, '치킨', YEL) + neon(980, 400, '호프', '#7CC7FF');
  h += `<rect x="0" y="760" width="1920" height="320" fill="#2A2E3A"/><rect x="0" y="760" width="1920" height="14" fill="#3E4454"/>`;
  return h;
}
function washroomBG(t) {
  let h = `<rect width="1920" height="1080" fill="#DCE6EC"/>`;
  for (let r = 0; r < 12; r++) for (let c = 0; c < 20; c++) h += `<rect x="${c * 100}" y="${r * 100}" width="100" height="100" fill="none" stroke="#C3D0D8" stroke-width="3"/>`;
  h += `<rect x="560" y="120" width="800" height="440" rx="16" fill="#BFD6E2" stroke="${INK}" stroke-width="10"/><path d="M600 160 L700 160 M600 190 L650 190" stroke="#fff" stroke-width="10" opacity=".6"/>`;
  h += `<rect x="460" y="780" width="1000" height="70" rx="14" fill="#F4F7FA" stroke="${INK}" stroke-width="8"/><ellipse cx="960" cy="800" rx="160" ry="24" fill="#D5E2EE" stroke="${INK}" stroke-width="5"/><path d="M960 760 L960 730 L1000 730" stroke="#9AA4B0" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  return h;
}
function storeBG(t) {
  let h = `<rect width="1920" height="1080" fill="#0F1A33"/>`;
  h += `<rect x="240" y="120" width="1440" height="640" fill="#F4F7FA" stroke="${INK}" stroke-width="10"/><rect x="240" y="120" width="1440" height="90" fill="#3DA35D" stroke="${INK}" stroke-width="10"/><text x="960" y="186" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="58" fill="#fff">24시 편의점</text>`;
  for (let r = 0; r < 4; r++) { h += `<rect x="300" y="${270 + r * 115}" width="1320" height="12" fill="#B8BEC8"/>`; for (let c = 0; c < 22; c++) h += `<rect x="${310 + c * 60}" y="${230 + r * 115}" width="44" height="40" rx="5" fill="${['#FF9AB5', '#7CC7FF', YEL, MINT, '#FFB86B'][(r * 3 + c) % 5]}" stroke="${INK}" stroke-width="2"/>`; }
  h += `<rect x="0" y="760" width="1920" height="320" fill="#2A2E3A"/>`;
  h += `<rect x="1340" y="740" width="260" height="20" rx="6" fill="#E0E0E0" stroke="${INK}" stroke-width="5"/><path d="M1370 760 L1360 900 M1570 760 L1580 900" stroke="${INK}" stroke-width="8"/>`;
  return h;
}
function stairBG(t) {
  let h = `<rect width="1920" height="1080" fill="#A9AFA6"/><rect width="1920" height="1080" fill="#000" opacity=".25"/>`;
  for (let i = 0; i < 9; i++) h += `<path d="M${1920 - i * 170} ${300 + i * 90} L${1920 - (i + 1) * 170} ${300 + i * 90} L${1920 - (i + 1) * 170} ${390 + i * 90}" fill="none" stroke="#7D857B" stroke-width="12"/>`;
  h += `<path d="M1920 280 L240 1080" stroke="#6A7268" stroke-width="16"/>`;
  h += `<g transform="translate(360 180)"><rect x="-150" y="-60" width="300" height="120" rx="10" fill="#1FA35A" stroke="${INK}" stroke-width="7"/><circle cx="-60" cy="-22" r="12" fill="#fff"/><path d="M-62 -6 L-80 26 M-62 -6 L-38 20 M-64 4 L-90 -6 M-60 2 L-34 -10" stroke="#fff" stroke-width="9" stroke-linecap="round"/><rect x="10" y="-36" width="70" height="80" fill="none" stroke="#fff" stroke-width="7"/><path d="M-10 4 L30 4" stroke="#fff" stroke-width="7"/></g>`;
  h += `<circle cx="960" cy="60" r="${f1(70 + Math.sin(t * 9) * 2)}" fill="#FFF6C8" opacity=".35"/><rect x="930" y="40" width="60" height="30" rx="8" fill="#FFF6C8" stroke="${INK}" stroke-width="5"/>`;
  return h;
}
function subwayBG(t, o = {}) {
  let h = nightStreet(t);
  h += `<g transform="translate(560 640)"><rect x="-230" y="-200" width="460" height="320" fill="#1B2440" stroke="${INK}" stroke-width="8"/><rect x="-230" y="-260" width="460" height="70" rx="10" fill="#2F6BD8" stroke="${INK}" stroke-width="7"/><text x="0" y="-210" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="46" fill="#fff">지하철</text>`;
  for (let i = 0; i < 6; i++) h += `<rect x="${-200 + i * 12}" y="${-150 + i * 45}" width="${400 - i * 24}" height="16" fill="#6A7284"/>`;
  h += `</g>`;
  h += `<g transform="translate(1400 600)"><rect x="-240" y="-240" width="480" height="400" fill="#FFE7C2" stroke="${INK}" stroke-width="8"/><rect x="-240" y="-300" width="480" height="70" rx="10" fill="#C8604A" stroke="${INK}" stroke-width="7"/><text x="0" y="-250" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="44" fill="#fff">빵집</text>`;
  const sh = o.shutter || 0;
  for (let i = 0; i < 10; i++) if (i < sh * 10) h += `<rect x="-240" y="${-240 + i * 40}" width="480" height="38" fill="#9AA4B0" stroke="#6A7284" stroke-width="3"/>`;
  h += `</g>`;
  return h;
}
function benchBG(t) {
  let h = `<rect width="1920" height="1080" fill="#0B1428"/>`;
  for (let s = 0; s < 3; s++) { const x = 120 + s * 600; h += `<rect x="${x}" y="120" width="460" height="640" fill="#16223F" stroke="#0A1122" stroke-width="6"/>`; for (let r = 0; r < 10; r++) for (let c = 0; c < 5; c++) if (hash(s * 97 + r * 13 + c) > 0.62) h += `<rect x="${x + 30 + c * 86}" y="${150 + r * 60}" width="56" height="34" fill="#F7E08A" opacity=".6"/>`; }
  h += `<rect x="0" y="760" width="1920" height="320" fill="#1E2A22"/><path d="M1500 760 L1500 300" stroke="#3A4250" stroke-width="16"/><circle cx="1500" cy="290" r="40" fill="#FFF3C0"/><circle cx="1500" cy="290" r="160" fill="#FFF3C0" opacity=".12"/>`;
  h += `<rect x="620" y="800" width="680" height="30" rx="8" fill="#8A5A36" stroke="${INK}" stroke-width="7"/><rect x="620" y="740" width="680" height="26" rx="8" fill="#8A5A36" stroke="${INK}" stroke-width="7"/><path d="M660 830 L660 900 M1260 830 L1260 900" stroke="${INK}" stroke-width="12"/>`;
  return h;
}
function zroomBG(t) {
  let h = `<rect width="1920" height="1080" fill="#1A2238"/><rect x="1060" y="160" width="700" height="460" rx="10" fill="#0B1428" stroke="${INK}" stroke-width="10"/>`;
  const neon = (x, y, txt, c) => `<text x="${x}" y="${y}" font-family="${FONT}" font-weight="900" font-size="44" fill="${c}" opacity="${0.7 + 0.3 * Math.sin(t * 5 + x)}">${txt}</text>`;
  h += neon(1110, 300, '노래방', PINK) + neon(1420, 380, '노래연습장', '#7CC7FF') + neon(1180, 520, '코인노래방', YEL);
  h += `<path d="M1410 160 L1410 620 M1060 390 L1760 390" stroke="${INK}" stroke-width="8"/><rect x="0" y="780" width="1920" height="300" fill="#2A2F45"/>`;
  return h;
}
function officeBG(t) {
  let h = `<rect width="1920" height="1080" fill="#EAF0F5"/><rect x="0" y="0" width="1920" height="90" fill="#DCE6EC"/>`;
  for (let i = 0; i < 4; i++) h += `<rect x="${200 + i * 420}" y="140" width="300" height="200" fill="#CFE7F5" stroke="${INK}" stroke-width="6"/>`;
  h += `<rect x="260" y="700" width="1400" height="50" rx="10" fill="#C8A57A" stroke="${INK}" stroke-width="8"/>`;
  h += `<rect x="1080" y="420" width="420" height="270" rx="12" fill="#2A2F45" stroke="${INK}" stroke-width="9"/><rect x="1100" y="440" width="380" height="230" fill="#7CC7FF" opacity=".55"/><rect x="1270" y="690" width="40" height="20" fill="#2A2F45"/>`;
  return h;
}

// ---------- scenes ----------
const ROOM = { Z: 380, T: 680, P: 980, H: 1280, M: 1560 };
function roomPeople(t, o = {}) {
  const ex = o.ex || {}, ys = 1010, s = 0.74;
  let h = '';
  for (const v of ['Z', 'T', 'P', 'H', 'M']) {
    if (o.skip && o.skip.includes(v)) continue;
    const st = o.stand && o.stand[v];
    h += P_(v, { x: ROOM[v], y: st ? ys - 70 * easeOut(st) : ys, s, t, expr: ex[v] || '억지미소', pose: (o.pose && o.pose[v]) || '서기', headband: v === 'H' && o.headband, still: !!o.still });
  }
  return h;
}
function hroomScene(t, lt, a) {
  let h = karaokeBG(t) + roomPeople(t, { headband: true }) + karaokeTable(t);
  return h;
}
function ctitleScene(t, lt, a) {
  let h = `<rect width="1920" height="1080" fill="#160C24"/>` + tambourine(960, 360, 1.6, t, 0);
  const k = easeOut(prog(lt, 0.1, 0.7));
  h += `<g opacity="${f1(k * 100) / 100}">` + outlined(960, 620, ['회식 2차,', '아무도 가고 싶지 않았다'], { size: 92, sw: 16, lh: 120, fill: WHITE }) + '</g>';
  return h;
}
function hgogiScene(t, lt, a) {
  const k = a.k || 0, s = 0.7, y = 1000;
  const pos = { P: 300, Z: 620, T: 960, H: 1300, M: 1620 };
  const ex = { Z: '기본', T: '신남', P: '억지미소', H: '신남', M: '걱정' };
  if (k >= 10) ex.T = '무표정';
  let h = bbqBG(t);
  for (const v of ['P', 'Z', 'T', 'H', 'M']) {
    const pose = v === 'Z' ? '책상' : (v === 'T' && k <= 1 ? '만세' : '서기');
    h += P_(v, { x: pos[v], y: y + bob(t, 0.3, 2 + SEEDS[v] % 3), s, t, expr: ex[v], pose });
  }
  h += bbqTable(t);
  // tongs in Zero's hands
  h += `<path d="M700 800 L800 870 M712 790 L812 860" stroke="#B8BEC8" stroke-width="9" stroke-linecap="round"/>`;
  // name cards for introductions
  const tags = { 2: ['Z', '제로 · 대리 7년 차'], 5: ['H', '한 주임 · 분위기 담당'], 7: ['P', '박 과장 · 아이 둘 엄마'], 9: ['M', '민지 · 입사 두 달 차'] };
  if (tags[k]) { const [v, tx] = tags[k]; h += pop(t, t - lt + 0.1, t + 99, pos[v], 470, label(0, 0, tx, { size: 32, bg: YEL }), { rot: -3, bob: 3 }); }
  if (k === 6 || k === 7) h += phone(pos.P + 110, 880, 0.55, { on: true, rot: 10 });
  if (k === 10) { const f = prog(lt, 1.6, 2.4); h += `<g transform="translate(${pos.T + 90} 870) scale(1 ${f1((1 - 2 * f) * 100) / 100})">` + phone(0, 0, 0.5, f < 0.5 ? { on: true, glow: 0.6 } : { back: true }) + '</g>'; }
  if (k >= 11) h += phone(pos.T + 90, 872, 0.5, { back: true, rot: 90 });
  return h;
}
function hsecondScene(t, lt, a) {
  const k = a.k || 0, s = 0.74, y = 1000;
  const pos = { P: 300, Z: 620, T: 960, H: 1300, M: 1620 };
  const frozen = k === 2;
  const ex = { Z: k >= 5 ? '무표정' : '기본', T: '신남', P: k >= 4 ? '억지미소' : '기본', H: k >= 3 ? '신남' : '기본', M: k >= 4 ? '억지미소' : '기본' };
  if (frozen) Object.assign(ex, { Z: '놀람', P: '걱정', H: '놀람', M: '겁먹음', T: '신남' });
  let h = bbqBG(t);
  for (const v of ['P', 'Z', 'T', 'H', 'M']) h += P_(v, { x: pos[v], y, s, t, expr: ex[v], pose: v === 'T' ? '손인사' : (v === 'H' && k >= 3 ? '만세' : '서기'), still: frozen });
  h += bbqTable(t, { empty: true });
  if (frozen) h += `<rect width="1920" height="1080" fill="#000" opacity=".35"/>` + outlined(960, 300, ['…'], { size: 160, sw: 18 });
  return h;
}
function hinnerScene(t, lt, a) {
  const k = a.k || 0, s = 0.62, y = 980, run = a._run;
  let h = nightStreet(t);
  const xs = { T: 400, H: 690, P: 980, M: 1270, Z: 1560 };
  for (const v of ['T', 'H', 'P', 'M', 'Z']) {
    const ph = t * 5 + SEEDS[v];
    h += P_(v, { x: xs[v] + Math.sin(t * 0.4) * 10, y, s, t, expr: v === 'T' ? '신남' : '지침', pose: walkPose(ph, 0.8), noTalk: true });
  }
  const bub = { 1: 'P', 2: 'M', 3: 'H', 4: 'Z' };
  const thoughts = { P: '아이 열…', M: '막차 23:52', H: '또 띄워야…', Z: '보낼 메일…' };
  for (let j = 1; j <= Math.min(4, k); j++) { const v = bub[j]; h += pop(t, t - (j === k ? lt : 99) + 0.1, t + 99, xs[v], 500, bubble(0, 0, 270, 104, `<text x="0" y="14" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="40" fill="${INK}">${thoughts[v]}</text>`)); }
  if (k >= 5) h += pop(t, t - lt + 0.1, t + 99, xs.T, 500, bubble(0, 0, 130, 96, `<text x="0" y="22" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="64" fill="${INK}">?</text>`));
  return h;
}
function hsingScene(t, lt, a) {
  const k = a.k || 0;
  let h = karaokeBG(t);
  h += roomPeople(t, { skip: ['H'], ex: { Z: '기본', T: '신남', P: '억지미소', M: '억지미소' } });
  h += P_('H', { x: 1280, y: 930 - Math.abs(Math.sin(t * 5)) * 24, s: 0.8, t, expr: '신남', pose: '만세', headband: true, noTalk: true }) + mic(1370, 600, 1.1, 20);
  h += karaokeTable(t);
  if (k >= 3) { const g = 0.5 + 0.5 * Math.sin(t * 4); h += `<circle cx="960" cy="900" r="${f1(90 + g * 10)}" fill="none" stroke="${YEL}" stroke-width="6" opacity="${f1(g * 60) / 100}"/>`; }
  return h;
}
function hwashScene(t, lt, a) {
  const k = a.k || 0;
  let h = washroomBG(t);
  // reflection in the mirror: Han's face, smile gone
  const exH = k === 0 ? '신남' : '지침';
  h += `<defs><clipPath id="mirClip"><rect x="566" y="126" width="788" height="428" rx="12"/></clipPath></defs>`;
  h += `<g clip-path="url(#mirClip)">` + P_('H', { x: 1000, y: 760, s: 0.9, t, expr: exH, noTalk: true }) + `<rect x="560" y="120" width="800" height="440" fill="#BFD6E2" opacity=".25"/></g>`;
  h += P_('Z', { x: 420, y: 1080, s: 0.8, t, expr: k === 3 ? '놀람' : (k >= 5 ? '걱정' : '기본') });
  h += P_('H', { x: 1560, y: 1080, s: 0.8, t, expr: k === 0 ? '기본' : '지침', flip: true });
  if (k === 7) h += `<rect width="1920" height="1080" fill="#241338" opacity=".85"/>` + P_('H', { x: 960, y: 1000, s: 0.85, t, expr: '신남', pose: '만세', headband: true, noTalk: true }) + mic(1060, 640, 1.1, 20);
  return h;
}
function hstoreScene(t, lt, a) {
  const k = a.k || 0;
  let h = storeBG(t);
  h += P_('P', { x: 1120, y: 1060, s: 0.8, t, expr: k <= 1 ? '걱정' : (k === 2 ? '억지미소' : '억지미소'), pose: '서기' });
  if (k <= 1) h += phone(1200, 760, 0.5, { on: true, rot: 18 });
  h += P_('Z', { x: 620, y: 1060, s: 0.8, t, expr: k >= 3 ? '걱정' : '기본' }) + `<g transform="translate(540 860)"><rect x="-24" y="-40" width="48" height="70" rx="8" fill="#7CC7FF" stroke="${INK}" stroke-width="5"/></g>`;
  return h;
}
function hminScene(t, lt, a) {
  const k = a.k || 0;
  let h = karaokeBG(t) + roomPeople(t, { headband: true, ex: { M: k >= 3 ? '걱정' : '억지미소', Z: k >= 2 ? '걱정' : '기본' } }) + karaokeTable(t);
  if (k === 1) OVL += `<rect width="1920" height="1080" fill="#000" opacity=".5"/>` + phoneCard([], { lt, head: '지하철', headBg: '#2F6BD8', body: `<text x="0" y="-150" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="40" fill="${INK}">막차</text><text x="0" y="-40" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="120" fill="#2F6BD8">23:52</text><text x="0" y="60" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="34" fill="#555">남은 시간 1시간 2분</text><rect x="-180" y="140" width="360" height="16" rx="8" fill="#DDE5F0"/><rect x="-180" y="140" width="${f1(360 * 0.3)}" height="16" rx="8" fill="${RED}"/>` });
  return h;
}
function hstairScene(t, lt, a) {
  const k = a.k || 0;
  let h = stairBG(t);
  h += P_('T', { x: 1200, y: 1060, s: 0.82, t, expr: k <= 1 ? '지침' : (k >= 5 && k <= 6 ? '기본' : (k >= 8 ? '기본' : '지침')), pose: k <= 2 ? '폰보기' : '서기' });
  if (k <= 2) h += phone(1196, 890, 0.55, { on: true, glow: 0.5 });
  if (k >= 0 && k !== 1) h += P_('Z', { x: 620, y: 1060, s: 0.82, t, expr: k === 8 ? '걱정' : (k >= 9 ? '지침' : '놀람') });
  if (k === 2) h += `<rect width="1920" height="1080" fill="#000" opacity=".5"/>` + phoneCard([], { lt, head: '딸', body: msgBubble(-20, -220, '아빠 오늘 내 생일인 거 안 잊었지? 🎂 12시 전엔 와', false, { n: 11 }) });
  return h;
}
function hlouderScene(t, lt, a) {
  const k = a.k || 0;
  const real = { Z: '걱정', T: '지침', P: '걱정', H: '지침', M: '걱정' };
  let h = karaokeBG(t);
  if (k === 1) { // the real faces, one by one
    const order = ['H', 'P', 'M', 'T'], n = Math.min(3, Math.floor(lt / Math.max(1, a._dur / 4)));
    const v = order[n];
    h += P_(v, { x: 960, y: 1180, s: 1.15, t, expr: real[v], headband: v === 'H', noTalk: true });
    if (v === 'P') h += phone(1180, 900, 0.7, { back: true, rot: 90 });
    if (v === 'M') h += `<g transform="translate(1250 760)"><circle r="70" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M0 -44 L0 0 L30 20" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/></g>`;
    return h;
  }
  const ex = k >= 3 ? { Z: '걱정', T: '신남', P: '억지미소', H: '억지미소', M: '억지미소' } : { Z: '걱정', T: '억지미소', P: '억지미소', H: '억지미소', M: '억지미소' };
  h += roomPeople(t, { headband: true, ex, pose: k >= 4 ? { H: '만세' } : {} }) + karaokeTable(t);
  if (k === 2 || k === 5) h += `<rect width="1920" height="1080" fill="#000" opacity=".25"/>`;
  return h;
}
function hclimaxScene(t, lt, a) {
  const k = a.k || 0;
  const stopped = k >= 3;
  let h = karaokeBG(t, { stopped });
  const stand = {};
  if (k >= 2) stand.Z = prog(lt + (k > 2 ? 9 : 0), 0, 0.5);
  if (k >= 6) stand.P = 1; if (k >= 7) stand.H = 1; if (k >= 8) stand.M = 1;
  if (k === 6) stand.P = prog(lt, 0, 0.4); if (k === 7) stand.H = prog(lt, 0, 0.4); if (k === 8) stand.M = prog(lt, 0, 0.4);
  let ex = { Z: k >= 2 && k < 13 ? '겁먹음' : '기본', T: '신남', P: '억지미소', H: '억지미소', M: '걱정' };
  if (k >= 9) ex = Object.assign(ex, { T: '놀람', P: '걱정', H: '걱정', M: '걱정' });
  if (k === 10 || k === 11) ex.T = '무표정';
  if (k >= 12) ex.T = '뿌듯';
  if (k >= 14) ex = { Z: '신남', T: '신남', P: '신남', H: '신남', M: '신남' };
  // the leader goes to the door
  const tx = k >= 1 && k <= 12 ? 1800 : (k >= 13 ? 1780 : 680);
  h += roomPeople(t, { skip: ['T'], headband: true, ex, stand, pose: k >= 14 ? { Z: '만세', P: '만세', H: '만세', M: '만세' } : {} });
  h += P_('T', { x: tx, y: 1010, s: 0.74, t, expr: ex.T, pose: k === 15 ? '손인사' : '서기', flip: k >= 1 && k <= 3 });
  h += karaokeTable(t, { tx: k === 15 ? 2400 : 960, shake: 0 });
  if (k === 15) h += tambourine(1900, 640, 1.1, t, prog(lt, 1.2, 1.4) * (1 - prog(lt, 2.4, 2.6)));
  if (k === 3 || k === 5 || k === 11) h += `<rect width="1920" height="1080" fill="#000" opacity=".3"/>`;
  if (k === 0) { const g = 0.5 + 0.5 * Math.sin(t * 8); h += `<g transform="translate(1760 230)"><rect x="-150" y="-44" width="300" height="88" rx="44" fill="${RED}" opacity="${f1((0.7 + 0.3 * g) * 100) / 100}" stroke="#fff" stroke-width="4"/><text x="0" y="16" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="44" fill="#fff">막차 14분</text></g>`; }
  return h;
}
function hstreetScene(t, lt, a) {
  const k = a.k || 0;
  if (k <= 1) {
    let h = subwayBG(t, { shutter: 0.5 });
    const x = 900 - prog(lt + (k ? 6 : 0), 0, 3) * 340;
    h += P_('M', { x, y: 1000, s: 0.66, t, expr: '신남', pose: walkPose(t * 9, 1.2), noTalk: true });
    if (k === 1) OVL += `<rect width="1920" height="1080" fill="#000" opacity=".5"/>` + phoneCard([], { lt, head: '팀 단톡방', body: msgBubble(-20, -220, '막차 탔어요!! 오늘 감사했습니다 🙇‍♀️', false, { n: 11 }) });
    h += clockTag('23:51', t, a._run);
    return h;
  }
  let h = subwayBG(t, { shutter: k === 2 ? 0.2 + prog(lt, 0, 4) * 0.5 : 0.7 });
  h += P_('T', { x: 1220, y: 1000, s: 0.7, t, expr: '신남', pose: '손인사', noTalk: true });
  h += `<g transform="translate(1360 830)"><rect x="-60" y="-60" width="120" height="80" rx="8" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M-60 -60 L60 -60 L50 -86 L-50 -86 Z" fill="#FF9AB5" stroke="${INK}" stroke-width="5"/><rect x="-6" y="-112" width="12" height="28" fill="${YEL}" stroke="${INK}" stroke-width="3"/></g>`;
  if (k === 3) OVL += `<rect width="1920" height="1080" fill="#000" opacity=".5"/>` + phoneCard([], { lt, head: '팀 단톡방', body: `<rect x="-170" y="-250" width="300" height="200" rx="18" fill="#FFE1EA" stroke="${INK}" stroke-width="4"/><text x="-20" y="-130" text-anchor="middle" font-family="DejaVu Sans" font-size="90">🎂</text>` + msgBubble(-20, -20, '생일 안 놓쳤다 ㅎㅎ 다들 고마워', false, { n: 11 }) });
  return h;
}
function hbenchScene(t, lt, a) {
  const k = a.k || 0;
  let h = benchBG(t);
  h += doctor(1150, 1000, 0.7, { t, expr: '미소', talk: spk('D', t) ? env(t) : 0 });
  h += poodleE1(1420, 1000, 0.62, t, { flip: true });
  h += P_('Z', { x: 760, y: 1000, s: 0.74, t, expr: k === 2 ? '신남' : (k === 5 ? '뿌듯' : '기본') });
  return h;
}
function hphoneScene(t, lt, a) {
  const k = a.k || 0;
  let h = zroomBG(t);
  h += P_('Z', { x: 620, y: 1080, s: 0.84, t, expr: k === 3 ? '기본' : '걱정', pose: k <= 1 ? '폰보기' : '서기', noTalk: true });
  if (k <= 1) h += phone(616, 905, 0.58, { on: true, glow: 0.6 });
  if (k === 1) OVL += `<rect width="1920" height="1080" fill="#000" opacity=".5"/>` + phoneCard([], { lt, head: '메일 · 임시 보관함 (1)', body: `<rect x="-200" y="-240" width="400" height="300" rx="16" fill="#fff" stroke="${INK}" stroke-width="4"/><text x="-176" y="-190" font-family="${FONT}" font-weight="900" font-size="30" fill="#555">받는 사람: 그림책 출판사</text><text x="-176" y="-130" font-family="${FONT}" font-weight="700" font-size="34" fill="${INK}">제안 감사합니다.</text><text x="-176" y="-82" font-family="${FONT}" font-weight="700" font-size="34" fill="${INK}">함께하…</text><rect x="-90" y="150" width="180" height="70" rx="35" fill="#2F6BD8"/><text x="0" y="198" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="#fff">보내기</text>` });
  return h;
}
function hnextScene(t, lt, a) {
  const k = a.k || 0;
  let h = officeBG(t);
  h += `<g transform="translate(760 690)"><path d="M-50 -110 L50 -110 L40 0 L-40 0 Z" fill="#F4F1EA" stroke="${INK}" stroke-width="6"/><rect x="-54" y="-124" width="108" height="20" rx="6" fill="#6B4A2E" stroke="${INK}" stroke-width="5"/>${[0, 1, 2].map(i => `<path d="M${-20 + i * 20} -150 q10 -20 0 -40" stroke="#B8BEC8" stroke-width="5" fill="none" opacity="${f1((0.4 + 0.3 * Math.sin(t * 3 + i)) * 100) / 100}"/>`).join('')}</g>`;
  h += `<g transform="translate(560 640) rotate(-6)"><rect x="-90" y="-80" width="180" height="160" fill="${YEL}" stroke="${INK}" stroke-width="5"/><path d="M-60 -30 L60 -30 M-60 0 L60 0 M-60 30 L30 30" stroke="#8A7A20" stroke-width="6"/></g>`;
  if (k === 0) h += P_('Z', { x: 300, y: 1080, s: 0.8, t, expr: '놀람' });
  if (k === 1) h += `<rect width="1920" height="1080" fill="#000" opacity=".35"/><g transform="translate(960 520) rotate(-3) scale(${f1(easeOutBack(prog(lt, 0, 0.35)) * 100) / 100})"><rect x="-420" y="-260" width="840" height="520" fill="${YEL}" stroke="${INK}" stroke-width="8"/>${wrap('어제 먼저 말해 주셔서 감사했어요. 저는 못 했을 거예요.', 13).map((l, i) => `<text x="-370" y="${-150 + i * 80}" font-family="${FONT}" font-weight="700" font-size="58" fill="${INK}">${esc(l)}</text>`).join('')}<text x="360" y="200" text-anchor="end" font-family="${FONT}" font-weight="900" font-size="54" fill="${INK}">- 민지</text></g>`;
  if (k >= 2) {
    const body = msgBubble(-20, -250, '어제 다들 수고했어요. 다음 회식은 1차까지만! 2차 가고 싶은 사람은… 솔직하게 손 ✋', false, { n: 12, size: 30 }) +
      (k >= 3 || (k === 2 && false) ? '' : '') +
      `<g transform="translate(0 120)"><rect x="-190" y="0" width="170" height="70" rx="35" fill="#fff" stroke="${INK}" stroke-width="4"/><text x="-105" y="48" text-anchor="middle" font-family="DejaVu Sans" font-size="38">👍 ${k >= 3 || prog(lt, 1.0, 1.1) ? 4 : 0}</text><rect x="20" y="0" width="170" height="70" rx="35" fill="#fff" stroke="${INK}" stroke-width="4"/><text x="105" y="48" text-anchor="middle" font-family="DejaVu Sans" font-size="38">✋ 0</text></g>`;
    h += P_('Z', { x: 300, y: 1080, s: 0.8, t, expr: k >= 4 ? '신남' : '기본', noTalk: true });
    OVL += phoneCard([], { lt: k === 2 ? lt : 1, x: 1300, head: '팀 메신저 · 오 팀장', body });
  }
  return h;
}
function askScene(t, lt, a) {
  let h = karaokeBG(t, { stopped: true }) + `<rect width="1920" height="1080" fill="#000" opacity=".55"/>` + tambourine(960, 300, 1.4, t, 0);
  h += pop(t, t - lt + 0.2, t + 99, 960, 560, label(0, 0, '댓글로 들려주세요', { size: 56, bg: YEL }), { rot: -2, bob: 3 });
  return h;
}
function cnextScene(t, lt, a) {
  let h = `<rect width="1920" height="1080" fill="#0F1A33"/>` + label(960, 200, '다음 이야기', { size: 54, bg: MINT });
  h += phoneCard([], { lt, x: 960, y: 620, head: '친구', body: msgBubble(-20, -150, 'ㅇㅇ', false, { size: 120 }) });
  return h;
}

// ---------- overlay: the counter (집에 가고 싶은 사람 n/5) ----------
const CLOCK = { hroom: '22:40', hgogi: '19:40', hsecond: '21:50', hwash: '22:20', hstore: '22:35', hmin: '22:50', hstair: '23:10', hclimax: '23:38', hbench: '00:03', hnext: '08:50' };
function overlayEp(i, t, lt, a, L) {
  const ln = L[i]; let ck = CLOCK[ln.scene]; if (ln.scene === 'hstreet') ck = (a.k || 0) >= 2 ? '23:57' : '23:51';
  let rs = i; while (rs > 0 && L[rs - 1].scene === ln.scene) rs--;
  let out = ck ? clockTag(ck, t, t - (L[rs].t0 - 0.15)) : '';
  const ov = OVL; OVL = '';
  return ov + out + counterHud(i, t, lt, a, L);
}
function counterHud(i, t, lt, a, L) {
  let n = 0, lastIdx = -1, endIdx = L.findIndex(l => l.scene === 'hstreet');
  for (let k = 0; k <= i; k++) if (L[k].args && L[k].args.count) { n = L[k].args.count; lastIdx = k; }
  if (!n || i >= endIdx) return '';
  const pulse = lastIdx === i ? easeOutBack(prog(lt, 0, 0.5)) : 1, x = 1700, y = 70;
  let h = `<g transform="translate(${x} ${y}) scale(${f1((0.9 + 0.1 * pulse) * 100) / 100})"><rect x="-200" y="-36" width="400" height="72" rx="36" fill="${NAVY}" opacity=".9" stroke="${MINT}" stroke-width="4"/>`;
  h += `<path d="M-168 4 L-148 -16 L-128 4 L-128 22 L-168 22 Z" fill="${MINT}"/><text x="-112" y="13" font-family="${FONT}" font-weight="900" font-size="30" fill="#fff">집에 가고 싶은 사람</text>`;
  h += `<text x="176" y="15" text-anchor="end" font-family="${MONO}" font-weight="700" font-size="40" fill="${YEL}">${n}/5</text></g>`;
  return h;
}
window.overlayEp = overlayEp;
var CAMS = {
  hroom: [1.12, 1.0, 960, 560], ctitle: 'fixed', hgogi: [1.0, 1.05, 960, 600], hsecond: [1.0, 1.12, 960, 620], hinner: [1.0, 1.04, 960, 600],
  hsing: [1.0, 1.06, 1000, 560], hwash: [1.0, 1.08, 960, 640], hstore: [1.0, 1.06, 900, 640], hmin: [1.0, 1.06, 1100, 640], hstair: [1.0, 1.08, 900, 680],
  hlouder: [1.0, 1.04, 960, 560], hclimax: [1.0, 1.06, 960, 600], hstreet: [1.0, 1.03, 960, 560], hbench: [1.0, 1.08, 960, 680], hphone: [1.0, 1.06, 900, 600],
  hnext: [1.0, 1.04, 960, 560], ask: 'fixed', cnext: 'fixed'
};
window.CAMS = CAMS;
function poodleE1(x, y, s, t, o = {}) {
  const bobv = o.still ? 0 : Math.sin(t * 6 + (o.seed || 0)) * 3, wag = o.still ? 0 : Math.sin(t * 9) * 10;
  const puff = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r + 5}" fill="${INK}"/>`;
  const fill = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FAF8F2"/>`;
  const PP = [[-70, -150, 34], [-30, -158, 40], [10, -150, 34], [56, -196, 34], [70, -236, 30], [44, -250, 22], [92, -182, 18], [-92, -192, 18], [-64, -40, 20], [-24, -40, 20], [28, -40, 20], [62, -40, 20]];
  let legs = '';
  [[-64], [-24], [28], [62]].forEach(([lx]) => { legs += `<rect x="${lx - 8}" y="-110" width="16" height="70" rx="8" fill="#FAF8F2" stroke="${INK}" stroke-width="5"/>`; });
  let h = `<g transform="translate(${f1(x)} ${f1(y + bobv)}) scale(${o.flip ? -s : s} ${s})">${legs}`;
  h += `<g transform="rotate(${f1(wag)} -92 -170)">${puff(-92, -192, 18)}${fill(-92, -192, 18)}</g>`;
  h += PP.filter((_, i) => i !== 7).map(([a, b, r]) => puff(a, b, r)).join('') + PP.filter((_, i) => i !== 7).map(([a, b, r]) => fill(a, b, r)).join('');
  h += `<ellipse cx="96" cy="-222" rx="16" ry="12" fill="#FAF8F2" stroke="${INK}" stroke-width="5"/><circle cx="108" cy="-224" r="5" fill="${INK}"/><circle cx="74" cy="-236" r="5" fill="${INK}"/></g>`;
  return h;
}

function thanksScene(t, lt) {
  let h = `<rect width="1920" height="1080" fill="#160C24"/>` + tambourine(960, 320, 1.3, t, 0);
  h += pop(t, t - lt + 0.2, t + 99, 960, 560, outlined(0, 0, ['끝까지 함께해 주셔서', '고맙습니다'], { size: 70, sw: 14, lh: 92 }), {});
  h += P_('Z', { x: 960, y: 1080, s: 0.5, t, expr: '신남', pose: '손인사', noTalk: true });
  return h;
}
