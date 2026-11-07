/* 혈액형 편 v3 — B·O·AB형, 공통 장면, 아웃트로. bscenes.js 다음에 불러온다. 이름은 모두 b 접두사. */
Object.assign(QBG, { pub: 'ai/pub.png', forest: 'ai/forest.png', snow: 'ai/snow.png', dawn: 'ai/dawn.png', meadow: 'ai/meadow.png', sea: 'ai/sea.png' });
const BNEW = ['bclock', 'bGtalk', 'bGdx', 'bGbye', 'bPhilo', 'bCard', 'bBenter', 'bBflash', 'bBcool', 'bBroll', 'bNsheep', 'bNamor', 'bBcorner', 'bBfire', 'bBup',
  'bOenter', 'bOfall', 'bOmeet', 'bOcry', 'bZtree', 'bOboat', 'bOtree', 'bOsleep', 'bXenter', 'bXsee', 'bXcold', 'bHog', 'bXsoft', 'bXstep', 'bdawn', 'bsteps'];
BNEW.forEach(k => CAMS[k] = 'fixed');
P['앉기'] = { armL: [[148, 285], [142, 350], [186, 382]], hL: [190, 384], armR: [[252, 285], [258, 350], [214, 382]], hR: [210, 384], legL: [[180, 412], [120, 418], [128, 498]], fL: [120, 510, 0], legR: [[220, 412], [280, 418], [272, 498]], fR: [280, 510, 0], dy: 96 };
P['털기'] = bPose('서기', { armL: [[148, 285], [130, 340], [150, 380]], hL: [156, 384], armR: [[252, 285], [270, 340], [250, 380]], hR: [244, 384] });
const GX = { A: { talk: '울먹', pose: '가슴' }, B: { talk: 'B울음', pose: '머리감싸' }, O: { talk: '신남', pose: '만세' }, AB: { talk: '심드렁', pose: '서기' } };
const bEx = k => ({ expr: k, prev: k, k: 1, blink: 0 });
const bTear = (x, y, lt, n = 2, col = '#9ED8FF') => { let h = ''; for (let i = 0; i < n; i++) { const ph = (lt * 1.2 + i / n) % 1; h += `<path d="M${f1(x - 40 + i * 80)} ${f1(y + 30 + ph * 60)} q-8 14 0 20 q8 -6 0 -20 Z" fill="${col}" stroke="${INK}" stroke-width="3" opacity="${f1((1 - ph) * 100) / 100}"/>`; } return h; };
const bBed = (x0 = 1000, dark = 0) => `<rect x="${x0}" y="860" width="760" height="120" rx="20" fill="${dark ? '#8C88A6' : '#E9E6F2'}" stroke="${INK}" stroke-width="8"/><rect x="${x0}" y="960" width="760" height="40" fill="#6E6286" stroke="${INK}" stroke-width="8"/><rect x="${x0 + 700}" y="700" width="60" height="300" rx="12" fill="#6E6286" stroke="${INK}" stroke-width="8"/><rect x="${x0 + 560}" y="820" width="150" height="56" rx="24" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
const bLie = (gt, x, y, t, o = {}) => `<g transform="translate(${f1(x)} ${f1(y)})">${bGuest(gt, t, Object.assign({ x: 0, y: 0, s: 0.9, rot: 90, badge: false, bundle: false, pose: '서기', ex: bEx('지침') }, o))}</g>`;
const bHourglass = (x, y, s, rot, sand) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><rect x="-60" y="-104" width="120" height="16" rx="6" fill="#8A5A34" stroke="${INK}" stroke-width="6"/><rect x="-60" y="88" width="120" height="16" rx="6" fill="#8A5A34" stroke="${INK}" stroke-width="6"/>` +
  `<path d="M-44 -88 L44 -88 Q44 -30 6 0 Q44 30 44 88 L-44 88 Q-44 30 -6 0 Q-44 -30 -44 -88 Z" fill="#E6F6FF" fill-opacity=".5" stroke="${INK}" stroke-width="6"/>` +
  `<path d="M${f1(-40 * sand)} ${f1(-4 - 70 * sand)} L${f1(40 * sand)} ${f1(-4 - 70 * sand)} L0 -4 Z" fill="#F2C14E"/><path d="M-40 86 L40 86 L${f1(40 * (1 - sand) + 4)} ${f1(86 - 66 * (1 - sand))} L${f1(-40 * (1 - sand) - 4)} ${f1(86 - 66 * (1 - sand))} Z" fill="#F2C14E"/>${sand > 0.02 ? `<line x1="0" y1="-4" x2="0" y2="84" stroke="#F2C14E" stroke-width="4"/>` : ''}</g>`;
const bClock = (x, y, s, txt, on = 1, col = '#FF6A3D') => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-150" y="-66" width="300" height="132" rx="18" fill="#120A10" stroke="${INK}" stroke-width="8"/><g filter="url(#bneon)" opacity="${on}">${bTxt(0, 30, txt, 84, '#FFE2D6', { stroke: col, sw: 5 })}</g></g>`;
const bPhiloBody = (who, o) => who === 'MA' ? MAo(o.t, o) : who === 'NZ' ? HALO(NZ(o)) : who === 'ZH' ? ZH(o) : HALO(bSH(o));
const bGrey = (x, y, s, t, seed, o = {}) => HALO(char(Object.assign({ goggles: 'none', vest: ['#7D8597', '#8E8A9B', '#6F7A8C', '#8A8F99'][seed % 4], patch: false, tee: true, hair: '#2F2F33', x, y, s, t, seed: 40 + seed, pose: '서기', ex: bEx('지침') }, o)));
const bSheep = (x, y, s, t, ph) => { const b = Math.abs(Math.sin(t * 8 + ph)) * 8; return `<g transform="translate(${f1(x)} ${f1(y - b)}) scale(${s})"><g stroke="${INK}" stroke-width="6">` +
  `<line x1="-40" y1="20" x2="-44" y2="70"/><line x1="40" y1="20" x2="44" y2="70"/></g><ellipse cx="0" cy="0" rx="80" ry="56" fill="#fff" stroke="${INK}" stroke-width="7"/>` + [-50, -20, 10, 40].map(dx => `<circle cx="${dx}" cy="-46" r="20" fill="#fff" stroke="${INK}" stroke-width="5"/>`).join('') +
  `<ellipse cx="82" cy="-14" rx="30" ry="24" fill="#3B3A44" stroke="${INK}" stroke-width="6"/><circle cx="92" cy="-20" r="5" fill="#fff"/></g>`; };
const bHedge = (x, y, s, t, o = {}) => { let sp = ''; for (let i = 0; i < 13; i++) { const an = Math.PI * (1.05 + i / 12 * 0.95); sp += `<path d="M${f1(Math.cos(an - 0.13) * 70)} ${f1(Math.sin(an - 0.13) * 50)} L${f1(Math.cos(an) * 112)} ${f1(Math.sin(an) * 88)} L${f1(Math.cos(an + 0.13) * 70)} ${f1(Math.sin(an + 0.13) * 50)} Z" fill="#7A5634" stroke="${INK}" stroke-width="4"/>`; }
  const sh = o.shiver ? Math.sin(t * 50 + x) * 3 : 0, fl = o.flip ? -1 : 1;
  return `<g transform="translate(${f1(x + sh)} ${f1(y)}) scale(${f1(s * fl * 100) / 100} ${s})"><ellipse cx="0" cy="54" rx="80" ry="12" fill="#000" opacity=".18"/>${sp}<ellipse cx="0" cy="0" rx="86" ry="56" fill="#9A7048" stroke="${INK}" stroke-width="6"/>` +
    `<ellipse cx="66" cy="10" rx="40" ry="32" fill="#E9CFA8" stroke="${INK}" stroke-width="5"/><circle cx="104" cy="12" r="8" fill="${INK}"/><circle cx="70" cy="0" r="6" fill="${INK}"/>${o.ouch ? `<path d="M56 -10 l14 8 M56 4 l14 -8" stroke="${INK}" stroke-width="4"/>` : ''}<ellipse cx="54" cy="22" rx="8" ry="5" fill="#F29AA8" opacity="${o.warm ? 0.9 : 0}"/></g>`; };
const bWord = (a, k, fb) => bAt(a, k, fb);

