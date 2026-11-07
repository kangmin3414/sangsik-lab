/* 제로의 영화 세계 1 · 시뮬레이션 편 — 1막 샘플(h0~b6).
   test_q3 방식: 사람 없는 AI 배경 판 + 자체 카메라·원근감 + 숨·탄력·출렁임 + 입 모양 + 단어 타이밍.
   한 그림: 홱 돌아보면 잠깐 보이는 '회색 격자'(배경 판을 선만 남긴 설계도처럼 바꾸고 격자를 덮는다).
   이름 규칙: 이 편의 함수·상수는 모두 sm 접두사(장면 함수는 s…Scene). */
delete QBG.wide; delete QBG.close;
Object.assign(QBG, { cross: 'ai/cross.png', cross_c: 'ai/cross_c.png', park: 'ai/park.png', park_c: 'ai/park_c.png', kitchen: 'ai/kitchen.png', kitchen_c: 'ai/kitchen_c.png', study: 'ai/study.png', space: 'ai/space.png' });
['sturn', 'sturn2', 'spigeon', 'sfridge', 'sbostrom', 'sbostrom2', 'slattice'].forEach(k => CAMS[k] = 'fixed');

/* ---------- shared ---------- */
const smAt = (a, key, fb) => { const w = (a._words || []).find(x => x.w.replace(/\s/g, '').includes(key)); return w ? w.t + 0.12 : fb; };
const smFull = (c, op = 1) => `<rect x="-400" y="-300" width="2800" height="1700" fill="${c}" opacity="${f1(op * 100) / 100}"/>`;
const SM_ORANGE = '#F28C38', SM_LINE = '#DCE4EE', SM_SLATE = '#3E4452';
const ZMAP = { '기본': 'z기본', '놀람': 'z충격', '겁먹음': 'z소름', '걱정': 'z울먹', '결심': 'z결심', '신남': 'z빵긋', 'sm씩': 'z히죽', 'sm멍': 'z멍', '지침': 'z멍', '뿌듯': 'z뿌듯' };
const zMapEx = ex => ex && ex.expr ? Object.assign({}, ex, { expr: ZMAP[ex.expr] || ex.expr, prev: ZMAP[ex.prev] || ex.prev }) : ex;
const smZero = (t, o) => HALO(char(Object.assign({ goggles: 'none', vest: SM_ORANGE, patch: false, tee: true, vshade: 'rgba(150,60,0,0.22)', hoodie: 'rgba(120,40,0,0.18)', seed: 61, t }, o, { ex: zMapEx(o.ex) })));
const smEase = (lt, a, b) => easeInOut(clamp((lt - a) / (b - a), 0, 1));
// world → scene coordinates under a qCam camera
const smScr = (cam, x, y) => [(x - cam[0]) * cam[2] + 960, (y - cam[1]) * cam[2] + 560];
// plate drawn a little larger than qPlate (slack for camera moves); optional filter / extra overlay in plate space
const smPlate = (k, cam, depth = 0.55, o = {}) => {
  const [cx, cy, z] = cam, zb = 1 + (z - 1) * depth, bx = 960 + (cx - 960) * depth, by = 560 + (cy - 560) * depth;
  const flt = o.filter ? ` filter="url(#${o.filter})"` : (o.blur ? ' filter="url(#qblur)"' : '');
  return `<g transform="translate(960 560) scale(${f1(zb * 1000) / 1000}) translate(${f1(-bx)} ${f1(-by)})"${o.op != null ? ` opacity="${f1(o.op * 100) / 100}"` : ''}><image href="${QBG[k]}" x="-270" y="-98" width="2460" height="1384" preserveAspectRatio="xMidYMid slice"${flt}/>${o.extra || ''}</g>`;
};
let smClipN = 0;
const smDefs = () => { smClipN = 0; return qDefs() + `<defs>
<filter id="smwire" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
<feColorMatrix type="matrix" values="0.3 0.59 0.11 0 0 0.3 0.59 0.11 0 0 0.3 0.59 0.11 0 0 0 0 0 1 0"/>
<feComponentTransfer><feFuncR type="discrete" tableValues="0.86 0.86 0.86 0.25 0.25 0.25 0.25 0.25 0.25 0.25 0.25 0.25"/><feFuncG type="discrete" tableValues="0.89 0.89 0.89 0.27 0.27 0.27 0.27 0.27 0.27 0.27 0.27 0.27"/><feFuncB type="discrete" tableValues="0.93 0.93 0.93 0.32 0.32 0.32 0.32 0.32 0.32 0.32 0.32 0.32"/></feComponentTransfer>
</filter>
<pattern id="smgrid" width="72" height="72" patternUnits="userSpaceOnUse"><path d="M72 0 H0 V72" fill="none" stroke="#9AA6B6" stroke-width="2.4" opacity=".7"/></pattern>
<pattern id="smgrid2" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M56 0 H0 V56" fill="none" stroke="#4E6A90" stroke-width="3" opacity=".75"/></pattern>
<radialGradient id="smcold" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#DFF3FF" stop-opacity=".85"/><stop offset="1" stop-color="#DFF3FF" stop-opacity="0"/></radialGradient>
<radialGradient id="smglow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#9FD8FF" stop-opacity=".8"/><stop offset="1" stop-color="#9FD8FF" stop-opacity="0"/></radialGradient>
<linearGradient id="smbarh" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#EAF7FF" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="smbar" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#EAF7FF" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
</defs>`; };
// the unrendered world: plate → outlines only on slate grey + grid, clipped to scene-space x < clipX (or the whole frame)
const smWire = (k, cam, depth, clipX = 99999, o = {}) => {
  const id = 'smcl' + (smClipN++), grid = `<rect x="-270" y="-98" width="2460" height="1384" fill="url(#smgrid)"/>`;
  let h = `<defs><clipPath id="${id}"><rect x="-500" y="-400" width="${f1(clipX + 500)}" height="2000"/></clipPath></defs><g clip-path="url(#${id})"${o.op != null ? ` opacity="${f1(o.op * 100) / 100}"` : ''}>${smFull(SM_SLATE)}${smPlate(k, cam, depth, { filter: 'smwire', extra: grid })}</g>`;
  if (clipX < 3000) h += `<rect x="${f1(clipX - 30)}" y="-300" width="60" height="1800" fill="url(#smbar)"/><rect x="${f1(clipX - 2)}" y="-300" width="4" height="1800" fill="#fff"/>`;
  return h;
};
// glitch bars (digital tearing) — k: 0..1 strength
const smGlitch = (t, k, seed = 1) => {
  if (k <= 0) return '';
  const fr = Math.floor(t * 24); let h = '';
  for (let i = 0; i < 9; i++) {
    const r = hash(fr * 13 + i * 7 + seed), y = -100 + r * 1300, hh = 6 + hash(fr + i * 3 + seed) * 46, x = (hash(fr * 3 + i) - 0.5) * 300;
    h += `<rect x="${f1(-300 + x)}" y="${f1(y)}" width="2600" height="${f1(hh)}" fill="${['#FF3D9A', '#3DE8FF', '#FFFFFF'][i % 3]}" opacity="${f1(k * (0.18 + 0.25 * hash(i + fr)) * 100) / 100}"/>`;
  }
  return h;
};
const smTint = (c, op) => smFull(c, op);
const smMorning = k => warm(0.45 * k) + smFull('#FFF4DC', 0.05 * k);
const smNightK = k => smFull('#16204A', 0.22 * k);
// poses
const smPose = (base, o) => Object.assign({}, typeof base === 'string' ? P[base] : base, o);
P['sm컵'] = smPose('서기', { armR: [[252, 285], [286, 338], [252, 322]], hR: [248, 318] });
P['sm수첩'] = smPose('서기', { armL: [[148, 285], [140, 342], [178, 334]], hL: [182, 330], armR: [[252, 285], [266, 344], [218, 336]], hR: [212, 332] });
P['sm문'] = smPose('서기', { armR: [[252, 285], [318, 298], [372, 300]], hR: [380, 300] });
P['sm뒤가리킴'] = smPose('서기', { armR: [[252, 285], [300, 252], [292, 196]], hR: [288, 186] });   // thumb over the shoulder
const smCupL = { armL: P['sm컵'].armR.map(p => [400 - p[0], p[1]]), hL: [400 - 248, 318] };   // the cup in the LEFT hand
P['sm컵L'] = smPose('서기', smCupL); P['sm뒤L'] = smPose('가리킴', smCupL);
if (!E['sm씩']) E['sm씩'] = Object.assign(dotEyes(10, 11), { bL: [142, 156, 164, 152, 186, 156], bR: [214, 146, 236, 140, 258, 146], mouth: 'M184 232 Q204 240 220 224', mouthFill: 'none' });
if (!E['sm멍']) E['sm멍'] = { eyeL: 'M152 186 L178 186 Q178 198 165 198 Q152 198 152 186 Z', eyeR: 'M222 186 L248 186 Q248 198 235 198 Q222 198 222 186 Z', eyeFill: INK, eyeSW: 0, bL: [142, 170, 164, 170, 186, 170], bR: [214, 170, 236, 170, 258, 170], mouth: 'M188 236 L212 236', mouthFill: 'none' };
// walking with the right hand holding a cup at the chest
const smWalkCup = (ph, amp) => Object.assign({}, walkPose(ph, amp), { armR: P['sm컵'].armR, hR: P['sm컵'].hR });
// props
const smCup = (x, y, s = 1, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><path d="M-17 -40 L17 -40 L13 14 L-13 14 Z" fill="#FBF7F0" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-16 -18 L16 -18 L14 2 L-14 2 Z" fill="#B27A4A" stroke="${INK}" stroke-width="3.5"/><rect x="-21" y="-50" width="42" height="12" rx="4" fill="#fff" stroke="${INK}" stroke-width="4.5"/></g>`;
const smPad = (x, y, s = 1, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><rect x="-30" y="-38" width="60" height="76" rx="6" fill="#FFF8E2" stroke="${INK}" stroke-width="5"/><rect x="-30" y="-38" width="60" height="14" rx="5" fill="#E2574C" stroke="${INK}" stroke-width="4"/><path d="M-20 -12 H20 M-20 2 H20 M-20 16 H12" stroke="#9AB4D6" stroke-width="3.5"/></g>`;
const smPen = (x, y, s = 1, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><rect x="-4" y="-40" width="8" height="44" rx="3" fill="#2F6FD0" stroke="${INK}" stroke-width="3"/><path d="M-4 4 L0 14 L4 4 Z" fill="${INK}"/></g>`;
// motion arcs around a head (whip turn)
const smWhipArcs = (x, y, k, dir = -1) => {
  if (k <= 0 || k >= 1) return '';
  let h = ''; const op = Math.sin(k * Math.PI);
  for (let i = 0; i < 3; i++) { const r = 150 + i * 34; h += `<path d="M${f1(x + dir * r * 0.15)} ${f1(y - r)} A${r} ${r} 0 0 ${dir < 0 ? 0 : 1} ${f1(x + dir * r)} ${f1(y - r * 0.1)}" fill="none" stroke="#fff" stroke-width="${9 - i * 2}" stroke-linecap="round" opacity="${f1(op * (0.9 - i * 0.2) * 100) / 100}"/>`; }
  return h;
};
// evidence card (scene space)
const smCard = (x, y, n, txt, k, o = {}) => {
  if (k <= 0) return '';
  const sc = easeOutBack(clamp(k, 0, 1)) * (o.s || 1), w = o.w || 430;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${o.rot == null ? -4 : o.rot}) scale(${f1(sc * 1000) / 1000})"><rect x="${-w / 2 + 8}" y="-52" width="${w}" height="112" rx="16" fill="#000" opacity=".25"/><rect x="${-w / 2}" y="-60" width="${w}" height="112" rx="16" fill="#FFFDF4" stroke="${INK}" stroke-width="6"/>` +
    `<circle cx="${-w / 2 + 62}" cy="-4" r="36" fill="#E2574C" stroke="${INK}" stroke-width="5"/><text x="${-w / 2 + 62}" y="12" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="44" fill="#fff">${n}</text>` +
    `<text x="${-w / 2 + 112}" y="-14" font-family="${FONT}" font-weight="900" font-size="26" fill="#8A7A5A">증거</text><text x="${-w / 2 + 112}" y="28" font-family="${FONT}" font-weight="900" font-size="40" fill="${INK}">${esc(txt)}</text></g>`;
};
// a little digital clock card
const smClock = (x, y, t, k) => {
  if (k <= 0) return '';
  const sc = easeOutBack(clamp(k, 0, 1)), colon = Math.floor(t * 2) % 2 ? 1 : 0.25;
  return `<g transform="translate(${x} ${y}) scale(${f1(sc * 1000) / 1000})"><rect x="-170" y="-62" width="340" height="124" rx="20" fill="#14202E" stroke="${INK}" stroke-width="6"/><text x="-140" y="-22" font-family="${FONT}" font-weight="900" font-size="26" fill="#9FB4C8">화요일 아침</text>` +
    `<text x="0" y="44" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="66" fill="${MINT}">08<tspan opacity="${colon}">:</tspan>12</text></g>`;
};
// pigeon (feet at x,y, facing right). o: tilt (deg), peck 0..1, step 0..1, blink
const smPigeon = (x, y, s, o = {}) => {
  const tilt = o.tilt || 0, pk = o.peck || 0, st = o.step || 0, fl = o.flip ? -1 : 1;
  const hx = 30 + pk * 16, hy = -78 + pk * 52;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(fl * s * 1000) / 1000} ${f1(s * 1000) / 1000})">`;
  h += `<ellipse cx="0" cy="4" rx="46" ry="9" fill="#2A1A30" opacity=".28"/>`;
  h += `<path d="M-8 -16 L${f1(-10 + st * 8)} 0 M8 -16 L${f1(10 - st * 8)} 0" stroke="#C9524C" stroke-width="5.5" stroke-linecap="round"/>`;
  h += `<path d="M-30 -44 L-74 -34 L-68 -20 L-26 -26 Z" fill="#6E7684" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  h += `<ellipse cx="0" cy="-38" rx="42" ry="27" fill="#A3ABB7" stroke="${INK}" stroke-width="5"/>`;
  h += `<path d="M-30 -48 Q2 -64 24 -44 Q2 -26 -34 -32 Z" fill="#848D9B" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-16 -44 h12 M-8 -37 h12" stroke="#4A505C" stroke-width="3.5" stroke-linecap="round"/>`;
  h += `<g transform="rotate(${f1(tilt)} 20 -56)">`;
  h += `<path d="M18 -50 L${f1(hx - 2)} ${f1(hy + 8)}" stroke="${INK}" stroke-width="27" stroke-linecap="round"/><path d="M18 -50 L${f1(hx - 2)} ${f1(hy + 8)}" stroke="#7F8E9E" stroke-width="17" stroke-linecap="round"/>`;
  h += `<path d="M14 -54 Q${f1((18 + hx) / 2)} ${f1((-50 + hy) / 2 - 4)} ${f1(hx - 4)} ${f1(hy + 14)}" stroke="#5FB39A" stroke-width="5" fill="none" opacity=".9"/>`;
  h += `<circle cx="${f1(hx)}" cy="${f1(hy)}" r="16" fill="#8C97A5" stroke="${INK}" stroke-width="4.5"/>`;
  h += o.blink ? `<path d="M${f1(hx + 1)} ${f1(hy - 3)} h8" stroke="${INK}" stroke-width="3"/>` : `<circle cx="${f1(hx + 4)}" cy="${f1(hy - 3)}" r="4.6" fill="#FF8C2E" stroke="${INK}" stroke-width="2"/><circle cx="${f1(hx + 4.6)}" cy="${f1(hy - 3)}" r="2" fill="${INK}"/>`;
  h += `<path d="M${f1(hx + 13)} ${f1(hy)} L${f1(hx + 28)} ${f1(hy + 5)} L${f1(hx + 13)} ${f1(hy + 9)} Z" fill="#3A3F48" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="${f1(hx + 15)}" cy="${f1(hy + 1)}" rx="4.5" ry="2.6" fill="#F2F2F2"/>`;
  return h + `</g></g>`;
};
// Earth, monitor
const smEarth = (x, y, r, o = {}) => {
  const id = 'sme' + (smClipN++), sp = o.spin || 0;
  let h = `<defs><clipPath id="${id}"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/></clipPath></defs>`;
  if (o.glow) h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 1.9)}" fill="url(#smglow)" opacity="${o.glow}"/>`;
  h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${o.gray ? '#7D8592' : '#3E8EDC'}"/>`;
  h += `<g clip-path="url(#${id})"><g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(r / 100 * 1000) / 1000})">`;
  for (let i = -1; i <= 1; i++) { const ox = ((sp * 60 + i * 200) % 200 + 200) % 200 - 100;
    h += `<g transform="translate(${f1(ox)} 0)" fill="${o.gray ? '#A9B0BA' : '#5CB85C'}"><path d="M-70 -40 q30 -30 60 -10 q20 20 -10 40 q-40 10 -50 -30 Z"/><path d="M10 10 q40 -20 60 10 q0 40 -30 50 q-30 0 -30 -60 Z"/><path d="M-40 50 q20 -10 30 10 q-10 20 -30 -10 Z"/></g>`; }
  h += `<path d="M-90 -60 q60 -14 120 0 M-30 70 q50 -10 100 4" stroke="#fff" stroke-width="10" fill="none" opacity=".75" stroke-linecap="round"/>`;
  h += `<path d="M40 -100 A100 100 0 0 1 40 100 A130 130 0 0 0 40 -100 Z" fill="#0A1A40" opacity=".28"/>`;
  h += `</g></g><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(2, r * 0.07))}"/>`;
  return h;
};
const smMon = (x, y, w, inner, o = {}) => {
  const hh = w * 0.62, lw = Math.max(2, w * 0.035);
  return `<g transform="translate(${f1(x)} ${f1(y)})"${o.op != null ? ` opacity="${f1(o.op * 100) / 100}"` : ''}><rect x="${f1(-w * 0.09)}" y="${f1(hh / 2)}" width="${f1(w * 0.18)}" height="${f1(w * 0.12)}" fill="#3A3F4A" stroke="${INK}" stroke-width="${f1(lw * 0.8)}"/><rect x="${f1(-w * 0.22)}" y="${f1(hh / 2 + w * 0.11)}" width="${f1(w * 0.44)}" height="${f1(w * 0.05)}" rx="${f1(w * 0.02)}" fill="#3A3F4A" stroke="${INK}" stroke-width="${f1(lw * 0.8)}"/>` +
    `<rect x="${f1(-w / 2)}" y="${f1(-hh / 2)}" width="${f1(w)}" height="${f1(hh)}" rx="${f1(w * 0.05)}" fill="#2B2F38" stroke="${INK}" stroke-width="${f1(lw)}"/><rect x="${f1(-w / 2 + w * 0.05)}" y="${f1(-hh / 2 + w * 0.05)}" width="${f1(w * 0.9)}" height="${f1(hh - w * 0.1)}" rx="${f1(w * 0.02)}" fill="#0E1A2C"/>${inner || ''}</g>`;
};
const smTag = (x, y, txt, o = {}) => `<g transform="translate(${x} ${y})"><rect x="${-txt.length * 14 - 22}" y="-26" width="${txt.length * 28 + 44}" height="52" rx="12" fill="${o.bg || '#E8ECF2'}" stroke="${INK}" stroke-width="4" opacity=".95"/><text x="0" y="10" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="28" fill="${o.fg || '#3A4250'}">${esc(txt)}</text></g>`;

