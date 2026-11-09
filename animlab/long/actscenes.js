/* 연기·표정 실험실: 왼쪽 '지금(표정 갈아 끼우기 + 타원 입)' / 오른쪽 '개선(act2.js)'. 같은 시간, 같은 상황. */
['act1', 'act2', 'act3', 'act4', 'act5'].forEach(k => CAMS[k] = 'fixed');
const AC = { XL: 480, XR: 1440, CS: 2.2, CY: 1500, FS: 1.3, GY: 1010 };
const acBg = (title, ground) => `<rect x="-300" y="-200" width="2600" height="1500" fill="#F3EEE4"/>` +
  (ground ? `<rect x="-300" y="${AC.GY}" width="2600" height="400" fill="#E2D8C6"/><line x1="-300" y1="${AC.GY}" x2="2300" y2="${AC.GY}" stroke="${INK}" stroke-width="6"/>`
    : `<ellipse cx="480" cy="700" rx="400" ry="330" fill="#fff" opacity=".45"/><ellipse cx="1440" cy="700" rx="400" ry="330" fill="#fff" opacity=".45"/>`) +
  `<line x1="960" y1="230" x2="960" y2="930" stroke="${INK}" stroke-width="5" stroke-dasharray="18 14" opacity=".35"/>` +
  label(480, 70, '지금', { size: 44, bg: '#fff' }) + label(1440, 70, '개선', { size: 44, bg: YEL }) + fT(960, 150, title, 40, INK);
const acAmp = t => { const A = TL.amp; if (!A) return 0; return A.v[Math.floor((t - A.t0) / A.dt)] || 0; };
let AC_TR = null; const acTrack = () => AC_TR || (AC_TR = ACT.lipTrack(TL.say.text, TL.say.words, TL.say.t0, TL.say.t1, tt => acAmp(tt) > 0.12 ? 1 : 0));
const acZ = (key, face, o) => { E[key] = ACT.face(Object.assign({ id: key }, face)); return Z(Object.assign({ ex: fEx(key), noBlink: true, noMouth: true }, o)); };
const acShadow = (x, y, r = 70) => `<ellipse cx="${f1(x)}" cy="${f1(y + 8)}" rx="${f1(r)}" ry="${f1(r * 0.18)}" fill="#000" opacity=".16"/>`;
// 말풍선/카드(양쪽 같은 자극)
const acBubble = (x, y, text, t, t0, t1, tail = -1) => { const k = ACT.symK(t, t0, t1); if (k < 0.01) return ''; const w = 30 + text.length * 40;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * 100) / 100})"><path d="M${-w / 2} -46 Q${-w / 2} -62 ${-w / 2 + 16} -62 L${w / 2 - 16} -62 Q${w / 2} -62 ${w / 2} -46 L${w / 2} 30 Q${w / 2} 46 ${w / 2 - 16} 46 L${tail * 10 + 20} 46 L${tail * 60} 84 L${tail * 10 - 14} 46 L${-w / 2 + 16} 46 Q${-w / 2} 46 ${-w / 2} 30 Z" fill="#fff" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` +
    `<text x="0" y="12" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="48" fill="${INK}">${text}</text></g>`; };
const acCard = (x, y, t, t0) => { const k = ACT.symK(t, t0, 99); if (k < 0.01) return ''; return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(-6 + Math.sin((t - t0) * 7) * 6 * Math.exp(-(t - t0) * 3))}) scale(${f1(k * 100) / 100})">` +
  `<rect x="-78" y="-92" width="156" height="170" rx="16" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-78" y="-92" width="156" height="46" rx="16" fill="#E5484D" stroke="${INK}" stroke-width="7"/><circle cx="-40" cy="-92" r="8" fill="${INK}"/><circle cx="40" cy="-92" r="8" fill="${INK}"/>` +
  `<text x="0" y="40" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="70" fill="#E5484D">D-1</text></g>`; };

