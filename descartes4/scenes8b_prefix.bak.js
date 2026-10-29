/* ---------- experiment 007 v2: clearer scenes, no costume, real story beats ---------- */
Object.assign(CAMS, {
  youth: [1.0, 1.06, 960, 520], reveal: [1.0, 1.04, 960, 520], night: [1.0, 1.12, 900, 600], francine: [1.0, 1.05, 960, 520],
  cogito: [1.0, 1.06, 960, 520], split: [1.0, 1.04, 960, 520], bat: [1.0, 1.03, 960, 520], news: [1.0, 1.04, 960, 520],
  demon: [1.0, 1.05, 960, 520], zipper: [1.0, 1.04, 960, 520], grads: [1.0, 1.04, 960, 520], lamp: [1.0, 1.05, 960, 520]
});
P['내밀기'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [318, 300], [380, 292]], hR: [388, 290] }, LEGS);
P['집기'] = Object.assign({ armL: [[148, 285], [100, 318], [58, 330]], hL: [50, 332], armR: [[252, 285], [278, 345], [284, 398]], hR: [286, 406] }, LEGS);
P['안기'] = Object.assign({ armL: [[148, 285], [134, 340], [176, 360]], hL: [184, 362], armR: [[252, 285], [266, 340], [224, 360]], hR: [216, 362] }, LEGS);
const YD = o => DC(Object.assign({ pencil: false }, o)); // young Descartes, 23
const kidF = o => HALO(char(Object.assign({ goggles: 'none', vest: '#F4B6CB', patch: false, tee: true, vshade: 'rgba(0,0,0,0.14)', longHair: '#5A3A22', dress: '#F4B6CB', ribbon: '#FFD25A' }, o)));
const big = (x, y, lines, o = {}) => outlined(x, y, lines, Object.assign({ size: 72, sw: 14 }, o));
const ground = (y, c) => `<rect x="-600" y="${y}" width="3120" height="900" fill="${c}"/><line x1="-600" y1="${y}" x2="2520" y2="${y}" stroke="${INK}" stroke-width="7"/>`;
function chair(x, y, s, c = '#B98A5A') { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-70" y="-260" width="20" height="260" rx="6" fill="${c}" stroke="${INK}" stroke-width="6"/><rect x="50" y="-260" width="20" height="260" rx="6" fill="${c}" stroke="${INK}" stroke-width="6"/><rect x="-74" y="-262" width="148" height="26" rx="8" fill="${c}" stroke="${INK}" stroke-width="6"/><rect x="-74" y="-200" width="148" height="18" rx="6" fill="${c}" stroke="${INK}" stroke-width="5"/><rect x="-84" y="-120" width="168" height="26" rx="8" fill="${c}" stroke="${INK}" stroke-width="6"/><rect x="-80" y="-94" width="18" height="94" rx="6" fill="${c}" stroke="${INK}" stroke-width="5"/><rect x="62" y="-94" width="18" height="94" rx="6" fill="${c}" stroke="${INK}" stroke-width="5"/></g>`; }
function leaves(t, seed, n, box) {
  let h = '';
  for (let i = 0; i < n; i++) {
    const k = ((t * 0.09 + hash(seed + i * 1.9)) % 1), x = box[0] + hash(seed + i * 2.7) * box[2] + Math.sin(t * 1.4 + i) * 40, y = box[1] + k * box[3];
    h += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(t * 60 + i * 47)})" opacity="${f1(Math.sin(k * Math.PI) * 90) / 100}"><path d="M0 -18 Q16 -4 0 18 Q-16 -4 0 -18 Z" fill="${['#D9822B', '#C9562E', '#E0A841'][i % 3]}" stroke="${INK}" stroke-width="3"/></g>`;
  }
  return h;
}
function signpost(x, y, t) {
  let h = `<rect x="${x - 12}" y="${y - 420}" width="24" height="420" rx="6" fill="${WALNUT}" stroke="${INK}" stroke-width="6"/>`;
  [[-1, -380, -6], [1, -300, 5], [-1, -220, 3]].forEach(([d, yy, r], i) => {
    const sw = Math.sin(t * 1.3 + i) * 1.5;
    h += `<g transform="translate(${x} ${y + yy}) rotate(${f1(r + sw)})"><path d="M0 -30 L${d * 190} -30 L${d * 230} 0 L${d * 190} 30 L0 30 Z" fill="#E8C98E" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>${T8(d * 110, 20, '?', { size: 54 })}</g>`;
  });
  return h;
}
function bookG(x, y, s, open = 1, c = '#8A4B32') { // open=1 open book, 0 closed
  const a = lerp(0, 1, open);
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M0 -10 Q-80 ${f1(-30 * a)} ${f1(-170 * a - 6)} ${f1(-10 * a)} L${f1(-170 * a - 6)} 90 Q-80 70 0 90 Z" fill="#FFF8E8" stroke="${INK}" stroke-width="6"/><path d="M0 -10 Q80 -30 170 -10 L170 90 Q80 70 0 90 Z" fill="#FFF8E8" stroke="${INK}" stroke-width="6"/>${[0, 1, 2].map(i => `<line x1="30" y1="${14 + i * 22}" x2="140" y2="${10 + i * 22}" stroke="#C9B89A" stroke-width="5"/>`).join('')}<rect x="-8" y="-14" width="16" height="108" rx="5" fill="${c}" stroke="${INK}" stroke-width="5"/></g>`;
}
function soldierHat(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><ellipse cx="0" cy="0" rx="150" ry="34" fill="#3A2E28" stroke="${INK}" stroke-width="6"/><path d="M-84 -6 Q-80 -96 0 -100 Q80 -96 84 -6 Z" fill="#3A2E28" stroke="${INK}" stroke-width="6"/><path d="M40 -80 Q120 -170 190 -140 Q140 -120 70 -60 Z" fill="#E8E4D8" stroke="${INK}" stroke-width="5"/></g>`; }
function strike(x1, y1, x2, k, c = RED) { if (k <= 0) return ''; return `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(lerp(x1, x2, clamp(k, 0, 1)))}" y2="${f1(y1)}" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(lerp(x1, x2, clamp(k, 0, 1)))}" y2="${f1(y1)}" stroke="${c}" stroke-width="9" stroke-linecap="round"/>`; }
function timerG(x, y, txt, o = {}) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${o.s || 1})"><rect x="-22" y="-112" width="44" height="26" rx="8" fill="${INK}"/><circle r="94" fill="#fff" stroke="${INK}" stroke-width="9"/><circle r="78" fill="none" stroke="${o.ring || MINT}" stroke-width="10" stroke-dasharray="${f1(490 * (o.k == null ? 1 : o.k))} 600" transform="rotate(-90)"/>${T8(0, 18, txt, { size: 52 })}</g>`; }
function pointHand(x, y, s, rot = -35) { // close-up hand with a pointing finger; tip at (x, y)
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})"><rect x="-58" y="150" width="116" height="520" rx="40" fill="${TEE}" stroke="${INK}" stroke-width="8"/><path d="M-58 190 L58 190" stroke="rgba(150,60,0,0.3)" stroke-width="14"/><circle cx="0" cy="150" r="70" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="-20" y="0" width="40" height="130" rx="20" fill="#fff" stroke="${INK}" stroke-width="8"/><ellipse cx="-62" cy="120" rx="22" ry="36" transform="rotate(-30 -62 120)" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-30 196 Q0 210 30 196" fill="none" stroke="#C9D6E2" stroke-width="6" stroke-linecap="round"/></g>`;
}

