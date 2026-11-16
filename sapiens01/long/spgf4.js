/* 사피엔스 편 3막·엔딩 — b1~b5 상상의 질서와 상자 탈출(와이드 줌아웃), a1~a5 AI 손·진짜 질문·국밥, e1~e4 노을 산책과 빈칸 질문.
   "점선 = 허구, 실선 = 진짜": 점수판·시선·동전·트로피는 점선 상자 안, 밥·친구·노을·하트는 실선. spgf3.js 다음에 읽는다. */
['spbox', 'spai', 'spend'].forEach(k => CAMS[k] = 'fixed');
Object.assign(QBG, { meadow: 'ai/meadow_wide.jpg', sunset: 'ai/meadow_sunset.jpg' });
const SPB = { X0: 610, X1: 1310, Y0: 330, FY: 850 };   // 점선 상자(미니게임판). 오른쪽 벽에 문
function spBoxWalls(run, o = {}) {
  const { X0, X1, Y0, FY } = SPB, dg = o.door == null ? 0 : o.door, off = f1(-run * 40);
  let s = `<rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${FY - Y0}" rx="20" fill="#FFF8E6" fill-opacity="${o.fill == null ? 0.55 : o.fill}"/>`;
  const seg = (d, c, w) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-dasharray="26 18" stroke-dashoffset="${off}" stroke-linecap="round"/>`;
  const d = `M${X1} ${FY - 220} L${X1} ${Y0 + 20} Q${X1} ${Y0} ${X1 - 20} ${Y0} L${X0 + 20} ${Y0} Q${X0} ${Y0} ${X0} ${Y0 + 20} L${X0} ${FY} L${X1} ${FY}`;
  s += seg(d, '#fff', 16) + seg(d, INK, 7);
  if (dg > 0.01) s += `<path d="M${X1} ${FY} L${X1} ${FY - 220} L${f1(X1 + 120 * dg)} ${f1(FY - 236 + 10 * dg)} L${f1(X1 + 120 * dg)} ${f1(FY + 14 * dg)} Z" fill="#FFE9A8" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><circle cx="${f1(X1 + 100 * dg)}" cy="${FY - 100}" r="7" fill="${INK}"/>` +
    `<rect x="${X1 - 6}" y="${FY - 220}" width="12" height="220" fill="#FFF3C4" opacity="${f1(dg * 0.8 * 100) / 100}"/>`;
  else s += seg(`M${X1} ${FY} L${X1} ${FY - 220}`, '#fff', 16) + seg(`M${X1} ${FY} L${X1} ${FY - 220}`, INK, 7);
  return s;
}
/* 비교 점수판(점선 테두리 = 허구) + 시선 눈 */
function spScore(t, k, x, y) { if (k < 0.02) return ''; const rows = [['1위', '남들', 0.95], ['2위', '남들', 0.86], ['…', '', 0], ['37위', '제로', 0.22]];
  let s = `<rect x="-200" y="-150" width="400" height="300" rx="20" fill="#fff" stroke="${INK}" stroke-width="7" stroke-dasharray="18 10"/>` + gfT(0, -104, '비교 점수판', 34, GFC.navy);
  rows.forEach(([r, n, v], i) => { const yy = -54 + i * 52; s += gfT(-150, yy + 12, r, 28, i === 3 ? GFC.coral : GFC.navy, { anchor: 'start' }) + (n ? gfT(-70, yy + 12, n, 26, '#7A8094', { anchor: 'start' }) + `<g transform="translate(10 ${yy})">${gfBar(160, v, { h: 20, col: i === 3 ? GFC.coral : GFC.sky })}</g>` : ''); });
  return fkAt(x, y + Math.sin(t * 2) * 6, s, k); }
const spEye = (x, y, k, t, i) => k < 0.02 ? '' : fkAt(x + Math.sin(t * 1.3 + i) * 14, y + Math.cos(t * 1.1 + i * 2) * 10, `<ellipse rx="46" ry="30" fill="#fff" stroke="${INK}" stroke-width="6" stroke-dasharray="12 8"/><circle cx="${f1(Math.sin(t * 2 + i) * 10)}" cy="2" r="15" fill="${INK}"/><circle cx="${f1(Math.sin(t * 2 + i) * 10 + 5)}" cy="-4" r="5" fill="#fff"/>`, k);
const spNag = (x, y, txt, k, t, rot = 0) => k < 0.02 ? '' : fkAt(x, y + Math.sin(t * 2.4 + x) * 5, (() => { const w = gfTextW(txt, 34) + 60; return `<rect x="${f1(-w / 2)}" y="-38" width="${f1(w)}" height="76" rx="38" fill="#FFE1E1" stroke="${INK}" stroke-width="6" stroke-dasharray="16 10"/><path d="M-20 36 L-36 66 L4 36 Z" fill="#FFE1E1" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` + gfT(0, 12, txt, 34, '#C2333A'); })(), k, rot);
/* 함무라비(돌판, 계단 위 크기가 다른 사람들) · 독립선언문(두루마리, 나란히 같은 사람들) — 실제 문서 글자 없이 */
function spTablet(t, k, hi, rv = 1) { if (k < 0.02) return ''; const fig = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cy="-58" r="20" fill="${c}" stroke="#6E6658" stroke-width="5"/><path d="M-20 -34 Q0 -42 20 -34 L24 10 L-24 10 Z" fill="${c}" stroke="#6E6658" stroke-width="5"/></g>`;
  let s = `<path d="M-190 -250 Q0 -330 190 -250 L190 250 L-190 250 Z" fill="#C9C2B4" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-160 -220 Q0 -290 160 -220 L160 220 L-160 220 Z" fill="none" stroke="#A39B8C" stroke-width="5"/>`;
  s += `<clipPath id="spCarve"><rect x="-200" y="-260" width="400" height="${f1(520 * rv)}"/></clipPath><g clip-path="url(#spCarve)">` + `<path d="M-130 180 h80 v-70 h80 v-70 h80 v-70 h60" fill="none" stroke="#8E8676" stroke-width="10" stroke-linejoin="round"/>` + fig(-90, 168, 0.8, '#B5AD9E') + fig(-10, 98, 1.0, '#B5AD9E') + fig(80, 28, 1.25, '#B5AD9E');
  s += `<g transform="translate(110 -170)">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="0" y1="-28" x2="0" y2="-44" stroke="#8E8676" stroke-width="6" stroke-linecap="round" transform="rotate(${i * 45})"/>`).join('')}<circle r="22" fill="#B5AD9E" stroke="#6E6658" stroke-width="5"/></g>`;
  s += `</g>` + (rv < 1 && rv > 0 ? `<g transform="translate(${f1(-150 + 300 * ((rv * 7) % 1))} ${f1(-250 + 500 * rv)}) rotate(-30)"><rect x="-6" y="-50" width="12" height="60" fill="#9AA0A8" stroke="${INK}" stroke-width="4"/><rect x="-14" y="-80" width="28" height="34" rx="4" fill="#A9743F" stroke="${INK}" stroke-width="4"/></g>` : '');
  if (hi) s += `<path d="M-130 180 h80 v-70 h80 v-70 h80 v-70 h60" fill="none" stroke="#FFC85A" stroke-width="6" opacity="${f1(hi * 100) / 100}"/>`;
  return s; }
function spScroll(t, k, hi, rv = 1) { if (k < 0.02) return ''; const R = Math.max(0.04, rv); const fig = (x, c) => `<g transform="translate(${x} 120)"><circle cy="-58" r="22" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M-22 -32 Q0 -40 22 -32 L26 12 L-26 12 Z" fill="${c}" stroke="${INK}" stroke-width="5"/></g>`;
  let s = `<g transform="scale(1 ${f1(R * 100) / 100})"><rect x="-180" y="-230" width="360" height="460" fill="#F6E7C4" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 4; i++) s += `<path d="M-130 ${-170 + i * 34} h260" stroke="#CDB68A" stroke-width="8" stroke-linecap="round"/>`;
  const b = hi ? Math.abs(Math.sin(t * 6)) * 10 * hi : 0;
  s += `<g transform="translate(0 ${f1(-b)})">${fig(-100, '#FFB3B3') + fig(0, '#9ED8FF') + fig(100, '#B8E6A8')}</g><path d="M-100 104 h200" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity=".5"/></g>`;
  s += `<rect x="-200" y="${f1(-262 * R)}" width="400" height="44" rx="22" fill="#E3CDA0" stroke="${INK}" stroke-width="7"/><rect x="-200" y="${f1(218 * R)}" width="400" height="44" rx="22" fill="#E3CDA0" stroke="${INK}" stroke-width="7"/>`;
  return s; }
function spboxScene(t, lt, a) {
  const ph = a.ph, run = a._run; let w = '', hud = '', cam = [960, 560, 1.0], plate = 0;
  if (ph <= 1) {   // 함무라비 법전 · 독립선언문 → "상상의 질서"
    const tH = ph === 0 ? spW(a, '함무', 1.4) : -9, tU = ph === 0 ? spW(a, '불평등', 2.8) : -9, tG = ph === 0 ? spW(a, '신의', 3.6) : -9, tD = ph === 0 ? spW(a, '독립', 5.8) : -9, tF = ph === 0 ? spW(a, '자유', 6.8) : -9;
    const tS = ph === 1 ? spW(a, '상상', 2.4) : 99, dash = gfK(tS, tS + 0.5, lt);
    w += `<rect x="-600" y="-600" width="3120" height="2280" fill="#EFE8DA"/>` + Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 377) % 2200 - 100}" cy="${(i * 211) % 1200 - 60}" r="${4 + (i % 4)}" fill="#D9CDB4"/>`).join('');
    const kL = ph === 0 ? gfIn(lt, tH - 0.3, 3, 0.45) : 1, kR = ph === 0 ? gfIn(lt, tD - 0.3, 3, 0.45) : 1;
    w += fkAt(620, 470, spTablet(t, kL, ph === 0 ? gfK(tU, tU + 0.4, lt) * (1 - gfK(tD, tD + 0.3, lt)) : 0, ph === 0 ? gfK(tH - 0.1, tH + 1.1, lt) : 1), kL, -3) + fkAt(1320, 470, spScroll(t, kR, ph === 0 ? gfK(tF, tF + 0.4, lt) : 0, ph === 0 ? easeOut(gfK(tD - 0.1, tD + 0.6, lt)) : 1), kR, 3);
    if (dash > 0) [[620, 470, 420, 600], [1320, 470, 440, 560]].forEach(([x, y, ww, hh]) => { w += `<rect x="${x - ww / 2}" y="${y - hh / 2}" width="${ww}" height="${hh}" rx="24" fill="none" stroke="#5B4FCF" stroke-width="7" stroke-dasharray="18 12" stroke-dashoffset="${f1(-run * 40)}" opacity="${f1(dash * 100) / 100}"/>`; });
    hud += gfChipAt(ph === 0 ? lt : 9, tH, 620, 820, '함무라비 법전 · 바빌로니아', { size: 34, bg: '#fff' }) + gfChipAt(ph === 0 ? lt : 9, tD, 1320, 820, '독립선언문 · 근대', { size: 34, bg: '#fff' });
    if (ph === 0 && lt > tU && lt < tD) hud += gfChipAt(lt, tU, 620, 140, '불평등은 신의 뜻', { size: 36, bg: '#FFF3C4', rot: -3 });
    if (ph === 0 && lt > tF) hud += gfChipAt(lt, tF, 1320, 140, '자유와 평등은 진리', { size: 36, bg: '#E8F4FF', rot: 3 });
    if (ph === 1) hud += fkAt(620, 300, gfStamp(lt, tS + 0.1, '상상의 질서', { size: 58 })) + fkAt(1320, 300, gfStamp(lt, tS + 0.35, '상상의 질서', { size: 58, rot: 8 })) + gfChipAt(lt, tS + 0.9, 960, 140, '점선 = 함께 믿는 이야기', { size: 38, bg: '#EDE8FF', col: '#5B4FCF' });
    cam = qLerpCam(gfK(0, 9, ph === 0 ? lt : 9), [960, 560, 1.0], [960, 540, 1.04]);
    return fkDefs() + qCam(cam, w) + hud;
  }
  // b3~b5: 점선 상자 안의 제로 → 줌아웃 → 문 밖 초원
  const tR = ph === 3 ? spW(a, '깨닫', 0.57) : ph > 3 ? -9 : 99, tY = ph === 3 ? spW(a, '피터지', 4.5) : -9, tOut = ph === 3 ? spW(a, '필요', 5.47) : -9;
  const zoom = ph === 2 ? 0 : ph === 3 ? easeInOut(gfK(tR + 0.2, tR + 1.6, lt)) : 1, door = ph === 2 ? 0 : ph === 3 ? easeOut(gfK(tR + 0.9, tR + 1.3, lt)) : 1;
  cam = qLerpCam(zoom, [960, 560, 1.72], [960, 560, 0.86]);
  if (ph === 4) cam = qLerpCam(gfK(0, 3, lt), [960, 560, 0.86], [1080, 580, 0.92]);
  w += spBoxWalls(run, { door, fill: lerp(0.85, 0.5, zoom) });
  // 상자 안: 트랙을 뱅뱅 도는 작은 사람들(피 터지게 달리기)
  for (let i = 0; i < 6; i++) { const an = run * 1.6 + i * 1.047, x = 960 + Math.cos(an) * 250, y = 780 + Math.sin(an) * 34, wk = gfWalk(run * 400 + i * 50, 1.2, 0.06);
    w += gfActor(spPass(i + 2), { x, y, s: 0.3, t, pose: wk.pose, ex: fEx('z코치지침'), look: [Math.sin(an) > 0 ? -0.8 : 0.8, 0], seed: 50 + i }, { sx: Math.sin(an) > 0 ? -1 : 1 }); }
  w += `<ellipse cx="960" cy="782" rx="270" ry="44" fill="none" stroke="#E3CDA0" stroke-width="10" stroke-dasharray="20 14"/>`;
  // 제로
  const out = ph === 3 ? easeInOut(gfK(tOut - 0.3, tOut + 1.0, lt)) : ph > 3 ? 1 : 0;
  let zx = lerp(860, 1560, out), zy = lerp(SPB.FY, 930, out), zs = lerp(0.62, 0.8, out), pose = '서기', ex = ph === 2 ? 'z코치지침' : 'z기본', m = {};
  if (ph === 2) { const tN1 = spW(a, '30', 1.45), tN2 = spW(a, '남들처럼', 3.79); [tN1, tN2].forEach(tp => { if (lt > tp + 0.3 && lt < tp + 0.8) m = gfJelly(lt, tp + 0.3, 0.12, 6, 8); }); }
  if (ph === 3 && lt > tR) ex = 'z반짝'; if (out > 0 && out < 1) { const wk = gfWalk(out * 600, 1, 0.05); pose = wk.pose; m = { sy: wk.sy, dy: wk.dy }; ex = 'z빵긋'; }
  if (ph === 4) { const tH = spW(a, '행복', 3.05); pose = lt > 1 ? SP_P.sit : '서기'; ex = lt > tH ? 'z하트눈' : 'z빵긋'; if (lt > 1) m = gfJelly(lt, 1, 0.1, 4, 7); }
  w += gfActor(SPZW, { x: zx, y: zy, s: zs, t, pose, ex: fEx(ex), look: out > 0 ? [0.6, -0.2] : [0, -0.4], seed: 3, sweat: ph === 2 });
  if (ph === 3 && lt > tR) w += gfEmote(lt, tR, 860 + 140 * 0.62, SPB.FY - 545 * 0.62, 'idea', { hold: 1.2, s: 0.8 });
  // 점수판·시선·잔소리(허구) → 밖에 나가면 톡톡 터짐
  const popT = ph === 3 ? tOut + 0.2 : ph > 3 ? -9 : 99, alive = 1 - gfK(popT, popT + 0.25, lt);
  if (ph === 2) { const tN1 = spW(a, '30', 1.45), tN2 = spW(a, '남들처럼', 3.79), tL = spW(a, '자연', 7.6);
    w += spScore(t, gfIn(lt, 0.3, 3, 0.45), 1130, 480);
    [[700, 440], [1240, 720], [690, 650], [820, 350]].forEach(([x, y], i) => { w += spEye(x, y, gfIn(lt, 0.8 + i * 0.3, 3.4, 0.42) * 0.7, t, i); });
    w += spNag(740, 420, '30대엔 이 정도 모아야지', gfIn(lt, tN1, 3, 0.45) * 0.86, t, -3) + spNag(1090, 660, '남들처럼 이 정도는 해야지', gfIn(lt, tN2, 3, 0.45) * 0.86, t, 3) + gfPuff(lt, tN1 + 0.3, 860, 560, 0.7, '#FFD1D1') + gfPuff(lt, tN2 + 0.3, 900, 560, 0.7, '#FFD1D1');
    if (lt > tL) hud += fkAt(960, 300, gfStamp(lt, tL + 0.1, '자연의 법칙 아님', { size: 64 })); }
  if (ph === 3 && alive > 0.02) { w += spScore(t, alive, 1130, 480) + [[700, 440], [1240, 720], [690, 650], [820, 350]].map(([x, y], i) => spEye(x, y, 0.7 * alive, t, i)).join('');
    w += spNag(740, 420, '30대엔 이 정도 모아야지', 0.86 * alive, t, -3) + spNag(1090, 660, '남들처럼 이 정도는 해야지', 0.86 * alive, t, 3); }
  if (ph === 3 && lt > popT) [[1130, 480], [700, 440], [1240, 720], [690, 650], [820, 350], [760, 400], [1080, 650]].forEach(([x, y], i) => { w += gfPuff(lt, popT + i * 0.04, x, y, 1.2); });
  // 질문 창: 이 미니게임을 나갈까요? ▶예 (손가락 없음, 고르는 표시만)
  if (ph === 3) { const tQ = tR + 1.3, kq = gfIn(lt, tQ, 3, 0.45) * (1 - gfK(tOut + 0.4, tOut + 0.7, lt)), sel = lt > tQ + 1.0;
    if (kq > 0.02) hud += fkAt(960, 300, gfPanel(620, 210, { bg: '#fff' }) + gfT(0, -40, '이 미니게임을 나갈까요?', 42, GFC.navy) + gfT(-110, 50, '예', 44, sel ? GFC.coral : GFC.navy) + gfT(110, 50, '아니오', 40, '#9AA0AE') +
      `<path d="M-180 ${f1(36 + Math.sin(t * 8) * 3)} l22 14 l-22 14 Z" fill="${GFC.coral}"/>` + (sel ? `<rect x="-160" y="8" width="100" height="66" rx="16" fill="none" stroke="${GFC.coral}" stroke-width="6"/>` : ''), kq); }
  if (ph === 3 && lt > tY - 0.1 && lt < tY + 1.8) { const kz = gfIn(lt, tY - 0.1, 3, 0.45) * (1 - gfK(tY + 1.5, tY + 1.8, lt)); let r = '';
    for (let i = 0; i < 3; i++) { const wk = gfWalk(lt * 900 + i * 70, 1.4, 0.06); r += gfActor(spPass(i + 4), { x: -110 + i * 110, y: 120, s: 0.42, t, pose: wk.pose, ex: fEx('z코치지침'), look: [0.8, 0], seed: 60 + i, sweat: true }, { sy: wk.sy, dy: wk.dy }) + spDrops(lt, -110 + i * 110, -60, 0.42, 2, 9 + i); }
    hud += fkAt(1500, 330, `<clipPath id="spMag"><circle r="170"/></clipPath><circle r="180" fill="#fff" stroke="${INK}" stroke-width="9"/><g clip-path="url(#spMag)"><rect x="-200" y="-200" width="400" height="400" fill="#FFF3E0"/><rect x="-200" y="120" width="400" height="90" fill="#E3CDA0"/>${spSpeed(lt, 120, 40, -1, 4)}${r}</g>` + `<g transform="translate(0 205)">${gfChip('피 터지게 1등 경쟁', { size: 30, bg: '#FFE1E1', col: '#C2333A' })}</g>`, kz); }
  if (ph === 4) { const tP = spW(a, '필요', 0.73); hud += gfChipAt(lt, tP, 960, 250, '필요할 때만 ▶ 플레이', { size: 40, bg: '#FFF3C4' }); const tH = spW(a, '행복', 3.05); if (lt > tH) w += gfEmote(lt, tH, zx + 120, zy - 420 * zs, 'heart', { hold: 9 }); }
  plate = zoom;
  let h = fkDefs() + `<rect x="-600" y="-600" width="3120" height="2280" fill="#262B44"/>` + (plate > 0.02 ? `<g opacity="${f1(Math.min(1, plate * 1.5) * 100) / 100}" transform="translate(960 560) scale(1.14) translate(-960 -560)">${qPlate('meadow', cam, 0.5)}</g>` : '') + qCam(cam, w);
  const hv = ph === 4 ? (lt > spW(a, '행복', 3.05) ? 4 : 3) : 3;
  return h + hud + spHud(lt, hv, { from: 3, tp: ph === 4 ? spW(a, '행복', 3.05) : null, clock: ph >= 3 ? '자유 시간' : 'AM 09:30' });
}

