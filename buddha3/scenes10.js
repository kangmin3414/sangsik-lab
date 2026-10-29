/* ---------- experiment 010: live here and now, like the Buddha ---------- */
Object.assign(CAMS, {
  blunch: [1.08, 1.15, 940, 560], bmind: [1.0, 1.03, 960, 540], bindia: [1.0, 1.05, 960, 520], bpalace: [1.0, 1.05, 960, 520],
  bgates: [1.0, 1.03, 960, 520], bleave: [1.0, 1.07, 960, 560], bfast: [1.0, 1.06, 960, 560], brice: [1.0, 1.04, 960, 540],
  bbodhi: [1.0, 1.06, 960, 520], bmyth: [1.06, 1.12, 960, 560], bmeal: [1.0, 1.05, 960, 560], bmonkey: [1.0, 1.03, 960, 520],
  bwander: [1.0, 1.03, 960, 520], blesson: [1.0, 1.03, 960, 540], bsubway: [1.0, 1.05, 960, 540], barrow: [1.0, 1.03, 960, 520],
  bbear: [1.0, 1.05, 960, 540], bname: [1.0, 1.05, 960, 540], bchat: [1.0, 1.03, 960, 540], bgreedy: [1.0, 1.05, 960, 560],
  bsona: [1.0, 1.05, 960, 540], bstrings: [1.0, 1.03, 960, 520], bweeks: [1.0, 1.03, 960, 520], bbreath: [1.0, 1.04, 960, 540],
  bgotami: [1.0, 1.06, 960, 540], bseed: [1.0, 1.06, 960, 540], bvillage: [1.0, 1.04, 960, 540], blamps: [1.0, 1.05, 960, 520],
  bdinner: [1.0, 1.06, 960, 560], bmoon: [1.0, 1.05, 960, 540]
});
const OCHRE = '#D9A441', MAROON = '#9A3B2E', GOLD = '#E8B83A', LOTUS = '#F49AC1';
P['숟가락'] = Object.assign({ armL: [[148, 285], [134, 340], [172, 372]], hL: [178, 374], armR: [[252, 285], [292, 312], [244, 256]], hR: [236, 248] }, LEGS);
P['퍼기'] = Object.assign({ armL: [[148, 285], [134, 340], [172, 372]], hL: [178, 374], armR: [[252, 285], [292, 340], [318, 378]], hR: [322, 384] }, LEGS);
P['합장'] = Object.assign({ armL: [[148, 285], [150, 340], [192, 312]], hL: [196, 306], armR: [[252, 285], [250, 340], [208, 312]], hR: [204, 306] }, LEGS);
P['받기'] = Object.assign({ armL: [[148, 285], [150, 344], [186, 352]], hL: [192, 352], armR: [[252, 285], [272, 344], [236, 352]], hR: [230, 352] }, LEGS);
P['활'] = Object.assign({ armL: [[148, 285], [196, 292], [238, 300]], hL: [244, 300], armR: [[252, 285], [304, 298], [356, 300]], hR: [364, 300] }, LEGS);
const sitP = (arms) => Object.assign({}, P['좌선'], arms ? { armL: P[arms].armL, armR: P[arms].armR, hL: P[arms].hL, hR: P[arms].hR } : {});