/* ---------- shared ---------- */
function bclockScene(t, lt, a) { // "한 명당 딱 1분": the neon clock and the hourglass flip
  const tF = bAt(a, '한', 1.2), flip = easeInOut(clamp((lt - tF) / 0.45, 0, 1)), cam = qLerpCam(lt / 3, [960, 560, 1.0], [960, 560, 1.12]);
  let w = bClock(960, 330, 1.5, (lt % 1) < 0.5 ? '03:58' : '03 58') + bHourglass(960, 760, 1.6, 180 * flip - 180, flip < 1 ? 1 : 1 - clamp((lt - tF - 0.45) / 30, 0, 1));
  if (lt > tF + 0.4) w += pop(t, t - lt + tF + 0.4, t + 9, 1380, 760, label(0, 0, '1인당 1분', { size: 46, bg: '#FFE34D' }), { rot: 6 });
  return bPlate('shopc', cam, 0.3, { blur: true }) + bFull('#0B0712', 0.6) + qCam(cam, w) + bFull('#FF2A2A', (lt % 0.6) < 0.1 ? 0.05 : 0);
}
function bticketScene(t, lt, a) { // overrides the A-only version: number board + type + hourglass + clock
  const k = easeOutBack(clamp(lt / 0.4, 0, 1)), blink = lt < 1.0 ? (Math.floor(lt * 6) % 2 ? 0.55 : 1) : 1, n = a.n || 1, ty = a.type || 'A';
  let w = `<g transform="translate(960 440) scale(${f1(k * 100) / 100})"><rect x="-300" y="-150" width="600" height="300" rx="30" fill="#1A1420" stroke="${INK}" stroke-width="12"/><rect x="-270" y="-120" width="540" height="140" rx="12" fill="#0A0608"/>` +
    `<g opacity="${blink}" filter="url(#bneon)">${bTxt(0, -18, '00' + n, 120, '#FF6A3D', { stroke: '#FF3A20', sw: 4 })}</g>${bTxt(0, 96, ['첫', '두', '세', '네'][n - 1] + ' 번째 손님', 46, '#fff')}</g>`;
  w += pop(t, t - lt + 0.45, t + 9, 960, 735, `<circle r="74" fill="${BTC[ty]}" stroke="${INK}" stroke-width="10"/>${bTxt(0, ty.length > 1 ? 26 : 34, ty, ty.length > 1 ? 72 : 96, '#fff', { stroke: INK, sw: 10 })}`, {});
  w += pop(t, t - lt + 0.7, t + 9, 960, 880, outlined(0, 0, [a.title], { size: 46, sw: 10 }), {});
  const fl = easeInOut(clamp((lt - 0.6) / 0.4, 0, 1));
  w += bHourglass(380, 640, 1.2, 180 * fl - 180, 1 - clamp((lt - 1.0) / 6, 0, 0.2)) + (a.clock ? bClock(1560, 230, 0.9, a.clock, 1) : '');
  return bPlate('shopc', [960, 560, 1.05], 0.3, { blur: true }) + bFull('#0B0712', 0.55) + w;
}
function bGtalkScene(t, lt, a) { // guest close-up with lip-sync; type-specific beats
  const gt = a.gt, g = GX[gt], cam = qLerpCam(lt / 6, [AX, 600, 2.1], [AX - 10, 610, 2.28]);
  E['_bG'] = Object.assign({}, qTalk(g.talk, env(t)), gt === 'A' || gt === 'B' ? { sweat: true } : {});
  const o = { x: AX, y: AY, s: 1, pose: g.pose, ex: bEx('_bG'), look: [-0.9, -0.1], badge: false };
  let back = '', front = '', over = '';
  if (gt === 'B') { o.rot = Math.sin(lt * 5) * 4; const [hx, hy] = bHead(AX, AY); front += bTear(hx, hy + 20, lt, 3); if (lt > bAt(a, '질렀', 0.6) && lt < bAt(a, '질렀', 0.6) + 0.9) over += fx(t, t - lt + bAt(a, '질렀', 0.6), t + 9, 1050, 240, '으아악!', '#FFD23F', { size: 70 }); }
  if (gt === 'O') { o.shiver = true; o.look = [0, 0]; const [hx, hy] = bHead(AX, AY); front += `<path d="M${hx + 100} ${hy - 60} q-10 18 0 26 q10 -8 0 -26 Z" fill="#9ED8FF" stroke="${INK}" stroke-width="3"/>`; }
  if (gt === 'AB') { o.look = [-0.6, 0.2];
    const tW = bAt(a, '벽', 2.8), tL = bAt(a, '외로', 4.6), wk = clamp((lt - tW) / 0.5, 0, 1);
    if (wk > 0) { let br = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) br += `<rect x="${1050 + c * 130 + (r % 2) * 65}" y="${1180 - r * 62}" width="124" height="56" fill="#B5543E" stroke="${INK}" stroke-width="5"/>`; front += `<g transform="translate(0 ${f1((1 - easeOutBack(wk)) * 260)})">${br}</g>`; }
    if (lt > tL) over += bFull('#1B3A6B', 0.28 * clamp((lt - tL) / 0.8, 0, 1)) + `<rect x="-20" y="-20" width="1960" height="1120" fill="none" stroke="#DDF2FF" stroke-width="${f1(70 * clamp((lt - tL) / 1.2, 0, 1))}" opacity=".55" filter="url(#qblur)"/>`;
  }
  const body = qShadow(AX, AY, 66) + back + bGuest(gt, t, o) + front;
  return bPlate('shopc', [cam[0] - 300, cam[1], cam[2]], 0.3, { blur: true }) + qCam(cam, body) + over + (gt === 'AB' ? '' : warm(0.2));
}
function bGdxScene(t, lt, a) { // diagnosis sheet + stamp, any type
  const gt = a.gt, tS = bAt(a, '타인', 1.2), slam = prog(lt, tS - 0.18, tS), cam = qLerpCam(lt / 4, [960, 560, 1.0], [960, 560, 1.07]);
  let inner = `<rect x="-320" y="-300" width="640" height="76" fill="#3DBA8A"/>${bTxt(0, -248, '진 단 서', 46, '#fff')}`;
  inner += bTxt(-270, -150, '환자', 34, '#777', { anchor: 'start' }) + `<circle cx="-110" cy="-162" r="30" fill="${BTC[gt]}" stroke="${INK}" stroke-width="5"/>` + bTxt(-110, -150, gt, gt.length > 1 ? 26 : 34, '#fff', { stroke: INK, sw: 5 }) + bTxt(-66, -150, '형 손님', 34, INK, { anchor: 'start' });
  inner += bTxt(-270, -60, '증상', 34, '#777', { anchor: 'start' }) + bTxt(-160, -60, a.sym, 30, INK, { anchor: 'start' }) + bTxt(-270, 30, '진단명', 34, '#777', { anchor: 'start' });
  [0, 1].forEach(i => inner += `<line x1="-270" y1="${110 + i * 70}" x2="270" y2="${110 + i * 70}" stroke="#D8D0C0" stroke-width="5"/>`);
  const sz = a.dx.length > 8 ? 52 : 64;
  let w = bPaper(960, 560, 640, 600, -2, inner) + bStamp(960, 680, a.dx, slam, { after: lt - tS, rot: -7, size: sz });
  if (slam >= 1 && lt - tS < 0.25) w += speedLines(960, 680, 330, 420, 14, t, '#fff', 0.7);
  if (lt < tS + 0.1) { const hy = lerp(200, 640, easeIn(clamp((lt - tS + 0.5) / 0.5, 0, 1))); w += `<g transform="translate(1260 ${f1(hy - 300)})"><rect x="-40" y="-120" width="80" height="160" rx="14" fill="#7A4E2E" stroke="${INK}" stroke-width="7"/><rect x="-70" y="40" width="140" height="44" rx="8" fill="#D63A3A" stroke="${INK}" stroke-width="7"/></g>`; }
  return bPlate('shopc', cam, 0.3, { blur: true }) + bFull('#0B0712', 0.4) + qCam([960, 560, 1 + (slam >= 1 ? 0.03 * Math.exp(-(lt - tS) * 6) : 0)], w);
}
function bGbyeScene(t, lt, a) { // prescription in hand, a bow, out the door
  const gt = a.gt, cam = qLerpCam(lt / 2.4, [1300, 620, 1.12], [1360, 620, 1.18]);
  const bow = Math.sin(clamp((lt - 0.1) / 0.6, 0, 1) * Math.PI), go = clamp((lt - 0.8) / 1.4, 0, 1), x = lerp(AX, 2150, easeIn(go));
  let w = qShadow(ZC[0], ZC[1], 70) + bZero(t, { x: ZC[0], y: ZC[1], s: 1, pose: lt > 0.9 ? '손인사' : '카운터', ex: bEx('미소'), look: [0.9, 0] }) + bCounter(520, 1400, CTOP);
  const door = clamp((lt - 1.4) / 0.3, 0, 1) * (1 - clamp((lt - 2.1) / 0.3, 0, 1));
  w += `<rect x="1990" y="40" width="${f1(110 * door)}" height="950" fill="#2C3A5C" opacity=".8"/>`;
  const ex = { A: '뿌듯', B: 'B기본', O: '미소', AB: '미소' }[gt];
  w += qShadow(x, AY, 66) + bGuest(gt, t, { x, y: AY, s: 0.95, rot: bow * 22, pose: go > 0 ? walkPose(lt * 9, 0.8) : '안기', ex: bEx(ex), look: [-0.6, 0], bundle: false });
  if (go < 0.8) { const h = ptOf(x, AY, 0.95, 200, 360); w += `<g transform="translate(${f1(h[0])} ${f1(h[1])}) rotate(-8)"><rect x="-40" y="-52" width="80" height="104" rx="6" fill="#FBF7EE" stroke="${INK}" stroke-width="5"/><rect x="-40" y="-52" width="80" height="22" rx="6" fill="#3DBA8A" stroke="${INK}" stroke-width="5"/></g>`; }
  return bPlate('shop', cam, 0.5) + qCam(cam, w) + (lt > 1.5 ? fx(t, t - lt + 1.5, t + 9, 1700, 260, '딸랑~', '#FFE9A8', { size: 56 }) : '');
}
function bPhiloScene(t, lt, a) { // the philosopher appears in a puff; name card; the guest reacts
  const tN = bAt(a, '마르', 2.0), cam = qLerpCam(lt / 5, [1180, 620, 1.15], [1180, 610, 1.22]), g = clamp((lt - tN + 0.35) / 0.45, 0, 1), gt = a.gt;
  let w = qShadow(ZC[0], ZC[1], 70) + bZero(t, { x: ZC[0], y: ZC[1], s: 1, pose: lt > tN - 0.4 ? '손인사' : '카운터', ex: bEx('미소'), look: [0.9, 0] }) + bCounter(520, 1400, CTOP);
  if (g > 0) {
    const o = { t, x: 1740, y: AY + (1 - easeOutBack(g)) * 40, s: 1.0, sy: 1 + 0.08 * (1 - g), pose: '서기', ex: bEx(a.who === 'SH' ? '심드렁' : a.who === 'ZH' ? '미소' : '결심'), look: [-0.6, 0], seed: 82 };
    w += qShadow(1740, AY, 70 * g) + bPhiloBody(a.who, o) + puff(1740, AY - 260, t, t - lt + tN - 0.35, 1.8, '#F4EAD0');
    if (a.who === 'NZ') { const [hx, hy] = ptOf(1740, o.y, 1, 286, 406); w += `<g transform="translate(${f1(hx)} ${f1(hy)}) rotate(${f1(-30 + Math.sin(t * 3) * 6)})"><rect x="-8" y="-150" width="16" height="160" rx="6" fill="#8A5A34" stroke="${INK}" stroke-width="5"/><rect x="-46" y="-190" width="92" height="52" rx="8" fill="#6B7383" stroke="${INK}" stroke-width="6"/></g>`; }
    if (a.who === 'ZH') for (let i = 0; i < 4; i++) { const ph = (lt * 0.7 + i * 0.25) % 1; w += `<path d="M${f1(1500 + ph * 500)} ${f1(560 + i * 70)} q60 -26 120 0 q40 18 70 -6" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="${f1(Math.sin(ph * Math.PI) * 0.8 * 100) / 100}"/>`; }
    if (g > 0.6) w += rSparks(1740, AY - 640, t, 6, 120);
  }
  w += qShadow(AX - 40, AY, 66) + bGuest(gt, t, { x: AX - 40, y: AY, s: 0.95, pose: g > 0.3 ? '만세' : GX[gt].pose, ex: bEx(g > 0.3 ? (gt === 'B' ? 'B기본' : '놀람') : (gt === 'B' ? 'B울음' : '걱정')), look: [g > 0.3 ? 0.9 : -0.9, 0], sy: g > 0.3 ? 1 + 0.06 * Math.exp(-(lt - tN) * 6) : 1, bundle: gt !== 'O' || true });
  const lab = pop(t, t - lt + tN + 0.3, t + 9, 1560, 300, `<rect x="-290" y="-70" width="580" height="140" rx="20" fill="#3B2350" stroke="${INK}" stroke-width="7"/>${bTxt(0, -4, a.name, a.name.length > 8 ? 40 : 48, '#FFE9A8')}${bTxt(0, 44, a.sub, 26, '#E9DFF5')}`, { rot: -2 });
  return bPlate('shop', cam, 0.5) + qCam(cam, w) + qCam(cam, lab);
}
function bCardScene(t, lt, a) { // a big concept card
  const tT = bAt(a, 'T', 0.6), cam = qLerpCam(lt / 4, [960, 560, 1.0], [960, 560, 1.06]);
  let w = `<rect x="-300" y="-200" width="2600" height="1500" fill="#F3EEE3"/><rect x="-300" y="-200" width="2600" height="1500" fill="url(#paper)"/><circle cx="960" cy="520" r="${f1(420 + Math.sin(t) * 10)}" fill="${a.col}" opacity=".25"/>`;
  w += pop(t, t - lt + tT, t + 99, 960, a.han ? 470 : 520, outlined(0, 0, [a.big], { size: a.big.length > 6 ? 100 : 140, sw: 18, fill: '#fff' }), {});
  if (a.han) w += pop(t, t - lt + tT + 0.3, t + 99, 960, 610, bTxt(0, 0, a.han, 60, '#8A7A5A'), {});
  w += pop(t, t - lt + tT + 0.6, t + 99, 960, a.han ? 740 : 680, label(0, 0, a.sub, { size: 44, bg: a.col }), {});
  return qCam(cam, w);
}

