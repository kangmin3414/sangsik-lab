/* ---------- experiment 011: the year didn't get shorter — the 'firsts' did ---------- */
Object.assign(CAMS, {
  tbday: [1.0, 1.06, 960, 560], tcal: [1.0, 1.04, 960, 520], tcave: [1.0, 1.03, 960, 540], tcaveout: [1.0, 1.03, 960, 540],
  talbum: [1.0, 1.03, 960, 520], tfall: [1.0, 1.03, 960, 540], tsurvey: [1.0, 1.03, 960, 520], tday: [1.0, 1.05, 960, 560],
  tweek: [1.0, 1.03, 960, 520], tbeach: [1.0, 1.03, 960, 540], tstudio: [1.0, 1.05, 960, 560], tend: [1.0, 1.04, 960, 540]
});
// Grandpa: white hair, white walrus moustache, warm brown cardigan with a shirt collar
const GP = o => HALO(char(Object.assign({ goggles: 'none', vest: '#A67C52', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', hair: '#ECECEC', stache: '#F4F4F4', collar: true }, o)));
// Michel Siffre (only in the AI pictures / reference sheet): dark hair, short beard, blue-grey sweater
const SF = o => HALO(char(Object.assign({ goggles: 'none', vest: '#4F6D8A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.22)', hair: '#3A2A1E' }, o)));
const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const D11 = a => a._dur || 6;
const rnd11 = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

function spark11(x, y, s, t, c = YEL) {
  const k = (Math.sin(t * 5 + x) + 1) / 2;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * (0.7 + 0.3 * k) * 100) / 100})"><path d="M0 -30 L8 -8 L30 0 L8 8 L0 30 L-8 8 L-30 0 L-8 -8 Z" fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>`;
}
function flashBurst(x, y, k) { // camera flash: white rays, k 0..1
  if (k <= 0 || k >= 1) return '';
  const op = Math.sin(k * Math.PI), r = 120 + 900 * k;
  let h = `<circle cx="${x}" cy="${y}" r="${f1(r)}" fill="#fff" opacity="${f1(op * 0.55 * 100) / 100}"/>`;
  for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2; h += `<path d="M${f1(x + Math.cos(an) * 40)} ${f1(y + Math.sin(an) * 40)} L${f1(x + Math.cos(an) * r)} ${f1(y + Math.sin(an) * r)}" stroke="#fff" stroke-width="${f1(18 * (1 - k) + 4)}" stroke-linecap="round" opacity="${f1(op * 100) / 100}"/>`; }
  return h;
}
function shutter(x, y, s, t) { // little camera icon
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-60" y="-34" width="120" height="78" rx="14" fill="#3B3F4E" stroke="${INK}" stroke-width="6"/><rect x="-30" y="-50" width="44" height="20" rx="6" fill="#3B3F4E" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="5" r="25" fill="#9CC9DE" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="5" r="11" fill="#2A3550"/><circle cx="38" cy="-18" r="6" fill="${YEL}"/></g>`;
}