/* 1. 말하기 */
function act1Scene(t, lt, a) {
  let w = acBg('"서윤아? 내일 시험 아니야? 안 자고 뭐해?" — 모음마다 입 모양 · 말끝 갸웃 · 단어마다 끄덕');
  const e = env(t);
  E['_a1L'] = Object.assign({}, E['z기본'], { mouth: ell(200, 238, 10 + 3 * e, 3 + 13 * e), mouthFill: '#5A1E2A' });
  w += Z({ x: AC.XL, y: AC.CY, s: AC.CS, t, ex: fEx('_a1L'), look: [0.4, 0] });
  // 오른쪽
  const tr = acTrack(), lp = ACT.lip(tr, t, acAmp(t)), T0 = t - lt; // T0: 이 장면의 lt=0인 영상 시각
  let nod = 0, bro = 0, q = 0;
  tr.forEach((s, i) => { if (s.first) { nod += ACT.pulse(t, s.a - 0.05, 0.28); bro += ACT.pulse(t, s.a - 0.07, 0.32); }
    if (s.q) { const nx = tr.slice(i + 1).find(z => z.first), qe = nx ? nx.a - 0.08 : 99; q = Math.max(q, A2.spring(t, s.a - 0.05, 1.7, 0.38) * (t < qe ? 1 : Math.exp(-(t - qe) * 5))); } });
  const LK = [[0, [0, 0.15]], [0.35, [0.62, 0.05]], [2.0, [0.15, 0.45]], [2.75, [0.64, 0.0]]], look = ACT.saccade(lt, LK, 0.06, 3);
  const sp = ACT.pulse(lt, 0.42, 0.7), worry = clamp((lt - 3.6) / 0.4, 0, 1) * 0.45, after = lt > 4.95;
  const bl = Math.max(ACT.blinks(lt, ACT.saccadeBlinks(LK, 0.5).concat([1.78, 3.62]), 0.17), ACT.blinks(lt, [5.45], 0.42));
  const mouth = lp.s ? { v: lp.v, o: lp.o, c: 1.5 } : { v: ACT.VIS.M, o: 0, c: after ? 3.5 : 2 };
  const st = A2.pose({}), g = A2.actK(lt, 2.8, 0.32, { anticAmt: 0.15 }) * (1 - A2.actK(lt, 4.4, 0.45, { antic: 0.05, anticAmt: 0, over: 0 }));
  const pose = A2.blend(st, A2.pose({ hR: [306, 352], bend: { aR: 1 } }), clamp(g, -0.2, 1.15), 0.3);
  w += acZ('_a1R', { eyes: { open: 1 - bl, size: 1 + 0.24 * sp, squint: after ? 0.25 : 0.05 }, brow: { raise: bro * 4 + q * 9 + sp * 12, worry }, mouth: !lp.s && sp > 0.25 ? { v: ACT.VIS.O, o: 0.45 * sp } : mouth, blush: 0.4,
    fx: tt => ACT.sym('?', 330, 30, lt, 5.05, 9) }, { x: AC.XR, y: AC.CY, s: AC.CS, t, pose, look, tilt: q * 8 - nod * 1.5, headDy: nod * 5, headSq: [1 - 0.03 * sp, 1 + 0.05 * sp], handR: g > 0.3 ? 'open' : null, handRotR: -12, turn: 0.25 });
  return w;
}

