/* ---------- experiment 006 · a week as a Stoic ---------- */
const MARBLE = '#EDE7DA', PURPLE = '#7A3E8E', OLIVE = '#6DBE55';
P['통화'] = Object.assign({ armL: P['서기'].armL, hL: P['서기'].hL, armR: [[252, 285], [298, 262], [262, 196]], hR: [256, 190] }, LEGS);
function wreathG(x, y, s) {
  const leaf = (x0, y0, cx, cy, x1, y1, side) => { let w = ''; for (let i = 0; i < 7; i++) { const k = 0.06 + i * 0.145, q = 1 - k; const px = q * q * x0 + 2 * q * k * cx + k * k * x1, py = q * q * y0 + 2 * q * k * cy + k * k * y1; const tx = 2 * q * (cx - x0) + 2 * k * (x1 - cx), ty = 2 * q * (cy - y0) + 2 * k * (y1 - cy); const ang = Math.atan2(ty, tx) * 180 / Math.PI; for (const sg of [-1, 1]) w += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="17" ry="8" transform="rotate(${f1(ang + sg * 38 * side)} ${f1(px)} ${f1(py)}) translate(${f1(12 * side)} 0)" fill="${sg > 0 ? '#6DBE55' : '#4E9A3E'}" stroke="${INK}" stroke-width="4"/>`; } return w; };
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000}) translate(-200 -170)">${leaf(96, 168, 92, 80, 186, 58, 1) + leaf(304, 168, 308, 80, 214, 58, -1)}</g>`;
}
function togaG(x, y, s, rot = 0) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000}) translate(-205 -335)"><path d="M136 268 Q160 252 184 256 L276 398 Q270 414 252 416 L226 414 Z" fill="#F4F1EA" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`; }
function column(x, y0, y1, w = 70) {
  let h = `<rect x="${x - w / 2}" y="${y0}" width="${w}" height="${y1 - y0}" fill="${MARBLE}" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 1; i < 4; i++) h += `<line x1="${x - w / 2 + i * w / 4}" y1="${y0 + 10}" x2="${x - w / 2 + i * w / 4}" y2="${y1 - 10}" stroke="#C9C0AE" stroke-width="4"/>`;
  h += `<rect x="${x - w / 2 - 14}" y="${y0 - 26}" width="${w + 28}" height="26" rx="4" fill="${MARBLE}" stroke="${INK}" stroke-width="6"/><rect x="${x - w / 2 - 14}" y="${y1}" width="${w + 28}" height="22" rx="4" fill="${MARBLE}" stroke="${INK}" stroke-width="6"/>`;
  return h;
}
function stoa(t, dusk = true) {
  let h = BG(dusk ? 'url(#sunset)' : 'url(#morning)');
  h += `<circle cx="960" cy="560" r="300" fill="url(#warm)" opacity=".7"/>`;
  h += `<path d="M180 250 L960 90 L1740 250 Z" fill="${MARBLE}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><rect x="180" y="250" width="1560" height="40" fill="${MARBLE}" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 8; i++) h += column(260 + i * 200, 316, 820);
  h += `<rect x="-600" y="840" width="3120" height="600" fill="#C9B79A"/><rect x="120" y="840" width="1680" height="30" fill="${MARBLE}" stroke="${INK}" stroke-width="6"/>`;
  return h;
}
function card(x, y, s, who, t, title) {
  const fn = who === 'MA' ? MA : (who === 'EP' ? EP : (who === 'SE' ? SE : NZ));
  let h = `<g transform="translate(${x} ${y}) scale(${s})"><clipPath id="cc${who}"><rect x="-120" y="-150" width="240" height="280" rx="10"/></clipPath><rect x="-136" y="-166" width="272" height="312" rx="16" fill="#C9A46A" stroke="${INK}" stroke-width="8"/><rect x="-120" y="-150" width="240" height="280" rx="10" fill="#F3E6CC" stroke="${INK}" stroke-width="5"/>`;
  h += `<g clip-path="url(#cc${who})">${fn({ t, seed: 300 + who.charCodeAt(0), x: 0, y: 330, s: 0.66, ex: { expr: '결심', prev: '결심', k: 1, blink: 0 }, still: true, noBlink: true })}</g>`;
  if (title) h += `<g transform="translate(0 168)">${label(0, 0, title, { size: 30, bg: '#fff' })}</g>`;
  return h + `</g>`;
}
function quote(x, y, lines, src, t, lt, at, o = {}) {
  if (lt < at) return '';
  let h = pop(t, t - lt + at, t + 99, x, y, outlined(0, 0, lines, { size: o.size || 66, sw: o.sw || 13 }), {});
  if (src) h += pop(t, t - lt + at + 0.3, t + 99, x, y + (o.srcDy || (lines.length > 1 ? 140 : 90)), label(0, 0, src, { size: 28, bg: '#fff' }), {});
  return h;
}


/* ---------- a recognisable Earth: real coastlines (Natural Earth 1:110m), centred on East Asia ---------- */
function earth(cx, cy, r, t, o = {}) {
  const sc = r / 1000, id = o.id || 'e';
  let h = `<defs><radialGradient id="${id}Oc" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#5DB4F4"/><stop offset=".55" stop-color="#2468C8"/><stop offset="1" stop-color="#0E2D6A"/></radialGradient>
<radialGradient id="${id}At" cx=".5" cy=".5" r=".5"><stop offset=".86" stop-color="#7CC7FF" stop-opacity="0"/><stop offset=".92" stop-color="#7CC7FF" stop-opacity=".55"/><stop offset="1" stop-color="#7CC7FF" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}Nt" cx=".72" cy=".26" r=".95"><stop offset=".45" stop-color="#03081C" stop-opacity="0"/><stop offset="1" stop-color="#03081C" stop-opacity=".62"/></radialGradient>
<radialGradient id="${id}Sp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<clipPath id="${id}C"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>`;
  h += `<circle cx="${cx}" cy="${cy}" r="${f1(r * 1.16)}" fill="url(#${id}At)"/>`;
  h += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}Oc)"/>`;
  h += `<g clip-path="url(#${id}C)"><g transform="translate(${cx} ${cy}) scale(${f1(sc * 10000) / 10000})">`;
  const COL = { green: '#5DAE57', tan: '#D6B06A', ice: '#EEF4FA' };
  EARTH.land.forEach(l => { h += `<path d="${l.d}" fill="${COL[l.c]}" stroke="${COL[l.c]}" stroke-width="${f1(2 / sc)}" stroke-linejoin="round"/>`; });
  h += `<path d="${EARTH.outline}" fill="none" stroke="#24502A" stroke-width="${f1(3 / sc)}" stroke-linejoin="round"/>`;
  h += `<ellipse cx="${EARTH.np[0]}" cy="${EARTH.np[1]}" rx="420" ry="120" fill="#F4F8FC" opacity=".85"/>`;
  // drifting clouds
  for (let i = 0; i < 11; i++) {
    const bx = ((hash(i * 3.1) * 2000 + t * 14) % 2200) - 1100, by = hash(i * 5.7) * 1700 - 850, w = 120 + hash(i) * 200;
    h += `<g opacity=".62" transform="translate(${f1(bx)} ${f1(by)}) rotate(${f1(-12 + hash(i * 2) * 24)})"><ellipse rx="${f1(w)}" ry="${f1(w * 0.16)}" fill="#fff"/><ellipse cx="${f1(w * 0.3)}" cy="${f1(-w * 0.1)}" rx="${f1(w * 0.45)}" ry="${f1(w * 0.12)}" fill="#fff"/></g>`;
  }
  h += `</g><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}Nt)"/><ellipse cx="${f1(cx + r * 0.3)}" cy="${f1(cy - r * 0.42)}" rx="${f1(r * 0.36)}" ry="${f1(r * 0.2)}" fill="url(#${id}Sp)"/></g>`;
  h += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="6"/><circle cx="${cx}" cy="${cy}" r="${f1(r + 6)}" fill="none" stroke="#9FD8FF" stroke-width="4" opacity=".5"/>`;
  if (o.marker) {
    const mx = cx + EARTH.korea[0] * sc, my = cy + EARTH.korea[1] * sc, pk = (t * 1.2) % 1;
    h += `<circle cx="${f1(mx)}" cy="${f1(my)}" r="${f1(8 + 40 * pk)}" fill="none" stroke="${RED}" stroke-width="4" opacity="${f1((1 - pk) * 100) / 100}"/><circle cx="${f1(mx)}" cy="${f1(my)}" r="9" fill="${RED}" stroke="#fff" stroke-width="3"/>`;
  }
  return h;
}
const earthPt = (cx, cy, r, which) => [cx + EARTH[which][0] * r / 1000, cy + EARTH[which][1] * r / 1000];

/* ---------- hook: a rattled morning ---------- */
function car(x, y, s, c, t, i) {
  const brake = (Math.sin(t * 3 + i * 1.7) > -0.2);
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-150 0 L-150 -60 Q-140 -80 -100 -84 L-60 -130 L70 -130 L110 -84 Q150 -80 150 -50 L150 0 Z" fill="${c}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-50 -118 L-10 -118 L-10 -86 L-80 -86 Z M6 -118 L62 -118 L94 -86 L6 -86 Z" fill="#DFF4FF" stroke="${INK}" stroke-width="5"/><circle cx="-90" cy="0" r="28" fill="${INK}"/><circle cx="90" cy="0" r="28" fill="${INK}"/><circle cx="-90" cy="0" r="10" fill="#C3CDD8"/><circle cx="90" cy="0" r="10" fill="#C3CDD8"/><rect x="-156" y="-56" width="16" height="22" rx="4" fill="${brake ? RED : '#7A2A2A'}" stroke="${INK}" stroke-width="4"/>${brake ? `<circle cx="-160" cy="-45" r="40" fill="url(#redglow)"/>` : ''}</g>`;
}
function street(t, o = {}) {
  let h = BG('url(#morning)') + clouds(t, 80, 14, 3, 7);
  for (let i = 0; i < 9; i++) { const x = -60 + i * 230, hh = 300 + (i * 97) % 220; h += `<rect x="${x}" y="${640 - hh}" width="200" height="${hh}" fill="${['#A9C3DA', '#9AB0C8', '#B7C9DC'][i % 3]}" stroke="${INK}" stroke-width="5"/>`; for (let r = 0; r < Math.floor(hh / 70); r++) for (let c = 0; c < 3; c++) h += `<rect x="${x + 22 + c * 58}" y="${640 - hh + 22 + r * 70}" width="34" height="40" fill="#E8F4FF" opacity=".75"/>`; }
  h += `<rect x="-600" y="640" width="3120" height="240" fill="#5E6672" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 12; i++) h += `<rect x="${-100 + i * 200}" y="752" width="100" height="10" fill="#fff" opacity=".7"/>`;
  const cols = ['#E8414A', '#4FA3E0', '#FFD25A', '#7CC7FF', '#FF8FB1', '#48B868'];
  for (let i = 0; i < 7; i++) h += car(-80 + i * 320 + Math.sin(t * 0.7 + i) * 4, 720, 0.82, cols[i % 6], t, i);
  for (let i = 0; i < 6; i++) h += car(60 + i * 340, 860, 0.9, cols[(i + 3) % 6], t, i + 9);
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#B8B0A4"/>`;
  return h;
}
function hookScene(t, lt, a) {
  const D = D_(a);
  let h = street(t);
  const mad = lt > 0.05 * D && lt < 0.72 * D;
  const x = 960 + (mad ? Math.sin(t * 40) * 2 : 0), y = 1000, s = 0.84;
  h += Z({ t, seed: 400, x, y, s, pose: '폰보기', ex: exprAt([[0, '기본'], [0.06 * D, '화남'], [0.34 * D, '놀람'], [0.5 * D, '화남'], [0.72 * D, '걱정']], lt), look: lt > 0.72 * D ? [0.4, -0.7] : [0, 0.9], wreath: false, toga: false });
  const [px, py] = handG(x, y, s, [200, 318]);
  h += phone(px, py - 6, 0.42, { on: 1 }) + hand(px - 24, py + 8, s) + hand(px + 24, py + 8, s);
  if (lt > 0.04 * D) h += pop(t, t - lt + 0.04 * D, t + 99, 420, 360, outlined(0, 0, ['빵빵!'], { size: 70, sw: 13, fill: YEL }), { rot: -8, bob: 4, wobble: 3 });
  if (lt > 0.3 * D) h += pop(t, t - lt + 0.3 * D, t + 99, 1450, 330, `<rect x="-280" y="-70" width="560" height="140" rx="22" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="-210" cy="0" r="38" fill="#C3CDD8" stroke="${INK}" stroke-width="5"/><text x="-150" y="-14" font-family="${FONT}" font-weight="900" font-size="30" fill="#6B7A8C">팀장님</text><text x="-150" y="30" font-family="${FONT}" font-weight="900" font-size="36" fill="${NAVY}">지금 잠깐 얘기 좀…</text>`, { rot: 3, bob: 4 });
  if (lt > 0.5 * D) h += pop(t, t - lt + 0.5 * D, t + 99, 560, 560, `<rect x="-250" y="-60" width="500" height="120" rx="20" fill="#2A1F4A" stroke="${INK}" stroke-width="7"/><text x="0" y="14" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="40" fill="#FF8FB1">이게 최선임? ㅋ</text>`, { rot: -3, bob: 4 });
  if (lt > 0.72 * D) { const [hx, hy] = headOf(x, y, s); h += `<path d="M${hx - 150} ${hy - 150} q30 -30 60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="${RED}" stroke-width="8" stroke-linecap="round" opacity=".8" transform="translate(0 ${f1(Math.sin(t * 12) * 6)})"/>`; }
  return h;
}

