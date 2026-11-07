/* 시뮬레이션 편 v3.1 「내가 쓴 대사를 친구가 말했다」 — 샘플(c1~p11).
   xscenes.js(제로·소라·도트 게임·분식집 도구)와 sscenes(배경·회색 격자)를 그대로 쓴다. 이름은 모두 y 접두사.
   점검 반영: 어깨 너머 샷 없음 / 노트북 빛은 얼굴을 덮지 않는 아래쪽 쐐기 빛 / 입력창은 바로 타자가 쳐짐 / 한 샷 5초 이내. */
['ycold', 'ymorn', 'ytitle', 'yumb', 'ynight', 'ytempt'].forEach(k => CAMS[k] = 'fixed');
const Y0 = '안녕, 0번 주민! 오늘의 행운 색은 노란색!';

/* ---------- shared ---------- */
const yLight = (x, y, op = 0.22) => `<defs><linearGradient id="ylg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#CFEFFF" stop-opacity="${op}"/><stop offset="1" stop-color="#CFEFFF" stop-opacity="0"/></linearGradient></defs>` +
  `<path d="M${f1(x - 130)} ${f1(y - 10)} L${f1(x + 130)} ${f1(y - 10)} L${f1(x + 300)} ${f1(y - 560)} L${f1(x - 300)} ${f1(y - 560)} Z" fill="url(#ylg)"/>`;   // light rises from the laptop, fading before the face
