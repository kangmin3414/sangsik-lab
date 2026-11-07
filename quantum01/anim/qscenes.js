/* quantum immortality episode: sample scenes (stickman Zero + code graphics). Times are absolute (final-video seconds). */
window.CAMS = window.CAMS || {};
Object.assign(CAMS, { qbrick: [1.0, 1.05, 960, 560], qwave: [1.0, 1.05, 960, 540], qnight: [1.0, 1.06, 960, 540], qtitle: 'fixed', qtree: [1.0, 1.03, 960, 540] });

const QNAVY = '#0B1626', GOLD = '#F7C948';
const qSite = (t) => {
  let h = `<rect x="-600" y="-600" width="3120" height="2280" fill="url(#morning)"/>` + clouds(t, 90, 10, 3, 4);
  for (let i = 0; i < 9; i++) { const x = -80 + i * 240, hh = 260 + (i * 83) % 200; h += `<rect x="${x}" y="${660 - hh}" width="210" height="${hh}" fill="${['#A9C3DA', '#9AB0C8', '#B7C9DC'][i % 3]}" stroke="${INK}" stroke-width="5"/>`; for (let k = 0; k < 4; k++) h += `<rect x="${x + 30 + (k % 2) * 90}" y="${660 - hh + 40 + Math.floor(k / 2) * 80}" width="56" height="44" fill="#E9F2FA" opacity=".8"/>`; }
  // crane + scaffold on the right
  h += `<rect x="1470" y="-40" width="26" height="760" fill="#F2A33A" stroke="${INK}" stroke-width="6"/><rect x="1020" y="40" width="720" height="24" fill="#F2A33A" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 9; i++) h += `<path d="M${1040 + i * 80} 64 L${1080 + i * 80} 40" stroke="${INK}" stroke-width="4"/>`;
  // hoarding wall (blue panels with hazard stripe) + sidewalk
  h += `<rect x="-600" y="470" width="2800" height="410" fill="#4F86C6" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 16; i++) h += `<line x1="${-420 + i * 250}" y1="470" x2="${-420 + i * 250}" y2="880" stroke="${INK}" stroke-width="5" opacity=".55"/>`;
  for (let i = 0; i < 40; i++) h += `<path d="M${-600 + i * 80} 470 l40 0 l-40 40 l-40 0 z" fill="${i % 2 ? '#FFD25A' : INK}" opacity=".95"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#B8B0A4" stroke="${INK}" stroke-width="6"/>`;
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
const qBrickShape = (rot, sc = 1, fill = '#C45A3A') => `<g transform="rotate(${f1(rot)}) scale(${sc})"><rect x="-70" y="-34" width="140" height="68" rx="6" fill="${fill}" stroke="${INK}" stroke-width="7"/><line x1="-30" y1="-34" x2="-30" y2="-6" stroke="${INK}" stroke-width="4" opacity=".5"/><line x1="25" y1="6" x2="25" y2="34" stroke="${INK}" stroke-width="4" opacity=".5"/></g>`;