/* ---------- the three Stoics ---------- */
function coins(x, y, n) { let h = ''; for (let i = 0; i < n; i++) { const r = Math.floor(i / 5), c = i % 5; h += `<ellipse cx="${x + c * 26 - 52 + r * 13}" cy="${y - r * 14}" rx="24" ry="10" fill="#FFD25A" stroke="${INK}" stroke-width="4"/>`; } return h; }
function stick(x, y, len) { return `<line x1="${x}" y1="${y}" x2="${x + 8}" y2="${y + len}" stroke="#7A5235" stroke-width="12" stroke-linecap="round"/><line x1="${x}" y1="${y}" x2="${x + 8}" y2="${y + len}" stroke="${INK}" stroke-width="3" opacity=".3"/>`; }
function trioScene(t, lt, a) {
  const D = D_(a);
  let h = stoa(t);
  if (!a.who) {
    h += pop(t, t - lt + 0.2, t + 99, 960, 420, outlined(0, 0, [[['2천 년 전', YEL]]], { size: 110, sw: 20 }), {});
    if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 960, 580, outlined(0, 0, ['스토아 철학자들'], { size: 80, sw: 15 }), {});
    if (lt > 0.75 * D) h += pop(t, t - lt + 0.75 * D, t + 99, 960, 700, label(0, 0, '스토아 = 아테네의 ‘기둥 회랑’에서 가르친 데서 온 이름', { size: 30, bg: '#fff' }), {});
    return h;
  }
  const W = [['MA', 480, 0.04, '로마 황제', '마르쿠스 아우렐리우스', PURPLE], ['EP', 960, 0.36, '노예 출신', '에픽테토스', '#9C7A55'], ['SE', 1440, 0.66, '로마의 큰 부자', '세네카', '#C8423A']];
  W.forEach(([who, x, f, role, name, c], i) => {
    const at = a.who === 2 ? -9 : f * D; if (lt < at) return;
    const fn = who === 'MA' ? MA : (who === 'EP' ? EP : SE);
    let g = shadow(0, 4, 80) + fn({ t, seed: 410 + i, x: 0, y: 0, s: 0.74, ex: exprAt([[0, '결심']], t), look: [0, -0.2] });
    if (who === 'EP') g += stick(64, -200, 200);
    if (who === 'SE') g += coins(150, -10, 9);
    g += `<g transform="translate(0 -440)">${label(0, 0, role, { size: 34, bg: c, color: '#fff' })}</g>`;
    h += pop(t, t - lt + at, t + 99, x, 800, g, {});
    h += pop(t, t - lt + at + 0.25, t + 99, x, 842, label(0, 0, name, { size: 34, bg: '#fff' }), {});
  });
  if (a.who === 2 && lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 960, 200, outlined(0, 0, [[['같은 철학, ', '#fff'], ['스토아', YEL]]], { size: 76, sw: 14 }), {});
  return h;
}

/* ---------- title (wreath + toga fly in) ---------- */
const LIST7 = ['월 · 내 것만', '화 · 예행연습', '수 · 불편함', '목 · 내려다보기', '금 · 잃는 상상', '토 · 메멘토 모리', '일 · 하루 돌아보기'];
function titleScene(t, lt, a) {
  let h = BG('url(#labG)') + BG('url(#grid)');
  h += particles(t, 5, 40, [0, 0, 1920, 1080], MINT, { speed: 40, r: 4, op: 0.6 });
  h += `<ellipse cx="960" cy="900" rx="320" ry="70" fill="url(#glow)"/><ellipse cx="960" cy="900" rx="260" ry="54" fill="#2E4260" stroke="${INK}" stroke-width="8"/>`;
  h += doctor(520, 960, 0.55, { t, expr: '미소', talk: env(t) });
  if (a.list) {
    h += outlined(960, 130, ['만약에, 스토아 철학자처럼 일주일 산다면?'], { size: 58, sw: 12, fill: YEL });
    const fs = 34; const rows = [LIST7.slice(0, 4), LIST7.slice(4)];
    let n = 0;
    rows.forEach((row, r) => {
      const ws = row.map(s => s.length * fs * 0.92 + 48), gap = 30, tot = ws.reduce((p, c) => p + c, 0) + gap * (row.length - 1);
      let x = 960 - tot / 2;
      row.forEach((it, i) => { h += pop(t, t - lt + 0.2 + n * 0.32, t + 99, f1(x + ws[i] / 2), 260 + r * 90, label(0, 0, it, { size: fs, bg: n === 6 ? YEL : MINT }), {}); x += ws[i] + gap; n++; });
    });
    h += Z({ t, seed: 7, x: 960, y: 890, s: 0.6, pose: walkPose(t * 7, 0.6), ex: exprAt([[0, '결심']], t) });
    return h;
  }
  h += pop(t, t - lt + 0.2, t + 99, 960, 230, outlined(0, 0, [[['만약에, ', YEL], ['스토아 철학자처럼', '#fff']], '일주일 산다면?'], { size: 92, sw: 18 }), {});
  const land = 1.55, on = lt >= land, fly = easeInOut(prog(lt, 0.8, land));
  h += Z({ t, seed: 7, x: 960, y: 890, s: 0.6, pose: on ? '만세' : '서기', ex: exprAt([[0, '기본'], [land, '놀람'], [land + 0.7, '신남']], lt) });
  // v3: no costume — a 7-day Stoic notebook lands beside Zero instead
  if (lt > 0.8) { const bx = lerp(1500, 1120, fly), by = lerp(300, 806, fly) - Math.sin(fly * Math.PI) * 140, rot = lerp(-160, -6, fly), bs = lerp(0.9, 0.62, fly);
    h += `<g transform="translate(${f1(bx)} ${f1(by)}) rotate(${f1(rot)}) scale(${f1(bs * 1000) / 1000})"><rect x="-70" y="-92" width="140" height="184" rx="12" fill="#7A3E8E" stroke="${INK}" stroke-width="8"/><rect x="-70" y="-92" width="22" height="184" rx="8" fill="#5E2E70" stroke="${INK}" stroke-width="6"/><rect x="-36" y="-58" width="88" height="62" rx="8" fill="#F4F1EA" stroke="${INK}" stroke-width="5"/><text x="8" y="-14" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="${NAVY}">7일</text><path d="M-30 40 L46 40 M-30 62 L30 62" stroke="#E7D3F0" stroke-width="7" stroke-linecap="round"/></g>`; }
  if (lt > land && lt < land + 0.5) { const k = prog(lt, land, land + 0.5); h += `<circle cx="1120" cy="806" r="${f1(40 + 140 * k)}" fill="none" stroke="${YEL}" stroke-width="8" opacity="${f1((1 - k) * 100) / 100}"/>`; }
  if (lt > land) h += pop(t, t - lt + land + 0.1, t + 99, 1260, 620, label(0, 0, '스토아 7일 노트', { size: 36, bg: YEL }), { rot: 5, bob: 4 });
  return h;
}

