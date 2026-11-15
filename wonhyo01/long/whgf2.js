/* 원효 편 v2 — 2일 차 ~ 끝(대본_v2 21~56번). whgf.js 뒤에 읽는다. 새 이름은 wg 접두사.
   날마다 같은 짜임: 단계 카드 → 원효의 일화(신라 세트) → 제로의 하루(게이지가 움직인다) → 연구(실험실 세트, 숫자 없는 그림은 크기 비교만) → 제로가 해 봄 → 도장.
   끝 장면: 깨달음(물은 그대로)과 감동(이름을 건넨다)을 같은 문 앞에서 한 번에. */
['wgbook', 'wgclash', 'wglord', 'wgvillage', 'wgteach', 'wgtap', 'wgname', 'wgfail', 'wgkind', 'wgroads', 'wghelp', 'wgrecap', 'wgend', 'wgask'].forEach(k => CAMS[k] = 'fixed');
const WM = o => HALO(char(Object.assign({ goggles: 'none', vest: '#9CCBF0', patch: false, tee: true, vshade: 'rgba(0,60,120,0.16)', hair: '#5A4130', collar: true }, o)));   // 민재(동료)
const WS = o => HALO(char(Object.assign({ goggles: 'none', vest: '#FFD3E1', patch: false, tee: true, vshade: 'rgba(160,60,90,0.14)' }, HAIR.bob(GH.choco), o)));            // 서윤(인턴)
const WL = o => HALO(char(Object.assign({ goggles: 'none', vest: '#E9DDBE', patch: false, tee: true, vshade: 'rgba(90,70,20,0.16)' }, o)));                                  // 소성거사(스님 옷을 벗은 원효)
const WV = (col, o) => HALO(char(Object.assign({ goggles: 'none', vest: col, patch: false, tee: true, vshade: 'rgba(0,0,0,0.14)' }, o)));                                    // 마을 사람·실험 참가자
const wgDayDone = (lt, t0, n, x = 1000, y = 185) => wgAt(x, y, gfStamp(lt, t0, `${n}일 차 끝!`, { size: 88, col: '#1F9D61', rot: -6 })) + gfConfetti(lt, t0, { n: 40, d: 1.6 });
const wgTalk = (key, base, t, k = 1) => { E[key] = qTalk(base, env(t) * k); return fEx(key); };
const wgBub = (w, h, inner, o = {}) => `<rect x="${-w / 2}" y="${-h / 2 + 8}" width="${w}" height="${h}" rx="${Math.min(w, h) * 0.32}" fill="${GFC.navy}" opacity=".2"/>` + (o.tail === 0 ? '' : `<path d="M${(o.tail || -1) * w * 0.18} ${h / 2 - 4} L${(o.tail || -1) * w * 0.34} ${h / 2 + 34} L${(o.tail || -1) * w * 0.02} ${h / 2 - 4} Z" fill="${o.bg || '#fff'}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`) + `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${Math.min(w, h) * 0.32}" fill="${o.bg || '#fff'}" stroke="${INK}" stroke-width="7"/>` + (o.tail === 0 ? '' : `<rect x="${Math.min((o.tail || -1) * w * 0.3, (o.tail || -1) * w * 0.04)}" y="${h / 2 - 10}" width="${w * 0.26}" height="9" fill="${o.bg || '#fff'}"/>`) + inner;
const wgStudy = (lt, a, t0 = 0.2) => a.study ? gfChipAt(lt, t0, 430, 125, a.study, { icon: 'flask', size: 38, bg: GFC.sun, rot: -3 }) : '';

