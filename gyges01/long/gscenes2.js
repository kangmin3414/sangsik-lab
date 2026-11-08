/* 기게스의 반지 편 — 본편 2부(p1~e7): 유혹 · 대가 · 소라 · 거울 · 손 · 열린 결말.
   gscenes.js 뒤에 읽는다. 샘플 점검(review/기게스_샘플_점검.md) 기준을 그대로 지킨다: 앉은 사람은 GSY, 탁자 GTY,
   우산 든 손은 'g우산', 투명한 제로는 그림자 없음, 밤 장면 인물은 gNite, 물건은 손 위·탁자 위에. */
Object.assign(QBG, { bath: 'ai/bath.png' });
['goffice', 'gblame', 'gsora', 'gmirror', 'ghand', 'gend', 'gcard'].forEach(k => CAMS[k] = 'fixed');
P['g팔짱'] = smPose('서기', { armL: [[148, 285], [176, 330], [236, 318]], hL: [240, 316], armR: [[252, 285], [224, 334], [166, 322]], hR: [162, 320] });
P['g손끝'] = smPose('서기', { armR: [[252, 285], [304, 170], [314, 34]], hR: [316, 22] });            // the hand, all the way up (above the head)
P['g상자'] = smPose('서기', { armL: [[148, 285], [128, 340], [150, 388]], hL: [152, 392], armR: [[252, 285], [272, 340], [250, 388]], hR: [248, 392] });
P['g가리킴R'] = smPose('서기', { armR: [[252, 285], [306, 266], [356, 248]], hR: [364, 244] });
P['gUSB'] = smPose('서기', { armR: [[252, 285], [298, 318], [282, 268]], hR: [280, 262] });
P['g노트북'] = smPose('서기', { armL: [[148, 285], [140, 340], [172, 352]], hL: [176, 354], armR: [[252, 285], [260, 340], [228, 352]], hR: [224, 354] });
const gBox = (x, y, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-80" y="-60" width="160" height="100" rx="6" fill="#C9A06A" stroke="${INK}" stroke-width="6"/><path d="M-80 -60 L-60 -86 L60 -86 L80 -60" fill="#B78E58" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="-40" y="-92" width="22" height="40" fill="#F3EEE2" stroke="${INK}" stroke-width="4"/><circle cx="34" cy="-92" r="16" fill="#8CCB9B" stroke="${INK}" stroke-width="4"/></g>`;
const gUSB = (x, y) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(-20)"><rect x="-12" y="-40" width="24" height="40" rx="4" fill="#3E6FB0" stroke="${INK}" stroke-width="4"/><rect x="-7" y="-52" width="14" height="14" fill="#C9D0DC" stroke="${INK}" stroke-width="3"/></g>`;
const gLaptopHeld = (x, y) => `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="-70" y="-6" width="140" height="12" rx="4" fill="#8A90A0" stroke="${INK}" stroke-width="5"/><path d="M-62 -6 L-70 -96 L70 -96 L62 -6 Z" fill="#5A6070" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>`;
// meeting-room staging: seated people (chairs, GSY) behind the table, standing people on the floor to the left of it
function gStage(t, o = {}) {
  let h = '';
  (o.seats || []).forEach(([x, fn, oo]) => { h += gChairB(x, GSY) + (fn ? fn(t, Object.assign({ x, y: GSY, s: 1.0, pose: '서기', look: [-0.85, 0.05] }, oo || {})) : ''); });
  h += gTable() + (o.notes || []).map(gNote).join('') + `<g><rect x="930" y="${GTY - 74}" width="130" height="60" rx="10" fill="#3A4252" stroke="${INK}" stroke-width="6"/><circle cx="948" cy="${GTY - 44}" r="16" fill="#FFF6C8" stroke="${INK}" stroke-width="5"/></g>`;
  (o.stand || []).forEach(([x, fn, oo, extra]) => { h += qShadow(x, GFY, 70) + fn(t, Object.assign({ x, y: GFY, s: 1.0, pose: '서기', look: [0.8, 0] }, oo || {})) + (extra || ''); });
  return h;
}
const gMeetZ = (t, cam, ch, o = {}) => gMeet(t, cam, ch, o) + (o.warm ? smFull('#FFD9A0', 0.08 * o.warm) : '');

/* ================= p1~p3: the office · the night ================= */
const gOffice = (t, cam, ch, o = {}) => smDefs() + gDefs() + smPlate('office', cam, 0.55, o.blur ? { blur: true } : {}) + (o.night ? smFull('#070B1A', 0.62) : '') + qCam(cam, o.night ? gNite(ch) : ch) + (o.night ? '' : smFull('#E8F2FF', 0.05));
const gODesk = (x, top, w = 560) => `<ellipse cx="${x}" cy="${GFY + 66}" rx="${w / 2 + 40}" ry="20" fill="#2A2E38" opacity=".26"/><rect x="${x - w / 2 + 20}" y="${top + 24}" width="${w - 40}" height="${GFY + 56 - top - 24}" fill="#D9D2C2" stroke="${INK}" stroke-width="7"/>` +
  `<path d="M${x - w / 2 + 20} ${top - 18} L${x + w / 2 - 20} ${top - 18} L${x + w / 2} ${top + 2} L${x - w / 2} ${top + 2} Z" fill="#ECE6DA" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="${x - w / 2}" y="${top}" width="${w}" height="24" rx="5" fill="#D8D0C0" stroke="${INK}" stroke-width="7"/>`;
function gScreenUI(t, mode, k) {   // a flat computer screen (1000×600)
  let h = `<rect x="0" y="0" width="1000" height="600" rx="12" fill="#F4F6FA"/>`;
  if (mode === 'eval') {
    h += `<rect x="0" y="0" width="1000" height="70" rx="12" fill="#2E4A6E"/><text x="34" y="48" font-family="${FONT}" font-weight="900" font-size="36" fill="#fff">하반기 인사 평가</text>`;
    [['고 과장', '성과 우수', 'A', '#2E4A6E'], ['인턴 하늘', '계약 검토', '—', '#2E4A6E'], ['제로', '존재감 없음', 'C', '#D8433C']].forEach(([n, c, g, col], i) => {
      const y = 130 + i * 140, hl = i === 2 ? clamp(k, 0, 1) : 0;
      h += `<rect x="30" y="${y - 50}" width="940" height="110" rx="10" fill="${hl ? '#FFF1EF' : '#fff'}" stroke="${hl ? '#D8433C' : '#D5DCE6'}" stroke-width="${3 + 5 * hl}"/><text x="70" y="${y + 18}" font-family="${FONT}" font-weight="900" font-size="44" fill="${INK}">${esc(n)}</text>` +
        `<text x="420" y="${y + 18}" font-family="${FONT}" font-weight="900" font-size="44" fill="${col}">${esc(c)}</text><text x="880" y="${y + 22}" font-family="${FONT}" font-weight="900" font-size="60" fill="${col}">${g}</text>`;
    });
  } else {   // 'trash': the file is dragged to the bin and the bin is emptied
    h = `<rect x="0" y="0" width="1000" height="600" rx="12" fill="#2C4A78"/>`;
    const dr = easeInOut(clamp((k - 0.1) / 0.45, 0, 1)), gone = clamp((k - 0.78) / 0.12, 0, 1), fx = lerp(200, 830, dr), fy = lerp(220, 460, dr);
    h += `<g transform="translate(830 470)"><path d="M-44 -40 L44 -40 L36 50 L-36 50 Z" fill="${gone > 0 ? '#C9D0DC' : '#E3E8F0'}" stroke="${INK}" stroke-width="5"/><rect x="-52" y="-56" width="104" height="16" rx="6" fill="#C9D0DC" stroke="${INK}" stroke-width="5"/>${dr >= 1 && gone < 1 ? `<rect x="-26" y="-34" width="52" height="40" rx="4" fill="#FFF" opacity=".8"/>` : ''}</g><text x="830" y="560" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="26" fill="#fff">휴지통</text>`;
    if (dr < 1) h += `<g transform="translate(${f1(fx)} ${f1(fy)}) scale(${f1(1 - 0.4 * dr)})"><path d="M-40 -56 L22 -56 L44 -34 L44 56 L-40 56 Z" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-26" y="-10" width="54" height="10" fill="#E5484D"/></g>` + (dr < 0.05 ? `<text x="200" y="320" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="24" fill="#fff">분식지도_최종_고과장</text>` : '');
    if (k > 0.6 && k < 0.9) h += `<g transform="translate(560 330)"><rect x="0" y="0" width="230" height="64" rx="8" fill="#fff" stroke="${INK}" stroke-width="4"/><text x="20" y="42" font-family="${FONT}" font-weight="900" font-size="30" fill="${INK}">휴지통 비우기</text></g>`;
    const cx = k < 0.55 ? fx + 30 : k < 0.75 ? lerp(fx + 30, 640, (k - 0.55) / 0.2) : 640, cy = k < 0.55 ? fy + 30 : k < 0.75 ? lerp(fy + 30, 370, (k - 0.55) / 0.2) : 370;
    h += `<path d="M${f1(cx)} ${f1(cy)} l0 44 l12 -12 l10 22 l8 -4 l-10 -20 l17 0 Z" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
  }
  return h;
}
function gofficeScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 2;
  if (id === 'p1') {
    if (lt < 1.3) {   // wide: invisible Zero tiptoes behind 팀장's chair and peeks at his monitor
      const cam = qLerpCam(lt / 1.3, [900, 760, 1.25], [900, 756, 1.3]), BX = 760, peek = easeOut(clamp((lt - 0.4) / 0.6, 0, 1));
      let ch = gGhost(xZero(t, { x: 1010 - 60 * peek, y: GFY - 10, s: 1.0, pose: walkPose(lt * 6, 0.3 * (1 - peek)), rot: -10 * peek, ex: xEx('z히죽'), look: [-0.8, 0.3] }), t);
      ch += gChairB(BX, GSY) + gBoss(t, { x: BX, y: GSY, s: 1.0, pose: '서기', ex: xEx('z기본'), look: [0.7, 0.2] }) + gODesk(BX + 80, GTY, 620) + `<rect x="${BX + 150}" y="${GTY - 200}" width="220" height="150" rx="10" fill="#2A2E38" stroke="${INK}" stroke-width="7"/><rect x="${BX + 248}" y="${GTY - 52}" width="24" height="34" fill="#2A2E38"/>`;
      return gOffice(t, cam, ch);
    }
    const k = (lt - 1.3) / (D - 1.3);   // the monitor: his evaluation — and his own faint face in the screen
    let h = smDefs() + gDefs() + smPlate('office', [900, 560, 1.6], 0.55, { blur: true }) + smFull('#1A1E28', 0.4) + `<rect x="420" y="190" width="1080" height="660" rx="22" fill="#2A2E38" stroke="${INK}" stroke-width="10"/><g transform="translate(460 230)">${gScreenUI(t, 'eval', k * 2)}</g>`;
    h += `<g opacity="${f1(0.16 * clamp(k * 3, 0, 1) * 100) / 100}" filter="url(#gghost)">` + xZero(t, { x: 1180, y: 1180, s: 1.5, pose: '서기', ex: xEx(k > 0.5 ? 'z울먹' : 'z멍'), look: [0, 0.4] }) + `</g>`;
    return h;
  }
  if (id === 'p2') {
    if (lt < 1.3) {   // night, the empty office: one laptop glows; something bends over it
      const cam = qLerpCam(lt / 1.3, [960, 780, 1.3], [960, 776, 1.35]), LX = 980;
      let ch = gGhost(xZero(t, { x: LX + 40, y: GFY - 20, s: 1.0, pose: smPose('서기', { armR: [[252, 285], [282, 330], [262, 372]], hR: [258, 376] }), rot: 8, ex: xEx('z히죽'), look: [-0.3, 0.7] }), t) + gODesk(LX, GTY, 640);
      ch += `<g><path d="M${LX - 104} ${GTY - 6} L${LX + 104} ${GTY - 6} L${LX + 92} ${GTY - 148} L${LX - 92} ${GTY - 148} Z" fill="#5A6070" stroke="${INK}" stroke-width="7"/><rect x="${LX - 118}" y="${GTY - 8}" width="236" height="14" rx="6" fill="#8A90A0" stroke="${INK}" stroke-width="6"/></g>` + yLight(LX, GTY - 150, 0.28);
      return gOffice(t, cam, ch, { night: 1 }) + `<ellipse cx="960" cy="560" rx="560" ry="380" fill="#9FD8FF" opacity=".05"/>`;
    }
    const k = (lt - 1.3) / (D - 1.3);
    return smDefs() + gDefs() + smFull('#05070F') + `<rect x="360" y="150" width="1200" height="740" rx="24" fill="#2A2E38" stroke="${INK}" stroke-width="10"/><g transform="translate(410 200) scale(1.1)">${gScreenUI(t, 'trash', k)}</g>`;
  }
  // p3: CU — his faint face in the laptop's light: "원래 내 거였잖아."
  const cam = qLerpCam(lt / D, [1020, 700, 2.3], [1020, 696, 2.4]);
  const z = xZero(t, { x: 1020, y: GFY - 20, s: 1.0, pose: '서기', ex: xTalk(a, 'Z', 'z히죽', t), look: [0, 0.6] });
  return gOffice(t, cam, gGhost(z, t) + yRim(1020, GFY - 20 - 410, 112, 'B', '#BFE8FF', 0.4), { night: 1, blur: true });
}

/* ================= p4~p8: the meeting room · the next morning ================= */
const gMeetV1 = window.gmeetScene;
window.gmeetScene = function (t, lt, a) {
  const id = a._id || '', D = a._dur || 2;
  if (id[0] === 'o') return gMeetV1(t, lt, a);
  if (id === 'p4') {   // 고 과장 searches his laptop — the file is gone
    const cam = qLerpCam(lt / D, [GKX + 80, 760, 1.65], [GKX + 80, 754, 1.72]), lp = ptOf(GKX, GFY, 1.0, 200, 356);
    const ch = gStage(t, { seats: [[GBX, gBoss, { ex: xEx('z의심') }], [GHX, gHaneul, { ex: xEx('z기본'), look: [-0.6, 0.3] }], [GZX, xZero, { ex: xEx('z기본') }]], notes: [GHX, GZX],
      stand: [[GKX, gKo, { pose: 'g노트북', ex: xTalk(a, 'G', 'z멘붕', t), look: [0, 0.6], sweat: true, shiver: true }, gLaptopHeld(lp[0], lp[1])]] });
    return gMeetZ(t, cam, ch);
  }
  if (id === 'p5') {   // MCU 팀장: "원본 가진 사람 없어?"
    const cam = qLerpCam(lt / D, [GBX + 40, 870, 2.0], [GBX + 40, 866, 2.08]);
    return gMeetZ(t, cam, gStage(t, { seats: [[GBX, gBoss, { ex: xTalk(a, 'T', 'z버럭', t), look: [-0.85, 0] }], [GHX, gHaneul, { ex: xEx('z당황') }], [GZX, xZero, { ex: xEx('z기본') }]], notes: [GHX, GZX] }), { blur: true });
  }
  if (id === 'p6') {   // Zero, small: he holds up a USB stick
    const cam = qLerpCam(lt / D, [GZX - 160, 890, 1.75], [GZX - 160, 886, 1.82]), up = easeOut(clamp(lt / 0.4, 0, 1)), hp = ptOf(GZX, GSY, 1.0, 280, 262);
    const zero = { pose: mixPose('서기', 'gUSB', up), ex: xTalk(a, 'Z', lt < D * 0.5 ? 'z민망' : 'z결심', t), look: [-0.85, -0.05] };
    return gMeetZ(t, cam, gStage(t, { seats: [[GBX, gBoss, { ex: xEx('z멍'), look: [0.85, 0] }], [GHX, gHaneul, { ex: xEx('z기본'), look: [0.85, 0] }], [GZX, xZero, zero]], notes: [GHX, GZX] }) + (up > 0.5 ? gUSB(hp[0], hp[1]) : ''), { blur: true });
  }
  if (id === 'p7') {
    if (lt < 2.0) {   // wide: Zero presents; applause; for the first time every face is turned to him
      const cam = qLerpCam(lt / 2, [980, 650, 1.0], [960, 640, 1.04]), cl = Math.abs(Math.sin(t * 9));
      const ch = gStage(t, { seats: [[GBX, gBoss, { pose: mixPose('g박수A', 'g박수B', cl), ex: xEx('z빵긋') }], [GHX, gHaneul, { pose: mixPose('g박수A', 'g박수B', Math.abs(Math.sin(t * 9 + 1))), ex: xEx('z빵긋') }], [GZX, gKo, { ex: xEx('z삐짐') }]], notes: [GHX, GZX],
        stand: [[GKX, xZero, { pose: 'g가리킴', ex: xEx('z설렘'), look: [0.7, 0] }]] });
      return gMeetZ(t, cam, ch, { warm: 1 });
    }
    const cam = qLerpCam((lt - 2) / (D - 2), [GZX + 20, 870, 2.1], [GZX + 20, 866, 2.2]);   // CU 고 과장: a frozen smile
    return gMeetZ(t, cam, gStage(t, { seats: [[GHX, gHaneul, { ex: xEx('z빵긋') }], [GZX, gKo, { ex: xEx('z삐짐'), look: [-0.85, 0.1], still: true, noBlink: true }]], notes: [GHX, GZX] }), { blur: true });
  }
  // p8: MCU at the screen, warm light: "이게… 보이는 기분이구나."
  const cam = qLerpCam(lt / D, [GKX + 40, 700, 2.0], [GKX + 40, 694, 2.1]);
  return gMeetZ(t, cam, gStage(t, { seats: [[GBX, gBoss, { ex: xEx('z빵긋') }]], stand: [[GKX, xZero, { pose: '서기', sy: 1 + 0.02 * Math.sin(lt * 3), ex: xTalk(a, 'Z', 'z설렘', t), look: [0.3, -0.1] }]] }), { blur: true, warm: 2 });
};

/* ================= c1~c4: the blame ================= */
const GTX = 690;   // 팀장 standing at the left end of the table
function gblameScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 2;
  const base = (o = {}) => ({ seats: [[GHX, gHaneul, o.han || { ex: xEx('z울먹'), look: [-0.85, 0.2] }], [GZX, xZero, o.zero || { ex: xEx('z당황'), look: [-0.85, 0.1] }]], notes: [GHX, GZX],
    stand: [[GKX - 120, gKo, o.ko || { pose: 'g팔짱', ex: xEx('z히죽'), look: [0.8, 0] }], [GTX, gBoss, o.boss || { pose: 'g가리킴R', ex: xEx('z버럭'), look: [0.9, 0] }]] });
  if (id === 'c1') {
    const tC = Math.min(D * 0.55, smAt(a, '어떻게', 0.55 * D) - 0.1);
    if (lt < tC) {   // MS 팀장 pointing at 하늘
      const cam = qLerpCam(lt / tC, [GTX + 160, 740, 1.6], [GTX + 160, 736, 1.66]);
      return gMeetZ(t, cam, gStage(t, base({ boss: { pose: 'g가리킴R', ex: xTalk(a, 'T', 'z버럭', t), look: [0.9, 0] } })));
    }
    const cam = qLerpCam((lt - tC) / (D - tC), [GHX, 880, 2.0], [GHX, 876, 2.1]);   // CU 하늘 shrinking
    return gMeetZ(t, cam, gStage(t, base({ han: { sy: 0.97, ex: xEx('z울먹'), look: [-0.85, 0.3] } })), { blur: true });
  }
  if (id === 'c2') {   // CU 하늘: "저, 저 아니에요…."
    const cam = qLerpCam(lt / D, [GHX, 870, 2.1], [GHX, 866, 2.2]), hc = ptOf(GHX, GSY, 1, 200, 160);
    let h = gMeetZ(t, cam, gStage(t, base({ han: { sy: 0.97, ex: xTalk(a, 'H', 'z울먹', t), look: [-0.85, 0.2] } })), { blur: true });
    return h + qCam(cam, [-1, 1].map(sd => `<path d="M${f1(hc[0] + sd * 66)} ${f1(hc[1] + 40 + (lt * 60) % 50)} q-7 11 0 16 q7 -5 0 -16" fill="#9FD8FF" stroke="${INK}" stroke-width="3"/>`).join(''));
  }
  if (id === 'c3') {   // MS 팀장, cold: "하늘 씨, 내일부터 나오지 마요."
    const cam = qLerpCam(lt / D, [GTX + 120, 740, 1.6], [GTX + 120, 736, 1.66]);
    return gMeetZ(t, cam, gStage(t, base({ boss: { pose: '서기', rot: -4 * clamp((lt - D * 0.6) / 0.4, 0, 1), ex: xTalk(a, 'T', 'z기본', t), look: [0.6, 0.2] } })));
  }
  // c4: 하늘's hand rises halfway and falls — like Zero's in the first scene → Zero, his hand clenched in his pocket
  if (lt < 1.5) {
    const cam = qLerpCam(lt / 1.5, [GHX - 60, 880, 1.8], [GHX - 60, 876, 1.86]), up = easeOut(clamp(lt / 0.4, 0, 1)) * (1 - easeInOut(clamp((lt - 0.8) / 0.6, 0, 1)));
    return gMeetZ(t, cam, gStage(t, base({ han: { pose: mixPose('서기', 'g손반', up), ex: xEx('z울먹'), look: [-0.85, 0.1] } })), { blur: true });
  }
  const cam = qLerpCam((lt - 1.5) / (D - 1.5), [GZX - 40, 880, 2.0], [GZX - 40, 874, 2.1]), pk = ptOf(GZX, GSY, 1, 240, 400);
  return gMeetZ(t, cam, gStage(t, base({ zero: { ex: xEx('z당황'), look: [-0.85, 0.1], sweat: true, shiver: true } })) + gSpark(pk[0], pk[1] - 20, ((lt - 1.5) * 1.2) % 1, 0.8), { blur: true });
}

/* ================= f1~f6: the bunsik · Sora ================= */
function gsoraScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 2;
  const fh = ptOf(SMBX, SMBY, 1.0, P['g포크'].hR[0], P['g포크'].hR[1]);
  const zeroDown = o => xZeroSeat(t, Object.assign({ pose: '서기', look: [0.8, 0.4] }, o));
  if (id === 'f1') {   // MS Zero, not eating, careful → two-shot: she looks up from the pan
    const tC = Math.min(3.0, smAt(a, '넌', 0.55 * D) - 0.2);
    if (lt < tC) { const cam = qLerpCam(lt / tC, [SMBX + 80, 740, 1.75], [SMBX + 80, 736, 1.82]); return yBun(t, cam, zeroDown({ ex: xTalk(a, 'Z', 'z당황', t), look: [0.8, 0.2] }) + xSoraSeat(t, { ex: xEx('z기본') }), { blur: true }); }
    const cam = qLerpCam((lt - tC) / (D - tC), [960, 730, 1.25], [960, 724, 1.3]);
    return yBun(t, cam, zeroDown({ ex: xTalk(a, 'Z', 'z당황', t), look: [0.8, 0.2] }) + xSoraSeat(t, { ex: xEx('z기본'), look: [-0.85, 0.05], tilt: 4 }), { pan: true });
  }
  if (id === 'f2') {   // CU Sora: offhand, then warm
    const cam = qLerpCam(lt / D, [SMBF - 30, 740, 1.9], [SMBF - 30, 736, 1.96]), sh = Math.sin(clamp((lt - 0.2) / 0.5, 0, 1) * Math.PI);
    return yBun(t, cam, xSoraSeat(t, { y: SMBY - 6 * sh, pose: mixPose('서기', 'y으쓱', sh), ex: xTalk(a, 'S', lt < D * 0.4 ? 'z기본' : 'z빵긋', t), look: [-0.85, 0.05], tilt: 5 }), { blur: true });
  }
  if (id === 'f3') {   // CU Zero: "…내가?"
    const cam = qLerpCam(lt / D, [SMBX + 20, 730, 2.1], [SMBX + 20, 726, 2.2]);
    return yBun(t, cam, zeroDown({ sy: xPop(lt, 0.05), ex: xTalk(a, 'Z', 'z멍', t), look: [0.85, 0.05] }), { blur: true });
  }
  if (id === 'f4') {
    const tW = smAt(a, '봤다', 0.8 * D) - 0.6;
    if (lt < tW) {   // two-shot
      const cam = qLerpCam(lt / tW, [960, 730, 1.25], [960, 724, 1.3]);
      return yBun(t, cam, zeroDown({ ex: xEx('z멍') }) + xSoraSeat(t, { ex: xTalk(a, 'S', 'z빵긋', t), look: [-0.85, 0.05] }), { pan: true });
    }
    const cam = qLerpCam((lt - tW) / (D - tW), [SMBF - 30, 740, 2.0], [SMBF - 30, 736, 2.08]);   // CU: teasing — she saw
    return yBun(t, cam, xSoraSeat(t, { ex: xTalk(a, 'S', 'z메롱', t), look: [-0.85, 0], tilt: -6 }), { blur: true });
  }
  if (id === 'f5') {   // flashback: that rainy night — the far yellow umbrella was her (warm sepia memory)
    const sep = `<defs><filter id="gsep" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.5 0.4 0.15 0 0.05  0.42 0.38 0.12 0 0.03  0.32 0.3 0.1 0 0.02  0 0 0 1 0"/></filter></defs>`;
    if (lt < 1.2) return sep + `<g filter="url(#gsep)">${galleyScene(t, 1.3, { _id: 'a1', _dur: 3.15 })}</g>` + smFull('#FFE8C0', 0.12);
    const k = (lt - 1.2) / (D - 1.2), cam = qLerpCam(k, [1200, 760, 2.4], [1200, 750, 2.7]), sp = ptOf(1200, 838, 0.32, 302, 196);
    const so = qShadow(1200, 838, 22, 0.6) + flip(1200, xSora(t, { x: 1200, y: 838, s: 0.32, pose: Object.assign({}, P['서기'], { armR: P['y우산'].armR, hR: P['y우산'].hR }), ex: xEx('z빵긋'), look: [-0.9, 0.2] })) + yUmbrella(2 * 1200 - sp[0], sp[1], 0.95 * 0.32, 0);
    return sep + `<g filter="url(#gsep)">` + gAlley(t, cam, so) + `</g>` + smFull('#FFE8C0', 0.12);
  }
  // f6: CU Zero — head down; the ring in his pocket, cold
  const cam = qLerpCam(lt / D, [SMBX + 20, 740, 2.1], [SMBX + 20, 748, 2.2]), dn = easeInOut(clamp(lt / 0.8, 0, 1));
  return yBun(t, cam, zeroDown({ tilt: 10 * dn, y: SMBY + 10 * dn, ex: xEx(dn > 0.5 ? 'z울먹' : 'z멍'), look: [0.2, 0.9] }), { blur: true }) + smFull('#0A1030', 0.08);
}

/* ================= r1, r2: the mirror ================= */
const GMR = [485, 68, 962, 743];   // the plate's mirror (plate coords)
function gMirror(t, cam, vis, o = {}) {
  const id = 'gmr' + (smClipN++), zx = 966, zy = 1190 + (o.dy || 0), s = 2.0, hp = ptOf(zx, zy, s, 324, 172);   // his reflection fills the mirror: head and shoulders
  const pz = o.pose ? (typeof o.pose === 'string' ? P[o.pose] : o.pose) : P['g반지서기'], rh = ptOf(zx, zy, s, pz.hR[0], pz.hR[1]);
  let refl = xZero(t, { x: zx, y: zy, s, pose: o.pose || 'g반지서기', ex: o.ex || xEx('z멍'), look: [0, 0.1], tilt: o.tilt || 0 }) + gRing(rh[0] - 8, rh[1] - 16, 2.2);
  refl = vis >= 1 ? refl : vis <= 0 ? gGhost(refl, t) : `<g opacity="${f1((0.34 + 0.66 * vis) * 100) / 100}" filter="${vis < 0.5 ? 'url(#gghost)' : ''}">${refl}</g>`;
  const extra = `<defs><clipPath id="${id}"><rect x="${GMR[0]}" y="${GMR[1]}" width="${GMR[2]}" height="${GMR[3]}"/></clipPath></defs><g clip-path="url(#${id})"><g opacity=".9">${refl}</g><rect x="${GMR[0]}" y="${GMR[1]}" width="${GMR[2]}" height="${GMR[3]}" fill="#DCE6F2" opacity=".12"/></g>`;
  return smDefs() + gDefs() + smPlate('bath', cam, 0.55, { extra }) + smFull('#1A1410', 0.12) + (vis > 0 && vis < 1 ? smGlitch(t, 0.2 * Math.sin(vis * Math.PI), 17) : '');
}
function gmirrorScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 2;
  if (id === 'r1') {   // turn: gone; turn: back
    const v = lt < 0.7 ? 1 : lt < 1.0 ? 1 - (lt - 0.7) / 0.3 : lt < 1.9 ? 0 : lt < 2.2 ? (lt - 1.9) / 0.3 : 1;
    return gMirror(t, qLerpCam(lt / D, [966, 470, 1.25], [966, 466, 1.3]), v, { ex: xEx(lt < 2.2 ? 'z멍' : 'z울먹') });
  }
  const tS = smAt(a, '반지가', 0.45 * D) - 0.1, tR = smAt(a, '옳게', 0.62 * D) - 0.1;   // r2: a long look at himself — then the answer settles in his face
  if (lt < tS) return gMirror(t, qLerpCam(lt / tS, [966, 450, 1.35], [966, 430, 1.6]), 1, { ex: xEx('z멍') });
  if (lt < tR) return gMirror(t, qLerpCam((lt - tS) / (tR - tS), [966, 330, 2.3], [966, 326, 2.4]), 1, { ex: xEx('z멍'), pose: '서기' });
  const dn = easeInOut(clamp((lt - tR) / 0.8, 0, 1));   // the ring hand comes down; his face settles
  return gMirror(t, qLerpCam((lt - tR) / (D - tR), [966, 420, 1.55], [966, 410, 1.62]), 1, { ex: exprAt([[0, 'z멍'], [1.0, 'z결심']], lt - tR), pose: mixPose('g반지서기', '서기', dn) });
}

