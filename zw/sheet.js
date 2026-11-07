/* 제로 표정 시트 / 리액션 연기 시트 렌더러 (기획용) */
const SHEET_BG = '#E9EEF5', CARD = '#FFFFFF', SUB = '#5B6478';
const HINT = {
  'z기본': '기본 · 대기', 'z반짝': '반짝 · 기대될 때', 'z하트눈': '하트눈 · 반했을 때', 'z빵긋': '빵긋 · 신났을 때', 'z설렘': '설렘 · 칭찬받았을 때', 'z뿌듯': '뿌듯 · 해냈을 때',
  'z히죽': '히죽 · 꿍꿍이', 'z메롱': '메롱 · 장난', 'z당황': '당황 · 들켰을 때', 'z민망': '민망 · 머쓱할 때', 'z의심': '의심 · 갸웃할 때', 'z멍': '멍 · 머리 정지',
  'z울먹': '울먹 · 울기 직전', 'z엉엉': '엉엉 · 폭풍 눈물', 'z삐짐': '삐짐 · 서운할 때', 'z버럭': '버럭 · 화날 때', 'z충격': '충격 · 뼈 맞았을 때', 'z소름': '소름 · 오싹할 때',
  'z멘붕': '멘붕 · 머리 터질 때', 'z기절': '기절 · KO', 'z결심': '결심 · 불타오를 때', 'z졸음': '졸음 · 꾸벅꾸벅', 'z하품': '하품 · 지루할 때'
};
const sTxt = (x, y, s, size, fill, w = 900, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-weight="${w}" font-size="${size}" fill="${fill}">${esc(s)}</text>`;
const zBody = (x, y, s, t, expr, o = {}) => Z(Object.assign({ x, y, s, t, pose: '서기', look: [0, 0], ex: { expr, prev: expr, k: 1, blink: 0 }, seed: 5 }, o));
function drawFaces(t) {
  const W2 = 1920, H2 = 1460, cw = 290, ch = 300, gap = 20, x0 = (W2 - (6 * cw + 5 * gap)) / 2, y0 = 150;
  let h = `<rect width="${W2}" height="${H2}" fill="${SHEET_BG}"/>` + sTxt(x0, 76, '제로 표정 시트 v3', 52, INK, 900, 'start') + sTxt(x0, 118, '눈 하이라이트 · 볼터치 · 만화 기호를 더한 23종 + 기존 기본 표정(오른쪽 아래)', 26, SUB, 500, 'start');
  const list = Z_EXPR.concat(['기본']);
  list.forEach((k, i) => {
    const c = i % 6, r = Math.floor(i / 6), x = x0 + c * (cw + gap), y = y0 + r * (ch + gap), old = k === '기본';
    h += `<defs><clipPath id="cell${i}"><rect x="${x}" y="${y}" width="${cw}" height="${ch - 54}" rx="22"/></clipPath></defs>`;
    h += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="22" fill="${old ? '#DDE2EA' : CARD}"/>`;
    h += `<g clip-path="url(#cell${i})"><rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="${old ? '#D3D9E3' : '#F7F9FC'}"/>` + zBody(x + cw / 2, y + 112 + 390 * 0.58, 0.58, t + i * 0.37, k) + `</g>`;
    h += sTxt(x + cw / 2, y + ch - 18, old ? '기존 · 기본' : HINT[k], 26, old ? SUB : INK, 800);
  });
  return [W2, H2, h];
}
function drawActing(t) {
  const W2 = 1920, H2 = 1080, x0 = 70;
  let h = `<rect width="${W2}" height="${H2}" fill="${SHEET_BG}"/>` + sTxt(x0, 76, '리액션 연기 예시: “깜짝!” 한 번', 52, INK, 900, 'start') + sTxt(x0, 118, '같은 순간을 기존은 2장(표정 교체), 새 기준은 7단계(예비동작 → 튀어오름 → 정점 → 착지 → 반동 → 정착)로 연기합니다.', 26, SUB, 500, 'start');
  // new 7-step take
  const F = [
    ['평소', '0f', { expr: 'z기본', sy: 1, dy: 0, pose: '서기' }],
    ['예비동작: 움찔', '+4f', { expr: 'z기본', sy: 0.9, sx: 1.06, dy: 0, pose: '웅크림', blink: 1 }],
    ['튀어오름', '+7f', { expr: 'z충격', sy: 1.14, sx: 0.92, dy: -70, pose: '만세' }],
    ['정점', '+10f', { expr: 'z충격', sy: 1.05, sx: 0.97, dy: -96, pose: '만세', lines: 1 }],
    ['착지: 찌그러짐', '+13f', { expr: 'z당황', sy: 0.88, sx: 1.08, dy: 0, pose: '웅크림' }],
    ['반동', '+16f', { expr: 'z당황', sy: 1.04, sx: 0.98, dy: 0, pose: '서기' }],
    ['정착 + 땀', '+22f', { expr: 'z당황', sy: 1, sx: 1, dy: 0, pose: '가슴' in P ? '가슴' : '서기', sweat: 1 }],
  ];
  const cw = 248, gy = 660;
  h += `<rect x="${x0 - 20}" y="160" width="${W2 - 2 * x0 + 40}" height="620" rx="26" fill="${CARD}"/>` + sTxt(x0, 200, '새 기준 (7단계, 약 1초)', 30, INK, 900, 'start');
  F.forEach(([name, fr, o], i) => {
    const cx = x0 + 60 + i * cw + cw / 2 - 60, y = gy + o.dy;
    h += `<ellipse cx="${cx}" cy="${gy + 6}" rx="${f1(70 * (1 - Math.min(0.5, -o.dy / 300)))}" ry="12" fill="#000" opacity=".12"/>`;
    h += zBody(cx, y, 0.62, t + i * 0.1, o.expr, { sy: o.sy, sx: o.sx || 1, pose: o.pose, ex: { expr: o.expr, prev: o.expr, k: 1, blink: o.blink || 0 } });
    if (o.lines) h += `<g stroke="${INK}" stroke-width="7" stroke-linecap="round">` + [-1, 1].map(s => `<path d="M${cx + s * 120} ${y - 330} l${s * 34} -20 M${cx + s * 130} ${y - 270} l${s * 40} 0 M${cx + s * 120} ${y - 210} l${s * 34} 20"/>`).join('') + `</g>`;
    h += sTxt(cx, 716, name, 25, INK, 800) + sTxt(cx, 752, fr, 23, SUB, 700);
  });
  // old 2-step
  h += `<rect x="${x0 - 20}" y="800" width="${W2 - 2 * x0 + 40}" height="260" rx="26" fill="#DDE2EA"/>` + sTxt(x0, 840, '기존 (표정만 교체)', 30, SUB, 900, 'start');
  [['기본', '0f'], ['놀람', '+1f']].forEach(([e, fr], i) => {
    const cx = x0 + 400 + i * 230; h += `<g><defs><clipPath id="oc${i}"><rect x="${cx - 110}" y="815" width="220" height="200"/></clipPath></defs><g clip-path="url(#oc${i})">${zBody(cx, 815 + 100 + 390 * 0.45, 0.45, t, e)}</g></g>` + sTxt(cx, 1042, fr, 23, SUB, 700);
  });
  h += sTxt(x0 + 900, 920, '차이: 몸 전체가 반응하고(찌그러짐·늘어남), 멈추기 전에 한 번 더 출렁이며,', 28, INK, 600, 'start') + sTxt(x0 + 900, 964, '표정 사이에 만화 기호(그늘선·충격선·땀)가 감정을 한 번 더 말해 줍니다.', 28, INK, 600, 'start');
  return [W2, H2, h];
}
window.drawSheet = (kind, t = 1.3) => {
  const [W2, H2, inner] = kind === 'faces' ? drawFaces(t) : drawActing(t);
  const v = document.getElementById('v'); v.setAttribute('width', W2); v.setAttribute('height', H2); v.setAttribute('viewBox', `0 0 ${W2} ${H2}`);
  v.innerHTML = defs(t) + inner;
};