/* 2. 눈 연기: 생각 → 깨달음 */
function act2Scene(t, lt, a) {
  let w = acBg('생각하다가 떠올렸을 때 — 시선은 휙 옮겨 가 멈추고, 깨달으면 꽉 감았다 팡');
  w += Z({ x: AC.XL, y: AC.CY, s: AC.CS, t, pose: poseAt([[0, '서기'], [0.7, '턱괴기'], [3.15, '만세']], lt), ex: exprAt([[0, 'z기본'], [0.7, 'z의심'], [3.15, 'z반짝']], lt) });
  const LK = [[0, [0, 0.1]], [0.7, [-0.8, -0.85]], [1.7, [0.75, -0.75]], [2.4, [-0.25, 0.55]], [3.15, [0, -0.15]], [3.8, [0.05, 0.05]]];
  const look = ACT.saccade(lt, LK, 0.06, 5), idea = 3.15;
  const th = clamp(A2.actK(lt, 0.7, 0.4, { anticAmt: 0.1 }), 0, 1.1) * (lt < idea ? 1 : 0);
  const squeeze = lt > idea - 0.2 && lt < idea ? Math.sin(prog(lt, idea - 0.2, idea) * Math.PI / 2) : 0;
  const p = ACT.pop(lt, idea, 2.4, 0.3), pu = ACT.pulse(lt, idea, 0.38), on = lt >= idea;
  const bl = Math.max(ACT.blinks(lt, ACT.saccadeBlinks(LK, 0.9), 0.17), squeeze, ACT.natBlink(lt, 4) * (lt > 3.9 ? 1 : 0));
  const tilt = A2.follow(tt => ACT.saccade(tt, LK, 0.06, 5)[0] * -7 * (tt > 0.7 && tt < idea ? 1 : 0), lt, 2.2, 0.4, 0.8, 18);
  const turn = A2.follow(tt => ACT.saccade(tt, LK, 0.06, 5)[0] * 0.55, lt, 2.6, 0.45, 0.8, 18);
  // 생각하는 자세(🤔): 오른손은 턱, 오른 팔꿈치는 배 앞을 가로지른 왼팔 위에 얹는다
  const st = A2.pose({}), chin = A2.pose({ hR: [226, 290], elbowR: [246, 372], hL: [258, 384], elbowL: [126, 360], dy: 3 }), up = A2.pose({ hR: [326, 214], hL: [150, 412], dy: 0, bend: { aR: 1 } });
  let pose = A2.blend(st, chin, th, 0.2);
  if (on) pose = A2.blend(chin, up, clamp(A2.actK(lt, idea + 0.02, 0.22, { antic: 0.06, anticAmt: 0.15, over: 0.12 }), -0.2, 1.15), 0.3);
  else if (squeeze > 0) pose = A2.pose({ hR: [226, 290], elbowR: [246, 372], hL: [258, 384], elbowL: [126, 360], dy: 3 + 8 * squeeze });
  const mouth = on ? (lt < idea + 0.3 ? { v: ACT.VIS.O, o: 0.95, c: 0 } : { v: ACT.VIS.E, o: 0.55, c: 5 }) : { v: ACT.VIS.U, o: 0.42 * th, c: -1 };
  w += acZ('_a2R', { eyes: { squeeze: squeeze > 0.35 ? 1 : 0, open: 1 - bl, size: 1 + 0.13 * p, squint: on ? 0.1 : 0.25 * th + 0.6 * squeeze, sparkle: on ? clamp(p, 0, 1) * (0.35 + 0.65 * Math.exp(-(lt - idea) * 2)) : 0 },
    brow: { raise: on ? 12 * p : 0, asymL: 7 * th, asymR: -4 * th, angry: 0.18 * th + 0.5 * squeeze }, mouth, blush: on ? 0.6 : 0.35,
    fx: tt => ACT.sym('dots', 300, 18, lt, 1.0, idea - 0.15) + ACT.sym('bulb', 330, 44, lt, idea + 0.05, 99), hfx: tt => ACT.sym('burst', 10, 40, lt, idea, idea + 0.35) },
    { x: AC.XR, y: AC.CY, s: AC.CS, t, pose, look, tilt: tilt - 3 * th, turn, headDy: 5 * squeeze - 4 * pu, headSq: [1 - 0.05 * pu, 1 + 0.08 * pu], handR: on ? 'point' : (th > 0.4 ? 'fist' : null), handRotR: on ? -90 : null, armFront: !on && th > 0.4 ? 'R' : null });
  return w;
}

