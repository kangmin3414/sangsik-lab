/* 사피엔스 편 — 1막 샘플(출근 횡스크롤 + 인지 혁명 탑다운). 기획 `sapiens01/기획_v1.md`.
   frankl01/long/fkgf.js·fkgf2.js(하트·뾰족 말풍선·먹구름 등)와 zw/gfstyle.js(화풍) 다음에 읽는다. 새 이름은 모두 sp 접두사.
   표시: 하트 게이지 + "점선 = 허구". 카톡은 폰 화면 없이 날아오는 말풍선으로만. 하라리는 그리지 않는다. */
window.GFR = { boil: false, vig: false, flash: false, study: false, sub: gfSubtitle,
  over: t => gfTransition(t, { k0: ['iris', 960, 520, 960, 540], r1: ['iris', 960, 540] }) };
['sprun', 'spgame', 'sptop'].forEach(k => CAMS[k] = 'fixed');
Object.assign(QBG, { savanna: 'ai/savanna.jpg' });
const SP = { FY: 900, ZX: 640, V: 560, STOP: 0.85 }, SP_CAM = [880, 600, 1.16];
/* 직장인 제로(운영자 2026-11-16 "회사 다니는 사람처럼"): 남색 정장 + 흰 셔츠 + 넥타이 + 사원증. 서류 가방은 SP_BAG(holdL) */
const SPZW = o => Z(Object.assign({ vest: '#3D4F7A', vshade: 'rgba(0,0,0,0.2)', suit: true, collar: true, tie: '#E0574F', lanyard: true }, o));
const SP_BAG = `<g transform="translate(0 30)"><path d="M-16 -22 Q-16 -36 0 -36 Q16 -36 16 -22" fill="none" stroke="${INK}" stroke-width="6"/><rect x="-44" y="-24" width="88" height="62" rx="10" fill="#8E5E3A" stroke="${INK}" stroke-width="6"/><path d="M-44 0 h88" stroke="${INK}" stroke-width="4" opacity=".5"/><rect x="-8" y="-6" width="16" height="12" rx="3" fill="#E8C66A" stroke="${INK}" stroke-width="3"/></g>`;
const spW = (a, key, fb, n = 0) => { const m = (a._words || []).filter(x => x.w.replace(/\s/g, '').includes(key)); return m[n] ? m[n].t + 0.15 : fb; };

/* ---------- 낮 거리(횡스크롤): off = 지금까지 흐른 거리 ---------- */
function spStreet(t, off) {
  const loop = (depth, P, draw) => { const o = ((off * depth) % P + P) % P; let s = ''; for (let k = -1; k < Math.ceil(2300 / P) + 1; k++) s += `<g transform="translate(${f1(k * P - o)} 0)">${draw()}</g>`; return s; };
  let h = gfFull('url(#gfDay)') + gfSun(1650, 150, 60, t) + `<g transform="translate(${f1(-(off * 0.05) % 2600)} 0)">${gfClouds(t, 190, 3, 3)}</g>`;
  h += loop(0.22, 920, () => [0, 1, 2, 3].map(i => { const x = i * 230, bh = 300 + (i % 3) * 90, y = 690 - bh, col = ['#C9D8FF', '#D9CCFF', '#BFE6F2', '#FFD9C9'][i];
    return `<rect x="${x + 10}" y="${y}" width="190" height="${bh + 240}" rx="14" fill="${col}" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4].slice(0, Math.floor(bh / 75)).map(r => `<rect x="${x + 40}" y="${y + 26 + r * 70}" width="44" height="40" rx="6" fill="#fff" opacity=".8"/><rect x="${x + 116}" y="${y + 26 + r * 70}" width="44" height="40" rx="6" fill="#fff" opacity=".8"/>`).join(''); }).join(''));
  h += loop(0.55, 1120, () => { let s = ''; const SH = [['#FF9AA8', '#FFF1E6'], ['#8FD3FF', '#F2FBFF'], ['#FFD36E', '#FFF8E1'], ['#9EE6B8', '#F1FFF5']];
    for (let i = 0; i < 2; i++) { const x = i * 560 + 30, [aw, wall] = SH[i * 2 + (off > 0 ? 0 : 1)] || SH[i];
      s += `<rect x="${x}" y="580" width="420" height="320" rx="14" fill="${wall}" stroke="${INK}" stroke-width="7"/><rect x="${x + 30}" y="540" width="360" height="56" rx="16" fill="#fff" stroke="${INK}" stroke-width="6"/><g transform="translate(${x + 210} 568)">${gfIcon(['star', 'heart'][i], 0.55, t)}</g>`;
      for (let k = 0; k < 6; k++) s += `<path d="M${x + 15 + k * 65} 610 h65 v30 q-32.5 20 -65 0 Z" fill="${k % 2 ? '#fff' : aw}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
      s += `<rect x="${x + 40}" y="680" width="200" height="140" rx="10" fill="#BFE9FF" stroke="${INK}" stroke-width="6"/><rect x="${x + 280}" y="700" width="100" height="200" rx="10" fill="${aw}" stroke="${INK}" stroke-width="6"/>`;
      s += gfTree(x + 500, SP.FY, 0.8, t); }
    return s; });
  h += `<rect x="-200" y="${SP.FY}" width="2400" height="700" fill="#E8E1D3" stroke="${INK}" stroke-width="7"/>` + loop(1, 180, () => `<line x1="0" y1="${SP.FY}" x2="-24" y2="${SP.FY + 110}" stroke="${INK}" stroke-width="4" opacity=".22"/>`) +
    `<rect x="-200" y="${SP.FY + 110}" width="2400" height="24" fill="#BDB4A3" stroke="${INK}" stroke-width="6"/><rect x="-200" y="${SP.FY + 134}" width="2400" height="600" fill="#6E7491"/>`;
  return h;
}
/* 장애물 */
const spLight = (red, t) => `<g><rect x="-10" y="-430" width="20" height="430" rx="8" fill="#6E7491" stroke="${INK}" stroke-width="6"/><rect x="-46" y="-560" width="92" height="190" rx="22" fill="#3B4570" stroke="${INK}" stroke-width="7"/>` +
  `<circle cx="0" cy="-520" r="26" fill="${red ? '#FF5A5A' : '#5C2B33'}" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="-450" r="26" fill="${red ? '#24443A' : '#5BE38A'}" stroke="${INK}" stroke-width="5"/>${red ? `<circle cx="0" cy="-520" r="52" fill="#FF5A5A" opacity=".25"/>` : ''}</g>`;