/* ---------- youth: the young man who doubted ---------- */
function youthScene(t, lt, a) {
  const D = D_(a);
  if (a.k === 1) { // the best school in Europe -> only more doubt
    let h = BG('url(#dusk8)') + BG('url(#paper)') + ground(880, '#CDBB98');
    h += `<path d="M120 880 L120 420 L260 330 L400 420 L400 880 Z" fill="#B9A688" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) h += `<path d="M${170 + i * 120} ${520 + j * 120} L${170 + i * 120} ${470 + j * 120} Q${200 + i * 120} ${440 + j * 120} ${230 + i * 120} ${470 + j * 120} L${230 + i * 120} ${520 + j * 120} Z" fill="#6E5E4A" stroke="${INK}" stroke-width="5"/>`;
    h += `<path d="M100 425 L260 315 L420 425" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><rect x="236" y="250" width="48" height="80" fill="#B9A688" stroke="${INK}" stroke-width="6"/>`;
    h += pop(t, t - lt + 0.15, t + 99, 290, 190, label(0, 0, '유럽 최고의 학교', { size: 38, bg: '#fff' }), {});
    for (let i = 0; i < 6; i++) h += `<rect x="${570 + (i % 2) * 8}" y="${900 - (i + 1) * 30}" width="200" height="28" rx="5" fill="${['#8A4B32', '#3E5C8A', '#5E7A3A'][i % 3]}" stroke="${INK}" stroke-width="5"/>`;
    h += YD({ t, seed: 901, x: 860, y: 960, s: 0.74, pose: '책상', ex: exprAt([[0, '결심'], [0.5 * D, '걱정']], lt), look: [0.2, 0.7], sil: 1 });
    h += bookG(860, 700, 0.62, 1);
    const k = easeOut(prog(lt, 0.35 * D, 0.95 * D));
    const cx = 1450, cy = 470;
    h += `<circle cx="${cx}" cy="${cy}" r="${f1(110 + 210 * k)}" fill="#E9E4F4" stroke="${INK}" stroke-width="7" opacity=".95"/>` + (k > 0.55 ? T8(cx, cy - 70 - 190 * k + 40, '모르는 것', { size: 40, fill: '#5B3A8E' }) : '');
    h += `<circle cx="${cx}" cy="${cy + 40}" r="${f1(80 + 20 * k)}" fill="${MINT}" stroke="${INK}" stroke-width="7"/>${T8(cx, cy + 54, '아는 것', { size: 38 })}`;
    h += qmarks(t, 15, 8, [cx - 260, cy - 260, 520, 420], { size: 50, speed: 0.1, op: 0.6 * k + 0.1 });
    if (lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, cx, 880, label(0, 0, '배울수록, 모르는 게 더 보여', { size: 38, bg: YEL }), {});
    return h;
  }
  if (a.k === 2) { // close the book, read "the great book of the world"
    let h = BG('url(#dusk8)') + BG('url(#paper)');
    const close = easeInOut(prog(lt, 0.05 * D, 0.22 * D));
    h += `<rect x="760" y="170" width="1000" height="640" rx="26" fill="#F3E6CC" stroke="${INK}" stroke-width="8"/>`;
    h += `<path d="M820 640 Q860 420 1000 360 Q1080 250 1240 240 Q1400 230 1480 330 Q1620 360 1680 480 Q1700 620 1600 700 Q1400 760 1200 740 Q980 760 820 640 Z" fill="#CFE0B0" stroke="${INK}" stroke-width="6"/>`;
    const pins = [['프랑스', 1000, 620], ['네덜란드', 1190, 330], ['독일', 1460, 430]];
    const pk = prog(lt, 0.3 * D, 0.85 * D), pts = [];
    for (let s = 0; s <= 1.0001; s += 0.02) { const seg = Math.min(1, Math.floor(s * 2)), u = s * 2 - seg, A = pins[seg], B = pins[Math.min(2, seg + 1)]; pts.push([lerp(A[1], B[1], u), lerp(A[2], B[2], u) - Math.sin(u * Math.PI) * 60]); }
    const n = Math.max(2, Math.floor(pts.length * pk));
    if (pk > 0) h += `<polyline points="${pts.slice(0, n).map(p => p.map(f1).join(',')).join(' ')}" fill="none" stroke="${RED}" stroke-width="8" stroke-dasharray="16 12" stroke-linecap="round"/>`;
    pins.forEach(([nm, x, y], i) => { const at = 0.3 * D + i * 0.27 * D; if (lt > at - 0.2) h += pop(t, t - lt + Math.max(0, at - 0.2), t + 99, x, y, `<circle r="16" fill="${RED}" stroke="${INK}" stroke-width="5"/>` + `<g transform="translate(0 -56)">${label(0, 0, nm, { size: 34, bg: '#fff' })}</g>`, {}); });
    h += pop(t, t - lt + 0.15 * D, t + 99, 1260, 110, label(0, 0, '세상이라는 큰 책', { size: 44, bg: YEL }), {});
    h += `<path d="M190 880 L210 600 L250 600 L270 880 Z" fill="${WALNUT}" stroke="${INK}" stroke-width="6"/><path d="M120 600 L340 600 L320 560 L140 560 Z" fill="#8C6638" stroke="${INK}" stroke-width="6"/>` + bookG(230, 520, 0.8, 1 - close);
    if (close > 0.98) h += pop(t, t - lt + 0.22 * D, t + 99, 230, 400, outlined(0, 0, ['탁!'], { size: 56, sw: 12, fill: '#fff' }), { rot: -8 });
    const hatOn = lt > 0.6 * D;
    h += YD({ t, seed: 902, x: 520, y: 960, s: 0.66, pose: lt > 0.3 * D ? walkPose(t * 7, 0.7) : '서기', ex: exprAt([[0, '결심']], t), look: [0.7, -0.2], sil: 1 });
    if (hatOn) h += pop(t, t - lt + 0.6 * D, t + 99, 520, 960 - 0.66 * 500, soldierHat(0, 0, 0.62), { noPop: true, inDur: 0.3 });
    if (hatOn) h += pop(t, t - lt + 0.66 * D, t + 99, 520, 470, label(0, 0, '여행 · 군대', { size: 36, bg: '#fff' }), {});
    return h;
  }
  // k0: a young man at a crossroads, about 400 years ago
  let h = BG('url(#dusk8)') + BG('url(#paper)') + ground(880, '#CDBB98');
  h += `<path d="M960 880 L700 1500 M960 880 L1220 1500 M960 880 L-200 1100 M960 880 L2100 1080" stroke="#E7D8B8" stroke-width="40" opacity=".7"/>`;
  h += signpost(1180, 880, t);
  h += qmarks(t, 5, 9, [300, 180, 1300, 560], { size: 60, speed: 0.07, op: 0.5 });
  h += YD({ t, seed: 900, x: 760, y: 960, s: 0.82, pose: '턱괴기', ex: exprAt([[0, '걱정']], t), look: [0.8, -0.5], sil: 1 });
  h += pop(t, t - lt + 0.15, t + 99, 960, 150, big(0, 0, [[['약 ', '#fff'], ['400년 전', YEL]]], { size: 92, sw: 18 }), {});
  if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 400, 330, label(0, 0, '스물세 살 청년', { size: 40, bg: '#fff' }), { rot: -2 });
  return h;
}

/* ---------- 1619: the stove-heated room (still a silhouette) ---------- */
const _dcOld = dcScene;
dcScene = function (t, lt, a) {
  const D = D_(a);
  if (a.k === 2) {
    let h = study8(t) + snowWindow(1260, 180, 380, 320, t, false) + `<g opacity="${f1(prog(lt, 0.5 * D, 0.75 * D) * 100) / 100}">${snowWindow(1260, 180, 380, 320, t, true)}</g>`;
    h += stove(470, 880, t);
    h += YD({ t, seed: 701, x: 1060, y: 960, s: 0.78, pose: '턱괴기', ex: exprAt([[0, '기본'], [0.5 * D, '결심']], lt), look: [-0.4, -0.5], sil: 1 });
    h += deskG(1180, 720) + candle(1380, 720, t) + `<rect x="1040" y="710" width="150" height="10" rx="3" fill="#F3E6CC" stroke="${INK}" stroke-width="3"/>`;
    h += pop(t, t - lt + 0.2, t + 99, 960, 110, label(0, 0, '1619년 겨울 · 독일의 작은 마을', { size: 40, bg: YEL }), {});
    const dk = prog(lt, 0.35 * D, 0.9 * D);
    if (dk > 0) h += pop(t, t - lt + 0.35 * D, t + 99, 820, 330, `<g>${wallClock(0, 0, 66, 9 + dk * 12, (dk * 720) % 60)}</g>`, {}) + pop(t, t - lt + 0.42 * D, t + 99, 820, 440, label(0, 0, '하루 종일', { size: 34, bg: '#fff' }), {});
    return h;
  }
  if (a.k === 3) {
    let h = BG('#3B2E50') + BG('url(#dots)');
    h += `<circle cx="960" cy="560" r="520" fill="url(#warm)" opacity=".75"/>`;
    h += qmarks(t, 7, 18, [80, 80, 1760, 760], { size: 70, speed: 0.1 });
    h += YD({ t, seed: 704, x: 960, y: 960, s: 0.85, pose: lt > 0.35 * D ? '만세' : '서기', ex: exprAt([[0, '결심'], [0.35 * D, '신남']], lt), sil: 1 });
    if (lt > 0.3 * D) h += pop(t, t - lt + 0.3 * D, t + 99, 960, 160, big(0, 0, [[['조금이라도 의심되면, ', '#fff'], ['전부 의심!', YEL]]], { size: 70 }), {});
    return h;
  }
  return _dcOld(t, lt, a);
};

/* ---------- reveal: the young man is René Descartes ---------- */
function revealScene(t, lt, a) {
  const D = D_(a);
  let h = BG(PARCH) + BG('url(#paper)') + ground(900, '#D8C49E');
  const col = easeInOut(prog(lt, 0.1, 1.3));
  h += `<circle cx="500" cy="560" r="${f1(260 + 120 * col)}" fill="url(#warm)" opacity="${f1(col * 70) / 100}"/>`;
  h += shadow(500, 962, 110) + DC({ t, seed: 705, x: 500, y: 960, s: 0.86, pose: lt > 0.5 * D ? '손인사' : '서기', ex: exprAt([[0, '기본'], [1.3, '뿌듯']], lt), look: [0.6, -0.3], sil: 1 - col });
  if (lt > 0.9) h += pop(t, t - lt + 0.9, t + 99, 500, 150, label(0, 0, '르네 데카르트', { size: 56, bg: YEL }), {});
  if (lt > 1.4) h += pop(t, t - lt + 1.4, t + 99, 500, 250, label(0, 0, '1596–1650 · 프랑스 철학자', { size: 34, bg: '#fff' }), {});
  if (lt > 0.42 * D) {
    h += pop(t, t - lt + 0.42 * D, t + 99, 0, 0, chalkboard(900, 180, 860, 580), { noPop: true, inDur: 0.3 });
    const k = easeOut(prog(lt, 0.48 * D, 0.72 * D)), ox = 1000, oy = 680;
    for (let i = 1; i < 9; i++) h += `<line x1="${ox + i * 80}" y1="${oy}" x2="${ox + i * 80}" y2="${f1(oy - 400 * k)}" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>`;
    for (let i = 1; i < 6; i++) h += `<line x1="${ox}" y1="${oy - i * 80}" x2="${f1(ox + 660 * k)}" y2="${oy - i * 80}" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>`;
    h += `<line x1="${ox - 40}" y1="${oy}" x2="${f1(ox + 690 * k)}" y2="${oy}" stroke="#F4F1EA" stroke-width="7" stroke-linecap="round"/><line x1="${ox}" y1="${oy + 40}" x2="${ox}" y2="${f1(oy - 440 * k)}" stroke="#F4F1EA" stroke-width="7" stroke-linecap="round"/>`;
    if (k > 0.95) h += T8(1700, 660, 'x', { size: 56, fill: '#F4F1EA' }) + T8(1040, 262, 'y', { size: 56, fill: '#F4F1EA' });
    const pk = prog(lt, 0.7 * D, 0.82 * D);
    if (pk > 0) {
      const px = ox + 4 * 80, py = oy - 3 * 80;
      h += `<line x1="${px}" y1="${oy}" x2="${px}" y2="${py}" stroke="${YEL}" stroke-width="5" stroke-dasharray="14 10" opacity="${pk}"/><line x1="${ox}" y1="${py}" x2="${px}" y2="${py}" stroke="${YEL}" stroke-width="5" stroke-dasharray="14 10" opacity="${pk}"/>`;
      h += pop(t, t - lt + 0.7 * D, t + 99, px, py, `<circle r="16" fill="${YEL}" stroke="${INK}" stroke-width="5"/>${T8(80, -20, '(4, 3)', { size: 40, fill: YEL })}`, {});
    }
    if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 1330, 850, label(0, 0, 'x·y 좌표 = 데카르트 좌표계', { size: 40, bg: MINT }), {});
  }
  return h;
}

/* ---------- title: no costume; vertical list of the five days ---------- */
const LIST8B = ['안다고 생각하는 것 의심하기', '바로 떠오른 답 의심하기', '큰 문제는 잘게 나누기', '눈에 보이는 것도 의심하기', '정했으면 곧장 걷기'];
titleScene = function (t, lt, a) {
  let h = BG('url(#labG)') + BG('url(#grid)');
  h += particles(t, 5, 40, [0, 0, 1920, 1080], MINT, { speed: 40, r: 4, op: 0.6 });
  if (a.list) {
    h += big(960, 120, ['만약에, 데카르트처럼 모든 걸 의심한다면?'], { size: 56, sw: 12, fill: YEL });
    LIST8B.forEach((it, i) => {
      const at = 0.15 * (a._dur || 8) + i * 0.45; if (lt < at) return;
      const k = easeOutBack(clamp((lt - at) / 0.4, 0, 1)), y = 270 + i * 118;
      h += `<g opacity="${f1(clamp(k, 0, 1) * 100) / 100}" transform="translate(${f1(lerp(-120, 0, clamp(k, 0, 1)))} 0)">${label(330, y, (i + 1) + '일 차', { size: 40, bg: i === 4 ? YEL : MINT })}${T8(450, y + 18, it, { anchor: 'start', size: 54, fill: '#fff' })}</g>`;
    });
    h += `<ellipse cx="1620" cy="900" rx="220" ry="50" fill="url(#glow)"/>`;
    h += Z({ t, seed: 7, x: 1620, y: 900, s: 0.62, pose: '손인사', ex: exprAt([[0, '결심'], [2.5, '신남']], lt), look: [-0.6, -0.2] });
    return h;
  }
  h += `<ellipse cx="960" cy="900" rx="320" ry="70" fill="url(#glow)"/><ellipse cx="960" cy="900" rx="260" ry="54" fill="#2E4260" stroke="${INK}" stroke-width="8"/>`;
  h += doctor(520, 960, 0.55, { t, expr: '미소', talk: env(t) });
  h += pop(t, t - lt + 0.2, t + 99, 960, 230, big(0, 0, [[['만약에, ', YEL], ['데카르트처럼', '#fff']], '모든 걸 의심한다면?'], { size: 92, sw: 18 }), {});
  const land = 1.2;
  h += Z({ t, seed: 7, x: 960, y: 890, s: 0.6, pose: lt > land ? '만세' : '서기', ex: exprAt([[0, '기본'], [land, '신남']], lt) });
  if (lt > land) h += qmarks(t, 3, 7, [700, 420, 520, 360], { size: 56, speed: 0.14 });
  if (lt > land + 0.2) h += pop(t, t - lt + land + 0.2, t + 99, 1380, 600, label(0, 0, '의심 실험 5일', { size: 40, bg: YEL }), { rot: 4, bob: 4 });
  return h;
};

/* ---------- myth: bricks fall and pile on the ground ---------- */
function houseG2(x, y, s, crack = 0, built = 1) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) {
    const idx = r * 6 + c; if (idx / 36 > built) continue;
    const fall = crack > 0 ? easeIn(clamp(crack * 1.6 - hash(idx) * 0.6, 0, 1)) : 0;
    const layer = r < 2 ? r : Math.floor(hash(idx * 5) * 2);
    const dx = (hash(idx * 3) - 0.5) * 300 * fall, dy = (2 + r * 50 - layer * 46) * fall, rot = (hash(idx * 7) - 0.5) * 70 * fall;
    h += `<rect x="${-180 + c * 60}" y="${-50 - r * 50}" width="58" height="48" rx="4" fill="${crack > 0 ? '#B99A7A' : '#D9805F'}" stroke="${INK}" stroke-width="4" transform="translate(${f1(dx)} ${f1(dy)}) rotate(${f1(rot)} ${-151 + c * 60} ${-26 - r * 50})"/>`;
  }
  if (built >= 1) {
    const rf = crack > 0 ? easeIn(clamp(crack * 1.3, 0, 1)) : 0;
    h += `<path d="M-210 -350 L0 -500 L210 -350 Z" fill="${crack > 0 ? '#8A7A6A' : '#C8423A'}" stroke="${INK}" stroke-width="7" stroke-linejoin="round" transform="translate(${f1(-200 * rf)} ${f1(rf * 345)}) rotate(${f1(-18 * rf)} 0 -400)"/>`;
  }
  return h + `</g>`;
}
houseG = houseG2;
mythScene = function (t, lt, a) {
  const D = D_(a);
  let h = BG('url(#morning)') + ground(880, '#9CCB72') + clouds(t, 80, 20, 3, 4);
  const crack = prog(lt, 0.15 * D, 0.5 * D);
  h += houseG2(520, 880, 0.95, Math.max(0.0001, crack));
  if (lt < 0.2 * D) h += `<path d="M420 660 L470 720 L440 760 L500 820" fill="none" stroke="${INK}" stroke-width="6"/>`;
  h += `<rect x="1180" y="860" width="540" height="56" rx="10" fill="#9AA3AE" stroke="${INK}" stroke-width="8"/>`;
  const bk = prog(lt, 0.5 * D, 0.95 * D);
  if (bk > 0) h += houseG2(1450, 860, 0.95, 0, bk);
  h += pop(t, t - lt + 0.05, t + 99, 520, 170, label(0, 0, '낡은 생각 허물기', { size: 40, bg: '#fff' }), { rot: -2 });
  if (lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 1450, 170, label(0, 0, '튼튼한 바닥부터 다시', { size: 40, bg: MINT }), { rot: 2 });
  if (lt > 0.5 * D) h += T8(1450, 900, '단단한 바닥', { size: 34, fill: '#fff', stroke: INK, sw: 6 });
  h += Z({ t, seed: 710, x: 960, y: 930, s: 0.52, pose: '손인사', ex: exprAt([[0, '놀람'], [0.5 * D, '신남']], lt), look: [lt > 0.45 * D ? 0.8 : -0.8, -0.3] });
  return h;
};

/* ---------- chapter cards: "N일 차" ---------- */
chapterScene = function (t, lt, a) {
  let h = BG(NAVY) + BG('url(#grid)');
  h += particles(t, 9, 30, [0, 0, 1920, 1080], MINT, { speed: 30, r: 4, op: 0.5 });
  const k = easeOut(prog(lt, 0, 0.6));
  h += `<g opacity="${f1(k * 100) / 100}" transform="translate(${f1((1 - k) * -60)} 0)">`;
  h += big(960, 330, [[[a.n + '일 차', YEL]]], { size: 92, sw: 16 });
  h += big(960, 560, [a.name], { size: a.name.length > 11 ? 100 : 116, sw: 22 });
  h += `</g>`;
  for (let i = 1; i <= 5; i++) h += `<circle cx="${960 + (i - 3) * 70}" cy="700" r="${i === a.n ? 16 : 11}" fill="${i <= a.n ? MINT : '#33465F'}" stroke="${INK}" stroke-width="4"/>`;
  const zx = lerp(-200, 2100, prog(lt, 0, 6));
  h += Z({ t, seed: 9, x: zx, y: 880, s: 0.3, pose: walkPose(t * 9, 0.9), ex: exprAt([[0, '기본']], t) });
  return h;
};

/* ---------- day 1: zipper ---------- */
function coatRack(x, y, t, o = {}) { // jacket on a stand; o.zip 0..1 zipper height
  let h = `<rect x="${x - 10}" y="${y - 560}" width="20" height="560" rx="6" fill="${WALNUT}" stroke="${INK}" stroke-width="6"/><ellipse cx="${x}" cy="${y}" rx="90" ry="18" fill="${WALNUT}" stroke="${INK}" stroke-width="6"/><path d="M${x - 50} ${y - 560} Q${x} ${y - 600} ${x + 50} ${y - 560}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
  const jy = y - 540, sw = Math.sin(t * 1.4) * 1.5;
  h += `<g transform="rotate(${f1(sw)} ${x} ${jy})"><path d="M${x - 120} ${jy + 40} Q${x} ${jy - 10} ${x + 120} ${jy + 40} L${x + 150} ${jy + 330} L${x - 150} ${jy + 330} Z" fill="#3E7CC0" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  h += `<path d="M${x - 120} ${jy + 40} L${x - 190} ${jy + 260} L${x - 150} ${jy + 270} L${x - 116} ${jy + 120}" fill="#3568A6" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M${x + 120} ${jy + 40} L${x + 190} ${jy + 260} L${x + 150} ${jy + 270} L${x + 116} ${jy + 120}" fill="#3568A6" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  for (let i = 0; i < 13; i++) h += `<rect x="${x + (i % 2 ? -1 : -13)}" y="${jy + 40 + i * 22}" width="14" height="12" rx="3" fill="#E0E4EA" stroke="${INK}" stroke-width="3"/>`;
  const zy = jy + 40 + 280 * (1 - (o.zip == null ? 1 : o.zip));
  h += `<rect x="${x - 18}" y="${f1(zy)}" width="36" height="30" rx="7" fill="#C9D2DC" stroke="${INK}" stroke-width="5"/><rect x="${x - 7}" y="${f1(zy + 26)}" width="14" height="40" rx="5" fill="#C9D2DC" stroke="${INK}" stroke-width="5"/></g>`;
  return h;
}
const _zipOld = zipperScene;
zipperScene = function (t, lt, a) {
  const D = D_(a);
  if (a.cocky) {
    let h = livingRoom(t, false);
    h += coatRack(1260, 900, t, { zip: 0.5 + 0.5 * Math.sin(t * 2) });
    h += Z({ t, seed: 725, x: 700, y: 950, s: 0.8, pose: lt > 0.2 * D ? '손인사' : '서기', ex: exprAt([[0, '기본'], [0.2 * D, '뿌듯']], lt), look: [0.8, -0.2] });
    if (lt > 0.2 * D) h += pop(t, t - lt + 0.2 * D, t + 99, 640, 300, bubble(0, 0, 420, 130, T8(10, 18, '지퍼쯤이야!', { size: 52 })), { rot: -2, bob: 4 });
    if (lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 860, 120, label(0, 0, '매일 쓰는데, 당연히 알지', { size: 40, bg: YEL }), { rot: 2 });
    return h;
  }
  if (a.zero) {
    let h = livingRoom(t, false);
    h += panel(250, 170, 720, 480, { r: 16 });
    h += T8(300, 250, '지퍼의 원리', { anchor: 'start', size: 48 });
    ['1. 손잡이를 당기면', '2. 이빨들이 맞물려서…', '3. ???'].forEach((ln, i) => { const at = [0.05, 0.28, 0.6][i] * D; if (lt > at) h += T8(300, 350 + i * 92, ln, { anchor: 'start', size: 46, fill: i === 2 ? RED : '#2A3A55', w: 800 }); });
    const stuck = lt > 0.6 * D;
    h += coatRack(1560, 900, t, { zip: stuck ? 0.5 + Math.sin(t * 30) * 0.01 : lerp(0, 0.5, prog(lt, 0.1 * D, 0.6 * D)) });
    h += Z({ t, seed: 722, x: 1220, y: 950, s: 0.8, pose: stuck ? '허우적' : '턱괴기', ex: exprAt([[0, '결심'], [0.6 * D, '걱정']], lt), look: [-0.8, -0.3], sweat: stuck });
    if (stuck) h += qmarks(t, 22, 6, [1060, 380, 340, 220], { size: 56 });
    if (lt > 0.66 * D) h += pop(t, t - lt + 0.66 * D, t + 99, 1250, 320, bubble(0, 0, 440, 120, T8(12, 16, '그다음이 뭐더라?', { size: 44 })), { rot: 2, bob: 4 });
    return h;
  }
  if (a.explain) { // Yale study: confidence before vs after explaining
    let h = BG('#EAF2F8') + BG('url(#paper)');
    h += pop(t, t - lt + 0.1, t + 99, 400, 400, zipperIcon(0, 0, 1.25), {}) + pop(t, t - lt + 0.25, t + 99, 780, 430, toiletIcon(0, 0, 1.2), {}) + pop(t, t - lt + 0.4, t + 99, 1140, 420, lockIcon(0, 0, 1.25), {});
    const k1 = easeOut(prog(lt, 0.12 * D, 0.38 * D)), k2 = easeInOut(prog(lt, 0.55 * D, 0.8 * D));
    const v = lerp(0.12 + 0.7 * k1, 0.32, k2);
    h += `<g transform="translate(760 790) scale(1.3) translate(-760 -790)">` + meter(760, 790, v, k2 > 0.5 ? '설명해 보라고 하자…' : '“이거 잘 알아요!” (자신감)', k2 > 0.5 ? PINK : MINT);
    if (k2 > 0) h += `<line x1="${f1(760 - 280 + 560 * 0.82)}" y1="752" x2="${f1(760 - 280 + 560 * 0.82)}" y2="828" stroke="${INK}" stroke-width="5" stroke-dasharray="8 6" opacity=".6"/>`;
    h += `</g>`;
    if (k2 > 0.6) h += pop(t, t - lt + 0.7 * D, t + 99, 1160, 700, outlined(0, 0, ['뚝!'], { size: 70, sw: 12, fill: YEL }), { rot: 10 });
    h += Z({ t, seed: 721, x: 1580, y: 950, s: 0.6, pose: k2 > 0.3 ? '턱괴기' : '만세', ex: exprAt([[0, '뿌듯'], [0.55 * D, '걱정']], lt), look: [-0.6, -0.3] });
    return h;
  }
  if (a.name) {
    let h = BG(NAVY) + BG('url(#grid)');
    h += pop(t, t - lt + 0.1, t + 99, 960, 180, big(0, 0, [[['안다는 느낌 ', '#fff'], ['≠', YEL], [' 진짜 아는 것', '#fff']]], { size: 80, sw: 16 }), {});
    const k = easeOut(prog(lt, 0.15 * D, 0.55 * D));
    h += vbar(700, 760, 220, 400, 0.95 * k, MINT, '', '안다는 느낌', { bc: '#fff', bs: 42 });
    h += vbar(1220, 760, 220, 400, 0.38 * k, PINK, '', '정말 아는 것', { bc: '#fff', bs: 42 });
    if (lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 960, 900, label(0, 0, '의심은 먼저 나 자신에게', { size: 40, bg: YEL }), {});
    return h;
  }
  return _zipOld(t, lt, a);
};

/* ---------- day 2: bat & ball (Zero stays put; tags persist) ---------- */
batScene = function (t, lt, a) {
  const D = D_(a);
  if (a.elite) {
    let h = BG('#EEF1F6') + BG('url(#paper)');
    const U = [['하버드', '#A51C30', 480], ['MIT', '#8A8B8C', 960], ['프린스턴', '#E87722', 1440]];
    U.forEach(([nm, c, x], i) => {
      const at = 0.12 * D + i * 0.35; if (lt < at) return;
      const k = easeOut(prog(lt, at + 0.3, at + 1.3)), ang = 0.55 * 2 * Math.PI * k;
      const px = Math.sin(ang) * 130, py = -Math.cos(ang) * 130, large = ang > Math.PI ? 1 : 0;
      let g = `<path d="M-90 -320 L90 -290 L-90 -260 Z" fill="${c}" stroke="${INK}" stroke-width="6"/><line x1="-90" y1="-330" x2="-90" y2="-180" stroke="${INK}" stroke-width="8"/>`;
      g += `<circle r="130" fill="#E6F7EF" stroke="${INK}" stroke-width="7"/>`;
      if (k > 0.01) g += `<path d="M0 0 L0 -130 A130 130 0 ${large} 1 ${f1(px)} ${f1(py)} Z" fill="${PINK}" stroke="${INK}" stroke-width="6"/>`;
      g += `<g transform="translate(0 200)">${label(0, 0, nm, { size: 42, bg: '#fff' })}</g>`;
      h += pop(t, t - lt + at, t + 99, x, 560, g, {});
    });
    if (lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, 960, 900, label(0, 0, '절반 넘게, 처음 떠오른 100원', { size: 44, bg: PINK, color: '#fff' }), {});
    return h;
  }
  let h = BG('#F4EFE4') + BG('url(#paper)');
  h += batG(520, 560, 1.0) + ballG(820, 680, 1.05);
  h += pop(t, t - lt + 0.15, t + 99, 660, 190, `<g transform="scale(1.2)">${priceTag(0, 0, '방망이 + 공 = 1,100원', '#fff', -2)}</g>`, {});
  const showQ2 = !a.q || lt > 0.4 * D, zx = 1560, zy = 950, zs = 0.7;
  if (showQ2) h += pop(t, a.q ? t - lt + 0.4 * D : -99, t + 99, 660, 320, `<g transform="scale(1.2)">${priceTag(0, 0, '방망이 = 공 + 1,000원', '#fff', 2)}</g>`, {});
  if (a.ans) {
    const k = prog(lt, 0.3 * D, 0.38 * D);
    h += pop(t, k > 0 ? t - lt + 0.3 * D : -99, t + 99, 1000, 820, k > 0 ? `${`<g transform="scale(1.25)">${priceTag(0, 0, '공 = 50원', MINT, -4)}</g>`}${check(210, -50, 1.0)}` : `<g transform="scale(1.25)">${priceTag(0, 0, '공 = ?', YEL, -4)}</g>`, {});
    h += `<g transform="translate(${zx} 450)">${bubble(0, 0, 300, 130, T8(14, 20, '100원?', { size: 56 }))}${strike(-110, 2, 140, prog(lt, 0.12 * D, 0.2 * D))}</g>`;
    if (lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 1390, 235, panel(-330, -120, 660, 240, { r: 20 }) + T8(0, -40, '공 100원이면 방망이 1,100원', { size: 36 }) + T8(0, 50, '합계 1,200원 ✗', { size: 48, fill: RED }), { rot: 1 });
    h += Z({ t, seed: 733, x: zx, y: zy, s: zs, pose: lt > 0.6 * D ? '손인사' : '턱괴기', ex: exprAt([[0, '신남'], [0.12 * D, '놀람'], [0.6 * D, '뿌듯']], lt), look: [-0.7, -0.2] });
    return h;
  }
  h += pop(t, a.q ? t - lt + 0.7 * D : -99, t + 99, 1000, 820, `<g transform="scale(1.25)">${priceTag(0, 0, '공 = ?', YEL, -4)}</g>`, { bob: 4 });
  if (a.count) {
    const c0 = D + 0.05, n = 3 - Math.floor((lt - c0) / 1.0), frac = ((lt - c0) % 1 + 1) % 1;
    h += Z({ t, seed: 732, x: zx, y: zy, s: zs, pose: '턱괴기', ex: exprAt([[0, '결심']], t), look: [-0.7, -0.3] });
    h += qmarks(t, 33, 5, [zx - 160, 300, 320, 200], { size: 50, speed: 0.15 });
    if (lt < c0) h += pop(t, t - lt + 0.1, t + 99, 1240, 470, timerG(0, 0, '3초', { s: 1.2 }), {});
    else if (n >= 1) h += `<g transform="translate(1240 470) scale(${f1(lerp(1.3, 1.1, easeOut(Math.min(1, frac * 4))) * 100) / 100})">${timerG(0, 0, '', { k: 1 - frac, ring: n === 1 ? PINK : MINT })}${T8(0, 40, String(n), { size: 120 })}</g>`;
    return h;
  }
  h += Z({ t, seed: 732, x: zx, y: zy, s: zs, pose: '턱괴기', ex: exprAt([[0, '결심'], [0.86 * D, '신남']], lt), look: [-0.7, -0.3] });
  return h;
};

/* ---------- news: stamps stay inside the cards; the share-button pause ---------- */
function headline2(x, y, txt, fake, k) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="-300" y="-58" width="600" height="116" rx="18" fill="${k > 0.5 ? (fake ? '#FFF0F4' : '#F0FFF7') : '#fff'}" stroke="${INK}" stroke-width="6"/><rect x="-282" y="-40" width="90" height="80" rx="10" fill="${fake ? '#FFC7D9' : '#C7E7FF'}" stroke="${INK}" stroke-width="4"/>${T8(-176, 11, txt, { anchor: 'start', size: 28 })}`;
  if (k > 0) h += `<g transform="translate(-237 0) scale(${f1(lerp(1.8, 1, easeOutBack(clamp(k, 0, 1))) * 100) / 100})" opacity="${f1(Math.min(1, k * 3) * 100) / 100}"><circle r="34" fill="${fake ? RED : '#1F9D6B'}" stroke="${INK}" stroke-width="5"/>${fake ? `<path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#fff" stroke-width="8" stroke-linecap="round"/>` : `<path d="M-15 0 L-4 12 L16 -12" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`}</g>`;
  return h + `</g>`;
}
newsScene = function (t, lt, a) {
  const D = D_(a);
  if (a.pause) {
    let h = BG('#2A1F4A') + BG('url(#dots)');
    h += `<rect x="770" y="140" width="600" height="700" rx="56" fill="#1F2D44" stroke="${INK}" stroke-width="10"/><rect x="796" y="176" width="548" height="628" rx="34" fill="#F3F6FA"/>`;
    h += `<rect x="796" y="176" width="548" height="70" rx="34" fill="#FFE14D"/><rect x="796" y="216" width="548" height="30" fill="#FFE14D"/>${T8(830, 226, '단톡방 (23)', { anchor: 'start', size: 32 })}`;
    h += `<rect x="830" y="290" width="480" height="300" rx="22" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="852" y="310" width="436" height="150" rx="12" fill="#FFC7D9" stroke="${INK}" stroke-width="4"/>${T8(1070, 420, '!!', { size: 90, fill: RED })}${T8(1070, 520, '[속보] 충격!! 이거 실화?', { size: 34, fill: RED })}${T8(1070, 565, '지금 바로 확인 ▶', { size: 26, fill: '#6B7A8C', w: 700 })}`;
    h += `<rect x="900" y="640" width="340" height="96" rx="48" fill="${MINT}" stroke="${INK}" stroke-width="7"/>` + T8(1070, 703, '공유하기 ↗', { size: 44 });
    const near = easeInOut(prog(lt, 0.03 * D, 0.42 * D)), stop = lt > 0.42 * D;
    const fx = lerp(1900, 1185, near) + (stop ? Math.sin(t * 34) * 2 : 0), fy = lerp(690, 612, near);
    h += pointHand(fx, fy, 0.82, -70);
    if (stop) h += pop(t, t - lt + 0.42 * D, t + 99, 1560, 300, `<g><path d="M-100 -240 L100 -240 L240 -100 L240 100 L100 240 L-100 240 L-240 100 L-240 -100 Z" transform="scale(.6)" fill="${RED}" stroke="${INK}" stroke-width="12"/>${T8(0, 20, '잠깐!', { size: 58, fill: '#fff' })}</g>`, { rot: 8, bob: 3 });
    const sk = prog(lt, 0.64 * D, 0.82 * D);
    if (lt > 0.62 * D) {
      const secs = Math.max(0, 10 - Math.floor(sk * 10));
      h += pop(t, t - lt + 0.62 * D, t + 99, 420, 300, panel(-230, -130, 460, 260, { r: 22 }) + T8(-190, -70, '출처 찾는 중…', { anchor: 'start', size: 34 }) + `<rect x="-190" y="-40" width="380" height="16" rx="8" fill="#E6E0D4"/><rect x="-190" y="-40" width="${f1(380 * sk)}" height="16" rx="8" fill="${MINT}"/>` + [0, 1, 2].map(i => `<rect x="-190" y="${-4 + i * 34}" width="${[300, 240, 330][i]}" height="16" rx="8" fill="#C3CDD8" opacity="${sk > (i + 1) / 4 ? 1 : 0.3}"/>`).join(''), {});
      h += pop(t, t - lt + 0.62 * D, t + 99, 420, 520, timerG(0, 0, secs + '초', { k: 1 - sk }), {});
      h += `<g transform="translate(${f1(560 + Math.sin(t * 3) * 20)} 230) rotate(20)"><rect x="-10" y="36" width="20" height="80" rx="8" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/><circle r="46" fill="#DFF4FF" fill-opacity=".7" stroke="${INK}" stroke-width="8"/></g>`;
    }
    if (lt > 0.84 * D) h += pop(t, t - lt + 0.84 * D, t + 99, 1070, 385, `<g><rect x="-170" y="-50" width="340" height="100" rx="14" fill="#fff" fill-opacity=".85" stroke="${RED}" stroke-width="10"/>${T8(0, 18, '사실 아님', { size: 56, fill: RED })}</g>`, { rot: -10 });
    return h;
  }
  let h = BG('#EAF2F8') + BG('url(#paper)');
  h += `<rect x="190" y="170" width="700" height="700" rx="44" fill="#1F2D44" stroke="${INK}" stroke-width="9"/><rect x="214" y="198" width="652" height="644" rx="28" fill="#F3F6FA"/>`;
  const H = [['[단독] 외계인 서울 착륙?!', 1], ['기상청: 주말 전국에 비', 0], ['○○ 먹으면 하루 만에 10kg?', 1], ['시내버스 요금 조정 예정', 0]];
  H.forEach(([tx, fk], i) => { const at = 0.05 * D + i * 0.18; if (lt > at) h += pop(t, t - lt + at, t + 99, 540, 290 + i * 145, headline2(0, 0, tx, fk, prog(lt, 0.4 * D + i * 0.12 * D, 0.4 * D + i * 0.12 * D + 0.4)), { noPop: true, inDur: 0.25 }); });
  h += Z({ t, seed: 740, x: 1400, y: 950, s: 0.78, pose: '턱괴기', ex: exprAt([[0, '결심'], [0.6 * D, '뿌듯']], lt), look: [-0.7, -0.2] });
  h += pop(t, t - lt + 0.3, t + 99, 1460, 300, bubble(0, 0, 400, 130, T8(14, 18, '한 번 더 의심!', { size: 44 })), { rot: 2, bob: 4 });
  return h;
};

/* ---------- day 3: Zero's messy room, five minutes at a time ---------- */
function messRoom(t, tidyDesk, tidyAll, o = {}) {
  let h = livingRoom(t, false);
  h += deskG(560, 700, 460);
  for (let i = 0; i < 7; i++) { const x0 = 360 + i * 56, gone = tidyDesk > (i + 1) / 8; if (!gone && !(o.flying && o.flying(i))) h += `<rect x="${x0}" y="${650 - (i % 3) * 14}" width="44" height="52" rx="6" fill="${[PINK, YEL, MINT, '#7CC7FF'][i % 4]}" stroke="${INK}" stroke-width="4" transform="rotate(${(i % 2 ? 1 : -1) * 14} ${x0 + 22} 676)"/>`; }
  const piles = [[980, 860, '#8C6BD9'], [1150, 870, '#4FA3E0'], [1330, 855, '#E0884F'], [1500, 868, '#8C6BD9'], [1660, 858, '#4FA3E0'], [760, 872, '#E0884F']];
  piles.forEach(([x0, y0, c], i) => { if (tidyAll <= (i + 1) / (piles.length + 1)) h += `<path d="M${x0 - 80} ${y0 + 14} Q${x0 - 60} ${y0 - 40} ${x0} ${y0 - 30} Q${x0 + 60} ${y0 - 44} ${x0 + 80} ${y0 + 14} Z" fill="${c}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M${x0 - 40} ${y0 - 10} Q${x0} ${y0 - 24} ${x0 + 40} ${y0 - 8}" fill="none" stroke="${INK}" stroke-width="3" opacity=".4"/>`; });
  [[1240, 846, -8], [1420, 852, 6], [880, 850, -4]].forEach(([x0, y0, r], i) => { if (tidyAll <= 0.5 + i * 0.15) h += `<g transform="translate(${x0} ${y0}) rotate(${r})"><rect x="-50" y="-34" width="100" height="68" rx="6" fill="${['#C8423A', '#3E5C8A', '#5E7A3A'][i]}" stroke="${INK}" stroke-width="5"/><rect x="-40" y="-26" width="80" height="52" rx="4" fill="#FFF8E8"/></g>`; });
  return h;
}
const _splitOld = splitScene;
splitScene = function (t, lt, a) {
  const D = D_(a);
  if (a.room && a.intro) {
    let h = messRoom(t, 0, 0);
    h += Z({ t, seed: 770, x: 1250, y: 950, s: 0.8, pose: lt > 0.62 * D ? '손인사' : '웅크림', ex: exprAt([[0, '걱정'], [0.62 * D, '결심']], lt), look: [-0.7, 0.2] });
    if (lt > 0.08 * D && lt < 0.6 * D) h += pop(t, t - lt + 0.08 * D, t + 99, 1260, 300, bubble(0, 0, 440, 130, T8(12, 16, '언제 다 치우지…', { size: 44 })), { rot: 2, bob: 4 });
    if (lt > 0.62 * D) {
      h += pop(t, t - lt + 0.62 * D, t + 99, 560, 330, timerG(0, 0, '5:00'), {});
      h += pop(t, t - lt + 0.72 * D, t + 99, 560, 480, label(0, 0, '책상 위만, 5분!', { size: 42, bg: YEL }), {});
      h += `<rect x="300" y="610" width="520" height="110" rx="16" fill="none" stroke="${YEL}" stroke-width="8" stroke-dasharray="20 12" opacity="${f1((0.6 + 0.4 * Math.sin(t * 5)) * 100) / 100}"/>`;
    }
    return h;
  }
  if (a.room) {
    const tidy = prog(lt, 0.05 * D, 0.5 * D), all = prog(lt, 0.5 * D, 0.85 * D);
    const flying = i => { const st = 0.05 * D + (i / 7) * 0.45 * D; return lt > st && lt < st + 0.35; };
    let h = messRoom(t, tidy, all, { flying });
    h += `<rect x="470" y="800" width="180" height="96" rx="8" fill="#C9A06A" stroke="${INK}" stroke-width="6"/><path d="M470 800 L440 770 M650 800 L680 770" stroke="${INK}" stroke-width="6"/>`;
    for (let i = 0; i < 7; i++) { const st = 0.05 * D + (i / 7) * 0.45 * D, k = (lt - st) / 0.35; if (k > 0 && k < 1) { const x0 = 382 + i * 56, x = lerp(x0, 560, k), y = lerp(670, 820, k) - Math.sin(k * Math.PI) * 120; h += `<rect x="${f1(x - 22)}" y="${f1(y - 26)}" width="44" height="52" rx="6" fill="${[PINK, YEL, MINT, '#7CC7FF'][i % 4]}" stroke="${INK}" stroke-width="4" transform="rotate(${f1(k * 200)} ${f1(x)} ${f1(y)})"/>`; } }
    const reach = Math.sin(lt * 9) > 0;
    const zx = all > 0 ? lerp(900, 1300, easeInOut(all)) : 900;
    h += Z({ t, seed: 771, x: zx, y: 950, s: 0.78, pose: all >= 1 ? '만세' : (all > 0 ? walkPose(t * 8, 0.6) : (reach ? '집기' : '서기')), ex: exprAt([[0, '결심'], [0.5 * D, '신남']], lt), look: [all > 0 ? 0.6 : -0.8, 0] });
    const secs = Math.max(0, 300 - Math.floor(prog(lt, 0.0, 0.85 * D) * 300));
    h += timerG(560, 330, `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`, { k: secs / 300 });
    if (tidy >= 1) h += particles(t, 31, 10, [330, 560, 460, 160], YEL, { speed: 30, r: 6, op: 0.9 });
    if (all >= 1) { h += particles(t, 32, 22, [100, 300, 1700, 560], YEL, { speed: 30, r: 6, op: 0.9 }); h += pop(t, t - lt + 0.85 * D, t + 99, 880, 200, big(0, 0, ['어느새 방 전체가!'], { size: 64, sw: 12, fill: YEL }), { rot: -3 }); }
    return h;
  }
  if (a.start) { // too big to start vs. small steps
    let h = BG('url(#morning)') + ground(880, '#9CCB72') + clouds(t, 90, 16, 3, 7);
    h += `<path d="M120 880 L520 230 L640 360 L760 260 L1080 880 Z" fill="#8E97A6" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M520 230 L470 320 L540 300 L600 350 L640 360 L560 230 Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    h += pop(t, t - lt + 0.1 * D, t + 99, 600, 600, label(0, 0, '방 전체 청소', { size: 40, bg: '#fff' }), {});
    const sk = prog(lt, 0.35 * D, 0.6 * D);
    const steps = ['5분', '10분', '15분', '20분', '25분'];
    steps.forEach((s, i) => { if (sk > i / 5) { const x = 1160 + i * 130, hh = 70 + i * 70; h += `<rect x="${x}" y="${880 - hh}" width="130" height="${hh}" fill="${['#FFD25A', '#FFC24A', '#FFB547', '#FFA347', '#FF9A55'][i]}" stroke="${INK}" stroke-width="7"/>` + T8(x + 65, 880 - hh + 46, s, { size: 34 }); } });
    const go = lt > 0.65 * D, jk = prog(lt, 0.65 * D, 0.8 * D);
    const zx = go ? lerp(1060, 1225, easeInOut(jk)) : 1060, zy = 870 - (go ? Math.sin(jk * Math.PI) * 50 + 70 * easeInOut(jk) : 0);
    h += Z({ t, seed: 772, x: zx, y: zy, s: 0.5, pose: go && jk < 1 ? '점프' : (jk >= 1 ? '만세' : '서기'), ex: exprAt([[0, '걱정'], [0.62 * D, '결심'], [0.8 * D, '신남']], lt), look: [0.8, -0.2] });
    if (lt > 0.15 * D && lt < 0.6 * D) h += pop(t, t - lt + 0.15 * D, t + 99, 860, 170, big(0, 0, [[['게을러서가 아니라, ', '#fff'], ['너무 커 보여서', YEL]]], { size: 60, sw: 12 }), {});
    if (lt > 0.72 * D) h += pop(t, t - lt + 0.72 * D, t + 99, 1400, 260, big(0, 0, [[['작게 자르면, ', '#fff'], ['발이 먼저!', YEL]]], { size: 64, sw: 13 }), {});
    return h;
  }
  return _splitOld(t, lt, a);
};

