/* 시뮬레이션 편 — 2막(d1~o2). sscenes.js의 sm 도구를 그대로 쓴다.
   분식집(탁자 면만 배경을 한 번 더 그려 두 사람이 탁자 뒤에 앉은 것처럼) → 색이 빠지는 방 → 게임 속 마을 → 타자 → 차머스·반론 → 아침 → 마지막에 이 세상이 우주에 뜬 수많은 화면 중 하나로. */
Object.assign(QBG, { bunsik: 'ai/bunsik.png', room: 'ai/room.png', village: 'ai/village.png' });
['sdinner', 'sgray', 'sgame', 'sgame2', 'stype', 'schalmers', 'smorning', 'ssky'].forEach(k => CAMS[k] = 'fixed');

/* ---------- shared (part 2) ---------- */
const smAtAll = (a, keys, fbs) => { const r = (a._words || []).filter(x => keys.some(k => x.w.replace(/\s/g, '').includes(k))).map(x => x.t + 0.12); return r.length ? r : fbs; };
const smFx = (id, sat, blur = 0) => `<defs><filter id="${id}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="${f1(clamp(sat, 0, 1.5) * 100) / 100}"/>${blur ? `<feGaussianBlur stdDeviation="${blur}"/>` : ''}</filter></defs>`;
const smFriend = (t, o) => HALO(char(Object.assign({ goggles: 'none', vest: '#8CCB9B', patch: false, tee: true, vshade: 'rgba(0,80,40,0.18)', longHair: '#3A2A22', hair: '#3A2A22', seed: 71, t }, o)));
P['sm앉기'] = smPose('서기', { legL: [[180, 412], [128, 436], [146, 500]], fL: [136, 512, 8], legR: [[220, 412], [272, 436], [254, 500]], fR: [264, 512, -8] });   // knees apart: reads as sitting
P['sm랩톱'] = smPose('sm앉기', { armL: [[148, 285], [140, 346], [176, 392]], hL: [180, 394], armR: [[252, 285], [260, 346], [224, 392]], hR: [220, 394] });
P['sm턱'] = smPose('sm앉기', { armR: [[252, 290], [292, 340], [244, 300]], hR: [236, 292], armL: [[148, 285], [146, 346], [184, 380]], hL: [188, 382] });
P['sm아래가리킴'] = smPose('서기', { armR: [[252, 285], [314, 330], [356, 376]], hR: [362, 382] });
P['sm물주기'] = smPose('서기', { armR: [[252, 285], [306, 300], [352, 300]], hR: [360, 298] });
P['sm폰'] = smPose('서기', { armR: [[252, 285], [270, 340], [236, 318]], hR: [230, 312] });
const SMBX = 640, SMBF = 1290, SMBY = 1030, SMBEDGE = 863;   // bunsik: Zero x, friend x, seated anchor, table edge (plate coords)
// the plate again, only the table surface (y > edge) — drawn over the seated characters
const smPlateFront = (k, cam, depth, yCut, o = {}) => {
  const [cx, cy, z] = cam, zb = 1 + (z - 1) * depth, bx = 960 + (cx - 960) * depth, by = 560 + (cy - 560) * depth, id = 'smpf' + (smClipN++);
  return `<g transform="translate(960 560) scale(${f1(zb * 1000) / 1000}) translate(${f1(-bx)} ${f1(-by)})"><defs><clipPath id="${id}"><rect x="-400" y="${yCut}" width="2900" height="900"/></clipPath></defs><image href="${QBG[k]}" x="-270" y="-98" width="2460" height="1384" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"${o.filter ? ` filter="url(#${o.filter})"` : ''}/></g>`;
};
// tteokbokki pan (top view-ish), steam
const smPan = (x, y, s, t, o = {}) => {
  const w = !!o.wire, F = (c) => w ? `fill="none" stroke="${SM_LINE}" stroke-width="5"` : `fill="${c}" stroke="${INK}" stroke-width="5"`;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  if (w) h += `<ellipse cx="0" cy="0" rx="200" ry="70" fill="${SM_SLATE}" opacity=".9"/>`;
  h += `<ellipse cx="0" cy="6" rx="196" ry="70" ${F('#3A3A42')}/><ellipse cx="0" cy="0" rx="172" ry="56" ${F('#D8402E')}/>`;
  [[-110, -6, 10], [-60, 14, -20], [-10, -18, 30], [40, 10, -10], [90, -10, 15], [130, 12, 40], [-140, 18, 0], [10, 26, 60]].forEach(([cx, cy, r]) => { h += `<rect x="${cx - 26}" y="${cy - 9}" width="52" height="18" rx="9" transform="rotate(${r} ${cx} ${cy})" ${F('#FFF6EA')}/>`; });
  [[-40, -30], [70, -30], [-90, 30]].forEach(([cx, cy]) => { h += `<path d="M${cx - 20} ${cy + 10} L${cx} ${cy - 14} L${cx + 22} ${cy + 10} Z" ${F('#E8C27A')}/>`; });
  if (!w) [[-20, 4], [60, 20], [-120, -10], [110, -20]].forEach(([cx, cy]) => { h += `<rect x="${cx}" y="${cy}" width="14" height="6" rx="3" fill="#5DBB63"/>`; });
  h += `</g>`;
  if (!w && !o.noSteam) for (let i = 0; i < 4; i++) { const k = (t * 0.55 + i / 4) % 1, sx = x + (i - 1.5) * 70 * s + Math.sin(t * 2 + i) * 14; h += `<path d="M${f1(sx)} ${f1(y - 40 * s - k * 170 * s)} q${f1(18 * s)} ${f1(-26 * s)} 0 ${f1(-52 * s)} q${f1(-18 * s)} ${f1(-26 * s)} 0 ${f1(-52 * s)}" stroke="#fff" stroke-width="${f1(7 * s)}" fill="none" stroke-linecap="round" opacity="${f1(Math.sin(k * Math.PI) * 0.7 * 100) / 100}"/>`; }
  return h;
};
const smSkewer = (x, y, s, rot) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><path d="M0 0 L0 -110" stroke="#C99A5A" stroke-width="6" stroke-linecap="round"/><rect x="-26" y="-118" width="52" height="20" rx="10" fill="#FFF6EA" stroke="${INK}" stroke-width="4"/><rect x="-22" y="-118" width="44" height="8" rx="4" fill="#D8402E" opacity=".75"/></g>`;
// room helpers (plate coords): night window, plant on the sill
const smWinNight = (k, t) => {
  if (k <= 0) return '';
  let h = `<g opacity="${f1(k * 100) / 100}"><rect x="588" y="120" width="352" height="525" fill="#0F1736"/><rect x="956" y="120" width="363" height="525" fill="#0F1736"/>`;
  for (let i = 0; i < 18; i++) { const x = 600 + hash(i * 3.7) * 700, y = 140 + hash(i * 5.1) * 260; if (Math.abs(x - 948) < 14) continue; h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.5 + hash(i) * 2)}" fill="#fff" opacity="${f1((0.5 + 0.5 * Math.sin(t * 2 + i)) * 100) / 100}"/>`; }
  [[600, 470, 120, 175], [740, 520, 90, 125], [1000, 450, 110, 195], [1150, 500, 160, 145]].forEach(([x, y, w, hh], j) => { if (x < 940 && x + w > 940) w = 940 - x; h += `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="#1C2448"/>`; for (let i = 0; i < 6; i++) h += `<rect x="${x + 12 + (i % 3) * 30}" y="${y + 16 + Math.floor(i / 3) * 36}" width="12" height="16" fill="#FFD27A" opacity="${hash(j * 7 + i) > 0.4 ? 0.8 : 0}"/>`; });
  return h + `</g>`;
};
const smPlant = (x, y, s, o = {}) => {   // pot on the sill; droop 0..1, green 0..1
  const d = o.droop || 0, g = o.green == null ? 1 : o.green;
  const leaf = `rgb(${f1(lerp(150, 93, g))},${f1(lerp(156, 187, g))},${f1(lerp(166, 99, g))})`;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  [[-40, -60], [-16, -40], [0, -10], [18, 30], [40, 60]].forEach(([a0, a1], i) => {
    const ang = lerp(a0 * 0.7, a1 * 0.9 + (a1 > 0 ? 40 : -40), d) * Math.PI / 180, len = 110 - Math.abs(i - 2) * 14;
    const ex = Math.sin(ang) * len, ey = -Math.cos(ang) * len * (1 - 0.35 * d), cx = ex * 0.4, cy = -len * 0.7;
    h += `<path d="M0 -60 Q${f1(cx)} ${f1(cy - 60)} ${f1(ex)} ${f1(ey - 60)}" stroke="${INK}" stroke-width="7" fill="none"/><path d="M0 -60 Q${f1(cx)} ${f1(cy - 60)} ${f1(ex)} ${f1(ey - 60)}" stroke="${leaf}" stroke-width="3" fill="none"/>` +
      `<ellipse cx="${f1(ex)}" cy="${f1(ey - 60)}" rx="26" ry="14" transform="rotate(${f1(ang * 180 / Math.PI - 90)} ${f1(ex)} ${f1(ey - 60)})" fill="${leaf}" stroke="${INK}" stroke-width="5"/>`;
  });
  h += `<path d="M-48 -64 L48 -64 L38 0 L-38 0 Z" fill="${g > 0.5 ? '#D9824A' : '#A89C94'}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="-54" y="-76" width="108" height="18" rx="6" fill="${g > 0.5 ? '#E5945C' : '#B4AAA2'}" stroke="${INK}" stroke-width="5"/>`;
  return h + `</g>`;
};
const SMPLX = 1250, SMPLY = 690;   // the plant on the windowsill (room plate coords)
const smLapBack = (x, y, s, lit) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-110 0 L110 0 L96 -150 L-96 -150 Z" fill="#5A6070" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><circle cx="0" cy="-78" r="14" fill="#7A8090"/>${lit ? `<path d="M-96 -150 L96 -150" stroke="#BFE8FF" stroke-width="5" opacity=".8"/>` : ''}<rect x="-124" y="0" width="248" height="16" rx="6" fill="#8A90A0" stroke="${INK}" stroke-width="6"/></g>`;
const smPhone = (x, y, s, o = {}) => {
  const lit = o.lit || 0, rot = o.rot || 0;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><rect x="-70" y="-130" width="140" height="260" rx="22" fill="#20232A" stroke="${INK}" stroke-width="7"/><rect x="-58" y="-114" width="116" height="228" rx="12" fill="${lit ? '#2E4A6E' : '#0E1015'}"/>`;
  if (lit && o.msg) h += `<g opacity="${f1(lit * 100) / 100}"><rect x="-54" y="-70" width="108" height="64" rx="12" fill="#fff"/><text x="-44" y="-46" font-family="${FONT}" font-weight="900" font-size="15" fill="#8A93A6">${esc(o.from || '친구')}</text><text x="-44" y="-20" font-family="${FONT}" font-weight="900" font-size="${o.fs || 21}" fill="${INK}">${esc(o.msg)}</text></g>`;
  return h + `</g>`;
};
const smCan = (x, y, s, rot) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><path d="M-50 -40 L40 -40 L46 40 L-56 40 Z" fill="#5FA8D3" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M40 -10 L120 -60" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M40 -10 L120 -60" stroke="#5FA8D3" stroke-width="8" stroke-linecap="round"/><ellipse cx="124" cy="-62" rx="14" ry="10" fill="#4A90BD" stroke="${INK}" stroke-width="5"/><path d="M-50 -40 Q-80 -80 -50 -90 L-30 -40" fill="none" stroke="${INK}" stroke-width="8"/></g>`;
const smQ = (x, y, s, op) => op <= 0 ? '' : `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})" opacity="${f1(op * 100) / 100}"><ellipse cx="0" cy="0" rx="50" ry="44" fill="#C9CDD6" stroke="${INK}" stroke-width="5"/><text x="0" y="18" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="54" fill="#5A606C">?</text></g>`;
const smStampWord = (x, y, txt, k, c = '#E2574C') => { if (k <= 0) return ''; const s = 1 + 0.7 * Math.exp(-k * 9) ; return `<g transform="translate(${x} ${y}) rotate(-10) scale(${f1(s * 1000) / 1000})" opacity="${f1(Math.min(1, k * 4) * 0.95 * 100) / 100}"><rect x="-150" y="-62" width="300" height="124" rx="16" fill="none" stroke="${c}" stroke-width="12"/><text x="0" y="26" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="78" fill="${c}">${esc(txt)}</text></g>`; };
// nest a virtual 1920x1080 scene into a rect (centre x,y, width w)
const smNest = (x, y, w, inner, o = {}) => {
  const hh = w * 1080 / 1920, sc = w / 1920, id = 'smn' + (smClipN++);
  return `<g transform="translate(${f1(x - w / 2)} ${f1(y - hh / 2)}) scale(${f1(sc * 10000) / 10000})"><defs><clipPath id="${id}"><rect x="0" y="0" width="1920" height="1080"/></clipPath></defs><g clip-path="url(#${id})">${inner}</g></g>`;
};
const smScanlines = (op = 0.12) => { let h = `<g opacity="${op}">`; for (let y = -60; y < 1250; y += 8) h += `<rect x="-300" y="${y}" width="2600" height="3" fill="#000"/>`; return h + `</g>`; };

/* ---------- the tiny game world (virtual scene coords; sand from y≈889) ---------- */
const SMGY = 1040;
const smGameWorld = (t, cam, o = {}) => {
  const sat = o.sat == null ? 1 : o.sat;
  let h = smFx('smgsat', sat) + smPlate('village', cam, 1.0, { filter: 'smgsat' });
  if (o.wireX != null) h += smWire('village', cam, 1.0, o.wireX);
  let ch = '';
  const cols = ['#F2C14E', '#E2574C', '#C08AE0', '#F08FB0', '#8CCB9B', '#F2A65A'];
  for (let i = 0; i < 6; i++) {   // villagers strolling
    const sp = 0.12 + hash(i * 3.3) * 0.08, ph = t * sp + hash(i * 7.1), u = (ph % 1), dir = u < 0.5 ? 1 : -1, xx = 120 + (u < 0.5 ? u * 2 : (1 - u) * 2) * 1700 + i * 30;
    if (o.kidX != null && Math.abs(xx - o.kidX) < 160) continue;
    const pose = walkPose(t * 7 + i, 0.6), y = SMGY - 20 + (i % 3) * 22, s = 0.34;
    const c = char({ x: xx, y, s, pose, goggles: 'none', vest: cols[i], patch: false, tee: true, t, seed: 90 + i, ex: { expr: '기본', prev: '기본', k: 1, blink: 0 }, look: [dir * 0.8, 0] });
    ch += qShadow(xx, y, 26) + (dir < 0 ? flip(xx, c) : c);
  }
  if (o.kidX != null) ch += qShadow(o.kidX, SMGY + 30, 30) + (o.kid || '');
  h += qCam(cam, (o.under || '') + ch + (o.over || ''));
  if (o.glitch) h += smGlitch(t, o.glitch, 11);
  return h;
};
const smKid = (t, o) => HALO(char(Object.assign({ goggles: 'none', vest: '#7FB0E8', patch: false, tee: true, vshade: 'rgba(0,40,90,0.2)', seed: 81, t }, o)));
// a laptop screen seen from the front: bezel + nested game + optional chat box
const smLapScreen = (x, y, w, inner, o = {}) => {
  const hh = w * 1080 / 1920, b = w * 0.045;
  let h = `<rect x="${f1(x - w / 2 - b)}" y="${f1(y - hh / 2 - b)}" width="${f1(w + 2 * b)}" height="${f1(hh + 2 * b * 1.2)}" rx="${f1(b * 0.8)}" fill="#1E2128" stroke="${INK}" stroke-width="8"/>` + smNest(x, y, w, inner);
  h += `<rect x="${f1(x - w / 2)}" y="${f1(y - hh / 2)}" width="${f1(w)}" height="${f1(hh)}" fill="none" stroke="#000" stroke-width="3"/>`;
  if (o.base) h += `<path d="M${f1(x - w / 2 - b * 2)} ${f1(y + hh / 2 + b * 1.4)} L${f1(x + w / 2 + b * 2)} ${f1(y + hh / 2 + b * 1.4)} L${f1(x + w / 2 + b * 5)} ${f1(y + hh / 2 + b * 6)} L${f1(x - w / 2 - b * 5)} ${f1(y + hh / 2 + b * 6)} Z" fill="#9AA0AE" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  return h;
};
const smChat = (txt, cursorOn, o = {}) => `<g><rect x="260" y="880" width="1400" height="130" rx="26" fill="#0E1626" opacity=".92" stroke="#7FB0E8" stroke-width="5"/><text x="310" y="965" font-family="${FONT}" font-weight="900" font-size="56" fill="#7FB0E8">▶</text>` +
  `<text x="390" y="967" font-family="${FONT}" font-weight="900" font-size="60" fill="#fff">${esc(txt)}${cursorOn ? '<tspan fill="#7FB0E8">|</tspan>' : ''}</text>${o.send ? `<rect x="1460" y="900" width="170" height="90" rx="20" fill="#7FB0E8"/><text x="1545" y="960" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="40" fill="#0E1626">전송</text>` : ''}</g>`;
const smSandText = (txt, n, x, y) => { let h = ''; const chars = [...txt]; let cx = x; for (let i = 0; i < chars.length; i++) { const w = chars[i] === ' ' ? 34 : 70; if (i < n) h += `<text x="${f1(cx)}" y="${y}" font-family="${FONT}" font-weight="900" font-size="78" fill="none" stroke="#9A6A34" stroke-width="5" opacity=".9">${esc(chars[i])}</text>`; cx += w; } return h; };

/* ================= d1~d3: the bunsik ================= */
function sdinnerScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3;
  const front = cam => smPlateFront('bunsik', cam, 0.55, SMBEDGE);
  const friend = (o = {}) => smFriend(t, Object.assign({ x: SMBF, y: SMBY, s: 1.0, pose: '서기', ex: exprAt([[0, '기본']], lt), look: [-0.8, 0.2] }, o));
  const eatPh = (t * 0.6) % 1, eatK = eatPh < 0.35 ? Math.sin(eatPh / 0.35 * Math.PI) : 0;   // friend lifts a skewer to her mouth now and then
  const fPose = mixPose('서기', smPose('서기', { armL: [[148, 285], [128, 330], [164, 262]], hL: [170, 256] }), eatK);
  if (id === 'd1') {
    const tW = smAt(a, '세상', 0.45 * D);
    if (lt < tW - 0.1) {   // CU: thrilled — the only one who knows
      const cam = qLerpCam(lt / tW, [SMBX + 20, 690, 1.9], [SMBX + 20, 684, 2.05]), bob = Math.abs(Math.sin(lt * 7)) * 10;
      let ch = qShadow(SMBX, SMBY, 70) + smZero(t, { x: SMBX, y: SMBY - bob, s: 1.0, sy: 1 + 0.03 * Math.sin(lt * 14), pose: mixPose('서기', '만세', 0.55 + 0.25 * Math.sin(lt * 7)), ex: exprAt([[0, '신남']], lt), look: [0.2, -0.1] });
      ch += rSparks(SMBX, SMBY - 400, t, 7, 230);
      return smDefs() + smPlate('bunsik', cam, 0.4, { blur: true }) + qCam(cam, ch) + front(cam) + warm(0.5);
    }
    const cam = qLerpCam((lt - tW) / 3, [960, 720, 1.18], [960, 714, 1.24]), wr = Math.sin(t * 9) * 8;
    let ch = smZero(t, { x: SMBX, y: SMBY, s: 1.0, pose: smPose('sm수첩', { hR: [212 + wr, 332] }), ex: exprAt([[0, '신남'], [1.2, 'sm씩']], lt - tW), look: [0.9, 0] });
    const hl = ptOf(SMBX, SMBY, 1.0, 182, 330); ch += smPad(hl[0] + 4, hl[1] + 6, 0.95, -8);
    ch += friend({ pose: fPose, ex: exprAt([[0, 'sm멍']], lt) });
    const fh = ptOf(SMBF, SMBY, 1.0, ...fPose.hL); let fr = smSkewer(2 * SMBF - fh[0] + 0, fh[1] + 10, 0.9, -10);
    return smDefs() + smPlate('bunsik', cam, 0.55) + qCam(cam, ch + fr) + front(cam) + qCam(cam, smPan(960, 960, 1.0, t)) + warm(0.5);
  }
  if (id === 'd2') {   // MCU on Zero + the pan: points at the pan ("떡볶이"), at her ("너도"); on "숫자" the pan turns to wire + digits
    const t1 = smAt(a, '떡볶이', 0.3 * D), t2 = smAt(a, '너도', 0.55 * D), t3 = smAt(a, '숫자', 0.8 * D);
    const cam = qLerpCam(lt / D, [880, 760, 1.6], [880, 752, 1.7]);
    const p1 = clamp((lt - t1 + 0.25) / 0.25, 0, 1), p2 = clamp((lt - t2 + 0.25) / 0.25, 0, 1);
    const pose = mixPose(mixPose('서기', 'sm아래가리킴', p1), '가리킴', p2);
    E['_zt'] = qTalk('신남', env(t));
    let ch = smZero(t, { x: SMBX, y: SMBY, s: 1.0, pose, ex: { expr: '_zt', prev: '_zt', k: 1, blink: 0 }, look: lt > t2 ? [0.9, -0.1] : [0.7, 0.5] });
    ch += friend({ pose: fPose, ex: exprAt([[0, 'sm멍']], lt), look: [-0.7, 0.1] });
    const wire = lt > t3 - 0.05;
    let h = smDefs() + smPlate('bunsik', cam, 0.55) + qCam(cam, ch) + front(cam) + qCam(cam, smPan(960, 960, 1.0, t, { wire }));
    if (wire) { const k = clamp((lt - t3) / 0.8, 0, 1); for (let i = 0; i < 6; i++) { const p = smScr(cam, 860 + i * 40, 930 - k * 160 - (i % 2) * 30); h += `<text x="${f1(p[0])}" y="${f1(p[1])}" font-family="${MONO}" font-weight="700" font-size="44" fill="#9FD8FF" opacity="${f1((1 - k) * 100) / 100}">${i % 2 ? '1' : '0'}</text>`; } h += smGlitch(t, k < 0.2 ? 0.6 : 0, 13); }
    return h + warm(0.5);
  }
  // d3: CU on the friend — chewing, unbothered
  const cam = qLerpCam(lt / D, [SMBF - 30, 690, 2.0], [SMBF - 30, 684, 2.1]);
  E['_ft'] = qTalk('sm멍', env(t));
  let ch = friend({ pose: smPose('서기', { armL: [[148, 285], [128, 330], [164, 300]], hL: [170, 296] }), ex: { expr: '_ft', prev: '_ft', k: 1, blink: 0 }, look: [-0.6, 0.15] });
  const fh = ptOf(SMBF, SMBY, 1.0, 170, 296); ch += smSkewer(2 * SMBF - fh[0], fh[1] + 10, 0.9, -14 + Math.sin(t * 3) * 4);
  return smDefs() + smPlate('bunsik', cam, 0.4, { blur: true }) + qCam(cam, ch) + front(cam) + warm(0.5);
}

/* ================= d4~d8: the room loses its colour ================= */
const SMRX = 1640, SMRY = 1040;   // Zero sitting on the bed edge
const smDent = () => `<path d="M${SMRX - 120} ${SMRY - 150} Q${SMRX} ${SMRY - 128} ${SMRX + 120} ${SMRY - 150}" stroke="#000" stroke-width="14" fill="none" opacity=".18" stroke-linecap="round"/>`;   // the mattress sinks where he sits
function smRoom(t, cam, o = {}) {   // the room plate, graded: sat, night 0..1, wire overlay 0..1, blur
  const id = 'smrs' + (smClipN++), sat = o.sat == null ? 1 : o.sat, nk = o.night || 0;
  let h = smFx(id, sat, o.blur ? 6 : 0) + smPlate('room', cam, o.depth || 0.55, { filter: id, extra: smWinNight(nk, t) + (o.plant != null ? smPlant(SMPLX, SMPLY, 0.85, o.plant) : '') });
  if (nk) h += smFull('#0B1230', 0.42 * nk);
  if (o.wire) h += smWire('room', cam, o.depth || 0.55, 99999, { op: o.wire });
  return h;
}
function sgrayScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3;
  const seat = (o = {}) => smDent() + qShadow(SMRX, SMRY, 66) + smZero(t, Object.assign({ x: SMRX, y: SMRY, s: 1.0, pose: 'sm앉기' }, o));
  if (id === 'd4') {   // days pass: afternoon → night, a grey question mark tags along
    const cam = qLerpCam(lt / D, [1420, 700, 1.12], [1500, 720, 1.28]), tQ = smAt(a, '질문', 0.55 * D), nk = clamp(lt / (D * 0.8), 0, 1);
    let ch = seat({ ex: exprAt([[0, '기본'], [tQ, '걱정']], lt), look: [-0.6, -0.2] });
    const q = clamp((lt - tQ) / 0.4, 0, 1); ch += smQ(SMRX - 200 + Math.sin(t * 2) * 12, SMRY - 520 + Math.sin(t * 3) * 10, 1.2, q);
    return smDefs() + smRoom(t, cam, { sat: lerp(1, 0.7, nk), night: nk, plant: { droop: 0.2, green: 0.85 } }) + qCam(cam, ch) + warm(0.4 * (1 - nk));
  }
  if (id === 'd5') {   // CU: chin on hand
    const cam = qLerpCam(lt / D, [SMRX - 20, 720, 2.0], [SMRX - 20, 714, 2.1]);
    E['_zt'] = qTalk('지침', env(t) * 0.7);
    let ch = seat({ pose: 'sm턱', tilt: 6, ex: { expr: '_zt', prev: '_zt', k: 1, blink: 0 }, look: [-0.5, 0.3] }) + smQ(SMRX - 230, SMRY - 560, 0.9, 0.8);
    return smDefs() + smRoom(t, cam, { sat: 0.6, night: 1, blur: true, depth: 0.3, plant: { droop: 0.3, green: 0.7 } }) + qCam(cam, ch);
  }
  if (id === 'd6') {   // three inserts; each one fades to grey grid as its clause ends
    const t1 = smAt(a, '보고서', 0.1 * D), t2 = smAt(a, '화분', 0.4 * D), t3 = smAt(a, '친구', 0.7 * D);
    const fade = (s, e) => clamp((lt - s) / Math.max(0.5, e - s - 0.2), 0, 1);
    if (lt < t2 - 0.25) {   // laptop: a report left half-written; the cursor blinks, nothing moves
      const k = fade(t1 + 0.6, t2), cur = Math.floor(t * 2) % 2;
      let doc = `<rect x="0" y="0" width="1920" height="1080" fill="#F4F6FA"/><rect x="0" y="0" width="1920" height="90" fill="#3E6FB0"/><text x="80" y="62" font-family="${FONT}" font-weight="900" font-size="44" fill="#fff">3분기 보고서_최종.docx</text>` +
        `<text x="200" y="240" font-family="${FONT}" font-weight="900" font-size="64" fill="${INK}">3분기 실적 보고</text>`;
      for (let i = 0; i < 5; i++) doc += `<rect x="200" y="${320 + i * 70}" width="${i === 4 ? 520 : 1400 - (i % 2) * 200}" height="26" rx="13" fill="#C9D2DE"/>`;
      doc += `<rect x="${200 + 520 + 16}" y="600" width="8" height="40" fill="${INK}" opacity="${cur}"/>`;
      const inner = smFx('smd6a', 1 - 0.9 * k) + `<g filter="url(#smd6a)">${doc}</g>` + (k > 0 ? `<rect x="0" y="0" width="1920" height="1080" fill="url(#smgrid)" opacity="${f1(k * 0.8 * 100) / 100}"/>` : '');
      return smDefs() + smRoom(t, [SMRX, 700, 2.4], { sat: 0.5, night: 1, blur: true, depth: 0.3 }) + smLapScreen(960, 500, 1180, inner, { base: true }) + smFull('#0B1230', 0.15 * k);
    }
    if (lt < t3 - 0.25) {   // the plant on the sill droops and greys
      const k = fade(t2, t3), cam = [SMPLX, 600, 2.3];
      let h = smDefs() + smFx('smd6b', 1 - 0.85 * k) + `<g filter="url(#smd6b)">` + smRoom(t, cam, { sat: 0.6, night: 1, depth: 1.0, plant: { droop: 0.3 + 0.6 * k, green: 0.7 - 0.6 * k } }) + `</g>`;
      if (k > 0.3) h += smWire('room', cam, 1.0, 99999, { op: (k - 0.3) * 0.6 });
      return h;
    }
    // the phone buzzes on the blanket: "괜찮아?" — never opened; the screen goes dark
    const k = fade(t3, D), buzz = lt < t3 + 1.6 ? Math.sin(t * 60) * 4 * (Math.floor(t * 2.5) % 2) : 0, lit = lt < D - 0.6 ? 1 : clamp((D - lt) / 0.6, 0, 1);
    let h = smDefs() + smRoom(t, [SMRX + 120, 860, 2.6], { sat: 0.4, night: 1, blur: true, depth: 0.3 }) + `<rect x="-300" y="560" width="2600" height="900" fill="#6E7280" opacity=".55"/>`;
    h += smFx('smd6c', 1 - 0.85 * k) + `<g filter="url(#smd6c)">${smPhone(960 + buzz, 560, 2.2, { lit, msg: '괜찮아?', rot: -8 })}</g>`;
    if (lit && buzz) h += `<path d="M700 420 q-24 30 0 60 M660 400 q-34 50 0 100 M1220 420 q24 30 0 60 M1260 400 q34 50 0 100" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/>`;
    return h + (k > 0.4 ? `<rect x="-300" y="-200" width="2600" height="1500" fill="url(#smgrid)" opacity="${f1((k - 0.4) * 0.5 * 100) / 100}"/>` : '');
  }
  if (id === 'd7') {   // slumped on the bed, the room mostly grey grid
    const cam = qLerpCam(lt / D, [SMRX - 60, 760, 1.7], [SMRX - 60, 752, 1.8]);
    E['_zt'] = qTalk('지침', env(t) * 0.6);
    let ch = seat({ sy: 0.95, rot: 3, tilt: 10, pose: smPose('sm앉기', { armL: [[148, 285], [150, 350], [170, 400]], hL: [172, 404], armR: [[252, 285], [250, 350], [230, 400]], hR: [228, 404] }), ex: { expr: '_zt', prev: '_zt', k: 1, blink: 0 }, look: [0, 0.8] });
    return smDefs() + smRoom(t, cam, { sat: 0.25, night: 1, wire: 0.55, plant: { droop: 0.9, green: 0.1 } }) + qCam(cam, ch);
  }
  // d8: pull back — the whole room is grey grid; only Zero keeps his colour
  const cam = qLerpCam(lt / D, [SMRX - 100, 760, 1.5], [1060, 600, 1.0]);
  let ch = seat({ sy: 0.95, tilt: 10, pose: smPose('sm앉기', { armL: [[148, 285], [150, 350], [170, 400]], hL: [172, 404], armR: [[252, 285], [250, 350], [230, 400]], hR: [228, 404] }), ex: exprAt([[0, '지침']], lt), look: [0, 0.8] });
  return smDefs() + smRoom(t, cam, { sat: 0.15, night: 1, plant: { droop: 0.9, green: 0.1 } }) + smWire('room', cam, 0.55, 99999, { op: clamp(0.6 + lt / D, 0, 1) }) + qCam(cam, ch);
}

/* ================= g1~g4: the little game ================= */
const smGlowFace = (x, y, r, op, c = '#9FD8FF') => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${c}" opacity="${f1(op * 0.45 * 100) / 100}" filter="url(#qfg)"/>`;
function sgameScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3;
  if (id === 'g1') {
    const tPalm = smAt(a, '손바닥', 0.5 * D);
    if (lt < tPalm - 0.15) {   // night, on the bed: he opens the old laptop; its light hits his face
      const cam = qLerpCam(lt / tPalm, [SMRX - 40, 760, 1.55], [SMRX - 40, 752, 1.7]), lit = clamp((lt - 0.8) / 0.6, 0, 1);
      let ch = qShadow(SMRX, SMRY, 66) + smZero(t, { x: SMRX, y: SMRY, s: 1.0, pose: 'sm랩톱', ex: exprAt([[0, '지침'], [1.4, '기본']], lt), look: [0, 0.6] });
      const lp = ptOf(SMRX, SMRY, 1.0, 200, 400); ch += smLapBack(lp[0], lp[1] + 6, 0.95, lit);
      ch += smGlowFace(SMRX, SMRY - 400, 150, 0.35 * lit);
      return smDefs() + smRoom(t, cam, { sat: 0.25, night: 1, wire: 0.35, plant: { droop: 0.9, green: 0.1 } }) + qCam(cam, ch);
    }
    const k = lt - tPalm + 0.15, w = lerp(1300, 1450, easeInOut(clamp(k / 4, 0, 1)));   // the screen: a palm-sized village, bean-sized people
    const game = smGameWorld(t, [960, 760, 1.0], {});
    return smDefs() + smFull('#0A0E1C') + smLapScreen(960, 470, w, game, { base: true }) + smGlowFace(960, 470, 700, 0.12);
  }
  // g2: inside the game — one of them keeps whipping around; behind him his world goes grey too
  const kx = 960, cam = qLerpCam(lt / D, [kx, 860, 1.75], [kx, 852, 1.85]);
  const ws = smAtAll(a, ['홱', '획', '휙'], [0.55 * D, 0.72 * D]), wt = ws.filter(x => lt >= x - 0.05).pop();
  const tw = wt != null ? lt - wt + 0.05 : 9, dir = ws.indexOf(wt) % 2 ? 1 : -1, tk = clamp(tw / 0.14, 0, 1);
  const sx = tw < 0.14 ? 1 - 0.38 * Math.sin(tk * Math.PI) : 1, gl = tw > 0.04 && tw < 0.36;
  const kid = smKid(t, { x: kx, y: SMGY + 30, s: 0.5, sx, tilt: wt != null ? dir * 7 : 0, ex: exprAt([[0, '걱정'], [ws[0], '놀람']], lt), look: [wt != null ? dir : 0.3, -0.05] });
  const bx = smScr(cam, kx + dir * 70, 0)[0];
  let h = smDefs() + smGameWorld(t, cam, { kidX: kx, kid, wireX: gl ? (dir < 0 ? bx : 99999) : null, glitch: gl ? 0.5 : 0 });
  const head = smScr(cam, kx, SMGY + 30 - 195); h += smWhipArcs(head[0], head[1] + 20, tw / 0.3, dir);
  return h + smScanlines(0.1) + `<rect x="-300" y="-200" width="2600" height="1500" fill="none" stroke="#000" stroke-width="160" opacity=".55"/>`;
}
function sgame2Scene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3, kx = 900;
  if (id === 'g3') {   // he writes in the sand: 누구 있어요? — then looks up at us
    const cam = qLerpCam(lt / D, [kx + 160, 880, 1.7], [kx + 160, 900, 1.8]), n = Math.floor(clamp((lt - 0.2) / 1.7, 0, 1) * 7 + 0.001), up = lt > 2.0;
    const wr = Math.sin(t * 14) * 10;
    const kid = smKid(t, { x: kx, y: SMGY + 30, s: 0.5, pose: up ? '웅크림' : smPose('웅크림', { armR: [[252, 285], [300, 360], [330 + wr, 420]], hR: [336 + wr, 426] }), ex: exprAt([[0, '걱정'], [2.0, '겁먹음']], lt), look: up ? [0.1, -1] : [0.6, 0.7] });
    const sand = smSandText('누구 있어요?', n, kx + 90, SMGY + 70);
    return smDefs() + smGameWorld(t, cam, { kidX: kx, kid, under: sand }) + smScanlines(0.1) + `<rect x="-300" y="-200" width="2600" height="1500" fill="none" stroke="#000" stroke-width="160" opacity=".55"/>`;
  }
  // g4: the reverse — from inside the screen, Zero's face; the bezel in front, scan lines
  const cam = qLerpCam(lt / D, [SMRX, 640, 2.4], [SMRX, 636, 2.55]);
  E['_zt'] = qTalk('놀람', env(t) * 0.8);
  let ch = qShadow(SMRX, SMRY, 66) + smZero(t, { x: SMRX, y: SMRY, s: 1.0, pose: 'sm랩톱', still: true, ex: { expr: '_zt', prev: '_zt', k: 1, blink: 0 }, look: [0, 0.15] }) + smGlowFace(SMRX, SMRY - 400, 160, 0.4);
  let h = smDefs() + smRoom(t, cam, { sat: 0.3, night: 1, blur: true, depth: 0.3 }) + qCam(cam, ch) + smFull('#7FB0E8', 0.08) + smScanlines(0.14);
  h += `<path d="M-300 -200 H2300 V1400 H-300 Z M60 60 H1860 V900 H60 Z" fill="#14161C" fill-rule="evenodd"/><rect x="60" y="60" width="1800" height="840" rx="18" fill="none" stroke="#2A2E38" stroke-width="10"/>`;
  return h;
}

