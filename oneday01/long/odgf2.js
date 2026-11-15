/* 하루는 작은 일생 편 — 2~5막(청춘·장년·노년·작은 죽음·솔직한 대목·엔딩). odgf.js 다음에 읽는다. 새 이름은 모두 od 접두사.
   기기 화면은 제로 시점(두 손 + 폰)에서만. 메신저는 상표 없는 말풍선. 받은 말의 안 읽음은 빨간 숫자 배지로, 내가 보낸 말의 안 읽음은 옆의 숫자 1로(실제 메신저와 같은 규칙). */
['odstage', 'odkitchen', 'odglobe', 'odcurve', 'odmonth', 'odsnack', 'odoffice', 'odcold', 'odmemory', 'odwalk', 'odevening', 'odsleep', 'oddraft', 'odhonest', 'odend', 'odcredits', 'odask'].forEach(k => CAMS[k] = 'fixed');
Object.assign(GFR, { over: t => gfTransition(t, { k0: ['iris', 1500, 560, 960, 540], n1: ['iris', 960, 540, 1010, 470], p1: 'bands', p5: ['iris', 960, 540, 760, 460], t1: 'bands', a1: ['iris', 960, 540], a3: 'bands', b1: ['iris', 960, 540], b2: 'bands', b4: 'bands', c1: ['iris', 960, 540], c4: 'bands', c7: 'bands', d0: ['iris', 960, 540], d2: 'bands', d3: 'bands', d5: ['iris', 960, 540, 960, 600], m1: 'bands', z1: ['iris', 960, 540], z9: 'bands', z10: 'bands' }) });
const ODZW = o => Z(Object.assign({ vest: '#F4F4F8', vshade: 'rgba(60,70,120,0.15)', collar: true, tie: '#5B6B8C' }, o));                                                // 회사의 제로
const ODS = o => HALO(char(Object.assign({ goggles: 'none', vest: '#FFD3E1', patch: false, tee: true, vshade: 'rgba(160,60,90,0.14)' }, HAIR.bob(GH.choco), o)));        // 서윤
const ODB = o => HALO(char(Object.assign({ goggles: 'none', vest: '#3F4A63', patch: false, tee: true, vshade: 'rgba(0,0,0,0.25)', hair: '#2B2B2B', collar: true, tie: '#8A3A2A' }, o))); // 팀장
const ODV = (col, o) => HALO(char(Object.assign({ goggles: 'none', vest: col, patch: false, tee: true, vshade: 'rgba(0,0,0,0.14)' }, o)));                                // 사장님·참가자
const odTalkEx = (key, base, t) => { E[key] = qTalk(base, env(t)); return fEx(key); };
const odStudy = (lt, t0, text) => gfChipAt(lt, t0, 330, 150, text, { icon: 'flask', size: 40, bg: GFC.sun, rot: -3 });
const odPaperBg = t => gfFull('#FFF3D6') + gfFull('url(#gfDots)') + gfRays(t, 960, 500, 1500, '#fff', 14, 0.3, 5);

/* ===== 단계 카드 ===== */
const OD_ST = [null, ['청춘', '하루의 젊음', '7:00', '#7FE0A8', '#9AEBBE'], ['한창때', '하루의 한낮', '12:00', '#FFD84A', '#FFE680'], ['노년', '하루의 저녁', '17:00', '#FFA36B', '#FFBB8C'], ['잠', '하루의 끝자락', '22:00', '#5B6BC9', '#7280D9']];
odstageScene = function (t, lt, a) {
  const [ti, sub, tm, bg, bg2] = OD_ST[a.n]; let h = gfDefs() + `<rect x="-600" y="-600" width="3120" height="2280" fill="${bg}"/>`;
  for (let i = -8; i < 16; i++) h += `<rect x="${f1(i * 240 + ((t * 40) % 240))}" y="-900" width="120" height="3000" fill="${bg2}" transform="rotate(24 960 540)"/>`;
  h += odAt(960, 500, gfPanel(1180, 520, { r: 44, sw: 9 }), gfIn(lt, 0.05, 2.8, 0.5), -2);
  h += odAt(960, 300 + Math.sin(t * 2.6) * 3, gfChip(tm, { size: 56, bg: GFC.sun, icon: a.n === 4 ? 'moon' : 'clock' }), gfIn(lt, 0.25, 3.2, 0.42), -3);
  h += gfBounceText(lt, 0.4, 840, 500, [[ti, a.n === 4 ? '#5B6BC9' : '#E8742A']], { size: 132, stroke: '#fff', sw: 20, wave: 3 }) + gfBounceText(lt, 0.7, 840, 610, [[sub, GFC.navy]], { size: 54, stroke: '#fff', sw: 10, stagger: 0.03 });
  h += odHaru(1300, 520, 1.5 * gfIn(lt, 0.5, 3, 0.45), t, { age: Math.min(3, a.n), mood: a.n === 4 ? 'sleep' : 'happy', dy: gfHop(lt, 0.9, 40, 0.32).dy });
  h += odLifeBar(t, { x: 960, y: 820, s: 1.1, cur: a.n, tp: 0.9, night: a.n === 4 });
  return h;
};

