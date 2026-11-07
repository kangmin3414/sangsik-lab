/* 시뮬레이션 편 v3 샘플 2판 — 자체 점검 16가지 반영 (review/시뮬레이션v3_샘플_점검.md).
   yscenes.js 뒤에 읽는다. 바뀐 줄만 새로 그리고, 나머지 줄은 1판 함수(yV1.*)로 넘긴다.
   16) 책상 앞 의자: 카메라 쪽 책상 앞판이 다리를 가리고, 의자 등받이가 몸 뒤로 보인다. 노트북·휴대폰·스탠드·컵은 책상 위.
   13) 클로즈업 구도: 정면 노트북 뒤 얼굴을 반복하지 않는다(스탠드 옆빛 MCU, 휴대폰 든 MS, 화면 반사, 넓은 책상 샷). */
const yV1 = { cold: window.ycoldScene, morn: window.ymornScene, umb: window.yumbScene, night: window.ynightScene, tempt: window.ytemptScene };
const YX = SMRX, YY = SMRY, YTOP = 900;   // Zero's anchor at the desk; desk-top line (world)
let yRimN = 0;

/* ---------- the desk set ---------- */
const yChairBack = (x = YX) => `<g><rect x="${x - 182}" y="${YY - 384}" width="364" height="236" rx="48" fill="#3A4252" stroke="${INK}" stroke-width="8"/><rect x="${x - 152}" y="${YY - 360}" width="304" height="36" rx="18" fill="#4C566B"/></g>`;
const yDeskFront = (x = YX) => {
  const L = x - 440, R = x + 440;
  let h = `<ellipse cx="${x}" cy="${YY + 78}" rx="500" ry="26" fill="#05060C" opacity=".45"/>`;
  h += `<rect x="${L + 8}" y="${YTOP + 20}" width="36" height="${YY + 76 - YTOP - 20}" fill="#4A3524" stroke="${INK}" stroke-width="7"/><rect x="${R - 44}" y="${YTOP + 20}" width="36" height="${YY + 76 - YTOP - 20}" fill="#4A3524" stroke="${INK}" stroke-width="7"/>`;
  h += `<rect x="${L + 30}" y="${YTOP + 24}" width="${R - L - 60}" height="146" fill="#5B4330" stroke="${INK}" stroke-width="7"/>`;
  h += `<rect x="${x + 150}" y="${YTOP + 40}" width="230" height="64" rx="6" fill="#664B36" stroke="${INK}" stroke-width="5"/><rect x="${x + 235}" y="${YTOP + 66}" width="60" height="12" rx="6" fill="#C9B08C" stroke="${INK}" stroke-width="3"/>`;
  h += `<path d="M${L + 26} ${YTOP - 20} L${R - 26} ${YTOP - 20} L${R} ${YTOP + 4} L${L} ${YTOP + 4} Z" fill="#8C6A4A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  h += `<rect x="${L}" y="${YTOP + 2}" width="${R - L}" height="26" rx="5" fill="#6B4E36" stroke="${INK}" stroke-width="7"/>`;
  return h;
};
// laptop seen from behind the lid; y = desk contact line. lid 1 open → 0 closed (the lid folds away from us, so its back panel shortens)
const yLaptop = (x, y, lid = 1, lit = 1) => {
  const H = 142 * lid, b = y - 15;
  return `<g><path d="M${x - 104} ${b} L${x + 104} ${b} L${x + 92 + 12 * (1 - lid)} ${f1(b - H)} L${x - 92 - 12 * (1 - lid)} ${f1(b - H)} Z" fill="#5A6070" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` +
    (lid > 0.35 ? `<circle cx="${x}" cy="${f1(b - H * 0.52)}" r="${f1(13 * lid)}" fill="#7A8090"/>` : '') + (lit && lid > 0.08 ? `<path d="M${x - 92} ${f1(b - H)} L${x + 92} ${f1(b - H)}" stroke="#BFE8FF" stroke-width="5" opacity=".8"/>` : '') +
    `<rect x="${x - 118}" y="${b}" width="236" height="15" rx="6" fill="#8A90A0" stroke="${INK}" stroke-width="6"/></g>`;
};
// the phone lying on the desk (face down unless o.up); o.badge, o.buzz, o.glow
const yDeskPhone = (x, y, o = {}) => {
  const j = o.buzz ? Math.sin((o.t || 0) * 95) * 4 : 0;
  let h = `<g transform="translate(${f1(x + j)} ${y})">` + (o.glow ? `<ellipse cx="0" cy="-6" rx="96" ry="18" fill="#9FD8FF" opacity="${f1(o.glow * 100) / 100}"/>` : '') +
    `<path d="M-56 -12 L56 -12 L66 4 L-66 4 Z" fill="#20232A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  if (o.buzz) h += `<path d="M-84 -26 q-10 12 0 24 M-98 -32 q-14 18 0 36 M84 -26 q10 12 0 24 M98 -32 q14 18 0 36" stroke="#DDE6F5" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>`;
  if (o.badge) h += `<g transform="translate(40 -44)"><circle r="30" fill="#E5484D" stroke="#fff" stroke-width="4"/><text y="8" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="21" fill="#fff">${o.badge}</text></g>`;
  return h + `</g>`;
};
const yLamp = (x, on = 1) => {   // desk lamp standing at x; the shade points down-right, a warm pool on the desk
  const by = YTOP - 8;
  let h = '';
  if (on > 0) h += `<defs><linearGradient id="ylamp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE3B0" stop-opacity="${f1(0.4 * on * 100) / 100}"/><stop offset="1" stop-color="#FFE3B0" stop-opacity="0.04"/></linearGradient></defs>` +
    `<path d="M${x + 30} ${by - 196} L${x + 96} ${by - 168} L${x + 250} ${by} L${x - 20} ${by} Z" fill="url(#ylamp)"/><ellipse cx="${x + 120}" cy="${by + 2}" rx="160" ry="16" fill="#FFE3B0" opacity="${f1(0.35 * on * 100) / 100}"/>`;
  const arm = `M${x} ${by - 6} L${x - 30} ${by - 128} L${x + 44} ${by - 196}`;
  h += `<ellipse cx="${x}" cy="${by}" rx="50" ry="12" fill="#2E3340" stroke="${INK}" stroke-width="6"/><path d="${arm}" stroke="${INK}" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${arm}" stroke="#4A5266" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  h += `<g transform="translate(${x + 56} ${by - 200}) rotate(30)"><path d="M-46 0 L46 0 L28 -48 L-28 -48 Z" fill="#3E4658" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>${on > 0 ? `<ellipse cx="0" cy="3" rx="40" ry="9" fill="#FFF3D0" opacity="${f1(on * 100) / 100}"/>` : ''}</g>`;
  return h;
};
// soft side/under light on a round head, clipped to the head (no glowing ball): side 'L' | 'R' | 'B'
const yRim = (x, y, r, side, col, op) => {
  const id = 'yrim' + (yRimN++), g = side === 'L' ? 'x1="0" y1="0.5" x2="0.55" y2="0.5"' : side === 'R' ? 'x1="1" y1="0.5" x2="0.45" y2="0.5"' : 'x1="0.5" y1="1" x2="0.5" y2="0.45"';
  return `<defs><clipPath id="${id}c"><circle cx="${f1(x)}" cy="${f1(y)}" r="${r}"/></clipPath><linearGradient id="${id}g" ${g}><stop offset="0" stop-color="${col}" stop-opacity="${op}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs><rect x="${f1(x - r)}" y="${f1(y - r)}" width="${2 * r}" height="${2 * r}" fill="url(#${id}g)" clip-path="url(#${id}c)"/>`;
};
P['y폰들기'] = smPose('sm랩톱', { armR: [[252, 285], [322, 336], [334, 256]], hR: [336, 250] });   // phone raised beside his face
P['y폰놓기'] = smPose('sm랩톱', { armR: [[252, 285], [326, 338], [398, 386]], hR: [402, 390] });   // ...laid on the desk
const yPhoneBack = (x, y, s = 1, rot = 0, glow = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})">${glow ? `<rect x="-40" y="-64" width="80" height="128" rx="16" fill="#9FD8FF" opacity="${f1(0.25 * glow * 100) / 100}" transform="scale(1.25)"/>` : ''}<rect x="-32" y="-58" width="64" height="116" rx="13" fill="#2A2E38" stroke="${INK}" stroke-width="6"/><circle cx="-14" cy="-38" r="7" fill="#11131A"/></g>`;
// everything at the desk: chair back → Zero → desk → laptop, lamp, cup, phone (+ light). o.z = Zero options
function yDesk(t, o = {}) {
  const z = Object.assign({ x: YX, y: YY, s: 1.0, pose: 'sm랩톱' }, o.z || {}), lid = o.lid == null ? 1 : o.lid, lit = o.lit == null ? 1 : o.lit;
  let h = yChairBack() + xZero(t, z);
  const hc = [z.x, z.y - 410 * z.s];   // head centre
  if (o.rim) h += yRim(hc[0], hc[1], 112, o.rim[0], o.rim[1], o.rim[2]);
  if (o.hold) {   // phone in his right hand (raised → laid down)
    const pz = typeof z.pose === 'string' ? P[z.pose] : z.pose, hp = ptOf(z.x, z.y, 1.0, pz && pz.hR ? pz.hR[0] : 336, pz && pz.hR ? pz.hR[1] : 250);
    if (o.hold.k < 0.6) h += yPhoneBack(hp[0] + 4, hp[1] - 40, 1, 8 + 40 * o.hold.k, 1 - o.hold.k);
  }
  h += yDeskFront() + yLamp(YX - 380, o.lamp == null ? 1 : o.lamp) + smCup(YX + 345, YTOP - 14, 0.9);
  if (o.phone !== false) { const ph = o.phone || {}; h += yDeskPhone(YX + 205, YTOP - 6, Object.assign({ t }, ph)); }
  if (o.lap !== false) h += yLaptop(YX, YTOP + 2, lid, lit) + (lit && lid > 0.6 ? yLight(YX, YTOP - 158) : '');
  return h;
}
const yNightRoom = (t, cam, o = {}) => smRoom(t, cam, Object.assign({ sat: 0.85, night: 1, plant: { droop: 0, green: 1 } }, o));

