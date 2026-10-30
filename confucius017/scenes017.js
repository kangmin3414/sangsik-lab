/* ---------- experiment 017: the likeable talker — Confucius' way of conversation ---------- */
// One image all the way: conversation = a game of catch. Zero hugs the ball (talks alone); a follow-up question throws it back.
// People:
//   공자 (Confucius): tall black cap (冠) over a topknot, long black beard, deep-navy robe over a cream inner robe; carries bamboo slips (竹簡).
//     Kept clearly apart from 016's Mencius (grey beard, brown robe) and 008's Zhuangzi (white beard, green robe).
//   재여 (Zai Yu): young disciple, black topknot, no beard, tan robe; usually sleepy.
//   제로 + 소품: a fake long black beard tied with strings over the ears, and a bundle of bamboo slips.
//   하린: coworker who loves hiking — dark ponytail, forest-green fleece.
//   수아: the blind date — long brown hair, peach knit, a small pale-yellow hairpin.
//   할머니 (회상): grey curly perm, reading glasses, plum cardigan.
//   팀장: same as 016 (grey-blue jacket, navy tie).

const ZB17 = { goggles: 'none', vest: TEE, patch: false, tee: true, vshade: 'rgba(150,60,0,0.22)', topknot: false, robe: false };
// wrap SVG drawn in a character's local 400x560 frame into that character's on-screen transform
function local17(o, inner) {
  const s = o.s || 1, p = typeof o.pose === 'string' ? P[o.pose] : (o.pose || P['서기']);
  return `<g transform="translate(${f1(o.x)} ${f1(o.y)}) rotate(${f1(o.rot || 0)}) scale(${s}) translate(-200 -560) translate(0 ${f1((p && p.dy) || 0)})">${inner}</g>`;
}
function bamboo17(x, y, s, open = 0) { // bundle of bamboo slips; open 0 = rolled, 1 = spread
  const n = 7, w = 16 + 8 * open;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s)})">`;
  for (let i = 0; i < n; i++) { const dx = (i - (n - 1) / 2) * w; h += `<rect x="${f1(dx - 7)}" y="-46" width="14" height="92" rx="4" fill="${i % 2 ? '#E2C27A' : '#D6B266'}" stroke="${INK}" stroke-width="3.5"/>`; if (open > 0.5) h += `<path d="M${f1(dx - 3)} -30 h6 M${f1(dx - 3)} -14 h6 M${f1(dx - 3)} 2 h6 M${f1(dx - 3)} 18 h6" stroke="#5A4630" stroke-width="2.5"/>`; }
  h += `<path d="M${f1(-n * w / 2)} -24 H${f1(n * w / 2)} M${f1(-n * w / 2)} 24 H${f1(n * w / 2)}" stroke="#7A4E2A" stroke-width="4"/>`;
  return h + '</g>';
}
function ball17(x, y, r = 34, glow = 0) {
  let h = glow ? `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 2.4)}" fill="url(#warm)" opacity="${f1(glow * 100) / 100}"/>` : '';
  return h + `<g transform="translate(${f1(x)} ${f1(y)})"><circle r="${r}" fill="#FFF6E0" stroke="${INK}" stroke-width="6"/><path d="M${-r * 0.92} ${-r * 0.3} Q0 ${r * 0.25} ${r * 0.92} ${-r * 0.3}" fill="none" stroke="${RED}" stroke-width="5"/><path d="M${-r * 0.92} ${r * 0.3} Q0 ${-r * 0.25} ${r * 0.92} ${r * 0.3}" fill="none" stroke="${RED}" stroke-width="5" opacity=".6"/></g>`;
}

// 공자: tall black cap, topknot, long black beard, navy robe
const KZ = o => HALO(char(Object.assign({ goggles: 'none', vest: '#34477A', patch: false, tee: true, vshade: 'rgba(0,0,30,0.28)', topknot: '#1E1E1E', guan: '#15161C', longBeard: '#2A2A2A', robe: '#E8DFC8' }, o)));
// 재여: young disciple
const JY = o => HALO(char(Object.assign({ goggles: 'none', vest: '#D9C49A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.12)', topknot: '#1E1E1E', robe: '#A07A45' }, o)));
// 제로 + fake beard (strings over the ears)
const ZK = o => {
  const q = Object.assign({}, ZB17, { longBeard: '#2B2B2B' }, o);
  return HALO(char(q) + local17(q, `<path d="M158 238 Q120 226 92 186 M242 238 Q280 226 308 186" fill="none" stroke="#F4F1EA" stroke-width="5" stroke-linecap="round"/><path d="M158 238 Q120 226 92 186 M242 238 Q280 226 308 186" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linecap="round" opacity=".5"/>`));
};
// 하린: ponytail (behind the head) + green fleece
const HR = o => {
  const q = Object.assign({ goggles: 'none', vest: '#3E8E5E', patch: false, tee: true, vshade: 'rgba(0,40,10,0.25)', hair: '#2A1E18', lashes: true }, o);
  const tail = local17(q, `<path d="M276 96 Q352 86 360 160 Q366 222 334 262 Q344 200 318 160 Q300 128 270 122 Z" fill="#2A1E18" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><circle cx="282" cy="104" r="13" fill="#F2C14E" stroke="${INK}" stroke-width="4"/>`);
  return HALO(tail + char(q) + local17(q, `<path d="M200 262 L200 400" stroke="#2A6A44" stroke-width="5"/><rect x="194" y="268" width="12" height="18" rx="3" fill="#D9D9D9" stroke="${INK}" stroke-width="2.5"/>`));
};
// 수아: long brown hair, peach knit, small hairpin
const SA = o => HALO(char(Object.assign({ goggles: 'none', vest: '#F2B9A2', patch: false, tee: true, vshade: 'rgba(120,40,20,0.18)', hair: '#4A3226', longHair: '#4A3226', lashes: true, ribbon: '#F7E3A0' }, o)));
// 할머니: grey curly perm (013's perm in grey), reading glasses, plum cardigan
const GM = o => HALO(glasses13(perm13(char(Object.assign({ goggles: 'none', vest: '#8C5A86', patch: false, tee: true, vshade: 'rgba(60,0,50,0.22)', hair: PERM13, longHair: PERMB13, pencil: GLS13 }, o))), '#7A6A5A')
  .split('#3B2C25').join('#C9C5BD').split('#2E221D').join('#B5B0A6').split('#5A463C').join('#9C968C'));
// 팀장 (016)
const TL17 = o => HALO(char(Object.assign({ goggles: 'none', vest: '#55657A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.22)', collar: true, tie: '#2E4057', hair: '#2B2B2B' }, o)));

Object.assign(CAMS, {});