/* ===== 22: 다툼을 잇는 책 ===== */
function wgScroll(x, y, s, happy, t, o = {}) {
  const face = happy ? `<path d="M-30 -6 Q-22 -16 -14 -6 M14 -6 Q22 -16 30 -6" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-16 18 Q0 36 16 18" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><ellipse cx="-36" cy="12" rx="10" ry="6" fill="#FF9BB0" opacity=".8"/><ellipse cx="36" cy="12" rx="10" ry="6" fill="#FF9BB0" opacity=".8"/>`
    : `<ellipse cx="-22" cy="-4" rx="6" ry="8" fill="${INK}"/><ellipse cx="22" cy="-4" rx="6" ry="8" fill="${INK}"/><path d="M-38 -26 L-10 -16 M38 -26 L10 -16" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M-14 28 Q0 16 14 28" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  return wgAt(x, y + Math.sin(t * 2.4 + x) * 5, `<rect x="-70" y="-84" width="140" height="168" rx="10" fill="${o.col || GFC.paper}" stroke="${INK}" stroke-width="7"/><rect x="-86" y="-104" width="172" height="34" rx="17" fill="${GFC.wood}" stroke="${INK}" stroke-width="7"/><rect x="-86" y="70" width="172" height="34" rx="17" fill="${GFC.wood}" stroke="${INK}" stroke-width="7"/>` + face, s, o.rot || 0); }
wgbookScene = function (t, lt, a) {
  const D = a._dur || 10, tA = whW(a, '옳다고', 1.6), tB = whW(a, '다툴', 2.3), tC = whW(a, '잇는', 3.4), tD = whW(a, '글자', 6.6), tE = whW(a, '생긴다고', 8.6), tF = Math.min(D - 0.2, tE + 0.5), ok = lt > tF;
  const cam = qLerpCam(lt / D, [960, 600, 1.0], [960, 596, 1.05]), y = WH.GY - 60, lunge = lt > tB && !ok ? Math.abs(Math.sin((lt - tB) * 5.5)) * 54 * Math.exp(-(lt - tB) * 0.35) : 0, top = gfAbove(960, y, 0.8, 60, 0);
  let w = `<g transform="translate(960 ${WH.GY + 6}) scale(1 .5) rotate(-90)">${gfT(0, 80, '6', 230, ok ? GFC.sun : '#fff', { sw: 26 })}</g>`;
  w += gfActor(WHO, { x: 960, y, s: 0.8, t, pose: ok ? '만세' : (lt > tC ? '턱괴기' : '서기'), armFront: !ok && lt > tC ? 'R' : null, ex: fEx(ok ? 'z빵긋' : lt > tC ? 'z의심' : 'z당황'), look: ok ? [0, -0.3] : [Math.sin(lt * 2.4) * 0.9, 0], seed: 21 }, ok ? gfHop(lt, tF + 0.02, 44, 0.4) : {});
  const sl = lt > tD && !ok ? f1(gfK(tD, tD + 0.4, lt) * 0.55) : 0; if (sl > 0) w += `<path d="M560 640 L900 ${WH.GY - 30} M1360 640 L1020 ${WH.GY - 30}" stroke="${GFC.coral}" stroke-width="7" stroke-dasharray="6 16" stroke-linecap="round" opacity="${sl}"/>`;
  if (ok) w += `<path d="M560 560 Q960 300 1360 560" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M560 560 Q960 300 1360 560" fill="none" stroke="${GFC.berry}" stroke-width="18" stroke-linecap="round" stroke-dasharray="${f1(1000 * gfK(tF, tF + 0.35, lt))} 1000"/>` + wgAt(960, 430, `<path d="M0 0 L-52 -30 L-52 30 Z M0 0 L52 -30 L52 30 Z" fill="${GFC.berry}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><circle r="16" fill="${GFC.berry}" stroke="${INK}" stroke-width="7"/>`, gfIn(lt, tF + 0.3, 3.4, 0.4));
  w += wgScroll(500 + lunge, 640, 1.0, ok, t, { rot: ok ? -4 : 6 * Math.sin(lunge * 0.1) }) + wgScroll(1420 - lunge, 640, 1.0, ok, t, { col: '#EAF4FF', rot: ok ? 4 : -6 * Math.sin(lunge * 0.1) });
  const bub = (x, txt, col, t0) => wgAt(x + Math.sin((lt - t0) * 30) * (lt > tB && !ok ? 4 : 0), 420 + Math.sin(t * 2.4 + x) * 5, wgBub(ok ? 250 : 170, 120, gfT(0, 26, ok ? '6이자 9' : txt, ok ? 56 : 76, col), { tail: x < 960 ? 1 : -1 }), gfIn(lt, t0, 3.4, 0.42) * (ok ? gfBeat(lt, tF, 0.2, 3, 5) : 1));
  w += bub(500, '6!', '#3F7BD9', tA) + bub(1420, '9!', '#E8558A', tA + 0.25);
  if (!ok) w += gfEmote(lt, tB, 600 + lunge, 520, 'vein', { hold: tF - tB, s: 0.9 }) + gfEmote(lt, tB + 0.1, 1320 - lunge, 520, 'vein', { hold: tF - tB - 0.1, s: 0.9 }) + gfStarBurst(lt, tB + 0.15, 960, 560, { r1: 160, cols: ['#fff', GFC.coral, GFC.sun] });
  else w += gfEmote(lt, tF + 0.2, 400, 470, 'note', { hold: 2 }) + gfEmote(lt, tF + 0.4, 1530, 470, 'note', { hold: 2 }) + gfEmote(lt, tF, top[0], top[1], 'idea', { hold: 2 }) + gfRing(lt, tF, 960, 430, 60, 520, '#fff', 16, 0.5) + gfStarBurst(lt, tF, 960, 430, { r0: 100, r1: 420, n: 9, size: 26 });
  let h = gfDefs() + wgSilla(t, cam, { pagodaX: 1730 }) + qCam(cam, w);
  h += wgAt(960, 300, gfItem(lt, tC, { name: '『십문화쟁론』', sub: '다툼을 잇는 책', svg: gfIcon('book', 2.3), w: 560 }), gfOut(lt, tD - 0.25, 0.18)) + gfChipAt(lt, tD - 0.1, 430, 125, '『십문화쟁론』 · 다툼을 잇는 책', { icon: 'book', size: 36, bg: GFC.sun, rot: -3 });
  h += wgAt(0, 0, gfChipAt(lt, tD, 960, 250, '글자 그대로만 붙잡으면?', { size: 46, bg: '#fff', rot: -2 }), gfOut(lt, tF - 0.1, 0.15));
  return h;
};

/* ===== 23~25, 28~29: 화요일 회의 — 부딪친 두 안을 잇는다 ===== */
function wgPlan(who) { const z = who === 'Z'; return gfPanel(300, 190, { bg: z ? '#FFEBD9' : '#DCEEFF', head: z ? '제로 안' : '민재 안', headBg: z ? '#FFB37A' : '#8FC1F0' }) + wgAt(-84, 12, gfIcon(z ? 'check' : 'fast', 1.5)) + gfT(40, 30, z ? '꼼꼼히' : '빠르게', 50, GFC.navy); }
function wgPiece(who, text) { const z = who === 'Z', col = z ? '#FFC79A' : '#A9D4F7';
  return (z ? '' : `<circle cx="150" cy="0" r="34" fill="${col}" stroke="${INK}" stroke-width="8"/>`) + `<rect x="-150" y="-80" width="300" height="160" rx="26" fill="${col}" stroke="${INK}" stroke-width="8"/>` + (z ? '' : `<rect x="120" y="-24" width="40" height="48" fill="${col}"/>`) + gfT(z ? 20 : -6, 18, text, 46, GFC.navy); }
wgclashScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 3, y = WH.GY, zx = 600, mx = 1340, s = 0.92; let cam = [960, 600, 1.02], w = '', ui = '', post = '', zex = fEx('z기본'), mex = fEx('z기본'), zlook = [0.8, 0], mlook = [-0.8, 0], zpose = P['서기'], mpose = P['서기'], zm = {}, mm = {}, v = 0.5, tp = null, hurt = false;
  const ztop = gfAbove(zx, y, s, 70, 10), mtop = gfAbove(mx, y, s, -70, 10); let cz = [600, 330], cm = [1340, 330], cross = 0, cards = true;
  if (ph === 0) { const t1 = whW(a, '제로와', 1.3), t2 = whW(a, '민재', 1.9), tH = whW(a, '부딪', D - 0.9), k = easeIn(gfK(tH - 0.25, tH, lt)), sh = gfShake(lt, tH, 14, 0.35);
    cz = [lerp(560, 760, k) + sh[0], 340 + sh[1]]; cm = [lerp(1380, 1160, k) - sh[0], 340 + sh[1]]; cam = qLerpCam(lt / D, [960, 590, 1.0], [960, 590, 1.05]);
    ui += wgAt(cz[0], cz[1], wgPlan('Z'), 1.3 * gfIn(lt, t1, 3.2, 0.42), -3) + wgAt(cm[0], cm[1], wgPlan('M'), 1.3 * gfIn(lt, t2, 3.2, 0.42), 3) + gfStarBurst(lt, tH, 960, 330, { r1: 240, n: 9, cols: ['#fff', GFC.coral, GFC.sun] }) + wgAt(960, 330, gfT(0, 24, 'VS', 84, '#fff', { sw: 20, stroke: GFC.coral }), gfIn(lt, tH, 3.6, 0.4), -6);
    v = wgV([[0, 0.55], [tH, 0.36]], lt); tp = lt > tH ? tH : null; hurt = true; zex = fEx(lt > tH ? 'z당황' : 'z기본'); mex = fEx(lt > tH ? 'z결심' : 'z기본'); cards = false;
  } else if (ph === 1) { cz = [760, 340]; cm = [1160, 340]; mex = wgTalk('_wgm', 'z결심', t); mpose = Object.assign({}, P['서기'], { armL: [[148, 285], [96, 290], [50, 300]], hL: [42, 302] }); zex = fEx('z충격'); cross = gfIn(lt, 0.75, 3.6, 0.4); zm = gfJelly(lt, 0.75, 0.12);
    v = wgV([[0, 0.36], [0.75, 0.16]], lt); tp = lt > 0.75 ? 0.75 : null; hurt = true; w += gfEmote(lt, 0.9, ztop[0], ztop[1], 'vein', { hold: 1.4 }); post = gfRing(lt, 0.75, 830, 320, 40, 260, GFC.coral);
  } else if (ph === 2) { const tI = whW(a, '이유가', 1.6), fl = easeInOut(gfK(tI - 0.2, tI + 0.15, lt)); cz = [760, 340]; cm = [1160, 340]; cross = 1; zex = wgTalk('_wgz', lt > tI ? 'z반짝' : 'z의심', t, 0.6); zlook = [0.5, -0.5]; zpose = '턱괴기'; cam = qLerpCam(lt / D, [700, 620, 1.3], [690, 626, 1.38]);
    v = wgV([[0, 0.16], [tI, 0.3]], lt); cards = false;
    w += wgAt(zx + 250, 478 + Math.sin(t * 2.4) * 4, bubble(0, 0, 350, 222, `<g transform="scale(${f1(Math.max(0.04, Math.abs(1 - 2 * fl)))} 1)">` + (fl < 0.5 ? `<g transform="scale(.72)">${wgPlan('M')}</g>` + wgAt(70, -40, gfIcon('cross', 1.2)) : `<g transform="scale(.72)">${gfPanel(300, 190, { bg: '#DCEEFF', head: '민재 안', headBg: '#8FC1F0' })}</g>` + gfT(0, 34, '왜?', 74, GFC.grape)) + `</g>`), gfIn(lt, 0.3, 3, 0.42)) + gfEmote(lt, tI, ztop[0] - 60, ztop[1] + 10, 'q', { hold: 1.6, s: 0.8 });
  } else if (ph === 3) { const t1 = whW(a, '일정은', 1.2), t2 = whW(a, '점검', 3.6), tS = whW(a, '붙이면', D - 0.9), k = easeIn(gfK(tS - 0.22, tS, lt)), j = gfJelly(lt, tS, 0.12); cards = false; zex = wgTalk('_wgz', 'z빵긋', t); zpose = '손인사'; mex = fEx(lt > t1 ? 'z의심' : 'z결심');
    ui += wgAt(lerp(1250, 1157, k), 340, wgPiece('Z', '점검 단계'), 1.3 * gfIn(lt, t2, 3.2, 0.42) * j.sx, lerp(5, 0, k)) + wgAt(lerp(680, 765, k), 340, wgPiece('M', '빠른 일정'), 1.3 * gfIn(lt, t1, 3.2, 0.42) * j.sx, lerp(-5, 0, k));
    ui += gfRing(lt, tS, 960, 340, 80, 460, '#fff', 16, 0.45) + gfStarBurst(lt, tS, 960, 340, { r0: 160, r1: 460, n: 10, size: 26 }) + gfPlus(lt, tS + 0.05, 960, 190, '딱!', { size: 70 });
    v = wgV([[0, 0.3], [tS, 0.58]], lt); tp = lt > tS ? tS : null;
  } else { cards = false; mex = wgTalk('_wgm', 'z반짝', t); zex = fEx('z빵긋'); mm = gfHop(lt, 0.3, 36, 0.36); const tE = Math.max(1.2, D - 0.35);
    ui += wgAt(1157, 340, wgPiece('Z', '점검 단계'), 1.3) + wgAt(765, 340, wgPiece('M', '빠른 일정'), 1.3) + gfTwinkle(t, 700, 250, 22, 1, GFC.sun) + gfTwinkle(t, 1250, 420, 18, 2.4, '#fff');
    w += gfEmote(lt, 0.2, mtop[0], mtop[1], 'bang', { hold: 0.9 }) + gfEmote(lt, 1.0, 960, 560, 'heart', { hold: 1.6 }); v = wgV([[0, 0.58], [0.5, 0.74]], lt); tp = lt > 0.5 ? 0.5 : null; ui += wgDayDone(lt, tE, 2);
  }
  if (cards) ui += wgAt(cz[0], cz[1], wgPlan('Z'), 1.3, -3) + wgAt(cm[0], cm[1], wgPlan('M'), 1.3, 3) + wgAt(cz[0] + 70, cz[1] - 20, gfIcon('cross', 3), cross, -8);
  w = gfActor(WM, { x: mx, y, s, t, pose: mpose, ex: mex, look: mlook, seed: 14 }, mm) + gfActor(WZ, { x: zx, y, s, t, pose: zpose, armFront: zpose === '턱괴기' ? 'R' : null, ex: zex, look: zlook, seed: 3 }, zm) + whHipGourd(zx, y + (zm.dy || 0), s, t) + w;
  w += whTable(960, 860) + whPaper(880, 842, 0.7, -6) + whPaper(1060, 846, 0.7, 4);
  return gfDefs() + wgMeetSet(t, cam, { plain: 1 }) + qCam(cam, w) + (ph === 2 ? '' : ui + post) + wgDayChip(2) + wgMoodHud(lt, v, { tp, hurt });
};

/* ===== 26~27: 공정하게 vs 반대를 떠올려 ===== */
function wgSeesaw(x, y, ang, col, ball = true) { return wgAt(x, y, `<path d="M-36 0 L0 -62 L36 0 Z" fill="${GFC.wood2}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><g transform="translate(0 -66) rotate(${f1(ang)})"><rect x="-170" y="-12" width="340" height="24" rx="12" fill="${col}" stroke="${INK}" stroke-width="7"/>${ball ? `<circle cx="${f1(clamp(ang * 7.5, -138, 138))}" cy="-36" r="24" fill="${GFC.coral}" stroke="${INK}" stroke-width="6"/>` : ''}</g>`); }
wglordScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 8; let h = gfDefs() + wgLab(t) + wgStudy(lt, a, ph ? -1 : 0.2);
  const tTwo = ph ? -9 : whW(a, '가지를', 3.8), tF = ph ? -9 : whW(a, '공정하게', 5.4), tO = ph ? -9 : whW(a, '반대', 7.6), tW = ph ? whW(a, '기우는', 0.7) : 99, tR = ph ? whW(a, '줄인', 2.2) : 99, tS = ph ? whW(a, '반대를', 2.9) : 99;
  const lev = easeInOut(gfK(tR, tR + 0.9, lt)), wob = ph ? 3 * Math.sin((lt - tW) * 9) * Math.exp(-Math.max(0, lt - tW) * 2) * (lt > tW ? 1 : 0) : 0, base = 17 + Math.sin(t * 1.4) * 1.2;
  [[520, '공정하게 판단해 주세요', '#BFE8D2', tF, lerp(base, 12.5, lev)], [1400, '반대 경우를 생각해 보세요', '#D9C7E8', tO, lerp(base, 2.5, lev)]].forEach(([cx, txt, col, t0, ang], i) => {
    const good = ph && i === 1 && lt > tS, jx = cx - 260;
    h += gfActor(WV, { x: jx, y: 1020, s: 0.8, t, ex: fEx(good ? 'z반짝' : lt > t0 ? 'z의심' : 'z기본'), look: [0.8, 0.1], pose: lt > t0 ? '턱괴기' : '서기', armFront: lt > t0 ? 'R' : null, seed: 30 + i }, good ? gfHop(lt, tS + 0.05, 30, 0.34) : {});
    h += wgAt(cx + 110, 840, wgSeesaw(0, 0, ang + wob, col), 1.35) + wgAt(cx + 110, 940, gfChip('판단', { size: 38, bg: '#fff' }));
    h += wgAt(cx, 285 + Math.sin(t * 1.9 + i) * 4, gfPanel(790, 180, { bg: col, r: 44 }) + wgAt(-320, 0, `<circle r="50" fill="#fff" stroke="${INK}" stroke-width="7"/>` + gfT(0, 24, i ? '2' : '1', 68, GFC.navy)) + gfT(50, 19, txt, 52, GFC.navy), gfIn(lt, t0, 3, 0.45), i ? 2 : -2);
    if (good) h += gfStarBurst(lt, tS, cx + 110, 740, { r1: 240, n: 9, size: 26 }) + gfRing(lt, tS, cx + 110, 750, 40, 300, GFC.sun) + gfChipAt(lt, tS + 0.1, cx + 110, 590, '더 많이 줄었다', { icon: 'check', size: 52, bg: '#fff', rot: -3 });
  });
  if (!ph) h += gfChipAt(lt, tTwo, 960, 500, '두 가지 부탁', { size: 48, bg: '#fff' }); else h += wgAt(0, 0, gfChipAt(lt, tW, 960, 500, '한쪽으로 기운 판단', { size: 46, bg: '#FFE0E0', rot: -2 }), gfOut(lt, tS - 0.1, 0.15));
  return h;
};
// WV는 (색, 옵션) 꼴이라 gfActor에 맞춰 감싼다
const _gfActor0 = gfActor; gfActor = function (fn, o, m) { return fn === WV ? _gfActor0(oo => WV(oo._col || ['#BFE8D2', '#D9C7E8', '#FFE2A8', '#C9E3F7'][(oo.seed || 0) % 4], oo), o, m) : _gfActor0(fn, o, m); };

