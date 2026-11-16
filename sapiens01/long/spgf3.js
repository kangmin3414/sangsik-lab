/* 사피엔스 편 2막 — m1~m4 종이 도시(쿼터뷰), p1~p3 제4의 벽(제로 직접 대사), w1~w6 밀 대왕(로우 앵글 보스전).
   표시: 하트 + "점선 = 허구". 실제 지폐 도안·회사 로고는 쓰지 않는다(지어낸 모양만). 노트북은 뒷면만. spgf2.js 다음에 읽는다. */
['spcity', 'sppause', 'spwheat'].forEach(k => CAMS[k] = 'fixed');
Object.assign(QBG, { wheat: 'ai/wheat_low.jpg' });
const spDarker = (c, k) => gfMix(c, '#1E2A4A', k), spLighter = (c, k) => gfMix(c, '#FFFFFF', k);

/* ---------- 쿼터뷰(아이소메트릭) 도구 ---------- */
const SPC = { O: [960, 210] };
const spIsoP = (u, v, z = 0) => [SPC.O[0] + (u - v) * 0.866, SPC.O[1] + (u + v) * 0.5 - z];
const spPt = (u, v, z) => spIsoP(u, v, z).map(f1).join(' ');
function spIsoBox(u0, v0, w, d, h, col, o = {}) {
  const k = o.k == null ? 1 : o.k, hh = Math.max(2, h * k), u1 = u0 + w, v1 = v0 + d;
  let s = '';
  if (k < 0.999) s += `<g fill="none" stroke="${INK}" stroke-width="4" stroke-dasharray="12 9" opacity=".75"><path d="M${spPt(u0, v1, 0)} L${spPt(u0, v1, h)} L${spPt(u0, v0, h)} L${spPt(u1, v0, h)} L${spPt(u1, v0, 0)} M${spPt(u0, v1, h)} L${spPt(u1, v1, h)} L${spPt(u1, v0, h)} M${spPt(u1, v1, h)} L${spPt(u1, v1, 0)}"/></g>`;
  s += `<path d="M${spPt(u0, v1, 0)} L${spPt(u1, v1, 0)} L${spPt(u1, v1, hh)} L${spPt(u0, v1, hh)} Z" fill="${spDarker(col, 0.1)}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  s += `<path d="M${spPt(u1, v0, 0)} L${spPt(u1, v1, 0)} L${spPt(u1, v1, hh)} L${spPt(u1, v0, hh)} Z" fill="${spDarker(col, 0.24)}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  s += `<path d="M${spPt(u0, v0, hh)} L${spPt(u1, v0, hh)} L${spPt(u1, v1, hh)} L${spPt(u0, v1, hh)} Z" fill="${spLighter(col, 0.35)}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  if (o.win && k > 0.3) { const [nr, nc] = o.win; for (let r = 0; r < nr; r++) for (let c = 0; c < nc; c++) { const uA = u0 + w * (0.12 + c * 0.8 / nc), uB = uA + w * 0.5 / nc, zA = hh * (0.12 + r * 0.8 / nr), zB = zA + hh * 0.45 / nr;
    s += `<path d="M${spPt(uA, v1, zA)} L${spPt(uB, v1, zA)} L${spPt(uB, v1, zB)} L${spPt(uA, v1, zB)} Z" fill="#FFF8E6" stroke="${INK}" stroke-width="3" opacity=".9"/>`; } }
  if (o.awn && k > 0.3) for (let i = 0; i < 6; i++) { const uA = u0 + w * i / 6, uB = u0 + w * (i + 1) / 6, z = hh * 0.62;
    s += `<path d="M${spPt(uA, v1 + 26, z)} L${spPt(uB, v1 + 26, z)} L${spPt(uB, v1, z + 34)} L${spPt(uA, v1, z + 34)} Z" fill="${i % 2 ? '#fff' : o.awn}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`; }
  return s;
}
const spIsoTree = (u, v, t, s = 1) => { const [x, y] = spIsoP(u, v, 0); return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(34 * s)}" ry="${f1(14 * s)}" fill="#2A3A20" opacity=".18"/><rect x="${f1(x - 7 * s)}" y="${f1(y - 70 * s)}" width="${f1(14 * s)}" height="${f1(70 * s)}" fill="#B98552" stroke="${INK}" stroke-width="4"/><circle cx="${f1(x)}" cy="${f1(y - 100 * s + Math.sin(t * 1.5 + u) * 2)}" r="${f1(48 * s)}" fill="#8FD18B" stroke="${INK}" stroke-width="6"/>`; };
const spIsoAt = (u, v, z, inner, k = 1) => { const [x, y] = spIsoP(u, v, z); return fkAt(x, y, inner, k); };
/* 지어낸 게임 지폐(실제 도안 아님): 복숭아색 + 별 메달 + 10000 */
const spBill = (col = '#FFC9A8', k = 1) => `<g><rect x="-120" y="-60" width="240" height="120" rx="12" fill="${col}" stroke="${INK}" stroke-width="7"/><rect x="-104" y="-44" width="208" height="88" rx="8" fill="none" stroke="${INK}" stroke-width="3" opacity="${f1(0.5 * k * 100) / 100}"/>` +
  `<circle cx="-58" cy="0" r="30" fill="${gfMix('#FFE9A8', col, 1 - k)}" stroke="${INK}" stroke-width="4" opacity="${f1(k * 100) / 100}"/><g transform="translate(-58 0) scale(.9)" opacity="${f1(k * 100) / 100}">${GF_ICON.star(0)}</g>` + gfT(40, 16, '10000', 40, gfMix(GFC.navy, '#C9C2B8', 1 - k)) + `</g>`;
const SP_LOGO = (t) => `<g><circle r="52" fill="#FFB86B" stroke="${INK}" stroke-width="7"/><path d="M-26 18 L0 -28 L26 18 Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle r="64" fill="none" stroke="#FFE38A" stroke-width="6" opacity="${f1((0.4 + 0.3 * Math.sin(t * 4)) * 100) / 100}"/></g>`;
const spRice = (t) => `<g><path d="M-58 -6 Q-56 46 0 50 Q56 46 58 -6 Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-52 4 Q0 18 52 4" stroke="#7FB8FF" stroke-width="7" fill="none"/><ellipse cx="0" cy="-8" rx="56" ry="18" fill="#FFF8E6" stroke="${INK}" stroke-width="5"/>` +
  [-22, 0, 22].map((x, i) => `<path d="M${x} -30 q${f1(8 * Math.sin(t * 3 + i))} -16 0 -32 q${f1(-8 * Math.sin(t * 3 + i))} -16 0 -32" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".85"/>`).join('') + `</g>`;
