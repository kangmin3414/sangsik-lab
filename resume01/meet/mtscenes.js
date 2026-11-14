/* 자소서 편 — 회의 장면 샘플(대본_v4 17~22번). ../long/rsscenes.js·rsscenes2.js의 헬퍼를 쓴다. 새 이름은 mt 접두사.
   연출 개선 시험: ① 대사가 오가고 컷이 바뀐다(전체 → 화면 인서트 → 손 인서트 → 얼굴 → 어깨 너머 → 반응) ② 노란 한 줄이 몸으로 방해한다(어깨의 짐 → 입을 덮는다) ③ 카메라 리듬이 장면마다 다르다(밀기·멈춤·잘라 붙이기). */
Object.keys(QBG).forEach(k => { if (k.startsWith('rs')) QBG[k] = '../long/' + QBG[k]; });
CAMS['mtmeet'] = 'fixed';
const MT = { GY: 985, TY: 852, ZX: 250, WIDE: [920, 592, 1.08] };
function mtSlide(x, y, w, h, pop) { // 벽의 발표 화면
  let g = `<rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" rx="14" fill="#2B303B" stroke="${INK}" stroke-width="7"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#F7F9FC"/><rect x="${x}" y="${y}" width="${w}" height="56" fill="#DDE2EA"/>` + fT(x + 24, y + 40, '분기 매출 분석', 32, NAVY, { anchor: 'start' });
  [70, 96, 84, 120, 108, 190].forEach((bh, i) => { const hh = i === 5 ? bh * (0.62 + 0.38 * easeOut(clamp(pop, 0, 1))) : bh; g += `<rect x="${x + 44 + i * 62}" y="${f1(y + h - 36 - hh)}" width="42" height="${f1(hh)}" rx="6" fill="${i === 5 ? '#F08A6B' : '#9DB7E8'}" stroke="${INK}" stroke-width="3"/>`; });
  for (let i = 0; i < 3; i++) g += `<rect x="${x + w - 190}" y="${y + 250 + i * 40}" width="${[150, 110, 136][i]}" height="16" rx="8" fill="#C5CCD8"/>`;
  if (pop > 0) g += `<g transform="translate(${x + w - 130} ${y + 150}) scale(${rsSc(pop)})"><path d="M-104 30 L-70 30 L-70 6 L-40 6" fill="none" stroke="#E2553A" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>${fT(30, 26, '+30%', 76, '#E2553A')}</g>`;
  return g;
}
function mtRoom(t, S) { // 회의실 전체(세계 좌표). S: 인물·한 줄·화면의 상태
  const GY = MT.GY, TY = MT.TY, zx = S.zx == null ? MT.ZX : S.zx, press = S.press || 0, zsy = (S.zsy || 1) * (1 - 0.12 * press), arm = S.arm == null ? 1 : S.arm;
  let w = mtSlide(430, 150, 620, 380, S.pop || 0);
  const up = { armR: [[252, 285], [300, 296], [334, 262]], hR: [342, 254] }, dn = P['서기'], sh = S.shake ? Math.sin(t * 37) * 2.4 * S.shake : 0;
  const zp = Object.assign({}, P['서기'], { armR: up.armR.map((p, i) => [lerp(dn.armR[i][0], p[0], arm), lerp(dn.armR[i][1], p[1], arm) + (i ? sh : 0)]), hR: [lerp(dn.hR[0], up.hR[0], arm), lerp(dn.hR[1], up.hR[1], arm) + sh] });
  const ZP = (lx, ly) => [zx + (lx - 200), GY + (ly - 560) * zsy], hp = ZP(zp.hR[0], zp.hR[1]);
  w += qShadow(zx, GY, 92 + 10 * press, 0.5) + RSZW({ x: zx, y: GY, s: 1, sy: zsy, sx: 1 + 0.04 * press, t, pose: zp, ex: S.zex || fEx('z히죽'), look: S.zlook || [0.8, -0.1], tilt: (S.ztilt || 0) + 6 * press, seed: 3, still: !!S.zstill, noBlink: !!S.znb });
  w += `<rect x="${f1(hp[0] - 8)}" y="${f1(hp[1] - 34)}" width="16" height="44" rx="6" fill="#3A4252" stroke="${INK}" stroke-width="4"/><circle cx="${f1(hp[0])}" cy="${f1(hp[1] - 26)}" r="3.5" fill="${S.led ? '#FF5A4A' : '#7A8394'}"/>` + hand(hp[0], hp[1], 0.7);
  if (S.strip) { const k = S.strip.k || 0, a0 = ZP(206, 290), a1 = ZP(200 + 26 * press * 0.4, 238), e = easeInOut(k), wob = Math.sin(t * 3.1) * 1.2 * (1 - k);
    const s = lerp(S.strip.s, 0.31, e) * (1 + 0.1 * Math.sin(Math.PI * k)), x = lerp(a0[0], a1[0], e) + 7 * press, y = lerp(a0[1], a1[1], e) - 26 * Math.sin(Math.PI * e) + (S.strip.dy || 0);
    if (k <= 0 && S.strip.s > 0.42) w += `<ellipse cx="${f1(x)}" cy="${f1(y + 40 * S.strip.s + 6)}" rx="${f1(300 * S.strip.s)}" ry="9" fill="${INK}" opacity=".2"/>`;
    w += rsStrip(x, y, s, { rot: lerp(-9 + wob + (S.strip.rot || 0), 0, e) }); }
  // 탁자 뒤의 세 사람
  const sit = rsSitY(TY), c = S.c || {}, x2 = S.x || {}, b = S.b || {}, st = b.stand || 0;
  const cp = Object.assign({}, rsSitPose(), c.pen ? { armL: [[148, 285], [118, 262], [104, 214 + (c.tap ? Math.sin(t * 9) * 4 : 0)]], hL: [100, 204 + (c.tap ? Math.sin(t * 9) * 4 : 0)] } : {}), chp = [1170 + (cp.hL[0] - 200), sit + (cp.hL[1] - 560)];
  let ppl = RSC({ x: 1170, y: sit, s: 1, t, pose: cp, ex: c.ex || fEx('rs평온'), look: c.look || [-0.75, -0.5], tilt: c.tilt || 0, seed: 51 }) + (c.pen ? `<g transform="translate(${f1(chp[0])} ${f1(chp[1])}) rotate(-24)"><rect x="-5" y="-62" width="10" height="64" rx="4" fill="${RS.BLUE}" stroke="${INK}" stroke-width="3"/></g>` + hand(chp[0], chp[1], 0.7) : '');
  ppl += RSX('#B7C9A8', '#5A3A22')({ x: 1440, y: sit, s: 1, t, pose: rsSitPose(), ex: x2.ex || fEx('rs평온'), look: x2.look || [-0.75, -0.5], seed: 52 });
  const bpose = st > 0.5 && b.reach ? Object.assign({}, rsSitPose(), { armL: [[148, 285], [104, 300], [72, 290]], hL: [64, 288] }) : rsSitPose();
  ppl += RSB({ x: 1710, y: lerp(sit, GY - 22, easeInOut(st)), s: 1, t, pose: bpose, ex: b.ex || fEx('rs평온'), look: b.look || [-0.75, -0.5], seed: 21 });
  w += (S.noPpl ? '' : `<g clip-path="url(#rsT)">${ppl}</g>`) + rsTable(960, 2010, TY, GY);
  w += `<rect x="1196" y="${TY - 10}" width="96" height="10" rx="3" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="1392" y="${TY - 12}" width="96" height="12" rx="4" fill="#8E97A6" stroke="${INK}" stroke-width="4"/><rect x="1300" y="${TY - 44}" width="30" height="44" rx="6" fill="#DDEBFA" stroke="${INK}" stroke-width="4"/>`;
  const fold = b.fold || 0;
  w += `<rect x="1640" y="${TY - 10}" width="70" height="10" rx="3" fill="${RS.BLUE}" stroke="${INK}" stroke-width="4"/><g transform="rotate(${f1(-180 * fold)} 1710 ${TY})"><rect x="1710" y="${TY - 10}" width="70" height="10" rx="3" fill="${RS.BLUE}" stroke="${INK}" stroke-width="4"/></g>` + (fold < 0.5 ? `<rect x="1648" y="${TY - 16}" width="124" height="6" rx="2" fill="#fff" stroke="${INK}" stroke-width="3"/>` : '');
  return w;
}
const mtShot = (t, cam, S) => rsDefs() + rsClipY('rsT', MT.TY) + qdPlate('rsmeeting', cam, 1.0) + qCam(cam, mtRoom(t, S));
function mtHand(t, lt) { // 인서트: 리모컨을 쥔 손이 떨린다(누르는 손가락은 그리지 않는다)
  const dx = Math.sin(t * 38) * 6, dy = Math.cos(t * 31) * 5, x = 980 + dx, y = 640 + dy, z = lerp(1.0, 1.08, rsK(0, 1.6, lt));
  let g = `<rect x="-300" y="-200" width="2600" height="1700" fill="#EDE6D6"/><g filter="url(#rsBlur)" opacity=".85"><g transform="translate(-700 -420) scale(3)">${mtSlide(430, 150, 620, 380, 1)}</g></g>` + fFull('#F4EBD6', 0.25);
  g += `<g transform="translate(960 560) scale(${f1(z * 1000) / 1000}) translate(-960 -560)"><path d="M${f1(x + 70)} ${f1(y + 110)} L1560 1400" stroke="${INK}" stroke-width="190" stroke-linecap="round"/><path d="M${f1(x + 70)} ${f1(y + 110)} L1560 1400" stroke="#F4F4F8" stroke-width="170" stroke-linecap="round"/>`;
  g += `<g transform="translate(${f1(x - 30)} ${f1(y - 150)}) rotate(${f1(-18 + dx * 0.4)})"><rect x="-58" y="-190" width="116" height="400" rx="40" fill="#3A4252" stroke="${INK}" stroke-width="9"/><circle cx="0" cy="-130" r="20" fill="${Math.floor(t * 5) % 2 ? '#FF5A4A' : '#8A3A2A'}" stroke="${INK}" stroke-width="5"/><rect x="-22" y="-80" width="44" height="60" rx="14" fill="#5B6478" stroke="${INK}" stroke-width="5"/></g>` + hand(x, y, 5.6);
  for (let i = 0; i < 3; i++) { const k = (lt * 1.6 + i * 0.37) % 1; g += `<path d="M${f1(x - 220 - i * 40)} ${f1(y - 170 + i * 70 + k * 60)} q-12 20 0 30 q12 -10 0 -30 Z" fill="#BFE3FF" stroke="${INK}" stroke-width="4" opacity="${rsOp(1 - k)}"/>`; }
  for (let i = 0; i < 4; i++) g += `<path d="M${f1(x + 150 + i * 16)} ${f1(y - 220 + i * 46)} q20 ${i % 2 ? 14 : -14} 40 0" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity="${rsOp(0.3 + 0.5 * Math.abs(Math.sin(t * 19 + i)))}"/>`;
  return rsDefs() + g + `</g>`;
}
const mtOTS = () => `<defs><filter id="mtBl" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5"/></filter></defs><g filter="url(#mtBl)"><path d="M1150 1340 Q1200 1090 1420 1040 L1900 1040 Q2130 1090 2180 1340 Z" fill="#D98A6B" stroke="${INK}" stroke-width="12"/><path d="M1352 800 Q1320 1110 1392 1250 L1930 1250 Q2000 1110 1968 800 Z" fill="#5A3A22" stroke="${INK}" stroke-width="12"/><ellipse cx="1660" cy="800" rx="312" ry="330" fill="#5A3A22" stroke="${INK}" stroke-width="12"/><path d="M1470 600 Q1640 520 1830 610" fill="none" stroke="#7A5234" stroke-width="14" stroke-linecap="round" opacity=".7"/></g>`;
function mtmeetScene(t, lt, a) {
  const ph = a.ph, W = MT.WIDE, rib = (k, q = 1, qk = 1) => rsRib(k, RSW1, '석 달째 · 고객사 회의', q, qk), ST = s => ({ s, k: 0 });
  const toZ = [-0.9, -0.05], toS = [-0.75, -0.5];
  if (ph === 0) { const cam = qLerpCam(lt / 6.5, [1040, 596, 1.08], W);
    return mtShot(t, cam, { zex: fEx('z히죽'), zlook: [0.8, -0.2], strip: ST(0.36), led: lt > 1.2 && lt < 1.45 }) + rib(lt / 0.4); }
  if (ph === 1) { const t30 = rsW(a, '30', 2.21), tC = t30 + 1.45;
    if (lt < t30 - 0.15) return mtShot(t, qLerpCam((lt + 1.9) / 6.5, [1040, 596, 1.08], W), { zex: rsTalk('z히죽', t), zlook: [0.8, -0.2], strip: ST(0.36) }) + rib(1);
    if (lt < tC) { const u = lt - (t30 - 0.15); return mtShot(t, [760, lerp(346, 338, rsK(0, 1.6, u)), lerp(2.2, 2.34, easeOut(rsK(0, 1.6, u)))], { pop: (u - 0.12) / 0.3, strip: ST(0.36), led: u < 0.25 }) + rsVeil(lt, tC, 0.1, 0.35); }
    return mtHand(t, lt - tC) + rsVeil(lt, tC, 0.1, 0.35); }
  if (ph === 2) { const tA = rsW(a, '뭐죠', 3.89) + 0.75, tB = rsW(a, '전분기', 6.07) - 0.1;
    if (lt < tA) return mtShot(t, [1170, 634, lerp(1.85, 1.95, rsK(0, tA, lt))], { pop: 1, strip: ST(0.36), c: { pen: 1, ex: rsTalk('z기본', t), look: toZ, tilt: -3 } });
    const th = rsK(tA + 0.25, tA + 0.5, lt), bounce = lt > tA + 0.25 ? 0.05 * Math.sin((lt - tA - 0.25) * 16) * Math.exp(-(lt - tA - 0.25) * 6) : 0;
    const S = { pop: 1, press: 0.32 * th + bounce, strip: { s: lerp(0.36, 0.55, easeOutBack(th)), k: 0 }, zex: fEx(th > 0 ? 'z당황' : 'z히죽'), zlook: [0.8, 0], arm: 1 - 0.5 * easeInOut(rsK(tA + 0.5, tA + 1.4, lt)), shake: 1, c: { pen: 1, ex: rsTalk('rs평온', t), look: toZ }, zstill: true };
    if (lt < tB) return mtShot(t, [430, 548, 1.5], Object.assign({ noPpl: 1 }, S)) + mtOTS();
    return mtShot(t, [280, 600, 2.0], Object.assign(S, { zlook: [0.8 * Math.sin((lt - tB) * 7), 0.15] })); }
  if (ph === 3) { const tG = rsW(a, '종합', 2.87) - 0.25, pr = lerp(0.32, 0.62, easeInOut(rsK(0.2, tG, lt))), pr2 = lerp(0.62, 0.85, easeInOut(rsK(tG, tG + 2.4, lt)));
    if (lt < tG) return mtShot(t, [280, 600, 2.0], { pop: 1, press: pr, strip: { s: lerp(0.55, 0.72, rsK(0.2, tG, lt)), k: 0 }, zex: rsTalk('z당황', t), zlook: [0.5 + 0.3 * Math.sin(lt * 6), 0.3], arm: 0.5, shake: 1, c: { pen: 1, tap: 1, look: toZ } });
    return mtShot(t, qLerpCam((lt - tG) / 3, W, [940, 596, 1.2]), { pop: 1, press: pr2, strip: { s: lerp(0.72, 0.92, rsK(tG, tG + 2.4, lt)), k: 0 }, zex: rsTalk('z당황', t), zlook: [0.3, 0.6], arm: 0.3, shake: 1, c: { pen: 1, tap: 1, look: toZ }, x: { look: lt > tG + 0.9 ? [0.8, 0] : toZ }, b: { ex: fEx('z민망'), look: toZ } }) + rib(1) + rsVeil(lt, tG, 0.1, 0.35); }
  const HEAVY = { pop: 1, press: 0.85, strip: { s: 0.92, k: 0 }, zex: fEx('z당황'), zlook: [0.3, 0.6], arm: 0.2, shake: 0.6 };
  if (ph === 4) return mtShot(t, [1170, 634, lerp(1.95, 2.12, easeInOut(rsK(0, 3.6, lt)))], Object.assign({}, HEAVY, { c: { pen: lt < 0.45, ex: rsTalk('rs평온', t), look: toZ } }));
  if (ph === 5) { const op = rsK(0.25, 0.6, lt), k = rsK(0.75, 1.3, lt), tW = 2.05; E['_mto'] = qTalk('z당황', op * (1 - k) * 0.9);
    const S = Object.assign({}, HEAVY, { strip: { s: 0.92, k }, zex: k > 0.6 ? fEx('z충격') : fEx('_mto'), zlook: [0.8, 0], zsy: 1 + 0.03 * Math.sin(Math.PI * op) * (1 - k), shake: 0.3, znb: true, zstill: k >= 1, c: { look: toZ }, x: { look: toZ }, b: { look: lt > tW + 0.9 ? [-0.2, 0.8] : toZ, ex: lt > tW + 0.9 ? { expr: 'rs평온', prev: 'rs평온', k: 1, blink: 1 } : fEx('z민망'), fold: easeInOut(rsK(tW + 0.6, tW + 1.3, lt)) } });
    if (lt < tW) return mtShot(t, [280, 598, lerp(2.0, 2.16, easeInOut(rsK(0, 2, lt)))], S) + fFull('#24304A', rsOp(0.1 * k));
    return mtShot(t, W, S) + fFull('#24304A', 0.1) + rib(1, 2, (lt - tW - 0.2) / 0.3) + rsVeil(lt, tW, 0.1, 0.35); }
  const MUTE = Object.assign({}, HEAVY, { strip: { s: 0.92, k: 1 }, zex: fEx('z충격'), zlook: [0.8, 0], shake: 0, zstill: true, c: { look: toZ }, x: { look: [0.8, 0] } });
  if (ph === 6) { const st = rsK(0.15, 0.85, lt);
    return mtShot(t, [1560, lerp(604, 580, easeInOut(st)), 1.42], Object.assign({}, MUTE, { b: { stand: st, fold: 1, ex: rsTalk('rs담담', t), look: lt > 1.6 ? [-0.5, -0.1] : toZ, reach: lt > 1.4 } })) + rib(1, 2); }
  const back = easeInOut(rsK(0.1, 1.0, lt));
  return mtShot(t, qLerpCam(lt / 1.8, W, [1000, 588, 1.08]), Object.assign({}, MUTE, { zx: MT.ZX - 46 * back, arm: 0.2 * (1 - back), zlook: [0.5, 0.7], b: { stand: 1, fold: 1, look: [-0.5, -0.1], reach: true }, x: { look: [0.8, 0] } })) + rib(1, 2) + rsVeil(lt, 0, 0.1, 0.35);
}
