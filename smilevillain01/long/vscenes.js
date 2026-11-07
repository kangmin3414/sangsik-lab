/* 스마일 가스라이팅 선배 편 — 인트로 샘플. test_q3 방식: 사람 없는 AI 배경 판 + 자체 카메라·원근감 + 숨·탄력·출렁임 + 입 모양 + 단어 타이밍.
   이름 규칙: 이 편의 함수·상수는 모두 v 접두사. */
delete QBG.wide; delete QBG.close;
Object.assign(QBG, { pantry: 'ai/pantry.png', pantry_c: 'ai/pantry_c.png', street: 'ai/street.png', street_c: 'ai/street_c.png' });
['vpantry', 'vgive', 'vlook', 'vwhisper', 'vfreeze', 'vgive2', 'vghost', 'vwalk'].forEach(k => CAMS[k] = 'fixed');

/* ---------- shared ---------- */
const vAt = (a, key, fb) => { const w = (a._words || []).find(x => x.w.replace(/\s/g, '').includes(key)); return w ? w.t + 0.15 : fb; };
const vFull = (c, op = 1) => `<rect x="-300" y="-200" width="2600" height="1500" fill="${c}" opacity="${op}"/>`;
const VFY = 960, VZX = 420, VSX = 900;
const vCool = k => vFull('#7FA9C9', 0.12 * k);           // cold office fluorescent tint
const vNight = k => vFull('#1A2140', 0.25 * k);
// Zero: orange hoodie (engine hoodie option), the senior: soft blue shirt, neat hair, a lanyard — the friendliest-looking man in the office
const vZero = (t, o) => HALO(char(Object.assign({ goggles: 'none', vest: '#F28C38', patch: false, tee: true, vshade: 'rgba(150,60,0,0.22)', hoodie: 'rgba(120,40,0,0.18)', seed: 61, t }, o)));
const vSen = (t, o) => HALO(char(Object.assign({ goggles: 'none', vest: '#9DC0E0', patch: false, tee: true, vshade: 'rgba(0,40,90,0.2)', collar: true, hair: '#2B2622', seed: 63, t }, o)) +
  `<g transform="translate(${f1(o.x)} ${f1(o.y)}) scale(${f1((o.s || 1) * 1000) / 1000}) translate(-200 -560) translate(0 ${f1(((typeof o.pose === 'string' ? P[o.pose] : o.pose) || P['서기']).dy || 0)})"><path d="M176 262 L200 330 L224 262" fill="none" stroke="#3E6FB0" stroke-width="5"/><rect x="186" y="326" width="28" height="36" rx="5" fill="#fff" stroke="${INK}" stroke-width="4"/></g>`);