/* ---------- the phone filling the frame, held by one hand from below (no arm across the screen) ---------- */
function yPhoneUI(t, o) {
  const T = (x, y, s, c, txt, w = 900, a = '') => `<text x="${x}" y="${y}" font-family="${FONT}" font-weight="${w}" font-size="${s}" fill="${c}"${a}>${esc(txt)}</text>`;
  let u = '';
  if (o.mode === 'list') {
    u += `<rect x="-166" y="-306" width="332" height="612" rx="26" fill="#F2F4F8"/><rect x="-166" y="-306" width="332" height="78" fill="#2E4A6E"/>` + T(-140, -254, 34, '#fff', '채팅');
    const rows = [['소라', '생일에 떡볶이 사 줘라', ''], ['동창 단톡방', '', '999+'], ['회사 단톡방', '', '128'], ['엄마', '', '3']];
    rows.forEach(([n, pv, c], i) => {
      const y0 = -214 + i * 112, av = ['#FF8FB1', '#8FA7C9', '#A7B0BE', '#C9A78F'][i];
      u += `<rect x="-156" y="${y0}" width="312" height="100" rx="18" fill="${i ? '#fff' : '#FFF6DA'}" stroke="${i ? '#D5DCE6' : '#F2C14E'}" stroke-width="${i ? 3 : 3 + 5 * (o.hl || 0)}"/><circle cx="-114" cy="${y0 + 50}" r="30" fill="${av}"/>` + T(-72, y0 + 44, 31, INK, n);
      u += pv ? T(-72, y0 + 80, 18, '#5E6672', pv, 700) : `<rect x="-72" y="${y0 + 64}" width="${100 + i * 14}" height="12" rx="6" fill="#D5DCE6"/>`;
      if (c) u += `<circle cx="116" cy="${y0 + 50}" r="${c.length > 2 ? 34 : 24}" fill="#E5484D"/>` + T(116, y0 + 59, c.length > 2 ? 23 : 28, '#fff', c, 900, ' text-anchor="middle"');
      if (!i) u += `<g transform="translate(128 ${y0 + 26}) rotate(30)"><circle r="9" fill="#E5484D"/><path d="M0 8 L0 24" stroke="#5E6672" stroke-width="4"/></g>`;
    });
    if (o.tap != null && o.tap > 0 && o.tap < 0.4) { const k = o.tap / 0.4; u += `<circle cx="-20" cy="-164" r="${f1(16 + 90 * k)}" fill="#3E6FB0" opacity="${f1((1 - k) * 0.35 * 100) / 100}"/>`; }
  } else if (o.mode === 'chat') {
    u += `<rect x="-166" y="-306" width="332" height="612" rx="26" fill="#DCE6F2"/><rect x="-166" y="-306" width="332" height="78" fill="#2E4A6E"/>` + T(-150, -254, 36, '#fff', '‹') + `<circle cx="-92" cy="-266" r="20" fill="#FF8FB1"/>` + T(-62, -254, 34, '#fff', '소라');
    u += `<rect x="-52" y="-212" width="104" height="34" rx="17" fill="#C3CEDD"/>` + T(0, -187, 20, '#4A5466', '오늘', 900, ' text-anchor="middle"');
    u += `<circle cx="-136" cy="-138" r="20" fill="#FF8FB1"/><rect x="-106" y="-160" width="236" height="100" rx="22" fill="#fff" stroke="#C3CEDD" stroke-width="3"/>` + T(-88, -118, 29, INK, '생일에 떡볶이') + T(-88, -78, 29, INK, '사 줘라 ㅋㅋ');
    const k = clamp(o.sent || 0, 0, 1);
    if (k > 0) u += `<g transform="translate(96 4) scale(${f1(easeOutBack(k) * 1000) / 1000}) translate(-96 -4)"><rect x="40" y="-30" width="112" height="64" rx="22" fill="#FFE14D" stroke="#E0B800" stroke-width="3"/>` + T(62, 14, 32, INK, 'ㅇㅋ') + `</g>`;
    u += `<rect x="-156" y="236" width="312" height="56" rx="28" fill="#fff" stroke="#C3CEDD" stroke-width="3"/>`;
  } else if (o.mode === 'search') {
    u += `<rect x="-166" y="-306" width="332" height="612" rx="26" fill="#F2F4F8"/><rect x="-150" y="-272" width="300" height="66" rx="33" fill="#fff" stroke="#8A93A6" stroke-width="4"/><circle cx="-112" cy="-241" r="15" fill="none" stroke="#8A93A6" stroke-width="5"/><path d="M-101 -230 L-90 -219" stroke="#8A93A6" stroke-width="5" stroke-linecap="round"/>`;
    const q = '세상이 코드라면', n = Math.floor(clamp(o.k / 1.1, 0, 1) * q.length);
    u += T(-78, -228, 31, INK, q.slice(0, n) + (Math.floor(t * 2.5) % 2 ? '|' : ''));
    for (let i = 0; i < 5; i++) u += `<rect x="-140" y="${-160 + i * 60}" width="${220 - (i % 3) * 40}" height="16" rx="8" fill="#D5DCE6"/>`;
  } else if (o.mode === 'result') {
    const k = easeOut(clamp(o.k / 0.35, 0, 1));
    u += `<rect x="-166" y="-306" width="332" height="612" rx="26" fill="#fff"/><g transform="translate(0 ${f1(24 * (1 - k))})" opacity="${f1(k * 100) / 100}">` + T(-146, -252, 17, '#3E6FB0', 'simulation-argument.com', 700) +
      T(-146, -196, 33, '#1A3E8C', 'Are You Living') + T(-146, -154, 33, '#1A3E8C', 'in a Computer') + T(-146, -112, 33, '#1A3E8C', 'Simulation?') + T(-146, -62, 22, '#5A606C', 'Nick Bostrom · 2003', 700) +
      [0, 1, 2, 3, 4, 5].map(i => `<rect x="-146" y="${-20 + i * 40}" width="${290 - (i % 3) * 50}" height="14" rx="7" fill="#D5DCE6"/>`).join('') + `</g>`;
  }
  return u;
}
function yBigPhone(t, o = {}) {
  const fl = clamp(o.flip || 0, 0, 1), sx = Math.cos(fl * Math.PI), sc = 1.1;
  let h = smDefs() + yNightRoom(t, [YX + 120, 840, 2.4], { sat: 0.55, blur: true, depth: 0.3 }) + smFull('#0B1230', 0.4) + `<ellipse cx="520" cy="330" rx="560" ry="400" fill="#FFE3B0" opacity=".08"/>`;
  h += `<g transform="translate(960 500) rotate(-4) scale(${f1(sx * sc * 1000) / 1000} ${sc})">`;
  h += sx > 0 ? `<rect x="-190" y="-340" width="380" height="680" rx="44" fill="#20232A" stroke="${INK}" stroke-width="10"/>` + yPhoneUI(t, o)
    : `<rect x="-190" y="-340" width="380" height="680" rx="44" fill="#3A3F4A" stroke="${INK}" stroke-width="10"/><circle cx="-110" cy="-260" r="26" fill="#20232A"/>`;
  h += `</g>`;
  // one hand holds it at the lower right: a short sleeve straight up from the bottom edge, a mitten over the corner
  const hy = 900 + (o.handIn != null ? 260 * (1 - easeOut(clamp(o.handIn, 0, 1))) : 0);
  h += `<path d="M1142 1200 L1150 ${hy + 40}" stroke="${INK}" stroke-width="150" stroke-linecap="round"/><path d="M1142 1200 L1150 ${hy + 40}" stroke="${SM_ORANGE}" stroke-width="134" stroke-linecap="round"/><ellipse cx="1166" cy="${hy - 14}" rx="74" ry="64" fill="#fff" stroke="${INK}" stroke-width="11"/>`;
  return h + smFull('#0B1230', 0.06);
}