/* 3. 표정 전환: 칭찬받았을 때 */
function act3Scene(t, lt, a) {
  let w = acBg('칭찬받았을 때 — 눈썹 → 웃는 눈 → 입꼬리 → 입 → 볼 순서로 번진다');
  w += acBubble(AC.XL + 300, 290, '친구: 최고야!', lt, 0.6, 99, 1) + acBubble(AC.XR + 300, 290, '친구: 최고야!', lt, 0.6, 99, 1);
  w += Z({ x: AC.XL, y: AC.CY, s: AC.CS, t, ex: exprAt([[0, 'z기본'], [1.0, 'z빵긋']], lt), look: lt > 0.65 ? [0.6, -0.3] : [0, 0] });
  const LK = [[0, [0, 0.1]], [0.65, [0.7, -0.35]], [1.45, [0.15, -0.05]]], look = ACT.saccade(lt, LK, 0.06, 7);
  const bl = Math.max(ACT.blinks(lt, [0.76, 0.98], 0.15), lt > 3.9 && lt < 4.8 ? 1 : 0, ACT.blinkK(lt, 4.8, 0.25) * 0 + (lt > 4.8 && lt < 4.95 ? 1 - prog(lt, 4.8, 4.95) : 0));
  const sq = 0.85 * easeInOut(prog(lt, 1.1, 1.5)), brR = 6 * A2.spring(lt, 1.0, 2.2, 0.35), c = lerp(0, 6, easeInOut(prog(lt, 1.15, 1.4)));
  const mo = 0.55 * A2.spring(lt, 1.35, 2.4, 0.35) + (lt > 3.9 && lt < 4.8 ? 0.3 * Math.sin(prog(lt, 3.9, 4.8) * Math.PI) : 0);
  const blush = lerp(0.15, 1, easeInOut(prog(lt, 1.2, 1.8))), pu = ACT.pulse(lt, 1.35, 0.42), hk = clamp((lt - 1.8) / 0.5, 0, 1);
  const st = A2.pose({}), clap = A2.pose({ hL: [182, 338], hR: [218, 338], dy: 2 }), k = clamp(A2.actK(lt, 1.3, 0.3, { anticAmt: 0.12 }), -0.2, 1.12);
  const sw = Math.sin((lt - 1.8) * 4.6) * hk;
  w += acZ('_a3R', { eyes: { open: 1 - bl, size: 1 + 0.08 * ACT.pulse(lt, 0.7, 0.4), squint: sq + (lt > 3.9 ? 0.15 : 0), sparkle: 0.3 * hk }, brow: { raise: brR }, blush, lines: clamp((lt - 1.6) / 0.3, 0, 1),
    mouth: mo > 0.05 ? { v: lt > 3.9 && lt < 4.8 ? ACT.VIS.A : ACT.VIS.E, o: Math.min(mo, 1), c } : { v: ACT.VIS.M, o: 0, c },
    fx: tt => ACT.sym('spark', 330, 262, lt, 1.6, 99) + ACT.sym('heart', 50, 210, lt, 1.75, 99) },
    { x: AC.XR, y: AC.CY, s: AC.CS, t, pose: A2.blend(st, clap, k, 0.25), look, rot: sw * 3, tilt: A2.follow(tt => Math.sin((tt - 1.8) * 4.6) * clamp((tt - 1.8) / 0.5, 0, 1) * 7, lt, 2, 0.4, 0.8, 16),
      headDy: 7 * easeInOut(prog(lt, 1.3, 1.6)), headSq: [1 + 0.05 * pu, 1 - 0.06 * pu], handL: null, handR: null });
  return w;
}

