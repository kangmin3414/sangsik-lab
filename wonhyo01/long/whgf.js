/* 원효 편 샘플 v2 — 게임 감각 층(zw/gf.js)으로 다시 연출. 대본·목소리·타임라인은 v1과 같고 장면 함수만 바꿔 끼운다(whscenes.js 뒤에 읽는다).
   한 편을 꿰는 표시 하나: '마음 게이지'(얼굴 + 막대). 같은 문·같은 자리·같은 와인에서 게이지만 달라진다 = 이 편이 하려는 말.
   새 이름은 wg 접두사. 무대는 AI 그림 판 대신 단순한 세트(gfRoom·gfHill…)를 쓴다. */
window.GFR = { boil: false, vig: false, flash: false, study: false, sub: gfSubtitle, over: t => gfTransition(t, { k0: ['iris', 1014, 478, 960, 540], w1: 'bands', t1: 'bands', d1: ['iris', 960, 540], d5: 'bands' }) };
const wgAt = (x, y, inner, sc = 1, rot = 0) => sc < 0.02 ? '' : `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(sc * 1000) / 1000})">${inner}</g>`;
const wgV = (keys, lt) => clamp(actTrack(keys.map(k => [k[0], k[1], { f: 2.4, z: 0.55, ant: 0 }]), lt), 0, 1);
const wgMoodHud = (lt, v, o = {}) => wgAt(o.x || 1560, o.y || 128, gfMood(v, Object.assign({ t: lt }, o)), 1.28 * gfIn(lt, o.t0 == null ? -9 : o.t0, 3, 0.45));
const wgDayChip = () => wgAt(230, 120, gfChip('1일 차', { icon: 'star', bg: GFC.sun, size: 44 }), 1, -3);
const wgTint = (col, k) => k > 0.004 ? `<rect x="-600" y="-600" width="3120" height="2280" fill="${col}" opacity="${f1(k * 1000) / 1000}"/>` : '';
const wgSleep = { expr: '잠', prev: '잠', k: 1, blink: 0 };

/* ===== 1~3: 같은 문, 다른 마음 ===== */
function wgCal(x, y, fri) { const k = Math.max(0.05, Math.abs(1 - 2 * fri)), on = fri >= 0.5;
  return wgAt(x, y, `<g transform="scale(1 ${f1(k * 100) / 100})"><rect x="-74" y="-84" width="148" height="172" rx="18" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-74" y="-84" width="148" height="50" rx="16" fill="${on ? '#FF9A55' : '#6C8CFF'}" stroke="${INK}" stroke-width="7"/><circle cx="-36" cy="-84" r="9" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="36" cy="-84" r="9" fill="#fff" stroke="${INK}" stroke-width="5"/>${gfT(0, 62, on ? '금' : '월', 92, on ? '#E8742A' : '#3F5BD9')}</g>`); }
function wgDoorSet(t, cam, o = {}) {
  const fri = o.fri || 0, mins = lerp(540, 1770, easeInOut(fri)), horn = o.horn || 0;
  let h = gfRoom({ wall: '#FFE9B8', wall2: '#FFD98F', floor: '#EFC08A', fy: 900 });
  if (horn > 0.02) h += [[96, -8], [364, 8]].map(([x, r]) => wgAt(x, 286, `<path d="M-34 6 Q-6 -30 6 -84 Q26 -34 34 6 Z" fill="${GFC.coral}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`, horn, r)).join('');
  h += gfDoor(230, 900, 1) + wgAt(230, 226, gfChip('회의실', { size: 38, icon: 'door' }), gfBeat(o.lt || 0, o.tSign == null ? -9 : o.tSign, 0.18, 3.5, 6));
  h += wgCal(740, 330, fri) + gfClock(950, 330, 62, Math.floor(mins / 60), mins % 60) + gfWindow(1150, 300, 400, 310, t) + gfPlant(1700, 900, 1.05, t);
  return gfLayer(cam, 0.9, h);
}
whdoorScene = function (t, lt, a) {
  const ph = a.ph, y = WH.GY, zx = 560, s = 0.95; let cam, ex = fEx('z기본'), look = [-0.9, -0.1], m = {}, fri = 0, mon = 0.25, horn = 0, v = 0.3, emo = '', chips = '', tp = null, hurt = false, tSign = null;
  const top = gfAbove(zx, y, s, 70, 0);
  if (ph === 0) { // 문 앞에서 숨 한 번
    m = { sy: actInhale(lt, 1.0, 0.7, 0.05) }; look = [-0.95, -0.15]; cam = qLerpCam(lt / 1.7, [560, 600, 1.06], [540, 606, 1.12]);
    emo = gfEmote(lt, 0.35, top[0], top[1], 'dots', { hold: 1.1 }); v = wgV([[0, 0.5], [0.5, 0.3]], lt); tp = 0.5;
  } else if (ph === 1) { // 같은 회사·같은 회의실·같은 팀장님 → 월요일엔 지옥, 금요일엔 그럭저럭
    const t1 = whW(a, '회사', 0.55), t2 = whW(a, '회의실', 1.6), t3 = whW(a, '팀장님', 2.6), tH = whW(a, '지옥', 4.8), tF = whW(a, '어떤', 5.5, 1), tO = whW(a, '그럭저럭', 6.3);
    fri = easeInOut(gfK(tF, tF + 0.5, lt)); const hell = gfK(tH - 0.1, tH + 0.2, lt) * (1 - fri); mon = lerp(0.12, 0.3, hell) * (1 - fri); horn = gfIn(lt, tH, 3.4, 0.4) * gfOut(lt, tF, 0.2); tSign = t2;
    v = wgV([[0, 0.3], [tH, 0.08], [tO - 0.15, 0.68]], lt); tp = lt > tO - 0.15 ? tO - 0.15 : (lt > tH ? tH : null); hurt = lt > tH && lt < tF;
    cam = qLerpCam(lt / (a._dur || 7), [700, 560, 1.0], [680, 560, 1.04]);
    ex = fEx(lt > tO - 0.1 ? 'z빵긋' : lt > tH ? 'z멍' : 'z기본'); if (lt > tO - 0.1) { m = gfHop(lt, tO, 40, 0.4); look = [-0.3, -0.2]; }
    emo = gfEmote(lt, tH + 0.05, top[0], top[1], 'gloom', { hold: tF - tH - 0.2 }) + gfEmote(lt, tO + 0.1, top[0], top[1], 'note', { hold: 1.4 });
    chips = gfChipAt(lt, t1, 230, 120, '같은 회사', { icon: 'building', size: 40, rot: -2 }) + gfChipAt(lt, t2, 590, 120, '같은 회의실', { icon: 'door', size: 40, rot: 1 }) + gfChipAt(lt, t3, 975, 120, '같은 팀장님', { icon: 'tie', size: 40, rot: -1 });
  } else { // 다시 월요일: "…오늘은 지옥이네."
    E['_whz'] = qTalk('z멍', env(t)); ex = fEx('_whz'); mon = 0.3; horn = 1; look = [-0.6, 0.05]; v = 0.08;
    cam = qLerpCam(lt / (a._dur || 1.6), [540, 640, 1.5], [540, 648, 1.56]); emo = gfEmote(lt, 0.15, top[0] + 20, top[1] + 40, 'sweat', { hold: 1.4, s: 0.9 });
  }
  const w = gfActor(WZ, { x: zx, y, s, t, ex, look, seed: 3 }, m) + emo;
  return gfDefs() + wgDoorSet(t, cam, { fri, horn, lt, tSign }) + qCam(cam, w) + wgTint('#5B4FCF', mon * 0.45) + wgTint('#FFC36B', fri * 0.16) + chips + wgMoodHud(lt, v, { t0: ph === 0 ? 0.25 : null, tp, hurt });
};

/* ===== 4: 신라, 원효 ===== */
function wgPagoda(x, y, s) { let h = `<rect x="-130" y="-30" width="260" height="30" rx="6" fill="#C9D1DB" stroke="${INK}" stroke-width="7"/>`, yy = -30;
  [[200, 84], [156, 70], [112, 58]].forEach(([w, hh]) => { h += `<rect x="${-w / 2 + 18}" y="${yy - hh}" width="${w - 36}" height="${hh}" fill="#E4E9EF" stroke="${INK}" stroke-width="7"/>`; yy -= hh;
    h += `<path d="M${-w / 2 - 34} ${yy} Q${-w / 2 - 6} ${yy - 8} ${-w / 2 + 6} ${yy - 30} L${w / 2 - 6} ${yy - 30} Q${w / 2 + 6} ${yy - 8} ${w / 2 + 34} ${yy} Z" fill="#9FB0C4" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`; yy -= 30; });
  h += `<rect x="-8" y="${yy - 56}" width="16" height="56" rx="6" fill="#9FB0C4" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="${yy - 64}" r="13" fill="${GFC.sun}" stroke="${INK}" stroke-width="6"/>`;
  return wgAt(x, y, h, s); }