/* ---------- myth: stoic ≠ emotionless ---------- */
function sea(t, sunset) {
  let h = BG(sunset ? 'url(#sunset)' : 'url(#morning)');
  h += sunset ? `<circle cx="1500" cy="380" r="90" fill="#FFD27A"/><circle cx="1500" cy="380" r="240" fill="url(#warm)"/>` : `<circle cx="1550" cy="180" r="70" fill="#FFF3B0"/>`;
  h += clouds(t, 90, 14, 3, 4);
  return h;
}
function waveBand(t, y, amp, c, sp, ph) { let d = `M-600 1480 L-600 ${y}`; for (let x = -600; x <= 2520; x += 40) d += ` L${x} ${f1(y + Math.sin(x / 160 + t * sp + ph) * amp)}`; return `<path d="${d} L2520 1480 Z" fill="${c}" stroke="${INK}" stroke-width="6"/>`; }
function surfer(t, x, y, s, tilt, o = {}) {
  let h = `<g transform="rotate(${f1(tilt)} ${x} ${y})">`;
  h += `<ellipse cx="${x}" cy="${y + 10}" rx="${f1(190 * s / 0.7)}" ry="${f1(26 * s / 0.7)}" fill="${o.board || YEL}" stroke="${INK}" stroke-width="7"/><line x1="${x - 150 * s / 0.7}" y1="${y + 10}" x2="${x + 150 * s / 0.7}" y2="${y + 10}" stroke="${RED}" stroke-width="5"/>`;
  h += Z(Object.assign({ t, seed: 420, x, y: y - 6, s, pose: '둥둥', ex: exprAt([[0, o.ex || '신남']], t), look: [0.4, -0.1] }, o.z || {}));
  return h + `</g>`;
}
function mythScene(t, lt, a) {
  const D = D_(a);
  if (a.surf) {
    let h = sea(t, false);
    h += waveBand(t, 640, 30, '#7DB7E0', 1.2, 0) ;
    const wy = 730 + Math.sin(t * 1.6) * 40, tilt = Math.sin(t * 1.6 + 0.6) * 9;
    h += surfer(t, 960, wy - 40, 0.7, tilt);
    h += waveBand(t, 760, 46, '#4E86B8', 1.6, 1.3);
    for (let i = 0; i < 10; i++) { const x = ((i * 230 - t * 120) % 2300 + 2300) % 2300 - 200; h += `<path d="M${f1(x)} ${f1(770 + Math.sin(x / 160 + t * 1.6 + 1.3) * 46)} q20 -18 40 0" fill="none" stroke="#fff" stroke-width="5" opacity=".7"/>`; }
    if (lt > 0.2 * D) h += pop(t, t - lt + 0.2 * D, t + 99, 520, 260, label(0, 0, '감정 = 파도', { size: 44, bg: '#7CC7FF' }), { rot: -3, bob: 4 });
    if (lt > 0.58 * D) h += pop(t, t - lt + 0.58 * D, t + 99, 1400, 260, label(0, 0, '나 = 파도 위에 선 사람', { size: 44, bg: YEL }), { rot: 3, bob: 4 });
    return h;
  }
  let h = BG('url(#cream)') + BG('url(#paper)');
  h += outlined(960, 150, [[['스토익', YEL], [' = 감정이 없다?', '#fff']]], { size: 80, sw: 15 });
  // a cold stone statue of Zero
  h += `<filter id="stone"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope=".8" intercept=".12"/><feFuncG type="linear" slope=".8" intercept=".12"/><feFuncB type="linear" slope=".8" intercept=".14"/></feComponentTransfer></filter>`;
  h += `<rect x="760" y="820" width="400" height="80" rx="8" fill="#C9C0AE" stroke="${INK}" stroke-width="7"/>`;
  h += `<g filter="url(#stone)">${Z({ t, seed: 421, x: 960, y: 830, s: 0.72, pose: '서기', ex: { expr: '결심', prev: '결심', k: 1, blink: 0 }, still: true, noBlink: true })}</g>`;
  h += `<text x="960" y="874" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="#6B6255">감정 OFF</text>`;
  if (lt > 0.55 * D) {
    const k = easeOutBack(prog(lt, 0.55 * D, 0.55 * D + 0.35));
    h += `<g transform="translate(960 560) scale(${f1(k * 1000) / 1000})"><line x1="-230" y1="-230" x2="230" y2="230" stroke="${RED}" stroke-width="34" stroke-linecap="round"/><line x1="230" y1="-230" x2="-230" y2="230" stroke="${RED}" stroke-width="34" stroke-linecap="round"/></g>`;
    h += pop(t, t - lt + 0.6 * D, t + 99, 1460, 520, label(0, 0, '흔한 오해!', { size: 46, bg: PINK, color: '#fff' }), { rot: 5, bob: 4 });
  }
  return h;
}

/* ---------- MON · what is up to me ---------- */
function crate(x, y, title, c, n) {
  let h = `<g transform="translate(${x} ${y})"><path d="M-210 -40 L210 -40 L190 150 L-190 150 Z" fill="#B57D48" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  for (let i = 0; i < 3; i++) h += `<line x1="${-200 + i * 4}" y1="${10 + i * 46}" x2="${200 - i * 4}" y2="${10 + i * 46}" stroke="#8A5A30" stroke-width="5"/>`;
  h += `<g transform="translate(0 70)">${label(0, 0, title, { size: 40, bg: c })}</g></g>`;
  return h;
}
const SORT = [['날씨', 'B', 0.06], ['남의 생각', 'B', 0.2], ['이미 지난 일', 'B', 0.34], ['내 판단', 'A', 0.6], ['내 행동', 'A', 0.74]];
function sortScene(t, lt, a) {
  const D = D_(a);
  let h = stoa(t, false) + BG('#fff').replace('/>', ' opacity=".35"/>');
  const AX = 1000, BX = 1500, BY = 640;
  if (!a.fly) {
    h += EP({ t, seed: 430, x: 420, y: 960, s: 0.8, pose: '손인사', ex: exprAt([[0, '결심']], t), look: [0.8, -0.2] }) + stick(520, 640, 300);
    h += quote(1150, 190, [[['“우리에게 ', '#fff'], ['달린 것', MINT], ['과', '#fff']], [['달리지 않은 것', '#C3CDD8'], ['이 있다”', '#fff']]], '— 에픽테토스, 『엥케이리디온』 1', t, lt, 0.38 * D, { size: 64 });
    h += crate(AX, BY + 120, '내 것', MINT) + crate(BX, BY + 120, '내 것 아님', '#C3CDD8');
    return h;
  }
  h += crate(AX, BY + 120, '내 것', MINT) + crate(BX, BY + 120, '내 것 아님', '#C3CDD8');
  const cnt = { A: 0, B: 0 };
  SORT.forEach(([txt, box, f], i) => {
    const t0 = f * D; if (lt < t0) return;
    const k = easeInOut(clamp((lt - t0) / 0.7, 0, 1)), bx = box === 'A' ? AX : BX, slot = cnt[box]++;
    const tx = bx + (slot % 2 ? 90 : -90), ty = BY + 20 - Math.floor(slot / 2) * 70 - (slot % 2) * 10;
    const x = lerp(1250, tx, k), y = lerp(110, ty, k) - Math.sin(k * Math.PI) * 120;
    h += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1((1 - k) * (box === 'A' ? -20 : 20))})">${label(0, 0, txt, { size: 34, bg: box === 'A' ? '#fff' : '#E6EAF0' })}</g>`;
  });
  h += Z({ t, seed: 431, x: 420, y: 960, s: 0.8, pose: lt > 0.55 * D ? '만세' : '손인사', ex: exprAt([[0, '결심'], [0.85 * D, '신남']], lt), look: [0.8, -0.3] });
  return h;
}
function cloudW(x, y, s, o = {}) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 100) / 100})"><path d="M-90 30 Q-120 30 -116 0 Q-120 -40 -76 -40 Q-66 -84 -16 -76 Q16 -110 56 -76 Q100 -84 104 -40 Q136 -30 124 6 Q124 34 90 34 Z" fill="${o.fill || '#5A6478'}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><text x="0" y="12" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${o.fs || 40}" fill="#fff">${esc(o.text || '?')}</text></g>`; }
const WORRIES = [['실수하면?', 620, 300], ['망신당하면?', 980, 220], ['늦으면?', 1340, 300], ['아프면?', 820, 440], ['잘리면?', 1180, 430]];
function worryScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#nightRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".3"/>');
  h += windowNight(1480, 520, 300, 240, t);
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#10152B"/>`;
  h += `<circle cx="420" cy="700" r="260" fill="url(#amber)" opacity=".7"/>`;
  h += Z({ t, seed: 440, x: 900, y: 940, s: 0.8, pose: '책상', ex: exprAt([[0, a.pop ? '걱정' : '걱정'], [a.pop ? 2.8 : 99, '신남']], lt), look: [0, a.pop ? -0.7 : 0.6], light: 1, shade: '#C9D9F0' });
  h += `<rect x="440" y="760" width="980" height="40" rx="10" fill="#6B4A2E" stroke="${INK}" stroke-width="8"/><rect x="480" y="800" width="900" height="300" fill="#5A3E26" stroke="${INK}" stroke-width="8"/>`;
  h += notebook(800, 742, 1.0, -80) + candle(520, 760, t);
  WORRIES.forEach(([txt, x, y], i) => {
    const bob = Math.sin(t * 1.5 + i) * 10;
    if (!a.pop) { if (lt > 0.2 * D + i * 0.12 * D) h += pop(t, t - lt + 0.2 * D + i * 0.12 * D, t + 99, x, y + bob, cloudW(0, 0, 1, { text: txt, fs: 34 }), {}); return; }
    if (i === 4) { h += pop(t, t - 9, t + 99, x, y + bob, cloudW(0, 0, lerp(1, 0.55, prog(lt, 0.8, 2.4)), { text: txt, fs: 34 }), {}) + (lt > 2.4 ? pop(t, t - lt + 2.4, t + 99, x + 110, y - 40, label(0, 0, '9%', { size: 32, bg: '#C3CDD8' }), {}) : ''); return; }
    const tp = 0.8 + i * 0.5;
    if (lt < tp) h += `<g transform="translate(${x} ${f1(y + bob)})">${cloudW(0, 0, 1 + 0.15 * prog(lt, tp - 0.3, tp), { text: txt, fs: 34 })}</g>`;
    else if (lt < tp + 0.5) { const k = prog(lt, tp, tp + 0.5); for (let j = 0; j < 8; j++) { const ang = j * 0.785; h += `<circle cx="${f1(x + Math.cos(ang) * 120 * k)}" cy="${f1(y + Math.sin(ang) * 80 * k)}" r="${f1(16 * (1 - k))}" fill="#C3CDD8" opacity="${f1((1 - k) * 100) / 100}"/>`; } }
  });
  if (!a.pop && lt > 0.2 * D) h += pop(t, t - lt + 0.2 * D, t + 99, 330, 160, label(0, 0, '걱정 일기 · 10일', { size: 38, bg: YEL }), { rot: -3, bob: 3 });
  if (a.pop) h += quote(960, 120, [[['“우리는 현실보다 ', '#fff'], ['상상', YEL], ['에서', '#fff']], '더 자주 괴로워한다”'], '— 세네카, 『도덕 서한』 13', t, lt, 0.3, { size: 56, sw: 12, srcDy: 120 });
  return h;
}