/* ---------- day 4: the deceiving demon (puppet strings) then the dream ---------- */
demonScene = function (t, lt, a) {
  const D = D_(a);
  const dream = prog(lt, 0.53 * D, 0.6 * D);
  let h = '';
  if (dream < 1) {
    let g = BG('#1E1530') + BG('url(#dots)');
    g += `<rect x="-600" y="840" width="3120" height="700" fill="#2B2140"/><line x1="-600" y1="840" x2="2520" y2="840" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M-600 -600 L380 -600 Q300 300 420 860 L-600 860 Z" fill="#7A2E3E" stroke="${INK}" stroke-width="8"/><path d="M2520 -600 L1540 -600 Q1620 300 1500 860 L2520 860 Z" fill="#7A2E3E" stroke="${INK}" stroke-width="8"/>`;
    const lift = easeInOut(prog(lt, 0.3 * D, 0.45 * D));
    g += `<circle cx="960" cy="640" r="${f1(260 * lift)}" fill="#FFF3B0" opacity="${f1(lift * 18) / 100}"/>`;
    g += `<g transform="translate(0 ${f1(-lift * 700)})"><rect x="440" y="250" width="1040" height="540" rx="10" fill="#A9DBFF" stroke="${INK}" stroke-width="9"/><circle cx="1300" cy="350" r="54" fill="#FFF3B0"/><path d="M440 660 Q700 560 960 640 Q1220 720 1480 620 L1480 790 L440 790 Z" fill="#9CCB72" stroke="${INK}" stroke-width="6"/><path d="M640 660 L640 560 M600 600 Q640 480 680 600 Z" fill="#4E9A3E" stroke="${INK}" stroke-width="6"/>${T8(560, 330, '♪', { size: 60, fill: '#fff' })}</g>`;
    const ix = 960, iy = 200;
    const [hl, hr] = [handG(960, 950, 0.6, P['서기'].hL), handG(960, 950, 0.6, P['서기'].hR)];
    if (lt > 0.15 * D) {
      const sk = prog(lt, 0.15 * D, 0.28 * D);
      g += `<line x1="${ix - 70}" y1="${iy + 40}" x2="${f1(lerp(ix - 70, hl[0], sk))}" y2="${f1(lerp(iy + 40, hl[1], sk))}" stroke="#E8E2FF" stroke-width="4"/><line x1="${ix + 70}" y1="${iy + 40}" x2="${f1(lerp(ix + 70, hr[0], sk))}" y2="${f1(lerp(iy + 40, hr[1], sk))}" stroke="#E8E2FF" stroke-width="4"/>`;
    }
    g += imp(ix, iy + Math.sin(t * 2) * 6, 0.75, t);
    g += Z({ t, seed: 781, x: 960 + (lt > 0.15 * D ? Math.sin(t * 2.2) * 8 : 0), y: 950, s: 0.6, ex: exprAt([[0, '기본'], [0.3 * D, '겁먹음']], lt), look: [0, -0.9] });
    if (lt > 0.12 * D) g += pop(t, t - lt + 0.12 * D, t + 99, 1350, 170, label(0, 0, '교활한 악마?', { size: 42, bg: '#B9A7FF' }), { rot: 4, bob: 4 });
    if (lt > 0.38 * D) g += pop(t, t - lt + 0.38 * D, t + 99, 960, 520, big(0, 0, [[['보고 듣는 게 ', '#fff'], ['다 가짜라면?', YEL]]], { size: 66 }), {});
    h += `<g opacity="${f1((1 - dream) * 100) / 100}">${g}</g>`;
  }
  if (dream > 0) {
    let g = BG('#1B1E44') + BG('url(#dots)');
    for (let i = 0; i < 30; i++) g += `<circle cx="${f1(hash(i) * 1920)}" cy="${f1(hash(i * 2) * 700)}" r="${f1(2 + hash(i * 3) * 3)}" fill="#fff" opacity="${f1((0.4 + 0.5 * Math.sin(t * 2 + i)) * 100) / 100}"/>`;
    const fy = Math.sin(t * 1.2) * 14;
    g += `<g transform="translate(0 ${f1(fy)})"><path d="M560 760 Q520 680 640 670 Q700 600 800 650 Q900 590 1000 650 Q1120 620 1160 700 Q1260 710 1230 780 Q1200 830 1100 820 L640 820 Q560 820 560 760 Z" fill="#E8ECFF" stroke="${INK}" stroke-width="8"/>`;
    g += Z({ t, seed: 780, x: 880, y: 800, s: 0.6, rot: -90, ex: { expr: '잠', prev: '잠', k: 1, blink: 0 }, noBlink: true }) + `</g>`;
    for (let i = 0; i < 3; i++) { const k = ((t * 0.5 + i / 3) % 1); g += T8(1020 + k * 120, 560 - k * 180, 'z', { size: 40 + i * 12, fill: '#fff', op: f1(Math.sin(k * Math.PI) * 100) / 100 }); }
    g += pop(t, t - lt + 0.6 * D, t + 99, 960, 220, big(0, 0, [[['지금 이 순간이 ', '#fff'], ['꿈', YEL], ['이라면?', '#fff']]], { size: 76, sw: 15 }), {});
    h += `<g opacity="${f1(dream * 100) / 100}">${g}</g>`;
  }
  return h;
};