const spTag = (txt, k = 1) => k < 0.02 ? '' : `<g transform="scale(${f1(k * 100) / 100})"><rect x="-40" y="-20" width="80" height="40" rx="6" fill="#fff" stroke="${INK}" stroke-width="4"/>${gfT(0, 11, txt, 28, GFC.navy)}</g>`;

/* ===== m1: 지갑 속 지폐 — 벽에 비친 그림자가 나뭇잎·연기로 ===== */
function spcityM1(t, lt, a) {
  const tW = spW(a, '지갑', 0.6), tB = spW(a, '지폐', 1.6), tN = spW(a, '숫자', 2.9), tC = spW(a, '색칠', 3.5), tP = spW(a, '종이', 3.9), tE = spW(a, '뿐이', 4.6);
  const FY = 960, zx = 640, s = 1.12, raise = easeOut(gfK(tB - 0.1, tB + 0.35, lt)), fade = gfK(tC, tC + 0.6, lt);
  let w = `<rect x="-300" y="-300" width="2600" height="1500" fill="#F4ECDD"/><rect x="-300" y="${FY}" width="2600" height="400" fill="#E3D6C0" stroke="${INK}" stroke-width="7"/>` +
    `<circle cx="-40" cy="160" r="360" fill="#FFE9A8" opacity=".35"/><circle cx="-40" cy="160" r="170" fill="#FFF3C4" opacity=".5"/>`;
  // 그림자(벽에 크게): 지폐 → 나뭇잎 → 연기
  const shx = 1180, shy = 380, kL = gfK(tP - 0.05, tP + 0.35, lt), kS = gfK(tE, tE + 0.5, lt), op = raise * 0.85;
  if (op > 0.02) { const bill = `<rect x="-250" y="-125" width="500" height="250" rx="20"/>`, leaf = `<path d="M-230 30 Q-60 -220 230 -40 Q60 200 -230 30 Z"/><path d="M-260 44 L-180 26" stroke="#2A2230" stroke-width="18" stroke-linecap="round"/>`;
    w += `<defs><filter id="spSoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter></defs><g fill="#5A4A60" filter="url(#spSoft)" opacity="${f1(op * 0.55 * (1 - kS) * 100) / 100}" transform="translate(${shx} ${shy}) rotate(${f1(-6 + Math.sin(t * 2) * 2)})"><g opacity="${f1((1 - kL) * 100) / 100}" transform="scale(${f1(lerp(1, 0.8, kL) * 100) / 100})">${bill}</g><g opacity="${f1(kL * 100) / 100}" transform="scale(${f1(lerp(0.6, 1, kL) * 100) / 100})">${leaf}</g></g>`;
    if (kS > 0) w += [0, 1, 2, 3, 4].map(i => { const u = kS, x = shx - 150 + i * 75 + Math.sin(t * 2 + i) * 20, y = shy + 40 - 260 * u - i * 18; return `<path d="M${f1(x)} ${f1(y)} q30 -30 0 -60 q-30 -30 0 -60" fill="none" stroke="#2A2230" stroke-width="${f1(26 - 8 * u)}" stroke-linecap="round" opacity="${f1(0.6 * (1 - u) * op * 100) / 100}"/>`; }).join(''); }
  // 제로: 지갑을 꺼내 지폐를 높이 듦
  const pose = raise > 0.5 ? { armL: P['서기'].armL, hL: P['서기'].hL, armR: [[252, 285], [300, 220], [318, 150]], hR: [320, 140], legL: P['서기'].legL, fL: P['서기'].fL, legR: P['서기'].legR, fR: P['서기'].fR, dy: 0 } : (lt > tW ? '폰보기' : '서기');
  w += spZero({ x: zx, y: FY, s, t, pose, ex: lt < tN ? 'z기본' : lt < tP ? 'z반짝' : 'z의심', look: [0.6, -0.4], sweat: false }, lt > tB ? gfJelly(lt, tB, 0.08, 4, 7) : {});
  if (lt > tW && raise < 0.5) { const pp = P['폰보기'], q = gfHand(zx, FY, s, [(pp.hL[0] + pp.hR[0]) / 2, (pp.hL[1] + pp.hR[1]) / 2 - 20]); w += fkAt(q[0], q[1], `<rect x="-44" y="-30" width="88" height="60" rx="10" fill="#9C6B43" stroke="${INK}" stroke-width="5"/><path d="M-44 -6 h88" stroke="${INK}" stroke-width="3" opacity=".4"/>`); }
  if (raise > 0.02) { const q = gfHand(zx, FY, s, [320, 120]); w += fkAt(q[0] + 20, q[1] - 40 * raise, spBill(gfMix('#FFC9A8', '#FBF7EE', fade), 1 - fade), lerp(0.6, 1.25, raise), -8 + Math.sin(t * 2) * 2);
    if (lt > tN && lt < tN + 1.0) w += gfStarBurst(lt, tN, q[0] + 60, q[1] - 40, { r1: 120, n: 6 }); }
  w += gfChipAt(lt, tP + 0.1, 1330, 700, '그냥 색칠된 종이', { size: 38, bg: '#fff', rot: -3 });
  const cam = qLerpCam(gfK(0, 3, lt), [900, 560, 1.0], [960, 540, 1.04]);
  return fkDefs() + gfStyleDefs('paper') + `<g filter="url(#gs_paperbg)">${qCam(cam, w)}</g>`;
}
/* ===== m2~m4: 종이 미니어처 도시 ===== */
const SP_PEOPLE = [[300, 620, '#C9B9C9'], [560, 700, '#B9C9C0'], [760, 560, '#C2BBAF'], [160, 470, '#B4C0C9'], [820, 300, '#D2C0B0'], [620, 520, '#BFC9BA'], [380, 740, '#C9C2B4'], [880, 640, '#B9BEC9']];
function spCityWorld(t, lt, st) {
  // st: {fold(0..1 회사), foldStore, logo(0..1), people(0..1), belief(0..1), tag(0..1), zx/zy(iso), zPose, zEx, bill, swap}
  let g = `<path d="M${spPt(0, 0, 0)} L${spPt(1150, 0, 0)} L${spPt(1150, 1150, 0)} L${spPt(0, 1150, 0)} Z" fill="#F6EEDC" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 1; i < 12; i++) g += `<path d="M${spPt(i * 96, 0, 0)} L${spPt(i * 96, 1150, 0)} M${spPt(0, i * 96, 0)} L${spPt(1150, i * 96, 0)}" stroke="#D9CDB4" stroke-width="2"/>`;
  g += `<path d="M${spPt(0, 360, 0)} L${spPt(1150, 360, 0)} L${spPt(1150, 430, 0)} L${spPt(0, 430, 0)} Z" fill="#C9CED8" stroke="${INK}" stroke-width="4"/><path d="M${spPt(420, 0, 0)} L${spPt(490, 0, 0)} L${spPt(490, 1150, 0)} L${spPt(420, 1150, 0)} Z" fill="#C9CED8" stroke="${INK}" stroke-width="4"/>`;
  let fg = '';
  // 뒤에서 앞으로(u+v가 작은 것부터)
  fg += spIsoTree(80, 120, t, 0.9) + spIsoBox(120, 60, 240, 240, 380, '#9DB8F0', { k: 1 - st.fold, win: [5, 3] });
  if (st.logo > 0.02) { const [x, y] = spIsoP(240, 180, 380 * (1 - st.fold) + 90); fg += fkAt(x, y + Math.sin(t * 2) * 6, SP_LOGO(t), st.logo); }
  fg += spIsoBox(560, 100, 220, 190, 150, '#9EE6B8', { k: 1 - st.foldStore, awn: '#FF9AA8', win: [1, 2] }) + spIsoTree(860, 180, t, 0.8);
  fg += spIsoBox(110, 500, 150, 130, 120, '#FFD9A8', { win: [1, 2] }) + spIsoTree(300, 520, t, 0.75) + spIsoBox(820, 470, 140, 120, 110, '#D9CCFF', { win: [1, 2] });
  // 작은 사람들 + 믿음의 말풍선(동전)
  const ppl = SP_PEOPLE.map(([u, v, c], i) => { const k = gfIn(st.people, i * 0.06, 3.4, 0.42); if (k < 0.02) return ''; const [x, y] = spIsoP(u, v, 0);
    let h = gfActor(o => FKV(c, o), { x, y, s: 0.36 * Math.min(1, k), t, pose: '서기', ex: fEx(st.peopleEx || 'z기본'), look: [0, -0.3], seed: 40 + i });
    if (st.belief > 0.02) h += fkAt(x + 40, y - 250 + Math.sin(t * 2 + i) * 5, `<ellipse rx="44" ry="36" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-26" cy="40" r="8" fill="#fff" stroke="${INK}" stroke-width="4"/><g transform="scale(1.1)">${GF_ICON[st.bubbleIcon || 'star'](t)}</g>`, st.belief * (1 - st.pop));
    return h; });
  // 제로
  const [zx, zy] = spIsoP(st.zu, st.zv, 0);
  const zero = st.noZero ? '' : spZero({ x: zx, y: zy, s: 0.78, t, pose: st.zPose || '서기', ex: st.zEx || 'z기본', look: st.look || [0.4, -0.2], sweat: false }, st.zm || {});
  // 깊이 순서: 사람과 제로를 v+u로 섞기
  const order = SP_PEOPLE.map(([u, v], i) => [u + v, ppl[i]]).concat([[st.zu + st.zv, zero + (st.extra || '')]]).sort((p, q) => p[0] - q[0]);
  fg += order.map(p => p[1]).join('');
  return { bg: g, fg, zx, zy };
}
function spcityScene(t, lt, a) {
  if (a.ph === 0) return spcityM1(t, lt, a);
  const ph = a.ph; let st = { fold: 0, foldStore: 0, logo: 0, people: 9, belief: 0, pop: 0, zu: 470, zv: 470, tag: 0 }, hud = '', over = '', camA, camB, ck = 0;
  if (ph === 1) {   // "돈이라고 다 같이 믿으니까 편의점에서 따뜻한 밥과 바꿀 수 있는"
    const tD = spW(a, '돈이', 0.5), tBel = spW(a, '믿으', 1.6), tS = spW(a, '편의점', 2.6), tR = spW(a, '밥과', 3.4), tX = spW(a, '바꿀', 3.8);
    st.people = lt - 0.2; st.belief = gfIn(lt, tBel, 3, 0.45); st.bubbleIcon = 'star';
    const walk = easeInOut(gfK(tS - 0.3, tR - 0.1, lt)); st.zu = lerp(470, 600, walk); st.zv = lerp(470, 330, walk);
    if (walk > 0 && walk < 1) { const wk = gfWalk(walk * 300, 1, 0.05); st.zPose = wk.pose; st.zm = { sy: wk.sy, dy: wk.dy }; }
    st.zEx = lt > tX ? 'z빵긋' : 'z기본';
    const [bx, by] = spIsoP(st.zu, st.zv, 0), sw = gfK(tX, tX + 0.6, lt);
    if (sw < 1) st.extra = fkAt(bx + 60 + 140 * easeIn(sw), by - 380 - 60 * Math.sin(Math.PI * sw), spBill('#FFC9A8', 1), 0.42 * (1 - sw * 0.6) * gfIn(lt, tD - 0.2, 3, 0.45), -6);
    if (lt > tX) st.extra = (st.extra || '') + fkAt(bx + 70, by - 330 - 10 * Math.sin(t * 3), spRice(t), gfIn(lt, tX + 0.35, 3.4, 0.42) * 0.9);
    if (st.belief > 0.02) over += SP_PEOPLE.map(([u, v]) => { const [x, y] = spIsoP(u, v, 0); return `<line x1="${f1(x + 40)}" y1="${f1(y - 250)}" x2="${f1(bx + 60)}" y2="${f1(by - 380)}"/>`; }).join('').replace(/^/, `<g stroke="#FFC85A" stroke-width="4" stroke-dasharray="10 8" opacity="${f1(st.belief * (1 - gfK(tS, tS + 0.4, lt)) * 70) / 100}">`) + '</g>';
    if (lt > tX) hud += gfChipAt(lt, tX + 0.1, 1450, 280, '돈 ⇄ 따뜻한 밥', { size: 42, bg: '#fff', rot: -3 });
    camA = [960, 470, 0.86]; camB = [1000, 470, 0.92]; ck = gfK(0, 4, lt);
  } else if (ph === 2) {   // "회사도, 직급도 똑같습니다"
    const tC = spW(a, '회사', 0.2), tR = spW(a, '직급', 0.9);
    st.zu = 600; st.zv = 330; st.logo = gfIn(lt, tC, 3, 0.45); st.belief = 1; st.bubbleIcon = 'building'; st.tag = gfIn(lt, tR, 3.4, 0.42);
    st.extra = fkAt(spIsoP(600, 330, 0)[0] + 10, spIsoP(600, 330, 0)[1] - 0.78 * 210, spTag('대리', 1), st.tag * 1.3);
    st.zEx = lt > tR ? 'z뿌듯' : 'z기본'; st.zm = lt > tR ? gfJelly(lt, tR, 0.08, 4, 7) : {};
    if (lt > tC) over += gfRing(lt, tC, spIsoP(240, 180, 470)[0], spIsoP(240, 180, 470)[1], 40, 160, '#FFE38A', 10, 0.5);
    camA = [1000, 470, 0.92]; camB = [900, 430, 0.95]; ck = gfK(0, 2, lt);
  } else {   // "물리적으로 만질 수 있는 게 아니라 … 약속해 둔 거대한 게임 규칙인 셈이죠"
    const tT = spW(a, '만질', 0.9), tPr = spW(a, '약속', 3.4), tG = spW(a, '게임', 4.6), tOff = tG + 0.15;
    st.zu = 600; st.zv = 330; st.logo = 1 - gfK(tOff, tOff + 0.12, lt); st.belief = 1; st.bubbleIcon = 'building'; st.pop = gfK(tOff + 0.3, tOff + 0.5, lt);
    st.fold = easeIn(gfK(tOff + 0.15, tOff + 0.6, lt)); st.tag = 1 - gfK(tOff + 0.4, tOff + 0.6, lt);
    st.zPose = lt > tT && lt < tPr ? SP_P.reach : '서기'; st.zEx = lt > tOff + 0.4 ? 'z멍' : lt > tT ? 'z의심' : 'z기본';
    const [zx, zy] = spIsoP(600, 330, 0);
    st.extra = fkAt(zx + 10, zy - 0.78 * 210, spTag('대리', 1), st.tag * 1.3) + (st.tag < 0.98 && st.tag > 0.02 ? `<rect x="${f1(zx - 30)}" y="${f1(zy - 175)}" width="60" height="30" rx="4" fill="none" stroke="${INK}" stroke-width="4" stroke-dasharray="8 6"/>` : '');
    if (lt > tT && lt < tPr) st.extra += fkAt(zx + 200, zy - 300, `<rect x="-120" y="-60" width="240" height="120" rx="12" fill="#fff" fill-opacity=".25" stroke="${INK}" stroke-width="6" stroke-dasharray="14 10"/>` + gfT(40, 16, '10000', 40, '#9AA0AE'), 0.55);
    if (lt > tPr && lt < tOff + 0.4) { const [lx, ly] = spIsoP(240, 180, 470); over += `<g stroke="#FFC85A" stroke-width="4" stroke-dasharray="10 8" opacity="${f1(gfK(tPr, tPr + 0.5, lt) * 70) / 100}">` + SP_PEOPLE.map(([u, v]) => { const [x, y] = spIsoP(u, v, 0); return `<line x1="${f1(x + 40)}" y1="${f1(y - 250)}" x2="${f1(lx)}" y2="${f1(ly)}"/>`; }).join('') + '</g>'; }
    if (lt > tOff) { const [lx, ly] = spIsoP(240, 180, 470); over += gfPuff(lt, tOff, lx, ly, 2.2, '#FFE9A8') + gfStarBurst(lt, tOff, lx, ly, { r1: 200, n: 9 }); }
    if (st.pop > 0) over += SP_PEOPLE.map(([u, v], i) => { const [x, y] = spIsoP(u, v, 0); return gfPuff(lt, tOff + 0.3 + i * 0.02, x + 40, y - 250, 0.8); }).join('');
    if (lt > tOff + 0.6) hud += gfChipAt(lt, tOff + 0.6, 1450, 260, '점선 = 함께 믿는 약속', { size: 40, bg: '#EDE8FF', col: '#5B4FCF', rot: -2 });
    if (lt > tT && lt < tPr) hud += gfChipAt(lt, tT + 0.1, 1450, 260, '만질 수 없음', { size: 40, bg: '#fff', rot: -2 });
    camA = [900, 430, 0.95]; camB = [860, 450, 0.9]; ck = gfK(tOff, tOff + 2, lt);
  }
  const W = spCityWorld(t, lt, st), cam = qLerpCam(ck, camA, camB);
  return fkDefs() + gfStyleDefs('paper') + qCam(cam, gfStyled('paper', W.bg, W.fg + over, t)) + hud;
}