/* ---------- small pictures inside the polaroids: box (-75,-91)..(75,59) ---------- */
const PB = c => `<rect x="-75" y="-91" width="150" height="150" fill="${c}"/>`;
function picBakery() {
  let h = PB('#BFE3F5') + `<rect x="-62" y="-46" width="124" height="105" fill="#F4E2C4" stroke="${INK}" stroke-width="4"/>`;
  for (let i = 0; i < 6; i++) h += `<path d="M${-62 + i * 20.6} -46 L${-62 + (i + 1) * 20.6} -46 L${-62 + (i + 1) * 20.6} -28 Q${-51.7 + i * 20.6} -20 ${-62 + i * 20.6} -28 Z" fill="${i % 2 ? '#fff' : '#E2553A'}" stroke="${INK}" stroke-width="3"/>`;
  h += `<rect x="-50" y="-14" width="66" height="50" fill="#FFF6DD" stroke="${INK}" stroke-width="4"/><rect x="26" y="-6" width="26" height="65" fill="#8A5A34" stroke="${INK}" stroke-width="4"/>`;
  h += [[-38, 22], [-16, 24], [4, 20]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="7" fill="#C98A3E" stroke="${INK}" stroke-width="3"/>`).join('');
  return h;
}
function picSoup() { // pad thai plate
  return PB('#F2E6CC') + `<ellipse cx="0" cy="14" rx="64" ry="26" fill="#fff" stroke="${INK}" stroke-width="4"/>` +
    [...Array(6)].map((_, i) => `<path d="M${-46 + i * 14} ${10 + (i % 2) * 4} q14 -12 28 -2 q10 6 18 -3" fill="none" stroke="#E9C46A" stroke-width="6" stroke-linecap="round"/>`).join('') +
    `<path d="M-30 4 q8 -14 18 0" fill="none" stroke="#FF9E80" stroke-width="8" stroke-linecap="round"/><path d="M12 2 q8 -14 18 0" fill="none" stroke="#FF9E80" stroke-width="8" stroke-linecap="round"/><path d="M44 0 L62 -8 L62 8 Z" fill="#B5E36B" stroke="${INK}" stroke-width="3"/>` +
    [-20, 30].map(x => `<path d="M${x} -26 q8 -12 0 -24" fill="none" stroke="#fff" stroke-width="5" opacity=".9"/>`).join('');
}
function picClock() {
  return PB('#E8EEF5') + `<circle cx="0" cy="-16" r="56" fill="#fff" stroke="${INK}" stroke-width="5"/>` +
    [...Array(12)].map((_, i) => { const an = i / 12 * Math.PI * 2; return `<circle cx="${f1(Math.sin(an) * 46)}" cy="${f1(-16 - Math.cos(an) * 46)}" r="3" fill="${INK}"/>`; }).join('') +
    `<path d="M0 -16 L-26 -32" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M0 -16 L0 26" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="-16" r="6" fill="${RED}"/>`;
}
function picSunset() {
  return `<rect x="-75" y="-91" width="150" height="150" fill="url(#sunset)"/><circle cx="18" cy="6" r="30" fill="#FFD27A"/><rect x="-75" y="22" width="150" height="37" fill="#3E4A6A"/>` +
    `<ellipse cx="-46" cy="18" rx="24" ry="30" fill="#2E3A55"/><rect x="-49" y="30" width="6" height="20" fill="#2E3A55"/><ellipse cx="52" cy="22" rx="18" ry="22" fill="#2E3A55"/>`;
}
function picCamera() {
  return PB('#EADBC8') + `<g transform="translate(0 -14)"><rect x="-54" y="-30" width="108" height="70" rx="8" fill="#5A4636" stroke="${INK}" stroke-width="5"/><rect x="-54" y="-10" width="108" height="14" fill="#C9B79E"/><circle cx="0" cy="6" r="24" fill="#9CC9DE" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="6" r="10" fill="#2A3550"/><rect x="-44" y="-42" width="24" height="12" rx="3" fill="#C9B79E" stroke="${INK}" stroke-width="3"/></g>`;
}
function miniHead(x, y, s, o) { // tiny head + shoulders for the photos
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-46 70 Q-46 30 0 26 Q46 30 46 70 Z" fill="${o.shirt}" stroke="${INK}" stroke-width="4"/>`;
  if (o.collar) h += `<path d="M-12 28 L0 44 L12 28" fill="#F4F1EA" stroke="${INK}" stroke-width="3"/>`;
  h += `<circle cx="0" cy="-6" r="34" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
  if (o.hair) h += `<path d="M-33 -12 Q-33 -42 0 -42 Q33 -42 33 -12 Q24 -26 0 -26 Q-24 -26 -33 -12 Z" fill="${o.hair}" stroke="${INK}" stroke-width="3"/>`;
  h += `<circle cx="-11" cy="-6" r="4" fill="${INK}"/><circle cx="11" cy="-6" r="4" fill="${INK}"/>`;
  h += o.stache ? `<path d="M-16 8 Q0 0 16 8 Q8 14 0 10 Q-8 14 -16 8 Z" fill="#F4F4F4" stroke="${INK}" stroke-width="3"/><path d="M-7 16 Q0 21 7 16" fill="none" stroke="${INK}" stroke-width="3"/>` : `<path d="M-9 8 Q0 16 9 8" fill="none" stroke="${INK}" stroke-width="3"/>`;
  return h + `<circle cx="-22" cy="4" r="5" fill="#FFB3C7" opacity=".7"/><circle cx="22" cy="4" r="5" fill="#FFB3C7" opacity=".7"/></g>`;
}
function picDuo() { // the photo grandpa and Zero took together (the studio picture, cropped square)
  return `<rect x="-75" y="-91" width="150" height="150" fill="#D9C7A8"/><image href="ai/41_photo.jpg" x="-75" y="-91" width="150" height="150" preserveAspectRatio="xMidYMid slice"/>`;
}
function picCake() {
  return PB('#F6D7E0') + `<rect x="-46" y="-6" width="92" height="46" rx="8" fill="#FFF6E8" stroke="${INK}" stroke-width="4"/><path d="M-46 8 Q-34 18 -22 8 Q-10 18 2 8 Q14 18 26 8 Q38 18 46 8" fill="none" stroke="#FF8FB1" stroke-width="6"/>` +
    [-26, -8, 10, 28].map(x => `<rect x="${x - 3}" y="-30" width="6" height="24" fill="#9CC9DE" stroke="${INK}" stroke-width="2"/><ellipse cx="${x}" cy="-36" rx="5" ry="8" fill="${YEL}"/>`).join('');
}
function picSame() { // the same grey office day
  return PB('#C9CED6') + `<rect x="-75" y="22" width="150" height="37" fill="#9AA3B0"/><rect x="-44" y="-56" width="88" height="62" rx="6" fill="#56607A" stroke="${INK}" stroke-width="4"/><rect x="-36" y="-48" width="72" height="46" fill="#AFC2D6"/><rect x="-8" y="6" width="16" height="16" fill="#56607A"/><rect x="40" y="0" width="20" height="24" rx="4" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
}
function picNewPlace() { // a new place: sea and mountain
  return PB('#9FD8F2') + `<path d="M-75 10 L-30 -40 L0 -10 L30 -50 L75 10 Z" fill="#6E9F6A" stroke="${INK}" stroke-width="3"/><rect x="-75" y="10" width="150" height="49" fill="#3F86C9"/><path d="M-60 30 q10 -6 20 0 M10 40 q10 -6 20 0" fill="none" stroke="#fff" stroke-width="4"/><circle cx="46" cy="-62" r="12" fill="#FFF3B0"/>`;
}
function picNewFood() {
  return PB('#FFE3B8') + `<ellipse cx="0" cy="18" rx="60" ry="22" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="-18" cy="6" r="16" fill="#F2C14E" stroke="${INK}" stroke-width="3"/><circle cx="12" cy="4" r="14" fill="#E2553A" stroke="${INK}" stroke-width="3"/><circle cx="30" cy="12" r="10" fill="#6DBE55" stroke="${INK}" stroke-width="3"/>`;
}
function polaroid(x, y, s, rot, pic, o = {}) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000})"><rect x="-84" y="-98" width="180" height="214" rx="6" fill="${INK}" opacity=".22"/><rect x="-90" y="-106" width="180" height="214" rx="6" fill="#FFFDF7" stroke="${INK}" stroke-width="5"/>${pic}<rect x="-75" y="-91" width="150" height="150" fill="none" stroke="${INK}" stroke-width="3"/>${o.cap ? T8(0, 94, o.cap, { size: o.capSize || 21, fill: NAVY }) : ''}</g>`;
}
const WEEKPICS = [picBakery, picSoup, picClock, picSunset, picCamera, picDuo];
const WEEKCAP = ['처음 본 빵집', '처음 먹은 팟타이', '시계 없는 하루', '처음 간 공원', '할아버지의 꿈', '할아버지와 첫 사진'];