/* ===== a1~a5: AI가 사람 일을 대신함(일 카드가 로봇 카드로) · 힘→행복 변환기 · 진짜 질문 · 친구와 국밥 =====
   운영자 2026-11-16 "거대한 팔이 나오는 부분이 이해가 안 됨" → 큰 손을 빼고 뜻이 바로 보이는 그림으로. */
const spCoin = (k = 1) => `<g transform="scale(${f1(k * 100) / 100})"><circle r="24" fill="#FFD84A" stroke="${INK}" stroke-width="5"/><circle r="14" fill="none" stroke="#E0A92A" stroke-width="4"/></g>`;
const spTrophy = (k = 1) => `<g transform="scale(${f1(k * 100) / 100})"><path d="M-30 -40 L30 -40 L24 0 Q0 20 -24 0 Z" fill="#FFD84A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="-6" y="10" width="12" height="20" fill="#E0A92A" stroke="${INK}" stroke-width="4"/><rect x="-22" y="28" width="44" height="12" rx="4" fill="#C08A50" stroke="${INK}" stroke-width="4"/></g>`;
/* 친구(운영자 2026-11-16 "예쁜 여자"): 웨이브 긴 머리 + 베레모, 크림 블라우스 + 하늘색 치마 */
const spFriend = o => zGirl(Object.assign({ hairStyle: 'wave', hairArgs: ['#7A4A32', '#FF8FB1'], top: '#FFF1E0', dress: '#9ED8FF', seed: 33 }, o));
const spBowl = (x, y, t, k = 1) => fkAt(x, y, spRice(t) + `<path d="M40 -30 L86 -70" stroke="#C9CED8" stroke-width="7" stroke-linecap="round"/><ellipse cx="90" cy="-74" rx="12" ry="8" fill="#C9CED8" stroke="${INK}" stroke-width="3"/>`, k);
const spRobot = (t, k = 1) => `<g transform="scale(${f1(k * 100) / 100})"><line x1="0" y1="-118" x2="0" y2="-150" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="-156" r="10" fill="#FF6B8A" stroke="${INK}" stroke-width="4"/>` +
  `<rect x="-62" y="-120" width="124" height="96" rx="26" fill="#DDE8F2" stroke="${INK}" stroke-width="7"/><rect x="-46" y="-104" width="92" height="62" rx="16" fill="#26304A"/><circle cx="-18" cy="-74" r="9" fill="#7FF0FF"/><circle cx="18" cy="-74" r="9" fill="#7FF0FF"/><path d="M-12 -56 Q0 -48 12 -56" stroke="#7FF0FF" stroke-width="4" fill="none" stroke-linecap="round"/>` +
  `<rect x="-44" y="-24" width="88" height="62" rx="18" fill="#C9D6E6" stroke="${INK}" stroke-width="7"/><circle cx="0" cy="8" r="10" fill="#FFD84A" stroke="${INK}" stroke-width="4"/><circle cx="-26" cy="48" r="16" fill="#3B4570" stroke="${INK}" stroke-width="5"/><circle cx="26" cy="48" r="16" fill="#3B4570" stroke="${INK}" stroke-width="5"/></g>`;