/* ================= h0~h4: the crosswalk ================= */
const SMY = 1150;     // feet on the sidewalk (cross plate)
function sturnScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3;
  E['_zt'] = qTalk('겁먹음', env(t));
  if (id === 'h0') {   // wide: walking with coffee → stops → whips around → the street behind is unrendered for a blink
    const tStop = 1.15, tTurn = 1.42, g0 = tTurn + 0.06, g1 = g0 + 0.34;
    const cam = qLerpCam(lt / 2.4, [980, 760, 1.12], [960, 750, 1.16]);
    const u = clamp(lt / tStop, 0, 1), zx = lerp(560, 1040, u), walking = lt < tStop;
    const settle = !walking ? Math.sin((lt - tStop) * 16) * 5 * Math.exp(-(lt - tStop) * 7) : 0;
    const tk = clamp((lt - tTurn) / 0.16, 0, 1), turned = lt > tTurn;
    const sx = turned && tk < 1 ? 1 - 0.38 * Math.sin(tk * Math.PI) : 1;
    const sur = lt > g1 ? Math.exp(-(lt - g1) * 6) : 0;
    const pose = walking ? smWalkCup(lt * 8.4, 0.72) : P['sm컵'];
    const ex = exprAt([[0, '기본'], [tTurn, '놀람']], lt);
    let ch = qShadow(zx, SMY, 70) + smZero(t, { x: zx, y: SMY + settle, s: 1.0, sx, sy: 1 + 0.05 * sur, rot: turned ? -4 * (1 - 0.5 * tk) : 0, tilt: turned ? -7 : 0, pose, ex, look: turned ? [-1, -0.05] : [0.85, 0.05], still: turned });
    const hp = ptOf(zx, SMY + settle, 1.0, pose.hR[0], pose.hR[1]);
    ch += smCup(hp[0] + 4, hp[1] + 6, 0.95, walking ? Math.sin(lt * 8.4 - 0.6) * 6 : (turned ? 14 * Math.exp(-(lt - tTurn) * 5) * Math.sin((lt - tTurn) * 20) : 0));
    if (turned && lt < tTurn + 0.6) for (let i = 0; i < 3; i++) { const k = clamp((lt - tTurn) / 0.5, 0, 1); ch += `<circle cx="${f1(hp[0] + 10 + i * 14 + k * 60)}" cy="${f1(hp[1] - 50 - k * 50 + k * k * 120 + i * 6)}" r="${6 - i}" fill="#8A5A30" opacity="${f1((1 - k) * 100) / 100}"/>`; }
    const head = smScr(cam, zx, SMY - 390);
    let h = smDefs() + smPlate('cross', cam) + qCam(cam, ch);
    if (lt > g0 && lt < g1) {   // the street behind him (left of him) is grey outlines + grid
      const bx = smScr(cam, zx - 130, 0)[0], gk = (lt - g0) / (g1 - g0);
      h = smDefs() + smPlate('cross', cam) + smWire('cross', cam, 0.55, bx) + qCam(cam, ch) + smGlitch(t, gk < 0.2 || gk > 0.8 ? 1 : 0.3, 3);
    }
    return h + smWhipArcs(head[0], head[1] + 40, clamp((lt - tTurn) / 0.3, 0, 1), -1) + smMorning(1);
  }
  if (id === 'h1') {   // CU: frozen, eyes darting · then over his shoulder at the street (an after-image flickers)
    const tEv = smAt(a, '증거', 0.55 * D), zx = 1040;
    if (lt < tEv - 0.2) {
      const cam = qLerpCam(lt / tEv, [zx + 30, 800, 2.25], [zx + 30, 795, 2.4]);
      const dart = Math.floor(lt / 0.9) % 2 ? [0.7, -0.05] : [-1, -0.05];
      let ch = qShadow(zx, SMY, 70) + smZero(t, { x: zx, y: SMY, s: 1.0, pose: 'sm컵', tilt: -4, still: true, noBlink: true, ex: exprAt([[0, '놀람'], [1.0, '겁먹음']], lt), look: dart });
      const hp = ptOf(zx, SMY, 1.0, 248, 318); ch += smCup(hp[0] + 4, hp[1] + 6, 0.95, Math.sin(t * 40) * 1.5);
      return smDefs() + smPlate('cross_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.8) + smClock(330, 190, t, clamp(lt / 0.35, 0, 1));
    }
    const k = lt - tEv + 0.2, cam = qLerpCam(k / 4, [620, 720, 1.35], [600, 712, 1.42]);
    const fx0 = 1520 + (cam[0] - 620) * 0.4;
    const fg = `<g filter="url(#qblur)" opacity=".97"><path d="M${fx0 - 280} 1300 Q${fx0 - 250} 900 ${fx0} 880 Q${fx0 + 260} 900 ${fx0 + 290} 1300 Z" fill="${SM_ORANGE}" stroke="${INK}" stroke-width="10"/><circle cx="${fx0}" cy="700" r="200" fill="#fff" stroke="${INK}" stroke-width="10"/></g>`;
    const fl = (k > 1.1 && k < 1.22) || (k > 2.6 && k < 2.68) ? 1 : 0;
    let h = smDefs() + smPlate('cross', cam, 0.55);
    if (fl) h += smWire('cross', cam, 0.55, 99999, { op: 0.55 }) + smGlitch(t, 0.5, 7);
    return h + qCam([cam[0], cam[1], cam[2] * 1.08], fg) + smMorning(0.9);
  }
  if (id === 'h2') {   // MCU: whispering, thumb over the shoulder
    const zx = 1040, cam = qLerpCam(lt / D, [zx + 40, 830, 1.85], [zx + 40, 826, 1.95]);
    const pt = clamp((lt - 0.25) / 0.35, 0, 1);
    let ch = qShadow(zx, SMY, 70) + flip(zx, smZero(t, { x: zx, y: SMY, s: 1.0, pose: mixPose('sm컵L', 'sm뒤L', pt), shiver: true, ex: { expr: '_zt', prev: '_zt', k: 1, blink: 0 }, look: [0.3, 0], tilt: 4 }));
    const hp = ptOf(zx, SMY, 1.0, 400 - 248, 318); ch += smCup(2 * zx - hp[0] - 4, hp[1] + 6, 0.95, Math.sin(t * 40) * 2);
    return smDefs() + smPlate('cross_c', [cam[0] - 200, cam[1], cam[2]], 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.8);
  }
  if (id === 'h3') {   // pull back + tilt up: a grid sweeps over the sky on "시뮬레이션" · then Zero looks at us
    const tSim = smAt(a, '시뮬', 0.35 * D), tYou = smAt(a, '당신', 0.62 * D), zx = 1040;
    if (lt < tYou - 0.15) {
      const cam = qLerpCam(lt / (tYou - 0.15), [zx - 20, 860, 1.45], [960, 520, 1.0]);
      let ch = qShadow(zx, SMY, 70) + smZero(t, { x: zx, y: SMY, s: 1.0, pose: 'sm컵', still: true, ex: exprAt([[0, '걱정']], lt), look: [-0.2, -0.6] });
      const hp = ptOf(zx, SMY, 1.0, 248, 318); ch += smCup(hp[0] + 4, hp[1] + 6, 0.95);
      let h = smDefs() + smPlate('cross', cam, 0.55) + qCam(cam, ch) + smMorning(1);
      const g = lt - tSim;
      if (g > 0) {   // scan line drops from the top, leaving a faint grid on the world
        const y = -200 + clamp(g / 1.3, 0, 1) * 1500, fade = 1 - clamp((g - 3.2) / 1.2, 0, 1);
        h += `<defs><clipPath id="smsky"><rect x="-400" y="-300" width="2800" height="${f1(y + 300)}"/></clipPath></defs><g clip-path="url(#smsky)" opacity="${f1(fade * 0.55 * 100) / 100}"><rect x="-400" y="-300" width="2800" height="1800" fill="url(#smgrid2)"/></g>`;
        if (g < 1.4) h += `<rect x="-400" y="${f1(y - 26)}" width="2800" height="52" fill="url(#smbarh)" opacity=".9"/><rect x="-400" y="${f1(y - 2)}" width="2800" height="4" fill="#fff"/>`;
      }
      return h;
    }
    const k = lt - tYou + 0.15, cam = qLerpCam(k / 4.5, [zx, 790, 2.0], [zx, 780, 2.25]);
    let ch = qShadow(zx, SMY, 70) + smZero(t, { x: zx, y: SMY, s: 1.0, pose: 'sm컵', ex: exprAt([[0, '걱정'], [1.6, '결심']], k), look: [0, 0.05] });
    const hp = ptOf(zx, SMY, 1.0, 248, 318); ch += smCup(hp[0] + 4, hp[1] + 6, 0.95);
    return smDefs() + smPlate('cross_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(1);
  }
  // h4: the movie moment — letterbox bars slide in, a title, Zero pulls out a notepad (determined)
  const zx = 960, cam = qLerpCam(lt / D, [960, 760, 1.18], [960, 748, 1.26]);
  const tToday = smAt(a, '오늘', 0.45 * D), pad = clamp((lt - tToday + 0.1) / 0.35, 0, 1);
  const inh = Math.sin(clamp((lt - tToday + 0.6) / 0.9, 0, 1) * Math.PI);
  let ch = qShadow(zx, SMY, 70) + smZero(t, { x: zx, y: SMY, s: 1.0, sy: 1 + 0.045 * inh, pose: mixPose('sm컵', 'sm수첩', pad), ex: exprAt([[0, '걱정'], [tToday, '결심']], lt), look: [0, 0.05] });
  if (pad > 0.5) { const hl = ptOf(zx, SMY, 1.0, 182, 330); ch += smPad(hl[0] + 4, hl[1] + 6, 0.95, -8); const hr = ptOf(zx, SMY, 1.0, 212, 332); ch += smPen(hr[0] + 6, hr[1] - 8, 0.9, 30 + Math.sin(t * 14) * 8); }
  else { const hp = ptOf(zx, SMY, 1.0, 248, 318); ch += smCup(hp[0] + 4, hp[1] + 6, 0.95); }
  const bar = easeOut(clamp(lt / 0.5, 0, 1)), ti = clamp((lt - 0.35) / 0.4, 0, 1);
  let h = smDefs() + smPlate('cross', cam) + qCam(cam, ch) + smMorning(1);
  h += `<rect x="-400" y="${f1(-300 + 0)}" width="2800" height="${f1(300 + 120 * bar)}" fill="#000"/><rect x="-400" y="${f1(1214 - 132 * bar)}" width="2800" height="400" fill="#000"/>`;
  if (ti > 0) h += `<g opacity="${f1(ti * 100) / 100}" transform="translate(0 ${f1((1 - easeOut(ti)) * -20)})">` + outlined(960, 250, [[['이 세상이 ', '#fff'], ['가짜', '#B9C3D0'], ['라는 증거', '#fff']]], { size: 92, sw: 16 }) + `</g>`;
  return h;
}

/* ================= e1, e2: evidence 1 — the whip turn ================= */
function sturn2Scene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3, zx = 1180;
  if (id === 'e1') {   // MCU: detective mode — writing in the notepad; card ① pops on "첫째"
    const cam = qLerpCam(lt / D, [zx - 120, 820, 1.6], [zx - 130, 812, 1.7]), t1 = smAt(a, '첫째', 2.0);
    const wr = Math.sin(t * 16) * 6;
    const pose = smPose('sm수첩', { hR: [212 + wr, 332], armR: [[252, 285], [266, 344], [218 + wr, 336]] });
    let ch = qShadow(zx, SMY, 70) + smZero(t, { x: zx, y: SMY, s: 1.0, pose, ex: exprAt([[0, '결심'], [t1, 'sm씩']], lt), look: [-0.2, 0.5] });
    const hl = ptOf(zx, SMY, 1.0, 182, 330); ch += smPad(hl[0] + 4, hl[1] + 6, 0.95, -8);
    const hr = ptOf(zx, SMY, 1.0, 212 + wr, 332); ch += smPen(hr[0] + 6, hr[1] - 8, 0.9, 30 + wr);
    return smDefs() + smPlate('cross', cam, 0.45) + qCam(cam, ch) + smMorning(1) + smCard(560, 230, '1', '홱 돌아보기', clamp((lt - t1) / 0.35, 0, 1));
  }
  // e2: whip, whip, whip — the third one catches the grey grid on the whole street
  const cam = [zx - 160, 800, 1.42];
  const W = [0.12, 0.72, 1.32], side = [-1, 1, -1];
  let n = 0; for (let i = 0; i < 3; i++) if (lt >= W[i]) n = i + 1;
  const tw = n ? lt - W[n - 1] : 9, tk = clamp(tw / 0.14, 0, 1);
  const sx = n && tk < 1 ? 1 - 0.36 * Math.sin(tk * Math.PI) : 1, dir = n ? side[n - 1] : -1;
  const g0 = W[2] + 0.05, g1 = g0 + 0.38, gl = lt > g0 && lt < g1;
  let ch = qShadow(zx, SMY, 70) + smZero(t, { x: zx, y: SMY, s: 1.0, sx, rot: dir * 4, tilt: dir * 7, pose: 'sm수첩', still: true, ex: exprAt([[0, '결심'], [g0, '놀람'], [g1 + 0.4, 'sm씩']], lt), look: [dir, -0.05] });
  const hl = ptOf(zx, SMY, 1.0, 182, 330); ch += smPad(hl[0] + 4, hl[1] + 6, 0.95, -8);
  const hr = ptOf(zx, SMY, 1.0, 212, 332); ch += smPen(hr[0] + 6, hr[1] - 8, 0.9, 30);
  const head = smScr(cam, zx, SMY - 390);
  let h = smDefs() + smPlate('cross', cam, 0.45);
  if (gl) h += smWire('cross', cam, 0.45) + qCam(cam, ch) + smGlitch(t, (lt - g0) / (g1 - g0) < 0.25 ? 1 : 0.25, 5);
  else h += qCam(cam, ch);
  return h + smWhipArcs(head[0], head[1] + 40, tw / 0.3, dir) + smMorning(gl ? 0.2 : 1) + smCard(560, 230, '1', '홱 돌아보기', 1);
}

