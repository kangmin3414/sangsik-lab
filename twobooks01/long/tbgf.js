/* 성경과 불경 편 — 진지한 인문 에세이(운영자 2026-11-17 "진지하게 에세이로 가보자 샘플"). 대본 twobooks01/SCRIPT_asis.md. 새 이름은 모두 tb 접두사.
   차분한 2D: 튀는 게임 효과(색종이·도장·HUD) 없이 느린 움직임, 따뜻한 빛(성경 쪽)과 푸른 물(불경 쪽).
   종교 상징(십자가·불상·卍·합장) 없이 책 표지 글자만. '절대자'는 위에서 내려오는 빛으로만.
   원문 카드(명조체 + 출처)와 자막은 화면 좌표(GFR.over / GFR.sub)에 그린다. 장면 안의 사건 시각은 모두 절대 시각(tbAt). */
window.GFR = { boil: false, vig: false, flash: false, study: false, sub: t => tbSub(t), over: t => tbOver(t) };
['tbdawn', 'tbintro', 'tbtitle', 'tbgaze', 'tbout', 'tbin'].forEach(k => CAMS[k] = 'fixed');
const TBS = "'Noto Serif CJK KR', serif";
const TBC = { ink: '#1B1E2E', gold: '#E9B866', gold2: '#F6D9A0', cream: '#FBF4E4', blue: '#8FC3E6', blue2: '#CFE8F7', bible: '#6A3A28', sutra: '#2B3D57', dim: '#0E1222' };
const tbL = id => TL.lines.find(l => l.id === id);
/* 절대 시각: 줄 id 안에서 낱말 key가 시작되는 때(못 찾으면 줄 길이의 fb 비율) */
const tbAt = (id, key, fb = 0.5, n = 0) => { const l = tbL(id); if (!l) return 1e9; if (key) { const k = key.replace(/\s/g, ''), m = (l.words || []).filter(x => x.w.replace(/\s/g, '').includes(k)); if (m[n]) return l.t0 + m[n].t + 0.05; } return l.t0 + fb * (l.t1 - l.t0); };
const tbS = (t, t0, d = 0.9) => easeInOut(gfK(t0, t0 + d, t));                       // 0 → 1 천천히
const tbF = (t, t0, t1, d = 0.6) => tbS(t, t0, d) * (1 - tbS(t, t1, d));              // 나타났다 사라짐
const tbTx = (x, y, str, fs, fill, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${o.anchor || 'middle'}" font-family="${o.sans ? FONT : TBS}" font-weight="${o.wt || 700}" font-size="${fs}" fill="${fill}"${o.op != null ? ` opacity="${f1(o.op * 100) / 100}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${esc(str)}</text>`;
const tbOp = (k, inner) => k <= 0.004 ? '' : (k >= 0.996 ? inner : `<g opacity="${f1(k * 1000) / 1000}">${inner}</g>`);
const tbHand = (x, y, s = 1) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(22 * s)}" fill="#fff" stroke="${INK}" stroke-width="${f1(7 * s)}"/>`;

const TB_DEFS = `<defs>
<linearGradient id="tbWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151B33"/><stop offset="1" stop-color="#232C4E"/></linearGradient>
<linearGradient id="tbPre" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1636"/><stop offset=".62" stop-color="#2E3D72"/><stop offset="1" stop-color="#C98D7A"/></linearGradient>
<radialGradient id="tbLamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFD98F" stop-opacity=".75"/><stop offset=".55" stop-color="#FFC56E" stop-opacity=".22"/><stop offset="1" stop-color="#FFC56E" stop-opacity="0"/></radialGradient>
<radialGradient id="tbGoldG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE3A3" stop-opacity=".95"/><stop offset="1" stop-color="#FFE3A3" stop-opacity="0"/></radialGradient>
<radialGradient id="tbBlueG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#D8F0FF" stop-opacity=".95"/><stop offset="1" stop-color="#D8F0FF" stop-opacity="0"/></radialGradient>
<radialGradient id="tbGrey" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#B9BED0" stop-opacity=".75"/><stop offset="1" stop-color="#9AA0B4" stop-opacity="0"/></radialGradient>
<linearGradient id="tbWarm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F1B97A"/><stop offset=".6" stop-color="#F7D6A2"/><stop offset="1" stop-color="#FBE9C9"/></linearGradient>
<linearGradient id="tbCool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1F3556"/><stop offset=".55" stop-color="#5C7FA6"/><stop offset="1" stop-color="#E9C4B8"/></linearGradient>
<linearGradient id="tbWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6C8FB2"/><stop offset="1" stop-color="#2A4366"/></linearGradient>
<linearGradient id="tbWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B2A22"/><stop offset="1" stop-color="#2A1D18"/></linearGradient>
<linearGradient id="tbStage" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121830"/><stop offset=".7" stop-color="#1E2848"/><stop offset="1" stop-color="#3A3550"/></linearGradient>
<linearGradient id="tbBeamW" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE3A3" stop-opacity="0"/><stop offset="1" stop-color="#FFE3A3" stop-opacity=".85"/></linearGradient>
<linearGradient id="tbBeamV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF2CF" stop-opacity=".0"/><stop offset=".25" stop-color="#FFF2CF" stop-opacity=".55"/><stop offset="1" stop-color="#FFF2CF" stop-opacity=".9"/></linearGradient>
<filter id="tbBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="tbDim" x="-5%" y="-5%" width="110%" height="110%"><feColorMatrix type="saturate" values="0.35"/></filter>
<clipPath id="tbLeft"><rect x="-700" y="-700" width="1660" height="2600"/></clipPath>
<clipPath id="tbRight"><rect x="960" y="-700" width="1800" height="2600"/></clipPath>
</defs>`;

/* ---------- 자세 ---------- */
const tbLegs = () => ({ legL: P['서기'].legL, legR: P['서기'].legR, fL: P['서기'].fL, fR: P['서기'].fR, dy: 0 });
P['tb좌선'] = { armL: [[148, 285], [124, 350], [152, 404]], hL: [158, 408], armR: [[252, 285], [276, 350], [248, 404]], hR: [242, 408], legL: [[180, 412], [116, 462], [212, 484]], fL: [226, 488, -10], legR: [[220, 412], [284, 462], [188, 484]], fR: [174, 488, 10], dy: 46 };
P['tb괸머리'] = Object.assign({ armL: [[148, 285], [150, 372], [166, 236]], hL: [168, 230], armR: [[252, 285], [250, 372], [234, 236]], hR: [232, 230] }, tbLegs());
P['tb머리'] = Object.assign({ armL: [[148, 285], [100, 236], [112, 168]], hL: [114, 160], armR: [[252, 285], [300, 236], [288, 168]], hR: [286, 160] }, tbLegs());
P['tb내밀기'] = Object.assign({ armL: [[148, 285], [130, 345], [124, 400]], hL: [122, 408], armR: [[252, 285], [310, 300], [366, 300]], hR: [376, 298] }, tbLegs());
const tbZ = (o, m = {}) => gfActor(Z, Object.assign({ t: o.t, seed: 7, look: [0, 0] }, o, { ex: fEx(o.ex || 'z기본') }), m);
const TB_P1 = o => zGirl(Object.assign({ hairStyle: 'long', hairArgs: ['#3A2E2A', '#E9B866'], top: '#E6D3F0', dress: '#5E6A8C' }, o));        // 친구
const TB_P2 = o => spMan(o, { vest: '#7C8A6A', hair: '#BFBFBF', beard: '#D0D0D0' });                                                        // 어르신
const TB_P3 = o => zGirl(Object.assign({ hairStyle: 'bob', hairArgs: ['#5A3A2E'], top: '#9ED8C8', dress: '#3E6A8C' }, o));                // 아이

/* ---------- 책 ---------- */
/* 표지가 보이는 책(원점 가운데). kind 'b' 성경 / 's' 불경. glow 0~1 */
function tbBook(kind, w = 300, h = 400, o = {}) {
  const col = kind === 'b' ? TBC.bible : TBC.sutra, title = o.title || (kind === 'b' ? '성경' : '불경'), g = o.glow || 0;
  let s = g > 0 ? `<circle r="${f1(Math.max(w, h) * 0.95)}" fill="url(#${kind === 'b' ? 'tbGoldG' : 'tbBlueG'})" opacity="${f1(g * 0.85 * 100) / 100}"/>` : '';
  s += `<rect x="${-w / 2 + 10}" y="${-h / 2 + 14}" width="${w}" height="${h}" rx="14" fill="#000" opacity=".28"/>`;
  s += `<rect x="${-w / 2 + 8}" y="${-h / 2 + 4}" width="${w}" height="${h}" rx="12" fill="#F3E9D2" stroke="${INK}" stroke-width="5"/>`;   // 책장
  s += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="12" fill="${col}" stroke="${INK}" stroke-width="6"/>`;
  s += `<rect x="${-w / 2 + 18}" y="${-h / 2 + 18}" width="${w - 36}" height="${h - 36}" rx="6" fill="none" stroke="${TBC.gold}" stroke-width="3" opacity=".8"/>`;
  s += `<rect x="${-w / 2}" y="${-h / 2}" width="${w * 0.11}" height="${h}" rx="10" fill="#000" opacity=".18"/>`;
  s += `<text x="${f1(w * 0.04)}" y="${f1(-h * 0.08)}" text-anchor="middle" font-family="${TBS}" font-weight="700" font-size="${Math.round(w * 0.2)}" fill="${TBC.gold2}" letter-spacing="6">${esc(title)}</text>`;
  s += `<path d="M${f1(-w * 0.18)} ${f1(h * 0.06)} H${f1(w * 0.26)}" stroke="${TBC.gold}" stroke-width="3" opacity=".7"/>`;
  return s;
}
/* 책상에 누운 책(정면에서 본 두께 + 책등 글자) */
const tbBookFlat = (x, y, kind, w = 200) => { const col = kind === 'b' ? TBC.bible : TBC.sutra, title = kind === 'b' ? '성경' : '불경';
  return `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M${-w / 2 + 14} -48 L${w / 2 - 14} -48 L${w / 2} -36 L${-w / 2} -36 Z" fill="${col}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<rect x="${-w / 2}" y="-36" width="${w}" height="40" rx="6" fill="${col}" stroke="${INK}" stroke-width="5"/><rect x="${-w / 2 + 8}" y="-30" width="${w - 16}" height="7" fill="#F3E9D2" opacity=".85"/>` +
    `<text x="0" y="-2" text-anchor="middle" font-family="${TBS}" font-weight="700" font-size="22" fill="${TBC.gold2}" letter-spacing="4">${title}</text></g>`; };

/* ---------- 새벽 방(정면) ---------- */
function tbRoom(t, o = {}) {
  const FY = 930; let h = gfFull('url(#tbWall)') + `<rect x="-600" y="${FY - 6}" width="3120" height="900" fill="#11162B"/>`;
  const wx = 1290, wy = 150, ww = 430, wh = 340;
  h += `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="10" fill="url(#tbPre)"/>`;
  for (let i = 0; i < 12; i++) h += `<circle cx="${wx + 24 + (i * 89) % (ww - 48)}" cy="${wy + 20 + (i * 47) % (wh * 0.55)}" r="${1.6 + (i % 3)}" fill="#fff" opacity="${f1((0.25 + 0.45 * Math.abs(Math.sin(t * 0.9 + i))) * 100) / 100}"/>`;
  h += `<path d="M${wx} ${wy + wh - 40} Q${wx + 120} ${wy + wh - 70} ${wx + 230} ${wy + wh - 48} T${wx + ww} ${wy + wh - 60} V${wy + wh} H${wx} Z" fill="#1A2244" opacity=".9"/>`;   // 먼 지붕선
  h += `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="10" fill="none" stroke="#0A0E1E" stroke-width="14"/><line x1="${wx + ww / 2}" y1="${wy}" x2="${wx + ww / 2}" y2="${wy + wh}" stroke="#0A0E1E" stroke-width="9"/><line x1="${wx}" y1="${wy + wh / 2}" x2="${wx + ww}" y2="${wy + wh / 2}" stroke="#0A0E1E" stroke-width="9"/>`;
  // 벽시계: stop 시각에 초침이 멈춘다
  const cx = 420, cy = 300, r = 66, sec = o.stop != null && t > o.stop ? o.stop : t, sa = (sec * 6) % 360;
  h += `<circle cx="${cx}" cy="${cy}" r="${r + 8}" fill="#0D1122" opacity=".5"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#D9D3C4" stroke="#0A0E1E" stroke-width="8"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; h += `<line x1="${f1(cx + Math.sin(a) * (r - 10))}" y1="${f1(cy - Math.cos(a) * (r - 10))}" x2="${f1(cx + Math.sin(a) * (r - 18))}" y2="${f1(cy - Math.cos(a) * (r - 18))}" stroke="#3A3A3A" stroke-width="4"/>`; }
  h += `<line x1="${cx}" y1="${cy}" x2="${cx + 2}" y2="${cy - 34}" stroke="#222" stroke-width="7" stroke-linecap="round" transform="rotate(${f1(4.8 * 30 + 0)} ${cx} ${cy})"/><line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 50}" stroke="#222" stroke-width="5" stroke-linecap="round" transform="rotate(${f1(50 * 6)} ${cx} ${cy})"/>`;
  h += `<line x1="${cx}" y1="${cy + 10}" x2="${cx}" y2="${cy - 54}" stroke="#B5482F" stroke-width="3" stroke-linecap="round" transform="rotate(${f1(sa)} ${cx} ${cy})"/><circle cx="${cx}" cy="${cy}" r="6" fill="#222"/>`;
  // 책장 그림자(오른쪽 아래 어둠)
  h += `<rect x="1500" y="560" width="300" height="380" rx="8" fill="#0F1428" opacity=".9"/><rect x="1500" y="680" width="300" height="10" fill="#1E2644"/><rect x="1500" y="810" width="300" height="10" fill="#1E2644"/>`;
  return h;
}
/* 스탠드(책상 왼쪽) + 불빛 */
const tbLamp = (x, y, on = 1, t = 0) => {
  const fl = 1 + 0.015 * Math.sin(t * 7.3) + 0.01 * Math.sin(t * 3.1);
  return `<circle cx="${x + 230}" cy="${y - 40}" r="${f1(470 * fl)}" fill="url(#tbLamp)" opacity="${f1(on * 100) / 100}"/>` +
    `<path d="M${x + 110} ${y - 250} L${x + 330} ${y + 10} L${x - 10} ${y + 10} Z" fill="#FFD98F" opacity="${f1(on * 0.08 * 100) / 100}"/>` +
    `<ellipse cx="${x}" cy="${y}" rx="56" ry="14" fill="#2E2A30" stroke="${INK}" stroke-width="5"/><path d="M${x} ${y - 6} L${x + 30} ${y - 200} L${x + 110} ${y - 250}" stroke="#2E2A30" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M${x + 70} ${y - 292} L${x + 160} ${y - 244} L${x + 132} ${y - 206} L${x + 52} ${y - 262} Z" fill="#3A3540" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="${x + 146}" cy="${y - 226}" rx="20" ry="9" fill="#FFF1C8" opacity="${f1(on * 100) / 100}" transform="rotate(35 ${x + 146} ${y - 226})"/>`; };
const tbDesk = (y = 750) => `<rect x="520" y="${y}" width="880" height="28" rx="8" fill="#5A3F30" stroke="${INK}" stroke-width="6"/><rect x="548" y="${y + 28}" width="824" height="170" fill="#45302A" stroke="${INK}" stroke-width="6"/><rect x="548" y="${y + 28}" width="824" height="22" fill="#000" opacity=".22"/>`;

/* o1: 새벽, 스탠드 아래 앉은 제로. '허무함'에 회색 안개, '고통'에 머리를 괸다, '멈춰'에 시계 초침이 멈춘다 */
function tbDawnFront(t, o = {}) {
  const tFog = tbAt('o1', '허무', 0.3), tPain = tbAt('o1', '고통', 0.5), tStop = tbAt('o1', '멈춰', 0.7);
  let h = TB_DEFS + tbRoom(t, { stop: tStop });
  const pain = t > tPain - 0.2, br = Math.sin(t * 1.6) * 0.008;
  h += tbLamp(640, 750, 1, t);
  h += tbZ({ x: 960, y: 930, s: 1, t, pose: pain ? 'tb괸머리' : '책상', ex: pain ? 'z울먹' : 'z멍', look: pain ? [0, 0.7] : [0.15, 0.35] }, { sy: 1 + br, dy: pain ? 10 * tbS(t, tPain - 0.2, 0.7) : 0 });
  // 회색 안개(허무)
  const fk = tbS(t, tFog, 1.4);
  if (fk > 0) for (let i = 0; i < 6; i++) { const a = t * 0.35 + i * 1.05; h += `<circle cx="${f1(960 + Math.cos(a) * (150 + i * 12))}" cy="${f1(470 + Math.sin(a * 1.3) * 60 - i * 6)}" r="${110 + i * 8}" fill="url(#tbGrey)" opacity="${f1(fk * 1.0 * 100) / 100}"/>`; }
  h += tbDesk(750) + tbBookFlat(1110, 750, 'b', 180) + tbBookFlat(1292, 750, 's', 170);
  if (!pain) { const L = [960 + (182 - 200), 930 + (376 - 560)], R = [960 + (224 - 200), 930 + (376 - 560)]; h += tbHand(L[0], L[1]) + tbHand(R[0], R[1]); }
  return h;
}
/* o2·o3: 제로 시점, 위에서 본 책상. 두 책 + 시대가 다른 손들이 책을 붙든다('수천 년'), 이름에 맞춰 책이 빛난다 */
function tbPov(t, o = {}) {
  let h = TB_DEFS + gfFull('url(#tbWood)');
  for (let i = 0; i < 14; i++) h += `<path d="M-200 ${80 + i * 82} Q600 ${60 + i * 82 + (i % 3) * 14} 1300 ${86 + i * 82} T2200 ${76 + i * 82}" stroke="#4A3428" stroke-width="${3 + (i % 3)}" fill="none" opacity=".55"/>`;
  h += `<circle cx="960" cy="470" r="${f1(760 + 8 * Math.sin(t * 2))}" fill="url(#tbLamp)"/>`;
  const tB = tbAt('o3', '성경', 0.4), tS = tbAt('o3', '불경', 0.75);
  h += `<g transform="translate(740 480) rotate(-4)">${tbBook('b', 320, 430, { glow: 0.15 + 0.85 * tbS(t, tB - 0.2, 0.9) })}</g>`;
  h += `<g transform="translate(1180 492) rotate(3)">${tbBook('s', 320, 430, { glow: 0.15 + 0.85 * tbS(t, tS - 0.2, 0.9) })}</g>`;
  // 시대가 다른 손들(소매 색·소맷부리만 다르게): '수천 년'부터 차례로 와서 책 가장자리를 붙들었다가 흐려진다
  const t0 = tbAt('o2', '수천', 0.3), t1 = tbAt('o3', '바로', 0.05);
  const HS = [['#B48A5A', '#E8D3A8', -1, -1, 610, 330], ['#E7E1D2', '#B8A27A', 1, -1, 1310, 340], ['#3E4F7A', '#C9D3E6', -1, 0.25, 590, 610], ['#6E7F5E', '#E2E6CF', 1, 0.3, 1335, 640]];
  HS.forEach(([col, cuff, dx, dy, hx, hy], i) => { const a = t0 + i * 0.6, op = tbS(t, a, 0.9) * (1 - tbS(t, t1 + i * 0.15, 0.9)); if (op <= 0) return;
    const L = 520, n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n, e = 60 * (1 - tbS(t, a, 1.3));
    const ex = hx + ux * e, ey = hy + uy * e, sx = ex + ux * L, sy = ey + uy * L, cx = ex + ux * 46, cy = ey + uy * 46;
    h += tbOp(op * 0.82, `<line x1="${f1(sx)}" y1="${f1(sy)}" x2="${f1(cx)}" y2="${f1(cy)}" stroke="${INK}" stroke-width="104" stroke-linecap="round" opacity=".35"/><line x1="${f1(sx)}" y1="${f1(sy)}" x2="${f1(cx)}" y2="${f1(cy)}" stroke="${col}" stroke-width="92" stroke-linecap="round"/>` +
      `<line x1="${f1(cx + ux * 30)}" y1="${f1(cy + uy * 30)}" x2="${f1(cx)}" y2="${f1(cy)}" stroke="${cuff}" stroke-width="96" stroke-linecap="round"/>` + tbHand(ex, ey, 1.6)); });
  // 내 손(제로, 아래 가장자리 — 자막 위)
  const sink = tbS(t, tbL('o2') ? tbL('o2').t0 : 0, 1.2);
  [[560, 1300, 690, 900], [1360, 1300, 1230, 900]].forEach(([x0, y0, x1, y1]) => { const yy = y1 + 30 * sink; h += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${f1(yy + 40)}" stroke="${INK}" stroke-width="100" stroke-linecap="round" opacity=".35"/><line x1="${x0}" y1="${y0}" x2="${x1}" y2="${f1(yy + 40)}" stroke="#FF9A55" stroke-width="88" stroke-linecap="round"/>` + tbHand(x1, yy, 1.7); });
  return h;
}
function tbdawnScene(t, lt, a) {
  if (a.ph === 0) { const k = tbS(t, tbL('o1').t0 - 0.2, 6.5); return `<g transform="translate(960 600) scale(${f1((1.12 - 0.12 * k) * 1000) / 1000}) translate(-960 -600)">${tbDawnFront(t)}</g>`; }
  const k = tbS(t, tbL('o2').t0 - 0.2, 9); return `<g transform="translate(960 520) scale(${f1((1.0 + 0.08 * k) * 1000) / 1000}) translate(-960 -520)">${tbPov(t)}</g>`;
}

/* ---------- o4~o6: 두 책을 마주한 무대 ---------- */
function tbintroScene(t, lt, a) {
  let h = TB_DEFS + gfFull('url(#tbStage)');
  for (let i = 0; i < 18; i++) h += `<circle cx="${f1((i * 211) % 2100 - 60)}" cy="${f1(60 + (i * 97) % 420)}" r="${1.5 + (i % 3)}" fill="#fff" opacity="${f1((0.15 + 0.3 * Math.abs(Math.sin(t * 0.7 + i))) * 100) / 100}"/>`;
  h += `<ellipse cx="960" cy="905" rx="760" ry="70" fill="#000" opacity=".3"/><rect x="420" y="860" width="1080" height="26" rx="10" fill="#4A3A34" stroke="${INK}" stroke-width="6"/><rect x="450" y="886" width="1020" height="300" fill="#33282A"/>`;
  h += `<circle cx="960" cy="640" r="560" fill="url(#tbLamp)" opacity=".55"/>`;
  const tJ = tbAt('o4', '옳고', 0.35), tNo = tbAt('o4', '않으', 0.8), tQ = tbAt('o5', '무엇을', 0.7), tD = tbAt('o6', '다른', 0.55), tP = tbAt('o6', '문구', 0.78);
  const sc = tbF(t, tJ - 0.3, tNo + 0.2, 0.8), tilt = Math.sin((t - tJ) * 2.2) * 9 * (1 - tbS(t, tNo - 0.4, 1.0));
  // 저울(따지기) → 사라짐
  const beamY = 420, arm = 270, ra = tilt * Math.PI / 180;
  const pL = [960 - Math.cos(ra) * arm, beamY - Math.sin(ra) * arm], pR = [960 + Math.cos(ra) * arm, beamY + Math.sin(ra) * arm];
  if (sc > 0) h += tbOp(sc, `<rect x="948" y="${beamY}" width="24" height="440" rx="8" fill="#B89A6A" stroke="${INK}" stroke-width="5"/><path d="M900 860 h120 l-14 -26 h-92 Z" fill="#B89A6A" stroke="${INK}" stroke-width="5"/>` +
    `<line x1="${f1(pL[0])}" y1="${f1(pL[1])}" x2="${f1(pR[0])}" y2="${f1(pR[1])}" stroke="#B89A6A" stroke-width="16" stroke-linecap="round"/><line x1="${f1(pL[0])}" y1="${f1(pL[1])}" x2="${f1(pR[0])}" y2="${f1(pR[1])}" stroke="${INK}" stroke-width="4" opacity=".4"/><circle cx="960" cy="${beamY}" r="16" fill="#D8BC86" stroke="${INK}" stroke-width="5"/>` +
    [pL, pR].map(p => `<path d="M${f1(p[0])} ${f1(p[1])} L${f1(p[0] - 120)} ${f1(p[1] + 330)} M${f1(p[0])} ${f1(p[1])} L${f1(p[0] + 120)} ${f1(p[1] + 330)}" stroke="#8A7A5A" stroke-width="4"/><path d="M${f1(p[0] - 140)} ${f1(p[1] + 330)} Q${f1(p[0])} ${f1(p[1] + 380)} ${f1(p[0] + 140)} ${f1(p[1] + 330)} Z" fill="#C9AE7A" stroke="${INK}" stroke-width="5"/>`).join(''));
  // 책: 저울 접시 위 → 탁자 위 나란히
  const rest = 1 - sc, bw = 220, bh = 290;
  const posB = [lerp(pL[0], 760, rest), lerp(pL[1] + 330 - bh / 2 - 8, 860 - bh / 2 - 4, rest)], posS = [lerp(pR[0], 1160, rest), lerp(pR[1] + 330 - bh / 2 - 8, 860 - bh / 2 - 4, rest)];
  const gl = tbS(t, tD - 0.2, 1.0);
  h += `<g transform="translate(${f1(posB[0])} ${f1(posB[1])}) rotate(${f1(-2 * rest)})">${tbBook('b', bw, bh, { glow: 0.2 + 0.6 * gl })}</g><g transform="translate(${f1(posS[0])} ${f1(posS[1])}) rotate(${f1(2 * rest)})">${tbBook('s', bw, bh, { glow: 0.2 + 0.6 * gl })}</g>`;
  // 제로(왼쪽에서 두 책을 바라봄)
  const zIn = tbS(t, tbL('o4').t0 - 0.1, 1.2);
  h += tbOp(zIn, tbZ({ x: 330, y: 905, s: 0.86, t, pose: '서기', ex: 'z기본', look: [0.75, 0.15] }, { sy: 1 + Math.sin(t * 1.5) * 0.008 }));
  // '무엇을 얻어야' — 책 위에 빈 카드
  const qk = tbF(t, tQ - 0.1, tD - 0.3, 0.7);
  [760, 1160].forEach((x, i) => { if (qk > 0) h += tbOp(qk, `<g transform="translate(${x} ${f1(470 - 8 * Math.sin(t * 1.4 + i))})"><rect x="-90" y="-60" width="180" height="120" rx="14" fill="#FBF4E4" fill-opacity=".14" stroke="#FBF4E4" stroke-width="4" stroke-dasharray="12 10"/><text x="0" y="22" text-anchor="middle" font-family="${TBS}" font-weight="700" font-size="64" fill="#FBF4E4" opacity=".8">?</text></g>`); });
  // '무엇이 다른지' — 성경 빛은 바깥으로 퍼지고, 불경 빛은 안으로 감긴다
  if (gl > 0) {
    const g1 = tbS(t, tD, 1.6);
    const BW = [[560, 380, 240, 250, 10], [700, 300, 520, 120, 8], [860, 330, 980, 150, 6]];   // 바깥으로 퍼지는 빛(제로 머리 위로)
    h += tbOp(gl * 0.9, BW.map(([qx, qy, x2, y2, w]) => `<path d="M760 590 Q${qx} ${qy} ${f1(lerp(760, x2, g1))} ${f1(lerp(590, y2, g1))}" stroke="#FFE3A3" stroke-width="${w}" fill="none" stroke-linecap="round" opacity=".75"/>`).join(''));
    let sp = ''; const n = Math.floor(40 * g1); for (let i = 0; i <= n; i++) { const u = i / 40, r = 150 * (1 - u) + 6, a = u * Math.PI * 4.2 + t * 0.6; sp += (i ? 'L' : 'M') + f1(1160 + Math.cos(a) * r) + ' ' + f1(470 + Math.sin(a) * r * 0.8); }
    if (n > 0) h += tbOp(gl * 0.9, `<path d="${sp}" stroke="#D8F0FF" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>`);
  }
  // '실제 문구들' — 종이 쪽지가 책에서 떠오른다
  for (let i = 0; i < 6; i++) { const k = tbS(t, tP + i * 0.18, 2.4); if (k <= 0) continue; const bx = i % 2 ? 1160 : 760, x = bx + (i - 2.5) * 34 + Math.sin(t + i) * 10, y = 600 - 360 * k - (i % 3) * 30;
    h += tbOp(Math.min(1, k * 3) * (1 - 0.4 * k), `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(Math.sin(t * 1.3 + i) * 8)})"><rect x="-48" y="-30" width="96" height="60" rx="6" fill="${TBC.cream}" stroke="${INK}" stroke-width="3"/><path d="M-32 -10 h64 M-32 4 h52 M-32 18 h40" stroke="#9A8F7A" stroke-width="4" stroke-linecap="round"/></g>`); }
  return h;
}

/* ---------- 제목 카드 ---------- */
function tbtitleScene(t, lt, a) {
  const L = tbL('k0'), u = t - L.t0, k = tbS(t, L.t0 - 0.1, 1.2);
  let h = TB_DEFS + gfFull('#10142A') + `<circle cx="960" cy="520" r="${f1(620 + 30 * Math.sin(t))}" fill="url(#tbLamp)" opacity=".35"/>`;
  h += tbOp(k, `<line x1="${f1(960 - 300 * k)}" y1="600" x2="${f1(960 + 300 * k)}" y2="600" stroke="${TBC.gold}" stroke-width="3" opacity=".8"/>` +
    `<text x="960" y="${f1(540 - 8 * (1 - k))}" text-anchor="middle" font-family="${TBS}" font-weight="700" font-size="120" fill="${TBC.cream}" letter-spacing="18">성경과 불경</text>`);
  h += tbOp(tbS(t, L.t0 + 0.7, 1.0), `<text x="960" y="680" text-anchor="middle" font-family="${TBS}" font-weight="500" font-size="44" fill="${TBC.gold2}" letter-spacing="6">두 권의 책이 건네는 두 가지 깨달음</text>`);
  return h;
}

/* ---------- 1장: 시선의 방향 ---------- */
const TB_SPLIT_BG = (t, kL, kR) => {
  let h = '';
  h += `<g clip-path="url(#tbLeft)">${gfFull('url(#tbWarm)')}<circle cx="300" cy="300" r="300" fill="url(#tbGoldG)" opacity=".55"/>${gfHill(820, 40, 260, '#E4B57F', 0)}${gfHill(870, 26, 200, '#D9A36C', 90)}<rect x="-700" y="900" width="1700" height="400" fill="#C98E5C"/></g>`;
  h += `<g clip-path="url(#tbRight)">${gfFull('url(#tbCool)')}<circle cx="1620" cy="760" r="240" fill="url(#tbBlueG)" opacity=".35"/><rect x="960" y="760" width="1800" height="600" fill="url(#tbWater)"/>` +
    [0, 1, 2, 3, 4].map(i => `<path d="M${960 + ((i * 300 + t * 18) % 1100)} ${800 + i * 60} h${120 + (i % 2) * 80}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".22"/>`).join('') + `</g>`;
  return h;
};
/* a1: 가운데 제로, 시선 화살표 두 개(바깥으로 / 안으로) */
function tbgazeScene(t, lt, a) {
  const L = tbL('a1'), tSav = tbAt('a1', '구원', 0.35), tEn = tbAt('a1', '깨달', 0.5), tWh = tbAt('a1', '어디', 0.7);
  const bk = tbS(t, L.t0 - 0.2, 1.4);
  let h = TB_DEFS + gfFull('#141A30') + tbOp(bk, TB_SPLIT_BG(t, 1, 1)) + tbOp(bk * 0.9, `<line x1="960" y1="-40" x2="960" y2="1240" stroke="#FBF4E4" stroke-width="4" opacity=".55"/>`);
  h += tbZ({ x: 960, y: 905, s: 0.95, t, pose: '서기', ex: 'z기본', look: t > tWh ? [Math.sin((t - tWh) * 1.2) * 0.6, 0] : [0, 0] }, { sy: 1 + Math.sin(t * 1.5) * 0.008 });
  const eye = [960, 905 - 380 * 0.95];
  // 바깥 화살표(금색, 왼쪽)
  const k1 = tbS(t, tSav, 1.1), k2 = tbS(t, tEn, 1.1);
  if (k1 > 0) { const x1 = lerp(eye[0] - 110, 330, k1); h += `<path d="M${eye[0] - 110} ${eye[1]} L${f1(x1)} ${eye[1]}" stroke="${TBC.gold}" stroke-width="12" stroke-linecap="round" stroke-dasharray="2 22"/><path d="M${f1(x1)} ${eye[1]} l34 -24 M${f1(x1)} ${eye[1]} l34 24" stroke="${TBC.gold}" stroke-width="12" stroke-linecap="round" opacity="${f1(k1 * 100) / 100}"/>` + tbOp(k1, tbTx(470, eye[1] - 60, '구원', 54, '#7A4A20')); }
  if (k2 > 0) { h += `<path d="M${eye[0] + 110} ${eye[1]} C${eye[0] + 430} ${eye[1] - 50} ${eye[0] + 470} ${eye[1] + 300} ${eye[0] + 90} ${eye[1] + 120}" stroke="${TBC.blue2}" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="2 22" opacity="${f1(Math.min(1, k2 * 1.5) * 100) / 100}"/>` +
      tbOp(k2, `<circle cx="${eye[0]}" cy="${eye[1] + 120}" r="${f1(40 + 6 * Math.sin(t * 3))}" fill="url(#tbBlueG)"/>` + tbTx(1450, eye[1] - 60, '깨달음', 54, '#EAF6FF')); }
  return h;
}

/* 왼쪽(성경): 따뜻한 들판, 제로와 이웃들이 빛의 실로 이어진다. 오른쪽(불경): 잔잔한 물 위 바위에 앉은 제로. 지금 이야기하지 않는 쪽은 어둡게 */
function tbLeftWorld(t) {
  const tOut = tbAt('a2', '바깥', 0.4), tRel = tbAt('a2', '관계', 0.7), tBook = tbAt('a3', '성경', 0.3), tCard = tbL('a4') ? tbL('a4').t0 : 1e9;
  const tAlone = tbAt('a5', '혼자', 0.4), tDone = tbAt('a5', '완성', 0.7), tOth = tbAt('a6', '타인', 0.4), tAbs = tbAt('a6', '절대자', 0.6), tLove = tbAt('a6', '사랑', 0.8);
  const tWeak = tbAt('a7', '흔들', 0.25), tPrec = tbAt('a7', '귀하', 0.5), tUp = tbAt('a7', '일어', 0.8);
  let h = '';
  const FY = 905, ZX = 470, s = 0.8;
  // 위에서 내려오는 빛(절대자) — 상징 없이 빛줄기만
  const beam = tbS(t, tAbs - 0.2, 1.4);
  if (beam > 0) h += tbOp(beam, `<path d="M${ZX - 70} -60 L${ZX + 70} -60 L${ZX + 190} ${FY} L${ZX - 190} ${FY} Z" fill="url(#tbBeamV)" opacity=".75"/>`);
  // 이웃들: 혼자일 때는 흐려진다
  const others = 1 - 0.85 * tbF(t, tAlone - 0.2, tOth - 0.3, 0.8);
  const ppl = [[TB_P1, 190, 0.78, 'z기본', 21], [TB_P2, 805, 0.82, 'z기본', 22], [TB_P3, 615, 0.6, 'z빵긋', 23]];
  ppl.forEach(([fn, x, ss, ex, seed]) => { h += tbOp(others, gfActor(fn, { x, y: FY, s: ss, t, seed, pose: '서기', ex: fEx(ex), look: [x < ZX ? 0.6 : -0.6, 0] }, { sy: 1 + Math.sin(t * 1.4 + seed) * 0.01 })); });
  // 빛의 실(관계)
  const th = tbS(t, tOut, 1.0) * (1 - 0.9 * tbF(t, tAlone - 0.2, tOth - 0.2, 0.6)), th2 = tbS(t, tRel, 1.0);
  const chest = [ZX, FY - 300 * s];
  ppl.forEach(([fn, x, ss], i) => { const k = i === 0 ? th : th * th2; if (k <= 0.01) return; const px = x, py = FY - 300 * ss, mx = (chest[0] + px) / 2, my = Math.min(chest[1], py) - 70 - 10 * Math.sin(t * 1.3 + i);
    const ex = lerp(chest[0], px, k), ey = lerp(chest[1], py, k);
    const dd = `M${f1(chest[0])} ${f1(chest[1])} Q${f1(lerp(chest[0], mx, k))} ${f1(lerp(chest[1], my, k))} ${f1(ex)} ${f1(ey)}`; h += `<path d="${dd}" stroke="#E8952E" stroke-width="${f1(11 + 3 * (0.5 + 0.5 * Math.sin(t * 2.4 + i)))}" fill="none" stroke-linecap="round" opacity=".75"/><path d="${dd}" stroke="#FFF6DC" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="${f1(ex)}" cy="${f1(ey)}" r="10" fill="#FFF6DC" stroke="#E8952E" stroke-width="3"/>`; });
  // 제로: 혼자일 때 고개 숙임, '흔들려도'에 주저앉음 → '일어설'에 다시 선다
  const sag = tbS(t, tWeak - 0.1, 0.8) * (1 - tbS(t, tUp - 0.2, 1.1)), alone = tbF(t, tAlone - 0.2, tOth - 0.3, 0.7);
  const pose = sag > 0.35 ? 'tb머리' : '서기', ex = sag > 0.35 ? 'z울먹' : (t > tUp + 0.3 ? 'z빵긋' : (alone > 0.4 ? 'z멍' : 'z기본'));
  h += tbZ({ x: ZX + Math.sin(t * 9) * 5 * sag, y: FY, s, t, pose, ex, look: alone > 0.4 ? [0, 0.5] : [0, 0] }, { sy: 1 - 0.16 * sag + Math.sin(t * 1.5) * 0.008, sx: 1 + 0.06 * sag });
  // '혼자서 완성될 수 없는' — 끊긴 고리 → '사랑과 연결'에서 이어진다
  const ring = tbF(t, tDone - 0.3, tLove + 1.6, 0.6), close = tbS(t, tLove - 0.3, 1.2), R = 150, gap = (1 - close) * 1.1;
  if (ring > 0) { const a0 = -Math.PI / 2 + gap / 2, a1 = -Math.PI / 2 + Math.PI * 2 - gap / 2 - 0.001, cy = chest[1] - 30;
    h += tbOp(ring, `<path d="M${f1(ZX + Math.cos(a0) * R)} ${f1(cy + Math.sin(a0) * R)} A${R} ${R} 0 1 1 ${f1(ZX + Math.cos(a1) * R)} ${f1(cy + Math.sin(a1) * R)}" stroke="${close > 0.5 ? '#E89A2E' : '#8A5A2E'}" stroke-width="8" fill="none" stroke-dasharray="${close > 0.95 ? '0' : '16 12'}" opacity=".9"/>`); }
  // 친구가 손을 내민다('귀하게') — 손만 앞으로
  const reach = tbF(t, tPrec - 0.2, tUp + 1.5, 0.6);
  if (reach > 0) h += tbOp(reach, `<circle cx="${f1(ZX - 100)}" cy="${f1(FY - 250)}" r="40" fill="url(#tbGoldG)"/>` + tbHand(ZX - 120 + 20 * reach, FY - 250, 0.85));
  // 떠오르는 책(a3)
  const bk = tbF(t, tBook - 0.3, tCard + 0.4, 0.6);
  if (bk > 0) h += tbOp(bk, `<g transform="translate(${ZX} ${f1(330 - 10 * Math.sin(t * 1.3))}) scale(.42)">${tbBook('b', 300, 400, { glow: 0.9 })}</g>`);
  return h;
}
function tbRightWorld(t) {
  const tIn = tbAt('b1', '안으로', 0.45), tSelf = tbAt('b1', '내면', 0.7), tBook = tbAt('b2', '법구경', 0.5), tCard = tbL('b3') ? tbL('b3').t0 : 1e9;
  const tWorld = tbAt('b4', '바깥', 0.2), tNot = tbAt('b4', '아니라', 0.35), tCling = tbAt('b4', '집착', 0.85), tRoot = tbAt('b5', '뿌리', 0.55), tSee = tbAt('b5', '뚫', 0.7), tFree = tbAt('b5', '자유', 0.88);
  const ZX = 1450, FY = 860, s = 0.8;
  let h = '';
  // 바위 + 물결
  h += `<ellipse cx="${ZX}" cy="${FY + 18}" rx="190" ry="34" fill="#3D4A60" stroke="${INK}" stroke-width="6"/><ellipse cx="${ZX}" cy="${FY + 6}" rx="170" ry="22" fill="#56647C"/>`;
  for (let i = 0; i < 3; i++) { const u = ((t * 0.25 + i / 3) % 1); h += `<ellipse cx="${ZX}" cy="${FY + 30}" rx="${f1(200 + 420 * u)}" ry="${f1(36 + 70 * u)}" fill="none" stroke="#DDEFFF" stroke-width="4" opacity="${f1((1 - u) * 0.45 * 100) / 100}"/>`; }
  // 바깥 세상(걱정거리 아이콘)과 집착의 끈
  const wk = tbS(t, tWorld - 0.1, 0.9), fade = 1 - 0.45 * tbS(t, tNot, 0.8), free = tbS(t, tFree - 0.1, 1.6);
  const IC = [['rain', ZX - 330, 420], ['clock', ZX + 330, 420], ['building', ZX - 390, 650], ['letter', ZX + 390, 650]];
  const chest = [ZX, FY + (320 - 560 + 46) * s];
  IC.forEach(([ic, x, y], i) => { const k = tbS(t, tWorld + i * 0.18, 0.8); if (k <= 0) return; const dx = (x - ZX) * 0.6 * free, dy = -120 * free;
    const px = x + dx + Math.sin(t * 1.1 + i) * 8, py = y + dy + Math.cos(t * 0.9 + i) * 6;
    const cl = tbS(t, tCling - 0.2 + i * 0.08, 0.6) * (1 - free);
    if (cl > 0) { const vib = Math.sin(t * 40 + i) * 2.2 * cl; h += `<path d="M${f1(chest[0])} ${f1(chest[1])} Q${f1((chest[0] + px) / 2 + vib)} ${f1((chest[1] + py) / 2 + vib)} ${f1(px)} ${f1(py)}" stroke="#E07A6A" stroke-width="${f1(3 + 4 * cl)}" fill="none" opacity="${f1(0.9 * cl * 100) / 100}"/>`; }
    if (free > 0 && free < 1) { const fy = py + 200 * free * free; h += `<path d="M${f1(px)} ${f1(py)} q-20 ${f1(80 * free)} 10 ${f1(160 * free)}" stroke="#E07A6A" stroke-width="3" fill="none" opacity="${f1((1 - free) * 0.7 * 100) / 100}"/>`; }
    h += tbOp(k * fade * (1 - 0.7 * free), `<g transform="translate(${f1(px)} ${f1(py)})"><circle r="58" fill="#FBF4E4" fill-opacity=".16" stroke="#FBF4E4" stroke-width="3" opacity=".7"/>${gfIcon(ic, 1.0, t)}</g>`); });
  // 제로(눈 감고 좌선)
  h += tbZ({ x: ZX, y: FY, s, t, pose: 'tb좌선', ex: t > tFree + 0.2 ? 'z뿌듯' : '잠', look: [0, 0] }, { sy: 1 + Math.sin(t * 0.9) * 0.012 });
  // 안으로 향하는 시선 → 가슴의 빛(마음)
  const ki = tbS(t, tIn - 0.1, 1.0), heart = tbS(t, tSelf - 0.1, 1.0), see = tbS(t, tSee - 0.1, 1.0);
  const eye = [ZX, FY + (190 - 560 + 46) * s];
  if (ki > 0) h += tbOp(ki * (1 - 0.6 * free), `<path d="M${ZX + 60} ${f1(eye[1])} C${ZX + 220} ${f1(eye[1] - 30)} ${ZX + 220} ${f1(chest[1] + 40)} ${f1(lerp(ZX + 150, ZX + 30, ki))} ${f1(chest[1] + 10)}" stroke="${TBC.blue2}" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="2 18"/>`);
  if (heart > 0) h += tbOp(heart, `<circle cx="${chest[0]}" cy="${chest[1]}" r="${f1(46 + 14 * see + 6 * Math.sin(t * 2.2) + 60 * free)}" fill="url(#tbBlueG)"/><circle cx="${chest[0]}" cy="${chest[1]}" r="${f1(14 + 3 * Math.sin(t * 2.2))}" fill="#FFFFFF" opacity=".9"/>`);
  // 욕망과 분노의 뿌리(가슴 아래) — 빛이 비추면 드러났다가 '자유'에서 풀려 사라진다
  const rk = tbS(t, tRoot - 0.2, 1.0) * (1 - free);
  if (rk > 0) { let rt = ''; const RS = [[-1, '#E0703F', 150, 120], [1, '#C8423A', 150, 120], [-0.55, '#E0703F', 90, 170], [0.6, '#C8423A', 95, 165]];
    RS.forEach(([d, c, wx, hy], i) => { const g = 0.4 + 0.6 * tbS(t, tRoot - 0.2 + i * 0.12, 0.9), x1 = chest[0] + d * wx * g, y1 = chest[1] + hy * g;
      rt += `<path d="M${chest[0]} ${chest[1] + 8} C${f1(chest[0] + d * 20)} ${f1(chest[1] + 60 * g)} ${f1(x1 - d * 40)} ${f1(y1 - 30)} ${f1(x1)} ${f1(y1)}" stroke="${INK}" stroke-width="${f1(13 + 3 * see)}" fill="none" stroke-linecap="round" opacity=".5"/><path d="M${chest[0]} ${chest[1] + 8} C${f1(chest[0] + d * 20)} ${f1(chest[1] + 60 * g)} ${f1(x1 - d * 40)} ${f1(y1 - 30)} ${f1(x1)} ${f1(y1)}" stroke="${c}" stroke-width="${f1(8 + 3 * see)}" fill="none" stroke-linecap="round"/><path d="M${f1(x1)} ${f1(y1)} l${f1(d * 18)} 16 M${f1(x1)} ${f1(y1)} l${f1(-d * 6)} 22" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`; });
    h += tbOp(rk, rt + (see > 0 ? `<circle cx="${chest[0]}" cy="${chest[1] + 70}" r="${f1(110 * see)}" fill="url(#tbBlueG)" opacity=".55"/>` : ''));
    const lb = (x, y, s2) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="${TBS}" font-weight="700" font-size="40" fill="#FFE9DF" stroke="#3A1E1E" stroke-width="7" paint-order="stroke">${s2}</text>`;
    h += tbOp(rk * tbS(t, tRoot + 0.2, 0.8), lb(chest[0] - 230, chest[1] + 110, '욕망') + lb(chest[0] + 230, chest[1] + 110, '분노')); }
  // '집착' 이름표
  const clLab = tbF(t, tCling + 0.1, tFree, 0.6);
  if (clLab > 0) h += tbOp(clLab, `<text x="${ZX - 250}" y="540" text-anchor="middle" font-family="${TBS}" font-weight="700" font-size="40" fill="#FFE9DF" stroke="#3A1E1E" stroke-width="7" paint-order="stroke">집착</text>`);
  // 떠오르는 책(b2)
  const bk = tbF(t, tBook - 0.3, tCard + 0.4, 0.6);
  if (bk > 0) h += tbOp(bk, `<g transform="translate(${ZX} ${f1(330 - 10 * Math.sin(t * 1.3))}) scale(.42)">${tbBook('s', 300, 400, { glow: 0.9, title: '법구경' })}</g>`);
  return h;
}
function tbSplit(t) {
  const a2 = tbL('a2'), b1 = tbL('b1');
  const dimL = tbS(t, (b1 ? b1.t0 : 1e9) - 0.4, 1.0), dimR = 1 - tbS(t, (b1 ? b1.t0 : 1e9) - 0.4, 1.0);
  let h = TB_DEFS + TB_SPLIT_BG(t, 1, 1);
  h += `<g clip-path="url(#tbLeft)">${tbLeftWorld(t)}</g><g clip-path="url(#tbRight)">${tbRightWorld(t)}</g>`;
  if (dimL > 0) h += `<rect x="-700" y="-700" width="1660" height="2600" fill="${TBC.dim}" opacity="${f1(dimL * 0.55 * 100) / 100}"/>`;
  if (dimR > 0) h += `<rect x="960" y="-700" width="1800" height="2600" fill="${TBC.dim}" opacity="${f1(dimR * 0.55 * 100) / 100}"/>`;
  h += `<line x1="960" y1="-40" x2="960" y2="1240" stroke="#FBF4E4" stroke-width="4" opacity=".55"/>`;
  // a1 → a2: 가운데 제로 장면이 서서히 걷히며 양쪽 세계가 드러난다
  if (a2) { const k = 1 - tbS(t, a2.t0 - 0.15, 1.0); if (k > 0) h += tbOp(k, tbgazeScene(t, 0, {})); }
  return h;
}
function tboutScene(t, lt, a) { return tbSplit(t); }
function tbinScene(t, lt, a) { return tbSplit(t); }

/* ---------- 화면 좌표: 원문 카드 · 장 꼬리표 · 검은 디졸브 ---------- */
const TB_W2S = (x, y) => [960 + (x - 960) * 0.88, 100 + (y - 100) * 0.88];
function tbCard(text, src, o = {}) {
  const fs = o.fs || 58, lines = text.split('\n'), w = Math.max(...lines.map(s => gfTextW(s, fs, 700))) + 120, h = lines.length * fs * 1.45 + 120;
  let s = `<rect x="${f1(-w / 2 + 8)}" y="${f1(-h / 2 + 12)}" width="${f1(w)}" height="${f1(h)}" rx="18" fill="#000" opacity=".25"/><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="18" fill="${TBC.cream}" fill-opacity=".95" stroke="#8C7A5A" stroke-width="3"/>`;
  s += `<rect x="${f1(-w / 2 + 14)}" y="${f1(-h / 2 + 14)}" width="${f1(w - 28)}" height="${f1(h - 28)}" rx="10" fill="none" stroke="#C9B48A" stroke-width="2"/>`;
  lines.forEach((ln, i) => { s += `<text x="0" y="${f1(-h / 2 + 62 + fs * 0.9 + i * fs * 1.45 - 20)}" text-anchor="middle" font-family="${TBS}" font-weight="700" font-size="${fs}" fill="${TBC.ink}">${esc(ln)}</text>`; });
  s += `<text x="0" y="${f1(h / 2 - 34)}" text-anchor="middle" font-family="${TBS}" font-weight="500" font-size="${Math.round(fs * 0.5)}" fill="#7A6A4E">${esc(src)}</text>`;
  return s;
}
const TB_CARDS = [
  { id: 'a4', text: '네 이웃을\n네 몸과 같이 사랑하라', src: '마태복음 22장 39절 · 개역한글', side: 0, until: 'b1' },
  { id: 'b3', text: '모든 일은 마음이 근본이다.\n마음에서 나와 마음으로 이루어진다.', src: '『법구경』 1게 · 법정 옮김', side: 1, until: null },
];
function tbOver(t) {
  let h = '';
  // 장 꼬리표(1장 첫머리)
  const a1 = tbL('a1'); if (a1) { const k = tbF(t, a1.t0 - 0.1, a1.t0 + 3.4, 0.8); if (k > 0) h += tbOp(k, `<rect x="740" y="46" width="440" height="74" rx="37" fill="#0B0F1E" fill-opacity=".55"/><text x="960" y="97" text-anchor="middle" font-family="${TBS}" font-weight="700" font-size="40" fill="#FBF4E4" letter-spacing="4">1장 · 무엇이 다른가</text>`); }
  // 원문 카드: 인용 줄에 크게 → 끝나면 그쪽 화면 위로 작게 붙어 남는다
  TB_CARDS.forEach(c => { const L = tbL(c.id); if (!L) return; const t0 = L.t0 - 0.35, t1 = L.t1 + 0.7, cx = c.side ? 1440 : 480;
    const k = tbS(t, t0, 0.7); if (k <= 0) return; const m = tbS(t, t1, 1.0);
    const U = c.until ? tbL(c.until) : null, endK = U ? tbS(t, U.t0 + 3.0, 1.0) : 0, other = TB_CARDS.find(x => x !== c), oL = other && tbL(other.id), dim = oL ? 0.45 * tbS(t, oL.t0 - 0.35, 0.7) : 0;
    const x = cx, y = lerp(300, 200, m) - 14 * (1 - k), sc = lerp(c.side ? 0.92 : 1, 0.58, m), op = k * (1 - endK) * (1 - dim);
    if (op > 0.01) h += tbOp(op, `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc * 1000) / 1000})">${tbCard(c.text, c.src, { fs: c.side ? 46 : 58 })}</g>`); });
  // 머리말(어느 쪽이 어느 책인지): 카드가 붙기 전까지
  [['a2', 'a4', 480, '성경 — 바깥과 관계'], ['b1', 'b3', 1440, '불경 — 내 마음의 관찰']].forEach(([s, e, x, txt]) => { const S = tbL(s), E2 = tbL(e); if (!S || !E2) return; const k = tbF(t, S.t0 - 0.1, E2.t1 + 0.7, 0.7); if (k > 0) h += tbOp(k, `<text x="${x}" y="92" text-anchor="middle" font-family="${TBS}" font-weight="700" font-size="40" fill="${s === 'a2' ? '#5A2E14' : '#F2F8FF'}" letter-spacing="2">${txt}</text>`); });
  // 장면 사이 검은 디졸브
  ['o4', 'k0', 'a1'].forEach(id => { const L = tbL(id); if (!L) return; const c = L.t0 - 0.15, d = Math.abs(t - c); if (d < 0.45) h += `<rect width="1920" height="1080" fill="#05070F" opacity="${f1((1 - d / 0.45) * 100) / 100}"/>`; });
  return h;
}
/* 자막: 아래 가운데, 어두운 반투명 띠 + 흰 글자. 인용 줄(q)은 카드가 자막을 대신한다 */
function tbSub(t) {
  const L = TL.lines; let cur = null; for (const l of L) if (t >= l.t0 - 0.05 && t <= l.t1 + 0.25) cur = l; if (!cur || !cur.sub || (cur.args && cur.args.q)) return '';
  const text = cur.sub, fs = 44;
  const lines = gfTextW(text, fs, 700) > 1300 ? (() => { const m = Math.floor(text.length / 2); let sp = text.indexOf(' ', m); if (sp < 0 || sp - m > 9) sp = text.lastIndexOf(' ', m); return sp > 0 ? [text.slice(0, sp), text.slice(sp + 1)] : [text]; })() : [text];
  const w = Math.max(...lines.map(s => gfTextW(s, fs, 700))) + 90, h = lines.length * 60 + 34, cy = 1032 - h / 2, k = tbS(t, cur.t0 - 0.05, 0.25);
  let s = `<g opacity="${f1(k * 100) / 100}"><rect x="${f1(960 - w / 2)}" y="${f1(cy - h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="16" fill="#0B0F1E" fill-opacity=".62"/>`;
  lines.forEach((ln, i) => { s += `<text x="960" y="${f1(cy - h / 2 + 58 + i * 60 - 6)}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${fs}" fill="#FFFFFF">${esc(ln)}</text>`; });
  return s + `</g>`;
}