/* ---------- calendars ---------- */
function yearCal(cx, cy, s, t, o = {}) { // 12-month wall calendar; o.hi = month index sweeping, o.marks = {m: pic}
  let h = `<g transform="translate(${cx} ${cy}) scale(${s})">`;
  h += `<rect x="-484" y="-354" width="980" height="736" rx="22" fill="${INK}" opacity=".25"/><rect x="-490" y="-362" width="980" height="736" rx="22" fill="#FFFDF7" stroke="${INK}" stroke-width="8"/>`;
  h += `<rect x="-490" y="-362" width="980" height="96" rx="22" fill="#E2553A" stroke="${INK}" stroke-width="8"/><rect x="-482" y="-300" width="964" height="30" fill="#E2553A"/>`;
  h += [-330, -110, 110, 330].map(x => `<rect x="${x - 10}" y="-386" width="20" height="50" rx="10" fill="#C9D2DC" stroke="${INK}" stroke-width="5"/>`).join('');
  h += T8(0, -296, '2026', { size: 54, fill: '#fff' });
  for (let m = 0; m < 12; m++) {
    const col = m % 4, row = Math.floor(m / 4), x = -462 + col * 234, y = -244 + row * 200;
    const hi = o.hi === m;
    h += `<rect x="${x}" y="${y}" width="220" height="186" rx="12" fill="${hi ? '#FFF3B0' : '#fff'}" stroke="${INK}" stroke-width="${hi ? 7 : 4}"/>`;
    h += T8(x + 18, y + 38, `${m + 1}월`, { size: 30, fill: m >= 10 ? '#B8B8B8' : NAVY, anchor: 'start' });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) h += `<rect x="${x + 16 + c * 28}" y="${y + 56 + r * 30}" width="20" height="20" rx="4" fill="${m >= 10 ? '#F4F4F4' : '#EEF1F5'}"/>`;
    if (o.marks && o.marks[m]) h += polaroid(x + 150, y + 100, 0.42, -6 + (m % 3) * 5, o.marks[m]());
  }
  return h + '</g>';
}
function weekCal(cx, cy, s, t, n, o = {}) { // Mon..Sun, the first n cells hold a polaroid; o.slideK animates the n-th one in
  let h = `<g transform="translate(${cx} ${cy}) scale(${s})">`;
  h += `<rect x="-794" y="-226" width="1600" height="470" rx="24" fill="${INK}" opacity=".25"/><rect x="-800" y="-234" width="1600" height="470" rx="24" fill="#FFFDF7" stroke="${INK}" stroke-width="8"/>`;
  for (let d = 0; d < 7; d++) {
    const x = -780 + d * 223, hi = o.hi === d;
    h += `<rect x="${x}" y="-218" width="211" height="62" rx="12" fill="${d >= 5 ? '#FFD8C2' : '#DDEBFA'}" stroke="${INK}" stroke-width="5"/>` + T8(x + 105, -175, DAYS[d], { size: 38, fill: NAVY });
    h += `<rect x="${x}" y="-146" width="211" height="366" rx="14" fill="${hi ? '#FFF3B0' : '#fff'}" stroke="${INK}" stroke-width="${hi ? 7 : 4}" stroke-dasharray="${d < n ? '0' : '14 10'}"/>`;
    if (d < n) {
      const last = d === n - 1 && o.slideK != null, k = last ? easeOutBack(clamp(o.slideK, 0, 1)) : 1;
      if (!last || o.slideK > 0) h += polaroid(x + 105, lerp(-560, 30, k), 0.98, (rnd11(d) - 0.5) * 8, WEEKPICS[d](), { cap: WEEKCAP[d] });
      if (last && o.slideK > 0.9) h += spark11(x + 190, -120, 0.9, t) + spark11(x + 20, 190, 0.7, t + 1, MINT);
    }
  }
  return h + '</g>';
}
function wallPad(x, y, s, t, flip) { // small tear-off calendar; flip 0..1 makes its pages fly off
  let h = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-90" y="-110" width="180" height="210" rx="12" fill="#FFFDF7" stroke="${INK}" stroke-width="6"/><rect x="-90" y="-110" width="180" height="50" rx="12" fill="#E2553A" stroke="${INK}" stroke-width="6"/>`;
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월'];
  const idx = Math.min(9, Math.floor(flip * 10));
  h += T8(0, 50, months[idx], { size: 54, fill: NAVY });
  if (flip > 0 && flip < 1) { const ph = (flip * 10) % 1; h += `<g transform="translate(${f1(ph * 160)} ${f1(-ph * 120)}) rotate(${f1(ph * 50)})" opacity="${f1((1 - ph) * 100) / 100}"><rect x="-86" y="-56" width="172" height="150" fill="#FFFDF7" stroke="${INK}" stroke-width="5"/></g>`; }
  return h + '</g>';
}
function cakeG(x, y, s, t, candles) {
  let h = `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="6" rx="170" ry="26" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="-130" y="-120" width="260" height="120" rx="16" fill="#FFF6E8" stroke="${INK}" stroke-width="7"/>`;
  h += `<path d="M-130 -84 Q-104 -60 -78 -84 Q-52 -60 -26 -84 Q0 -60 26 -84 Q52 -60 78 -84 Q104 -60 130 -84" fill="none" stroke="#FF8FB1" stroke-width="12" stroke-linecap="round"/>`;
  for (let i = 0; i < candles; i++) { const cx = -96 + i * 32, fl = Math.sin(t * 13 + i) * 3; h += `<rect x="${cx - 6}" y="-170" width="12" height="52" rx="4" fill="${['#9CC9DE', '#FFB3C7', YEL][i % 3]}" stroke="${INK}" stroke-width="4"/><ellipse cx="${cx + fl * 0.3}" cy="-184" rx="8" ry="${f1(14 + fl)}" fill="#FFB547"/><ellipse cx="${cx}" cy="-180" rx="4" ry="7" fill="#FFF3B0"/>`; }
  return h + '</g>';
}

/* ---------- 1. grandpa's birthday ---------- */
function tbdayScene(t, lt, a) {
  const D = D11(a);
  let h = kitchen(t, true) + chairBack(560) + chairBack(1360);
  h += wallPad(300, 330, 0.9, t, a.k === 1 ? prog(lt, 0.15 * D, 0.95 * D) : 0);
  const talk = a.k === 1 && Math.sin(t * 7) > -0.2 && lt < 0.85 * D;
  h += GP({ t, seed: 1101, x: 560, y: 860, s: 0.8, pose: talk ? '손인사' : '서기', ex: exprAt(a.k === 1 ? [[0, '뿌듯'], [0.75 * D, '기본']] : [[0, '뿌듯']], lt), look: [0.7, -0.1], light: -1, shade: '#C9C0E8' });
  h += Z({ t, seed: 1102, x: 1360, y: 860, s: 0.8, pose: !a.k ? '받기' : '서기', ex: exprAt(a.k === 1 ? [[0, '신남'], [0.55 * D, '놀람']] : [[0, '신남']], lt), look: [-0.8, -0.1], light: -1, shade: '#C9C0E8' });
  h += `<ellipse cx="960" cy="560" rx="520" ry="320" fill="url(#warm)" opacity=".35"/>`;
  h += clothTable(300, 720, 1320, '#F2E6CC', '#B5763A');
  h += cakeG(960, 716, 1.0, t, !a.k ? 1 + Math.floor(prog(lt, 0.05 * D, 0.6 * D) * 6) : 7);
  if (!a.k) h += pop(t, t - lt + 0.35 * D, t + 99, 1640, 330, label(0, 0, '할아버지 생신', { size: 40, bg: YEL }), { rot: 4, bob: 3 });
  else {
    h += pop(t, t - lt + 0.1, t + 99, 0, 0, speech(700, 210, 700, 120, '1년이 꼭 한 달 같구나', 560, 420, { size: 46 }), { noPop: true, inDur: 0.3 });
    if (lt > 0.7 * D) h += pop(t, t - lt + 0.7 * D, t + 99, 1500, 240, big(0, 0, ['?'], { size: 120, sw: 16, fill: YEL }), { wobble: 4 });
  }
  return h;
}