/* ---- 0.8 .. 14.1  site, brick ---- */
function qbrickScene(t, lt, a) {
  const T0 = 0.8, HIT = 8.5, HX = 1060, G = 1000;
  let sh = 0;
  if (t > HIT && t < HIT + 0.45) sh = Math.sin((t - HIT) * 90) * 9 * (1 - (t - HIT) / 0.45);
  let h = `<g transform="translate(${f1(sh)} ${f1(sh * 0.6)})">` + qSite(t);
  const walking = t < HIT, zx = walking ? 240 + (t - T0) * 100 : 240 + (HIT - T0) * 100 - Math.min(1, (t - HIT) * 3) * 6;
  const ex = exprAt([[0, '기본'], [6.9, '기본'], [HIT, '놀람'], [12.4, '걱정']], t);
  if (t < 12.4 || t > 14.2) {
    // warning shadow on the ground, growing until the brick lands
    if (t > 6.6 && t < HIT) { const k = prog(t, 6.6, HIT); h += `<ellipse cx="${HX}" cy="${G - 4}" rx="${f1(14 + 70 * k)}" ry="${f1(3 + 10 * k)}" fill="#000" opacity="${f1(0.15 + 0.25 * k)}"/>`; }
    h += qZeroPhone(t, zx, G, 0.84, walking, ex, t > HIT ? [0.7, 0.9] : null);
    // the brick falls
    if (t > 6.9 && t < HIT) { const k = prog(t, 6.9, HIT), y = lerp(-160, G - 40, k * k); h += `<g transform="translate(${HX} ${f1(y)})">${qBrickShape(t * 280)}</g>`; }
    if (t >= HIT && t < 12.4) {
      const e = t - HIT, parts = [[-1.0, -0.9, 40, 22, 120], [0.9, -1.3, 52, 26, -200], [1.6, -0.7, 34, 20, 300], [-1.6, -0.5, 28, 16, -260], [0.2, -1.6, 44, 24, 160], [2.2, -0.3, 24, 14, -340], [-0.5, -1.1, 30, 18, 220]];
      parts.forEach(([vx, vy, w, hh, w0]) => {
        const x = HX + vx * 180 * Math.min(e, 1.2), yy = Math.min(G - hh / 2, G - 30 + (vy * 380 * e + 520 * e * e)), rest = yy >= G - hh / 2 - 1;
        h += `<rect x="${f1(-w / 2)}" y="${f1(-hh / 2)}" width="${w}" height="${hh}" rx="4" fill="#C45A3A" stroke="${INK}" stroke-width="6" transform="translate(${f1(x)} ${f1(yy)}) rotate(${f1(rest ? w0 : w0 * Math.min(e, 0.6))})"/>`;
      });
      for (let i = 0; i < 5; i++) h += puff(HX + (i - 2) * 70, G - 30 - e * 20, t, HIT + 0.02 * i, 1.1 + i * 0.1, '#E7E0D2');
      h += pop(t, HIT, 11.6, HX - 40, 560, outlined(0, 0, ['쾅!'], { size: 100, sw: 16, fill: YEL }), { rot: -8, wobble: 2 });
      if (t < HIT + 0.12) h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#fff" opacity="${f1((1 - (t - HIT) / 0.12) * 70) / 100}"/>`;
    }
  }
  // 12.4 .. 14.1: "one step earlier" ghost under the falling brick
  if (t >= 12.4) {
    const k = prog(t, 12.4, 13.4);
    h += `<g opacity="${f1(0.28 + 0.2 * Math.sin(t * 5)) }">${shadow(HX, G + 4, 70 * 0.84)}${Z({ t, seed: 701, x: HX, y: G, s: 0.84, pose: '서기', ex: exprAt([[0, '놀람']], t), look: [0, -0.8] })}</g>`;
    h += `<g transform="translate(${HX} ${f1(lerp(-80, 330, easeOut(k)))})" opacity=".55">${qBrickShape(12)}</g>`;
    h += pop(t, 12.6, 14.4, HX + 180, 470, outlined(0, 0, ['한 걸음만…'], { size: 60, sw: 12, fill: '#fff' }), { rot: 5, bob: 3 });
    h += Z({ t, seed: 702, x: 540, y: G, s: 0.84, pose: '서기', ex: exprAt([[0, '걱정']], t), look: [0.8, -0.1] });
  }
  return h + `</g>`;
}

