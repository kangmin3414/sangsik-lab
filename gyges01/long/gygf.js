/* 기게스의 반지 편 — 공통 소품 + 오프닝(시험장). 대본 gyges01/SCRIPT_asis.md(운영자 "고대로"). 새 이름은 모두 gy 접두사.
   sapiens01/long/spgf*.js(직장인 제로 SPZW·옷 spPass) 다음에 읽는다.
   표시: 시험 HUD(STAGE·남은 시간·멘탈 HP) + '보는 눈'(감시자의 눈 아이콘). 시험은 자격증 시험(화면만, 운영자 미응답 → 추천안).
   AR 정답 화면은 제로 시점(1인칭)에서만. 손가락으로 안경을 누르는 그림 없이 손은 관자놀이 옆 + '톡' 반짝. 굿하트는 그리지 않는다(생존 인물). */
window.GFR = { boil: false, vig: false, flash: false, study: false, sub: gfSubtitle,
  over: t => gfTransition(t, { k0: ['iris', 960, 520, 960, 540], g1: ['iris', 960, 540], g4: ['iris', 960, 560], g5: 'bands', g6: ['iris', 960, 500], g8: 'bands', g9: ['iris', 960, 540] }) };
['gyexam', 'gynews', 'gyplato', 'gyfield', 'gypalace', 'gyequal', 'gytempt'].forEach(k => CAMS[k] = 'fixed');
const GY = { FY: 930, ZX: 960 };
const gyW = (a, key, fb, n = 0) => { const m = (a._words || []).filter(x => x.w.replace(/\s/g, '').includes(key)); return m[n] ? m[n].t + 0.15 : fb; };
const gyLegs = () => ({ legL: P['서기'].legL, legR: P['서기'].legR, fL: P['서기'].fL, fR: P['서기'].fR, dy: 0 });
P['gy톡'] = Object.assign({ armL: [[148, 285], [146, 342], [178, 372]], hL: [182, 376], armR: [[252, 285], [322, 262], [338, 206]], hR: [340, 196] }, gyLegs());
P['gy들기'] = Object.assign({ armL: [[148, 285], [138, 340], [168, 312]], hL: [172, 304], armR: [[252, 285], [262, 340], [232, 312]], hR: [228, 304] }, gyLegs());
P['gy쓰기'] = Object.assign({ armL: [[148, 285], [140, 342], [176, 368]], hL: [180, 372], armR: [[252, 285], [262, 344], [236, 370]], hR: [232, 374] }, gyLegs());

const GY_DEFS = `<defs>
<radialGradient id="gyLensGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7FD8FF" stop-opacity=".95"/><stop offset="1" stop-color="#7FD8FF" stop-opacity="0"/></radialGradient>
<radialGradient id="gyUnder" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#B8F0FF" stop-opacity=".55"/><stop offset="1" stop-color="#B8F0FF" stop-opacity="0"/></radialGradient>
<linearGradient id="gyNavy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B2347"/><stop offset="1" stop-color="#2E3A6E"/></linearGradient>
<filter id="gyGray" x="-10%" y="-10%" width="120%" height="120%"><feColorMatrix type="saturate" values="0.08"/><feComponentTransfer><feFuncR type="linear" slope=".82"/><feFuncG type="linear" slope=".82"/><feFuncB type="linear" slope=".86"/></feComponentTransfer></filter>
<pattern id="gyStripeP" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="20" fill="#fff"/></pattern>
<mask id="gyStripes" maskUnits="userSpaceOnUse" x="-3000" y="-3000" width="8000" height="8000"><rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#gyStripeP)"/></mask>
<filter id="gyOutline" x="-30%" y="-30%" width="160%" height="160%"><feMorphology in="SourceAlpha" operator="dilate" radius="5" result="d"/><feComposite in="d" in2="SourceAlpha" operator="out" result="ring"/><feFlood flood-color="#3FA9FF"/><feComposite in2="ring" operator="in"/></filter>
<pattern id="gyGrid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0 L0 0 0 80" fill="none" stroke="#7FD8FF" stroke-width="2" opacity=".35"/></pattern>
<pattern id="gyCork" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="12" cy="14" r="3" fill="#B98552" opacity=".5"/><circle cx="42" cy="38" r="2.4" fill="#B98552" opacity=".45"/><circle cx="30" cy="52" r="2" fill="#fff" opacity=".25"/></pattern>
</defs>`;

/* ---------- 소품 ---------- */
/* 얼굴에 쓴 AI 안경(머리 좌표: 눈 165/235, 190). glow 0~1: 화면 오른쪽 렌즈만 파랗게 */
const gyGlassFx = (glow = 0) => () => (glow > 0 ? `<circle cx="236" cy="190" r="${f1(70 + 40 * glow)}" fill="url(#gyLensGlow)" opacity="${f1(glow * 100) / 100}"/>` : '') +
  `<path d="M131 184 L88 172 M269 184 L312 172" stroke="${GFC.navy}" stroke-width="8" stroke-linecap="round"/>` +
  [164, 236].map((x, i) => `<rect x="${x - 34}" y="162" width="68" height="54" rx="20" fill="${i && glow > 0 ? '#7FD8FF' : '#EAF7FF'}" fill-opacity="${i && glow > 0 ? f1((0.45 + 0.4 * glow) * 100) / 100 : 0.3}" stroke="${GFC.navy}" stroke-width="8"/>`).join('') +
  `<path d="M198 186 Q200 178 202 186" stroke="${GFC.navy}" stroke-width="8" fill="none"/><rect x="294" y="166" width="18" height="11" rx="4" fill="${glow > 0 ? '#7FD8FF' : '#9AA6B8'}" stroke="${INK}" stroke-width="3"/>`;