const spCross = `<g>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${-150 + i * 52}" y="${SP.FY - 6}" width="30" height="16" rx="4" fill="#fff" stroke="${INK}" stroke-width="3"/>`).join('')}</g>`;
function spTrain(t, k) { // 지하철 칸(옆모습), 창 안에 빽빽한 회색 머리
  let s = `<rect x="-520" y="-460" width="1040" height="440" rx="60" fill="#E6ECF5" stroke="${INK}" stroke-width="8"/><rect x="-520" y="-150" width="1040" height="30" fill="#7FB8FF" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 4; i++) { const x = -470 + i * 250; s += `<rect x="${x}" y="-400" width="190" height="200" rx="18" fill="#BFE9FF" stroke="${INK}" stroke-width="6"/>`;
    for (let j = 0; j < 4; j++) s += `<circle cx="${x + 30 + j * 44}" cy="${-260 + (j % 2) * 10}" r="26" fill="#C9CED8" stroke="${INK}" stroke-width="4"/>`; }
  return s + `<circle cx="-360" cy="-10" r="34" fill="#3B4570" stroke="${INK}" stroke-width="6"/><circle cx="360" cy="-10" r="34" fill="#3B4570" stroke="${INK}" stroke-width="6"/>`;
}
const spElev = (k) => { const w = 170 * (1 - k); return `<g><rect x="-230" y="-620" width="460" height="620" rx="16" fill="#C9D3E8" stroke="${INK}" stroke-width="8"/><rect x="-190" y="-580" width="380" height="580" fill="#FFF6D6"/>` +
  `<rect x="-190" y="-580" width="${f1(190 - w)}" height="580" fill="#DDE3F3" stroke="${INK}" stroke-width="6"/><rect x="${f1(w)}" y="-580" width="${f1(190 - w)}" height="580" fill="#DDE3F3" stroke="${INK}" stroke-width="6"/>` +
  `<rect x="-60" y="-660" width="120" height="34" rx="10" fill="#3B4570" stroke="${INK}" stroke-width="5"/><path d="M-20 -650 l10 -10 l10 10 M10 -636 l10 10 l10 -10" stroke="#FFD36E" stroke-width="5" fill="none"/></g>`; };

/* 달리는 시간: 멈춤 구간을 뺀 시간 */
const spRunT = (lt, hits) => lt - hits.reduce((s, h) => s + Math.min(Math.max(lt - h, 0), SP.STOP), 0);
function spHud(lt, v, o = {}) {
  let h = fkAt(250, 92, fkHearts(lt, v, { from: o.from, tp: o.tp, low: v <= 1 }), 0.82);
  h += fkAt(1700, 92, gfChip(o.clock || 'AM 08:20', { size: 40, icon: 'clock', bg: '#fff' }), o.clk != null ? gfBeat(lt, o.clk, 0.16, 4, 8) : 1);
  if (o.combo) h += fkAt(250, 180, gfChip(`콤보 ×${o.combo}`, { size: 36, bg: GFC.sun }), gfIn(lt, o.ctp, 3.4, 0.42) * gfBeat(lt, o.ctp, 0.15, 4, 8), -4);
  return h;
}
const spMiss = (lt, t0, x, y) => (lt > t0 && lt < t0 + 1.1 ? gfBounceText(lt, t0, x, y, [['MISS!', '#FF5A5A']], { size: 84 }) : '') + (lt > t0 && lt < t0 + 1.1 ? fkAt(x + 40, y + 70 - 60 * gfK(t0, t0 + 1.1, lt), gfT(0, 0, '-1', 54, '#FF5A5A', { wt: 900 }), 1 - gfK(t0 + 0.7, t0 + 1.1, lt)) : '');

sprunScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 9, s = 0.9;
  if (ph === 0) {
    const t1 = spW(a, '신호등', 1.0) + 0.25, t2 = spW(a, '지하철', 2.6) + 0.25, t3 = spW(a, '앉기도', 4.6) + 0.1, tB = spW(a, '상사', 5.6), tK = spW(a, '카톡', 7.2) + 0.1;
    const hits = [t1, t2, t3], rt = spRunT(lt, hits), off = SP.V * rt, stopped = hits.some(h => lt > h && lt < h + SP.STOP) || lt > tK;
    const sx = h => SP.ZX + 130 + SP.V * (spRunT(h, hits) - rt);
    let w = '', front = '', m = {}, ex = 'z결심', pose = null;
    // 1 신호등
    const lx = sx(t1) + 60; if (lx > -300 && lx < 2300) { w += `<g transform="translate(${f1(lx - 140)} 0)">${spCross}</g>` + fkAt(lx, SP.FY, spLight(lt > t1 - 0.25 && lt < t1 + SP.STOP - 0.1, t)); }
    // 2 지하철: 멈춘 동안 제로 둘레에 칸이 와서 찌부
    const tk = gfK(t2 - 0.35, t2, lt) * (1 - gfK(t2 + SP.STOP - 0.1, t2 + SP.STOP + 0.25, lt));
    if (tk > 0) front += `<g transform="translate(${f1(SP.ZX + 40 + 1500 * (1 - easeOut(gfK(t2 - 0.35, t2, lt))) - 1500 * easeIn(gfK(t2 + SP.STOP - 0.1, t2 + SP.STOP + 0.25, lt)))} ${SP.FY - 10})">${spTrain(t, tk)}</g>`;
    // 3 엘리베이터 문 + 상사 말풍선
    const ex3 = sx(t3) + 120; if (ex3 > -400 && ex3 < 2400) w += fkAt(ex3, SP.FY, spElev(gfK(t3 - 0.5, t3, lt)));
    let spikes = ''; for (let i = 0; i < 4; i++) { const t0 = tB + i * 0.32, th = t0 + 0.55; if (lt > t0 && lt < th) { const u = easeIn(gfK(t0, th, lt)); spikes += fkSpike(lerp(1900, SP.ZX + 90, u), lerp(380 + i * 30, SP.FY - 330, u) - Math.sin(Math.PI * u) * 60, 0.75, t, { rot: -20 + 40 * u }); } if (lt > th) spikes += gfPuff(lt, th, SP.ZX + 80, SP.FY - 330, 0.9, '#FFD1D1'); }
    const tkHit = tB + 3 * 0.32 + 0.55;
    // 제로
    const hitNow = hits.find(h => lt > h && lt < h + SP.STOP);
    if (hitNow != null) { m = gfJelly(lt, hitNow, 0.16, 5, 8); ex = hitNow === t2 ? 'z멘붕' : 'z충격'; }
    if (lt > t2 && lt < t2 + SP.STOP) m = { sx: 0.74, sy: 1.08 };
    if (lt > tB + 0.55 && lt < tkHit + 0.6) { m = gfJelly(lt, tB + 0.55, 0.12, 6, 9); ex = 'z울먹'; }
    if (lt > tkHit + 0.3) { ex = 'z울먹'; }
    const wk = stopped ? null : gfWalk(off * 1.4, 1.0);
    if (lt > t1 && lt < t1 + 0.4) m = gfM(m, { rot: -8 });
    w += gfActor(SPZW, { x: SP.ZX, y: SP.FY, s, t, pose: wk ? wk.pose : '서기', ex: fEx(ex), look: [0.7, 0], seed: 3 }, wk ? gfM({ sy: wk.sy, dy: wk.dy }, m) : m);
    w += spikes;
    if (lt > t2 && lt < t2 + SP.STOP) { w += gfActor(o => FKV('#B9BEC9', o), { x: SP.ZX - 150, y: SP.FY, s: 0.9, t, pose: '서기', ex: fEx('z멍'), look: [0.5, 0], seed: 90 }) + gfActor(o => FKV('#C9B9C9', o), { x: SP.ZX + 150, y: SP.FY, s: 0.9, t, pose: '서기', ex: fEx('z멍'), look: [-0.5, 0], seed: 92 }); }
    const nH = 4 - [t1, t2, tkHit].filter(h => lt > h).length, lastH = [t1, t2, tkHit].filter(h => lt > h).pop();
    const combo = [t1, t2, tkHit].filter(h => lt > h).length;
    let inner = spStreet(t, off) + w + front;
    [t1, t2, tkHit].forEach(hh => { inner += spMiss(lt, hh, SP.ZX + 40, SP.FY - 600); });
    let h = fkDefs() + qCam(SP_CAM, inner);
    if (lt > t1 && lt < t1 + 0.3) h = `<g transform="translate(${f1(gfShake(lt, t1, 14, 0.3)[0])} ${f1(gfShake(lt, t1, 14, 0.3)[1])})">${h}</g>`;
    if (lt > t3 && lt < t3 + 0.3) h = `<g transform="translate(${f1(gfShake(lt, t3, 12, 0.3)[0])} 0)">${h}</g>`;
    h += spHud(lt, nH, { from: nH + 1, tp: lastH, combo: combo || 0, ctp: lastH });
    if (lt < 2.0) h += fkAt(960, 300, gfPanel(560, 150, { bg: '#fff' }) + gfT(0, -8, '출근 스테이지', 52, GFC.navy) + gfT(0, 44, '출근 모드 ON', 30, GFC.grape), gfIn(lt, 0.1, 3, 0.45) * (1 - gfK(1.6, 1.95, lt)));
    return h;
  }
  // s2: 영혼이 털리는 기분
  const tS = spW(a, '영혼', 1.2), tA = spW(a, '아시죠', 2.6), wob = Math.sin(t * 6) * 6;
  let w = gfActor(SPZW, { x: SP.ZX + 40, y: SP.FY, s, t, pose: '서기', ex: fEx('z기절'), look: [0, 0], seed: 3 }, { rot: wob, sy: 0.97 });
  if (lt > tS) { const u = gfK(tS, tS + 1.6, lt); w += fkAt(SP.ZX + 40, SP.FY - 560 - 220 * easeOut(u), `<g transform="scale(2.2)">${GF_ICON.ghost(t)}</g>`, (1 - 0.4 * u), Math.sin(t * 4) * 8); }
  if (lt > tA) w += gfEmote(lt, tA, SP.ZX + 170, SP.FY - 520, 'sweat', { hold: 9 });
  let h = fkDefs() + qCam(SP_CAM, spStreet(t, 0) + w);
  return h + spHud(lt, 1, { combo: 3, ctp: -9 }) + (lt < 0.9 ? gfBounceText(lt, 0.05, 960, 300, [['콤보 ×3', GFC.sun]], { size: 96 }) : '');
};

