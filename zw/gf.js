/* 제로의 세계 — 게임 감각 층(gf). shorts/engine.js·zw/act.js 뒤에 읽는다. 새 이름은 모두 gf 접두사. 엔진 본체는 건드리지 않는다.
   목표(운영자 2026-11-15): "게임처럼 귀엽고 단순한데 직관적이며 센스 있게". 남의 캐릭터·효과음·화면은 쓰지 않고 표현 원리만 우리 그림으로 옮긴다.
   원칙 여덟 가지
     1. 한 화면에 한 가지: 큰 실루엣, 밝은 단색, 둥근 모서리, 굵은 외곽선.
     2. 모든 움직임은 예비 동작 → 본 동작 → 출렁임(gfIn·gfHop·gfJelly). 빨리 들어오고 부드럽게 멈춘다.
     3. 상태는 글자가 아니라 게이지·아이콘·도장으로(gfMood·gfBar·gfStamp·gfQuest).
     4. 일이 생기면 바로 반응: 화면에 톡(gfRing·gfStarBurst·gfPlus) + 소리(zw/gf_sfx.py)가 같은 시각에.
     5. 감정은 머리 위 기호로(gfEmote: ! ? … ♪ 땀 하트 전구 zzz 반짝 우울).
     6. 장면 전환은 장난스럽게(gfIris·gfBands).
     7. 보상 연출(gfItem·gfStage·gfStamp·gfConfetti).
     8. 세계가 살아 있다: 구름·풀·화분이 늘 조금씩 움직인다(gfClouds·gfPlant·gfTree).
   쓰는 법은 zw/GF.md, 실제 예는 wonhyo01/long/whgf.js. */
const GFC = { sky: '#8FD3FF', sky2: '#D6F2FF', grass: '#8ADB6A', grass2: '#5FC46E', sand: '#FFE7B0', cream: '#FFFBF0', coral: '#FF6B6B', sun: '#FFD84A', mint: '#3DDBB4', berry: '#FF7EB6', grape: '#8E7CFF', navy: '#1E2A4A', wood: '#E0A86B', wood2: '#B97F4A', stone: '#C3CCD6', night: '#27335F', paper: '#FFF6E0' };
const GF = { names: { Z: ['제로', '#FF9A55'], B: ['팀장', '#5B6B8C'] }, sub: 'box' };

/* ---------- 시간·탄력 ---------- */
const gfK = (a, b, x) => clamp((x - a) / (b - a), 0, 1);
const gfIn = (t, t0, f = 3.0, z = 0.45) => t <= t0 ? 0 : actStep(t - t0, f, z);                 // 0 → 살짝 넘침 → 1 (톡 튀어나옴)
const gfOut = (t, t1, d = 0.16) => t <= t1 ? 1 : Math.max(0, 1 - easeIn(gfK(t1, t1 + d, t)) * 1); // 1 → 0 (쏙 들어감)
const gfBeat = (t, t0, A = 0.14, f = 4, lam = 9) => { const u = t - t0; return u < 0 ? 1 : 1 + A * Math.exp(-lam * u) * Math.cos(2 * Math.PI * f * u); }; // 강조: 한 번 커졌다 돌아옴
const gfJelly = (t, t0, A = 0.14, f = 4.2, lam = 7) => actHit(t, t0, A, f, lam);                // 젤리처럼 눌렸다 출렁 → { sx, sy }
const gfShake = (t, t0, amp = 10, d = 0.3) => { const u = t - t0; if (u < 0 || u > d) return [0, 0]; const k = amp * (1 - u / d); return [Math.sin(u * 90) * k, Math.cos(u * 70) * k * 0.6]; };
/* 깡충: 웅크림(예비) → 뜀 → 착지 출렁. { dy, sx, sy, air(0~1) } */
function gfHop(t, t0, h = 46, d = 0.4) {
  const u = t - t0;
  if (u < -0.12) return { dy: 0, sx: 1, sy: 1, air: 0 };
  if (u < 0) { const k = Math.sin(Math.PI / 2 * (u + 0.12) / 0.12); return { dy: 0, sx: 1 + 0.07 * k, sy: 1 - 0.1 * k, air: 0 }; }
  if (u < d) { const p = u / d, y = 4 * p * (1 - p); return { dy: -h * y, sx: 1 - 0.05 * y, sy: 1 + 0.07 * y, air: y }; }
  const j = actHit(t, t0 + d, 0.11, 4.5, 8); return { dy: 0, sx: j.sx, sy: j.sy, air: 0 };
}
const gfM = (...ms) => ms.reduce((a, b) => ({ dy: a.dy + (b.dy || 0), dx: a.dx + (b.dx || 0), sx: a.sx * (b.sx == null ? 1 : b.sx), sy: a.sy * (b.sy == null ? 1 : b.sy), air: Math.max(a.air, b.air || 0) }), { dy: 0, dx: 0, sx: 1, sy: 1, air: 0 });
/* 통통 걷기: x(걸어간 거리)로 걸음을 맞춘다 → { pose, sy, dy } */
const gfWalk = (x, amp = 0.8, stride = 0.045) => { const ph = x * stride; return { pose: walkPose(ph, amp), sy: 1 + 0.035 * Math.sin(2 * ph), dy: -Math.abs(Math.sin(ph)) * 7 }; };
/* 바닥 그림자(뜨면 작아진다)와 인물 그리기: gfActor(WZ, {x, y, s, …}, 움직임) */
const gfBlob = (x, y, w, air = 0) => `<ellipse cx="${f1(x)}" cy="${f1(y + 5)}" rx="${f1(w * (1 - 0.35 * air))}" ry="${f1(w * 0.2 * (1 - 0.35 * air))}" fill="#1E2A4A" opacity="${f1((0.24 - 0.1 * air) * 100) / 100}"/>`;
function gfActor(fn, o, m = {}) {
  const mm = gfM(m), s = o.s || 1;
  return gfBlob(o.x + (mm.dx || 0), o.y, 92 * s, mm.air) + fn(Object.assign({}, o, { x: o.x + (mm.dx || 0), y: o.y + mm.dy, sx: (o.sx || 1) * mm.sx, sy: (o.sy || 1) * mm.sy }));
}
const gfAbove = (x, y, s, dx = 0, dy = 0) => [x + dx * s, y - (545 - dy) * s];                  // 머리 위(기호 자리)
const gfHand = (x, y, s, h) => [x + (h[0] - 200) * s, y + (h[1] - 560) * s];

