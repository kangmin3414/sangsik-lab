/* 휴머노이드·여가·놀이 편 — 대본 leisure01/대본_v1.md, 화면 leisure01/화면연출_v1.md. 새 이름은 모두 ls 접두사.
   운영자 톤: 게임 같은 UI·판타지 효과 없이, 현실 공간·정적 구도·표정과 손짓. 색은 차가운 파랑 → 회색 실내 → 세피아(1930년대) → (뒤로 갈수록) 따뜻하게.
   기기 화면 없음, 회사 이름·로고 없음, 로봇은 실제 제품 모양이 아닌 우리 디자인. 사건 시각은 모두 절대 시각(lsAt). */
window.GFR = { boil: false, vig: false, flash: false, study: false, sub: t => lsSub(t), over: t => lsOver(t) };
['lsdawn', 'lstitle', 'lstable', 'lsmar'].forEach(k => CAMS[k] = 'fixed');
const lsL = id => TL.lines.find(l => l.id === id);
const lsAt = (id, key, fb = 0.5, n = 0) => { const l = lsL(id); if (!l) return 1e9; if (key) { const k = key.replace(/\s/g, ''), m = (l.words || []).filter(x => x.w.replace(/\s/g, '').includes(k)); if (m[n]) return l.t0 + m[n].t + 0.05; } return l.t0 + fb * (l.t1 - l.t0); };
const lsS = (t, t0, d = 0.8) => easeInOut(gfK(t0, t0 + d, t));
const lsF = (t, t0, t1, d = 0.5) => lsS(t, t0, d) * (1 - lsS(t, t1, d));
const lsOp = (k, inner) => k <= 0.004 ? '' : (k >= 0.996 ? inner : `<g opacity="${f1(k * 1000) / 1000}">${inner}</g>`);
const lsCam = (fx, fy, z, inner) => `<g transform="translate(960 560) scale(${f1(z * 1000) / 1000}) translate(${f1(-fx)} ${f1(-fy)})">${inner}</g>`;
const lsCur = t => { let c = null; for (const l of TL.lines) if (t >= l.t0 - 0.15) c = l; return c; };
/* 입 모양: 그 인물의 대사 줄일 때만 목소리 크기대로(제로 내레이션 줄에는 입이 움직이지 않는다) */
const LS_SAY = { Z: ['d6', 'd12'], D: ['d7', 'd9', 'd10'] };
const lsTalk = (t, who) => { const c = lsCur(t); if (!c || !LS_SAY[who].includes(c.id) || t > c.t1) return 0; const e = TL.env || []; return clamp((e[Math.floor(t * 24)] || 0) * 1.1, 0, 1); };

const LS_DEFS = `<defs>
<linearGradient id="lsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1430"/><stop offset=".7" stop-color="#1D2C55"/><stop offset="1" stop-color="#34497A"/></linearGradient>
<linearGradient id="lsWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A2440"/><stop offset="1" stop-color="#222E4E"/></linearGradient>
<linearGradient id="lsGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D6E8F5"/><stop offset="1" stop-color="#A9C6DE"/></linearGradient>
<radialGradient id="lsLamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE7B0" stop-opacity=".55"/><stop offset="1" stop-color="#FFE7B0" stop-opacity="0"/></radialGradient>
<radialGradient id="lsLed" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#9FE8FF" stop-opacity=".9"/><stop offset="1" stop-color="#9FE8FF" stop-opacity="0"/></radialGradient>
<linearGradient id="lsRoom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#AEB4C0"/><stop offset="1" stop-color="#9AA1AE"/></linearGradient>
<radialGradient id="lsTube" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F4FAFF" stop-opacity=".55"/><stop offset="1" stop-color="#F4FAFF" stop-opacity="0"/></radialGradient>
<filter id="lsSepia" x="0" y="0" width="100%" height="100%"><feColorMatrix type="matrix" values="0.36 0.70 0.17 0 0.02  0.32 0.63 0.15 0 0.01  0.25 0.49 0.12 0 0  0 0 0 1 0"/></filter>
</defs>`;

