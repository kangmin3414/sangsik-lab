/* 죽음의 수용소에서 편 — 2막 이후(첫 번째 변화 ~ 엔딩). fkgf.js 다음에 읽는다. 새 이름은 모두 fk 접두사.
   표시: 마음 하트 게이지 + 불씨 + "작은 비밀 n/5" 퀘스트 칸. 비밀을 얻을 때마다 아이템 카드가 떴다가 오른쪽 위 칸으로 들어간다.
   Grok(xAI) 배경 판 6장: citymap·hospital·lecture·dawnhill·meadow·starry (ai/, 사람 없는 판 위에 엔진 인물을 그린다).
   실존 인물: 프랭클(1997년 사망)만 동글동글한 인물로. 애덤 그랜트·마틴 셀리그먼은 그리지 않는다. 기기 화면·손가락 누름 없음. */
Object.assign(QBG, { citymap: 'ai/citymap.jpg', hospital: 'ai/hospital.jpg', lecture: 'ai/lecture.jpg', dawnhill: 'ai/dawnhill.jpg', meadow: 'ai/meadow.jpg', starry: 'ai/starry.jpg' });
['fkmeet', 'fkfree', 'fkstudy', 'fkhero', 'fkcry', 'fkheartroom', 'fkmap', 'fkclean', 'fklecture', 'fkhill', 'fkbird', 'fkwarm', 'fkbread', 'fkbench', 'fkstars', 'fkquote', 'fkask', 'fkbye'].forEach(k => CAMS[k] = 'fixed');
GFR.over = t => gfTransition(t, { o2: 'bands', o3: ['iris', 960, 540], o5: ['iris', 960, 540], k0: ['iris', 1010, 470, 960, 540], f1: ['iris', 960, 540], f3: 'bands', f4: ['iris', 1300, 520, 960, 540],
  a1: 'bands', a5: ['iris', 960, 540], a6: 'bands', a7: ['iris', 960, 540], b1: 'bands', b2: ['iris', 960, 540], b4: 'bands', c1: ['iris', 1060, 560, 960, 540], c3: 'bands', c4: ['iris', 960, 540], c5: 'bands',
  d1: ['iris', 960, 540], d4: 'bands', d5: 'bands', e1: ['iris', 960, 540], e3: ['iris', 960, 540], z1: ['iris', 960, 540], z3: 'bands', z4: 'bands', z6: 'bands' });
const FKH = o => HALO(char(Object.assign({ goggles: 'none', vest: '#9FDCC8', patch: false, tee: true, vshade: 'rgba(40,120,100,0.14)' }, HAIR.pony(GH.chestnut), o)));   // 동료 하나
const FK_SECRETS = ['마음속 일시정지', '시선 넓히기', '1년 뒤의 나', '작은 몰입', '온기 나누기'];
const FK_PAUSE = (k = 1) => `<g transform="scale(${f1(k * 1000) / 1000})"><circle r="120" fill="url(#gfGlow)" opacity=".7"/><rect x="-74" y="-74" width="148" height="148" rx="40" fill="#7C6CF0" stroke="${INK}" stroke-width="9"/><rect x="-36" y="-42" width="24" height="84" rx="8" fill="#fff"/><rect x="12" y="-42" width="24" height="84" rx="8" fill="#fff"/><rect x="-58" y="-64" width="56" height="14" rx="7" fill="#fff" opacity=".3"/></g>`;
/* 퀘스트 칸(오른쪽 위): n개 채움, tg에 n번째가 막 들어옴 */
function fkHud(t, n, tg) {
  const W2 = 430, H2 = 92; let s = gfPanel(W2, H2, { r: 46 }) + gfT(-W2 / 2 + 72, 14, '비밀', 34, GFC.navy);
  for (let i = 0; i < 5; i++) { const x = -W2 / 2 + 156 + i * 58, lit = i < n, fresh = tg != null && i === n - 1 && t > tg, k = fresh ? gfIn(t, tg, 3.4, 0.42) : 1;
    s += `<circle cx="${x}" cy="2" r="22" fill="${lit ? '#FFF3C4' : '#E9E2D0'}" stroke="${INK}" stroke-width="5"/>`;
    if (lit && (tg == null || i < n - 1 || t > tg)) s += fkEmber(x, 6, 0.34 * k, t, { glow: 0.55, seed: i });
    if (fresh) s += gfRing(t, tg, x, 2, 10, 80, GFC.sun, 7, 0.45); }
  return fkAt(1700, 92, s, tg != null && t > tg ? gfBeat(t, tg, 0.14, 4, 8) : 1);
}
/* 비밀 획득 카드: t0에 뜨고 1.4초 뒤 오른쪽 위 칸으로 날아간다(t0 + 1.75에 도착) */
function fkGain(t, t0, n, svg) {
  if (t < t0) return ''; const u = gfK(t0 + 1.4, t0 + 1.75, t), p = easeIn(u); if (u >= 1) return '';
  return gfConfetti(t, t0, { n: 26, d: 1.5 }) + fkAt(lerp(960, 1700, p), lerp(520, 92, p), gfItem(t, t0, { name: FK_SECRETS[n - 1], sub: `작은 비밀 ${n}/5`, svg, w: 600 }), lerp(1, 0.12, p));
}
const fkHudAt = (t, n, t0) => t0 == null ? fkHud(t, n) : t < t0 + 1.75 ? fkHud(t, n - 1) : fkHud(t, n, t0 + 1.75);
/* 뾰족한 말풍선 */
function fkSpike(x, y, s, t, o = {}) {
  let d = ''; for (let i = 0; i < 28; i++) { const a = i * Math.PI / 14, r = i % 2 ? 44 : 62; d += (i ? 'L' : 'M') + f1(Math.cos(a) * r * 1.3) + ' ' + f1(Math.sin(a) * r); }
  const inner = o.face ? `<ellipse cx="-17" cy="-2" rx="6" ry="7.5" fill="${INK}"/><ellipse cx="17" cy="-2" rx="6" ry="7.5" fill="${INK}"/><path d="M-30 -20 L-9 -11 M30 -20 L9 -11" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-12 22 Q0 12 12 22" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
    : gfT(0, 13, '#@!', 36, '#E5484D');
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${f1(s * 1000) / 1000})"><path d="${d}Z" fill="${o.col || '#FFE1E1'}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>${inner}</g>`;
}
const fkShield = (x, y, r, k, t) => k < 0.02 ? '' : `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * 1000) / 1000})"><ellipse rx="${r}" ry="${f1(r * 1.15)}" fill="#BFE9FF" fill-opacity=".2" stroke="#7CC8FF" stroke-width="7" stroke-dasharray="${f1(40 + 6 * Math.sin(t * 3))} 10"/><path d="M${f1(-r * 0.62)} ${f1(-r * 0.72)} A${r} ${f1(r * 1.15)} 0 0 1 ${f1(r * 0.1)} ${f1(-r * 1.12)}" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" opacity=".75"/></g>`;
const fkBread = (k = 1) => `<g transform="scale(${f1(k * 1000) / 1000})"><path d="M-34 10 Q-38 -20 -10 -24 Q0 -32 14 -24 Q40 -20 34 10 Q30 22 0 22 Q-30 22 -34 10 Z" fill="#E9C48C" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-16 -8 q6 -6 12 0 M4 -10 q6 -6 12 0" fill="none" stroke="#B88A50" stroke-width="4" stroke-linecap="round"/></g>`;
const fkBalloon = (text, o = {}) => { const fs = o.size || 38, w = gfTextW(text, fs) + fs * 1.4, h = fs + 40;
  return `<rect x="${f1(-w / 2)}" y="${-h / 2}" width="${f1(w)}" height="${h}" rx="${h / 2}" fill="${o.bg || '#fff'}" stroke="${INK}" stroke-width="6"/><path d="M${o.tail || -20} ${h / 2 - 3} l${o.tail > 0 ? 18 : -18} 26 l${o.tail > 0 ? 10 : 22} -26 Z" fill="${o.bg || '#fff'}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="${f1(-w / 2 + 6)}" y="${h / 2 - 9}" width="${f1(w - 12)}" height="8" fill="${o.bg || '#fff'}"/>` + gfT(0, fs * 0.36, text, fs, o.col || GFC.navy); };