/* ---------- characters (same family as Zero) ---------- */
// Buddha / Siddhartha after leaving: ochre robe, maroon sash, dark hair with a small bun. still:true so the bun sits exactly on the head
function bunG(x, y, s, dy = 0) { const cy = y + (50 + dy - 560) * s; return `<g transform="translate(${f1(x)} ${f1(cy)}) scale(${f1(s * 1000) / 1000})"><circle r="34" fill="#2B2B2B" stroke="${INK}" stroke-width="6"/>${[[-14, -10], [12, -14], [16, 8], [-10, 12], [0, -2]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="6" fill="#4A4A4A"/>`).join('')}</g>`; }
function crownG(x, y, s, dy = 0) { const cy = y + (66 + dy - 560) * s; return `<g transform="translate(${f1(x)} ${f1(cy)}) scale(${f1(s * 1000) / 1000})"><path d="M-78 18 L-84 -34 L-46 -6 L0 -50 L46 -6 L84 -34 L78 18 Z" fill="${GOLD}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><circle cx="0" cy="-8" r="10" fill="${RED}" stroke="${INK}" stroke-width="4"/><circle cx="-46" cy="4" r="7" fill="#5FB08A" stroke="${INK}" stroke-width="3"/><circle cx="46" cy="4" r="7" fill="#5FB08A" stroke="${INK}" stroke-width="3"/></g>`; }
const dyOf = o => { const p = typeof o.pose === 'string' ? P[o.pose] : o.pose; return (p && p.dy) || 0; };
// seated: the robe drapes over crossed legs (char's own robe hem hides the legs and reads as standing)
function seatedRobe(x, y, s, sx, dy, c1 = OCHRE, c2 = MAROON) {
  const X = cx => f1(x + (cx - 200) * s * sx), Y = cy => f1(y + (cy + dy - 560) * s);
  return `<path d="M${X(62)} ${Y(494)} Q${X(70)} ${Y(416)} ${X(200)} ${Y(404)} Q${X(330)} ${Y(416)} ${X(338)} ${Y(494)} Q${X(200)} ${Y(518)} ${X(62)} ${Y(494)} Z" fill="${c1}" stroke="${INK}" stroke-width="${f1(7 * s)}" stroke-linejoin="round"/><path d="M${X(92)} ${Y(482)} Q${X(200)} ${Y(462)} ${X(308)} ${Y(482)}" fill="none" stroke="${c2}" stroke-width="${f1(9 * s)}" stroke-linecap="round"/><ellipse cx="${X(200)}" cy="${Y(446)}" rx="${f1(34 * s * sx)}" ry="${f1(18 * s)}" fill="#fff" stroke="${INK}" stroke-width="${f1(6 * s)}"/>` +
    `<path d="M${X(152)} ${Y(264)} L${X(236)} ${Y(408)}" stroke="${INK}" stroke-width="${f1(24 * s)}" stroke-linecap="round"/><path d="M${X(152)} ${Y(264)} L${X(236)} ${Y(408)}" stroke="${c2}" stroke-width="${f1(15 * s)}" stroke-linecap="round"/>`;
}
const BU = o => { const c = Object.assign({ goggles: 'none', vest: OCHRE, patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', hair: '#2B2B2B', robe: MAROON, still: true }, o); const r = c.rot || 0; c.rot = 0; const dy = dyOf(c), sit = dy > 0; if (sit) c.robe = false; const g = bunG(c.x, c.y, c.s, dy) + char(c) + (sit ? seatedRobe(c.x, c.y, c.s, c.sx || 1, dy) : ''); return HALO(r ? `<g transform="rotate(${f1(r)} ${f1(c.x)} ${f1(c.y)})">${g}</g>` : g); };
const crownAt = (x, y, s) => crownG(x, y + (560 - 66) * s, s);
const PR = o => { const c = Object.assign({ goggles: 'none', vest: '#F4EEDD', patch: false, tee: true, vshade: 'rgba(0,0,0,0.15)', hair: '#2B2B2B', robe: '#C9A04A', still: true }, o); return HALO(char(c) + (c.crown === false ? '' : crownG(c.x, c.y, c.s, dyOf(c)))); };
const KG = o => { const c = Object.assign({ goggles: 'none', vest: '#EADFC0', patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', hair: '#6A6A6A', beard: '#6A6A6A', robe: '#7A3E8E', still: true }, o); return HALO(char(c) + crownG(c.x, c.y, c.s, dyOf(c))); };
const MONK = o => { const c = Object.assign({ goggles: 'none', vest: OCHRE, patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', robe: MAROON }, o), dy = dyOf(c); if (dy > 0) { c.robe = false; c.still = true; } return HALO(char(c) + (dy > 0 ? seatedRobe(c.x, c.y, c.s, c.sx || 1, dy) : '')); };
const GOT = o => HALO(char(Object.assign({ goggles: 'none', vest: '#E7A3BC', patch: false, tee: true, vshade: 'rgba(0,0,0,0.16)', longHair: '#2B2B2B', hair: '#2B2B2B', dress: '#B85C7E', lashes: true }, o)));
const SUJ = o => HALO(char(Object.assign({ goggles: 'none', vest: '#F2C14E', patch: false, tee: true, vshade: 'rgba(0,0,0,0.15)', longHair: '#3A2A1E', hair: '#3A2A1E', dress: '#E0803A', lashes: true }, o)));
const VIL = (c, o) => HALO(char(Object.assign({ goggles: 'none', vest: c, patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', hair: '#2B2B2B' }, o)));
const OLDM = o => HALO(char(Object.assign({ goggles: 'none', vest: '#C9B89A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', hair: '#E2E2E2', beard: '#EDEDED' }, o)));
const FRIEND = (c, hair, o) => HALO(char(Object.assign({ goggles: 'none', vest: c, patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', hair }, o)));
const at = (lt, D, f) => lt > f * D;

/* ---------- props ---------- */
function bowlG(x, y, s, o = {}) { // rice / soup / porridge bowl, o.kind
  const k = o.kind || 'rice';
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  if (o.steam) for (let i = 0; i < 3; i++) { const ph = ((o.t || 0) * 0.6 + i / 3) % 1; h += `<path d="M${-30 + i * 30} ${f1(-60 - ph * 80)} q14 -18 0 -36 q-14 -18 0 -36" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="${f1(Math.sin(ph * Math.PI) * 80) / 100}"/>`; }
  if (k === 'rice') h += `<path d="M-74 -36 Q-70 -92 0 -96 Q70 -92 74 -36 Z" fill="#FFFDF6" stroke="${INK}" stroke-width="6"/>${[[-30, -60], [10, -74], [36, -54], [-8, -50], [-46, -46]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="7" ry="4" fill="#EDE6D3"/>`).join('')}`;
  if (k === 'soup') h += `<ellipse cx="0" cy="-36" rx="76" ry="16" fill="#B5763A" stroke="${INK}" stroke-width="5"/><circle cx="-22" cy="-38" r="6" fill="#5E9A4A"/><rect x="10" y="-44" width="16" height="12" rx="3" fill="#F4E9D0"/>`;
  if (k === 'porridge') h += `<ellipse cx="0" cy="-36" rx="76" ry="16" fill="#FFF3D6" stroke="${INK}" stroke-width="5"/><ellipse cx="-14" cy="-40" rx="22" ry="5" fill="#fff"/>`;
  if (k === 'grain') h += `<ellipse cx="0" cy="-36" rx="76" ry="16" fill="#E8DCC4" stroke="${INK}" stroke-width="5"/><ellipse cx="6" cy="-38" rx="8" ry="4.5" fill="#fff" stroke="${INK}" stroke-width="2.5"/>`;
  h += `<path d="M-84 -36 L84 -36 Q78 30 0 34 Q-78 30 -84 -36 Z" fill="${o.c || '#E9EEF4'}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-40 34 L40 34 L34 46 L-34 46 Z" fill="${o.c || '#E9EEF4'}" stroke="${INK}" stroke-width="5"/>`;
  if (!o.plain) h += `<path d="M-64 -10 Q0 4 64 -10" fill="none" stroke="${o.band || '#5B8FD6'}" stroke-width="6"/>`;
  return h + `</g>`;
}
function kimchiG(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><ellipse cx="0" cy="0" rx="90" ry="26" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M-56 -6 Q-30 -40 0 -18 Q26 -44 52 -10 Q20 8 -56 -6 Z" fill="#E2553A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-30 -14 Q-6 -28 18 -16" fill="none" stroke="#F4E2B8" stroke-width="6" stroke-linecap="round"/></g>`; }
function spoonG(x1, y1, x2, y2) { const a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, L = Math.hypot(x2 - x1, y2 - y1); return `<g transform="translate(${f1(x1)} ${f1(y1)}) rotate(${f1(a)})"><rect x="0" y="-5" width="${f1(L)}" height="10" rx="5" fill="#C9D2DC" stroke="${INK}" stroke-width="4"/><ellipse cx="${f1(L + 14)}" cy="0" rx="20" ry="13" fill="#C9D2DC" stroke="${INK}" stroke-width="4"/></g>`; }
function clothTable(x, y, w, c = '#F4F1EA', band = '#5B8FD6', yb = 880) { return `<path d="M${x} ${y} L${x + w} ${y} L${x + w + 10} ${yb} L${x - 10} ${yb} Z" fill="${c}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M${x - 4} ${y + 120} L${x + w + 4} ${y + 120}" stroke="${band}" stroke-width="10"/><path d="M${x - 6} ${y + 140} L${x + w + 6} ${y + 140}" stroke="${band}" stroke-width="4"/><rect x="${x - 10}" y="${y - 6}" width="${w + 20}" height="30" rx="10" fill="#B07A4A" stroke="${INK}" stroke-width="8"/>`; }
function tableG(x, y, w, c = '#B07A4A') { return `<rect x="${x}" y="${y}" width="${w}" height="36" rx="10" fill="${c}" stroke="${INK}" stroke-width="8"/><rect x="${x + 30}" y="${y + 36}" width="26" height="${880 - y - 36}" fill="#8A5A34" stroke="${INK}" stroke-width="6"/><rect x="${x + w - 56}" y="${y + 36}" width="26" height="${880 - y - 36}" fill="#8A5A34" stroke="${INK}" stroke-width="6"/>`; }
function videoContent(t) { const k = (t * 0.07) % 1; return `<rect x="-52" y="-98" width="104" height="196" fill="#1B2A44"/><rect x="-46" y="-60" width="92" height="70" rx="6" fill="#FF8FB1"/><path d="M-10 -40 L14 -25 L-10 -10 Z" fill="#fff"/><rect x="-46" y="20" width="92" height="6" rx="3" fill="#44506A"/><rect x="-46" y="20" width="${f1(92 * k)}" height="6" rx="3" fill="${RED}"/><rect x="-46" y="36" width="70" height="8" rx="4" fill="#8A97B0"/><rect x="-46" y="52" width="50" height="8" rx="4" fill="#6A7790"/>`; }
function standPhone(x, y, s, t) { return `<path d="M${x - 40} ${y + 120 * s} L${x} ${y + 40 * s} L${x + 40} ${y + 120 * s}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>` + phone(x, y, s, { on: 1, content: videoContent(t), glow: 0.5, rot: -6 }); }
function arrowG(x1, y1, x2, y2, o = {}) { // shaft from tail (x1,y1) to tip (x2,y2)
  const a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, L = Math.hypot(x2 - x1, y2 - y1), c = o.c || '#C9A04A';
  return `<g transform="translate(${f1(x1)} ${f1(y1)}) rotate(${f1(a)})"><line x1="0" y1="0" x2="${f1(L - 20)}" y2="0" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><line x1="0" y1="0" x2="${f1(L - 20)}" y2="0" stroke="${c}" stroke-width="6" stroke-linecap="round"/><path d="M${f1(L - 26)} -14 L${f1(L)} 0 L${f1(L - 26)} 14 Z" fill="#C9D2DC" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M0 0 L-22 -16 L6 -4 Z M0 0 L-22 16 L6 4 Z" fill="${o.f || RED}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>`;
}
function targetG(x, y, s, o = {}) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><circle r="110" fill="#fff" stroke="${INK}" stroke-width="8"/><circle r="80" fill="${o.c || '#FFB3C7'}" stroke="${INK}" stroke-width="5"/><circle r="50" fill="#fff" stroke="${INK}" stroke-width="5"/><circle r="22" fill="${o.c || '#FFB3C7'}" stroke="${INK}" stroke-width="5"/>${heart(0, 8, 0.7, PINK)}</g>`; }
function bowG(x, y, s, rot, draw = 0) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><path d="M0 -150 Q70 0 0 150" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M0 -150 Q70 0 0 150" fill="none" stroke="#8A5A34" stroke-width="12" stroke-linecap="round"/><path d="M0 -150 L${f1(-draw * 90)} 0 L0 150" fill="none" stroke="#F4F1EA" stroke-width="4"/></g>`; }
function cloudG(x, y, s, txt, o = {}) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><g fill="${o.c || '#fff'}" stroke="${INK}" stroke-width="7"><ellipse cx="0" cy="10" rx="${o.w || 170}" ry="62"/><ellipse cx="-60" cy="-30" rx="80" ry="58"/><ellipse cx="50" cy="-40" rx="90" ry="64"/></g><ellipse cx="0" cy="14" rx="${(o.w || 170) - 8}" ry="54" fill="${o.c || '#fff'}"/>${txt ? T8(0, 24, txt, { size: o.size || 46, fill: o.fill || NAVY }) : ''}</g>`; }
function diyaG(x, y, s, t, lit = 1) { // little clay oil lamp
  const fl = 1 + Math.sin(t * 9 + x) * 0.08;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  if (lit > 0) h += `<circle cx="0" cy="-40" r="${f1(120 * lit * fl)}" fill="url(#warm)" opacity="${f1(lit * 90) / 100}"/>`;
  h += `<path d="M-60 -10 Q0 40 60 -10 Q40 -26 0 -24 Q-40 -26 -60 -10 Z" fill="#B5643A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M40 -18 L78 -34 L60 -8 Z" fill="#B5643A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  if (lit > 0) h += `<g transform="translate(70 -36) scale(${f1(lit * fl * 100) / 100})"><path d="M0 0 Q-16 -24 0 -56 Q16 -24 0 0 Z" fill="#FFB547" stroke="${INK}" stroke-width="4"/><path d="M0 -6 Q-7 -20 0 -36 Q7 -20 0 -6 Z" fill="#FFF3B0"/></g>`;
  return h + `</g>`;
}
function lotusG(x, y, s) { let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><ellipse cx="0" cy="10" rx="70" ry="16" fill="#5E9A4A" stroke="${INK}" stroke-width="5"/>`; [-50, -25, 0, 25, 50].forEach((r, i) => h += `<ellipse cx="0" cy="-30" rx="16" ry="38" transform="rotate(${r} 0 4)" fill="${i % 2 ? '#FFC7DE' : LOTUS}" stroke="${INK}" stroke-width="4"/>`); return h + `</g>`; }
function mtnRange(y, c = '#9AA9C4', snow = true) {
  let d = `M-600 ${y + 300}`; const pk = [[-600, 120], [-300, 260], [0, 140], [300, 320], [560, 180], [820, 360], [1100, 200], [1380, 300], [1640, 150], [1900, 280], [2200, 160], [2520, 240]];
  pk.forEach(([x, hh], i) => d += ` L${x} ${y - hh + (i % 2 ? 0 : 60)}`);
  let h = `<path d="${d} L2520 ${y + 300} Z" fill="${c}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  if (snow) pk.forEach(([x, hh], i) => { if (i % 2) h += `<path d="M${x - 70} ${y - hh + 70} L${x} ${y - hh} L${x + 70} ${y - hh + 70} L${x + 36} ${y - hh + 56} L${x} ${y - hh + 78} L${x - 34} ${y - hh + 58} Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`; });
  return h;
}
// an Indian palace: white walls, arches, domes with gold finials
function indPalace(x, y, s, o = {}) {
  const wall = o.night ? '#2B3358' : '#F6EEDD', dome = o.night ? '#38406A' : '#F2E6CC', trim = o.night ? '#4A5280' : '#D99A3A';
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  const tower = (tx, th) => `<rect x="${tx - 60}" y="${-th}" width="120" height="${th}" fill="${wall}" stroke="${INK}" stroke-width="7"/><path d="M${tx - 70} ${-th} Q${tx - 70} ${-th - 100} ${tx} ${-th - 130} Q${tx + 70} ${-th - 100} ${tx + 70} ${-th} Z" fill="${dome}" stroke="${INK}" stroke-width="7"/><line x1="${tx}" y1="${-th - 130}" x2="${tx}" y2="${-th - 170}" stroke="${INK}" stroke-width="6"/><circle cx="${tx}" cy="${-th - 172}" r="10" fill="${GOLD}" stroke="${INK}" stroke-width="4"/><path d="M${tx - 30} ${-th + 120} L${tx - 30} ${-th + 70} Q${tx} ${-th + 36} ${tx + 30} ${-th + 70} L${tx + 30} ${-th + 120} Z" fill="${o.night ? '#FFD27A' : '#7A5A8A'}" stroke="${INK}" stroke-width="5"/>`;
  h += tower(-420, 420) + tower(420, 420);
  h += `<rect x="-360" y="-300" width="720" height="300" fill="${wall}" stroke="${INK}" stroke-width="8"/><rect x="-370" y="-320" width="740" height="30" fill="${trim}" stroke="${INK}" stroke-width="6"/>`;
  for (let i = -2; i <= 2; i++) if (i) h += `<path d="M${i * 120 - 34} -70 L${i * 120 - 34} -170 Q${i * 120} -220 ${i * 120 + 34} -170 L${i * 120 + 34} -70 Z" fill="${o.night ? '#FFD27A' : '#7A5A8A'}" stroke="${INK}" stroke-width="5" opacity="${o.night ? 0.9 : 1}"/>`;
  h += `<path d="M-90 0 L-90 -150 Q0 -260 90 -150 L90 0 Z" fill="${o.night ? '#1A1F3A' : '#8A3A2A'}" stroke="${INK}" stroke-width="7"/>`;
  h += `<path d="M-230 -320 Q-230 -560 0 -620 Q230 -560 230 -320 Z" fill="${dome}" stroke="${INK}" stroke-width="8"/><path d="M-150 -400 Q0 -440 150 -400" fill="none" stroke="${trim}" stroke-width="10"/><line x1="0" y1="-620" x2="0" y2="-690" stroke="${INK}" stroke-width="8"/><circle cx="0" cy="-696" r="16" fill="${GOLD}" stroke="${INK}" stroke-width="5"/>`;
  return h + `</g>`;
}
function bodhiG(x, y, s, t, o = {}) { // big fig tree with heart-shaped leaves
  const sw = Math.sin(t * 0.7) * 1.2;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  h += `<path d="M-120 0 Q-60 -40 -70 -200 Q-80 -320 -40 -400 L50 -400 Q90 -320 76 -200 Q66 -40 130 0 Z" fill="#7A5235" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-40 -380 Q-200 -420 -320 -520 M40 -380 Q200 -440 330 -520 M0 -400 Q-10 -520 20 -620" fill="none" stroke="${INK}" stroke-width="40" stroke-linecap="round"/><path d="M-40 -380 Q-200 -420 -320 -520 M40 -380 Q200 -440 330 -520 M0 -400 Q-10 -520 20 -620" fill="none" stroke="#7A5235" stroke-width="28" stroke-linecap="round"/>`;
  h += `<g transform="rotate(${f1(sw)} 0 -420)">`;
  const C = [[-420, -560, 170], [-220, -700, 210], [20, -760, 230], [260, -700, 210], [450, -560, 170], [-140, -520, 180], [180, -520, 180], [20, -600, 200]];
  for (const [cx, cy, r] of C) h += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${o.c1 || '#4E8A46'}" stroke="${INK}" stroke-width="9"/>`;
  for (const [cx, cy, r] of C) h += `<circle cx="${cx - r * 0.2}" cy="${cy - r * 0.25}" r="${f1(r * 0.55)}" fill="${o.c2 || '#6CAA5A'}"/>`;
  for (let i = 0; i < 26; i++) { const lx = -480 + hash(i * 3.3) * 960, ly = -860 + hash(i * 7.1) * 420, r = Math.sin(t * 1.4 + i) * 10; h += `<path transform="translate(${f1(lx)} ${f1(ly)}) rotate(${f1(160 + r + hash(i) * 40)})" d="M0 -34 C-26 -30 -28 -4 0 22 C28 -4 26 -30 0 -34 Z M0 22 L0 40" fill="${o.c3 || '#8CCB6E'}" stroke="${INK}" stroke-width="4"/>`; }
  return h + `</g></g>`;
}
function cushionG(x, y, s, c = '#7A3E8E') { return `<ellipse cx="${x}" cy="${y}" rx="${170 * s}" ry="${44 * s}" fill="${c}" stroke="${INK}" stroke-width="7"/><ellipse cx="${x}" cy="${y - 12 * s}" rx="${120 * s}" ry="${20 * s}" fill="#fff" opacity=".18"/>`; }
function rays(cx, cy, r0, r1, n, t, c = '#FFE9A8', op = 0.5) { let h = ''; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + t * 0.12; h += `<path d="M${f1(cx + Math.cos(a - 0.05) * r0)} ${f1(cy + Math.sin(a - 0.05) * r0)} L${f1(cx + Math.cos(a) * r1)} ${f1(cy + Math.sin(a) * r1)} L${f1(cx + Math.cos(a + 0.05) * r0)} ${f1(cy + Math.sin(a + 0.05) * r0)} Z" fill="${c}" opacity="${op}"/>`; } return h; }
function kitchen(t, night) {
  let h = BG(night ? 'url(#nightRoom)' : 'url(#dayRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".3"/>');
  h += night ? windowNight(1380, 140, 360, 280, t) : windowDay(1380, 140, 360, 280, t);
  h += `<rect x="-600" y="880" width="3120" height="600" fill="${night ? '#1A2040' : '#C9AE8C'}"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  h += `<rect x="160" y="190" width="300" height="24" fill="#8C6638" stroke="${INK}" stroke-width="6"/>${[0, 1, 2].map(i => `<rect x="${190 + i * 80}" y="${130 + (i % 2) * 10}" width="56" height="${60 - (i % 2) * 10}" rx="8" fill="${['#F2D27A', '#9CC9DE', '#F49AC1'][i]}" stroke="${INK}" stroke-width="5"/>`).join('')}`;
  return h;
}
function sat(x, y, s, o) { return Z(Object.assign({ x, y, s }, o)); }

/* ---------- shared eating motion (blunch / bmeal / bmonkey / bdinner) ----------
   Zero's right arm hangs from the shoulder (2-bone IK, elbow always below/outside); the hand never lets go of the spoon:
   it rests above the bowl with the spoon dipped in, lifts with ease, and the spoon bowl stops exactly on the mouth.
   Everything is in char coords (feet at 200,560), so it works at any position / scale. The bowl sits at char x ≈ 405, right of the elbow, so the whole arm stays visible. */
const EAT = { S: [252, 285], U: 72, F: 66, rest: [380, 282], mouth: [294, 262], tip: [214, 245], restAng: 70 };
function eatIK(H) {
  const [sx, sy] = EAT.S, dx = H[0] - sx, dy = H[1] - sy, d0 = Math.hypot(dx, dy) || 1, ux = dx / d0, uy = dy / d0;
  const d = Math.min(d0, EAT.U + EAT.F - 2), aa = (EAT.U * EAT.U - EAT.F * EAT.F + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, EAT.U * EAT.U - aa * aa));
  let px = -uy, py = ux; if (py < 0) { px = -px; py = -py; }
  return [sx + aa * ux + hh * px, sy + aa * uy + hh * py];
}
// e: 0 = hand at the bowl, 1 = spoon at the mouth; dip: 0..1 small scoop while resting
function eatRig(o) {
  const e = clamp(o.e || 0, 0, 1), dip = o.dip || 0, R = EAT.rest, M = EAT.mouth, bulge = Math.sin(e * Math.PI);
  const H = [lerp(R[0], M[0], e) + 16 * bulge - 5 * dip, lerp(R[1], M[1], e) - 8 * bulge + 9 * dip];
  const E = eatIK(H);
  const mAng = Math.atan2(EAT.tip[1] - M[1], EAT.tip[0] - M[0]) * 180 / Math.PI + 360, mLen = Math.hypot(EAT.tip[0] - M[0], EAT.tip[1] - M[1]) - 18;
  const ang = lerp(EAT.restAng + 6 * dip, mAng, 1 - (1 - e) * (1 - e)), len = lerp(70, mLen, e); // the spoon turns toward the mouth early in the lift
  const pose = Object.assign({}, P['숟가락'], { armR: [EAT.S.slice(), E, H], hR: H });
  const br = Math.sin(o.t * 2.3 + o.seed) * 3.2; // char()'s breathing offset, so spoon + hand stay glued to the arm
  const g = `<g transform="translate(${f1(o.x)} ${f1(o.y)}) scale(${o.s}) translate(-200 ${f1(-560 - br)})">`;
  const spoon = g + `<g transform="translate(${f1(H[0])} ${f1(H[1])}) rotate(${f1(ang)})"><rect x="-6" y="-6" width="${f1(len + 6)}" height="12" rx="6" fill="#C9D2DC" stroke="${INK}" stroke-width="5"/><ellipse cx="${f1(len + 18)}" cy="0" rx="24" ry="15" fill="#C9D2DC" stroke="${INK}" stroke-width="5"/><path d="M${f1(len + 6)} -6 Q${f1(len + 18)} -12 ${f1(len + 30)} -5" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/></g></g>`;
  const hand = g + `<circle cx="${f1(H[0])}" cy="${f1(H[1])}" r="22" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M${f1(H[0] - 10)} ${f1(H[1] + 8)} Q${f1(H[0])} ${f1(H[1] + 16)} ${f1(H[0] + 10)} ${f1(H[1] + 8)}" fill="none" stroke="#C9D6E2" stroke-width="5" stroke-linecap="round"/></g>`;
  return { pose, spoon, hand };
}
// continuous eating: rest + scoop -> lift -> bite -> back down (all eased, zero velocity at every turn)
function eatCycle(t, period = 2.6) {
  const p = ((t / period) % 1 + 1) % 1;
  if (p < 0.3) return { e: 0, dip: (1 - Math.cos(2 * Math.PI * p / 0.3)) / 2 };
  if (p < 0.55) return { e: easeInOut((p - 0.3) / 0.25), dip: 0 };
  if (p < 0.72) return { e: 1, dip: 0 };
  return { e: 1 - easeInOut((p - 0.72) / 0.28), dip: 0 };
}
// one slow bite: scoop, lift (a..b), hold, lower (c..d), then the hand rests at the bowl with the spoon
function eatBite(lt, a, b, c, d) { return { e: easeInOut(prog(lt, a, b)) * (1 - easeInOut(prog(lt, c, d))), dip: lt < a ? (1 - Math.cos(2 * Math.PI * prog(lt, a - 0.7, a))) / 2 : 0 }; }

/* ---------- hook: the lunch nobody tasted ---------- */
function blunchScene(t, lt, a) {
  const D = D_(a);
  let h = kitchen(t, false);
  const zx = 760, zy = 840, zs = 0.8;
  h += `<rect x="660" y="430" width="200" height="300" rx="20" fill="#8A5A34" stroke="${INK}" stroke-width="8"/><rect x="684" y="456" width="152" height="40" rx="10" fill="#A9744A"/>`; // chair back
  const rig = eatRig(Object.assign({ t, seed: 2000, x: zx, y: zy, s: zs }, eatCycle(t, 2.6))); // spoon: bowl -> mouth -> bowl
  h += Z({ t, seed: 2000, x: zx, y: zy, s: zs, pose: rig.pose, ex: exprAt([[0, a.k ? '지침' : '기본'], [0.6 * D, a.k ? '걱정' : '기본']], lt), look: [0.95, 0.15] });
  h += mealTable(t);
  h += standPhone(1340, 560, 0.62, t);
  h += rig.spoon + mealRice() + rig.hand;
  // eyes -> phone line
  h += `<path d="M${zx + 60} ${zy - 300} Q1100 380 1300 520" fill="none" stroke="${PINK}" stroke-width="5" stroke-dasharray="12 10" opacity=".7"/>`;
  if (!a.k) {
    h += pop(t, t - lt + 0.1, t + 99, 960, 175, big(0, 0, [[['오늘 점심, ', '#fff'], ['무슨 맛', YEL], ['이었는지', '#fff']], '기억나세요?'], { size: 70, sw: 14, lh: 88 }), {});
    return h;
  }
  h += pop(t, t - lt + 0.32 * D, t + 99, 520, 560, label(0, 0, '숟가락 → 입', { size: 36, bg: '#fff' }), { rot: -3 });
  h += pop(t, t - lt + 0.52 * D, t + 99, 1340, 410, label(0, 0, '눈 → 영상', { size: 36, bg: PINK, color: '#fff' }), { rot: 3 });
  h += pop(t, t - lt + 0.1, t + 99, 560, 260, bubble(0, 0, 420, 130, T8(0, 16, '무슨 맛이었지…?', { size: 42 }), { right: 1 }), { bob: 4 });
  return h;
}

/* ---------- hook 2: body here, mind elsewhere ---------- */
function bmindScene(t, lt, a) {
  const D = D_(a);
  if (!a.k) {
    // left: walking with the phone
    let L = BG('url(#morning)') + `<rect x="-600" y="760" width="1600" height="700" fill="#BFC6CF"/><line x1="-600" y1="760" x2="1000" y2="760" stroke="${INK}" stroke-width="6"/>`;
    for (let i = 0; i < 6; i++) L += `<rect x="${-100 + i * 200}" y="${300 + (i % 3) * 40}" width="150" height="${460 - (i % 3) * 40}" fill="${['#A9C3DA', '#C9B8D9', '#B9D3C4'][i % 3]}" stroke="${INK}" stroke-width="5"/>`;
    L += `<rect x="-600" y="880" width="1600" height="600" fill="#9AA3AE"/>`;
    const k = clamp(lt / (0.62 * D), 0, 1), zx = lerp(120, 560, k), stop = k >= 1;
    L += `<rect x="700" y="380" width="26" height="500" fill="#6A7790" stroke="${INK}" stroke-width="6"/><rect x="664" y="360" width="98" height="30" rx="10" fill="#6A7790" stroke="${INK}" stroke-width="6"/>`;
    const wp = stop ? P['폰보기'] : Object.assign({}, walkPose(t * 7, 0.6), { armL: P['폰보기'].armL, armR: P['폰보기'].armR, hL: P['폰보기'].hL, hR: P['폰보기'].hR });
    L += Z({ t, seed: 2001, x: zx, y: 880, s: 0.62, pose: wp, ex: exprAt([[0, '기본'], [0.62 * D, '놀람']], lt), look: stop ? [0.6, -0.4] : [0, 0.9] });
    const [px, py] = handG(zx, 880, 0.62, [200, 318]); L += phone(px, py - 4, 0.32, { on: 1 });
    if (stop) L += pop(t, t - lt + 0.62 * D, t + 99, 640, 300, outlined(0, 0, ['멈칫!'], { size: 54, sw: 11, fill: YEL }), { rot: -8 });
    if (!stop) L += pop(t, t - lt + 0.15, t + 99, zx + 120, 440, label(0, 0, 'ㅋㅋ 답장 왔다', { size: 30, bg: '#fff' }), { bob: 4 });
    L += label(480, 150, '걸을 땐 메시지', { size: 44, bg: MINT });
    // right: lying awake
    let R = BG('url(#nightRoom)') + `<rect x="960" y="880" width="1600" height="600" fill="#10152B"/>`;
    R += windowNight(1500, 150, 300, 230, t);
    R += `<rect x="1060" y="680" width="760" height="200" rx="30" fill="#3B4A7A" stroke="${INK}" stroke-width="8"/><ellipse cx="1200" cy="700" rx="120" ry="42" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
    R += Z({ t, seed: 2002, x: 1470, y: 690, s: 0.5, rot: -88, ex: exprAt([[0, '걱정']], t), look: [0.3, -0.9] });
    R += `<path d="M1330 650 Q1560 630 1820 660 L1830 790 L1320 790 Z" fill="#5C7AD6" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
    const W = [[0.3, 1250, 330, '내일 발표…'], [0.45, 1610, 470, '답장 했나?'], [0.6, 1300, 520, '그때 왜 그랬지']];
    W.forEach(([f, x, y, txt], i) => { if (lt > f * D) R += pop(t, t - lt + f * D, t + 99, x, y, cloudG(0, 0, 0.62, txt, { size: 44, w: 200, c: '#DCE4F4' }), { bob: 5 + i }); });
    R += label(1440, 150, '누우면 내일 걱정', { size: 44, bg: '#B9A7FF' });
    let h = `<g clip-path="url(#leftHalf)">${L}</g><g clip-path="url(#rightHalf)">${R}</g><line x1="960" y1="-600" x2="960" y2="1680" stroke="${INK}" stroke-width="12"/>`;
    return h;
  }
  // k1: the mind drifts off on a string
  let h = BG('url(#cream)') + BG('url(#paper)');
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#E3D6BE"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="6"/>`;
  const zx = 640, zy = 900, zs = 0.78;
  h += Z({ t, seed: 2003, x: zx, y: zy, s: zs, pose: '폰보기', ex: exprAt([[0, '기본']], t), look: [0.4, 0.9] });
  const [px, py] = handG(zx, zy, zs, [200, 318]); h += phone(px, py - 6, 0.4, { on: 1 });
  const dr = easeOut(prog(lt, 0.1, 0.9 * D)), bx = lerp(760, 1420, dr), by = lerp(420, 260, dr) + Math.sin(t * 1.6) * 14;
  h += `<path d="M${zx + 40} ${zy - 360} Q${f1((zx + bx) / 2)} ${f1(by + 160)} ${f1(bx - 50)} ${f1(by + 60)}" fill="none" stroke="${INK}" stroke-width="4" stroke-dasharray="10 9"/>`;
  h += `<g transform="translate(${f1(bx)} ${f1(by)})" opacity=".92"><path d="M0 70 C-120 0 -110 -110 -40 -110 C-10 -110 0 -86 0 -76 C0 -86 10 -110 40 -110 C110 -110 120 0 0 70 Z" fill="#FFD6E4" stroke="${INK}" stroke-width="7"/><circle cx="-26" cy="-46" r="7" fill="${INK}"/><circle cx="26" cy="-46" r="7" fill="${INK}"/><path d="M-14 -20 Q0 -8 14 -20" fill="none" stroke="${INK}" stroke-width="5"/></g>`;
  h += pop(t, t - lt + 0.25 * D, t + 99, zx, 360, label(0, 0, '몸: 여기', { size: 42, bg: MINT }), { rot: -3 });
  h += pop(t, t - lt + 0.5 * D, t + 99, f1(bx), f1(by - 170), label(0, 0, '마음: 저기', { size: 42, bg: PINK, color: '#fff' }), { rot: 3, bob: 3 });
  h += pop(t, t - lt + 0.05, t + 99, 1240, 700, big(0, 0, [[['몸은 여기, ', '#fff'], ['마음은 저기', YEL]]], { size: 64, sw: 13 }), {});
  return h;
}

/* ---------- 2,500 years ago ---------- */
function bindiaScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#inkSky)') + BG('url(#paper)');
  h += `<circle cx="1500" cy="240" r="90" fill="#E8734A" opacity=".85"/>` + mtnRange(560, '#B9C4D4') + `<path d="M-600 760 Q400 720 960 760 Q1500 800 2520 740 L2520 1480 L-600 1480 Z" fill="#C9B98F" stroke="${INK}" stroke-width="6"/>`;
  h += `<path d="M-600 820 Q300 790 700 830 Q1200 880 2520 800" fill="none" stroke="#7DB7E0" stroke-width="26" stroke-linecap="round"/>`;
  // a time line: then <---> now
  const k = easeInOut(prog(lt, 0.1 * D, 0.55 * D));
  const lx = f1(lerp(1600, 340, k));
  h += `<line x1="${lx}" y1="640" x2="1600" y2="640" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><line x1="${lx}" y1="640" x2="1600" y2="640" stroke="${YEL}" stroke-width="5" stroke-linecap="round"/>`;
  // end ticks + labels, so the yellow line reads as a time line (then <-> now)
  const tick = x => `<line x1="${x}" y1="614" x2="${x}" y2="666" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><line x1="${x}" y1="614" x2="${x}" y2="666" stroke="${YEL}" stroke-width="6" stroke-linecap="round"/>`;
  h += tick(1600) + (k > 0.02 ? tick(lx) : '');
  h += pop(t, t - lt + 0.1 * D, t + 99, 1600, 578, label(0, 0, '지금', { size: 34, bg: '#fff' }), {});
  if (k > 0.98) h += pop(t, t - lt + 0.55 * D, t + 99, 340, 578, label(0, 0, '2,500년 전', { size: 34, bg: YEL }), {});
  h += Z({ t, seed: 2004, x: 1640, y: 900, s: 0.5, ex: exprAt([[0, '놀람']], t), look: [-0.9, -0.2] });
  if (k > 0.98) {
    h += `<circle cx="340" cy="770" r="${f1(150 + Math.sin(t * 2) * 8)}" fill="url(#warm)"/>`;
    h += pop(t, t - lt + 0.55 * D, t + 99, 0, 0, `<g filter="url(#sil)">${BU({ t, seed: 2005, x: 340, y: 900, s: 0.5, pose: '좌선', ex: exprAt([[0, '잠']], t) })}</g>`, { noPop: true, inDur: 0.6 });
  }
  h += pop(t, t - lt + 0.08, t + 99, 960, 250, big(0, 0, [[['약 ', '#fff'], ['2,500년', YEL], [' 전', '#fff']]], { size: 92, sw: 17 }), {});
  h += pop(t, t - lt + 0.6 * D, t + 99, 960, 420, label(0, 0, '이 문제에 평생을 건 사람', { size: 42, bg: '#fff' }), {});
  return h;
}

/* ---------- the prince in the palace ---------- */
function palaceBg(t) {
  let h = BG('url(#morning)') + `<circle cx="1600" cy="190" r="70" fill="#FFF3B0"/>` + clouds(t, 90, 14, 3, 31);
  h += mtnRange(470, '#B9C9DE');
  h += indPalace(960, 760, 0.82);
  h += `<rect x="-600" y="760" width="3120" height="720" fill="#9CC98A" stroke="${INK}" stroke-width="6"/>`;
  h += `<ellipse cx="960" cy="950" rx="560" ry="70" fill="#9CC9DE" stroke="${INK}" stroke-width="6"/>` + lotusG(760, 950, 0.5) + lotusG(1160, 960, 0.45) + lotusG(960, 975, 0.35);
  return h;
}
function bpalaceScene(t, lt, a) {
  const D = D_(a);
  let h = palaceBg(t);
  if (!a.k) {
    const walk = prog(lt, 0, 0.5 * D), px = lerp(1500, 1260, easeOut(walk));
    h += PR({ t, seed: 2010, x: px, y: 900, s: 0.68, pose: walk < 1 ? walkPose(t * 6, 0.5) : '손인사', ex: exprAt([[0, '신남']], t), look: [-0.6, -0.1] });
    h += pop(t, t - lt + 0.45 * D, t + 99, 1260, 300, label(0, 0, '왕자 싯다르타', { size: 46, bg: YEL }), { rot: -3 });
    h += pop(t, t - lt + 0.05, t + 99, 640, 150, big(0, 0, [[['히말라야 아래 ', '#fff'], ['작은 나라', YEL]]], { size: 62, sw: 13 }), {});
    return h;
  }
  h += KG({ t, seed: 2011, x: 520, y: 900, s: 0.66, pose: '가리키기', ex: exprAt([[0, '결심']], t), look: [0.8, -0.2] });
  h += PR({ t, seed: 2010, x: 1260, y: 900, s: 0.68, pose: '서기', ex: exprAt([[0, '신남']], t), look: [0.2, -0.6] });
  const badge = (inner, nm) => `<circle r="86" fill="#FFF8E8" stroke="${INK}" stroke-width="7"/>${inner}${label(0, 118, nm, { size: 30, bg: '#fff' })}`;
  const items = [[0.15, 1020, 420, '꽃', lotusG(0, 20, 0.62)], [0.3, 1170, 230, '음악', outlined(0, 30, ['♪♫'], { size: 84, sw: 13, fill: MINT })], [0.45, 1400, 230, '맛있는 음식', bowlG(0, 34, 0.52, { kind: 'porridge', c: GOLD, band: RED })], [0.6, 1560, 420, '비단 옷', `<path d="M-60 -40 L60 -40 L44 50 L-44 50 Z" fill="${LOTUS}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-52 -6 L52 -6" stroke="${GOLD}" stroke-width="8"/>`]];
  items.forEach(([f, x, y, nm, g]) => { if (lt > f * D) h += pop(t, t - lt + f * D, t + 99, x, y, badge(g, nm), { bob: 3 }); });
  h += pop(t, t - lt + 0.05 * D, t + 99, 520, 250, label(0, 0, '슬픈 건 하나도 보이지 않게', { size: 38, bg: '#fff' }), { rot: -2 });
  return h;
}

/* ---------- four sights ---------- */
function sightPanel(i, t) {
  let p = `<rect x="-230" y="-210" width="460" height="420" rx="24" fill="#FBF6EA" stroke="${INK}" stroke-width="7"/><rect x="-230" y="110" width="460" height="100" rx="0" fill="#E3D6BE"/><path d="M-230 110 L230 110" stroke="${INK}" stroke-width="5"/>`;
  if (i === 0) { p += OLDM({ t, seed: 2020, x: -10, y: 190, s: 0.5, pose: '지팡이', rot: 8, ex: exprAt([[0, '지침']], t), look: [0.5, 0.4] }); const [sx, sy] = handG(-10, 190, 0.5, P['지팡이'].hR); p += `<line x1="${f1(sx)}" y1="${f1(sy)}" x2="${f1(sx + 30)}" y2="196" stroke="#7A5235" stroke-width="9" stroke-linecap="round"/>`; }
  if (i === 1) { p += `<rect x="-170" y="120" width="340" height="40" rx="12" fill="#C9B89A" stroke="${INK}" stroke-width="5"/>` + VIL('#B9C7D9', { t, seed: 2021, x: 30, y: 130, s: 0.42, rot: -88, ex: exprAt([[0, '걱정']], t), look: [0.2, -0.8], sweat: true }) + `<path d="M-120 110 Q0 90 150 106 L150 140 L-120 140 Z" fill="#E9E1D0" stroke="${INK}" stroke-width="5"/>` + bowlG(150, 140, 0.32, { kind: 'soup', plain: 1 }); }
  if (i === 2) { p += VIL('#E8E4DA', { t, seed: 2022, x: -150, y: 200, s: 0.4, pose: walkPose(t * 4, 0.3), ex: exprAt([[0, '지침']], t), look: [0.6, 0.4] }) + VIL('#E8E4DA', { t, seed: 2023, x: 150, y: 200, s: 0.4, pose: walkPose(t * 4 + 1.6, 0.3), ex: exprAt([[0, '지침']], t), look: [0.6, 0.4] }); p += `<line x1="-210" y1="20" x2="210" y2="20" stroke="#7A5235" stroke-width="10" stroke-linecap="round"/><rect x="-120" y="-24" width="240" height="44" rx="18" fill="#fff" stroke="${INK}" stroke-width="5"/>`; for (let j = 0; j < 9; j++) p += `<circle cx="${-104 + j * 26}" cy="${-26 + (j % 2) * 6}" r="11" fill="#F2A33A" stroke="${INK}" stroke-width="3"/>`; }
  if (i === 3) { p += `<circle cx="0" cy="40" r="170" fill="url(#warm)"/>` + MONK({ t, seed: 2024, x: 0, y: 160, s: 0.5, pose: '좌선', ex: exprAt([[0, '잠']], t), still: true }); }
  return p;
}
function bgatesScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#sepia)') + BG('url(#paper)');
  h += `<rect x="-600" y="860" width="3120" height="600" fill="#D9C7A0" stroke="${INK}" stroke-width="6"/>`;
  const names = ['늙은 사람', '병든 사람', '장례 행렬', '평온한 수행자'];
  if (!a.k) {
    const T = [0.5, 0.66, 0.8];
    for (let i = 0; i < 3; i++) {
      if (lt < T[i] * D) continue;
      const k = easeOutBack(clamp((lt - T[i] * D) / 0.4, 0, 1)), cx = 380 + i * 580;
      h += `<g transform="translate(${cx} 400) scale(${f1(clamp(k, 0, 1.2) * 1.08 * 1000) / 1000})">${sightPanel(i, t)}</g>`;
      h += pop(t, t - lt + T[i] * D + 0.2, t + 99, cx, 680, label(0, 0, names[i], { size: 40, bg: '#fff' }), {});
    }
    h += PR({ t, seed: 2025, x: 960, y: 960, s: 0.45, crown: true, ex: exprAt([[0, '기본'], [0.45 * D, '놀람']], lt), look: [Math.sin(t * 0.8) * 0.8, -0.8] });
    h += pop(t, t - lt + 0.05, t + 99, 960, 110, label(0, 0, '성 밖에서 만난 것들', { size: 40, bg: YEL }), {});
    return h;
  }
  for (let i = 0; i < 3; i++) h += `<g opacity=".35" transform="translate(${260 + i * 300} 230) scale(.48)">${sightPanel(i, t)}</g>`;
  const k = easeOutBack(clamp(lt / 0.5, 0, 1));
  h += `<g transform="translate(1330 470) scale(${f1(clamp(k, 0, 1.2) * 1.15 * 1000) / 1000})">${sightPanel(3, t)}</g>`;
  h += pop(t, t - lt + 0.3, t + 99, 1330, 760, label(0, 0, '가진 것 없이도 평온', { size: 40, bg: YEL }), {});
  h += PR({ t, seed: 2025, x: 640, y: 960, s: 0.55, ex: exprAt([[0, '놀람'], [0.6 * D, '결심']], lt), look: [0.9, -0.3] });
  return h;
}

/* ---------- leaving at 29 ---------- */
function bleaveScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#nightRoom)');
  for (let i = 0; i < 40; i++) h += `<circle cx="${f1(hash(i * 2.1) * 1920)}" cy="${f1(hash(i * 5.3) * 560)}" r="${2 + (i % 3)}" fill="#fff" opacity="${f1((0.4 + 0.5 * Math.abs(Math.sin(t * 1.3 + i))) * 100) / 100}"/>`;
  h += `<circle cx="1560" cy="190" r="60" fill="#FFF2C0"/><circle cx="1580" cy="176" r="56" fill="#1A2140"/><circle cx="1560" cy="190" r="200" fill="url(#warm)" opacity=".25"/>`;
  h += mtnRange(560, '#2A3260', false);
  h += indPalace(420, 840, 0.62, { night: 1 });
  h += `<rect x="-600" y="840" width="3120" height="640" fill="#232A4A" stroke="${INK}" stroke-width="6"/><path d="M500 860 Q960 880 1900 850" fill="none" stroke="#3A426A" stroke-width="40" stroke-linecap="round"/>`;
  const walk = prog(lt, 0.05 * D, 0.7 * D), zx = lerp(560, 1240, easeInOut(walk)), back = lt > 0.72 * D;
  h += PR({ t, seed: 2030, x: zx, y: 900, s: 0.62, crown: false, pose: walk < 1 ? walkPose(t * 6, 0.55) : '서기', ex: exprAt([[0, '결심'], [0.72 * D, '기본']], lt), look: back ? [-0.9, -0.2] : [0.8, 0], shade: '#AFC0E0', light: -1 });
  h += crownAt(470, 870, 0.42); // the crown left behind at the gate
  h += pop(t, t - lt + 0.08, t + 99, 960, 160, big(0, 0, [[['스물아홉', YEL], [', 궁을 떠나다', '#fff']]], { size: 68, sw: 13 }), {});
  if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 1460, 430, bubble(0, 0, 520, 140, T8(0, 16, '진짜 평온은 어디 있을까?', { size: 40 }), { right: 1 }), { bob: 4 });
  return h;
}

/* ---------- six years of hardship ---------- */
function forestBg(t, o = {}) {
  let h = inkBg(t, { sx: o.sx || 1580, sy: 200, gy: 880, gc: o.gc || '#A9B98F' });
  for (let i = 0; i < 7; i++) { const x = -80 + i * 330; h += `<rect x="${x - 16}" y="420" width="32" height="470" fill="#6E5A44" stroke="${INK}" stroke-width="5"/><circle cx="${x}" cy="400" r="${110 + (i % 3) * 20}" fill="#7E9A72" stroke="${INK}" stroke-width="6" opacity=".9"/>`; }
  return h;
}
function bfastScene(t, lt, a) {
  const D = D_(a);
  let h = forestBg(t);
  h += `<path d="M830 900 Q830 640 900 560 L1020 560 Q1090 640 1090 900 Z" fill="#6E5A44" stroke="${INK}" stroke-width="7"/><circle cx="960" cy="420" r="250" fill="#6E8A62" stroke="${INK}" stroke-width="8"/><circle cx="900" cy="380" r="140" fill="#7E9A72"/>`;
  const thin = a.k ? 1 : prog(lt, 0.1 * D, 0.9 * D), faint = a.k ? prog(lt, 0.05 * D, 0.4 * D) : 0;
  const ex = a.k ? exprAt([[0, '지침'], [0.55 * D, '결심']], lt) : exprAt([[0, '결심'], [0.5 * D, '지침']], lt);
  h += BU({ t, seed: 2040, x: 960, y: 900, s: 0.7, pose: '좌선', ex, look: [0, 0.4], lw: lerp(1, 0.6, thin), sx: lerp(1, 0.9, thin), rot: a.k ? Math.sin(t * 2.2) * 3 * faint : 0, shade: '#DDD6C8' });
  if (!a.k) {
    // years tally
    const yrs = Math.min(6, Math.floor(prog(lt, 0.1 * D, 0.65 * D) * 6.99));
    h += `<g transform="translate(1450 330)">${panel(-210, -120, 420, 240, { fill: '#FBF6EA' })}${T8(0, -50, '고행', { size: 40 })}${[...Array(6)].map((_, i) => `<line x1="${-130 + i * 52}" y1="0" x2="${-130 + i * 52}" y2="80" stroke="${i < yrs ? INK : '#D9CFBE'}" stroke-width="10" stroke-linecap="round"/>`).join('')}${T8(0, 106, yrs + '년', { size: 34, fill: '#8A5A34' })}</g>`;
    if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 470, 520, `<circle r="170" fill="#FBF6EA" stroke="${INK}" stroke-width="8"/><ellipse cx="0" cy="40" rx="120" ry="34" fill="#E8DCC4" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="30" rx="30" ry="16" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M-8 24 Q0 20 8 24" fill="none" stroke="#C9BFA8" stroke-width="3"/>` + label(0, -120, '하루 쌀 한 톨', { size: 38, bg: YEL }), {});
    return h;
  }
  for (let i = 0; i < 3; i++) { const k = ((t * 1.2 + i / 3) % 1); h += `<circle cx="${f1(960 + Math.cos(t * 2 + i * 2.1) * 110)}" cy="${f1(470 + Math.sin(t * 2 + i * 2.1) * 30)}" r="10" fill="${YEL}" stroke="${INK}" stroke-width="3" opacity="${f1((1 - k) * 100) / 100}"/>`; }
  if (lt > 0.5 * D) h += pop(t, t - lt + 0.5 * D, t + 99, 960, 160, big(0, 0, ['이렇게 해서는', [['답이 안 나온다', YEL]]], { size: 66, sw: 13, lh: 84 }), {});
  return h;
}

/* ---------- milk rice and the middle way ---------- */
function briceScene(t, lt, a) {
  const D = D_(a);
  if (!a.k) {
    let h = forestBg(t, { sx: 1660, gc: '#B5C496' });
    const walk = prog(lt, 0, 0.35 * D), gx = lerp(1700, 1180, easeOut(walk)), given = lt > 0.55 * D, gs = 0.58;
    h += BU({ t, seed: 2041, x: 760, y: 880, s: 0.7, pose: given ? sitP('받기') : '좌선', ex: exprAt([[0, '지침'], [0.6 * D, '뿌듯']], lt), look: [0.8, 0.1], lw: 0.65, sx: 0.92 });
    const gp = walk < 1 ? walkPose(t * 6, 0.5) : (given ? '서기' : '내밀기');
    h += flip(gx, SUJ({ t, seed: 2042, x: gx, y: 880, s: gs, pose: gp, ex: exprAt([[0, '신남']], t), look: [0.8, 0.1] }));
    const bowl = (x, y) => bowlG(x, y, 0.42, { kind: 'porridge', steam: 1, t, c: '#C99A6A', plain: 1 });
    if (!given) { const hr = walk < 1 ? [300, 330] : P['내밀기'].hR, [hx, hy] = handG(gx, 880, gs, hr); h += bowl(2 * gx - hx, hy - 6); }
    else { const hy = 880 + (352 + 46 - 560) * 0.7; h += bowl(760 + 8, hy - 6); }
    h += pop(t, t - lt + 0.4 * D, t + 99, 1230, 300, label(0, 0, '우유죽 한 그릇', { size: 42, bg: '#fff' }), { rot: 3 });
    return h;
  }
  // the middle way
  let h = BG('url(#inkSky)') + BG('url(#paper)');
  h += `<path d="M-600 880 L2520 880 L2520 1480 L-600 1480 Z" fill="#D9CDB0"/>`;
  h += `<path d="M960 900 L520 300" stroke="#C9B8A0" stroke-width="70" stroke-linecap="round"/><path d="M960 900 L1400 300" stroke="#C9B8A0" stroke-width="70" stroke-linecap="round"/>`;
  const glow = prog(lt, 0.45 * D, 0.7 * D);
  h += `<path d="M960 900 L960 400" stroke="${glow > 0 ? YEL : '#C9B8A0'}" stroke-width="80" stroke-linecap="round" opacity="${f1((0.5 + glow * 0.5) * 100) / 100}"/>`;
  h += `<g transform="translate(470 230)">${indPalace(0, 60, 0.18)}</g>` + pop(t, t - lt + 0.1, t + 99, 470, 420, label(0, 0, '너무 편하게', { size: 38, bg: '#fff' }), { rot: -3 });
  h += `<g transform="translate(1450 260)">${bowlG(0, 0, 0.6, { kind: 'grain', plain: 1, c: '#C99A6A' })}</g>` + pop(t, t - lt + 0.25 * D, t + 99, 1450, 420, label(0, 0, '너무 괴롭게', { size: 38, bg: '#fff' }), { rot: 3 });
  if (glow > 0) h += `<g opacity="${f1(glow * 100) / 100}">${bodhiG(960, 420, 0.2, t)}</g>`;
  const wk = prog(lt, 0.5 * D, D), wy = lerp(900, 680, wk);
  h += BU({ t, seed: 2043, x: 960, y: wy, s: 0.38, pose: wk > 0 && wk < 1 ? walkPose(t * 6, 0.4) : '서기', ex: exprAt([[0, '뿌듯']], t), look: [0, -0.6] });
  if (glow > 0) h += pop(t, t - lt + 0.5 * D, t + 99, 960, 130, big(0, 0, [[['그 사이의 길 = ', '#fff'], ['중도', YEL]]], { size: 70, sw: 14 }), {});
  return h;
}

/* ---------- under the bodhi tree ---------- */
function bbodhiScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#sunset)');
  h += `<circle cx="960" cy="520" r="${f1(260 + Math.sin(t) * 10)}" fill="url(#warm)"/>` + rays(960, 560, 120, 900, 18, t, '#FFE9A8', 0.22);
  h += `<path d="M-600 820 Q960 780 2520 820 L2520 1480 L-600 1480 Z" fill="#8FAE6A" stroke="${INK}" stroke-width="7"/>`;
  h += bodhiG(960, 850, 0.82, t);
  h += cushionG(960, 870, 0.8, '#B85C3A');
  const open = a.k ? prog(lt, 0.2 * D, 0.4 * D) : 0;
  h += `<circle cx="960" cy="640" r="${f1(200 + Math.sin(t * 2) * 12)}" fill="url(#warm)" opacity="${a.k ? 1 : 0.6}"/>`;
  h += BU({ t, seed: 2050, x: 960, y: 880, s: 0.62, pose: '좌선', ex: a.k ? exprAt([[0, '잠'], [0.3 * D, '뿌듯']], lt) : exprAt([[0, '잠']], t), look: [0, 0] });
  if (!a.k) {
    h += pop(t, t - lt + 0.25 * D, t + 99, 1520, 330, label(0, 0, '보리수', { size: 40, bg: '#fff' }), { rot: 3 });
    h += pop(t, t - lt + 0.7 * D, t + 99, 420, 330, label(0, 0, '35세', { size: 52, bg: YEL }), { rot: -4 });
    return h;
  }
  h += particles(t, 2051, 26, [300, 200, 1320, 700], GOLD, { speed: 50, r: 7, op: 0.8 });
  h += pop(t, t - lt + 0.1, t + 99, 960, 140, big(0, 0, [[['붓다 = ', '#fff'], ['깨어난 사람', YEL]]], { size: 82, sw: 16 }), {});
  return h;
}

/* ---------- myth: not an empty mind ---------- */
function bmythScene(t, lt, a) {
  const D = D_(a);
  let h = BG(a.k ? '#E7F3EA' : '#F3E6E6') + BG('url(#paper)');
  h += `<rect x="-600" y="880" width="3120" height="600" fill="${a.k ? '#CFE3D3' : '#E6D2D2'}"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="6"/>`;
  h += cushionG(960, 880, 0.8);
  const thoughts = ['답장', '발표', '저녁 메뉴', '그 영상'];
  if (!a.k) {
    h += Z({ t, seed: 2060, x: 960, y: 900, s: 0.66, pose: '좌선', ex: exprAt([[0, '결심']], t), look: [0, -0.3], sweat: true, shiver: lt > 0.5 * D });
    thoughts.forEach((tx, i) => { const f = 0.12 + i * 0.13; if (lt > f * D) { const ang = -2.6 + i * 0.75, r = 330 + Math.sin(t * 3 + i) * 16; h += pop(t, t - lt + f * D, t + 99, f1(960 + Math.cos(ang) * r * 1.35), f1(520 + Math.sin(ang) * r * 0.62), cloudG(0, 0, 0.72, tx, { size: 54, w: 190 }), { wobble: 3 }); } });
    h += pop(t, t - lt + 0.05, t + 99, 960, 160, big(0, 0, [[['지금 여기 = ', '#fff'], ['생각 비우기?', YEL]]], { size: 66, sw: 13 }), {});
    if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 1500, 780, outlined(0, 0, ['✕'], { size: 200, sw: 22, fill: RED }), { rot: -6 });
    return h;
  }
  h += Z({ t, seed: 2061, x: 960, y: 900, s: 0.66, pose: '좌선', ex: exprAt([[0, '뿌듯']], t), look: [0.5, -0.5] });
  thoughts.forEach((tx, i) => {
    const ph = ((lt * 0.09 + i / 4) % 1), x = lerp(-200, 2120, ph), y = 330 + (i % 2) * 170 + Math.sin(t + i) * 10;
    h += cloudG(x, y, 0.7, tx, { size: 54, w: 190 });
    if (ph > 0.3 && ph < 0.72) h += label(x, y - 120, '아, 왔네', { size: 32, bg: MINT });
  });
  h += pop(t, t - lt + 0.05, t + 99, 960, 160, big(0, 0, [[['생각이 오는 걸 ', '#fff'], ['알아차리기', YEL]]], { size: 66, sw: 13 }), {});
  if (lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 1500, 760, outlined(0, 0, ['○'], { size: 200, sw: 22, fill: MINT }), { rot: 4 });
  return h;
}

/* ---------- title ---------- */
const LIST10 = ['한 번에 하나만', '두 번째 화살 쏘지 않기', '줄을 알맞게'];
titleScene = function (t, lt, a) {
  let h = BG('url(#labG)') + BG('url(#grid)');
  h += particles(t, 5, 40, [0, 0, 1920, 1080], MINT, { speed: 40, r: 4, op: 0.6 });
  if (a.list) {
    h += big(960, 130, ['만약에, 붓다처럼 \'지금 여기\'에 산다면?'], { size: 56, sw: 12, fill: YEL });
    LIST10.forEach((it, i) => {
      const at0 = 0.15 * (a._dur || 8) + i * 0.6; if (lt < at0) return;
      const k = easeOutBack(clamp((lt - at0) / 0.4, 0, 1)), y = 330 + i * 160;
      h += `<g opacity="${f1(clamp(k, 0, 1) * 100) / 100}" transform="translate(${f1(lerp(-120, 0, clamp(k, 0, 1)))} 0)">${label(330, y, (i + 1) + '일 차', { size: 44, bg: i === 2 ? YEL : MINT })}${T8(460, y + 20, it, { anchor: 'start', size: 62, fill: '#fff' })}</g>`;
    });
    h += `<ellipse cx="1620" cy="900" rx="220" ry="50" fill="url(#glow)"/>` + cushionG(1620, 900, 0.62);
    h += Z({ t, seed: 7, x: 1620, y: 910, s: 0.56, pose: '좌선', ex: exprAt([[0, '뿌듯']], lt), look: [-0.6, -0.2] });
    return h;
  }
  h += `<ellipse cx="960" cy="900" rx="320" ry="70" fill="url(#glow)"/><ellipse cx="960" cy="900" rx="260" ry="54" fill="#2E4260" stroke="${INK}" stroke-width="8"/>`;
  h += doctor(520, 960, 0.55, { t, expr: '미소', talk: env(t) });
  h += pop(t, t - lt + 0.2, t + 99, 960, 230, big(0, 0, [[['만약에, ', YEL], ['붓다처럼', '#fff']], '\'지금 여기\'에 산다면?'], { size: 88, sw: 18 }), {});
  const sit = 1.4, k = easeInOut(prog(lt, sit, sit + 0.5));
  h += cushionG(960, 890, 0.6, '#7A3E8E');
  h += Z({ t, seed: 7, x: 960, y: 890, s: 0.6, pose: mixPose('서기', '좌선', k), ex: exprAt([[0, '결심'], [sit + 0.4, '잠']], lt) });
  if (lt > sit + 0.4) h += pop(t, t - lt + sit + 0.4, t + 99, 1420, 700, label(0, 0, '지금 여기 실험 3일', { size: 40, bg: YEL }), { rot: 4, bob: 4 });
  return h;
};

/* ---------- day 1: one thing at a time ---------- */
function monkeyFull(x, y, s, t, o = {}) { // o.hang: hanging by one arm from (x, y - 230 s); otherwise sitting/standing at feet (x, y)
  const sw = o.hang ? Math.sin(t * 4) * 10 : 0;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s}) rotate(${f1(sw)} 0 ${o.hang ? -230 : 0})">`;
  h += `<path d="M30 -40 Q120 -30 110 -110 Q100 -150 70 -130" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M30 -40 Q120 -30 110 -110 Q100 -150 70 -130" fill="none" stroke="#9A6A44" stroke-width="9" stroke-linecap="round"/>`;
  const limb = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#9A6A44" stroke-width="12" stroke-linecap="round"/>`;
  h += limb(-24, -20, -34, 0) + limb(24, -20, 34, 0);
  h += o.hang ? limb(-30, -100, -10, -226) + limb(30, -100, 56, -60) : limb(-30, -100, -64, -50) + limb(30, -100, 64, -50);
  h += `<ellipse cx="0" cy="-70" rx="52" ry="60" fill="#9A6A44" stroke="${INK}" stroke-width="7"/><ellipse cx="0" cy="-60" rx="30" ry="38" fill="#F1D3B0"/>`;
  h += monkeyG(0, -170, 0.6, 0);
  if (o.hang) h += `<circle cx="-10" cy="-230" r="14" fill="#F1D3B0" stroke="${INK}" stroke-width="5"/>`;
  return h + `</g>`;
}
function chairBack(x) { return `<rect x="${x - 100}" y="430" width="200" height="300" rx="20" fill="#8A5A34" stroke="${INK}" stroke-width="8"/><rect x="${x - 76}" y="456" width="152" height="40" rx="10" fill="#A9744A"/>`; }
// the rice bowl sits right in front of Zero's spoon hand (Zero at 760/840, s .8 -> bowl at char x ≈ 405); kimchi moved to the old rice spot
const mealRice = () => bowlG(924, 702, 0.62, { kind: 'rice' });
function mealTable(t, o = {}) { let h = clothTable(400, 700, 1100, o.cloth || '#F4F1EA', o.band || '#5B8FD6'); h += mealRice() + kimchiG(1062, 692, 0.6) + bowlG(1180, 700, 0.5, { kind: 'soup', steam: 1, t, c: '#F4E9D0', band: '#B5763A' }); return h; }
function eater(t, seed, ex, look, slow = 1) {
  const zx = 760, zy = 840, zs = 0.8, rig = eatRig(Object.assign({ t, seed, x: zx, y: zy, s: zs }, eatCycle(t, 2.6 / slow)));
  let h = Z({ t, seed, x: zx, y: zy, s: zs, pose: rig.pose, ex, look });
  return { h, spoon: rig.spoon + mealRice() + rig.hand };
}
function bmealScene(t, lt, a) {
  const D = D_(a);
  if (a.taste) {
    let h = kitchen(t, false);
    const zx = 820, zy = 1060, zs = 1.25, rig = eatRig(Object.assign({ t, seed: 2101, x: zx, y: zy, s: zs }, eatBite(lt, 0.1 * D, 0.28 * D, 0.42 * D, 0.6 * D)));
    h += Z({ t, seed: 2101, x: zx, y: zy, s: zs, pose: rig.pose, ex: exprAt([[0, '기본'], [0.3 * D, '잠'], [0.7 * D, '신남']], lt), look: [0, 0.2] });
    const rice = bowlG(1076, 830, 1.0, { kind: 'rice' });
    h += clothTable(300, 820, 1320, '#F4F1EA', '#5B8FD6', 1480);
    h += rice + kimchiG(1460, 820, 0.9);
    h += rig.spoon + rice + rig.hand;
    if (lt > 0.42 * D) h += pop(t, t - lt + 0.42 * D, t + 99, 1150, 560, label(0, 0, '단맛', { size: 44, bg: '#fff' }), { rot: -4, bob: 3 });
    if (lt > 0.56 * D) h += pop(t, t - lt + 0.56 * D, t + 99, 1500, 640, outlined(0, 0, ['아삭!'], { size: 60, sw: 12, fill: '#FF8A5A' }), { rot: 6, bob: 4 });
    if (lt > 0.7 * D) h += particles(t, 2102, 14, [500, 200, 700, 400], YEL, { speed: 40, r: 7, op: 0.8 });
    if (lt > 0.72 * D) h += pop(t, t - lt + 0.72 * D, t + 99, 960, 180, big(0, 0, [[['처음 느낀 ', '#fff'], ['점심 맛', YEL]]], { size: 72, sw: 14 }), {});
    return h;
  }
  let h = kitchen(t, false) + chairBack(760);
  if (!a.k) {
    const put = prog(lt, 0.45 * D, 0.7 * D), zx = 760, zy = 840, zs = 0.8;
    h += Z({ t, seed: 2100, x: zx, y: zy, s: zs, pose: put < 1 ? '폰넣기' : '서기', ex: exprAt([[0, '결심'], [0.7 * D, '뿌듯']], lt), look: [0.8, 0.2] });
    h += mealTable(t);
    h += `<g transform="translate(1660 800)"><path d="M-110 -120 L110 -120 L130 80 L-130 80 Z" fill="#E0803A" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-60 -120 Q0 -220 60 -120" fill="none" stroke="${INK}" stroke-width="10"/><rect x="-60" y="-40" width="120" height="50" rx="10" fill="#F2A65A" stroke="${INK}" stroke-width="5"/></g>`;
    const [hx, hy] = handG(zx, zy, zs, P['폰넣기'].hR);
    if (put < 1) h += phone(lerp(hx, 1660, easeInOut(put)), lerp(hy, 700, easeInOut(put)), 0.34, { on: 1, rot: lerp(0, 20, put) });
    h += pop(t, t - lt + 0.05, t + 99, 520, 200, label(0, 0, '오늘의 규칙', { size: 36, bg: MINT }), { rot: -3 });
    h += pop(t, t - lt + 0.12 * D, t + 99, 960, 330, big(0, 0, [[['밥 먹을 땐, ', '#fff'], ['밥만', YEL]]], { size: 74, sw: 14 }), {});
    return h;
  }
  const ex = exprAt([[0, '기본'], [0.3 * D, '걱정']], lt);
  const e = eater(t, 2100, ex, lt > 0.3 * D ? [0.4, -0.7] : [0.3, 0.6]);
  h += e.h + mealTable(t) + e.spoon;
  ['①', '②', '③'].forEach((n, i) => { if (lt > (0.02 + i * 0.07) * D && lt < 0.3 * D) h += pop(t, t - lt + (0.02 + i * 0.07) * D, t - lt + 0.3 * D, 980 + i * 80, 560, outlined(0, 0, [n], { size: 54, sw: 10, fill: YEL }), {}); });
  const C = [[0.32, 470, 360, '답장해야 하는데'], [0.5, 960, 330, '내일 발표는…'], [0.68, 1450, 370, '아까 그 영상 뭐였지?']]; // low enough that the hopping monkey stays in frame
  C.forEach(([f, x, y, txt]) => { if (lt > f * D) h += pop(t, t - lt + f * D, t + 99, x, y, cloudG(0, 0, 0.8, txt, { size: 44, w: 230 }), { bob: 4 }); });
  // the monkey hops from cloud to cloud
  if (lt > 0.32 * D) {
    const seg = clamp((lt - 0.32 * D) / (0.18 * D), 0, 2.99), i = Math.floor(seg), f = easeInOut(seg - i), P0 = C[Math.min(i, 2)], P1 = C[Math.min(i + 1, 2)];
    const mx = lerp(P0[1], P1[1], f), my = lerp(P0[2], P1[2], f) - 90 - Math.sin(f * Math.PI) * 50;
    h += monkeyFull(mx, my, 0.56, t);
  }
  return h;
}
function jungle(t) {
  let h = BG('#CFE7C2') + BG('url(#paper)');
  for (let i = 0; i < 9; i++) h += `<path d="M${-100 + i * 240} 1100 L${-60 + i * 240} 0" stroke="#8FB57E" stroke-width="40" opacity=".5"/>`;
  for (let i = 0; i < 14; i++) h += `<path d="M${f1(hash(i * 3.7) * 1920)} ${f1(hash(i * 1.3) * 200 - 40)} q${f1(20 + Math.sin(t + i) * 6)} 120 0 ${f1(220 + hash(i) * 200)}" fill="none" stroke="#5E8C4E" stroke-width="7" stroke-linecap="round"/>`;
  return h;
}
const BRANCH = [[120, 330, 620, '답장'], [760, 230, 1240, '내일 발표'], [1340, 360, 1840, '그 영상'], [380, 600, 900, '저녁 메뉴'], [1060, 640, 1560, '주말 약속']];
function branchG(x1, y, x2, txt, t) {
  let h = `<path d="M${x1} ${y + 10} Q${(x1 + x2) / 2} ${y - 16} ${x2} ${y}" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M${x1} ${y + 10} Q${(x1 + x2) / 2} ${y - 16} ${x2} ${y}" fill="none" stroke="#7A5235" stroke-width="20" stroke-linecap="round"/>`;
  for (let i = 0; i < 5; i++) { const lx = lerp(x1 + 30, x2 - 30, i / 4); h += `<ellipse cx="${f1(lx)}" cy="${y - 24 + (i % 2) * 40}" rx="30" ry="16" transform="rotate(${(i % 2 ? 20 : -20) + Math.sin(t * 2 + i) * 6} ${f1(lx)} ${y})" fill="#6CAA5A" stroke="${INK}" stroke-width="4"/>`; }
  return h + label((x1 + x2) / 2, y + 70, txt, { size: 32, bg: '#fff' });
}
function bmonkeyScene(t, lt, a) {
  const D = D_(a);
  if (!a.k) {
    let h = jungle(t);
    BRANCH.forEach(([x1, y, x2, txt]) => h += branchG(x1, y, x2, txt, t));
    const order = [0, 1, 2, 4, 3, 0, 1], per = 1.25, seg = clamp(lt / per, 0, order.length - 1.001), i = Math.floor(seg), f = easeInOut(seg - i);
    const grab = j => { const b = BRANCH[order[j]]; return [lerp(b[0], b[2], 0.9), b[1] + 4]; }; // grab near the branch tip, clear of the label in the middle
    const [ax, ay] = grab(i), [bx, by] = grab(Math.min(i + 1, order.length - 1));
    const hx = lerp(ax, bx, f), hy = lerp(ay, by, f) - Math.sin(f * Math.PI) * 140;
    h += monkeyFull(hx + 10 * 0.8, hy + 230 * 0.8, 0.8, t, { hang: 1 });
    h += BU({ t, seed: 2110, x: 220, y: 930, s: 0.5, pose: sitP(), ex: exprAt([[0, '뿌듯']], t), look: [0.7, -0.6] });
    h += pop(t, t - lt + 0.1, t + 99, 330, 150, label(0, 0, '『상윳따 니카야』 12.61', { size: 30, bg: YEL }), {});
    h += pop(t, t - lt + 0.55 * D, t + 99, 1340, 860, big(0, 0, [[['가지를 놓자마자, ', '#fff'], ['또 다른 가지', YEL]]], { size: 52, sw: 11 }), {});
    return h;
  }
  let h = kitchen(t, false) + chairBack(760);
  const e = eater(t, 2111, exprAt([[0, '걱정'], [0.25 * D, '뿌듯']], lt), [-0.5, -0.4], 0.7);
  h += e.h + mealTable(t) + e.spoon;
  const back = easeInOut(prog(lt, 0.15 * D, 0.45 * D)), mx = lerp(1500, 640, back), my = lerp(260, 560, back) - Math.sin(back * Math.PI) * 160;
  h += monkeyFull(mx, my, 0.46, t);
  if (back < 1) h += cloudG(1500, 300, 0.7, '그 영상', { size: 46, w: 190, c: '#EEF2F6' });
  h += pop(t, t - lt + 0.2 * D, t + 99, 470, 230, bubble(0, 0, 470, 130, T8(0, 16, '아, 다른 가지로 갔네', { size: 40 }), { right: 1 }), { bob: 4 });
  if (lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 1300, 330, big(0, 0, [[['알아차리고 → ', '#fff'], ['돌아오기', YEL]]], { size: 60, sw: 12 }), {});
  return h;
}

/* ---------- day 1 study: a wandering mind ---------- */
function bwanderScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#labG)') + BG('url(#grid)');
  if (!a.k) {
    const n = Math.floor(clamp(lt / (0.4 * D), 0, 1) * 150);
    for (let i = 0; i < 150; i++) { const x = 160 + (i % 15) * 40, y = 330 + Math.floor(i / 15) * 50; h += `<circle cx="${x}" cy="${y}" r="12" fill="${i < n ? MINT : '#2E4260'}"/><rect x="${x - 10}" y="${y + 14}" width="20" height="14" rx="6" fill="${i < n ? MINT : '#2E4260'}"/>`; }
    h += pop(t, t - lt + 0.1, t + 99, 440, 250, label(0, 0, '2,250명', { size: 46, bg: YEL }), {});
    const ping = lt > 0.42 * D;
    let card = `<rect x="-50" y="-96" width="100" height="192" rx="12" fill="#F6F8FB"/>`;
    if (ping) card += `<rect x="-46" y="-80" width="92" height="56" rx="8" fill="#fff" stroke="#C9D3DF" stroke-width="2"/><rect x="-46" y="-14" width="92" height="56" rx="8" fill="#fff" stroke="#C9D3DF" stroke-width="2"/>`;
    h += phone(1320, 540, 3.1, { on: 1, content: card, glow: 0.6, lw: 3 });
    if (ping) {
      h += pop(t, t - lt + 0.45 * D, t + 99, 1320, 380, T8(0, 12, '지금 뭘 하고 있나요?', { size: 30 }), { noPop: true });
      h += pop(t, t - lt + 0.7 * D, t + 99, 1320, 584, T8(0, 12, '마음은 거기 있나요?', { size: 30, fill: '#C2185B' }), { noPop: true });
      const k = prog(lt, 0.42 * D, 0.5 * D); if (k < 1) h += `<circle cx="1300" cy="520" r="${f1(100 + 300 * k)}" fill="none" stroke="#fff" stroke-width="8" opacity="${f1((1 - k) * 100) / 100}"/>`;
    }
    h += pop(t, t - lt + 0.3 * D, t + 99, 1320, 920, label(0, 0, '하루 중 아무 때나 앱 알림', { size: 34, bg: '#fff' }), {});
    return h;
  }
  const k = easeOut(prog(lt, 0.15, 1.55)), v = 46.9 * k, R = 190, C = 2 * Math.PI * R;
  h += `<g transform="translate(560 520)"><circle r="${R}" fill="none" stroke="#2E4260" stroke-width="70"/><circle r="${R}" fill="none" stroke="${PINK}" stroke-width="70" stroke-dasharray="${f1(C * v / 100)} ${f1(C)}" transform="rotate(-90)"/>${T8(0, 20, v.toFixed(1) + '%', { size: 74, fill: '#fff' })}${T8(0, 76, '딴생각 중', { size: 34, fill: PINK })}</g>`;
  h += pop(t, t - lt + 0.3 * D, t + 99, 560, 240, label(0, 0, '거의 절반', { size: 42, bg: YEL }), {});
  if (lt > 0.55 * D) {
    const rows = [['지금 하는 일에 집중', 0.82, MINT, '신남'], ['딴생각 중', 0.58, PINK, '걱정']];
    rows.forEach(([nm, hv, c, ex], i) => { const y = 420 + i * 220, kk = easeOut(prog(lt, (0.58 + i * 0.08) * D, (0.75 + i * 0.08) * D)); h += Z({ t, seed: 2120 + i, x: 1060, y: y + 110, s: 0.28, ex: exprAt([[0, ex]], t) }) + T8(1130, y - 40, nm, { anchor: 'start', size: 36, fill: '#fff' }) + `<rect x="1130" y="${y}" width="${f1(560 * hv * kk)}" height="54" rx="27" fill="${c}" stroke="${INK}" stroke-width="5"/>`; });
    h += pop(t, t - lt + 0.6 * D, t + 99, 1400, 880, label(0, 0, '행복도 (평균)', { size: 30, bg: '#fff' }), {});
  }
  return h;
}

/* ---------- lesson cards: one lamp lit per day ---------- */
const LESSON10 = {
  1: ['행복은 다음 일이 아니라,', [['지금 하는 일', YEL], [' 안에', '#fff']]],
  2: ['아픔은 피할 수 없어도,', [['두 번째 화살', YEL], ['은 안 쏜다', '#fff']]],
  3: ['힘으로가 아니라,', [['알맞게 조율하기', YEL]]]
};
function blessonScene(t, lt, a) {
  const D = D_(a);
  let h = BG(NAVY) + BG('url(#grid)') + `<ellipse cx="960" cy="420" rx="700" ry="300" fill="url(#warm)" opacity=".18"/>`;
  h += `<rect x="-600" y="860" width="3120" height="600" fill="#132238"/><line x1="-600" y1="860" x2="2520" y2="860" stroke="${MINT}" stroke-opacity=".3" stroke-width="4"/>`;
  h += pop(t, t - lt + 0.05, t + 99, 960, 130, label(0, 0, a.n + '일 차 깨달음', { size: 40, bg: MINT }), {});
  h += pop(t, t - lt + 0.15, t + 99, 960, 330, big(0, 0, LESSON10[a.n], { size: 84, sw: 16, lh: 110 }), {});
  for (let i = 1; i <= 3; i++) {
    const x = 700 + (i - 1) * 260, lit = i < a.n ? 1 : (i === a.n ? easeOut(prog(lt, 0.3 * D, 0.6 * D)) : 0);
    h += diyaG(x, 840, 0.9, t, lit);
    h += T8(x, 930, i + '일 차', { size: 28, fill: lit > 0.5 ? YEL : '#5A6E8A' });
  }
  h += Z({ t, seed: 2130, x: 1600, y: 900, s: 0.6, pose: lt > 0.6 * D ? '만세' : '서기', ex: exprAt([[0, '결심'], [0.6 * D, '뿌듯']], lt), look: [-0.8, 0.2] });
  return h;
}

/* ---------- day 2: the subway and the arrows ---------- */
function platform(t, o = {}) {
  let h = BG('#E9EEF2') + `<rect x="-600" y="120" width="3120" height="80" fill="#5B8FD6" stroke="${INK}" stroke-width="6"/>` + T8(300, 176, '강남 방향', { size: 40, fill: '#fff' });
  for (let i = 0; i < 30; i++) h += `<line x1="${-600 + i * 110}" y1="200" x2="${-600 + i * 110}" y2="760" stroke="#D3DAE2" stroke-width="3"/>`;
  h += `<rect x="-600" y="760" width="3120" height="720" fill="#AEB6C0" stroke="${INK}" stroke-width="6"/><rect x="-600" y="770" width="3120" height="22" fill="${YEL}"/>`;
  if (o.train !== false) {
    const close = o.close == null ? 1 : o.close, tx = o.tx || 0;
    h += `<g transform="translate(${f1(tx)} 0)"><rect x="1080" y="300" width="1100" height="460" rx="40" fill="#DCE3EA" stroke="${INK}" stroke-width="9"/><rect x="1080" y="560" width="1100" height="40" fill="#3FA7A0"/>`;
    for (const wx of [1660, 1860]) h += `<rect x="${wx}" y="360" width="150" height="150" rx="16" fill="#9CC9DE" stroke="${INK}" stroke-width="6"/>`;
    const dw = 120 * close;
    h += `<rect x="1180" y="350" width="360" height="410" fill="#4A5570" stroke="${INK}" stroke-width="6"/><rect x="${1180}" y="350" width="${f1(60 + dw)}" height="410" fill="#C9D2DC" stroke="${INK}" stroke-width="6"/><rect x="${f1(1540 - 60 - dw)}" y="350" width="${f1(60 + dw)}" height="410" fill="#C9D2DC" stroke="${INK}" stroke-width="6"/></g>`;
  }
  return h;
}
function bsubwayScene(t, lt, a) {
  const D = D_(a);
  if (!a.k) {
    const close = easeInOut(prog(lt, 0.25 * D, 0.5 * D)), run = prog(lt, 0, 0.5 * D), zx = lerp(160, 900, easeOut(run));
    let h = platform(t, { close, tx: lt > 0.55 * D ? easeIn(prog(lt, 0.55 * D, D)) * 1500 : 0 });
    h += Z({ t, seed: 2140, x: zx, y: 900, s: 0.7, pose: run < 1 ? walkPose(t * 11, 1) : '손인사', ex: exprAt([[0, '결심'], [0.5 * D, '놀람'], [0.65 * D, '지침']], lt), look: [0.8, 0] });
    if (lt > 0.68 * D) {
      const k = easeIn(prog(lt, 0.68 * D, 0.8 * D)), tx = 1300, ty = 400;
      h += pop(t, t - lt + 0.66 * D, t + 99, tx, ty, targetG(0, 0, 0.75), {}) + arrowG(lerp(1800, tx + 40, k) + 160, lerp(220, ty, k) - 50, lerp(1800, tx + 40, k), lerp(220, ty, k));
      if (k >= 1) h += pop(t, t - lt + 0.8 * D, t + 99, tx, 240, label(0, 0, '첫 번째 화살', { size: 40, bg: YEL }), { rot: -4 }) + pop(t, t - lt + 0.8 * D, t + 99, tx, 560, label(0, 0, '지하철 놓침', { size: 32, bg: '#fff' }), {});
    }
    return h;
  }
  let h = platform(t, { train: false });
  const zx = 520, zs = 0.72;
  h += Z({ t, seed: 2141, x: zx, y: 900, s: zs, pose: '활', ex: exprAt([[0, '걱정'], [0.4 * D, '화남']], lt), look: [0.9, -0.1] });
  const [bx, by] = handG(zx, 900, zs, P['활'].hR);
  const tx = 1360, ty = 470;
  h += targetG(tx, ty, 0.9) + arrowG(tx - 230, ty - 20, tx - 30, ty + 6);
  const lines = ['왜 나는 맨날 이래', '지각하면 끝이야', '오늘 하루 망했다'], T = [0.3, 0.52, 0.74];
  let draw = 0;
  lines.forEach((ln, i) => {
    const t0 = T[i] * D, k = easeIn(prog(lt, t0, t0 + 0.35)), dy = [-50, 10, 60][i];
    if (lt < t0) { if (lt > t0 - 0.6) draw = Math.max(draw, prog(lt, t0 - 0.6, t0)); return; }
    h += arrowG(lerp(bx - 60, tx - 220, k), lerp(by, ty + dy, k), lerp(bx + 160, tx - 20, k), lerp(by, ty + dy, k), { f: PINK });
    if (k >= 1) h += pop(t, t - lt + t0 + 0.35, t + 99, 1690, 330 + i * 110, label(0, 0, ln, { size: 34, bg: '#fff' }), { rot: [-3, 2, -2][i] });
  });
  h += bowG(bx, by, zs * 0.9, 0, draw);
  h += pop(t, t - lt + 0.05, t + 99, 700, 300, big(0, 0, [[['머릿속 화살은 ', '#fff'], ['계속', YEL]]], { size: 60, sw: 12 }), {});
  return h;
}
function barrowScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#inkSky)') + BG('url(#paper)') + `<rect x="-600" y="880" width="3120" height="600" fill="#D9CDB0"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="6"/>`;
  h += bodhiG(330, 900, 0.42, t) + cushionG(330, 890, 0.5, '#B85C3A');
  h += BU({ t, seed: 2150, x: 330, y: 900, s: 0.5, pose: sitP(), ex: exprAt([[0, '뿌듯']], t), look: [0.8, -0.2] });
  h += pop(t, t - lt + 0.1, t + 99, 330, 160, label(0, 0, '『상윳따 니카야』 36.6', { size: 30, bg: YEL }), {});
  const tx = 1260, ty = 480;
  h += `<g transform="translate(${tx} ${ty})"><circle r="150" fill="#fff" stroke="${INK}" stroke-width="8"/>${heart(0, 30, 3.2, PINK)}</g>`;
  const k1 = easeIn(prog(lt, 0.2 * D, 0.32 * D));
  h += arrowG(lerp(560, tx - 260, k1), lerp(300, ty - 40, k1), lerp(760, tx - 60, k1), lerp(330, ty - 20, k1));
  if (k1 >= 1) h += pop(t, t - lt + 0.33 * D, t + 99, 900, 300, label(0, 0, '첫 번째 화살 · 아픔', { size: 38, bg: '#fff' }), { rot: -3 });
  if (!a.k) {
    if (lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 1260, 780, big(0, 0, [[['누구나 ', '#fff'], ['맞는다', YEL]]], { size: 64, sw: 13 }), {});
    return h;
  }
  const k2 = easeIn(prog(lt, 0.25 * D, 0.4 * D));
  h += arrowG(lerp(1700, tx + 260, k2), lerp(760, ty + 120, k2), lerp(1560, tx + 60, k2), lerp(700, ty + 40, k2), { f: PINK });
  if (k2 >= 1) h += pop(t, t - lt + 0.4 * D, t + 99, 1560, 820, label(0, 0, '두 번째 화살 · 내가 쏜 것', { size: 36, bg: PINK, color: '#fff' }), { rot: 3 });
  if (lt > 0.68 * D) h += pop(t, t - lt + 0.68 * D, t + 99, 1260, 170, big(0, 0, [[['한 번 아플 일을, ', '#fff'], ['두 번', YEL]]], { size: 60, sw: 12 }), {});
  return h;
}

/* ---------- the white bear ---------- */
function bearG(x, y, s, t) { const b = Math.sin(t * 3 + x) * 4; return `<g transform="translate(${f1(x)} ${f1(y + b)}) scale(${s})"><circle cx="-70" cy="-80" r="34" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="70" cy="-80" r="34" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="-70" cy="-80" r="14" fill="#F2C9D4"/><circle cx="70" cy="-80" r="14" fill="#F2C9D4"/><ellipse cx="0" cy="0" rx="110" ry="100" fill="#fff" stroke="${INK}" stroke-width="8"/><ellipse cx="0" cy="34" rx="44" ry="32" fill="#F4F1EA" stroke="${INK}" stroke-width="5"/><ellipse cx="0" cy="18" rx="16" ry="11" fill="${INK}"/><circle cx="-38" cy="-18" r="9" fill="${INK}"/><circle cx="38" cy="-18" r="9" fill="${INK}"/><path d="M-10 46 Q0 54 10 46" fill="none" stroke="${INK}" stroke-width="4"/></g>`; }
function bbearScene(t, lt, a) {
  const D = D_(a);
  let h = livingRoom(t, false) + sofa(1180, 640);
  h += `<g transform="translate(470 330)"><rect x="-170" y="-140" width="340" height="320" rx="16" fill="#fff" stroke="${INK}" stroke-width="8"/>${bearG(0, 0, 0.5, 0)}<circle r="96" fill="none" stroke="${RED}" stroke-width="16"/><line x1="-68" y1="-68" x2="68" y2="68" stroke="${RED}" stroke-width="16" stroke-linecap="round"/>${T8(0, 150, '흰곰 생각 금지!', { size: 34, fill: RED })}</g>`;
  const chartUp = a.k && lt >= 0.5 * D; // once the chart's backdrop is fully in, Zero and the bears are no longer drawn under it
  if (!chartUp) h += Z({ t, seed: 2160, x: 900, y: 920, s: 0.74, pose: '웅크림', ex: exprAt([[0, '결심'], [0.4 * D, '지침']], lt), look: [0, -0.2], shiver: lt > 0.3 * D, sweat: true });
  const spots = [[1500, 640, 0.5], [1250, 300, 0.45], [640, 720, 0.42], [1700, 360, 0.4], [300, 760, 0.4], [1100, 780, 0.38]];
  const nShow = a.k ? 6 : Math.min(3, Math.floor(prog(lt, 0.45 * D, D) * 3.99));
  if (!chartUp) for (let i = 0; i < nShow; i++) { const [x, y, s] = spots[i], t0 = a.k ? i * 0.06 * D : (0.45 + i * 0.17) * D; h += pop(t, t - lt + t0, t + 99, x, y, bearG(0, 0, s, t), { rot: (i % 2 ? 8 : -8) }); }
  if (!a.k) { if (nShow > 0) h += pop(t, t - lt + 0.45 * D, t + 99, 1500, 900, label(0, 0, '또 떠오름 ×' + nShow, { size: 34, bg: YEL }), {}); return h; }
  // result: those told to suppress thought of it more later
  h += `<rect x="-600" y="-600" width="3120" height="2280" fill="${NAVY}" opacity="${f1(easeOut(prog(lt, 0.35 * D, 0.5 * D)) * 0.97 * 100) / 100}"/>`;
  if (lt > 0.45 * D) {
    const k = easeOut(prog(lt, 0.5 * D, 0.8 * D)), bars = [['처음부터 생각해도', 230], ['참으라고 했던 사람들', 380]];
    bars.forEach(([nm, hv], i) => { const x = 700 + i * 520; h += `<rect x="${x - 110}" y="${f1(820 - hv * k)}" width="220" height="${f1(hv * k)}" rx="14" fill="${i ? PINK : '#7CC7FF'}" stroke="${INK}" stroke-width="6"/>` + T8(x, 880, nm, { size: 34, fill: '#fff' }); });
    h += `<line x1="460" y1="820" x2="1460" y2="820" stroke="#fff" stroke-width="5"/>` + T8(960, 300, '나중에 흰곰을 떠올린 횟수', { size: 40, fill: '#fff' });
    if (lt > 0.78 * D) h += pop(t, t - lt + 0.78 * D, t + 99, 1500, 360, label(0, 0, '오히려 더 많이', { size: 42, bg: YEL }), { rot: 4 });
  }
  return h;
}

/* ---------- name it, breathe, let it pass ---------- */
function bnameScene(t, lt, a) {
  const D = D_(a);
  if (!a.k) {
    let h = platform(t, { train: false });
    const zx = 820, zs = 0.74;
    h += Z({ t, seed: 2170, x: zx, y: 920, s: zs, ex: exprAt([[0, '화남'], [0.55 * D, '기본'], [0.85 * D, '뿌듯']], lt), look: [0, -0.6] });
    h += `<g transform="translate(${zx} ${f1(330 + Math.sin(t * 1.5) * 8)})">${cloudG(0, 0, 0.9, '짜증', { size: 60, w: 190, c: '#A9B3C2', fill: '#fff' })}</g>`;
    if (lt > 0.18 * D) h += pop(t, t - lt + 0.18 * D, t + 99, zx + 360, 250, label(0, 0, '아, 짜증이 왔구나', { size: 40, bg: MINT }), { rot: 3 });
    for (let i = 0; i < 3; i++) { const t0 = (0.55 + i * 0.14) * D; if (lt > t0) { const k = prog(lt, t0, t0 + 0.12 * D); h += `<circle cx="${zx}" cy="${f1(920 - 420 * zs * 0.6)}" r="${f1(90 + k * 130)}" fill="none" stroke="${MINT}" stroke-width="7" opacity="${f1((1 - k * 0.7) * 100) / 100}"/>`; h += pop(t, t - lt + t0, t + 99, 1260 + i * 120, 620, outlined(0, 0, ['숨 ' + (i + 1)], { size: 44, sw: 9, fill: MINT }), {}); } }
    return h;
  }
  let h = BG('url(#morning)') + `<circle cx="1600" cy="190" r="70" fill="#FFF3B0"/>` + clouds(t, 120, 10, 2, 41);
  h += `<path d="M-600 820 Q960 760 2520 820 L2520 1480 L-600 1480 Z" fill="#9BCF84" stroke="${INK}" stroke-width="7"/>` + grassField(t, 860, 24);
  const k = prog(lt, 0, D), cx = lerp(600, 1900, easeInOut(k)), op = 1 - prog(lt, 0.7 * D, D);
  h += `<g opacity="${f1(op * 100) / 100}">${cloudG(cx, 300, 0.95, '짜증', { size: 60, w: 190, c: '#C3CBD6', fill: '#fff' })}</g>`;
  h += Z({ t, seed: 2171, x: 560, y: 900, s: 0.72, ex: exprAt([[0, '뿌듯']], t), look: [0.7, -0.8] });
  h += pop(t, t - lt + 0.2 * D, t + 99, 1200, 620, big(0, 0, [[['잠시 머물다, ', '#fff'], ['지나간다', YEL]]], { size: 64, sw: 13 }), {});
  return h;
}

/* ---------- the group chat with no reply ---------- */
function chatUI(t, lt, D, o) {
  const msgs = [['민지', '이번 주 토요일 다들 시간 돼?', 0, '#FFD6E4'], ['준호', '난 돼! 몇 시?', 0.0, '#CDEBFF'], ['제로', '나도 낄래! 2시 어때?', 0.12, '#FFF3A8'], ['민지', 'ㅋㅋ 준호 지난번에 늦었잖아', 0.32, '#FFD6E4'], ['준호', '그건 지하철 때문ㅋㅋ', 0.5, '#CDEBFF']];
  let h = `<rect x="-300" y="-430" width="600" height="860" rx="60" fill="#1F2D44" stroke="${INK}" stroke-width="10"/><rect x="-270" y="-400" width="540" height="800" rx="36" fill="#B9D3E3"/><rect x="-270" y="-400" width="540" height="80" rx="36" fill="#8FB0C8"/>`;
  h += T8(0, -348, '우리 넷 (4)', { size: 34, fill: NAVY });
  let y = -280;
  msgs.forEach(([who, txt, f, c]) => {
    if (o.k === 0 && lt < f * D) return;
    const me = who === '제로', w = Math.min(500, txt.length * 33 + 50), x = me ? 255 - w : -255;
    if (!me) h += T8(x + 6, y - 6, who, { anchor: 'start', size: 22, fill: '#3A4A5E' });
    h += `<rect x="${x}" y="${y}" width="${w}" height="66" rx="20" fill="${c}" stroke="${INK}" stroke-width="3"/>` + T8(x + 18, y + 44, txt, { anchor: 'start', size: 31 });
    if (me) h += T8(x - 10, y + 56, '읽음 3', { anchor: 'end', size: 20, fill: '#5A6E8A' });
    y += me ? 96 : 116;
  });
  if (o.reply) { const w = 470; h += pop(t, o.reply, t + 99, 0, 0, T8(-244, y - 6, '민지', { anchor: 'start', size: 22, fill: '#3A4A5E' }) + `<rect x="-250" y="${y}" width="${w}" height="104" rx="20" fill="#FFD6E4" stroke="${INK}" stroke-width="3"/>` + T8(-232, y + 42, '미안, 회의 중이었어!', { anchor: 'start', size: 31 }) + T8(-232, y + 86, '2시 좋아!', { anchor: 'start', size: 31 }), { noPop: true, inDur: 0.25 }); }
  return h;
}
function bchatScene(t, lt, a) {
  const D = D_(a), k = a.k || 0;
  let h = BG('#F2F4F7') + `<path d="M-600 860 L2520 860 L2520 1480 L-600 1480 Z" fill="#DDE2EA"/><line x1="-600" y1="860" x2="2520" y2="860" stroke="${INK}" stroke-width="6"/>`;
  h += `<rect x="120" y="200" width="420" height="300" rx="14" fill="#fff" stroke="#C3CDD8" stroke-width="6"/>${T8(330, 270, '점심시간', { size: 40, fill: '#5A6E8A' })}<circle cx="330" cy="390" r="70" fill="#fff" stroke="${INK}" stroke-width="6"/><line x1="330" y1="390" x2="330" y2="340" stroke="${INK}" stroke-width="7"/><line x1="330" y1="390" x2="364" y2="390" stroke="${INK}" stroke-width="7"/>`;
  const zx = 600, zs = 0.74;
  const pose = k === 2 ? (lt > 0.25 * D ? '서기' : '활') : (k === 1 && lt > 0.62 * D ? '활' : '폰보기');
  const ex = k === 0 ? exprAt([[0, '신남'], [0.45 * D, '기본'], [0.7 * D, '걱정']], lt) : k === 1 ? exprAt([[0, '걱정'], [0.5 * D, '화남']], lt) : exprAt([[0, '기본'], [0.65 * D, '신남']], lt);
  h += Z({ t, seed: 2180, x: zx, y: 920, s: zs, pose, ex, look: k === 0 ? [0.3, 0.9] : [0.8, -0.2] });
  if (pose === '폰보기') { const [px, py] = handG(zx, 920, zs, [200, 318]); h += phone(px, py - 6, 0.38, { on: 1 }); }
  h += `<g transform="translate(1290 530) scale(0.94)">${chatUI(t, lt, D, { k, reply: k === 2 ? t - lt + 0.62 * D : 0 })}</g>`;
  if (k === 0 && lt > 0.75 * D) h += pop(t, t - lt + 0.75 * D, t + 99, 750, 300, label(0, 0, '내 메시지에만 답이 없다', { size: 34, bg: '#fff' }), { rot: -3 });
  if (k >= 1) {
    const tx = 860, ty = 330, hit = easeIn(prog(lt, 0.02 * D, 0.14 * D));
    h += targetG(tx, ty, 0.55);
    if (k === 1) h += arrowG(lerp(1180, tx - 20, hit) + 150, lerp(200, ty, hit) - 30, lerp(1180, tx - 20, hit), lerp(200, ty, hit));
    else h += arrowG(tx + 130, ty - 30, tx - 20, ty);
    if (k === 1 && hit >= 1) h += pop(t, t - lt + 0.14 * D, t + 99, 860, 150, label(0, 0, '따끔 · 첫 번째 화살', { size: 34, bg: YEL }), {});
  }
  if (k === 1) {
    if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 330, 640, bubble(0, 0, 420, 120, T8(0, 14, '다들 나 싫어하나?', { size: 38 }), { right: 1 }), { bob: 4 });
    if (lt > 0.62 * D) { const [bx, by] = handG(zx, 920, zs, P['활'].hR); h += bowG(bx, by, zs * 0.9, 0, prog(lt, 0.62 * D, 0.9 * D)) + arrowG(bx - 40, by, bx + 140, by, { f: PINK }); }
  }
  if (k === 2) {
    const drop = easeIn(prog(lt, 0.05 * D, 0.25 * D)), [bx, by] = handG(zx, 920, zs, P['활'].hR);
    h += bowG(lerp(bx, 420, drop), lerp(by, 840, drop), zs * 0.9, lerp(0, 80, drop), 0);
    h += pop(t, t - lt + 0.25 * D, t + 99, 330, 640, label(0, 0, '아, 서운함이 왔구나', { size: 36, bg: MINT }), { rot: -3 });
    if (lt > 0.62 * D) { const kk = prog(lt, 0.62 * D, 0.72 * D); if (kk < 1) h += `<circle cx="1340" cy="700" r="${f1(80 + 260 * kk)}" fill="none" stroke="${PINK}" stroke-width="8" opacity="${f1((1 - kk) * 100) / 100}"/>`; }
  }
  return h;
}