/* ---- 14.1 .. 20.9  "I'm fine", mom is not told ---- */
function qwaveScene(t, lt, a) {
  const G = 1000; let h = qSite(t);
  const wv = t < 18.0, zx = 600;
  const pose = wv ? poseAt([[0, '서기'], [14.4, '만세']], t, 0.3) : P['주머니'];
  h += shadow(zx, G + 4, 70 * 0.84) + Z({ t, seed: 710, x: zx, y: G, s: 0.84, pose, ex: exprAt([[0, '기본'], [18.1, '걱정']], t), look: [0.4, 0] });
  if (wv) h += pop(t, 14.5, 17.9, zx + 230, 480, label(0, 0, '괜찮아요, 괜찮아요', { size: 46, bg: '#fff' }), { rot: 3, bob: 4 });
  // phone with "엄마": a message typed and erased
  if (t >= 17.8) {
    const draft = '오늘 공사장에서 벽돌이', n = Math.floor(clamp((t - 18.5) / 1.1, 0, 1) * draft.length), del = t > 20.0 ? Math.floor(clamp((t - 20.0) / 0.6, 0, 1) * n) : 0;
    const txt = draft.slice(0, Math.max(0, n - del));
    const inner = `<rect x="-190" y="-290" width="380" height="580" rx="44" fill="#1F2D44" stroke="${INK}" stroke-width="8"/><rect x="-170" y="-268" width="340" height="536" rx="28" fill="#F6F8FB"/>` +
      `<rect x="-170" y="-268" width="340" height="86" rx="28" fill="#FFD25A"/><text x="0" y="-210" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="42" fill="${INK}">엄마</text>` +
      `<rect x="-150" y="170" width="300" height="70" rx="35" fill="#fff" stroke="#C9D3DF" stroke-width="4"/><text x="-126" y="217" font-family="${FONT}" font-weight="700" font-size="22" fill="${INK}">${txt}${Math.sin(t * 9) > 0 ? '|' : ''}</text>`;
    h += pop(t, 17.8, 20.9, 1380, 560, inner, { rot: 3, bob: 3 });
  }
  return h;
}

/* ---- 20.9 .. 28.1  night, the thought ---- */
function qnightScene(t, lt, a) {
  let h = `<rect x="-600" y="-600" width="3120" height="2280" fill="#101C30"/>`;
  for (let i = 0; i < 30; i++) h += `<circle cx="${(i * 191) % 1920}" cy="${(i * 97) % 380 + 30}" r="${1.5 + (i % 3)}" fill="#fff" opacity="${f1(0.3 + 0.3 * Math.sin(t * 2 + i)) }"/>`;
  h += `<rect x="1300" y="130" width="360" height="300" rx="14" fill="#16294A" stroke="${INK}" stroke-width="7"/><circle cx="1500" cy="250" r="54" fill="#F3EBC9"/><circle cx="1524" cy="236" r="46" fill="#16294A"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#2A2340"/>`;
  h += `<rect x="260" y="700" width="760" height="190" rx="22" fill="#5C6FA8" stroke="${INK}" stroke-width="7"/><rect x="240" y="640" width="150" height="250" rx="22" fill="#E9E4F5" stroke="${INK}" stroke-width="7"/>`;
  h += shadow(560, 902, 70 * 0.84) + Z({ t, seed: 720, x: 560, y: 760, s: 0.84, pose: '앉기', ex: exprAt([[0, '걱정']], t), look: [0.2, -0.5] });
  // thought bubble
  const k = easeOutBack(prog(t, 23.2, 23.9));
  if (t > 23.2) {
    const cx = 1060, cy = 400;
    h += `<g opacity="${f1(clamp(k, 0, 1) * 100) / 100}"><circle cx="720" cy="590" r="14" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="780" cy="530" r="22" fill="#fff" stroke="${INK}" stroke-width="5"/>` +
      `<ellipse cx="${cx}" cy="${cy}" rx="360" ry="190" fill="#fff" stroke="${INK}" stroke-width="7"/>` +
      `<line x1="${cx - 260}" y1="${cy + 130}" x2="${cx + 300}" y2="${cy + 130}" stroke="#B8B0A4" stroke-width="10"/>` +
      `<g transform="translate(${cx - 70} ${cy + 130})">${shadow(0, 4, 40)}${Z({ t, seed: 721, x: 0, y: 0, s: 0.4, pose: '서기', ex: exprAt([[0, '기본']], t), look: [0.5, 0] })}</g>` +
      `<g transform="translate(${cx + 130} ${cy + 130})" opacity="${f1(0.55 + 0.3 * Math.sin(t * 4)) }">${Z({ t, seed: 722, x: 0, y: 0, s: 0.4, pose: '서기', ex: exprAt([[0, '놀람']], t), look: [0, -0.5] })}</g>` +
      `<g transform="translate(${cx + 130} ${f1(cy - 150 + 40 * Math.sin(t * 3))})">${qBrickShape(10, 0.55)}</g>` +
      `<text x="${cx + 130}" y="${cy - 40}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="96" fill="${PINK}" stroke="${INK}" stroke-width="8" paint-order="stroke">?</text></g>`;
  }
  const fade = prog(t, 27.4, 28.1);
  return h + `<rect x="-600" y="-600" width="3120" height="2280" fill="#000" opacity="${f1(fade * 100) / 100}"/>`;
}

