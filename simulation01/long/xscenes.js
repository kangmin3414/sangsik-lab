/* 시뮬레이션 편 v2 — 샘플(o0~r4). 연출 기준 v3(zw/APPLY_v3_메모.md): z표정 23종, 소라 = zGirl 포니테일, 깜짝 7단계, 리액션 컷, 줌 펀치, 기호.
   sscenes.js / sscenes2.js의 sm 도구(배경 판, 회색 격자, 방, 분식집, 게임 마을, 휴대폰…)를 그대로 쓴다. 이름은 모두 x 접두사. */
['xopen', 'xgreet', 'xtitle', 'xdoubt', 'xnight', 'xworlds', 'xthree', 'xtest'].forEach(k => CAMS[k] = 'fixed');

/* ---------- characters ---------- */
const xEx = k => ({ expr: k, prev: k, k: 1, blink: 0 });
const xZero = (t, o) => HALO(char(Object.assign({ goggles: 'none', vest: SM_ORANGE, patch: false, tee: true, vshade: 'rgba(150,60,0,0.22)', hoodie: 'rgba(120,40,0,0.18)', seed: 61, t }, o)));
const xSora = (t, o) => zGirl(Object.assign({ hairStyle: 'pony', hairArgs: [GH.choco, '#FF8FB1'], top: '#9FDCC4', vshade: 'rgba(0,90,60,0.16)', dress: '#F4B9CB', seed: 71, t }, o));
// talking face for the line's own speaker only
const xTalk = (a, who, base, t) => { const key = '_x' + who; E[key] = qTalk(base, a._v === who ? env(t) : 0); return xEx(key); };
// v3 acting helpers
const xJump = (lt, t0, h = 1) => {   // 깜짝 7단계 (22f)
  const f = (lt - t0) * 24, K = [[0, 1, 1, 0], [4, 1.06, 0.9, 0], [7, 0.92, 1.14, -70], [10, 0.97, 1.05, -96], [13, 1.08, 0.88, 0], [16, 0.98, 1.04, 0], [22, 1, 1, 0]];
  if (f <= 0) return { sx: 1, sy: 1, dy: 0, ph: 0 };
  for (let i = 0; i < K.length - 1; i++) { const A = K[i], B = K[i + 1]; if (f < B[0]) { const k = i === 3 ? easeIn((f - A[0]) / (B[0] - A[0])) : easeInOut((f - A[0]) / (B[0] - A[0])); return { sx: lerp(A[1], B[1], k), sy: lerp(A[2], B[2], k), dy: lerp(A[3], B[3], k) * h, ph: i + 1 }; } }
  return { sx: 1, sy: 1, dy: 0, ph: 7 };
};
const xJumpPose = ph => ph <= 1 ? '웅크림' : ph <= 4 ? '만세' : '서기';
const xPop = (lt, tk) => lt > tk ? 1 + 0.06 * Math.sin(clamp((lt - tk) / 0.22, 0, 1) * Math.PI) : 1;      // head pops on a happy/surprised change
const xPunch = (lt, tk) => lt < tk ? 0 : lt - tk < 0.05 ? (lt - tk) / 0.05 : Math.max(0, 1 - (lt - tk - 0.05) / 0.3);   // 8% zoom punch
const xIdleLook = (t, seed, amp = 1) => [Math.sin(t * 0.7 + seed) * 0.35 * amp, Math.sin(t * 0.5 + seed * 2) * 0.2 * amp];
const xIdleTilt = (t, seed) => Math.max(0, Math.sin(t * 0.45 + seed)) ** 6 * 7;
const xBang = (t, lt, t0, x, y, txt = '!', col = '#FFE34D', size = 90) => lt > t0 ? fx(t, t - (lt - t0), t + 99, x, y, txt, col, { size }) : '';
// greeting wave used for BOTH greetings — the same function, so the repeat is frame-for-frame identical
P['x인사'] = Object.assign({}, P['서기'], { armR: [[252, 285], [302, 245], [320, 180]], hR: [322, 170] });
const xGreetPose = l => { const w = Math.sin(clamp(l, 0, 9) * 12) * 0.5 + 0.5; return mixPose('서기', mixPose('손인사', 'x인사', w), clamp(l / 0.15, 0, 1)); };
const xGreetTilt = l => 9 * Math.sin(clamp((l - 0.15) / 0.35, 0, 1) * Math.PI / 2);
// a game-like dialogue box (NPC)
const xDialog = (x, y, name, text, n, k = 1) => {
  if (k <= 0) return '';
  const chars = [...text], shown = chars.slice(0, Math.max(0, Math.min(chars.length, n))).join(''), w = Math.max(420, chars.length * 44 + 80);
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(easeOutBack(clamp(k, 0, 1)) * 1000) / 1000})"><rect x="${-w / 2}" y="-58" width="${w}" height="116" rx="18" fill="#141A2C" opacity=".93" stroke="#F4F6FB" stroke-width="6"/>` +
    `<rect x="${-w / 2 + 18}" y="-84" width="${name.length * 34 + 40}" height="46" rx="12" fill="#FF8FB1" stroke="#F4F6FB" stroke-width="5"/><text x="${-w / 2 + 38}" y="-50" font-family="${FONT}" font-weight="900" font-size="30" fill="#141A2C">${esc(name)}</text>` +
    `<text x="${-w / 2 + 36}" y="14" font-family="${FONT}" font-weight="900" font-size="40" fill="#fff">${esc(shown)}</text>` + (n >= chars.length ? `<path d="M${w / 2 - 40} 22 l14 0 l-7 10 z" fill="#fff"/>` : '') + `</g>`;
};
const xPhone = (x, y, s, o = {}) => {   // phone with a wide notification bubble
  const lit = o.lit || 0, rot = o.rot || 0;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><rect x="-80" y="-150" width="160" height="300" rx="24" fill="#20232A" stroke="${INK}" stroke-width="7"/><rect x="-68" y="-134" width="136" height="268" rx="14" fill="${lit ? '#2E4A6E' : '#0E1015'}"/>`;
  if (lit && o.msg) h += `<g opacity="${f1(lit * 100) / 100}"><rect x="-66" y="-96" width="132" height="${o.msg2 ? 92 : 70}" rx="12" fill="#fff"/><circle cx="-44" cy="-76" r="9" fill="#FF8FB1"/><text x="-30" y="-70" font-family="${FONT}" font-weight="900" font-size="15" fill="#8A93A6">${esc(o.from || '소라')}</text>` +
    `<text x="-56" y="-44" font-family="${FONT}" font-weight="900" font-size="14" fill="${INK}">${esc(o.msg)}</text>${o.msg2 ? `<text x="-52" y="-20" font-family="${FONT}" font-weight="900" font-size="17" fill="${INK}">${esc(o.msg2)}</text>` : ''}</g>`;
  return h + `</g>`;
};
const xBill = (x, y, s, rot) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><rect x="-70" y="-32" width="140" height="64" rx="6" fill="#B9DDB0" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="0" r="18" fill="none" stroke="#5E8A56" stroke-width="5"/><text x="-56" y="-12" font-family="${FONT}" font-weight="900" font-size="16" fill="#5E8A56">10000</text></g>`;
const xCam = (cam, lt, tk) => [cam[0], cam[1], cam[2] * (1 + 0.08 * xPunch(lt, tk))];

/* ================= o0~o2: the little game (night) ================= */
/* pixel sprites: the GAME versions of Zero and Sora — only their features (orange hood / brown ponytail), not the same people */
Object.assign(QBG, { village_px: 'ai/village_px.png' });
const XPX = 12;   // one pixel cell = 12 game units
function xSprite(kind, o = {}) {
  const C = new Map(), set = (x, y, c) => C.set(x + ',' + y, c), has = (x, y) => C.has(x + ',' + y);
  const f = o.frame || 'stand', cr = f === 'crouch' ? 3 : 0, HY = -16 + cr, lk = Math.round(clamp(o.look || 0, -1, 1));
  const shirt = o.shirt || (kind === 'zero' ? '#F28C38' : kind === 'sora' ? '#9FDCC4' : '#8CCB9B'), shoe = '#FFFFFF', DK = '#1E1E26';
  // legs + shoes
  const L = { stand: [[-2, 0], [2, 0]], walk1: [[-3, 0], [2, -1]], walk2: [[-2, -1], [3, 0]], crouch: [[-3, 0], [3, 0]] }[f] || [[-2, 0], [2, 0]];
  L.forEach(([lx, ly]) => { for (let y = -4 + cr; y < ly; y++) set(lx, y, DK); set(lx, ly, shoe); set(lx + (lx < 0 ? -1 : 1), ly, shoe); });
  // body (+ skirt for Sora)
  const bTop = -9 + cr, bBot = kind === 'sora' ? -6 + cr : -5 + cr;
  for (let y = bTop; y <= bBot; y++) for (let x = -3; x <= 3; x++) set(x, y, shirt);
  if (kind === 'sora') for (let y = bBot + 1; y <= bBot + 2; y++) for (let x = -4; x <= 4; x++) set(x, y, o.skirt || '#F4B9CB');
  if (kind === 'zero') { for (let x = -1; x <= 1; x++) set(x, bBot - 1, '#D9762A'); set(-1, bTop + 1, '#FFF1E0'); set(1, bTop + 1, '#FFF1E0'); for (let x = -4; x <= 4; x++) set(x, bTop - 1, '#E07A2C'); }
  // arms (+ wave)
  const armL = f === 'crouch' ? [[-4, bTop + 1], [-5, bTop + 2], [-5, bTop + 3]] : [[-4, bTop + 1], [-4, bTop + 2], [-5, bTop + 3]];
  const armR = f === 'wave1' ? [[4, bTop], [5, bTop - 1], [5, bTop - 2], [6, bTop - 3]] : f === 'wave2' ? [[4, bTop], [5, bTop - 1], [6, bTop - 2], [7, bTop - 3]] : f === 'write' ? [[4, bTop + 1], [5, bTop + 2], [6, bTop + 3]] : [[4, bTop + 1], [4, bTop + 2], [5, bTop + 3]];
  armL.forEach(([x, y]) => set(x, y, DK)); armR.forEach(([x, y]) => set(x, y, DK));
  const hl = armL[armL.length - 1], hr = armR[armR.length - 1]; set(hl[0], hl[1] + 1, '#FFFFFF'); set(hr[0] + (f.startsWith('wave') ? 0 : 0), hr[1] + (f.startsWith('wave') ? -1 : 1), '#FFFFFF');
  // head
  for (let dy = -5; dy <= 5; dy++) for (let dx = -5; dx <= 5; dx++) if (dx * dx + dy * dy <= 27) set(dx, HY + dy, '#FFFFFF');
  if (kind === 'sora' || o.hair) {   // hair cap + bangs + side hair
    const hc = o.hair || '#6A4232';
    for (let dy = -5; dy <= -2; dy++) for (let dx = -5; dx <= 5; dx++) if (dx * dx + dy * dy <= 27) set(dx, HY + dy, hc);
    [-4, -3, 1, 2, 3].forEach(x => set(x, HY - 1, hc)); [[-5, 0], [-5, 1], [5, 0], [5, 1]].forEach(([x, y]) => set(x, HY + y, hc));
    if (kind === 'sora') { const sw = Math.round(Math.sin((o.t || 0) * 6) * 0.7); [[6, -4], [7, -3], [7, -2], [7 + sw, -1], [7 + sw, 0], [6 + sw, 1]].forEach(([x, y]) => set(x, HY + y, hc)); set(5, HY - 4, '#FF8FB1'); set(6, HY - 5, '#FF8FB1'); }
  }
  // face
  const ey = o.blink ? [HY + 1] : [HY, HY + 1];
  ey.forEach(y => { set(-2 + lk, y, DK); set(2 + lk, y, DK); });
  set(-3 + lk, HY + 2, '#FF9BB0'); set(3 + lk, HY + 2, '#FF9BB0');
  if (o.mouth === 'o') { set(lk, HY + 3, '#5A1E2A'); set(lk, HY + 4, '#5A1E2A'); } else if (o.mouth === 'sad') { set(-1 + lk, HY + 4, DK); set(lk, HY + 3, DK); set(1 + lk, HY + 4, DK); } else { set(-1 + lk, HY + 3, DK); set(lk, HY + 4, DK); set(1 + lk, HY + 3, DK); }
  if (o.sweat) set(5, HY - 3, '#8FD3FF');
  // outline: every empty neighbour of a filled cell
  const out = [];
  C.forEach((c, k) => { const [x, y] = k.split(',').map(Number); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { if (!has(x + a, y + b)) out.push([x + a, y + b]); }); });
  out.forEach(([x, y]) => { if (!has(x, y)) set(x, y, '#141418'); });
  const s = o.s || 1, fl = o.flip ? -1 : 1;
  let h = `<g transform="translate(${f1(o.x)} ${f1(o.y)}) rotate(${f1(o.tilt || 0)}) scale(${f1(fl * s * XPX * 1000) / 1000} ${f1(s * XPX * 1000) / 1000})" shape-rendering="crispEdges">`;
  C.forEach((c, k) => { const [x, y] = k.split(','); h += `<rect x="${+x - 0.5}" y="${+y - 0.5}" width="1.02" height="1.02" fill="${c}"/>`; });
  return h + `</g>`;
}
const xWalkF = (t, sp = 6) => Math.floor(t * sp) % 2 ? 'walk1' : 'walk2';
// the game world: pixel village + pixel villagers (+ actors)
function xGameWorld(t, cam, o = {}) {
  const sat = o.sat == null ? 1 : o.sat;
  let h = smFx('xgsat', sat) + smPlate('village_px', cam, 1.0, { filter: 'xgsat' });
  if (o.wireX != null) h += smWire('village_px', cam, 1.0, o.wireX);
  let ch = '';
  const NPC = [['#F2C14E', null], ['#E2574C', '#2E2A33'], ['#C08AE0', '#B7793E'], ['#F08FB0', null], ['#7FB0E8', '#2E3550']];
  NPC.forEach(([shirt, hair], i) => {
    const sp = 0.1 + hash(i * 3.3) * 0.07, u = (t * sp + hash(i * 7.1)) % 1, dir = u < 0.5 ? 1 : -1, xx = 140 + (u < 0.5 ? u * 2 : (1 - u) * 2) * 1640 + i * 25;
    if (o.keep && o.keep.some(k => Math.abs(xx - k) < 150)) return;
    const y = SMGY - 10 + (i % 3) * 18;
    ch += `<ellipse cx="${f1(xx)}" cy="${y + 4}" rx="44" ry="9" fill="#5A4022" opacity=".25"/>` + xSprite('npc', { x: xx, y, s: 0.75, frame: xWalkF(t + i * 0.3), flip: dir < 0, shirt, hair, look: dir, t });
  });
  h += qCam(cam, (o.under || '') + ch + (o.actors || '') + (o.over || ''));
  if (o.glitch) h += smGlitch(t, o.glitch, 11);
  return h;
}
const XGX = 860, XGS = 1080;   // pixel Zero / pixel Sora in the game
function xGame(t, l, o = {}) {
  const sh = (x) => `<ellipse cx="${x}" cy="${SMGY + 34}" rx="54" ry="11" fill="#5A4022" opacity=".28"/>`;
  const wf = o.wave ? (Math.floor(o.wave * 6) % 2 ? 'wave1' : 'wave2') : 'stand';
  const actors = sh(XGX) + xSprite('zero', { x: XGX, y: SMGY + 30, s: 0.95, look: 1, blink: (t % 3.1) < 0.12, t }) + sh(XGS) + xSprite('sora', { x: XGS, y: SMGY + 30, s: 0.95, frame: wf, look: -1, flip: false, blink: (t % 2.7) < 0.12, t });
  const over = (o.dialog ? xDialog(XGS + 20, SMGY - 330, '소라', '오늘도 살아 있냐?', o.dialog, 1) : '') + (o.over || '');
  return xGameWorld(t, o.cam || [960, 820, 1.25], { keep: [XGX, XGS], actors, over, sat: o.sat });
}
const xGift = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-22" y="-14" width="44" height="34" rx="4" fill="#FF8FB1" stroke="#fff" stroke-width="4"/><rect x="-26" y="-22" width="52" height="12" rx="3" fill="#FF6F96" stroke="#fff" stroke-width="4"/><rect x="-4" y="-22" width="8" height="42" fill="#FFE34D"/><path d="M0 -22 q-18 -16 -20 -4 M0 -22 q18 -16 20 -4" stroke="#FFE34D" stroke-width="5" fill="none"/></g>`;
const xEditor = (txt, n, cur, big = 0) => `<g><rect x="70" y="40" width="${560 + 60 * big}" height="${74 + 24 * big}" rx="14" fill="#0E1626" opacity=".88"/>${xGift(120, 78 + 12 * big, 0.9 + 0.4 * big)}<text x="160" y="${90 + 12 * big}" font-family="${FONT}" font-weight="900" font-size="${34 + 14 * big}" fill="#FFD6E2">소라 생일 선물 · v0.3</text></g>` +
  (txt != null ? `<g><rect x="200" y="860" width="1520" height="150" rx="24" fill="#0E1626" opacity=".92" stroke="#FF8FB1" stroke-width="5"/><text x="240" y="912" font-family="${FONT}" font-weight="900" font-size="34" fill="#FF8FB1">도트 소라 · 인사 대사</text>` +
  `<text x="240" y="978" font-family="${FONT}" font-weight="900" font-size="54" fill="#fff">${esc([...txt].slice(0, n).join(''))}${cur ? '<tspan fill="#FF8FB1">|</tspan>' : ''}</text></g>` : '');
function xopenScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 2;
  if (id === 'o0' && lt < 1.3) {   // wide: night, on the bed, typing on the laptop
    const cam = qLerpCam(lt / 1.3, [SMRX - 80, 760, 1.35], [SMRX - 80, 754, 1.42]), ty = Math.sin(t * 26) * 4;
    let ch = qShadow(SMRX, SMRY, 66) + xZero(t, { x: SMRX, y: SMRY, s: 1.0, pose: smPose('sm랩톱', { hL: [180, 394 + ty], hR: [220, 394 - ty] }), ex: xEx('z기본'), look: [0, 0.6] });
    const lp = ptOf(SMRX, SMRY, 1.0, 200, 400); ch += smLapBack(lp[0], lp[1] + 6, 0.95, 1) + `<circle cx="${SMRX}" cy="${SMRY - 400}" r="150" fill="#9FD8FF" opacity=".16" filter="url(#qfg)"/>`;
    return smDefs() + smRoom(t, cam, { sat: 0.9, night: 1, plant: { droop: 0, green: 1 } }) + qCam(cam, ch);
  }
  if (id === 'o0' || id === 'oN') {   // the screen: the pixel village he is making for Sora's birthday
    const k = id === 'o0' ? lt - 1.3 : lt + 1.3, w = lerp(1380, 1520, clamp(k / (D + 1.3), 0, 1)), big = id === 'oN' ? easeOutBack(clamp((lt - 0.3) / 0.4, 0, 1)) * Math.max(0, 1 - Math.max(0, lt - D + 0.8) / 0.6) : 0;
    return smDefs() + smFull('#0A0E1C') + smLapScreen(960, 500, w, xGame(t, k) + xEditor(null, 0, false, big)) + `<circle cx="960" cy="500" r="760" fill="#9FD8FF" opacity=".05" filter="url(#qfg)"/>`;
  }
  if (id === 'o1') {   // he types Sora's real greeting into the tiny Sora: CU (talking) → the screen (typing)
    const tT = smAt(a, '이렇게', 0.45 * D);
    if (lt < tT - 0.1) {
      const cam = qLerpCam(lt / tT, [SMRX, 700, 2.1], [SMRX, 696, 2.2]);
      let ch = qShadow(SMRX, SMRY, 66) + xZero(t, { x: SMRX, y: SMRY, s: 1.0, pose: 'sm랩톱', ex: xTalk(a, 'Z', 'z설렘', t), look: [0, 0.5], tilt: 3 });
      const lp = ptOf(SMRX, SMRY, 1.0, 200, 400); ch += smLapBack(lp[0], lp[1] + 6, 0.95, 1) + `<circle cx="${SMRX}" cy="${SMRY - 400}" r="150" fill="#9FD8FF" opacity=".16" filter="url(#qfg)"/>`;
      return smDefs() + smRoom(t, cam, { sat: 0.9, night: 1, blur: true, depth: 0.3 }) + qCam(cam, ch);
    }
    const n = Math.floor(clamp((lt - tT) / Math.max(0.6, D - tT - 0.1), 0, 1) * 10);
    return smDefs() + smFull('#0A0E1C') + smLapScreen(960, 500, 1500, xGame(t, lt) + xEditor('오늘도 살아 있냐?', n, Math.floor(t * 2.5) % 2 === 0));
  }
  // o2 "똑같네." — the tiny Sora waves and says it (dialog box), then Zero's soft laugh
  const tL = 0.25;
  if (lt < D * 0.55) return smDefs() + smFull('#0A0E1C') + smLapScreen(960, 500, 1500, xGame(t, lt, { wave: lt + 0.2, dialog: Math.floor((lt + 0.2) * 22) }) + xEditor(null));
  const cam = qLerpCam(lt / D, [SMRX, 700, 2.15], [SMRX, 694, 2.25]), lau = Math.abs(Math.sin((lt - D * 0.55) * 10)) * Math.exp(-(lt - D * 0.55) * 2);
  let ch = qShadow(SMRX, SMRY, 66) + xZero(t, { x: SMRX, y: SMRY - 4 * lau, s: 1.0, sy: 1 + 0.04 * lau, pose: 'sm랩톱', ex: exprAt([[0, 'z히죽'], [D * 0.55 + 0.1, 'z빵긋']], lt), look: [0, 0.5] });
  const lp = ptOf(SMRX, SMRY, 1.0, 200, 400); ch += smLapBack(lp[0], lp[1] + 6, 0.95, 1);
  return smDefs() + smRoom(t, cam, { sat: 0.9, night: 1, blur: true, depth: 0.3 }) + qCam(cam, ch);
}

