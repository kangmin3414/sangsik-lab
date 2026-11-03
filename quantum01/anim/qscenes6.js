/* quantum immortality episode (v6, ~6.5 min): stickman scenes + code graphics. All times are absolute; anchors come from TL.q (gen_timeline6.py). */
window.CAMS = window.CAMS || {};
Object.assign(CAMS, { qbrick: [1.0, 1.05, 960, 560], qghost: [1.0, 1.04, 960, 540], qwave: [1.0, 1.05, 960, 540], qnight: [1.0, 1.06, 960, 540], qtitle: 'fixed', qyama: [1.0, 1.03, 960, 540],
  qquantum: [1.0, 1.04, 960, 540], qtree: [1.0, 1.02, 960, 540], qbirth: [1.0, 1.04, 960, 540], qdark: 'fixed', qturn: [1.0, 1.03, 960, 540], qrain: [1.0, 1.04, 960, 540],
  qtogether: [1.0, 1.05, 960, 540], qsite2: [1.0, 1.06, 960, 560], qkurtz: [1.0, 1.03, 960, 540], qlines: [1.0, 1.04, 960, 540], qend: [1.0, 1.04, 960, 540], qendcard: 'fixed' });

const QNAVY = '#0B1626', GOLD = '#F7C948', QINK = '#141414';
const fz = n => Math.round(n * 100) / 100;
const qBG = (c) => `<rect x="-600" y="-600" width="3120" height="2280" fill="${c}"/>`;
const qStars = (t, n = 36, ymax = 760) => { let h = ''; for (let i = 0; i < n; i++) h += `<circle cx="${(i * 233) % 1920}" cy="${(i * 131) % ymax + 20}" r="${1.2 + (i % 3) * 0.8}" fill="#fff" opacity="${fz(0.18 + 0.15 * Math.sin(t * 1.5 + i))}"/>`; return h; };
const qSite = (t, o = {}) => {
  let h = qBG('url(#morning)') + clouds(t, 90, 10, 3, 4);
  for (let i = 0; i < 9; i++) { const x = -80 + i * 240, hh = 260 + (i * 83) % 200; h += `<rect x="${x}" y="${660 - hh}" width="210" height="${hh}" fill="${['#A9C3DA', '#9AB0C8', '#B7C9DC'][i % 3]}" stroke="${QINK}" stroke-width="5"/>`; for (let k = 0; k < 4; k++) h += `<rect x="${x + 30 + (k % 2) * 90}" y="${660 - hh + 40 + Math.floor(k / 2) * 80}" width="56" height="44" fill="#E9F2FA" opacity=".8"/>`; }
  h += `<rect x="1470" y="-40" width="26" height="760" fill="#F2A33A" stroke="${QINK}" stroke-width="6"/><rect x="1020" y="40" width="720" height="24" fill="#F2A33A" stroke="${QINK}" stroke-width="6"/>`;
  for (let i = 0; i < 9; i++) h += `<path d="M${1040 + i * 80} 64 L${1080 + i * 80} 40" stroke="${QINK}" stroke-width="4"/>`;
  h += `<rect x="-600" y="470" width="2800" height="410" fill="#4F86C6" stroke="${QINK}" stroke-width="7"/>`;
  for (let i = 0; i < 16; i++) h += `<line x1="${-420 + i * 250}" y1="470" x2="${-420 + i * 250}" y2="880" stroke="${QINK}" stroke-width="5" opacity=".55"/>`;
  for (let i = 0; i < 40; i++) h += `<path d="M${-600 + i * 80} 470 l40 0 l-40 40 l-40 0 z" fill="${i % 2 ? '#FFD25A' : QINK}" opacity=".95"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#B8B0A4" stroke="${QINK}" stroke-width="6"/>`;
  for (let i = 0; i < 12; i++) h += `<line x1="${-500 + i * 260}" y1="880" x2="${-560 + i * 260}" y2="1080" stroke="#9A9286" stroke-width="4"/>`;
  return h;
};
const qZeroPhone = (t, x, y, s, walking, ex, look) => {
  const base = walking ? walkPose(t * 6, 0.62) : P['서기'];
  const pose = Object.assign({}, base, { armL: P['폰보기'].armL, hL: P['폰보기'].hL, armR: P['폰보기'].armR, hR: P['폰보기'].hR });
  let h = shadow(x, y + 4, 70 * s) + Z({ t, seed: 700, x, y, s, pose, ex, look: look || [0.4, 0.9] });
  const [px, py] = handG(x, y, s, [200, 318]);
  return h + phone(px, py - 6, s * 0.5, { on: 1 }) + hand(px - 22, py + 8, s) + hand(px + 22, py + 8, s);
};
const qBrickShape = (rot, sc = 1, fill = '#C45A3A') => `<g transform="rotate(${fz(rot)}) scale(${sc})"><rect x="-70" y="-34" width="140" height="68" rx="6" fill="${fill}" stroke="${QINK}" stroke-width="7"/><line x1="-30" y1="-34" x2="-30" y2="-6" stroke="${QINK}" stroke-width="4" opacity=".5"/><line x1="25" y1="6" x2="25" y2="34" stroke="${QINK}" stroke-width="4" opacity=".5"/></g>`;
const qT = (x, y, txt, size, fill = '#fff', o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.anchor || 'middle'}" font-family="${FONT}" font-weight="${o.w || 900}" font-size="${size}" fill="${fill}" ${o.stroke ? `stroke="${o.stroke}" stroke-width="${o.sw || 8}" paint-order="stroke"` : ''} opacity="${o.op == null ? 1 : o.op}">${txt}</text>`;

