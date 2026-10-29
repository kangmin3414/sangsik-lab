/* ---------- experiment 008 · enjoy uselessness like Zhuangzi ---------- */
// helpers T8, panel, hbar, vbar, check, xMark, qmarks, deskG come from ../descartes/scenes8.js
const INKP = '#F3EEDF', JADE = '#4E6E58', SILK = '#C8423A', MUD = '#7A5A3A';
var CAMS = {
  zh: [1.0, 1.05, 960, 540], tree: [1.0, 1.05, 960, 540], leisure: [1.0, 1.05, 960, 540], gourd: [1.0, 1.05, 960, 540],
  candle: [1.0, 1.05, 960, 520], sit: [1.0, 1.1, 960, 560], shock: [1.0, 1.06, 960, 540], incub: [1.0, 1.04, 960, 520],
  cook: [1.0, 1.05, 960, 520], hours: [1.0, 1.03, 960, 520], turtle: [1.0, 1.05, 960, 540], goals: [1.0, 1.04, 960, 520],
  butterfly: [1.0, 1.08, 960, 540], meadow: [1.0, 1.06, 960, 560]
};
P['좌선'] = { armL: [[148, 285], [124, 350], [152, 404]], hL: [158, 408], armR: [[252, 285], [276, 350], [248, 404]], hR: [242, 408], legL: [[180, 412], [116, 462], [212, 484]], fL: [226, 488, -10], legR: [[220, 412], [284, 462], [188, 484]], fR: [174, 488, 10], dy: 46 };
P['낚시'] = Object.assign({ armL: [[148, 285], [150, 345], [196, 330]], hL: [204, 326], armR: [[252, 285], [262, 340], [226, 326]], hR: [220, 322] }, LEGS);

/* ---------- ink-wash world ---------- */
function inkBg(t, o = {}) {
  let h = BG(o.sky || 'url(#inkSky)') + BG('url(#paper)');
  if (o.sun !== false) h += `<circle cx="${o.sx || 1500}" cy="${o.sy || 230}" r="${o.sr || 80}" fill="${o.sunC || '#E8734A'}" opacity=".85"/>`;
  const layer = (y, amp, c, op, seed, sp) => { let d = `M-600 1480 L-600 ${y}`; for (let x = -600; x <= 2520; x += 60) d += ` L${x} ${f1(y - Math.abs(Math.sin(x / (180 + seed * 20) + seed)) * amp - Math.sin(x / 77 + seed * 3) * amp * 0.18)}`; return `<path d="${d} L2520 1480 Z" fill="${c}" opacity="${op}"/>`; };
  h += layer(o.y1 || 560, 260, '#B9C4BC', 0.75, 1) + `<rect x="-600" y="${(o.y1 || 560) - 40}" width="3120" height="90" fill="#fff" opacity=".35"/>`;
  h += layer(o.y2 || 700, 200, '#8FA394', 0.85, 2) + `<rect x="-600" y="${(o.y2 || 700) - 30}" width="3120" height="70" fill="#fff" opacity=".3"/>`;
  if (o.ground !== false) h += `<path d="M-600 ${o.gy || 880} Q400 ${(o.gy || 880) - 30} 960 ${o.gy || 880} Q1500 ${(o.gy || 880) + 26} 2520 ${(o.gy || 880) - 10} L2520 1480 L-600 1480 Z" fill="${o.gc || '#A9B98F'}" stroke="${INK}" stroke-width="6"/>`;
  return h;
}
function pine(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-10 0 Q-20 -120 10 -220 Q30 -300 0 -380" fill="none" stroke="#5A4130" stroke-width="22" stroke-linecap="round"/><path d="M-10 0 Q-20 -120 10 -220 Q30 -300 0 -380" fill="none" stroke="${INK}" stroke-width="5" opacity=".4"/>${[[-110, -260, 120], [90, -320, 110], [-60, -380, 90], [60, -200, 90]].map(([cx, cy, w]) => `<ellipse cx="${cx}" cy="${cy}" rx="${w}" ry="${w * 0.32}" fill="#3F6B4A" stroke="${INK}" stroke-width="5"/>`).join('')}</g>`; }
function gnarled(x, y, s, t = 0) { // the "useless" tree: twisted trunk, knots, crooked branches
  const sw = Math.sin(t * 0.8) * 2;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  h += `<path d="M-70 0 Q-20 -60 -60 -140 Q-110 -230 -20 -290 Q40 -330 10 -400 L60 -400 Q90 -320 40 -270 Q-30 -210 30 -130 Q70 -60 60 0 Z" fill="#7A5235" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  h += `<ellipse cx="-30" cy="-180" rx="16" ry="22" fill="#5A3A22" stroke="${INK}" stroke-width="5"/><ellipse cx="34" cy="-80" rx="12" ry="16" fill="#5A3A22" stroke="${INK}" stroke-width="5"/>`;
  h += `<path d="M-40 -280 Q-140 -300 -170 -380 Q-200 -420 -260 -400" fill="none" stroke="#7A5235" stroke-width="22" stroke-linecap="round"/><path d="M30 -340 Q130 -360 150 -440 Q170 -480 240 -470" fill="none" stroke="#7A5235" stroke-width="20" stroke-linecap="round"/><path d="M-120 -330 Q-90 -400 -130 -450" fill="none" stroke="#7A5235" stroke-width="14" stroke-linecap="round"/>`;
  h += `<g transform="rotate(${f1(sw)} 0 -400)">`;
  for (const [cx, cy, r] of [[-250, -420, 110], [-110, -500, 140], [60, -540, 150], [220, -480, 120], [-20, -430, 120]]) h += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#5E8C4E" stroke="${INK}" stroke-width="7"/>`;
  for (const [cx, cy, r] of [[-250, -440, 70], [-110, -530, 90], [60, -570, 90], [220, -500, 70]]) h += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#76A862"/>`;
  return h + `</g></g>`;
}
function fanG(x, y, s, rot = 0, open = 1) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})">`;
  const a0 = -90 - 60 * open, a1 = -90 + 60 * open, R = 110;
  const p = a => [Math.cos(a * Math.PI / 180) * R, Math.sin(a * Math.PI / 180) * R];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  h += `<path d="M0 0 L${f1(x0)} ${f1(y0)} A${R} ${R} 0 0 1 ${f1(x1)} ${f1(y1)} Z" fill="#F4E9D0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  for (let i = 1; i < 8; i++) { const [xx, yy] = p(lerp(a0, a1, i / 8)); h += `<line x1="0" y1="0" x2="${f1(xx)}" y2="${f1(yy)}" stroke="#B89A6E" stroke-width="3"/>`; }
  h += `<path d="M${f1(x0 * 0.6)} ${f1(y0 * 0.6)} Q0 -80 ${f1(x1 * 0.6)} ${f1(y1 * 0.6)}" fill="none" stroke="${JADE}" stroke-width="5" opacity=".6"/>`;
  return h + `<circle r="9" fill="${WALNUT}" stroke="${INK}" stroke-width="4"/></g>`;
}
function butterfly(x, y, s, t, c = '#F2A33A') {
  const fl = Math.abs(Math.sin(t * 14)) * 0.75 + 0.25;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><g transform="scale(${f1(fl * 100) / 100} 1)"><path d="M0 0 Q-60 -70 -70 -20 Q-74 10 0 4 Z M0 0 Q60 -70 70 -20 Q74 10 0 4 Z" fill="${c}" stroke="${INK}" stroke-width="5"/><path d="M0 6 Q-46 50 -30 60 Q-10 60 0 10 Z M0 6 Q46 50 30 60 Q10 60 0 10 Z" fill="${c}" stroke="${INK}" stroke-width="5" opacity=".9"/><circle cx="-36" cy="-24" r="8" fill="#fff" opacity=".7"/><circle cx="36" cy="-24" r="8" fill="#fff" opacity=".7"/></g><ellipse rx="6" ry="26" cy="10" fill="${INK}"/><path d="M-3 -14 Q-14 -36 -20 -40 M3 -14 Q14 -36 20 -40" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>`;
}
function fishG(x, y, s, rot, c = '#F2A33A') { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><path d="M-60 0 Q-20 -40 40 -6 L70 -30 L64 0 L70 30 L40 6 Q-20 40 -60 0 Z" fill="${c}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle cx="-36" cy="-6" r="5" fill="${INK}"/></g>`; }
function gourdG(x, y, s, rot = 0, o = {}) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000})">`;
  h += `<path d="M0 -150 Q-50 -150 -46 -90 Q-44 -50 -80 -20 Q-140 30 -120 100 Q-90 170 0 172 Q90 170 120 100 Q140 30 80 -20 Q44 -50 46 -90 Q50 -150 0 -150 Z" fill="${o.c || '#D9B44A'}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  h += `<path d="M-60 40 Q-70 100 -30 140" fill="none" stroke="#fff" stroke-width="10" opacity=".35" stroke-linecap="round"/><path d="M0 -150 Q6 -180 24 -190" fill="none" stroke="#6B8A3A" stroke-width="10" stroke-linecap="round"/>`;
  if (o.crack) h += `<path d="M-100 30 L-40 60 L-60 100 L10 120 L-10 160" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="${f1(Math.min(1, o.crack) * 100) / 100}"/>`;
  return h + `</g>`;
}
function water(t, y, c1 = '#7DB7E0', c2 = '#5E9CCB') {
  let d = `M-600 1480 L-600 ${y}`; for (let x = -600; x <= 2520; x += 40) d += ` L${x} ${f1(y + Math.sin(x / 120 + t * 1.6) * 10)}`;
  let h = `<path d="${d} L2520 1480 Z" fill="${c1}" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 10; i++) { const x = ((i * 233 + t * 60) % 2200) - 140, yy = y + 60 + (i % 3) * 70; h += `<path d="M${f1(x)} ${yy} q30 -14 60 0 t60 0" fill="none" stroke="#fff" stroke-width="5" opacity=".5" stroke-linecap="round"/>`; }
  return h + `<rect x="-600" y="${y + 200}" width="3120" height="600" fill="${c2}" opacity=".35"/>`;
}
function inkDefs() { return `<linearGradient id="inkSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EDE6D3"/><stop offset="1" stop-color="#F7F2E6"/></linearGradient><linearGradient id="dusk9" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7D86C8"/><stop offset=".6" stop-color="#F2B38A"/><stop offset="1" stop-color="#FCE3B8"/></linearGradient><linearGradient id="dream9" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B2C5E"/><stop offset="1" stop-color="#6E5C9C"/></linearGradient>`; }

