/* ---------- experiment 013: does happiness need big events? — the night sky, clouds, stars and mom's 1998 notebook ---------- */
// Mom: short curly perm (dark brown, a few grey strands), dusty-rose cardigan. Dad: short grey hair, thin glasses, light-blue hospital gown.
// 1998 young mom: long straight black hair, yellow tee. Baby Zero: round head, orange onesie. Epicurus: grey-brown beard, chiton + sage-green himation.
const PERM13 = '#3B2C25', PERMB13 = '#3B2C26', GLS13 = '#ABC123';
function permCurls13(front) {
  // union of curls: draw every circle with a thick ink stroke first, then all fills on top
  const cs = [];
  if (front) {
    for (let k = 0; k <= 10; k++) { const an = Math.PI * (1.08 + 0.84 * k / 10); cs.push([200 + Math.cos(an) * 112, 162 + Math.sin(an) * 104, 30]); }
    [[136, 104, 24], [168, 94, 24], [200, 92, 25], [232, 94, 24], [264, 104, 24], [112, 128, 24], [288, 128, 24]].forEach(c => cs.push(c));
  } else {
    for (let k = 0; k < 5; k++) { cs.push([84 - (k > 2 ? 4 : 0), 132 + k * 30, 32]); cs.push([316 + (k > 2 ? 4 : 0), 132 + k * 30, 32]); }
    for (let k = 0; k <= 6; k++) { const an = Math.PI * (1.05 + 0.9 * k / 6); cs.push([200 + Math.cos(an) * 120, 156 + Math.sin(an) * 112, 30]); }
  }
  const c = front ? PERM13 : '#2E221D';
  let h = cs.map(([x, y, r]) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r + 5}" fill="${INK}"/>`).join('');
  if (front) h += `<path d="M90 150 Q86 66 200 60 Q314 66 310 150 Q296 116 252 108 Q200 120 148 108 Q104 116 90 150 Z" fill="${INK}" stroke="${INK}" stroke-width="10"/>`;
  h += cs.map(([x, y, r]) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${c}"/>`).join('');
  if (front) h += `<path d="M90 150 Q86 66 200 60 Q314 66 310 150 Q296 116 252 108 Q200 120 148 108 Q104 116 90 150 Z" fill="${c}"/>`;
  // little curl marks + a few grey strands
  if (front) h += `<g fill="none" stroke-linecap="round"><path d="M126 96 q10 -10 20 0 M186 84 q10 -10 20 0 M246 92 q10 -10 20 0 M100 132 q8 -10 18 -2 M282 132 q8 -10 18 -2" stroke="#5A463C" stroke-width="5"/><path d="M160 76 q18 -6 30 4 M230 78 q14 -4 24 6" stroke="#B9B0A8" stroke-width="4" opacity=".8"/></g>`;
  return h;
}
function perm13(svg) {
  return svg.replace(/<path d="M86 152 Q84 62 200 58[^"]*" fill="#3B2C25"[^>]*\/>/, permCurls13(true))
            .replace(/<path d="M86 160 Q80 56 200 50[^"]*" fill="#3B2C26"[^>]*\/>/, permCurls13(false));
}
function glasses13(svg, frame = '#3A3A3A') {
  const g = `<g fill="none" stroke="${frame}" stroke-width="6"><rect x="134" y="164" width="62" height="48" rx="18" fill="#DDEBF5" fill-opacity=".18"/><rect x="204" y="164" width="62" height="48" rx="18" fill="#DDEBF5" fill-opacity=".18"/><path d="M196 184 Q200 178 204 184 M134 180 L92 170 M266 180 L308 170" stroke-linecap="round"/></g>`;
  return svg.replace(/<path d="M198 222 Q182 212[^"]*" fill="none" stroke="#ABC123"[^>]*\/>/, g)
            .replace(/<path d="M192 262 Q200 284 208 262 Q200 268 192 262 Z" fill="#ABC123"[^>]*\/>/, '');
}
const OM = o => HALO(perm13(char(Object.assign({ goggles: 'none', vest: '#C7737E', patch: false, tee: true, vshade: 'rgba(80,0,20,0.22)', hair: PERM13, longHair: PERMB13 }, o))));
const AP = o => HALO(glasses13(char(Object.assign({ goggles: 'none', vest: '#9EC3DE', patch: false, tee: true, vshade: 'rgba(0,40,90,0.2)', hair: '#5E5A55', pencil: GLS13 }, o))));
const YM = o => HALO(char(Object.assign({ goggles: 'none', vest: '#F2D16B', patch: false, tee: true, vshade: 'rgba(120,80,0,0.2)', hair: '#1F1A17', longHair: '#1F1A17' }, o)));
const EPI = o => char(Object.assign({ goggles: 'none', vest: '#F1ECE0', patch: false, tee: true, vshade: 'rgba(0,0,0,0.12)', beard: '#7A6E64', hair: '#7A6E64', toga: '#8FB3A8' }, o));
function baby13(x, y, s, t, o = {}) { // baby Zero sitting; (x, y) = bottom centre
  const bob = o.still ? 0 : Math.sin(t * 2.2) * 3, sl = o.sleep;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})">`;
  h += `<ellipse cx="0" cy="4" rx="120" ry="16" fill="#000" opacity=".18"/>`;
  h += `<g stroke="${INK}" stroke-width="8" stroke-linejoin="round">`;
  h += `<ellipse cx="-58" cy="-14" rx="44" ry="26" fill="#FF9A55"/><ellipse cx="58" cy="-14" rx="44" ry="26" fill="#FF9A55"/>`;
  h += `<path d="M-86 -150 Q0 -180 86 -150 L94 -20 Q0 0 -94 -20 Z" fill="#FF9A55"/>`;
  h += `<circle cx="-96" cy="-14" r="20" fill="#fff"/><circle cx="96" cy="-14" r="20" fill="#fff"/>`;
  h += `<path d="M-80 -130 Q-120 -96 -104 -70" fill="none" stroke-width="22" stroke-linecap="round"/><path d="M80 -130 Q120 -96 104 -70" fill="none" stroke-width="22" stroke-linecap="round"/>`;
  h += `</g><path d="M-80 -130 Q-120 -96 -104 -70" fill="none" stroke="#FF9A55" stroke-width="8" stroke-linecap="round"/><path d="M80 -130 Q120 -96 104 -70" fill="none" stroke="#FF9A55" stroke-width="8" stroke-linecap="round"/>`;
  h += `<circle cx="-104" cy="-66" r="18" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="104" cy="-66" r="18" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
  h += `<g transform="translate(0 ${f1(-250 + bob)})"><circle r="104" fill="#fff" stroke="${INK}" stroke-width="8"/><path d="M-12 -100 Q-4 -126 14 -116 Q26 -108 14 -98" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  if (sl) h += `<path d="M-50 4 Q-36 14 -22 4 M22 4 Q36 14 50 4" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`;
  else h += `<ellipse cx="-36" cy="0" rx="10" ry="13" fill="${INK}"/><ellipse cx="36" cy="0" rx="10" ry="13" fill="${INK}"/><circle cx="-33" cy="-5" r="3.5" fill="#fff"/><circle cx="39" cy="-5" r="3.5" fill="#fff"/>`;
  h += `<ellipse cx="-62" cy="30" rx="16" ry="9" fill="#FF9BB0" opacity=".8"/><ellipse cx="62" cy="30" rx="16" ry="9" fill="#FF9BB0" opacity=".8"/>`;
  h += sl ? `<path d="M-10 40 Q0 46 10 40" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` : `<path d="M-18 36 Q0 56 18 36" fill="#FF8A8A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  return h + '</g></g>';
}
if (!P['안기']) P['안기'] = Object.assign({ armL: [[148, 285], [134, 340], [176, 360]], hL: [184, 362], armR: [[252, 285], [266, 340], [224, 360]], hR: [216, 362] }, LEGS);
if (!P['어깨']) P['어깨'] = Object.assign({ armL: [[148, 285], [98, 304], [82, 264]], hL: [78, 256], armR: [[252, 285], [302, 304], [318, 264]], hR: [322, 256] }, LEGS);
if (!P['내밀기']) P['내밀기'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [318, 300], [380, 292]], hR: [388, 290] }, LEGS);
if (!P['받기']) P['받기'] = Object.assign({ armL: [[148, 285], [150, 344], [186, 352]], hL: [192, 352], armR: [[252, 285], [272, 344], [236, 352]], hR: [230, 352] }, LEGS);
if (!P['전화']) P['전화'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [322, 262], [324, 206]], hR: [322, 198] }, LEGS);
if (!P['가리키기']) P['가리키기'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [312, 330], [370, 360]], hR: [378, 364] }, LEGS);

Object.assign(CAMS, {
  mhook: [1.0, 1.06, 960, 520], mtext: [1.0, 1.04, 960, 520], mcall: [1.0, 1.06, 960, 560], mcal: [1.0, 1.04, 960, 520], mlab: [1.0, 1.05, 960, 540],
  mtitle: [1.0, 1.04, 960, 520], mward: [1.1, 1.16, 900, 600], mdiary: [1.0, 1.04, 960, 520], mcloud: [1.0, 1.04, 960, 520], mbad: [1.0, 1.03, 960, 520],
  mwake: [1.12, 1.2, 980, 620], mstudy: [1.0, 1.03, 960, 520], mask: [1.0, 1.05, 960, 540], mthu: [1.06, 1.12, 960, 600], mfri: [1.08, 1.13, 1000, 620],
  mhome: [1.0, 1.08, 960, 560], mbook: [1.0, 1.05, 960, 520], mgive: [1.12, 1.18, 960, 620], mmorn: [1.12, 1.18, 980, 620], mend: [1.0, 1.04, 960, 500],
  mrecap: [1.0, 1.03, 960, 520]
});
const D13 = a => a._dur || 5;
const HANDF = `'Nanum Pen Script', ${FONT}`;
const hand13 = (x, y, txt, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${o.anchor || 'start'}" font-family="${HANDF}" font-weight="700" font-size="${o.size || 56}" fill="${o.fill || '#2B3A55'}"${o.op != null ? ` opacity="${o.op}"` : ''}${o.rot ? ` transform="rotate(${o.rot} ${f1(x)} ${f1(y)})"` : ''}>${esc(txt)}</text>`;
function fracOf13(t, phrase) { const l = TL.lines[lineIdx12(t)]; if (!l || !l.sub) return 0; const i = l.sub.indexOf(phrase); return i < 0 ? 0 : i / Math.max(1, l.sub.length); }
function typeK13(lines, k) { return typeLines(lines, k); }

