/* ---------- experiment 018: if a Korean lived in Japan for 30 years — SVG parts (chapter cards, charts) ---------- */
// One image all the way: diving down an iceberg. 1 m (life) → 10 m (words) → 100 m (heart) → the sea floor (Korea seen from outside).
// Story pictures are in ai018.js (illustrations). This file draws only the chapter cards ('jcard') and the charts ('jchart').
Object.assign(CAMS, { jcard: [1.0, 1.04, 960, 540], jchart: [1.0, 1.03, 960, 520], jai: [1.0, 1.0, 960, 540] });
const T18 = (x, y, txt, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${o.anchor || 'middle'}" font-family="${FONT}" font-weight="${o.w || 900}" font-size="${o.size || 40}" fill="${o.fill || NAVY}">${txt}</text>`;
const D18 = a => a._dur || 4;
const at18 = (t, a, phrase, d = 0) => fracOf13(t, phrase) * D18(a) + d;
const card18 = (x, y, w, h, inner, bg = '#FFFDF4') => `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="${-w / 2 + 8}" y="${-h / 2 + 10}" width="${w}" height="${h}" rx="26" fill="#000" opacity=".12"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="26" fill="${bg}" stroke="${INK}" stroke-width="6"/>${inner}</g>`;
function paper18() { return BG('#FFF4E0') + BG('url(#hatch)').replace('/>', ' opacity=".1"/>'); }

// ---- the iceberg cross-section (chapter cards) ----
const DEPTHS = [[0, '', ''], [1, '1년 차', '수심 1m · 생활'], [2, '5년 차', '수심 10m · 말'], [3, '10년 차', '수심 100m · 마음과 동네'], [4, '30년 차', '바다의 바닥 · 밖에서 본 우리']];
function iceberg18(t, n, k) {   // n = chapter (0 = title), k = 0..1 dive progress
  let h = `<defs><linearGradient id="sea18" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FE0E6"/><stop offset=".6" stop-color="#3FB6C8"/><stop offset="1" stop-color="#2A8FB0"/></linearGradient></defs>`;
  h += BG('#D9F2FA') + `<rect x="-600" y="300" width="3120" height="1400" fill="url(#sea18)"/>`;
  for (let i = 0; i < 6; i++) { const x = ((i * 380 + t * 20) % 2300) - 200; h += `<path d="M${f1(x)} 300 q40 -12 80 0 t80 0" fill="none" stroke="#fff" stroke-width="5" opacity=".8"/>`; }
  // two icebergs: Japan (right, big) and Korea (left, smaller, warm underside appears at the floor)
  h += `<path d="M1060 300 L1180 170 L1290 220 L1380 150 L1500 300 Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  h += `<path d="M1060 300 L1500 300 L1600 520 L1520 760 L1380 900 L1180 880 L1040 700 L990 480 Z" fill="#E6F7FB" opacity=".85" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  h += `<path d="M420 300 L500 220 L580 250 L640 300 Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  h += `<path d="M420 300 L640 300 L700 470 L640 640 L520 700 L410 600 L370 430 Z" fill="${n === 4 ? '#FFD9C8' : '#E6F7FB'}" opacity=".85" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  // shared floor
  h += `<path d="M-600 960 Q300 900 700 940 Q1100 980 1500 930 Q2000 900 2520 960 L2520 1700 L-600 1700 Z" fill="#E9D7A8" stroke="${INK}" stroke-width="6"/>`;
  if (n === 4) h += `<path d="M520 700 Q620 860 900 920 Q1150 950 1380 900" fill="none" stroke="#C8A86A" stroke-width="14" opacity=".8"/>`;
  // depth marks on the right edge of the Japan iceberg
  const Y = [300, 340, 470, 690, 930];
  [1, 2, 3, 4].forEach(j => { h += `<line x1="1620" y1="${Y[j]}" x2="1660" y2="${Y[j]}" stroke="#fff" stroke-width="5"/>` + T18(1680, Y[j] + 12, DEPTHS[j][2].split(' · ')[0], { anchor: 'start', size: 30, fill: '#fff' }); });
  // the diver (Zero) going down
  if (n > 0) {
    const y0 = Y[n - 1] + (n === 1 ? -60 : 0), y1 = Y[n], y = lerp(y0, y1, easeInOut(k)), x = 1560 + Math.sin(t * 1.5) * 6;
    h += `<g transform="translate(${f1(x)} ${f1(y - 40)})"><circle r="34" fill="#F2C14E" stroke="${INK}" stroke-width="6"/><circle r="20" fill="#DFF4FA" stroke="${INK}" stroke-width="4"/><rect x="-20" y="30" width="40" height="44" rx="10" fill="#F2C14E" stroke="${INK}" stroke-width="5"/></g>`;
    for (let b = 0; b < 4; b++) { const p = (t * 0.7 + b / 4) % 1; h += `<circle cx="${f1(x + 10 + Math.sin(p * 9 + b) * 8)}" cy="${f1(y - 80 - p * 140)}" r="${4 + b}" fill="none" stroke="#fff" stroke-width="3" opacity="${f1((1 - p) * 100) / 100}"/>`; }
  }
  return h;
}
function jcardScene(t, lt, a) {
  const n = a.n || 0, D = D18(a), T0 = t - lt;
  let h = iceberg18(t, n, prog(lt, 0.2, Math.min(2.2, D)));
  if (n === 0) {
    h += pop(t, T0 + 0.1, t + 99, 640, 150, outlined(0, 0, [[['만약에 한국 사람이', '#fff']], [['일본에서 ', '#fff'], ['30년', YEL], ['을 산다면?', '#fff']]], { size: 74, sw: 15, lh: 96 }), { noPop: true, inDur: 0.5 });
    ['1년', '5년', '10년', '30년'].forEach((s, j) => h += pop(t, T0 + at18(t, a, s, -0.1), t + 99, 260 + j * 230, 420 + j * 120, label(0, 0, s, { size: 40, bg: ['#FFD9E4', '#CDEBD9', '#F8D3AE', '#D6E4F0'][j] }), { rot: -3 }));
    return h;
  }
  const [, yr, sub] = DEPTHS[n];
  h += pop(t, T0 + 0.15, t + 99, 560, 170, card18(0, 0, 700, 210, T18(0, -12, yr, { size: 84, fill: n === 4 ? RED : NAVY }) + T18(0, 64, sub, { size: 38, fill: '#6B6255' }), n === 4 ? '#FFF1EA' : '#FFFDF4'), { rot: -2 });
  if (n === 4) h += pop(t, T0 + 0.9, t + 99, 560, 360, label(0, 0, "카운터 이름이 바뀝니다 → '몰랐던 한국'", { size: 34, bg: '#FFB8A0' }), { rot: 2 });
  return h;
}

// ---- charts ----
function jchartScene(t, lt, a) {
  const k = a.k, D = D18(a), T0 = t - lt;
  let h = paper18();
  if (k === 1 || k === 2) {   // U-curve myth vs Ward et al. 1998
    const ox = 420, oy = 820, w = 1100, hh = 520;
    h += `<path d="M${ox} ${oy - hh} L${ox} ${oy} L${ox + w} ${oy}" fill="none" stroke="${INK}" stroke-width="7"/>` + T18(ox + w, oy + 56, '시간 →', { anchor: 'end', size: 34, fill: '#6B6255' }) + T18(ox - 20, oy - hh - 20, '적응(편안함)', { anchor: 'start', size: 34, fill: '#6B6255' });
    const U = Array.from({ length: 41 }, (_, i) => { const x = i / 40; return [ox + x * w, oy - hh * (0.86 - 0.62 * Math.sin(Math.PI * Math.min(1, x * 1.15)) * (x < 0.85 ? 1 : 1))]; });
    const ku = k === 1 ? prog(lt, 0.3, 2.4) : 1, nU = Math.max(2, Math.round(41 * ku));
    h += `<polyline points="${U.slice(0, nU).map(p => f1(p[0]) + ',' + f1(p[1])).join(' ')}" fill="none" stroke="#8C98A4" stroke-width="9" stroke-dasharray="${k === 2 ? '18 14' : 'none'}" stroke-linecap="round"/>`;
    h += pop(t, T0 + 0.4, t + 99, ox + 330, oy - hh * 0.95, label(0, 0, '흔히 말하는 U자', { size: 34, bg: '#E6EBF0' }), { rot: -3 });
    if (k === 1) { [['허니문', 0.08], ['우울', 0.5], ['회복', 0.92]].forEach(([s, x], j) => h += pop(t, T0 + 0.8 + j * 0.9, t + 99, ox + x * w, x === 0.5 ? oy - 90 : oy - hh * 0.95 + 70, label(0, 0, s, { size: 30, bg: '#fff' }), {})); }
    if (k === 2) {
      const kk = prog(lt, at18(t, a, 'U자가', 0), at18(t, a, 'U자가', 0.4));
      if (kk > 0) h += pop(t, T0 + at18(t, a, 'U자가', 0), t + 99, ox + 640, oy - hh * 0.62, label(0, 0, 'U자는 없었다', { size: 36, bg: '#FFB8A0' }), { rot: 4 });
      const kr = prog(lt, at18(t, a, '처음이', -0.2), at18(t, a, '처음이', 1.6)), R = Array.from({ length: 41 }, (_, i) => { const x = i / 40; return [ox + x * w, oy - hh * (0.18 + 0.66 * (1 - Math.exp(-3 * x)))]; });
      if (kr > 0) h += `<polyline points="${R.slice(0, Math.max(2, Math.round(41 * kr))).map(p => f1(p[0]) + ',' + f1(p[1])).join(' ')}" fill="none" stroke="#2E9E6E" stroke-width="12" stroke-linecap="round"/>`;
      if (kr > 0.3) h += pop(t, T0 + at18(t, a, '처음이', 0.4), t + 99, ox + 200, oy - 40, label(0, 0, '처음이 가장 힘들다', { size: 36, bg: MINT }), { rot: 2 }) + T18(ox + w, oy - hh - 20, '개념도', { anchor: 'end', size: 26, fill: '#8A8070', w: 700 });
    }
    return h;
  }
  if (k === 3) {   // honorific direction: Korea vs Japan
    const side = (x, flag, title, line, note, up) => card18(0, 0, 760, 560,
      T18(0, -220, flag, { size: 44, fill: NAVY }) + T18(0, -150, title, { size: 30, fill: '#6B6255', w: 700 }) +
      `<circle cx="-200" cy="10" r="70" fill="#fff" stroke="${INK}" stroke-width="6"/>` + T18(-200, 22, up ? '사장' : '거래처', { size: 30 }) +
      `<circle cx="200" cy="10" r="70" fill="#fff" stroke="${INK}" stroke-width="6"/>` + T18(200, 22, up ? '거래처' : '사장', { size: 30 }) +
      `<path d="M-110 10 L110 10" stroke="${up ? RED : '#2E9E6E'}" stroke-width="10"/><path d="M${up ? '-110 10 l30 -22 m-30 22 l30 22' : '110 10 l-30 -22 m30 22 l-30 22'}" stroke="${up ? RED : '#2E9E6E'}" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      T18(0, 160, line, { size: 32, fill: NAVY }) + T18(0, 220, note, { size: 26, fill: '#8A6A44', w: 700 }));
    h += pop(t, T0 + 0.1, t + 99, 520, 470, side(0, '한국', '거래처 전화에', '"사장님께서는 안 계십니다"', '우리 사장을 높인다', true), {});
    h += pop(t, T0 + 0.5, t + 99, 1400, 470, side(0, '일본', '거래처 전화에', '"사장 다나카는 없습니다"', '바깥사람을 높이고 우리 쪽은 낮춘다', false), {});
    h += pop(t, T0 + at18(t, a, '방향', -0.2), t + 99, 960, 880, label(0, 0, '같은 존댓말, 높이는 방향이 다르다', { size: 40, bg: YEL }), {});
    return h;
  }
  if (k === 4 || k === 5) {   // high-context: nunchi and kuuki
    const radar = (x, word, sub) => `<g transform="translate(${x} 430)">` + [0, 1, 2].map(r => `<circle r="${80 + r * 70}" fill="none" stroke="#7FB8A4" stroke-width="5" opacity="${f1((0.9 - r * 0.25) * 100) / 100}"/>`).join('') +
      `<path d="M0 0 L${f1(220 * Math.cos(t * 1.6))} ${f1(220 * Math.sin(t * 1.6))}" stroke="#2E9E6E" stroke-width="7"/><circle r="14" fill="#2E9E6E"/>` + T18(0, 330, word, { size: 52 }) + T18(0, 384, sub, { size: 28, fill: '#6B6255', w: 700 }) + '</g>';
    h += radar(560, '눈치', '한국') + radar(1360, '空気を読む', '일본 · 공기(분위기)를 읽다');
    h += pop(t, T0 + 0.2, t + 99, 960, 110, label(0, 0, '둘 다 고맥락 문화 — 말보다 맥락을 읽는다', { size: 38, bg: '#FFFDF4' }), {});
    if (k === 5) h += pop(t, T0 + at18(t, a, '돌려', -0.2), t + 99, 960, 960, label(0, 0, '돌려 말하기 = 서로의 체면을 지키는 방식', { size: 38, bg: YEL }), {});
    return h;
  }
  if (k === 6) {   // Berry's four strategies
    const ox = 960, oy = 520, s = 300, cells = [['통합', '둘 다 지킨다', 1, -1, MINT], ['동화', '새 문화만', 1, 1, '#FFD9C9'], ['분리', '옛 문화만', -1, -1, '#D6E4F0'], ['주변화', '둘 다 잃는다', -1, 1, '#E6E1D8']];
    cells.forEach(([n, d, cx, cy, c], j) => h += pop(t, T0 + at18(t, a, n, -0.15), t + 99, ox + cx * s * 0.55, oy + cy * s * 0.5, card18(0, 0, 320, 230, T18(0, -10, n, { size: 54 }) + T18(0, 50, d, { size: 28, fill: '#6B6255', w: 700 }), c), {}));
    h += T18(ox, oy - 360, '새 문화를 받아들인다 →', { size: 30, fill: '#6B6255' }) + `<g transform="translate(${ox - 560} ${oy}) rotate(-90)">${T18(0, 0, '옛 문화를 지킨다 →', { size: 30, fill: '#6B6255' })}</g>`;
    const zk = prog(lt, 0.6 * D, D);   // Zero's marker sits in 'assimilation' (his experiment 3)
    h += `<g transform="translate(${f1(ox + s * 0.55 + 130)} ${f1(oy + s * 0.5 - 80)})" opacity="${f1(zk * 100) / 100}"><circle r="30" fill="#fff" stroke="${INK}" stroke-width="5"/>` + T18(0, 12, '제로', { size: 22 }) + '</g>';
    return h;
  }
  if (k === 7) {   // bicultural adjustment (concept) + "debated"
    const bars = [['두 문화를 함께', 0.72, MINT], ['한쪽 문화만', 0.58, '#C9CFD6']];
    h += `<line x1="560" y1="800" x2="1360" y2="800" stroke="${INK}" stroke-width="6"/>`;
    bars.forEach(([n, v, c], j) => { const x = 760 + j * 400, kk = easeOut(prog(lt, 0.3 + j * 0.4, 1.3 + j * 0.4)), hh = 520 * v * kk;
      h += `<rect x="${x - 100}" y="${f1(800 - hh)}" width="200" height="${f1(hh)}" rx="14" fill="${c}" stroke="${INK}" stroke-width="6"/>` + T18(x, 850, n, { size: 34 }); });
    h += T18(960, 170, '적응 (개념도)', { size: 36, fill: '#6B6255' }) + T18(960, 230, '83개 연구 · 23,197명', { size: 30, fill: '#8A6A44', w: 700 });
    h += pop(t, T0 + at18(t, a, '논쟁', -0.2), t + 99, 1500, 330, label(0, 0, '효과 크기는 논쟁 중', { size: 36, bg: '#FFB8A0' }), { rot: 6 });
    return h;
  }
  if (k === 8) {   // national character vs measured traits (concept)
    const ox = 960, oy = 540;
    h += T18(ox + 120, 215, '49개 문화 · 국민성 이미지 vs 실제로 잰 성격 (개념도)', { size: 34, fill: '#6B6255' });
    h += `<line x1="${ox - 520}" y1="${oy + 260}" x2="${ox + 520}" y2="${oy + 260}" stroke="${INK}" stroke-width="5"/><line x1="${ox - 520}" y1="${oy + 260}" x2="${ox - 520}" y2="${oy - 260}" stroke="${INK}" stroke-width="5"/>`;
    h += T18(ox + 520, oy + 310, '사람들이 떠올린 국민성 →', { anchor: 'end', size: 28, fill: '#6B6255', w: 700 }) + `<g transform="translate(${ox - 570} ${oy}) rotate(-90)">${T18(0, 0, '실제로 잰 성격 →', { size: 28, fill: '#6B6255', w: 700 })}</g>`;
    for (let i = 0; i < 49; i++) { const r = (Math.sin(i * 12.9898) * 43758.5453) % 1, q = (Math.sin(i * 78.233 + 1.7) * 24634.6345) % 1; const rr = Math.abs(r), qq = Math.abs(q); kk = prog(lt, 0.4 + i * 0.04, 0.8 + i * 0.04);
      if (kk > 0) h += `<circle cx="${f1(ox - 480 + rr * 960)}" cy="${f1(oy + 220 - qq * 440)}" r="${f1(10 * kk)}" fill="${['#7FB8A4', '#F2B84B', '#E8893A'][i % 3]}" opacity=".85"/>`; }
    h += pop(t, T0 + at18(t, a, '거의', -0.2), t + 99, ox + 300, oy - 290, label(0, 0, '거의 맞지 않았다', { size: 38, bg: YEL }), { rot: 4 });
    return h;
  }
  return h;
}
function jaiScene(t, lt, a) { return paper18() + T18(960, 540, '(그림 ' + (a.shot || '') + ')', { size: 60, fill: '#C9BFA8' }); }   // shown only if a picture is missing

// the 016 template still carries 014's render wrapper (its HUD); 018 draws its own HUD in ai018.js
render = function (t) { _render12(t); };
window.render = render;