/* ===== 31: 표주박을 들고 마을을 돌다 ===== */
function wgHut(x, y, s) { return wgAt(x, y, `<rect x="-120" y="-150" width="240" height="150" rx="10" fill="#FFF1D0" stroke="${INK}" stroke-width="7"/><rect x="-28" y="-96" width="56" height="96" rx="8" fill="${GFC.wood}" stroke="${INK}" stroke-width="6"/><path d="M-170 -140 Q-150 -260 0 -270 Q150 -260 170 -140 Z" fill="#E9C76E" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-110 -170 Q-60 -214 -30 -246 M-10 -160 Q0 -214 0 -256 M110 -170 Q60 -214 30 -246" fill="none" stroke="${INK}" stroke-width="4" opacity=".3" stroke-linecap="round"/>`, s); }
wgvillageScene = function (t, lt, a) {
  const D = a._dur || 10, tG = whW(a, '표주박', 2.2), tS = whW(a, '노래하고', 2.6), tP = whW(a, '가난한', 6.0), tJ = whW(a, '따라', 7.6), cam = qLerpCam(lt / D, [900, 600, 1.0], [960, 596, 1.06]), y = WH.GY - 30;
  const beat = 0.56, ph = lt > tS ? ((lt - tS) % beat) / beat : 0, dy = lt > tS ? -46 * 4 * ph * (1 - ph) : 0;   // 박자에 맞춰 통통
  const wx = lerp(520, 760, easeInOut(gfK(tS, D, lt))), up = Math.floor((lt - tS) / beat) % 2 === 0, pose = lt > tS ? (up ? '만세' : '손인사') : Object.assign({}, P['서기'], { armR: [[252, 285], [300, 250], [318, 190]], hR: [320, 180] });
  let w = gfBlob(wx, y, 84, lt > tS ? 0.6 * Math.sin(Math.PI * ph) : 0) + WHO({ x: wx, y: y + dy, s: 0.86, t, pose, ex: fEx(lt > tS ? 'z빵긋' : 'z기본'), look: [0.5, -0.2], tilt: lt > tS ? 6 * Math.sin((lt - tS) * Math.PI / beat) : 0, seed: 21 });
  const hpn = typeof pose === 'string' ? P[pose].hR : pose.hR, gp = gfHand(wx, y + dy, 0.86, hpn);
  w += wgAt(gp[0], gp[1] - 150, whGourd(0, 0, 1.5, 0), gfIn(lt, tG - 0.2, 3, 0.42), 10 * Math.sin(lt * 5)) + gfEmote(lt, tS + 0.1, wx + 150, y - 500, 'note', { hold: 1.8 }) + gfEmote(lt, tS + 2.1, wx - 140, y - 470, 'note', { hold: 1.8 }) + gfEmote(lt, tS + 4.1, wx + 150, y - 500, 'note', { hold: 1.8 });
  [[1180, 0.5, '#C9B28A', 0, {}], [1390, 0.66, '#B5C7A0', 0.2, { hair: '#4A3A30' }], [1610, 0.6, '#D9B0A0', 0.4, { hair: '#D5D5D5' }]].forEach(([x, sc, col, dl, ex], i) => {
    const join = lt > tJ + dl, p2 = join ? ((lt - tJ - dl) % beat) / beat : 0, vy = join ? -30 * 4 * p2 * (1 - p2) : 0;
    w += gfBlob(x, y, 84 * sc) + WV(col, Object.assign({ x, y: y + vy, s: sc, t, pose: join ? '만세' : '서기', ex: fEx(join ? 'z빵긋' : lt > tS + 0.5 ? 'z반짝' : 'z기본'), look: [-0.8, -0.1], seed: 40 + i }, ex));
    w += gfEmote(lt, tJ + dl + 0.1, x + 40, y - 560 * sc - 20, 'note', { hold: 2.4, s: 0.8 }); });
  w += gfEmote(lt, tP, 1390, y - 470, 'heart', { hold: 1.4 });
  const huts = gfLayer(cam, 0.6, wgHut(1250, 800, 0.9) + wgHut(1640, 790, 1.05));
  return gfDefs() + wgSilla(t, cam) + huts + qCam(cam, w) + gfChipAt(lt, tG, 430, 125, '큰 표주박 · 이름은 ‘무애’', { size: 38, bg: GFC.sun, rot: -3 });
};

