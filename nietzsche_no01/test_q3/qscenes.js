/* Q3 test: the refusal scene with animation fundamentals — AI background plates, shot list (wide / over-the-shoulder / close-up / insert),
   own camera with parallax, anticipation (inhale), squash & stretch, follow-through (papers), lip-sync from the voice envelope, word-timed beats. */
Object.assign(CAMS, { qwide: 'fixed', qots: 'fixed', qcu: 'fixed', qtj: 'fixed', qleave: 'fixed', qexhale: 'fixed' });
const QBG = { wide: 'ai/wide.png', close: 'ai/close.png' };
// background plate covering the whole visible world (render() shrinks the world by .88 around (960,100))
const qPlate = (k, cam, depth = 0.55, o = {}) => {
  const [cx, cy, z] = cam, zb = 1 + (z - 1) * depth, bx = 960 + (cx - 960) * depth, by = 560 + (cy - 560) * depth;
  return `<g transform="translate(960 560) scale(${f1(zb * 1000) / 1000}) translate(${f1(-bx)} ${f1(-by)})"><image href="${QBG[k]}" x="-150" y="-30" width="2220" height="1250" preserveAspectRatio="xMidYMid slice"${o.blur ? ' filter="url(#qblur)"' : ''}/></g>`;
};
const qCam = (cam, inner) => `<g transform="translate(960 560) scale(${f1(cam[2] * 1000) / 1000}) translate(${f1(-cam[0])} ${f1(-cam[1])})">${inner}</g>`;
const qLerpCam = (k, A, B) => { k = easeInOut(clamp(k, 0, 1)); return [lerp(A[0], B[0], k), lerp(A[1], B[1], k), lerp(A[2], B[2], k)]; };
const qDefs = () => `<defs><filter id="qblur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="6"/></filter><filter id="qfg" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
<radialGradient id="qsun" cx="1" cy=".35" r=".9"><stop offset="0" stop-color="#FFB46A" stop-opacity=".55"/><stop offset="1" stop-color="#FFB46A" stop-opacity="0"/></radialGradient></defs>`;
const qShadow = (x, y, w, k = 1) => `<ellipse cx="${f1(x)}" cy="${f1(y + 6)}" rx="${f1(w)}" ry="${f1(w * 0.22)}" fill="#2A1A30" opacity="${f1(0.38 * k * 100) / 100}"/>`;
const qTalk = (base, k) => Object.assign({}, E[base], { mouth: ell(200, 238, 10 + 3 * k, 3 + 13 * k), mouthFill: '#5A1E2A' });
const ZX = 820, TX = 1250, FY = 960;
const zeroAt = (t, o) => HALO(char(Object.assign({ goggles: 'none', vest: TEE, patch: false, tee: true, vshade: 'rgba(150,60,0,0.22)', topknot: false, robe: false, t, seed: 61 }, o)));
const tjAt = (t, o) => HALO(TJ(Object.assign({ t, seed: 62 }, o)));
const carry = (x, y, s, phase, amp) => Object.assign({}, walkPose(phase, amp), { armL: P['들기'].armL, hL: P['들기'].hL, armR: P['들기'].armR, hR: P['들기'].hR });
const warm = k => `<rect x="-200" y="-100" width="2400" height="1400" fill="url(#qsun)" opacity="${f1(k * 100) / 100}"/>`;

