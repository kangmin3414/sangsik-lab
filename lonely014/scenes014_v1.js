/* ---------- experiment 014: alone but lonely — Schopenhauer's porcupines, the right distance ---------- */
// Schopenhauer: bald crown, two big white tufts at the temples, dark frock coat, white collar.
// 서준 (Seojun): Zero's university friend, short black hair, navy jacket. Guard: grey hair, olive uniform.
// Poodle (Atman): white, pompom puffs. Porcupines of the parable: drawn as round brown hedgehogs (the Korean '고슴도치').

function tufts14() { // white side tufts, unioned like a cloud (ink rims first, fills on top)
  const L = [[96, 112, 22], [80, 136, 28], [68, 164, 30], [70, 194, 27], [86, 218, 22], [60, 140, 20], [54, 176, 20]];
  const cs = L.concat(L.map(([x, y, r]) => [400 - x, y, r]));
  let h = cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 6}" fill="${INK}"/>`).join('');
  h += cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#F1F1EE"/>`).join('');
  h += `<g fill="none" stroke="#C9C9C4" stroke-width="4" stroke-linecap="round"><path d="M64 150 q10 -8 20 0 M58 184 q10 -8 20 0 M76 210 q8 -6 16 0 M336 150 q-10 -8 -20 0 M342 184 q-10 -8 -20 0 M324 210 q-8 -6 -16 0"/></g>`;
  return h;
}
function sch14(svg) { // add the tufts right after the head outline so they sit over its edge
  return svg.replace(/(<ellipse cx="200" cy="170" rx="118" ry="112" fill="none" stroke="#141414" stroke-width="8"\/>)/, '$1' + tufts14());
}
const SCH = o => HALO(sch14(char(Object.assign({ goggles: 'none', vest: '#2F3442', patch: false, tee: true, vshade: 'rgba(0,0,0,0.3)', collar: true, tie: '#E9E5DA' }, o))));
const SJ = o => HALO(char(Object.assign({ goggles: 'none', vest: '#3E5C84', patch: false, tee: true, vshade: 'rgba(0,20,60,0.25)', hair: '#2B2B2B' }, o)));
const GD = o => HALO(char(Object.assign({ goggles: 'none', vest: '#6A7A5C', patch: false, tee: true, vshade: 'rgba(0,0,0,0.22)', hair: '#9A9A9A' }, o)));

function poodle14(x, y, s, t, o = {}) { // white poodle standing, (x, y) = ground centre, faces right (o.flip = left)
  const bob = o.still ? 0 : Math.sin(t * 6 + (o.seed || 0)) * 3, wag = o.still ? 0 : Math.sin(t * 9) * 10;
  const puff = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r + 5}" fill="${INK}"/>`;
  const fill = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FAF8F2"/>`;
  const P = [[-70, -150, 34], [-30, -158, 40], [10, -150, 34], [56, -196, 34], [70, -236, 30], [44, -250, 22], [92, -182, 18], [-92, -192, 18],
             [-64, -40, 20], [-24, -40, 20], [28, -40, 20], [62, -40, 20]];
  let legs = '';
  [[-64], [-24], [28], [62]].forEach(([lx]) => { legs += `<rect x="${lx - 8}" y="-110" width="16" height="70" rx="8" fill="#FAF8F2" stroke="${INK}" stroke-width="5"/>`; });
  let h = `<g transform="translate(${f1(x)} ${f1(y + bob)}) scale(${o.flip ? -s : s} ${s})">${legs}`;
  h += `<g transform="rotate(${f1(wag)} -92 -170)">${puff(-92, -192, 18)}${fill(-92, -192, 18)}<line x1="-80" y1="-170" x2="-92" y2="-186" stroke="${INK}" stroke-width="5"/></g>`;
  h += P.filter((_, i) => i !== 7).map(([a, b, r]) => puff(a, b, r)).join('') + P.filter((_, i) => i !== 7).map(([a, b, r]) => fill(a, b, r)).join('');
  h += `<ellipse cx="96" cy="-222" rx="16" ry="12" fill="#FAF8F2" stroke="${INK}" stroke-width="5"/><circle cx="108" cy="-224" r="5" fill="${INK}"/><circle cx="74" cy="-236" r="5" fill="${INK}"/>`;
  h += `<path d="M48 -214 q-14 26 -2 44" fill="none" stroke="#D8D4C8" stroke-width="5" stroke-linecap="round"/></g>`;
  return h;
}

function hog14(x, y, s, t, o = {}) { // round hedgehog, (x, y) = ground centre; o.flip faces left; o.ouch flinch; o.cold shiver; o.ex 'sad'|'happy'
  const sh = o.cold ? Math.sin(t * 40 + (o.seed || 0)) * 3 : 0, fl = o.ouch ? -10 * o.ouch : 0;
  let spikes = '';
  for (let k = 0; k <= 16; k++) {
    const a = Math.PI * (1.02 + 0.96 * k / 16), r0 = 92, r1 = 132 + (k % 2 ? 0 : 14);
    const a2 = a + 0.08, a3 = a - 0.08;
    spikes += `<path d="M${f1(Math.cos(a3) * r0)} ${f1(-60 + Math.sin(a3) * r0)} L${f1(Math.cos(a) * r1)} ${f1(-60 + Math.sin(a) * r1)} L${f1(Math.cos(a2) * r0)} ${f1(-60 + Math.sin(a2) * r0)} Z" fill="#6B4A32" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  }
  const happy = o.ex === 'happy', sad = o.ex === 'sad';
  let h = `<g transform="translate(${f1(x + sh)} ${f1(y)}) scale(${o.flip ? -s : s} ${s}) translate(${fl} 0)">`;
  h += `<ellipse cx="0" cy="6" rx="110" ry="16" fill="#000" opacity=".18"/>` + spikes;
  h += `<path d="M-104 0 Q-110 -150 0 -158 Q110 -150 104 0 Z" fill="#8A6244" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  h += `<path d="M30 0 Q24 -96 92 -104 Q140 -92 136 -40 Q132 0 96 0 Z" fill="#F2DEC0" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  h += `<circle cx="138" cy="-46" r="11" fill="${INK}"/>`;
  h += happy ? `<path d="M80 -70 q10 -10 20 0" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` : `<circle cx="90" cy="-68" r="8" fill="${INK}"/>`;
  if (sad) h += `<path d="M76 -88 L102 -80" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  h += happy ? `<path d="M104 -24 q12 10 24 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` : '';
  h += `<circle cx="70" cy="-40" r="10" fill="#F4A3A3" opacity=".6"/>`;
  h += `<rect x="-60" y="-6" width="26" height="14" rx="7" fill="#5A3E2A"/><rect x="40" y="-6" width="26" height="14" rx="7" fill="#5A3E2A"/>`;
  return h + '</g>';
}

/* ================= ep.014 scenes ================= */
Object.assign(CAMS, {
  lroom: [1.0, 1.05, 960, 560], lhook: [1.0, 1.04, 960, 540], lstat: [1.0, 1.03, 960, 520], lwhy: [1.0, 1.04, 960, 540], lhealth: [1.0, 1.03, 960, 520],
  lsch: [1.0, 1.04, 960, 520], lquote: [1.0, 1.04, 960, 520], lporc: [1.0, 1.04, 960, 560], llab: [1.0, 1.05, 960, 540], ltitle: [1.0, 1.03, 960, 520],
  lsolo: [1.0, 1.05, 960, 560], lsolos: [1.0, 1.03, 960, 520], lfire: [1.0, 1.04, 960, 560], lguard: [1.0, 1.05, 960, 560], ltrain: [1.0, 1.04, 960, 540],
  lmsg: [1.0, 1.04, 960, 540], lreach: [1.0, 1.03, 960, 520], lwait: [1.0, 1.06, 960, 560], lletter: [1.0, 1.04, 960, 540], lreply: [1.0, 1.04, 960, 540],
  lwalk: [1.0, 1.04, 960, 540], lend: [1.0, 1.04, 960, 560], lrecap: [1.0, 1.03, 960, 520], lcare: [1.0, 1.03, 960, 520]
});
const D14 = a => a._dur || 5;
if (!P['앉아설명']) P['앉아설명'] = Object.assign({}, P['앉기'], { armR: P['설명'].armR, hR: P['설명'].hR });
if (!P['앉아손']) P['앉아손'] = Object.assign({}, P['앉기'], { armL: [[148, 285], [112, 330], [100, 300]], hL: [96, 292] });
const zoom14 = (inner, cx, cy, z) => `<g transform="translate(${f1(cx)} ${f1(cy)}) scale(${f1(z * 1000) / 1000}) translate(${f1(-cx)} ${f1(-cy)})">${inner}</g>`;
const op14 = (inner, o) => o >= 0.999 ? inner : o <= 0.001 ? '' : `<g opacity="${f1(o * 100) / 100}">${inner}</g>`;
const at14 = (t, a, phrase, d = 0) => fracOf13(t, phrase) * D14(a) + d;
const ORANGE14 = '#FF9A55', WARM14 = '#FFD27A';

/* ---------- places ---------- */
// Zero's one-room flat: window (left), sofa (centre), TV (right), a delivery box on a small table
function room14(t, o = {}) {
  const warm = o.warm || 0;
  let h = BG('url(#nightRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".3"/>');
  h += windowNight(170, 150, 440, 330, t);
  if (o.rain) for (let i = 0; i < 16; i++) { const ph = (t * 1.6 + hash(i * 3.3)) % 1, rx = 190 + hash(i * 7.1) * 400; h += `<line x1="${f1(rx)}" y1="${f1(170 + ph * 290)}" x2="${f1(rx - 8)}" y2="${f1(196 + ph * 290)}" stroke="#9FC2E8" stroke-width="4" stroke-linecap="round" opacity="${f1((1 - ph) * 0.8 * 100) / 100}"/>`; }
  if (o.snow) h += particles(t, 23, 18, [180, 160, 420, 310], '#fff', { speed: 30, r: 4, op: 0.8 });
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#10152B"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  // floor lamp (left of the sofa); lit when warm
  h += `<rect x="560" y="420" width="12" height="460" fill="#5A5F72" stroke="${INK}" stroke-width="4"/><ellipse cx="566" cy="880" rx="56" ry="12" fill="#3A3F52" stroke="${INK}" stroke-width="4"/><path d="M516 420 L616 420 L596 350 L536 350 Z" fill="${warm > 0 ? '#FFE29A' : '#8A8FA6'}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  if (warm > 0) h += `<ellipse cx="760" cy="560" rx="${f1(520 * warm + 200)}" ry="${f1(420 * warm + 160)}" fill="url(#warm)" opacity="${f1(warm * 0.9 * 100) / 100}"/>`;
  // TV on a low cabinet
  const fl = o.tv === false ? 0 : 0.75 + 0.25 * Math.sin(t * 7) * Math.sin(t * 2.3);
  if (o.tv !== false) h += `<ellipse cx="1500" cy="640" rx="560" ry="360" fill="url(#screenGlow)" opacity="${f1(fl * 0.55 * 100) / 100}"/>`;
  h += `<rect x="1300" y="760" width="420" height="120" rx="10" fill="#4A3B33" stroke="${INK}" stroke-width="7"/><line x1="1510" y1="770" x2="1510" y2="870" stroke="${INK}" stroke-width="4"/>`;
  h += `<rect x="1330" y="500" width="360" height="230" rx="12" fill="#11151F" stroke="${INK}" stroke-width="9"/><rect x="1500" y="730" width="20" height="30" fill="#2A2E3A"/>`;
  if (o.tv !== false) h += `<rect x="1344" y="514" width="332" height="202" rx="6" fill="#8FDBFF" opacity="${f1(fl * 0.9 * 100) / 100}"/><rect x="1370" y="560" width="120" height="120" rx="8" fill="#5FA8D3" opacity=".7"/><circle cx="1600" cy="600" r="44" fill="#FFE29A" opacity=".55"/>`;
  return h;
}
function sofa14(x, s = 1, back = true) { // seat top meets a character seated at (x, 880, 0.62)
  let h = '';
  if (back) h += `<rect x="${x - 300}" y="600" width="600" height="230" rx="46" fill="#5B6E9C" stroke="${INK}" stroke-width="8"/><path d="M${x - 260} 640 Q${x} 620 ${x + 260} 640" fill="none" stroke="#7A8DBA" stroke-width="8" stroke-linecap="round"/>`;
  else h += `<rect x="${x - 290}" y="812" width="580" height="62" rx="20" fill="#6B7FAE" stroke="${INK}" stroke-width="7"/><rect x="${x - 330}" y="700" width="80" height="176" rx="30" fill="#5B6E9C" stroke="${INK}" stroke-width="7"/><rect x="${x + 250}" y="700" width="80" height="176" rx="30" fill="#5B6E9C" stroke="${INK}" stroke-width="7"/>`;
  return h;
}
function foodBox14(x, y, t, s = 1) { // a delivery box with steam
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-80 -70 L80 -70 L70 0 L-70 0 Z" fill="#F2E3C6" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-80 -70 L-60 -100 L60 -100 L80 -70" fill="#E8D2A8" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><circle cx="0" cy="-36" r="18" fill="#E2553A" stroke="${INK}" stroke-width="4"/>` +
    [0, 1, 2].map(i => `<path d="M${-30 + i * 30} -110 q10 -16 0 -32 q-10 -16 0 -32" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="${f1((0.35 + 0.3 * Math.sin(t * 2 + i)) * 100) / 100}"/>`).join('') + `</g>`;
}
function table14(x, y = 770) { return `<rect x="${x - 120}" y="${y}" width="240" height="22" rx="8" fill="#8A5A34" stroke="${INK}" stroke-width="6"/><rect x="${x - 100}" y="${y + 22}" width="16" height="${880 - y - 22}" fill="#6E4628" stroke="${INK}" stroke-width="4"/><rect x="${x + 84}" y="${y + 22}" width="16" height="${880 - y - 22}" fill="#6E4628" stroke="${INK}" stroke-width="4"/>`; }
function teaCup14(x, y, t, s = 1) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 -50 L40 -50 L32 0 L-32 0 Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M40 -40 q24 4 18 24 q-6 12 -22 6" fill="none" stroke="${INK}" stroke-width="5"/><ellipse cx="0" cy="-50" rx="40" ry="8" fill="#C98A4B" stroke="${INK}" stroke-width="4"/>` +
  [0, 1].map(i => `<path d="M${-10 + i * 20} -62 q10 -14 0 -28 q-10 -14 0 -28" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="${f1((0.4 + 0.3 * Math.sin(t * 2.2 + i)) * 100) / 100}"/>`).join('') + `</g>`; }