/* ===== 32~34, 38~39: 수요일 — 서윤에게 가르치기 ===== */
function wgTeachSet(t, cam) { return wgOffice(t, cam, gfDesk(950, 900, 1.3, { mon: false }) + `<rect x="936" y="670" width="28" height="40" fill="#9AA6B8" stroke="${INK}" stroke-width="6"/><rect x="850" y="560" width="200" height="126" rx="16" fill="#3A4668" stroke="${INK}" stroke-width="7"/><circle cx="950" cy="622" r="12" fill="#55628A"/>`); }   // 가운데 책상: 모니터는 뒷면만 보인다
function wgBars(s = 1) { return `<g transform="scale(${s})">` + gfPanel(330, 250, { bg: '#fff' }) + `<rect x="-100" y="10" width="70" height="60" rx="8" fill="#C9CFD8" stroke="${INK}" stroke-width="6"/><rect x="30" y="-70" width="70" height="140" rx="8" fill="${GFC.mint}" stroke="${INK}" stroke-width="6"/><path d="M-130 72 H130" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` + gfT(-65, 108, '지난달', 30, GFC.navy) + gfT(65, 108, '이번 달', 30, GFC.navy) + `</g>`; }
wgteachScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 3, y = WH.GY, zx = 560, sx = 1320, s = 0.92; let cam = [960, 600, 1.02], w = '', ui = '', zex = fEx('z기본'), sex = fEx('z기본'), zlook = [0.8, 0], slook = [-0.8, 0], zpose = P['서기'], spose = P['서기'], sm = {}, v = 0.3, tp = null;
  const stop = gfAbove(sx, y, s, -50, 0), fly = (t0, d, x0, y0, x1, y1, arc = 120) => { const k = gfK(t0, t0 + d, lt); return [lerp(x0, x1, easeOut(k)), lerp(y0, y1, k) - arc * 4 * k * (1 - k), k]; };
  if (ph === 0) { zpose = '손인사'; zex = fEx('z빵긋'); sex = fEx('z설렘'); cam = qLerpCam(lt / D, [960, 596, 1.0], [960, 596, 1.05]); ui += gfChipAt(lt, 1.5, sx, 440, '인턴 서윤', { size: 44, bg: '#FFD3E1', rot: 3 });
  } else if (ph === 1) { zex = wgTalk('_wgz', 'z뿌듯', t); zpose = '손인사'; const ws = [['대시보드', whW(a, '시보드', 0.5)], ['필터', whW(a, '필터', 1.9)], ['전월 대비', whW(a, '전월', 2.7)]]; let hits = 0;
    ws.forEach(([tx, t0], i) => { const p = fly(t0, 0.5, zx + 110, 560, sx - 30, 590 - i * 6); if (p[2] <= 0) return; hits += p[2] >= 1 ? 1 : 0; const fall = p[2] >= 1 ? lt - t0 - 0.5 : 0;
      ui += wgAt(p[0] + (fall ? fall * (60 + i * 30) * (i % 2 ? 1 : -1) : 0), p[1] + (fall ? -160 * fall + 900 * fall * fall : 0), gfChip(tx, { size: 44, bg: '#E7E0FF' }), 1, fall ? fall * 160 : -6 + i * 6) + gfEmote(lt, t0 + 0.5, stop[0] - 40 + i * 70, stop[1] + (i % 2) * 40, 'q', { hold: 1.6, s: 0.75 }); });
    sex = fEx(hits >= 2 ? 'z멘붕' : hits ? 'z당황' : 'z기본'); sm = hits ? gfJelly(lt, ws[Math.min(2, hits - 1)][1] + 0.5, 0.08) : {}; v = wgV([[0, 0.3], [ws[1][1] + 0.5, 0.26]], lt);
  } else if (ph === 2) { sex = wgTalk('_wgs', 'z멘붕', t); cam = qLerpCam(lt / D, [1260, 640, 1.42], [1270, 646, 1.5]); v = 0.26; w += gfEmote(lt, 0.1, stop[0] + 30, stop[1] + 10, 'q', { hold: 2, s: 1.3 });
  } else if (ph === 3) { zex = wgTalk('_wgz', 'z빵긋', t); const t0 = whW(a, '지난달', 1.3), tU = whW(a, '표예요', D - 0.8), p = fly(t0, 0.7, zx + 150, 520, 960, 330, 80); zpose = '손인사';
    if (p[2] > 0) ui += wgAt(p[0], p[1] + Math.sin(t * 2.2) * 4, wgBars(1.15), gfIn(lt, t0, 3, 0.45), -3 + 3 * p[2]) + gfTwinkle(t, 780, 220, 20, 1, GFC.sun);
    sex = fEx(lt > t0 + 0.7 ? 'z반짝' : 'z의심'); slook = lt > t0 + 0.5 ? [-0.6, -0.7] : [-0.8, 0]; v = wgV([[0, 0.26], [tU, 0.84]], lt); tp = lt > tU ? tU : null;
  } else { sex = wgTalk('_wgs', 'z반짝', t); sm = gfHop(lt, 0.25, 50, 0.4); zex = fEx('z빵긋'); spose = lt > 0.25 && lt < 0.75 ? '만세' : '서기'; ui += wgAt(960, 330, wgBars(1.15), 1, 0) + wgDayDone(lt, Math.max(1.1, D - 0.3), 3, 560, 210);
    w += gfEmote(lt, 0.15, stop[0], stop[1], 'bang', { hold: 0.7 }) + gfEmote(lt, 0.85, stop[0], stop[1], 'idea', { hold: 2 }) + gfPuff(lt, 0.68, sx, y, 0.9); v = wgV([[0, 0.84], [0.3, 1]], lt); tp = lt > 0.3 ? 0.3 : null;
  }
  w = gfActor(WZ, { x: zx, y, s, t, pose: zpose, ex: zex, look: zlook, seed: 3 }) + whHipGourd(zx, y, s, t) + flip(sx, gfActor(WS, { x: sx, y, s, t, pose: spose, ex: sex, look: [-slook[0], slook[1]], seed: 17 }, sm)) + w;
  return gfDefs() + wgTeachSet(t, cam) + qCam(cam, w) + (ph === 2 ? '' : ui) + wgDayChip(3) + wgMoodHud(lt, Math.max(0.32, v), { label: '서윤의 이해', w: 440, tp });
};

/* ===== 35~37: 노래 두드리기 ===== */
wgtapScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 8; let h = gfDefs() + wgLab(t) + wgStudy(lt, a, ph ? -1 : 0.2);
  if (ph === 1) { // 120곡 가운데 3곡
    const tH = whW(a, '절반', 1.3), tN = whW(a, '가운데', 3.6), t3 = whW(a, '단', D - 1.6), hit = [22, 67, 101]; let g = gfPanel(1420, 600, { head: '120곡', headBg: '#BFD7FF', headSize: 40 });
    for (let i = 0; i < 120; i++) { const c = i % 15, r = Math.floor(i / 15), x = -588 + c * 84, yy = -200 + r * 62, k = gfIn(lt, 0.15 + (c + r) * 0.025, 4, 0.5), exp = lt > tH + i * 0.008 && i < 60, fade = gfK(tN, tN + 0.3, lt), isHit = hit.includes(i) && lt > t3 + hit.indexOf(i) * 0.14;
      g += wgAt(x, yy, `<circle r="21" fill="${isHit ? GFC.grass2 : exp ? gfMix(GFC.sun, '#FFF6CC', fade) : '#E6E1D3'}" stroke="${INK}" stroke-width="${isHit ? 6 : 4}"/>` + (isHit ? `<path d="M-9 1 L-2 8 L10 -7" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` : ''), k * (isHit ? gfBeat(lt, t3 + hit.indexOf(i) * 0.14, 0.9, 3, 5) : 1)); }
    h += wgAt(960, 530, g, gfIn(lt, 0.05, 2.8, 0.5));
    hit.forEach((i, n) => { const x = 960 - 588 + (i % 15) * 84, yy = 530 - 200 + Math.floor(i / 15) * 62; h += gfRing(lt, t3 + n * 0.14, x, yy, 20, 110, GFC.grass2, 10, 0.4) + gfStarBurst(lt, t3 + n * 0.14, x, yy, { r1: 90, n: 5, size: 14 }); });
    h += wgAt(0, 0, gfChipAt(lt, tH, 1370, 200, '예상: 절반쯤', { size: 44, bg: GFC.sun, rot: 2 }), gfOut(lt, t3 - 0.1, 0.15)) + gfChipAt(lt, t3 + 0.2, 1370, 200, '실제: 3곡', { icon: 'check', size: 48, bg: '#D9F7DD', rot: 2 });
    return h;
  }
  const y = WH.GY, tx = 620, lx = 1300, s = 0.9, tT = ph ? -9 : whW(a, '두드리고', 4.6), tG = ph ? -9 : whW(a, '맞', D - 1.4), tSong = ph ? whW(a, '노래가', 1.6) : tT, tDot = ph ? whW(a, '똑똑', D - 1.6) : tT + 0.4;
  const tapPh = lt > tT ? ((lt - tT) % 0.36) / 0.36 : 1, tapY = lt > tT ? 26 * Math.abs(Math.sin(Math.PI * tapPh)) : 26, tpose = Object.assign({}, P['서기'], { armR: [[252, 285], [306, 322], [340, 366 - tapY]], hR: [346, 372 - tapY] }), tp = gfHand(tx, y, s, [346, 398]);
  let w = gfActor(WV, { x: tx, y, s, t, pose: tpose, ex: fEx(lt > tSong ? 'z빵긋' : 'z기본'), look: [0.7, 0.2], seed: 32, tilt: lt > tT ? 4 * Math.sin((lt - tT) * Math.PI / 0.36) : 0 }) + flip(lx, gfActor(WV, { x: lx, y, s, t, ex: fEx(lt > tG ? 'z의심' : 'z기본'), look: [0.8, 0.3], pose: lt > tG ? '턱괴기' : '서기', armFront: lt > tG ? 'R' : null, seed: 33 }));
  w += whTable(960, 860);
  if (lt > tT) { const n = Math.floor((lt - tT) / 0.36); w += gfRing(lt, tT + n * 0.36, tp[0], 852, 8, 70, GFC.navy, 7, 0.3); for (let i = 0; i < 3; i++) { const u = ((lt - tDot) / 1.2 + i / 3) % 1; if (lt > tDot) w += wgAt(lerp(tp[0] + 60, lx - 190, u), 800 - 30 * Math.sin(Math.PI * u), gfT(0, 0, '똑', 46, GFC.navy, { sw: 10, stroke: '#fff' }), Math.sin(Math.PI * u)); } }
  let ui = '';
  if (lt > tSong) { let notes = ''; for (let i = 0; i < 4; i++) { const u = ((t * 0.35 + i / 4) % 1); notes += wgAt(-150 + 300 * u, Math.sin(u * 9 + i) * 26, `<g opacity="${f1(Math.sin(Math.PI * u))}">${gfIcon('note', 0.85)}</g>`, 1, Math.sin(u * 6) * 12); }
    ui += wgAt(tx - 30, 330 + Math.sin(t * 2) * 4, bubble(0, 0, 440, 190, notes), gfIn(lt, tSong, 3, 0.42)); }
  if (lt > (ph ? tDot : tG)) ui += wgAt(lx + 40, 330 + Math.sin(t * 2 + 1) * 4, bubble(0, 0, 400, 190, ph ? gfT(0, 22, '똑 · 똑 · 똑', 60, '#8A8FA0') : gfT(0, 30, '?', 96, GFC.grape), { right: true }), gfIn(lt, ph ? tDot : tG, 3, 0.42));
  ui += gfChipAt(lt, ph ? 0.3 : whW(a, '사람은', 2.9), tx - 30, 530, '두드리는 사람', { size: 40, bg: '#BFE8D2', rot: -2 }) + gfChipAt(lt, ph ? 0.5 : whW(a, '사람은', 6.0, 1), lx + 40, 530, '듣는 사람', { size: 40, bg: '#D9C7E8', rot: 2 });
  return h + qCam([960, 600, 1.0], w) + ui;
};