/* ---------- B ---------- */
function bBenterScene(t, lt, a) { // door slams, swagger ... knees, wailing
  const cam = qLerpCam(lt / 3.2, [1260, 620, 1.12], [1320, 640, 1.2]);
  const g = clamp((lt - 0.2) / 1.2, 0, 1), x = lerp(2080, AX, easeOut(g)), down = lt > 1.7;
  let w = `<rect x="1990" y="40" width="${f1(110 * clamp(lt / 0.15, 0, 1) * (1 - clamp((lt - 1.4) / 0.3, 0, 1)))}" height="950" fill="#2C3A5C" opacity=".8"/>`;
  w += qShadow(ZC[0], ZC[1], 70) + bZero(t, { x: ZC[0], y: ZC[1], s: 1, pose: '카운터', ex: bEx(lt > 0.15 ? '놀람' : '심드렁'), look: [0.9, 0] }) + bCounter(520, 1400, CTOP);
  const o = { x, y: AY + (down ? 30 : 0), s: 0.95, pose: down ? '웅크림' : g < 1 ? walkPose(lt * 7, 1.0) : '주머니', ex: bEx(down ? 'B울음' : 'B기본'), look: [-0.9, 0], rot: g < 1 ? -6 : 0, sy: down ? 1 + 0.08 * Math.exp(-(lt - 1.7) * 7) : 1 };
  w += qShadow(x, AY, 66) + bGuest('B', t, o);
  if (down) { const [hx, hy] = bHead(x, AY + 30, 0.95); w += bTear(hx, hy + 10, lt, 3); }
  let over = lt < 0.9 ? fx(t, t - lt + 0.05, t - lt + 0.9, 1680, 260, '쾅!', '#FFD23F', { size: 80, burst: 90 }) : '';
  if (lt > 1.9) over += fx(t, t - lt + 1.9, t + 9, 1460, 240, '으아앙~', '#9ED8FF', { size: 64, rot: -6 });
  return bPlate('shop', cam, 0.5) + qCam(cam, w) + over;
}
function bBflashScene(t, lt, a) { // three quick flashbacks, sepia
  const k = Math.min(2, Math.floor(lt / 1.4)), l2 = lt - k * 1.4;
  let s = '';
  if (k === 0) { const cam = [960, 600, 1.15];
    let w = qShadow(700, 1000, 66) + bGrey(700, 1000, 1, t, 1, { collar: true, tie: '#1E2230', pose: '턱괴기', ex: bEx('심드렁'), look: [0.6, 0] }) + qShadow(1240, 1000, 66) + bGuest('B', t, { x: 1240, y: 1000, s: 1, pose: '가리키기L', ex: bEx('B화남'), look: [-0.9, 0], badge: false });
    w += pop(t, t - l2, t + 9, 640, 380, bSpeech(0, 0, 340, 100, '라떼는 말이야~', { size: 38 }), {}) + pop(t, t - l2 + 0.5, t + 9, 1320, 330, bSpeech(0, 0, 400, 100, '부장님, 그건 아니죠!', { size: 38, bg: '#FFE34D', tail: 30 }), {});
    s = bPlate('pub', cam, 0.5) + qCam(cam, w);
  } else if (k === 1) {
    let w = `<g transform="translate(960 600)"><rect x="-260" y="-160" width="520" height="320" rx="24" fill="#3B3F4E" stroke="${INK}" stroke-width="10"/><rect x="-220" y="-120" width="440" height="110" rx="10" fill="#C9F2B0"/>${bTxt(0, -50, '400,000원', 70, INK)}${bTxt(0, 70, '일시불 결제 완료', 40, '#fff')}</g>`;
    const cx = lerp(1500, 1180, easeOut(clamp(l2 / 0.4, 0, 1))); w += `<g transform="translate(${f1(cx)} 760) rotate(-12)"><rect x="-130" y="-80" width="260" height="160" rx="16" fill="#E5484D" stroke="${INK}" stroke-width="8"/><rect x="-130" y="-40" width="260" height="30" fill="#2A2226"/></g>` + bHand(cx + 110, 830, 1.3);
    if (l2 > 0.5) w += fx(t, t - l2 + 0.5, t + 9, 960, 260, '띵!', '#FFE34D', { size: 70 });
    s = bPlate('pub', [960, 560, 1.1], 0.4) + bFull('#000', 0.35) + w;
  } else {
    let inner = bTxt(0, -250, '내 통장', 30, INK) + bTxt(0, -120, '잔액', 34, '#555') + bTxt(0, -30, '12,000원', 72, '#D63A3A') + bTxt(0, 60, '다음 날 아침 9:00', 26, '#555');
    s = bPlate('bedroom', [960, 560, 1.1], 0.4) + bFull('#000', 0.3) + bBigPhone(960 + Math.sin(t * 40) * 3, 560, 1.15, -3, inner, { bg: '#EAF0F6' }) + pop(t, t - l2 + 0.4, t + 9, 1460, 300, label(0, 0, '헉…', { size: 56, bg: '#fff' }), {});
  }
  return s + `<rect x="0" y="0" width="1920" height="1080" fill="#C8A060" opacity=".22" style="mix-blend-mode:multiply"/>` + tag(t, t - lt, t + 9, 200, 120, '회상', '#F4EAD0', { size: 40 }) + (l2 < 0.12 ? bFull('#fff', 0.5) : '');
}
function bBcoolScene(t, lt, a) { // in the moment: cool, sunglasses, flames
  const cam = qLerpCam(lt / 2.4, [960, 620, 1.3], [960, 600, 1.42]), tF = bAt(a, '지르', 1.4);
  let w = '';
  if (lt > tF - 0.2) for (let i = 0; i < 7; i++) { const ph = (t * 3 + i * 0.4) % 1; w += `<path d="M${f1(760 + i * 66)} ${f1(980 - ph * 120)} q-40 -120 20 -240 q20 80 50 60 q30 -60 10 -140 q90 110 30 320 Z" fill="${i % 2 ? '#FF8A3D' : '#FFD23F'}" stroke="${INK}" stroke-width="5" opacity="${f1((0.85 - ph * 0.3) * 100) / 100}"/>`; }
  w += qShadow(960, 1000, 66) + bGuest('B', t, { x: 960, y: 1000, s: 1, pose: lt > tF ? '만세' : '주머니', ex: bEx(lt > tF ? 'B화남' : 'B기본'), look: [0, 0], sy: lt > tF ? 1 + 0.06 * Math.exp(-(lt - tF) * 6) : 1 });
  return bPlate('pub', cam, 0.5) + qCam(cam, w) + (lt > 0.3 ? tag(t, t - lt + 0.3, t + 9, 1460, 280, '쿨~', '#BFE6FF', { size: 56 }) : '') + (lt > tF ? fx(t, t - lt + tF, t + 9, 960, 200, '확!', '#FFD23F', { size: 76 }) : '');
}
function bBroll(t, lt, a) { return ''; }
function bBrollScene(t, lt, a) { // lights off, rolling in bed with regret
  const cam = qLerpCam(lt / 3, [1360, 760, 1.35], [1360, 760, 1.45]), roll = Math.sin(lt * 5) * 14, tK = bAt(a, '뒹구', 2.0);
  let w = bBed(1000, 1) + bLie('B', 1280 + roll * 2, 880, t, { pose: '머리감싸', ex: bEx('B울음'), rot: 90 + roll });
  w += `<path d="M1010 ${f1(830 - (lt > tK ? Math.abs(Math.sin(lt * 9)) * 60 : 0))} Q1250 800 1540 830 L1560 960 Q1250 990 1010 960 Z" fill="#6A5A9A" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  if (lt > 0.4) w += pop(t, t - lt + 0.4, t + 9, 1180, 560, bubble(0, 0, 340, 110, bTxt(0, 14, '내가 왜 그랬지…', 32, INK)), { bob: 3 });
  return bPlate('bedroom', cam, 0.5) + bFull('#0A1030', 0.5) + qCam(cam, w) + (lt > tK ? fx(t, t - lt + tK, t + 9, 1500, 380, '이불킥!', '#fff', { size: 60, rot: 8 }) : '');
}
function bNsheepScene(t, lt, a) { // a flock in one direction; Nietzsche walks the other way
  const cam = qLerpCam(lt / 5, [960, 640, 1.1], [980, 640, 1.16]), tM = bAt(a, '마이웨이', 3.4);
  let w = '';
  for (let i = 0; i < 9; i++) { const x = ((i * 260 + lt * 180) % 2340) - 200; w += bSheep(x, 930 + (i % 2) * 24, 0.75, t, i); }
  const nx = lt > tM ? 1200 - (lt - tM) * 160 : 1200;
  w += qShadow(nx, 1000, 66) + HALO(NZ({ t, seed: 83, x: nx, y: 1000, s: 1, pose: lt > tM ? walkPose(lt * 7, 0.8) : '서기', ex: bEx('결심'), look: [-0.8, 0], flip: lt > tM }));
  if (lt > tM) w += pop(t, t - lt + tM, t + 9, nx, 300, label(0, 0, '마이웨이', { size: 48, bg: '#FFE34D' }), { rot: -4 });
  return bPlate('meadow', cam, 0.5) + qCam(cam, w);
}
function bNamorScene(t, lt, a) { // AMOR FATI
  const tA = bAt(a, '아모르', 1.0), tL = bAt(a, '사랑', 2.8), cam = qLerpCam(lt / 4, [960, 560, 1.0], [960, 560, 1.1]);
  let w = `<rect x="-300" y="-200" width="2600" height="1500" fill="#3A1030"/>` + rSparks(960, 520, t, 14, 700, '#FF9AB8');
  w += pop(t, t - lt + tA, t + 99, 960, 420, outlined(0, 0, ['아모르 파티'], { size: 140, sw: 18, fill: '#FFE9A8' }), {}) + pop(t, t - lt + tA + 0.3, t + 99, 960, 540, bTxt(0, 0, 'Amor Fati', 56, '#FF9AB8'), {});
  w += pop(t, t - lt + tL, t + 99, 960, 680, label(0, 0, '네 운명을 사랑하라', { size: 50, bg: '#FF9AB8' }), {});
  if (lt > tL) w += bHeart(960, 860, 1.6 + 0.1 * Math.sin(t * 8), '#FF5A6E');
  w += HALO(NZ({ t, seed: 83, x: 260, y: 1060, s: 0.9, pose: '만세', ex: bEx('결심'), look: [0.6, -0.4] }));
  return qCam(cam, w);
}
function bBcornerScene(t, lt, a) { // shrunk in a corner with stickers; a hand peels '못난이' off
  const cam = qLerpCam(lt / 5, [1300, 700, 1.5], [1300, 700, 1.62]), tP = bAt(a, '마세요', 4.0);
  let w = `<path d="M900 -200 L1000 1200 M1700 -200 L1600 1200" stroke="#000" stroke-width="0"/>` + qShadow(1300, 1000, 60) + bGuest('B', t, { x: 1300, y: 1010, s: 1, pose: '웅크림', ex: bEx('B울음'), look: [0, 0.6], shiver: true });
  const [cx, cy] = bChest(1300, 1040);
  w += pop(t, t - lt + 0.3, t + 99, cx - 120, cy - 220, label(0, 0, '흑역사', { size: 34, bg: '#D5DAE3' }), { rot: -14 });
  const pk = clamp((lt - tP) / 0.6, 0, 1);
  w += pop(t, t - lt + bAt(a, '못난이', 2.6), t + 99, f1(cx + 90 + pk * 500), f1(cy - 140 - pk * 300), `<g transform="rotate(${f1(12 + pk * 200)})">${label(0, 0, '못난이', { size: 40, bg: '#FFB3B3' })}</g>`, {});
  if (lt > tP - 0.4) w += bHand(lerp(1900, cx + 110, easeOut(clamp((lt - tP + 0.4) / 0.4, 0, 1))) + pk * 500, cy - 140 - pk * 300, 1.2);
  return bPlate('bedroom', cam, 0.5) + bFull('#0A1030', 0.45) + qCam(cam, w) + warm(0.3 * pk);
}
function bBfireScene(t, lt, a) { // a row of grey "넵넵"; B burns in colour
  const cam = qLerpCam(lt / 6, [960, 620, 1.12], [960, 610, 1.2]), tN = bAt(a, '넵넵', 1.4), tF = bAt(a, '불꽃', 3.0), tT = bAt(a, '재능', 5.8);
  let w = '';
  [360, 620, 1300, 1560].forEach((x, i) => { w += qShadow(x, 1000, 60) + bGrey(x, 1000, 0.92, t, i, { pose: '서기', ex: bEx('지침') }); if (lt > tN - 0.3 + i * 0.12) w += pop(t, t - lt + tN - 0.3 + i * 0.12, t + 99, x + 30, 420, bSpeech(0, 0, 130, 80, i % 2 ? '넵넵' : '넵', { size: 34 }), {}); });
  if (lt > tF) for (let i = 0; i < 9; i++) { const an = i / 9 * 6.28, ph = (t * 2.5 + i * 0.3) % 1, r = 230 + ph * 40; w += `<path d="M${f1(960 + Math.cos(an) * r * 0.8)} ${f1(700 + Math.sin(an) * r)} q-24 -60 8 -120 q16 40 30 30 q14 -40 4 -80 q60 70 10 170 Z" fill="${i % 2 ? '#FF8A3D' : '#FFD23F'}" stroke="${INK}" stroke-width="4" opacity="${f1((0.9 - ph * 0.4) * 100) / 100}"/>`; }
  w += qShadow(960, 1000, 66) + bGuest('B', t, { x: 960, y: 1000, s: 1, pose: lt > tF ? '만세' : '서기', ex: bEx(lt > tF ? 'B기본' : 'B울음'), look: [0, 0] });
  if (lt > tT) w += pop(t, t - lt + tT, t + 99, 960, 260, label(0, 0, '죄 ✕  재능 ○', { size: 52, bg: '#FFE34D' }), {}) + rSparks(960, 260, t, 8, 260);
  return bPlate('office', cam, 0.5) + bFull('#1C2340', 0.25 * (1 - clamp((lt - tF) / 1, 0, 1))) + qCam(cam, w);
}
function bBupScene(t, lt, a) { // falls, dusts off, grins, hugs himself
  const cam = qLerpCam(lt / 7, [1000, 620, 1.25], [1000, 610, 1.35]), tU = bAt(a, '털고', 1.0), tS = bAt(a, '씩', 2.0), tH = bAt(a, '껴안', 5.0);
  const fall = lt < tU ? easeIn(clamp(lt / 0.5, 0, 1)) : 1 - easeOut(clamp((lt - tU) / 0.4, 0, 1));
  const o = { x: 1000, y: 1000, s: 1, rot: 80 * fall, pose: lt > tH ? '안기' : lt > tU && lt < tS ? '털기' : '서기', ex: bEx(lt > tS ? (lt > tH ? 'B기본' : 'B기본') : 'B울음'), look: [0, 0], badge: fall < 0.3 };
  let w = qShadow(1000, 1000, 66) + bGuest('B', t, o);
  if (lt > tU && lt < tU + 0.9) for (let i = 0; i < 5; i++) w += `<circle cx="${f1(900 + i * 50)}" cy="${f1(820 + Math.sin(i) * 40 - (lt - tU) * 80)}" r="${f1(14 + (lt - tU) * 30)}" fill="#E9DFC8" opacity="${f1(Math.max(0, 0.7 - (lt - tU)) * 100) / 100}"/>`;
  if (lt > tS) w += pop(t, t - lt + tS, t + 99, 1240, 460, label(0, 0, '씩-', { size: 44, bg: '#fff' }), { rot: 8 });
  if (lt > tH) w += bHeart(1000, 740, 0.8 + 0.06 * Math.sin(t * 6), '#FF8A9A') + rSparks(1000, 600, t, 6, 200, '#FFE9A8');
  return bPlate('shop', cam, 0.5) + qCam(cam, w) + warm(0.25 + 0.4 * prog(lt, tS, tH));
}

/* ---------- O ---------- */
const OTAGS = ['팀원 뒤치다꺼리', '친구 연애 상담', '집안 걱정', '총대'];
const bOtags = (x, y, s) => OTAGS.map((s0, i) => { const p = ptOf(x, y, s, [70, 300, 150, 250][i], [120, 150, 260, 300][i]); return `<g transform="translate(${f1(p[0])} ${f1(p[1])}) rotate(${[-8, 6, -4, 10][i]}) scale(${f1(s * 0.9 * 100) / 100})">${label(0, 0, s0, { size: 26, bg: '#FBF7EE' })}</g>`; }).join('');
function bOenterScene(t, lt, a) { // the giant bundle staggers in
  const cam = qLerpCam(lt / 3, [1300, 600, 1.1], [1340, 620, 1.18]), g = clamp((lt - 0.2) / 2.4, 0, 1), x = lerp(2150, AX, easeOut(g));
  let w = `<rect x="1990" y="40" width="${f1(110 * clamp(lt / 0.4, 0, 1))}" height="950" fill="#2C3A5C" opacity=".8"/>`;
  w += qShadow(ZC[0], ZC[1], 70) + bZero(t, { x: ZC[0], y: ZC[1], s: 1, pose: '카운터', ex: bEx(lt > 0.6 ? '놀람' : '심드렁'), look: [0.9, 0] }) + bCounter(520, 1400, CTOP);
  const o = { x, y: AY, s: 0.95, pose: g < 1 ? walkPose(lt * 5, 0.6) : '만세', ex: bEx('신남'), look: [-0.6, 0], rot: Math.sin(lt * 4) * 5, shiver: true };
  w += qShadow(x, AY, 80) + bGuest('O', t, o) + bOtags(x, AY, 0.95);
  return bPlate('shop', cam, 0.5) + qCam(cam, w) + (lt > 0.5 ? fx(t, t - lt + 0.5, t - lt + 2.0, 1500, 240, '끙…', '#fff', { size: 56 }) : '');
}
function bOfallScene(t, lt, a) { // the soul pops out of his mouth, and down he goes
  const cam = qLerpCam(lt / 2.4, [AX, 640, 1.5], [AX, 680, 1.6]), tS = 0.25, tD = 0.9, f = easeIn(clamp((lt - tD) / 0.4, 0, 1));
  let w = qShadow(AX, AY, 70) + bGuest('O', t, { x: AX, y: AY, s: 1, rot: -82 * f, pose: '만세', ex: bEx(lt > tS ? '지침' : '신남'), look: [0, 0] }) + (f < 0.2 ? bOtags(AX, AY, 1) : '');
  if (lt > tS) { const [hx, hy] = bHead(AX, AY), r = easeOut(clamp((lt - tS) / 0.8, 0, 1)); w += `<g transform="translate(${f1(hx + 40 * r)} ${f1(hy + 40 - 260 * r)}) scale(${f1((0.5 + r) * 100) / 100})"><path d="M-40 30 Q-48 -46 0 -48 Q48 -46 40 30 Q28 18 20 32 Q10 18 0 32 Q-10 18 -20 32 Q-28 18 -40 30 Z" fill="#F4F8FF" stroke="${INK}" stroke-width="5"/><circle cx="-12" cy="-12" r="6" fill="${INK}"/><circle cx="12" cy="-12" r="6" fill="${INK}"/></g>`; }
  return bPlate('shop', cam, 0.5) + qCam(cam, w) + (lt > tD + 0.35 ? fx(t, t - lt + tD + 0.35, t + 9, 1300, 300, '털썩', '#fff', { size: 70 }) : '');
}
function bOmeetScene(t, lt, a) { // party mood-maker ... first to volunteer
  const cam = qLerpCam(lt / 4, [960, 620, 1.15], [960, 610, 1.22]), tC = bAt(a, '궂은', 1.8), tG = bAt(a, '총대', 2.8);
  let w = '';
  [520, 760, 1180, 1420].forEach((x, i) => { w += qShadow(x, 1000, 60) + bGrey(x, 1000, 0.9, t, i, { pose: lt < tC ? '만세' : '서기', ex: bEx(lt < tC ? '신남' : '지침'), look: [x < 960 ? 0.6 : -0.6, 0] }); });
  w += qShadow(960, 1000, 66) + bGuest('O', t, { x: 960, y: 1000, s: 1, pose: lt < tC ? '만세' : '손인사', ex: bEx('신남'), look: [0, 0], bundle: false, sy: 1 + 0.03 * Math.sin(t * 10) });
  w += `<path d="M900 ${f1(500 + Math.sin(t * 10) * 4)} L960 380 L1020 ${f1(500 + Math.sin(t * 10) * 4)} Z" fill="#FF6A9A" stroke="${INK}" stroke-width="6"/>`;
  if (lt < tC) w += rSparks(960, 400, t, 10, 500, '#FFE34D');
  if (lt > tC) w += pop(t, t - lt + tC, t + 99, 1250, 320, bSpeech(0, 0, 300, 96, '제가 할게요!', { size: 38, bg: '#FFE34D', tail: -30 }), {});
  if (lt > tG) { const h = ptOf(960, 1000, 1, 322, 170); w += `<g transform="translate(${f1(h[0])} ${f1(h[1])})"><line x1="0" y1="0" x2="0" y2="-300" stroke="#8A5A34" stroke-width="12"/><path d="M0 -300 L170 -250 L0 -200 Z" fill="#E5484D" stroke="${INK}" stroke-width="6"/>${bTxt(70, -238, '총대', 34, '#fff')}</g>`; }
  return bPlate('pub', cam, 0.5) + qCam(cam, w);
}
function bOcryScene(t, lt, a) { // treats everyone ... then cries alone into the pillow
  const tJ = bAt(a, '정작', 2.6);
  if (lt < tJ) { const cam = qLerpCam(lt / tJ, [960, 620, 1.2], [960, 620, 1.28]);
    let w = qShadow(800, 1000, 60) + bGrey(800, 1000, 0.95, t, 2, { pose: '가슴', ex: bEx('울먹') }) + qShadow(1180, 1000, 66) + bGuest('O', t, { x: 1180, y: 1000, s: 1, pose: '건네기', ex: bEx('미소'), look: [-0.8, 0], bundle: false });
    w += pop(t, t - lt + 0.2, t + 99, 980, 760, `<g><rect x="-80" y="-20" width="160" height="40" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/><ellipse cx="0" cy="-20" rx="70" ry="30" fill="#F4E2B8" stroke="${INK}" stroke-width="5"/></g>`, {}) + pop(t, t - lt + 0.9, t + 99, 1460, 360, label(0, 0, '오늘은 내가 쏜다!', { size: 38, bg: '#FFE34D' }), {});
    return bPlate('pub', cam, 0.5) + qCam(cam, w);
  }
  const l2 = lt - tJ, cam = qLerpCam(l2 / 3, [1400, 760, 1.4], [1420, 770, 1.52]);
  let w = bBed(1000, 1) + bLie('O', 1280, 880, t, { ex: bEx('울먹'), rot: 90 + Math.sin(t * 9) * 2 });
  w += `<path d="M1010 830 Q1250 800 1540 830 L1560 960 Q1250 990 1010 960 Z" fill="#6A8A6A" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  w += bTear(1630, 800, l2, 2);
  return bPlate('bedroom', cam, 0.5) + bFull('#0A1030', 0.5) + qCam(cam, w) + (l2 > 0.6 ? fx(t, t - l2 + 0.6, t + 9, 1300, 360, '흑…', '#9ED8FF', { size: 56 }) : '');
}
const bTreeStraight = (x, y, fallK) => `<g transform="rotate(${f1(-88 * fallK)} ${x} ${y})"><rect x="${x - 34}" y="${y - 640}" width="68" height="640" fill="#9A6A3E" stroke="${INK}" stroke-width="8"/><ellipse cx="${x}" cy="${y - 700}" rx="170" ry="150" fill="#5FAF6A" stroke="${INK}" stroke-width="8"/></g>`;
const bTreeCrooked = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-60 0 Q-20 -120 -80 -240 Q-130 -330 -30 -420 Q40 -480 -10 -560 L60 -560 Q110 -470 40 -400 Q-40 -320 20 -230 Q70 -140 60 0 Z" fill="#8A5E36" stroke="${INK}" stroke-width="9"/>` +
  [[-60, -250], [20, -380], [-10, -120]].map(([cx, cy]) => `<ellipse cx="${cx}" cy="${cy}" rx="18" ry="12" fill="#5E3E22" stroke="${INK}" stroke-width="5"/>`).join('') + `<ellipse cx="-20" cy="-620" rx="420" ry="190" fill="#4E9A5A" stroke="${INK}" stroke-width="9"/><ellipse cx="-260" cy="-560" rx="170" ry="110" fill="#5FAF6A" stroke="${INK}" stroke-width="8"/><ellipse cx="240" cy="-560" rx="180" ry="110" fill="#5FAF6A" stroke="${INK}" stroke-width="8"/></g>`;
