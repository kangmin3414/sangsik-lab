/* ---------- experiment 016, part 2: experiments 2-5, the summit, recap, HUD ---------- */

// 22-23 experiment 2: see the big as small
function hbigScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  if (k === 0) return expCard16(t, lt, a, 2, `<g>${`<circle cx="0" cy="0" r="62" fill="#fff" stroke="${INK}" stroke-width="8"/><circle cx="0" cy="0" r="44" fill="#CFE6F2"/><line x1="44" y1="44" x2="100" y2="100" stroke="${INK}" stroke-width="18" stroke-linecap="round"/>`}</g>`);
  let h = meeting16(t) + slide16(960, 315, 1, t, {});
  const g = 1 + 0.25 * easeInOut(prog(lt, 0.2, 1.6));
  h += `<path d="M1180 900 L1500 ${f1(900 - 620 * g)} L1820 900 Z" fill="#8A93A0" opacity=".35"/>`;
  h += EX2({ t, seed: 1680, x: 1480, y: 900, s: 0.9 * g, pose: '팔짱', ex: exprAt([[0, '결심']], t), look: [-0.6, 0.3] });
  h += ZC({ t, seed: 1681, x: 560, y: 890, s: 0.3, pose: '움츠림', cape: 0.05, ex: exprAt([[0, '겁먹음']], t), look: [0.8, -0.8] });
  h += pop(t, T0 + 0.5, t + 99, 1150, 230, label(0, 0, '산?!', { size: 46, bg: '#fff' }), { rot: 4 });
  return h;
}
// 24-25 "see the great man as small"
function hbigqScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  let h = ancient16(t);
  if (k === 0) {
    h += MZ({ t, seed: 1682, x: 280, y: 880, s: 0.48, pose: '설명', ex: exprAt([[0, '미소']], t), look: [0.7, -0.2] });
    h += quoteBig16(t, T0 + 0.1, 1000, 340, ['높은 사람을 만날 때는 그를 작게 보라.', '그 우뚝한 모습을 보지 마라.'], '『맹자』 진심 하', { w: 1180, size: 50 });
    const sh = easeInOut(prog(lt, 0.5 * D, D)), gs = lerp(0.95, 0.5, sh);
    h += EX2({ t, seed: 1683, x: 1460, y: 880, s: gs, pose: '팔짱', ex: exprAt([[0, '결심'], [0.7 * D, '놀람']], lt), look: [-0.6, 0] });
    h += ZC({ t, seed: 1684, x: 900, y: 880, s: lerp(0.3, 0.42, sh), pose: '서기', cape: 0.05, ex: exprAt([[0, '걱정'], [0.8 * D, '기본']], lt), look: [0.8, -0.3] });
    return h;
  }
  const items = [['높은 집', 420, house16], ['가득 차린 상', 960, table16], ['수백 명의 시중', 1500, crowd16]];
  items.forEach(([nm, x, fn], j) => { const at = 0.15 + j * 0.45, kk = prog(lt, at, at + 0.35);
    h += pop(t, T0 + at, t + 99, x, 470, fn(t) + T8(0, 200, nm, { size: 40, fill: NAVY }), {});
    const xk = prog(lt, at16(t, a, '저쪽에', 0) + j * 0.2, at16(t, a, '저쪽에', 0.4) + j * 0.2);
    if (xk > 0) h += `<g transform="translate(${x} 440)" opacity=".9"><path d="M-130 -130 L${f1(lerp(-130, 130, xk))} ${f1(lerp(-130, 130, xk))}" stroke="${RED}" stroke-width="16" stroke-linecap="round"/><path d="M130 -130 L${f1(lerp(130, -130, xk))} ${f1(lerp(-130, 130, xk))}" stroke="${RED}" stroke-width="16" stroke-linecap="round"/></g>`; });
  h += pop(t, T0 + at16(t, a, '내가 어찌', 0), t + 99, 960, 150, label(0, 0, '내가 어찌 그를 두려워하랴', { size: 48, bg: YEL }), { rot: -2 });
  return h;
}
function house16() { return `<path d="M-120 100 L-120 -40 L0 -130 L120 -40 L120 100 Z" fill="#E8D6B0" stroke="${INK}" stroke-width="7"/><path d="M-150 -30 L0 -150 L150 -30" fill="none" stroke="#7A2A20" stroke-width="18" stroke-linecap="round"/><rect x="-30" y="30" width="60" height="70" fill="#7A5235" stroke="${INK}" stroke-width="5"/>`; }
function table16() { let h = `<rect x="-150" y="40" width="300" height="24" rx="8" fill="#8A5A34" stroke="${INK}" stroke-width="6"/><rect x="-130" y="64" width="20" height="50" fill="#7A4A2A"/><rect x="110" y="64" width="20" height="50" fill="#7A4A2A"/>`;
  [[-90, '#F2B8A0'], [-20, '#FFE27A'], [50, '#B5D88A'], [110, '#F2A0A0']].forEach(([x, c]) => h += `<ellipse cx="${x}" cy="30" rx="34" ry="16" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="${x}" cy="16" r="18" fill="${c}" stroke="${INK}" stroke-width="4"/>`); return h; }