/* ---------- the metaphor: night sky, clouds, stars, constellation ---------- */
function starPath13(r) { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.46 : r; d += (i ? 'L' : 'M') + f1(Math.cos(a) * rr) + ' ' + f1(Math.sin(a) * rr); } return d + 'Z'; }
function star13(x, y, r, t, k = 1, seed = 1, o = {}) {
  if (k <= 0.01) return '';
  const tw = 1 + 0.08 * Math.sin(t * 2.6 + seed * 1.7), pk = easeOutBack(clamp(k, 0, 1)), rr = r * pk * tw;
  let h = `<g transform="translate(${f1(x)} ${f1(y)})">`;
  h += `<circle r="${f1(rr * (o.big ? 4.2 : 3.0))}" fill="url(#warm)" opacity="${f1(clamp(k, 0, 1) * (o.big ? 0.95 : 0.7) * 100) / 100}"/>`;
  if (k < 1) h += `<circle r="${f1(r * 4 * k)}" fill="none" stroke="#FFF6C8" stroke-width="${f1(6 * (1 - k))}" opacity="${f1((1 - k) * 100) / 100}"/>`;
  h += `<path d="${starPath13(rr)}" fill="${o.c || '#FFE680'}" stroke="${INK}" stroke-width="${f1(Math.max(2, rr * 0.16))}" stroke-linejoin="round" transform="rotate(${f1(Math.sin(t * 0.7 + seed) * 6)})"/>`;
  h += `<circle cx="${f1(-rr * 0.18)}" cy="${f1(-rr * 0.2)}" r="${f1(rr * 0.14)}" fill="#fff" opacity=".85"/>`;
  return h + '</g>';
}
function skyBg13(t, o = {}) {
  let h = `<defs><linearGradient id="sky13" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070C22"/><stop offset=".6" stop-color="#141E46"/><stop offset="1" stop-color="#28305E"/></linearGradient>
  <linearGradient id="sky13b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1230"/><stop offset="1" stop-color="#3A3F78"/></linearGradient></defs>`;
  h += BG(o.alt ? 'url(#sky13b)' : 'url(#sky13)');
  const n = o.n == null ? 60 : o.n;
  for (let i = 0; i < n; i++) { const x = -300 + hash(i * 1.3 + 7) * 2520, y = -400 + hash(i * 2.9 + 3) * (o.h || 1100); h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.4 + hash(i * 5.1) * 2.4)}" fill="#fff" opacity="${f1((0.18 + 0.5 * Math.abs(Math.sin(t * (0.6 + hash(i) * 1.4) + i))) * (o.dim == null ? 1 : o.dim) * 100) / 100}"/>`; }
  return h;
}
function cloud13(x, y, s, t, o = {}) { // big near cloud (worry); o.c fill, o.op
  const cs = o.shape || [[-260, 30, 120], [-120, -40, 150], [60, -70, 170], [230, -20, 140], [340, 50, 100], [-360, 80, 80], [140, 70, 130], [-60, 70, 130]];
  const dr = Math.sin(t * 0.5 + (o.seed || 0)) * 10;
  let h = `<g transform="translate(${f1(x + dr)} ${f1(y)}) scale(${f1(s * 1000) / 1000})" opacity="${f1((o.op == null ? 1 : o.op) * 100) / 100}">`;
  h += cs.map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r + 9}" fill="${INK}"/>`).join('');
  h += cs.map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${o.c || '#3C4260'}"/>`).join('');
  h += cs.slice(0, 5).map(([cx, cy, r]) => `<path d="M${cx - r * 0.6} ${cy - r * 0.35} Q${cx - r * 0.1} ${cy - r * 0.8} ${cx + r * 0.45} ${cy - r * 0.5}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".12"/>`).join('');
  if (o.rain) for (let i = 0; i < 9; i++) { const ph = (t * 1.3 + hash(i)) % 1, rx = -300 + i * 75; h += `<line x1="${rx}" y1="${f1(120 + ph * 260)}" x2="${rx - 10}" y2="${f1(150 + ph * 260)}" stroke="#9FB4D8" stroke-width="6" stroke-linecap="round" opacity="${f1((1 - ph) * 0.8 * 100) / 100}"/>`; }
  return h + '</g>';
}
// constellation: dad, Zero, mom holding hands; sky coords 0..1600 x 0..400; day = the night the star is lit (1 = Mon ... 7 = Sun)
const FIG13 = { F: 330, Z: 800, M: 1270 };
const FP13 = cx => ({ head: [cx, 50], chest: [cx, 150], hL: [cx - 125, 200], hR: [cx + 125, 200], fL: [cx - 72, 340], fR: [cx + 72, 340] });
const STARDEF13 = [
  ['F', 'fL', 1], ['M', 'hR', 1], ['Z', 'head', 1],
  ['F', 'head', 2], ['M', 'fR', 2], ['Z', 'fL', 2],
  ['F', 'chest', 3], ['M', 'chest', 3], ['Z', 'chest', 3],
  ['F', 'hL', 4], ['Z', 'hR', 4], ['M', 'head', 4], ['X', [565, 70], 4], ['Z', 'fR', 4],
  ['F', 'hR', 5], ['M', 'fL', 5],
  ['Z', 'hL', 6],
  ['F', 'fR', 7], ['M', 'hL', 7], ['X', [1040, 330], 7]];
const STARS13 = STARDEF13.map(([f, p, d], i) => { const xy = f === 'X' ? p : FP13(FIG13[f])[p]; return { x: xy[0], y: xy[1], day: d, f, p, big: d === 3, i }; });
const DAYIDX13 = d => STARS13.filter(s => s.day === d).map(s => s.i);
const EDGES13 = (() => { const e = []; for (const f of ['F', 'Z', 'M']) for (const p of ['head', 'hL', 'hR', 'fL', 'fR']) e.push([f + 'chest', f + p]); e.push(['FhR', 'ZhL'], ['ZhR', 'MhL']); return e; })();
const SID13 = key => STARS13.find(s => s.f + s.p === key);
// lit fraction for star i, given the current day and how far tonight's stars have come (kDay 0..1)
function litOf13(i, day, kDay) { const s = STARS13[i]; if (s.day < day) return 1; if (s.day > day) return 0; const L = DAYIDX13(day), j = L.indexOf(i); return clamp(kDay * L.length - j, 0, 1); }
function constellation13(ox, oy, sc, t, day, kDay, o = {}) {
  let h = `<g transform="translate(${f1(ox)} ${f1(oy)}) scale(${f1(sc * 1000) / 1000})">`;
  const lk = o.lines || 0;
  if (lk > 0) EDGES13.forEach(([a, b], n) => { const A = SID13(a), B = SID13(b); const k = clamp(lk * EDGES13.length - n * 0.7, 0, 1); if (k <= 0) return;
    const x2 = lerp(A.x, B.x, k), y2 = lerp(A.y, B.y, k); h += `<line x1="${A.x}" y1="${A.y}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="#FFF3B8" stroke-width="7" stroke-linecap="round" opacity=".85"/><line x1="${A.x}" y1="${A.y}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="#FFE680" stroke-width="18" stroke-linecap="round" opacity=".18"/>`; });
  if (lk > 0.6) STARS13.filter(s => s.p === 'head').forEach(s => { h += `<circle cx="${s.x}" cy="${s.y}" r="46" fill="none" stroke="#FFF3B8" stroke-width="5" opacity="${f1(clamp((lk - 0.6) / 0.4, 0, 1) * 0.8 * 100) / 100}"/>`; });
  STARS13.forEach((s, i) => { const k = o.all ? 1 : litOf13(i, day, kDay); h += star13(s.x, s.y, (s.big ? 30 : 20) * (o.r || 1), t, k, i * 3.3 + 1, { big: s.big }); });
  return h + '</g>';
}
// how far tonight's stars are, for a line: stars appear at the given phrases of the line's text
function kByPhrases13(t, lt, a, phrases) { const D = D13(a); let n = 0; phrases.forEach(p => { const at = fracOf13(t, p) * D + 0.4; n += clamp((lt - at) / 0.6, 0, 1); }); return n / phrases.length; }

/* ---------- places ---------- */
function hospRoom13(t, o = {}) {
  let h = `<defs><linearGradient id="ward13" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.night ? '#2B3550' : '#E3EEE9'}"/><stop offset="1" stop-color="${o.night ? '#36405E' : '#D3E3DD'}"/></linearGradient></defs>`;
  h += BG('url(#ward13)') + BG('url(#hatch)').replace('/>', ' opacity=".18"/>');
  h += `<rect x="-600" y="640" width="3120" height="240" fill="${o.night ? '#2E3854' : '#C4D8D1'}"/><line x1="-600" y1="640" x2="2520" y2="640" stroke="${INK}" stroke-width="5" opacity=".5"/>`;
  const wx = o.wx == null ? 1180 : o.wx;
  if (o.night) h += windowNight(wx, 150, 460, 340, t);
  else if (o.sunset) { h += `<rect x="${wx}" y="150" width="460" height="340" rx="12" fill="url(#sunset)" stroke="${INK}" stroke-width="10"/><circle cx="${wx + 300}" cy="400" r="60" fill="#FFC56B"/><circle cx="${wx + 300}" cy="400" r="200" fill="url(#warm)" opacity=".6"/><rect x="${wx}" y="420" width="460" height="70" fill="#5A4E7A" opacity=".7"/><line x1="${wx + 230}" y1="150" x2="${wx + 230}" y2="490" stroke="${INK}" stroke-width="8"/><line x1="${wx}" y1="320" x2="${wx + 460}" y2="320" stroke="${INK}" stroke-width="8"/>`; }
  else h += windowDay(wx, 150, 460, 340, t);
  h += `<line x1="-100" y1="70" x2="${wx - 40}" y2="70" stroke="#8C9AA6" stroke-width="10" stroke-linecap="round"/>`;
  if (o.curtain !== false) h += `<path d="M${o.cx || 40} 70 L${(o.cx || 40) + 170} 70 Q${(o.cx || 40) + 150} 470 ${(o.cx || 40) + 190} 880 L${(o.cx || 40) - 20} 880 Q${(o.cx || 40) + 10} 470 ${o.cx || 40} 70 Z" fill="${o.night ? '#4D6A80' : '#A9D2C8'}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M${(o.cx || 40) + 60} 90 Q${(o.cx || 40) + 50} 480 ${(o.cx || 40) + 70} 870 M${(o.cx || 40) + 120} 90 Q${(o.cx || 40) + 104} 480 ${(o.cx || 40) + 130} 870" fill="none" stroke="${INK}" stroke-width="3" opacity=".25"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="${o.night ? '#262E46' : '#B7C4C7'}"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  if (o.night) h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#0A1024" opacity=".25"/>`;
  return h;
}
function bed13(x, y, s, o = {}) { // hospital bed seen from the side, head end on the left; (x, y) = floor centre; returns {svg, top}
  const top = y - 300 * s;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})">`;
  h += `<ellipse cx="0" cy="4" rx="420" ry="26" fill="#000" opacity=".2"/>`;
  h += `<g stroke="${INK}" stroke-width="7" stroke-linejoin="round">`;
  h += `<rect x="-360" y="-240" width="720" height="40" rx="10" fill="#C9D3DC"/>`;
  h += `<rect x="-340" y="-200" width="18" height="170" fill="#9AA6B2"/><rect x="322" y="-200" width="18" height="170" fill="#9AA6B2"/>`;
  h += `<circle cx="-330" cy="-18" r="20" fill="#5B6573"/><circle cx="330" cy="-18" r="20" fill="#5B6573"/>`;
  h += `<rect x="-400" y="-470" width="34" height="270" rx="10" fill="#E9EEF3"/><rect x="368" y="-380" width="30" height="180" rx="10" fill="#E9EEF3"/>`;
  h += `<rect x="-370" y="-300" width="740" height="64" rx="22" fill="#FFFFFF"/>`;
  h += `</g>`;
  if (o.rail !== false) h += `<g stroke="${INK}" stroke-width="5"><rect x="-120" y="-330" width="280" height="64" rx="10" fill="none"/><line x1="-80" y1="-330" x2="-80" y2="-266"/><line x1="-30" y1="-330" x2="-30" y2="-266"/><line x1="20" y1="-330" x2="20" y2="-266"/><line x1="70" y1="-330" x2="70" y2="-266"/><line x1="120" y1="-330" x2="120" y2="-266"/></g>`;
  return { svg: h + '</g>', top };
}
function blanket13(x0, x1, y, s, c = '#F2F5F8') { return `<path d="M${f1(x0)} ${f1(y - 20 * s)} Q${f1((x0 + x1) / 2)} ${f1(y - 60 * s)} ${f1(x1)} ${f1(y - 16 * s)} L${f1(x1 + 10 * s)} ${f1(y + 70 * s)} L${f1(x0 - 10 * s)} ${f1(y + 70 * s)} Z" fill="${c}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M${f1(x0 + 30 * s)} ${f1(y + 4 * s)} Q${f1((x0 + x1) / 2)} ${f1(y - 24 * s)} ${f1(x1 - 30 * s)} ${f1(y + 6 * s)}" fill="none" stroke="#B8C6D4" stroke-width="5"/>`; }
function iv13(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><line x1="0" y1="0" x2="0" y2="-560" stroke="#8C98A4" stroke-width="10"/><line x1="-60" y1="0" x2="60" y2="0" stroke="#8C98A4" stroke-width="10" stroke-linecap="round"/><line x1="-40" y1="-560" x2="40" y2="-560" stroke="#8C98A4" stroke-width="8" stroke-linecap="round"/><rect x="-34" y="-540" width="68" height="110" rx="16" fill="#E8F4FF" stroke="${INK}" stroke-width="5" opacity=".95"/><path d="M0 -430 Q20 -300 -40 -200" fill="none" stroke="#9FC6E0" stroke-width="5"/></g>`; }
// a character sitting on the bed: returns y to pass to char so the seat meets the mattress
const seatY13 = (top, s) => top - (452 - 560) * s - 6 * s;
function dadInBed13(t, x, top, s, ex, o = {}) { // dad sitting up in bed (blanket over the legs)
  let h = '';
  if (o.back !== false) h += `<path d="M${f1(x - 150 * s)} ${f1(top + 6)} L${f1(x - 220 * s)} ${f1(top - 320 * s)} L${f1(x - 110 * s)} ${f1(top - 330 * s)} L${f1(x - 40 * s)} ${f1(top + 6)} Z" fill="#FFFFFF" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><ellipse cx="${f1(x - 150 * s)}" cy="${f1(top - 250 * s)}" rx="${f1(90 * s)}" ry="${f1(50 * s)}" fill="#F6F8FA" stroke="${INK}" stroke-width="6" transform="rotate(-20 ${f1(x - 150 * s)} ${f1(top - 250 * s)})"/>`;
  h += AP({ t, seed: o.seed || 1301, x, y: seatY13(top, s), s, pose: o.pose || '앉기', ex, look: o.look || [0, 0], tilt: o.tilt || 0, rot: o.rot || 0 });
  h += blanket13(x - 40 * s, x + 420 * s, top + 4, s);
  return h;
}
function nightDesk13(t, o = {}) { let h = nightRoom12(t, { wx: o.wx || 1360 }); h += desk12(o.dx || 560, 700, t, 1); return h; }

/* ---------- small props ---------- */
function miniMom13(x, y, r) { // round avatar with mom's curly hair
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(r / 40 * 1000) / 1000})"><circle r="40" fill="#F6C7CF" stroke="${INK}" stroke-width="5"/>`;
  [[-26, -20, 12], [-12, -30, 12], [4, -32, 12], [20, -26, 12], [30, -12, 10], [-32, -6, 10]].forEach(([cx, cy, rr]) => { h += `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${PERM13}"/>`; });
  h += `<circle cx="0" cy="8" r="20" fill="#fff"/><circle cx="-7" cy="6" r="2.6" fill="${INK}"/><circle cx="7" cy="6" r="2.6" fill="${INK}"/><path d="M-6 15 Q0 19 6 15" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`;
  return h + '</g>';
}
function momPhone13(x, y, s, t, o = {}) { // chatPhone with mom's avatar on top of the default one
  const title = o.title || '엄마';
  let h = chatPhone(x, y, s, t, Object.assign({}, o, { title }));
  if (title === '엄마') h += miniMom13(x + s * -186, y + s * -404, 31 * s);
  else h += `<g transform="translate(${f1(x + s * -186)} ${f1(y + s * -404)}) scale(${f1(s * 0.28 * 1000) / 1000})"><circle r="108" fill="#FF9A55" stroke="${INK}" stroke-width="10"/><circle cy="20" r="78" fill="#fff" stroke="${INK}" stroke-width="8"/><circle cx="-24" cy="14" r="9" fill="${INK}"/><circle cx="24" cy="14" r="9" fill="${INK}"/><path d="M-16 44 Q0 56 16 44" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/></g>`;
  return h;
}
function starDiary13(x, y, s, t, o = {}) { // open star-diary notebook with handwritten lines
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || -2)}) scale(${f1(s * 1000) / 1000})">`;
  h += `<rect x="-470" y="-300" width="960" height="620" rx="26" fill="${INK}" opacity=".3"/>`;
  h += `<rect x="-480" y="-310" width="960" height="620" rx="26" fill="#2E3E6E" stroke="${INK}" stroke-width="8"/>`;
  h += `<rect x="-456" y="-290" width="452" height="580" rx="12" fill="${o.sepia ? '#F2E2BE' : '#FFFDF6'}" stroke="${INK}" stroke-width="5"/><rect x="4" y="-290" width="452" height="580" rx="12" fill="${o.sepia ? '#F4E6C4' : '#FFFEF9'}" stroke="${INK}" stroke-width="5"/>`;
  for (let i = 0; i < 8; i++) { h += `<line x1="-430" y1="${-190 + i * 62}" x2="-30" y2="${-190 + i * 62}" stroke="#BFD3EA" stroke-width="3"/><line x1="30" y1="${-190 + i * 62}" x2="430" y2="${-190 + i * 62}" stroke="#BFD3EA" stroke-width="3"/>`; }
  h += `<line x1="0" y1="-300" x2="0" y2="300" stroke="${INK}" stroke-width="6"/>`;
  if (o.title) h += hand13(-420, -222, o.title, { size: 54, fill: '#2E3E6E' }) + `<g transform="translate(-60 -240)"><path d="${starPath13(26)}" fill="#FFE680" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>`;
  const lines = o.lines || [], ks = o.ks || [];
  lines.forEach((ln, j) => { const k = ks[j] == null ? 1 : ks[j]; if (k <= 0) return; const shown = typeLines([ln], k)[0] || '';
    const col = j < 3 ? -420 : 50, row = j < 3 ? j : j - 3;
    h += hand13(col, -140 + row * 124, `${j + 1}. ${shown}`, { size: o.size || 46, fill: '#2B3A55' });
    if (k >= 1) h += `<g transform="translate(${col + 390} ${-150 + row * 124})">${star13(0, 0, 16, t, clamp(k * 1.2 - 0.2, 0, 1), j + 5)}</g>`; });
  if (o.note) h += hand13(50, -140, o.note, { size: 44, fill: '#8A6A44' });
  if (o.pen) { const px = o.pen[0], py = o.pen[1]; h += `<g transform="translate(${f1(px)} ${f1(py)}) rotate(30)"><rect x="-10" y="-120" width="20" height="120" rx="8" fill="#F7E733" stroke="${INK}" stroke-width="5"/><path d="M-10 0 L0 26 L10 0 Z" fill="#F4D7A8" stroke="${INK}" stroke-width="4"/></g>`; }
  return h + '</g>';
}