/* ---------- TUE · morning rehearsal ---------- */
function mirrorRoom(t) {
  let h = BG('url(#dayRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".25"/>');
  h += windowDay(1380, 150, 360, 280, t) + `<circle cx="1560" cy="290" r="220" fill="url(#warm)" opacity=".6"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#C9AE8C"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  return h;
}
function morningScene(t, lt, a) {
  const D = D_(a);
  let h = mirrorRoom(t);
  if (a.kind) {
    h += BG('#FFE9A8').replace('/>', ' opacity=".25"/>');
    const people = [[480, '#7CC7FF', '#2A2A2A'], [800, null, null], [1120, '#FF8FB1', '#6B3E26'], [1440, '#B38CFF', '#3A3A3A']];
    people.forEach(([x, c, hair], i) => {
      const k = easeOutBack(clamp((lt - 0.02 * D - i * 0.1 * D) / 0.4, 0, 1)); if (k <= 0) return;
      const pose = { armL: [[148, 285], [110, 330], [70, 360]], hL: [62, 364], armR: [[252, 285], [290, 330], [330, 360]], hR: [338, 364], legL: P['서기'].legL, legR: P['서기'].legR, fL: P['서기'].fL, fR: P['서기'].fR, dy: 0 };
      const ch = c ? char({ t, seed: 450 + i, x, y: 930, s: 0.72, pose, ex: { expr: '신남', prev: '신남', k: 1, blink: 0 }, goggles: 'none', vest: c, patch: false, tee: true, hair }) : Z({ t, seed: 450, x, y: 930, s: 0.72, pose, ex: exprAt([[0, '신남']], t) });
      h += `<g opacity="${f1(clamp(k, 0, 1) * 100) / 100}" transform="translate(0 ${f1((1 - clamp(k, 0, 1)) * 40)})">${ch}</g>`;
    });
    if (lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 960, 230, outlined(0, 0, [[['“우리는 ', '#fff'], ['서로 돕기 위해', YEL]], '태어났다”'], { size: 76, sw: 14 }), {});
    h += card(220, 250, 0.62, 'MA', t);
    for (let i = 0; i < 6; i++) { const k = ((t * 0.3 + i / 6) % 1); h += `<g opacity="${f1(Math.sin(k * Math.PI) * 80) / 100}">${heart(300 + i * 260, 760 - k * 300, 1.1, [PINK, YEL, MINT][i % 3])}</g>`; }
    return h;
  }
  // mirror
  h += `<rect x="1020" y="200" width="420" height="560" rx="200" fill="#DFF4FF" stroke="#8C6638" stroke-width="18"/><path d="M1080 300 L1160 240 M1100 360 L1220 260" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".7"/>`;
  h += `<clipPath id="mirC"><rect x="1029" y="209" width="402" height="542" rx="192"/></clipPath><g opacity=".55" clip-path="url(#mirC)">${flip(1230, Z({ t, seed: 451, x: 1230, y: 730, s: 0.62, pose: '서기', ex: exprAt([[0, '결심']], t), look: [-0.3, 0] }))}</g>`;
  h += `<rect x="1020" y="200" width="420" height="560" rx="200" fill="none" stroke="#8C6638" stroke-width="18"/>`;
  h += Z({ t, seed: 451, x: 760, y: 990, s: 0.82, pose: '서기', ex: exprAt([[0, '결심']], t), look: [0.8, -0.2] });
  h += card(240, 270, 0.7, 'MA', t, '『명상록』 2권 1절');
  // the sticky note of who we'll meet today
  if (lt > 0.4 * D) {
    h += pop(t, t - lt + 0.4 * D, t + 99, 1680, 560, `<rect x="-170" y="-200" width="340" height="400" fill="#FFF6A8" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="-200" r="14" fill="${RED}" stroke="${INK}" stroke-width="4"/><text x="0" y="-130" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="${NAVY}">오늘 만날 사람</text>`, { rot: 4 });
    [['참견하는 사람', 0.5], ['고마워할 줄 모르는 사람', 0.62], ['무례한 사람', 0.78]].forEach(([txt, f], i) => { if (lt > f * D) h += pop(t, t - lt + f * D, t + 99, 1680, 470 + i * 90, `<text x="0" y="10" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${txt.length > 8 ? 25 : 32}" fill="${RED}">✓ ${esc(txt)}</text>`, { rot: 4 }); });
  }
  return h;
}
function officeScene(t, lt, a) {
  const D = D_(a);
  let h = BG('#DDE6EE') + BG('url(#hatch)').replace('/>', ' opacity=".2"/>');
  h += windowDay(1300, 130, 420, 300, t);
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#9AA6B6"/>`;
  const msg = lt > 0.42 * D, calm = lt > 0.56 * D;
  h += Z({ t, seed: 460, x: 860, y: 960, s: 0.8, pose: '책상', ex: exprAt([[0, '기본'], [0.42 * D, '놀람'], [0.56 * D, '결심'], [0.8 * D, '신남']], lt), look: [0.5, 0.4] });
  if (calm) { const k = easeOut(prog(lt, 0.56 * D, 0.56 * D + 0.6)); h += `<ellipse cx="860" cy="600" rx="${f1(250 * k)}" ry="${f1(300 * k)}" fill="${MINT}" opacity=".16" stroke="${MINT}" stroke-width="6" stroke-opacity=".6"/>`; }
  h += `<rect x="420" y="740" width="1000" height="40" rx="10" fill="#8C6638" stroke="${INK}" stroke-width="8"/><rect x="460" y="780" width="920" height="320" fill="#7A5A32" stroke="${INK}" stroke-width="8"/>`;
  h += `<g transform="translate(1180 660)"><rect x="-130" y="-90" width="260" height="170" rx="12" fill="#1F2D44" stroke="${INK}" stroke-width="7"/><rect x="-116" y="-76" width="232" height="142" rx="6" fill="url(#screen)"/><rect x="-150" y="80" width="300" height="16" rx="6" fill="#3A4A66" stroke="${INK}" stroke-width="5"/></g>`;
  h += pop(t, t - lt + 0.1, t + 99, 330, 250, label(0, 0, '아침에 미리 각오함 ✓', { size: 36, bg: YEL }), { rot: -3, bob: 3 });
  if (msg) h += pop(t, t - lt + 0.42 * D, t + 99, 1340, 380, `<rect x="-310" y="-80" width="620" height="160" rx="24" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="-240" cy="0" r="40" fill="${RED}" stroke="${INK}" stroke-width="5"/><text x="-240" y="14" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="40" fill="#fff">!</text><text x="-176" y="-12" font-family="${FONT}" font-weight="900" font-size="32" fill="${NAVY}">이거 왜 이렇게 했어요?</text><text x="-176" y="36" font-family="${FONT}" font-weight="900" font-size="32" fill="${RED}">다시 하세요.</text>`, { rot: 2, bob: 3 });
  if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 860, 230, label(0, 0, '예상했던 일이다', { size: 42, bg: MINT }), { rot: -2, bob: 4 });
  return h;
}