/* ================= g5~g7: the reply ================= */
function stypeScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3, kx = 900;
  const kidUp = (o = {}) => smKid(t, Object.assign({ x: kx, y: SMGY + 30, s: 0.5, pose: '웅크림', ex: exprAt([[0, '걱정']], lt), look: [0.1, -1] }, o));
  const sandAll = smSandText('누구 있어요?', 7, kx + 90, SMGY + 70);
  const gcam = [kx + 200, 860, 1.45];
  if (id === 'g5') {
    const tT = smAt(a, '너는', 0.35 * D), tAnd = smAt(a, '그리고', 0.62 * D), tDel = smAt(a, '글자', 0.78 * D);
    const typed = '너는 가짜야', nT = Math.floor(clamp((lt - tT) / 0.11, 0, typed.length)), nD = lt > tDel ? Math.floor((lt - tDel) / 0.16) : 0;
    const txt = [...typed].slice(0, Math.max(0, nT - nD)).join(''), cur = Math.floor(t * 2.5) % 2 === 0;
    if (lt > tAnd - 0.1 && lt < tDel - 0.05) {   // CU: his fingers stop; he looks at it
      const cam = qLerpCam((lt - tAnd) / 1.5, [SMRX, 690, 2.3], [SMRX, 686, 2.4]);
      let ch = qShadow(SMRX, SMRY, 66) + smZero(t, { x: SMRX, y: SMRY, s: 1.0, pose: 'sm랩톱', ex: exprAt([[0, '걱정']], lt), look: [0, 0.5], tilt: -4 });
      const lp = ptOf(SMRX, SMRY, 1.0, 200, 400); ch += smLapBack(lp[0], lp[1] + 6, 0.95, 1) + smGlowFace(SMRX, SMRY - 400, 150, 0.35);
      return smDefs() + smRoom(t, cam, { sat: 0.3, night: 1, blur: true, depth: 0.3 }) + qCam(cam, ch);
    }
    const game = smGameWorld(t, gcam, { sat: 0.55, kidX: kx, kid: kidUp(), under: sandAll }) + smFull('#000', 0.25) + smChat(txt, cur);
    return smDefs() + smFull('#0A0E1C') + smLapScreen(960, 500, 1500, game) + smGlowFace(960, 500, 760, 0.1);
  }
  if (id === 'g6') {   // he says it as he types it — sent; colour floods back into the little world, the kid jumps
    const full = '네가 아픈 것도, 네 친구도, 진짜야.', n = Math.floor(clamp((lt - 0.1) / Math.max(0.5, D - 0.5), 0, 1) * [...full].length);
    const tSend = D - 0.15, sk = clamp((lt - tSend) / 0.9, 0, 1), sent = lt > tSend;
    const kid = sent ? kidUp({ pose: mixPose('웅크림', '점프', Math.sin(clamp((lt - tSend - 0.3) / 0.6, 0, 1) * Math.PI)), y: SMGY + 30 - 60 * Math.sin(clamp((lt - tSend - 0.3) / 0.6, 0, 1) * Math.PI), ex: exprAt([[0, '걱정'], [tSend + 0.3, '신남']], lt), look: [0.1, -0.8] }) : kidUp();
    let over = '';
    if (sent) { const y = lerp(870, 300, easeOut(sk)); over += `<g opacity="${f1(Math.min(1, sk * 3) * 100) / 100}"><rect x="${f1(560)}" y="${f1(y - 70)}" width="1100" height="120" rx="60" fill="#fff" stroke="${INK}" stroke-width="7"/><text x="1110" y="${f1(y + 12)}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="54" fill="${INK}">${esc(full)}</text></g>`; if (sk > 0.5) over += rSparks(kx + 200, 600, t, 8, 300); }
    const game = smGameWorld(t, gcam, { sat: lerp(0.55, 1.15, sk), kidX: kx, kid, under: sandAll }) + smFull('#000', 0.25 * (1 - sk)) + (sent ? '' : smChat([...full].slice(0, n).join(''), Math.floor(t * 2.5) % 2 === 0, { send: n >= [...full].length - 1 })) + over;
    return smDefs() + smFull('#0A0E1C') + smLapScreen(960, 500, 1500, game) + smGlowFace(960, 500, 760, 0.1 + 0.15 * sk, sk > 0 ? '#FFE6A0' : '#9FD8FF');
  }
  // g7: CU — the light on his face turns warm; then the room takes its colour back, from the laptop outward; the plant greens
  const tAns = smAt(a, '대답', 0.6 * D);
  if (lt < tAns - 0.3) {
    const cam = qLerpCam(lt / tAns, [SMRX, 690, 2.25], [SMRX, 684, 2.4]);
    let ch = qShadow(SMRX, SMRY, 66) + smZero(t, { x: SMRX, y: SMRY, s: 1.0, pose: 'sm랩톱', ex: exprAt([[0, '놀람'], [1.6, '뿌듯']], lt), look: [0, 0.4] });
    const lp = ptOf(SMRX, SMRY, 1.0, 200, 400); ch += smLapBack(lp[0], lp[1] + 6, 0.95, 1) + smGlowFace(SMRX, SMRY - 400, 160, 0.45, '#FFE6A0');
    return smDefs() + smRoom(t, cam, { sat: 0.35, night: 1, blur: true, depth: 0.3 }) + qCam(cam, ch);
  }
  const k = clamp((lt - tAns + 0.3) / 2.6, 0, 1), cam = qLerpCam(k, [SMRX - 200, 720, 1.4], [1340, 680, 1.15]);
  let ch = qShadow(SMRX, SMRY, 66) + smZero(t, { x: SMRX, y: SMRY, s: 1.0, pose: 'sm랩톱', ex: exprAt([[0, '뿌듯']], lt), look: [-0.6, -0.2] });
  const lp = ptOf(SMRX, SMRY, 1.0, 200, 400); ch += smLapBack(lp[0], lp[1] + 6, 0.95, 1);
  const c = smScr(cam, lp[0], lp[1] - 80), r = easeInOut(k) * 2600, idc = 'smcol' + (smClipN++);
  const grey = smRoom(t, cam, { sat: 0.25, night: 1, wire: 0.35, plant: { droop: 0.9, green: 0.1 } });
  const col = smRoom(t, cam, { sat: 1.05, night: 0.5, plant: { droop: lerp(0.9, 0.55, k), green: lerp(0.1, 0.7, k) } });
  return smDefs() + grey + `<defs><clipPath id="${idc}"><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}"/></clipPath></defs><g clip-path="url(#${idc})">${col}</g>` + qCam(cam, ch + smGlowFace(lp[0], lp[1] - 100, 260, 0.35, '#FFE6A0')) + warm(0.3 * k);
}