/* 4. 깜짝: 두 번 보기 */
function act4Scene(t, lt, a) {
  let w = acBg('흘끗 → 못 본 척 → 멈칫 → 다시 홱(두 번 보기)', true);
  const tp = 1.72, yl = AC.GY;
  w += acCard(AC.XL + 300, 600, lt, 0.6) + acCard(AC.XR + 300, 600, lt, 0.6);
  // 왼쪽
  w += acShadow(AC.XL, yl) + Z({ x: AC.XL, y: yl, s: AC.FS, t, pose: poseAt([[0, '서기'], [tp, '만세'], [2.4, '서기']], lt), ex: exprAt([[0, 'z기본'], [tp, 'z충격'], [2.4, 'z당황']], lt) });
  // 오른쪽
  const hum = lt < 1.5, LK = [[0, [0, 0]], [0.95, [0.85, 0.05]], [1.15, [0, -0.1]], [tp, [1, 0]], [3.3, [0.05, 0.1]]], look = ACT.saccade(lt, LK, lt > tp - 0.05 && lt < tp + 0.2 ? 0.03 : 0.07, 9);
  const closed = (lt < 0.85 || (lt > 1.25 && lt < 1.5)) ? 1 : 0, beat = lt >= 1.5 && lt < tp;
  const p = ACT.pop(lt, tp, 2.6, 0.3), pu = ACT.pulse(lt, tp, 0.26);
  const crouch = lt > tp - 0.14 && lt < tp ? Math.sin(prog(lt, tp - 0.14, tp) * Math.PI / 2) : 0, air = lt >= tp && lt < tp + 0.38, u = prog(lt, tp, tp + 0.38);
  const yJ = air ? Math.sin(u * Math.PI) * 60 : 0, [qx, qy] = A2.squash(lt, tp + 0.38, 0.16, 0.3);
  const sx = qx * (air ? 1 / Math.sqrt(1 + 0.1 * Math.sin(u * Math.PI)) : 1), sy = qy * (air ? 1 + 0.1 * Math.sin(u * Math.PI) : 1);
  const st = A2.pose({}), hum0 = A2.pose({ hL: [160, 404], hR: [240, 404] }), yikes = A2.pose({ hL: [72, 236], hR: [328, 236], dy: crouch * 12 }), scared = A2.pose({ hL: [184, 318], hR: [216, 318] });
  let pose = hum0; if (crouch > 0) pose = A2.pose({ hL: [150, 420], hR: [250, 420], dy: crouch * 14 }); if (lt >= tp) pose = A2.blend(hum0, yikes, clamp(A2.actK(lt, tp, 0.16, { antic: 0, over: 0.15 }), 0, 1.15), 0.2);
  if (lt >= 2.4) pose = A2.blend(yikes, scared, clamp(A2.actK(lt, 2.4, 0.3, { antic: 0.05 }), 0, 1.1), 0.2);
  const turn = lerp(0, 0.9, A2.spring(lt, tp, 2.8, 0.4)) * (1 - A2.spring(lt, 3.3, 1.8, 0.6));
  const sway = hum ? Math.sin(lt * 3.2) : 0, shiver = lt > 2.4 && lt < 3.1;
  const eyesO = { open: closed ? 0 : 1 - ACT.blinks(lt, [3.25], 0.17), squint: closed ? 0.7 : (lt < 1.5 ? 0.35 : 0), size: lt >= tp ? 1 + 0.3 * p - 0.18 * clamp((lt - 2.4) / 0.6, 0, 1) : (beat ? 1.2 : 1) };
  const mouth = hum ? { v: ACT.VIS.U, o: 0.45, c: 1 } : beat ? null : lt < 2.4 ? { v: ACT.VIS.A, o: 1, c: -3 } : lt < 3.3 ? null : { v: ACT.VIS.E, o: 0.45, c: [-1, 2.5], wob: 0.3 };
  w += acShadow(AC.XR, yl, 70 * (1 - yJ / 300)) + `<g transform="translate(${AC.XR} ${yl}) scale(${f1(sx * 1000) / 1000} ${f1(sy * 1000) / 1000}) translate(${-AC.XR} ${-yl})">` +
    acZ('_a4R', { mouthPath: beat ? 'M188 238 L212 238' : null, base: lt >= 2.4 ? 'z당황' : 'z기본', eyes: eyesO, brow: { raise: beat ? 9 : lt >= tp ? 10 * p * (lt < 2.4 ? 1 : 0.4) : 0, worry: lt >= 3.3 ? 0.6 : lt >= 2.4 ? 0.9 : 0 }, mouth, blush: lt >= 2.4 ? 0.2 : 0.4,
      fx: tt => ACT.sym('note', 330, 40, lt, 0.1, 1.45), hfx: tt => ACT.sym('!', 338, 70, lt, tp + 0.02, 3.1) + ACT.sym('burst', 0, 0, lt, tp, tp + 0.4) + ACT.sym('sweat', 280, 100, lt, 2.35, 99) },
      { x: AC.XR, y: yl - yJ, s: AC.FS, t, pose, look, rot: sway * 3, tilt: sway * 5 + (lt >= tp && lt < 2.4 ? -4 : 0), turn, headSq: [1 - 0.05 * pu, 1 + 0.08 * pu], headDy: crouch * 6, shiver, handL: null, handR: null }) + `</g>`;
  if (lt > tp + 0.38 && lt < tp + 0.75) w += puff(AC.XR, yl, t, t - lt + tp + 0.38, 0.8);
  return w;
}

