/* 하루는 작은 일생 편 — 게임 감각 층(zw/gf.js) 장면. 새 이름은 모두 od 접두사.
   한 편을 꿰는 표시: 일생 바(탄생 → 청춘 → 장년 → 노년 → 잠)와 길잡이 '하루'(해 꼬마, 아기 → 노인 → 별로 저장).
   물리 규칙: 침대에서는 허리까지 이불 · 폰은 두 손 위치에, 뒷면만 카메라 쪽 · 화면은 제로 시점에서만 · 누르는 손가락 없음. */
Object.assign(GF.names, { S: ['서윤', '#E8739A'], O: ['엄마', '#E58A3A'] });
window.GFR = { boil: false, vig: false, flash: false, study: false, sub: gfSubtitle,
  over: t => gfTransition(t, { k0: ['iris', 1500, 560, 960, 540], n1: ['iris', 960, 540, 1010, 470], p1: 'bands', p5: ['iris', 960, 540, 760, 460], t1: 'bands' }) };
['odbed', 'odnight', 'odpend', 'odbook', 'odlife', 'odmorn', 'odmine', 'odtitle', 'odquest'].forEach(k => CAMS[k] = 'fixed');
const OD = { FY: 900, MT: 640 };   // 바닥선, 매트리스 윗면
const odW = (a, key, fb, n = 0) => { const m = (a._words || []).filter(x => x.w.replace(/\s/g, '').includes(key)); return m[n] ? m[n].t + 0.15 : fb; };
const odAt = (x, y, inner, sc = 1, rot = 0) => sc < 0.02 ? '' : `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(sc * 1000) / 1000})">${inner}</g>`;
const odTint = (col, k) => k > 0.004 ? `<rect x="-600" y="-600" width="3120" height="2280" fill="${col}" opacity="${f1(k * 1000) / 1000}"/>` : '';
const odSleepEx = { expr: '잠', prev: '잠', k: 1, blink: 0 };
const odRot = (x, y, deg) => { const r = deg * Math.PI / 180; return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)]; };
/* 인물: 집의 제로는 주황 티(Z), 쇼펜하우어는 양옆으로 뻗친 흰 머리 + 어두운 코트 + 흰 넥타이 */
const OD_TUFT = `<g fill="#F4F4F4" stroke="${INK}" stroke-width="6" stroke-linejoin="round">${[-1, 1].map(sd => { const c = 200 + sd * 96, X = d => f1(c + sd * d); return `<path d="M${X(0)} 96 L${X(74)} 58 L${X(46)} 112 L${X(104)} 118 L${X(52)} 158 L${X(96)} 196 L${X(34)} 200 L${X(56)} 240 L${X(4)} 214 Z"/>`; }).join('')}</g>`;
const OSCH = o => HALO(char(Object.assign({ goggles: 'none', vest: '#3B3F4E', patch: false, tee: true, vshade: 'rgba(0,0,0,0.3)', collar: true, tie: '#F4F1EA', hairBack: OD_TUFT, browW: 15, seed: 71 }, o)));
P['od폰'] = Object.assign({}, P['f앉기'], { armL: P['폰보기'].armL, hL: P['폰보기'].hL, armR: P['폰보기'].armR, hR: P['폰보기'].hR });
P['od기지개'] = Object.assign({}, P['f앉기'], { armL: P['만세'].armL, hL: P['만세'].hL, armR: P['만세'].armR, hR: P['만세'].hR });

