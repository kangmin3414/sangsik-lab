/* 축의금 편(gift01) 장면. 제로의 원룸 책상(밤) + 지갑 속 동전 꼬마 '본전이'.
   쓰는 것: engine.js(char·label·fT), anim2.js(A2), act2.js(ACT), actscenes.js(acZ), qscenes.js(qPlate·qCam·qShadow·qDefs), fscenes.js(fFull·fT).
   좌표: 세계 좌표(render가 0.88로 줄임). 보이는 세계는 x -131~2051, y -14~1213. 장면마다 qCam으로 자체 카메라.
   이름 접두사 gf(다른 편과 충돌 방지). */
Object.assign(CAMS, { gfcalc: 'fixed', gfinv: 'fixed', gfpop: 'fixed', gfwallet: 'fixed', gfpie: 'fixed', gfdead: 'fixed', gfinfo: 'fixed', gfstamp: 'fixed' });
Object.assign(QBG, { room: 'ai/room.png', morning: 'ai/morning.png', lab: 'ai/lab.png', library: 'ai/library.png', hall: 'ai/hall.png' });
const GF = { X: 960, Y: 1020, S: 1.25, DT: 812, LAMP: 330, INV: 500, CALC: 1190, WAL: 1430 }; // 제로(책상 뒤) 발 원점·크기, 책상 윗선, 소품 x
const GF_MED = [1100, 640, 1.2];
const gfDefs = () => `<defs><radialGradient id="gfCoinG" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#FBFCFE"/><stop offset=".55" stop-color="#D3D8E0"/><stop offset="1" stop-color="#A9B1BD"/></radialGradient>
<linearGradient id="gfSpot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6C8" stop-opacity="0"/><stop offset="1" stop-color="#FFF6C8" stop-opacity=".55"/></linearGradient>
<radialGradient id="gfLamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFD58A" stop-opacity=".7"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></radialGradient>
<radialGradient id="gfPool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF3C4" stop-opacity=".75"/><stop offset="1" stop-color="#FFF3C4" stop-opacity="0"/></radialGradient>
<linearGradient id="gfLeather" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A4A26"/><stop offset="1" stop-color="#5E3519"/></linearGradient>
<pattern id="gfGrain" width="320" height="60" patternUnits="userSpaceOnUse"><path d="M0 18 Q80 8 160 20 T320 16 M0 44 Q90 36 170 48 T320 42" fill="none" stroke="#7A4A22" stroke-width="3" opacity=".25"/></pattern></defs>`;
// 단어 시각(장면 lt 기준). keys는 문자열 또는 배열(음성 인식이 숫자로 적는 경우 대비)
const gfW = (a, keys, fb) => { const ks = Array.isArray(keys) ? keys : [keys]; for (const w of (a._words || [])) { const s = w.w.replace(/\s/g, ''); if (ks.some(k => s.includes(k))) return w.t + 0.15; } return fb; };
// 지금 줄(립싱크용)
const gfLineAt = t => { const L = TL.lines; let i = 0; while (i + 1 < L.length && t >= L[i + 1].t0 - 0.15) i++; return L[i]; };
const GF_TR = {};
const gfLip = t => { const l = gfLineAt(t); if (!l || !l.v || l.v === 'N') return { v: ACT.VIS.M, o: 0, s: null };
  const tr = GF_TR[l.id] || (GF_TR[l.id] = ACT.lipTrack(l.say || l.sub, l.words || [], l.t0, l.t1, tt => env(tt) > 0.12 ? 1 : 0)); return ACT.lip(tr, t, env(t)); };
const gfK = (lt, a, b) => clamp((lt - a) / (b - a), 0, 1);
const gfNight = (k = 1) => fFull('#0A1238', 0.2 * k) + `<circle cx="${GF.LAMP + 160}" cy="760" r="760" fill="url(#gfLamp)" opacity="${f1(0.5 * k * 100) / 100}"/>`;

/* ---------- 소품 ---------- */
// 계산기(로컬, 가운데 0,0, 92x124). top: 윗줄 작은 글, big: 큰 숫자, red: 빨간 숫자, on: 깜빡임(0이면 숫자 안 보임), press: 눌린 키 번호
function gfCalcSvg(top, big, o = {}) {
  let g = (o.stand ? `<path d="M30 20 L70 62 L52 62 Z" fill="#5A6070" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` : '') + `<rect x="-46" y="-62" width="92" height="124" rx="11" fill="#3A4150" stroke="${INK}" stroke-width="5"/><rect x="-38" y="-54" width="76" height="34" rx="4" fill="#CFE3C2" stroke="${INK}" stroke-width="3"/>`;
  if (top) g += `<text x="34" y="-42" text-anchor="end" font-family="${FONT}" font-weight="700" font-size="8.5" fill="#55634C">${esc(top)}</text>`;
  if (big) g += `<text x="34" y="-25" text-anchor="end" font-family="${FONT}" font-weight="900" font-size="${o.size || 18}" fill="${o.red ? (o.on === 0 ? '#8E1B1B' : '#E03131') : '#1E2A1A'}">${esc(big)}</text>`;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const k = r * 4 + c, pr = o.press === k ? 2 : 0;
    g += `<rect x="${-37 + c * 19}" y="${-12 + r * 18 + pr}" width="16" height="13" rx="3" fill="${c === 3 ? '#FF9F43' : '#D8DCE3'}" stroke="${INK}" stroke-width="2.2"/>`; }
  return g;
}
const gfEnv = (txt, red, tag) => `<rect x="-30" y="-19" width="60" height="38" rx="3" fill="#fff" stroke="${INK}" stroke-width="3.5"/><text x="0" y="8" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="20" fill="${red ? '#C0392B' : INK}">${txt}</text>` +
  (tag ? `<text x="0" y="-27" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="15" fill="#fff" stroke="${INK}" stroke-width="4" paint-order="stroke">${tag}</text>` : '');
const gfStampSvg = () => `<ellipse cx="0" cy="-58" rx="17" ry="15" fill="#8B3A2E" stroke="${INK}" stroke-width="4"/><rect x="-8" y="-46" width="16" height="28" fill="#5A2A1E" stroke="${INK}" stroke-width="4"/><rect x="-30" y="-20" width="60" height="22" rx="5" fill="#C0392B" stroke="${INK}" stroke-width="4"/>`;
// 책상 앞판(제로 다음에 그려서 허리 아래를 가린다)
function gfDesk() {
  const T = GF.DT;
  return `<rect x="150" y="${T - 16}" width="1640" height="22" rx="6" fill="#C99566" stroke="${INK}" stroke-width="7"/>` +
    `<rect x="170" y="${T + 6}" width="1600" height="480" fill="#9C6A3F" stroke="${INK}" stroke-width="7"/><rect x="170" y="${T + 6}" width="1600" height="480" fill="url(#gfGrain)"/>` +
    `<rect x="1180" y="${T + 40}" width="460" height="120" rx="10" fill="#A8774B" stroke="${INK}" stroke-width="6"/><rect x="1370" y="${T + 88}" width="80" height="18" rx="9" fill="#5B4636" stroke="${INK}" stroke-width="4"/>`;
}
// 스탠드(켜짐)
function gfLampSvg() { const x = GF.LAMP, T = GF.DT - 10;
  return `<path d="M${x + 120} 600 L${x + 330} ${T} L${x - 20} ${T} Z" fill="#FFF0B8" opacity=".16"/>` +
    `<ellipse cx="${x}" cy="${T}" rx="64" ry="14" fill="#55627A" stroke="${INK}" stroke-width="6"/><path d="M${x} ${T - 6} L${x - 24} 640 L${x + 70} 560" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><path d="M${x} ${T - 6} L${x - 24} 640 L${x + 70} 560" fill="none" stroke="#7C8AA3" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<circle cx="${x - 24}" cy="640" r="11" fill="#7C8AA3" stroke="${INK}" stroke-width="4"/><path d="M${x + 44} 540 L${x + 124} 520 L${x + 160} 610 L${x + 76} 628 Z" fill="#5D6E8A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<ellipse cx="${x + 118}" cy="619" rx="40" ry="11" transform="rotate(-12 ${x + 118} 619)" fill="#FFF3C4" stroke="${INK}" stroke-width="4"/>`; }
// 청첩장(세워 둔 카드, 작게)
const gfInvSmall = (x = GF.INV, rot = -3) => `<g transform="translate(${x} ${GF.DT - 8}) rotate(${rot})"><path d="M40 -60 L78 2 L56 2 Z" fill="#8A6A50" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="-82" y="-118" width="164" height="118" rx="6" fill="#FFF8EC" stroke="${INK}" stroke-width="6"/>` +
  `<rect x="-82" y="-118" width="164" height="22" rx="6" fill="#F2B8C6" stroke="${INK}" stroke-width="5"/><path d="${zHeartP(0, -60, 0.55)}" fill="#E8637F" stroke="${INK}" stroke-width="3.5"/><rect x="-46" y="-30" width="92" height="7" rx="3" fill="#D8CDBB"/></g>`;
