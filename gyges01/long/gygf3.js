/* 기게스의 반지 편 — 2단계: 100점 맞고 망하는 이유(굿하트의 법칙). gygf.js·gygf2.js 다음에 읽는다. 새 이름은 gy 접두사.
   c1·c2 가짜 해피엔딩 → 지지직 / c3·c4 법칙 카드(굿하트는 생존 인물이라 얼굴 없음, '널리 알려진 요약' 꼬리표)
   c5·c6 자(점수)와 새싹(실력) → 자를 늘리고 숫자 스티커를 붙이는 꼼수 → 가짜 과녁 / c7 3년 뒤 회사, 가스 누출 보스 앞에서 안경 먹통 → 껍데기
   c8 남을 속인 줄 알았는데 안경이 EXP를 빨아먹고 달아남. 가스 누출 대처는 정확하게(밸브 잠금·창문 열기, 전기 스위치 안 건드림). */
['gyscore', 'gygood', 'gyboss'].forEach(k => CAMS[k] = 'fixed');

/* ---------- 소품 ---------- */
const GY_TROPHY = `<g><path d="M-46 -96 L46 -96 L40 -40 Q36 -6 0 -2 Q-36 -6 -40 -40 Z" fill="#FFD84A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-46 -84 Q-80 -84 -76 -56 Q-72 -32 -40 -36 M46 -84 Q80 -84 76 -56 Q72 -32 40 -36" fill="none" stroke="${INK}" stroke-width="7"/>` +
  `<rect x="-10" y="-4" width="20" height="30" fill="#E0A83A" stroke="${INK}" stroke-width="6"/><rect x="-40" y="24" width="80" height="22" rx="6" fill="#B97F4A" stroke="${INK}" stroke-width="6"/><path d="M-22 -80 l8 30" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".7"/></g>`;
const gyCert = (title, sub, o = {}) => `<g><rect x="-170" y="-120" width="340" height="240" rx="16" fill="${GFC.navy}" opacity=".2" transform="translate(8 10)"/><rect x="-170" y="-120" width="340" height="240" rx="16" fill="#FFFBEA" stroke="${INK}" stroke-width="7"/><rect x="-154" y="-104" width="308" height="208" rx="10" fill="none" stroke="#E0A83A" stroke-width="5"/>` +
  gfT(0, -46, title, 40, GFC.navy) + gfT(0, 4, sub, 26, '#6B7280', { wt: 800 }) + `<circle cx="96" cy="62" r="34" fill="#E5484D" stroke="${INK}" stroke-width="5"/><path d="M80 90 l-10 34 l22 -12 l12 18 l6 -34" fill="#E5484D" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="96" cy="62" r="20" fill="none" stroke="#fff" stroke-width="4"/></g>`;
const gyGauge = (v = 0.7, crack = 0) => `<g><path d="M-80 20 A80 80 0 0 1 80 20 Z" fill="#fff" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-62 10 A62 62 0 0 1 -20 -46" stroke="#7FE07A" stroke-width="14" fill="none"/><path d="M-14 -50 A62 62 0 0 1 30 -44" stroke="#FFD84A" stroke-width="14" fill="none"/><path d="M36 -40 A62 62 0 0 1 62 10" stroke="#FF6B6B" stroke-width="14" fill="none"/>` +
  `<line x1="0" y1="16" x2="${f1(Math.cos(Math.PI * (1 - v)) * 58)}" y2="${f1(16 - Math.sin(Math.PI * (1 - v)) * 58)}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><circle cx="0" cy="16" r="10" fill="${INK}"/>` +
  (crack > 0 ? `<path d="M-30 -60 l20 30 l-14 14 l24 24" stroke="${INK}" stroke-width="6" fill="none" opacity="${f1(crack * 100) / 100}"/>` : '') + `</g>`;
const gyTarget = (r = 90, arrows = 0, t = 0) => { let s = [1, 0.75, 0.5, 0.25].map((k, i) => `<circle r="${f1(r * k)}" fill="${i % 2 ? '#fff' : '#FF6B6B'}" stroke="${INK}" stroke-width="6"/>`).join('');
  for (let i = 0; i < arrows; i++) { const a = hash(i * 3.1) * Math.PI * 2, d = r * 0.3 * hash(i * 7.3), x = Math.cos(a) * d, y = Math.sin(a) * d;
    s += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(-30 + hash(i * 5.5) * 20)})"><line x1="0" y1="0" x2="90" y2="0" stroke="${INK}" stroke-width="7"/><path d="M76 0 l20 -14 M76 0 l20 14 M66 0 l20 -14 M66 0 l20 14" stroke="${GFC.coral}" stroke-width="6"/></g>`; }
  return `<g>${s}</g>`; };