/* ---------- day 3: too tight ---------- */
function bgreedyScene(t, lt, a) {
  const D = D_(a);
  let h = livingRoom(t, false);
  const rules = ['명상 1시간', '폰 하루 종일 금지', '딴생각 금지', '자세 꼿꼿이', '커피 금지'];
  h += `<g transform="translate(330 420)"><rect x="-200" y="-260" width="400" height="520" rx="10" fill="#FFF8E8" stroke="${INK}" stroke-width="7"/>${T8(0, -200, '오늘의 규칙', { size: 40, fill: RED })}`;
  rules.forEach((r, i) => { h += T8(-160, -120 + i * 80, '□ ' + r, { anchor: 'start', size: 32 }); if (a.k && lt > (0.15 + i * 0.12) * D) h += outlined(150, -120 + i * 80, ['✕'], { size: 44, sw: 8, fill: RED }); });
  h += `</g>`;
  const slump = a.k ? easeInOut(prog(lt, 0.62 * D, 0.75 * D)) : 0;
  h += cushionG(1000, 880, 0.8);
  h += Z({ t, seed: 2190, x: 1000, y: 900, s: 0.7, pose: '좌선', rot: slump * 14, ex: a.k ? exprAt([[0, '결심'], [0.2 * D, '걱정'], [0.62 * D, '지침']], lt) : exprAt([[0, '결심']], t), look: [0, -0.2], sweat: !!a.k, shiver: a.k && lt < 0.62 * D });
  const secs = a.k ? 3600 - 60 - Math.floor(prog(lt, 0, 0.6 * D) * 467) : 3600 - Math.floor(lt * 2);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0'), ss = String(secs % 60).padStart(2, '0');
  h += timerG(1480, 300, mm + ':' + ss, { s: 1.3, ring: a.k ? RED : MINT, k: secs / 3600 });
  if (!a.k) { h += pop(t, t - lt + 0.3 * D, t + 99, 1000, 170, big(0, 0, [[['욕심', YEL], ['이 생긴다', '#fff']]], { size: 66, sw: 13 }), {}); return h; }
  if (lt > 0.1 * D && lt < 0.62 * D) for (let i = 0; i < 2; i++) h += `<path d="M${880 + i * 230} 860 l14 -24 l-12 -6 l16 -26" fill="none" stroke="${YEL}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (lt > 0.12 * D) h += pop(t, t - lt + 0.12 * D, t + 99, 1240, 790, label(0, 0, '다리 저림', { size: 32, bg: '#fff' }), {});
  if (lt > 0.25 * D && lt < 0.62 * D) h += pop(t, t - lt + 0.25 * D, t - lt + 0.62 * D, 1000, 200, outlined(0, 0, ['또 실패!'], { size: 64, sw: 12, fill: RED }), { wobble: 3 });
  if (lt > 0.72 * D) h += pop(t, t - lt + 0.72 * D, t + 99, 1460, 540, bubble(0, 0, 520, 130, T8(0, 16, '난 명상 체질이 아닌가 봐…', { size: 38 }), {}), { bob: 4 });
  return h;
}

/* ---------- Sona and the lute ---------- */
function veenaG(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s}) rotate(-20)"><circle cx="-170" cy="0" r="70" fill="#B5764A" stroke="${INK}" stroke-width="7"/><circle cx="170" cy="-10" r="56" fill="#B5764A" stroke="${INK}" stroke-width="7"/><rect x="-190" y="-22" width="400" height="34" rx="12" fill="#7A5235" stroke="${INK}" stroke-width="6"/>${[0, 1, 2, 3].map(i => `<line x1="-170" y1="${-14 + i * 6}" x2="240" y2="${-14 + i * 6}" stroke="#F4E9D0" stroke-width="2"/>`).join('')}${[0, 1, 2].map(i => `<rect x="${200 + i * 16}" y="-34" width="8" height="18" rx="3" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>`).join('')}</g>`; }
function bsonaScene(t, lt, a) {
  const D = D_(a);
  let h = forestBg(t, { sx: 300 });
  h += `<path d="M-600 900 Q960 870 2520 900" fill="none" stroke="#C9B98F" stroke-width="80" stroke-linecap="round"/>`;
  if (!a.k) {
    const sitK = prog(lt, 0.62 * D, 0.75 * D), ph = Math.sin(lt * 1.2), sx = 900 + ph * 380, dir = Math.cos(lt * 1.2) >= 0 ? 1 : -1;
    for (let i = 0; i < 10; i++) h += `<ellipse cx="${520 + i * 84}" cy="${900 + (i % 2) * 18}" rx="20" ry="10" fill="#A9936A" opacity=".7"/>`;
    const m = sitK > 0 ? MONK({ t, seed: 2200, x: 900, y: 900, s: 0.68, pose: '좌선', ex: exprAt([[0, '지침']], t), look: [0, 0.6] })
      : (dir > 0 ? MONK({ t, seed: 2200, x: sx, y: 900, s: 0.68, pose: walkPose(lt * 7, 0.5), ex: exprAt([[0, '결심'], [0.35 * D, '지침']], lt), look: [0.8, 0.3] }) : flip(sx, MONK({ t, seed: 2200, x: sx, y: 900, s: 0.68, pose: walkPose(lt * 7, 0.5), ex: exprAt([[0, '결심'], [0.35 * D, '지침']], lt), look: [0.8, 0.3] })));
    h += m;
    h += pop(t, t - lt + 0.08, t + 99, 900, 170, label(0, 0, '붓다의 제자 소나', { size: 42, bg: YEL }), {});
    h += pop(t, t - lt + 0.3 * D, t + 99, 1460, 330, label(0, 0, '발바닥이 갈라질 만큼 걷기 명상', { size: 34, bg: '#fff' }), { rot: 3 });
    if (lt > 0.78 * D) h += pop(t, t - lt + 0.78 * D, t + 99, 1240, 470, bubble(0, 0, 380, 120, T8(0, 14, '다 그만둘까…', { size: 40 }), {}), { bob: 4 });
    return h;
  }
  h += MONK({ t, seed: 2200, x: 640, y: 900, s: 0.68, pose: '좌선', ex: exprAt([[0, '지침'], [0.4 * D, '놀람']], lt), look: [0.8, -0.2] });
  const walk = prog(lt, 0, 0.25 * D), bx = lerp(1800, 1300, easeOut(walk));
  h += flip(bx, BU({ t, seed: 2201, x: bx, y: 900, s: 0.68, pose: walk < 1 ? walkPose(t * 6, 0.5) : '서기', ex: exprAt([[0, '뿌듯']], t), look: [0.8, -0.2] }));
  if (lt > 0.22 * D) h += pop(t, t - lt + 0.22 * D, t + 99, 0, 0, speech(1220, 200, 620, 120, '출가 전에 현악기를 잘 탔다지?', 1300, 560, { size: 38 }), { noPop: true, inDur: 0.3 });
  if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 960, 470, veenaG(0, 0, 0.62), {});
  if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 0, 0, speech(1220, 360, 660, 110, '줄이 너무 팽팽하면, 소리가 좋더냐?', 1300, 560, { size: 34 }), { noPop: true, inDur: 0.3 });
  return h;
}
function stringG(x, y, w, kind, t, k) { // kind: tight / loose / tuned ; k = 0..1 reveal
  let h = `<rect x="${x - 26}" y="${y - 50}" width="40" height="100" rx="10" fill="#7A5235" stroke="${INK}" stroke-width="6"/><rect x="${x + w - 14}" y="${y - 50}" width="40" height="100" rx="10" fill="#7A5235" stroke="${INK}" stroke-width="6"/>`;
  if (kind === 'tight') h += `<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="${RED}" stroke-width="4"/>` + (k > 0.5 ? `<path d="M${x + w / 2 - 30} ${y - 40} l20 30 l-14 4 l24 34" fill="none" stroke="${YEL}" stroke-width="7" stroke-linecap="round"/>` : '');
  if (kind === 'loose') h += `<path d="M${x} ${y} Q${x + w / 2} ${y + 130} ${x + w} ${y}" fill="none" stroke="#8A8F98" stroke-width="7"/>`;
  if (kind === 'tuned') { let d = `M${x} ${y}`; for (let i = 1; i <= 40; i++) d += ` L${f1(x + w * i / 40)} ${f1(y + Math.sin(i / 40 * Math.PI) * Math.sin(t * 30) * 14)}`; h += `<path d="${d}" fill="none" stroke="${GOLD}" stroke-width="7"/>`; }
  return h;
}
function bstringsScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#cream)') + BG('url(#paper)');
  const cols = [['너무 팽팽', 'tight', '들뜬다'], ['너무 느슨', 'loose', '게을러진다'], ['알맞게', 'tuned', '좋은 소리']];
  const T = a.k ? [0, 0, 0] : [0.0, 0.2, 0.52], V = [0.08, 0.38, 0.78];
  cols.forEach(([nm, kind, res], i) => {
    if (lt < T[i] * D) return;
    const cx = 380 + i * 580, k = a.k ? 1 : easeOutBack(clamp((lt - T[i] * D) / 0.4, 0, 1)); // L48 continues L47's panels: no re-entry
    let p = `<rect x="-250" y="-250" width="500" height="500" rx="26" fill="#fff" stroke="${INK}" stroke-width="7"/>` + label(0, -190, nm, { size: 40, bg: i === 2 ? YEL : '#E9EEF4' });
    p += stringG(-180, -40, 360, kind, t, a.k ? 1 : prog(lt, V[i] * D, V[i] * D + 0.3));
    if (a.k) {
      if (i === 0) p += Z({ t, seed: 2210, x: 0, y: 170, s: 0.3, ex: exprAt([[0, '겁먹음']], t), shiver: true, sweat: true });
      if (i === 1) p += Z({ t, seed: 2211, x: 30, y: 150, s: 0.3, rot: -88, ex: exprAt([[0, '졸림']], t) });
      if (i === 2) p += Z({ t, seed: 2212, x: 0, y: 170, s: 0.3, pose: '좌선', ex: exprAt([[0, '뿌듯']], t) });
      p += T8(0, 222, '→ ' + res, { size: 36, fill: i === 2 ? '#1F9D6B' : '#C2185B' });
    } else if (lt > V[i] * D) p += outlined(0, 150, [i === 2 ? '○' : '✕'], { size: 110, sw: 16, fill: i === 2 ? MINT : RED });
    if (!a.k && i === 2 && lt > V[2] * D) p += outlined(120, -90, ['♪'], { size: 70, sw: 10, fill: MINT });
    h += `<g transform="translate(${cx} 470) scale(${f1(clamp(k, 0, 1.2) * 1000) / 1000})">${p}</g>`;
  });
  // the source tag stays put across the L47 -> L48 cut; L48's headline comes in below the panels instead of replacing it
  h += a.k ? label(960, 120, '『앙굿따라 니카야』 6.55', { size: 32, bg: YEL }) : pop(t, t - lt + 0.05, t + 99, 960, 120, label(0, 0, '『앙굿따라 니카야』 6.55', { size: 32, bg: YEL }), {});
  if (a.k) h += pop(t, t - lt + 0.05, t + 99, 960, 828, big(0, 0, [[['마음을 쓰는 것', YEL], ['도 그렇단다', '#fff']]], { size: 64, sw: 13 }), {});
  return h;
}

