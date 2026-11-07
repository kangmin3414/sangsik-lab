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
