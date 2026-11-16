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
function spTablet(t, k, hi) { if (k < 0.02) return ''; const fig = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cy="-58" r="20" fill="${c}" stroke="#6E6658" stroke-width="5"/><path d="M-20 -34 Q0 -42 20 -34 L24 10 L-24 10 Z" fill="${c}" stroke="#6E6658" stroke-width="5"/></g>`;
  let s = `<path d="M-190 -250 Q0 -330 190 -250 L190 250 L-190 250 Z" fill="#C9C2B4" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-160 -220 Q0 -290 160 -220 L160 220 L-160 220 Z" fill="none" stroke="#A39B8C" stroke-width="5"/>`;
  s += `<path d="M-130 180 h80 v-70 h80 v-70 h80 v-70 h60" fill="none" stroke="#8E8676" stroke-width="10" stroke-linejoin="round"/>` + fig(-90, 168, 0.8, '#B5AD9E') + fig(-10, 98, 1.0, '#B5AD9E') + fig(80, 28, 1.25, '#B5AD9E');
  s += `<g transform="translate(110 -170)">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="0" y1="-28" x2="0" y2="-44" stroke="#8E8676" stroke-width="6" stroke-linecap="round" transform="rotate(${i * 45})"/>`).join('')}<circle r="22" fill="#B5AD9E" stroke="#6E6658" stroke-width="5"/></g>`;
  if (hi) s += `<path d="M-130 180 h80 v-70 h80 v-70 h80 v-70 h60" fill="none" stroke="#FFC85A" stroke-width="6" opacity="${f1(hi * 100) / 100}"/>`;
  return s; }
function spScroll(t, k, hi) { if (k < 0.02) return ''; const fig = (x, c) => `<g transform="translate(${x} 120)"><circle cy="-58" r="22" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M-22 -32 Q0 -40 22 -32 L26 12 L-26 12 Z" fill="${c}" stroke="${INK}" stroke-width="5"/></g>`;
  let s = `<rect x="-180" y="-230" width="360" height="460" fill="#F6E7C4" stroke="${INK}" stroke-width="7"/><rect x="-200" y="-262" width="400" height="44" rx="22" fill="#E3CDA0" stroke="${INK}" stroke-width="7"/><rect x="-200" y="218" width="400" height="44" rx="22" fill="#E3CDA0" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 4; i++) s += `<path d="M-130 ${-170 + i * 34} h260" stroke="#CDB68A" stroke-width="8" stroke-linecap="round"/>`;
  const b = hi ? Math.abs(Math.sin(t * 6)) * 10 * hi : 0;
  s += `<g transform="translate(0 ${f1(-b)})">${fig(-100, '#FFB3B3') + fig(0, '#9ED8FF') + fig(100, '#B8E6A8')}</g><path d="M-100 104 h200" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity=".5"/>`;
  return s; }
function spboxScene(t, lt, a) {
  const ph = a.ph, run = a._run; let w = '', hud = '', cam = [960, 560, 1.0], plate = 0;
  if (ph <= 1) {   // 함무라비 법전 · 독립선언문 → "상상의 질서"
    const tH = ph === 0 ? spW(a, '함무', 1.4) : -9, tU = ph === 0 ? spW(a, '불평등', 2.8) : -9, tG = ph === 0 ? spW(a, '신의', 3.6) : -9, tD = ph === 0 ? spW(a, '독립', 5.8) : -9, tF = ph === 0 ? spW(a, '자유', 6.8) : -9;
    const tS = ph === 1 ? spW(a, '상상', 2.4) : 99, dash = gfK(tS, tS + 0.5, lt);
    w += `<rect x="-600" y="-600" width="3120" height="2280" fill="#EFE8DA"/>` + Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 377) % 2200 - 100}" cy="${(i * 211) % 1200 - 60}" r="${4 + (i % 4)}" fill="#D9CDB4"/>`).join('');
    const kL = ph === 0 ? gfIn(lt, tH - 0.3, 3, 0.45) : 1, kR = ph === 0 ? gfIn(lt, tD - 0.3, 3, 0.45) : 1;
    w += fkAt(620, 470, spTablet(t, kL, ph === 0 ? gfK(tU, tU + 0.4, lt) * (1 - gfK(tD, tD + 0.3, lt)) : 0), kL, -3) + fkAt(1320, 470, spScroll(t, kR, ph === 0 ? gfK(tF, tF + 0.4, lt) : 0), kR, 3);
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
    w += gfActor(o => FKV(['#C9B9C9', '#B9C9C0', '#C2BBAF', '#B4C0C9', '#D2C0B0', '#BFC9BA'][i], o), { x, y, s: 0.3, t, pose: wk.pose, ex: fEx('z코치지침'), look: [Math.sin(an) > 0 ? -0.8 : 0.8, 0], seed: 50 + i }, { sx: Math.sin(an) > 0 ? -1 : 1 }); }
  w += `<ellipse cx="960" cy="782" rx="270" ry="44" fill="none" stroke="#E3CDA0" stroke-width="10" stroke-dasharray="20 14"/>`;
  // 제로
  const out = ph === 3 ? easeInOut(gfK(tOut - 0.3, tOut + 1.0, lt)) : ph > 3 ? 1 : 0;
  let zx = lerp(860, 1560, out), zy = lerp(SPB.FY, 930, out), zs = lerp(0.62, 0.8, out), pose = '서기', ex = ph === 2 ? 'z코치지침' : 'z기본', m = {};
  if (ph === 3 && lt > tR) ex = 'z반짝'; if (out > 0 && out < 1) { const wk = gfWalk(out * 600, 1, 0.05); pose = wk.pose; m = { sy: wk.sy, dy: wk.dy }; ex = 'z빵긋'; }
  if (ph === 4) { const tH = spW(a, '행복', 3.05); pose = lt > 1 ? SP_P.sit : '서기'; ex = lt > tH ? 'z하트눈' : 'z빵긋'; if (lt > 1) m = gfJelly(lt, 1, 0.1, 4, 7); }
  w += gfActor(FKZW, { x: zx, y: zy, s: zs, t, pose, ex: fEx(ex), look: out > 0 ? [0.6, -0.2] : [0, -0.4], seed: 3, sweat: ph === 2 });
  if (ph === 3 && lt > tR) w += gfEmote(lt, tR, 860 + 140 * 0.62, SPB.FY - 545 * 0.62, 'idea', { hold: 1.2, s: 0.8 });
  // 점수판·시선·잔소리(허구) → 밖에 나가면 톡톡 터짐
  const popT = ph === 3 ? tOut + 0.2 : ph > 3 ? -9 : 99, alive = 1 - gfK(popT, popT + 0.25, lt);
  if (ph === 2) { const tN1 = spW(a, '30', 1.45), tN2 = spW(a, '남들처럼', 3.79), tL = spW(a, '자연', 7.6);
    w += spScore(t, gfIn(lt, 0.3, 3, 0.45), 1130, 480);
    [[700, 440], [1240, 720], [690, 650], [820, 350]].forEach(([x, y], i) => { w += spEye(x, y, gfIn(lt, 0.8 + i * 0.3, 3.4, 0.42) * 0.7, t, i); });
    w += spNag(760, 400, '30대엔 이 정도 모아야지', gfIn(lt, tN1, 3, 0.45) * 0.62, t, -3) + spNag(1080, 650, '남들처럼 이 정도는 해야지', gfIn(lt, tN2, 3, 0.45) * 0.62, t, 3);
    if (lt > tL) hud += fkAt(960, 300, gfStamp(lt, tL + 0.1, '자연의 법칙 아님', { size: 64 })); }
  if (ph === 3 && alive > 0.02) { w += spScore(t, alive, 1130, 480) + [[700, 440], [1240, 720], [690, 650], [820, 350]].map(([x, y], i) => spEye(x, y, 0.7 * alive, t, i)).join('');
    w += spNag(760, 400, '30대엔 이 정도 모아야지', 0.62 * alive, t, -3) + spNag(1080, 650, '남들처럼 이 정도는 해야지', 0.62 * alive, t, 3); }
  if (ph === 3 && lt > popT) [[1130, 480], [700, 440], [1240, 720], [690, 650], [820, 350], [760, 400], [1080, 650]].forEach(([x, y], i) => { w += gfPuff(lt, popT + i * 0.04, x, y, 1.2); });
  // 질문 창: 이 미니게임을 나갈까요? ▶예 (손가락 없음, 고르는 표시만)
  if (ph === 3) { const tQ = tR + 1.3, kq = gfIn(lt, tQ, 3, 0.45) * (1 - gfK(tOut + 0.4, tOut + 0.7, lt)), sel = lt > tQ + 1.0;
    if (kq > 0.02) hud += fkAt(960, 300, gfPanel(620, 210, { bg: '#fff' }) + gfT(0, -40, '이 미니게임을 나갈까요?', 42, GFC.navy) + gfT(-110, 50, '예', 44, sel ? GFC.coral : GFC.navy) + gfT(110, 50, '아니오', 40, '#9AA0AE') +
      `<path d="M-180 ${f1(36 + Math.sin(t * 8) * 3)} l22 14 l-22 14 Z" fill="${GFC.coral}"/>` + (sel ? `<rect x="-160" y="8" width="100" height="66" rx="16" fill="none" stroke="${GFC.coral}" stroke-width="6"/>` : ''), kq); }
  if (ph === 4) { const tP = spW(a, '필요', 0.73); hud += gfChipAt(lt, tP, 960, 250, '필요할 때만 ▶ 플레이', { size: 40, bg: '#FFF3C4' }); const tH = spW(a, '행복', 3.05); if (lt > tH) w += gfEmote(lt, tH, zx + 120, zy - 420 * zs, 'heart', { hold: 9 }); }
  plate = zoom;
  let h = fkDefs() + `<rect x="-600" y="-600" width="3120" height="2280" fill="#262B44"/>` + (plate > 0.02 ? `<g opacity="${f1(Math.min(1, plate * 1.5) * 100) / 100}" transform="translate(960 560) scale(1.14) translate(-960 -560)">${qPlate('meadow', cam, 0.5)}</g>` : '') + qCam(cam, w);
  const hv = ph === 4 ? (lt > spW(a, '행복', 3.05) ? 4 : 3) : 3;
  return h + hud + spHud(lt, hv, { from: 3, tp: ph === 4 ? spW(a, '행복', 3.05) : null, clock: ph >= 3 ? '자유 시간' : 'AM 09:30' });
}