/* ===== p1~p3: 제4의 벽 — 멈춘 흑백 도시, 컬러 제로가 점선 벽에 기대어 시청자에게 ===== */
const SP_LEAN = { armL: [[148, 285], [104, 236], [78, 182]], hL: [74, 172], armR: [[252, 285], [278, 345], [284, 398]], hR: [286, 406],
  legL: [[180, 412], [176, 470], [172, 522]], fL: [160, 534, 0], legR: [[220, 412], [240, 468], [262, 518]], fR: [272, 530, -8], dy: 0 };
function sppauseScene(t, lt, a) {
  const ph = a.ph, run = a._run, s = 1.42, FY = 1230, wallX = -10;
  // 멈춘 배경: 접힌 뒤의 종이 도시를 흑백으로
  const st = { fold: 1, foldStore: 0, logo: 0, people: 9, belief: 0, pop: 1, zu: 600, zv: 330, noZero: true };
  const W = spCityWorld(0, 0, st);
  let h = fkDefs() + `<defs><filter id="spGray" x="-10%" y="-10%" width="120%" height="120%"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope=".75" intercept=".12"/><feFuncG type="linear" slope=".75" intercept=".12"/><feFuncB type="linear" slope=".75" intercept=".14"/></feComponentTransfer></filter></defs>`;
  h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#E9E4DA"/><g filter="url(#spGray)">${qCam([980, 450, 0.9], W.bg + W.fg)}</g>`;
  const dark = ph === 2 ? 0.25 * gfK(0.2, 1.2, lt) : 0;
  h += `<rect x="-300" y="-300" width="2600" height="1600" fill="#141A2E" opacity="${f1((0.18 + dark) * 100) / 100}"/>`;
  // 화면 안쪽 점선 벽(제로가 기대는 곳)
  const solid = ph === 2 ? gfK(spW(a, '잊어', 2.2), spW(a, '잊어', 2.2) + 0.6, lt) : 0, dash = f1(lerp(30, 0.1, solid));
  { const gap = f1(lerp(24, 0.1, solid)), X = -80, Y = 40, Wd = 2080, Hd = 990; ['#fff|20', INK + '|8'].forEach(cw => { const [c, sw] = cw.split('|'); h += `<rect x="${X}" y="${Y}" width="${Wd}" height="${Hd}" rx="30" fill="none" stroke="${c}" stroke-width="${sw}" stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${f1(-run * 40)}"/>`; }); }
  // 제로(컬러): p1 첫머리에 걸어 나와 커짐, 벽에 기댐
  const come = ph === 0 ? easeInOut(gfK(0.05, 0.9, lt)) : 1, zx = lerp(860, wallX + 190, come), zs = lerp(0.72, s, come), zy = lerp(820, FY, come);
  let base = 'z기본', look = [0, 0], rot = -7 * come, pose = come > 0.85 ? SP_LEAN : (come > 0 && come < 1 ? gfWalk(come * 400, 0.9, 0.05).pose : '서기'), m = {};
  if (ph === 0) { const tQ = spW(a, '소리', 3.6); base = lt > tQ ? 'z히죽' : 'z반짝'; }
  if (ph === 1) { base = 'z빵긋'; rot = -7 + Math.sin(lt * 16) * 6 * Math.exp(-lt * 2.5); }
  if (ph === 2) { base = 'z결심'; rot = -5; }
  E['_spzt'] = qTalk(base, env(t));
  h += gfActor(FKZW, { x: zx, y: zy, s: zs, t, pose, ex: { expr: '_spzt', prev: '_spzt', k: 1, blink: 0 }, look, seed: 3, rot }, m);
  const hx = zx, hy = zy - 390 * zs;
  // 생각 말풍선: 출근 ✕, 돈 ✕ → "천만에요"에 톡 터짐
  if (ph === 0 || (ph === 1 && lt < 0.5)) { const tO = ph === 0 ? spW(a, '출근', 1.7) : -9, tM = ph === 0 ? spW(a, '돈도', 2.5) : -9, popK = ph === 1 ? gfK(0.1, 0.3, lt) : 0;
    [[tO, 'building', 1240, 330], [tM, 'star', 1560, 420]].forEach(([t0, ic, x, y], i) => { const k = ph === 1 ? 1 - popK : gfIn(lt, t0, 3.4, 0.42); if (k < 0.02) return;
      h += fkAt(x, y + Math.sin(t * 2 + i) * 6, `<ellipse rx="110" ry="86" fill="#fff" stroke="${INK}" stroke-width="7"/><g transform="scale(2.2)">${GF_ICON[ic](t)}</g><path d="M-60 -50 L60 50 M60 -50 L-60 50" stroke="#E5484D" stroke-width="14" stroke-linecap="round" opacity=".85"/>`, k); });
    if (ph === 1) h += gfPuff(lt, 0.15, 1240, 330, 1.4) + gfPuff(lt, 0.2, 1560, 420, 1.4); }
  if (ph === 0) { const tQ = spW(a, '소리', 3.6); h += gfEmote(lt, tQ, hx + 150, hy - 170, 'q', { hold: 9, s: 1.4 }); }
  if (ph === 1) h += fkAt(1400, 420, gfStamp(lt, 0.12, '천만에요!', { size: 84 }));
  if (ph === 2) { const tF = spW(a, '허구', 1.6), tSl = spW(a, '노예', 4.2);
    if (lt > tF) h += gfChipAt(lt, tF, 1420, 300, '허구라는 걸 잊으면?', { size: 44, bg: '#EDE8FF', col: '#5B4FCF', rot: -2 });
    if (lt > tSl) { const k = easeOut(gfK(tSl, tSl + 0.5, lt)), ny = hy + 112 * zs;
      h += `<ellipse cx="${f1(hx)}" cy="${f1(ny)}" rx="${f1(70 * zs)}" ry="${f1(16 * zs)}" fill="none" stroke="#FFC85A" stroke-width="10" stroke-dasharray="14 10" opacity="${f1(k * 100) / 100}"/>` +
        `<path d="M${f1(hx + 40)} ${f1(ny)} Q${f1(hx + 260)} ${f1(ny - 300)} ${f1(hx + 520)} ${f1(lerp(ny, -150, k))}" fill="none" stroke="#FFC85A" stroke-width="10" stroke-dasharray="14 10" opacity="${f1(k * 100) / 100}"/>` +
        gfChipAt(lt, tSl + 0.2, 1420, 420, '규칙의 노예', { size: 44, bg: '#FFE1E1', col: '#E5484D', rot: 3 }); } }
  // 일시정지 표시
  h += fkAt(170, 120, `<rect x="-62" y="-62" width="124" height="124" rx="26" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-28" y="-34" width="18" height="68" rx="5" fill="${GFC.navy}"/><rect x="10" y="-34" width="18" height="68" rx="5" fill="${GFC.navy}"/>`, ph === 0 ? gfIn(lt, 0.02, 3.4, 0.42) : 1) +
    gfChipAt(ph === 0 ? lt : 9, 0.15, 400, 120, '일시정지', { size: 40, bg: '#fff' });
  return h;
}