/* s3·s4: 상상 게임 (도트 화풍 전환) */
spgameScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 9, zx = 900, s = 0.92;
  let bg = spStreet(t, 0), fg = '', hud = '', style = 'vector', mos = 0, cam = SP_CAM;
  if (ph === 0) {
    const tF = spW(a, '기를', 2.8), tM = spW(a, '돈', 3.6), tC = spW(a, '회사', 4.0), tR = spW(a, '직급', 4.4), t7 = spW(a, '7만', 6.4), tG = spW(a, '게임', 7.6);
    fg += gfActor(SPZW, { x: zx, y: SP.FY, s, t, pose: lt > tF && lt < tM + 0.6 ? '주먹' : '서기', ex: fEx(lt > tG ? 'z당황' : lt > tF ? 'z결심' : 'z멍'), look: [0, -0.3], seed: 3 }, lt > tF && lt < tF + 0.5 ? gfJelly(lt, tF, 0.1, 5, 8) : {});
    const IT = [[tM, 'star', '돈', 660, 360], [tC, 'building', '회사', 900, 290], [tR, 'tie', '직급', 1140, 360]];
    IT.forEach(([t0, ic, nm, x, y]) => { const k = gfIn(lt, t0, 3.4, 0.42); if (k > 0.02) fg += fkAt(x, y + Math.sin(t * 2 + x) * 8, `<circle r="70" fill="#fff" stroke="${INK}" stroke-width="7"/><g transform="translate(0 -6) scale(1.6)">${GF_ICON[ic](t)}</g>`, k); });
    IT.forEach(([t0, ic, nm, x, y]) => { hud += gfChipAt(lt, t0 + 0.1, x, y + 95, nm, { size: 32, bg: '#fff' }); });
    if (lt > t7) hud += gfChipAt(lt, t7, 960, 130, '7만 년 전?', { size: 44, icon: 'clock', bg: '#fff', rot: -2 });
    style = lt < tG ? 'vector' : 'pixel'; mos = gfStyleMosaic(lt, tG, 0.28);
    if (lt > tG) hud += spDashFrame(lt, tG) + gfChipAt(lt, tG + 0.3, 1500, 250, '상상 게임', { size: 46, bg: '#EDE8FF', col: '#5B4FCF' });
  } else {
    const tR = spW(a, '규칙', 1.0), tL = spW(a, '가벼워', 4.2);
    style = lt < 0.2 ? 'pixel' : 'vector'; mos = gfStyleMosaic(lt, 0.2, 0.28);
    const happy = lt > tL;
    fg += gfActor(SPZW, { x: zx, y: SP.FY, s, t, pose: happy ? '만세' : '서기', ex: fEx(happy ? 'z빵긋' : 'z반짝'), look: [0.3, -0.2], seed: 3 }, happy ? gfHop(lt, tL, 40, 0.4) : {});
    hud += spDashFrame(lt, -9, 1 - gfK(0.4, 1.0, lt));
    if (lt > tR - 0.1) hud += fkAt(1450, 470, gfQuest(lt, [{ text: '게임 규칙 이해하기', t0: tR, done: tL + 0.2 }], { head: '오늘의 퀘스트', headBg: GFC.sun, w: 560 }), gfIn(lt, tR - 0.1, 3, 0.45));
    if (happy) hud += gfStarBurst(lt, tL, zx, SP.FY - 300, { r1: 260, n: 10 }) + gfConfetti(lt, tL + 0.1, { n: 30, d: 1.6 });
  }
  const v = ph === 1 && lt > (spW(a, '가벼워', 4.2)) ? 3 : 1;
  return fkDefs() + gfStyleDefs(style, { mosaic: mos }) + gfStyled(style, qCam(cam, bg), qCam(cam, fg), t, { mosaic: mos }) + hud + spHud(lt, v, { from: 1, tp: ph === 1 ? spW(a, '가벼워', 4.2) : null });
};
/* 화면 둘레의 점선 상자(개미 행렬처럼 흐름) */
const spDashFrame = (lt, t0, k = 1) => { const a = (t0 > -1 ? gfIn(lt, t0, 3, 0.45) : 1) * k; if (a < 0.02) return ''; const m = 30 + 60 * (1 - a), X = -110 + m, Y = 10 + m, Wd = 2140 - 2 * m, Hd = 1050 - 2 * m;
  return `<rect x="${X}" y="${Y}" width="${Wd}" height="${Hd}" rx="30" fill="none" stroke="#fff" stroke-width="16" stroke-dasharray="36 24" stroke-dashoffset="${f1(-lt * 60)}" opacity="${f1(a * 100) / 100}"/><rect x="${X}" y="${Y}" width="${Wd}" height="${Hd}" rx="30" fill="none" stroke="${INK}" stroke-width="6" stroke-dasharray="36 24" stroke-dashoffset="${f1(-lt * 60)}" opacity="${f1(a * 100) / 100}"/>`; };

/* ===== r1~r5: 인지 혁명 (위에서 내려다본 초원, Grok 판) ===== */
const SP_RIVER = { y: 635, x0: 960 };      // Grok 판(savanna_top_1)에서 화면 가운데 강의 중심
const spBean = (x, y, s, col, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000})"><ellipse cx="4" cy="8" rx="25" ry="20" fill="#1B2A12" opacity=".2"/><ellipse cx="0" cy="9" rx="23" ry="15" fill="${col}" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-3" r="14.5" fill="#FFF8EE" stroke="${INK}" stroke-width="4"/><path d="M-6 -10 q6 -6 12 0" fill="none" stroke="${INK}" stroke-width="2.5" opacity=".35"/></g>`;
const SP_TUNIC = ['#B98552', '#9C6B43', '#7FA35A', '#C9A06A', '#8E7A5A', '#A8785A'];
const SP_FURDEF = `<defs><pattern id="spFur" patternUnits="userSpaceOnUse" width="56" height="56"><rect width="56" height="56" fill="#C99A5B"/><ellipse cx="14" cy="14" rx="9" ry="6" fill="#7A4E26"/><ellipse cx="42" cy="34" rx="9" ry="6" fill="#7A4E26"/><ellipse cx="20" cy="46" rx="5" ry="4" fill="#8E6033"/><ellipse cx="46" cy="8" rx="4" ry="3" fill="#8E6033"/></pattern>` +
  `<pattern id="spFur2" patternUnits="userSpaceOnUse" width="48" height="48"><rect width="48" height="48" fill="#8B6A4A"/><path d="M6 10 l6 8 M24 4 l4 9 M38 18 l6 7 M12 32 l5 8 M30 36 l6 8" stroke="#5E4129" stroke-width="4" stroke-linecap="round"/></pattern></defs>`;