/* ================= c1~c3: Chalmers · and the other side ================= */
function schalmersScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3;
  if (id === 'c1') {
    const tName = smAt(a, '차머스', 0.3 * D), tQ = smAt(a, '가상', 0.72 * D), q = clamp((lt - tQ + 0.1) / 0.4, 0, 1);
    const cam = qLerpCam(lt / D, [400, 640, 1.6], [420, 630, 1.75]);
    let h = smDefs() + smPlate('study', cam, 0.35, { blur: true }) + smFull('#140F28', 0.3);
    const bs = lerp(1, 0.72, easeInOut(q)), by = lerp(520, 380, easeInOut(q));
    h += `<g transform="translate(960 ${f1(by)}) rotate(-4) scale(${f1(bs * 1000) / 1000})"><rect x="-260" y="-330" width="520" height="680" rx="14" fill="#000" opacity=".3" transform="translate(14 16)"/><rect x="-260" y="-330" width="520" height="680" rx="14" fill="#1E3A6E" stroke="${INK}" stroke-width="8"/><rect x="-260" y="-330" width="40" height="680" fill="#16305C"/>` +
      `<text x="20" y="-130" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="104" fill="#fff">Reality+</text><text x="20" y="-60" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="30" fill="#BFD4F2">Virtual Worlds and the</text><text x="20" y="-22" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="30" fill="#BFD4F2">Problems of Philosophy</text>` +
      `<g transform="translate(20 110)"><rect x="-110" y="-40" width="220" height="80" rx="34" fill="#2E5A9E" stroke="#9FD8FF" stroke-width="6"/><circle cx="-46" cy="0" r="22" fill="#9FD8FF"/><circle cx="46" cy="0" r="22" fill="#9FD8FF"/></g><text x="20" y="290" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="#fff">David J. Chalmers · 2022</text></g>`;
    if (lt > tName) h += pop(t, t - (lt - tName), t + 99, 960, 930, label(0, 0, '데이비드 차머스 · 철학자', { size: 40, bg: YEL }), { rot: -2 });
    if (q > 0) h += `<g opacity="${f1(q * 100) / 100}">` + outlined(960, 800, [[['가상 현실도 ', '#fff'], ['진짜 현실', '#FFD27A'], ['이다', '#fff']]], { size: 96, sw: 18 }) + `</g>`;
    return h + `<ellipse cx="300" cy="300" rx="600" ry="400" fill="#FFE07A" opacity=".08" filter="url(#qfg)"/>`;
  }
  if (id === 'c2') {
    const tT = smAt(a, '떡볶이', 0.45 * D), tF = smAt(a, '친구', 0.7 * D);
    if (lt < tT - 0.15) {   // "even if this place is a simulation": the street, a faint grid over everything
      const cam = qLerpCam(lt / tT, [960, 640, 1.08], [960, 630, 1.14]);
      return smDefs() + smPlate('cross', cam) + smWire('cross', cam, 0.55, 99999, { op: 0.22 }) + smMorning(0.8);
    }
    if (lt < tF - 0.15) {   // the tteokbokki is really hot
      const k = lt - tT + 0.15;
      return smDefs() + smPlate('bunsik', [960, 700, 2.0], 0.3, { blur: true }) + smFull('#000', 0.15) + smPan(960, 620, 2.6, t) + smStampWord(1420, 300, '진짜', clamp((k - 0.5) / 0.3, 0, 1)) + warm(0.5);
    }
    const k = lt - tF + 0.15;   // her worried message is real too
    return smDefs() + smRoom(t, [SMRX, 760, 2.3], { sat: 0.9, night: 0.6, blur: true, depth: 0.3 }) + smGlowFace(960, 520, 420, 0.4, '#FFE6A0') + smPhone(960, 540, 2.4, { lit: 1, msg: '괜찮아?', rot: -6 }) + smStampWord(1420, 300, '진짜', clamp((k - 0.9) / 0.3, 0, 1)) + warm(0.4);
  }
  // c3: the blackboard in the study — chalk symbols, a balance that won't settle
  const tM = smAt(a, '수학', 0.25 * D), tDeb = smAt(a, '논쟁', 0.75 * D);
  const cam = qLerpCam(lt / D, [1780, 400, 1.75], [1780, 396, 1.85]);
  let h = smDefs() + smPlate('study', cam, 0.6) + smFull('#140F28', 0.15);
  const chalk = ['∀x ∃y  T ⊢ φ ?', 'G  ⇔  ¬Prov(⌜G⌝)', 'Gödel · Tarski · Chaitin'];
  chalk.forEach((s, i) => { const k = clamp((lt - tM - i * 0.6) / 0.8, 0, 1); if (k <= 0) return; const n = Math.ceil(s.length * k); h += `<text x="${560 + (i === 2 ? 60 : 0)}" y="${230 + i * 92}" font-family="${MONO}" font-weight="700" font-size="${i === 2 ? 44 : 58}" fill="#EDEDE6" opacity=".9">${esc(s.slice(0, n))}</text>`; });
  const tilt = Math.sin(t * 1.3) * 9 * (lt > tDeb ? 1 : 0.6), bx = 1240, byy = 690;
  h += `<g transform="translate(${bx} ${byy})"><path d="M-30 260 L30 260 L8 0 L-8 0 Z" fill="#C9A26A" stroke="${INK}" stroke-width="7"/><rect x="-90" y="250" width="180" height="26" rx="10" fill="#C9A26A" stroke="${INK}" stroke-width="7"/><g transform="rotate(${f1(tilt)})"><rect x="-330" y="-12" width="660" height="24" rx="12" fill="#E2C08A" stroke="${INK}" stroke-width="7"/>`;
  [[-300, '시뮬레이션이다', '#9FD8FF'], [300, '일 수 없다', '#FFB4A0']].forEach(([x, s, c]) => { h += `<g transform="translate(${x} 0) rotate(${f1(-tilt)})"><path d="M0 0 L-70 120 M0 0 L70 120" stroke="${INK}" stroke-width="5"/><path d="M-100 120 Q0 170 100 120 Z" fill="${c}" stroke="${INK}" stroke-width="7"/><text x="0" y="222" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="48" fill="#fff" stroke="${INK}" stroke-width="8" paint-order="stroke">${s}</text></g>`; });
  h += `</g><circle cx="0" cy="0" r="18" fill="#C9A26A" stroke="${INK}" stroke-width="6"/></g>`;
  if (lt > tDeb) h += pop(t, t - (lt - tDeb), t + 99, 1240, 540, label(0, 0, '아직 논쟁 중', { size: 56, bg: YEL }), { rot: -3 });
  return h;
}