const vMac = (x, y, s = 1, crush = 0) => {   // a small clear box with two pastel macarons
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 100) / 100})"><rect x="-46" y="-30" width="92" height="56" rx="10" fill="#E8F4FF" fill-opacity=".55" stroke="${INK}" stroke-width="5"/>`;
  [['#F7A8C0', -20], ['#B9E3A8', 20]].forEach(([c, dx]) => { h += `<g transform="translate(${dx} 0) scale(1 ${f1((1 - 0.35 * crush) * 100) / 100})"><ellipse cx="0" cy="-8" rx="17" ry="9" fill="${c}" stroke="${INK}" stroke-width="3"/><rect x="-15" y="-6" width="30" height="7" fill="#FFF6E8" stroke="${INK}" stroke-width="2"/><ellipse cx="0" cy="8" rx="17" ry="9" fill="${c}" stroke="${INK}" stroke-width="3"/></g>`; });
  return h + '</g>';
};
const vTumbler = (x, y, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-20" y="-56" width="40" height="72" rx="10" fill="#7FB9A8" stroke="${INK}" stroke-width="5"/><rect x="-22" y="-62" width="44" height="12" rx="4" fill="#3E5A52" stroke="${INK}" stroke-width="4"/></g>`;
const vPose = (base, o) => Object.assign({}, typeof base === 'string' ? P[base] : base, o);
if (!P['안기']) P['안기'] = vPose('서기', { armL: [[148, 285], [128, 336], [176, 360]], hL: [184, 362], armR: [[252, 285], [272, 336], [224, 360]], hR: [216, 362] });
if (!P['내밀기']) P['내밀기'] = vPose('서기', { armL: [[148, 285], [118, 340], [112, 392]], hL: [112, 398], armR: [[252, 285], [318, 318], [372, 330]], hR: [380, 332] });
if (!E['미소']) E['미소'] = Object.assign(dotEyes(10, 13), { bL: [142, 150, 164, 144, 186, 148], bR: [214, 148, 236, 144, 258, 150], mouth: 'M180 228 Q200 246 220 228', mouthFill: 'none' });
if (!E['울먹']) E['울먹'] = Object.assign(dotEyes(9, 13), { bL: [142, 166, 164, 150, 186, 142], bR: [214, 142, 236, 150, 258, 166], mouth: 'M182 240 Q200 226 218 240', mouthFill: 'none', sweat: true });
P['막기'] = vPose('서기', { armL: [[148, 285], [92, 282], [40, 286]], hL: [32, 286], armR: [[252, 285], [308, 282], [360, 286]], hR: [368, 286] });
P['씻기'] = Object.assign({}, P['서기'], { armL: [[148, 285], [130, 340], [170, 372]], hL: [176, 374], armR: [[252, 285], [270, 340], [228, 372]], hR: [222, 374] });
P['어깨손'] = Object.assign({}, P['서기'], { armR: [[252, 285], [320, 300], [372, 312]], hR: [380, 312] });   // a hand reaching onto the other's shoulder

/* p0 wide: the quiet pantry, Zero washing his tumbler (faces the sink on the left, hands moving) */
function vpantryScene(t, lt, a) {
  const cam = qLerpCam(lt / 2.6, [900, 610, 1.0], [700, 600, 1.12]);
  const scrub = Math.sin(t * 9) * 8;
  const pose = Object.assign({}, P['씻기'], { hL: [176 + scrub, 330], hR: [222 + scrub, 330], armL: [[148, 285], [130, 320], [170 + scrub, 332]], armR: [[252, 285], [270, 320], [228 + scrub, 332]] });
  let ch = qShadow(VZX, VFY, 70) + vZero(t, { x: VZX, y: VFY, s: 1.0, pose, ex: exprAt([[0, '기본']], lt), look: [-0.6, 0.4] });
  ch += vTumbler(VZX - 2 + scrub, VFY - 236, 0.9);
  for (let i = 0; i < 3; i++) { const k = (t * 1.6 + i / 3) % 1; ch += `<circle cx="${f1(VZX - 10 + scrub + i * 8)}" cy="${f1(VFY - 150 + k * 40)}" r="4" fill="#BFE6FF" opacity="${f1((1 - k) * 100) / 100}"/>`; }
  return qDefs() + qPlate('pantry', cam) + qCam(cam, ch) + vCool(1);
}
/* p1 medium: the senior walks in from the right, smiles, holds out the macarons. Zero turns with a small pop */
function vgiveScene(t, lt, a) {
  const cam = qLerpCam(lt / 2.0, [720, 610, 1.2], [700, 600, 1.28]);
  const u = clamp(lt / 1.1, 0, 1), sx = lerp(1700, VSX - 150, easeOut(u)), walking = u < 1;
  const tGive = vAt(a, '이거', 1.4), give = clamp((lt - tGive + 0.3) / 0.4, 0, 1);
  const turn = clamp((lt - 0.5) / 0.25, 0, 1), pop = lt > 0.5 ? Math.exp(-(lt - 0.5) * 7) : 0;
  E['_st'] = qTalk('미소', env(t));
  let ch = qShadow(VZX, VFY, 70) + vZero(t, { x: VZX, y: VFY, s: 1.0, sy: 1 + 0.04 * pop, pose: P['씻기'], ex: exprAt([[0, '기본'], [0.55, '놀람'], [1.1, '미소']], lt), look: turn > 0.5 ? [0.8, 0] : [-0.6, 0.4] });
  ch += vTumbler(VZX - 2, VFY - 196, 0.9);
  const pose = walking ? walkPose(lt * 8, 0.7) : mixPose('서기', '내밀기', give);
  ch += qShadow(sx, VFY, 70) + flip(sx, vSen(t, { x: sx, y: VFY, s: 1.02, pose, ex: walking ? exprAt([[0, '미소']], lt) : { expr: '_st', prev: '_st', k: 1, blink: 0 }, look: [0.8, 0] }));
  const hand = ptOf(sx, VFY, 1.02, 200 + (give > 0 ? (380 - 200) * give : 86), give > 0 ? lerp(406, 332, give) : 400); hand[0] = 2 * sx - hand[0];
  ch += vMac(hand[0] - 10, hand[1] + 4, 0.9);
  return qDefs() + qPlate('pantry', cam) + qCam(cam, ch) + vCool(1);
}
/* p2 close-up: the senior glances left and right before speaking */
function vlookScene(t, lt, a) {
  const cam = qLerpCam(lt / 1.4, [VSX - 200, 600, 2.1], [VSX - 210, 595, 2.2]);
  const g = lt < 0.5 ? -0.8 : lt < 0.95 ? 0.8 : -0.5;
  const lx = VSX - 150, hd = ptOf(lx, VFY, 1.02, 380, 332); hd[0] = 2 * lx - hd[0];
  let ch = qShadow(lx, VFY, 70) + flip(lx, vSen(t, { x: lx, y: VFY, s: 1.02, pose: '내밀기', ex: exprAt([[0, '기본']], lt), look: [g, 0] })) + vMac(hd[0] - 10, hd[1] + 4, 0.9);
  return qDefs() + qPlate('pantry_c', [cam[0] - 200, cam[1], cam[2]], 0.3, { blur: true }) + qCam(cam, ch) + vCool(0.8);
}
/* p3~p6 the whisper. p3: over Zero's shoulder onto the senior leaning in · p4: close on Zero listening (worry grows)
   p5: insert — Zero's hand slowly crushing the macaron box · p6: two-shot, a friendly hand on Zero's shoulder */
function vwhisperScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3;
  E['_st'] = qTalk('미소', env(t));
  const lean = -9, sx = VSX - 160;
  const sen = (o = {}) => flip(sx, vSen(t, Object.assign({ x: sx, y: VFY, s: 1.02, rot: lean, pose: '서기', ex: { expr: '_st', prev: '_st', k: 1, blink: 0 }, look: [0.9, 0.1] }, o)));
  const zero = (ex, o = {}) => vZero(t, Object.assign({ x: VZX, y: VFY, s: 1.0, pose: '안기', ex: exprAt(ex, lt), look: [0.85, 0] }, o));
  const mac = (k = 0) => { const p = ptOf(VZX, VFY, 1.0, 200, 360); return vMac(p[0], p[1], 0.9, k); };
  if (id === 'p3') {
    const cam = qLerpCam(lt / D, [sx - 60, 600, 1.9], [sx - 80, 596, 2.05]);
    const fx0 = 620 + (cam[0] - 900) * 0.4;   // Zero's blurred shoulder in the foreground
    const fg = `<g filter="url(#qblur)" opacity=".96"><path d="M${fx0 - 260} 1250 Q${fx0 - 230} 880 ${fx0} 860 Q${fx0 + 240} 880 ${fx0 + 270} 1250 Z" fill="#F28C38" stroke="${INK}" stroke-width="10"/><circle cx="${fx0}" cy="700" r="190" fill="#fff" stroke="${INK}" stroke-width="10"/></g>`;
    return qDefs() + qPlate('pantry_c', [cam[0] - 250, cam[1], cam[2]], 0.35, { blur: true }) + qCam(cam, qShadow(sx, VFY, 70) + sen()) + qCam([cam[0], cam[1], cam[2] * 1.08], fg) + vCool(0.9);
  }
  if (id === 'p4') {
    const cam = qLerpCam(lt / D, [VZX + 10, 600, 2.2], [VZX + 10, 596, 2.45]);
    const tW = vAt(a, '수군', 0.6 * D);
    let ch = qShadow(VZX, VFY, 70) + zero([[0, '기본'], [tW, '걱정']]) + mac();
    // the whisper drifting into his ear
    for (let i = 0; i < 3; i++) { const k = (lt * 0.9 + i / 3) % 1; ch += `<path d="M${f1(VZX + 230 - k * 90)} ${f1(VFY - 400 + i * 10)} q14 -10 0 -20 q-14 -10 0 -20" stroke="#fff" stroke-width="6" fill="none" opacity="${f1(Math.sin(k * Math.PI) * 70) / 100}"/>`; }
    return qDefs() + qPlate('pantry_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + vCool(1);
  }
  if (id === 'p5') {   // insert: the hand around the box, squeezing as the words go on
    const k = clamp(lt / D, 0, 1), sh = Math.sin(t * 40) * 2 * k;
    let h = qDefs() + qPlate('pantry_c', [VZX, 800, 2.6], 0.3, { blur: true }) + vFull('#000', 0.25);
    h += `<g transform="translate(${f1(960 + sh)} 560) scale(4.2)">${vMac(0, 0, 1, 0.6 * k)}</g>`;
    h += `<g transform="translate(${f1(sh)} 0)"><path d="M480 980 Q560 760 700 690" stroke="${INK}" stroke-width="44" stroke-linecap="round" fill="none"/><ellipse cx="${f1(720 + 30 * k)}" cy="650" rx="110" ry="96" fill="#fff" stroke="${INK}" stroke-width="14"/>` +
      `<path d="M1440 980 Q1360 760 1220 690" stroke="${INK}" stroke-width="44" stroke-linecap="round" fill="none"/><ellipse cx="${f1(1200 - 30 * k)}" cy="650" rx="110" ry="96" fill="#fff" stroke="${INK}" stroke-width="14"/></g>`;
    return h + vCool(1);
  }
  // p6: two-shot, a hand lands on Zero's shoulder
  const cam = qLerpCam(lt / D, [580, 600, 1.45], [580, 596, 1.6]);
  const tPat = vAt(a, '둥글', 0.3 * D), pat = clamp((lt - tPat + 0.3) / 0.35, 0, 1);
  let ch = qShadow(VZX, VFY, 70) + zero([[0, '걱정'], [vAt(a, '알지', 0.85 * D), '당황']], { sy: 1 - 0.03 * pat }) + mac(0.6);
  ch += qShadow(sx, VFY, 70) + sen({ pose: mixPose('서기', '어깨손', pat), rot: lean * 0.6 });
  return qDefs() + qPlate('pantry', cam) + qCam(cam, ch) + vCool(1);
}
/* p7, n1: Zero frozen, the colour drains a little; a slow push */
function vfreezeScene(t, lt, a) {
  const D = a._dur || 2, id = a._id || '';
  const base = id === 'p7' ? [VZX, 600, 2.1] : [VZX, 596, 2.3];
  const cam = qLerpCam(lt / D, base, [base[0], base[1] - 4, base[2] + 0.15]);
  const p = ptOf(VZX, VFY, 1.0, 200, 360);
  let ch = qShadow(VZX, VFY, 70) + vZero(t, { x: VZX, y: VFY, s: 1.0, pose: '안기', still: true, noBlink: true, ex: exprAt([[0, '놀람']], lt), look: [0.3, 0.1] }) + vMac(p[0], p[1], 0.9, 0.6);
  return qDefs() + qPlate('pantry_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + vCool(1) + vFull('#3A4250', 0.08 + 0.08 * clamp(lt / D, 0, 1));
}
/* n2: the same moment again — a friendly hand pats his back, and on the wall its shadow is a dagger */
function vgive2Scene(t, lt, a) {
  const D = a._dur || 5, cam = qLerpCam(lt / D, [980, 610, 1.25], [990, 600, 1.35]);
  const tKnife = vAt(a, '비수', 0.8 * D), k = clamp((lt - tKnife + 0.2) / 0.4, 0, 1);
  if (lt > tKnife - 1.1) {   // insert: the friendly hand on the orange shoulder — and its shadow on the wall is a dagger
    const q = clamp((lt - tKnife + 1.1) / 0.9, 0, 1);
    let h = qDefs() + qPlate('pantry_c', [700, 560, 2.2], 0.3, { blur: true }) + vFull('#1A1E28', 0.18);
    h += `<g opacity="${f1((0.35 + 0.4 * q) * 100) / 100}"><path d="M1500 300 L1050 380" stroke="#141820" stroke-width="70" stroke-linecap="round"/><ellipse cx="1020" cy="385" rx="70" ry="60" fill="#141820"/>` +
      `<g transform="translate(960 392) rotate(186)" opacity="${f1(q * 100) / 100}"><path d="M0 -26 L360 0 L0 26 Z" fill="#141820"/><rect x="-90" y="-22" width="90" height="44" rx="12" fill="#141820"/><rect x="-12" y="-60" width="24" height="120" rx="6" fill="#141820"/></g></g>`;
    h += `<path d="M-100 1200 Q300 760 900 700 Q1300 690 1500 820 L1700 1200 Z" fill="#F28C38" stroke="${INK}" stroke-width="12"/>` +
      `<path d="M1900 560 Q1450 600 1180 720" stroke="${INK}" stroke-width="40" stroke-linecap="round" fill="none"/><ellipse cx="1150" cy="730" rx="110" ry="92" fill="#fff" stroke="${INK}" stroke-width="12"/>` +
      `<path d="M1075 700 q30 -22 60 0 M1135 692 q30 -22 60 0" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    return h + vCool(1) + vFull('#2A2F3A', 0.15 * q);
  }
  const sx = VSX - 150, p = ptOf(VZX, VFY, 1.0, 200, 360);
  let ch = qShadow(VZX, VFY, 70) + vZero(t, { x: VZX, y: VFY, s: 1.0, pose: '안기', ex: exprAt([[0, '걱정']], lt), look: [0.8, 0] }) + vMac(p[0], p[1], 0.9, 0.6);
  ch += qShadow(sx, VFY, 70) + flip(sx, vSen(t, { x: sx, y: VFY, s: 1.02, rot: -5, pose: '어깨손', ex: exprAt([[0, '미소']], lt), look: [0.9, 0] }));
  // their shadows on the back wall (behind them, bigger, offset up-left): the senior's patting hand becomes a dagger at Zero's back
  const sh = (x, w) => `<g opacity=".42" transform="translate(${x - 150} 640) scale(1.25)"><ellipse cx="0" cy="-330" rx="110" ry="104" fill="#1A1E28"/><path d="M-80 -220 L80 -220 L90 -40 L-90 -40 Z" fill="#1A1E28"/>${w}</g>`;
  ch = sh(VZX, '') + sh(sx, `<path d="M-60 -200 L-${f1(220 + 40 * k)} -170" stroke="#1A1E28" stroke-width="34" stroke-linecap="round"/>` +
    `<g transform="translate(-${f1(230 + 40 * k)} -170)" opacity="${f1(k * 100) / 100}"><path d="M0 -16 L-200 0 L0 16 Z" fill="#1A1E28"/><rect x="0" y="-14" width="56" height="28" rx="8" fill="#1A1E28"/><rect x="-4" y="-34" width="14" height="68" fill="#1A1E28"/></g>`) + ch;
  return qDefs() + qPlate('pantry', cam) + qCam(cam, ch) + vCool(1) + vFull('#2A2F3A', 0.15 * k);
}
/* n3: the 'third person's mouth' — faceless grey whisperers appear behind the senior, who spreads his arms like the only shield */
function vghostScene(t, lt, a) {
  const D = a._dur || 6, cam = qLerpCam(lt / D, [900, 600, 1.15], [900, 596, 1.25]);
  const tGhost = vAt(a, '제', 0.25 * D), tShield = vAt(a, '아군', 0.75 * D);
  const sx = VSX - 60, shield = clamp((lt - tShield + 0.3) / 0.4, 0, 1), sxx = lerp(sx, VZX + 300, shield);
  let ch = '';
  for (let i = 0; i < 3; i++) {
    const g = clamp((lt - tGhost - i * 0.25) / 0.6, 0, 1), gx = 1180 + i * 190, bob = Math.sin(t * 2 + i) * 6;
    ch += `<g opacity="${f1(g * 0.75 * 100) / 100}"><ellipse cx="${gx}" cy="${VFY - 330 + bob}" rx="70" ry="76" fill="#8A93A6"/><path d="M${gx - 80} ${VFY} Q${gx - 70} ${VFY - 240 + bob} ${gx} ${VFY - 250 + bob} Q${gx + 70} ${VFY - 240 + bob} ${gx + 80} ${VFY} Z" fill="#8A93A6"/>` +
      `<path d="M${gx - 90} ${VFY - 360 + bob} q-20 10 -36 0 M${gx - 96} ${VFY - 336 + bob} q-24 10 -44 0" stroke="#C9CDD6" stroke-width="5" fill="none" opacity="${f1((0.5 + 0.5 * Math.sin(t * 8 + i)) * 100) / 100}"/></g>`;
  }
  ch += qShadow(VZX, VFY, 70) + vZero(t, { x: VZX, y: VFY, s: 1.0, pose: '안기', ex: exprAt([[0, '걱정'], [tGhost + 0.5, '겁먹음']], lt), look: [0.8, 0] });
  ch += qShadow(sxx, VFY, 70) + vSen(t, { x: sxx, y: VFY, s: 1.02, pose: mixPose('서기', '막기', shield), ex: exprAt([[0, '미소']], lt), look: [-0.7, 0] });
  return qDefs() + qPlate('pantry', cam) + qCam(cam, ch) + vCool(1) + vFull('#2A2F3A', 0.12);
}
/* n4, n5, z1, n6: the walk home at night, head down, holding the macaron box */
function vwalkScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3, run = a._run || lt;
  const zx = 560 + Math.min(run, 24) * 20, phase = run * 6.2;
  const cam = id === 'z1' ? [zx + 40, 600, 2.1] : [zx + 120, 620, 1.2];
  const p = ptOf(zx, VFY, 1.0, 200, 360);
  const pose = Object.assign({}, walkPose(phase, 0.45), { armL: P['안기'].armL, hL: P['안기'].hL, armR: P['안기'].armR, hR: P['안기'].hR });
  let ch = qShadow(zx, VFY, 70) + vZero(t, { x: zx, y: VFY, s: 1.0, pose, ex: exprAt([[0, id === 'n6' ? '울먹' : '걱정']], lt), look: [0.4, 0.6] }) + vMac(p[0], p[1] + 2, 0.9, 0.6);
  if (id === 'z1') for (let i = 0; i < 3; i++) { const k = clamp((lt - 0.3 - i * 0.5) / 0.4, 0, 1); ch += `<g opacity="${f1(k * 100) / 100}" transform="translate(${zx + 180 + i * 70} ${VFY - 520 - i * 60})">${bubbleQ(k)}</g>`; }
  let h = qDefs() + qPlate(id === 'z1' ? 'street_c' : 'street', cam, id === 'z1' ? 0.3 : 0.5, id === 'z1' ? { blur: true } : {}) + qCam(cam, ch) + vNight(0.6);
  if (id === 'n6') {   // a sarcastic little confetti pop on "축하합니다", then everything goes cold
    const tC = vAt(a, '축하', 0.2), tCold = vAt(a, '심리', 0.6 * D);
    if (lt > tC && lt < tC + 1.2) for (let i = 0; i < 14; i++) { const k = (lt - tC) / 1.2, ang = i / 14 * 6.28, r = 60 + 260 * k; h += `<rect x="${f1(960 + Math.cos(ang) * r)}" y="${f1(380 + Math.sin(ang) * r + 200 * k * k)}" width="16" height="9" fill="${['#F7A8C0', '#FFD27A', '#9DC0E0'][i % 3]}" opacity="${f1((1 - k) * 100) / 100}" transform="rotate(${i * 30} ${f1(960 + Math.cos(ang) * r)} ${f1(380 + Math.sin(ang) * r)})"/>`; }
    h += vFull('#0E1020', 0.45 * clamp((lt - tCold) / 0.8, 0, 1));
  }
  return h;
}
const bubbleQ = k => `<ellipse cx="0" cy="0" rx="46" ry="38" fill="#fff" stroke="${INK}" stroke-width="5"/><text x="0" y="16" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="46" fill="${NAVY}">?</text>`;