const ySeatZero = (t, o = {}) => qShadow(SMRX, SMRY, 66) + xZero(t, Object.assign({ x: SMRX, y: SMRY, s: 1.0, pose: 'sm랩톱' }, o));
const yLap = () => { const lp = ptOf(SMRX, SMRY, 1.0, 200, 400); return smLapBack(lp[0], lp[1] + 6, 0.95, 1) + yLight(lp[0], lp[1] - 140); };
const yType = (base, typ) => smPose(base, { hL: [180, 394 + typ], hR: [220, 394 - typ] });
const yEditor = (label, txt, n, cur, o = {}) => {
  const shown = [...txt].slice(0, Math.max(0, n)).join('');
  return `<g><rect x="70" y="40" width="${o.big ? 640 : 560}" height="${o.big ? 98 : 74}" rx="14" fill="#0E1626" opacity=".88"/>${xGift(120, o.big ? 90 : 78, o.big ? 1.3 : 0.9)}<text x="160" y="${o.big ? 102 : 90}" font-family="${FONT}" font-weight="900" font-size="${o.big ? 48 : 34}" fill="#FFD6E2">소라 생일 선물 · v0.3</text></g>` +
    (label == null ? '' : `<g><rect x="140" y="850" width="1640" height="160" rx="24" fill="#0E1626" opacity=".93" stroke="#FF8FB1" stroke-width="5"/><text x="180" y="902" font-family="${FONT}" font-weight="900" font-size="34" fill="#FF8FB1">${esc(label)}</text>` +
    `<text x="180" y="972" font-family="${FONT}" font-weight="900" font-size="${o.fs || 54}" fill="#fff">${esc(shown)}${cur ? '<tspan fill="#FF8FB1">|</tspan>' : ''}</text></g>`);
};
// the pixel village with pixel Zero + pixel Sora; o.say = dialog text over pixel Sora, o.umb = pixel umbrella, o.whip = whip clock
function yGame(t, l, o = {}) {
  const sh = x => `<ellipse cx="${x}" cy="${SMGY + 34}" rx="54" ry="11" fill="#5A4022" opacity=".28"/>`;
  const wf = o.wave != null ? (Math.floor(o.wave * 6) % 2 ? 'wave1' : 'wave2') : 'stand';
  const wk = o.whip != null && o.whip > 0 && o.whip < 0.5;
  let act = sh(XGX) + xSprite('zero', { x: XGX, y: SMGY + 30, s: 0.95, look: 1, blink: (t % 3.1) < 0.12, t });
  act += sh(XGS) + xSprite('sora', { x: XGS, y: SMGY + 30, s: 0.95, frame: wf, look: wk ? 1 : -1, flip: wk, blink: (t % 2.7) < 0.12, t });
  if (o.umb) { const ux = XGS + 30, uy = SMGY - 262; act += `<g shape-rendering="crispEdges">` + [[-5, 0], [-4, -1], [-3, -1], [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2], [3, -1], [4, -1], [5, 0]].map(([x, y]) => `<rect x="${ux + x * 22}" y="${uy + y * 22}" width="23" height="${(1 - y) * 22 + 4}" fill="#FFD23F" stroke="#141418" stroke-width="3"/>`).join('') + `<rect x="${ux - 4}" y="${uy + 22}" width="8" height="150" fill="#141418"/></g>`; }
  const over = (o.say ? xDialog(XGS + 20, SMGY - 330, '소라', o.say, o.sayN == null ? 99 : o.sayN, 1) : '') + (o.over || '');
  const gx = wk ? smScr(o.cam || [960, 820, 1.25], XGS - 70, 0)[0] : null;
  return xGameWorld(t, o.cam || [960, 820, 1.25], { keep: [XGX, XGS], actors: act, over, sat: o.sat, wireX: wk ? gx : null, glitch: wk ? 0.5 : 0 });
}
const yScreen = (inner, w = 1500) => smDefs() + smFull('#0A0E1C') + smLapScreen(960, 500, w, inner);
P['y으쓱'] = smPose('서기', { armL: [[148, 285], [108, 322], [84, 292]], hL: [78, 284], armR: [[252, 285], [292, 322], [316, 292]], hR: [322, 284] });
P['y우산'] = smPose('서기', { armR: [[252, 285], [292, 252], [300, 206]], hR: [302, 196] });
P['y배잡기'] = smPose('서기', { armL: [[148, 285], [140, 342], [178, 376]], hL: [182, 378], armR: [[252, 285], [260, 342], [222, 376]], hR: [218, 378] });
P['y털썩'] = smPose('웅크림', { legL: [[180, 412], [118, 448], [62, 466]], fL: [50, 474, 30], legR: [[220, 412], [282, 448], [338, 466]], fR: [350, 474, -30], armL: [[148, 285], [112, 350], [84, 404]], hL: [78, 412], armR: [[252, 285], [288, 350], [316, 404]], hR: [322, 412], dy: 70 });   // sat down hard, legs splayed
const yUmbrella = (hx, hy, s = 1, rot = 0) => {   // a real yellow umbrella, handle at (hx,hy)
  let sc = ''; for (let i = 0; i < 6; i++) { const x0 = 220 - i * 73.3; sc += ` Q${f1(x0 - 36.6)} -30 ${f1(x0 - 73.3)} 0`; }
  return `<g transform="translate(${f1(hx)} ${f1(hy)}) rotate(${f1(rot)}) scale(${s})"><path d="M0 0 L0 -200" stroke="${INK}" stroke-width="9"/><path d="M0 0 q0 22 -18 22" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/>` +
    `<g transform="translate(0 -200)"><path d="M-220 0 Q-210 -150 0 -160 Q210 -150 220 0${sc} Z" fill="#FFD23F" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>` +
    `<path d="M-146 0 Q-120 -120 0 -160 M146 0 Q120 -120 0 -160 M-73 0 Q-50 -130 0 -160 M73 0 Q50 -130 0 -160" stroke="#E0A800" stroke-width="5" fill="none"/><circle cx="0" cy="-166" r="10" fill="${INK}"/></g></g>`;
};
const yCard = (x, y, s, rot) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><rect x="-70" y="-44" width="140" height="88" rx="12" fill="#3E6FB0" stroke="${INK}" stroke-width="6"/><rect x="-52" y="-18" width="30" height="22" rx="4" fill="#FFD23F"/><rect x="-52" y="18" width="100" height="8" rx="4" fill="#fff" opacity=".7"/></g>`;
const yLaugh = (l) => ({ sy: 1 + 0.04 * Math.sin(l * 22), rot: 3 * Math.sin(l * 11), tilt: -10 + 4 * Math.sin(l * 22), dy: -6 * Math.abs(Math.sin(l * 11)) });   // the SAME laugh every time

/* ================= c1~c4: night — the boy who'd rather talk to code ================= */
function ycoldScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3, typ = Math.sin(t * 26) * 4;
  if (id === 'c1') {
    if (lt < 2.6) {   // wide: typing on the bed; the phone lies face-down beside him, '999+' glowing at its edge
      const cam = qLerpCam(lt / 2.6, [SMRX - 60, 760, 1.32], [SMRX - 60, 754, 1.4]);
      let ch = ySeatZero(t, { pose: yType('sm랩톱', typ), ex: xEx('z기본'), look: [0, 0.6] }) + yLap();
      ch += `<g transform="translate(${SMRX + 230} ${SMRY - 150}) rotate(-12)"><rect x="-42" y="-24" width="84" height="48" rx="10" fill="#20232A" stroke="${INK}" stroke-width="5"/><g transform="translate(40 -26)"><circle r="20" fill="#E5484D" stroke="#fff" stroke-width="4"/><text x="0" y="7" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="18" fill="#fff">999+</text></g></g>`;
      return smDefs() + smRoom(t, cam, { sat: 0.9, night: 1, plant: { droop: 0, green: 1 } }) + qCam(cam, ch);
    }
    // insert: the group chat — '999+' — and his hand turns the phone over without reading it
    const k = lt - 2.6, flip = clamp((k - 1.9) / 0.35, 0, 1);
    let h = smDefs() + smRoom(t, [SMRX + 200, 860, 2.6], { sat: 0.6, night: 1, blur: true, depth: 0.3 }) + `<rect x="-300" y="560" width="2600" height="900" fill="#6E7280" opacity=".5"/>`;
    h += `<g transform="translate(960 520) scale(${f1(lerp(1, -1, flip) * 1000) / 1000} 1) rotate(-6)">` + (flip < 0.5 ?
      `<rect x="-190" y="-340" width="380" height="680" rx="44" fill="#20232A" stroke="${INK}" stroke-width="10"/><rect x="-166" y="-306" width="332" height="612" rx="26" fill="#2E4A6E"/>` +
      [['동창 단톡방', '999+'], ['회사 단톡방', '128'], ['엄마', '3']].map(([n, c], i) => `<rect x="-146" y="${-250 + i * 120}" width="292" height="100" rx="18" fill="#fff"/><text x="-120" y="${-190 + i * 120}" font-family="${FONT}" font-weight="900" font-size="34" fill="${INK}">${n}</text><circle cx="100" cy="${-200 + i * 120}" r="${c.length > 2 ? 34 : 24}" fill="#E5484D"/><text x="100" y="${-189 + i * 120}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${c.length > 2 ? 26 : 30}" fill="#fff">${c}</text>`).join('')
      : `<rect x="-190" y="-340" width="380" height="680" rx="44" fill="#3A3F4A" stroke="${INK}" stroke-width="10"/><circle cx="-110" cy="-260" r="26" fill="#20232A"/>`) + `</g>`;
    const hx = lerp(1500, 1090, easeOut(clamp((k - 1.0) / 0.8, 0, 1))) - (flip > 0 && flip < 1 ? 60 : 0);
    h += `<path d="M2100 1300 Q1700 1000 ${f1(hx + 60)} 640" stroke="${INK}" stroke-width="150" stroke-linecap="round" fill="none"/><path d="M2100 1300 Q1700 1000 ${f1(hx + 60)} 640" stroke="${SM_ORANGE}" stroke-width="134" stroke-linecap="round" fill="none"/><ellipse cx="${f1(hx)}" cy="600" rx="78" ry="68" fill="#fff" stroke="${INK}" stroke-width="12"/>`;
    return h + smFull('#0B1230', 0.15);
  }
  if (id === 'c2') {
    const tS = smAt(a, '작은', 0.55 * D);
    if (lt < tS - 0.15) return yScreen(yGame(t, lt) + yEditor(null, '', 0, false, { big: 1 }));
    const cam = qLerpCam((lt - tS) / 2.5, [SMRX, 700, 2.1], [SMRX, 694, 2.2]);   // CU: he smiles at it — the only time he smiles like that
    return smDefs() + smRoom(t, cam, { sat: 0.85, night: 1, blur: true, depth: 0.3 }) + qCam(cam, ySeatZero(t, { pose: yType('sm랩톱', typ), ex: exprAt([[0, 'z기본'], [0.4, 'z설렘']], lt - tS), look: [0, 0.5] }) + yLap());
  }
  if (id === 'c3') {   // he types the silly line into pixel Sora; she waves, and says it in a dialog box
    const n = Math.floor(clamp((lt - 0.1) / 1.6, 0, 1) * [...Y0].length), done = lt > 1.8;
    return yScreen(yGame(t, lt, done ? { wave: lt - 1.8, say: Y0, sayN: Math.floor((lt - 1.8) * 30) } : {}) + yEditor('도트 소라 · 인사 대사', Y0, n, !done, { fs: 48 }));
  }
  // c4: CU — "소라라면 이런 말, 절대 안 하겠지." a little laugh
  const cam = qLerpCam(lt / D, [SMRX, 700, 2.15], [SMRX, 694, 2.25]), lau = lt > D * 0.6 ? Math.abs(Math.sin((lt - D * 0.6) * 10)) * Math.exp(-(lt - D * 0.6) * 2) : 0;
  return smDefs() + smRoom(t, cam, { sat: 0.85, night: 1, blur: true, depth: 0.3 }) + qCam(cam, ySeatZero(t, { y: SMRY - 4 * lau, sy: 1 + 0.03 * lau, ex: xTalk(a, 'Z', lt < D * 0.6 ? 'z히죽' : 'z빵긋', t), look: [0, 0.5] }) + yLap());
}

/* ================= m1~m5: the next morning — she says it ================= */
function ymornScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 2;
  if (id === 'm1') {
    const tStop = 1.0;
    if (lt < tStop) {   // wide: she trots in, already waving
      const cam = [1180, 760, 1.12], u = clamp(lt / tStop, 0, 1), sx = lerp(1980, XSX, easeOut(u));
      let ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY, s: 1.0, pose: 'sm컵', ex: exprAt([[0, 'z기본'], [0.5, 'z빵긋']], lt), look: [0.9, -0.05] }) + xCupHand(XZX, SMY);
      ch += qShadow(sx, SMY, 66) + flip(sx, xSora(t, { x: sx, y: SMY - Math.abs(Math.sin(lt * 13)) * 8, s: 0.97, pose: walkPose(lt * 13, 0.55), ex: xEx('z빵긋'), look: [0.9, 0] }));
      return smDefs() + smPlate('cross', cam) + qCam(cam, ch) + smMorning(1);
    }
    // MCU on Sora: the line — and for a split second the game's dialog box flickers over her head
    const k = lt - tStop, cam = qLerpCam(k / 2.5, [XSX - 40, 760, 1.85], [XSX - 50, 756, 1.95]);
    let ch = qShadow(XSX, SMY, 66) + flip(XSX, xSora(t, { x: XSX, y: SMY, s: 0.97, pose: xGreetPose(k), tilt: xGreetTilt(k), ex: xTalk(a, 'S', 'z빵긋', t), look: [0.9, 0] }));
    let h = smDefs() + smPlate('cross_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.8);
    const fl = (k > 0.9 && k < 1.05) || (k > 1.2 && k < 1.28);
    if (fl) { const p = smScr(cam, XSX, SMY - 560); h += smGlitch(t, 0.5, 4) + `<g opacity=".85">${xDialog(p[0], p[1] - 40, '소라', Y0, 99, 1)}</g>`; }
    return h;
  }
  if (id === 'm2') {   // CU: Zero frozen — the coffee tilts and spills a drop; gloom comes down
    const cam = qLerpCam(lt / D, [XZX + 20, 800, 2.25], [XZX + 20, 794, 2.4]), tilt = easeOut(clamp(lt / 0.5, 0, 1)) * 28;
    let ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY, s: 1.0, still: true, noBlink: true, pose: 'sm컵', ex: exprAt([[0, 'z멍'], [0.55, 'z소름']], lt), look: [0.8, -0.05] });
    const hp = ptOf(XZX, SMY, 1.0, 248, 318); ch += smCup(hp[0] + 4, hp[1] + 6, 0.95, tilt);
    if (lt > 0.45) { const k = clamp((lt - 0.45) / 0.6, 0, 1); ch += `<path d="M${f1(hp[0] + 30)} ${f1(hp[1] - 30 + k * 170)} q-10 16 0 22 q10 -6 0 -22" fill="#8A5A30" stroke="${INK}" stroke-width="3" opacity="${f1((1 - k * 0.3) * 100) / 100}"/>`; }
    return smDefs() + smPlate('cross_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.8);
  }
  if (id === 'm3') {
    const tB = smAt(a, '아무', 0.55 * D);
    if (lt < tB - 0.2) {   // memory insert: last night's screen, the same words — desaturated, with a soft grain
      return yScreen(smFx('ymem', 0.25) + `<g filter="url(#ymem)">` + yGame(t, 2, { say: Y0 }) + yEditor('도트 소라 · 인사 대사', Y0, 99, false, { fs: 48 }) + `</g>`) + smFull('#E8E2D0', 0.12) + smGlitch(t, lt < 0.15 ? 0.6 : 0, 8);
    }
    const k = lt - tB + 0.2, cam = qLerpCam(k / 3, [XZX + 150, 780, 1.7], [XZX + 160, 776, 1.8]);   // two-shot: he sweats; she tilts her head, waiting
    let ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY, s: 1.0, pose: 'sm컵', ex: xEx('z당황'), look: [0.8, -0.05], shiver: true }) + xCupHand(XZX, SMY);
    ch += qShadow(XSX, SMY, 66) + flip(XSX, xSora(t, { x: XSX, y: SMY, s: 0.97, pose: '서기', tilt: 6 + xIdleTilt(t, 2), ex: xEx('z기본'), look: [0.9, 0] }));
    return smDefs() + smPlate('cross', cam) + qCam(cam, ch) + smMorning(0.9);
  }
  if (id === 'm4') {   // CU Zero: the question, small
    const cam = qLerpCam(lt / D, [XZX + 20, 800, 2.2], [XZX + 20, 796, 2.3]);
    let ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY, s: 1.0, pose: 'sm컵', ex: xTalk(a, 'Z', 'z당황', t), look: [0.8, -0.05], shiver: true }) + xCupHand(XZX, SMY);
    return smDefs() + smPlate('cross_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.8);
  }
  // m5: CU Sora — a shrug, as if nothing happened
  const cam = qLerpCam(lt / D, [XSX - 40, 770, 2.0], [XSX - 40, 766, 2.1]), sh = Math.sin(clamp((lt - 0.4) / 0.6, 0, 1) * Math.PI);
  let ch = qShadow(XSX, SMY, 66) + flip(XSX, xSora(t, { x: XSX, y: SMY - 8 * sh, s: 0.97, pose: mixPose('서기', 'y으쓱', sh), tilt: 5, ex: xTalk(a, 'S', lt < 0.5 ? 'z의심' : 'z빵긋', t), look: [0.9, 0] }));
  return smDefs() + smPlate('cross_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.8);
}
function ytitleScene(t, lt, a) {
  const bar = easeOut(clamp(lt / 0.4, 0, 1)), gl = lt < 0.35 ? 1 : (lt > 1.4 && lt < 1.5 ? 0.6 : 0), jx = gl ? (hash(Math.floor(t * 24)) - 0.5) * 30 : 0;
  let h = smDefs() + smPlate('cross_c', [XSX - 60, 760, 1.9], 0.35, { blur: true }) + smFull('#0A0E1C', 0.5);
  h += `<rect x="-400" y="-300" width="2800" height="${f1(300 + 120 * bar)}" fill="#000"/><rect x="-400" y="${f1(1214 - 132 * bar)}" width="2800" height="400" fill="#000"/>`;
  h += `<g transform="translate(${f1(jx)} 0)">` + outlined(960, 500, [[['내가 쓴 ', '#fff'], ['대사', '#FF8FB1'], ['를', '#fff']], [['친구가 말했다', '#fff']]], { size: 104, sw: 18, lh: 132 }) + `</g>`;
  return h + smGlitch(t, gl, 21);
}

/* ================= u1~u6: the test — a yellow umbrella on a sunny day ================= */
function yumbScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 2, typ = Math.sin(t * 26) * 4;
  const TXT = '내일 소라는 노란 우산을 쓰고 온다.';
  if (id === 'u1') {
    const tT = smAt(a, '시험', 0.6 * D);
    if (lt < tT - 0.1) {   // night again: chin on hand, thinking (z의심 → z결심)
      const cam = qLerpCam(lt / tT, [SMRX, 720, 1.9], [SMRX, 714, 2.0]);
      return smDefs() + smRoom(t, cam, { sat: 0.85, night: 1, blur: true, depth: 0.3 }) + qCam(cam, ySeatZero(t, { pose: 'sm턱', tilt: 5, ex: exprAt([[0, 'z의심'], [tT - 0.9, 'z결심']], lt), look: [-0.4, -0.3] }));
    }
    const n = Math.floor(clamp((lt - tT + 0.1) / 2.2, 0, 1) * [...TXT].length);
    return yScreen(yGame(t, lt) + yEditor('도트 소라 · 내일 할 일', TXT, n, true));
  }
  if (id === 'u2') {
    if (lt < 1.4) return yScreen(yGame(t, lt, { umb: lt > 0.5 }) + yEditor('도트 소라 · 내일 할 일', TXT, 99, Math.floor(t * 2.5) % 2 === 0));
    // the phone: tomorrow — clear sky
    const k = lt - 1.4;
    return smDefs() + smRoom(t, [SMRX + 120, 860, 2.6], { sat: 0.5, night: 1, blur: true, depth: 0.3 }) + `<rect x="-300" y="560" width="2600" height="900" fill="#6E7280" opacity=".5"/>` +
      `<g transform="translate(960 520) rotate(-4)"><rect x="-190" y="-340" width="380" height="680" rx="44" fill="#20232A" stroke="${INK}" stroke-width="10"/><rect x="-166" y="-306" width="332" height="612" rx="26" fill="#6FB6F0"/>` +
      `<text x="0" y="-220" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="40" fill="#fff">내일</text><g transform="translate(0 -40) scale(${f1(easeOutBack(clamp(k / 0.3, 0, 1)) * 100) / 100})"><circle r="70" fill="#FFD23F" stroke="#fff" stroke-width="6"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${f1(Math.cos(i * 0.785) * 92)} ${f1(Math.sin(i * 0.785) * 92)} L${f1(Math.cos(i * 0.785) * 122)} ${f1(Math.sin(i * 0.785) * 122)}" stroke="#FFD23F" stroke-width="12" stroke-linecap="round"/>`).join('')}</g>` +
      `<text x="0" y="150" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="64" fill="#fff">맑음</text><text x="0" y="220" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="#E6F4FF">강수확률 0%</text></g>`;
  }
  if (id === 'u3') {   // next day, blazing sun: far away, a yellow umbrella comes bobbing up the street
    const cam = qLerpCam(lt / D, [1260, 740, 1.12], [1300, 736, 1.18]), u = clamp(lt / D, 0, 1), sx = lerp(2050, 1560, u), bob = Math.abs(Math.sin(lt * 8)) * 6;
    let ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY, s: 1.0, pose: 'sm컵', ex: exprAt([[0, 'z기본'], [1.0, 'z의심']], lt), look: [0.9, -0.1] }) + xCupHand(XZX, SMY);
    const hp = ptOf(sx, SMY - bob, 0.97, 302, 196);
    ch += qShadow(sx, SMY, 60) + flip(sx, xSora(t, { x: sx, y: SMY - bob, s: 0.97, pose: Object.assign({}, walkPose(lt * 10, 0.5), { armR: P['y우산'].armR, hR: P['y우산'].hR }), ex: xEx('z빵긋'), look: [0.9, 0] })) + yUmbrella(2 * sx - hp[0], hp[1], 0.95, -6 + Math.sin(lt * 8) * 3);
    return smDefs() + smPlate('cross', cam) + qCam(cam, ch) + smMorning(1) + smFull('#FFF6D0', 0.12);
  }
  if (id === 'u4') {   // MCU Sora under the umbrella, twirling it
    const sx = XSX, cam = qLerpCam(lt / D, [sx - 30, 700, 1.85], [sx - 30, 694, 1.95]), hp = ptOf(sx, SMY, 0.97, 302, 196);
    let ch = qShadow(sx, SMY, 66) + flip(sx, xSora(t, { x: sx, y: SMY, s: 0.97, pose: 'y우산', tilt: 6, ex: xTalk(a, 'S', 'z빵긋', t), look: [0.9, 0] })) + yUmbrella(2 * sx - hp[0], hp[1], 0.95, Math.sin(lt * 5) * 10);
    return smDefs() + smPlate('cross_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.9) + smFull('#FFF6D0', 0.1);
  }
  if (id === 'u5') {   // 깜짝 7단계 → his knees give way (털썩); the street behind flickers grey for a blink; the cup drops
    const cam = [1150, 790, 1.45], tJ = 0.1, J = xJump(lt, tJ, 0.4), tD = tJ + 0.95, down = clamp((lt - tD) / 0.25, 0, 1);
    const pose = lt < tD ? (J.ph >= 2 && J.ph <= 4 ? '만세' : J.ph <= 1 ? '웅크림' : 'sm컵') : mixPose('웅크림', 'y털썩', down);
    let ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY + J.dy + 30 * down, s: 1.0, sx: J.sx, sy: lt < tD ? J.sy : 1 - 0.08 * Math.sin(down * Math.PI), pose, ex: exprAt([[0, 'z충격'], [tD, 'z멍']], lt), look: [0.8, -0.1] });
    const hp = ptOf(XSX, SMY, 0.97, 302, 196);
    ch += qShadow(XSX, SMY, 66) + flip(XSX, xSora(t, { x: XSX, y: SMY, s: 0.97, pose: 'y우산', tilt: 8, ex: xEx(lt > tD ? 'z당황' : 'z빵긋'), look: [0.9, 0.2] })) + yUmbrella(2 * XSX - hp[0], hp[1], 0.95, 4);
    if (lt > tJ + 0.25) { const k = clamp((lt - tJ - 0.25) / 0.6, 0, 1); ch += smCup(XZX + 70 + 40 * k, SMY - 220 + 200 * k * k, 0.95, 120 * k); }
    let h = smDefs() + smPlate('cross', cam);
    const g = lt > tD && lt < tD + 0.18; if (g) h += smWire('cross', cam, 0.55, smScr(cam, XZX - 120, 0)[0]) + smGlitch(t, 0.6, 9);
    return h + qCam(cam, ch + (J.ph >= 2 && J.ph <= 4 ? speedLines(XZX, SMY - 420, 230, 360, 14, t, '#fff', 0.7) : '')) + smMorning(g ? 0.2 : 1) + smFull('#FFF6D0', 0.1);
  }
  // u6: on the ground, CU: "…내가 쓰면, 진짜가 된다." — the umbrella's edge leans into frame above him
  const cam = qLerpCam(lt / D, [XZX + 20, 860, 2.2], [XZX + 20, 852, 2.35]);
  let ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY + 30, s: 1.0, pose: 'y털썩', ex: xTalk(a, 'Z', lt < D * 0.45 ? 'z멍' : 'z소름', t), look: [0.2, -0.4] });
  ch += yUmbrella(XZX + 360, SMY - 300, 0.95, -28);
  return smDefs() + smPlate('cross_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.8);
}