/* ---------- hook ---------- */
function hookScene(t, lt, a) {
  const D = D_(a);
  let h = livingRoom(t, false) + `<defs>${inkDefs()}</defs>`;
  h += sofa(560, 700);
  const guilt = lt > 0.5 * D;
  h += Z({ t, seed: 900, x: 870, y: 930, s: 0.78, pose: '폰보기', ex: exprAt([[0, '기본'], [0.3 * D, '걱정'], [0.75 * D, '지침']], lt), look: [0, 0.9], sweat: guilt });
  const [px, py] = handG(870, 930, 0.78, [200, 318]);
  h += phone(px, py - 6, 0.4, { on: 1 }) + hand(px - 22, py + 8, 0.78) + hand(px + 22, py + 8, 0.78);
  const S = [[0.02, 420, 220, '그거 해서 뭐 해?', '#fff', -4], [0.18, 1480, 210, '그게 무슨 쓸모가 있어?', '#fff', 3], [0.42, 1460, 470, '주말에도 자기계발!', YEL, -2], [0.55, 380, 470, '갓생 루틴 30가지', PINK, 3]];
  S.forEach(([f, x, y, txt, c, r], i) => { if (lt > f * D) h += pop(t, t - lt + f * D, t + 99, x, y, i < 2 ? `<path d="M-300 -80 L300 -80 Q330 -80 330 -50 L330 50 Q330 80 300 80 L${i ? -40 : 60} 80 L${i ? -90 : 110} 140 L${i ? -80 : 100} 80 L-300 80 Q-330 80 -330 50 L-330 -50 Q-330 -80 -300 -80 Z" fill="#fff" stroke="${INK}" stroke-width="7"/>${T8(0, 14, txt, { size: 44 })}` : label(0, 0, txt, { size: 40, bg: c, color: c === PINK ? '#fff' : NAVY }), { rot: r, bob: 4 }); });
  if (lt > 0.78 * D) h += pop(t, t - lt + 0.78 * D, t + 99, 960, 110, outlined(0, 0, [[['쉬는 날에도 ', '#fff'], ['쓸모 있어야 할까?', YEL]]], { size: 72, sw: 14 }), {});
  return h;
}

/* ---------- Zhuangzi intro ---------- */
function zhScene(t, lt, a) {
  const D = D_(a);
  let h = `<defs>${inkDefs()}</defs>`;
  if (a.k === 1) { // lacquer-tree garden official
    h += inkBg(t, { sx: 1600, sy: 200 });
    for (let i = 0; i < 6; i++) { const x = 120 + i * 300, y = 880 + (i % 2) * 20; h += `<g transform="translate(${x} ${y}) scale(.8)"><rect x="-14" y="-240" width="28" height="240" fill="#6A4529" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="-280" rx="120" ry="90" fill="#6E9A54" stroke="${INK}" stroke-width="6"/><path d="M14 -120 L40 -110 L40 -80 L14 -86" fill="#3A2A1E" stroke="${INK}" stroke-width="4"/><rect x="30" y="-90" width="34" height="40" rx="6" fill="#B57D48" stroke="${INK}" stroke-width="4"/></g>`; }
    h += ZH({ t, seed: 901, x: 960, y: 1000, s: 0.8, pose: '손인사', ex: exprAt([[0, '뿌듯']], t), look: [0.4, -0.2] });
    const [bx, by] = handG(960, 1000, 0.8, P['손인사'].hR);
    h += `<g transform="translate(${f1(bx + 70)} ${f1(by - 40)}) rotate(14)">${[0, 1, 2, 3, 4].map(i => `<rect x="${-50 + i * 20}" y="-60" width="18" height="120" rx="4" fill="#E2C98E" stroke="${INK}" stroke-width="4"/>`).join('')}</g>`;
    h += pop(t, t - lt + 0.25 * D, t + 99, 960, 160, label(0, 0, '옻나무 밭 관리인 · 칠원리(漆園吏)', { size: 40, bg: YEL }), {});
    h += pop(t, t - lt + 0.1 * D, t + 99, 1560, 340, label(0, 0, '송나라 몽', { size: 36, bg: '#fff' }), { rot: 3 });
    return h;
  }
  if (a.k === 2) { // butterflies and happy fish
    h += inkBg(t, { sx: 1560, sy: 210, ground: false });
    h += water(t, 800, '#9CC9DE', '#7DB0CC');
    h += ZH({ t, seed: 902, x: 760, y: 900, s: 0.82, ex: exprAt([[0, '신남']], t), look: [0.5, -0.4] });
    h += fanG(...handG(760, 900, 0.82, P['서기'].hR), 0.6, -20 + Math.sin(t * 3) * 10);
    for (let i = 0; i < 3; i++) { const k = (t * 0.12 + i / 3) % 1; h += butterfly(1100 + Math.sin(k * 6.28 + i) * 260, 260 + i * 110 + Math.sin(t * 2 + i) * 30, 0.7, t + i, ['#F2A33A', '#7CC7FF', '#FF8FB1'][i]); }
    const jk = (lt * 0.6) % 1; if (lt > 0.35 * D) h += fishG(1350 + jk * 200, 840 - Math.sin(jk * Math.PI) * 180, 1.0, -40 + jk * 80);
    if (lt > 0.15 * D) h += pop(t, t - lt + 0.15 * D, t + 99, 1420, 150, label(0, 0, '나비 꿈', { size: 42, bg: YEL }), { rot: -3 });
    if (lt > 0.4 * D) h += pop(t, t - lt + 0.4 * D, t + 99, 1500, 640, label(0, 0, '물고기의 즐거움', { size: 40, bg: MINT }), { rot: 3 });
    return h;
  }
  h += inkBg(t, { sx: 330, sy: 190 });
  h += pine(260, 900, 1.1) + pine(1720, 920, 0.9);
  h += pop(t, t - lt + 0.15, t + 99, 760, 1000, `<path d="M-200 -40 Q-160 -110 0 -110 Q170 -110 210 -30 L220 0 L-210 0 Z" fill="#8A8F86" stroke="${INK}" stroke-width="7"/>` + ZH({ t, seed: 903, x: 0, y: -90, s: 0.86, ex: exprAt([[0, '뿌듯']], t), look: [0.4, -0.2] }) + fanG(...handG(0, -90, 0.86, P['서기'].hR), 0.65, -10 + Math.sin(t * 2) * 8), { noPop: true, inDur: 0.5 });
  h += pop(t, t - lt + 0.2, t + 99, 1380, 260, outlined(0, 0, [[['약 ', '#fff'], ['2,300년 전', YEL]]], { size: 92, sw: 18 }), {});
  if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 1380, 430, label(0, 0, '장자 (莊子)', { size: 54, bg: YEL }), {});
  if (lt > 0.7 * D) h += pop(t, t - lt + 0.7 * D, t + 99, 1380, 530, label(0, 0, '기원전 4세기 · 중국 전국시대', { size: 32, bg: '#fff' }), {});
  return h;
}

/* ---------- title (topknot + robe fly in) ---------- */
const LIST9 = ['① 쓸모없는 나무', '② 다르게 쓰기', '③ 가만히 앉기', '④ 힘 빼고 결 따라', '⑤ 진흙 속 거북'];
function knotG(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000}) translate(-200 -100)"><ellipse cx="200" cy="48" rx="32" ry="27" fill="#2B2B2B" stroke="${INK}" stroke-width="6"/><line x1="156" y1="40" x2="246" y2="54" stroke="#C9A04A" stroke-width="7" stroke-linecap="round"/><path d="M86 156 Q82 70 200 64 Q318 70 314 156 Q300 112 258 100 Q200 90 142 100 Q100 112 86 156 Z" fill="#2B2B2B" stroke="${INK}" stroke-width="6"/></g>`; }
function robeG(x, y, s, rot = 0) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000}) translate(-200 -380)"><path d="M142 262 Q200 248 258 262 L270 400 L290 484 Q200 498 110 484 L130 400 Z" fill="${TEE}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M152 262 L238 372" stroke="#8A4A20" stroke-width="14" stroke-linecap="round"/><rect x="134" y="366" width="132" height="24" rx="6" fill="#8A4A20" stroke="${INK}" stroke-width="5"/></g>`; }
function titleScene(t, lt, a) {
  let h = BG('url(#labG)') + BG('url(#grid)');
  h += particles(t, 5, 40, [0, 0, 1920, 1080], MINT, { speed: 40, r: 4, op: 0.6 });
  h += `<ellipse cx="960" cy="900" rx="320" ry="70" fill="url(#glow)"/><ellipse cx="960" cy="900" rx="260" ry="54" fill="#2E4260" stroke="${INK}" stroke-width="8"/>`;
  h += doctor(520, 960, 0.55, { t, expr: '미소', talk: env(t) });
  if (a.list) {
    h += outlined(960, 130, ['만약에, 장자처럼 쓸모없음을 즐긴다면?'], { size: 58, sw: 12, fill: YEL });
    const fs = 36; const rows = [LIST9.slice(0, 3), LIST9.slice(3)];
    let n = 0;
    rows.forEach((row, r) => {
      const ws = row.map(s => s.length * fs * 0.92 + 48), gap = 30, tot = ws.reduce((p, c) => p + c, 0) + gap * (row.length - 1);
      let x = 960 - tot / 2;
      row.forEach((it, i) => { h += pop(t, t - lt + 0.2 + n * 0.4, t + 99, f1(x + ws[i] / 2), 260 + r * 92, label(0, 0, it, { size: fs, bg: n === 4 ? YEL : MINT }), {}); x += ws[i] + gap; n++; });
    });
    h += Z({ t, seed: 7, x: 960, y: 890, s: 0.6, pose: walkPose(t * 5, 0.5), ex: exprAt([[0, '신남']], t) });
    return h;
  }
  h += pop(t, t - lt + 0.2, t + 99, 960, 230, outlined(0, 0, [[['만약에, ', YEL], ['장자처럼', '#fff']], '쓸모없음을 즐긴다면?'], { size: 92, sw: 18 }), {});
  const land = 1.55, on = lt >= land, fly = easeInOut(prog(lt, 0.8, land));
  h += Z({ t, seed: 7, x: 960, y: 890, s: 0.6, pose: on ? '만세' : '서기', ex: exprAt([[0, '기본'], [land, '놀람'], [land + 0.7, '신남']], lt), topknot: on ? '#2B2B2B' : false, robe: on ? '#8A4A20' : false });
  if (!on && lt > 0.8) {
    h += knotG(lerp(1500, 960, fly), lerp(300, 594, fly) - Math.sin(fly * Math.PI) * 120, lerp(0.9, 0.6, fly));
    h += robeG(lerp(420, 963, fly), lerp(380, 776, fly) - Math.sin(fly * Math.PI) * 100, lerp(0.9, 0.6, fly), lerp(-200, 0, fly));
  }
  if (lt > land && lt < land + 0.5) { const k = prog(lt, land, land + 0.5); h += `<circle cx="960" cy="700" r="${f1(40 + 140 * k)}" fill="none" stroke="${YEL}" stroke-width="8" opacity="${f1((1 - k) * 100) / 100}"/>`; }
  if (lt > land) h += pop(t, t - lt + land + 0.1, t + 99, 1240, 600, label(0, 0, '상투 + 도포 장착!', { size: 36, bg: YEL }), { rot: 5, bob: 4 });
  return h;
}

