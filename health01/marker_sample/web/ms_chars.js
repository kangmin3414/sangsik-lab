/* ---------- 엔진 인물: 제로(Puck)와 채점이(Laomedeia, 임시) ----------
   종이 위에 서 있는 작은 인형처럼: 엔진 char()로 그리고, 연기는 zw/act.js(예비 동작·탄력·시선·입 모양).
   마커 문법은 그대로: 빨강은 답(종이에 저절로 그려짐), 인물은 그 답을 보고 반응한다. 채점이의 빨간 색연필은 소품. */
const SV = document.getElementById('v'), TX = document.getElementById('top').getContext('2d');
const WX = (id, word, frac) => { const l = LN(id), w = l.words.find(x => x.w.replace(/[?.!,…]/g, '') === word); return l.t0 + (w ? w.t : frac * (l.t1 - l.t0)); };   // 낱말이 정확히 같을 때만
const fEx = k => ({ expr: k, prev: k, k: 1, blink: 0 });
const env = t => (TL.env && TL.env[Math.floor(t * 24)]) || 0;
const on = (id, t) => t >= LN(id).t0 - 0.05 && t < LN(id).t1 + 0.12;
const sayAt = (key, base, ids, t) => { const id = ids.find(i => on(i, t)); return actSay(key, base, id ? LN(id) : null, t, env(t)); };
const talk = (ids, t) => ids.some(i => on(i, t)) ? actTalk(env(t)).headDy : 0;
const bk = k => k <= 0 ? 0 : k >= 1 ? 1 : 1 + 2.70158 * Math.pow(k - 1, 3) + 1.70158 * Math.pow(k - 1, 2);
const ZERO = o => char(Object.assign({ goggles: 'none', vest: '#FF9A55', patch: false, tee: true, vshade: 'rgba(150,60,0,0.22)' }, o));
const CJ = o => char(Object.assign({ goggles: 'none', vest: '#8CC7A1', patch: false, tee: true, vshade: 'rgba(0,60,30,0.2)', collar: true, tie: '#2B2B2B' }, o));
const PENCIL = { svg: `<rect x="-6" y="-8" width="96" height="16" rx="4" fill="#E23B2E" stroke="${INK}" stroke-width="5"/><path d="M90 -8 L116 0 L90 8 Z" fill="#F3D3A6" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M108 -3 L116 0 L108 3 Z" fill="#E23B2E"/>`, follow: true };
const LEGS0 = { legL: P['서기'].legL, legR: P['서기'].legR, fL: P['서기'].fL, fR: P['서기'].fR, dy: 0 };
P['cj들기'] = Object.assign({ armL: P['서기'].armL, hL: P['서기'].hL, armR: [[252, 285], [292, 266], [306, 230]], hR: [308, 222] }, LEGS0);
P['cj가리킴'] = Object.assign({ armL: [[148, 285], [102, 296], [62, 306]], hL: [54, 308], armR: [[252, 285], [292, 266], [306, 230]], hR: [308, 222] }, LEGS0);
P['cj아래'] = Object.assign({ armL: [[148, 285], [112, 322], [90, 362]], hL: [86, 370], armR: [[252, 285], [292, 266], [306, 230]], hR: [308, 222] }, LEGS0);
P['z허리'] = Object.assign({ armL: [[148, 285], [110, 332], [148, 372]], hL: [152, 376], armR: [[252, 285], [290, 332], [252, 372]], hR: [248, 376] }, LEGS0);
function actor(kind, o, t) { // o.x·o.y 발 위치, o.gy 그림자 높이(뛰는 중엔 땅), o.pop 0~1 튀어나옴
  const pop = o.pop == null ? 1 : o.pop; if (pop <= 0.001) return '';
  const s = o.s * pop, h = o.hit || { sx: 1, sy: 1 }, gy = o.gy == null ? o.y : o.gy, lift = mC((gy - o.y) / 300);
  const sh = `<ellipse cx="${f1(o.x)}" cy="${f1(gy)}" rx="${f1(92 * s * (1 - 0.4 * lift))}" ry="${f1(13 * s * (1 - 0.4 * lift))}" fill="#3a3326" opacity="${f1(0.18 * pop * (1 - 0.6 * lift) * 100) / 100}"/>`;
  return sh + (kind === 'z' ? ZERO : CJ)(Object.assign({}, o, { s, sx: h.sx, sy: h.sy, t }));
}
/* 장 1: 제로는 왼쪽 아래에서 턱 괴고 묻는다. 채점이는 기준표 위로 튀어나와 읽다가 '어?'에서 놀란다 */
function chars1(t) {
  const a8 = LN('m8').t0, a9 = LN('m9').t0, e9 = END('m9'), tP = WT('m9', '봐|다', 0.22), tM = WT('m9', '기계', 0.45), tO = WX('m9', '어', 0.82), tR = WT('m9', '이름에서', 0.9);
  const zp = actPose([[0, '서기'], [a8 + 0.1, '턱괴기', { ant: 0.12 }], [a9 + 0.5, '서기']], t);
  const zg = actGaze([[0, 0.3, -0.5], [a9 - 0.1, 0.95, -0.7], [tM + 0.1, 0.8, 0], [tR, 0.6, 0.6], [e9 - 0.2, 0.9, -0.5]], t);
  const zb = t < a9 ? '걱정' : t < tR + 0.4 ? '기본' : '뿌듯';
  const Z1 = actor('z', { x: 300, y: 862, s: 0.6, pose: zp, look: zg.look, turn: zg.turn, tilt: zg.tilt, ex: sayAt('z1s', zb, ['m8'], t), pop: bk(K(0.1, 0.45, t)),
    armFront: t > a8 && t < a9 + 0.45 ? 'R' : '', hit: actMul(actHit(t, tO, 0.05), { sy: actInhale(t, a8, 0.3) }), headDy: talk(['m8'], t) }, t);
  const tc = a9 - 0.2;
  const cp = actPose([[0, 'cj들기'], [tP, 'cj가리킴', { ant: 0.1 }], [tM + 0.9, 'cj들기'], [tR - 0.15, 'cj아래', { ant: 0.08 }]], t);
  const cg = actGaze([[0, -0.6, 0.2], [tP, -0.9, 0.3], [tO, -0.5, 0.9], [e9 + 0.2, -0.7, 0.4]], t);
  const cb = t < tO ? '결심' : t < tR + 0.2 ? '놀람' : '걱정';
  const C1 = actor('c', { x: 1415, y: 292, s: 0.4, pose: cp, look: cg.look, turn: cg.turn, tilt: cg.tilt, ex: sayAt('c1s', cb, ['m9'], t), pop: bk(K(tc, tc + 0.3, t)), holdR: PENCIL,
    handL: (t >= tP && t < tM + 0.9) || t >= tR - 0.15 ? 'point' : null, hit: actMul(actHit(t, tO, 0.14), actHit(t, tc + 0.3, 0.1)), headDy: talk(['m9'], t) }, t);
  return Z1 + C1;
}
/* 장 2: 제로는 왼쪽 여백에서 그래프를 보다가 '나 오늘 9,400인데'에 맞춰 9,400 점으로 뛰어오른다. 채점이는 평평한 곡선 위에 선다 */
const J2 = () => { const z = LN('m12b').t0; return { tj0: z - 0.62, tj1: z - 0.04 }; };
function chars2(t) {
  const s0 = SHEETS[1][0] + 0.38, T41 = WT('m11', '41', 0.86), c = LN('m12a').t0, TF = WT('m12a', '더', 0.5), T94 = WT('m12b', '인데', 0.4), { tj0, tj1 } = J2();
  const fly = K(tj0, tj1, t), X0 = 150, Y0 = 700, X1 = GX(9400), Y1 = GY(9400) + 2, gy = mL(Y0, Y1, fly);
  const zx = mL(X0, X1, mE(fly)), zy = gy - 430 * Math.sin(Math.PI * fly);
  const zp = actPose([[0, '서기'], [tj0 - 0.22, '웅크림', { ant: 0, f: 6 }], [tj0, '점프', { ant: 0, f: 6 }], [tj1, '서기', { ant: 0, f: 5 }], [T94 + 0.15, 'z허리']], t);
  const zg = actGaze([[0, 0.9, 0], [T41, 0.9, -0.2], [c, 0.95, -0.3], [tj1 + 0.1, -0.7, 0.1], [T94 + 0.4, -0.85, 0]], t);
  const zb = t < T41 ? '기본' : t < T41 + 1.2 ? '놀람' : t < tj0 ? '기본' : '뿌듯';
  const Z2 = actor('z', { x: zx, y: zy, gy, s: 0.4, pose: zp, look: zg.look, turn: zg.turn, tilt: zg.tilt, ex: sayAt('z2s', zb, ['m12b'], t), pop: bk(K(s0, s0 + 0.3, t)),
    rot: fly > 0 && fly < 1 ? 12 * Math.sin(Math.PI * fly) : 0, hit: actMul(actHit(t, T41, 0.06), actHit(t, tj1, 0.18)), headDy: talk(['m12b'], t) }, t);
  const tc = c - 0.3;
  const cp = actPose([[0, 'cj들기'], [TF - 0.15, 'cj아래', { ant: 0.1 }], [tj1 + 0.3, 'cj들기']], t);
  const cg = actGaze([[0, -0.5, 0.6], [TF - 0.15, -0.6, 0.8], [tj0 + 0.2, -0.4, -0.6], [tj1, 0.9, -0.1]], t);
  const cb = t < tj1 ? '결심' : '놀람';
  const C2 = actor('c', { x: 1330, y: GY(7500) + 2, s: 0.34, pose: cp, look: cg.look, turn: cg.turn, tilt: cg.tilt, ex: sayAt('c2s', cb, ['m12a'], t), pop: bk(K(tc, tc + 0.3, t)), holdR: PENCIL,
    handL: t >= TF - 0.15 && t < tj1 + 0.3 ? 'point' : null, hit: actMul(actHit(t, tj1 + 0.03, 0.12), actHit(t, tc + 0.3, 0.1)), headDy: talk(['m12a'], t) }, t);
  return C2 + Z2;
}
const CHARS = [chars1, chars2];
function charEvents() {   // 효과음: 튀어나옴(pop), 뛰기(jump), 내려앉기(land)
  ev('pz1', 0.1, 'pop', 0.3); ev('pc1', LN('m9').t0 - 0.2, 'pop', 0.3); ev('pz2', SHEETS[1][0] + 0.38, 'pop', 0.3); ev('pc2', LN('m12a').t0 - 0.3, 'pop', 0.3);
  const { tj0, tj1 } = J2(); ev('jz2', tj0, 'jump', tj1 - tj0); ev('lz2', tj1, 'land', 0.3);
}
const svgCam = c => `translate(${W / 2} ${H / 2}) scale(${f1(c[2] * 1000) / 1000}) translate(${f1(-c[0])} ${f1(-c[1])})`;
function drawChars(i, t, u, e) {
  const one = k => CHARS[k] ? `<g transform="${svgCam(camAt(k, t))}">${CHARS[k](t)}</g>` : '';
  let g = u >= 1 ? one(i) : '';   // 새 장의 인물은 종이를 다 걷은 뒤에 튀어나온다
  if (u < 1 && i > 0) g += `<g transform="translate(${f1(-e * W * 1.15)} ${f1(-e * 260)}) rotate(${f1(-e * 0.12 * 180 / Math.PI)})">${one(i - 1)}</g>`;
  const seed = Math.floor(t * 12) % 3 + 1;   // 마커 획과 같은 12fps 떨림
  SV.innerHTML = `<defs><clipPath id="headClip"><ellipse cx="200" cy="170" rx="118" ry="112"/></clipPath><clipPath id="vestClip"><path d="M142 262 Q200 248 258 262 L270 412 Q200 424 130 412 Z"/></clipPath>`
    + `<filter id="cb" x="0" y="0" width="${W}" height="${H}" filterUnits="userSpaceOnUse"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="1" seed="${seed}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G"/></filter></defs>`
    + `<g filter="url(#cb)">${g}</g>`;
}