/* ---------- 색·글자 ---------- */
const gfHex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const gfMix = (a, b, k) => { const A = gfHex(a), B = gfHex(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(k, 0, 1))).toString(16).padStart(2, '0')).join(''); };
const gfMix3 = (a, b, c, k) => k < 0.5 ? gfMix(a, b, k * 2) : gfMix(b, c, (k - 0.5) * 2);
const _gfCv = document.createElement('canvas').getContext('2d'), _gfWc = {};
const gfTextW = (s, fs = 40, wt = 900) => { const k = wt + '|' + s; if (_gfWc[k] == null) { _gfCv.font = `${wt} 100px ${FONT}`; _gfWc[k] = _gfCv.measureText(s).width / 100; } return _gfWc[k] * fs; };
const gfT = (x, y, s, fs = 40, fill = GFC.navy, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${o.anchor || 'middle'}" font-family="${FONT}" font-weight="${o.wt || 900}" font-size="${fs}" fill="${fill}"${o.sw ? ` stroke="${o.stroke || INK}" stroke-width="${o.sw}" stroke-linejoin="round" paint-order="stroke"` : ''}>${esc(s)}</text>`;
/* 한 글자씩 톡톡 튀어나오는 제목. segs: '글' 또는 [['글', 색], …] */
function gfBounceText(t, t0, x, y, segs, o = {}) {
  const fs = o.size || 110, sw = o.sw == null ? fs * 0.2 : o.sw, gap = o.stagger == null ? 0.04 : o.stagger;
  if (typeof segs === 'string') segs = [[segs, o.fill || WHITE]];
  const full = segs.map(s => s[0]).join(''), Wd = gfTextW(full, fs); let h = '', i = 0, acc = '';
  for (const [tx, col] of segs) for (const ch of tx) {
    const cx = x - Wd / 2 + gfTextW(acc, fs) + gfTextW(ch, fs) / 2; acc += ch; if (ch === ' ') continue;
    const k = gfIn(t, t0 + i * gap, 3.2, 0.4), idle = o.wave ? Math.sin(t * 3 - i * 0.55) * o.wave : 0; i++;
    if (k < 0.02) continue;
    h += `<g transform="translate(${f1(cx)} ${f1(y + idle)}) rotate(${f1((1 - Math.min(1, k)) * -16)}) scale(${f1(k * 1000) / 1000})">` +
      `<text x="5" y="8" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${fs}" stroke="${GFC.navy}" stroke-width="${sw}" stroke-linejoin="round" fill="${GFC.navy}" opacity=".35">${esc(ch)}</text>` +
      `<text x="0" y="0" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${fs}" stroke="${o.stroke || INK}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke" fill="${col || WHITE}">${esc(ch)}</text></g>`;
  }
  return h;
}

/* ---------- 작은 그림(아이콘): 원점 가운데, 크기 약 52 ---------- */
const gfStar4 = (r, fill = '#fff', sw = 0) => `<path d="M0 ${-r} Q${f1(r * 0.18)} ${f1(-r * 0.18)} ${r} 0 Q${f1(r * 0.18)} ${f1(r * 0.18)} 0 ${r} Q${f1(-r * 0.18)} ${f1(r * 0.18)} ${-r} 0 Q${f1(-r * 0.18)} ${f1(-r * 0.18)} 0 ${-r} Z" fill="${fill}"${sw ? ` stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"` : ''}/>`;
const gfStar5 = (r, fill = GFC.sun, sw = 5) => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.46 : r; d += (i ? 'L' : 'M') + f1(Math.cos(a) * rr) + ' ' + f1(Math.sin(a) * rr); } return `<path d="${d}Z" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>`; };
const gfHeartD = 'M0 20 C-24 2 -28 -8 -28 -15 C-28 -26 -20 -30 -13 -30 C-6 -30 0 -25 0 -19 C0 -25 6 -30 13 -30 C20 -30 28 -26 28 -15 C28 -8 24 2 0 20 Z';
const GF_ICON = {
  heart: () => `<path d="${gfHeartD}" fill="${GFC.coral}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="-12" cy="-17" rx="6" ry="4" fill="#fff" opacity=".7"/>`,
  star: () => gfStar5(27),
  spark: () => gfStar4(26, GFC.sun, 4),
  sun: (t = 0) => `<g transform="rotate(${f1(t * 20)})">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="0" y1="-23" x2="0" y2="-30" stroke="${INK}" stroke-width="6" stroke-linecap="round" transform="rotate(${i * 45})"/>`).join('')}</g><circle r="16" fill="${GFC.sun}" stroke="${INK}" stroke-width="5"/>`,
  moon: () => `<path d="M8 -25 A25 25 0 1 0 8 25 A19 19 0 1 1 8 -25 Z" fill="#FFE9A8" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`,
  skull: () => `<path d="M-23 -5 Q-23 -31 0 -31 Q23 -31 23 -5 Q23 9 13 13 L13 23 L-13 23 L-13 13 Q-23 9 -23 -5 Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="-9" cy="-6" rx="6" ry="7" fill="${INK}"/><ellipse cx="9" cy="-6" rx="6" ry="7" fill="${INK}"/><path d="M-4 15 L-4 23 M4 15 L4 23" stroke="${INK}" stroke-width="3"/><path d="M-2 5 L0 1 L2 5 Z" fill="${INK}"/>`,
  ghost: () => `<path d="M-23 27 Q-27 -31 0 -33 Q27 -31 23 27 Q15 19 8 27 Q0 19 -8 27 Q-15 19 -23 27 Z" fill="#CFC4FF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="-8" cy="-8" rx="4.5" ry="6" fill="${INK}"/><ellipse cx="8" cy="-8" rx="4.5" ry="6" fill="${INK}"/><ellipse cx="0" cy="5" rx="4" ry="5" fill="${INK}"/>`,
  ball: () => `<circle r="26" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M0 -10 L10 -3 L6 9 L-6 9 L-10 -3 Z" fill="${INK}"/><path d="M0 -10 L0 -25 M10 -3 L24 -8 M6 9 L15 21 M-6 9 L-15 21 M-10 -3 L-24 -8" stroke="${INK}" stroke-width="4"/>`,
  check: () => `<circle r="26" fill="${GFC.grass2}" stroke="${INK}" stroke-width="5"/><path d="M-12 1 L-3 10 L13 -9" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
  cross: () => `<circle r="26" fill="${GFC.coral}" stroke="${INK}" stroke-width="5"/><path d="M-10 -10 L10 10 M10 -10 L-10 10" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`,
  scroll: () => `<rect x="-22" y="-24" width="44" height="48" rx="4" fill="${GFC.paper}" stroke="${INK}" stroke-width="5"/><rect x="-28" y="-30" width="56" height="12" rx="6" fill="${GFC.wood}" stroke="${INK}" stroke-width="5"/><rect x="-28" y="18" width="56" height="12" rx="6" fill="${GFC.wood}" stroke="${INK}" stroke-width="5"/><path d="M-12 -8 H12 M-12 2 H12 M-12 12 H4" stroke="${INK}" stroke-width="3" opacity=".45" stroke-linecap="round"/>`,
  book: () => `<path d="M-27 -20 Q-13 -27 0 -19 Q13 -27 27 -20 L27 21 Q13 15 0 23 Q-13 15 -27 21 Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M0 -19 L0 23" stroke="${INK}" stroke-width="4"/><path d="M-20 -9 Q-12 -13 -6 -9 M-20 1 Q-12 -3 -6 1 M6 -9 Q12 -13 20 -9 M6 1 Q12 -3 20 1" stroke="${GFC.grape}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  pin: () => `<path d="M0 28 Q-22 2 -22 -10 A22 22 0 1 1 22 -10 Q22 2 0 28 Z" fill="${GFC.coral}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle cy="-10" r="8" fill="#fff" stroke="${INK}" stroke-width="4"/>`,
  calendar: () => `<rect x="-25" y="-22" width="50" height="48" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M-25 -8 H25" stroke="${INK}" stroke-width="5"/><rect x="-25" y="-22" width="50" height="14" rx="6" fill="${GFC.coral}" stroke="${INK}" stroke-width="5"/><circle cx="-10" cy="6" r="3.5" fill="${INK}"/><circle cx="2" cy="6" r="3.5" fill="${INK}"/><circle cx="14" cy="6" r="3.5" fill="${INK}"/><circle cx="-10" cy="16" r="3.5" fill="${INK}"/>`,
  eq: () => `<circle r="26" fill="${GFC.sun}" stroke="${INK}" stroke-width="5"/><path d="M-12 -7 H12 M-12 7 H12" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`,
  flask: () => `<path d="M-8 -28 H8 V-8 L24 20 Q26 28 16 28 H-16 Q-26 28 -24 20 L-8 -8 Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-17 12 H17 L22 22 Q23 25 17 25 H-17 Q-23 25 -22 22 Z" fill="${GFC.mint}"/><circle cx="-3" cy="16" r="3" fill="#fff"/><path d="M-11 -28 H11" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`,
  rain: () => `<path d="M-20 4 Q-30 4 -30 -6 Q-30 -16 -19 -16 Q-16 -28 -3 -28 Q9 -28 13 -18 Q28 -19 28 -7 Q28 4 17 4 Z" fill="#DDE6F2" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-14 12 L-18 24 M0 12 L-4 24 M14 12 L10 24" stroke="#4DA8FF" stroke-width="5" stroke-linecap="round"/>`,
  flag: () => `<path d="M-14 -28 L-14 28" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-12 -26 L24 -16 L-12 -4 Z" fill="${GFC.coral}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`,
  bulb: () => `<path d="M-18 -8 A18 18 0 1 1 18 -8 Q18 4 9 11 L9 18 H-9 L-9 11 Q-18 4 -18 -8 Z" fill="${GFC.sun}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="-9" y="18" width="18" height="9" rx="3" fill="#B9C2CF" stroke="${INK}" stroke-width="4"/>`,
  note: () => `<path d="M-6 16 L-6 -24 L18 -30 L18 8" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/><ellipse cx="-14" cy="17" rx="11" ry="8" fill="${INK}" transform="rotate(-18 -14 17)"/><ellipse cx="10" cy="10" rx="11" ry="8" fill="${INK}" transform="rotate(-18 10 10)"/>`,
  family: () => `<circle cx="-9" cy="-8" r="15" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M-27 27 Q-27 9 -9 9 Q9 9 9 27 Z" fill="${GFC.stone}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle cx="17" cy="6" r="10" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M5 27 Q5 17 17 17 Q29 17 29 27 Z" fill="${GFC.sun}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`,
  tie: () => `<path d="M-7 -28 H7 L10 -18 L4 -12 L11 18 L0 30 L-11 18 L-4 -12 L-10 -18 Z" fill="${GFC.coral}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`,
  door: () => `<rect x="-19" y="-28" width="38" height="56" rx="5" fill="${GFC.wood}" stroke="${INK}" stroke-width="5"/><circle cx="10" cy="3" r="4" fill="${GFC.sun}" stroke="${INK}" stroke-width="3"/>`,
  building: () => `<rect x="-21" y="-28" width="42" height="56" rx="5" fill="#BFD7FF" stroke="${INK}" stroke-width="5"/>${[[-10, -16], [4, -16], [-10, -2], [4, -2]].map(([x, y]) => `<rect x="${x}" y="${y}" width="7" height="8" rx="2" fill="#fff" stroke="${INK}" stroke-width="2.5"/>`).join('')}<rect x="-6" y="13" width="12" height="15" rx="2" fill="${GFC.wood}" stroke="${INK}" stroke-width="3"/>`,
};
const gfIcon = (name, s = 1, t = 0) => `<g transform="scale(${s})">${(GF_ICON[name] || GF_ICON.star)(t)}</g>`;