/* ---------- 여자 캐릭터 시트 ---------- */
const gTr = (x, y, s) => `translate(${f1(x)} ${f1(y)}) scale(${s}) translate(-200 -560)`;
const AB_HOOD = `<path d="M60 180 Q56 34 200 30 Q344 34 340 180 Q344 290 286 300 L114 300 Q56 290 60 180 Z" fill="#F2D33B" stroke="${INK}" stroke-width="8"/>`;
const abVisor = (x, y, s, op) => `<g transform="${gTr(x, y, s)}"><rect x="104" y="120" width="192" height="150" rx="56" fill="#BFE6FF" fill-opacity="${op}" stroke="${INK}" stroke-width="7"/><path d="M124 140 Q150 128 176 134" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/></g>`;
function drawGirls(t) {
  const W2 = 1920, H2 = 1500, x0 = 60;
  let h = `<rect width="${W2}" height="${H2}" fill="${SHEET_BG}"/>` + sTxt(x0, 76, '제로의 세계 · 여자 캐릭터 기준', 52, INK, 900, 'start') +
    sTxt(x0, 118, '같은 몸(막대 팔다리, 둥근 손발)에 머리 모양 · 속눈썹 · 볼터치 · 소품으로 매력을 냅니다. 머리카락은 한 박자 늦게 흔들립니다.', 26, SUB, 500, 'start');
  const G = [
    ['단발 보브 + 별 핀', 'bob', [], '#FFD36E', '#5B8DEF', 'z기본'],
    ['포니테일', 'pony', [], '#FF9AB0', null, 'z빵긋'],
    ['양갈래 똥머리', 'buns', [], '#9ED8B4', '#F4E2C0', 'z반짝'],
    ['긴 생머리 + 머리띠', 'long', [], '#C7B8F5', '#6B5BB8', 'z설렘'],
    ['숏컷 + 귀걸이', 'short', [], '#7EC8F0', null, 'z히죽'],
    ['웨이브 + 베레모', 'wave', [], '#F59A6A', '#3D5D7E', 'z뿌듯'],
  ];
  const cw = 290, gap = 16, ch = 560, y0 = 150;
  G.forEach(([name, hs, args, top, dress, ex], i) => {
    const x = x0 + i * (cw + gap), cx = x + cw / 2;
    h += `<rect x="${x}" y="${y0}" width="${cw}" height="${ch}" rx="24" fill="${CARD}"/><ellipse cx="${cx}" cy="${y0 + 486}" rx="80" ry="12" fill="#000" opacity=".1"/>`;
    h += zGirl({ hairStyle: hs, hairArgs: args, top, dress: dress || undefined, x: cx, y: y0 + 490, s: 0.7, t: t + i * 0.4, pose: i % 3 === 1 ? '손인사' : '서기', ex: { expr: ex, prev: ex, k: 1, blink: 0 }, look: [0, 0] });
    h += sTxt(cx, y0 + ch - 26, name, 27, INK, 800);
  });
  // row 2: one character, six expressions
  const y1 = y0 + ch + 24, ex2 = [['z기본', '기본'], ['z빵긋', '빵긋'], ['z설렘', '설렘'], ['z삐짐', '삐짐'], ['z엉엉', '엉엉'], ['z버럭', '버럭']];
  h += sTxt(x0, y1 + 34, '표정 23종을 그대로 씁니다(속눈썹이 함께 움직임) — 포니테일 예시', 28, INK, 800, 'start');
  ex2.forEach(([e, name], i) => {
    const x = x0 + i * (cw + gap), y = y1 + 54, cx = x + cw / 2;
    h += `<defs><clipPath id="gx${i}"><rect x="${x}" y="${y}" width="${cw}" height="250" rx="22"/></clipPath></defs><rect x="${x}" y="${y}" width="${cw}" height="296" rx="22" fill="${CARD}"/>`;
    h += `<g clip-path="url(#gx${i})"><rect x="${x}" y="${y}" width="${cw}" height="250" fill="#F7F9FC"/>${zGirl({ hairStyle: 'pony', top: '#FF9AB0', x: cx, y: y + 112 + 390 * 0.58, s: 0.58, t: t + i * 0.3, ex: { expr: e, prev: e, k: 1, blink: 0 } })}</g>` + sTxt(cx, y + 282, name, 26, INK, 800);
  });
  // row 3: AB before / after + rules
  const y2 = y1 + 370;
  h += `<rect x="${x0}" y="${y2}" width="${2 * cw + gap}" height="400" rx="24" fill="${CARD}"/>` + sTxt(x0 + 24, y2 + 44, '혈액형 편 AB형 손님', 28, INK, 800, 'start');
  [[0, '기존'], [1, '새 기준']].forEach(([k, name]) => {
    const cx = x0 + 150 + k * 300, y = y2 + 340, s = 0.48;
    const o = { goggles: 'none', vest: '#F2D33B', patch: false, tee: true, x: cx, y, s, t, seed: 74, pose: '서기', look: [0, 0] };
    if (k === 0) h += HALO(`<g transform="${gTr(cx, y, s)}">${AB_HOOD}</g>` + char(Object.assign(o, { ex: { expr: '심드렁', prev: '심드렁', k: 1, blink: 0 } }))) + abVisor(cx, y, s, 0.28);
    else h += HALO(char(Object.assign(o, { hairBack: AB_HOOD, hairFront: gBangs(GH.choco), lash2: true, browW: 8, ex: { expr: 'z기본', prev: 'z기본', k: 1, blink: 0 } }))) + abVisor(cx, y, s, 0.12);
    h += sTxt(cx, y2 + 384, name, 26, k ? INK : SUB, 800);
  });
  const rx = x0 + 2 * cw + gap + 30, R = [
    '머리 모양이 실루엣을 정한다: 멀리서 봐도, 그림자만 봐도 누군지 알 수 있게 6종을 돌려 씁니다.',
    '흔들림이 귀여움의 절반: 포니테일·단발 끝·리본·귀걸이는 몸보다 한 박자 늦게 움직입니다.',
    '눈꼬리 속눈썹 두 가닥 + 볼터치 조금 더 진하게. 입술 색은 넣지 않습니다.',
    '옷은 파스텔 두 색 조합(티 + 치마 또는 바지). 나이·성격은 머리·색·소품으로 표현합니다.',
    '하지 않는 것: 몸매 강조, 노출, 과장된 포즈. 성인 인물은 대본 나이 그대로 성인으로 그립니다.',
    '몸짓은 남녀 같은 연기 원칙을 씁니다. 성격 차이는 걸음걸이와 리액션 크기로 냅니다.',
  ];
  h += `<rect x="${rx}" y="${y2}" width="${W2 - rx - x0}" height="400" rx="24" fill="${CARD}"/>` + sTxt(rx + 28, y2 + 48, '그리는 규칙', 30, INK, 900, 'start');
  R.forEach((r, i) => { h += `<circle cx="${rx + 38}" cy="${y2 + 96 + i * 50}" r="7" fill="#FF9AB0"/>` + sTxt(rx + 58, y2 + 105 + i * 50, r, 23, INK, 600, 'start'); });
  return [W2, H2, h];
}
const _drawSheet0 = window.drawSheet;
window.drawSheet = (kind, t = 1.3) => {
  if (kind !== 'girls') return _drawSheet0(kind, t);
  const [W2, H2, inner] = drawGirls(t), v = document.getElementById('v');
  v.setAttribute('width', W2); v.setAttribute('height', H2); v.setAttribute('viewBox', `0 0 ${W2} ${H2}`); v.innerHTML = defs(t) + inner;
};