/* 사람 일 카드: 계산·운전·그림·진단. flip 0→1: 사람 카드 → (뒤집힘) → AI 카드 */
const SP_JOBICON = [
  `<rect x="-34" y="-44" width="68" height="88" rx="10" fill="#E8F4FF" stroke="${INK}" stroke-width="5"/><rect x="-24" y="-34" width="48" height="20" rx="4" fill="#BFE9FF" stroke="${INK}" stroke-width="3"/>${[0, 1, 2].map(r => [0, 1, 2].map(c => `<rect x="${-24 + c * 18}" y="${-6 + r * 16}" width="12" height="10" rx="2" fill="#C9CED8"/>`).join('')).join('')}`,
  `<g transform="translate(0 20) scale(.32)">${spCar('#FF9AA8')}</g>`,
  `<path d="M-40 6 Q-44 -38 0 -40 Q44 -40 40 0 Q36 30 10 20 Q-6 14 -10 30 Q-20 46 -40 6 Z" fill="#FFF3C4" stroke="${INK}" stroke-width="5"/>${[[-22, -16, '#FF6B6B'], [0, -24, '#4FA3E0'], [20, -12, '#7FB069'], [-18, 6, '#FFD84A']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="8" fill="${c}"/>`).join('')}`,
  `<path d="M-24 -40 Q-30 0 0 10 Q30 0 24 -40" fill="none" stroke="${INK}" stroke-width="6"/><path d="M0 10 Q0 40 26 40" fill="none" stroke="${INK}" stroke-width="6"/><circle cx="30" cy="40" r="12" fill="#C9CED8" stroke="${INK}" stroke-width="5"/>`];
const SP_JOBNAME = ['계산', '운전', '그림', '진단'];
function spJobCard(i, flip, t) { const sx = Math.abs(Math.cos(Math.PI * flip)), ai = flip > 0.5;
  const head = ai ? `<rect x="-20" y="-18" width="40" height="34" rx="9" fill="#DDE8F2" stroke="${INK}" stroke-width="4"/><circle cx="-8" cy="-2" r="4" fill="#4FD8F0"/><circle cx="8" cy="-2" r="4" fill="#4FD8F0"/><line x1="0" y1="-18" x2="0" y2="-28" stroke="${INK}" stroke-width="4"/>`
    : `<circle r="18" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="-6" cy="-2" r="3" fill="${INK}"/><circle cx="6" cy="-2" r="3" fill="${INK}"/>`;
  return `<g transform="scale(${f1(Math.max(0.02, sx) * 100) / 100} 1)"><rect x="-90" y="-112" width="180" height="224" rx="20" fill="${ai ? '#DFF8FF' : '#FFFFFF'}" stroke="${ai ? '#2BB6D0' : INK}" stroke-width="7"/>` +
    `<g transform="translate(-58 -80)">${head}</g><g transform="translate(0 -6)">${SP_JOBICON[i]}</g>` + gfT(0, 92, (ai ? 'AI ' : '') + SP_JOBNAME[i], 32, ai ? '#1F7A8C' : GFC.navy) + `</g>`; }
/* 힘 → 행복 변환기: 왼쪽 깔때기로 번개·동전·톱니가 잔뜩 들어가고, 오른쪽 관으로 하트가 쪼끔 */
function spConverter(t, lt, inK, outK, shake) { const sh = Math.sin(t * 40) * 4 * shake;
  let s = `<g transform="translate(${f1(sh)} 0)"><path d="M-330 -250 L-150 -250 L-200 -150 L-280 -150 Z" fill="#E8F4FF" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` +
    `<rect x="-260" y="-150" width="520" height="300" rx="34" fill="#B8C8E8" stroke="${INK}" stroke-width="8"/><rect x="-220" y="-110" width="300" height="56" rx="12" fill="#fff" stroke="${INK}" stroke-width="5"/>` + gfT(-70, -70, '힘 → 행복 변환기', 32, GFC.navy) +
    [[-140, 40, 52], [-30, 50, 40]].map(([x, y, r], i) => `<g transform="translate(${x} ${y}) rotate(${f1(t * (i ? -160 : 120) * (0.3 + shake))})"><circle r="${r}" fill="#9AA6C4" stroke="${INK}" stroke-width="6"/>${[0, 1, 2, 3, 4, 5].map(j => `<rect x="-8" y="${-r - 12}" width="16" height="16" fill="#9AA6C4" stroke="${INK}" stroke-width="4" transform="rotate(${j * 60})"/>`).join('')}<circle r="${r * 0.35}" fill="#fff" stroke="${INK}" stroke-width="4"/></g>`).join('') +
    `<circle cx="150" cy="-30" r="56" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M150 -30 L${f1(150 + Math.cos(-2.6 + 2.2 * inK) * 44)} ${f1(-30 + Math.sin(-2.6 + 2.2 * inK) * 44)}" stroke="${GFC.coral}" stroke-width="7" stroke-linecap="round"/>` +
    `<path d="M260 60 L360 60 L360 120 L330 120" fill="none" stroke="${INK}" stroke-width="30" stroke-linejoin="round"/><path d="M260 60 L360 60 L360 120 L330 120" fill="none" stroke="#B8C8E8" stroke-width="18" stroke-linejoin="round"/></g>`;
  // 들어가는 힘(많이)
  if (inK > 0) for (let i = 0; i < 12; i++) { const ph = ((lt * 1.4 + i / 12) % 1), x = -240 + Math.sin(i * 2.3) * 60, y = lerp(-520, -170, ph), ic = i % 3;
    s += fkAt(x, y, ic === 0 ? `<path d="M6 -26 L-14 4 L0 4 L-6 26 L14 -4 L0 -4 Z" fill="#FFD84A" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` : ic === 1 ? spCoin(1) : `<circle r="18" fill="#C9CED8" stroke="${INK}" stroke-width="4"/><circle r="7" fill="#fff" stroke="${INK}" stroke-width="3"/>`, Math.min(1, inK * 1.5) * (ph < 0.9 ? 1 : (1 - ph) * 10)); }
  // 나오는 행복(쪼끔)
  if (outK > 0) s += fkAt(345, 150 + 40 * Math.min(1, outK * 2), `<g transform="scale(${f1(0.55 * 100) / 100})">${GF_ICON.heart(t)}</g>`, Math.min(1, outK * 3)) + (outK > 0.4 ? gfT(345, 230, '찔끔…', 30, GFC.coral) : '');
  return s; }