/* ===== 하루(해 꼬마) ===== age 0 아기 · 1 청춘 · 2 장년 · 3 노년, star 0~1(별로 바뀜), mood happy|cry|sad|sleep|wow ===== */
function odHaru(x, y, s, t, o = {}) {
  const age = o.age || 0, star = clamp(o.star || 0, 0, 1), mood = o.mood || 'happy', bob = (o.still ? 0 : Math.sin(t * 3.1 + (o.seed || 0)) * 5) + (o.dy || 0);
  const COL = ['#FFF07A', '#FFD84A', '#FFB347', '#FF9A72'], col = COL[Math.round(clamp(age, 0, 3))], R = 48;
  let h = '';
  if (star < 0.99) {
    const len = [0.3, 0.56, 0.5, 0.36][Math.round(clamp(age, 0, 3))], spin = t * (age === 3 ? 8 : 22), droop = age === 3 ? 1 : 0;
    let rays = ''; for (let i = 0; i < 8; i++) rays += `<rect x="-7" y="${f1(-R * (1.12 + len))}" width="14" height="${f1(R * len)}" rx="7" fill="${col}" stroke="${INK}" stroke-width="5" transform="rotate(${f1(i * 45 + spin + (droop ? Math.sin(i) * 6 : 0))})"/>`;
    let face = `<circle r="${R}" fill="${col}" stroke="${INK}" stroke-width="7"/><ellipse cx="-14" cy="-20" rx="12" ry="7" fill="#fff" opacity=".45"/>`;
    const ey = age === 3 ? -2 : -6;
    if (mood === 'sleep') face += `<path d="M-24 ${ey} Q-16 ${ey + 7} -8 ${ey}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M8 ${ey} Q16 ${ey + 7} 24 ${ey}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    else if (mood === 'cry') face += `<path d="M-24 ${ey - 6} L-12 ${ey} L-24 ${ey + 6}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 ${ey - 6} L12 ${ey} L24 ${ey + 6}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` +
      [-1, 1].map(sd => `<path d="M${sd * 20} ${ey + 10} Q${sd * 24} ${f1(ey + 22 + Math.abs(Math.sin(t * 6)) * 6)} ${sd * 18} ${f1(ey + 28 + Math.abs(Math.sin(t * 6)) * 6)}" fill="#9ED8FF" stroke="${INK}" stroke-width="3"/>`).join('');
    else face += `<ellipse cx="-15" cy="${ey}" rx="5.5" ry="${mood === 'sad' ? 5 : 7.5}" fill="${INK}"/><ellipse cx="15" cy="${ey}" rx="5.5" ry="${mood === 'sad' ? 5 : 7.5}" fill="${INK}"/><circle cx="-13" cy="${ey - 3}" r="2" fill="#fff"/><circle cx="17" cy="${ey - 3}" r="2" fill="#fff"/>`;
    if (mood === 'sad') face += `<path d="M-24 ${ey - 14} L-8 ${ey - 9} M24 ${ey - 14} L8 ${ey - 9}" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
    face += `<ellipse cx="-27" cy="12" rx="8" ry="5" fill="#FF8FA8" opacity=".75"/><ellipse cx="27" cy="12" rx="8" ry="5" fill="#FF8FA8" opacity=".75"/>`;
    if (age === 0) face += `<circle cx="0" cy="17" r="10" fill="#7FD6FF" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="17" r="4" fill="#fff"/><path d="M-4 -46 Q-12 -62 2 -64 Q14 -62 6 -52" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    else if (mood === 'cry') face += `<ellipse cx="0" cy="18" rx="11" ry="9" fill="#5A1E2A" stroke="${INK}" stroke-width="4"/>`;
    else if (mood === 'sad') face += `<path d="M-10 22 Q0 14 10 22" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    else if (mood === 'wow') face += `<ellipse cx="0" cy="18" rx="7" ry="9" fill="#5A1E2A" stroke="${INK}" stroke-width="4"/>`;
    else if (mood !== 'sleep') face += `<path d="M-12 14 Q0 28 12 14" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
    else face += `<path d="M-6 17 Q0 21 6 17" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
    if (age === 1) face += gfTwinkle(t, 44, -42, 13, 2, '#fff');
    if (age === 2) face += `<path d="M-9 46 L9 46 L5 56 L12 82 L0 92 L-12 82 L-5 56 Z" fill="${GFC.coral}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    if (age === 3) face += `<path d="M-30 ${ey - 16} Q-20 ${ey - 26} -6 ${ey - 16}" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M30 ${ey - 16} Q20 ${ey - 26} 6 ${ey - 16}" fill="#fff" stroke="${INK}" stroke-width="4"/>` +
      `<circle cx="-15" cy="${ey}" r="12" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="15" cy="${ey}" r="12" fill="none" stroke="${INK}" stroke-width="4"/><line x1="-3" y1="${ey}" x2="3" y2="${ey}" stroke="${INK}" stroke-width="4"/>` +
      (o.cane === false ? '' : `<path d="M44 20 L62 104 M44 20 Q40 6 52 4 Q62 4 60 14" fill="none" stroke="${GFC.wood2}" stroke-width="8" stroke-linecap="round"/><path d="M44 20 L62 104" stroke="${INK}" stroke-width="2" opacity=".4"/>`);
    h += `<g transform="scale(${f1((1 - star) * 1000) / 1000})">${rays}${face}</g>`;
  }
  if (star > 0.01) h += `<g transform="scale(${f1(star * 1000) / 1000}) rotate(${f1(Math.sin(t * 2) * 8)})">${gfStar5(58, GFC.sun, 7)}<path d="M-18 -2 Q-12 4 -6 -2 M6 -2 Q12 4 18 -2" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/><path d="M-6 12 Q0 17 6 12" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/></g>` + (star > 0.5 ? gfTwinkle(t, 52, -40, 12, 3, '#fff') : '');
  const sh = o.shadow === false ? '' : `<ellipse cx="0" cy="${f1(R + 10 - bob)}" rx="${f1(40 * (1 - star * 0.7))}" ry="8" fill="${GFC.navy}" opacity=".18"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${sh}<g transform="translate(0 ${f1(-bob)}) rotate(${f1(o.rot || 0)}) scale(${f1((o.sx || 1) * 1000) / 1000} ${f1((o.sy || 1) * 1000) / 1000})">${h}</g></g>`;
}
/* ===== 일생 바(HUD): cur(지금 칸 0~4), k(나타남), gray(청춘 칸이 폰으로 먹힌 정도), tp(지금 칸이 바뀐 시각) ===== */
const OD_SLOT = [['탄생', 'cradle'], ['청춘', 'sprout'], ['한창', 'sun'], ['노년', 'dusk'], ['잠', 'moon']];
function odSlotIcon(kind, t) {
  if (kind === 'cradle') return `<path d="M-30 -4 Q-30 24 0 24 Q30 24 30 -4 Z" fill="#FFC9D8" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-34 30 Q0 44 34 30" fill="none" stroke="${GFC.wood2}" stroke-width="6" stroke-linecap="round"/><circle cx="-8" cy="-10" r="11" fill="#FFF07A" stroke="${INK}" stroke-width="4"/><path d="M-30 -4 Q-14 -12 2 -4 Q16 -12 30 -4" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
  if (kind === 'sprout') { const sw = Math.sin(t * 3) * 6; return `<path d="M0 26 L0 -2" stroke="#4FA85A" stroke-width="7" stroke-linecap="round"/><g transform="rotate(${f1(sw)} 0 -2)"><path d="M0 -2 Q-30 -6 -30 -26 Q-6 -28 0 -2 Z" fill="#7BDA7F" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M0 -2 Q28 -10 30 -30 Q4 -30 0 -2 Z" fill="#5FC46E" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g><path d="M-20 26 L20 26" stroke="${GFC.wood2}" stroke-width="7" stroke-linecap="round"/>`; }
  if (kind === 'sun') return gfIcon('sun', 0.9, t);
  if (kind === 'dusk') return `<clipPath id="odDuskC"><rect x="-40" y="-40" width="80" height="48"/></clipPath><g clip-path="url(#odDuskC)">${[0, 1, 2, 3, 4].map(i => `<rect x="-4" y="-38" width="8" height="12" rx="4" fill="#FF9A72" stroke="${INK}" stroke-width="3" transform="translate(0 6) rotate(${-60 + i * 30})"/>`).join('')}<circle cx="0" cy="8" r="20" fill="#FF9A72" stroke="${INK}" stroke-width="5"/></g><path d="M-32 8 L32 8" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-22 18 L22 18" stroke="#FFB38A" stroke-width="5" stroke-linecap="round"/>`;
  return gfIcon('moon', 0.85, t);
}
function odLifeBar(t, o = {}) {
  const cur = o.cur == null ? 0 : o.cur, k = o.k == null ? 1 : o.k; if (k < 0.02) return '';
  const n = 5, gap = 120, w = gap * n + 30, hgt = 132; let h = gfPanel(w, hgt, { r: 40, bg: o.night ? '#E9ECFF' : GFC.cream });
  for (let i = 0; i < n; i++) {
    const x = (i - (n - 1) / 2) * gap, done = i < cur, now = i === cur, beat = now && o.tp != null ? gfBeat(t, o.tp, 0.28, 3, 5) : 1, pop = now ? 1 + 0.05 * Math.sin(t * 5) : 1;
    if (i > 0) h += `<path d="M${f1(x - gap + 44)} -12 L${f1(x - 44)} -12" stroke="${i <= cur ? GFC.sun : '#D9CDB0'}" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 14"/>`;
    const fill = now ? GFC.sun : done ? '#FFE9A0' : '#EFE8D8';
    let slot = `<circle r="40" fill="${fill}" stroke="${INK}" stroke-width="6"/>` + `<g opacity="${done || now ? 1 : 0.45}">${odSlotIcon(OD_SLOT[i][1], t)}</g>`;
    if (i === 1 && o.gray > 0.01) { const g = clamp(o.gray, 0, 1); slot += `<clipPath id="odGrayC"><rect x="-42" y="${f1(42 - 84 * g)}" width="84" height="${f1(84 * g)}"/></clipPath><g clip-path="url(#odGrayC)"><circle r="38" fill="#8D93A6"/>${odAt(0, 0, gfIcon('chart', 0.55, t), 1)}</g>`; }
    if (now) slot += `<circle r="${f1(48 + 3 * Math.sin(t * 6))}" fill="none" stroke="${GFC.coral}" stroke-width="5" stroke-dasharray="10 8" transform="rotate(${f1(t * 60)})"/>`;
    h += odAt(x, -12, slot, beat * pop) + gfT(x, 52, OD_SLOT[i][0], 26, now ? GFC.coral : GFC.navy);
  }
  return odAt(o.x || 960, o.y || 84, h, k * (o.s || 1));
}
/* ===== 방 세트 ===== */
function odBed(o = {}) { // 뒤(머리판·매트리스·베개)와 앞(이불)을 따로 돌려준다
  const x0 = 880, x1 = 1460, mt = OD.MT, night = o.night;
  const wood = night ? '#8A6A9A' : GFC.wood, wood2 = night ? '#6E5480' : GFC.wood2, sheet = night ? '#C9D0F2' : '#FFFFFF', blank = night ? '#7E8CE0' : '#7EC8F2', blank2 = night ? '#6573C8' : '#5FB0E0';
  let back = `<rect x="${x0 - 28}" y="${mt - 190}" width="56" height="${OD.FY - mt + 190}" rx="24" fill="${wood}" stroke="${INK}" stroke-width="8"/><circle cx="${x0}" cy="${mt - 190}" r="34" fill="${wood}" stroke="${INK}" stroke-width="8"/>` +
    `<rect x="${x1 - 10}" y="${mt - 60}" width="40" height="${OD.FY - mt + 60}" rx="16" fill="${wood}" stroke="${INK}" stroke-width="8"/>` +
    `<rect x="${x0}" y="${mt + 60}" width="${x1 - x0}" height="70" rx="10" fill="${wood2}" stroke="${INK}" stroke-width="8"/><rect x="${x0 + 20}" y="${mt + 130}" width="26" height="${OD.FY - mt - 130}" fill="${wood2}" stroke="${INK}" stroke-width="7"/><rect x="${x1 - 50}" y="${mt + 130}" width="26" height="${OD.FY - mt - 130}" fill="${wood2}" stroke="${INK}" stroke-width="7"/>` +
    `<rect x="${x0}" y="${mt}" width="${x1 - x0}" height="80" rx="18" fill="${sheet}" stroke="${INK}" stroke-width="8"/>` +
    `<path d="M${x0 + 18} ${mt + 4} Q${x0 + 10} ${mt - 64} ${x0 + 90} ${mt - 70} Q${x0 + 180} ${mt - 74} ${x0 + 186} ${mt - 6} Z" fill="${night ? '#E4E8FF' : '#FFF6E0'}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  const bx = o.blanketX == null ? 990 : o.blanketX, top = o.blanketTop == null ? mt - 52 : o.blanketTop;
  let front = `<path d="M${bx} ${top + 30} Q${bx + 10} ${top} ${bx + 70} ${top + 4} L${x1 + 18} ${top + 18} Q${x1 + 34} ${mt + 40} ${x1 + 6} ${mt + 112} L${bx - 6} ${mt + 112} Q${bx - 24} ${mt + 40} ${bx} ${top + 30} Z" fill="${blank}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>` +
    `<path d="M${bx + 30} ${top + 40} Q${bx + 200} ${top + 70} ${x1 - 20} ${top + 50}" fill="none" stroke="${blank2}" stroke-width="10" stroke-linecap="round"/>` +
    [0, 1, 2, 3].map(i => `<circle cx="${bx + 90 + i * 110}" cy="${mt + 60}" r="9" fill="#fff" opacity=".55"/>`).join('');
  return { back, front };
}
function odAlarm(x, y, t, o = {}) { // 머리맡 자명종: ring(흔들림)
  const sh = o.ring ? Math.sin(t * 60) * 7 : 0;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(sh)})"><path d="M-30 -36 Q-46 -54 -24 -58 Q-14 -50 -18 -40 Z M30 -36 Q46 -54 24 -58 Q14 -50 18 -40 Z" fill="${GFC.coral}" stroke="${INK}" stroke-width="5"/><path d="M-22 34 L-30 48 M22 34 L30 48" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` +
    `<circle r="42" fill="${GFC.coral}" stroke="${INK}" stroke-width="7"/><circle r="30" fill="#fff" stroke="${INK}" stroke-width="4"/><line x1="0" y1="0" x2="0" y2="-20" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><line x1="0" y1="0" x2="14" y2="0" stroke="${INK}" stroke-width="5" stroke-linecap="round"/></g>` +
    (o.ring ? [-1, 1].map(sd => `<path d="M${f1(x + sd * 56)} ${f1(y - 40)} q${sd * 12} 10 0 22 M${f1(x + sd * 70)} ${f1(y - 50)} q${sd * 18} 18 0 40" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity="${f1((0.5 + 0.5 * Math.sin(t * 30)) * 100) / 100}"/>`).join('') : ''); }