/* ===== 회의실 (a1~a4, a7) ===== */
function fkMeetRoom(t, cam) {
  let h = gfRoom({ wall: '#E6EEFF', wall2: '#D3DEFA', floor: '#C9D3E8', fy: FK.FY, base: '#F4F8FF', dots: true });
  h += gfWindow(1400, 180, 400, 290, t, { sky: 'gfDay' }) + gfPlant(1850, FK.FY, 0.85, t) + gfClock(1000, 230, 50, 10, 0);
  h += `<g transform="translate(130 190)"><rect x="196" y="290" width="40" height="${FK.FY - 480}" fill="#B9C3DA" stroke="${INK}" stroke-width="6"/><rect width="440" height="290" rx="18" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M50 230 L140 160 L220 190 L310 100 L390 130" fill="none" stroke="${GFC.sky}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>${[0, 1, 2].map(i => `<rect x="${50 + i * 120}" y="40" width="84" height="14" rx="7" fill="#D3DEFA"/>`).join('')}</g>`;
  return gfLayer(cam, 0.85, h);
}
const fkMeetTable = `<rect x="720" y="${FK.FY - 196}" width="480" height="32" rx="12" fill="${GFC.wood}" stroke="${INK}" stroke-width="7"/><rect x="750" y="${FK.FY - 164}" width="26" height="164" rx="8" fill="${GFC.wood2}" stroke="${INK}" stroke-width="6"/><rect x="1144" y="${FK.FY - 164}" width="26" height="164" rx="8" fill="${GFC.wood2}" stroke="${INK}" stroke-width="6"/>` +
  `<rect x="836" y="${FK.FY - 244}" width="48" height="50" rx="9" fill="#9ED8FF" stroke="${INK}" stroke-width="5"/><rect x="1010" y="${FK.FY - 212}" width="120" height="16" rx="4" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
const FKM = { bx: 520, zx: 1380, s: 0.9 };
const fkMouth = () => [FKM.bx + 120, FK.FY - 318], fkFace = () => [FKM.zx - 120, FK.FY - 330];
const fkSpikeAt = p => { const [x0, y0] = fkMouth(), [x1, y1] = fkFace(); return [lerp(x0, x1, p), lerp(y0, y1, p) - Math.sin(Math.PI * p) * 70, -20 + 40 * p]; };
fkmeetScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 5, { bx, zx, s } = FKM, [hx, hy] = fkTop(zx, FK.FY, s), gx = zx + 260, gy = hy + 60;
  const cam = ph === 2 || ph === 3 ? qLerpCam(lt / D, [1080, 540, 1.14], [1160, 530, 1.24]) : qLerpCam(lt / D, [960, 540, 1.06], [960, 540, 1.12]);
  let back = '', spikes = '', zero = '', hud = '', ex = 'z기본', m = {}, hearts = '', bossEx = 'z버럭';
  const shot = (t0, d = 0.45) => { const p = gfK(t0, t0 + d, lt); if (lt < t0 || p >= 1) return ''; const [x, y, r] = fkSpikeAt(easeIn(p)); return fkSpike(x, y, 0.8 * gfIn(lt, t0, 3.4, 0.42), t, { rot: r }); };
  const hitFx = th => gfPuff(lt, th, fkFace()[0] + 20, fkFace()[1], 1, '#FFD1D1') + gfStarBurst(lt, th, fkFace()[0] + 30, fkFace()[1], { r1: 110, n: 6, cols: [GFC.coral, '#fff'] });
  if (ph === 0) {
    const tM = fkW(a, '회의', 0.25), tU = fkW(a, '억울', 2.0), th = tU + 0.2;
    spikes += shot(th - 0.45) + hitFx(th); if (lt > th && lt < th + 0.6) m = gfJelly(lt, th, 0.14, 5, 8); ex = lt > th ? 'z울먹' : 'z기본';
    hearts = fkHearts(lt, lt > th ? 2 : 3, { from: 3, tp: lt > th ? th : null });
    hud = gfChipAt(lt, tM, 330, 130, '회의 시간', { size: 42, icon: 'clock', bg: '#fff', rot: -3 });
    if (lt > th - 0.5) back += gfEmote(lt, th - 0.5, bx + 110, FK.FY - 545 * s + 20, 'vein', { hold: 1.2 });
  } else if (ph === 1) {
    const tS = fkW(a, '뾰족', 1.4), tG = fkW(a, '그대로', 3.6), H = [tS + 0.45, tS + 0.95, tS + 1.45];
    for (let i = 0; i < 7; i++) { const th = tS + 0.45 + i * 0.5; spikes += shot(th - 0.45) + hitFx(th); if (lt > th && lt < th + 0.4) m = gfJelly(lt, th, 0.12, 5, 9); }
    const v = H.filter(h => lt > h).length, last = H.filter(h => lt > h).pop();
    hearts = fkHearts(lt, 3 - v, { from: 4 - v, tp: last == null ? null : last });
    ex = lt > tG ? 'z엉엉' : v > 0 ? 'z울먹' : 'z기본';
    if (lt > tG) { zero += gfEmote(lt, tG, hx + 110, hy + 40, 'gloom', { hold: 9, s: 0.9 }); m = gfM(m, { sy: 0.95 }); }
    hud = gfChipAt(lt, 0.15, 330, 130, '예전의 제로', { size: 42, icon: 'clock', bg: '#F2E2C4', rot: -3 });
    back += gfEmote(lt, tS - 0.3, bx + 110, FK.FY - 545 * s + 20, 'vein', { hold: 9 });
  } else if (ph === 2) {
    const tH = fkW(a, '하지만', 0.2) + 0.1, tP = fkW(a, '일시정지', 1.6), tB = fkW(a, '버튼', 2.2), tN = fkW(a, '눌러', 2.7), fr = gfK(tP, tP + 0.25, lt);
    const p = 0.5 * easeOut(gfK(tH, tP, lt)), [x, y, r] = fkSpikeAt(p); if (lt > tH) spikes += fkSpike(x, y, 0.8 * gfIn(lt, tH, 3.4, 0.42), lt < tP ? t : tP + 0.0001, { rot: r });
    hearts = fkHearts(lt, 2); ex = lt > tP ? 'z반짝' : 'z당황';
    hud = gfChipAt(lt, 0.15, 330, 130, '오늘의 제로', { size: 42, icon: 'sun', bg: '#FFE9A8', rot: -3 });
    if (lt > tP) { const sq = lt > tN && lt < tN + 0.25 ? 1 - 0.12 * Math.sin(Math.PI * (lt - tN) / 0.25) : 1;
      zero += fkAt(zx, hy - 150, FK_PAUSE(gfIn(lt, tP, 3.2, 0.42) * sq * (lt > tB ? gfBeat(lt, tB, 0.1, 3, 6) : 1))) + gfRing(lt, tN, zx, hy - 150, 30, 170, '#B9AEFF', 9, 0.45) + gfRing(lt, tP, zx, hy - 150, 20, 220, '#fff', 12, 0.5);
      zero += gfChipAt(lt, tP + 0.15, zx, hy - 30, '일시정지', { size: 34, bg: '#EDE8FF', col: '#5B4FCF' }); }
    back += fr > 0 ? '' : gfEmote(lt, tH - 0.3, bx + 110, FK.FY - 545 * s + 20, 'vein', { hold: 9 });
    a._freeze = fr;
  } else if (ph === 3) {
    const tJ = fkW(a, '자극', 0.3), tR = fkW(a, '반응', 0.9), t3 = fkW(a, '3초', 1.6), tBr = fkW(a, '숨을', 2.4);
    const [x, y, r] = fkSpikeAt(0.5); spikes += fkSpike(x, y, 0.8, 0.0001, { rot: r });
    hearts = fkHearts(lt, 2);
    zero += fkAt(zx, hy - 150, FK_PAUSE(0.62));
    zero += gfChipAt(lt, tJ, x, y - 130, '자극', { size: 40, bg: '#FFE1E1', col: '#C2363B' }) + gfChipAt(lt, tR, zx - 70, hy - 20, '반응', { size: 40, bg: '#DFF5EA', col: '#1F8A5B' });
    if (lt > t3) { const u = gfK(t3, t3 + 2.4, lt), n = 3 - Math.min(2, Math.floor(u * 3)), cx = (x + zx - 70) / 2 + 30, cy = y - 10;
      zero += fkAt(cx, cy, `<circle r="62" fill="#fff" stroke="${INK}" stroke-width="7"/><circle r="46" fill="none" stroke="#E9E2D0" stroke-width="14"/><circle r="46" fill="none" stroke="#7C6CF0" stroke-width="14" stroke-dasharray="${f1(289 * u)} 400" transform="rotate(-90)" stroke-linecap="round"/>` + (u >= 1 ? `<path d="M-22 2 L-6 18 L24 -16" fill="none" stroke="#5B4FCF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>` : gfT(0, 18, String(n), 52, '#5B4FCF')), gfIn(lt, t3, 3.2, 0.42)); }
    const inh = gfK(tBr, tBr + 0.7, lt), exh = gfK(tBr + 0.8, tBr + 1.5, lt);
    m = { sy: 1 + 0.045 * Math.sin(Math.PI * inh) * (1 - exh) - 0.02 * Math.sin(Math.PI * exh) }; ex = lt > tBr && lt < tBr + 0.8 ? 'z졸음' : 'z기본';
    if (lt > tBr + 0.8) zero += `<g opacity="${f1(Math.sin(Math.PI * exh) * 0.8 * 100) / 100}"><ellipse cx="${f1(zx - 120 - exh * 60)}" cy="${f1(FK.FY - 300)}" rx="${f1(18 + exh * 26)}" ry="${f1(12 + exh * 14)}" fill="#fff" stroke="${INK}" stroke-width="3"/></g>`;
    zero += fkShield(zx, FK.FY - 260, 250, gfIn(lt, tBr + 0.5, 3, 0.45), t);
    a._freeze = 1;
  } else {
    const tB = fkW(a, '기분', 0.8), tM2 = fkW(a, '망치지', 2.4), tDoor = fkW(a, '문을', 4.4), tC = fkW(a, '닫아', 4.9), ur = gfK(0.15, 0.45, lt);
    zero += fkShield(zx, FK.FY - 260, 250, 1, t);
    if (ur < 1) zero += fkAt(zx, hy - 150, FK_PAUSE(0.62 * (1 - ur))) + gfPuff(lt, 0.3, zx, hy - 150, 1.3, '#EDE8FF');
    const bounce = (t0, d0, p0) => { const hitT = t0 + d0; if (lt < t0) return ''; if (lt < hitT) { const [x, y, r] = fkSpikeAt(lerp(p0, 0.8, easeIn(gfK(t0, hitT, lt)))); return fkSpike(x, y, 0.8, t, { rot: r }); }
      const u = gfK(hitT, hitT + 0.7, lt); if (u >= 1) return ''; const [x1, y1] = fkSpikeAt(0.8); return fkSpike(x1 - 260 * easeOut(u), y1 - 160 * Math.sin(Math.PI * u * 0.8), 0.8 * (1 - 0.6 * u), t, { rot: -200 * u }) + gfRing(lt, hitT, x1 + 40, y1, 20, 120, '#7CC8FF', 9, 0.35); };
    spikes += bounce(0.15, 0.4, 0.5) + bounce(tM2 - 0.35, 0.35, 0);
    const dk = gfIn(lt, tDoor, 3, 0.45), sw = easeOut(gfK(tC, tC + 0.45, lt));
    if (dk > 0.02) back += `<g transform="translate(960 ${FK.FY}) scale(${f1(dk * 1000) / 1000}) translate(-960 ${-FK.FY})">` + `<g transform="translate(960 ${FK.FY}) scale(0.72)"><rect x="-176" y="-616" width="352" height="616" rx="22" fill="#FFF3D6" stroke="${INK}" stroke-width="8"/><g transform="translate(-150 0) scale(${f1(0.12 + 0.88 * sw)} 1) translate(150 0)">${gfDoor(0, 0, 1)}</g></g></g>`;
    if (lt > tC + 0.5) { const t0 = tC + 0.55, u = gfK(t0, t0 + 0.4, lt); if (u < 1) { const [x, y, r] = fkSpikeAt(lerp(0, 0.4, easeIn(u))); spikes += fkSpike(x, y, 0.8, t, { rot: r }); } spikes += gfPuff(lt, t0 + 0.4, 860, FK.FY - 330, 1.2, '#FFD1D1'); }
    hearts = fkHearts(lt, 2); ex = lt > tC ? 'z빵긋' : 'z기본';
    hud = fkGain(lt, D - 0.15, 1, `<g transform="translate(0 -10)">${FK_PAUSE(0.62)}</g>`) + fkHudAt(lt, 1, D - 0.15);
  }
  const fr = a._freeze || 0; a._freeze = 0;
  let w = fkMeetTable + gfActor(ODB, { x: bx, y: FK.FY, s, t: fr > 0.5 ? 0.0001 : t, pose: '주먹', ex: fEx(bossEx), look: [0.7, 0], seed: 7 }, fr > 0.5 ? {} : { sy: 1 + 0.02 * Math.sin(t * 9) }) + back + spikes;
  let h = fkDefs() + fkMeetRoom(fr > 0.5 ? 0.0001 : t, cam) + qCam(cam, w);
  if (ph === 1) h += fkTint('#B8925A', 0.22);
  if (fr > 0) h += fkTint('#3B4A84', 0.22 * fr) + `<g opacity="${f1(fr * 100) / 100}">${[0, 1, 2, 3].map(i => `<rect x="${-130 + i * 8}" y="${-14 + i * 8}" width="${2180 - i * 16}" height="${1260 - i * 16}" fill="none" stroke="#B9AEFF" stroke-width="3" opacity="${0.5 - i * 0.1}"/>`).join('')}</g>`;
  zero = gfActor(FKZW, { x: zx, y: FK.FY, s, t, pose: '서기', ex: fEx(ex), look: [-0.7, 0], seed: 3 }, m) + fkAt(gx, gy, hearts, 0.78) + zero;
  return h + qCam(cam, zero) + hud;
};

