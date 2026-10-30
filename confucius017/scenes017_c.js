/* ---------- experiment 017: scene functions ---------- */
const DATEW17 = o => HALO(char(Object.assign({ goggles: 'none', vest: '#9FC5B8', patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', hair: '#2B2B2B', longHair: '#2B2B2B', lashes: true }, o)));
const ZS = (o) => ZK(Object.assign({ x: ZSEAT.x, y: ZSEAT.y, s: ZSEAT.s, pose: '앉기' }, o));
const icon17 = (kind) => ({
  game: `<rect x="-46" y="-28" width="92" height="56" rx="26" fill="#5A6B85" stroke="${INK}" stroke-width="5"/><circle cx="-20" cy="0" r="8" fill="#fff"/><circle cx="22" cy="-6" r="6" fill="${RED}"/><circle cx="32" cy="6" r="6" fill="${YEL}"/>`,
  stock: `<rect x="-46" y="-36" width="92" height="72" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M-34 20 L-12 -2 L6 10 L32 -24" fill="none" stroke="${RED}" stroke-width="6"/>`,
  car: `<rect x="-48" y="-14" width="96" height="30" rx="10" fill="#7FA8D6" stroke="${INK}" stroke-width="5"/><path d="M-30 -14 L-18 -32 L18 -32 L30 -14" fill="#BFE0F5" stroke="${INK}" stroke-width="5"/><circle cx="-26" cy="18" r="10" fill="${INK}"/><circle cx="26" cy="18" r="10" fill="${INK}"/>`,
  mountain: `<path d="M-60 34 L-10 -40 L14 -6 L28 -26 L64 34 Z" fill="#7BAA6A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-10 -40 L-22 -22 L2 -22 Z" fill="#fff"/>`,
  sea: `<rect x="-60" y="-36" width="120" height="72" rx="10" fill="#7DB7E0" stroke="${INK}" stroke-width="5"/><path d="M-50 10 q12 -10 24 0 q12 10 24 0 q12 -10 24 0 q12 10 24 0" fill="none" stroke="#fff" stroke-width="5"/><path d="M-30 -20 l6 12 m14 -14 l6 12" stroke="#5A7A9A" stroke-width="4"/>`,
  watch: `<circle r="34" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M0 0 L0 -22 M0 0 L16 8" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`
})[kind];

// 0-1 hook: the last blind date, Zero hugging the ball; the text that night
function cdateScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  if (k === 1) {
    let h = cafe17(t);
    h += DATEW17({ t, seed: 1701, x: PSEAT.x, y: PSEAT.y, s: PSEAT.s, pose: '앉기', ex: exprAt([[0, '지친']], t), look: [0.6, 0.7] });
    h += pop(t, T0 + 0.4, t + 99, PSEAT.x + 120, 560, icon17('watch'), { bob: 2 });
    const zo = { t, seed: 1702, x: ZSEAT.x, y: ZSEAT.y, s: ZSEAT.s, pose: '앉아안기', ex: exprAt([[0, '신남']], t), look: [0.6, -0.1] };
    h += ZB17 ? HALO(char(Object.assign({}, ZB17, zo))) : '';
    const [bx, by] = handAt(zo, 'hR'); h += ball17(bx - 30, by - 20, 30);
    ['game', 'stock', 'car'].forEach((ic, j) => h += pop(t, T0 + 0.2 + j * 0.5, t + 99, 470 + j * 150, 420 - (j % 2) * 60, icon17(ic), { bob: 3, rot: (j - 1) * 6 }));
    h += cafeTable17(t);
    h += pop(t, T0 + 0.1, t + 99, 330, 150, label(0, 0, '지난달 소개팅 · 40분째', { size: 40, bg: '#fff' }), { rot: -3 });
    h += pop(t, T0 + 0.3, t + 99, 680, 620, label(0, 0, '내 말 95%', { size: 32, bg: '#FFB0A0' }), { rot: 3 });
    return h;
  }
  let h = nightRoom12(t) + dim17(0.2);
  h += phone17(1150, 520, 0.95, [['오늘 감사했어요. 좋은 분 만나세요.', false, 0]], 1, '지난달 소개팅');
  h += HALO(char(Object.assign({}, ZB17, { t, seed: 1703, x: 560, y: 900, s: 0.56, pose: '폰보기', ex: exprAt([[0, '놀람']], t), look: [0.6, 0.2] })));
  return h;
}
// 2-3 the question; Confucius
function chookScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  if (k === 0) {
    let h = cafe17(t) + dim17(0.5);
    const zo = { t, seed: 1704, x: ZSEAT.x, y: ZSEAT.y, s: ZSEAT.s, pose: '앉아안기', ex: exprAt([[0, '서운함']], t), look: [0.7, 0.3] };
    h += HALO(char(Object.assign({}, ZB17, zo))); const [bx, by] = handAt(zo, 'hR'); h += ball17(bx - 30, by - 20, 30);
    h += cafeTable17(t);
    h += pop(t, T0 + 0.1, t + 99, 960, 300, big(0, 0, [[['말은 잘했는데,', '#fff']], [['왜 ', '#fff'], ['다시 안 만나 줄까', YEL], ['?', '#fff']]], { size: 86, sw: 16, lh: 114 }), { noPop: true, inDur: 0.45 });
    return h;
  }
  let h = ancient17(t);
  h += KZ({ t, seed: 1705, x: 960, y: 880, s: 0.64, pose: '서기', ex: exprAt([[0, '미소']], t), look: [0, 0] }) + bamboo17(960 + 84 * 0.64 + 10, 880 - 154 * 0.64, 0.64, 0);
  h += pop(t, T0 + at17(t, a, '공자', -0.1), t + 99, 960, 330, label(0, 0, '공자 · 기원전 6세기', { size: 44, bg: YEL }), { rot: -2 });
  const kk = at17(t, a, '그의 대화법', 0);
  h += pop(t, T0 + kk, t + 99, 960, 160, big(0, 0, [[['공자의 대화법', YEL], [' · 일주일 실험', '#fff']]], { size: 66, sw: 13 }), { noPop: true, inDur: 0.4 });
  return h;
}
// 4-5 Friday is booked; Zero's plan
function cweekScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  let h = nightRoom12(t, { wx: 1360 });
  if (k === 0) {
    h += phone17(1100, 520, 0.9, [['금요일 저녁 7시 소개팅 확정! 장소는 지난번 그 카페', false, 0]], 1, '주선자 친구');
    h += HALO(char(Object.assign({}, ZB17, { t, seed: 1706, x: 560, y: 900, s: 0.56, pose: '폰보기', ex: exprAt([[0, '신남']], t), look: [0.6, 0.2] })));
    h += pop(t, T0 + at17(t, a, '그 일주일', 0), t + 99, 560, 300, label(0, 0, '일주일 뒤, 그 한마디는?', { size: 40, bg: YEL }), { rot: -3, wobble: 1 });
    return h;
  }
  h += HALO(char(Object.assign({}, ZB17, { t, seed: 1707, x: 820, y: 900, s: 0.6, pose: '만세', ex: exprAt([[0, '신남']], t), look: [0, -0.4] })));
  h += pop(t, T0 + 0.3, t + 99, 1180, 560, card17(0, 0, 300, 200, T17(0, -20, '유머', { size: 40 }) + T17(0, 36, '모음집 2권', { size: 36, fill: RED }), { bg: '#FFE36E' }), { rot: 6, bob: 4 });
  return h;
}
// 6 the doctor: conversation is a game of catch — and Zero won't let go (he also gets the Confucius beard)
function cdocScene(t, lt, a) {
  const D = D17(a), T0 = t - lt;
  let h = labBg(t);
  h += doctor(480, 960, 0.6, { t, expr: '미소', talk: env(t), pose: lt < 0.35 * D ? 'point' : undefined });
  const zo = { t, seed: 1708, x: 1400, y: 890, s: 0.56, pose: lt > 0.5 * D ? '안기' : '서기', ex: exprAt([[0, '기본'], [0.5 * D, '신남']], lt), look: [-0.6, 0] };
  h += lt > 0.75 * D ? ZK(zo) : HALO(char(Object.assign({}, ZB17, zo)));
  const k = clamp((lt - 0.15 * D) / (0.3 * D), 0, 1), [hx, hy] = handAt(Object.assign({}, zo, { pose: '안기' }), 'hR');
  if (k < 1) { const [x, y] = arc17(620, 600, hx - 40, hy - 20, easeInOut(k), 220); h += ball17(x, y, 30); }
  else h += ball17(hx - 40, hy - 20, 30);
  if (lt > 0.55 * D) h += pop(t, T0 + 0.55 * D, t + 99, 1400, 360, label(0, 0, '안 놔요!', { size: 40, bg: '#FFB0A0' }), { rot: 4 });
  h += pop(t, T0 + 0.1, t + 99, 960, 200, label(0, 0, '대화 = 캐치볼', { size: 50, bg: MINT }), {});
  if (lt > 0.75 * D) h += pop(t, T0 + 0.75 * D, t + 99, 1640, 600, label(0, 0, '공자 수염 장착', { size: 30, bg: YEL }), { rot: -4 });
  return h;
}
// 7-9 Confucius: smooth talk is rarely kind; quiet in the village, clear at court
function ckongScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  if (k === 0) {
    let h = ancient17(t);
    h += OFF17({ t, seed: 1710, x: 1420, y: 880, s: 0.52, pose: '설명', ex: exprAt([[0, '비웃음']], t), look: [-0.5, 0] });
    for (let i = 0; i < 3; i++) h += pop(t, T0 + 0.5 + i * 0.3, t + 99, 1300 + i * 120, 420 - i * 40, `<path d="M0 -26 l7 18 l18 7 l-18 7 l-7 18 l-7 -18 l-18 -7 l18 -7 Z" fill="${YEL}" stroke="${INK}" stroke-width="3"/>`, { bob: 4 });
    h += KZ({ t, seed: 1711, x: 380, y: 880, s: 0.56, pose: '서기', ex: exprAt([[0, '생각']], t), look: [0.6, 0] });
    h += quote17(t, T0 + 0.2, 900, 300, ['말을 번지르르하게 하고 얼굴빛을 꾸미는 사람 중에,', '어진 이는 드물다.'], '『논어』 학이 · 巧言令色 鮮矣仁', { w: 1300, size: 44 });
    return h;
  }
  const L = ancient17(t) + VIL17({ t, seed: 1712, x: 240, y: 880, s: 0.46, pose: '설명', ex: exprAt([[0, '신남']], t), look: [0.6, 0] }, '#C9A27A') + VIL17({ t, seed: 1713, x: 700, y: 880, s: 0.46, pose: '손인사', ex: exprAt([[0, '신남']], t), look: [-0.6, 0] }, '#A8B8A0')
    + KZ({ t, seed: 1714, x: 470, y: 880, s: 0.5, pose: '서기', ex: exprAt([[0, '미소']], t), look: [0, 0.3] }) + label(470, 300, '고향 마을: 말 못 하는 사람처럼', { size: 30, bg: '#fff' });
  const R = court17(t) + OFF17({ t, seed: 1715, x: 1700, y: 880, s: 0.46, pose: '서기', ex: exprAt([[0, '기본']], t), look: [-0.6, 0] }) + OFF17({ t, seed: 1716, x: 1500, y: 880, s: 0.46, pose: '서기', ex: exprAt([[0, '놀람']], t), look: [-0.6, 0] })
    + KZ({ t, seed: 1717, x: 1180, y: 880, s: 0.5, pose: '설명', ex: exprAt([[0, '기본']], t), look: [0.6, 0] }) + label(1440, 300, '조정: 또렷하게, 신중하게', { size: 30, bg: YEL });
  let h = BG('#EFE2C4');
  const r = k === 1 ? prog(lt, 0.5 * D, D) * 0 : 1; // court half appears on k2
  h += k === 1 ? `<g clip-path="url(#leftHalf)">${L}</g><g clip-path="url(#rightHalf)">${dim17(1, '#2A1E1E')}${pop(t, T0 + 0.6 * D, t + 99, 1440, 560, T17(0, 0, '?', { size: 120, fill: '#5A3A3A' }), {})}</g>` : `<g clip-path="url(#leftHalf)">${L}${dim17(0.25)}</g><g clip-path="url(#rightHalf)">${R}</g>`;
  h += `<line x1="960" y1="-600" x2="960" y2="1680" stroke="${INK}" stroke-width="12"/>`;
  if (k === 2) h += pop(t, T0 + at17(t, a, '때와 사람', -0.2), t + 99, 960, 160, label(0, 0, '말하지 말라 ✗  →  때와 사람을 보라 ✓', { size: 40, bg: MINT }), {});
  return h;
}
// 10-12 experiment 1: measure my talk time
function cmonScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  if (k === 0) return expCard17(t, lt, a, 1, icon17('watch').replace('r="34"', 'r="54"'));
  let h = lunch17(t);
  h += HR({ t, seed: 1721, x: LH17.x, y: LH17.y, s: LH17.s, pose: '앉기', ex: exprAt([[0, k === 2 ? '서운함' : '기본']], t), look: [-0.7, 0] });
  const zo = { t, seed: 1722, x: LZ17.x, y: LZ17.y, s: LZ17.s, pose: k === 1 && lt < 0.4 * D ? '앉아설명' : '앉아폰', ex: exprAt(k === 1 ? [[0, '신남'], [at17(t, a, '결과는', 0), '놀람']] : [[0, '놀람']], lt), look: k === 1 && lt < 0.4 * D ? [0.7, 0] : [0.1, 0.7] };
  h += ZK(zo) + lunchBowls17();
  h += `<g transform="translate(960 706)"><rect x="-26" y="-14" width="52" height="28" rx="8" fill="#1F2D44" stroke="${INK}" stroke-width="4"/><circle cx="-8" cy="0" r="6" fill="${RED}" opacity="${f1((0.5 + 0.5 * Math.sin(t * 6)) * 100) / 100}"/></g>`;
  if (k === 1) { const sk = prog(lt, at17(t, a, '82', -0.6), at17(t, a, '82', 0.4)); if (sk > 0) {
      const ang = 2 * Math.PI * 0.82 * easeOut(sk), x1 = 960 + 120 * Math.sin(ang), y1 = 330 - 120 * Math.cos(ang);
      h += `<g transform="translate(-320 0)"><circle cx="960" cy="330" r="120" fill="#BFE3C7" stroke="${INK}" stroke-width="6"/><path d="M960 330 L960 210 A120 120 0 ${ang > Math.PI ? 1 : 0} 1 ${f1(x1)} ${f1(y1)} Z" fill="#FF8A7A" stroke="${INK}" stroke-width="5"/></g>` + label(640, 500, '제로 82% · 나머지 18%', { size: 32, bg: '#fff' }); } }
  else h += pop(t, T0 + 0.2, t + 99, 1280, 600, `<g opacity=".85">${label(0, 0, '(하린의 목소리 3분)', { size: 28, bg: '#fff' })}</g>`, {});
  return h;
}
// 13-15 Tamir & Mitchell: people give up money to talk about themselves
function cselfScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  let h = labBg(t);
  const coin = (x, y, v) => `<g transform="translate(${x} ${y})"><circle r="34" fill="#F2C14E" stroke="${INK}" stroke-width="5"/>` + T17(0, 11, v, { size: 26, fill: '#7A5A10' }) + '</g>';
  if (k === 0) {
    h += pop(t, T0 + 0.2, t + 99, 620, 420, card17(0, 0, 440, 220, T17(0, -20, '나에 대한 질문', { size: 40 }) + T17(0, 40, '"나는 스키를 좋아한다?"', { size: 28, fill: '#6B6255', w: 700 }), { bg: '#FFF7D6' }), { rot: -2 });
    h += pop(t, T0 + 0.5, t + 99, 1300, 420, card17(0, 0, 440, 220, T17(0, -20, '남에 대한 질문', { size: 40 }) + T17(0, 40, '"대통령은 스키를 좋아할까?"', { size: 28, fill: '#6B6255', w: 700 }), { bg: '#EAF4FF' }), { rot: 2 });
    h += pop(t, T0 + at17(t, a, '받는 돈', 0), t + 99, 620, 640, coin(-40, 0, '1¢') + coin(40, 0, '2¢'), {}) + pop(t, T0 + at17(t, a, '받는 돈', 0.2), t + 99, 1300, 640, coin(-40, 0, '3¢') + coin(40, 0, '4¢'), {});
    return h;
  }
  if (k === 1) {
    h += pop(t, T0 + 0.2, t + 99, 960, 330, big(0, 0, [[['17%', YEL], [' 포기', '#fff']]], { size: 130, sw: 22 }), {});
    for (let i = 0; i < 6; i++) h += pop(t, T0 + 0.6 + i * 0.12, t + 99, 640 + i * 128, 620, coin(0, 0, '¢'), {});
    h += pop(t, T0 + at17(t, a, '동전 몇', 0), t + 99, 960, 780, label(0, 0, '동전 몇 닢이었지만, 자기 얘기를 골랐다', { size: 36, bg: '#fff' }), {});
    return h;
  }
  const zo = { t, seed: 1723, x: 960, y: 890, s: 0.56, pose: '안기', ex: exprAt([[0, '신남']], t), look: [0, -0.2] };
  h += HALO(char(Object.assign({}, ZB17, zo))); const [bx, by] = handAt(zo, 'hR'); h += ball17(bx - 40, by - 20, 32, 0.7);
  h += P14(560, 890, 0.46, '#7FA8D6', { t, seed: 1724, pose: '내밀기', ex: exprAt([[0, '서운함']], t), look: [0.7, 0] }) + flip(1360, P14(1360, 890, 0.46, '#C7737E', { t, seed: 1725, pose: '내밀기', ex: exprAt([[0, '서운함']], t), look: [0.7, 0] }));
  h += pop(t, T0 + 0.2, t + 99, 960, 200, label(0, 0, '자기 얘기 = 뇌가 느끼는 보상', { size: 42, bg: YEL }), {});
  return h;
}
// 16-18 "worry that you do not know others"; the awkward pauses
function cpauseScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  if (k === 0) {
    let h = ancient17(t) + KZ({ t, seed: 1726, x: 330, y: 880, s: 0.54, pose: '설명', ex: exprAt([[0, '미소']], t), look: [0.6, -0.2] });
    h += quote17(t, T0 + 0.1, 1060, 330, ['남이 나를 알아주지 않는 걸 걱정하지 말고,', '내가 남을 알지 못하는 걸 걱정하라.'], '『논어』 학이 · 不患人之不己知 患不知人也', { w: 1180, size: 46 });
    return h;
  }
  let h = lunch17(t);
  h += HR({ t, seed: 1721, x: LH17.x, y: LH17.y, s: LH17.s, pose: '앉기', ex: exprAt([[0, k === 1 ? '미소' : '걱정']], t), look: [-0.7, 0] });
  h += ZK({ t, seed: 1722, x: LZ17.x, y: LZ17.y, s: LZ17.s, pose: k === 1 ? '입막기' : '앉기', ex: exprAt([[0, k === 1 ? '생각' : '걱정']], t), look: [0.5, 0], sweat: k === 2 }) + lunchBowls17();
  for (let i = 0; i < 3; i++) h += pop(t, T0 + 0.4 + i * 0.5, t + 99, 820 + i * 140, 420, T17(0, 0, '…', { size: 80, fill: '#9AA6B2' }), { bob: 3 });
  if (k === 2) h += pop(t, T0 + 0.3, t + 99, 960, 230, label(0, 0, '(어색한 정적)', { size: 40, bg: '#fff' }), { rot: -2 });
  return h;
}
// 19-24 experiment 2: throw the ball back (follow-up question)
function ctueScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  if (k === 0) return expCard17(t, lt, a, 2, `<g>${ball17(-70, 0, 40)}<path d="M-20 -40 Q40 -90 90 -20 M74 -36 L90 -20 L70 -12" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/></g>`);
  let h = office17(t);
  const zo = { t, seed: 1730, x: 700, y: 890, s: 0.58 }, ho = { t, seed: 1731, x: 1220, y: 890, s: 0.58 };
  const [zx, zy] = [700 + 70, 890 - 240 * 0.58], [hx, hy] = [1220 - 70, 890 - 240 * 0.58];
  let ballXY = null, zEx = '기본', hEx = '기본', zPose = '서기', hPose = '서기', grey = false;
  if (k === 1) { const s1 = seg17(t, lt, 1); hPose = lt > s1 ? '설명' : '서기'; hEx = '신남'; ballXY = lt < s1 ? [hx, hy] : arc17(hx, hy, zx, zy, easeInOut(prog(lt, s1 + 0.3, s1 + 1.1)), 140);
    if (lt > s1) h += pop(t, T0 + s1 + 0.2, t + 99, 1220, 330, icon17('mountain'), { bob: 3 }); }
  if (k === 2) { grey = true; ballXY = [zx, zy]; zPose = '안기'; hEx = '서운함'; if (lt > seg17(t, lt, 1)) h += pop(t, T0 + seg17(t, lt, 1), t + 99, 700, 340, icon17('game'), { bob: 3 }); }
  if (k === 3) { const s1 = seg17(t, lt, 1); zPose = lt > s1 ? '던지기' : '서기'; zEx = '미소'; ballXY = arc17(zx, zy, hx, hy, easeInOut(prog(lt, s1, s1 + 0.9)), 170); }
  if (k === 4) { hEx = '신남'; hPose = '폰보기'; ballXY = [hx - 10, hy - 40]; h += pop(t, T0 + 0.6, t + 99, 1460, 420, card17(0, 0, 260, 200, icon17('mountain') + T17(0, 76, '백운대!', { size: 30 }), { bg: '#EAF4FF' }), { rot: 4 }); zEx = '신남'; }
  if (k === 5) { zEx = '미소'; hEx = '신남'; const ph = (lt * 0.55) % 1, dir = Math.floor(lt * 0.55) % 2; ballXY = dir ? arc17(hx, hy, zx, zy, easeInOut(ph), 160) : arc17(zx, zy, hx, hy, easeInOut(ph), 160); }
  h += (grey ? HALO(char(Object.assign({}, ZB17, zo, { pose: zPose, ex: exprAt([[0, zEx]], t), look: [0.6, 0] }))) : ZK(Object.assign({}, zo, { pose: zPose, ex: exprAt([[0, zEx]], t), look: [0.6, 0] }))) + HR(Object.assign({}, ho, { pose: hPose, ex: exprAt([[0, hEx]], t), look: [-0.6, 0] }));
  if (ballXY) h += ball17(ballXY[0], ballXY[1], 28, k === 5 ? 0.5 : 0);
  if (grey) h = `<g style="filter: grayscale(.85)">${h}</g>` + label(330, 150, '예전의 제로', { size: 40, bg: '#C9C9C9' });
  if (k === 5) h += pop(t, T0 + 0.3, t + 99, 960, 200, label(0, 0, '공이 오고 간다', { size: 46, bg: MINT }), {});
  return h;
}
// 25-28 Huang et al. 2017
function caskScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  let h = labBg(t);
  if (k === 0) {
    const chat = (x, q, c, ap, qs) => pop(t, T0 + ap, t + 99, x, 470, card17(0, 0, 520, 380, `<rect x="-230" y="-160" width="460" height="56" rx="12" fill="${c}"/>` + T17(0, -120, q, { size: 34 }) + [0, 1, 2, 3].map(i => `<rect x="${i % 2 ? -40 : -210}" y="${-80 + i * 56}" width="250" height="40" rx="18" fill="${i % 2 ? '#FFE36E' : '#fff'}" stroke="${INK}" stroke-width="3"/>` + (qs[i] ? T17(i % 2 ? 85 : -85, -50 + i * 56, '?', { size: 32, fill: RED }) : '')).join(''), { bg: '#EAF2F8' }), {});
    h += chat(560, '질문 9개 이상', MINT, 0.3, [1, 1, 1, 1]) + chat(1360, '질문 4개 이하', '#C3CDD8', 0.6, [0, 0, 1, 0]);
    h += pop(t, T0 + 0.1, t + 99, 960, 180, label(0, 0, '낯선 두 사람 · 15분 채팅', { size: 40, bg: '#fff' }), {});
    return h;
  }
  if (k === 1) {
    const bars = [['질문 많이', 5.79, MINT], ['질문 적게', 5.31, '#8C98A4']];
    h += `<line x1="560" y1="800" x2="1360" y2="800" stroke="#fff" stroke-width="6"/>`;
    bars.forEach(([nm, v, c], j) => { const x = 760 + j * 400, kk = easeOut(prog(lt, 0.2 + j * 0.3, 1.0 + j * 0.3)), hh = v / 7 * 460 * kk;
      h += `<rect x="${x - 90}" y="${f1(800 - hh)}" width="180" height="${f1(hh)}" rx="12" fill="${c}" stroke="${INK}" stroke-width="6"/>` + T17(x, 860, nm, { size: 36, fill: '#fff' }) + (kk > 0.9 ? T17(x, 780 - hh, v.toFixed(2), { size: 40, fill: '#fff' }) : ''); });
    h += pop(t, T0 + 0.2, t + 99, 960, 190, label(0, 0, '상대가 느낀 호감 (7점 만점)', { size: 36, bg: '#fff' }), {});
    h += pop(t, T0 + at17(t, a, '이어서', 0), t + 99, 1500, 360, label(0, 0, '특히 이어서 묻는 질문!', { size: 34, bg: YEL }), { rot: 4 });
    return h;
  }
  if (k === 2) {
    for (let j = 0; j < 3; j++) { const x = 480 + j * 480; h += chair12(x - 110, 880, 0.36) + flip(x + 110, chair12(x + 110, 880, 0.36)) + `<rect x="${x - 10}" y="790" width="20" height="90" fill="#6A4428" stroke="${INK}" stroke-width="4"/><rect x="${x - 90}" y="780" width="180" height="18" rx="7" fill="#8A5A34" stroke="${INK}" stroke-width="5"/>` + P14(x - 110, 880, 0.36, '#7FA8D6', { t, seed: 1740 + j, pose: '앉기', ex: exprAt([[0, '미소']], t), look: [0.6, 0] }) + flip(x + 110, P14(x + 110, 880, 0.36, '#F2B9A2', { t, seed: 1750 + j, pose: '앉기', ex: exprAt([[0, j === 1 ? '신남' : '기본']], t), look: [0.6, 0] }));
      if (j === 1) h += pop(t, T0 + 0.8, t + 99, x, 470, `<path d="M0 20 c-30 -36 -70 -6 -36 26 l36 32 l36 -32 c34 -32 -6 -62 -36 -26 Z" fill="${PINK}" stroke="${INK}" stroke-width="5"/>`, { bob: 4 }); }
    h += pop(t, T0 + 0.2, t + 99, 960, 200, label(0, 0, '스피드 데이트 110명 · 4분씩', { size: 40, bg: '#fff' }), {});
    h += pop(t, T0 + at17(t, a, '경향', 0), t + 99, 1500, 340, label(0, 0, '경향 (상관관계)', { size: 30, bg: '#C3CDD8' }), { rot: 3 });
    return h;
  }
  h += doctor(480, 960, 0.6, { t, expr: '미소', talk: env(t), pose: 'point' });
  h += ZK({ t, seed: 1752, x: 1420, y: 890, s: 0.54, pose: '서기', ex: exprAt([[0, '생각']], t), look: [-0.7, -0.2] });
  h += pop(t, T0 + 0.3, t + 99, 960, 220, label(0, 0, '이어서 묻기 = 잘 들었다는 증거', { size: 44, bg: MINT }), {});
  return h;
}
// 29-33 experiment 3: question barrage, then the boomerang
function cwedScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  if (k === 0) return expCard17(t, lt, a, 3, `<g>${[0, 1, 2, 3, 4].map(i => ball17(-120 + i * 60, (i % 2) * 30 - 15, 26)).join('')}</g>`);
  if (k <= 2) {
    let h = meeting17(t);
    h += TL17({ t, seed: 1760, x: 1380, y: 890, s: 0.6, pose: k === 1 ? '가드' : '팔짱', ex: exprAt([[0, k === 1 ? '놀람' : '찡그림']], t), look: [-0.7, 0], shiver: k === 1 });
    h += ZK({ t, seed: 1761, x: 660, y: 890, s: 0.58, pose: k === 1 ? '던지기' : '서기', ex: exprAt([[0, k === 1 ? '신남' : '미안']], t), look: [0.7, 0], shiver: k === 1 });
    if (k === 1) for (let i = 0; i < 6; i++) { const ph = ((lt * 1.6) + i / 6) % 1, [x, y] = arc17(770, 700, 1300, 720 + (i % 3 - 1) * 50, ph, 80); h += ball17(x, y, 22); }
    else for (let i = 0; i < 6; i++) h += ball17(1180 + i * 70, 860 - (i % 2) * 18, 22);
    if (k === 1) ['취미는요?', '고향은요?', '혈액형은요?'].forEach((q, j) => h += pop(t, T0 + 0.6 + j * 0.6, t + 99, 760 + j * 200, 420 + (j % 2) * 50, label(0, 0, q, { size: 30, bg: '#fff' }), { rot: (j - 1) * 6 }));
    return h;
  }
  let h = lunch17(t);
  const s1 = seg17(t, lt, 1), s2 = seg17(t, lt, 2), s3 = seg17(t, lt, 3);
  const [zx, zy] = ballL17(Object.assign({ pose: '앉기' }, LZ17)), [hx, hy] = ballR17(Object.assign({ pose: '앉기' }, LH17));
  let bxy;
  if (k === 3) { if (lt < s1 + 0.3) bxy = [zx, zy]; else if (lt < s3) bxy = arc17(zx, zy, hx, hy, easeInOut(prog(lt, s1 + 0.3, s1 + 1.0)), 150); else bxy = arc17(hx, hy, zx, zy, easeIn(prog(lt, s3, s3 + 0.35)), 60); }
  else bxy = [zx - 20, zy + 10];
  const zPose = k === 3 ? (lt > s3 ? '앉아안기' : (lt > s1 ? '앉아던지기' : '앉기')) : '앉아안기';
  h += ZK({ t, seed: 1722, x: LZ17.x, y: LZ17.y, s: LZ17.s, pose: zPose, ex: exprAt([[0, k === 4 ? '신남' : '미소']], t), look: [0.6, 0] });
  h += HR({ t, seed: 1721, x: LH17.x, y: LH17.y, s: LH17.s, pose: k === 3 && lt > s2 && lt < s3 ? '앉아설명' : '앉기', ex: exprAt(k === 3 ? [[0, '기본'], [s2, '미소'], [s3 + 0.2, '놀람']] : [[0, '서운함']], lt), look: [-0.7, 0] });
  h += ball17(bxy[0], bxy[1], 26);
  if (k === 3 && lt > s3) h += pop(t, T0 + s3, t + 99, 640, 540, label(0, 0, '저는요!', { size: 44, bg: '#FFB0A0' }), { rot: -5, wobble: 2 });
  if (k === 4) h += pop(t, T0 + at17(t, a, '던지는 척', 0), t + 99, 960, 200, label(0, 0, '던지는 척, 다시 낚아채기', { size: 44, bg: YEL }), {});
  return h;
}
// 34-35 boomerasking (Yeomans & Brooks 2025)
function cboomScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  let h = labBg(t);
  if (k === 0) {
    const steps = [['① 묻는다', '주말에 뭐 했어요?', 480], ['② 상대가 답한다', '이사 도왔어요', 960], ['③ 내 얘기로!', '저는요, 캠핑!', 1440]];
    steps.forEach(([s1, s2, x], j) => h += pop(t, T0 + 0.3 + j * 0.6, t + 99, x, 460, card17(0, 0, 400, 200, T17(0, -24, s1, { size: 36, fill: j === 2 ? RED : NAVY }) + T17(0, 40, s2, { size: 30, fill: '#6B6255', w: 700 }), { bg: j === 2 ? '#FFE3DC' : '#fff' }), {}));
    const kk = prog(lt, 2.2, 3.2);
    if (kk > 0) h += `<path d="M1440 590 Q960 ${f1(760 + 40 * kk)} 480 590" fill="none" stroke="${YEL}" stroke-width="10" stroke-dasharray="${f1(1100 * kk)} 2000" stroke-linecap="round"/>`;
    h += pop(t, T0 + 0.1, t + 99, 960, 290, label(0, 0, '부메랑 질문 (boomerasking)', { size: 42, bg: YEL }), {});
    return h;
  }
  h += `<line x1="960" y1="300" x2="960" y2="840" stroke="#fff" stroke-width="5" stroke-dasharray="16 14" opacity=".5"/>`;
  h += P14(560, 860, 0.5, '#FF9A55', { t, seed: 1770, pose: '손인사', ex: exprAt([[0, '신남']], t), look: [0.5, 0] }) + pop(t, T0 + 0.2, t + 99, 560, 360, label(0, 0, '묻는 사람: "인상 좋았겠지?"', { size: 32, bg: '#fff' }), {});
  h += P14(1360, 860, 0.5, '#7FA8D6', { t, seed: 1771, pose: '팔짱', ex: exprAt([[0, '찡그림']], t), look: [-0.5, 0] }) + pop(t, T0 + at17(t, a, '듣는 사람', 0), t + 99, 1360, 360, label(0, 0, '듣는 사람: "자기중심적·진심 없음"', { size: 30, bg: '#FFB0A0' }), {});
  h += pop(t, T0 + at17(t, a, '차라리', 0), t + 99, 960, 220, label(0, 0, '차라리 그냥 자기 얘기 > 부메랑', { size: 38, bg: YEL }), {});
  return h;
}
// 36-38 the three faults (季氏 16.6); Zero's tally
function csanScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  if (k <= 1) {
    let h = ancient17(t) + KZ({ t, seed: 1780, x: 300, y: 880, s: 0.52, pose: '설명', ex: exprAt([[0, '기본']], t), look: [0.6, -0.2] });
    const cards = [['조급함 躁', '말할 때가 아닌데 말하면', at17(t, a, '말할 때가 아닌데', 0)], ['숨김 隱', '말해야 할 때 안 하면', at17(t, a, '말해야 할', 0)], ['눈먼 것 瞽', '얼굴빛을 보지 않고 말하면', 0.2]];
    cards.forEach(([t1, t2, ap], j) => { if (k === 0 && j === 2) return;
      const hi = j === 2;
      h += k === 1 && j < 2 ? `<g transform="translate(${720 + j * 380} 420) scale(.8)" opacity=".6">${card17(0, 0, 340, 230, T17(0, -20, t1, { size: 44 }) + T17(0, 44, t2, { size: 24, fill: '#6B6255', w: 700 }), {})}</g>`
        : pop(t, T0 + Math.max(0.1, ap), t + 99, hi ? 1520 : 720 + j * 380, hi ? 460 : 420, card17(0, 0, hi ? 420 : 340, hi ? 280 : 230, T17(0, -24, t1, { size: hi ? 56 : 44, fill: hi ? RED : NAVY }) + T17(0, 50, t2, { size: hi ? 28 : 24, fill: '#6B6255', w: 700 }) + (hi ? `<path d="M-60 -110 q60 -40 120 0" stroke="${INK}" stroke-width="6" fill="none"/>` : ''), { bg: hi ? '#FFF2C0' : '#fff' }), { rot: hi ? 3 : 0 }); });
    if (k === 0) h += pop(t, T0 + 0.1, t + 99, 900, 230, label(0, 0, '윗사람 앞에서 말할 때의 세 가지 실수 · 『논어』 계씨', { size: 30, bg: '#fff' }), {});
    return h;
  }
  let h = office17(t, { night: true }) + dim17(0.15);
  h += ZK({ t, seed: 1781, x: 820, y: 900, s: 0.58, pose: '서기', ex: exprAt([[0, '울먹']], t), look: [0.2, 0.5] });
  h += pop(t, T0 + 0.2, t + 99, 1300, 460, card17(0, 0, 380, 280, T17(0, -60, '오늘 한 질문', { size: 34 }) + T17(0, 20, '47개', { size: 80, fill: RED }) + T17(0, 100, '본 얼굴: 0', { size: 32, fill: '#6B6255' }), { bg: '#fff' }), { rot: 3 });
  return h;
}
// 39-43 that night: the photo, grandma's wooden platform
function cgrandScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  if (k === 0 || k === 4) {
    let h = nightRoom12(t) + dim17(0.15);
    const zo = { t, seed: 1790, x: 820, y: 880, s: 0.58, pose: '앉아내밀기', ex: exprAt([[0, k === 4 ? '울먹' : '생각']], t), look: [0.6, 0.2] }, [px, py] = handAt(zo, 'hR');
    h += chair12(820, 880, 0.58) + HALO(char(Object.assign({}, ZB17, zo)));
    h += `<g transform="translate(${f1(px + 40)} ${f1(py - 50)}) rotate(-6) scale(.7)"><rect x="-120" y="-90" width="240" height="180" rx="6" fill="#F4E6C8" stroke="${INK}" stroke-width="6"/><rect x="-104" y="-74" width="208" height="130" fill="#B79A6A"/><rect x="-80" y="0" width="160" height="16" fill="#8A6A3A"/><circle cx="-30" cy="-20" r="16" fill="#E8D9B8"/><circle cx="34" cy="-26" r="18" fill="#D9C9A8"/></g>`;
    if (k === 4) h += `<ellipse cx="820" cy="560" rx="380" ry="300" fill="url(#warm)" opacity="${f1(0.7 * prog(lt, 0.3, 2) * 100) / 100}"/>`;
    if (k === 0) h += pop(t, T0 + at17(t, a, '평상', -0.2), t + 99, 1100, 440, label(0, 0, '할머니 댁 평상', { size: 34, bg: '#F4E6C8' }), { rot: -3 });
    return h;
  }
  let h = porch17(t);
  const kid = { t, seed: 1791, x: 760, y: 817, s: 0.4, pose: k === 2 ? '앉아받기' : '앉아설명', ex: exprAt([[0, '신남']], t), look: [0.6, -0.1] };
  h += HALO(char(Object.assign({}, ZB17, kid)));
  const gmo = { t, seed: 1792, x: 1060, y: 822, s: 0.46, pose: k === 2 ? '앉아던지기' : '앉기', ex: exprAt([[0, '미소']], t), look: [-0.6, 0] };
  h += GM(gmo);
  const [kbx, kby] = ballL17(Object.assign({}, kid, { pose: '앉기' })), [gbx, gby] = ballR17(Object.assign({}, gmo, { pose: '앉기' }));
  if (k === 2) { const [x, y] = arc17(gbx, gby, kbx, kby, easeInOut(prog(lt, 0.4, 1.2)), 110); h += ball17(x, y, 22, 0.6); }
  else h += ball17(kbx, kby, 22, 0.4);
  h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#C9A06A" opacity=".18"/>`;
  h += label(330, 150, '어린 시절', { size: 36, bg: '#F4E6C8' });
  return h;
}
// 44 rewriting experiment 3's title
function cruleScene(t, lt, a) {
  const D = D17(a), T0 = t - lt;
  let h = nightRoom12(t) + `<rect x="760" y="700" width="560" height="30" rx="8" fill="#5A3E2C" stroke="${INK}" stroke-width="6"/><rect x="790" y="730" width="22" height="150" fill="#4A3020"/><rect x="1268" y="730" width="22" height="150" fill="#4A3020"/>`;
  const x = prog(lt, 0.4, 1.2);
  h += `<line x1="1040" y1="300" x2="1040" y2="330" stroke="${INK}" stroke-width="4"/>` + card17(1040, 450, 640, 300, `<circle cx="0" cy="-136" r="12" fill="${RED}" stroke="${INK}" stroke-width="4"/>` + T17(0, -60, '실험 3', { size: 36, fill: '#9A6A1E' }) + T17(0, 10, '질문을, 더 많이!', { size: 56 }) + (x > 0 ? `<line x1="-230" y1="-6" x2="${f1(-230 + 460 * x)}" y2="-6" stroke="${RED}" stroke-width="10" stroke-linecap="round"/>` : '') +
    (lt > at17(t, a, '얼굴을', 0) ? T17(0, 96, '얼굴 보고, 궁금한 것 하나', { size: 44, fill: '#2E9E5B' }) : ''), { bg: '#FFF7EC' });
  h += ZK({ t, seed: 1795, x: 560, y: 900, s: 0.56, pose: '설명', ex: exprAt([[0, '결심']], t), look: [0.7, -0.2] });
  return h;
}
// 45-49 experiment 4: action before words; Zai Yu's nap
function cthuScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  if (k === 0) return expCard17(t, lt, a, 4, `<g transform="scale(1.2)"><rect x="-70" y="-50" width="140" height="100" rx="8" fill="#EAF4E0" stroke="${INK}" stroke-width="6"/><path d="M-50 30 L-10 -24 L10 4 L30 -14 L56 30" fill="none" stroke="#2E7A4A" stroke-width="6"/><path d="M-50 -30 q30 20 60 0 q20 -14 50 4" fill="none" stroke="${RED}" stroke-width="4" stroke-dasharray="8 6"/></g>`);
  if (k === 4) {
    let h = ancient17(t) + KZ({ t, seed: 1800, x: 330, y: 880, s: 0.54, pose: '서기', ex: exprAt([[0, '미소']], t), look: [0.6, -0.2] });
    h += quote17(t, T0 + 0.1, 1060, 330, ['군자는 말은 어눌하게,', '행동은 민첩하게 하려 한다.'], '『논어』 이인 · 君子欲訥於言而敏於行', { w: 1000, size: 50 });
    return h;
  }
  let h = ancient17(t, { dusk: k >= 2 });
  h += `<rect x="1180" y="560" width="40" height="320" fill="#7A5235" stroke="${INK}" stroke-width="6"/><circle cx="1200" cy="520" r="150" fill="#6FA86A" stroke="${INK}" stroke-width="7"/>`;
  const awake = k === 1 && lt < at17(t, a, '그런데', -0.1);  // first the eloquent disciple talking, then the nap
  if (awake) {
    h += JY({ t, seed: 1801, x: 1000, y: 880, s: 0.5, pose: '설명', ex: exprAt([[0, '신남']], t), look: [0.5, -0.1] });
    for (let i = 0; i < 3; i++) h += pop(t, T0 + 0.3 + i * 0.35, t + 99, 1150 + i * 70, 520 - i * 50, `<path d="M0 -20 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 l14 -6 Z" fill="${YEL}" stroke="${INK}" stroke-width="3"/>`, { bob: 3 });
    return h + pop(t, T0 + 0.3, t + 99, 1260, 300, label(0, 0, '말솜씨 1등 제자, 재여', { size: 36, bg: '#fff' }), { rot: 3 });
  }
  h += JY({ t, seed: 1801, x: 1290, y: 846, s: 0.42, rot: 90, ex: { expr: '잠', prev: '잠', k: 1, blink: 0 }, noBlink: true });
  for (let i = 0; i < 3; i++) { const q = ((t * 0.5 + i / 3) % 1); h += `<text x="${f1(1400 + q * 100 + i * 10)}" y="${f1(700 - q * 180)}" font-family="${FONT}" font-weight="900" font-size="${f1(36 + q * 30)}" fill="#fff" stroke="${INK}" stroke-width="4" paint-order="stroke fill" opacity="${f1(Math.sin(q * Math.PI) * 100) / 100}">Z</text>`; }
  if (k === 1) h += pop(t, T0 + 0.3, t + 99, 1260, 300, label(0, 0, '말솜씨 1등 제자, 재여', { size: 36, bg: '#fff' }), { rot: 3 });
  if (k >= 2) {
    h += KZ({ t, seed: 1802, x: 620, y: 880, s: 0.56, pose: k === 2 ? '가리키기' : '설명', ex: exprAt([[0, k === 2 ? '화남' : '생각']], t), look: [0.7, 0.3] });
    if (k === 2) h += pop(t, T0 + 0.4, t + 99, 900, 850, `<g transform="rotate(-3)"><rect x="-110" y="-26" width="220" height="52" rx="22" fill="#8A6A44" stroke="${INK}" stroke-width="6"/><circle cx="-40" cy="0" r="10" fill="#5A3E28"/><circle cx="30" cy="6" r="7" fill="#5A3E28"/><path d="M60 -26 l10 -20 m-60 20 l-6 -18" stroke="#6E8A3A" stroke-width="5"/></g>` + T17(0, -50, '썩은 나무', { size: 28, fill: '#5A3E28' }), {});
    if (k === 3) { const kk = prog(lt, at17(t, a, '이제는', 0), at17(t, a, '이제는', 0.5));
      h += pop(t, T0 + 0.2, t + 99, 960, 200, label(0, 0, '말을 듣고 → 행동을 믿었다', { size: 36, bg: '#fff' }), {});
      if (kk > 0) h += `<line x1="760" y1="200" x2="${f1(lerp(760, 1160, kk))}" y2="200" stroke="${RED}" stroke-width="8"/>` + pop(t, T0 + at17(t, a, '이제는', 0.3), t + 99, 960, 290, label(0, 0, '말을 듣고 → 행동을 살핀다', { size: 40, bg: YEL }), {}); }
  }
  return h;
}
// 50-53 the hiking map on 하린's desk; responsiveness
function cmapScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  if (k <= 1) {
    let h = office17(t) + desk12(1180, 760, t, 0) + `<rect x="1290" y="630" width="160" height="100" rx="8" fill="#2A3442" stroke="${INK}" stroke-width="6"/><rect x="1362" y="730" width="16" height="30" fill="#5A6470"/><path d="M1160 760 L1166 726 L1196 726 L1202 760 Z" fill="#7FC8A9" stroke="${INK}" stroke-width="5"/>` + T17(1370, 700, '하린', { size: 26, fill: '#9FD8B8' });
    const map = `<g transform="translate(980 748) rotate(-4)"><rect x="-90" y="-26" width="180" height="40" rx="4" fill="#EAF4E0" stroke="${INK}" stroke-width="5"/><path d="M-70 6 L-30 -16 L-6 0 L20 -14 L70 6" fill="none" stroke="#2E7A4A" stroke-width="4"/></g>`;
    if (k === 0) {
      const put = prog(lt, 0.3 * D, 0.6 * D);
      h += ZK({ t, seed: 1810, x: lerp(700, 820, put < 1 ? put : 1 - prog(lt, 0.75 * D, D)), y: 890, s: 0.56, pose: put > 0.2 && put < 1 ? '내밀기' : '서기', ex: exprAt([[0, '미소']], t), look: [0.7, 0.3] });
      if (put >= 1) h += map + pop(t, T0 + at17(t, a, '도봉산', -0.3), t + 99, 980, 620, label(0, 0, '도봉산 등산로', { size: 32, bg: '#EAF4E0' }), {});
      return h;
    }
    const ho = { t, seed: 1811, x: 1600, y: 890, s: 0.58, pose: '내밀기', ex: exprAt([[0, '놀람'], [0.6, '신남']], lt), look: [0.4, -0.2] }, [mx, my] = handAt(ho, 'hR');
    h += flip(1600, HR(ho)) + map.replace('translate(980 748) rotate(-4)', `translate(${f1(3200 - mx)} ${f1(my - 10)}) rotate(8)`);
    h += ZK({ t, seed: 1812, x: 700, y: 890, s: 0.56, pose: '서기', ex: exprAt([[0, '미소']], t), look: [0.7, 0] });
    return h;
  }
  let h = labBg(t);
  if (k === 2) {
    const items = [['👂', '들어 준다', 560], ['💛', '마음 써 준다', 1360]];
    h += pop(t, T0 + 0.3, t + 99, 560, 480, card17(0, 0, 360, 260, `<path d="M-20 -70 C40 -80 60 -20 34 10 C20 26 26 50 -6 62 C-26 66 -34 50 -30 40" fill="#F6D9C4" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-4 -40 C24 -44 30 -10 10 6" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` + T17(0, 100, '들어 준다', { size: 38 }), {}), {});
    h += pop(t, T0 + 0.7, t + 99, 1360, 480, card17(0, 0, 360, 260, `<path d="M0 30 c-40 -50 -90 -6 -50 34 l50 44 l50 -44 c40 -40 -10 -84 -50 -34 Z" transform="translate(0 -60)" fill="${PINK}" stroke="${INK}" stroke-width="6"/>` + T17(0, 100, '마음 써 준다', { size: 38 }), {}), {});
    h += pop(t, T0 + 0.1, t + 99, 960, 200, label(0, 0, '호감의 이유: 반응성', { size: 44, bg: MINT }), {});
    return h;
  }
  const st = [['묻고', '?', 520], ['기억하고', '✎', 960], ['행동으로', '→', 1400]];
  st.forEach(([nm, ic, x], j) => h += pop(t, T0 + 0.2 + j * 0.5, t + 99, x, 480, `<circle r="110" fill="${['#FFE36E', '#BFE3C7', '#F8D3C4'][j]}" stroke="${INK}" stroke-width="7"/>` + T17(0, 34, ic, { size: 100 }) + T17(0, 170, nm, { size: 42, fill: '#fff' }), {}));
  return h;
}
// 54-58 experiment 5: the same café; listening
function cfriScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  if (k === 0) return expCard17(t, lt, a, 5, `<g><rect x="-80" y="-60" width="160" height="120" rx="10" fill="#fff" stroke="${INK}" stroke-width="6"/>` + T17(0, 10, '점수?', { size: 44, fill: RED }) + `<line x1="-90" y1="-70" x2="90" y2="70" stroke="${RED}" stroke-width="10"/></g>`);
  let h = cafe17(t, { night: true });
  const zo = { t, seed: 1820, x: ZSEAT.x, y: ZSEAT.y, s: ZSEAT.s }, so = { t, seed: 1821, x: PSEAT.x, y: PSEAT.y, s: PSEAT.s };
  const [zx, zy] = ballL17(Object.assign({ pose: '앉기' }, ZSEAT)), [sx, sy] = ballR17(Object.assign({ pose: '앉기' }, PSEAT));
  let bxy = [sx, sy], zPose = '앉기', sPose = '앉기', sEx = '미소', zEx = '미소';
  if (k === 1) bxy = null;
  if (k === 2) { sPose = '앉아설명'; bxy = arc17(sx, sy, zx, zy, easeInOut(prog(lt, 0.8 * D, D)), 120); h += pop(t, T0 + 0.6, t + 99, PSEAT.x, 360, icon17('sea'), { bob: 3 }); }
  if (k === 3) { zPose = '앉아던지기'; bxy = arc17(zx, zy, sx, sy, easeInOut(prog(lt, 0.3, 1.2)), 140); zEx = '신남'; }
  if (k === 4) { sPose = '앉아설명'; sEx = '신남'; bxy = [sx, sy]; zPose = '앉아턱'; zEx = '미소';
    [['비 오던 바다', 0.15], ['길 위의 할머니', 0.45], ['다 걷고 울었던 이유', 0.75]].forEach(([s1, f], j) => h += pop(t, T0 + f * D, t + 99, 1240 + (j - 1) * 160, 300 + j * 70, label(0, 0, s1, { size: 28, bg: '#fff' }), { rot: (j - 1) * 4 })); }
  h += HALO(char(Object.assign({}, ZB17, zo, { pose: zPose, ex: exprAt([[0, zEx]], t), look: [0.7, 0] })));
  h += SA(Object.assign({}, so, { pose: sPose, ex: exprAt([[0, sEx]], t), look: [-0.7, 0] }));
  h += cafeTable17(t);
  if (bxy) h += ball17(bxy[0], bxy[1], 26);
  if (k === 1) { h += pop(t, T0 + 0.2, t + 99, 330, 150, label(0, 0, '금요일 저녁 · 그 카페', { size: 40, bg: '#fff' }), { rot: -3 }); h += pop(t, T0 + 0.8, t + 99, 520, 600, label(0, 0, '수염은 떼고', { size: 28, bg: YEL }), { rot: -4 }); }
  return h;
}
// 59-66 home: scoring alone; the liking gap; the messages
function cscoreScene(t, lt, a) {
  const k = a.k || 0, T0 = t - lt;
  let h = nightRoom12(t) + `<rect x="760" y="700" width="560" height="30" rx="8" fill="#5A3E2C" stroke="${INK}" stroke-width="6"/><rect x="790" y="730" width="22" height="150" fill="#4A3020"/><rect x="1268" y="730" width="22" height="150" fill="#4A3020"/>`;
  h += card17(1040, 560, 420, 260, T17(0, -70, '오늘의 내 점수', { size: 34 }) + (k === 1 ? T17(0, 0, '말 없음 −30', { size: 34, fill: RED }) + T17(0, 50, '재미없음 −40', { size: 34, fill: RED }) : T17(0, 20, '?', { size: 90, fill: '#9AA6B2' })), { bg: '#fff' });
  h += chair12(640, 880, 0.56) + HALO(char(Object.assign({}, ZB17, { t, seed: 1830, x: 640, y: 880, s: 0.56, pose: '앉아턱', ex: exprAt([[0, k === 1 ? '서운함' : '생각']], t), look: [0.6, 0.3] })));
  return h;
}
function cgapScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  if (k <= 1) {
    let h = labBg(t);
    if (k === 0) {
      const bars = [['상대가 실제로\n좋아한 정도', 0.8, MINT], ['내가 짐작한\n정도', 0.5, '#8C98A4']];
      h += `<line x1="560" y1="800" x2="1360" y2="800" stroke="#fff" stroke-width="6"/>`;
      bars.forEach(([nm, v, c], j) => { const x = 760 + j * 400, kk = easeOut(prog(lt, 0.3 + j * 0.4, 1.2 + j * 0.4)); h += `<rect x="${x - 90}" y="${f1(800 - 420 * v * kk)}" width="180" height="${f1(420 * v * kk)}" rx="12" fill="${c}" stroke="${INK}" stroke-width="6"/>`; nm.split('\n').forEach((s1, q) => h += T17(x, 850 + q * 40, s1, { size: 32, fill: '#fff' })); });
      h += T17(1740, 900, '개념도', { anchor: 'end', size: 26, fill: '#9FB4D8', w: 700 });
      return h;
    }
    h += pop(t, T0 + 0.2, t + 99, 620, 480, card17(0, 0, 440, 260, T17(0, -20, '처음 만난 사이', { size: 40 }) + T17(0, 50, '"나 별로였겠지…"', { size: 30, fill: '#6B6255', w: 700 }), {}), { rot: -2 });
    h += pop(t, T0 + at17(t, a, '룸메이트', -0.2), t + 99, 1300, 480, card17(0, 0, 440, 260, T17(0, -20, '룸메이트 (몇 달)', { size: 40 }) + T17(0, 50, '그래도 낮게 짐작', { size: 30, fill: '#6B6255', w: 700 }), {}), { rot: 2 });
    h += pop(t, T0 + at17(t, a, '호감 격차', -0.2), t + 99, 960, 200, label(0, 0, '호감 격차 (liking gap)', { size: 46, bg: YEL }), {});
    return h;
  }
  let h = nightRoom12(t) + dim17(0.15);
  if (k === 2) {
    // same desk as the scoring scene: the score sheet gets crossed out, then Zero types a message instead
    h += `<rect x="760" y="700" width="560" height="30" rx="8" fill="#5A3E2C" stroke="${INK}" stroke-width="6"/><rect x="790" y="730" width="22" height="150" fill="#4A3020"/><rect x="1268" y="730" width="22" height="150" fill="#4A3020"/>`;
    const xk = prog(lt, 0.2, 0.8);
    h += card17(1040, 560, 420, 260, T17(0, -70, '오늘의 내 점수', { size: 34 }) + T17(0, 0, '말 없음 −30', { size: 34, fill: RED }) + T17(0, 50, '재미없음 −40', { size: 34, fill: RED }) +
      (xk > 0 ? `<path d="M-170 -100 L${f1(-170 + 340 * xk)} ${f1(-100 + 200 * xk)}" stroke="${RED}" stroke-width="12" stroke-linecap="round"/>` : ''), { bg: '#fff' });
    h += pop(t, T0 + 0.9, t + 99, 1340, 380, label(0, 0, '채점 그만!', { size: 40, bg: MINT }), { rot: -6 });
    h += chair12(640, 880, 0.56) + HALO(char(Object.assign({}, ZB17, { t, seed: 1831, x: 640, y: 880, s: 0.56, pose: '앉아폰', ex: exprAt([[0, '생각'], [1.0, '미소']], lt), look: [0.4, 0.5] })));
    return h;
  }
  h += phone17(960, 520, 0.95, [['오늘 올레길 얘기, 정말 좋았어요. 다음엔 그 바다 사진도 보여 주세요.', true, 0]], 1);
  return h;
}
function creplyScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  let h = nightRoom12(t) + dim17(0.15);
  const mine = ['오늘 올레길 얘기, 정말 좋았어요. 다음엔 그 바다 사진도 보여 주세요.', true, 0];
  if (k === 0) {
    h += `<rect x="760" y="700" width="560" height="30" rx="8" fill="#5A3E2C" stroke="${INK}" stroke-width="6"/><rect x="790" y="730" width="22" height="150" fill="#4A3020"/><rect x="1268" y="730" width="22" height="150" fill="#4A3020"/>`;
    h += chair12(640, 880, 0.56) + HALO(char(Object.assign({}, ZB17, { t, seed: 1832, x: 640, y: 880, s: 0.56, pose: '앉아폰', ex: exprAt([[0, '걱정']], t), look: [0.4, 0.5] })));
    for (let i = 0; i < 3; i++) h += `<circle cx="${760 + i * 40}" cy="560" r="10" fill="#C9D6E2" opacity="${f1((0.4 + 0.6 * ((Math.floor(t * 3) % 3) === i)) * 100) / 100}"/>`;
    return h;
  }
  if (k === 1) return h + phone17(960, 520, 0.95, [mine, ['저도요. 그 얘기를 그렇게 끝까지 들어 준 사람, 처음이었어요. 다음엔 제가 물어볼게요. 제로 씨 얘기.', false, 0]], 1);
  const zo = { t, seed: 1833, x: 760, y: 900, s: 0.6, pose: '안기', ex: exprAt([[0, '놀람'], [1.0, '미소']], lt), look: [0.5, -0.2] };
  h += HALO(char(Object.assign({}, ZB17, zo)));
  const [hx, hy] = handAt(zo, 'hR'), kk = easeInOut(prog(lt, 0.2, 1.2)), [x, y] = arc17(1900, 300, hx - 40, hy - 20, kk, 120);
  h += ball17(x, y, 30, 0.8) + `<ellipse cx="760" cy="600" rx="420" ry="320" fill="url(#warm)" opacity="${f1(0.6 * kk * 100) / 100}"/>`;
  return h;
}
// 67-71 Saturday: Sua asks — grandma's words come back
function csatScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  let h = river17(t);
  const zo = Object.assign({ t, seed: 1840 }, BSEAT_Z), so = Object.assign({ t, seed: 1841 }, BSEAT_S);
  const [zx, zy] = ballL17(Object.assign({ pose: '앉기' }, BSEAT_Z)), [sx, sy] = ballR17(Object.assign({ pose: '앉기' }, BSEAT_S));
  let bxy = [sx, sy], zPose = '앉기', sPose = '앉기', zEx = '미소', sEx = '미소';
  if (k === 1) { sPose = '앉아던지기'; bxy = arc17(sx, sy, zx, zy, easeInOut(prog(lt, 0.6, 1.4)), 120); }
  if (k === 2) { zPose = '앉아설명'; zEx = '신남'; bxy = [zx, zy]; h += pop(t, T0 + 0.6, t + 99, 820, 360, `<g style="filter: sepia(.8)">${card17(0, 0, 300, 200, `<rect x="-120" y="20" width="240" height="14" fill="#B07A44"/>` + `<circle cx="-30" cy="-10" r="22" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="40" cy="-14" r="26" fill="#ddd" stroke="${INK}" stroke-width="4"/>`, { bg: '#F4E6C8' })}</g>`, { bob: 3 }); }
  if (k === 3) { sPose = '앉아던지기'; sEx = '미소'; bxy = arc17(sx, sy, zx, zy, easeInOut(prog(lt, 0.4, 1.6)), 120); zEx = '놀람';
    const mem = prog(lt, 0.3, 1.3);  // grandma's face comes back as a sepia memory bubble above Zero
    if (mem > 0) h += `<g opacity="${f1(mem * 100) / 100}" style="filter: sepia(.75)"><circle cx="${BSEAT_Z.x - 40}" cy="560" r="12" fill="#F4E6C8" stroke="${INK}" stroke-width="4"/><circle cx="${BSEAT_Z.x - 70}" cy="510" r="18" fill="#F4E6C8" stroke="${INK}" stroke-width="4"/>` + card17(BSEAT_Z.x - 140, 360, 260, 230, `<g transform="translate(0 95)">${GM({ t, seed: 1792, x: 0, y: 0, s: 0.34, pose: '앉아던지기', ex: exprAt([[0, '미소']], t), look: [0.4, 0] })}</g>`, { bg: '#F4E6C8' }) + '</g>'; }
  if (k === 4) { zEx = '울먹'; bxy = [zx, zy]; }
  h += HALO(char(Object.assign({}, ZB17, zo, { pose: zPose, ex: exprAt([[0, zEx]], t), look: [0.6, 0] })));
  h += SA(Object.assign({}, so, { pose: sPose, ex: exprAt([[0, sEx]], t), look: [-0.6, 0] }));
  if (bxy) h += ball17(bxy[0], bxy[1], 24, k >= 3 ? 0.7 : 0);
  if (k === 0) h += pop(t, T0 + 0.2, t + 99, 330, 150, label(0, 0, '토요일 · 두 번째 만남', { size: 40, bg: '#fff' }), { rot: -3 });
  if (k === 4) { h = `<g transform="translate(${f1(BSEAT_Z.x)} 640) scale(${f1(1 + 0.25 * easeInOut(prog(lt, 0, D)))}) translate(${f1(-BSEAT_Z.x)} -640)">${h}</g>`; }
  return h;
}
// 72-74 the realisation (Monday's words come back) over the riverside
function cendScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  let h = river17(t);
  const [zx, zy] = ballL17(Object.assign({ pose: '앉기' }, BSEAT_Z)), [sx, sy] = ballR17(Object.assign({ pose: '앉기' }, BSEAT_S));
  h += HALO(char(Object.assign({}, ZB17, { t, seed: 1840 }, BSEAT_Z, { pose: '앉기', ex: exprAt([[0, '미소']], t), look: [0.6, 0] })));
  h += SA(Object.assign({ t, seed: 1841 }, BSEAT_S, { pose: '앉기', ex: exprAt([[0, '신남']], t), look: [-0.6, 0] }));
  const ph = (lt * 0.5) % 1, dir = Math.floor(lt * 0.5) % 2, [x, y] = dir ? arc17(sx, sy, zx, zy, easeInOut(ph), 130) : arc17(zx, zy, sx, sy, easeInOut(ph), 130);
  h += ball17(x, y, 24, 0.6);
  if (k === 0) h += quote17(t, T0 + 0.2, 960, 250, ['남이 나를 알아주지 않을까 걱정하지 말고,', '내가 남을 알지 못할까 걱정하라.'], '『논어』 학이 · 월요일의 그 말', { w: 1100, size: 44 });
  if (k === 1) h += pop(t, T0 + 0.2, t + 99, 960, 220, big(0, 0, [[['남을 먼저 알려 했더니,', '#fff']], [['누군가 ', '#fff'], ['나를 알고 싶어 했다', YEL]]], { size: 66, sw: 13, lh: 90 }), { noPop: true, inDur: 0.5 });
  if (k === 2) h += pop(t, T0 + 0.2, t + 99, 960, 220, big(0, 0, [[['호감 = ', '#fff'], ['끝까지 궁금해해 주는 것', YEL]]], { size: 66, sw: 13 }), { noPop: true, inDur: 0.5 });
  return h;
}
// 75-77 one sentence for the viewer
function cmagicScene(t, lt, a) {
  const k = a.k || 0, D = D17(a), T0 = t - lt;
  let h = BG('#14213A') + BG('url(#dots)') + `<ellipse cx="960" cy="560" rx="700" ry="460" fill="url(#amber)" opacity=".35"/>`;
  if (k === 0) {
    const zo = { t, seed: 1850, x: 960, y: 900, s: 0.6, pose: '내밀기', ex: exprAt([[0, '미소']], t), look: [0, 0] };
    h += HALO(char(Object.assign({}, ZB17, zo))); const [hx, hy] = handAt(zo, 'hR'); h += ball17(hx, hy - 10, 30, 0.6);
    h += pop(t, T0 + 0.2, t + 99, 960, 200, label(0, 0, '이 영상이 끝나면, 딱 한 문장', { size: 44, bg: YEL }), {});
    return h;
  }
  if (k === 1) {
    const kk = easeOut(prog(lt, 0, 1.4));
    h += ball17(960, 800 - 160 * kk, 30 + 110 * kk, kk);
    h += pop(t, T0 + 0.2, t + 99, 960, 240, big(0, 0, [[['그래서요?', YEL]], [['그다음엔요?', '#fff']]], { size: 120, sw: 20, lh: 150 }), { inDur: 0.4 });
    return h;
  }
  h += pop(t, T0 + 0.2, t + 99, 960, 250, big(0, 0, [[["'그다음엔?' 하고", '#fff']], [['물어봐 주던 사람', YEL], ['은?', '#fff']]], { size: 78, sw: 15, lh: 104 }), {});
  [['할머니', 560], ['엄마', 800], ['오랜 친구', 1060], ['선생님', 1320]].forEach(([s1, x], j) => h += pop(t, T0 + at17(t, a, '관계만', 0.2 + j * 0.25), t + 99, x, 520, label(0, 0, s1, { size: 34, bg: '#fff' }), { rot: (j - 1.5) * 3 }));
  h += HALO(char(Object.assign({}, ZB17, { t, seed: 1851, x: 960, y: 920, s: 0.42, pose: '손인사', ex: exprAt([[0, '신남']], t) })));
  return h;
}
thanksScene = function (t, lt) {
  let h = labBg(t) + particles(t, 77, 30, [0, 0, 1920, 1080], YEL, { speed: 30, r: 5, op: 0.6 });
  h += pop(t, t - lt + 0.2, t + 99, 960, 200, outlined(0, 0, [[['다음 실험에서', '#fff']], [['또 만나요', YEL]]], { size: 88, sw: 16 }), {});
  h += doctor(380, 960, 0.46, { t, expr: '미소', talk: env(t) });
  h += KZ({ t, seed: 1860, x: 640, y: 890, s: 0.44, pose: '손인사', ex: exprAt([[0, '미소']], t) });
  h += HR({ t, seed: 1861, x: 860, y: 890, s: 0.44, pose: '손인사', ex: exprAt([[0, '신남']], t) });
  h += HALO(char(Object.assign({}, ZB17, { t, seed: 1862, x: 1080, y: 890, s: 0.5, pose: '손인사', ex: exprAt([[0, '신남']], t) })));
  h += SA({ t, seed: 1863, x: 1300, y: 890, s: 0.44, pose: '손인사', ex: exprAt([[0, '미소']], t) });
  h += TL17({ t, seed: 1864, x: 1520, y: 890, s: 0.44, pose: '손인사', ex: exprAt([[0, '미소']], t) });
  h += pop(t, t - lt + 0.6, t + 99, 960, 420, label(0, 0, '상식실험실', { size: 40, bg: MINT }), {});
  return h;
};