/* ================= e3, e4: evidence 2 — copy-pasted pigeons ================= */
const SMPY = 1010;
function spigeonScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3;
  const t2 = smAt(a, '둘째', 0.2), tSame = smAt(a, '같은', 0.4 * D), tTilt = smAt(a, '갸웃', 0.8 * D);
  if (id === 'e3' && lt < tSame - 0.15) {   // wide: the park, three pigeons pecking out of step; Zero with his notepad on the right
    const cam = qLerpCam(lt / D, [960, 700, 1.08], [930, 700, 1.13]), zx = 1500;
    let ch = '';
    [[640, 0.0], [840, 0.37], [1040, 0.71]].forEach(([px, ph], i) => { const c = (t * 0.9 + ph) % 1, pk = c < 0.25 ? Math.sin(c / 0.25 * Math.PI) : 0; ch += smPigeon(px + Math.sin(t * 0.7 + i) * 18, SMPY + 40 + i * 6, 1.1, { peck: pk, step: Math.abs(Math.sin(t * 3 + i)), flip: i === 1 }); });
    ch += qShadow(zx, SMPY + 30, 70) + flip(zx, smZero(t, { x: zx, y: SMPY + 30, s: 0.95, pose: 'sm수첩', ex: exprAt([[0, '결심']], lt), look: [0.7, 0.4] }));
    const hl = ptOf(zx, SMPY + 30, 0.95, 182, 330); ch += smPad(2 * zx - hl[0] - 4, hl[1] + 6, 0.9, 8);
    return smDefs() + smPlate('park', cam) + qCam(cam, ch) + smMorning(0.7) + smCard(1360, 230, '2', '복붙 비둘기', clamp((lt - t2) / 0.35, 0, 1), { rot: 4 });
  }
  if (id === 'e3') {   // low insert: all three freeze in the same pose — then tilt their heads at exactly the same frame
    const k = lt - tSame + 0.15, cam = qLerpCam(k / 4, [820, 930, 2.1], [820, 926, 2.2]);
    const fr = k > 0.25, tl = lt > tTilt ? easeOutBack(clamp((lt - tTilt) / 0.18, 0, 1)) * 26 : 0;
    const blink = lt > tTilt + 0.9 && lt < tTilt + 1.02;
    let ch = '';
    [640, 820, 1000].forEach((px, i) => { const c = (t * 0.9 + i * 0.37) % 1, pk = fr ? 0 : (c < 0.25 ? Math.sin(c / 0.25 * Math.PI) : 0); ch += smPigeon(px, SMPY + 6, 0.85, { peck: pk, tilt: -tl, blink }); });
    let h = smDefs() + smPlate('park_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.6);
    if (lt > tTilt + 0.35) {   // a dashed 'selection box' snaps around them, like in an editor
      const p0 = smScr(cam, 560, SMPY - 120), p1 = smScr(cam, 1080, SMPY + 20), off = (t * 40) % 24, s = easeOut(clamp((lt - tTilt - 0.35) / 0.25, 0, 1));
      const cx = (p0[0] + p1[0]) / 2, cy = (p0[1] + p1[1]) / 2, w = (p1[0] - p0[0]) * (0.7 + 0.3 * s), hh = (p1[1] - p0[1]) * (0.7 + 0.3 * s);
      h += `<rect x="${f1(cx - w / 2)}" y="${f1(cy - hh / 2)}" width="${f1(w)}" height="${f1(hh)}" fill="#3DA9FF" fill-opacity=".08" stroke="#3DA9FF" stroke-width="6" stroke-dasharray="16 8" stroke-dashoffset="${f1(off)}" opacity="${f1(s * 100) / 100}"/>`;
      [[cx - w / 2, cy - hh / 2], [cx + w / 2, cy - hh / 2], [cx - w / 2, cy + hh / 2], [cx + w / 2, cy + hh / 2]].forEach(([x, y]) => { h += `<rect x="${f1(x - 10)}" y="${f1(y - 10)}" width="20" height="20" fill="#fff" stroke="#3DA9FF" stroke-width="4" opacity="${f1(s * 100) / 100}"/>`; });
    }
    return h + smCard(1360, 230, '2', '복붙 비둘기', 1, { rot: 4 });
  }
  // e4: CU, deadpan — the pigeons (tilted) soft in the foreground
  const zx = 1180, cam = qLerpCam(lt / D, [zx, 730, 2.0], [zx, 726, 2.1]);
  E['_zt'] = qTalk('sm멍', env(t));
  let ch = qShadow(zx, SMPY + 40, 70) + flip(zx, smZero(t, { x: zx, y: SMPY + 40, s: 1.0, pose: 'sm수첩', ex: { expr: '_zt', prev: '_zt', k: 1, blink: 0 }, look: [0.6, 0.35], tilt: -3 }));
  const hl = ptOf(zx, SMPY + 40, 1.0, 182, 330); ch += smPad(2 * zx - hl[0] - 4, hl[1] + 6, 0.95, 8);
  const fg = `<g filter="url(#qfg)" opacity=".95">${[[860, 905], [975, 925]].map(([px, py]) => smPigeon(px, py, 1.25, { tilt: -26 })).join('')}</g>`;
  return smDefs() + smPlate('park_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.6) + smCard(1360, 230, '2', '복붙 비둘기', 1, { rot: 4 });
}

/* ================= e5, e6: evidence 3 — the fridge that is still loading ================= */
const SMKY = 1080, SMFX = 1372;   // feet in the kitchen · the fridge's left edge (door handle side)
const smFridgeInside = (t, x0, x1, y0, y1, scanY) => {   // interior between x0..x1 (scene space); rendered above scanY, unrendered below
  const id = 'smfi' + (smClipN++), cx = (x0 + x1) / 2;
  const items = (wire) => {
    const st = wire ? `fill="none" stroke="${SM_LINE}" stroke-width="5"` : '';
    const F = (c) => wire ? st : `fill="${c}" stroke="${INK}" stroke-width="5"`;
    let h = '';
    [y0 + 260, y0 + 520].forEach(y => { h += `<path d="M${x0 - 50} ${y} H${x1 + 50}" stroke="${wire ? SM_LINE : '#B9D4E6'}" stroke-width="${wire ? 4 : 10}"/>`; });
    h += `<rect x="${cx - 120}" y="${y0 + 90}" width="90" height="170" rx="6" ${F('#FFFFFF')}/><path d="M${cx - 120} ${y0 + 90} L${cx - 75} ${y0 + 50} L${cx - 30} ${y0 + 90}" ${F('#FFFFFF')}/><rect x="${cx - 112}" y="${y0 + 150}" width="74" height="40" ${wire ? st : 'fill="#5BA4E6"'}/>`;
    h += `<circle cx="${cx + 70}" cy="${y0 + 210}" r="46" ${F('#E8473C')}/><path d="M${cx + 70} ${y0 + 166} q10 -26 26 -30" ${wire ? st : `stroke="${INK}" stroke-width="5" fill="none"`}/>`;
    for (let i = 0; i < 4; i++) h += `<ellipse cx="${cx - 110 + i * 70}" cy="${y0 + 476}" rx="30" ry="40" ${F('#FFF1D6')}/>`;
    h += `<rect x="${cx + 40}" y="${y0 + 300}" width="56" height="160" rx="18" ${F('#7CC58A')}/><rect x="${cx - 60}" y="${y0 + 360}" width="80" height="100" rx="10" ${F('#FFD36A')}/>`;
    return h;
  };
  let h = `<defs><clipPath id="${id}a"><rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(Math.max(0, x1 - x0))}" height="${f1(Math.max(0, Math.min(scanY, y1) - y0))}"/></clipPath><clipPath id="${id}b"><rect x="${f1(x0)}" y="${f1(scanY)}" width="${f1(Math.max(0, x1 - x0))}" height="${f1(Math.max(0, y1 - scanY))}"/></clipPath></defs>`;
  h += `<g clip-path="url(#${id}a)"><rect x="${x0 - 10}" y="${y0}" width="${x1 - x0 + 20}" height="${y1 - y0}" fill="#EEF8FF"/>${items(false)}</g>`;
  h += `<g clip-path="url(#${id}b)"><rect x="${x0 - 10}" y="${y0}" width="${x1 - x0 + 20}" height="${y1 - y0}" fill="${SM_SLATE}"/><rect x="${x0 - 10}" y="${y0}" width="${x1 - x0 + 20}" height="${y1 - y0}" fill="url(#smgrid)"/>${items(true)}`;
  const sy = Math.max(scanY + 140, y0 + 760), r = 46, ang = (t * 360) % 360;   // loading spinner
  h += `<circle cx="${cx}" cy="${sy}" r="${r}" fill="none" stroke="#6A7384" stroke-width="12"/><circle cx="${cx}" cy="${sy}" r="${r}" fill="none" stroke="#fff" stroke-width="12" stroke-dasharray="70 220" stroke-linecap="round" transform="rotate(${f1(ang)} ${cx} ${sy})"/>` +
    `<text x="${cx}" y="${sy + 100}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="38" fill="#fff">로딩 중…</text></g>`;
  if (scanY > y0 && scanY < y1) h += `<rect x="${x0}" y="${f1(scanY - 3)}" width="${x1 - x0}" height="6" fill="#fff"/><rect x="${x0}" y="${f1(scanY - 22)}" width="${x1 - x0}" height="44" fill="#BFE8FF" opacity=".35"/>`;
  return h;
};
function sfridgeScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3;
  if (id === 'e5') {
    const t3 = smAt(a, '셋째', 0.2), tOpen = smAt(a, '열고', 0.4 * D), tDraw = smAt(a, '그려지', 0.75 * D);
    if (lt < tOpen - 0.1) {   // wide: tiptoeing to the fridge at night
      const cam = qLerpCam(lt / tOpen, [1080, 780, 1.12], [1160, 770, 1.22]);
      const u = clamp(lt / (tOpen - 0.4), 0, 1), zx = lerp(620, SMFX - 150, easeInOut(u)), ph = lt * 6;
      const sneak = u < 1 ? Object.assign({}, walkPose(ph, 0.5), { armL: [[148, 285], [118, 300], [112, 262]], hL: [110, 254], armR: [[252, 285], [292, 296], [300, 256]], hR: [302, 248], dy: walkPose(ph, 0.5).dy + 14 }) : mixPose('서기', 'sm문', clamp((lt - tOpen + 0.5) / 0.3, 0, 1));
      let ch = qShadow(zx, SMKY, 70) + smZero(t, { x: zx, y: SMKY, s: 1.0, sy: u < 1 ? 0.96 : 1, pose: sneak, ex: exprAt([[0, 'sm씩']], lt), look: [0.9, 0.1] });
      return smDefs() + smPlate('kitchen', cam) + qCam(cam, ch) + smNightK(0.6) + smCard(560, 230, '3', '그려지는 냉장고', clamp((lt - t3) / 0.35, 0, 1));
    }
    // insert: the door opens a crack — inside is still being drawn
    const k = lt - tOpen + 0.1, gap = 60 + 330 * easeOut(clamp(k / 1.4, 0, 1));
    const scan = lt < tDraw ? 140 : 140 + (lt - tDraw) * 260;
    const gx0 = 760, x1 = gx0 + gap;
    let h = smDefs() + smPlate('kitchen_c', [1580, 600, 2.4], 0.3, { blur: true }) + smFull('#0A1030', 0.45);
    h += `<rect x="-400" y="60" width="${gx0 + 400}" height="1100" fill="#E9EEF3" stroke="${INK}" stroke-width="10"/><rect x="${gx0 - 70}" y="60" width="70" height="1100" fill="#D3DAE2"/>`;   // the fridge body (left)
    h += smFridgeInside(t, gx0, x1, 100, 1100, scan);
    h += `<rect x="${f1(x1)}" y="40" width="1600" height="1140" fill="#F5F8FB" stroke="${INK}" stroke-width="10"/><rect x="${f1(x1)}" y="40" width="${f1(14 + gap * 0.12)}" height="1140" fill="#C9D2DC" stroke="${INK}" stroke-width="6"/>`;   // the door + its edge
    h += `<rect x="${f1(x1 + 70)}" y="380" width="36" height="300" rx="16" fill="#C9D2DC" stroke="${INK}" stroke-width="7"/>`;
    h += `<path d="M${f1(x1 + 640)} 1320 Q${f1(x1 + 330)} 780 ${f1(x1 + 110)} 560" stroke="${INK}" stroke-width="40" stroke-linecap="round" fill="none"/><path d="M${f1(x1 + 700)} 1340 Q${f1(x1 + 480)} 1000 ${f1(x1 + 330)} 860" stroke="${INK}" stroke-width="150" stroke-linecap="round" fill="none"/><path d="M${f1(x1 + 700)} 1340 Q${f1(x1 + 480)} 1000 ${f1(x1 + 330)} 860" stroke="${SM_ORANGE}" stroke-width="134" stroke-linecap="round" fill="none"/><ellipse cx="${f1(x1 + 96)}" cy="540" rx="74" ry="66" fill="#fff" stroke="${INK}" stroke-width="12"/>`;   // Zero's hand on the handle
    h += `<ellipse cx="${f1(gx0 + gap / 2)}" cy="600" rx="${f1(300 + gap)}" ry="700" fill="url(#smcold)" opacity="${f1((0.25 + 0.3 * (gap / 390)) * 100) / 100}"/>`;
    return h + smCard(560, 230, '3', '그려지는 냉장고', 1);
  }
  // e6: CU lit by the fridge — "됐다. 증거 세 개." fist pump; the three cards fan out
  const zx = 1150, cam = qLerpCam(lt / D, [zx - 80, 790, 2.0], [zx - 80, 784, 2.1]);
  const tPump = smAt(a, '됐다', 0.2) + 0.15, pk = clamp((lt - tPump) / 0.25, 0, 1), pre = lt < tPump ? clamp((lt - tPump + 0.35) / 0.35, 0, 1) : 0;
  E['_zt'] = qTalk('신남', env(t));
  const pose = mixPose('서기', '주먹', Math.max(pk, pre * 0.3));
  let ch = qShadow(zx, SMKY, 70) + smZero(t, { x: zx, y: SMKY + 8 * pre * (1 - pk), s: 1.0, sy: 1 - 0.05 * pre + 0.06 * Math.sin(pk * Math.PI), pose, ex: { expr: '_zt', prev: '_zt', k: 1, blink: 0 }, look: [0.5, -0.1] });
  let h = smDefs() + smPlate('kitchen_c', cam, 0.3, { blur: true }) + smNightK(0.75) + qCam(cam, ch);
  h += `<ellipse cx="1900" cy="520" rx="900" ry="800" fill="url(#smcold)" opacity=".55"/>`;
  const tc = smAt(a, '증거', 0.9);
  [[400, 250, '1', '홱 돌아보기', -5], [400, 430, '2', '복붙 비둘기', 3], [400, 610, '3', '그려지는 냉장고', -3]].forEach(([x, y, n, s, r], i) => { h += smCard(x, y, n, s, clamp((lt - tc - i * 0.12) / 0.3, 0, 1), { rot: r, s: 0.85 }); });
  return h;
}

