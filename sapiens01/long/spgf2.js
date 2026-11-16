/* 사피엔스 편 — 출근 세 컷(운영자 2026-11-16 "신호등·만원 지하철·엘리베이터는 각 상황에 맞게, 정말 힘들어 보이게").
   s1a 횡단보도(정면): 뛰어오다 코앞에서 빨간불 → 미끄러지며 멈춤 → 버스가 휙(바람) → 무릎 짚고 헉헉.
   s1b 만원 지하철(차 안): 사람들이 밀려들어 찌부 → '끼이익' 쏠림에 발이 뜸 → 숨 게이지 바닥.
   s1c 엘리베이터(로비): 문이 코앞에서 닫혀 쿵 → 폰이 부르르 → 뾰족 말풍선 비 → "이거 다시 해와"가 덮쳐 주저앉음.
   s2  같은 로비: 문 앞에 털썩, 영혼이 빠져나감. 폰 화면은 보여 주지 않는다(뒷면 + 얼굴에 화면 빛). spgf.js 다음에 읽는다. */
['spcross', 'spsubway', 'spelev'].forEach(k => CAMS[k] = 'fixed');
window.GFR.over = t => gfTransition(t, { s1b: 'bands', s1c: 'bands', k0: ['iris', 960, 520, 960, 540], r1: ['iris', 960, 540] });