/* ===== w1~w6: 밀 대왕(로우 앵글 보스전) ===== */
const SP_STRAW = `<ellipse cx="200" cy="80" rx="168" ry="32" fill="#E8C66A" stroke="${INK}" stroke-width="6"/><path d="M122 78 Q128 4 200 0 Q272 4 278 78 Z" fill="#F0D27A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M126 62 Q200 52 274 62" stroke="#C0603A" stroke-width="10" fill="none"/>`;
const SP_HOE = { follow: false, svg: `<g transform="rotate(25)"><rect x="-6" y="-130" width="12" height="230" rx="6" fill="#A9743F" stroke="${INK}" stroke-width="4"/><path d="M-6 96 L40 96 L44 126 L-6 120 Z" fill="#A3A8B0" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>` };
const spFarmZ = o => Z(Object.assign({ vest: '#D9C29A', vshade: 'rgba(90,60,10,0.18)', hairFront: SP_STRAW }, o));
const SP_FOOD = [
  t => `<circle r="26" fill="#FF7A6B" stroke="${INK}" stroke-width="5"/><path d="M0 -26 q6 -14 18 -14" stroke="#5FB04A" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  t => `<path d="M-34 0 Q-6 -24 22 0 Q-6 24 -34 0 Z M22 0 L40 -16 L40 16 Z" fill="#8FC8F0" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle cx="-18" cy="-4" r="4" fill="${INK}"/>`,
  t => `<path d="M-30 4 Q-30 -30 0 -30 Q30 -30 30 4 Z" fill="#FF9A6B" stroke="${INK}" stroke-width="5"/><rect x="-10" y="4" width="20" height="24" rx="6" fill="#FFF3E0" stroke="${INK}" stroke-width="5"/><circle cx="-12" cy="-14" r="5" fill="#fff"/>`,
  t => `${[[-12, 6], [12, 6], [0, -12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#8E6BD8" stroke="${INK}" stroke-width="4"/>`).join('')}<path d="M0 -24 l4 -12" stroke="#5FB04A" stroke-width="5" stroke-linecap="round"/>`,
  t => `<ellipse rx="24" ry="30" fill="#C99A5B" stroke="${INK}" stroke-width="5"/><path d="M-18 -10 Q0 -22 18 -10" stroke="${INK}" stroke-width="4" fill="none"/>`];
const spWheatEar = (s, t) => { let k = ''; for (let i = 0; i < 7; i++) for (const sd of [-1, 1]) k += `<ellipse cx="${sd * 9}" cy="${-i * 16}" rx="10" ry="13" fill="#F2C14E" stroke="${INK}" stroke-width="3" transform="rotate(${sd * 18} ${sd * 9} ${-i * 16})"/>`;
  return `<g transform="scale(${s})"><path d="M0 40 L0 0" stroke="#C9A040" stroke-width="5"/>${k}${[-1, 0, 1].map(d => `<path d="M${d * 6} -100 l${d * 10} -40" stroke="#E8C66A" stroke-width="3"/>`).join('')}</g>`; };
/* 왕관 쓴 밀(보스): 낟알 몸 + 얼굴 + 왕관 + 잎 팔 */
function spWheatKing(t, o = {}) {
  const sm = o.smirk || 0, bob = Math.sin(t * 2.2) * 6; let k = '';
  for (let i = 0; i < 9; i++) for (const sd of [-1, 1]) { const y = 160 - i * 62, x = sd * (66 - Math.abs(i - 4) * 4); k += `<ellipse cx="${x}" cy="${y}" rx="64" ry="50" fill="${i % 2 ? '#F2C14E' : '#F6CD62'}" stroke="${INK}" stroke-width="7" transform="rotate(${sd * 16} ${x} ${y})"/>`; }
  let s = `<g transform="translate(0 ${f1(bob)})"><path d="M0 220 L0 900" stroke="#C9A040" stroke-width="34"/><path d="M0 220 L0 900" stroke="${INK}" stroke-width="6" opacity=".25"/>`;
  s += [-1, 1].map(sd => `<path d="M${sd * 20} 420 Q${sd * 170} ${o.armUp && sd > 0 ? 260 : 360} ${sd * 250} ${o.armUp && sd > 0 ? 180 : 300}" fill="none" stroke="#6DBE55" stroke-width="30" stroke-linecap="round"/><path d="M${sd * 20} 420 Q${sd * 170} ${o.armUp && sd > 0 ? 260 : 360} ${sd * 250} ${o.armUp && sd > 0 ? 180 : 300}" fill="none" stroke="${INK}" stroke-width="5" opacity=".35"/>`).join('');
  s += [-2, -1, 0, 1, 2].map(d => `<path d="M${d * 26} -380 l${d * 30} -170" stroke="#E8C66A" stroke-width="7" stroke-linecap="round"/>`).join('') + k;
  // 얼굴
  s += `<ellipse cx="0" cy="40" rx="118" ry="96" fill="#FBE19A" stroke="${INK}" stroke-width="7"/><ellipse cx="-42" cy="22" rx="17" ry="${f1(22 - 8 * sm)}" fill="${INK}"/><ellipse cx="42" cy="22" rx="17" ry="${f1(22 - 8 * sm)}" fill="${INK}"/><circle cx="-36" cy="14" r="5" fill="#fff"/><circle cx="48" cy="14" r="5" fill="#fff"/>` +
    `<path d="M-74 -16 L-20 ${f1(-2 + 10 * sm)} M74 -16 L20 ${f1(-2 + 10 * sm)}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-44 70 Q0 ${f1(96 + 10 * sm)} 50 ${f1(56 - 10 * sm)}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><ellipse cx="-80" cy="66" rx="16" ry="9" fill="#FF9BB0" opacity=".7"/><ellipse cx="80" cy="66" rx="16" ry="9" fill="#FF9BB0" opacity=".7"/>`;
  // 왕관
  s += `<g transform="translate(0 -420)"><path d="M-110 40 L-110 -40 L-60 0 L0 -70 L60 0 L110 -40 L110 40 Z" fill="#FFD84A" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><circle cx="0" cy="8" r="16" fill="#FF6B8A" stroke="${INK}" stroke-width="5"/><circle cx="-110" cy="-44" r="10" fill="#FFD84A" stroke="${INK}" stroke-width="5"/><circle cx="110" cy="-44" r="10" fill="#FFD84A" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="-74" r="11" fill="#FFD84A" stroke="${INK}" stroke-width="5"/>`;
  if (o.flags) o.flags.forEach(([txt, k], i) => { if (k < 0.02) return; const sd = i ? 1 : -1; s += `<g transform="translate(${sd * 100} -20) rotate(${sd * 62}) scale(${f1(k * 100) / 100})"><line x1="0" y1="0" x2="0" y2="-170" stroke="${INK}" stroke-width="8"/><g transform="translate(0 -170) rotate(${-sd * 62})"><path d="M0 0 L${sd * 330} 26 L0 72 Z" fill="${i ? '#9ED8FF' : '#FFB3B3'}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>${gfT(sd * 130, 48, txt, 34, GFC.navy)}</g></g>`; });
  s += `</g></g>`;
  return s;
}
function spwheatScene(t, lt, a) {
  const ph = a.ph, run = a._run, FY = 900, zx = 560;
  let cam = [960, 600, 1.0], w = '', hud = '', night = 0, king = 0, kingY = 1300, leash = 0, zero = '', s = 1.0;
  // 시대 꼬리표
  if (ph === 0) { const tF = spW(a, '농업', 2.6), tX = spW(a, '최대', 4.4), ch = gfK(tF - 0.1, tF + 0.2, lt);
    zero = gfActor(ch < 0.5 ? spPrimZ : spFarmZ, { x: zx, y: FY, s, t, pose: '서기', ex: fEx(lt > tX ? 'z의심' : 'z기본'), look: [0.5, -0.3], seed: 3 }) + gfPuff(lt, tF - 0.05, zx, FY - 250, 2.2, '#FFF3C4');
    w += SP_FURDEF; hud += gfChipAt(lt, 0.2, 960, 120, '약 1만 년 전 · 농업 혁명', { size: 44, icon: 'clock', bg: '#fff' });
    if (lt > tX) hud += fkAt(1340, 400, gfStamp(lt, tX, '역사상 최대의 사기', { size: 66 })) + gfChipAt(lt, tX + 0.4, 1340, 560, '『사피엔스』 5장 제목', { size: 34, icon: 'book', bg: '#fff' });
    cam = qLerpCam(gfK(0, 5, lt), [900, 600, 1.0], [960, 580, 1.06]); }
  if (ph === 1) {   // 수렵·채집: 느긋하게 쉬며 다양한 음식
    const tH = spW(a, '몇', 1.8), tF = spW(a, '다양', 3.3);
    zero = SP_FURDEF + gfActor(spPrimZ, { x: zx, y: FY, s, t, pose: SP_P.sit, ex: fEx('z빵긋'), look: [0.3, -0.3], seed: 3 }, { sy: 0.98 + 0.02 * Math.sin(t * 2) });
    if (lt > tF) SP_FOOD.forEach((fd, i) => { const an = t * 0.8 + i * 1.256, k = gfIn(lt, tF + i * 0.12, 3.4, 0.42); w += fkAt(zx + Math.cos(an) * 300, FY - 330 + Math.sin(an) * 110, fd(t), 1.5 * k); });
    if (lt > tH) hud += fkAt(1420, 300, gfPanel(520, 190, { bg: '#fff' }) + gfT(-200, -24, '일', 40, GFC.navy) + `<g transform="translate(-150 -38)">${gfBar(320, 0.25 * gfK(tH, tH + 0.6, lt), { h: 30, col: GFC.coral })}</g>` + gfT(-200, 54, '쉼', 40, GFC.navy) + `<g transform="translate(-150 40)">${gfBar(320, 0.85 * gfK(tH + 0.2, tH + 0.8, lt), { h: 30, col: GFC.mint })}</g>`, gfIn(lt, tH, 3, 0.45));
    hud += gfChipAt(lt, 0.1, 960, 120, '수렵·채집 시절', { size: 42, bg: '#fff' });
    cam = [940, 600, 1.04]; }
  if (ph === 2) {   // 농사: 인구 ↑, 개인 ↓
    const tP = spW(a, '인구', 1.6), tI = spW(a, '개인', 3.0), tD = spW(a, '종일', 3.8), tN = spW(a, '영양', 5.6), tS = spW(a, '전염병', 6.6);
    const bend = lt > tD - 0.2; zero = gfActor(spFarmZ, { x: zx, y: FY, s, t, pose: bend ? SP_P.pant : '서기', ex: fEx(lt > tS ? 'z코치지침' : bend ? '지침' : 'z기본'), look: [0.3, 0.3], seed: 3, rot: bend ? 12 + Math.sin(t * 5) * 2 : 0, holdR: SP_HOE, sweat: bend, headDy: bend ? 14 : 0 });
    if (bend) zero += spDrops(lt, zx, FY - 380, s, 2, 4);
    // 해가 하루를 휙
    const su = gfK(tD, tD + 1.6, lt); if (su > 0 && su < 1) hud += fkAt(lerp(200, 1720, su), 260 - Math.sin(Math.PI * su) * 160, gfSun(0, 0, 54, t), 1);
    if (lt > tP) { const n = Math.floor(lerp(4, 40, gfK(tP, tP + 1.4, lt))); for (let i = 0; i < n; i++) { const x = 1150 + (i % 10) * 56 + (Math.floor(i / 10) % 2) * 28, y = 760 + Math.floor(i / 10) * 44, c = SP_TUNIC[i % 6], k = gfIn(lt, tP + i * 0.035, 3.4, 0.42); if (k < 0.02) continue; w += fkAt(x, y, `<path d="M-11 0 L-9 -26 Q0 -32 9 -26 L11 0 Z" fill="${c}" stroke="${INK}" stroke-width="4"/><circle cy="-40" r="13" fill="#fff" stroke="${INK}" stroke-width="4"/>`, k); }
      hud += gfChipAt(lt, tP, 1440, 640, '인구 ↑', { size: 42, bg: '#fff' }); }
    if (lt > tI) hud += fkAt(560, 240, fkHearts(lt, lt > tS ? 1 : lt > tN ? 2 : 3, { from: lt > tS ? 2 : lt > tN ? 3 : 5, tp: lt > tS ? tS : lt > tN ? tN : tI, low: lt > tS }), 0.9) + gfChipAt(lt, tI, 560, 340, '개인 ↓', { size: 40, bg: '#fff' });
    if (lt > tN) hud += fkAt(980, 340, `<ellipse rx="90" ry="30" fill="#fff" stroke="${INK}" stroke-width="6"/>${spWheatEar(0.5, t)}`, gfIn(lt, tN, 3.4, 0.42));
    if (lt > tS) for (let i = 0; i < 5; i++) w += fkAt(zx - 200 + i * 100 + Math.sin(t * 3 + i) * 14, FY - 520 + Math.cos(t * 2.4 + i) * 30, `<circle r="26" fill="#9EE07A" stroke="${INK}" stroke-width="5"/><circle cx="-8" cy="-4" r="4" fill="${INK}"/><circle cx="8" cy="-4" r="4" fill="${INK}"/>${[0, 1, 2, 3, 4, 5].map(j => `<circle cx="${f1(Math.cos(j) * 32)}" cy="${f1(Math.sin(j) * 32)}" r="6" fill="#9EE07A" stroke="${INK}" stroke-width="3"/>`).join('')}`, gfIn(lt, tS + i * 0.1, 3.4, 0.42));
    cam = qLerpCam(gfK(0, 6, lt), [960, 600, 1.0], [900, 620, 1.06]); }
  if (ph >= 3) {   // 보스 등장 → 목줄 → (w5~) 직장인과 노트북
    const tK = ph === 3 ? spW(a, '밀이', 1.7) : -9, tT = ph === 3 ? spW(a, '길들', 2.2) : -9, tR = ph === 3 ? spW(a, '번식', 3.3) : -9;
    king = ph === 3 ? easeOut(gfK(tK - 0.2, tK + 0.6, lt)) : 1; leash = ph === 3 ? easeOut(gfK(tT, tT + 0.4, lt)) : 1;
    const office = ph >= 4, sm = ph === 3 ? gfK(tT, tT + 0.4, lt) : 1;
    night = ph === 4 ? gfK(0, 0.8, lt) : ph === 5 ? 1 : 0;
    let flags = null;
    if (ph === 5) { const tA = spW(a, '연봉', 4.6), tB = spW(a, '타이틀', 5.4); flags = [['더 높은 연봉', gfIn(lt, tA, 3.4, 0.42)], ['더 번듯한 타이틀', gfIn(lt, tB, 3.4, 0.42)]]; }
    const kx = 1300, ky = lerp(1500, 470, king), kS = 0.92;
    w += `<defs><clipPath id="spHz"><rect x="-600" y="-1200" width="3200" height="2010"/></clipPath></defs><g clip-path="url(#spHz)">${fkAt(kx, ky, spWheatKing(t, { smirk: sm, armUp: leash > 0.5, flags }), kS)}</g>`;
    if (ph === 3 && lt > tR) for (let i = 0; i < 8; i++) w += fkAt(200 + i * 230, 900 - 60 * gfIn(lt, tR + i * 0.06, 3.4, 0.42), spWheatEar(1.3, t), 1);
    // 제로
    if (!office) zero = gfActor(spFarmZ, { x: zx, y: FY, s, t, pose: SP_P.pant, ex: fEx(lt > tK ? 'z충격' : '지침'), look: [0.6, -0.5], seed: 3, rot: 10, holdR: SP_HOE, headDy: 10 });
    else { const tTech = ph === 5 ? spW(a, '기술', 0.9) : -9, tSp = ph === 5 ? spW(a, '스펙', 1.6) : -9, tF = ph === 5 ? spW(a, '먹이', 6.4) : -9, tY = ph === 5 ? spW(a, '야근', 7.2) : -9;
      const dx = zx, dy = FY; zero = gfActor(FKZW, { x: dx, y: dy, s, t, pose: SP_P.pant, ex: fEx(ph === 5 && lt > tY ? 'z코치지침' : '지침'), look: [0.2, 0.4], seed: 3, rot: 8, headDy: 12, sweat: ph === 5 });
      zero += `<rect x="${dx - 280}" y="${dy - 150}" width="560" height="34" rx="8" fill="#C9A27A" stroke="${INK}" stroke-width="7"/><rect x="${dx - 250}" y="${dy - 116}" width="26" height="140" fill="#B08A62" stroke="${INK}" stroke-width="5"/><rect x="${dx + 224}" y="${dy - 116}" width="26" height="140" fill="#B08A62" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M${dx - 116} ${dy - 150} L${dx - 102} ${dy - 268} L${dx + 102} ${dy - 268} L${dx + 116} ${dy - 150} Z" fill="#C9CED8" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><ellipse cx="${dx}" cy="${dy - 372}" rx="96" ry="56" fill="#BFE9FF" opacity=".3"/>`;
      if (ph === 5) { if (lt > tTech) w += fkAt(dx - 330, dy - 520, `<circle r="44" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M0 -26 L8 -10 L26 -10 L12 2 L18 20 L0 10 L-18 20 L-12 2 L-26 -10 L-8 -10 Z" fill="#C9CED8" stroke="${INK}" stroke-width="4"/>`, gfIn(lt, tTech, 3.4, 0.42));
        if (lt > tSp) for (let i = 0; i < 4; i++) w += fkAt(dx + 280, dy - 280 - i * 34, `<rect x="-70" y="-14" width="140" height="28" rx="5" fill="${['#FFF3C4', '#E8F4FF', '#FFE1E1', '#EDE8FF'][i]}" stroke="${INK}" stroke-width="4"/>`, gfIn(lt, tSp + i * 0.12, 3.4, 0.42));
        if (lt > tF) for (let i = 0; i < 6; i++) { const u = ((lt - tF) * 1.3 + i / 6) % 1; w += fkAt(lerp(dx + 120, kx, u), lerp(dy - 420, ky + 60, u) - Math.sin(Math.PI * u) * 160, i % 2 ? `<circle r="22" fill="#FFD84A" stroke="${INK}" stroke-width="5"/>` : `<rect x="-26" y="-18" width="52" height="36" rx="4" fill="#fff" stroke="${INK}" stroke-width="4"/>`, 1, u * 360); }
        if (lt > tY) hud += fkAt(1700, 92, gfChip('PM 11:40', { size: 40, icon: 'moon', bg: '#fff' }), gfBeat(lt, tY, 0.16, 4, 8)) + gfChipAt(lt, tY, 960, 120, '야근 중', { size: 42, bg: '#EDE8FF', col: '#5B4FCF' }); } }
    // 목줄(점선): 밀 대왕 잎 손 → 제로 목
    if (leash > 0.02) { const hx = zx + (office ? 30 : 40), hy = FY - 330, lx = kx + 250 * kS, ly = ky + 180 * kS, k = leash;
      w += `<path d="M${f1(lx)} ${f1(ly)} Q${f1((lx + hx) / 2)} ${f1(Math.min(ly, hy) - 120 * (1 - k) + 60)} ${f1(lerp(lx, hx, k))} ${f1(lerp(ly, hy, k))}" fill="none" stroke="#FFC85A" stroke-width="12" stroke-dasharray="16 12" stroke-dashoffset="${f1(-run * 30)}"/>` +
        (k > 0.95 ? `<ellipse cx="${f1(zx + 8)}" cy="${f1(FY - 312)}" rx="60" ry="16" fill="none" stroke="#FFC85A" stroke-width="10" stroke-dasharray="14 10"/>` : ''); }
    if (ph === 3 && king > 0.3) { hud += fkAt(560, 110, gfPanel(560, 120, { bg: '#fff' }) + gfT(-200, -6, '보스', 30, GFC.coral) + gfT(-20, -6, '밀 대왕', 44, GFC.navy) + `<g transform="translate(-230 26)">${gfBar(460, 1, { h: 26, col: GFC.coral })}</g>`, gfIn(lt, tK + 0.3, 3, 0.45));
      if (lt > tT) hud += gfChipAt(lt, tT + 0.3, 1600, 900, '밀이 인간을 길들였다 (뜻을 옮김)', { size: 34, bg: '#FFF3C4', rot: -2 }); }
    if (ph >= 4) hud += fkAt(560, 110, gfPanel(560, 120, { bg: '#fff' }) + gfT(-200, -6, '보스', 30, GFC.coral) + gfT(-20, -6, '밀 대왕', 44, GFC.navy) + `<g transform="translate(-230 26)">${gfBar(460, 1, { h: 26, col: GFC.coral })}</g>`, ph === 4 ? 1 - gfK(0.3, 0.6, lt) : 0);
    cam = ph === 3 ? qLerpCam(gfK(tK - 0.3, tK + 1.0, lt), [960, 620, 1.0], [960, 560, 0.92]) : [960, 560, 0.92];
  }
  let h = fkDefs() + `<rect x="-600" y="-600" width="3120" height="2280" fill="#C9973F"/><g transform="translate(0 -230)">${qPlate('wheat', cam, 0.6)}</g>` + qCam(cam, w + zero);
  if (night > 0.01) h += `<rect x="-300" y="-300" width="2600" height="1600" fill="#1B2347" opacity="${f1(0.45 * night * 100) / 100}"/>`;
  if (ph === 3) { const tK = spW(a, '밀이', 1.7); if (lt > tK && lt < tK + 0.8) { const [sx, sy] = gfShake(lt, tK, 18, 0.8); h = `<g transform="translate(${f1(sx)} ${f1(sy)})">${h}</g>`; } }
  return h + hud;
}