const SP_SHAG = col => `<path d="M80 172 L66 128 L90 132 L82 88 L112 100 L116 60 L146 78 L160 40 L186 66 L206 30 L226 64 L250 38 L264 76 L294 60 L296 98 L328 94 L314 132 L336 150 L320 176 L300 142 L284 120 L266 138 L248 112 L228 134 L208 108 L188 132 L168 108 L148 134 L128 112 L110 140 L96 124 L90 152 Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
const SP_CLUB = { follow: true, svg: `<path d="M-6 -9 L66 -14 Q114 -28 128 0 Q114 28 66 14 L-6 9 Z" fill="#A9743F" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><circle cx="98" cy="-7" r="5" fill="#7A4E26"/><circle cx="82" cy="8" r="4" fill="#7A4E26"/><path d="M10 -4 L50 -6" stroke="#7A4E26" stroke-width="3" opacity=".5"/>` };
const SP_AXE = `<g transform="translate(-6 -20)"><path d="M-4 -30 Q24 -22 28 6 Q14 32 -12 24 Q-24 -2 -4 -30 Z" fill="#A3A8B0" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M0 -16 L8 4 M12 -12 L16 6" stroke="#6E747C" stroke-width="3" stroke-linecap="round"/></g>`;
const SP_RIDGE = () => `<path d="M100 174 Q108 126 200 126 Q292 126 300 174 Q278 158 200 160 Q122 158 100 174 Z" fill="#EDE8DF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M128 148 Q200 138 272 148" fill="none" stroke="${INK}" stroke-width="3" opacity=".25"/>` +
  `<path d="M180 194 Q170 224 186 232 Q200 238 214 232 Q230 224 220 194" fill="#F4F0E8" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
const spPrimZ = o => Z(Object.assign({ vest: 'url(#spFur)', vshade: 'rgba(80,40,10,0.18)', toga: '#7A4E26', dress: 'url(#spFur)', hairFront: SP_SHAG('#3E2A1C'), holdR: SP_CLUB }, o));
const spNean = o => HALO(char(Object.assign({ goggles: 'none', vest: 'url(#spFur2)', patch: false, tee: true, vshade: 'rgba(60,30,10,0.2)', toga: '#5E4129', dress: 'url(#spFur2)', hairFront: SP_SHAG('#4A3020'), beard: '#4A3020', headFx: SP_RIDGE, puffy: true, holdL: SP_AXE, seed: 95 }, o)));
const spFire = (x, y, t) => { const f = Math.sin(t * 11) * 6, g = Math.sin(t * 7 + 1) * 4;
  return `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M-30 16 L30 0 M-30 0 L30 16" stroke="#7A4E26" stroke-width="12" stroke-linecap="round"/><path d="M0 ${f1(-66 - f)} Q30 -24 20 4 Q0 14 -20 4 Q-30 -24 0 ${f1(-66 - f)} Z" fill="#FF9A3C" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M0 ${f1(-36 - g)} Q14 -14 8 2 Q0 8 -8 2 Q-14 -14 0 ${f1(-36 - g)} Z" fill="#FFE07A"/></g>`; };