/* ---------- 13 minutes, 8 weeks ---------- */
function bweeksScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#labG)') + BG('url(#grid)');
  if (!a.k) {
    const n = Math.floor(clamp(prog(lt, 0.2 * D, 0.95 * D), 0, 1) * 56);
    for (let w = 0; w < 8; w++) { h += T8(250, 330 + w * 66, (w + 1) + '주', { size: 28, fill: '#8FA6C8', anchor: 'end' }); for (let d = 0; d < 7; d++) { const i = w * 7 + d, x = 290 + d * 70, y = 300 + w * 66; h += `<rect x="${x}" y="${y}" width="58" height="50" rx="10" fill="${i < n ? MINT : '#1E3352'}" stroke="${INK}" stroke-width="3"/>`; if (i < n) h += `<path d="M${x + 16} ${y + 26} l10 10 l18 -20" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`; } }
    h += pop(t, t - lt + 0.05, t + 99, 540, 220, label(0, 0, '하루 13분 · 처음 해 보는 42명', { size: 36, bg: YEL }), {});
    h += timerG(1380, 420, '13:00', { s: 1.2, ring: MINT, k: 1 });
    h += cushionG(1380, 880, 0.6) + Z({ t, seed: 2220, x: 1380, y: 890, s: 0.5, pose: '좌선', ex: exprAt([[0, '잠']], t) });
    h += pop(t, t - lt + 0.5 * D, t + 99, 1380, 560, label(0, 0, '다른 그룹: 같은 시간 팟캐스트', { size: 28, bg: '#fff' }), {});
    return h;
  }
  h += `<line x1="200" y1="520" x2="1720" y2="520" stroke="#2E4260" stroke-width="14" stroke-linecap="round"/>`;
  const k = easeInOut(prog(lt, 0, 0.7 * D));
  h += `<line x1="200" y1="520" x2="${f1(lerp(200, 1720, k))}" y2="520" stroke="${MINT}" stroke-width="14" stroke-linecap="round"/>`;
  const card = (x, wk, lines, c, at0) => lt > at0 * D ? pop(t, t - lt + at0 * D, t + 99, x, 520, `<circle r="30" fill="${c}" stroke="${INK}" stroke-width="5"/>` + label(0, -90, wk, { size: 52, bg: c }) + panel(-300, 64, 600, 80 + lines.length * 70, { fill: '#fff' }) + lines.map((ln, i) => T8(0, 128 + i * 70, ln, { size: 46 })).join(''), {}) : '';
  h += card(560, '4주', ['뚜렷한 차이 없음'], '#C3CDD8', 0.15);
  h += card(1360, '8주', ['주의력 ↑ · 기억력 ↑', '기분 ↑ · 불안 ↓'], MINT, 0.45);
  h += pop(t, t - lt + 0.75 * D, t + 99, 960, 230, big(0, 0, [[['짧아도, ', '#fff'], ['꾸준히', YEL]]], { size: 76, sw: 15 }), {});
  return h;
}