/* ---------- 2. how many days do I remember? ---------- */
function tcalScene(t, lt, a) {
  const D = D11(a);
  if (a.full) return tcalFull(t, lt, a);
  let h = BG('url(#dayRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".3"/>');
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#C9AE8C"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  const hi = a.k === 1 ? Math.min(9, Math.floor(prog(lt, 0.05 * D, 0.55 * D) * 4)) : -1;
  h += yearCal(760, 440, 0.86, t, { hi, marks: { 0: picCake, 7: picNewPlace } });
  const zx = 1610, zy = 900;
  h += Z({ t, seed: 1103, x: zx, y: zy, s: 0.72, pose: a.k === 2 ? '턱괴기' : '서기', ex: exprAt(a.k === 1 ? [[0, '기본'], [0.55 * D, '놀람'], [0.8 * D, '걱정']] : (a.k === 2 ? [[0, '걱정']] : [[0, '기본']]), lt), look: [-0.9, -0.4] });
  if (!a.k) {
    h += pop(t, t - lt + 0.4 * D, t + 99, 0, 0, bubble(1600, 230, 380, 170, T8(0, 16, '며칠이나?', { size: 50, fill: NAVY })), {});
  } else if (a.k === 1) {
    if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 760, 520, label(0, 0, '기억나는 날: 거의 없음', { size: 46, bg: '#fff' }), { rot: -3 });
  } else {
    h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#0B1626" opacity="${f1(prog(lt, 0, 0.5) * 50) / 100}"/>`;
    h += pop(t, t - lt + 0.15, t + 99, 900, 470, big(0, 0, [[['나이 들면, ', '#fff']], [['시간이 빨라질까?', YEL]]], { size: 92, sw: 17, lh: 120 }), {});
  }
  return h;
}
function tcalFull(t, lt, a) { // that night: the last photo goes into the week
  const D = D11(a);
  let h = BG('url(#nightRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".3"/>');
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#1A2040"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  h += `<ellipse cx="960" cy="420" rx="900" ry="380" fill="url(#warm)" opacity="${f1((0.25 + 0.25 * prog(lt, 0.4 * D, 0.7 * D)) * 100) / 100}"/>`;
  h += weekCal(960, 420, 0.98, t, 6, { slideK: prog(lt, 0.25 * D, 0.55 * D), hi: lt > 0.55 * D ? 5 : -1 });
  h += Z({ t, seed: 1104, x: 1660, y: 940, s: 0.6, pose: lt < 0.5 * D ? '받기' : '서기', ex: exprAt([[0, '기본'], [0.5 * D, '뿌듯']], lt), look: [-0.8, -0.6], light: -1, shade: '#C9C0E8' });
  if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 960, 760, label(0, 0, '올해 가장 또렷한 하루', { size: 44, bg: YEL }), { rot: -2, bob: 3 });
  return h;
}

/* ---------- 3. the brain keeps a photo album ---------- */
function talbumScene(t, lt, a) {
  const D = D11(a), k = a.k || 0;
  let h = BG('url(#cream)') + BG('url(#paper)');
  h += `<ellipse cx="960" cy="520" rx="900" ry="420" fill="url(#warm)" opacity=".35"/>`;
  // brain-shaped album in the middle top
  h += pop(t, t - lt + (k ? -9 : 0.1), t + 99, 960, 200, `<g transform="scale(1.25)"><rect x="-170" y="-90" width="340" height="180" rx="30" fill="#FF9EB8" stroke="${INK}" stroke-width="8"/><path d="M-120 -40 q30 -30 60 0 q30 -30 60 0 q30 -30 60 0 M-120 20 q30 -30 60 0 q30 -30 60 0 q30 -30 60 0" fill="none" stroke="#E2557E" stroke-width="7" stroke-linecap="round"/><rect x="-14" y="-90" width="28" height="180" fill="#E2557E" stroke="${INK}" stroke-width="6"/></g>` + T8(0, 170, '뇌 = 사진첩', { size: 58, fill: NAVY }), {});
  // left: the same days, right: days with something new
  const lx = 520, rx = 1400, y = 640;
  if (k >= 1 || lt > 0.4 * D) {
    h += T8(rx, 440, '처음이 있는 날', { size: 50, fill: '#C2410C' });
    const pics = [picNewPlace, picNewFood, picBakery, picSunset, picCake, picSoup];
    const ap = k === 1 ? 2 + prog(lt, 0.1 * D, 0.8 * D) * 4 : (k > 1 ? 6 : prog(lt, 0.45 * D, 0.9 * D) * 2);
    pics.forEach((p, i) => { const show = clamp(ap - i, 0, 1); if (show <= 0) return; const col = i % 3, row = Math.floor(i / 3); h += polaroid(rx - 250 + col * 250, y - 30 + row * 250, lerp(0.3, 1.0, easeOutBack(show)), (rnd11(i + 3) - 0.5) * 16, p()); });
  }
  if (k >= 2) {
    h += T8(lx, 440, '늘 같은 날', { size: 50, fill: '#4A5568' });
    const mk = k === 2 ? prog(lt, 0.25 * D, 0.85 * D) : 1;
    for (let i = 5; i >= 0; i--) { const sx = lerp(lx - 300 + i * 120, lx, easeInOut(mk)), sy = lerp(y + (i % 2) * 60, y + 110 - i * 4, easeInOut(mk)); h += polaroid(sx, sy, 1.0, lerp((rnd11(i) - 0.5) * 18, (i - 3) * 2, mk), picSame()); }
    if (mk > 0.95 && k === 2) h += pop(t, t - lt + 0.85 * D, t + 99, lx, 860, label(0, 0, '겹쳐서 한 장', { size: 40, bg: '#fff' }), { rot: -3 });
  }
  if (k === 3) {
    h += pop(t, t - lt + 0.3 * D, t + 99, rx, 930, label(0, 0, '돌아보면 길다', { size: 44, bg: YEL }), { rot: 3 });
    h += pop(t, t - lt + 0.55 * D, t + 99, lx, 930, label(0, 0, '돌아보면 짧다', { size: 44, bg: '#C9D2DC' }), { rot: -3 });
  }
  return h;
}

