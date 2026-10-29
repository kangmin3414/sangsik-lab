
const TEE = '#FF9A55';
const Z = o => char(Object.assign({ goggles: 'none', vest: TEE, patch: false, tee: true, vshade: 'rgba(150,60,0,0.22)', still: true, noBlink: true }, o));
const ZV = o => char(Object.assign({ still: true, noBlink: true }, o));   // 002 look: yellow vest + goggles
const EX = e => ({ expr: e, prev: e, k: 1, blink: 0 });
function defsAll() {
  return `<defs>
<clipPath id="headClip"><ellipse cx="200" cy="170" rx="118" ry="112"/></clipPath>
<clipPath id="vestClip"><path d="M142 262 Q200 248 258 262 L270 412 Q200 424 130 412 Z"/></clipPath>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${MINT}" stop-opacity=".7"/><stop offset="1" stop-color="${MINT}" stop-opacity="0"/></radialGradient>
<radialGradient id="redglow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${RED}" stop-opacity=".55"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/></radialGradient>
<radialGradient id="warm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C2" stop-opacity="1"/><stop offset="1" stop-color="#FFF6C2" stop-opacity="0"/></radialGradient>
<radialGradient id="screenGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#8FDBFF" stop-opacity=".55"/><stop offset="1" stop-color="#8FDBFF" stop-opacity="0"/></radialGradient>
<linearGradient id="screen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F7FF"/><stop offset="1" stop-color="#BFE6FF"/></linearGradient>
<clipPath id="feedClip"><rect x="-52" y="-98" width="104" height="196" rx="14"/></clipPath>
<linearGradient id="skyA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6EC3FF"/><stop offset=".62" stop-color="#CDEEFF"/><stop offset="1" stop-color="#FFF6DE"/></linearGradient>
<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF9EE"/><stop offset="1" stop-color="#F6E7CC"/></linearGradient>
<linearGradient id="cafe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE3B3"/><stop offset="1" stop-color="#FFF4DF"/></linearGradient>
<linearGradient id="pinkbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD9E6"/><stop offset="1" stop-color="#FFF4F8"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".55"/><stop offset=".5" stop-color="#E6F6FF" stop-opacity=".25"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".5"/></linearGradient>
</defs>`;
}
const rays = (cx, cy, bg, ray, n = 22) => {
  let h = `<rect width="1280" height="720" fill="${bg}"/>`;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = a0 + Math.PI / n;
    h += `<path d="M${cx} ${cy} L${f1(cx + 2000 * Math.cos(a0))} ${f1(cy + 2000 * Math.sin(a0))} L${f1(cx + 2000 * Math.cos(a1))} ${f1(cy + 2000 * Math.sin(a1))} Z" fill="${ray}"/>`;
  }
  return h;
};
const sparkle = (x, y, s, c = YEL) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -30 Q6 -6 30 0 Q6 6 0 30 Q-6 6 -30 0 Q-6 -6 0 -30 Z" fill="${c}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>`;
const sprout = (x, y, s, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
<path d="M0 6 Q-6 -36 6 -72" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0 6 Q-6 -36 6 -72" fill="none" stroke="#3E9E48" stroke-width="5" stroke-linecap="round"/>
<path d="M6 -72 Q-44 -106 -70 -74 Q-36 -48 6 -72 Z" fill="#5BC85B" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
<path d="M6 -72 Q50 -118 78 -88 Q48 -58 6 -72 Z" fill="#86E070" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`;
const sweat = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -26 Q16 0 12 10 Q8 22 0 22 Q-8 22 -12 10 Q-16 0 0 -26 Z" fill="#7CC7FF" stroke="${INK}" stroke-width="4"/>`;
const hills = (c1, c2) => `<path d="M-20 600 Q220 548 470 592 T980 584 T1300 556 L1300 740 L-20 740 Z" fill="${c1}" stroke="${INK}" stroke-width="6"/>
<path d="M-20 662 Q300 632 640 664 T1300 650 L1300 740 L-20 740 Z" fill="${c2}" stroke="${INK}" stroke-width="6"/>`;
const tree = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-10" y="-10" width="20" height="70" fill="#9A6B42" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="-50" r="58" fill="#5DBB63" stroke="${INK}" stroke-width="6"/><circle cx="-22" cy="-66" r="16" fill="#7FD486" opacity=".8"/></g>`;
const zz = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" font-family="Black Han Sans" fill="${WHITE}" stroke="${INK}" stroke-width="8" paint-order="stroke fill"><text x="0" y="0" font-size="56">Z</text><text x="40" y="-44" font-size="42">z</text><text x="72" y="-80" font-size="32">z</text></g>`;
const bolt = (x, y, s, c = YEL) => `<path transform="translate(${x} ${y}) scale(${s})" d="M10 -60 L-26 6 L0 6 L-12 60 L28 -10 L2 -10 Z" fill="${c}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;

const V = {};
// ---------- 002 A: 걷기만 했는데 뇌가 자랐다 ----------
V.walkA = () => {
  let h = `<rect width="1280" height="720" fill="url(#skyA)"/><circle cx="1010" cy="400" r="380" fill="url(#warm)"/>`;
  h += tree(110, 600, 0.9) + tree(1215, 575, 0.75) + hills('#A6DE86', '#7CC768');
  h += brain(1005, 420, 0.7, 'hippocampus', 0.35);
  h += sprout(980, 262, 1.05) + sprout(1078, 256, 0.85, true);
  h += sparkle(760, 300, 0.9) + sparkle(1225, 330, 0.75) + sparkle(1205, 470, 0.55, WHITE);
  h += shadow(430, 703, 82) + ZV({ x: 430, y: 700, s: 0.62, pose: walkPose(1.25, 0.95), ex: EX('신남'), look: [0.7, -0.5], tilt: -4 });
  return h;
};
// ---------- 002 B: 하루 9,800보, 치매 위험 51%↓ ----------
V.walkB = () => {
  let h = rays(1010, 470, '#FFF1B8', '#FFE68A');
  h += `<circle cx="1010" cy="470" r="330" fill="url(#warm)"/>`;
  h += `<path d="M-20 650 Q640 610 1300 650 L1300 740 L-20 740 Z" fill="#9BD98B" stroke="${INK}" stroke-width="6"/>`;
  h += brain(1015, 455, 0.64, 'whole', 0.5);
  // shield
  h += `<g transform="translate(1150 545) scale(1.05)"><path d="M0 -92 L78 -64 Q80 30 0 92 Q-80 30 -78 -64 Z" fill="${MINT}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M-32 0 L-8 26 L36 -26" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  // footprints toward the brain
  [[560, 668], [628, 650], [700, 668], [770, 650]].forEach(([x, y], i) => h += `<ellipse cx="${x}" cy="${y}" rx="20" ry="11" fill="#5A8F4E" opacity=".55" transform="rotate(-8 ${x} ${y})"/>`);
  h += shadow(380, 703, 80) + ZV({ x: 380, y: 700, s: 0.62, pose: walkPose(2.4, 0.95), ex: EX('뿌듯'), look: [0.8, -0.3], tilt: -3 });
  h += sparkle(1240, 330, 0.7) + sparkle(800, 330, 0.6, WHITE);
  return h;
};
// ---------- 003 A: 폰 뒤집어 놔도 집중력 샌다 ----------
V.phoneA = () => {
  let h = `<rect width="1280" height="720" fill="url(#wall)"/>`;
  h += `<rect x="900" y="70" width="300" height="230" rx="16" fill="#CFEFFF" stroke="${INK}" stroke-width="9"/><path d="M1050 70 L1050 300 M900 185 L1200 185" stroke="${INK}" stroke-width="7"/>`;
  // focus leaking from head into the face-down phone
  const flow = [[520, 400, 700, 330, 880, 560], [500, 440, 660, 440, 860, 585]];
  flow.forEach(([x0, y0, cx, cy, x1, y1]) => h += `<path d="M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round" opacity=".9"/><path d="M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}" fill="none" stroke="${MINT}" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 22"/>`);
  h += sparkle(640, 360, 0.55) + sparkle(745, 410, 0.45) + sparkle(820, 500, 0.4);
  h += Z({ x: 360, y: 760, s: 0.74, pose: '서기', ex: EX('지침'), look: [0.8, 0.5], tilt: 6 }) + sweat(470, 360, 1.1) + sweat(250, 400, 0.8);
  // desk
  h += `<rect x="-20" y="585" width="1320" height="160" fill="#C99A66" stroke="${INK}" stroke-width="9"/><rect x="-20" y="585" width="1320" height="22" fill="#DDB07A" stroke="${INK}" stroke-width="7"/>`;
  // phone lying face-down
  h += `<g transform="translate(1000 560)"><path d="M-150 18 L150 18 L176 62 L-176 62 Z" fill="#26344F" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M-176 62 L176 62 L176 74 L-176 74 Z" fill="#141C2C" stroke="${INK}" stroke-width="7"/><rect x="-118" y="26" width="64" height="24" rx="8" fill="#121B2B" stroke="#4A5A78" stroke-width="3"/><circle cx="-100" cy="38" r="7" fill="#0A0F18" stroke="#4A5A78" stroke-width="2"/><circle cx="-72" cy="38" r="7" fill="#0A0F18" stroke="#4A5A78" stroke-width="2"/></g>`;
  h += `<circle cx="1000" cy="585" r="150" fill="url(#redglow)" opacity=".6"/>`;
  return h;
};
// ---------- 003 B: 폰 끊고 2주, 집중력 -10살 ----------
V.phoneB = () => {
  let h = rays(1000, 400, '#D8F6FF', '#BDEBFF');
  h += `<path d="M-20 650 Q640 620 1300 650 L1300 740 L-20 740 Z" fill="#9FD3F0" stroke="${INK}" stroke-width="6"/>`;
  // locked jar with the phone
  h += `<g transform="translate(1010 420)">
<rect x="-150" y="-190" width="300" height="380" rx="46" fill="#EAF8FF" stroke="${INK}" stroke-width="10"/>
<rect x="-170" y="-236" width="340" height="62" rx="16" fill="#5B6B86" stroke="${INK}" stroke-width="9"/>
${phone(0, 10, 1.15, { on: true, lw: 7 })}
<rect x="-150" y="-190" width="300" height="380" rx="46" fill="url(#glass)"/>
<path d="M-112 -150 Q-128 0 -112 140" fill="none" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round" opacity=".8"/>
<g transform="translate(0 -205)"><path d="M-30 -10 L-30 -42 Q-30 -76 0 -76 Q30 -76 30 -42 L30 -10" fill="none" stroke="${INK}" stroke-width="12"/><rect x="-46" y="-14" width="92" height="74" rx="14" fill="${YEL}" stroke="${INK}" stroke-width="9"/><circle cx="0" cy="18" r="9" fill="${INK}"/><rect x="-4" y="20" width="8" height="22" fill="${INK}"/></g>
</g>`;
  h += `<g transform="translate(1110 270)"><circle r="34" fill="${RED}" stroke="${INK}" stroke-width="6"/><text x="0" y="14" text-anchor="middle" font-family="Black Han Sans" font-size="34" fill="#fff">99+</text></g>`;
  h += shadow(380, 703, 86) + Z({ x: 380, y: 700, s: 0.66, pose: '만세', ex: EX('신남'), look: [0.4, -0.6] });
  h += sparkle(230, 330, 0.8) + sparkle(560, 360, 0.7, WHITE) + sparkle(1225, 560, 0.6);
  return h;
};
// ---------- 004 A: 당 충전? 오히려 방전 ----------
V.sugarA = () => {
  let h = `<rect width="1280" height="720" fill="url(#cafe)"/>`;
  h += `<rect x="1020" y="60" width="210" height="250" rx="14" fill="#FFF2D2" stroke="${INK}" stroke-width="8"/><path d="M1125 60 L1125 310 M1020 185 L1230 185" stroke="${INK}" stroke-width="6"/>`;
  // battery
  h += `<g transform="translate(980 420)">
<rect x="-210" y="-110" width="400" height="220" rx="34" fill="#FFFFFF" stroke="${INK}" stroke-width="12"/>
<rect x="190" y="-46" width="40" height="92" rx="12" fill="#FFFFFF" stroke="${INK}" stroke-width="10"/>
<rect x="-188" y="-88" width="74" height="176" rx="16" fill="${RED}"/>
<path d="M-188 -88 L-114 -88" stroke="#FFFFFF" stroke-width="6" opacity=".5"/>
</g>`;
  h += `<g transform="translate(1035 420)"><path d="M-40 -70 L40 70 M40 -70 L-40 70" stroke="${RED}" stroke-width="0"/></g>`;
  h += bolt(1040, 420, 1.15, '#D9D9D9');
  // cable from a donut into the battery
  h += `<path d="M640 590 C700 520 690 430 770 420" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M640 590 C700 520 690 430 770 420" fill="none" stroke="#5B6B86" stroke-width="8" stroke-linecap="round"/>`;
  h += `<rect x="742" y="398" width="34" height="44" rx="6" fill="#9AA6BD" stroke="${INK}" stroke-width="6"/>`;
  // table
  h += `<rect x="-20" y="600" width="1320" height="140" fill="#D9A36B" stroke="${INK}" stroke-width="9"/><rect x="-20" y="600" width="1320" height="20" fill="#E8BC86" stroke="${INK}" stroke-width="7"/>`;
  h += Z({ x: 330, y: 780, s: 0.76, pose: '서기', ex: EX('졸림'), look: [0.6, 0.6], tilt: 10 }) + zz(450, 330, 0.95);
  h += donut(640, 600, 0.95, -10) + latte(530, 548, 0.72);
  return h;
};
// ---------- 004 B: 설탕 끊고 3일, 두통이 온다? ----------
V.sugarB = () => {
  let h = `<rect width="1280" height="720" fill="url(#pinkbg)"/>`;
  h += `<path d="M-20 650 Q640 620 1300 650 L1300 740 L-20 740 Z" fill="#F7B9CC" stroke="${INK}" stroke-width="6"/>`;
  // sweets with a ban sign
  h += `<g transform="translate(1000 440)">${cake(-60, 70, 1.15)}${donut(80, 60, 1.05, 12)}${soda(-10, -70, 0.95)}
<circle r="215" fill="none" stroke="${RED}" stroke-width="30"/><path d="M-152 -152 L152 152" stroke="${RED}" stroke-width="30" stroke-linecap="round"/>
<circle r="215" fill="none" stroke="${INK}" stroke-width="5" opacity=".35"/></g>`;
  // headache zigzags
  const zig = (x, y, r, s) => `<path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0 0 L18 -14 L30 4 L48 -12 L60 6" fill="none" stroke="${RED}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
  h += shadow(400, 703, 86) + Z({ x: 400, y: 700, s: 0.7, pose: '웅크림', ex: EX('걱정'), look: [0.3, -0.2] });
  h += zig(250, 330, -30, 1.3) + zig(500, 300, 20, 1.3) + zig(545, 380, 50, 1.0) + sweat(300, 400, 1);
  return h;
};