/* ===== 41: 원효 → 소성거사 ===== */
wgnameScene = function (t, lt, a) {
  const D = a._dur || 13, tR = whW(a, '계율', 0.9), tY = whW(a, '요석', 2.2), tS = whW(a, '설총', 4.2), tC = whW(a, '옷을', 6.4), tN = whW(a, '소성', 8.2), tV = whW(a, '마을로', D - 1.4), cam = qLerpCam(lt / D, [960, 600, 1.0], [960, 596, 1.05]), y = WH.GY - 30;
  const lay = lt > tC + 0.12, walking = lt > tV, wx = walking ? lerp(620, 1240, easeInOut(gfK(tV, D + 0.6, lt))) : 620, wk = gfWalk(wx, 0.8), fl = easeInOut(gfK(tN - 0.2, tN + 0.15, lt)), top = gfAbove(wx, y, 0.9, 0, 0);
  let w = gfActor(lay ? WL : WHO, { x: wx, y, s: 0.9, t, pose: walking ? wk.pose : '서기', ex: fEx(walking ? 'z빵긋' : lt > tN ? 'z뿌듯' : lt > tR ? 'z민망' : 'z기본'), look: [0.6, 0], headDy: actNod(lt, tN + 0.3, 1, 10, 0.4), seed: 21 }, walking ? { sy: wk.sy } : gfJelly(lt, tC + 0.12, 0.12)) + gfPuff(lt, tC, wx, y - 200, 1.6) + gfPuff(lt, tC + 0.06, wx, y - 60, 1.3);
  if (walking || lt > tC + 0.5) w += wgAt(...gfHand(wx, y, 0.9, [286, 420]), whGourd(0, 0, 0.9, 8 * Math.sin(lt * 4)), gfIn(lt, tC + 0.5, 3, 0.42));
  w += gfEmote(lt, tR + 0.1, top[0] + 90, top[1] + 60, 'sweat', { hold: 1.2 }) + gfEmote(lt, tV + 0.3, top[0] + 70, top[1], 'note', { hold: 2 });
  // 머리 위 이름표: 뒤집히며 바뀐다
  const tag = (txt, bg) => { const tw = gfTextW(txt, 54) + 80; return `<rect x="${f1(-tw / 2)}" y="-44" width="${f1(tw)}" height="96" rx="24" fill="${GFC.navy}" opacity=".2"/><rect x="${f1(-tw / 2)}" y="-52" width="${f1(tw)}" height="96" rx="24" fill="${bg}" stroke="${INK}" stroke-width="7"/>` + gfT(0, 16, txt, 54, GFC.navy) + `<circle cx="0" cy="-52" r="10" fill="${GFC.coral}" stroke="${INK}" stroke-width="5"/>`; };
  w += `<g transform="translate(${f1(top[0])} ${f1(top[1] - 30 + Math.sin(t * 2.2) * 4)}) scale(${f1(Math.max(0.04, Math.abs(1 - 2 * fl)) * gfBeat(lt, tN + 0.15, 0.2, 3, 5) * 100) / 100} 1)">${fl < 0.5 ? tag('원효', '#fff') : tag('소성거사', GFC.sun)}</g>` + gfStarBurst(lt, tN + 0.15, top[0], top[1] - 30, { r1: 200, n: 8 }) + gfRing(lt, tN + 0.15, top[0], top[1] - 30, 50, 260, GFC.sun);
  let h = gfDefs() + wgSilla(t, cam) + gfLayer(cam, 0.6, wgHut(1560, 800, 1.0)) + qCam(cam, w);
  h += gfChipAt(lt, tR, 1380, 250, '계율을 어김', { icon: 'cross', size: 42, rot: 2 }) + gfChipAt(lt, tY, 1380, 360, '요석공주', { icon: 'heart', size: 42, rot: -2 }) + gfChipAt(lt, tS, 1380, 470, '아들 설총', { icon: 'family', size: 42, rot: 2 }) + gfChipAt(lt, tC + 0.2, 1380, 580, '스님 옷을 벗다', { size: 42, bg: '#E9DDBE', rot: -2 }) + gfChipAt(lt, tN + 0.5, 1380, 690, '스스로 낮춘 이름', { size: 42, bg: GFC.sun, rot: 2 });
  return h;
};

/* ===== 42~43, 46: 목요일 — 틀린 숫자 ===== */
function wgReport(mark) { return gfPanel(420, 520, { bg: '#fff', head: '보고서', headBg: '#BFD7FF' }) + [[-130, 90], [-50, 150], [30, 60], [110, 190]].map(([x, hh], i) => `<rect x="${x}" y="${40 - hh}" width="56" height="${hh}" rx="8" fill="${['#BFD7FF', '#BDE7C9', '#FFC6D9', '#FFE27A'][i]}" stroke="${INK}" stroke-width="5"/>`).join('') + `<path d="M-160 42 H170" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` + [90, 130, 170].map((yy, i) => `<rect x="-150" y="${yy}" width="${[300, 220, 260][i]}" height="16" rx="8" fill="#D5DAE3"/>`).join('') + (mark || ''); }
wgfailScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 3, y = WH.GY, zx = 700, s = 0.95; let cam = qLerpCam(lt / D, [960, 600, 1.0], [960, 600, 1.05]), w = '', ui = '', ex = fEx('z기본'), look = [0.7, -0.2], pose = '서기', m = {}, v = 0.55, tp = null, hurt = false, mark = '', tint = 0, armFront = null;
  const top = gfAbove(zx, y, s, 60, 0);
  if (ph === 0) { const tX = whW(a, '틀렸습니다', D - 1.0); mark = wgAt(40, 20, gfStamp(lt, tX, '틀림!', { size: 110, rot: -12 })); ex = fEx(lt > tX ? 'z충격' : 'z뿌듯'); m = lt > tX ? gfHop(lt, tX + 0.03, 50, 0.38) : {}; v = wgV([[0, 0.6], [tX, 0.12]], lt); tp = lt > tX ? tX : null; hurt = true;
    w += gfEmote(lt, tX + 0.05, top[0], top[1], 'bang', { hold: 1 }); ui += gfChipAt(lt, 0.3, 430, 125, '목요일', { icon: 'calendar', size: 40, rot: -3 });
  } else if (ph === 1) { mark = wgAt(40, 20, gfStamp(lt, -5, '틀림!', { size: 110, rot: -12 })); ex = wgTalk('_wgz', 'z울먹', t, 0.7); pose = '웅크림'; look = [0.1, 0.8]; v = wgV([[0, 0.12], [0.4, 0.04]], lt); tint = gfK(0, 0.5, lt) * 0.2; cam = qLerpCam(lt / D, [860, 640, 1.2], [850, 646, 1.26]);
    w += wgAt(zx, 380 + Math.sin(t * 2) * 5, gfIcon('rain', 3.4), gfIn(lt, 0.15, 3, 0.42)) + gfEmote(lt, 0.4, top[0] + 40, top[1] + 120, 'gloom', { hold: 9 });
    for (let i = 0; i < 6; i++) { const u = ((t * 1.3 + i / 6) % 1); if (lt > 0.4) w += `<line x1="${f1(zx - 70 + i * 28)}" y1="${f1(440 + u * 90)}" x2="${f1(zx - 76 + i * 28)}" y2="${f1(462 + u * 90)}" stroke="#4DA8FF" stroke-width="6" stroke-linecap="round" opacity="${f1(1 - u)}"/>`; }
  } else { const tFx = whW(a, '고치자', 1.2), tOk = whW(a, '틀릴', 2.6), up = lt > tFx, tE = Math.max(tOk + 0.5, D - 0.3); ex = wgTalk('_wgz', lt > tOk ? 'z빵긋' : up ? 'z결심' : 'z울먹', t); pose = up ? (lt > tOk ? Object.assign({}, P['서기'], { armL: [[148, 285], [130, 330], [176, 344]], hL: [184, 346] }) : '서기') : '웅크림'; armFront = null; look = up ? [0.6, -0.1] : [0.1, 0.6]; m = up ? gfM(gfHop(lt, tFx + 0.02, 34, 0.34), gfJelly(lt, tOk, 0.06)) : {};
    mark = lt > tFx + 0.35 ? wgAt(110, -150, gfIcon('check', 2.2), gfIn(lt, tFx + 0.35, 3.4, 0.4)) : wgAt(40, 20, gfStamp(lt, -5, '틀림!', { size: 110, rot: -12 }), gfOut(lt, tFx + 0.15, 0.2)); v = wgV([[0, 0.04], [tFx, 0.34], [tOk, 0.62]], lt); tp = lt > tOk ? tOk : (lt > tFx ? tFx : null); tint = 0.2 * (1 - gfK(tFx, tFx + 0.5, lt));
    if (!up) w += wgAt(zx, 380 + Math.sin(t * 2) * 5, gfIcon('rain', 3.4)); w += gfPuff(lt, tFx, zx, 380, 1.5) + gfEmote(lt, tOk + 0.1, top[0], top[1], 'heart', { hold: 1.8 }) + gfRing(lt, tFx + 0.35, 1490, 330, 30, 170, GFC.grass2) + gfStarBurst(lt, tFx + 0.35, 1490, 330, { r1: 150, n: 6 });
    ui += wgDayDone(lt, tE, 4);
  }
  const body = gfActor(WZ, { x: zx, y, s, t, pose, armFront, ex, look, seed: 3 }, m) + whHipGourd(zx, y + (m.dy || 0) + (pose === '웅크림' ? 28 : 0), s, t);
  return gfDefs() + wgOffice(t, cam) + qCam(cam, wgAt(1380, 480 + Math.sin(t * 1.8) * 4, wgReport(mark), gfIn(lt, ph ? -9 : 0.5, 2.8, 0.5), 3) + body + w) + wgTint('#27335F', tint) + ui + wgDayChip(4) + wgMoodHud(lt, v, { tp, hurt });
};

