/* 기게스의 반지 편 — 3단계(제로의 선택) + 아웃트로. gygf3.js 다음에 읽는다. 새 이름은 gy 접두사.
   r0 '다시 하기'(말 없음) → d1 같은 시험장·같은 구도로 2회차 → d2 1막의 악마가 다시 속삭이지만 안경을 벗어 내려놓자 펑 → (정적 1초)
   d3 남들은 먼저 나가고 제로는 느리게, 75점 → d4 '정답 ×9999 흔함' vs '스스로 버텨낸 근육 전설' → d5 불 꺼진 시험장, 보는 눈 0 → '내 눈'
   e1 로봇이 반지(↔안경)를 건넴 → e2 망설이는 다음 수험생에게 제로가 몽당연필을 건넴(감동) → e3 선택 상자(0.01% → 0%) → e4 빈칸 카드 → e5 안경 옆 몽당연필. */
['gyretry', 'gychoice', 'gyend'].forEach(k => CAMS[k] = 'fixed');

const GY_CURSOR = `<path d="M0 0 L0 64 L16 50 L28 76 L40 70 L28 46 L48 46 Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
const GY_ARM = `<g><path d="M-96 40 L-96 6 Q-60 -40 -6 -20 L18 -10 L30 -60 L66 -60 L64 20 Q60 46 30 46 Z" fill="#FFD9B0" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-70 -6 Q-40 -46 -6 -20" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>` +
  `<rect x="22" y="-104" width="54" height="52" rx="20" fill="#FFD9B0" stroke="${INK}" stroke-width="8"/><path d="M30 -84 h30 M30 -70 h30" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M-110 -50 l-20 -14 M-104 -74 l-12 -22 M96 -90 l22 -10" stroke="#FFB800" stroke-width="7" stroke-linecap="round"/></g>`;
const gyRarity = (label, sub, col, stars, o = {}) => { const w = o.w || 360, hh = o.h || 470;
  return `<g>${o.glow ? gfRays(o.t || 0, 0, -20, 330, col, 14, 0.4, 12) : ''}<rect x="${-w / 2 + 8}" y="${-hh / 2 + 12}" width="${w}" height="${hh}" rx="28" fill="${GFC.navy}" opacity=".3"/><rect x="${-w / 2}" y="${-hh / 2}" width="${w}" height="${hh}" rx="28" fill="${o.bg || '#fff'}" stroke="${col}" stroke-width="12"/>` +
    `<rect x="${-w / 2 + 22}" y="${-hh / 2 + 22}" width="${w - 44}" height="${hh * 0.5}" rx="18" fill="${o.inner || '#F2F4F8'}"/>${o.svg || ''}` +
    gfT(0, hh * 0.16, label, o.size || 40, GFC.navy) + (sub ? gfT(0, hh * 0.16 + 50, sub, o.size2 || 40, GFC.navy) : '') +
    `<g transform="translate(0 ${hh / 2 - 48})">${gfChip(stars, { size: 34, bg: col, col: '#fff' })}</g></g>`; };

/* ---------- r0: 게임 오버? → '다시 하기' ---------- */
gyretryScene = function (t, lt, a) {
  const D = a._dur || 1.8, tc = 0.85, press = lt > tc && lt < tc + 0.15;
  let h = fkDefs() + GY_DEFS + gfFull('#120E1C') + gfRays(t, 960, 480, 1300, '#8E7CFF', 14, 0.1, 6);
  h += fkAt(960, 250, gfT(0, 0, 'GAME OVER?', 96, '#B8B0D8'), gfIn(lt, 0.05, 3, 0.45));
  h += fkAt(960, 520, gfPanel(620, 150, { r: 75, bg: GFC.sun, sw: 9 }) + gfT(0, 26, '▶ 다시 하기', 72, GFC.navy), gfIn(lt, 0.2, 3, 0.45) * (press ? 0.92 : lt > tc ? gfBeat(lt, tc + 0.15, 0.12, 4, 8) : 1));
  const cx = lerp(1500, 1150, easeOut(gfK(0.3, tc, lt))), cy = lerp(860, 560, easeOut(gfK(0.3, tc, lt)));
  h += `<g transform="translate(${f1(cx)} ${f1(cy)}) scale(1.4)">${GY_CURSOR}</g>` + gfRing(lt, tc, 1150, 560, 10, 120, '#fff', 10, 0.35);
  if (lt > tc + 0.2) { h += fkAt(960, 740, gfChip('◀◀ 시험 종료 5분 전으로', { size: 44, bg: '#fff' }), gfIn(lt, tc + 0.2, 3.2, 0.45));
    const k = gfK(tc + 0.4, D, lt); for (let i = 0; i < 10; i++) h += `<rect x="-200" y="${f1(((i * 137 + lt * 2600) % 1300) - 100)}" width="2400" height="${6 + (i % 3) * 6}" fill="#fff" opacity="${f1(0.25 * k * 100) / 100}"/>`; }
  return h;
};

