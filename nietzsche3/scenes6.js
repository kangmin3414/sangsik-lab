/* ---------- experiment 005 · living like Nietzsche ---------- */
const SEPIA = '#E8D9BE', STONE = '#9AA3AE', IMP = '#7A5CFF';
const STACHE_PATH = 'M200 210 C184 198 150 200 136 218 C126 232 124 250 132 262 C142 246 160 240 178 240 C190 240 196 234 200 229 C204 234 210 240 222 240 C240 240 258 246 268 262 C276 250 274 232 264 218 C250 200 216 198 200 210 Z';
function stacheG(x, y, s, rot = 0, c = '#4A3426') {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000}) translate(-200 -230)"><path d="${STACHE_PATH}" fill="${c}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`;
}
const headOf = (x, y, s) => [x, y - 390 * s];
const D_ = a => a._dur || 6;
const srcText = (x, y, txt, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.anchor || 'middle'}" font-family="${FONT}" font-weight="500" font-size="${o.size || 28}" fill="${o.color || '#6B6255'}">${esc(txt)}</text>`;
function zig(x, y, r, t, i) { const k = (Math.sin(t * 6 + i) + 1) / 2; return `<path transform="translate(${x} ${y}) rotate(${r}) scale(${f1((0.9 + 0.2 * k) * 100) / 100})" d="M-20 0 L-6 -18 L6 0 L20 -18" fill="none" stroke="${RED}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`; }
function bulb(x, y, s, glow = 1) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 100) / 100})"><circle r="70" fill="url(#warm)" opacity="${glow}"/><path d="M-26 10 Q-40 -10 -36 -26 Q-30 -52 0 -54 Q30 -52 36 -26 Q40 -10 26 10 L20 24 L-20 24 Z" fill="${YEL}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="-18" y="24" width="36" height="20" rx="5" fill="#C3CDD8" stroke="${INK}" stroke-width="5"/><path d="M-8 -6 Q0 -20 8 -6" fill="none" stroke="${INK}" stroke-width="4"/></g>`; }
function book(x, y, w, hh, c, txt) { return `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="${-w / 2}" y="${-hh / 2}" width="${w}" height="${hh}" rx="6" fill="${c}" stroke="${INK}" stroke-width="5"/><rect x="${-w / 2 + 6}" y="${-hh / 2 + 4}" width="${w - 12}" height="6" fill="#fff" opacity=".35"/>${txt ? `<text x="0" y="${hh * 0.2}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${Math.min(30, hh * 0.62)}" fill="${INK}">${esc(txt)}</text>` : ''}</g>`; }
function notebook(x, y, s, rot = 0) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})"><rect x="-34" y="-44" width="68" height="88" rx="6" fill="#7A4A2A" stroke="${INK}" stroke-width="5"/><rect x="-26" y="-36" width="54" height="72" rx="3" fill="#FFF8E8"/>${[0, 1, 2, 3].map(i => `<line x1="-18" y1="${-22 + i * 15}" x2="${16 - (i % 2) * 10}" y2="${-22 + i * 15}" stroke="#C9B89A" stroke-width="4"/>`).join('')}</g>`; }

/* ---------- hook: commuter subway ---------- */
function subway(t) {
  let h = BG('#2B3550') + BG('url(#hatch)').replace('/>', ' opacity=".25"/>');
  for (let w = 0; w < 4; w++) {
    const x = 60 + w * 480;
    h += `<rect x="${x}" y="150" width="400" height="260" rx="26" fill="#0B1430" stroke="${INK}" stroke-width="9"/>`;
    for (let i = 0; i < 4; i++) { const xx = ((i * 140 - t * 900 + w * 37) % 340 + 340) % 340 - 20; h += `<line x1="${f1(x + 20 + xx)}" y1="${200 + i * 52}" x2="${f1(x + 20 + xx + 60)}" y2="${200 + i * 52}" stroke="#FFE9A8" stroke-width="6" stroke-linecap="round" opacity=".55"/>`; }
  }
  h += `<line x1="-600" y1="96" x2="2520" y2="96" stroke="#C3CDD8" stroke-width="12"/>`;
  for (let i = 0; i < 9; i++) { const x = 120 + i * 220, sw = Math.sin(t * 2 + i) * 4; h += `<g transform="rotate(${f1(sw)} ${x} 96)"><line x1="${x}" y1="96" x2="${x}" y2="150" stroke="#C3CDD8" stroke-width="6"/><path d="M${x - 20} 150 L${x + 20} 150 L${x + 14} 190 L${x - 14} 190 Z" fill="none" stroke="#C3CDD8" stroke-width="7"/></g>`; }
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#1A2238"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  h += `<rect x="-600" y="700" width="3120" height="40" fill="#3E4C7A" stroke="${INK}" stroke-width="6"/>`;
  return h;
}
function commuter(t, seed, x, y, s, vest) {
  let h = char({ t, seed, x, y, s, pose: '폰보기', ex: { expr: '기본', prev: '기본', k: 1, blink: 0 }, goggles: 'none', vest, patch: false, tee: true, look: [0, 0.9], hair: '#2A2A2A', shade: '#C9D9F0' });
  const [px, py] = handG(x, y, s, [200, 318]);
  return h + phone(px, py - 6, 0.42 * s / 0.82, { on: 1 }) + hand(px - 24 * s / 0.82, py + 8 * s / 0.82, s) + hand(px + 24 * s / 0.82, py + 8 * s / 0.82, s);
}
function hookScene(t, lt, a) {
  const D = D_(a);
  let h = subway(t);
  h += commuter(t, 81, 360, 980, 0.66, '#8E9AAE') + commuter(t, 82, 1520, 980, 0.66, '#A9B4C2');
  const x = 940, y = 990, s = 0.82, worry = lt > 0.7 * D;
  h += `<circle cx="${x}" cy="680" r="260" fill="url(#screenGlow)" opacity=".7"/>`;
  h += Z({ t, seed: 80, x, y, s, pose: '폰보기', ex: exprAt([[0, '지침'], [0.7 * D, '걱정']], lt), look: worry ? [0.5, -0.8] : [0, 0.9], light: 1, shade: '#C9D9F0', stache: false });
  const [px, py] = handG(x, y, s, [200, 318]);
  h += phone(px, py - 6, 0.42, { on: 1 }) + hand(px - 24, py + 8, s) + hand(px + 24, py + 8, s);
  [['남들 다 하니까', PINK, 520, 470, -5, 0.04], ['정해진 길', YEL, 1360, 450, 4, 0.2], ['바쁘게, 빨리빨리', '#7CC7FF', 560, 610, 3, 0.33]].forEach(([txt, c, xx, yy, r, f]) => {
    if (lt > f * D) h += pop(t, t - lt + f * D, t + 99, xx, yy, label(0, 0, txt, { size: 38, bg: c }), { rot: r, bob: 4 });
  });
  if (worry) h += pop(t, t - lt + 0.7 * D, t + 99, 1320, 300, bubble(0, 0, 560, 130, `<text x="0" y="14" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="42" fill="${NAVY}">나는 뭘 위해 사는 걸까?</text>`), { rot: 2, bob: 4 });
  return h;
}