/* ===== 청춘: 부엌 ===== */
function odKitchen(t, cam, o = {}) {
  let h = gfRoom({ wall: '#E4F6E8', wall2: '#C9EBD2', floor: '#F2D3A0', fy: OD.FY });
  const op = o.open || 0, wx = 1150, wy = 200, ww = 420, wh = 320;
  h += `<rect x="${wx - 14}" y="${wy - 14}" width="${ww + 28}" height="${wh + 28}" rx="26" fill="#fff" stroke="${INK}" stroke-width="8"/><svg x="${wx}" y="${wy}" width="${ww}" height="${wh}"><rect width="${ww}" height="${wh}" fill="url(#gfDawn)"/>${gfSun(300, 120, 44, t)}<g transform="scale(.55)">${gfCloud(((t * 16 + 200) % 1300) - 250, 360, 1)}</g>${gfHill(260, 20, 200, '#8ADB6A', 0, INK)}</svg>`;
  [[wx, 1], [wx + ww, -1]].forEach(([x, sd]) => { const w = (ww / 2) * (1 - 0.82 * op); h += `<g transform="translate(${x} ${wy})"><rect x="${sd > 0 ? 0 : -w}" y="0" width="${f1(w)}" height="${wh}" fill="#DDF3FF" fill-opacity="${f1((0.85 - 0.3 * op) * 100) / 100}" stroke="${INK}" stroke-width="7"/><line x1="${f1(sd * w * 0.5)}" y1="10" x2="${f1(sd * w * 0.5)}" y2="${wh - 10}" stroke="#fff" stroke-width="8" opacity=".6"/></g>`; });
  h += `<rect x="${wx - 26}" y="${wy + wh + 12}" width="${ww + 52}" height="24" rx="10" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
  if (op > 0.05) h += `<path d="M${wx + 40} ${wy + wh} L${wx - 380} ${OD.FY + 120} L${wx + 700} ${OD.FY + 120} L${wx + ww - 40} ${wy + wh} Z" fill="#FFF3B8" opacity="${f1(0.28 * op * 100) / 100}"/>`;
  h += `<rect x="560" y="680" width="420" height="30" rx="12" fill="${GFC.wood}" stroke="${INK}" stroke-width="8"/><rect x="590" y="710" width="26" height="${OD.FY - 710}" fill="${GFC.wood2}" stroke="${INK}" stroke-width="7"/><rect x="924" y="710" width="26" height="${OD.FY - 710}" fill="${GFC.wood2}" stroke="${INK}" stroke-width="7"/>`;
  h += `<rect x="664" y="650" width="70" height="30" rx="8" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M734 658 q18 0 18 10 q0 10 -18 10" fill="none" stroke="${INK}" stroke-width="6"/>` + (o.steam !== false ? [0, 1].map(i => `<path d="M${686 + i * 22} 640 q-10 -18 0 -34 q10 -16 0 -32" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="${f1((0.4 + 0.3 * Math.sin(t * 3 + i)) * 100) / 100}" transform="translate(0 ${f1(-((t * 20 + i * 10) % 14))})"/>`).join('') : '');
  h += gfPlant(1780, OD.FY, 0.9, t) + `<rect x="1010" y="760" width="190" height="24" rx="10" fill="${GFC.coral}" stroke="${INK}" stroke-width="7"/><rect x="1020" y="784" width="20" height="${OD.FY - 784}" fill="${GFC.wood2}" stroke="${INK}" stroke-width="6"/><rect x="1170" y="784" width="20" height="${OD.FY - 784}" fill="${GFC.wood2}" stroke="${INK}" stroke-width="6"/><rect x="1170" y="600" width="24" height="170" rx="10" fill="${GFC.coral}" stroke="${INK}" stroke-width="7"/>`;
  return gfLayer(cam, 0.9, h);
}
const odBook = (x, y, s = 1, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><path d="M0 -6 Q-30 -18 -64 -10 L-64 34 Q-30 26 0 38 Q30 26 64 34 L64 -10 Q30 -18 0 -6 Z" fill="#FFFBF0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M0 -6 L0 38" stroke="${INK}" stroke-width="5"/>${[0, 1, 2].map(i => `<path d="M-52 ${4 + i * 9} Q-30 ${-2 + i * 9} -10 ${4 + i * 9} M10 ${4 + i * 9} Q30 ${-2 + i * 9} 52 ${4 + i * 9}" fill="none" stroke="#C9BFA8" stroke-width="3.5"/>`).join('')}</g>`;
odkitchenScene = function (t, lt, a) {
  const end = a.end; let cam, h = gfDefs(), w = '', fx = '';
  if (!end) {
    const tF = odW(a, '엎어', 1.6), tW = odW(a, '창문', 2.6), t30 = odW(a, '30', 4.4), tB = odW(a, '읽다', 6.0);
    cam = qLerpCam(lt / (a._dur || 7), [960, 540, 1.25], [930, 540, 1.32]);
    const open = easeInOut(gfK(tW, tW + 0.6, lt)), sit = lt > tB - 0.3;
    if (!sit) { const x = lt < tW - 0.2 ? 760 : lerp(760, 1120, easeInOut(gfK(tW - 0.2, tW + 0.3, lt))), wk = lt > tW - 0.2 && lt < tW + 0.3 ? gfWalk(x, 0.8) : null;
      w += gfActor(Z, { x, y: OD.FY, s: 0.85, t, pose: wk ? wk.pose : lt < tF ? '폰보기' : lt > tW ? '만세' : '서기', ex: fEx(lt > tW ? 'z반짝' : 'z기본'), look: lt > tW - 0.3 ? [0.7, -0.4] : [-0.2, 0.5], seed: 3 }, lt > tW + 0.3 ? gfHop(lt, tW + 0.3, 26, 0.3) : wk ? { sy: wk.sy, dy: wk.dy } : {});
      if (lt < tF) { const hd = gfHand(760, OD.FY, 0.85, [200, 322]); w += odPhone(hd[0], hd[1] - 16, 0, 0.85); } }
    else { const x = 1080, y = 760 + 150 * 0.85; w += Z({ x, y, s: 0.85, t, pose: Object.assign({}, P['f앉기'], { armL: P['폰보기'].armL, hL: P['폰보기'].hL, armR: P['폰보기'].armR, hR: P['폰보기'].hR }), ex: fEx('z빵긋'), look: [-0.1, 0.5], seed: 3 });
      const hd = gfHand(x, y, 0.85, [200, 322]); w += odBook(hd[0], hd[1] - 6, 1.1 * gfIn(lt, tB - 0.3, 3, 0.45)); fx += gfEmote(lt, tB + 0.2, x + 60, y - 470, 'note', { hold: 3 }); }
    const ph = lt < tF ? '' : `<g transform="translate(860 ${f1(672 - 24 * Math.max(0, 1 - gfK(tF, tF + 0.25, lt)))}) scale(${f1(gfJelly(lt, tF + 0.25, 0.2).sx * 100) / 100} 1)"><rect x="-38" y="-8" width="76" height="16" rx="6" fill="#2B3654" stroke="${INK}" stroke-width="5"/></g>`;
    fx += gfPlus(lt, tF + 0.25, 860, 600, '엎어 두기', { size: 38, col: GFC.mint }) + gfStarBurst(lt, tW + 0.1, 1360, 360, { r1: 260, cols: [GFC.sun, '#fff'] }) + gfChipAt(lt, t30, 520, 300, '첫 30분 · 내 것', { icon: 'clock', size: 42, bg: '#D8F5C8', rot: -3 });
    h += odKitchen(t, cam, { open }) + qCam(cam, ph + w + odHaru(1360, 474, 1, t, { age: 1, mood: 'happy', dy: gfHop(lt, tW + 0.2, 40, 0.3).dy }) + fx);
  } else {
    cam = qLerpCam(lt / (a._dur || 3), [1060, 560, 1.5], [1060, 540, 1.58]); const x = 1080, y = 760 + 150 * 0.85;
    w = Z({ x, y, s: 0.85, t, pose: Object.assign({}, P['f앉기'], { armL: P['폰보기'].armL, hL: P['폰보기'].hL, armR: P['폰보기'].armR, hR: P['폰보기'].hR }), ex: odTalkEx('_odz', 'z빵긋', t), look: [0.4, -0.1], seed: 3 }) + odBook(gfHand(x, y, 0.85, [200, 322])[0], gfHand(x, y, 0.85, [200, 322])[1] - 6, 1.1);
    h += odKitchen(t, cam, { open: 1 }) + qCam(cam, w + odHaru(1360, 474, 1, t, { age: 1, mood: 'happy' }) + gfEmote(lt, 0.3, x + 70, y - 480, 'spark', { hold: 3 }));
  }
  return h + odLifeBar(t, { cur: 1, s: 1.2 });
};
/* 지구본 + 말풍선 */
odglobeScene = function (t, lt, a) {
  const t84 = odW(a, '84', 2.2), t240 = odW(a, '240', 3.2), tTm = odW(a, '시간대별로', (a._dur || 7) - 1.6);
  let h = gfDefs() + odPaperBg(t) + odStudy(lt, 0.3, '2011 · 미국 코넬대');
  const gk = gfIn(lt, 0.4, 2.8, 0.5), R = 230, cx = 960, cy = 520;
  let g = `<circle r="${R}" fill="#8FD3FF" stroke="${INK}" stroke-width="9"/><g transform="rotate(${f1(t * 12)})"><clipPath id="odGlobeC"><circle r="${R - 4}"/></clipPath><g clip-path="url(#odGlobeC)">` +
    [[-90, -60, 90, 60], [60, -100, 70, 50], [100, 60, 80, 70], [-60, 110, 70, 40], [-180, 30, 50, 80], [180, -20, 60, 70]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${GFC.grass}" stroke="${INK}" stroke-width="5"/>`).join('') + `</g></g><ellipse cx="-80" cy="-110" rx="60" ry="30" fill="#fff" opacity=".35"/>`;
  h += odAt(cx, cy, g, gk);
  for (let i = 0; i < 16; i++) { const t0 = t84 + i * 0.12, k = gfIn(lt, t0, 3.4, 0.45); if (k < 0.02) continue; const ang = i * 2.39 + 0.4, r = R + 70 + (i % 3) * 46, x = cx + Math.cos(ang) * r * 1.4, y = cy + Math.sin(ang) * r * 0.85;
    h += odAt(x, y + Math.sin(t * 2 + i) * 4, `<rect x="-38" y="-26" width="76" height="52" rx="18" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M-10 26 L-18 40 L4 26 Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="-22" y="-6" width="44" height="7" rx="3" fill="#D9CDB0"/>` + (i % 4 === 0 ? `<g transform="translate(22 -24) scale(.45)">${GF_ICON.heart()}</g>` : ''), k * 0.9); }
  h += gfChipAt(lt, t84, 420, 860, '84개국', { icon: 'flag', size: 48, bg: '#fff', rot: -3 }) + gfChipAt(lt, t240, 1500, 860, '240만 명', { icon: 'family', size: 48, bg: '#fff', rot: 3 });
  if (lt > tTm - 0.2) { const k = easeInOut(gfK(tTm - 0.2, tTm + 0.8, lt)); h += `<path d="M${cx - 330} ${cy} A330 330 0 0 1 ${f1(cx + 330 * Math.cos(Math.PI - Math.PI * k))} ${f1(cy - 330 * Math.sin(Math.PI * k))}" fill="none" stroke="${GFC.sun}" stroke-width="16" stroke-linecap="round" stroke-dasharray="2 26"/>` + odAt(cx - 330, cy - 10, gfIcon('sun', 1.0, t), gfIn(lt, tTm - 0.2, 3, 0.45)) + odAt(cx + 330, cy - 10, gfIcon('moon', 1.0, t), gfIn(lt, tTm + 0.6, 3, 0.45)); }
  return h;
};
/* 하루 기분 곡선(숫자 없음) */
const odMoodY = x => 0.82 - 0.6 * Math.exp(-((x - 0.12) ** 2) / 0.006) - 0.42 * Math.exp(-((x - 0.92) ** 2) / 0.012) + 0.08 * Math.sin(x * 5) * 0; // 0(위)~1(아래)
function odCurvePanel(t, prog, o = {}) {
  const W2 = 1240, H2 = 470, x0 = -W2 / 2 + 60, x1 = W2 / 2 - 40, yT = -H2 / 2 + 40, yB = H2 / 2 - 70, shift = o.shift || 0;
  let s = gfPanel(W2, H2, { head: o.head || '하루 동안의 좋은 기분', headBg: GFC.sun }) + `<line x1="${x0}" y1="${yB}" x2="${x1}" y2="${yB}" stroke="${INK}" stroke-width="6"/>`;
  [['dusk', 0.05], ['sun', 0.4], ['dusk', 0.78], ['moon', 0.98]].forEach(([ic, p], i) => { const x = lerp(x0, x1, p); s += `<g transform="translate(${f1(x)} ${yB + 40})">${i === 0 ? odSlotIcon('sprout', t) : gfIcon(ic, 0.7, t)}</g>`; });
  const pts = (sh, n) => { let d = ''; for (let i = 0; i <= n; i++) { const p = i / 60, y = lerp(yT, yB, odMoodY(clamp(p - sh, 0, 1) + (p < sh ? -0.2 : 0))); d += (i ? 'L' : 'M') + f1(lerp(x0, x1, p)) + ' ' + f1(y); } return d; };
  if (o.ghost) s += `<path d="${pts(0, 60)}" fill="none" stroke="#C9C2B0" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 16"/>`;
  const n = Math.max(1, Math.round(60 * clamp(prog, 0, 1))); s += `<path d="${pts(shift, n)}" fill="none" stroke="${o.col || GFC.coral}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
  const pe = n / 60, ye = lerp(yT, yB, odMoodY(clamp(pe - shift, 0, 1) + (pe < shift ? -0.2 : 0)));
  if (o.dot !== false) s += `<g transform="translate(${f1(lerp(x0, x1, pe))} ${f1(ye)})">${gfFace(1 - odMoodY(clamp(pe - shift, 0, 1)), 30)}</g>`;
  return s;
}
odcurveScene = function (t, lt, a) {
  const tM = odW(a, '아침에', 1.0), tD = odW(a, '낮', 2.6), tE = odW(a, '저녁에', 4.0), D2 = a._dur || 5;
  const prog = lt < tM ? 0.12 * gfK(0.2, tM, lt) : lt < tE ? lerp(0.12, 0.7, gfK(tM, tE, lt)) : lerp(0.7, 1, gfK(tE, D2 - 0.3, lt));
  let h = gfDefs() + odPaperBg(t) + odAt(960, 470, odCurvePanel(t, prog), gfIn(lt, 0.1, 2.8, 0.5));
  const x0 = 960 - 560;
  h += gfStarBurst(lt, tM + 0.2, x0 + 0.12 * 1140, 470 - 235 + 50, { r1: 160 }) + gfChipAt(lt, tM + 0.2, x0 + 0.12 * 1140 + 60, 230, '가장 높음', { size: 36, bg: GFC.sun });
  if (lt > tD) h += gfChipAt(lt, tD, 960, 760, '낮 동안 ↓', { size: 36, bg: '#DDE3F0' });
  if (lt > tE) h += gfChipAt(lt, tE, 1420, 300, '저녁에 다시 ↑', { size: 36, bg: '#FFE1C9' });
  return h;
};

/* ===== 장년 ===== */
odmonthScene = function (t, lt, a) {
  let h = gfDefs() + odPaperBg(t);
  if (!a.ph) {
    const tOne = odW(a, '한', 2.0), tYr = odW(a, '2018', 3.2), t4 = odW(a, '4주', 6.5), tL = odW(a, '마지막', (a._dur || 11) - 2.6);
    if (lt < tYr - 0.3) { // 오늘 점심도 한 번뿐
      const k = 1.5 * gfIn(lt, 0.2, 3, 0.45); h += odAt(960, 470, `<ellipse cx="0" cy="40" rx="230" ry="70" fill="#fff" stroke="${INK}" stroke-width="8"/><ellipse cx="0" cy="26" rx="170" ry="44" fill="#FF8A5B" stroke="${INK}" stroke-width="6"/>` + [[-60, 10], [0, 20], [60, 8], [-20, -4], [40, -6]].map(([x, y]) => `<rect x="${x - 26}" y="${y - 9}" width="52" height="18" rx="9" fill="#FFB3A0" stroke="${INK}" stroke-width="4" transform="rotate(${x / 3} ${x} ${y})"/>`).join(''), k);
      h += odAt(1220, 330, `<circle r="70" fill="${GFC.coral}" stroke="${INK}" stroke-width="8"/>` + gfT(0, 28, '1', 86, '#fff'), gfIn(lt, tOne, 3.4, 0.45)) + gfChipAt(lt, tOne + 0.2, 960, 720, '오늘 점심 · 한 번뿐', { size: 50, bg: GFC.sun });
    } else {
      h += `<rect x="-600" y="${OD.FY}" width="3120" height="800" fill="#F4DC9E"/>` + odStudy(lt, tYr, '2018 · 미국 · 대학생 139명');
      let cal = gfPanel(560, 470, { head: '이번 달', headBg: '#FFE1C9' }); for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) { const i = r * 7 + c, on = lt > t4 + i * 0.03; cal += `<rect x="${-230 + c * 66}" y="${-150 + r * 80}" width="54" height="64" rx="10" fill="${on ? '#FFF0A6' : '#fff'}" stroke="${INK}" stroke-width="4"/>`; }
      if (lt > tL) cal += `<rect x="-262" y="-222" width="524" height="444" rx="24" fill="none" stroke="#E5484D" stroke-width="12" opacity="${f1(gfK(tL, tL + 0.3, lt) * 100) / 100}"/>`;
      h += odAt(1250, 470, cal, gfIn(lt, tYr + 0.2, 3, 0.45) * (lt > tL ? gfBeat(lt, tL, 0.1, 3, 6) : 1), 2) + gfChipAt(lt, t4, 1250, 790, '4주', { size: 46, bg: '#fff', icon: 'calendar' });
      [0, 1, 2].forEach(i => { h += gfActor(o => ODV(['#BFE8D2', '#D9C7E8', '#C9E3F7'][i], o), { x: 380 + i * 170, y: OD.FY, s: 0.7, t, pose: '서기', ex: fEx(lt > tL ? 'z반짝' : 'z기본'), look: [0.7, -0.2], seed: 30 + i }, gfHop(lt, tL + i * 0.12, 30, 0.3)); });
      h += gfChipAt(lt, tL + 0.3, 550, 330, '마지막 한 달처럼', { size: 46, bg: '#FFE1C9', icon: 'heart', rot: -3 });
    }
    return h;
  }
  const tB = odW(a, '행복감이', 1.6), tS = odW(a, '작았지만요', (a._dur || 4) - 1.0), gk = gfK(tB - 0.2, tB + 0.8, lt);
  let p = gfPanel(1100, 420, { head: '4주 뒤, 행복감', headBg: GFC.sun });
  p += gfT(-500, -46, '하루 일과만 적은 쪽', 40, GFC.navy, { anchor: 'start' }) + `<g transform="translate(-500 6)">${gfBar(700, 0.5 * gk, { h: 46, col: '#B9C2D6' })}</g>`;
  p += gfT(-500, 104, '마지막 한 달처럼 지낸 쪽', 40, GFC.navy, { anchor: 'start' }) + `<g transform="translate(-500 156)">${gfBar(700, 0.62 * gk, { h: 46, col: '#FF9A55' })}</g>`;
  h += odAt(960, 460, p, 1.15 * gfIn(lt, 0.1, 2.8, 0.5)) + gfChipAt(lt, tS, 1340, 800, '차이는 작다', { icon: 'pin', size: 44, bg: '#DDE3F0', rot: 3 }) + gfChipAt(lt, tB + 0.9, 600, 800, '숫자 없이 크기만 비교', { size: 30, bg: '#fff' });
  return h;
};
/* 분식집 */
function odSnackSet(t, cam, warm) {
  let h = gfFull(gfMix('#FFF1D6', '#FFE2B8', warm)) + gfFull('url(#gfDots)');
  h += `<rect x="-600" y="${OD.FY}" width="3120" height="800" fill="#E9C9A0"/><rect x="-600" y="${OD.FY}" width="3120" height="22" fill="#FFF3D6" stroke="${INK}" stroke-width="6"/>`;
  h += [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${380 + i * 150} 30 L${455 + i * 150} 30 L${455 + i * 150} 100 Q${417 + i * 150} 128 ${380 + i * 150} 100 Z" fill="${i % 2 ? '#fff' : '#FF7A6B'}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`).join('');
  h += `<rect x="1460" y="200" width="300" height="300" rx="18" fill="#FFFBF0" stroke="${INK}" stroke-width="7"/>` + ['떡볶이', '어묵', '김밥', '순대'].map((m, i) => gfT(1610, 262 + i * 64, m, 40, GFC.navy)).join('');
  let c = `<rect x="400" y="640" width="1120" height="60" rx="16" fill="${GFC.wood}" stroke="${INK}" stroke-width="8"/><rect x="430" y="700" width="1060" height="${OD.FY - 700}" fill="${GFC.wood2}" stroke="${INK}" stroke-width="8"/>`;
  c += `<rect x="1180" y="560" width="220" height="90" rx="14" fill="#C9D1DB" stroke="${INK}" stroke-width="7"/><rect x="1196" y="572" width="188" height="40" rx="10" fill="#FF7A4B" stroke="${INK}" stroke-width="5"/>` + [0, 1].map(i => `<path d="M${1240 + i * 70} 556 q-10 -22 0 -40 q10 -18 0 -38" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".6" transform="translate(0 ${f1(-((t * 22 + i * 12) % 16))})"/>`).join('');
  return { back: gfLayer(cam, 0.95, h), counter: gfLayer(cam, 0.95, c) };
}
const odDish = (x, y, extra) => `<g transform="translate(${f1(x)} ${f1(y)})"><ellipse cx="0" cy="8" rx="120" ry="34" fill="#fff" stroke="${INK}" stroke-width="7"/><ellipse cx="0" cy="0" rx="92" ry="22" fill="#FF6A3D" stroke="${INK}" stroke-width="5"/>${[[-40, -2], [-6, 4], [30, -4], [56, 2]].map(([a1, b1]) => `<rect x="${a1 - 20}" y="${b1 - 8}" width="40" height="16" rx="8" fill="#FFB3A0" stroke="${INK}" stroke-width="4"/>`).join('')}${extra || ''}</g>`;
const odSkewer = (k, dy = 0) => k < 0.02 ? '' : `<g transform="translate(10 ${f1(-24 - dy)}) rotate(-14) scale(${f1(k * 100) / 100})"><line x1="0" y1="-70" x2="0" y2="40" stroke="${GFC.wood2}" stroke-width="7" stroke-linecap="round"/><path d="M-26 -50 Q0 -64 26 -50 Q32 -30 20 -20 Q30 -6 22 8 Q0 18 -22 8 Q-30 -6 -20 -20 Q-32 -30 -26 -50 Z" fill="#F2C27A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>`;
odsnackScene = function (t, lt, a) {
  const ph = a.ph, tLast = ph === 0 ? odW(a, '마지막인', 1.6) : -9, warm = ph === 0 ? easeInOut(gfK(tLast + 0.3, tLast + 0.9, lt)) : 1;
  const cam = ph === 1 ? qLerpCam(lt / 2, [960, 600, 1.55], [960, 610, 1.7]) : ph === 2 ? qLerpCam(lt / 3, [900, 560, 1.3], [900, 550, 1.36]) : qLerpCam(lt / 4, [960, 560, 1.12], [930, 560, 1.22]);
  const zx = 760, owner = gfActor(o => ODV('#FFE2A8', o), { x: 1180, y: OD.FY, s: 0.95, t, pose: '서기', ex: fEx(ph === 2 ? 'z빵긋' : 'z기본'), look: [-0.6, 0.2], seed: 41 }, ph === 1 ? gfHop(lt, 0.4, 16, 0.3) : {});
  const apron = `<path d="M1140 ${OD.FY - 250} L1220 ${OD.FY - 250} L1236 ${OD.FY - 90} L1124 ${OD.FY - 90} Z" fill="#fff" stroke="${INK}" stroke-width="5" opacity=".92"/>`;
  const zz = gfActor(Z, { x: zx, y: OD.FY, s: 0.95, t, pose: '서기', ex: ph === 2 ? odTalkEx('_ods', 'z충격', t) : fEx(ph === 1 ? 'z반짝' : lt > tLast ? 'z결심' : 'z기본'), look: [0.6, -0.1], seed: 3 }, ph === 2 ? gfJelly(lt, 0.1, 0.1) : {});
  const k1 = ph === 1 ? gfK(0.3, 0.9, lt) : ph === 2 ? 1 : 0, sk = ph === 0 ? 0 : 1, drop = ph === 1 ? 60 * (1 - easeOut(gfK(0.3, 0.8, lt))) : 0;
  let world = odDish(960, 640, odSkewer(sk * (ph === 1 ? gfIn(lt, 0.3, 3, 0.4) : 1), drop)) + zz;
  if (warm > 0.05) [[1050, 520, '그리워질 것'], [1290, 470, '그리워질 것']].forEach(([x, y, tx], i) => { world += gfChipAt(lt, ph === 0 ? tLast + 0.5 + i * 0.2 : -1, x, y, tx, { size: 30, bg: '#FFF0A6', icon: 'spark', rot: i % 2 ? 3 : -3 }); });
  world += gfEmote(lt, ph === 1 ? 0.9 : 99, 1000, 470, 'heart', { hold: 1.4, s: 1.1 }) + gfStarBurst(lt, ph === 1 ? 0.85 : 99, 980, 600, { r1: 160 }) + (ph === 2 ? gfEmote(lt, 1.2, 1240, OD.FY - 560 * 0.95, 'heart', { hold: 2 }) + gfEmote(lt, 0.1, zx + 40, OD.FY - 560, 'bang', { hold: 0.9 }) : '');
  world += odHaru(1460, 588, 0.85, t, { age: 2, mood: 'happy' });
  const set = odSnackSet(t, cam, warm); let h = gfDefs() + set.back + qCam(cam, owner + apron) + set.counter + qCam(cam, world) + odTint('#FFB46A', 0.12 * warm);
  if (ph === 0 && lt > tLast - 0.1) h += odAt(1500, 860, gfChip('마지막이라면', { size: 44, bg: GFC.mint, icon: 'heart' }), gfIn(lt, tLast - 0.1, 3.4, 0.45) * (lt > tLast + 0.25 && lt < tLast + 0.4 ? 0.9 : 1)) + gfRing(lt, tLast + 0.3, 1500, 860, 30, 220, GFC.mint);
  return h + odLifeBar(t, { cur: 2, s: 1.2 });
};