// 지갑(앞에서 본 반 접힌 지갑). open: 덮개가 열린 정도(0~1), jig: 들썩임
function gfWallet(x, open = 0, jig = 0) { const T = GF.DT - 6, w = 190, h = 112, top = T - h;
  const fl = 1 - 1.9 * clamp(open, 0, 1); // 덮개: 위로 젖혀짐(세로 뒤집힘)
  return `<g transform="translate(${f1(x)} ${f1(T)}) rotate(${f1(jig * 4)}) translate(${f1(-x)} ${f1(-T)})"><rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" rx="16" fill="url(#gfLeather)" stroke="${INK}" stroke-width="7"/>` +
    `<rect x="${x - w / 2 + 12}" y="${top + 12}" width="${w - 24}" height="${h - 24}" rx="10" fill="none" stroke="#D9A86C" stroke-width="3.5" stroke-dasharray="9 7"/>` +
    (open > 0.05 ? `<ellipse cx="${x}" cy="${top + 2}" rx="${f1((w / 2 - 14) * clamp(open, 0, 1))}" ry="${f1(12 * clamp(open, 0, 1))}" fill="#2A160A" stroke="${INK}" stroke-width="4"/>` : '') +
    `<g transform="translate(0 ${f1(-6 * clamp(open, 0, 1))})"><path d="M${x - w / 2} ${top + 2} L${x + w / 2} ${top + 2} L${x + w / 2} ${top + 46} Q${x} ${top + 66} ${x - w / 2} ${top + 46} Z" fill="#8B5A2B" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<circle cx="${x}" cy="${top + 44}" r="9" fill="#E8C873" stroke="${INK}" stroke-width="4"/></g></g>`; }
const GF_WTOP = GF.DT - 6 - 112;

/* ---------- 본전이 ---------- */
// (x,y)=발 바닥, s: 크기. o: { t, look:[x,y], eyes:'norm'|'wide'|'happy'|'smug'|'dead'|'shut', brow:'up'|'angry'|'worry'|'smug', mouth:'smile'|'grin'|'O'|'flat'|'frown'|'talk', talk(0~1),
//   hL/hR: 손 위치(몸 로컬, 몸 가운데 0,-80), holdL/holdR: 손 중심 기준 svg, sx, sy, rot, flip(1/-1), legs:'stand'|'jump'|'tip', blush }
function gfCoin(x, y, s, o = {}) {
  const t = o.t || 0, lk = o.look || [0, 0], lx = lk[0] * 5, ly = lk[1] * 4, fl = o.flip || 1, sx = o.sx || 1, sy = o.sy || 1;
  const hL = o.hL || [-70, -46], hR = o.hR || [70, -46];
  const leg = o.legs === 'jump' ? [[-15, -32, -24, -8], [15, -32, 26, -12]] : o.legs === 'tip' ? [[-14, -32, -16, 0], [14, -32, 20, -4]] : [[-15, -32, -20, 0], [15, -32, 20, 0]];
  let g = leg.map(([a, b, c, d]) => `<path d="M${a} ${b} L${c} ${d}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><ellipse cx="${c + Math.sign(c) * 4}" cy="${d - 2}" rx="11" ry="6" fill="#fff" stroke="${INK}" stroke-width="4"/>`).join('');
  const arm = (h, sd) => `<path d="M${sd * 46} -84 Q${f1((sd * 46 + h[0]) / 2 + sd * 6)} ${f1((-84 + h[1]) / 2 + 8)} ${f1(h[0])} ${f1(h[1])}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  const hand = h => `<circle cx="${f1(h[0])}" cy="${f1(h[1])}" r="9" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
  const hold = (h, pr) => pr ? `<g transform="translate(${f1(h[0])} ${f1(h[1])})">${pr}</g>` : '';
  // 뒤쪽 팔(몸 뒤로 가는 손은 없음: 팔은 몸 옆에서 나온다)
  g += `<circle cx="0" cy="-80" r="52" fill="url(#gfCoinG)" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="-80" r="46" fill="none" stroke="#9AA3AF" stroke-width="5" stroke-dasharray="3 4.2"/>` +
    `<circle cx="0" cy="-80" r="38" fill="none" stroke="#fff" stroke-width="2.5" opacity=".7"/><path d="M-30 -112 Q-40 -100 -40 -86" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"/>`;
  // 얼굴
  const ex = [-16 + lx, 16 + lx], ey = -86 + ly, E2 = o.eyes || 'norm';
  ex.forEach((cx, i) => {
    if (E2 === 'wide') g += `<ellipse cx="${f1(cx)}" cy="${f1(ey)}" rx="9.5" ry="12" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="${f1(cx + lk[0] * 3)}" cy="${f1(ey + lk[1] * 3)}" r="5.2" fill="${INK}"/>`;
    else if (E2 === 'happy') g += `<path d="M${f1(cx - 7)} ${f1(ey + 2)} Q${f1(cx)} ${f1(ey - 8)} ${f1(cx + 7)} ${f1(ey + 2)}" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
    else if (E2 === 'dead') g += `<path d="M${f1(cx - 7)} ${f1(ey)} L${f1(cx + 7)} ${f1(ey)}" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
    else if (E2 === 'shut') g += `<path d="M${f1(cx + (i ? 6 : -6))} ${f1(ey - 7)} L${f1(cx + (i ? -5 : 5))} ${f1(ey)} L${f1(cx + (i ? 6 : -6))} ${f1(ey + 7)}" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    else if (E2 === 'smug') g += `<path d="M${f1(cx - 7)} ${f1(ey - 1)} L${f1(cx + 7)} ${f1(ey - 1)} Q${f1(cx + 7)} ${f1(ey + 8)} ${f1(cx)} ${f1(ey + 8)} Q${f1(cx - 7)} ${f1(ey + 8)} ${f1(cx - 7)} ${f1(ey - 1)} Z" fill="${INK}"/><path d="M${f1(cx - 8)} ${f1(ey - 1)} L${f1(cx + 8)} ${f1(ey - 1)}" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
    else g += `<ellipse cx="${f1(cx)}" cy="${f1(ey)}" rx="5.5" ry="8.5" fill="${INK}"/><circle cx="${f1(cx + 1.8)}" cy="${f1(ey - 3)}" r="2.1" fill="#fff"/>`;
  });
  const B = o.brow;
  if (B) { const by = ey - 15; const sh = { up: [-4, -4], angry: [5, -3], worry: [-5, 3], smug: [2, -5] }[B] || [0, 0];
    g += [-1, 1].map(sd => `<path d="M${f1(ex[sd < 0 ? 0 : 1] - 8 * sd * -1)} ${f1(by + sh[1] * (B === 'smug' && sd > 0 ? -1 : 1))} L${f1(ex[sd < 0 ? 0 : 1] + 8 * sd * -1)} ${f1(by + sh[0])}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`).join(''); }
  if (o.blush !== 0) g += `<ellipse cx="${f1(-30 + lx)}" cy="${f1(-68 + ly)}" rx="8" ry="4.5" fill="#FF9AAE" opacity=".7"/><ellipse cx="${f1(30 + lx)}" cy="${f1(-68 + ly)}" rx="8" ry="4.5" fill="#FF9AAE" opacity=".7"/>`;
  const my = -64 + ly, mx = lx, M = o.mouth || 'smile', tk = clamp(o.talk || 0, 0, 1);
  if (tk > 0.06) g += `<ellipse cx="${f1(mx)}" cy="${f1(my + 2)}" rx="${f1(6 + 3 * tk)}" ry="${f1(2 + 8 * tk)}" fill="${MO2}" stroke="${INK}" stroke-width="3"/>`;
  else if (M === 'grin') g += `<path d="M${f1(mx - 13)} ${f1(my - 3)} Q${f1(mx)} ${f1(my + 13)} ${f1(mx + 13)} ${f1(my - 3)} Z" fill="${MO2}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  else if (M === 'O') g += `<ellipse cx="${f1(mx)}" cy="${f1(my + 2)}" rx="6" ry="8" fill="${MO2}" stroke="${INK}" stroke-width="3"/>`;
  else if (M === 'flat') g += `<path d="M${f1(mx - 7)} ${f1(my)} L${f1(mx + 7)} ${f1(my)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  else if (M === 'frown') g += `<path d="M${f1(mx - 8)} ${f1(my + 4)} Q${f1(mx)} ${f1(my - 4)} ${f1(mx + 8)} ${f1(my + 4)}" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  else if (M === 'smirk') g += `<path d="M${f1(mx - 8)} ${f1(my + 1)} Q${f1(mx + 2)} ${f1(my + 5)} ${f1(mx + 10)} ${f1(my - 5)}" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  else g += `<path d="M${f1(mx - 9)} ${f1(my - 1)} Q${f1(mx)} ${f1(my + 8)} ${f1(mx + 9)} ${f1(my - 1)}" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  g += arm(hL, -1) + arm(hR, 1) + hold(hL, o.holdL) + hold(hR, o.holdR) + hand(hL) + hand(hR);
  return HALO(`<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${f1(s * sx * fl * 1000) / 1000} ${f1(s * sy * 1000) / 1000})">${g}</g>`);
}
// 본전이 말할 때 입(목소리 크기)
const gfTalk = t => { const l = gfLineAt(t); return l && l.v === 'B' && t > l.t0 - 0.02 && t < l.t1 + 0.05 ? env(t) : 0; };