/* ---------- WED · voluntary discomfort ---------- */
function bread(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-70 20 Q-80 -40 0 -46 Q80 -40 70 20 Z" fill="#C9965A" stroke="${INK}" stroke-width="6"/><path d="M-40 -20 L-30 -34 M0 -24 L8 -38 M36 -18 L44 -30" stroke="#8A5A2A" stroke-width="5" stroke-linecap="round"/></g>`; }
function cup(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-34 -50 L34 -50 L26 40 L-26 40 Z" fill="#DFF4FF" fill-opacity=".8" stroke="${INK}" stroke-width="6"/><path d="M-30 -10 L30 -10 L26 40 L-26 40 Z" fill="#7DB7E0" opacity=".7"/></g>`; }
function discomfortScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#dayRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".25"/>');
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#B79A7A"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  if (!a.ask) {
    // a rich villa corner fading out
    h += column(260, 260, 860, 60) + column(1660, 260, 860, 60);
    h += coins(330, 870, 15) + coins(1580, 870, 10);
    h += SE({ t, seed: 470, x: 760, y: 960, s: 0.8, pose: '손인사', ex: exprAt([[0, '결심']], t), look: [0.8, 0] });
    h += `<rect x="1020" y="740" width="460" height="30" rx="8" fill="#8C6638" stroke="${INK}" stroke-width="7"/><rect x="1050" y="770" width="24" height="110" fill="#7A5A32" stroke="${INK}" stroke-width="5"/><rect x="1426" y="770" width="24" height="110" fill="#7A5A32" stroke="${INK}" stroke-width="5"/>`;
    h += pop(t, t - lt + 0.1, t + 99, 760, 200, label(0, 0, '로마의 큰 부자 · 네로의 스승', { size: 36, bg: YEL }), { rot: -2, bob: 3 });
    if (lt > 0.3 * D) h += pop(t, t - lt + 0.3 * D, t + 99, 1250, 400, label(0, 0, '며칠씩', { size: 40, bg: '#fff' }), { rot: 3, bob: 3 });
    if (lt > 0.45 * D) { h += pop(t, t - lt + 0.45 * D, t + 99, 1170, 712, bread(0, 0, 0.9), {}) + pop(t, t - lt + 0.5 * D, t + 99, 1340, 700, cup(0, 0, 0.9), {}); h += pop(t, t - lt + 0.5 * D, t + 99, 1250, 520, label(0, 0, '가장 싼 음식', { size: 38, bg: '#FFC56E' }), { rot: -2 }); }
    if (lt > 0.7 * D) h += pop(t, t - lt + 0.7 * D, t + 99, 1600, 620, label(0, 0, '거친 옷', { size: 38, bg: '#C9B89A' }), { rot: 3 });
    return h;
  }
  // Zero tries it: dry bread on a straw mat (v3: no costume, orange tee)
  h += `<rect x="560" y="860" width="760" height="40" rx="10" fill="#D9C27A" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 14; i++) h += `<line x1="${580 + i * 52}" y1="864" x2="${600 + i * 52}" y2="896" stroke="#B89A4A" stroke-width="4"/>`;
  const x = 940, y = 900, s = 0.8;
  h += Z({ t, seed: 471, x, y, s, pose: '폰보기', ex: exprAt([[0, '지침'], [0.55 * D, '놀람'], [0.75 * D, '신남']], lt), look: [0, lt > 0.55 * D ? -0.6 : 0.8] });
  const [px, py] = handG(x, y, s, [200, 318]);
  h += bread(px, py - 4, 0.55) + hand(px - 26, py + 8, s) + hand(px + 26, py + 8, s) + cup(1150, 840, 0.8);
  h += quote(960, 140, [[['“이게 내가 ', '#fff'], ['두려워하던', YEL], [' 그것인가?”', '#fff']]], '— 세네카, 『도덕 서한』 18', t, lt, 0.25 * D, { size: 66 });
  if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 1380, 520, bubble(0, 0, 360, 120, `<text x="0" y="14" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="40" fill="${NAVY}">…생각보다 괜찮네?</text>`), { rot: 3, bob: 4 });
  return h;
}
function choc(x, y, s, bitten) { let h = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-70" y="-44" width="140" height="88" rx="8" fill="#6B3A1E" stroke="${INK}" stroke-width="6"/>`; for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) h += `<rect x="${-60 + c * 42}" y="${-34 + r * 36}" width="36" height="30" rx="4" fill="#7E4A28" stroke="#4A2412" stroke-width="3"/>`; if (bitten) h += `<circle cx="70" cy="-44" r="26" fill="#fff"/>`; return h + `</g>`; }
function chocoScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#cream)') + BG('url(#paper)');
  const G = [['1주일 끊기', MINT, 0, 0.95], ['실컷 먹기', PINK, 1, 0.45], ['평소대로', '#C3CDD8', 0, 0.5]];
  G.forEach(([name, c, many, val], i) => {
    const x = 380 + i * 580, k = a.res ? 1 : easeOutBack(clamp((lt - 0.03 * D - i * 0.15 * D) / 0.4, 0, 1));
    if (k <= 0) return;
    let g = `<rect x="-250" y="-250" width="500" height="470" rx="28" fill="#fff" stroke="${INK}" stroke-width="8"/><g transform="translate(0 -200)">${label(0, 0, name, { size: 40, bg: c })}</g>`;
    if (i === 0) g += choc(0, -40, 1.1) + (a.res ? '' : `<g transform="translate(0 -40)"><circle r="110" fill="none" stroke="${RED}" stroke-width="14"/><line x1="-78" y1="-78" x2="78" y2="78" stroke="${RED}" stroke-width="14" stroke-linecap="round"/></g>`);
    if (i === 1) for (let j = 0; j < 6; j++) g += choc(-110 + (j % 3) * 110, -90 + Math.floor(j / 3) * 100, 0.75, j === 2);
    if (i === 2) g += choc(0, -40, 1.1, true);
    if (a.res) {
      const hh = 150 * val * easeOut(prog(lt, 0.1 * D + i * 0.12 * D, 0.45 * D + i * 0.12 * D));
      g += `<rect x="-60" y="${f1(190 - hh)}" width="120" height="${f1(hh)}" rx="10" fill="${c}" stroke="${INK}" stroke-width="6"/><line x1="-200" y1="190" x2="200" y2="190" stroke="${INK}" stroke-width="5"/>`;
      g = g.replace(choc(0, -40, 1.1), choc(0, -60, 0.8));
    } else g += `<text x="0" y="170" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="30" fill="#6B6255">일주일 동안</text>`;
    h += `<g transform="translate(${x} 470) scale(${f1(clamp(k, 0, 1.1) * 1000) / 1000})">${g}</g>`;
  });
  if (a.res) {
    h += `<text x="960" y="770" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="${NAVY}">일주일 뒤 다시 맛본 초콜릿 · 음미한 정도</text>`;
    if (lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 380, 130, label(0, 0, '가장 맛있게 · 기분 ↑', { size: 38, bg: YEL }), { rot: -3, bob: 4 });
  }
  h += srcText(960, 820, 'Quoidbach & Dunn, Social Psychological and Personality Science (2013)', { size: 26 });
  return h;
}