/* ===== 노년 ===== */
function odOffice(t, cam) { let h = gfRoom({ wall: '#E6EEFF', wall2: '#D3DEFA', floor: '#C9D3E8', fy: OD.FY }); h += gfWindow(1380, 210, 420, 300, t, { sky: 'gfDusk' }) + gfDesk(330, OD.FY, 1.2) + gfPlant(1820, OD.FY, 0.9, t) + gfClock(1080, 260, 54, 17, 0); return gfLayer(cam, 0.9, h); }
odofficeScene = function (t, lt, a) {
  const ph = a.ph, cam = ph === 0 ? qLerpCam(lt / 3, [1000, 560, 1.15], [1000, 550, 1.22]) : qLerpCam(lt / 1.5, [880, 520, 1.5], [870, 520, 1.58]);
  const bx = 1220, zx = 760, give = ph === 0 ? gfK(0.6, 1.2, lt) : 1;
  const boss = gfActor(ODB, { x: bx, y: OD.FY, s: 0.95, t, pose: '서기', ex: ph === 0 ? odTalkEx('_odb', 'z기본', t) : fEx('z기본'), look: [-0.8, 0.1], seed: 51 });
  const zero = gfActor(ODZW, { x: zx, y: OD.FY, s: 0.95, t, pose: '서기', ex: ph === 1 ? odTalkEx('_odz2', 'z멍', t) : fEx(give > 0.9 ? 'z당황' : 'z기본'), look: [0.8, 0.1], seed: 3 }, ph === 1 ? { sy: 1 - 0.04 * gfK(0, 0.4, lt) } : {});
  const px = lerp(bx - 110, zx + 110, easeInOut(give)), py = OD.FY - 300;
  let w = boss + zero + `<g transform="translate(${f1(px)} ${f1(py)}) rotate(${f1(-6 + 8 * give)})"><rect x="-60" y="-80" width="120" height="160" rx="10" fill="#fff" stroke="${INK}" stroke-width="6"/>${[0, 1, 2, 3].map(i => `<rect x="-40" y="${-50 + i * 30}" width="${70 - (i % 2) * 20}" height="9" rx="4" fill="#C9D1DB"/>`).join('')}<circle cx="34" cy="50" r="16" fill="none" stroke="#E5484D" stroke-width="6"/></g>`;
  const top = gfAbove(zx, OD.FY, 0.95, 0, 0);
  if (ph === 1) w += gfEmote(lt, 0.2, top[0] + 60, top[1] + 30, 'gloom', { hold: 9 });
  let h = gfDefs() + odOffice(t, cam) + qCam(cam, w);
  if (ph === 1) { let g = gfPanel(420, 230, { head: '오늘', headBg: '#FFE1C9' }) + `<path d="M-170 -10 L-90 -40 L-20 -20 L60 60" fill="none" stroke="${GFC.coral}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>` + odAt(60, 60, `<path d="M0 0 L0 -50" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="-58" r="16" fill="#E5484D" stroke="${INK}" stroke-width="5"/>`, gfIn(lt, 0.35, 4, 0.4));
    h += odAt(1500, 260, g, gfIn(lt, 0.15, 3, 0.45)) + gfChipAt(lt, 0.5, 1500, 430, '가장 힘든 순간', { size: 32, bg: '#FFD6D6' }); }
  return h + odLifeBar(t, { cur: 3, s: 1.2 });
};
/* 찬물 실험 */
function odBasin(x, y, o) { const fill = o.col || '#7FC8FF'; let s = `<g transform="translate(${x} ${y})"><path d="M-170 -60 L170 -60 L140 70 Q0 96 -140 70 Z" fill="#E9F3FF" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M-160 -30 L160 -30 L136 60 Q0 84 -136 60 Z" fill="${fill}"/><ellipse cx="0" cy="-60" rx="170" ry="22" fill="#F4F9FF" stroke="${INK}" stroke-width="7"/>`;
  s += `<g transform="translate(200 -40)"><rect x="-14" y="-120" width="28" height="150" rx="14" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="40" r="24" fill="#5AA9FF" stroke="${INK}" stroke-width="6"/><rect x="-6" y="${f1(-100 + 70 * (1 - (o.temp || 0)))}" width="12" height="${f1(130 - 70 * (1 - (o.temp || 0)))}" rx="6" fill="#5AA9FF"/></g>`;
  if (o.hand) s += `<g transform="translate(-20 ${f1(-120 + 70 * o.hand)})"><rect x="-34" y="-90" width="68" height="120" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/></g>`;
  return s + `</g>`; }
