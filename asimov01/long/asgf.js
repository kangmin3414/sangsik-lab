/* 로봇 3원칙 편 — 인물·소품(아시모프 스틱맨, 삼칙이, 타자기). 새 이름은 모두 as 접두사.
   아시모프(1920~1992)는 고인이라 채널 규칙대로 스틱맨으로 그린다. 사진을 따라 그리지 않고 널리 알려진 특징(두꺼운 뿔테·노년의 큰 구레나룻·볼로 타이)만 우리 그림으로.
   1942년(22세) 장면은 짙은 머리·안경만, 구레나룻은 '수십 년 동안' 몽타주에서 자라난다. */
const ASC = { cream: '#FFF6E6', navy: '#26304A', face: '#1E2740', eye: '#7FF0FF', l1: '#FFD84A', l2: '#7FD8FF', l3: '#7FE0B0', l4: '#FFB067', slate: '#3E4A66', grey: '#CFCFCF' };
/* 아시모프 머리 장식(머리 좌표: 머리 가운데 200,170): 뿔테 + (노년) 구레나룻 + 볼로 타이 */
const asAsimovFx = (old = 1) => () => {
  let h = '';
  if (old > 0) {
    const side = d => { const X = x => d < 0 ? x : 400 - x;
      const g = 0.35 + 0.65 * old;   // 몽타주에서 자라난다(아래로 길어짐)
      return `<path d="M${X(92)} 150 Q${X(84)} ${f1(186 + 28 * g)} ${X(100)} ${f1(214 + 40 * g)} Q${X(122)} ${f1(240 + 44 * g)} ${X(176)} ${f1(240 + 34 * g)} Q${X(150)} ${f1(232 + 22 * g)} ${X(138)} ${f1(214 + 14 * g)} Q${X(124)} 186 ${X(116)} 152 Z" fill="${ASC.grey}" stroke="${INK}" stroke-width="6" stroke-linejoin="round" opacity="${f1(old * 100) / 100}"/>` +
        [[102, 186], [110, 222], [128, 256], [150, 270]].map(([x, y]) => `<path d="M${X(x)} ${f1(y * (0.9 + 0.1 * g))} q${d * -7} 9 0 16" stroke="#9A9A9A" stroke-width="4" fill="none" stroke-linecap="round" opacity="${f1(old * 100) / 100}"/>`).join(''); };
    h += side(-1) + side(1);
  }
  h += [164, 236].map(x => `<rect x="${x - 38}" y="160" width="76" height="60" rx="18" fill="#EAF7FF" fill-opacity=".25" stroke="#141414" stroke-width="11"/>`).join('') +
    `<path d="M202 186 Q200 176 198 186" stroke="#141414" stroke-width="10" fill="none"/><path d="M126 182 L92 172 M274 182 L308 172" stroke="#141414" stroke-width="9" stroke-linecap="round"/>`;
  if (old > 0.5) h += `<path d="M192 266 L194 336 M208 266 L206 336" stroke="#2A2A2A" stroke-width="5" stroke-linecap="round"/><circle cx="194" cy="340" r="5" fill="#C9D3E0" stroke="${INK}" stroke-width="3"/><circle cx="206" cy="340" r="5" fill="#C9D3E0" stroke="${INK}" stroke-width="3"/>` +
    `<circle cx="200" cy="288" r="15" fill="#3FB7A8" stroke="#C9D3E0" stroke-width="5"/><circle cx="200" cy="288" r="15" fill="none" stroke="${INK}" stroke-width="3"/>`;
  return h;
};
const asAsimov = (o, old = 1) => spMan(Object.assign({ t: 1, seed: 11, look: [0, 0], ex: fEx(o.exk || 'z빵긋'), headFx: asAsimovFx(old) }, o),
  old > 0.5 ? { vest: '#8A6A4A', suit: '#F4EFE6', collar: true, hair: ASC.grey } : { vest: '#6B7A5A', collar: true, tie: '#8E3B32', hair: '#2E2622' });