/* ---------- THU · the view from above ---------- */
function aboveScene(t, lt, a) {
  const D = D_(a);
  const kB = prog(lt, 0.26 * D, 0.36 * D), kC = prog(lt, 0.52 * D, 0.62 * D);
  let h = '';
  // stage A: grumpy at the desk
  if (kB < 1) {
    const z = lerp(1.0, 0.55, easeIn(prog(lt, 0, 0.36 * D)));
    let s = BG('#DDE6EE') + `<rect x="-600" y="880" width="3120" height="600" fill="#9AA6B6"/>`;
    s += Z({ t, seed: 480, x: 960, y: 960, s: 0.8, pose: '턱괴기', ex: exprAt([[0, '화남']], t), look: [0, 0.3] });
    s += `<rect x="520" y="740" width="880" height="40" rx="10" fill="#8C6638" stroke="${INK}" stroke-width="8"/><rect x="560" y="780" width="800" height="320" fill="#7A5A32" stroke="${INK}" stroke-width="8"/>`;
    s += `<g transform="translate(960 320)">${cloudW(0, 0, 1.3, { fill: '#5A6478', text: '짜증!', fs: 46 })}</g>`;
    h += `<g opacity="${f1((1 - kB) * 100) / 100}" transform="translate(960 600) scale(${f1(z * 1000) / 1000}) translate(-960 -600)">${s}</g>`;
  }
  // stage B: an office building, one tiny lit window
  if (kB > 0 && kC < 1) {
    const z = lerp(1.6, 0.8, easeInOut(prog(lt, 0.26 * D, 0.62 * D)));
    let s = BG('url(#morning)') + `<rect x="-600" y="900" width="3120" height="600" fill="#8CCB7A"/>`;
    s += `<rect x="660" y="140" width="600" height="760" fill="#A9C3DA" stroke="${INK}" stroke-width="8"/>`;
    for (let r = 0; r < 10; r++) for (let c = 0; c < 6; c++) { const hi = r === 6 && c === 3; s += `<rect x="${690 + c * 95}" y="${170 + r * 72}" width="60" height="46" fill="${hi ? '#FFE9A8' : '#E8F4FF'}" stroke="${hi ? RED : 'none'}" stroke-width="5"/>`; }
    s += `<g transform="translate(${690 + 3 * 95 + 30} ${170 + 6 * 72 - 30})">${cloudW(0, 0, 0.35, { text: '짜증', fs: 40 })}</g>`;
    h += `<g opacity="${f1(kB * (1 - kC) * 100) / 100}" transform="translate(960 640) scale(${f1(z * 1000) / 1000}) translate(-960 -640)">${s}</g>`;
  }
  // stage C: the Earth from space
  if (kC > 0) {
    const z = lerp(1.35, 1.0, easeOut(prog(lt, 0.52 * D, D)));
    let s = BG('#05070F');
    for (let i = 0; i < 60; i++) s += `<circle cx="${f1(hash(i) * 1920)}" cy="${f1(hash(i + 50) * 1080)}" r="${f1(1 + hash(i + 9) * 2)}" fill="#fff" opacity="${f1((0.3 + 0.6 * Math.abs(Math.sin(t + i))) * 100) / 100}"/>`;
    s += earth(960, 560, 300, t, { marker: true, id: 'ea' });
    h += `<g opacity="${f1(kC * 100) / 100}" transform="translate(960 560) scale(${f1(z * 1000) / 1000}) translate(-960 -560)">${s}</g>`;
    if (lt > 0.66 * D) { const [mx, my] = earthPt(960, 560, 300, 'korea'); h += `<line x1="${f1(mx + 14)}" y1="${f1(my - 8)}" x2="1330" y2="330" stroke="#fff" stroke-width="4" opacity="${f1(prog(lt, 0.66 * D, 0.66 * D + 0.4) * 100) / 100}"/>` + pop(t, t - lt + 0.66 * D, t + 99, 1460, 320, label(0, 0, '여기 어딘가의 작은 짜증', { size: 34, bg: '#fff' }), { rot: -2 }); }
  }
  h += quote(960, 130, [[['“높은 곳에서 ', '#fff'], ['내려다보라', YEL], ['”', '#fff']]], '— 마르쿠스 아우렐리우스, 『명상록』', t, lt, 0.12 * D, { size: 70 });
  return h;
}
function solomonScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#cream)') + BG('url(#paper)');
  const panel = (x, title, inner, c) => `<g transform="translate(${x} 500)"><rect x="-400" y="-300" width="800" height="560" rx="30" fill="#fff" stroke="${INK}" stroke-width="8"/><g transform="translate(0 -240)">${label(0, 0, title, { size: 40, bg: c })}</g>${inner}</g>`;
  const friend = char({ t, seed: 490, x: -170, y: 230, s: 0.5, pose: '턱괴기', ex: { expr: '걱정', prev: '걱정', k: 1, blink: 0 }, goggles: 'none', vest: '#7CC7FF', patch: false, tee: true, hair: '#2A2A2A', look: [0.6, -0.2] });
  const wise = Z({ t, seed: 491, x: 130, y: 230, s: 0.5, pose: '손인사', ex: exprAt([[0, '결심']], t), look: [-0.6, -0.2] }) + bulb(150, -150, 0.8) + `<g transform="translate(-60 -110)">${label(0, 0, '이렇게 해 봐!', { size: 30, bg: MINT })}</g>`;
  h += panel(500, '친구의 고민', friend + wise, MINT);
  const third = a.third && lt > 0.32 * D;
  const mine = Z({ t, seed: 492, x: 0, y: 230, s: 0.5, pose: third ? '손인사' : '턱괴기', ex: exprAt(third ? [[0, '결심']] : [[0, '걱정']], t), look: [0, -0.4] }) +
    (third ? bulb(130, -150, 0.8) + `<g transform="translate(0 -110)">${label(0, 0, '“제로는 지금 왜 화가 났을까?”', { size: 28, bg: YEL })}</g>` : `<g transform="translate(0 -120)">${cloudW(0, 0, 0.9, { text: '@#?!', fs: 44 })}</g>`);
  h += panel(1420, '내 고민', mine, third ? YEL : '#C3CDD8');
  if (!a.third && lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 960, 120, outlined(0, 0, [[['솔로몬의 ', '#fff'], ['역설', YEL]]], { size: 72, sw: 14 }), {});
  if (third && lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 960, 120, label(0, 0, '3인칭으로 바라보자 차이가 사라졌다', { size: 40, bg: MINT }), { bob: 3 });
  h += srcText(960, 820, 'Grossmann & Kross, Psychological Science (2014)', { size: 26 });
  return h;
}

/* ---------- FRI · imagining loss ---------- */
function mugScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#dayRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".25"/>') + windowDay(1360, 150, 380, 300, t);
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#C9AE8C"/>`;
  const x = 820, y = 960, s = 0.82;
  const love = lt > 0.68 * D;
  h += Z({ t, seed: 500, x, y, s, pose: '폰보기', ex: exprAt([[0, '기본'], [0.3 * D, '걱정'], [0.68 * D, '신남']], lt), look: [0.2, love ? 0.4 : -0.4] });
  const [hx, hy] = handG(x, y, s, [200, 318]);
  h += mug(hx, hy - 12, 0.85, t) + hand(hx - 34, hy + 10, s) + hand(hx + 34, hy + 10, s);
  h += card(240, 260, 0.62, 'EP', t, '『엥케이리디온』 3');
  if (lt > 0.24 * D) {
    let g = `<g opacity=".85">${mug(-40, 10, 1.2, 0)}</g><path d="M-60 -40 L-40 0 L-62 30 L-38 70" fill="none" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-90 80 L-110 100 M20 76 L40 104" stroke="${INK}" stroke-width="6"/>`;
    h += pop(t, t - lt + 0.24 * D, t + 99, 1260, 400, bubble(0, 0, 420, 300, g + `<text x="0" y="128" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="32" fill="${NAVY}">깨질 수 있는 컵</text>`), { rot: 2, bob: 4 });
  }
  if (love) for (let i = 0; i < 5; i++) { const k = ((t * 0.4 + i / 5) % 1); h += `<g opacity="${f1(Math.sin(k * Math.PI) * 100) / 100}">${heart(hx - 120 + i * 60, hy - 80 - k * 220, 1.2, [PINK, YEL, MINT][i % 3])}</g>`; }
  return h;
}
function coupleScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#sunset)') + `<circle cx="1450" cy="430" r="90" fill="#FFD27A"/><circle cx="1450" cy="430" r="230" fill="url(#warm)"/>` + clouds(t, 80, 14, 3, 6) + `<rect x="-600" y="800" width="3120" height="700" fill="#9BCF84" stroke="${INK}" stroke-width="6"/>` + trees2(0, 800, t, true);
  // bench
  h += `<rect x="600" y="760" width="720" height="30" rx="8" fill="#8C6638" stroke="${INK}" stroke-width="7"/><rect x="600" y="680" width="720" height="26" rx="8" fill="#8C6638" stroke="${INK}" stroke-width="7"/><rect x="640" y="790" width="24" height="120" fill="#6B4A2E" stroke="${INK}" stroke-width="5"/><rect x="1256" y="790" width="24" height="120" fill="#6B4A2E" stroke="${INK}" stroke-width="5"/>`;
  const A = char({ t, seed: 510, x: 840, y: 900, s: 0.72, pose: '서기', ex: { expr: a.res ? '신남' : '기본', prev: a.res ? '신남' : '기본', k: 1, blink: 0 }, goggles: 'none', vest: '#7CC7FF', patch: false, tee: true, hair: '#2A2A2A', look: [0.6, 0] });
  const B = char({ t, seed: 511, x: 1080, y: 900, s: 0.72, pose: '서기', ex: { expr: a.res ? '신남' : '기본', prev: a.res ? '신남' : '기본', k: 1, blink: 0 }, goggles: 'none', vest: '#FF8FB1', patch: false, tee: true, hair: '#6B3E26', longHair: '#6B3E26', ribbon: '#FFD25A', lashes: true, dress: '#FF6F9F', look: [-0.6, 0] });
  h += A + B;
  if (!a.res) {
    if (lt > 0.4 * D) {
      const k = prog(lt, 0.6 * D, 0.95 * D);
      let g = `<path d="M0 90 L0 20 M0 20 L-110 -60 M0 20 L110 -60" stroke="#C9B89A" stroke-width="22" stroke-linecap="round" fill="none"/>`;
      g += `<g transform="translate(${f1(-60 - 50 * k)} ${f1(-40 - 30 * k)})">${heart(0, 0, 1.1, '#7CC7FF')}</g><g transform="translate(${f1(60 + 50 * k)} ${f1(-40 - 30 * k)})">${heart(0, 0, 1.1, PINK)}</g>`;
      h += pop(t, t - lt + 0.4 * D, t + 99, 960, 360, bubble(0, 0, 520, 280, g + `<text x="0" y="128" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="32" fill="${NAVY}">만약 못 만났다면?</text>`), { bob: 4 });
    }
  } else {
    for (let i = 0; i < 8; i++) { const k = ((t * 0.3 + i / 8) % 1); h += `<g opacity="${f1(Math.sin(k * Math.PI) * 100) / 100}">${heart(860 + i * 30, 640 - k * 380, 1.3, [PINK, YEL, MINT][i % 3])}</g>`; }
    const k = easeOut(prog(lt, 0.1 * D, 0.5 * D));
    h += `<g transform="translate(1560 560)"><rect x="-56" y="-300" width="112" height="300" rx="56" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-40" y="${f1(-12 - 270 * (0.45 + 0.45 * k))}" width="80" height="${f1(270 * (0.45 + 0.45 * k))}" rx="40" fill="${PINK}"/><g transform="translate(0 52)">${label(0, 0, '관계 만족도', { size: 30, bg: '#fff' })}</g></g>`;
    h += srcText(960, 150, 'Koo, Algoe, Wilson & Gilbert, J. Pers. Soc. Psychol. (2008)', { size: 26, color: '#3A2A1A' });
    if (lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 520, 300, label(0, 0, '있는 것을 잠시 빼 보기', { size: 40, bg: YEL }), { rot: -3, bob: 4 });
  }
  return h;
}

