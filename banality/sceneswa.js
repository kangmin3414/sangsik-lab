/* ---------- 악의 평범성 · 샘플: 회색 톱니바퀴 세상, 주황색은 제로 하나 ----------
   사무실: 벽의 큰 톱니바퀴가 초침마다 '딱' 하고 6도씩 돈다. 제로는 그 박자에 맞춰 도장을 찍는다(초 단위, 소리와 같은 시각).
   배경은 dull 필터(무채색), 제로만 필터 밖에서 그린다. 머리에는 작은 놋쇠 톱니바퀴 모자. */
Object.assign(CAMS, { bdesk: [1.1, 1.18, 900, 560] });
function local17(o, inner) {
  const s = o.s || 1, p = typeof o.pose === 'string' ? P[o.pose] : (o.pose || P['서기']);
  return `<g transform="translate(${f1(o.x)} ${f1(o.y)}) rotate(${f1(o.rot || 0)}) scale(${s}) translate(-200 -560) translate(0 ${f1((p && p.dy) || 0)})">${inner}</g>`;
}
const FLOORB = 870;
const DULLB = `<filter id="dullb" x="-900" y="-600" width="3720" height="2300" filterUnits="userSpaceOnUse"><feColorMatrix type="saturate" values="0.08"/></filter>`;
function gearPath(r, teeth, depth) {
  let d = '';
  for (let k = 0; k < teeth * 2; k++) { const a0 = (k / (teeth * 2)) * Math.PI * 2, a1 = ((k + 1) / (teeth * 2)) * Math.PI * 2, rr = k % 2 ? r : r + depth;
    d += `${k ? 'L' : 'M'}${f1(Math.cos(a0) * rr)} ${f1(Math.sin(a0) * rr)} L${f1(Math.cos(a1) * rr)} ${f1(Math.sin(a1) * rr)} `; }
  return d + 'Z';
}
const STOPT = () => { const l = TL.lines.find(l => l.i === 48); return l ? l.t0 - 0.15 + 0.55 * (l.t1 - l.t0) : 1e9; };
const freezeB = t => t > STOPT();
const tickStep = t => { const u = Math.min(t, STOPT()); return Math.floor(u) + Math.min(1, (u % 1) / 0.12); };   // jumps once a second, like a clock hand; stops for good when the hat comes off
function gear(x, y, r, teeth, rot, fill) {
  return `<g transform="translate(${x} ${y}) rotate(${f1(rot)})"><path d="${gearPath(r, teeth, r * 0.16)}" fill="${fill}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><circle r="${f1(r * 0.28)}" fill="#8A8A8A" stroke="${INK}" stroke-width="5"/></g>`;
}
const gearHat = (o, t) => local17(o, `<g transform="translate(200 50) rotate(${f1(tickStep(t) * 12)})"><path d="${gearPath(30, 10, 9)}" fill="#C9A24A" stroke="${INK}" stroke-width="5"/><circle r="9" fill="#8A6A2A" stroke="${INK}" stroke-width="4"/></g>`);
// Zero: orange hoodie (the only colour) + gear hat
const ZB = o => HALO(char(Object.assign({ goggles: 'none', vest: '#F28C38', patch: false, tee: true, vshade: 'rgba(150,60,0,0.22)' }, o)) +
  local17(Object.assign({ pose: '서기' }, o), `<path d="M150 262 Q200 300 250 262" fill="none" stroke="${INK}" stroke-width="5"/><path d="M186 280 L186 318 M214 280 L214 318" stroke="#FFE0C0" stroke-width="5" stroke-linecap="round"/>`)) + (o.hat === false ? '' : gearHat(o, o.t));