/* ---------- 머리 위 감정 기호 ---------- */
/* gfEmote(t, 나오는 시각, x, y, 종류, {hold, s}). 종류: bang(!) q(?) dots(…) note(♪) sweat heart idea zzz spark gloom vein shock */
function gfEmote(t, t0, x, y, kind, o = {}) {
  const hold = o.hold == null ? 1.2 : o.hold, u = t - t0; if (u < 0 || u > hold + 0.2) return '';
  const sc = (o.s || 1) * gfIn(t, t0, 3.4, 0.4) * gfOut(t, t0 + hold, 0.18); if (sc < 0.02) return '';
  const wob = Math.sin(u * 9) * 5 * Math.exp(-u * 2.2), bob = Math.sin(u * 3.2) * 4; let g = '', dx = 0, dy = 0;
  const bub = (w, h) => `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${Math.min(w, h) / 2}" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M${-w * 0.2} ${h / 2 - 3} L${-w * 0.34} ${h / 2 + 18} L${-w * 0.02} ${h / 2 - 3} Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="${-w * 0.26}" y="${h / 2 - 9}" width="${w * 0.3}" height="8" fill="#fff"/>`;
  if (kind === 'bang') { let d = ''; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, r = i % 2 ? 40 : 54; d += (i ? 'L' : 'M') + f1(Math.cos(a) * r) + ' ' + f1(Math.sin(a) * r); } g = `<path d="${d}Z" fill="${GFC.sun}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="-8" y="-30" width="16" height="36" rx="8" fill="${GFC.coral}" stroke="${INK}" stroke-width="5"/><circle cy="20" r="9" fill="${GFC.coral}" stroke="${INK}" stroke-width="5"/>`; }
  else if (kind === 'q') g = bub(96, 92) + gfT(0, 24, '?', 70, GFC.grape);
  else if (kind === 'dots') g = bub(128, 70) + [0, 1, 2].map(i => u > 0.12 + i * 0.22 ? `<circle cx="${-30 + i * 30}" cy="0" r="${f1(9 * gfIn(u, 0.12 + i * 0.22, 4, 0.5))}" fill="${GFC.navy}"/>` : '').join('');
  else if (kind === 'note') { dx = Math.sin(u * 4) * 12; dy = -26 * u; g = `<g transform="rotate(${f1(Math.sin(u * 4) * 10)})">${GF_ICON.note()}</g>`; }
  else if (kind === 'sweat') { dy = 16 * gfK(0, hold, u); g = `<path d="M0 -30 Q-20 4 -14 16 Q-8 28 0 28 Q8 28 14 16 Q20 4 0 -30 Z" fill="#9ED8FF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><ellipse cx="-5" cy="12" rx="4" ry="6" fill="#fff" opacity=".8"/>`; }
  else if (kind === 'heart') { dy = -18 * u; g = `<g transform="scale(${f1(1.35 * gfBeat(u, 0.3, 0.12, 2.2, 3))})">${GF_ICON.heart()}</g>`; }
  else if (kind === 'idea') { const p = 1 + 0.08 * Math.sin(u * 12); g = [0, 1, 2, 3, 4].map(i => `<line x1="0" y1="-44" x2="0" y2="${f1(-56 * p)}" stroke="${GFC.sun}" stroke-width="7" stroke-linecap="round" transform="rotate(${-80 + i * 40})"/>`).join('') + `<g transform="scale(1.5)">${GF_ICON.bulb()}</g>`; }
  else if (kind === 'zzz') g = [0, 1, 2].map(i => { const p = ((u * 0.7 + i * 0.33) % 1); return `<g transform="translate(${f1(p * 60)} ${f1(-p * 70)}) rotate(-10)" opacity="${f1(Math.sin(p * Math.PI) * 100) / 100}">${gfT(0, 0, 'Z', 34 + p * 30, '#fff', { sw: 9, stroke: GFC.grape })}</g>`; }).join('');
  else if (kind === 'spark') g = [[-34, 8, 20, 0], [10, -22, 30, 1.3], [40, 18, 16, 2.4]].map(([px, py, r, ph]) => `<g transform="translate(${px} ${py}) scale(${f1(0.55 + 0.45 * Math.abs(Math.sin(u * 5 + ph)))})">${gfStar4(r, GFC.sun, 4)}</g>`).join('');
  else if (kind === 'gloom') g = [[-30, 34], [-10, 52], [10, 40], [30, 58]].map(([px, len], i) => `<line x1="${px}" y1="-26" x2="${px}" y2="${f1(-26 + len * gfK(0, 0.35, u - i * 0.06))}" stroke="${GFC.grape}" stroke-width="8" stroke-linecap="round"/>`).join('');
  else if (kind === 'vein') g = `<g fill="none" stroke="${GFC.coral}" stroke-width="9" stroke-linecap="round"><path d="M-24 -8 Q-8 -8 -8 -24"/><path d="M8 -24 Q8 -8 24 -8"/><path d="M24 8 Q8 8 8 24"/><path d="M-8 24 Q-8 8 -24 8"/></g>`;
  else if (kind === 'shock') g = [0, 1, 2, 3, 4, 5].map(i => `<line x1="0" y1="-34" x2="0" y2="${f1(-34 - 26 * gfK(0, 0.2, u))}" stroke="${INK}" stroke-width="7" stroke-linecap="round" transform="rotate(${-75 + i * 30})"/>`).join('');
  return `<g transform="translate(${f1(x + dx)} ${f1(y + bob + dy)}) rotate(${f1(wob + (o.rot || 0))}) scale(${f1(sc * 1000) / 1000})">${g}</g>`;
}