function odTimer(x, y, w60, w30, k1, k2, o = {}) { let s = `<g transform="translate(${x} ${y})"><rect x="0" y="-26" width="${w60 + w30 + 8}" height="52" rx="26" fill="#EDE8DD" stroke="${INK}" stroke-width="5"/>`;
  s += `<rect x="4" y="-21" width="${f1(Math.max(0, w60 * k1))}" height="42" rx="21" fill="#4D9DFF"/>` + (w30 ? `<rect x="${4 + w60}" y="-21" width="${f1(Math.max(0, w30 * k2))}" height="42" rx="21" fill="#9BD3FF"/>` : '');
  s += gfT(w60 / 2, 12, '60초', 30, '#fff') + (w30 && k2 > 0.5 ? gfT(w60 + w30 / 2, 12, '+30초', 28, GFC.navy) : '') + `</g>`; return s; }
odcoldScene = function (t, lt, a) {
  let h = gfDefs() + odPaperBg(t);
  if (!a.ph) {
    const t14 = odW(a, '14', 4.4), tB = odW(a, '똑같이', 6.8), tL = odW(a, '덜', 8.6), tA = t14 + 0.4;
    h += odStudy(lt, 0.3, '1993 · 카너먼 연구팀');
    h += odAt(560, 560, odBasin(0, 0, { temp: 0.1, hand: gfK(tA, tA + 0.4, lt) }), 1.25 * gfIn(lt, 0.6, 3, 0.45)) + gfChipAt(lt, t14, 560, 330, '14°C', { size: 46, bg: '#D6ECFF', icon: 'rain' });
    h += odAt(560, 790, odTimer(-130, 0, 260, 0, gfK(tA, tA + 1.6, lt), 0), 1.2 * gfIn(lt, t14, 3, 0.45));
    h += odAt(1360, 560, odBasin(0, 0, { temp: lt > tL ? 0.35 : 0.1, col: lt > tL ? '#A8DCFF' : '#7FC8FF', hand: gfK(tB, tB + 0.4, lt) }), 1.25 * gfIn(lt, 1.0, 3, 0.45)) + gfChipAt(lt, tL, 1360, 330, '조금 덜 차갑게', { size: 40, bg: '#E8F6FF' });
    h += odAt(1360, 790, odTimer(-190, 0, 260, 130, gfK(tB, tB + 1.3, lt), gfK(tL, tL + 1.0, lt)), 1.2 * gfIn(lt, tB, 3, 0.45));
    h += gfChipAt(lt, 0.7, 560, 920, 'A', { size: 44, bg: '#fff' }) + gfChipAt(lt, 1.1, 1360, 920, 'B', { size: 44, bg: '#fff' });
    return h;
  }
  const tQ = odW(a, '묻자', 1.4), t22 = odW(a, '22', 3.0), tE = odW(a, '끝이', (a._dur || 7) - 1.6), mv = easeInOut(gfK(t22, t22 + 1.2, lt));
  h += odAt(560, 330, gfChip('A · 60초', { size: 40, bg: '#D6ECFF' })) + odAt(1360, 330, gfChip('B · 60초 + 30초', { size: 40, bg: '#E8F6FF' }));
  for (let i = 0; i < 32; i++) { const toB = i < 22, c0 = [700 + (i % 8) * 74, 440 + Math.floor(i / 8) * 80], c1 = toB ? [1110 + (i % 6) * 80, 420 + Math.floor(i / 6) * 80] : [330 + (i - 22) % 5 * 80, 460 + Math.floor((i - 22) / 5) * 80], p = clamp(mv * 1.6 - i * 0.02, 0, 1), x = lerp(c0[0], c1[0], easeInOut(p)), y = lerp(c0[1], c1[1], easeInOut(p)) - Math.sin(Math.PI * p) * 60;
    h += odAt(x, y, `<circle r="27" fill="${p > 0.95 ? (toB ? '#9BD3FF' : '#C9C2B0') : '#fff'}" stroke="${INK}" stroke-width="5"/><circle cx="-6" cy="-3" r="3" fill="${INK}"/><circle cx="6" cy="-3" r="3" fill="${INK}"/>`, gfIn(lt, 0.1 + i * 0.015, 3.4, 0.45)); }
  h += gfChipAt(lt, tQ, 960, 860, '어느 쪽을 다시 할래요?', { size: 40, bg: '#fff', icon: 'pin' }) + (lt > t22 + 1.2 ? gfChipAt(lt, t22 + 1.2, 1360, 780, '22명', { size: 54, bg: GFC.sun }) + gfChipAt(lt, t22 + 1.3, 560, 780, '10명', { size: 44, bg: '#EDE8DD' }) : '');
  if (lt > tE) h += gfChipAt(lt, tE, 1360, 210, '끝이 덜 차가웠다', { size: 40, bg: '#A8DCFF', icon: 'heart', rot: 3 });
  return h;
};
/* 기억 점수판 */
odmemoryScene = function (t, lt, a) {
  const tLen = odW(a, '길이', 1.0), tLow = odW(a, '힘든', 2.0), tEnd = odW(a, '끝으로', 3.2);
  let h = gfDefs() + odPaperBg(t);
  const pts = [[-480, -40], [-360, -90], [-240, 30], [-120, 150], [0, 40], [120, 90], [240, -20], [360, 60], [480, 120]], d = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ');
  let p = gfPanel(1200, 470, { head: '기억에 남는 하루', headBg: GFC.sun }) + `<line x1="-520" y1="200" x2="520" y2="200" stroke="${INK}" stroke-width="5"/>`;
  const fade = gfK(tLen, tLen + 0.5, lt); p += `<path d="${d}" fill="none" stroke="${gfMix(GFC.coral, '#C9C2B0', fade)}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" ${fade > 0.5 ? 'stroke-dasharray="4 16"' : ''}/>`;
  if (lt > tLen) p += `<g opacity="${f1(fade * 100) / 100}"><line x1="-480" y1="${f1(220)}" x2="480" y2="220" stroke="#8D93A6" stroke-width="7"/><line x1="-480" y1="${f1(220)}" x2="480" y2="220" stroke="#E5484D" stroke-width="9" stroke-dasharray="1200" stroke-dashoffset="${f1(1200 * (1 - gfK(tLen + 0.3, tLen + 0.8, lt)))}"/></g>` + gfT(0, 260 - 4, '길이', 30, '#8D93A6');
  const pin = (x, y, col, tt, lab) => lt < tt ? '' : odAt(x, y, `<path d="M0 0 L0 -60" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="-70" r="22" fill="${col}" stroke="${INK}" stroke-width="6"/>`, gfIn(lt, tt, 4, 0.4)) + odAt(x, y - 130, gfChip(lab, { size: 30, bg: '#fff' }), gfIn(lt, tt + 0.1, 3.4, 0.45));
  p += pin(-120, 150, '#E5484D', tLow, '가장 힘든 순간') + pin(480, 120, GFC.sun, tEnd, '끝');
  return h + odAt(960, 470, p, gfIn(lt, 0.1, 2.8, 0.5)) + gfRing(lt, tEnd, 960 + 480, 470 + 120 - 70, 20, 140, GFC.sun);
};
/* 퇴근길 */
function odDusk(t, cam) { let far = gfFull('url(#gfDusk)') + gfSun(1600, 430, 70, t) + gfClouds(t, 120, 3, 3, 10, 0.8) + gfHill(640, 80, 760, '#F2B48A', 0) + gfHill(720, 60, 520, '#E89A7A', 300);
  let mid = [200, 560, 1300, 1700].map((x, i) => `<rect x="${x}" y="${470 + (i % 2) * 60}" width="${180 + (i % 2) * 40}" height="${430 - (i % 2) * 60}" rx="10" fill="${['#8C7AB8', '#A38BC4', '#7B6BA8', '#9C86C0'][i]}" stroke="${INK}" stroke-width="7"/>` + [0, 1, 2].map(r => [0, 1].map(c => `<rect x="${x + 30 + c * 70}" y="${510 + (i % 2) * 60 + r * 90}" width="44" height="50" rx="6" fill="#FFE29A" opacity=".85"/>`).join('')).join('')).join('');
  mid += `<rect x="1020" y="520" width="14" height="380" fill="#5B6B8C" stroke="${INK}" stroke-width="5"/><path d="M1027 520 Q1027 480 1080 480" fill="none" stroke="${INK}" stroke-width="10"/><circle cx="1090" cy="488" r="22" fill="#FFF3B8" stroke="${INK}" stroke-width="6"/>`;
  const near = `<rect x="-700" y="${OD.FY}" width="3400" height="700" fill="#C9B8D9" stroke="${INK}" stroke-width="7"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${-200 + i * 520 - ((t * 0) % 520)}" y="${OD.FY + 50}" width="260" height="14" rx="7" fill="#fff" opacity=".35"/>`).join('');
  return gfLayer(cam, 0.35, far) + gfLayer(cam, 0.7, mid) + gfLayer(cam, 1, near); }