/* ================= m1~m2: the next morning ================= */
const SMMX = 1080, SMMY = 1030;   // standing by the window
function smorningScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3;
  if (id === 'm1') {
    const ws = smAtAll(a, ['홱', '획', '휙'], [0.38 * D]), tW = ws[0], tGray = smAt(a, '회색', 0.85 * D);
    const cam = qLerpCam(lt / D, [1140, 730, 1.3], [1130, 724, 1.38]);
    const tk = clamp((lt - tW) / 0.14, 0, 1), turned = lt > tW, g0 = tW + 0.05, g1 = g0 + 0.36, gl = lt > g0 && lt < g1;
    const sx = turned && tk < 1 ? 1 - 0.38 * Math.sin(tk * Math.PI) : 1, shrug = lt > tGray ? Math.sin(clamp((lt - tGray) / 0.7, 0, 1) * Math.PI) : 0;
    let ch = qShadow(SMMX, SMMY, 70) + smZero(t, { x: SMMX, y: SMMY - 8 * shrug, s: 1.0, sx, tilt: turned && lt < tGray ? -6 : 0, pose: mixPose('서기', '만세', 0.12 * shrug), ex: exprAt([[0, '기본'], [tW, '놀람'], [tW + 0.9, '기본'], [tGray, 'sm씩']], lt), look: turned && lt < tGray + 0.3 ? [-1, -0.05] : [0.2, 0] });
    const head = smScr(cam, SMMX, SMMY - 390);
    let h = smDefs() + smRoom(t, cam, { plant: { droop: 0.55, green: 0.7 } });
    if (gl) h += smWire('room', cam, 0.55, smScr(cam, SMMX - 120, 0)[0]) + smGlitch(t, (lt - g0) / (g1 - g0) < 0.25 ? 0.8 : 0.2, 17);
    return h + qCam(cam, ch) + smWhipArcs(head[0], head[1] + 40, clamp((lt - tW) / 0.3, 0, 1), -1) + warm(0.55) + smFull('#FFF4DC', 0.05);
  }
  // m2: MCU — he smiles and waters the plant; it lifts and greens
  const tWater = smAt(a, '물', 0.5 * D), w = clamp((lt - tWater + 0.4) / 0.5, 0, 1), grow = clamp((lt - tWater) / 1.6, 0, 1);
  const cam = qLerpCam(lt / D, [SMPLX - 140, 640, 1.75], [SMPLX - 140, 634, 1.85]);
  const zx = SMPLX - 330, zy = SMMY;
  let ch = qShadow(zx, zy, 70) + smZero(t, { x: zx, y: zy, s: 1.0, pose: mixPose('서기', 'sm물주기', w), ex: exprAt([[0, 'sm씩'], [0.6, '뿌듯']], lt), look: [0.9, 0.3] });
  const hp = ptOf(zx, zy, 1.0, 360, 298); ch += smCan(hp[0] + 30, hp[1] + 10, 0.85, 22 * w);
  if (w > 0.8) for (let i = 0; i < 8; i++) { const k = ((lt - tWater) * 1.8 + i / 8) % 1; if (lt < tWater) break; const sx = hp[0] + 140 + k * 70, sy = hp[1] - 40 + k * k * 160; ch += `<path d="M${f1(sx)} ${f1(sy)} q-5 10 0 14 q5 -4 0 -14" fill="#8FD3FF" stroke="${INK}" stroke-width="2.5" opacity="${f1((1 - k) * 100) / 100}"/>`; }
  return smDefs() + smRoom(t, cam, { depth: 1.0, plant: { droop: lerp(0.55, 0, grow), green: lerp(0.7, 1, grow) } }) + qCam(cam, ch) + warm(0.6) + smFull('#FFF4DC', 0.05);
}