function gySprout(h, t, wilt = 0) { // 화분 + 새싹(h: 줄기 높이 px)
  const sw = Math.sin(t * 1.8) * 3 * (1 - wilt), tip = [sw + wilt * 40, -h + wilt * h * 0.35];
  return `<g><path d="M0 0 Q${f1(sw * 0.5)} ${f1(-h * 0.5)} ${f1(tip[0])} ${f1(tip[1])}" stroke="#3E9A4A" stroke-width="10" fill="none" stroke-linecap="round"/>` +
    `<g transform="translate(${f1(tip[0])} ${f1(tip[1])}) rotate(${f1(wilt * 60)})"><path d="M0 0 Q-46 -26 -60 6 Q-26 16 0 0 Z" fill="#7FD06A" stroke="${INK}" stroke-width="6"/><path d="M0 0 Q46 -30 62 2 Q28 16 0 0 Z" fill="#9BE07A" stroke="${INK}" stroke-width="6"/></g>` +
    `<path d="M-70 0 L70 0 L56 96 L-56 96 Z" fill="#E08A5A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-80" y="-14" width="160" height="28" rx="8" fill="#F0A070" stroke="${INK}" stroke-width="6"/></g>`; }
function gyRuler(len, mark, o = {}) { // 세운 자(원점 = 바닥). mark: 표시 높이(px), o.sticker: 붙은 숫자
  let s = `<rect x="-34" y="${-len}" width="68" height="${len}" rx="8" fill="#FFE38A" stroke="${INK}" stroke-width="7"/>`;
  for (let y = 40; y < len; y += 40) s += `<line x1="-34" y1="${-y}" x2="${y % 120 ? -14 : 4}" y2="${-y}" stroke="${INK}" stroke-width="4"/>`;
  s += `<path d="M-60 ${f1(-mark)} l26 -14 v28 Z" fill="#E5484D" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  if (o.sticker) s += `<g transform="translate(0 ${f1(-len + 40)}) rotate(-8) scale(${f1(o.stk || 1)})"><circle r="46" fill="#FF6B6B" stroke="${INK}" stroke-width="6"/>` + gfT(0, 15, o.sticker, 40, '#fff') + `</g>`;
  return `<g>${s}</g>`; }
function gyGasMon(t, s = 1, o = {}) { // 가스 누출 보스(우리 그림): 초록 연기 덩어리 + 화난 눈썹
  const w = Math.sin(t * 4) * 6, puff = (x, y, r, i) => `<circle cx="${f1(x + Math.sin(t * 3 + i) * 5)}" cy="${f1(y + Math.cos(t * 2.6 + i) * 5)}" r="${r}" fill="#A6E36A" stroke="${INK}" stroke-width="7"/>`;
  const P = [[-90, 10, 70], [-30, -40, 86], [50, -30, 80], [100, 30, 64], [0, 40, 80], [-60, 70, 54], [70, 80, 50]];
  return `<g transform="scale(${s}) rotate(${f1(w * 0.3)})">` + P.map(([x, y, r], i) => puff(x, y, r, i)).join('') + P.map(([x, y, r], i) => `<circle cx="${f1(x + Math.sin(t * 3 + i) * 5)}" cy="${f1(y + Math.cos(t * 2.6 + i) * 5)}" r="${r - 7}" fill="#B8EE7E"/>`).join('') +
    `<path d="M-56 -36 L-14 -18 M56 -36 L14 -18" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><ellipse cx="-30" cy="-2" rx="12" ry="16" fill="#fff" stroke="${INK}" stroke-width="5"/><ellipse cx="30" cy="-2" rx="12" ry="16" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-26" cy="2" r="6" fill="${INK}"/><circle cx="26" cy="2" r="6" fill="${INK}"/>` +
    `<path d="M-34 44 Q0 ${f1(20 + (o.roar || 0) * 30)} 34 44 Q0 ${f1(60 + (o.roar || 0) * 20)} -34 44 Z" fill="#3B6B2A" stroke="${INK}" stroke-width="6"/></g>`; }