odwalkScene = function (t, lt, a, run) {
  const ph = a.ph, cam = ph === 0 ? qLerpCam(lt / 6, [960, 560, 1.12], [990, 560, 1.18]) : qLerpCam(lt / 3, [1000, 540, 1.38], [1000, 530, 1.44]);
  const walking = ph === 0 && lt < (a._dur || 6) - 0.4, zx = ph === 0 ? lerp(620, 860, Math.min(1, lt / ((a._dur || 6) - 0.4))) : 860, sx = zx + 300;
  const wz = walking ? gfWalk(zx * 3, 0.7) : null, ws = walking ? gfWalk(zx * 3 + 30, 0.7) : null;
  const zEx = ph === 1 ? odTalkEx('_odw', 'z빵긋', t) : fEx(ph === 2 ? 'z빵긋' : 'z기본');
  const sEx = ph === 2 ? odTalkEx('_ods2', lt < 0.4 ? 'z충격' : 'z빵긋', t) : fEx(ph === 1 ? 'z기본' : 'z기본');
  let w = gfActor(ODZW, { x: zx, y: OD.FY, s: 0.9, t, pose: wz ? wz.pose : '서기', ex: zEx, look: ph >= 1 ? [0.8, -0.1] : [0.6, 0], seed: 3 }, wz ? { sy: wz.sy, dy: wz.dy } : {});
  w += gfActor(ODS, { x: sx, y: OD.FY, s: 0.84, t, pose: ws ? ws.pose : '서기', ex: sEx, look: ph >= 1 ? [-0.8, -0.1] : [0.6, 0], seed: 61 }, ws ? { sy: ws.sy, dy: ws.dy } : ph === 2 ? gfHop(lt, 0.45, 40, 0.34) : {});
  w += odHaru(zx - 230, OD.FY - 70, 0.9, t, { age: 3, mood: 'happy', dy: walking ? Math.abs(Math.sin(lt * 6)) * 10 : 0 });
  if (ph === 2) { const tp = gfAbove(sx, OD.FY, 0.84, 0, 0); w += gfEmote(lt, 0.05, tp[0] + 40, tp[1] + 30, 'bang', { hold: 0.5 }) + gfEmote(lt, 0.7, tp[0] + 50, tp[1] + 20, 'heart', { hold: 2.5 }); }
  let h = gfDefs() + odDusk(t, cam) + qCam(cam, w);
  if (ph === 0) h += gfChipAt(lt, odW(a, '10분', 0.9), 400, 200, '퇴근길 10분', { icon: 'clock', size: 44, bg: '#FFE1C9', rot: -3 });
  const fk = ph === 0 ? gfIn(lt, odW(a, '장면', 3.6), 3, 0.45) : 1, filled = ph === 2 && lt > 0.7;
  h += odAt(1500, 250, gfPanel(320, 220, { head: '오늘의 끝 장면', headBg: GFC.sun }) + (filled ? odAt(0, 10, GF_ICON.heart(), 2.4 * gfIn(lt, 0.7, 3, 0.45)) : gfT(0, 26, '+', 90, '#C9BFA8')), fk);
  return h + odLifeBar(t, { cur: 3, s: 1.2 });
};