/* ---------- 톡·반짝·먼지 ---------- */
function gfPuff(t, t0, x, y, s = 1, col = '#fff') { const u = gfK(t0, t0 + 0.42, t); if (u <= 0 || u >= 1) return ''; const e = easeOut(u);
  return [[-1, 0], [1, 0], [-0.35, -1], [0.4, -0.8]].map(([dx, dy], i) => `<circle cx="${f1(x + dx * (18 + 46 * e) * s)}" cy="${f1(y + dy * 22 * e * s - 6 * s)}" r="${f1((17 - 11 * u) * s * (i > 1 ? 0.8 : 1))}" fill="${col}" stroke="${INK}" stroke-width="${f1(4 * s)}" opacity="${f1((1 - u) * 100) / 100}"/>`).join(''); }
function gfRing(t, t0, x, y, r0 = 20, r1 = 120, col = '#fff', w = 12, d = 0.4) { const u = gfK(t0, t0 + d, t); if (u <= 0 || u >= 1) return ''; return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(lerp(r0, r1, easeOut(u)))}" fill="none" stroke="${col}" stroke-width="${f1(w * (1 - u))}" opacity="${f1((1 - u * u) * 100) / 100}"/>`; }
function gfStarBurst(t, t0, x, y, o = {}) { const d = o.d || 0.6, u = gfK(t0, t0 + d, t); if (u <= 0 || u >= 1) return ''; const n = o.n || 7, cols = o.cols || [GFC.sun, '#fff', GFC.berry, GFC.mint], e = easeOut(u); let h = '';
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + (o.rot || 0.3), r = lerp(o.r0 || 30, o.r1 || 150, e) * (0.8 + 0.4 * hash(i + 3)); h += `<g transform="translate(${f1(x + Math.cos(a) * r)} ${f1(y + Math.sin(a) * r * 0.85)}) rotate(${f1(u * 180 + i * 40)}) scale(${f1((1 - u) * (0.7 + 0.6 * hash(i)) * 100) / 100})">${gfStar4(o.size || 22, cols[i % cols.length], 4)}</g>`; }
  return h; }
const gfTwinkle = (t, x, y, r = 18, seed = 0, col = '#fff') => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(0.35 + 0.65 * Math.abs(Math.sin(t * 2.6 + seed * 1.7)))}) rotate(${f1(Math.sin(t + seed) * 20)})">${gfStar4(r, col, 3)}</g>`;
function gfConfetti(t, t0, o = {}) { const d = o.d || 2.2, u = t - t0; if (u < 0 || u > d) return ''; const n = o.n || 36, cols = [GFC.sun, GFC.berry, GFC.mint, GFC.sky, GFC.coral, GFC.grape]; let h = '';
  for (let i = 0; i < n; i++) { const x = (o.x || 960) + (hash(i * 2.3) - 0.5) * (o.w || 1700), v = 380 + 300 * hash(i * 5.1), y = (o.y || -40) + v * u + 140 * u * u - 60 * hash(i), r = u * (300 + 400 * hash(i)) + i * 37;
    h += `<rect x="-9" y="-5" width="18" height="10" rx="3" fill="${cols[i % cols.length]}" stroke="${INK}" stroke-width="2.5" transform="translate(${f1(x + Math.sin(u * 5 + i) * 26)} ${f1(y)}) rotate(${f1(r)})" opacity="${f1(gfOut(u, d - 0.4, 0.4) * 100) / 100}"/>`; }
  return h; }
/* 떠오르는 한마디("+1", "장착!") */
function gfPlus(t, t0, x, y, text, o = {}) { const d = o.d || 1.1, u = t - t0; if (u < 0 || u > d) return ''; const k = gfIn(t, t0, 3.6, 0.4), fs = o.size || 46;
  return `<g transform="translate(${f1(x)} ${f1(y - 64 * easeOut(u / d))}) scale(${f1(k * 1000) / 1000})" opacity="${f1(gfOut(u, d - 0.25, 0.25) * 100) / 100}">${gfT(0, 0, text, fs, o.col || GFC.sun, { sw: fs * 0.22 })}</g>`; }
/* 뒤에서 도는 햇살 */
function gfRays(t, x, y, r = 300, col = '#fff', n = 12, op = 0.35, sp = 14) { let h = ''; for (let i = 0; i < n; i++) { const a0 = (i / n) * 360 + t * sp, w = 360 / n * 0.5, p = (a) => `${f1(x + Math.cos(a * Math.PI / 180) * r)} ${f1(y + Math.sin(a * Math.PI / 180) * r)}`; h += `<path d="M${f1(x)} ${f1(y)} L${p(a0)} L${p(a0 + w)} Z" fill="${col}"/>`; } return `<g opacity="${op}">${h}</g>`; }

/* ---------- 화면 표시(UI): 모두 원점 가운데. pop()이나 translate로 놓는다 ---------- */
function gfPanel(w, h, o = {}) { const r = o.r == null ? 28 : o.r;
  let s = `<rect x="${-w / 2}" y="${-h / 2 + 10}" width="${w}" height="${h}" rx="${r}" fill="${GFC.navy}" opacity=".22"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${r}" fill="${o.bg || GFC.cream}" stroke="${INK}" stroke-width="${o.sw || 7}"/>`;
  if (o.head) { const fs = o.headSize || 30, tw = gfTextW(o.head, fs) + 44; s += `<rect x="${-w / 2 + 26}" y="${-h / 2 - 24}" width="${f1(tw)}" height="46" rx="23" fill="${o.headBg || GFC.sun}" stroke="${INK}" stroke-width="6"/>` + gfT(-w / 2 + 26 + tw / 2, -h / 2 + 10, o.head, fs, o.headCol || GFC.navy); }
  return s; }