/* ---------- faces: bigger text ---------- */
function faceCard2(x, y, s, i, reveal, ai) {
  let h = faceCard(0, 0, 1, i, 0, ai).replace(/<text[^>]*>진짜\? AI\?<\/text>/, '');
  h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${h}`;
  if (reveal > 0) h += `<g opacity="${f1(Math.min(1, reveal * 2) * 100) / 100}"><rect x="-104" y="100" width="208" height="50" rx="25" fill="${ai ? '#B9A7FF' : MINT}" stroke="${INK}" stroke-width="5"/>${T8(0, 137, ai ? 'AI가 만듦' : '진짜 사진', { size: 34 })}</g>`;
  else h += T8(0, 140, '진짜? AI?', { size: 36, fill: '#4A5A6C' });
  return h + `</g>`;
}
const _facesOld = facesScene;
facesScene = function (t, lt, a) {
  const D = D_(a);
  if (a.tip || a.trust) return _facesOld(t, lt, a);
  let h = BG('#F4EFE4') + BG('url(#paper)');
  const rev = prog(lt, 0.78 * D, 0.95 * D), AI = [1, 0, 1, 1, 0, 0];
  for (let i = 0; i < 6; i++) { const at = 0.1 * D + i * 0.12; if (lt > at) h += pop(t, t - lt + at, t + 99, 430 + (i % 3) * 330, 340 + Math.floor(i / 3) * 370, faceCard2(0, 0, 1.05, i, rev, AI[i]), { rot: (i % 2 ? 2 : -2) }); }
  h += Z({ t, seed: 791, x: 1620, y: 950, s: 0.62, pose: '턱괴기', ex: exprAt([[0, '결심'], [0.78 * D, '놀람']], lt), look: [-0.7, -0.3] });
  if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 1620, 330, label(0, 0, '어느 쪽이 진짜?', { size: 40, bg: YEL }), { rot: 3, bob: 3 });
  return h;
};
const _statOld = statScene;
statScene = function (t, lt, a) {
  let h = _statOld(t, lt, Object.assign({}, a, { sub: '', src: '' }));
  h += T8(900, 665, a.sub, { size: 56, w: 800 }) + T8(900, 750, a.src, { size: 34, w: 600, fill: '#5E5548' });
  if (a.trust && lt > 0.6 * D_(a)) h += pop(t, t - lt + 0.6 * D_(a), t + 99, 900, 850, label(0, 0, 'AI 얼굴이 더 믿음직해 보였다', { size: 42, bg: '#B9A7FF' }), { rot: -2 });
  return h;
};

/* ---------- 2 a.m.: what can I believe? ---------- */
function nightScene(t, lt, a) {
  const D = D_(a);
  let h = bedroom(t, { clock: '02:00' });
  h += `<ellipse cx="620" cy="770" rx="150" ry="46" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
  h += `<circle cx="860" cy="620" r="300" fill="#8FA7FF" opacity=".12"/>`;
  h += Z({ t, seed: 790, x: 860, y: 900, s: 0.74, pose: '턱괴기', ex: exprAt([[0, '걱정'], [0.5 * D, '겁먹음']], lt), look: [0.3, -0.9], light: 1, shade: '#C9D9F0' });
  h += blanket(800);
  const sw = prog(lt, 0.1 * D, 0.5 * D);
  for (let i = 0; i < 9; i++) { const ang = t * 0.9 + i * 0.7, r = 160 + 40 * Math.sin(i * 1.3 + t); h += T8(860 + Math.cos(ang) * r * 1.4, 400 + Math.sin(ang) * r * 0.5, '?', { size: 50 + (i % 3) * 14, fill: YEL, stroke: INK, sw: 5, op: f1(sw * (0.5 + 0.5 * Math.sin(ang * 2)) * 100) / 100 }); }
  if (lt > 0.5 * D) h += pop(t, t - lt + 0.5 * D, t + 99, 1330, 280, bubble(0, 0, 500, 140, T8(14, 18, '그럼 대체, 뭘 믿지?', { size: 46 })), { rot: 2, bob: 4 });
  return h;
}