/* 원 창 안: 하늘·먼 언덕·동굴 절벽·풀밭·모닥불(옛날임을 한눈에) */
function spCaveBG(r, t, f) {
  return `<rect x="${-r}" y="${-r}" width="${2 * r}" height="${2 * r}" fill="url(#gfDay)"/>` +
    `<path d="M${-r} ${f1(r * 0.12)} Q${f1(-r * 0.5)} ${f1(-r * 0.22)} 0 ${f1(r * 0.06)} Q${f1(r * 0.5)} ${f1(-r * 0.28)} ${r} ${f1(r * 0.06)} L${r} ${r} L${-r} ${r} Z" fill="#D8C7A4" stroke="${INK}" stroke-width="5"/>` +
    `<g transform="scale(${f} 1)"><path d="M${-r} ${f1(-r * 0.45)} Q${f1(-r * 0.62)} ${f1(-r * 0.7)} ${f1(-r * 0.3)} ${f1(-r * 0.42)} Q${f1(-r * 0.12)} ${f1(-r * 0.2)} ${f1(-r * 0.16)} ${f1(r * 0.4)} L${-r} ${f1(r * 0.4)} Z" fill="#A08A72" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M${f1(-r * 0.84)} ${f1(r * 0.38)} Q${f1(-r * 0.84)} ${f1(-r * 0.12)} ${f1(-r * 0.58)} ${f1(-r * 0.12)} Q${f1(-r * 0.34)} ${f1(-r * 0.12)} ${f1(-r * 0.34)} ${f1(r * 0.38)} Z" fill="#2E2433" stroke="${INK}" stroke-width="5"/></g>` +
    `<rect x="${-r}" y="${f1(r * 0.36)}" width="${2 * r}" height="${r}" fill="#B9C97A" stroke="${INK}" stroke-width="5"/>` + spFire(f * r * 0.6, r * 0.66, t);
}
function spInset(cx, cy, r, inner, k, label, t = 0, f = 1) {
  if (k < 0.02) return ''; const id = 'spIn' + cx;
  return fkAt(cx, cy, `<clipPath id="${id}"><circle r="${r}"/></clipPath><circle r="${r + 10}" fill="${GFC.navy}" opacity=".25" transform="translate(8 10)"/><g clip-path="url(#${id})">${spCaveBG(r, t, f)}${inner}</g><circle r="${r}" fill="none" stroke="${INK}" stroke-width="9"/>` +
    `<g transform="translate(0 ${r + 26})">${gfChip(label, { size: 32, bg: '#fff' })}</g>`, k);
}
/* 무리: 시드로 고정된 자리 */
const spSeedPts = (n, cx, cy, rx, ry, seed) => Array.from({ length: n }, (_, i) => { const a = hash(seed + i * 1.37) * Math.PI * 2, r = Math.sqrt(hash(seed + i * 2.71)); return [cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r, SP_TUNIC[i % 6], hash(seed + i * 4.1)]; });
const SP_CLAN = spSeedPts(70, 560, 330, 230, 150, 3);
const SP_MANY = spSeedPts(520, 960, 560, 900, 470, 11).filter(p => p[1] < 455 || p[1] > 820).slice(0, 260);
sptopScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 6;
  let cam = qLerpCam(lt / D, ph <= 1 ? [960, 560, 1.12] : ph === 2 ? [700, 420, 1.3] : [960, 560, 1.02], ph <= 1 ? [960, 560, 1.06] : ph === 2 ? [760, 440, 1.22] : [960, 560, 1.0]);
  let w = '', hud = '';
  if (ph <= 1) {
    const k = ph === 0 ? gfIn(lt, 0.2, 3, 0.45) : 1 - gfK(spW(a, '능력', 1.6) - 0.2, spW(a, '능력', 1.6) + 0.2, lt);
    const tH = ph === 0 ? spW(a, '하라리', 0.6) : -9, tS = ph === 0 ? spW(a, '호모', 3.2) : -9, tQ = ph === 0 ? spW(a, '비결', 5.0) : -9;
    hud += SP_FURDEF + spInset(540, 470, 275, gfActor(spPrimZ, { x: -30, y: 262, s: 0.8, t, pose: '서기', ex: fEx(lt > tQ ? 'z의심' : 'z기본'), look: [0.5, 0], seed: 3 }), k, '원시인 제로', t, -1);
    hud += spInset(1380, 470, 275, gfActor(spNean, { x: 30, y: 262, s: 0.82, t, pose: '서기', ex: fEx('z기본'), look: [-0.5, 0], sx: 1.14 }), k, '네안데르탈인 친구', t, 1);
    if (ph === 0) { hud += gfChipAt(lt, tH, 960, 130, '『사피엔스』 · 유발 하라리', { size: 40, icon: 'book', bg: '#fff', rot: -2 }) + gfChipAt(lt, tS, 960, 800, '호모 사피엔스', { size: 40, bg: '#FFF3C4' });
      if (lt > tQ) hud += gfEmote(lt, tQ, 700, 260, 'q', { hold: 9 }); }
    else { const tI = spW(a, '능력', 1.6); hud += fkAt(960, 520, gfItem(lt, tI - 0.3, { name: '인지 혁명', sub: '눈앞에 없는 걸 함께 믿는 능력', w: 620, svg: `<g transform="translate(0 6) scale(1.3)">${fkCloud(0, 0, 0.9, t, { rain: 0, col: '#EDE8FF' })}</g>` }), 1); }
  } else if (ph === 2) {
    const t150 = spW(a, '150', 2.6), tC = spW(a, '협력', 4.0);
    const n = Math.floor(lerp(8, 70, gfK(0.1, t150 + 0.6, lt))), scat = gfK(tC + 0.4, tC + 1.6, lt);
    const P = SP_CLAN.slice(0, n).map(([x, y, c, r]) => [x + (x - 560) * 0.9 * easeIn(scat), y + (y - 330) * 0.9 * easeIn(scat), c, r]);
    if (lt > t150 - 0.3) { let ln = ''; const m = Math.floor(lerp(0, 160, gfK(t150 - 0.3, tC + 0.4, lt))); for (let i = 0; i < m; i++) { const p = P[Math.floor(hash(i * 3.3) * P.length)], q = P[Math.floor(hash(i * 7.9) * P.length)]; if (p && q) ln += `<line x1="${f1(p[0])}" y1="${f1(p[1] - 10)}" x2="${f1(q[0])}" y2="${f1(q[1] - 10)}"/>`; }
      w += `<g stroke="#5B4FCF" stroke-width="3" opacity="${f1((0.55 - 0.45 * scat) * 100) / 100}">${ln}</g>`; }
    P.forEach(([x, y, c, r], i) => { const k = gfIn(lt, 0.1 + i * 0.03, 3.4, 0.42); w += spBean(x + Math.sin(t * 2 + i) * 2, y, 0.9 * k, c, (r - 0.5) * 40); });
    if (lt > tC + 0.3) w += gfEmote(lt, tC + 0.3, 560, 170, 'gloom', { hold: 9 });
    hud += gfChipAt(lt, t150, 330, 130, '얼굴을 아는 150명', { size: 40, icon: 'family', bg: '#fff', rot: -2 });
    if (lt > t150) { const bv = Math.min(1, lerp(0.4, 1.12, gfK(t150, tC + 0.4, lt))), crack = bv >= 1;
      hud += fkAt(330, 220, gfBar(420, Math.min(1, bv), { h: 36, col: crack ? GFC.coral : GFC.grass2 }) + (crack ? `<path d="M380 -14 l-14 12 l12 6 l-16 14" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` : '') + gfT(440, 12, '150', 30, GFC.navy, { anchor: 'start' }), gfIn(lt, t150, 3, 0.45)); }
  } else if (ph === 3) {
    const tN = spW(a, '국가', 0.6), tB = spW(a, '법인', 1.2), tR = spW(a, '종교', 1.8), tM = spW(a, '돈이라는', 2.6), tI = spW(a, '보이지', 3.4);
    SP_MANY.forEach(([x, y, c, r], i) => { const k = gfIn(lt, 0.05 + (i % 40) * 0.02, 3.4, 0.42); w += spBean(x + Math.sin(t * 2 + i) * 2, y, 0.62 * k, c, (r - 0.5) * 50); });
    if (lt > tI) { const lk = gfK(tI, tI + 0.8, lt); let ln = ''; for (let i = 0; i < 60; i++) { const [x, y] = SP_MANY[i * 4], [cx, cy] = SP_CL[i % 4]; ln += `<line x1="${f1(x)}" y1="${f1(y)}" x2="${cx}" y2="${cy + 40}"/>`; }
      w += `<g stroke="#FFE38A" stroke-width="3" stroke-dasharray="10 8" opacity="${f1(0.7 * lk * 100) / 100}">${ln}</g>`; }
    w += spClouds(lt, t, [tN, tB, tR, tM], true);
    if (lt > tI) hud += gfChipAt(lt, tI, 960, 380, '함께 믿는 보이지 않는 이야기', { size: 40, bg: '#EDE8FF', col: '#5B4FCF' });
  } else {
    const B = spBridge(t, lt, a); w += B.w + spClouds(lt, t, [-9, -9, -9, -9], false); hud += B.hud; cam = B.cam;
  }
  return fkDefs() + `<rect x="-600" y="-600" width="3120" height="2280" fill="#8CC66A"/>` + qPlate('savanna', cam, 1) + qCam(cam, w) + hud;
};