/* ===== a1~a5: AI 큰 손 · 힘과 행복 · 진짜 질문 · 국밥 ===== */
function spRobotHand(t, sweep) {   // 홀로그램 손: 아래팔·손목·손바닥·손가락 넷·엄지(움켜쥐면 손가락이 짧아지며 안으로)
  const c = '#4FD8F0', f = '#BFF6FF', g = Math.sin(Math.PI * sweep), st = `fill="${f}" fill-opacity=".2" stroke="${c}" stroke-width="8" stroke-linejoin="round"`;
  let s = `<g opacity=".95"><rect x="-92" y="-780" width="184" height="580" rx="44" ${st}/>` + [0, 1, 2, 3].map(i => `<line x1="-70" y1="${-700 + i * 120}" x2="70" y2="${-700 + i * 120}" stroke="${c}" stroke-width="4" opacity=".6"/>`).join('');
  s += `<rect x="-118" y="-236" width="236" height="62" rx="22" fill="${f}" fill-opacity=".3" stroke="${c}" stroke-width="8"/>`;
  s += `<path d="M-128 -176 Q-140 -40 -104 26 L104 26 Q140 -40 128 -176 Z" ${st}/><circle cx="0" cy="-80" r="28" fill="#7FF0FF" opacity="${f1((0.45 + 0.4 * Math.sin(t * 6)) * 100) / 100}"/>`;
  [[-78, -10], [-26, -3], [26, 3], [78, 10]].forEach(([x, a]) => { const L1 = 78 - 24 * g, L2 = 62 - 26 * g, b = a * (1 - g) + (x < 0 ? 18 : -18) * g;
    s += `<g transform="translate(${x} 22) rotate(${f1(b)})"><rect x="-21" y="0" width="42" height="${f1(L1)}" rx="18" ${st}/><g transform="translate(0 ${f1(L1 - 6)}) rotate(${f1((x < 0 ? 26 : -26) * g)})"><rect x="-19" y="0" width="38" height="${f1(L2)}" rx="17" ${st}/></g></g>`; });
  s += `<g transform="translate(-124 -96) rotate(${f1(38 - 30 * g)})"><rect x="-22" y="0" width="44" height="${f1(96 - 20 * g)}" rx="20" ${st}/></g>`;
  for (let i = 0; i < 6; i++) s += `<rect x="${-80 + i * 30}" y="${f1(-760 + ((t * 300 + i * 120) % 560))}" width="22" height="4" fill="#7FF0FF" opacity=".5"/>`;
  return s + `</g>`;
}
const spCoin = (k = 1) => `<g transform="scale(${f1(k * 100) / 100})"><circle r="24" fill="#FFD84A" stroke="${INK}" stroke-width="5"/><circle r="14" fill="none" stroke="#E0A92A" stroke-width="4"/></g>`;
const spTrophy = (k = 1) => `<g transform="scale(${f1(k * 100) / 100})"><path d="M-30 -40 L30 -40 L24 0 Q0 20 -24 0 Z" fill="#FFD84A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="-6" y="10" width="12" height="20" fill="#E0A92A" stroke="${INK}" stroke-width="4"/><rect x="-22" y="28" width="44" height="12" rx="4" fill="#C08A50" stroke="${INK}" stroke-width="4"/></g>`;
const spDoyun = o => HALO(char(Object.assign({ goggles: 'none', vest: '#9ED8B8', patch: false, tee: true, vshade: 'rgba(30,90,60,0.18)', hair: '#3A2E2A', seed: 33 }, o)));
const spBowl = (x, y, t, k = 1) => fkAt(x, y, spRice(t), k);
function spaiScene(t, lt, a) {
  const ph = a.ph, run = a._run; let w = spBoxWalls(run, { door: 1, fill: 0.5 }), hud = '', cam = [1080, 580, 0.92], hv = 4, hp = null, warm = 0;
  // 상자 안 게임 보상(동전·트로피) — a1에서 AI 손이 쓸어 감
  const tAI = ph === 0 ? spW(a, 'AI', 2.6) : -9, tSw = ph === 0 ? spW(a, '대체', 5.4) : -9, gone = ph === 0 ? gfK(tSw, tSw + 0.6, lt) : 1;
  const LOOT = [[760, 820, 'c'], [840, 830, 't'], [920, 818, 'c'], [1010, 826, 'c'], [1090, 820, 't'], [1170, 828, 'c'], [700, 830, 'c'], [1230, 826, 'c']];
  if (gone < 1) LOOT.forEach(([x, y, ty], i) => { const u = gfK(tSw + i * 0.04, tSw + 0.6 + i * 0.04, lt), hx = lerp(x, 960 + (i - 4) * 18, easeIn(u)), hy = lerp(y, 120, easeIn(u)); w += fkAt(hx, hy, ty === 'c' ? spCoin(1.2) : spTrophy(1.2), 1 - u * 0.3); });
  // 홀로그램 로봇 손
  let handY = -800; if (ph === 0) handY = lerp(-800, 160, easeOut(gfK(tAI - 0.3, tAI + 1.2, lt))) - (lt > tSw ? 700 * easeIn(gfK(tSw + 0.4, tSw + 1.4, lt)) : 0) + (lt > tSw && lt < tSw + 0.6 ? 0 : 0);
  if (ph === 1) handY = lerp(-560, -260, gfK(0, 1, lt));
  if (ph === 0 || ph === 1) { const sw = ph === 0 ? gfK(tSw, tSw + 0.6, lt) : 1; w += fkAt(960 + (ph === 0 ? -120 * Math.sin(Math.PI * sw) : 0), handY + 700, spRobotHand(t, sw), 1.25); }
  if (ph === 1) LOOT.forEach(([, , ty], i) => { w += fkAt(960 + (i - 4) * 40, handY + 700 - 40 + Math.sin(t * 3 + i) * 6, ty === 'c' ? spCoin(1.2) : spTrophy(1.2)); });
  // 제로(초원 오른쪽에 앉음)
  const zx = 1560, zy = 930, zs = 0.8;
  if (ph <= 3) w += gfActor(FKZW, { x: zx, y: zy, s: zs, t, pose: SP_P.sit, ex: fEx(ph === 0 && lt > tAI ? 'z충격' : ph === 1 ? 'z의심' : 'z기본'), look: [-0.7, -0.4], seed: 3 });
  if (ph === 0) { hud += gfChipAt(lt, spW(a, '과학', 0.9), 960, 140, '과학 혁명 → AI · 생명공학', { size: 40, bg: '#E8FBFF', col: '#1F7A8C' }); }
  if (ph === 1) { const tP = spW(a, '천재', 2.4), tH = spW(a, '행복', 4.3), tL = spW(a, '부족', 6.3);
    hud += fkAt(560, 300, gfPanel(560, 220, { bg: '#fff' }) + gfT(-210, -30, '힘', 44, GFC.navy) + `<g transform="translate(-160 -46)">${gfBar(380, gfK(spW(a, '힘을', 1.6), tP + 0.4, lt), { h: 34, col: '#4FD8F0' })}</g>` +
      gfT(-210, 66, '행복', 40, GFC.navy) + `<g transform="translate(-160 50)">${gfBar(380, 0.18 * gfK(tH, tH + 0.6, lt), { h: 34, col: GFC.coral })}</g>`, gfIn(lt, 0.3, 3, 0.45));
    if (lt > tL) hud += gfChipAt(lt, tL, 560, 470, '뜻을 옮김', { size: 30, bg: '#fff' }); }
  if (ph === 2) { const tB = spW(a, '책', 0.65), tS = spW(a, '문장', 3.2); hud += gfChipAt(lt, tB, 960, 260, '『사피엔스』 마지막 장', { size: 46, icon: 'book', bg: '#fff' }); if (lt > tS) hud += gfStarBurst(lt, tS, 960, 260, { r1: 200, n: 9 }); }
  if (ph === 3) {   // 진짜 질문: "어떤 존재" ✕ → "무엇을 원하고 싶은가"
    const tE = spW(a, '어떤', 2.83), tN = spW(a, '아니라', 4.75), tW = spW(a, '무엇', 6.13), k = gfIn(lt, 0.2, 3, 0.45);
    let c = gfPanel(1000, 380, { bg: '#FFFDF6' }) + gfT(0, -128, '우리가 마주한 진짜 질문은', 40, '#7A8094');
    if (lt > tE) c += gfT(0, -36, '"어떤 존재가 되고 싶은가?"', 50, lt > tN ? '#A9AEBB' : GFC.navy) + (lt > tN ? `<line x1="-330" y1="-52" x2="${f1(lerp(-330, 330, gfK(tN, tN + 0.35, lt)))}" y2="-52" stroke="#E5484D" stroke-width="10" stroke-linecap="round"/>` : '');
    if (lt > tW) c += `<g transform="scale(${f1(gfIn(lt, tW, 3, 0.45) * 100) / 100})">${gfT(0, 76, '"무엇을 원하고 싶은가?"', 58, GFC.coral)}</g>` + gfT(0, 150, '— 『사피엔스』 20장', 28, '#7A8094');
    hud += fkAt(960, 420, c, k); warm = 0.15; }
  if (ph === 4) {   // 거창한 타이틀 ✕ → 친구와 국밥 한 그릇, 하트 가득
    const tTi = spW(a, '타이틀', 2.05), tNo = spW(a, '말고', 2.49), tWa = spW(a, '작고', 5.05), tHo = spW(a, '따뜻', 5.69);
    const tk = gfIn(lt, tTi - 0.1, 3, 0.45) * (1 - gfK(tNo + 0.1, tNo + 0.35, lt));
    if (tk > 0.02) hud += fkAt(960, 300, `<g>${spTrophy(3)}</g>` + gfT(0, 150, '거창한 타이틀', 40, GFC.navy), tk);
    if (lt > tNo + 0.1) hud += gfPuff(lt, tNo + 0.1, 960, 300, 2.4);
    const fx = 1380, pk = gfIn(lt, tWa - 0.4, 3, 0.45);
    w += `<ellipse cx="${(fx + zx) / 2}" cy="${zy + 10}" rx="${f1(300 * Math.max(pk, 0.01))}" ry="${f1(50 * Math.max(pk, 0.01))}" fill="#FFB3B3" stroke="${INK}" stroke-width="6" opacity="${f1(pk * 100) / 100}"/>`;
    { const wl = 1 - easeOut(gfK(tWa - 0.9, tWa - 0.1, lt)), wk = gfWalk(wl * 400, 1, 0.05); w += gfActor(spDoyun, { x: fx - 420 * wl, y: zy, s: zs, t, pose: wl > 0.02 ? wk.pose : SP_P.sit, ex: fEx(lt > tHo ? 'z빵긋' : 'z기본'), look: [0.6, 0], seed: 33 }, wl > 0.02 ? { sy: wk.sy, dy: wk.dy } : {}); }
    w += gfActor(FKZW, { x: zx, y: zy, s: zs, t, pose: SP_P.sit, ex: fEx(lt > tHo ? 'z하트눈' : 'z빵긋'), look: [-0.6, 0], seed: 3 }, lt > tHo ? gfJelly(lt, tHo, 0.08, 4, 7) : {});
    w += spBowl(fx + 90, zy - 40, t, gfIn(lt, tWa, 3.4, 0.42) * 0.9) + spBowl(zx - 90, zy - 40, t, gfIn(lt, tWa + 0.15, 3.4, 0.42) * 0.9);
    if (lt > tHo) w += gfEmote(lt, tHo, (fx + zx) / 2, zy - 470 * zs, 'heart', { hold: 9, s: 1.2 });
    hv = lt > tHo ? 5 : 4; hp = tHo; warm = 0.35 * gfK(tHo - 0.3, tHo + 1.2, lt);
    cam = qLerpCam(gfK(tWa - 0.6, tWa + 0.8, lt), [1080, 580, 0.92], [1470, 700, 1.3]); }
  else if (ph === 0) cam = qLerpCam(gfK(0, 3, lt), [1080, 580, 0.92], [960, 540, 0.86]);
  else cam = [960, 540, 0.86];
  let h = fkDefs() + `<rect x="-600" y="-600" width="3120" height="2280" fill="#CDE9B8"/><g transform="translate(960 560) scale(1.14) translate(-960 -560)">${qPlate('meadow', cam, 0.5)}</g>` + qCam(cam, w);
  if (warm > 0.01) h += `<rect x="-300" y="-300" width="2600" height="1600" fill="#FFB46A" opacity="${f1(warm * 100) / 100}"/>`;
  return h + hud + spHud(lt, hv, { from: hv === 5 ? 4 : hv, tp: hp, clock: '자유 시간' });
}