/* ---------- cogito: Descartes faces the question; the first foundation ---------- */
const _cogOld = cogitoScene;
cogitoScene = function (t, lt, a) {
  const D = D_(a);
  if (a.k === 3) {
    let h = BG('url(#dawn)') + ground(880, '#8C7A66');
    for (let i = 0; i < 26; i++) { const x = 160 + hash(i * 3.3) * 1600, y = 870 - hash(i * 1.7) * 40, r = (hash(i) - 0.5) * 60; if (Math.abs(x - 960) > 230) h += `<rect x="${f1(x - 30)}" y="${f1(y - 22)}" width="60" height="44" rx="5" fill="#A89A8A" stroke="${INK}" stroke-width="4" transform="rotate(${f1(r)} ${f1(x)} ${f1(y)})"/>`; }
    const g = easeOut(prog(lt, 0.15 * D, 0.6 * D));
    h += `<circle cx="960" cy="820" r="${f1(120 + 320 * g)}" fill="url(#warm)" opacity="${f1((0.3 + 0.7 * g) * 100) / 100}"/>`;
    for (let i = 0; i < 12; i++) { const an = i * 30 + t * 6; h += `<line x1="${f1(960 + Math.cos(an * Math.PI / 180) * 200)}" y1="${f1(820 + Math.sin(an * Math.PI / 180) * 120)}" x2="${f1(960 + Math.cos(an * Math.PI / 180) * (230 + 140 * g))}" y2="${f1(820 + Math.sin(an * Math.PI / 180) * (140 + 90 * g))}" stroke="#FFE9A8" stroke-width="6" stroke-linecap="round" opacity="${f1(g * 80) / 100}"/>`; }
    h += `<rect x="790" y="770" width="340" height="120" rx="16" fill="#E8DCC8" stroke="${INK}" stroke-width="8"/>` + T8(960, 852, '나', { size: 84 });
    h += DC({ t, seed: 803, x: 520, y: 950, s: 0.7, pose: lt > 0.55 * D ? '손인사' : '서기', ex: exprAt([[0, '기본'], [0.55 * D, '뿌듯']], lt), look: [0.8, 0.2] });
    if (lt > 0.4 * D) h += pop(t, t - lt + 0.4 * D, t + 99, 960, 230, big(0, 0, [[['모든 걸 허문 자리, ', '#fff'], ['첫 번째 바닥', YEL]]], { size: 70 }), {});
    return h;
  }
  if (!a.k) {
    let h = BG('#0E0F1E');
    const fade = prog(lt, 0.3 * D, 0.7 * D), glow = easeOut(prog(lt, 0.55 * D, 0.95 * D));
    h += `<g opacity="${f1((1 - fade * 0.8) * 100) / 100}">${qmarks(t, 41, 26, [0, 60, 1920, 860], { size: 64, speed: 0.08, color: '#7A7FA8', op: 0.7 })}</g>`;
    h += candle(1250, 880, t);
    h += `<circle cx="960" cy="560" r="${f1(120 + 360 * glow)}" fill="url(#warm)" opacity="${f1((0.2 + 0.6 * glow) * 100) / 100}"/>`;
    h += DC({ t, seed: 800, x: 900, y: 950, s: 0.8, pose: '턱괴기', ex: exprAt([[0, '걱정'], [0.6 * D, '결심']], lt), look: [0.2, -0.6] });
    if (lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, 960, 180, big(0, 0, [[['딱 하나, ', '#fff'], ['의심할 수 없는 것', YEL]]], { size: 70 }), {});
    return h;
  }
  return _cogOld(t, lt, a);
};