/* ================= b1, b2: that night — two sentences ================= */
function ynightScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3;
  if (id === 'b1') {
    const tR = smAt(a, '논증', 0.3 * D), tM = smAt(a, '수없이', smAt(a, '없이', 0.6 * D));
    if (lt < tR - 0.1) {   // in bed, the phone: "세상이 코드라면"
      const cam = qLerpCam(lt / tR, [SMRX - 30, 740, 1.7], [SMRX - 30, 732, 1.82]);
      let ch = ySeatZero(t, { pose: smPose('sm앉기', { armR: P['sm폰'].armR, hR: P['sm폰'].hR }), ex: xEx('z의심'), look: [0.2, 0.5] });
      const hp = ptOf(SMRX, SMRY, 1.0, 230, 312); ch += xPhone(hp[0] + 6, hp[1] - 4, 0.36, { lit: 1 }) + yLight(hp[0], hp[1] + 40, 0.18);
      const q = '세상이 코드라면', n = Math.floor(clamp((lt - 0.2) / 1.3, 0, 1) * q.length);
      return smDefs() + smRoom(t, cam, { sat: 0.75, night: 1 }) + qCam(cam, ch) + `<g transform="translate(560 200)"><rect x="0" y="0" width="800" height="100" rx="50" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="60" cy="50" r="20" fill="none" stroke="#8A93A6" stroke-width="7"/><path d="M74 64 L92 82" stroke="#8A93A6" stroke-width="7" stroke-linecap="round"/><text x="110" y="66" font-family="${FONT}" font-weight="900" font-size="44" fill="${INK}">${esc(q.slice(0, n))}${Math.floor(t * 2.5) % 2 ? '|' : ''}</text></g>`;
    }
    if (lt < tM - 0.15) {   // the result: Bostrom 2003
      const k = lt - tR + 0.1;
      return smDefs() + smRoom(t, [SMRX, 700, 2.6], { sat: 0.6, night: 1, blur: true, depth: 0.3 }) + smFull('#0B1230', 0.25) +
        `<g transform="translate(960 ${f1(500 - 30 * (1 - easeOut(clamp(k / 0.4, 0, 1))))})"><rect x="-520" y="-300" width="1040" height="600" rx="30" fill="#20232A" stroke="${INK}" stroke-width="8"/><rect x="-490" y="-270" width="980" height="540" rx="18" fill="#F4F6FA"/>` +
        `<text x="-450" y="-180" font-family="${FONT}" font-weight="700" font-size="30" fill="#3E6FB0">simulation-argument.com</text><text x="-450" y="-110" font-family="${FONT}" font-weight="900" font-size="52" fill="#1A3E8C">Are You Living in a Computer</text><text x="-450" y="-50" font-family="${FONT}" font-weight="900" font-size="52" fill="#1A3E8C">Simulation?</text>` +
        `<text x="-450" y="20" font-family="${FONT}" font-weight="700" font-size="34" fill="#5A606C">Nick Bostrom · 2003</text>${[0, 1, 2].map(i => `<rect x="-450" y="${70 + i * 46}" width="${860 - i * 160}" height="20" rx="10" fill="#D5DCE6"/>`).join('')}</g>`;
    }
    // concept, inside his own story: the pixel village → his room → his room is one screen among many (개념도)
    const k = clamp((lt - tM + 0.15) / Math.max(1.5, D - tM), 0, 1), e = easeInOut(k), w = lerp(2100, 420, e);
    const room = smRoom(t, [SMRX - 200, 740, 1.2], { sat: 0.85, night: 1 }) + qCam([SMRX - 200, 740, 1.2], ySeatZero(t, { pose: 'sm랩톱', ex: xEx('z멍'), look: [0, 0.5] }) + yLap());
    let h = smDefs() + smPlate('space', [960, 560, 1.05], 0.2) + smFull('#000014', 0.2);
    for (let i = 0; i < 24; i++) for (let j = 0; j < 12; j++) { const x = -240 + i * 100 + (j % 2) * 50, y = -160 + j * 112, d = Math.hypot(x - 960, y - 520); if (d < 240) continue; const kk = clamp(e * 1.8 - d / 1500, 0, 1); if (kk <= 0) continue; h += `<rect x="${x - 36}" y="${y - 23}" width="72" height="46" rx="5" fill="#1E3350" stroke="#5E87B8" stroke-width="3" opacity="${f1(kk * 0.9 * 100) / 100}"/><rect x="${x - 30}" y="${y - 17}" width="60" height="34" rx="3" fill="${['#9FD8FF', '#FFD27A', '#8CCB9B', '#F2A65A'][(i + j) % 4]}" opacity="${f1(kk * 0.35 * 100) / 100}"/>`; }
    return h + smLapScreen(960, 520, w, room) + (k > 0.3 ? smTag(1700, 960, '개념도') : '');
  }
  // b2: CU — the thought turns: fear → a little, guilty excitement
  const tW = smAt(a, '쓰는', 0.6 * D), cam = qLerpCam(lt / D, [SMRX, 690, 2.2], [SMRX, 684, 2.35]);
  return smDefs() + smRoom(t, cam, { sat: 0.75, night: 1, blur: true, depth: 0.3 }) + qCam(cam, ySeatZero(t, { ex: xTalk(a, 'Z', lt < tW ? 'z의심' : 'z히죽', t), look: [0, 0.5], tilt: lt > tW ? -5 : 0 }) + yLap());
}

