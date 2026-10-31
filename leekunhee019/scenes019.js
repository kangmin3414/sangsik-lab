/* ---------- experiment 019: Lee Kun-hee — a staircase biography. SVG parts: step cards ('kstep'), decision diagrams ('kdec'), number charts ('knum').
   Story pictures are in ai019.js. HUD (stairs, decision cards, year) is drawn in ai019.js too, so it also sits on top of the pictures. ---------- */
Object.assign(CAMS, { kstep: [1.0, 1.03, 960, 540], kdec: [1.0, 1.03, 960, 520], knum: [1.0, 1.02, 960, 520], kai: [1.0, 1.0, 960, 540] });
const T19 = (x, y, txt, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${o.anchor || 'middle'}" font-family="${FONT}" font-weight="${o.w || 900}" font-size="${o.size || 40}" fill="${o.fill || NAVY}">${txt}</text>`;
const D19 = a => a._dur || 4;
const at19 = (t, a, phrase, d = 0) => fracOf13(t, phrase) * D19(a) + d;
const card19 = (x, y, w, h, inner, bg = '#FFFDF4') => `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="${-w / 2 + 8}" y="${-h / 2 + 10}" width="${w}" height="${h}" rx="26" fill="#000" opacity=".12"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="26" fill="${bg}" stroke="${INK}" stroke-width="6"/>${inner}</g>`;
const STEPS19 = ['', '보는 눈', '믿는 힘', '부끄러움', '버리는 용기', '나누는 마음'];
const QS19 = ['', '혼자였던 시간이 남긴 나의 눈은?', '남들이 안 믿어도 내가 믿는 것은?', "내 삶의 '세탁기 뚜껑'은?", '아까워서 붙잡은 나의 15만 대는?', '혼자 보던 것을 누구와 나눌까?'];
const DECS19 = ['', '남들이 안 믿을 때, 먼저', '어려운 길보다 고치기 쉬운 길', '남보다 먼저, 더 크게', '양보다 질 — 라인 멈추기', '사람에게 먼저 투자', '아까워도 버리기'];
function film19(t) {   // warm paper background with film-strip edges
  let h = BG('#FFF4E0') + BG('url(#hatch)').replace('/>', ' opacity=".1"/>');
  for (const y of [0, 1020]) { h += `<rect x="-600" y="${y}" width="3120" height="60" fill="#2B2620"/>`; for (let x = -560; x < 2520; x += 70) h += `<rect x="${(x + (t * 40) % 70).toFixed(1)}" y="${y + 18}" width="34" height="24" rx="5" fill="#FFF4E0"/>`; }
  return h;
}
// the staircase drawn big (step cards) — n = current step (0 = all dim, 6 = all lit with questions)
function stairs19(t, n, x0, y0, w, hh, o = {}) {
  let h = '';
  for (let k = 1; k <= 5; k++) {
    const x = x0 + (k - 1) * w, y = y0 - (k - 1) * hh, on = n >= k, cur = n === k;
    h += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(hh * (k) + 40)}" fill="${on ? (cur ? '#F2B84B' : '#FFE29A') : '#E7DECB'}" stroke="${INK}" stroke-width="6"/>`;
    h += T19(x + w / 2, y + 52, String(k), { size: 40, fill: on ? NAVY : '#B5AA94' }) + T19(x + w / 2, y + 100, STEPS19[k], { size: o.small ? 26 : 30, fill: on ? NAVY : '#B5AA94' });
    if (o.qs && on) h += `<g transform="translate(${f1(x + w / 2)} ${f1(y - 40)})">` + label(0, 0, QS19[k], { size: 22, bg: '#fff' }) + '</g>';
  }
  return h;
}
function kstepScene(t, lt, a) {
  const n = a.n || 0, D = D19(a), T0 = t - lt;
  let h = film19(t);
  if (n === 0) {
    h += pop(t, T0 + 0.1, t + 99, 960, 200, outlined(0, 0, [[['외톨이 소년이', '#fff']], [['세계 1등 회사', YEL], ['를 만들기까지', '#fff']]], { size: 70, sw: 14, lh: 92 }), { noPop: true, inDur: 0.4 });
    h += stairs19(t, Math.min(5, Math.floor(prog(lt, 0.8, D - 0.3) * 6)), 410, 820, 220, 90);
    return h;
  }
  if (n === 6) {
    h += stairs19(t, 6, 360, 860, 240, 92, { qs: true, small: true });
    if (a.line) h += pop(t, T0 + 0.2, t + 99, 960, 150, card19(0, 0, 1500, 170, T19(0, -12, '인생을 바꾸는 건 거창한 선언이 아니라,', { size: 46 }) + T19(0, 54, '부끄러운 장면을 끝까지 보는 용기', { size: 52, fill: RED })), {});
    return h;
  }
  h += stairs19(t, n, 410, 860, 220, 90);
  h += pop(t, T0 + 0.1, t + 99, 640, 230, card19(0, 0, 720, 190, T19(0, -14, `${['', '첫', '두', '세', '네', '다섯'][n]} 번째 계단`, { size: 40, fill: '#9A6A1E' }) + T19(0, 60, STEPS19[n], { size: 76 })), { rot: -2 });
  const climber = n;   // a small marker climbing onto the current step
  const x = 410 + (climber - 1) * 220 + 110, y = 860 - (climber - 1) * 90 - 30 - 30 * Math.abs(Math.sin(prog(lt, 0, 0.6) * Math.PI));
  h += `<g transform="translate(${f1(x)} ${f1(y)})"><circle r="26" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="-8" cy="-4" r="4" fill="${INK}"/><circle cx="8" cy="-4" r="4" fill="${INK}"/></g>`;
  return h;
}
// decision diagrams
function decTag19(t, T0, k) { return pop(t, T0 + 0.2, t + 99, 960, 120, label(0, 0, `결정 ${'①②③④⑤⑥'[k - 1]} · ${DECS19[k]}`, { size: 44, bg: YEL }), { rot: -1 }); }
function kdecScene(t, lt, a) {
  const k = a.k, D = D19(a), T0 = t - lt;
  let h = film19(t);
  if (k === 1) {
    h += decTag19(t, T0, 1);
    h += `<path d="M300 760 L1620 760" stroke="${INK}" stroke-width="6"/>`;
    for (let i = 0; i < 7; i++) h += `<g transform="translate(${1000 + i * 90} 700)"><circle r="34" fill="#E6E1D8" stroke="${INK}" stroke-width="5"/><path d="M-12 -4 l8 6 m8 -6 l-8 6" stroke="${INK}" stroke-width="4"/></g>` + T19(1000 + i * 90, 820, '✕', { size: 28, fill: '#B5AA94' });
    h += pop(t, T0 + 0.6, t + 99, 520, 690, `<circle r="44" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="-12" cy="-6" r="5" fill="${INK}"/><circle cx="12" cy="-6" r="5" fill="${INK}"/><path d="M-12 14 q12 10 24 0" fill="none" stroke="${INK}" stroke-width="4"/>`, {});
    h += pop(t, T0 + 0.9, t + 99, 520, 560, label(0, 0, '먼저 줄 서기', { size: 36, bg: MINT }), {}) + pop(t, T0 + 1.2, t + 99, 1270, 560, label(0, 0, '"반도체? 무리야"', { size: 34, bg: '#fff' }), {});
    return h;
  }
  if (k === 2) {
    const house = (x, up, lbl, good) => {
      let g = `<g transform="translate(${x} 0)"><rect x="-260" y="700" width="520" height="260" fill="#D9C7A6" stroke="${INK}" stroke-width="6"/>`;
      if (up) for (let i = 0; i < 4; i++) g += `<rect x="-80" y="${620 - i * 110}" width="160" height="100" rx="8" fill="#BFE3F5" stroke="${INK}" stroke-width="6"/>` + (i === 2 ? `<circle cx="40" cy="${670 - i * 110}" r="16" fill="${RED}"/>` : '');
      else for (let i = 0; i < 4; i++) g += `<rect x="-80" y="${710 + i * 60}" width="160" height="52" rx="6" fill="#8A6A44" opacity="${0.5 + i * 0.12}" stroke="${INK}" stroke-width="5"/>` + (i === 2 ? `<circle cx="40" cy="${736 + i * 60}" r="14" fill="${RED}" opacity=".35"/>` : '');
      g += T19(0, 1010, lbl, { size: 40 }) + `</g>`;
      return g;
    };
    h += house(560, false, '파 내려가기', false) + house(1360, true, '쌓아 올리기', true);
    h += pop(t, T0 + at19(t, a, '파 내려가면', 0) || T0 + 0.5, t + 99, 560, 400, label(0, 0, '문제가 안 보인다', { size: 34, bg: '#E6E1D8' }), {});
    if (lt > at19(t, a, '쌓으면', -0.1)) h += pop(t, T0 + at19(t, a, '쌓으면', -0.1), t + 99, 1360, 120, label(0, 0, '보이고, 고치기 쉽다', { size: 36, bg: MINT }), {});
    if (lt > at19(t, a, '두 번째', -0.2)) h += decTag19(t, T0 + at19(t, a, '두 번째', -0.4), 2);
    return h;
  }
  if (k === 3) {
    const wafer = (x, r, lbl, n) => { let g = `<g transform="translate(${x} 560)"><circle r="${r}" fill="#C9D3DE" stroke="${INK}" stroke-width="7"/>`;
      const s = 26; for (let yy = -r; yy < r; yy += s) for (let xx = -r; xx < r; xx += s) if (Math.hypot(xx + s / 2, yy + s / 2) < r - 10) g += `<rect x="${xx + 2}" y="${yy + 2}" width="${s - 4}" height="${s - 4}" fill="#8FA6C0"/>`;
      return g + T19(0, r + 70, lbl, { size: 40 }) + `</g>`; };
    h += wafer(600, 170, '6인치', 0) + wafer(1300, 228, '8인치 — 칩이 훨씬 많이', 0);
    if (a.risk) h += pop(t, T0 + 0.2, t + 99, 960, 200, label(0, 0, '불황 · 실패하면 큰 손실', { size: 40, bg: '#FFB8A0' }), { rot: -2 });
    else if (a.tag) h += decTag19(t, T0, 3);
    else if (lt > at19(t, a, '이듬해', -0.2)) h += pop(t, T0 + at19(t, a, '이듬해', -0.2), t + 99, 1300, 200, label(0, 0, '1993 · 세계 첫 8인치 양산 라인', { size: 36, bg: MINT }), {});
    return h;
  }
  if (k === 4) {
    h += decTag19(t, T0, 4);
    h += `<rect x="260" y="560" width="1400" height="60" rx="30" fill="#C9D3DE" stroke="${INK}" stroke-width="6"/>`;
    const stop = lt > at19(t, a, '멈추고', -0.1) && lt < at19(t, a, '다시', 0);
    for (let i = 0; i < 7; i++) { const x = 300 + ((i * 210 + (stop ? 0 : lt * 160)) % 1400), bad = i === 3;
      h += `<rect x="${f1(x)}" y="490" width="110" height="70" rx="10" fill="${bad ? '#FFB8A0' : '#fff'}" stroke="${INK}" stroke-width="5"/>` + (bad ? T19(x + 55, 538, '!', { size: 44, fill: RED }) : ''); }
    h += pop(t, T0 + 0.6, t + 99, 560, 330, label(0, 0, '양보다 질', { size: 44, bg: '#fff' }), {});
    if (stop) h += `<g transform="translate(1500 330)"><circle r="70" fill="${RED}" stroke="${INK}" stroke-width="6"/>` + T19(0, 16, 'STOP', { size: 40, fill: '#fff' }) + '</g>';
    return h;
  }
  if (k === 5) {
    h += decTag19(t, T0, 5);
    h += `<ellipse cx="960" cy="600" rx="760" ry="330" fill="#CFE8F3" stroke="${INK}" stroke-width="6"/>`;
    const blobs = [[600, 520, 180, 110], [980, 470, 140, 90], [1280, 600, 170, 120], [820, 720, 120, 70], [1420, 470, 100, 60]];
    blobs.forEach(([x, y, rx, ry]) => h += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#BFE0B0" stroke="${INK}" stroke-width="4"/>`);
    const n = lt < at19(t, a, '200', -0.2) ? 20 : 200, show = Math.min(n, Math.floor(prog(lt, 0.3, 2.0) * 20 + (n === 200 ? prog(lt, at19(t, a, '200', -0.2), at19(t, a, '200', 1.4)) * 180 : 0)));
    for (let i = 0; i < show; i++) { const b = blobs[i % 5], ang = i * 2.4, rr = Math.sqrt((i % 37) / 37);
      h += `<circle cx="${f1(b[0] + Math.cos(ang) * b[2] * 0.8 * rr)}" cy="${f1(b[1] + Math.sin(ang) * b[3] * 0.8 * rr)}" r="7" fill="${RED}" stroke="#fff" stroke-width="2"/>`; }
    h += pop(t, T0 + 0.4, t + 99, 1560, 900, label(0, 0, `${n}여 명`, { size: 48, bg: n === 200 ? YEL : '#fff' }), {});
    return h;
  }
  if (k === 7) {   // the six decisions together
    h += T19(960, 150, '삼성을 키운 6가지 결정', { size: 56 });
    for (let i = 1; i <= 6; i++) { const col = (i - 1) % 3, row = Math.floor((i - 1) / 3);
      h += pop(t, T0 + 0.2 + i * 0.25, t + 99, 420 + col * 540, 400 + row * 260, card19(0, 0, 480, 200, T19(0, -24, '①②③④⑤⑥'[i - 1], { size: 52, fill: '#9A6A1E' }) + T19(0, 50, DECS19[i], { size: 32 }), '#FFF7D6'), { rot: (i % 2 ? -1.5 : 1.5) }); }
    if (lt > 0.1) h += pop(t, T0 + 0.1, t + 99, 960, 960, label(0, 0, '그리고 수많은 연구원과 직원들', { size: 36, bg: MINT }), {});
    return h;
  }
  return h;
}
function knumScene(t, lt, a) {
  const k = a.k, D = D19(a), T0 = t - lt;
  let h = film19(t);
  if (k === 1) {
    const bars = [['1995년 초', 11.8, '#FFB8A0'], ['화형식 뒤', 2, MINT]];
    h += T19(960, 170, '휴대폰 불량률', { size: 52 }) + `<line x1="520" y1="820" x2="1400" y2="820" stroke="${INK}" stroke-width="6"/>`;
    bars.forEach(([nm, v, c], j) => { const x = 740 + j * 440, kk = easeOut(prog(lt, 0.2 + j * 0.6, 1.0 + j * 0.6)), hh = v / 12 * 520 * kk;
      h += `<rect x="${x - 110}" y="${f1(820 - hh)}" width="220" height="${f1(hh)}" rx="14" fill="${c}" stroke="${INK}" stroke-width="6"/>` + T19(x, 880, nm, { size: 36 }) + (kk > 0.9 ? T19(x, 800 - hh, (j ? '2%대' : '11.8%'), { size: 44, fill: j ? '#2E9E6E' : RED }) : ''); });
    if (lt > at19(t, a, '국내', -0.2)) h += pop(t, T0 + at19(t, a, '국내', -0.2), t + 99, 1560, 300, label(0, 0, '그해 여름 국내 1위', { size: 38, bg: YEL }), { rot: 4 });
    return h;
  }
  const rows = [['매출', '약 39배', 39, MINT, '9조 9천억 → 387조'], ['시가총액', '약 396배', 396, YEL, '1조 → 396조']];
  h += T19(960, 160, '1987 → 2018 · 삼성그룹', { size: 52 }) + T19(1700, 990, '별세 당시 보도 기준', { anchor: 'end', size: 24, fill: '#8A8070', w: 700 });
  rows.forEach(([nm, txt, v, c, sub], j) => { const y = 380 + j * 260, kk = easeOut(prog(lt, 0.3 + j * 0.9, 1.6 + j * 0.9)), w = (Math.log10(v) / Math.log10(400)) * 1100 * kk;
    h += T19(300, y + 14, nm, { anchor: 'start', size: 44 }) + `<rect x="300" y="${y + 40}" width="${f1(Math.max(20, w))}" height="90" rx="20" fill="${c}" stroke="${INK}" stroke-width="6"/>` +
      `<rect x="300" y="${y + 40}" width="20" height="90" rx="6" fill="#E7DECB" stroke="${INK}" stroke-width="4"/>` +
      (kk > 0.85 ? T19(330 + w, y + 100, txt, { anchor: 'start', size: 52, fill: RED }) + T19(300, y + 180, sub, { anchor: 'start', size: 28, fill: '#6B6255', w: 700 }) : ''); });
  h += T19(1700, 950, '막대 길이는 로그 눈금', { anchor: 'end', size: 22, fill: '#8A8070', w: 700 });
  return h;
}
function kaiScene(t, lt, a) { return film19(t) + T19(960, 540, '(그림 ' + (a.shot || '') + ')', { size: 60, fill: '#C9BFA8' }); }
// the 016 template still carries 014's render wrapper — draw the base frame only; the HUD lives in ai019.js
render = function (t) { _render12(t); };
window.render = render;
