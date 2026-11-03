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
  const k = a.k || 0, D = a._dur || 3;
  let h = `<g filter="url(#dull)">` + roomWR(t, { lamp: true });
  const ex = k === 1 ? '지침' : k === 4 ? '지친' : k === 3 ? '기본' : '지침';
  h += ZW({ t, seed: 41, x: 470, y: 742 + 108 * 0.95 - 6, s: 0.95, pose: '앉아폰', ex: exprAt([[0, ex]], t), look: k === 3 ? [0.4, 0.2] : [0.1, 0.35] });
  { const py = 742 + 108 * 0.95 - 6 + (362 - 560) * 0.95;
    h += `<circle cx="470" cy="${f1(py)}" r="80" fill="url(#screenGlow)" opacity=".7"/><rect x="452" y="${f1(py - 30)}" width="36" height="58" rx="7" fill="#2A2F3A" stroke="${INK}" stroke-width="4"/><rect x="457" y="${f1(py - 24)}" width="26" height="44" rx="3" fill="#BFE4FF"/>`;
    if (k === 2) h += pop(t, t - lt + fracOf13(t, '카드값') * D, t - lt + D * 0.45, 820, f1(py - 120), `<rect x="-150" y="-44" width="300" height="88" rx="16" fill="#fff" stroke="${INK}" stroke-width="4"/>` + T8(0, -8, '[카드] 결제 예정 안내', { size: 24, fill: NAVY }) + T8(0, 24, '잔액이 부족합니다', { size: 22, fill: RED }), { rot: -2 }); }
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
render = function (t) { _render12(t); };
window.render = render;