/* ================= c1~c4 ================= */
window.ycoldScene = function (t, lt, a) {
  const id = a._id || '', D = a._dur || 3, typ = Math.sin(t * 26) * 4;
  if (id === 'c1') {
    const tF = Math.min(2.75, smAt(a, '친구', 2.6) - 0.3);
    if (lt < tF) {   // wide: typing at his desk; the phone on the desk buzzes — 999+ — and he doesn't even look
      const cam = qLerpCam(lt / tF, [YX - 60, 780, 1.28], [YX - 60, 774, 1.36]), on = lt > 0.9;
      const ch = yDesk(t, { z: { pose: yType('sm랩톱', typ), ex: xEx('z기본'), look: [0, 0.6] }, phone: { badge: on ? '999+' : null, buzz: lt > 0.9 && lt < 1.6, glow: on ? 0.3 : 0 } });
      return smDefs() + yNightRoom(t, cam) + qCam(cam, ch);
    }
    // insert: he picks it up — every room unread, except the pinned one: 소라
    const tTap = smAt(a, '소라', 3.5) + 0.45;
    if (lt < tTap + 0.25) return yBigPhone(t, { mode: 'list', hl: clamp((lt - smAt(a, '소라', 3.5)) / 0.3, 0, 1), tap: lt - tTap, handIn: (lt - tF) / 0.3 });
    return yBigPhone(t, { mode: 'chat', sent: (lt - tTap - 0.55) / 0.25 });   // her room: he answers at once
  }
  if (id === 'c2') {
    const tS = smAt(a, '작은', 0.5 * D), tM = 0.5;
    if (lt < tM) return yBigPhone(t, { mode: 'chat', sent: 1 });
    if (lt < tS - 0.15) {   // MS, lamp light from the left: he smiles at her message, then lays the phone face down
      const k = lt - tM, dn = easeInOut(clamp((k - 0.75) / 0.35, 0, 1)), cam = qLerpCam(k / 1.4, [YX + 60, 712, 1.8], [YX + 60, 708, 1.86]);
      const z = { pose: mixPose('y폰들기', 'y폰놓기', dn), ex: exprAt([[0, 'z기본'], [0.25, 'z설렘']], k), look: dn < 0.5 ? [0.75, -0.15] : [0.5, 0.6], tilt: 4 * (1 - dn) };
      return smDefs() + yNightRoom(t, cam, { blur: true, depth: 0.3 }) + qCam(cam, yDesk(t, { z, rim: ['L', '#FFD9A0', 0.3], hold: { k: dn }, phone: dn >= 0.6 ? {} : false }));
    }
    return yScreen(yGame(t, lt) + yEditor(null, '', 0, false, { big: 1 }));
  }
  if (id === 'c3') return yV1.cold(t, lt, a);
  // c4: MCU from the lamp side — "소라라면 이런 말, 절대 안 하겠지." a little laugh
  const cam = qLerpCam(lt / D, [YX - 170, 726, 1.66], [YX - 170, 720, 1.74]), lau = lt > D * 0.6 ? Math.abs(Math.sin((lt - D * 0.6) * 10)) * Math.exp(-(lt - D * 0.6) * 2) : 0;
  const z = { y: YY - 4 * lau, sy: 1 + 0.03 * lau, pose: yType('sm랩톱', lt < D * 0.55 ? typ : 0), ex: xTalk(a, 'Z', lt < D * 0.6 ? 'z히죽' : 'z빵긋', t), look: [0, 0.5] };
  return smDefs() + yNightRoom(t, cam, { blur: true, depth: 0.3 }) + qCam(cam, yDesk(t, { z, rim: ['L', '#FFD9A0', 0.32], phone: {} }));
};