/* ================= p1~p11: temptation ================= */
const yBun = (t, cam, ch, o = {}) => smDefs() + smPlate('bunsik', cam, o.blur ? 0.4 : 0.55, o.blur ? { blur: true } : {}) + qCam(cam, ch) + xFront(cam) + (o.pan ? qCam(cam, smPan(960, 960, 1.0, t)) : '') + warm(0.45);
function ytemptScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 2, typ = Math.sin(t * 26) * 4;
  if (id === 'p1') {   // MCU: typing, a sly little smile
    const cam = qLerpCam(lt / D, [SMRX, 700, 2.0], [SMRX, 694, 2.1]);
    return smDefs() + smRoom(t, cam, { sat: 0.8, night: 1, blur: true, depth: 0.3 }) + qCam(cam, ySeatZero(t, { pose: yType('sm랩톱', typ), ex: exprAt([[0, 'z기본'], [0.8, 'z히죽']], lt), look: [0, 0.5] }) + yLap());
  }
  if (id === 'p2' || id === 'p5') {
    const TXT = id === 'p2' ? '소라는 제로의 농담에 크게 웃는다.' : '소라는 오늘 떡볶이를 산다.', n = Math.floor(clamp(lt / (D - 0.4), 0, 1) * [...TXT].length);
    return yScreen(yGame(t, lt) + yEditor('도트 소라 · 내일 할 일', TXT, n, true));
  }
  if (id === 'p3') {   // the bunsik: the dad joke (finger-gun); she listens, neutral
    const tK = smAt(a, '킹콩', 0.75 * D), cam = qLerpCam(lt / D, [960, 720, 1.18], [960, 714, 1.24]);
    let ch = xZeroSeat(t, { pose: lt > tK - 0.2 ? '가리킴' : '서기', sy: xPop(lt, tK), ex: xTalk(a, 'Z', lt < tK ? 'z히죽' : 'z빵긋', t) });
    ch += xSoraSeat(t, { pose: 'x포크', ex: xEx(lt > tK ? 'z멍' : 'z기본'), look: [-0.8, 0.1], tilt: xIdleTilt(t, 3) });
    let h = yBun(t, cam, ch, { pan: true });
    if (lt > tK) h += fx(t, t - (lt - tK), t + 99, 560, 280, '킹콩', '#FFD23F', { size: 80, rot: -6 });
    return h;
  }
  if (id === 'p4' || id === 'p8') {   // CU Sora: the laugh — exactly the same both times (same function, same voice)
    const L = yLaugh(lt), cam = [SMBF - 30, 690, 2.05];
    let ch = xSoraSeat(t, { y: SMBY + L.dy, sy: L.sy, rot: L.rot, tilt: L.tilt, pose: 'y배잡기', ex: xTalk(a, 'S', 'z빵긋', t), look: [-0.6, -0.2], still: true, noBlink: true });
    return yBun(t, cam, ch, { blur: true }) + (id === 'p8' ? smFull('#0A1030', 0.06) : '');
  }
  if (id === 'p6') {   // she slaps a card on the table
    const cam = qLerpCam(lt / D, [1150, 720, 1.5], [1150, 716, 1.56]), sl = clamp((lt - 0.2) / 0.2, 0, 1);
    let ch = xZeroSeat(t, { ex: xEx('z빵긋'), look: [0.8, 0.1] }) + xSoraSeat(t, { pose: mixPose('x포크', '가리킴', 0.3 + 0.7 * sl), ex: xTalk(a, 'S', 'z빵긋', t), look: [-0.8, 0.1] });
    let h = yBun(t, cam, ch, { pan: true }) + qCam(cam, yCard(1150, 990 - 40 * (1 - sl), 1.1, -10));
    return h;
  }
  if (id === 'p7') {   // CU Zero: "이거… 좋은데?"
    const cam = qLerpCam(lt / D, [SMBX + 20, 690, 2.15], [SMBX + 20, 684, 2.25]);
    return yBun(t, cam, xZeroSeat(t, { ex: xTalk(a, 'Z', 'z히죽', t), look: [0.85, 0.05], rot: 3 }), { blur: true });
  }
  if (id === 'p9') {   // reaction: his smile freezes
    const cam = qLerpCam(lt / D, [SMBX + 20, 690, 2.15], [SMBX + 20, 680, 2.4]);
    return yBun(t, cam, xZeroSeat(t, { still: true, noBlink: true, ex: exprAt([[0, 'z히죽'], [0.25, 'z멍']], lt), look: [0.85, 0.05], sweat: lt > 0.6 }), { blur: true }) + smFull('#0A1030', 0.08);
  }
  if (id === 'p10') {
    const tW = smAt(a, '웃음이', 0.55 * D);
    if (lt < tW - 0.15) {   // wide: she keeps the smile, perfectly still; he stares
      const cam = qLerpCam(lt / tW, [960, 720, 1.18], [960, 716, 1.22]);
      let ch = xZeroSeat(t, { ex: xEx('z멍'), look: [0.85, 0.05] }) + xSoraSeat(t, { pose: 'y배잡기', ex: xEx('z빵긋'), look: [-0.6, -0.2], still: true, noBlink: true, tilt: -8 });
      return yBun(t, cam, ch, { pan: true }) + smFull('#0A1030', 0.08);
    }
    // ECU: the smile that doesn't blink
    const cam = qLerpCam((lt - tW) / 3, [SMBF - 20, 640, 2.8], [SMBF - 20, 636, 3.1]);
    return yBun(t, cam, xSoraSeat(t, { pose: 'y배잡기', ex: xEx('z빵긋'), look: [-0.6, -0.2], still: true, noBlink: true, tilt: -8 }), { blur: true }) + smFull('#0A1030', 0.12);
  }
  // p11: that night — pixel Sora whips round once (grey blink); he slams the laptop shut
  if (lt < 1.4) return yScreen(yGame(t, lt, { whip: lt - 0.5 }));
  const k = lt - 1.4, cam = [SMRX, 700, 2.1], shut = clamp(k / 0.2, 0, 1);
  let ch = ySeatZero(t, { pose: 'sm랩톱', ex: xEx(k < 0.3 ? 'z당황' : 'z멍'), look: [0, 0.5], sweat: true });
  if (shut < 1) ch += yLap();
  return smDefs() + smRoom(t, cam, { sat: 0.7, night: 1, blur: true, depth: 0.3 }) + qCam(cam, ch) + smFull('#000', 0.25 * shut);
}