/* ================= scenes ================= */
// 0-2 hook: "big events" vs the hardest week; a cloudy night, one small star
function mhookScene(t, lt, a) {
  const k = a.k || 0, D = D13(a), T0 = t - lt;
  let h = skyBg13(t, { dim: k === 0 ? 0.5 : 0.8 });
  if (k === 0) {
    const ev = [['합격', 0.22, 460, 520, '#FFB0A0'], ['승진', 0.3, 960, 470, YEL], ['멋진 여행', 0.4, 1460, 520, MINT]];
    ev.forEach(([txt, f, x, y, c], j) => { const at = fracOf13(t, txt) * D + 0.15; h += pop(t, T0 + at, t + 99, x, y, `<g transform="scale(1.45)"><circle r="150" fill="url(#warm)" opacity=".9"/>` + burst(118, c) + T8(0, 16, txt, { size: txt.length > 2 ? 40 : 56, fill: NAVY }) + `</g>`, { rot: (j - 1) * 5, bob: 4 }); });
    h += pop(t, T0 + 0.1, t + 99, 960, 170, big(0, 0, [[['행복은 ', '#fff'], ['큰일', YEL], ['이 생겨야 온다?', '#fff']]], { size: 80, sw: 15 }), { noPop: true, inDur: 0.5 });
    return h;
  }
  const ck = k === 1 ? prog(lt, 0, 2.2) : 1;
  h += `<path d="M-600 900 Q300 700 960 760 Q1600 820 2520 700 L2520 1480 L-600 1480 Z" fill="#141A33" stroke="${INK}" stroke-width="8"/>`;
  if (k === 2) { const sk = prog(lt, 0.4, 1.6); h += star13(1180, 300, 34, t, sk, 3, { big: true }); }
  h += cloud13(lerp(-500, 520, easeInOut(ck)), 260, 1.25, t, { seed: 1 }) + cloud13(lerp(2400, 1600, easeInOut(ck)), 330, 1.15, t, { seed: 2 });
  if (k === 2) { const gap = prog(lt, 0.2, 1.4); h += cloud13(lerp(1000, 760, gap), 470, 0.8, t, { seed: 3, op: 0.95 }); }
  else h += cloud13(1060, 380, 1.0, t, { seed: 3, op: ck });
  h += Z({ t, seed: 1301, x: 620, y: 800, s: 0.5, pose: '앉기', ex: exprAt(k === 1 ? [[0, '걱정']] : [[0, '걱정'], [1.2, '놀람']], lt), look: k === 2 ? [0.5, -1] : [0, -0.6] });
  if (k === 1) h += pop(t, T0 + 0.5 * D, t + 99, 1260, 660, big(0, 0, [[['가장 힘든 일주일', YEL], ['에도?', '#fff']]], { size: 68, sw: 14 }), { noPop: true, inDur: 0.5 });
  if (k === 2) h += pop(t, T0 + 0.45 * D, t + 99, 1260, 660, label(0, 0, '제로의 7일 실험', { size: 50, bg: MINT }), { rot: -2 });
  return h;
}
// 3-5 mom's daily text and the one-letter reply
const MOMMSG13 = [['월 오후 12:31', '응'], ['화 오후 12:28', '응'], ['수 오후 1:05', 'ㅇㅇ']];
function mtextScene(t, lt, a) {
  const k = a.k || 0, D = D13(a);
  let h = BG('#1B2340') + particles(t, 51, 18, [0, 0, 1920, 1080], '#8FDBFF', { speed: 8, r: 3, op: 0.3 });
  h += `<ellipse cx="820" cy="500" rx="560" ry="460" fill="url(#screenGlow)" opacity=".5"/>`;
  const msgs = [];
  MOMMSG13.forEach(([tm, rep], j) => {
    const kb = k === 0 ? prog(lt, 0.25 * D + j * 0.55, 0.25 * D + j * 0.55 + 0.3) : 1, kr = k === 0 ? prog(lt, 0.25 * D + j * 0.55 + 0.25, 0.25 * D + j * 0.55 + 0.55) : 1;
    msgs.push({ text: ['밥은 먹었니?'], k: kb });
    msgs.push({ me: 1, text: [rep], k: kr, time: tm, hi: k === 1 && lt > fracOf13(t, '응.') * D });
  });
  h += momPhone13(820, 500, 0.86, t, { msgs, clock: '수 오후 1:06' });
  if (k === 1 && lt > fracOf13(t, '응.') * D) h += pop(t, t - lt + fracOf13(t, '응.') * D, t + 99, 1440, 330, label(0, 0, '늘 한 글자', { size: 48, bg: YEL }), { rot: 4, wobble: 2 });
  if (k === 2) {
    h += label(1440, 330, '늘 한 글자', { size: 48, bg: YEL });
    h += Z({ t, seed: 1302, x: 1460, y: 900, s: 0.52, pose: '폰보기', ex: exprAt([[0, '미안']], t), look: [-0.4, 0.3] });
    h += pop(t, t - lt + 0.45 * D, t + 99, 1460, 480, label(0, 0, '혹시, 나도?', { size: 44, bg: '#fff' }), { rot: -3, bob: 3 });
  }
  return h;
}
// 6-8 Sunday night call
function mcallScene(t, lt, a) {
  const k = a.k || 0, D = D13(a), T0 = t - lt;
  let h = nightRoom12(t, { wx: 1320 });
  if (k < 2) {
    const s1 = k === 0 ? segLt(t, lt, 1) : 0, talkMom = k === 0 && lt > s1 && lt < D - 0.2;
    const shock = k === 0 ? prog(lt, s1 + 1.2, s1 + 1.6) : 1;
    const cl = k === 0 ? prog(lt, s1 + 1.0, D) * 0.7 : 1;
    h += cloud13(980, 210, 0.75 + 0.25 * cl, t, { op: cl, c: k === 1 ? '#2E3350' : '#3C4260', rain: k === 1 });
    if (k === 1) h += `<path d="M1010 330 L960 430 L1010 430 L950 540" fill="none" stroke="${YEL}" stroke-width="14" stroke-linejoin="round" opacity="${f1(Math.abs(Math.sin(t * 9)) * 100) / 100}"/>`;
    const sh = k === 1 ? Math.sin(t * 50) * 5 : 0;
    h += Z({ t, seed: 1303, x: 960 + sh, y: 880, s: 0.62, pose: '전화', ex: exprAt(k === 0 ? [[0, '기본'], [s1 + 1.3, '놀람'], [s1 + 2.6, '걱정']] : [[0, '화남']], lt), look: [-0.3, 0] });
    h += `<g transform="translate(${f1(960 + sh + 0.62 * 124)} ${f1(880 + 0.62 * (198 - 560))})">${phone(0, 0, 0.32, { on: true })}</g>`;
    // call card
    h += `<g transform="translate(420 300)"><rect x="-230" y="-120" width="460" height="240" rx="34" fill="${NAVY}" opacity=".9" stroke="${MINT}" stroke-width="5"/>${miniMom13(-130, 0, 62)}` + T8(40, -14, '엄마', { size: 52, fill: '#fff' }) + T8(40, 44, '통화 중', { size: 30, fill: MINT, w: 700 });
    if (talkMom) for (let i = 0; i < 5; i++) h += `<rect x="${130 + i * 18}" y="${f1(-env(t) * 60 * (0.5 + hash(i + Math.floor(t * 8)) * 0.8))}" width="10" height="${f1(4 + env(t) * 120 * (0.5 + hash(i + Math.floor(t * 8)) * 0.8))}" rx="5" fill="${MINT}" transform="translate(0 0)"/>`;
    h += `</g>`;
    if (k === 0 && shock > 0) h += pop(t, T0 + s1 + 1.25, t + 99, 420, 520, label(0, 0, '수요일 · 수술', { size: 46, bg: '#FFB0A0' }), { rot: -3, wobble: 2 });
    if (k === 1) h += pop(t, T0 + 0.05, t + 99, 1380, 600, burst(240, '#FFB0A0') + T8(0, 18, '왜 이제 말해!', { size: 58, fill: NAVY }), { rot: 5, wobble: 3 });
    return h;
  }
  // k2: after the call, sitting on the floor
  h += cloud13(980, 260, 0.8, t, { op: 0.85, rain: true });
  h += Z({ t, seed: 1304, x: 960, y: 900, s: 0.6, pose: '웅크림', ex: exprAt([[0, '걱정'], [0.5 * D, '겁먹음']], lt), look: [0, 0.4] });
  h += `<g transform="translate(1140 872) rotate(80)">${phone(0, 0, 0.3, { on: false })}</g>`;
  h += pop(t, T0 + 0.62 * D, t + 99, 1420, 520, label(0, 0, '사실은, 무서워서', { size: 46, bg: '#fff' }), { rot: 3 });
  return h;
}
// 9 the week ahead
function mcalScene(t, lt, a) {
  const D = D13(a), T0 = t - lt;
  let h = BG('#E9E3D6') + BG('url(#hatch)').replace('/>', ' opacity=".14"/>');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  h += `<rect x="250" y="150" width="1420" height="600" rx="26" fill="#fff" stroke="${INK}" stroke-width="9"/><rect x="250" y="150" width="1420" height="110" rx="26" fill="#C94B4B" stroke="${INK}" stroke-width="9"/>` + T8(960, 228, '이번 주', { size: 56, fill: '#fff' });
  days.forEach((d, i) => {
    const x = 250 + i * 1420 / 7, cx = x + 1420 / 14, k = prog(lt, 0.1 + i * 0.12, 0.4 + i * 0.12);
    if (i) h += `<line x1="${x}" y1="260" x2="${x}" y2="750" stroke="#C9D2DC" stroke-width="4"/>`;
    h += T8(cx, 320, d, { size: 44, fill: i === 0 ? '#C94B4B' : NAVY });
    if (i >= 1 && i <= 5 && k > 0) {
      h += `<g opacity="${f1(k * 100) / 100}"><rect x="${cx - 70}" y="370" width="140" height="56" rx="14" fill="#DDE6F2" stroke="${INK}" stroke-width="4"/>` + T8(cx, 410, '회사', { size: 30 }) + `<rect x="${cx - 70}" y="446" width="140" height="56" rx="14" fill="#DDF2EA" stroke="${INK}" stroke-width="4"/>` + T8(cx, 486, '병원', { size: 30 }) + `</g>`;
    }
    if (i === 3) h += pop(t, T0 + 0.9, t + 99, cx, 610, `<circle r="78" fill="none" stroke="#E2553A" stroke-width="10"/>` + T8(0, 14, '수술', { size: 44, fill: '#C94B4B' }), { rot: -6 });
  });
  const ck = prog(lt, 0.35 * D, D);
  h += cloud13(lerp(1900, 1250, easeInOut(ck)), 260, 1.0, t, { op: Math.min(1, ck * 2) });
  h += Z({ t, seed: 1305, x: 1560, y: 1000, s: 0.42, pose: '서기', ex: exprAt([[0, '걱정'], [segLt(t, lt, 1), '지침']], lt), look: [-0.6, -0.3] });
  if (lt > segLt(t, lt, 1) + 0.6) h += pop(t, T0 + segLt(t, lt, 1) + 0.6, t + 99, 420, 860, label(0, 0, '행복할 일: 0', { size: 44, bg: '#fff' }), { rot: -3 });
  return h;
}
// 10 the doctor's suggestion
function mlabScene(t, lt, a) {
  const D = D13(a), T0 = t - lt;
  let h = labBg(t);
  h += doctor(520, 960, 0.6, { t, expr: '미소', talk: env(t) });
  h += pop(t, T0 + 0.3, t + 99, 980, 420, `<g transform="rotate(-6)"><rect x="-150" y="-190" width="300" height="380" rx="20" fill="#2E3E6E" stroke="${INK}" stroke-width="8"/><rect x="-118" y="-150" width="236" height="90" rx="12" fill="#FFFDF6" stroke="${INK}" stroke-width="5"/>${hand13(0, -88, '별 일기', { anchor: 'middle', size: 54, fill: '#2E3E6E' })}${star13(0, 60, 54, t, 1, 2)}</g>`, { bob: 4 });
  h += Z({ t, seed: 1306, x: 1480, y: 890, s: 0.56, pose: '서기', ex: exprAt([[0, '걱정'], [0.5 * D, '놀람']], lt), look: [-0.6, 0] });
  const at = fracOf13(t, '매일 밤') * D;
  if (lt > at) { h += pop(t, T0 + at, t + 99, 1000, 760, label(0, 0, '매일 밤, 딱 세 개', { size: 46, bg: YEL }), { rot: 2 }); for (let j = 0; j < 3; j++) h += star13(820 + j * 180, 870, 26, t, prog(lt, at + 0.3 + j * 0.25, at + 0.6 + j * 0.25), j + 1); }
  return h;
}
// 11-13 today's experiment: the rule, and stars that light up
function mtitleScene(t, lt, a) {
  const k = a.k || 0, D = D13(a), T0 = t - lt;
  let h = skyBg13(t, { dim: 0.7 });
  if (k === 0) {
    h += pop(t, T0 + 0.1, t + 99, 960, 250, label(0, 0, '오늘의 실험', { size: 52, bg: MINT }), {});
    h += pop(t, T0 + 0.5, t + 99, 960, 480, big(0, 0, [[['가장 힘든 일주일', YEL], ['에도,', '#fff']], [['행복을 찾을 수 있을까?', '#fff']]], { size: 86, sw: 16, lh: 116 }), { noPop: true, inDur: 0.5 });
    h += cloud13(260, 860, 0.7, t, { op: 0.8 }) + star13(1640, 820, 30, t, prog(lt, 1.0, 1.6), 4);
    return h;
  }
  if (k === 1) {
    const ks = [0, 1, 2].map(j => prog(lt, 0.35 * D + j * 0.7, 0.35 * D + j * 0.7 + 0.6));
    h += starDiary13(960, 520, 0.95, t, { title: '별 일기', lines: ['좋았던 일', '좋았던 일', '좋았던 일'], ks, note: '+ 그 이유도 한 줄' });
    h += pop(t, T0 + 0.15, t + 99, 960, 120, label(0, 0, '매일 밤, 잠들기 전', { size: 46, bg: YEL }), { rot: -2 });
    return h;
  }
  const kk = prog(lt, 0.2, D - 0.3);
  h += constellation13(160, 160, 1.0, t, 1, kk, {});
  h += starDiary13(960, 860, 0.55, t, { title: '별 일기', lines: ['캔커피', '"밥은 먹었니"', '막차'], ks: [0, 1, 2].map(j => clamp(kk * 3 - j, 0, 1)), pen: [-200 + 400 * kk, -40] });
  return h;
}
// 14-16 Monday at the ward: "뭐 하러 왔어" / "밥은 먹었니?" / "지금 밥이 중요해?"
function wardSet13(t, o = {}) { // bed + dad + mom chair; returns svg
  const B = bed13(1020, 880, 0.62); let h = iv13(1290, 880, 0.9) + B.svg;
  h += dadInBed13(t, 840, B.top, 0.58, o.dadEx || exprAt([[0, '기본']], t), { look: o.dadLook || [0, 0], seed: 1310 });
  if (o.mom !== false) { h += chair12(1480, 880, 0.56) + OM({ t, seed: 1311, x: 1480, y: 880, s: 0.56, pose: o.momPose || '앉기', ex: o.momEx || exprAt([[0, '기본']], t), look: o.momLook || [-0.6, 0] }); }
  return h;
}
function mwardScene(t, lt, a) {
  const k = a.k || 0, D = D13(a), T0 = t - lt;
  let h = hospRoom13(t, { wx: 1240 });
  h += `<rect x="150" y="250" width="250" height="630" fill="#B8C9D4" stroke="${INK}" stroke-width="8"/><rect x="170" y="270" width="210" height="610" fill="#8FA6B6" opacity=".5"/>`;
  if (k === 0) {
    const s1 = segLt(t, lt, 1), zx = lerp(270, 420, easeInOut(prog(lt, 0.2, 1.6)));
    h += wardSet13(t, { dadEx: exprAt([[0, '기본'], [s1, '지친']], lt), dadLook: lt > s1 ? [0.8, 0.2] : [-0.6, 0], momEx: exprAt([[0, '걱정']], t), momLook: [-0.8, 0] });
    h += Z({ t, seed: 1312, x: zx, y: 880, s: 0.56, pose: lt < 1.6 ? walkPose(lt * 3, 0.5) : '서기', ex: exprAt([[0, '걱정'], [s1 + 0.8, '서운함']], lt), look: [0.6, 0] });
    if (lt > s1 + 0.2) h += pop(t, T0 + s1 + 0.2, t + 99, 760, 300, label(0, 0, '괜히 퉁명스러운 아빠', { size: 38, bg: '#fff' }), { rot: -3 });
    return h;
  }
  if (k === 1) {
    const s1 = segLt(t, lt, 1), s2 = segLt(t, lt, 2);
    h += wardSet13(t, { dadEx: exprAt([[0, '지친']], t), dadLook: [0.4, 0], momEx: exprAt([[0, '걱정'], [s2 + 0.5, '서운함']], lt), momLook: [-0.9, 0], momPose: '앉기' });
    h += Z({ t, seed: 1312, x: 420, y: 880, s: 0.56, pose: lt > s2 ? '팔짱' : '서기', ex: exprAt([[0, '지침'], [s2, '화남']], lt), look: [0.6, 0] });
    if (lt > s1 && lt < s2 + 0.2) h += pop(t, T0 + s1, T0 + s2 + 0.2, 1480, 330, bubble(0, 0, 330, 110, T8(0, 14, '밥은 먹었니?', { size: 40 })), {});
    if (lt > s2) { h += pop(t, T0 + s2, t + 99, 420, 300, burst(220, '#FFB0A0') + T8(0, 14, '지금 밥이 중요해?', { size: 44, fill: NAVY }), { rot: -4, wobble: 2 }); h += cloud13(420, 150, 0.32, t, { op: prog(lt, s2 + 0.3, s2 + 1.0) }); }
    return h;
  }
  h += wardSet13(t, { dadEx: exprAt([[0, '지친']], t), momEx: exprAt([[0, '서운함']], t), momLook: [0, 0.6] });
  h += Z({ t, seed: 1312, x: 420, y: 880, s: 0.56, pose: '주머니', ex: exprAt([[0, '미안']], t), look: [-0.8, 0.4] });
  h += cloud13(420, 170, 0.36, t, { op: 0.9, rain: true });
  return h;
}
// 17-20, 30-31 the star diary at night: window sky with tonight's stars, the notebook
const DIARY13 = {
  1: { title: '별 일기 · 월', items: ['편의점 사장님이 데워 준 캔커피', "엄마의 '밥은 먹었니' 문자", '놓칠 뻔한 막차'], cue: ['캔커피', '밥은 먹었니', '막차'] },
  2: { title: '별 일기 · 화', items: ['아빠 이름을 다정하게 불러 준 간호사', '바둑 중계에 훈수 두는 아빠', '병실 창밖의 노을'], cue: ['간호사', '훈수', '노을'] },
  3: { title: '별 일기 · 수', items: ['"수술이 잘 끝났습니다"', '내 어깨에 기대 잠든 엄마', '아빠의 첫마디 "밥은 먹었냐"'], cue: ['수술이 잘', '잠든 엄마', '첫마디'] },
};
function mdiaryScene(t, lt, a) {
  const k = a.k || 0, d = a.d || 1, D = D13(a), T0 = t - lt, Dg = DIARY13[d];
  let kd = 0, ks = [0, 0, 0];
  if (k === 0 && d === 1) { kd = 0; }
  else if (k === 0) { kd = kByPhrases13(t, lt, a, Dg.cue); ks = Dg.cue.map(p => clamp((lt - fracOf13(t, p) * D - 0.1) / 1.2, 0, 1)); }
  else if (d === 1 && k === 1) { kd = kByPhrases13(t, lt, a, Dg.cue); ks = Dg.cue.map(p => clamp((lt - fracOf13(t, p) * D - 0.1) / 1.2, 0, 1)); }
  else { kd = 1; ks = [1, 1, 1]; }
  // sky band (window) with tonight's stars
  let h = skyBg13(t, { dim: 0.55 });
  const clouds = d === 1 ? 1 : d === 2 ? 0.75 : 0.4;
  h += constellation13(130, 70, 1.03, t, d, kd, { r: d === 3 ? 1.15 : 1 });
  h += cloud13(380, 120, 0.7, t, { op: clouds * 0.85, seed: 4 }) + cloud13(1550, 90, 0.6, t, { op: clouds * 0.8, seed: 5 });
  if (d === 3 && k === 1) { const g = prog(lt, 0, 1.2); DAYIDX13(3).forEach(i => { const s = STARS13[i]; h += `<circle cx="${f1(130 + s.x * 1.03)}" cy="${f1(70 + s.y * 1.03)}" r="${f1(90 + 30 * Math.sin(t * 2 + i))}" fill="url(#warm)" opacity="${f1(g * 0.9 * 100) / 100}"/>`; }); }
  // room strip below
  h += `<rect x="-600" y="560" width="3120" height="1000" fill="#1A2140"/><line x1="-600" y1="560" x2="2520" y2="560" stroke="${INK}" stroke-width="8"/>`;
  h += desk12(400, 760, t, 1) + chair12(400, 900, 0.56);
  const write = !(d === 1 && k === 0) && !(d === 1 && k === 2);
  h += Z({ t, seed: 1320 + d, x: 400, y: 900, s: 0.56, pose: '책상', ex: exprAt(d === 1 && k === 2 ? [[0, '비웃음']] : d === 1 && k === 0 ? [[0, '걱정']] : d === 3 ? [[0, '울먹']] : [[0, '기본']], t), look: [0.3, 0.6], still: !write });
  h += starDiary13(1240, 770, 0.82, t, { title: Dg.title, lines: Dg.items, ks, size: 40, pen: write ? [-300 + 320 * (ks.filter(x => x > 0 && x < 1).length ? 1 : 0), -120] : null });
  if (d === 1 && k === 0) { const s1 = segLt(t, lt, 1); if (lt > s1) h += pop(t, T0 + s1, t + 99, 460, 430, bubble(0, 0, 300, 100, T8(0, 14, '좋은 일이…?', { size: 40 })), {}); }
  if (d === 1 && k === 2) h += pop(t, T0 + 0.1, t + 99, 520, 440, label(0, 0, '이게 무슨 행복이야', { size: 38, bg: '#fff' }), { rot: -3 });
  if (d === 3 && k === 1) h += pop(t, T0 + 0.4 * D, t + 99, 960, 640, big(0, 0, [[['가장 어두운 밤, ', '#fff'], ['가장 밝은 별', YEL]]], { size: 64, sw: 13 }), { noPop: true, inDur: 0.5 });
  return h;
}
// 21-22, 25 the doctor's picture: worries are big near clouds, good things are small stars
function mcloudScene(t, lt, a) {
  const k = a.k || 0, D = D13(a), T0 = t - lt;
  let h = skyBg13(t, { dim: k === 2 ? 1 : 0.4, n: k === 2 ? 140 : 60 });
  h += constellation13(170, 80, 1.0, t, 3, 0, {});
  const part = k === 2 ? easeInOut(prog(lt, 0.1, 1.8)) : k === 1 ? 0.18 * easeInOut(prog(lt, 0.3 * D, D)) : 0;
  h += cloud13(960 - 1300 * part, 330, 2.0 - 0.3 * part, t, { c: '#353B58' });
  h += `<path d="M-600 940 Q400 860 960 880 Q1500 900 2520 840 L2520 1480 L-600 1480 Z" fill="#11162C" stroke="${INK}" stroke-width="8"/>`;
  h += doctor(360, 1000, 0.5, { t, expr: k === 2 ? '미소' : '기본', talk: k < 2 ? env(t) : 0, pose: k === 0 ? 'point' : undefined });
  h += Z({ t, seed: 1330, x: 1500, y: 960, s: 0.5, pose: '서기', ex: exprAt(k === 2 ? [[0, '놀람'], [1.0, '신남']] : [[0, '걱정']], lt), look: k === 1 && lt > 0.4 * D ? [-0.9, -0.8] : [-0.4, -0.6] });
  if (k === 0 && lt > 0.45 * D) h += pop(t, T0 + 0.45 * D, t + 99, 960, 140, label(0, 0, '걱정 = 크고 가까운 먹구름', { size: 42, bg: '#fff' }), { rot: -2 });
  if (k === 1) { h += label(960, 140, '걱정 = 크고 가까운 먹구름', { size: 42, bg: '#fff' }); h += pop(t, T0 + 0.35 * D, t + 99, 330, 300, label(0, 0, '좋은 일 = 작은 별', { size: 42, bg: YEL }), { rot: 3 }); h += star13(330, 170, 22, t, prog(lt, 0.3 * D, 0.3 * D + 0.6), 9); }
  if (k === 2) h += pop(t, T0 + 0.5 * D, t + 99, 960, 760, big(0, 0, [[['없던 게 아니라, ', '#fff'], ['안 보였던 것', YEL]]], { size: 74, sw: 15 }), { noPop: true, inDur: 0.5 });
  return h;
}
// 23-24 bad is stronger than good (review); one-line hypothesis
function scale13(x, y, s, t, tilt) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  h += `<rect x="-20" y="-420" width="40" height="420" fill="#8E6B48" stroke="${INK}" stroke-width="7"/><rect x="-140" y="-20" width="280" height="40" rx="14" fill="#6E4E33" stroke="${INK}" stroke-width="7"/>`;
  h += `<g transform="translate(0 -420) rotate(${f1(tilt)})"><rect x="-430" y="-14" width="860" height="28" rx="12" fill="#B08A5E" stroke="${INK}" stroke-width="7"/>`;
  for (const sd of [-1, 1]) { h += `<g transform="translate(${sd * 400} 0) rotate(${f1(-tilt)})"><line x1="-120" y1="190" x2="0" y2="0" stroke="${INK}" stroke-width="5"/><line x1="120" y1="190" x2="0" y2="0" stroke="${INK}" stroke-width="5"/><path d="M-160 190 Q0 260 160 190 Z" fill="#D9B98E" stroke="${INK}" stroke-width="7"/></g>`; }
  return h + `<circle r="22" fill="${YEL}" stroke="${INK}" stroke-width="6"/></g></g>`;
}
function mbadScene(t, lt, a) {
  const k = a.k || 0, D = D13(a), T0 = t - lt;
  if (k === 0) {
    let h = BG('url(#cream)') + BG('url(#hatch)').replace('/>', ' opacity=".12"/>');
    const tilt = -14 * easeOutBack(prog(lt, 0.25 * D, 0.25 * D + 1.0));
    h += scale13(960, 900, 1.0, t, tilt);
    const L = [960 - 400 * Math.cos(tilt * Math.PI / 180), 480 - 400 * Math.sin(-tilt * Math.PI / 180) * -1], R = [960 + 400 * Math.cos(tilt * Math.PI / 180), 480 + 400 * Math.sin(-tilt * Math.PI / 180) * -1];
    h += cloud13(L[0], L[1] + 120, 0.42, t, { seed: 8 }) + T8(L[0], L[1] + 330, '나쁜 일 1', { size: 42 });
    for (let j = 0; j < 3; j++) h += star13(R[0] - 90 + j * 90, R[1] + 150 - (j === 1 ? 30 : 0), 30, t, 1, j + 11);
    h += T8(R[0], R[1] + 330, '좋은 일 여럿', { size: 42 });
    if (lt > 0.62 * D) h += pop(t, T0 + 0.62 * D, t + 99, 960, 260, big(0, 0, [[['나쁜 일이 ', '#fff'], ['더 크게, 더 오래', YEL]]], { size: 70, sw: 14 }), { noPop: true, inDur: 0.5 });
    return h;
  }
  let h = BG('url(#sunset)');
  h += `<path d="M-600 760 Q500 700 960 730 Q1500 760 2520 700 L2520 1480 L-600 1480 Z" fill="#7E9A52" stroke="${INK}" stroke-width="8"/><rect x="-600" y="880" width="3120" height="600" fill="#6B8745"/>`;
  for (let i = 0; i < 26; i++) { const gx = -200 + i * 90; h += `<path d="M${gx} 880 l14 -60 l10 60 l12 -48 l8 48" fill="#5E7B3A" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`; }
  h += `<g transform="translate(420 860)"><ellipse cx="0" cy="-60" rx="200" ry="120" fill="#3F5E2E" stroke="${INK}" stroke-width="8"/><ellipse cx="-60" cy="-70" rx="16" ry="10" fill="${YEL}" opacity="${f1((0.6 + 0.4 * Math.sin(t * 3)) * 100) / 100}"/><ellipse cx="0" cy="-74" rx="16" ry="10" fill="${YEL}" opacity="${f1((0.6 + 0.4 * Math.sin(t * 3)) * 100) / 100}"/></g>`;
  h += `<g transform="translate(1460 860)"><line x1="0" y1="0" x2="0" y2="-120" stroke="#3E6B2E" stroke-width="8"/>${[0, 1, 2, 3, 4].map(i => `<ellipse cx="${f1(Math.cos(i * 1.256) * 30)}" cy="${f1(-140 + Math.sin(i * 1.256) * 30)}" rx="22" ry="22" fill="#FF8FB0" stroke="${INK}" stroke-width="5"/>`).join('')}<circle cx="0" cy="-140" r="16" fill="${YEL}" stroke="${INK}" stroke-width="5"/></g>`;
  h += Z({ t, seed: 1331, x: 900, y: 880, s: 0.56, pose: '웅크림', ex: exprAt([[0, '겁먹음']], t), look: [-1, 0] });
  h += pop(t, T0 + 0.3, t + 99, 420, 520, label(0, 0, '위험 먼저!', { size: 44, bg: '#FFB0A0' }), { rot: -4, wobble: 2 });
  h += pop(t, T0 + 0.6 * D, t + 99, 1460, 560, label(0, 0, '꽃은 나중에…', { size: 38, bg: '#fff' }), { rot: 3 });
  h += pop(t, T0 + 0.2, t + 99, 960, 150, label(0, 0, '여러 설명 중 하나', { size: 34, bg: YEL }), { rot: -2 });
  return h;
}
// 29 waking from anaesthesia: "…밥은, 먹었냐."
function mwakeScene(t, lt, a) {
  const D = D13(a), T0 = t - lt, s1 = segLt(t, lt, 1);
  let h = hospRoom13(t, { night: true, wx: 1300, curtain: false });
  h += `<ellipse cx="560" cy="520" rx="320" ry="260" fill="url(#warm)" opacity=".5"/><rect x="520" y="560" width="80" height="140" fill="#D9C7A6" stroke="${INK}" stroke-width="6"/><path d="M500 560 L620 560 L590 480 L530 480 Z" fill="#FFE29A" stroke="${INK}" stroke-width="6"/>`;
  const B = bed13(1000, 880, 0.62); h += iv13(1300, 880, 0.9) + B.svg;
  h += dadInBed13(t, 820, B.top, 0.58, exprAt([[0, '잠'], [Math.max(0.5, s1 - 1.2), '지친']], lt), { look: [0.6, 0.1], seed: 1340, tilt: -6 });
  h += OM({ t, seed: 1341, x: 1460, y: 880, s: 0.56, pose: '가슴', ex: exprAt([[0, '걱정'], [s1 + 0.8, '울먹']], lt), look: [-0.8, 0] });
  h += Z({ t, seed: 1342, x: 600, y: 880, s: 0.56, pose: '받기', ex: exprAt([[0, '걱정'], [s1 + 0.6, '울먹']], lt), look: [0.8, 0] });
  if (lt > s1 + 0.6) h += tears12(600, 880, 0.56, t);
  if (lt > s1) h += pop(t, T0 + s1, t + 99, 820, 280, bubble(0, 0, 340, 110, hand13(0, 18, '…밥은, 먹었냐', { anchor: 'middle', size: 52 })), { bob: 2 });
  return h;
}
// 32-35 Seligman 2005: one week of three good things -> happier through six months (concept drawing)
function miniBook13(x, y, s, t, day, k) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-70" y="-90" width="140" height="180" rx="12" fill="#FFFDF6" stroke="${INK}" stroke-width="6"/><rect x="-70" y="-90" width="140" height="44" rx="12" fill="#2E3E6E" stroke="${INK}" stroke-width="6"/>` + T8(0, -58, day, { size: 28, fill: '#fff' });
  for (let j = 0; j < 3; j++) h += star13(-40 + j * 40, 0 + (j % 2) * 30, 15, t, clamp(k * 3 - j, 0, 1), j + 3);
  return h + '</g>';
}
function mstudyScene(t, lt, a) {
  const k = a.k || 0, D = D13(a), T0 = t - lt;
  let h = labBg(t);
  if (k === 0) {
    ['월', '화', '수', '목', '금', '토', '일'].forEach((d, i) => { h += miniBook13(330 + i * 210, 500, 1.15, t, d, prog(lt, 0.3 * D + i * 0.45, 0.3 * D + i * 0.45 + 0.6)); });
    h += pop(t, T0 + 0.2, t + 99, 960, 230, label(0, 0, '일주일 동안 · 매일 밤 좋은 일 3가지 + 그 이유', { size: 40, bg: YEL }), {});
    return h;
  }
  if (k === 1) {
    const pts = [['1주', 300, 640], ['1달', 760, 560], ['3달', 1200, 520], ['6달', 1640, 500]];
    h += `<line x1="200" y1="720" x2="1760" y2="720" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".7"/>`;
    pts.forEach(([lb, x, y], j) => { const kk = prog(lt, 0.15 * D + j * 0.12 * D, 0.15 * D + j * 0.12 * D + 0.5); if (kk <= 0) return;
      h += `<g opacity="${f1(kk * 100) / 100}"><line x1="${x}" y1="720" x2="${x}" y2="${y + 60}" stroke="${MINT}" stroke-width="6" stroke-dasharray="12 10"/>` + T8(x, 790, lb, { size: 44, fill: '#fff' }) + `</g>`;
      h += Z({ t, seed: 1350 + j, x, y: y + 70, s: 0.24 * easeOutBack(kk), pose: j === 3 ? '만세' : '서기', ex: exprAt([[0, j === 0 ? '기본' : '신남']], t), still: true }); });
    if (lt > 0.62 * D) h += pop(t, T0 + 0.62 * D, t + 99, 960, 200, big(0, 0, [[['일주일 적었더니 → ', '#fff'], ['여섯 달 뒤까지', YEL]]], { size: 70, sw: 14 }), { noPop: true, inDur: 0.5 });
    h += T8(1840, 960, '개념도', { anchor: 'end', size: 28, fill: '#9FB4D8', w: 700 });
    return h;
  }
  if (k === 2) {
    h += `<g transform="translate(0 40)">` + T8(560, 300, '첫 연구', { size: 44, fill: '#fff' }) + T8(1360, 300, '뒤따른 연구들', { size: 44, fill: '#fff' });
    const g1 = prog(lt, 0.1, 0.9), g2 = prog(lt, 0.25 * D, 0.25 * D + 0.8);
    h += `<rect x="460" y="${f1(800 - 380 * g1)}" width="200" height="${f1(380 * g1)}" rx="12" fill="${MINT}" stroke="${INK}" stroke-width="6"/><rect x="1260" y="${f1(800 - 200 * g2)}" width="200" height="${f1(200 * g2)}" rx="12" fill="#7CC7FF" stroke="${INK}" stroke-width="6"/>`;
    h += `<line x1="300" y1="800" x2="1620" y2="800" stroke="#fff" stroke-width="6"/></g>`;
    if (lt > 0.6 * D) h += pop(t, T0 + 0.6 * D, t + 99, 960, 180, label(0, 0, '만능 처방은 아니다', { size: 46, bg: '#FFB0A0' }), { rot: -3, wobble: 2 });
    return h;
  }
  h = skyBg13(t, { dim: 0.6 });
  h += cloud13(500, 300, 1.0, t, { seed: 6 }) + constellation13(980, 120, 0.55, t, 3, 1, {});
  const turn = easeInOut(prog(lt, 0.3, 1.6));
  h += `<path d="M-600 940 Q400 860 960 880 Q1500 900 2520 840 L2520 1480 L-600 1480 Z" fill="#11162C" stroke="${INK}" stroke-width="8"/>`;
  h += Z({ t, seed: 1360, x: 900, y: 940, s: 0.56, pose: '서기', ex: exprAt([[0, '걱정'], [1.4, '신남']], lt), look: [lerp(-0.9, 0.9, turn), -0.8] });
  h += pop(t, T0 + 0.45 * D, t + 99, 960, 120, label(0, 0, '눈을 별 쪽으로 돌리는 연습', { size: 46, bg: YEL }), { rot: -2 });
  return h;
}
// 36-37 "힘들어도 감사하라는 거예요?" — no; the whole sky is not cloud
function maskScene(t, lt, a) {
  const k = a.k || 0, D = D13(a), T0 = t - lt;
  let h = hospRoom13(t, { night: true, wx: 2400, curtain: false });
  h += `<rect x="300" y="110" width="1320" height="520" rx="16" fill="#0B1430" stroke="${INK}" stroke-width="12"/>`;
  h += `<g clip-path="url(#askClip)"><defs><clipPath id="askClip"><rect x="300" y="110" width="1320" height="520" rx="16"/></clipPath></defs>`;
  h += skyBg13(t, { dim: 0.6, n: 50 }).replace(BG('url(#sky13)'), `<rect x="300" y="110" width="1320" height="520" fill="url(#sky13)"/>`);
  h += constellation13(330, 140, 0.78, t, 3, 1, {}) + cloud13(560, 330, 0.9, t, { seed: 7 });
  h += `</g><line x1="960" y1="110" x2="960" y2="630" stroke="${INK}" stroke-width="10"/>`;
  if (k === 1) { const kk = prog(lt, 0.2, 1.0); h += `<rect x="980" y="130" width="620" height="480" rx="12" fill="none" stroke="${YEL}" stroke-width="${f1(10 * kk)}" opacity="${f1(kk * 100) / 100}"/>`; h += pop(t, T0 + 0.5 * D, t + 99, 1290, 60, label(0, 0, '하늘 전체가 구름은 아니다', { size: 44, bg: YEL }), { rot: 2 }); }
  h += doctor(1400, 1000, 0.5, { t, expr: k === 1 ? '미소' : '진지', talk: env(t) * (lt > segLt(t, lt, k === 0 ? 1 : 0) ? 1 : 0) });
  h += Z({ t, seed: 1361, x: 640, y: 960, s: 0.52, pose: '서기', ex: exprAt([[0, '서운함']], t), look: [0.8, 0] });
  if (k === 0) h += pop(t, T0 + 0.2, T0 + segLt(t, lt, 1) + 0.3, 600, 620, bubble(0, 0, 380, 110, T8(0, 14, '힘들어도 감사하라고?', { size: 38 })), {});
  return h;
}
// 38-39 Thursday: noticing stars in daytime
function kimbap13(x, y, s) { let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><ellipse cx="0" cy="20" rx="170" ry="40" fill="#fff" stroke="${INK}" stroke-width="6"/>`; for (let i = 0; i < 5; i++) h += `<g transform="translate(${-120 + i * 60} 0)"><circle r="30" fill="#1E3B1E" stroke="${INK}" stroke-width="5"/><circle r="22" fill="#fff"/><circle cx="-6" cy="-4" r="6" fill="#F28C28"/><circle cx="7" cy="2" r="5" fill="#3E9B3E"/><circle cx="0" cy="8" r="5" fill="${YEL}"/></g>`; return h + '</g>'; }
function bowl13(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-110 -20 Q0 120 110 -20 Z" fill="#EDEFF2" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><ellipse cx="0" cy="-20" rx="110" ry="24" fill="#F7F3E8" stroke="${INK}" stroke-width="6"/><rect x="40" y="-120" width="16" height="110" rx="8" fill="#C9D2DC" stroke="${INK}" stroke-width="5" transform="rotate(20 48 -60)"/></g>`; }
function mthuScene(t, lt, a) {
  const k = a.k || 0, D = D13(a), T0 = t - lt;
  let h = hospRoom13(t, { wx: 1300, curtain: false });
  h += `<rect x="560" y="660" width="800" height="34" rx="10" fill="#E8D8BC" stroke="${INK}" stroke-width="7"/><rect x="600" y="694" width="24" height="186" fill="#B8A07A" stroke="${INK}" stroke-width="5"/><rect x="1296" y="694" width="24" height="186" fill="#B8A07A" stroke="${INK}" stroke-width="5"/>`;
  h += chair12(420, 900, 0.52) + Z({ t, seed: 1370, x: 420, y: 900, s: 0.52, pose: '숟가락', ex: exprAt(k === 0 ? [[0, '기본'], [segLt(t, lt, 1), '놀람'], [segLt(t, lt, 1) + 0.8, '신남']] : [[0, '신남']], lt), look: [0.6, 0.3] });
  h += chair12(1500, 900, 0.52) + OM({ t, seed: 1371, x: 1500, y: 900, s: 0.52, pose: '앉기', ex: exprAt([[0, '신남']], t), look: [-0.7, 0] });
  h += kimbap13(820, 640, 0.9);
  if (k === 0) { const s1 = segLt(t, lt, 1); if (lt > s1) { h += star13(820, 470, 40, t, prog(lt, s1, s1 + 0.5), 21, { big: true }); h += pop(t, T0 + s1 + 0.3, t + 99, 820, 330, label(0, 0, '오늘의 별!', { size: 42, bg: YEL }), { rot: -3, wobble: 2 }); } return h; }
  h += star13(820, 470, 40, t, 1, 21, { big: true });
  const at2 = fracOf13(t, '죽 한 그릇') * D;
  h += pop(t, T0 + at2 - 0.3, t + 99, 1120, 620, bowl13(0, 0, 0.8), {});
  h += star13(1120, 470, 40, t, prog(lt, at2, at2 + 0.5), 22, { big: true });
  const at3 = fracOf13(t, '별이 다섯') * D;
  if (lt > at3 - 0.2) h += pop(t, T0 + at3 - 0.2, t + 99, 960, 180, label(0, 0, '목요일 밤 · 별 다섯 개', { size: 46, bg: MINT }), {});
  return h;
}
// 40-41, 45 Friday: dad walks to the end of the corridor
function corridor13(t) {
  let h = BG('#E6EEF0') + BG('url(#hatch)').replace('/>', ' opacity=".12"/>');
  for (let i = 0; i < 4; i++) { const x = -40 + i * 560; h += `<rect x="${x}" y="170" width="380" height="300" rx="10" fill="#BFE3F5" stroke="${INK}" stroke-width="8"/><rect x="${x}" y="170" width="380" height="300" rx="10" fill="url(#morning)" opacity=".5"/><line x1="${x + 190}" y1="170" x2="${x + 190}" y2="470" stroke="${INK}" stroke-width="6"/>`; }
  h += `<rect x="-600" y="610" width="3120" height="20" rx="10" fill="#B8A07A" stroke="${INK}" stroke-width="5"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#C9D2D6"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 8; i++) h += `<rect x="${-200 + i * 320}" y="880" width="300" height="30" fill="#fff" opacity=".25"/>`;
  return h;
}
function mfriScene(t, lt, a, run) {
  const k = a.k || 0, D = D13(a), T0 = t - lt;
  let h = corridor13(t);
  const walkK = k === 0 ? prog(lt, 0.2, D + 0.6) : 1, dx = lerp(300, 1180, walkK), moving = k === 0 && walkK < 1;
  h += iv13(dx + 120, 880, 0.75);
  h += AP({ t, seed: 1380, x: dx, y: 880, s: 0.58, pose: moving ? walkPose(lt * 1.6, 0.25) : (k === 2 ? '만세' : '서기'), ex: exprAt(k === 0 ? [[0, '결심']] : [[0, '신남']], t), look: [0.6, 0] });
  h += OM({ t, seed: 1381, x: 1500, y: 880, s: 0.56, pose: k === 0 ? '가슴' : '안기', ex: exprAt(k === 0 ? [[0, '걱정']] : [[0, '울먹']], t), look: [-0.7, 0] });
  h += Z({ t, seed: 1382, x: 1720, y: 880, s: 0.56, pose: k === 0 ? '서기' : '만세', ex: exprAt(k === 0 ? [[0, '걱정'], [0.7 * D, '신남']] : [[0, '신남']], t), look: [-0.7, 0] });
  h += `<line x1="1400" y1="884" x2="1400" y2="760" stroke="${MINT}" stroke-width="8" stroke-dasharray="16 12"/>`;
  if (k === 1) h += pop(t, T0 + 0.3, t + 99, 760, 300, label(0, 0, '일주일 전엔, 당연했던 일', { size: 44, bg: '#fff' }), { rot: -2 });
  if (k === 2) {
    h += star13(1180, 520, 42, t, prog(lt, 0.1, 0.7), 31, { big: true });
    h += pop(t, T0 + 0.35 * D, t + 99, 960, 330, big(0, 0, [[['더 가지는 게 아니라,', '#fff']], [['이미 가진 걸 ', YEL], ['잊지 않는 것', YEL]]], { size: 64, sw: 13, lh: 84 }), { noPop: true, inDur: 0.5 });
  }
  return h;
}
// 46-47 Saturday: the wardrobe drawer, the 1998 notebook
function oldBook13(x, y, s, t, o = {}) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || -4)}) scale(${f1(s * 1000) / 1000})">`;
  h += `<rect x="-200" y="-270" width="420" height="560" rx="18" fill="${INK}" opacity=".3"/><rect x="-210" y="-280" width="420" height="560" rx="18" fill="#7A5A3A" stroke="${INK}" stroke-width="9"/>`;
  h += `<rect x="-210" y="-280" width="40" height="560" rx="10" fill="#5E4329" stroke="${INK}" stroke-width="6"/>`;
  h += `<path d="M-120 -220 L150 -230 M-130 220 L160 230" stroke="#9A7B55" stroke-width="5" opacity=".6"/><circle cx="110" cy="160" r="40" fill="#5E4329" opacity=".35"/>`;
  h += `<rect x="-110" y="-150" width="250" height="110" rx="10" fill="#E9D7B4" stroke="${INK}" stroke-width="5"/>` + hand13(15, -70, '1998', { anchor: 'middle', size: 86, fill: '#5A3E26' });
  h += hand13(15, 40, '좋았던 일', { anchor: 'middle', size: 50, fill: '#E9D7B4' });
  return h + '</g>';
}
function homeRoom13(t) {
  let h = BG('#C9B79C') + BG('url(#hatch)').replace('/>', ' opacity=".16"/>');
  h += `<rect x="1300" y="160" width="380" height="300" rx="10" fill="url(#morning)" stroke="${INK}" stroke-width="9"/><line x1="1490" y1="160" x2="1490" y2="460" stroke="${INK}" stroke-width="7"/><rect x="1300" y="160" width="380" height="300" fill="#000" opacity=".15"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#A98B66"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  h += `<g stroke="${INK}" stroke-width="8" stroke-linejoin="round"><rect x="260" y="120" width="720" height="760" rx="10" fill="#B88A5A"/><line x1="620" y1="120" x2="620" y2="560"/><rect x="290" y="580" width="660" height="130" rx="8" fill="#C99B68"/><rect x="290" y="730" width="660" height="130" rx="8" fill="#C99B68"/></g>`;
  h += `<circle cx="600" cy="340" r="9" fill="${INK}"/><circle cx="640" cy="340" r="9" fill="${INK}"/><rect x="580" y="636" width="80" height="16" rx="8" fill="#6E4E33"/><rect x="580" y="786" width="80" height="16" rx="8" fill="#6E4E33"/>`;
  return h;
}
function mhomeScene(t, lt, a) {
  const k = a.k || 0, D = D13(a), T0 = t - lt;
  let h = homeRoom13(t);
  if (k === 0) {
    const zx = lerp(1700, 1120, easeInOut(prog(lt, 0.2, 2.2)));
    h += Z({ t, seed: 1390, x: zx, y: 880, s: 0.58, pose: lt < 2.2 ? walkPose(lt * 3, 0.5) : '집기', ex: exprAt([[0, '지침']], t), look: [-0.7, 0.2] });
    h += pop(t, T0 + 0.1, t + 99, 1500, 560, label(0, 0, '토요일 · 오랜만의 집', { size: 40, bg: '#fff' }), { rot: 2 });
    return h;
  }
  const op = prog(lt, 0.1, 0.9);
  h += `<rect x="290" y="${f1(730 + 120 * op)}" width="660" height="130" rx="8" fill="#B07E4E" stroke="${INK}" stroke-width="8"/><rect x="300" y="${f1(740 + 120 * op)}" width="640" height="40" fill="#7A5434" opacity=".7"/>`;
  h += Z({ t, seed: 1391, x: 1120, y: 880, s: 0.58, pose: '받기', ex: exprAt([[0, '기본'], [0.4 * D, '놀람']], lt), look: [-0.4, 0.4] });
  const bk = prog(lt, 0.35 * D, 0.35 * D + 1.0);
  if (bk > 0) h += `<g opacity="${f1(bk * 100) / 100}">` + particles(t, 61, 14, [700, 300, 700, 400], '#FFF2C0', { speed: 10, r: 4, op: 0.5 }) + oldBook13(lerp(1080, 960, bk), lerp(700, 470, bk), lerp(0.2, 0.75, easeInOut(bk)), t) + `</g>`;
  return h;
}
// 48-52 the 1998 notebook (silent pages; the handwriting is the voice)
const SEPINK13 = '#4A3424';
function page13(t, o = {}) { // one big sepia page
  let h = BG('#2A2018') + `<ellipse cx="960" cy="520" rx="980" ry="700" fill="url(#warm)" opacity=".25"/>`;
  h += `<g transform="rotate(${o.rot || -1.2} 960 540)"><rect x="372" y="62" width="1200" height="960" rx="14" fill="${INK}" opacity=".35"/><rect x="360" y="50" width="1200" height="960" rx="14" fill="#F1DFBA" stroke="${INK}" stroke-width="7"/>`;
  h += `<rect x="360" y="50" width="1200" height="960" rx="14" fill="url(#paper)"/><ellipse cx="1420" cy="880" rx="160" ry="90" fill="#C9A86E" opacity=".25"/><ellipse cx="520" cy="160" rx="120" ry="60" fill="#C9A86E" opacity=".2"/>`;
  for (let i = 0; i < 11; i++) h += `<line x1="420" y1="${170 + i * 80}" x2="1500" y2="${170 + i * 80}" stroke="#D2B98E" stroke-width="3"/>`;
  h += `<line x1="500" y1="50" x2="500" y2="1010" stroke="#D99A8A" stroke-width="3" opacity=".6"/>`;
  return h;
}
const sepF13 = inner => `<filter id="sep13"><feColorMatrix type="matrix" values="0.42 0.6 0.14 0 0.06  0.36 0.55 0.12 0 0.03  0.28 0.44 0.1 0 0  0 0 0 0.85 0"/></filter><g filter="url(#sep13)">${inner}</g>`;
function doodleStar13(x, y, r, k) { if (k <= 0) return ''; return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(easeOutBack(clamp(k, 0, 1)) * 1000) / 1000}) rotate(-8)"><path d="${starPath13(r)}" fill="none" stroke="${SEPINK13}" stroke-width="4" stroke-linejoin="round"/></g>`; }
function inkLine13(x, y, txt, k, size = 64, hi = false) {
  if (k <= 0) return '';
  const shown = typeLines([txt], k)[0] || '';
  if (!hi) return hand13(x, y, shown, { size, fill: SEPINK13 });
  const parts = shown.split('제로'); let inner = '';
  parts.forEach((p, j) => { inner += esc(p); if (j < parts.length - 1) inner += `<tspan fill="#C2410C">제로</tspan>`; });
  return `<text x="${f1(x)}" y="${f1(y)}" font-family="${HANDF}" font-weight="700" font-size="${size}" fill="${SEPINK13}">${inner}</text>`;
}
const BOOKP1 = [['1998년 3월 2일', 0.2, 1.2], ['오늘 좋았던 일 세 가지.', 1.4, 2.4], ["1. 제로가 처음으로 '엄마'라고 불렀다.", 2.9, 4.9], ['2. 쌀이 아직 남아 있다.', 5.3, 6.6], ['3. 제로가 하루 종일 잘 웃었다.', 7.0, 8.6]];
const BOOKPAGES13 = [
  ['4월 9일', '1. 제로가 혼자 일어섰다.', '2. 옆집에서 귤을 나눠 주셨다.', '3. 제로가 귤을 보고 웃었다.'],
  ['6월 21일', '1. 제로가 아빠 품에서 잠들었다.', '2. 비가 그쳤다.', '3. 제로 이가 하나 났다.'],
  ['9월 3일', '1. 아빠가 오늘, 제로를 보고 처음 웃었다.', '2. 면접 연락이 왔다.', '3. 제로가 "아빠" 했다.'],
  ['12월 31일', '1. 제로가 첫 눈을 봤다.', '2. 셋이 다 같이 저녁을 먹었다.', '3. 제로가 건강하다.']];