function crowd16(t) { let h = ''; for (let i = 0; i < 9; i++) { const x = -120 + (i % 5) * 60 + (i > 4 ? 30 : 0), y = i > 4 ? 60 : 0; h += `<circle cx="${x}" cy="${y - 40}" r="22" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M${x - 24} ${y + 30} Q${x} ${y - 24} ${x + 24} ${y + 30} Z" fill="#9A8A70" stroke="${INK}" stroke-width="5"/>`; } return h; }
// 26-27 the halo effect
function hhaloScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  let h = labBg(t);
  if (k === 0) {
    h += P14(560, 880, 0.62, '#6B7A4E', { t, seed: 1690, pose: '허리', ex: exprAt([[0, '뿌듯']], t), look: [0.3, 0] });
    h += `<ellipse cx="560" cy="${f1(880 + (36 - 560) * 0.62)}" rx="70" ry="16" fill="none" stroke="${YEL}" stroke-width="9" opacity="${f1((0.6 + 0.4 * Math.sin(t * 4)) * 100) / 100}"/>`;
    h += pop(t, T0 + 0.3, t + 99, 560, 240, label(0, 0, '체격 좋음 ✓', { size: 36, bg: MINT }), {});
    [['지능', 'A'], ['성실함', 'A'], ['리더십', 'A']].forEach(([nm, g], j) => { const at = at16(t, a, '다른 점수', 0) + j * 0.35;
      h += pop(t, T0 + at, t + 99, 1200 + j * 0, 330 + j * 150, card14(0, 0, 420, 110, T8(-110, 16, nm, { size: 40 }) + T8(130, 20, g, { size: 60, fill: '#2E9E5B' }), { bg: '#fff' }), { rot: (j - 1) * 2 }); });
    return h;
  }
  h += EX2({ t, seed: 1691, x: 960, y: 880, s: 0.62, pose: '팔짱', ex: exprAt([[0, '결심']], t) });
  const g = 1 + 0.08 * Math.sin(t * 3);
  h += `<g opacity=".55"><circle cx="960" cy="560" r="${f1(330 * g)}" fill="url(#amber)"/></g>`;
  [['직함', 620, 320], ['시계', 1300, 320], ['큰 사무실', 1320, 640]].forEach(([nm, x, y], j) => h += pop(t, T0 + 0.2 + j * 0.3, t + 99, x, y, label(0, 0, nm, { size: 40, bg: YEL }), { bob: 3, rot: (j - 1) * 4 }));
  h += pop(t, T0 + 0.4 * D, t + 99, 960, 140, label(0, 0, '하나가 → 전체를 크게', { size: 44, bg: '#fff' }), {});
  return h;
}
// 28-31 Zero's two columns
function notebook16(x, y, t, lt, a, k) {
  let h = `<g transform="translate(${x} ${y})"><rect x="-500" y="-300" width="1000" height="600" rx="18" fill="#FFFDF4" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 9; i++) h += `<line x1="-470" y1="${-200 + i * 56}" x2="470" y2="${-200 + i * 56}" stroke="#C9D8EA" stroke-width="3"/>`;
  h += `<line x1="0" y1="-280" x2="0" y2="280" stroke="${RED16}" stroke-width="5"/>` + T8(-250, -226, '저 사람에게 있는 것', { size: 40, fill: '#5A6B7A' }) + T8(250, -226, '나에게 있는 것', { size: 40, fill: '#C2410C' });
  const L = ['직함', '비싼 시계', '넓은 사무실'], R = ['석 달 치 데이터', '현장에서 본 문제', '고객 인터뷰 12건'];
  if (k >= 1) {
    const T0 = t - lt;
    L.forEach((s2, j) => { const kk = k > 1 ? 1 : prog(lt, at16(t, a, '왼쪽', 0.3) + j * 0.3, at16(t, a, '왼쪽', 0.6) + j * 0.3); if (kk > 0) h += T8(-250, -120 + j * 112, s2, { size: 46, fill: '#5A6B7A', op: f1(kk * 100) / 100 }); });
    R.forEach((s2, j) => { const kk = k > 1 ? 1 : prog(lt, at16(t, a, '오른쪽', 0.3) + j * 0.35, at16(t, a, '오른쪽', 0.6) + j * 0.35); if (kk > 0) h += T8(250, -120 + j * 112, s2, { size: 46, fill: NAVY, op: f1(kk * 100) / 100 }); });
  }
  return h + '</g>';
}
function hlistScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  let h = office16(t);
  if (k <= 1) {
    h += notebook16(960, 440, t, lt, a, k);
    h += ZC({ t, seed: 1700, x: 1660, y: 900, s: 0.36, pose: '턱괴기', cape: 0.05, ex: exprAt([[0, '생각']], t), look: [-0.8, -0.3] });
    return h;
  }
  if (k === 2) {
    h += `<g transform="translate(700 400) scale(.62)">${notebook16(0, 0, t, lt, a, 2)}</g>`;
    h += `<ellipse cx="855" cy="400" rx="190" ry="160" fill="none" stroke="${YEL}" stroke-width="10"/>`;
    h += ZC({ t, seed: 1701, x: 1400, y: 890, s: 0.5, pose: '만세', cape: 0.15, ex: exprAt([[0, '놀람'], [0.5, '신남']], lt), look: [-0.6, -0.3] });
    return h;
  }
  const sh = easeInOut(prog(lt, 0.1, D * 0.8));
  h += EX2({ t, seed: 1702, x: 1300, y: 880, s: lerp(0.95, 0.6, sh), pose: '서기', ex: exprAt([[0, '결심'], [0.5 * D, '미소']], lt), look: [-0.6, 0] });
  h += ZC({ t, seed: 1703, x: 720, y: 880, s: lerp(0.42, 0.56, sh), pose: '허리', cape: lerp(0.05, 0.2, sh), ex: exprAt([[0, '기본'], [0.6 * D, '뿌듯']], lt), look: [0.6, -0.1] });
  h += pop(t, T0 + 0.5 * D, t + 99, 1000, 200, label(0, 0, '사람 대 사람', { size: 48, bg: MINT }), {});
  return h;
}
// 32-34 Wednesday: one slide, and the secret
function hslideScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  let h = meeting16(t) + slide16(960, 315, 1, t, { bad: k >= 1, note: k >= 1 });
  h += `<rect x="560" y="560" width="800" height="40" rx="10" fill="#6A5240" stroke="${INK}" stroke-width="7"/>`;
  if (k === 0) {
    h += pop(t, T0 + 0.1, t + 99, 330, 150, label(0, 0, '수요일 · 리허설', { size: 42, bg: '#fff' }), { rot: -3 });
    const sk = easeInOut(prog(lt, at16(t, a, '콩알', -0.8), at16(t, a, '콩알', 0.4)));
    h += ZC({ t, seed: 1710, x: 1500, y: 880, s: lerp(0.56, 0.24, sk), pose: mixPose('허리', '움츠림', sk), cape: lerp(0.2, 0, sk), ex: exprAt([[0, '결심'], [0.5 * D, '겁먹음']], lt), look: [-0.8, -0.4] });
    return h;
  }
  if (k === 1) {
    h = zoom16(h, 1060, 300, 1 + 0.5 * easeInOut(prog(lt, 0, 1.2)));
    h += pop(t, T0 + at16(t, a, '틀렸는데', 0), t + 99, 1400, 750, label(0, 0, '지난달 숫자 하나가 틀림', { size: 40, bg: '#FFB0A0' }), { rot: 2 });
    return h;
  }
  h += ZC({ t, seed: 1711, x: 1500, y: 880, s: 0.26, pose: '움츠림', cape: 0, ex: exprAt([[0, '겁먹음']], t), look: [-0.8, -0.4], sweat: true });
  return h;
}
const zoom16 = (inner, cx, cy, z) => `<g transform="translate(${f1(cx)} ${f1(cy)}) scale(${f1(z * 1000) / 1000}) translate(${f1(-cx)} ${f1(-cy)})">${inner}</g>`;
// 35-36 experiment 3
function hselfScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  if (k === 0) return expCard16(t, lt, a, 3, `<g><rect x="-70" y="-90" width="140" height="180" rx="20" fill="#CFE6F2" stroke="${INK}" stroke-width="8"/><path d="M-30 0 l22 22 l40 -44" fill="none" stroke="#2E9E5B" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></g>`);
  let h = ancient16(t);
  h += quoteBig16(t, T0 + 0.1, 1000, 340, ['행동이 마음에 떳떳하지 않으면,', '그 기운은 굶주린다.'], '『맹자』 공손추 상', { w: 1100 });
  const def = easeInOut(prog(lt, 0.45 * D, D));
  h += ZC({ t, seed: 1720, x: 960, y: 880, s: lerp(0.46, 0.34, def), pose: '움츠림', cape: 0, ex: exprAt([[0, '걱정'], [0.5 * D, '지친']], lt), look: [0, 0.6] });
  h += MZ({ t, seed: 1721, x: 300, y: 880, s: 0.46, pose: '서기', ex: exprAt([[0, '진지' in E ? '진지' : '결심']], t), look: [0.7, 0] });
  if (def > 0.2) h += pop(t, T0 + 0.6 * D, t + 99, 1180, 560, label(0, 0, '꼬르륵…', { size: 38, bg: '#fff' }), { rot: 4, bob: 3 });
  return h;
}
// 37-39 Confucius → Zengzi: the great courage
function hselfqScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  if (k === 0) {
    let h = ancient16(t);
    h += P14(1340, 880, 0.5, '#A89A80', { t, seed: 1730, pose: '서기', ex: exprAt([[0, '기본']], t), look: [-0.7, 0], patches: true });
    h += ZC({ t, seed: 1731, x: 760, y: 880, s: 0.4, pose: '움츠림', cape: 0, ex: exprAt([[0, '겁먹음']], t), look: [0.8, 0], shiver: true });
    h += pop(t, T0 + 0.1, t + 99, 900, 250, label(0, 0, '곧지 못하면 → 허름한 사람 앞에서도 떤다', { size: 40, bg: '#FFB0A0' }), {});
    return h;
  }
  if (k === 1) {
    let h = ancient16(t, { dusk: true });
    for (let i = 0; i < 22; i++) { const x = 1100 + (i % 11) * 80, y = 880 - Math.floor(i / 11) * 40; h += P14(x, y, 0.26, '#8A7A60', { t, seed: 1740 + i, pose: '서기', ex: exprAt([[0, '결심']], t), look: [-0.7, 0], still: true }); }
    const x = lerp(300, 820, easeInOut(prog(lt, 0.2, D)));
    h += shadow(x, 884, 70) + ZC({ t, seed: 1732, x, y: 880, s: 0.48, pose: walkPose(t * 6, 0.8), cape: 0.35, ex: exprAt([[0, '결심']], t), look: [0.8, 0] });
    h += pop(t, T0 + 0.1, t + 99, 900, 250, label(0, 0, '곧다면 → 천만 명이 막아서도 간다', { size: 42, bg: YEL }), {});
    return h;
  }
  let h = labBg(t);
  h += doctor(520, 960, 0.6, { t, expr: '미소', talk: env(t), pose: 'point' });
  h += ZC({ t, seed: 1733, x: 1420, y: 890, s: 0.46, pose: '서기', cape: 0, ex: exprAt([[0, '생각']], t), look: [-0.7, -0.2] });
  h += pop(t, T0 + at16(t, a, '숨길 게', 0), t + 99, 980, 220, label(0, 0, '당당함 = 숨길 게 없음', { size: 48, bg: MINT }), {});
  return h;
}
// 40-41 value affirmation (Creswell et al. 2005)
function hvalueScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  let h = labBg(t);
  if (k === 0) {
    h += `<rect x="1100" y="560" width="640" height="34" rx="10" fill="#6A5240" stroke="${INK}" stroke-width="6"/>`;
    for (let j = 0; j < 3; j++) h += P14(1240 + j * 180, 560, 0.4, '#3A4048', { t, seed: 1750 + j, pose: '팔짱', ex: exprAt([[0, '결심']], t), look: [-0.7, 0.1] });
    h += pop(t, T0 + 0.2, t + 99, 1420, 260, label(0, 0, '심사위원', { size: 36, bg: '#fff' }), {});
    h += P14(700, 880, 0.5, '#7FA8D6', { t, seed: 1753, pose: '서기', ex: exprAt([[0, '걱정']], t), look: [0.7, -0.2] });
    const wk = at16(t, a, '절반에게', 0);
    h += pop(t, T0 + wk, t + 99, 420, 420, card14(0, 0, 400, 240, T8(0, -50, '내가 가장', { size: 38 }) + T8(0, 6, '중요하게 여기는 가치', { size: 34 }) + T8(0, 76, '"정직, 가족…"', { size: 34, fill: '#C2410C' }), { bg: '#FFF7D6' }), { rot: -3 });
    h += pop(t, T0 + 0.3, t + 99, 700, 200, label(0, 0, '85명 · 즉석 발표', { size: 40, bg: YEL }), { rot: -2 });
    return h;
  }
  const bars = [['통제 집단', 0.85, '#8C98A4'], ['가치를 쓴 집단', 0.45, MINT]];
  h += `<line x1="560" y1="820" x2="1360" y2="820" stroke="#fff" stroke-width="6"/>`;
  bars.forEach(([nm, v, c], j) => { const x = 760 + j * 400, kk = easeOut(prog(lt, 0.2 + j * 0.4, 1.0 + j * 0.4));
    h += `<rect x="${x - 90}" y="${f1(820 - 460 * v * kk)}" width="180" height="${f1(460 * v * kk)}" rx="12" fill="${c}" stroke="${INK}" stroke-width="6"/>` + T8(x, 880, nm, { size: 38, fill: '#fff' }); });
  h += pop(t, T0 + 0.2, t + 99, 960, 200, label(0, 0, '발표 때 스트레스 호르몬(코르티솔) 반응', { size: 38, bg: '#fff' }), {});
  h += T8(1740, 900, '개념도', { anchor: 'end', size: 26, fill: '#9FB4D8', w: 700 });
  return h;
}
// 42-44 telling the team lead
function hfixScene(t, lt, a) {
  const k = a.k || 1, D = D16(a), T0 = t - lt;
  if (k <= 2) {
    let h = office16(t) + desk12(1300, 760, t, 1) + chair12(1380, 900, 0.56);
    h += TLD({ t, seed: 1760, x: 1380, y: 900, s: 0.56, pose: '앉기', ex: exprAt(k === 1 ? [[0, '기본'], [0.6 * D, '놀람']] : [[0, '미소']], lt), look: [-0.7, -0.2] });
    h += ZC({ t, seed: 1761, x: 760, y: 890, s: 0.52, pose: k === 1 ? '내밀기' : '서기', cape: k === 1 ? 0.05 : 0.15, ex: exprAt(k === 1 ? [[0, '결심']] : [[0, '미안'], [0.5 * D, '미소']], lt), look: [0.7, 0] });
    if (k === 1) h += `<g transform="translate(905 ${f1(890 + (300 - 560) * 0.52)}) rotate(-6)"><rect x="-50" y="-64" width="100" height="128" rx="6" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M-30 -30 L30 -30 M-30 -6 L30 -6 M-30 18 L14 18" stroke="#9CB3C8" stroke-width="6"/><circle cx="20" cy="44" r="14" fill="none" stroke="${RED16}" stroke-width="5"/></g>`;
    if (k === 2) h += pop(t, T0 + 0.4 * D, t + 99, 1380, 300, label(0, 0, '휴…', { size: 42, bg: '#fff' }), { rot: 3 });
    return h;
  }
  let h = office16(t, { night: true }) + dim16(0.25);
  const lift = 0.15 + 0.4 * easeOut(prog(lt, 0.4, 2.2));
  for (let i = 0; i < 5; i++) { const ph = (t * 0.7 + i / 5) % 1; h += `<path d="M${f1(1900 - ph * 1500)} ${520 + i * 40} q40 -18 80 0 q40 18 80 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="${f1(Math.sin(ph * Math.PI) * 0.6 * 100) / 100}"/>`; }
  h += ZC({ t, seed: 1762, x: 900, y: 890, s: 0.58, pose: '허리', cape: lift, ex: exprAt([[0, '놀람'], [1.2, '미소']], lt), look: [-0.5, -0.3] });
  return h;
}
// 45-47 experiment 4: Thursday night, trying to be charismatic overnight
function hrushScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  if (k === 0) return expCard16(t, lt, a, 4, sprout16(0, 80, 1.3, t, { grow: 0.7 }));
  let h = nightRoom12(t) + `<rect x="1000" y="700" width="560" height="30" rx="8" fill="#5A3E2C" stroke="${INK}" stroke-width="6"/>`;
  h += `<g transform="translate(1280 600)"><rect x="-170" y="-110" width="340" height="210" rx="12" fill="#1F2D44" stroke="${INK}" stroke-width="7"/><rect x="-150" y="-92" width="300" height="172" rx="6" fill="#8FDBFF"/>`;
  h += P14(0, 70, 0.28, '#2F3540', { t, seed: 1770, pose: '주먹', ex: exprAt([[0, '결심']], t), still: true }) + `<path d="M-200 100 L200 100 L230 120 L-230 120 Z" fill="#9AA6B2" stroke="${INK}" stroke-width="6"/></g>`;
  h += `<circle cx="1280" cy="600" r="300" fill="url(#screenGlow)" opacity=".5"/>`;
  if (k === 1) {
    h += ZC({ t, seed: 1771, x: 720, y: 900, s: 0.56, pose: '주먹', cape: 0.2 + 0.2 * Math.abs(Math.sin(t * 6)), ex: exprAt([[0, '결심']], t), look: [0.7, -0.2] });
    h += pop(t, T0 + at16(t, a, '목소리를', 0), t + 99, 560, 300, label(0, 0, '(굵게) 에헴… 여러분!', { size: 40, bg: '#fff' }), { rot: -3 });
    h += pop(t, T0 + 0.3, t + 99, 1500, 200, label(0, 0, '연설 영상 12개째', { size: 34, bg: YEL }), { rot: 3 });
    return h;
  }
  h += ZC({ t, seed: 1772, x: 720, y: 900, s: 0.6, pose: '만세', cape: 0.5 + 0.3 * Math.sin(t * 9), ex: exprAt([[0, '신남']], t), look: [0.3, -0.4] });
  h += pop(t, T0 + 0.2, t + 99, 480, 250, label(0, 0, '하루 만에!', { size: 50, bg: YEL }), { rot: -5, wobble: 2 });
  return h;
}
// 48-52 the farmer of Song
function hsongScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  if (k === 0) {
    let h = nightRoom12(t);
    h += doctor(520, 960, 0.6, { t, expr: '미소', talk: env(t) });
    h += ZC({ t, seed: 1780, x: 1400, y: 900, s: 0.5, pose: '주먹', cape: 0.3, ex: exprAt([[0, '결심'], [0.4 * D, '놀람']], lt), look: [-0.7, 0] });
    h += pop(t, T0 + 0.5 * D, t + 99, 960, 200, label(0, 0, '송나라 농부?', { size: 48, bg: YEL }), {});
    return h;
  }
  if (k === 1) {
    let h = paddy16(t) + pop(t, T0 + 0.1, t + 99, 330, 150, label(0, 0, '옛날 송나라', { size: 42, bg: '#fff' }), { rot: -3 });
    const pk = prog(lt, at16(t, a, '논에', 0), D);
    for (let i = 0; i < 9; i++) { const x = 300 + i * 160, done = clamp(pk * 9 - i, 0, 1); h += sprout16(x, 760 + (i % 2) * 40, 0.8, t, { tall: done, grow: 0.3 }); }
    const zx = 300 + clamp(pk * 9, 0, 8.6) * 160;
    h += ZC({ t, seed: 1781, x: zx - 70, y: 840, s: 0.46, pose: Math.sin(t * 8) > 0 ? '뽑기' : '웅크림', ex: exprAt([[0, '결심']], t), look: [0.6, 0.6], hat: true });
    return h;
  }
  if (k === 2) {
    let h = BG('#E9C9A0') + BG('url(#hatch)').replace('/>', ' opacity=".14"/>') + floor16(880, '#A8865A');
    h += `<rect x="1200" y="200" width="420" height="300" rx="12" fill="url(#sunset)" stroke="${INK}" stroke-width="9"/>`;
    h += ZC({ t, seed: 1782, x: 760, y: 900, s: 0.56, pose: '허우적', ex: exprAt([[0, '지친'], [0.5, '뿌듯']], lt), look: [0.4, 0], hat: true, sweat: true });
    return h;
  }
  if (k === 3) {
    let h = paddy16(t, { dusk: true });
    for (let i = 0; i < 9; i++) h += sprout16(300 + i * 160, 760 + (i % 2) * 40, 0.8, t, { tall: 1, grow: 0.3, dead: easeInOut(prog(lt, 0.6, 1.6)) });
    const x = lerp(-100, 520, easeOut(prog(lt, 0, 1.2)));
    h += P14(x, 860, 0.36, '#7FA8D6', { t, seed: 1783, pose: lt < 1.2 ? walkPose(t * 10, 1) : '서기', ex: exprAt([[0, '기본'], [1.3, '놀람']], lt), look: [0.8, 0.2] });
    h += pop(t, T0 + 1.5, t + 99, 960, 200, label(0, 0, '모두 말라 버린 싹', { size: 44, bg: '#fff' }), { rot: -2 });
    return h;
  }
  let h = BG('#2A1A1E') + BG('url(#dots)');
  h += pop(t, T0 + 0.1, t + 99, 960, 360, big(0, 0, [[['조장', YEL], [' 助長', '#fff']]], { size: 150, sw: 24 }), { noPop: false, inDur: 0.4 });
  h += pop(t, T0 + 0.5, t + 99, 960, 560, label(0, 0, '자라는 걸(長) 돕는다(助)', { size: 46, bg: '#fff' }), {});
  for (let i = 0; i < 5; i++) h += sprout16(640 + i * 160, 860, 0.7, t, { tall: 1, dead: 1 });
  return h;
}
// 53-54 neither forget nor force
function hsongqScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  let h = paddy16(t);
  if (k === 0) {
    h += `<line x1="960" y1="-600" x2="960" y2="1680" stroke="${INK}" stroke-width="10"/>`;
    for (let i = 0; i < 3; i++) { h += sprout16(200 + i * 140, 780, 0.7, t, { grow: 0.2 }); h += `<path d="M${230 + i * 140} 780 q10 -50 30 -60 q-6 30 10 60" fill="#7A9A3A" stroke="${INK}" stroke-width="3"/>`; }
    h += ZC({ t, seed: 1790, x: 560, y: 860, s: 0.4, pose: '앉기', ex: exprAt([[0, '지친']], t), look: [0, 0.4], hat: true });
    for (let i = 0; i < 3; i++) h += sprout16(1160 + i * 160, 780, 0.7, t, { tall: 1 });
    h += ZC({ t, seed: 1791, x: 1660, y: 860, s: 0.4, pose: '뽑기', ex: exprAt([[0, '결심']], t), look: [0.4, 0.6], hat: true });
    h += pop(t, T0 + 0.3, t + 99, 480, 200, label(0, 0, '포기 ✗', { size: 44, bg: '#FFB0A0' }), {}) + pop(t, T0 + 0.6, t + 99, 1440, 200, label(0, 0, '억지로 ✗', { size: 44, bg: '#FFB0A0' }), {});
    h += pop(t, T0 + at16(t, a, '잊지도', 0), t + 99, 960, 420, label(0, 0, '잊지도 말고, 억지로 돕지도 마라', { size: 50, bg: YEL }), {});
    return h;
  }
  const g = prog(lt, 0.2, D);
  for (let i = 0; i < 7; i++) h += sprout16(360 + i * 200, 800, 0.9, t, { grow: clamp(g * 1.6 - i * 0.08, 0.1, 1.2) });
  for (let i = 0; i < 6; i++) { const kk = prog(lt, 0.3 + i * 0.4, 0.6 + i * 0.4); if (kk > 0) h += pop(t, t - lt + 0.3 + i * 0.4, t + 99, 360 + i * 240, 300, label(0, 0, ['정직 1', '약속 1', '연습 1', '정직 2', '성실 1', '…'][i], { size: 34, bg: '#fff' }), { rot: (i % 2 ? 3 : -3) }); }
  h += pop(t, T0 + 0.2, t + 99, 960, 150, label(0, 0, '옳은 일이 하나하나 쌓여서', { size: 46, bg: MINT }), {});
  return h;
}
// 55-56 three rehearsals, then sleep
function hsmallScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  let h = nightRoom12(t);
  if (k === 0) {
    h += `<rect x="1000" y="700" width="560" height="30" rx="8" fill="#5A3E2C" stroke="${INK}" stroke-width="6"/><g transform="translate(1280 660)"><path d="M-170 40 L170 40 L200 60 L-200 60 Z" fill="#9AA6B2" stroke="${INK}" stroke-width="6"/><rect x="-170" y="${f1(-170 + 210 * prog(lt, 0.1, 0.7))}" width="340" height="${f1(210 * (1 - prog(lt, 0.1, 0.7)) + 1)}" rx="10" fill="#1F2D44" stroke="${INK}" stroke-width="6"/></g>`;
    const n = Math.min(3, Math.floor(prog(lt, 0.6, 0.7 * D) * 3.2));
    h += ZC({ t, seed: 1800, x: 720, y: 900, s: 0.56, pose: '설명', cape: 0.3, ex: exprAt([[0, '결심']], t), look: [0.6, 0] });
    for (let i = 0; i < 3; i++) h += `<circle cx="${560 + i * 110}" cy="250" r="40" fill="${i < n ? MINT : 'none'}" stroke="#fff" stroke-width="6"/>` + (i < n ? T8(560 + i * 110, 266, '✓', { size: 44, fill: NAVY }) : '');
    h += pop(t, T0 + 0.2, t + 99, 670, 150, label(0, 0, '소리 내어 딱 세 번', { size: 40, bg: '#fff' }), {});
    return h;
  }
  h += `<rect x="520" y="700" width="900" height="160" rx="30" fill="#3B4A7A" stroke="${INK}" stroke-width="8"/><ellipse cx="640" cy="700" rx="110" ry="40" fill="#fff" stroke="${INK}" stroke-width="6"/>`;
  h += ZC({ t, seed: 1801, x: 760, y: 720, s: 0.44, rot: 90, ex: exprAt([[0, '미소']], t), noBlink: true });
  h += `<path d="M700 690 Q1000 650 1400 690 L1400 860 L700 860 Z" fill="#5C7AD6" stroke="${INK}" stroke-width="8"/>`;
  h += pop(t, T0 + 0.3, t + 99, 1500, 300, label(0, 0, '23:40', { size: 44, bg: '#fff' }), {});
  return h;
}
// 57-60 experiment 5: Friday, the presentation
function hpresScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  if (k === 0) return expCard16(t, lt, a, 5, `<g transform="translate(0 40)">${HALO(`<g transform="translate(-200 -380)">${capeLocal16(t, 0.7)}</g>`)}</g>`);
  if (k === 1) {
    let h = BG('#E9E4DA') + floor16(880, '#8E7B66') + `<rect x="1080" y="220" width="380" height="660" fill="#8A6A4A" stroke="${INK}" stroke-width="9"/><circle cx="1120" cy="560" r="16" fill="${GOLD16}" stroke="${INK}" stroke-width="5"/>` + T8(1270, 190, '대회의실', { size: 40 });
    const open = easeInOut(prog(lt, 0.6 * D, D));
    if (open > 0) h += `<rect x="1080" y="220" width="${f1(380 * open)}" height="660" fill="#FFF7DA"/>`;
    h += ZC({ t, seed: 1810, x: 860, y: 890, s: 0.6, pose: open > 0 ? '문고리' : '허리', cape: 0.35, ex: exprAt([[0, '결심']], t), look: [0.7, 0] });
    h += pop(t, T0 + 0.1, t + 99, 330, 150, label(0, 0, '금요일', { size: 44, bg: '#fff' }), { rot: -3 });
    return h;
  }
  let h = meeting16(t) + slide16(960, 315, 1, t, { fixed: true }) + `<rect x="300" y="640" width="900" height="40" rx="10" fill="#6A5240" stroke="${INK}" stroke-width="7"/>`;
  h += EX1({ t, seed: 1811, x: 520, y: 880, s: 0.5, pose: k === 2 ? '서기' : '서기', ex: exprAt([[0, '미소']], t), look: [0.8, -0.2], tilt: k === 2 ? Math.sin(t * 5) * 4 : 0 });
  h += EX2({ t, seed: 1812, x: 860, y: 880, s: 0.5, pose: '팔짱', ex: exprAt([[0, k === 3 ? '찡그림' : '기본']], t), look: [0.8, -0.2] });
  h += ZC({ t, seed: 1813, x: 1520, y: 890, s: 0.58, pose: '설명', cape: 0.4, ex: exprAt([[0, '결심']], t), look: [-0.8, 0] });
  if (k === 2) h += pop(t, T0 + 0.2, t + 99, 520, 260, label(0, 0, '👍', { size: 50, bg: MINT }), { bob: 3 });
  if (k === 3) h += pop(t, T0 + 0.2, t + 99, 860, 260, label(0, 0, '너무 낙관적?', { size: 40, bg: '#FFB0A0' }), { rot: 3 });
  return h;
}
// 61-63 不動心: praise and blame are wind
function hbudongScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  if (k === 0) {
    let h = ancient16(t);
    h += GS({ t, seed: 1820, x: 1360, y: 880, s: 0.48, pose: '가리키기', ex: exprAt([[0, '생각']], t), look: [-0.7, 0] });
    h += pop(t, T0 + 0.2, t + 99, 1360, 330, label(0, 0, '재상이 되시면, 흔들리시겠습니까?', { size: 34, bg: '#fff' }), { rot: 2 });
    h += MZ({ t, seed: 1821, x: 600, y: 880, s: 0.54, pose: '서기', ex: exprAt([[0, '미소']], t), look: [0.7, 0] });
    h += pop(t, T0 + at16(t, a, '나는 마흔에', 0), t + 99, 600, 330, label(0, 0, '나는 마흔에 부동심(不動心)', { size: 38, bg: YEL }), { rot: -2 });
    return h;
  }
  let h = mountain16(t) + dim16(0.15);
  const wind = k === 2 ? 1 : 0.6;
  for (let i = 0; i < 8; i++) { const ph = (t * 0.6 + i / 8) % 1, y = 300 + (i * 97) % 500, praise = i % 2 === 0;
    h += `<g transform="translate(${f1(2000 - ph * 2300)} ${y})" opacity="${f1(Math.sin(ph * Math.PI) * 100) / 100}">${praise ? `<path d="M0 10 c-14 -18 -36 -4 -18 14 l18 16 l18 -16 c18 -18 -4 -32 -18 -14 Z" fill="${PINK}" stroke="${INK}" stroke-width="4"/>` : `<path d="M-30 0 L20 0 M8 -12 L20 0 L8 12" stroke="#5A6B7A" stroke-width="7" stroke-linecap="round" fill="none"/>`}</g>`; }
  if (k === 1) {
    h += pop(t, T0 + at16(t, a, '뜻밖의', 0), t + 99, 600, 280, label(0, 0, '뜻밖의 칭찬', { size: 44, bg: PINK, color: '#fff' }), { rot: -3 });
    h += pop(t, T0 + at16(t, a, '완벽하려다', 0), t + 99, 1320, 280, label(0, 0, '완벽하려다 듣는 비방', { size: 44, bg: '#C3CDD8' }), { rot: 3 });
  }
  h += ZC({ t, seed: 1822, x: 960, y: 860, s: 0.5, pose: '허리', cape: 0.55 + 0.3 * wind * (0.5 + 0.5 * Math.sin(t * 3)), ex: exprAt([[0, k === 2 ? '미소' : '결심']], t), look: [0.3, 0], still: true });
  if (k === 2) h += pop(t, T0 + at16(t, a, '망토는', 0), t + 99, 960, 200, label(0, 0, '망토는 흔들려도, 사람은 그대로', { size: 46, bg: YEL }), {});
  return h;
}
// 64-65 Zero answers; the corrected chart
function hpres2Scene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  let h = meeting16(t) + slide16(960, 315, 1, t, { fixed: k === 1 }) + `<rect x="300" y="640" width="900" height="40" rx="10" fill="#6A5240" stroke="${INK}" stroke-width="7"/>`;
  h += EX1({ t, seed: 1811, x: 520, y: 880, s: 0.5, pose: '서기', ex: exprAt([[0, '미소']], t), look: [0.8, -0.2] });
  h += EX2({ t, seed: 1812, x: 860, y: 880, s: 0.5, pose: k === 1 ? '서기' : '팔짱', ex: exprAt([[0, k === 1 ? '미소' : '생각']], t), look: [0.8, -0.2] });
  h += ZC({ t, seed: 1813, x: 1520, y: 890, s: 0.6, pose: k === 1 ? '허리' : '설명', cape: k === 1 ? 0.6 + 0.1 * Math.sin(t * 4) : 0.45, ex: exprAt([[0, k === 1 ? '뿌듯' : '미소']], t), look: [-0.8, 0] });
  if (k === 1) h += pop(t, T0 + at16(t, a, '숨길 게', 0), t + 99, 1520, 250, label(0, 0, '숨길 게 없으니까', { size: 42, bg: MINT }), { rot: -2 });
  return h;
}
// 66-68 the summit
function hpeakScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  let h = mountain16(t);
  for (let i = 0; i < 6; i++) { const ph = (t * 0.8 + i / 6) % 1; h += `<path d="M${f1(1900 - ph * 1600)} ${360 + i * 50} q50 -20 100 0 q50 20 100 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="${f1(Math.sin(ph * Math.PI) * 0.5 * 100) / 100}"/>`; }
  if (k === 2) h += doctor(1240, 880, 0.5, { t, expr: '미소', talk: env(t) });
  h += ZC({ t, seed: 1830, x: 940, y: 860, s: 0.6, pose: '허리', cape: 0.85 + 0.15 * Math.sin(t * 2.5), ex: exprAt([[0, k === 1 ? '미소' : '뿌듯']], t), look: [0.4, -0.2], still: true });
  h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#FF9A5A" opacity=".1"/>`;
  if (k === 0) h += pop(t, T0 + 0.2, t + 99, 420, 170, label(0, 0, '토요일 저녁', { size: 44, bg: '#fff' }), { rot: -3 });
  return h;
}
// 69-71 "when Heaven is about to give a great task"
function hheavenScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  let h = BG('#1F1A2E') + BG('url(#dots)');
  if (k <= 1) {
    h += `<path d="M-600 1000 L300 960 L900 640 L1500 300 L2520 260 L2520 1480 L-600 1480 Z" fill="#3A3150" stroke="${INK}" stroke-width="7"/>`;
    const p = k === 0 ? 0.3 + 0.2 * prog(lt, 0, D) : 0.5 + 0.4 * prog(lt, 0, D), x = lerp(300, 1500, p), y = lerp(960, 300, p);
    h += ZC({ t, seed: 1840, x, y: y + 4, s: 0.44, pose: walkPose(t * 5, 0.6), cape: k === 0 ? 0.2 : 0.6, ex: exprAt([[0, k === 0 ? '지친' : '결심']], t), look: [0.7, -0.4], rot: -18, sweat: k === 0 });
    if (k === 0) h += quoteBig16(t, T0 + 0.1, 640, 260, ['하늘이 큰일을 맡기려 할 때는,', '먼저 그 마음을 괴롭히고, 몸을 고단하게 한다.'], '『맹자』 고자 하', { w: 1200, size: 46 });
    else h += quoteBig16(t, T0 + 0.1, 640, 260, ['그렇게 단련해,', '전에 못 하던 일을 해내게 하려는 것이다.'], '『맹자』 고자 하', { w: 1100, size: 48 });
    return h;
  }
  h += `<ellipse cx="960" cy="600" rx="700" ry="480" fill="url(#warm)" opacity=".5"/>`;
  h += ZC({ t, seed: 1841, x: 960, y: 880, s: 0.56, pose: '서기', cape: 0.4, ex: exprAt([[0, '미소']], t), look: [0, 0] });
  h += pop(t, T0 + 0.2, t + 99, 960, 230, big(0, 0, [[['힘든 시간 ≠ 좋은 것', '#fff']], [['작아진 당신 ≠ ', '#fff'], ['모자란 사람', YEL]]], { size: 70, sw: 14, lh: 100 }), { noPop: true, inDur: 0.5 });
  return h;
}
// 72-74 recap
function hrecapScene(t, lt, a) {
  const k = a.k || 0, D = D16(a), T0 = t - lt;
  let h = labBg(t);
  if (k === 0) {
    const its = [['몸을 펴기', 'pose'], ['작게 보기', 'lens'], ['바로잡기', 'check'], ['억지로 X', 'sprout'], ['바람처럼', 'wind']];
    its.forEach(([nm, ic], j) => { const x = 360 + j * 300, at = 0.2 + j * 0.42 * Math.max(1, D / 5);
      let g = `<circle r="96" fill="#FFF7EC" stroke="${INK}" stroke-width="7"/>`;
      if (ic === 'pose') g += ZC({ t, seed: 1850, x: 0, y: 70, s: 0.24, pose: '허리', ex: exprAt([[0, '결심']], t) });
      if (ic === 'lens') g += `<circle cx="-10" cy="-10" r="40" fill="#CFE6F2" stroke="${INK}" stroke-width="7"/><line x1="18" y1="18" x2="52" y2="52" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>`;
      if (ic === 'check') g += `<path d="M-40 0 l28 28 l52 -56" fill="none" stroke="#2E9E5B" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`;
      if (ic === 'sprout') g += sprout16(0, 60, 0.8, t, { grow: 0.6 });
      if (ic === 'wind') g += `<path d="M-60 -20 q30 -20 60 0 q30 20 60 0 M-60 20 q30 -20 60 0 q30 20 60 0" fill="none" stroke="#5A6B7A" stroke-width="8" stroke-linecap="round"/>`;
      h += pop(t, T0 + at, t + 99, x, 470, g + T8(0, 160, nm, { size: 38, fill: '#fff' }), {}); });
    h += pop(t, T0 + 0.1, t + 99, 960, 180, label(0, 0, '맹자의 다섯 가지 태도', { size: 44, bg: MINT }), {});
    return h;
  }
  if (k === 1) {
    h += pop(t, T0 + 0.1, t + 99, 960, 230, label(0, 0, '이번 주, 딱 하나만', { size: 46, bg: YEL }), {});
    h += pop(t, T0 + at16(t, a, '마음에', 0), t + 99, 960, 470, card14(0, 0, 1180, 230, T8(0, -14, '마음에 걸려 있던 일 하나,', { size: 56 }) + T8(0, 66, '먼저 바로잡기', { size: 60, fill: '#C2410C' }), { bg: '#FFF7D6' }), { rot: -1 });
    h += ZC({ t, seed: 1851, x: 960, y: 900, s: 0.36, pose: '허리', cape: 0.5, ex: exprAt([[0, '뿌듯']], t) });
    return h;
  }
  h += pop(t, T0 + 0.2, t + 99, 960, 230, big(0, 0, [[['나는 ', '#fff'], ['누구 앞에서', YEL]], [['가장 작아질까?', '#fff']]], { size: 82, sw: 15, lh: 108 }), {});
  [['팀장님', 560], ['거래처', 960], ['잘나가는 동창', 1360]].forEach(([s2, x], j) => { h += pop(t, T0 + at16(t, a, '관계만', 0.2 + j * 0.3), t + 99, x, 520, label(0, 0, s2, { size: 36, bg: '#fff' }), { rot: (j - 1) * 3 }); });
  h += ZC({ t, seed: 1852, x: 960, y: 900, s: 0.4, pose: '손인사', cape: 0.5, ex: exprAt([[0, '신남']], t) });
  return h;
}
// 75 care
function hcareScene(t, lt, a) {
  const D = D16(a), T0 = t - lt;
  let h = BG('#F3E9DC') + `<ellipse cx="960" cy="560" rx="760" ry="520" fill="url(#warm)" opacity=".7"/>` + floor16(880, '#D9C7A6');
  h += ZC({ t, seed: 1860, x: 760, y: 880, s: 0.5, pose: '서기', cape: 0.3, ex: exprAt([[0, '미소']], t), look: [0.6, 0] });
  h += doctor(1180, 960, 0.5, { t, expr: '미소' });
  h += pop(t, T0 + 0.3, t + 99, 960, 220, big(0, 0, [[['혼자 버티지 말고,', NAVY]], [['전문가와 상의해 보세요', '#C2410C']]], { size: 62, sw: 0, lh: 86, fill: NAVY, stroke: 'none', shadow: false }), { noPop: true, inDur: 0.6 });
  h += pop(t, T0 + 0.45 * D, t + 99, 960, 420, label(0, 0, '정신건강 위기상담 1577-0199 (24시간)', { size: 32, bg: '#fff' }), {});
  return h;
}
thanksScene = function (t, lt) {
  let h = labBg(t) + particles(t, 77, 30, [0, 0, 1920, 1080], YEL, { speed: 30, r: 5, op: 0.6 });
  h += pop(t, t - lt + 0.2, t + 99, 960, 220, outlined(0, 0, [[['끝까지 함께해 주셔서', '#fff']], [['고맙습니다', YEL]]], { size: 92, sw: 17 }), {});
  h += doctor(480, 960, 0.48, { t, expr: '미소', talk: env(t) });
  h += MZ({ t, seed: 1870, x: 760, y: 890, s: 0.46, pose: '손인사', ex: exprAt([[0, '미소']], t) });
  h += ZC({ t, seed: 1871, x: 1060, y: 890, s: 0.52, pose: '손인사', cape: 0.7 + 0.1 * Math.sin(t * 3), ex: exprAt([[0, '신남']], t) });
  h += TLD({ t, seed: 1872, x: 1340, y: 890, s: 0.48, pose: '손인사', ex: exprAt([[0, '미소']], t) });
  h += pop(t, t - lt + 0.6, t + 99, 960, 420, label(0, 0, '상식실험실', { size: 40, bg: MINT }), {});
  return h;
};