/* ================= m3: memory 2 s → two-shot → CU Sora waiting ================= */
window.ymornScene = function (t, lt, a) {
  if (a._id !== 'm3') return yV1.morn(t, lt, a);
  const D = a._dur || 7, tB = smAt(a, '아무', 0.68 * D) - 0.2;
  if (lt < 2.0) return yScreen(smFx('ymem', 0.25) + `<g filter="url(#ymem)">` + yGame(t, 2, { say: Y0 }) + yEditor('도트 소라 · 인사 대사', Y0, 99, false, { fs: 48 }) + `</g>`) + smFull('#E8E2D0', 0.12) + smGlitch(t, lt < 0.15 || lt > 1.9 ? 0.6 : 0, 8);
  if (lt < tB) {   // two-shot: he sweats; she tilts her head, waiting
    const k = lt - 2.0, cam = qLerpCam(k / 3, [XZX + 150, 780, 1.7], [XZX + 160, 776, 1.8]);
    let ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY, s: 1.0, pose: 'sm컵', ex: xEx('z당황'), look: [0.8, -0.05], shiver: true, sweat: true }) + xCupHand(XZX, SMY);
    ch += qShadow(XSX, SMY, 66) + flip(XSX, xSora(t, { x: XSX, y: SMY, s: 0.97, pose: '서기', tilt: 6 + xIdleTilt(t, 2), ex: xEx('z기본'), look: [0.9, 0] }));
    return smDefs() + smPlate('cross', cam) + qCam(cam, ch) + smMorning(0.9);
  }
  // CU Sora: innocent, blinking, waiting for him to say something
  const cam = qLerpCam((lt - tB) / 2.6, [XSX - 40, 770, 2.0], [XSX - 40, 764, 2.1]);
  const ch = qShadow(XSX, SMY, 66) + flip(XSX, xSora(t, { x: XSX, y: SMY, s: 0.97, pose: '서기', tilt: 8 + xIdleTilt(t, 2), ex: exprAt([[0, 'z기본'], [1.2, 'z의심']], lt - tB), look: [0.9, 0] }));
  return smDefs() + smPlate('cross_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.8);
};