/* ===== a5: 마지막 자유 ===== */
fkfreeScene = function (t, lt, a) {
  const D = a._dur || 9, tA = fkW(a, '뺏어', 2.4), tT = fkW(a, '태도', 4.4), tL = fkW(a, '마지막', 6.0), tG = fkW(a, '건드리지', 7.6), fx = 640, s = 0.92;
  const cam = qLerpCam(lt / D, [900, 570, 1.12], [960, 570, 1.18]);
  let w = gfActor(FKF, { x: fx, y: FK.FY, s, t, pose: '서기', ex: fEx(lt > tL ? 'z기본' : 'z울먹'), look: lt > tL ? [0.5, -0.2] : [0.2, 0.4], seed: 41 }, { sy: 1 - 0.015 * Math.sin(t * 1.5) });
  const [cx, cy] = fkChest(fx, FK.FY, s);
  [FK_TAG, FK_FAM, FK_PAGES].forEach((sv, i) => { const t0 = tA + i * 0.15, u = gfK(t0, t0 + 0.9, lt); if (lt > t0 && u < 1) w += fkAt(cx + (i - 1) * 60 + 90 * u * (i - 1), cy - 40 - 260 * easeOut(u), sv, 0.6 * (1 - u)); w += gfPuff(lt, t0, cx + (i - 1) * 50, cy - 30, 0.7, '#D9DCE2'); });
  w += fkEmber(cx, cy, 0.4 * (lt > tT ? gfBeat(lt, tT, 0.4, 3, 4) : 1), t, { glow: lt > tT ? 1 : 0.8 }) + gfRing(lt, tT, cx, cy, 10, 120, '#FFE38A', 8, 0.5);
  let h = fkDefs() + fkWinter(t, cam, { dark: 0.2, snow: 44, wind: lt > tG ? 0.9 : 0.3 }) + qCam(cam, w);
  if (lt > tL) { const sh = lt > tG && lt < tG + 0.8 ? gfShake(lt, tG, 10, 0.6) : [0, 0];
    h += fkAt(1350 + sh[0], 520 + sh[1], gfItem(lt, tL, { name: '마지막 자유', sub: '뜻을 옮김', w: 560, svg: `<g transform="translate(0 20)">${fkEmber(0, 0, 1.1, t, { face: true })}</g>` }), 1);
    if (lt > tG) { for (let i = 0; i < 6; i++) { const u = ((lt - tG) * 1.6 + i * 0.17) % 1; h += `<path d="M${f1(1900 - u * 500)} ${380 + i * 60} q-60 -14 -120 0" fill="none" stroke="#C9CDD6" stroke-width="10" stroke-linecap="round" opacity="${f1(Math.sin(Math.PI * u) * 0.8 * 100) / 100}"/>`; }
      h += gfRing(lt, tG + 0.2, 1350, 470, 60, 300, '#FFE38A', 10, 0.5); } }
  return h;
};

/* ===== a6: 273명 연구 ===== */
fkstudyScene = function (t, lt, a) {
  const D = a._dur || 10, t273 = fkW(a, '273', 0.9), tM = fkW(a, '의미감', 3.4), tH = fkW(a, '힘든', 4.6), tR = fkW(a, '곱씹', 6.6), tS = fkW(a, '짧았', 8.4);
  let h = fkDefs() + gfFull('#EEF1FA') + gfFull('url(#gfDots)') + `<rect x="-200" y="800" width="2400" height="600" fill="#DDE3F3" stroke="${INK}" stroke-width="7"/>`;
  h += gfChipAt(lt, t273, 960, 120, '심리학 연구 · 273명', { size: 46, icon: 'flask', bg: '#fff', rot: -2 });
  const P2 = [[600, '#C3B3F0', 0], [1320, '#8FE3C8', 1]], s = 0.92;
  P2.forEach(([x, col, side]) => {
    const top = fkTop(x, 800, s), hit = lt > tH, done = side === 1 && lt > tS;
    let m = hit && lt < tH + 0.5 ? gfJelly(lt, tH, 0.12, 5, 8) : {};
    h += gfActor(o => FKV(col, o), { x, y: 800, s, t, pose: '서기', ex: fEx(done ? 'z빵긋' : hit ? 'z울먹' : 'z기본'), look: [side ? -0.3 : 0.3, 0.2], seed: 60 + side * 5 }, m);
    if (side === 1) { const [cx, cy] = fkChest(x, 800, s); h += fkEmber(cx, cy, 0.42, t, { k: gfIn(lt, tM, 3, 0.45) }) + gfRing(lt, tM, cx, cy, 10, 100, '#FFE38A', 7, 0.45) + gfChipAt(lt, tM, x + 250, 360, '삶의 의미감', { size: 34, bg: '#FFF3C4', rot: 3 }); }
    const ck = done ? 1 - gfK(tS, tS + 0.3, lt) : gfIn(lt, tH - 0.2, 3, 0.45); h += fkCloud(top[0], top[1] - 70, 0.55, t, { k: ck, seed: side * 2 + 5, fall: 110 }) + (done ? gfPuff(lt, tS, top[0], top[1] - 70, 1.2, '#C7CEDB') : '');
    if (lt > tR && !(side === 1 && lt > tS + 0.4)) { const sp = side ? 1 : 1; const ang = (lt - tR) * 260 * sp, k = gfIn(lt, tR, 3, 0.45) * (side === 1 && lt > tS ? 1 - gfK(tS, tS + 0.4, lt) : 1);
      h += fkAt(top[0] - (side ? -190 : 190), top[1] + 60, `<g transform="scale(1.35)"><circle r="58" fill="none" stroke="${GFC.grape}" stroke-width="9" stroke-dasharray="80 30" transform="rotate(${f1(ang)})"/><path d="M58 0 l-14 -16 M58 0 l14 -14" stroke="${GFC.grape}" stroke-width="9" stroke-linecap="round" transform="rotate(${f1(ang)})"/><g transform="rotate(${f1(-ang * 0.3)}) translate(0 -2) scale(.28)">${fkCloud(0, 0, 1, t, { rain: 0 })}</g></g>`, k); }
    if (lt > tR) { const bv = side ? lerp(0.15, 0.32, gfK(tR, tR + 1, lt)) * (lt > tS ? 1 : 1) : lerp(0.15, 0.88, gfK(tR, tR + 2.2, lt));
      h += fkAt(x - 150, 870, gfBar(400, side && lt > tS ? 0.32 : bv, { h: 40, col: side ? '#7FE07A' : '#A08CFF' }), gfIn(lt, tR, 3, 0.45)) + gfChipAt(lt, tR + 0.1, x - 250, 870, '곱씹기', { size: 30, bg: '#fff' }); }
  });
  return h;
};

/* ===== b1: 초인? ===== */
fkheroScene = function (t, lt, a) {
  const tH = fkW(a, '초인', 1.0), tN = fkW(a, '않아요', 2.6), zx = 960, s = 0.95, hero = lt > tH && lt < tN + 0.05;
  let h = fkDefs() + gfFull('#FFF4D6') + gfFull('url(#gfDots)') + gfRays(t, 960, 470, 1400, '#fff', 14, hero ? 0.4 : 0.15, 5) + `<rect x="-200" y="${FK.FY}" width="2400" height="600" fill="#FFE2A8" stroke="${INK}" stroke-width="7"/>`;
  const ck = hero ? gfIn(lt, tH, 3, 0.45) : 0, top = fkTop(zx, FK.FY, s);
  if (ck > 0.02) { const fl = Math.sin(t * 7) * 18; h += `<path d="M${zx - 70} ${FK.FY - 340} Q${zx - 200 - fl} ${FK.FY - 120} ${zx - 230 - fl} ${FK.FY - 40} L${zx + 230 + fl} ${FK.FY - 40} Q${zx + 200 + fl} ${FK.FY - 120} ${zx + 70} ${FK.FY - 340} Z" fill="#E5484D" stroke="${INK}" stroke-width="8" stroke-linejoin="round" transform="translate(${zx} ${FK.FY - 340}) scale(${f1(ck * 1000) / 1000}) translate(${-zx} ${-(FK.FY - 340)})"/>`; }
  h += gfActor(FKZW, { x: zx, y: FK.FY, s, t, pose: hero ? '만세' : '서기', ex: fEx(hero ? 'z뿌듯' : lt > tN ? 'z민망' : 'z기본'), look: [0, -0.1], seed: 3 }, hero ? gfHop(lt, tH, 40, 0.38) : lt > tN ? gfJelly(lt, tN, 0.12, 5, 8) : {});
  if (hero) h += gfEmote(lt, tH + 0.1, top[0] + 150, top[1] + 30, 'spark', { hold: 9 });
  h += gfPuff(lt, tN, zx, FK.FY - 200, 2, '#FFD6D6');
  if (lt > tN) h += gfEmote(lt, tN + 0.1, top[0] + 120, top[1] + 50, 'sweat', { hold: 9 });
  h += gfChipAt(lt, tH, 960, 150, '초인 모드?', { size: 48, icon: 'star', bg: '#fff', rot: -3 }) + (lt > tN - 0.1 ? fkAt(1150, 150, gfStamp(lt, tN, '아님', { size: 56, rot: -12 })) : '');
  h += fkAt(zx + 300, top[1] + 60, fkHearts(lt, 2), 0.78) + fkHud(lt, 1);
  return h;
};