/* 이야기 구름 넷(국가·법인·종교·돈) */
const SP_CL = [[560, 200, 'flag', '국가'], [860, 150, 'building', '법인'], [1160, 150, 'bulb', '종교'], [1440, 200, 'star', '돈']];
function spClouds(lt, t, T, label) {
  return SP_CL.map(([x, y, ic, nm], i) => { const k = T[i] > -1 ? gfIn(lt, T[i], 3.4, 0.42) : 1; if (k < 0.02) return '';
    return fkAt(x, y + Math.sin(t * 1.6 + x) * 8, `<ellipse cx="0" cy="150" rx="90" ry="22" fill="#1B2A12" opacity=".15"/>` + fkCloud(0, 0, 1.0, t, { rain: 0, col: '#FFFFFF' }).replace(/<ellipse cx="-14"[\s\S]*$/, '</g>') + `<g transform="scale(1.3)">${GF_ICON[ic](t)}</g>`, k) + (label ? gfChipAt(lt, T[i] + 0.1, x, y + 110, nm, { size: 30, bg: '#fff' }) : ''); }).join('');
}
/* ===== r5: 다리 짓기 — 네 줄로 늘어서 통나무를 손에서 손으로 → 양쪽 둑에서 널을 깔아 가운데서 만남 → 사람들이 건넘 =====
   강 가운데(x 960)의 둑: 북 677, 남 843(Grok 판에서 잼). 사슬은 모두 뭍 위(강 피함). */
const SP_BR = { x: 960, w: 170, yN: 640, yS: 880, st: 19, nN: 7, nS: 6 };
const SP_CH = [[[560, 400], [930, 646]], [[1360, 400], [990, 646]], [[560, 950], [930, 878]], [[1360, 950], [990, 878]]];
const SP_CHN = 11;
const SP_ROLE = (() => { const used = new Set(), role = {}; SP_CH.forEach(([p, q], c) => { for (let j = 0; j < SP_CHN; j++) { const u = j / (SP_CHN - 1), tx = lerp(p[0], q[0], u) + (j % 2 ? 8 : -8), ty = lerp(p[1], q[1], u);
  let best = -1, bd = 1e12; SP_MANY.forEach(([x, y], i) => { if (used.has(i)) return; const d = (x - tx) ** 2 + (y - ty) ** 2; if (d < bd) { bd = d; best = i; } }); used.add(best); role[best] = [c, j / (SP_CHN - 1), tx, ty]; } }); return role; })();