/* ---------- Nietzsche intro ---------- */
function study(t) {
  let h = BG(SEPIA) + BG('url(#paper)') + BG('url(#hatch)').replace('/>', ' opacity=".18"/>');
  // bookshelf
  h += `<rect x="90" y="150" width="400" height="730" fill="#7A5235" stroke="${INK}" stroke-width="9"/>`;
  for (let r = 0; r < 4; r++) {
    const y = 330 + r * 170; h += `<rect x="90" y="${y}" width="400" height="18" fill="#5A3A22" stroke="${INK}" stroke-width="5"/>`;
    for (let i = 0; i < 7; i++) { const hh = 120 + ((i * 37 + r * 13) % 30); h += `<rect x="${110 + i * 52}" y="${y - hh}" width="42" height="${hh}" rx="4" fill="${['#9C3D3D', '#3D5C9C', '#3D8C5C', '#C9A46A', '#6B4A8C', '#B5653D', '#2E4260'][(i + r) % 7]}" stroke="${INK}" stroke-width="4"/>`; }
  }
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#9C7A55"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  return h;
}
function tablet(x, y, crack, fall, t) {
  // an old stone tablet labelled "오래된 정답" that cracks, then falls apart
  const pieces = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  let h = '';
  pieces.forEach(([sx, sy], i) => {
    const k = fall, dx = sx * 40 * k, dy = 600 * k * k + (sy < 0 ? -60 * k : 0), rot = sx * 40 * k;
    const clip = `M${sx < 0 ? -180 : 0} ${sy < 0 ? -230 : 0} L${sx < 0 ? 0 : 180} ${sy < 0 ? -230 : 0} L${sx < 0 ? 0 : 180} ${sy < 0 ? 0 : 210} L${sx < 0 ? -180 : 0} ${sy < 0 ? 0 : 210} Z`;
    h += `<g transform="translate(${f1(x + dx)} ${f1(y + dy)}) rotate(${f1(rot)})" opacity="${f1(clamp(1 - k * 1.2, 0, 1) * 100) / 100}"><clipPath id="tq${i}"><path d="${clip}"/></clipPath><g clip-path="url(#tq${i})">`;
    h += `<path d="M-180 210 L-180 -140 Q-180 -230 0 -230 Q180 -230 180 -140 L180 210 Z" fill="${STONE}" stroke="${INK}" stroke-width="9"/>`;
    for (let r = 0; r < 6; r++) h += `<rect x="-120" y="${-130 + r * 52}" width="${240 - (r % 3) * 50}" height="14" rx="7" fill="#7D8794"/>`;
    h += `</g></g>`;
  });
  if (fall < 0.05) {
    h += `<g transform="translate(${x} ${y})"><path d="M-180 210 L-180 -140 Q-180 -230 0 -230 Q180 -230 180 -140 L180 210 Z" fill="none" stroke="${INK}" stroke-width="9"/>`;
    if (crack > 0) { const L = 900 * crack; h += `<path d="M0 -230 L-20 -150 L24 -80 L-14 0 L30 80 L0 210 M-180 0 L-90 -16 L-14 0 L80 14 L180 0" fill="none" stroke="${INK}" stroke-width="7" stroke-dasharray="${f1(L)} 2000" stroke-linejoin="round"/>`; }
    h += `</g>`;
  }
  return h;
}
function nietzscheScene(t, lt, a) {
  const D = D_(a);
  let h = study(t);
  if (a.god) {
    h += BG('#000').replace('/>', ' opacity=".18"/>');
    h += NZ({ t, seed: 90, x: 560, y: 1000, s: 0.86, pose: a.god === 1 ? '손인사' : '서기', ex: exprAt([[0, '결심']], t), look: [0.7, -0.2] });
    if (a.god === 1) {
      h += pop(t, t - lt + 0.35, t + 99, 1180, 210, outlined(0, 0, ['“신은 죽었다”'], { size: 104, sw: 18 }), {});
      h += pop(t, t - lt + 0.6, t + 99, 1180, 310, `<g>${srcText(0, 0, '— 니체, 『즐거운 학문』(1882)', { color: '#3A2A1A', size: 30 })}</g>`, { noPop: true });
      h += tablet(1360, 640, prog(lt, 1.2, 2.4), 0, t);
      h += label(1360, 450, '오래된 정답', { size: 36, bg: '#C3CDD8' });
    } else {
      h += outlined(1180, 210, ['“신은 죽었다”'], { size: 72, sw: 14, fill: '#E8E2D6' });
      const fall = easeIn(prog(lt, 0.2, 1.4));
      h += tablet(1360, 640, 1, Math.max(0.06, fall), t);
      const k = prog(lt, 0.3 * D, 0.3 * D + 0.6);
      if (k > 0) {
        h += `<g transform="translate(1360 600) scale(${f1(easeOutBack(k) * 1000) / 1000})" opacity="${f1(Math.min(1, k * 2) * 100) / 100}"><circle r="260" fill="url(#warm)"/><rect x="-170" y="-210" width="340" height="400" rx="16" fill="#FFFDF6" stroke="${INK}" stroke-width="8"/><text x="0" y="-110" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="46" fill="${NAVY}">나의 의미</text>${[0, 1, 2].map(i => `<rect x="-120" y="${-50 + i * 60}" width="${240 - i * 50}" height="14" rx="7" fill="${[MINT, YEL, PINK][i]}" opacity=".9"/>`).join('')}<g transform="translate(130 150) rotate(-35)"><rect x="-10" y="-90" width="20" height="120" rx="6" fill="${YEL}" stroke="${INK}" stroke-width="5"/><path d="M-10 30 L0 56 L10 30 Z" fill="#F4E8D8" stroke="${INK}" stroke-width="5"/></g></g>`;
        h += particles(t, 91, 14, [1160, 360, 400, 460], YEL, { speed: 50, r: 6, op: 0.9 });
      }
      if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 1360, 320, label(0, 0, '의미는, 스스로 만든다', { size: 42, bg: MINT }), { rot: -2, bob: 3 });
    }
    return h;
  }
  if (a.bio) {
    const ill = lt > 0.42 * D;
    h += NZ({ t, seed: 90, x: 760, y: 990, s: 0.9, pose: ill ? '턱괴기' : '서기', ex: exprAt([[0, '결심'], [0.42 * D, '지침']], lt), look: [0.5, ill ? 0.4 : -0.2] });
    if (ill) { const [hx, hy] = headOf(760, 990, 0.9); h += zig(hx - 110, hy - 90, -20, t, 0) + zig(hx + 110, hy - 100, 20, t, 1); }
    h += pop(t, t - lt + 0.2, t + 99, 1380, 300, `<g>${label(0, 0, '24세 · 바젤대학 교수', { size: 44, bg: YEL })}<g transform="translate(-250 -6) scale(.9)"><path d="M-40 -6 L0 -26 L40 -6 L0 14 Z" fill="${INK}"/><rect x="-22" y="0" width="44" height="18" fill="${INK}"/><line x1="34" y1="-6" x2="34" y2="22" stroke="${YEL}" stroke-width="4"/></g></g>`, { rot: -2, bob: 3 });
    if (ill) h += pop(t, t - lt + 0.42 * D, t + 99, 1380, 440, label(0, 0, '심한 두통 · 눈병', { size: 44, bg: PINK }), { rot: 2, bob: 3 });
    if (lt > 0.74 * D) h += pop(t, t - lt + 0.74 * D, t + 99, 1380, 580, label(0, 0, '34세 · 교수직 사임', { size: 44, bg: '#C3CDD8' }), { rot: -2, bob: 3 });
    return h;
  }
  // intro: portrait reveal
  h += `<circle cx="760" cy="600" r="380" fill="url(#warm)" opacity=".7"/>`;
  h += pop(t, t - lt + 0.25, t + 99, 760, 990, NZ({ t, seed: 90, x: 0, y: 0, s: 0.92, ex: exprAt([[0, '결심']], t), look: [0.3, -0.1] }), { noPop: true, inDur: 0.6 });
  h += pop(t, t - lt + 0.1, t + 99, 1380, 220, label(0, 0, '140년 전', { size: 46, bg: YEL }), { rot: -3, bob: 3 });
  if (lt > 0.6 * D) {
    h += pop(t, t - lt + 0.6 * D, t + 99, 1380, 400, outlined(0, 0, ['프리드리히 니체'], { size: 92, sw: 16 }), {});
    h += pop(t, t - lt + 0.6 * D + 0.3, t + 99, 1380, 530, label(0, 0, '1844 – 1900 · 독일 철학자', { size: 38, bg: '#fff' }), {});
  }
  return h;
}

/* ---------- title (moustache sticks on) ---------- */
const LIST6 = ['걷기', '무리 거스르기', '시련', '영원회귀', '아모르 파티'];
function titleScene(t, lt, a) {
  let h = BG('url(#labG)') + BG('url(#grid)');
  h += particles(t, 5, 40, [0, 0, 1920, 1080], MINT, { speed: 40, r: 4, op: 0.6 });
  h += `<ellipse cx="960" cy="900" rx="320" ry="70" fill="url(#glow)"/><ellipse cx="960" cy="900" rx="260" ry="54" fill="#2E4260" stroke="${INK}" stroke-width="8"/>`;
  h += doctor(520, 960, 0.55, { t, expr: '미소', talk: env(t) });
  if (a.list) {
    h += outlined(960, 170, ['만약에, 현대에서 니체처럼 살아간다면?'], { size: 60, sw: 12, fill: YEL });
    const fs = 38, ws = LIST6.map(s => s.length * fs * 0.92 + 48), gap = 64, tot = ws.reduce((p, c) => p + c, 0) + gap * 4;
    let x = 960 - tot / 2;
    LIST6.forEach((it, i) => {
      const cx = x + ws[i] / 2;
      h += pop(t, t - lt + (a.sci ? -9 : 0.2 + i * 0.3), t + 99, f1(cx), 360, label(0, 0, it, { size: fs, bg: i === 4 ? YEL : MINT }), {});
      if (i < 4) h += `<path d="M${f1(x + ws[i] + 14)} 360 L${f1(x + ws[i] + gap - 14)} 360 M${f1(x + ws[i] + gap - 28)} 348 L${f1(x + ws[i] + gap - 14)} 360 L${f1(x + ws[i] + gap - 28)} 372" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="${f1(prog(lt, a.sci ? -9 : 0.4 + i * 0.3, (a.sci ? -9 : 0.4 + i * 0.3) + 0.3) * 100) / 100}"/>`;
      x += ws[i] + gap;
    });
    if (a.sci) h += pop(t, t - lt + 0.25 * D_(a), t + 99, 960, 480, label(0, 0, '+ 심리학 연구로 확인하기', { size: 40, bg: PINK, color: '#fff' }), { rot: -2, bob: 3 });
    h += Z({ t, seed: 7, x: 960, y: 890, s: 0.6, pose: walkPose(t * 7, 0.6), ex: exprAt([[0, '결심']], t) });
    return h;
  }
  h += pop(t, t - lt + 0.2, t + 99, 960, 230, outlined(0, 0, [[['만약에, ', YEL], ['현대에서', '#fff']], '니체처럼 살아간다면?'], { size: 92, sw: 18 }), {});
  const land = 1.55, fly = prog(lt, 0.9, land);
  const on = lt >= land;
  h += Z({ t, seed: 7, x: 960, y: 890, s: 0.6, pose: on ? '만세' : '서기', ex: exprAt([[0, '기본'], [land, '놀람'], [land + 0.7, '신남']], lt), stache: on ? '#4A3426' : false });
  if (!on && fly > 0) {
    const k = easeInOut(fly);
    const x = lerp(1560, 960, k), y = lerp(560, 690, k) - Math.sin(k * Math.PI) * 140;
    h += stacheG(x, y, lerp(0.9, 0.6, k), lerp(-260, 0, k));
  }
  if (lt > land && lt < land + 0.5) { const k = prog(lt, land, land + 0.5); h += `<circle cx="960" cy="690" r="${f1(30 + 120 * k)}" fill="none" stroke="${YEL}" stroke-width="8" opacity="${f1((1 - k) * 100) / 100}"/>`; }
  if (lt > land) h += pop(t, t - lt + land + 0.1, t + 99, 1210, 600, label(0, 0, '니체 콧수염 장착!', { size: 36, bg: YEL }), { rot: 5, bob: 4 });
  return h;
}

