/* 혈액형 × 철학자 편 — 샘플(인트로 + A형). 새 기본기 방식: AI 배경 판 + 자체 카메라·원근감 + 숨·탄력·출렁임 + 입 모양 + 단어 타이밍.
   이름 규칙: 이 편의 함수·상수는 모두 b 접두사. */
delete QBG.wide; delete QBG.close;
Object.assign(QBG, { alley: 'ai/alley.png', shop: 'ai/shop.png', shopc: 'ai/shopc.png', bedroom: 'ai/bedroom.png', winter: 'ai/winter.png', tent: 'ai/tent.png', office: 'ai/office.png' });
['balley', 'bneon', 'bstamp', 'blook', 'bbump', 'bloupe', 'bwheel', 'bline', 'bsummon', 'brx', 'bticket', 'bAenter', 'bAphone', 'bAthink', 'bAtalk', 'bAots', 'bAfav', 'bAchat', 'bAdx',
 'bMA', 'bMAdream', 'bMAwar', 'bMAtent', 'bctl', 'bAplug', 'bAwarm', 'bAhug', 'bAhalf', 'bAbye'].forEach(k => CAMS[k] = 'fixed');

/* ---------- shared ---------- */
const bAt = (a, key, fb) => { const w = (a._words || []).find(x => x.w.replace(/\s/g, '').includes(key)); return w ? w.t + 0.15 : fb; };
const bFull = (c, op = 1) => `<rect x="-300" y="-200" width="2600" height="1500" fill="${c}" opacity="${op}"/>`;
const bTr = (o) => `translate(${f1(o.x)} ${f1(o.y)}) rotate(${f1(o.rot || 0)}) scale(${f1((o.s || 1) * (o.sx || 1) * 1000) / 1000} ${f1((o.s || 1) * (o.sy || 1) * 1000) / 1000}) translate(-200 -560)`;
const bTxt = (x, y, s, size, fill, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${o.anchor || 'middle'}" font-family="${FONT}" font-weight="900" font-size="${size}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 6}" paint-order="stroke" stroke-linejoin="round"` : ''}>${esc(s)}</text>`;
const bHead = (x, y, s = 1, sy = 1) => [x, y + (170 - 560) * s * sy];       // head centre in world coords
const bChest = (x, y, s = 1, sy = 1) => [x, y + (335 - 560) * s * sy];
const bPose = (base, o) => Object.assign({}, typeof base === 'string' ? P[base] : base, o);
// extra poses (local rig coords)
P['가슴'] = bPose('서기', { armL: [[148, 285], [150, 340], [190, 318]], hL: [194, 314], armR: [[252, 285], [254, 344], [214, 330]], hR: [210, 326] });           // both hands clutching the chest
P['머리감싸'] = bPose('서기', { armL: [[148, 285], [92, 236], [104, 168]], hL: [106, 160], armR: [[252, 285], [308, 236], [296, 168]], hR: [294, 160] });     // hands on the head
P['안기'] = bPose('서기', { armL: [[148, 285], [128, 336], [176, 360]], hL: [184, 362], armR: [[252, 285], [272, 336], [224, 360]], hR: [216, 362] });       // hugging something at the belly
P['카운터'] = bPose('서기', { armL: [[148, 285], [118, 340], [112, 392]], hL: [112, 398], armR: [[252, 285], [282, 340], [288, 392]], hR: [288, 398] });     // both hands resting on the counter
P['내밀기'] = bPose('서기', { armL: [[148, 285], [118, 340], [112, 392]], hL: [112, 398], armR: [[252, 285], [318, 318], [372, 330]], hR: [380, 332] });     // right hand pushing something forward
P['가리키기L'] = bPose('서기', { armL: [[148, 285], [90, 270], [34, 262]], hL: [26, 262], armR: [[252, 285], [278, 345], [284, 398]], hR: [286, 406] });
P['가리키기R'] = bPose('서기', { armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [310, 270], [366, 262]], hR: [374, 262] });
P['쓰기'] = bPose('웅크림', { armL: [[148, 285], [150, 340], [196, 352]], hL: [200, 354], armR: [[252, 285], [262, 340], [236, 360]], hR: [230, 362] });
E['울먹'] = Object.assign(dotEyes(9, 13), { bL: [142, 166, 164, 150, 186, 142], bR: [214, 142, 236, 150, 258, 166], mouth: 'M182 240 Q200 226 218 240', mouthFill: 'none', sweat: true });
E['미소'] = Object.assign(dotEyes(10, 13), { bL: [142, 150, 164, 144, 186, 148], bR: [214, 148, 236, 144, 258, 150], mouth: 'M180 228 Q200 246 220 228', mouthFill: 'none' });
E['윙크'] = { eyeL: ell(165, 188, 10, 14), eyeR: 'M220 192 Q235 180 250 192', eyeFill: INK, eyeSW: 8, bL: [140, 146, 163, 138, 186, 146], bR: [214, 150, 237, 146, 260, 150], mouth: 'M180 226 Q202 246 222 224', mouthFill: 'none' };
E['심드렁'] = { eyeL: 'M150 186 L180 186 Q180 198 165 198 Q150 198 150 186 Z', eyeR: 'M220 186 L250 186 Q250 198 235 198 Q220 198 220 186 Z', eyeFill: INK, eyeSW: 0, bL: [142, 168, 164, 168, 186, 170], bR: [214, 170, 236, 168, 258, 168], mouth: 'M188 236 L212 236', mouthFill: 'none' };
E['눈썹업'] = Object.assign(dotEyes(10, 14), { bL: [140, 140, 163, 126, 186, 136], bR: [214, 148, 237, 146, 260, 150], mouth: 'M190 234 L212 232', mouthFill: 'none' });

/* ---------- characters ---------- */
const HOOD = '#E9874E';
// Zero, the shop owner: stretched-out orange hoodie
const bZero = (t, o) => {
  const tr = bTr(o);
  const back = `<g transform="${tr}"><path d="M100 296 Q92 200 150 216 Q200 240 250 216 Q308 200 300 296 Q250 272 200 274 Q150 272 100 296 Z" fill="${HOOD}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/></g>`;
  const body = char(Object.assign({ goggles: 'none', vest: HOOD, patch: false, tee: true, vshade: 'rgba(140,50,0,0.25)', seed: 61, t }, o));
  const front = `<g transform="${tr}"><path d="M186 270 L182 324 M214 270 L218 324" stroke="#F6E2C8" stroke-width="5" stroke-linecap="round"/><circle cx="182" cy="326" r="5" fill="#F6E2C8" stroke="${INK}" stroke-width="2"/><circle cx="218" cy="326" r="5" fill="#F6E2C8" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M158 358 Q200 350 242 358 L246 398 Q200 404 154 398 Z" fill="rgba(0,0,0,0.1)" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>${o.mask ? bMask(o.mask) : ''}</g>`;
  return HALO(back + body + front);
};
const bMask = k => `<g opacity="${f1(k * 100) / 100}"><path d="M104 168 Q200 122 296 168 Q300 226 252 230 Q222 232 200 208 Q178 232 148 230 Q100 226 104 168 Z" fill="#F7F3EA" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` +
  `<ellipse cx="160" cy="184" rx="22" ry="14" fill="${INK}"/><ellipse cx="240" cy="184" rx="22" ry="14" fill="${INK}"/><path d="M118 160 Q200 128 282 160" stroke="#C8423A" stroke-width="6" fill="none"/><circle cx="296" cy="170" r="7" fill="#C8423A"/></g>`;