/* ================= h1~h8: the hand ================= */
const GHN = 380, GBS = 680;   // 하늘 standing with her box · 팀장 standing beside her
function ghandScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 2;
  const look = (x) => [x > 0 ? 0.9 : -0.9, 0.05];
  const st = (o = {}) => {
    const hb = ptOf(GHN, GFY, 1.0, 200, 392);
    return gStage(t, { seats: [[GBX, gKo, o.ko || { ex: xEx('z기본'), look: [-0.85, 0] }], [GHX, null], [GZX, xZero, o.zero || { ex: xEx('z당황'), look: [-0.85, 0.1] }]], notes: [GZX],
      stand: [[GHN, gHaneul, o.han || { pose: 'g상자', ex: xEx('z울먹'), look: [0.3, 0.5] }, o.box === false ? '' : gBox(hb[0], hb[1] - 10, 0.9)], [GBS, gBoss, o.boss || { ex: xEx('z기본'), look: look(-1) }]] });
  };
  if (id === 'h1') {   // MS: 팀장 and 하늘 with her box — "그럼 하늘 씨는, 오늘까지—"
    const cam = qLerpCam(lt / D, [530, 740, 1.55], [530, 736, 1.6]);
    return gMeetZ(t, cam, st({ boss: { ex: xTalk(a, 'T', 'z기본', t), look: [-0.9, 0.1] } }));
  }
  if (id === 'h2') {
    if (lt < 1.1) {   // his thumb starts to turn the ring — and stops
      const bg = smPlate('meet', [GZX - 200, 700, 1.6], 0.55, { blur: true }) + smFull('#1A1E28', 0.35);
      return gRingCU(t, 0.25 * easeOut(clamp(lt / 0.5, 0, 1)), { bg, thumb: clamp(lt / 0.4, 0, 1) });
    }
    if (lt < 2.0) {   // he takes it off and sets it on the table
      const k = (lt - 1.1) / 0.9, cam = [GZX - 120, 1000, 2.6], rp = [GZX - 140, GTY - 14];
      let ch = gStage(t, { seats: [[GZX, xZero, { pose: smPose('서기', { armR: [[252, 285], [250, 340], [200 + 40 * (1 - k), 372]], hR: [196 + 40 * (1 - k), 372] }), ex: xEx('z결심'), look: [-0.3, 0.8] }]], notes: [] });
      ch += gRing(rp[0], rp[1] - 30 * (1 - easeOut(k)), 1.3) + gSpark(rp[0] + 10, rp[1] - 20, k, 1);
      return gMeetZ(t, cam, ch, { blur: true });
    }
    const k = (lt - 2.0) / (D - 2.0), cam = qLerpCam(k, [GZX - 160, 860, 1.6], [GZX - 160, 850, 1.68]), up = easeInOut(clamp(k / 0.7, 0, 1));   // the hand: up — all the way
    return gMeetZ(t, cam, st({ zero: { pose: mixPose('서기', 'g손끝', up), ex: xEx('z결심'), look: [-0.85, -0.1] } }) + gRing(GZX - 140, GTY - 14, 1.3), { warm: up });
  }
  if (id === 'h3') {
    const cam = qLerpCam(lt / D, [GZX - 120, 860, 1.75], [GZX - 120, 856, 1.82]);
    return gMeetZ(t, cam, st({ zero: { pose: 'g손끝', ex: xTalk(a, 'Z', 'z결심', t), look: [-0.85, -0.1] } }) + gRing(GZX - 140, GTY - 14, 1.3), { warm: 1, blur: true });
  }
  if (id === 'h4') {   // wide: every head turns to him — for the first time, all of them
    const tr = easeOut(clamp(lt / 0.5, 0, 1)), cam = qLerpCam(lt / D, [1040, 660, 1.0], [1080, 670, 1.06]), L = [lerp(-0.6, 0.9, tr), 0.05];
    return gMeetZ(t, cam, st({ zero: { pose: 'g손끝', ex: xEx('z결심'), look: [-0.85, -0.1] }, ko: { ex: xEx('z당황'), look: L }, han: { pose: 'g상자', ex: xEx('z멍'), look: L }, boss: { ex: xEx('z멍'), look: L } }) + gRing(GZX - 140, GTY - 14, 1.3), { warm: 1 });
  }
  if (id === 'h5') {
    const tC = Math.min(D * 0.6, smAt(a, '하늘', 0.75 * D) - 0.2);
    if (lt < tC) {   // MCU Zero, steady
      const cam = qLerpCam(lt / tC, [GZX - 20, 870, 2.0], [GZX - 20, 866, 2.08]), dn = easeInOut(clamp(lt / 0.6, 0, 1));
      return gMeetZ(t, cam, st({ zero: { pose: mixPose('g손끝', '서기', dn), ex: xTalk(a, 'Z', 'z결심', t), look: [-0.85, 0] } }), { warm: 1, blur: true });
    }
    const cam = qLerpCam((lt - tC) / (D - tC), [GHN + 20, 740, 2.0], [GHN + 20, 736, 2.08]);   // CU 하늘: tears, and something like hope
    return gMeetZ(t, cam, st({ han: { pose: 'g상자', ex: xEx('z울먹'), look: [0.9, 0], tilt: 4 } }), { blur: true });
  }
  if (id === 'h6') {   // 팀장 slowly turns to 고 과장; 고 과장 looks away
    const k = easeInOut(clamp(lt / 0.8, 0, 1)), cam = qLerpCam(lt / D, [900, 760, 1.35], [900, 756, 1.4]);
    return gMeetZ(t, cam, st({ boss: { ex: xEx('z의심'), look: [lerp(-0.2, 0.9, k), 0.1] }, ko: { ex: xEx(k > 0.6 ? 'z당황' : 'z기본'), look: k > 0.6 ? [0.9, 0.5] : [-0.85, 0], sweat: k > 0.6 } }));
  }
  if (id === 'h7') {
    const tZ = smAt(a, '제로', 0.55 * D) - 0.15;
    const cam = lt < tZ ? qLerpCam(lt / tZ, [560, 740, 1.5], [580, 736, 1.55]) : qLerpCam((lt - tZ) / (D - tZ), [GBS + 40, 730, 2.0], [GBS + 40, 726, 2.06]);
    return gMeetZ(t, cam, st({ boss: { ex: xTalk(a, 'T', lt < tZ ? 'z기본' : 'z의심', t), look: lt < tZ ? [-0.9, 0.1] : [0.9, 0] }, han: { pose: 'g상자', ex: xEx(lt > tZ ? 'z빵긋' : 'z멍'), look: [0.3, 0.3] } }));
  }
  // h8: 하늘 sets the box down and bows deeply toward him; he gives a small nod
  if (lt < 1.2) {
    const k = easeInOut(clamp(lt / 0.8, 0, 1)), cam = qLerpCam(lt / 1.2, [GHN + 100, 760, 1.6], [GHN + 100, 756, 1.65]);
    let ch = st({ box: false, han: { pose: mixPose('g상자', 'g인사', k), rot: 22 * k, ex: xEx('z울먹'), look: [0.9, 0.4] } });
    return gMeetZ(t, cam, ch + gBox(GHN + 150, GFY - 40, 0.9));
  }
  const cam = qLerpCam((lt - 1.2) / (D - 1.2), [GZX - 20, 870, 2.0], [GZX - 20, 866, 2.06]);
  return gMeetZ(t, cam, st({ zero: { ex: xEx('z빵긋'), look: [-0.85, 0.2], tilt: 4 * Math.sin(clamp((lt - 1.3) / 0.4, 0, 1) * Math.PI) } }), { warm: 1, blur: true });
}