/* 따로 그린 AI 안경(정면, 원점 가운데, 폭 약 210) */
const gyGlasses = (glow = 0, t = 0) => `<g>${glow ? `<circle cx="38" r="${f1(80 + 20 * Math.sin(t * 3))}" fill="url(#gyLensGlow)" opacity="${f1(glow * 100) / 100}"/>` : ''}<path d="M-72 -6 L-104 -18 M72 -6 L104 -18" stroke="${GFC.navy}" stroke-width="9" stroke-linecap="round"/>` +
  [-38, 38].map((x, i) => `<rect x="${x - 34}" y="-28" width="68" height="56" rx="20" fill="${i && glow ? '#7FD8FF' : '#EAF7FF'}" fill-opacity="${i && glow ? 0.9 : 0.7}" stroke="${GFC.navy}" stroke-width="9"/><path d="M${x - 20} -14 l12 -6" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".85"/>`).join('') +
  `<path d="M-4 -6 Q0 -14 4 -6" stroke="${GFC.navy}" stroke-width="8" fill="none"/><rect x="84" y="-26" width="20" height="12" rx="4" fill="${glow ? '#7FD8FF' : '#9AA6B8'}" stroke="${INK}" stroke-width="3"/></g>`;
/* 기게스의 반지(받침에 파란 돌). turn 0~1: 받침이 손바닥 쪽으로 돈다 */
const gyRing = (t = 0, turn = 0) => { const a = turn * Math.PI, by = -Math.cos(a) * 52, front = Math.cos(a) > -0.15, bs = 0.55 + 0.45 * Math.abs(Math.cos(a));
  const bez = `<g transform="translate(0 ${f1(by)}) scale(1 ${f1(bs)})"><rect x="-22" y="-14" width="44" height="28" rx="8" fill="#E8A92A" stroke="${INK}" stroke-width="6"/><path d="M0 -36 L18 -18 L0 2 L-18 -18 Z" fill="#7FD8FF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-6 -26 l6 -4" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>`;
  return `<g>${front ? '' : bez}<ellipse cx="0" cy="8" rx="48" ry="42" fill="none" stroke="${INK}" stroke-width="22"/><ellipse cx="0" cy="8" rx="48" ry="42" fill="none" stroke="#FFC93C" stroke-width="12"/><path d="M-32 -16 Q-40 2 -40 20" stroke="#FFF1B0" stroke-width="5" fill="none" stroke-linecap="round"/>${front ? bez : ''}${gfTwinkle(t, 30, -60, 15, 2, '#fff')}</g>`; };
/* 보는 눈 아이콘: open 0(감음)~1 */
const gyEye = (open = 1, s = 1) => { const ry = 30 * clamp(open, 0.06, 1); return `<g transform="scale(${s})"><path d="M-54 0 Q0 ${f1(-ry * 1.7)} 54 0 Q0 ${f1(ry * 1.7)} -54 0 Z" fill="#fff" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` +
  (open > 0.35 ? `<circle r="${f1(17 * Math.min(1, open * 1.3))}" fill="${GFC.navy}"/><circle cx="6" cy="-6" r="5" fill="#fff"/>` : `<path d="M-40 4 Q0 22 40 4" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`) + `</g>`; };
/* 낡은 몽당연필(손 중심 기준) — 끝 장면 복선 */
const GY_PENCIL = `<g transform="rotate(28)"><rect x="-7" y="-58" width="14" height="58" rx="3" fill="#FFD36E" stroke="${INK}" stroke-width="4"/><path d="M-7 -40 h14 M-7 -22 h14" stroke="#E0A84A" stroke-width="3"/><path d="M-7 0 L0 18 L7 0 Z" fill="#F2D6B3" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-2.5 12 L0 18 L2.5 12 Z" fill="${INK}"/><rect x="-7" y="-66" width="14" height="10" rx="2" fill="#FF9AA8" stroke="${INK}" stroke-width="3"/></g>`;
/* 유혹(우리 캐릭터): 보라 불꽃 몸 + 작은 뿔 + 씩 웃음 */
function gyImp(t, s = 1, grin = 1) { const sw = Math.sin(t * 3.2) * 5;
  return `<g transform="scale(${s}) rotate(${f1(sw * 0.5)})"><path d="M0 -122 Q22 -96 40 -100 Q30 -76 54 -46 Q66 -10 62 18 Q58 84 0 88 Q-58 84 -62 18 Q-66 -10 -54 -46 Q-30 -76 -40 -100 Q-22 -96 0 -122 Z" fill="#9B6BFF" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>` +
    `<path d="M-30 -58 L-48 -100 L-12 -70 Z M30 -58 L48 -100 L12 -70 Z" fill="#FF6B9A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><ellipse cx="-20" cy="-6" rx="9" ry="13" fill="${INK}"/><ellipse cx="20" cy="-6" rx="9" ry="13" fill="${INK}"/><circle cx="-17" cy="-11" r="3.5" fill="#fff"/><circle cx="23" cy="-11" r="3.5" fill="#fff"/>` +
    `<path d="M-30 ${f1(20 - 4 * grin)} Q0 ${f1(30 + 26 * grin)} 30 ${f1(20 - 4 * grin)} Q0 34 -30 ${f1(20 - 4 * grin)} Z" fill="#5A1E2A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M-60 24 Q-90 4 -96 -22 M60 24 Q90 4 96 -22" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="-36" cy="16" rx="8" ry="5" fill="#FF9BB0" opacity=".8"/><ellipse cx="36" cy="16" rx="8" ry="5" fill="#FF9BB0" opacity=".8"/></g>`; }