/* ---------- d1~d5: 2회차 시험장 ---------- */
function gyExamineesLeave(t, lt, leaveTs) { // 다른 수험생이 하나씩 일어나 나감(책상은 남음)
  let h = '';
  [[300, 0, 'z뿌듯'], [590, 4, 'z빵긋'], [1350, 5, 'z뿌듯'], [1630, 7, 'z빵긋']].forEach(([x, i, ex], k) => {
    const t0 = leaveTs[k], u = gfK(t0, t0 + 1.6, lt), gone = u >= 1;
    if (!gone) { const xx = x + (u > 0 ? (1 - 2 * (k < 2)) * -0 : 0) + u * 900 * (k < 2 ? -1 : 1), stand = u > 0, wk = stand ? gfWalk(xx * 1.4, 0.8) : null;
      h += gfActor(spPass(i), { x: xx, y: stand ? 820 : 800, s: 0.6, t, pose: stand ? wk.pose : '책상', ex: fEx(stand ? ex : 'z결심'), look: [stand ? (k < 2 ? -0.7 : 0.7) : 0, stand ? 0 : 0.7], seed: 20 + k }, stand ? { sy: wk.sy, dy: wk.dy } : { dy: Math.sin(t * 6 + k * 2.1) });
      if (u > 0 && u < 0.35) h += gfPlus(lt, t0, x, 800 - 360, '제출!', { size: 34, col: GFC.mint }); }
    h += gyDesk(x, 806, 0.6, {});
  });
  return h;
}
gychoiceScene = function (t, lt, a, runLt) {
  const ph = a.ph, D = a._dur || 4, FY = GY.FY, ZX = GY.ZX, clock = runLt || lt;
  let h = fkDefs() + GY_DEFS, hud = { clock, eyes: 1, hp: 12 }, w = '', cam = [960, 560, 1];
  if (ph === 0) { // 다시 시험 종료 5분 전(1막 첫 장면과 같은 구도)
    cam = camLerp(lt / D, [960, 560, 1.0], [960, 600, 1.08]);
    w = gyBackRoom(t, { clock }) + gyExaminees(t) + gyAtDesk({ x: ZX, y: FY, s: 1, t, pose: 'gy쓰기', ex: 'z멍', look: [0, 0.5], holdR: GY_PENCIL }, {});
    h += qCam(cam, w) + fkAt(960, 66, gfChip('2회차', { size: 44, bg: GFC.sun }), gfIn(lt, 0.2, 3, 0.45), -3);
    if (lt < 0.5) for (let i = 0; i < 8; i++) h += `<rect x="-200" y="${f1(((i * 151 + lt * 2600) % 1300) - 100)}" width="2400" height="${6 + (i % 3) * 6}" fill="#fff" opacity="${f1(0.3 * (1 - lt / 0.5) * 100) / 100}"/>`;
    hud.tT = 0.3;
  } else if (ph === 1) { // 안경을 벗어 책상 위에 내려놓음 — 악마가 다시 속삭이다 펑
    const tR = gyW(a, '결국', 0.6), tO = gyW(a, '벗어', 1.9) - 0.1, tP = gyW(a, '내려놓', 3.2) - 0.1;
    const off = lt > tO, placed = lt > tP, gone = gfK(tP + 0.1, tP + 0.4, lt);
    cam = camLerp(lt / D, [960, 520, 1.3], [960, 500, 1.42]);
    w = gyBackRoom(t, { clock }) + gyExaminees(t);
    const DX = ZX + 230, dy = FY - 472 + Math.sin(t * 3) * 6;
    if (gone < 1) w += `<g transform="translate(${DX} ${f1(dy)}) scale(${f1((1 - gone) * 1000) / 1000})">${gyDevil(t, 0.8, { grin: 1, look: -0.8, point: 1 - gfK(tR, tR + 0.4, lt) })}</g>`;
    w += gyPoof(lt, tP + 0.1, DX, dy + 20, 1.0);
    const pose = off && !placed ? 'gy들기' : 'gy쓰기', glassAt = placed ? null : off ? [ZX, FY - 380 + 120 * gfK(tO + 0.3, tP, lt)] : null;
    w += gyAtDesk({ x: ZX, y: FY, s: 1, t, pose, ex: lt > tR ? 'z결심' : 'z당황', look: [lt > tR ? 0 : 0.6, 0], holdR: pose === 'gy쓰기' ? GY_PENCIL : null, noGlass: off, glow: lt < tR ? 0.5 : 0 }, lt > tR && lt < tR + 0.5 ? { sy: 1.045 } : {}, { glasses: placed ? 0 : null, t });
    if (glassAt) w += fkAt(glassAt[0], glassAt[1], gyGlasses(0), 0.9);
    if (lt < tP) w += fkAt(ZX - 330, FY - 590, `<path d="M90 60 L150 120 L40 66 Z" fill="#FFF0F0" stroke="#B3202C" stroke-width="6" stroke-linejoin="round"/><rect x="-250" y="-70" width="500" height="140" rx="60" fill="#FFF0F0" stroke="#B3202C" stroke-width="6" stroke-dasharray="18 10"/>` + gfT(0, 16, '아무도 모른다니까~', 42, '#B3202C'), gfIn(lt, 0.1, 3, 0.45));
    if (lt > tP + 0.1) w += fkAt(DX, dy - 150, gfChip('칫!', { size: 38, bg: '#FFE1E1' }), gfIn(lt, tP + 0.15, 3.2, 0.45) * gfOut(lt, tP + 1.0, 0.25), 8);
    h += qCam(cam, w);
    if (placed) h += fkAt(960, 180, gyAR(520, '스텔스 모드 OFF', { size: 40 }), gfIn(lt, tP + 0.3, 3.2, 0.45));
  } else if (ph === 2) { // 남들보다 느리고, 손해(75점)
    const tSl = gyW(a, '느리고', 0.7), tL = gyW(a, '손해', 2.4) - 0.1;
    cam = camLerp(lt / D, [960, 560, 1.05], [960, 540, 1.12]);
    w = gyBackRoom(t, { clock }) + gyExamineesLeave(t, lt, [0.1, 0.5, 0.9, 1.3]);
    const scr = Math.sin(lt * 16) * 3;
    w += gyAtDesk({ x: ZX, y: FY, s: 1, t, pose: 'gy쓰기', ex: 'z결심', look: [0, 0.6], holdR: GY_PENCIL, noGlass: true }, { dy: scr * 0.3 }, { glasses: 0, t });
    w += fkAt(ZX, FY - 640, `<circle r="60" fill="url(#gfGlow)"/>` + gfIcon('bulb', 1.2, t), gfIn(lt, 0.2, 3, 0.45));
    w += fkAt(ZX + 360, FY - 560, gfPanel(380, 76, { r: 30 }) + gfT(-170, 11, '답안', 30, GFC.navy, { anchor: 'start' }) + `<g transform="translate(-90 0)">${gfBar(250, 0.15 + 0.25 * gfK(0, D, lt), { col: GFC.mint, h: 24 })}</g>`, gfIn(lt, tSl - 0.2, 3, 0.45));
    if (lt > tSl) w += fkAt(ZX - 340, FY - 600, gfChip('나만의 생각 회로 가동 중…', { size: 34, bg: '#FFF3B0' }), gfIn(lt, tSl, 3.2, 0.45), -3);
    h += qCam(cam, w);
    if (lt > tL) h += fkAt(1450, 470, gyCert('75점', '느려도 내 힘으로'), gfIn(lt, tL, 3, 0.45), 4) + fkAt(1560, 390, gfChip('−25', { size: 36, bg: '#FFE1E1' }), gfIn(lt, tL + 0.3, 3.2, 0.45), 8);
    hud.hp = 12;
  } else if (ph === 3) { // AI가 0.1초 만에 정답 ×9999(흔함) vs 스스로 버텨낸 근육(전설)
    const tA = gyW(a, 'AI', 0.4) - 0.1, t01 = gyW(a, '초', 1.85), tRare = gyW(a, '희소', 4.0) - 0.1, tK = gyW(a, '아는', 5.6) - 0.3, tS = gyW(a, '스스로', 7.2) - 0.1, tM = gyW(a, '근육', 8.8) - 0.2;
    let w2 = gfFull('url(#gyNavy)') + gfRays(t, 960, 430, 1300, '#8E7CFF', 14, 0.08, 6);
    const dim = gfK(tRare, tRare + 0.5, lt);
    // 로봇이 정답 카드를 쏟아냄
    w2 += `<g opacity="${f1((1 - 0.55 * dim) * 100) / 100}">` + fkAt(300, 640, spRobot(t, 1.5), gfIn(lt, tA, 3, 0.45));
    const n = Math.min(60, Math.floor(Math.max(0, lt - tA - 0.2) * 22));
    for (let i = 0; i < n; i++) { const p = Math.min(1, (lt - tA - 0.2 - i / 22) * 2.5), x = lerp(380, 560 + hash(i * 3.7) * 300, p), y = lerp(560, 760 - hash(i * 1.9) * 160 - Math.sin(Math.PI * p) * 160, p);
      w2 += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1((hash(i * 5.1) - 0.5) * 60)})"><rect x="-44" y="-30" width="88" height="60" rx="8" fill="#E9ECF2" stroke="${INK}" stroke-width="4"/>${gfT(0, 10, '정답', 24, '#6B7280')}</g>`; }
    if (lt > t01 - 0.1) w2 += fkAt(300, 330, gfChip('0.1초', { size: 44, icon: 'clock', bg: '#fff' }), gfIn(lt, t01 - 0.1, 3.2, 0.45), -4);
    if (n > 20) w2 += fkAt(700, 880, gfChip('정답 ×9999', { size: 40, bg: '#E9ECF2' }), gfIn(lt, tA + 1.2, 3.2, 0.45), 2);
    w2 += `</g>`;
    if (lt > tK) w2 += fkAt(760, 450, gyRarity('정답을 아는 능력', '', '#9AA6B8', '흔함 ★', { svg: `<g transform="translate(0 -110)"><rect x="-70" y="-50" width="140" height="100" rx="12" fill="#E9ECF2" stroke="${INK}" stroke-width="5"/>${gfT(0, 14, '정답', 40, '#6B7280')}</g>`, w: 380, h: 470 }), gfIn(lt, tK, 3, 0.45) * (1 - 0.25 * gfK(tS, tS + 0.5, lt)), -3);
    if (lt > tS) { const fl = gfK(tS, tS + 0.5, lt), sx = Math.abs(Math.cos(Math.PI * (1 - fl) * 0.5 + Math.PI * 0.5 * 0));
      w2 += fkAt(1260, 440, `<g transform="scale(${f1(Math.max(0.03, fl) * 100) / 100} 1)">${gyRarity('스스로 고민하고', '버텨낸 근육', '#FFB800', '전설 ★★★★★', { svg: `<g transform="translate(0 -110) scale(1.4)">${GY_ARM}</g>`, bg: '#FFF8E0', inner: '#FFE9A8', glow: true, t, w: 400, h: 500 })}</g>`, gfIn(lt, tS, 3, 0.45) * gfBeat(lt, tM, 0.12, 4, 8), 3) + gfStarBurst(lt, tS + 0.4, 1260, 440, { n: 9, r1: 260 }); }
    if (lt > tM) { const k = gfK(tM, tM + 1.2, lt); w2 += fkAt(960, 860, gfPanel(720, 84, { r: 34 }) + gfT(-320, 13, 'EXP', 36, GFC.navy, { anchor: 'start' }) + `<g transform="translate(-220 0)">${gfBar(520, 0.15 + 0.85 * easeOut(k), { col: '#FFB800', h: 32 })}</g>`, gfIn(lt, tM, 3, 0.45)) + (k > 0.9 ? gfPlus(lt, tM + 1.1, 1240, 800, '묵직!', { size: 46 }) : ''); }
    return h + qCam([960, 540, 1], w2);
  } else { // 아무도 보지 않는 어둠 속에서도 — 보는 눈 0 → '내 눈'
    const tP = gyW(a, '플라톤', 0.2), tN = gyW(a, '아무도', 1.8) - 0.1, tD = gyW(a, '어둠', 2.8) - 0.1, tSf = gyW(a, '스스로', 3.9) - 0.1, tSt = gyW(a, '기준', 5.0);
    const dark = gfK(tD, tD + 0.6, lt), eyes = lt > tN ? 0 : 1, me = gfK(tSf, tSf + 0.6, lt);
    cam = camLerp(lt / D, [880, 560, 1.12], [860, 540, 1.22]);
    w = gyBackRoom(t, { clock: 290 });
    [300, 590, 1350, 1630].forEach(x => { w += gyDesk(x, 806, 0.6, { paper: false }); });
    // 창에 비친 제로(고개를 끄덕임)
    const nod = lt > tSf ? Math.max(0, Math.sin((lt - tSf) * 7)) * 8 : 0;
    w += `<g opacity="${f1((0.25 + 0.6 * dark) * 100) / 100}"><clipPath id="gyWin"><rect x="120" y="170" width="300" height="260"/></clipPath><g clip-path="url(#gyWin)"><rect x="120" y="170" width="300" height="260" fill="#1B2347"/>${gfActor(SPZW, { x: 290, y: 560, s: 0.42, t, pose: '서기', ex: fEx(lt > tSf ? 'z빵긋' : 'z결심'), look: [0.4, nod * 0.03], seed: 3, noGlass: true, headFx: null }, {})}</g></g>`;
    w += `<rect x="-600" y="-600" width="3120" height="2280" fill="#0E1430" opacity="${f1(0.6 * dark * 100) / 100}"/>` + `<ellipse cx="${ZX}" cy="${FY - 260}" rx="${420}" ry="380" fill="url(#gfGlow)" opacity="${f1((0.3 + 0.5 * dark) * 100) / 100}"/>`;
    w += gyAtDesk({ x: ZX, y: FY, s: 1, t, pose: 'gy쓰기', ex: lt > tSf ? 'z빵긋' : 'z결심', look: [lt > tSf ? -0.6 : 0, 0.5], holdR: GY_PENCIL, noGlass: true }, { dy: Math.sin(lt * 12) * 0.6 }, { glasses: 0, t });
    if (lt > tSf) w += `<line x1="${ZX - 200}" y1="${FY - 360}" x2="420" y2="330" stroke="#FFE9A8" stroke-width="4" stroke-dasharray="10 12" opacity="${f1(me * 0.6 * 100) / 100}"/>`;
    if (lt > tSt) w += fkAt(ZX, FY - 640, gfChip('나만의 기준', { size: 40, bg: '#FFF3B0' }), gfIn(lt, tSt, 3.2, 0.45), -3);
    h += qCam(cam, w);
    if (lt > tP - 0.1) h += fkAt(330, 300, gfChip('플라톤의 정의 · 뜻을 옮김', { size: 34, bg: '#fff' }), gfIn(lt, tP - 0.1, 3.2, 0.45), -2);
    hud.eyes = eyes; hud.myEye = me; hud.eyeT = lt > tSf ? tSf + 0.3 : lt > tN ? tN : null; hud.hp = 12 + 40 * me;
  }
  return h + gyHud(lt, hud);
};