/* ===== b2·b3: 불 꺼진 방 ===== */
fkcryScene = function (t, lt, a) {
  const ph = a.ph, zx = 1080, s = 0.86, y = FK.FY + 30;
  const cam = ph === 0 ? qLerpCam(lt / (a._dur || 6), [1000, 560, 1.12], [1060, 580, 1.26]) : [1060, 570, 1.3];
  const tC = ph === 0 ? fkW(a, '훌쩍', 4.2) : 99, tI = ph === 1 ? fkW(a, '문득', 0.7) : 99;
  let w = `<path d="M330 160 L560 160 L1000 ${FK.FY + 40} L700 ${FK.FY + 40} Z" fill="#BFD2FF" opacity=".16"/>`;
  const sob = lt > tC ? Math.sin(t * 14) * 0.012 : 0;
  w += gfActor(FKZW, { x: zx, y, s, t, pose: '웅크림', ex: fEx(ph === 1 && lt > tI ? 'z멍' : lt > tC ? 'z엉엉' : 'z울먹'), look: ph === 1 && lt > tI ? [-0.3, -0.5] : [0, 0.6], seed: 3 }, { sy: 1 + sob });
  const top = fkTop(zx, y, s), ty = top[1] + 150;
  w += fkCloud(zx + 6, top[1] - 40, 0.7, t, { seed: 6, fall: 130 });
  if (ph === 0 && lt > tC) w += gfEmote(lt, tC, zx - 130, ty + 70, 'sweat', { hold: 9, s: 0.8 });
  if (ph === 1) w += gfEmote(lt, tI, zx + 140, ty - 40, 'idea', { hold: 9 });
  w += fkAt(zx + 290, ty + 20, fkHearts(lt, 1, { low: true }), 0.72);
  let h = fkDefs() + odRoom(t, cam, { night: 1, noClock: true, noTable: true }) + fkTint('#0B1230', 0.42) + qCam(cam, w);
  return h + fkHud(lt, 1);
};

/* ===== b4: 내 마음의 방 ===== */
function fkHeartHouse(t, lt, tB) {
  const W2 = 760; let s = `<path d="M0 300 C-260 120 -380 -40 -300 -170 C-230 -280 -80 -270 0 -150 C80 -270 230 -280 300 -170 C380 -40 260 120 0 300 Z" fill="#FFE3EA" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>`;
  s += `<path d="M-230 150 L230 150" stroke="${INK}" stroke-width="7"/><rect x="-200" y="40" width="200" height="90" rx="26" fill="#C3B3F0" stroke="${INK}" stroke-width="7"/><rect x="-210" y="20" width="40" height="110" rx="16" fill="#B3A0EA" stroke="${INK}" stroke-width="6"/><rect x="-10" y="20" width="40" height="110" rx="16" fill="#B3A0EA" stroke="${INK}" stroke-width="6"/>`;
  s += `<rect x="70" y="80" width="130" height="16" rx="6" fill="${GFC.wood}" stroke="${INK}" stroke-width="5"/><rect x="125" y="96" width="20" height="54" fill="${GFC.wood2}" stroke="${INK}" stroke-width="5"/><circle cx="110" cy="70" r="14" fill="#FFB12E" stroke="${INK}" stroke-width="4"/>` +
    `<rect x="-36" y="-150" width="72" height="56" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/><line x1="0" y1="-215" x2="0" y2="-150" stroke="${INK}" stroke-width="4"/>`;
  [[-110, 40, -8], [140, 30, 14], [0, -70, 0], [-40, 140, 6]].forEach(([x, y, r], i) => { const k = gfIn(lt, tB + i * 0.22, 3.4, 0.42); if (k > 0.02) s += fkSpike(x, y + Math.sin(t * 2 + i) * 6, 0.62 * k, t, { face: true, rot: r + Math.sin(t * 1.5 + i) * 6, col: '#FFD6D6' }); });
  return s;
}
fkheartroomScene = function (t, lt, a) {
  const tB = fkW(a, '나쁜', 0.8), tR = fkW(a, '방까지', 1.9), tN = fkW(a, '있구나', 3.4), D = a._dur || 4.5;
  const cam = qLerpCam(gfK(tR - 0.3, tR + 1.2, lt), [960, 560, 1.0], [1000, 560, 1.12]);
  let w = fkAt(1120, 520, fkHeartHouse(t, lt, tB), 1.3 * gfIn(lt, 0.1, 3, 0.45));
  w += gfActor(FKZW, { x: 560, y: 860, s: 0.6, t, pose: '서기', ex: fEx(lt > tN ? 'z충격' : 'z멍'), look: [0.8, -0.2], seed: 3 }, lt > tN ? gfJelly(lt, tN, 0.14, 5, 8) : {});
  if (lt > tN) w += gfEmote(lt, tN, 640, 470, 'bang', { hold: 9 });
  let h = fkDefs() + gfFull('#2E2650') + gfFull('url(#gfDots)') + [0, 1, 2, 3, 4, 5, 6, 7].map(i => gfTwinkle(t, 120 + i * 240, 120 + (i % 3) * 70, 10, i, '#FFF6C8')).join('') + qCam(cam, w);
  h += gfChipAt(lt, tR, 960, 120, '내 마음의 방', { size: 46, icon: 'heart', bg: '#FFE3EA', rot: -2 });
  return h;
};

/* ===== c1·c2: 시선 넓히기 (Grok 지도 판) ===== */
const FK_MAP = { home: [387, 600], office: [725, 420], house: [1282, 566] };
fkmapScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 4;
  const cam = ph === 0 ? qLerpCam(gfK(0.1, D, lt), [FK_MAP.home[0], FK_MAP.home[1] - 60, 2.3], [960, 590, 1.0]) : qLerpCam(lt / (a._dur || 9), [960, 590, 1.0], [980, 580, 1.06]);
  let w = '';
  const [mx, my] = FK_MAP.home;
  w += `<circle cx="${mx}" cy="${my - 20}" r="${f1(70 + 10 * Math.sin(t * 3))}" fill="none" stroke="#FFE38A" stroke-width="8" opacity=".8"/>` + fkAt(mx, my - 120, `<path d="M0 64 L-30 18 A44 44 0 1 1 30 18 Z" fill="#fff" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><g transform="translate(0 -12) scale(1.1)">${GF_ICON.heart()}</g>`, 1) + gfChipAt(lt, ph === 0 ? 0.6 : 0, mx, my - 230, '제로의 자리', { size: 30, bg: '#fff' });
  if (ph === 1) {
    const tA = fkW(a, '내가', 2.0), tN = fkW(a, '아니라', 3.6), tW = fkW(a, '수고가', 4.8), tE = fkW(a, '편하게', 6.8), [ox, oy] = FK_MAP.office, [hx, hy] = FK_MAP.house;
    w += gfChipAt(lt, tA, FK_MAP.home[0] + 40, FK_MAP.home[1] - 250, '내가 아니면 누가 하겠어', { size: 34, bg: '#E4E1DA', col: '#6B7280' }) + (lt > tN ? fkAt(FK_MAP.home[0] + 40, FK_MAP.home[1] - 250, `<line x1="-210" y1="0" x2="210" y2="0" stroke="#E5484D" stroke-width="8" stroke-linecap="round"/>`, gfK(tN, tN + 0.3, lt)) : '');
    if (lt > tW) { const u = gfK(tW, tW + 1.6, lt), cxm = (ox + hx) / 2, cym = Math.min(oy, hy) - 220, bz = q => [(1 - q) ** 2 * ox + 2 * (1 - q) * q * cxm + q * q * hx, (1 - q) ** 2 * oy + 2 * (1 - q) * q * cym + q * q * hy];
      let dots = ''; for (let i = 0; i <= 24; i++) { const q = i / 24; if (q > u) break; const [x, y] = bz(q); dots += `<circle cx="${f1(x)}" cy="${f1(y)}" r="7" fill="#FFE38A" stroke="${INK}" stroke-width="3"/>`; }
      const [px, py] = bz(easeInOut(u)); w += dots + (u < 1 ? fkAt(px, py, `<rect x="-30" y="-36" width="60" height="72" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/>${[0, 1, 2].map(i => `<rect x="-18" y="${-20 + i * 16}" width="36" height="6" rx="3" fill="#A3A8B1"/>`).join('')}<circle r="60" fill="url(#gfGlow)" opacity=".5"/>`, 0.9) : ''); }
    if (lt > tE) w += `<circle cx="${hx}" cy="${hy - 30}" r="${f1(150 * gfIn(lt, tE, 3, 0.45))}" fill="url(#fkEmberGlow)" opacity=".9"/>` + gfStarBurst(lt, tE, hx, hy - 40, { r1: 170, n: 8 }) + gfTwinkle(t, hx + 70, hy - 110, 18, 1, '#FFE38A') + gfTwinkle(t, hx - 60, hy - 90, 14, 2, '#fff');
    w += gfChipAt(lt, tE + 0.2, hx + 30, hy - 230, '누군가의 하루를 조금 편하게', { size: 34, icon: 'heart', bg: '#FFF3C4' });
  }
  return fkDefs() + `<rect x="-600" y="-600" width="3120" height="2280" fill="#13204A"/>` + qPlate('citymap', cam, 1) + qCam(cam, w) + fkHud(lt, 1);
};