function mbookScene(t, lt, a) {
  const p = a.p || 0, D = D13(a);
  if (p === 0) { // the cover opens
    let h = BG('#2A2018') + `<ellipse cx="960" cy="540" rx="800" ry="560" fill="url(#warm)" opacity=".3"/>`;
    const op = easeInOut(prog(lt, 0.5, D + 0.1));
    h += `<rect x="580" y="120" width="760" height="840" rx="14" fill="#F1DFBA" stroke="${INK}" stroke-width="7"/>`;
    h += `<g transform="translate(580 540) scale(${f1(Math.max(0.02, 1 - op) * 1000) / 1000} 1) translate(-580 -540)">` + oldBook13(960, 540, 1.5, t, { rot: 0 }).replace(/<rect x="-200" y="-270" width="420" height="560" rx="18" fill="#141414" opacity=".3"\/>/, '') + `</g>`;
    return h;
  }
  if (p === 1) {
    let h = page13(t);
    BOOKP1.forEach(([txt, a0, a1], j) => { const k = prog(lt, a0, a1); h += inkLine13(560, 170 + (j === 0 ? 0 : j === 1 ? 110 : 130 + j * 120), txt, k, j < 2 ? 66 : 70); if (j >= 2) h += doodleStar13(1460, 150 + 130 + j * 120 - 20, 24, prog(lt, a1, a1 + 0.4)); });
    const bk = prog(lt, 8.8, 9.6);
    if (bk > 0) h += `<g opacity="${f1(bk * 0.9 * 100) / 100}">${sepF13(baby13(1360, 960, 0.42 * easeOutBack(bk), t, { still: true }))}</g>`;
    return h + '</g>';
  }
  if (p === 3) {
    let h = page13(t, { rot: 1 });
    const k = prog(lt, 0.3, 3.2);
    h += inkLine13(560, 480, '힘든 해였지만,', clamp(k * 2, 0, 1), 96) + inkLine13(560, 640, '별이 많은 해였다.', clamp(k * 2 - 1, 0, 1), 96);
    for (let i = 0; i < 14; i++) h += doodleStar13(440 + hash(i * 3.1) * 1060, 140 + hash(i * 7.7) * 820 * (i % 2 ? 0.25 : 1) + (i % 2 ? 720 : 0), 14 + hash(i) * 14, prog(lt, 2.2 + i * 0.12, 2.6 + i * 0.12));
    return h + '</g>';
  }
  // p4: pages turning, "제로" on almost every line
  const per = Math.max(1.1, (D + 0.4) / BOOKPAGES13.length), n = Math.min(BOOKPAGES13.length - 1, Math.floor(lt / per)), pk = (lt - n * per) / per;
  let h = page13(t, { rot: n % 2 ? 1.2 : -1.2 });
  BOOKPAGES13[n].forEach((ln, j) => { h += inkLine13(560, 200 + j * 150, ln, 1, j === 0 ? 62 : 66, true); });
  h += doodleStar13(1440, 330, 22, 1) + doodleStar13(1440, 480, 22, 1) + doodleStar13(1440, 630, 22, 1);
  if (pk < 0.25) { const f = 1 - pk / 0.25; h += `<path d="M1560 50 L${f1(1560 - 1200 * (1 - f))} 50 L${f1(1560 - 1200 * (1 - f))} 1010 L1560 1010 Z" fill="#E8D3A8" opacity="${f1(f * 0.9 * 100) / 100}" stroke="${INK}" stroke-width="4"/>`; }
  return h + '</g>';
}
// 55-56 the apology, and the reply that is no longer one letter
function mgiveScene(t, lt, a) {
  const k = a.k || 0, D = D13(a), T0 = t - lt;
  let h = hospRoom13(t, { sunset: true, wx: 1300, curtain: false });
  const B = bed13(1380, 880, 0.6); h += B.svg + dadInBed13(t, 1200, B.top, 0.56, exprAt([[0, '신남']], t), { look: [-0.6, 0], seed: 1395 });
  h += chair12(520, 900, 0.56) + OM({ t, seed: 1396, x: 520, y: 900, s: 0.56, pose: '받기', ex: exprAt(k === 2 ? [[0, '기본'], [segLt(t, lt, 1), '신남']] : [[0, '신남']], lt), look: [0.8, 0] });
  h += oldBook13(560, 900 + 0.56 * (352 - 560) + 40, 0.2, t, { rot: -10 });
  const z2 = k === 3 ? '안기' : '서기';
  h += Z({ t, seed: 1397, x: 860, y: 880, s: 0.56, pose: z2, ex: exprAt(k === 2 ? [[0, '미안']] : [[0, '울먹'], [0.4, '신남']], lt), look: [-0.8, k === 2 ? 0.5 : 0] });
  if (k === 3) h += tears12(860, 880, 0.56, t);
  if (k === 2 && lt > segLt(t, lt, 1)) h += pop(t, T0 + segLt(t, lt, 1), t + 99, 520, 380, bubble(0, 0, 360, 110, T8(0, 14, '밥은 먹었니?', { size: 40 })), {});
  if (k === 3) h += pop(t, T0 + 0.2, t + 99, 860, 380, label(0, 0, '응. 먹었어.', { size: 46, bg: YEL }), { rot: -2, bob: 3 });
  return h;
}
// 60-62 next morning: mom's phone, Zero texts first
function kitchen13(t) {
  let h = morningRoom12(t);
  h += `<rect x="200" y="300" width="560" height="60" rx="8" fill="#E9DCC6" stroke="${INK}" stroke-width="6"/><rect x="230" y="200" width="70" height="100" rx="10" fill="#9EC3DE" stroke="${INK}" stroke-width="5"/><rect x="330" y="230" width="60" height="70" rx="10" fill="#F2D16B" stroke="${INK}" stroke-width="5"/>`;
  h += `<rect x="520" y="640" width="900" height="34" rx="10" fill="#D9B98E" stroke="${INK}" stroke-width="7"/><rect x="560" y="674" width="24" height="206" fill="#B08A5E" stroke="${INK}" stroke-width="5"/><rect x="1356" y="674" width="24" height="206" fill="#B08A5E" stroke="${INK}" stroke-width="5"/>`;
  return h;
}
function mmornScene(t, lt, a) {
  const k = a.k || 0, D = D13(a), T0 = t - lt;
  if (k === 1) {
    let h = BG('#F3E9DC');
    const kk = prog(lt, 0.4, 0.8);
    h += momPhone13(700, 600, 0.8, t, { title: '아들', msgs: [{ text: ['엄마, 밥은 먹었어?'], k: kk }], clock: '오전 8:02' });
    h += pop(t, t - lt + 0.9, t + 99, 1380, 560, `<rect x="-330" y="-90" width="660" height="180" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>` + hand13(0, 26, '엄마, 밥은 먹었어?', { anchor: 'middle', size: 76, fill: NAVY }), { rot: -2 });
    return h;
  }
  let h = kitchen13(t);
  h += `<g transform="translate(980 630)"><path d="M-30 -40 L30 -40 L24 10 L-24 10 Z" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M30 -30 q24 4 18 22 q-6 10 -22 6" fill="none" stroke="${INK}" stroke-width="5"/></g>`;
  const buzz = k === 0 && lt > 0.4 * D ? Math.sin(t * 60) * 4 : 0;
  h += `<g transform="translate(${f1(1180 + buzz)} 626) rotate(-6)"><rect x="-60" y="-12" width="120" height="24" rx="9" fill="#1F2D44" stroke="${INK}" stroke-width="5"/><rect x="-50" y="-8" width="100" height="14" rx="6" fill="${k === 2 ? '#8FDBFF' : '#5A6B85'}"/></g>`;
  h += chair12(860, 900, 0.56) + OM({ t, seed: 1398, x: 860, y: 900, s: 0.56, pose: k === 2 ? '가슴' : '앉기', ex: exprAt(k === 0 ? [[0, '기본'], [0.55 * D, '놀람']] : [[0, '신남']], lt), look: [0.8, 0.2] });
  if (k === 2) { h += tears12(860, 900, 0.56, t).replace(/9ED8FF/g, '9ED8FF'); h += pop(t, T0 + 0.35 * D, t + 99, 1240, 330, label(0, 0, '이번엔, 제로가 먼저', { size: 46, bg: YEL }), { rot: 3, bob: 3 }); }
  if (k === 0) h += pop(t, T0 + 0.1, t + 99, 1500, 520, label(0, 0, '다음 날 아침', { size: 40, bg: '#fff' }), { rot: -2 });
  return h;
}
// 63-64 the ending lines over the finished constellation
function mendScene(t, lt, a) {
  const k = a.k || 0, D = D13(a), T0 = t - lt;
  let h = skyBg13(t, { n: 120 });
  h += constellation13(160, 90, 1.0, t, 8, 1, { lines: 1, all: true });
  h += `<path d="M-600 950 Q400 880 960 900 Q1500 920 2520 860 L2520 1480 L-600 1480 Z" fill="#0E1328" stroke="${INK}" stroke-width="8"/>`;
  if (k === 0) h += pop(t, T0 + 0.2, t + 99, 960, 640, big(0, 0, [[['가장 어두운 밤에도, ', '#fff'], ['별은 떠 있다', YEL]]], { size: 70, sw: 14 }), { noPop: true, inDur: 0.7 });
  else { h += big(960, 640, [[['가장 어두운 밤에도, ', '#fff'], ['별은 떠 있다', YEL]]], { size: 70, sw: 14 }); h += pop(t, T0 + 0.4, t + 99, 960, 760, big(0, 0, [[['행복은, 그 별을 ', '#fff'], ['알아볼 때', YEL]]], { size: 58, sw: 12 }), { noPop: true, inDur: 0.7 }); }
  return h;
}
// 65-67 recap and the question
function mrecapScene(t, lt, a) {
  const k = a.k || 0, D = D13(a), T0 = t - lt;
  let h = labBg(t);
  if (k === 0) {
    h += pop(t, T0 + 0.1, t + 99, 960, 170, label(0, 0, '오늘의 실험 · 한 줄 정리', { size: 40, bg: MINT }), {});
    h += pop(t, T0 + 0.4 * D, t + 99, 960, 360, big(0, 0, [[['행복은 ', '#fff'], ['큰일', '#FF9A7A'], ['이 아니라,', '#fff']], [['알아보는 눈', YEL], ['에서 온다', '#fff']]], { size: 84, sw: 16, lh: 112 }), {});
    h += constellation13(560, 640, 0.5, t, 8, 1, { lines: 1, all: true });
    return h;
  }
  if (k === 1) {
    h += starDiary13(960, 520, 0.95, t, { title: '오늘의 별', lines: ['', '', ''], ks: [0, 0, 0], note: '아주 작은 것이라도', pen: [-300, -120] });
    h += pop(t, T0 + 0.3, t + 99, 960, 120, label(0, 0, '오늘 밤, 좋았던 일 세 가지', { size: 44, bg: YEL }), { rot: -2 });
    return h;
  }
  h += pop(t, T0 + 0.2, t + 99, 960, 250, big(0, 0, [[['여러분의 ', '#fff'], ['오늘 별 세 개', YEL], ['는?', '#fff']]], { size: 78, sw: 15 }), {});
  h += pop(t, T0 + 0.5 * D, t + 99, 960, 430, label(0, 0, '댓글로 들려주세요', { size: 46, bg: MINT }), { bob: 3 });
  for (let j = 0; j < 3; j++) h += star13(760 + j * 200, 600, 34, t, prog(lt, 0.6 + j * 0.3, 1.0 + j * 0.3), j + 40);
  h += Z({ t, seed: 1399, x: 960, y: 900, s: 0.48, pose: '손인사', ex: exprAt([[0, '신남']], t) });
  return h;
}