const BOSSB = o => HALO(char(Object.assign({ goggles: 'none', vest: '#6E737C', patch: false, tee: true, collar: true, tie: '#3A3F48', hair: '#9A9A9A', vshade: 'rgba(0,0,0,0.25)' }, o)));
const COATB = o => HALO(char(Object.assign({ goggles: 'none', vest: '#D9DCDF', patch: false, tee: true, collar: true, hair: '#4A4A4A', vshade: 'rgba(0,0,0,0.18)' }, o)));
// stamping arm, synced to whole seconds: slam at t%1 ≈ 0, lifts after
function stampPose(t) {
  const ph = t % 1, up = ph < 0.1 ? 0 : Math.min(1, (ph - 0.1) / 0.35) * (ph > 0.75 ? 1 - (ph - 0.75) / 0.25 : 1);
  const hy = lerp(378, 318, up), hx = lerp(300, 306, up);
  return Object.assign({}, P['앉기'], { armR: [[252, 285], [lerp(292, 306, up), lerp(338, 290, up)], [hx, hy - 8]], hR: [hx, hy] });
}
function officeB(t) {
  let h = `<defs>${DULLB}</defs><rect x="-700" y="-400" width="3320" height="1900" fill="#C9CCD0"/>`;
  const st = tickStep(t);
  h += gear(1380, 360, 230, 18, st * 6, '#A8ABB0') + gear(1700, 640, 150, 12, -st * 9, '#9C9FA4') + gear(1060, 160, 120, 10, -st * 11, '#B0B3B8') + gear(320, 260, 170, 14, st * 8, '#A3A6AB');
  h += `<circle cx="760" cy="200" r="70" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M760 200 V150 M760 200 L${f1(760 + Math.sin(st * Math.PI / 30) * 58)} ${f1(200 - Math.cos(st * Math.PI / 30) * 58)}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  h += `<rect x="-700" y="${FLOORB}" width="3320" height="700" fill="#9EA2A8"/><path d="M-700 ${FLOORB} H2620" stroke="${INK}" stroke-width="6"/>`;
  return h;
}
function deskB(t, stamped) {   // desk with an inbox pile (shrinking) and the stamped pile (growing)
  let h = `<rect x="560" y="720" width="760" height="26" fill="#8F8A82" stroke="${INK}" stroke-width="6"/><path d="M590 746 V${FLOORB} M1290 746 V${FLOORB}" stroke="${INK}" stroke-width="10"/>`;
  const left = Math.max(2, 14 - stamped % 12), done = 2 + stamped % 12;
  for (let k = 0; k < left; k++) h += `<rect x="${640 + (k % 2) * 4}" y="${712 - k * 9}" width="150" height="9" fill="#F4F4F0" stroke="${INK}" stroke-width="2"/>`;
  for (let k = 0; k < done; k++) h += `<g><rect x="${1100 + (k % 2) * 5}" y="${712 - k * 9}" width="150" height="9" fill="#F4F4F0" stroke="${INK}" stroke-width="2"/></g>`;
  h += `<rect x="985" y="712" width="110" height="8" fill="#F4F4F0" stroke="${INK}" stroke-width="2"/>`;   // the sheet under the stamp
  if (t % 1 < 0.85 && !freezeB(t)) h += `<circle cx="1035" cy="712" r="8" fill="#C8423A" opacity=".9"/>`;   // fresh red mark — the only red on the desk
  return h;
}
function bdeskScene(t, lt, a) {
  const k = a.k || 0, D = a._dur || 3, stamped = Math.floor(t);
  let h = `<g filter="url(#dullb)">` + officeB(t) + '</g>';
  let boss = '';
  if (k === 1) {   // the team leader walks in from the right and drops a file
    const p = prog(lt, 0, 1.2), bx = lerp(2000, 1500, 1 - (1 - p) * (1 - p));
    boss = BOSSB({ t, seed: 91, x: bx, y: FLOORB - 4, s: 0.95, pose: p < 1 ? walkPose(lt * 7, 0.8) : '서기', ex: exprAt([[0, '기본']], t), look: [-0.6, 0] });
    boss = `<g transform="translate(${2 * bx} 0) scale(-1 1)">${boss}</g>`;
    const fp = prog(lt, 1.0, 1.6);
    if (fp > 0) h += `<rect x="${f1(lerp(1420, 820, fp))}" y="${f1(lerp(560, 690, fp) - Math.sin(fp * Math.PI) * 80)}" width="170" height="26" fill="#E8D9A8" stroke="${INK}" stroke-width="4" transform="rotate(${f1(-20 + fp * 20)} ${f1(lerp(1420, 820, fp) + 85)} 700)"/>`;
  }
  const bow = k === 1 && lt > 0.55 * D ? 16 : 0;
  const pose = k === 1 && lt > 0.5 * D ? '앉기' : stampPose(t);
  h += chair12(940, FLOORB - 4, 0.95) + ZB({ t, seed: 92, x: 940, y: FLOORB - 4, s: 0.95, pose, tilt: bow, ex: exprAt([[0, k === 1 && lt > 0.5 * D ? '미소' : '기본']], t), look: [0.35, 0.4] });
  h += `<g filter="url(#dullb)">` + deskB(t, stamped) + boss + '</g>';
  // the stamp itself in Zero's hand (follows the arm)
  if (!(k === 1 && lt > 0.5 * D)) { const p = stampPose(t), hx = 940 + (p.hR[0] - 200) * 0.95, hy = FLOORB - 4 + (p.hR[1] + 40 - 560) * 0.95;
    h += `<g transform="translate(${f1(hx)} ${f1(hy)})"><rect x="-12" y="-44" width="24" height="34" rx="8" fill="#5A3A2A" stroke="${INK}" stroke-width="4"/><rect x="-22" y="-12" width="44" height="16" rx="3" fill="#C8423A" stroke="${INK}" stroke-width="4"/></g>`; }
  return h;
}
/* ---------- 밀그램 실험실: 그림(H3) 위에 그리는 기계·사람·계기판 (aiwa.js에서 부름) ---------- */
function milgramOverlay(t, lt, a, D) {
  const v = a.volt || 15, idx = Math.round(v / 15);   // 1..30
  const k = a.k || 0, shake = v >= 150 ? Math.sin(t * 61) * 3 : 0;
  let h = `<g transform="translate(${f1(shake)} 0)">`;
  // experimenter behind Zero
  h += COATB({ t, seed: 95, x: 1470, y: 960, s: 1.08, pose: '폰보기', ex: exprAt([[0, '기본']], t), look: [-0.6, 0.1] }) + `<rect x="1438" y="700" width="64" height="84" rx="6" fill="#C9B48A" stroke="${INK}" stroke-width="4"/><rect x="1448" y="712" width="44" height="60" fill="#F4F4F0"/>`;
  // Zero seated, facing the panel (towards us)
  const zex = k === 2 ? '기본' : k === 3 ? '놀람' : k === 8 ? '걱정' : k === 4 ? '겁먹음' : '울먹';
  h += chair12(880, 930, 1.0) + ZB({ t, seed: 96, x: 880, y: 930, s: 1.0, pose: '앉아손', ex: exprAt([[0, zex]], t), look: k === 4 || k === 5 ? [0.8, -0.2] : [0, 0.5] });
  // the shock generator on a table in front: 30 switches, a needle gauge
  h += `<rect x="420" y="820" width="920" height="28" fill="#6A6058" stroke="${INK}" stroke-width="6"/><path d="M460 848 V1040 M1300 848 V1040" stroke="${INK}" stroke-width="12"/>`;
  h += `<rect x="470" y="712" width="820" height="108" rx="10" fill="#7A7F86" stroke="${INK}" stroke-width="7"/>`;
  for (let s = 1; s <= 30; s++) {
    const x = 500 + (s - 1) * 26.5, on = s <= idx, preview = k === 2 && s <= Math.floor(clamp((lt - 1) / (D - 1.5), 0, 1) * 30);
    h += `<rect x="${f1(x)}" y="772" width="16" height="30" rx="3" fill="${on ? '#E8E2D0' : '#3A3E44'}" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="${f1(x + 8)}" cy="756" r="6" fill="${on || preview ? (s >= 20 ? '#FF5A4A' : '#FFD27A') : '#2A2E34'}" opacity="${preview && !on ? 0.6 : 1}"/>`;
  }
  const ang = -60 + 120 * (idx - 1) / 29;
  h += `<g transform="translate(560 708) scale(.8)"><path d="M-70 0 A70 70 0 0 1 70 0" fill="#F2EEE2" stroke="${INK}" stroke-width="5"/><path d="M35 -61 A70 70 0 0 1 70 0" fill="none" stroke="#D9473A" stroke-width="10"/><path d="M0 0 L${f1(Math.sin(ang * Math.PI / 180) * 58)} ${f1(-Math.cos(ang * Math.PI / 180) * 58)}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g>`;
  h += '</g>';
  // big digital readout
  const hot = v >= 150;
  h += `<g transform="translate(960 120)"><rect x="-200" y="-72" width="400" height="144" rx="26" fill="#14161E" stroke="${hot ? '#FF5A4A' : '#8A92A0'}" stroke-width="7"/>` + T8(0, 34, `${v}V`, { size: 104, fill: v >= 300 ? '#FF5A4A' : '#FFD27A' }) + `</g>`;
  if (k === 2) h += `<rect x="760" y="206" width="400" height="56" rx="28" fill="#14161E" opacity=".85"/>` + T8(960, 246, '15V → 450V · 30단계', { size: 34, fill: '#fff' });
  if (k === 3) h += `<rect x="1585" y="262" width="150" height="170" fill="#FF4A3A" opacity="${f1((0.2 + 0.2 * Math.sin(t * 20)) * 100) / 100}"/>`;   // the door window flashes
  return h;
}