/* ---- AI picture layer (windows are absolute times) ---- */
(function () {
  const WIN = [['brick', 12.9, 14.0, 0.35], ['cat', null, null, 0.4], ['zerobox', null, null, 0.4], ['oldzero', null, null, 0.4], ['sun', null, null, 0.4], ['umbrella', null, null, 0.4], ['momcall', null, null, 0.4]];
  const layer = document.getElementById('ai'); const imgs = {};
  window.AI_READY = Promise.all(WIN.map(([k]) => new Promise(res => { const im = new Image(); im.onload = () => res(1); im.onerror = () => res(0); im.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;object-fit:cover;opacity:0;transform-origin:50% 45%'; im.src = 'ai/' + k + '.png'; layer.appendChild(im); imgs[k] = im; })));
  const wins = () => { const q = TL.q; return [['brick', q.hit + 0.5, q.ghost, 0.25, [1, 0]], ['cat', q.h3, q.tree, 0.3, [-1, 0]], ['zerobox', q.b1, q.b3, 0.3, [1, 0]], ['oldzero', q.g2, q.g3, 0.3, [-1, 0]], ['sun', q.g6, q.g7, 0.3, [0, -1]], ['umbrella', q.u1, q.s1, 0.4, [1, 0]], ['momcall', q.e8, q.e10, 0.3, [-1, 0]]]; };
  window.aiFrame = (i, t, L) => {
    for (const k in imgs) { imgs[k].style.opacity = 0; imgs[k].style.zIndex = 0; imgs[k].style.display = 'none'; }
    for (const [k, t0, t1, , pan] of wins()) {
      if (t >= t0 && t < t1) {
        const p = (t - t0) / Math.max(0.5, t1 - t0), e = p * p * (3 - 2 * p) * 0.5 + p * 0.5;
        imgs[k].style.transform = `translate(${fz(pan[0] * 28 * e)}px, ${fz(pan[1] * 18 * e)}px) scale(${fz(1.02 + 0.07 * e)})`;
        imgs[k].style.display = 'block'; imgs[k].style.opacity = 1; imgs[k].style.zIndex = 2; return true;
      }
    }
    return false;
  };
})();

/* ---- 0.8 .. 14.0  the brick ---- */
function qbrickScene(t, lt, a) {
  const q = TL.q, T0 = 0.8, HIT = q.hit, HX = 1060, G = 1000;
  let sh = 0; if (t > HIT && t < HIT + 0.45) sh = Math.sin((t - HIT) * 90) * 9 * (1 - (t - HIT) / 0.45);
  let h = `<g transform="translate(${fz(sh)} ${fz(sh * 0.6)})">` + qSite(t);
  const walking = t < HIT, zx = 240 + (Math.min(t, HIT) - T0) * 64;
  const ex = exprAt([[0, '기본'], [HIT - 1.2, '놀람']], t);
  if (t > q.brickword && t < HIT) { const k = prog(t, q.brickword, HIT); h += `<ellipse cx="${HX}" cy="${G - 4}" rx="${fz(10 + 74 * k)}" ry="${fz(3 + 10 * k)}" fill="#000" opacity="${fz(0.1 + 0.3 * k)}"/>`; }
  h += qZeroPhone(t, zx, G, 0.84, walking, ex, t > HIT - 1.2 ? [0.7, -0.5] : null);
  if (t > HIT - 1.5 && t < HIT) { const k = prog(t, HIT - 1.5, HIT), y = lerp(-160, G - 40, k * k); h += `<g transform="translate(${HX} ${fz(y)})">${qBrickShape(t * 280)}</g>`; }
  if (t >= HIT) {
    const e = t - HIT, parts = [[-1.0, -0.9, 40, 22, 120], [0.9, -1.3, 52, 26, -200], [1.6, -0.7, 34, 20, 300], [-1.6, -0.5, 28, 16, -260], [0.2, -1.6, 44, 24, 160], [2.2, -0.3, 24, 14, -340], [-0.5, -1.1, 30, 18, 220]];
    parts.forEach(([vx, vy, w, hh, w0]) => {
      const x = HX + vx * 180 * Math.min(e, 1.2), yy = Math.min(G - hh / 2, G - 30 + (vy * 380 * e + 520 * e * e)), rest = yy >= G - hh / 2 - 1;
      h += `<rect x="${fz(-w / 2)}" y="${fz(-hh / 2)}" width="${w}" height="${hh}" rx="4" fill="#C45A3A" stroke="${QINK}" stroke-width="6" transform="translate(${fz(x)} ${fz(yy)}) rotate(${fz(rest ? w0 : w0 * Math.min(e, 0.6))})"/>`;
    });
    for (let i = 0; i < 5; i++) h += puff(HX + (i - 2) * 70, G - 30 - e * 20, t, HIT + 0.02 * i, 1.1 + i * 0.1, '#E7E0D2');
    h += pop(t, HIT, HIT + 3.2, HX - 40, 560, outlined(0, 0, ['쾅!'], { size: 100, sw: 16, fill: YEL }), { rot: -8, wobble: 2 });
    if (t < HIT + 0.12) h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#fff" opacity="${fz((1 - (t - HIT) / 0.12) * 0.7)}"/>`;
  }
  return h + `</g>`;
}
/* ---- 14.0 .. 15.9  one step earlier ---- */
function qghostScene(t, lt, a) {
  const q = TL.q, HX = 1060, G = 1000, u = t - q.ghost, k = prog(u, 0.2, 1.4);
  let h = qSite(t);
  h += `<g opacity="${fz(0.3 + 0.2 * Math.sin(t * 5))}">${shadow(HX, G + 4, 70 * 0.84)}${Z({ t, seed: 701, x: HX, y: G, s: 0.84, pose: '서기', ex: exprAt([[0, '놀람']], t), look: [0, -0.8] })}</g>`;
  h += `<g transform="translate(${HX} ${fz(lerp(-80, 330, easeOut(k)))})" opacity=".55">${qBrickShape(12)}</g>`;
  h += pop(t, q.ghost + 0.2, q.wave, HX + 190, 470, outlined(0, 0, ['한 걸음만…'], { size: 60, sw: 12, fill: '#fff' }), { rot: 5, bob: 3 });
  return h + Z({ t, seed: 702, x: 540, y: G, s: 0.84, pose: '서기', ex: exprAt([[0, '걱정']], t), look: [0.8, -0.1] });
}
/* ---- 15.9 .. 23.7  "I'm fine", mom is not told ---- */
function qwaveScene(t, lt, a) {
  const q = TL.q, G = 1000, zx = 600; let h = qSite(t);
  const wv = t < q.mom;
  const pose = wv ? poseAt([[0, '서기'], [q.wave + 0.3, '만세']], t, 0.3) : P['주머니'];
  h += shadow(zx, G + 4, 70 * 0.84) + Z({ t, seed: 710, x: zx, y: G, s: 0.84, pose, ex: exprAt([[0, '기본'], [q.mom, '걱정']], t), look: [0.4, 0] });
  if (wv) h += pop(t, q.wave + 0.4, q.mom, zx + 230, 480, label(0, 0, '괜찮아요, 괜찮아요', { size: 46, bg: '#fff' }), { rot: 3, bob: 4 });
  if (t >= q.mom) {
    const draft = '오늘 공사장에서 벽돌이', n = Math.floor(clamp((t - q.mom - 0.6) / 1.6, 0, 1) * draft.length), del = t > q.night - 1.1 ? Math.floor(clamp((t - (q.night - 1.1)) / 0.9, 0, 1) * n) : 0;
    const txt = draft.slice(0, Math.max(0, n - del));
    const inner = `<rect x="-190" y="-290" width="380" height="580" rx="44" fill="#1F2D44" stroke="${QINK}" stroke-width="8"/><rect x="-170" y="-268" width="340" height="536" rx="28" fill="#F6F8FB"/>` +
      `<rect x="-170" y="-268" width="340" height="86" rx="28" fill="#FFD25A"/><text x="0" y="-210" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="42" fill="${QINK}">엄마</text>` +
      `<rect x="-150" y="170" width="300" height="70" rx="35" fill="#fff" stroke="#C9D3DF" stroke-width="4"/><text x="-126" y="217" font-family="${FONT}" font-weight="700" font-size="22" fill="${QINK}">${txt}${Math.sin(t * 9) > 0 ? '|' : ''}</text>`;
    h += pop(t, q.mom, q.night + 0.1, 1380, 560, inner, { rot: 3, bob: 3 });
  }
  return h;
}
/* ---- 23.7 .. 32  night ---- */
function qnightScene(t, lt, a) {
  const q = TL.q; let h = qBG('#101C30') + qStars(t, 30, 380);
  h += `<rect x="1300" y="130" width="360" height="300" rx="14" fill="#16294A" stroke="${QINK}" stroke-width="7"/><circle cx="1500" cy="250" r="54" fill="#F3EBC9"/><circle cx="1524" cy="236" r="46" fill="#16294A"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#2A2340"/>`;
  h += `<rect x="260" y="700" width="760" height="190" rx="22" fill="#5C6FA8" stroke="${QINK}" stroke-width="7"/><rect x="240" y="640" width="150" height="250" rx="22" fill="#E9E4F5" stroke="${QINK}" stroke-width="7"/>`;
  h += shadow(560, 902, 70 * 0.84) + Z({ t, seed: 720, x: 560, y: 760, s: 0.84, pose: '앉기', ex: exprAt([[0, '걱정']], t), look: [0.2, -0.5] });
  const k = easeOutBack(prog(t, q.think, q.think + 0.7));
  if (t > q.think) {
    const cx = 1060, cy = 400;
    h += `<g opacity="${fz(clamp(k, 0, 1))}"><circle cx="720" cy="590" r="14" fill="#fff" stroke="${QINK}" stroke-width="5"/><circle cx="780" cy="530" r="22" fill="#fff" stroke="${QINK}" stroke-width="5"/>` +
      `<ellipse cx="${cx}" cy="${cy}" rx="360" ry="190" fill="#fff" stroke="${QINK}" stroke-width="7"/><line x1="${cx - 260}" y1="${cy + 130}" x2="${cx + 300}" y2="${cy + 130}" stroke="#B8B0A4" stroke-width="10"/>` +
      `<g transform="translate(${cx - 70} ${cy + 130})">${shadow(0, 4, 40)}${Z({ t, seed: 721, x: 0, y: 0, s: 0.4, pose: '서기', ex: exprAt([[0, '기본']], t), look: [0.5, 0] })}</g>` +
      `<g transform="translate(${cx + 130} ${cy + 130})" opacity="${fz(0.55 + 0.3 * Math.sin(t * 4))}">${Z({ t, seed: 722, x: 0, y: 0, s: 0.4, pose: '서기', ex: exprAt([[0, '놀람']], t), look: [0, -0.5] })}</g>` +
      `<g transform="translate(${cx + 130} ${fz(cy - 150 + 40 * Math.sin(t * 3))})">${qBrickShape(10, 0.55)}</g>` + qT(cx + 130, cy - 40, '?', 96, PINK, { stroke: QINK }) + `</g>`;
  }
  return h + `<rect x="-600" y="-600" width="3120" height="2280" fill="#000" opacity="${fz(prog(t, q.title - 0.7, q.title))}"/>`;
}
function qtitleScene(t, lt, a) {
  const q = TL.q, k = Math.min(prog(t, q.title, q.title + 0.5), 1 - prog(t, q.title + 3.0, q.title + 3.5)), g = Math.round(255 * k);
  return qBG('#000') + qT(960, 520, '나는 죽을 수 없다.', 150, `rgb(${g},${g},${g})`) + qT(960, 620, '상상 실험입니다. 증명되지 않은 가설이에요.', 34, `rgb(${Math.round(g * .55)},${Math.round(g * .55)},${Math.round(g * .55)})`, { w: 500 });
}

/* ---- 36 .. 73.8  the man who survived twice (maps and props only) ---- */
function qyamaScene(t, lt, a) {
  const q = TL.q; let h = qBG('#EDE4CE');
  for (let i = 0; i < 24; i++) h += `<line x1="${i * 90 - 100}" y1="0" x2="${i * 90 - 100}" y2="1080" stroke="#D9CDB0" stroke-width="2"/>`; for (let j = 0; j < 14; j++) h += `<line x1="0" y1="${j * 90}" x2="1920" y2="${j * 90}" stroke="#D9CDB0" stroke-width="2"/>`;
  const H = [520, 560], N = [1380, 640];
  // sea / coast hint
  h += `<path d="M0 820 Q400 760 800 820 T1920 790 L1920 1080 L0 1080Z" fill="#B7CFE0" opacity=".7"/>`;
  const city = (c, name, on, op = 1) => `<g opacity="${op}"><circle cx="${c[0]}" cy="${c[1]}" r="16" fill="${on ? '#C0392B' : '#7A6E58'}" stroke="${QINK}" stroke-width="5"/>${qT(c[0], c[1] - 40, name, 44, QINK, { stroke: '#EDE4CE', sw: 10 })}</g>`;
  const ring = (c, k, col) => `<circle cx="${c[0]}" cy="${c[1]}" r="${fz(190 * k)}" fill="${col}" fill-opacity=".12" stroke="${col}" stroke-width="6" stroke-dasharray="14 12"/>`;
  const p1 = prog(t, q.yama, q.yama + 1.2), calm = t >= q.y6;
  h += city(H, '히로시마', t >= q.yama, 1) + city(N, '나가사키', t >= q.y3, t >= q.y3 - 0.5 ? 1 : 0.35);
  if (t >= q.yama && t < q.y2) h += pop(t, q.yama, q.y2, 960, 220, outlined(0, 0, ['1945.8.6'], { size: 120, sw: 18, fill: '#fff' }), { rot: -3, bob: 3 });
  if (t >= q.y2) h += ring(H, easeOut(prog(t, q.y2 + 1.5, q.y2 + 3.2)), '#C0392B') + (t > q.y2 + 3.2 ? pop(t, q.y2 + 3.2, q.y3, H[0] + 40, H[1] + 250, label(0, 0, '3km', { size: 44, bg: YEL }), { rot: -3 }) : '');
  if (t >= q.y2 && t < q.y3) { // suitcase + train ticket
    h += pop(t, q.y2 + 0.2, q.y3, 330, 780, `<rect x="-90" y="-62" width="180" height="124" rx="16" fill="#A9743F" stroke="${QINK}" stroke-width="8"/><rect x="-30" y="-92" width="60" height="30" rx="8" fill="none" stroke="${QINK}" stroke-width="8"/><line x1="-90" y1="0" x2="90" y2="0" stroke="${QINK}" stroke-width="5" opacity=".5"/>` + qT(0, 100, '출장', 38, QINK, { stroke: '#EDE4CE', sw: 9 }), { rot: -4 });
  }
  if (t >= q.y3) { // train along the line to Nagasaki
    const k = easeInOut(prog(t, q.y3 + 0.2, q.y3 + 4.4)), x = lerp(H[0], N[0], k), y = lerp(H[1], N[1], k);
    h += `<line x1="${H[0]}" y1="${H[1]}" x2="${N[0]}" y2="${N[1]}" stroke="${QINK}" stroke-width="6" stroke-dasharray="4 18" stroke-linecap="round" opacity=".7"/>`;
    h += `<g transform="translate(${fz(x)} ${fz(y + 46)})"><rect x="-44" y="-22" width="88" height="44" rx="10" fill="#4F86C6" stroke="${QINK}" stroke-width="6"/><rect x="-30" y="-12" width="22" height="16" fill="#E9F2FA"/><rect x="6" y="-12" width="22" height="16" fill="#E9F2FA"/><circle cx="-24" cy="26" r="9" fill="${QINK}"/><circle cx="24" cy="26" r="9" fill="${QINK}"/></g>`;
    if (t < q.y4) h += pop(t, q.y3 + 0.3, q.y4, 1000, 280, outlined(0, 0, ['사흘 뒤 · 1945.8.9'], { size: 72, sw: 14, fill: '#fff' }), { rot: 3, bob: 3 });
  }
  if (t >= q.y4) h += ring(N, easeOut(prog(t, q.y4 + 0.2, q.y4 + 1.4)), '#C0392B') + pop(t, q.y4 + 1.2, q.y5, N[0] + 20, N[1] + 250, label(0, 0, '또, 3km 안', { size: 44, bg: YEL }), { rot: 3 });
  if (t >= q.y5 && t < q.y6) h += pop(t, q.y5 + 0.1, q.y6, 960, 300, outlined(0, 0, [[['살아남았다 · ', '#fff'], ['93세', GOLD]]], { size: 100, sw: 16, fill: '#fff' }), { rot: -2, bob: 3 });
  if (calm) { // quiet: many small dots, almost all fade out; two stay
    const f = prog(t, q.y6, q.y7 - 0.5);
    for (let i = 0; i < 70; i++) { const x = 100 + (i * 263) % 1700, y = 120 + (i * 149) % 600, keep = i === 11 || i === 41; h += `<circle cx="${x}" cy="${y}" r="${keep ? 12 : 8}" fill="${keep ? GOLD : '#7A6E58'}" opacity="${keep ? 1 : fz(0.7 - 0.7 * f)}"/>`; }
  }
  if (t >= q.y7) {
    h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#0B1626" opacity="${fz(prog(t, q.y7, q.y7 + 1.0) * 0.92)}"/>`;
    const k = prog(t, q.y8, q.y8 + 1.4);
    h += `<g transform="translate(960 620)"><line x1="0" y1="260" x2="0" y2="70" stroke="#E8F1FF" stroke-width="16" stroke-linecap="round"/><line x1="0" y1="70" x2="${fz(-260 * k)}" y2="${fz(70 - 150 * k)}" stroke="#4A5568" stroke-width="12" stroke-linecap="round"/><line x1="0" y1="70" x2="${fz(260 * k)}" y2="${fz(70 - 150 * k)}" stroke="${GOLD}" stroke-width="16" stroke-linecap="round"/><circle cx="${fz(260 * k)}" cy="${fz(70 - 150 * k)}" r="${fz(16 * k)}" fill="${GOLD}"/></g>`;
    h += pop(t, q.y7 + 0.2, q.y8 + 0.5, 960, 340, outlined(0, 0, ['왜 그였을까?'], { size: 110, sw: 18, fill: '#fff' }), { rot: -2, bob: 4 });
    h += pop(t, q.y8 + 0.8, q.h1, 960, 340, outlined(0, 0, ['살아남은 세계만 보이는 걸까?'], { size: 70, sw: 14, fill: YEL }), { rot: 0, bob: 3 });
  }
  return h;
}

/* ---- 73.8 .. 87.2  the tiny world: particles and superposition ---- */
function qquantumScene(t, lt, a) {
  const q = TL.q; let h = qBG(QNAVY) + qStars(t, 36);
  const z = easeInOut(prog(t, q.h1, q.h2));
  for (let i = 0; i < 4; i++) { const s = 0.2 + i * 0.28 + z * 1.2; h += `<rect x="${fz(960 - 480 * s)}" y="${fz(540 - 270 * s)}" width="${fz(960 * s)}" height="${fz(540 * s)}" fill="none" stroke="#8CC8FF" stroke-width="3" opacity="${fz(Math.max(0, 0.7 - i * 0.12 - z * 0.3))}"/>`; }
  if (t < q.h1 + 3.0) h += pop(t, q.h1 + 0.2, q.h2, 960, 220, outlined(0, 0, ['아주 작은 세계'], { size: 96, sw: 16, fill: '#fff' }), { rot: -2, bob: 3 });
  if (t >= q.h2) {
    const u = t - q.h2, sp = easeOut(prog(u, 0.6, 2.6)), dx = 300 * sp;
    for (let k = 0; k < 6; k++) { const ph = k / 6; h += `<circle cx="${fz(960 - dx * (1 - ph * 0.4))}" cy="${fz(560 + Math.sin(t * 3 + k) * 6)}" r="${fz(34 - k * 3)}" fill="#8CC8FF" opacity="${fz(0.07 + 0.05 * k)}"/><circle cx="${fz(960 + dx * (1 - ph * 0.4))}" cy="${fz(560 + Math.sin(t * 3 + k) * 6)}" r="${fz(34 - k * 3)}" fill="#8CC8FF" opacity="${fz(0.07 + 0.05 * k)}"/>`; }
    h += `<circle cx="${fz(960 - dx)}" cy="560" r="30" fill="#E8F1FF" opacity=".85"/><circle cx="${fz(960 + dx)}" cy="560" r="30" fill="#E8F1FF" opacity=".85"/>`;
    h += pop(t, q.h2 + 2.4, q.h3, 960, 250, outlined(0, 0, ['한꺼번에 겹쳐 있다 = 중첩'], { size: 80, sw: 15, fill: YEL }), { rot: 0, bob: 3 });
    h += pop(t, q.h2 + 3.2, q.h3, 960 - dx, 700, label(0, 0, '여기', { size: 40, bg: '#fff' }), { rot: -3 }) + pop(t, q.h2 + 3.6, q.h3, 960 + dx, 700, label(0, 0, '또는 여기', { size: 40, bg: '#fff' }), { rot: 3 });
  }
  return h;
}

/* ---- 101 .. 188  branching worlds, the survivor (pictures cover 87-101 and 127-139) ---- */
const QTREE = (() => {
  const segs = [], path = [1, 0, 1, 1, 0, 1];
  (function grow(x, y, ang, len, d, surv, id) {
    const x1 = x + Math.sin(ang) * len, y1 = y - Math.cos(ang) * len;
    segs.push({ x0: x, y0: y, x1, y1, d, surv, id });
    if (d < 6) { const sp = 0.52 - d * 0.045;[0, 1].forEach(c => grow(x1, y1, ang + (c ? sp : -sp), len * 0.79, d + 1, surv && c === path[d], id + c)); }
  })(960, 1010, 0, 190, 0, true, 'r');
  return segs;
})();
function qtreeScene(t, lt, a) {
  const q = TL.q, TS = q.tree, T = t - TS;
  const dStart = [-0.2, q.dead - TS - 0.6, q.dead - TS + 1.6, q.many - TS - 1.2, q.many - TS - 0.4, q.many - TS + 0.3, q.many - TS + 1.0];
  let h = qBG(QNAVY) + qStars(t, 36) + `<rect x="-600" y="1010" width="3120" height="600" fill="#0A1220"/>`;
  const L0 = QTREE.find(s => s.id === 'r0'), R0 = QTREE.find(s => s.id === 'r1');
  const dieAt = s => { if (s.surv) return 1e9; if (s.id.length >= 2 && s.id[1] === '0') return q.b3; return q.b4 + 0.6 + (6 - s.d) * 0.62 + (s.id.charCodeAt(s.id.length - 1) % 2) * 0.12; };
  const gold = t > q.b5 - 4.5;   // the surviving line lights up while the counter runs
  QTREE.forEach(s => {
    const g = clamp((T - dStart[s.d]) / 0.55, 0, 1); if (g <= 0) return;
    const x1 = lerp(s.x0, s.x1, easeOut(g)), y1 = lerp(s.y0, s.y1, easeOut(g));
    const died = t > dieAt(s) ? clamp((t - dieAt(s)) / 0.7, 0, 1) : 0, w = 20 - s.d * 2.4;
    const isG = s.surv && gold;
    if (isG) h += `<line x1="${fz(s.x0)}" y1="${fz(s.y0)}" x2="${fz(x1)}" y2="${fz(y1)}" stroke="${GOLD}" stroke-width="${fz(w + 16)}" stroke-linecap="round" opacity=".22"/>`;
    const col = isG ? GOLD : (died > 0 ? '#4A5568' : (s.d < 2 ? '#E8F1FF' : '#8CC8FF'));
    h += `<line x1="${fz(s.x0)}" y1="${fz(s.y0)}" x2="${fz(x1)}" y2="${fz(y1)}" stroke="${col}" stroke-width="${fz(Math.max(5, w))}" stroke-linecap="round" opacity="${fz(1 - died * 0.7)}"/>`;
    if (s.d === 6 && g >= 1) h += `<circle cx="${fz(s.x1)}" cy="${fz(s.y1)}" r="${isG ? 13 : 8}" fill="${isG ? GOLD : (died > 0 ? '#4A5568' : '#fff')}" opacity="${fz(1 - died * 0.6)}"/>`;
  });
  h += pop(t, q.dead, q.many, L0.x1 - 250, L0.y1 - 40, label(0, 0, '고양이가 죽은 세계', { size: 40, bg: '#FF8F7A' }), { rot: -3, bob: 3 });
  h += pop(t, q.dead + 0.6, q.many, R0.x1 + 250, R0.y1 - 40, label(0, 0, '산 세계', { size: 40, bg: MINT }), { rot: 3, bob: 3 });
  h += pop(t, q.many, q.q, 960, 150, outlined(0, 0, ['다세계 해석'], { size: 84, sw: 14, fill: '#fff' }), { rot: -2 });
  h += pop(t, q.q, q.b1, 960, 150, outlined(0, 0, ['그리고, 섬뜩한 질문 하나.'], { size: 64, sw: 12, fill: YEL }), { bob: 3 });
  if (t > q.b3) h += pop(t, q.b3, q.b4, L0.x1 - 230, 640, label(0, 0, '느낄 수 없다', { size: 44, bg: '#9AA4B2' }), { rot: -3 });
  if (t > q.b5) h += pop(t, q.b5, q.g1, 1500, 620, label(0, 0, '내 눈에 보이는 세계는 언제나 이 선 위에', { size: 36, bg: GOLD }), { rot: 2, bob: 3 });
  if (t > q.b4) { const k = clamp(Math.floor((t - q.b4) / 1.15), 0, 5); h += `<g transform="translate(1560 930)"><rect x="-300" y="-56" width="600" height="112" rx="28" fill="#0A1220" stroke="${GOLD}" stroke-width="6"/><text x="-270" y="-6" font-family="${FONT}" font-weight="700" font-size="30" fill="#CFD8E3">살아남은 나</text><text x="270" y="38" text-anchor="end" font-family="${FONT}" font-weight="900" font-size="64" fill="${GOLD}">1 / ${Math.pow(2, k + 1)}</text></g>`; }
  if (t > q.b6 && t < q.b8) h += pop(t, q.b6, q.b8, 480, 250, `<rect x="-290" y="-60" width="580" height="120" rx="20" fill="#0A1220" stroke="#8CC8FF" stroke-width="5"/>` + qT(0, -4, '맥스 테그마크', 52, '#E8F1FF') + qT(0, 42, '1990년대 후반 · 사고실험', 28, '#8CC8FF', { w: 600 }), { rot: -2 });
  if (t > q.b7) h += pop(t, q.b7, q.b9, 1440, 250, outlined(0, 0, ['양자 불멸'], { size: 96, sw: 16, fill: GOLD }), { rot: 2, bob: 3 });
  [[q.b8 + 0.7, '계단', 640, 560], [q.b8 + 3.2, '비행기', 720, 330], [q.b8 + 5.6, '심장', 1250, 600]].forEach(([t0, txt, x, y]) => { if (t > t0 && t < q.b9) { h += pop(t, t0, t0 + 1.8, x, y, outlined(0, 0, [txt], { size: 66, sw: 12, fill: PINK }), { rot: -6, wobble: 3 }); h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#fff" opacity="${fz(Math.max(0, 1 - (t - t0) / 0.15) * 0.22)}"/>`; } });
  if (t > q.b10) h += pop(t, q.b10, q.g1, 960, 140, outlined(0, 0, ['나는, 절대, 죽을 수 없다'], { size: 80, sw: 14, fill: '#fff' }), { rot: 0 });
  const tip = QTREE.filter(s => s.surv && T > dStart[s.d] + 0.4).pop();
  if (tip && !(t > q.b1 - 0.1 && t < q.b3)) h += `<g transform="translate(${fz(tip.x1)} ${fz(tip.y1 + 6)})">${Z({ t, seed: 730, x: 0, y: 0, s: 0.22, pose: '서기', ex: exprAt([[0, '기본']], t), look: [0, -0.6] })}</g>`;
  if (t > q.b11) h += `<rect x="-600" y="-600" width="3120" height="2280" fill="${GOLD}" opacity="${fz(prog(t, q.b11, q.g1) * 0.18)}"/>`;
  return h;
}

/* ---- 188.6 .. 229  the birthday that never ends ---- */
const qCake = (cx, cy, s, n, t, glow = 1) => {
  let h = `<g transform="translate(${cx} ${cy}) scale(${s})">`;
  h += `<ellipse cx="0" cy="160" rx="260" ry="26" fill="#000" opacity=".18"/><rect x="-230" y="40" width="460" height="120" rx="18" fill="#F3C9A0" stroke="${QINK}" stroke-width="8"/><rect x="-170" y="-40" width="340" height="90" rx="16" fill="#FFB3C7" stroke="${QINK}" stroke-width="8"/>`;
  const cnt = Math.max(1, Math.min(n, 21));
  for (let i = 0; i < cnt; i++) { const x = -150 + (300 / Math.max(1, cnt - 1)) * i, f = 1 + 0.2 * Math.sin(t * 9 + i); h += `<rect x="${fz(x - 5)}" y="-90" width="10" height="52" fill="#7CC7FF" stroke="${QINK}" stroke-width="3"/><ellipse cx="${fz(x)}" cy="${fz(-104)}" rx="${fz(8 * f)}" ry="${fz(16 * f)}" fill="#FFD25A" opacity="${glow}"/>`; }
  return h + `</g>`;
};
function qbirthScene(t, lt, a) {
  const q = TL.q; let h = qBG('#1A1730') + qStars(t, 20, 400) + `<rect x="-600" y="860" width="3120" height="600" fill="#2B2640"/>`;
  if (t < q.g2) { // 122
    const n = 3 + Math.floor(prog(t, q.g1 + 1, q.g1 + 8) * 18);
    h += `<rect x="0" y="0" width="1920" height="1080" fill="url(#screenGlow)" opacity=".25"/>` + qCake(700, 640, 1.25, n, t);
    h += shadow(1280, 1004, 70 * 0.84) + Z({ t, seed: 740, x: 1280, y: 1000, s: 0.84, pose: '서기', ex: exprAt([[0, '기본'], [q.g1 + 6, '신남']], t), look: [-0.6, 0] });
    h += pop(t, q.g1 + 0.3, q.g1 + 5.2, 960, 160, outlined(0, 0, [[['기록상 가장 오래 산 사람 · ', '#fff'], ['122세', GOLD]]], { size: 66, sw: 14, fill: '#fff' }), { rot: -2, bob: 3 });
    h += pop(t, q.g1 + 6.2, q.g2, 960, 200, outlined(0, 0, ['끝이 아니라, 시작?'], { size: 96, sw: 16, fill: YEL }), { rot: 2, bob: 3 });
    return h;
  }
  const old = (o) => Object.assign({ longBeard: '#F4F4F4', hair: '#F4F4F4' }, o);
  if (t >= q.g3 && t < q.g5) { // 300: breathing machine
    h = qBG('#0F1B2E') + `<rect x="-600" y="860" width="3120" height="600" fill="#1B2A44"/>`;
    h += `<rect x="260" y="700" width="900" height="180" rx="22" fill="#CFD8E3" stroke="${QINK}" stroke-width="7"/><rect x="230" y="620" width="160" height="260" rx="22" fill="#E9F2FA" stroke="${QINK}" stroke-width="7"/>`;
    h += shadow(640, 902, 70 * 0.84) + Z(old({ t, seed: 741, x: 640, y: 760, s: 0.84, pose: '앉기', ex: exprAt([[0, '걱정']], t), look: [0.4, 0] }));
    h += `<g transform="translate(1500 520)"><rect x="-190" y="-150" width="380" height="300" rx="26" fill="#1F2D44" stroke="${QINK}" stroke-width="8"/><rect x="-166" y="-126" width="332" height="252" rx="14" fill="#06130C"/><polyline points="${Array.from({ length: 48 }, (_, i) => { const x = -160 + i * 6.8, ph = ((i + t * 14) % 24); const yv = ph < 2 ? -70 : ph < 4 ? 50 : ph < 5 ? -20 : 0; return `${fz(x)},${fz(yv)}`; }).join(' ')}" fill="none" stroke="#3DF2B0" stroke-width="5" stroke-linejoin="round"/></g>`;
    h += `<path d="M740 690 Q900 640 1000 560 T1260 470" fill="none" stroke="#9AB0C8" stroke-width="10" stroke-linecap="round" opacity=".8"/>`;
    h += `<g opacity="${fz(0.5 + 0.5 * Math.sin(t * 6) * Math.sin(t * 6))}">${qT(1500, 760, '삑', 64, '#3DF2B0')}</g>`;
    if (t >= q.g4) h += pop(t, q.g4, q.g5, 760, 330, outlined(0, 0, ['꺼지는 세계로는 못 간다'], { size: 56, sw: 12, fill: '#fff' }), { rot: -3, bob: 3 });
    h += pop(t, q.g3, q.g4, 960, 180, outlined(0, 0, ['삼백 살'], { size: 100, sw: 16, fill: GOLD }), { rot: -2 });
    return h;
  }
  if (t >= q.g5 && t < q.g6) { // 1000: strangers walk past
    h = qBG('url(#sunset)') + `<rect x="-600" y="860" width="3120" height="600" fill="#6C5B7B"/>`;
    h += shadow(560, 1004, 70 * 0.84) + Z(old({ t, seed: 742, x: 560, y: 1000, s: 0.84, pose: '들기', ex: exprAt([[0, '걱정']], t), look: [0.8, 0] }));
    for (let i = 0; i < 4; i++) { const x = 1000 + i * 240 + ((t * 70) % 240), op = fz(0.8); h += `<g opacity="${op}">${shadow(x, 1004, 60 * 0.8)}${Z({ t, seed: 750 + i, x, y: 1000, s: 0.8, pose: walkPose(t * 5 + i, 0.6), vest: ['#7CC7FF', '#9DD39A', '#C9A7E8', '#FFC27A'][i], ex: exprAt([[0, '기본']], t), look: [0.9, 0] })}</g>`; }
    h += pop(t, q.g5 + 0.2, q.g6, 820, 400, label(0, 0, '…저기요?', { size: 54, bg: '#fff' }), { rot: -3, bob: 3 });
    h += pop(t, q.g5 + 1.0, q.g6, 1260, 300, qT(0, 0, '(아무도 돌아보지 않는다)', 40, '#fff', { stroke: QINK, sw: 9, w: 700 }), { rot: 2 });
    h += pop(t, q.g5, q.g5 + 1.6, 960, 160, outlined(0, 0, ['천 살'], { size: 100, sw: 16, fill: GOLD }), { rot: 2 });
    return h;
  }
  if (t >= q.g7) { // not a blessing: a single candle left
    const f = prog(t, q.g7, q.g8);
    h = qBG('#0A0F1A') + qCake(960, 620, 1.1, 1, t, fz(1 - f * 0.4));
    h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#000" opacity="${fz(f * 0.5)}"/>`;
    h += pop(t, q.g7 + 0.1, q.g8, 960, 220, outlined(0, 0, ['끝이 없다는 건, 축복이 아니었다'], { size: 66, sw: 13, fill: '#fff' }), { rot: 0 });
    return h;
  }
  return h;   // pictures cover the rest
}
function qdarkScene(t, lt, a) {
  const q = TL.q, g = Math.round(160 * (0.5 + 0.5 * Math.sin(2 * Math.PI * t / 1.2)));
  return qBG('#000') + `<circle cx="960" cy="800" r="9" fill="rgb(0,${g},40)"/>` + `<circle cx="960" cy="800" r="26" fill="rgb(0,${g},40)" opacity=".15"/>`;
}

/* ---- 234.9 .. 292.9  the turn: death is not a switch ---- */
function qturnScene(t, lt, a) {
  const q = TL.q; let h = '';
  if (t < q.r3) { // room, sunrise to dusk
    const k = clamp((t - q.r1) / (q.r3 - q.r1), 0, 1);
    const sky = k < 0.5 ? `rgb(${Math.round(lerp(143, 255, k * 2))},${Math.round(lerp(208, 190, k * 2))},${Math.round(lerp(255, 140, k * 2))})` : `rgb(${Math.round(lerp(255, 60, (k - 0.5) * 2))},${Math.round(lerp(190, 50, (k - 0.5) * 2))},${Math.round(lerp(140, 110, (k - 0.5) * 2))})`;
    h = qBG('#EBD9BE') + `<rect x="1180" y="140" width="520" height="440" rx="14" fill="${sky}" stroke="${QINK}" stroke-width="9"/><line x1="1440" y1="140" x2="1440" y2="580" stroke="${QINK}" stroke-width="8"/><line x1="1180" y1="360" x2="1700" y2="360" stroke="${QINK}" stroke-width="8"/>`;
    const sy = lerp(260, 540, k); h += `<circle cx="1580" cy="${fz(sy)}" r="46" fill="#FFE27A" opacity="${fz(1 - k * 0.2)}" />`;
    h += `<rect x="-600" y="880" width="3120" height="600" fill="#9A7B5B"/><rect x="-600" y="-600" width="3120" height="2280" fill="#1A1030" opacity="${fz(Math.max(0, k - 0.45) * 0.7)}"/>`;
    h += shadow(700, 1004, 70 * 0.84) + Z({ t, seed: 760, x: 700, y: 1000, s: 0.84, pose: '턱괴기', ex: exprAt([[0, '기본'], [q.r2, '걱정']], t), look: [0.9, -0.2] });
    h += pop(t, q.r2, q.r3, 640, 300, outlined(0, 0, [[['죽음은 ', '#fff'], ['스위치', YEL], ['가 아니다', '#fff']]], { size: 80, sw: 14, fill: '#fff' }), { rot: -2, bob: 3 });
    if (t > q.r2 + 2.5) h += pop(t, q.r2 + 2.5, q.r3, 700, 430, outlined(0, 0, ['해가 지듯, 천천히'], { size: 62, sw: 12, fill: '#FFE27A' }), { rot: 2 });
    return h;
  }
  if (t < q.r4) { // switch vs dimmer
    h = qBG('#16213A');
    const u = t - q.r3, on = Math.floor(u * 1.2) % 2 === 0;
    h += `<g transform="translate(560 540)"><rect x="-120" y="-190" width="240" height="380" rx="26" fill="#E8E8EE" stroke="${QINK}" stroke-width="9"/><rect x="-62" y="${on ? -150 : 10}" width="124" height="150" rx="14" fill="${on ? '#3DF2B0' : '#FF8F7A'}" stroke="${QINK}" stroke-width="7"/>${qT(0, 250, '산 것 / 죽은 것', 40, '#fff', { stroke: QINK, sw: 9 })}${qT(0, -230, '스위치', 54, '#FFE27A', { stroke: QINK, sw: 10 })}</g>`;
    const kk = easeInOut(prog(u, 1.5, 7.5));
    h += `<g transform="translate(1340 540)"><rect x="-70" y="-190" width="140" height="380" rx="26" fill="#E8E8EE" stroke="${QINK}" stroke-width="9"/><rect x="-30" y="-150" width="60" height="300" rx="18" fill="#9AA4B2"/><rect x="-52" y="${fz(lerp(-170, 100, kk))}" width="104" height="60" rx="14" fill="#fff" stroke="${QINK}" stroke-width="7"/>${qT(0, 250, '현실의 죽음', 40, '#fff', { stroke: QINK, sw: 9 })}${qT(0, -230, '조광기', 54, '#FFE27A', { stroke: QINK, sw: 10 })}</g>`;
    h += `<circle cx="1340" cy="130" r="${fz(90 - 40 * kk)}" fill="#FFE27A" opacity="${fz(0.9 - 0.7 * kk)}"/>`;
    h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#000" opacity="${on ? 0 : 0}"/>`;
    return h;
  }
  if (t < q.r5) { // unverified
    h = qBG('#1A2742') + qStars(t, 20, 400);
    const u = t - q.r4;
    for (let i = 0; i < 5; i++) { const x = 360 + i * 300, y = 560 + (i % 2) * 40; h += `<g transform="translate(${x} ${y}) rotate(${(i - 2) * 6})"><rect x="-100" y="-130" width="200" height="260" rx="10" fill="#F6F8FB" stroke="${QINK}" stroke-width="6"/>${[0, 1, 2, 3, 4].map(j => `<line x1="-70" y1="${-90 + j * 40}" x2="${70 - (j % 2) * 30}" y2="${-90 + j * 40}" stroke="#9AA4B2" stroke-width="6"/>`).join('')}${u > 1 + i * 0.5 ? qT(0, 30, '?', 130, PINK, { stroke: QINK, sw: 9 }) : ''}</g>`; }
    h += pop(t, q.r4, q.r5, 960, 190, outlined(0, 0, ['아직 검증되지 않았다'], { size: 92, sw: 16, fill: '#fff' }), { rot: -2, bob: 3 });
    if (t > q.r4 + 5) h += pop(t, q.r4 + 5, q.r5, 960, 860, label(0, 0, '지지하는 물리학자 중에도, 이 결론은 받아들이지 않는 사람이 있다', { size: 34, bg: YEL }), { rot: 1 });
    return h;
  }
  if (t < q.r6) { // warning
    h = qBG('#2A1F14') + `<g transform="translate(960 540)"><path d="M0 -270 L270 190 L-270 190 Z" fill="#F7C948" stroke="${QINK}" stroke-width="14" stroke-linejoin="round"/>${qT(0, 120, '!', 300, QINK, { w: 900 })}</g>`;
    h += pop(t, q.r5, q.r6, 960, 190, outlined(0, 0, ['상상 속의 실험'], { size: 90, sw: 16, fill: '#fff' }), { rot: -2 });
    h += pop(t, q.r5 + 3.2, q.r6, 960, 900, outlined(0, 0, ['누구도 직접 시험해서는 안 된다'], { size: 70, sw: 14, fill: YEL }), { rot: 0, bob: 3 });
    return h;
  }
  // 275 .. 293: the world without me
  const night = qBG('#0F1424') + `<rect x="-600" y="860" width="3120" height="600" fill="#1E2236"/>`;
  h = night + `<rect x="260" y="560" width="620" height="320" rx="16" fill="#8B6B4A" stroke="${QINK}" stroke-width="8"/><rect x="1180" y="520" width="150" height="360" rx="14" fill="#6C5B7B" stroke="${QINK}" stroke-width="7"/>`;
  const ring = t > q.r8 ? Math.floor((t - q.r8) * 1.6) % 2 : 0;
  h += `<g transform="translate(570 520) rotate(-8)"><rect x="-70" y="-120" width="140" height="240" rx="24" fill="#1F2D44" stroke="${QINK}" stroke-width="8"/><rect x="-56" y="-104" width="112" height="208" rx="14" fill="${t > q.r8 ? '#F6F8FB' : '#0B0F18'}"/>${t > q.r8 ? qT(0, 0, '제로', 34, QINK) + qT(0, 46, '…', 40, '#3A4A66') : ''}</g>`;
  if (t > q.r8) for (let i = 0; i < 3; i++) h += `<circle cx="570" cy="520" r="${fz(100 + i * 40 + ((t * 40) % 40))}" fill="none" stroke="#FFD25A" stroke-width="5" opacity="${fz(ring * 0.5 - i * 0.12)}"/>`;
  h += pop(t, q.r6, q.r7, 960, 200, outlined(0, 0, ['벽돌에 맞은 세계에서도, 시간은 흐른다'], { size: 64, sw: 13, fill: '#fff' }), { rot: 0 });
  h += pop(t, q.r7, q.r8, 960, 200, outlined(0, 0, ['내가 없는 채로'], { size: 84, sw: 15, fill: GOLD }), { rot: -2, bob: 3 });
  if (t > q.r9) { for (let i = 0; i < 3; i++) h += `<g opacity=".8">${Z({ t, seed: 770 + i, x: 1500 + i * 150, y: 1000, s: 0.6, pose: '서기', vest: ['#6C7A96', '#8C7A96', '#7A8C96'][i], ex: exprAt([[0, '걱정']], t), look: [-0.6, 0] })}</g>`; h += pop(t, q.r9, q.u1, 1560, 640, outlined(0, 0, ['나를 잃은 사람들'], { size: 54, sw: 12, fill: '#fff' }), { rot: -3 }); }
  return h;
}

/* ---- 292.9 .. 314.6  the other side (picture covers most); a quiet overlay ---- */
function qrainScene(t, lt, a) { return qBG('#2A2F4A'); }

/* ---- 314.6 .. 344  together ---- */
function qtogetherScene(t, lt, a) {
  const q = TL.q; let h = qBG('url(#sunset)') + clouds(t, 120, 8, 3, 2) + `<rect x="-600" y="870" width="3120" height="600" fill="#8A6F5B"/><rect x="-600" y="870" width="3120" height="14" fill="#6B5444"/>`;
  const G = 1000;
  const who = [['#FF9A55', 0], ['#7CC7FF', 1], ['#9DD39A', 2], ['#C9A7E8', 3]];
  if (t < q.s2) { // gold line splits into many
    const k = prog(t, q.s1, q.s2); h = qBG(QNAVY) + qStars(t, 30);
    for (let i = 0; i < 7; i++) { const x = 560 + i * 130; h += `<line x1="960" y1="900" x2="${fz(lerp(960, x, k))}" y2="${fz(lerp(900, 330, k))}" stroke="${i === 3 ? GOLD : '#8CC8FF'}" stroke-width="${i === 3 ? 18 : 10}" stroke-linecap="round" opacity="${i === 3 ? 1 : 0.8}"/>`; }
    h += pop(t, q.s1 + 0.2, q.s2, 960, 190, outlined(0, 0, ['반대편 얼굴'], { size: 100, sw: 17, fill: '#fff' }), { rot: -2, bob: 3 });
    return h;
  }
  if (t < q.s3) { // alone vs everyone
    const alone = t < q.s2 + 5.0;
    if (alone) { h = qBG('#0F1424') + `<rect x="-600" y="870" width="3120" height="600" fill="#1E2236"/>` + shadow(960, 1004, 70) + Z({ t, seed: 780, x: 960, y: 1000, s: 0.84, pose: '서기', longBeard: '#F4F4F4', ex: exprAt([[0, '걱정']], t), look: [0, 0] }); h += pop(t, q.s2 + 0.2, q.s2 + 5.0, 960, 300, outlined(0, 0, ['나만 남는 영생'], { size: 90, sw: 15, fill: '#fff' }), { rot: -2 }); return h; }
    who.forEach(([c, i]) => { const x = 360 + i * 300 + ((t * 40) % 300) - 150; h += shadow(x, G + 4, 60) + Z({ t, seed: 790 + i, x, y: G, s: 0.8, pose: walkPose(t * 5 + i, 0.55), vest: c, longBeard: i === 3 ? '#F4F4F4' : false, ex: exprAt([[0, '신남']], t), look: [0.8, 0] }); });
    h += pop(t, q.s2 + 5.2, q.s3, 960, 230, outlined(0, 0, ['모두가 함께 오래 사는 세계'], { size: 78, sw: 14, fill: '#fff' }), { rot: 0, bob: 3 });
    h += pop(t, q.s2 + 7.5, q.s3, 960, 340, label(0, 0, '양자 불멸이 아니라, 더 긴 삶', { size: 44, bg: YEL }), { rot: 2 });
    return h;
  }
  if (t < q.s4) { // goodbye: one friend leaves, a new one arrives
    const u = t - q.s3, leave = easeInOut(prog(u, 1.0, 3.6)), come = easeOut(prog(u, 3.4, 5.6));
    h += shadow(700, G + 4, 70) + Z({ t, seed: 800, x: 700, y: G, s: 0.84, pose: u > 3.6 ? '서기' : poseAt([[0, '서기'], [1.0, '만세']], u, 0.3), ex: exprAt([[0, '기본'], [3.6, '걱정'], [5.4, '신남']], u), look: [0.8, 0] });
    h += shadow(lerp(1000, 1700, leave), G + 4, 60) + `<g opacity="${fz(1 - leave * 0.6)}">${Z({ t, seed: 801, x: lerp(1000, 1700, leave), y: G, s: 0.8, pose: u > 1 ? walkPose(u * 5, 0.5) : '서기', vest: '#7CC7FF', ex: exprAt([[0, '기본']], u), look: [0.8, 0] })}</g>`;
    if (u > 3.4) h += shadow(lerp(-100, 1000, come), G + 4, 60) + Z({ t, seed: 802, x: lerp(-100, 1000, come), y: G, s: 0.8, pose: come < 1 ? walkPose(u * 5, 0.5) : '서기', vest: '#9DD39A', ex: exprAt([[0, '신남']], u), look: [-0.8, 0] });
    h += pop(t, q.s3 + 0.5, q.s3 + 3.4, 960, 230, outlined(0, 0, ['이별은 온다'], { size: 96, sw: 16, fill: '#fff' }), { rot: -2 });
    if (u > 3.6) h += pop(t, q.s3 + 3.6, q.s4, 960, 230, outlined(0, 0, ['그래서 오늘의 만남이 진해진다'], { size: 72, sw: 14, fill: YEL }), { rot: 2, bob: 3 });
    if (u > 5.6) { const hx = 860, hy = 650 - Math.sin(u * 2) * 8; h += `<path d="M${hx} ${hy + 40} C${hx - 70} ${hy - 20}, ${hx - 30} ${hy - 70}, ${hx} ${hy - 30} C${hx + 30} ${hy - 70}, ${hx + 70} ${hy - 20}, ${hx} ${hy + 40} Z" fill="#FF5FA2" stroke="${QINK}" stroke-width="7" opacity="${fz(clamp((u - 5.6) / 0.5, 0, 1))}"/>`; }
    return h;
  }
  // pass it on: a glowing light from Zero (older) to a younger one
  const u = t - q.s4, k = easeInOut(prog(u, 1.0, 4.0));
  h += shadow(620, G + 4, 70) + Z({ t, seed: 810, x: 620, y: G, s: 0.88, pose: '들기', longBeard: '#E9E9E9', ex: exprAt([[0, '신남']], u), look: [0.8, 0] });
  h += shadow(1240, G + 4, 54) + Z({ t, seed: 811, x: 1240, y: G, s: 0.66, pose: '서기', vest: '#9DD39A', ex: exprAt([[0, '기본'], [4.0, '신남']], u), look: [-0.8, 0] });
  const ox = lerp(760, 1160, k), oy = 700 - Math.sin(k * Math.PI) * 120;
  h += `<circle cx="${fz(ox)}" cy="${fz(oy)}" r="60" fill="${GOLD}" opacity=".25"/><circle cx="${fz(ox)}" cy="${fz(oy)}" r="30" fill="${GOLD}" stroke="${QINK}" stroke-width="6"/>`;
  h += pop(t, q.s4 + 0.4, q.e1, 960, 230, outlined(0, 0, ['겪은 것을, 다음 사람에게'], { size: 82, sw: 15, fill: '#fff' }), { rot: -2, bob: 3 });
  return h;
}

/* ---- 344 .. 395  resolution ---- */
function qsite2Scene(t, lt, a) {
  const q = TL.q, G = 1000; let h = qSite(t);
  const u = t - q.e1;
  h += shadow(900, G + 4, 70 * 0.9) + Z({ t, seed: 820, x: 900, y: G, s: 0.9, pose: '주머니', ex: exprAt([[0, '기본'], [q.e3, '기본']], t), look: [0, -0.5] });
  h += pop(t, q.e2, q.e5, 1380, 380, label(0, 0, '아무 일도 없었던 게 아니었다', { size: 44, bg: '#fff' }), { rot: 2, bob: 3 });
  if (t > q.e4 - 0.2) h += pop(t, q.e4, q.e5, 960, 190, outlined(0, 0, ['하필, 이 세계에서 깬 거니까'], { size: 70, sw: 14, fill: YEL }), { rot: -2, bob: 3 });
  return h;
}
function qkurtzScene(t, lt, a) {
  const q = TL.q; let h = qBG('#16213A') + qStars(t, 16, 300);
  const u = t - q.e5, g1 = easeOut(prog(u, 1.0, 3.2)), g2 = easeOut(prog(u, 2.2, 4.4));
  h += `<line x1="400" y1="880" x2="1520" y2="880" stroke="#8CC8FF" stroke-width="6"/>`;
  h += `<rect x="560" y="${fz(880 - 520 * g1)}" width="220" height="${fz(520 * g1)}" rx="14" fill="${GOLD}" stroke="${QINK}" stroke-width="7"/><rect x="1140" y="${fz(880 - 340 * g2)}" width="220" height="${fz(340 * g2)}" rx="14" fill="#8CC8FF" stroke="${QINK}" stroke-width="7"/>`;
  h += qT(670, 940, '졸업이 곧이다', 44, '#fff', { stroke: QINK, sw: 9 }) + qT(1250, 940, '아직 멀었다', 44, '#fff', { stroke: QINK, sw: 9 });
  h += pop(t, q.e5, q.e6, 960, 150, outlined(0, 0, ['하고 싶던 일을 해낸 정도'], { size: 76, sw: 14, fill: '#fff' }), { rot: -1 });
  if (u > 5) h += pop(t, q.e5 + 5.0, q.e6, 1500, 400, label(0, 0, '2008 · 제이미 커츠', { size: 40, bg: YEL }), { rot: 3 });
  return h;
}
function qlinesScene(t, lt, a) {
  const q = TL.q, G = 1000; let h = qBG('url(#sunset)') + clouds(t, 120, 8, 3, 3) + `<rect x="-600" y="870" width="3120" height="600" fill="#8A6F5B"/><rect x="-600" y="870" width="3120" height="14" fill="#6B5444"/>`;
  const sat = clamp((t - q.e6) / 3.0, 0, 1);
  h += shadow(700, G + 4, 70 * 0.88) + Z({ t, seed: 830, x: 700, y: G, s: 0.88, pose: walkPose(t * 5, 0.6), ex: exprAt([[0, '기본']], t), look: [0.8, 0] });
  h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#8A93A6" opacity="${fz((1 - sat) * 0.55)}"/>`;
  if (t < q.e7) h += pop(t, q.e6 + 0.2, q.e7, 960, 190, outlined(0, 0, ['끝을 떠올리면, 지금이 진해진다'], { size: 76, sw: 14, fill: '#fff' }), { rot: -1, bob: 3 });
  const u = t - q.e7;
  [[0.2, '끝이 있어서, 미루지 않는다', '#fff', 190], [3.0, '이별이 있어서, 지금 말한다', GOLD, 330], [5.6, '끝이 있어서, 오늘이다', '#fff', 470]].forEach(([d, txt, c, y], i) => { if (u > d) h += pop(t, q.e7 + d, q.e8, 960, y, outlined(0, 0, [txt], { size: 74, sw: 14, fill: c }), { rot: (i - 1) * 2, bob: 3 }); });
  return h;
}
function qendScene(t, lt, a) {
  const q = TL.q, G = 1000; let h = qBG('url(#sunset)') + `<rect x="-600" y="870" width="3120" height="600" fill="#8A6F5B"/>`;
  h += `<rect x="520" y="660" width="700" height="40" rx="10" fill="#6B4A2E" stroke="${QINK}" stroke-width="7"/><rect x="560" y="700" width="30" height="170" fill="#6B4A2E"/><rect x="1150" y="700" width="30" height="170" fill="#6B4A2E"/>`;
  h += shadow(860, 880, 70 * 0.88) + Z({ t, seed: 840, x: 860, y: 870, s: 0.88, pose: '앉기', ex: exprAt([[0, '기본'], [q.e10 + 1.0, '기본']], t), look: [0.2, -0.2] });
  if (t > q.e10) h += pop(t, q.e11, q.end, 960, 190, outlined(0, 0, ['오늘이, 진짜다.'], { size: 110, sw: 18, fill: GOLD }), { rot: -2, bob: 3 });
  return h + `<rect x="-600" y="-600" width="3120" height="2280" fill="#000" opacity="${fz(prog(t, q.end - 1.0, q.end))}"/>`;
}
function qendcardScene(t, lt, a) {
  const q = TL.q, k = Math.min(prog(t, q.end, q.end + 0.9), 1 - prog(t, q.END - 0.8, q.END));
  return qBG('#000') + qT(960, 540, "오늘, '하필 이 세계라서 다행이다' 싶었던 순간 하나, 댓글로.", 46, `rgb(${Math.round(230 * k)},${Math.round(230 * k)},${Math.round(230 * k)})`, { w: 700 });
}