/* ---------- SAT · memento mori ---------- */
function mementoScene(t, lt, a) {
  const D = D_(a);
  if (a.call) {
    let h = mirrorRoom(t) + BG('#FF9A5A').replace('/>', ' opacity=".12"/>');
    if (lt < 0.55 * D) h += pop(t, t - lt + 0.2, t + 99, 960, 200, label(0, 0, '너무 자주는 말고, 딱 한 번만', { size: 40, bg: '#fff' }), { rot: -2 });
    const calling = lt > 0.6 * D;
    h += Z({ t, seed: 520, x: 900, y: 990, s: 0.82, pose: calling ? '통화' : '서기', ex: exprAt([[0, '기본'], [0.6 * D, '신남']], lt), look: [0.5, -0.1] });
    if (calling) {
      const [hx, hy] = handG(900, 990, 0.82, [256, 190]);
      h += phone(hx + 4, hy + 4, 0.36, { on: 1, rot: 20 }) + hand(hx, hy, 0.82);
      h += pop(t, t - lt + 0.7 * D, t + 99, 1360, 380, bubble(0, 0, 520, 130, `<text x="0" y="14" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="38" fill="${NAVY}">엄마, 그냥… 보고 싶어서.</text>`), { rot: 2, bob: 4 });
      for (let i = 0; i < 5; i++) { const k = ((t * 0.35 + i / 5) % 1); h += `<g opacity="${f1(Math.sin(k * Math.PI) * 100) / 100}">${heart(780 + i * 60, 560 - k * 260, 1.1, [PINK, YEL, MINT][i % 3])}</g>`; }
    }
    return h;
  }
  let h = stoa(t, true) + BG('#2A1F4A').replace('/>', ' opacity=".35"/>');
  h += MA({ t, seed: 521, x: 620, y: 980, s: 0.82, pose: '손인사', ex: exprAt([[0, '결심']], t), look: [0.6, -0.3] });
  h += hourglass(1300, 620, 1.4, t * 0.5);
  h += pop(t, t - lt + 0.2, t + 99, 1300, 380, label(0, 0, 'MEMENTO MORI', { size: 44, bg: '#fff' }), { bob: 3 });
  h += quote(960, 140, [[['“지금 당장이라도 ', '#fff'], ['삶을 떠날 수 있다는 듯이', YEL], ['”', '#fff']]], '— 마르쿠스 아우렐리우스, 『명상록』 2권 11절', t, lt, 0.3 * D, { size: 58, sw: 12 });
  return h;
}
function gratScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#cream)') + BG('url(#paper)');
  h += `<text x="960" y="150" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="54" fill="${NAVY}">감사하는 마음의 변화</text>`;
  const Y0 = 520;
  h += `<line x1="300" y1="${Y0}" x2="1620" y2="${Y0}" stroke="${INK}" stroke-width="6"/>`;
  const G = [['자기 죽음을 생생하게 상상', 1, MINT, 0.05], ['죽음에 대해 글쓰기', 0.04, '#C3CDD8', 0.3], ['평범한 하루 떠올리기', -0.25, PINK, 0.62]];
  G.forEach(([name, v, c, f], i) => {
    const x = 520 + i * 440, k = easeOut(prog(lt, f * D, f * D + 1.0)), hh = 260 * v * k;
    h += `<rect x="${x - 80}" y="${f1(v >= 0 ? Y0 - hh : Y0)}" width="160" height="${f1(Math.max(4, Math.abs(hh)))}" rx="12" fill="${c}" stroke="${INK}" stroke-width="6"/>`;
    h += `<text x="${x}" y="${Y0 + (v < 0 ? 120 : 60)}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="30" fill="${NAVY}">${esc(name)}</text>`;
    if (k > 0.9) h += `<text x="${x}" y="${f1(v >= 0 ? Y0 - hh - 24 : Y0 - 24)}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="44" fill="${v > 0.5 ? '#2FB37A' : (v < 0 ? RED : '#6B6255')}">${v > 0.5 ? '크게 ↑' : (v < 0 ? '조금 ↓' : '변화 없음')}</text>`;
  });
  h += srcText(960, 820, 'Frias, Watkins, Webber & Froh, J. Positive Psychology (2011) · 효과는 일시적', { size: 26 });
  h += Z({ t, seed: 522, x: 1800, y: 1010, s: 0.42, pose: '서기', ex: exprAt([[0, '놀람']], t), look: [-0.8, -0.3] });
  return h;
}