const gyValve = (rot = 0) => `<g><rect x="-180" y="-16" width="360" height="32" fill="#9AA6B8" stroke="${INK}" stroke-width="6"/><rect x="-26" y="-30" width="52" height="60" rx="8" fill="#C9D3E0" stroke="${INK}" stroke-width="6"/><g transform="translate(0 -56) rotate(${f1(rot)})"><rect x="-60" y="-10" width="120" height="20" rx="10" fill="#FFD84A" stroke="${INK}" stroke-width="6"/></g><line x1="0" y1="-30" x2="0" y2="-50" stroke="${INK}" stroke-width="8"/></g>`;
const gyMask = `<path d="M-60 -10 Q-30 -30 0 -14 Q30 -30 60 -10 Q56 18 30 16 Q12 14 0 4 Q-12 14 -30 16 Q-56 18 -60 -10 Z" fill="${INK}"/><ellipse cx="-28" cy="-4" rx="12" ry="8" fill="#fff"/><ellipse cx="28" cy="-4" rx="12" ry="8" fill="#fff"/>`;
const gyOrb = (r = 22) => `<g><circle r="${r}" fill="#7FFFC8" stroke="${INK}" stroke-width="5"/><circle cx="${-r * 0.3}" cy="${-r * 0.3}" r="${r * 0.3}" fill="#fff" opacity=".8"/>${gfT(0, r * 0.35, 'EXP', r * 0.62, '#1E6B4A')}</g>`;
/* 지지직(화면 깨짐): k 0~1 */
function gyGlitch(t, k) { if (k <= 0) return ''; let s = '';
  for (let i = 0; i < 9; i++) { const y = ((hash(Math.floor(t * 18) + i * 3.3) * 1200) | 0) - 40, hh = 10 + hash(i * 7.7 + Math.floor(t * 12)) * 60, dx = (hash(i * 2.1 + Math.floor(t * 20)) - 0.5) * 120;
    s += `<rect x="${f1(-200 + dx)}" y="${f1(y)}" width="2400" height="${f1(hh)}" fill="${['#FF3B6B', '#3BE8FF', '#fff', '#1B1640'][i % 4]}" opacity="${f1(0.45 * k * 100) / 100}"/>`; }
  return s; }

/* ---------- c1·c2: 100점! 해피엔딩? → 천만에요(지지직) ---------- */
gyscoreScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 5, FY = GY.FY, ZX = GY.ZX;
  let h = fkDefs() + GY_DEFS;
  if (ph === 0) {
    const tS = gyW(a, '100', 1.0) - 0.1, tH = gyW(a, '해피', 2.6) - 0.2, tQ = gyW(a, '맞이', 3.6);
    const credits = gfK(tH, tH + 0.5, lt);
    let w = gfFull('url(#gfDawn)') + `<rect x="-600" y="-600" width="3120" height="2280" fill="url(#gfDots)"/>` + gfRays(t, 960, 420, 1300, '#fff', 16, 0.25, 10);
    w += `<rect x="-600" y="${FY}" width="3120" height="600" fill="#F2C48D"/><rect x="-600" y="${FY}" width="3120" height="20" fill="#FFF7E2" stroke="${INK}" stroke-width="6"/>`;
    w += gfActor(SPZW, { x: ZX - 120, y: FY, s: 1.05, t, pose: lt > tS ? '만세' : '서기', ex: fEx(lt > tS ? 'z하트눈' : 'z반짝'), look: [0, -0.3], seed: 3, headFx: gyGlassFx(0.8), holdR: lt > tS ? `<g transform="translate(0 -40) scale(.9)">${GY_TROPHY}</g>` : null }, lt > tS ? gfHop(lt, tS, 50, 0.4) : {});
    if (lt > tS - 0.1) w += fkAt(ZX + 360, 470, gyCert('합격 통지', '자격증 시험 · 실기'), gfIn(lt, tS - 0.1, 3, 0.45), 4) + fkAt(ZX + 380, 400, gfStamp(lt, tS + 0.2, '100점', { size: 70 })) + fkAt(ZX + 430, 560, gfStamp(lt, tS + 0.45, '수석 합격', { size: 44, col: GFC.grape }));
    w += gfConfetti(lt, tS + 0.2, { n: 40 });
    h += qCam(camLerp(lt / D, [960, 540, 1.0], [960, 520, 1.06]), w);
    if (credits > 0) { // 엔딩 크레딧
      h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#120E1C" opacity="${f1(0.82 * credits * 100) / 100}"/>`;
      h += fkAt(960, 330, gfBounceText(lt, tH + 0.1, 0, 0, [['HAPPY END', GFC.sun]], { size: 130 }), 1);
      const roll = (lt - tH - 0.3) * 90;
      [['주연', '제로'], ['특별 출연', 'AI 안경'], ['그리고', '아무도 몰랐다']].forEach(([a1, b1], i) => { const y = 860 - roll + i * 120; if (y > 420 && y < 1000) h += gfT(900, y, a1, 44, '#B8B0D8', { anchor: 'end', wt: 800 }) + gfT(940, y, b1, 52, '#fff', { anchor: 'start' }); });
      if (lt > tQ) h += fkAt(1450, 300, gfT(0, 40, '?', 150, GFC.coral, { sw: 14, stroke: '#fff' }), gfIn(lt, tQ, 3.4, 0.4), 12);
    }
  } else { // 천만에요: 화면이 지지직, HAPPY END가 금 가며 무너짐
    const g = gfK(0, 0.15, lt), fall = gfK(0.3, 1.1, lt), sh = gfShake(lt, 0.05, 22, 0.6);
    h += `<g transform="translate(${f1(sh[0])} ${f1(sh[1])})">` + gfFull('#120E1C') + gfRays(t, 960, 420, 1300, '#fff', 16, 0.06, 10);
    ['H', 'A', 'P', 'P', 'Y', ' ', 'E', 'N', 'D'].forEach((c, i) => { if (c === ' ') return; const x = 960 + (i - 4) * 104, dy = fall * (300 + 900 * fall) * (0.5 + hash(i * 1.7)), rot = fall * (hash(i * 3.3) - 0.5) * 120;
      h += `<g transform="translate(${f1(x)} ${f1(380 + dy)}) rotate(${f1(rot)})">${gfT(0, 46, c, 130, GFC.sun, { sw: 14, stroke: GFC.navy })}</g>`; });
    h += `<path d="M700 260 l80 90 l-50 40 l90 110 M1180 240 l-60 120 l70 30 l-40 120" stroke="#fff" stroke-width="8" fill="none" opacity="${f1(g * 100) / 100}"/>`;
    h += gyGlitch(t, 1 - gfK(0.5, 1.2, lt)) + `</g>`;
    h += fkAt(960, 700, gfChip('ERROR · 진짜 이야기는 지금부터', { size: 40, bg: '#FFE1E1' }), gfIn(lt, 0.35, 3.2, 0.45), -2);
  }
  return h;
};