/* ---------- myth ---------- */
function rulerG(x, y, s, rot) { let h = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><rect x="-260" y="-36" width="520" height="72" rx="10" fill="#F2D27A" stroke="${INK}" stroke-width="7"/>`; for (let i = 1; i < 26; i++) h += `<line x1="${-260 + i * 20}" y1="-36" x2="${-260 + i * 20}" y2="${i % 5 ? -16 : 0}" stroke="${INK}" stroke-width="3"/>`; return h + T8(0, 26, '쓸모', { size: 30 }) + `</g>`; }
function mythScene(t, lt, a) {
  const D = D_(a);
  let h = `<defs>${inkDefs()}</defs>`;
  if (a.k) {
    h += inkBg(t, { sx: 260, sy: 170 });
    const down = easeInOut(prog(lt, 0.05 * D, 0.35 * D)), bloom = prog(lt, 0.3 * D, 0.7 * D);
    for (let i = 0; i < 12; i++) { const k = clamp(bloom * 1.6 - hash(i) * 0.6, 0, 1); if (k <= 0) continue; const x = 160 + i * 140 + hash(i * 3) * 40, y = 900 + hash(i * 5) * 40; h += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(easeOutBack(k) * 100) / 100})"><line x1="0" y1="0" x2="0" y2="-60" stroke="#4E9A3E" stroke-width="6"/>${[0, 72, 144, 216, 288].map(r => `<ellipse cx="0" cy="-74" rx="12" ry="22" transform="rotate(${r} 0 -60)" fill="${['#FF8FB1', '#FFD25A', '#B9A7FF', '#fff'][i % 4]}" stroke="${INK}" stroke-width="3"/>`).join('')}<circle cx="0" cy="-60" r="9" fill="${YEL}" stroke="${INK}" stroke-width="3"/></g>`; }
    if (bloom > 0.3) h += butterfly(1300 + Math.sin(t) * 120, 520 + Math.sin(t * 1.7) * 40, 0.6, t);
    h += Z({ t, seed: 910, x: 420, y: 1000, s: 0.72, pose: down > 0.9 ? '서기' : '손인사', ex: exprAt([[0, '결심'], [0.35 * D, '놀람'], [0.5 * D, '신남']], lt), look: [0.6, -0.1] });
    h += rulerG(lerp(560, 640, down), lerp(560, 900, down), 0.7, lerp(-20, 0, down));
    h += quote(1080, 230, ['“모두 쓸모 있음의 쓸모는 알지만,', '쓸모없음의 쓸모는 모른다”'], '— 『장자』 인간세', t, lt, 0.55 * D, { size: 52, srcDy: 140 });
    return h;
  }
  h += BG(INKP) + BG('url(#paper)');
  h += panel(200, 220, 680, 560, { fill: '#EDE6D3' }) + panel(1040, 220, 680, 560, { fill: '#E3F0DA' });
  h += sofa(240, 520);
  h += Z({ t, seed: 911, x: 540, y: 760, s: 0.55, pose: '폰보기', ex: exprAt([[0, '지침']], t), look: [0, 0.9], topknot: false, robe: false }) + phone(...handG(540, 760, 0.55, [200, 318]), 0.28, { on: 1 });
  h += T8(540, 300, '할 일 미루며 늘어지기', { size: 36 });
  h += gnarled(1380, 760, 0.42, t) + Z({ t, seed: 912, x: 1240, y: 760, s: 0.5, ex: exprAt([[0, '신남']], t), look: [0.4, -0.8] });
  h += T8(1380, 300, '잠시 쓸모를 내려놓기', { size: 36 });
  if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 960, 500, outlined(0, 0, [['≠']], { size: 180, sw: 22, fill: YEL }), {});
  h += pop(t, t - lt + 0.1, t + 99, 960, 130, outlined(0, 0, [[['쓸모없음', YEL], [' ≠ ', '#fff'], ['게으름', '#fff']]], { size: 76, sw: 15 }), {});
  return h;
}