/* ---------- 4. the survey: one year feels the same at every age ---------- */
function tsurveyScene(t, lt, a) {
  const D = D11(a), k = a.k || 0;
  let h = BG('url(#labG)') + BG('url(#grid)');
  if (k === 0 || k === 1) {
    const ages = [14, 25, 35, 45, 55, 65, 75, 94];
    ages.forEach((ag, i) => {
      const at0 = 0.25 * D + i * 0.18, x = 220 + i * 210; if (lt < at0 && k === 0) return;
      const old = ag >= 65;
      h += pop(t, t - lt + (k === 0 ? at0 : -9), t + 99, x, 640, (old ? GP : Z)({ t, seed: 1110 + i, x: 0, y: 220, s: 0.42 + (ag < 20 ? -0.06 : 0), ex: exprAt([[0, '기본']], t), look: [0, -0.2], vest: old ? '#A67C52' : ['#FF9A55', '#5B8FD6', '#6DBE55', '#F49AC1', '#9C7A55', '#7A3E8E'][i % 6] }) + T8(0, 290, ag + '세', { size: 36, fill: '#fff' }), {});
    });
    h += pop(t, t - lt + (k === 0 ? 0.1 : -9), t + 99, 960, 170, big(0, 0, [[['14세 ~ 94세 · ', '#fff'], ['499명', YEL]]], { size: 76, sw: 14 }), {}).replace('translate(960 170)', 'translate(960 290)');
    if (k === 1) h += pop(t, t - lt + 0.05, t + 99, 0, 0, speech(960, 450, 1080, 120, '지난 1년은 얼마나 빨리 지나갔나요?', 960, 580, { size: 46 }), { noPop: true, inDur: 0.3 });
    return h;
  }
  // chart: x = age, y = "felt speed" (concept sketch, no numbers)
  const X0 = 360, X1 = 1600, Y0 = 820, Y1 = 280;
  h += `<rect x="${X0 - 80}" y="${Y1 - 70}" width="${X1 - X0 + 160}" height="${Y0 - Y1 + 170}" rx="24" fill="#0F1E33" opacity=".75" stroke="${MINT}" stroke-width="3"/>`;
  h += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="#fff" stroke-width="6"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1 - 20}" stroke="#fff" stroke-width="6"/>`;
  h += T8((X0 + X1) / 2, Y0 + 66, '나이 →', { size: 36, fill: '#fff' }) + T8(X0 - 30, Y1 - 36, '빠르게 느낀 정도', { size: 32, fill: '#fff', anchor: 'start' });
  [14, 30, 50, 70, 94].forEach(ag => { const x = lerp(X0, X1, (ag - 14) / 80); h += T8(x, Y0 + 40, ag + '', { size: 28, fill: '#C9D2DC' }); });
  const yr = prog(lt, 0.1 * D, 0.6 * D) * (k === 2 ? 1 : 1);
  const yY = 560;
  h += `<path d="M${X0} ${yY} L${f1(lerp(X0, X1, k >= 2 ? (k === 2 ? yr : 1) : 0))} ${yY}" stroke="${MINT}" stroke-width="12" stroke-linecap="round"/>`;
  h += pop(t, t - lt + (k === 2 ? 0.55 * D : -9), t + 99, X1 + 10, yY - 50, label(0, 0, '지난 1년: 비슷', { size: 36, bg: MINT }), {});
  if (k >= 3) {
    const pk = k === 3 ? prog(lt, 0.3 * D, 0.85 * D) : 1, n = 40;
    let d = '';
    for (let i = 0; i <= n * pk; i++) { const u = i / n, ag = 14 + u * 80, yv = 560 - 260 * Math.min(1, (ag - 14) / 40); d += (i ? ' L' : 'M') + f1(lerp(X0, X1, u)) + ' ' + f1(yv); }
    h += `<path d="${d}" fill="none" stroke="${YEL}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (pk > 0.9) h += pop(t, t - lt + (k === 3 ? 0.85 * D : -9), t + 99, X1 - 80, 290, label(0, 0, '지난 10년: 나이 들수록 빠르게', { size: 34, bg: YEL }), {});
    h += T8(X1 + 60, Y0 + 120, '※ 결과를 쉽게 그린 개념도', { size: 26, fill: '#C9D2DC', anchor: 'end' });
  }
  if (k === 4) {
    h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#0B1626" opacity="${f1(prog(lt, 0, 0.4) * 55) / 100}"/>`;
    h += pop(t, t - lt + 0.2, t + 99, 960, 420, big(0, 0, ['익숙한 날이 쌓일수록', [['돌아볼 사진은 ', '#fff'], ['줄어든다', YEL]]], { size: 76, sw: 15, lh: 104 }), {});
  }
  return h;
}

/* ---------- title: this week's experiment ---------- */
const LIST11 = ['출근길 바꾸기', '처음 먹는 메뉴', '시계 없이 하루', '처음 가는 공원', '할아버지께 질문'];
titleScene = function (t, lt, a) {
  let h = BG('url(#labG)') + BG('url(#grid)');
  h += particles(t, 11, 40, [0, 0, 1920, 1080], YEL, { speed: 40, r: 4, op: 0.6 });
  if (a.list) {
    h += big(960, 130, ['만약에, 매일 \'처음\'을 하나씩 만든다면?'], { size: 56, sw: 12, fill: YEL });
    LIST11.forEach((it, i) => {
      const at0 = 0.12 * (a._dur || 6) + i * 0.45; if (lt < at0) return;
      const k = easeOutBack(clamp((lt - at0) / 0.4, 0, 1)), y = 290 + i * 128;
      h += `<g opacity="${f1(clamp(k, 0, 1) * 100) / 100}" transform="translate(${f1(lerp(-120, 0, clamp(k, 0, 1)))} 0)">${label(330, y, DAYS[i] + '요일', { size: 40, bg: i === 4 ? YEL : MINT })}${T8(470, y + 20, it, { anchor: 'start', size: 58, fill: '#fff' })}</g>`;
    });
    h += `<ellipse cx="1600" cy="900" rx="220" ry="50" fill="url(#glow)"/>`;
    h += Z({ t, seed: 1105, x: 1600, y: 900, s: 0.56, pose: '손인사', ex: exprAt([[0, '신남']], lt), look: [-0.6, -0.2] });
    return h;
  }
  h += `<ellipse cx="960" cy="900" rx="320" ry="70" fill="url(#glow)"/><ellipse cx="960" cy="900" rx="260" ry="54" fill="#2E4260" stroke="${INK}" stroke-width="8"/>`;
  h += doctor(520, 960, 0.55, { t, expr: '미소', talk: env(t) });
  h += pop(t, t - lt + 0.2, t + 99, 960, 230, big(0, 0, [[['만약에, ', YEL], ['일주일 동안', '#fff']], '매일 \'처음\'을 하나씩 만든다면?'], { size: 84, sw: 17 }), {});
  h += Z({ t, seed: 7, x: 960, y: 890, s: 0.6, pose: '서기', ex: exprAt([[0, '결심']], lt) });
  if (lt > 1.4) h += pop(t, t - lt + 1.4, t + 99, 1440, 680, polaroid(0, 0, 1.0, 6, picNewPlace(), { cap: '처음 하나' }), { bob: 4 });
  return h;
};