function wgSilla(t, cam) {
  let far = gfFull('url(#gfDawn)') + gfSun(1560, 250, 66, t) + gfClouds(t, 110, 3, 4, 12, 0.9) + gfHill(560, 170, 980, '#A9DCEB', 0) + gfHill(650, 130, 700, '#86CFC6', 300);
  let mid = gfHill(780, 60, 820, '#8ADB6A', 120, '#4FA85A') + wgPagoda(980, 772, 0.95) + gfPine(230, 900, 1.25, t) + gfTree(1900, 900, 0.9, t);
  let near = `<path d="M-700 1500 L-700 905 Q300 880 960 898 Q1600 915 2700 890 L2700 1500 Z" fill="#F4DC9E" stroke="${INK}" stroke-width="7"/>` + [[420, 912, 1], [1180, 916, 0.9], [1700, 908, 1.1], [760, 1010, 1.2]].map(([x, y, s]) => gfGrass(x, y, s)).join('') + [[300, 1050], [900, 1080], [1500, 1040]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="90" ry="10" fill="#fff" opacity=".3"/>`).join('');
  return gfLayer(cam, 0.3, far) + gfLayer(cam, 0.6, mid) + gfLayer(cam, 1, near);
}
whsillaScene = function (t, lt, a) {
  const tW = whW(a, '원효', (a._dur || 6) - 0.6), y = WH.GY - 20, s = 0.9, tStop = 2.3, xk = easeOut(gfK(0.1, tStop, lt)), x = lerp(-160, 640, xk), walking = lt < tStop;
  const cam = qLerpCam(lt / (a._dur || 6), [960, 590, 1.0], [960, 586, 1.05]), wk = gfWalk(x, 0.8), hop = gfHop(lt, tStop + 0.05, 30, 0.34), cheer = gfHop(lt, tW + 0.05, 46, 0.4);
  let w = gfActor(WHO, { x, y, s, t, pose: walking ? wk.pose : '서기', ex: fEx(lt > tW ? 'z빵긋' : 'z기본'), look: walking ? [0.6, 0] : [0.5, -0.2], seed: 21 }, walking ? { sy: wk.sy } : gfM(hop, cheer));
  w += gfPuff(lt, tStop + 0.39, x, y, 1) + gfPuff(lt, tW + 0.45, x, y, 1);
  // 인물 카드: 이름은 마지막에 밝혀진다
  const ck = gfIn(lt, 0.7, 2.8, 0.5), named = lt > tW, cx = 1480, cy = 470; let card = gfPanel(640, 430, { head: '신라의 스님', headBg: '#BDE7C9' });
  card += named ? '' : gfT(0, -92, '???', 92, '#C9BFA8');
  [['calendar', '617 ~ 686 · 신라', 1.2], ['book', '80여 편의 책', 1.9], ['family', '설총의 아버지', 2.6]].forEach(([ic, tx, t0], i) => { const k = gfIn(lt, t0, 3.4, 0.45); if (k > 0.02) card += wgAt(-250, -8 + i * 82, `<g transform="translate(26 0)">${gfIcon(ic, 0.95, t)}</g>` + gfT(74, 15, tx, 42, GFC.navy, { anchor: 'start' }), k); });
  let h = gfDefs() + wgSilla(t, cam) + qCam(cam, w) + wgAt(cx, cy + Math.sin(t * 1.8) * 3, card, ck, 2);
  if (named) h += gfBounceText(lt, tW, cx, cy - 76, [['원효', GFC.navy]], { size: 104, stroke: '#fff', sw: 18, wave: 3 }) + gfStarBurst(lt, tW + 0.05, cx, cy - 110, { r1: 230 }) + gfRing(lt, tW, cx, cy - 110, 40, 240, GFC.sun);
  return h;
};

/* ===== 5: 우리가 아는 해골물은 가장 오래된 기록에 없다 ===== */
whskullScene = function (t, lt, a) {
  const tB = whW(a, '그런데', 2.6), tX = whW(a, '나오지', (a._dur || 7) - 1.2), sh = gfShake(lt, tX, 12, 0.3), j = gfJelly(lt, tX, 0.1);
  let h = gfDefs() + gfFull('#FFF1CF') + gfFull('url(#gfDots)') + gfRays(t, 960, 560, 1500, '#fff', 14, 0.28, 5);
  const card = `<rect x="-330" y="-230" width="660" height="480" rx="34" fill="${GFC.navy}" opacity=".2"/><rect x="-330" y="-240" width="660" height="480" rx="34" fill="#FFFBF0" stroke="${INK}" stroke-width="9"/>` +
    `<path d="M-200 40 Q0 220 200 40 Z" fill="#D9A566" stroke="${INK}" stroke-width="9"/><ellipse cx="0" cy="40" rx="200" ry="34" fill="#8FD0F0" stroke="${INK}" stroke-width="7"/><g transform="translate(40 ${f1(-6 + Math.sin(t * 2.2) * 5)}) scale(3.1)">${GF_ICON.skull()}</g>` + gfT(0, -160, '우리가 아는 해골물', 54, GFC.navy);
  h += `<g transform="translate(${f1(960 + sh[0])} ${f1(560 + sh[1])}) rotate(${f1(-2 + (lt > tX ? -3 * gfK(tX, tX + 0.2, lt) : 0))}) scale(${f1(gfIn(lt, 0.1, 2.8, 0.45) * j.sx * 1000) / 1000} ${f1(gfIn(lt, 0.1, 2.8, 0.45) * j.sy * 1000) / 1000})">${card}</g>`;
  h += gfChipAt(lt, tB, 960, 170, '가장 오래된 기록 · 『송고승전』', { icon: 'scroll', size: 42, bg: GFC.sun, rot: -2 });
  h += wgAt(1120, 500, gfStamp(lt, tX, '없음', { size: 150, rot: -12 })) + gfEmote(lt, tX + 0.25, 1180, 300, 'q', { hold: 2, s: 1.2 }) + gfStarBurst(lt, tX, 1120, 500, { r1: 260, cols: ['#fff', GFC.coral, GFC.sun] });
  return h;
};

/* ===== 6~8: 토굴 = 옛 무덤 ===== */
function wgCave(t, o = {}) { // day 0(밤)~1(아침), tomb 0~1(무덤인 줄 알아본 정도), rain
  const day = o.day || 0, tomb = o.tomb || 0, wall = gfMix('#3B4780', '#B79F88', day), wall2 = gfMix('#2E3868', '#9C8570', day), floor = gfMix('#2B3462', '#D8BF98', day), hi = gfMix(wall, '#ffffff', 0.1);
  let h = gfFull(day > 0.5 ? 'url(#gfDawn)' : 'url(#gfNight)');
  if (day > 0.5) h += gfSun(1700, 470, 44, t) + gfHill(760, 60, 500, '#8ADB6A', 80, '#4FA85A'); else h += wgAt(1700, 470, gfIcon('moon', 1.5)) + gfTwinkle(t, 1560, 560, 12, 1, '#FFF3B8') + gfTwinkle(t, 1800, 640, 9, 3);
  if (o.rain) for (let i = 0; i < 26; i++) { const x = 1420 + hash(i * 3.1) * 480, y0 = 330 + ((t * 760 + hash(i) * 620) % 620); h += `<line x1="${f1(x)}" y1="${f1(y0)}" x2="${f1(x - 8)}" y2="${f1(y0 + 36)}" stroke="#BFE0FF" stroke-width="5" stroke-linecap="round" opacity=".8"/>`; }
  h += `<path fill-rule="evenodd" d="M-700 -700H2700V1800H-700Z M1420 906 L1420 570 Q1420 330 1660 330 Q1900 330 1900 570 L1900 906 Z" fill="${wall}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>`;
  [[300, 300, 190, 110], [760, 220, 230, 100], [1150, 420, 160, 90], [560, 600, 170, 80], [1980, 200, 120, 200], [120, 660, 120, 70]].forEach(([x, y, rx, ry]) => { h += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${hi}" opacity=".55"/>`; });
  [[160, 150], [520, 110], [900, 170], [1260, 120], [1700, 90]].forEach(([x, d]) => { h += `<path d="M${x - 70} -40 Q${x - 20} ${d * 0.6} ${x} ${d} Q${x + 20} ${d * 0.6} ${x + 70} -40 Z" fill="${wall2}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`; });
  h += `<path d="M-700 1800 L-700 904 Q600 884 1420 906 L1900 906 Q2300 900 2700 910 L2700 1800 Z" fill="${floor}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  if (day > 0.02) h += `<path d="M1420 560 L560 1010 L1500 1010 L1900 906 L1420 906 Z" fill="#FFF3B8" opacity="${f1(0.34 * day * 100) / 100}"/>`;
  // 무덤 살림: 어두울 땐 바위 덩이로만 보이고, 알아보면 제 색이 돈다
  const st = gfMix(wall2, '#D9C7A6', tomb), st2 = gfMix(wall2, '#B9A482', tomb), bone = gfMix(wall2, '#FFFDF4', tomb), ink = f1(lerp(0.3, 1, tomb) * 100) / 100;
  [[840, 170, 230], [1010, 190, 280], [1200, 160, 200]].forEach(([x, w, hh], i) => { h += `<g opacity="1"><rect x="${x - w / 2}" y="${900 - hh}" width="${w}" height="${hh}" rx="30" fill="${i % 2 ? st2 : st}" stroke="${INK}" stroke-opacity="${ink}" stroke-width="8"/>` + (tomb > 0.3 ? `<path d="M${x - 30} ${900 - hh * 0.55} q30 -44 60 0 q-30 40 -44 6 q10 -22 24 -8" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity="${f1(0.45 * tomb * 100) / 100}"/>` : '') + `</g>`; });
  h += `<g transform="translate(1320 884)" opacity="${f1(lerp(0.0, 1, tomb) * 100) / 100}"><path d="M-70 16 L70 -6 M-66 -8 L66 18" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M-70 16 L70 -6 M-66 -8 L66 18" stroke="${bone}" stroke-width="10" stroke-linecap="round"/><g transform="translate(0 -34) scale(${f1(1.9 * (o.skullPop || 1) * 100) / 100})">${GF_ICON.skull()}</g></g>`;
  return h;
}
function wgDial(x, y, k, lt, tc) { // 밤(0) ↔ 아침(1)
  return wgAt(x, y, gfPanel(132, 132, { r: 66 }) + wgAt(0, 0, gfIcon('moon', 1.25), 1 - k, -120 * k) + wgAt(0, 0, gfIcon('sun', 1.35, lt), k, 120 * (1 - k)), gfBeat(lt, tc == null ? -9 : tc, 0.16, 3.5, 7)) + wgAt(x, y + 100, gfChip(k > 0.5 ? '아침' : '밤', { size: 30, bg: k > 0.5 ? GFC.sun : '#C9CFFF' })); }
function wgToken(x, y, col, hop, ex) { return wgAt(x, y - hop, `<ellipse cx="0" cy="${f1(40 + hop)}" rx="${f1(30 - hop * 0.4)}" ry="7" fill="${GFC.navy}" opacity=".2"/><path d="M-26 40 Q-26 12 0 12 Q26 12 26 40 Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><circle cx="0" cy="-8" r="30" fill="#fff" stroke="${INK}" stroke-width="6"/><ellipse cx="-9" cy="-9" rx="4" ry="5.5" fill="${INK}"/><ellipse cx="11" cy="-9" rx="4" ry="5.5" fill="${INK}"/>` + (ex ? `<path d="M-4 5 Q1 1 6 5" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` : `<path d="M-4 3 Q1 8 6 3" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`)); }
function wgSleepers(t, wake, o = {}) { // 의상(뒤)·원효(앞). wake 0~1이면 원효가 일어난다
  const y = WH.GY - 6; let w = gfBlob(1020, y, 120) + UIS({ x: 960, y: y - 30, s: 0.62, rot: 90, t, ex: wgSleep, noBlink: true, still: true, seed: 5 });
  if (wake < 0.5) w += gfBlob(560, y, 120) + WHO({ x: 500, y: y - 30, s: 0.66, rot: 90, t, ex: o.lieEx || wgSleep, noBlink: !o.lieEx, still: true, look: [0.6, -0.3], seed: 6 });
  else w += gfActor(WHO, { x: 560, y, s: 0.84, t, pose: '웅크림', ex: fEx(o.ex || 'z충격'), look: o.look || [0.9, 0.1], seed: 6 }, o.m || {});
  return w;
}
whcaveScene = function (t, lt, a) {
  const tGo = whW(a, '당나라로', 1.7), tR = whW(a, '비를', 4.5), tC = whW(a, '토구', 5.1), tM = whW(a, '아침', 7.1), tS = whW(a, '해골이', 8.9), tT = whW(a, '무덤', 10.3);
  if (lt < tC) { // 길 떠나기: 지도 한 장
    let h = gfDefs() + gfFull('#BFE9FF') + gfFull('url(#gfDots)') + gfClouds(t, 60, 3, 9, 10, 0.8);
    const pk = gfIn(lt, 0.05, 2.6, 0.5), P0 = [-520, 110], C = [0, -210], P1 = [520, 110], bz = p => [(1 - p) * (1 - p) * P0[0] + 2 * (1 - p) * p * C[0] + p * p * P1[0], (1 - p) * (1 - p) * P0[1] + 2 * (1 - p) * p * C[1] + p * p * P1[1]];
    const prog1 = 0.46 * easeInOut(gfK(0.5, tR - 0.2, lt)), stop = lt > tR - 0.2; let m = gfPanel(1500, 560, { bg: '#FFF6DC', head: '공부하러 가는 길', headBg: '#BDE7C9' });
    m += `<ellipse cx="-560" cy="150" rx="210" ry="110" fill="#A6E38C" stroke="${INK}" stroke-width="7"/><ellipse cx="560" cy="150" rx="210" ry="110" fill="#F7C98A" stroke="${INK}" stroke-width="7"/>`;
    for (let i = 0; i <= 24; i++) { const p = i / 24, q = bz(p); m += `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${p <= prog1 + 0.01 ? 10 : 8}" fill="${p <= prog1 + 0.01 ? GFC.coral : '#D9CDB0'}" stroke="${INK}" stroke-width="${p <= prog1 + 0.01 ? 4 : 0}"/>`; }
    m += wgAt(-560, 214, gfChip('신라', { icon: 'pin', size: 44 })) + wgAt(560, 214, gfChip('당나라', { icon: 'flag', size: 44, bg: GFC.sun }), gfIn(lt, tGo, 3.2, 0.42));
    const q1 = bz(prog1), q2 = bz(Math.max(0, prog1 - 0.06)), hp = x => stop ? 0 : Math.abs(Math.sin(x * 0.11)) * 18;
    m += wgAt(q2[0], q2[1] - 70, wgToken(0, 0, '#B5A27E', hp(q2[0] + 30), stop), 1.7) + wgAt(q1[0], q1[1] - 70, wgToken(0, 0, '#9EA3AC', hp(q1[0]), stop), 1.7);
    if (lt > tR - 0.1) { m += wgAt(q1[0] - 20, q1[1] - 250 + Math.sin(t * 3) * 4, gfIcon('rain', 2.8), gfIn(lt, tR - 0.1, 3.2, 0.42)); for (let i = 0; i < 7; i++) { const yy = ((t * 300 + i * 37) % 90); m += `<line x1="${f1(q1[0] - 90 + i * 24)}" y1="${f1(q1[1] - 190 + yy)}" x2="${f1(q1[0] - 96 + i * 24)}" y2="${f1(q1[1] - 170 + yy)}" stroke="#4DA8FF" stroke-width="5" stroke-linecap="round" opacity=".8"/>`; } }
    return h + wgAt(960, 520, m, pk, -1);
  }
  const u = lt - tC, day = easeInOut(gfK(tM - 0.1, tM + 0.7, lt)), cam = qLerpCam(u / 6, [900, 640, 1.06], [900, 650, 1.12]), wake = gfK(tS, tS + 0.01, lt);
  const hop = gfHop(lt, tS + 0.02, 60, 0.42), sh = lt > tT ? { dx: Math.sin(t * 40) * 3 } : {};
  let w = wgSleepers(t, wake, { ex: 'z충격', look: [0.9, 0.2], m: gfM(hop, sh) });
  if (lt < tS) w += gfEmote(lt, tC + 0.5, 660, 790, 'zzz', { hold: tS - tC - 0.6, s: 1.7 }) + gfEmote(lt, tC + 0.9, 1130, 790, 'zzz', { hold: tS - tC - 1.0, s: 1.4 });
  const sk = gfBeat(lt, tS, 0.5, 3.2, 5), top = gfAbove(560, WH.GY, 0.84, 60, 30);
  w += gfEmote(lt, tS + 0.05, top[0], top[1], 'bang', { hold: 1.6 }) + gfRing(lt, tS, 1320, 850, 30, 200, '#fff') + gfStarBurst(lt, tS, 1320, 840, { r1: 170, n: 6 }) + gfPuff(lt, tS + 0.45, 560, WH.GY, 1);
  let h = gfDefs() + gfLayer(cam, 1, wgCave(t, { day, tomb: day, rain: lt < tM, skullPop: lt > tS ? sk : 1 }) + w);
  h += wgDial(170, 118, day, lt, tM) + gfChipAt(lt, tT, 1040, 430, '옛 무덤', { size: 54, bg: '#E7E0FF', icon: 'skull', rot: -4 }) + gfRing(lt, tT, 1040, 430, 60, 260, '#E7E0FF');
  h += wgMoodHud(lt, wgV([[tC, 0.82], [tS, 0.35], [tT, 0.2]], lt), { label: '원효의 마음', w: 440, t0: tC + 0.3, tp: lt > tT ? tT : (lt > tS ? tS : null), hurt: lt > tS });
  return h;
};
whghostScene = function (t, lt, a) {
  const tN = whW(a, '밤', 0.7), tK = whW(a, '무덤인', 1.0), tSm = whW(a, '같은', 2.5), tG = whW(a, '귀신', 5.1), day = 1 - easeInOut(gfK(tN - 0.3, tN + 0.5, lt));
  const cam = qLerpCam(lt / (a._dur || 6), [900, 640, 1.08], [900, 650, 1.16]), up = lt > tG, hop = gfHop(lt, tG + 0.02, 70, 0.44), top = gfAbove(560, WH.GY, 0.84, 60, 30);
  E['_whl'] = Object.assign({}, E['z당황'] || E['걱정']);
  let w = gfBlob(1020, WH.GY - 6, 120) + UIS({ x: 960, y: WH.GY - 36, s: 0.62, rot: 90, t, ex: wgSleep, noBlink: true, still: true, seed: 5 });
  if (!up) w += gfBlob(560, WH.GY - 6, 120) + WHO({ x: 500, y: WH.GY - 36, s: 0.66, rot: 90, t, ex: fEx('_whl'), look: [0.8, -0.2], shiver: lt > tK, seed: 6 }) + gfEmote(lt, tK + 0.2, 700, 760, 'sweat', { hold: tG - tK - 0.3, s: 0.9 });
  else w += gfActor(WHO, { x: 560, y: WH.GY, s: 0.84, t, pose: '만세', ex: fEx('z소름'), look: [0.9, -0.4], shiver: true, seed: 6 }, hop) + gfEmote(lt, tG + 0.08, top[0], top[1] - 40, 'bang', { hold: 1.4 }) + gfPuff(lt, tG + 0.46, 560, WH.GY, 1);
  // 귀엽게 솟는 귀신
  const gk = gfIn(lt, tG - 0.15, 2.6, 0.4); if (gk > 0.02) w += wgAt(1180 + Math.sin(t * 2.2) * 14, 560 + Math.sin(t * 3) * 12 + (1 - Math.min(1, gk)) * 200, `<g opacity=".92">${gfIcon('ghost', 4.6)}</g>` + `<ellipse cx="-62" cy="14" rx="20" ry="11" fill="#FF9BB0" opacity=".7"/><ellipse cx="62" cy="14" rx="20" ry="11" fill="#FF9BB0" opacity=".7"/>`, gk, Math.sin(t * 2.2) * 6);
  let h = gfDefs() + gfLayer(cam, 1, wgCave(t, { day, tomb: 1 }) + w) + wgTint('#1B2452', (1 - day) * 0.12);
  h += wgDial(170, 118, day, lt, tN) + wgAt(0, 0, gfChipAt(lt, tSm, 560, 700, '같은 자리', { icon: 'pin', size: 50, rot: -3 }), gfOut(lt, tG - 0.2, 0.15)) + wgAt(1500, 300, gfT(0, 0, '으스스…', 60, '#E7E0FF', { sw: 14, stroke: GFC.night }), gfIn(lt, tG + 0.2, 3, 0.4), 6);
  h += wgMoodHud(lt, wgV([[0, 0.3], [tK, 0.2], [tG, 0.04]], lt), { label: '원효의 마음', w: 440, tp: lt > tG ? tG : null, hurt: true });
  return h;
};
/* 카드 속 작은 장면(같은 굴) */
function wgMini(t, kind) { const day = kind === 'one' ? 1 : 0; let w = '';
  if (kind === 'cave') w = gfBlob(960, WH.GY - 6, 130) + WHO({ x: 900, y: WH.GY - 36, s: 0.8, rot: 90, t, ex: wgSleep, noBlink: true, still: true, seed: 6 }) + gfEmote(t, 0, 1090, 760, 'zzz', { hold: 1e6, s: 1.3 });
  else if (kind === 'tomb') w = gfActor(WHO, { x: 780, y: WH.GY, s: 0.95, t, pose: '만세', ex: fEx('z소름'), look: [0.9, -0.3], shiver: true, seed: 6 }) + wgAt(1200 + Math.sin(t * 2.2) * 12, 590 + Math.sin(t * 3) * 10, `<g opacity=".92">${gfIcon('ghost', 4.2)}</g>`);
  else w = gfActor(WHO, { x: 960, y: WH.GY, s: 1.0, t, pose: '웅크림', ex: fEx('z뿌듯'), look: [0, 0], seed: 6 }) + gfTwinkle(t, 760, 560, 26, 1, GFC.sun) + gfTwinkle(t, 1180, 640, 20, 2.4, '#fff');
  return `<svg x="-330" y="-226" width="660" height="356" viewBox="380 470 1160 626" preserveAspectRatio="xMidYMid slice">${wgCave(t, { day, tomb: kind === 'cave' ? 0 : 1 })}${w}</svg><rect x="-330" y="-226" width="660" height="356" rx="6" fill="none" stroke="${INK}" stroke-width="6"/>`; }
function wgNightCard(t, kind, head, v, headBg) { return gfPanel(720, 500, { head, headBg, headSize: 32 }) + wgMini(t, kind) + wgAt(-282, 186, gfFace(v, 34)) + wgAt(-226, 186, gfBar(520, v, { h: 32 })); }
whsplitScene = function (t, lt, a) {
  const tI = whW(a, '깨닫', 0.7), tQ1 = whW(a, '마음이', 2.4), tR = whW(a, '온갖', 3.6), tQ2 = whW(a, '마음이', 5.4, 1), tD = whW(a, '사라지면', 6.2), tQ3 = whW(a, '아니다', (a._dur || 9) - 0.5), tHit = tD + 0.42;
  let h = gfDefs();
  if (lt < tQ1 - 0.1) { // 아침 무덤, 원효에게 불이 켜진다
    const cam = qLerpCam(lt / 2.4, [860, 640, 1.2], [820, 630, 1.34]), top = gfAbove(760, WH.GY, 0.95, 50, 0), hop = gfHop(lt, tI + 0.05, 34, 0.36);
    const w = gfActor(WHO, { x: 760, y: WH.GY, s: 0.95, t, pose: '턱괴기', armFront: 'R', ex: fEx(lt > tI ? 'z반짝' : 'z의심'), look: [0.3, -0.4], seed: 6 }, hop) + gfEmote(lt, tI, top[0], top[1], 'idea', { hold: 2.2, s: 1.2 }) + gfRing(lt, tI, top[0], top[1], 30, 200, GFC.sun);
    return h + gfLayer(cam, 1, wgCave(t, { day: 1, tomb: 1 }) + w);
  }
  h += gfFull('url(#gfNight)') + gfFull('url(#gfDots)') + [[200, 420, 1], [1750, 380, 2], [960, 1000, 3], [1500, 960, 4], [380, 960, 5]].map(([x, y, sd]) => gfTwinkle(t, x, y, 16, sd, '#FFF3B8')).join('');
  const mv = easeIn(gfK(tD, tHit, lt)), lx = lerp(520, 960, mv), rx = lerp(1400, 960, mv), cy = 640;
  if (lt < tHit) {
    h += wgAt(lx, cy + Math.sin(t * 1.7) * 4, wgNightCard(t, 'cave', '첫째 밤 · 토굴인 줄', 0.84, '#BDE7C9'), gfIn(lt, tQ1 - 0.1, 2.8, 0.5), -2 + mv * 2);
    h += wgAt(rx, cy + Math.sin(t * 1.7 + 1) * 4, wgNightCard(t, 'tomb', '둘째 밤 · 무덤인 줄', 0.06, '#E7E0FF'), gfIn(lt, tR, 2.8, 0.5), 2 - mv * 2);
    if (lt > tR + 0.5 && lt < tD) h += wgAt(960, cy - 20, gfT(0, 0, 'vs', 70, '#fff', { sw: 16, stroke: GFC.navy }), gfIn(lt, tR + 0.5, 3.4, 0.4));
  } else {
    const j = gfJelly(lt, tHit, 0.14, 3.6, 6);
    h += gfRays(t, 960, cy, 900, '#FFF3B8', 14, 0.12) + `<g transform="translate(960 ${f1(cy + Math.sin(t * 1.7) * 4)}) scale(${f1(j.sx * 1000) / 1000} ${f1(j.sy * 1000) / 1000})">${wgNightCard(t, 'one', '같은 자리', 0.72, GFC.sun)}</g>`;
    h += wgAt(1290, cy - 230, gfIcon('eq', 2.2), gfIn(lt, tHit + 0.1, 3.2, 0.4), 8) + gfRing(lt, tHit, 960, cy, 100, 620, '#fff', 18, 0.5) + gfStarBurst(lt, tHit, 960, cy, { r0: 200, r1: 560, n: 10, size: 30 });
  }
  h += pop(t, t - lt + tQ1, t + 99, 960, 116, outlined(0, 0, ['마음이 일어나면 온갖 것이 일어나고,'], { size: 56, sw: 12 }), {});
  if (lt > tQ2) h += pop(t, t - lt + tQ2, t + 99, 960, 198, outlined(0, 0, [[['마음이 사라지면 ', WHITE], ['토굴과 무덤이 둘이 아니다', YEL]]], { size: 60, sw: 12 }), {});
  h += gfChipAt(lt, tQ3, 960, 290, '『송고승전』 의상전 · 뜻을 옮김', { icon: 'scroll', size: 30 });
  return h;
};

/* ===== 9: 바닷가, 두 갈래 길 ===== */
function wgCoast(t, cam) {
  let far = gfFull('url(#gfDusk)') + gfSun(420, 330, 62, t) + gfClouds(t, 100, 3, 12, 10, 0.85) + gfHill(650, 80, 900, '#9AD4CC', 200);
  let sea = `<rect x="-700" y="640" width="3400" height="900" fill="#58C4EC"/>`;
  for (let i = 0; i < 4; i++) { let d = `M-700 ${690 + i * 62}`; for (let x = -700; x <= 2700; x += 50) d += ` L${x} ${f1(690 + i * 62 + Math.sin(x / 110 + t * (1.4 + i * 0.3) + i * 2) * 9)}`; sea += `<path d="${d}" fill="none" stroke="#fff" stroke-width="${7 - i}" stroke-linecap="round" opacity="${0.75 - i * 0.12}"/>`; }
  const bob = Math.sin(t * 1.6) * 8, rk = Math.sin(t * 1.6 + 1) * 2.2;
  let ship = `<g transform="translate(1790 ${f1(820 + bob)}) rotate(${f1(rk)})"><path d="M-190 -40 L190 -40 Q170 40 110 50 L-110 50 Q-170 40 -190 -40 Z" fill="${GFC.wood}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-176 -12 H176" stroke="${INK}" stroke-width="5" opacity=".3"/><rect x="-8" y="-330" width="16" height="292" rx="6" fill="${GFC.wood2}" stroke="${INK}" stroke-width="6"/><path d="M14 -318 Q170 -250 160 -90 L14 -90 Z" fill="#FFF6DC" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-14 -300 Q-120 -230 -116 -110 L-14 -110 Z" fill="#FFE2A8" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M0 -330 L46 -350 L0 -372 Z" fill="${GFC.coral}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>`;
  let land = `<ellipse cx="60" cy="860" rx="560" ry="120" fill="#8ADB6A" stroke="#4FA85A" stroke-width="7"/><path d="M-700 1600 L-700 800 Q200 770 820 868 Q1100 912 1330 904 L1330 1600 Z" fill="#F6DFA6" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>` + gfTree(120, 850, 0.9, t) + gfGrass(420, 890, 1.1) + gfGrass(700, 960, 1);
  let pier = [1380, 1500, 1620].map(x => `<rect x="${x}" y="900" width="26" height="150" rx="6" fill="${GFC.wood2}" stroke="${INK}" stroke-width="6"/>`).join('') + `<rect x="1300" y="892" width="370" height="30" rx="10" fill="${GFC.wood}" stroke="${INK}" stroke-width="7"/>` + [1370, 1450, 1530, 1610].map(x => `<line x1="${x}" y1="894" x2="${x}" y2="920" stroke="${INK}" stroke-width="4" opacity=".35"/>`).join('');
  return gfLayer(cam, 0.3, far) + gfLayer(cam, 0.7, sea + ship) + gfLayer(cam, 1, pier + land);
}
function wgSign(x, y) { const board = (dy, text, col, dir) => `<g transform="translate(0 ${dy})"><path d="${dir > 0 ? 'M-110 -34 H90 L130 0 L90 34 H-110 Z' : 'M110 -34 H-90 L-130 0 L-90 34 H110 Z'}" fill="${col}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>${gfT(dir > 0 ? -6 : 6, 15, text, 40, GFC.navy)}</g>`;
  return wgAt(x, y, `<rect x="-11" y="-300" width="22" height="300" rx="8" fill="${GFC.wood2}" stroke="${INK}" stroke-width="7"/>` + board(-250, '당나라', '#FFD27A', 1) + board(-166, '신라', '#BDE7C9', -1)); }
whcoastScene = function (t, lt, a) {
  const D = a._dur || 10, tNo = whW(a, '없다며', 2.4), tB = whW(a, '돌아갑니다', 4.9), tH = whW(a, '해골물은', 6.1), cam = qLerpCam(lt / D, [960, 600, 1.0], [960, 600, 1.05]), y = WH.GY - 86;
  const ux = lerp(1200, 1590, easeInOut(gfK(0.3, D - 1.4, lt))), uw = gfWalk(ux, 0.7), uStop = lt > D - 1.4;
  let w = wgSign(1010, y + 6) + gfActor(UIS, { x: ux, y, s: 0.78, t, pose: uStop ? '손인사' : uw.pose, look: uStop ? [-0.9, 0] : [0.9, 0], ex: fEx(uStop ? 'z빵긋' : 'z결심'), seed: 5 }, uStop ? {} : { sy: uw.sy });
  const turn = gfK(tB - 0.25, tB - 0.05, lt), wx = lerp(790, 200, easeInOut(gfK(tB + 0.15, D + 0.3, lt))), ww = gfWalk(wx, 0.8), hop = gfHop(lt, tB - 0.1, 44, 0.38), walking = lt > tB + 0.3, top = gfAbove(wx, y, 0.8, 60, 20);
  const who = gfActor(WHO, { x: wx, y, s: 0.8, sx: turn > 0.5 ? 1 : Math.max(0.2, 1 - 1.6 * turn), t, pose: walking ? ww.pose : '서기', ex: fEx(lt > tNo ? 'z빵긋' : 'z기본'), look: [0.7, -0.1], headDy: actNod(lt, tNo, 2, 8, 0.3), seed: 6 }, walking ? { sy: ww.sy } : hop);
  w += (turn > 0.5 ? flip(wx, who) : who) + gfEmote(lt, tNo, top[0], top[1], 'idea', { hold: 1.6 }) + gfEmote(lt, tB + 0.5, top[0], top[1], 'note', { hold: 1.6 }) + gfEmote(lt, tB + 2.4, top[0], top[1], 'note', { hold: 1.6 }) + gfPuff(lt, tB + 0.3, wx, y, 0.9);
  return gfDefs() + wgCoast(t, cam) + qCam(cam, w) + gfChipAt(lt, tH, 960, 150, '해골물 이야기 · 『종경록』의 다른 판본', { icon: 'skull', size: 40, bg: GFC.sun, rot: -2 }) + gfRing(lt, tH, 960, 150, 80, 420, GFC.sun, 10, 0.4);
};

/* ===== 10: 제목 ===== */
whtitleScene = function (t, lt, a) {
  let h = gfDefs() + gfFull('url(#gfDay)') + gfRays(t, 960, 1200, 1700, '#fff', 16, 0.3, 6) + gfClouds(t, 40, 4, 7, 16, 0.9) + gfHill(1010, 60, 900, '#8ADB6A', 0, '#4FA85A');
  h += gfBounceText(lt, 0.15, 960, 390, [['만약에, ', WHITE], ['원효', GFC.sun], ['처럼', WHITE]], { size: 124, sw: 24, wave: 4 });
  h += gfBounceText(lt, 0.75, 960, 570, [["'마음먹기'", '#FFB6DA'], ['로 산다면?', WHITE]], { size: 124, sw: 24, wave: 4 });
  const hop = gfM(gfHop(lt, 0.5, 60, 0.42), gfHop(lt, 1.7, 46, 0.4), gfHop(lt, 2.9, 46, 0.4));
  h += gfActor(Z, { t, seed: 9, x: 420, y: 1040, s: 0.66, ex: fEx('z빵긋'), look: [0.6, -0.4], pose: hop.air > 0.2 ? '만세' : '서기' }, hop) + whHipGourd(420, 1040 + hop.dy, 0.66, t, 12 * Math.sin(lt * 7) * Math.exp(-((lt - 0.9) * (lt - 0.9))));
  h += gfPuff(lt, 0.92, 420, 1040, 0.9) + gfPuff(lt, 2.1, 420, 1040, 0.9);
  h += wgAt(1560, 800 + Math.sin(t * 2.2) * 10, gfRays(t, 0, 60, 190, GFC.sun, 10, 0.45, 30) + whGourd(0, 0, 2.3, 8 * Math.sin(t * 1.8)), gfIn(lt, 1.1, 2.8, 0.42)) + gfTwinkle(t, 1440, 760, 22, 1, '#fff') + gfTwinkle(t, 1690, 880, 18, 2.6, GFC.sun);
  h += wgAt(1640, 190, gfFace(0.5 + 0.5 * Math.sin(lt * 2.1 - 1.2), 66), gfIn(lt, 1.4, 3, 0.42), -6);
  return h;
};

/* ===== 11~12: 표주박 장착 ===== */
function wgOffice(t, cam) { let h = gfRoom({ wall: '#DDF1FF', wall2: '#BFE3FF', floor: '#F4D6A6', base: '#fff', fy: 900 });
  h += gfWindow(500, 250, 520, 320, t) + gfClock(1230, 300, 58, 10, 10) + gfDesk(230, 900, 1.2) + gfDesk(1720, 900, 1.2, { screen: '#FFE9A8' }) + gfPlant(1410, 900, 0.95, t);
  return gfLayer(cam, 0.9, h); }
whgourdScene = function (t, lt, a) {
  const y = WH.GY, s = 0.95, zx = 760; let cam, w = '', ui = '', ex, look = [0.4, 0.3], pose = P['서기'], swing = 0, hip = true, m = {};
  if (a.shake) { // "이거 그냥 물통 아니야?"
    E['_whg'] = qTalk('z의심', env(t)); ex = fEx('_whg'); look = [0.5, 0.6]; swing = 24 * Math.sin(lt * 9) * Math.exp(-lt * 0.8);
    pose = Object.assign({}, P['서기'], { armR: [[252, 285], [292, 340], [262, 420]], hR: [256, 428] }); cam = qLerpCam(lt / 2.6, [860, 760, 1.5], [860, 768, 1.58]);
    const g = whPt(zx, y, s, 238, 470), gx = (g[0] - cam[0]) * cam[2] + 960, gy = (g[1] - cam[1]) * cam[2] + 560, top = gfAbove(zx, y, s, 90, 60), tk = gfIn(lt, 0.85, 3, 0.45);   // 설명 상자는 "표주박…" 하고 난 뒤에 뜬다
    w += gfEmote(lt, 0.2, top[0], top[1], 'q', { hold: 2.4, s: 0.8 });
    for (let i = 0; i < 3; i++) { const u = lt - 0.25 - i * 0.36; if (u > 0 && u < 0.5) w += `<circle cx="${f1(g[0] + (i - 1) * 26 + u * 40 * (i - 1))}" cy="${f1(g[1] - 30 - 90 * u + 220 * u * u)}" r="8" fill="#9ED8FF" stroke="${INK}" stroke-width="4" opacity="${f1(1 - u * 2)}"/>`; }
    ui = (lt > 0.95 ? `<path d="M${f1(gx + 60)} ${f1(gy)} L1180 520 L1180 580 Z" fill="${GFC.cream}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` : '') + wgAt(1420, 540 + Math.sin(t * 2) * 3, gfPanel(500, 190, { head: '아이템', headBg: GFC.sun }) + gfT(-210, -12, '원효의 표주박', 44, GFC.navy, { anchor: 'start' }) + gfT(-210, 50, '효과: ', 36, '#6B7280', { anchor: 'start', wt: 800 }) + wgAt(-70, 38, gfT(0, 12, '???', 40, GFC.grape), gfBeat(lt, 1.9, 0.35, 3, 5)), tk, 2);
  } else {
    const tG = whW(a, '허리에', 1.7), tOn = tG + 0.34, tF = whW(a, '가지', 3.4), tP = whW(a, '심리학', 6.5), on = lt > tOn; hip = on;
    ex = fEx(on ? 'z빵긋' : 'z반짝'); look = on ? [0.4, 0.1] : [0.1, -0.7]; cam = qLerpCam(lt / (a._dur || 8), [960, 600, 1.0], [960, 600, 1.05]); m = gfM(gfJelly(lt, tOn, 0.12), gfHop(lt, tOn + 0.25, 30, 0.34));
    const hipP = whPt(zx, y, s, 238, 428), fly = easeIn(gfK(tG, tOn, lt)), top = gfAbove(zx, y, s, 80, 20);
    if (!on) w += wgAt(zx, 300, gfItem(lt, 0.2, { name: '원효의 표주박', svg: '' }), gfOut(lt, tG - 0.05, 0.16)) + whGourd(lerp(zx, hipP[0], fly), lerp(118 + Math.sin(t * 2.4) * 8, hipP[1], fly), lerp(1.5, 0.59, fly) * gfIn(lt, 0.2, 3, 0.45), 6 * Math.sin(lt * 3));
    w += gfRing(lt, tOn, hipP[0], hipP[1] + 40, 20, 150, GFC.sun) + gfStarBurst(lt, tOn, hipP[0], hipP[1] + 40, { r1: 130, n: 6, size: 18 }) + gfPlus(lt, tOn + 0.05, zx + 150, y - 300, '장착!', { size: 56 }) + gfEmote(lt, tP + 0.5, top[0], top[1], 'q', { hold: 1.6 });
    ui = wgAt(1470, 520 + Math.sin(t * 1.6) * 3, gfQuest(lt, [['다른 이름', 0], ['다툼 잇기', 1], ['쉬운 말', 2], ['나를 품기', 3]].map(([tx, i]) => ({ text: tx, t0: tF + 0.25 + i * 0.3, tag: `${i + 1}일 차`, tagBg: ['#FFE27A', '#BDE7C9', '#BFD7FF', '#FFC6D9'][i] })), { w: 640, rh: 98, size: 46, head: '원효의 생각 넷', headBg: '#BDE7C9' }), gfIn(lt, tF, 2.8, 0.5), 1.5);
    ui += gfChipAt(lt, tP, 330, 200, '오늘의 심리학', { icon: 'flask', size: 42, bg: '#fff', rot: -3 });
    swing = on ? 26 * Math.sin((lt - tOn) * 10) * Math.exp(-(lt - tOn) * 2.2) : 0;
  }
  const body = gfActor(WZ, { x: zx, y, s, t, pose, ex, look, seed: 3 }, m) + (hip ? whHipGourd(zx, y + (m.dy || 0), s, t, swing) : '');
  return gfDefs() + wgOffice(t, cam) + qCam(cam, body + w) + ui;
};

/* ===== 13: 1일 차 ===== */
whchapterScene = function (t, lt, a) {
  const zx = lerp(-200, 2150, gfK(0.2, 4.2, lt)), wk = gfWalk(zx, 0.9, 0.05);
  return gfDefs() + gfStage(t, lt, { n: a.n, total: 4, day: `${a.n}일 차`, title: a.name, bg: '#5CD6B8', bg2: '#74E0C6' }) + gfActor(Z, { t, seed: 9, x: zx, y: 1040, s: 0.46, pose: wk.pose, ex: fEx('z빵긋'), look: [0.6, 0] }, { sy: wk.sy }) + whHipGourd(zx, 1040, 0.46, t, 10 * Math.sin(zx * 0.05)) + gfStarBurst(lt, 1.35, 960, 690, { r1: 200, n: 8 });
};

/* ===== 14: 회의에 새 이름 붙이기(제로 시점) ===== */
whsignScene = function (t, lt, a) {
  const tN = whW(a, '말고', 4.2), tP = whW(a, '연습', 5.3), tFlip = tP - 0.3, flipK = easeInOut(gfK(tFlip, tFlip + 0.3, lt)), isNew = flipK >= 0.5, sc = Math.max(0.03, Math.abs(1 - 2 * flipK));
  const cam = [520, 520, 1.3], rise = gfIn(lt, 0.25, 2.4, 0.5), sh = gfShake(lt, tN, 10, 0.3), j = gfJelly(lt, tFlip + 0.3, 0.12), x = 1100 + sh[0], y = 520 + Math.sin(t * 2.2) * 4 + (1 - Math.min(1, rise)) * 700 + sh[1];
  let h = gfDefs() + gfLayer(cam, 1, gfRoom({ wall: '#FFE9B8', wall2: '#FFD98F', floor: '#EFC08A', fy: 900 }) + gfDoor(420, 900, 1.25) + wgAt(420, 110, gfChip('회의실', { size: 44, icon: 'door' })) + wgCal(840, 300, 0));
  const txt = isNew ? '오늘의 연습 경기' : '오늘의 지옥', col = isNew ? '#1F9D61' : '#5B4FCF', bg = isNew ? '#F2FFF4' : '#F1EEFF';
  let sign = `<rect x="-350" y="-140" width="700" height="290" rx="30" fill="${GFC.navy}" opacity=".22" transform="translate(0 12)"/><rect x="-350" y="-150" width="700" height="290" rx="30" fill="${bg}" stroke="${INK}" stroke-width="9"/>`;
  sign += isNew ? wgAt(-250, 0, gfIcon('ball', 1.5), gfBeat(lt, tFlip + 0.3, 0.3, 3, 5), t * 40) + gfT(60, 28, txt, 70, col) + `<path d="M-150 76 Q60 100 280 76" stroke="${col}" stroke-width="8" fill="none" stroke-linecap="round"/>`
    : [[-300, -150, -14], [300, -150, 14]].map(([hx, hy, r]) => wgAt(hx, hy, `<path d="M-26 8 Q-4 -24 4 -66 Q20 -28 26 8 Z" fill="${GFC.coral}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`, 1, r)).join('') + gfT(0, 32, txt, 96, col);
  if (!isNew && lt > tN) { const k = easeOut(gfK(tN, tN + 0.25, lt)); sign += `<path d="M-290 0 L${f1(-290 + 580 * k)} ${f1(-14 * k)}" stroke="${GFC.coral}" stroke-width="20" stroke-linecap="round"/>`; }
  // 두 손(제로 시점, 셔츠 소매)
  [[x - 370, y + 150, -1], [x + 370, y + 150, 1]].forEach(([hx, hy, sd]) => { const sl = `M${f1(hx + sd * 70)} 1300 L${f1(hx + sd * 16)} ${f1(hy + 46)}`; h += `<path d="${sl}" stroke="${INK}" stroke-width="88" stroke-linecap="round"/><path d="${sl}" stroke="#F4F4F8" stroke-width="72" stroke-linecap="round"/>`; });
  h += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(-2) scale(${f1(sc * j.sx * 1000) / 1000} ${f1(j.sy * 1000) / 1000})">${sign}</g>`;
  [[x - 370, y + 150], [x + 370, y + 150]].forEach(([hx, hy]) => { h += hand(hx, hy, 1.7); });
  h += gfStarBurst(lt, tFlip + 0.3, x, y, { r0: 200, r1: 520, n: 10, size: 30 }) + gfRing(lt, tFlip + 0.3, x, y, 150, 560, '#fff', 16, 0.45) + gfPlus(lt, tFlip + 0.4, x, y - 230, '새 이름!', { size: 60 });
  h += wgDayChip() + wgMoodHud(lt, wgV([[0, 0.12], [tFlip + 0.35, 0.62]], lt), { tp: lt > tFlip + 0.35 ? tFlip + 0.35 : null });
  return h;
};

/* ===== 15~16, 20: 회의실 ===== */
function wgMeetSet(t, cam) { let h = gfRoom({ wall: '#FFE9B8', wall2: '#FFD98F', floor: '#EFC08A', fy: 900 });
  h += `<rect x="340" y="200" width="480" height="290" rx="20" fill="#fff" stroke="${INK}" stroke-width="8"/>` + [[420, 110, '#BFD7FF'], [505, 180, '#BDE7C9'], [590, 80, '#FFC6D9'], [675, 205, '#FFE27A']].map(([x, hh, c]) => `<rect x="${x}" y="${440 - hh}" width="58" height="${hh}" rx="8" fill="${c}" stroke="${INK}" stroke-width="5"/>`).join('') + `<path d="M390 440 H780" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  h += gfWindow(1420, 260, 330, 290, t) + gfPlant(130, 900, 1.05, t) + gfClock(1130, 300, 56, 9, 20);
  return gfLayer(cam, 0.9, h); }
whmeetScene = function (t, lt, a) {
  const y = WH.GY, zx = 640, bx = 1300, s = 0.92; let w = '', ui = '', post = '', cam, zex = fEx('z기본'), bex = fEx('z기본'), zlook = [0.8, 0], blook = [-0.8, 0.1], bpose = P['서기'], zpose = P['서기'], zm = {}, v, tp = null, hurt = false, px = 860, prot = -6;
  const ztop = gfAbove(zx, y, s, 70, 10);
  if (a.end) { // "틀린 숫자가 좀 덜 아프네."
    const tL = whW(a, '덜', 3.1), tE = whW(a, '아프네', 3.5) + 0.3; E['_whz'] = qTalk('z빵긋', env(t)); zex = fEx('_whz'); zlook = [0.3, 0.5];
    zpose = Object.assign({}, P['서기'], { armR: [[252, 285], [292, 330], [262, 370]], hR: [256, 376], armL: [[148, 285], [120, 330], [150, 370]], hL: [156, 374] }); cam = qLerpCam(lt / 3.6, [820, 640, 1.22], [820, 648, 1.28]);
    v = wgV([[0, 0.45], [tL, 0.66]], lt); tp = lt > tL ? tL : null; zm = gfHop(lt, tE, 36, 0.36);
    w += gfEmote(lt, tL + 0.1, ztop[0], ztop[1], 'spark', { hold: 1.4 });
    ui += wgAt(1000, 185, gfStamp(lt, tE, '1일 차 끝!', { size: 88, col: '#1F9D61', rot: -6 })) + gfConfetti(lt, tE, { n: 40, d: 1.6 });
  } else if (a.mutter) { // "…연습 경기, 연습 경기."
    E['_whz'] = qTalk('z결심', env(t) * 0.6); zex = fEx('_whz'); zlook = [0.2, 0.3]; cam = qLerpCam(lt / 2.5, [760, 600, 1.2], [750, 610, 1.27]); v = wgV([[0, 0.42], [0.5, 0.48]], lt);
    const bk = gfIn(lt, 0.25, 3, 0.42); w += wgAt(zx + 250, 470 + Math.sin(t * 3) * 4, bubble(0, 0, 330, 210, `<rect x="-115" y="-64" width="230" height="128" rx="16" fill="#7FDB8C" stroke="${INK}" stroke-width="6"/><line x1="0" y1="-64" x2="0" y2="64" stroke="#fff" stroke-width="5"/><circle cx="0" cy="0" r="26" fill="none" stroke="#fff" stroke-width="5"/><g transform="translate(${f1(60 * Math.sin(lt * 5))} ${f1(-Math.abs(Math.sin(lt * 10)) * 26 + 20)}) scale(.62) rotate(${f1(lt * 300)})">${GF_ICON.ball()}</g>`), bk);
  } else { // 팀장: "이 숫자 다시 봐 줄래요?" → 틀린 숫자가 날아온다
    const tHit = 0.95; E['_whb'] = qTalk('z기본', env(t)); bex = fEx('_whb'); bpose = Object.assign({}, P['서기'], { armL: [[148, 285], [100, 300], [64, 330]], hL: [58, 336] }); cam = qLerpCam(lt / 2.5, [980, 590, 1.05], [990, 590, 1.1]);
    const sl = easeOut(gfK(0.25, tHit, lt)); px = lerp(1090, 850, sl); prot = lerp(8, -6, sl); zex = fEx(lt > tHit ? 'z당황' : 'z기본'); zm = lt > tHit ? gfJelly(lt, tHit, 0.12) : {};
    v = wgV([[0, 0.62], [tHit, 0.42]], lt); tp = lt > tHit ? tHit : null; hurt = true;
    w += gfEmote(lt, tHit, ztop[0], ztop[1], 'bang', { hold: 1.0 }); post = gfRing(lt, tHit, 850, 830, 20, 150, GFC.coral) + gfPlus(lt, tHit + 0.05, 850, 760, '틀린 숫자', { size: 44, col: '#FF8A8A' });
  }
  w = gfActor(WB, { x: bx, y, s, t, pose: bpose, ex: bex, look: blook, seed: 8 }) + gfActor(WZ, { x: zx, y, s, t, pose: zpose, ex: zex, look: zlook, seed: 3 }, zm) + whHipGourd(zx, y + (zm.dy || 0), s, t) + w;
  w += whTable(960, 860) + whPaper(px, 840, 0.7, prot, !a.end) + whPaper(1080, 846, 0.7, 4); w += post;
  if (a.end) { const hp = whPt(zx, y + (zm.dy || 0), s, 256, 376); w += whPaper(hp[0] + 30, hp[1] - 40, 0.9, -8) + `<path d="M${f1(hp[0] + 40)} ${f1(hp[1] - 30)} l40 -40" stroke="#2E5AAC" stroke-width="10" stroke-linecap="round"/>` + wgAt(hp[0] + 66, hp[1] - 92, gfIcon('check', 0.9), gfIn(lt, whW(a, '덜', 3.1), 3.4, 0.4)); }
  return gfDefs() + wgMeetSet(t, cam) + qCam(cam, w) + ui + wgDayChip() + wgMoodHud(lt, v, { tp, hurt, ghost: 0.1, ghostLabel: '지옥이었다면' });
};

/* ===== 17~18: 와인 실험 ===== */
function wgLab(t) { return gfFull('#FFF3D6') + gfFull('url(#gfDots)') + `<rect x="-600" y="800" width="3120" height="700" fill="#F7D9A8"/><rect x="-600" y="790" width="3120" height="26" rx="10" fill="#FFE9C4" stroke="${INK}" stroke-width="6"/>`; }
function wgMiniSign(text, col, bg, horn) { const w = gfTextW(text, 50) + 90; return (horn ? [[-w / 2 + 30, -12], [w / 2 - 30, 12]].map(([x, r]) => wgAt(x, -52, `<path d="M-20 6 Q-3 -18 3 -50 Q15 -20 20 6 Z" fill="${GFC.coral}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`, 1, r)).join('') : '') + `<rect x="${f1(-w / 2)}" y="-46" width="${f1(w)}" height="112" rx="22" fill="${GFC.navy}" opacity=".2"/><rect x="${f1(-w / 2)}" y="-56" width="${f1(w)}" height="112" rx="22" fill="${bg}" stroke="${INK}" stroke-width="7"/>` + gfT(0, 18, text, 50, col); }
function wgBottle(x, y, rot, j = { sx: 1, sy: 1 }) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(j.sx * 100) / 100} ${f1(j.sy * 100) / 100})"><rect x="-46" y="-260" width="92" height="256" rx="34" fill="#7A2748" stroke="${INK}" stroke-width="8"/><rect x="-19" y="-336" width="38" height="92" rx="10" fill="#7A2748" stroke="${INK}" stroke-width="8"/><rect x="-22" y="-346" width="44" height="22" rx="8" fill="${GFC.sun}" stroke="${INK}" stroke-width="6"/><rect x="-32" y="-186" width="64" height="80" rx="10" fill="#FFF6DC" stroke="${INK}" stroke-width="5"/><rect x="-32" y="-244" width="14" height="150" rx="7" fill="#fff" opacity=".18"/></g>`; }
whwineScene = function (t, lt, a) {
  const ph1 = !!a.ph, bx = 960, by = 800; let h = gfDefs() + wgLab(t);
  if (!ph1) { // 이름 하나로 정말 달라질까? → 2008년, 와인으로
    const tQ = whW(a, '달라질까요', 2.3), tY = whW(a, '2008', 3.2), tW = whW(a, '와인으로', 5.2), out = gfOut(lt, tW - 0.35, 0.2);
    h += wgAt(440, 480 + Math.sin(t * 2) * 5, wgMiniSign('오늘의 지옥', '#5B4FCF', '#F1EEFF', true), 1.75 * gfIn(lt, 0.2, 3, 0.45) * out, -4) + wgAt(1440, 480 + Math.sin(t * 2 + 1) * 5, wgMiniSign('오늘의 연습 경기', '#1F9D61', '#F2FFF4'), 1.75 * gfIn(lt, 0.55, 3, 0.45) * out, 3);
    h += gfEmote(lt, tQ - 0.1, 880, 470, 'q', { hold: tW - tQ - 0.4, s: 2.0 });
    h += gfChipAt(lt, tY, 420, 130, a.study || '', { icon: 'flask', size: 38, bg: GFC.sun, rot: -3 });
    const hop = gfHop(lt, tW, 80, 0.42); if (lt > tW - 0.1) h += gfBlob(bx, by, 80, hop.air) + wgBottle(bx, by + hop.dy, 0, hop) + gfPuff(lt, tW + 0.44, bx, by, 1) + gfRing(lt, tW + 0.42, bx, by - 20, 30, 190, '#fff');
    h += wgAt(640, by, whGlass(0, 0, '#8E1E3A', 0), gfIn(lt, tW + 0.5, 3.4, 0.4)) + wgAt(1280, by, whGlass(0, 0, '#8E1E3A', 0), gfIn(lt, tW + 0.65, 3.4, 0.4));
    return h;
  }
  const t5 = whW(a, '5달러', 1.8), t45 = whW(a, '45달러', 3.2), tG = whW(a, '짜리가', 6.4), tM = whW(a, '맛있다고', 8.1), tJ = whW(a, '즐거움을', 9.8), pourK = gfK(0.2, 1.3, lt), pour = easeInOut(pourK);
  h += gfChipAt(lt, -1, 420, 130, '2008 · 미국 연구팀 · 20명', { icon: 'flask', size: 38, bg: GFC.sun, rot: -3 });
  h += gfBlob(bx, by, 80) + wgBottle(bx, by - 40 * Math.sin(Math.PI * pourK), Math.sin(Math.PI * 2 * pourK) * -26);
  const g5 = gfBeat(lt, t5, 0.14), g45 = gfBeat(lt, t45, 0.14) * gfBeat(lt, tG, 0.2, 3, 5);
  if (lt > tM) h += `<circle cx="1280" cy="700" r="${f1(130 + 10 * Math.sin(t * 5))}" fill="url(#gfGlow)"/>`;
  h += wgAt(640, by, whGlass(0, 0, '#8E1E3A', pour), g5) + wgAt(1280, by, whGlass(0, 0, '#8E1E3A', pour), g45);
  { const eo = gfOut(lt, tJ - 0.25, 0.2); h += wgAt(960, 372, gfIcon('eq', 1.5), gfIn(lt, 1.35, 3.2, 0.4) * eo) + wgAt(0, 0, gfChipAt(lt, 1.45, 960, 285, '같은 와인', { size: 46, bg: '#fff' }), eo) + (lt > 1.3 && eo > 0.5 ? `<path d="M660 372 Q660 372 890 372 M1030 372 H1260 M660 372 V470 M1260 372 V470" fill="none" stroke="${INK}" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round" opacity="${f1(gfK(1.3, 1.6, lt) * 0.5)}"/>` : ''); }
  h += whTagPrice(560, 590, '$5', gfK(t5 - 0.1, t5 + 0.3, lt), '#D7DDE6') + whTagPrice(1360, 590, '$45', gfK(t45 - 0.1, t45 + 0.3, lt), '#FFD27A') + gfRing(lt, t5, 560, 590, 30, 150, '#fff') + gfRing(lt, t45, 1360, 590, 30, 170, GFC.sun) + gfStarBurst(lt, t45, 1360, 590, { r1: 150, n: 6, size: 18 });
  // 맛보는 사람: 걸어 들어와 맛본다
  const px = lerp(2200, 1650, easeOut(gfK(5.0, 5.9, lt))), pw = gfWalk(px, 0.8), walking = lt < 5.9, hop = gfHop(lt, tM, 40, 0.38), ptop = gfAbove(px, 1030, 0.72, 0, 10);
  if (lt > 4.9) h += flip(px, gfActor(WT, { x: px, y: 1030, s: 0.72, t, pose: walking ? pw.pose : '서기', ex: fEx(lt > tM ? 'z하트눈' : 'z기본'), look: [0.8, -0.2], seed: 12 }, walking ? { sy: pw.sy } : hop)) + gfEmote(lt, tM + 0.1, ptop[0] + 60, ptop[1], 'heart', { hold: 2.2 });
  if (lt > tM) h += pop(t, t - lt + tM, t + 99, 1640, 330, bubble(0, 0, 360, 170, gfT(0, 18, '더 맛있다!', 54, GFC.navy)), {});
  // 잔 아래 '맛' 막대(숫자 없이 크기만)
  const bar = (cx, v, t0) => wgAt(cx, 905, gfPanel(400, 92, { r: 36 }) + gfT(-150, 16, '맛', 44, GFC.navy) + wgAt(-100, 0, gfBar(260, v * easeOut(gfK(t0, t0 + 0.6, lt)), { col: GFC.berry, h: 36 })), gfIn(lt, t0 - 0.15, 3.2, 0.45));
  h += bar(640, 0.4, tM) + bar(1280, 0.86, tM + 0.15) + gfStarBurst(lt, tM + 0.7, 1380, 900, { r1: 120, n: 5, size: 16 });
  if (lt > tJ) { const k = gfIn(lt, tJ, 3, 0.45); h += wgAt(1130, 250 + Math.sin(t * 2) * 4, brain(0, 0, 0.42, null, t) + `<ellipse cx="${f1(-230 * 0.42)}" cy="${f1(60 * 0.42)}" rx="${f1(60 + 12 * Math.sin(t * 6))}" ry="40" fill="url(#whRose)"/>` + wgAt(0, 150, gfChip('즐거움 ↑', { size: 36, bg: '#FFC6D9', icon: 'heart' })), k) + gfRing(lt, tJ, 1130, 250, 60, 260, GFC.berry); }
  return whDefs() + h;
};

/* ===== 큰 숫자 카드 ===== */
statScene = function (t, lt, a) {
  let h = gfDefs() + gfFull('#FFF3D6') + gfFull('url(#gfDots)') + gfRays(t, 960, 470, 1500, '#fff', 14, 0.35, 6);
  const parts = a.big.split('→').map(s => s.trim());
  if (parts.length === 2) { const k1 = gfIn(lt, 0.1, 3, 0.42), k2 = gfIn(lt, 0.7, 3, 0.4), ar = easeOut(gfK(0.35, 0.75, lt));
    h += wgAt(540, 440, `<g transform="scale(2.6)">${whTagPrice(0, 0, parts[0], 1, '#D7DDE6')}</g>`, k1, -4) + wgAt(1400, 440, `<g transform="scale(${f1(3.2 * gfBeat(lt, 0.95, 0.12, 3, 5) * 100) / 100})">${whTagPrice(0, 0, parts[1], 1, '#FFD27A')}</g>`, k2, 3);
    h += `<path d="M800 440 L${f1(800 + 250 * ar)} 440" stroke="${INK}" stroke-width="26" stroke-linecap="round"/>` + (ar > 0.9 ? `<path d="M1030 390 L1100 440 L1030 490 Z" fill="${INK}" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/>` : '') + gfStarBurst(lt, 0.95, 1400, 440, { r0: 120, r1: 380, n: 9, size: 28 }) + gfRing(lt, 0.9, 1400, 440, 80, 380, GFC.sun, 16, 0.45);
  } else h += gfBounceText(lt, 0.1, 960, 480, [[countUp(a.big, easeOut(gfK(0.1, 1.2, lt))), GFC.navy]], { size: 220, stroke: '#fff', sw: 30 });
  h += wgAt(960, 720, gfPanel(gfTextW(a.sub, 46, 900) + 110, 104, { r: 40 }) + gfT(0, 17, a.sub, 46, GFC.navy), gfIn(lt, 1.0, 3, 0.45)) + (lt > 1.2 ? gfT(960, 840, a.src, 28, '#8A7F6A', { wt: 600 }) : '');
  const hop = gfHop(lt, 1.05, 50, 0.4); h += gfActor(Z, { t, seed: 10, x: 1700, y: 1060, s: 0.5, ex: fEx(lt > 1.0 ? 'z충격' : 'z기본'), look: [-0.7, -0.5], pose: hop.air > 0.2 ? '만세' : '서기' }, hop) + gfEmote(lt, 1.05, 1730, 1060 - 300, 'bang', { hold: 1.2, s: 0.7 });
  return h;
};

/* ===== 19: 맛은 그대로, 즐거움만 ===== */
whbrainScene = function (t, lt, a) {
  const tA = whW(a, '맛', 0.6), tT = whW(a, '그대로', 3.2), tJ = whW(a, '즐거움만', (a._dur || 7) - 1.7); let h = gfDefs() + gfFull('#FFF3D6') + gfFull('url(#gfDots)');
  const row = (cx, y, lab, v, col, t0) => wgAt(cx, y, gfPanel(600, 100, { r: 40 }) + gfT(-270, 16, lab, 42, GFC.navy, { anchor: 'start' }) + wgAt(-90, 0, gfBar(340, v * easeOut(gfK(t0, t0 + 0.6, lt)), { col, h: 38 })), gfIn(lt, t0 - 0.2, 3.2, 0.45));
  [[520, '$5', 0.34], [1400, '$45', 0.9]].forEach(([cx, tag, joy], i) => {
    const jk = gfIn(lt, tJ, 2.6, 0.45), tk = gfIn(lt, tA, 3, 0.5);
    h += wgAt(cx, 420 + Math.sin(t * 1.8 + i) * 4, brain(0, 0, 0.6, null, t) + `<ellipse cx="0" cy="${f1(30 * 0.6)}" rx="${f1(68 * tk)}" ry="${f1(44 * tk)}" fill="#7FD0FF" opacity=".8"/>` + `<ellipse cx="${f1(-200 * 0.6)}" cy="${f1(70 * 0.6)}" rx="${f1((50 + 70 * joy) * jk * (1 + 0.06 * Math.sin(t * 6)))}" ry="${f1((34 + 46 * joy) * jk)}" fill="url(#whRose)"/>`, gfIn(lt, 0.1 + i * 0.15, 2.8, 0.5) * (i ? gfBeat(lt, tJ, 0.1, 3, 5) : 1));
    h += whTagPrice(cx, 180, tag, gfK(0.2 + i * 0.15, 0.6 + i * 0.15, lt), i ? '#FFD27A' : '#D7DDE6') + row(cx, 690, '맛', 0.6, '#5BB8FF', tA + 0.3) + row(cx, 810, '즐거움', joy, GFC.berry, tJ);
  });
  h += wgAt(960, 690, gfIcon('eq', 1.5), gfIn(lt, tT, 3.4, 0.4)) + gfRing(lt, tT, 960, 690, 30, 170, GFC.sun) + gfChipAt(lt, tT + 0.15, 960, 590, '똑같다', { size: 44, bg: '#BFE6FF' });
  h += gfPlus(lt, tJ + 0.3, 1720, 780, '쑥!', { size: 64, col: GFC.berry, d: 1.6 }) + gfStarBurst(lt, tJ + 0.4, 1640, 810, { r1: 130, n: 6, size: 18 }) + gfEmote(lt, tJ + 0.2, 1560, 300, 'heart', { hold: 1.8, s: 1.2 });
  return whDefs() + h;
};