/* ===== 작은 죽음 ===== */
/* 제로 시점: 두 손 + 폰 화면. screen(inner, 화면 좌표 원점 = 화면 왼쪽 위, 폭 520 높이 860) */
function odPov(t, inner, o = {}) {
  const W3 = 640, H3 = 900, x = 960 - W3 / 2, y = 40 + (o.dy || 0);
  let s = `<rect x="${x + 10}" y="${y + 18}" width="${W3}" height="${H3}" rx="60" fill="${GFC.navy}" opacity=".25"/><rect x="${x}" y="${y}" width="${W3}" height="${H3}" rx="60" fill="#2B3654" stroke="${INK}" stroke-width="10"/>`;
  s += `<svg x="${x + 20}" y="${y + 20}" width="${W3 - 40}" height="${H3 - 40}" viewBox="0 0 ${W3 - 40} ${H3 - 40}"><rect width="${W3 - 40}" height="${H3 - 40}" rx="44" fill="${o.bg || '#F2F4FA'}"/>${inner}</svg>`;
  s += [[-1, 610], [1, 1310]].map(([sd, hx]) => `<g transform="translate(${hx} ${y + 820})"><ellipse cx="0" cy="0" rx="110" ry="150" fill="#fff" stroke="${INK}" stroke-width="9"/><ellipse cx="${-sd * 96}" cy="-96" rx="30" ry="58" fill="#fff" stroke="${INK}" stroke-width="8" transform="rotate(${sd * 28} ${-sd * 96} -96)"/></g>`).join('');
  return s;
}
const odBubble = (x, y, text, side, o = {}) => { const fs = o.size || 32, L2 = Array.isArray(text) ? text : [text], w = Math.max(...L2.map(q => gfTextW(q, fs, 800))) + 48, h = L2.length * (fs + 10) + 24, bx = side === 'R' ? x - w : x;
  let s = `<rect x="${f1(bx)}" y="${y}" width="${f1(w)}" height="${h}" rx="${Math.min(h / 2, 30)}" fill="${side === 'R' ? '#FFE27A' : '#fff'}" stroke="${INK}" stroke-width="4"/>` + L2.map((q, i) => gfT(bx + w / 2, y + 12 + (i + 1) * (fs + 10) - 10, q, fs, GFC.navy, { wt: 800 })).join('');
  if (o.one) s += gfT(bx - 14, y + h - 6, '1', 26, '#F2A33A', { anchor: 'end' });
  if (o.time) s += gfT(side === 'R' ? bx - (o.one ? 40 : 12) : bx + w + 12, y + h - 6, o.time, 20, '#8D93A6', { anchor: side === 'R' ? 'end' : 'start', wt: 600 });
  return s; };
odeveningScene = function (t, lt, a) {
  const tF = odW(a, '흐려지고', 3.8), tBed = odW(a, '침대에서', 5.0), tM = odW(a, '아침이', (a._dur || 11) - 1.6);
  const morn = easeInOut(gfK(tM, tM + 1.0, lt));
  let h = gfDefs() + gfFull(gfMix('#3B4A84', '#FFF1CF', morn)) + gfFull('url(#gfDots)') + `<rect x="-600" y="${OD.FY}" width="3120" height="800" fill="${gfMix('#2E386B', '#F4DC9E', morn)}"/>`;
  if (morn > 0.02) h += gfRays(t, 1700, 200, 1500, '#FFF3B8', 14, 0.35 * morn, 8) + gfSun(1700, 200, 70, t);
  h += gfActor(OSCH, { x: 460, y: OD.FY, s: 1.25, t, pose: '서기', ex: fEx(morn > 0.5 ? 'z빵긋' : lt > tF ? 'z졸음' : 'z기본'), look: [0.6, -0.2], seed: 71 });
  h += `<rect x="640" y="760" width="40" height="140" fill="#FFF6E0" stroke="${INK}" stroke-width="6"/><path d="M660 730 Q644 746 660 760 Q676 746 660 730 Z" fill="${GFC.sun}" stroke="${INK}" stroke-width="5"/>` + `<circle cx="660" cy="745" r="70" fill="url(#gfGlow)" opacity="${f1((1 - morn) * 0.7 * 100) / 100}"/>`;
  h += gfChipAt(lt, 0.4, 480, 220, '저녁 = 하루의 노년', { icon: 'moon', size: 44, bg: '#C9CFFF', rot: -3 });
  if (lt > tF && morn < 0.9) h += [0, 1, 2].map(i => gfCloud(400 + i * 120 + Math.sin(t + i) * 20, 380 + i * 20, 0.5, 0.6 * (1 - morn))).join('');
  const bk = gfIn(lt, tBed, 3, 0.45);
  if (bk > 0.02) { let b = `<rect x="-150" y="40" width="300" height="70" rx="16" fill="#C9D0F2" stroke="${INK}" stroke-width="6"/><rect x="-170" y="20" width="40" height="110" rx="14" fill="#8A6A9A" stroke="${INK}" stroke-width="6"/>`;
    let th = `<ellipse cx="0" cy="-150" rx="230" ry="130" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="-60" cy="-10" r="18" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-30" cy="20" r="10" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
    th += `<g opacity="${f1((1 - morn) * 100) / 100}">${[0, 1, 2].map(i => `<path d="M${-160 + i * 20} ${-190 + i * 40} Q${-80} ${-260 + i * 50} ${0} ${-170 + i * 40} T${170 - i * 30} ${-200 + i * 40}" fill="none" stroke="#5B4FCF" stroke-width="9" stroke-linecap="round" transform="rotate(${f1(Math.sin(t * 3 + i) * 4)})"/>`).join('')}</g>`;
    if (morn > 0.02) th += odAt(0, -150, gfIcon('sun', 1.4 * morn, t), 1);
    h += odAt(1180, 620, b + th, 1.3 * bk); }
  if (morn > 0.3) h += gfChipAt(lt, tM + 0.4, 1150, 900, '아침이 걷어 낸다', { size: 40, bg: GFC.sun });
  return h;
};
odsleepScene = function (t, lt, a) {
  let h = gfDefs() + odPaperBg(t);
  if (!a.ph) {
    const t34 = odW(a, '34', 2.4), t150 = odW(a, '150', 4.4), t12 = odW(a, '12', 6.0);
    h += odStudy(lt, 0.3, '2011 · 미국 버클리대');
    for (let i = 0; i < 34; i++) { const k = gfIn(lt, t34 + i * 0.02, 3.4, 0.45); if (k > 0.02) h += odAt(260 + (i % 6) * 64, 380 + Math.floor(i / 6) * 70, `<circle r="22" fill="${['#BFE8D2', '#D9C7E8', '#FFE2A8', '#C9E3F7'][i % 4]}" stroke="${INK}" stroke-width="5"/>`, k); }
    h += gfChipAt(lt, t34, 420, 860, '34명', { size: 46, bg: '#fff', icon: 'family' });
    const ck = gfIn(lt, t150, 3, 0.45); if (ck > 0.02) { let c = ''; for (let i = 5; i >= 0; i--) c += `<rect x="${-110 + i * 8}" y="${-150 - i * 8}" width="220" height="290" rx="16" fill="#fff" stroke="${INK}" stroke-width="6"/>`; c += `<rect x="-80" y="-180" width="160" height="110" rx="10" fill="#FFD3E1"/>` + odAt(0, -126, gfIcon('heart', 1, t)) + gfT(0, 60, '150장', 48, GFC.navy); h += odAt(960, 520, c, ck, -4); }
    const kk = gfIn(lt, t12, 3, 0.45); if (kk > 0.02) { const sp = easeInOut(gfK(t12 + 0.2, t12 + 1.4, lt)); h += odAt(1500, 520, `<circle r="150" fill="#fff" stroke="${INK}" stroke-width="8"/><path d="M0 0 L0 -150 A150 150 0 0 1 ${f1(150 * Math.sin(Math.PI * sp))} ${f1(-150 * Math.cos(Math.PI * sp))} Z" fill="#C9CFFF"/>` + odAt(0, -95, gfIcon('sun', 0.8, t)) + odAt(0, 95, gfIcon('moon', 0.8, t)) + `<line x1="0" y1="0" x2="${f1(110 * Math.sin(Math.PI * sp))}" y2="${f1(-110 * Math.cos(Math.PI * sp))}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>`, kk) + gfChipAt(lt, t12 + 0.3, 1500, 760, '12시간 뒤 한 번 더', { size: 38, bg: '#fff', icon: 'clock' }); }
    return h;
  }
  const tS = odW(a, '잠을', 0.6), tLess = odW(a, '덜', 2.6), tR = odW(a, '수면', 5.0), tTh = odW(a, '치료', (a._dur || 9) - 1.2);
  const flame = (x, y, k) => odAt(x, y, `<path d="M0 40 Q-46 10 -30 -40 Q-14 -10 -4 -16 Q-10 -60 18 -86 Q20 -40 40 -20 Q56 10 0 40 Z" fill="#FF6B4A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M0 34 Q-20 14 -10 -10 Q6 0 14 -20 Q30 10 0 34 Z" fill="#FFD84A"/>`, k * (1 + 0.06 * Math.sin(t * 12)));
  h += gfChipAt(lt, 0.2, 560, 200, '깨어 있던 쪽', { size: 40, bg: '#FFE1C9' }) + gfChipAt(lt, tS, 1360, 200, '잠을 잔 쪽', { size: 40, bg: '#C9CFFF', icon: 'moon' });
  h += gfActor(o => ODV('#C9E3F7', o), { x: 560, y: OD.FY, s: 0.8, t, pose: '서기', ex: fEx('z당황'), look: [0, -0.1], seed: 71 }) + flame(560, OD.FY - 560, 1.25);
  const small = lerp(1.25, 0.45, easeInOut(gfK(tLess - 0.2, tLess + 0.6, lt))), cap = `<path d="M1282 ${OD.FY - 372} Q1340 ${OD.FY - 520} 1440 ${OD.FY - 392} Z" fill="#8E7CFF" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><circle cx="1448" cy="${OD.FY - 386}" r="16" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
  h += gfActor(o => ODV('#D9C7E8', o), { x: 1360, y: OD.FY, s: 0.8, t, pose: '서기', ex: lt > tS ? odSleepEx : fEx('z당황'), noBlink: lt > tS, look: [0, -0.1], seed: 72 }) + (lt > tS ? odAt(0, 0, cap, 1) : '');
  h += flame(1360, OD.FY - 600 + (lt > tS ? 30 : 0), lt < tS ? 1.25 : small) + (lt > tS ? gfEmote(lt, tS + 0.2, 1460, OD.FY - 520, 'zzz', { hold: 9 }) : '');
  if (lt > tS) h += odAt(1560, 330, gfChip('저장 중', { size: 30, bg: '#fff', icon: 'star' }), gfIn(lt, tS + 0.4, 3, 0.45) * gfOut(lt, tLess + 0.5, 0.2));
  h += gfChipAt(lt, tR, 960, 820, '렘수면', { size: 46, bg: '#D5D9FF', icon: 'moon' }) + gfChipAt(lt, tTh, 960, 920, '밤사이 치료 (overnight therapy)', { size: 34, bg: GFC.sun });
  return h;
};
oddraftScene = function (t, lt, a) {
  const ph = a.ph; let scr = `<rect width="520" height="110" fill="#E3E8F6"/>` + gfT(260, 70, '팀장님', 38, GFC.navy);
  scr += odBubble(30, 150, '내일 오전까지 부탁해요', 'L', { size: 30, time: '17:02' }) + odBubble(490, 240, '네, 알겠습니다', 'R', { size: 30, time: '17:03' });
  const typed = ph === 0 ? clamp(lt / Math.max(1, odW(a, '멈춥니다', 2.4) - 0.2), 0, 1) : 1, rows = Math.max(1, Math.round(9 * typed));
  const BOT = 770; let box = `<rect x="20" y="${BOT - rows * 42 - 20}" width="480" height="${rows * 42 + 20}" rx="22" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
  for (let i = 0; i < rows; i++) box += `<rect x="44" y="${BOT - rows * 42 - 2 + i * 42}" width="${i === rows - 1 ? 120 + 200 * ((typed * 9) % 1) : 400 - (i % 3) * 40}" height="16" rx="8" fill="#C9C2B0"/>`;
  let h = gfDefs() + gfFull('#232B52') + gfFull('url(#gfDots)');
  if (ph === 0) { scr += box; h += odPov(t, scr) + gfEmote(lt, 0.4, 1400, 200, 'vein', { hold: (a._dur || 3) - 0.8, s: 1.3 }) + (lt > odW(a, '멈춥니다', 2.4) ? gfEmote(lt, odW(a, '멈춥니다', 2.4), 1400, 380, 'dots', { hold: 2 }) : ''); }
  else {
    const tB = odW(a, '아침의', 0.6), fold = gfK(tB + 0.3, tB + 0.9, lt);
    if (fold < 1) scr += `<g transform="translate(260 ${f1(600 - 400 * fold)}) scale(${f1((1 - fold) * 100) / 100})"><g transform="translate(-260 -600)">${box}</g></g>`;
    scr += odAt(260, 420, gfChip('아침의 나에게', { size: 36, bg: GFC.sun, icon: 'sun' }), gfIn(lt, tB - 0.2, 3.4, 0.45) * (lt > tB && lt < tB + 0.15 ? 0.9 : 1));
    if (lt > tB + 0.9) scr += odAt(260, 560, gfPanel(380, 160, { r: 30 }) + gfT(0, -10, '내일 아침 7:00', 34, GFC.navy) + gfT(0, 40, '다시 보기', 30, '#8D93A6'), gfIn(lt, tB + 0.9, 3, 0.45));
    h += odPov(t, scr) + gfStarBurst(lt, tB + 0.9, 960, 560, { r1: 220 });
  }
  return h;
};