/* ---------- 5. Zero's week ---------- */
function dayPill(d) { return `<g transform="translate(260 120)"><rect x="-200" y="-44" width="400" height="88" rx="44" fill="${NAVY}" opacity=".88" stroke="${YEL}" stroke-width="5"/>${T8(0, 16, DAYS[d] + '요일 · 처음 하나', { size: 40, fill: YEL })}</g>`; }
function snapTo(t, lt, D, d, x, y) { // a polaroid of today's first pops out
  const k = prog(lt, 0.72 * D, 0.82 * D);
  let h = flashBurst(x, y - 120, prog(lt, 0.68 * D, 0.8 * D));
  if (k > 0) h += polaroid(lerp(x, 1640, easeInOut(prog(lt, 0.86 * D, 1.0 * D))), lerp(y, 300, easeInOut(prog(lt, 0.86 * D, 1.0 * D))), lerp(0.4, 1.05, easeOutBack(k)), 6, WEEKPICS[d](), { cap: WEEKCAP[d] });
  return h;
}
function alleyBg(t) {
  let h = BG('url(#morning)');
  const cols = ['#F2D27A', '#9CC9DE', '#F49AC1', '#B8D98A', '#E8B58A', '#C9B8E8'];
  for (let i = 0; i < 9; i++) { const x = -200 + i * 270, w = 240, hh = 360 + (i * 73 % 3) * 70; h += `<rect x="${x}" y="${880 - hh}" width="${w}" height="${hh}" fill="${cols[i % 6]}" stroke="${INK}" stroke-width="7"/>`; for (let r = 0; r < 3; r++) h += `<rect x="${x + 40}" y="${880 - hh + 50 + r * 100}" width="60" height="60" rx="6" fill="#FFFDF7" stroke="${INK}" stroke-width="5"/><rect x="${x + 140}" y="${880 - hh + 50 + r * 100}" width="60" height="60" rx="6" fill="#FFFDF7" stroke="${INK}" stroke-width="5"/>`; }
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#B9B4AA"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  return h;
}
function bakeryFront(x, y, s) {
  let h = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-260" y="-420" width="520" height="420" fill="#F4E2C4" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 8; i++) h += `<path d="M${-260 + i * 65} -420 L${-260 + (i + 1) * 65} -420 L${-260 + (i + 1) * 65} -360 Q${-227.5 + i * 65} -336 ${-260 + i * 65} -360 Z" fill="${i % 2 ? '#fff' : '#E2553A'}" stroke="${INK}" stroke-width="5"/>`;
  h += `<rect x="-220" y="-300" width="260" height="190" rx="8" fill="#FFF6DD" stroke="${INK}" stroke-width="7"/><rect x="90" y="-280" width="130" height="280" fill="#8A5A34" stroke="${INK}" stroke-width="7"/>`;
  h += [[-170, -150], [-110, -150], [-50, -150], [-140, -200], [-80, -200]].map(([bx, by]) => `<ellipse cx="${bx}" cy="${by}" rx="30" ry="18" fill="#C98A3E" stroke="${INK}" stroke-width="5"/>`).join('');
  h += `<rect x="-120" y="-470" width="240" height="56" rx="10" fill="#fff" stroke="${INK}" stroke-width="6"/>` + T8(0, -430, '작은 빵집', { size: 34, fill: '#8A5A34' });
  return h + '</g>';
}
function counterBg(t) {
  let h = BG('#F7E7CF') + BG('url(#hatch)').replace('/>', ' opacity=".25"/>');
  h += `<rect x="300" y="90" width="760" height="330" rx="16" fill="#2E3A2E" stroke="${INK}" stroke-width="9"/>` + T8(680, 160, '오늘의 메뉴', { size: 44, fill: '#fff' });
  ['김치찌개', '제육볶음', '팟타이 (NEW)', '돈가스'].forEach((m, i) => h += T8(360, 230 + i * 50, '· ' + m, { size: 36, fill: i === 2 ? YEL : '#E8F0E8', anchor: 'start' }));
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#C9AE8C"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  return h;
}
function deskBg(t) {
  let h = BG('url(#dayRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".3"/>');
  h += windowDay(1380, 140, 360, 280, t);
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#C9AE8C"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  return h;
}
function wallClock(x, y, s, hh, mm, covered) {
  let h = `<g transform="translate(${x} ${y}) scale(${s})"><circle r="110" fill="#fff" stroke="${INK}" stroke-width="10"/>`;
  for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2; h += `<circle cx="${f1(Math.sin(an) * 88)}" cy="${f1(-Math.cos(an) * 88)}" r="6" fill="${INK}"/>`; }
  const ah = ((hh % 12) + mm / 60) / 12 * Math.PI * 2, am = mm / 60 * Math.PI * 2;
  h += `<path d="M0 0 L${f1(Math.sin(ah) * 52)} ${f1(-Math.cos(ah) * 52)}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0 0 L${f1(Math.sin(am) * 80)} ${f1(-Math.cos(am) * 80)}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><circle r="10" fill="${RED}"/>`;
  if (covered > 0) h += `<g opacity="${f1(covered * 100) / 100}"><rect x="-120" y="-120" width="240" height="240" rx="12" fill="#FFE27A" stroke="${INK}" stroke-width="8" transform="rotate(-4)"/>${T8(0, 18, '시계 금지!', { size: 44, fill: NAVY })}</g>`;
  return h + '</g>';
}
P['폰통화'] = Object.assign({ armL: P['서기'].armL, hL: P['서기'].hL, armR: [[252, 285], [326, 300], [330, 226]], hR: [330, 218] }, LEGS);
function callPhone(x, y, s) { const [hx, hy] = handG(x, y, s, P['폰통화'].hR); return `<g transform="translate(${f1(hx - 6 * s)} ${f1(hy - 30 * s)}) rotate(8) scale(${s})"><rect x="-18" y="-46" width="36" height="88" rx="10" fill="#2A3550" stroke="${INK}" stroke-width="6"/><rect x="-11" y="-36" width="22" height="58" rx="4" fill="#5B8FD6"/></g>` + hand(hx, hy, s); }
function phoneHome(x, y, s, t, talk) { // grandpa at home on the phone (right half of a split screen)
  let h = `<rect x="980" y="-600" width="1600" height="2280" fill="#F3E3C8"/><rect x="980" y="-600" width="1600" height="2280" fill="url(#hatch)" opacity=".3"/>`;
  h += `<rect x="1460" y="140" width="300" height="230" rx="10" fill="#FFF6DD" stroke="${INK}" stroke-width="8"/>` + polaroid(1610, 255, 0.8, -3, picCamera());
  h += `<rect x="980" y="880" width="1600" height="600" fill="#B08A64"/><line x1="980" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  h += GP({ t, seed: 1120, x: 1380, y: 900, s: 0.78, pose: '폰통화', ex: exprAt([[0, talk ? '신남' : '뿌듯']], t), look: [-0.4, -0.1] }) + callPhone(1380, 900, 0.78);
  return h;
}

function tdayScene(t, lt, a) {
  const D = D11(a), d = a.d || 0, k = a.k || 0;
  let h = '';
  if (d === 0) { // Monday: a new alley, a small bakery
    h = alleyBg(t);
    const walkK = k ? 1 : prog(lt, 0, D), zx = k ? 760 : lerp(200, 900, walkK), step = k ? 0 : Math.sin(t * 9);
    if (k) h += bakeryFront(1340, 880, 1.0);
    h += Z({ t, seed: 1130, x: zx, y: 900 + Math.abs(step) * -6, s: 0.72, pose: k ? '서기' : walkPose(t * 7.5, 0.85), ex: exprAt(k ? [[0, '기본'], [0.25 * D, '놀람'], [0.45 * D, '신남']] : [[0, '기본']], lt), look: k ? [0.9, -0.2] : [0.6, 0] });
    if (!k) h += pop(t, t - lt + 0.3 * D, t + 99, 1500, 380, label(0, 0, '한 번도 안 가 본 골목', { size: 42, bg: '#fff' }), { rot: 3 });
    else { h += pop(t, t - lt + 0.05, t + 99, 520, 340, label(0, 0, '+5분', { size: 40, bg: '#C9D2DC' }), {}); h += snapTo(t, lt, D, 0, 1340, 500); }
    return h + dayPill(0);
  }
  if (d === 1) { // Tuesday: a dish never tried
    h = counterBg(t) + clothTable(200, 760, 1500, '#F2E6CC', '#B5763A', 1480);
    const zx = 1240;
    h += Z({ t, seed: 1131, x: zx, y: 900, s: 0.78, pose: k ? '서기' : '가리키기', ex: exprAt(k ? [[0, '걱정'], [0.3 * D, '놀람'], [0.55 * D, '신남']] : [[0, '결심']], lt), look: k ? [-0.4, 0.3] : [-0.9, -0.6] });
    if (k) {
      h += `<g transform="translate(900 770)"><ellipse cx="0" cy="0" rx="170" ry="44" fill="#fff" stroke="${INK}" stroke-width="7"/>` +
        [...Array(9)].map((_, i) => `<path d="M${-110 + i * 26} ${-6 + (i % 2) * 6} q30 -26 60 -4 q20 14 40 -6" fill="none" stroke="#E9C46A" stroke-width="12" stroke-linecap="round"/>`).join('') +
        `<path d="M-70 -16 q20 -30 40 0" fill="none" stroke="#FF9E80" stroke-width="16" stroke-linecap="round"/><path d="M30 -20 q20 -30 40 0" fill="none" stroke="#FF9E80" stroke-width="16" stroke-linecap="round"/>` +
        `<path d="M110 -20 L150 -36 L150 -2 Z" fill="#B5E36B" stroke="${INK}" stroke-width="5"/>` + [-20, 6, 40].map(x => `<circle cx="${x}" cy="-30" r="6" fill="#C98A3E"/>`).join('') +
        [-50, 30].map(x => `<path d="M${x} ${f1(-60 - (t * 20 % 20))} q14 -20 0 -40" fill="none" stroke="#fff" stroke-width="7" opacity=".7"/>`).join('') + `</g>`;
      if (lt > 0.3 * D && lt < 0.6 * D) h += pop(t, t - lt + 0.3 * D, t - lt + 0.6 * D, 1420, 300, label(0, 0, '새콤 · 달콤 · 낯설고', { size: 42, bg: YEL }), { rot: -3, wobble: 2 });
      h += snapTo(t, lt, D, 1, 900, 640);
    } else h += pop(t, t - lt + 0.3 * D, t + 99, 680, 520, label(0, 0, '처음 먹어 보는 메뉴', { size: 42, bg: '#fff' }), { rot: -3 });
    return h + dayPill(1);
  }
  if (d === 2) { // Wednesday: no clock
    h = deskBg(t) + tableG(300, 700, 900);
    h += wallClock(1080, 330, 0.95, 10, 30, k ? 1 - prog(lt, 0.42 * D, 0.52 * D) : prog(lt, 0.3 * D, 0.45 * D));
    h += phone(860, 680, 0.42, { on: 1, rot: -8, content: `<rect x="-52" y="-98" width="104" height="196" fill="#1B2A44"/><rect x="-40" y="-70" width="80" height="34" rx="6" fill="#FFE27A"/>` });
    h += Z({ t, seed: 1132, x: 600, y: 900, s: 0.78, pose: '서기', ex: exprAt(k ? [[0, '지침'], [0.5 * D, '놀람'], [0.62 * D, '신남']] : [[0, '결심']], lt), look: k ? (lt > 0.5 * D ? [1, -0.5] : [0.3, 0.3]) : [1, -0.5] });
    if (k) { if (lt < 0.5 * D) h += pop(t, t - lt + 0.05, t - lt + 0.5 * D, 0, 0, bubble(560, 230, 360, 160, T8(0, 14, '점심시간?', { size: 46, fill: NAVY })), {}); else h += pop(t, t - lt + 0.52 * D, t + 99, 1080, 540, label(0, 0, '오전 10:30', { size: 46, bg: YEL }), { wobble: 3 }); h += snapTo(t, lt, D, 2, 1180, 560); }
    else h += pop(t, t - lt + 0.5 * D, t + 99, 600, 300, label(0, 0, '시프르처럼', { size: 42, bg: '#fff' }), { rot: -3 });
    return h + dayPill(2);
  }
  if (d === 3) { // Thursday: sunset in a new park
    h = parkBg(t);
    h += Z({ t, seed: 1133, x: 820, y: 900, s: 0.72, pose: '서기', ex: exprAt(k ? [[0, '기본'], [0.4 * D, '뿌듯']] : [[0, '신남']], lt), look: [0.8, -0.8] });
    if (!k) h += pop(t, t - lt + 0.3 * D, t + 99, 600, 300, label(0, 0, '처음 가 보는 공원', { size: 42, bg: '#fff' }), { rot: -3 });
    else { if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 1240, 260, label(0, 0, '눈으로만 담기', { size: 44, bg: YEL }), { rot: 3 }); h += snapTo(t, lt, D, 3, 1450, 520); }
    return h + dayPill(3);
  }
  // Friday: a first question for grandpa (split screen)
  h = deskBg(t);
  h += Z({ t, seed: 1134, x: 520, y: 900, s: 0.78, pose: '폰통화', ex: exprAt(k === 2 ? [[0, '놀람'], [0.5 * D, '뿌듯']] : [[0, '신남']], lt), look: [0.5, -0.1] }) + callPhone(520, 900, 0.78);
  h += phoneHome(0, 0, 1, t, k >= 1 && lt > 0.4 * D);
  h += `<line x1="980" y1="-600" x2="980" y2="1680" stroke="${INK}" stroke-width="10"/>`;
  if (k === 1) h += pop(t, t - lt + 0.05, t + 99, 0, 0, speech(500, 230, 640, 120, '스무 살 때 꿈은 뭐였어요?', 520, 400, { size: 42 }), { noPop: true, inDur: 0.3 });
  if (k === 2) {
    h += pop(t, t - lt + 0.05, t + 99, 0, 0, bubble(1720, 400, 340, 220, shutter(0, -10, 1.1, t)), {});
    h += pop(t, t - lt + 0.25 * D, t + 99, 1300, 160, label(0, 0, '사진사가 꿈이었단다', { size: 42, bg: YEL }), { rot: 3 });
    h += snapTo(t, lt, D, 4, 960, 520);
  }
  return h + dayPill(4);
}

/* ---------- 6. the week fills up ---------- */
function tweekScene(t, lt, a) {
  const D = D11(a), k = a.k || 0;
  let h = BG('url(#cream)') + BG('url(#paper)');
  h += `<ellipse cx="960" cy="440" rx="900" ry="380" fill="url(#warm)" opacity=".35"/>`;
  const n = k ? 5 : Math.min(5, 1 + Math.floor(prog(lt, 0.05 * D, 0.8 * D) * 5));
  h += weekCal(960, 400, 0.98, t, n, { slideK: k ? null : (prog(lt, 0.05 * D, 0.8 * D) * 5) % 1 + (n === 5 && lt > 0.8 * D ? 1 : 0) });
  h += Z({ t, seed: 1140, x: 1720, y: 960, s: 0.52, pose: '손인사', ex: exprAt([[0, '뿌듯']], lt), look: [-0.8, -0.6] });
  if (k) {
    h += pop(t, t - lt + 0.1, t + 99, 820, 830, big(0, 0, [[['이번 주는, ', '#fff'], ['길었다', YEL]]], { size: 80, sw: 15 }), {});
  }
  return h;
}

function parkBg(t) {
  let h = `<rect x="-600" y="-600" width="3120" height="2280" fill="url(#sunset)"/><circle cx="1450" cy="430" r="90" fill="#FFD27A" opacity=".95"/><circle cx="1450" cy="430" r="220" fill="url(#warm)"/>`;
  h += clouds(t, 80, 18, 4, 3);
  for (let i = -1; i < 7; i++) { const x = i * 600; h += `<path d="M${x} 560 L${x} 470 L${x + 60} 470 L${x + 60} 430 L${x + 130} 430 L${x + 130} 500 L${x + 200} 500 L${x + 200} 440 L${x + 260} 440 L${x + 260} 520 L${x + 340} 520 L${x + 340} 450 L${x + 420} 450 L${x + 420} 490 L${x + 520} 490 L${x + 520} 470 L${x + 600} 470 L${x + 600} 560 Z" fill="#8E7BA8" stroke="${INK}" stroke-width="6"/>`; }
  h += `<rect x="-600" y="560" width="3120" height="170" fill="url(#river)"/><rect x="-600" y="730" width="3120" height="40" fill="#8CCB7A" stroke="${INK}" stroke-width="5"/>`;
  h += trees2(0, 790, t, true);
  h += `<rect x="-600" y="800" width="3120" height="160" fill="#D9C7B0" stroke="${INK}" stroke-width="6"/><rect x="-600" y="960" width="3120" height="400" fill="#9BCF84"/><rect x="-600" y="960" width="3120" height="400" fill="url(#hatch)"/>`;
  return h + `<rect x="-600" y="-600" width="3120" height="2280" fill="#FF9A5A" opacity=".12"/>`;
}
/* ---------- 7. walking home with grandpa ---------- */
function tstudioScene(t, lt, a) { // only line k=3 is drawn here; the photo studio lines are AI pictures
  const D = D11(a);
  if (a.k !== 3) return '';
  let h = parkBg(t);
  const gx = 560, zx = 860;
  h += GP({ t, seed: 1150, x: gx, y: 900, s: 0.74, pose: '지팡이', ex: exprAt([[0, '뿌듯']], lt), look: [0.6, -0.1] });
  { const [cx, cy] = handG(gx, 900, 0.74, P['지팡이'].hR); h += `<path d="M${f1(cx)} ${f1(cy)} L${f1(cx + 10)} 905" stroke="#6B4A2E" stroke-width="12" stroke-linecap="round"/><path d="M${f1(cx - 18)} ${f1(cy - 6)} Q${f1(cx)} ${f1(cy - 30)} ${f1(cx + 6)} ${f1(cy)}" fill="none" stroke="#6B4A2E" stroke-width="12" stroke-linecap="round"/>` + hand(cx, cy, 0.74); }
  h += Z({ t, seed: 1151, x: zx, y: 905, s: 0.7, pose: '서기', ex: exprAt([[0, '뿌듯'], [0.6 * D, '신남']], lt), look: [-0.7, -0.2] });
  // the photo they just took, floating beside them with a soft glow
  h += `<ellipse cx="1430" cy="470" rx="330" ry="300" fill="url(#warm)" opacity=".7"/>`;
  h += pop(t, t - lt + 0.1, t + 99, 1430, 470, polaroid(0, 0, 1.5, 5, picDuo(), { cap: '할아버지와 첫 사진', capSize: 22 }), { bob: 4 });
  h += spark11(1250, 250, 0.9, t) + spark11(1640, 700, 0.7, t + 1.3, MINT);
  if (lt > 0.42 * D) h += pop(t, t - lt + 0.42 * D, t + 99, 0, 0, speech(560, 210, 660, 120, '올해 중에… 오늘이 제일 길었다', 560, 400, { size: 44 }), { noPop: true, inDur: 0.35 });
  return h;
}

/* ---------- 8. closing ---------- */
function tendScene(t, lt, a) {
  const D = D11(a);
  if (a.ask) {
    let h = BG('url(#nightRoom)') + `<rect x="-600" y="880" width="3120" height="600" fill="#1A2040"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
    h += windowNight(1300, 120, 520, 420, t) + `<ellipse cx="900" cy="420" rx="700" ry="320" fill="url(#warm)" opacity=".3"/>`;
    h += Z({ t, seed: 1160, x: 760, y: 920, s: 0.76, pose: '손인사', ex: exprAt([[0, '신남']], t), look: [-0.2, -0.2], light: 1, shade: '#C9C0E8' });
    h += pop(t, t - lt + 0.15, t + 99, 0, 0, speech(800, 240, 900, 140, "누구와, 어떤 '처음'을?", 780, 520, { size: 52 }), { noPop: true, inDur: 0.3 });
    h += pop(t, t - lt + 0.5 * D, t + 99, 1380, 780, label(0, 0, '댓글로 들려주세요', { size: 44, bg: MINT }), { rot: -3 });
    return h;
  }
  let h = BG('url(#cream)') + BG('url(#paper)') + `<ellipse cx="960" cy="480" rx="900" ry="400" fill="url(#warm)" opacity=".4"/>`;
  if (!a.k) {
    h += weekCal(960, 520, 0.8, t, 6, {});
    h += pop(t, t - lt + 0.1, t + 99, 960, 120, big(0, 0, [[['빨라진 건 시간이 아니라, ', '#fff'], ["줄어든 '처음'", YEL]]], { size: 64, sw: 13 }), {});
    return h;
  }
  if (a.k === 1) {
    h += yearCal(960, 470, 0.8, t, { marks: { 0: picCake, 7: picNewPlace, 9: picDuo } });
    h += pop(t, t - lt + 0.2, t + 99, 960, 100, big(0, 0, [[['빨랐던 한 해 = ', '#fff'], ['성실했던 한 해', YEL]]], { size: 64, sw: 13 }), {});
    return h;
  }
  h += polaroid(960, 430, 2.1, -3, picDuo());
  h += pop(t, t - lt + 0.25 * D, t + 99, 960, 860, big(0, 0, [[["올해가 가기 전, '처음' 하나", '#fff']], [['좋아하는 사람과 함께', YEL]]], { size: 60, sw: 13, lh: 80 }), {});
  return h;
}