const bCarpenter = (x, t, o = {}) => HALO(char(Object.assign({ goggles: 'none', vest: '#5B6B8A', patch: false, tee: true, hair: '#2F2F33', headband: '#E5484D', x, y: 1000, s: 0.95, t, seed: 91, pose: '서기', ex: bEx('결심') }, o)));
function bZtreeScene(t, lt, a) {
  const cam = qLerpCam(lt / 5, [960, 600, 1.05], [960, 600, 1.12]);
  let w = '';
  if (a.ph === 1) { const tC = bAt(a, '잘려', 1.8), tD = bAt(a, '책상', 2.6), tW = bAt(a, '장작', 3.4), fk = easeIn(clamp((lt - tC) / 0.7, 0, 1));
    w += bTreeStraight(1100, 1000, fk) + qShadow(760, 1000, 60) + bCarpenter(760, t, { pose: lt < tC ? (Math.floor(lt * 3) % 2 ? '만세' : '주먹') : '서기', look: [0.8, 0] });
    w += `<g transform="translate(850 ${f1(760 + (lt < tC ? Math.sin(lt * 18) * 20 : 0))}) rotate(-30)"><rect x="-8" y="-120" width="16" height="140" fill="#8A5A34" stroke="${INK}" stroke-width="5"/><path d="M8 -120 L70 -140 L60 -70 L8 -80 Z" fill="#B8C4D6" stroke="${INK}" stroke-width="5"/></g>`;
    if (lt > tD) w += pop(t, t - lt + tD, t + 99, 1300, 360, `<g><rect x="-120" y="-40" width="240" height="30" fill="#B07A4A" stroke="${INK}" stroke-width="6"/><rect x="-100" y="-10" width="20" height="90" fill="#8A5A34" stroke="${INK}" stroke-width="5"/><rect x="80" y="-10" width="20" height="90" fill="#8A5A34" stroke="${INK}" stroke-width="5"/></g>`, {}) + pop(t, t - lt + tD, t + 99, 1300, 470, label(0, 0, '책상', { size: 34, bg: '#fff' }), {});
    if (lt > tW) w += pop(t, t - lt + tW, t + 99, 1620, 400, [0, 1, 2].map(i => `<rect x="${-90 + i * 40}" y="${-20 - i * 30}" width="120" height="34" rx="14" fill="#9A6A3E" stroke="${INK}" stroke-width="5" transform="rotate(${-10 + i * 12})"/>`).join(''), {}) + pop(t, t - lt + tW, t + 99, 1620, 470, label(0, 0, '장작', { size: 34, bg: '#fff' }), {});
    return bPlate('forest', cam, 0.5) + qCam(cam, w) + (lt > tC + 0.6 && lt < tC + 1.4 ? fx(t, t - lt + tC + 0.6, t + 9, 1300, 760, '쿵', '#fff', { size: 70 }) : '');
  }
  const tN = bAt(a, '아무도', 1.6), tY = bAt(a, '수백', 2.8), tS = bAt(a, '그늘', 3.8);
  w += bTreeCrooked(1000, 1000) + `<ellipse cx="1000" cy="1010" rx="${f1(300 + 160 * prog(lt, tS - 0.5, tS + 0.5))}" ry="40" fill="#000" opacity=".22"/>`;
  const cx = lerp(300, 1700, clamp((lt - 0.2) / 3.2, 0, 1));
  w += qShadow(cx, 1000, 60) + bCarpenter(cx, t, { pose: walkPose(lt * 8, 0.7), ex: bEx(lt > tN ? '심드렁' : '결심'), look: [lt > tN && lt < tN + 1 ? -0.8 : 0.8, 0] });
  if (lt > tN && lt < tN + 1.6) w += pop(t, t - lt + tN, t + 9, cx, 330, bSpeech(0, 0, 220, 80, '쓸 데가 없네', { size: 30 }), {});
  if (lt > tY) w += pop(t, t - lt + tY, t + 99, 1580, 260, label(0, 0, `${100 + Math.min(4, Math.floor((lt - tY) * 3)) * 100}년째`, { size: 44, bg: '#FFE34D' }), {});
  if (lt > tS) w += `<g transform="translate(860 990)">${ZH({ t, seed: 84, x: 0, y: 0, s: 0.75, rot: -90, pose: '서기', ex: bEx('졸림') })}</g>` + bTxt(700 + Math.sin(t * 2) * 10, 780 - ((lt * 30) % 60), 'z z', 44, '#fff', { stroke: INK, sw: 6 });
  return bPlate('forest', cam, 0.5) + qCam(cam, w);
}
function bOboatScene(t, lt, a) { // saving everyone, the boat sinks
  const cam = qLerpCam(lt / 4, [960, 620, 1.1], [960, 640, 1.18]), sink = clamp((lt - 0.6) / 3.2, 0, 1) * 160, bob = Math.sin(t * 2) * 10;
  let w = `<g transform="translate(0 ${f1(sink + bob)})">`;
  [700, 860, 1060, 1220].forEach((x, i) => w += bGrey(x, 930, 0.62, t, i, { pose: '만세', ex: bEx('신남') }));
  w += bGuest('O', t, { x: 960, y: 930, s: 0.75, pose: '허우적', ex: bEx(sink > 80 ? '겁먹음' : '신남'), look: [0, 0] });
  w += `<path d="M520 900 L1400 900 L1300 1040 L620 1040 Z" fill="#B07A4A" stroke="${INK}" stroke-width="9"/></g>`;
  w += `<path d="M-300 ${f1(980 + Math.sin(t * 2) * 8)} Q200 ${f1(950 + Math.sin(t * 2.4) * 10)} 700 980 T1700 980 T2700 980 L2700 1400 L-300 1400 Z" fill="#3D5D7E" opacity=".92" stroke="${INK}" stroke-width="7"/>`;
  if (sink > 60) for (let i = 0; i < 6; i++) { const ph = (lt * 1.3 + i * 0.17) % 1; w += `<circle cx="${f1(800 + i * 70)}" cy="${f1(990 - ph * 140)}" r="${f1(8 + i % 3 * 4)}" fill="none" stroke="#DDF2FF" stroke-width="4" opacity="${f1((1 - ph) * 100) / 100}"/>`; }
  return bPlate('sea', cam, 0.4) + qCam(cam, w) + (lt > 2.4 ? fx(t, t - lt + 2.4, t + 9, 1460, 300, '꼬르륵', '#BFE6FF', { size: 60 }) : '');
}
function bOtreeScene(t, lt, a) { // be the ugly tree today: "I'm out of battery"
  const tB = bAt(a, '방전', 2.4), cam = qLerpCam(lt / 5, [1060, 600, 1.12], [1060, 600, 1.2]);
  let w = bTreeCrooked(760, 1000, 0.92) + qShadow(1250, 1000, 60) + bGuest('O', t, { x: 1250, y: 1000, s: 0.95, pose: '폰보기' in P ? '폰보기' : '건네기', ex: bEx(lt > tB ? '미소' : '지침'), look: [0.4, 0.8], bundle: false });
  if (lt > tB - 0.3) { const inner = `<g transform="translate(0 0)"><rect x="-150" y="-60" width="300" height="130" rx="20" fill="#FFE34D" stroke="${INK}" stroke-width="4"/>${bTxt(-130, -10, '나 오늘 방전이야.', 28, INK, { anchor: 'start' })}${bTxt(-130, 36, '아무것도 기대하지 마.', 28, INK, { anchor: 'start' })}</g>` + `<g transform="translate(0 -230)"><rect x="-50" y="-22" width="100" height="44" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-44" y="-16" width="10" height="32" fill="#E5484D"/><rect x="50" y="-10" width="10" height="20" fill="${INK}"/></g>`;
    w += pop(t, t - lt + tB - 0.3, t + 99, 1600, 520, bBigPhone(0, 0, 0.9, 4, inner, { bg: '#EAF0F6' }), {}); }
  return bPlate('forest', cam, 0.5) + qCam(cam, w) + warm(0.3);
}
function bOsleepScene(t, lt, a) { // drop the load, sleep spread-eagle in the shade
  const tD = bAt(a, '내려', 2.4), tS = bAt(a, '대자', 3.6), cam = qLerpCam(lt / 5, [1000, 640, 1.12], [1000, 660, 1.22]);
  let w = bTreeCrooked(760, 1000, 0.92) + `<ellipse cx="900" cy="1010" rx="520" ry="46" fill="#000" opacity=".2"/>`;
  const dg = clamp((lt - tD) / 0.6, 0, 1);
  if (lt < tS) w += qShadow(1180, 1000, 66) + bGuest('O', t, { x: 1180, y: 1000, s: 0.95, pose: '서기', ex: bEx(lt > tD ? '미소' : '지침'), look: [0, 0], bundle: lt < tD, shiver: lt < tD });
  if (lt > tD) w += `<g transform="translate(${f1(1380 + dg * 220)} ${f1(900 + Math.sin(dg * Math.PI) * -60)}) rotate(${f1(dg * 120)})"><ellipse cx="0" cy="0" rx="140" ry="120" fill="#C9A06A" stroke="${INK}" stroke-width="8"/></g>`;
  if (lt > tS) w += `<g transform="translate(1100 1000)">${bGuest('O', t, { x: 0, y: 0, s: 0.95, rot: -90, pose: '만세', ex: bEx('졸림'), bundle: false, badge: false })}</g>` + bTxt(1000 + Math.sin(t * 2) * 10, 800 - ((lt * 30) % 60), 'z z z', 48, '#fff', { stroke: INK, sw: 6 });
  if (lt > bAt(a, '망합', 1.2)) w += pop(t, t - lt + bAt(a, '망합', 1.2), t + 99, 1560, 280, label(0, 0, '세상: 멀쩡함', { size: 40, bg: '#B7F0C2' }), { rot: 4 });
  return bPlate('forest', cam, 0.5) + qCam(cam, w) + warm(0.45) + (lt > tD && lt < tD + 0.9 ? fx(t, t - lt + tD + 0.2, t + 9, 1600, 640, '쿵', '#fff', { size: 60 }) : '');
}