/* ===== 44~45: 자책하지 말라는 짧은 글 ===== */
wgkindScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 9; let h = gfDefs() + wgLab(t) + wgStudy(lt, a, ph ? -1 : 0.2);
  const tLow = ph ? -9 : whW(a, '점수가', 3.6), tOne = ph ? -9 : whW(a, '한쪽에만', 5.6), tNote = ph ? -9 : whW(a, '자책', 6.8), tB = ph ? whW(a, '학생들은', 2.0) : 99, t15 = ph ? whW(a, '배쯤', D - 2.2) : 99;
  h += `<path d="M960 220 V1010" stroke="${INK}" stroke-width="6" stroke-dasharray="6 18" stroke-linecap="round" opacity=".3"/>`;
  [[500, 1, '#BFE8D2'], [1420, 0, '#D9C7E8']].forEach(([cx, kind, col], g) => {
    [-135, 135].forEach((dx, i) => { const x = cx + dx, st = ph && kind && lt > tB;
      h += gfBlob(x, 1016, 74) + WV(col, { x, y: 1016, s: 0.8, t, pose: st ? '책상' : '서기', ex: fEx(st ? 'z결심' : (kind && lt > tNote + 0.6) ? 'z설렘' : lt > tLow ? 'z울먹' : 'z기본'), look: [0, 0.4], seed: 50 + g * 2 + i, hair: ['#4A3A30', '#2E2A33', '#7A4A32', '#5A4130'][g * 2 + i] });
      if (!ph) h += wgAt(x + 6, 540 + Math.sin(t * 2 + i) * 4, whPaper(0, 0, 0.72, i ? 6 : -6, true), gfIn(lt, tLow + i * 0.12 + g * 0.2, 3.2, 0.42)); });
    if (!ph) { if (kind) { const k = gfK(tOne, tOne + 0.6, lt); if (k > 0) h += wgAt(cx, lerp(60, 380, easeOut(k)), gfIcon('letter', 3), 1, Math.sin(lt * 4) * 5) + gfRing(lt, tOne + 0.6, cx, 380, 40, 240, GFC.berry); h += gfChipAt(lt, tNote, cx, 235, '“너무 자책하지 마”', { icon: 'heart', size: 48, bg: '#FFE3EC', rot: -2 }); } else h += gfChipAt(lt, tNote + 0.4, cx, 235, '글 없음', { size: 48, bg: '#EEE', rot: 2 }); }
    else { const L = kind ? 1.5 : 1, k = easeOut(gfK(tB + (kind ? 0.5 : 0), tB + (kind ? 1.6 : 0.8), lt)), bw = 300 * L * k;
      h += wgAt(cx - 300, 480, wgAt(-8, 0, gfIcon('clock', 1.6)) + `<rect x="56" y="-30" width="${f1(Math.max(46, bw))}" height="60" rx="30" fill="${kind ? GFC.berry : '#B9C2CF'}" stroke="${INK}" stroke-width="7"/><rect x="80" y="-16" width="${f1(Math.max(0, bw - 66))}" height="11" rx="5" fill="#fff" opacity=".5"/>`, gfIn(lt, tB - 0.2, 3, 0.45));
      h += gfChipAt(lt, tB - 0.1, cx, 365, kind ? '글을 읽은 쪽' : '글 없음', { icon: kind ? 'letter' : null, size: 44, bg: kind ? '#FFE3EC' : '#EEE' });
      if (kind) h += gfPlus(lt, t15, cx + 330, 420, '1.5배!', { size: 80, col: GFC.berry, d: 9 }) + gfStarBurst(lt, t15, cx + 260, 480, { r1: 200, n: 8 }) + gfRing(lt, t15, cx + 230, 480, 40, 260, GFC.berry); }
  });
  if (ph) h += gfChipAt(lt, tB - 0.2, 960, 235, '다음 시험 공부 시간', { size: 46, bg: '#fff' });
  return h;
};

/* ===== 47: 떠난 길도, 돌아온 길도 ===== */
wgroadsScene = function (t, lt, a) {
  const D = a._dur || 13, tU = whW(a, '의상은', 3.0), tGo = whW(a, '올랐고', 4.6), tBk = whW(a, '돌아와', 7.2), tT = whW(a, '스승', 8.6), tL = whW(a, '떠난', 10.2), tR = whW(a, '돌아온', 11.2), cam = qLerpCam(lt / D, [960, 600, 1.0], [960, 600, 1.05]), y = WH.GY - 86;
  const out = easeIn(gfK(tGo, tGo + 1.8, lt)), back = easeOut(gfK(tBk - 0.9, tBk + 0.5, lt)), shipX = lerp(1790, 2700, out) - (2700 - 1790) * back, home = lt > tBk + 0.5, onShip = lt > tU - 0.3 && !home;
  const rider = onShip ? UIS({ x: -40, y: -36, s: 0.6, t, ex: fEx(lt > tBk - 0.9 ? 'z빵긋' : 'z결심'), look: [lt > tBk - 0.9 ? -0.8 : 0.8, 0], pose: '서기', seed: 5 }) : '';
  let w = wgSign(1010, y + 6) + wgAt(1150, y - 250, gfIcon('star', 0.9), gfIn(lt, tL, 3.6, 0.4)) + wgAt(870, y - 166, gfIcon('star', 0.9), gfIn(lt, tR, 3.6, 0.4)) + gfRing(lt, tL, 1150, y - 250, 16, 110, GFC.sun) + gfRing(lt, tR, 870, y - 166, 16, 110, GFC.sun);
  if (!onShip) w += gfActor(UIS, { x: home ? 1480 : 1300, y, s: 0.78, t, pose: home ? '손인사' : '서기', look: [home ? -0.8 : 0.8, 0], ex: fEx(home ? 'z빵긋' : 'z결심'), seed: 5 }, home ? gfHop(lt, tBk + 0.55, 36, 0.36) : {}) + (home ? wgAt(1480, y - 500 + Math.sin(t * 2.2) * 4, gfChip('신라의 큰 스승', { icon: 'scroll', size: 40, bg: GFC.sun }), gfIn(lt, tT, 3.2, 0.42), 3) + gfStarBurst(lt, tT, 1480, y - 500, { r1: 200, n: 8 }) : '');
  w += gfActor(WHO, { x: 700, y, s: 0.8, t, pose: lt > tGo && lt < tGo + 2 || home ? '손인사' : '서기', look: [0.8, -0.1], ex: fEx(home || lt > tGo ? 'z빵긋' : 'z기본'), seed: 6 }, gfHop(lt, tR + 0.1, 30, 0.34));
  let h = gfDefs() + wgCoast(t, cam, { shipX, rider, sky: 'gfDawn' }) + qCam(cam, w);
  h += wgAt(0, 0, gfChipAt(lt, 0.3, 960, 150, '마음먹기 = 만능?', { size: 48, bg: '#fff', rot: -2 }), gfOut(lt, tU - 0.2, 0.15)) + wgAt(1180, 150, gfIcon('cross', 1.6), gfIn(lt, 1.1, 3.6, 0.4) * gfOut(lt, tU - 0.2, 0.15), 8);
  return h + gfChipAt(lt, tR + 0.5, 960, 150, '떠난 길도 · 돌아온 길도', { icon: 'star', size: 46, bg: GFC.sun, rot: -2 });
};