thanksScene = function (t, lt) {
  let h = BG(NAVY) + BG('url(#grid)');
  h += `<ellipse cx="700" cy="560" rx="620" ry="460" fill="url(#warm)" opacity=".55"/>`;
  h += particles(t, 78, 30, [0, 0, 1920, 1080], YEL, { speed: 30, r: 5, op: 0.6 });
  for (let i = 0; i < 6; i++) { const k = ((t * 0.18 + i / 6) % 1); const hx0 = [1180, 1320, 1460, 1600, 1740, 1860][i]; h += `<g opacity="${f1(Math.sin(k * Math.PI) * 70) / 100}">${heart(hx0, 900 - k * 760, 1.1, [PINK, YEL, MINT][i % 3])}</g>`; }
  const k = easeOutBack(clamp(prog(lt, 0.05, 0.9), 0, 1));
  h += `<g transform="translate(680 540) rotate(${f1(lerp(-12, -3, clamp(k, 0, 1)))}) scale(${f1(lerp(0.6, 1, clamp(k, 0, 1)) * 1000) / 1000})">${polaroid(0, 0, 2.55, 0, picDuo(), { cap: '처음 함께 찍은 사진', capSize: 16 })}</g>`;
  h += pop(t, t - lt + 0.5, t + 99, 1420, 360, outlined(0, 0, [[['끝까지 함께해', '#fff']], [['주셔서', '#fff']], [['고맙습니다', YEL]]], { size: 88, sw: 16, lh: 108 }), {});
  h += pop(t, t - lt + 1.4, t + 99, 1420, 720, label(0, 0, '상식실험실', { size: 48, bg: MINT }), {});
  return h;
};