/* ---------- day 5: results with bigger labels; menu without the plank ---------- */
const _gradsOld = gradsScene;
gradsScene = function (t, lt, a) {
  const D = D_(a);
  if (a.res) {
    let h = BG(NAVY) + BG('url(#grid)');
    const k = easeOut(prog(lt, 0.1 * D, 0.45 * D)), k2 = easeOut(prog(lt, 0.45 * D, 0.8 * D));
    h += T8(560, 230, '연봉', { size: 54, fill: '#fff' }) + T8(1360, 230, '내 선택에 대한 만족', { size: 54, fill: '#fff' });
    h += vbar(440, 780, 180, 420, 0.62 * k, '#9AA6B2', '', '적당히 OK', { bc: '#fff', bs: 38 }) + vbar(680, 780, 180, 420, 0.62 * 1.2 * k, PINK, k > 0.9 ? '+20%' : '', '끝없이 비교', { bc: '#fff', bs: 38, tc: '#fff', ts: 52 });
    h += vbar(1240, 780, 180, 420, 0.74 * k2, '#9AA6B2', '', '적당히 OK', { bc: '#fff', bs: 38 }) + vbar(1480, 780, 180, 420, 0.48 * k2, PINK, k2 > 0.9 ? '↓' : '', '끝없이 비교', { bc: '#fff', bs: 38, tc: '#fff', ts: 56 });
    if (lt > 0.8 * D) h += pop(t, t - lt + 0.8 * D, t + 99, 1360, 920, label(0, 0, '덜 만족 · 더 불안', { size: 42, bg: PINK, color: '#fff' }), {});
    return h;
  }
  if (a.menu) {
    let h = BG('#F6E3C4') + BG('url(#hatch)').replace('/>', ' opacity=".2"/>');
    h += `<rect x="200" y="140" width="760" height="560" rx="16" fill="#2F3A2E" stroke="${INK}" stroke-width="9"/>` + T8(580, 220, 'MENU', { size: 56, fill: YEL });
    const M = ['김치찌개', '된장찌개', '비빔밥', '제육볶음', '칼국수', '돈가스', '냉면', '떡볶이'];
    const pick = lt > 0.5 * D;
    M.forEach((m, i) => h += T8(i < 4 ? 400 : 760, 310 + (i % 4) * 90, m, { size: 44, fill: pick && i === 0 ? YEL : '#F4F1EA', op: pick && i ? 0.4 : 1 }));
    if (pick) h += `<rect x="270" y="262" width="260" height="66" rx="33" fill="none" stroke="${YEL}" stroke-width="7"/>`;
    h += pop(t, t - lt + 0.05, t + 99, 1180, 230, timerG(0, 0, '20:00', { ring: '#C3CDD8' }), {}) + strike(1090, 248, 1270, prog(lt, 0.18 * D, 0.26 * D));
    if (lt > 0.26 * D) { const secs = 180 - Math.floor(prog(lt, 0.28 * D, 0.5 * D) * 80); h += pop(t, t - lt + 0.26 * D, t + 99, 1420, 230, timerG(0, 0, `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`, { k: secs / 180 }), {}); }
    const zx = 1480, zy = 900, zs = 0.62;
    const eating = lt > 0.62 * D;
    h += Z({ t, seed: 820, x: zx, y: zy, s: zs, pose: eating ? '폰보기' : '턱괴기', ex: exprAt([[0, '결심'], [0.5 * D, '신남']], lt), look: eating ? [0, 0.5] : [-0.6, -0.3] });
    h += `<rect x="1180" y="820" width="620" height="34" rx="8" fill="${WALNUT}" stroke="${INK}" stroke-width="7"/><rect x="1220" y="854" width="24" height="90" fill="#6A4529" stroke="${INK}" stroke-width="5"/><rect x="1736" y="854" width="24" height="90" fill="#6A4529" stroke="${INK}" stroke-width="5"/>`;
    if (eating) {
      const [bx, by] = handG(zx, zy, zs, [200, 330]);
      h += `<g transform="translate(${f1(bx)} ${f1(by + 10)})"><path d="M-70 0 Q-70 50 0 54 Q70 50 70 0 Z" fill="#C8423A" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="0" rx="70" ry="16" fill="#E8734A" stroke="${INK}" stroke-width="5"/>${[0, 1, 2].map(i => `<path d="M${-20 + i * 20} -20 q8 -16 0 -32" fill="none" stroke="#fff" stroke-width="4" opacity=".7"/>`).join('')}</g>`;
      const sp = Math.max(0, Math.sin(t * 5));
      h += `<g transform="translate(${f1(bx + 30)} ${f1(by - 10 - sp * 50)}) rotate(-30)"><rect x="-5" y="-60" width="10" height="70" rx="5" fill="#C9D2DC" stroke="${INK}" stroke-width="3"/><ellipse cx="0" cy="-64" rx="14" ry="10" fill="#C9D2DC" stroke="${INK}" stroke-width="3"/></g>`;
      h += hand(bx - 50, by + 18, zs) + hand(bx + 50, by + 18, zs);
      for (let i = 0; i < 3; i++) { const k = (t * 0.6 + i / 3) % 1; h += `<g opacity="${f1(Math.sin(k * Math.PI) * 100) / 100}">${heart(1300 + i * 170, 520 - k * 140, 1.3, [PINK, YEL, MINT][i])}</g>`; }
    }
    return h;
  }
  return _gradsOld(t, lt, a);
};