/* 알약 꼬리표(아이콘 + 글) */
function gfChip(text, o = {}) { const fs = o.size || 36, ic = o.icon ? fs * 1.25 : 0, tw = gfTextW(text, fs), w = tw + ic + fs * 1.1, h = fs + 30, x0 = -w / 2;
  return `<rect x="${f1(x0)}" y="${-h / 2 + 7}" width="${f1(w)}" height="${h}" rx="${h / 2}" fill="${GFC.navy}" opacity=".22"/><rect x="${f1(x0)}" y="${-h / 2}" width="${f1(w)}" height="${h}" rx="${h / 2}" fill="${o.bg || '#fff'}" stroke="${INK}" stroke-width="6"/>` +
    (o.icon ? `<g transform="translate(${f1(x0 + fs * 0.55 + ic * 0.38)} 0)">${gfIcon(o.icon, fs / 52 * 0.95, o.t || 0)}</g>` : '') + gfT(x0 + fs * 0.55 + ic + tw / 2, fs * 0.36, text, fs, o.col || GFC.navy); }
const gfChipAt = (t, t0, x, y, text, o = {}) => t < t0 ? '' : `<g transform="translate(${f1(x)} ${f1(y + Math.sin((t - t0) * 2.4) * 2.5)}) rotate(${o.rot || 0}) scale(${f1(gfIn(t, t0, 3.2, 0.42) * 1000) / 1000})">${gfChip(text, o)}</g>`;
/* 마음 얼굴: v 0(지옥) ~ 1(맑음). 낮으면 작은 뿔이 난다 */
function gfFace(v, r = 36) { const col = gfMix3('#A08CFF', '#FFC25A', '#7FE07A', v), m = lerp(11, -13, v), horn = clamp((0.22 - v) / 0.12, 0, 1), s = r / 36;
  return `<g transform="scale(${f1(s * 100) / 100})">` + (horn > 0 ? `<g transform="scale(${f1(horn)})"><path d="M-26 -22 L-34 -46 L-14 -32 Z M26 -22 L34 -46 L14 -32 Z" fill="${GFC.coral}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>` : '') +
    `<circle r="36" fill="${col}" stroke="${INK}" stroke-width="6"/><ellipse cx="-12" cy="-7" rx="4.5" ry="${f1(6.5 - 2 * Math.max(0, v - 0.6))}" fill="${INK}"/><ellipse cx="12" cy="-7" rx="4.5" ry="${f1(6.5 - 2 * Math.max(0, v - 0.6))}" fill="${INK}"/>` +
    `<path d="M-13 ${f1(12 + m * 0.25)} Q0 ${f1(12 - m)} 13 ${f1(12 + m * 0.25)}" fill="none" stroke="${INK}" stroke-width="5.5" stroke-linecap="round"/>` +
    (v < 0.3 ? `<path d="M-20 -19 L-6 -14 M20 -19 L6 -14" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` : '') + (v > 0.62 ? `<ellipse cx="-22" cy="6" rx="7" ry="4" fill="#FF9BB0" opacity=".8"/><ellipse cx="22" cy="6" rx="7" ry="4" fill="#FF9BB0" opacity=".8"/>` : '') + `</g>`; }
/* 막대 게이지(원점 = 왼쪽 가운데). ghost: 비교용 점선 눈금(0~1) */
function gfBar(w, v, o = {}) { const h = o.h || 28, col = o.col || gfMix3('#A08CFF', '#FFC25A', '#7FE07A', v), fw = Math.max(h, w * clamp(v, 0, 1));
  let s = `<rect x="0" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="#E9E2D0" stroke="${INK}" stroke-width="5"/>` +
    (v > 0.01 ? `<rect x="2.5" y="${-h / 2 + 2.5}" width="${f1(fw - 5)}" height="${h - 5}" rx="${(h - 5) / 2}" fill="${col}"/><rect x="${h * 0.4}" y="${-h / 2 + 6}" width="${f1(Math.max(0, fw - h * 0.8))}" height="${h * 0.2}" rx="3" fill="#fff" opacity=".55"/>` : '');
  if (o.ghost != null) s += `<line x1="${f1(w * o.ghost)}" y1="${-h / 2 - 9}" x2="${f1(w * o.ghost)}" y2="${h / 2 + 9}" stroke="${GFC.grape}" stroke-width="5" stroke-dasharray="6 5" stroke-linecap="round"/>`;
  return s; }
/* 마음 게이지 패널: gfMood(v, {label, tp(값이 바뀐 시각), t, ghost, ghostLabel, w}) */
function gfMood(v, o = {}) { const w = o.w || 400, h = 108, bw = w - 150, pulse = o.tp != null ? gfBeat(o.t, o.tp, 0.1, 4, 8) : 1, sh = o.tp != null ? gfShake(o.t, o.tp, o.hurt ? 9 : 0, 0.28) : [0, 0];
  return `<g transform="translate(${f1(sh[0])} ${f1(sh[1])}) scale(${f1(pulse * 1000) / 1000})">` + gfPanel(w, h, { r: 34 }) + `<g transform="translate(${-w / 2 + 58} 0)">${gfFace(v, 34)}</g>` +
    gfT(-w / 2 + 112, -14, o.label || '마음', 30, GFC.navy, { anchor: 'start' }) + `<g transform="translate(${-w / 2 + 112} 22)">${gfBar(bw, v, { ghost: o.ghost })}</g>` +
    (o.ghost != null && o.ghostLabel ? `<path d="M${f1(-w / 2 + 112 + bw * o.ghost)} ${h / 2 - 6} v22" stroke="${GFC.grape}" stroke-width="5" stroke-dasharray="6 5" stroke-linecap="round"/>` + `<g transform="translate(${f1(-w / 2 + 112 + bw * o.ghost + 40)} ${h / 2 + 40})">${gfChip(o.ghostLabel, { size: 24, bg: '#EDE8FF', col: '#5B4FCF' })}</g>` : '') + `</g>`; }
/* 도장 쾅: t0에 내려찍힌다 */
function gfStamp(t, t0, text, o = {}) { const u = t - t0; if (u < -0.12) return ''; const fs = o.size || 64, col = o.col || '#E5484D', w = gfTextW(text, fs) + fs * 1.1, h = fs * 1.7;
  const fall = gfK(-0.12, 0, u), sc = u < 0 ? lerp(2.6, 1, easeIn(fall)) : gfBeat(t, t0, 0.16, 5, 10), j = gfShake(t, t0, 7, 0.22);
  return `<g transform="translate(${f1(j[0])} ${f1(j[1])}) rotate(${o.rot == null ? -9 : o.rot}) scale(${f1(sc * 1000) / 1000})" opacity="${f1(Math.min(1, fall * 1.6) * 100) / 100}">` +
    `<rect x="${f1(-w / 2)}" y="${-h / 2}" width="${f1(w)}" height="${h}" rx="18" fill="#fff" fill-opacity=".9" stroke="${col}" stroke-width="10"/><rect x="${f1(-w / 2 + 13)}" y="${-h / 2 + 13}" width="${f1(w - 26)}" height="${h - 26}" rx="9" fill="none" stroke="${col}" stroke-width="4"/>` + gfT(0, fs * 0.36, text, fs, col) + `</g>` + gfRing(t, t0, 0, 0, w * 0.3, w * 0.75, col, 10, 0.35); }