/* 타자기(원점 = 바닥 가운데). paper 0~1: 종이가 올라온 정도 */
function asTypewriter(paper = 0.6, s = 1) {
  return `<g transform="scale(${s})"><rect x="-150" y="-110" width="300" height="110" rx="22" fill="#4E5B52" stroke="${INK}" stroke-width="8"/>` +
    [0, 1, 2].map(r => [...Array(9 - r)].map((_, c) => `<circle cx="${-112 + r * 14 + c * 28}" cy="${-30 - r * 24}" r="9" fill="#EDE6D6" stroke="${INK}" stroke-width="3"/>`).join('')).join('') +
    `<rect x="-170" y="-150" width="340" height="40" rx="18" fill="#3A4540" stroke="${INK}" stroke-width="7"/><circle cx="-176" cy="-130" r="16" fill="#C9D3E0" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="-90" y="${f1(-150 - 170 * paper)}" width="180" height="${f1(170 * paper + 12)}" fill="#FBF6EA" stroke="${INK}" stroke-width="5"/>` +
    [...Array(Math.floor(6 * paper))].map((_, i) => `<path d="M-70 ${f1(-160 - 170 * paper + 28 + i * 24)} h${100 + (i * 37) % 40}" stroke="#7A7060" stroke-width="5" stroke-linecap="round"/>`).join('') + `</g>`;
}
/* 삼칙이(원점 = 바닥 가운데, 키 ≈ 390). o.lamps: [1,1,1,0] 켜짐 정도, o.ex: 'smile'|'heart'|'flat'|'x'|'wave', o.blink: 원칙 충돌 깜빡 */
function asBot(t = 0, o = {}) {
  const L = o.lamps || [1, 1, 1, 0], ex = o.ex || 'smile', bob = Math.sin(t * 2.4) * 4;
  let h = `<ellipse cx="0" cy="6" rx="96" ry="15" fill="#000" opacity=".18"/>`;
  h += `<rect x="-72" y="-46" width="144" height="46" rx="20" fill="${ASC.slate}" stroke="${INK}" stroke-width="7"/><circle cx="-38" cy="-10" r="14" fill="#9AA6B8" stroke="${INK}" stroke-width="5"/><circle cx="38" cy="-10" r="14" fill="#9AA6B8" stroke="${INK}" stroke-width="5"/>`;
  h += `<g transform="translate(0 ${f1(bob * 0.4)})">`;
  // 팔
  const wave = o.wave ? Math.sin(t * 8) * 18 : 0;
  h += `<path d="M-92 -150 Q-128 -120 -126 -84" stroke="${INK}" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M-92 -150 Q-128 -120 -126 -84" stroke="${ASC.cream}" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="-126" cy="-80" r="17" fill="${ASC.cream}" stroke="${INK}" stroke-width="6"/>`;
  h += `<g transform="rotate(${f1(-wave)} 92 -150)"><path d="M92 -150 Q${o.wave ? '132 -190 136 -236' : '128 -120 126 -84'}" stroke="${INK}" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M92 -150 Q${o.wave ? '132 -190 136 -236' : '128 -120 126 -84'}" stroke="${ASC.cream}" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="${o.wave ? 136 : 126}" cy="${o.wave ? -240 : -80}" r="17" fill="${ASC.cream}" stroke="${INK}" stroke-width="6"/></g>`;
  // 몸통 + 가슴 원칙 칸 넷
  h += `<path d="M-96 -170 Q-104 -60 -60 -44 L60 -44 Q104 -60 96 -170 Q90 -214 0 -216 Q-90 -214 -96 -170 Z" fill="${ASC.cream}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  h += `<rect x="-78" y="-158" width="156" height="58" rx="22" fill="${ASC.navy}" stroke="${INK}" stroke-width="5"/>`;
  const LC = [ASC.l1, ASC.l2, ASC.l3, ASC.l4];
  const ICON = [`<path d="M0 6 C-12 -4 -12 -12 -5 -13 C-2 -14 0 -11 0 -9 C0 -11 2 -14 5 -13 C12 -12 12 -4 0 6 Z" fill="${INK}" opacity=".55"/>`,
    `<path d="M-9 -9 h18 v12 h-10 l-6 6 v-6 h-2 Z" fill="${INK}" opacity=".55"/>`,
    `<rect x="-9" y="-6" width="16" height="12" rx="2" fill="none" stroke="${INK}" stroke-width="3" opacity=".55"/><rect x="7" y="-3" width="3" height="6" fill="${INK}" opacity=".55"/>`, ''];
  [-54, -18, 18, 54].forEach((x, i) => { const k = L[i] || 0, bl = o.blink && i < 3 ? (Math.sin(t * 14 + i * 2.1) > 0 ? 1 : 0.25) : 1, kk = k * bl;
    if (k > 0) h += `<circle cx="${x}" cy="-129" r="${f1(24 + 6 * kk)}" fill="${LC[i]}" opacity="${f1(kk * 0.35 * 100) / 100}"/><circle cx="${x}" cy="-129" r="15" fill="${LC[i]}" stroke="${INK}" stroke-width="4" opacity="${f1((0.35 + 0.65 * kk) * 100) / 100}"/><g transform="translate(${x} -127)">${ICON[i]}</g>`;
    else h += `<circle cx="${x}" cy="-129" r="15" fill="none" stroke="#9AA6B8" stroke-width="4" stroke-dasharray="6 5"/>`; });
  // 머리
  h += `<line x1="0" y1="-352" x2="0" y2="-388" stroke="${INK}" stroke-width="7"/><circle cx="0" cy="-394" r="12" fill="${ASC.l1}" stroke="${INK}" stroke-width="5"/>`;
  h += `<circle cx="-106" cy="-284" r="15" fill="${ASC.l3}" stroke="${INK}" stroke-width="6"/><circle cx="106" cy="-284" r="15" fill="${ASC.l3}" stroke="${INK}" stroke-width="6"/>`;
  h += `<rect x="-102" y="-352" width="204" height="138" rx="52" fill="${ASC.cream}" stroke="${INK}" stroke-width="8"/><rect x="-80" y="-334" width="160" height="100" rx="36" fill="${ASC.face}"/>`;
  h += `<ellipse cx="-58" cy="-252" rx="11" ry="6" fill="#FF8FB1" opacity=".55"/><ellipse cx="58" cy="-252" rx="11" ry="6" fill="#FF8FB1" opacity=".55"/>`;
  const E = { smile: x => `<path d="M${x - 14} -280 Q${x} -298 ${x + 14} -280" stroke="${ASC.eye}" stroke-width="8" fill="none" stroke-linecap="round"/>`,
    open: x => `<ellipse cx="${x}" cy="-284" rx="12" ry="${f1(17 * (Math.sin(t * 1.3) > 0.97 ? 0.15 : 1))}" fill="${ASC.eye}"/>`,
    heart: x => `<path d="M${x} -272 C${x - 18} -284 ${x - 16} -300 ${x - 6} -300 C${x - 2} -300 ${x} -296 ${x} -293 C${x} -296 ${x + 2} -300 ${x + 6} -300 C${x + 16} -300 ${x + 18} -284 ${x} -272 Z" fill="#FF7AA2"/>`,
    flat: x => `<path d="M${x - 14} -284 h28" stroke="${ASC.eye}" stroke-width="8" stroke-linecap="round"/>`,
    x: x => `<path d="M${x - 11} -295 l22 22 M${x + 11} -295 l-22 22" stroke="#FF6B6B" stroke-width="7" stroke-linecap="round"/>`,
    wave: x => `<path d="M${x - 14} -282 q7 -9 14 0 t14 0" stroke="${ASC.eye}" stroke-width="7" fill="none" stroke-linecap="round"/>` };
  h += (E[ex] || E.open)(-34) + (E[ex] || E.open)(34);
  if (o.talk) h += `<path d="M-22 -252 ${[...Array(9)].map((_, i) => `L${-22 + i * 5.5} ${f1(-252 + Math.sin(t * 30 + i) * 6 * o.talk)}`).join(' ')}" stroke="${ASC.eye}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  return h + `</g>`;
}
/* 자세: 한 손 들어 인사 */
P['as손'] = Object.assign({}, P['서기'], { armR: [[252, 285], [300, 220], [318, 150]], hR: [320, 140] });