/* ---------- recap with the same five names everywhere ---------- */
recapScene = function (t, lt, a) {
  let h = BG(NAVY) + BG('url(#grid)');
  h += big(960, 120, ['만약에, 데카르트처럼 모든 걸 의심한다면?'], { size: 56, sw: 12, fill: YEL });
  LIST8B.forEach((it, i) => {
    if (i >= a.k) return;
    const appear = a.k === 3 ? 0.2 + i * 1.4 : (a.k === 5 && i >= 3 ? 0.2 + (i - 3) * 1.8 : -1);
    const k = a.k === 5 && i < 3 ? 1 : easeOutBack(clamp((lt - appear) / 0.4, 0, 1));
    const y = 260 + i * 118;
    h += `<g transform="translate(${f1(lerp(-300, 0, clamp(k, 0, 1.2)))} 0)" opacity="${f1(clamp(k, 0, 1) * 100) / 100}">${label(400, y, (i + 1) + '일 차', { size: 40, bg: i === 4 ? YEL : MINT })}<text x="520" y="${y + 18}" font-family="${FONT}" font-weight="900" font-size="56" fill="#fff">${esc(it)}</text></g>`;
  });
  h += Z({ t, seed: 15, x: 1660, y: 920, s: 0.55, pose: a.k ? '손인사' : '서기', ex: exprAt([[0, '신남']], t), look: [-0.6, -0.2] });
  return h;
};

/* ---------- Francine: the human side ---------- */
function francineScene(t, lt, a) {
  const D = D_(a);
  if (a.plan) {
    let h = BG('url(#dusk8)') + BG('url(#paper)');
    h += `<rect x="760" y="160" width="980" height="640" rx="26" fill="#F3E6CC" stroke="${INK}" stroke-width="8"/><path d="M820 640 Q860 420 1000 360 Q1080 250 1240 240 Q1400 230 1480 330 Q1620 360 1680 480 Q1700 620 1600 700 Q1400 760 1200 740 Q980 760 820 640 Z" fill="#CFE0B0" stroke="${INK}" stroke-width="6"/>`;
    const A = [1220, 320], B = [1020, 620], k = easeInOut(prog(lt, 0.2 * D, 0.6 * D));
    h += `<path d="M${A[0]} ${A[1]} Q1260 520 ${f1(lerp(A[0], B[0], k))} ${f1(lerp(A[1], B[1], k))}" fill="none" stroke="${RED}" stroke-width="8" stroke-dasharray="16 12" stroke-linecap="round"/>`;
    h += `<circle cx="${A[0]}" cy="${A[1]}" r="16" fill="${RED}" stroke="${INK}" stroke-width="5"/><g transform="translate(${A[0]} ${A[1] - 56})">${label(0, 0, '네덜란드', { size: 34, bg: '#fff' })}</g>`;
    h += pop(t, t - lt + 0.55 * D, t + 99, B[0], B[1], `<circle r="16" fill="${RED}" stroke="${INK}" stroke-width="5"/><g transform="translate(0 70)">${label(0, 0, '프랑스', { size: 34, bg: '#fff' })}</g>`, {});
    h += DC({ t, seed: 851, x: 360, y: 950, s: 0.72, pose: '안기', ex: exprAt([[0, '뿌듯']], t), look: [0.6, 0.3] });
    h += kidF({ t, seed: 852, x: 560, y: 950, s: 0.42, pose: '손인사', ex: exprAt([[0, '신남']], t), look: [-0.6, -0.6] });
    h += pop(t, t - lt + 0.3 * D, t + 99, 1250, 880, label(0, 0, '함께 프랑스로, 공부시킬 계획', { size: 40, bg: YEL }), {});
    return h;
  }
  if (a.loss) {
    let h = BG('url(#autumn)') + BG('url(#paper)') + ground(880, '#B79B76');
    h += `<rect x="1180" y="160" width="420" height="340" rx="10" fill="#C9C2B4" stroke="${INK}" stroke-width="10"/><line x1="1390" y1="160" x2="1390" y2="500" stroke="${INK}" stroke-width="8"/><line x1="1180" y1="330" x2="1600" y2="330" stroke="${INK}" stroke-width="8"/>`;
    h += leaves(t, 12, 14, [1180, 160, 420, 340]);
    h += `<ellipse cx="900" cy="886" rx="200" ry="24" fill="#000" opacity=".15"/>` + chair(900, 880, 1.3, '#C99A66');
    h += `<g transform="translate(900 724) rotate(-12) scale(1.4)"><path d="M0 0 L-34 -22 L-34 22 Z M0 0 L34 -22 L34 22 Z" fill="#FFD25A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle r="10" fill="#FFD25A" stroke="${INK}" stroke-width="5"/></g>`;
    h += pop(t, t - lt + 0.2, t + 99, 900, 170, label(0, 0, '1640년 가을', { size: 44, bg: '#fff' }), {});
    return h;
  }
  if (a.letter) {
    let h = BG('#20182C') + BG('url(#dots)');
    h += `<rect x="-600" y="860" width="3120" height="700" fill="#2E2236"/>`;
    h += DC({ t, seed: 853, x: 480, y: 940, s: 0.76, pose: '책상', ex: exprAt([[0, '지침']], t), look: [0.4, 0.8] });
    h += deskG(560, 812, 640) + candle(800, 812, t);
    h += `<rect x="410" y="802" width="190" height="10" rx="3" fill="#F3E6CC" stroke="${INK}" stroke-width="3"/>`;
    { const [qx, qy] = handG(480, 940, 0.76, P['책상'].hR); h += `<path d="M${f1(qx)} ${f1(qy + 4)} Q${f1(qx + 30)} ${f1(qy - 50)} ${f1(qx + 70)} ${f1(qy - 100)}" fill="none" stroke="#F4F1EA" stroke-width="7" stroke-linecap="round"/>` + hand(qx, qy, 0.76); }
    const q1 = 0.33 * D, q2 = 0.66 * D;
    if (lt > q1) h += pop(t, t - lt + q1, t + 99, 1270, 280, big(0, 0, ['나는 눈물과 슬픔을', [['부끄러운 것', YEL], ['이라 여기지 않는다', '#fff']]], { size: 58, sw: 12 }), {});
    if (lt > q2) h += pop(t, t - lt + q2, t + 99, 1270, 560, big(0, 0, ['강해 보이려고, 늘', [['아무렇지 않은 척', YEL], ['할 필요는 없다', '#fff']]], { size: 58, sw: 12 }), {});
    if (lt > q1 + 0.4) h += pop(t, t - lt + q1 + 0.4, t + 99, 1270, 780, label(0, 0, '— 데카르트, 친구에게 보낸 편지 (1641)', { size: 30, bg: '#fff' }), {});
    return h;
  }
  if (a.honest) {
    let h = BG('url(#dawn)') + ground(880, '#C9A882');
    h += `<rect x="760" y="160" width="520" height="460" rx="12" fill="#FCE3B8" stroke="${INK}" stroke-width="10"/><circle cx="1020" cy="520" r="90" fill="#FFD27A"/><circle cx="1020" cy="520" r="280" fill="url(#warm)"/><line x1="1020" y1="160" x2="1020" y2="620" stroke="${INK}" stroke-width="8"/><line x1="760" y1="390" x2="1280" y2="390" stroke="${INK}" stroke-width="8"/>`;
    h += `<rect x="740" y="610" width="560" height="30" rx="8" fill="#B98A5A" stroke="${INK}" stroke-width="7"/>`;
    h += DC({ t, seed: 854, x: 620, y: 950, s: 0.8, pose: '서기', ex: exprAt([[0, '지침'], [0.45 * D, '기본']], lt), look: [0.8, -0.4] });
    if (lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 1500, 760, big(0, 0, ['슬픔 앞에서는', [['솔직하게', YEL]]], { size: 66, sw: 13 }), {});
    return h;
  }
  // intro: Descartes and his daughter
  let h = BG('url(#dusk8)') + BG('url(#paper)') + ground(880, '#D8C49E');
  h += `<rect x="1250" y="170" width="420" height="340" rx="12" fill="#BFE3FF" stroke="${INK}" stroke-width="10"/><circle cx="1500" cy="260" r="46" fill="#FFF3B0"/><line x1="1460" y1="170" x2="1460" y2="510" stroke="${INK}" stroke-width="8"/><line x1="1250" y1="340" x2="1670" y2="340" stroke="${INK}" stroke-width="8"/>`;
  h += `<circle cx="860" cy="620" r="420" fill="url(#warm)" opacity=".7"/>`;
  h += DC({ t, seed: 850, x: 740, y: 950, s: 0.8, pose: '안기', ex: exprAt([[0, '뿌듯']], t), look: [0.7, 0.4] });
  h += kidF({ t, seed: 851, x: 1010, y: 950, s: 0.44, pose: lt > 0.5 * D ? '만세' : '서기', ex: exprAt([[0, '신남']], t), look: [-0.7, -0.6] });
  for (let i = 0; i < 3; i++) { const k = (t * 0.4 + i / 3) % 1; h += `<g opacity="${f1(Math.sin(k * Math.PI) * 90) / 100}">${heart(800 + i * 110, 480 - k * 140, 1.1, [PINK, YEL, PINK][i])}</g>`; }
  h += pop(t, t - lt + 0.3, t + 99, 960, 150, label(0, 0, '1635년 · 딸 프랑신', { size: 46, bg: YEL }), {});
  return h;
}