function spaiScene(t, lt, a) {
  const ph = a.ph, run = a._run; let w = '', hud = '', cam = [1080, 580, 0.92], hv = 4, hp = null, warm = 0;
  const zx = 1560, zy = 930, zs = 0.8;
  if (ph === 0) {   // 사람 일 카드 넷이 AI 카드로 뒤집히고, 작은 로봇이 상자 속 점수 게임 1등
    const tAI = spW(a, 'AI', 2.6), tBio = spW(a, '생명', 3.39), tH = spW(a, '인간', 4.23), tR = spW(a, '대체', 5.41);
    w += spBoxWalls(run, { door: 1, fill: 0.5 });
    for (let i = 0; i < 5; i++) { const an = run * 1.6 + i * 1.256, x = 960 + Math.cos(an) * 250, y = 780 + Math.sin(an) * 34, wk = gfWalk(run * 400 + i * 50, 1.2, 0.06);
      w += gfActor(spPass(i + 2), { x, y, s: 0.3, t, pose: wk.pose, ex: fEx('z코치지침'), look: [Math.sin(an) > 0 ? -0.8 : 0.8, 0], seed: 50 + i }); }
    w += `<ellipse cx="960" cy="782" rx="270" ry="44" fill="none" stroke="#E3CDA0" stroke-width="10" stroke-dasharray="20 14"/>`;
    if (lt > tAI - 0.3) { const drop = easeOut(gfK(tAI - 0.3, tAI + 0.2, lt)), zoom = lt > tR ? (lt - tR) * 2.6 : 0, an = zoom * 2.2 + 1.2;
      const rx = lt > tR ? 960 + Math.cos(an) * 250 : 960, ry = lt > tR ? 780 + Math.sin(an) * 34 : lerp(200, 780, drop);
      w += fkAt(rx, ry, spRobot(t, 0.62)) + (lt > tR ? spSpeed(lt, rx - 40, ry - 20, -1, 3) : '') + gfStarBurst(lt, tAI + 0.2, 960, 780, { r1: 140, n: 7 });
      if (lt > tR + 0.6) hud += fkAt(960, 420, gfPanel(330, 120, { bg: '#fff' }) + gfT(-130, -10, '1위', 34, GFC.coral, { anchor: 'start' }) + gfT(-60, -10, 'AI', 34, '#1F7A8C', { anchor: 'start' }) + gfT(-130, 38, '2위', 28, '#7A8094', { anchor: 'start' }) + gfT(-60, 38, '사람들', 28, '#7A8094', { anchor: 'start' }), gfIn(lt, tR + 0.6, 3, 0.45)); }
    if (lt > tH) SP_JOBNAME.forEach((_, i) => { const k = gfIn(lt, tH + i * 0.1, 3.4, 0.42), fl = gfK(tR + i * 0.18, tR + 0.3 + i * 0.18, lt); hud += fkAt(330 + i * 420 - (i > 1 ? 0 : 0), 250, spJobCard(i, fl, t), k * 0.9, (i - 1.5) * 3); });
    hud += gfChipAt(lt, spW(a, '과학', 0.9), 960, 70, '과학 혁명 → AI · 생명공학', { size: 40, bg: '#E8FBFF', col: '#1F7A8C' });
    if (lt > tBio) hud += fkAt(1430, 70, `<path d="M-14 -30 Q14 -15 -14 0 Q14 15 -14 30 M14 -30 Q-14 -15 14 0 Q-14 15 14 30" fill="none" stroke="#4FA3E0" stroke-width="6" stroke-linecap="round"/>`, gfIn(lt, tBio, 3.4, 0.42));
    w += gfActor(SPZW, { x: zx, y: zy, s: zs, t, pose: SP_P.sit, ex: fEx(lt > tR ? 'z충격' : 'z기본'), look: [-0.7, -0.4], seed: 3 });
    cam = qLerpCam(gfK(0, 3, lt), [1080, 600, 0.92], [960, 600, 0.9]);
  } else if (ph === 1) {   // 힘 → 행복 변환기
    const tP = spW(a, '힘을', 1.57), tG = spW(a, '천재', 2.41), tH = spW(a, '행복', 4.27), tL = spW(a, '부족', 6.33);
    w += `<g opacity=".45">${spBoxWalls(run, { door: 1, fill: 0.3 })}</g>`;
    const inK = gfK(tP - 0.2, tG + 0.4, lt), outK = gfK(tH + 0.3, tH + 1.6, lt), shake = lt > tH && lt < tH + 1.4 ? 1 : 0.2;
    w += fkAt(900, 560, spConverter(t, lt, inK, outK, shake), 1);
    w += gfActor(SPZW, { x: zx, y: zy, s: zs, t, pose: SP_P.sit, ex: fEx(lt > tL ? 'z의심' : 'z기본'), look: [-0.7, -0.4], seed: 3 });
    if (lt > tL) w += gfEmote(lt, tL, zx + 110, zy - 470 * zs, 'q', { hold: 9 });
    hud += fkAt(330, 250, gfPanel(380, 200, { bg: '#fff' }) + gfT(-150, -32, '힘', 40, GFC.navy) + `<g transform="translate(-100 -46)">${gfBar(240, gfK(tP, tG + 0.4, lt), { h: 30, col: '#4FD8F0' })}</g>` + gfT(-150, 60, '행복', 36, GFC.navy) + `<g transform="translate(-100 46)">${gfBar(240, 0.15 * outK, { h: 30, col: GFC.coral })}</g>`, gfIn(lt, tP - 0.1, 3, 0.45));
    if (lt > tL) hud += gfChipAt(lt, tL, 330, 400, '뜻을 옮김', { size: 30, bg: '#fff' });
    cam = [960, 560, 0.9];
  } else {
    w += spBoxWalls(run, { door: 1, fill: 0.5 });
    if (ph <= 3) w += gfActor(SPZW, { x: zx, y: zy, s: zs, t, pose: SP_P.sit, ex: fEx('z기본'), look: [-0.7, -0.4], seed: 3 });
    if (ph === 2) { const tB = spW(a, '책', 0.65), tS = spW(a, '문장', 3.2); hud += gfChipAt(lt, tB, 960, 260, '『사피엔스』 마지막 장', { size: 46, icon: 'book', bg: '#fff' }); if (lt > tS) hud += gfStarBurst(lt, tS, 960, 260, { r1: 200, n: 9 }); }
    if (ph === 3) {   // 진짜 질문: "어떤 존재" ✕ → "무엇을 원하고 싶은가"
      const tE = spW(a, '어떤', 2.83), tN = spW(a, '아니라', 4.75), tW = spW(a, '무엇', 6.13), k = gfIn(lt, 0.2, 3, 0.45);
      let c = gfPanel(1000, 380, { bg: '#FFFDF6' }) + gfT(0, -128, '우리가 마주한 진짜 질문은', 40, '#7A8094');
      if (lt > tE) c += gfT(0, -36, '"어떤 존재가 되고 싶은가?"', 50, lt > tN ? '#A9AEBB' : GFC.navy) + (lt > tN ? `<line x1="-330" y1="-52" x2="${f1(lerp(-330, 330, gfK(tN, tN + 0.35, lt)))}" y2="-52" stroke="#E5484D" stroke-width="10" stroke-linecap="round"/>` : '');
      if (lt > tW) c += `<g transform="scale(${f1(gfIn(lt, tW, 3, 0.45) * 100) / 100})">${gfT(0, 76, '"무엇을 원하고 싶은가?"', 58, GFC.coral)}</g>` + gfT(0, 150, '— 『사피엔스』 20장', 28, '#7A8094');
      hud += fkAt(960, 420, c, k); warm = 0.15; }
    if (ph === 4) {   // 거창한 타이틀 ✕ → 친구와 국밥 두 그릇, 하트 가득
      const tTi = spW(a, '타이틀', 2.05), tNo = spW(a, '말고', 2.49), tWa = spW(a, '작고', 5.05), tHo = spW(a, '따뜻', 5.69);
      const tk = gfIn(lt, tTi - 0.1, 3, 0.45) * (1 - gfK(tNo + 0.1, tNo + 0.35, lt));
      if (tk > 0.02) hud += fkAt(960, 300, `<g>${spTrophy(3)}</g>` + gfT(0, 150, '거창한 타이틀', 40, GFC.navy), tk);
      if (lt > tNo + 0.1) hud += gfPuff(lt, tNo + 0.1, 960, 300, 2.4);
      const fx = 1370, pk = gfIn(lt, tWa - 0.4, 3, 0.45);
      w += `<ellipse cx="${(fx + zx) / 2}" cy="${zy + 10}" rx="${f1(320 * Math.max(pk, 0.01))}" ry="${f1(56 * Math.max(pk, 0.01))}" fill="#FFB3B3" stroke="${INK}" stroke-width="6" opacity="${f1(pk * 100) / 100}"/>`;
      { const wl = 1 - easeOut(gfK(tWa - 0.9, tWa - 0.1, lt)), wk = gfWalk(wl * 400, 1, 0.05); w += gfActor(spFriend, { x: fx - 420 * wl, y: zy, s: zs, t, pose: wl > 0.02 ? wk.pose : SP_P.sit, ex: fEx(lt > tHo ? 'z빵긋' : 'z기본'), look: [0.6, 0], seed: 33 }, wl > 0.02 ? { sy: wk.sy, dy: wk.dy } : {}); }
      w += gfActor(SPZW, { x: zx, y: zy, s: zs, t, pose: SP_P.sit, ex: fEx(lt > tHo ? 'z하트눈' : 'z빵긋'), look: [-0.6, 0], seed: 3 }, lt > tHo ? gfJelly(lt, tHo, 0.08, 4, 7) : {});
      w += spBowl(fx + 60, zy - 30, t, gfIn(lt, tWa, 3.4, 0.42) * 0.85) + spBowl(zx - 70, zy - 30, t, gfIn(lt, tWa + 0.15, 3.4, 0.42) * 0.85);
      if (lt > tHo) w += gfEmote(lt, tHo, (fx + zx) / 2, zy - 470 * zs, 'heart', { hold: 9, s: 1.2 });
      hv = lt > tHo ? 5 : 4; hp = tHo; warm = 0.35 * gfK(tHo - 0.3, tHo + 1.2, lt);
      cam = qLerpCam(gfK(tWa - 0.6, tWa + 0.8, lt), [960, 560, 0.86], [1465, 700, 1.3]); }
    else cam = [960, 560, 0.86];
  }
  let h = fkDefs() + `<rect x="-600" y="-600" width="3120" height="2280" fill="#CDE9B8"/><g transform="translate(960 560) scale(1.14) translate(-960 -560)">${qPlate('meadow', cam, 0.5)}</g>` + qCam(cam, w);
  if (warm > 0.01) h += `<rect x="-300" y="-300" width="2600" height="1600" fill="#FFB46A" opacity="${f1(warm * 100) / 100}"/>`;
  return h + hud + spHud(lt, hv, { from: hv === 5 ? 4 : hv, tp: hp, clock: '자유 시간' });
}