function odTable(x, t, o = {}) { const y = 700; return `<rect x="${x - 86}" y="${y}" width="172" height="26" rx="10" fill="${o.night ? '#8A6A9A' : GFC.wood}" stroke="${INK}" stroke-width="7"/><rect x="${x - 70}" y="${y + 26}" width="140" height="${OD.FY - y - 26}" rx="8" fill="${o.night ? '#6E5480' : GFC.wood2}" stroke="${INK}" stroke-width="7"/><rect x="${x - 50}" y="${y + 60}" width="100" height="56" rx="8" fill="none" stroke="${INK}" stroke-width="5" opacity=".35"/><circle cx="${x}" cy="${y + 88}" r="7" fill="${GFC.sun}" stroke="${INK}" stroke-width="4"/>`; }
function odRoom(t, cam, o = {}) {
  const night = o.night || 0, wall = gfMix('#FFE9C8', '#3B4A84', night), wall2 = gfMix('#FFD9A8', '#33407A', night), floor = gfMix('#F2C48D', '#2E386B', night);
  let h = gfRoom({ wall, wall2, floor, fy: OD.FY, base: gfMix('#FFF7E2', '#4A5794', night), dots: night < 0.5 });
  h += gfWindow(150, 200, 420, 310, t, { sky: night > 0.5 ? 'gfNight' : 'gfDawn', night: night > 0.5, inner: night > 0.5 ? `<g transform="translate(320 80) scale(1.3)">${GF_ICON.moon()}</g>` + (o.skyStars || '') : '' });
  const mm = o.mins == null ? 420 : o.mins; if (!o.noClock) h += gfClock(1290, 300, 62, Math.floor(mm / 60), mm % 60);
  h += gfPlant(1780, OD.FY, 0.9, t) + (o.noTable ? '' : odTable(720, t, { night: night > 0.5 }));
  if (night > 0.5) h += `<circle cx="760" cy="600" r="150" fill="url(#gfGlow)" opacity=".55"/><path d="M738 690 L746 620 L774 620 L782 690 Z" fill="#FFE29A" stroke="${INK}" stroke-width="6"/><path d="M724 620 L796 620 L782 572 L738 572 Z" fill="#FFF3B8" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  return gfLayer(cam, 0.85, h);
}
/* 폰(뒷면) + 얼굴에 비치는 빛. 손 위치 (x, y) */
const odPhone = (x, y, rot = 0, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><rect x="-24" y="-40" width="48" height="80" rx="10" fill="#2B3654" stroke="${INK}" stroke-width="6"/><circle cx="-10" cy="-26" r="5" fill="#556080"/><rect x="-6" y="16" width="12" height="4" rx="2" fill="#556080"/></g>`;
const odGlow = (x, y, r = 90, k = 1) => k > 0.02 ? `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${r}" ry="${f1(r * 0.85)}" fill="#BFE6FF" opacity="${f1(0.3 * k * 100) / 100}"/>` : '';
/* 침대에 앉은(기댄) 제로: 손·머리 위치를 돌려준다 */
function odZBed(t, o = {}) {
  const s = 0.7, x = 1010, y = OD.MT + 150 * s, rot = o.rot || 0, pose = o.pose || 'od폰', m = o.m || {};
  const ps = typeof pose === 'string' ? P[pose] : pose, hl = ps.hL, hr = ps.hR, hx = (hl[0] + hr[0]) / 2 - 200, hy = (hl[1] + hr[1]) / 2 - 560;
  const [hdx, hdy] = odRot(hx * s, hy * s, rot), [fdx, fdy] = odRot(0, -390 * s, rot), [tdx, tdy] = odRot(0, -540 * s, rot);
  const body = Z({ x: x + (m.dx || 0), y: y + (m.dy || 0), s, rot, t, pose, ex: o.ex, look: o.look || [0.2, 0.3], sx: m.sx, sy: m.sy, still: o.still, noBlink: o.noBlink, seed: 3, tilt: o.tilt });
  return { body, hand: [x + hdx, y + hdy], face: [x + fdx, y + fdy], top: [x + tdx, y + tdy] };
}
const odBedSit = n => odBed({ night: n, blanketTop: OD.MT - 22, blanketX: 1000 }), odBedLie = () => odBed({ blanketTop: OD.MT - 150, blanketX: 1075 });
function odZLie(t, o = {}) { // 누워 자는 제로(머리 왼쪽, 베개 위)
  const s = 0.7, hx = 1000, y = OD.MT - 74, fx = hx + 390 * s;
  return { body: Z({ x: fx, y, s, rot: -90, t, pose: '서기', ex: o.ex || odSleepEx, noBlink: !o.ex, still: true, seed: 3, look: o.look || [0, 0] }), face: [hx, y], top: [hx - 80, y - 80] };
}

/* ===== 1~4: 태어나자마자 40분 ===== */
odbedScene = function (t, lt, a, run) {
  const ph = a.ph; let cam = [960, 540, 1], zb, hud = '', fx = '', haru = '', alarm = '', bed = odBedSit(0), mins = 420, glow = '', ph2 = '', emo = '';
  const sill = [440, 474];
  if (ph === 0) { // 알람 → [▶ 새 일생 시작] → 하루 탄생
    const tR = 0.25, tB = 0.72, tP = 0.98, tH = 1.12; cam = qLerpCam(lt / 1.8, [900, 560, 1.75], [930, 540, 1.5]);
    const zl = odZBed(t, { pose: 'f앉기', rot: -12, ex: odSleepEx, noBlink: true, tilt: -14, m: lt > tR ? { dx: Math.sin(t * 50) * 2 } : {} }); zb = zl.body + odPhone(zl.hand[0] + 20, OD.MT - 30, 80, 0.9) + gfEmote(lt, 0, zl.top[0] + 60, zl.top[1] + 20, 'zzz', { hold: tR + 0.1, s: 0.9 }) + gfEmote(lt, tR + 0.05, zl.top[0] + 40, zl.top[1] + 10, 'shock', { hold: 0.5 });
    const bk = gfIn(lt, tB, 3.4, 0.45) * gfOut(lt, 1.55, 0.2), pr = lt > tP ? gfJelly(lt, tP, 0.22, 5, 9) : { sx: 1, sy: 1 };
    alarm = bk > 0.5 ? '' : odAlarm(720, 650, t, { ring: lt > tR && lt < tP });
    if (bk > 0.02) alarm += gfRing(lt, tP, 720, 600, 30, 200, GFC.mint) + gfStarBurst(lt, tP, 720, 600, { r1: 150 }) + odAt(720, 600, `<g transform="scale(${f1(pr.sx * 1000) / 1000} ${f1(pr.sy * (lt > tP && lt < tP + 0.12 ? 0.86 : 1) * 1000) / 1000})">${gfChip('새 일생 시작', { size: 40, bg: GFC.mint, icon: 'fast' })}</g>`, bk);
    const hk = gfIn(lt, tH, 3.2, 0.42); haru = hk > 0.02 ? odHaru(sill[0], sill[1], hk, t, { age: 0, mood: 'wow' }) : '';
    fx += gfPuff(lt, tH, sill[0], sill[1] + 30, 1.2) + gfStarBurst(lt, tH, sill[0], sill[1], { r1: 150, n: 8 }) + gfRing(lt, tH, sill[0], sill[1], 20, 160, GFC.sun);
    hud = odLifeBar(t, { cur: 0, k: gfIn(lt, 1.3, 3, 0.45), tp: 1.3, s: 1.2 });
  } else if (ph === 1) { // "다시 태어났습니다": 벌떡 앉는다
    const tU = odW(a, '다시', 1.4); cam = qLerpCam(lt / 3, [930, 540, 1.5], [940, 520, 1.6]);
    if (lt < tU) { const zl = odZBed(t, { pose: 'f앉기', rot: -12, ex: fEx('z졸음'), tilt: -10 }); zb = zl.body + odPhone(zl.hand[0] + 20, OD.MT - 30, 80, 0.9); }
    else { const hop = gfHop(lt, tU, 30, 0.32), j = gfJelly(lt, tU + 0.32, 0.12); const zz = odZBed(t, { pose: lt < tU + 0.9 ? 'od기지개' : 'od기지개', ex: fEx('z반짝'), m: gfM(hop, j), look: [-0.4, -0.2] });
      zb = zz.body; fx += gfRing(lt, tU, zz.face[0], zz.face[1], 30, 230, '#fff') + gfStarBurst(lt, tU, zz.face[0], zz.face[1], { r1: 220, n: 9 }) + gfEmote(lt, tU + 0.1, zz.top[0] + 50, zz.top[1] + 10, 'spark', { hold: 1.4, s: 1.1 }); }
    const hh = gfHop(lt, tU + 0.15, 40, 0.34), hh2 = gfHop(lt, tU + 0.62, 30, 0.3);
    haru = odHaru(sill[0], sill[1], 1, t, { age: 0, mood: lt > tU ? 'happy' : 'wow', dy: -(hh.dy + hh2.dy) * -1 }) + gfEmote(lt, tU + 0.2, sill[0] + 30, sill[1] - 110, 'heart', { hold: 1.2, s: 0.8 });
    alarm = odAlarm(720, 650, t); hud = odLifeBar(t, { cur: 0, s: 1.2 });
  } else if (ph === 2) { // 누운 채로 40분: 폰 + 남의 아침 아이콘 + 시계가 휙휙
    const tL = odW(a, '누운', 1.5), t40 = odW(a, '40', 2.4), tO = odW(a, '남의', 3.3), tG = odW(a, '구경', 4.4), tA = odW(a, '태어나자마자', 0.5);
    cam = qLerpCam(lt / (a._dur || 5), [940, 520, 1.6], [960, 500, 1.85]);
    const lean = easeInOut(gfK(tL - 0.1, tL + 0.25, lt)), zz = odZBed(t, { pose: lt < tL ? 'od기지개' : 'od폰', rot: -10 * lean, ex: fEx(lt > tO ? 'z멍' : 'z기본'), look: [0.15, 0.55], m: lt > tL ? gfJelly(lt, tL + 0.2, 0.08) : {} });
    zb = zz.body; const pk = gfK(tL, tL + 0.2, lt);
    if (pk > 0) { ph2 = odPhone(zz.hand[0], zz.hand[1] - 18, -10 * lean, 0.9 * pk); glow = odGlow(zz.face[0], zz.face[1] + 6, 82, pk); }
    if (lt > tO) { const IC = ['building', 'heart', 'chart', 'star', 'letter', 'clock']; for (let i = 0; i < 12; i++) { const t0 = tO + i * 0.22, u = gfK(t0, t0 + 0.9, lt); if (u <= 0 || u >= 1) continue;
      const sx = zz.hand[0], sy = zz.hand[1] - 50, ex2 = zz.face[0] - 10, ey = zz.face[1] - 30, mx = (sx + ex2) / 2 + (i % 2 ? 90 : -40), my = sy - 150, p = easeInOut(u), qx = (1 - p) * (1 - p) * sx + 2 * (1 - p) * p * mx + p * p * ex2, qy = (1 - p) * (1 - p) * sy + 2 * (1 - p) * p * my + p * p * ey;
      fx += odAt(qx, qy, `<circle r="34" fill="#fff" stroke="${INK}" stroke-width="5"/>` + gfIcon(IC[i % IC.length], 0.6, t), Math.sin(Math.PI * Math.min(1, u * 1.15)) * 0.95); } }
    mins = 420 + Math.round(40 * easeInOut(gfK(t40, t40 + 1.3, lt)));
    fx += gfChipAt(lt, t40, 1290, 410, mins >= 460 ? '7:40' : `7:${String(mins - 420).padStart(2, '0')}`, { icon: 'clock', size: 38, bg: mins >= 460 ? GFC.coral : '#fff', col: mins >= 460 ? '#fff' : GFC.navy });
    const hop = gfHop(lt, tA, 40, 0.3), hop2 = gfHop(lt, tA + 0.5, 36, 0.3), sad = lt > tG;
    haru = odHaru(sill[0], sill[1], 1, t, { age: 0, mood: sad ? 'cry' : 'wow', dy: hop.dy + hop2.dy }) + gfEmote(lt, tA + 0.05, sill[0] + 10, sill[1] - 110, 'bang', { hold: 1.2, s: 0.8 }) + gfEmote(lt, tG, sill[0] + 10, sill[1] - 100, 'gloom', { hold: 9, s: 0.8 });
    alarm = odAlarm(720, 650, t); hud = odLifeBar(t, { cur: 1, tp: tL, gray: gfK(t40, t40 + 1.3, lt), s: 1.2 });
  } else { // "헉, 7시 40분!": 소스라쳐 뛰쳐나간다
    const tS = 0.08, tGo = (a._dur || 1.8) - 0.15; cam = qLerpCam(lt / 0.5, [960, 500, 1.85], [1040, 540, 1.45]);
    if (lt < tGo) { const j = gfJelly(lt, tS, 0.2, 5, 7), zz = odZBed(t, { pose: 'od기지개', rot: 0, ex: fEx('z충격'), look: [0.6, -0.2], m: j }); zb = zz.body; ph2 = odPhone(zz.hand[0] + 30, zz.hand[1] - 120, 30, 0.9);
      emo = gfEmote(lt, tS, zz.top[0] + 40, zz.top[1], 'bang', { hold: 2, s: 1.1 }) + gfEmote(lt, tS + 0.05, zz.top[0] - 50, zz.top[1] + 40, 'sweat', { hold: 2 }); }
    else { const run2 = (lt - tGo) * 1500, x = 1240 + run2, wk = gfWalk(run2, 1.0, 0.06); zb = gfActor(Z, { x, y: OD.FY, s: 0.78, t, pose: wk.pose, ex: fEx('z충격'), look: [1, 0], seed: 3 }, { sy: wk.sy, dy: wk.dy }) + gfPuff(lt, tGo, 1240, OD.FY, 1.4); bed = odBed({ blanketTop: OD.MT - 30 }); }
    mins = 460; fx += gfChipAt(lt, -1, 1290, 410, '7:40', { icon: 'clock', size: 38, bg: GFC.coral, col: '#fff' });
    haru = odHaru(sill[0], sill[1], 1, t, { age: 0, mood: 'wow' }); alarm = odAlarm(720, 650, t, { ring: lt < 0.5 }); hud = odLifeBar(t, { cur: 1, gray: 1, s: 1.2 });
  }
  const world = odRoom(t, cam, { mins }) + qCam(cam, bed.back + haru + alarm + glow + zb + ph2 + bed.front + emo + fx);
  return gfDefs() + world + hud;
};

/* ===== 5~6: 월요일 밤 — 스크롤하다 잠듦 ===== */
odnightScene = function (t, lt, a) {
  const ph = a.ph, sill = [440, 474]; let cam, h = '';
  if (ph === 0) {
    const tN = odW(a, '10시', 1.0), tE = odW(a, '이렇게', 3.0), tD = odW(a, '끝났습니다', 3.8); cam = qLerpCam(lt / (a._dur || 4.5), [920, 540, 1.5], [960, 520, 1.68]);
    const doze = gfK(tE - 0.2, tE + 0.5, lt), zz = odZBed(t, { pose: doze > 0.5 ? 'f앉기' : 'od폰', rot: -12, ex: doze > 0.5 ? odSleepEx : fEx('z멍'), noBlink: doze > 0.5, look: [0.15, 0.55], tilt: -14 * doze });
    let ph1 = doze > 0.5 ? odPhone(zz.hand[0] + 20, OD.MT - 30, 80, 0.9) : odPhone(zz.hand[0], zz.hand[1] - 18, -12, 0.9), gl = odGlow(zz.face[0], zz.face[1] + 6, 82, 1 - doze);
    const nk = gfIn(lt, tN + 0.35, 3.4, 0.45) * gfOut(lt, tN + 1.9, 0.3);
    const note = nk > 0.02 ? odGlow(zz.hand[0] - 250, zz.hand[1] - 190, 150, nk * 0.6) + odAt(zz.hand[0] - 250, zz.hand[1] - 190, gfChip('엄마: 잘 자라', { size: 36, icon: 'letter', bg: '#FFF3D6' }), nk) : '';
    const old = 1 - gfK(tD, tD + 0.5, lt), sk = gfK(tD + 0.1, tD + 0.6, lt), fly = gfK(tD + 0.6, tD + 1.6, lt);
    const hx = lerp(sill[0], 470, fly), hy = lerp(sill[1], 300, easeInOut(fly));
    const haru = odHaru(hx, hy, 1 - 0.4 * fly, t, { age: 3, mood: lt > tD - 0.6 ? 'sleep' : 'happy', star: sk, rot: lt > tD - 0.6 && sk < 0.5 ? -18 : 0, shadow: fly < 0.05 }) + gfRing(lt, tD + 0.1, sill[0], sill[1], 20, 160, GFC.sun);
    const zzz = gfEmote(lt, tE + 0.3, zz.top[0] + 60, zz.top[1] + 20, 'zzz', { hold: 9 });
    const bed = odBedSit(1);
    h = odRoom(t, cam, { night: 1, mins: 22 * 60 + 30, skyStars: fly > 0.95 ? `<g transform="translate(120 100)">${gfStar5(22, GFC.sun, 5)}</g>` : '' }) + qCam(cam, bed.back + haru + gl + zz.body + ph1 + bed.front + zzz + note);
    h += qCam(cam, gfChipAt(lt, tN, 1290, 410, '22:30', { icon: 'moon', size: 38, bg: '#C9CFFF' })) + odLifeBar(t, { cur: lt > tD ? 4 : 3, tp: tD, night: 1, s: 1.2 });
    return gfDefs() + h;
  }
  // 저장 화면
  cam = [960, 520, 1.68]; const zz = odZBed(t, { pose: 'f앉기', rot: -12, ex: odSleepEx, noBlink: true, tilt: -14 }), bed = odBedSit(1);
  h = odRoom(t, cam, { night: 1, mins: 22 * 60 + 31, skyStars: `<g transform="translate(120 100)">${gfStar5(22, GFC.sun, 5)}</g>` }) + qCam(cam, bed.back + zz.body + odPhone(zz.hand[0] + 20, OD.MT - 30, 80, 0.9) + bed.front) + odTint('#0B1230', 0.45);
  const pk = gfIn(lt, 0.08, 3, 0.45), saved = lt > 0.95; let p = gfPanel(820, 340, { head: '저장', headBg: '#C9CFFF', bg: '#FFFDF6' });
  if (!saved) p += odAt(-150, 0, gfStar5(46, GFC.sun, 6), 1, t * 260) + gfT(60, 18, '저장 중' + '.'.repeat(1 + Math.floor(lt * 5) % 3), 54, GFC.navy);
  else p += gfT(0, -70, '오늘의 엔딩', 34, '#6B7280', { wt: 800 }) + gfBounceText(lt, 0.98, 0, 30, [['스크롤하다 잠듦', GFC.navy]], { size: 70, stroke: '#fff', sw: 12, stagger: 0.035 }) + odAt(0, 112, gfIcon('moon', 0.8, t), gfIn(lt, 1.3, 3, 0.45));
  h += odAt(960, 500, p, pk * 1.25) + (lt > 1.5 ? odAt(1380, 330, gfStamp(lt, 1.6, '저장됨', { size: 52, col: '#8D93A6', rot: 10 })) : '');
  return gfDefs() + h + odLifeBar(t, { cur: 4, night: 1, s: 1.2 });
};

/* ===== 7~11: 쇼펜하우어 ===== */
const odStoryBg = t => gfFull('#FFF1CF') + gfFull('url(#gfDots)') + gfRays(t, 960, 560, 1500, '#fff', 14, 0.25, 5);
const odGround = () => `<rect x="-600" y="${OD.FY}" width="3120" height="800" fill="#F4DC9E"/><rect x="-600" y="${OD.FY}" width="3120" height="22" fill="#FFF3D6" stroke="${INK}" stroke-width="6"/>`;
odpendScene = function (t, lt, a) {
  const tG = odW(a, '독일', 1.0), tC = odW(a, '시계추', 3.4), tP = odW(a, '고통', 2.6), tB = odW(a, '권태', 3.0), tN = odW(a, '쇼펜하우어', (a._dur || 7) - 0.8);
  const pv = [700, 110], L = 640, k = gfIn(lt, 0.2, 2.6, 0.5), amp = lt < tC ? 9 : 9 + 19 * gfK(tC, tC + 0.8, lt), ang = amp * Math.sin((lt - 0.2) * 2.6) * (lt > tN ? Math.exp(-(lt - tN) * 0.5) : 1);
  let h = gfDefs() + odStoryBg(t);
  h += gfChipAt(lt, tG, 1460, 150, '200년 전쯤 · 독일', { icon: 'flag', size: 46, bg: GFC.sun, rot: -3 });
  if (k > 0.02) {
    const seatY = pv[1] + L, sc = 0.78;
    const rider = OSCH({ x: pv[0] - 40, y: seatY + 150 * sc, s: sc, t, pose: 'f앉기', ex: fEx(lt > tN ? 'z뿌듯' : lt > tC ? 'z멍' : 'z기본'), look: [ang > 0 ? -0.5 : 0.5, 0.1], seed: 71 });
    const g = `<line x1="${pv[0]}" y1="${pv[1]}" x2="${pv[0]}" y2="${seatY}" stroke="${GFC.wood2}" stroke-width="18" stroke-linecap="round"/><line x1="${pv[0]}" y1="${pv[1]}" x2="${pv[0]}" y2="${seatY}" stroke="${INK}" stroke-width="4" opacity=".3"/>` +
      `<rect x="${pv[0] - 150}" y="${seatY - 10}" width="300" height="30" rx="14" fill="${GFC.wood}" stroke="${INK}" stroke-width="8"/>` + rider;
    h += `<g transform="translate(0 ${f1((1 - k) * -700)})"><g transform="rotate(${f1(ang)} ${pv[0]} ${pv[1]})">${g}</g></g>`;
  }
  h += gfChipAt(lt, tP, 300, 880, '고통', { size: 58, bg: GFC.coral, col: '#fff', rot: -6 }) + gfChipAt(lt, tB, 1100, 880, '권태', { size: 58, bg: '#9C95C9', col: '#fff', icon: 'clock', rot: 6 });
  if (lt > tC) h += [-1, 1].map(sd => `<path d="M${700 + sd * 170} 800 q${sd * 30} -20 ${sd * 60} 0" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity="${f1(0.3 + 0.3 * Math.sin(t * 6))}"/>`).join('');
  const ck = gfIn(lt, 0.9, 2.8, 0.5), named = lt > tN; let card = gfPanel(640, 430, { head: '독일의 철학자', headBg: '#BDE7C9' });
  card += named ? '' : gfT(0, -80, '???', 96, '#C9BFA8');
  [['calendar', '1788 ~ 1860'], ['pin', '삶은 시계추']].forEach(([ic, tx], i) => { const kk = gfIn(lt, (i ? tC : 1.4), 3.4, 0.45); if (kk > 0.02) card += odAt(-250, 20 + i * 90, `<g transform="translate(26 0)">${gfIcon(ic, 1, t)}</g>` + gfT(78, 16, tx, 46, GFC.navy, { anchor: 'start' }), kk); });
  h += odAt(1460, 500 + Math.sin(t * 1.8) * 3, card, ck, 2);
  if (named) h += gfBounceText(lt, tN, 1460, 430, [['쇼펜하우어', GFC.navy]], { size: 92, stroke: '#fff', sw: 16, wave: 3 }) + gfStarBurst(lt, tN, 1460, 410, { r1: 260 }) + gfRing(lt, tN, 1460, 410, 40, 280, GFC.sun);
  return h;
};
odbookScene = function (t, lt, a) {
  const tPes = odW(a, '비관주의자', 1.0), tBut = odW(a, '그런데', 2.2), tBk = odW(a, '책', 3.5), tK = odW(a, '다정한', 4.6);
  let h = gfDefs() + odStoryBg(t) + odGround();
  const soft = lt > tK, x = 640, s = 1.15, hop = gfHop(lt, tK + 0.1, 36, 0.36);
  h += gfActor(OSCH, { x, y: OD.FY, s, t, pose: '서기', ex: fEx(soft ? 'z빵긋' : lt > tBut ? 'z의심' : 'z멍'), look: lt > tBk ? [0.8, -0.1] : [0.2, 0.1], seed: 71 }, hop);
  const top = gfAbove(x, OD.FY, s, 0, 0), ck = gfIn(lt, tPes, 3.2, 0.45) * (soft ? 1 - gfK(tK, tK + 0.5, lt) : 1);
  if (ck > 0.02) { let cl = gfCloud(0, 0, 0.85).replace(/fill="#fff"/g, 'fill="#B9C2D6"'); for (let i = 0; i < 6; i++) { const yy = (t * 260 + i * 40) % 110; cl += `<line x1="${-75 + i * 30}" y1="${f1(36 + yy)}" x2="${-81 + i * 30}" y2="${f1(58 + yy)}" stroke="#4DA8FF" stroke-width="6" stroke-linecap="round"/>`; } h += odAt(top[0], top[1] - 70, cl, ck); }
  if (!soft) h += gfChipAt(lt, tPes, x + 310, top[1] + 60, '소문난 비관주의자', { icon: 'rain', size: 40, bg: '#DDE3F0', rot: -3 });
  if (soft) h += gfRays(t, top[0], top[1] - 40, 260, GFC.sun, 10, 0.4 * gfK(tK, tK + 0.6, lt), 30) + gfEmote(lt, tK + 0.2, top[0] + 90, top[1] + 20, 'heart', { hold: 2, s: 1.2 });
  const bk = gfIn(lt, tBk - 0.1, 3, 0.45), open = soft ? gfK(tK, tK + 0.4, lt) : 0;
  if (bk > 0.02) {
    const cover = `<rect x="-170" y="-220" width="340" height="440" rx="18" fill="#3E5C84" stroke="${INK}" stroke-width="9"/><rect x="-140" y="-190" width="280" height="380" rx="10" fill="none" stroke="#E8C27A" stroke-width="5"/><rect x="-170" y="-220" width="34" height="440" rx="12" fill="#2E4870" stroke="${INK}" stroke-width="7"/>` + gfT(18, -40, '소품과', 54, '#FFE9A8') + gfT(18, 30, '부록', 54, '#FFE9A8') + gfT(18, 130, '1851', 34, '#E8C27A');
    const pages = `<rect x="-330" y="-200" width="330" height="410" rx="14" fill="#FFFBF0" stroke="${INK}" stroke-width="8"/><rect x="0" y="-200" width="330" height="410" rx="14" fill="#FFFBF0" stroke="${INK}" stroke-width="8"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${-290}" y="${-140 + i * 56}" width="${210 - (i % 2) * 40}" height="12" rx="6" fill="#D9CDB0"/><rect x="${40}" y="${-140 + i * 56}" width="${230 - (i % 3) * 30}" height="12" rx="6" fill="#D9CDB0"/>`).join('') + odAt(165, 60, GF_ICON.heart(), 1.8 * gfIn(lt, tK + 0.2, 3, 0.4));
    h += odAt(1300, 470, open > 0.5 ? pages : cover, bk * (1 + 0.04 * Math.sin(t * 2)), -3 + 3 * open) + gfChipAt(lt, tBk + 0.2, 1300, 790, '말년에 낸 책 · 1851', { icon: 'book', size: 42, bg: GFC.sun, rot: -2 });
    if (soft) h += gfStarBurst(lt, tK, 1300, 450, { r1: 320, cols: [GFC.berry, '#fff', GFC.sun] }) + gfRing(lt, tK, 1300, 450, 60, 360, GFC.berry);
  }
  return h;
};
odlifeScene = function (t, lt, a) {
  const t0 = odW(a, '일생', 0.9), tB = odW(a, '탄생', 2.4), tY = odW(a, '젊음', 3.8), tD = odW(a, '죽음', (a._dur || 6) - 0.5);
  let h = gfDefs() + odStoryBg(t);
  const cur = lt > tD ? 4 : lt > tY + 1.0 ? 3 : lt > tY + 0.55 ? 2 : lt > tY ? 1 : 0, tp = lt > tD ? tD : lt > tY + 1.0 ? tY + 1.0 : lt > tY + 0.55 ? tY + 0.55 : lt > tY ? tY : tB;
  h += odLifeBar(t, { x: 960, y: 400, s: 2.2, cur, k: gfIn(lt, 0.15, 2.8, 0.5), tp: lt > tB ? tp : null });
  const age = Math.min(3, cur), star = gfK(tD, tD + 0.4, lt), slotX = i => 960 + (i - 2) * 120 * 2.2;
  if (lt > tB) { const prev = Math.max(0, cur - 1), mv = easeInOut(gfK(tp, tp + 0.3, lt)), x = lerp(slotX(prev), slotX(cur), cur > 0 ? mv : 1), hop = gfHop(lt, tp, 60, 0.3);
    h += odHaru(x, 720 - star * 110, 1.6 * gfIn(lt, tB, 3, 0.45), t, { age, star, mood: star > 0.5 ? 'sleep' : 'happy', dy: hop.dy }) + gfPuff(lt, tp + 0.3, x, 790, 1.2) + gfStarBurst(lt, tD, slotX(4), 640, { r1: 200 }); }
  h += gfChipAt(lt, t0, 960, 150, '하루 = 작은 일생', { size: 60, bg: GFC.sun, rot: -2 }) + gfChipAt(lt, 0.3, 960, 900, '『소품과 부록』 「인생론」 · 뜻을 옮김', { icon: 'book', size: 34, bg: '#fff' });
  return h;
};
odmornScene = function (t, lt, a) {
  const tS = odW(a, '늦잠', 2.6), tT = odW(a, '하찮은', 3.4), tC = odW(a, '잡담', 4.2), tH = odW(a, '신성하게', (a._dur || 6) - 0.9);
  let h = gfDefs() + odStoryBg(t) + odGround();
  const holy = lt > tH, x = 420;
  h += gfActor(OSCH, { x, y: OD.FY, s: 1.0, t, pose: holy ? '만세' : '서기', ex: fEx(holy ? 'z뿌듯' : 'z결심'), look: [0.8, -0.2], seed: 71 }, holy ? gfHop(lt, tH, 30, 0.3) : {});
  const cx = 1000, cy = 420, ck = gfIn(lt, 0.15, 2.8, 0.5);
  let card = gfPanel(560, 440, { head: '아침', headBg: GFC.sun, bg: '#FFF8E6' }) + `<svg x="-250" y="-190" width="500" height="380" viewBox="0 0 500 380"><rect width="500" height="380" rx="20" fill="url(#gfDawn)"/>${gfHill(300, 30, 300, '#8ADB6A', 0, INK)}${gfSun(250, 190, 60, t)}</svg>` + gfT(0, 196, '하루의 젊음', 42, GFC.navy);
  if (holy) h += gfRays(t, cx, cy, 540, GFC.sun, 14, 0.35, 12);
  h += odAt(cx, cy + Math.sin(t * 1.8) * 4, card, ck * (holy ? gfBeat(lt, tH, 0.1, 3, 5) : 1), -2);
  [[tS, '늦잠', 1580, 250, -5], [tT, '하찮은 일', 1600, 440, 4], [tC, '잡담', 1580, 630, -4]].forEach(([t0, tx, px, py, r]) => {
    const out = gfOut(lt, tH - 0.25, 0.25); if (lt < t0 || out < 0.02) return; const w = gfTextW(tx, 46) + 60, xk = gfK(t0 + 0.35, t0 + 0.55, lt);
    let c = gfChip(tx, { size: 46, bg: '#fff' }) + (xk > 0 ? `<line x1="${f1(-w / 2 + 10)}" y1="0" x2="${f1(-w / 2 + 10 + (w - 20) * xk)}" y2="0" stroke="#E5484D" stroke-width="10" stroke-linecap="round"/>` : '');
    c += odAt(w / 2 + 34, -30, `<circle r="28" fill="#E5484D" stroke="${INK}" stroke-width="5"/><path d="M-11 -11 L11 11 M11 -11 L-11 11" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`, gfIn(lt, t0 + 0.4, 4, 0.4));
    h += odAt(px, py, c, gfIn(lt, t0, 3.4, 0.45) * out, r); });
  if (holy) h += gfBounceText(lt, tH, cx, 780, [['거의 ', GFC.navy], ['신성하게', '#E8A400']], { size: 100, stroke: '#fff', sw: 18, wave: 3 }) + gfStarBurst(lt, tH, cx, 740, { r1: 360, n: 9 }) + gfTwinkle(t, cx - 330, 260, 26, 1, GFC.sun) + gfTwinkle(t, cx + 320, 200, 22, 3, GFC.sun);
  return h;
};
odmineScene = function (t, lt, a) {
  const tO = odW(a, '출근길', 2.2), cam = qLerpCam(lt / (a._dur || 3.4), [880, 560, 1.3], [860, 540, 1.38]), x = 860;
  const zw = gfActor(Z, { x, y: OD.FY, s: 0.95, t, pose: '서기', ex: fEx(lt > tO ? 'z민망' : 'z히죽'), look: [0.7, 0.1], seed: 3 }, lt > tO ? gfJelly(lt, tO, 0.08) : {});
  const top = gfAbove(x, OD.FY, 0.95, 0, 0);
  let h = gfDefs() + odRoom(t, cam, { noClock: 1, noTable: 1 }) + qCam(cam, zw + odHaru(440, 474, 1, t, { age: 0, mood: 'sad' }) + gfEmote(lt, tO + 0.1, top[0] + 70, top[1] + 50, 'sweat', { hold: 2 }));
  const pk = gfIn(lt, 0.2, 2.8, 0.5); let p = gfPanel(760, 320, { head: '월요일 아침', headBg: GFC.sky2 });
  p += `<g transform="translate(-320 16)">${gfBar(640, 1, { h: 60, col: '#FFE9A0' })}</g>`;
  const eat = 0.333 * gfK(tO - 0.3, tO + 0.4, lt);
  if (eat > 0.01) p += `<rect x="-317" y="-11" width="${f1(640 * eat - 6)}" height="54" rx="27" fill="#8D93A6"/>` + [0, 1, 2].map(i => odAt(-280 + i * 66, 16, gfIcon(['building', 'heart', 'chart'][i], 0.6, t), gfIn(lt, tO + i * 0.12, 3.4, 0.45))).join('');
  p += gfT(-320, 96, '7:00', 32, GFC.navy, { anchor: 'start' }) + gfT(320, 96, '9:00', 32, GFC.navy, { anchor: 'end' }) + (lt > tO ? gfT(-200, -54, '남의 출근길 40분', 38, '#E5484D') : gfT(0, -54, '신성한 아침', 38, '#E8A400'));
  h += odAt(1420, 420, p, pk * (lt > tO ? gfBeat(lt, tO, 0.08, 3, 6) : 1), 1) + odLifeBar(t, { cur: 1, gray: lt > tO ? 1 : 0.6, s: 1.2 });
  return h;
};