/* ---------- 제로(책상 뒤) ---------- */
// face: ACT.face 옵션. o: char 옵션(pose, look 등)
const gfZero = (key, face, o = {}) => acZ(key, Object.assign({ t: o.t }, face), Object.assign({ x: GF.X, y: GF.Y, s: GF.S, seed: 61 }, o));
// 제로 입: 말하는 중이면 립싱크, 아니면 rest
const gfMouth = (t, rest = { v: ACT.VIS.M, o: 0, c: 2 }, c = 1.5) => { const lp = gfLip(t); const l = gfLineAt(t); return lp.s && l && l.v === 'Z' ? { v: lp.v, o: lp.o, c } : rest; };
// 계산기를 든 제로 포즈: 왼손에 계산기, 오른손 검지로 누름
const gfCalcPose = (tap = 0) => A2.pose({ hL: [154, 372 + 3 * tap], hR: [252, 372 + 3 * tap], elbowL: [122, 352], elbowR: [278, 352] });

/* =========== 1. 훅: 계산기 =========== */
// ph0(s0): 어둠 → 스탠드 불빛, 7·5·0·0·0 입력 / ph1(z1): "식대 7만 5천… 5만 원 내고 가면, 마이너스 2만 5천." 인서트 → '마이너스'에서 얼굴 클로즈업
function gfcalcScene(t, lt, a) {
  const run = a._run, ph = a.ph;
  // 입력 시각(장면 run 기준). s0 줄의 run = lt
  const s0d = ph === 0 ? 0 : TL.lines.find(l => l.id === 'z1').t0 - TL.lines.find(l => l.id === 's0').t0; // run - lt
  const tFive = ph === 1 ? gfW(a, ['오만', '5만', '50'], 2.7) : 99, tMinus = ph === 1 ? gfW(a, ['마이너스'], 2.6) : 99;
  const taps1 = [0.55, 0.7, 0.85, 1.0, 1.12].map(x => x), taps2 = [tFive - 0.1, tFive + 0.04, tFive + 0.17, tFive + 0.3, tFive + 0.43].map(x => x + s0d), tEq = tMinus - 0.12 + s0d;
  const taps = taps1.concat(taps2, [tEq]);
  const n1 = taps1.filter(x => run >= x).length, n2 = taps2.filter(x => run >= x).length, eq = run >= tEq;
  const seq1 = ['', '7', '75', '750', '7,500', '75,000'], seq2 = ['', '5', '50', '500', '5,000', '50,000'];
  let top = '', big = '0', red = false;
  if (n1) big = seq1[n1];
  if (n2) { top = '식대 7.5만'; big = seq2[n2]; }
  if (eq) { top = '5만 − 7.5만 ='; big = '−25,000'; red = true; }
  const blink = eq ? ((run - tEq) % 0.5 < 0.32 ? 1 : 0) : 1;
  const press = (() => { let p = -1; taps.forEach((x, i) => { if (run >= x && run < x + 0.09) p = i === taps.length - 1 ? 15 : [6, 9, 12, 12, 12, 9, 12, 12, 12, 12][i % 10]; }); return p; })();
  const tapK = taps.reduce((m, x) => Math.max(m, ACT.pulse(run, x - 0.06, 0.16)), 0);
  const cu = ph === 1 && lt >= tMinus - 0.12;
  const calc = { svg: `<g transform="translate(49 -26)">${gfCalcSvg(top, big, { red, on: blink, press })}</g>`, rot: 0 };
  // 얼굴: 인서트 동안은 아래(계산기)를 봄. 클로즈업: 걱정 눈썹 → 마지막에 작은 한숨
  const u = cu ? lt - tMinus : 0, sg = cu ? ACT.sigh(lt, a._dur - 0.55, 0.3, 0.7) : 0;
  const mouth0 = gfMouth(t, { v: ACT.VIS.M, o: 0, c: -2 }, -3), mouth = Object.assign({}, mouth0, { o: (mouth0.o || 0) * (cu ? 1 : 0.7) });
  const look = cu ? ACT.saccade(u, [[0, [0.05, 0.75]], [0.55, [0.1, 0.35]], [1.2, [0, 0.7]]], 0.06, 41) : [0.05, 0.85];
  const face = { eyes: { open: 1 - ACT.blinks(lt, [cu ? tMinus + 0.62 : 0.4], 0.17), flat: cu ? 0.12 : 0.3, size: cu ? 1 + 0.12 * ACT.pulse(u, 0.0, 0.4) : 0.95 }, brow: { worry: cu ? lerp(0.5, 0.9, gfK(u, 0, 0.4)) : 0.5, knit: cu ? 0 : 0.25 }, mouth, blush: 0.3,
    hfx: tt => cu ? ACT.sym('sweat', 282, 102, lt, tMinus + 0.35, 99) : '' };
  const zero = gfZero('_gf1', face, { t, pose: gfCalcPose(tapK), look, holdL: calc, handL: 'grip', handR: 'grip', handRotL: 90, handRotR: 90, headDy: cu ? -3 * sg + 2 * ACT.pulse(u, 0, 0.35) : 4, tilt: cu ? -3 : 0 });
  const cam = cu ? qLerpCam(u / 2.5, [960, 575, 2.15], [960, 568, 2.28]) : qLerpCam(run / 3.2, [978, 712, 3.25], [978, 708, 3.45]);
  const dark = ph === 0 ? 1 - easeInOut(gfK(lt, 0.25, 0.75)) : 0;
  let w = qPlate('room', cam, 0.45, { blur: true }) + qCam(cam, gfLampSvg() + zero + gfDesk() + gfInvSmall() + gfWallet(GF.WAL)) + gfNight(1);
  if (dark > 0) w += fFull('#000', dark);
  return gfDefs() + qDefs() + w;
}

/* =========== 2. 청첩장 + 마지막 대화(위에서 본 인서트) =========== */
function gfTopInv(t, lt, o = {}) {
  // 나무 책상 윗면(위에서 내려다봄) + 청첩장 + 폰
  let g = `<rect x="-300" y="-200" width="2600" height="1500" fill="#B98552"/><rect x="-300" y="-200" width="2600" height="1500" fill="url(#gfGrain)" transform="scale(1 3)"/>` +
    `<rect x="-300" y="-200" width="2600" height="1500" fill="#FFD58A" opacity=".08"/>`;
  // 청첩장
  g += `<g transform="translate(720 590) rotate(-5)"><rect x="-370" y="-260" width="740" height="520" rx="14" fill="#000" opacity=".18" transform="translate(12 16)"/><rect x="-370" y="-260" width="740" height="520" rx="14" fill="#FFF8EC" stroke="${INK}" stroke-width="8"/>` +
    `<rect x="-346" y="-236" width="692" height="472" rx="8" fill="none" stroke="#E8B4C0" stroke-width="5"/><path d="${zHeartP(0, -150, 1.3)}" fill="#E8637F" stroke="${INK}" stroke-width="5"/>` +
    fT(0, -66, '저희 결혼합니다', 46, '#8A6A5A') +
    (o.mark ? `<rect x="-192" y="-12" width="${f1(170 * o.mark)}" height="58" rx="10" fill="#FFE34D" opacity=".85"/>` : '') +
    fT(0, 34, '김민재 · 이수아', 62, INK) + fT(0, 112, '2026. 11. 14. 토요일 낮 12시', 34, '#6B5A50') + fT(0, 164, 'OO웨딩홀 3층 그랜드홀', 30, '#8A7A70') + `</g>`;
  // 폰(오른쪽): 마지막 대화
  g += `<g transform="translate(1460 560) rotate(7)"><rect x="-190" y="-360" width="380" height="720" rx="44" fill="#000" opacity=".2" transform="translate(12 16)"/><rect x="-190" y="-360" width="380" height="720" rx="44" fill="#22262E" stroke="${INK}" stroke-width="8"/>` +
    `<rect x="-166" y="-330" width="332" height="660" rx="24" fill="#B9D3E6"/><rect x="-166" y="-330" width="332" height="74" rx="24" fill="#9DBBD1"/><rect x="-166" y="-280" width="332" height="24" fill="#9DBBD1"/>` +
    fT(0, -282, '김민재', 34, INK) +
    `<rect x="-138" y="-176" width="276" height="48" rx="24" fill="#4F6A80"/>` + fT(0, -141, '2023년 11월 4일', 30, '#fff') +
    `<circle cx="-128" cy="-70" r="24" fill="#E7EDF2" stroke="${INK}" stroke-width="4"/><rect x="-92" y="-98" width="228" height="64" rx="18" fill="#fff" stroke="${INK}" stroke-width="4"/>` + fT(22, -56, '언제 밥 한번 먹자!', 25, INK) +
    `<rect x="40" y="-14" width="96" height="44" rx="16" fill="#FFE34D" stroke="${INK}" stroke-width="4"/>` + fT(88, 16, 'ㅇㅇ', 24, INK) +
    `<rect x="-166" y="262" width="332" height="68" fill="#fff" opacity=".7"/></g>`;
  // '3년 전' 빨간 동그라미(폰 좌표: 날짜 알약 둘레)
  if (o.circle) { const k = o.circle; g += `<g transform="translate(1460 560) rotate(7) translate(0 -152)"><path d="M-162 0 A162 40 0 1 1 -162 1" fill="none" stroke="#E5484D" stroke-width="9" stroke-linecap="round" stroke-dasharray="${f1(1100 * k)} 1100" transform="rotate(-2)"/></g>`; }
  return g;
}
function gfinvScene(t, lt, a) {
  const tMin = gfW(a, ['민재'], 0.75), tAgo = gfW(a, ['3년', '삼년', '년'], 2.9);
  const mk = easeOut(gfK(lt, tMin - 0.05, tMin + 0.35)), cir = easeInOut(gfK(lt, tAgo - 0.1, tAgo + 0.45));
  const tLast = gfW(a, ['마지막'], 2.8);
  const cam = lt < tLast - 0.1 ? qLerpCam(lt / 2.6, [880, 570, 1.08], [840, 570, 1.16]) : qLerpCam((lt - tLast + 0.1) / 0.7, [1300, 520, 1.45], [1420, 470, 1.75]);
  return gfDefs() + qCam(cam, gfTopInv(t, lt, { mark: mk, circle: cir })) + fFull('#0A1238', 0.12);
}