/* ---------- 1 · Sils-Maria walks ---------- */
function alpsBg(t, off, o = {}) {
  let h = `<rect x="-600" y="-600" width="3120" height="2280" fill="url(#morning)"/><circle cx="1550" cy="170" r="60" fill="#FFF3B0"/><circle cx="1550" cy="170" r="190" fill="url(#warm)" opacity=".6"/>`;
  h += clouds(t, 70, 14, 3, 5);
  const far = off * 0.12, k0 = Math.floor(far / 520);
  for (let j = -2; j < 6; j++) {
    const idx = k0 + j, x = idx * 520 - far, ph = 250 + hash(idx * 7.3) * 170;
    h += `<path d="M${f1(x - 330)} 600 L${f1(x)} ${f1(ph)} L${f1(x + 330)} 600 Z" fill="#8FA9C8" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    const sx = (600 - ph) * 0.3;
    h += `<path d="M${f1(x - sx * 1.1)} ${f1(ph + sx)} L${f1(x)} ${f1(ph)} L${f1(x + sx * 1.1)} ${f1(ph + sx)} L${f1(x + sx * 0.5)} ${f1(ph + sx * 0.8)} L${f1(x + sx * 0.1)} ${f1(ph + sx * 1.1)} L${f1(x - sx * 0.4)} ${f1(ph + sx * 0.85)} Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  }
  h += `<rect x="-600" y="590" width="3120" height="130" fill="url(#river)"/>`;
  for (let i = 0; i < 12; i++) { const x = ((i * 210 - off * 0.3) % 2520 + 2520) % 2520 - 300; h += `<line x1="${f1(x)}" y1="${615 + (i % 4) * 26}" x2="${f1(x + 50)}" y2="${615 + (i % 4) * 26}" stroke="#fff" stroke-width="4" opacity=".6"/>`; }
  h += `<rect x="-600" y="720" width="3120" height="80" fill="#8CCB7A" stroke="${INK}" stroke-width="5"/>`;
  // pines
  const po = off * 0.7, p0 = Math.floor(po / 300);
  for (let j = -2; j < 9; j++) { const idx = p0 + j, x = idx * 300 - po + hash(idx) * 80, hh = 120 + hash(idx * 3.1) * 70; h += `<path d="M${f1(x)} ${f1(790 - hh)} L${f1(x + 50)} 790 L${f1(x - 50)} 790 Z" fill="#3F8A5A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="${f1(x - 7)}" y="790" width="14" height="14" fill="#7A5235"/>`; }
  h += `<rect x="-600" y="800" width="3120" height="160" fill="#D9C7B0" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 16; i++) { const x = ((i * 170 - off) % 2720 + 2720) % 2720 - 400; h += `<ellipse cx="${f1(x)}" cy="${880 + (i % 3) * 18}" rx="18" ry="7" fill="#B8A28A"/>`; }
  h += `<rect x="-600" y="960" width="3120" height="400" fill="#9BCF84"/>`;
  return h;
}
function walkerWith(t, seed, x, y, s, phase, fn, extra) {
  const pose = walkPose(phase, 0.8);
  let h = shadow(x, y + 4, 84 * s / 0.8) + fn(Object.assign({ t, seed, x, y, s, pose }, extra));
  const [hx, hy] = handG(x, y, s, pose.hR);
  return [h, hx, hy + pose.dy * s];
}
function alpsScene(t, lt, a, run) {
  const D = D_(a);
  let h = alpsBg(t, run * 110);
  const [w, hx, hy] = walkerWith(t, 92, 820, 890, 0.74, t * 6.5, NZ, { ex: exprAt([[0, '결심']], t), look: [0.6, a.note ? 0.3 : -0.1] });
  h += w + notebook(hx + 6, hy - 10, 0.55, -10);
  if (!a.note) {
    if (lt > 0.32 * D) {
      h += pop(t, t - lt + 0.32 * D, t + 99, 960, 200, outlined(0, 0, [[['“걸으면서 얻은 생각만이', '#fff']], [['가치가 있다', YEL], ['”', '#fff']]], { size: 74, sw: 14 }), {});
      h += pop(t, t - lt + 0.32 * D + 0.3, t + 99, 960, 360, label(0, 0, '— 니체, 『우상의 황혼』(1888)', { size: 30, bg: '#fff' }), {});
    }
  } else {
    h += pop(t, t - lt + 0.15, t + 99, 420, 150, `<g>${label(0, 0, '실스마리아 · 스위스', { size: 40, bg: MINT })}<g transform="translate(-210 -4)"><path d="M0 22 C-18 0 -18 -24 0 -24 C18 -24 18 0 0 22 Z" fill="${RED}" stroke="${INK}" stroke-width="5"/><circle cy="-8" r="6" fill="#fff"/></g></g>`, { rot: -2, bob: 3 });
    const [cx, cy] = headOf(820, 890, 0.74);
    for (let i = 0; i < 4; i++) {
      const t0 = 0.35 * D + i * 0.12 * D; if (lt < t0) continue;
      const k = clamp((lt - t0) / 2.4, 0, 1);
      const op = k < 0.15 ? k / 0.15 : (k > 0.8 ? (1 - k) / 0.2 : 1);
      h += `<g opacity="${f1(op * 100) / 100}" transform="translate(${f1(cx + 70 + i * 40)} ${f1(cy - 120 - k * 160)})">${bubble(0, 0, 120, 70, `<text x="0" y="14" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="40" fill="${NAVY}">${['!', '?', '…', '✎'][i]}</text>`)}</g>`;
    }
    if (lt > 0.7 * D) h += pop(t, t - lt + 0.7 * D, t + 99, 1420, 300, label(0, 0, '떠오른 생각은 수첩에', { size: 38, bg: YEL }), { rot: 3, bob: 3 });
  }
  return h;
}
function walkScene(t, lt, a, run) {
  const D = D_(a);
  let h = park(t, lt, { calm: 1 }, run);
  const [cx, cy] = headOf(900, 884, 0.8);
  if (!a.study && lt < 0.45 * D) h += pop(t, t - lt + 0.3, t - lt + 0.45 * D, cx + 260, cy - 120, bubble(0, 0, 260, 100, `<text x="0" y="14" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="40" fill="${NAVY}">끙끙…</text>`), { rot: 3, bob: 3 });
  const n = a.study ? 6 : 4, start = a.study ? 0.3 : 0.5 * D;
  for (let i = 0; i < n; i++) {
    const t0 = start + i * (a.study ? 0.9 : 0.55); if (lt < t0) continue;
    const ang = -2.6 + i * (2.2 / Math.max(1, n - 1));
    h += pop(t, t - lt + t0, t + 99, f1(cx + Math.cos(ang) * 230), f1(cy - 30 + Math.sin(ang) * 200), bulb(0, 0, 0.8), { bob: 5 });
  }
  return h;
}

/* ---------- 2 · herd ---------- */
function herdScene(t, lt, a, run) {
  const D = D_(a);
  let h = BG('url(#morning)') + clouds(t, 90, 16, 3, 2);
  h += `<rect x="-600" y="620" width="3120" height="800" fill="#E3D6C2" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 12; i++) h += `<line x1="${-200 + i * 200}" y1="620" x2="${-600 + i * 260}" y2="1080" stroke="#CDBFA8" stroke-width="5"/>`;
  // signpost pointing right
  h += `<rect x="1712" y="300" width="20" height="380" fill="#7A5235" stroke="${INK}" stroke-width="6"/><path d="M1560 300 L1850 300 L1900 350 L1850 400 L1560 400 Z" fill="${YEL}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><text x="1710" y="368" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="44" fill="${NAVY}">다들 이쪽 →</text>`;
  const ph = t * 7;
  for (let i = 0; i < 8; i++) {
    const x = ((i * 260 + run * 95) % 2080 + 2080) % 2080 - 260;
    h += shadow(x, 744, 50) + char({ t, seed: 100 + i, x, y: 740, s: 0.5, pose: walkPose(ph, 0.7), ex: { expr: '기본', prev: '기본', k: 1, blink: 0 }, noBlink: true, goggles: 'none', vest: ['#A9B4C2', '#9AA6B6'][i % 2], patch: false, tee: true, hair: '#3A3A3A', look: [0.8, 0] });
  }
  // Zero walks the other way
  const zx = 1180 - run * 40, zp = walkPose(t * 6, 0.75);
  h += shadow(zx, 984, 70) + flip(zx, Z({ t, seed: 101, x: zx, y: 980, s: 0.72, pose: zp, ex: exprAt([[0, '결심']], t), look: [0.8, 0] }));
  if (!a.modern) {
    if (lt > 0.55 * D) {
      h += pop(t, t - lt + 0.55 * D, t + 99, 760, 200, outlined(0, 0, [[['“', '#fff'], ['무리 본능', YEL], ['”', '#fff']]], { size: 96, sw: 18 }), {});
      h += pop(t, t - lt + 0.55 * D + 0.3, t + 99, 760, 310, label(0, 0, '— 니체, 『즐거운 학문』(1882)', { size: 30, bg: '#fff' }), {});
    }
  } else {
    [['다들 산다는 물건', PINK, 420, 300, -4, 0.15], ['다들 간다는 길', '#7CC7FF', 980, 230, 3, 0.4], ['다들 좋아요 누르는 생각', YEL, 700, 450, -2, 0.62]].forEach(([txt, c, x, y, r, f]) => {
      if (lt > f * D) h += pop(t, t - lt + f * D, t + 99, x, y, label(0, 0, txt, { size: 38, bg: c }), { rot: r, bob: 4 });
    });
  }
  return h;
}
function aschScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#cream)') + BG('url(#paper)');
  h += `<rect x="330" y="70" width="1260" height="400" rx="20" fill="#fff" stroke="${INK}" stroke-width="9"/><rect x="330" y="70" width="1260" height="400" rx="20" fill="url(#grid)" opacity=".5"/>`;
  h += `<line x1="960" y1="100" x2="960" y2="440" stroke="#C3CDD8" stroke-width="5" stroke-dasharray="14 10"/>`;
  const line = (x, len, c) => `<line x1="${x}" y1="${400 - len}" x2="${x}" y2="400" stroke="${c}" stroke-width="16" stroke-linecap="round"/>`;
  h += line(645, 220, INK) + `<text x="645" y="450" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="${NAVY}">기준</text>`;
  [['A', 150, 1110], ['B', 220, 1275], ['C', 290, 1440]].forEach(([n, len, x]) => {
    h += line(x, len, INK) + `<text x="${x}" y="450" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="38" fill="${NAVY}">${n}</text>`;
  });
  const xs = [300, 530, 760, 990, 1220], zx = 1560, y = 890, s = 0.46;
  xs.forEach((x, i) => {
    const ally = a.ally && i === 4;
    h += char({ t, seed: 110 + i, x, y, s, pose: '서기', ex: { expr: ally ? '결심' : '기본', prev: ally ? '결심' : '기본', k: 1, blink: 0 }, goggles: 'none', vest: ally ? MINT : '#A9B4C2', patch: false, tee: true, hair: '#3A3A3A', look: [0, -0.4] });
    const t0 = a.ally ? (ally ? 0.15 * D : -9) : 0.48 * D + i * 0.07 * D;
    if (lt > t0) h += pop(t, t - lt + t0, t + 99, x, 600, label(0, 0, ally ? 'B!' : 'A!', { size: 44, bg: ally ? MINT : '#fff' }), { rot: (i % 2 ? 4 : -4), bob: 3 });
  });
  const brave = a.ally && lt > 0.35 * D;
  h += Z({ t, seed: 115, x: zx, y, s: 0.5, pose: brave ? '만세' : '서기', ex: exprAt(a.ally ? [[0, '걱정'], [0.35 * D, '결심']] : [[0, '기본'], [0.8 * D, '걱정']], lt), look: brave ? [0, -0.3] : [-0.9, -0.2], sweat: !brave && (a.ally || lt > 0.8 * D) });
  if (brave) h += pop(t, t - lt + 0.35 * D, t + 99, zx, 580, label(0, 0, 'B!', { size: 48, bg: YEL }), { rot: 5, bob: 4 });
  else if (!a.ally && lt > 0.82 * D) h += pop(t, t - lt + 0.82 * D, t + 99, zx - 70, 560, bubble(0, 0, 260, 96, `<text x="0" y="12" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="${NAVY}">…B 같은데?</text>`), { rot: -3, bob: 3 });
  if (a.ally && lt > 0.52 * D) h += pop(t, t - lt + 0.52 * D, t + 99, 960, 525, label(0, 0, '따라가는 비율 32% → 5%', { size: 42, bg: PINK, color: '#fff' }), { rot: -2, bob: 3 });
  if (!a.ally) h += srcText(960, 520, 'Asch (1951, 1956) · 다른 사람들은 모두 미리 짠 연기자', { size: 28 });
  return h;
}