/* 할 일 목록: items [{text, t0(나오는 시각), done(끝낸 시각), tag}] */
function gfQuest(t, items, o = {}) { const w = o.w || 520, rh = o.rh || 86, h = items.length * rh + 54, fs = o.size || 38; let s = gfPanel(w, h, { head: o.head, headBg: o.headBg });
  items.forEach((it, i) => { const k = it.t0 == null ? 1 : gfIn(t, it.t0, 3.4, 0.45); if (k < 0.02) return; const y = -h / 2 + 62 + i * rh, dn = it.done != null && t >= it.done;
    s += `<g transform="translate(${-w / 2 + 34} ${y}) scale(${f1(k * 1000) / 1000})"><rect x="0" y="-25" width="50" height="50" rx="12" fill="${dn ? GFC.grass2 : '#fff'}" stroke="${INK}" stroke-width="5"/>` +
      (dn ? `<g transform="translate(25 0) scale(${f1(gfIn(t, it.done, 4, 0.4))})"><path d="M-12 1 L-3 10 L13 -9" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>` : '') +
      (it.tag ? `<rect x="68" y="-21" width="${f1(gfTextW(it.tag, 24) + 26)}" height="42" rx="21" fill="${it.tagBg || GFC.sky2}" stroke="${INK}" stroke-width="4"/>` + gfT(81, 9, it.tag, 24, GFC.navy, { anchor: 'start' }) : '') +
      gfT(68 + (it.tag ? gfTextW(it.tag, 24) + 40 : 0), fs * 0.36, it.text, fs, GFC.navy, { anchor: 'start' }) + `</g>`; });
  return s; }
/* 아이템 카드: 햇살 + 그림(svg) + 이름 + 한 줄 */
function gfItem(t, t0, o = {}) { if (t < t0) return ''; const k = gfIn(t, t0, 3, 0.45), w = o.w || 520;
  return `<g transform="scale(${f1(k * 1000) / 1000})">` + gfRays(t, 0, -40, 250, GFC.sun, 12, 0.5) + gfPanel(w, 150, { bg: GFC.cream }) + `<g transform="translate(0 ${f1(-150 + Math.sin(t * 2.4) * 8)})">${o.svg || ''}</g>` +
    gfT(0, o.sub ? -4 : 14, o.name || '', 46, GFC.navy) + (o.sub ? gfT(0, 42, o.sub, 28, '#6B7280', { wt: 800 }) : '') + gfTwinkle(t, -w / 2 + 30, -110, 20, 1, GFC.sun) + gfTwinkle(t, w / 2 - 20, -150, 26, 2.2, '#fff') + `</g>`; }
/* 단계 카드(화면 전체): {n, total, day, title, bg, bg2} */
function gfStage(t, lt, o = {}) { const bg = o.bg || GFC.mint, bg2 = o.bg2 || '#66E6C6'; let h = `<rect x="-600" y="-600" width="3120" height="2280" fill="${bg}"/>`;
  for (let i = -8; i < 16; i++) h += `<rect x="${f1(i * 240 + ((t * 40) % 240))}" y="-900" width="120" height="3000" fill="${bg2}" transform="rotate(24 960 540)"/>`;
  const pk = gfIn(lt, 0.08, 2.8, 0.5); h += `<g transform="translate(960 520) scale(${f1(pk * 1000) / 1000}) rotate(-2)">${gfPanel(1180, 470, { r: 44, sw: 9 })}</g>`;
  if (o.day) h += `<g transform="translate(960 ${f1(330 + Math.sin(t * 2.6) * 3)}) rotate(-3) scale(${f1(gfIn(lt, 0.3, 3.2, 0.42) * 1000) / 1000})">${gfChip(o.day, { size: 54, bg: GFC.sun })}</g>`;
  h += gfBounceText(lt, 0.5, 960, 560, o.title || '', { size: o.size || 104, fill: GFC.navy, stroke: '#fff', sw: 16, wave: 3 });
  const n = o.total || 4; for (let i = 1; i <= n; i++) { const k = gfIn(lt, 0.9 + i * 0.08, 3.6, 0.4), on = i <= (o.n || 1), cur = i === o.n;
    h += `<g transform="translate(${960 + (i - (n + 1) / 2) * 92} 690) scale(${f1(k * (cur ? gfBeat(lt, 1.35, 0.25, 3, 5) : 1) * 1000) / 1000})">${on ? gfStar5(cur ? 34 : 26, GFC.sun, 6) : `<circle r="20" fill="#E9E2D0" stroke="${INK}" stroke-width="6"/>`}</g>`; }
  return h; }

/* ---------- 장면 전환(화면 좌표 1920×1080, 장면 위에 덮는다) ---------- */
const gfIris = (k, cx = 960, cy = 540, col = GFC.navy) => { if (k >= 1) return ''; const R = Math.max(0, k) * 1320; return `<path fill-rule="evenodd" d="M-10 -10H1930V1090H-10Z M${f1(cx - R)} ${f1(cy)} a${f1(R)} ${f1(R)} 0 1 0 ${f1(2 * R)} 0 a${f1(R)} ${f1(R)} 0 1 0 ${f1(-2 * R)} 0Z" fill="${col}"/>` + (R > 2 ? `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}" fill="none" stroke="${GFC.sun}" stroke-width="14"/>` : ''); };
/* 색 띠가 지나간다: k 0(아직) → 1(다 덮음) → 2(다 지나감) */
function gfBands(k, cols = [GFC.sun, GFC.berry, GFC.mint, GFC.sky, GFC.grape]) { if (k <= 0 || k >= 2) return ''; let h = ''; const n = cols.length, bh = 1100 / n;
  for (let i = 0; i < n; i++) { const p = clamp(k * 1.35 - i * 0.07, 0, 2), x = p < 1 ? lerp(-2300, -150, easeOut(p)) : lerp(-150, 2100, easeIn(p - 1)); h += `<rect x="${f1(x)}" y="${f1(i * bh - 10)}" width="2220" height="${f1(bh + 12)}" fill="${cols[i]}" transform="skewX(-14)"/>`; }
  return h; }
/* 줄 id별 전환표로 덮개를 만든다. table: { 줄id: 'iris' | 'bands' | ['iris', cx, cy] }, 줄이 시작되기 전 a초부터 닫고 뒤 b초 동안 연다 */
function gfTransition(t, table, o = {}) { const L = TL.lines, a = o.a || 0.26, b = o.b || 0.3; let h = '';
  for (const l of L) { const tr = table[l.id]; if (!tr) continue; const tc = l.t0 - 0.15, u = t - tc; if (u < -a || u > b) continue; const kind = Array.isArray(tr) ? tr[0] : tr;
    if (kind === 'iris') { const cx = Array.isArray(tr) ? tr[1] : 960, cy = Array.isArray(tr) ? tr[2] : 540, cx2 = Array.isArray(tr) && tr[3] != null ? tr[3] : 960, cy2 = Array.isArray(tr) && tr[4] != null ? tr[4] : 540; h += u < 0 ? gfIris(1 - easeInOut(gfK(-a, -0.02, u)), cx, cy) : gfIris(easeInOut(gfK(0.02, b, u)), cx2, cy2); }
    else h += gfBands(u < 0 ? gfK(-a, 0, u) : 1 + gfK(0, b, u)); }
  return h; }