/* =========== 3. 짤랑! 본전이 등장 + 햄릿 =========== */
function gfpopScene(t, lt, a) {
  const ph = a.ph, run = a._run;
  // 지갑 들썩 → 덮개 열림 → 본전이 튀어나와 지갑 위에 착지(run 기준)
  const jig = run > 0.2 && run < 0.75 ? Math.sin(run * 48) * (1 - gfK(run, 0.55, 0.75)) : 0, open = easeOut(gfK(run, 0.72, 0.86)) * (1 - easeInOut(gfK(run, 1.25, 1.45)));
  const jumpK = gfK(run, 0.76, 1.22), land = run >= 1.22, wx = GF.WAL;
  let bx = wx, by = GF_WTOP + 8, bs = 1.1, sq = 1, sxq = 1;
  if (run < 0.76) by = GF_WTOP + 120; // 지갑 안(안 보임)
  else if (!land) { const u = jumpK; bx = wx + 20 * u; by = lerp(GF_WTOP + 60, GF_WTOP - 2, u) - Math.sin(u * Math.PI) * 230; sq = 1.12; sxq = 0.9; }
  else { const sp = A2.spring(run, 1.22, 3.2, 0.35); bx = wx + 20; by = GF_WTOP - 2; sq = 1 - 0.22 * (1 - Math.min(1, sp)) * Math.exp(-(run - 1.22) * 3); sxq = 2 - sq; }
  // 제로: 청첩장을 보다가 '짤랑'에 두 번 보기(0.95) → 뒤로 움찔
  const dt = ACT.pop(run, 0.98, 2.6, 0.3), back = run > 0.98 ? easeOut(gfK(run, 0.98, 1.2)) : 0;
  const LK = [[0, [-0.65, 0.45]], [0.95, [0.85, 0.15]], [1.15, [-0.3, 0.3]], [1.3, [0.9, 0.1]]];
  const look = ACT.saccade(run, LK, 0.05, 42);
  const zFace = { eyes: { open: 1 - ACT.blinks(run, [0.35, 1.18], 0.15), size: 1 + 0.25 * clamp(dt, 0, 1.3) * (run > 1.3 ? 1 : 0.6) }, brow: { raise: run > 0.98 ? 10 * clamp(dt, 0, 1) : 0, worry: 0.2 },
    mouth: run > 1.3 ? { v: ACT.VIS.O, o: 0.35 } : { v: ACT.VIS.M, o: 0, c: 1 }, blush: 0.3, hfx: tt => ACT.sym('!', 290, 46, run, 1.3, ph === 1 ? 2.2 : 99) };
  const zero = gfZero('_gf3', zFace, { t, pose: A2.pose({ hL: [168, 392], hR: [236, 392] }), look, tilt: -6 * (1 - back) + 4 * back, headDy: -6 * clamp(dt, 0, 1) * (run > 0.98 ? 1 : 0), x: GF.X - 14 * back, sy: 1 + 0.03 * ACT.pulse(run, 0.98, 0.3) });
  // 본전이 연기(ph1): '오만'에 왼손 봉투, '십만'에 오른손 봉투, '문제로다'에 두 팔 활짝 + 하늘 보기
  let co = { t, eyes: 'wide', mouth: 'O', sy: sq, sx: sxq, look: [-0.6, 0], legs: land ? 'stand' : 'jump' };
  if (land && ph === 0) co = Object.assign(co, { eyes: 'norm', mouth: 'grin', look: [0, 0], hL: [-70, -100], hR: [70, -100] });
  let spot = 0;
  if (ph === 1) { const tF = gfW(a, ['오만', '5만'], 0.6), tT = gfW(a, ['십만', '10만'], 1.6), tQ = gfW(a, ['문제', '그것이'], 2.6);
    const l1 = easeOutBack(gfK(lt, tF - 0.15, tF + 0.12)), l2 = easeOutBack(gfK(lt, tT - 0.15, tT + 0.12)), up = easeOutBack(gfK(lt, tQ - 0.1, tQ + 0.25));
    spot = easeOut(gfK(lt, 0, 0.35));
    const hL = [lerp(lerp(-58, -78, l1), -96, up), lerp(lerp(-40, -120, l1), -150, up)], hR = [lerp(lerp(58, 78, l2), 96, up), lerp(lerp(-40, -120, l2), -150, up)];
    const qv = lt > tQ ? Math.sin(lt * 34) * 2.5 * (1 - gfK(lt, tQ + 0.8, tQ + 1.4)) : 0;
    co = { t, eyes: lt > tQ ? 'shut' : 'norm', brow: lt > tQ ? 'worry' : 'up', mouth: 'O', talk: gfTalk(t), look: lt > tQ ? [0, -0.8] : lt > tT ? [0.5, -0.4] : lt > tF ? [-0.5, -0.4] : [0, 0],
      hL, hR, holdL: l1 > 0.05 ? `<g transform="translate(0 -22) scale(${f1(clamp(l1, 0, 1.2) * 100) / 100})">${gfEnv('5만', false, '안 가고')}</g>` : '', holdR: l2 > 0.05 ? `<g transform="translate(0 -22) scale(${f1(clamp(l2, 0, 1.2) * 100) / 100})">${gfEnv('10만', true, '가서')}</g>` : '',
      sy: 1 + 0.08 * up + qv * 0.004, sx: 1 - 0.03 * up, rot: qv, legs: 'stand' };
  }
  const coin = run >= 0.76 ? gfCoin(bx, by, bs, co) : '';
  const shadow = land ? qShadow(bx, GF_WTOP - 2, 44, 0.8) : '';
  const spotSvg = spot > 0 ? `<g opacity="${f1(spot * 100) / 100}"><path d="M${bx - 50} -40 L${bx + 50} -40 L${bx + 150} ${GF_WTOP} L${bx - 150} ${GF_WTOP} Z" fill="url(#gfSpot)"/><ellipse cx="${bx}" cy="${GF_WTOP}" rx="150" ry="22" fill="url(#gfPool)"/></g>` : '';
  const cam = ph === 0 ? GF_MED : qLerpCam(lt / 0.5, GF_MED, [1300, 590, 1.85]);
  let fx = '';
  if (ph === 0 && run > 0.76 && run < 1.5) fx += `<g opacity="${f1((1 - gfK(run, 1.2, 1.5)) * 100) / 100}">${[0, 1, 2, 3, 4].map(i => { const an = -Math.PI / 2 + (i - 2) * 0.45, r = 60 + 90 * gfK(run, 0.76, 1.05); return `<line x1="${f1(wx + Math.cos(an) * r)}" y1="${f1(GF_WTOP + Math.sin(an) * r)}" x2="${f1(wx + Math.cos(an) * (r + 34))}" y2="${f1(GF_WTOP + Math.sin(an) * (r + 34))}" stroke="#FFE34D" stroke-width="9" stroke-linecap="round"/>`; }).join('')}</g>`;
  const dim = spot * 0.35;
  const lit = spot > 0;
  return gfDefs() + qDefs() + qPlate('room', cam, 0.5) + qCam(cam, gfLampSvg() + zero + gfDesk() + gfInvSmall() + `<g transform="translate(${GF.CALC} ${GF.DT - 6}) rotate(-8) scale(1.25) translate(0 -62)">${gfCalcSvg('5만 − 7.5만 =', '−25,000', { red: true, stand: true })}</g>` + gfWallet(wx, open, jig) + shadow + fx + (lit ? '' : coin)) +
    gfNight(1) + (dim > 0 ? fFull('#05081A', dim) : '') + (lit ? qCam(cam, spotSvg + coin) : '');
}