/* ===== 솔직한 대목 ===== */
odhonestScene = function (t, lt, a) {
  const ph = a.ph; let h = gfDefs() + odPaperBg(t);
  if (ph === 0) { const tP = odW(a, '완벽하라는', 2.4), tT = odW(a, '지칩니다', (a._dur || 5) - 0.7), drop = lt > tT;
    h += `<rect x="-600" y="${OD.FY}" width="3120" height="800" fill="#F4DC9E"/>`;
    const st = 1.3 * gfIn(lt, 0.3, 3, 0.45); h += odAt(960, drop ? OD.FY - 110 : 440 + Math.sin(t * 8) * 6, `<rect x="-200" y="-90" width="400" height="180" rx="24" fill="#fff" stroke="#E5484D" stroke-width="14"/>` + gfT(0, 30, '완벽', 90, '#E5484D') + `<rect x="-40" y="-190" width="80" height="100" rx="14" fill="${GFC.wood2}" stroke="${INK}" stroke-width="7"/>`, st * 1.0, drop ? 6 : -4);
    h += odHaru(drop ? 640 : 960, drop ? OD.FY - 90 : 720, 1.6, t, { age: 1, mood: drop ? 'happy' : 'cry', dy: drop ? gfHop(lt, tT + 0.2, 40, 0.3).dy : 0 }) + (drop ? '' : gfEmote(lt, 0.6, 1080, 600, 'sweat', { hold: 9 })) + gfPuff(lt, tT, 960, OD.FY, 1.6);
    return h; }
  if (ph === 1) { const tL = odW(a, '늦게', 3.8), tW = odW(a, '깬', (a._dur || 7) - 1.2), sh = 0.2 * easeInOut(gfK(tL - 0.3, tL + 0.6, lt));
    h += odAt(960, 460, odCurvePanel(t, 1, { ghost: true, shift: sh, col: '#FF9A55', head: '주말엔 늦게 올라온다', dot: false }), gfIn(lt, 0.1, 2.8, 0.5));
    h += gfChipAt(lt, 0.4, 560, 760, '평일', { size: 34, bg: '#EDE8DD' }) + gfChipAt(lt, tL, 1360, 760, '주말', { size: 34, bg: '#FFE1C9' });
    if (lt > tW) h += odAt(960, 900, gfChip('아침 = 내가 깬 때', { size: 46, bg: GFC.sun, icon: 'sun' }), gfIn(lt, tW, 3, 0.45));
    return h; }
  const tG = odW(a, '정리할', (a._dur || 5) - 1.4);
  const pts = [[-480, -40], [-360, -90], [-240, 30], [-120, 150], [0, 40], [120, 90], [240, -20], [360, 60], [480, 150]], d = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ');
  let p = gfPanel(1200, 470, { head: '오늘', headBg: '#FFE1C9' }) + `<path d="${d}" fill="none" stroke="${GFC.coral}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`;
  [[-360, -90], [0, 40], [240, -20]].forEach(([x, y], i) => { p += odAt(x, y - 40, gfStar5(26, GFC.sun, 5), gfIn(lt, 0.8 + i * 0.4, 3.4, 0.45) * (0.85 + 0.15 * Math.sin(t * 4 + i))); });
  p += odAt(480, 150, `<circle r="20" fill="#8D93A6" stroke="${INK}" stroke-width="5"/>`, 1);
  h += odAt(960, 470, p, gfIn(lt, 0.1, 2.8, 0.5)) + gfChipAt(lt, 1.2, 760, 800, '좋았던 순간도 있었다', { size: 40, bg: GFC.sun, icon: 'star' }) + (lt > tG ? gfChipAt(lt, tG, 1400, 800, '기억의 정리일 뿐', { size: 36, bg: '#fff' }) : '');
  return h;
};

/* ===== 끝: 엔딩 크레딧 ===== */
function odChat(t, lt, o) { // 엄마 대화방(제로 시점). o.view 0(맨 아래)~1(맨 위), o.badge(빨간 안 읽음 배지) 1→0, o.typed, o.sent, o.read, o.reply
  let s = `<rect width="520" height="110" fill="#E3E8F6"/>` + gfT(260, 72, '엄마', 46, GFC.navy) + `<circle cx="70" cy="56" r="32" fill="#FFE2A8" stroke="${INK}" stroke-width="4"/>`;
  if (o.badge > 0.02) s += odAt(460, 56, `<circle r="26" fill="#E5484D" stroke="${INK}" stroke-width="4"/>` + gfT(0, 9, '41', 26, '#fff'), o.badge);
  const days = ['일요일', '월요일', '화요일'], msgs = [['잘 자라', '22:30'], ['밥은 먹었니?', '22:31'], ['잘 자라', '22:30']], sk = o.sent || 0, rk = o.reply || 0;
  let c = ''; for (let i = 0; i < 9; i++) { const di = i % 3; c += `<g transform="translate(0 ${i * 150})"><rect x="185" y="0" width="150" height="38" rx="19" fill="#D9DEEC"/>` + gfT(260, 27, days[di], 24, '#6B7280', { wt: 700 }) + odBubble(30, 52, msgs[di][0], 'L', { size: 36, time: msgs[di][1] }) + `</g>`; }
  const T = 520 - 8 * 150 + 790 * (o.view || 0) - 200 * sk - 110 * rk;
  s += `<clipPath id="odChatC"><rect x="0" y="110" width="520" height="550"/></clipPath><g clip-path="url(#odChatC)"><g transform="translate(0 ${f1(T)})">${c}</g>`;
  if (sk > 0.02) s += odAt(0, 0, odBubble(490, 470 - 110 * rk, ['엄마도 잘 자요.', '오늘 좋은 하루였어요.'], 'R', { size: 30, one: !o.read, time: '22:33' }), 1);
  if (rk > 0.02) s += odAt(30, 560, odBubble(0, 0, ['아직 안 잤어?', '우리 아들도 잘 자.'], 'L', { size: 30, time: '22:33' }), rk);
  s += `</g><rect x="0" y="660" width="520" height="140" fill="#fff"/><rect x="20" y="680" width="400" height="70" rx="35" fill="#F2F4FA" stroke="${INK}" stroke-width="4"/>` + `<circle cx="470" cy="715" r="32" fill="${o.typed > 0.99 && !sk ? GFC.sun : '#D9DEEC'}" stroke="${INK}" stroke-width="4"/><path d="M458 700 L486 715 L458 730 Z" fill="${GFC.navy}"/>`;
  if (o.typed > 0 && !sk) { const full = '엄마도 잘 자요. 오늘 좋은 하루였어요.', n = Math.round(full.length * o.typed); s += gfT(40, 726, full.slice(0, n) + (Math.sin(t * 8) > 0 ? '|' : ''), 23, GFC.navy, { anchor: 'start', wt: 800 }); }
  return s; }