const BTC = { A: '#8EC5F0', B: '#F0646A', O: '#6CCB7A', AB: '#F2D33B' };
// B wears sunglasses: done as an expression so it follows the head
const SUN = 'M136 168 L194 168 L194 188 Q192 214 166 214 Q138 214 136 188 Z', SUN2 = 'M206 168 L264 168 L264 188 Q262 214 234 214 Q208 214 206 188 Z';
E['B화남'] = { eyeL: SUN, eyeR: SUN2, eyeFill: '#15151B', eyeSW: 6, bL: [136, 150, 163, 160, 190, 170], bR: [210, 170, 237, 160, 264, 150], mouth: ell(200, 242, 18, 14), mouthFill: '#5A1E2A' };
E['B울음'] = { eyeL: SUN, eyeR: SUN2, eyeFill: '#15151B', eyeSW: 6, bL: [140, 164, 164, 148, 188, 142], bR: [212, 142, 236, 148, 260, 164], mouth: 'M178 248 Q200 222 222 248', mouthFill: 'none' };
E['B기본'] = { eyeL: SUN, eyeR: SUN2, eyeFill: '#15151B', eyeSW: 6, bL: [140, 150, 163, 144, 186, 150], bR: [214, 146, 237, 140, 260, 150], mouth: 'M184 236 Q204 244 220 230', mouthFill: 'none' };
const bGuest = (type, t, o) => {
  const tr = bTr(o), c = BTC[type];
  let back = '', front = '';
  const base = { goggles: 'none', vest: c, patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', t };
  if (type === 'A') Object.assign(base, { hair: '#3B3A44', seed: 71 });
  if (type === 'B') Object.assign(base, { hair: '#2A2226', seed: 72, noBlink: true });
  if (type === 'O') {
    Object.assign(base, { hair: '#5A3A22', seed: 73 });
    if (o.bundle !== false) back += `<g transform="${tr}"><ellipse cx="206" cy="232" rx="196" ry="176" fill="#C9A06A" stroke="${INK}" stroke-width="8"/><path d="M60 200 Q206 140 352 200" stroke="#9E7444" stroke-width="7" fill="none"/>` +
      `<path d="M180 64 q26 -40 52 0 q-26 18 -52 0 Z" fill="#B88B55" stroke="${INK}" stroke-width="6"/><rect x="70" y="250" width="70" height="44" rx="6" fill="#E9D7B0" stroke="${INK}" stroke-width="4" transform="rotate(-10 105 272)"/><rect x="272" y="270" width="64" height="40" rx="6" fill="#B9C7B0" stroke="${INK}" stroke-width="4" transform="rotate(8 304 290)"/></g>`;
  }
  if (type === 'AB') {
    Object.assign(base, { seed: 74, shade: '#E6E2C8' });
    back += `<g transform="${tr}"><path d="M60 180 Q56 34 200 30 Q344 34 340 180 Q344 290 286 300 L114 300 Q56 290 60 180 Z" fill="${c}" stroke="${INK}" stroke-width="8"/></g>`;
    front += `<g transform="${tr}"><rect x="104" y="120" width="192" height="150" rx="56" fill="#BFE6FF" fill-opacity=".28" stroke="${INK}" stroke-width="7"/><path d="M124 140 Q150 128 176 134" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>` +
      `<rect x="168" y="268" width="64" height="30" rx="8" fill="#5B5B66" stroke="${INK}" stroke-width="5"/><circle cx="186" cy="283" r="7" fill="#333"/><circle cx="214" cy="283" r="7" fill="#333"/></g>`;
  }
  const body = char(Object.assign(base, o));
  const [bx, by] = bChest(o.x, o.y, o.s || 1, o.sy || 1), bs = (o.s || 1) * 0.95;
  const badge = o.badge === false ? '' : `<g transform="translate(${f1(bx - 40 * (o.s || 1))} ${f1(by)}) scale(${f1(bs * 100) / 100})"><circle r="30" fill="#fff" stroke="${INK}" stroke-width="6"/>${bTxt(0, type.length > 1 ? 11 : 13, type, type.length > 1 ? 28 : 36, INK)}</g>`;
  return HALO(back + body + front) + badge;
};
// a soul half-way out of the head
const bSoul = (x, y, s, t, seed, k = 1) => {
  const [hx, hy] = bHead(x, y, s); const top = hy - 112 * s, sway = Math.sin(t * 2.2 + seed) * 10 * s, rise = (Math.sin(t * 1.3 + seed) * 0.5 + 0.5) * 18 * s;
  const gx = hx + sway, gy = top - 46 * s - rise;
  return `<g opacity="${f1(0.78 * k * 100) / 100}"><path d="M${f1(hx)} ${f1(top + 6)} Q${f1(hx + sway * 0.6)} ${f1(top - 20 * s)} ${f1(gx)} ${f1(gy + 30 * s)}" stroke="#fff" stroke-width="${f1(10 * s)}" fill="none" stroke-linecap="round"/>` +
    `<g transform="translate(${f1(gx)} ${f1(gy)}) scale(${f1(s * 100) / 100})"><path d="M-34 24 Q-40 -38 0 -40 Q40 -38 34 24 Q24 14 16 26 Q8 14 0 26 Q-8 14 -16 26 Q-24 14 -34 24 Z" fill="#F4F8FF" stroke="${INK}" stroke-width="5"/><circle cx="-11" cy="-10" r="5" fill="${INK}"/><circle cx="11" cy="-10" r="5" fill="${INK}"/><ellipse cx="0" cy="6" rx="6" ry="4" fill="${INK}"/></g></g>`;
};
// Schopenhauer: white side tufts, dark coat, white cravat
const bSH = o => { const tr = bTr(o); return char(Object.assign({ goggles: 'none', vest: '#2E2E38', patch: false, tee: true, vshade: 'rgba(0,0,0,0.3)', collar: true, tie: '#F4F1EA', seed: 9 }, o)) +
  `<g transform="${tr}"><path d="M84 112 Q44 122 52 168 Q34 196 62 222 Q84 236 98 214 Q86 176 100 136 Z" fill="#F2F2F2" stroke="${INK}" stroke-width="6"/><path d="M316 112 Q356 122 348 168 Q366 196 338 222 Q316 236 302 214 Q314 176 300 136 Z" fill="#F2F2F2" stroke="${INK}" stroke-width="6"/></g>`; };
const bCounter = (x0, x1, top, o = {}) => {
  let h = `<g><rect x="${x0 - 14}" y="${top - 26}" width="${x1 - x0 + 28}" height="30" rx="6" fill="#B07A4A" stroke="${INK}" stroke-width="7"/><rect x="${x0}" y="${top + 4}" width="${x1 - x0}" height="${1300 - top}" fill="#7A4E2E" stroke="${INK}" stroke-width="7"/>`;
  for (let x = x0 + 120; x < x1; x += 120) h += `<line x1="${x}" y1="${top + 10}" x2="${x}" y2="1300" stroke="${INK}" stroke-width="4" opacity=".35"/>`;
  h += `<rect x="${x0}" y="${top + 4}" width="${x1 - x0}" height="40" fill="#000" opacity=".22"/>`;
  if (o.bell !== false) h += `<g transform="translate(${x0 + 70} ${top - 26})"><path d="M-26 0 Q-26 -34 0 -36 Q26 -34 26 0 Z" fill="#E8C35A" stroke="${INK}" stroke-width="5"/><rect x="-32" y="-4" width="64" height="8" rx="4" fill="#C9A04A" stroke="${INK}" stroke-width="4"/><circle cy="-40" r="6" fill="#E8C35A" stroke="${INK}" stroke-width="4"/></g>`;
  return h + `</g>`;
};
const bCup = (x, y, k = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${k})"><path d="M-34 -70 L34 -70 L26 0 L-26 0 Z" fill="#F4EFE6" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="-34" y="-54" width="68" height="18" fill="#E2B04A" opacity=".85"/><ellipse cx="0" cy="-70" rx="34" ry="8" fill="#8A5A34" stroke="${INK}" stroke-width="5"/></g>`;
const bRain = (t, n = 70, op = 0.35) => { let h = `<g stroke="#CFE3FF" stroke-width="3" opacity="${op}" stroke-linecap="round">`;
  for (let i = 0; i < n; i++) { const x = hash(i * 1.7) * 2400 - 200, sp = 900 + hash(i * 2.3) * 500, y = ((hash(i * 5.1) * 1400 + t * sp) % 1400) - 150; h += `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x - 14)}" y2="${f1(y + 46)}"/>`; }
  return h + `</g>`; };
const bSnow = (t, n = 90) => { let h = '<g fill="#fff" opacity=".85">'; for (let i = 0; i < n; i++) { const x = ((hash(i * 1.3) * 2400 + Math.sin(t * 0.9 + i) * 40 - t * 140) % 2400 + 2400) % 2400 - 200, y = ((hash(i * 4.7) * 1400 + t * (160 + hash(i) * 140)) % 1400) - 150; h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(3 + hash(i * 9.1) * 5)}"/>`; } return h + '</g>'; };
const bNeonDefs = () => `<defs><filter id="bneon" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
const bNeonText = (x, y, s, size, col, on) => on < 0.05 ? bTxt(x, y, s, size, '#3B3346', { stroke: '#221C2A', sw: 4 }) :
  `<g opacity="${f1((0.35 + 0.65 * on) * 100) / 100}" filter="url(#bneon)">${bTxt(x, y, s, size, '#FFF4FB', { stroke: col, sw: 9 })}</g>`;
const bFlicker = (lt, t0) => { const k = lt - t0; if (k < 0) return 0; if (k > 0.9) return 0.92 + 0.08 * Math.sin(lt * 40); return [1, 0, 1, 1, 0, 0, 1, 0, 1, 1][Math.floor(k * 11) % 10]; };
const bHeart = (x, y, s, col = '#FF5A6E') => `<path transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 100) / 100})" d="M0 22 C-30 0 -42 -14 -42 -30 C-42 -46 -28 -54 -16 -54 C-6 -54 0 -46 0 -40 C0 -46 6 -54 16 -54 C28 -54 42 -46 42 -30 C42 -14 30 0 0 22 Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
const bPaper = (x, y, w, h, rot, inner) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><rect x="${-w / 2 + 8}" y="${-h / 2 + 10}" width="${w}" height="${h}" rx="8" fill="#000" opacity=".25"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="8" fill="#FBF7EE" stroke="${INK}" stroke-width="6"/>${inner}</g>`;
const bStamp = (x, y, txt, k, o = {}) => { // k: 0..1 slam progress (squash on landing)
  if (k <= 0) return ''; const land = k < 1 ? lerp(2.2, 1, easeIn(k)) : 1, sq = k >= 1 ? 1 + 0.1 * Math.exp(-(o.after || 0) * 9) : 1;
  const w = txt.length * (o.size || 52) * 1.02 + 50;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${o.rot || -8}) scale(${f1(land * sq * 100) / 100} ${f1(land / sq * 100) / 100})" opacity="${f1(Math.min(1, k * 2) * 0.92 * 100) / 100}"><rect x="${-w / 2}" y="-46" width="${w}" height="92" rx="12" fill="none" stroke="#D63A3A" stroke-width="9"/>${bTxt(0, (o.size || 52) * 0.36, txt, o.size || 52, '#D63A3A')}</g>`;
};
const bSpeech = (x, y, w, h, txt, o = {}) => `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M${-w / 2} ${-h / 2} h${w} v${h} h${-w * 0.5 + 40} l${o.tail || -30} 36 l0 -36 h${-w * 0.5 + 10 - (o.tail || -30) * 0} Z" fill="${o.bg || '#fff'}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>${txt ? bTxt(0, (o.size || 40) * 0.36, txt, o.size || 40, o.col || INK) : ''}</g>`;
const bHand = (x, y, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><circle r="40" fill="#fff" stroke="${INK}" stroke-width="10"/><path d="M-18 14 Q0 28 18 14" fill="none" stroke="#C9D6E2" stroke-width="8" stroke-linecap="round"/></g>`;
const bBigPhone = (x, y, s, rot, inner, o = {}) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000})"><rect x="-190" y="-340" width="380" height="680" rx="54" fill="#1F2D44" stroke="${INK}" stroke-width="12"/>` +
  `<rect x="-166" y="-300" width="332" height="600" rx="22" fill="${o.bg || '#B7CCE0'}"/><rect x="-166" y="-300" width="332" height="74" rx="22" fill="${o.head || '#9FB5CC'}"/><rect x="-40" y="-326" width="80" height="12" rx="6" fill="#0A0F18"/>${inner}</g>`;
const bPlate = (k, cam, depth = 0.55, o = {}) => {
  const [cx, cy, z] = cam, zb = 1 + (z - 1) * depth; let bx = 960 + (cx - 960) * depth, by = 560 + (cy - 560) * depth;
  const hx = 960 / 0.88 / zb; bx = clamp(bx, -150 + hx + 4, 2070 - hx - 4); by = clamp(by, -30 + 573.6 / zb + 4, 1220 - 653.6 / zb - 4);
  return `<g transform="translate(960 560) scale(${f1(zb * 1000) / 1000}) translate(${f1(-bx)} ${f1(-by)})"><image href="${QBG[k]}" x="-150" y="-30" width="2220" height="1250" preserveAspectRatio="xMidYMid slice"${o.blur ? ' filter="url(#qblur)"' : ''}/></g>`;
};
const bShake = (t, a) => [Math.sin(t * 61) * a, Math.cos(t * 47) * a];
const bTitleCard = (t, lt, t0, t1, txt, sub) => {
  if (lt < t0 || lt > t1) return ''; const k = prog(lt, t0, t0 + 0.4), out = prog(lt, t1 - 0.4, t1);
  return `<g opacity="${f1((1 - out) * Math.min(1, k * 1.5) * 100) / 100}" transform="translate(960 ${f1(1068 + 18 * (1 - easeOut(k)))})"><rect x="-330" y="-50" width="660" height="92" rx="46" fill="#120E1C" opacity=".72"/>` +
    `<g filter="url(#bneon)">${bTxt(0, 15, txt, 50, '#FFF4FB', { stroke: '#FF4FA6', sw: 8 })}</g>${sub ? bTxt(0, 70, sub, 26, '#E9DFF5') : ''}</g>`;
};

/* ---------- intro ---------- */
const SIGN = [424, 176];                           // the blank sign board in the alley plate (world coords)
const LINEUP = [1010, 1300, 1590, 1880], LFY = 1030, LS = 0.86;
function bLineup(t, focus, lt, a) {
  let h = '';
  LINEUP.forEach((x, k) => {
    const on = focus === k, type = ['A', 'B', 'O', 'AB'][k], y = LFY;
    let o = { x, y, s: LS, pose: '서기', ex: { expr: '지침', prev: '지침', k: 1, blink: 0 }, look: [-0.4, 0.1], rot: -3 };
    if (k === 0) Object.assign(o, { pose: '가슴', shiver: true, ex: { expr: '울먹', prev: '울먹', k: 1, blink: 0 } });
    if (k === 1) Object.assign(o, { ex: { expr: 'B기본', prev: 'B기본', k: 1, blink: 0 }, pose: '주머니' });
    if (k === 2) Object.assign(o, { ex: { expr: '신남', prev: '신남', k: 1, blink: 0 }, rot: Math.sin(t * 3) * 3 });
    if (k === 3) Object.assign(o, { look: [0.6, 0], pose: '주머니' });
    if (on && a) {
      if (k === 1) { const tF = bAt(a, '질러', 0.6), tT = bAt(a, '뒤돌', 1.4), tR = bAt(a, '찢는', 2.0);
        if (lt < tT) Object.assign(o, { pose: lt > tF ? '만세' : '주머니', ex: { expr: 'B화남', prev: 'B화남', k: 1, blink: 0 }, sy: lt > tF ? 1 + 0.06 * Math.exp(-(lt - tF) * 6) : 1 });
        else Object.assign(o, { pose: '안기', ex: { expr: 'B울음', prev: 'B울음', k: 1, blink: 0 }, sx: lt - tT < 0.25 ? 1 - 0.5 * Math.sin((lt - tT) / 0.25 * Math.PI) : 1, shiver: lt > tR });
      }
      if (k === 2) { const tF = bAt(a, '쓰러', 1.8); if (lt > tF) { const f = easeIn(clamp((lt - tF) / 0.45, 0, 1)); o.rot = -84 * f; o.y = y - 10 * Math.sin(f * Math.PI); o.ex = { expr: '지침', prev: '지침', k: 1, blink: 0 }; } }
      if (k === 3) { const tR = bAt(a, '도망', 1.6); if (lt > tR) { const g = clamp((lt - tR) / 1.2, 0, 1); o.x = x + 260 * easeIn(g); o.pose = walkPose(lt * 10, 0.8); o.look = [0.9, 0]; } }
      if (k === 0) o.ex = { expr: '겁먹음', prev: '겁먹음', k: 1, blink: 0 };
    }
    h += qShadow(o.x, y, 64 * LS) + bGuest(type, t, o);
    if (on && k === 1 && a && lt > bAt(a, '찢는', 2.0)) { // the torn blanket
      const g = clamp((lt - bAt(a, '찢는', 2.0)) / 0.3, 0, 1), [cx, cy] = bChest(x, y, LS);
      h += `<g transform="translate(${f1(cx - 40 * g)} ${f1(cy + 20)}) rotate(${f1(-12 * g)})"><path d="M-70 -40 L0 -40 L-10 -10 L6 14 L-6 40 L-70 40 Z" fill="#9C86D8" stroke="${INK}" stroke-width="6"/></g><g transform="translate(${f1(cx + 40 * g)} ${f1(cy + 20)}) rotate(${f1(12 * g)})"><path d="M70 -40 L4 -40 L-6 -10 L10 14 L-2 40 L70 40 Z" fill="#9C86D8" stroke="${INK}" stroke-width="6"/></g>`;
      if (g > 0) h += fx(t, t - lt + bAt(a, '찢는', 2.0), t + 9, cx, cy - 210, '찌익!', '#fff', { size: 64, rot: 8 });
    }
    if (on && k === 1 && a && lt > bAt(a, '질러', 0.6) && lt < bAt(a, '뒤돌', 1.4)) h += fx(t, t - lt + bAt(a, '질러', 0.6), t - lt + bAt(a, '뒤돌', 1.4), x, LFY - 520, '확!', '#FFD23F', { size: 80, burst: 90, burstColor: '#FF6B3D' });
    if (on && k === 3 && a) { const tS = bAt(a, '피곤', 0.8); if (lt > tS && lt < tS + 1.0) for (let i = 0; i < 6; i++) { const q = (lt - tS) * 3 + i * 0.18; h += `<circle cx="${f1(x - 70 - q * 60)}" cy="${f1(LFY - 330 + Math.sin(i * 2) * 20)}" r="${f1(8 + q * 10)}" fill="#E6F6FF" opacity="${f1(Math.max(0, 0.7 - q * 0.4) * 100) / 100}"/>`; } }
    if (!(k === 2 && o.rot < -40)) h += bSoul(o.x, y, LS, t, k * 1.7, on ? 1 : 0.7);
  });
  return h;
}
function balleyScene(t, lt, a) {
  const cam = qLerpCam(lt / 3.4, [1000, 560, 1.0], [880, 560, 1.07]);
  let w = bLineup(t, -1, lt);
  w += bNeonText(SIGN[0], SIGN[1] + 22, '제로의 심야 멘탈 수리점', 58, '#FF4FA6', bFlicker(lt, 0.5));
  w += `<rect x="372" y="388" width="62" height="60" fill="#FFD27A" opacity="${f1(0.1 + 0.08 * Math.sin(t * 3) * 100) / 100}"/>`;
  return bNeonDefs() + bPlate('alley', cam, 0.6) + qCam(cam, w) + bRain(t) + bFull('#1A0F2E', 0.18) + bTitleCard(t, lt, 1.1, 99, '[제로의 세계]');
}
function bneonScene(t, lt, a) { // A B O AB flicker on, one by one, on the brick wall
  const cam = qLerpCam(lt / 2.2, [1480, 420, 1.55], [1470, 430, 1.62]);
  const cols = ['#5DB8FF', '#FF5A5A', '#6CFF8E', '#FFE04A'], L = ['A', 'B', 'O', 'AB'];
  let w = '';
  L.forEach((s, i) => { w += bNeonText(1180 + i * 200 + (i === 3 ? 20 : 0), 470, s, 150, cols[i], bFlicker(lt, 0.15 + i * 0.28)); });
  return bNeonDefs() + bPlate('alley', cam, 0.75) + bFull('#120A22', 0.35) + qCam(cam, w) + bRain(t, 50, 0.3) + bTitleCard(t, lt, -1, 0.5, '[제로의 세계]');
}
/* shop interior: Zero behind the counter, stirring cold coffee with chopsticks */
const ZC = [960, 930], CTOP = 790;
const bStir = (t, lt, stir = 1) => { const ph = t * 9 * stir; const hx = 318 + Math.cos(ph) * 12 * stir, hy = 386 + Math.sin(ph) * 5 * stir; return bPose('카운터', { armR: [[252, 285], [300, 344], [hx, hy]], hR: [hx, hy] }); };
const bChop = (t, stir = 1, up = 0) => { const ph = t * 9 * stir, [x, y] = ptOf(ZC[0], ZC[1], 1, 318 + Math.cos(ph) * 12 * stir, 386 + Math.sin(ph) * 5 * stir);
  return `<g stroke="#C89A5A" stroke-width="7" stroke-linecap="round"><line x1="${f1(x)}" y1="${f1(y - 6 - up)}" x2="${f1(1086 + Math.cos(ph) * 8 * stir)}" y2="${f1(CTOP - 70 - up)}"/><line x1="${f1(x + 6)}" y1="${f1(y - 2 - up)}" x2="${f1(1096 + Math.cos(ph) * 8 * stir)}" y2="${f1(CTOP - 66 - up)}"/></g>`; };
function bShop(t, lt, cam, zo, extra = '', o = {}) {
  let w = qShadow(ZC[0], ZC[1], 70) + bZero(t, Object.assign({ x: ZC[0], y: ZC[1], s: 1 }, zo));
  w += bCounter(520, 1400, CTOP) + extra;
  return bPlate(o.close ? 'shopc' : 'shop', cam, o.depth || 0.5, { blur: !!o.close }) + qCam(cam, w);
}
function bstampScene(t, lt, a) {
  const cam = qLerpCam(lt / 4, [960, 650, 1.28], [990, 640, 1.36]);
  const tS = bAt(a, '유사', 2.2), slam = prog(lt, tS - 0.18, tS);
  const chart = bPaper(800, CTOP - 22, 300, 40, -4, '') ;
  const card = `<g transform="translate(630 ${CTOP - 128}) rotate(-6)"><rect x="-150" y="-110" width="300" height="220" rx="10" fill="#FBF7EE" stroke="${INK}" stroke-width="6"/>${bTxt(0, -66, '혈액형 성격표', 30, INK)}` +
    ['A 소심', 'B 자유', 'O 대범', 'AB 4차원'].map((s, i) => bTxt(-110, -20 + i * 36, s, 26, '#555', { anchor: 'start' })).join('') + `</g>`;
  const st = bStamp(630, CTOP - 128, '유사과학', slam, { after: lt - tS, rot: -14, size: 50 });
  const zo = { pose: bStir(t, lt), ex: { expr: '심드렁', prev: '심드렁', k: 1, blink: 0 }, look: [0.5, 0.4] };
  return bShop(t, lt, cam, zo, card + st + bCup(1092, CTOP - 26) + bChop(t) + (slam >= 1 && lt - tS < 0.3 ? `<g opacity="${f1((1 - (lt - tS) / 0.3) * 100) / 100}">${speedLines ? speedLines(630, CTOP - 128, 190, 260, 12, t, '#fff', 0.8) : ''}</g>` : ''));
}
function blookScene(t, lt, a) { // stops stirring, eyes to the camera
  const cam = qLerpCam(lt / 1.4, [960, 600, 2.0], [960, 590, 2.2]);
  const stop = clamp(lt / 0.35, 0, 1), up = Math.sin(clamp((lt - 0.25) / 0.4, 0, 1) * Math.PI / 2);
  const zo = { pose: bStir(t, lt, 1 - stop), ex: exprAt([[0, '심드렁'], [0.35, '눈썹업']], lt), look: [0.5 * (1 - up), 0.4 * (1 - up)], tilt: -4 * up };
  return bShop(t, lt, cam, zo, bCup(1092, CTOP - 26) + bChop(t, 1 - stop, 30 * up), { close: true, depth: 0.3 });
}
function bbumpScene(t, lt, a) { // bumped this way and that, then the glass heart shatters
  const cam = qLerpCam(lt / 5, [960, 600, 1.12], [960, 590, 1.2]);
  const t1 = bAt(a, '이리', 1.0), t2 = bAt(a, '저리', 1.8), t3 = bAt(a, '산산', 3.2);
  const hit = (tt) => lt > tt ? Math.exp(-(lt - tt) * 5) * Math.sin((lt - tt) * 14) : 0;
  const dx = -60 * hit(t1) * (lt < t2 ? 1 : 0) + 70 * hit(t2), x = 960 + dx;
  let w = '';
  for (let i = 0; i < 6; i++) { const dir = i % 2 ? 1 : -1, sp = 260 + i * 30, px = ((i * 420 + lt * sp * dir) % 2600 + 2600) % 2600 - 300, yy = 1000 + (i % 3) * 14;
    w += qShadow(px, yy, 60) + `<g opacity=".9">${HALO(char({ goggles: 'none', vest: ['#7D8597', '#8E8A9B', '#6F7A8C'][i % 3], patch: false, tee: true, hair: '#2F2F33', x: px, y: yy, s: 0.95, t, seed: 20 + i, pose: walkPose(lt * 10 + i, 0.8), ex: { expr: '지침', prev: '지침', k: 1, blink: 0 } }))}</g>`; }
  const ex = lt > t3 ? '겁먹음' : (lt > t1 ? '걱정' : '지침');
  w += qShadow(x, 1010, 66) + HALO(char({ goggles: 'none', vest: '#C9CED8', patch: false, tee: true, hair: '#3B3A44', x, y: 1010, s: 1, t, seed: 33, rot: dx * 0.12, pose: lt > t3 ? '가슴' : '서기', ex: { expr: ex, prev: ex, k: 1, blink: 0 } }));
  const [hx, hy] = bHead(x, 1010); const hy2 = hy - 190;
  if (lt < t3) w += `<g opacity=".9">${bHeart(x, hy2, 1.4, '#BFE6FF')}<path d="M${x - 22} ${hy2 - 36} q8 -8 18 -2" stroke="#fff" stroke-width="6" fill="none"/></g>` + (lt > t2 ? `<path d="M${x - 10} ${hy2 - 50} l12 22 l-14 12 l16 18" stroke="${INK}" stroke-width="4" fill="none"/>` : '');
  else { const g = clamp((lt - t3) / 0.9, 0, 1); for (let i = 0; i < 9; i++) { const an = i / 9 * 6.28 + 0.3, r = 30 + easeOut(g) * 220; w += `<path transform="translate(${f1(x + Math.cos(an) * r)} ${f1(hy2 + Math.sin(an) * r + g * g * 260)}) rotate(${f1(g * 400 * (i % 2 ? 1 : -1))})" d="M0 -18 L16 8 L-12 14 Z" fill="#BFE6FF" stroke="${INK}" stroke-width="4" opacity="${f1((1 - g * 0.6) * 100) / 100}"/>`; } }
  return bPlate('office', cam, 0.5) + bFull('#1C2340', 0.32) + qCam(cam, w);
}
function bloupeScene(t, lt, a) { // Zero inspects a tiny broken stick-figure doll on the counter
  const cam = qLerpCam(lt / 3, [1000, 650, 1.7], [1030, 680, 1.95]);
  const dollX = 1110, dollY = CTOP - 26;
  let doll = `<g transform="translate(${dollX} ${dollY})">${HALO(char({ goggles: 'none', vest: '#C9CED8', patch: false, tee: true, x: 0, y: 0, s: 0.24, t, still: true, rot: 10, pose: '납작', ex: { expr: '지침', prev: '지침', k: 1, blink: 0 } }))}`;
  doll += `<path d="M-6 -118 q-14 -18 0 -30 q14 -12 0 -26 q-14 -12 0 -24" stroke="#999" stroke-width="5" fill="none"/><circle cx="18" cy="-60" r="6" fill="#999" stroke="${INK}" stroke-width="3"/><path d="M30 -20 l18 -6" stroke="#999" stroke-width="5"/></g>`;
  const [lx, ly] = [1060 + Math.sin(t * 1.6) * 16, 660 + Math.cos(t * 1.3) * 8];
  const zo = { pose: bPose('카운터', { armR: [[252, 285], [300, 300], [306, 286]], hR: [306, 286] }), ex: { expr: '결심', prev: '결심', k: 1, blink: 0 }, look: [0.7, 0.8], tilt: 8, rot: 6 };
  const loupe = `<line x1="${f1(lx - 10)}" y1="${f1(ly - 60)}" x2="${f1(ptOf(ZC[0], ZC[1], 1, 306, 286)[0])}" y2="${f1(ptOf(ZC[0], ZC[1], 1, 306, 286)[1])}" stroke="#5A3A22" stroke-width="16" stroke-linecap="round"/>` +
    `<circle cx="${f1(lx + 30)}" cy="${f1(ly + 30)}" r="70" fill="#E6F6FF" fill-opacity=".25" stroke="#3B3A44" stroke-width="14"/>`;
  return bShop(t, lt, cam, zo, doll + loupe, { close: true, depth: 0.3 });
}
function bwheelScene(t, lt, a) { // a hamster wheel of four types
  const cam = qLerpCam(lt / 4, [960, 560, 1.0], [960, 560, 1.08]), r = 330, cx = 960, cy = 560, rot = lt * 70;
  let w = `<g transform="translate(${cx} ${cy}) rotate(${f1(rot)})">`;
  ['A', 'B', 'O', 'AB'].forEach((s, i) => { const a0 = i * 90 - 90, a1 = a0 + 90, p = (d) => [Math.cos(d * Math.PI / 180) * r, Math.sin(d * Math.PI / 180) * r];
    const [x0, y0] = p(a0), [x1, y1] = p(a1); w += `<path d="M0 0 L${f1(x0)} ${f1(y0)} A${r} ${r} 0 0 1 ${f1(x1)} ${f1(y1)} Z" fill="${BTC[s]}" opacity=".9" stroke="${INK}" stroke-width="8"/>`;
    const [tx, ty] = p(a0 + 45).map(v => v * 0.62); w += `<g transform="translate(${f1(tx)} ${f1(ty)}) rotate(${f1(-rot)})">${bTxt(0, 30, s, 90, '#fff', { stroke: INK, sw: 10 })}</g>`; });
  w += `<circle r="${r}" fill="none" stroke="${INK}" stroke-width="16"/><circle r="40" fill="#5A5A66" stroke="${INK}" stroke-width="8"/></g>`;
  w += `<path d="M${cx} ${cy} L${cx - 200} ${cy + 500} M${cx} ${cy} L${cx + 200} ${cy + 500}" stroke="#5A5A66" stroke-width="22" stroke-linecap="round"/>`;
  const rx = cx, ry = cy + r - 6; // runner on the inside bottom of the wheel
  w += HALO(char({ goggles: 'none', vest: '#C9CED8', patch: false, tee: true, hair: '#3B3A44', x: rx, y: ry, s: 0.5, t, seed: 33, pose: walkPose(lt * 16, 1.1), ex: { expr: '걱정', prev: '걱정', k: 1, blink: 0 }, rot: 6 }));
  const tG = bAt(a, '소름', 0.3); if (lt > tG && lt < tG + 1.4) for (let i = 0; i < 8; i++) w += `<path d="M${f1(rx - 80 + i * 22)} ${f1(ry - 300 - (i % 2) * 20)} l6 -18" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/>`;
  return bPlate('shopc', cam, 0.3, { blur: true }) + bFull('#0E1424', 0.55) + qCam(cam, w);
}
function blineScene(t, lt, a) { // pan along the queue, one guest per line
  const k = a.k, prev = Math.max(0, k - 1), cx = i => Math.min(1640, LINEUP[i]), from = [cx(prev), 650, 1.62], to = [cx(k), 650, 1.62];
  const cam = k === 0 ? qLerpCam(lt / 0.9, [1500, 620, 1.05], to) : qLerpCam(lt / 0.55, from, to);
  return bNeonDefs() + bPlate('alley', cam, 0.6) + qCam(cam, bLineup(t, k, lt, a)) + bRain(t, 60, 0.3) + bFull('#1A0F2E', 0.12);
}
function bsummonScene(t, lt, a) { // mask on, four philosophers rise from the smoke
  const tM = bAt(a, '가면', 1.6), tS = bAt(a, '소환', 6.4), tP = bAt(a, '대문호', tS - 1.4);
  const cam = qLerpCam(prog(lt, tP - 0.6, tS), [960, 640, 1.45], [960, 560, 1.05]);
  const mk = clamp((lt - tM + 0.3) / 0.35, 0, 1);
  let extra = '';
  const ph = [['MA', 560], ['NZ', 745], ['ZH', 1175], ['SH', 1360]];
  ph.forEach(([who, x], i) => {
    const t0 = tP + i * 0.32, g = clamp((lt - t0) / 0.5, 0, 1); if (g <= 0) return;
    const y = CTOP + 60 + (1 - easeOutBack(g)) * 220, o = { x, y, s: 0.7, t, pose: '서기', ex: { expr: '결심', prev: '결심', k: 1, blink: 0 } };
    const body = who === 'MA' ? MA(o) : who === 'NZ' ? NZ(o) : who === 'ZH' ? ZH(o) : bSH(o);
    extra += `<g opacity="${f1(g * 100) / 100}"><ellipse cx="${x}" cy="${y - 280}" rx="200" ry="240" fill="url(#amber)" opacity=".7"/>${body}</g>` + puff(x, y - 260, t, t - lt + t0, 1.3, '#E9DFF5');
  });
  const zo = { pose: lt < tM + 0.3 && lt > tM - 0.4 ? bPose('서기', { armL: [[148, 285], [120, 250], [150, 196]], hL: [150, 190], armR: [[252, 285], [280, 250], [250, 196]], hR: [250, 190] }) : '카운터', mask: mk, ex: { expr: '결심', prev: '결심', k: 1, blink: 0 }, look: [0, 0] };
  const back = extra; // philosophers stand behind the counter, beside Zero
  let w = qShadow(ZC[0], ZC[1], 70) + back + bZero(t, Object.assign({ x: ZC[0], y: ZC[1], s: 1 }, zo)) + bCounter(520, 1400, CTOP);
  if (lt > tS) w += `<ellipse cx="960" cy="${CTOP - 30}" rx="${f1(460 * easeOut(clamp((lt - tS) / 0.4, 0, 1)))}" ry="40" fill="none" stroke="#FFD27A" stroke-width="8" opacity=".8"/>`;
  return bPlate('shop', cam, 0.5) + qCam(cam, w) + (mk > 0 ? tag(t, t - lt + tM + 0.2, t - lt + tP - 0.1, 960, 230, '유사과학의 가면', '#F7F3EA', { size: 40 }) : '') + bFull('#2A1640', 0.12 + 0.12 * prog(lt, tP, tS));
}
function brxScene(t, lt, a) { // the prescription pad slides toward us, a bone bonks in
  const cam = qLerpCam(lt / 4, [960, 620, 1.7], [960, 640, 1.85]);
  const tB = bAt(a, '뼈', 1.2), tR = bAt(a, '처방전', 2.6);
  const zo = { pose: lt > tR - 0.3 ? '내밀기' : '카운터', ex: exprAt([[0, '미소'], [tR, '윙크']], lt), look: [0, 0] };
  const pk = easeOutBack(clamp((lt - tR + 0.3) / 0.5, 0, 1));
  const pad = pk > 0 ? `<g transform="translate(${f1(1180 - 60 * pk)} ${f1(CTOP - 40 + 40 * pk)}) scale(${f1((0.7 + 0.5 * pk) * 100) / 100}) rotate(-6)"><rect x="-120" y="-150" width="240" height="300" rx="10" fill="#FBF7EE" stroke="${INK}" stroke-width="7"/><rect x="-120" y="-150" width="240" height="56" rx="10" fill="#3DBA8A" stroke="${INK}" stroke-width="7"/>${bTxt(0, -110, '처방전', 36, '#fff')}` +
    [0, 1, 2, 3].map(i => `<line x1="-90" y1="${-50 + i * 44}" x2="90" y2="${-50 + i * 44}" stroke="#C9C0AE" stroke-width="5"/>`).join('') + bTxt(-80, 120, 'Rx', 36, '#3DBA8A', { anchor: 'start' }) + `</g>` : '';
  let bone = '';
  if (lt > tB - 0.25 && lt < tB + 1.2) { const g = clamp((lt - tB + 0.25) / 0.25, 0, 1), bx = lerp(1700, 1100, easeIn(g)), by = 440, bounce = lt > tB ? Math.sin((lt - tB) * 12) * 18 * Math.exp(-(lt - tB) * 4) : 0;
    bone = `<g transform="translate(${f1(bx)} ${f1(by + bounce)}) rotate(${f1(-30 + g * 30)})"><path d="M-90 -14 h180 a22 22 0 1 1 10 -30 a22 22 0 1 1 10 44 a22 22 0 1 1 -10 30 a22 22 0 1 1 -10 -30 h-180 a22 22 0 1 1 -10 30 a22 22 0 1 1 -10 -44 a22 22 0 1 1 10 -30 a22 22 0 1 1 10 30 Z" fill="#FBF7EE" stroke="${INK}" stroke-width="7"/></g>`;
    if (lt > tB) bone += fx(t, t - lt + tB, t - lt + tB + 1.1, 1060, 330, '빡!', '#FFD23F', { size: 64 }); }
  return bShop(t, lt, cam, zo, pad, { close: true, depth: 0.3 }) + qCam(cam, bone);
}

/* ---------- first guest: A ---------- */
const AX = 1450, AY = 1000;
function bticketScene(t, lt, a) { // queue-number board: 딩동
  const k = easeOutBack(clamp(lt / 0.4, 0, 1)), blink = lt < 1.0 ? (Math.floor(lt * 6) % 2 ? 0.55 : 1) : 1;
  let w = `<g transform="translate(960 470) scale(${f1(k * 100) / 100})"><rect x="-300" y="-150" width="600" height="300" rx="30" fill="#1A1420" stroke="${INK}" stroke-width="12"/><rect x="-270" y="-120" width="540" height="140" rx="12" fill="#0A0608"/>` +
    `<g opacity="${blink}" filter="url(#bneon)">${bTxt(0, -18, '001', 120, '#FF6A3D', { stroke: '#FF3A20', sw: 4 })}</g>${bTxt(0, 96, '첫 번째 손님', 46, '#fff')}</g>`;
  w += pop(t, t - lt + 0.5, t + 9, 960, 760, `<circle r="74" fill="${BTC.A}" stroke="${INK}" stroke-width="10"/>${bTxt(0, 34, 'A', 96, '#fff', { stroke: INK, sw: 10 })}`, {});
  w += pop(t, t - lt + 0.8, t + 9, 960, 900, outlined(0, 0, [a.title], { size: 46, sw: 10 }), {});
  return bNeonDefs() + bPlate('shopc', [960, 560, 1.05], 0.3, { blur: true }) + bFull('#0B0712', 0.55) + w;
}
function bAenterScene(t, lt, a) { // the door creaks, A crawls in shaking
  const cam = qLerpCam(lt / 3, [1260, 620, 1.12], [1320, 640, 1.2]);
  const g = clamp((lt - 0.7) / 2.2, 0, 1), x = lerp(2080, AX, easeOut(g)), hop = Math.abs(Math.sin(lt * 9)) * 10 * (g < 1 ? 1 : 0);
  const door = clamp(lt / 0.8, 0, 1);
  let w = `<g transform="translate(1990 0)"><rect x="0" y="40" width="${f1(110 * door)}" height="950" fill="#2C3A5C" opacity=".8"/><rect x="0" y="40" width="${f1(110 * door)}" height="950" fill="#9EC1FF" opacity="${f1(0.15 * door * 100) / 100}"/></g>`;
  w += qShadow(ZC[0], ZC[1], 70) + bZero(t, { x: ZC[0], y: ZC[1], s: 1, pose: '카운터', ex: exprAt([[0, '심드렁'], [0.6, '눈썹업']], lt), look: [0.9, 0] }) + bCounter(520, 1400, CTOP);
  w += qShadow(x, AY + 20, 70) + bGuest('A', t, { x, y: AY + 30 - hop, s: 0.95, pose: '웅크림', shiver: true, ex: { expr: '겁먹음', prev: '겁먹음', k: 1, blink: 0 }, look: [-0.9, 0] });
  for (let i = 0; i < 5; i++) { const sx = x + 60 + i * 70; if (sx < 2060) w += `<ellipse cx="${f1(sx)}" cy="${AY + 36}" rx="${16 + i * 2}" ry="5" fill="#9ED8FF" opacity="${f1((0.6 - i * 0.1) * 100) / 100}"/>`; }
  return bPlate('shop', cam, 0.5) + qCam(cam, w) + (lt > 0.1 && lt < 1.2 ? fx(t, t - lt + 0.15, t - lt + 1.2, 1640, 250, '끼이익…', '#E9DFF5', { size: 56, rot: 4 }) : '');
}
function bAphoneScene(t, lt, a) { // insert: the boss's message, trembling
  const [sx, sy] = bShake(t, 6), k = easeOut(clamp(lt / 0.35, 0, 1));
  let inner = bTxt(-150, -252, '‹', 44, INK, { anchor: 'start' }) + bTxt(0, -250, '팀장님', 32, INK);
  inner += `<circle cx="-126" cy="-150" r="28" fill="#5D6B82" stroke="${INK}" stroke-width="4"/>` + `<g transform="translate(-86 -120)"><rect x="0" y="-36" width="240" height="120" rx="20" fill="#fff" stroke="${INK}" stroke-width="4"/>${bTxt(16, 0, '내일 아침에', 30, INK, { anchor: 'start' })}${bTxt(16, 40, '회의실에서 잠깐', 30, INK, { anchor: 'start' })}</g>`;
  inner += `<g transform="translate(-86 30)"><rect x="0" y="-36" width="150" height="66" rx="20" fill="#fff" stroke="${INK}" stroke-width="4"/>${bTxt(16, 8, '봅시다.', 30, INK, { anchor: 'start' })}</g>` + bTxt(80, 56, '오후 6:03', 20, '#4A5568', { anchor: 'start' });
  let w = bBigPhone(960 + sx, 560 + sy + (1 - k) * 300, 1.0, -4 + sx * 0.3, inner);
  w += bHand(820 + sx, 760 + sy + (1 - k) * 300, 1.2) + bHand(1100 + sx, 740 + sy + (1 - k) * 300, 1.2);
  const beat = (lt % 0.55) < 0.12 ? 1 : 0;
  return bPlate('shopc', [960, 560, 1.1], 0.3, { blur: true }) + bFull('#0B0712', 0.5) + bFull('#FF2A2A', 0.06 * beat) + w;
}
function bAthinkScene(t, lt, a) { // a panorama of worst-case thoughts + a puddle of cold sweat
  const cam = qLerpCam(lt / 5.4, [AX - 60, 560, 1.32], [AX - 20, 520, 1.42]);
  let w = qShadow(AX, AY, 66) + `<ellipse cx="${AX}" cy="${AY + 10}" rx="${f1(40 + lt * 34)}" ry="${f1(10 + lt * 6)}" fill="#9ED8FF" opacity=".75" stroke="#5BA8D8" stroke-width="4"/>`;
  w += bGuest('A', t, { x: AX, y: AY, s: 1, pose: '가슴', shiver: true, ex: { expr: '겁먹음', prev: '겁먹음', k: 1, blink: 0 }, look: [0, -0.8] });
  const B = [['오늘 점심 메뉴 건의', '잘못했나?', 1120, 330, 0.3], ['엘리베이터 목례가', '45도 아니고 30도였나?', 1460, 230, 1.8], ['나 내일', '권고사직인가?', 1800, 340, 3.3]];
  B.forEach(([l1, l2, x, y, t0], i) => { w += pop(t, t - lt + t0, t + 9, x, y, bubble(0, 0, 400, 150, bTxt(0, -6, l1, 32, INK) + bTxt(0, 36, l2, 32, i === 2 ? '#D63A3A' : INK), { right: i === 2 }), { bob: 4 }); });
  for (let i = 0; i < 4; i++) { const ph = (lt * 1.6 + i * 0.25) % 1; w += `<path d="M${f1(AX - 120 + i * 80)} ${f1(AY - 520 + ph * 200)} q-10 18 0 26 q10 -8 0 -26 Z" fill="#9ED8FF" stroke="${INK}" stroke-width="3" opacity="${f1((1 - ph) * 100) / 100}"/>`; }
  return bPlate('shop', cam, 0.5) + qCam(cam, w);
}
function bAtalkScene(t, lt, a) { // close-up: lip-sync, the heart on his chest shrinks
  const cam = qLerpCam(lt / 6, [AX, 600, 2.15], [AX - 10, 610, 2.3]);
  const tS = bAt(a, '쪼그라', 3.0), sh = lt > tS ? 1 - 0.5 * clamp((lt - tS) / 0.8, 0, 1) : 1;
  E['_bA'] = Object.assign({}, qTalk('울먹', env(t)), { sweat: true });
  let w = qShadow(AX, AY, 66) + bGuest('A', t, { x: AX, y: AY, s: 1, pose: '가슴', shiver: lt > tS, ex: { expr: '_bA', prev: '_bA', k: 1, blink: 0 }, look: [-0.9, -0.1], badge: false });
  const [cx, cy] = bChest(AX, AY);
  w += bHeart(cx + 4, cy - 10 + Math.sin(t * 20) * 2, 0.7 * sh, '#FF5A6E');
  const [hx, hy] = bHead(AX, AY); for (let i = 0; i < 2; i++) { const ph = (lt * 1.2 + i * 0.5) % 1; w += `<path d="M${f1(hx - 40 + i * 80)} ${f1(hy + 30 + ph * 60)} q-8 14 0 20 q8 -6 0 -20 Z" fill="#9ED8FF" stroke="${INK}" stroke-width="3" opacity="${f1((1 - ph) * 100) / 100}"/>`; }
  return bPlate('shopc', [cam[0] - 300, cam[1], cam[2]], 0.3, { blur: true }) + qCam(cam, w) + warm(0.25);
}
function bAotsScene(t, lt, a) { // over Zero's shoulder: A holds his head
  const cam = qLerpCam(lt / 4, [AX - 140, 620, 1.65], [AX - 160, 610, 1.75]);
  E['_bA'] = Object.assign({}, qTalk('울먹', env(t)), { sweat: true });
  const rock = Math.sin(lt * 4) * 4;
  let w = qShadow(AX, AY, 66) + bGuest('A', t, { x: AX, y: AY, s: 1, rot: rock, pose: '머리감싸', ex: { expr: '_bA', prev: '_bA', k: 1, blink: 0 }, look: [-0.8, 0] });
  const fx0 = 980 + (cam[0] - 1300) * 0.4;
  const fg = `<g filter="url(#qfg)" opacity=".95"><path d="M${fx0 - 280} 1260 Q${fx0 - 250} 880 ${fx0} 860 Q${fx0 + 250} 880 ${fx0 + 280} 1260 Z" fill="${HOOD}" stroke="${INK}" stroke-width="10"/><path d="M${fx0 - 170} 900 Q${fx0} 840 ${fx0 + 170} 900 Q${fx0 + 120} 980 ${fx0} 990 Q${fx0 - 120} 980 ${fx0 - 170} 900 Z" fill="#D5733E" stroke="${INK}" stroke-width="10"/><circle cx="${fx0}" cy="690" r="190" fill="#A9B2BF" stroke="${INK}" stroke-width="10"/><path d="M${fx0 - 200} 760 Q${fx0} 900 ${fx0 + 200} 760 L${fx0 + 230} 900 Q${fx0} 980 ${fx0 - 230} 900 Z" fill="${HOOD}" stroke="${INK}" stroke-width="10"/></g>`;
  return bPlate('shopc', cam, 0.35, { blur: true }) + qCam(cam, w) + qCam([cam[0], cam[1], cam[2] * 1.08], fg) + warm(0.2);
}
function bAfavScene(t, lt, a) { // yes to every favour ... then sick in bed on the weekend
  const tW = bAt(a, '주말', 3.0);
  if (lt < tW) {
    const cam = qLerpCam(lt / tW, [960, 620, 1.2], [960, 600, 1.3]), n = Math.min(9, Math.floor(lt / 0.32) + 1);
    let w = qShadow(960, 1000, 66) + bGuest('A', t, { x: 960, y: 1000 + n * 0.8, s: 1, pose: P['들기'], ex: { expr: '신남', prev: '신남', k: 1, blink: 0 }, sy: 1 - n * 0.006 });
    const hold = ptOf(960, 1000, 1, 200, 364); w += nStack(hold[0], hold[1] + 6, n * 2, { rot: Math.sin(t * 3) * 2 });
    for (let i = 0; i < 3; i++) { const t0 = 0.2 + i * 0.7, g = clamp((lt - t0) / 0.5, 0, 1); if (g > 0 && g < 1) { const sd = i % 2 ? 1 : -1; w += bHand(960 + sd * lerp(700, 220, easeOut(g)), 560, 1.2) + nStack(960 + sd * lerp(640, 180, easeOut(g)), 580, 2); } }
    w += pop(t, t - lt + bAt(a, '들어', 1.4), t + 9, 1300, 330, bSpeech(0, 0, 360, 100, '네! 해드릴게요!', { size: 40 }), { bob: 3 });
    return bPlate('office', cam, 0.5) + bFull('#1C2340', 0.15) + qCam(cam, w);
  }
  const l2 = lt - tW, cam = qLerpCam(l2 / 2.5, [1340, 720, 1.35], [1360, 740, 1.48]);
  let w = `<g><rect x="980" y="860" width="760" height="120" rx="20" fill="#E9E6F2" stroke="${INK}" stroke-width="8"/><rect x="980" y="960" width="760" height="40" fill="#8A7A9A" stroke="${INK}" stroke-width="8"/><rect x="1680" y="700" width="60" height="300" rx="12" fill="#8A7A9A" stroke="${INK}" stroke-width="8"/></g>`;
  w += `<rect x="1010" y="820" width="150" height="56" rx="24" fill="#fff" stroke="${INK}" stroke-width="7"/><g transform="translate(1520 870)">${HALO(char({ goggles: 'none', vest: BTC.A, patch: false, tee: true, hair: '#3B3A44', x: 0, y: 0, s: 0.9, rot: -90, t, seed: 71, pose: '서기', ex: { expr: '지침', prev: '지침', k: 1, blink: 0 } }))}</g>`;
  w += `<path d="M1250 830 Q1450 800 1700 830 L1720 960 Q1450 990 1250 960 Z" fill="#B7A6E0" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  w += `<g transform="translate(1150 ${f1(800 + Math.sin(t * 2) * 4)})"><rect x="-12" y="-80" width="24" height="110" rx="12" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-6" y="-40" width="12" height="64" fill="#FF4D4D"/><circle cy="40" r="18" fill="#FF4D4D" stroke="${INK}" stroke-width="5"/></g>`;
  w += pop(t, t - l2 + 0.3, t + 9, 1340, 560, label(0, 0, '주말 = 앓아눕기', { size: 40, bg: '#F7E733' }), { rot: -4 });
  return bPlate('bedroom', cam, 0.5) + qCam(cam, w);
}
function bAchatScene(t, lt, a) { // group chat: his message ... and then silence for days
  const tM = bAt(a, '말', 0.9), tD = bAt(a, '며칠', 2.6), tG = bAt(a, '죄책감', 3.4);
  const cam = qLerpCam(lt / 5, [960, 560, 1.0], [960, 560, 1.06]);
  const msgs = [['민지', 'ㅋㅋㅋ 오늘 회식 ㄹㅇ 웃겼음', -0.2], ['준호', 'ㅇㅈ 부장님 노래 레전드', 0.15], ['서연', '아 배아파 ㅋㅋㅋ', 0.45]];
  let inner = bTxt(0, -250, '동기 단톡방 5', 30, INK);
  msgs.forEach(([n, s, t0], i) => { if (lt > t0) { const y = -170 + i * 92; inner += `<circle cx="-136" cy="${y}" r="22" fill="${['#F0A0B8', '#9FC7F0', '#C7B0F0'][i]}" stroke="${INK}" stroke-width="3"/>${bTxt(-104, y - 12, n, 20, '#333', { anchor: 'start' })}<rect x="-106" y="${y - 2}" width="${s.length * 21 + 24}" height="44" rx="14" fill="#fff" stroke="${INK}" stroke-width="3"/>${bTxt(-94, y + 28, s, 21, INK, { anchor: 'start' })}`; } });
  if (lt > tM) { const s = '저 이번 주말에 등산 가요! ㅎㅎ', ww = s.length * 21 + 24; inner += `<rect x="${150 - ww}" y="112" width="${ww}" height="48" rx="14" fill="#FFE34D" stroke="${INK}" stroke-width="3"/>${bTxt(150 - ww + 12, 144, s, 21, INK, { anchor: 'start' })}${bTxt(150 - ww - 8, 156, '4', 18, '#C8A600', { anchor: 'end' })}`; }
  let w = bBigPhone(960, 540, 1.32, 0, inner, { bg: '#B7CCE0' });
  if (lt > tD) { const n = Math.min(3, 1 + Math.floor((lt - tD) / 0.45)); w += pop(t, t - lt + tD, t + 9, 1500, 260, label(0, 0, `${n}일째 답장 없음…`, { size: 40, bg: '#E9DFF5' }), { rot: 4 }); }
  const aw = lt > tM + 0.6 ? 1 : 0;
  if (aw) { w += `<g transform="translate(470 760)">${bGuest('A', t, { x: 0, y: 0, s: 0.55, pose: '가슴', shiver: lt > tD, ex: { expr: lt > tD ? '겁먹음' : '걱정', prev: '걱정', k: 1, blink: 0 }, look: [0.8, -0.5], badge: false })}</g>`; }
  if (lt > tG) w += pop(t, t - lt + tG, t + 9, 470, 330, bubble(0, 0, 300, 110, bTxt(0, 14, '내가 뭐 실수했나?', 30, INK)), { bob: 3 });
  return bPlate('shopc', cam, 0.3, { blur: true }) + bFull('#0B0712', 0.45) + w;
}
function bAdxScene(t, lt, a) { // the diagnosis sheet gets stamped
  const tS = bAt(a, '타인', 1.9), slam = prog(lt, tS - 0.18, tS);
  const cam = qLerpCam(lt / 4, [960, 560, 1.0], [960, 560, 1.07]);
  let inner = `<rect x="-320" y="-300" width="640" height="76" fill="#3DBA8A"/>${bTxt(0, -248, '진 단 서', 46, '#fff')}`;
  inner += bTxt(-270, -150, '환자', 34, '#777', { anchor: 'start' }) + `<circle cx="-110" cy="-162" r="28" fill="${BTC.A}" stroke="${INK}" stroke-width="5"/>` + bTxt(-110, -149, 'A', 34, '#fff', { stroke: INK, sw: 5 }) + bTxt(-60, -150, '형 손님', 34, INK, { anchor: 'start' });
  inner += bTxt(-270, -60, '증상', 34, '#777', { anchor: 'start' }) + bTxt(-160, -60, '심장 쪼그라듦 · 식은땀', 32, INK, { anchor: 'start' }) + bTxt(-270, 30, '진단명', 34, '#777', { anchor: 'start' });
  [0, 1].forEach(i => inner += `<line x1="-270" y1="${110 + i * 70}" x2="270" y2="${110 + i * 70}" stroke="#D8D0C0" stroke-width="5"/>`);
  let w = bPaper(960, 560, 640, 600, -2, inner) + bStamp(960, 680, '타인 시선 중독증', slam, { after: lt - tS, rot: -7, size: 64 });
  if (slam >= 1 && lt - tS < 0.25) w += speedLines(960, 680, 330, 420, 14, t, '#fff', 0.7);
  if (lt < tS + 0.1) { const hy = lerp(200, 640, easeIn(clamp((lt - tS + 0.5) / 0.5, 0, 1))); w += `<g transform="translate(${960 + 300} ${f1(hy - 300)})"><rect x="-40" y="-120" width="80" height="160" rx="14" fill="#7A4E2E" stroke="${INK}" stroke-width="7"/><rect x="-70" y="40" width="140" height="44" rx="8" fill="#D63A3A" stroke="${INK}" stroke-width="7"/></g>`; }
  return bPlate('shopc', cam, 0.3, { blur: true }) + bFull('#0B0712', 0.4) + qCam([960, 560, 1 + (slam >= 1 ? 0.03 * Math.exp(-(lt - tS) * 6) : 0)], w);
}
/* ---------- the prescription: Marcus Aurelius ---------- */
const MAo = (t, o) => HALO(MA(Object.assign({ t, seed: 81 }, o)));
function bMAScene(t, lt, a) {
  const tN = bAt(a, '마르', 2.4), cam = qLerpCam(lt / 5, [1180, 620, 1.15], [1180, 610, 1.22]);
  const g = clamp((lt - tN + 0.35) / 0.45, 0, 1);
  let w = qShadow(ZC[0], ZC[1], 70) + bZero(t, { x: ZC[0], y: ZC[1], s: 1, pose: lt > tN - 0.4 ? '손인사' : '카운터', ex: { expr: '미소', prev: '미소', k: 1, blink: 0 }, look: [0.9, 0] }) + bCounter(520, 1400, CTOP);
  if (g > 0) w += qShadow(1720, AY, 70 * g) + MAo(t, { x: 1720, y: AY + (1 - easeOutBack(g)) * 40, s: 1.02, sy: 1 + 0.08 * (1 - g), pose: '서기', ex: { expr: '결심', prev: '결심', k: 1, blink: 0 }, look: [-0.6, 0] }) + puff(1720, AY - 260, t, t - lt + tN - 0.35, 1.8, '#F4EAD0') + (g > 0.6 ? rSparks(1720, AY - 640, t, 6, 120) : '');
  w += qShadow(AX - 30, AY, 66) + bGuest('A', t, { x: AX - 30, y: AY, s: 0.95, pose: g > 0.3 ? '만세' : '가슴', ex: { expr: g > 0.3 ? '놀람' : '걱정', prev: '걱정', k: 1, blink: 0 }, look: [g > 0.3 ? 0.9 : -0.9, 0], sy: g > 0.3 ? 1 + 0.06 * Math.exp(-(lt - tN) * 6) : 1 });
  const lab = pop(t, t - lt + tN + 0.3, t + 9, 1560, 300, `<rect x="-280" y="-70" width="560" height="140" rx="20" fill="#3B2350" stroke="${INK}" stroke-width="7"/>${bTxt(0, -4, '마르쿠스 아우렐리우스', 44, '#FFE9A8')}${bTxt(0, 44, '로마 제국 황제 · 121~180', 26, '#E9DFF5')}`, { rot: -2 });
  return bPlate('shop', cam, 0.5) + qCam(cam, w) + qCam(cam, lab);
}
function bMAdreamScene(t, lt, a) { // the imagined cushy life
  const cam = qLerpCam(lt / 3, [960, 580, 1.15], [960, 580, 1.25]);
  let w = `<rect x="-300" y="-200" width="2600" height="1500" fill="#FFD6EC"/>`;
  for (let i = 0; i < 14; i++) w += `<circle cx="${f1(hash(i * 3.1) * 2000)}" cy="${f1(hash(i * 7.7) * 1100)}" r="${f1(30 + hash(i) * 60)}" fill="#fff" opacity=".45"/>`;
  w += `<path d="M640 1000 L640 700 Q640 600 760 600 L1160 600 Q1280 600 1280 700 L1280 1000 Z" fill="#E8C35A" stroke="${INK}" stroke-width="9"/><rect x="600" y="820" width="720" height="140" rx="40" fill="#C8423A" stroke="${INK}" stroke-width="9"/>`;
  w += MAo(t, { x: 960, y: 1000, s: 1, rot: -8, pose: '턱괴기', ex: { expr: '신남', prev: '신남', k: 1, blink: 0 }, look: [0.3, -0.2] });
  const gx = 1160, gy = 600; for (let i = 0; i < 7; i++) w += `<circle cx="${gx + (i % 3) * 26}" cy="${gy + Math.floor(i / 3) * 24}" r="16" fill="#8E5BC8" stroke="${INK}" stroke-width="4"/>`;
  w += rSparks(960, 420, t, 8, 260, '#fff');
  const cloud = `<g opacity=".92"><path d="M-120 1200 Q-200 -40 600 0 Q960 -160 1320 0 Q2120 -40 2040 1200 Z" fill="none" stroke="#fff" stroke-width="40"/></g>`;
  return qCam(cam, w) + cloud + (lt > 1.2 ? tag(t, t - lt + 1.2, t + 9, 1560, 260, '진짜?', '#fff', { size: 56 }) : '');
}
function bMAwarScene(t, lt, a) { // the reality: frozen trench, betrayal, plague
  const tB = bAt(a, '측근', 3.6), tP = bAt(a, '역병', 5.2), tF = bAt(a, '뒤집', 6.4), tR = bAt(a, '참호', 2.4), tN = bAt(a, '야만족', 1.0);
  let cam = qLerpCam(lt / 8, [960, 640, 1.18], [980, 660, 1.3]);
  const roll = lt > tF ? 7 * Math.sin(clamp((lt - tF) / 0.5, 0, 1) * Math.PI) : 0;
  let w = '';
  w += MAo(t, { x: 960, y: 1080 + (lt > tR && lt < tR + 0.6 ? 30 * Math.sin((lt - tR) / 0.6 * Math.PI) : 0), s: 1.05, shiver: true, pose: '가슴', ex: exprAt([[0, '겁먹음'], [tB, '놀람'], [tB + 0.8, '지침'], [tP, '겁먹음']], lt), look: lt > tB && lt < tP ? [0.9, 0] : [0, -0.3] });
  w += `<path d="M-200 1040 Q300 960 700 1000 Q960 1030 1220 990 Q1700 950 2200 1030 L2200 1300 L-200 1300 Z" fill="#EEF4FB" stroke="${INK}" stroke-width="9"/>`;
  if (lt > tN) for (let i = 0; i < 5; i++) { const k = ((lt - tN) * 1.6 + i * 0.37) % 1.6; if (k < 1) { const x = lerp(-200, 2200, k), y = 300 + i * 50 - Math.sin(k * Math.PI) * 120; w += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(-10 + k * 20)})"><line x1="-60" y1="0" x2="60" y2="0" stroke="#5A3A22" stroke-width="8"/><path d="M60 0 l-20 -12 l0 24 Z" fill="#888" stroke="${INK}" stroke-width="3"/><path d="M-60 0 l-16 -10 M-60 0 l-16 10" stroke="#C8423A" stroke-width="6"/></g>`; } }
  if (lt > tB) { const g = clamp((lt - tB) / 0.5, 0, 1); w += `<g opacity="${f1(g * 0.95 * 100) / 100}" transform="translate(${f1(1500 - 120 * g)} 0)"><g filter="url(#sil)">${char({ goggles: 'none', vest: '#444', patch: false, tee: true, x: 0, y: 1060, s: 1, t, pose: P['폰넣기'], ex: { expr: '결심', prev: '결심', k: 1, blink: 0 } })}</g><path d="M150 760 l70 -8 l-60 30 Z" fill="#E6EEF8" stroke="${INK}" stroke-width="4"/></g>`; }
  if (lt > tP) { const g = clamp((lt - tP) / 1.2, 0, 1); for (let i = 0; i < 7; i++) w += `<ellipse cx="${f1(-100 + i * 340 + Math.sin(t + i) * 30)}" cy="${f1(820 - i % 2 * 120)}" rx="${f1(220 * g)}" ry="${f1(110 * g)}" fill="#7FC46A" opacity=".45" stroke="#4E8A3E" stroke-width="5"/>`;
    w += fx(t, t - lt + tP + 0.3, t - lt + tF, 520, 520, '콜록', '#C9F2B0', { size: 56, rot: -8 }); }
  let out = bPlate('winter', cam, 0.5) + `<g transform="rotate(${f1(roll)} 960 560)">` + qCam(cam, w) + `</g>` + bSnow(t);
  if (lt > tF) out += fx(t, t - lt + tF, t + 9, 960, 300, '나라가 뒤집혔다', '#fff', { size: 74, burst: 160, burstColor: '#C8423A' });
  if (lt < 0.35) out += bFull('#fff', 0.5 * (1 - lt / 0.35));
  return out;
}
function bMAtentScene(t, lt, a) { // night after night, writing to himself by the lamp
  const tB = bAt(a, '명상록', 4.0), cam = qLerpCam(lt / 5, [960, 640, 1.35], [960, 650, 1.5]);
  const fl = 0.85 + 0.15 * Math.sin(t * 13) * Math.sin(t * 7);
  let w = `<ellipse cx="960" cy="640" rx="${f1(560 * fl)}" ry="${f1(420 * fl)}" fill="url(#amber)" opacity=".8"/>`;
  w += qShadow(900, 1000, 70) + MAo(t, { x: 900, y: 1010, s: 1, pose: '쓰기', ex: { expr: '울먹', prev: '울먹', k: 1, blink: 0 }, look: [0.4, 0.8], tilt: 6 });
  w += `<rect x="760" y="820" width="420" height="40" rx="8" fill="#8A5A34" stroke="${INK}" stroke-width="7"/><rect x="800" y="860" width="24" height="160" fill="#6A4424" stroke="${INK}" stroke-width="6"/><rect x="1116" y="860" width="24" height="160" fill="#6A4424" stroke="${INK}" stroke-width="6"/>`;
  w += `<rect x="880" y="790" width="150" height="34" rx="4" fill="#D9C18A" stroke="${INK}" stroke-width="5"/>`;
  w += `<g transform="translate(1110 790)"><path d="M-40 0 Q0 -28 40 0 Q20 20 -40 0 Z" fill="#C9A04A" stroke="${INK}" stroke-width="5"/><path d="M30 -6 q12 -${f1(30 * fl)} 4 -${f1(44 * fl)} q-14 16 -4 44" fill="#FFC24A" stroke="#E07A1A" stroke-width="3"/></g>`;
  const [hx, hy] = bHead(900, 1010); for (let i = 0; i < 2; i++) { const ph = (lt * 0.9 + i * 0.5) % 1; w += `<path d="M${f1(hx - 40 + i * 80)} ${f1(hy + 30 + ph * 70)} q-8 14 0 20 q8 -6 0 -20 Z" fill="#E88A9A" stroke="${INK}" stroke-width="3" opacity="${f1((1 - ph) * 100) / 100}"/>`; }
  let out = bPlate('tent', cam, 0.5) + qCam(cam, w) + bFull('#0B1630', 0.18);
  if (lt > 1.0 && lt < tB) out += tag(t, t - lt + 1.0, t - lt + tB, 1500, 220, '매일 밤', '#E9DFF5', { size: 44 });
  if (lt > tB) out += pop(t, t - lt + tB, t + 9, 1460, 520, `<g transform="rotate(6)"><rect x="-150" y="-200" width="300" height="400" rx="14" fill="#5A2E6E" stroke="${INK}" stroke-width="9"/><rect x="-130" y="-180" width="260" height="360" rx="8" fill="none" stroke="#E8C35A" stroke-width="5"/>${bTxt(0, -20, '명상록', 64, '#FFE9A8')}${bTxt(0, 40, 'Τὰ εἰς ἑαυτόν', 24, '#E8C35A')}</g>`, {});
  return out;
}
/* the dichotomy of control: a basket for what you can change, a bin for what you can't */
function bctlScene(t, lt, a) {
  const run = a._run, cam = qLerpCam(run / 30, [960, 600, 1.0], [960, 600, 1.06]);
  let w = `<rect x="-300" y="-200" width="2600" height="1500" fill="#F3EEE3"/><rect x="-300" y="-200" width="2600" height="1500" fill="url(#paper)"/>`;
  w += `<line x1="960" y1="200" x2="960" y2="1060" stroke="${INK}" stroke-width="6" stroke-dasharray="20 18" opacity=".4"/>`;
  // basket (left) + bin (right)
  w += `<g transform="translate(520 860)"><path d="M-190 -110 L190 -110 L150 120 L-150 120 Z" fill="#7BC47F" stroke="${INK}" stroke-width="9"/>` + [-110, -40, 30].map(y => `<path d="M-180 ${y} L180 ${y}" stroke="#4E8A3E" stroke-width="6"/>`).join('') + `</g>`;
  const lid = a.toss && lt > bAt(a, '영역', 9) ? clamp((lt - bAt(a, '영역', 9)) / 0.2, 0, 1) : 0;
  w += `<g transform="translate(1400 860)"><path d="M-160 -120 L160 -120 L130 130 L-130 130 Z" fill="#8E97A6" stroke="${INK}" stroke-width="9"/>` + [-80, 0, 80].map(x => `<line x1="${x}" y1="-90" x2="${x * 0.85}" y2="110" stroke="#6B7383" stroke-width="7"/>`).join('') +
    `<g transform="translate(-170 -124) rotate(${f1(-70 * (1 - lid))})"><rect x="0" y="-26" width="340" height="30" rx="10" fill="#A8B0BE" stroke="${INK}" stroke-width="8"/></g></g>`;
  w += label(520, 640, '바꿀 수 있는 것', { size: 40, bg: '#B7F0C2' }) + label(1400, 600, '바꿀 수 없는 것', { size: 40, bg: '#D5DAE3' });
  // title
  const tT = a.q || a.toss ? -9 : bAt(a, '통제', 2.2);
  if (!a.q && !a.toss) w += pop(t, t - lt + tT, t + 99, 960, 270, outlined(0, 0, ['통제의 이분법'], { size: 96, sw: 16, fill: '#FFE9A8' }), {});
  else w += outlined(960, 230, ['통제의 이분법'], { size: 64, sw: 12, fill: '#FFE9A8' });
  // Marcus in the middle, pointing
  const tL = a.q ? bAt(a, '집중', 1.8) : 99, tRt = a.q ? bAt(a, '쓰레기', 4.0) : 99;
  const pose = a.q ? (lt > tRt ? '가리키기R' : lt > tL - 0.6 ? '가리키기L' : '서기') : (a.toss ? '가리키기R' : '서기');
  w += qShadow(960, 1000, 60) + MAo(t, { x: 960, y: 1000, s: 0.8, pose, ex: { expr: '결심', prev: '결심', k: 1, blink: 0 }, look: pose === '가리키기L' ? [-0.8, 0] : pose === '가리키기R' ? [0.8, 0] : [0, 0] });
  // what goes in the basket (shown from the quote on)
  if (a.q || a.toss) ['내 호흡', '내 대답', '내 준비'].forEach((s, i) => { const t0 = a.q ? tL + i * 0.25 : -9; w += pop(t, t - lt + t0, t + 99, [440, 600, 520][i], [780, 790, 850][i], label(0, 0, s, { size: 30, bg: '#fff' }), { rot: -6 + i * 6 }); });
  // what gets tossed in the bin
  if (a.toss) {
    const items = [['상사', bSpeech(0, 0, 230, 90, '내일 얘기 좀…', { size: 30 })], ['수군', `<g>${bSpeech(-40, 0, 200, 80, '수군수군', { size: 30, bg: '#EDE7FF' })}</g>`], ['비가', `<g><ellipse cx="0" cy="0" rx="110" ry="60" fill="#B8C4D6" stroke="${INK}" stroke-width="7"/>` + [-50, 0, 50].map(x => `<line x1="${x}" y1="60" x2="${x - 10}" y2="100" stroke="#5DB8FF" stroke-width="7" stroke-linecap="round"/>`).join('') + `</g>`], ['태풍', `<g transform="rotate(${f1(t * 300)})"><path d="M0 0 m-70 0 a70 70 0 1 1 70 70 M0 0 m-40 0 a40 40 0 1 1 40 40" fill="none" stroke="#6B8FB8" stroke-width="14" stroke-linecap="round"/></g>`]];
    items.forEach(([k, g], i) => { const t0 = bAt(a, k, 0.5 + i * 1.6), u = clamp((lt - t0 - 0.9) / 0.6, 0, 1); if (lt < t0) return;
      const sx = 1500 + (i % 2) * 240, sy = 420 + i * 40, x = lerp(sx, 1400, easeIn(u)), y = lerp(sy, 780, easeIn(u)) - Math.sin(u * Math.PI) * 140, sc = lerp(1, 0.5, u);
      if (u < 1) w += pop(t, t - lt + t0, t + 99, f1(x), f1(y), `<g transform="scale(${f1(sc * 100) / 100}) rotate(${f1(u * 160)})">${g}</g>`, {}); });
    if (lid > 0 && lid < 1) w += fx(t, t - lt + bAt(a, '영역', 9), t + 9, 1400, 620, '쾅', '#fff', { size: 70 });
  }
  return qCam(cam, w);
}
function bAplugScene(t, lt, a) { // a cable from his heart into other people's heads; unplug
  const tU = bAt(a, '내어', 3.4), cam = qLerpCam(lt / 5, [1000, 600, 1.3], [1000, 600, 1.38]);
  const AXp = 760, un = clamp((lt - tU) / 0.3, 0, 1);
  let w = qShadow(AXp, AY, 66) + bGuest('A', t, { x: AXp, y: AY, s: 1, pose: '가슴', shiver: un < 1, ex: { expr: un >= 1 ? '놀람' : '겁먹음', prev: '겁먹음', k: 1, blink: 0 }, look: [0.8, -0.3] });
  const [cx, cy] = bChest(AXp, AY);
  w += bHeart(cx, cy - 10, 0.75 + 0.08 * Math.sin(t * (un >= 1 ? 6 : 22)), '#FF5A6E');
  // the heads (thought clouds) the cable runs into
  for (let i = 0; i < 3; i++) { const hx = 1260 + i * 200, hy = 430 + (i % 2) * 80; w += `<g opacity=".95"><circle cx="${hx}" cy="${hy}" r="90" fill="#C9CED8" stroke="${INK}" stroke-width="7"/>${bTxt(hx, hy + 26, '?', 80, '#6B7383')}</g>`; }
  const px = lerp(1180, 1080, un), py = lerp(470, 560, un) + (un >= 1 ? Math.sin((lt - tU) * 8) * 20 * Math.exp(-(lt - tU) * 3) : 0);
  w += `<path d="M${cx + 30} ${cy - 10} C${cx + 200} ${cy - 160} ${px - 200} ${py + 120} ${px} ${py}" stroke="#2B2B2B" stroke-width="12" fill="none"/><rect x="${f1(px - 10)}" y="${f1(py - 22)}" width="50" height="44" rx="6" fill="#5B5B66" stroke="${INK}" stroke-width="5" transform="rotate(-30 ${f1(px)} ${f1(py)})"/>`;
  if (un < 1) w += `<path d="M1220 470 L1260 440" stroke="#2B2B2B" stroke-width="10"/>`;
  if (lt > tU - 0.5) { const g = clamp((lt - tU + 0.5) / 0.5, 0, 1); w += bHand(lerp(1500, px + 60, easeOut(g)), lerp(820, py, easeOut(g)), 1.3); }
  // ECG strip
  let ecg = 'M0 0'; for (let i = 0; i < 40; i++) { const x = i * 24, ph = (i + t * (un >= 1 ? 6 : 18)) % 8; ecg += ` L${x} ${ph < 1 ? -60 : ph < 2 ? 40 : 0}`; }
  w += `<g transform="translate(600 ${f1(cam[1] - 320)})"><rect x="-20" y="-90" width="1000" height="180" rx="16" fill="#0B1626" stroke="${INK}" stroke-width="7"/><path d="${ecg}" stroke="${un >= 1 ? MINT : '#FF5A5A'}" stroke-width="6" fill="none"/>${bTxt(960, -40, un >= 1 ? '72' : '168', 46, un >= 1 ? MINT : '#FF5A5A', { anchor: 'end' })}</g>`;
  if (un >= 1) w += fx(t, t - lt + tU, t + 9, 1180, 680, '뽁', '#fff', { size: 64 });
  return bPlate('shopc', cam, 0.3, { blur: true }) + bFull('#0B0712', 0.35) + qCam(cam, w) + warm(0.2 * un);
}
function bAwarmScene(t, lt, a) { // the turn: warm light, a hand on his shoulder
  const cam = qLerpCam(lt / 3, [AX - 60, 610, 1.9], [AX - 60, 600, 2.1]);
  const up = clamp((lt - 0.4) / 0.8, 0, 1);
  let w = qShadow(AX, AY, 66) + bGuest('A', t, { x: AX, y: AY, s: 1, pose: '서기', ex: exprAt([[0, '울먹'], [1.0, '놀람']], lt), look: [-0.6, lerp(0.8, -0.2, up)], tilt: lerp(-8, 0, up) });
  const g = clamp((lt - 0.2) / 0.6, 0, 1), sh = ptOf(AX, AY, 1, 148, 280);
  w += `<line x1="${f1(lerp(800, sh[0] - 160, easeOut(g)))}" y1="${f1(sh[1] + 80)}" x2="${f1(lerp(860, sh[0] - 10, easeOut(g)))}" y2="${f1(sh[1] - 4)}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` + bHand(lerp(860, sh[0] - 10, easeOut(g)), sh[1] - 4, 0.6);
  return bPlate('shopc', [cam[0] - 300, cam[1], cam[2]], 0.3, { blur: true }) + qCam(cam, w) + warm(0.5 + 0.4 * prog(lt, 0, 2.5)) + bFull('#FFB46A', 0.08 * prog(lt, 0, 2));
}
function bAhugScene(t, lt, a) { // hugging other people's thorns, getting pricked
  const tP = bAt(a, '찔린', 4.4), cam = qLerpCam(lt / 6, [AX - 100, 640, 1.55], [AX - 100, 630, 1.7]);
  let w = qShadow(AX, AY, 66) + bGuest('A', t, { x: AX, y: AY, s: 1, pose: '안기', ex: exprAt([[0, '미소'], [tP, '울먹']], lt), look: [0, 0.4] });
  const [cx, cy] = bChest(AX, AY);
  const urch = (x, y, r, c) => { let s = `<g transform="translate(${f1(x)} ${f1(y)})">`; for (let i = 0; i < 14; i++) { const an = i / 14 * 6.283; s += `<path d="M${f1(Math.cos(an - 0.15) * r * 0.8)} ${f1(Math.sin(an - 0.15) * r * 0.8)} L${f1(Math.cos(an) * r * 1.45)} ${f1(Math.sin(an) * r * 1.45)} L${f1(Math.cos(an + 0.15) * r * 0.8)} ${f1(Math.sin(an + 0.15) * r * 0.8)} Z" fill="${c}" stroke="${INK}" stroke-width="4"/>`; } return s + `<circle r="${r}" fill="${c}" stroke="${INK}" stroke-width="5"/></g>`; };
  w += urch(cx - 40, cy + 40, 46, '#9A86C8') + urch(cx + 40, cy + 30, 40, '#C886A8') + urch(cx, cy + 70, 34, '#86A8C8');
  if (lt > tP) { [[-80, 30], [80, 10], [0, 110]].forEach(([dx, dy], i) => { const k = clamp((lt - tP - i * 0.2) / 0.2, 0, 1); if (k > 0) w += `<g transform="translate(${cx + dx} ${cy + dy}) rotate(${-20 + i * 25}) scale(${f1(k * 100) / 100})"><rect x="-34" y="-12" width="68" height="24" rx="10" fill="#F5D7B0" stroke="${INK}" stroke-width="4"/><rect x="-10" y="-10" width="20" height="20" fill="#E8BF8E"/></g>`; });
    w += fx(t, t - lt + tP, t - lt + tP + 0.8, cx + 160, cy - 200, '콕', '#fff', { size: 56 }); }
  return bPlate('shopc', [cam[0] - 300, cam[1], cam[2]], 0.3, { blur: true }) + qCam(cam, w) + warm(0.7) + bFull('#FFB46A', 0.08);
}
function bAhalfScene(t, lt, a) { // the 100% bar snaps in half; one half becomes ointment for his heart
  const tH = bAt(a, '절반', 2.0), tK = bAt(a, '뚝', tH + 0.5), tO = bAt(a, '연고', 4.6);
  const cam = qLerpCam(lt / 6, [AX - 100, 600, 1.45], [AX - 100, 610, 1.6]);
  let w = qShadow(AX, AY, 66) + bGuest('A', t, { x: AX, y: AY, s: 1, pose: lt > tO ? '가슴' : '서기', ex: exprAt([[0, '걱정'], [tK, '놀람'], [tO, '뿌듯']], lt), look: lt < tO ? [0, -0.8] : [0, 0.4] });
  const bx = AX, by = 390, split = clamp((lt - tK) / 0.5, 0, 1), hl = 200;
  const bar = (x0, w0, fillc) => `<rect x="${f1(x0)}" y="-36" width="${f1(w0)}" height="72" rx="14" fill="${fillc}" stroke="${INK}" stroke-width="7"/>`;
  if (lt < tK) w += `<g transform="translate(${bx - hl} ${by})">${bar(0, 2 * hl, '#FFB547')}${bTxt(hl, 14, '눈치 에너지 100%', 34, INK)}${lt > tH ? `<line x1="${hl}" y1="-50" x2="${hl}" y2="50" stroke="#D63A3A" stroke-width="6" stroke-dasharray="10 8"/>` : ''}</g>`;
  else {
    w += `<g transform="translate(${f1(bx - hl - 40 * split)} ${by}) rotate(${f1(-6 * split)})">${bar(0, hl, '#FFB547')}${bTxt(hl / 2, 14, '50%', 34, INK)}</g>`;
    const [cx, cy] = bChest(AX, AY), g = clamp((lt - tK - 0.4) / 0.8, 0, 1);
    const x = lerp(bx + 40, cx - 20, easeInOut(g)), y = lerp(by, cy - 120, easeInOut(g));
    if (g < 1) w += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(6 + g * 20)}) scale(${f1(lerp(1, 0.5, g) * 100) / 100})">${bar(0, hl, '#7BE0B0')}${bTxt(hl / 2, 14, '50%', 34, INK)}</g>`;
    w += fx(t, t - lt + tK, t - lt + tK + 0.7, bx, by - 110, '뚝!', '#fff', { size: 64 });
  }
  if (lt > tO - 0.4) { const [cx, cy] = bChest(AX, AY), g = clamp((lt - tO + 0.4) / 0.5, 0, 1);
    w += bHeart(cx, cy - 10, 0.75, g > 0.8 ? '#FF8A9A' : '#FF5A6E') + `<g transform="translate(${f1(cx + 110 - 40 * g)} ${f1(cy - 90)}) rotate(-40)"><rect x="-22" y="-80" width="44" height="120" rx="10" fill="#F4F1EA" stroke="${INK}" stroke-width="6"/><rect x="-22" y="-20" width="44" height="30" fill="#7BE0B0"/><rect x="-12" y="40" width="24" height="26" rx="4" fill="#C9A04A" stroke="${INK}" stroke-width="5"/></g>`;
    if (g >= 1) w += rSparks(cx, cy - 10, t, 6, 90, '#FFE9A8') + `<path d="M${cx - 26} ${cy - 30} q26 -16 52 0" stroke="#fff" stroke-width="8" fill="none" opacity=".9" stroke-linecap="round"/>`; }
  return bPlate('shopc', [cam[0] - 300, cam[1], cam[2]], 0.3, { blur: true }) + qCam(cam, w) + warm(0.75);
}
function bAbyeScene(t, lt, a) { // prescription in hand, a bow, the door bell
  const cam = qLerpCam(lt / 3.2, [1300, 620, 1.12], [1360, 620, 1.18]);
  const bow = Math.sin(clamp((lt - 0.2) / 0.7, 0, 1) * Math.PI), go = clamp((lt - 1.1) / 1.6, 0, 1), x = lerp(AX, 2150, easeIn(go));
  let w = qShadow(ZC[0], ZC[1], 70) + bZero(t, { x: ZC[0], y: ZC[1], s: 1, pose: lt > 1.2 ? '손인사' : '카운터', ex: { expr: '미소', prev: '미소', k: 1, blink: 0 }, look: [0.9, 0] }) + bCounter(520, 1400, CTOP);
  const door = clamp((lt - 1.8) / 0.4, 0, 1) * (1 - clamp((lt - 2.8) / 0.3, 0, 1));
  w += `<rect x="1990" y="40" width="${f1(110 * door)}" height="950" fill="#2C3A5C" opacity=".8"/>`;
  w += qShadow(x, AY, 66) + bGuest('A', t, { x, y: AY, s: 0.95, rot: bow * 22, pose: go > 0 ? walkPose(lt * 9, 0.8) : '안기', ex: { expr: '뿌듯', prev: '뿌듯', k: 1, blink: 0 }, look: [-0.6, 0] });
  if (go < 0.8) { const h = ptOf(x, AY, 0.95, 200, 360); w += `<g transform="translate(${f1(h[0])} ${f1(h[1])}) rotate(-8)"><rect x="-40" y="-52" width="80" height="104" rx="6" fill="#FBF7EE" stroke="${INK}" stroke-width="5"/><rect x="-40" y="-52" width="80" height="22" rx="6" fill="#3DBA8A" stroke="${INK}" stroke-width="5"/></g>`; }
  return bPlate('shop', cam, 0.5) + qCam(cam, w) + (lt > 2.0 ? fx(t, t - lt + 2.0, t + 9, 1700, 260, '딸랑~', '#FFE9A8', { size: 56 }) : '');
}
// every scene gets the shared filters/gradients (blur, warm light, neon)
['balley', 'bneon', 'bstamp', 'blook', 'bbump', 'bloupe', 'bwheel', 'bline', 'bsummon', 'brx', 'bticket', 'bAenter', 'bAphone', 'bAthink', 'bAtalk', 'bAots', 'bAfav', 'bAchat', 'bAdx',
 'bMA', 'bMAdream', 'bMAwar', 'bMAtent', 'bctl', 'bAplug', 'bAwarm', 'bAhug', 'bAhalf', 'bAbye'].forEach(k => { const f = window[k + 'Scene']; window[k + 'Scene'] = (...a) => qDefs() + bNeonDefs() + f(...a); });