/* ===== c3: 병원 청소 직원 (Grok 복도 판) ===== */
fkcleanScene = function (t, lt, a) {
  const D = a._dur || 10, tC = fkW(a, '청소', 2.4), tP = fkW(a, '돕는', 5.4), tW = fkW(a, '일깨워', 6.6), tS = fkW(a, '만족도', 7.6), x = 880, s = 0.95;
  const cam = qLerpCam(lt / D, [960, 560, 1.0], [960, 570, 1.08]), happy = lt > tS;
  const mop = Math.sin(t * 3.2) * 50, ps = P['서기'], [hx, hy] = gfHand(x, FK.FY + 40, s, ps.hR);
  let w = `<g><line x1="${f1(hx)}" y1="${f1(hy)}" x2="${f1(x + 150 + mop)}" y2="${FK.FY + 34}" stroke="${GFC.wood2}" stroke-width="12" stroke-linecap="round"/><path d="M${f1(x + 100 + mop)} ${FK.FY + 34} q50 -14 100 0 l6 18 h-112 Z" fill="#9ED8FF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`;
  w += gfActor(o => FKV('#9CC9F0', o), { x, y: FK.FY + 40, s, t, pose: '서기', ex: fEx(happy ? 'z빵긋' : lt > tP ? 'z반짝' : 'z기본'), look: [0.4, 0.3], seed: 66 }, happy ? gfHop(lt, tS + 0.1, 26, 0.34) : {});
  const top = fkTop(x, FK.FY + 40, s);
  if (lt > tW) w += gfEmote(lt, tW, top[0] + 140, top[1] + 40, 'heart', { hold: 9 });
  let h = fkDefs() + qPlate('hospital', cam, 0.6) + qCam(cam, w);
  h += gfChipAt(lt, tC, 330, 130, '병원 청소 직원', { size: 40, icon: 'building', bg: '#fff', rot: -3 });
  h += gfChipAt(lt, tP, 960, 230, '환자들이 낫도록 돕는 사람', { size: 42, icon: 'heart', bg: '#FFF3C4', rot: 2 }) + gfRing(lt, tW, 960, 230, 40, 400, GFC.sun, 10, 0.5);
  if (lt > tS - 0.1) h += fkAt(1460, 470, gfPanel(460, 150, { head: '일의 만족도', headBg: GFC.mint }) + `<g transform="translate(-190 20)">${gfBar(380, lerp(0.35, 0.9, easeOut(gfK(tS, tS + 1.2, lt))), { h: 40 })}</g>`, gfIn(lt, tS - 0.1, 3, 0.45));
  h += fkGain(lt, D - 0.15, 2, `<g transform="translate(0 -6) scale(1.5)">${GF_ICON.pin()}</g>`) + fkHudAt(lt, 2, D - 0.15);
  return h;
};

/* ===== c4: 미래의 강단 (흑백 동화책 + Grok 강의실 판) ===== */
fklectureScene = function (t, lt, a) {
  const D = a._dur || 6, tF = fkW(a, '미래의', 3.0), tI = fkW(a, '상상', 4.0), fx = 520, s = 0.9;
  const cam = [900, 570, 1.1];
  let w = gfActor(FKF, { x: fx + (lt < tF ? Math.sin(t * 40) * 1.5 : 0), y: FK.FY, s, t, pose: '서기', ex: fEx(lt > tI ? 'z기본' : 'z울먹'), look: lt > tF ? [0.6, -0.4] : [0.1, 0.4], seed: 41 }, { sy: 0.98 });
  const [cx, cy] = fkChest(fx, FK.FY, s), [hx, hy] = fkTop(fx, FK.FY, s);
  w += fkEmber(cx, cy, 0.4, t, { glow: lt > tI ? 1 : 0.8 });
  let h = fkDefs() + fkWinter(t, cam, { dark: 0.25, snow: 50, wind: 0.4 }) + qCam(cam, w);
  const k = gfIn(lt, tF - 0.2, 2.8, 0.5);
  if (k > 0.02) {
    const bx = 1270, by = 430, bw = 820, bh = 470;
    h += [[700, 300, 16], [780, 250, 24], [880, 200, 32]].map(([x, y, r], i) => gfIn(lt, tF - 0.5 + i * 0.1, 3, 0.45) > 0.02 ? `<circle cx="${x}" cy="${y}" r="${f1(r * gfIn(lt, tF - 0.5 + i * 0.1, 3, 0.45))}" fill="#fff" stroke="${INK}" stroke-width="6"/>` : '').join('');
    const clip = `<clipPath id="fkLec"><rect x="${bx - bw / 2}" y="${by - bh / 2}" width="${bw}" height="${bh}" rx="200"/></clipPath>`;
    const lec = `<image href="${QBG.lecture}" x="${bx - bw / 2 - 40}" y="${by - bh / 2 - 20}" width="${bw + 80}" height="${(bw + 80) * 0.5625}" preserveAspectRatio="xMidYMid slice"/>` +
      `<g transform="translate(${bx} ${by + 92}) scale(.3)">${FKF({ x: 0, y: 0, s: 1, t, pose: '손인사', ex: fEx('z빵긋'), look: [0, 0], seed: 41 })}</g>` +
      `<rect x="${bx - 62}" y="${by + 30}" width="124" height="120" rx="10" fill="#B07A45" stroke="${INK}" stroke-width="5"/><rect x="${bx - 74}" y="${by + 20}" width="148" height="20" rx="8" fill="#C68D52" stroke="${INK}" stroke-width="5"/>` +
      `<rect x="${bx - bw / 2}" y="${by - bh / 2}" width="${bw}" height="${bh}" fill="#FFE9B0" opacity="${f1(0.12 + 0.05 * Math.sin(t * 2) * 100) / 100}"/>`;
    h += fkAt(bx, by, `<g transform="translate(${-bx} ${-by})">${clip}<g clip-path="url(#fkLec)">${lec}</g><rect x="${bx - bw / 2}" y="${by - bh / 2}" width="${bw}" height="${bh}" rx="200" fill="none" stroke="${INK}" stroke-width="10"/></g>`, k);
    if (lt > tI) h += gfTwinkle(t, bx + 330, by - 200, 22, 1, '#FFE38A') + gfTwinkle(t, bx - 360, by - 150, 16, 2, '#fff') + gfTwinkle(t, bx + 380, by + 160, 18, 3, '#FFE38A');
    h += gfChipAt(lt, tF + 0.2, bx, by + bh / 2 + 10, '미래의 강단', { size: 38, bg: '#FFF3C4' });
  }
  return h;
};

/* ===== c5·c6: 1년 뒤의 나 (Grok 새벽 언덕 판) ===== */
const FK_HILL = { fx: 1235, fy: 664, zx: 430, zy: 1010 };
fkhillScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 5, { fx, fy, zx, zy } = FK_HILL, s = 0.92;
  const cam = ph === 0 ? qLerpCam(lt / D, [960, 600, 1.04], [1000, 590, 1.1]) : qLerpCam(lt / D, [1000, 590, 1.1], [980, 590, 1.06]);
  const t1 = ph === 0 ? fkW(a, '1년', 0.3) : -9, tE = ph === 1 ? fkW(a, '영원', 3.2) : 99, tW = ph === 1 ? fkW(a, '다시', 5.4) : 99;
  const night = ph === 0 ? 0.42 : 0.42 * (1 - easeInOut(gfK(tE, tE + 1.6, lt)));
  const walking = lt > tW, wx = walking ? zx + 160 * easeInOut(gfK(tW, tW + 2.4, lt)) : zx, wk = walking && lt < tW + 2.4 ? gfWalk(wx * 2.2, 0.6) : null;
  let w = gfActor(FKZW, { x: wx, y: zy, s, t, pose: wk ? wk.pose : '서기', ex: fEx(ph === 1 && lt > tE ? 'z빵긋' : 'z기본'), look: [0.8, -0.5], seed: 3 }, wk ? { sy: wk.sy, dy: wk.dy } : {});
  const top = fkTop(wx, zy, s);
  const fk = ph === 0 ? gfIn(lt, t1 - 0.1, 3, 0.45) : 1;
  let far = '';
  if (fk > 0.02) far += `<circle cx="${fx}" cy="${fy - 60}" r="${f1(110 * fk)}" fill="url(#gfGlow)" opacity=".9"/>` + gfActor(Z, { x: fx, y: fy, s: 0.28 * fk, t, pose: '손인사', ex: fEx('z빵긋'), look: [-0.4, 0], seed: 3 });
  let h = fkDefs() + qPlate('dawnhill', cam, 0.5) + gfLayer(cam, 0.5, far) + fkTint('#141B48', night) + qCam(cam, w);
  if (night > 0.02) h += `<g opacity="${f1(night / 0.42 * 100) / 100}">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => gfTwinkle(t, 120 + i * 220, 70 + (i % 4) * 60, 9, i, '#FFF6C8')).join('')}</g>`;
  if (ph === 0) h += gfChipAt(lt, t1, 1240, 330, '1년 뒤의 나', { size: 40, icon: 'sun', bg: '#FFF3C4', rot: -3 });
  else h += gfChipAt(lt, 0.1, 1240, 330, '1년 뒤의 나', { size: 40, icon: 'sun', bg: '#FFF3C4', rot: -3 });
  const hv = ph === 1 && lt > tW ? 2 : 1;
  h += qCam(cam, fkAt(wx + 300, top[1] + 60, fkHearts(lt, hv, { from: 1, tp: ph === 1 && lt > tW ? tW : null, low: hv === 1 }), 0.78));
  if (ph === 1) h += fkGain(lt, D - 0.15, 3, `<g transform="translate(0 -6) scale(1.5)">${GF_ICON.sun()}</g>`) + fkHudAt(lt, 3, D - 0.15); else h += fkHud(lt, 2);
  return h;
};