const spSegD = (x, y, p, q) => { const vx = q[0] - p[0], vy = q[1] - p[1], u = clamp(((x - p[0]) * vx + (y - p[1]) * vy) / (vx * vx + vy * vy), 0, 1), cx = p[0] + vx * u, cy = p[1] + vy * u; return [Math.hypot(x - cx, y - cy), x - cx, y - cy]; };
const SP_CROWD = SP_MANY.map(([x, y], i) => { if (SP_ROLE[i]) return null; let px = x, py = y; const dx0 = px - 960; if (Math.abs(dx0) < 560) px = 960 + Math.sign(dx0 || 1) * (560 + Math.abs(dx0) * 0.55); SP_CH.forEach(([p, q]) => { const [d, dx, dy] = spSegD(px, py, p, q); if (d < 46) { const k = (46 - d) / Math.max(d, 1); px += dx * k; py += dy * k; } }); return [px, py]; });
const spLog = (x, y, ang, k = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)}) scale(${f1(k * 100) / 100})"><rect x="-36" y="-11" width="72" height="22" rx="11" fill="#A9743F" stroke="${INK}" stroke-width="4"/><ellipse cx="36" cy="0" rx="6" ry="11" fill="#E2C08A" stroke="${INK}" stroke-width="3"/><path d="M-24 -3 L18 -3" stroke="#7A4E26" stroke-width="3" opacity=".5"/></g>`;
const spPile = (x, y) => [[-26, 10], [26, 10], [0, -10], [-52, 30], [0, 30], [52, 30]].map(([dx, dy]) => spLog(x + dx, y + dy, 0, 0.9)).join('');
function spBridge(t, lt, a) {
  const B = SP_BR, tGo = spW(a, '생판', 0.91), tA = spW(a, '수백만', 2.23) - 0.25, tT = spW(a, '팀', 3.71), tF = tT - 0.08, stp = (tF - tA) / (B.nN - 1);
  const form = easeInOut(gfK(tGo, tGo + 1.0, lt)), cheer = lt > tT, fadeL = 1 - gfK(0.5, 1.1, lt);
  const tN = k => tA + k * stp, tS = k => tA + stp * 0.5 + k * stp;
  let w = '', hud = '';
  // 이야기 구름으로 가는 점선(앞 장면에서 이어짐) → 사라짐
  if (fadeL > 0.02) { let ln = ''; for (let i = 0; i < 60; i++) { const [x, y] = SP_MANY[i * 4], [cx, cy] = SP_CL[i % 4]; ln += `<line x1="${f1(x)}" y1="${f1(y)}" x2="${cx}" y2="${cy + 40}"/>`; } w += `<g stroke="#FFE38A" stroke-width="3" stroke-dasharray="10 8" opacity="${f1(0.7 * fadeL * 100) / 100}">${ln}</g>`; }
  // 통나무 더미 4곳
  SP_CH.forEach(([p]) => { w += fkAt(0, 0, spPile(p[0], p[1]), 1); });
  // 다리: 널(북쪽 7, 남쪽 6) + 난간 줄
  let pl = '', nN = 0, nS = 0;
  for (let k = 0; k < B.nN; k++) { const k0 = gfIn(lt, tN(k), 3.6, 0.45); if (k0 < 0.02) continue; nN = k + 1; const y = B.yN + k * B.st + 8;
    pl += `<g transform="translate(${B.x} ${y}) scale(${f1(k0 * 100) / 100})"><rect x="${-B.w / 2}" y="-8" width="${B.w}" height="16" rx="4" fill="#C08A50" stroke="${INK}" stroke-width="4"/><path d="M${-B.w / 2 + 14} -1 h${B.w * 0.4}" stroke="#8E6033" stroke-width="3" opacity=".6"/></g>`; }
  for (let k = 0; k < B.nS; k++) { const k0 = gfIn(lt, tS(k), 3.6, 0.45); if (k0 < 0.02) continue; nS = k + 1; const y = B.yS - k * B.st - 8;
    pl += `<g transform="translate(${B.x} ${y}) scale(${f1(k0 * 100) / 100})"><rect x="${-B.w / 2}" y="-8" width="${B.w}" height="16" rx="4" fill="#C08A50" stroke="${INK}" stroke-width="4"/><path d="M${B.w / 2 - 14} 1 h${-B.w * 0.4}" stroke="#8E6033" stroke-width="3" opacity=".6"/></g>`; }
  const eN = B.yN + nN * B.st, eS = B.yS - nS * B.st, done = nN === B.nN && nS === B.nS;
  const rail = (x, y0, y1) => y1 > y0 + 4 ? `<line x1="${x}" y1="${f1(y0)}" x2="${x}" y2="${f1(y1)}" stroke="#7A4E26" stroke-width="7" stroke-linecap="round"/>` : '';
  let rl = ''; [-1, 1].forEach(sd => { const x = B.x + sd * (B.w / 2 + 8); rl += rail(x, B.yN, eN) + rail(x, eS, B.yS);
    for (let k = 0; k < nN; k += 2) rl += `<circle cx="${x}" cy="${B.yN + k * B.st + 8}" r="8" fill="#7A4E26" stroke="${INK}" stroke-width="3"/>`;
    for (let k = 0; k < nS; k += 2) rl += `<circle cx="${x}" cy="${B.yS - k * B.st - 8}" r="8" fill="#7A4E26" stroke="${INK}" stroke-width="3"/>`; });
  w += `<g>${pl}${rl}</g>`;
  // 사람들: 사슬로 줄을 서고, 통나무가 지나갈 때 번쩍 듦
  if (form > 0.6) w += SP_CH.map(([p, q]) => `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#FFF3C4" stroke-width="22" stroke-linecap="round" opacity="${f1((form - 0.6) * 1.8 * 100) / 100}"/>`).join('');
  const logs = [];
  for (let k = 0; k < B.nN; k++) logs.push([k % 2, tN(k)]);
  for (let k = 0; k < B.nS; k++) logs.push([2 + (k % 2), tS(k)]);
  SP_MANY.forEach(([x, y, c, r], i) => { const R = SP_ROLE[i];
    if (R) { const [ch, u, tx, ty] = R; let lift = 0; logs.forEach(([cc, tp]) => { if (cc !== ch) return; const lu = gfK(tp - 0.9, tp, lt); if (lu > 0 && lu < 1 && Math.abs(lu - u) < 0.09) lift = Math.max(lift, 1 - Math.abs(lu - u) / 0.09); });
      const px = lerp(x, tx, form), py = lerp(y, ty, form), bob = cheer ? Math.sin(t * 7 + u * 6) * 4 : 0;
      w += spBean(px, py - lift * 6 + bob, 0.62 + 0.14 * form + 0.14 * lift, c, (r - 0.5) * 50 * (1 - form)); }
    else { const [cx, cy] = SP_CROWD[i]; const px = lerp(x, cx, form), py = lerp(y, cy, form);
      w += spBean(px + (cheer ? 0 : Math.sin(t * 2 + i) * 2), py + (cheer ? Math.sin(t * 7 + (i % 9) * 0.6) * 4 : 0), 0.6, c, cheer ? 0 : (r - 0.5) * 50); } });
  // 통나무가 사슬을 따라 손에서 손으로
  logs.forEach(([ch, tp]) => { const u = gfK(tp - 0.9, tp, lt); if (u <= 0 || u >= 1) return; const [p, q] = SP_CH[ch], ang = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI + 90;
    w += spLog(lerp(p[0], q[0], u), lerp(p[1], q[1], u) - 10, ang, 0.95); });
  // 다리 끝의 일꾼(북 2, 남 2): 널을 하나 놓을 때마다 앞으로 톡
  if (!done && form > 0.5) { [[-1, eN + 4, 'N'], [1, eN + 4, 'N'], [-1, eS - 4, 'S'], [1, eS - 4, 'S']].forEach(([sd, y, side], j) => {
    const lastT = side === 'N' ? (nN ? tN(nN - 1) : tA) : (nS ? tS(nS - 1) : tA), hop = Math.max(0, Math.sin(Math.PI * gfK(lastT, lastT + 0.2, lt))) * 8;
    w += spBean(B.x + sd * 34, (side === 'N' ? y - 14 : y + 14) - hop, 0.6, SP_TUNIC[j % 6], 0); }); }
  // 완성 → 양쪽으로 건너는 사람들
  if (done) { w += gfStarBurst(lt, tT, B.x, (B.yN + B.yS) / 2, { r1: 230, n: 12 }) + gfRing(lt, tT, B.x, (B.yN + B.yS) / 2, 30, 200, '#FFE38A', 12, 0.5);
    for (let i = 0; i < 16; i++) { const lane = i % 2, ph = ((lt - tT) * 0.42 + i / 16) % 1, a0 = gfK(tT + 0.1, tT + 0.5, lt), y = lane ? lerp(B.yS + 30, B.yN - 30, ph) : lerp(B.yN - 30, B.yS + 30, ph);
      const op = a0 * Math.min(1, Math.min(ph, 1 - ph) * 8); if (op < 0.03) continue; w += `<g opacity="${f1(op * 100) / 100}">${spBean(B.x + (lane ? 36 : -36), y + Math.sin(t * 9 + i) * 2, 0.7, SP_TUNIC[i % 6], 0)}</g>`; }
    if (lt < tT + 1.0) w += gfBounceText(lt, tT + 0.05, B.x, B.yN - 70, [['완성!', GFC.sun]], { size: 70 }); }
  if (cheer) hud += gfChipAt(lt, tT, 960, 360, '수백만 명이 한 팀처럼', { size: 44, icon: 'family', bg: '#FFF3C4' }) + gfConfetti(lt, tT, { n: 30, d: 1.8 });
  const c0 = qLerpCam(gfK(0.5, 1.8, lt), [960, 560, 1.0], [960, 620, 1.04]);
  return { w, hud, cam: done ? qLerpCam(gfK(tT + 0.2, tT + 1.3, lt), c0, [960, 760, 1.55]) : c0 };
}