/* ---------- 1 · lie under the useless tree ---------- */
function carpenter(t, x, y, s, lt) { return char({ t, seed: 920, x, y, s, goggles: 'none', vest: '#B88A5A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', topknot: '#3A2A1E', robe: '#6A4529', pose: walkPose(t * 7, 0.6), ex: exprAt([[0, '결심']], t), look: [0.8, 0] }) + `<g transform="translate(${f1(x + 60 * s)} ${f1(y - 240 * s)}) rotate(20) scale(${s})"><path d="M0 0 L140 0 L140 40 L0 50 Z" fill="#C9D2DC" stroke="${INK}" stroke-width="5"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${10 + i * 22} 46 l10 12 l10 -12" fill="none" stroke="${INK}" stroke-width="3"/>`).join('')}<rect x="-50" y="-6" width="56" height="40" rx="10" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/></g>`; }
function axeG(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(-30) scale(${s})"><rect x="-8" y="-90" width="16" height="180" rx="6" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/><path d="M-6 -90 L-70 -110 Q-90 -60 -70 -20 L-6 -40 Z" fill="#9AA3AE" stroke="${INK}" stroke-width="6"/></g>`; }
function treeScene(t, lt, a) {
  const D = D_(a);
  let h = `<defs>${inkDefs()}</defs>`;
  if (a.k) {
    h += inkBg(t, { y1: 560, y2: 680, gy: 780, gc: '#B7C98F', sx: 1650, sy: 190 });
    h += gnarled(1060, 800, 0.95, t);
    h += Z({ t, seed: 921, x: 960, y: 780, s: 0.6, rot: -88, ex: { expr: '잠', prev: '잠', k: 1, blink: 0 }, noBlink: true });
    for (let i = 0; i < 3; i++) { const k = ((t * 0.4 + i / 3) % 1); h += T8(1010 + k * 90, 570 - k * 140, 'z', { size: 34 + i * 10, fill: '#5A6B8C', op: f1(Math.sin(k * Math.PI) * 100) / 100 }); }
    h += ZH({ t, seed: 922, x: 1420, y: 860, s: 0.62, ex: exprAt([[0, '뿌듯']], t), look: [-0.6, -0.2] }) + fanG(...handG(1420, 860, 0.62, P['서기'].hL), 0.5, 20 + Math.sin(t * 4) * 14);
    if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 420, 420, axeG(0, 0, 1) + xMark(0, 0, 0.9), {}) + pop(t, t - lt + 0.66 * D, t + 99, 420, 570, label(0, 0, '도끼 걱정 없음', { size: 36, bg: YEL }), {});
    h += pop(t, t - lt + 0.2, t + 99, 520, 140, label(0, 0, '넓은 들판에 심어 두고, 그 아래 눕기', { size: 38, bg: '#fff' }), { rot: -2 });
    return h;
  }
  h += inkBg(t, { sx: 1600, sy: 200 });
  h += gnarled(1060, 900, 1.0, t);
  h += HZ({ t, seed: 923, x: 470, y: 1000, s: 0.78, pose: '손인사', ex: exprAt([[0, '걱정'], [0.4 * D, '지침']], lt), look: [0.7, -0.3] });
  h += pop(t, t - lt + 0.05, t + 99, 470, 260, label(0, 0, '혜자 · 장자의 친구', { size: 36, bg: '#9DB8D9' }), {});
  if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 1050, 230, label(0, 0, '줄기는 울퉁불퉁, 가지는 비틀비틀', { size: 36, bg: YEL }), { rot: 2 });
  if (lt > 0.6 * D) { const cx = lerp(1300, 1900, prog(lt, 0.6 * D, D)); h += carpenter(t, cx, 1000, 0.6, lt) + pop(t, t - lt + 0.66 * D, t + 99, 1560, 560, bubble(0, 0, 300, 110, T8(12, 14, '쓸 데가 없군', { size: 36 })), {}); }
  return h;
}
function leisureScene(t, lt, a) {
  const D = D_(a);
  if (a.res) {
    let h = BG(NAVY) + BG('url(#grid)');
    h += pop(t, t - lt + 0.1, t + 99, 900, 150, outlined(0, 0, [[['쉼 = 시간 낭비', YEL], ['라고 믿을수록', '#fff']]], { size: 66, sw: 13 }), {});
    const R = [['여가의 즐거움', '↓', PINK], ['행복감', '↓', PINK], ['우울 · 불안 · 스트레스', '↑', '#B9A7FF']];
    R.forEach(([nm, ar, c], i) => { const at = 0.12 * D + i * 0.22 * D; if (lt > at) h += pop(t, t - lt + at, t + 99, 960, 330 + i * 170, `<rect x="-520" y="-62" width="1040" height="124" rx="62" fill="#1B2A44" stroke="${MINT}" stroke-width="4"/>${T8(-460, 18, nm, { anchor: 'start', size: 50, fill: '#fff' })}<circle cx="400" cy="0" r="48" fill="${c}" stroke="${INK}" stroke-width="6"/>${T8(400, 22, ar, { size: 64, fill: NAVY })}`, { noPop: true, inDur: 0.3 }); });
    h += pop(t, t - lt + 0.3, t + 99, 960, 790, label(0, 0, 'Tonietto et al., JESP (2021)', { size: 24, bg: '#fff' }), {});
    return h;
  }
  let h = livingRoom(t, false);
  if (a.cat) {
    h += `<rect x="660" y="180" width="600" height="380" rx="20" fill="#1F2D44" stroke="${INK}" stroke-width="9"/><rect x="684" y="204" width="552" height="332" rx="10" fill="#FFF1D6"/>`;
    const by = Math.abs(Math.sin(t * 5)) * 60;
    h += `<g transform="translate(960 ${f1(470 - by)})"><ellipse rx="80" ry="54" fill="#F2A33A" stroke="${INK}" stroke-width="6"/><circle cx="60" cy="-50" r="44" fill="#F2A33A" stroke="${INK}" stroke-width="6"/><path d="M30 -84 L40 -120 L62 -90 Z M74 -88 L96 -118 L100 -80 Z" fill="#F2A33A" stroke="${INK}" stroke-width="5"/><circle cx="50" cy="-54" r="5" fill="${INK}"/><circle cx="76" cy="-54" r="5" fill="${INK}"/><path d="M-80 0 Q-130 -30 -120 -80" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/></g>`;
    h += Z({ t, seed: 930, x: 560, y: 1000, s: 0.7, ex: exprAt([[0, '신남']], t), look: [0.6, -0.5], topknot: false, robe: false });
    h += pop(t, t - lt + 0.2, t + 99, 560, 360, outlined(0, 0, ['ㅋㅋㅋ'], { size: 60, sw: 12, fill: YEL }), { rot: -6, bob: 6 });
    h += char({ t, seed: 931, x: 1400, y: 1000, s: 0.7, goggles: 'none', vest: '#7CC7FF', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', hair: '#3A2A1E', ex: exprAt([[0, '결심']], t), look: [-0.6, -0.5] });
    h += pop(t, t - lt + 0.35 * D, t + 99, 1550, 380, bubble(0, 0, 360, 120, T8(16, 14, '이거 볼 시간에…', { size: 36 })), {});
    return h;
  }
  h += sofa(620, 700);
  h += Z({ t, seed: 932, x: 930, y: 930, s: 0.78, pose: '턱괴기', ex: exprAt([[0, '기본'], [0.3 * D, '걱정']], lt), look: [0.4, -0.6], topknot: false, robe: false });
  h += pop(t, t - lt + 0.2, t + 99, 330, 260, wallClock(0, 0, 80, 3, (lt * 40) % 60), {});
  if (lt > 0.3 * D) h += pop(t, t - lt + 0.3 * D, t + 99, 1380, 300, bubble(0, 0, 520, 150, T8(16, 16, '이렇게 쉬는 건 시간 낭비야…', { size: 38 })), { bob: 4 });
  return h;
}

/* ---------- 2 · use the big gourd differently ---------- */
function kingG(t, x, y, s) { return char({ t, seed: 940, x, y, s, goggles: 'none', vest: '#C9A04A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', topknot: '#2B2B2B', robe: '#7A3E8E', beard: '#2B2B2B', ex: exprAt([[0, '뿌듯']], t), look: [0.6, -0.2] }) + `<g transform="translate(${f1(x)} ${f1(y - 610 * s)}) scale(${s})"><rect x="-90" y="-20" width="180" height="40" rx="6" fill="#2B2B2B" stroke="${INK}" stroke-width="5"/>${[-60, -30, 0, 30, 60].map(dx => `<line x1="${dx}" y1="20" x2="${dx}" y2="60" stroke="${YEL}" stroke-width="6"/>`).join('')}</g>`; }
function gourdScene(t, lt, a) {
  const D = D_(a);
  let h = `<defs>${inkDefs()}</defs>`;
  if (a.boat) {
    h += inkBg(t, { ground: false, sx: 1600, sy: 210 });
    h += water(t, 700);
    const bob = Math.sin(t * 1.6) * 10, x = 900 + Math.sin(t * 0.4) * 60;
    h += `<g transform="translate(${f1(x)} ${f1(700 + bob)}) rotate(${f1(Math.sin(t * 1.2) * 3)})">`;
    h += gourdG(-150, -10, 0.75, 90) + gourdG(150, -10, 0.75, 90) + `<rect x="-300" y="-56" width="600" height="26" rx="10" fill="${WALNUT}" stroke="${INK}" stroke-width="6"/><path d="M-200 -40 L-200 10 M0 -40 L0 10 M200 -40 L200 10" stroke="#C9A04A" stroke-width="8"/>`;
    h += ZH({ t, seed: 941, x: -110, y: -50, s: 0.5, ex: exprAt([[0, '신남']], t), look: [0.4, -0.3] }) + Z({ t, seed: 942, x: 120, y: -50, s: 0.5, pose: '만세', ex: exprAt([[0, '신남']], t), look: [-0.3, -0.3] }) + `</g>`;
    h += water(t + 3, 820, '#7DB7E0', '#5E9CCB').replace(/stroke="#141414" stroke-width="6"/, 'stroke="none"').replace(/fill="#7DB7E0"/, 'fill="#7DB7E0" opacity=".55"');
    if (lt > 0.3 * D) h += pop(t, t - lt + 0.3 * D, t + 99, 960, 160, outlined(0, 0, [[['큰 박 = ', '#fff'], ['커다란 배!', YEL]]], { size: 80, sw: 15 }), {});
    return h;
  }
  h += inkBg(t, { sx: 1650, sy: 180 });
  if (a.smash) {
    const crack = prog(lt, 0.55 * D, 0.75 * D), broken = lt > 0.78 * D;
    if (!broken) {
      h += gourdG(1080, 680, 1.2, 0, { crack });
      if (lt < 0.5 * D) for (let i = 0; i < 5; i++) { const k = (t * 1.5 + i / 5) % 1; h += `<path d="M${1000 + i * 40} ${720 + k * 160} q6 14 0 22 q-6 -8 0 -22 Z" fill="#7DB7E0" stroke="${INK}" stroke-width="3"/>`; }
    } else {
      for (let i = 0; i < 5; i++) { const k = easeOut(prog(lt, 0.78 * D, 0.95 * D)); h += `<path d="M0 -60 Q50 -40 60 20 L0 40 Z" transform="translate(${f1(1080 + (i - 2) * 80 * (1 + k))} ${f1(780 + k * 60 + (i % 2) * 30)}) rotate(${f1((i - 2) * 50 * k)})" fill="#D9B44A" stroke="${INK}" stroke-width="6"/>`; }
    }
    h += pop(t, t - lt + 0.1 * D, t + 99, 1500, 300, label(0, 0, '물 담기엔 너무 약하고', { size: 36, bg: '#fff' }), { rot: 2 });
    if (lt > 0.3 * D) h += pop(t, t - lt + 0.3 * D, t + 99, 1500, 400, label(0, 0, '바가지로 쓰기엔 너무 크고', { size: 36, bg: '#fff' }), { rot: -2 });
    h += HZ({ t, seed: 943, x: 560, y: 1000, s: 0.78, pose: broken ? '만세' : '서기', ex: exprAt([[0, '걱정'], [0.55 * D, '화남']], lt), look: [0.7, -0.2] });
    if (broken) h += pop(t, t - lt + 0.8 * D, t + 99, 560, 300, outlined(0, 0, ['쓸모없어!'], { size: 64, sw: 12, fill: YEL }), { rot: -5 });
    return h;
  }
  const grow = easeOutBack(prog(lt, 0.4 * D, 0.8 * D));
  h += kingG(t, 360, 1000, 0.66) + pop(t, t - lt + 0.05, t + 99, 360, 250, label(0, 0, '위나라 왕', { size: 34, bg: '#fff' }), {});
  h += HZ({ t, seed: 944, x: 760, y: 1000, s: 0.72, pose: '손인사', ex: exprAt([[0, '뿌듯'], [0.6 * D, '놀람']], lt), look: [0.7, -0.3] });
  if (lt < 0.4 * D) h += pop(t, t - lt + 0.1 * D, t + 99, 600, 720, `<g>${[0, 1, 2].map(i => `<ellipse cx="${i * 22}" cy="${(i % 2) * 8}" rx="9" ry="14" fill="#F4E9D0" stroke="${INK}" stroke-width="3"/>`).join('')}</g>`, {});
  if (grow > 0.01) h += gourdG(1300, 880 - 172 * grow, Math.max(0.05, 1.3 * grow));
  if (lt > 0.8 * D) h += pop(t, t - lt + 0.8 * D, t + 99, 1340, 220, label(0, 0, '다섯 섬(五石)이 들어가는 크기!', { size: 38, bg: YEL }), { rot: 3 });
  return h;
}
function candleScene(t, lt, a) {
  const D = D_(a);
  let h = BG('#EDE3D0') + BG('url(#paper)');
  if (a.empty) {
    h += panel(160, 200, 760, 500, { fill: '#fff' }) + panel(1000, 200, 760, 500, { fill: '#fff' });
    const box = (x, y, full) => `<g transform="translate(${x} ${y})"><rect x="-90" y="-50" width="180" height="100" rx="8" fill="#E8C27A" stroke="${INK}" stroke-width="6"/>${full ? [...Array(12)].map((_, i) => `<circle cx="${-70 + (i % 6) * 28}" cy="${-30 - Math.floor(i / 6) * 14}" r="9" fill="#C9D2DC" stroke="${INK}" stroke-width="3"/>`).join('') : ''}</g>`;
    h += box(540, 380, true) + T8(540, 300, '압정이 담긴 상자', { size: 38 });
    h += box(1300, 380, false) + `<g transform="translate(1540 380)">${[...Array(10)].map((_, i) => `<circle cx="${(i % 5) * 26}" cy="${Math.floor(i / 5) * 26}" r="9" fill="#C9D2DC" stroke="${INK}" stroke-width="3"/>`).join('')}</g>` + T8(1380, 300, '빈 상자 + 압정 따로', { size: 38 });
    const k = easeOut(prog(lt, 0.15 * D, 0.5 * D));
    h += hbar(320, 560, 440, 50, 0.32 * k, PINK, '') + T8(540, 650, '푼 사람 · 적고 느림', { size: 34 });
    h += hbar(1160, 560, 440, 50, 0.85 * k, MINT, '') + T8(1380, 650, '푼 사람 · 많고 빠름', { size: 34 });
    if (lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 960, 790, label(0, 0, '쓸모라는 이름표가, 다른 쓸모를 가린다 · 기능적 고착', { size: 38, bg: YEL }), {});
    return h;
  }
  h += `<rect x="1000" y="80" width="900" height="760" fill="#D9CDB4" stroke="${INK}" stroke-width="7"/>` + `<rect x="-600" y="760" width="1700" height="40" rx="8" fill="${WALNUT}" stroke="${INK}" stroke-width="7"/>`;
  const done = a.ans ? easeInOut(prog(lt, 0.15 * D, 0.45 * D)) : 0;
  // tacks spill out of the box when solving
  if (!a.ans) h += `<g transform="translate(600 700)"><rect x="-90" y="-50" width="180" height="100" rx="8" fill="#E8C27A" stroke="${INK}" stroke-width="6"/>${[...Array(12)].map((_, i) => `<circle cx="${-70 + (i % 6) * 28}" cy="${-30 - Math.floor(i / 6) * 14}" r="9" fill="#C9D2DC" stroke="${INK}" stroke-width="3"/>`).join('')}</g>`;
  else {
    for (let i = 0; i < 12; i++) h += `<circle cx="${480 + (i % 6) * 34 + hash(i) * 20}" cy="${740 - (i % 2) * 8}" r="9" fill="#C9D2DC" stroke="${INK}" stroke-width="3"/>`;
    const bx = lerp(600, 1200, done), by = lerp(700, 470, done);
    h += `<rect x="${f1(bx - 90)}" y="${f1(by - 50)}" width="180" height="100" rx="8" fill="#E8C27A" stroke="${INK}" stroke-width="6"/>`;
    if (done >= 1) h += `<circle cx="1140" cy="490" r="10" fill="#C9D2DC" stroke="${INK}" stroke-width="3"/><circle cx="1260" cy="490" r="10" fill="#C9D2DC" stroke="${INK}" stroke-width="3"/>`;
  }
  const cx = a.ans ? lerp(860, 1200, easeInOut(prog(lt, 0.4 * D, 0.6 * D))) : 860, cy = a.ans ? lerp(760, 420, easeInOut(prog(lt, 0.4 * D, 0.6 * D))) : 760;
  h += `<rect x="${f1(cx - 22)}" y="${f1(cy - 130)}" width="44" height="130" rx="8" fill="#FFF3D6" stroke="${INK}" stroke-width="5"/>`;
  if (a.ans && lt > 0.62 * D) { const fl = 1 + Math.sin(t * 13) * 0.08; h += `<circle cx="${f1(cx)}" cy="${f1(cy - 170)}" r="${f1(160 * fl)}" fill="url(#amber)"/><path d="M${f1(cx)} ${f1(cy - 196 * fl)} Q${f1(cx + 16)} ${f1(cy - 160)} ${f1(cx)} ${f1(cy - 136)} Q${f1(cx - 16)} ${f1(cy - 160)} ${f1(cx)} ${f1(cy - 196 * fl)} Z" fill="#FFB547" stroke="${INK}" stroke-width="4"/>`; }
  h += `<g transform="translate(300 730) rotate(-8)"><rect x="-60" y="-30" width="120" height="60" rx="6" fill="${RED}" stroke="${INK}" stroke-width="5"/>${T8(0, 12, '성냥', { size: 28, fill: '#fff' })}</g>`;
  if (!a.ans) {
    h += pop(t, t - lt + 0.3 * D, t + 99, 1450, 300, outlined(0, 0, ['초를 벽에', '붙여 보세요!'], { size: 64, sw: 12, fill: YEL }), { rot: 3 });
    h += pop(t, t - lt + 0.15 * D, t + 99, 600, 590, label(0, 0, '압정 한 상자', { size: 30, bg: '#fff' }), {});
  } else if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 1450, 200, label(0, 0, '상자 = 받침대!', { size: 44, bg: MINT }), { rot: -3 });
  h += Z({ t, seed: 950, x: 1700, y: 1000, s: 0.55, pose: '턱괴기', ex: exprAt([[0, '결심'], [a.ans ? 0.62 * D : 99, '신남']], lt), look: [-0.8, -0.4] });
  return h;
}

/* ---------- 3 · just sit ---------- */
function sitScene(t, lt, a) {
  const D = D_(a);
  let h = `<defs>${inkDefs()}</defs>` + inkBg(t, { sx: 1500, sy: 230, sr: 70 });
  h += pine(1500, 900, 1.0);
  for (let i = 0; i < 6; i++) { const k = (t * 0.08 + i / 6) % 1; h += `<path d="M${f1(-200 + k * 2400)} ${300 + i * 60} q60 -20 120 0 t120 0" fill="none" stroke="#fff" stroke-width="6" opacity=".55" stroke-linecap="round"/>`; }
  h += `<ellipse cx="900" cy="820" rx="260" ry="40" fill="#8A8F86" stroke="${INK}" stroke-width="7"/>`;
  h += Z({ t, seed: 960, x: 900, y: 820, s: 0.82, pose: '좌선', ex: exprAt([[0, '잠']], t), noBlink: true });
  h += pop(t, t - lt + 0.3 * D, t + 99, 900, 170, outlined(0, 0, [[['좌망', YEL], ['(坐忘) · 앉아서 모든 걸 잊다', '#fff']]], { size: 62, sw: 12 }), {});
  h += pop(t, t - lt + 0.15 * D, t + 99, 420, 440, label(0, 0, '안회 · 『장자』 대종사', { size: 32, bg: '#fff' }), { rot: -2 });
  return h;
}
function bigButton(x, y, s, pressed) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-120" y="-20" width="240" height="70" rx="16" fill="#3A3F4E" stroke="${INK}" stroke-width="7"/><ellipse cx="0" cy="${pressed ? -8 : -30}" rx="80" ry="34" fill="${RED}" stroke="${INK}" stroke-width="7"/><ellipse cx="-26" cy="${pressed ? -16 : -40}" rx="22" ry="8" fill="#fff" opacity=".5"/></g>`; }
function zap(x, y, s, t) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * (1 + Math.sin(t * 30) * 0.08) * 100) / 100})"><path d="M10 -70 L-30 6 L0 6 L-14 70 L34 -10 L4 -10 Z" fill="${YEL}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`; }
function shockScene(t, lt, a) {
  const D = D_(a);
  let h = BG('#F2F4F7') + `<path d="M-600 800 L2520 800 L2520 1480 L-600 1480 Z" fill="#DDE2EA"/><line x1="-600" y1="800" x2="2520" y2="800" stroke="${INK}" stroke-width="6"/><rect x="160" y="140" width="1600" height="660" fill="none" stroke="#C3CDD8" stroke-width="6"/>`;
  const secs = a.many ? Math.round(360 - prog(lt, 0, D) * 120) : (a.btn ? Math.round(540 - prog(lt, 0, D) * 180) : Math.round(900 - prog(lt, 0.3 * D, D) * 360));
  h += pop(t, t - lt + 0.1, t + 99, 1560, 280, `<g><rect x="-150" y="-60" width="300" height="120" rx="20" fill="#1F2D44" stroke="${INK}" stroke-width="7"/>${T8(0, 22, `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`, { size: 64, fill: MINT })}</g>`, {});
  h += `<rect x="740" y="640" width="380" height="24" rx="6" fill="#9AA3AE" stroke="${INK}" stroke-width="6"/><rect x="760" y="664" width="18" height="160" fill="#9AA3AE" stroke="${INK}" stroke-width="5"/><rect x="1082" y="664" width="18" height="160" fill="#9AA3AE" stroke="${INK}" stroke-width="5"/>`;
  if (!a.btn && !a.many) {
    h += Z({ t, seed: 970, x: 540, y: 1000, s: 0.8, pose: '서기', ex: exprAt([[0, '기본'], [0.5 * D, '지침']], lt), look: [Math.sin(t * 0.7) * 0.8, -0.3] });
    if (lt > 0.4 * D) h += pop(t, t - lt + 0.4 * D, t + 99, 540, 300, label(0, 0, '혼자 · 아무것도 없이 · 생각만', { size: 36, bg: YEL }), {});
    return h;
  }
  const pressing = a.many ? Math.sin(t * 9) > 0.3 : (lt > 0.5 * D && Math.sin(t * 2) > 0.85);
  h += bigButton(930, 620, 1, pressing);
  if (pressing) h += zap(800, 480, 1, t) + zap(1080, 460, 0.8, t + 1);
  h += Z({ t, seed: 971, x: 620, y: 1000, s: 0.8, pose: a.many ? (pressing ? '서기' : '만세') : '턱괴기', ex: exprAt([[0, a.many ? '겁먹음' : '걱정']], t), look: [0.8, 0.3], shiver: pressing });
  if (a.btn && lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 1400, 560, label(0, 0, '돈을 내서라도 피하고 싶던 충격', { size: 36, bg: PINK, color: '#fff' }), { rot: 2 });
  if (a.many) { const n = Math.min(190, Math.floor(prog(lt, 0.05 * D, 0.5 * D) * 190)); h += pop(t, t - lt + 0.05, t + 99, 1400, 520, `<g><rect x="-200" y="-90" width="400" height="180" rx="24" fill="#fff" stroke="${INK}" stroke-width="8"/>${T8(0, 40, `${n}번`, { size: 100, fill: RED })}</g>`, { rot: -3 }); }
  return h;
}
function brickG(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-140 -30 L-80 -70 L160 -70 L100 -30 Z" fill="#E08A6A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="-140" y="-30" width="240" height="90" fill="#C8623A" stroke="${INK}" stroke-width="6"/><path d="M100 -30 L160 -70 L160 20 L100 60 Z" fill="#A84E2C" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`; }
function incubScene(t, lt, a) {
  const D = D_(a);
  if (a.res) {
    let h = BG(NAVY) + BG('url(#grid)');
    h += pop(t, t - lt + 0.1, t + 99, 960, 130, outlined(0, 0, [[['같은 문제를 다시 풀 때, ', '#fff'], ['아이디어', YEL]]], { size: 62, sw: 12 }), {});
    const k = easeOut(prog(lt, 0.2 * D, 0.7 * D));
    h += vbar(560, 760, 220, 440, 0.12 * k, '#6B7A8C', '', '어려운 일', { bc: '#fff', bs: 34 });
    h += vbar(960, 760, 220, 440, 0.14 * k, '#6B7A8C', '', '그냥 쉬기', { bc: '#fff', bs: 34 });
    h += vbar(1360, 760, 220, 440, 0.82 * k, MINT, k > 0.9 ? '약 +41%' : '', '쉬운 일 + 딴생각', { bc: YEL, bs: 34, tc: YEL });
    h += pop(t, t - lt + 0.3, t + 99, 1380, 230, label(0, 0, 'Baird et al., Psychological Science (2012)', { size: 20, bg: '#fff' }), {});
    return h;
  }
  let h = BG('#EAF2F8') + BG('url(#paper)');
  h += brickG(560, 520, 1.6);
  const U = [['문 받침?', 300, 250], ['책꽂이?', 820, 220], ['화분 받침?', 320, 800], ['망치?', 840, 790]];
  U.forEach(([u, x, y], i) => { const at = 0.12 * D + i * 0.14 * D; if (lt > at && lt < 0.55 * D) h += pop(t, t - lt + at, t - lt + 0.55 * D, x, y, label(0, 0, u, { size: 36, bg: '#fff' }), { rot: (i % 2 ? 4 : -4) }); });
  if (lt > 0.55 * D) {
    h += pop(t, t - lt + 0.55 * D, t + 99, 1340, 470, cloudW(-160, 0, 0.9, { fill: '#fff' }) + cloudW(170, -40, 0.7, { fill: '#fff' }), {});
    h += pop(t, t - lt + 0.55 * D, t + 99, 1340, 260, label(0, 0, '중간 쉬는 시간', { size: 40, bg: YEL }), {});
  }
  h += Z({ t, seed: 980, x: 1340, y: 1000, s: 0.74, pose: lt > 0.55 * D ? '턱괴기' : '서기', ex: exprAt([[0, '결심'], [0.55 * D, '졸림']], lt), look: [lt > 0.55 * D ? 0.6 : -0.7, -0.6] });
  if (lt > 0.6 * D) h += bubble(1600, 520, 260, 110, `${butterfly(10, 4, 0.4, t)}`);
  return h;
}