/* ---------- SUN · evening review ---------- */
function oilLamp(x, y, on, t) { const fl = 1 + Math.sin(t * 13) * 0.06; return `<g transform="translate(${x} ${y})">${on ? `<circle cx="40" cy="-60" r="${f1(220 * fl)}" fill="url(#amber)" opacity=".85"/>` : ''}<path d="M-60 0 Q-40 -40 30 -36 L70 -50 L60 -30 Q40 4 -20 8 Z" fill="#C9A46A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>${on ? `<path d="M68 ${f1(-110 * fl)} Q84 -76 68 -56 Q52 -76 68 ${f1(-110 * fl)} Z" fill="#FFB547" stroke="${INK}" stroke-width="4"/>` : `<path d="M68 -60 q10 -20 -4 -40 q-10 -16 6 -34" fill="none" stroke="#C3CDD8" stroke-width="5" opacity=".7"/>`}</g>`; }
function reviewScene(t, lt, a) {
  const D = D_(a);
  if (a.study) {
    let h = BG('#DDE6EE') + `<rect x="-600" y="880" width="3120" height="600" fill="#9AA6B6"/>`;
    for (let i = 0; i < 3; i++) {
      const x = 420 + i * 540;
      h += char({ t, seed: 530 + i, x, y: 930, s: 0.66, pose: '책상', ex: { expr: '결심', prev: '결심', k: 1, blink: 0 }, goggles: 'none', vest: ['#7CC7FF', '#FF8FB1', '#B38CFF'][i], patch: false, tee: true, hair: ['#2A2A2A', '#6B3E26', '#3A3A3A'][i], look: [0, 0.6] });
      const [hx, hy] = headOf(x, 930, 0.66);
      h += `<path d="M${hx - 80} ${hy} Q${hx} ${hy - 110} ${hx + 80} ${hy}" fill="none" stroke="${INK}" stroke-width="8"/><circle cx="${hx - 82}" cy="${hy + 4}" r="16" fill="${INK}"/><path d="M${hx - 82} ${hy + 10} Q${hx - 70} ${hy + 50} ${hx - 30} ${hy + 56}" fill="none" stroke="${INK}" stroke-width="5"/>`;
      h += `<rect x="${x - 230}" y="740" width="460" height="34" rx="8" fill="#8C6638" stroke="${INK}" stroke-width="7"/><rect x="${x - 210}" y="774" width="420" height="330" fill="#7A5A32" stroke="${INK}" stroke-width="7"/>` + notebook(x + 40, 726, 0.8, -80);
    }
    h += pop(t, t - lt + 0.3, t + 99, 960, 200, `<g>${wallClock(-250, 0, 60, 6, 15)}${label(60, 0, '하루 15분 · 돌아보며 적기', { size: 42, bg: YEL })}</g>`, { bob: 3 });
    return h;
  }
  let h = BG('url(#nightRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".3"/>');
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#10152B"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  const on = lt < 0.12 * D;
  h += `<rect x="1400" y="700" width="230" height="180" rx="10" fill="#5A3E2C" stroke="${INK}" stroke-width="7"/>` + oilLamp(1500, 700, on, t);
  h += `<rect x="420" y="540" width="920" height="300" rx="34" fill="#3B4A7A" stroke="${INK}" stroke-width="9"/><rect x="450" y="570" width="860" height="40" rx="14" fill="#4E5F96"/><rect x="390" y="790" width="980" height="110" rx="26" fill="#E3E8F4" stroke="${INK}" stroke-width="9"/>`;
  h += `<ellipse cx="620" cy="770" rx="150" ry="46" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
  h += Z({ t, seed: 535, x: 860, y: 900, s: 0.74, pose: '폰보기', ex: exprAt([[0, '결심']], t), look: [0, 0.8], light: 1, shade: '#C9D9F0' });
  const [px, py] = handG(860, 900, 0.74, [200, 318]);
  h += notebook(px, py - 6, 0.9, 0) + hand(px - 30, py + 8, 0.74) + hand(px + 30, py + 8, 0.74);
  h += blanket(800);
  if (!on) h += BG('#000').replace('/>', ' opacity=".22"/>');
  h += card(220, 250, 0.6, 'SE', t, '『분노에 대하여』 3권 36절');
  [['오늘 고친 나쁜 습관은?', 0.32], ['내일은 어디서 더 나아질까?', 0.66]].forEach(([q, f], i) => { if (lt > f * D) h += pop(t, t - lt + f * D, t + 99, 1240, 300 + i * 110, label(0, 0, q, { size: 38, bg: i ? MINT : YEL }), { rot: i ? 2 : -2, bob: 3 }); });
  return h;
}

/* ---------- the whole week ---------- */
function stoicweekScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#labG)') + BG('url(#grid)');
  h += earth(560, 470, 250, t, { id: 'ew' });
  for (let i = 0; i < 26; i++) { const ang = hash(i) * 6.28, r = 40 + hash(i + 7) * 190; h += `<circle cx="${f1(560 + Math.cos(ang) * r)}" cy="${f1(470 + Math.sin(ang) * r)}" r="${f1(6 + Math.sin(t * 3 + i) * 2)}" fill="${YEL}" stroke="${INK}" stroke-width="2" opacity="${f1(clamp((lt - i * 0.08) * 2, 0, 1) * 100) / 100}"/>`; }
  h += pop(t, t - lt + 0.2, t + 99, 560, 160, label(0, 0, 'Stoic Week · 온라인 일주일 실험', { size: 36, bg: YEL }), {});
  if (!a.note) {
    const kc = 1 - prog(lt, 0.56 * D, 0.62 * D);
    if (kc > 0) { // the week ticking by
      const done = Math.floor(clamp((lt - 0.8) / (0.5 * D - 0.8) * 7, 0, 7));
      let cal = `<rect x="-300" y="-120" width="600" height="250" rx="22" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-300" y="-120" width="600" height="64" rx="22" fill="${PURPLE}" stroke="${INK}" stroke-width="7"/><text x="0" y="-76" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="#fff">일주일</text>`;
      ['월', '화', '수', '목', '금', '토', '일'].forEach((d, i) => { const x = -258 + i * 74; cal += `<rect x="${x}" y="-36" width="64" height="130" rx="10" fill="${i < done ? MINT : '#EEF2F6'}" stroke="${INK}" stroke-width="4"/><text x="${x + 32}" y="4" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="28" fill="${NAVY}">${d}</text>${i < done ? `<path d="M${x + 16} 52 L${x + 28} 66 L${x + 50} 36" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` : ''}`; });
      h += `<g transform="translate(1300 440)" opacity="${f1(kc * 100) / 100}">${cal}</g>`;
    }
    if (lt > 0.62 * D) {
      h += pop(t, t - lt + 0.62 * D, t + 99, 1300, 420, `<text x="0" y="40" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="190" fill="#fff" stroke="${INK}" stroke-width="3">+12%</text>`, {});
      h += pop(t, t - lt + 0.62 * D + 0.3, t + 99, 1300, 560, label(0, 0, '삶의 만족도 (2018년 참가자 · 자기 보고)', { size: 32, bg: MINT }), {});
    }
  } else {
    h += `<text x="1300" y="460" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="190" fill="#fff" opacity=".15">+12%</text>`;
    h += pop(t, t - lt + 0.2, t + 99, 1300, 400, `<g transform="rotate(-8)"><rect x="-330" y="-70" width="660" height="140" rx="16" fill="#0B1626" fill-opacity=".9" stroke="${RED}" stroke-width="10"/><text x="0" y="-8" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="40" fill="${RED}">비교 그룹 없음</text><text x="0" y="44" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="36" fill="${RED}">스스로 답한 설문</text></g>`, {});
  }
  h += srcText(960, 820, 'Modern Stoicism, Stoic Week 2018 Report (LeBon)', { size: 26, color: '#9CB3C8' });
  h += Z({ t, seed: 540, x: 1660, y: 1000, s: 0.5, pose: a.note ? '턱괴기' : '만세', ex: exprAt([[0, a.note ? '결심' : '신남']], t), look: [-0.7, -0.4] });
  return h;
}
const RECAP7 = [['월', '내 것과 내 것 아닌 것 나누기'], ['화', '아침에 미리 마음먹기'], ['수', '일부러 불편하게 지내기'], ['목', '위에서 내려다보기'], ['금', '잃는 상상 하기'], ['토', '메멘토 모리'], ['일', '잠들기 전 하루 돌아보기']];
function recapScene(t, lt, a) {
  let h = BG(NAVY) + BG('url(#grid)');
  h += outlined(960, 110, ['만약에, 스토아 철학자처럼 일주일 산다면?'], { size: 56, sw: 12, fill: YEL });
  RECAP7.forEach((it, i) => {
    if (i >= a.k) return;
    const appear = a.k === 3 ? i * 1.3 : (a.k === 7 && i >= 3 ? (i - 3) * 1.4 : -1);
    const k = a.k === 7 && i < 3 ? 1 : easeOutBack(clamp((lt - appear) / 0.4, 0, 1));
    const y = 210 + i * 92;
    h += `<g transform="translate(${f1(lerp(-300, 0, clamp(k, 0, 1.2)))} 0)" opacity="${f1(clamp(k, 0, 1) * 100) / 100}">${label(500, y, it[0], { size: 40, bg: i === 6 ? YEL : MINT })}<text x="580" y="${y + 16}" font-family="${FONT}" font-weight="900" font-size="48" fill="#fff">${esc(it[1])}</text></g>`;
  });
  h += Z({ t, seed: 15, x: 1660, y: 980, s: 0.55, pose: walkPose(t * 7, 0.6), ex: exprAt([[0, '신남']], t) });
  return h;
}

/* ---------- ending ---------- */
function bridgeScene(t, lt, a) {
  const D = D_(a);
  let h = BG('url(#sunset)') + BG('url(#dots)');
  h += NZ({ t, seed: 550, x: 420, y: 960, s: 0.76, ex: exprAt([[0, '결심']], t), look: [0.6, -0.2] }) + `<g transform="translate(420 300)">${label(0, 0, '니체 · AMOR FATI', { size: 36, bg: YEL })}</g>`;
  if (lt > 0.3 * D) {
    h += pop(t, t - lt + 0.3 * D, t + 99, 1500, 960, EP({ t, seed: 551, x: 0, y: 0, s: 0.76, pose: '손인사', ex: exprAt([[0, '결심']], t), look: [-0.6, -0.2] }) + stick(100, -300, 300), { noPop: true, inDur: 0.5 });
    h += pop(t, t - lt + 0.3 * D + 0.2, t + 99, 1500, 300, label(0, 0, '에픽테토스 · 훨씬 더 전에', { size: 36, bg: MINT }), {});
  }
  h += quote(960, 440, [[['“일어나는 ', '#fff'], ['그대로', YEL]], '일어나길 바라라”'], '— 에픽테토스, 『엥케이리디온』 8', t, lt, 0.58 * D, { size: 64, srcDy: 150 });
  h += Z({ t, seed: 552, x: 960, y: 1000, s: 0.5, pose: '서기', ex: exprAt([[0, '놀람'], [0.6 * D, '신남']], lt), look: [lt > 0.3 * D ? 0.7 : -0.7, -0.3] });
  return h;
}
function surfScene(t, lt, a) {
  const D = D_(a);
  let h = sea(t, true);
  h += waveBand(t, 640, 30, '#E0A07A', 1.2, 0);
  const wobble = Math.exp(-((lt - 0.3 * D) ** 2) / 0.8) * 28;
  const wy = 730 + Math.sin(t * 1.6) * 40, tilt = Math.sin(t * 1.6 + 0.6) * 8 + Math.sin(t * 9) * wobble;
  h += surfer(t, 960, wy - 40, 0.7, tilt, { ex: wobble > 10 ? '놀람' : '신남' });
  h += waveBand(t, 760, 46, '#B0607A', 1.6, 1.3);
  if (lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 960, 220, outlined(0, 0, [[['흔들려도, ', '#fff'], ['다시 중심으로', YEL]]], { size: 76, sw: 14 }), {});
  return h;
}
function calmroadScene(t, lt, a, run) {
  const D = D_(a);
  let h = street(t);
  const x = 700 + (run % 30) * 18, ph = t * 6;
  h += shadow(x, 1004, 70) + Z({ t, seed: 560, x, y: 1000, s: 0.8, pose: walkPose(ph, 0.75), ex: exprAt([[0, '신남']], t), look: [0.6, -0.2] });
  for (let i = 0; i < 3; i++) { const k = ((t * 0.5 + i / 3) % 1); h += `<text x="${f1(x + 60 + k * 80)}" y="${f1(560 - k * 160)}" font-family="${FONT}" font-weight="900" font-size="44" fill="#fff" stroke="${INK}" stroke-width="4" paint-order="stroke fill" opacity="${f1(Math.sin(k * Math.PI) * 100) / 100}">♪</text>`; }
  if (!a.ask) {
    if (lt > 0.1 * D) h += pop(t, t - lt + 0.1 * D, t + 99, 420, 330, outlined(0, 0, ['빵빵!'], { size: 60, sw: 12, fill: YEL }), { rot: -8, bob: 4 });
    if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 1380, 300, label(0, 0, '어떤 사람이 될지는, 내가 고른다', { size: 40, bg: MINT }), { rot: 2, bob: 4 });
  } else {
    h += crate(1500, 760, '내 것 아님', '#C3CDD8');
    h += pop(t, t - lt + 0.3, t + 99, 1240, 290, `<path d="M-380 -90 L380 -90 Q410 -90 410 -60 L410 50 Q410 80 380 80 L160 80 L120 140 L110 80 L-380 80 Q-410 80 -410 50 L-410 -60 Q-410 -90 -380 -90 Z" fill="#fff" stroke="${INK}" stroke-width="7"/><text x="0" y="12" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="40" fill="${NAVY}">오늘 무엇을 내려놓을까요?</text>`, { rot: 2, bob: 5 });
  }
  return h;
}