/* ---------- three breaths, every day ---------- */
function bbreathScene(t, lt, a) {
  const D = D_(a);
  const ring = (cx, cy, t0) => { let g = ''; for (let i = 0; i < 3; i++) { const s0 = t0 + i * 0.12 * D; if (lt > s0) { const k = prog(lt, s0, s0 + 0.1 * D); g += `<circle cx="${cx}" cy="${cy}" r="${f1(70 + k * 110)}" fill="none" stroke="${MINT}" stroke-width="6" opacity="${f1((1 - k * 0.8) * 100) / 100}"/>`; } } return g; };
  let L = kitchen(t, false) + chairBack(560);
  L += Z({ t, seed: 2230, x: 560, y: 840, s: 0.7, pose: '합장', ex: exprAt([[0, '잠']], t) }) + clothTable(240, 700, 700) + bowlG(760, 702, 0.6, { kind: 'rice' });
  L += ring(560, 560, 0.05 * D) + label(480, 160, '밥 먹기 전', { size: 44, bg: MINT });
  let R = BG('#F2F4F7') + `<rect x="960" y="860" width="1600" height="600" fill="#DDE2EA"/><rect x="1480" y="260" width="300" height="600" fill="#8A6A4A" stroke="${INK}" stroke-width="9"/><circle cx="1740" cy="580" r="14" fill="${YEL}" stroke="${INK}" stroke-width="5"/><rect x="1530" y="320" width="200" height="70" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/>` + T8(1630, 368, '회의실', { size: 34 });
  R += Z({ t, seed: 2231, x: 1260, y: 900, s: 0.7, ex: exprAt([[0, '잠'], [0.8 * D, '결심']], lt) }) + ring(1260, 640, 0.4 * D) + label(1440, 160, '회의 전', { size: 44, bg: '#B9A7FF' });
  let h = `<g clip-path="url(#leftHalf)">${L}</g><g clip-path="url(#rightHalf)">${R}</g><line x1="960" y1="-600" x2="960" y2="1680" stroke="${INK}" stroke-width="12"/>`;
  if (lt > 0.72 * D) h += pop(t, t - lt + 0.72 * D, t + 99, 960, 330, big(0, 0, [[['숨 세 번 × ', '#fff'], ['매일', YEL]]], { size: 74, sw: 14 }), {});
  return h;
}