/* ---------- 3 · adversity ---------- */
function atticBg(t, o = {}) {
  let h = BG('url(#nightRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".3"/>');
  h += windowNight(1260, 120, 420, 320, t);
  // rain on the window
  for (let i = 0; i < 18; i++) { const k = ((t * 1.6 + i * 0.137) % 1); const x = 1270 + (i * 53) % 400; h += `<line x1="${x}" y1="${f1(130 + k * 290)}" x2="${x - 6}" y2="${f1(150 + k * 290)}" stroke="#BFD8FF" stroke-width="3" opacity=".7"/>`; }
  const fl = (Math.sin(t * 0.7) > 0.985) ? 0.35 : 0;
  if (fl) h += `<rect x="1260" y="120" width="420" height="320" fill="#fff" opacity="${fl}"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#10152B"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  return h;
}
function candle(x, y, t) {
  const fl = 1 + Math.sin(t * 13) * 0.06 + Math.sin(t * 7.3) * 0.05;
  return `<circle cx="${x}" cy="${y - 60}" r="${f1(260 * fl)}" fill="url(#amber)" opacity=".8"/><rect x="${x - 16}" y="${y - 50}" width="32" height="56" rx="6" fill="#FFF3D6" stroke="${INK}" stroke-width="5"/><path d="M${x} ${f1(y - 92 * fl)} Q${x + 14} ${y - 66} ${x} ${y - 52} Q${x - 14} ${y - 66} ${x} ${f1(y - 92 * fl)} Z" fill="#FFB547" stroke="${INK}" stroke-width="4"/><ellipse cx="${x}" cy="${y + 8}" rx="34" ry="9" fill="#C9A46A" stroke="${INK}" stroke-width="4"/>`;
}
function stormScene(t, lt, a) {
  const D = D_(a);
  let h = atticBg(t);
  const x = 820, y = 900, s = 0.8;
  h += NZ({ t, seed: 120, x, y, s, pose: '책상', ex: exprAt([[0, a.lonely ? '지침' : '결심']], t), look: [0.2, 0.7], light: 1, shade: '#E8C9A8' });
  const [hx, hy] = headOf(x, y, s);
  if (!a.lonely) h += zig(hx - 120, hy - 70, -20, t, 0) + zig(hx + 125, hy - 80, 20, t, 1);
  h += `<rect x="380" y="740" width="980" height="40" rx="10" fill="#6B4A2E" stroke="${INK}" stroke-width="8"/><rect x="420" y="780" width="900" height="320" fill="#5A3E26" stroke="${INK}" stroke-width="8"/>`;
  h += `<path d="M700 742 L820 722 L940 742 L940 748 L700 748 Z" fill="#FFF8E8" stroke="${INK}" stroke-width="5"/><g transform="translate(930 700) rotate(30)"><path d="M0 -60 Q20 -30 4 20 L-4 20 Q-16 -30 0 -60 Z" fill="#fff" stroke="${INK}" stroke-width="4"/></g>`;
  h += candle(520, 740, t);
  if (!a.books && !a.lonely) {
    if (lt > 0.25 * D) {
      h += pop(t, t - lt + 0.25 * D, t + 99, 900, 170, outlined(0, 0, [[['“나를 죽이지 못하는 것은', '#fff']], [['나를 ', '#fff'], ['더 강하게', YEL], [' 만든다”', '#fff']]], { size: 66, sw: 13 }), {});
      h += pop(t, t - lt + 0.25 * D + 0.3, t + 99, 900, 320, label(0, 0, '— 니체, 『우상의 황혼』(1888)', { size: 30, bg: '#fff' }), {});
    }
  }
  if (a.books) {
    const yrs = ['1881', '1882', '1883', '1886', '1887', '1888'], cols = ['#9C3D3D', '#3D5C9C', '#C9A46A', '#3D8C5C', '#6B4A8C', '#B5653D'];
    yrs.forEach((yr, i) => { const t0 = 0.45 * D + i * 0.07 * D; if (lt < t0) return; const k = easeOutBack(clamp((lt - t0) / 0.35, 0, 1)); h += `<g transform="translate(0 ${f1((1 - Math.min(1, k)) * -120)})" opacity="${f1(clamp(k, 0, 1) * 100) / 100}">${book(1200, 712 - i * 46, 230, 44, cols[i], yr)}</g>`; });
    if (lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 1200, 300, label(0, 0, '교수직을 내려놓은 뒤 10년', { size: 40, bg: YEL }), { rot: -2, bob: 3 });
    h += pop(t, t - lt + 0.2, t + 99, 470, 260, label(0, 0, '두통 · 구토 · 나빠지는 시력', { size: 36, bg: PINK, color: '#fff' }), { rot: -3, bob: 3 });
  }
  if (a.lonely) {
    h += BG('#000').replace('/>', ' opacity=".15"/>');
    // empty chair
    h += `<g transform="translate(1520 880)"><rect x="-70" y="-150" width="18" height="150" fill="#6B4A2E" stroke="${INK}" stroke-width="5"/><rect x="-70" y="-60" width="140" height="18" fill="#6B4A2E" stroke="${INK}" stroke-width="5"/><rect x="52" y="-60" width="18" height="60" fill="#6B4A2E" stroke="${INK}" stroke-width="5"/></g>`;
    const t0 = 0.55 * D, n = Math.floor(clamp((lt - t0) * 30, 0, 40));
    for (let i = 0; i < n; i++) { const c = i % 8, r = Math.floor(i / 8); h += `<rect x="${1080 + c * 30}" y="${712 - r * 18}" width="26" height="16" rx="3" fill="${['#C9A46A', '#B5653D'][r % 2]}" stroke="${INK}" stroke-width="3"/>`; }
    if (lt > t0) h += pop(t, t - lt + t0 + 0.4, t + 99, 1290, 540, label(0, 0, '『차라투스트라』 4부 · 자비 출판 40권', { size: 36, bg: YEL }), { rot: -2, bob: 3 });
    if (lt > 0.18 * D) h += pop(t, t - lt + 0.18 * D, t + 99, 470, 250, label(0, 0, '아프고 · 외롭고 · 안 팔리고', { size: 36, bg: '#C3CDD8' }), { rot: 3, bob: 3 });
  }
  return h;
}
function ucurveScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#labG)') + BG('url(#grid)');
  const X0 = 420, X1 = 1540, Y0 = 700, MID = 930;
  h += `<rect x="300" y="150" width="1340" height="650" rx="24" fill="#06101C" stroke="${INK}" stroke-width="10"/>`;
  h += `<line x1="${X0}" y1="${Y0}" x2="${X1 + 20}" y2="${Y0}" stroke="#fff" stroke-width="6"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="210" stroke="#fff" stroke-width="6"/>`;
  h += `<text x="${X0 + 20}" y="240" font-family="${FONT}" font-weight="900" font-size="34" fill="${MINT}">마음 건강 · 삶의 만족</text>`;
  [['없음', 520], ['어느 정도', MID], ['아주 많이', 1440]].forEach(([s, x]) => h += `<line x1="${x}" y1="${Y0}" x2="${x}" y2="${Y0 + 16}" stroke="#fff" stroke-width="5"/><text x="${x}" y="${Y0 + 54}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="#fff">${s}</text>`);
  h += `<text x="${X1}" y="${Y0 + 92}" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="28" fill="#9CB3C8">살면서 겪은 시련 →</text>`;
  const yAt = x => 650 - 330 * Math.exp(-Math.pow((x - MID) / 280, 2)) + Math.max(0, x - MID) * 0.06;
  let end = X0;
  if (a.show === 1) end = lerp(X0, MID, easeInOut(prog(lt, 0.15 * D, 0.7 * D)));
  if (a.show === 2) end = lerp(MID, X1, easeInOut(prog(lt, 0.1, 0.75 * D)));
  if (a.show) {
    if (a.show === 2 && end > MID + 40) h += `<rect x="${MID + 260}" y="210" width="${f1(Math.max(0, end - MID - 260))}" height="${Y0 - 210}" fill="${RED}" opacity=".12"/>`;
    let d = `M${X0} ${f1(yAt(X0))}`; for (let x = X0; x <= end; x += 10) d += ` L${x} ${f1(yAt(x))}`;
    h += `<path d="${d}" fill="none" stroke="${MINT}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
    const zx = a.show === 1 ? end : MID;
    h += Z({ t, seed: 121, x: zx, y: yAt(zx) + 2, s: 0.24, pose: a.show === 1 ? walkPose(t * 8, 0.8) : '만세', ex: exprAt([[0, '신남']], t) });
    if (a.show === 1 && lt > 0.72 * D) h += pop(t, t - lt + 0.72 * D, t + 99, MID, 200, label(0, 0, '가장 건강', { size: 38, bg: MINT }), { bob: 3 });
    if (a.show === 2) {
      h += label(MID, 200, '가장 건강', { size: 38, bg: MINT });
      if (end > 1300) h += pop(t, t - lt + 0.55 * D, t + 99, 1400, 420, label(0, 0, '너무 많으면 힘들다', { size: 36, bg: PINK, color: '#fff' }), { rot: 3, bob: 3 });
    }
    if (a.show === 1 && lt > 0.3 * D) h += pop(t, t - lt + 0.3 * D, t + 99, 560, 520, label(0, 0, '시련 없음', { size: 32, bg: '#C3CDD8' }), { rot: -3 });
    if (a.show === 2) h += label(560, 520, '시련 없음', { size: 32, bg: '#C3CDD8' });
  } else {
    h += pop(t, t - lt + 0.6, t + 99, 980, 460, outlined(0, 0, ['?'], { size: 200, sw: 26, fill: MINT }), { bob: 6 });
  }
  h += srcText(960, 850, 'Seery, Holman & Silver, J. Pers. Soc. Psychol. (2010) · 상관관계 연구', { size: 26, color: '#9CB3C8' });
  h += doctor(170, 1010, 0.45, { t, tilt: 4, pose: 'point', expr: a.show === 2 ? '진지' : '미소', talk: env(t) });
  return h;
}
function careScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#labG)') + BG('url(#grid)');
  h += `<rect x="-600" y="840" width="3120" height="600" fill="#0E1C30"/>`;
  h += `<ellipse cx="960" cy="440" rx="620" ry="380" fill="url(#glow)" opacity=".35"/>`;
  h += `<rect x="520" y="110" width="880" height="640" rx="28" fill="#06101C" stroke="${INK}" stroke-width="12"/><rect x="540" y="130" width="840" height="600" rx="18" fill="url(#grid)"/>`;
  const pulse = 1 + 0.06 * Math.sin(t * 5);
  h += `<circle cx="960" cy="420" r="260" fill="url(#warm)" opacity=".5"/>` + heart(960, 400, 7.5 * pulse, PINK);
  h += char({ t, seed: 122, x: 860, y: 690, s: 0.36, pose: '서기', ex: { expr: '신남', prev: '신남', k: 1, blink: 0 }, goggles: 'none', vest: '#7CC7FF', patch: false, tee: true, hair: '#2A2A2A' });
  h += Z({ t, seed: 123, x: 1060, y: 690, s: 0.36, pose: '서기', ex: exprAt([[0, '신남']], t) });
  h += label(960, 180, a.label || '혼자 버티지 않기', { size: 40, bg: MINT });
  h += doctor(300, 960, 0.6, { t, tilt: 4, pose: 'point', expr: '미소', talk: env(t) });
  h += Z({ t, seed: 124, x: 1620, y: 960, s: 0.62, ex: exprAt([[0, '기본'], [0.5 * D, '결심']], lt), look: [-0.8, -0.5], light: -1, shade: '#B9D3E3', pose: '서기' });
  return h;
}

/* ---------- 4 · eternal recurrence ---------- */
function imp(x, y, s, t) {
  const fl = Math.sin(t * 9) * 12;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">
<path d="M-60 -10 Q-150 ${f1(-70 + fl)} -170 ${f1(-10 + fl)} Q-140 0 -150 30 Q-110 10 -60 20 Z" fill="#4B3A8F" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
<path d="M60 -10 Q150 ${f1(-70 + fl)} 170 ${f1(-10 + fl)} Q140 0 150 30 Q110 10 60 20 Z" fill="#4B3A8F" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
<path d="M30 60 Q90 110 70 150 L92 150 L78 172 L60 150" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
<path d="M-44 -50 L-56 -104 L-20 -66 Z M44 -50 L56 -104 L20 -66 Z" fill="${YEL}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
<circle r="74" fill="${IMP}" stroke="${INK}" stroke-width="8"/>
<ellipse cx="-26" cy="-12" rx="17" ry="20" fill="#fff" stroke="${INK}" stroke-width="5"/><ellipse cx="26" cy="-12" rx="17" ry="20" fill="#fff" stroke="${INK}" stroke-width="5"/>
<circle cx="-22" cy="-8" r="8" fill="${INK}"/><circle cx="30" cy="-8" r="8" fill="${INK}"/>
<path d="M-48 -40 L-10 -30 M48 -40 L10 -30" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
<path d="M-30 28 Q0 52 30 28" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M14 36 L20 48 L26 34" fill="#fff" stroke="${INK}" stroke-width="3"/>
</g>`;
}
function hourglass(x, y, s, t) {
  const per = 2.4, ph = (t % per) / per, rot = ph > 0.8 ? 180 * easeInOut((ph - 0.8) / 0.2) : 0, sand = Math.min(1, ph / 0.8);
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><rect x="-46" y="-78" width="92" height="12" rx="5" fill="#8C6638" stroke="${INK}" stroke-width="5"/><rect x="-46" y="66" width="92" height="12" rx="5" fill="#8C6638" stroke="${INK}" stroke-width="5"/>
<path d="M-36 -66 L36 -66 L6 0 L36 66 L-36 66 L-6 0 Z" fill="#DFF4FF" fill-opacity=".7" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
<path d="M${f1(-30 * (1 - sand))} ${f1(-60 + 54 * sand)} L${f1(30 * (1 - sand))} ${f1(-60 + 54 * sand)} L4 -4 L-4 -4 Z" fill="${YEL}"/>
<path d="M${f1(-34 * sand)} 64 L${f1(34 * sand)} 64 L${f1(6 * sand)} ${f1(64 - 50 * sand)} L${f1(-6 * sand)} ${f1(64 - 50 * sand)} Z" fill="${YEL}"/><line x1="0" y1="0" x2="0" y2="62" stroke="${YEL}" stroke-width="3" opacity="${sand < 1 ? 1 : 0}"/></g>`;
}
function demonScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#nightRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".3"/>');
  h += windowNight(200, 140, 400, 300, t);
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#10152B"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  if (!a.choice) {
    const show = lt > 0.32 * D;
    h += Z({ t, seed: 130, x: 820, y: 980, s: 0.82, pose: show ? '웅크림' : '서기', ex: exprAt([[0, '기본'], [0.32 * D, '놀람']], lt), look: show ? [0.9, -0.5] : [0.3, 0.2], light: 1, shade: '#C9D9F0' });
    if (show) {
      const k = prog(lt, 0.32 * D, 0.32 * D + 0.6);
      h += `<circle cx="1360" cy="430" r="${f1(300 * k)}" fill="#7A5CFF" opacity=".18"/>`;
      h += pop(t, t - lt + 0.32 * D, t + 99, 1360, 440, imp(0, 0, 1, t) + hourglass(150, 60, 0.75, t), { bob: 10 });
      if (lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 1340, 180, `<path d="M-310 -70 L310 -70 Q340 -70 340 -40 L340 40 Q340 70 310 70 L40 70 L0 120 L-10 70 L-310 70 Q-340 70 -340 40 L-340 -40 Q-340 -70 -310 -70 Z" fill="#fff" stroke="${INK}" stroke-width="7"/><text x="0" y="14" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="42" fill="${NAVY}">이 삶을, 똑같이, 영원히!</text>`, { rot: -2, bob: 4 });
    } else h += pop(t, t - lt + 0.2, t + 99, 1360, 380, label(0, 0, '가장 외로운 밤', { size: 40, bg: '#C3CDD8' }), { rot: 3 });
    return h;
  }
  h += BG('#000').replace('/>', ' opacity=".25"/>');
  h += imp(960, 160, 0.55, t) + hourglass(1050, 190, 0.45, t);
  const card = (x, title, c, ex, t0, rot) => {
    if (lt < t0) return '';
    let inner = `<rect x="-280" y="-230" width="560" height="440" rx="30" fill="${c}" stroke="${INK}" stroke-width="9"/>`;
    inner += char({ t, seed: 131, x: 0, y: 150, s: 0.48, pose: ex === '신남' ? '만세' : '웅크림', ex: { expr: ex, prev: ex, k: 1, blink: 0 }, goggles: 'none', vest: TEE, patch: false, tee: true, vshade: 'rgba(150,60,0,0.22)', stache: '#4A3426' });
    inner += `<g transform="translate(0 -180)">${label(0, 0, title, { size: 46, bg: '#fff' })}</g>`;
    if (ex === '신남') inner += particles(t, 132, 10, [-240, -200, 480, 360], YEL, { speed: 40, r: 6, op: 0.9 });
    return pop(t, t - lt + t0, t + 99, x, 520, inner, { rot, bob: 4 });
  };
  h += card(540, '절망…', '#8E9AAE', '겁먹음', 0.05 * D, -3) + card(1380, '이보다 멋질 순 없어!', YEL, '신남', 0.42 * D, 3);
  h += pop(t, t - lt + 0.2, t + 99, 960, 520, outlined(0, 0, ['vs'], { size: 80, sw: 14, fill: '#fff' }), {});
  return h;
}
function frameIcon(kind, t) {
  if (kind === 'alarm') return wallClock(0, -10, 74, 7, 0) + `<path d="M-70 -66 Q-50 -96 -24 -86 M70 -66 Q50 -96 24 -86" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
  if (kind === 'scroll' || kind === 'scroll2') return phone(0, -10, 0.72, { on: 1, content: feedContent(t) });
  if (kind === 'commute') return `<g transform="translate(0 -10)"><rect x="-100" y="-70" width="200" height="130" rx="26" fill="#4FA3E0" stroke="${INK}" stroke-width="7"/><rect x="-80" y="-50" width="70" height="50" rx="8" fill="#DFF4FF" stroke="${INK}" stroke-width="5"/><rect x="10" y="-50" width="70" height="50" rx="8" fill="#DFF4FF" stroke="${INK}" stroke-width="5"/><circle cx="-55" cy="66" r="16" fill="${INK}"/><circle cx="55" cy="66" r="16" fill="${INK}"/></g>`;
  if (kind === 'sleep') return `<g transform="translate(0 -10)"><circle cx="-10" cy="0" r="56" fill="#FFD25A" stroke="${INK}" stroke-width="6"/><circle cx="18" cy="-18" r="52" fill="#16294A"/><text x="60" y="-40" font-family="${FONT}" font-weight="900" font-size="44" fill="#fff">z</text><text x="86" y="-76" font-family="${FONT}" font-weight="900" font-size="34" fill="#fff">z</text></g>`;
  if (kind === 'call') return `<g transform="translate(0 -10)">${phone(0, 0, 0.72, { on: 1, content: `<rect x="-52" y="-98" width="104" height="196" fill="${MINT}"/>` + heart(0, -10, 2.2, PINK) + `<circle cx="0" cy="60" r="18" fill="#48E08A" stroke="${INK}" stroke-width="4"/>` })}${[0, 1, 2].map(i => `<path d="M${70 + i * 18} ${-40 - i * 10} q16 30 0 60" fill="none" stroke="${MINT}" stroke-width="7" stroke-linecap="round"/>`).join('')}</g>`;
  return '';
}
const LOOPN = { alarm: '알람', scroll: '스크롤', commute: '출근', scroll2: '또 스크롤', sleep: '잠', call: '친구에게 전화' };
function loopScene(t, lt, a) {
  const D = D_(a);
  let h = BG(NAVY) + BG('url(#grid)');
  h += pop(t, t - lt + 0.1, t + 99, 960, 140, outlined(0, 0, [[['오늘 하루 ', '#fff'], ['무한 반복 ∞', YEL]]], { size: 66, sw: 13 }), {});
  h += `<rect x="-600" y="250" width="3120" height="420" fill="#05080F" stroke="${INK}" stroke-width="8"/>`;
  const holes = (y) => { let s = ''; const o = (t * 150) % 80; for (let i = -1; i < 30; i++) s += `<rect x="${f1(i * 80 - o)}" y="${y}" width="40" height="22" rx="5" fill="#2E4260"/>`; return s; };
  h += holes(266) + holes(632);
  const swapped = a.change && lt > 0.5 * D;
  const seq = ['alarm', 'scroll', 'commute', 'scroll2', 'sleep'];
  const W = 360, P = W * seq.length * 2, off = t * 150;
  for (let i = 0; i < seq.length * 2; i++) {
    let kind = seq[i % seq.length];
    if (kind === 'scroll2' && swapped) kind = 'call';
    const x = ((i * W - off) % P + P) % P - 260;
    if (x < -400 || x > 2300) continue;
    const hl = kind === 'call';
    h += `<g transform="translate(${f1(x)} 460)"><rect x="-150" y="-170" width="300" height="320" rx="16" fill="${hl ? '#E6FFF5' : '#E9EEF4'}" stroke="${hl ? MINT : INK}" stroke-width="${hl ? 12 : 6}"/>${frameIcon(kind, t)}<text x="0" y="128" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="${NAVY}">${LOOPN[kind]}</text></g>`;
  }
  if (a.change && lt > 0.5 * D && lt < 0.5 * D + 0.4) h += `<rect x="-600" y="250" width="3120" height="420" fill="#fff" opacity="${f1((1 - prog(lt, 0.5 * D, 0.5 * D + 0.4)) * 0.5 * 100) / 100}"/>`;
  if (!a.change && lt > 0.8 * D) h += pop(t, t - lt + 0.8 * D, t + 99, 1340, 760, label(0, 0, '이걸 영원히…?', { size: 40, bg: PINK, color: '#fff' }), { rot: -3, bob: 3 });
  if (swapped) h += pop(t, t - lt + 0.55 * D, t + 99, 1300, 760, label(0, 0, '딱 하나만 바꾸기', { size: 40, bg: MINT }), { rot: -3, bob: 3 });
  h += Z({ t, seed: 133, x: 1720, y: 1010, s: 0.48, pose: swapped ? '만세' : '턱괴기', ex: exprAt([[0, swapped ? '신남' : '지침']], t), look: [-0.8, -0.6] });
  return h;
}
function regretScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#cream)') + BG('url(#paper)');
  const panel = (cx, title, did, didnt, k, hl) => {
    let s = `<g transform="translate(${cx} 470)"><rect x="-330" y="-330" width="660" height="560" rx="30" fill="#fff" stroke="${INK}" stroke-width="8"/>`;
    s += `<g transform="translate(0 -262)">${label(0, 0, title, { size: 42, bg: hl ? YEL : '#C3CDD8' })}</g>`;
    s += `<line x1="-250" y1="150" x2="250" y2="150" stroke="${INK}" stroke-width="6"/>`;
    [[did, PINK, '한 일', -120], [didnt, '#4FA3E0', '하지 않은 일', 120]].forEach(([v, c, n, x], i) => {
      const hh = 330 * v * easeOut(clamp(k * 1.2 - i * 0.2, 0, 1));
      s += `<rect x="${x - 70}" y="${f1(150 - hh)}" width="140" height="${f1(hh)}" rx="12" fill="${c}" stroke="${INK}" stroke-width="6"/><text x="${x}" y="200" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="36" fill="${NAVY}">${n}</text>`;
    });
    return s + `</g>`;
  };
  const kL = a.long ? 1 : prog(lt, 0.15 * D, 0.75 * D), kR = a.long ? prog(lt, 0.05 * D, 0.45 * D) : 0;
  h += panel(560, '지금 당장', 0.8, 0.45, kL, !a.long);
  if (a.long) h += panel(1360, '인생 전체를 돌아보면', 0.35, 0.92, kR, true);
  else h += `<g transform="translate(1360 470)"><rect x="-330" y="-330" width="660" height="560" rx="30" fill="#fff" stroke="${INK}" stroke-width="8" stroke-dasharray="20 14" opacity=".6"/><text x="0" y="60" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="200" fill="#E2D8C8">?</text></g>`;
  if (a.long && lt > 0.32 * D) h += pop(t, t - lt + 0.32 * D, t + 99, 1360, 96, label(0, 0, '더 오래 남는 후회', { size: 36, bg: PINK, color: '#fff' }), { rot: 4, bob: 3 });
  h += srcText(960, 820, 'Gilovich & Medvec (1994, 1995) · 막대 높이는 경향을 나타낸 그림', { size: 26 });
  h += Z({ t, seed: 134, x: 1830, y: 1010, s: 0.4, pose: '서기', ex: exprAt([[0, a.long ? '결심' : '걱정']], t), look: [-0.8, -0.3] });
  return h;
}