/* ---------- 대사 상자 자막(화면 좌표) ---------- */
function gfSubtitle(t) {
  const L = TL.lines; let cur = null; for (const l of L) if (t >= l.t0 - 0.05 && t <= l.t1 + 0.25) cur = l; if (!cur || !cur.sub) return '';
  const cs = cuesOf(cur); let cue = cs[0]; for (const x of cs) if (t >= x.t0 - 0.05) cue = x;
  const text = cue.text.replace(/^[“"]|[”"]$/g, ''), fs = 46;
  const lines = gfTextW(text, fs, 800) > 1180 ? (() => { const m = Math.floor(text.length / 2); let sp = text.indexOf(' ', m); if (sp < 0 || sp - m > 8) sp = text.lastIndexOf(' ', m); return sp > 0 ? [text.slice(0, sp), text.slice(sp + 1)] : [text]; })() : [text];
  const who = cue.v && cue.v !== 'N' ? (GF.names[cue.v] || null) : null, w = Math.max(...lines.map(s => gfTextW(s, fs, 800))) + 110, h = lines.length * 62 + 40, cy = 1046 - h / 2, k = gfIn(t, cue.t0 - 0.05, 4.5, 0.6);
  let s = `<g transform="translate(960 ${f1(cy)}) scale(1 ${f1((0.86 + 0.14 * k) * 1000) / 1000})"><rect x="${f1(-w / 2)}" y="${-h / 2 + 8}" width="${f1(w)}" height="${h}" rx="30" fill="${GFC.navy}" opacity=".25"/><rect x="${f1(-w / 2)}" y="${-h / 2}" width="${f1(w)}" height="${h}" rx="30" fill="#FFFDF6" fill-opacity=".97" stroke="${INK}" stroke-width="6"/>`;
  lines.forEach((ln, i) => { s += gfT(0, -h / 2 + 64 + i * 62 - 4, ln, fs, GFC.navy, { wt: 800 }); });
  if (who) { const tw = gfTextW(who[0], 30) + 48; s += `<rect x="${f1(-w / 2 + 30)}" y="${-h / 2 - 28}" width="${f1(tw)}" height="48" rx="24" fill="${who[1]}" stroke="${INK}" stroke-width="6"/>` + gfT(-w / 2 + 30 + tw / 2, -h / 2 + 7, who[0], 30, '#fff'); }
  return s + `</g>`;
}