/* ================= s1, s2, f0, n1, n2: the greeting, twice ================= */
const XZX = 1000, XSX = 1380;   // crosswalk: Zero, Sora (feet on SMY)
const xCupHand = (x, y) => { const hp = ptOf(x, y, 1.0, 248, 318); return smCup(hp[0] + 4, hp[1] + 6, 0.95); };
function xgreetScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 1.5;
  if (id === 's1') {   // wide: Sora trots in from the right, stops, waves; Zero turns and smiles
    const cam = [1180, 760, 1.12], tStop = Math.min(0.75, D * 0.55), u = clamp(lt / tStop, 0, 1), sx = lerp(1980, XSX, easeOut(u));
    const sl = lt - tStop;   // greeting clock (starts when she stops)
    const sp = u < 1 ? walkPose(lt * 13, 0.55) : xGreetPose(sl), stl = u < 1 ? 0 : xGreetTilt(sl);
    let ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY, s: 1.0, sy: xPop(lt, 0.45), pose: mixPose('sm컵', smPose('sm컵', { armL: P['손인사'].armR.map(p => [400 - p[0], p[1]]), hL: [78, 170] }), clamp((lt - 0.6) / 0.3, 0, 1) * 0.6), ex: exprAt([[0, 'z기본'], [0.45, 'z빵긋']], lt), look: [0.9, -0.05] }) + xCupHand(XZX, SMY);
    ch += qShadow(sx, SMY, 66) + flip(sx, xSora(t, { x: sx, y: SMY - (u < 1 ? Math.abs(Math.sin(lt * 13)) * 8 : 0), s: 0.97, pose: sp, tilt: stl, ex: u < 1 ? xEx('z빵긋') : xTalk(a, 'S', 'z빵긋', t), look: [0.9, 0] }));
    return smDefs() + smPlate('cross', cam) + qCam(cam, ch) + smMorning(1);
  }
  if (id === 's2') {   // the exact same greeting again — same tilt, same wave, same voice. Zero's raised hand stops halfway; then his smile drains
    const tR = D * 0.72;
    if (lt < tR) {
      const cam = qLerpCam(lt / tR, [1220, 740, 1.42], [1240, 736, 1.5]);
      let ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY, s: 1.0, still: true, pose: smPose('sm컵', { armL: [[148, 285], [118, 250], [104, 214]], hL: [100, 206] }), ex: exprAt([[0, 'z빵긋'], [0.5, 'z기본']], lt), look: [0.9, -0.05] }) + xCupHand(XZX, SMY);
      ch += qShadow(XSX, SMY, 66) + flip(XSX, xSora(t, { x: XSX, y: SMY, s: 0.97, pose: xGreetPose(lt), tilt: xGreetTilt(lt), ex: xTalk(a, 'S', 'z빵긋', t), look: [0.9, 0] }));
      return smDefs() + smPlate('cross', cam) + qCam(cam, ch) + smMorning(1);
    }
    const k = lt - tR, cam = qLerpCam(k / 1.2, [XZX + 10, 790, 2.3], [XZX + 10, 786, 2.45]);   // reaction CU: the smile fades
    let ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY, s: 1.0, still: true, noBlink: true, pose: smPose('sm컵', { armL: [[148, 285], [118, 250], [104, 214]], hL: [100, 206] }), ex: exprAt([[0, 'z기본'], [0.2, 'z멍']], k), look: [0.8, -0.05] }) + xCupHand(XZX, SMY);
    return smDefs() + smPlate('cross_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.8);
  }
  if (id === 'f0') {   // he whips round: the street behind him is grey grid (치직) → 깜짝 7단계 → 소름
    const cam = [1120, 790, 1.5], tW = 0.25, g0 = tW + 0.06, g1 = g0 + 0.4, tJ = g1 - 0.05, J = xJump(lt, tJ, 0.45);
    const tk = clamp((lt - tW) / 0.14, 0, 1), turned = lt > tW, sxW = turned && tk < 1 ? 1 - 0.38 * Math.sin(tk * Math.PI) : 1;
    const ex = exprAt([[0, 'z멍'], [g0, 'z충격'], [tJ + 0.75, 'z소름']], lt);
    let ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY + J.dy, s: 1.0, sx: sxW * J.sx, sy: J.sy, rot: turned && lt < tJ ? -4 : 0, tilt: turned && lt < tJ ? -7 : 0, pose: lt < tJ ? 'sm컵' : (J.ph >= 2 && J.ph <= 4 ? smPose('만세', { armR: P['sm컵'].armR, hR: P['sm컵'].hR }) : 'sm컵'), ex, look: turned && lt < tJ + 0.6 ? [-1, -0.05] : [0.4, 0.1], still: true }) + xCupHand(XZX, SMY + J.dy);
    ch += qShadow(XSX, SMY, 66) + flip(XSX, xSora(t, { x: XSX, y: SMY, s: 0.97, pose: '서기', tilt: xIdleTilt(t, 2) + 4, ex: xEx('z의심'), look: [0.8, 0] }));
    const head = smScr(cam, XZX, SMY - 390);
    let h = smDefs() + smPlate('cross', cam);
    if (lt > g0 && lt < g1) h += smWire('cross', cam, 0.55, smScr(cam, XZX - 130, 0)[0]) + qCam(cam, ch) + smGlitch(t, (lt - g0) / (g1 - g0) < 0.25 ? 1 : 0.3, 3);
    else h += qCam(cam, ch + (J.ph >= 2 && J.ph <= 4 ? speedLines(XZX, SMY - 420, 230, 360, 14, t, '#fff', 0.7) : ''));
    return h + smWhipArcs(head[0], head[1] + 40, clamp((lt - tW) / 0.3, 0, 1), -1) + smMorning(lt > g0 && lt < g1 ? 0.2 : 1) + xBang(t, lt, tJ + 0.1, head[0] + 170, head[1] - 140, '!!', '#FFE34D', 100);
  }
  if (id === 'n1') {   // CU: frozen with goosebumps; eyes dart; on "가짜" the grid flickers behind him once
    const tF = smAt(a, '가짜', 0.5 * D), tE = smAt(a, '증거', 0.75 * D), cam = qLerpCam(lt / D, [XZX + 30, 800, 2.25], [XZX + 30, 794, 2.4]);
    const dart = Math.floor(lt / 0.8) % 2 ? [0.7, -0.05] : [-0.9, -0.05];
    let ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY, s: 1.0, pose: 'sm컵', tilt: -3, shiver: lt < tE, ex: exprAt([[0, 'z소름'], [tE, 'z당황']], lt), look: dart }) + xCupHand(XZX, SMY);
    let h = smDefs() + smPlate('cross_c', cam, 0.3, { blur: true });
    if (lt > tF && lt < tF + 0.12) h += smWire('cross', cam, 0.3, 99999, { op: 0.6 }) + smGlitch(t, 0.5, 7);
    return h + qCam(cam, ch) + smMorning(0.8);
  }
  // n2: over his shoulder — Sora keeps smiling and waving in a perfect loop; an NPC dialogue box; then Zero looks at us
  const tL = smAt(a, '정해진', 0.2 * D), tRe = smAt(a, '되풀이', 0.35 * D), tYou = smAt(a, '당신', 0.6 * D);
  if (lt < tYou - 0.15) {
    const cam = qLerpCam(lt / tYou, [XSX - 60, 770, 1.75], [XSX - 70, 766, 1.88]);
    const loop = (lt % 1.1);   // the same 1.1-second greeting, over and over
    let ch = qShadow(XSX, SMY, 66) + flip(XSX, xSora(t, { x: XSX, y: SMY, s: 0.97, pose: xGreetPose(loop), tilt: xGreetTilt(loop), ex: xEx('z빵긋'), look: [0.9, 0], still: true }));
    const fx0 = 680 + (cam[0] - 1310) * 0.4;
    const fg = `<g filter="url(#qblur)" opacity=".97"><path d="M${fx0 - 280} 1300 Q${fx0 - 250} 900 ${fx0} 880 Q${fx0 + 260} 900 ${fx0 + 290} 1300 Z" fill="${SM_ORANGE}" stroke="${INK}" stroke-width="10"/><circle cx="${fx0}" cy="700" r="200" fill="#fff" stroke="${INK}" stroke-width="10"/></g>`;
    let h = smDefs() + smPlate('cross_c', [cam[0] - 250, cam[1], cam[2]], 0.35, { blur: true }) + qCam(cam, ch) + qCam([cam[0], cam[1], cam[2] * 1.08], fg) + smMorning(0.8);
    if (lt > tL) { const n = lt > tRe ? Math.floor(((lt - tRe) % 1.1) * 14) : 99; h += xDialog(1180, 250, '소라', '오늘도 살아 있냐?', n, clamp((lt - tL) / 0.25, 0, 1)); }
    return h;
  }
  const k = lt - tYou + 0.15, cam = qLerpCam(k / 3, [XZX, 790, 2.0], [XZX, 780, 2.25]);   // he turns to us
  let ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY, s: 1.0, pose: 'sm컵', ex: exprAt([[0, 'z당황'], [1.0, 'z울먹']], k), look: [0, 0.05] }) + xCupHand(XZX, SMY);
  return smDefs() + smPlate('cross_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.8);
}
/* t0: the title — letterbox + a glitchy title */
function xtitleScene(t, lt, a) {
  const bar = easeOut(clamp(lt / 0.4, 0, 1)), gl = lt < 0.35 ? 1 : (lt > 1.2 && lt < 1.3 ? 0.6 : 0);
  let h = smDefs() + smPlate('cross_c', [XSX - 60, 760, 1.9], 0.35, { blur: true }) + smFull('#0A0E1C', 0.45);
  h += `<rect x="-400" y="-300" width="2800" height="${f1(300 + 120 * bar)}" fill="#000"/><rect x="-400" y="${f1(1214 - 132 * bar)}" width="2800" height="400" fill="#000"/>`;
  const jx = gl ? (hash(Math.floor(t * 24)) - 0.5) * 30 : 0;
  h += `<g transform="translate(${f1(jx)} 0)">` + outlined(960, 520, [[['친구가 ', '#fff'], ['같은 말', '#FF8FB1'], ['을', '#fff']], [['두 번 했다', '#fff']]], { size: 104, sw: 18, lh: 130 }) + `</g>`;
  return h + smGlitch(t, gl, 21);
}

