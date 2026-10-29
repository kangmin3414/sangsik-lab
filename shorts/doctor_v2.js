/* ---------- THE DOCTOR v2: friendly scientist, same family as ZERO ---------- */
// feet anchor at (x, y); head centre sits at local (0, -668) like v1 so old framings still work
const DOC_EX = {
  '기본': { bL: [138, 150, 163, 140, 188, 148], bR: [212, 148, 237, 140, 262, 150], mouth: 'M186 246 Q200 256 214 246', eyes: 'dot' },
  '미소': { bL: [138, 144, 163, 132, 188, 142], bR: [212, 142, 237, 132, 262, 144], mouth: 'M182 244 Q200 262 218 244', eyes: 'happy' },
  '진지': { bL: [138, 150, 163, 152, 188, 160], bR: [212, 160, 237, 152, 262, 150], mouth: 'M188 250 L212 250', eyes: 'dot' },
  '놀람': { bL: [138, 132, 163, 116, 188, 128], bR: [212, 128, 237, 116, 262, 132], mouth: 'O', eyes: 'wide' },
  '당황': { bL: [140, 158, 163, 144, 186, 136], bR: [214, 136, 237, 144, 260, 158], mouth: 'M184 252 L190 246 L196 252 L202 246 L208 252 L214 246', eyes: 'wide', sweat: true }
};
function doctor(x, y, s, o = {}) {
  const t = o.t || 0, seed = o.seed || 77;
  const glass = o.glass || MINT;
  const alert = glass === RED;
  const exName = o.expr || (alert ? '당황' : '기본');
  const ex = DOC_EX[exName] || DOC_EX['기본'];
  const shake = o.shake ? Math.sin(t * 40) * 3 : 0;
  const breath = Math.sin(t * 1.9 + 1) * 4;
  const tilt = (o.tilt || 0) + Math.sin(t * 0.8) * 1.6;
  const blink = naturalBlink(t, seed);
  const talkK = typeof o.talk === 'number' ? clamp(o.talk, 0, 1) : (o.talk ? (Math.sin(t * 17) + 1) / 2 * 0.9 : 0);
  const L = o.light == null ? 1 : o.light;
  const coat = '#F7F9FB', coatShade = '#D6E0EA';
  let h = `<g transform="translate(${f1(x + shake)} ${f1(y)}) scale(${s})">`;
  h += `<ellipse cx="0" cy="4" rx="130" ry="18" fill="#000" opacity=".22"/>`;
  // legs + shoes
  h += `<g stroke="${INK}" stroke-width="12" stroke-linecap="round" fill="none"><polyline points="-26,-170 -30,-90 -34,-18"/><polyline points="26,-170 30,-90 34,-18"/></g>`;
  h += `<ellipse cx="-44" cy="-8" rx="36" ry="15" fill="#2A3A52" stroke="${INK}" stroke-width="7"/><ellipse cx="44" cy="-8" rx="36" ry="15" fill="#2A3A52" stroke="${INK}" stroke-width="7"/>`;
  h += `<g transform="translate(0 ${f1(-breath)})">`;
  // lab coat
  h += `<path d="M-84 -540 Q0 -568 84 -540 L112 -150 Q0 -128 -112 -150 Z" fill="${coat}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>`;
  h += `<path d="${L > 0 ? 'M40 -548 L84 -540 L112 -150 L54 -136 Z' : 'M-40 -548 L-84 -540 L-112 -150 L-54 -136 Z'}" fill="${coatShade}" opacity=".75"/>`;
  // turtleneck + lapels
  h += `<path d="M-34 -556 L0 -420 L34 -556 Z" fill="#1F2D44" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  h += `<rect x="-30" y="-572" width="60" height="26" rx="10" fill="#1F2D44" stroke="${INK}" stroke-width="6"/>`;
  h += `<path d="M-34 -556 L-6 -400 L-30 -380" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M34 -556 L6 -400 L30 -380" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  h += `<line x1="0" y1="-400" x2="0" y2="-142" stroke="${INK}" stroke-width="5"/>`;
  h += `<circle cx="-12" cy="-330" r="6" fill="${INK}"/><circle cx="-12" cy="-250" r="6" fill="${INK}"/>`;
  // chest pocket with pens, name badge
  h += `<rect x="-78" y="-480" width="48" height="40" rx="6" fill="${coat}" stroke="${INK}" stroke-width="5"/><rect x="-70" y="-506" width="9" height="34" rx="4" fill="${MINT}" stroke="${INK}" stroke-width="3"/><rect x="-56" y="-500" width="9" height="28" rx="4" fill="${PINK}" stroke="${INK}" stroke-width="3"/>`;
  h += `<rect x="30" y="-486" width="58" height="34" rx="6" fill="${MINT}" stroke="${INK}" stroke-width="5"/><text x="59" y="-462" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="18" fill="${NAVY}">박사</text>`;
  // arms: left holds a clipboard, right relaxed or pointing
  const sleeve = (d) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="52" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${coat}" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>`;
  const point = o.pose === 'point';
  h += sleeve('M-74 -520 Q-120 -420 -96 -330');
  h += `<g transform="rotate(-8 -110 -300)"><rect x="-160" y="-380" width="110" height="140" rx="10" fill="#C08A4F" stroke="${INK}" stroke-width="7"/><rect x="-148" y="-362" width="86" height="110" rx="4" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="-124" y="-392" width="38" height="20" rx="5" fill="#9AA6B2" stroke="${INK}" stroke-width="4"/>${[0, 1, 2, 3].map(i => `<line x1="-138" y1="${-340 + i * 22}" x2="${-78 - (i % 2) * 14}" y2="${-340 + i * 22}" stroke="#9CB3C8" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>`;
  h += `<circle cx="-92" cy="-322" r="24" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
  if (point) { h += sleeve('M74 -520 Q140 -560 180 -640'); h += `<circle cx="186" cy="-652" r="24" fill="#fff" stroke="${INK}" stroke-width="7"/><line x1="196" y1="-668" x2="214" y2="-704" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>`; }
  else { h += sleeve('M74 -520 Q122 -420 112 -270'); h += `<circle cx="112" cy="-256" r="24" fill="#fff" stroke="${INK}" stroke-width="7"/>`; }
  // ---- head (drawn in ZERO's head coordinates so it shares clips and proportions) ----
  h += `<g transform="rotate(${f1(tilt)} 0 -572) translate(-200 -838)">`;
  // fluffy side hair (behind the head)
  const puff = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#EEF1F5" stroke="${INK}" stroke-width="6"/>`;
  h += puff(84, 132, 34) + puff(66, 176, 32) + puff(80, 218, 28) + puff(316, 132, 34) + puff(334, 176, 32) + puff(320, 218, 28);
  h += `<ellipse cx="200" cy="170" rx="118" ry="112" fill="#fff"/>`;
  h += `<g clip-path="url(#headClip)"><ellipse cx="200" cy="170" rx="140" ry="130" fill="#DCE6F0"/><ellipse cx="${200 - 30 * L}" cy="150" rx="118" ry="112" fill="#fff"/></g>`;
  h += `<ellipse cx="200" cy="170" rx="118" ry="112" fill="none" stroke="${INK}" stroke-width="8"/>`;
  // little curl on top
  h += `<path d="M178 62 Q172 34 196 34 Q218 36 208 58" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M204 60 Q214 40 230 50" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  // cheeks
  h += `<ellipse cx="140" cy="226" rx="15" ry="8" fill="#FFB3C1" opacity=".55"/><ellipse cx="260" cy="226" rx="15" ry="8" fill="#FFB3C1" opacity=".55"/>`;
  // eyes (behind the lenses), with blink
  const by = Math.max(0.08, 1 - 0.92 * blink);
  h += `<g transform="translate(0 188) scale(1 ${f1(by * 100) / 100}) translate(0 -188)">`;
  if (ex.eyes === 'happy' && blink < 0.5) h += `<path d="M151 194 Q165 176 179 194" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M221 194 Q235 176 249 194" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
  else if (ex.eyes === 'wide') h += `<circle cx="165" cy="188" r="14" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="235" cy="188" r="14" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="165" cy="189" r="6" fill="${INK}"/><circle cx="235" cy="189" r="6" fill="${INK}"/>`;
  else h += `<ellipse cx="165" cy="188" rx="9" ry="12" fill="${INK}"/><ellipse cx="235" cy="188" rx="9" ry="12" fill="${INK}"/><circle cx="168" cy="183" r="3" fill="#fff"/><circle cx="238" cy="183" r="3" fill="#fff"/>`;
  h += `</g>`;
  // big round glasses
  h += `<line x1="84" y1="182" x2="126" y2="186" stroke="#1F2D44" stroke-width="7" stroke-linecap="round"/><line x1="316" y1="182" x2="274" y2="186" stroke="#1F2D44" stroke-width="7" stroke-linecap="round"/>`;
  h += `<circle cx="165" cy="188" r="40" fill="${glass}" fill-opacity=".16" stroke="#1F2D44" stroke-width="9"/><circle cx="235" cy="188" r="40" fill="${glass}" fill-opacity=".16" stroke="#1F2D44" stroke-width="9"/>`;
  h += `<path d="M193 186 Q200 176 207 186" fill="none" stroke="#1F2D44" stroke-width="7" stroke-linecap="round"/>`;
  const gl = (Math.sin(t * 1.3) + 1) / 2;
  h += `<path d="M140 176 Q146 160 162 156" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="${f1((0.5 + gl * 0.5) * 100) / 100}"/><path d="M210 176 Q216 160 232 156" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="${f1((0.5 + gl * 0.5) * 100) / 100}"/>`;
  if (alert) h += `<circle cx="165" cy="188" r="40" fill="${RED}" opacity=".18"/><circle cx="235" cy="188" r="40" fill="${RED}" opacity=".18"/>`;
  // bushy grey brows
  const bq = b => `M${f1(b[0])} ${f1(b[1] - 8)} Q${f1(b[2])} ${f1(b[3] - 8)} ${f1(b[4])} ${f1(b[5] - 8)}`;
  h += `<path d="${bq(ex.bL)}" fill="none" stroke="#6B7684" stroke-width="16" stroke-linecap="round"/><path d="${bq(ex.bR)}" fill="none" stroke="#6B7684" stroke-width="16" stroke-linecap="round"/>`;
  // moustache + mouth (talks)
  if (ex.mouth === 'O' || talkK > 0.15) {
    const oy = ex.mouth === 'O' ? 14 : 4 + talkK * 12;
    h += `<ellipse cx="200" cy="250" rx="${f1(ex.mouth === 'O' ? 11 : 10 + talkK * 3)}" ry="${f1(oy)}" fill="#7A2E3A" stroke="${INK}" stroke-width="5"/>`;
  } else h += `<path d="${ex.mouth}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
  h += `<path d="M168 230 Q184 214 200 226 Q216 214 232 230 Q216 242 200 234 Q184 242 168 230 Z" fill="#D5DAE1" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  if (ex.sweat) h += `<path d="M314 112 Q300 138 314 148 Q328 138 314 112 Z" fill="#9ED8FF" stroke="${INK}" stroke-width="5"/>`;
  h += `</g>`; // head
  h += `</g></g>`;
  return h;
}