/* ===== e1~e4: 노을 초원 산책 + 빈칸 질문 카드 ===== */
function spendScene(t, lt, a) {
  const ph = a.ph, run = a._run; let w = '', hud = '';
  const walkK = clamp(run / 26, 0, 1), zx = lerp(560, 1200, walkK), zs = lerp(0.82, 0.62, walkK), zy = lerp(930, 820, walkK);
  // 작아지는 점선 상자(뒤에 남겨 둠)
  w += `<g transform="translate(${f1(lerp(260, 120, walkK))} ${f1(lerp(700, 660, walkK))}) scale(${f1(lerp(0.32, 0.18, walkK) * 1000) / 1000}) translate(-960 -600)">${spBoxWalls(run, { door: 1, fill: 0.4 })}</g>`;
  // 빌려 쓴 약속들(동전·명찰·별점)이 점선이 되어 상자로 돌아감
  if (ph === 0) { const T = [spW(a, '돈도', 0.15), spW(a, '직급', 0.67), spW(a, '평가', 2.47)], tB = spW(a, '빌려', 5.19), tV = spW(a, '가치', 8.23);
    T.forEach((t0, i) => { const k = gfIn(lt, t0, 3.4, 0.42), u = easeInOut(gfK(tB + i * 0.15, tB + 1.2 + i * 0.15, lt)); if (k < 0.02 || u >= 1) return;
      const x = lerp(zx - 160 + i * 160, lerp(260, 120, walkK), u), y = lerp(zy - 560 * zs, lerp(700, 660, walkK) - 40, u) - Math.sin(Math.PI * u) * 120;
      const ic = [spCoin(1.6), spTag('대리', 1.4), `<g transform="scale(1.6)">${GF_ICON.star(t)}</g>`][i]; w += `<g opacity="${f1((1 - 0.4 * u) * 100) / 100}">${fkAt(x, y, ic + (u > 0 ? `<circle r="46" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="10 8"/>` : ''), k * (1 - 0.6 * u))}</g>`; });
    if (lt > tV) w += fkAt(zx, zy - 300 * zs, `<g transform="scale(2.2)">${GF_ICON.heart(t)}</g>`, gfIn(lt, tV, 3, 0.45) * gfBeat(lt, tV + 0.4, 0.12, 2.2, 3)) + gfRing(lt, tV, zx, zy - 300 * zs, 30, 160, '#FFE38A', 10, 0.6);
    if (lt > tV) hud += gfChipAt(lt, tV + 0.2, 960, 140, '실선 = 진짜, 당신의 가치', { size: 38, bg: '#FFF3C4' }); }
  // 제로가 노을 쪽으로 천천히 걸어감(e4에서 돌아보며 손 인사)
  const wave = ph === 3 && lt > spW(a, '제로의', 3.29) - 0.4, wk = gfWalk(run * 140, 0.8, 0.045);
  w += gfActor(FKZW, { x: zx, y: zy, s: zs, t, pose: wave ? '손인사' : wk.pose, ex: fEx(wave ? 'z빵긋' : 'z기본'), look: wave ? [0, 0] : [0.7, -0.2], seed: 3, sweat: false }, wave ? gfJelly(lt, spW(a, '제로의', 3.29) - 0.4, 0.08, 3, 6) : { sy: wk.sy, dy: wk.dy });
  // 빈칸 질문 카드
  if (ph >= 1 && ph <= 2) { const k = ph === 1 ? gfIn(lt, spW(a, '조급', 1.37) - 0.2, 3, 0.45) : 1, k2 = ph === 2 ? gfIn(lt, spW(a, '내일', 0.37), 3, 0.45) : 0;
    let c = gfPanel(1040, ph === 2 ? 300 : 170, { bg: '#FFFDF6' }) + gfT(-470, ph === 2 ? -64 : 14, '나를 조급하게 만든 보이지 않는 규칙:', 40, GFC.navy, { anchor: 'start' }) + `<line x1="230" y1="${ph === 2 ? -54 : 24}" x2="470" y2="${ph === 2 ? -54 : 24}" stroke="${INK}" stroke-width="5" stroke-dasharray="14 10"/>`;
    if (ph === 2) c += `<g opacity="${f1(k2 * 100) / 100}">${gfT(-470, 60, '내일, 규칙 밖의 진짜 하루:', 40, GFC.coral, { anchor: 'start' })}<line x1="90" y1="70" x2="470" y2="70" stroke="${INK}" stroke-width="5" stroke-dasharray="14 10"/></g>`;
    hud += fkAt(960, ph === 2 ? 300 : 260, c, k);
    if (ph === 2) { const tC = spW(a, '댓글', 5.17); hud += gfChipAt(lt, tC, 1560, 520, '댓글로 들려주세요', { size: 40, icon: 'letter', bg: '#fff' }); } }
  if (ph === 3) { const tD = spW(a, '하루', 2.83); if (lt > tD) w += gfEmote(lt, tD, zx + 110, zy - 500 * zs, 'heart', { hold: 9 }); }
  const cam = qLerpCam(walkK, [900, 600, 1.0], [1000, 600, 1.08]);
  let h = fkDefs() + `<rect x="-600" y="-600" width="3120" height="2280" fill="#F6B98A"/>` + qPlate('sunset', cam, 0.4) + qCam(cam, w) + `<rect x="-300" y="-300" width="2600" height="1600" fill="#FFB46A" opacity=".12"/>`;
  if (ph === 3) { const f = gfK(spW(a, '세계', 4.17) + 0.9, spW(a, '세계', 4.17) + 3.0, lt); if (f > 0) h += `<rect x="-300" y="-300" width="2600" height="1600" fill="#FFE9C8" opacity="${f1(f * 0.55 * 100) / 100}"/>`; }
  return h + hud + spHud(lt, 5, { clock: 'PM 06:40' });
}