/* ---------- ending: doubt as a tool for building ---------- */
const _lampOld = lampScene;
lampScene = function (t, lt, a) {
  const D = D_(a);
  if (a.me || a.ask) return _lampOld(t, lt, a);
  let h = BG('url(#sunset)') + ground(880, '#B58C5E');
  h += `<g transform="translate(480 600) rotate(-30)"><rect x="-14" y="-40" width="28" height="240" rx="8" fill="${WALNUT}" stroke="${INK}" stroke-width="6"/><rect x="-90" y="-100" width="180" height="70" rx="12" fill="#6B7A8C" stroke="${INK}" stroke-width="7"/></g>`;
  const nk = prog(lt, 0.2 * D, 0.35 * D);
  if (nk > 0) h += `<g opacity="${f1(nk * 100) / 100}"><circle cx="480" cy="620" r="170" fill="none" stroke="${INK}" stroke-width="30"/><circle cx="480" cy="620" r="170" fill="none" stroke="${RED}" stroke-width="18"/><line x1="360" y1="500" x2="600" y2="740" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><line x1="360" y1="500" x2="600" y2="740" stroke="${RED}" stroke-width="18" stroke-linecap="round"/></g>`;
  h += pop(t, t - lt + 0.1, t + 99, 480, 360, label(0, 0, '부수는 망치', { size: 40, bg: '#fff' }), {});
  h += `<rect x="1220" y="860" width="500" height="50" rx="10" fill="#9AA3AE" stroke="${INK}" stroke-width="8"/>`;
  const bk = Math.max(0.05, prog(lt, 0.3 * D, 0.95 * D));
  h += houseG2(1470, 860, 0.85, 0, bk);
  const cyc = (lt * 1.2) % 1, zx = 1060, zy = 950, zs = 0.72;
  h += Z({ t, seed: 840, x: zx, y: zy, s: zs, pose: cyc < 0.5 ? '집기' : '내밀기', ex: exprAt([[0, '결심'], [0.8 * D, '신남']], lt), look: [0.8, -0.1] });
  const [bx, by] = handG(zx, zy, zs, cyc < 0.5 ? P['집기'].hL : P['내밀기'].hR);
  h += `<rect x="${f1(bx - 26)}" y="${f1(by - 22)}" width="52" height="42" rx="4" fill="#D9805F" stroke="${INK}" stroke-width="4"/>`;
  h += `<rect x="900" y="900" width="70" height="40" rx="4" fill="#D9805F" stroke="${INK}" stroke-width="4"/><rect x="890" y="860" width="70" height="40" rx="4" fill="#D9805F" stroke="${INK}" stroke-width="4"/>`;
  if (lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 1400, 230, big(0, 0, [[['더 단단한 생각을 짓는 ', '#fff'], ['연장', YEL]]], { size: 62, sw: 12 }), {});
  return h;
};

/* ---------- review fixes: keep every character's feet above the subtitle band ---------- */
hookScene = function (t, lt, a) {
  const D = D_(a);
  let h = livingRoom(t, false);
  const x = 960, y = 950, s = 0.84;
  h += Z({ t, seed: 700, x, y, s, pose: '폰보기', ex: exprAt([[0, '기본'], [0.05 * D, '놀람'], [0.3 * D, '기본'], [0.55 * D, '걱정'], [0.78 * D, '놀람']], lt), look: lt > 0.78 * D ? [0, -0.8] : [0, 0.9] });
  const [px, py] = handG(x, y, s, [200, 318]);
  h += phone(px, py - 6, 0.42, { on: 1 }) + hand(px - 24, py + 8, s) + hand(px + 24, py + 8, s);
  const cards = [
    [0.04, 460, 300, `<rect x="-300" y="-110" width="600" height="220" rx="24" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-300" y="-110" width="600" height="58" rx="24" fill="#FFE14D" stroke="${INK}" stroke-width="7"/>${T8(-270, -70, '단톡방 (23)', { anchor: 'start', size: 30 })}<rect x="-270" y="-28" width="540" height="110" rx="20" fill="#F2F4F7" stroke="${INK}" stroke-width="4"/>${T8(0, 14, '[속보] 충격!! 이거 실화?', { size: 38, fill: RED })}${T8(0, 62, '링크 ▶ 지금 바로 확인', { size: 28, fill: '#6B7A8C', w: 700 })}`],
    [0.3, 1470, 560, `<rect x="-300" y="-70" width="600" height="140" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>${T8(0, -16, '모두가 아는 상식', { size: 30, fill: '#6B7A8C', w: 700 })}${T8(0, 36, '“그건 다 알잖아~”', { size: 40 })}`],
    [0.55, 470, 650, bubble(0, 0, 520, 150, `${T8(50, 14, '분명 여기 뒀는데…', { size: 40 })}<g transform="translate(-215 0) rotate(-20) scale(.8)"><circle r="22" fill="none" stroke="#C9A04A" stroke-width="9"/><rect x="18" y="-6" width="60" height="12" fill="#C9A04A" stroke="${INK}" stroke-width="3"/></g>`)]
  ];
  cards.forEach(([f, cx, cy, g], i) => {
    if (lt < f * D) return;
    h += pop(t, t - lt + f * D, t + 99, cx, cy, g, { rot: [-3, 3, -2][i], bob: 4 });
    if (lt > 0.78 * D + i * 0.15) h += pop(t, t - lt + 0.78 * D + i * 0.15, t + 99, cx + [260, 270, 230][i], cy - 90, qStamp(0, 0, 1), { rot: 12 });
  });
  if (lt > 0.82 * D) h += pop(t, t - lt + 0.82 * D, t + 99, 960, 170, outlined(0, 0, [[['정말 ', '#fff'], ['확실한 건?', YEL]]], { size: 84, sw: 16 }), {});
  return h;
};
const _cogOld2 = cogitoScene;
cogitoScene = function (t, lt, a) {
  const D = D_(a);
  if (a.k !== 1) return _cogOld2(t, lt, a);
  let h = BG('#0E0F1E');
  h += qmarks(t, 41, 26, [0, 60, 1920, 860], { size: 64, speed: 0.08, color: '#7A7FA8', op: 0.7 });
  h += `<circle cx="960" cy="560" r="500" fill="url(#warm)" opacity=".85"/>`;
  h += ground(880, '#1A1C33');
  h += Z({ t, seed: 801, x: 960, y: 930, s: 0.8, pose: '만세', ex: exprAt([[0, '놀람'], [0.5 * D, '신남']], lt), look: [0, -0.5] });
  h += pop(t, t - lt + 0.1, t + 99, 1460, 300, bubble(0, 0, 440, 150, `${T8(18, 18, '속고 있는 내가 있다', { size: 38 })}`), { bob: 4 });
  if (lt > 0.5 * D) h += pop(t, t - lt + 0.5 * D, t + 99, 480, 300, label(0, 0, '의심하는 나 = 생각하는 나', { size: 40, bg: YEL }), { rot: -3, bob: 3 });
  return h;
};
const _forestOld = forestScene;
forestScene = function (t, lt, a) {
  const D = D_(a);
  if (!a.out) return _forestOld(t, lt, a);
  let h = BG('url(#morning)') + `<circle cx="1560" cy="200" r="90" fill="#FFF3B0"/><circle cx="1560" cy="200" r="240" fill="url(#warm)"/>` + ground(860, '#9CCB72');
  for (let i = 0; i < 9; i++) { const x = -40 + i * 90, hh = 380 + hash(i) * 160; h += `<rect x="${x + 30}" y="${860 - hh * 0.4}" width="26" height="${hh * 0.4}" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/><path d="M${x - 40} ${860 - hh * 0.35} L${x + 43} ${860 - hh} L${x + 126} ${860 - hh * 0.35} Z" fill="${['#3F7F33', '#4E9A3E'][i % 2]}" stroke="${INK}" stroke-width="6"/>`; }
  const zx = lerp(620, 1180, easeOut(prog(lt, 0, 0.6 * D)));
  h += shadow(zx, 914, 70) + Z({ t, seed: 810, x: zx, y: 910, s: 0.78, pose: lt < 0.6 * D ? walkPose(t * 8, 0.8) : '만세', ex: exprAt([[0, '결심'], [0.6 * D, '신남']], lt), look: [0.6, -0.3] });
  if (lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, 1460, 420, outlined(0, 0, ['적어도 숲 밖으로!'], { size: 70, sw: 14, fill: YEL }), { rot: -3 });
  return h;
};
const _lampOld2 = lampScene;
lampScene = function (t, lt, a) {
  const D = D_(a);
  if (!a.me && !a.ask) return _lampOld2(t, lt, a);
  let h = BG('#1A1C33');
  h += qmarks(t, 61, 20, [0, 80, 1920, 760], { size: 60, speed: 0.07, color: '#5B607F', op: 0.6 });
  h += ground(880, '#14152A');
  const zx = 960, zy = 920, zs = 0.84;
  h += Z({ t, seed: 841, x: zx, y: zy, s: zs, pose: '손인사', ex: exprAt([[0, '뿌듯']], t), look: [0.4, -0.4] });
  { const [lx, ly] = handG(zx, zy, zs, P['손인사'].hR); h += lantern(lx + 4, ly + 150, 1.0, t) + hand(lx, ly, zs); }
  if (a.me && lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 960, 170, outlined(0, 0, [[['흔들려도, ', '#fff'], ['질문하는 나는 여기', YEL]]], { size: 72, sw: 14 }), {});
  if (a.ask) h += pop(t, t - lt + 0.3, t + 99, 520, 330, `<path d="M-380 -90 L380 -90 Q410 -90 410 -60 L410 50 Q410 80 380 80 L180 80 L230 140 L120 80 L-380 80 Q-410 80 -410 50 L-410 -60 Q-410 -90 -380 -90 Z" fill="#fff" stroke="${INK}" stroke-width="7"/>${T8(0, 14, '오늘 무엇을 의심해 볼까요?', { size: 44 })}`, { rot: -2, bob: 5 });
  return h;
};
statScene = function (t, lt, a) {
  let h = BG('url(#cream)') + BG('url(#paper)');
  const k = easeOut(prog(lt, 0.1, 1.2));
  const bigt = a.big, fs = bigt.length > 8 ? 150 : 210;
  h += `<g transform="translate(900 430) scale(${f1(lerp(0.85, 1, easeOutBack(prog(lt, 0, 0.5))) * 1000) / 1000})"><text x="0" y="40" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${fs}" fill="${NAVY}" stroke="${INK}" stroke-width="2">${esc(countUp(bigt, k))}</text></g>`;
  h += `<rect x="${900 - 360}" y="560" width="720" height="10" rx="5" fill="${PINK}" transform="scale(${f1(k * 1000) / 1000} 1)" transform-origin="900 565"/>`;
  h += T8(900, 665, a.sub, { size: 56, w: 800 }) + T8(900, 750, a.src, { size: 34, w: 600, fill: '#5E5548' });
  h += shadow(1680, 924, 50) + Z({ t, seed: 10, x: 1680, y: 920, s: 0.5, ex: exprAt([[0, '놀람'], [1.4, '뿌듯']], lt), pose: lt > 1.4 ? '손인사' : '서기', light: 1 });
  if (a.trust && lt > 0.6 * D_(a)) h += pop(t, t - lt + 0.6 * D_(a), t + 99, 900, 850, label(0, 0, 'AI 얼굴이 더 믿음직해 보였다', { size: 42, bg: '#B9A7FF' }), { rot: -2 });
  return h;
};