/* ===== 48: 버거운 날엔 도와 달라고 ===== */
wghelpScene = function (t, lt, a) {
  const D = a._dur || 7, tH = whW(a, '버거운', 1.2), tA = whW(a, '도와', D - 2.6), tO = whW(a, '괜찮습니다', D - 0.9), cam = qLerpCam(lt / D, [960, 610, 1.04], [960, 610, 1.1]), y = WH.GY, zx = 960, s = 0.95;
  const come = easeOut(gfK(tA + 0.5, tO, lt)), lift = gfIn(lt, tO, 2.6, 0.45), press = gfIn(lt, tH, 2.4, 0.5) * (1 - 0.7 * Math.min(1, lift)), rockY = 500 + 26 * press - 60 * Math.min(1.2, lift), tr = Math.sin(t * 38) * 3 * press * (lift > 0.5 ? 0 : 1);
  const up = { armL: [[148, 285], [112, 232], [124, 176]], hL: [126, 166], armR: [[252, 285], [288, 232], [276, 176]], hR: [274, 166] };
  let w = '';
  if (come > 0) w += gfActor(WB, { x: lerp(2200, 1260, come), y, s: 0.92, t, pose: come >= 1 ? Object.assign({}, P['서기'], { armL: [[148, 285], [100, 240], [70, 180]], hL: [64, 170] }) : walkPose(t * 9, 0.8), ex: fEx('z빵긋'), look: [-0.7, -0.4], seed: 8 }, lift > 0.1 ? gfHop(lt, tO, 20, 0.3) : {}) + gfActor(WM, { x: lerp(-300, 660, come), y, s: 0.92, t, pose: come >= 1 ? Object.assign({}, P['서기'], { armR: [[252, 285], [300, 240], [330, 180]], hR: [336, 170] }) : walkPose(t * 9, 0.8), ex: fEx('z빵긋'), look: [0.7, -0.4], seed: 14 }, lift > 0.1 ? gfHop(lt, tO + 0.05, 20, 0.3) : {});
  w += gfActor(WZ, { x: zx + tr, y, s, sy: 1 - 0.09 * press, t, pose: Object.assign({}, P['서기'], up), ex: fEx(lift > 0.5 ? 'z빵긋' : lt > tH ? 'z울먹' : 'z기본'), look: [0, -0.6], seed: 3 }) + whHipGourd(zx, y, s, t);
  w += wgAt(zx + tr, rockY + (1 - Math.min(1, gfK(tH - 0.35, tH, lt))) * -700, `<path d="M-250 60 Q-290 -60 -170 -120 Q-60 -190 80 -150 Q240 -130 262 -10 Q280 70 190 90 L-190 90 Q-240 90 -250 60 Z" fill="#A9B2C0" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M-170 -60 Q-110 -110 -40 -110 M90 -90 Q150 -70 180 -30" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".4"/>` + gfT(0, 30, '버거운 날', 70, GFC.navy));
  w += gfPuff(lt, tH, zx, y, 1.4) + gfEmote(lt, tH + 0.2, zx + 190, y - 330, 'sweat', { hold: tA - tH });
  w += wgAt(zx + 340, 640 + Math.sin(t * 2.4) * 4, wgBub(330, 120, gfT(0, 20, '도와주세요…', 48, GFC.navy), { tail: -1 }), gfIn(lt, tA, 3.2, 0.42) * gfOut(lt, tA + 0.95, 0.2)) + gfEmote(lt, tO + 0.3, zx, 190, 'heart', { hold: 2 }) + gfStarBurst(lt, tO, zx, rockY, { r0: 200, r1: 480, n: 10, size: 26 });
  return gfDefs() + wgMeetSet(t, cam) + qCam(cam, w) + wgMoodHud(lt, wgV([[0, 0.4], [tH, 0.05], [tO, 0.56]], lt), { tp: lt > tO ? tO : (lt > tH ? tH : null), hurt: lt < tO });
};

/* ===== 49: 정리 ===== */
wgrecapScene = function (t, lt, a) {
  const D = a._dur || 11, ts = [whW(a, '붙이기', 2.9) - 0.4, whW(a, '반대편', 4.0), whW(a, '누구나', 6.4), whW(a, '품어', D - 0.9)], rows = ['같은 일에 다른 이름', '반대편이 맞을 이유', '누구나 아는 말로', '넘어진 나 품어 주기'];
  let h = gfDefs() + gfFull('url(#gfDay)') + gfRays(t, 960, 1200, 1700, '#fff', 16, 0.28, 6) + gfClouds(t, 40, 3, 7, 14, 0.9) + gfHill(1010, 60, 900, '#8ADB6A', 0, '#4FA85A');
  h += wgAt(1120, 490 + Math.sin(t * 1.6) * 3, gfQuest(lt, rows.map((tx, i) => ({ text: tx, t0: 0.3 + i * 0.12, done: ts[i] + 0.25, tag: `${i + 1}일 차`, tagBg: ['#FFE27A', '#BDE7C9', '#BFD7FF', '#FFC6D9'][i] })), { w: 900, rh: 112, size: 54, head: '원효의 생각 넷', headBg: '#BDE7C9' }), gfIn(lt, 0.1, 2.8, 0.5), 1);
  ts.forEach((tk, i) => { h += gfRing(lt, tk + 0.25, 729, 301 + i * 112, 20, 130, GFC.grass2, 10, 0.4) + gfStarBurst(lt, tk + 0.25, 729, 301 + i * 112, { r1: 120, n: 5, size: 16 }); });
  const hop = gfM(...ts.map(tk => gfHop(lt, tk + 0.25, 44, 0.38)));
  return h + gfActor(Z, { t, seed: 9, x: 330, y: 1040, s: 0.74, ex: fEx('z빵긋'), look: [0.7, -0.3], pose: hop.air > 0.2 ? '만세' : '서기' }, hop) + whHipGourd(330, 1040 + hop.dy, 0.74, t);
};