/* ---------- HUD: which day / experiment (outside the camera) ---------- */
const EXP16 = i => (i >= 13 && i <= 21) ? 1 : (i >= 22 && i <= 31) ? 2 : (i >= 32 && i <= 44) ? 3 : (i >= 45 && i <= 56) ? 4 : (i >= 57 && i <= 65) ? 5 : 0;
const CARD16 = [13, 22, 35, 45, 57];
function hud16(t) {
  const i = lineIdx12(t), n = EXP16(i); if (!n || CARD16.includes(i)) return '';
  const l = TL.lines[i], lt = t - (l.t0 - 0.15), op = (CARD16.includes(i - 1) || EXP16(i - 1) !== n) ? prog(lt, 0, 0.4) : 1;
  let h = `<g transform="translate(1610 70) scale(.85)" opacity="${f1(op * 100) / 100}"><rect x="-340" y="-46" width="680" height="92" rx="46" fill="${NAVY}" opacity=".88" stroke="${RED16}" stroke-width="4"/>`;
  [1, 2, 3, 4, 5].forEach(j => { const on = j === n, past = j < n; h += `<circle cx="${-300 + (j - 1) * 44}" cy="0" r="17" fill="${on ? RED16 : past ? '#5A3A40' : 'none'}" stroke="${on ? INK : '#6B5560'}" stroke-width="3"/>` + T8(-300 + (j - 1) * 44, 8, String(j), { size: 20, fill: on ? '#fff' : '#C9B8C0' }); });
  h += T8(-70, 11, `${DAY16[n].slice(0, 1)} · ${EXPT16[n]}`, { anchor: 'start', size: EXPT16[n].length > 12 ? 24 : 30, fill: '#fff' });
  return h + '</g>';
}
render = function (t) { _render12(t); const h = hud16(t); if (h) document.getElementById('v').insertAdjacentHTML('beforeend', h); };
window.render = render;