/* ---------- 5 · amor fati ---------- */
function rainSt(t) {
  let h = BG('#5C6B80') + BG('url(#hatch)').replace('/>', ' opacity=".2"/>');
  for (let i = 0; i < 5; i++) { const x = -100 + i * 440; h += `<rect x="${x}" y="${180 + (i % 2) * 60}" width="320" height="${520 - (i % 2) * 60}" fill="#46536A" stroke="${INK}" stroke-width="6"/>${[0, 1, 2].map(r => [0, 1, 2].map(c => `<rect x="${x + 30 + c * 95}" y="${220 + (i % 2) * 60 + r * 120}" width="60" height="70" fill="${(r + c + i) % 3 ? '#FFE9A8' : '#2E3A50'}" opacity=".8"/>`).join('')).join('')}`; }
  h += `<rect x="-600" y="700" width="3120" height="100" fill="#3A4558" stroke="${INK}" stroke-width="6"/><rect x="-600" y="800" width="3120" height="160" fill="#8E96A3" stroke="${INK}" stroke-width="6"/><rect x="-600" y="960" width="3120" height="400" fill="#6E7684"/>`;
  return h;
}
function rainFx(t) { let h = ''; for (let i = 0; i < 70; i++) { const k = ((t * 1.3 + hash(i) ) % 1), x = (hash(i * 3.3) * 2200 - 140) - k * 60, y = -80 + k * 1180; h += `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x - 12)}" y2="${f1(y + 46)}" stroke="#CFE3FF" stroke-width="3" opacity=".55"/>`; } return h; }
function bus(x, y) {
  return `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="-260" y="-250" width="520" height="250" rx="34" fill="#48B868" stroke="${INK}" stroke-width="9"/>${[0, 1, 2, 3].map(i => `<rect x="${-230 + i * 118}" y="-220" width="96" height="90" rx="12" fill="#DFF4FF" stroke="${INK}" stroke-width="6"/>`).join('')}<rect x="-260" y="-110" width="520" height="22" fill="#fff" opacity=".7"/><circle cx="-160" cy="0" r="40" fill="${INK}"/><circle cx="-160" cy="0" r="16" fill="#C3CDD8"/><circle cx="160" cy="0" r="40" fill="${INK}"/><circle cx="160" cy="0" r="16" fill="#C3CDD8"/><rect x="230" y="-80" width="30" height="24" rx="6" fill="${YEL}" stroke="${INK}" stroke-width="4"/></g>`;
}
function amorScene(t, lt, a) {
  const D = D_(a);
  if (a.sunset) {
    let h = park(t, lt, { sunset: 1, calm: 1, hearts: lt > 0.5 * D }, t);
    h += pop(t, t - lt + 0.2, t + 99, 620, 220, label(0, 0, '처음 보는 노을', { size: 44, bg: YEL }), { rot: -3, bob: 4 });
    if (lt > 0.5 * D) h += pop(t, t - lt + 0.5 * D, t + 99, 1260, 300, label(0, 0, '놓친 버스 = 오늘의 선물', { size: 40, bg: PINK, color: '#fff' }), { rot: 3, bob: 4 });
    return h;
  }
  if (a.rain) {
    let h = rainSt(t);
    // stop sign
    h += `<rect x="372" y="560" width="14" height="330" fill="#C3CDD8" stroke="${INK}" stroke-width="5"/><rect x="300" y="500" width="160" height="80" rx="14" fill="#4FA3E0" stroke="${INK}" stroke-width="6"/><text x="380" y="552" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="#fff">정류장</text>`;
    const leave = prog(lt, 0.52 * D, 0.8 * D), bx = 1250 + easeIn(leave) * 1400;
    h += bus(bx, 900);
    const walking = lt > 0.84 * D, zx = walking ? 640 + (lt - 0.84 * D) * 120 : 640;
    const pose = walking ? walkPose(t * 7, 0.8) : (lt > 0.56 * D && lt < 0.72 * D ? '손인사' : '서기');
    h += Z({ t, seed: 140, x: zx, y: 960, s: 0.78, pose, ex: exprAt([[0, '기본'], [0.56 * D, '놀람'], [0.68 * D, '걱정'], [0.82 * D, '결심']], lt), look: [0.8, 0], light: 1, shade: '#C9D3E2' });
    h += rainFx(t);
    if (lt < 0.5 * D) {
      h += pop(t, t - lt + 0.1 * D, t + 99, 700, 260, label(0, 0, '좋은 일도', { size: 44, bg: YEL }), { rot: -3, bob: 3 });
      if (lt > 0.24 * D) h += pop(t, t - lt + 0.24 * D, t + 99, 1060, 330, label(0, 0, '나쁜 일도', { size: 44, bg: '#C3CDD8' }), { rot: 3, bob: 3 });
      if (lt > 0.36 * D) h += pop(t, t - lt + 0.36 * D, t + 99, 900, 440, `<g>${heart(0, 0, 2.4, PINK)}</g>`, { bob: 4 });
    }
    if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 820, 330, label(0, 0, '버스 놓침…', { size: 42, bg: '#C3CDD8' }), { rot: -3, bob: 3 });
    if (walking) h += pop(t, t - lt + 0.84 * D, t + 99, 1120, 420, label(0, 0, '걸어가 볼까?', { size: 42, bg: MINT }), { rot: 3, bob: 3 });
    return h;
  }
  let h = BG('url(#sunset)') + BG('url(#dots)');
  for (let i = 0; i < 8; i++) { const k = ((t * 0.18 + i / 8) % 1); const x = [180, 340, 520, 1400, 1560, 1740, 260, 1660][i]; h += `<text x="${f1(x + Math.sin(t + i) * 20)}" y="${f1(900 - k * 760)}" font-family="${FONT}" font-weight="900" font-size="${50 + (i % 3) * 14}" fill="#fff" stroke="${INK}" stroke-width="4" paint-order="stroke fill" opacity="${f1(Math.sin(k * Math.PI) * 90) / 100}">${i % 2 ? '♪' : '♫'}</text>`; }
  h += pop(t, t - lt + 0.2, t + 99, 960, 230, outlined(0, 0, [[['AMOR ', YEL], ['FATI', '#fff']]], { size: 140, sw: 22 }), {});
  if (lt > 0.3 * D) h += pop(t, t - lt + 0.3 * D, t + 99, 960, 390, label(0, 0, '아모르 파티 = 운명을 사랑하라', { size: 44, bg: MINT }), {});
  if (lt > 0.66 * D) h += pop(t, t - lt + 0.66 * D, t + 99, 1460, 560, label(0, 0, '인간의 위대함을 위한 공식', { size: 36, bg: YEL }), { rot: 4, bob: 4 });
  if (lt > 0.66 * D) h += pop(t, t - lt + 0.66 * D + 0.3, t + 99, 1460, 650, label(0, 0, '— 니체, 『이 사람을 보라』', { size: 28, bg: '#fff' }), { rot: 4, bob: 4 });
  const dance = Math.sin(t * 6) > 0;
  h += Z({ t, seed: 141, x: 900, y: 940, s: 0.62, pose: dance ? '만세' : '손인사', ex: exprAt([[0, '신남']], t), light: -1, shade: '#F3C9A8' });
  return h;
}
function portrait(x, y, s, t) {
  let h = `<g transform="translate(${x} ${y}) scale(${s})"><clipPath id="pfc"><rect x="-170" y="-220" width="340" height="420" rx="8"/></clipPath>`;
  h += `<rect x="-200" y="-250" width="400" height="480" rx="14" fill="#C9A46A" stroke="${INK}" stroke-width="9"/><rect x="-170" y="-220" width="340" height="420" rx="8" fill="#D9C7A4" stroke="${INK}" stroke-width="6"/>`;
  h += `<g clip-path="url(#pfc)">${NZ({ t, seed: 150, x: 0, y: 420, s: 0.9, ex: { expr: '결심', prev: '결심', k: 1, blink: 0 }, noBlink: true, still: true, look: [0.2, 0] })}<rect x="-170" y="-220" width="340" height="420" fill="#8A6A3A" opacity=".18"/></g>`;
  return h + `</g>`;
}
function labnScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#labG)') + BG('url(#grid)');
  h += `<rect x="-600" y="840" width="3120" height="600" fill="#0E1C30"/>`;
  h += `<ellipse cx="960" cy="440" rx="620" ry="380" fill="url(#glow)" opacity=".3"/>`;
  h += `<rect x="520" y="110" width="880" height="640" rx="28" fill="#06101C" stroke="${INK}" stroke-width="12"/><rect x="540" y="130" width="840" height="600" rx="18" fill="url(#grid)"/>`;
  if (!a.warn) {
    h += portrait(960, 430, 1, t);
    if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 960, 690, label(0, 0, '1889 · 토리노에서 쓰러짐', { size: 38, bg: '#C3CDD8' }), {});
  } else {
    h += portrait(960, 400, 0.62, t);
    h += pop(t, t - lt + 0.3 * D, t + 99, 760, 640, label(0, 0, '고독 흉내 ✕', { size: 40, bg: '#C3CDD8' }), { rot: -3 });
    h += pop(t, t - lt + 0.62 * D, t + 99, 1160, 640, label(0, 0, '질문 가져오기 ✓', { size: 40, bg: MINT }), { rot: 3 });
  }
  h += doctor(300, 960, 0.6, { t, tilt: 4, pose: 'point', expr: a.warn ? '미소' : '진지', talk: env(t) });
  h += Z({ t, seed: 151, x: 1620, y: 960, s: 0.62, ex: exprAt([[0, a.warn ? '결심' : '걱정']], t), look: [-0.8, -0.5], light: -1, shade: '#B9D3E3', pose: a.warn ? '손인사' : '턱괴기' });
  return h;
}