/* ---------- 4 · Cook Ding ---------- */
const COOK = o => char(Object.assign({ goggles: 'none', vest: '#EFE8DA', patch: false, tee: true, vshade: 'rgba(0,0,0,0.15)', topknot: '#2B2B2B', robe: '#8A6A44' }, o));
function knifeG(x, y, s, rot, o = {}) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><rect x="-80" y="-14" width="80" height="28" rx="8" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/>`;
  let blade = 'M0 -20 L200 -20 Q250 -14 250 20 L0 20 Z';
  if (o.chip) blade = 'M0 -20 L200 -20 Q250 -14 250 20 L210 20 L200 10 L180 20 L120 20 L110 8 L96 20 L40 20 L30 10 L20 20 L0 20 Z';
  h += `<path d="${blade}" fill="${o.dull ? '#A4ACB6' : '#DDE4EC'}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  if (o.shine) { const k = (o.t * 0.8) % 1; h += `<path d="M${f1(20 + k * 200)} -18 l30 0 l-30 36 l-30 0 Z" fill="#fff" opacity=".85"/>${burst(40, YEL, 8).replace('<path', `<path transform="translate(250 -20) scale(${f1((0.6 + Math.sin(o.t * 6) * 0.2) * 100) / 100})"`)}`; }
  return h + `</g>`;
}
function oxChart(x, y, s, k) { // abstract butcher's diagram: outline + joint lines (no gore)
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  h += `<path d="M-300 -60 Q-300 -150 -180 -160 L120 -170 Q200 -230 260 -200 Q330 -170 320 -110 Q330 -60 280 -60 L240 -50 L230 110 L190 110 L180 0 L-160 0 L-180 110 L-220 110 L-230 0 Q-300 -10 -300 -60 Z" fill="#E9DCC4" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  h += `<path d="M260 -200 L290 -240 M220 -190 L230 -240" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><circle cx="270" cy="-140" r="8" fill="${INK}"/>`;
  const L = ['M-160 -160 L-150 0', 'M-40 -165 L-30 0', 'M80 -168 L90 0', 'M-300 -80 L240 -90', 'M180 -170 L190 -50'];
  L.forEach((d, i) => { h += `<path d="${d}" fill="none" stroke="${i / L.length < k ? '#1F9D6B' : '#B89A6E'}" stroke-width="6" stroke-dasharray="14 10"/>`; });
  return h + `</g>`;
}
function cookScene(t, lt, a) {
  const D = D_(a);
  let h = BG('#F1E6D0') + BG('url(#paper)');
  if (a.k === 1 || a.k === 2) {
    const K = [['보통 요리사', '달마다 새 칼', { chip: true, dull: true }, '뼈를 내리쳐서'], ['솜씨 좋은 요리사', '해마다 새 칼', { dull: true }, '살을 베어서'], ['포정', '19년째 새것처럼', { shine: true, t }, '결과 틈을 따라']];
    K.forEach(([who, how, o, why], i) => {
      if (a.k === 1 && i === 2) return;
      const at = a.k === 2 && i < 2 ? -9 : (a.k === 1 ? 0.1 * D + i * 0.4 * D : 0.05 * D);
      if (lt < at) return;
      const x = 380 + i * 580;
      h += pop(t, t - lt + at, t + 99, x, 470, `${panel(-250, -260, 500, 520, { fill: i === 2 ? '#FFF7D6' : '#fff' })}${T8(0, -190, who, { size: 44 })}${knifeG(-90, -40, 0.85, 0, o)}${T8(0, 110, how, { size: 40, fill: i === 2 ? '#1F9D6B' : RED })}${T8(0, 180, why, { size: 32, fill: '#6B6255' })}`, { rot: i === 2 ? 0 : (i ? 2 : -2) });
    });
    if (a.k === 2 && lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, 960, 800, label(0, 0, '억지로 힘주지 않기', { size: 38, bg: YEL }), { rot: -3 });
    return h;
  }
  h += oxChart(1180, 640, 1.2, prog(lt, 0.15 * D, 0.9 * D));
  const k = (lt * 0.35) % 1, seg = Math.floor(lt * 0.35) % 5;
  const P5 = [[-160, -160, -150, 0], [-40, -165, -30, 0], [80, -168, 90, 0], [-300, -80, 240, -90], [180, -170, 190, -50]][seg];
  const kx = 1180 + lerp(P5[0], P5[2], k) * 1.2, ky = 640 + lerp(P5[1], P5[3], k) * 1.2;
  h += knifeG(kx, ky, 0.5, seg === 3 ? 0 : 80, { t, shine: true });
  h += COOK({ t, seed: 990, x: 440, y: 1000, s: 0.82, pose: walkPose(t * 4, 0.4), ex: exprAt([[0, '뿌듯']], t), look: [0.8, -0.2] });
  for (let i = 0; i < 3; i++) { const q = ((t * 0.5 + i / 3) % 1); h += `<text x="${f1(560 + q * 120)}" y="${f1(420 - q * 160)}" font-family="${FONT}" font-weight="900" font-size="48" fill="#fff" stroke="${INK}" stroke-width="5" paint-order="stroke" opacity="${f1(Math.sin(q * Math.PI) * 100) / 100}">♪</text>`; }
  h += pop(t, t - lt + 0.2, t + 99, 440, 200, label(0, 0, '요리사 포정 · 『장자』 양생주', { size: 36, bg: YEL }), {});
  return h;
}
function factory(t) {
  let h = BG('#C9C2B4') + BG('url(#hatch)').replace('/>', ' opacity=".25"/>');
  h += `<rect x="200" y="380" width="1500" height="500" fill="#9C5A44" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 5; i++) h += `<path d="M${200 + i * 300} 380 L${350 + i * 300} 260 L${500 + i * 300} 380 Z" fill="#8A4A36" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  for (let i = 0; i < 2; i++) { h += `<rect x="${1450 + i * 120}" y="140" width="70" height="240" fill="#7A3E2E" stroke="${INK}" stroke-width="7"/>`; for (let j = 0; j < 3; j++) { const k = (t * 0.2 + j / 3 + i * 0.4) % 1; h += `<circle cx="${f1(1485 + i * 120 + k * 120)}" cy="${f1(120 - k * 160)}" r="${f1(30 + k * 50)}" fill="#6B6B6B" opacity="${f1((1 - k) * 60) / 100}"/>`; } }
  for (let i = 0; i < 6; i++) h += `<rect x="${260 + i * 240}" y="480" width="150" height="120" rx="6" fill="#FFE9A8" stroke="${INK}" stroke-width="6"/>`;
  return h + `<rect x="-600" y="880" width="3120" height="600" fill="#6E665A"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
}
function hoursScene(t, lt, a) {
  const D = D_(a);
  if (a.res || a.rest) {
    let h = BG(NAVY) + BG('url(#grid)');
    if (a.rest) {
      const days = ['월', '화', '수', '목', '금', '토', '일'];
      const row = (y, rest, lbl, c) => { let g = T8(330, y + 16, lbl, { anchor: 'end', size: 40, fill: '#fff' }); days.forEach((d, i) => { const off = rest && i === 6; g += `<rect x="${380 + i * 150}" y="${y - 55}" width="130" height="110" rx="16" fill="${off ? MINT : '#33465F'}" stroke="${INK}" stroke-width="5"/>${T8(445 + i * 150, y + 16, off ? '쉼' : d, { size: 44, fill: off ? NAVY : '#fff' })}`; }); return g; };
      h += row(330, true, '쉬는 날 있음', MINT) + row(600, false, '쉬는 날 없음', PINK);
      if (lt > 0.3 * D) h += pop(t, t - lt + 0.3 * D, t + 99, 1630, 600, label(0, 0, '생산량 약 −10%', { size: 38, bg: PINK, color: '#fff' }), { rot: 3 });
      h += pop(t, t - lt + 0.1, t + 99, 960, 140, outlined(0, 0, [[['같은 시간을 일해도', '#fff']]], { size: 60, sw: 12 }), {});
      return h;
    }
    const ox = 360, oy = 740, sx = 15, sy = 7.0;
    h += `<line x1="${ox}" y1="${oy}" x2="${ox + 75 * sx}" y2="${oy}" stroke="#fff" stroke-width="6"/><line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy - 82 * sy}" stroke="#fff" stroke-width="6"/>`;
    h += T8(ox + 75 * sx + 20, oy + 12, '주당 노동 시간', { anchor: 'start', size: 34, fill: '#fff' }) + T8(ox - 20, oy - 82 * sy - 20, '총 생산량', { anchor: 'start', size: 34, fill: '#fff' });
    const f = x => x <= 49 ? x : 49 + (x - 49) * (1 - (x - 49) / 28) ;
    const k = prog(lt, 0.05 * D, 0.7 * D), xmax = 70 * k + 0.01;
    const pts2 = []; for (let x = 0; x <= xmax; x += 0.5) pts2.push([ox + x * sx, oy - f(x) * sy]);
    if (pts2.length > 1) h += `<polyline points="${pts2.map(p => p.map(f1).join(',')).join(' ')}" fill="none" stroke="${MINT}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
    for (const [hx, lbl, c] of [[49, '49시간', YEL], [56, '56시간', '#fff'], [70, '70시간', PINK]]) if (xmax >= hx) { const px = ox + hx * sx, py = oy - f(hx) * sy; h += `<line x1="${px}" y1="${oy}" x2="${px}" y2="${py}" stroke="${c}" stroke-width="4" stroke-dasharray="10 8"/><circle cx="${px}" cy="${f1(py)}" r="14" fill="${c}" stroke="${INK}" stroke-width="5"/>${T8(px + (hx === 49 ? -30 : (hx === 56 ? 10 : 30)), oy + 48, lbl, { size: 32, fill: c })}`; }
    if (lt > 0.72 * D) h += pop(t, t - lt + 0.72 * D, t + 99, 1500, 250, label(0, 0, '70시간 ≈ 56시간', { size: 46, bg: YEL }), { rot: -3 });
    if (lt > 0.2 * D && lt < 0.72 * D) h += pop(t, t - lt + 0.2 * D, t - lt + 0.72 * D, 900, 220, label(0, 0, '49시간 넘으면 시간당 생산량 ↓', { size: 38, bg: '#fff' }), {});
    h += pop(t, t - lt + 0.3, t + 99, 1400, 150, label(0, 0, 'Pencavel, Economic Journal (2015)', { size: 20, bg: '#fff' }), {});
    return h;
  }
  let h = factory(t);
  for (let i = 0; i < 4; i++) h += char({ t, seed: 995 + i, x: 360 + i * 200, y: 930, s: 0.5, goggles: 'none', vest: ['#6B7A8C', '#8A6A44', '#5E7A6A', '#7A5A8C'][i], patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', hair: '#3A2A1E', pose: '책상', ex: exprAt([[0, '지침']], t), look: [0.6, 0.4] });
  h += `<rect x="260" y="760" width="800" height="26" rx="6" fill="#4A4A4A" stroke="${INK}" stroke-width="6"/>`;
  return h;
}

/* ---------- 5 · the turtle in the mud ---------- */
function turtleG(x, y, s, t, alive = true) {
  const wag = alive ? Math.sin(t * 8) * 18 : 0;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  if (alive) h += `<path d="M-120 10 Q-160 ${f1(10 + wag)} -190 ${f1(-10 + wag)}" fill="none" stroke="#6B8A3A" stroke-width="16" stroke-linecap="round"/><path d="M-120 10 Q-160 ${f1(10 + wag)} -190 ${f1(-10 + wag)}" fill="none" stroke="${INK}" stroke-width="4" opacity=".3"/>`;
  if (alive) h += `<ellipse cx="-70" cy="40" rx="26" ry="16" fill="#8DB04A" stroke="${INK}" stroke-width="5"/><ellipse cx="70" cy="40" rx="26" ry="16" fill="#8DB04A" stroke="${INK}" stroke-width="5"/><ellipse cx="160" cy="${f1(-10 + Math.sin(t * 3) * 4)}" rx="44" ry="34" fill="#8DB04A" stroke="${INK}" stroke-width="6"/><circle cx="174" cy="${f1(-18 + Math.sin(t * 3) * 4)}" r="6" fill="${INK}"/><path d="M168 ${f1(2 + Math.sin(t * 3) * 4)} q10 8 20 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  h += `<path d="M-130 20 Q-130 -110 0 -110 Q130 -110 130 20 Z" fill="${alive ? '#6E8E3A' : '#B8A27A'}" stroke="${INK}" stroke-width="7"/>`;
  for (const [cx, cy] of [[-60, -40], [0, -70], [60, -40], [0, -10]]) h += `<path d="M${cx - 30} ${cy} L${cx} ${cy - 24} L${cx + 30} ${cy} L${cx} ${cy + 24} Z" fill="none" stroke="${INK}" stroke-width="4" opacity=".5"/>`;
  return h + `</g>`;
}
function shrineBox(x, y, s, t) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-260 -220 L0 -330 L260 -220 Z" fill="${SILK}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><rect x="-220" y="-220" width="440" height="320" fill="#E8C27A" stroke="${INK}" stroke-width="8"/><rect x="-150" y="-60" width="300" height="140" rx="10" fill="#C9A04A" stroke="${INK}" stroke-width="7"/><path d="M-120 -60 Q0 -110 120 -60" fill="#B83A3A" stroke="${INK}" stroke-width="6"/>${turtleG(0, -40, 0.7, t, false)}<path d="M-150 -20 L150 -20" stroke="#B83A3A" stroke-width="16"/></g>`; }
function mudPond(x, y, w) { return `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * 0.22}" fill="${MUD}" stroke="${INK}" stroke-width="7"/><ellipse cx="${x - w * 0.3}" cy="${y - 6}" rx="${w * 0.2}" ry="${w * 0.05}" fill="#9A7A52"/>`; }
function turtleScene(t, lt, a) {
  const D = D_(a);
  let h = `<defs>${inkDefs()}</defs>`;
  if (a.k === 2) {
    h += BG(INKP) + BG('url(#paper)');
    h += panel(140, 160, 780, 640, { fill: '#F3E3C8' }) + panel(1000, 160, 780, 640, { fill: '#DCE8C8' });
    h += shrineBox(530, 600, 0.95, t) + T8(530, 240, '죽어서 귀하게 모셔지기?', { size: 40 });
    if (lt > 0.4 * D) { h += mudPond(1390, 650, 300) + turtleG(1390, 620, 0.9, t, true) + T8(1390, 240, '살아서 진흙 속에 꼬리 끌기?', { size: 40 }); for (let i = 0; i < 3; i++) { const k = (t * 0.6 + i / 3) % 1; h += `<circle cx="${f1(1180 + i * 60 + k * 30)}" cy="${f1(650 - k * 60)}" r="8" fill="#9A7A52" opacity="${f1((1 - k) * 100) / 100}"/>`; } }
    return h;
  }
  h += inkBg(t, { ground: false, sx: 1640, sy: 200 });
  h += water(t, 760, '#9CC9DE', '#7DB0CC');
  h += `<path d="M-600 760 L820 760 Q880 800 820 880 L-600 900 Z" fill="#A9B98F" stroke="${INK}" stroke-width="6"/>`;
  h += ZH({ t, seed: 1000, x: 660, y: 840, s: 0.72, pose: '낚시', ex: exprAt([[0, '뿌듯']], t), look: [0.6, 0] });
  const [rx, ry] = handG(660, 840, 0.72, P['낚시'].hR);
  h += `<path d="M${f1(rx)} ${f1(ry)} Q${f1(rx + 260)} ${f1(ry - 300)} ${f1(rx + 480)} ${f1(ry - 260)}" fill="none" stroke="${WALNUT}" stroke-width="10" stroke-linecap="round"/><path d="M${f1(rx + 480)} ${f1(ry - 260)} L${f1(rx + 500)} ${f1(800 + Math.sin(t * 2) * 6)}" stroke="${INK}" stroke-width="2"/><circle cx="${f1(rx + 500)}" cy="${f1(800 + Math.sin(t * 2) * 6)}" r="9" fill="${RED}" stroke="${INK}" stroke-width="3"/>`;
  if (!a.k) {
    const arrive = easeOut(prog(lt, 0.2 * D, 0.55 * D));
    for (let i = 0; i < 2; i++) h += OF({ t, seed: 1001 + i, x: lerp(-200, 360, arrive) - i * 170, y: 880, s: 0.6, pose: arrive < 1 ? walkPose(t * 7 + i, 0.6) : '손인사', ex: exprAt([[0, '결심']], t), look: [0.8, -0.1] });
    if (arrive >= 1) h += pop(t, t - lt + 0.58 * D, t + 99, 520, 300, `<path d="M-280 -80 L280 -80 Q310 -80 310 -50 L310 50 Q310 80 280 80 L-80 80 L-120 140 L-110 80 L-280 80 Q-310 80 -310 50 L-310 -50 Q-310 -80 -280 -80 Z" fill="#fff" stroke="${INK}" stroke-width="7"/>${T8(0, 14, '나랏일을 맡아 주십시오!', { size: 40 })}`, { rot: -2 });
    h += pop(t, t - lt + 0.1, t + 99, 1380, 170, label(0, 0, '초나라 왕의 신하들', { size: 36, bg: '#D9826B', color: '#fff' }), {});
    return h;
  }
  for (let i = 0; i < 2; i++) h += OF({ t, seed: 1001 + i, x: 360 - i * 170, y: 880, s: 0.6, pose: '서기', ex: exprAt([[0, a.k === 3 ? '놀람' : '결심']], t), look: [0.8, -0.1] });
  if (a.k === 1) {
    h += pop(t, t - lt + 0.35 * D, t + 99, 1420, 420, bubble(0, 0, 640, 440, `${shrineBox(0, 120, 0.62, t)}<g transform="translate(-200 -140)">${label(0, 0, '죽은 지 3천 년', { size: 32, bg: YEL })}</g>`), { bob: 3 });
    return h;
  }
  // k3: "go away, I'll drag my tail in the mud"
  h += mudPond(1450, 860, 260) + turtleG(1450, 830, 0.8, t, true);
  if (lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 900, 300, `<path d="M-300 -80 L300 -80 Q330 -80 330 -50 L330 50 Q330 80 300 80 L-60 80 L-120 140 L-100 80 L-300 80 Q-330 80 -330 50 L-330 -50 Q-330 -80 -300 -80 Z" fill="#fff" stroke="${INK}" stroke-width="7"/>${T8(0, 14, '돌아가시오. 나도 진흙 속에서!', { size: 38 })}`, { rot: 2 });
  return h;
}
function battery(x, y, s, k, c) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-70" y="-34" width="140" height="68" rx="12" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="70" y="-14" width="14" height="28" rx="4" fill="${INK}"/><rect x="-60" y="-24" width="${f1(120 * k)}" height="48" rx="8" fill="${c}"/></g>`; }
function goalsScene(t, lt, a) {
  const D = D_(a);
  if (a.zero) {
    let h = `<defs>${inkDefs()}</defs>` + BG('url(#morning)') + clouds(t, 80, 25, 4, 6) + `<rect x="-600" y="760" width="3120" height="720" fill="#9CCB72"/><line x1="-600" y1="760" x2="2520" y2="760" stroke="${INK}" stroke-width="7"/>`;
    const V = [[0.05, 600, '구름 구경'], [0.35, 1080, '낙서'], [0.65, 1560, '동네 한 바퀴']];
    V.forEach(([f, x, lbl], i) => {
      if (lt < f * D) return;
      let g = '';
      if (i === 0) g = Z({ t, seed: 1010, x: 0, y: 0, s: 0.5, rot: -88, ex: { expr: '신남', prev: '신남', k: 1, blink: 0 } });
      if (i === 1) g = Z({ t, seed: 1011, x: 0, y: 0, s: 0.62, pose: '책상', ex: exprAt([[0, '신남']], t), look: [0, 0.6] }) + `<g transform="translate(0 -130) rotate(-6)"><rect x="-70" y="-50" width="140" height="100" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M-40 10 q20 -40 40 0 t40 0" fill="none" stroke="${PINK}" stroke-width="6"/><circle cx="30" cy="-20" r="12" fill="none" stroke="#4FA3E0" stroke-width="5"/></g>`;
      if (i === 2) g = Z({ t, seed: 1012, x: Math.sin(t * 0.8) * 60, y: 0, s: 0.62, pose: walkPose(t * 7, 0.7), ex: exprAt([[0, '신남']], t) });
      h += pop(t, t - lt + f * D, t + 99, x, i === 0 ? 790 : 880, g, { noPop: true, inDur: 0.4 });
      h += pop(t, t - lt + f * D + 0.2, t + 99, x, 330, label(0, 0, lbl, { size: 40, bg: [YEL, MINT, PINK][i], color: i === 2 ? '#fff' : NAVY }), {});
    });
    return h;
  }
  if (a.res) {
    let h = BG(INKP) + BG('url(#paper)');
    h += panel(140, 160, 780, 640, { fill: '#F6E3E3' }) + panel(1000, 160, 780, 640, { fill: '#E3F0DA' });
    h += T8(530, 240, '돈 · 명성 · 보이는 모습', { size: 40 }) + T8(1390, 240, '성장 · 관계 · 공동체', { size: 40 });
    const g1 = char({ t, seed: 1020, x: 530, y: 690, s: 0.56, goggles: 'none', vest: '#7CC7FF', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', hair: '#3A2A1E', pose: walkPose(t * 9, 0.9), ex: exprAt([[0, '지침']], t), look: [0.8, 0], sweat: true });
    h += g1 + `<g transform="translate(${f1(700 + Math.sin(t * 3) * 10)} 460)"><path d="M-40 -40 L40 -40 L30 20 L-30 20 Z" fill="#FFD25A" stroke="${INK}" stroke-width="5"/><rect x="-14" y="20" width="28" height="30" fill="#FFD25A" stroke="${INK}" stroke-width="5"/></g>` + battery(330, 360, 0.9, 0.2 + 0.05 * Math.sin(t * 4), RED);
    if (lt > 0.4 * D) {
      [[1290, '#FF8FB1'], [1390, '#FFD25A'], [1490, '#9CCB72']].forEach(([x, c], i) => h += char({ t, seed: 1021 + i, x, y: 690, s: 0.5, goggles: 'none', vest: c, patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', hair: ['#3A2A1E', '#6B4A2E', '#1E1E1E'][i], pose: i === 1 ? '만세' : '손인사', ex: exprAt([[0, '신남']], t), look: [i === 0 ? 0.6 : -0.4, -0.2] }));
      h += battery(1600, 360, 0.9, 0.95, MINT);
    }
    h += pop(t, t - lt + 0.25 * D, t + 99, 530, 740, label(0, 0, '활력 ↓ · 몸의 불편함 ↑', { size: 34, bg: PINK, color: '#fff' }), {});
    if (lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, 1390, 740, label(0, 0, '더 건강하고 행복', { size: 34, bg: MINT }), {});
    return h;
  }
  let h = BG('#EAF2F8') + BG('url(#paper)');
  h += panel(560, 140, 800, 700, { r: 20 }) + `<rect x="860" y="120" width="200" height="50" rx="10" fill="#9AA3AE" stroke="${INK}" stroke-width="6"/>`;
  h += T8(960, 250, '삶에서 가장 중요한 건?', { size: 46 });
  const O = ['돈', '명성', '보이는 모습', '성장', '관계', '공동체'];
  O.forEach((o, i) => { const at = 0.15 * D + i * 0.1 * D; if (lt > at) h += pop(t, t - lt + at, t + 99, i < 3 ? 760 : 1160, 380 + (i % 3) * 120, `<rect x="-24" y="-24" width="48" height="48" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/>${T8(44, 14, o, { anchor: 'start', size: 40 })}`, { noPop: true, inDur: 0.25 }); });
  h += Z({ t, seed: 1030, x: 1640, y: 1000, s: 0.56, pose: '턱괴기', ex: exprAt([[0, '결심']], t), look: [-0.7, -0.4] });
  h += pop(t, t - lt + 0.1, t + 99, 330, 260, label(0, 0, 'Kasser & Ryan (1996)', { size: 24, bg: '#fff' }), {});
  return h;
}

/* ---------- recap ---------- */
const RECAP9 = [['1', '쓸모없는 나무 아래 눕기'], ['2', '다르게 쓰기'], ['3', '가만히 앉아 있기'], ['4', '힘 빼고 결 따라 일하기'], ['5', '진흙 속 거북처럼 자유롭게']];
function recapScene(t, lt, a) {
  let h = BG(NAVY) + BG('url(#grid)');
  h += outlined(960, 120, ['만약에, 장자처럼 쓸모없음을 즐긴다면?'], { size: 56, sw: 12, fill: YEL });
  RECAP9.forEach((it, i) => {
    if (i >= a.k) return;
    const appear = a.k === 3 ? i * 1.2 : (a.k === 5 && i >= 3 ? (i - 3) * 1.6 : -1);
    const k = a.k === 5 && i < 3 ? 1 : easeOutBack(clamp((lt - appear) / 0.4, 0, 1));
    const y = 250 + i * 120;
    h += `<g transform="translate(${f1(lerp(-300, 0, clamp(k, 0, 1.2)))} 0)" opacity="${f1(clamp(k, 0, 1) * 100) / 100}">${label(480, y, it[0], { size: 44, bg: i === 4 ? YEL : MINT })}<text x="560" y="${y + 18}" font-family="${FONT}" font-weight="900" font-size="54" fill="#fff">${esc(it[1])}</text></g>`;
  });
  h += Z({ t, seed: 15, x: 1660, y: 980, s: 0.55, pose: walkPose(t * 5, 0.5), ex: exprAt([[0, '신남']], t) });
  return h;
}

/* ---------- ending ---------- */
function butterflyScene(t, lt, a) {
  const D = D_(a);
  let h = `<defs>${inkDefs()}</defs>`;
  if (a.k) {
    h += BG('url(#morning)') + clouds(t, 90, 20, 3, 8) + `<rect x="-600" y="820" width="3120" height="660" fill="#A8D27E"/>`;
    for (let i = 0; i < 16; i++) { const x = 60 + i * 120, y = 860 + (i % 3) * 40; h += `<g transform="translate(${x} ${y})"><line x1="0" y1="0" x2="0" y2="-50" stroke="#4E9A3E" stroke-width="5"/>${[0, 72, 144, 216, 288].map(r => `<ellipse cx="0" cy="-62" rx="10" ry="18" transform="rotate(${r} 0 -50)" fill="${['#FF8FB1', '#FFD25A', '#B9A7FF', '#fff'][i % 4]}" stroke="${INK}" stroke-width="3"/>`).join('')}<circle cx="0" cy="-50" r="7" fill="${YEL}" stroke="${INK}" stroke-width="2"/></g>`; }
    const bx = 960 + Math.sin(t * 0.7) * 520, by = 420 + Math.sin(t * 1.3) * 120;
    h += butterfly(bx, by, 1.7, t) + butterfly(bx - 300 + Math.sin(t * 1.1) * 80, by + 120, 0.6, t + 1, '#7CC7FF');
    h += ZH({ t, seed: 1040, x: 1600, y: 960, s: 0.6, ex: exprAt([[0, '신남']], t), look: [-0.8, -0.6] });
    if (lt > 0.4 * D) h += pop(t, t - lt + 0.4 * D, t + 99, 700, 170, outlined(0, 0, [[['나비였던 순간, ', '#fff'], ['그저 즐거웠다', YEL]]], { size: 70, sw: 14 }), {});
    return h;
  }
  h += BG('url(#dream9)');
  for (let i = 0; i < 40; i++) h += `<circle cx="${f1(hash(i) * 1920)}" cy="${f1(hash(i * 2) * 600)}" r="${f1(2 + hash(i * 3) * 3)}" fill="#fff" opacity="${f1((0.4 + 0.5 * Math.sin(t * 2 + i)) * 100) / 100}"/>`;
  h += `<circle cx="1640" cy="170" r="70" fill="#FFF3B0"/>` + `<rect x="-600" y="780" width="3120" height="700" fill="#4A5A78"/>`;
  h += gnarled(560, 820, 0.75, t);
  h += ZH({ t, seed: 1041, x: 520, y: 790, s: 0.58, rot: -86, ex: { expr: '잠', prev: '잠', k: 1, blink: 0 }, noBlink: true });
  const sw = lt > 0.55 * D;
  h += pop(t, t - lt + 0.1 * D, t + 99, 1000, 420, bubble(0, 0, 320, 220, butterfly(0, 0, 0.9, t)), { bob: 4 });
  if (sw) {
    h += pop(t, t - lt + 0.55 * D, t + 99, 1460, 640, butterfly(0, 0, 1.0, t, '#7CC7FF') + `<g transform="translate(0 -170)">${bubble(0, 0, 300, 200, `<g transform="translate(0 70)">${ZH({ t, seed: 1042, x: 0, y: 0, s: 0.3, ex: exprAt([[0, '잠']], t), noBlink: true })}</g>`)}</g>`, { bob: 4 });
    h += pop(t, t - lt + 0.7 * D, t + 99, 1240, 470, outlined(0, 0, [['?']], { size: 140, sw: 18, fill: YEL }), {});
  }
  return h;
}
function meadowScene(t, lt, a) {
  const D = D_(a);
  let h = `<defs>${inkDefs()}</defs>` + BG('url(#dusk9)') + `<circle cx="1500" cy="420" r="90" fill="#FFD27A"/><circle cx="1500" cy="420" r="260" fill="url(#warm)"/>` + clouds(t, 380, 18, 2, 11);
  h += `<path d="M-600 820 Q500 760 960 800 Q1500 840 2520 780 L2520 1480 L-600 1480 Z" fill="#9CB86A" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 30; i++) { const x = hash(i * 1.7) * 1920, y = 850 + hash(i * 2.9) * 60, sw = Math.sin(t * 2 + i) * 6; h += `<path d="M${f1(x)} ${f1(y)} q${f1(sw)} -30 ${f1(sw * 1.5)} -46" fill="none" stroke="#6E9A44" stroke-width="5" stroke-linecap="round"/>`; }
  h += Z({ t, seed: 1050, x: 860, y: 840, s: 0.7, rot: -88, ex: exprAt([[0, '신남']], t), look: [0.2, -0.9] });
  h += butterfly(1100 + Math.sin(t * 0.6) * 300, 520 + Math.sin(t * 1.4) * 60, 0.6, t);
  if (!a.ask && lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 900, 200, outlined(0, 0, [[['쓸모로 증명하지 않아도, ', '#fff']], [['충분히 소중해', YEL]]], { size: 74, sw: 14 }), {});
  if (a.ask) h += pop(t, t - lt + 0.3, t + 99, 760, 330, `<path d="M-400 -90 L400 -90 Q430 -90 430 -60 L430 50 Q430 80 400 80 L120 80 L60 150 L60 80 L-400 80 Q-430 80 -430 50 L-430 -60 Q-430 -90 -400 -90 Z" fill="#fff" stroke="${INK}" stroke-width="7"/>${T8(0, 14, '쓸모없지만 좋아하는 일은?', { size: 46 })}`, { rot: -2, bob: 5 });
  return h;
}