/* ================= n3, p1, z1, n4, p2, z2: suspicion ================= */
function xdoubtScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 2;
  if (id === 'n3') {   // the park: he squints at everything (z의심), eyes hopping
    const zx = 1180, cam = qLerpCam(lt / D, [1080, 740, 1.3], [1060, 736, 1.38]), tS = smAt(a, '의심', 0.7 * D);
    const lk = [[-0.9, 0], [0.8, -0.3], [-0.6, 0.4], [0.9, 0.2]][Math.floor(lt / 0.7) % 4];
    let ch = qShadow(zx, SMPY + 30, 70) + xZero(t, { x: zx, y: SMPY + 30, s: 1.0, sy: xPop(lt, tS), pose: 'sm수첩', ex: exprAt([[0, 'z멍'], [tS, 'z의심']], lt), look: lk, tilt: -5 });
    const hl = ptOf(zx, SMPY + 30, 1.0, 182, 330); ch += smPad(hl[0] + 4, hl[1] + 6, 0.95, -8);
    [[560, 0.0], [700, 0.37], [840, 0.71]].forEach(([px, ph], i) => { const c = (t * 0.9 + ph) % 1, pk = c < 0.25 ? Math.sin(c / 0.25 * Math.PI) : 0; ch += smPigeon(px, SMPY + 50 + i * 6, 0.9, { peck: pk, flip: i === 1 }); });
    return smDefs() + smPlate('park', cam) + qCam(cam, ch) + smMorning(0.7);
  }
  if (id === 'p1') {   // insert: the three pigeons freeze, then tilt at exactly the same frame; a selection box snaps round them
    const cam = [800, 930, 2.1], tF = 0.45, tT = 0.85, tl = lt > tT ? easeOutBack(clamp((lt - tT) / 0.18, 0, 1)) * 26 : 0;
    let ch = ''; [640, 820, 1000].forEach((px, i) => { const c = (t * 0.9 + i * 0.37) % 1, pk = lt > tF ? 0 : (c < 0.25 ? Math.sin(c / 0.25 * Math.PI) : 0); ch += smPigeon(px, SMPY + 6, 0.85, { peck: pk, tilt: -tl }); });
    let h = smDefs() + smPlate('park_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.6);
    if (lt > tT + 0.35) { const p0 = smScr(cam, 560, SMPY - 120), p1 = smScr(cam, 1080, SMPY + 20), s = easeOut(clamp((lt - tT - 0.35) / 0.25, 0, 1)), off = (t * 40) % 24;
      h += `<rect x="${f1(p0[0])}" y="${f1(p0[1])}" width="${f1(p1[0] - p0[0])}" height="${f1(p1[1] - p0[1])}" fill="#3DA9FF" fill-opacity=".08" stroke="#3DA9FF" stroke-width="6" stroke-dasharray="16 8" stroke-dashoffset="${f1(off)}" opacity="${f1(s * 100) / 100}"/>`; }
    return h;
  }
  if (id === 'z1') {   // CU: whispering, the gloom lines come down
    const zx = 1180, cam = qLerpCam(lt / D, [zx, 740, 2.1], [zx, 736, 2.2]), tP = smAt(a, '붙여', 0.6 * D);
    let ch = qShadow(zx, SMPY + 40, 70) + flip(zx, xZero(t, { x: zx, y: SMPY + 40, s: 1.0, pose: 'sm수첩', ex: lt < tP ? xTalk(a, 'Z', 'z멍', t) : xTalk(a, 'Z', 'z소름', t), look: [0.6, 0.35], tilt: -3 }));
    const hl = ptOf(zx, SMPY + 40, 1.0, 182, 330); ch += smPad(2 * zx - hl[0] - 4, hl[1] + 6, 0.95, 8);
    return smDefs() + smPlate('park_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.5);
  }
  if (id === 'n4') {   // the commute: whip, whip — grey grid behind him each time; sweat
    const cam = [XZX + 140, 800, 1.42], W = [smAtAll(a, ['홱', '획', '휙'], [0.3])[0], smAt(a, '그려졌', 0.75 * D) - 0.2], side = [-1, 1];
    let n = 0; W.forEach((w, i) => { if (lt >= w) n = i + 1; });
    const tw = n ? lt - W[n - 1] : 9, tk = clamp(tw / 0.14, 0, 1), dir = n ? side[n - 1] : -1, sx = n && tk < 1 ? 1 - 0.36 * Math.sin(tk * Math.PI) : 1, gl = tw > 0.05 && tw < 0.4;
    let ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY, s: 1.0, sx, rot: dir * 4, tilt: dir * 7, pose: 'sm컵', still: true, ex: exprAt([[0, 'z의심'], [W[0] + 0.05, 'z당황']], lt), look: [n ? dir : 0.3, -0.05] }) + xCupHand(XZX, SMY);
    const head = smScr(cam, XZX, SMY - 390), bx = smScr(cam, XZX + dir * 130, 0)[0];
    let h = smDefs() + smPlate('cross', cam);
    if (gl) { h += dir < 0 ? smWire('cross', cam, 0.55, bx) : `<defs><clipPath id="xrc"><rect x="${f1(bx)}" y="-400" width="3000" height="2000"/></clipPath></defs><g clip-path="url(#xrc)">${smWire('cross', cam, 0.55)}</g>`; h += smGlitch(t, tw < 0.12 ? 0.8 : 0.2, 5); }
    return h + qCam(cam, ch) + smWhipArcs(head[0], head[1] + 40, tw / 0.3, dir) + smMorning(gl ? 0.2 : 1);
  }
  if (id === 'p2') {   // insert: the phone buzzes — 소라: 점심 같이 먹을래?
    const sh = lt < 1.0 ? Math.sin(t * 60) * 5 * (Math.floor(t * 3) % 2) : 0;
    return smDefs() + smPlate('park_c', [900, 700, 2.2], 0.3, { blur: true }) + smFull('#000', 0.15) + xPhone(960 + sh, 520, 2.4, { lit: clamp(lt / 0.2, 0, 1), from: '소라', msg: '점심 같이 먹을래?', rot: -4 }) +
      (lt < 1.0 ? `<path d="M610 380 q-24 30 0 60 M570 360 q-34 50 0 100 M1310 380 q24 30 0 60 M1350 360 q34 50 0 100" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/>` : '') + smMorning(0.6);
  }
  // z2: MCU — he turns the phone face-down; cold
  const zx = 1180, cam = qLerpCam(lt / D, [zx, 740, 1.9], [zx, 734, 2.0]), down = clamp((lt - 0.2) / 0.4, 0, 1);
  let ch = qShadow(zx, SMPY + 40, 70) + flip(zx, xZero(t, { x: zx, y: SMPY + 40, s: 1.0, pose: 'sm폰', ex: xTalk(a, 'Z', down > 0.5 ? 'z멍' : 'z의심', t), look: [0.3, 0.6] }));
  const hp = ptOf(zx, SMPY + 40, 1.0, 230, 312);
  ch += `<g transform="translate(${f1(2 * zx - hp[0] - 6)} ${f1(hp[1] - 4)}) scale(${f1(lerp(1, -1, down) * 100) / 100} 1)">${xPhone(0, 0, 0.36, { lit: down < 0.5 ? 1 : 0, from: '소라', msg: '점심 같이 먹을래?' })}</g>`;
  return smDefs() + smPlate('park_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.5);
}