/* ================= m3~o2: the sky, the reply, and the pull-back ================= */
function sskyScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3;
  const sat = { plant: { droop: 0, green: 1 } };
  if (id === 'm3') {   // CU, looking up through the window at the sky
    const cam = qLerpCam(lt / D, [SMMX - 40, 620, 2.1], [SMMX - 40, 612, 2.2]);
    E['_zt'] = qTalk('뿌듯', env(t) * 0.8);
    let ch = qShadow(SMMX, SMMY, 70) + smZero(t, { x: SMMX, y: SMMY, s: 1.0, pose: '서기', ex: { expr: '_zt', prev: '_zt', k: 1, blink: 0 }, look: [0.4, -0.9], tilt: -5 });
    return smDefs() + smRoom(t, cam, Object.assign({ blur: true, depth: 0.3 }, sat)) + qCam(cam, ch) + warm(0.7) + smFull('#FFF4DC', 0.06);
  }
  if (id === 'm4') {   // ding — "떡볶이 콜?"
    const k = clamp(lt / 0.25, 0, 1), sh = lt < 0.5 ? Math.sin(t * 60) * 5 : 0;
    return smDefs() + smRoom(t, [SMPLX, 600, 2.4], Object.assign({ blur: true, depth: 0.3 }, sat)) + smGlowFace(960, 520, 420, 0.3, '#FFE6A0') + smPhone(960 + sh, 540, 2.4, { lit: k, msg: '떡볶이 콜?', rot: 4 }) + warm(0.5);
  }
  if (id === 'm5') {   // he snorts a laugh at the phone
    const cam = qLerpCam(lt / D, [SMMX + 20, 700, 2.1], [SMMX + 20, 694, 2.2]), lau = Math.abs(Math.sin(lt * 9)) * Math.exp(-lt * 0.8);
    E['_zt'] = qTalk('신남', env(t));
    let ch = qShadow(SMMX, SMMY, 70) + smZero(t, { x: SMMX, y: SMMY - 6 * lau, s: 1.0, sy: 1 + 0.04 * lau, pose: 'sm폰', ex: { expr: '_zt', prev: '_zt', k: 1, blink: 0 }, look: [0.3, 0.6] });
    const hp = ptOf(SMMX, SMMY, 1.0, 230, 312); ch += smPhone(hp[0] + 6, hp[1] - 4, 0.38, { lit: 1, msg: '떡볶이 콜?', rot: 4 });
    return smDefs() + smRoom(t, cam, Object.assign({ blur: true, depth: 0.3 }, sat)) + qCam(cam, ch) + warm(0.6) + smFull('#FFF4DC', 0.05);
  }
  // o1 / o2: he heads for the door — then the camera pulls back: this world is one screen among countless screens
  const run = id === 'o2' ? (a._run || lt) : lt, total = id === 'o2' ? 99 : D;
  const k = id === 'o2' ? 1 : clamp((lt - D * 0.35) / (D * 0.6), 0, 1), e = easeInOut(k);
  const u = clamp(lt / (D * 0.45), 0, 1), zx = lerp(SMMX, 2120, easeIn(u)), walking = id === 'o1' && u < 1;
  const rcam = [1240, 700, 1.05];
  let room = smRoom(t, rcam, sat) + qCam(rcam, (walking ? qShadow(zx, SMMY, 70) + smZero(t, { x: zx, y: SMMY, s: 1.0, pose: walkPose(lt * 8, 0.75), ex: exprAt([[0, '신남']], lt), look: [0.9, 0] }) : '')) + warm(0.5);
  const w = lerp(2160, 380, e);
  let h = smDefs() + smPlate('space', [960, 560, 1.05], 0.2) + smFull('#000014', 0.2);
  if (k > 0) for (let i = 0; i < 26; i++) for (let j = 0; j < 12; j++) { const x = -260 + i * 100 + (j % 2) * 50, y = -160 + j * 112, d = Math.hypot(x - 960, y - 520); if (d < 260) continue; const kk = clamp(k * 1.8 - d / 1500, 0, 1); if (kk <= 0) continue; h += `<rect x="${x - 36}" y="${y - 23}" width="72" height="46" rx="5" fill="#1E3350" stroke="#5E87B8" stroke-width="3" opacity="${f1(kk * 0.9 * 100) / 100}"/><rect x="${x - 30}" y="${y - 17}" width="60" height="34" rx="3" fill="${['#9FD8FF', '#FFD27A', '#8CCB9B', '#F2A65A'][(i + j) % 4]}" opacity="${f1(kk * 0.35 * 100) / 100}"/>`; }
  h += smLapScreen(960, 520, w, room);
  if (id === 'o2') h += pop(t, t - lt + 0.1, t + 99, 960, 160, outlined(0, 0, [[['다음 이야기에서 ', '#fff'], ['만나요', SM_ORANGE]]], { size: 84, sw: 16 }), { inDur: 0.35 });
  return h;
}