/* ================= 본편 장면 ================= */
const nightB = `<filter id="nightb" x="-900" y="-600" width="3720" height="2300" filterUnits="userSpaceOnUse"><feColorMatrix type="matrix" values="0.25 0.25 0.25 0 0  0.25 0.25 0.3 0 0.02  0.3 0.3 0.4 0 0.06  0 0 0 1 0"/></filter>`;
function bhomeScene(t, lt, a) {   // late night, the child asleep; Zero (still wearing the gear hat) strokes the child's head
  let h = `<defs>${DULLB}${nightB}</defs><g filter="url(#nightb)"><rect x="-700" y="-400" width="3320" height="1900" fill="#B9BEC8"/>`;
  h += `<rect x="1180" y="160" width="360" height="300" fill="#2E3A5A" stroke="${INK}" stroke-width="7"/><circle cx="1450" cy="240" r="34" fill="#F4F0DA"/><path d="M1360 160 V460 M1180 310 H1540" stroke="${INK}" stroke-width="6"/>`;
  h += `<rect x="-700" y="${FLOORB}" width="3320" height="700" fill="#8A8F98"/><path d="M-700 ${FLOORB} H2620" stroke="${INK}" stroke-width="6"/>`;
  h += `<rect x="520" y="740" width="600" height="130" rx="10" fill="#8E7A5E" stroke="${INK}" stroke-width="6"/><rect x="530" y="700" width="580" height="50" rx="18" fill="#EDEDED" stroke="${INK}" stroke-width="6"/>`;
  h += `<rect x="560" y="660" width="130" height="50" rx="22" fill="#F6F4EE" stroke="${INK}" stroke-width="5"/>`;   // pillow
  h += char({ t, seed: 97, x: 830, y: 700, s: 0.5, rot: -90, pose: '서기', ex: exprAt([[0, '졸림']], t), goggles: 'none', vest: '#9CB8D8', patch: false, tee: true, still: true, noBlink: true });   // the child lying down, head on the pillow
  h += `<path d="M700 655 Q880 620 1090 660 L1100 745 L700 745 Z" fill="#A9B6C8" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;   // blanket up to the chin
  h += `<circle cx="1000" cy="560" r="160" fill="url(#warm)" opacity=".55"/></g>`;
  const pat = Math.sin(t * 2.4) * 6;
  const pose = Object.assign({}, P['서기'], { armL: [[148, 285], [100, 330], [64 + pat, 352]], hL: [60 + pat, 354] });
  h += ZB({ t, seed: 98, x: 790, y: FLOORB - 4, s: 0.95, pose, ex: exprAt([[0, '미소']], t), look: [-0.6, 0.6], tilt: -8 });
  return h;
}
Object.assign(CAMS, { bhome: [1.1, 1.2, 860, 600], bstep: 'fixed', boffice: [1.1, 1.18, 960, 560], bbelt: [1.0, 1.06, 960, 540], bstop: [1.08, 1.16, 960, 560], bq: 'fixed', bcourt: [1.1, 1.18, 900, 560] });
function bcourtScene(t, lt, a) { return bdeskScene(t, lt, { k: 2, _dur: a._dur }); }   // lines 9~10 (no picture): back to Zero stamping
function bstepScene(t, lt, a) {
  const L = TL.lines.find(l => l.scene === 'bstep' && l.args.n === a.n), txt = (L && L.sub) || '';
  const [head, body] = txt.split(' · ');
  let h = `<rect x="-700" y="-400" width="3320" height="1900" fill="#1A1F33"/>` + gear(960, 470, 300, 20, tickStep(t) * 3, '#2A3150');
  h += pop(t, t - lt + 0.05, t + 99, 960, 400, label(0, 0, head, { size: 46, bg: '#F28C38' }), { inDur: 0.3 });
  h += pop(t, t - lt + 0.3, t + 99, 960, 560, outlined(0, 0, [[[body, '#fff']]], { size: 72, sw: 14 }), { inDur: 0.35 });
  return h;
}
function monitorB(x, y, txt, btn, glow) {
  let h = `<rect x="${x - 170}" y="${y - 130}" width="340" height="220" rx="12" fill="#2A2F3A" stroke="${INK}" stroke-width="6"/><rect x="${x - 156}" y="${y - 116}" width="312" height="192" fill="#F4F4F0"/>`;
  h += T8(x, y - 72, '보고서', { size: 28, fill: NAVY }) + T8(x, y - 30, txt, { size: 26, fill: '#C8423A' });
  h += `<path d="M${x - 130} ${y + 2} H${x + 130} M${x - 130} ${y + 22} H${x + 90}" stroke="#C9CDD2" stroke-width="5"/>`;
  if (btn) h += `<rect x="${x - 60}" y="${y + 36}" width="120" height="34" rx="8" fill="${glow ? '#FF5A4A' : '#C8423A'}" stroke="${INK}" stroke-width="3"/>` + T8(x, y + 62, '승인', { size: 24, fill: '#fff' });
  return h + `<rect x="${x - 20}" y="${y + 90}" width="40" height="40" fill="#555"/>`;
}
function bofficeScene(t, lt, a) {
  const k = a.k || 0, D = a._dur || 3;
  let h = `<g filter="url(#dullb)">` + officeB(t) + '</g>';
  const zex = k === 0 ? '기본' : k === 1 ? '걱정' : k === 2 ? '서운함' : '찡그림';
  h += chair12(820, FLOORB - 4, 0.95) + ZB({ t, seed: 99, x: 820, y: FLOORB - 4, s: 0.95, pose: k === 3 && lt > 0.5 * D ? '앉아손' : '앉기', ex: exprAt([[0, zex]], t), look: k === 1 || k === 2 ? [0.7, 0] : [0.4, 0.2] });
  const press = k === 3 && lt > 0.55 * D;
  h += `<g filter="url(#dullb)"><rect x="560" y="720" width="760" height="26" fill="#8F8A82" stroke="${INK}" stroke-width="6"/><path d="M590 746 V${FLOORB} M1290 746 V${FLOORB}" stroke="${INK}" stroke-width="10"/>` +
    (k >= 1 ? mirrorB(1500, BOSSB({ t, seed: 100, x: 1500, y: FLOORB - 4, s: 0.95, pose: k === 2 ? '팔짱' : '서기', ex: exprAt([[0, k === 2 ? '찡그림' : '기본']], t), look: [-0.6, 0] })) : '') + '</g>';
  h += monitorB(1150, 590, '안전성 검사: 생략', true, press);
  if (press) h += `<circle cx="1150" cy="642" r="${f1(30 + 40 * prog(lt, 0.55 * D, 0.55 * D + 0.4))}" fill="none" stroke="#FF5A4A" stroke-width="6" opacity="${f1((1 - prog(lt, 0.55 * D, 0.55 * D + 0.5)) * 100) / 100}"/>`;
  return h;
}
const mirrorB = (x, svg) => `<g transform="translate(${2 * x} 0) scale(-1 1)">${svg}</g>`;
function panelB(x, y, title, inner) {
  return `<g transform="translate(${x} ${y})"><rect x="-290" y="-260" width="580" height="520" rx="22" fill="#D6D9DD" stroke="${INK}" stroke-width="6"/>${inner}` + T8(0, 230, title, { size: 32, fill: NAVY }) + `</g>`;
}
function bbeltScene(t, lt, a) {
  const k = a.k || 0, D = a._dur || 3;
  if (k === 1) {   // three small jobs, three small switches
    const f = n => clamp((lt - [0, 0.33, 0.66][n] * D) / 0.4, 0, 1);
    let h = `<rect x="-700" y="-400" width="3320" height="1900" fill="#1A1F33"/>`;
    const p1 = `<g filter="url(#dullb)"><rect x="-160" y="-150" width="320" height="200" fill="#F4F4F0" stroke="${INK}" stroke-width="5"/><path d="M-130 20 L-60 -40 L0 -10 L60 -90 L130 -60" fill="none" stroke="${NAVY}" stroke-width="7"/><path d="M-140 -60 H140" stroke="#C8423A" stroke-width="5" stroke-dasharray="14 10"/></g>` +
      `<path d="M-140 ${f1(-60 + 50 * f(0))} H140" stroke="#FF5A4A" stroke-width="6"/>` + T8(0, 100, '기준치 ↓', { size: 34, fill: '#C8423A' });
    const p2 = HALO(char({ t, seed: 101, x: -70, y: 160, s: 0.42, pose: '내밀기', goggles: 'none', vest: '#6E737C', patch: false, tee: true, collar: true, ex: exprAt([[0, '미소']], t) })) + HALO(char({ t, seed: 102, x: 90, y: 160, s: 0.42, pose: '서기', goggles: 'none', vest: '#B8A890', patch: false, tee: true, hair: '#E0E0E0', ex: exprAt([[0, '기본']], t) })) + `<rect x="-30" y="0" width="60" height="44" fill="#F4F4F0" stroke="${INK}" stroke-width="4"/>`;
    const p3 = `<path d="M-200 150 H200 M-150 150 V-110 H150 V150" stroke="#8A8F98" stroke-width="16" fill="none"/><path d="M-150 -110 L150 150" stroke="#8A8F98" stroke-width="10"/>` + `<g opacity="${f1((1 - f(2)) * 100) / 100}"><path d="M-150 150 L150 -110" stroke="#F2B84B" stroke-width="10"/></g>` + T8(0, -150, '안전장치', { size: 30, fill: '#F2B84B' });
    h += [[380, '연구원', p1], [960, '판매원', p2], [1540, '관리자', p3]].map(([x, ti, inner], n) => `<g opacity="${f1(f(n) * 100) / 100}">${panelB(x, 480, ti, inner)}</g>`).join('');
    return h;
  }
  // k2, k5: late night, alone at the desk, telling himself it's fine
  let h = `<defs>${nightB}</defs><g filter="url(#nightb)">` + officeB(t) + '</g>';
  h += chair12(940, FLOORB - 4, 0.95) + ZB({ t, seed: 103, x: 940, y: FLOORB - 4, s: 0.95, pose: '앉아턱' in P ? '앉아턱' : '앉기', ex: exprAt([[0, '지친']], t), look: [0, 0.4] });
  h += `<g filter="url(#nightb)"><rect x="560" y="720" width="760" height="26" fill="#8F8A82" stroke="${INK}" stroke-width="6"/><path d="M590 746 V${FLOORB} M1290 746 V${FLOORB}" stroke="${INK}" stroke-width="10"/></g>` + monitorB(1290, 590, '승인 완료', false, false);
  return h;
}
P['앉아턱'] = P['앉아턱'] || Object.assign({}, P['앉기'], { armR: [[252, 290], [288, 332], [246, 292]], hR: [238, 284] });
function bstopScene(t, lt, a) {
  const k = a.k || 0, D = a._dur || 3;
  const hatOff = k >= 1 && !(k === 1 && lt < 0.55 * D);
  let h = `<g filter="url(#dullb)">` + officeB(t) + '</g>';
  const warm = k >= 4 ? prog(lt + (k === 5 ? 99 : 0), 0.5 * D, 0.5 * D + 2) : 0;
  if (warm > 0) h += `<rect x="-700" y="-400" width="3320" height="1900" fill="#FFD9A0" opacity="${f1(warm * 22) / 100}"/>`;
  if (k === 3) h += HALO(char({ t, seed: 104, x: 300, y: FLOORB - 4, s: 0.7, pose: '앉기', goggles: 'none', vest: '#7A6E8A', patch: false, tee: true, ex: exprAt([[0, '졸림']], t) })) + chair12(300, FLOORB - 4, 0.7) +
    `<path d="M240 ${FLOORB - 330} l-18 -40 l36 18 Z M360 ${FLOORB - 330} l18 -40 l-36 18 Z" fill="#9A3A3A" stroke="${INK}" stroke-width="4"/>` + T8(300, FLOORB - 400, 'Zzz', { size: 40, fill: NAVY });   // the lazy villain (horns!) dozing
  if (k === 6) for (let n = 0; n < 4; n++) { const x = 100 + n * 115, sp = stampPose(t * 1.6 + n * 0.25); h += chair12(x, FLOORB - 4, 0.45) + ZB({ t, seed: 110 + n, x, y: FLOORB - 4, s: 0.45, pose: sp, ex: exprAt([[0, '기본']], t), look: [0.3, 0.4], hat: true }); }
  if (k === 4 || k === 5) {   // standing in front of the team leader
    h += mirrorB(1450, BOSSB({ t, seed: 105, x: 1450, y: FLOORB - 4, s: 0.95, pose: '서기', ex: exprAt([[0, k === 5 ? '놀람' : '기본']], t), look: [-0.6, 0] }));
    h += ZB({ t, seed: 106, x: 1150, y: FLOORB - 4, s: 0.95, pose: '내밀기' in P ? '내밀기' : '서기', ex: exprAt([[0, '결심']], t), look: [0.6, 0], hat: false });
    h += `<rect x="1240" y="${FLOORB - 300}" width="70" height="90" fill="#F4F4F0" stroke="${INK}" stroke-width="4"/>`;
    return h;
  }
  const frozenUp = Object.assign({}, P['앉기'], { armR: [[252, 285], [306, 300], [312, 310]], hR: [312, 318] });
  h += chair12(940, FLOORB - 4, 0.95) + ZB({ t, seed: 107, x: 940, y: FLOORB - 4, s: 0.95, pose: frozenUp, ex: exprAt([[0, k === 0 ? '생각' : k === 2 ? '생각' : '결심']], t), look: [0.3, 0.4], hat: !hatOff });
  h += `<g filter="url(#dullb)">` + deskB(t, Math.floor(STOPT())) + '</g>';
  const hx = 940 + (312 - 200) * 0.95, hy = FLOORB - 4 + (318 + 40 - 560) * 0.95;
  h += `<g transform="translate(${f1(hx)} ${f1(hy)})"><rect x="-12" y="-44" width="24" height="34" rx="8" fill="#5A3A2A" stroke="${INK}" stroke-width="4"/><rect x="-22" y="-12" width="44" height="16" rx="3" fill="#C8423A" stroke="${INK}" stroke-width="4"/></g>`;
  if (hatOff) { const p = k === 1 ? prog(lt, 0.55 * D, 0.55 * D + 0.6) : 1, gx = lerp(940, 760, p), gy = lerp(FLOORB - 4 - 510 * 0.95, 700, p);
    h += `<g transform="translate(${f1(gx)} ${f1(gy)}) scale(.95)"><path d="${gearPath(30, 10, 9)}" fill="#C9A24A" stroke="${INK}" stroke-width="5"/><circle r="9" fill="#8A6A2A" stroke="${INK}" stroke-width="4"/></g>`; }
  if (k === 2) h += `<rect x="-700" y="-400" width="3320" height="1900" fill="#1A1F33" opacity=".55"/>` + typeCard(t, lt, ['위험한 생각이란 없다.', '생각한다는 것 자체가', '위험한 일이기 때문이다.'], '— 한나 아렌트, 1973년 인터뷰');
  return h;
}
function typeCard(t, lt, lines, sig) {   // a typewritten card, letters appear one by one
  const total = lines.join('').length, shown = Math.floor(clamp(lt / 2.6, 0, 1) * total); let acc = 0;
  let h = `<g transform="translate(960 470) rotate(-1.5)"><rect x="-560" y="-230" width="1120" height="460" fill="#F4EFE2" stroke="${INK}" stroke-width="6"/>`;
  lines.forEach((ln, j) => { const n = clamp(shown - acc, 0, ln.length); acc += ln.length;
    h += `<text x="-500" y="${-110 + j * 100}" font-family="'Nanum Myeongjo', 'Noto Serif CJK KR', serif" font-size="66" font-weight="700" fill="${NAVY}">${ln.slice(0, n)}</text>`; });
  if (sig) h += `<text x="500" y="190" text-anchor="end" font-family="'Noto Serif CJK KR', serif" font-size="34" fill="#6B6255">${sig}</text>`;
  return h + '</g>';
}
function bqScene(t, lt, a) {
  const q = a.q || 1, L = TL.lines.find(l => l.scene === 'bq' && l.args.q === q), sub = (L && L.sub) || '';
  const txt = q === 1 ? '이 일의 끝에는 누가 서 있는가?' : sub;
  let h = `<rect x="-700" y="-400" width="3320" height="1900" fill="#1A1F33"/>`;
  h += T8(960, 160, `질문 ${q}`, { size: 40, fill: '#F28C38' });
  const words = txt.length > 16 ? [txt.slice(0, txt.lastIndexOf(' ', 16) > 0 ? txt.lastIndexOf(' ', 16) : 16), txt.slice((txt.lastIndexOf(' ', 16) > 0 ? txt.lastIndexOf(' ', 16) : 16)).trim()] : [txt];
  h += typeCard(t, lt, words, '');
  h += ZB({ t, seed: 120, x: 260, y: 1000, s: 0.5, pose: '서기', ex: exprAt([[0, '생각']], t), look: [0.6, -0.3], hat: false });
  return h;
}
render = function (t) { _render12(t); };
window.render = render;