/* ===== 50~55: 다음 월요일, 같은 문 앞 ===== */
function wgCooler(x, y) { return wgAt(x, y, `<rect x="-70" y="-300" width="140" height="300" rx="18" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="-52" y="-190" width="104" height="80" rx="10" fill="#E8EEF5" stroke="${INK}" stroke-width="5"/><rect x="-34" y="-176" width="20" height="30" rx="5" fill="#5BB8FF" stroke="${INK}" stroke-width="4"/><rect x="14" y="-176" width="20" height="30" rx="5" fill="${GFC.coral}" stroke="${INK}" stroke-width="4"/><path d="M-56 -300 L-48 -440 Q0 -470 48 -440 L56 -300 Z" fill="#BFE6FF" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-30 -420 Q-34 -370 -30 -320" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".7"/>`); }
function wgDoorSign(x, y, s, k) { return wgAt(x, y, `<rect x="-350" y="-150" width="700" height="290" rx="30" fill="#F2FFF4" stroke="${INK}" stroke-width="12"/>` + wgAt(-250, 0, gfIcon('ball', 1.5)) + gfT(60, 28, '오늘의 연습 경기', 70, '#1F9D61') + `<path d="M-150 76 Q60 100 280 76" stroke="#1F9D61" stroke-width="8" fill="none" stroke-linecap="round"/>`, s * k, -3); }
wgendScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 3, y = WH.GY, s = 0.95, cx0 = 990; let cam = [820, 590, 1.0], zx = 800, sx = 1330, w = '', ui = '', zex = fEx('z기본'), sex = fEx('z멍'), zlook = [0.8, 0.2], slook = [-0.8, 0.2], zpose = P['서기'], spose = P['서기'], zm = {}, sm = {}, vz = 0.22, vs = 0.1, tz = null, tsv = null, showS = ph >= 2, sign = 0, open = 0, glow = 0, zop = 1, sop = 1, gourdHand = false, horn = 0, grot = 0;
  const ztop = () => gfAbove(zx, y, s, 60, 0), stopp = () => gfAbove(sx, y, s, -50, 0);
  if (ph === 0) { // 정수기 물을 표주박에 받아 한 모금
    const sip = easeInOut(gfK(1.7, 2.2, lt)); cam = qLerpCam(lt / D, [860, 620, 1.14], [870, 626, 1.22]); gourdHand = true; zlook = sip > 0.5 ? [0.3, -0.3] : [0.8, 0.5];
    zpose = Object.assign({}, P['서기'], { armR: [[252, 285], [lerp(306, 296, sip), lerp(318, 262, sip)], [lerp(352, 262, sip), lerp(330, 232, sip)]], hR: [lerp(360, 256, sip), lerp(332, 226, sip)] }); zex = fEx(sip > 0.9 ? '잠' : 'z기본'); grot = 118 * sip;
    if (lt > 0.35 && lt < 1.5) { const g = gfHand(zx, y, s, zpose.hR); w += `<path d="M${cx0 - 24} ${y - 150} Q${f1((cx0 - 24 + g[0]) / 2 - 10)} ${f1(y - 150)} ${f1(g[0] + 4)} ${f1(g[1] - 30)}" fill="none" stroke="#5BB8FF" stroke-width="10" stroke-linecap="round" stroke-dasharray="14 10" stroke-dashoffset="${f1(-t * 160)}"/>`; }
    vz = wgV([[0, 0.2]], lt);
  } else if (ph === 1) { zex = wgTalk('_wgz', 'z히죽', t); cam = qLerpCam(lt / D, [820, 640, 1.45], [820, 646, 1.52]); zlook = [0.2, 0.5]; gourdHand = true; zpose = Object.assign({}, P['서기'], { armR: [[252, 285], [296, 300], [300, 350]], hR: [302, 358] }); vz = wgV([[0, 0.2], [0.5, 0.4]], lt); tz = lt > 0.5 ? 0.5 : null; w += gfEmote(lt, 0.6, ztop()[0], ztop()[1], 'note', { hold: 1.4 });
  } else if (ph === 2) { const k = easeOut(gfK(0, 0.9, lt)); sx = lerp(2150, 1330, k); const wk = gfWalk(sx, 0.7); spose = k < 1 ? wk.pose : P['서기']; sex = k < 1 ? fEx('z멍') : wgTalk('_wgs', 'z울먹', t); zlook = [0.9, 0]; horn = gfIn(lt, 1.2, 3, 0.4) * 0.8; vz = 0.4; vs = wgV([[0.9, 0.1], [1.4, 0.06]], lt);
    w += gfEmote(lt, 0.95, stopp()[0], stopp()[1], 'gloom', { hold: 9 }) + gfEmote(lt, Math.max(1.6, D - 0.6), ztop()[0], ztop()[1], 'bang', { hold: 0.9, s: 0.8 }); cam = qLerpCam(lt / D, [900, 590, 1.0], [920, 590, 1.04]);
  } else if (ph === 3) { const tS = whW(a, '연습', 1.6); zex = wgTalk('_wgz', 'z빵긋', t); zpose = Object.assign({}, P['서기'], { armL: [[148, 285], [96, 262], [50, 236]], hL: [42, 232] }); zlook = [0.8, 0]; sex = fEx(lt > tS ? 'z의심' : 'z울먹'); slook = lt > tS ? [-1, -0.2] : [-0.8, 0.2]; sign = gfIn(lt, tS, 3, 0.42); vz = 0.42; vs = 0.06; cam = qLerpCam(gfK(tS - 0.1, tS + 0.7, lt), [900, 590, 1.0], [640, 580, 1.2]);
    horn = 0.8 * gfOut(lt, tS, 0.2); w += gfStarBurst(lt, tS, 230, 560, { r0: 80, r1: 300, n: 9 }) + gfRing(lt, tS, 230, 560, 60, 320, '#fff', 14, 0.45); if (lt <= tS) w += gfEmote(lt, -9, stopp()[0], stopp()[1], 'gloom', { hold: 99 });
  } else if (ph === 4) { sign = 1; sex = wgTalk('_wgs', 'z설렘', t, 0.8); zex = fEx('z빵긋'); cam = qLerpCam(lt / D, [1240, 640, 1.38], [1230, 646, 1.46]); vs = wgV([[0, 0.06], [0.45, 0.5]], lt); tsv = lt > 0.45 ? 0.45 : null; vz = wgV([[0, 0.42], [0.7, 0.6]], lt); tz = lt > 0.7 ? 0.7 : null; slook = [-0.8, -0.1];
    w += gfEmote(lt, 0.6, (zx + sx) / 2, y - 560, 'heart', { hold: 1.6 }) + gfEmote(lt, 0.3, stopp()[0], stopp()[1], 'spark', { hold: 1.6 });
  } else { // 문이 열리고, 둘이 빛 앞에 나란히 선다. 마지막 말이 끝날 때 들어간다
    const tG = whW(a, '건넬', D - 1.4), ks = easeInOut(gfK(0.9, 3.3, lt)), kz = easeInOut(gfK(1.9, 4.4, lt)), inn = easeInOut(gfK(tG + 0.9, D + 0.35, lt));
    sign = 1; open = easeInOut(gfK(0.4, 1.2, lt)); glow = open; sx = lerp(1330, 500, ks) - 190 * inn; zx = lerp(800, 700, kz) - 300 * inn; const wz = gfWalk(zx, 0.75), wsk = gfWalk(sx, 0.75);
    zpose = (kz > 0 && kz < 1) || inn > 0 ? wz.pose : (lt < 1.9 ? '손인사' : P['서기']); spose = (ks > 0 && ks < 1) || inn > 0 ? wsk.pose : P['서기']; zex = fEx('z빵긋'); sex = fEx(lt > tG ? 'z빵긋' : 'z설렘'); zlook = [-0.8, 0]; slook = [-0.8, -0.1];
    zop = 1 - gfK(0.5, 1, inn); sop = 1 - gfK(0.35, 0.9, inn); vz = wgV([[0, 0.6], [tG, 0.8]], lt); vs = wgV([[0, 0.5], [tG + 0.2, 0.78]], lt); tz = lt > tG ? tG : null; tsv = lt > tG + 0.2 ? tG + 0.2 : null; cam = qLerpCam(lt / D, [860, 590, 1.0], [620, 590, 1.16]);
    w += gfEmote(lt, tG, (zx + sx) / 2 + 20, y - 560, 'heart', { hold: 2.2, s: 1.2 }) + gfEmote(lt, 3.5, sx - 60, y - 520, 'spark', { hold: 1.6 });
    ui += gfRing(lt, tG, 1560, 194, 40, 280, GFC.berry, 14, 0.5) + wgAt(1330, 194, gfIcon('heart', 1.2), gfIn(lt, tG, 3.4, 0.4) * gfOut(lt, tG + 1.6, 0.3));
  }
  // 무대: 문 세트 + 정수기 + 문에 붙인 이름 + 열린 문의 빛
  let set = wgDoorSet(t, cam, { fri: 0, horn, lt });
  let mid = wgCooler(cx0, 900);
  if (open > 0) mid += `<rect x="80" y="310" width="300" height="590" rx="12" fill="#FFF6D6" opacity="${f1(open)}"/><circle cx="230" cy="620" r="${f1(520 * open)}" fill="url(#gfGlow)" opacity="${f1(0.9 * glow)}"/><path d="M80 310 L${f1(80 - 70 * open)} 334 L${f1(80 - 70 * open)} 924 L80 900 Z" fill="${GFC.wood2}" stroke="${INK}" stroke-width="8" stroke-linejoin="round" opacity="${f1(open)}"/>`;
  if (sign > 0) mid += wgDoorSign(230, lerp(560, 222, open), lerp(0.56, 0.5, open), sign);   // 문이 열리면 이름표가 문틀 위로 올라가 방의 새 이름이 된다
  const zb = `<g opacity="${f1(zop)}">` + gfActor(WZ, { x: zx, y, s, t, pose: zpose, ex: zex, look: zlook, seed: 3 }, zm) + (gourdHand ? wgAt(...gfHand(zx, y, s, zpose.hR), whGourd(0, -4, 0.62, grot)) : whHipGourd(zx, y, s, t)) + `</g>`;
  const sb = showS ? `<g opacity="${f1(sop)}">` + flip(sx, gfActor(WS, { x: sx, y, s: 0.92, t, pose: spose, ex: sex, look: [-slook[0], slook[1]], seed: 17 }, sm)) + `</g>` : '';
  const face = ph === 5 ? flip(zx, zb) : zb;
  let h = gfDefs() + set + qCam(cam, mid + sb + face + w) + wgTint('#5B4FCF', ph <= 2 ? 0.1 : 0.1 * (1 - sign)) + wgTint('#FFC36B', 0.14 * glow) + ui;
  h += wgMoodHud(lt, vz, { label: '제로', tp: tz, x: 1560, y: 118 }) + (showS && (ph > 2 || lt > 0.9) ? wgMoodHud(lt, vs, { label: '서윤', tp: tsv, x: 1560, y: 268, t0: ph === 2 ? 0.9 : null }) : '');
  return h;
};

/* ===== 56: 끝 질문 ===== */
wgaskScene = function (t, lt, a) {
  let h = gfDefs() + gfFull('url(#gfDay)') + gfRays(t, 960, 1200, 1700, '#fff', 16, 0.3, 6) + gfClouds(t, 40, 4, 7, 16, 0.9) + gfHill(1010, 60, 900, '#8ADB6A', 0, '#4FA85A');
  h += gfBounceText(lt, 0.2, 960, 300, [['이번 주, 어떤 일에', WHITE]], { size: 104, sw: 22, wave: 3 }) + gfBounceText(lt, 0.9, 960, 450, [['다른 이름', GFC.sun], ['을 붙여 보고 싶나요?', WHITE]], { size: 104, sw: 22, wave: 3 });
  const blink = Math.floor(t * 2.2) % 2 === 0;
  h += wgAt(960, 700 + Math.sin(t * 2) * 5, `<rect x="-380" y="-96" width="760" height="200" rx="34" fill="${GFC.navy}" opacity=".22" transform="translate(0 12)"/><rect x="-380" y="-106" width="760" height="200" rx="34" fill="#F2FFF4" stroke="${INK}" stroke-width="10"/>` + gfT(-300, 28, '오늘의', 84, '#1F9D61', { anchor: 'start' }) + `<path d="M0 48 H320" stroke="#1F9D61" stroke-width="10" stroke-linecap="round" stroke-dasharray="2 22"/>` + (blink ? `<rect x="8" y="-52" width="12" height="92" rx="6" fill="#1F9D61"/>` : ''), gfIn(lt, 1.6, 2.8, 0.45), -2);
  const hz = gfM(gfHop(lt, 1.9, 44, 0.4), gfHop(lt, 3.3, 44, 0.4)), hs = gfM(gfHop(lt, 2.2, 40, 0.4), gfHop(lt, 3.6, 40, 0.4));
  h += gfActor(Z, { t, seed: 9, x: 330, y: 1050, s: 0.7, ex: fEx('z빵긋'), look: [0.6, -0.4], pose: '손인사' }, hz) + whHipGourd(330, 1050 + hz.dy, 0.7, t) + flip(1600, gfActor(WS, { x: 1600, y: 1050, s: 0.68, t, ex: fEx('z빵긋'), look: [0.6, -0.4], pose: '손인사', seed: 17 }, hs));
  return h + gfTwinkle(t, 520, 620, 22, 1, '#fff') + gfTwinkle(t, 1400, 640, 18, 2.6, GFC.sun);
};
