/* 제로의 세계 — 여자 캐릭터 프리셋 (헤어 6종 + 소품). 머리 로컬 좌표(머리 중심 200,170 / 반지름 118×112).
   원칙: 실루엣은 머리 모양이 결정한다 · 흔들리는 머리카락이 귀여움의 절반(한 박자 늦게) · 몸매 강조나 노출 없이 머리·색·소품으로 매력을. */
const GH = { // 머리색
  choco: '#5A3A2E', black: '#2E2A33', chestnut: '#7A4A32', ash: '#6E6A78', honey: '#B7793E', navy: '#2F3550',
};
const gStroke = `stroke="${INK}" stroke-width="6" stroke-linejoin="round"`;
const gBangs = c => `<path d="M84 168 Q78 58 200 50 Q322 58 316 168 Q302 128 286 120 L272 138 Q254 116 236 126 L218 142 Q200 118 182 128 L162 144 Q146 116 126 124 Q104 132 84 168 Z" fill="${c}" ${gStroke}/>`;
const gSweep = c => `<path d="M84 170 Q76 56 200 48 Q324 56 316 170 Q308 122 272 104 Q228 90 198 128 Q172 152 140 136 Q108 132 84 170 Z" fill="${c}" ${gStroke}/>`;
const gPart = c => `<path d="M84 172 Q80 58 200 52 Q320 58 316 172 Q302 108 214 96 L200 124 L186 96 Q98 108 84 172 Z" fill="${c}" ${gStroke}/>`;
const gShine = `<path d="M128 84 Q160 66 196 66" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".35"/>`;
const gSway = (t, amp = 7, sp = 3.1, ph = 0) => f1(Math.sin(t * sp + ph) * amp);
const HAIR = {
  // 1. 단발 보브 + 별 핀
  bob: (c = GH.choco) => ({
    hairBehind: t => `<g transform="rotate(${gSway(t, 2.5)} 200 120)"><path d="M66 178 Q56 46 200 38 Q344 46 334 178 Q342 254 306 282 Q286 262 298 214 L102 214 Q114 262 94 282 Q58 254 66 178 Z" fill="${c}" ${gStroke}/></g>`,
    hairFront: gBangs(c) + gShine + `<g transform="translate(276 112) rotate(14)">${zStar(0, 0, 20, '#FFD23F', 4)}</g>`,
  }),
  // 2. 포니테일 (흔들림)
  pony: (c = GH.black, tie = '#FF5A6E') => ({
    hairBehind: t => `<g transform="rotate(${gSway(t, 9, 3.4)} 302 92)"><path d="M290 78 Q372 64 388 150 Q398 232 352 300 Q356 226 326 166 Q310 126 288 112 Z" fill="${c}" ${gStroke}/><path d="M330 120 Q360 170 356 230" fill="none" stroke="#fff" stroke-width="5" opacity=".25" stroke-linecap="round"/></g>`,
    hairFront: gSweep(c) + gShine + `<ellipse cx="300" cy="90" rx="18" ry="22" fill="${tie}" ${gStroke}/>`,
  }),
  // 3. 양갈래 똥머리 + 작은 리본
  buns: (c = GH.chestnut, bow = '#7FD6C2') => ({
    hairBack: t => [[-1, 98], [1, 302]].map(([s, x]) => `<g transform="translate(0 ${gSway(t, 2, 4, s)})"><circle cx="${x}" cy="66" r="44" fill="${c}" ${gStroke}/><path d="M${x - 22} 50 Q${x} 36 ${x + 22} 50" fill="none" stroke="#fff" stroke-width="5" opacity=".3"/></g>`).join(''),
    hairFront: gBangs(c) + gShine + [[136, -1], [264, 1]].map(([x, s]) => `<g transform="translate(${x} 70) rotate(${s * 20})"><path d="M0 0 L-24 -14 L-24 14 Z M0 0 L24 -14 L24 14 Z" fill="${bow}" ${gStroke}/><circle r="7" fill="${bow}" ${gStroke}/></g>`).join(''),
  }),
  // 4. 긴 생머리 + 머리띠
  long: (c = GH.navy, band = '#FF8FB1') => ({
    hairBehind: t => `<g transform="rotate(${gSway(t, 1.8, 2.4)} 200 100)"><path d="M84 160 Q78 52 200 46 Q322 52 316 160 Q326 250 334 330 Q312 352 282 336 Q270 300 268 256 L132 256 Q130 300 118 336 Q88 352 66 330 Q74 250 84 160 Z" fill="${c}" ${gStroke}/></g>`,
    hairFront: gPart(c) + gShine + `<path d="M88 132 Q200 30 312 132" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M88 132 Q200 30 312 132" fill="none" stroke="${band}" stroke-width="12" stroke-linecap="round"/>`,
  }),
  // 5. 숏컷 + 삐침머리 + 귀걸이
  short: (c = GH.ash, ear = '#FFD23F') => ({
    hairBack: t => `<circle cx="96" cy="${f1(240 + Math.abs(Math.sin(t * 3)) * 3)}" r="9" fill="${ear}" ${gStroke}/><circle cx="304" cy="${f1(240 + Math.abs(Math.sin(t * 3 + 0.5)) * 3)}" r="9" fill="${ear}" ${gStroke}/>`,
    hairFront: t => `<path d="M84 160 Q80 56 200 50 Q320 56 316 160 Q298 112 252 104 Q226 120 200 108 Q170 126 140 110 Q100 116 84 160 Z" fill="${c}" ${gStroke}/>` + gShine +
      `<g transform="rotate(${gSway(t, 12, 4)} 210 54)"><path d="M204 54 Q190 14 226 6 Q210 26 218 54 Z" fill="${c}" ${gStroke}/></g>`,
  }),
  // 6. 웨이브 롱 + 베레모
  wave: (c = GH.honey, beret = '#C8423A') => ({
    hairBehind: t => { let d = 'M82 150 Q76 52 200 46 Q324 52 318 150'; for (let i = 0; i < 6; i++) { const y = 170 + i * 30, sw = gSway(t + i * 0.2, 3, 2.6); d += ` Q${f1(352 + (i % 2 ? -10 : 10) + +sw)} ${y + 15} ${f1(330 + +sw)} ${y + 30}`; }
      d += ' Q300 372 270 352 L130 352 Q100 372 70 350'; for (let i = 5; i >= 0; i--) { const y = 170 + i * 30, sw = gSway(t + i * 0.2, 3, 2.6); d += ` Q${f1(48 + (i % 2 ? 10 : -10) - sw)} ${y + 15} ${f1(70 - sw)} ${y}`; }
      return `<path d="${d} Z" fill="${c}" ${gStroke}/>`; },
    hairFront: gSweep(c) + gShine + `<g transform="rotate(-12 200 60)"><ellipse cx="190" cy="56" rx="112" ry="40" fill="${beret}" ${gStroke}/><circle cx="190" cy="14" r="10" fill="${beret}" ${gStroke}/></g>`,
  }),
};
// 여자 캐릭터: 세계관의 몸(막대 팔다리, 둥근 손발) + 헤어 프리셋 + 속눈썹 + 옷 색
const zGirl = o => { const h = HAIR[o.hairStyle || 'bob'](...(o.hairArgs || []));
  return HALO(char(Object.assign({ goggles: 'none', vest: o.top || '#FF9AB0', patch: false, tee: true, vshade: 'rgba(0,0,0,0.12)', lash2: true, browW: 8, seed: 31 }, h, o))); };