/* 투명해짐: k 0(보임)~1(점선 테두리만) */
const gyGhost = (inner, k) => k <= 0.01 ? inner : `<g opacity="${f1((1 - 0.88 * k) * 100) / 100}">${inner}</g><g filter="url(#gyOutline)" mask="url(#gyStripes)" opacity="${f1(Math.min(1, k * 1.4) * 100) / 100}">${inner}</g>`;

/* ---------- 사람들 ---------- */
const gyZero = (o, m = {}) => gfActor(SPZW, Object.assign({ t: o.t, seed: 3, look: [0, 0] }, o, { ex: fEx(o.ex || 'z기본'), headFx: o.noGlass ? null : gyGlassFx(o.glow || 0) }), m);
/* 책상 앞 제로: 제로 → 책상 → 책상 위 손(+연필)을 다시 그려 손이 책상 위에 보이게. d: 책상 옵션(+ gray) */
function gyAtDesk(o, m = {}, d = {}) {
  const mm = gfM(m), s = o.s || 1, pz = P[o.pose] || P['책상'];
  const hp = hh => [o.x + (mm.dx || 0) + (hh[0] - 200) * s * mm.sx, o.y + mm.dy + (hh[1] - 560) * s * mm.sy];
  const desk = gyDesk(o.x, o.y + 6, s, d), L = hp(pz.hL), R = hp(pz.hR);
  let h = gyZero(o, m) + (d.gray ? `<g filter="url(#gyGray)">${desk}</g>` : desk);
  if (o.pose !== 'gy톡') h += (o.holdR ? `<g transform="translate(${f1(R[0])} ${f1(R[1])}) scale(${s})">${o.holdR}</g>` : '') + hand(R[0], R[1], s);
  return h + hand(L[0], L[1], s);
}
const GY_PROC = o => spMan(o, { vest: '#4A5A78', suit: true, collar: true, tie: '#2E3440', hair: '#3A3A3A', lanyard: true });
const GY_PL = o => HALO(char(Object.assign({ goggles: 'none', vest: '#F2EEE4', patch: false, tee: true, vshade: 'rgba(0,0,0,0.12)', beard: '#C8C8C8', hair: '#C8C8C8', toga: '#F4F1EA', togaStripe: '#3E7CB1' }, o)));   // 플라톤(막대 인물)
const GY_GG = o => HALO(char(Object.assign({ goggles: 'none', vest: '#C98A4B', patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', hair: '#5A3A2E', toga: '#E9C99A', togaStripe: '#A0642E' }, o)));   // 양치기 기게스
const GY_CROWN = `<path d="M136 84 L128 26 L166 56 L200 14 L234 56 L272 26 L264 84 Z" fill="#FFD84A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><circle cx="200" cy="58" r="9" fill="#FF6B6B" stroke="${INK}" stroke-width="4"/>`;
const GY_KG = o => HALO(char(Object.assign({ goggles: 'none', vest: '#B03A48', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', beard: '#7A4A32', hair: '#7A4A32', robe: '#B03A48' }, o)));   // 리디아 왕
const GY_GD = o => spMan(o, { vest: '#7A8AA0', hair: '#3A3A3A' });   // 경비병
const GY_CROOK = `<path d="M0 70 L0 -150 Q0 -196 38 -196 Q72 -196 72 -164" stroke="#8A5A32" stroke-width="12" fill="none" stroke-linecap="round"/>`;
const GY_SPEAR = `<path d="M0 90 L0 -230" stroke="#8A5A32" stroke-width="10" stroke-linecap="round"/><path d="M0 -276 L16 -226 L-16 -226 Z" fill="#C9D3E0" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
const GY_SCROLL = `<g transform="rotate(-12)"><rect x="-16" y="-70" width="32" height="120" rx="12" fill="#F6E7C8" stroke="${INK}" stroke-width="5"/><rect x="-22" y="-78" width="44" height="14" rx="6" fill="#B98552" stroke="${INK}" stroke-width="4"/><rect x="-22" y="44" width="44" height="14" rx="6" fill="#B98552" stroke="${INK}" stroke-width="4"/></g>`;
function gySheep(x, y, s, t, seed = 0) { const b = Math.abs(Math.sin(t * 2 + seed)) * 4, hd = Math.sin(t * 1.4 + seed) * 6;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><ellipse cx="0" cy="6" rx="86" ry="14" fill="${GFC.navy}" opacity=".18"/><rect x="-46" y="-40" width="14" height="44" rx="6" fill="${INK}"/><rect x="28" y="-40" width="14" height="44" rx="6" fill="${INK}"/>`;
  h += `<g transform="translate(0 ${f1(-b)})">` + [[-40, -70, 34], [-8, -86, 38], [28, -74, 34], [44, -54, 28], [-50, -50, 28], [0, -54, 40]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="6"/>`).join('') +
    [[-40, -70, 30], [-8, -86, 34], [28, -74, 30], [44, -54, 24], [-50, -50, 24], [0, -54, 36]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/>`).join('');
  h += `<g transform="translate(66 ${f1(-74 + hd * 0.3)}) rotate(${f1(hd)})"><ellipse cx="0" cy="0" rx="30" ry="36" fill="#3B3A45" stroke="${INK}" stroke-width="6"/><ellipse cx="-24" cy="-14" rx="14" ry="8" fill="#3B3A45" stroke="${INK}" stroke-width="5"/><ellipse cx="22" cy="-14" rx="14" ry="8" fill="#3B3A45" stroke="${INK}" stroke-width="5"/><circle cx="-9" cy="-2" r="5" fill="#fff"/><circle cx="11" cy="-2" r="5" fill="#fff"/></g></g></g>`;
  return h; }

/* ---------- HUD(카메라 밖) ---------- */
function gyHud(lt, o = {}) {
  const sec = Math.max(0, 300 - Math.floor(o.clock || 0)), txt = `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
  let h = fkAt(380, 64, gfChip('STAGE · 인생 결정짓는 최종 시험', { size: 30, bg: GFC.sun }), (o.kS == null ? 1 : o.kS) * 1.2, -2);
  const hp = o.hp == null ? 12 : o.hp, sh = o.hpT != null ? gfShake(lt, o.hpT, 9, 0.3) : [0, 0];
  h += fkAt(340 + sh[0], 158 + sh[1], gfPanel(470, 74, { r: 30 }) + gfT(-205, 11, '멘탈 HP', 28, GFC.navy, { anchor: 'start' }) + `<g transform="translate(-72 0)">${gfBar(180, hp / 100, { col: hp < 30 ? '#FF5A5A' : GFC.mint, h: 24 })}</g>` + gfT(218, 11, `${Math.round(hp)}/100`, 28, hp < 30 ? '#E5484D' : GFC.navy, { anchor: 'end' }), (o.kH == null ? 1 : o.kH) * 1.2);
  const pulse = o.tT != null ? gfBeat(lt, o.tT, 0.2, 4, 7) : 1;
  h += fkAt(1630, 104, gfPanel(380, 120, { r: 34 }) + `<g transform="translate(-130 0)">${gfIcon('clock', 1.15, lt)}</g>` + gfT(-80, -14, '남은 시간', 26, '#6B7280', { anchor: 'start', wt: 800 }) + gfT(-80, 36, txt, 54, sec < 300 && sec % 2 ? '#E5484D' : '#E5484D', { anchor: 'start' }), (o.kT == null ? 1 : o.kT) * pulse * 1.2);
  return h;
}

/* ---------- 시험장 ---------- */
function gyDesk(x, y, s, o = {}) { // 살짝 내려다본 책상(원점 = 앞면 바닥 가운데)
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})">`;
  h += `<rect x="-246" y="-150" width="492" height="150" rx="8" fill="#AEB9C8" stroke="${INK}" stroke-width="7"/><rect x="-246" y="-150" width="492" height="22" fill="#97A3B4"/>`;
  h += `<path d="M-214 -224 L214 -224 L262 -156 L-262 -156 Z" fill="#E7C89A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-262" y="-160" width="524" height="22" rx="6" fill="#C99E66" stroke="${INK}" stroke-width="6"/>`;
  if (o.paper !== false) h += `<path d="M-88 -216 L88 -216 L108 -168 L-108 -168 Z" fill="#FFFDF5" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` + [0, 1, 2].map(i => `<line x1="${-74 - i * 6}" y1="${-204 + i * 13}" x2="${74 + i * 6}" y2="${-204 + i * 13}" stroke="#9AA6B8" stroke-width="3"/>`).join('');
  if (o.glasses != null) h += `<g transform="translate(170 -196) scale(.42)">${gyGlasses(o.glasses, o.t || 0)}</g>`;
  return h + (o.extra || '') + `</g>`;
}
function gyBackRoom(t, o = {}) { // 시험장 뒤쪽 벽(제로 얼굴 쪽에서 본 방)
  let h = gfRoom({ fy: 700, wall: '#E4EEF2', wall2: '#CFE0E8', floor: '#D9C3A0', base: '#F3F7F9', dots: false });
  h += gfWindow(120, 170, 300, 260, t);
  h += `<g transform="translate(960 250)"><rect x="-300" y="-92" width="600" height="184" rx="18" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="-282" y="-74" width="564" height="148" rx="10" fill="#FFF3F3" stroke="#E5484D" stroke-width="6"/>` +
    `<circle cx="-200" cy="0" r="46" fill="#fff" stroke="#E5484D" stroke-width="9"/><g transform="translate(-200 0) scale(.62)">${gyGlasses(0)}</g><line x1="-232" y1="-32" x2="-168" y2="32" stroke="#E5484D" stroke-width="9" stroke-linecap="round"/>` +
    gfT(50, -6, '전자기기', 52, '#E5484D') + gfT(50, 50, '사용 금지', 46, GFC.navy) + `</g>`;
  h += gfClock(1500, 330, 70, 11, 55 + Math.min(4, (o.clock || 0) / 60));
  return h;
}
function gyExaminees(t, o = {}) {
  let h = '';
  [[330, 0, 'z결심'], [620, 4, 'z멍'], [1300, 5, 'z결심'], [1590, 7, 'z당황']].forEach(([x, i, ex], k) => {
    const wr = Math.sin(t * 6 + k * 2.1) * 2.5;
    const fx = o.glowOthers ? (() => `<circle cx="236" cy="190" r="${f1(46 + 8 * Math.sin(t * 4 + k))}" fill="url(#gyLensGlow)" opacity="${f1(o.glowOthers * (k % 2 ? 0.9 : 0) * 100) / 100}"/>`) : null;
    h += gfActor(spPass(i), { x, y: 800, s: 0.6, t, pose: '책상', ex: fEx(ex), look: [0, 0.7], seed: 20 + k, headFx: fx }, { dy: wr * 0.4 }) + gyDesk(x, 806, 0.6, {});
  });
  return h;
}
/* 제로 시점 시험지(전체 화면). o: {typ 0~1 정답 입력, ar 0~1 파란 화면, shake, sweat, hand} */
function gyPovPaper(t, lt, o = {}) {
  const sh = o.shake ? [Math.sin(t * 61) * 6 * o.shake, Math.cos(t * 47) * 4 * o.shake] : [0, 0];
  let h = gfFull('#C99E66') + `<rect x="-600" y="-600" width="3120" height="2280" fill="url(#gfDots)" opacity=".25"/>`;
  h += `<g transform="rotate(-2 960 540)"><rect x="372" y="34" width="1180" height="1150" rx="12" fill="${GFC.navy}" opacity=".2"/><rect x="360" y="20" width="1180" height="1150" rx="12" fill="#FFFDF5" stroke="${INK}" stroke-width="8"/>` +
    gfT(950, 108, '자격증 시험 · 2교시', 40, '#6B7280', { wt: 800 }) + `<line x1="420" y1="140" x2="1480" y2="140" stroke="#C9D0DA" stroke-width="4"/>` +
    gfT(420, 230, '서술형 5. 다음 상황에서 가장 알맞은 조치를 쓰시오. (20점)', 38, GFC.navy, { anchor: 'start', wt: 800 }) +
    `<rect x="420" y="276" width="1060" height="470" rx="14" fill="#fff" stroke="#9AA6B8" stroke-width="5" stroke-dasharray="16 10"/>`;
  for (let r = 0; r < 5; r++) h += `<line x1="450" y1="${356 + r * 80}" x2="1450" y2="${356 + r * 80}" stroke="#E3E8EF" stroke-width="3"/>`;
  if (o.typ > 0) { // 정답 글자(파란 막대로) 타이핑
    let n = Math.floor(o.typ * 46), k = 0, last = [470, 340];
    for (let r = 0; r < 5 && k < n; r++) { let x = 470; if (r === 0) { h += gfT(470, 352, '답)', 36, '#2E8BFF'); x = 540; }
      for (let c = 0; c < 10 && k < n; c++, k++) { const w = 46 + 70 * hash(r * 13 + c * 7.1); if (x + w > 1440) break; h += `<rect x="${f1(x)}" y="${322 + r * 80}" width="${f1(w)}" height="26" rx="13" fill="#2E8BFF" opacity=".85"/>`; x += w + 18; last = [x, 322 + r * 80]; } }
    if (Math.floor(t * 4) % 2) h += `<rect x="${f1(last[0])}" y="${last[1] - 6}" width="14" height="38" rx="3" fill="#2E8BFF"/>`;
  }
  h += `</g>`;
  if (o.sweat) for (let i = 0; i < 6; i++) { const p = ((lt * 0.9 + hash(i * 3.3)) % 1), x = 520 + hash(i * 7.7) * 880, y = -40 + p * 900;
    h += `<g transform="translate(${f1(x)} ${f1(y)}) scale(2)"><path d="M0 -26 Q-16 0 -10 10 Q0 20 10 10 Q16 0 0 -26 Z" fill="#9ED8FF" stroke="${INK}" stroke-width="4"/></g>` + (p > 0.85 ? `<ellipse cx="${f1(x)}" cy="${f1(y + 24)}" rx="${f1(30 * (p - 0.85) / 0.15)}" ry="8" fill="#9ED8FF" opacity=".6"/>` : ''); }
  // 두 손(동그라미) + 몽당연필
  const hk = o.shake || 0, rot = Math.sin(t * 55) * 7 * hk;
  h += `<g transform="translate(${f1(1270 + sh[0])} ${f1(820 + sh[1])}) rotate(${f1(rot)})"><g transform="scale(3.2)">${GY_PENCIL}</g><circle cx="0" cy="0" r="66" fill="#fff" stroke="${INK}" stroke-width="12"/></g>`;
  h += `<circle cx="${f1(560 - sh[0] * 0.5)}" cy="${f1(930 + sh[1] * 0.5)}" r="66" fill="#fff" stroke="${INK}" stroke-width="12"/>`;
  if (hk > 0) h += [0, 1, 2].map(i => `<path d="M${1370 + i * 18} ${740 - i * 26} q14 -10 0 -22 q-14 -10 0 -22" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`).join('');
  if (o.ar > 0) { // 파란 AR 덮개: 격자 + 훑는 선 + 모서리 괄호
    const k = o.ar, sy = 40 + ((lt * 0.75) % 1) * 960;
    h += `<g opacity="${f1(k * 100) / 100}"><rect x="-600" y="-600" width="3120" height="2280" fill="#2E8BFF" opacity=".1"/><rect x="-600" y="-600" width="3120" height="2280" fill="url(#gyGrid)"/>` +
      `<rect x="-600" y="${f1(sy - 4)}" width="3120" height="8" fill="#7FD8FF" opacity=".75"/><rect x="-600" y="${f1(sy - 60)}" width="3120" height="56" fill="#7FD8FF" opacity=".12"/>` +
      [[404, 258, 1, 1], [1500, 258, -1, 1], [404, 770, 1, -1], [1500, 770, -1, -1]].map(([x, y, dx, dy]) => `<path d="M${x} ${y + dy * 60} L${x} ${y} L${x + dx * 60} ${y}" stroke="#3FA9FF" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('') + `</g>`;
  }
  return h;
}
/* 안경 너머로 보는 테두리(제로 시점) */
const gyLensView = (k = 1) => `<path fill-rule="evenodd" fill="${GFC.navy}" opacity="${f1(0.88 * k * 100) / 100}" d="M-700 -700 H2620 V1780 H-700 Z M80 60 H898 Q948 60 948 110 V1010 Q948 1060 898 1060 H80 Q30 1060 30 1010 V110 Q30 60 80 60 Z M1022 60 H1840 Q1890 60 1890 110 V1010 Q1890 1060 1840 1060 H1022 Q972 1060 972 1010 V110 Q972 60 1022 60 Z"/>` +
  `<path d="M948 120 Q960 108 972 120" stroke="${GFC.navy}" stroke-width="18" fill="none" opacity="${f1(0.88 * k * 100) / 100}"/>`;
/* 앞쪽(칠판 쪽) 교실: 제로가 고개를 들어 보는 쪽 */
function gyFrontRoom(t, clock = 0) {
  let h = gfRoom({ fy: 760, wall: '#E4EEF2', wall2: '#CFE0E8', floor: '#D9C3A0', base: '#F3F7F9', dots: false });
  h += `<rect x="440" y="140" width="1040" height="400" rx="18" fill="#C99E66" stroke="${INK}" stroke-width="8"/><rect x="466" y="166" width="988" height="348" rx="10" fill="#3E6B57"/>` +
    gfT(960, 300, '자격증 시험', 70, '#F4F1E6') + gfT(960, 400, '종료 5분 전', 54, '#FFE38A') + `<path d="M600 458 q60 -18 120 0 t120 0 t120 0" stroke="#F4F1E6" stroke-width="5" fill="none" opacity=".55"/>`;
  h += `<path d="M1260 760 L1270 610 L1520 610 L1530 760 Z" fill="#B98552" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="1240" y="592" width="310" height="28" rx="8" fill="#D7A46E" stroke="${INK}" stroke-width="6"/>`;
  h += gfClock(1720, 250, 64, 11, 55 + Math.min(4, clock / 60));
  return h;
}
const gyAR = (w, text, o = {}) => `<g><rect x="${-w / 2}" y="-44" width="${w}" height="88" rx="18" fill="#0E2A52" fill-opacity=".82" stroke="#3FA9FF" stroke-width="5"/><rect x="${-w / 2 + 10}" y="-34" width="${w - 20}" height="68" rx="12" fill="none" stroke="#7FD8FF" stroke-width="2" opacity=".6"/>` + gfT(0, 15, text, o.size || 40, o.col || '#BFF0FF') + `</g>`;

/* ---------- 오프닝 장면 ---------- */
gyexamScene = function (t, lt, a, runLt) {
  const ph = a.ph, D = a._dur || 4, FY = GY.FY, ZX = GY.ZX, clock = runLt || lt;
  let h = fkDefs() + GY_DEFS, hud = { clock }, w = '', cam = [960, 560, 1];
  const room = (o = {}) => gyBackRoom(t, { clock }) + gyExaminees(t, o) + (o.proc || '');
  if (ph === 0) { // 시험 종료 5분 전
    const tT = gyW(a, '5분', 0.9);
    cam = camLerp(lt / D, [960, 560, 1.0], [960, 600, 1.1]);
    w = room() + gyAtDesk({ x: ZX, y: FY, s: 1, t, pose: 'gy쓰기', ex: lt > tT ? 'z충격' : 'z멍', look: [0, 0.5], holdR: GY_PENCIL }, lt > tT ? gfJelly(lt, tT, 0.12, 5, 8) : {}, {});
    if (lt > tT) w += gfEmote(lt, tT, ZX + 150, FY - 560, 'bang', { hold: 1.4 });
    h += qCam(cam, w); hud.kS = gfIn(lt, 0.05, 3, 0.45); hud.kH = gfIn(lt, 0.3, 3, 0.45); hud.kT = gfIn(lt, tT - 0.3, 3, 0.45); hud.tT = tT;
  } else if (ph === 1) { // 머릿속은 하얗게, 손은 벌벌
    const tW = gyW(a, '하얗게', 0.6), tH = gyW(a, '손은', 1.3) - 0.1;
    if (lt < tH) {
      cam = camLerp(lt / 0.6, [960, 600, 1.1], [960, 470, 1.55]);
      w = room() + gyAtDesk({ x: ZX, y: FY, s: 1, t, pose: 'gy쓰기', ex: 'z멘붕', look: [0, -0.2], holdR: GY_PENCIL, sweat: true }, {}, {});
      if (lt > tW - 0.1) { const k = gfIn(lt, tW - 0.1, 3, 0.45); w += fkAt(ZX + 250, FY - 640, `<g transform="scale(${f1(k * 1000) / 1000})">${bubble(0, 0, 300, 170, `<circle cx="-50" cy="0" r="8" fill="#C9D0DA"/><circle cx="0" cy="0" r="8" fill="#C9D0DA"/><circle cx="50" cy="0" r="8" fill="#C9D0DA"/>`)}</g>`); }
      h += qCam(cam, w);
    } else { h += gyPovPaper(t, lt - tH, { shake: 1, sweat: true }); }
    hud.hp = lt > tH ? 9 : 12; hud.hpT = tH;
  } else if (ph === 2) { // 안경테를 톡 → 정답이 실시간으로
    const tB = gyW(a, '바로', 0.15), tK = gyW(a, '톡', 1.75), tE = gyW(a, '눈앞', 2.6) - 0.15, tA = gyW(a, '정답', 3.4);
    if (lt < tE) {
      cam = camLerp((lt - 0) / 0.7, [960, 520, 1.5], [960, 500, 1.6]);
      const raise = lt > tK - 0.35, glow = gfK(tK, tK + 0.35, lt);
      w = room() + gyAtDesk({ x: ZX, y: FY, s: 1, t, pose: raise ? 'gy톡' : 'gy쓰기', ex: lt > tK ? 'z반짝' : lt > tB ? 'z결심' : 'z멘붕', look: [0.2, -0.2], holdR: raise ? null : GY_PENCIL, glow, sweat: lt < tK }, lt > tK ? gfJelly(lt, tK, 0.08, 5, 8) : {}, { extra: raise ? `<g transform="translate(90 -190) rotate(-20)">${GY_PENCIL}</g>` : '' });
      const tp = [ZX + 112, FY - 382]; w += gfRing(lt, tK, tp[0], tp[1], 10, 90, '#7FD8FF', 10, 0.4) + gfStarBurst(lt, tK, tp[0], tp[1], { n: 6, r0: 20, r1: 110, cols: ['#7FD8FF', '#fff', GFC.sun] }) + gfPlus(lt, tK, tp[0] + 80, tp[1] - 40, '톡!', { size: 54, col: '#3FA9FF' });
      h += qCam(cam, w);
    } else {
      const ar = gfK(tE, tE + 0.4, lt), typ = gfK(tA, D - 0.2, lt);
      h += gyPovPaper(t, lt, { ar, typ }) + gyLensView(0.55 * ar);
      if (lt > tE + 0.2) h += fkAt(760, 880, gyAR(560, 'AI 글래스 · 스텔스 모드 ON', { size: 34 }), gfIn(lt, tE + 0.2, 3.2, 0.45), -2);
      if (lt > tA) h += fkAt(1300, 290, gfChip('정답 입력 중…', { size: 34, bg: '#BFF0FF' }), gfIn(lt, tA, 3.4, 0.45), 3);
    }
    hud.hp = lt > tA ? 12 + 30 * gfK(tA, D, lt) : 9; hud.hpT = tA;
  } else if (ph === 3) { // 감독관은 눈치채지 못하고, 적발 확률은 0.01%
    const tN = gyW(a, '눈치', 0.75), tP = gyW(a, '0', 2.75), u = lt / D;
    let r = gyFrontRoom(t, clock);
    const px = lerp(500, 900, u), wk = gfWalk(px * 1.3, 0.8), PS = 1.0, PY = 800;
    r += gfActor(GY_PROC, { x: px, y: PY, s: PS, t, pose: wk.pose, ex: fEx(lt > tN ? 'z멍' : 'z의심'), look: [Math.sin(lt * 1.6) * 0.7, 0], seed: 40 }, { sy: wk.sy, dy: wk.dy });
    if (lt > tN) r += gfEmote(lt, tN, px + 100, PY - 590 * PS, 'dots', { hold: 2.2 });
    // 앞사람 뒤통수 둘 + 내 책상 끝
    r += [[420, 0], [1560, 1]].map(([x, i]) => `<circle cx="${x}" cy="900" r="120" fill="${['#3A2E2A', '#2B2B2B'][i]}" stroke="${INK}" stroke-width="8"/><path d="M${x - 190} 1100 Q${x - 180} 990 ${x} 990 Q${x + 180} 990 ${x + 190} 1100 Z" fill="${['#5E6A8C', '#8FB8E8'][i]}" stroke="${INK}" stroke-width="8"/>`).join('');
    // AR: 감독관 표시
    const ry0 = PY - 560 * PS - 30, k = gfK(0, 0.3, lt);
    r += `<g opacity="${f1(k * 100) / 100}">` + [[px - 150, ry0, 1, 1], [px + 150, ry0, -1, 1], [px - 150, PY + 20, 1, -1], [px + 150, PY + 20, -1, -1]].map(([x, y, dx, dy]) => `<path d="M${f1(x)} ${f1(y + dy * 50)} L${f1(x)} ${f1(y)} L${f1(x + dx * 50)} ${f1(y)}" stroke="#3FA9FF" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('') +
      fkAt(px, ry0 - 50, gyAR(220, '감독관', { size: 32 })) + `</g>`;
    h += `<g>${r}</g><rect x="-600" y="-600" width="3120" height="2280" fill="#2E8BFF" opacity=".08"/><rect x="-600" y="-600" width="3120" height="2280" fill="url(#gyGrid)" opacity=".5"/>` + gyLensView(0.55);
    if (lt > tP - 0.2) { const k2 = gfIn(lt, tP - 0.2, 3, 0.45);
      h += fkAt(1400, 470, gyAR(560, '', {}) + gfT(0, 12, '감독관 적발 확률', 36, '#BFF0FF'), k2) + fkAt(1400, 600, gfT(0, 0, '0.01%', 120, '#7FFFC8', { sw: 14, stroke: '#0E2A52' }), k2 * gfBeat(lt, tP + 0.4, 0.18, 4, 7)); }
    hud.hp = 42;
  } else if (ph === 4) { // 자, 솔직하게 한번 상상해 볼까요? — 멈춤 + 제로가 시청자를 본다
    const tS = gyW(a, '솔직', 0.55), tI = gyW(a, '상상', 1.3);
    cam = camLerp(lt / D, [960, 560, 1.0], [960, 470, 1.45]);
    w = `<g filter="url(#gyGray)">${room()}</g>` + gyAtDesk({ x: ZX, y: FY, s: 1, t, pose: '책상', ex: lt > tS ? 'z히죽' : 'z멍', look: [0, 0], glow: 0.6 }, lt > tS ? gfJelly(lt, tS, 0.08, 5, 8) : {}, { gray: true });
    if (lt > tI) w += gfEmote(lt, tI, ZX + 160, FY - 570, 'q', { hold: 2 });
    h += qCam(cam, w) + fkAt(960, 66, gfChip('일시정지', { size: 40, bg: '#fff' }) + `<g transform="translate(-118 0)"><rect x="-14" y="-18" width="10" height="36" rx="3" fill="${GFC.navy}"/><rect x="4" y="-18" width="10" height="36" rx="3" fill="${GFC.navy}"/></g>`, gfIn(lt, 0.05, 3.2, 0.45));
    hud.hp = 42;
  } else { // 아무도 모른다는 100%의 확신 → 쓰시겠습니까?
    const tN = gyW(a, '아무도', 0.15), t1 = gyW(a, '100', 1.15), tY = gyW(a, '여러분', 2.85), tQ = gyW(a, '쓰시겠', 5.1);
    h += gfFull('url(#gyNavy)') + gfRays(t, 960, 400, 900, '#7FD8FF', 14, 0.08, 8);
    for (let i = 0; i < 6; i++) { const an = -Math.PI / 2 + (i - 2.5) * 0.5, x = 960 + Math.cos(an) * 560 * 1.15, y = 470 + Math.sin(an) * 330 + (i === 0 || i === 5 ? 120 : 0), cl = gfK(tN + 0.2 + i * 0.1, tN + 0.45 + i * 0.1, lt);
      h += fkAt(x, y + Math.sin(t * 2 + i) * 6, gyEye(1 - cl, 0.9), gfIn(lt, 0.05 + i * 0.05, 3, 0.45)) + (cl > 0.9 ? fkAt(x, y, `<path d="M-40 -30 L40 30 M40 -30 L-40 30" stroke="#E5484D" stroke-width="9" stroke-linecap="round"/>`, gfIn(lt, tN + 0.45 + i * 0.1, 4, 0.4)) : ''); }
    h += fkAt(960, 470, gfItem(lt, 0.1, { svg: `<g transform="scale(1.5)">${gyGlasses(1, t)}</g>`, name: 'AI 안경', sub: '아무도 모른다', w: 480 }), 1.25);
    if (lt > t1 - 0.2) { const k = gfK(t1 - 0.1, t1 + 0.5, lt); h += fkAt(960, 690, gfPanel(560, 76, { r: 30 }) + gfT(-250, 12, '확신', 30, GFC.navy, { anchor: 'start' }) + `<g transform="translate(-160 0)">${gfBar(300, k, { col: GFC.mint, h: 26 })}</g>` + gfT(250, 12, `${Math.round(100 * k)}%`, 32, GFC.navy, { anchor: 'end' }), gfIn(lt, t1 - 0.2, 3.2, 0.45) * gfBeat(lt, t1 + 0.5, 0.12, 4, 8)); }
    if (lt > tY) { const k = gfIn(lt, tY, 3, 0.45), cur = lt > tQ ? Math.floor((lt - tQ) * 2.2) % 2 : 0;
      h += fkAt(960, 840, gfPanel(760, 120, { r: 30, head: '선택', headBg: GFC.sun }) + [['쓴다', -190], ['안 쓴다', 190]].map(([s, x], i) => `<g transform="translate(${x} 0)">${i === cur ? `<rect x="-150" y="-36" width="300" height="72" rx="36" fill="${GFC.sun}" opacity=".55"/>` : ''}${gfT(0, 16, s, 44, GFC.navy)}${i === cur ? `<path d="M-130 -16 L-100 0 L-130 16 Z" fill="${GFC.navy}"/>` : ''}</g>`).join(''), k * 1.1); }
    hud.hp = 42;
  }
  return h + gyHud(lt, hud);
};