/* S1 wide: team leader walks in with the pile */
function qwideScene(t, lt, a) {
  const cam = qLerpCam(lt / 2.2, [980, 600, 1.0], [960, 590, 1.05]);
  const u = clamp(lt / 1.8, 0, 1), tx = lerp(2200, TX, easeOut(u)), walking = u < 1, s = 1.05;
  const bob = walking ? 0 : Math.sin((lt - 1.8) * 14) * 4 * Math.exp(-(lt - 1.8) * 6);  // settle after stopping
  let ch = qShadow(ZX, FY, 70) + zeroAt(t, { x: ZX, y: FY, s: 1.0, pose: '서기', ex: exprAt([[0, '기본'], [1.4, '걱정']], lt), look: lt > 0.8 ? [0.9, 0] : [0.2, 0.1] });
  const pose = walking ? carry(tx, FY, s, lt * 9, 0.75) : P['들기'];
  const hold = ptOf(tx, FY, s, 200, 364);
  ch += qShadow(tx, FY, 74) + flip(tx, tjAt(t, { x: tx, y: FY + bob, s, pose, ex: exprAt([[0, '신남']], lt), look: [0.8, 0] }));
  ch += nStack(hold[0] + (walking ? Math.sin(lt * 9) * 3 : 0), hold[1] + 6 + bob, 9, { rot: walking ? Math.sin(lt * 9 + 1) * 3 : bob * 0.5 });
  return qDefs() + qPlate('wide', cam) + qCam(cam, ch) + warm(0.6);
}
/* S2 over-the-shoulder: Zero breathes in (anticipation) */
function qotsScene(t, lt, a) {
  const cam = qLerpCam(lt / 1.3, [900, 640, 1.65], [880, 630, 1.75]);
  const inh = Math.sin(clamp(lt / 1.05, 0, 1) * Math.PI);             // in ... and out
  let ch = qShadow(ZX, FY, 70) + zeroAt(t, { x: ZX, y: FY, s: 1.0, sy: 1 + 0.045 * inh, sx: 1 - 0.015 * inh, pose: mixPose('서기', '만세', 0.06 * inh), ex: exprAt([[0, '걱정'], [0.35, '잠'], [0.9, '결심']], lt), look: [0.9, -0.1] });
  // the leader's shoulder + head in the foreground, blurred (moves more than the background = parallax)
  const fx0 = 1400 + (cam[0] - 900) * 0.4;
  const fg = `<g filter="url(#qblur)" opacity=".96"><path d="M${fx0 - 260} 1250 Q${fx0 - 230} 880 ${fx0} 860 Q${fx0 + 240} 880 ${fx0 + 270} 1250 Z" fill="#46526A" stroke="${INK}" stroke-width="10"/><circle cx="${fx0}" cy="700" r="190" fill="#2F2F33" stroke="${INK}" stroke-width="10"/><path d="M${fx0 - 120} 600 q60 -50 120 -20" stroke="#555" stroke-width="12" fill="none"/></g>`;
  return qDefs() + qPlate('close', cam, 0.35, { blur: true }) + qCam(cam, ch) + qCam([cam[0], cam[1], cam[2] * 1.08], fg) + warm(0.5);
}
/* S3 close-up: "죄송하지만 이번엔 제가 맡기 어렵습니다" with an insert of his trembling hand */
function qcuScene(t, lt, a) {
  const W = a._words || [], at = (key, fb) => { const w = W.find(x => x.w.includes(key)); return w ? w.t + 0.15 : fb; };
  const tIns0 = at('이번엔', 1.1), tIns1 = at('제가', 2.3), tNo = at('어렵', 3.0);
  if (lt > tIns0 && lt < tIns1) { // insert: hand gripping the trouser seam, trembling
    const k = prog(lt, tIns0, tIns1), sh = Math.sin(t * 70) * 5 * (1 - 0.4 * k);
    let h = qDefs() + qPlate('close', [ZX, 800, 2.6], 0.3, { blur: true }) + `<rect x="-200" y="-100" width="2400" height="1400" fill="#000" opacity=".3"/>`;
    h += `<g transform="translate(${f1(sh)} ${f1(sh * 0.4)})"><line x1="760" y1="-120" x2="930" y2="520" stroke="${INK}" stroke-width="44" stroke-linecap="round"/><ellipse cx="950" cy="600" rx="128" ry="112" fill="#fff" stroke="${INK}" stroke-width="14"/>` +
      `<path d="M872 560 q30 -26 62 0 M930 548 q30 -26 62 0 M980 578 q22 -18 44 0" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M880 650 q70 36 140 0" stroke="#D5E2EE" stroke-width="10" fill="none" stroke-linecap="round"/></g>`;
    for (let i = 0; i < 3; i++) h += `<path d="M${1120 + i * 26} ${520 + i * 56} q18 12 0 24 q-18 12 0 24" stroke="#fff" stroke-width="8" fill="none" opacity=".8"/><path d="M${780 - i * 26} ${520 + i * 56} q-18 12 0 24 q18 12 0 24" stroke="#fff" stroke-width="8" fill="none" opacity=".8"/>`;
    h += `<path d="M1090 430 q-16 28 0 44 q16 -16 0 -44 Z" fill="#8EDCFF" stroke="${INK}" stroke-width="5"/>`;
    return h + warm(0.35);
  }
  const cam = qLerpCam(lt / 4, [ZX, 600, 2.25], [ZX + 10, 595, 2.4]);
  const no = lt > tNo ? Math.sin((lt - tNo) * 9) * 4 * Math.exp(-(lt - tNo) * 1.5) : 0; // small head shake on "어렵습니다"
  E['_zt'] = qTalk('결심', env(t));
  let ch = qShadow(ZX, FY, 70) + zeroAt(t, { x: ZX, y: FY, s: 1.0, rot: -1.5, tilt: no, pose: '서기', ex: { expr: '_zt', prev: '_zt', k: 1, blink: 0 }, look: [0.85, -0.05] });
  return qDefs() + qPlate('close', cam, 0.3, { blur: true }) + qCam(cam, ch) + warm(0.45);
}
/* S4 close-up on the leader: surprised, then a light shrug */
function qtjScene(t, lt, a) {
  const W = a._words || [], at = (key, fb) => { const w = W.find(x => x.w.includes(key)); return w ? w.t + 0.15 : fb; };
  const tOk = at('알겠', 0.9);
  const cam = qLerpCam(lt / 1.6, [TX, 590, 2.15], [TX - 10, 595, 2.25]);
  const sur = Math.exp(-Math.max(0, lt - 0.12) * 5) * (lt > 0.12 ? 1 : 0);   // squash-stretch pop of surprise
  const shrug = lt > tOk ? Math.sin(clamp((lt - tOk) / 0.5, 0, 1) * Math.PI) : 0;
  E['_tt'] = qTalk(lt < tOk ? '놀람' : '기본', env(t));
  let ch = qShadow(TX, FY, 74) + tjAt(t, { x: TX, y: FY - 10 * shrug, s: 1.05, sy: 1 + 0.05 * sur, sx: 1 - 0.03 * sur, pose: mixPose('들기', '만세', 0.08 * shrug), ex: { expr: '_tt', prev: '_tt', k: 1, blink: 0 }, look: [-0.85, -0.05] });
  const hold = ptOf(TX, FY - 10 * shrug, 1.05, 200, 364); ch += nStack(hold[0], hold[1] + 6, 9, { rot: shrug * 2 });
  return qDefs() + qPlate('close', [cam[0] - 300, cam[1], cam[2]], 0.3, { blur: true }) + qCam(cam, ch) + warm(0.55);
}
/* S5 medium: he turns (squash) and walks off; the pile lags behind (follow-through) */
function qleaveScene(t, lt, a) {
  const cam = [1080, 610, 1.22];
  const turn = clamp(lt / 0.28, 0, 1), go = clamp((lt - 0.28) / 1.4, 0, 1), tx = lerp(TX, 2250, easeIn(go)), s = 1.05;
  const sx = lt < 0.28 ? 1 - 0.55 * Math.sin(turn * Math.PI) : 1;
  const pose = go > 0 ? carry(tx, FY, s, lt * 9, 0.75) : P['들기'];
  let ch = qShadow(ZX, FY, 70) + zeroAt(t, { x: ZX, y: FY, s: 1.0, pose: '서기', ex: exprAt([[0, '결심'], [0.8, '놀람']], lt), look: [0.9, 0] });
  ch += qShadow(tx, FY, 74) + tjAt(t, { x: tx, y: FY, s, sx, pose, ex: exprAt([[0, '기본']], lt), look: [0.8, 0] });
  const hold = ptOf(tx, FY, s, 200, 364), lag = go > 0 ? Math.sin(lt * 9 - 0.8) * 5 : (lt < 0.4 ? Math.sin(lt * 20) * 6 * (1 - lt / 0.4) : 0);
  ch += nStack(hold[0] - lag, hold[1] + 6, 9, { rot: -lag * 0.8 });
  return qDefs() + qPlate('wide', cam) + qCam(cam, ch) + warm(0.65);
}
/* S6 wide: the exhale. Shoulders drop, he smiles; the sunset warms the room */
function qexhaleScene(t, lt, a) {
  const cam = qLerpCam(lt / 3.2, [900, 620, 1.1], [860, 600, 1.3]);
  const ex = Math.sin(clamp(lt / 1.2, 0, 1) * Math.PI);
  let ch = qShadow(ZX, FY, 70) + zeroAt(t, { x: ZX, y: FY + 6 * ex, s: 1.0, sy: 1 - 0.05 * ex, sx: 1 + 0.02 * ex, pose: '서기', ex: exprAt([[0, '놀람'], [0.5, '잠'], [1.3, '뿌듯']], lt), look: [0.3, -0.3] });
  for (let i = 0; i < 3; i++) { const k = clamp((lt - 0.2 - i * 0.12) / 0.8, 0, 1); if (k > 0 && k < 1) ch += `<path d="M${ZX + 20 + i * 10} ${f1(470 - k * 40)} q30 -10 60 0" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity="${f1((1 - k) * 100) / 100}"/>`; }
  if (lt > 1.6) ch += rSparks(ZX, 420, t, 6, 140);
  return qDefs() + qPlate('wide', cam) + qCam(cam, ch) + warm(0.6 + 0.4 * prog(lt, 1.0, 3.0));
}