/* 5. 감정은 몸 전체로 */
function act5Scene(t, lt, a) {
  const PH = [['shy', 0.2, '부끄러움', 'z민망'], ['sad', 2.45, '시무룩', 'z울먹'], ['joy', 4.75, '신남', 'z빵긋']];
  let i = 0; while (i + 1 < PH.length && lt >= PH[i + 1][1]) i++;
  const [nm, ts, ko] = PH[i], pl = lt - ts;
  let w = acBg('같은 표정이라도 몸 전체가 말하면 멀리서도 읽힌다', true);
  w += `<g transform="translate(960 232) scale(${f1(ACT.symK(lt, ts, PH[i + 1] ? PH[i + 1][1] - 0.2 : 99) * 100) / 100})">` + label(0, 0, ko, { size: 46, bg: '#fff' }) + `</g>`;
  w += acShadow(AC.XL, AC.GY) + Z({ x: AC.XL, y: AC.GY, s: AC.FS, t, ex: exprAt(PH.map(p => [p[1], p[3]]), lt) });
  // 오른쪽: 이전 감정 몸짓에서 0.35초 동안 섞여 들어감
  const cur = ACT.attitude(nm, lt), k = easeInOut(clamp(pl / 0.35, 0, 1));
  let at = cur; if (i > 0 && k < 1) { const pv = ACT.attitude(PH[i - 1][0], lt); at = Object.assign({}, cur, { pose: A2.blend(pv.pose, cur.pose, k, 0.2), rot: lerp(pv.rot, cur.rot, k), tilt: lerp(pv.tilt, cur.tilt, k), headDy: lerp(pv.headDy, cur.headDy, k), sx: lerp(pv.sx, cur.sx, k), sy: lerp(pv.sy, cur.sy, k), hop: lerp(pv.hop || 0, cur.hop || 0, k) }); }
  else if (i === 0) { const k0 = easeInOut(clamp((lt - 0.2) / 0.35, 0, 1)); at = ACT.attitude(nm, lt, k0); }
  let face, look = at.look, fx = '';
  if (nm === 'shy') { const LK = [[0, [0.7, 0.55]], [ts + 0.95, [0.05, 0.02]], [ts + 1.3, [0.75, 0.6]]]; look = ACT.saccade(lt, LK, 0.06, 11);
    face = { base: 'z민망', eyes: { open: 1 - ACT.blinks(lt, [ts + 1.28], 0.16), squint: 0.25, size: pl > 0.95 && pl < 1.3 ? 1.06 : 1 }, brow: { worry: 0.45 }, blush: 1, lines: 1, mouthPath: 'M186 236 Q193 242 200 236 Q207 230 214 236' }; }
  else if (nm === 'sad') { face = { base: 'z기본', eyes: { open: 0.62 - 0.62 * ACT.blinks(lt, [ts + 1.25], 0.45), wet: 0.9, size: 1.04 }, brow: { worry: 1 }, blush: 0.25, mouth: { v: ACT.VIS.M, o: 0, c: -6 } };
    fx = ACT.sym('gloom', 0, 0, lt, ts + 0.3, 99); }
  else { face = { base: 'z빵긋', eyes: { open: 1, squint: 0.88, sparkle: 0.5 }, brow: { raise: 6 }, blush: 0.75, mouth: { v: ACT.VIS.A, o: 0.85, c: 5 } };
    fx = ACT.sym('spark', 330, 60, lt, ts + 0.2, 99) + ACT.sym('note', 72, 30, lt, ts + 0.45, 99); }
  const hop = at.hop || 0, fxS = fx;
  w += acShadow(AC.XR, AC.GY, 70 * (1 - hop / 300)) + `<g transform="translate(${AC.XR} ${AC.GY}) scale(${f1(at.sx * 1000) / 1000} ${f1(at.sy * 1000) / 1000}) translate(${-AC.XR} ${-AC.GY})">` +
    acZ('_a5R', Object.assign(face, { fx: fxS }), { x: AC.XR, y: AC.GY - hop, s: AC.FS, t, pose: at.pose, look, rot: at.rot, tilt: at.tilt, headDy: at.headDy, handL: nm === 'joy' ? 'fist' : null, handR: nm === 'joy' ? 'fist' : null }) + `</g>`;
  return w;
}