/* ===== d1·d2·d3·d5·d6: 파랑새 (Grok 들판 판) ===== */
function fkBird(x, y, s, t, o = {}) {
  const fl = Math.sin(t * (o.fast ? 22 : 12)) * (o.sit ? 0.15 : 1), dir = o.dir || 1;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * dir * 1000) / 1000} ${f1(s * 1000) / 1000})"><circle r="80" fill="url(#gfGlow)" opacity=".5"/>` +
    `<path d="M-46 6 Q-80 0 -86 22 Q-62 22 -44 18 Z" fill="#4C8BF5" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="0" cy="0" rx="46" ry="40" fill="#6FB6FF" stroke="${INK}" stroke-width="6"/><ellipse cx="6" cy="14" rx="26" ry="18" fill="#DFF1FF"/>` +
    `<path d="M-10 -6 Q-40 ${f1(-40 * fl)} -60 ${f1(-20 * fl - 4)} Q-34 4 -10 6 Z" fill="#4C8BF5" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M40 -4 L62 4 L40 12 Z" fill="${GFC.sun}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="22" cy="-10" rx="6" ry="7.5" fill="${INK}"/><circle cx="24" cy="-13" r="2.4" fill="#fff"/><ellipse cx="18" cy="6" rx="8" ry="4" fill="#FF9AB0" opacity=".7"/></g>`;
}
const FK_STUMP = `<path d="M790 ${FK.FY - 70} h140 v70 h-140 Z" fill="${GFC.wood2}" stroke="${INK}" stroke-width="7"/><ellipse cx="860" cy="${FK.FY - 70}" rx="70" ry="20" fill="${GFC.wood}" stroke="${INK}" stroke-width="7"/><ellipse cx="860" cy="${FK.FY - 70}" rx="34" ry="9" fill="none" stroke="${INK}" stroke-width="4" opacity=".4"/>`;
fkbirdScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 6, s = 0.9;
  const cam = ph <= 1 ? qLerpCam(lt / D, [960, 560, 1.04], [1060, 560, 1.08]) : qLerpCam(lt / D, [900, 580, 1.18], [900, 580, 1.24]);
  let w = '', hud = '', hv = 2, htp = null, hfrom = 2, sky = '';
  if (ph <= 1) {
    const tH = ph === 0 ? fkW(a, '행복해야', 0.9) : -9, tO = ph === 0 ? fkW(a, '남들처럼', 2.2) : -9, tJ = ph === 0 ? fkW(a, '조바심', 3.6) : -9, tE = ph === 0 ? fkW(a, '공허', 4.8) : -9;
    const tC = ph === 1 ? fkW(a, '쫓아', 1.2) : 99, tR = ph === 1 ? fkW(a, '달아', 2.2) : 99;
    const zx = ph === 0 ? lerp(380, 980, gfK(0.2, D, lt)) : lerp(980, 1160, gfK(0, tC + 0.4, lt)), wk = gfWalk(zx * 1.6, 1.0);
    const jump = ph === 1 && lt > tC - 0.1 && lt < tC + 0.6;
    w += gfActor(FKZW, { x: zx, y: FK.FY, s, t, pose: jump ? '만세' : wk.pose, ex: fEx(ph === 0 && lt > tE ? 'z울먹' : 'z당황'), look: [0.8, -0.4], seed: 3 }, jump ? gfHop(lt, tC, 70, 0.5) : { sy: wk.sy, dy: wk.dy });
    const top = fkTop(zx, FK.FY, s);
    const bx = ph === 0 ? zx + 420 + 60 * Math.sin(t * 1.3) : lt < tR ? 1580 : lerp(1580, 2200, easeIn(gfK(tR, tR + 0.9, lt))), by = ph === 0 ? 470 + 30 * Math.sin(t * 2.2) : lt < tR ? 420 : lerp(420, 150, gfK(tR, tR + 0.9, lt));
    sky += fkBird(bx, by, 0.9, t, { fast: true }) + gfChipAt(lt, 0.05, bx, by - 110, '행복', { size: 34, bg: '#DFF1FF', col: '#2F6BD8' });
    if (ph === 1 && lt > tR) sky += gfRing(lt, tR, 1580, 420, 20, 140, '#fff', 8, 0.4);
    if (ph === 0) { w += gfChipAt(lt, tH, zx - 230, top[1] - 40, '행복해야 해', { size: 34, bg: '#FFE3EA', col: '#C2365B', rot: -4 }) + gfChipAt(lt, tO, zx - 200, top[1] + 90, '남들처럼 즐거워야 해', { size: 34, bg: '#FFE3EA', col: '#C2365B', rot: 3 });
      if (lt > tJ) w += gfEmote(lt, tJ, top[0] + 130, top[1] + 40, 'sweat', { hold: 9 });
      hv = lt > tE ? 1 : 2; hfrom = 2; htp = lt > tE ? tE : null; }
    else { hv = 1; hud = gfChipAt(lt, tR, 960, 140, '쫓을수록 멀어진다', { size: 44, bg: '#fff', rot: -2 }) + gfChipAt(lt, tR + 0.3, 1230, 205, '뜻을 옮김', { size: 24, bg: '#E4E1DA', col: '#6B7280' }); }
    w += fkAt(zx + 290, top[1] + 60, fkHearts(lt, hv, { from: hfrom, tp: htp, low: hv === 1 }), 0.78);
  } else {
    const zx = 860, sy = FK.FY - 70 + 150 * 0.86, sz = 0.86;
    const tG = ph === 2 ? fkW(a, '목표', 0.6) : -9, tL = ph === 2 ? fkW(a, '좋아하는', 2.6) : -9, tF = ph === 2 ? fkW(a, '몰입', 4.0) : -9, tQ = ph === 2 ? fkW(a, '따라오는', 5.4) : -9, tB = ph === 2 ? fkW(a, '부산물', 6.6) : -9;
    const tX = ph === 3 ? fkW(a, '억지로', 0.3) : -9, tOk = ph === 3 ? fkW(a, '괜찮아', 2.0) : -9, tOne = ph === 4 ? fkW(a, '하나면', 3.0) : -9, tEn = ph === 4 ? fkW(a, '충분', 3.6) : -9;
    const sat = ph > 2 || lt > tL;
    const ex = ph === 3 ? (lt > tOk ? 'z빵긋' : 'z히죽') : ph === 4 ? 'z빵긋' : lt > tQ ? 'z빵긋' : lt > tF ? 'z결심' : 'z기본';
    w += FK_STUMP;
    if (sat) { w += gfActor(FKZW, { x: zx, y: sy, s: sz, t, pose: 'f앉기', ex: fEx(ex), look: [0.3, 0.6], seed: 3 }, ph === 2 && lt < tL + 0.5 ? gfJelly(lt, tL, 0.1, 5, 8) : {});
      const [hx, hy] = gfHand(zx, sy, sz, P['f앉기'].hR); w += `<g transform="translate(${f1(hx - 30)} ${f1(hy - 40)}) rotate(-8)"><rect x="-80" y="-56" width="160" height="112" rx="10" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M-50 20 Q-20 -30 10 10 T60 -10" fill="none" stroke="${GFC.sky}" stroke-width="7" stroke-linecap="round"/>${ph >= 4 || lt > tB ? `<g transform="translate(40 -26) scale(.3)">${fkEmber(0, 0, 1, t, { glow: 0 })}</g>` : ''}<line x1="70" y1="40" x2="110" y2="-10" stroke="${GFC.sun}" stroke-width="9" stroke-linecap="round"/></g>`; }
    else w += gfActor(FKZW, { x: zx + 120, y: FK.FY, s, t, pose: '서기', ex: fEx('z멍'), look: [0.3, 0], seed: 3 }, {});
    const top = fkTop(zx, sy, sz);
    if (ph === 2 && lt > tF || ph >= 3) { for (let i = 0; i < 3; i++) { const u = ((lt * 0.6 + i / 3) % 1); w += `<ellipse cx="${zx}" cy="${f1(sy - 200)}" rx="${f1(160 + u * 160)}" ry="${f1(120 + u * 110)}" fill="none" stroke="#FFE38A" stroke-width="6" opacity="${f1((1 - u) * 0.5 * 100) / 100}"/>`; }
      w += gfEmote(lt, ph === 2 ? tF : 0, top[0] + 150, top[1] + 30, 'note', { hold: 99, s: 0.8 }); }
    const landed = ph >= 3 || lt > tQ + 0.9;
    if (ph === 2 && lt > tQ && !landed) { const u = gfK(tQ, tQ + 0.9, lt), bx = lerp(1700, top[0] + 40, easeInOut(u)), by = lerp(200, top[1] - 26, easeInOut(u)) - Math.sin(Math.PI * u) * 80; sky += fkBird(bx, by, 0.7, t, { dir: -1 }); }
    if (landed) { w += fkBird(top[0] + 40, top[1] - 26, 0.7, t, { dir: -1, sit: true }) + gfChipAt(lt, ph === 2 ? tQ + 0.9 : 0.05, top[0] + 40, top[1] - 120, '행복', { size: 30, bg: '#DFF1FF', col: '#2F6BD8' }); }
    if (ph === 2) { if (lt > tG - 0.1 && lt < tL + 0.2) hud += fkAt(1450, 300, `<circle r="80" fill="#fff" stroke="${INK}" stroke-width="7"/><circle r="54" fill="#FFE1E1" stroke="${INK}" stroke-width="6"/><circle r="26" fill="#E5484D" stroke="${INK}" stroke-width="6"/>`, gfIn(lt, tG, 3, 0.45) * (1 - gfK(tL - 0.1, tL + 0.2, lt))) + (lt > tG + 0.5 && lt < tL ? fkAt(1520, 260, gfStamp(lt, tG + 0.5, '아님', { size: 50, rot: -12 })) : '');
      hud += gfChipAt(lt, tB, 1250, 220, '부산물', { size: 44, icon: 'spark', bg: '#FFF3C4', rot: -2 }); hv = lt > tQ + 0.9 ? 2 : 1; hfrom = 1; htp = lt > tQ + 0.9 ? tQ + 0.9 : null; }
    if (ph === 3) { if (lt > tX && lt < tOk) w += gfEmote(lt, tX + 0.2, top[0] - 130, top[1] + 60, 'sweat', { hold: 9 }); if (lt > tOk) w += gfEmote(lt, tOk, top[0] - 130, top[1] + 60, 'heart', { hold: 9 }); hv = 2; }
    if (ph === 4) { hud += gfChipAt(lt, tOne, 1250, 220, '작은 것 하나', { size: 44, icon: 'star', bg: '#FFF3C4', rot: -2 }); hv = lt > tEn ? 3 : 2; hfrom = 2; htp = lt > tEn ? tEn : null; }
    w += fkAt(zx + 330, top[1] + 120, fkHearts(lt, hv, { from: hfrom, tp: htp, low: hv === 1 }), 0.78);
  }
  let h = fkDefs() + qPlate('meadow', cam, 0.6) + qCam(cam, sky + w) + hud;
  if (ph === 4) h += fkGain(lt, (a._dur || 4) - 0.15, 4, `<g transform="translate(0 -6) scale(1.5)">${GF_ICON.note()}</g>`) + fkHudAt(lt, 4, (a._dur || 4) - 0.15); else h += fkHud(lt, 3);
  return h;
};