/* ---------- HUD: the week and tonight's star count (outside the camera) ---------- */
const DAYLINE13 = i => i >= 57 ? 7 : i >= 46 ? 6 : i >= 40 ? 5 : i >= 38 ? 4 : i >= 26 ? 3 : i >= 20 ? 2 : i >= 14 ? 1 : 0;
const LIGHT13 = { 1: 18, 2: 20, 3: 30, 4: 39, 5: 45, 6: 52, 7: 58 };
const HUDON13 = i => (i >= 14 && i <= 20) || (i >= 26 && i <= 31) || (i >= 38 && i <= 41) || (i >= 45 && i <= 47) || (i >= 53 && i <= 56);
function hud13(t) {
  const i = lineIdx12(t); if (!HUDON13(i)) return '';
  const l = TL.lines[i], lt = t - (l.t0 - 0.15), D = Math.max(0.5, l.t1 - l.t0), day = DAYLINE13(i), L = LIGHT13[day];
  const kd = i < L ? 0 : i > L ? 1 : clamp(lt / D * 1.1, 0, 1);
  let n = 0; STARS13.forEach((s, j) => { if (litOf13(j, day, kd) > 0.5) n++; });
  const first = !HUDON13(i - 1), op = first ? prog(lt, 0, 0.4) : 1;
  let h = `<g transform="translate(1600 86)" opacity="${f1(op * 100) / 100}"><rect x="-280" y="-52" width="560" height="104" rx="26" fill="${NAVY}" opacity=".88" stroke="${YEL}" stroke-width="4"/>`;
  ['월', '화', '수', '목', '금', '토', '일'].forEach((d, j) => { const on = j + 1 === day, past = j + 1 < day; h += `<circle cx="${-246 + j * 50}" cy="0" r="21" fill="${on ? YEL : past ? '#3A4A6A' : 'none'}" stroke="${on ? INK : '#5A6B85'}" stroke-width="3"/>` + T8(-246 + j * 50, 9, d, { size: 24, fill: on ? NAVY : past ? '#C9D6E8' : '#7A8699' }); });
  h += `<g transform="translate(150 0)"><path d="${starPath13(26)}" fill="#FFE680" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>` + T8(240, 14, `× ${n}`, { size: 40, fill: '#fff' });
  return h + '</g>';
}
render = function (t) { _render12(t); const h = hud13(t); if (h) document.getElementById('v').insertAdjacentHTML('beforeend', h); };
window.render = render;