/* ---------- 무대(단순한 장난감 세트) ---------- */
const gfDefs = () => `<defs>
<linearGradient id="gfDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CCBFF"/><stop offset="1" stop-color="#DFF5FF"/></linearGradient>
<linearGradient id="gfDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB98A"/><stop offset="1" stop-color="#FFF0C9"/></linearGradient>
<linearGradient id="gfDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD9A0"/><stop offset="1" stop-color="#FFF6DD"/></linearGradient>
<linearGradient id="gfNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B2452"/><stop offset="1" stop-color="#3B4A8A"/></linearGradient>
<radialGradient id="gfGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF3B8" stop-opacity=".95"/><stop offset="1" stop-color="#FFF3B8" stop-opacity="0"/></radialGradient>
<pattern id="gfDots" width="64" height="64" patternUnits="userSpaceOnUse"><circle cx="16" cy="16" r="6" fill="#fff" opacity=".35"/><circle cx="48" cy="48" r="6" fill="#fff" opacity=".35"/></pattern>
</defs>`;
const gfFull = f => `<rect x="-600" y="-600" width="3120" height="2280" fill="${f}"/>`;
/* 카메라를 따라 depth만큼만 움직이는 층(1이면 인물과 같이, 0.3이면 먼 산) */
const gfLayer = (cam, depth, inner) => { const [cx, cy, z] = cam, zb = 1 + (z - 1) * depth, bx = 960 + (cx - 960) * depth, by = 560 + (cy - 560) * depth; return `<g transform="translate(960 560) scale(${f1(zb * 1000) / 1000}) translate(${f1(-bx)} ${f1(-by)})">${inner}</g>`; };
const gfCloud = (x, y, s = 1, op = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})" opacity="${op}"><ellipse cx="0" cy="8" rx="120" ry="38" fill="#fff"/><circle cx="-52" cy="-14" r="46" fill="#fff"/><circle cx="24" cy="-34" r="60" fill="#fff"/><circle cx="82" cy="-4" r="38" fill="#fff"/><ellipse cx="0" cy="28" rx="104" ry="14" fill="#CFE6F7" opacity=".7"/></g>`;
function gfClouds(t, y, n = 3, seed = 1, sp = 14, s = 1) { let h = ''; for (let i = 0; i < n; i++) { const x = ((hash(seed + i * 1.7) * 2600 + t * sp * (0.6 + hash(seed + i * 2.9))) % 2600) - 350; h += gfCloud(x, y + hash(seed + i * 5.3) * 170, s * (0.6 + 0.6 * hash(seed + i)), 0.95); } return h; }
/* 둥근 언덕 띠: y(꼭대기 높이), amp(굴곡), wl(물결 길이) */
function gfHill(y, amp, wl, col, off = 0, edge = null) { let d = `M-700 1500 L-700 ${y}`; for (let x = -700; x <= 2700; x += 60) d += ` L${x} ${f1(y - amp * (0.5 + 0.5 * Math.sin((x + off) / wl * Math.PI * 2)) - amp * 0.3 * Math.sin((x + off * 1.7) / (wl * 0.37)))}`; return `<path d="${d} L2700 1500 Z" fill="${col}"${edge ? ` stroke="${edge}" stroke-width="7" stroke-linejoin="round"` : ''}/>`; }
const gfSun = (x, y, r, t) => `<circle cx="${x}" cy="${y}" r="${r * 2.2}" fill="url(#gfGlow)"/>` + `<g transform="translate(${x} ${y}) rotate(${f1(t * 8)})">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<rect x="-7" y="${f1(-r * 1.55)}" width="14" height="${f1(r * 0.3)}" rx="7" fill="${GFC.sun}" stroke="${INK}" stroke-width="5" transform="rotate(${i * 36})"/>`).join('')}</g><circle cx="${x}" cy="${y}" r="${r}" fill="${GFC.sun}" stroke="${INK}" stroke-width="7"/>`;
const gfMoon = (x, y, r, t) => `<circle cx="${x}" cy="${y}" r="${r * 2}" fill="url(#gfGlow)" opacity=".5"/><g transform="translate(${x} ${y}) scale(${r / 25})">${GF_ICON.moon()}</g>` + gfTwinkle(t, x - r * 2.4, y - r * 0.6, 14, 1, '#FFF3B8') + gfTwinkle(t, x + r * 1.9, y + r * 1.1, 10, 2.4, '#fff') + gfTwinkle(t, x + r * 2.8, y - r * 1.4, 12, 4, '#FFF3B8');
function gfTree(x, y, s, t, col = GFC.grass2) { const sw = Math.sin(t * 1.3 + x * 0.01) * 2.2; return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-14" y="-150" width="28" height="150" rx="10" fill="${GFC.wood2}" stroke="${INK}" stroke-width="7"/><g transform="rotate(${f1(sw)} 0 -150)"><circle cx="0" cy="-230" r="100" fill="${col}" stroke="${INK}" stroke-width="8"/><circle cx="-34" cy="-262" r="24" fill="#fff" opacity=".22"/></g></g>`; }
function gfPine(x, y, s, t) { const sw = Math.sin(t * 1.1 + x * 0.02) * 1.6; return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-12 0 Q-22 -120 8 -230 L30 -224 Q6 -116 16 0 Z" fill="${GFC.wood2}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><g transform="rotate(${f1(sw)} 0 -200)">${[[-70, -210, 86, 40], [60, -260, 92, 42], [-10, -320, 96, 46], [80, -180, 60, 30]].map(([cx, cy, rx, ry]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#4FB286" stroke="${INK}" stroke-width="7"/><ellipse cx="${cx - rx * 0.3}" cy="${cy - ry * 0.35}" rx="${rx * 0.3}" ry="${ry * 0.22}" fill="#fff" opacity=".2"/>`).join('')}</g></g>`; }
const gfGrass = (x, y, s = 1, col = GFC.grass2) => `<path d="M${x - 16 * s} ${y} Q${x - 18 * s} ${y - 22 * s} ${x - 8 * s} ${y - 30 * s} Q${x - 6 * s} ${y - 14 * s} ${x} ${y - 38 * s} Q${x + 6 * s} ${y - 14 * s} ${x + 10 * s} ${y - 28 * s} Q${x + 18 * s} ${y - 18 * s} ${x + 16 * s} ${y} Z" fill="${col}" stroke="${INK}" stroke-width="${4 * s}" stroke-linejoin="round"/>`;
/* 방 안 소품: 바닥선 y 기준 */
function gfPlant(x, y, s, t) { let lv = ''; [-58, -30, 0, 30, 58].forEach((a, i) => { const sw = Math.sin(t * 1.5 + i * 1.3) * 3; lv += `<g transform="translate(0 -84) rotate(${f1(a + sw)})"><path d="M0 0 Q-34 -70 0 -150 Q34 -70 0 0 Z" fill="${i % 2 ? '#5FC46E' : '#7BDA7F'}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M0 -14 L0 -120" stroke="${INK}" stroke-width="3" opacity=".3"/></g>`; });
  return `<g transform="translate(${x} ${y}) scale(${s})">${lv}<path d="M-56 -92 L56 -92 L44 0 L-44 0 Z" fill="#FFB38A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-64" y="-108" width="128" height="26" rx="10" fill="#FFC9A8" stroke="${INK}" stroke-width="7"/></g>`; }
function gfWindow(x, y, w, h, t, o = {}) { const sky = o.sky || 'gfDay';
  return `<rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" rx="26" fill="#fff" stroke="${INK}" stroke-width="8"/><svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="url(#${sky})"/>` +
    (o.night ? gfTwinkle(t, w * 0.3, h * 0.3, 12, 1, '#FFF3B8') + gfTwinkle(t, w * 0.7, h * 0.55, 9, 3) : `<g transform="scale(.55)">${gfCloud(((t * 16 + 200) % (w * 2 + 500)) - 250, h * 0.55, 1)}${gfCloud(((t * 10 + 900) % (w * 2 + 500)) - 250, h * 1.15, 0.7)}</g>`) + (o.inner || '') +
    `</svg><path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" stroke="#fff" stroke-width="12"/><path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" stroke="${INK}" stroke-width="3" opacity=".25"/><rect x="${x - 26}" y="${y + h + 12}" width="${w + 52}" height="24" rx="10" fill="#fff" stroke="${INK}" stroke-width="7"/>`; }
function gfDoor(x, y, s = 1, o = {}) { const col = o.col || GFC.wood, w = 300, h = 590;
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="${-w / 2 - 26}" y="${-h - 26}" width="${w + 52}" height="${h + 26}" rx="22" fill="${o.frame || '#FFF3D6'}" stroke="${INK}" stroke-width="8"/><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="12" fill="${col}" stroke="${INK}" stroke-width="8"/>` +
    `<rect x="${-w / 2 + 36}" y="${-h + 40}" width="${w - 72}" height="210" rx="14" fill="none" stroke="${INK}" stroke-width="5" opacity=".35"/><rect x="${-w / 2 + 36}" y="${-h + 290}" width="${w - 72}" height="250" rx="14" fill="none" stroke="${INK}" stroke-width="5" opacity=".35"/><rect x="${-w / 2 + 14}" y="${-h + 14}" width="26" height="${h - 28}" rx="10" fill="#fff" opacity=".16"/>` +
    `<circle cx="${w / 2 - 44}" cy="${-h / 2 + 30}" r="19" fill="${GFC.sun}" stroke="${INK}" stroke-width="7"/><circle cx="${w / 2 - 50}" cy="${-h / 2 + 24}" r="5" fill="#fff" opacity=".8"/></g>`; }
function gfDesk(x, y, s = 1, o = {}) { return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-150" y="-150" width="300" height="26" rx="10" fill="${GFC.wood}" stroke="${INK}" stroke-width="7"/><rect x="-130" y="-124" width="22" height="124" rx="6" fill="${GFC.wood2}" stroke="${INK}" stroke-width="6"/><rect x="108" y="-124" width="22" height="124" rx="6" fill="${GFC.wood2}" stroke="${INK}" stroke-width="6"/>` +
  (o.mon === false ? '' : `<rect x="-14" y="-186" width="28" height="38" fill="#9AA6B8" stroke="${INK}" stroke-width="6"/><rect x="-78" y="-282" width="156" height="104" rx="14" fill="#2B3654" stroke="${INK}" stroke-width="7"/><rect x="-64" y="-268" width="128" height="76" rx="6" fill="${o.screen || '#BFE9FF'}"/><rect x="-52" y="-256" width="50" height="8" rx="4" fill="#fff" opacity=".8"/><rect x="-52" y="-240" width="80" height="8" rx="4" fill="#fff" opacity=".5"/>`) + `</g>`; }
function gfClock(x, y, r, hh, mm) { const ah = (hh % 12 + mm / 60) * 30, am = mm * 6; return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="8"/><line x1="${x}" y1="${y}" x2="${x}" y2="${f1(y - r * 0.5)}" stroke="${INK}" stroke-width="8" stroke-linecap="round" transform="rotate(${ah} ${x} ${y})"/><line x1="${x}" y1="${y}" x2="${x}" y2="${f1(y - r * 0.74)}" stroke="${GFC.coral}" stroke-width="6" stroke-linecap="round" transform="rotate(${am} ${x} ${y})"/><circle cx="${x}" cy="${y}" r="6" fill="${INK}"/>`; }
/* 방: {wall, wall2(아래 띠), floor, fy(바닥선), dots} + 소품은 장면에서 얹는다 */
function gfRoom(o = {}) { const fy = o.fy || 900, wall = o.wall || '#FFE9B8';
  return gfFull(wall) + (o.dots === false ? '' : `<rect x="-600" y="-600" width="3120" height="${fy + 600}" fill="url(#gfDots)"/>`) + `<rect x="-600" y="${fy - 120}" width="3120" height="120" fill="${o.wall2 || '#FFD98F'}"/>` +
    `<rect x="-600" y="${fy}" width="3120" height="800" fill="${o.floor || '#F2C48D'}"/><rect x="-600" y="${fy}" width="3120" height="26" fill="${o.base || '#FFF7E2'}" stroke="${INK}" stroke-width="6"/>` +
    [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${-400 + i * 420}" y="${fy + 70 + (i % 2) * 90}" width="230" height="16" rx="8" fill="#fff" opacity=".22"/>`).join(''); }