/* 힘든 자세(엔진 자세 형식: 어깨 148/252,285 · 엉덩이 180/220,412 · 발 534) */
const SP_P = {
  pant: { armL: [[148, 285], [134, 364], [168, 448]], hL: [170, 456], armR: [[252, 285], [266, 364], [232, 448]], hR: [230, 456],
    legL: [[180, 412], [152, 468], [168, 522]], fL: [156, 534, 0], legR: [[220, 412], [248, 468], [232, 522]], fR: [244, 534, 0], dy: 10 },
  reach: { armL: [[148, 285], [110, 318], [80, 350]], hL: [74, 356], armR: [[252, 285], [322, 278], [392, 270]], hR: [402, 268],
    legL: [[180, 412], [140, 458], [108, 508]], fL: [96, 520, 18], legR: [[220, 412], [252, 464], [266, 518]], fR: [276, 530, -6], dy: 0 },
  strap: { armL: [[148, 285], [158, 342], [178, 384]], hL: [182, 392], armR: [[252, 285], [286, 214], [270, 138]], hR: [268, 128],
    legL: [[180, 412], [172, 470], [160, 520]], fL: [150, 532, 12], legR: [[220, 412], [230, 470], [244, 520]], fR: [254, 532, -12], dy: 0 },
  brake: { armL: [[148, 285], [100, 232], [86, 170]], hL: [82, 160], armR: [[252, 285], [306, 246], [336, 196]], hR: [340, 186], legL: [[180, 412], [204, 466], [240, 510]], fL: [252, 520, -22], legR: [[220, 412], [254, 460], [296, 496]], fR: [308, 506, -26], dy: 6 },
  sit: { armL: [[148, 285], [118, 352], [104, 414]], hL: [100, 422], armR: [[252, 285], [282, 352], [296, 414]], hR: [300, 422],
    legL: [[180, 412], [120, 428], [62, 436]], fL: [50, 442, 0], legR: [[220, 412], [280, 428], [338, 436]], fR: [350, 442, 0], dy: 96 }
};
/* 승객·사람들 옷(운영자 2026-11-16 "정장이나 다른 옷들"): 정장(회색·검정·남색), 블라우스+치마, 후드티, 카디건, 정장 여성, 점퍼+모자, 숏컷, 단발 */
const spHood = c => t => `<path d="M64 210 Q52 52 200 40 Q348 52 336 210 Q336 300 280 316 L120 316 Q64 300 64 210 Z" fill="${c}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
const spCap = c => `<path d="M88 120 Q90 40 200 36 Q310 40 312 120 Z" fill="${c}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M290 112 Q350 112 372 128 Q340 136 296 130 Z" fill="${c}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
const spMan = (o, d) => HALO(char(Object.assign({ goggles: 'none', patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)' }, d, o)));
const SP_PASS = [
  o => spMan(o, { vest: '#4A4F5E', suit: true, collar: true, tie: '#6FA8DC', hair: '#2B2B2B' }),
  o => zGirl(Object.assign({ hairStyle: 'long', hairArgs: ['#3A2E2A', '#9ED8FF'], top: '#F6E3EA', dress: '#5E6A8C' }, o)),
  o => spMan(o, { vest: '#8FB8E8', hairBehind: spHood('#8FB8E8'), hair: '#5A3A2E' }),
  o => spMan(o, { vest: '#C9A27A', suit: '#FFF6E6', hair: '#6E6A78' }),
  o => zGirl(Object.assign({ hairStyle: 'pony', hairArgs: ['#2E2A33', '#FF8FB1'], top: '#2F3550', suit: true, collar: true }, o)),
  o => spMan(o, { vest: '#2E3440', suit: true, collar: true, tie: '#C9A04A' }),
  o => spMan(o, { vest: '#7FB069', hairFront: spCap('#E0574F') }),
  o => zGirl(Object.assign({ hairStyle: 'short', top: '#FFD9A8' }, o)),
  o => spMan(o, { vest: '#5B6B8C', suit: true, collar: true, tie: '#E8C66A', hair: '#7A4A32' }),
  o => zGirl(Object.assign({ hairStyle: 'bob', top: '#B8E6A8', dress: '#E8B4C8' }, o)),
];
const spPass = i => SP_PASS[((i % SP_PASS.length) + SP_PASS.length) % SP_PASS.length];
const SP_DIMDEF = `<defs><filter id="spDim" x="-20%" y="-20%" width="140%" height="140%"><feComponentTransfer><feFuncR type="linear" slope=".8"/><feFuncG type="linear" slope=".8"/><feFuncB type="linear" slope=".84"/></feComponentTransfer></filter><radialGradient id="spSpot" cx=".5" cy=".45" r=".5"><stop offset="0" stop-color="#FFF6D6" stop-opacity=".95"/><stop offset="1" stop-color="#FFF6D6" stop-opacity="0"/></radialGradient></defs>`;
const spZero = (o, m) => gfActor(SPZW, Object.assign({ t: o.t, seed: 3, look: [0, 0], sweat: true }, o, { ex: fEx(o.ex || 'z기본') }), m || {});
/* 숨 퍼프(입에서 나와 옆으로 흩어짐), 떨어지는 땀, 속도선 */
function spBreath(lt, x, y, s, dir = 1, per = 0.36) {
  let h = ''; for (let k = 0; k < 4; k++) { const ph = ((lt / per) + k / 4) % 1, op = Math.sin(ph * Math.PI) * 0.85;
    h += `<circle cx="${f1(x + dir * (16 + 70 * ph) * s)}" cy="${f1(y - 10 * ph * s)}" r="${f1((10 + 16 * ph) * s)}" fill="#fff" stroke="${INK}" stroke-width="${f1(4 * s)}" opacity="${f1(op * 100) / 100}"/>`; }
  return h;
}
function spDrops(lt, x, y, s, n = 3, seed = 1) {
  let h = ''; for (let k = 0; k < n; k++) { const per = 0.55 + hash(seed + k) * 0.3, ph = ((lt + hash(seed + k * 3) * per) / per) % 1, side = k % 2 ? 1 : -1;
    const dx = side * (100 + 30 * hash(seed + k * 5)) * s + side * 30 * ph * s, dy = (-40 + 180 * ph * ph) * s;
    h += `<path d="M0 -16 Q-11 2 -8 8 Q-4 14 0 14 Q4 14 8 8 Q11 2 0 -16 Z" fill="#9ED8FF" stroke="${INK}" stroke-width="4" transform="translate(${f1(x + dx)} ${f1(y + dy)}) scale(${f1(s * 1.3)})" opacity="${f1((1 - ph) * 100) / 100}"/>`; }
  return h;
}
const spSpeed = (lt, x, y, dir = -1, n = 5) => Array.from({ length: n }, (_, k) => { const ph = (lt * 3 + k * 0.23) % 1, yy = y - 160 + k * 70, x0 = x + dir * (90 + 260 * ph);
  return `<line x1="${f1(x0)}" y1="${f1(yy)}" x2="${f1(x0 + dir * 120)}" y2="${f1(yy)}" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="${f1((1 - ph) * 80) / 100}"/>`; }).join('');

/* ===================== s1a 횡단보도 ===================== */
const SPX = { FY: 800, PX: 1250, RY: 874, S: 0.95 };
function spPedLight(lt, tR) {
  const red = lt >= tR, on = red || lt < tR - 1.4 || Math.floor(lt * 7) % 2 === 0, num = red ? '' : String(Math.max(1, Math.ceil((tR - lt) / 0.55)));
  const fig = (walk, col) => walk
    ? `<g fill="${col}"><circle cx="4" cy="-30" r="9"/><path d="M-3 -20 L11 -19 L13 2 L22 20 L13 23 L5 6 L-3 23 L-12 19 L-4 0 Z"/><path d="M-3 -15 L-16 -1 M10 -15 L22 -5" stroke="${col}" stroke-width="7" stroke-linecap="round"/></g>`
    : `<g fill="${col}"><circle cx="0" cy="-30" r="9"/><rect x="-11" y="-20" width="22" height="26" rx="5"/><rect x="-10" y="4" width="8" height="22" rx="3"/><rect x="2" y="4" width="8" height="22" rx="3"/><rect x="-18" y="-18" width="7" height="22" rx="3"/><rect x="11" y="-18" width="7" height="22" rx="3"/></g>`;
  let s = `<rect x="-11" y="-470" width="22" height="470" rx="8" fill="#6E7491" stroke="${INK}" stroke-width="6"/>`;
  if (red) s += `<circle cx="0" cy="-402" r="${f1(92 + 6 * Math.sin(lt * 9))}" fill="#FF5A5A" opacity=".22"/>`;
  s += `<rect x="-66" y="-470" width="132" height="250" rx="20" fill="#2F3654" stroke="${INK}" stroke-width="7"/>`;
  s += `<rect x="-50" y="-455" width="100" height="105" rx="12" fill="#151A2C"/><g transform="translate(0 -397) scale(1.45)">${fig(false, red ? '#FF5A5A' : '#4A2228')}</g>`;
  s += `<rect x="-50" y="-340" width="100" height="105" rx="12" fill="#151A2C"/><g transform="translate(0 -282) scale(1.45)">${fig(true, !red && on ? '#5BE38A' : '#1E3A2C')}</g>`;
  s += `<rect x="72" y="-340" width="66" height="105" rx="10" fill="#151A2C" stroke="${INK}" stroke-width="5"/>` + (num ? gfT(105, -268, num, 58, '#5BE38A') : gfT(105, -268, '–', 46, '#3A4256'));
  return s;
}
function spBus(t) {
  let s = `<rect x="-470" y="-345" width="940" height="305" rx="46" fill="#6FC3A4" stroke="${INK}" stroke-width="8"/><rect x="-466" y="-122" width="932" height="32" fill="#4E9E82"/>`;
  for (let i = 0; i < 6; i++) { const x = -440 + i * 128; s += `<rect x="${x}" y="-305" width="106" height="112" rx="12" fill="#BFE9FF" stroke="${INK}" stroke-width="5"/>`;
    for (let j = 0; j < 2; j++) s += `<circle cx="${x + 32 + j * 44}" cy="${-222 + (j % 2) * 8}" r="22" fill="#C9CED8" stroke="${INK}" stroke-width="4"/>`; }
  s += `<path d="M332 -305 L440 -305 Q464 -305 464 -276 L464 -175 L332 -175 Z" fill="#BFE9FF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="342" y="-338" width="112" height="26" rx="6" fill="#FFC85A" stroke="${INK}" stroke-width="4"/>`;
  s += `<circle cx="452" cy="-80" r="13" fill="#FFF6C8" stroke="${INK}" stroke-width="4"/>`;
  [-290, 300].forEach(x => { s += `<circle cx="${x}" cy="-40" r="50" fill="#3B4570" stroke="${INK}" stroke-width="7"/><circle cx="${x}" cy="-40" r="18" fill="#C9CED8"/>`; });
  return s;
}
const spCar = col => `<path d="M-200 -40 L-200 -110 Q-196 -130 -170 -134 L-110 -140 L-70 -200 Q-60 -212 -40 -212 L80 -212 Q100 -212 112 -200 L150 -140 L190 -132 Q210 -126 210 -100 L210 -40 Z" fill="${col}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-90 -140 L-58 -194 L10 -194 L10 -140 Z M30 -140 L30 -194 L92 -194 L124 -140 Z" fill="#BFE9FF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
  [-120, 130].map(x => `<circle cx="${x}" cy="-40" r="36" fill="#3B4570" stroke="${INK}" stroke-width="6"/><circle cx="${x}" cy="-40" r="12" fill="#C9CED8"/>`).join('');
function spRoad() {
  const y0 = SPX.RY; let s = `<rect x="-400" y="${y0}" width="2800" height="800" fill="#5E6480" stroke="${INK}" stroke-width="7"/>`;
  for (let i = -4; i <= 4; i++) { const xt = 960 + i * 64, xb = 960 + i * 98; s += `<path d="M${xt - 18} ${y0 + 14} L${xt + 18} ${y0 + 14} L${xb + 27} ${y0 + 330} L${xb - 27} ${y0 + 330} Z" fill="#F4F1EA" opacity=".9"/>`; }
  return s;
}
spcrossScene = function (t, lt, a) {
  const s = SPX.S, FY = SPX.FY, tR = spW(a, '끊긴', 0.69), tL = spW(a, '신호', 1.05), tBus = tL - 0.05, tMiss = tBus + 0.28, tSlump = tBus + 0.95;
  const run0 = -1.3; let zx, pose = '서기', ex = 'z결심', m = {}, rot = 0;
  if (lt < tR) { zx = lerp(-260, 900, clamp((lt - run0) / (tR - run0), 0, 1)); const wk = gfWalk(zx, 1.3, 0.05); pose = wk.pose; m = { sy: wk.sy, dy: wk.dy }; ex = 'z코치지침'; }
  else zx = 900 + 56 * easeOut(gfK(tR, tR + 0.35, lt));
  if (lt >= tR && lt < tR + 0.35) { pose = SP_P.brake; ex = 'z충격'; rot = -14 * Math.sin(Math.PI * gfK(tR, tR + 0.35, lt)); }
  else if (lt >= tR + 0.35 && lt < tBus + 0.12) { pose = '허우적'; ex = 'z충격'; rot = Math.sin((lt - tR) * 15) * 10 * Math.exp(-(lt - tR - 0.35) * 1.6); }
  else if (lt >= tBus + 0.12 && lt < tSlump) { pose = '허우적'; ex = 'z멘붕'; rot = 9 + Math.sin(lt * 34) * 3; m = { dx: 14 * gfK(tBus + 0.12, tBus + 0.4, lt) }; }
  else if (lt >= tSlump) { pose = SP_P.pant; ex = 'z코치지침'; m = gfM({ sy: 1 + 0.03 * Math.sin(lt * 14) }, gfJelly(lt, tSlump, 0.1, 4, 7)); }
  let w = `<g transform="translate(0 -160)">${spStreet(t, 0)}</g>` + spRoad() + fkAt(SPX.PX, FY - 10, spPedLight(lt, tR));
  if (lt < tR) w += spSpeed(lt, zx - 60, FY - 250, -1, 4);
  if (lt > tR) { const k = gfK(tR, tR + 0.3, lt); w += [0, 1].map(j => `<path d="M${f1(900 + j * 34 - 10)} ${FY + 4 + j * 6} L${f1(900 + j * 34 + 50 * k)} ${FY + 4 + j * 6}" stroke="#3A3346" stroke-width="7" stroke-linecap="round" opacity=".55"/>`).join(''); }
  w += spZero({ x: zx, y: FY, s, t, pose, ex, look: lt < tR ? [0.8, 0] : [0.4, -0.1], rot, holdL: SP_BAG }, m);
  w += gfPuff(lt, tR, zx + 50, FY, 1.0, '#EFE6D6') + gfPuff(lt, tR + 0.14, zx + 80, FY, 0.75, '#EFE6D6');
  w += gfEmote(lt, tR + 0.02, zx + 150, FY - 560 * s, 'bang', { hold: 0.7 });
  if (lt > tBus - 0.2 && lt < tSlump + 0.2) w += spDrops(lt, zx, FY - 400 * s, s, 4, 7);
  if (lt > tSlump) w += spBreath(lt, zx + 46 * s, FY - 318 * s, s, 1) + spDrops(lt, zx, FY - 390 * s, s, 2, 11);
  // 버스(왼→오, 앞 차선) 지나간 뒤 승용차
  const bx = lerp(-900, 2900, gfK(tBus, tBus + 1.1, lt)); if (lt > tBus && lt < tBus + 1.1) w += fkAt(bx, 1012, spBus(t)) + spSpeed(lt, bx - 470, 860, -1, 3);
  const cx = lerp(-500, 2500, gfK(tSlump + 0.15, tSlump + 0.85, lt)); if (lt > tSlump + 0.15 && lt < tSlump + 0.85) w += fkAt(cx, 1040, spCar('#FF9AA8'));
  if (lt > tBus + 0.1 && lt < tSlump) w += [0, 1, 2, 3].map(k => { const ph = (lt * 4 + k * 0.27) % 1; return `<path d="M${f1(zx - 300 + ph * 600)} ${FY - 330 + k * 60} q60 -16 120 0" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="${f1((1 - ph) * 90) / 100}"/>`; }).join('');
  w += spMiss(lt, tMiss, zx, FY - 600 * s);
  const cam = qLerpCam(gfK(tSlump - 0.2, tSlump + 0.9, lt), [960, 590, 1.0], [960, 560, 1.12]);
  let h = fkDefs() + qCam(cam, w);
  if (lt > tR && lt < tR + 0.3) { const [sx, sy] = gfShake(lt, tR, 10, 0.3); h = `<g transform="translate(${f1(sx)} ${f1(sy)})">${h}</g>`; }
  h += spHud(lt, lt > tMiss ? 3 : 4, { from: 4, tp: tMiss, combo: lt > tMiss ? 1 : 0, ctp: tMiss, clock: lt > tSlump + 0.35 ? 'AM 08:21' : 'AM 08:20', clk: tSlump + 0.35 });
  if (lt < 0.5) h += fkAt(960, 200, gfPanel(560, 150, { bg: '#fff' }) + gfT(0, -8, '출근 스테이지', 52, GFC.navy) + gfT(0, 44, 'AM 08:20 출근 모드 ON', 30, GFC.grape), gfIn(lt, -1.15, 3, 0.45) * (1 - gfK(0.15, 0.45, lt)));
  return h;
};

/* ===================== s1b 만원 지하철(차 안) ===================== */
function spCarIn(lt, lu) {
  const winX = [80, 520, 960, 1400, 1840];
  let s = `<rect x="-400" y="-300" width="2800" height="1300" fill="#E1EAE6"/><rect x="-400" y="-300" width="2800" height="480" fill="#F6F8F7"/>`;
  for (let i = 0; i < 6; i++) s += `<rect x="${-200 + i * 420}" y="120" width="260" height="22" rx="11" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/>`;          // 형광등
  [['#FFD9C9', '#C9D8FF', '#D9F2C9'], ['#E8D9FF', '#FFE9A8', '#C9F0EE']].forEach((row, r) => row.forEach((c, i) => { s += `<rect x="${-260 + (i + r * 3) * 380}" y="190" width="300" height="56" rx="8" fill="${c}" stroke="${INK}" stroke-width="4"/>`; }));   // 글자 없는 광고 칸
  s += `<defs><clipPath id="spWinC">${winX.map(x => `<rect x="${x - 170}" y="300" width="340" height="250" rx="26"/>`).join('')}</clipPath></defs>`;
  s += winX.map(x => `<rect x="${x - 170}" y="300" width="340" height="250" rx="26" fill="#232B45"/>`).join('');
  let st = ''; for (let k = 0; k < 9; k++) { const x = ((k * 330 - lt * 2600) % 2970 + 2970) % 2970 - 400; st += `<rect x="${f1(x)}" y="${380 + (k % 3) * 55}" width="${150 + (k % 2) * 90}" height="10" rx="5" fill="#FFE9A8" opacity=".85"/>`; }
  s += `<g clip-path="url(#spWinC)">${st}</g>` + winX.map(x => `<rect x="${x - 170}" y="300" width="340" height="250" rx="26" fill="none" stroke="${INK}" stroke-width="7"/>`).join('');
  s += `<line x1="-400" y1="268" x2="2400" y2="268" stroke="#9AA3B5" stroke-width="16" stroke-linecap="round"/><line x1="-400" y1="268" x2="2400" y2="268" stroke="${INK}" stroke-width="4" opacity=".35"/>`;
  for (let i = 0; i < 12; i++) { const x = -160 + i * 190; if (Math.abs(x - 960) < 80) continue; const ang = -lu * 1.6 + Math.sin(lt * 3 + i) * 4;
    s += `<g transform="translate(${x} 268) rotate(${f1(ang)})"><line x1="0" y1="0" x2="0" y2="84" stroke="#7FA3C9" stroke-width="10"/><circle cx="0" cy="106" r="22" fill="none" stroke="#7FA3C9" stroke-width="9"/></g>`; }
  s += `<rect x="1720" y="300" width="300" height="600" rx="16" fill="#C9D3E2" stroke="${INK}" stroke-width="7"/><rect x="1760" y="330" width="220" height="200" rx="14" fill="#232B45" stroke="${INK}" stroke-width="5"/>`;   // 문
  return s + `<rect x="-400" y="880" width="2800" height="500" fill="#A9B2C4" stroke="${INK}" stroke-width="7"/>`;
}
spsubwayScene = function (t, lt, a) {
  const FY = 880, s = 0.95, tB = spW(a, '숨', 0.15), tSq = spW(a, '막히', 0.41), tLu = spW(a, '만원', 0.93), tJ = spW(a, '지하철', 1.29), tMiss = tJ + 0.32;
  const lu = lt > tLu ? Math.sin((lt - tLu) * 8) * 13 * Math.exp(-(lt - tLu) * 1.8) : 0, sway = Math.sin(lt * 3.2) * 2, sq = easeOut(gfK(tSq, tSq + 0.35, lt)), lift = easeOut(gfK(tLu, tLu + 0.3, lt));
  let w = spCarIn(lt, lu);
  const R = lu + sway, DX = lu * 3;
  // 뒷줄(작게, 흐리게)
  w += SP_DIMDEF + '<g filter="url(#spDim)">';
  [[330, '#CDD2DC', 'z멍'], [520, '#D5D0DC', '지침'], [700, '#CFD8D2', 'z코치지침'], [860, '#D8D2CB', 'z멍'], [1070, '#D2D6CC', '지침'], [1240, '#DCD2D2', 'z멍'], [1420, '#CED4DE', 'z코치지침'], [1600, '#D6D0C8', 'z멍']].forEach(([x, c, e], i) => {
    w += gfActor(spPass(i + 3), { x: x + DX * 0.7 + (i % 2 ? 12 : -12) * sq, y: FY - 36 - (i % 3) * 8, s: 0.8 + (i % 3) * 0.03, t, pose: i % 3 === 1 ? SP_P.strap : '서기', ex: fEx(e), look: [(i % 2 ? 0.4 : -0.4), -0.2], seed: 70 + i, rot: R * 0.8 }); });
  w += '</g>';
  // 제로: 손잡이에 매달려 찌부, 쏠릴 때 발이 뜸
  const zx = 960 + DX, zm = gfM({ sx: lerp(1, 0.6, sq), sy: lerp(1, 1.1, sq), dy: -46 * lift }, lt > tSq ? gfJelly(lt, tSq, 0.1, 5, 7) : {}, lt > tLu ? gfJelly(lt, tLu, 0.08, 6, 8) : {});
  const ex = lt < tSq ? 'z코치지침' : lt < tMiss ? 'z멘붕' : 'z기절';
  const hx = zx + (268 - 200) * s * zm.sx, hy = FY + zm.dy + (128 - 560) * s * zm.sy;
  w += `<line x1="${f1(zx + 50)}" y1="268" x2="${f1(hx)}" y2="${f1(hy - 26)}" stroke="#7FA3C9" stroke-width="10"/><circle cx="${f1(hx)}" cy="${f1(hy)}" r="22" fill="none" stroke="#7FA3C9" stroke-width="9"/>`;
  w += `<ellipse cx="${f1(zx)}" cy="${f1(FY - 300)}" rx="230" ry="360" fill="url(#spSpot)"/>`;
  w += spZero({ x: zx, y: FY, s, t, pose: SP_P.strap, ex, rot: R, headSq: [lerp(1, 0.84, sq), lerp(1, 1.06, sq)], look: [0, -0.3], holdL: SP_BAG }, zm);
  w += '<g filter="url(#spDim)">';
  // 앞줄 이웃: 밀려 들어와 제로를 양쪽에서 누름 + 문에서 새로 밀고 들어오는 사람
  const NB = [[-1, 690, 470, '#C4BFB4', 'z멍', 1.0], [1, 690, 470, '#B4C0C9', 'z코치지침', 1.02], [-1, 470, 300, '#BFC9BA', '지침', 0.98], [1, 470, 300, '#C2BBAF', 'z멍', 1.03], [-1, 240, 140, '#B9BEC9', 'z코치지침', 1.02], [1, 240, 140, '#C9B9C9', '지침', 1.0]];
  NB.forEach(([sd, d0, d1, c, e, sc], i) => { const x = 960 + sd * lerp(d0, d1, sq) + DX, near = i >= 4;
    w += gfActor(spPass(i), { x, y: FY + 10, s: 0.95 * sc, t, pose: i === 2 ? SP_P.strap : '서기', ex: fEx(e), look: [-sd * 0.5, 0], seed: 80 + i, rot: R + (near ? -sd * 4 * sq : 0) }, gfM({ sx: near ? lerp(1, 0.86, sq) : 1 }, lt > tSq ? gfJelly(lt, tSq + 0.05 * i, 0.06, 4, 7) : {})); });
  const nk = easeOut(gfK(tSq - 0.15, tSq + 0.3, lt));
  [[0, '#BAC4CF'], [1, '#CBBFB6']].forEach(([j, c]) => { const x = lerp(1950 + j * 200, 1560 + j * 170, nk) + DX; w += gfActor(spPass(j + 7), { x, y: FY + 10, s: 0.98, t, pose: '서기', ex: fEx('z멍'), look: [-0.6, 0], seed: 90 + j, rot: R }); });
  w += '</g>';
  // 후끈한 김 + 땀
  if (lt > tSq) w += [0, 1, 2, 3, 4, 5].map(k => { const ph = (lt * 0.9 + k / 6) % 1, x = 560 + k * 160; return `<path d="M${x} ${f1(470 - ph * 140)} q14 -18 0 -36 q-14 -18 0 -36" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="${f1(Math.sin(ph * Math.PI) * 70) / 100}"/>`; }).join('');
  if (lt > tSq) w += spDrops(lt, zx, FY + zm.dy - 400 * s, s, 4, 3);
  w += spMiss(lt, tMiss, zx + 270, 360);
  const cam = qLerpCam(gfK(0, 1.8, lt), [960, 590, 1.1], [960, 560, 1.3]);
  let h = fkDefs() + qCam(cam, w) + `<rect x="-200" y="-200" width="2400" height="1500" fill="#CFF0FF" opacity=".07"/>`;
  if (lt > tLu && lt < tLu + 0.4) { const [sx, sy] = gfShake(lt, tLu, 12, 0.4); h = `<g transform="translate(${f1(sx)} ${f1(sy)})">${h}</g>`; }
  if (lt > tLu && lt < tLu + 1.2) h += gfBounceText(lt, tLu, 560, 330, [['끼이익—', '#FF5A5A']], { size: 84 });
  // 숨 게이지
  const v = 1 - 0.88 * gfK(tB, tMiss, lt), low = v < 0.35, col = low ? (Math.floor(lt * 8) % 2 ? GFC.coral : '#FFB3B3') : GFC.sky;
  h += fkAt(960, 230, gfPanel(380, 80, { bg: '#fff' }) + gfT(-140, 15, '숨', 40, GFC.navy) + `<g transform="translate(-95 0)">${gfBar(250, v, { h: 30, col })}</g>`, gfIn(lt, tB - 0.1, 3, 0.45) * (low ? gfBeat(lt, tMiss, 0.12, 4, 8) : 1));
  return h + spHud(lt, lt > tMiss ? 2 : 3, { from: 3, tp: tMiss, combo: lt > tMiss ? 2 : 1, ctp: tMiss, clock: 'AM 08:34' });
};

/* ===================== s1c·s2 엘리베이터 로비 ===================== */
const SPE = { FY: 900, EX: 1250, S: 0.95 };
function spLobby(t, open, floor, up) {
  const X = SPE.EX, FY = SPE.FY;
  let s = `<rect x="-400" y="-300" width="2800" height="1300" fill="#F1E9DC"/><rect x="-400" y="-300" width="2800" height="150" fill="#FBF7F0"/>`;
  for (let i = 0; i < 6; i++) s += `<ellipse cx="${-100 + i * 420}" cy="-150" rx="90" ry="16" fill="#FFF8D6" stroke="${INK}" stroke-width="4"/>`;
  s += `<rect x="-400" y="700" width="2800" height="200" fill="#E3D6C3"/><line x1="-400" y1="700" x2="2400" y2="700" stroke="${INK}" stroke-width="5" opacity=".5"/>`;
  s += `<rect x="-400" y="${FY}" width="2800" height="600" fill="#D8CDBD" stroke="${INK}" stroke-width="7"/>` + Array.from({ length: 16 }, (_, i) => `<line x1="${-300 + i * 180}" y1="${FY}" x2="${-420 + i * 200}" y2="${FY + 240}" stroke="${INK}" stroke-width="3" opacity=".2"/>`).join('');
  s += gfPlant(250, FY, 1.05, t);
  // 엘리베이터(로고·글자 없음)
  s += `<rect x="${X - 262}" y="240" width="524" height="${FY - 240}" rx="12" fill="#B8C2D6" stroke="${INK}" stroke-width="8"/><rect x="${X - 210}" y="290" width="420" height="${FY - 290}" fill="#FFF1C9" stroke="${INK}" stroke-width="5"/>`;
  s += `<rect x="${X - 190}" y="320" width="380" height="16" fill="#E9D7A6"/><rect x="${X - 190}" y="560" width="380" height="14" fill="#E9D7A6"/>`;
  const dw = 210 * (1 - open);
  if (dw > 1) s += `<rect x="${X - 210}" y="290" width="${f1(dw)}" height="${FY - 290}" fill="#D3DAE8" stroke="${INK}" stroke-width="6"/><rect x="${f1(X + 210 - dw)}" y="290" width="${f1(dw)}" height="${FY - 290}" fill="#D3DAE8" stroke="${INK}" stroke-width="6"/>` +
    `<rect x="${f1(X - 210 + dw * 0.18)}" y="330" width="${f1(dw * 0.5)}" height="${FY - 380}" rx="6" fill="#fff" opacity=".22"/>`;
  s += `<rect x="${X - 92}" y="168" width="184" height="58" rx="12" fill="#1E2436" stroke="${INK}" stroke-width="6"/>` + gfT(X + 26, 214, String(floor), 44, '#FFC85A') +
    `<path d="M${X - 56} 212 l18 -26 l18 26 Z" fill="${up ? '#FFC85A' : '#4A4F63'}"/>`;
  s += `<rect x="${X + 300}" y="520" width="64" height="130" rx="12" fill="#C9D1E0" stroke="${INK}" stroke-width="5"/><circle cx="${X + 332}" cy="560" r="16" fill="${up ? '#FFE07A' : '#fff'}" stroke="${INK}" stroke-width="4"/><circle cx="${X + 332}" cy="612" r="16" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
  return s;
}
/* 큰 뾰족 말풍선(글자 넣기) */
function spBigSpike(x, y, k, rot, words) {
  if (k < 0.02) return ''; let d = ''; for (let i = 0; i < 40; i++) { const a = i * Math.PI / 20, r = i % 2 ? 1 : 1.17; d += (i ? 'L' : 'M') + f1(Math.cos(a) * 250 * r) + ' ' + f1(Math.sin(a) * 120 * r); }
  return fkAt(x, y, `<path d="M-40 110 L-110 190 L20 118 Z" fill="#FFE1E1" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="${d}Z" fill="#FFE1E1" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` + words, k, rot);
}
spelevScene = function (t, lt, a) {
  const s = SPE.S, FY = SPE.FY, X = SPE.EX, run = a._run;
  if (a.ph === 1) return spelevAfter(t, lt, a);
  const tC0 = spW(a, '자리', 0.37), tC1 = spW(a, '기도', 0.83) + 0.06, tPh = spW(a, '날아', 1.33), tBo = spW(a, '상사', 1.69), tI = spW(a, '이거', 2.15), tD = spW(a, '다시', 2.67), tH = spW(a, '해와', 2.99), tSlam = tH + 0.34;
  const open = 1 - easeInOut(gfK(tC0, tC1, lt)), floor = lt < tC1 + 0.3 ? 1 : Math.min(15, 1 + Math.floor((lt - tC1 - 0.3) / 0.32) + 1);
  let w = spLobby(t, open, floor, lt > tC1 + 0.2);
  let zx = lerp(80, 1030, easeOut(gfK(-0.25, tC1, lt))), pose = '서기', ex = 'z결심', m = {}, rot = 0;
  if (lt > tC1) zx -= 80 * easeOut(gfK(tC1, tC1 + 0.28, lt));
  if (lt < tC0 - 0.1) { const wk = gfWalk(zx, 1.3, 0.05); pose = wk.pose; m = { sy: wk.sy, dy: wk.dy }; ex = 'z코치지침'; }
  else if (lt < tC1) { pose = SP_P.reach; ex = 'z충격'; }
  else if (lt < tPh - 0.05) { pose = '서기'; ex = 'z기절'; m = gfJelly(lt, tC1, 0.2, 5, 6); rot = -10 * Math.exp(-(lt - tC1) * 4) * Math.cos((lt - tC1) * 14); }
  else if (lt < tSlam) { pose = '폰보기'; ex = lt < tBo ? 'z충격' : 'z소름'; }
  else { pose = '웅크림'; ex = lt < tSlam + 0.7 ? 'z기절' : 'z울먹'; m = gfM({ sy: 0.94 }, gfJelly(lt, tSlam, 0.22, 4, 6)); }
  // 말풍선에 맞을 때마다 움찔
  const hits = [0, 1, 2, 3].map(i => tBo + i * 0.26 + 0.5);
  hits.forEach(hT => { if (lt > hT && lt < hT + 0.4 && lt < tSlam) m = gfM(m, gfJelly(lt, hT, 0.1, 6, 9)); });
  if (lt > tC1) w += fkAt(zx - 150 + 40 * easeOut(gfK(tC1, tC1 + 0.4, lt)), FY - 30 - 120 * Math.sin(Math.PI * gfK(tC1, tC1 + 0.4, lt)), SP_BAG, 0.95, 70 * gfK(tC1, tC1 + 0.4, lt));
  w += spZero({ x: zx, y: FY, s, t, pose, ex, rot, look: lt < tC1 ? [0.8, 0] : [0, -0.2], holdL: lt < tC1 ? SP_BAG : null }, m);
  const headTop = FY - 505 * s;
  if (lt > tC1 && lt < tPh) { w += gfT(X - 230, 470, '쿵!', 70, '#FF5A5A', { sw: 12, stroke: '#fff' }).replace('<text', `<text opacity="${f1(gfOut(lt, tC1 + 0.5, 0.2) * 100) / 100}"`);
    w += [0, 1, 2].map(k => { const an = lt * 6 + k * 2.1; return fkAt(zx + Math.cos(an) * 120 * s, headTop + 20 + Math.sin(an) * 30 * s, gfStar4(22, GFC.sun, 4)); }).join(''); }
  // 폰(뒷면만) + 얼굴에 화면 빛
  if (lt >= tPh - 0.05 && lt < tSlam + 0.2) { const pp = P['폰보기'], pc = gfHand(zx, FY, s, [(pp.hL[0] + pp.hR[0]) / 2, (pp.hL[1] + pp.hR[1]) / 2 - 34]), bz = lt < tBo + 0.3 ? Math.sin(lt * 70) * 4 : 0;
    w += `<ellipse cx="${f1(zx)}" cy="${f1(FY - 355 * s)}" rx="${f1(92 * s)}" ry="${f1(60 * s)}" fill="#BFE9FF" opacity=".3"/>`;
    w += fkAt(pc[0] + bz, pc[1], `<rect x="-30" y="-50" width="60" height="100" rx="12" fill="#3B4570" stroke="${INK}" stroke-width="6"/><circle cx="-12" cy="-32" r="6" fill="#151A2C"/>`);
    if (lt < tBo + 0.4) w += [-1, 1].map(sd => `<path d="M${f1(pc[0] + sd * 52)} ${f1(pc[1] - 26)} q${sd * 14} 26 0 52 M${f1(pc[0] + sd * 72)} ${f1(pc[1] - 38)} q${sd * 20} 38 0 76" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity="${Math.floor(lt * 14) % 2 ? 1 : 0.35}"/>`).join('');
    w += gfEmote(lt, tPh, zx + 140, headTop - 30, 'bang', { hold: 0.5 });
    // 작은 뾰족 말풍선: 폰에서 튀어나와 머리 위로 → 머리에 쿵
    [0, 1, 2, 3].forEach(i => { const t0 = tBo + i * 0.26, u1 = gfK(t0, t0 + 0.3, lt), u2 = gfK(t0 + 0.3, t0 + 0.5, lt); if (lt < t0 || lt > t0 + 0.5) return;
      const ax = zx + (i - 1.5) * 120, ay = headTop - 150 - (i % 2) * 50, x = lt < t0 + 0.3 ? lerp(pc[0], ax, easeOut(u1)) : lerp(ax, zx + (i - 1.5) * 40, easeIn(u2)), y = lt < t0 + 0.3 ? lerp(pc[1], ay, easeOut(u1)) - Math.sin(Math.PI * u1) * 60 : lerp(ay, headTop + 20, easeIn(u2));
      w += fkSpike(x, y, 0.55 + 0.2 * u1, t, { rot: (i - 1.5) * 12 }); });
    hits.forEach(hT => { w += gfPuff(lt, hT, zx, headTop + 10, 0.8, '#FFD1D1'); });
    // 큰 말풍선 "이거 다시 해와"
    if (lt > tI) { const k = gfIn(lt, tI, 3, 0.45), bx = lerp(pc[0], zx + 40, easeOut(gfK(tI, tI + 0.35, lt))), by0 = lerp(pc[1], headTop - 150, easeOut(gfK(tI, tI + 0.35, lt)));
      const drop = easeIn(gfK(tSlam - 0.12, tSlam, lt)), by = lerp(by0, headTop + 60, drop), shake = Math.sin(lt * 40) * (2 + 5 * gfK(tI, tSlam, lt));
      const wd = gfT(0, -8, (lt > tI ? '이거 ' : '') + (lt > tD ? '다시' : ''), 64, '#E5484D') + (lt > tH ? gfT(0, 62, '해와!', 64, '#E5484D') : '');
      if (lt < tSlam) w += spBigSpike(bx, by, k * gfBeat(lt, tH, 0.12, 4, 8) * lerp(1, 0.8, drop), shake, wd); }
    w += gfPuff(lt, tSlam, zx, headTop + 60, 2.4, '#FFD1D1') + gfPuff(lt, tSlam + 0.05, zx + 60, headTop + 30, 1.6, '#FFE1E1'); }
  if (lt > tSlam) { w += [0, 1, 2, 3, 4, 5].map(i => { const u = gfK(tSlam, tSlam + 0.6, lt); if (u >= 1) return ''; const an = -Math.PI / 2 + (i - 2.5) * 0.5; return fkSpike(zx + Math.cos(an) * 260 * u, headTop + 60 + Math.sin(an) * 200 * u + 300 * u * u, 0.32, t, { rot: i * 40 + u * 200 }); }).join('');
    w += gfEmote(lt, tSlam + 0.5, zx - 120, headTop + 120, 'gloom', { hold: 9 }) + spDrops(lt, zx, FY - 300 * s, s, 3, 5); }
  w += spMiss(lt, tSlam, zx, headTop - 60);
  const cam = qLerpCam(gfK(tPh - 0.4, tPh + 0.6, lt), [1000, 600, 1.0], [1030, 640, 1.1]);
  let h = fkDefs() + qCam(cam, w);
  if (lt > tC1 && lt < tC1 + 0.3) { const [sx, sy] = gfShake(lt, tC1, 12, 0.3); h = `<g transform="translate(${f1(sx)} ${f1(sy)})">${h}</g>`; }
  if (lt > tSlam && lt < tSlam + 0.35) { const [sx, sy] = gfShake(lt, tSlam, 16, 0.35); h = `<g transform="translate(${f1(sx)} ${f1(sy)})">${h}</g>`; }
  return h + spHud(lt, lt > tSlam ? 1 : 2, { from: 2, tp: tSlam, combo: lt > tSlam ? 3 : 2, ctp: tSlam, clock: 'AM 08:59' });
};
/* s2: 문 앞에 털썩, 영혼이 빠져나감 */
function spelevAfter(t, lt, a) {
  const s = SPE.S, FY = SPE.FY, X = SPE.EX, tS = spW(a, '영혼', 0.71), tA = spW(a, '아시죠', 2.25), zx = 1040;
  let w = spLobby(t, 0, Math.min(15, 9 + Math.floor(lt / 0.5)), true);
  w += spZero({ x: zx, y: FY, s, t, pose: SP_P.sit, ex: lt > tS ? 'z기절' : 'z울먹', rot: -7 + Math.sin(t * 1.4) * 2, look: [0, 0.3], tilt: 8 }, gfM({ sy: 0.98 + 0.02 * Math.sin(lt * 5) }, gfJelly(lt, 0, 0.16, 3, 5)));
  const hy = FY - (390 - 96) * s;
  if (lt > tS) { const u = gfK(tS, tS + 1.8, lt); w += fkAt(zx + Math.sin(lt * 3) * 20, hy - 140 - 170 * easeOut(u), `<g transform="scale(2.4)">${GF_ICON.ghost(t)}</g>`, 1 - 0.35 * u, Math.sin(t * 4) * 8);
    w += `<path d="M${zx} ${f1(hy - 110)} Q${f1(zx + 30)} ${f1(hy - 140 - 90 * u)} ${f1(zx + Math.sin(lt * 3) * 20)} ${f1(hy - 140 - 170 * easeOut(u) + 40)}" fill="none" stroke="#C9D2FF" stroke-width="8" stroke-dasharray="10 10" opacity=".7"/>`; }
  if (lt > tA) w += gfEmote(lt, tA, zx + 170, hy - 130, 'sweat', { hold: 9 });
  w += gfEmote(lt, 0.3, zx - 150, hy - 60, 'gloom', { hold: 9 });
  const cam = qLerpCam(gfK(0, 2.6, lt), [1030, 600, 1.08], [1040, 610, 1.14]);
  return fkDefs() + qCam(cam, w) + spHud(lt, 1, { combo: 3, ctp: -9, clock: 'AM 08:59' }) + (lt < 0.95 ? gfBounceText(lt, 0.05, 960, 330, [['콤보 ×3', GFC.sun]], { size: 96 }) : '');
}