thanksScene = function (t, lt) {
  let h = labBg(t) + particles(t, 77, 30, [0, 0, 1920, 1080], YEL, { speed: 30, r: 5, op: 0.6 });
  h += pop(t, t - lt + 0.2, t + 99, 960, 220, outlined(0, 0, [[['끝까지 함께해 주셔서', '#fff']], [['고맙습니다', YEL]]], { size: 92, sw: 17 }), {});
  h += doctor(420, 960, 0.5, { t, expr: '미소', talk: env(t) });
  h += AP({ t, seed: 79, x: 760, y: 890, s: 0.5, pose: '손인사', ex: exprAt([[0, '신남']], t) });
  h += Z({ t, seed: 78, x: 1000, y: 890, s: 0.54, pose: '손인사', ex: exprAt([[0, '신남']], t) });
  h += OM({ t, seed: 80, x: 1240, y: 890, s: 0.5, pose: '손인사', ex: exprAt([[0, '신남']], t) });
  h += pop(t, t - lt + 0.6, t + 99, 960, 420, label(0, 0, '상식실험실', { size: 40, bg: MINT }), {});
  return h;
};

/* ---------- no subtitle at all while a silent line (notebook / message) is current, by the base subtitle's own line choice ---------- */
const _subtitle13 = subtitle;
subtitle = function (t) {
  let cur = null; for (const l of TL.lines) if (t >= l.t0 - 0.05 && t <= l.t1 + 0.25) cur = l;
  if (cur && ((cur.args && cur.args.silent) || !cur.sub)) return '';
  return _subtitle13(t);
};
