/* 카뮈 편(camus01) 장면 — 샘플(대본 1~14번 줄). 제로 + 머리에서 튀어나온 물음표 꼬마 '왜요' + '월화수목금' 바위.
   쓰는 것: engine.js(char·label·outlined·pop·bubble), anim2.js(A2), act2.js(ACT), actscenes.js(acZ), qscenes.js(qPlate·qCam·qShadow·qDefs), fscenes.js(fFull·fT).
   좌표: 세계 좌표(render가 0.88로 줄임). 보이는 세계는 x -131~2051, y -14~1213. 장면마다 qCam으로 자체 카메라.
   이름 접두사 cm(함수)·c(장면). 물리 규칙: 손에 든 물건은 hold, 손이 닿는 곳만 잡는다, 왜요는 앉거나 서 있고 '뿅'(0.3초) 말고는 뜨지 않는다. */
Object.assign(CAMS, { cbag: 'fixed', csub: 'fixed', cmont: 'fixed', cpop: 'fixed', cmeet: 'fixed', cscroll: 'fixed', cbook: 'fixed', cmyth: 'fixed', cstairs: 'fixed' });
Object.assign(QBG, { subway: '../../gyges01/long/ai/subway.png', meet: '../../gyges01/long/ai/meet.png', office: '../../gyges01/long/ai/office.png', stairs: 'ai/stairs.png' });
const CM_Y = '#FFD23F', CM_RED = '#D8433C', CM_TERRA = '#D27A45';
let cmClipN = 0;

/* ---------- 시간·말 ---------- */
const cmW = (a, keys, fb) => { const ks = Array.isArray(keys) ? keys : [keys]; for (const w of (a._words || [])) { const s = w.w.replace(/\s/g, ''); if (ks.some(k => s.includes(k))) return w.t + 0.15; } return fb; };
const cmWn = (a, key, n, fb) => { let c = 0; for (const w of (a._words || [])) { if (w.w.replace(/\s/g, '').includes(key)) { if (c === n) return w.t + 0.15; c++; } } return fb; };   // n번째(0부터) 나온 단어
const cmK = (lt, a, b) => clamp((lt - a) / (b - a), 0, 1);
const cmLineAt = t => { const L = TL.lines; let i = 0; while (i + 1 < L.length && t >= L[i + 1].t0 - 0.15) i++; return L[i]; };
const CM_TR = {};
const cmLip = t => { const l = cmLineAt(t); if (!l || l.v !== 'Z') return null;
  const tr = CM_TR[l.id] || (CM_TR[l.id] = ACT.lipTrack(l.say || l.sub, l.words || [], l.t0, l.t1, tt => env(tt) > 0.12 ? 1 : 0)); return ACT.lip(tr, t, env(t)); };
const cmMouth = (t, rest, c) => { const lp = cmLip(t); return lp && lp.s ? { v: lp.v, o: lp.o, c: c == null ? (rest.c || 0) : c } : rest; };
const cmWhyTalk = t => { const l = cmLineAt(t); return l && l.v === 'W' && t > l.t0 - 0.02 && t < l.t1 + 0.05 ? env(t) : 0; };

/* ---------- 제로 ---------- */
const cmZ = (key, face, o) => acZ(key, Object.assign({ t: o.t }, face), Object.assign({ seed: 71 }, o));
// 제로 몸 좌표(lx,ly) → 세계 좌표(발 원점 x,y, 크기 s, 회전 rot)
const cmPt = (x, y, s, rot, lx, ly, sy = 1) => { const a = rot * Math.PI / 180, dx = (lx - 200) * s, dy = (ly - 560) * s * sy; return [x + dx * Math.cos(a) - dy * Math.sin(a), y + dx * Math.sin(a) + dy * Math.cos(a)]; };
const cmLoc = (x, y, s, rot, wx, wy) => { const a = -rot * Math.PI / 180, dx = wx - x, dy = wy - y; return [200 + (dx * Math.cos(a) - dy * Math.sin(a)) / s, 560 + (dx * Math.sin(a) + dy * Math.cos(a)) / s]; };
const cmHand = (p, s) => hand(p[0], p[1], s);   // 앞에 다시 그리는 손(물건 앞으로 손이 와야 할 때)
const cmFace = (t, o = {}) => Object.assign({ eyes: { open: 1 - ACT.natBlink(t, 7) }, brow: {}, mouth: { v: ACT.VIS.M, o: 0, c: 1 }, blush: 0.3 }, o);
// 손잡이(천장에서 내려온 끈 + 고리). 손은 고리 아래(hx,hy)를 잡는다 — 제로보다 먼저 그린다
// 손잡이 끈(제로보다 먼저) + 세모 손잡이(제로 다음, 손을 다시 그려 손이 손잡이 아랫변을 쥔다). (hx,hy) = 손 중심
const cmStrapBand = (hx, hy, top = -100) => `<path d="M${f1(hx)} ${top} L${f1(hx)} ${f1(hy - 66)}" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M${f1(hx)} ${top} L${f1(hx)} ${f1(hy - 66)}" stroke="#D9DEE6" stroke-width="12" stroke-linecap="round"/>`;
const cmStrapGrip = (hx, hy, s) => { const tri = `M${f1(hx - 38)} ${f1(hy)} L${f1(hx)} ${f1(hy - 70)} L${f1(hx + 38)} ${f1(hy)} Z`;
  return `<path d="${tri}" fill="none" stroke="${INK}" stroke-width="20" stroke-linejoin="round"/><path d="${tri}" fill="none" stroke="#EEF1F5" stroke-width="9" stroke-linejoin="round"/>` + hand(hx, hy, s); };

/* ---------- 왜요(물음표 꼬마) ---------- */
// (x,y) = 앉은 자리·발 바닥. o: { t, look, eyes:'norm'|'wide'|'happy'|'half'|'shut', brow:'up'|'angry'|'worry'|'smug', mouth:'smile'|'O'|'flat'|'frown'|'grin'|'smirk'|'none', talk,
//   hL, hR(몸 좌표, 몸통 가운데 0,-90 근처), legs:'sit'|'stand'|'jump', sx, sy, rot, straight(0~1: 느낌표로 펴짐), wilt(0~1: 고리가 축 처짐), glow(0~1), toga }
const CM_WQ = [[-44, -170], [-46, -215], [40, -228], [44, -180], [46, -150], [0, -150], [0, -112]];
const CM_WS = [[0, -250], [0, -236], [0, -216], [0, -196], [0, -170], [0, -140], [0, -112]];
function cmWhyPts(o = {}) {
  const st = clamp(o.straight || 0, 0, 1), wl = clamp(o.wilt || 0, 0, 1);
  let p = CM_WQ.map((q, i) => [lerp(q[0], CM_WS[i][0], st), lerp(q[1], CM_WS[i][1], st)]);
  if (wl > 0) { const a = wl * 52 * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a); p = p.map((q, i) => i === 6 ? q : [q[0] * c - (q[1] + 112) * sn, q[0] * sn + (q[1] + 112) * c - 112]); }
  const B = u => { const v = 1 - u; return [0, 1].map(k => v * v * v * p[0][k] + 3 * v * v * u * p[1][k] + 3 * v * u * u * p[2][k] + u * u * u * p[3][k]); };
  const m = B(0.5), a1 = B(0.42), a2 = B(0.58), ang = Math.atan2(a2[1] - a1[1], a2[0] - a1[0]) * 180 / Math.PI;
  return { p, face: m, ang: st > 0.5 ? ang - 90 : ang };
}
// 얼굴(입 근처)의 세계 좌표: 손으로 입을 막을 때 쓴다
const cmWhyFace = (x, y, s, o = {}) => { const g = cmWhyPts(o), r = (o.rot || 0) * Math.PI / 180, fx = g.face[0] * s * (o.sx || 1), fy = (g.face[1] + 15) * s * (o.sy || 1); return [x + fx * Math.cos(r) - fy * Math.sin(r), y + fx * Math.sin(r) + fy * Math.cos(r)]; };
function cmWhy(x, y, s, o = {}) {
  const t = o.t || 0, lk = o.look || [0, 0], g = cmWhyPts(o), p = g.p, P2 = q => `${f1(q[0])} ${f1(q[1])}`;
  const d = `M${P2(p[0])} C${P2(p[1])} ${P2(p[2])} ${P2(p[3])} C${P2(p[4])} ${P2(p[5])} ${P2(p[6])} L0 -70`;
  const legs = o.legs || 'stand';
  const L = legs === 'sit' ? [[-8, -22, -26, -2], [8, -22, 26, -2]] : legs === 'jump' ? [[-8, -22, -18, -10], [8, -22, 18, -10]] : [[-8, -20, -12, 0], [8, -20, 12, 0]];
  let h = L.map(([a, b, c, e]) => `<path d="M${a} ${b} L${c} ${e}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><ellipse cx="${c + Math.sign(c) * 4}" cy="${e - 3}" rx="10" ry="6" fill="#fff" stroke="${INK}" stroke-width="4"/>`).join('');
  // 몸(물음표): 굵은 노란 선 + 테두리, 아래 점
  h += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="76" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${CM_Y}" stroke-width="63" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="#FFF3B0" stroke-width="10" stroke-linecap="round" opacity=".55" transform="translate(-9 -8)"/>`;
  if (o.toga) h += `<path d="M-26 -104 L24 -80 L22 -64 L-26 -86 Z" fill="#F4F1EA" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  const gl = clamp(o.glow || 0, 0, 1);
  if (gl > 0) h += `<circle cx="0" cy="-34" r="${f1(30 + 26 * gl)}" fill="#FFF6C8" opacity="${f1(0.45 * gl * 100) / 100}"/>`;
  h += `<circle cx="0" cy="-34" r="22" fill="${gl > 0.3 ? '#FFF6C8' : CM_Y}" stroke="${INK}" stroke-width="6"/>`;
  if (gl > 0.5) h += `<ellipse cx="0" cy="-34" rx="9" ry="7" fill="#fff" stroke="${INK}" stroke-width="2.5"/><circle cx="${f1(lk[0] * 3)}" cy="${f1(-34 + lk[1] * 2)}" r="3.6" fill="${INK}"/>`;
  // 팔(몸통 옆에서)
  const hL = o.hL || [-48, -74], hR = o.hR || [48, -74];
  [[hL, -1], [hR, 1]].forEach(([hp, sd]) => { h += `<path d="M${sd * 22} -96 Q${f1((sd * 22 + hp[0]) / 2 + sd * 6)} ${f1((-96 + hp[1]) / 2 + 6)} ${f1(hp[0])} ${f1(hp[1])}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`; });
  // 얼굴(고리 꼭대기)
  const lx = lk[0] * 3.5, ly = lk[1] * 2.5, E2 = o.eyes || 'norm';
  let f = '';
  [-12, 12].forEach((cx, i) => { const ex = cx + lx, ey = -5 + ly;
    if (E2 === 'wide') f += `<ellipse cx="${f1(ex)}" cy="${f1(ey)}" rx="7.5" ry="9.5" fill="#fff" stroke="${INK}" stroke-width="2.8"/><circle cx="${f1(ex + lk[0] * 2.5)}" cy="${f1(ey + lk[1] * 2.5)}" r="4.2" fill="${INK}"/>`;
    else if (E2 === 'happy') f += `<path d="M${f1(ex - 6)} ${f1(ey + 2)} Q${f1(ex)} ${f1(ey - 7)} ${f1(ex + 6)} ${f1(ey + 2)}" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
    else if (E2 === 'half') f += `<path d="M${f1(ex - 6)} ${f1(ey)} L${f1(ex + 6)} ${f1(ey)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M${f1(ex - 5)} ${f1(ey)} Q${f1(ex)} ${f1(ey + 7)} ${f1(ex + 5)} ${f1(ey)} Z" fill="${INK}"/>`;
    else if (E2 === 'shut') f += `<path d="M${f1(ex + (i ? 5 : -5))} ${f1(ey - 6)} L${f1(ex + (i ? -4 : 4))} ${f1(ey)} L${f1(ex + (i ? 5 : -5))} ${f1(ey + 6)}" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    else f += `<ellipse cx="${f1(ex)}" cy="${f1(ey)}" rx="4.6" ry="7" fill="${INK}"/><circle cx="${f1(ex + 1.5)}" cy="${f1(ey - 2.5)}" r="1.8" fill="#fff"/>`;
  });
  const B = o.brow;
  if (B) { const sh = { up: [-4, -4], angry: [4, -3], worry: [-4, 3], smug: [2, -4] }[B] || [0, 0];
    f += [[-12, -1], [12, 1]].map(([cx, sd]) => `<path d="M${f1(cx + lx - 6 * sd)} ${f1(-18 + ly + (sd < 0 ? sh[1] : sh[0]) * (sd < 0 ? 1 : 1))} L${f1(cx + lx + 6 * sd)} ${f1(-18 + ly + (sd < 0 ? sh[0] : sh[1]))}" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`).join(''); }
  const my = 11 + ly, mx = lx, M = o.mouth || 'smile', tk = clamp(o.talk || 0, 0, 1);
  if (M === 'none') f += '';
  else if (tk > 0.06) f += `<ellipse cx="${f1(mx)}" cy="${f1(my + 1)}" rx="${f1(5 + 2.5 * tk)}" ry="${f1(1.5 + 6 * tk)}" fill="${MO2}" stroke="${INK}" stroke-width="2.6"/>`;
  else if (M === 'O') f += `<ellipse cx="${f1(mx)}" cy="${f1(my + 1)}" rx="4.5" ry="6" fill="${MO2}" stroke="${INK}" stroke-width="2.6"/>`;
  else if (M === 'grin') f += `<path d="M${f1(mx - 9)} ${f1(my - 2)} Q${f1(mx)} ${f1(my + 9)} ${f1(mx + 9)} ${f1(my - 2)} Z" fill="${MO2}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>`;
  else if (M === 'flat') f += `<path d="M${f1(mx - 5)} ${f1(my)} L${f1(mx + 5)} ${f1(my)}" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  else if (M === 'frown') f += `<path d="M${f1(mx - 6)} ${f1(my + 3)} Q${f1(mx)} ${f1(my - 3)} ${f1(mx + 6)} ${f1(my + 3)}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  else if (M === 'smirk') f += `<path d="M${f1(mx - 6)} ${f1(my + 1)} Q${f1(mx + 2)} ${f1(my + 4)} ${f1(mx + 8)} ${f1(my - 4)}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  else f += `<path d="M${f1(mx - 6)} ${f1(my - 1)} Q${f1(mx)} ${f1(my + 6)} ${f1(mx + 6)} ${f1(my - 1)}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  if (o.blush !== 0) f += `<ellipse cx="${f1(-22 + lx)}" cy="${f1(6 + ly)}" rx="5" ry="3" fill="#FF9AAE" opacity=".75"/><ellipse cx="${f1(22 + lx)}" cy="${f1(6 + ly)}" rx="5" ry="3" fill="#FF9AAE" opacity=".75"/>`;
  h += `<g transform="translate(${f1(g.face[0])} ${f1(g.face[1])}) rotate(${f1(g.ang)}) scale(1.3)">${f}</g>`;
  h += [hL, hR].map(hp => `<circle cx="${f1(hp[0])}" cy="${f1(hp[1])}" r="7.5" fill="#fff" stroke="${INK}" stroke-width="3.5"/>`).join('');
  const fl = o.flip || 1;
  return HALO(`<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${f1(s * (o.sx || 1) * fl * 1000) / 1000} ${f1(s * (o.sy || 1) * 1000) / 1000})">${h}</g>`);
}