/* ---------- AB ---------- */
function bXenterScene(t, lt, a) { // peeks through the door, sprays the shop
  const cam = qLerpCam(lt / 3, [1400, 600, 1.22], [1460, 600, 1.3]), op = clamp(lt / 0.5, 0, 1), tS = 1.2;
  let w = qShadow(ZC[0], ZC[1], 70) + bZero(t, { x: ZC[0], y: ZC[1], s: 1, pose: '카운터', ex: bEx(lt > tS + 0.3 ? '심드렁' : '눈썹업'), look: [0.9, 0] }) + bCounter(520, 1400, CTOP);
  w += bGuest('AB', t, { x: 1990, y: AY, s: 0.95, pose: '가리키기L', ex: bEx('심드렁'), look: [-0.9, 0], badge: false });
  w += `<rect x="${f1(1990 + 110 * op - 2400)}" y="0" width="2400" height="0" fill="none"/><rect x="${f1(2000 + 140 * op)}" y="40" width="400" height="960" fill="#5E3E22" stroke="${INK}" stroke-width="9"/>`;
  if (lt > tS) for (let i = 0; i < 8; i++) { const ph = ((lt - tS) * 1.6 + i * 0.12) % 1; w += `<circle cx="${f1(1880 - ph * 520)}" cy="${f1(560 + Math.sin(i * 3) * 50 + ph * 30)}" r="${f1(16 + ph * 50)}" fill="#E6F6FF" opacity="${f1(Math.max(0, 0.7 - ph * 0.7) * 100) / 100}"/>`; }
  return bPlate('shop', cam, 0.5) + qCam(cam, w) + (lt > tS ? fx(t, t - lt + tS, t + 9, 1600, 300, '칙칙', '#E6F6FF', { size: 64 }) : '');
}
function bXseeScene(t, lt, a) { // x-ray through the smiling masks; then a line on the floor
  const cam = qLerpCam(lt / 5, [960, 620, 1.15], [960, 620, 1.22]), tX = bAt(a, '꿰뚫', 1.4), tL = bAt(a, '선을', 3.6), xk = clamp((lt - tX) / 0.6, 0, 1);
  let w = '';
  [420, 660, 900].forEach((x, i) => { w += qShadow(x, 1000, 60) + bGrey(x, 1000, 0.9, t, i, { pose: '서기', ex: bEx(['심드렁', '지침', '심드렁'][i]), look: [0.6, 0] }); const [hx, hy] = bHead(x, 1000, 0.9);
    w += `<g opacity="${f1((1 - 0.75 * xk) * 100) / 100}"><circle cx="${hx}" cy="${hy}" r="100" fill="#FFF6E0" stroke="${INK}" stroke-width="6"/><circle cx="${hx - 34}" cy="${hy - 10}" r="9" fill="${INK}"/><circle cx="${hx + 34}" cy="${hy - 10}" r="9" fill="${INK}"/><path d="M${hx - 50} ${hy + 30} Q${hx} ${hy + 80} ${hx + 50} ${hy + 30}" stroke="${INK}" stroke-width="7" fill="none"/></g>`; });
  if (xk > 0 && lt < tL) w += `<path d="M1400 520 L900 360 L900 680 Z" fill="#9EF0FF" opacity="${f1(0.25 * xk * 100) / 100}"/>`;
  w += qShadow(1440, 1000, 66) + bGuest('AB', t, { x: 1440, y: 1000, s: 1, pose: lt > tL ? '가리키기L' : '서기', ex: bEx('심드렁'), look: [-0.9, 0] });
  if (lt > tL) { const lk = clamp((lt - tL) / 0.6, 0, 1); w += `<line x1="1180" y1="${f1(1010 - 330 * lk)}" x2="1180" y2="1040" stroke="#fff" stroke-width="10" stroke-dasharray="26 18"/>` + pop(t, t - lt + tL + 0.3, t + 99, 1180, 600, label(0, 0, '여기까지', { size: 34, bg: '#fff' }), {}); }
  return bPlate('pub', cam, 0.5) + bFull('#1A2440', 0.2) + qCam(cam, w);
}
function bXcoldScene(t, lt, a) { // alone, every night: frost
  const cam = qLerpCam(lt / 3, [1100, 700, 1.4], [1100, 710, 1.52]), fr = clamp(lt / 2.2, 0, 1);
  let w = qShadow(1100, 1010, 60) + bGuest('AB', t, { x: 1100, y: 1030, s: 1, pose: '웅크림', ex: bEx('울먹'), look: [0.3, 0.6], shiver: true, badge: false });
  const [hx, hy] = bHead(1100, 1030); for (let i = 0; i < 3; i++) { const ph = (lt * 0.8 + i * 0.33) % 1; w += `<circle cx="${f1(hx + 120 + ph * 80)}" cy="${f1(hy + 60 - ph * 40)}" r="${f1(14 + ph * 26)}" fill="#fff" opacity="${f1((0.5 - ph * 0.5) * 100) / 100}"/>`; }
  return bPlate('bedroom', cam, 0.5) + bFull('#0A1838', 0.55) + qCam(cam, w) + `<rect x="-20" y="-20" width="1960" height="1120" fill="none" stroke="#DDF2FF" stroke-width="${f1(90 * fr)}" opacity=".5" filter="url(#qblur)"/>` + tag(t, t - lt + 0.2, t + 9, 260, 130, '새벽 3시', '#DDF2FF', { size: 40 });
}
function bHogScene(t, lt, a) { // the hedgehog dilemma, in three phases
  const cam = qLerpCam(lt / 6, [960, 680, 1.12], [960, 690, 1.18]), Y = 960, base = [540, 820, 1100, 1380];
  let gap, shiver = true, ouch = false, warmK = 0, txt = '';
  if (a.ph === 1) { gap = lerp(280, 150, easeInOut(clamp((lt - 0.8) / 3.0, 0, 1))); }
  else if (a.ph === 2) { const tP = bAt(a, '찔리', 0.9), tF = bAt(a, '떨어', 2.0); gap = lt < tP ? 110 : lt < tF ? lerp(110, 200, easeOut(clamp((lt - tP) / 0.4, 0, 1))) : lerp(200, 330, easeOut(clamp((lt - tF) / 0.6, 0, 1))); ouch = lt > tP && lt < tF + 0.3; txt = lt > tP && lt < tF ? '따끔!' : lt > tF ? '덜덜' : ''; }
  else { const tE = bAt(a, '끝에', 1.8), tW = bAt(a, '온기', 3.4); gap = lt < tE ? 200 + Math.sin(lt * 5) * 80 : lerp(200 + Math.sin(tE * 5) * 80, 185, easeOut(clamp((lt - tE) / 0.8, 0, 1))); shiver = lt < tW; warmK = clamp((lt - tW) / 1.0, 0, 1); }
  let w = '';
  if (warmK > 0) w += `<ellipse cx="960" cy="${Y}" rx="${f1(520 * warmK)}" ry="${f1(220 * warmK)}" fill="#FFB46A" opacity=".35"/>`;
  [-1.5, -0.5, 0.5, 1.5].forEach((k, i) => w += bHedge(960 + k * gap * 1.15, Y + (i % 2) * 14, 1.05, t, { shiver, ouch, warm: warmK > 0.5, flip: k > 0 }));
  if (txt) w += fx(t, t - lt + (a.ph === 2 ? bAt(a, txt === '따끔!' ? '찔리' : '떨어', 1) : 0), t + 9, 960, 640, txt, '#fff', { size: 60 });
  if (a.ph === 3 && warmK > 0.3) { const x0 = 960 - 0.5 * gap, x1 = 960 + 0.5 * gap; w += `<path d="M${f1(x0)} 800 L${f1(x1)} 800 M${f1(x0)} 780 L${f1(x0)} 820 M${f1(x1)} 780 L${f1(x1)} 820" stroke="#fff" stroke-width="7"/>` + pop(t, t - lt + bAt(a, '거리', 4.2), t + 99, 960, 730, label(0, 0, '딱 한 걸음', { size: 38, bg: '#FFE34D' }), {}); }
  return bPlate('snow', cam, 0.5) + qCam(cam, w) + bSnow(t, 60) + warm(0.5 * warmK);
}
function bXsoftScene(t, lt, a) { // not a monster: a soft heart under the suit
  const cam = qLerpCam(lt / 5, [AX - 80, 610, 1.8], [AX - 80, 600, 2.0]), tN = bAt(a, '아닙니다', 1.6), tS = bAt(a, '속살', 2.8), tG = bAt(a, '가시', 3.8);
  let w = '';
  if (lt < tN + 0.6) w += `<g opacity="${f1((1 - clamp((lt - tN) / 0.6, 0, 1)) * 0.6 * 100) / 100}"><path d="M${AX - 300} ${AY} Q${AX - 340} ${AY - 700} ${AX} ${AY - 760} Q${AX + 340} ${AY - 700} ${AX + 300} ${AY} Z" fill="#1A1030"/><circle cx="${AX - 90}" cy="${AY - 560}" r="20" fill="#FF4D4D"/><circle cx="${AX + 90}" cy="${AY - 560}" r="20" fill="#FF4D4D"/></g>`;
  if (lt > tG) for (let i = 0; i < 16; i++) { const an = Math.PI * (0.95 + i / 15 * 1.1), r = 330; w += `<path d="M${f1(AX + Math.cos(an) * r)} ${f1(AY - 300 + Math.sin(an) * r)} l${f1(Math.cos(an) * 50)} ${f1(Math.sin(an) * 50)}" stroke="${INK}" stroke-width="10" stroke-linecap="round" opacity="${f1(clamp((lt - tG) / 0.4, 0, 1) * 100) / 100}"/>`; }
  w += qShadow(AX, AY, 66) + bGuest('AB', t, { x: AX, y: AY, s: 1, pose: '가슴', ex: bEx(lt > tS ? '미소' : '울먹'), look: [-0.4, 0.2], badge: false });
  if (lt > tS) { const [cx, cy] = bChest(AX, AY), k = clamp((lt - tS) / 0.6, 0, 1); w += `<circle cx="${cx}" cy="${cy - 10}" r="${f1(110 * k)}" fill="#FFB3C6" opacity=".45"/>` + bHeart(cx, cy - 10, 0.75 * k + 0.05 * Math.sin(t * 5), '#FF8A9A'); }
  return bPlate('shopc', [cam[0] - 300, cam[1], cam[2]], 0.3, { blur: true }) + qCam(cam, w) + warm(0.5 * prog(lt, tS, tS + 1.5));
}
function bXstepScene(t, lt, a) { // one step away from the party, at ease
  const cam = qLerpCam(lt / 6, [1060, 620, 1.12], [1080, 610, 1.2]), tO = bAt(a, '걸음', 2.0), tE = bAt(a, '우아', 4.8);
  let w = '';
  [420, 640, 860].forEach((x, i) => w += qShadow(x, 1000, 60) + bGrey(x, 1000, 0.9, t, i, { pose: i === 1 ? '만세' : '서기', ex: bEx('신남'), look: [0.2, 0] }));
  w += qShadow(1400, 1000, 66) + bGuest('AB', t, { x: 1400, y: 1000, s: 1, pose: '서기', ex: bEx(lt > tE ? '미소' : '심드렁'), look: [-0.7, 0] });
  if (lt > tO) { const k = clamp((lt - tO) / 0.5, 0, 1); w += `<path d="M${f1(1000)} 1030 L${f1(1000 + 260 * k)} 1030" stroke="#fff" stroke-width="8" stroke-dasharray="20 14"/>` + pop(t, t - lt + tO + 0.2, t + 99, 1130, 1090, label(0, 0, '딱 한 걸음', { size: 34, bg: '#FFE34D' }), {}); }
  return bPlate('pub', cam, 0.5) + qCam(cam, w) + warm(0.35 + 0.3 * prog(lt, tE, tE + 1.5));
}