/* ---------- recap ---------- */
const RECAP6 = [['1일 차', '걸으면서 생각하기'], ['2일 차', '무리를 따르지 않기'], ['3일 차', '시련에서 배우기'], ['4일 차', '영원회귀 질문하기'], ['5일 차', '아모르 파티']];
function recapScene(t, lt, a) {
  let h = BG(NAVY) + BG('url(#grid)');
  h += outlined(960, 150, ['만약에, 현대에서 니체처럼 살아간다면?'], { size: 60, sw: 12, fill: YEL });
  RECAP6.forEach((it, i) => {
    if (i >= a.k) return;
    const appear = a.k === 2 ? i * 1.5 : (a.k === 5 && i >= 2 ? (i - 2) * 1.6 : -1);
    const k = a.k === 5 && i < 2 ? 1 : easeOutBack(clamp((lt - appear) / 0.4, 0, 1));
    const y = 270 + i * 130;
    h += `<g transform="translate(${f1(lerp(-300, 0, clamp(k, 0, 1.2)))} 0)" opacity="${f1(clamp(k, 0, 1) * 100) / 100}">${label(540, y, it[0], { size: 44, bg: i === 4 ? YEL : MINT })}<text x="700" y="${y + 16}" font-family="${FONT}" font-weight="900" font-size="56" fill="#fff">${esc(it[1])}</text></g>`;
  });
  h += Z({ t, seed: 15, x: 1620, y: 980, s: 0.55, pose: walkPose(t * 7, 0.6), ex: exprAt([[0, '신남']], t) });
  return h;
}