/* ---------- 소품 ---------- */
// 사직서 봉투(가운데 0,0, 560x320). back: 뒷면(덮개 선)
function cmEnvelope(o = {}) {
  let h = `<rect x="-280" y="-160" width="560" height="320" rx="10" fill="#FBF7EC" stroke="${INK}" stroke-width="8"/>` +
    `<path d="M-180 -160 L-170 160 M120 -160 L132 160 M-280 30 L280 18" stroke="#E2DACA" stroke-width="5" opacity=".9"/>` +   // 접힌 자국
    `<path d="M228 -160 L280 -160 L280 -112 Z" fill="#E9E1D0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-280 132 L-280 160 L-250 160 Z" fill="#E9E1D0" stroke="${INK}" stroke-width="5"/>`;   // 닳은 모서리
  if (o.back) h += `<path d="M-276 -156 L0 30 L276 -156" fill="none" stroke="${INK}" stroke-width="6"/>`;
  else h += `<g transform="skewX(-7)"><text x="10" y="34" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="104" fill="#2A2A2A" letter-spacing="14">사직서</text></g>`;
  return h;
}
// 휴대폰(가운데 0,0, 124x224). screen: 'back'|'off'|'lotto'|'card'|'call'|'shorts', o: { banner(0~1), ring, scroll, dim }
function cmPhone(screen, o = {}) {
  let h = `<rect x="-62" y="-112" width="124" height="224" rx="22" fill="#1F2D44" stroke="${INK}" stroke-width="7"/>`;
  if (screen === 'back') return h + `<rect x="-46" y="-96" width="40" height="52" rx="12" fill="#121B2B" stroke="#0A0F18" stroke-width="3"/><circle cx="-26" cy="-82" r="9" fill="#0A0F18" stroke="#3A4A66" stroke-width="3"/><circle cx="-26" cy="-58" r="9" fill="#0A0F18" stroke="#3A4A66" stroke-width="3"/>`;
  const id = 'cmph' + (cmClipN++);
  let sc = '';
  if (screen === 'lotto' || screen === 'card') {
    sc += `<rect x="-52" y="-98" width="104" height="196" fill="#FFFDF5"/>` + fT(0, -62, '로또 6/45', 17, '#C0392B') + fT(0, -40, '이번 주 1등 예상', 10, '#8A8070', { w: 700 });
    [[14, '#F2C12E'], [23, '#3E7BD6'], [7, '#F2C12E'], [31, '#E5484D'], [38, '#9AA0A8'], [42, '#4CC38A']].forEach(([n, c], i) => { const bx = -32 + (i % 3) * 32, by = -6 + Math.floor(i / 3) * 36;
      sc += `<circle cx="${bx}" cy="${by}" r="14" fill="${c}" stroke="${INK}" stroke-width="2.5"/>` + fT(bx, by + 5, String(n), 13, '#fff', { stroke: INK, sw: 3 }); });
    sc += `<rect x="-36" y="62" width="72" height="20" rx="10" fill="#C0392B"/>` + fT(0, 77, '구매하기', 11, '#fff');
    if (screen === 'card') { const b = clamp(o.banner || 0, 0, 1), y = lerp(-170, -92, easeOutBack(b));
      sc += `<rect x="-52" y="-98" width="104" height="196" fill="#000" opacity="${f1(0.35 * b * 100) / 100}"/><g transform="translate(0 ${f1(y)})"><rect x="-50" y="0" width="100" height="62" rx="10" fill="#2A2F3A" stroke="#fff" stroke-width="2"/>` +
        `<rect x="-42" y="8" width="16" height="12" rx="3" fill="#F2C12E"/>` + fT(-20, 18, '[카드]', 10, '#fff', { anchor: 'start' }) + fT(0, 36, '결제 예정', 11, '#D8DCE6') + fT(0, 54, '1,284,000원', 15, '#FF6B6B') + `</g>`; }
  } else if (screen === 'call') {
    sc += `<rect x="-52" y="-98" width="104" height="196" fill="#22324A"/>` + fT(0, -54, '전화 왔어요', 10, '#AFC3DA', { w: 700 }) + `<circle cx="0" cy="-12" r="22" fill="#5A6E8C" stroke="#fff" stroke-width="2.5"/><circle cx="0" cy="-18" r="8" fill="#DDE6F0"/><path d="M-13 0 Q0 -10 13 0" fill="#DDE6F0"/>` +
      fT(0, 30, '팀장님', 19, '#fff') + `<circle cx="-26" cy="72" r="13" fill="#E5484D"/><circle cx="26" cy="72" r="13" fill="#4CC38A"/>` +
      (o.ring ? `<circle cx="26" cy="72" r="${f1(13 + 8 * o.ring)}" fill="none" stroke="#4CC38A" stroke-width="3" opacity="${f1((1 - o.ring) * 100) / 100}"/>` : '');
  } else if (screen === 'shorts') {
    const sc0 = (o.scroll || 0) % 1;
    sc += `<rect x="-52" y="-98" width="104" height="196" fill="#111"/>`;
    for (let k = -1; k <= 1; k++) { const y0 = -98 + (k - sc0) * 196, c = ['#FF8A5B', '#7CC7FF', '#B98CFF', '#7ED6A7', '#FFD23F'][((Math.floor(o.scroll || 0) + k) % 5 + 5) % 5];
      sc += `<rect x="-52" y="${f1(y0)}" width="104" height="196" fill="${c}" opacity=".75"/><circle cx="0" cy="${f1(y0 + 80)}" r="22" fill="#fff" opacity=".85"/><path d="M-7 ${f1(y0 + 68)} L12 ${f1(y0 + 80)} L-7 ${f1(y0 + 92)} Z" fill="${c}"/>` +
        `<rect x="-40" y="${f1(y0 + 150)}" width="60" height="9" rx="4" fill="#fff" opacity=".8"/><rect x="-40" y="${f1(y0 + 166)}" width="40" height="9" rx="4" fill="#fff" opacity=".6"/>`; }
  } else sc += `<rect x="-52" y="-98" width="104" height="196" fill="#0B0F18"/>`;
  h += `<defs><clipPath id="${id}"><rect x="-52" y="-98" width="104" height="196" rx="14"/></clipPath></defs><g clip-path="url(#${id})">${sc}${o.dim ? `<rect x="-52" y="-98" width="104" height="196" fill="#000" opacity="${o.dim}"/>` : ''}</g>`;
  return h + `<rect x="-14" y="-108" width="28" height="7" rx="3.5" fill="#0A0F18"/>`;
}
// '월화수목금' 바위(가운데 x,y, 반지름 r, 굴러간 각도 rot)
function cmRock(x, y, r, rot = 0, o = {}) {
  const sh = `<path d="M${f1(-r * 0.55)} ${f1(r * 0.62)} Q${f1(r * 0.3)} ${f1(r * 0.98)} ${f1(r * 0.86)} ${f1(r * 0.3)}" fill="none" stroke="#6E747E" stroke-width="${f1(r * 0.12)}" stroke-linecap="round" opacity=".7"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M${f1(-r)} 0 C${f1(-r)} ${f1(-r * 0.62)} ${f1(-r * 0.58)} ${f1(-r)} ${f1(r * 0.04)} ${f1(-r * 0.98)} C${f1(r * 0.66)} ${f1(-r * 0.95)} ${f1(r)} ${f1(-r * 0.5)} ${f1(r * 0.99)} ${f1(r * 0.06)} C${f1(r * 0.98)} ${f1(r * 0.64)} ${f1(r * 0.55)} ${f1(r * 0.99)} ${f1(-r * 0.04)} ${f1(r)} C${f1(-r * 0.62)} ${f1(r * 0.99)} ${f1(-r)} ${f1(r * 0.6)} ${f1(-r)} 0 Z" fill="${o.fill || '#9AA0A8'}" stroke="${INK}" stroke-width="${f1(Math.max(5, r * 0.07))}" transform="rotate(${f1(rot)})"/>` +
    `<g transform="rotate(${f1(rot)})">${sh}<path d="M${f1(-r * 0.6)} ${f1(-r * 0.45)} l${f1(r * 0.16)} ${f1(r * 0.1)} l${f1(r * 0.06)} ${f1(r * 0.16)}" fill="none" stroke="#5E646E" stroke-width="${f1(r * 0.04)}" stroke-linecap="round"/>` +
    `<text x="0" y="${f1(r * 0.13)}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${f1(r * 0.36)}" fill="#5E646E" stroke="#C9CDD3" stroke-width="${f1(r * 0.02)}" paint-order="stroke">월화수목금</text></g></g>`;
}
// 요일 도장(쾅): k = 등장 후 시간(초)
const cmStamp = (x, y, txt, k, col = CM_RED) => { if (k < 0) return ''; const sc = k < 0.14 ? lerp(1.9, 0.92, easeIn(k / 0.14)) : 1 - 0.08 * Math.exp(-(k - 0.14) * 14) * Math.cos((k - 0.14) * 40);
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(-9) scale(${f1(sc * 100) / 100})"><rect x="-66" y="-66" width="132" height="132" rx="16" fill="none" stroke="${col}" stroke-width="12" opacity=".92"/><rect x="-52" y="-52" width="104" height="104" rx="10" fill="${col}" opacity=".9"/>` + fT(0, 30, txt, 84, '#fff') + `</g>`; };
const cmSym = (x, y, txt, k, col = CM_Y, size = 70) => k <= 0.01 ? '' : `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * 100) / 100})">${outlined(0, 0, [[[txt, col]]], { size, sw: 12, lh: size })}</g>`;
const cmSpark = (x, y, k, s = 1) => k <= 0 || k >= 1 ? '' : `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * Math.sin(k * Math.PI) * 100) / 100}) rotate(${f1(k * 90)})"><path d="M0 -26 L6 -6 L26 0 L6 6 L0 26 L-6 6 L-26 0 L-6 -6 Z" fill="#FFF6C8" stroke="#E0B23A" stroke-width="3"/></g>`;
// 전화 목소리(폰에서 나오는 지그재그). k: 목소리 크기
const cmVoiceLines = (x, y, k, dir = 1) => k < 0.05 ? '' : [0, 1, 2].map(i => { const a = (-30 + i * 30) * Math.PI / 180, r0 = 40, r1 = 40 + 50 * k;
  return `<path d="M${f1(x + dir * Math.cos(a) * r0)} ${f1(y + Math.sin(a) * r0)} L${f1(x + dir * Math.cos(a) * (r0 + r1) / 2 + 6)} ${f1(y + Math.sin(a) * (r0 + r1) / 2 - 8)} L${f1(x + dir * Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`; }).join('');
const cmNight = (k = 1, col = '#14123A') => fFull(col, 0.24 * k);
const cmEvening = (k = 1) => fFull('#FF8A3D', 0.12 * k) + fFull('#1B1440', 0.18 * k);
// 다른 승객(무심): 휴대폰만 본다
const cmMan = (t, o) => HALO(char(Object.assign({ goggles: 'none', vest: '#5C6B7E', patch: false, tee: true, collar: true, tie: '#2E3A4C', hair: '#3A3230', vshade: 'rgba(20,30,50,0.22)', seed: 83, t }, o)));
const cmWoman = (t, o) => zGirl(Object.assign({ hairStyle: 'long', hairArgs: [GH.brown || '#6B4A2E'], top: '#C9D7E8', vshade: 'rgba(40,60,90,0.16)', dress: '#4E5A70', seed: 85, t }, o));

/* =========== 1. 훅: 가방 안주머니의 봉투 =========== */
// s0(ph0): 지퍼가 열리며 가방 속이 보인다 / L1(ph1): 봉투 모서리를 엄지로 쓰는 손, 반짝이는 먼지
function cbagScene(t, lt, a) {
  const run = a._run, ph = a.ph;
  const open = easeInOut(cmK(run, 0.05, 0.75)), zx = lerp(140, 1780, open);
  const cam = qLerpCam(run / 6, [960, 540, 1.0], [980, 500, 1.12]);
  let g = `<rect x="-300" y="-200" width="2600" height="1500" fill="#2C3650"/>` +
    Array.from({ length: 14 }, (_, i) => `<path d="M-300 ${-150 + i * 100} L2300 ${-180 + i * 100}" stroke="#36415E" stroke-width="10"/>`).join('');   // 가방 천
  // 열린 입구(타원) 안쪽: 어두운 속, 안주머니, 봉투
  const ry = lerp(26, 430, open), id = 'cmbag' + (cmClipN++);
  let inner = `<rect x="100" y="60" width="1720" height="900" fill="#141A28"/><rect x="200" y="90" width="1520" height="860" rx="30" fill="#232C42"/>`;
  inner += `<g transform="translate(900 470) rotate(-5)">${cmEnvelope()}</g>`;
  inner += `<path d="M230 560 Q960 520 1690 560 L1690 980 L230 980 Z" fill="#3A4766" stroke="${INK}" stroke-width="8"/><path d="M250 584 Q960 546 1670 584" fill="none" stroke="#8C9BBE" stroke-width="5" stroke-dasharray="20 14"/>`;   // 안주머니 앞판(봉투 아래쪽을 가림)
  g += `<defs><clipPath id="${id}"><ellipse cx="960" cy="520" rx="800" ry="${f1(ry)}"/></clipPath></defs><g clip-path="url(#${id})">${inner}</g>`;
  g += `<ellipse cx="960" cy="520" rx="800" ry="${f1(ry)}" fill="none" stroke="${INK}" stroke-width="12"/>`;
  // 지퍼 이빨 + 손잡이(열리는 쪽 끝)
  const teeth = (y0, sd) => Array.from({ length: 40 }, (_, i) => { const x = 170 + i * 41; if (x > zx) return ''; const u = (x - 960) / 800, yy = 520 + sd * ry * Math.sqrt(Math.max(0, 1 - u * u)); return `<rect x="${x - 9}" y="${f1(yy - 7)}" width="18" height="14" rx="3" fill="#C9CED8" stroke="${INK}" stroke-width="3"/>`; }).join('');
  g += teeth(520, -1) + teeth(520, 1);
  if (open < 0.999) g += `<path d="M${f1(zx)} 520 L1790 520" stroke="#C9CED8" stroke-width="14" stroke-dasharray="14 6"/>`;
  g += `<g transform="translate(${f1(zx)} 520)"><rect x="-26" y="-20" width="52" height="40" rx="8" fill="#9AA3B5" stroke="${INK}" stroke-width="6"/><rect x="-12" y="18" width="24" height="70" rx="12" fill="#B9C0CE" stroke="${INK}" stroke-width="6"/></g>`;
  // 손(ph1): 오른쪽 아래에서 들어와 봉투 모서리(오른쪽 위)를 엄지로 쓴다
  if (ph === 1) {
    const ink = easeOut(cmK(lt, 0.15, 0.85)), rub = lt > 0.85 ? Math.sin((lt - 0.85) * 8) : 0;
    const c0 = [1176, 316], hx = lerp(1700, c0[0] + 50, ink) + 16 * rub, hy = lerp(1100, c0[1] + 24, ink) + 6 * rub;
    const ang = Math.atan2(1260 - hy, 1900 - hx), cx = hx + Math.cos(ang) * 80, cy = hy + Math.sin(ang) * 80;
    g += `<path d="M${f1(cx)} ${f1(cy)} L2000 1380" stroke="${INK}" stroke-width="132" stroke-linecap="round"/><path d="M${f1(cx)} ${f1(cy)} L2000 1380" stroke="${TEE}" stroke-width="116" stroke-linecap="round"/>` +
      `<path d="M${f1(cx + Math.cos(ang + 1.57) * 66)} ${f1(cy + Math.sin(ang + 1.57) * 66)} L${f1(cx - Math.cos(ang + 1.57) * 66)} ${f1(cy - Math.sin(ang + 1.57) * 66)}" stroke="#D97A3A" stroke-width="18" stroke-linecap="round"/>` +   // 소매 끝단
      `<circle cx="${f1(hx)}" cy="${f1(hy)}" r="84" fill="#fff" stroke="${INK}" stroke-width="11"/><path d="M${f1(hx - 58)} ${f1(hy - 40)} Q${f1(hx - 92)} ${f1(hy - 92)} ${f1(hx - 44)} ${f1(hy - 96)}" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/>`;   // 엄지
    for (let i = 0; i < 5; i++) { const k = ((lt - 0.9 - i * 0.37) % 1.4) / 1.0; if (lt > 0.9 + i * 0.37) g += cmSpark(c0[0] - 70 + hash(i * 3) * 140, c0[1] - 40 - hash(i * 5) * 80 - k * 40, k, 0.55 + hash(i) * 0.3); }
    const tY = cmW(a, ['3년', '삼년', '년째'], 2.0), yk = ACT.symK(lt, tY - 0.1, 99);
    if (yk > 0.01) g += `<g transform="translate(560 250) scale(${f1(yk * 100) / 100}) rotate(-6)">${label(0, 0, '3년째', { size: 52, bg: CM_Y })}</g>`;
  }
  return qDefs() + qCam(cam, g) + `<rect x="-300" y="-200" width="2600" height="1500" fill="#FFB547" opacity=".05"/>`;
}

/* =========== 2. 출근 지하철: 로또 상상 → 카드값 → 팀장 전화 → "네, 팀장님!" =========== */
const CS = { X: 900, Y: 1150, S: 1.15 };
const CS_HOLD = () => A2.pose({ hL: [186, 330], hR: [214, 330] });   // 휴대폰을 두 손으로 가슴 앞에
const CS_EAR = () => A2.pose({ hL: [158, 420], hR: [326, 192] });
const CS_LOOK = () => A2.pose({ hL: [168, 420], hR: [262, 262] });   // 전화 화면을 얼굴 앞에 들어 본다   // 오른손 휴대폰을 귀에, 왼손은 내림
function csSet(t, inner, cam, o = {}) {
  const man = cmMan(t, { x: 1830, y: CS.Y, s: 1.0, pose: A2.pose({ hL: [186, 330], hR: [214, 330] }), ex: fEx('기본'), look: [-0.1, 0.8] });
  const mp = cmPt(1830, CS.Y, 1.0, 0, 214, 330);
  return qDefs() + qPlate('subway', cam, 0.55) + qCam(cam, qShadow(1830, CS.Y, 64) + man + `<g transform="translate(${f1(mp[0] - 12)} ${f1(mp[1])}) scale(.5)">${cmPhone('back')}</g>` + qShadow(CS.X, CS.Y, 74) + inner) + (o.after || '');
}
const cmBubClip = inner => { const id = 'cmbc' + (cmClipN++); return `<defs><clipPath id="${id}"><rect x="-274" y="-144" width="548" height="288" rx="144"/></clipPath></defs><g clip-path="url(#${id})">${inner}</g>`; };
function cmMiniDesk(lt, tTak) {   // 생각 풍선 속: 팀장 책상에 봉투 '탁'
  let h = `<rect x="-200" y="44" width="330" height="22" rx="5" fill="#B98552" stroke="${INK}" stroke-width="5"/><rect x="-186" y="66" width="300" height="70" fill="#9C6A3F" stroke="${INK}" stroke-width="5"/>` +
    `<g transform="translate(60 30)"><path d="M-40 14 L40 14 L30 -8 L-30 -8 Z" fill="#3A4252" stroke="${INK}" stroke-width="4"/>${fT(0, 9, '팀장', 16, '#fff')}</g>`;
  const fall = cmK(lt, tTak - 0.9, tTak), ey = lerp(-96, 30, easeIn(fall)), sq = lt > tTak ? 1 - 0.25 * Math.exp(-(lt - tTak) * 9) : 1;
  h += `<g transform="translate(-60 ${f1(ey)}) rotate(${f1(lerp(-24, -4, fall))}) scale(${f1(0.24 / sq * 100) / 100} ${f1(0.24 * sq * 100) / 100})">${cmEnvelope()}</g>`;
  // 미니 제로(선글라스): 오른팔을 휘두른 뒤
  const mz = cmZ('_cmMini', cmFace(lt, { eyes: { open: 1 }, mouth: { v: ACT.VIS.M, o: 0, c: 3 }, hfx: `<rect x="122" y="146" width="66" height="40" rx="14" fill="#1E2230"/><rect x="212" y="146" width="66" height="40" rx="14" fill="#1E2230"/><path d="M188 160 L212 160" stroke="#1E2230" stroke-width="8"/>` }),
    { t: lt, x: -210, y: 136, s: 0.32, pose: A2.pose({ hL: [150, 400], hR: [lt > tTak ? 330 : 300, lt > tTak ? 250 : 160] }), look: [0.6, 0.2] });
  h += mz;
  if (lt > tTak) { const k = lt - tTak;
    h += cmSym(30, -40, '탁!', clamp(k / 0.12, 0, 1) * (k < 1.3 ? 1 : 0), '#fff', 46);
    for (let i = 0; i < 14; i++) { const vx = (hash(i * 3.1) - 0.5) * 360, vy = -180 - hash(i * 1.7) * 160, x = -60 + vx * k, y = 20 + vy * k + 380 * k * k; if (k < 1.4) h += `<rect x="${f1(x)}" y="${f1(y)}" width="12" height="7" rx="2" fill="${['#FFD23F', '#FF7AA2', '#7CC7FF', '#7ED6A7'][i % 4]}" transform="rotate(${f1(k * 400 + i * 40)} ${f1(x)} ${f1(y)})"/>`; }
  }
  return h;
}
function csubScene(t, lt, a) {
  const ph = a.ph, run = a._run;
  const zx = CS.X, zy = CS.Y, zs = CS.S;
  const head = cmPt(zx, zy, zs, 0, 200, 170);
  if (ph === 0) {   // L2: 로또 화면을 보며 히죽, 생각 풍선: 팀장 책상에 '탁'
    const tTak = cmW(a, ['탁'], a._dur - 0.3), bk = ACT.symK(lt, 0.25, 99);
    const face = cmFace(t, { eyes: { open: 1 - ACT.blinks(lt, [1.4], 0.15), squint: 0.45 }, brow: { raise: 5 }, mouth: cmMouth(t, { v: ACT.VIS.M, o: 0, c: 3 }, 3), blush: 0.55 });
    const zero = cmZ('_cs0', face, { t, x: zx, y: zy, s: zs, pose: CS_HOLD(), look: [0.15, 0.75], holdR: { svg: `<g transform="translate(-10 -6) scale(.42)">${cmPhone('back')}</g>`, rot: 0 }, handL: 'grip', handR: 'grip', tilt: 4 });
    const bub = bk > 0.01 ? `<g transform="translate(1360 470) scale(${f1(bk * 100) / 100})">${bubble(0, 0, 560, 300, cmBubClip(cmMiniDesk(lt, tTak)), {})}</g>` : '';
    const glow = `<ellipse cx="${f1(head[0])}" cy="${f1(head[1] + 60)}" rx="120" ry="90" fill="#BFE4FF" opacity=".16"/>`;
    const cam = qLerpCam(lt / 4, [1010, 720, 1.3], [1020, 712, 1.36]);
    return csSet(t, zero + glow + bub, cam);
  }
  if (ph === 1) {   // s1: '띠링' → 휴대폰 인서트(카드값 알림) → 풍선이 깨지고 → '팀장님' 전화 진동
    if (lt < 0.95) {
      const b = cmK(lt, 0.12, 0.4), cam = qLerpCam(lt / 0.95, [960, 540, 1.0], [960, 540, 1.06]);
      return qDefs() + qPlate('subway', cam, 0.5, { blur: true }) + fFull('#0B1020', 0.45) + qCam(cam, `<g transform="translate(960 560) scale(3.6)">${cmPhone('card', { banner: b })}</g>` + cmSym(1430, 250, '띠링!', ACT.symK(lt, 0.1, 0.8), '#fff', 64));
    }
    const u = lt - 0.95, crack = cmK(u, 0, 0.18), shat = cmK(u, 0.2, 0.75), ring = u > 0.5;
    const jit = ring ? Math.sin(t * 70) * 3 : 0;
    const face = cmFace(t, { eyes: { open: 1, size: 1 + 0.25 * clamp(ACT.pop(u, 0.02), 0, 1.2) }, brow: { raise: 12 * clamp(ACT.pop(u, 0.02), 0, 1), worry: 0.3 }, mouth: { v: ACT.VIS.O, o: 0.25, c: -1 }, blush: 0.2,
      hfx: tt => ACT.sym('sweat', 290, 96, u, 0.25, 99) });
    const rk = easeInOut(cmK(u, 0.45, 0.68)), pose1 = A2.blend(CS_HOLD(), CS_LOOK(), rk);
    const zero = cmZ('_cs1', face, { t, x: zx, y: zy, s: zs, pose: pose1, look: ring ? [0.55, 0.35] : [0.6, -0.5], holdR: { svg: rk > 0.5 ? `<g transform="translate(${f1(jit + 6)} -20) scale(.6)">${cmPhone('call', { ring: (t * 2) % 1 })}</g>` : `<g transform="translate(-10 -6) scale(.42)">${cmPhone('back')}</g>`, rot: 0 }, handL: rk < 0.5 ? 'grip' : null, handR: 'grip', headDy: -4 * clamp(ACT.pop(u, 0.02), 0, 1) });
    let bub = '';
    if (u < 0.2) { let cr = ''; for (let i = 0; i < 5; i++) { const a0 = i * 1.25, L = 70 + 90 * crack; cr += `<path d="M0 0 L${f1(Math.cos(a0) * L * 0.5 + 10)} ${f1(Math.sin(a0) * L * 0.4)} L${f1(Math.cos(a0) * L)} ${f1(Math.sin(a0) * L * 0.55)}" stroke="${INK}" stroke-width="5" fill="none"/>`; }
      bub = `<g transform="translate(1360 470)">${bubble(0, 0, 560, 300, cmBubClip(`<g opacity=".5">${cmMiniDesk(99, 0)}</g>`), {})}${cr}</g>`; }
    else { for (let i = 0; i < 9; i++) { const vx = (hash(i * 2.3) - 0.5) * 500, vy = -120 - hash(i * 4.1) * 160, x = 1360 + (hash(i * 7) - 0.5) * 460 + vx * shat, y = 470 + (hash(i * 9) - 0.5) * 220 + vy * shat + 900 * shat * shat;
        bub += `<path d="M0 -40 L46 -6 L18 36 L-34 22 Z" fill="#fff" stroke="${INK}" stroke-width="6" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(hash(i) * 360 + shat * 300)}) scale(${f1(0.6 + hash(i * 5) * 0.8)})" opacity="${f1((1 - shat) * 100) / 100}"/>`; } }
    const pp = cmPt(zx, zy, zs, 0, 268, 240);
    const bzz = ring ? [0, 1].map(sd => `<path d="M${f1(pp[0] + sd * 70 - 35)} ${f1(pp[1] - 40)} q${sd ? 14 : -14} 12 0 24 q${sd ? -14 : 14} 12 0 24" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity="${f1(0.5 + 0.5 * Math.abs(Math.sin(t * 20)))}"/>`).join('') : '';
    const cam = [1010, 720, 1.36];
    return csSet(t, zero + bub + bzz, cam);
  }
  if (ph === 2) {   // L3: 예비 동작(눈 크게 → 어깨 들썩) → 휴대폰을 귀에. 팀장 목소리 지그재그
    const k = A2.actK(lt, 0.18, 0.28, { antic: 0.14, anticAmt: 0.1, over: 0.06 }), pose = A2.blend(CS_HOLD(), CS_EAR(), clamp(k, 0, 1));
    const face = cmFace(t, { eyes: { open: 1 - ACT.blinks(lt, [1.6], 0.15), size: 1.15 }, brow: { raise: 9 }, mouth: { v: ACT.VIS.M, o: 0, c: 1.5 }, blush: 0.25, hfx: tt => ACT.sym('sweat', 292, 100, lt, 0.6, 99) });
    const zero = cmZ('_cs2', face, { t, x: zx, y: zy, s: zs, pose, look: [0.3, -0.05], holdR: { svg: `<g transform="translate(0 -4) rotate(${f1(lerp(0, -12, clamp(k, 0, 1)))}) scale(.42)">${cmPhone(k > 0.5 ? 'back' : 'back')}</g>`, rot: 0 }, handL: k < 0.5 ? 'grip' : null, handR: 'grip', sy: 1 + 0.03 * ACT.pulse(lt, 0.04, 0.3) });
    const ep = cmPt(zx, zy, zs, 0, 300, 180);
    return csSet(t, zero + cmVoiceLines(ep[0] + 30, ep[1] - 10, env(t) * (k > 0.6 ? 1 : 0), 1), qLerpCam(lt / 3, [990, 700, 1.4], [990, 690, 1.48]));
  }
  // ph3 L4: "네, 팀장님! 빛의 속도로!" — 꾸벅 두 번, 웃는 얼굴, 속도선
  const tA = cmW(a, ['네'], 0.1), tB = cmW(a, ['빛'], 0.9);
  const bk = Math.max(ACT.pulse(lt, tA - 0.05, 0.5), ACT.pulse(lt, tB - 0.05, 0.5));
  const pose = A2.pose({ hL: [196, 404], hR: [326, 192] });
  const face = cmFace(t, { eyes: { open: 1, squint: 0.6 }, brow: { raise: 6, worry: 0.3 }, mouth: cmMouth(t, { v: ACT.VIS.M, o: 0, c: 3 }, 3), blush: 0.5, hfx: tt => ACT.sym('sweat', 292, 100, lt, 0.2, 99) });
  const zero = cmZ('_cs3', face, { t, x: zx, y: zy, s: zs, pose, look: [0.05, 0.25 + 0.6 * bk], holdR: { svg: `<g transform="translate(0 -4) rotate(-12) scale(.42)">${cmPhone('back')}</g>`, rot: 0 }, handR: 'grip', headDy: 26 * bk, tilt: 7 * bk, sy: 1 - 0.09 * bk, rot: 8 * bk });
  let speed = '';
  if (false) { const k = 0; for (let i = 0; i < 7; i++) { const y = 560 + i * 70 + (hash(i) - 0.5) * 30, x0 = 380 - hash(i * 3) * 200; speed += `<path d="M${f1(x0)} ${f1(y)} L${f1(x0 + 360 * k)} ${f1(y)}" stroke="${CM_Y}" stroke-width="${f1(10 - i)}" stroke-linecap="round" opacity="${f1((1 - cmK(lt, tB + 0.9, tB + 1.4)) * 0.8 * 100) / 100}"/>`; } }
  const hd = cmPt(zx, zy, zs, 0, 200, 150);
  return csSet(t, zero + cmSpark(hd[0] - 190, hd[1] - 60, cmK(lt, tB, tB + 0.5), 1.4) + cmSpark(hd[0] + 210, hd[1] - 130, cmK(lt, tB + 0.15, tB + 0.65), 1.1), qLerpCam(lt / 3, [990, 700, 1.4], [995, 700, 1.46]));
}

/* =========== 3. 같은 하루 몽타주(월·화·수 도장) =========== */
function cmontScene(t, lt, a) {
  const D = a._dur, t2 = cmWn(a, '같은', 1, D / 3) - 0.08, t3 = cmWn(a, '같은', 2, 2 * D / 3) - 0.08;
  const cut = lt < t2 ? 0 : lt < t3 ? 1 : 2, c0 = [0, t2, t3][cut], u = lt - c0;
  let w = '';
  if (cut === 0) {   // 지하철 손잡이: 멍한 얼굴, 흔들림
    const sw = Math.sin(lt * 2.2) * 6, cam = [900, 690, 1.42];
    const face = cmFace(t, { eyes: { open: 1 - ACT.blinks(lt, [0.5], 0.2), flat: 0.5 }, mouth: { v: ACT.VIS.M, o: 0, c: -0.5 }, blush: 0.15 });
    const zero = cmZ('_cm0', face, { t, x: 880, y: 1150, s: 1.15, pose: A2.pose({ hL: [168, 420], hR: [322, 186], reach: { R: 1.05 } }), look: [-0.2, 0.2], handR: 'grip', rot: sw * 0.3 });
    const hp = cmPt(880, 1150, 1.15, sw * 0.3, 322, 186);
    w = qDefs() + qPlate('subway', cam, 0.55) + qCam(cam, cmStrapBand(hp[0], hp[1], 120) + qShadow(880, 1150, 74) + zero + cmStrapGrip(hp[0], hp[1], 1.15));
  } else if (cut === 1) {   // 모니터의 같은 보고서(글자가 채워진다)
    const cam = qLerpCam(u / 1.2, [960, 520, 1.0], [960, 520, 1.05]), n = Math.floor(clamp(u / 0.9, 0, 1) * 7);
    let doc = `<rect x="430" y="150" width="1060" height="660" rx="26" fill="#2A3140" stroke="${INK}" stroke-width="10"/><rect x="462" y="182" width="996" height="560" rx="8" fill="#F4F7FB"/>` +
      `<rect x="462" y="182" width="996" height="46" fill="#3E6FB0"/>` + fT(490, 214, '주간보고서_최종_진짜최종.hwp', 26, '#fff', { anchor: 'start' }) + fT(960, 300, '주간 업무 보고', 46, INK);
    for (let i = 0; i < 7; i++) doc += `<rect x="540" y="${340 + i * 52}" width="${i < n ? 640 + hash(i * 3) * 200 : 0}" height="18" rx="9" fill="#C9D2E0"/>`;
    doc += `<rect x="${f1(540 + (n < 7 ? (640 + hash(n * 3) * 200) * ((u * 7 / 0.9) % 1) : 840))}" y="${336 + Math.min(n, 6) * 52}" width="5" height="26" fill="${INK}" opacity="${(t * 2) % 1 < 0.5 ? 1 : 0}"/><rect x="900" y="810" width="120" height="80" fill="#2A3140" stroke="${INK}" stroke-width="8"/><rect x="800" y="884" width="320" height="26" rx="10" fill="#2A3140" stroke="${INK}" stroke-width="8"/>`;
    w = qDefs() + qPlate('office', cam, 0.55, { blur: true }) + fFull('#F4F1EA', 0.1) + qCam(cam, doc);
  } else {   // 사무실: 전화 꾸벅
    const bk = ACT.pulse(u, 0.08, 0.45), cam = [960, 700, 1.4];
    const face = cmFace(t, { eyes: { open: 1, squint: 0.55 }, brow: { raise: 4, worry: 0.4 }, mouth: { v: ACT.VIS.M, o: 0, c: 2.5 }, blush: 0.35 });
    const zero = cmZ('_cm2', face, { t, x: 960, y: 1150, s: 1.15, pose: A2.pose({ hL: [196, 404], hR: [326, 192] }), look: [0, 0.3 + 0.6 * bk], holdR: { svg: `<g transform="translate(0 -4) rotate(-12) scale(.42)">${cmPhone('back')}</g>`, rot: 0 }, handR: 'grip', headDy: 26 * bk, tilt: 7 * bk, sy: 1 - 0.09 * bk, rot: 8 * bk });
    w = qDefs() + qPlate('office', cam, 0.55) + qCam(cam, qShadow(960, 1150, 74) + zero);
  }
  // 요일 도장: 컷마다 하나씩 쾅, 앞의 도장은 남는다(화면 좌표)
  const st = ['월', '화', '수'].map((d, i) => i <= cut ? cmStamp(1490 + i * 150, 190, d, lt - [0, t2, t3][i] - 0.08) : '').join('');
  return w + st;
}

/* =========== 4. 수요일 아침: 머리에서 '뿅' — 왜요 등장 =========== */
const CP = { X: 900, Y: 1150, S: 1.2 };
function cmWhyOnHead(zx, zy, zs, o = {}) {   // 정수리 위 앉은 자리(제로 머리 꼭대기)
  const p = cmPt(zx, zy, zs, o.rot || 0, 212 + (o.dx || 0), 54 + (o.headDy || 0));
  return p;
}
function cpopScene(t, lt, a) {
  const ph = a.ph, run = a._run, zx = CP.X, zy = CP.Y, zs = CP.S, cam = qLerpCam(run / 6, [920, 640, 1.45], [930, 630, 1.52]);
  const pose = A2.pose({ hL: [168, 420], hR: [322, 186], reach: { R: 1.05 } }), sw = Math.sin(t * 2.2) * 1.2;
  const hp = cmPt(zx, zy, zs, sw, 322, 186), seat = cmWhyOnHead(zx, zy, zs, { rot: sw });
  let why = '', fxs = '', zlook = [-0.2, 0.2], zface = {};
  if (ph === 0) {   // s2: 볼록 → 뿅 → 정수리에 척
    const bump = run < 0.42 ? easeOut(cmK(run, 0.08, 0.36)) : 0, flinch = ACT.pulse(run, 0.42, 0.3);
    if (bump > 0) { const top = cmPt(zx, zy, zs, sw, 205, 58); fxs += `<ellipse cx="${f1(top[0])}" cy="${f1(top[1] - 6 * bump)}" rx="${f1(30 + 6 * Math.sin(run * 40))}" ry="${f1(26 * bump)}" fill="#fff" stroke="${INK}" stroke-width="8"/>`; }
    if (run >= 0.42) {
      const u = cmK(run, 0.42, 0.74), land = run >= 0.74;
      let x = lerp(seat[0] - 10, seat[0], u), y = land ? seat[1] : lerp(seat[1] + 10, seat[1], u) - Math.sin(u * Math.PI) * 170, sy = land ? 1 - 0.24 * Math.exp(-(run - 0.74) * 9) * Math.cos((run - 0.74) * 26) : 1.12;
      why = cmWhy(x, y, 0.9, { t, eyes: land ? 'wide' : 'shut', mouth: land ? 'O' : 'grin', legs: land ? 'sit' : 'jump', sy, sx: 2 - sy, look: [0, 0.3] });
      fxs += cmSym(seat[0] + 190, seat[1] - 150, '뿅!', ACT.symK(run, 0.44, 0.95), '#fff', 64);
    }
    zface = { eyes: { open: 1 - 0.9 * flinch }, brow: { raise: run > 0.6 ? 8 : 0 }, mouth: { v: ACT.VIS.M, o: 0, c: run > 0.6 ? -0.5 : 0 }, hfx: tt => ACT.sym('!', 290, 40, run, 0.55, 0.95) };
    zlook = run > 0.6 ? [0.05, -0.95] : [-0.2, 0.2];
  } else if (ph === 1) {   // L6: 왜요가 얼굴 쪽으로 몸을 기울여 묻는다 / 제로는 눈만 위로
    const lean = easeInOut(cmK(lt, 0.0, 0.4)), tilt = Math.sin(lt * 3) * 3;
    why = cmWhy(seat[0], seat[1], 0.9, { t, eyes: 'norm', brow: 'up', mouth: 'smile', talk: cmWhyTalk(t), legs: 'sit', rot: -24 * lean + tilt, look: [-0.5, 0.9], hL: [-50, -60], hR: [40, -100] });
    zface = { eyes: { open: 1 - ACT.blinks(lt, [1.3], 0.15) }, brow: { raise: 6, worry: 0.2 }, mouth: { v: ACT.VIS.M, o: 0, c: 0 } };
    zlook = [0.08, -1];
  } else {   // L7: 이름 카드 '왜요' + 꾸벅
    const tName = cmW(a, ['왜요'], a._dur - 0.6), bow = ACT.pulse(lt, tName + 0.15, 0.55), nk = ACT.symK(lt, tName - 0.1, 99);
    why = cmWhy(seat[0], seat[1], 0.9, { t, eyes: lt > tName ? 'happy' : 'norm', brow: 'up', mouth: 'grin', legs: 'sit', rot: 28 * bow, look: [0.4, 0.2], hL: [-50, -66], hR: lt > tName ? [56, -110 + 10 * Math.sin(lt * 14)] : [48, -72] });
    if (nk > 0.01) fxs += `<g transform="translate(${f1(seat[0] + 250)} ${f1(seat[1] - 120)}) scale(${f1(nk * 100) / 100}) rotate(-4)">${label(0, 0, '왜요', { size: 54, bg: CM_Y })}</g>` +
      `<path d="M${f1(seat[0] + 180)} ${f1(seat[1] - 100)} L${f1(seat[0] + 90)} ${f1(seat[1] - 80)}" stroke="${INK}" stroke-width="7" stroke-linecap="round" opacity="${f1(clamp(nk, 0, 1) * 100) / 100}"/>`;
    zface = { eyes: { open: 1 - ACT.blinks(lt, [0.8, 2.6], 0.15) }, brow: { raise: 4 }, mouth: { v: ACT.VIS.M, o: 0, c: 0.5 } };
    zlook = [0.1, -0.85];
  }
  const zero = cmZ('_cp' + ph, cmFace(t, zface), { t, x: zx, y: zy, s: zs, pose, look: zlook, handR: 'grip', rot: sw });
  const stamp = cmStamp(1790, 190, '수', 9);
  return qDefs() + qPlate('subway', cam, 0.55) + qCam(cam, cmStrapBand(hp[0], hp[1], 120) + qShadow(zx, zy, 76) + zero + cmStrapGrip(hp[0], hp[1], zs) + why + fxs) + `<rect x="-300" y="-200" width="2600" height="1500" fill="#FFF3D6" opacity=".06"/>` + stamp;
}

/* =========== 5. 회의실: 왜요가 날뛰고, 제로가 입을 막는다 =========== */
const CMT = { X: 1000, Y: 1220, S: 1.1, TY: 1024 };
function cmTable() {
  const T = CMT.TY;
  return `<path d="M120 ${T - 24} L1900 ${T - 24} L1960 ${T + 2} L60 ${T + 2} Z" fill="#ECE6DA" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="60" y="${T}" width="1900" height="26" rx="5" fill="#D8D0C0" stroke="${INK}" stroke-width="7"/>` +
    `<rect x="90" y="${T + 24}" width="1840" height="260" fill="#C9C2B4" stroke="${INK}" stroke-width="7"/>`;
}
const cmChair = (x, y, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-150" y="-420" width="300" height="220" rx="40" fill="#3A4252" stroke="${INK}" stroke-width="8"/><rect x="-124" y="-398" width="248" height="30" rx="15" fill="#4C566B"/></g>`;
const cmPaper = (x, y, k = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(-3)"><path d="M-80 -16 L80 -16 L92 10 L-92 10 Z" fill="#FBFAF4" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` + fT(0, 4, '보고서', 18, '#3E6FB0') + `</g>`;
function cmeetScene(t, lt, a) {
  const ph = a.ph, zx = CMT.X, zy = CMT.Y, zs = CMT.S, T = CMT.TY;
  const cam = qLerpCam(a._run / 7, [1000, 800, 1.32], [1010, 810, 1.38]);
  const col = cmMan(t, { x: 560, y: zy, s: 1.1, pose: A2.pose({ hL: [178, 410], hR: [222, 410] }), ex: fEx('기본'), look: [-0.85, 0.05] });
  const paperX = 1110, WS = 0.8;
  const headSeat = cmPt(zx, zy, zs, 0, 212, 54), tableSeat = [paperX + 120, T - 14];
  let why = '', over = '', pose = A2.pose({ hL: [178, 410], hR: [222, 410] }), look = [-0.7, 0.05], zf = {};
  if (ph === 0) {   // L8: 머리 위에서 폴짝폴짝 → '보고서'에 책상으로 뛰어내려 가리킨다 → '읽잖아'에 쿵쿵
    const w1 = cmWn(a, '왜', 0, 0.2), w2 = cmWn(a, '왜', 1, 0.9), tRep = cmW(a, ['보고서'], 1.8), tRead = cmW(a, ['읽잖'], 3.0);
    const hop = Math.max(ACT.pulse(lt, w1 - 0.05, 0.32), ACT.pulse(lt, w2 - 0.05, 0.32));
    const ju = cmK(lt, tRep - 0.35, tRep + 0.15), onTable = ju >= 1, stomp = ACT.pulse(lt, tRead, 0.2) + ACT.pulse(lt, tRead + 0.3, 0.2);
    let x, y, legs = 'sit', sy = 1, hR = [56, -120 + 12 * Math.sin(lt * 16)], hL = [-50, -70], rot = 0;
    if (ju <= 0) { x = headSeat[0]; y = headSeat[1] - 70 * hop; legs = hop > 0.2 ? 'jump' : 'sit'; }
    else if (!onTable) { x = lerp(headSeat[0], tableSeat[0], ju); y = lerp(headSeat[1], tableSeat[1], ju) - Math.sin(ju * Math.PI) * 160; legs = 'jump'; sy = 1.1; }
    else { const k = lt - tRep - 0.15; x = tableSeat[0]; y = tableSeat[1]; legs = 'stand'; sy = 1 - 0.2 * Math.exp(-k * 10) - 0.12 * stomp; hR = [40, -60]; hL = [-70, -58 + 8 * Math.sin(lt * 12)]; rot = -10; }
    why = cmWhy(x, y, WS, { t, eyes: 'wide', brow: 'angry', mouth: 'O', talk: cmWhyTalk(t), legs, sy, sx: 2 - sy, hL, hR, rot, look: onTable ? [-0.9, 0.6] : [0.3, -0.2] });
    const wy = onTable ? 0.5 : -0.7;
    look = ACT.saccade(lt, [[0, [-0.6, 0.05]], [0.3, [0.1, -0.9]], [tRep, [0.5, 0.6]], [tRead + 0.4, [-0.8, 0.05]]], 0.05, 51);
    zf = { eyes: { open: 1 - ACT.blinks(lt, [tRep + 0.5], 0.15), size: 1.08 }, brow: { raise: 6, worry: 0.6 }, mouth: { v: ACT.VIS.M, o: 0, c: 0.5 }, hfx: tt => ACT.sym('sweat', 290, 96, lt, tRep, 99) };
  } else {   // L9: 웃는 얼굴 그대로(괜찮은 척) 손을 뻗어 왜요의 입을 막는다
    const reach = A2.actK(lt, 0.08, 0.3, { antic: 0.1, anticAmt: 0.08, over: 0.05 }), rk = clamp(reach, 0, 1.05);
    const wo = { t, eyes: 'wide', brow: 'worry', mouth: 'none', legs: 'stand', rot: -6 + 4 * Math.sin(lt * 9) * cmK(lt, 0.4, 0.6), hL: [-70, -96 + 14 * Math.sin(lt * 15)], hR: [64, -100 + 14 * Math.sin(lt * 13 + 1)], look: [-0.6, -0.4] };
    why = cmWhy(tableSeat[0], tableSeat[1], WS, wo);
    const fp = cmWhyFace(tableSeat[0], tableSeat[1], WS, wo), loc = cmLoc(zx, zy, zs, 0, fp[0], fp[1]);
    pose = A2.blend(A2.pose({ hL: [178, 410], hR: [222, 410] }), A2.pose({ hL: [178, 410], hR: loc }), rk);
    const hw = cmPt(zx, zy, zs, 0, pose.hR[0], pose.hR[1]);
    if (rk > 0.3) over += cmHand(hw, zs) + cmSym(fp[0] + 70, fp[1] - 70, '읍!', ACT.symK(lt, 0.45, 1.2), '#fff', 34);
    look = ACT.saccade(lt, [[0, [0.5, 0.6]], [0.5, [-0.85, 0.05]], [1.6, [0.4, 0.5]], [2.2, [-0.85, 0.05]]], 0.05, 52);
    zf = { eyes: { open: 1, squint: 0.35 }, brow: { worry: 0.75, raise: 3 }, mouth: cmMouth(t, { v: ACT.VIS.M, o: 0, c: 2.5 }, 2.5), blush: 0.45, hfx: tt => ACT.sym('sweat', 290, 96, lt, 0, 99) };
  }
  const zero = cmZ('_cmt' + ph, cmFace(t, zf), { t, x: zx, y: zy, s: zs, pose, look, handR: ph === 1 ? null : null });
  const w = cmChair(560, zy, 1.1) + col + cmChair(zx, zy, 1.1) + zero + cmTable() + cmPaper(paperX, T - 6) + `<rect x="${f1(500 - 70)}" y="${T - 22}" width="140" height="18" rx="3" fill="#FBFAF4" stroke="${INK}" stroke-width="4"/>` + why + over;
  return qDefs() + qPlate('meet', cam, 0.55) + qCam(cam, w) + `<rect x="-300" y="-200" width="2600" height="1500" fill="#FFF8E6" opacity=".05"/>`;
}

/* =========== 6. 퇴근 지하철: 화면을 넘기는 동안 입이 막힌 왜요가 시든다 =========== */
function cscrollScene(t, lt, a) {
  const D = a._dur, zx = 960, zy = 1190, zs = 1.15, cam = qLerpCam(lt / D, [890, 880, 1.55], [880, 890, 1.65]);
  const wl = easeInOut(cmK(lt, 0.6, D - 0.6)), wx = 770, wyS = 1104, WS = 0.72;
  const wo = { t, eyes: wl > 0.55 ? 'half' : 'norm', brow: 'worry', mouth: 'none', legs: 'sit', wilt: wl, look: [0.4, -0.3 + 0.6 * wl], hL: [-46, -66], hR: [44, -66], blush: 0 };
  const fp = cmWhyFace(wx, wyS, WS, wo), loc = cmLoc(zx, zy, zs, 0, fp[0], fp[1]);
  const pose = A2.pose({ hL: loc, hR: [232, 356], fL: [146, 534], fR: [256, 534], dy: 78, reach: { L: 1.25 } });
  const scroll = (() => { let s = 0; for (let i = 0; i < 8; i++) s += easeInOut(cmK(lt, 0.4 + i * 0.62, 0.62 + i * 0.62)); return s; })();
  const face = cmFace(t, { eyes: { open: 1 - ACT.blinks(lt, [1.2, 3.1], 0.2), flat: 0.5 }, brow: { worry: 0.1 }, mouth: { v: ACT.VIS.M, o: 0, c: -0.3 }, blush: 0.1 });
  const zero = cmZ('_csc', face, { t, x: zx, y: zy, s: zs, pose, look: [0.25, 0.75], holdR: { svg: `<g transform="translate(-4 -40) rotate(-6) scale(.5)">${cmPhone('shorts', { scroll })}</g>`, rot: 0 }, handR: 'grip' });
  const T = 1100;
  const bench = `<rect x="430" y="860" width="1180" height="${T - 860}" rx="30" fill="#3F63B8" stroke="${INK}" stroke-width="8"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${470 + i * 190} 890 L${470 + i * 190} ${T - 30}" stroke="#35539C" stroke-width="8"/>`).join('') +
    `<rect x="400" y="${T - 10}" width="1240" height="56" rx="20" fill="#4A72C8" stroke="${INK}" stroke-width="8"/><rect x="430" y="${T + 44}" width="1180" height="200" fill="#9BA6B8" stroke="${INK}" stroke-width="8"/>`;
  const hw = cmPt(zx, zy, zs, 0, pose.hL[0], pose.hL[1]);
  const pp = cmPt(zx, zy, zs, 0, 232, 300), glow = `<ellipse cx="${f1(pp[0] - 30)}" cy="${f1(pp[1] - 140)}" rx="150" ry="110" fill="#9FD3FF" opacity=".14"/>`;
  return qDefs() + qPlate('subway', cam, 0.5, { blur: true }) + qCam(cam, bench + cmWhy(wx, wyS, WS, wo) + zero + cmHand(hw, zs) + glow) + cmEvening(1);
}

/* =========== 7. 오래된 책장: 1942년, 카뮈 =========== */
function cmCommuters(old) {   // 출근 그림(오늘 지하철 / 1940년대 전차) — 같은 구도
  const ink = old ? '#4A3424' : INK, body = old ? '#C9B18C' : '#E9EEF5', car = old ? '#B08A5A' : '#B9C7D9';
  let h = `<rect x="0" y="0" width="900" height="520" fill="${old ? '#E8D6B0' : '#F2F6FB'}"/>`;
  h += `<rect x="40" y="70" width="820" height="360" rx="${old ? 60 : 20}" fill="${car}" stroke="${ink}" stroke-width="8"/>`;
  for (let i = 0; i < 4; i++) h += `<rect x="${80 + i * 195}" y="110" width="150" height="130" rx="${old ? 30 : 10}" fill="${old ? '#F3E6C8' : '#DDEBFA'}" stroke="${ink}" stroke-width="6"/>`;
  if (old) h += `<path d="M450 70 L450 10 M390 10 L510 10" stroke="${ink}" stroke-width="8"/><circle cx="120" cy="450" r="34" fill="#7A5A3A" stroke="${ink}" stroke-width="6"/><circle cx="780" cy="450" r="34" fill="#7A5A3A" stroke="${ink}" stroke-width="6"/>`;
  else h += `<path d="M40 280 L860 280" stroke="#3E6FB0" stroke-width="16"/>`;
  for (let i = 0; i < 5; i++) { const x = 150 + i * 150, y = 300;
    h += `<circle cx="${x}" cy="${y - 70}" r="34" fill="${body}" stroke="${ink}" stroke-width="6"/>` + (old ? `<path d="M${x - 46} ${y - 92} L${x + 46} ${y - 92} M${x - 30} ${y - 92} L${x - 26} ${y - 124} L${x + 26} ${y - 124} L${x + 30} ${y - 92}" fill="#5A4030" stroke="${ink}" stroke-width="6"/>` : '') +
      `<path d="M${x} ${y - 36} L${x} ${y + 60} M${x - 30} ${y} L${x + 30} ${y} M${x} ${y + 60} L${x - 24} ${y + 120} M${x} ${y + 60} L${x + 24} ${y + 120}" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>` +
      `<path d="M${x + 30} ${y} L${x + 52} ${y + 30}" stroke="${ink}" stroke-width="7"/><rect x="${x + 40}" y="${y + 28}" width="34" height="26" rx="4" fill="${old ? '#7A5A3A' : '#5C6B7E'}" stroke="${ink}" stroke-width="4"/>`; }
  return h;
}
function cbookScene(t, lt, a) {
  const D = a._dur, t42 = cmW(a, ['1942', '천구백', '사십이'], 2.4), tC = cmW(a, ['카뮈', '카미', '알베르'], 3.6);
  const cam = qLerpCam(lt / D, [960, 540, 1.0], [1000, 520, 1.08]), old = easeInOut(cmK(lt, t42 - 0.3, t42 + 0.5));
  let g = `<rect x="-300" y="-200" width="2600" height="1500" fill="#3A2A1C"/><rect x="-60" y="-40" width="2040" height="1260" rx="8" fill="#EFE3C8"/><rect x="900" y="-40" width="120" height="1260" fill="#D9C9A6" opacity=".55"/>` +
    Array.from({ length: 16 }, (_, i) => `<rect x="${i % 2 ? 1080 : 60}" y="${60 + Math.floor(i / 2) * 26 + (i % 2) * 0}" width="${i % 2 ? 760 : 0}" height="10" rx="5" fill="#CDBF9F"/>`).join('') +
    Array.from({ length: 10 }, (_, i) => `<rect x="1080" y="${700 + i * 34}" width="${700 - (i % 3) * 120}" height="11" rx="5" fill="#CDBF9F"/>`).join('');
  // 그림 틀: 오늘의 지하철 → 1940년대 전차가 겹친다
  g += `<g transform="translate(110 150)"><rect x="-16" y="-16" width="932" height="552" fill="#fff" stroke="#8A7050" stroke-width="6"/>${cmCommuters(false)}<g opacity="${f1(old * 100) / 100}">${cmCommuters(true)}</g>` +
    `<g opacity="${f1(old * 100) / 100}">${fT(450, 500, '1942', 46, '#6A4E30')}</g></g>`;
  // 카뮈: 뒷모습 실루엣(트렌치코트)
  const ck = easeOut(cmK(lt, tC - 0.5, tC + 0.2)), cx = lerp(1880, 1560, ck);
  g += `<g transform="translate(${f1(cx)} 1150)" opacity="${f1(ck * 100) / 100}"><path d="M-150 0 L-120 -420 Q-110 -470 -60 -480 L60 -480 Q110 -470 120 -420 L150 0 Z" fill="#3B3A3F"/><path d="M-130 -250 L130 -250" stroke="#2A292E" stroke-width="18"/>` +
    `<path d="M-70 -480 L-30 -540 L30 -540 L70 -480 Z" fill="#2E2D33"/><circle cx="0" cy="-600" r="78" fill="#2E2D33"/><path d="M-70 -640 Q0 -700 70 -640" fill="none" stroke="#1F1E22" stroke-width="22"/></g>`;
  const nk = ACT.symK(lt, tC, 99);
  if (nk > 0.01) g += `<g transform="translate(560 820) scale(${f1(nk * 100) / 100})">${label(0, 0, '알베르 카뮈 (1913~1960)', { size: 46, bg: '#fff' })}<g transform="translate(0 84)">${label(0, 0, '『시지프 신화』 (1942)', { size: 40, bg: CM_Y })}</g></g>`;
  return qDefs() + qCam(cam, g) + `<rect x="-300" y="-200" width="2600" height="1500" fill="#A86A2A" opacity=".06"/>`;
}

/* =========== 8. 신화(항아리 그림체): 바위를 밀어 올리는 제로-시지프 =========== */
const CMY = { A: [-200, 1110], P: [1250, 540], B: [2150, 1040], R: 118 };
const cmMtY = x => x <= CMY.P[0] ? lerp(CMY.A[1], CMY.P[1], (x - CMY.A[0]) / (CMY.P[0] - CMY.A[0])) : lerp(CMY.P[1], CMY.B[1], (x - CMY.P[0]) / (CMY.B[0] - CMY.P[0]));
const cmRockY = (x, r) => {   // 바위가 비탈·꼭대기 모서리에 얹히는 높이(중심)
  const th1 = Math.atan2(CMY.A[1] - CMY.P[1], CMY.P[0] - CMY.A[0]), th2 = Math.atan2(CMY.B[1] - CMY.P[1], CMY.B[0] - CMY.P[0]); let y = Infinity;
  if (x + r * Math.sin(th1) <= CMY.P[0]) y = Math.min(y, lerp(CMY.A[1], CMY.P[1], (x - CMY.A[0]) / (CMY.P[0] - CMY.A[0])) - r / Math.cos(th1));
  if (x - r * Math.sin(th2) >= CMY.P[0]) y = Math.min(y, lerp(CMY.P[1], CMY.B[1], (x - CMY.P[0]) / (CMY.B[0] - CMY.P[0])) - r / Math.cos(th2));
  const dx = x - CMY.P[0]; if (Math.abs(dx) < r) y = Math.min(y, CMY.P[1] - Math.sqrt(r * r - dx * dx));
  return y; };
// 발 위치(걷기 위상): A2.walk와 같은 식, b = 지나온 거리(세계), Ls = 보폭
const cmFeet = (b, Ls, lift) => [0, 1].map(off => { const B = b + Ls / 2, c = (B / Ls + off) / 2, f = c - Math.floor(c);
  if (f < 0.5) return [Ls / 2 - 2 * f * Ls, 0]; const g2 = (f - 0.5) * 2; return [-Ls / 2 + g2 * Ls, Math.sin(g2 * Math.PI) * lift]; });
function cmMeander(y, h) {   // 그리스 무늬 띠
  let p = `<rect x="-300" y="${y}" width="2600" height="${h}" fill="#1E1A18"/>`;
  for (let x = -280; x < 2300; x += 90) p += `<path d="M${x} ${y + h - 16} L${x} ${y + 16} L${x + 60} ${y + 16} L${x + 60} ${y + h - 40} L${x + 26} ${y + h - 40} L${x + 26} ${y + 40}" fill="none" stroke="${CM_TERRA}" stroke-width="9"/>`;
  return p;
}
function cmVase(inner) {
  return `<rect x="-300" y="-200" width="2600" height="1500" fill="${CM_TERRA}"/><radialGradient id="cmvig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#3A1A08" stop-opacity=".45"/></radialGradient>` +
    inner + cmMeander(-60, 130) + cmMeander(1130, 130) + `<rect x="-300" y="-200" width="2600" height="1500" fill="url(#cmvig)"/>`;
}
function cmMountain() {
  let h = `<path d="M${CMY.A[0] - 200} ${CMY.A[1]} L${CMY.A[0]} ${CMY.A[1]} L${CMY.P[0]} ${CMY.P[1]} L${CMY.B[0]} ${CMY.B[1]} L2400 ${CMY.B[1]} L2400 1400 L-400 1400 Z" fill="#1E1A18"/>`;
  for (let i = 0; i < 9; i++) { const x = 100 + i * 210; h += `<path d="M${x} ${f1(cmMtY(x) + 60)} q40 -20 80 0" fill="none" stroke="${CM_TERRA}" stroke-width="6" opacity=".7"/>`; }
  return h;
}
// 밀기 자세의 제로(경사 위). bx = 몸 x, b = 걸은 거리, rockC = 바위 중심, o: { push(0~1), toga, why }
function cmPusher(t, key, bx, b, rockC, o = {}) {
  const s = o.s || 0.86, rot = o.rot == null ? 16 : o.rot, by = cmMtY(bx), ft = cmFeet(b, 64, 22);
  const fw = ft.map(([rel, up]) => { const x = bx + rel * s; return [x, cmMtY(x) - up * s]; });
  const fl = fw.map(p => cmLoc(bx, by, s, rot, p[0], p[1]));
  const push = o.push == null ? 1 : o.push;
  const hT1 = cmLoc(bx, by, s, rot, rockC[0] - CMY.R * 0.98, rockC[1] - 26), hT2 = cmLoc(bx, by, s, rot, rockC[0] - CMY.R * 0.92, rockC[1] + 30);
  const hLr = [lerp(160, hT1[0], push), lerp(420, hT1[1], push)], hRr = [lerp(240, hT2[0], push), lerp(420, hT2[1], push)];
  const pose = A2.pose({ hL: hLr, hR: hRr, fL: [fl[0][0], fl[0][1] + 12, 0], fR: [fl[1][0], fl[1][1] + 12, 0], reach: { L: 1.15, R: 1.15 } });
  const face = cmFace(t, Object.assign({ eyes: { open: 1 - ACT.natBlink(t, 9), squint: 0.35 }, brow: { angry: 0.4, worry: 0.3 }, mouth: { v: ACT.VIS.EU, o: 0.5, c: -1 }, blush: 0.4, hfx: tt => ACT.sym('sweat', 296, 92, t, 0, 99) }, o.face || {}));
  const zero = cmZ(key, face, { t, x: bx, y: by, s, pose, look: o.look || [0.8, -0.1], rot, vest: '#F4F1EA', toga: '#F4F1EA', vshade: 'rgba(0,0,0,0.12)' });
  // 사원증 목걸이
  const n1 = cmPt(bx, by, s, rot, 172, 292), n2 = cmPt(bx, by, s, rot, 228, 292), cd = cmPt(bx, by, s, rot, 200, 352);
  const card = `<path d="M${f1(n1[0])} ${f1(n1[1])} L${f1(cd[0])} ${f1(cd[1] - 14 * s)} L${f1(n2[0])} ${f1(n2[1])}" fill="none" stroke="#3E6FB0" stroke-width="${f1(6 * s)}"/><rect x="${f1(cd[0] - 20 * s)}" y="${f1(cd[1] - 14 * s)}" width="${f1(40 * s)}" height="${f1(52 * s)}" rx="${f1(5 * s)}" fill="#fff" stroke="${INK}" stroke-width="${f1(4 * s)}" transform="rotate(${f1(rot)} ${f1(cd[0])} ${f1(cd[1])})"/>`;
  const head = cmPt(bx, by, s, rot, 214, 54);
  return { svg: zero + card, head, by, pose, s, rot };
}
function cmythScene(t, lt, a) {
  const D = a._dur, tRoll = cmW(a, ['굴러'], D * 0.62), tEver = cmW(a, ['영원히'], D * 0.82);
  // 바위: 시작 x0 → 꼭대기(tRoll-0.2) → 반대편으로 굴러 내려감
  const x0 = 520, xTop = CMY.P[0] + 6, pk = easeInOut(cmK(lt, 0.2, tRoll - 0.15));
  let rx = lerp(x0, xTop, pk);
  const rolling = lt > tRoll - 0.15;
  if (rolling) { const u = lt - (tRoll - 0.15); rx = xTop + 60 * u + 380 * u * u; }
  rx = Math.min(rx, 2300);
  const ry = cmRockY(rx, CMY.R) + (rolling ? -Math.abs(Math.sin((rx - xTop) / 60)) * 14 : 0), rrot = (rx - x0) / CMY.R * 180 / Math.PI;
  // 제로: 바위 뒤에서 민다 → 꼭대기 앞에서 손을 놓고 굴러가는 바위를 내려다본다
  const bx = rolling ? lerp(xTop - 200, xTop - 120, easeOut(cmK(lt, tRoll - 0.15, tRoll + 0.4))) : rx - 205, walked = rolling ? (xTop - 205 - x0 + 205) + (bx - (xTop - 200)) : rx - x0;
  const push = rolling ? 1 - easeOut(cmK(lt, tRoll - 0.15, tRoll + 0.3)) : 1;
  const sag = ACT.sigh(lt, tEver - 0.2, 0.4, 1.0);
  const Zp = cmPusher(t, '_cmy', bx, walked, [rx, ry], { push, rot: lerp(16, 3, 1 - push), look: rolling ? [0.85, 0.6] : [0.8, -0.1],
    face: rolling ? { eyes: { open: 1 - ACT.blinks(lt, [tEver + 0.4], 0.2), size: lt < tEver ? 1.15 : 1, flat: lt > tEver ? 0.4 : 0 }, brow: { worry: 0.8 }, mouth: { v: ACT.VIS.O, o: lt < tEver ? 0.35 : 0.1, c: -1.5 } } : {} });
  const wseat = Zp.head, why = cmWhy(wseat[0], wseat[1], 0.62, { t, toga: true, eyes: rolling ? 'wide' : 'shut', brow: rolling ? 'worry' : 'angry', mouth: rolling ? 'O' : 'frown', legs: 'sit', rot: Zp.rot, look: rolling ? [0.9, 0.5] : [0.6, 0], hL: [-40, -60], hR: rolling ? [50, -110] : [44, -64] });
  // '영원히': 바위가 다시 처음으로 돌아오는 고리 화살표
  const ek = easeInOut(cmK(lt, tEver - 0.1, tEver + 0.9)), loopP = `M1860 960 C1600 1030 700 1030 360 925`;
  const loop = ek > 0 ? `<path d="${loopP}" fill="none" stroke="#F4E3C8" stroke-width="12" stroke-dasharray="${f1(2600 * ek)} 2600" stroke-linecap="round" opacity=".9"/>` +
    (ek > 0.95 ? `<path d="M330 905 l58 4 l-30 40 Z" fill="#F4E3C8"/>` : '') : '';
  const fx = clamp(Math.min(rx, CMY.P[0] + 120) - 60, 560, 1350), near = [fx, cmMtY(Math.min(fx, CMY.P[0])) - 170, 1.3], wide = [1000, 600, 1.0];
  const cam = qLerpCam(cmK(lt, tEver - 0.6, tEver + 0.6), near, wide);
  const inner = cmMountain() + loop + Zp.svg + why + cmRock(rx, ry, CMY.R, rrot, { fill: '#5A5552' });
  return qDefs() + qCam(cam, cmVase(inner));
}

/* =========== 9. 지하철역 계단: 금요일 밤 굴러떨어지고, 월요일 아침 다시 =========== */
const CST = { x0: 650, y0: 1000, x1: 1590, y1: 470, FL: 1000 };
const cmClampCam = c => { const z = c[2]; return [clamp(c[0], 1091 / z - 150, 2070 - 1091 / z), clamp(c[1], 573.6 / z - 30, 1220 - 653.6 / z), z]; };
const cmStY = x => x <= CST.x0 ? CST.FL : x >= CST.x1 ? CST.y1 : lerp(CST.y0, CST.y1, (x - CST.x0) / (CST.x1 - CST.x0));
const cmStRock = (x, r) => { if (x <= CST.x0 - r * 0.3) return CST.FL - r; if (x >= CST.x1) return CST.y1 - r; const th = Math.atan2(CST.y0 - CST.y1, CST.x1 - CST.x0); return Math.min(CST.FL - r, cmStY(x) - r / Math.cos(th)); };
function cmCalendar(day, k) {   // 왼쪽 위 달력(day: '금요일'|'월요일'), k: 넘김(0~1)
  const icon = day === '금요일' ? `<path d="M70 -6 A26 26 0 1 0 96 22 A20 20 0 1 1 70 -6 Z" fill="#F2D06B" stroke="${INK}" stroke-width="4"/>` : `<circle cx="82" cy="8" r="20" fill="#FFC94A" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${f1(82 + Math.cos(i * 0.785) * 28)} ${f1(8 + Math.sin(i * 0.785) * 28)} L${f1(82 + Math.cos(i * 0.785) * 38)} ${f1(8 + Math.sin(i * 0.785) * 38)}" stroke="#E0A020" stroke-width="5" stroke-linecap="round"/>`).join('');
  return `<g transform="translate(150 150) rotate(-4)"><rect x="-120" y="-90" width="250" height="210" rx="16" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-120" y="-90" width="250" height="56" rx="16" fill="${day === '금요일' ? '#3E4A7A' : CM_RED}" stroke="${INK}" stroke-width="7"/>` +
    fT(5, -50, day, 34, '#fff') + `<g transform="translate(-10 34)">${icon}</g>` + fT(-38, 80, day === '금요일' ? '밤' : '아침', 46, INK, { anchor: 'middle' }) +
    (k > 0 && k < 1 ? `<path d="M-120 -34 L130 -34 L130 ${f1(-34 + 150 * (1 - k))} Q0 ${f1(-34 + 190 * (1 - k))} -120 ${f1(-34 + 150 * (1 - k))} Z" fill="#F4F1EA" stroke="${INK}" stroke-width="5" opacity="${f1((1 - k) * 100) / 100}"/>` : '') + `</g>`;
}
function cmStairPusher(t, key, bx, b, rockC, o = {}) {   // 계단 위에서 미는 제로(평상복)
  const s = o.s || 0.78, rot = o.rot == null ? 14 : o.rot, by = cmStY(bx), ft = cmFeet(b, 64, 20);
  const fw = ft.map(([rel, up]) => { const x = bx + rel * s; return [x, cmStY(x) - up * s]; });
  const fl = fw.map(p => cmLoc(bx, by, s, rot, p[0], p[1]));
  const push = o.push == null ? 1 : o.push, R = o.R || 100;
  const hT1 = cmLoc(bx, by, s, rot, rockC[0] - R * 0.98, rockC[1] - 22), hT2 = cmLoc(bx, by, s, rot, rockC[0] - R * 0.92, rockC[1] + 26);
  const pose = o.pose || A2.pose({ hL: [lerp(160, hT1[0], push), lerp(420, hT1[1], push)], hR: [lerp(240, hT2[0], push), lerp(420, hT2[1], push)], fL: [fl[0][0], fl[0][1] + 12, 0], fR: [fl[1][0], fl[1][1] + 12, 0], reach: { L: 1.15, R: 1.15 } });
  const zero = cmZ(key, cmFace(t, o.face || {}), { t, x: bx, y: by + (o.dy || 0), s, pose, look: o.look || [0.8, -0.2], rot, sy: o.sy || 1 });
  return { svg: zero, head: cmPt(bx, by + (o.dy || 0), s, rot, 214, 54, o.sy || 1), by };
}
function cstairsScene(t, lt, a) {
  const ph = a.ph, run = a._run, R = 100;
  let cam = [1330, 600, 1.25];
  let w = '', tint = '', cal = '', front = '';
  if (ph === 0) {   // L13
    const D = a._dur, tWork = cmW(a, ['오늘의'], 1.7), tLife = cmW(a, ['날마다'], 4.2), tSame = cmW(a, ['같은'], 4.4);
    const fade = 1 - easeInOut(cmK(lt, 0.05, 0.6));
    if (lt < tLife - 0.1) {   // 금요일 밤: 꼭대기 근처까지 밀다가 → 굴러떨어짐, 제로는 펄쩍 뛰어 피한다
      const xS = 1260, xT = CST.x1 + 20, pk = easeInOut(cmK(lt, 0, tWork - 0.25));
      let rx = lerp(xS, xT, pk); const rolling = lt > tWork - 0.25;
      if (rolling) { const u = lt - (tWork - 0.25); rx = xT - (120 * u + 900 * u * u); }
      rx = Math.max(rx, 420);
      const bounce = rolling && rx > CST.x0 ? Math.abs(Math.sin((xT - rx) / 52 * Math.PI)) * 22 : 0;
      const ry = cmStRock(rx, R) - bounce, rr = (rx - xS) / R * 180 / Math.PI;
      const zxP = rolling ? xT - 200 : rx - 200;
      const jumpK = rolling ? ACT.pulse(lt, tWork - 0.05 + (xT - 200 - 1) / 2000, 0.5) : 0;   // 바위가 지나갈 때 펄쩍
      const passT = (() => { const tgt = zxP; const u = Math.sqrt(Math.max(0, (xT - tgt) / 900)); return tWork - 0.25 + u; })();
      const jk = rolling ? ACT.pulse(lt, passT - 0.22, 0.48) : 0;
      const Zp = cmStairPusher(t, '_cst0', zxP, (rolling ? xT - 200 - xS + 200 : rx - xS) + 200, [rx, ry], { R, push: rolling ? 1 - easeOut(cmK(lt, tWork - 0.25, tWork)) : 1, rot: rolling ? 0 : 14, dy: -150 * jk,
        pose: rolling ? A2.pose({ hL: [120, 200], hR: [280, 200], fL: [168, 534, 0], fR: [232, 534, 0] }) : null,
        face: rolling ? { eyes: { open: 1, size: 1.25 }, brow: { raise: 12 }, mouth: { v: ACT.VIS.O, o: 0.7, c: -1 } } : { eyes: { open: 1, squint: 0.35 }, brow: { angry: 0.4, worry: 0.3 }, mouth: { v: ACT.VIS.EU, o: 0.5, c: -1 }, hfx: tt => ACT.sym('sweat', 296, 92, t, 0, 99) },
        look: rolling ? [-0.6, 0.7] : [0.8, -0.2] });
      const why = cmWhy(Zp.head[0], Zp.head[1], 0.56, { t, eyes: rolling ? 'wide' : 'shut', mouth: rolling ? 'O' : 'frown', legs: 'sit', rot: rolling ? 0 : 14, look: [-0.5, 0.6] });
      w = qShadow(Zp.svg ? zxP : 0, cmStY(zxP), 50, 1 - 0.6 * jk) + Zp.svg + why + qShadow(rx, cmStY(rx), 70, 0.7) + cmRock(rx, ry, R, rr);
      cam = rolling ? qLerpCam(cmK(lt, tWork - 0.2, tWork + 1.1), [1190, 600, 1.25], [900, 660, 1.2]) : [1190, 600, 1.25];
      tint = cmNight(1.4, '#0D1440');
      cal = cmCalendar('금요일', 0);
    } else {   // 월요일 아침: 계단 아래에서 바위가 다시 기다린다
      const fk = cmK(lt, tLife - 0.1, tLife + 0.35), rx = 470, ry = CST.FL - R, zxM = 300, hands = easeInOut(cmK(lt, tSame - 0.3, tSame + 0.3));
      const sg = ACT.sigh(lt, tSame - 0.6, 0.4, 0.9);
      const Zp = cmStairPusher(t, '_cst1', zxM, 0, [rx, ry], { R, push: hands, rot: lerp(0, 8, hands),
        face: { eyes: { open: 1 - ACT.blinks(lt, [tLife + 0.9], 0.2), flat: 0.45 }, brow: { worry: 0.55 }, mouth: { v: ACT.VIS.M, o: 0, c: -1 } }, look: [0.7, 0.1], sy: 1 - 0.03 * sg });
      const why = cmWhy(Zp.head[0], Zp.head[1], 0.56, { t, eyes: 'half', mouth: 'frown', legs: 'sit', rot: lerp(0, 8, hands), look: [0.6, 0.2] });
      w = qShadow(zxM, CST.FL, 50) + Zp.svg + why + qShadow(rx, CST.FL, 70, 0.7) + cmRock(rx, ry, R, -20);
      cam = [680, 720, 1.32];
      tint = fFull('#FFE7B8', 0.08);
      cal = cmCalendar('월요일', 0) + (fk < 1 ? `<rect x="-300" y="-200" width="2600" height="1500" fill="#fff" opacity="${f1((1 - fk) * 0.5 * 100) / 100}"/>` : '');
    }
    if (fade > 0) front = `<g opacity="${f1(fade * 100) / 100}">${qCam(cam, cmVase(cmMountain()))}</g>`;
  } else {   // L14(ph1): 왜요 "봐!" / s3(ph2): 제로가 계단에 털썩 앉아 올려다본다
    const rx = 470, ry = CST.FL - R;
    const tSee = ph === 1 ? cmW(a, ['봐'], 0.15) : -9;
    const sitK = ph === 2 ? A2.actK(lt, 0.15, 0.35, { antic: 0.12, anticAmt: 0.1, over: 0.08 }) : 0, sk = clamp(sitK, 0, 1.1);
    const SX = 700, wk = ph === 1 ? A2.walk(lt, { x0: 300, x1: SX, t0: 0.5, t1: a._dur - 0.05, s: 0.78, step: 70, lean: 4 }) : null;
    const zxS = ph === 1 ? wk.x : SX;
    const standP = A2.pose({ hL: [168, 420], hR: [232, 420] }), sitP = A2.pose({ hL: [150, 470], hR: [252, 470], fL: [140, 534], fR: [262, 534], dy: 92 });
    const pose = ph === 2 ? A2.blend(standP, sitP, clamp(sk, 0, 1)) : (wk.moving ? wk.pose : A2.pose({ hL: [160, 420], hR: [240, 420] }));
    const face = ph === 2 ? { eyes: { open: 1 - ACT.blinks(lt, [0.9], 0.2), flat: 0.35 }, brow: { worry: 0.6 }, mouth: { v: ACT.VIS.M, o: 0, c: -1.2 } } : { eyes: { open: 1 - ACT.blinks(lt, [1.2], 0.15) }, brow: { raise: 6, worry: 0.4 }, mouth: { v: ACT.VIS.M, o: 0, c: -0.5 } };
    const look = ph === 2 ? (lt > 0.6 ? [0.75, -0.75] : [0.3, 0.3]) : [0.05, -0.9];
    const by = CST.FL, zero = cmZ('_cst' + ph, cmFace(t, face), { t, x: zxS, y: by, s: 0.78, pose, look, rot: wk ? wk.rot : 0, sy: 1 - 0.06 * ACT.pulse(lt, 0.45, 0.3) * (ph === 2 ? 1 : 0) });
    const head = cmPt(zxS, by, 0.78, wk ? wk.rot : 0, 214, 54 + (pose.dy || 0));
    const st = ph === 1 ? clamp(ACT.pop(lt, tSee - 0.05, 3, 0.4), 0, 1.1) * (1 - cmK(lt, tSee + 0.9, tSee + 1.3)) : 0;
    const why = cmWhy(head[0], head[1], 0.56, { t, eyes: ph === 1 ? 'wide' : 'half', brow: ph === 1 ? 'angry' : 'worry', mouth: ph === 1 ? 'O' : 'frown', talk: cmWhyTalk(t), legs: 'sit', straight: st, look: ph === 1 ? [0.8, -0.2] : [0.7, -0.6],
      hL: ph === 1 ? [-60, -130 + 16 * Math.sin(lt * 15)] : [-40, -60], hR: ph === 1 ? [62, -128 + 16 * Math.sin(lt * 13 + 1)] : [40, -60] });
    w = qShadow(rx, CST.FL, 70, 0.7) + cmRock(rx, ry, R, -20) + qShadow(zxS, by, 50) + zero + why + (ph === 2 ? cmSym(zxS + 120, by - 330, '털썩', ACT.symK(lt, 0.42, 1.1), '#fff', 46) : '');
    cam = [lerp(680, 760, clamp((zxS - 300) / 400, 0, 1)), 720, 1.32];
    tint = fFull('#FFE7B8', 0.08); cal = cmCalendar('월요일', 0);
  }
  cam = cmClampCam(cam);
  return qDefs() + qPlate('stairs', cam, 1.0) + qCam(cam, w) + tint + front + qCam([960, 560, 1], cal);
}