/* ---------- e1~e5: 아웃트로 ---------- */
gyendScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 5, FY = GY.FY, ZX = GY.ZX;
  let h = fkDefs() + GY_DEFS;
  if (ph === 0) { // 기술은 반지를 건넬 수 있다: 로봇이 쿠션 위 반지(↔ 안경)를 내민다
    const tG = gyW(a, '건넬', 3.4) - 0.2, reach = easeOut(gfK(tG - 0.6, tG + 0.4, lt)), sw = Math.floor(lt / 0.8) % 2, sk = Math.abs(Math.cos(Math.PI * ((lt / 0.8) % 1)));
    let w = gfFull('url(#gyNavy)') + gfRays(t, 960, 470, 1300, '#7FD8FF', 14, 0.08, 6);
    for (let i = 0; i < 14; i++) w += gfTwinkle(t, 100 + hash(i * 3.1) * 1720, 80 + hash(i * 7.3) * 500, 10, i, '#fff');
    w += fkAt(560, 760, spRobot(t, 2.0), gfIn(lt, 0.05, 3, 0.45));
    const cx = lerp(900, 1180, reach), cy = lerp(600, 520, reach), cs = lerp(1.2, 1.7, reach);
    w += `<path d="M640 600 Q${f1((640 + cx) / 2)} ${f1(cy + 40)} ${f1(cx - 120)} ${f1(cy + 30)}" stroke="#9AA6C4" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M640 600 Q${f1((640 + cx) / 2)} ${f1(cy + 40)} ${f1(cx - 120)} ${f1(cy + 30)}" stroke="${INK}" stroke-width="5" fill="none" opacity=".5"/>`;
    w += fkAt(cx, cy, `<ellipse cx="0" cy="40" rx="150" ry="44" fill="#B3202C" stroke="${INK}" stroke-width="7"/><ellipse cx="0" cy="26" rx="140" ry="36" fill="#D9485A"/><circle cx="-140" cy="40" r="12" fill="#FFD84A" stroke="${INK}" stroke-width="4"/><circle cx="140" cy="40" r="12" fill="#FFD84A" stroke="${INK}" stroke-width="4"/>` +
      `<g transform="translate(0 -40) scale(${f1(Math.max(0.05, sk) * 100) / 100} 1)">${sw ? `<g transform="scale(.9)">${gyGlasses(1, t)}</g>` : gyRing(t, 0)}</g>`, cs);
    if (lt > tG) w += fkAt(cx, cy - 210, gfChip('투명인간의 반지', { size: 40, bg: '#fff' }), gfIn(lt, tG, 3.2, 0.45), -3);
    return h + qCam([960, 540, 1], w);
  }
  if (ph === 1) { // 낄지 말지는 우리 몫: 망설이는 다음 수험생에게 몽당연필을 건넴
    const tK = gyW(a, '낄지', 0.9) - 0.1, tDc = gyW(a, '결정', 2.0), tYe = gyW(a, '여전히', 3.0) - 0.1, tM = gyW(a, '몫', 4.4) - 0.2;
    const GX = 1180, hes = lt > tK && lt < tYe ? Math.sin((lt - tK) * 6) : 0, given = lt > tYe + 0.4, down = lt > tM;
    let w = gyBackRoom(t, { clock: 0 }) + `<rect x="-600" y="-600" width="3120" height="2280" fill="#FFB86B" opacity=".1"/>`;
    [300, 1630].forEach(x => { w += gyDesk(x, 806, 0.6, { paper: false }); });
    // 다음 수험생(서윤 아님, 이름 없음): 안경을 들었다 놨다
    const gp = given ? 'gy쓰기' : 'gy들기';
    w += gfActor(o => zGirl(Object.assign({ hairStyle: 'pony', hairArgs: ['#2E2A33', '#FF8FB1'], top: '#B8E6A8' }, o)), { x: GX, y: FY, s: 0.95, t, pose: gp, ex: fEx(down ? 'z빵긋' : 'z당황'), look: [given ? -0.5 : 0, 0.2], seed: 31, holdR: given ? GY_PENCIL : null }, hes ? { dy: hes * 4 } : {}) +
      gyDesk(GX, FY + 6, 0.95, { glasses: down ? 0.3 : null, t });
    if (!down) w += fkAt(GX, FY - 370 - 40 * Math.max(0, hes), gyGlasses(0.6, t), 0.8);
    if (lt > tK && lt < tYe) w += fkAt(GX - 230, FY - 640, gfChip(hes > 0 ? '낄까?' : '말까?', { size: 40, bg: '#fff' }), 1, -3) + gfEmote(lt, tK, GX + 150, FY - 560, 'sweat', { hold: 2 });
    // 제로: 걸어와 몽당연필을 건넴
    const zx = lerp(-100, GX - 330, easeOut(gfK(0, tDc + 0.3, lt))), walking = lt < tDc + 0.3, wk = walking ? gfWalk(zx * 1.2, 0.8) : null;
    const giving = lt > tYe - 0.2 && !given;
    w += gfActor(SPZW, { x: zx, y: FY, s: 1, t, pose: walking ? wk.pose : giving ? '건네기' : '서기', ex: fEx(lt > tYe ? 'z빵긋' : 'z기본'), look: [0.6, 0], seed: 3, holdR: given ? null : GY_PENCIL, headFx: null }, walking ? { sy: wk.sy, dy: wk.dy } : {});
    if (down) w += gfEmote(lt, tM, GX + 120, FY - 580, 'heart', { hold: 2 }) + gfEmote(lt, tM + 0.2, zx + 120, FY - 600, 'note', { hold: 1.6 });
    if (given && !down) w += fkAt((zx + GX) / 2, FY - 700, gfChip('몽당연필', { size: 38, bg: '#FFF3B0' }), gfIn(lt, tYe + 0.4, 3.2, 0.45), 3);
    return h + qCam(camLerp(lt / D, [960, 560, 1.08], [1000, 540, 1.16]), w);
  }
  if (ph === 2) { // 들킬 확률 0%인 AI 안경 → 선택은?
    const tZ = gyW(a, '%', 1.9) - 0.2, tY = gyW(a, '여러분', 3.5), tC = gyW(a, '선택', 4.9);
    let w = gfFull('url(#gyNavy)') + gfRays(t, 960, 400, 900, '#7FD8FF', 14, 0.08, 8);
    w += fkAt(960, 400, gfItem(lt, 0.1, { svg: `<g transform="scale(1.5)">${gyGlasses(1, t)}</g>`, name: 'AI 안경', sub: '들킬 확률', w: 480 }), 1.2);
    const pr = lt < tZ ? '0.01%' : '0%';
    w += fkAt(960, 620, gfT(0, 0, pr, 96, lt < tZ ? '#7FFFC8' : '#FF6B9A', { sw: 12, stroke: '#0E2A52' }), gfIn(lt, 0.3, 3, 0.45) * (lt > tZ ? gfBeat(lt, tZ, 0.3, 3, 5) : 1));
    if (lt > tZ && lt < tZ + 0.5) w += gfPuff(lt, tZ, 1040, 600, 1.2);
    if (lt > tY) { const k = gfIn(lt, tY, 3, 0.45), cur = Math.floor((lt - tY) * 2.4) % 2;
      w += fkAt(960, 830, gfPanel(760, 120, { r: 30, head: '선택', headBg: GFC.sun }) + [['쓴다', -190], ['안 쓴다', 190]].map(([s2, x], i) => `<g transform="translate(${x} 0)">${i === cur ? `<rect x="-150" y="-36" width="300" height="72" rx="36" fill="${GFC.sun}" opacity=".55"/>` : ''}${gfT(0, 16, s2, 44, GFC.navy)}${i === cur ? `<path d="M-130 -16 L-100 0 L-130 16 Z" fill="${GFC.navy}"/>` : ''}</g>`).join(''), k * 1.1); }
    if (lt > tC) w += gfEmote(lt, tC, 1420, 760, 'q', { hold: 3 });
    return h + qCam([960, 540, 1], w);
  }
  if (ph === 3) { // 댓글로 들려주세요: 빈칸 카드
    let w = gfFull('url(#gyNavy)') + gfRays(t, 960, 400, 900, GFC.sun, 14, 0.08, 8);
    w += fkAt(960, 430, gfPanel(1100, 300, { r: 44, head: '나의 선택', headBg: GFC.sun }) + gfT(0, -10, '나는 ＿＿＿ 를 고르겠다', 70, GFC.navy) + gfT(0, 80, '왜냐하면 ＿＿＿', 46, '#6B7280', { wt: 800 }), gfIn(lt, 0.05, 3, 0.45));
    w += fkAt(960, 760, gfChip('댓글로 들려주세요', { size: 46, icon: 'letter', bg: '#fff' }), gfIn(lt, 0.5, 3.2, 0.45));
    return h + qCam([960, 540, 1], w);
  }
  // e5: 책상 위 AI 안경 옆 몽당연필(첫 장면의 그 연필), 따뜻하게
  let w = gfFull('#FFE9C8') + `<rect x="-600" y="-600" width="3120" height="2280" fill="url(#gfDots)" opacity=".5"/>` + `<ellipse cx="960" cy="560" rx="900" ry="600" fill="url(#gfGlow)" opacity=".7"/>`;
  w += `<path d="M-200 640 L2120 640 L2300 1300 L-380 1300 Z" fill="#E7C89A" stroke="${INK}" stroke-width="8"/><path d="M-200 640 L2120 640" stroke="#C99E66" stroke-width="14"/>`;
  w += fkAt(780, 700, gyGlasses(0, t), 2.2, -6) + fkAt(1220, 720, `<g transform="rotate(62)">${GY_PENCIL}</g>`, 4.2) + fkAt(1220, 880, `<ellipse rx="160" ry="20" fill="${GFC.navy}" opacity=".15"/>`, 1);
  w += fkAt(1220, 520, gfChip('첫 장면의 그 연필', { size: 36, bg: '#fff' }), gfIn(lt, 0.8, 3.2, 0.45), 3);
  return h + qCam(camLerp(lt / D, [960, 600, 1.0], [1000, 640, 1.1]), w);
};