/* =========== 4. 지갑 속 본전이의 방 =========== */
function gfwalletScene(t, lt, a) {
  const cam = qLerpCam(lt / Math.max(2.5, a._dur), [1000, 560, 1.12], [1090, 548, 1.2]), FL = 850;
  let g = `<rect x="-300" y="-200" width="2600" height="1500" fill="url(#gfLeather)"/><rect x="-200" y="-100" width="2320" height="1300" rx="60" fill="none" stroke="#D9A86C" stroke-width="8" stroke-dasharray="26 18"/>` +
    `<rect x="-300" y="${FL}" width="2600" height="500" fill="#4A2A12"/><line x1="-300" y1="${FL}" x2="2300" y2="${FL}" stroke="${INK}" stroke-width="7"/><path d="M-300 ${FL + 26} L2300 ${FL + 26}" stroke="#D9A86C" stroke-width="4" stroke-dasharray="20 14" opacity=".7"/>`;
  // 왼쪽: 카드 칸(선반)
  [0, 1, 2].forEach(i => { const y = 180 + i * 210; g += `<rect x="40" y="${y - 70}" width="380" height="120" rx="10" fill="${['#5DA9E9', '#F2B84B', '#7ED6A7'][i]}" stroke="${INK}" stroke-width="6"/>` +
    `<path d="M10 ${y} L460 ${y - 24} L460 ${y + 110} L10 ${y + 110} Z" fill="#8B5A2B" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M26 ${y + 14} L444 ${y - 8}" stroke="#D9A86C" stroke-width="4" stroke-dasharray="12 9"/>`; });
  // 오른쪽 벽: 영수증 가득(이름표 오른쪽)
  for (let i = 0; i < 9; i++) { const x = 1480 + (i % 3) * 180 + (i % 2) * 12, y = 220 + Math.floor(i / 3) * 210, r = (hash(i * 7) - 0.5) * 10, h = 150 + hash(i * 3) * 30;
    g += `<g transform="translate(${x} ${y}) rotate(${f1(r)})"><path d="M-58 0 L58 0 L58 ${f1(h)} L48 ${f1(h - 10)} L38 ${f1(h)} L28 ${f1(h - 10)} L18 ${f1(h)} L8 ${f1(h - 10)} L-2 ${f1(h)} L-12 ${f1(h - 10)} L-22 ${f1(h)} L-32 ${f1(h - 10)} L-42 ${f1(h)} L-58 ${f1(h)} Z" fill="#FBFAF4" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
      [0, 1, 2].map(j => `<rect x="-42" y="${24 + j * 32}" width="${f1(56 + hash(i * 5 + j) * 28)}" height="10" rx="5" fill="#C9C5BA"/>`).join('') + `<circle cx="0" cy="-6" r="9" fill="#E5484D" stroke="${INK}" stroke-width="3.5"/></g>`; }
  // 가운데: 저울(받은 것 1개 / 준 것 2개 → 본전이가 하나 더 올림). 무거운 '준 것'(오른쪽)이 처음부터 아래, 세 번째에 더 기운다
  const drop = easeOutBack(gfK(lt, 1.6, 1.9)), tilt = lerp(5, 13, easeInOut(gfK(lt, 1.85, 2.3))) + Math.sin(lt * 3) * 0.5, cx = 1000, cy = 640, rad = tilt * Math.PI / 180;
  const pan = (sd, lab, blocks) => { const px = cx + sd * 230 * Math.cos(rad), py = cy - 260 + sd * 230 * Math.sin(rad);
    return `<path d="M${f1(px)} ${f1(py)} L${f1(px - 90)} ${f1(py + 150)} M${f1(px)} ${f1(py)} L${f1(px + 90)} ${f1(py + 150)}" stroke="${INK}" stroke-width="5"/><path d="M${f1(px - 110)} ${f1(py + 150)} Q${f1(px)} ${f1(py + 200)} ${f1(px + 110)} ${f1(py + 150)} Z" fill="#E8C873" stroke="${INK}" stroke-width="6"/>` +
      blocks.map((b, i) => `<rect x="${f1(px - 60 + i * 44)}" y="${f1(py + 108 - (b || 0))}" width="38" height="38" rx="5" fill="#FFF8EC" stroke="${INK}" stroke-width="4"/>`).join('') + label(px, py + 232, lab, { size: 34, bg: '#fff' }); };
  g += `<rect x="${cx - 120}" y="${cy + 170}" width="240" height="40" rx="10" fill="#5B4636" stroke="${INK}" stroke-width="6"/><path d="M${cx} ${cy + 170} L${cx} ${cy - 260}" stroke="${INK}" stroke-width="12"/><circle cx="${cx}" cy="${cy - 262}" r="16" fill="#E8C873" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M${f1(cx - 230 * Math.cos(rad))} ${f1(cy - 260 - 230 * Math.sin(rad))} L${f1(cx + 230 * Math.cos(rad))} ${f1(cy - 260 + 230 * Math.sin(rad))}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>` +
    pan(-1, '받은 것', [0]) + pan(1, '준 것', lt > 1.6 ? [0, 0, (1 - clamp(drop, 0, 1)) * 120] : [0, 0]);
  // 본전이: 블록을 들고 와서 '준 것'에 올림 → 뿌듯하게 끄덕
  const walkK = easeInOut(gfK(lt, 0.2, 1.2)), bx = lerp(1640, 1440, walkK), hop = walkK > 0 && walkK < 1 ? Math.abs(Math.sin(lt * 14)) * 14 : 0, put = gfK(lt, 1.4, 1.65);
  const nod = ACT.pulse(lt, 2.35, 0.3) + ACT.pulse(lt, 2.7, 0.3);
  g += qShadow(bx, FL, 70, 0.8) + gfCoin(bx, FL - hop, 2.0, { t, eyes: lt > 2.3 ? 'happy' : 'norm', mouth: lt > 2.3 ? 'grin' : 'smile', look: [-0.7, -0.4], legs: hop > 4 ? 'jump' : 'stand',
    hL: [lerp(-62, -110, put), lerp(-70, -170, put)], hR: [64, -50], holdL: lt < 1.62 ? `<rect x="-19" y="-38" width="38" height="38" rx="5" fill="#FFF8EC" stroke="${INK}" stroke-width="4"/>` : '', rot: -6 * nod, sy: 1 - 0.04 * nod });
  // 이름표(왼쪽 위, 영수증과 안 겹침)
  const nk = ACT.symK(lt, 0.5, 99);
  g += nk > 0.01 ? `<g transform="translate(980 120) scale(${f1(nk * 100) / 100})">${label(0, 0, '본전이: 주고받는 건 뭐든 계산', { size: 46, bg: YEL })}</g>` : '';
  return gfDefs() + qCam(cam, g) + `<rect x="-300" y="-200" width="2600" height="1500" fill="#FFB547" opacity=".08"/>`;
}

/* =========== 5. 확률 원그래프 =========== */
function gfpieScene(t, lt, a) {
  const tOne = gfW(a, ['하나'], 0.6), tProb = gfW(a, ['확률'], 2.3), tYou = gfW(a, ['넌'], 3.7), tPlan = gfW(a, ['계획'], 4.7);
  const cam = qLerpCam(lt / 1.5, [1275, 560, 1.55], [1270, 555, 1.6]);
  // 본전이: 계산기 옆 책상 위. '하나'에 검지 하나(점프), 확률 앞에서 계산기 키를 주먹으로 쾅쾅쾅, '계획'에서 제로 쪽으로 돌아 위아래 훑기
  const bx = 1345, by = GF.DT - 16, hop = ACT.pulse(lt, tOne - 0.1, 0.32), turnK = lt > tYou - 0.1;
  const punch = [tProb - 0.75, tProb - 0.5, tProb - 0.25].reduce((m, x) => Math.max(m, ACT.pulse(lt, x, 0.18)), 0), punching = lt > tProb - 0.85 && lt < tProb;
  const scan = turnK ? Math.sin(gfK(lt, tYou + 0.1, tYou + 1.3) * Math.PI * 2) : 0;
  let co;
  if (turnK) co = { t, eyes: 'smug', brow: 'smug', mouth: 'smirk', talk: gfTalk(t), look: [-0.9, scan * 0.9], hL: [-58, -40], hR: [56, -36], legs: 'stand' };
  else if (punching) co = { t, eyes: 'norm', brow: 'angry', mouth: 'grin', talk: gfTalk(t), look: [-0.8, 0.6], hL: [-62, -44], hR: [lerp(60, 92, punch), lerp(-60, -20, punch)], legs: 'stand' };
  else co = { t, eyes: 'wide', brow: 'up', mouth: 'grin', talk: gfTalk(t), look: [-0.4, -0.3], hL: [-62, -44], hR: [52, -150], holdR: lt > tOne - 0.2 ? `<path d="M-3 -6 L-3 -28" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` : '', legs: hop > 0.2 ? 'jump' : 'stand' };
  co.sy = 1 + 0.08 * hop; co.sx = 1 - 0.04 * hop;
  const coin = qShadow(bx, by, 46, 0.8) + gfCoin(bx, by - 60 * hop, 1.1, co);
  // 계산기 화면: 주먹질마다 숫자, 끝에 '?%'
  const n = [tProb - 0.75, tProb - 0.5, tProb - 0.25].filter(x => lt >= x).length, disp = turnK ? '?%' : ['−25,000', '0.', '0.0', '0.00'][n];
  const calc = `<g transform="translate(${GF.CALC} ${GF.DT - 6}) rotate(-8) scale(1.25) translate(0 -62)">${gfCalcSvg(n ? '확률' : '5만 − 7.5만 =', disp, { red: n === 0 && !turnK, press: punch > 0.4 ? 3 : -1, stand: true })}</g>`;
  // 원그래프: '확률'에 등장해 룰렛처럼 돎 → '계획'에서 회색 + '?'
  const pk = ACT.symK(lt, tProb - 0.1, 99), spin = lt * 520, grey = easeInOut(gfK(lt, tPlan, tPlan + 0.4));
  let pie = '';
  if (pk > 0.01) { const cx = 1560, cy = 430, R = 110, f = 0.5 + 0.35 * Math.sin(lt * 7), A = f * Math.PI * 2, rot = turnK ? spin * (1 - grey) : spin;
    const sl = `<path d="M0 0 L${R} 0 A${R} ${R} 0 ${A > Math.PI ? 1 : 0} 1 ${f1(R * Math.cos(A))} ${f1(R * Math.sin(A))} Z" fill="${grey > 0.5 ? '#B8BEC8' : '#4CC38A'}" stroke="${INK}" stroke-width="6"/>`;
    pie = `<g transform="translate(${cx} ${cy}) scale(${f1(pk * 100) / 100})"><circle r="${R}" fill="${grey > 0.5 ? '#D5D9E0' : '#FFB4C2'}" stroke="${INK}" stroke-width="7"/><g transform="rotate(${f1(rot % 360)})">${sl}</g>` +
      (grey > 0.3 ? `<text y="44" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="130" fill="#fff" stroke="${INK}" stroke-width="10" paint-order="stroke" opacity="${f1(grey * 100) / 100}">?</text>` : '') + `</g>` + label(cx, cy - 160, '민재가 제로 결혼식에 올 확률', { size: 30, bg: '#fff' }) +
      (grey < 0.5 ? `<g transform="translate(${cx + 140} ${cy - 30})"><rect x="0" y="-14" width="26" height="26" rx="5" fill="#4CC38A" stroke="${INK}" stroke-width="4"/>${fT(36, 9, '온다', 28, '#fff', { anchor: 'start', stroke: INK })}<rect x="0" y="30" width="26" height="26" rx="5" fill="#FFB4C2" stroke="${INK}" stroke-width="4"/>${fT(36, 53, '안 온다', 28, '#fff', { anchor: 'start', stroke: INK })}</g>` : ''); }
  // 제로: 원그래프를 올려다봄 → '계획'에 본전이를 봄, 얼굴이 굳기 시작
  const LK = [[0, [0.75, 0.2]], [tProb, [0.5, -0.6]], [tYou, [0.85, 0.25]]], look = ACT.saccade(lt, LK, 0.06, 43);
  const freeze = gfK(lt, tPlan + 0.2, tPlan + 0.7);
  const zero = gfZero('_gf5', { eyes: { open: 1 - ACT.blinks(lt, ACT.saccadeBlinks(LK, 0.7), 0.15), flat: 0.4 * freeze, hl: freeze < 0.5 }, brow: { raise: 6 * (1 - freeze), worry: 0.15 }, mouth: { v: ACT.VIS.M, o: 0, c: lerp(1, 0, freeze) }, blush: 0.25 },
    { t, pose: A2.pose({ hL: [168, 392], hR: [236, 392] }), look, tilt: 3 * (1 - freeze) });
  return gfDefs() + qDefs() + qPlate('room', cam, 0.5) + qCam(cam, gfLampSvg() + zero + gfDesk() + gfInvSmall() + calc + gfWallet(GF.WAL) + coin + pie) + gfNight(1);
}

/* =========== 6. 어이없음: "…그건 왜 계산해." =========== */
function gfdeadScene(t, lt, a) {
  const run = a._run, ph = a.ph;
  // ph0(정지): 멍한 눈·일자 입 → 느린 깜빡 두 번 → 한쪽 눈썹 씰룩 / ph1: 맥 빠진 말
  const tw = ACT.pulse(run, 1.25, 0.28) + 0.6 * ACT.pulse(run, 1.5, 0.24);
  const speaking = ph === 1, mouth = speaking ? gfMouth(t, { v: ACT.VIS.M, o: 0, c: -1 }, -1) : null;
  const face = { eyes: { flat: 0.45, hl: false, open: 1 - ACT.blinks(run, [0.45, 0.95], 0.42), size: 0.97 }, brow: { asymR: 14 * tw }, mouth, mouthPath: 'M184 238 L216 238', blush: 0.2,
    fx: tt => ACT.sym('dots', 318, 92, run, 0.2, 1.2) };
  const look = ACT.saccade(run, [[0, [0.9, 0.2]], [1.65, [0.15, 0.05]]], 0.08, 44);
  const zero = gfZero('_gf6', face, { t, pose: A2.pose({ hL: [168, 392], hR: [236, 392] }), look, headDy: speaking ? 3 * ACT.pulse(lt, 0.3, 0.4) : 0, tilt: speaking ? -3 : 0 });
  const cam = qLerpCam(run / 4, [980, 590, 1.85], [975, 585, 1.95]);
  // 본전이: 오른쪽 끝에서 흐리게(어깨 너머 느낌), 원그래프 '?'
  const coin = qShadow(1345, GF.DT - 16, 46, 0.8) + gfCoin(1345, GF.DT - 16, 1.1, { t, eyes: 'smug', brow: 'smug', mouth: 'smirk', look: [-0.9, -0.2], hL: [-60, -40], hR: [58, -40] });
  const calc = `<g transform="translate(${GF.CALC} ${GF.DT - 6}) rotate(-8) scale(1.25) translate(0 -62)">${gfCalcSvg('확률', '?%', { stand: true })}</g>`;
  return gfDefs() + qDefs() + qPlate('room', cam, 0.4, { blur: true }) + qCam(cam, gfLampSvg() + zero + gfDesk() + gfInvSmall() + calc + gfWallet(GF.WAL) + coin) + gfNight(1);
}

/* =========== 7. 정보: 밥값 · 봉투 =========== */
function gfinfoScene(t, lt, a) {
  const tMeal = gfW(a, ['밥값'], 0.7), tDown = gfW(a, ['줄고'], 2.6), tUp = gfW(a, ['늘고'], 3.9);
  const cam = qLerpCam(lt / 5, [960, 560, 1.0], [980, 555, 1.04]);
  let g = '';
  // 판(가운데 큰 카드)
  const ck = easeOutBack(gfK(lt, 0.0, 0.35));
  g += `<g transform="translate(1110 500) scale(${f1(ck * 100) / 100}) translate(-1110 -500)"><rect x="440" y="110" width="1340" height="790" rx="36" fill="#000" opacity=".25" transform="translate(14 18)"/><rect x="440" y="110" width="1340" height="790" rx="36" fill="#FFFBF2" stroke="${INK}" stroke-width="9"/>` +
    fT(1110, 196, '요즘 결혼식 밥값과 봉투', 54, INK) + `<line x1="1110" y1="250" x2="1110" y2="860" stroke="${INK}" stroke-width="5" stroke-dasharray="14 12" opacity=".3"/>`;
  // 왼쪽: 식대
  const mk = easeOutBack(gfK(lt, tMeal - 0.1, tMeal + 0.25)), cnt = Math.round(75320 * easeOut(gfK(lt, tMeal, tMeal + 0.8)));
  g += `<g transform="translate(775 470)"><circle r="120" fill="#fff" stroke="${INK}" stroke-width="8"/><circle r="84" fill="none" stroke="${INK}" stroke-width="5" opacity=".35"/>` +
    `<path d="M-170 -60 L-170 60 M-185 -60 L-185 -20 Q-170 -6 -155 -20 L-155 -60" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M170 -60 Q195 -20 170 10 L170 60" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` +
    `<path d="M-46 -6 Q-34 -40 0 -40 Q34 -40 46 -6 Z" fill="#F2B84B" stroke="${INK}" stroke-width="5"/><rect x="-54" y="-8" width="108" height="16" rx="8" fill="#E8C873" stroke="${INK}" stroke-width="5"/></g>` +
    fT(775, 660, '서울 주요 웨딩홀 1인 평균 식대', 34, '#5A5A5A') +
    (mk > 0.01 ? `<g transform="translate(775 760) scale(${f1(mk * 100) / 100})">${fT(0, 0, cnt.toLocaleString('en-US') + '원', 84, '#D9480F')}</g>` : '') + (mk > 0.5 ? fT(775, 812, '▲ 5년 새 51% (2021년 49,740원)', 30, '#C92A2A') : '') + fT(775, 862, '세계일보 2026 · 서울 주요 웨딩홀 5곳', 26, '#7A7A7A');
  // 오른쪽: 봉투 더미(2023 → 2025)
  const dn = easeInOut(gfK(lt, tDown - 0.1, tDown + 0.7)), up = easeInOut(gfK(lt, tUp - 0.1, tUp + 0.7));
  const stack = (x, p0, pct, txt, col, hiK, moved, arrow) => { const n = Math.round(pct / 3.2), n0 = Math.round(p0 / 3.2), base = 760; let s = '';
    if (moved) s += `<rect x="${x - 80}" y="${base - n0 * 26 - 28}" width="160" height="${n0 * 26 + 6}" rx="8" fill="none" stroke="${col}" stroke-width="4" stroke-dasharray="12 9" opacity=".55"/>`;
    for (let i = 0; i < n; i++) s += `<g transform="translate(${x + (hash(i + x) - 0.5) * 10} ${base - i * 26})"><rect x="-70" y="-22" width="140" height="44" rx="4" fill="#fff" stroke="${INK}" stroke-width="4"/>${i === n - 1 ? `<text y="10" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="24" fill="${col}">${txt}</text>` : ''}</g>`;
    return s + `<g transform="translate(${x} ${base - Math.max(n, n0) * 26 - 50}) scale(${f1((1 + 0.15 * hiK) * 100) / 100})">${fT(0, 0, (moved ? arrow + ' ' : '') + pct.toFixed(1) + '%', 44, col)}</g>`; };
  g += stack(1300, 46.5, lerp(46.5, 42.3, dn), '5만', INK, ACT.pulse(lt, tDown + 0.6, 0.35), dn > 0.02, '▼') + stack(1580, 36.1, lerp(36.1, 39.7, up), '10만', '#C0392B', ACT.pulse(lt, tUp + 0.6, 0.35), up > 0.02, '▲') +
    fT(1300, 830, '5만 원 봉투', 30, INK) + fT(1580, 830, '10만 원 봉투', 30, '#C0392B') + fT(1440, 876, `${lt < tDown - 0.1 ? '2023년' : '2023 → 2025년'} · NH농협은행 축의금 거래`, 26, '#7A7A7A') + `</g>`;
  // 제로: 왼쪽 아래에서 판을 가리킴
  const pt = easeOutBack(gfK(lt, 0.25, 0.6)), aim = lt > tDown - 0.2 ? 1 : 0;
  const zero = qShadow(250, 1150, 80) + Z({ x: 250, y: 1150, s: 1.15, t, seed: 61, pose: A2.blend(A2.pose({}), A2.pose({ hR: [lerp(330, 352, aim), lerp(250, 300, aim)], bend: { aR: 1 } }), clamp(pt, 0, 1.1), 0.2), handR: pt > 0.4 ? 'point' : null, handRotR: lerp(-20, 0, aim),
    ex: (E['_gf7'] = ACT.face({ id: '_gf7', eyes: { open: 1 - ACT.natBlink(lt, 7) }, brow: { raise: 3 }, mouth: { v: ACT.VIS.M, o: 0, c: 3 }, blush: 0.35 }), fEx('_gf7')), noBlink: true, noMouth: true, look: lt > tDown - 0.2 ? [0.9, -0.1] : [0.8, -0.4] });
  return gfDefs() + qDefs() + qPlate('room', cam, 0.3, { blur: true }) + fFull('#0A1238', 0.45) + qCam(cam, g + zero);
}

/* =========== 8. 도장 쾅 + 송금 망설임(샘플 끝) =========== */
function gfPhoneTop(t, lt, o) {
  // 폰 인서트: 송금 화면(상표 없음) + 손(왼손 원형 손, 엄지 캡슐)
  const cx = 960, cy = 560;
  let g = `<rect x="-300" y="-200" width="2600" height="1500" fill="#1C2340"/><circle cx="960" cy="560" r="760" fill="url(#gfLamp)" opacity=".35"/>`;
  g += `<g transform="translate(${cx} ${cy}) rotate(-4)"><rect x="-250" y="-470" width="500" height="940" rx="56" fill="#22262E" stroke="${INK}" stroke-width="10"/><rect x="-222" y="-440" width="444" height="880" rx="34" fill="#F4F6FA"/>` +
    fT(0, -370, '송금', 40, INK) + fT(0, -290, '받는 사람  김민재', 32, '#5A6270') +
    `<rect x="-180" y="-240" width="360" height="110" rx="18" fill="#fff" stroke="#C9CED6" stroke-width="4"/>` + fT(0, -165, o.amount ? o.amount + '원' : '금액 입력', o.amount ? 64 : 40, o.amount ? INK : '#A0A6B0');
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const k = r * 3 + c, lab = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '←'][k], pr = o.press === k;
    g += `<rect x="${-170 + c * 120}" y="${-90 + r * 88}" width="100" height="70" rx="14" fill="${pr ? '#D8DCE3' : '#fff'}" stroke="#C9CED6" stroke-width="3"/>` + fT(-120 + c * 120, -42 + r * 88, lab, 34, INK); }
  g += `<rect x="-180" y="290" width="360" height="100" rx="24" fill="#3D7BF7" stroke="${INK}" stroke-width="5"/>` + fT(0, 356, '보내기', 44, '#fff') + `</g>`;
  // 손: 주황 소매 + 둥근 손 + 엄지(o.thumb = 엄지 끝)
  const [tx, ty] = o.thumb, hx = tx + 250, hy = ty + 200;
  g += `<path d="M1950 1450 L${f1(hx)} ${f1(hy)}" stroke="${INK}" stroke-width="170" stroke-linecap="round"/><path d="M1950 1450 L${f1(hx)} ${f1(hy)}" stroke="${TEE}" stroke-width="150" stroke-linecap="round"/>` +
    `<circle cx="${f1(hx)}" cy="${f1(hy)}" r="104" fill="#fff" stroke="${INK}" stroke-width="10"/>` +
    `<path d="M${f1(hx - 40)} ${f1(hy - 50)} L${f1(tx + 14)} ${f1(ty + 12)}" stroke="${INK}" stroke-width="80" stroke-linecap="round"/><path d="M${f1(hx - 40)} ${f1(hy - 50)} L${f1(tx + 14)} ${f1(ty + 12)}" stroke="#fff" stroke-width="62" stroke-linecap="round"/>` +
    `<ellipse cx="${f1(tx + 18)}" cy="${f1(ty + 14)}" rx="19" ry="14" transform="rotate(40 ${f1(tx + 18)} ${f1(ty + 14)})" fill="#EEF1F5" stroke="#C3CCD6" stroke-width="3"/>`;
  return g;
}
// 폰 화면 좌표(폰 가운데 기준) → 세계 좌표(폰은 (960,560)에서 -4도)
const gfPh = (x, y) => { const c = Math.cos(-4 * Math.PI / 180), s = Math.sin(-4 * Math.PI / 180); return [960 + x * c - y * s, 560 + x * s + y * c]; };
function gfstampScene(t, lt, a) {
  const ph = a.ph;
  if (ph === 1) {
    const tCon = gfW(a, ['결론'], 0.2), tLoss = gfW(a, ['손해'], 1.6), tBan = gfW(a, ['금지'], 2.6);
    if (lt < tLoss - 0.12) {
      // 판사처럼 도장을 치켜든 본전이(책상 위)
      const up = easeOutBack(gfK(lt, tCon - 0.1, tCon + 0.25)), cam = qLerpCam(lt / 1.2, [1300, 610, 1.9], [1310, 600, 2.0]);
      const coin = qShadow(1345, GF.DT - 16, 46, 0.8) + gfCoin(1345, GF.DT - 16, 1.15, { t, eyes: 'norm', brow: 'angry', mouth: 'O', talk: gfTalk(t), look: [-0.3, -0.2],
        hL: [-16, lerp(-60, -178, up)], hR: [16, lerp(-60, -178, up)], holdR: `<g transform="translate(-16 32) rotate(${f1(-8 * up)})">${gfStampSvg()}</g>`, sy: 1 + 0.06 * up });
      const zero = gfZero('_gf8', { eyes: { flat: 0.35, open: 1 - ACT.natBlink(lt, 8) }, brow: { worry: 0.3 }, mouth: { v: ACT.VIS.M, o: 0, c: -1 }, blush: 0.2 }, { t, pose: A2.pose({ hL: [168, 392], hR: [236, 392] }), look: [0.9, 0.1] });
      return gfDefs() + qDefs() + qPlate('room', cam, 0.5) + qCam(cam, gfLampSvg() + zero + gfDesk() + gfInvSmall() + gfWallet(GF.WAL) + coin) + gfNight(1);
    }
    // 위에서 본 청첩장에 도장 쾅
    const dn = lt < tBan ? easeIn(gfK(lt, tLoss - 0.12, tBan)) * 0.25 : 1, hit = lt >= tBan, lift = hit ? easeOut(gfK(lt, tBan + 0.25, tBan + 0.6)) : 0;
    const sy = hit ? lerp(-60, -700, lift) : lt < tBan - 0.12 ? lerp(-1000, -470, easeOut(gfK(lt, tLoss - 0.12, tLoss + 0.25))) + Math.sin(lt * 6) * 10 : lerp(-470, -60, easeIn(gfK(lt, tBan - 0.12, tBan))); const shake = hit ? Math.sin((lt - tBan) * 60) * 14 * Math.exp(-(lt - tBan) * 8) : 0;
    let g = gfTopInv(t, lt, { mark: 1, circle: 0 });
    if (hit) g += `<g transform="translate(700 600) rotate(-12)" opacity=".92"><rect x="-230" y="-80" width="460" height="160" rx="20" fill="none" stroke="#D62F2F" stroke-width="16"/>${fT(0, 38, '손해 금지', 108, '#D62F2F')}</g>`;
    const pre = lt < tBan - 0.12, sl = easeIn(gfK(lt, tBan - 0.12, tBan));
    const sc = hit ? lerp(1, 1.5, easeIn(lift)) : pre ? 1.4 + Math.sin(lt * 6) * 0.02 : lerp(1.4, 1.0, sl), oy = hit ? lerp(0, -1100, easeIn(lift)) : pre ? lerp(-900, -330, easeOut(gfK(lt, tLoss - 0.12, tLoss + 0.25))) : lerp(-330, 0, sl);
    g += `<ellipse cx="712" cy="612" rx="${f1(260 * (2.2 - sc))}" ry="${f1(100 * (2.2 - sc))}" fill="#000" opacity="${f1(clamp(0.45 - (sc - 1) * 0.5, 0, 0.45) * 100) / 100}"/>` +
      `<g transform="translate(700 ${f1(600 + oy)}) scale(${f1(sc * 100) / 100})"><rect x="-250" y="-90" width="500" height="180" rx="26" fill="#C0392B" stroke="${INK}" stroke-width="9"/><rect x="-82" y="-64" width="164" height="128" rx="22" fill="#5A2A1E" stroke="${INK}" stroke-width="8"/><circle r="76" fill="#8B3A2E" stroke="${INK}" stroke-width="9"/><circle cx="-24" cy="-26" r="20" fill="#fff" opacity=".3"/></g>`;
    if (hit && lt < tBan + 0.35) g += [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const an = i / 8 * Math.PI * 2, r = 300 + 200 * gfK(lt, tBan, tBan + 0.3); return `<line x1="${f1(700 + Math.cos(an) * r)}" y1="${f1(600 + Math.sin(an) * r * 0.6)}" x2="${f1(700 + Math.cos(an) * (r + 70))}" y2="${f1(600 + Math.sin(an) * (r + 70) * 0.6)}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>`; }).join('');
    return gfDefs() + `<g transform="translate(${f1(shake)} ${f1(shake * 0.5)})">${qCam([940, 560, 1.06], g)}</g>` + fFull('#0A1238', 0.12) + (hit && lt < tBan + 0.6 ? fx(t, t - lt + tBan, t - lt + tBan + 0.6, 1180, 190, '쾅!', '#FFE34D', { size: 110, rot: -10 }) : '');
  }
  // ph2(s2): 송금 50,000 입력 → 엄지가 '보내기' 앞에서 나갔다 들어오기 ×2 → 제로 얼굴(망설임) → 정지 + 세피아
  const FZ = 3.0, L = Math.min(lt, FZ), sep = easeInOut(gfK(lt, FZ, a._dur));
  let w;
  if (L < 1.75) {
    const taps = [0.15, 0.27, 0.39, 0.51, 0.63], n = taps.filter(x => L >= x).length, amount = ['', '5', '50', '500', '5,000', '50,000'][n];
    const keyOf = [4, 10, 10, 10, 10], ti = Math.max(0, n - 1), press = taps.findIndex(x => L >= x && L < x + 0.08), key = press >= 0 ? keyOf[press] : -1;
    const kp = k => gfPh(-120 + (k % 3) * 120, -55 + Math.floor(k / 3) * 88), out = [1260, 1010], near = gfPh(112, 352);
    let thumb;
    if (L < 0.72) { const k = keyOf[Math.min(taps.length - 1, taps.findIndex(x => L < x + 0.1) < 0 ? 4 : taps.findIndex(x => L < x + 0.1))], [kx, ky] = kp(k), dip = taps.reduce((m, x) => Math.max(m, ACT.pulse(L, x - 0.05, 0.12)), 0);
      thumb = [kx + 18 * (1 - dip), ky + 22 * (1 - dip)]; }
    else { const K = [[0.72, 0.15], [0.85, 0], [1.08, 0.9], [1.22, 0.88], [1.38, 0.3], [1.58, 0.98], [1.75, 0.97]];
      let i = 0; while (i + 1 < K.length && L >= K[i + 1][0]) i++; const [ta, va] = K[i], [tb, vb] = K[Math.min(i + 1, K.length - 1)], rk = tb > ta ? lerp(va, vb, easeInOut(clamp((L - ta) / (tb - ta), 0, 1))) : va;
      const tr = L > 1.58 ? Math.sin(L * 42) * 5 : 0; thumb = [lerp(out[0], near[0], rk) + tr, lerp(out[1], near[1], rk)]; }
    w = gfDefs() + qCam(qLerpCam(L / 1.75, [960, 560, 1.0], [970, 600, 1.12]), gfPhoneTop(t, L, { amount, press: key, thumb }));
  } else {
    const u = L - 1.75, LK = [[0, [0.3, 0.8]], [0.35, [-0.7, 0.4]], [0.7, [0.3, 0.8]], [1.0, [-0.6, 0.5]]], look = ACT.saccade(u, LK, 0.05, 45);
    const zero = gfZero('_gf9', { eyes: { open: 1 - ACT.blinks(u, ACT.saccadeBlinks(LK, 0.9), 0.15), size: 1.04 }, brow: { knit: 0.4, worry: 0.75 }, mouth: { style: 'bite', c: 0 }, blush: 0.35,
      hfx: tt => ACT.sym('sweat', 282, 102, u, 0.1, 99) }, { t, pose: A2.pose({ hL: [180, 360], hR: [220, 372] }), look, holdL: { svg: cxPhone, rot: -10 }, handL: 'grip', tilt: -3 + Math.sin(u * 6) * 1.5 });
    const cam = qLerpCam(u / 1.3, [960, 600, 1.75], [960, 590, 1.9]);
    const coin = qShadow(1345, GF.DT - 16, 46, 0.8) + gfCoin(1345, GF.DT - 16, 1.1, { t, eyes: 'norm', brow: 'angry', mouth: 'grin', look: [-0.9, 0.1], hL: [-34, -58], hR: [34, -58] });
    const calc = `<g transform="translate(${GF.CALC} ${GF.DT - 6}) rotate(-8) scale(1.25) translate(0 -62)">${gfCalcSvg('확률', '?%', { stand: true })}</g>`;
    w = gfDefs() + qDefs() + qPlate('room', cam, 0.45, { blur: true }) + qCam(cam, gfLampSvg() + zero + gfDesk() + gfInvSmall() + calc + gfWallet(GF.WAL) + coin) + gfNight(1);
  }
  if (sep > 0) w += `<rect x="-300" y="-200" width="2600" height="1500" fill="#7A5A30" style="mix-blend-mode:color" opacity="${f1(sep * 92) / 100}"/><rect x="-300" y="-200" width="2600" height="1500" fill="#F3DFB8" opacity="${f1(sep * 18) / 100}"/>`;
  return w;
}