// a messenger chat list / contacts list on a big phone. rows: [name, last, when, kind]
function listPhone14(x, y, s, t, o = {}) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})">`;
  h += `<rect x="-258" y="-480" width="540" height="980" rx="64" fill="${INK}" opacity=".3"/><rect x="-270" y="-490" width="540" height="980" rx="64" fill="#1F2D44" stroke="${INK}" stroke-width="10"/>`;
  h += `<rect x="-246" y="-466" width="492" height="932" rx="46" fill="#F4F7FB"/>`;
  h += `<path d="M-246 -420 Q-246 -466 -200 -466 L200 -466 Q246 -466 246 -420 L246 -352 L-246 -352 Z" fill="#fff"/><line x1="-246" y1="-352" x2="246" y2="-352" stroke="#D5DCE6" stroke-width="3"/>`;
  h += T8(-210, -392, o.title || '채팅', { anchor: 'start', size: 38, fill: NAVY });
  if (o.clock) h += T8(220, -392, o.clock, { anchor: 'end', size: 26, fill: '#6B7A90', w: 700 });
  h += `<defs><clipPath id="lp14"><rect x="-246" y="-350" width="492" height="816"/></clipPath></defs><g clip-path="url(#lp14)"><g transform="translate(0 ${f1(-(o.scroll || 0))})">`;
  (o.rows || []).forEach((r, j) => {
    const yy = -300 + j * 118, hi = o.hi === j;
    if (hi) h += `<rect x="-240" y="${yy - 52}" width="480" height="108" rx="16" fill="#FFF3B0" stroke="${YEL}" stroke-width="4"/>`;
    const c = ['#7CC7FF', '#C9B4E8', '#9ED8A6', '#F2B8A0', '#D6D9E0'][j % 5];
    h += `<circle cx="-186" cy="${yy}" r="40" fill="${r[3] === 'sj' ? '#4F86C6' : c}" stroke="${INK}" stroke-width="4"/>`;
    if (r[3] === 'sj') h += `<path d="M-212 ${yy - 10} Q-210 ${yy - 38} -186 ${yy - 38} Q-162 ${yy - 38} -160 ${yy - 10} Q-174 ${yy - 22} -186 ${yy - 20} Q-198 ${yy - 22} -212 ${yy - 10} Z" fill="#2B2B2B"/><circle cx="-186" cy="${yy + 6}" r="17" fill="#fff"/>`;
    else h += `<circle cx="-198" cy="${yy - 6}" r="12" fill="#fff" opacity=".85"/><circle cx="-172" cy="${yy + 8}" r="14" fill="#fff" opacity=".85"/>`;
    h += T8(-126, yy - 6, r[0], { anchor: 'start', size: 32, fill: NAVY });
    if (r[1]) h += T8(-126, yy + 34, r[1], { anchor: 'start', size: 24, fill: '#7A8699', w: 700 });
    if (r[2]) h += T8(226, yy - 8, r[2], { anchor: 'end', size: 22, fill: '#9AA6B6', w: 700 });
    h += `<line x1="-130" y1="${yy + 58}" x2="236" y2="${yy + 58}" stroke="#E2E8F0" stroke-width="2"/>`;
  });
  h += `</g></g>`;
  if (o.finger != null) { const fy = o.finger + Math.sin(t * 3) * 6; h += `<g transform="translate(150 ${f1(fy)})"><path d="M-30 0 L-30 140 L30 140 L30 0" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="0" cy="0" r="30" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-18 20 Q0 30 18 20" fill="none" stroke="#C9D6E2" stroke-width="5"/></g>`; }
  return h + '</g>';
}
const CHATS14 = [['회사 공지', '내일 회의는 10시입니다', '오후 6:02'], ['가족', '주말에 밥 한번 먹자', '화요일'], ['대학 동기 (32)', '[사진]', '3년 전'], ['동네 헬스 모임', '이번 달 회비…', '8월'], ['고등학교 친구들', '다음에 꼭 보자!', '작년'], ['전 직장 동기', '잘 지내지?', '작년'], ['게임 길드', '…', '2023년']];
const CONTACTS14 = [['김 과장님', '', '', ''], ['도윤', '', '', ''], ['미용실', '', '', ''], ['박 선배', '', '', ''], ['사촌 동생', '', '', ''], ['서준', '대학 동기 · 마지막 대화 3년 전', '', 'sj'], ['세탁소', '', '', ''], ['오 대리', '', '', '']];
// snowy winter night for the porcupine fable
function snow14(t, o = {}) {
  let h = `<defs><linearGradient id="snow14" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1433"/><stop offset=".7" stop-color="#1D2E5E"/><stop offset="1" stop-color="#34508A"/></linearGradient></defs>` + BG('url(#snow14)');
  h += `<circle cx="1560" cy="170" r="70" fill="#FFF6D8"/><circle cx="1560" cy="170" r="240" fill="url(#warm)" opacity=".28"/>`;
  for (let i = 0; i < 40; i++) { const x = -300 + hash(i * 1.7) * 2520, y = -300 + hash(i * 3.1) * 520; h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.4 + hash(i) * 2)}" fill="#fff" opacity="${f1((0.25 + 0.4 * Math.abs(Math.sin(t * 0.8 + i))) * 100) / 100}"/>`; }
  const tree = (x, s, c) => `<g transform="translate(${x} 880) scale(${s})"><rect x="-14" y="-60" width="28" height="60" fill="#3A2A22"/><path d="M0 -420 L-150 -60 L150 -60 Z" fill="${c}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M0 -420 L-70 -250 Q0 -270 70 -250 Z" fill="#EAF2FF"/><path d="M-130 -110 Q0 -150 130 -110" fill="none" stroke="#EAF2FF" stroke-width="16" stroke-linecap="round"/></g>`;
  [[-180, 1.1], [120, 0.8], [1880, 1.0], [2140, 1.2], [1650, 0.7], [380, 0.6]].forEach(([x, s], i) => { h += tree(x, s, i % 2 ? '#1E3B3A' : '#244845'); });
  h += `<defs><linearGradient id="snowG14" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDE7F5"/><stop offset=".11" stop-color="#BCCBE2"/><stop offset=".26" stop-color="#7F95BA"/><stop offset="1" stop-color="#3E5078"/></linearGradient></defs><path d="M-600 860 Q300 820 960 840 Q1600 860 2520 820 L2520 1480 L-600 1480 Z" fill="url(#snowG14)" stroke="${INK}" stroke-width="7"/><path d="M-600 930 Q500 900 1000 920 Q1500 940 2520 910" fill="none" stroke="#E8F0FA" stroke-width="5" opacity=".5"/>`;
  if (o.fall !== false) h += particles(t, 41, 46, [-300, -100, 2520, 1000], '#fff', { speed: 40, r: 5, op: 0.85 });
  return h;
}
// a group of hedgehogs around cx with spacing d; o.ouch 0..1, o.cold, o.glow 0..1, o.ex
function hogs14(t, cx, y, d, s, n = 4, o = {}) {
  let h = '';
  if (o.glow > 0) h += `<ellipse cx="${cx}" cy="${y - 80 * s}" rx="${f1((d * (n - 1) / 2 + 220) * 1.1)}" ry="${f1(200 * s + 60)}" fill="url(#warm)" opacity="${f1(o.glow * 100) / 100}"/>`;
  for (let j = 0; j < n; j++) {
    const off = (j - (n - 1) / 2), x = cx + off * d, flip = off > 0;
    const bob = Math.sin(t * 3 + j * 1.3) * 3;
    h += hog14(x, y + bob * 0.3, s, t, { flip, ouch: o.ouch ? o.ouch * (j % 2 ? 1 : 0.7) : 0, cold: o.cold, seed: j * 2.1, ex: o.ex });
  }
  return h;
}
function ouchFx14(t, x, y, k, s = 1) { if (k <= 0) return ''; const sc = easeOutBack(clamp(k * 1.4, 0, 1)) * s; return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc * 1000) / 1000})" opacity="${f1(Math.min(1, (1 - k) * 3) * 100) / 100}">${burst(70, YEL, 10)}<path d="M-14 -24 L14 24 M14 -24 L-14 24" stroke="${INK}" stroke-width="8" stroke-linecap="round"/></g>`; }
// a warm hedgehog sitting apart, glowing from inside
function warmHog14(t, x, y, s, k, o = {}) {
  let h = `<ellipse cx="${x}" cy="${f1(y - 80 * s)}" rx="${f1(260 * s * (0.6 + 0.4 * k))}" ry="${f1(200 * s * (0.6 + 0.4 * k))}" fill="url(#warm)" opacity="${f1(k * 0.95 * 100) / 100}"/>`;
  h += hog14(x, y, s, t, { flip: o.flip, ex: k > 0.5 ? 'happy' : undefined, cold: o.cold });
  if (k > 0) h += `<circle cx="${f1(x + (o.flip ? 10 : -10) * s)}" cy="${f1(y - 76 * s)}" r="${f1(30 * s * k)}" fill="#FFB547" opacity="${f1((0.35 + 0.15 * Math.sin(t * 3)) * k * 100) / 100}"/>`;
  return h;
}
// campfire
function fire14(x, y, s, t) {
  let h = `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-40" rx="420" ry="300" fill="url(#amber)" opacity="${f1((0.75 + 0.15 * Math.sin(t * 9)) * 100) / 100}"/>`;
  h += `<rect x="-120" y="-24" width="240" height="30" rx="14" fill="#6E4628" stroke="${INK}" stroke-width="6" transform="rotate(12)"/><rect x="-120" y="-24" width="240" height="30" rx="14" fill="#7E5232" stroke="${INK}" stroke-width="6" transform="rotate(-12)"/>`;
  const fl = (sc, c, ph) => { const w = Math.sin(t * 8 + ph) * 8; return `<path d="M${-70 * sc} 0 Q${-80 * sc + w} ${-110 * sc} ${w * 1.5} ${-220 * sc} Q${70 * sc + w} ${-110 * sc} ${70 * sc} 0 Z" fill="${c}" stroke="${INK}" stroke-width="${f1(6 * sc + 1)}" stroke-linejoin="round"/>`; };
  h += fl(1, '#FF7A3D', 0) + fl(0.66, '#FFB547', 1.3) + fl(0.36, '#FFE29A', 2.1);
  for (let i = 0; i < 6; i++) { const ph = (t * 0.7 + hash(i)) % 1; h += `<circle cx="${f1(Math.sin(i * 2 + t) * 40)}" cy="${f1(-200 - ph * 260)}" r="5" fill="#FFB547" opacity="${f1((1 - ph) * 100) / 100}"/>`; }
  return h + '</g>';
}
// apartment entrance with the guard booth
function lobby14(t) {
  let h = BG('url(#morning)');
  h += `<rect x="-600" y="120" width="3120" height="760" fill="#E9E1D2"/><rect x="-600" y="120" width="3120" height="760" fill="url(#hatch)" opacity=".2"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#B7B0A4"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  // glass entrance doors (left)
  h += `<rect x="40" y="300" width="460" height="580" fill="#BFE3F5" stroke="${INK}" stroke-width="9"/><line x1="270" y1="300" x2="270" y2="880" stroke="${INK}" stroke-width="7"/><rect x="40" y="300" width="460" height="580" fill="url(#morning)" opacity=".45"/><rect x="230" y="560" width="14" height="80" rx="6" fill="#8C98A4"/><rect x="296" y="560" width="14" height="80" rx="6" fill="#8C98A4"/>`;
  // the guard booth (right)
  h += `<rect x="1180" y="330" width="560" height="550" rx="10" fill="#D9CBB3" stroke="${INK}" stroke-width="9"/><rect x="1220" y="400" width="480" height="230" rx="8" fill="#CFE7F2" stroke="${INK}" stroke-width="7"/><rect x="1180" y="640" width="560" height="26" fill="#B59E7C" stroke="${INK}" stroke-width="6"/>`;
  h += `<rect x="1350" y="342" width="220" height="50" rx="10" fill="#3E5C84" stroke="${INK}" stroke-width="5"/>` + T8(1460, 380, '경비실', { size: 34, fill: '#fff' });
  // a small heater glow inside the booth window
  h += `<ellipse cx="1300" cy="590" rx="90" ry="50" fill="url(#amber)" opacity=".7"/>`;
  return h;
}
// commuter train interior
function train14(t) {
  let h = BG('#C9D3DC');
  h += `<rect x="-600" y="130" width="3120" height="80" fill="#AAB6C2"/><rect x="-600" y="680" width="3120" height="200" fill="#8C98A4"/>`;
  for (let i = 0; i < 4; i++) { const x = -40 + i * 520; h += `<rect x="${x}" y="240" width="400" height="230" rx="30" fill="#7FB3D9" stroke="${INK}" stroke-width="8"/>`;
    h += `<g clip-path="url(#tw14_${i})"><defs><clipPath id="tw14_${i}"><rect x="${x}" y="240" width="400" height="230" rx="30"/></clipPath></defs>`;
    for (let b = 0; b < 6; b++) { const bx = x + ((b * 170 - t * 220) % 1020 + 1020) % 1020 - 200, bh = 60 + hash(b * 3 + i) * 120; h += `<rect x="${f1(bx)}" y="${f1(470 - bh)}" width="110" height="${f1(bh)}" fill="#5E8DB3" opacity=".8"/>`; }
    h += `</g>`; }
  h += `<rect x="-600" y="560" width="3120" height="260" rx="20" fill="#4F6E98" stroke="${INK}" stroke-width="7"/><rect x="-600" y="812" width="3120" height="68" rx="20" fill="#3E5C84" stroke="${INK}" stroke-width="7"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#6B7480"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 5; i++) h += `<line x1="${-100 + i * 480}" y1="130" x2="${-100 + i * 480}" y2="60" stroke="#8C98A4" stroke-width="10"/><circle cx="${-100 + i * 480}" cy="${154 + Math.sin(t * 2 + i) * 4}" r="20" fill="none" stroke="#8C98A4" stroke-width="8"/>`;
  return h;
}
const P14 = (x, y, s, c, o = {}) => char(Object.assign({ goggles: 'none', vest: c, patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', x, y, s }, o));
const card14 = (x, y, w, hh, inner, o = {}) => `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="${-w / 2 + 8}" y="${-hh / 2 + 10}" width="${w}" height="${hh}" rx="28" fill="${INK}" opacity=".3"/><rect x="${-w / 2}" y="${-hh / 2}" width="${w}" height="${hh}" rx="28" fill="${o.bg || '#FFFDF4'}" stroke="${o.stroke || INK}" stroke-width="${o.sw || 7}"/>${inner}</g>`;
const quote14 = (lines, src, o = {}) => { const w = o.w || 1180, hh = 110 + lines.length * 82; return `<rect x="${-w / 2 + 8}" y="${-hh / 2 + 10}" width="${w}" height="${hh}" rx="26" fill="${INK}" opacity=".3"/><rect x="${-w / 2}" y="${-hh / 2}" width="${w}" height="${hh}" rx="26" fill="#FFFDF4" stroke="${INK}" stroke-width="7"/>` +
  `<text x="${-w / 2 + 34}" y="${-hh / 2 + 92}" font-family="Georgia, serif" font-size="120" fill="#E2C46B">“</text>` + lines.map((l, j) => T8(0, -hh / 2 + 92 + j * 82, l, { size: o.size || 54, fill: NAVY })).join('') + T8(w / 2 - 40, hh / 2 - 26, src, { anchor: 'end', size: 28, fill: '#8A6A44', w: 700 }); };
const methodTag14 = n => [null, '혼자를 고르기', '매일 스치던 사람에게 한마디', '연락이 끊긴 한 사람에게 먼저 한 줄'][n];
// a big method title card on the lab background
function methodCard14(t, lt, a, n, icon) {
  const D = D14(a), T0 = t - lt;
  let h = labBg(t) + particles(t, 60 + n, 20, [0, 0, 1920, 1080], MINT, { speed: 10, r: 3, op: 0.35 });
  const inner = `<circle cx="-470" cy="0" r="100" fill="${YEL}" stroke="${INK}" stroke-width="8"/>` + T8(-470, 36, String(n), { size: 110, fill: NAVY }) +
    T8(-330, -40, `방법 ${n}`, { anchor: 'start', size: 46, fill: '#3E5C84' }) + T8(-330, 50, methodTag14(n), { anchor: 'start', size: n === 3 ? 56 : 64, fill: NAVY });
  h += pop(t, T0 + 0.1, t + 99, 960, 430, card14(0, 0, 1260, 300, inner), { inDur: 0.4 });
  if (icon) h += pop(t, T0 + 0.6, t + 99, 960, 720, icon, { bob: 4 });
  return h;
}

/* ================= scenes ================= */
// 0-4 Friday night: comfortable alone ... and then empty
function lroomScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  let h = room14(t, { tv: k < 3 });
  h += sofa14(900, 1, true);
  const zx = 900, zs = 0.62;
  if (k <= 2) {
    h += table14(1190) + foodBox14(1190, 770, t, 0.8);
    h += Z({ t, seed: 1401, x: zx, y: 880, s: zs, pose: k === 1 ? '만세' : '앉기', ex: exprAt(k === 1 ? [[0, '신남']] : [[0, '미소']], t), look: [0.8, -0.1] });
    h += sofa14(900, 1, false);
    if (k === 0) h += pop(t, T0 + 0.2, t + 99, 960, 160, label(0, 0, '금요일 밤', { size: 50, bg: '#fff' }), { rot: -2 });
    if (k === 2) {
      const it = [['배달 음식', '#FFB0A0', 1190, 560, '배달'], ['좋아하는 드라마', '#8FDBFF', 1510, 420, '드라마'], ['아무도 부르지 않는 저녁', YEL, 760, 300, '아무도']];
      it.forEach(([txt, c, x, y, cue], j) => { const at = at14(t, a, cue, 0.05); h += pop(t, T0 + at, t + 99, x, y, label(0, 0, txt, { size: 40, bg: c }), { rot: (j - 1) * 3, bob: 3 }); });
    }
    return h;
  }
  if (k === 3) { // 11 pm: the group chats scroll by, nothing new
    h += table14(1190) + foodBox14(1190, 770, t, 0.8);
    h += Z({ t, seed: 1402, x: zx, y: 880, s: zs, pose: '앉아폰', ex: exprAt([[0, '기본']], t), look: [0.1, 0.6] });
    h += sofa14(900, 1, false);
    const [px, py] = handG(zx, 880 + 40 * zs, zs, [200, 318]);
    h += `<g transform="translate(${f1(px)} ${f1(py + 22 * zs)}) scale(${zs})"><rect x="-36" y="-60" width="72" height="120" rx="12" fill="#1F2D44" stroke="${INK}" stroke-width="6"/><rect x="-28" y="-50" width="56" height="98" rx="6" fill="#8FDBFF"/></g><circle cx="${f1(px)}" cy="${f1(py)}" r="140" fill="url(#screenGlow)" opacity=".6"/>`;
    const stop = at14(t, a, '멈춥니다', -0.4), sc = 260 * easeOut(prog(lt, 0.3, Math.max(0.8, stop)));
    h += pop(t, T0 + 0.15, t + 99, 1420, 470, listPhone14(0, 0, 0.62, t, { title: '채팅', clock: '오후 11:00', rows: CHATS14, scroll: sc, finger: 120 - (lt < stop ? 40 * Math.sin(lt * 5) : 0) }), { inDur: 0.4 });
    h += pop(t, T0 + 0.3, t + 99, 420, 170, label(0, 0, '밤 11시', { size: 46, bg: '#fff' }), { rot: -3 });
    return h;
  }
  // k4: "…근데 왜 이렇게 허전하지?" — closer, colder
  let inner = Z({ t, seed: 1403, x: zx, y: 880, s: zs, pose: '앉기', ex: exprAt([[0, '서운함']], t), look: [-0.5, 0.2] });
  h += zoom14(inner, zx, 700, 1 + 0.12 * easeInOut(prog(lt, 0, D)));
  h += sofa14(900, 1, false);
  h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#0A1838" opacity="${f1(0.28 * prog(lt, 0, 1.2) * 100) / 100}"/>`;
  for (let i = 0; i < 3; i++) { const ph = (t * 0.35 + i / 3) % 1; h += `<path d="M${f1(300 + ph * 1300)} ${360 + i * 90} q60 -30 120 0 q60 30 120 0" fill="none" stroke="#9FB4D8" stroke-width="6" stroke-linecap="round" opacity="${f1(Math.sin(ph * Math.PI) * 0.6 * 100) / 100}"/>`; }
  return h;
}
// 5 the question to viewers
function lhookScene(t, lt, a) {
  const D = D14(a), T0 = t - lt;
  let h = room14(t, { tv: false });
  h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#0B1626" opacity=".55"/>`;
  h += sofa14(900, 1, true) + `<g filter="url(#sil)">` + Z({ t, seed: 1404, x: 900, y: 880, s: 0.62, pose: '앉기', ex: exprAt([[0, '기본']], t), still: true }) + `</g>` + sofa14(900, 1, false);
  h += pop(t, T0 + 0.1, t + 99, 960, 300, big(0, 0, [[['혼자가 ', '#fff'], ['편한데', MINT], [',', '#fff']], [['왜 ', '#fff'], ['외로울까', YEL], ['?', '#fff']]], { size: 92, sw: 17, lh: 118 }), { noPop: true, inDur: 0.5 });
  const at = at14(t, a, '여러분도', 0);
  h += pop(t, T0 + at, t + 99, 1460, 640, label(0, 0, '여러분도, 이런 밤?', { size: 46, bg: '#fff' }), { rot: 3, bob: 3 });
  return h;
}
// 6-7 2025 social survey
function personIcon14(x, y, s, fill, k = 1) { if (k <= 0) return ''; return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * easeOutBack(clamp(k, 0, 1)) * 1000) / 1000})"><circle cx="0" cy="-118" r="44" fill="${fill}" stroke="${INK}" stroke-width="7"/><path d="M-58 0 L-58 -40 Q-58 -66 -30 -66 L30 -66 Q58 -66 58 -40 L58 0 Z" fill="${fill}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/></g>`; }
function lstatScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  let h = labBg(t);
  if (k === 0) {
    const ap = 0.15, lk = at14(t, a, '네 명', 0);
    for (let j = 0; j < 10; j++) {
      const x = 330 + j * 140, kk = prog(lt, ap + j * 0.08, ap + j * 0.08 + 0.3), f = j < 3 ? 1 : j === 3 ? 0.82 : 0, lit = prog(lt, lk, lk + 0.6);
      h += personIcon14(x, 640, 1, '#3A4A6A', kk);
      if (f > 0 && lit > 0) h += `<g clip-path="url(#ps14_${j})"><defs><clipPath id="ps14_${j}"><rect x="${x - 70}" y="${f1(650 - 180 * f * lit)}" width="140" height="${f1(180 * f * lit + 10)}"/></clipPath></defs>${personIcon14(x, 640, 1, '#8FB8FF', 1)}</g>`;
    }
    h += pop(t, T0 + 0.2, t + 99, 1300, 230, label(0, 0, '13세 이상', { size: 40, bg: '#fff' }), { rot: 2 });
    h += pop(t, T0 + lk + 0.3, t + 99, 960, 360, big(0, 0, [[['열 명 중 ', '#fff'], ['네 명 가까이', YEL], [' "외롭다"', '#fff']]], { size: 70, sw: 14 }), { noPop: true, inDur: 0.4 });
    h += pop(t, T0 + lk + 0.6, t + 99, 1620, 780, label(0, 0, '38.2%', { size: 54, bg: YEL }), { rot: 4, bob: 3 });
    return h;
  }
  // k1: concept: higher with age
  const ages = ['10대', '20대', '30대', '40대', '50대', '60대+'];
  h += `<line x1="300" y1="780" x2="1640" y2="780" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/>`;
  ages.forEach((g, j) => { const x = 400 + j * 220, hh = 140 + j * 60, kk = easeOut(prog(lt, 0.2 + j * 0.2, 0.7 + j * 0.2));
    h += `<rect x="${x - 70}" y="${f1(780 - hh * kk)}" width="140" height="${f1(hh * kk)}" rx="12" fill="${j > 3 ? '#8FB8FF' : '#5E7FB0'}" stroke="${INK}" stroke-width="6"/>` + T8(x, 836, g, { size: 38, fill: '#fff' }); });
  h += pop(t, T0 + 0.3, t + 99, 960, 230, big(0, 0, [[['나이가 많을수록 ', '#fff'], ['더 높게', YEL]]], { size: 72, sw: 14 }), { noPop: true, inDur: 0.4 });
  h += T8(1720, 900, '개념도', { anchor: 'end', size: 28, fill: '#9FB4D8', w: 700 });
  return h;
}
// 8-10 being alone is not the same as loneliness
function webPerson14(t, cx, cy, k, cut) { // a person linked to four others; cut 0..1 breaks the links
  let h = '';
  const others = [[-380, -200], [380, -200], [-420, 160], [420, 160]];
  others.forEach(([dx, dy], j) => { const kk = prog(k, j * 0.12, j * 0.12 + 0.4); if (kk <= 0) return;
    const x2 = cx + dx * 0.82, y2 = cy + dy * 0.82, br = clamp(cut * 1.6 - j * 0.15, 0, 1);
    if (br < 0.5) h += `<line x1="${cx}" y1="${cy}" x2="${f1(lerp(cx, x2, kk))}" y2="${f1(lerp(cy, y2, kk))}" stroke="${MINT}" stroke-width="10" stroke-linecap="round"/>`;
    else { const mx = (cx + x2) / 2, my = (cy + y2) / 2; h += `<line x1="${cx}" y1="${cy}" x2="${f1(mx - dx * 0.06)}" y2="${f1(my - dy * 0.06)}" stroke="#5A6B85" stroke-width="8" stroke-dasharray="14 12" stroke-linecap="round"/><line x1="${f1(mx + dx * 0.06)}" y1="${f1(my + dy * 0.06)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="#5A6B85" stroke-width="8" stroke-dasharray="14 12" stroke-linecap="round"/><path d="M${f1(mx - 18)} ${f1(my - 18)} L${f1(mx + 18)} ${f1(my + 18)} M${f1(mx + 18)} ${f1(my - 18)} L${f1(mx - 18)} ${f1(my + 18)}" stroke="#FF8A8A" stroke-width="8" stroke-linecap="round"/>`; }
    h += personIcon14(cx + dx, cy + dy + 60, 0.72, '#C9D6E8', kk); });
  h += personIcon14(cx, cy + 70, 0.95, cut > 0.5 ? '#8FB8FF' : ORANGE14, 1);
  return h;
}
function lwhyScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  let h = labBg(t);
  if (k === 0) {
    h += doctor(520, 960, 0.6, { t, expr: '미소', talk: env(t) });
    h += Z({ t, seed: 1405, x: 1460, y: 890, s: 0.56, pose: '서기', ex: exprAt([[0, '기본'], [0.6 * D, '놀람']], lt), look: [-0.7, 0] });
    h += pop(t, T0 + 0.45 * D, t + 99, 980, 300, big(0, 0, [[['혼자 있음 ', '#fff'], ['≠', YEL], [' 외로움', '#fff']]], { size: 84, sw: 16 }), { noPop: true, inDur: 0.4 });
    return h;
  }
  if (k === 1) {
    const cut = prog(lt, at14(t, a, '연결이', 0.1), at14(t, a, '연결이', 1.2));
    h += webPerson14(t, 960, 520, prog(lt, 0.3, 2.4), cut);
    h += pop(t, T0 + 0.2, t + 99, 960, 250, label(0, 0, '외로움 = 연결이 끊겼다고 느끼는 마음', { size: 44, bg: '#fff' }), { rot: -1 });
    return h;
  }
  // k2: lonely in a crowd / fine alone
  h += `<line x1="960" y1="120" x2="960" y2="880" stroke="#fff" stroke-width="6" stroke-dasharray="18 16" opacity=".5"/>`;
  for (let j = 0; j < 5; j++) h += P14(200 + j * 120, 880, 0.36, ['#C7737E', '#7CC7FF', '#9ED8A6', '#C9B4E8', '#F2B8A0'][j], { t, seed: 1410 + j, pose: j % 2 ? '손인사' : '서기', ex: exprAt([[0, '신남']], t), still: false });
  h += Z({ t, seed: 1416, x: 820, y: 880, s: 0.42, pose: '주머니', ex: exprAt([[0, '서운함']], t), look: [-0.6, 0.3] }) + cloud13(820, 450, 0.22, t, { rain: true, seed: 3 });
  h += pop(t, T0 + 0.2, t + 99, 520, 220, label(0, 0, '사람들 속에서도 외롭고', { size: 40, bg: '#8FB8FF' }), { rot: -2 });
  h += `<ellipse cx="1440" cy="620" rx="320" ry="240" fill="url(#warm)" opacity=".8"/>` + chair12(1440, 880, 0.5) + Z({ t, seed: 1417, x: 1440, y: 880, s: 0.5, pose: '앉기', ex: exprAt([[0, '미소']], t), look: [0, 0.6] });
  h += `<g transform="translate(1440 ${f1(880 + (330 - 560) * 0.5)}) rotate(-6)"><rect x="-50" y="-36" width="100" height="64" rx="6" fill="#F6E7C8" stroke="${INK}" stroke-width="5"/><line x1="0" y1="-36" x2="0" y2="28" stroke="${INK}" stroke-width="4"/></g>`;
  h += pop(t, T0 + 0.45 * D, t + 99, 1440, 220, label(0, 0, '혼자서도 괜찮고', { size: 40, bg: YEL }), { rot: 2 });
  return h;
}
// 11-14 relationships and survival
function lhealthScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  let h = labBg(t);
  if (k === 0) {
    const c1 = at14(t, a, '30만', 0), c2 = at14(t, a, '7년', 0), c3 = at14(t, a, '관계가', 0), c4 = at14(t, a, '50%', 0);
    h += pop(t, T0 + c1, t + 99, 520, 300, label(0, 0, '30만 명 이상', { size: 46, bg: '#fff' }), { rot: -3 });
    h += pop(t, T0 + c2, t + 99, 1400, 300, label(0, 0, '평균 7년 반', { size: 46, bg: '#fff' }), { rot: 3 });
    const g = easeOut(prog(lt, c3, c3 + 1.2));
    h += `<line x1="500" y1="820" x2="1420" y2="820" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/>`;
    h += `<rect x="600" y="${f1(820 - 260 * g)}" width="220" height="${f1(260 * g)}" rx="14" fill="#5E7FB0" stroke="${INK}" stroke-width="6"/><rect x="1100" y="${f1(820 - 390 * g)}" width="220" height="${f1(390 * g)}" rx="14" fill="${MINT}" stroke="${INK}" stroke-width="6"/>`;
    if (g > 0) h += T8(710, 880, '관계 약함', { size: 36, fill: '#fff' }) + T8(1210, 880, '관계 튼튼', { size: 36, fill: '#fff' });
    h += personIcon14(710, 560 + 260 * (1 - g), 0.5, '#8FB8FF', g) + personIcon14(1210, 430 + 390 * (1 - g), 0.5, ORANGE14, g);
    h += pop(t, T0 + c4, t + 99, 1500, 400, burst(110, YEL) + T8(0, 18, '+50%', { size: 56, fill: NAVY }), { rot: 6, wobble: 2 });
    h += pop(t, T0 + c3, t + 99, 960, 420, label(0, 0, '생존 가능성', { size: 40, bg: MINT }), {});
    return h;
  }
  if (k === 1) {
    const L = `<g transform="translate(-170 0)">${personIcon14(-70, 60, 0.7, ORANGE14)}${personIcon14(70, 60, 0.7, '#7CC7FF')}<path d="M-40 -40 Q0 -90 40 -40" fill="none" stroke="${PINK}" stroke-width="10" stroke-linecap="round"/></g>`;
    const R = `<g transform="translate(170 0)"><circle r="96" fill="#fff" stroke="${RED}" stroke-width="14"/><rect x="-62" y="-14" width="110" height="28" rx="6" fill="#E9E1D0" stroke="${INK}" stroke-width="5"/><rect x="34" y="-14" width="22" height="28" fill="#FF7A3D" stroke="${INK}" stroke-width="4"/><line x1="-68" y1="-68" x2="68" y2="68" stroke="${RED}" stroke-width="14"/></g>`;
    h += pop(t, T0 + 0.1, t + 99, 960, 470, `<g transform="scale(1.4)">${L}${T8(0, 26, '≈', { size: 90, fill: YEL })}${R}</g>`, {});
    h += pop(t, T0 + 0.35 * D, t + 99, 960, 180, label(0, 0, '담배를 끊는 것과 비슷한 크기', { size: 46, bg: '#fff' }), { rot: -2 });
    return h;
  }
  if (k === 2) {
    const n = 8; for (let j = 0; j < n; j++) { const an = Math.PI * (1.05 + 0.9 * j / (n - 1)), x = 960 + Math.cos(an) * 560, y = 900 + Math.sin(an) * 140 - (j % 2) * 40, kk = prog(lt, 0.2 + j * 0.15, 0.5 + j * 0.15);
      h += op14(P14(x, y, 0.34, ['#C7737E', '#7CC7FF', '#9ED8A6', '#C9B4E8', '#F2B8A0', '#E9C46A', '#8FB8FF', '#B9B0A8'][j], { t, seed: 1420 + j, pose: j % 2 ? '손인사' : '가리키기', ex: exprAt([[0, '신남']], t) }), kk); }
    h += Z({ t, seed: 1428, x: 960, y: 900, s: 0.56, pose: '웅크림', ex: exprAt([[0, '지침'], [0.5 * D, '당황']], lt), look: [0, 0.2] });
    h += pop(t, T0 + 0.4 * D, t + 99, 960, 200, label(0, 0, '사람을 많이 만나라고…?', { size: 46, bg: '#fff' }), { rot: 2, wobble: 1 });
    return h;
  }
  h += doctor(560, 960, 0.6, { t, expr: '미소', talk: env(t) });
  const fk = prog(lt, 0.4 * D, 0.4 * D + 0.6);
  if (fk > 0) h += `<g transform="translate(1340 470) scale(${f1(easeOutBack(fk) * 1000) / 1000})"><rect x="-230" y="-290" width="460" height="560" rx="16" fill="#8A6A44" stroke="${INK}" stroke-width="10"/><rect x="-196" y="-256" width="392" height="492" rx="8" fill="#2E3442"/><g filter="url(#sil)">${SCH({ t, seed: 1429, x: 0, y: 250, s: 0.55, pose: '팔짱', ex: exprAt([[0, '기본']], t), still: true })}</g>` + T8(0, 160, '?', { size: 150, fill: YEL }) + `</g>`;
  return h;
}
// 15, 18 Schopenhauer: who he was; the mother
function lschScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  let h = BG('#2A2230') + BG('url(#hatch)').replace('/>', ' opacity=".18"/>') + `<ellipse cx="960" cy="560" rx="900" ry="560" fill="url(#warm)" opacity=".25"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#1C1620"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  if (k === 0) {
    h += SCH({ t, seed: 1430, x: 960, y: 900, s: 0.78, pose: '팔짱', ex: exprAt([[0, '기본'], [0.5 * D, '비웃음']], lt), look: [0.2, 0] });
    h += pop(t, T0 + 0.2, t + 99, 960, 150, outlined(0, 0, [[['아르투어 ', '#fff'], ['쇼펜하우어', YEL]]], { size: 80, sw: 15 }), { noPop: true, inDur: 0.4 });
    h += pop(t, T0 + 0.6, t + 99, 1500, 420, label(0, 0, '1788–1860 · 독일', { size: 40, bg: '#fff' }), { rot: 3 });
    h += pop(t, T0 + 0.9, t + 99, 420, 420, label(0, 0, '"고독의 철학자"', { size: 40, bg: YEL }), { rot: -3 });
    return h;
  }
  // k3: two frames, a crack between: never met again after 1814
  const frame = (x, inner, nm) => `<g transform="translate(${x} 470)"><rect x="-230" y="-300" width="460" height="580" rx="16" fill="#8A6A44" stroke="${INK}" stroke-width="10"/><rect x="-200" y="-270" width="400" height="520" rx="8" fill="#E9DCC6"/>${inner}</g>` + T8(x, 830, nm, { size: 40, fill: '#fff' });
  h += frame(620, SCH({ t, seed: 1431, x: 0, y: 240, s: 0.55, pose: '팔짱', ex: exprAt([[0, '서운함']], t), look: [0.6, 0], still: true }), '아들 아르투어');
  const mom = `<g filter="url(#sil)">${char({ goggles: 'none', vest: '#7A4E6E', patch: false, tee: true, longHair: '#5A4130', hair: '#5A4130', x: 0, y: 240, s: 0.55, t, seed: 1432, pose: '서기', ex: exprAt([[0, '기본']], t), still: true })}</g>`;
  h += frame(1300, mom, '어머니 요한나');
  const ck = prog(lt, 0.25 * D, 0.25 * D + 0.6);
  if (ck > 0) h += `<path d="M960 ${f1(170)} L930 300 L985 400 L935 520 L980 640 L${f1(lerp(960, 945, ck))} ${f1(lerp(300, 780, ck))}" fill="none" stroke="#fff" stroke-width="8" stroke-linejoin="round" opacity="${f1(ck * 100) / 100}"/>`;
  h += pop(t, T0 + 0.5 * D, t + 99, 960, 120, label(0, 0, '1814년 이후, 다시 만나지 못함', { size: 42, bg: '#fff' }), { rot: -1 });
  return h;
}
// 20-22 the quotes
function lquoteScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  let h = BG('#2A2230') + `<ellipse cx="420" cy="620" rx="420" ry="360" fill="url(#warm)" opacity=".45"/>` + `<rect x="-600" y="880" width="3120" height="600" fill="#1C1620"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  if (k < 2) {
    h += desk12(420, 720, t, 1) + chair12(380, 900, 0.5) + SCH({ t, seed: 1433, x: 380, y: 900, s: 0.5, pose: '책상', ex: exprAt([[0, '기본']], t), look: [0.4, 0.5] });
    const Q1 = quote14(['누구나 혼자 있을 때만,', '온전히 자기 자신일 수 있다.'], '쇼펜하우어, 「삶의 지혜를 위한 잠언」', { w: 1060 });
    const Q2 = quote14(['고독을 사랑하지 않는 사람은,', '자유도 사랑하지 않는다.'], '같은 글', { w: 1060 });
    if (k === 0) h += pop(t, T0 + at14(t, a, '누구나', 0), t + 99, 1240, 400, Q1, { rot: -1 });
    else { h += `<g transform="translate(1240 250) scale(.7) rotate(-1)" opacity=".75">${Q1}</g>`; h += pop(t, T0 + 0.1, t + 99, 1240, 600, Q2, { rot: 1 }); }
    return h;
  }
  h += BG('url(#labG)').replace('/>', ' opacity=".6"/>');
  h += Z({ t, seed: 1434, x: 960, y: 900, s: 0.62, pose: '만세', ex: exprAt([[0, '신남']], t), look: [0, -0.2] });
  for (let j = 0; j < 5; j++) h += star13(560 + j * 200, 300 + (j % 2) * 80, 26, t, prog(lt, 0.1 + j * 0.1, 0.4 + j * 0.1), j + 50);
  h += pop(t, T0 + 0.2, t + 99, 960, 160, label(0, 0, '완전 내 편!', { size: 52, bg: YEL }), { rot: -3, wobble: 2 });
  return h;
}
// 23-30 the porcupine fable (SVG parts; line 27 is the AI picture)
const DK14 = [[0, 420], [1.4, 170], [2.0, 170], [2.7, 390], [4.1, 225], [4.6, 225], [5.2, 300], [6.3, 260]];
function keyed14(K, x) { if (x <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (x <= K[i][0]) { const [a0, v0] = K[i - 1], [a1, v1] = K[i]; return lerp(v0, v1, easeInOut((x - a0) / (a1 - a0))); } return K[K.length - 1][1]; }
function lporcScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  let h = snow14(t);
  const cx = 960, gy = 880, s = 0.82;
  if (k === 0) {
    h += hogs14(t, cx, gy, 360, s, 4, { cold: true });
    h += pop(t, T0 + 0.1, t + 99, 960, 230, outlined(0, 0, [[['쇼펜하우어의 ', '#fff'], ['고슴도치 우화', YEL]]], { size: 76, sw: 15 }), { noPop: true, inDur: 0.4 });
    h += pop(t, T0 + 0.5, t + 99, 960, 360, label(0, 0, '『소품과 부록』 (1851)', { size: 36, bg: '#fff' }), {});
    return h;
  }
  if (k === 1) { // cold → huddle
    const m = at14(t, a, '바짝', -0.6), d = lerp(430, 150, easeInOut(prog(lt, Math.max(0.3, m - 1.2), m + 0.4)));
    h += hogs14(t, cx, gy, d, s, 4, { cold: d > 200 });
    h += pop(t, T0 + 0.2, t + 99, 420, 260, label(0, 0, '추운 겨울날', { size: 44, bg: '#BFE3F5' }), { rot: -3 });
    if (lt > m + 0.3) h += pop(t, T0 + m + 0.3, t + 99, 960, 420, label(0, 0, '바짝!', { size: 52, bg: YEL }), { rot: 2, wobble: 2 });
    return h;
  }
  if (k === 2) { // ouch → apart
    const d = lerp(150, 420, easeOut(prog(lt, 0.7, 1.6))), ou = prog(lt, 0.1, 0.5) * (1 - prog(lt, 1.0, 1.4));
    h += hogs14(t, cx, gy, d, s, 4, { ouch: ou, ex: ou > 0.2 ? 'sad' : undefined });
    h += ouchFx14(t, 960 - 75, 700, prog(lt, 0.15, 0.9)) + ouchFx14(t, 960 + 90, 660, prog(lt, 0.3, 1.05), 0.8);
    h += pop(t, T0 + 0.2, t + 99, 960, 330, label(0, 0, '앗, 따가워!', { size: 52, bg: '#FFB0A0' }), { rot: -3, wobble: 2 });
    return h;
  }
  if (k === 3) { // back and forth, then the bearable middle
    const sc = Math.max(1, D - 1.2) / 6.3, d = keyed14(DK14, lt / sc);
    const ou = (lt / sc > 1.3 && lt / sc < 2.2) ? 1 : (lt / sc > 4.0 && lt / sc < 4.7) ? 0.5 : 0;
    const settle = prog(lt / sc, 5.6, 6.3);
    h += hogs14(t, cx, gy, d, s, 4, { ouch: ou, cold: d > 340, glow: settle * 0.9, ex: settle > 0.5 ? 'happy' : undefined });
    if (ou > 0) h += ouchFx14(t, 960, 680, prog(lt / sc, lt / sc > 3 ? 4.0 : 1.3, lt / sc > 3 ? 4.6 : 2.1), ou);
    h += pop(t, T0 + 0.2, t + 99, 420, 240, label(0, 0, '추우면 붙고', { size: 42, bg: '#BFE3F5' }), { rot: -3 });
    h += pop(t, T0 + 2.0 * sc, t + 99, 1500, 240, label(0, 0, '찔리면 떨어지고', { size: 42, bg: '#FFB0A0' }), { rot: 3 });
    if (settle > 0) { const y = 560; h += op14(`<path d="M${cx - d * 0.5} ${y} L${cx + d * 0.5} ${y}" stroke="#fff" stroke-width="6"/><path d="M${cx - d * 0.5 + 18} ${y - 14} L${cx - d * 0.5} ${y} L${cx - d * 0.5 + 18} ${y + 14} M${cx + d * 0.5 - 18} ${y - 14} L${cx + d * 0.5} ${y} L${cx + d * 0.5 - 18} ${y + 14}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`, settle); h += pop(t, T0 + 5.6 * sc, t + 99, 960, 420, label(0, 0, '견딜 만한 거리', { size: 54, bg: YEL }), { rot: -2, bob: 3 }); }
    return h;
  }
  if (k === 5) { // the one who keeps warm inside, sitting apart
    h += hogs14(t, 640, gy, 250, 0.72, 3, { glow: 0.6 });
    const g = prog(lt, at14(t, a, '온기가', -0.2), at14(t, a, '온기가', 0.9));
    h += warmHog14(t, 1480, gy, 0.86, g, { flip: true });
    h += pop(t, T0 + at14(t, a, '온기가', 0), t + 99, 1480, 420, label(0, 0, '안에 온기가 많으면', { size: 42, bg: YEL }), { rot: 2 });
    h += pop(t, T0 + at14(t, a, '차라리', 0), t + 99, 1480, 520, label(0, 0, '차라리 떨어져서', { size: 38, bg: '#fff' }), { rot: -2 });
    return h;
  }
  if (k === 6) { // people as porcupines
    let ppl = '';
    [[1180, '#7CC7FF'], [1440, '#C9B4E8'], [1700, '#9ED8A6']].forEach(([x, c], j) => {
      let sp = ''; for (let n = 0; n < 13; n++) { const an = Math.PI * (0.95 + 1.1 * n / 12), r0 = 120, r1 = 175 + (n % 2) * 18; sp += `<path d="M${f1(Math.cos(an - 0.07) * r0)} ${f1(Math.sin(an - 0.07) * r0)} L${f1(Math.cos(an) * r1)} ${f1(Math.sin(an) * r1)} L${f1(Math.cos(an + 0.07) * r0)} ${f1(Math.sin(an + 0.07) * r0)} Z" fill="#6B4A32" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`; }
      const k2 = prog(lt, 0.3 + j * 0.25, 0.8 + j * 0.25);
      ppl += `<g transform="translate(${x} ${f1(880 - 0.42 * 360)}) scale(${f1(0.42 * 1.6 * easeOutBack(k2) * 1000) / 1000})">${sp}</g>` + P14(x, 880, 0.42, c, { t, seed: 1440 + j, pose: '팔짱', ex: exprAt([[0, '화남']], t) }); });
    h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#0B1626" opacity=".35"/>` + ppl;
    h += SCH({ t, seed: 1443, x: 470, y: 900, s: 0.62, pose: '팔짱', ex: exprAt([[0, '비웃음']], t), look: [0.8, 0] });
    h += pop(t, T0 + 0.3 * D, t + 99, 1440, 230, label(0, 0, '사람 = 가시 돋친 고슴도치?', { size: 44, bg: '#fff' }), { rot: -2 });
    return h;
  }
  // k7: Zero, alone in the snow, the warm ring far away
  h += hogs14(t, 520, 840, 170, 0.46, 4, { glow: 0.85, ex: 'happy' });
  h += Z({ t, seed: 1444, x: 1380, y: 900, s: 0.6, pose: '주머니', ex: exprAt([[0, '생각'], [0.5 * D, '서운함']], lt), look: [-0.8, 0.1] });
  h += `<path d="M1300 520 q20 -30 40 0 q20 30 40 0" fill="none" stroke="#BFE3F5" stroke-width="6" stroke-linecap="round" opacity="${f1((0.4 + 0.4 * Math.sin(t * 4)) * 100) / 100}"/>`;
  const c1 = at14(t, a, '안이', 0), c2 = at14(t, a, '그냥', 0);
  h += pop(t, T0 + c1, t + 99, 1100, 250, label(0, 0, '안이 따뜻해서?', { size: 44, bg: YEL }), { rot: -3 });
  h += pop(t, T0 + c2, t + 99, 1620, 330, label(0, 0, '그냥 추워서?', { size: 44, bg: '#BFE3F5' }), { rot: 3 });
  return h;
}
// 31 the doctor: let's measure the distance for a week
function llabScene(t, lt, a) {
  const D = D14(a), T0 = t - lt;
  let h = labBg(t);
  h += doctor(480, 960, 0.6, { t, expr: '미소', talk: env(t), pose: 'point' });
  h += Z({ t, seed: 1445, x: 1460, y: 890, s: 0.56, pose: '서기', ex: exprAt([[0, '생각'], [0.55 * D, '결심']], lt), look: [-0.7, 0] });
  const tk = easeInOut(prog(lt, 0.3 * D, 0.3 * D + 1.2)), x0 = 700, x1 = lerp(700, 1300, tk);
  h += `<rect x="${x0 - 50}" y="560" width="100" height="100" rx="22" fill="${YEL}" stroke="${INK}" stroke-width="7"/><circle cx="${x0}" cy="610" r="22" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
  if (tk > 0) { h += `<rect x="${x0 + 46}" y="590" width="${f1(x1 - x0 - 46)}" height="40" fill="#FFF3B0" stroke="${INK}" stroke-width="5"/>`; for (let x = x0 + 70; x < x1; x += 40) h += `<line x1="${x}" y1="590" x2="${x}" y2="${(x - x0) % 120 < 40 ? 616 : 606}" stroke="${INK}" stroke-width="4"/>`; }
  h += pop(t, T0 + at14(t, a, '일주일', 0), t + 99, 1000, 300, label(0, 0, '일주일 · 사람과의 거리 재기', { size: 46, bg: MINT }), { rot: -2 });
  return h;
}
// 32-33 today's experiment
function ltitleScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  let h = snow14(t, { fall: true });
  h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#0B1626" opacity=".35"/>`;
  if (k === 0) {
    h += hogs14(t, 960, 880, 230, 0.5, 4, { glow: 0.7, ex: 'happy' });
    h += pop(t, T0 + 0.1, t + 99, 960, 180, label(0, 0, '오늘의 실험', { size: 52, bg: MINT }), {});
    h += pop(t, T0 + 0.5, t + 99, 960, 400, big(0, 0, [[['혼자가 편한 제로는,', '#fff']], [['외롭지 않을 수 있을까?', YEL]]], { size: 86, sw: 16, lh: 116 }), { noPop: true, inDur: 0.5 });
    return h;
  }
  const cards = [[1, '혼자를', '고르기', '#BFE3F5'], [2, '매일 스치던', '사람에게 한마디', '#FFE0B8'], [3, '연락이 끊긴', '한 사람에게 먼저 한 줄', '#FFF3B0']];
  const hi = prog(lt, at14(t, a, '마지막', 0), at14(t, a, '마지막', 0.6));
  cards.forEach(([n, l1, l2, c], j) => { const x = 400 + j * 560, at = 0.2 + j * 0.45;
    const inner = `<circle cx="0" cy="-90" r="54" fill="${YEL}" stroke="${INK}" stroke-width="7"/>` + T8(0, -68, String(n), { size: 64, fill: NAVY }) + T8(0, 30, l1, { size: 42, fill: NAVY }) + T8(0, 88, l2, { size: n === 3 ? 36 : 42, fill: NAVY });
    if (n === 3 && hi > 0) h += `<ellipse cx="${x}" cy="520" rx="${f1(330 * hi)}" ry="${f1(260 * hi)}" fill="url(#warm)" opacity="${f1(hi * 100) / 100}"/>`;
    h += pop(t, T0 + at, t + 99, x, 520 - (n === 3 ? 20 * hi : 0), card14(0, 0, 480, 330, inner, { bg: c, stroke: n === 3 && hi > 0 ? '#E2A000' : INK, sw: n === 3 && hi > 0 ? 10 : 7 }), { rot: (j - 1) * 2 }); });
  if (hi > 0) h += pop(t, T0 + at14(t, a, '마지막', 0.4), t + 99, 1520, 800, label(0, 0, '제로의 일주일을 바꾼 하나', { size: 38, bg: YEL }), { rot: 2, bob: 3 });
  return h;
}
// 34-37 method 1: choose to be alone (15 minutes, the phone in the drawer)
const drawerIcon14 = `<g transform="scale(1.1)"><rect x="-150" y="-70" width="300" height="140" rx="14" fill="#B88A5A" stroke="${INK}" stroke-width="7"/><rect x="-40" y="-8" width="80" height="16" rx="8" fill="#6E4E33"/><g transform="translate(150 -110) rotate(18)"><rect x="-36" y="-60" width="72" height="120" rx="12" fill="#1F2D44" stroke="${INK}" stroke-width="6"/><rect x="-28" y="-50" width="56" height="98" rx="6" fill="#0B0F18"/></g></g>`;
function timer14(x, y, s, secLeft) { const m = Math.floor(secLeft / 60), sec = Math.floor(secLeft % 60); return `<g transform="translate(${x} ${y}) scale(${s})"><circle r="90" fill="#fff" stroke="${INK}" stroke-width="8"/><circle r="90" fill="none" stroke="${MINT}" stroke-width="14" stroke-dasharray="${f1(565 * secLeft / 900)} 600" transform="rotate(-90)"/>` + T8(0, 18, `${m}:${String(sec).padStart(2, '0')}`, { size: 50, fill: NAVY }) + `<rect x="-14" y="-118" width="28" height="22" rx="6" fill="#C9D2DC" stroke="${INK}" stroke-width="5"/></g>`; }
function lsoloScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  if (k === 0) return methodCard14(t, lt, a, 1, drawerIcon14);
  let h = room14(t, { tv: false, warm: k === 3 ? 0.4 + 0.3 * prog(lt, 0, 2) : 0.25, rain: k === 3 });
  if (k === 1) {
    h += `<g stroke="${INK}" stroke-width="7"><rect x="1140" y="640" width="360" height="240" rx="10" fill="#B88A5A"/><rect x="1166" y="666" width="308" height="80" rx="8" fill="#C99B68"/><rect x="1166" y="770" width="308" height="80" rx="8" fill="#C99B68"/></g><rect x="1290" y="700" width="60" height="12" rx="6" fill="#6E4E33"/><rect x="1290" y="804" width="60" height="12" rx="6" fill="#6E4E33"/>`;
    const put = at14(t, a, '서랍', 0), dk = prog(lt, put - 0.2, put + 0.6);
    h += Z({ t, seed: 1450, x: 960, y: 880, s: 0.6, pose: dk < 1 ? '폰넣기' : '서기', ex: exprAt([[0, '결심']], t), look: [0.7, 0.3] });
    if (dk < 1) { const [px, py] = handG(960, 880, 0.6, [352, 318]); h += `<g transform="translate(${f1(lerp(px, 1320, dk))} ${f1(lerp(py, 706, dk))}) scale(.5)"><rect x="-36" y="-60" width="72" height="120" rx="12" fill="#1F2D44" stroke="${INK}" stroke-width="6"/><rect x="-28" y="-50" width="56" height="98" rx="6" fill="#0B0F18"/></g>`; }
    h += pop(t, T0 + at14(t, a, '15분', 0), t + 99, 560, 300, timer14(0, 0, 1, 900 - 60 * prog(lt, at14(t, a, '15분', 0.4), D)), { bob: 3 });
    h += pop(t, T0 + 0.2, t + 99, 1320, 470, label(0, 0, '매일 저녁', { size: 44, bg: '#fff' }), { rot: 3 });
    return h;
  }
  if (k === 2) {
    h += sofa14(900, 1, true) + Z({ t, seed: 1451, x: 900, y: 880, s: 0.62, pose: lt % 1.2 < 0.6 ? '앉기' : '앉아손', ex: exprAt([[0, '당황']], t), look: [Math.sin(t * 3) * 0.8, 0.3] }) + sofa14(900, 1, false);
    h += pop(t, T0 + 0.2, t + 99, 1180, 420, bubble(0, 0, 260, 150, `<g transform="translate(0 4) scale(.7)"><rect x="-36" y="-60" width="72" height="120" rx="12" fill="#1F2D44" stroke="${INK}" stroke-width="6"/><rect x="-28" y="-50" width="56" height="98" rx="6" fill="#8FDBFF"/></g>` + T8(80, 20, '?', { size: 60, fill: NAVY })), { bob: 3 });
    for (let j = 0; j < 3; j++) h += `<path d="M${780 - j * 18} ${740 + j * 20} q-20 -10 -34 4" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="${f1(Math.abs(Math.sin(t * 6 + j)) * 0.8 * 100) / 100}"/>`;
    return h;
  }
  // k3: day three — rain on the window, warm tea, calm
  h += sofa14(900, 1, true) + Z({ t, seed: 1452, x: 900, y: 880, s: 0.62, pose: '앉기', ex: exprAt([[0, '기본'], [at14(t, a, '빗소리', 0), '미소']], lt), look: [-0.7, -0.2] }) + sofa14(900, 1, false);
  h += table14(1190) + teaCup14(1190, 770, t, 0.9);
  h += pop(t, T0 + 0.15, t + 99, 420, 560, label(0, 0, '사흘째', { size: 48, bg: YEL }), { rot: -3 });
  h += pop(t, T0 + at14(t, a, '빗소리', 0), t + 99, 390, 110, label(0, 0, '빗소리', { size: 36, bg: '#BFE3F5' }), { rot: 2 });
  h += pop(t, T0 + at14(t, a, '찻잔', 0), t + 99, 1190, 560, label(0, 0, '찻잔의 온기', { size: 36, bg: '#FFE0B8' }), { rot: -2 });
  return h;
}
// 38-41 Nguyen, Ryan & Deci 2018
function lsolosScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  let h = labBg(t);
  if (k === 0) {
    const it = [[`${personIcon14(0, 80, 0.9, '#C9D6E8')}`, '혼자', 560], [timer14(0, 0, 1, 900), '15분', 960], [`<g transform="scale(.9)"><rect x="-56" y="-96" width="112" height="192" rx="18" fill="#1F2D44" stroke="${INK}" stroke-width="7"/><rect x="-44" y="-82" width="88" height="160" rx="10" fill="#8FDBFF"/><circle r="94" fill="none" stroke="${RED}" stroke-width="14"/><line x1="-66" y1="-66" x2="66" y2="66" stroke="${RED}" stroke-width="14"/></g>`, '휴대폰 없이', 1360]];
    it.forEach(([ic, lb, x], j) => { h += pop(t, T0 + 0.3 + j * 0.5, t + 99, x, 470, ic, { bob: 3 }); h += pop(t, T0 + 0.4 + j * 0.5, t + 99, x, 700, label(0, 0, lb, { size: 40, bg: '#fff' }), {}); });
    return h;
  }
  if (k === 1) {
    const nd = lerp(-70, 60, easeInOut(prog(lt, 0.4, D - 0.4)));
    h += `<g transform="translate(960 640)"><path d="M-400 0 A400 400 0 0 1 400 0" fill="none" stroke="#3A4A6A" stroke-width="70"/><path d="M-400 0 A400 400 0 0 1 -120 -382" fill="none" stroke="#FF8A8A" stroke-width="70"/><path d="M120 -382 A400 400 0 0 1 400 0" fill="none" stroke="${MINT}" stroke-width="70"/>`;
    h += `<g transform="rotate(${f1(nd)})"><path d="M-14 0 L0 -330 L14 0 Z" fill="#fff" stroke="${INK}" stroke-width="6"/></g><circle r="34" fill="${YEL}" stroke="${INK}" stroke-width="7"/></g>`;
    h += T8(560, 720, '들뜸 · 짜증', { size: 42, fill: '#FF8A8A' }) + T8(1360, 720, '차분', { size: 48, fill: MINT });
    return h;
  }
  if (k === 2) {
    h += `<line x1="960" y1="140" x2="960" y2="880" stroke="#fff" stroke-width="6" stroke-dasharray="18 16" opacity=".5"/>`;
    const c1 = at14(t, a, '스스로', 0), c2 = at14(t, a, '떠밀린', 0);
    if (lt > c1 - 0.2) { h += `<ellipse cx="520" cy="620" rx="320" ry="240" fill="url(#warm)" opacity=".7"/>` + Z({ t, seed: 1453, x: 520, y: 880, s: 0.5, pose: '좌선', ex: exprAt([[0, '미소']], t) }); h += pop(t, T0 + c1, t + 99, 520, 240, label(0, 0, '스스로 고른 혼자', { size: 42, bg: MINT }), { rot: -2 }); h += pop(t, T0 + c1 + 0.8, t + 99, 520, 360, label(0, 0, '→ 더 차분', { size: 36, bg: '#fff' }), {}); }
    if (lt > c2 - 0.2) { h += cloud13(1400, 420, 0.32, t, { rain: true, seed: 5 }) + Z({ t, seed: 1454, x: 1400, y: 880, s: 0.5, pose: '웅크림', ex: exprAt([[0, '서운함']], t), look: [0, 0.4] }); h += pop(t, T0 + c2, t + 99, 1400, 240, label(0, 0, '떠밀린 혼자', { size: 42, bg: '#8FB8FF' }), { rot: 2 }); h += pop(t, T0 + c2 + 0.8, t + 99, 1460, 600, label(0, 0, '→ 외로움', { size: 36, bg: '#fff' }), {}); }
    return h;
  }
  h += pop(t, T0 + 0.1, t + 99, 960, 360, big(0, 0, [[['내가 ', '#fff'], ['고르면', MINT], [' 쉼,', '#fff']], [['떠밀리면', '#8FB8FF'], [' 외로움', '#fff']]], { size: 96, sw: 18, lh: 130 }), { noPop: true, inDur: 0.5 });
  return h;
}
// 42-43 the fire: warm yourself at the right distance
function lfireScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  let h = snow14(t, { fall: false }) + `<rect x="-600" y="-600" width="3120" height="2280" fill="#0B1626" opacity=".45"/>`;
  if (k === 0) {
    h += fire14(960, 880, 1, t);
    h += P14(740, 880, 0.46, '#C9B4E8', { t, seed: 1455, pose: '웅크림', ex: exprAt([[0, '당황']], t), look: [0.6, 0] });
    h += SCH({ t, seed: 1456, x: 1320, y: 900, s: 0.55, pose: '내밀기', ex: exprAt([[0, '미소']], t), look: [-0.8, 0] });
    h += P14(1820, 880, 0.42, '#9ED8A6', { t, seed: 1457, pose: '주머니', ex: exprAt([[0, '걱정']], t), look: [-0.8, 0], tilt: Math.sin(t * 30) * 2 });
    h += pop(t, T0 + 0.4, t + 99, 560, 600, label(0, 0, '너무 가까이: 뜨거워', { size: 32, bg: '#FFB0A0' }), { rot: -3 });
    h += pop(t, T0 + 0.8, t + 99, 1760, 640, label(0, 0, '너무 멀리: 추워', { size: 32, bg: '#BFE3F5' }), { rot: 3 });
    h += pop(t, T0 + at14(t, a, '지혜로운', 0), t + 99, 860, 300, quote14(['지혜로운 사람은,', '알맞은 거리에서 불을 쬔다.'], '쇼펜하우어, 「삶의 지혜를 위한 잠언」', { w: 1000, size: 50 }), { rot: -1 });
    return h;
  }
  h += `<g transform="translate(460 0)">${fire14(0, 880, 0.55, t)}</g>`;
  h += Z({ t, seed: 1458, x: 1520, y: 900, s: 0.6, pose: '주머니', ex: exprAt([[0, '생각'], [at14(t, a, '그럼', 0), '서운함']], lt), look: [-0.9, 0], tilt: Math.sin(t * 25) * 1.5 });
  const dk = prog(lt, at14(t, a, '너무', 0), at14(t, a, '너무', 0.8));
  if (dk > 0) h += op14(`<path d="M620 760 L1400 760" stroke="#fff" stroke-width="6" stroke-dasharray="20 14"/><path d="M1380 744 L1400 760 L1380 776" fill="none" stroke="#fff" stroke-width="6"/>`, dk) + pop(t, T0 + at14(t, a, '너무', 0.2), t + 99, 1010, 690, label(0, 0, '너무 멀리 와 있었다', { size: 42, bg: '#BFE3F5' }), { rot: -2 });
  return h;
}
// 44-47 method 2: the guard he passed every day
const guardIcon14 = `<g transform="scale(1)">${label(0, 0, '"오늘 많이 춥죠?"', { size: 46, bg: '#fff' })}</g>`;
function lguardScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  if (k === 0) return methodCard14(t, lt, a, 2, guardIcon14);
  let h = lobby14(t);
  const gx = 1460, gs = 0.5;
  // the guard behind the booth window (upper body visible)
  const gEx = k === 3 ? exprAt([[0, '신남']], t) : k === 2 ? exprAt([[0, '기본'], [0.6, '놀람']], lt) : exprAt([[0, '기본']], t);
  const gd = GD({ t, seed: 1460, x: gx, y: 700, s: gs, pose: k === 3 && lt > 0.3 ? '내밀기' : '앉기', ex: gEx, look: k === 3 ? [0.8, 0.1] : [-0.8, 0.1] });
  h += `<defs><clipPath id="booth14"><rect x="1220" y="400" width="480" height="230"/></clipPath></defs><g clip-path="url(#booth14)">${k === 3 ? flip(gx, gd) : gd}</g>`;
  h += `<rect x="1220" y="400" width="480" height="230" rx="8" fill="#CFE7F2" opacity=".18"/><path d="M1240 420 L1300 420 M1240 440 L1270 440" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>`;
  if (k === 1) {
    const per = Math.max(1.6, (D - 1.6) / 3), n = Math.floor(lt / per), ph = (lt % per) / per, last = lt > D - 1.6;
    const zx = last ? lerp(200, 1000, easeInOut(prog(lt, D - 1.6, D - 0.1))) : lerp(160, 1880, ph);
    h += Z({ t, seed: 1461, x: zx, y: 880, s: 0.56, pose: last && lt > D - 0.2 ? '서기' : walkPose(lt * 3, 0.5), ex: exprAt([[0, '기본']], t), look: [0.8, 0.1] });
    const days = ['월', '화', '수', '목', '금'], d = last ? '수' : days[n % 5];
    h += `<g transform="translate(420 150)"><rect x="-210" y="-48" width="420" height="96" rx="48" fill="${NAVY}" opacity=".88" stroke="${YEL}" stroke-width="5"/>` + T8(0, 16, last ? '수요일 아침' : `${d}요일 아침 · 지나침`, { size: 38, fill: YEL }) + `</g>`;
    h += pop(t, T0 + 0.6, t + 99, 960, 250, label(0, 0, '2년 동안, 매일 지나친 경비실', { size: 42, bg: '#fff' }), { rot: -1 });
    return h;
  }
  if (k === 2) {
    h += Z({ t, seed: 1462, x: 1000, y: 880, s: 0.56, pose: '손인사', ex: exprAt([[0, '미소']], t), look: [0.8, -0.1] });
    h += pop(t, T0 + 0.1, t + 99, 860, 420, label(0, 0, '인사 말고, 한마디', { size: 40, bg: YEL }), { rot: -3 });
    return h;
  }
  // k3: the guard smiles and hands over a tangerine
  const gk = prog(lt, 0.4, 1.4);
  h += `<ellipse cx="1240" cy="600" rx="${f1(380 * gk + 60)}" ry="${f1(260 * gk + 40)}" fill="url(#warm)" opacity="${f1(gk * 0.9 * 100) / 100}"/>`;
  h += Z({ t, seed: 1463, x: 1000, y: 880, s: 0.56, pose: '받기', ex: exprAt([[0, '놀람'], [1.6, '신남']], lt), look: [0.8, -0.1] });
  const [hx, hy] = handG(1000, 880, 0.56, [211, 346]), tx = lerp(1250, hx, easeInOut(prog(lt, 0.6, 1.5))), ty = lerp(560, hy - 10, easeInOut(prog(lt, 0.6, 1.5))) - Math.sin(prog(lt, 0.6, 1.5) * Math.PI) * 60;
  h += `<g transform="translate(${f1(tx)} ${f1(ty)})"><circle r="26" fill="#FF9A2E" stroke="${INK}" stroke-width="5"/><path d="M-2 -26 q6 -12 16 -10" fill="none" stroke="#3E7B2E" stroke-width="5" stroke-linecap="round"/><ellipse cx="10" cy="-30" rx="10" ry="5" fill="#5FA84A" stroke="${INK}" stroke-width="3"/></g>`;
  h += pop(t, T0 + at14(t, a, '한 번도', 0), t + 99, 1460, 300, label(0, 0, '처음 본 웃음', { size: 44, bg: YEL }), { rot: 3, bob: 3 });
  return h;
}
// 48-50 Epley & Schroeder 2014: the commuter train
function ltrainScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  if (k === 0) {
    let h = train14(t);
    const sway = Math.sin(t * 2.2) * 3;
    h += `<g transform="translate(0 ${f1(sway)})">`;
    h += P14(420, 880, 0.48, '#C9B4E8', { t, seed: 1465, pose: '앉아설명', ex: exprAt([[0, '신남']], t), look: [0.7, 0] }) + P14(640, 880, 0.48, '#9ED8A6', { t, seed: 1466, pose: '앉기', ex: exprAt([[0, '미소']], t), look: [-0.7, 0] });
    h += P14(1360, 880, 0.48, '#7CC7FF', { t, seed: 1467, pose: '앉아폰', ex: exprAt([[0, '기본']], t), look: [0, 0.6] }) + P14(1580, 880, 0.48, '#F2B8A0', { t, seed: 1468, pose: '앉기', ex: exprAt([[0, '졸림']], t), look: [0.3, 0.3] });
    h += `</g>`;
    h += pop(t, T0 + 0.2, t + 99, 1000, 180, label(0, 0, '미국 시카고 · 출근 기차', { size: 40, bg: '#fff' }), {});
    h += pop(t, T0 + at14(t, a, '옆자리', 0), t + 99, 530, 470, label(0, 0, '옆 사람과 이야기하며', { size: 38, bg: YEL }), { rot: -2 });
    h += pop(t, T0 + at14(t, a, '혼자 조용히', 0), t + 99, 1470, 470, label(0, 0, '혼자 조용히', { size: 38, bg: '#BFE3F5' }), { rot: 2 });
    return h;
  }
  let h = labBg(t);
  if (k === 1) {
    const c1 = at14(t, a, '예상', 0), c2 = at14(t, a, '결과는', 0);
    const grp = (x, title, aH, bH, kk, hl) => { let s = T8(x, 240, title, { size: 48, fill: '#fff' }) + `<line x1="${x - 260}" y1="780" x2="${x + 260}" y2="780" stroke="#fff" stroke-width="6" opacity=".7"/>`;
      s += `<rect x="${x - 200}" y="${f1(780 - aH * kk)}" width="160" height="${f1(aH * kk)}" rx="12" fill="${YEL}" stroke="${INK}" stroke-width="6"/><rect x="${x + 40}" y="${f1(780 - bH * kk)}" width="160" height="${f1(bH * kk)}" rx="12" fill="#8FB8FF" stroke="${INK}" stroke-width="6"/>`;
      s += T8(x - 120, 836, '이야기', { size: 34, fill: '#fff' }) + T8(x + 120, 836, '혼자', { size: 34, fill: '#fff' });
      if (hl && kk > 0.9) s += `<rect x="${x - 214}" y="${f1(780 - aH - 14)}" width="188" height="${f1(aH + 28)}" rx="18" fill="none" stroke="${MINT}" stroke-width="8"/>`; return s; };
    h += grp(560, '예상', 220, 360, easeOut(prog(lt, c1, c1 + 0.8)), false);
    if (lt > c2 - 0.2) h += grp(1360, '결과', 400, 230, easeOut(prog(lt, c2, c2 + 0.8)), true);
    h += T8(1720, 900, '개념도', { anchor: 'end', size: 28, fill: '#9FB4D8', w: 700 });
    if (lt > c2 + 0.8) h += pop(t, T0 + c2 + 0.8, t + 99, 1700, 420, label(0, 0, '정반대!', { size: 46, bg: MINT }), { rot: 3, wobble: 2 });
    return h;
  }
  h += pop(t, T0 + 0.15, t + 99, 960, 330, big(0, 0, [[['거절당한 사람', '#fff']], [['0', YEL], ['명', '#fff']]], { size: 110, sw: 20, lh: 150 }), { noPop: true, inDur: 0.5 });
  h += P14(960, 900, 0.4, '#C9B4E8', { t, seed: 1469, pose: '손인사', ex: exprAt([[0, '신남']], t) });
  return h;
}
// 51-54, 57 method 3: the one who drifted away
const msgIcon14 = `<g><rect x="-230" y="-58" width="460" height="116" rx="30" fill="#FFE36E" stroke="${INK}" stroke-width="6"/>${T8(0, 14, '잘 지내?', { size: 46, fill: NAVY })}</g>`;
function memory14(t, x, y, r, k) { // a sepia memory bubble: two friends walking by the river
  if (k <= 0) return '';
  const rr = r * easeOutBack(clamp(k, 0, 1));
  let inner = `<rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r}" fill="#F1DFBA"/><rect x="${x - r}" y="${y + 20}" width="${2 * r}" height="${r}" fill="#B9A27A"/><path d="M${x - r} ${y + 20} Q${x} ${y} ${x + r} ${y + 24}" fill="none" stroke="#8A6A44" stroke-width="5"/>`;
  inner += Z({ t, seed: 1470, x: x - 70, y: y + 190, s: 0.3, pose: walkPose(t * 2.4, 0.4), ex: exprAt([[0, '신남']], t), look: [0.6, 0] }) + SJ({ t, seed: 1471, x: x + 70, y: y + 190, s: 0.3, pose: walkPose(t * 2.4 + 1, 0.4), ex: exprAt([[0, '신남']], t), look: [-0.6, 0] });
  return `<defs><filter id="sep14"><feColorMatrix type="matrix" values="0.42 0.6 0.14 0 0.06  0.36 0.55 0.12 0 0.03  0.28 0.44 0.1 0 0  0 0 0 1 0"/></filter><clipPath id="mem14"><circle cx="${x}" cy="${y}" r="${f1(rr)}"/></clipPath></defs><g clip-path="url(#mem14)" filter="url(#sep14)">${inner}</g><circle cx="${x}" cy="${y}" r="${f1(rr)}" fill="none" stroke="#fff" stroke-width="12"/><circle cx="${x}" cy="${y}" r="${f1(rr + 6)}" fill="none" stroke="${INK}" stroke-width="5"/>`;
}
function lmsgScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  if (k === 0) return methodCard14(t, lt, a, 3, msgIcon14);
  if (k === 4) { // the message goes out
    let h = BG('#1B2340') + `<ellipse cx="960" cy="560" rx="700" ry="560" fill="url(#screenGlow)" opacity=".45"/>`;
    const txt = '잘 지내? 갑자기 생각나서.', kt = prog(lt, 0.1, 1.3), sent = lt > 1.6;
    h += chatPhone(960, 560, 0.98, t, { title: '서준', clock: '오후 11:24', msgs: sent ? [{ me: 1, text: [txt], k: prog(lt, 1.6, 1.9), time: '오후 11:24', unread: 1 }] : [], draft: sent ? [] : [typeLines([txt], kt)[0] || ''], cursor: !sent, sendGlow: !sent && kt >= 1 ? 1 : 0, finger: !sent && kt >= 1 ? 2 : null });
    return h;
  }
  let h = room14(t, { tv: false });
  h += sofa14(900, 1, true);
  const zx = 900, zs = 0.62;
  h += Z({ t, seed: 1472, x: zx, y: 880, s: zs, pose: '앉아폰', ex: exprAt(k === 3 ? [[0, '걱정']] : k === 2 ? [[0, '서운함']] : [[0, '기본']], t), look: [0.1, 0.6] });
  h += sofa14(900, 1, false);
  const [px, py] = handG(zx, 880 + 40 * zs, zs, [200, 318]);
  h += `<g transform="translate(${f1(px)} ${f1(py + 22 * zs)}) scale(${zs})"><rect x="-36" y="-60" width="72" height="120" rx="12" fill="#1F2D44" stroke="${INK}" stroke-width="6"/><rect x="-28" y="-50" width="56" height="98" rx="6" fill="#8FDBFF"/></g><circle cx="${f1(px)}" cy="${f1(py)}" r="140" fill="url(#screenGlow)" opacity=".6"/>`;
  if (k === 1) {
    const stop = at14(t, a, '서준', -0.3), sc = 470 * easeOut(prog(lt, 0.4, Math.max(1, stop)));
    h += pop(t, T0 + 0.1, t + 99, 1420, 470, listPhone14(0, 0, 0.62, t, { title: '연락처', clock: '오후 11:20', rows: CONTACTS14, scroll: Math.min(sc, 470), hi: lt > stop ? 5 : null }), { inDur: 0.4 });
    h += pop(t, T0 + 0.2, t + 99, 420, 170, label(0, 0, '다시, 금요일 밤', { size: 44, bg: '#fff' }), { rot: -3 });
    if (lt > stop + 0.2) h += pop(t, T0 + stop + 0.2, t + 99, 1420, 920, label(0, 0, '대학 동기, 서준', { size: 40, bg: YEL }), { rot: 2 });
    return h;
  }
  if (k === 2) {
    h += memory14(t, 1340, 420, 280, prog(lt, 0.2, 0.9));
    h += pop(t, T0 + at14(t, a, '3년째', 0), t + 99, 1340, 790, label(0, 0, '3년째, 연락 없음', { size: 42, bg: '#fff' }), { rot: -2 });
    return h;
  }
  // k3: hesitation — the draft, thumb hovering
  h += pop(t, T0 + 0.1, t + 99, 1420, 500, chatPhone(0, 0, 0.6, t, { title: '서준', clock: '오후 11:22', msgs: [{ text: ['그래 다음에 보자!'], time: '3년 전' }], draft: ['잘 지내?'], cursor: true }), { inDur: 0.4 });
  h += pop(t, T0 + 0.5, t + 99, 520, 300, bubble(0, 0, 340, 110, T8(0, 14, '이상하려나…', { size: 40 })), { bob: 3 });
  return h;
}
// 55-56 Liu et al. 2022
function lreachScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  let h = labBg(t);
  if (k === 0) {
    h += pop(t, T0 + 0.2, t + 99, 960, 150, label(0, 0, '5,900명 이상이 참여한 실험', { size: 42, bg: '#fff' }), {});
    const c1 = at14(t, a, '보낸', 0), c2 = at14(t, a, '실제보다', 0);
    h += `<line x1="460" y1="800" x2="1460" y2="800" stroke="#fff" stroke-width="6" opacity=".7"/>`;
    const g1 = easeOut(prog(lt, c1, c1 + 0.8)), g2 = easeOut(prog(lt, c2, c2 + 0.8));
    h += `<rect x="580" y="${f1(800 - 220 * g1)}" width="220" height="${f1(220 * g1)}" rx="14" fill="#8FB8FF" stroke="${INK}" stroke-width="6"/><rect x="1120" y="${f1(800 - 420 * g2)}" width="220" height="${f1(420 * g2)}" rx="14" fill="${YEL}" stroke="${INK}" stroke-width="6"/>`;
    if (g1 > 0) h += T8(690, 856, '보낸 사람의 예상', { size: 32, fill: '#fff' });
    if (g2 > 0) h += T8(1230, 856, '받은 사람의 실제 반가움', { size: 32, fill: '#fff' });
    if (g2 > 0.9) h += pop(t, T0 + c2 + 0.8, t + 99, 950, 400, label(0, 0, '생각보다 훨씬 반가워해요', { size: 40, bg: MINT }), { rot: -2 });
    h += T8(1720, 900, '개념도', { anchor: 'end', size: 28, fill: '#9FB4D8', w: 700 });
    return h;
  }
  h += pop(t, T0 + 0.1, t + 99, 960, 470, `<g transform="scale(1.3)"><rect x="-120" y="-60" width="240" height="160" rx="14" fill="${PINK}" stroke="${INK}" stroke-width="7"/><rect x="-136" y="-100" width="272" height="56" rx="12" fill="#FF8FC0" stroke="${INK}" stroke-width="7"/><rect x="-18" y="-100" width="36" height="200" fill="${YEL}" stroke="${INK}" stroke-width="5"/>${burst(60, YEL)}<path d="M0 -150 q-30 -30 -50 0 q20 26 50 50 q30 -24 50 -50 q-20 -30 -50 0" fill="#FF5F7A" stroke="${INK}" stroke-width="5"/></g>`, { bob: 4 });
  h += pop(t, T0 + 0.3, t + 99, 960, 200, label(0, 0, '뜻밖일수록, 더 반갑다', { size: 48, bg: YEL }), { rot: -2 });
  return h;
}
// 58-60 no reply
function lwaitScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  if (k === 0) {
    let h = BG('#1B2340') + `<ellipse cx="960" cy="560" rx="700" ry="560" fill="url(#screenGlow)" opacity=".35"/>`;
    const rd = prog(lt, at14(t, a, '사라졌는데', -0.6), at14(t, a, '사라졌는데', 0));
    const mins = Math.floor(lerp(24, 58, prog(lt, 0.5, D)));
    h += chatPhone(760, 560, 0.98, t, { title: '서준', clock: `오후 11:${mins}`, msgs: [{ me: 1, text: ['잘 지내? 갑자기 생각나서.'], time: '오후 11:24', unread: 1 - rd }] });
    if (lt > at14(t, a, '답이', 0)) for (let j = 0; j < 3; j++) h += `<circle cx="${1400 + j * 60}" cy="560" r="16" fill="#fff" opacity="${f1((0.25 + 0.6 * Math.abs(Math.sin(t * 2 + j * 0.7))) * 100) / 100}"/>`;
    h += pop(t, T0 + at14(t, a, '사라졌는데', 0), t + 99, 1480, 380, label(0, 0, '읽음', { size: 40, bg: '#fff' }), { rot: 3 });
    h += pop(t, T0 + at14(t, a, '답이', 0), t + 99, 1480, 760, label(0, 0, '답장 없음', { size: 44, bg: '#8FB8FF' }), { rot: -2 });
    return h;
  }
  let h = bedroom(t, { clock: k === 1 ? '23:58' : '01:47' });
  h += `<ellipse cx="620" cy="770" rx="150" ry="46" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
  const x = 820, y = 900, s = 0.74;
  if (k === 1) {
    h += `<circle cx="${x}" cy="660" r="240" fill="url(#screenGlow)" opacity=".8"/>`;
    h += Z({ t, seed: 1475, x, y, s, pose: '폰보기', ex: exprAt([[0, '서운함']], t), look: [0, 0.9], shade: '#C9D9F0', tilt: -6 });
    h += blanket(800);
    const [px, py] = handG(x, y, s, [200, 318]); h += phone(px, py - 6, 0.42, { on: 1, glow: 0 }) + hand(px - 24, py + 8, s) + hand(px + 24, py + 8, s);
    return h;
  }
  h += BG('#000').replace('/>', ' opacity=".35"/>');
  h += Z({ t, seed: 1476, x, y, s, pose: '서기', ex: exprAt([[0, '기본']], t), look: [0.2, -0.8], shade: '#B9C6DE' });
  h += blanket(800);
  h += `<g transform="translate(1180 790) rotate(-8)"><rect x="-56" y="-14" width="112" height="28" rx="10" fill="#1F2D44" stroke="${INK}" stroke-width="5"/><circle cx="-34" cy="0" r="6" fill="#0A0F18" stroke="#3A4A66" stroke-width="2"/></g>`;
  h += pop(t, T0 + 0.4, t + 99, 1180, 690, label(0, 0, '뒤집어 둔 휴대폰', { size: 34, bg: '#fff' }), { rot: -3 });
  return h;
}
// 61 two stories meet: Zero awake tonight / Schopenhauer at his desk, 1831
function lletterScene(t, lt, a) {
  const D = D14(a), T0 = t - lt;
  const split = easeInOut(prog(lt, 0.2, 1.2));
  let L = bedroom(t, { clock: '01:47' }) + `<ellipse cx="620" cy="770" rx="150" ry="46" fill="#fff" stroke="${INK}" stroke-width="7"/>` + BG('#000').replace('/>', ' opacity=".35"/>') + Z({ t, seed: 1477, x: 820, y: 900, s: 0.74, pose: '서기', ex: exprAt([[0, '기본']], t), look: [0.2, -0.8], shade: '#B9C6DE' }) + blanket(800);
  let R = BG('#1E1A24') + `<rect x="-600" y="880" width="3120" height="600" fill="#2B2018"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>` + windowNight(1500, 170, 300, 240, t) + desk12(1300, 720, t, 0);
  R += `<ellipse cx="1180" cy="660" rx="300" ry="220" fill="url(#amber)" opacity="${f1((0.75 + 0.1 * Math.sin(t * 8)) * 100) / 100}"/><rect x="1166" y="650" width="22" height="70" rx="6" fill="#F4EBD8" stroke="${INK}" stroke-width="4"/><path d="M1177 618 q12 18 0 32 q-12 -14 0 -32" fill="#FFB547" stroke="${INK}" stroke-width="3"/>`;
  R += chair12(1360, 900, 0.56) + SCH({ t, seed: 1478, x: 1360, y: 900, s: 0.56, pose: '책상', ex: exprAt([[0, '서운함']], t), look: [-0.2, 0.6] });
  let h = `<g clip-path="url(#leftHalf)">${zoom14(L, 820, 700, 1)}</g><g clip-path="url(#rightHalf)" opacity="${f1(split * 100) / 100}">${R}</g>`;
  h += `<line x1="960" y1="-200" x2="960" y2="1300" stroke="${INK}" stroke-width="10" opacity="${f1(split * 100) / 100}"/>`;
  h += pop(t, T0 + 0.4, t + 99, 480, 140, label(0, 0, '오늘 밤, 제로', { size: 38, bg: '#BFE3F5' }), { rot: -2 });
  h += pop(t, T0 + 1.0, t + 99, 1440, 140, label(0, 0, '1831년, 쇼펜하우어', { size: 38, bg: '#FFE0B8' }), { rot: 2 });
  return h;
}
// 65-67 the next morning: the reply
function lreplyScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  if (k === 0) {
    let h = morningRoom12(t);
    h += `<rect x="420" y="540" width="920" height="300" rx="34" fill="#7A8FC6" stroke="${INK}" stroke-width="9"/><rect x="390" y="790" width="980" height="110" rx="26" fill="#F2F4FA" stroke="${INK}" stroke-width="9"/><ellipse cx="620" cy="770" rx="150" ry="46" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
    const up = prog(lt, 0.8, 1.6);
    h += Z({ t, seed: 1479, x: 820, y: 900, s: 0.74, pose: '서기', ex: exprAt([[0, '졸림'], [1.0, '놀람']], lt), look: [0.8, 0.4], tilt: lerp(-14, 0, up) });
    h += `<path d="M394 800 Q640 770 900 794 Q1140 814 1366 790 L1370 902 L390 902 Z" fill="#8FB0E8" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>`;
    const buzz = Math.sin(t * 60) * 4 * (lt > 0.3 ? 1 : 0);
    h += `<rect x="1420" y="700" width="230" height="180" rx="10" fill="#B88A5A" stroke="${INK}" stroke-width="7"/><g transform="translate(${f1(1535 + buzz)} 690) rotate(-4)"><rect x="-64" y="-13" width="128" height="26" rx="9" fill="#1F2D44" stroke="${INK}" stroke-width="5"/><rect x="-54" y="-8" width="108" height="15" rx="6" fill="#8FDBFF"/></g>`;
    if (lt > 0.3) h += `<g stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity="${f1(Math.abs(Math.sin(t * 8)) * 100) / 100}"><path d="M1450 660 l-18 -18 M1620 660 l18 -18 M1535 650 l0 -26"/></g>`;
    h += pop(t, T0 + 0.1, t + 99, 1500, 520, label(0, 0, '다음 날 아침', { size: 42, bg: '#fff' }), { rot: -2 });
    return h;
  }
  let h = BG('#F3E9DC') + `<ellipse cx="960" cy="540" rx="800" ry="560" fill="url(#warm)" opacity=".6"/>`;
  const m1 = ['와… 나 너한테', '연락할까 말까,', '몇 번이나 망설였는데.', '먼저 해 줘서 고마워.'], m2 = ['내일 시간 돼?', '우리 걷던 그 강변,', '아직 그대로더라.'];
  const msgs = [{ me: 1, text: ['잘 지내? 갑자기 생각나서.'], time: '어제 오후 11:24' }];
  if (k === 1) msgs.push({ text: m1, k: prog(lt, 0.3, 0.7) });
  else { msgs.push({ text: m1 }); msgs.push({ text: m2, k: prog(lt, 0.2, 0.6) }); }
  h += chatPhone(760, 560, 0.98, t, { title: '서준', clock: '오전 8:03', msgs });
  h += Z({ t, seed: 1480, x: 1450, y: 900, s: 0.68, pose: '폰보기', ex: exprAt(k === 1 ? [[0, '놀람'], [1.6, '울먹']] : [[0, '신남']], lt), look: [-0.4, 0.5] });
  if (k === 1 && lt > 1.6) h += tears12(1450, 900, 0.68, t);
  return h;
}
// 71-74 what the porcupines found; Zero, warm
function lendScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  if (k === 3) { // mirror of the opening: same sofa, same Friday-ish night, but warm
    const w = 0.5 + 0.5 * prog(lt, 0, 3);
    let sc = room14(t, { tv: false, warm: w, snow: true });
    sc += sofa14(900, 1, true) + Z({ t, seed: 1481, x: 900, y: 880, s: 0.62, pose: '앉기', ex: exprAt([[0, '미소'], [at14(t, a, '지금은', 0), '신남']], lt), look: [0.5, -0.1] }) + sofa14(900, 1, false);
    sc += table14(1190) + teaCup14(1150, 770, t, 0.8) + `<g transform="translate(1250 760) rotate(-10)"><rect x="-36" y="-12" width="72" height="24" rx="8" fill="#1F2D44" stroke="${INK}" stroke-width="5"/><rect x="-28" y="-7" width="56" height="13" rx="5" fill="#FFE36E"/></g>`;
    let h = zoom14(sc, 960, 700, 1 + 0.22 * easeInOut(prog(lt, 0, D)));
    h += pop(t, T0 + at14(t, a, '지금은', 0.2), t + 99, 1500, 300, chatPhone(0, 0, 0.42, t, { title: '서준', clock: '일요일 오후 9:10', msgs: [{ text: ['오늘 진짜 좋았다'], k: 1 }, { text: ['다음 주에도 걷자'], k: 1 }, { me: 1, text: ['좋아!'], time: '오후 9:11' }] }), { bob: 3 });
    return h;
  }
  let h = snow14(t);
  if (k === 0) {
    h += hogs14(t, 960, 880, 280, 0.78, 4, { glow: 0.9, ex: 'happy' });
    h += pop(t, T0 + 0.2, t + 99, 960, 230, big(0, 0, [[['혼자도, 바짝도 아닌', '#fff']], [['견딜 만한 거리', YEL]]], { size: 80, sw: 15, lh: 106 }), { noPop: true, inDur: 0.5 });
    return h;
  }
  const g = k === 1 ? prog(lt, 0.3, 2.2) : 1, walk = k === 2 ? easeInOut(prog(lt, 0.2, D - 0.6)) : 0;
  h += hogs14(t, 640, 880, 250, 0.7, 3, { glow: 0.5 + 0.4 * walk, ex: walk > 0.6 ? 'happy' : undefined });
  h += warmHog14(t, lerp(1500, 1100, walk), 880, 0.8, g, { flip: true });
  if (k === 1) h += pop(t, T0 + 0.4, t + 99, 1500, 380, label(0, 0, '혼자서 나를 데우는 시간', { size: 42, bg: YEL }), { rot: 2 });
  else h += pop(t, T0 + 0.3, t + 99, 1200, 380, label(0, 0, '그 온기로, 먼저 한 걸음', { size: 44, bg: YEL }), { rot: -2, bob: 3 });
  return h;
}
// 75-77 recap
function lrecapScene(t, lt, a) {
  const k = a.k || 0, D = D14(a), T0 = t - lt;
  let h = labBg(t);
  if (k === 0) {
    h += pop(t, T0 + 0.1, t + 99, 960, 160, label(0, 0, '오늘의 실험 · 한 줄 정리', { size: 40, bg: MINT }), {});
    h += pop(t, T0 + Math.min(1.0, at14(t, a, '혼자서', 0)), t + 99, 960, 370, big(0, 0, [[['혼자서 ', '#fff'], ['나를 데우고', YEL], [',', '#fff']], [['그 온기로 ', '#fff'], ['먼저 한 걸음', MINT]]], { size: 88, sw: 16, lh: 118 }), {});
    h += warmHog14(t, 780, 860, 0.6, 1, {}) + `<path d="M920 800 L1060 800 M1036 780 L1060 800 L1036 820" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>` + hogs14(t, 1300, 860, 160, 0.5, 2, { glow: 0.7, ex: 'happy' });
    return h;
  }
  if (k === 1) {
    const c1 = `<text x="-250" y="-30" font-family="${FONT}" font-weight="900" font-size="40" fill="#3E5C84">오늘 밤</text>` + T8(-250, 50, '휴대폰 없이, 혼자 15분', { anchor: 'start', size: 46, fill: NAVY }) + `<circle cx="-330" cy="0" r="50" fill="#FFF2C0" stroke="${INK}" stroke-width="6"/><circle cx="-312" cy="-12" r="40" fill="#FFFDF4"/>`;
    const c2 = `<text x="-250" y="-30" font-family="${FONT}" font-weight="900" font-size="40" fill="#3E5C84">내일</text>` + T8(-250, 50, '떠오르는 한 사람에게, 먼저 한 줄', { anchor: 'start', size: 42, fill: NAVY }) + `<g transform="translate(-330 0) scale(.5)"><rect x="-56" y="-96" width="112" height="192" rx="18" fill="#1F2D44" stroke="${INK}" stroke-width="7"/><rect x="-44" y="-82" width="88" height="160" rx="10" fill="#FFE36E"/></g>`;
    h += pop(t, T0 + 0.2, t + 99, 960, 330, card14(0, 0, 1120, 200, c1, { bg: '#EAF4FF' }), { rot: -1 });
    h += pop(t, T0 + at14(t, a, '그리고 내일', 0), t + 99, 960, 600, card14(0, 0, 1120, 200, c2, { bg: '#FFF7D6' }), { rot: 1 });
    return h;
  }
  h += pop(t, T0 + 0.2, t + 99, 960, 230, big(0, 0, [[['먼저 연락하고 싶은', '#fff']], [['한 사람', YEL], ['은?', '#fff']]], { size: 82, sw: 15, lh: 108 }), {});
  h += pop(t, T0 + at14(t, a, '이름 대신', 0), t + 99, 960, 470, label(0, 0, '이름 대신, 관계만 댓글로', { size: 44, bg: MINT }), { bob: 3 });
  [['대학 동기', 560], ['전 직장 동료', 960], ['사촌 동생', 1360]].forEach(([s2, x], j) => { h += pop(t, T0 + at14(t, a, '이름 대신', 0.6 + j * 0.3), t + 99, x, 600, label(0, 0, s2, { size: 34, bg: '#fff' }), { rot: (j - 1) * 3 }); });
  h += Z({ t, seed: 1482, x: 960, y: 920, s: 0.42, pose: '손인사', ex: exprAt([[0, '신남']], t) });
  return h;
}
// 78 care line
function lcareScene(t, lt, a) {
  const D = D14(a), T0 = t - lt;
  let h = BG('#F3E9DC') + BG('url(#hatch)').replace('/>', ' opacity=".1"/>') + `<ellipse cx="960" cy="560" rx="760" ry="520" fill="url(#warm)" opacity=".7"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#D9C7A6"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  h += Z({ t, seed: 1483, x: 760, y: 880, s: 0.5, pose: '서기', ex: exprAt([[0, '미소']], t), look: [0.6, 0] }) + SJ({ t, seed: 1484, x: 1160, y: 880, s: 0.5, pose: '어깨', ex: exprAt([[0, '미소']], t), look: [-0.6, 0] });
  h += pop(t, T0 + 0.3, t + 99, 960, 220, big(0, 0, [[['혼자 견디지 말고,', NAVY]], [['도움을 청해 주세요', '#C2410C']]], { size: 66, sw: 0, lh: 90, fill: NAVY, stroke: 'none', shadow: false }), { noPop: true, inDur: 0.6 });
  h += pop(t, T0 + 0.45 * D, t + 99, 960, 420, label(0, 0, '자살예방상담 109 · 정신건강 위기상담 1577-0199 (24시간)', { size: 30, bg: '#fff' }), {});
  return h;
}
thanksScene = function (t, lt) {
  let h = labBg(t) + particles(t, 77, 30, [0, 0, 1920, 1080], YEL, { speed: 30, r: 5, op: 0.6 });
  h += pop(t, t - lt + 0.2, t + 99, 960, 220, outlined(0, 0, [[['끝까지 함께해 주셔서', '#fff']], [['고맙습니다', YEL]]], { size: 92, sw: 17 }), {});
  h += doctor(360, 960, 0.48, { t, expr: '미소', talk: env(t) });
  h += SCH({ t, seed: 81, x: 680, y: 890, s: 0.46, pose: '손인사', ex: exprAt([[0, '미소']], t) }) + poodle14(860, 890, 0.5, t, {});
  h += Z({ t, seed: 78, x: 1100, y: 890, s: 0.52, pose: '손인사', ex: exprAt([[0, '신남']], t) });
  h += SJ({ t, seed: 82, x: 1340, y: 890, s: 0.5, pose: '손인사', ex: exprAt([[0, '신남']], t) }) + hog14(1580, 890, 0.5, t, { flip: true, ex: 'happy' });
  h += pop(t, t - lt + 0.6, t + 99, 960, 420, label(0, 0, '상식실험실', { size: 40, bg: MINT }), {});
  return h;
};

/* ---------- HUD: which method (outside the camera) ---------- */
const METHOD14 = i => (i >= 34 && i <= 43) ? 1 : (i >= 44 && i <= 50) ? 2 : (i >= 51 && i <= 60) ? 3 : 0;
function hud14(t) {
  const i = lineIdx12(t), n = METHOD14(i); if (!n) return '';
  if ([34, 44, 51].includes(i)) return '';
  const l = TL.lines[i], lt = t - (l.t0 - 0.15), first = METHOD14(i - 1) !== n || [35, 45, 52].includes(i) && false, op = [35, 45, 52].includes(i) ? prog(lt, 0, 0.4) : 1;
  let h = `<g transform="translate(1560 86)" opacity="${f1(op * 100) / 100}"><rect x="-320" y="-46" width="640" height="92" rx="46" fill="${NAVY}" opacity=".88" stroke="${YEL}" stroke-width="4"/>`;
  [1, 2, 3].forEach(j => { const on = j === n, past = j < n; h += `<circle cx="${-282 + (j - 1) * 50}" cy="0" r="20" fill="${on ? YEL : past ? '#3A4A6A' : 'none'}" stroke="${on ? INK : '#5A6B85'}" stroke-width="3"/>` + T8(-282 + (j - 1) * 50, 9, String(j), { size: 24, fill: on ? NAVY : '#C9D6E8' }); });
  h += T8(-150, 11, methodTag14(n), { anchor: 'start', size: n === 3 ? 26 : 30, fill: '#fff' });
  return h + '</g>';
}
render = function (t) { _render12(t); const h = hud14(t); if (h) document.getElementById('v').insertAdjacentHTML('beforeend', h); };
window.render = render;