/* ================= n5, z3 (xnight), n6 (xworlds), n7 (xthree): the search ================= */
function xnightScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3;
  if (id === 'n5') {
    const tY = smAt(a, '2003', smAt(a, '이천', 0.62 * D)), tN = smAt(a, '보스트롬', 0.85 * D);
    if (lt < tY - 0.2) {   // in bed with the phone, face lit; the search being typed
      const cam = qLerpCam(lt / tY, [SMRX - 30, 740, 1.7], [SMRX - 30, 732, 1.85]);
      let ch = qShadow(SMRX, SMRY, 66) + xZero(t, { x: SMRX, y: SMRY, s: 1.0, pose: smPose('sm앉기', { armR: P['sm폰'].armR, hR: P['sm폰'].hR }), ex: exprAt([[0, 'z멍'], [tY - 1.2, 'z의심']], lt), look: [0.2, 0.5] });
      const hp = ptOf(SMRX, SMRY, 1.0, 230, 312); ch += xPhone(hp[0] + 6, hp[1] - 4, 0.36, { lit: 1 }) + `<circle cx="${SMRX}" cy="${SMRY - 380}" r="130" fill="#9FD8FF" opacity=".15" filter="url(#qfg)"/>`;
      let h = smDefs() + smRoom(t, cam, { sat: 0.75, night: 1, plant: { droop: 0.1, green: 0.95 } }) + qCam(cam, ch);
      const q = '세상이 가짜일 확률', n = Math.floor(clamp((lt - 0.3) / 1.6, 0, 1) * q.length);
      h += `<g transform="translate(560 200)"><rect x="0" y="0" width="800" height="100" rx="50" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="60" cy="50" r="20" fill="none" stroke="#8A93A6" stroke-width="7"/><path d="M74 64 L92 82" stroke="#8A93A6" stroke-width="7" stroke-linecap="round"/><text x="110" y="66" font-family="${FONT}" font-weight="900" font-size="44" fill="${INK}">${esc(q.slice(0, n))}${Math.floor(t * 2.5) % 2 ? '|' : ''}</text></g>`;
      return h;
    }
    const k = lt - tY + 0.2;   // the result card on the phone screen, and his name
    let h = smDefs() + smRoom(t, [SMRX, 700, 2.6], { sat: 0.6, night: 1, blur: true, depth: 0.3 }) + smFull('#0B1230', 0.25);
    h += `<g transform="translate(960 ${f1(520 - 30 * (1 - easeOut(clamp(k / 0.4, 0, 1))))})"><rect x="-520" y="-300" width="1040" height="600" rx="30" fill="#20232A" stroke="${INK}" stroke-width="8"/><rect x="-490" y="-270" width="980" height="540" rx="18" fill="#F4F6FA"/>` +
      `<text x="-450" y="-180" font-family="${FONT}" font-weight="700" font-size="30" fill="#3E6FB0">philpapers.org › bostrom2003</text><text x="-450" y="-110" font-family="${FONT}" font-weight="900" font-size="52" fill="#1A3E8C">Are You Living in a Computer</text><text x="-450" y="-50" font-family="${FONT}" font-weight="900" font-size="52" fill="#1A3E8C">Simulation?</text>` +
      `<text x="-450" y="20" font-family="${FONT}" font-weight="700" font-size="34" fill="#5A606C">Nick Bostrom · The Philosophical Quarterly · 2003</text>`;
    for (let i = 0; i < 3; i++) h += `<rect x="-450" y="${70 + i * 46}" width="${860 - i * 160}" height="20" rx="10" fill="#D5DCE6"/>`;
    h += `</g><circle cx="960" cy="520" r="700" fill="#9FD8FF" opacity=".06" filter="url(#qfg)"/>`;
    if (lt > tN) h += pop(t, t - (lt - tN), t + 99, 960, 930, label(0, 0, '닉 보스트롬 · 옥스퍼드대 철학자', { size: 40, bg: YEL }), { rot: -2 });
    return h;
  }
  // z3: CU — he looks at his own little world on the laptop… then the screen inside the screen inside the screen
  const tM = smAt(a, '만들었', 0.6 * D);
  if (lt < tM - 0.1) {
    const cam = qLerpCam(lt / tM, [SMRX, 690, 2.25], [SMRX, 684, 2.4]);
    let ch = qShadow(SMRX, SMRY, 66) + xZero(t, { x: SMRX, y: SMRY, s: 1.0, pose: 'sm랩톱', ex: xTalk(a, 'Z', 'z멍', t), look: [0, 0.5] });
    const lp = ptOf(SMRX, SMRY, 1.0, 200, 400); ch += smLapBack(lp[0], lp[1] + 6, 0.95, 1) + `<circle cx="${SMRX}" cy="${SMRY - 400}" r="150" fill="#9FD8FF" opacity=".16" filter="url(#qfg)"/>`;
    return smDefs() + smRoom(t, cam, { sat: 0.6, night: 1, blur: true, depth: 0.3 }) + qCam(cam, ch);
  }
  const k = lt - tM + 0.1, z = Math.pow(1.6, clamp(k / 1.6, 0, 1.6));   // recursion: screens inside screens, sliding in
  let inner = xGame(t, k), w = 1500;
  for (let i = 0; i < 3; i++) inner = xGame(t, k) + `<g opacity=".97">${smLapScreen(960, 520, 640, inner, { base: true })}</g>`;
  return smDefs() + smFull('#0A0E1C') + `<g transform="translate(960 520) scale(${f1(z * 1000) / 1000}) translate(-960 -520)">${smLapScreen(960, 500, w, inner)}</g>` + `<circle cx="960" cy="500" r="760" fill="#9FD8FF" opacity=".06" filter="url(#qfg)"/>`;
}
function xworldsScene(t, lt, a) { return sbostromScene(t, lt, Object.assign({}, a, { _id: 'b2' })); }
function xthreeScene(t, lt, a) { return sbostrom2Scene(t, lt, a); }