/* ===== d4: 잠깐의 자극 vs 몰입과 의미 ===== */
fkwarmScene = function (t, lt, a) {
  const D = a._dur || 9, tJ = fkW(a, '자극', 2.6), tF = fkW(a, '몰입', 3.8), tO = fkW(a, '오래', 5.8);
  let h = fkDefs() + gfFull('#FFF6E8') + gfFull('url(#gfDots)');
  const meter = (cx, title, icon, v, glow, k) => { let s = gfPanel(560, 600, { head: title, headBg: icon === 'ember' ? '#FFF3C4' : '#FFE1E1' });
    s += `<rect x="-60" y="-210" width="120" height="400" rx="60" fill="#F4EFE4" stroke="${INK}" stroke-width="7"/><rect x="-44" y="${f1(176 - 370 * v)}" width="88" height="${f1(370 * v + 0.1)}" rx="44" fill="${icon === 'ember' ? '#FFB12E' : '#FF8A8A'}"/>`;
    s += icon === 'ember' ? fkEmber(150, -120, 0.7, t, { glow, face: true }) : `<g transform="translate(150 -120) scale(1.6)">${GF_ICON.spark ? GF_ICON.spark() : gfStar4(30, GFC.sun, 4)}</g>`;
    s += gfT(150, 120, '온기', 34, '#8D93A6');
    return fkAt(cx, 560, s, k); };
  const vL = lt < tJ ? 0.05 : lt < tJ + 0.35 ? lerp(0.05, 0.95, (lt - tJ) / 0.35) : 0.05 + 0.9 * Math.exp(-(lt - tJ - 0.35) * 1.6);
  const vR = lt < tF ? 0.05 : 0.05 + 0.75 * easeInOut(gfK(tF, tF + 2.2, lt));
  h += meter(560, '잠깐의 자극', 'spark', vL, 0, gfIn(lt, 0.1, 3, 0.45)) + meter(1360, '몰입과 의미', 'ember', vR, lt > tO ? 1 : 0.6, gfIn(lt, 0.3, 3, 0.45));
  if (lt > tJ && lt < tJ + 0.8) h += gfStarBurst(lt, tJ, 560, 420, { r1: 220, n: 9 });
  if (lt > tO) h += gfRing(lt, tO, 1360, 560, 60, 420, GFC.sun, 10, 0.6) + gfRays(t, 1360, 560, 520, '#FFE9A8', 12, 0.35 * gfK(tO, tO + 0.5, lt), 6);
  h += gfChipAt(lt, tO + 0.1, 1360, 960, '오래간다', { size: 40, bg: '#FFF3C4' });
  return h + fkHud(lt, 3);
};

/* ===== e1·e2: 빵 한 조각 (흑백 동화책) ===== */
fkbreadScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 5, s = 0.8, gx = 880, rx = 1160;
  const cam = ph === 0 ? qLerpCam(lt / D, [960, 600, 1.1], [980, 610, 1.18]) : qLerpCam(lt / D, [1000, 610, 1.2], [1020, 620, 1.3]);
  const tS = ph === 0 ? fkW(a, '비밀', 3.2) : -9, tH = ph === 1 ? fkW(a, '인간다움', 3.0) : -9, tB = ph === 1 ? fkW(a, '빵', 5.2) : -9, tN = ph === 1 ? fkW(a, '나누었', 6.6) : -9;
  let w = gfActor(FKF, { x: 420, y: FK.FY, s: 0.7, t, pose: '서기', ex: fEx('z기본'), look: [0.6, 0], seed: 41 }) + fkEmber(...fkChest(420, FK.FY, 0.7), 0.32, t, { glow: 0.7 });
  const shared = lt > tN + 0.5;
  w += gfActor(o => FKV(GREY, o), { x: gx, y: FK.FY, s, t, pose: '서기', ex: fEx(shared ? 'z빵긋' : 'z기본'), look: [0.6, 0.2], seed: 70 }, { sy: 1 - 0.015 * Math.sin(t * 1.4) });
  w += gfActor(o => FKV(GREY, o), { x: rx, y: FK.FY, s, t, pose: '서기', ex: fEx(shared ? 'z빵긋' : 'z울먹'), look: [-0.6, 0.3], seed: 74 }, { sy: 0.98 - 0.015 * Math.sin(t * 1.4 + 1) });
  const [g1, g2] = fkChest(gx, FK.FY, s), [r1, r2] = fkChest(rx, FK.FY, s);
  w += fkEmber(g1, g2, 0.38, t, { k: ph === 0 ? 0.6 : 1, glow: lt > tH ? 1 : 0.7 }) + fkEmber(r1, r2, 0.38, t, { k: ph === 0 ? 0.2 : shared ? 1 : 0.35, glow: shared ? 1 : 0.4 });
  if (ph === 1 && lt > tB) { const u = gfK(tN, tN + 0.8, lt), bx = lerp(g1 + 70, r1 - 60, easeInOut(u));
    w += fkAt(g1 + 70, g2 + 30, fkBread(1), gfIn(lt, tB, 3, 0.45) * (lt > tN ? 0.8 : 1));
    if (lt > tN) w += fkAt(bx, g2 + 30 - Math.sin(Math.PI * u) * 50, fkBread(0.8)) + gfPuff(lt, tN, g1 + 70, g2 + 30, 0.8, '#E9C48C');
    if (shared) w += gfRing(lt, tN + 0.5, r1, r2, 10, 130, '#FFE38A', 8, 0.5) + gfEmote(lt, tN + 0.6, (gx + rx) / 2, FK.FY - 470, 'heart', { hold: 9 }); }
  let h = fkDefs() + fkWinter(t, cam, { dark: 0.3, snow: lt > tH ? 50 : 40, wind: 0.3 }) + qCam(cam, w);
  if (ph === 0) h += gfChipAt(lt, tS, 960, 140, '마지막 비밀', { size: 46, icon: 'star', bg: '#F7F6F2', rot: -2 });
  return h;
};

/* ===== e3·e4·e5: 벤치의 하나 (밤거리) ===== */
const FKB = { bx: 1180, seat: FK.FY - 150, hx: 1330, zs: 1030 };
const fkBench = (front) => front ? `<rect x="${FKB.bx - 230}" y="${FKB.seat}" width="460" height="30" rx="10" fill="${GFC.wood}" stroke="${INK}" stroke-width="7"/><rect x="${FKB.bx - 200}" y="${FKB.seat + 30}" width="22" height="120" fill="#3B4570" stroke="${INK}" stroke-width="5"/><rect x="${FKB.bx + 178}" y="${FKB.seat + 30}" width="22" height="120" fill="#3B4570" stroke="${INK}" stroke-width="5"/>`
  : `<rect x="${FKB.bx - 230}" y="${FKB.seat - 160}" width="460" height="26" rx="10" fill="${GFC.wood}" stroke="${INK}" stroke-width="7"/><rect x="${FKB.bx - 230}" y="${FKB.seat - 110}" width="460" height="26" rx="10" fill="${GFC.wood}" stroke="${INK}" stroke-width="7"/><rect x="${FKB.bx - 210}" y="${FKB.seat - 170}" width="20" height="170" fill="#3B4570" stroke="${INK}" stroke-width="5"/><rect x="${FKB.bx + 190}" y="${FKB.seat - 170}" width="20" height="170" fill="#3B4570" stroke="${INK}" stroke-width="5"/>`;
fkbenchScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 5, sh = 0.78, zs = 0.84;
  const cam = ph === 0 ? qLerpCam(lt / D, [900, 560, 1.12], [1000, 560, 1.18]) : ph === 1 ? qLerpCam(lt / D, [1060, 560, 1.22], [1140, 560, 1.32]) : qLerpCam(lt / D, [1140, 560, 1.32], [1120, 540, 1.24]);
  const tS = ph === 1 ? fkW(a, '누군가', 3.0) : -9, tT = ph === 1 ? fkW(a, '고생', 4.0) : 99, tG = ph === 1 ? fkW(a, '건넨', 5.4) : 99;
  const tW = ph === 2 ? fkW(a, '온기가', 0.6) : -9, tC = ph === 2 ? fkW(a, '먹구름', 2.0) : 99, tR = ph === 2 ? fkW(a, '걷어', 2.9) : 99, tM = ph === 2 ? fkW(a, '기적', 4.4) : 99;
  const hy = FKB.seat + 150 * sh, hTop = fkTop(FKB.hx, hy, sh), hCh = fkChest(FKB.hx, hy, sh);
  const sitting = ph >= 1 && lt > tS || ph === 2;
  const walkU = ph === 0 ? gfK(0.1, D - 0.2, lt) : 1, zx = sitting ? FKB.zs : lerp(260, 780, easeOut(walkU)), wk = !sitting && walkU < 1 ? gfWalk(zx * 2.2, 0.6) : null;
  let w = fkBench(false);
  const hanaHappy = ph === 2 && lt > tR;
  w += gfActor(FKH, { x: FKB.hx, y: hy, s: sh, t, pose: 'f앉기', ex: fEx(hanaHappy ? 'z빵긋' : ph >= 1 && lt > tT ? 'z반짝' : 'z울먹'), look: ph >= 1 && lt > tT ? [-0.6, -0.1] : [0, 0.6], seed: 81 }, ph >= 1 && lt > tT && lt < tT + 0.5 ? gfJelly(lt, tT, 0.1, 5, 8) : {});
  const zy = sitting ? FKB.seat + 150 * zs : FK.FY;
  if (ph === 1 && lt > tS && lt < tS + 0.4) w += gfPuff(lt, tS, FKB.zs, FKB.seat, 1, '#fff');
  w += gfActor(FKZW, { x: zx, y: zy, s: zs, t, pose: sitting ? 'f앉기' : wk ? wk.pose : '서기', ex: fEx(ph === 2 && lt > tR ? 'z빵긋' : ph === 1 && lt > tT ? 'z기본' : 'z멍'), look: sitting ? [0.7, -0.1] : [0.8, 0], seed: 3 }, wk ? { sy: wk.sy, dy: wk.dy } : {});
  w += fkBench(true);
  const zTop = fkTop(zx, zy, zs), zCh = fkChest(zx, zy, zs);
  // 먹구름
  const hcK = ph === 2 && lt > tC ? 1 - gfK(tC, tC + 0.35, lt) : 1, zcK = ph === 2 && lt > tC + 0.45 ? 1 - gfK(tC + 0.45, tC + 0.8, lt) : 1;
  w += fkCloud(hTop[0] + 6, hTop[1] - 95, 0.6, t, { k: hcK, seed: 9, fall: 120 }) + gfPuff(lt, tC, hTop[0], hTop[1] - 95, 1.3, '#C7CEDB');
  w += fkCloud(zTop[0] + 6, zTop[1] - 95, 0.6, t, { k: zcK, seed: 2, fall: 120 }) + gfPuff(lt, tC + 0.45, zTop[0], zTop[1] - 95, 1.3, '#C7CEDB');
  // 불씨: 제로 가슴 → 하나 가슴
  const given = ph === 2 || lt > tG + 1.0;
  w += fkEmber(zCh[0], zCh[1], 0.4, t, { glow: 0.8 });
  if (ph === 1 && lt > tG && lt < tG + 1.0) { const u = gfK(tG, tG + 1.0, lt), p = easeInOut(u); w += fkEmber(lerp(zCh[0], hCh[0], p), lerp(zCh[1], hCh[1], p) - Math.sin(Math.PI * u) * 120, 0.34, t, { face: true, glow: 1 }) + gfTwinkle(t, lerp(zCh[0], hCh[0], p) + 30, lerp(zCh[1], hCh[1], p) - 140 * Math.sin(Math.PI * u), 10, 1, '#FFE38A'); }
  if (given) w += fkEmber(hCh[0], hCh[1], 0.36 * (ph === 2 && lt > tW ? gfBeat(lt, tW, 0.35, 3, 4) : 1), t, { face: true, glow: 1 }) + (ph === 1 ? gfRing(lt, tG + 1.0, hCh[0], hCh[1], 10, 110, '#FFE38A', 8, 0.5) : gfRing(lt, tW, hCh[0], hCh[1], 10, 140, '#FFE38A', 8, 0.5));
  if (ph === 1 && lt > tT) w += fkAt(zTop[0] + 80, zTop[1] - 150, fkBalloon('오늘 고생 많았어요', { size: 38, tail: -40 }), gfIn(lt, tT, 3.2, 0.42) * (1 - gfK(tG + 1.2, tG + 1.5, lt)));
  // 하트
  const hV = ph === 2 && lt > tR ? 3 : 1, zV = ph === 2 && lt > tR + 0.25 ? 5 : 3;
  w += fkAt(hTop[0] + 250, hTop[1] + 40, fkHearts(lt, hV, { from: 1, tp: ph === 2 && lt > tR ? tR : null, low: hV === 1, n: 5 }), 0.62);
  w += fkAt(zTop[0] - 250, zTop[1] + 40, fkHearts(lt, zV, { from: 3, tp: ph === 2 && lt > tR + 0.25 ? tR + 0.25 : null, n: 5 }), 0.62);
  let h = fkDefs() + fkStreet(t, cam) + qCam(cam, w);
  if (ph === 2 && lt > tM - 0.3) { const k = easeInOut(gfK(tM - 0.3, tM + 1.2, lt)); h += `<defs><linearGradient id="fkWarm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9EC0"/><stop offset=".55" stop-color="#FFC59A"/><stop offset="1" stop-color="#FFE7A0"/></linearGradient></defs><rect x="-600" y="-600" width="3120" height="2280" fill="url(#fkWarm)" opacity="${f1(0.45 * k * 100) / 100}" style="mix-blend-mode:soft-light"/><rect x="-600" y="-600" width="3120" height="2280" fill="url(#fkWarm)" opacity="${f1(0.22 * k * 100) / 100}"/>` + gfConfetti(lt, tM, { n: 40, d: 2.4 }); }
  if (ph === 2) h += fkGain(lt, D - 0.15, 5, `<g transform="translate(0 4)">${fkEmber(0, 0, 1.1, t, { face: true })}</g>`) + fkHudAt(lt, 5, D - 0.15) + (lt > D + 1.75 ? fkAt(1700, 190, gfStamp(lt, D + 1.8, '모두 모음', { size: 40, col: '#2E9E6B', rot: -6 })) : '');
  else h += fkHud(lt, 4);
  return h;
};