/* ===== 12~13: 만약에 ===== */
odtitleScene = function (t, lt, a) {
  const tL2 = odW(a, '하루를', 0.7), tQ = odW(a, '산다면', 1.9);
  let h = gfDefs() + gfStage(t, 9, { bg: GFC.sky, bg2: '#A6DEFF' }).split('<g transform="translate(960 520)')[0];
  h += gfBounceText(lt, 0.05, 960, 330, [['만약에,', '#fff']], { size: 96, stroke: GFC.navy, sw: 16, wave: 3 });
  h += gfBounceText(lt, tL2, 960, 500, [['하루를 ', GFC.navy], ['한 번의 일생', '#E8742A'], ['처럼', GFC.navy]], { size: 104, stroke: '#fff', sw: 18, wave: 3, stagger: 0.035 });
  h += gfBounceText(lt, tQ - 0.1, 960, 650, [['산다면?', GFC.navy]], { size: 104, stroke: '#fff', sw: 18, wave: 3 });
  const hop = gfHop(lt, tQ, 46, 0.36);
  h += odHaru(960, 830, 1.4 * gfIn(lt, 0.4, 3, 0.45), t, { age: 1, mood: 'happy', dy: hop.dy }) + gfStarBurst(lt, tQ + 0.36, 960, 830, { r1: 200 });
  return h;
};
odquestScene = function (t, lt, a) {
  const tT = odW(a, '화요일', 0.4), tF = odW(a, '탄생부터', 2.4), tSc = odW(a, '과학', (a._dur || 6) - 1.0), cam = qLerpCam(lt / (a._dur || 6), [960, 540, 1.0], [960, 530, 1.04]);
  let world = gfFull('url(#gfDay)') + gfSun(1700, 170, 60, t) + gfClouds(t, 110, 3, 6, 12, 0.9) + gfHill(700, 70, 700, '#A6E38C', 0) + gfHill(820, 50, 520, '#8ADB6A', 200, INK) + gfTree(180, 900, 0.9, t) + gfGrass(420, 905) + gfGrass(780, 908, 1.2);
  world = gfLayer(cam, 0.6, world) + gfLayer(cam, 1, `<rect x="-700" y="900" width="3400" height="700" fill="#7BCF63" stroke="${INK}" stroke-width="7"/>`);
  const x = 480, st = gfHop(lt, tT + 0.2, 34, 0.34), zw = gfActor(Z, { x, y: 900, s: 0.9, t, pose: lt > tT ? '만세' : '서기', ex: fEx(lt > tSc ? 'z의심' : 'z결심'), look: [0.6, -0.2], seed: 3 }, st);
  const top = gfAbove(x, 900, 0.9, 0, 0);
  let h = gfDefs() + world + qCam(cam, zw + odHaru(740, 780, 1.2, t, { age: 0, mood: 'happy', dy: gfHop(lt, tF, 40, 0.3).dy }) + gfEmote(lt, tSc, top[0] + 60, top[1] + 30, 'q', { hold: 2.5 }));
  const items = [['청춘', '7:00'], ['한창때', '12:00'], ['노년', '17:00'], ['작은 죽음', '22:00']].map(([tx, tg], i) => ({ text: tx, tag: tg, t0: tT + 0.45 + i * 0.3, tagBg: ['#D8F5C8', '#FFF0A6', '#FFD3B8', '#D5D9FF'][i] }));
  h += odAt(1320, 470, gfQuest(lt, items, { head: '화요일 · 작은 일생 하나', w: 660, rh: 92, size: 44 }), 1.15 * gfIn(lt, tT, 2.8, 0.5), 1) + odLifeBar(t, { cur: 0, k: gfIn(lt, tF - 0.3, 3, 0.45), tp: tF, s: 1.2 });
  return h;
};