function qtitleScene(t, lt, a) {
  const k = Math.min(prog(t, 28.1, 28.6), 1 - prog(t, 31.2, 31.7)), g = Math.round(255 * k);
  return `<rect x="-600" y="-600" width="3120" height="2280" fill="#000"/>` +
    `<text x="960" y="520" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="150" fill="rgb(${g},${g},${g})">나는 죽을 수 없다.</text>` +
    `<text x="960" y="620" text-anchor="middle" font-family="${FONT}" font-weight="500" font-size="34" fill="rgb(${Math.round(g * .55)},${Math.round(g * .55)},${Math.round(g * .55)})">상상 실험입니다. 증명되지 않은 가설이에요.</text>`;
}

/* ---- 76.7 .. 100.9  branching worlds, the survivor ---- */
const QTREE = (() => {
  const segs = [], path = [1, 0, 1, 1, 0, 1];
  (function grow(x, y, ang, len, d, surv, id) {
    const x1 = x + Math.sin(ang) * len, y1 = y - Math.cos(ang) * len;
    segs.push({ x0: x, y0: y, x1, y1, d, surv, id });
    if (d < 6) {
      const sp = 0.52 - d * 0.045;
      [0, 1].forEach(c => grow(x1, y1, ang + (c ? sp : -sp), len * 0.79, d + 1, surv && c === path[d], id + c));
    }
  })(960, 1010, 0, 190, 0, true, 'r');
  return segs;
})();
function qtreeScene(t, lt, a) {
  const TS = 76.7, T = t - TS;
  const dStart = [-0.2, 0.9, 2.6, 4.3, 5.1, 5.8, 6.4];       // when each depth starts growing (s after TS)
  let h = `<rect x="-600" y="-600" width="3120" height="2280" fill="${QNAVY}"/>`;
  for (let i = 0; i < 36; i++) h += `<circle cx="${(i * 233) % 1920}" cy="${(i * 131) % 760 + 20}" r="${1.2 + (i % 3) * 0.8}" fill="#fff" opacity="${f1(0.18 + 0.15 * Math.sin(t * 1.5 + i))}"/>`;
  h += `<rect x="-600" y="1010" width="3120" height="600" fill="#0A1220"/>`;
  // greying schedule (absolute t): victim side first, then every other branch, deeper levels last
  const dieAt = s => { if (!s.surv) { const first = s.id.length >= 2 ? (s.id[1] === '0' ? 88.9 : 0) : 0; return first || 92.4 + (6 - s.d) * 0.55 + (s.id.charCodeAt(s.id.length - 1) % 2) * 0.12; } return 1e9; };
  QTREE.forEach(s => {
    const g = clamp((T - dStart[s.d]) / 0.55, 0, 1); if (g <= 0) return;
    const x1 = lerp(s.x0, s.x1, easeOut(g)), y1 = lerp(s.y0, s.y1, easeOut(g));
    const died = t > dieAt(s) ? clamp((t - dieAt(s)) / 0.7, 0, 1) : 0;
    const w = 20 - s.d * 2.4;
    if (s.surv && t > 92.2) h += `<line x1="${f1(s.x0)}" y1="${f1(s.y0)}" x2="${f1(x1)}" y2="${f1(y1)}" stroke="${GOLD}" stroke-width="${f1(w + 16)}" stroke-linecap="round" opacity=".22"/>`;
    const col = s.surv && t > 92.2 ? GOLD : (died > 0 ? '#4A5568' : (s.d < 2 ? '#E8F1FF' : '#8CC8FF'));
    h += `<line x1="${f1(s.x0)}" y1="${f1(s.y0)}" x2="${f1(x1)}" y2="${f1(y1)}" stroke="${col}" stroke-width="${f1(Math.max(5, w))}" stroke-linecap="round" opacity="${f1(1 - died * 0.7)}"/>`;
    if (s.d === 6 && g >= 1) h += `<circle cx="${f1(s.x1)}" cy="${f1(s.y1)}" r="${s.surv && t > 92.2 ? 13 : 8}" fill="${s.surv && t > 92.2 ? GOLD : (died > 0 ? '#4A5568' : '#fff')}" opacity="${f1(1 - died * 0.6)}"/>`;
  });
  // labels for the first fork
  const L = QTREE.find(s => s.id === 'r0'), R = QTREE.find(s => s.id === 'r1');
  h += pop(t, 77.4, 84.0, L.x1 - 250, L.y1 - 40, label(0, 0, '벽돌에 맞은 세계', { size: 40, bg: '#FF8F7A' }), { rot: -3, bob: 3 });
  h += pop(t, 78.4, 84.0, R.x1 + 250, R.y1 - 40, label(0, 0, '한 뼘 앞에서 깨진 세계', { size: 40, bg: MINT }), { rot: 3, bob: 3 });
  h += pop(t, 80.4, 84.0, 960, 150, outlined(0, 0, ['다세계 해석'], { size: 84, sw: 14, fill: '#fff' }), { rot: -2 });
  h += pop(t, 84.4, 88.2, 960, 150, outlined(0, 0, ['그리고, 섬뜩한 질문 하나.'], { size: 64, sw: 12, fill: YEL }), { rot: 0, bob: 3 });
  // victim side: "can't feel anything"
  if (t > 88.9) h += pop(t, 88.9, 92.0, L.x1 - 230, 640, label(0, 0, '느낄 수 없다', { size: 44, bg: '#9AA4B2' }), { rot: -3 });
  if (t > 92.4) h += pop(t, 92.4, 106, 1480, 640, label(0, 0, '느낄 수 있는 나는 언제나 이 선 위에', { size: 40, bg: GOLD }), { rot: 2, bob: 3 });
  // hazards along the survivor path
  const hz = [[95.8, '계단', 640, 520], [97.2, '비행기', 720, 330], [98.6, '심장', 1250, 600]];
  hz.forEach(([t0, txt, x, y]) => { if (t > t0) { h += pop(t, t0, t0 + 1.4, x, y, outlined(0, 0, [txt], { size: 62, sw: 12, fill: PINK }), { rot: -6, wobble: 3 }); h += `<rect x="-600" y="-600" width="3120" height="2280" fill="#fff" opacity="${f1(Math.max(0, 1 - (t - t0) / 0.15) * 0.25)}"/>`; } });
  // counter
  if (t > 92.4) {
    const k = clamp(Math.floor((t - 92.4) / 0.62), 0, 6), den = Math.pow(2, k + 1);
    h += `<g transform="translate(1560 930)"><rect x="-300" y="-56" width="600" height="112" rx="28" fill="#0A1220" stroke="${GOLD}" stroke-width="6"/><text x="-270" y="-6" font-family="${FONT}" font-weight="700" font-size="30" fill="#CFD8E3">살아남은 나</text><text x="270" y="38" text-anchor="end" font-family="${FONT}" font-weight="900" font-size="64" fill="${GOLD}">1 / ${den}</text></g>`;
  }
  // tiny Zero riding the gold line's tip
  const tip = QTREE.filter(s => s.surv && T > dStart[s.d] + 0.4).pop();
  if (tip) h += `<g transform="translate(${f1(tip.x1)} ${f1(tip.y1 + 6)})">${Z({ t, seed: 730, x: 0, y: 0, s: 0.22, pose: '서기', ex: exprAt([[0, '기본']], t), look: [0, -0.6] })}</g>`;
  return h;
}