odendScene = function (t, lt, a) {
  const ph = a.ph;
  if (ph <= 2) {
    const cam = ph === 0 ? qLerpCam(lt / 1.6, [920, 540, 1.45], [940, 530, 1.55]) : [950, 520, 1.6];
    const zz = odZBed(t, { pose: 'od폰', rot: -10, ex: ph === 1 ? odTalkEx('_ode', 'z기본', t) : fEx(ph === 2 ? 'z반짝' : 'z기본'), look: ph === 1 ? [-0.3, -0.5] : [0.15, 0.55] }), bed = odBedSit(1);
    let w = bed.back + odHaru(440, 474, 1, t, { age: 3, mood: 'sleep', rot: Math.sin(t * 1.6) * 6 }) + odGlow(zz.face[0], zz.face[1] + 6, 82, 1) + zz.body + odPhone(zz.hand[0] + (ph === 2 ? Math.sin(t * 60) * 4 : 0), zz.hand[1] - 18, -10, 0.9) + bed.front;
    if (ph === 1) w += gfEmote(lt, 0.3, zz.top[0] + 70, zz.top[1] + 10, 'q', { hold: 9 }) + odAt(zz.top[0] + 300, zz.top[1] + 40, gfPanel(240, 160, { head: '오늘의 끝 장면', headBg: GFC.sun, headSize: 22 }) + gfT(0, 30, '?', 70, '#C9BFA8'), gfIn(lt, 0.6, 3, 0.45));
    if (ph === 2) w += [-1, 1].map(sd => `<path d="M${f1(zz.hand[0] + sd * 50)} ${f1(zz.hand[1] - 40)} q${sd * 10} 12 0 24 M${f1(zz.hand[0] + sd * 64)} ${f1(zz.hand[1] - 50)} q${sd * 16} 20 0 40" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`).join('') + odAt(zz.hand[0] - 250, zz.hand[1] - 190, gfChip('엄마: 잘 자라', { size: 36, icon: 'letter', bg: '#FFF3D6' }), gfIn(lt, 0.2, 3.4, 0.45)) + odGlow(zz.hand[0] - 250, zz.hand[1] - 190, 150, 0.6);
    return gfDefs() + odRoom(t, cam, { night: 1, mins: 22 * 60 + 30 }) + qCam(cam, w) + odLifeBar(t, { cur: 3, night: 1, s: 1.2 });
  }
  let o = {}, faceK = 0;
  if (ph === 3) { o = { view: easeInOut(gfK(0.6, (a._dur || 8) - 0.8, lt)), badge: 1 - gfK(0.15, 0.45, lt) }; }
  else if (ph === 4) o = { view: 1 - easeInOut(gfK(0.1, 1.0, lt)), badge: 0 };
  else if (ph === 5) o = { view: 0, typed: clamp(lt / Math.max(0.8, (a._dur || 3) - 0.6), 0, 1) };
  else if (ph === 6) o = { view: 0, typed: 1, sent: gfIn(lt, 0.02, 3.4, 0.45), read: lt > 0.55 };
  else { o = { view: 0, typed: 1, sent: 1, read: true, reply: gfIn(lt, 0.05, 3, 0.45) }; }
  let h = gfDefs() + gfFull('#232B52') + gfFull('url(#gfDots)') + odPov(t, odChat(t, lt, o));
  if (ph === 4) h += gfChipAt(lt, 0.3, 1520, 260, '안 읽은 말 41개 → 0', { size: 34, bg: '#fff', icon: 'letter', rot: 3 });
  if (ph === 6) h += gfStarBurst(lt, 0.55, 1180, 560, { r1: 140, n: 6 }) + gfChipAt(lt, 0.6, 1520, 300, '바로 읽음', { size: 40, bg: GFC.sun, icon: 'heart', rot: 3 });
  if (ph === 7) h += gfEmote(lt, 0.4, 1420, 360, 'heart', { hold: 3, s: 1.4 });
  return h;
};
odcreditsScene = function (t, lt, a) {
  const tM = odW(a, '엄마의', 5.4), tW = odW(a, '써', (a._dur || 12) - 1.0), D3 = a._dur || 12;
  let h = gfDefs() + gfFull('url(#gfNight)'); for (let i = 0; i < 40; i++) h += gfTwinkle(t, hash(i * 3.7) * 1920, hash(i * 1.3) * 760, 6 + 8 * hash(i), i, i % 3 ? '#fff' : '#FFF3B8');
  h += gfHill(930, 40, 600, '#2E386B', 0) + gfMoon(1650, 200, 50, t);
  const roll = [['오늘의 출연', 40, '#C9CFFF'], ['제로', 62, '#fff'], ['서윤', 58, '#fff'], ['팀장님', 58, '#fff'], ['분식집 사장님', 58, '#fff'], ['하루', 58, '#FFD84A']], sp = 120, y0 = 1000 - (lt / D3) * 900;
  roll.forEach(([tx, fs, col], i) => { const y = y0 + i * sp; if (y > 60 && y < 1000) h += gfT(500, y, tx, fs, col, { sw: 0, wt: i ? 900 : 700 }); });
  const mk = gfIn(lt, tM, 2.8, 0.5);
  if (mk > 0.02) h += odAt(1060, 520, gfPanel(760, 230, { bg: '#FFF8E6', head: '특별 출연', headBg: GFC.berry, headCol: '#fff' }) + gfT(0, 10, '엄마', 86, GFC.navy) + gfT(0, 80, '매일 밤 10시 30분', 36, '#8D93A6') + odAt(220, 0, GF_ICON.heart(), 1.6), mk) + gfStarBurst(lt, tM, 1060, 520, { r1: 360, cols: [GFC.berry, '#fff', GFC.sun] });
  const star = gfK(tW - 0.6, tW, lt), rise = easeInOut(gfK(tW, tW + 1.2, lt));
  h += odHaru(1620, lerp(760, 300, rise), 1.3, t, { age: 3, mood: 'sleep', star, shadow: false });
  if (lt > tW + 0.6) h += odAt(1620, 470, gfStamp(lt, tW + 0.7, '저장 완료', { size: 52, col: GFC.sun, rot: -6 }));
  return h + odLifeBar(t, { cur: 4, night: 1, s: 1.2, tp: tW });
};
odaskScene = function (t, lt, a) {
  let h = gfDefs() + gfFull('url(#gfNight)'); for (let i = 0; i < 60; i++) h += gfTwinkle(t, hash(i * 2.1) * 1920, hash(i * 4.3) * 1000, 5 + 9 * hash(i), i, i % 4 ? '#fff' : '#FFF3B8');
  h += odAt(960, 470, gfPanel(1300, 360, { bg: '#FFF8E6', r: 44 }), gfIn(lt, 0.1, 2.8, 0.5));
  h += gfBounceText(lt, 0.4, 960, 430, [['오늘 밤, ', GFC.navy], ['＿＿＿', '#E8742A'], ['의 하루에', GFC.navy]], { size: 84, stroke: '#fff', sw: 14, stagger: 0.035 }) + gfBounceText(lt, 0.9, 960, 560, [['좋은 끝을', GFC.navy]], { size: 96, stroke: '#fff', sw: 16 });
  h += odHaru(960, 830, 1.2, t, { age: 3, star: 1, mood: 'sleep', shadow: false });
  return h;
};

/* ===== 큰 숫자 카드(게임풍, 원효 편 statScene과 같은 모양) ===== */
statScene = function (t, lt, a) {
  let h = gfDefs() + gfFull('#FFF3D6') + gfFull('url(#gfDots)') + gfRays(t, 960, 470, 1500, '#fff', 14, 0.35, 6);
  h += gfBounceText(lt, 0.1, 960, 480, [[a.nocount ? a.big : countUp(a.big, easeOut(gfK(0.1, 1.2, lt))), GFC.navy]], { size: a.big.length > 6 ? 150 : 240, stroke: '#fff', sw: 30 }) + gfStarBurst(lt, 0.9, 960, 420, { r0: 200, r1: 520, n: 10, size: 28 });
  h += odAt(960, 720, gfPanel(gfTextW(a.sub, 46, 900) + 110, 104, { r: 40 }) + gfT(0, 17, a.sub, 46, GFC.navy), gfIn(lt, 1.0, 3, 0.45)) + (lt > 1.2 ? gfT(960, 840, a.src, 28, '#8A7F6A', { wt: 600 }) : '');
  const hop = gfHop(lt, 1.05, 50, 0.4); h += gfActor(Z, { t, seed: 10, x: 1700, y: 1060, s: 0.5, ex: fEx(lt > 1.0 ? 'z충격' : 'z기본'), look: [-0.7, -0.5], pose: hop.air > 0.2 ? '만세' : '서기' }, hop) + gfEmote(lt, 1.05, 1730, 1060 - 300, 'bang', { hold: 1.2, s: 0.7 });
  return h;
};