/* ---------- c3~c6: 굿하트의 법칙 → 자와 새싹 → 꼼수 → 가짜 과녁 ---------- */
function gyLab(t) { // 밝은 실험 책상 무대
  return gfFull('#E9F2FF') + `<rect x="-600" y="-600" width="3120" height="2280" fill="url(#gfDots)"/>` +
    `<rect x="-600" y="760" width="3120" height="600" fill="#C9D9F0"/><rect x="200" y="740" width="1520" height="40" rx="14" fill="#E0A86B" stroke="${INK}" stroke-width="8"/><rect x="240" y="780" width="40" height="300" fill="#B97F4A" stroke="${INK}" stroke-width="7"/><rect x="1640" y="780" width="40" height="300" fill="#B97F4A" stroke="${INK}" stroke-width="7"/>`; }
gygoodScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 5;
  let h = fkDefs() + GY_DEFS;
  if (ph === 0) { // 경제학자 찰스 굿하트의 법칙(얼굴 없이 법칙 카드)
    const tG = Math.min(0.25, gyW(a, '찰스', 1.2) - 0.1), tL = gyW(a, '법칙', 2.6);
    let w = gfFull('url(#gyNavy)') + gfRays(t, 960, 430, 1200, GFC.sun, 14, 0.12, 8);
    w += fkAt(960, 470, gfItem(lt, tG, { svg: `<g transform="translate(0 30) scale(1.1)">${gyGauge(0.75)}</g>`, name: '굿하트의 법칙', sub: '경제학자 찰스 굿하트 · 1975', w: 600 }), 1.5);
    if (lt > tL) w += fkAt(960, 850, gfChip('법칙 카드 획득!', { size: 40, bg: GFC.sun }), gfIn(lt, tL, 3.2, 0.45), -2);
    h += qCam([960, 540, 1], w);
  } else if (ph === 1) { // 인용: 지표가 목표가 되는 순간
    const tT = gyW(a, '목표', 1.6), tX = gyW(a, '아니다', 4.0);
    let w = gfFull('url(#gyNavy)') + gfRays(t, 960, 430, 1200, GFC.sun, 14, 0.08, 8);
    w += fkAt(960, 300, gfPanel(1500, 270, { r: 40, head: '굿하트의 법칙', headBg: GFC.sun }) + gfT(0, -14, '"어떤 지표가 목표가 되는 순간,', 58, GFC.navy) + gfT(0, 70, '그 지표는 더 이상 좋은 지표가 아니다."', 58, GFC.navy), gfIn(lt, 0.05, 3, 0.45));
    w += fkAt(1430, 476, gfChip('널리 알려진 요약', { size: 38, bg: '#fff' }), gfIn(lt, 0.4, 3.2, 0.45), 3);
    const morph = gfK(tT - 0.1, tT + 0.3, lt);
    w += fkAt(640, 700, `<g opacity="${f1((1 - morph * 0.6) * 100) / 100}">${gyGauge(0.7, gfK(tX, tX + 0.3, lt))}</g>`, 1.9) + fkAt(640, 880, gfChip('지표', { size: 44, bg: '#fff' }), 1);
    if (lt > tT - 0.1) w += fkAt(960, 700, gfT(0, 30, '→', 110, '#fff'), gfIn(lt, tT - 0.1, 3, 0.45)) + fkAt(1280, 690, gyTarget(90), gfIn(lt, tT, 3, 0.45) * 1.5) + fkAt(1280, 880, gfChip('목표', { size: 44, bg: '#FFE1E1' }), gfIn(lt, tT + 0.1, 3, 0.45));
    if (lt > tX) w += fkAt(640, 690, `<path d="M-110 -100 L110 100 M110 -100 L-110 100" stroke="#E5484D" stroke-width="18" stroke-linecap="round"/>`, gfIn(lt, tX, 4, 0.4));
    h += qCam([960, 540, 1], w);
  } else if (ph === 2) { // 점수 = 자, 실력 = 새싹
    const tS = gyW(a, '점수', 0.8), tR = gyW(a, '실력', 1.6), tM = gyW(a, '위한', 2.35);
    const grow = 150 + 90 * gfK(tM, D - 0.3, lt);
    let w = gyLab(t);
    w += fkAt(840, 740, gySprout(grow, t), 1.2) + fkAt(1100, 740, gyRuler(440, grow * 1.2), 1.0);
    if (lt > tR - 0.1) w += fkAt(700, 420 - (grow - 150) * 1.2, gfChip('실력 = 새싹', { size: 40, bg: '#E3FFD6' }), gfIn(lt, tR - 0.1, 3.2, 0.45), -3);
    if (lt > tS - 0.1) w += fkAt(1300, 270, gfChip('점수 = 자', { size: 40, bg: '#FFF3B0' }), gfIn(lt, tS - 0.1, 3.2, 0.45), 3);
    if (lt > tM) w += fkAt(1250, 560, gfChip('재는 도구일 뿐', { size: 34, bg: '#fff' }), gfIn(lt, tM, 3.2, 0.45), 2);
    h += qCam(camLerp(lt / D, [980, 520, 1.25], [980, 500, 1.3]), w);
  } else { // '점수 따기'가 목표 → 새싹은 시들고 자를 늘리고 스티커 → 꼼수 → 가짜 과녁
    const tA = gyW(a, '점수', 0.6) - 0.1, tK = gyW(a, '키우는', 3.4), tSt = gyW(a, '훔치는', 4.6) - 0.1, tKk = gyW(a, '꼼수', 5.4), tEnd = Math.max(tKk + 1.0, D - 1.6);
    if (lt < tEnd) {
      const wilt = gfK(tK - 0.2, tK + 0.8, lt), stretch = easeOut(gfK(tSt, tSt + 0.7, lt)), stk = lt > tKk - 0.15;
      let w = gyLab(t);
      w += fkAt(840, 740, gySprout(240, t, wilt), 1.2) + fkAt(1100, 740, gyRuler(440 + 200 * stretch, 288 + 330 * stretch, { sticker: stk ? '100' : null, stk: stk ? gfIn(lt, tKk - 0.15, 3.4, 0.4) : 1 }), 1.0);
      if (stretch > 0 && stretch < 1) w += [-1, 1].map(d => `<circle cx="${1100 + d * 60}" cy="${f1(740 - 440 - 200 * stretch + 30)}" r="30" fill="#fff" stroke="${INK}" stroke-width="7"/>`).join('');
      // 조준선: 새싹 → 자(목표: 점수 따기)
      const aim = easeInOut(gfK(tA, tA + 0.6, lt)), ax = lerp(840, 1100, aim), ay = lerp(520, 420, aim);
      if (lt > tA - 0.2) w += `<g transform="translate(${f1(ax)} ${f1(ay)})" opacity="${f1(gfIn(lt, tA - 0.2, 3, 0.45) * 100) / 100}"><circle r="80" fill="none" stroke="#E5484D" stroke-width="9"/><circle r="40" fill="none" stroke="#E5484D" stroke-width="6"/><path d="M-110 0 H-50 M50 0 H110 M0 -110 V-50 M0 50 V110" stroke="#E5484D" stroke-width="9" stroke-linecap="round"/></g>` +
        fkAt(1420, 330, gfChip('목표: 점수 따기', { size: 42, bg: '#FFE1E1' }), gfIn(lt, tA + 0.4, 3.2, 0.45), 3);
      if (lt > tK) w += gfEmote(lt, tK, 760, 360, 'gloom', { hold: 4 });
      if (lt > tKk) w += fkAt(600, 300, gfStamp(lt, tKk + 0.1, '꼼수!', { size: 84 }));
      h += qCam(camLerp(lt / tEnd, [980, 500, 1.25], [1000, 470, 1.25]), w);
    } else { // 대본의 가짜 과녁: '점수'엔 화살 빽빽, '실력'은 텅 빔
      const k = gfIn(lt, tEnd, 3, 0.45);
      let w = gfFull('#FFF3E0') + `<rect x="-600" y="-600" width="3120" height="2280" fill="url(#gfDots)"/>`;
      w += fkAt(620, 480, gyTarget(170, 0), k) + fkAt(620, 740, gfChip('실력', { size: 48, bg: '#E3FFD6' }), k) + fkAt(1300, 480, gyTarget(170, Math.min(14, Math.floor((lt - tEnd) * 30))), k) + fkAt(1300, 740, gfChip('점수', { size: 48, bg: '#FFF3B0' }), k);
      w += fkAt(620, 260, gfChip('텅…', { size: 40, bg: '#fff' }), gfIn(lt, tEnd + 0.5, 3, 0.45), -4);
      h += qCam([960, 540, 1], w);
    }
  }
  return h;
};