/* ===== e1~e4: 노을 초원 산책 + 빈칸 질문 카드 ===== */
function spendScene(t, lt, a) {
  const ph = a.ph, run = a._run; let w = '', hud = '';
  const walkK = clamp(run / 26, 0, 1), zx = lerp(560, 1200, walkK), zs = lerp(0.82, 0.62, walkK), zy = lerp(930, 820, walkK);
  // 작아지는 점선 상자(뒤에 남겨 둠)
  const bxX = lerp(330, 210, walkK), bxY = lerp(720, 690, walkK), bxS = lerp(0.42, 0.28, walkK);
  w += `<g transform="translate(${f1(bxX)} ${f1(bxY)}) scale(${f1(bxS * 1000) / 1000}) translate(-960 -600)">${spBoxWalls(run, { door: 1, fill: 0.75 })}</g>`;
  // 빌려 쓴 약속들(동전·명찰·별점)이 점선이 되어 상자로 돌아감
  if (ph === 0) { const T = [spW(a, '돈도', 0.15), spW(a, '직급', 0.67), spW(a, '평가', 2.47)], tB = spW(a, '빌려', 5.19), tV = spW(a, '가치', 8.23);
    T.forEach((t0, i) => { const k = gfIn(lt, t0, 3.4, 0.42), u = easeInOut(gfK(tB + i * 0.15, tB + 1.2 + i * 0.15, lt)); if (k < 0.02 || u >= 1) return;
      const x = lerp(zx - 180 + i * 180, bxX, u), y = lerp(zy - 580 * zs, bxY - 40, u) - Math.sin(Math.PI * u) * 140;
      const ic = [spCoin(2.0), `<g transform="scale(1.5)"><rect x="-56" y="-24" width="112" height="48" rx="10" fill="#FFE1E1" stroke="${INK}" stroke-width="5"/>${gfT(0, 12, '승진', 32, '#C2333A')}</g>`, `<g transform="scale(2)">${GF_ICON.star(t)}</g>`][i]; w += `<g opacity="${f1((1 - 0.4 * u) * 100) / 100}">${fkAt(x, y, ic + (u > 0 ? `<circle r="46" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="10 8"/>` : ''), k * (1 - 0.6 * u))}</g>`; });
    if (lt > tV) w += fkAt(zx, zy - 300 * zs, `<g transform="scale(2.2)">${GF_ICON.heart(t)}</g>`, gfIn(lt, tV, 3, 0.45) * gfBeat(lt, tV + 0.4, 0.12, 2.2, 3)) + gfRing(lt, tV, zx, zy - 300 * zs, 30, 160, '#FFE38A', 10, 0.6);
    if (lt > tV) hud += gfChipAt(lt, tV + 0.2, 960, 140, '실선 = 진짜, 당신의 가치', { size: 38, bg: '#FFF3C4' }); }
  // 제로가 노을 쪽으로 천천히 걸어감(e4에서 돌아보며 손 인사)
  const wave = ph === 3 && lt > spW(a, '제로의', 3.29) - 0.4, wk = gfWalk(run * 140, 0.8, 0.045);
  w += gfActor(SPZW, { x: zx, y: zy, s: zs, t, pose: wave ? '손인사' : wk.pose, ex: fEx(wave ? 'z빵긋' : 'z기본'), look: wave ? [0, 0] : [0.7, -0.2], seed: 3, sweat: false }, wave ? gfJelly(lt, spW(a, '제로의', 3.29) - 0.4, 0.08, 3, 6) : { sy: wk.sy, dy: wk.dy });
  // 빈칸 질문 카드
  if (ph >= 1 && ph <= 2) { const k = ph === 1 ? gfIn(lt, spW(a, '조급', 1.37) - 0.2, 3, 0.45) : 1, k2 = ph === 2 ? gfIn(lt, spW(a, '내일', 0.37), 3, 0.45) : 0;
    let c = gfPanel(1040, ph === 2 ? 300 : 170, { bg: '#FFFDF6' }) + gfT(-470, ph === 2 ? -64 : 14, '나를 조급하게 만든 보이지 않는 규칙:', 40, GFC.navy, { anchor: 'start' }) + `<line x1="230" y1="${ph === 2 ? -54 : 24}" x2="470" y2="${ph === 2 ? -54 : 24}" stroke="${INK}" stroke-width="5" stroke-dasharray="14 10"/>`;
    if (ph === 2) c += `<g opacity="${f1(k2 * 100) / 100}">${gfT(-470, 60, '내일, 규칙 밖의 진짜 하루:', 40, GFC.coral, { anchor: 'start' })}<line x1="90" y1="70" x2="470" y2="70" stroke="${INK}" stroke-width="5" stroke-dasharray="14 10"/></g>`;
    hud += fkAt(960, ph === 2 ? 300 : 260, c, k);
    if (ph === 2) { const tC = spW(a, '댓글', 5.17); hud += gfChipAt(lt, tC, 1560, 520, '댓글로 들려주세요', { size: 40, icon: 'letter', bg: '#fff' }); } }
  if (ph === 3) { const tD = spW(a, '하루', 2.83); if (lt > tD) w += gfEmote(lt, tD, zx + 110, zy - 500 * zs, 'heart', { hold: 9 }); }
  const cam = qLerpCam(walkK, [900, 600, 1.0], [1000, 600, 1.08]);
  let h = fkDefs() + `<rect x="-600" y="-600" width="3120" height="2280" fill="#F6B98A"/>` + qPlate('sunset', cam, 0.4) + qCam(cam, w) + `<rect x="-300" y="-300" width="2600" height="1600" fill="#FFB46A" opacity=".12"/>`;
  if (ph === 3) { const tEnd = spW(a, '세계', 4.17) + 0.7, f = gfK(tEnd, tEnd + 1.2, lt); if (f > 0) { h += `<rect x="-300" y="-300" width="2600" height="1600" fill="#FFE9C8" opacity="${f1(f * 0.5 * 100) / 100}"/>`;
    let c = gfPanel(1040, 300, { bg: '#FFFDF6' }) + gfT(-470, -64, '나를 조급하게 만든 보이지 않는 규칙:', 40, GFC.navy, { anchor: 'start' }) + `<line x1="230" y1="-54" x2="470" y2="-54" stroke="${INK}" stroke-width="5" stroke-dasharray="14 10"/>` + gfT(-470, 60, '내일, 규칙 밖의 진짜 하루:', 40, GFC.coral, { anchor: 'start' }) + `<line x1="90" y1="70" x2="470" y2="70" stroke="${INK}" stroke-width="5" stroke-dasharray="14 10"/>`;
    h += fkAt(960, 400, c, gfIn(lt, tEnd + 0.2, 3, 0.45)) + gfChipAt(lt, tEnd + 0.6, 960, 640, '댓글로 들려주세요', { size: 44, icon: 'letter', bg: '#fff' }); } }
  return h + hud + spHud(lt, 5, { clock: 'PM 06:40' });
}