/* ---------- ending ---------- */
function mane(x, y, r, t) {
  let d = ''; const n = 18;
  for (let i = 0; i <= n * 2; i++) { const ang = i / (n * 2) * Math.PI * 2, rr = i % 2 ? r * 0.8 : r * (1.05 + 0.04 * Math.sin(t * 6 + i)); d += `${i ? 'L' : 'M'}${f1(x + Math.cos(ang) * rr)} ${f1(y + Math.sin(ang) * rr)} `; }
  return `<path d="${d}Z" fill="#E08A3C" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
}
function metaScene(t, lt, a) {
  const D = D_(a), F = [0.3, 0.5, 0.7];
  let h = BG('url(#cream)') + BG('url(#paper)');
  h += outlined(960, 120, [[['정신의 ', '#fff'], ['세 가지 변신', YEL]]], { size: 70, sw: 14 });
  h += srcText(960, 190, '— 니체, 『차라투스트라는 이렇게 말했다』(1883)', { size: 28 });
  const panel = (i, inner, title, bg) => {
    const k = easeOutBack(clamp((lt - F[i] * D) / 0.45, 0, 1)), x = 340 + i * 620;
    return `<g transform="translate(${x} 520) scale(${f1(clamp(k, 0, 1.15) * 1000) / 1000})" opacity="${f1(clamp(k, 0, 1) * 100) / 100}"><rect x="-270" y="-260" width="540" height="460" rx="30" fill="${bg}" stroke="${INK}" stroke-width="9"/><g clip-path="url(#pclip)">${inner}</g>${label(0, 230, title, { size: 40, bg: '#fff' })}</g>`;
  };
  const camel = `<path d="M-260 130 Q-120 60 0 120 Q140 70 260 120 L260 190 L-260 190 Z" fill="#E8C27A"/>` + Z({ t, seed: 160, x: 0, y: 180, s: 0.44, pose: '만세', ex: exprAt([[0, '지침']], t), shiver: true }) + `<g transform="translate(0 ${f1(180 - 430 * 0.44 - 70)})">${book(0, 0, 200, 50, '#B5653D', '해야 할 일')}${book(10, -50, 180, 50, '#3D5C9C', '남의 기대')}${book(-6, -100, 190, 50, '#9C3D3D', '정답')}</g>`;
  const [lx, ly] = headOf(0, 180, 0.44);
  const lion = mane(lx, ly, 86, t) + Z({ t, seed: 161, x: 0, y: 180, s: 0.44, pose: '서기', ex: exprAt([[0, '결심']], t) }) + `<g transform="translate(150 -170)">${label(0, 0, '아니!', { size: 40, bg: RED, color: '#fff' })}</g>`;
  const plane = (() => { const k = (t * 0.4) % 1; const px = lerp(-200, 220, k), py = -150 + Math.sin(k * 6) * 30; return `<g transform="translate(${f1(px)} ${f1(py)}) rotate(-10)"><path d="M-40 0 L40 -14 L-10 14 Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-10 14 L-4 0" stroke="${INK}" stroke-width="4"/></g>`; })();
  const child = `<path d="M-260 140 Q0 110 260 140 L260 190 L-260 190 Z" fill="#9BCF84"/>` + plane + Z({ t, seed: 162, x: 0, y: 180, s: 0.4, pose: '만세', ex: exprAt([[0, '신남']], t), look: [0.5, -0.6] }) + particles(t, 163, 10, [-240, -220, 480, 300], YEL, { speed: 40, r: 6, op: 0.9 });
  for (let i = 0; i < 3; i++) { // placeholders so the board is never empty before the panels arrive
    const k0 = easeOutBack(clamp((lt - 0.1 - i * 0.35) / 0.4, 0, 1)), gone = clamp((lt - F[i] * D) / 0.3, 0, 1), x = 340 + i * 620;
    if (k0 > 0 && gone < 1) h += `<g transform="translate(${x} 520) scale(${f1(clamp(k0, 0, 1.1) * 1000) / 1000})" opacity="${f1((1 - gone) * clamp(k0, 0, 1) * 100) / 100}"><rect x="-270" y="-260" width="540" height="460" rx="30" fill="#fff" fill-opacity=".5" stroke="${INK}" stroke-width="7" stroke-dasharray="22 16"/><text x="0" y="40" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="190" fill="#E2D8C8" stroke="${INK}" stroke-width="5">${i + 1}</text></g>`;
  }
  h += panel(0, camel, '낙타 · 짐을 지다', '#F6E3BC') + panel(1, lion, '사자 · 아니라고 외치다', '#FFD9A0') + panel(2, child, '아이 · 새로 시작하다', '#DFF4FF');
  for (let i = 0; i < 2; i++) { const k = clamp((lt - F[i + 1] * D) / 0.3, 0, 1); h += `<path d="M${640 + i * 620 - 30} 520 L${640 + i * 620 + 30} 520 M${640 + i * 620 + 12} 502 L${640 + i * 620 + 30} 520 L${640 + i * 620 + 12} 538" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round" opacity="${k}"/>`; }
  return h;
}
function becomeScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#morning)');
  for (let i = 0; i < 9; i++) { const ang = -Math.PI / 2 + (i - 4) * 0.22 + Math.sin(t * 0.4) * 0.03; h += `<path d="M960 1040 L${f1(960 + Math.cos(ang - 0.06) * 1600)} ${f1(1040 + Math.sin(ang - 0.06) * 1600)} L${f1(960 + Math.cos(ang + 0.06) * 1600)} ${f1(1040 + Math.sin(ang + 0.06) * 1600)} Z" fill="#fff" opacity=".18"/>`; }
  h += `<circle cx="960" cy="640" r="420" fill="url(#warm)" opacity=".8"/>`;
  h += `<rect x="-600" y="900" width="3120" height="600" fill="#9BCF84"/><line x1="-600" y1="900" x2="2520" y2="900" stroke="${INK}" stroke-width="7"/>`;
  const quoteAt = a.off ? -9 : 0.4 * D;
  if (lt > quoteAt) {
    h += pop(t, t - lt + quoteAt, t + 99, 960, 200, outlined(0, 0, [[['“너 자신이 ', '#fff'], ['되어라', YEL], ['”', '#fff']]], { size: 110, sw: 20 }), {});
    h += pop(t, t - lt + quoteAt + 0.3, t + 99, 960, 320, label(0, 0, '— 니체, 『즐거운 학문』(1882)', { size: 30, bg: '#fff' }), {});
  }
  const x = 960, y = 1000, s = 0.78, peel = 0.12 * D, peeled = a.off && lt > peel;
  h += shadow(x, y + 4, 90);
  h += Z({ t, seed: 170, x, y, s, pose: a.off ? (lt < peel + 0.4 ? '손인사' : '만세') : '서기', ex: exprAt(a.off ? [[0, '기본'], [peel + 0.3, '신남']] : [[0, '기본']], lt), look: a.off ? [0, -0.2] : [0, -0.7], stache: peeled ? false : '#4A3426' });
  if (peeled) {
    const k = clamp((lt - peel) / 1.2, 0, 1);
    if (k < 1) h += stacheG(x + 40 + k * 420, y - 330 * s - 60 * Math.sin(k * Math.PI) + k * k * 300, s, k * 300);
    h += particles(t, 171, 16, [620, 400, 680, 500], YEL, { speed: 50, r: 7, op: 0.9 });
    if (lt > 0.4 * D) h += pop(t, t - lt + 0.4 * D, t + 99, 1440, 560, label(0, 0, '나만의 답', { size: 46, bg: MINT }), { rot: 4, bob: 4 });
    if (lt > 0.72 * D) h += pop(t, t - lt + 0.72 * D, t + 99, 480, 600, label(0, 0, '거창하지 않아도 OK', { size: 40, bg: YEL }), { rot: -3, bob: 4 });
  }
  return h;
}
function duskScene(t, lt, a, run) {
  const D = D_(a);
  let h = park(t, lt, { sunset: 1, calm: 1, hearts: !!a.ask }, run);
  if (!a.ask) {
    [['10분 걷기', MINT, 480, 0.0], ['솔직한 한마디', YEL, 960, 0.12], ['미뤄 둔 첫걸음', PINK, 1440, 0.25]].forEach(([txt, c, x, f], i) => {
      if (lt > f * D) h += pop(t, t - lt + f * D + 0.1, t + 99, x, 220, label(0, 0, txt, { size: 46, bg: c, color: c === PINK ? '#fff' : NAVY }), { rot: [-3, 2, 4][i], bob: 4 });
    });
    if (lt > 0.5 * D) h += pop(t, t - lt + 0.5 * D, t + 99, 960, 360, label(0, 0, '다시 살고 싶은 하루', { size: 40, bg: '#fff' }), { bob: 3 });
  } else {
    h += pop(t, t - lt + 0.3, t + 99, 1340, 330, `<path d="M-340 -90 L340 -90 Q370 -90 370 -60 L370 50 Q370 80 340 80 L-60 80 L-110 140 L-100 80 L-340 80 Q-370 80 -370 50 L-370 -60 Q-370 -90 -340 -90 Z" fill="#fff" stroke="${INK}" stroke-width="7"/><text x="0" y="12" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="42" fill="${NAVY}">영원히 반복해도 좋을 하루는?</text>`, { rot: 3, bob: 5 });
  }
  return h;
}
