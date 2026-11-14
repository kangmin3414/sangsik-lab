/* 자소서 편 — 3막(두 번째 세계, 대본_v3 25~33번)과 4막(7년 뒤, 34~40번). rsscenes.js·rsscenes2.js의 헬퍼를 쓴다.
   규칙: 두 번째 세계도 첫 번째 세계와 같은 구도·같은 밝기 · 짝 장면에는 기억 창 · 끝은 결과 직전의 그림에서 끊는다(커서는 '보류'와 '통과' 사이). */
const RS_PLAIN = '대단한 성과는 없습니다. 맡은 숫자는 끝까지 맞췄습니다.';
const RS_ESSAY4 = ['재고 숫자가 안 맞았습니다.', '그래서 밤새 창고를 다시 셌습니다.', '틀린 칸을 찾았고, 다음 날 숫자가 맞았습니다.'];
const rsDoneCard = (dn, txt) => dn <= 0 ? '' : `<rect x="250" y="262" width="1420" height="560" fill="#fff" opacity="${rsOp(rsK(0, 1, dn) * 0.45)}"/><g transform="translate(960 470) scale(${rsSc(dn)})"><rect x="-286" y="-104" width="584" height="220" rx="26" fill="${INK}" opacity=".2"/><rect x="-292" y="-112" width="584" height="220" rx="26" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="-190" cy="-4" r="46" fill="#3CC79A" stroke="${INK}" stroke-width="6"/>${rsCheck(-190, -4, 2.2, '#fff', 11)}${fT(60, 2, '제출 완료', 64, NAVY)}${fT(60, 58, txt, 28, '#5B6478', { w: 700 })}</g>`;