/* ================= u1 at the desk / u3 the umbrella comes from far away ================= */
window.yumbScene = function (t, lt, a) {
  const id = a._id || '', D = a._dur || 2;
  if (id === 'u1') {
    const tT = smAt(a, '시험', 0.6 * D);
    if (lt >= tT - 0.1) return yV1.umb(t, lt, a);
    const cam = qLerpCam(lt / tT, [YX + 20, 724, 1.86], [YX + 20, 718, 1.96]);   // chin on hand at the desk (z의심 → z결심)
    return smDefs() + yNightRoom(t, cam, { blur: true, depth: 0.3 }) + qCam(cam, yDesk(t, { z: { pose: 'sm턱', tilt: 5, ex: exprAt([[0, 'z의심'], [tT - 0.9, 'z결심']], lt), look: [-0.4, -0.3] }, rim: ['L', '#FFD9A0', 0.28], phone: {} }));
  }
  if (id !== 'u3') return yV1.umb(t, lt, a);
  if (lt < 0.9) {   // MCU: coffee in hand, he squints down the street
    const cam = qLerpCam(lt / 0.9, [XZX + 20, 800, 2.15], [XZX + 20, 796, 2.2]);
    const ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY, s: 1.0, pose: 'sm컵', ex: exprAt([[0, 'z기본'], [0.35, 'z의심']], lt), look: [0.95, -0.12] }) + xCupHand(XZX, SMY);
    return smDefs() + smPlate('cross_c', cam, 0.3, { blur: true }) + qCam(cam, ch) + smMorning(0.9) + smFull('#FFF6D0', 0.1);
  }
  // wide: far down the street a yellow dot — bobbing closer (perspective: scale grows with the distance to the horizon)
  const k = lt - 0.9, u = clamp(k / (D - 0.9), 0, 1), cam = qLerpCam(u, [1280, 740, 1.12], [1340, 732, 1.22]);
  const YH = 700, s = lerp(0.1, 0.72, Math.pow(u, 1.6)), sy = YH + (SMY - YH) * s / 0.97, sx = 1590 + 150 * s / 0.97, bob = Math.abs(Math.sin(k * 8)) * 6 * s;
  let ch = qShadow(XZX, SMY, 70) + xZero(t, { x: XZX, y: SMY, s: 1.0, pose: 'sm컵', ex: xEx('z의심'), look: [0.95, -0.1] }) + xCupHand(XZX, SMY);
  const hp = ptOf(sx, sy - bob, s, 302, 196);
  ch += qShadow(sx, sy, 60 * s) + flip(sx, xSora(t, { x: sx, y: sy - bob, s, pose: Object.assign({}, walkPose(k * 10, 0.5), { armR: P['y우산'].armR, hR: P['y우산'].hR }), ex: xEx('z빵긋'), look: [0.9, 0] })) + yUmbrella(2 * sx - hp[0], hp[1], 0.95 * s / 0.97, -6 + Math.sin(k * 8) * 3);
  return smDefs() + smPlate('cross', cam) + qCam(cam, ch) + smMorning(1) + smFull('#FFF6D0', 0.12);
};

