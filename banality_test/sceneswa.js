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
const tickStep = t => Math.floor(t) + Math.min(1, (t % 1) / 0.12);   // jumps once a second, like a clock hand
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
  const hy = lerp(378, 250, up), hx = lerp(300, 318, up);
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
  h += `<circle cx="1180" cy="${712 - done * 9 + 4}" r="7" fill="#C8423A" opacity=".85"/>`;   // the red stamp mark — the only red on the desk
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
  h += COATB({ t, seed: 95, x: 1240, y: 930, s: 1.0, pose: '서기', ex: exprAt([[0, '기본']], t), look: [-0.5, 0.1] });
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
  if (k === 2) h += T8(960, 230, '15V → 450V · 30단계', { size: 40, fill: '#fff' });
  if (k === 3) h += `<rect x="1585" y="262" width="150" height="170" fill="#FF4A3A" opacity="${f1((0.2 + 0.2 * Math.sin(t * 20)) * 100) / 100}"/>`;   // the door window flashes
  return h;
}
render = function (t) { _render12(t); };
window.render = render;