/* ---------- 26번: 그 줄을 지우고, 서툰 문장을 적는다 ---------- */
function rseraseScene(t, lt, a) {
  const tC = 0.95;
  if (lt < tC) { const g = 1 - easeInOut(rsK(0.12, 0.85, lt));
    return rsFaceLate(t, lt, { cam: qLerpCam(lt / tC, [960, 588, 1.56], [960, 592, 1.5]), z: { ex: fEx('rs담담'), look: [0, 0.45], still: lt < 0.3 }, ghost: g, ghostR: 1 - rsK(0.12, 0.55, lt), driftR: 90 * easeIn(rsK(0.12, 0.85, lt)), extra: rsStripAir(1, { dbl: g }) }) + fFull('#fff', rsOp((1 - rsK(0, 0.3, lt)) * 0.9)) + rsVeil(lt, tC, 0.14, 0.5); }
  const u = lt - tC, del = rsK(0.1, 0.8, u), typ = rsK(0.9, 1.85, u), pr = rsK(2.0, 2.15, u) * (1 - rsK(2.27, 2.45, u)), dn = (u - 2.4) / 0.3;
  const yl = del >= 1 ? -1 : Math.ceil(RS.LINE.length * (1 - del)), plain = typ > 0 ? RS_PLAIN.slice(0, Math.floor(RS_PLAIN.length * typ)) : '';
  const body = rsEssay(t, { shown: 999, yl, plain, cursor: dn <= 0 }) + rsDoneCard(dn, '오전 2:58 접수되었습니다');
  return rsDefs() + rsZoom(rsLaptop(t, rsForm({ tab: 3, mins: 2, clock: '오전 2:58', press: pr, body })), lerp(1.1, 1.16, easeInOut(rsK(0, 3.2, u))), 900, 520) + rsRib((u - 2.75) / 0.4, RSW2, '지원서를 낸 새벽') + rsVeil(lt, tC, 0.14, 0.5);
}
/* ---------- 28번: "그냥 그 줄, 그대로 둘걸" ---------- */
function rsregretScene(t, lt, a) {
  const cam = qLerpCam(lt / 3.4, [960, 606, 1.38], [960, 602, 1.46]);
  return rsFaceShot(t, cam, { clock: '11:48', z: { ex: rsTalk('z멍', t), look: [0, 0.6], tilt: 5, sy: 0.975 }, extra: rsStrip(960, 322, 0.7, { empty: true, op: 0.9 }) }) + rsRib(1, RSW2, '한 달 뒤 · 밤');
}
/* ---------- 29번: 네 번째 지원서 ---------- */
function rsfourthScene(t, lt, a) {
  const tN = rsW(a, '네', 0.87), tJ = rsW(a, '재고', 4.21), tB = rsW(a, '밤새', 5.85), tEnd = rsW(a, '그대로', 10.49);
  const total = RS_ESSAY4.join('').length, shown = Math.floor(total * rsK(tJ, tEnd - 0.5, lt)); let docs = '';
  for (let i = 0; i < 4; i++) { const k = i < 3 ? 1 : (lt - tN) / 0.3; if (k > 0) docs += `<g transform="translate(${700 + i * 96} 148) scale(${i < 3 ? 1 : rsSc(k)})"><path d="M-26 -34 H10 L26 -18 V34 H-26 Z" fill="${i < 3 ? '#E3E6EC' : '#fff'}" stroke="${i < 3 ? '#9AA3B4' : RS.BLUE}" stroke-width="5" stroke-linejoin="round"/>${i < 3 ? `<path d="M-10 -8 L10 12 M10 -8 L-10 12" stroke="#9AA3B4" stroke-width="5" stroke-linecap="round"/>` : fT(0, 16, '4', 34, RS.BLUE)}</g>`; }
  if (lt > tN + 0.25) docs += fT(1046, 160, '네 번째', 32, RS.BLUE, { anchor: 'start' });
  const body = rsEssay(t, { lines: RS_ESSAY4, shown }) + docs;
  return rsDefs() + rsZoom(rsLaptop(t, rsForm({ tab: 3, pillText: '마감 3일 전', clock: '오후 9:20', body })), lerp(1.02, 1.14, easeInOut(rsK(0, 10, lt))), 860, 480) + rsInsetWare(t, (lt - tB) / 0.35, Math.max(0, (lt - tB - 0.4) / 0.3), { night: 1, label: '밤새 다시 센 날', x: 1570, y: 440 }) + rsRib(lt / 0.4, RSW2, '네 번째 지원서');
}
/* ---------- 32번: 같은 질문, 두 제로 ---------- */
function rscompareScene(t, lt, a) {
  const tQ = rsW(a, '질문이', 2.11), tH = rsW(a, '숨을', 5.35), tT = rsWd(a._words, '제로는', 7.85, 1) - 0.75, tS = rsW(a, '할', 8.41);
  const chip = (x, y, k, col, ok) => k <= 0 ? '' : `<g transform="translate(${x} ${y}) scale(${rsSc(k)})"><circle r="38" fill="${ok ? '#3CC79A' : '#fff'}" stroke="${INK}" stroke-width="6"/>${ok ? rsCheck(0, 0, 1.6, '#fff', 9) : fT(0, 18, '?', 52, col)}</g>`;
  const hide = easeInOut(rsK(tH, tH + 0.6, lt));
  let L = RSZW({ x: -150, y: 262 + 14 * hide, s: 0.8, sy: 1 - 0.07 * hide, t, pose: '서기', ex: fEx('z당황'), look: hide > 0.5 ? [-0.3, 0.8] : [0.6, 0], tilt: 6 * hide, seed: 3, still: true }) + rsStrip(-150, -212, 0.5, {});
  L += [0, 1, 2].map(i => chip(140 + i * 96, -70, (lt - tQ - i * 0.25) / 0.3, RSW1[1])).join('') + (lt > tH ? fT(236, 30, '답하지 못한 질문', 30, '#5B6478', { w: 700 }) : '');
  E['_rsc'] = qTalk('z기본', lt > tT + 0.3 ? 0.5 + 0.5 * Math.sin(t * 11) : 0);
  const sp = lt > tT + 0.3, armUp = { armR: [[252, 285], [296, 318], [322, 276 + 6 * Math.sin(t * 4)]], hR: [328, 268 + 6 * Math.sin(t * 4)] };
  let R = RSZW({ x: -150, y: 262, s: 0.8, t, pose: sp ? Object.assign({}, P['서기'], armUp) : '서기', ex: fEx(sp ? '_rsc' : 'rs담담'), look: [0.6, 0], seed: 3 });
  R += chip(140, -110, 1, RSW2[1], lt > tS + 0.5);
  if (sp) { const bk = rsK(tT + 0.3, tT + 1.6, lt); R += `<rect x="70" y="-30" width="270" height="130" rx="26" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M76 40 L40 62 L84 66 Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="78" y="36" width="12" height="28" fill="#fff"/>` + [0, 1, 2].map(i => `<rect x="100" y="${-2 + i * 34}" width="${f1([210, 180, 130][i] * rsK(i / 3, (i + 1) / 3, bk))}" height="16" rx="8" fill="#9AA3B4"/>`).join(''); }
  if (lt > tS) R += fT(206, 160, '할 말이 있던 질문', 30, '#5B6478', { w: 700 });
  const lop = 1 - 0.4 * rsK(tT - 0.2, tT + 0.4, lt), rop = lerp(0.4, 1, rsK(tT - 0.2, tT + 0.3, lt));
  let w = rsPaperBg() + rsCardBox(540, 530, 760, 560, RSW1[0], RSW1[1], L, { tcol: '#fff', op: lop, bg: lop < 0.9 ? '#EEEDEA' : '#fff' }) + rsCardBox(1380, 530, 760, 560, RSW2[0], RSW2[1], R, { tcol: '#fff', op: rop });
  const cam = qLerpCam(lt / 10, [960, 560, 1.0], [960, 560, 1.05]);
  return rsDefs() + qCam(cam, w);
}
/* ---------- 33~34번: 크지 않은 회사 → 7년 뒤 ---------- */
const RSS = { GY: 985, DY: 836 };
const rsChair = (x, gy) => `<rect x="${x - 46}" y="${gy - 252}" width="92" height="124" rx="16" fill="#6E7686" stroke="${INK}" stroke-width="6"/><rect x="${x - 6}" y="${gy - 130}" width="12" height="40" fill="#3A4252"/><rect x="${x - 54}" y="${gy - 100}" width="108" height="20" rx="8" fill="#5B6478" stroke="${INK}" stroke-width="6"/><path d="M${x} ${gy - 80} V${gy - 30} M${x - 40} ${gy - 8} L${x} ${gy - 30} L${x + 40} ${gy - 8}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
const rsSay = (x, y, txt, k, fs = 34, left = false) => { if (k <= 0) return ''; const w = rsTw(txt, fs) + 64; return `<g transform="translate(${x} ${y}) scale(${rsSc(k)})"><path d="M${left ? 40 : -40} 40 L${left ? 70 : -70} 86 L${left ? 4 : -4} 46 Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="${-w / 2}" y="-46" width="${w}" height="92" rx="34" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="${left ? 2 : -42}" y="36" width="42" height="12" fill="#fff"/>${fT(0, fs * 0.36, txt, fs, NAVY, { w: 700 })}</g>`; };
function rssmallScene(t, lt, a) {
  const GY = RSS.GY, DY = RSS.DY, sit = rsSitY(DY); let w = '', cam, over = '', rib;
  if (a.ph === 0) {
    const tD = rsW(a, '다만', 8.25), tM = rsW(a, '모르는', 9.03), tS = rsW(a, '말할', 11.59), ask = lt > tM, hear = lt > tM + 0.7, ans = lt > tS;
    E['_rsc'] = qTalk('z기본', ask && lt < tS ? 0.5 + 0.5 * Math.sin(t * 11) : 0);
    const zp = ask ? Object.assign({}, rsSitPose(), { armR: [[252, 285], [300, 250], [318, 196]], hR: [322, 186] }) : rsSitPose();
    const sp = ans ? Object.assign({}, rsSitPose(), { armL: [[148, 285], [108, 256], [92, 206 + 5 * Math.sin(t * 6)]], hL: [88, 196 + 5 * Math.sin(t * 6)] }) : rsSitPose();
    w += `<g clip-path="url(#rsT)">${RSZW({ x: 680, y: sit, s: 1, t, pose: zp, ex: fEx(ans ? 'z반짝' : ask ? '_rsc' : 'rs담담'), look: ask ? [0.8, -0.1] : [0, 0.6], seed: 3 })}${RSX('#C9B8E8', '#8A8A90')({ x: 1340, y: sit, s: 1, t, pose: sp, ex: fEx(ans ? 'z빵긋' : 'z기본'), look: hear ? [-0.8, 0] : [0, 0.6], tilt: ans ? -5 : 0, seed: 81 })}</g>`;
    w += rsTable(430, 930, DY, GY) + rsLidAt(680, DY) + rsTable(1090, 1590, DY, GY) + rsLidAt(1340, DY) + `<rect x="840" y="${DY - 40}" width="34" height="40" rx="6" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
    w += rsSay(760, 386, '이 부분은 잘 모르겠습니다', (lt - tM - 0.15) / 0.3 * (lt < tS + 2.5 ? 1 : 0)) + rsSay(1300, 400, '어디 봐요', (lt - tS - 0.2) / 0.3, 32, true);
    cam = lt < tD - 0.3 ? qLerpCam(lt / (tD - 0.3), [960, 556, 1.0], [960, 560, 1.05]) : qLerpCam((lt - tD + 0.3) / 1.4, [960, 560, 1.05], [1000, 580, 1.18]);
    rib = rsRib(lt / 0.4, RSW2, '입사 · 크지 않은 회사');
  } else {
    const jx = lerp(-140, 1010, easeOut(rsK(0.3, 1.5, lt))), walking = lt > 0.3 && lt < 1.45, sitk = easeInOut(rsK(2.3, 2.85, lt)), chx = lerp(880, 1010, easeOut(rsK(1.7, 2.2, lt)));
    const SIT = Object.assign({}, P['서기'], { legL: [[180, 412], [176, 438], [172, 462]], legR: [[220, 412], [224, 438], [228, 462]], fL: [160, 474, 0], fR: [240, 474, 0] });
    const jp = walking ? walkPose(jx * 0.045, 0.75) : mixPose('서기', SIT, sitk), jpp = Object.assign({}, jp, { armR: [[252, 285], [282, 330], [250, 352]], hR: [242, 354] }), jy = GY + 86 * sitk, hp = rsPt(jx, jy, 1, 242, 354 + (jp.dy || 0));
    const wave = lt > 1.6 && lt < 2.5 ? Object.assign({}, rsSitPose(), { armL: [[148, 285], [104, 262], [84, 216 + 5 * Math.sin(t * 7)]], hL: [80, 206 + 5 * Math.sin(t * 7)] }) : rsSitPose();
    w += `<g clip-path="url(#rsT)">${RSZW({ x: 1340, y: sit, s: 1, t, pose: wave, tie: '#2E8B6F', ex: fEx(lt > 1.5 ? 'z빵긋' : 'rs담담'), look: lt > 1.0 ? [-0.8, 0.05] : [0, 0.6], seed: 3 })}</g>`;
    w += rsTable(430, 930, DY, GY) + rsLidAt(680, DY) + rsTable(1090, 1590, DY, GY) + rsLidAt(1340, DY);
    w += `<path d="M1118 ${DY} L1136 ${DY - 52} L1268 ${DY - 52} L1286 ${DY} Z" fill="#3B2F2A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` + fT(1202, DY - 15, '과장 제로', 28, '#F5D98A');
    const pk = (lt - 3.2) / 0.3; if (pk > 0) w += `<g transform="translate(1508 ${DY}) scale(${rsSc(pk)})">` + [0, 1, 2, 3, 4].map(i => `<rect x="${-56 + (i % 2) * 6}" y="${-12 - i * 9}" width="112" height="11" rx="2" fill="#fff" stroke="${INK}" stroke-width="4"/>`).join('') + `</g>`;
    if (lt > 1.65) w += rsChair(chx, GY);
    w += qShadow(jx, GY, 88, 0.5) + RSX('#7FD8B0', '#3A2A22')({ x: jx, y: jy, s: 1, t, pose: jpp, ex: fEx(sitk > 0.5 ? 'z기본' : 'z멍'), look: [0.8, -0.1], seed: 91 }) + rsPaper(hp[0] - 4, hp[1] - 40, 0.9, 6, false) + hand(hp[0], hp[1], 0.7);
    if (lt > 1.45 && lt < 2.9) w += `<g transform="translate(${f1(jx - 60)} ${f1(jy - 560)}) scale(${rsSc((lt - 1.45) / 0.3)})">${bubble(0, 0, 130, 96, fT(0, 20, '?', 58, RSW2[1]), { right: true })}</g>`;
    cam = qLerpCam(lt / 4.4, [1040, 578, 1.1], [1100, 586, 1.18]);
    over = (() => { const k = Math.min((lt - 0.5) / 0.3, (2.9 - lt) / 0.25); return k <= 0 ? '' : `<g transform="translate(1660 300) scale(${rsSc(k)})"><circle r="170" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-40 -170 L0 -96 L40 -170" fill="none" stroke="#2E8B6F" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>${rsBadge(0, -100, 1.9, { title: '과장', col: '#2E8B6F' })}</g>`; })();
    rib = rsRib(lt / 0.4, RSW2, '7년 뒤');
  }
  return rsDefs() + rsClipY('rsT', DY) + qdPlate('rssmall', cam, 1.0) + qCam(cam, w) + over + rib;
}
/* ---------- 과장 제로의 얼굴 샷(38번 뒤쪽, 39번) ---------- */
function rsBossShot(t, cam, o = {}) { const DY = 900, s = 1.3;
  let w = `<g clip-path="url(#rsT)">${RSZW(Object.assign({ x: 960, y: rsSitY(DY, s), s, t, pose: rsSitPose(), tie: '#2E8B6F', seed: 3, ex: fEx('rs담담'), look: [0, 0.5] }, o.z || {}))}</g><ellipse cx="960" cy="800" rx="320" ry="240" fill="url(#rsGlow)" opacity=".4"/>`;
  w += rsTable(470, 1450, DY, 1340) + rsLidAt(960, DY, 236, 132) + `<path d="M556 ${DY} L578 ${DY - 60} L742 ${DY - 60} L764 ${DY} Z" fill="#3B2F2A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` + fT(660, DY - 18, '과장 제로', 32, '#F5D98A') + `<g transform="translate(1270 ${DY})">` + [0, 1, 2, 3, 4].map(i => `<rect x="${-66 + (i % 2) * 6}" y="${-12 - i * 9}" width="132" height="11" rx="2" fill="#fff" stroke="${INK}" stroke-width="4"/>`).join('') + `</g>` + (o.extra || '');
  return rsDefs() + rsClipY('rsT', DY) + qdPlate('rssmall', cam, 1.0) + qCam(cam, w);
}
/* ---------- 35·36·38·40번: 서류 심사 화면 ---------- */
const RS_RV = ['대학 시절 여러 대외 활동에 참여하며 책임감과', '추진력을 길렀습니다. 특히 지난해 인턴 기간에는', null, '라는 성과를 냈습니다. 입사한 뒤에도 같은 자세로', '주어진 일에 최선을 다하겠습니다.'];
function rsReviewUI(t, o = {}) { // 지어낸 서류 심사 화면
  const idx = o.idx || 12, own = idx === 12; let g = rsChrome('신입 채용 · 서류 심사', '오후 3:10');
  g += fT(300, 170, '지원자 ' + idx, 46, NAVY, { anchor: 'start' }) + fT(300 + rsTw('지원자 ' + idx, 46) + 26, 168, '경영지원 · 신입', 28, '#7A8394', { anchor: 'start', w: 700 }) + `<rect x="1440" y="126" width="190" height="60" rx="30" fill="#E9EDF4" stroke="#9AA3B4" stroke-width="4"/>` + fT(1535, 168, idx + ' / 31', 32, '#3A4252');
  g += `<rect x="300" y="210" width="1320" height="490" rx="14" fill="#fff" stroke="#B8BECB" stroke-width="4"/>` + fT(334, 262, '자기소개서', 28, '#7A8394', { anchor: 'start', w: 700 });
  if (own) RS_RV.forEach((ln, i) => { const y = 336 + i * 70 + (o.scroll || 0); if (y < 300 || y > 686) return;
    if (ln) g += fT(334, y, ln, 36, '#2B3445', { anchor: 'start', w: 700 });
    else { const hl = o.hl || 0, w = rsTw(RS.LINE, 38); g += (hl > 0 ? `<rect x="326" y="${y - 44}" width="${f1((w + 24) * hl)}" height="60" rx="8" fill="${RS.YL}"/>` : '') + fT(338, y, RS.LINE, 38, hl > 0.5 ? NAVY : '#2B3445', { anchor: 'start', w: hl > 0.5 ? 900 : 700 }) + (o.strip > 0 ? `<g transform="translate(${f1(338 + w / 2)} ${y - 16}) scale(${rsSc(o.strip)})">${rsStrip(0, 0, (w + 40) / 620, {})}</g>` : ''); } });
  else for (let i = 0; i < 5; i++) g += `<rect x="334" y="${316 + i * 70}" width="${[1100, 980, 1160, 860, 620][(i + idx) % 5]}" height="22" rx="11" fill="#D9DEE8"/>`;
  const bt = (x, txt, on, pr) => `<g transform="translate(${x} 762) scale(${f1((1 - 0.06 * (pr || 0)) * 100) / 100})">${pr > 0 ? `<rect x="-112" y="-46" width="224" height="92" rx="20" fill="none" stroke="${RS.BLUE}" stroke-width="6" opacity="${rsOp(pr * 0.7)}"/>` : ''}<rect x="-100" y="-34" width="200" height="68" rx="14" fill="${on ? RS.BLUE : '#fff'}" stroke="${INK}" stroke-width="5"/>${fT(0, 13, txt, 36, on ? '#fff' : NAVY)}</g>`;
  g += bt(1250, '보류', false, o.pHold) + bt(1500, '통과', true, o.pPass);
  if (o.ptr) g += `<g transform="translate(${f1(o.ptr[0])} ${f1(o.ptr[1])})"><path d="M0 0 L0 46 L12 35 L21 56 L30 52 L21 32 L36 32 Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>`;
  return g;
}
function rsreviewScene(t, lt, a) {
  const ph = a.ph, MID = [1360, 750], pulse = (t0, x) => rsK(t0, t0 + 0.12, x) * (1 - rsK(t0 + 0.2, t0 + 0.38, x));
  if (ph === 0) { const T = [0.7, 1.7, 2.7], idx = lt < T[0] + 0.3 ? 9 : lt < T[1] + 0.3 ? 10 : lt < T[2] + 0.3 ? 11 : 12, tg = [[1500, 772], [1250, 772], [1500, 772]];
    let ptr = [1000, 560]; const seg = lt < T[0] ? 0 : lt < T[1] ? 1 : lt < T[2] ? 2 : 3;
    if (seg < 3) { const p0 = seg === 0 ? [1000, 560] : tg[seg - 1], k = easeInOut(rsK(seg === 0 ? 0.1 : T[seg - 1] + 0.3, T[seg] - 0.05, lt)); ptr = [lerp(p0[0], tg[seg][0], k), lerp(p0[1], tg[seg][1], k)]; }
    else { const k = easeInOut(rsK(T[2] + 0.4, T[2] + 1.3, lt)); ptr = [lerp(1500, 1000, k), lerp(772, 560, k)]; }
    const ui = rsReviewUI(t, { idx, scroll: idx === 12 ? lerp(90, 40, easeOut(rsK(T[2] + 0.3, T[2] + 1.4, lt))) : 0, pPass: pulse(T[0], lt) + pulse(T[2], lt), pHold: pulse(T[1], lt), ptr });
    return rsDefs() + rsZoom(rsLaptop(t, ui, { rx: 1320 }), lerp(1.0, 1.06, easeInOut(rsK(0, 6, lt))), 900, 480) + rsRib(1, RSW2, '7년 뒤'); }
  if (ph === 1) { const zk = easeInOut(rsK(0.6, 2.2, lt)), ui = rsReviewUI(t, { scroll: lerp(40, 0, easeOut(rsK(0, 0.7, lt))), hl: easeInOut(rsK(0.9, 1.5, lt)), strip: (lt - 1.75) / 0.35, ptr: [1000, 560] });
    return rsDefs() + rsZoom(rsLaptop(t, ui, { rx: 1320 }), lerp(1.06, 1.34, zk), lerp(900, 700, zk), lerp(480, 470, zk)) + rsRib(1, RSW2, '7년 뒤'); }
  if (ph === 2 && lt >= 1.8) { const u = lt - 1.8, up = easeInOut(rsK(0.35, 0.95, u));
    return rsBossShot(t, qLerpCam(u / 1.6, [960, 604, 1.36], [960, 598, 1.46]), { z: { look: [0, lerp(0.55, -0.12, up)], tilt: -2 * up, sy: 1 + 0.02 * Math.sin(Math.PI * up) } }) + rsRib(1, RSW2, '7년 뒤') + rsVeil(lt, 1.8, 0.14, 0.5); }
  // 커서가 '보류'와 '통과' 사이에 선다
  const mv = ph === 2 ? easeInOut(rsK(0.2, 1.25, lt)) : 1, ptr = [lerp(1000, MID[0], mv) + (mv >= 1 ? Math.sin(t * 1.3) * 2 : 0), lerp(560, MID[1], mv) - 60 * Math.sin(Math.PI * mv)];
  const z = ph === 2 ? lerp(1.34, 1.55, easeInOut(rsK(0, 1.4, lt))) : lerp(1.55, 1.78, easeInOut(rsK(0, 5.5, lt)));
  return rsDefs() + rsZoom(rsLaptop(t, rsReviewUI(t, { hl: 1, strip: 1, ptr }), { noHands: true }), z, 1290, 650) + (ph === 2 ? rsVeil(lt, 1.8, 0.14, 0.5) : '');
}
/* ---------- 37번: 논어 위정편 ---------- */
function rsquoteScene(t, lt, a) {
  const tA = rsW(a, '아는', 5.66), tM = rsW(a, '모르는', 7.77), tG = rsW(a, '그것이', 10.65);
  let w = `<rect x="-3000" y="-3000" width="8000" height="7000" fill="#F3E9D2"/><ellipse cx="960" cy="560" rx="1300" ry="760" fill="#FBF4E2"/>`;
  for (let i = 0; i < 9; i++) { const x = 150 + i * 44, k = rsK(0.2 + i * 0.05, 0.6 + i * 0.05, lt); w += `<rect x="${x}" y="${f1(lerp(300, 240, k))}" width="36" height="640" rx="8" fill="#D9B77A" stroke="${INK}" stroke-width="5" opacity="${rsOp(k)}"/>`; }
  if (lt > 0.7) w += [330, 560, 790].map(y => `<path d="M142 ${y} H554" stroke="#7A5A3A" stroke-width="7" stroke-dasharray="26 18" opacity=".8"/>`).join('');
  if (lt > 0.3) w += `<g transform="translate(1170 210) scale(${rsSc((lt - 0.3) / 0.3)})">${label(0, 0, '2,500년 전 · 공자가 제자 자로에게', { size: 38, bg: '#fff' })}</g>`;
  const line = (y, s, t0, col, fs = 80) => { const k = easeOut(rsK(t0, t0 + 0.5, lt)); return k <= 0 ? '' : `<g opacity="${rsOp(k)}" transform="translate(0 ${f1(14 * (1 - k))})">${fT(1170, y, s, fs, col)}</g>`; };
  w += line(430, '아는 것을 안다고 하고,', tA, NAVY) + line(560, '모르는 것을 모른다고 하는 것.', tM, NAVY) + line(716, '그것이 아는 것이다.', tG, '#B23A1E', 88);
  if (lt > tG + 1.0) w += `<g opacity="${rsOp((lt - tG - 1.0) / 0.4)}">${fT(1170, 830, '『논어』 위정편 17장 · 뜻을 옮김', 34, '#7A6A4A', { w: 700 })}</g>`;
  return rsDefs() + qCam(qLerpCam(lt / 14, [960, 560, 1.0], [980, 560, 1.06]), w);
}
/* ---------- 39번: 그 줄을 쓴 밤을 안다 ---------- */
function rsknowScene(t, lt, a) {
  const TF = rsL('s2').t0 - 0.15, tL = rsW(a, '줄이', 1.69), tN = rsW(a, '밤이', 5.63) - 0.6, see = lt > tN + 0.3;
  const cam = qLerpCam(lt / 7.5, [960, 604, 1.34], [940, 598, 1.44]);
  let over = '';
  if (lt > tN) over += `<g transform="translate(1640 430) scale(${rsSc((lt - tN) / 0.35)})">${rsMini(0, 0, 1.3, TF, 'both', { shake: Math.sin(t * 30) * 1.0 })}<g transform="translate(0 250)">${label(0, 0, '7년 전, 새벽 2시', { size: 34, bg: '#fff' })}</g></g>`;
  return rsBossShot(t, cam, { z: { look: see ? [0.75, -0.45] : lt > tL ? [0, -0.6] : [0, 0.5], tilt: see ? 3 : 0 }, extra: rsStripAir((lt - tL) / 0.6) }) + over + rsRib(1, RSW2, '7년 뒤');
}