/* ===== z1·z2: 별이 뜬 길 (Grok 밤길 판) ===== */
fkstarsScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 6, s = 0.8;
  const cam = qLerpCam(lt / D, ph === 0 ? [960, 600, 1.04] : [980, 590, 1.08], ph === 0 ? [980, 590, 1.08] : [1000, 580, 1.12]);
  const base = ph === 0 ? 0 : 1, u = (base + lt / D) / 2, zx = lerp(620, 900, u), hx = zx + 230;
  const wz = gfWalk(zx * 2.2, 0.5), wh = gfWalk(zx * 2.2 + 3, 0.5);
  let w = gfActor(FKZW, { x: zx, y: 1000, s, t, pose: wz.pose, ex: fEx('z빵긋'), look: [0.6, -0.2], seed: 3 }, { sy: wz.sy, dy: wz.dy }) + gfActor(FKH, { x: hx, y: 1000, s: s * 0.95, t, pose: wh.pose, ex: fEx('z빵긋'), look: [-0.4, -0.2], seed: 81 }, { sy: wh.sy, dy: wh.dy });
  w += fkEmber(...fkChest(zx, 1000, s), 0.3, t, { glow: 0.7 }) + fkEmber(...fkChest(hx, 1000, s * 0.95), 0.3, t, { glow: 0.7, seed: 2 });
  let h = fkDefs() + qPlate('starry', cam, 0.55) + qCam(cam, w);
  if (ph === 1) { const t92 = fkW(a, '92', 1.4), tQ = fkW(a, '질문', 3.6), k = gfIn(lt, t92 - 0.2, 3, 0.45);
    if (k > 0.02) { let pg = gfPanel(420, 300, { bg: '#ECEAE4' }) + `<g transform="translate(0 120) scale(.36)">${FKF({ x: 0, y: 0, s: 1, t, pose: '서기', ex: fEx('z빵긋'), look: [0, 0], seed: 41 })}</g>` + fkEmber(0, 46, 0.18, t, { glow: 0.6 });
      h += fkAt(1460, 330, pg, k) + gfChipAt(lt, t92, 1460, 160, '92세', { size: 38, bg: '#F7F6F2' }); }
    if (lt > tQ) { const v = gfK(tQ, tQ + 1.4, lt), x = lerp(1460, 980, easeInOut(v)), y = lerp(430, 560, easeInOut(v)) - Math.sin(Math.PI * v) * 60; h += fkAt(x, y, `<g transform="scale(1.6)">${GF_ICON.letter()}</g><circle r="70" fill="url(#gfGlow)" opacity=".5"/>`, 1) + gfTwinkle(t, x + 50, y - 40, 12, 1, '#FFE38A'); } }
  return h + fkHud(lt, 5);
};

/* ===== z3: 잠들기 전 질문 ===== */
fkquoteScene = function (t, lt, a) {
  const cam = qLerpCam(lt / (a._dur || 7), [1010, 520, 1.2], [990, 520, 1.26]);
  const zz = odZBed(t, { pose: 'f앉기', ex: fEx('z기본'), look: [-0.7, -0.4] }), bed = odBedSit(1);
  let w = bed.back + zz.body + bed.front + fkEmber(zz.top[0] - 30, zz.top[1] + 270, 0.3, t, { glow: 0.7 });
  let h = fkDefs() + odRoom(t, cam, { night: 1, noClock: true }) + qCam(cam, w);
  const k = gfIn(lt, 0.2, 3, 0.45);
  h += fkAt(560, 520, gfPanel(560, 280, { head: '잠들기 전 질문', headBg: '#C9CFFF', bg: '#FFFDF6' }) + fkEmber(-170, 40, 0.7, t, { face: true }) + `<g transform="translate(60 40) scale(1.6)">${GF_ICON.letter()}</g>` + gfT(150, 40, '?', 70, GFC.grape), k);
  h += gfChipAt(lt, 0.6, 700, 700, '뜻을 옮김', { size: 26, bg: '#E4E1DA', col: '#6B7280' });
  return h + fkHud(lt, 5);
};

/* ===== z4·z5: 나의 작은 순간은? ===== */
fkaskScene = function (t, lt, a) {
  const ph = a.ph, cam = [960, 560, 1.0];
  let h = fkDefs() + qDefs() + qPlate('starry', [960, 520, 1.06], 0.55, { blur: 1 }) + fkTint('#141B48', 0.45);
  const k = gfIn(lt, ph === 0 ? 0.2 : -1, 3, 0.45);
  let card = gfPanel(980, 400, { head: '나의 작은 순간', headBg: GFC.sun, bg: '#FFFDF6' }) + fkEmber(-370, 30, 0.8, t, { face: true });
  card += `<rect x="-280" y="-40" width="620" height="130" rx="22" fill="#fff" stroke="#B3A98F" stroke-width="6" stroke-dasharray="18 12"/>` + (Math.floor(t * 2) % 2 ? `<rect x="-250" y="-10" width="8" height="70" rx="3" fill="${GFC.navy}"/>` : '');
  h += fkAt(960, 500, card, k);
  if (ph === 1) { const tC = fkW(a, '댓글', 0.3); h += fkAt(1280, 250, `<path d="M-90 -60 h180 a30 30 0 0 1 30 30 v80 a30 30 0 0 1 -30 30 h-110 l-40 36 v-36 h-30 a30 30 0 0 1 -30 -30 v-80 a30 30 0 0 1 30 -30 Z" fill="#fff" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` + [0, 1, 2].map(i => `<circle cx="${-36 + i * 36}" cy="10" r="${f1(10 + 3 * Math.sin(t * 6 + i))}" fill="${GFC.navy}"/>`).join(''), gfIn(lt, tC, 3.2, 0.42)); }
  for (let i = 0; i < 10; i++) h += gfTwinkle(t, 100 + i * 190, 120 + (i % 3) * 50, 10, i, '#FFF6C8');
  return h + fkHud(lt, 5);
};

/* ===== z6·z7: 오늘도 고생 많으셨습니다 ===== */
fkbyeScene = function (t, lt, a) {
  const ph = a.ph, D = a._dur || 4, s = 0.88;
  const cam = ph === 0 ? [960, 590, 1.1] : qLerpCam(gfK(0.3, D + 1.2, lt), [960, 590, 1.1], [960, 500, 1.04]);
  let w = gfActor(FKZW, { x: 820, y: 1000, s, t, pose: '손인사', ex: fEx('z빵긋'), look: [0, 0], seed: 3 }, ph === 0 ? gfHop(lt, 0.3, 24, 0.34) : {}) + gfActor(FKH, { x: 1110, y: 1000, s: s * 0.95, t, pose: '손인사', ex: fEx('z빵긋'), look: [0, 0], seed: 81 }, ph === 0 ? gfHop(lt, 0.45, 24, 0.34) : {});
  w += fkEmber(...fkChest(820, 1000, s), 0.32, t, { glow: 0.8 }) + fkEmber(...fkChest(1110, 1000, s * 0.95), 0.32, t, { glow: 0.8, seed: 2 });
  w += fkAt(820, 400, fkHearts(lt, 5), 0.66);
  let h = fkDefs() + qPlate('starry', cam, 0.55) + qCam(cam, w);
  for (let i = 0; i < 14; i++) h += gfTwinkle(t, 80 + i * 140, 90 + (i % 4) * 55, 9 + (i % 3) * 3, i, '#FFF6C8');
  return h + (ph === 0 ? fkHud(lt, 5) : '');
};