/* ---------- twist: Kisa Gotami ---------- */
function houseG(x, y, s, t, o = {}) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  h += `<rect x="-150" y="-220" width="300" height="220" fill="${o.night ? '#6E5A4A' : '#C9A27A'}" stroke="${INK}" stroke-width="7"/><path d="M-190 -200 L0 -360 L190 -200 Z" fill="${o.night ? '#5A4A30' : '#B8924A'}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  for (let i = 0; i < 5; i++) h += `<line x1="${-150 + i * 60}" y1="${-210 - i * 10 + (i > 2 ? (i - 2) * 30 : 0)}" x2="${-120 + i * 60}" y2="-206" stroke="${INK}" stroke-width="3" opacity=".35"/>`;
  h += `<path d="M-46 0 L-46 -120 Q0 -160 46 -120 L46 0 Z" fill="${o.open ? '#FFD27A' : '#4A3426'}" stroke="${INK}" stroke-width="6"/>`;
  const lit = o.lit == null ? 0 : o.lit;
  h += `<rect x="70" y="-170" width="60" height="60" rx="6" fill="${lit > 0 ? '#FFD27A' : (o.night ? '#22283E' : '#5A6A7A')}" stroke="${INK}" stroke-width="5"/>`;
  if (lit > 0) h += `<circle cx="100" cy="-140" r="${f1(90 * lit)}" fill="url(#warm)" opacity="${f1(lit * 0.8 * 100) / 100}"/>` + diyaG(96, -112, 0.28, t, lit);
  return h + `</g>`;
}
function villageBg(t, o = {}) {
  let h = BG(o.night ? 'url(#nightRoom)' : 'url(#dusk9)');
  if (o.night) for (let i = 0; i < 30; i++) h += `<circle cx="${f1(hash(i * 2.3) * 1920)}" cy="${f1(hash(i * 4.1) * 420)}" r="${2 + (i % 3)}" fill="#fff" opacity="${f1((0.4 + 0.5 * Math.abs(Math.sin(t * 1.2 + i))) * 100) / 100}"/>`;
  else h += `<circle cx="1640" cy="300" r="80" fill="#FFD27A"/><circle cx="1640" cy="300" r="230" fill="url(#warm)"/>`;
  h += mtnRange(560, o.night ? '#2A3260' : '#A9A3C8', false);
  h += `<rect x="-600" y="820" width="3120" height="660" fill="${o.night ? '#2B2F45' : '#C9B98F'}" stroke="${INK}" stroke-width="6"/>`;
  return h;
}
const HOUSES = [300, 720, 1140, 1560];
function shoesG(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-46 0 Q-50 -26 -20 -28 L-4 -28 Q4 -10 -6 4 L-40 6 Z" fill="#E2553A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M6 2 Q2 -24 32 -26 L48 -26 Q56 -8 46 6 L12 8 Z" fill="#E2553A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>`; }
function gotamiWalk(t, x, y, s, ex, look = [0.8, 0.2], walking = true) {
  const arms = { armL: P['받기'].armL, armR: P['받기'].armR, hL: P['받기'].hL, hR: P['받기'].hR };
  const pose = walking ? Object.assign({}, walkPose(t * 5, 0.4), arms) : Object.assign({}, P['서기'], arms);
  return GOT({ t, seed: 2300, x, y, s, pose, ex, look }) + shoesG(x + 12 * s, y + (352 - 560) * s - 8, s * 0.9);
}
function bgotamiScene(t, lt, a) {
  const D = D_(a);
  if (!a.k) {
    let h = BG('#0B1020') + `<circle cx="960" cy="560" r="${f1(330 + Math.sin(t * 2) * 12)}" fill="url(#warm)" opacity=".55"/>`;
    h += diyaG(960, 640, 1.7, t, 1);
    h += pop(t, t - lt + 0.1, t + 99, 960, 200, big(0, 0, ['붓다는 왜 이렇게까지', [["'지금'", YEL], ['을 말했을까?', '#fff']]], { size: 70, sw: 14, lh: 92 }), {});
    if (lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 960, 830, label(0, 0, '전해 내려오는 이야기 · 『법구경 주석서』', { size: 34, bg: '#fff' }), {});
    return h;
  }
  let h = villageBg(t);
  HOUSES.forEach((x, i) => h += houseG(x, 820, 0.8, t, { open: i === 3 && lt > 0.55 * D }));
  const walk = prog(lt, 0, 0.6 * D), gx = lerp(160, 1180, easeInOut(walk));
  h += gotamiWalk(t, gx, 900, 0.62, exprAt([[0, '걱정']], t), [0.8, 0.2], walk < 1);
  h += pop(t, t - lt + 0.12 * D, t + 99, 400, 300, label(0, 0, '젊은 엄마 고타미', { size: 40, bg: LOTUS }), { rot: -3 });
  if (lt > 0.55 * D) { h += flip(1560, VIL('#9CC0D8', { t, seed: 2301, x: 1560, y: 860, s: 0.55, ex: exprAt([[0, '걱정']], t), look: [0.8 + Math.sin(t * 6) * 0.4, 0.1] })); h += pop(t, t - lt + 0.62 * D, t + 99, 0, 0, speech(1560, 330, 380, 110, '약은 없어요…', 1540, 520, { size: 38 }), { noPop: true, inDur: 0.3 }); }
  return h;
}
function bseedScene(t, lt, a) {
  const D = D_(a);
  let h = villageBg(t);
  h += bodhiG(520, 840, 0.5, t) + cushionG(520, 830, 0.55, '#B85C3A');
  h += BU({ t, seed: 2310, x: 520, y: 840, s: 0.56, pose: sitP(), ex: exprAt([[0, '뿌듯']], t), look: [0.8, -0.1] });
  h += flip(1180, gotamiWalk(t, 1180, 880, 0.6, exprAt([[0, '걱정'], [0.75 * D, '놀람']], lt), [0.8, -0.2], false));
  h += pop(t, t - lt + 0.15 * D, t + 99, 0, 0, speech(1000, 170, 640, 110, '겨자씨 한 줌을 얻어 오너라.', 640, 520, { size: 38 }), { noPop: true, inDur: 0.3 });
  if (lt > 0.5 * D) h += pop(t, t - lt + 0.5 * D, t + 99, 0, 0, speech(1060, 330, 720, 110, '단, 아무도 죽은 적 없는 집에서.', 650, 540, { size: 38, bg: '#FFF3B0' }), { noPop: true, inDur: 0.3 });
  if (lt > 0.3 * D) { let g = `<circle r="130" fill="#FBF6EA" stroke="${INK}" stroke-width="7"/><path d="M-90 40 Q-80 -20 -20 -30 Q40 -40 90 0 Q70 70 0 76 Q-70 70 -90 40 Z" fill="#F1D3B0" stroke="${INK}" stroke-width="5"/>`; for (let i = 0; i < 18; i++) g += `<circle cx="${f1(-40 + hash(i * 3.1) * 90)}" cy="${f1(-6 + hash(i * 5.7) * 50)}" r="7" fill="#E8B83A" stroke="${INK}" stroke-width="2"/>`; h += pop(t, t - lt + 0.3 * D, t + 99, 1600, 560, g + label(0, -170, '겨자씨', { size: 34, bg: YEL }), {}); }
  return h;
}
function bvillageScene(t, lt, a) {
  const D = D_(a);
  let h = villageBg(t);
  if (!a.k) {
    const seg = clamp(lt / (D / 4), 0, 3.99), i = Math.floor(seg), f = seg - i, gx = lerp(HOUSES[i] - 170, HOUSES[i] - 90, easeOut(clamp(f * 3, 0, 1)));
    HOUSES.forEach((x, j) => { h += houseG(x, 820, 0.8, t, { open: j <= i }); if (j < i || (j === i && f > 0.4)) { h += VIL(['#9CC0D8', '#E0C27A', '#B9D3C4', '#D9A7C7'][j], { t, seed: 2320 + j, x: x + 10, y: 860, s: 0.42, pose: '내밀기', ex: exprAt([[0, '기본']], t), look: [-0.6, 0.2] }); h += pop(t, t - lt + (j + 0.45) * D / 4, t + 99, x, 470, label(0, 0, '겨자씨 ○', { size: 30, bg: '#fff' }), {}); } });
    h += gotamiWalk(t, gx, 900, 0.56, exprAt([[0, '결심']], t), [0.8, 0.1], f < 0.33);
    return h;
  }
  HOUSES.forEach((x, j) => h += houseG(x, 820, 0.8, t, { lit: easeOut(prog(lt, (0.05 + j * 0.12) * D, (0.2 + j * 0.12) * D)) }));
  const S2 = [[300, '우리 집도…'], [720, '작년에 할머니가…'], [1140, '우리도 그래요…'], [1560, '우리 아버지도…']];
  S2.forEach(([x, txt], j) => { const at0 = (0.08 + j * 0.12) * D; if (lt > at0) h += pop(t, t - lt + at0, t + 99, x, j % 2 ? 380 : 280, cloudG(0, 0, 0.82, txt, { size: 46, w: 220, c: '#FFF8E8' }), { bob: 3 }); });
  h += gotamiWalk(t, 960, 960, 0.62, exprAt([[0, '걱정'], [0.6 * D, '지침']], lt), [0, 0.2], false);
  if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 960, 570, label(0, 0, '단 한 곳도 없었다', { size: 44, bg: YEL }), {});
  return h;
}
function blampsScene(t, lt, a) {
  const D = D_(a);
  if (!a.k) {
    let h = villageBg(t, { night: 1 });
    HOUSES.forEach(x => h += houseG(x, 820, 0.8, t, { night: 1, lit: 1 }));
    const k = easeInOut(prog(lt, 0.15 * D, 0.5 * D));
    HOUSES.forEach((x, j) => { const wx = x + 80, wy = 820 - 112; h += `<path d="M${wx} ${wy} Q${f1((wx + 960) / 2)} ${f1(wy - 120)} ${f1(lerp(wx, 960, k))} ${f1(lerp(wy, 880, k))}" fill="none" stroke="#FFD27A" stroke-width="5" stroke-dasharray="10 12" opacity=".8"/>`; });
    h += `<circle cx="960" cy="880" r="${f1(160 + k * 120)}" fill="url(#warm)" opacity="${f1((0.4 + k * 0.5) * 100) / 100}"/>`;
    h += GOT({ t, seed: 2330, x: 960, y: 960, s: 0.6, pose: '좌선', ex: exprAt([[0, '지침'], [0.55 * D, '뿌듯']], lt), look: [0, -0.3] }) + diyaG(960, 930, 0.6, t, 1);
    if (lt < 0.6 * D) h += pop(t, t - lt + 0.1 * D, t - lt + 0.6 * D, 960, 150, big(0, 0, [[['이 슬픔은 ', '#fff'], ['나 혼자만의 것', YEL], ['이 아니구나', '#fff']]], { size: 56, sw: 12 }), {});
    else h += pop(t, t - lt + 0.6 * D, t + 99, 960, 150, big(0, 0, [[['모든 것은 ', '#fff'], ['변하고, 지나가는구나', YEL]]], { size: 60, sw: 12 }), {});
    return h;
  }
  let h = BG('#0B1020') + BG('url(#grid)').replace('/>', ' opacity=".3"/>');
  for (let i = 0; i < 9; i++) { const ph = (t * 0.18 + hash(i * 3.3)) % 1, lit = ph < 0.7 ? clamp(Math.sin(ph / 0.7 * Math.PI) * 1.6, 0, 1) : 0; h += diyaG(240 + i * 180, 820, 0.7, t, lit); }
  h += pop(t, t - lt + 0.1, t + 99, 960, 150, label(0, 0, '붓다의 마지막 말 · 『디가 니카야』 16', { size: 34, bg: '#fff' }), {});
  if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 960, 380, big(0, 0, [[['"모든 것은 ', '#fff'], ['변한다', YEL], ['.', '#fff']], [['게으르지 말고, ', '#fff'], ['깨어 있으라', YEL], ['."', '#fff']]], { size: 74, sw: 14, lh: 108 }), {});
  return h;
}