/* ================= b1, b2 ================= */
function yScreens(t, k, seed = 0) {   // a field of little screens (other worlds) popping in from the centre outward, k 0..1
  let h = '';
  for (let i = 0; i < 24; i++) for (let j = 0; j < 12; j++) {
    const x = -240 + i * 100 + (j % 2) * 50, y = -160 + j * 112, d = Math.hypot(x - 960, y - 520); if (d < 250) continue;
    const kk = clamp(k * 1.8 - d / 1500, 0, 1); if (kk <= 0) continue;
    h += `<rect x="${x - 36}" y="${y - 23}" width="72" height="46" rx="5" fill="#1E3350" stroke="#5E87B8" stroke-width="3" opacity="${f1(kk * 0.9 * 100) / 100}"/><rect x="${x - 30}" y="${y - 17}" width="60" height="34" rx="3" fill="${['#9FD8FF', '#FFD27A', '#8CCB9B', '#F2A65A'][(i + j + seed) % 4]}" opacity="${f1(kk * 0.35 * 100) / 100}"/>`;
  }
  return h;
}
window.ynightScene = function (t, lt, a) {
  const id = a._id || '', D = a._dur || 3;
  if (id === 'b1') {
    const tS = 1.7, tC = tS + 2.0, tA = smAt(a, '언젠가', 0.45 * D) - 0.15, tB = smAt(a, '우리도', 0.78 * D) - 0.15, tP = smAt(a, '컴퓨터', 0.54 * D), tM = smAt(a, '없이', smAt(a, '수없이', 0.66 * D));
    if (lt < tS) return yBigPhone(t, { mode: 'search', k: lt - 0.15 });
    if (lt < tC) return yBigPhone(t, { mode: 'result', k: lt - tS });
    if (lt < tA) {   // MS: he reads it on the phone held up beside his face (lamp light from the left)
      const k = lt - tC, cam = qLerpCam(k / (tA - tC), [YX + 60, 712, 1.8], [YX + 60, 704, 1.92]);
      const z = { pose: 'y폰들기', ex: exprAt([[0, 'z의심'], [Math.max(0.6, smAt(a, '내놓', 5.0) - tC), 'z멍']], k), look: [0.75, -0.15], tilt: 4 };
      return smDefs() + yNightRoom(t, cam, { blur: true, depth: 0.3 }) + qCam(cam, yDesk(t, { z, rim: ['L', '#FFD9A0', 0.3], hold: { k: 0 }, phone: false }));
    }
    if (lt < tB) {   // concept: one world in a screen → a few → countless (개념도)
      const k = lt - tA, n2 = clamp((lt - tP) / 0.5, 0, 1), many = clamp((lt - tM + 0.2) / 1.6, 0, 1), z = lerp(1, 0.78, easeInOut(many));
      let h = smDefs() + smPlate('space', [960, 560, 1.05], 0.2) + smFull('#000014', 0.25) + `<g transform="translate(960 520) scale(${f1(z * 1000) / 1000}) translate(-960 -520)">` + yScreens(t, many * 0.9, 1);
      const side = [['park', -560, -40], ['cross', 560, -40], ['kitchen', 0, -330]];
      side.forEach(([pk, dx, dy], i) => { const e = easeOutBack(clamp(n2 * 1.6 - i * 0.3, 0, 1)); if (e > 0) h += `<g transform="translate(${960 + dx} ${520 + dy}) scale(${f1(e * 1000) / 1000}) translate(${-960 - dx} ${-520 - dy})">` + smLapScreen(960 + dx, 520 + dy, 420, smPlate(pk, [960, 560, 1.0], 0.5)) + `</g>`; });
      h += smLapScreen(960, 540 + 40 * (1 - easeOut(clamp(k / 0.5, 0, 1))), lerp(900, 640, n2), yGame(t, lt)) + `</g>`;
      return h + (k > 0.5 ? smTag(1700, 960, '개념도') : '');
    }
    // ...and his own room, at his desk, is one of them
    const k = clamp((lt - tB) / Math.max(1.5, D - tB), 0, 1), e = easeInOut(k), w = lerp(2100, 420, e);
    const rc = [YX - 160, 740, 1.2], room = yNightRoom(t, rc) + qCam(rc, yDesk(t, { z: { ex: xEx('z멍'), look: [0, 0.5] }, phone: {} }));
    return smDefs() + smPlate('space', [960, 560, 1.05], 0.2) + smFull('#000014', 0.2) + yScreens(t, 0.6 + 0.4 * e) + smLapScreen(960, 520, w, room) + (k > 0.3 ? smTag(1700, 960, '개념도') : '');
  }
  // b2: cut 1 — ECU, the screen's cold light from below; cut 2 — the screen: pixel Sora, an empty line, and his face reflected in it
  const tR = smAt(a, '내가', 0.33 * D) - 0.12, tW = smAt(a, '쓰는', 0.6 * D);
  if (lt < tR) {
    const cam = qLerpCam(lt / tR, [YX + 30, 650, 2.55], [YX + 30, 646, 2.65]);
    return smDefs() + yNightRoom(t, cam, { sat: 0.6, blur: true, depth: 0.3 }) + qCam(cam, yDesk(t, { z: { ex: xTalk(a, 'Z', 'z의심', t), look: [0, 0.5] }, rim: ['B', '#BFE8FF', 0.34], lamp: 0.4, phone: {} })) + smFull('#0B1230', 0.12);
  }
  const refl = `<defs><clipPath id="yrefl"><circle cx="960" cy="306" r="250"/></clipPath></defs><g opacity=".3" clip-path="url(#yrefl)">` + xZero(t, { x: 960, y: 1250, s: 2.2, pose: 'sm랩톱', ex: xTalk(a, 'Z', lt < tW ? 'z의심' : 'z히죽', t), look: [0, 0.3], tilt: lt > tW ? -5 : 0 }) + `</g>`;
  return yScreen(yGame(t, lt) + yEditor('도트 소라 · 내일 할 일', '', 0, Math.floor(t * 2.5) % 2 === 0) + refl);
};