/* ---------- 인물 ---------- */
// 이 편 전용 표정: 웃지 않는 '듣는 얼굴'(제로), 쓴웃음·불안(도윤). face2.js의 zEyes·zHL2·zWorryBrow를 쓴다.
Object.assign(E, {
  'ls걱정': Object.assign(zEyes(12, 17), { bL: [146, 150, 164, 142, 184, 140], bR: [216, 140, 236, 142, 254, 150] },
    { mouth: 'M188 237 Q200 233 212 237', mouthFill: 'none', fxEye: zHL2(), fxUnder: zBlush(0.2) }),
  'ls쓴웃음': Object.assign(zEyes(11, 13, 194), { bL: [146, 152, 164, 148, 182, 150], bR: [218, 150, 236, 148, 254, 152] },
    { mouth: 'M186 236 Q200 238 214 228', mouthFill: 'none', fxEye: zHL2(194, 0.85) }),
  'ls불안': Object.assign(zEyes(11, 16), zWorryBrow,
    { mouth: 'M184 238 Q192 233 200 238 Q208 243 216 238', mouthFill: 'none', sweat: true, fxEye: zHL2(190, 0.9) }),
  // 지친 눈(반쯤 감김): 새벽 정류장의 제로, 마리엔탈의 남자들
  'ls지침': { eyeL: 'M152 189 L178 189 Q178 202 165 202 Q152 202 152 189 Z', eyeR: 'M222 189 L248 189 Q248 202 235 202 Q222 202 222 189 Z', eyeFill: EY, eyeSW: 0,
    bL: [146, 156, 164, 152, 182, 154], bR: [218, 154, 236, 152, 254, 156], mouth: 'M190 237 Q200 235 210 237', mouthFill: 'none',
    fxEye: `<path d="M150 189 L180 189 M220 189 L250 189" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` },
});
const LS_DY = o => spMan(o, { vest: '#C9D8EA', collar: true, tie: '#4A5A7A', hair: '#2B2B2B' });                 // 도윤(셔츠, 느슨한 넥타이)
const lsZ = (o, m = {}) => gfActor(SPZW, Object.assign({ t: o.t, seed: 3, look: [0, 0] }, o, { ex: fEx(o.ex || 'z기본'), talk: o.talk || 0 }), m);
const lsD = (o, m = {}) => gfActor(LS_DY, Object.assign({ t: o.t, seed: 41, look: [0, 0] }, o, { ex: fEx(o.ex || 'z멍'), talk: o.talk || 0 }), m);
const lsLegs = () => ({ legL: P['서기'].legL, legR: P['서기'].legR, fL: P['서기'].fL, fR: P['서기'].fR, dy: 0 });
P['ls컵'] = Object.assign({ armL: P['서기'].armL, hL: P['서기'].hL, armR: [[252, 285], [292, 338], [252, 336]], hR: [244, 332] }, lsLegs());
P['ls손펴'] = Object.assign({}, P['책상'], { armL: [[148, 285], [118, 330], [136, 330]], hL: [132, 326], armR: [[252, 285], [282, 330], [264, 330]], hR: [268, 326] });
P['ls쓸기'] = Object.assign({ armL: [[148, 285], [96, 300], [52, 300]], hL: [46, 300], armR: P['서기'].armR, hR: P['서기'].hR }, lsLegs());
const lsHandAt = (x, y, s, h) => [x + (h[0] - 200) * s, y + (h[1] - 560) * s];
const lsCup = (x, y, s = 1, t = 0, steam = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">` +
  (steam ? [0, 1].map(i => `<path d="M${-6 + i * 14} -46 q-10 -18 2 -34 t-2 -34" stroke="#E8EEF6" stroke-width="5" fill="none" stroke-linecap="round" opacity="${f1((0.35 + 0.25 * Math.sin(t * 2 + i)) * steam * 100) / 100}" transform="translate(${f1(Math.sin(t * 1.3 + i) * 4)} 0)"/>`).join('') : '') +
  `<path d="M-24 -40 L24 -40 L18 22 L-18 22 Z" fill="#F4F1EA" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-22 -22 L22 -22 L19 2 L-19 2 Z" fill="#B98552"/><rect x="-27" y="-46" width="54" height="9" rx="4" fill="#E6E1D6" stroke="${INK}" stroke-width="4"/></g>`;

/* ---------- 휴머노이드(우리 디자인: 흰 몸, 가로 LED 눈 하나, 회색 관절). u: 작업 주기 0~1 ---------- */
const LS_PER = 2.4;
function lsRobotPose(u) { // 손 위치(로봇 기준): 상자 더미(-150, -150) → 들어 올림 → 컨베이어(150, -230) → 돌아옴
  const A = [-150, -150], B = [-140, -260], C = [150, -230];
  if (u < 0.3) { const k = easeInOut(u / 0.3); return { h: [lerp(C[0], A[0], k), lerp(C[1], A[1], k) + Math.sin(k * Math.PI) * -40], carry: 0 }; }
  if (u < 0.45) { const k = easeInOut((u - 0.3) / 0.15); return { h: [lerp(A[0], B[0], k), lerp(A[1], B[1], k)], carry: 1 }; }
  if (u < 0.8) { const k = easeInOut((u - 0.45) / 0.35); return { h: [lerp(B[0], C[0], k), lerp(B[1], C[1], k) - Math.sin(k * Math.PI) * 30], carry: 1 }; }
  return { h: C, carry: 0 };
}
const lsBox = (x, y, s = 1, c = '#C9A27A') => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-36" y="-30" width="72" height="60" rx="4" fill="${c}" stroke="${INK}" stroke-width="5"/><path d="M-36 -8 H36 M0 -30 V-8" stroke="#8E6E4E" stroke-width="4"/></g>`;
function lsRobot(x, y, s, t, o = {}) {
  const u = ((t + (o.off || 0)) % LS_PER) / LS_PER, P2 = lsRobotPose(u), hx = P2.h[0], hy = P2.h[1];
  const W = '#F2F4F7', G = '#9AA3B2';
  const sh = [[-56, -330], [56, -330]];
  const arm = (sx, sy, ex, ey) => { const mx = (sx + ex) / 2 + (ex > sx ? -20 : 20), my = Math.max(sy, ey) + 40; return `<path d="M${sx} ${sy} Q${f1(mx)} ${f1(my)} ${f1(ex)} ${f1(ey)}" stroke="${INK}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M${sx} ${sy} Q${f1(mx)} ${f1(my)} ${f1(ex)} ${f1(ey)}" stroke="${W}" stroke-width="20" fill="none" stroke-linecap="round"/><circle cx="${f1(mx)}" cy="${f1(my - 14)}" r="9" fill="${G}"/>`; };
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  h += `<path d="M-34 -150 L-40 -6 M34 -150 L40 -6" stroke="${INK}" stroke-width="34" stroke-linecap="round"/><path d="M-34 -150 L-40 -6 M34 -150 L40 -6" stroke="${W}" stroke-width="24" stroke-linecap="round"/><circle cx="-37" cy="-80" r="10" fill="${G}"/><circle cx="37" cy="-80" r="10" fill="${G}"/>`;
  h += `<path d="M-50 0 h-34 v-14 h34 Z M50 0 h34 v-14 h-34 Z" fill="${G}" stroke="${INK}" stroke-width="5"/>`;
  h += `<rect x="-70" y="-360" width="140" height="220" rx="44" fill="${W}" stroke="${INK}" stroke-width="7"/><rect x="-44" y="-320" width="88" height="70" rx="20" fill="#E3E8EF"/>`;
  const L = [hx - 26, hy], R = [hx + 26, hy];
  if (P2.carry) h += lsBox(hx, hy - 8, 0.9);
  h += arm(sh[0][0], sh[0][1], L[0], L[1]) + arm(sh[1][0], sh[1][1], R[0], R[1]) + `<circle cx="${f1(L[0])}" cy="${f1(L[1])}" r="13" fill="${G}" stroke="${INK}" stroke-width="4"/><circle cx="${f1(R[0])}" cy="${f1(R[1])}" r="13" fill="${G}" stroke="${INK}" stroke-width="4"/>`;
  h += `<rect x="-14" y="-388" width="28" height="30" fill="${G}" stroke="${INK}" stroke-width="5"/><rect x="-62" y="-500" width="124" height="118" rx="54" fill="${W}" stroke="${INK}" stroke-width="7"/>`;
  h += `<rect x="-46" y="-456" width="92" height="20" rx="10" fill="#14203A"/><ellipse cx="0" cy="-446" rx="70" ry="22" fill="url(#lsLed)" opacity=".7"/><rect x="-38" y="-451" width="76" height="10" rx="5" fill="#8FE6FF"/>`;
  return h + `</g>`;
}
/* 버스(로고·글자 없음) */
const lsBus = x => `<g transform="translate(${f1(x)} 0)"><rect x="-560" y="340" width="1120" height="580" rx="40" fill="#E9EEF4" stroke="${INK}" stroke-width="9"/><rect x="-560" y="800" width="1120" height="40" fill="#3E7CB1"/>` +
  [...Array(6)].map((_, i) => `<rect x="${-520 + i * 170}" y="420" width="140" height="240" rx="14" fill="#2B3A5E" stroke="${INK}" stroke-width="6"/><path d="M${-505 + i * 170} 435 l40 0 l-50 80" fill="#4A5E8E" opacity=".6"/>`).join('') +
  `<circle cx="-360" cy="930" r="62" fill="#2B2B2B" stroke="${INK}" stroke-width="8"/><circle cx="-360" cy="930" r="24" fill="#9AA3B2"/><circle cx="360" cy="930" r="62" fill="#2B2B2B" stroke="${INK}" stroke-width="8"/><circle cx="360" cy="930" r="24" fill="#9AA3B2"/><rect x="520" y="720" width="34" height="40" rx="8" fill="#FFE7A0" stroke="${INK}" stroke-width="5"/></g>`;
const lsClock = (x, y, r, hh, mm) => { const ah = ((hh % 12) + mm / 60) * 30, am = mm * 6; return `<circle cx="${x}" cy="${y}" r="${r}" fill="#EEF2F6" stroke="${INK}" stroke-width="7"/>` + [...Array(12)].map((_, i) => { const a = i * Math.PI / 6; return `<line x1="${f1(x + Math.sin(a) * (r - 8))}" y1="${f1(y - Math.cos(a) * (r - 8))}" x2="${f1(x + Math.sin(a) * (r - 15))}" y2="${f1(y - Math.cos(a) * (r - 15))}" stroke="#555" stroke-width="3"/>`; }).join('') +
  `<line x1="${x}" y1="${y}" x2="${x}" y2="${f1(y - r * 0.5)}" stroke="#222" stroke-width="6" stroke-linecap="round" transform="rotate(${f1(ah)} ${x} ${y})"/><line x1="${x}" y1="${y}" x2="${x}" y2="${f1(y - r * 0.78)}" stroke="#222" stroke-width="4" stroke-linecap="round" transform="rotate(${f1(am)} ${x} ${y})"/><circle cx="${x}" cy="${y}" r="5" fill="#222"/>`; };

/* ---------- 오프닝: 새벽 물류센터 앞 ---------- */
function lsDawnSet(t) {
  let h = LS_DEFS + gfFull('url(#lsSky)');
  for (let i = 0; i < 14; i++) h += `<circle cx="${f1((i * 263) % 2100 - 80)}" cy="${f1(20 + (i * 71) % 160)}" r="${1.5 + (i % 3)}" fill="#fff" opacity="${f1((0.2 + 0.3 * Math.abs(Math.sin(t * 0.6 + i))) * 100) / 100}"/>`;
  h += `<rect x="-300" y="190" width="2500" height="760" fill="url(#lsWall)"/><rect x="-300" y="190" width="2500" height="26" fill="#121A30"/>`;
  // 큰 유리창(안은 밝고 차갑다)
  const gx = 780, gy = 270, gw = 1180, gh = 560;
  h += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" fill="url(#lsGlass)"/>`;
  h += [...Array(5)].map((_, i) => `<rect x="${gx + 30 + i * 230}" y="${gy + 30}" width="190" height="230" fill="#C1D6E8" stroke="#9FB6CC" stroke-width="5"/>${[0, 1, 2].map(r => `<rect x="${gx + 46 + i * 230 + (r % 2) * 40}" y="${gy + 56 + r * 72}" width="70" height="50" fill="#B7C9DA"/>`).join('')}`).join('');   // 선반
  h += lsClock(gx + gw - 110, gy + 120, 50, 5, 31);
  // 컨베이어 + 흘러가는 상자
  const cy = gy + gh - 120;
  h += `<rect x="${gx + 330}" y="${cy}" width="${gw - 330}" height="30" fill="#6E7A8E" stroke="${INK}" stroke-width="6"/>` + [...Array(10)].map((_, i) => `<circle cx="${gx + 360 + i * 85}" cy="${cy + 15}" r="9" fill="#9AA3B2"/>`).join('');
  const sp = 300 / LS_PER;   // 한 주기에 상자 하나가 300px 흘러감
  for (let k = 0; k < 4; k++) { const age = ((t % LS_PER) / LS_PER + k) * LS_PER, bx = gx + 560 + age * sp; if (bx < gx + gw - 30) h += lsBox(bx, cy - 30, 0.9); }
  // 상자 더미
  [[0, 0], [1, 0], [0.5, 1]].forEach(([c, r]) => { h += lsBox(gx + 150 + c * 76, gy + gh - 38 - r * 62, 0.95, '#BE9670'); });
  h += lsRobot(gx + 400, gy + gh - 10, 0.8, t);
  // 유리 반사·창틀
  h += `<path d="M${gx + 80} ${gy} L${gx + 260} ${gy} L${gx + 40} ${gy + gh} L${gx - 140} ${gy + gh} Z" fill="#fff" opacity=".12"/><path d="M${gx + 620} ${gy} L${gx + 700} ${gy} L${gx + 480} ${gy + gh} L${gx + 400} ${gy + gh} Z" fill="#fff" opacity=".08"/>`;
  h += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" fill="none" stroke="#0E1426" stroke-width="16"/><line x1="${gx + gw / 2}" y1="${gy}" x2="${gx + gw / 2}" y2="${gy + gh}" stroke="#0E1426" stroke-width="10"/>`;
  // 보도·가로등·정류장 기둥
  h += `<rect x="-300" y="930" width="2500" height="400" fill="#141B2E"/><rect x="-300" y="924" width="2500" height="14" fill="#2C3858"/>`;
  h += `<circle cx="660" cy="300" r="360" fill="url(#lsLamp)" opacity=".55"/><rect x="652" y="300" width="16" height="630" fill="#2A3352"/><path d="M660 300 q0 -40 50 -40 h40" stroke="#2A3352" stroke-width="14" fill="none"/><ellipse cx="752" cy="266" rx="34" ry="12" fill="#FFF1C8"/>`;
  h += `<rect x="96" y="420" width="12" height="510" fill="#3A4566"/><rect x="58" y="420" width="88" height="110" rx="10" fill="#4E6A9A" stroke="#1A2440" stroke-width="6"/><rect x="72" y="436" width="60" height="16" rx="4" fill="#8FB0DA" opacity=".6"/>`;
  return h;
}
function lsdawnScene(t, lt, a) {
  const L1 = lsL('o1'), tSleep = lsAt('o2', '잠도', 0.55), tNo = lsAt('o2', '불평', 0.8), tBus = lsAt('o4', '깊은', 0.25), tUse = lsAt('o4', '쓸모', 0.75);
  const ZX = 470, ZY = 930, s = 1.0;
  const look = a.ph === 2 ? [0.1, 0.8] : (a.ph === 3 ? [0.2, 0.5] : [0.75, -0.05]);
  const ex = t >= tSleep ? 'ls지침' : 'z기본';   // 로봇 눈으로 컷한 뒤부터 지친 눈(컷이 바뀌는 순간을 가린다)
  let set = lsDawnSet(t);
  set += lsZ({ x: ZX, y: ZY, s, t, pose: 'ls컵', ex, look }, { sy: 1 + Math.sin(t * 1.3) * 0.006 });
  const hp = lsHandAt(ZX, ZY, s, P['ls컵'].hR); set += lsCup(hp[0] + 4, hp[1] + 6, 0.95, t);
  // o4: 버스가 들어와 제로를 가린다
  if (a.ph === 3) { const k = lsS(t, tBus, Math.max(1.2, tUse - tBus)); if (k > 0) set += lsBus(lerp(-900, ZX + 120, easeOut(k))); }
  // 카메라: o1 천천히 다가감, o2는 '잠도'부터 로봇 눈 ↔ 제로 눈 번갈아(컷), o3 제로에게 살짝 다가감
  if (a.ph === 0) { const k = lsS(t, L1.t0 - 0.2, 12); return lsCam(lerp(1000, 980, k), lerp(600, 590, k), lerp(1.0, 1.08, k), set); }
  if (a.ph === 1) {
    if (t >= tSleep && t < tSleep + 1.1) return lsCam(780 + 400, 270 + 560 - 10 - 0.8 * 446 + 10, 2.6, set);          // 로봇 LED 눈
    if (t >= tSleep + 1.1 && t < tNo + 0.9) return lsCam(ZX + 10, ZY - 400, 2.6, set);                                 // 제로의 지친 눈
    return lsCam(980, 590, 1.08, set);
  }
  if (a.ph === 2) { const k = lsS(t, lsL('o3').t0, 3.5); return lsCam(lerp(980, ZX + 80, k), lerp(590, 640, k), lerp(1.08, 1.5, k), set); }
  return lsCam(ZX + 220, 620, 1.25, set);
}

/* ---------- 제목 카드(담백하게: 검은 바탕 흰 글자) ---------- */
function lstitleScene(t, lt, a) {
  const L = lsL('k0'), k = lsF(t, L.t0 - 0.05, L.t1 - 0.3, 0.45);
  return gfFull('#07090F') + lsOp(k, `<text x="960" y="575" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="92" fill="#F2F2F2" letter-spacing="14">제로의 세계</text><line x1="820" y1="620" x2="1100" y2="620" stroke="#F2F2F2" stroke-width="2" opacity=".5"/>`);
}

/* ---------- 도윤의 식탁(저녁, 회색 실내, 형광등) ---------- */
const LS_TBL = { x: 1000, y: 720, w: 760 };
function lsGuitarCase(x, y, rot = -6, dust = 1) {
  const body = `M0 -440 Q-30 -440 -32 -400 L-36 -260 Q-84 -246 -86 -178 Q-88 -128 -62 -104 Q-112 -78 -114 -6 Q-114 62 0 66 Q114 62 114 -6 Q112 -78 62 -104 Q88 -128 86 -178 Q84 -246 36 -260 L32 -400 Q30 -440 0 -440 Z`;
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="${body}" fill="#3A3036" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` +
    `<path d="${body}" fill="none" stroke="#6A5E66" stroke-width="3" stroke-dasharray="10 7" transform="scale(.9) translate(0 -6)"/>` +
    `<path d="M-48 -150 Q0 -176 48 -150" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-48 -150 Q0 -176 48 -150" stroke="#5A4E56" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    `<path d="M-84 -186 Q0 -230 84 -186 L80 -150 Q0 -196 -80 -150 Z" fill="#B9B4BC" opacity="${f1(0.32 * dust * 100) / 100}"/><path d="M-30 -430 Q0 -446 30 -430 L32 -380 Q0 -396 -32 -380 Z" fill="#B9B4BC" opacity="${f1(0.32 * dust * 100) / 100}"/></g>`;
}
const lsCan = (x, y, open = 0, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-20" y="-62" width="40" height="62" rx="8" fill="#C9D3E0" stroke="${INK}" stroke-width="5"/><rect x="-20" y="-44" width="40" height="18" fill="#5E7FA8"/><ellipse cx="0" cy="-62" rx="18" ry="5" fill="#E6ECF2" stroke="${INK}" stroke-width="3"/>${open ? `<circle cx="6" cy="-62" r="4" fill="#2B2B2B"/>` : ''}</g>`;
function lsRoom(t, o = {}) {
  let h = LS_DEFS + gfFull('url(#lsRoom)') + `<rect x="-600" y="900" width="3120" height="600" fill="#7E8594"/><rect x="-600" y="896" width="3120" height="10" fill="#6A717F"/>`;
  // 현관(왼쪽) + 신발장
  h += `<rect x="-40" y="230" width="250" height="672" fill="#8E95A3" stroke="#6A717F" stroke-width="8"/><circle cx="180" cy="580" r="9" fill="#D9D9D9" stroke="${INK}" stroke-width="3"/><rect x="230" y="760" width="120" height="140" fill="#9CA3B0" stroke="#6A717F" stroke-width="6"/>`;
  h += lsGuitarCase(400, 890, -7, o.dust == null ? 1 : o.dust) + lsBox(318, 868, 0.8, '#C2A07E');
  // 창문(밤, 블라인드) + 냉장고
  h += `<rect x="1450" y="230" width="330" height="300" fill="#16223E" stroke="#5E6574" stroke-width="12"/>` + [...Array(8)].map((_, i) => `<rect x="1450" y="${238 + i * 36}" width="330" height="14" fill="#C6CBD4" opacity=".5"/>`).join('');
  h += `<rect x="1840" y="360" width="200" height="540" rx="14" fill="#E9ECF0" stroke="#6A717F" stroke-width="8"/><rect x="1854" y="560" width="172" height="6" fill="#B6BCC6"/><rect x="2000" y="440" width="10" height="70" rx="4" fill="#9AA1AE"/><rect x="2000" y="600" width="10" height="90" rx="4" fill="#9AA1AE"/>`;
  // 형광등(천장)
  const fl = o.flicker ? (Math.sin(t * 47) > 0.86 ? 0.55 : 1) : 1;
  h += `<ellipse cx="1000" cy="150" rx="560" ry="260" fill="url(#lsTube)" opacity="${f1(fl * 100) / 100}"/><rect x="820" y="96" width="360" height="22" rx="10" fill="#F6FAFF" stroke="#6A717F" stroke-width="5" opacity="${f1((0.6 + 0.4 * fl) * 100) / 100}"/>`;
  return h;
}
const lsTable = () => `<rect x="${LS_TBL.x - LS_TBL.w / 2}" y="${LS_TBL.y}" width="${LS_TBL.w}" height="26" rx="8" fill="#C8B49A" stroke="${INK}" stroke-width="6"/><rect x="${LS_TBL.x - LS_TBL.w / 2 + 14}" y="${LS_TBL.y + 26}" width="${LS_TBL.w - 28}" height="170" fill="#B19C80" stroke="${INK}" stroke-width="6"/><rect x="${LS_TBL.x - LS_TBL.w / 2 + 14}" y="${LS_TBL.y + 26}" width="${LS_TBL.w - 28}" height="16" fill="#000" opacity=".15"/>`;
const lsPaperFlat = (x, y, fold = 0) => `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M-80 -6 L80 -6 L92 6 L-92 6 Z" fill="#FBFBF7" stroke="${INK}" stroke-width="4"/>${fold > 0 ? `<path d="M80 -6 L${f1(80 - 26 * fold)} -6 L92 6 Z" fill="#E2E2DA" stroke="${INK}" stroke-width="3"/>` : ''}</g>`;
function lstableScene(t, lt, a) {
  const ZX = 760, DX = 1240, Y = 905, s = 0.95;
  const tTal = lsAt('d10', '가장', 0.35), tWhat = lsAt('d10', '뭘', 0.85), tPush = lsAt('d12', '마음', 0.4);
  let set = lsRoom(t, { flicker: a.ph === 6, dust: a.ph >= 1 ? 0.5 : 1 });
  // 제로: d5·d6은 현관 쪽에 서 있고, d7부터 식탁에 앉아 있다
  if (a.ph <= 1) {
    const pose = a.ph === 1 ? 'ls쓸기' : '서기';
    set += lsZ({ x: 560, y: 900, s: 1.0, t, pose, ex: 'z기본', look: [-0.5, a.ph === 1 ? 0.5 : 0], talk: lsTalk(t, 'Z') });
    if (a.ph === 1) for (let i = 0; i < 6; i++) { const u = ((t * 0.7 + i / 6) % 1); set += `<circle cx="${f1(420 + i * 9 + u * 30)}" cy="${f1(470 - u * 90)}" r="3" fill="#E6E6EC" opacity="${f1((1 - u) * 0.8 * 100) / 100}"/>`; }
  }
  // 도윤(앉음): 고개 숙임 → d10에서 고개 듦, 손을 폈다가 떨어뜨림
  const dPose = a.ph === 5 && t > tTal && t < tWhat ? 'ls손펴' : '책상';
  const dLook = a.ph === 5 ? (t > tTal ? [-0.5, 0] : [-0.2, 0.4]) : (a.ph === 8 ? [-0.1, 0.6] : [-0.2, 0.7]);
  const drop = a.ph === 5 ? Math.max(0, 1 - gfK(tWhat, tWhat + 0.35, t)) * (t > tWhat ? 1 : 0) : 0;
  set += lsD({ x: DX, y: Y, s, t, pose: dPose, ex: a.ph >= 5 ? 'z울먹' : (a.ph === 4 ? 'ls불안' : 'ls쓴웃음'), look: dLook, talk: lsTalk(t, 'D') }, { sy: 1 + Math.sin(t * 1.1) * 0.006, dy: -8 * drop });
  if (a.ph >= 2) set += lsZ({ x: ZX, y: Y, s, t, pose: '책상', ex: a.ph === 2 ? 'z기본' : 'ls걱정', look: [0.6, a.ph === 7 ? 0 : 0.25], talk: lsTalk(t, 'Z') });
  set += lsTable();
  // 식탁 위: 안내문, 캔 둘(하나는 따지 않음) — d12에 제로가 따지 않은 캔을 도윤 쪽으로 민다, d16엔 도윤이 쥐고 있다
  const fold = a.ph === 4 ? 0.5 + 0.5 * Math.sin(t * 3) : 0;
  set += lsPaperFlat(LS_TBL.x + 40, LS_TBL.y, fold);
  const push = a.ph === 7 ? lsS(t, tPush, 0.9) : (a.ph === 8 ? 1 : 0);
  set += lsCan(LS_TBL.x + 260, LS_TBL.y, 1) + (a.ph === 8 ? lsCan(DX - 20, Y - 190, 0, 0.95) : lsCan(lerp(LS_TBL.x - 220, LS_TBL.x + 150, push), LS_TBL.y, 0));
  // 손(책상 위): 앉은 인물의 손을 다시 그림
  if (a.ph >= 2) { const pz = P['책상']; [pz.hL, pz.hR].forEach(hh => { const p = lsHandAt(ZX, Y, s, hh); set += hand(p[0] + (a.ph === 7 && hh === pz.hR ? lerp(0, 330, push) : 0), p[1], s); }); }
  { const pz = P[dPose]; [pz.hL, pz.hR].forEach(hh => { const p = lsHandAt(DX, Y - 8 * drop, s, hh); set += hand(p[0], p[1], s); }); }
  // 카메라
  if (a.ph === 0) { const k = lsS(t, lsL('d5').t0 + 0.6, 5.5); return lsCam(lerp(420, 980, k), lerp(640, 600, k), lerp(1.9, 1.0, k), set); }
  if (a.ph === 1) return lsCam(430, 560, 2.1, set);
  if (a.ph === 2) return lsCam(DX - 60, 560, 1.6, set);
  if (a.ph === 3) return lsPaperInsert(t);
  if (a.ph === 4) return lsCam(1000, 600, 1.25, set);
  if (a.ph === 5) { const k = lsS(t, lsL('d10').t0, 2.5); return lsCam(DX - 40, lerp(600, 570, k), lerp(1.45, 1.75, k), set); }
  if (a.ph === 7 || a.ph === 8) return lsCam(1000, 610, 1.3, set);
  return lsCam(1000, 580, 1.0, set);
}
/* d8: 위에서 내려다본 식탁 — 안내문 제목이 읽힌다(회사 로고 자리는 빈칸) */
function lsPaperInsert(t) {
  const k = lsS(t, lsL('d8').t0 - 0.1, 0.8);
  let h = LS_DEFS + gfFull('#B9A486');
  for (let i = 0; i < 12; i++) h += `<path d="M-200 ${80 + i * 95} Q900 ${70 + i * 95} 2200 ${86 + i * 95}" stroke="#A8936F" stroke-width="4" fill="none" opacity=".5"/>`;
  h += `<g transform="translate(940 560) rotate(-3) scale(${f1((0.96 + 0.04 * k) * 1000) / 1000})"><rect x="-420" y="-540" width="840" height="1100" fill="#000" opacity=".18" transform="translate(16 18)"/><rect x="-420" y="-540" width="840" height="1100" fill="#FCFCF8" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="-370" y="-490" width="150" height="56" fill="none" stroke="#C9C9C9" stroke-width="3" stroke-dasharray="10 8"/>` +
    `<text x="0" y="-330" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="64" fill="#1E2230">물류 자동화 설비 도입 안내</text><line x1="-330" y1="-290" x2="330" y2="-290" stroke="#1E2230" stroke-width="3"/>` +
    [...Array(9)].map((_, i) => `<rect x="-330" y="${-230 + i * 62}" width="${660 - (i % 3) * 90}" height="16" rx="8" fill="#C7CAD2"/>`).join('') + `</g>`;
  h += `<g transform="translate(1640 360)"><circle r="64" fill="#C9D3E0" stroke="${INK}" stroke-width="6"/><circle r="40" fill="#E6ECF2" stroke="${INK}" stroke-width="3"/><circle cx="12" r="7" fill="#2B2B2B"/></g><g transform="translate(1700 760)"><circle r="64" fill="#C9D3E0" stroke="${INK}" stroke-width="6"/><circle r="40" fill="#E6ECF2" stroke="${INK}" stroke-width="3"/><rect x="2" y="-6" width="20" height="12" rx="4" fill="#9AA3B2"/></g>`;
  return h;
}

/* ---------- 마리엔탈(1930년대 초, 세피아) ---------- */
const lsCapFx = () => `<path d="M102 98 Q200 70 302 98 L298 78 Q252 30 200 30 Q148 30 106 78 Z" fill="#4E4A44" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M86 100 Q200 84 318 100" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
const LS_MAN = (i) => o => spMan(Object.assign({ headFx: lsCapFx }, o), { vest: ['#5A5650', '#6A645C', '#4E4A46'][i % 3], suit: '#8A847A', collar: true, hair: '#3A3632' });
function lsFactory(t) {
  let h = gfFull('#C9C2B4') + `<rect x="-600" y="860" width="3120" height="700" fill="#9E9686"/>`;
  h += `<rect x="1180" y="80" width="110" height="520" fill="#7A5A48" stroke="${INK}" stroke-width="7"/>` + [...Array(12)].map((_, i) => `<line x1="1180" y1="${110 + i * 42}" x2="1290" y2="${110 + i * 42}" stroke="#5E4436" stroke-width="3"/>`).join('');
  h += `<rect x="520" y="420" width="1240" height="440" fill="#8A6A56" stroke="${INK}" stroke-width="8"/><path d="M500 430 L1140 300 L1780 430 Z" fill="#6E5446" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  h += [...Array(8)].map((_, i) => `<rect x="${580 + i * 145}" y="490" width="90" height="120" fill="#3E3A36" stroke="${INK}" stroke-width="5"/><line x1="${580 + i * 145}" y1="550" x2="${670 + i * 145}" y2="550" stroke="#6A645C" stroke-width="4"/>`).join('');
  h += `<rect x="1000" y="680" width="280" height="180" fill="#5A4A40" stroke="${INK}" stroke-width="7"/><path d="M1000 760 L1280 700 M1000 700 L1280 760" stroke="#3A3632" stroke-width="8"/>`;   // 닫힌 문(빗장)
  h += `<path d="M260 860 L260 640 M260 700 L200 640 M260 680 L320 610 M260 740 L330 700" stroke="#4E4A44" stroke-width="9" fill="none" stroke-linecap="round"/>`;   // 앙상한 나무
  return h;
}
function lsStreet(t) {
  let h = gfFull('#CFC8BA') + `<rect x="-600" y="860" width="3120" height="700" fill="#A49C8C"/><rect x="-600" y="856" width="3120" height="10" fill="#8A8274"/>`;
  [[-100, 300], [380, 360], [900, 320], [1420, 380], [1900, 300]].forEach(([x, w], i) => { h += `<rect x="${x}" y="${460 + (i % 2) * 40}" width="${w}" height="${400 - (i % 2) * 40}" fill="${['#B7AE9C', '#A9A08E', '#BDB4A2'][i % 3]}" stroke="${INK}" stroke-width="6"/><path d="M${x - 20} ${460 + (i % 2) * 40} L${x + w / 2} ${360 + (i % 2) * 40} L${x + w + 20} ${460 + (i % 2) * 40} Z" fill="#8E7E6E" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="${x + w / 2 - 40}" y="${600 + (i % 2) * 20}" width="80" height="90" fill="#4E4A44"/>`; });
  return h;
}
function lsLibrary(t) {
  let h = gfFull('#BFB6A4') + `<rect x="-600" y="880" width="3120" height="700" fill="#9A907E"/>`;
  [140, 560, 1360, 1780].forEach((x, i) => { h += `<rect x="${x - 170}" y="220" width="340" height="660" fill="#6E5A48" stroke="${INK}" stroke-width="7"/>`; for (let r = 0; r < 5; r++) { h += `<rect x="${x - 150}" y="${250 + r * 125}" width="300" height="8" fill="#4E3E30"/>`; for (let b = 0; b < 10; b++) h += `<rect x="${x - 146 + b * 29}" y="${262 + r * 125}" width="24" height="${96 - ((b + r + i) % 3) * 10}" fill="${['#8A5A3A', '#5E6A52', '#7A6A4E', '#4E5A6E'][(b + r) % 4]}" stroke="${INK}" stroke-width="2"/>`; } });
  h += `<rect x="820" y="700" width="380" height="40" fill="#8A6E52" stroke="${INK}" stroke-width="6"/><rect x="840" y="740" width="340" height="140" fill="#7A5E44" stroke="${INK}" stroke-width="6"/><rect x="860" y="660" width="60" height="40" fill="#E8E0CE" stroke="${INK}" stroke-width="4"/>`;   // 빈 대출대
  h += `<path d="M1010 640 L1010 560 M980 560 h60 l-12 -40 h-36 Z" stroke="${INK}" stroke-width="5" fill="#D9C9A4"/>`;   // 스탠드
  return h;
}
function lsNotebook(t) {
  const W = [['월급', null], ['하루의 틀', '틀'], ['만날 사람', '만날'], ['함께하는 목적', '함께'], ['내 자리', '자리'], ['할 일', '할']];
  let h = gfFull('#8E7A60') + `<g transform="translate(960 560) rotate(-2)"><rect x="-520" y="-470" width="1040" height="920" rx="10" fill="#F1E8D2" stroke="${INK}" stroke-width="6"/>` + [...Array(13)].map((_, i) => `<line x1="-470" y1="${-380 + i * 66}" x2="470" y2="${-380 + i * 66}" stroke="#C9B994" stroke-width="2"/>`).join('') + `<line x1="-400" y1="-470" x2="-400" y2="450" stroke="#D9A38A" stroke-width="3"/>`;
  W.forEach(([w, key], i) => { const k = key ? lsS(t, lsAt('m15', key, 0.3 + i * 0.12), 0.6) : 1; if (k <= 0) return;
    h += `<g opacity="${f1(k * 100) / 100}"><text x="-360" y="${-300 + i * 132}" font-family="${FONT}" font-weight="700" font-size="66" fill="#2E2A24">${i === 0 ? '' : '· '}${w}</text>${i === 0 ? `<path d="M-366 ${-280} h${f1(gfTextW(w, 66, 700) + 10)}" stroke="#8E3B32" stroke-width="5" stroke-linecap="round"/>` : ''}</g>`; });
  return h + `</g>`;
}
function lsmarScene(t, lt, a) {
  let inner = '';
  if (a.ph === 0) {
    const tVisit = lsAt('m13', '찾아', 0.85), k = lsS(t, lsL('m13').t0, 9);
    inner = lsCam(lerp(1100, 1000, k), lerp(540, 560, k), lerp(1.15, 1.0, k), lsFactory(t) + lsOp(lsS(t, tVisit - 0.2, 0.8), `<g transform="translate(1660 900)">${spMan({ x: 0, y: 0, s: 1.05, t, pose: '서기', ex: fEx('z기본'), look: [0, 0], seed: 61 }, { vest: '#2E2A26', hair: '#2E2A26', suit: '#2E2A26' }).replace(/fill="#fff"/g, 'fill="#3A3632"')}<rect x="-70" y="-300" width="60" height="80" rx="6" fill="#E8E0CE" stroke="${INK}" stroke-width="4" transform="rotate(-8)"/></g>`));
    inner += `<text x="70" y="96" font-family="${FONT}" font-weight="700" font-size="40" fill="#FFFFFF" opacity="${f1(lsF(t, lsL('m13').t0, lsL('m13').t1, 0.6) * 0.9 * 100) / 100}">마리엔탈 · 1930년대 초</text>`;
  } else if (a.ph === 1) {
    const tLib = lsAt('m14', '도서관', 0.7);
    if (t < tLib - 0.1) {
      let st = lsStreet(t); const L = lsL('m14'), u = t - L.t0;
      [[0, 300], [1, 620], [2, 980]].forEach(([i, x0]) => { const stop = Math.sin(u * 0.9 + i * 1.7) > 0.35; const x = x0 + (stop ? 0 : 0) + u * 22 - (stop ? (Math.sin(u * 0.9 + i * 1.7) - 0.35) * 12 : 0);
        const w = gfWalk(x * 2.4, stop ? 0.08 : 0.35, 0.03); st += gfActor(LS_MAN(i), { x, y: 900, s: 0.82, t, pose: w.pose, ex: fEx('ls지침'), look: [0.4, 0.5], seed: 70 + i }, { sy: w.sy, dy: stop ? 0 : w.dy }); });
      // 바쁜 여자는 앞줄(조금 아래·조금 크게)로 지나간다 — 남자들과 같은 줄에서 몸이 겹치지 않게
      const wx = 1900 - u * 120, ww = gfWalk(wx * 2.4, 0.8, 0.03);
      st += gfActor(o => zGirl(Object.assign({ hairStyle: 'bob', hairArgs: ['#3A3632'], top: '#6A645C', dress: '#4E4A44' }, o)), { x: wx, y: 950, s: 0.88, t, pose: ww.pose, ex: fEx('z기본'), look: [-0.6, 0], flip: true, seed: 77 }, { sy: ww.sy, dy: ww.dy });
      st += `<g transform="translate(${f1(wx - 77)} 796)"><path d="M-30 0 Q0 -40 30 0" stroke="${INK}" stroke-width="5" fill="none"/><rect x="-34" y="0" width="68" height="44" rx="8" fill="#B98552" stroke="${INK}" stroke-width="5"/></g>`;
      inner = st;
    } else inner = lsCam(1010, 600, 1.15, lsLibrary(t));
  } else inner = lsNotebook(t);
  // 세피아 + 필름 낟알
  let grain = ''; for (let i = 0; i < 40; i++) grain += `<circle cx="${f1(hash(Math.floor(t * 12) * 7 + i) * 2200 - 140)}" cy="${f1(hash(Math.floor(t * 12) * 13 + i * 3) * 1300 - 60)}" r="${f1(1 + hash(i + t) * 2)}" fill="#2E2A24" opacity=".25"/>`;
  return LS_DEFS + `<g filter="url(#lsSepia)">${inner}</g>` + grain + `<rect x="-600" y="-600" width="3120" height="2280" fill="#3A2E1E" opacity=".08"/>`;
}

/* ---------- 화면 좌표: 자막 · 검은 디졸브 ---------- */
function lsSub(t) {
  const L = TL.lines; let cur = null; for (const l of L) if (t >= l.t0 - 0.05 && t <= l.t1 + 0.25) cur = l; if (!cur || !cur.sub) return '';
  const text = cur.sub, fs = 42;
  const split = s => { if (gfTextW(s, fs, 700) <= 1320) return [s]; const m = Math.floor(s.length / 2); let sp = s.indexOf(' ', m); const sp2 = s.lastIndexOf(' ', m); if (sp < 0 || (sp2 > 0 && m - sp2 < sp - m)) sp = sp2; return sp > 0 ? [s.slice(0, sp), s.slice(sp + 1)] : [s]; };
  const lines = split(text), w = Math.max(...lines.map(s => gfTextW(s, fs, 700))) + 90, h = lines.length * 58 + 32, cy = 1030 - h / 2, k = lsS(t, cur.t0 - 0.05, 0.25);
  let s = `<g opacity="${f1(k * 100) / 100}"><rect x="${f1(960 - w / 2)}" y="${f1(cy - h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="14" fill="#0B0F1E" fill-opacity=".6"/>`;
  lines.forEach((ln, i) => { s += `<text x="960" y="${f1(cy - h / 2 + 56 + i * 58 - 6)}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${fs}" fill="#FFFFFF">${esc(ln)}</text>`; });
  return s + `</g>`;
}
function lsOver(t) {
  let h = '';
  const o1 = lsL('o1'); if (o1 && t < o1.t0 + 0.4) h += `<rect width="1920" height="1080" fill="#000" opacity="${f1((1 - lsS(t, 0, o1.t0 + 0.3)) * 100) / 100}"/>`;
  const o4 = lsL('o4'); if (o4) { const k = lsS(t, o4.t1 - 0.2, 0.6); if (k > 0 && t < o4.t1 + 1.2) h += `<rect width="1920" height="1080" fill="#000" opacity="${f1(k * 100) / 100}"/>`; }
  ['d5', 'm13', 'd16'].forEach(id => { const L = lsL(id); if (!L) return; const c = L.t0 - 0.15, d = Math.abs(t - c); if (d < 0.4) h += `<rect width="1920" height="1080" fill="#05070F" opacity="${f1((1 - d / 0.4) * 100) / 100}"/>`; });
  const last = TL.lines[TL.lines.length - 1]; if (last) { const k = lsS(t, last.t1 + 0.6, 1.2); if (k > 0) h += `<rect width="1920" height="1080" fill="#000" opacity="${f1(k * 100) / 100}"/>`; }
  return h;
}