/* ---------- ending: dinner with the phone face down ---------- */
function bdinnerScene(t, lt, a) {
  const D = D_(a);
  if (a.k === 1) {
    let h = kitchen(t, true);
    const zx = 820, zy = 1060, zs = 1.25, rig = eatRig(Object.assign({ t, seed: 2401, x: zx, y: zy, s: zs }, eatBite(lt, 0.06 * D, 0.26 * D, 0.4 * D, 0.58 * D)));
    h += Z({ t, seed: 2401, x: zx, y: zy, s: zs, pose: rig.pose, ex: exprAt([[0, '기본'], [0.3 * D, '잠'], [0.6 * D, '신남']], lt), look: [0, 0.2], light: -1, shade: '#C9C0E8' });
    const soup = bowlG(1086, 830, 1.1, { kind: 'soup', steam: 1, t, c: '#8A5A34', band: '#5A3A22' });
    h += clothTable(300, 820, 1320, '#F2E6CC', '#B5763A', 1480) + soup;
    h += rig.spoon + soup + rig.hand;
    h += pop(t, t - lt + 0.2 * D, t + 99, 1180, 560, label(0, 0, '된장국', { size: 46, bg: '#fff' }), { rot: -3 });
    if (lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 960, 180, big(0, 0, [[['이번엔, ', '#fff'], ['기억난다', YEL]]], { size: 76, sw: 15 }), {});
    return h;
  }
  let h = kitchen(t, true) + chairBack(520) + chairBack(1360);
  const talk = Math.sin(t * 7) > 0 && (a.k ? lt > 0.6 * D : lt < 0.85 * D);
  h += MOM({ t, seed: 2402, x: 520, y: 840, s: 0.8, pose: talk ? '손인사' : '서기', ex: exprAt([[0, '신남']], t), look: [0.8, -0.1], light: -1, shade: '#C9C0E8' });
  const peek = a.k === 2 ? prog(lt, 0.05 * D, 0.2 * D) * (1 - prog(lt, 0.45 * D, 0.55 * D)) : 0;
  const lookUp = a.k === 2 && lt > 0.15 * D && lt < 0.5 * D;
  h += Z({ t, seed: 2403, x: 1360, y: 840, s: 0.8, ex: a.k === 2 ? exprAt([[0, '뿌듯'], [0.15 * D, '놀람'], [0.35 * D, '뿌듯']], lt) : exprAt([[0, '뿌듯']], t), look: lookUp ? [0.6, -0.9] : [-0.8, -0.1], light: -1, shade: '#C9C0E8' });
  if (peek > 0) h += `<defs><clipPath id="winClip10"><rect x="1384" y="144" width="352" height="272"/></clipPath></defs><g clip-path="url(#winClip10)">${monkeyG(1500, lerp(500, 340, peek), 0.42, t)}</g>`; // peeks in at the window
  h += clothTable(300, 700, 1320, '#F2E6CC', '#B5763A');
  h += bowlG(960, 700, 0.8, { kind: 'soup', steam: 1, t, c: '#8A5A34', band: '#5A3A22' }) + bowlG(700, 704, 0.5, { kind: 'rice' }) + bowlG(1220, 704, 0.5, { kind: 'rice' });
  h += phone(1480, 690, 0.32, { back: 1, rot: 90 });
  if (!a.k) {
    h += pop(t, t - lt + 0.3 * D, t + 99, 1690, 600, label(0, 0, '폰은 뒤집어 두고', { size: 34, bg: '#fff' }), { rot: 3 });
    if (lt > 0.1 * D) h += pop(t, t - lt + 0.1 * D, t + 99, 0, 0, speech(560, 200, 520, 110, '오늘 회사에서 있잖아…', 540, 420, { size: 36 }), { noPop: true, inDur: 0.3 });
    if (lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, 1240, 240, label(0, 0, '끝까지 듣기', { size: 40, bg: MINT }), {});
    return h;
  }
  if (lt > 0.4 * D) h += pop(t, t - lt + 0.4 * D, t + 99, 960, 200, big(0, 0, [[['알아차리고, ', '#fff'], ['다시 돌아오기', YEL]]], { size: 62, sw: 12 }), {});
  if (lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, 0, 0, speech(560, 330, 420, 110, '그래서 엄마가…', 540, 420, { size: 36 }), { noPop: true, inDur: 0.3 });
  return h;
}
function bmoonScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#nightRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".3"/>');
  h += windowNight(1040, 120, 640, 520, t);
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#1A2040"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/><rect x="1000" y="640" width="720" height="30" rx="8" fill="#8C6638" stroke="${INK}" stroke-width="6"/>`;
  h += `<ellipse cx="1360" cy="380" rx="420" ry="300" fill="url(#warm)" opacity=".25"/>`;
  const zx = 800, zs = 0.78;
  h += Z({ t, seed: 2410, x: zx, y: 920, s: zs, pose: '받기', ex: exprAt([[0, a.ask ? '신남' : '뿌듯']], t), look: a.ask ? [-0.3, -0.2] : [0.8, -0.6], light: 1, shade: '#C9C0E8' });
  const [hx, hy] = handG(zx, 920, zs, P['받기'].hR);
  h += `<g transform="translate(${f1(hx - 14)} ${f1(hy - 10)})"><path d="M-34 -40 L34 -40 L28 20 Q0 30 -28 20 Z" fill="#F4F1EA" stroke="${INK}" stroke-width="6"/><path d="M34 -24 Q56 -20 50 0 Q44 12 30 8" fill="none" stroke="${INK}" stroke-width="6"/>${[0, 1].map(i => `<path d="M${-12 + i * 20} ${f1(-56 - ((t * 20 + i * 9) % 30))} q8 -10 0 -20" fill="none" stroke="#fff" stroke-width="5" opacity=".7"/>`).join('')}</g>`;
  if (!a.ask) {
    h += pop(t, t - lt + 0.1, t + 99, 640, 220, big(0, 0, ['지금 이 순간도', '지나간다.'], { size: 70, sw: 14, lh: 92 }), {});
    if (lt > 0.5 * D) h += pop(t, t - lt + 0.5 * D, t + 99, 1360, 780, big(0, 0, [[['그래서, ', '#fff'], ['소중하다', YEL]]], { size: 80, sw: 15 }), {});
    return h;
  }
  h += pop(t, t - lt + 0.2, t + 99, 0, 0, speech(760, 260, 860, 140, "내가 '지금 여기'로 돌아온 순간은?", 760, 560, { size: 46 }), { noPop: true, inDur: 0.3 });
  h += pop(t, t - lt + 0.5 * D, t + 99, 1360, 780, label(0, 0, '댓글로 들려주세요', { size: 44, bg: MINT }), { rot: -3 });
  return h;
}
