/* ---------- experiment 014: alone but lonely — Schopenhauer's porcupines, the right distance ---------- */
// Schopenhauer: bald crown, two big white tufts at the temples, dark frock coat, white collar.
// 서준 (Seojun): Zero's university friend, short black hair, navy jacket. Guard: grey hair, olive uniform.
// Poodle (Atman): white, pompom puffs. Porcupines of the parable: drawn as round brown hedgehogs (the Korean '고슴도치').

function tufts14() { // white side tufts, unioned like a cloud (ink rims first, fills on top)
  const L = [[96, 112, 22], [80, 136, 28], [68, 164, 30], [70, 194, 27], [86, 218, 22], [60, 140, 20], [54, 176, 20]];
  const cs = L.concat(L.map(([x, y, r]) => [400 - x, y, r]));
  let h = cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 6}" fill="${INK}"/>`).join('');
  h += cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#F1F1EE"/>`).join('');
  h += `<g fill="none" stroke="#C9C9C4" stroke-width="4" stroke-linecap="round"><path d="M64 150 q10 -8 20 0 M58 184 q10 -8 20 0 M76 210 q8 -6 16 0 M336 150 q-10 -8 -20 0 M342 184 q-10 -8 -20 0 M324 210 q-8 -6 -16 0"/></g>`;
  return h;
}
function sch14(svg) { // add the tufts right after the head outline so they sit over its edge
  return svg.replace(/(<ellipse cx="200" cy="170" rx="118" ry="112" fill="none" stroke="#141414" stroke-width="8"\/>)/, '$1' + tufts14());
}
const SCH = o => HALO(sch14(char(Object.assign({ goggles: 'none', vest: '#2F3442', patch: false, tee: true, vshade: 'rgba(0,0,0,0.3)', collar: true, tie: '#E9E5DA' }, o))));
const SJ = o => HALO(char(Object.assign({ goggles: 'none', vest: '#3E5C84', patch: false, tee: true, vshade: 'rgba(0,20,60,0.25)', hair: '#2B2B2B' }, o)));
const GD = o => HALO(char(Object.assign({ goggles: 'none', vest: '#6A7A5C', patch: false, tee: true, vshade: 'rgba(0,0,0,0.22)', hair: '#9A9A9A' }, o)));

function poodle14(x, y, s, t, o = {}) { // white poodle standing, (x, y) = ground centre, faces right (o.flip = left)
  const bob = o.still ? 0 : Math.sin(t * 6 + (o.seed || 0)) * 3, wag = o.still ? 0 : Math.sin(t * 9) * 10;
  const puff = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r + 5}" fill="${INK}"/>`;
  const fill = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FAF8F2"/>`;
  const P = [[-70, -150, 34], [-30, -158, 40], [10, -150, 34], [56, -196, 34], [70, -236, 30], [44, -250, 22], [92, -182, 18], [-92, -192, 18],
             [-64, -40, 20], [-24, -40, 20], [28, -40, 20], [62, -40, 20]];
  let legs = '';
  [[-64], [-24], [28], [62]].forEach(([lx]) => { legs += `<rect x="${lx - 8}" y="-110" width="16" height="70" rx="8" fill="#FAF8F2" stroke="${INK}" stroke-width="5"/>`; });
  let h = `<g transform="translate(${f1(x)} ${f1(y + bob)}) scale(${o.flip ? -s : s} ${s})">${legs}`;
  h += `<g transform="rotate(${f1(wag)} -92 -170)">${puff(-92, -192, 18)}${fill(-92, -192, 18)}<line x1="-80" y1="-170" x2="-92" y2="-186" stroke="${INK}" stroke-width="5"/></g>`;
  h += P.filter((_, i) => i !== 7).map(([a, b, r]) => puff(a, b, r)).join('') + P.filter((_, i) => i !== 7).map(([a, b, r]) => fill(a, b, r)).join('');
  h += `<ellipse cx="96" cy="-222" rx="16" ry="12" fill="#FAF8F2" stroke="${INK}" stroke-width="5"/><circle cx="108" cy="-224" r="5" fill="${INK}"/><circle cx="74" cy="-236" r="5" fill="${INK}"/>`;
  h += `<path d="M48 -214 q-14 26 -2 44" fill="none" stroke="#D8D4C8" stroke-width="5" stroke-linecap="round"/></g>`;
  return h;
}

function hog14(x, y, s, t, o = {}) { // round hedgehog, (x, y) = ground centre; o.flip faces left; o.ouch flinch; o.cold shiver; o.ex 'sad'|'happy'
  const sh = o.cold ? Math.sin(t * 40 + (o.seed || 0)) * 3 : 0, fl = o.ouch ? -10 * o.ouch : 0;
  let spikes = '';
  for (let k = 0; k <= 16; k++) {
    const a = Math.PI * (1.02 + 0.96 * k / 16), r0 = 92, r1 = 132 + (k % 2 ? 0 : 14);
    const a2 = a + 0.08, a3 = a - 0.08;
    spikes += `<path d="M${f1(Math.cos(a3) * r0)} ${f1(-60 + Math.sin(a3) * r0)} L${f1(Math.cos(a) * r1)} ${f1(-60 + Math.sin(a) * r1)} L${f1(Math.cos(a2) * r0)} ${f1(-60 + Math.sin(a2) * r0)} Z" fill="#6B4A32" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  }
  const happy = o.ex === 'happy', sad = o.ex === 'sad';
  let h = `<g transform="translate(${f1(x + sh)} ${f1(y)}) scale(${o.flip ? -s : s} ${s}) translate(${fl} 0)">`;
  h += `<ellipse cx="0" cy="6" rx="110" ry="16" fill="#000" opacity=".18"/>` + spikes;
  h += `<path d="M-104 0 Q-110 -150 0 -158 Q110 -150 104 0 Z" fill="#8A6244" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  h += `<path d="M30 0 Q24 -96 92 -104 Q140 -92 136 -40 Q132 0 96 0 Z" fill="#F2DEC0" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  h += `<circle cx="138" cy="-46" r="11" fill="${INK}"/>`;
  h += happy ? `<path d="M80 -70 q10 -10 20 0" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` : `<circle cx="90" cy="-68" r="8" fill="${INK}"/>`;
  if (sad) h += `<path d="M76 -88 L102 -80" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  h += happy ? `<path d="M104 -24 q12 10 24 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` : '';
  h += `<circle cx="70" cy="-40" r="10" fill="#F4A3A3" opacity=".6"/>`;
  h += `<rect x="-60" y="-6" width="26" height="14" rx="7" fill="#5A3E2A"/><rect x="40" y="-6" width="26" height="14" rx="7" fill="#5A3E2A"/>`;
  return h + '</g>';
}