/* ================= e1~e6: the puddle (open ending) ================= */
const GPX = GAX - 120, GPY = 1130;
const gPuddle = (t, ringK = 1) => {
  const px = GPX, py = GPY;
  let h = `<path d="M${px - 240} ${py} C${px - 230} ${py - 40} ${px - 120} ${py - 52} ${px - 20} ${py - 44} C${px + 90} ${py - 56} ${px + 236} ${py - 36} ${px + 222} ${py + 4} C${px + 210} ${py + 44} ${px + 60} ${py + 50} ${px - 40} ${py + 42} C${px - 150} ${py + 50} ${px - 250} ${py + 36} ${px - 240} ${py} Z" fill="#16203A" opacity=".72"/>`;
  h += `<path d="M${px - 60} ${py - 30} L${px + 40} ${py - 30} L${px + 20} ${py + 30} L${px - 50} ${py + 30} Z" fill="#FFD98A" opacity=".22"/>`;
  for (let i = 0; i < 4; i++) { const k2 = ((t * 1.3 + i * 0.27) % 1), rx = px - 160 + hash(i * 3.1 + Math.floor(t * 1.3 + i * 0.27)) * 320; h += `<ellipse cx="${f1(rx)}" cy="${py + 10 - 20 * hash(i)}" rx="${f1(8 + 40 * k2)}" ry="${f1(2 + 9 * k2)}" fill="none" stroke="#C9DCF5" stroke-width="3" opacity="${f1((1 - k2) * 0.7 * 100) / 100}"/>`; }
  if (ringK > 0) h += gRing(px + 30, py - 2, 1.1);
  return h;
};
function gendScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 2;
  const zw = (o = {}) => xZero(t, Object.assign({ x: GAX, y: GFY, s: 1.0, pose: '서기', look: [-0.6, 0.6] }, o));
  if (id === 'e1') {
    if (lt < 1.6) {   // wide: no umbrella, in the rain; he looks at the ring in his palm
      const cam = qLerpCam(lt / 1.6, [GAX, 700, 1.3], [GAX, 696, 1.36]), z = zw({ pose: smPose('서기', { armR: [[252, 285], [270, 336], [232, 330]], hR: [228, 326] }), ex: xEx('z멍'), look: [0.2, 0.8] });
      return gAlley(t, cam, gPuddle(t, 0) + gWet(z, GFY) + qShadow(GAX, GFY, 70) + z + gRing(ptOf(GAX, GFY, 1, 228, 326)[0], ptOf(GAX, GFY, 1, 228, 326)[1] - 14, 1.2), { rain: 0.36 });
    }
    const k = (lt - 1.6) / (D - 1.6), cam = [GPX, 1080, 2.6], hy = lerp(820, GPY - 30, easeInOut(clamp(k / 0.5, 0, 1))) - 260 * easeIn(clamp((k - 0.65) / 0.35, 0, 1));   // his hand lays it in the water
    let ch = gPuddle(t, k > 0.45 ? 1 : 0) + `<rect x="${GPX + 6}" y="${f1(hy - 700)}" width="100" height="660" fill="${SM_ORANGE}" stroke="${INK}" stroke-width="10"/><circle cx="${GPX + 56}" cy="${f1(hy)}" r="56" fill="#fff" stroke="${INK}" stroke-width="10"/>`;
    if (k < 0.45) ch += gRing(GPX + 30, hy + 40, 1.1);
    if (k > 0.45 && k < 0.8) ch += `<ellipse cx="${GPX + 30}" cy="${GPY}" rx="${f1(20 + 120 * (k - 0.45))}" ry="${f1(6 + 26 * (k - 0.45))}" fill="none" stroke="#C9DCF5" stroke-width="4" opacity="${f1((0.8 - k) * 2 * 100) / 100}"/>`;
    return gAlley(t, cam, ch, { rain: 0.22 });
  }
  const sora = (o = {}) => { const x = o.x || GAX + 230, sp = ptOf(x, GFY, 0.97, 302, 196), tilt = o.tilt == null ? -24 : o.tilt;
    return qShadow(x, GFY, 66) + flip(x, xSora(t, Object.assign({ x, y: GFY, s: 0.97, pose: 'y우산', look: [0.9, 0.1] }, o))) + yUmbrella(2 * x - sp[0], sp[1], 0.95, tilt); };
  if (id === 'e2') {   // a yellow umbrella tilts over him — Sora
    const k = easeOut(clamp(lt / 0.5, 0, 1)), cam = qLerpCam(lt / D, [GAX + 110, 740, 1.45], [GAX + 110, 736, 1.5]);
    const sx = lerp(GAX + 420, GAX + 230, k), z = zw({ ex: xEx(k > 0.6 ? 'z멍' : 'z울먹'), look: [0.8, 0.1] });
    return gAlley(t, cam, gPuddle(t) + gWet(z, GFY) + qShadow(GAX, GFY, 70) + z + sora({ x: sx, tilt: lerp(0, -24, k), ex: xTalk(a, 'S', 'z빵긋', t) }), { rain: 0.3 });
  }
  if (id === 'e3') {   // CU Zero, wet: "…나 오늘, 처음으로 다 보였어."
    const cam = qLerpCam(lt / D, [GAX + 20, 730, 2.15], [GAX + 20, 724, 2.25]);
    return gAlley(t, cam, zw({ ex: xTalk(a, 'Z', lt < D * 0.5 ? 'z울먹' : 'z빵긋', t), look: [0.85, 0.05] }) + sora({ ex: xEx('z빵긋') }), { blur: true, rain: 0.18 });
  }
  if (id === 'e4') {   // CU Sora: "난 맨날 봤는데?"
    const cam = qLerpCam(lt / D, [GAX + 230, 720, 2.1], [GAX + 230, 714, 2.2]);
    return gAlley(t, cam, sora({ ex: xTalk(a, 'S', 'z빵긋', t), look: [-0.9, 0.05], tilt: -24 }), { blur: true, rain: 0.18 });
  }
  if (id === 'e5') {
    if (lt < 1.8) {   // the store window: two of them now, side by side
      const w = gWindow(t, 0, { umbDy: 4000 }), sx = 1240, sp = ptOf(sx, 1230, 1.5, 302, 196);
      const zid = 'gw2' + (smClipN++);
      return w + `<defs><clipPath id="${zid}"><rect x="120" y="40" width="1680" height="980"/></clipPath></defs><g clip-path="url(#${zid})" opacity=".72">` + xZero(t, { x: 820, y: 1230, s: 1.5, pose: '서기', ex: xEx('z빵긋'), look: [0.6, 0] }) +
        flip(sx, xSora(t, { x: sx, y: 1230, s: 1.5, pose: 'y우산', ex: xEx('z빵긋'), look: [0.9, 0] })) + yUmbrella(2 * sx - sp[0], sp[1], 1.45, -20) + `</g>`;
    }
    const k = clamp((lt - 1.8) / (D - 1.8), 0, 1), cam = [GAX + 100, 680, 1.1], s = lerp(0.9, 0.55, k), x = lerp(GAX + 60, GAX + 260, k), y = lerp(GFY - 20, 960, k), b = Math.abs(Math.sin(lt * 7)) * 5;   // they walk away up the alley
    const sp = ptOf(x + 120 * s, y - b, s, 302, 196);
    let ch = qShadow(x, y, 60 * s) + xZero(t, { x, y: y - b, s, pose: walkPose(lt * 7, 0.4), ex: xEx('z빵긋'), look: [0.6, -0.3] });
    ch += qShadow(x + 120 * s, y, 60 * s) + flip(x + 120 * s, xSora(t, { x: x + 120 * s, y: y - b, s, pose: Object.assign({}, walkPose(lt * 7 + 1, 0.4), { armR: P['y우산'].armR, hR: P['y우산'].hR }), ex: xEx('z빵긋'), look: [0.9, -0.3] })) + yUmbrella(2 * (x + 120 * s) - sp[0], sp[1], 0.95 * s, -22);
    return gAlley(t, cam, gPuddle(t) + ch, { rain: 0.3 });
  }
  // e6: the puddle — the ring glints; a stranger's sneaker stops beside it; a hand reaches down… black
  const cam = [GPX, 1080, 2.6], sh = easeOut(clamp((lt - 1.4) / 0.5, 0, 1)), hd = easeInOut(clamp((lt - 2.4) / 1.0, 0, 1));
  let ch = gPuddle(t) + gSpark(GPX + 42, GPY - 18, (lt * 0.9) % 1, 1.4);
  const sx = lerp(GPX + 700, GPX + 290, sh);
  ch += `<g transform="translate(${f1(sx)} ${GPY + 6})"><path d="M-120 0 Q-124 -60 -60 -64 L30 -70 Q80 -40 90 0 Z" fill="#E9EDF3" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M-126 0 L94 0" stroke="${INK}" stroke-width="16"/><path d="M-40 -64 L-30 -40 M-10 -66 L0 -42" stroke="#7A8090" stroke-width="6"/><rect x="0" y="-260" width="70" height="196" fill="#3E4656" stroke="${INK}" stroke-width="8"/></g>`;
  if (hd > 0) { const hy = lerp(400, GPY - 70, hd); ch += `<rect x="${GPX + 40}" y="${f1(hy - 640)}" width="110" height="620" fill="#7A8090" stroke="${INK}" stroke-width="10"/><circle cx="${GPX + 95}" cy="${f1(hy)}" r="58" fill="#fff" stroke="${INK}" stroke-width="10"/>`; }
  return gAlley(t, cam, ch, { rain: 0.24 }) + smFull('#000', clamp((lt - (D - 0.55)) / 0.35, 0, 1));
}
function gcardScene(t, lt, a) {
  return smFull('#000') + `<g opacity="${f1(clamp(lt / 0.5, 0, 1) * 100) / 100}">` + outlined(960, 540, [[['다음 이야기에서 만나요', '#E8ECF2']]], { size: 64, sw: 10, lh: 80 }) + `</g>`;
}