/* ================= n8 ~ r4: the test at the bunsik ================= */
const xFront = cam => smPlateFront('bunsik', cam, 0.55, SMBEDGE);
const xSoraSeat = (t, o) => xSora(t, Object.assign({ x: SMBF, y: SMBY, s: 1.0, pose: '서기', look: [-0.8, 0.15] }, o));
const xZeroSeat = (t, o) => xZero(t, Object.assign({ x: SMBX, y: SMBY, s: 1.0, pose: '서기', look: [0.8, 0.1] }, o));
P['x포크'] = smPose('서기', { armL: [[148, 285], [128, 330], [150, 372]], hL: [156, 376] });   // her hand resting by the plate
function xtestScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 2, pan = cam => qCam(cam, smPan(960, 960, 1.0, t));
  if (id === 'n8') {
    const tC = smAt(a, '확인', 0.25 * D), tL = smAt(a, '정해진', 0.45 * D);
    if (lt < tL - 0.1) {   // wide: Sora already there, waving; Zero sits down — and sets his jaw (z결심, flame eyes)
      const cam = qLerpCam(lt / tL, [960, 720, 1.18], [960, 714, 1.24]), sit = clamp(lt / 0.6, 0, 1);
      let ch = xZeroSeat(t, { y: SMBY - 120 * (1 - easeOut(sit)), sy: xPop(lt, tC), ex: exprAt([[0, 'z기본'], [tC, 'z결심']], lt), look: [0.8, 0.05] });
      ch += xSoraSeat(t, { pose: lt < 1.6 ? xGreetPose(lt) : 'x포크', tilt: lt < 1.6 ? xGreetTilt(lt) : xIdleTilt(t, 3), ex: xEx('z빵긋'), look: xIdleLook(t, 4).map((v, i) => i ? v : v - 0.6) });
      return smDefs() + smPlate('bunsik', cam, 0.55) + qCam(cam, ch) + xFront(cam) + pan(cam) + warm(0.45);
    }
    // insert: his notepad under the table — "NPC 판별 질문" being written
    const k = lt - tL + 0.1, items = ['① 우리 처음 만난 날?', '② 내 생일은?', '③ 지금 무슨 생각?'];
    let h = smDefs() + smPlate('bunsik', [700, 1000, 2.6], 0.3, { blur: true }) + smFull('#000', 0.25) + `<g transform="translate(960 540) rotate(-5)"><rect x="-380" y="-330" width="760" height="660" rx="20" fill="#FFF8E2" stroke="${INK}" stroke-width="9"/><rect x="-380" y="-330" width="760" height="80" rx="18" fill="#E2574C" stroke="${INK}" stroke-width="7"/>` +
      `<text x="-330" y="-180" font-family="${FONT}" font-weight="900" font-size="58" fill="${INK}">NPC 판별 질문</text>`;
    items.forEach((s, i) => { const n = Math.floor(clamp((k - i * 0.9) / 0.8, 0, 1) * [...s].length); h += `<text x="-330" y="${-70 + i * 110}" font-family="${FONT}" font-weight="900" font-size="50" fill="#2B3445">${esc([...s].slice(0, n).join(''))}</text>`; });
    return h + `</g>` + warm(0.3);
  }
  if (id === 'z4') {   // MCU Zero, leaning in, casual on purpose (z히죽), eyes cold
    const cam = qLerpCam(lt / D, [SMBX + 120, 700, 1.75], [SMBX + 120, 694, 1.85]);
    let ch = xZeroSeat(t, { rot: 5, ex: xTalk(a, 'Z', lt < 0.8 ? 'z결심' : 'z히죽', t) }) + xSoraSeat(t, { pose: 'x포크', ex: xEx('z기본'), look: [-0.8, 0.1] });
    return smDefs() + smPlate('bunsik', cam, 0.45) + qCam(cam, ch) + xFront(cam) + pan(cam) + warm(0.4);
  }
  if (id === 's3') {   // CU Sora: puzzled → worried → a little hurt
    const t1 = smAt(a, '사흘', 0.35 * D), t2 = smAt(a, '불렀', 0.8 * D), cam = qLerpCam(lt / D, [SMBF - 30, 690, 2.05], [SMBF - 30, 684, 2.15]);
    const base = lt < t1 ? 'z의심' : lt < t2 ? 'z울먹' : 'z삐짐';
    let ch = xSoraSeat(t, { pose: 'x포크', ex: xTalk(a, 'S', base, t), tilt: lt < t1 ? 6 : 0, look: [-0.7, lt < t1 ? -0.1 : 0.15] });
    return smDefs() + smPlate('bunsik', cam, 0.4, { blur: true }) + qCam(cam, ch) + xFront(cam) + warm(0.45);
  }
  if (id === 'r1') {   // reaction: Zero just stares — slow push, no blink
    const cam = qLerpCam(lt / D, [SMBX + 20, 690, 2.1], [SMBX + 20, 680, 2.4]);
    let ch = xZeroSeat(t, { still: true, noBlink: true, ex: xEx('z멍'), look: [0.85, 0] });
    return smDefs() + smPlate('bunsik', cam, 0.4, { blur: true }) + qCam(cam, ch) + xFront(cam) + smFull('#000', 0.08) + warm(0.25);
  }
  if (id === 'z5') {   // CU: "넌 진짜야?" — zoom punch on 진짜, the warmth drains
    const tR = smAt(a, '진짜', 0.2 * D), tL = smAt(a, '정해진', 0.6 * D), cam = xCam(qLerpCam(lt / D, [SMBX + 20, 690, 2.3], [SMBX + 20, 684, 2.4]), lt, tR);
    let ch = xZeroSeat(t, { ex: xTalk(a, 'Z', lt < tL ? 'z결심' : 'z의심', t), look: [0.85, 0], tilt: lt > tL ? -6 : 0 });
    return smDefs() + smPlate('bunsik', cam, 0.4, { blur: true }) + qCam(cam, ch) + xFront(cam) + smFull('#0A1030', 0.12 * clamp(lt / D, 0, 1)) + warm(0.2);
  }
  if (id === 'r2') {   // reaction: Sora freezes (z충격, gloom) → eyes fill; the fork goes down on the table
    const cam = qLerpCam(lt / D, [SMBF - 30, 690, 2.15], [SMBF - 30, 684, 2.3]), drop = clamp((lt - 0.5) / 0.3, 0, 1);
    let ch = xSoraSeat(t, { still: true, pose: mixPose('x포크', smPose('x포크', { hL: [170, 400], armL: [[148, 285], [134, 340], [168, 398]] }), drop), ex: exprAt([[0, 'z충격'], [0.75, 'z울먹']], lt), look: [-0.85, 0.05] });
    return smDefs() + smPlate('bunsik', cam, 0.4, { blur: true }) + qCam(cam, ch) + xFront(cam) + smFull('#0A1030', 0.1);
  }
  if (id === 's4') {   // CU Sora: "…그게 할 말이야?" — a tear forms
    const cam = qLerpCam(lt / D, [SMBF - 30, 690, 2.25], [SMBF - 30, 686, 2.35]);
    let ch = xSoraSeat(t, { pose: smPose('x포크', { hL: [170, 400], armL: [[148, 285], [134, 340], [168, 398]] }), ex: xTalk(a, 'S', 'z울먹', t), look: [-0.85, 0.1], tilt: -4 });
    const hd = smScr(cam, SMBF - 18, SMBY - 340), tk = clamp((lt - 0.6) / 0.8, 0, 1);
    return smDefs() + smPlate('bunsik', cam, 0.4, { blur: true }) + qCam(cam, ch) + xFront(cam) + (tk > 0 ? `<path d="M${f1(hd[0])} ${f1(hd[1] + 60 * tk)} q-12 18 0 26 q12 -8 0 -26" fill="#8FD3FF" stroke="${INK}" stroke-width="4" opacity="${f1(Math.min(1, tk * 3) * 100) / 100}"/>` : '') + smFull('#0A1030', 0.1);
  }
  if (id === 'r3') {   // wide: she gets up, leaves a bill on the table, walks out; he watches her go
    const cam = [960, 720, 1.18], up = clamp(lt / 0.4, 0, 1), go = clamp((lt - 0.7) / 1.6, 0, 1), sx = lerp(SMBF, 2250, easeIn(go));
    let ch = xZeroSeat(t, { ex: exprAt([[0, 'z멍'], [0.9, 'z당황']], lt), look: [0.9, lt > 0.9 ? -0.1 : 0.05] });
    ch += qShadow(sx, SMBY + 30, 60) + xSora(t, { x: sx, y: SMBY - 90 * easeOut(up), s: 1.0, pose: go > 0 ? walkPose(lt * 8, 0.6) : '서기', ex: xEx('z삐짐'), look: [0.9, 0.2] });
    let h = smDefs() + smPlate('bunsik', cam, 0.55) + qCam(cam, ch) + xFront(cam) + pan(cam);
    if (lt > 0.45) h += qCam(cam, xBill(1200, 945, 1.0, -12));
    return h + warm(0.3) + smFull('#0A1030', 0.12);
  }
  if (id === 'z6') {   // CU: alone — "NPC면… 상처도 안 받겠지." the mouth trembles at the end
    const tH = smAt(a, '상처', 0.5 * D), cam = qLerpCam(lt / D, [SMBX + 20, 690, 2.2], [SMBX + 20, 682, 2.35]);
    let ch = xZeroSeat(t, { ex: xTalk(a, 'Z', lt < tH ? 'z멍' : 'z울먹', t), look: [0.6, 0.4], tilt: 4 });
    return smDefs() + smPlate('bunsik', cam, 0.4, { blur: true }) + qCam(cam, ch) + xFront(cam) + qCam(cam, xBill(1200, 945, 1.0, -12)) + smFull('#0A1030', 0.15);
  }
  // r4: insert — his hand reaches for the fork and shakes; her empty seat and the bill, steam still rising
  const sh = Math.sin(t * 45) * 6, reach = easeOut(clamp(lt / 0.8, 0, 1));
  let h = smDefs() + smPlate('bunsik', [1000, 900, 2.0], 0.3, { blur: true }) + smFull('#000', 0.15) + smPan(980, 640, 2.4, t) + xBill(1500, 820, 2.0, -12);
  h += `<g transform="translate(${f1(sh)} ${f1(sh * 0.3)})"><path d="M-100 1300 Q200 1000 ${f1(lerp(420, 640, reach))} ${f1(lerp(860, 760, reach))}" stroke="${INK}" stroke-width="150" stroke-linecap="round" fill="none"/><path d="M-100 1300 Q200 1000 ${f1(lerp(420, 640, reach))} ${f1(lerp(860, 760, reach))}" stroke="${SM_ORANGE}" stroke-width="134" stroke-linecap="round" fill="none"/>` +
    `<ellipse cx="${f1(lerp(470, 690, reach))}" cy="${f1(lerp(820, 720, reach))}" rx="80" ry="70" fill="#fff" stroke="${INK}" stroke-width="12"/><path d="M${f1(lerp(500, 720, reach))} ${f1(lerp(780, 680, reach))} L${f1(lerp(620, 840, reach))} ${f1(lerp(620, 520, reach))}" stroke="#C9CDD6" stroke-width="16" stroke-linecap="round"/></g>`;
  return h + smFull('#0A1030', 0.12 + 0.2 * clamp((lt - 1.0) / 0.8, 0, 1));
}