/* ================= b1~b3: Bostrom ================= */
function sbostromScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3;
  if (id === 'b1') {
    const tYear = smAt(a, '2003', smAt(a, '이천', 0.62 * D));
    if (lt < tYear - 0.2) {   // the empty Oxford study at dusk — a slow push towards the desk, the lamp breathing
      const cam = qLerpCam(lt / tYear, [960, 600, 1.0], [760, 650, 1.22]);
      const fl = 0.85 + 0.1 * Math.sin(t * 3) + 0.05 * Math.sin(t * 11);
      const glow = `<ellipse cx="178" cy="600" rx="300" ry="220" fill="#FFE07A" opacity="${f1(fl * 0.22 * 100) / 100}" filter="url(#qfg)"/><ellipse cx="200" cy="700" rx="260" ry="90" fill="#FFE07A" opacity="${f1(fl * 0.16 * 100) / 100}" filter="url(#qfg)"/>`;
      return smDefs() + smPlate('study', cam, 0.6, { extra: glow }) + smFull('#1A1440', 0.1);
    }
    const k = lt - tYear + 0.2, tName = smAt(a, '보스트롬', smAt(a, '닉', 0.85 * D));   // insert: the paper on the desk
    const cam = qLerpCam(k / 4, [1000, 760, 2.4], [1000, 740, 2.55]), drop = easeOut(clamp(k / 0.5, 0, 1));
    let h = smDefs() + smPlate('study', cam, 0.35, { blur: true }) + smFull('#140F28', 0.35);
    h += `<g transform="translate(960 ${f1(560 - 40 * (1 - drop))}) rotate(${f1(-3 + 4 * (1 - drop))})"><rect x="-500" y="-330" width="1000" height="680" fill="#000" opacity=".3" transform="translate(16 18)"/><rect x="-500" y="-330" width="1000" height="680" fill="#FBF7EC" stroke="${INK}" stroke-width="8"/>` +
      `<text x="0" y="-210" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="50" fill="${INK}">Are You Living in a</text><text x="0" y="-145" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="50" fill="${INK}">Computer Simulation?</text>` +
      `<text x="0" y="-80" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="32" fill="#5A5248">Nick Bostrom · 2003</text>`;
    for (let i = 0; i < 6; i++) h += `<rect x="-400" y="${-20 + i * 42}" width="${800 - (i % 3) * 120}" height="14" rx="7" fill="#D8D0C0"/>`;
    h += `<text x="0" y="300" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="38" fill="#B0452E">"당신은 컴퓨터 시뮬레이션 속에 살고 있는가?"</text></g>`;
    if (lt > tName) h += pop(t, t - (lt - tName), t + 99, 960, 930, label(0, 0, '닉 보스트롬 · 옥스퍼드대 철학자', { size: 40, bg: YEL }), { rot: -2 });
    return h;
  }
  // b2 / b3: the concept — one real world, then billions of computer worlds
  const tPC = smAt(a, '컴퓨터', 0.15 * D), tMany = smAt(a, '없이', 0.35 * D), tBil = smAt(a, '수십', 0.8 * D);
  const run = a._run || lt;
  let h = smDefs() + smPlate('space', [960, 560, 1.05 + 0.02 * Math.sin(t * 0.2)], 0.2) + smFull('#000014', 0.25);
  const isB3 = id === 'b3';
  const w1 = isB3 ? 1 : clamp((lt - tPC) / 0.6, 0, 1), w2 = isB3 ? 1 : clamp((lt - tMany) / 1.0, 0, 1), w3 = isB3 ? 1 : clamp((lt - tBil) / 0.8, 0, 1);
  const zoom = isB3 ? 0.78 : lerp(1.25, 0.78, easeInOut(clamp(lt / D, 0, 1)));
  let g = '';
  // wave 3: a sea of tiny screens
  if (w3 > 0) for (let i = 0; i < 26; i++) for (let j = 0; j < 14; j++) { const x = -320 + i * 100 + (j % 2) * 50, y = -200 + j * 110, d = Math.hypot(x - 960, y - 540); if (d < 470) continue; const k = clamp(w3 * 1.6 - d / 1600, 0, 1); if (k <= 0) continue; g += `<rect x="${x - 34}" y="${y - 22}" width="68" height="44" rx="5" fill="#1E3350" stroke="#5E87B8" stroke-width="3" opacity="${f1(k * 0.9 * 100) / 100}"/><circle cx="${x}" cy="${y}" r="12" fill="#3E8EDC" opacity="${f1(k * 100) / 100}"/>`; }
  // wave 2: 24 monitors
  if (w2 > 0) for (let i = 0; i < 24; i++) { const ang = i / 24 * 6.283 + 0.13, r = 560 + (i % 2) * 70, k = clamp(w2 * 1.5 - i / 30, 0, 1); if (k <= 0) continue; const x = 960 + Math.cos(ang) * r * 1.35, y = 540 + Math.sin(ang) * r * 0.78; g += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(easeOutBack(k) * 1000) / 1000})">${smMon(0, 0, 150, smEarth(0, -4, 30, { spin: t * 0.3 + i }))}</g>`; }
  // wave 1: 8 monitors around the Earth
  if (w1 > 0) for (let i = 0; i < 8; i++) { const ang = i / 8 * 6.283 - 1.57, k = clamp(w1 * 1.4 - i * 0.05, 0, 1); if (k <= 0) continue; const x = 960 + Math.cos(ang) * 430, y = 540 + Math.sin(ang) * 300; g += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(easeOutBack(k) * 1000) / 1000})">${smMon(0, 0, 210, smEarth(0, -6, 44, { spin: t * 0.3 + i }))}</g>`; }
  // the real one
  let realX = 960, realY = 540, realR = 150, ring = 1;
  if (isB3) {   // b3: the real Earth shrinks into the crowd — which one is real?
    const s = easeInOut(clamp(lt / 1.2, 0, 1)); realR = lerp(150, 44, s); ring = 1 - s;
  }
  g += smEarth(realX, realY, realR, { spin: t * 0.25, glow: 0.7 });
  if (ring > 0) g += `<circle cx="${realX}" cy="${realY}" r="${f1(realR + 26)}" fill="none" stroke="#FFD27A" stroke-width="8" opacity="${f1(ring * 100) / 100}"/>`;
  h += `<g transform="translate(960 540) scale(${f1(zoom * 1000) / 1000}) translate(-960 -540)">${g}</g>`;
  if (!isB3) {
    h += `<g opacity="${f1(clamp(lt / 0.4, 0, 1) * 100) / 100}">${label(960, 540 + 205 * zoom, '진짜 세상 1', { size: 36, bg: YEL })}</g>`;
    const cnt = w3 > 0.2 ? '수십억' : w2 > 0.2 ? '1,000' : w1 > 0.2 ? '8' : '';
    if (cnt) h += outlined(960, 150, [[['진짜 1', '#FFD27A'], [' : ', '#fff'], ['컴퓨터 속 ' + cnt, '#9FD8FF']]], { size: 64, sw: 13 });
  } else {
    const hop = Math.floor(lt / 0.42), hk = lt > 1.2 ? hop : -1;   // a searching ring hops from screen to screen
    if (hk >= 0) { const ang = hash(hk * 3.1) * 6.283, r = 300 + hash(hk + 9) * 420, x = 960 + Math.cos(ang) * r * zoom * 1.3, y = 540 + Math.sin(ang) * r * zoom * 0.7; h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="62" fill="none" stroke="#FFD27A" stroke-width="8"/>`; }
    const tQ = smAt(a, '확률', 0.6 * D);
    if (lt > tQ) h += pop(t, t - (lt - tQ), t + 99, 960, 300, outlined(0, 0, [[['진짜일 확률은?', '#FFD27A']]], { size: 96, sw: 18 }), { inDur: 0.3 });
  }
  return h + smTag(1700, 960, '개념도');
}

/* ================= b4: three options ================= */
function sbostrom2Scene(t, lt, a) {
  const D = a._dur || 10;
  const tHead = smAt(a, '셋', 0.15 * D), t1 = smAt(a, '사라지', 0.4 * D), t2 = smAt(a, '만들지', 0.62 * D), t3 = smAt(a, '아니면', 0.78 * D), tIn = smAt(a, '그안', smAt(a, '안에', 0.93 * D));
  let h = smDefs() + smPlate('space', [960, 560, 1.06], 0.2) + smFull('#000014', 0.4);
  if (lt > tHead) h += pop(t, t - (lt - tHead), t + 99, 960, 120, outlined(0, 0, [[['셋 중 ', '#fff'], ['적어도 하나는 참', '#FFD27A']]], { size: 70, sw: 14 }), { inDur: 0.3 });
  const focus = clamp((lt - tIn + 0.2) / 0.8, 0, 1);
  const card = (x, y, k, icon, txt, dim) => {
    if (k <= 0) return '';
    const s = easeOutBack(clamp(k, 0, 1));
    return `<g transform="translate(${x} ${y}) scale(${f1(s * 1000) / 1000})" opacity="${f1((1 - 0.65 * dim) * 100) / 100}"><rect x="-230" y="-250" width="460" height="520" rx="26" fill="#000" opacity=".3" transform="translate(10 12)"/><rect x="-230" y="-250" width="460" height="520" rx="26" fill="#F7F4EA" stroke="${INK}" stroke-width="8"/>${icon}` +
      `<text x="0" y="200" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="38" fill="${INK}">${txt[0]}</text><text x="0" y="248" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="38" fill="${INK}">${txt[1]}</text></g>`;
  };
  const sand = clamp((lt - t1) / 3, 0, 1);
  const i1 = smEarth(0, -60, 110, { gray: true, spin: t * 0.2 }) + `<g transform="translate(120 40)"><path d="M-30 -50 H30 L4 0 L30 50 H-30 L-4 0 Z" fill="#FFE8B0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M${f1(-20 + 18 * sand)} ${f1(-42 + 30 * sand)} H${f1(20 - 18 * sand)} L0 -6 Z M-22 44 H22 L${f1(10 - 10 * sand)} ${f1(30 - 20 * sand)} H${f1(-10 + 10 * sand)} Z" fill="#E0A848"/></g>`;
  const i2 = smMon(0, -70, 280, `<circle cx="0" cy="0" r="44" fill="none" stroke="#6A7384" stroke-width="10"/><path d="M0 -60 V-6" stroke="#6A7384" stroke-width="10" stroke-linecap="round"/>`) + `<path d="M-110 -170 L110 50 M110 -170 L-110 50" stroke="#E2574C" stroke-width="16" stroke-linecap="round" opacity=".85"/>`;
  const i3 = smMon(0, -70, 300, `<g transform="translate(-123 -77) scale(.1025)"><image href="${QBG.cross}" x="0" y="0" width="2400" height="1350"/></g>` + `<g transform="translate(-4 52) scale(.2)">${smZero(t, { x: 0, y: 0, s: 1, pose: 'sm컵', ex: { expr: '놀람', prev: '놀람', k: 1, blink: 0 }, look: [-1, 0] })}</g>`);
  h += card(470, 560, clamp((lt - t1) / 0.35, 0, 1), i1, ['인류가', '그 전에 사라진다'], focus);
  h += card(960, 560, clamp((lt - t2) / 0.35, 0, 1), i2, ['만들 수 있어도', '만들지 않는다'], focus);
  const k3 = clamp((lt - t3) / 0.35, 0, 1), sc = 1 + 0.32 * easeInOut(focus);
  if (k3 > 0) h += `<g transform="translate(${f1(lerp(1450, 1250, easeInOut(focus)))} ${f1(lerp(560, 470, easeInOut(focus)))}) scale(${f1(sc * 1000) / 1000}) translate(-1450 -560)">` + card(1450, 560, k3, i3, ['우리는 거의 확실히', '그 안에 있다'], 0) + `</g>`;
  return h;
}

/* ================= b5, b6: the lattice test (Beane et al. 2012) ================= */
const smLattice = (op, t) => {   // an isometric lattice over space
  if (op <= 0) return '';
  const ax = [48, 28], ay = [-48, 28], az = [0, -56]; let h = `<g stroke="#9FD8FF" stroke-width="2.4" opacity="${f1(op * 100) / 100}" fill="none">`;
  for (let i = -14; i <= 14; i++) {
    const p = (u, v) => [960 + ax[0] * u + ay[0] * v, 600 + ax[1] * u + ay[1] * v];
    let a1 = p(i, -18), a2 = p(i, 18); h += `<path d="M${f1(a1[0])} ${f1(a1[1])} L${f1(a2[0])} ${f1(a2[1])}"/>`;
    a1 = p(-18, i); a2 = p(18, i); h += `<path d="M${f1(a1[0])} ${f1(a1[1])} L${f1(a2[0])} ${f1(a2[1])}"/>`;
  }
  for (let i = -10; i <= 10; i++) for (let j = -6; j <= 6; j += 2) { const x = 960 + ax[0] * i + ay[0] * j, y = 600 + ax[1] * i + ay[1] * j; if (x < -100 || x > 2020) continue; h += `<path d="M${f1(x)} ${f1(y)} l0 ${az[1]}" opacity=".6"/>`; }
  return h + `</g>`;
};
function slatticeScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 6;
  if (id === 'b5') {
    const tGrid = smAt(a, '격자', 0.35 * D), tP = smAt(a, '입자', 0.75 * D);
    const cam = [960, 560, 1.04 + 0.04 * clamp(lt / D, 0, 1)];
    let h = smDefs() + smPlate('space', cam, 0.25) + smFull('#000014', 0.2);
    h += smLattice(clamp((lt - tGrid) / 0.8, 0, 1) * 0.55, t);
    if (lt > tGrid) h += pop(t, t - (lt - tGrid), t + 99, 960, 130, outlined(0, 0, [[['만약 우주가 ', '#fff'], ['격자', '#9FD8FF'], [' 위에서 계산된다면', '#fff']]], { size: 60, sw: 13 }), { inDur: 0.3 });
    if (lt > tP - 0.3) {   // ultra-high-energy cosmic rays streak in — all lined up with one lattice axis
      for (let i = 0; i < 7; i++) { const k = ((lt - tP + 0.3) * 0.55 + i * 0.17) % 1, x0 = 1500 + (i - 3) * 170, y0 = -120 + (i % 3) * 60, dx = -48 * 16, dy = 28 * 16, x = x0 + dx * k, y = y0 + dy * k;
        h += `<path d="M${f1(x)} ${f1(y)} L${f1(x - dx * 0.16)} ${f1(y - dy * 0.16)}" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".85"/><circle cx="${f1(x)}" cy="${f1(y)}" r="10" fill="#fff"/><circle cx="${f1(x)}" cy="${f1(y)}" r="30" fill="url(#smglow)"/>`; }
      h += pop(t, t - (lt - tP + 0.3), t + 99, 960, 905, label(0, 0, '가장 센 입자(우주선)가 격자 방향으로 치우친다', { size: 34, bg: '#CFE8FF' }), {});
    }
    return h + smTag(1700, 960, '개념도');
  }
  // b6: no such trace found yet … but Zero did
  const tBut = smAt(a, '그런데', 0.5 * D), tFind = smAt(a, '찾아', 0.72 * D);
  if (lt < tBut - 0.1) {
    const cam = [960, 560, 1.08];
    let h = smDefs() + smPlate('space', cam, 0.25) + smFull('#000014', 0.2) + smLattice(0.55 * (1 - clamp(lt / 1.2, 0, 1)), t);
    for (let i = 0; i < 7; i++) { const ang = hash(i * 5.3) * 6.283, k = (lt * 0.5 + i * 0.13) % 1, x0 = 960 + Math.cos(ang) * 1300, y0 = 540 + Math.sin(ang) * 800, x = lerp(x0, 960 - (x0 - 960), k), y = lerp(y0, 540 - (y0 - 540), k);
      h += `<path d="M${f1(x)} ${f1(y)} L${f1(x - (960 - x0) * 0.25)} ${f1(y - (540 - y0) * 0.25)}" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/><circle cx="${f1(x)}" cy="${f1(y)}" r="9" fill="#fff"/>`; }
    const tNo = smAt(a, '없습니다', 0.3 * D) - 0.3;
    if (lt > tNo) { const s = 1 + 0.6 * Math.exp(-(lt - tNo) * 9); h += `<g transform="translate(960 470) rotate(-8) scale(${f1(s * 1000) / 1000})" opacity=".92"><rect x="-330" y="-80" width="660" height="160" rx="18" fill="none" stroke="#C9CDD6" stroke-width="12"/><text x="0" y="26" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="74" fill="#C9CDD6">아직 발견 안 됨</text></g>`; }
    return h + smTag(1700, 960, '개념도');
  }
  // hard cut: the crosswalk again — he whips around and the WHOLE street is grey for a moment
  const zx = 1040, k = lt - tBut + 0.1, cam = qLerpCam(k / 3.5, [zx, 800, 1.7], [zx, 790, 1.95]);
  const tk = clamp((lt - tFind) / 0.16, 0, 1), turned = lt > tFind, g0 = tFind + 0.05, g1 = g0 + 0.5;
  const sx = turned && tk < 1 ? 1 - 0.38 * Math.sin(tk * Math.PI) : 1;
  let ch = qShadow(zx, SMY, 70) + smZero(t, { x: zx, y: SMY, s: 1.0, sx, rot: turned ? -3 : 0, tilt: turned ? -7 : 0, pose: 'sm컵', still: turned, ex: exprAt([[0, '기본'], [tFind, '놀람']], lt), look: turned ? [-1, -0.05] : [0.3, 0.05] });
  const hp = ptOf(zx, SMY, 1.0, 248, 318); ch += smCup(hp[0] + 4, hp[1] + 6, 0.95);
  const head = smScr(cam, zx, SMY - 390);
  let h = smDefs() + smPlate('cross', cam, 0.5);
  if (lt > g0 && lt < g1) h += smWire('cross', cam, 0.5) + qCam(cam, ch) + smGlitch(t, (lt - g0) / (g1 - g0) < 0.25 ? 1 : 0.3, 9);
  else h += qCam(cam, ch);
  return h + smWhipArcs(head[0], head[1] + 40, clamp((lt - tFind) / 0.3, 0, 1), -1) + smMorning(lt > g0 && lt < g1 ? 0.2 : 1);
}