/* ---------- c7·c8: 3년 뒤 — 화려한 스펙 → 가스 누출 보스 → 안경 먹통 → 껍데기 / EXP 도둑 ---------- */
function gyOffice(t, alarm = 0) {
  let h = gfRoom({ fy: GY.FY, wall: '#EAF0F7', wall2: '#D5E0EC', floor: '#BFC8D6', base: '#F4F7FB' }) + gfWindow(150, 180, 360, 280, t, {}) + gfPlant(1780, GY.FY, 0.9, t);
  h += `<g transform="translate(1500 640)">${gyValve(0)}</g><rect x="1660" y="420" width="40" height="${GY.FY - 420}" fill="#9AA6B8" stroke="${INK}" stroke-width="6"/>`;
  if (alarm > 0) { const on = Math.floor(t * 4) % 2; h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#FF3B3B" opacity="${f1(alarm * (on ? 0.16 : 0.06) * 100) / 100}"/><g transform="translate(960 70)"><rect x="-40" y="0" width="80" height="34" rx="8" fill="#5A6478" stroke="${INK}" stroke-width="6"/><path d="M-36 0 Q-36 -50 0 -50 Q36 -50 36 0 Z" fill="${on ? '#FF3B3B' : '#9A2A2A'}" stroke="${INK}" stroke-width="6"/></g>`; }
  return h;
}
gybossScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 10, FY = GY.FY, ZX = GY.ZX;
  let h = fkDefs() + GY_DEFS;
  if (ph === 0) {
    const tSp = gyW(a, '스펙', 2.6) - 0.2, tJ = gyW(a, '정작', 4.2) - 0.1, tG = gyW(a, '안경을', 4.7, 0) , tB = gyW(a, '벗어', 5.1), tC = gyW(a, '위기', 6.2) - 0.1, tN = gyW(a, '아무것도', 7.0), tSh = gyW(a, '껍데기', 8.3) - 0.1;
    const alarm = gfK(tJ, tJ + 0.3, lt), pov = lt > tB - 0.1 && lt < tC - 0.05;
    if (pov) { // 제로 시점: 빨간 경고(기기 화면은 제로 시점에서만)
      const k = gfIn(lt, tB - 0.1, 3, 0.45);
      h += gyOffice(t, 1) + gfLayer([1500, 600, 1.4], 1, `<g transform="translate(1300 520)">${gyGasMon(t, 1.6, { roar: 0.5 })}</g>`) + `<rect x="-600" y="-600" width="3120" height="2280" fill="#FF2E2E" opacity=".22"/>` + gyLensView(0.6);
      h += fkAt(960, 430, `<rect x="-480" y="-170" width="960" height="340" rx="30" fill="#3A0A14" fill-opacity=".85" stroke="#FF5A5A" stroke-width="8"/>` + gfT(0, -80, '⚠ AI 글래스 오류', 54, '#FFB0B0') + gfT(0, 6, 'BATTERY 0% · 네트워크 연결 끊김', 44, '#fff') + gfT(0, 90, '안경 사용 불가', 64, '#FF5A5A', { sw: 10, stroke: '#3A0A14' }), k * gfBeat(lt, tB, 0.12, 4, 8) * (1 + gfShake(lt, tB, 6, 0.3)[0] * 0.003));
      return h;
    }
    let w = gyOffice(t, alarm);
    if (lt < tJ) w += fkAt(960, 120, gfChip('3년 후', { size: 48, icon: 'calendar', bg: '#fff' }), gfIn(lt, 0.1, 3, 0.45), -2);
    // 가스 보스
    const mk = gfK(tJ, tJ + 0.6, lt), shrink = gfK(D - 1.1, D - 0.3, lt);
    if (mk > 0) { w += `<g transform="translate(${1420} ${f1(lerp(700, 420, easeOut(mk)))}) scale(${f1(lerp(0.3, 1.25, easeOut(mk)) * (1 - 0.8 * shrink))})">${gyGasMon(t, 1, { roar: lt > tC ? 0.6 + 0.4 * Math.sin(t * 8) : 0 })}</g>`;
      w += fkAt(1420, 130, gfPanel(460, 74, { r: 30 }) + gfT(-200, 12, '위기 상황', 32, '#E5484D', { anchor: 'start' }) + `<g transform="translate(-30 0)">${gfBar(220, 1, { col: '#FF5A5A', h: 26 })}</g>`, gfIn(lt, tJ + 0.3, 3, 0.45)) +
        fkAt(1420, 760, gfChip('가스 누출!', { size: 40, bg: '#FFE1E1' }), gfIn(lt, tJ + 0.2, 3, 0.45), 3); }
    // 제로: 스펙 자랑 → 놀람 → 안경 톡 → 껍데기 → 날아감
    const shell = gfK(tSh, tSh + 0.4, lt), blow = easeIn(gfK(tSh + 0.5, D, lt)), zx = ZX - 280 - 900 * blow, zy = FY - 200 * Math.sin(Math.PI * Math.min(1, blow * 1.4));
    const pose = lt > tG - 0.2 && lt < tB + 0.4 ? 'gy톡' : lt > tJ ? '만세' : lt > tSp ? '주먹' : '서기';
    const zero = gfActor(SPZW, { x: zx, y: zy, s: 1.0, t, pose, ex: fEx(lt > tN ? 'z멘붕' : lt > tJ ? 'z충격' : 'z뿌듯'), look: [0.6, 0], seed: 3, rot: -40 * blow, headFx: gyGlassFx(lt > tB ? 0 : 0.6), sweat: lt > tJ }, lt > tJ && lt < tJ + 0.5 ? gfJelly(lt, tJ, 0.14, 5, 8) : {});
    w += gyGhost(zero, shell * 0.9);
    if (lt > tSp - 0.1 && lt < tJ + 0.4) { const k = gfIn(lt, tSp - 0.1, 3, 0.45) * gfOut(lt, tJ + 0.1, 0.3);
      [[ZX - 620, 380, gyCert('자격증', '수석 합격'), -6], [ZX - 280, 230, `<g transform="scale(1.3)">${GY_TROPHY}</g>`, 0], [ZX + 60, 380, gyCert('스펙', '빵빵'), 6]].forEach(([x, y, svg, r], i) => { w += fkAt(x, y + Math.sin(t * 2 + i) * 6, svg, k * 0.8, r); });
      w += fkAt(ZX - 280, 120, gfChip('화려한 스펙', { size: 40, bg: GFC.sun }), k, -2); }
    if (lt > tN - 0.1) { const k = gfIn(lt, tN - 0.1, 3, 0.45) * (1 - blow);
      w += fkAt(1060, 190, gfPanel(520, 170, { r: 30, head: '제로 스탯', headBg: '#fff' }) + gfT(-220, -14, '점수', 34, GFC.navy, { anchor: 'start' }) + gfT(220, -14, '100', 40, GFC.navy, { anchor: 'end' }) + gfT(-220, 52, '실제 실력', 34, GFC.navy, { anchor: 'start' }) + gfT(220, 52, 'Lv.1', 40, '#E5484D', { anchor: 'end' }), k); }
    if (lt > tSh) w += fkAt(ZX - 280, FY - 640, gfChip('껍데기', { size: 44, bg: '#fff' }), gfIn(lt, tSh, 3.2, 0.45) * (1 - blow), -4);
    if (lt > tSh + 0.4) w += [0, 1, 2, 3].map(i => `<path d="M${1200 - i * 30} ${640 + i * 50} q-200 -30 -420 0" stroke="#A6E36A" stroke-width="12" fill="none" stroke-linecap="round" opacity=".7"/>`).join('');   // 보스의 입김
    if (lt > tC && lt < tC + 0.8) w += gfEmote(lt, tC, zx + 150, zy - 560, 'shock', { hold: 0.7 });
    // 끝 1초: 선배가 밸브를 잠그고 창문을 열자 가스 보스가 쪼그라듦(정확한 대처: 밸브·환기, 전기 스위치는 안 건드림)
    const tFix = D - 1.3;
    if (lt > tFix - 0.6) { const cx = lerp(2100, 1560, easeOut(gfK(tFix - 0.6, tFix, lt))), vr = 90 * gfK(tFix, tFix + 0.4, lt);
      w += `<g transform="translate(1500 640)">${gyValve(vr)}</g>` + gfActor(spPass(4), { x: cx, y: FY, s: 0.95, t, pose: lt > tFix ? '들기' : walkPose(cx * 0.05, 1), ex: fEx('z결심'), look: [-0.6, 0], seed: 77 }, {});
      if (lt > tFix) w += fkAt(1560, 300, gfChip('밸브 잠금 · 창문 열기!', { size: 38, bg: '#E3FFD6' }), gfIn(lt, tFix, 3.2, 0.45), 3); }
    h += qCam(camLerp(lt / D, [960, 540, 1.0], [900, 540, 1.06]), w);
    if (lt > tJ && lt < tJ + 1.0) h += fkAt(960, 300, gfBounceText(lt, tJ, 0, 0, [['WARNING', '#FF3B3B']], { size: 110 }), 1);
  } else { // 남을 속인 줄 알았지만 → 사실은 EXP를 도둑맞음
    const tL = gyW(a, '속인', 0.6), tR = gyW(a, '사실은', 1.9) - 0.1, tS = gyW(a, '도둑', 3.9) - 0.1;
    if (lt < tR) { // 몰래 점수 자루를 들고 살금살금(감독관은 졸음)
      let w = gyBackRoom(t, { clock: 200 }) + gyExaminees(t);
      const zx = lerp(560, 1120, gfK(0, tR, lt)), wk = gfWalk(zx * 1.3, 0.6);
      w += gfActor(SPZW, { x: zx, y: FY, s: 1, t, pose: wk.pose, ex: fEx('z히죽'), look: [0.4, 0], seed: 3, headFx: () => gyGlassFx(0.7)() + `<g transform="translate(200 196) scale(1.6)">${gyMask}</g>`, holdR: `<g transform="translate(0 40)"><path d="M-40 -40 Q0 -70 40 -40 L50 40 Q0 60 -50 40 Z" fill="#C9A06A" stroke="${INK}" stroke-width="6"/>${gfT(0, 20, '100점', 30, GFC.navy)}</g>` }, { sy: wk.sy, dy: wk.dy - 10 });
      w += gfActor(GY_PROC, { x: 1600, y: 870, s: 0.82, t, pose: '서기', ex: fEx('z졸음'), look: [-0.4, 0.2], seed: 40 }, {}) + gfEmote(lt, 0.1, 1680, 870 - 470, 'zzz', { hold: 9 });
      if (lt > tL) w += fkAt(zx, FY - 640, gfChip('남을 속였다?', { size: 40, bg: '#fff' }), gfIn(lt, tL, 3.2, 0.45), -3);
      h += qCam(camLerp(lt / tR, [960, 560, 1.1], [1000, 560, 1.16]), w);
    } else { // 되감기: 안경이 빨대로 EXP 구슬을 쪽쪽 → 가면 쓰고 달아남
      const u = lt - tR, run = gfK(tS, tS + 1.2, lt);
      let w = gfFull('#2A2350') + gfRays(t, 960, 420, 1300, '#8E7CFF', 14, 0.1, 6);
      w += gfActor(SPZW, { x: 760, y: FY, s: 1.15, t, pose: '서기', ex: fEx(lt > tS ? 'z울먹' : 'z멍'), look: [0.5, -0.2], seed: 3, noGlass: true }, {});
      const exp = 1 - gfK(tR + 0.2, tS + 0.2, lt);
      w += fkAt(760, 160, gfPanel(560, 80, { r: 32 }) + gfT(-240, 12, 'EXP', 34, GFC.navy, { anchor: 'start' }) + `<g transform="translate(-150 0)">${gfBar(360, exp, { col: '#7FFFC8', h: 28 })}</g>`, 1.1);
      const gx = lerp(1060, 2300, easeIn(run)), gy = 330 + Math.sin(t * 9) * 8 * (run > 0 ? 1 : 0.3);
      // 빨대: 제로 머리 → 안경
      if (run < 0.15) { w += `<path d="M820 ${330} Q930 230 ${f1(gx - 100)} ${f1(gy)}" stroke="#FF9AB0" stroke-width="16" fill="none" stroke-linecap="round"/>`;
        for (let i = 0; i < 4; i++) { const p = ((u * 1.4 + i / 4) % 1); const x = lerp(820, gx - 100, p), y = 330 - Math.sin(Math.PI * p) * 90; w += fkAt(x, y, gyOrb(20), 0.9); } }
      w += fkAt(gx, gy, `<g transform="scale(1.7)">${gyGlasses(0.8, t)}</g><g transform="translate(0 -6) scale(2.4)">${lt > tS ? gyMask : ''}</g>` + (lt > tS ? `<g transform="translate(150 40)"><path d="M-50 -40 Q0 -80 50 -40 L60 50 Q0 74 -60 50 Z" fill="#7FFFC8" stroke="${INK}" stroke-width="6"/>${gfT(0, 26, 'EXP', 34, '#1E6B4A')}</g>` : ''), 1, run > 0 ? -8 : 0);
      if (run > 0) w += [0, 1, 2].map(i => `<line x1="${f1(gx - 200 - i * 40)}" y1="${f1(gy - 40 + i * 40)}" x2="${f1(gx - 360 - i * 40)}" y2="${f1(gy - 40 + i * 40)}" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".6"/>`).join('');
      if (lt > tS) w += fkAt(960, 820, gfChip('성장 기회 도둑맞음!', { size: 48, bg: '#FFE1E1' }), gfIn(lt, tS + 0.3, 3.2, 0.45), -2);
      if (u < 0.35) w += gyGlitch(t, 1 - u / 0.35);
      h += qCam([960, 540, 1], w);
    }
  }
  return h;
};