/* ---------- outro ---------- */
const DS = { sign: [709, 551], step: 1050 }; // dawn plate landmarks (world coords), set after looking at the plate
const SEAT = [['Z', 430], ['A', 630], ['B', 830], ['O', 1030], ['AB', 1230]];
function bSitter(who, x, t, o = {}) {
  const base = { x, y: DS.step, s: 0.82, pose: '안기', ex: bEx(o.ex || '미소'), look: o.look || [0, -0.3], sy: o.sy || 1 };
  const body = who === 'Z' ? bZero(t, base) : bGuest(who, t, Object.assign(base, { bundle: false, badge: false }));
  const h = ptOf(x, DS.step, 0.82, 200, 372);
  return qShadow(x, DS.step + 10, 60) + body + `<g transform="translate(${f1(h[0])} ${f1(h[1] - 18)})"><rect x="-18" y="-30" width="36" height="56" rx="6" fill="${['#C8423A', '#3D7EC8', '#E8C35A', '#3DBA8A', '#9A86C8'][SEAT.findIndex(s => s[0] === who)]}" stroke="${INK}" stroke-width="5"/></g>`;
}
function bdawnScene(t, lt, a) { // the neon goes off; dawn
  const cam = qLerpCam(lt / 3, [820, 640, 1.05], [800, 660, 1.14]), off = lt > 1.0 ? (lt > 1.6 ? 0 : bFlicker(lt, 1.0) * 0.6) : 1;
  let w = bNeonText(DS.sign[0], DS.sign[1] + 22, '제로의 심야 멘탈 수리점', 44, '#FF4FA6', off) + bClock(DS.sign[0] + 480, DS.sign[1], 0.7, '05:30', 1);
  return bPlate('dawn', cam, 0.6) + qCam(cam, w) + bFull('#2A1640', 0.35 * (1 - prog(lt, 0.5, 3)));
}
function bstepsScene(t, lt, a) { // everyone on the steps with a can of coffee
  const ph = a.ph, run = a._run || lt;
  let cam = [830, 760, 1.25];
  if (ph === 1) { const keys = ['불안', '충동', '씩씩', '고독'], ts = keys.map((k, i) => bAt(a, k, 0.3 + i * 0.9)); let idx = -1; ts.forEach((tt, i) => { if (lt > tt - 0.2) idx = i; });
    cam = idx < 0 ? [830, 760, 1.15] : qLerpCam(clamp((lt - ts[idx] + 0.2) / 0.4, 0, 1), idx === 0 ? [830, 760, 1.15] : [SEAT[idx][1], 780, 1.9], [SEAT[idx + 1][1], 780, 1.9]); }
  if (ph === 2) cam = qLerpCam(lt / 4, [830, 720, 1.5], [830, 760, 1.2]);
  if (ph === 3 || ph === 5) cam = [830, 680, 1.0];
  if (ph === 4) cam = qLerpCam(lt / 5, [830, 740, 1.15], [830, 760, 1.25]);
  if (ph === 6) cam = qLerpCam(lt / 6, [830, 740, 1.2], [830, 640, 1.0]);
  const tB = ph === 4 ? bAt(a, '숨쉬기', 3.6) : 99, ex = lt > tB && lt < tB + 0.8;
  let w = '';
  SEAT.forEach(([who, x], i) => { w += bSitter(who, x, t, { ex: who === 'B' ? 'B기본' : who === 'AB' && ph < 3 ? '심드렁' : '미소', look: [x < 830 ? 0.4 : -0.4, -0.3], sy: ex ? 1 - 0.05 * Math.sin((lt - tB) / 0.8 * Math.PI) : 1 }); });
  if (ex) SEAT.forEach(([who, x]) => { const [hx, hy] = bHead(x, DS.step, 0.82); w += `<circle cx="${f1(hx + 60 + (lt - tB) * 60)}" cy="${f1(hy + 40)}" r="${f1(10 + (lt - tB) * 30)}" fill="#fff" opacity="${f1((0.6 - (lt - tB) * 0.7) * 100) / 100}"/>`; });
  let over = '';
  if (ph === 3) { const tH = bAt(a, '여기', 4.2); if (lt > tH) over += bNeonDefs() + pop(t, t - lt + tH, t + 99, 960, 240, `<g filter="url(#bneon)">${bTxt(0, 30, '[제로의 세계]', 110, '#FFF4FB', { stroke: '#FF4FA6', sw: 10 })}</g>`, {}); }
  if (ph === 5) { over += bNeonDefs() + `<g filter="url(#bneon)">${bTxt(960, 260, '[제로의 세계]', 96, '#FFF4FB', { stroke: '#FF4FA6', sw: 10 })}</g>`; const tS = bAt(a, '구독', 3.6); if (lt > tS - 0.3) over += pop(t, t - lt + tS - 0.3, t + 99, 960, 380, label(0, 0, '구독: 내 결함과 덜 삐걱대며 사는 법', { size: 44, bg: '#FFE34D' }), {}); }
  const sun = ph >= 4 ? prog(run, 0, 30) : 0;
  return bPlate('dawn', cam, 0.6) + qCam(cam, w) + over + bFull('#FFB46A', 0.06 + 0.1 * sun) + (ph === 6 ? bFull('#000', prog(lt, a._dur ? a._dur - 1.4 : 6, a._dur ? a._dur : 7.2)) : '');
}

// every scene gets the shared filters/gradients (blur, warm light, neon)
['balley', 'bneon', 'bstamp', 'blook', 'bbump', 'bloupe', 'bwheel', 'bline', 'bsummon', 'brx', 'bticket', 'bAenter', 'bAphone', 'bAthink', 'bAtalk', 'bAots', 'bAfav', 'bAchat', 'bAdx',
 'bMA', 'bMAdream', 'bMAwar', 'bMAtent', 'bctl', 'bAplug', 'bAwarm', 'bAhug', 'bAhalf', 'bAbye'].concat(BNEW).forEach(k => { const f = window[k + 'Scene']; if (!f) { console.error('missing scene ' + k); return; } window[k + 'Scene'] = (...a) => qDefs() + bNeonDefs() + f(...a); });
