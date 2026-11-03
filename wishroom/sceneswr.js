/* ---------- 소원이 다 이루어지는 방 · ④ 테스트: 현실 = 스틱맨(색이 빠진 톤), 방 안 = 그림 ---------- */
// 반지하 원룸: 높은 창(지나가는 발목), 낮은 침대, 둥근 밥상(식은 라면, 라면 봉지 + 쪽지 귀퉁이), 스탠드, 쓰레기통, 벽지.
// 1막 현실 장면은 dull 필터(채도 0.35)로 '다 똑같은' 세상을 보여 주고, 문을 넘으면 흰 빛 → 그림(aiwr.js)으로 바뀐다.
Object.assign(CAMS, { wbase: [1.18, 1.26, 780, 540], ctitle: [1.18, 1.2, 780, 540], wnight: [1.16, 1.22, 1180, 545], wdoor: [1.06, 1.12, 1320, 565] });
function local17(o, inner) {
  const s = o.s || 1, p = typeof o.pose === 'string' ? P[o.pose] : (o.pose || P['서기']);
  return `<g transform="translate(${f1(o.x)} ${f1(o.y)}) rotate(${f1(o.rot || 0)}) scale(${s}) translate(-200 -560) translate(0 ${f1((p && p.dy) || 0)})">${inner}</g>`;
}
const ZW = o => HALO(char(Object.assign({ goggles: 'none', vest: '#9A9EA6', patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)' }, o)) +
  local17(Object.assign({ pose: '서기' }, o), `<path d="M150 262 Q200 300 250 262" fill="none" stroke="${INK}" stroke-width="5"/><path d="M186 280 L186 318 M214 280 L214 318" stroke="#E8E8E8" stroke-width="5" stroke-linecap="round"/>`));
const FLOOR = 870;
if (!P['문고리']) P['문고리'] = Object.assign({}, P['서기'], { armR: [[252, 285], [318, 318], [372, 336]], hR: [380, 338] });
P['앉아턱'] = Object.assign({}, P['앉기'], { armR: [[252, 290], [288, 332], [246, 292]], hR: [238, 284] });
P['앉아책상'] = Object.assign({}, P['앉기'], { armL: P['책상'].armL, hL: P['책상'].hL, armR: P['책상'].armR, hR: P['책상'].hR });
const DULL = `<filter id="dull" x="-900" y="-600" width="3720" height="2300" filterUnits="userSpaceOnUse"><feColorMatrix type="saturate" values="0.5"/></filter>`;

function walkersWR(t, night) {   // passers-by's legs seen through the high street-level window
  let h = '';
  const W0 = 660, W1 = 1260, top = 92, foot = 236;
  [[0.0, 120, '#5A6478', 1], [0.37, 90, '#7A6A58', -1], [0.71, 150, '#3E4656', 1]].forEach(([off, sp, col, dir], n) => {
    const span = W1 - W0 + 260, p = ((t * sp / span) + off) % 1, x = dir > 0 ? W0 - 130 + p * span : W1 + 130 - p * span;
    for (let k = 0; k < 2; k++) {
      const ph = t * sp / 26 + k * Math.PI + n, ang = Math.sin(ph) * 0.38, hx = x + (k ? 14 : -14);
      const fx = hx + Math.sin(ang) * (foot - top) * dir, fy = top + Math.cos(ang) * (foot - top);
      h += `<path d="M${f1(hx)} ${top - 30} L${f1(fx)} ${f1(fy - 12)}" stroke="${col}" stroke-width="26" stroke-linecap="round"/>` +
        `<ellipse cx="${f1(fx + 10 * dir)}" cy="${f1(fy - 4)}" rx="22" ry="10" fill="${night ? '#2A2A30' : '#4A3A30'}" stroke="${INK}" stroke-width="3"/>`;
    }
  });
  return `<g clip-path="url(#winWR)">${h}</g>`;
}

function roomWR(t, o = {}) {
  const night = !!o.night;
  let h = `<defs>${DULL}<clipPath id="winWR"><rect x="660" y="80" width="600" height="168" rx="6"/></clipPath>
    <pattern id="paperWR" width="90" height="90" patternUnits="userSpaceOnUse"><path d="M45 18 L56 45 L45 72 L34 45 Z" fill="none" stroke="#B9AE96" stroke-width="3"/><circle cx="0" cy="0" r="5" fill="#C9BEA6"/><circle cx="90" cy="90" r="5" fill="#C9BEA6"/></pattern></defs>`;
  // wall + wallpaper + floor
  h += `<rect x="-700" y="-400" width="3320" height="1900" fill="${night ? '#CFC4AE' : '#E6DDCB'}"/><rect x="-700" y="-400" width="3320" height="${FLOOR + 400}" fill="url(#paperWR)" opacity=".55"/>`;
  h += `<rect x="-700" y="${FLOOR}" width="3320" height="700" fill="${night ? '#A8987C' : '#C8B898'}"/><path d="M-700 ${FLOOR} H2620" stroke="${INK}" stroke-width="6"/>`;
  for (let x = -600; x < 2600; x += 160) h += `<path d="M${x} ${FLOOR} L${x - 90} 1080" stroke="#A08E70" stroke-width="3" opacity=".6"/>`;
  // high window at street level: sky/street, sidewalk, legs
  h += `<rect x="650" y="70" width="620" height="188" rx="10" fill="#7A746A" stroke="${INK}" stroke-width="6"/>`;
  h += `<rect x="660" y="80" width="600" height="168" fill="${night ? '#3D4A72' : '#BFD6E6'}"/><rect x="660" y="226" width="600" height="22" fill="${night ? '#5A5A66' : '#A9A9A4'}"/>`;
  if (night) h += `<circle cx="1180" cy="120" r="70" fill="url(#warm)" opacity=".7"/>`;
  h += walkersWR(t, night) + `<path d="M960 80 V248" stroke="#7A746A" stroke-width="10"/>`;
  // wall details: shelf above the bed, calendar, small round mirror, a sticky note by the window
  h += `<rect x="120" y="520" width="300" height="16" rx="4" fill="#9C8466" stroke="${INK}" stroke-width="5"/><rect x="150" y="452" width="40" height="68" fill="#7C9AB0" stroke="${INK}" stroke-width="4"/><rect x="196" y="466" width="34" height="54" fill="#C98A5A" stroke="${INK}" stroke-width="4"/><path d="M300 520 Q300 478 330 470 Q360 478 360 520 Z" fill="#8FB08A" stroke="${INK}" stroke-width="4"/>`;
  h += `<rect x="470" y="330" width="130" height="160" rx="6" fill="#F7F3EA" stroke="${INK}" stroke-width="5"/><rect x="470" y="330" width="130" height="38" fill="#C9523F" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => `<rect x="${484 + c * 28}" y="${384 + r * 24}" width="16" height="12" fill="#D8D0C0"/>`).join('')).join('');
  h += `<circle cx="1330" cy="440" r="54" fill="#DCE8EE" stroke="${INK}" stroke-width="6"/><path d="M1302 420 L1322 400" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`;
  h += `<rect x="1290" y="150" width="56" height="56" fill="#F6E27A" stroke="${INK}" stroke-width="3" transform="rotate(6 1318 178)"/>`;
  // low bed (left)
  h += `<rect x="60" y="800" width="590" height="70" rx="6" fill="#8E7A5E" stroke="${INK}" stroke-width="6"/>`;
  h += `<path d="M60 742 L650 742 L650 800 L60 800 Z" fill="#F1EFEA" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M60 742 L84 716 L626 716 L650 742" fill="#E4E1DA" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  h += `<path d="M84 716 Q190 690 300 712 L330 742 L64 742 Z" fill="#8F96A0" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M64 742 L330 742 L320 790 Q190 800 64 788 Z" fill="#8F96A0" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  h += `<rect x="100" y="680" width="140" height="48" rx="22" fill="#F6F4EE" stroke="${INK}" stroke-width="5"/>`;
  // lamp cabinet, rice cooker
  h += `<rect x="660" y="740" width="150" height="130" rx="6" fill="#9C8466" stroke="${INK}" stroke-width="6"/>`;
  h += `<path d="M735 740 V690" stroke="${INK}" stroke-width="6"/><path d="M700 690 L770 690 L752 640 L718 640 Z" fill="#F3D9A0" stroke="${INK}" stroke-width="5"/>`;
  if (night || o.lamp) h += `<circle cx="735" cy="680" r="190" fill="url(#warm)" opacity="${night ? 0.85 : 0.45}"/>`;
  // round low table with cold ramen cup and the packet (+ note corner)
  const tx = 1000;
  h += `<ellipse cx="${tx}" cy="790" rx="190" ry="34" fill="#B08A5E" stroke="${INK}" stroke-width="6"/><path d="M${tx - 140} 805 L${tx - 150} ${FLOOR} M${tx + 140} 805 L${tx + 150} ${FLOOR}" stroke="${INK}" stroke-width="10"/>`;
  h += `<path d="M${tx - 70} 718 L${tx - 64} 786 L${tx - 6} 786 L${tx} 718 Z" fill="#F4F0E6" stroke="${INK}" stroke-width="5"/><rect x="${tx - 72}" y="738" width="74" height="18" fill="#E2A24A"/>`;
  h += `<path d="M${tx - 40} 722 L${tx - 6} 676 M${tx - 30} 724 L${tx + 4} 680" stroke="#C9A06A" stroke-width="6" stroke-linecap="round"/>`;
  if (!o.noPacket) {
    h += `<path d="M${tx + 40} 784 L${tx + 52} 760 L${tx + 130} 758 L${tx + 140} 782 Z" fill="#fff" stroke="${INK}" stroke-width="3"/>`;   // note corner
    h += `<path d="M${tx + 10} 786 Q${tx + 30} 752 ${tx + 70} 756 Q${tx + 120} 746 ${tx + 150} 768 Q${tx + 120} 794 ${tx + 60} 790 Z" fill="#D9573A" stroke="${INK}" stroke-width="5"/><path d="M${tx + 40} 770 L${tx + 110} 764" stroke="#F4B25A" stroke-width="6"/>`;
  }
  // trash bin, clothes on the wall
  h += `<path d="M1250 790 L1262 ${FLOOR} L1338 ${FLOOR} L1350 790 Z" fill="#7E8A8C" stroke="${INK}" stroke-width="6"/>`;
  h += `<path d="M1820 380 H1910" stroke="${INK}" stroke-width="8"/>` + [1840, 1890].map((x, n) => `<path d="M${x} 382 L${x - 40} 420 L${x - 30} 560 L${x + 30} 560 L${x + 40} 420 Z" fill="${n ? '#7C8C9C' : '#B8A27A'}" stroke="${INK}" stroke-width="5"/>`).join('');
  return h;
}
function doorWR(t, draw, open, glow) {   // the door that rises out of the wallpaper (x 1480..1740, y 430..870)
  const x0 = 1480, x1 = 1740, y0 = 430, y1 = FLOOR, per = 2 * ((x1 - x0) + (y1 - y0));
  let h = '';
  if (glow > 0) h += `<ellipse cx="${(x0 + x1) / 2}" cy="${(y0 + y1) / 2}" rx="${f1(260 + 60 * glow)}" ry="${f1(330 + 60 * glow)}" fill="url(#warm)" opacity="${f1(glow * 90) / 100}"/>`;
  if (open > 0) {
    h += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="#FFFDF6"/>`;
    h += `<path d="M${x0} ${y1} L${x1} ${y1} L${f1(x1 + 420 * open)} 1080 L${f1(x0 - 300 * open)} 1080 Z" fill="#FFFBEA" opacity="${f1(open * 80) / 100}"/>`;   // light spilling on the floor
    for (let k = 0; k < 7; k++) { const a = -0.9 + k * 0.3 + Math.sin(t * 0.7 + k) * 0.04; h += `<path d="M${(x0 + x1) / 2} ${(y0 + y1) / 2} L${f1((x0 + x1) / 2 + Math.cos(a) * -900)} ${f1((y0 + y1) / 2 + Math.sin(a) * 900)}" stroke="#FFF3C4" stroke-width="${30 + k % 3 * 16}" opacity="${f1(open * 18) / 100}" stroke-linecap="round"/>`; }
    const pw = (x1 - x0) * (1 - 0.82 * open);   // the door leaf swings inward
    h += `<path d="M${x0} ${y0} L${f1(x0 + pw)} ${f1(y0 + 26 * open)} L${f1(x0 + pw)} ${f1(y1 - 20 * open)} L${x0} ${y1} Z" fill="#E9DFC9" stroke="${INK}" stroke-width="6"/>`;
  }
  const len = per * clamp(draw, 0, 1);
  h += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="none" stroke="#FFF6D6" stroke-width="22" opacity=".7" stroke-dasharray="${f1(len)} ${per}"/>`;
  h += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="none" stroke="${INK}" stroke-width="7" stroke-dasharray="${f1(len)} ${per}"/>`;
  if (draw > 0.95 && open === 0) h += `<circle cx="${x1 - 34}" cy="${(y0 + y1) / 2 + 30}" r="12" fill="#E8C468" stroke="${INK}" stroke-width="4"/>`;
  for (let k = 0; k < 14 && draw > 0; k++) { const ph = (t * 0.6 + k * 0.071) % 1, sx = x0 - 20 + ((k * 97) % (x1 - x0 + 40)), sy = y1 - ph * (y1 - y0 + 80);
    h += `<circle cx="${f1(sx)}" cy="${f1(sy)}" r="${3 + k % 3}" fill="#FFF3B0" opacity="${f1(Math.sin(ph * Math.PI) * draw * 90) / 100}"/>`; }
  return h;
}

function wbaseScene(t, lt, a) {
  const k0 = a.k || 0, D = a._dur || 3, again = k0 >= 5, k = again ? k0 - 5 : k0;
  let h = `<g filter="url(#dull)">` + roomWR(t, { lamp: true });
  const ex = again && k === 2 ? exprAt([[0, '지침'], [0.5 * D, '생각']], lt).expr : k === 1 ? '지침' : k === 4 ? '지친' : k === 3 ? '기본' : '지침';
  h += ZW({ t, seed: 41, x: 470, y: 742 + 108 * 0.95 - 6, s: 0.95, pose: '앉아폰', ex: exprAt([[0, ex]], t), look: k === 3 ? [0.4, 0.2] : [0.1, 0.35] });
  { const py = 742 + 108 * 0.95 - 6 + (362 - 560) * 0.95;
    h += `<circle cx="470" cy="${f1(py)}" r="80" fill="url(#screenGlow)" opacity=".7"/><rect x="452" y="${f1(py - 30)}" width="36" height="58" rx="7" fill="#2A2F3A" stroke="${INK}" stroke-width="4"/><rect x="457" y="${f1(py - 24)}" width="26" height="44" rx="3" fill="#BFE4FF"/>`;
    if (k === 2 && !again) h += pop(t, t - lt + fracOf13(t, '카드값') * D, t - lt + D * 0.45, 820, f1(py - 120), `<rect x="-150" y="-44" width="300" height="88" rx="16" fill="#fff" stroke="${INK}" stroke-width="4"/>` + T8(0, -8, '[카드] 결제 예정 안내', { size: 24, fill: NAVY }) + T8(0, 24, '잔액이 부족합니다', { size: 22, fill: RED }), { rot: -2 }); }
  if (again && k === 2) h += [0, 1, 2].map(n => `<circle cx="470" cy="600" r="${f1(120 + ((lt * 60 + n * 70) % 210))}" fill="none" stroke="#fff" stroke-width="5" opacity="${f1((1 - ((lt * 60 + n * 70) % 210) / 210) * 50) / 100}"/>`).join('');   // déjà vu ripple
  h += '</g>';
  if (k === 3) {   // the corner of the note — the one thing in colour, softly twinkling
    const tw = 0.5 + 0.5 * Math.sin(t * 5);
    h += `<path d="M1040 784 L1052 760 L1130 758 L1140 782 Z" fill="#FFFDF2" stroke="${INK}" stroke-width="3"/>`;
    h += `<path d="M1150 740 l6 -16 l6 16 l16 6 l-16 6 l-6 16 l-6 -16 l-16 -6 Z" fill="#FFE27A" opacity="${f1(tw * 100) / 100}"/>`;
  }
  return h;
}
function ctitleScene(t, lt, a) {
  let h = `<g filter="url(#dull)">` + roomWR(t, { lamp: true }) + `</g><rect x="-900" y="-600" width="3720" height="2300" fill="#1A1F33" opacity=".55"/>`;
  const L = TL.lines.find(l => l.scene === 'ctitle'), txt = (L && L.sub) || '';
  const [l1, l2] = txt.split(', ');
  h += pop(t, t - lt + 0.1, t + 99, 960, 470, outlined(0, 0, [[[l1 + ',', '#fff']], [[l2 || '', YEL]]], { size: 82, sw: 16, lh: 112 }), { noPop: true, inDur: 0.45 });
  return h;
}
function wnightScene(t, lt, a) {
  const k = a.k || 0, D = a._dur || 3;
  let h = `<g filter="url(#dull)">` + roomWR(t, { night: true, noPacket: true });
  // k0: crumple the packet, drop it in the bin; k1: murmur, looking up; k2: turns to the wall
  const drop = k === 0 ? prog(lt, 0.62 * D, 0.62 * D + 0.6) : 1;
  const pose = k === 0 ? (drop < 1 ? '폰보기' : '서기') : k === 2 ? '서기' : '서기';
  const ex = k === 0 ? '지친' : k === 1 ? '생각' : exprAt([[0, '기본'], [0.35 * D, '놀람']], lt).expr;
  h += ZW({ t, seed: 42, x: 1130, y: FLOOR - 4, s: 0.95, pose, ex: exprAt([[0, ex]], t), look: k === 1 ? [0, -0.5] : k === 2 ? [0.6, 0] : [0.3, 0.3] });
  if (k === 0) {
    const px = lerp(1130, 1300, drop), py = lerp(FLOOR - 4 - 228, 800, drop * drop), sq = 1 - 0.5 * prog(lt, 0.1 * D, 0.5 * D);
    if (drop < 1) h += `<g transform="translate(${f1(px)} ${f1(py)}) scale(${f1(sq)} ${f1(0.7 + 0.3 * sq)}) rotate(${f1(drop * 160)})"><path d="M-40 -10 Q-20 -34 20 -26 Q46 -10 36 16 Q0 34 -34 18 Z" fill="#D9573A" stroke="${INK}" stroke-width="5"/></g>`;
  }
  h += '</g>';
  if (k === 2) h += doorWR(t, prog(lt, 0.25 * D, 0.95 * D), 0, prog(lt, 0.4 * D, D));
  return h;
}
function wdoorScene(t, lt, a) {
  const k = a.k || 0, D = a._dur || 3;
  let h = `<g filter="url(#dull)">` + roomWR(t, { night: true, noPacket: true }) + '</g>';
  const open = k === 0 ? easeInOut(prog(lt, 0.1, 1.6)) : 1;
  h += doorWR(t, 1, Math.max(0.001, open), 1);
  if (k < 2) {
    const ex = k === 0 ? '놀람' : exprAt([[0, '놀람'], [0.3 * D, '생각']], lt).expr;
    h += ZW({ t, seed: 43, x: 1130, y: FLOOR - 4, s: 0.95, pose: '서기', ex: exprAt([[0, ex]], t), look: [0.7, -0.1] });
  } else {   // walks into the light, getting smaller, then the whole screen turns white
    const p = prog(lt, 0.3, D - 0.2), x = lerp(1130, 1612, easeInOut(p)), s = lerp(0.95, 0.7, p), y = lerp(FLOOR - 4, 860, p);
    h += `<g opacity="${f1((1 - prog(p, 0.75, 1)) * 100) / 100}">` + ZW({ t, seed: 43, x, y, s, pose: walkPose(lt * 7, 0.8), ex: exprAt([[0, '미소']], t), look: [0.8, 0] }) + '</g>';
    h += `<rect x="-900" y="-600" width="3720" height="2300" fill="#FFFDF6" opacity="${f1(prog(lt, D - 1.6, D + 0.2) * 100) / 100}"/>`;
  }
  return h;
}
// 템플릿 render 덮어쓰기 해제(014 HUD 금지)

/* ---------- landlord doctor (matches the pictures: white fluffy side hair, round glasses, brown cardigan) ---------- */
const DW = o => HALO(glasses13(char(Object.assign({ goggles: 'none', vest: '#9A6B42', patch: false, tee: true, vshade: 'rgba(60,30,0,0.25)', pencil: GLS13 }, o)), '#4A3A2A') +
  local17(Object.assign({ pose: '서기' }, o), `<g fill="#F4F4F2" stroke="${INK}" stroke-width="5"><circle cx="88" cy="150" r="30"/><circle cx="80" cy="190" r="24"/><circle cx="312" cy="150" r="30"/><circle cx="320" cy="190" r="24"/></g><path d="M200 262 L200 400" stroke="${INK}" stroke-width="4"/><circle cx="200" cy="300" r="5" fill="#5A3A1A"/><circle cx="200" cy="340" r="5" fill="#5A3A1A"/>`));
const mirrorWR = (x, svg) => `<g transform="translate(${2 * x} 0) scale(-1 1)">${svg}</g>`;
const earbudsWR = (x, y, s) => `<circle cx="${f1(x - 112 * s)}" cy="${f1(y - 390 * s)}" r="${f1(11 * s)}" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="${f1(x + 112 * s)}" cy="${f1(y - 390 * s)}" r="${f1(11 * s)}" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
function goBoardWR(x, y, s, stones = 0, t = 0) {   // wooden baduk board seen slightly from above
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-150 -40 L150 -40 L180 40 L-180 40 Z" fill="#D9AE6A" stroke="${INK}" stroke-width="6"/><rect x="-180" y="40" width="360" height="26" fill="#B98A4A" stroke="${INK}" stroke-width="6"/>`;
  for (let k = 1; k < 8; k++) { const u = k / 8; h += `<path d="M${f1(-150 - 30 * 0 + (300 + 60 * 0) * u - 150 * 0)} -40" />`; }
  for (let k = 1; k < 8; k++) { const u = k / 8, ya = -40 + 80 * u, xa = 150 + 30 * u; h += `<path d="M${f1(-xa)} ${f1(ya)} L${f1(xa)} ${f1(ya)}" stroke="#7A5A2A" stroke-width="2"/>`; const xb = -150 + 300 * u; h += `<path d="M${f1(xb)} -40 L${f1(xb * 1.2)} 40" stroke="#7A5A2A" stroke-width="2"/>`; }
  for (let n = 0; n < stones; n++) { const u = hash(n * 3.1) , v = hash(n * 7.7 + 1), yy = -34 + 68 * v, xx = (-140 + 280 * u) * (1 + 0.2 * (yy + 40) / 80); h += `<ellipse cx="${f1(xx)}" cy="${f1(yy)}" rx="11" ry="7" fill="${n % 2 ? '#fff' : '#222'}" stroke="${INK}" stroke-width="2"/>`; }
  return h + '</g>';
}

/* ---------- 계단: 윗집 주인 박사님과 바둑판 (k0~4) ---------- */
function stairsBgWR(t) {
  let h = `<defs>${DULL}</defs><rect x="-700" y="-400" width="3320" height="1900" fill="#CFE3F0"/>`;
  h += `<rect x="-700" y="120" width="1400" height="760" fill="#C98D6A"/>` + Array.from({ length: 22 }, (_, r) => Array.from({ length: 16 }, (_, c) => `<rect x="${-700 + c * 90 + (r % 2) * 45}" y="${120 + r * 35}" width="86" height="31" fill="none" stroke="#A86E50" stroke-width="3"/>`).join('')).join('');
  h += `<rect x="40" y="300" width="200" height="220" fill="#DCE8EE" stroke="${INK}" stroke-width="6"/><path d="M140 300 V520 M40 410 H240" stroke="${INK}" stroke-width="5"/>`;
  // concrete stairs rising to the right toward the upstairs door
  for (let k = 0; k < 7; k++) { const x = 700 + k * 110, y = FLOOR - (k + 1) * 50; h += `<rect x="${x}" y="${y}" width="${2000 - x}" height="${FLOOR - y}" fill="${k % 2 ? '#C9C6BE' : '#BDB9B0'}" stroke="${INK}" stroke-width="5"/>`; }
  h += `<path d="M720 ${FLOOR - 160} L1480 ${FLOOR - 510}" stroke="#6E6A62" stroke-width="10"/>` + [0, 1, 2, 3].map(k => `<path d="M${760 + k * 200} ${FLOOR - 180 - k * 92} V${FLOOR - 60 - k * 100}" stroke="#6E6A62" stroke-width="7"/>`).join('');
  h += `<rect x="1480" y="200" width="200" height="270" fill="#7C5A3E" stroke="${INK}" stroke-width="6"/><circle cx="1650" cy="340" r="9" fill="#E8C468"/>`;
  [[620, FLOOR], [1050, FLOOR - 200], [1300, FLOOR - 300]].forEach(([x, y], n) => h += `<path d="M${x - 34} ${y - 60} L${x + 34} ${y - 60} L${x + 24} ${y} L${x - 24} ${y} Z" fill="#C07850" stroke="${INK}" stroke-width="5"/><path d="M${x} ${y - 60} Q${x - 40} ${y - 120} ${x - 10} ${y - 140} M${x} ${y - 60} Q${x + 30} ${y - 130} ${x + 40} ${y - 110}" stroke="#5E8A4A" stroke-width="9" fill="none" stroke-linecap="round"/>`);
  h += `<rect x="-700" y="${FLOOR}" width="3320" height="700" fill="#B5B0A6"/><path d="M-700 ${FLOOR} H2620" stroke="${INK}" stroke-width="6"/>`;
  return h;
}
function wstairScene(t, lt, a) {
  const k = a.k || 0, D = a._dur || 3, step = FLOOR - 100;   // the doctor sits on the 2nd step (top at y = FLOOR-100)
  let h = `<g filter="url(#dull)">` + stairsBgWR(t);
  const dex = k === 3 ? '미소' : k === 1 ? '미소' : '기본';
  h += goBoardWR(1060, step - 22, 0.5, 0, t);
  const wipe = k === 0 ? Math.sin(t * 6) * 10 : 0;
  h += DW({ t, seed: 61, x: 905, y: step + 108 * 0.8 - 6, s: 0.8, pose: k === 0 ? '앉아손' : '앉기', ex: exprAt([[0, dex]], t), look: [-0.6, 0] });
  if (k === 0) h += `<rect x="${f1(1010 + wipe)}" y="${step - 48}" width="56" height="26" rx="6" fill="#F2F0E8" stroke="${INK}" stroke-width="4"/>`;
  // Zero: k0 walks in from the right (facing left), k1~3 stands, k4 earbuds in and walks off to the left
  let zx = 330, pose = '서기';
  if (k === 0) { const p = prog(lt, 0.4 * D, D); zx = lerp(-120, 330, 1 - (1 - p) * (1 - p)); if (p > 0 && p < 1) pose = walkPose(lt * 7, 0.9); }
  if (k === 4) { const p = prog(lt, 0.45 * D, D + 0.3); zx = lerp(330, -260, p); if (p > 0) pose = walkPose(lt * 7, 0.9); }
  const zex = k === 2 ? '지침' : k === 3 ? '지친' : '기본';
  const z = ZW({ t, seed: 62, x: zx, y: FLOOR - 4, s: 0.95, pose, ex: exprAt([[0, zex]], t), look: [0.6, 0] });
  h += k === 4 ? mirrorWR(zx, z + earbudsWR(zx, FLOOR - 4, 0.95)) : (k === 0 && pose !== '서기' ? z : z);
  h += '</g>';
  return h;
}

/* ---------- 출근길 지하철 · 사무실 (k0, k1) ---------- */
function wdayScene(t, lt, a) {
  const k = a.k || 0;
  let h = `<g filter="url(#dull)"><defs>${DULL}</defs>`;
  if (k === 0) {
    h += `<rect x="-700" y="-400" width="3320" height="1900" fill="#E8ECEE"/>`;
    for (let w = 0; w < 4; w++) { const x = 60 + w * 470; h += `<rect x="${x}" y="200" width="380" height="250" rx="20" fill="#3A4252" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2].map(n => `<path d="M${f1(x + ((t * 900 + n * 160 + w * 90) % 420) - 20)} 230 l-40 190" stroke="#5A6272" stroke-width="10" opacity=".6"/>`).join(''); }
    h += `<rect x="-700" y="150" width="3320" height="22" fill="#5BA35B"/><rect x="-700" y="700" width="3320" height="60" rx="12" fill="#6FAE7A" stroke="${INK}" stroke-width="5"/><rect x="-700" y="760" width="3320" height="40" fill="#5A8F66" stroke="${INK}" stroke-width="5"/>`;
    for (let x = -200; x < 2200; x += 420) h += `<path d="M${x} 80 V700" stroke="#B8BEC4" stroke-width="12"/>`;
    h += `<rect x="-700" y="${FLOOR}" width="3320" height="700" fill="#9CA3A8"/>`;
    const seats = [240, 520, 800, 1080, 1360, 1640];
    seats.forEach((x, n) => { const me = n === 0; const f = me ? ZW : (o => HALO(char(Object.assign({ goggles: 'none', vest: ['#8A7A6A', '#6A7A8A', '#7A6A8A', '#6A8A7A', '#8A8A6A'][n - 1], patch: false, tee: true, hair: n % 2 ? '#3A3A3A' : null }, o))));
      h += f({ t, seed: 70 + n, x, y: 700 + 108 * 0.82 - 4, s: 0.82, pose: '앉아폰', ex: exprAt([[0, me ? '지침' : '기본']], t), look: [0, 0.4] }); });
    h += [0, 1, 2, 3, 4].map(n => `<rect x="${f1(1040 + n * 120 - 22)}" y="20" width="44" height="70" rx="8" fill="none" stroke="#9CA3A8" stroke-width="7"/>`).join('');
  } else {
    h += `<rect x="-700" y="-400" width="3320" height="1900" fill="#E9E6DE"/><rect x="1180" y="170" width="640" height="380" fill="#F4C79A" stroke="${INK}" stroke-width="6"/><circle cx="1500" cy="480" r="70" fill="#F29A5A"/><path d="M1180 360 H1820 M1500 170 V550" stroke="${INK}" stroke-width="5"/>`;
    h += `<circle cx="900" cy="220" r="56" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M900 220 V186 M900 220 L924 232" stroke="${INK}" stroke-width="5"/>`;
    h += `<rect x="-700" y="${FLOOR}" width="3320" height="700" fill="#BDB6A8"/>`;
    h += `<rect x="420" y="700" width="760" height="24" fill="#B08A5E" stroke="${INK}" stroke-width="6"/><path d="M450 724 V${FLOOR} M1150 724 V${FLOOR}" stroke="${INK}" stroke-width="10"/>`;
    h += `<rect x="640" y="470" width="360" height="230" rx="10" fill="#2A2F3A" stroke="${INK}" stroke-width="6"/><rect x="656" y="486" width="328" height="198" fill="#F7F7F2"/>` +
      Array.from({ length: 8 }, (_, r) => `<path d="M656 ${486 + r * 25} H984" stroke="#C9CDD2" stroke-width="2"/>`).join('') + Array.from({ length: 6 }, (_, c) => `<path d="M${656 + c * 55} 486 V684" stroke="#C9CDD2" stroke-width="2"/>`).join('') +
      `<rect x="${f1(656 + 55 * Math.floor((t * 1.3) % 6))}" y="${f1(486 + 25 * Math.floor((t * 0.6) % 8))}" width="55" height="25" fill="#9FC5E8" opacity=".7"/>`;
    h += chair12(540, FLOOR - 4, 0.92) + ZW({ t, seed: 75, x: 540, y: FLOOR - 4, s: 0.92, pose: '앉아턱', ex: exprAt([[0, '지침']], t), look: [0.5, 0.2] });
  }
  return h + '</g>';
}

/* ---------- 1,000년째: 색이 다 빠진 흰 공간 (스틱맨) ---------- */
function voidWR(t) { return `<rect x="-700" y="-400" width="3320" height="1900" fill="#FAF9F5"/><ellipse cx="760" cy="${FLOOR + 6}" rx="300" ry="22" fill="#000" opacity=".05"/>`; }
const ZV = o => ZW(Object.assign({ vest: '#F2F2EE', vshade: 'rgba(0,0,0,0.06)' }, o));
const RULES = ['하나. 다 잊을 것', '둘. 몸은 약하게', '셋. 돈은 늘 조금 모자라게', '넷. 내일을 모르게', '다섯. 좋아하는 사람은 언젠가 떠나게'];
function rulesPaperWR(t, n, lt, op = 1) {
  let h = `<g transform="translate(1320 470) rotate(-2)" opacity="${op}"><rect x="-330" y="-300" width="660" height="600" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
  for (let r = 0; r < 5; r++) h += `<path d="M-290 ${-190 + r * 100} H290" stroke="#E2E0D8" stroke-width="3"/>`;
  for (let r = 0; r < n; r++) {
    const txt = RULES[r], last = r === n - 1, show = last ? Math.floor(txt.length * clamp(lt / 1.6, 0, 1)) : txt.length;
    h += `<text x="-290" y="${-205 + r * 100}" font-family="'Nanum Pen Script', ${FONT}" font-size="${r === 4 ? 54 : 62}" font-weight="700" fill="${NAVY}">${txt.slice(0, show)}</text>`;
  }
  return h + '</g>';
}
function wrulesScene(t, lt, a) {
  const k = a.k || 0, D = a._dur || 3;
  const n = k === 0 ? 0 : k <= 4 ? k : k === 5 ? 4 : 5;
  let h = voidWR(t) + rulesPaperWR(t, n, k === 5 ? 9 : k === 7 ? 9 : lt);
  const ex = k === 6 ? '울먹' : k === 5 ? '생각' : k === 7 ? exprAt([[0, '기본'], [0.35 * D, '미소']], lt).expr : '기본';
  const writing = k >= 1 && k <= 4 && lt < 1.8, wob = writing ? Math.sin(t * 22) * 6 : 0;
  h += ZV({ t, seed: 80, x: 820, y: FLOOR - 4, s: 1.0, pose: k === 0 || k === 7 || k === 6 ? '서기' : '문고리', ex: exprAt([[0, ex]], t), look: [0.6, 0] });
  if (!(k === 0 || k === 7 || k === 6)) h += `<path d="M${f1(1000 + wob)} ${f1(FLOOR - 4 - 222 + wob * 0.4)} l26 -40" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>`;
  return h;
}
function wnoteScene(t, lt, a) {
  const k = a.k || 0, D = a._dur || 3;
  let h = voidWR(t);
  if (k >= 1) {   // "이번에도요?" — faint stacks of the very same rule sheets, behind him, as far as the eye can see
    const op = k === 1 ? prog(lt, 0.2, 1.4) : 1;
    for (let n = 0; n < 26; n++) { const x = 100 + (n * 233) % 1800, y = 300 + (n * 97) % 420, s = 0.18 + (n % 4) * 0.05;
      h += `<g transform="translate(${x} ${y}) scale(${s}) rotate(${(n % 5) - 2})" opacity="${f1(op * (0.1 + (n % 3) * 0.05) * 100) / 100}"><rect x="-330" y="-300" width="660" height="600" fill="#fff" stroke="${INK}" stroke-width="8"/>${[0, 1, 2, 3, 4].map(r => `<path d="M-290 ${-200 + r * 100} H${f1(150 - (r * 37 % 90))}" stroke="${NAVY}" stroke-width="16"/>`).join('')}</g>`; }
  }
  h += rulesPaperWR(t, 5, 9, k >= 2 ? 0.35 : 1);
  const pose = k === 0 ? '폰보기' : k === 2 ? (lt < 0.5 * D ? '폰보기' : '서기') : '서기';
  const ex = k === 1 ? '생각' : k === 3 ? exprAt([[0, '기본'], [0.5 * D, '미소']], lt).expr : '기본';
  h += ZV({ t, seed: 81, x: 760, y: FLOOR - 4, s: 1.0, pose, ex: exprAt([[0, ex]], t), look: k === 1 ? [-0.4, 0] : [0.3, 0.3] });
  if (k === 0 || (k === 2 && lt < 0.5 * D)) h += `<rect x="742" y="${f1(FLOOR - 4 - 238)}" width="40" height="30" fill="#FFFDF2" stroke="${INK}" stroke-width="3" transform="rotate(-6 762 ${FLOOR - 225})"/>`;
  return h;
}
function wshrinkScene(t, lt, a) {
  const D = a._dur || 4, p = prog(lt, 0.4, D - 0.4), s = lerp(1.0, 0.012, easeInOut(p));
  let h = voidWR(t);
  h += ZV({ t, seed: 82, x: 960, y: lerp(FLOOR - 4, 600, p), s, pose: '서기', ex: exprAt([[0, '미소']], t), look: [0, 0] });
  if (p > 0.9) h += `<circle cx="960" cy="600" r="${f1(6 * (1 - prog(lt, D - 0.5, D)))}" fill="${INK}"/>`;
  h += `<rect x="-700" y="-400" width="3320" height="1900" fill="#000" opacity="${f1(prog(lt, D - 0.6, D + 0.3) * 100) / 100}"/>`;   // blackout before the alarm
  return h;
}

/* ---------- 같은 아침: 쪽지 (k0~2, 아직 스틱맨) ---------- */
function wmemoScene(t, lt, a) {
  const k = a.k || 0, D = a._dur || 3;
  let h = `<g filter="url(#dull)">` + roomWR(t, { lamp: true, noPacket: true });
  const zx = 1190;
  if (k === 0) {
    const lift = prog(lt, 0.1 * D, 0.4 * D), fall = prog(lt, 0.45 * D, 0.75 * D);
    h += ZW({ t, seed: 90, x: zx, y: FLOOR - 4, s: 0.95, pose: lift > 0 ? '폰보기' : '서기', ex: exprAt([[0, '지침'], [0.5 * D, '놀람']], lt), look: [0.4, 0.6] });
    const px = lerp(1060, zx, lift), py = lerp(768, FLOOR - 4 - 230, lift);
    h += `<path transform="translate(${f1(px)} ${f1(py)})" d="M-50 10 Q-30 -24 10 -20 Q60 -30 90 -8 Q60 18 0 14 Z" fill="#D9573A" stroke="${INK}" stroke-width="5"/>`;
    h += '</g>';
    const nx = lerp(px + 20, 1110, fall), ny = lerp(py, 852, fall * fall), rot = fall * 220;
    h += `<g transform="translate(${f1(nx)} ${f1(ny)}) rotate(${f1(rot)})"><rect x="-26" y="-18" width="52" height="36" fill="#FFFDF2" stroke="${INK}" stroke-width="3"/></g>`;   // the note — in colour
    return h;
  }
  if (k === 1) {
    h += ZW({ t, seed: 90, x: zx, y: FLOOR - 4, s: 0.95, pose: '폰보기', ex: exprAt([[0, '생각']], t), look: [0, 0.5] }) + '</g>';
    h += `<g transform="translate(${zx} ${FLOOR - 4 - 236}) rotate(-4)"><rect x="-44" y="-30" width="88" height="60" fill="#FFFDF2" stroke="${INK}" stroke-width="3"/><path d="M-30 -10 h50 M-30 6 h60" stroke="${NAVY}" stroke-width="4" opacity=".7"/></g>`;
    return h;
  }
  // k2: the note itself, full colour, over the grey room
  h += '</g><rect x="-700" y="-400" width="3320" height="1900" fill="#1A1F33" opacity=".35"/>';
  h += pop(t, t - lt + 0.1, t + 99, 960, 500, `<g transform="rotate(-3)"><rect x="-430" y="-200" width="860" height="400" fill="#FFFBEA" stroke="${INK}" stroke-width="6"/><path d="M-430 -10 H430" stroke="#E8DFC4" stroke-width="4"/>` +
    `<text x="0" y="-60" text-anchor="middle" font-family="'Nanum Pen Script', ${FONT}" font-size="92" fill="${NAVY}">이번엔 천천히 해 봐.</text><text x="0" y="90" text-anchor="middle" font-family="'Nanum Pen Script', ${FONT}" font-size="92" fill="${NAVY}">네가 고른 거야.</text></g>`, { inDur: 0.4 });
  return h;
}
Object.assign(CAMS, { wstair: [1.12, 1.18, 760, 560], wday: [1.12, 1.18, 900, 560], wrules: [1.0, 1.08, 1000, 560], wnote: [1.0, 1.06, 960, 560], wshrink: 'fixed', wmemo: [1.16, 1.24, 920, 560] });

/* ---------- HUD: '방에 들어온 지 ○' (그림·흰 공간 모두) ---------- */
function hudWR(t) {
  const L = TL.lines; let i = 0; while (i + 1 < L.length && t >= L[i + 1].t0 - 0.15) i++;
  const c = L[i] && L[i].args && L[i].args.count; if (!c) return '';
  let j = i; while (j > 0 && L[j - 1].args && L[j - 1].args.count === c) j--;
  const t0 = L[j].t0 - 0.15, k = clamp((t - t0) / 0.5, 0, 1), big = clamp(1 - (t - t0 - 1.6) / 0.6, 0, 1);   // each new count lands big in the middle, then settles top-right
  const x = lerp(1690, 960, big), y = lerp(80, 300, big), sc = lerp(1, 2.1, big);
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc)})" opacity="${f1(k * 100) / 100}"><rect x="-210" y="-36" width="420" height="72" rx="36" fill="${NAVY}" opacity=".82"/>` + T8(0, 13, '방에 들어온 지  ' + c, { size: 34, fill: '#fff' }) + '</g>';
}
render = function (t) { _render12(t); const h = hudWR(t); if (h) document.getElementById('v').insertAdjacentHTML('beforeend', h); };
window.render = render;