/* ================= p1~p11 ================= */
const YNIGHTS = [['월요일 밤', '소라는 지각하지 않는다.'], ['화요일 밤', '소라는 내 이모티콘에 답한다.'], ['수요일 밤', '소라는 오늘 기분이 좋다.'], ['목요일 밤', '소라는 제로의 농담에 크게 웃는다.'], ['금요일 밤', '소라는 오늘 떡볶이를 산다.']];
const yNightList = (n, flipK = 1) => {   // the growing list of lines he has written, and tonight's date chip
  const day = YNIGHTS[Math.min(n, YNIGHTS.length - 1)][0];
  let h = `<g transform="translate(1250 40)"><rect x="0" y="0" width="610" height="${70 + Math.max(1, n) * 52}" rx="16" fill="#0E1626" opacity=".86" stroke="#FF8FB1" stroke-width="4"/><text x="24" y="46" font-family="${FONT}" font-weight="900" font-size="30" fill="#FF8FB1">지금까지 쓴 대사</text>`;
  for (let i = 0; i < n; i++) h += `<text x="24" y="${100 + i * 52}" font-family="${FONT}" font-weight="900" font-size="30" fill="#fff"><tspan fill="#8CCB9B">✓ </tspan>${esc(YNIGHTS[i][1])}</text>`;
  h += `</g><g transform="translate(260 205) scale(1 ${f1(Math.max(0.05, Math.abs(Math.cos((1 - flipK) * Math.PI))) * 100) / 100})"><rect x="-150" y="-40" width="300" height="80" rx="14" fill="#F4F6FA" stroke="${INK}" stroke-width="5"/><rect x="-150" y="-40" width="300" height="22" rx="10" fill="#E5484D"/><text x="0" y="30" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="${INK}">${day}</text></g>`;
  return h;
};
const yKing = (x, y, fall, s = 1) => {   // a pixel king (cell 10); fall 0..1 tips him over to the right around his feet
  const c = 10, px = (cx, cy, w, hh, col) => `<rect x="${cx * c}" y="${cy * c}" width="${w * c}" height="${hh * c}" fill="${col}"/>`;
  const g = px(-3, -17, 1, 2, '#FFD23F') + px(-1, -18, 2, 3, '#FFD23F') + px(2, -17, 1, 2, '#FFD23F') + px(-3, -15, 6, 1, '#FFD23F') + px(-3, -14, 6, 5, '#FFE0C2') + px(-2, -12, 1, 1, '#141418') + px(1, -12, 1, 1, '#141418') + px(-1, -10, 2, 1, '#B5654A') +
    px(-4, -9, 8, 7, '#D8433C') + px(-4, -9, 8, 1, '#FFFFFF') + px(-3, -2, 2, 2, '#141418') + px(1, -2, 2, 2, '#141418');
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s}) rotate(${f1(fall * 90)})" shape-rendering="crispEdges">${g}</g>`;
};
P['y웃음탕'] = smPose('서기', { armL: [[148, 285], [140, 342], [178, 376]], hL: [182, 378], armR: [[252, 285], [300, 296], [312, 246]], hR: [314, 240] });   // right hand up...
P['y웃음탕2'] = smPose('서기', { armL: [[148, 285], [140, 342], [178, 376]], hL: [182, 378], armR: [[252, 285], [298, 342], [302, 392]], hR: [304, 398] });   // ...slaps the table
// the BIG laugh — identical both times: leans back, slaps the table four times, tears fly
const ySlap = l => { const ts = [0.45, 0.8, 1.15, 1.5]; let best = 1; ts.forEach(s0 => { const d = l - s0; if (d > -0.18 && d < 0.12) best = Math.min(best, d < 0 ? -d / 0.18 : d / 0.12); }); return 1 - best; };   // 1 = hand on the table
function yBigLaugh(t, l, a, cam) {
  const back = easeOut(clamp(l / 0.35, 0, 1)) * (1 - 0.6 * easeIn(clamp((l - 2.6) / 0.8, 0, 1))), sl = ySlap(l), sh = Math.sin(l * 22);
  const pose = mixPose('y웃음탕', 'y웃음탕2', sl), y = SMBY - 10 * back + 3 * Math.abs(sh);
  let ch = xSoraSeat(t, { y, sy: 1 + 0.03 * sh, rot: 9 * back + 2 * sh, tilt: -12 * back + 4 * sh, pose, ex: xTalk(a, 'S', 'z빵긋', t), look: [-0.6, -0.2], still: true, noBlink: true });
  const hc = ptOf(SMBF, y, 1.0, 200, 150);
  if (l > 0.3 && l < 3.2) for (let i = 0; i < 2; i++) for (const sd of [-1, 1]) {   // tears
    const ph = ((l * 2.2 + i * 0.5) % 1), x = hc[0] + sd * (70 + 120 * ph), yy = hc[1] - 10 - 60 * ph + 140 * ph * ph;
    ch += `<path d="M${f1(x)} ${f1(yy - 14)} q-9 14 0 20 q9 -6 0 -20" fill="#9FD8FF" stroke="${INK}" stroke-width="3" opacity="${f1((1 - ph) * 100) / 100}"/>`;
  }
  let h = yBun(t, cam, ch, { blur: true });
  if (sl > 0.85) { const p = smScr(cam, SMBF + 104, SMBEDGE); h += speedLines(p[0], p[1], 50, 110, 8, t, '#fff', 0.8); }
  return h;
}
window.ytemptScene = function (t, lt, a) {
  const id = a._id || '', D = a._dur || 2, typ = Math.sin(t * 26) * 4;
  if (id === 'p1') {
    if (lt < 1.4) {   // wide: night after night at the desk
      const cam = qLerpCam(lt / 1.4, [YX - 140, 740, 1.12], [YX - 140, 736, 1.16]);
      return smDefs() + yNightRoom(t, cam) + qCam(cam, yDesk(t, { z: { pose: yType('sm랩톱', typ), ex: xEx('z히죽'), look: [0, 0.6] }, phone: {} }));
    }
    const k = lt - 1.4, per = (D - 1.4) / 3, n = Math.min(2, Math.floor(k / per)), kk = k - n * per, TXT = YNIGHTS[n][1], m = Math.floor(clamp(kk / (per * 0.75), 0, 1) * [...TXT].length);
    return yScreen(yGame(t, lt) + yEditor('도트 소라 · 내일 할 일', TXT, m, m < [...TXT].length) + yNightList(n, clamp(kk / 0.18, 0, 1)));
  }
  if (id === 'p2' || id === 'p5') {
    const n = id === 'p2' ? 3 : 4, TXT = YNIGHTS[n][1], m = Math.floor(clamp(lt / (D - 0.4), 0, 1) * [...TXT].length);
    return yScreen(yGame(t, lt) + yEditor('도트 소라 · 내일 할 일', TXT, m, true) + yNightList(n, clamp(lt / 0.18, 0, 1)));
  }
  if (id === 'p3') {   // the dad joke, drawn in a thought bubble: a pixel king falls — 꽈당 — "킹" + "콩!"
    const tW = smAt(a, '왕이', 0.25 * D) - 0.1, tF = smAt(a, '넘어', 0.4 * D) + 0.25, tK = smAt(a, '킹콩', 0.75 * D), cam = qLerpCam(lt / D, [960, 720, 1.18], [960, 714, 1.24]);
    let ch = xZeroSeat(t, { pose: lt > tK - 0.2 ? '가리킴' : '서기', sy: xPop(lt, tK), ex: xTalk(a, 'Z', lt < tK ? 'z히죽' : 'z빵긋', t) });
    ch += xSoraSeat(t, { pose: 'x포크', ex: xEx(lt > tK ? 'z멍' : 'z기본'), look: [-0.8, 0.1], tilt: xIdleTilt(t, 3) });
    let h = yBun(t, cam, ch, { pan: true });
    const bk = easeOutBack(clamp((lt - tW) / 0.3, 0, 1));
    if (bk > 0) {
      const fall = easeIn(clamp((lt - tF) / 0.35, 0, 1)), bump = lt > tF + 0.35 ? Math.exp(-(lt - tF - 0.35) * 8) * Math.sin((lt - tF - 0.35) * 30) * 0.06 : 0;
      h += `<g transform="translate(600 210) scale(${f1(bk * 1000) / 1000})"><circle cx="-60" cy="190" r="14" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-30" cy="160" r="20" fill="#fff" stroke="${INK}" stroke-width="5"/>` +
        `<rect x="-220" y="-150" width="440" height="290" rx="60" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-170" y="70" width="340" height="12" fill="#8CCB9B"/>` + yKing(-20, 70, fall - bump, 1.1);
      if (lt > tF + 0.35) { const s0 = clamp((lt - tF - 0.35) / 0.2, 0, 1); h += `<g transform="translate(150 20) scale(${f1(easeOutBack(s0) * 100) / 100})"><path d="M0 -40 L12 -12 L42 -14 L18 6 L28 34 L0 18 L-28 34 L-18 6 L-42 -14 L-12 -12 Z" fill="#FFD23F" stroke="${INK}" stroke-width="5"/></g>`; }
      if (lt > tK) { const s1 = easeOutBack(clamp((lt - tK) / 0.25, 0, 1)); h += `<g transform="scale(${f1(s1 * 100) / 100})"><text x="-150" y="-60" font-family="${FONT}" font-weight="900" font-size="64" fill="#D8433C" stroke="${INK}" stroke-width="3">킹</text><text x="70" y="-60" font-family="${FONT}" font-weight="900" font-size="64" fill="#E0A800" stroke="${INK}" stroke-width="3">콩!</text></g>`; }
      h += `</g>`;
    }
    return h;
  }
  if (id === 'p4' || id === 'p8') {   // the laugh — exactly the same both times; the second one starts with a 2-frame rewind tear
    let h = yBigLaugh(t, lt, a, [SMBF - 10, 676, 1.85]);
    if (id === 'p8') {
      h += smFull('#0A1030', 0.06);
      if (lt < 0.085) h += smFull('#7C8494', 0.35) + [0, 1, 2, 3, 4, 5].map(i => `<rect x="-300" y="${80 + i * 170 + (Math.floor(t * 24) % 2) * 40}" width="2600" height="26" fill="#C9CED8" opacity=".75"/>`).join('') + `<text x="1700" y="140" font-family="${FONT}" font-weight="900" font-size="64" fill="#fff">◀◀</text>`;
    }
    return h;
  }
  if (id === 'p11') {   // the screen: pixel Sora whips round once → wide: he slams the lid; the light goes out of the room
    if (lt < 1.4) return yScreen(yGame(t, lt, { whip: lt - 0.5 }));
    const k = lt - 1.4, reach = easeOut(clamp(k / 0.14, 0, 1)), shut = easeIn(clamp((k - 0.14) / 0.14, 0, 1)), lid = 1 - shut, cam = qLerpCam(k / 1.3, [YX - 40, 770, 1.42], [YX - 40, 766, 1.48]);
    const hyy = shut > 0 ? lerp(244, 386, shut) : lerp(394, 244, reach);   // hands up onto the lid's top edge, then down with it
    const pose = smPose('sm랩톱', { armL: [[148, 285], [118, 330], [176, hyy]], hL: [176, hyy], armR: [[252, 285], [282, 330], [224, hyy]], hR: [224, hyy] });
    let ch = yDesk(t, { z: { pose, ex: xEx(k < 0.35 ? 'z당황' : 'z멍'), look: [0, 0.5], sweat: true }, lid, lit: lid > 0.05 ? 1 : 0, lamp: 1, phone: {} });
    if (shut >= 1 && k < 0.6) { const p = [YX, YTOP - 20]; ch += speedLines(p[0], p[1], 150, 230, 12, t, '#fff', 0.7 * (1 - (k - 0.28) / 0.32)); }
    return smDefs() + yNightRoom(t, cam, { sat: 0.7 }) + qCam(cam, ch) + smFull('#000', 0.38 * shut);
  }
  return yV1.tempt(t, lt, a);
};
