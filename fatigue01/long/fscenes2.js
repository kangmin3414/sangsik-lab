/* 피로사회 편 — 1막~열린 결말. fscenes.js 다음에 불러온다. 이름은 f 접두사. 연출 기준 v3 + 물리 규칙(앉기·소품·딛는 곳). */
Object.assign(QBG, { factory: 'ai/factory.png', cvs: 'ai/cvs.png' });
const FN2 = ['ffactory', 'fads', 'fhash', 'fstairs', 'fshadow', 'freplay', 'fsplit', 'fsunday', 'farrow', 'fsquirrel', 'fburst', 'fpalm', 'fno', 'fnolist', 'fbird', 'fbench', 'fcrumple', 'fdawn5', 'fend'];
FN2.forEach(k => CAMS[k] = 'fixed');
const fSepia = k => `<rect x="-300" y="-200" width="2600" height="1500" fill="#B08A50" opacity="${f1(0.32 * k * 100) / 100}" style="mix-blend-mode:multiply"/>`;
const GREYS = ['#7D8597', '#8E8A9B', '#6F7A8C', '#8A8F99'];
const fGrey = (x, y, s, t, seed, o = {}) => HALO(char(Object.assign({ goggles: 'none', vest: GREYS[seed % 4], patch: false, tee: true, hair: '#2F2F33', x, y, s, t, seed: 60 + seed, pose: '서기', ex: fEx('z기본') }, o)));
const fCard = (t, lt, t0, x, y, big, sub, col = '#FFE34D') => lt < t0 ? '' : pop(t, t - lt + t0, t + 99, x, y, `<g><rect x="-330" y="-90" width="660" height="${sub ? 190 : 150}" rx="30" fill="#fff" stroke="${INK}" stroke-width="9"/><rect x="-330" y="-90" width="660" height="22" rx="11" fill="${col}"/>${fT(0, 22, big, 72, INK)}${sub ? fT(0, 78, sub, 30, '#5B6478', { w: 700 }) : ''}</g>`, {});
const fCoachSitY = (surface, s) => surface + 148 * s - 4; // origin y so a sitting coach's hips rest ON a surface
P['f앉기L'] = Object.assign({}, P['f앉기'], { legL: [[188, 408], [96, 410], [92, 504]], fL: [74, 514, 0], legR: [[212, 412], [118, 420], [116, 512]], fR: [98, 522, 0], armL: [[148, 285], [118, 344], [118, 394]], hL: [116, 396], armR: [[252, 285], [244, 352], [186, 396]], hR: [182, 398] });
E['z코치지침'] = Object.assign({}, E['z울먹'], { fxUnder: `<path d="M148 210 Q165 222 182 210 M218 210 Q235 222 252 210" stroke="#7A6AA8" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/><path d="M146 222 Q165 232 184 222 M216 222 Q235 232 254 222" stroke="#7A6AA8" stroke-width="5" fill="none" stroke-linecap="round" opacity=".5"/>` });
const bSpeech0 = s0 => `<g><rect x="${-s0.length * 22 - 30}" y="-50" width="${s0.length * 44 + 60}" height="100" rx="26" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-10 48 L0 86 L22 48" fill="#fff" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>${fT(0, 16, s0, 42, INK)}</g>`;

/* ---------- 1막: 규율사회 (공장) ---------- */
const TOWER = [1660, 1000];
const BELT = () => `<rect x="220" y="800" width="1160" height="46" rx="20" fill="#5B5B66" stroke="${INK}" stroke-width="8"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${280 + i * 170}" cy="823" r="14" fill="#8A8F99" stroke="${INK}" stroke-width="5"/>`).join('');
const WORK = Object.assign({}, P['서기'], { armR: [[252, 285], [290, 330], [300, 372]], hR: [300, 376], armL: [[148, 285], [112, 330], [102, 372]], hL: [100, 376] });
function fTowerAndBoss(t, lt, gone, whistle) { const [tx, ty] = TOWER, k = 1 - easeIn(clamp(gone, 0, 1)); if (k <= 0.01) return '';
  return `<g transform="translate(${tx} ${ty}) scale(${f1(k * 100) / 100}) translate(${-tx} ${-ty})" opacity="${f1(k * 100) / 100}"><g stroke="${INK}" stroke-width="9"><line x1="${tx - 90}" y1="${ty}" x2="${tx - 60}" y2="${ty - 420}"/><line x1="${tx + 90}" y1="${ty}" x2="${tx + 60}" y2="${ty - 420}"/><line x1="${tx - 80}" y1="${ty - 140}" x2="${tx + 80}" y2="${ty - 280}"/><line x1="${tx + 80}" y1="${ty - 140}" x2="${tx - 80}" y2="${ty - 280}"/></g>` +
    `<rect x="${tx - 120}" y="${ty - 440}" width="240" height="30" rx="6" fill="#8A6A4E" stroke="${INK}" stroke-width="8"/>` +
    fGrey(tx, ty - 440, 0.62, t, 9, { collar: true, tie: '#1E2230', pose: whistle ? '만세' : '서기', ex: fEx(whistle ? 'z버럭' : 'z의심'), look: [-0.8, 0.3] }) + `</g>`; }
function ffactoryScene(t, lt, a) {
  const cam = qLerpCam(lt / 5, [920, 600, 1.08], [930, 590, 1.13]), ph = a.card ? 3 : a.ph || 1;
  const keys = [['떠들', '떠들지 마', 520, 0.5], ['늦지', '늦지 마', 900, 1.3], ['쉬지', '쉬지 마', 1280, 2.1]];
  let w = '', over = '', flinch = 0;
  if (ph === 1) { const tN = fAt(a, '하지', 1.2); // one big "하지 마!" sign over the line
    if (lt > tN) { w += pop(t, t - lt + tN, t + 99, 900, 300, `<g><rect x="-240" y="-90" width="480" height="180" rx="30" fill="#fff" stroke="#D63A3A" stroke-width="16"/>${fT(0, 30, '하지 마!', 90, '#D63A3A')}</g>`, {}); if (lt - tN < 0.45) flinch = 1; } }
  else keys.forEach(([k, s0, x, fb]) => { const t0 = ph === 3 ? -9 : fAt(a, k, fb); if (lt < t0) return;
    w += pop(t, t - lt + t0, t + 99, x, 330, `<g><circle r="78" fill="#fff" stroke="#D63A3A" stroke-width="14"/><line x1="-54" y1="54" x2="54" y2="-54" stroke="#D63A3A" stroke-width="14"/>${fT(0, 128, s0, 40, '#fff', { stroke: INK, sw: 8 })}</g>`, {});
    if (lt - t0 < 0.45) flinch = 1; });
  w += BELT() + [0, 1, 2, 3].map(i => { const x = 240 + ((i * 300 + lt * 120) % 1100); return `<rect x="${f1(x)}" y="740" width="80" height="60" rx="6" fill="#C8A27A" stroke="${INK}" stroke-width="6"/>`; }).join('');
  [380, 640, 900, 1160].forEach((x, i) => { w += qShadow(x, 1000, 56) + fGrey(x, 1000, 0.9, t, i, { sy: flinch ? 0.94 : 1, ex: fEx(flinch ? 'z당황' : 'z기본'), pose: WORK, look: [0.5, 0.4] }); });
  w += fTowerAndBoss(t, lt, 0, flinch);
  if (flinch) over += fx(t, t - lt, t + 9, 1480, 420, '삑!', '#fff', { size: 60 });
  if (ph === 3) over += fFull('#000', 0.3) + fCard(t, lt, fAt(a, '규율', 1.0), 960, 520, '규율사회', '금지 · 명령 · 감시');
  return fPlate('factory', cam, 0.6) + qCam(cam, w) + fSepia(1) + over;
}
/* 감시자가 펑 사라지고 광고판 "할 수 있다!" */
function fadsScene(t, lt, a) {
  const tC = fAt(a, '사라지', 1.6), tY = fAt(a, '할', 3.4), tL = fAt(a, '한계', 4.6), cam = qLerpCam(lt / 6, [930, 590, 1.12], [960, 570, 1.04]);
  const gone = clamp((lt - tC) / 0.35, 0, 1), col = clamp((lt - tC - 0.4) / 0.9, 0, 1);
  let w = '';
  const bb = (x, y, s0, c, t0) => lt < t0 ? '' : `<g transform="translate(${x} ${f1(y - 600 * (1 - easeOutBack(clamp((lt - t0) / 0.45, 0, 1))))})"><line x1="-160" y1="-200" x2="-160" y2="-90" stroke="${INK}" stroke-width="6"/><line x1="160" y1="-200" x2="160" y2="-90" stroke="${INK}" stroke-width="6"/><rect x="-250" y="-90" width="500" height="170" rx="18" fill="${c}" stroke="${INK}" stroke-width="10"/>${fT(0, 22, s0, 66, '#fff', { stroke: INK, sw: 10 })}</g>`;
  w += bb(620, 330, '할 수 있다!', '#FF5A6E', tY) + bb(1240, 330, '한계를 넘어라!', '#3D7EC8', tL);
  w += BELT();
  [380, 640, 900, 1160].forEach((x, i) => { const J = fJump(lt, tY + 0.1 + i * 0.07, 0.6), c = ['#FF9A55', '#7EC8F0', '#9ED8B4', '#FFD36E'][i];
    w += qShadow(x, 1000, 56) + HALO(char({ goggles: 'none', vest: col > 0.5 ? c : GREYS[i], patch: false, tee: true, hair: '#2F2F33', x, y: 1000 + J.dy, s: 0.9, sx: J.sx, sy: J.sy, t, seed: 60 + i, pose: J.ph > 1 && J.ph < 5 ? '만세' : lt > tY ? '서기' : WORK, ex: fEx(lt > tY ? 'z반짝' : lt > tC ? 'z충격' : 'z기본'), look: [0.3, -0.3] })); });
  w += fTowerAndBoss(t, lt, gone, 0);
  if (lt > tC) w += puff(TOWER[0], TOWER[1] - 300, t, t - lt + tC, 2.4, '#E9DCC0');
  if (lt > tY) w += rSparks(960, 400, t, 12, 700, '#FFE34D');
  return fPlate('factory', cam, 0.6) + qCam(cam, w) + fSepia(1 - col) + fFull('#FFE9A8', 0.12 * col) + (lt > tC && lt < tC + 0.9 ? fx(t, t - lt + tC, t + 9, 1500, 420, '펑!', '#fff', { size: 64 }) : '');
}
/* 해시태그 비 + 성과사회 카드 */
function fhashScene(t, lt, a) {
  const tF = fAt(a, '있다고', 4.6) - 0.5, cam = qLerpCam(lt / 6, [960, 560, 1.0], [960, 560, 1.06]);
  let w = `<rect x="-300" y="-200" width="2600" height="1500" fill="#FFE9F2"/><circle cx="700" cy="520" r="520" fill="#FFF6C8"/>`;
  const tags = ['#갓생', '#미라클모닝', '#N잡러', '#오운완', '#자기계발', '#갓생러', '#새벽기상', '#부업'];
  tags.forEach((s0, i) => { const ph = (lt * 0.28 + i / tags.length) % 1, x = 220 + (i * 173) % 1100; w += `<g opacity="${f1(Math.sin(ph * Math.PI) * 100) / 100}">${fT(x, -100 + ph * 1300, s0, 54 + (i % 3) * 10, ['#FF5A6E', '#3D7EC8', '#3DBA8A', '#E89A2E'][i % 4], { stroke: '#fff', sw: 8 })}</g>`; });
  const feed = [0, 1, 2].map(i => `<rect x="-140" y="${-230 + i * 150}" width="280" height="130" rx="14" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="-124" y="${-214 + i * 150}" width="96" height="96" rx="10" fill="${['#FFD36E', '#9ED8B4', '#7EC8F0'][i]}"/>${fT(-14, -170 + i * 150, ['#갓생', '#오운완', '#N잡러'][i], 28, INK, { anchor: 'start' })}<rect x="-14" y="${-150 + i * 150}" width="120" height="10" fill="#D5DEEA"/>`).join('');
  w += `<rect x="-300" y="1000" width="2600" height="400" fill="#F6CFE0"/><line x1="-300" y1="1000" x2="2300" y2="1000" stroke="${INK}" stroke-width="6" opacity=".45"/><ellipse cx="660" cy="1004" rx="230" ry="22" fill="#2A1A30" opacity=".2"/>`;
  w += `<g transform="translate(660 670)"><rect x="-190" y="-330" width="380" height="660" rx="50" fill="#1F2D44" stroke="${INK}" stroke-width="12"/><rect x="-168" y="-300" width="336" height="600" rx="22" fill="#EAF0F6"/>${feed}</g>`;
  const up = !a.card && lt > tF, J = fJump(lt, tF, 0.5);
  w += qShadow(1320, 1000, 66) + Z({ x: 1320, y: 1000 + (up ? J.dy : 0), s: 1, sx: up ? J.sx : 1, sy: up ? J.sy : 1, t, pose: up && J.ph > 1 && J.ph < 6 ? '만세' : '서기', ex: fEx(a.card ? 'z빵긋' : 'z반짝'), look: [-0.8, 0], seed: 3 });
  if (up) w += rSparks(1320, 520, t, 8, 260, '#FFE34D');
  return qCam(cam, w) + (a.card ? fCard(t, lt, fAt(a, '성과', 0.8), 960, 200, '성과사회', '할 수 있다 · 긍정 · 동기 부여', '#FF5A6E') : '');
}
/* 끝없는 계단 */
const fStepBlock = (x, y, sw, done, extra = '') => `<g${extra}><rect x="${f1(x)}" y="${f1(y)}" width="${sw}" height="1400" fill="#FFFFFF" stroke="${INK}" stroke-width="8"/><rect x="${f1(x + 4)}" y="${f1(y + 4)}" width="${sw - 8}" height="16" fill="#E6EEF7"/><rect x="${f1(x + sw / 2 - 18)}" y="${f1(y + 34)}" width="36" height="36" rx="8" fill="${done ? '#3DBA8A' : '#fff'}" stroke="${INK}" stroke-width="5"/>${done ? `<path d="M${f1(x + sw / 2 - 9)} ${f1(y + 52)} l7 7 l12 -14" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` : ''}</g>`;
function fstairsScene(t, lt, a) {
  const D = a._dur || 4;
  if (a.ph === 3) { // 해야 한다(끝 있음) vs 할 수 있다(끝 없음)
    const tC = fAt(a, '할수', D * 0.5);
    let h = `<rect x="-300" y="-200" width="2600" height="1500" fill="#DFF1FF"/>`;
    for (let i = 0; i < 3; i++) h += fStepBlock(150 + i * 170, 900 - i * 90, 170, true);
    h += `<line x1="640" y1="720" x2="640" y2="540" stroke="${INK}" stroke-width="8"/><path d="M640 540 L760 572 L640 604 Z" fill="#3DBA8A" stroke="${INK}" stroke-width="6"/>`;
    h += HALO(char({ goggles: 'none', vest: '#FF9A55', patch: false, tee: true, x: 560, y: 720, s: 0.55, t, pose: '만세', ex: fEx('z뿌듯'), seed: 3 }));
    h += fT(400, 230, "'해야 한다'", 56, INK) + fT(400, 300, '다 하면 끝', 38, '#3DBA8A');
    const u = (lt * 0.9) % 1, sw = 150, sr = 90, x0 = 1060, y0 = 1010;
    let R = '';
    for (let i = -1; i < 12; i++) R += fStepBlock(x0 + (i - u) * sw, y0 - (i - u) * sr, sw, i < 2);
    const zx = x0 + (2 - u) * sw + sw / 2, zy = y0 - (2 - u) * sr - Math.max(0, Math.sin(u * Math.PI * 2)) * 18;
    R += HALO(char({ goggles: 'none', vest: '#FF9A55', patch: false, tee: true, x: zx, y: zy, s: 0.55, t, pose: walkPose(lt * 9, 1), ex: fEx(lt > tC ? 'z멘붕' : 'z당황'), seed: 3 }));
    h += `<g clip-path="url(#rightHalf)">${R}</g><line x1="960" y1="-100" x2="960" y2="1300" stroke="${INK}" stroke-width="6" stroke-dasharray="22 16" opacity=".5"/>`;
    h += fT(1500, 230, "'할 수 있다'", 56, INK) + fT(1500, 300, '언제나 조금 더', 38, '#E5484D');
    return h;
  }
  // ph1: 자유! 신나게 오른다 / ph2: 계단이 끝없이 생겨난다
  const SW = 260, SR = 120, sx = i => 200 + i * SW, sy = i => 1000 - i * SR;
  const k = a.ph === 1 ? lt * 1.1 : 4 + lt * 1.25, n = Math.floor(k), f = k - n;
  const m = easeInOut(clamp((f - 0.4) / 0.6, 0, 1)), zx = lerp(sx(n), sx(n + 1), m) + SW / 2, zy = lerp(sy(n), sy(n + 1), m) - Math.sin(m * Math.PI) * 70;
  const cam = [zx + 260, zy - 260, 1.0];
  let w = `<rect x="-3000" y="-3000" width="8000" height="8000" fill="#DFF1FF"/>`;
  for (let i = 0; i < 8; i++) { const cx = zx - 1300 + ((i * 520 - lt * 30) % 3200 + 3200) % 3200; w += `<ellipse cx="${f1(cx)}" cy="${f1(zy - 560 + (i % 3) * 200)}" rx="${130 + (i % 2) * 70}" ry="48" fill="#fff" opacity=".95"/>`; }
  const top = n + 5;
  for (let i = Math.max(0, n - 4); i <= top; i++) { let ex = '';
    if (a.ph === 2 && i >= n + 3) { const born = (i - (n + 3)) / 2 + (1 - f) * 0.5, g = easeOutBack(clamp(1 - born + 0.2, 0, 1)); ex = ` transform="translate(0 ${f1((1 - g) * 500)})"`; }
    w += fStepBlock(sx(i), sy(i), SW, i < n, ex); }
  w += HALO(char({ goggles: 'none', vest: '#FF9A55', patch: false, tee: true, x: zx, y: zy, s: 0.62, sy: f < 0.4 && f > 0.25 ? 0.94 : 1 + 0.05 * Math.sin(m * Math.PI), t, pose: m > 0 && m < 1 ? '만세' : '서기', ex: fEx(a.ph === 1 ? 'z빵긋' : lt > D * 0.6 ? 'z당황' : lt > D * 0.3 ? 'z의심' : 'z빵긋'), seed: 3 }));
  if (a.ph === 2) w += fT(sx(top) + SW / 2, sy(top) - 40, '뿅', 44, '#3D7EC8', { stroke: '#fff', sw: 6 });
  return qCam(cam, w) + (a.ph === 1 ? fCard(t, lt, 0.3, 360, 150, '자유?', '') : '');
}
/* 그림자: 감옥 vs 번아웃 */
function fshadowScene(t, lt, a) {
  const tP = fAt(a, '감옥', 1.0), tB = fAt(a, '번아웃', 2.8), tD = fAt(a, '우울', 3.6);
  let h = `<rect x="-300" y="-200" width="2600" height="1500" fill="#26233A"/>`;
  const panel = (x, ttl, inner, t0) => lt < t0 - 0.4 ? '' : pop(t, t - lt + t0 - 0.4, t + 99, x, 500, `<g><rect x="-380" y="-330" width="760" height="660" rx="34" fill="#F3EEE3" stroke="${INK}" stroke-width="10"/>${fT(0, -260, ttl, 46, INK)}${inner}</g>`, {});
  const L = `<g transform="translate(0 30)">${fGrey(0, 220, 0.62, t, 1, { ex: fEx('z울먹'), pose: '서기' })}` + [-180, -110, -40, 30, 100, 170].map(x => `<rect x="${x}" y="-180" width="16" height="410" fill="#5B5B66" stroke="${INK}" stroke-width="4"/>`).join('') + `<rect x="-200" y="-196" width="400" height="22" fill="#5B5B66" stroke="${INK}" stroke-width="5"/></g>` + fT(0, 300, '감옥', 44, '#D63A3A');
  const R = `<g transform="translate(0 40) scale(.7) translate(-960 -880)">${fSofaBack() + fSofaFront() + fMelted(t, lt, 1, { ex: fEx('z기절') })}</g>` + (lt > tB ? fT(-120, 300, '번아웃', 44, '#3D7EC8') : '') + (lt > tD ? fT(130, 300, '우울', 44, '#7A6AA8') : '');
  return h + panel(540, '규율사회의 그림자', L, tP) + panel(1380, '성과사회의 그림자', R, tB);
}

/* ---------- 2막 ---------- */
// 같은 하루, 다시 보기: 장면마다 머리 위 코치가 확성기로 지시
function freplayScene(t, lt, a) {
  const D = a._dur || 5, ks = ['wake', 'subway', 'gym', 'night'], idx = Math.min(3, Math.floor(lt / (D / 4))), l2 = lt - idx * D / 4;
  window.F_EXTRA = (x, y, tt) => fCoach(tt, { x: x + 18, y: y - 500, s: 0.3, pose: '서기', ex: fEx(Math.floor(tt * 3) % 2 ? 'z결심' : 'z버럭'), look: [-0.5, 0.5], mega: true, megaSide: -1, megaTilt: 40, wave: true });
  const out = fWhip(l2, SHOT[ks[idx]](t, l2 + 0.8, 2));
  window.F_EXTRA = null;
  return out + fFull('#5B6478', 0.12) + `<g><rect x="1560" y="10" width="330" height="84" rx="16" fill="#120E1C" opacity=".9"/>${fT(1725, 66, '◀◀ 다시 보기', 40, '#fff')}</g>`;
}
// 사장 제로 vs 직원 제로
function fsplitScene(t, lt, a) {
  const tS = fAt(a, '동시에', 2.6), tE = fAt(a, '피착취자', 3.6), cam = [960, 600, 1.15], shock = lt > tS;
  let w = qShadow(560, 1000, 66) + Z({ x: 560, y: 1000, s: 1, t, collar: true, tie: '#1E2230', pose: shock ? '만세' : '턱괴기', ex: fEx(shock ? 'z충격' : 'z히죽'), look: shock ? [0.9, 0] : [0.6, 0], seed: 3 });
  w += qShadow(1360, 1000, 66) + Z({ x: 1360, y: 1000, s: 1, t, pose: shock ? '만세' : '서기', ex: fEx(shock ? 'z충격' : 'z당황'), look: shock ? [-0.9, 0] : [-0.4, 0], seed: 3 });
  w += `<line x1="960" y1="-100" x2="960" y2="1300" stroke="${INK}" stroke-width="10"/>`;
  if (lt < tS + 0.2) { w += pop(t, t - lt + 0.2, t + 9, 600, 340, bSpeech0('오늘 야근 가능?'), {}); if (lt > 1.0) w += pop(t, t - lt + 1.0, t + 9, 1320, 340, bSpeech0('넵!'), {}); }
  let over = fT(560, 140, '사장', 46, INK) + fT(1360, 140, '직원', 46, INK);
  if (lt > tE - 0.3) over += fCard(t, lt, tE - 0.3, 960, 860, '착취자 = 피착취자', '', '#E5484D');
  return fPlate('office', cam, 0.6) + fFull('#000', 0.15) + qCam(cam, w) + over + (shock && lt < tS + 0.6 ? fx(t, t - lt + tS, t + 9, 960, 300, '!!', '#FFE34D', { size: 100 }) : '');
}
// 일요일 오후 3시: 쉬는데 불안하다 (소파에 L자로 앉아서)
const NOTI = [['민지', '오운완! 오늘 10km 달림'], ['준호', '자격증 합격했다!!'], ['서연', '하프 마라톤 완주']];
const PHONE_SIT = Object.assign({}, P['f앉기'], { armL: [[148, 285], [146, 350], [182, 356]], hL: [186, 354], armR: [[252, 285], [254, 350], [218, 356]], hR: [214, 354] });
function fsundayScene(t, lt, a) {
  const ph = a.ph, cam = ph <= 2 ? qLerpCam(lt / 4, [960, 700, 1.2], [960, 690, 1.3]) : [960, 690, 1.3];
  let back = '', front = '', over = '';
  if (ph <= 3) {
    const melt = ph === 1 ? 0.3 : ph === 2 ? lerp(0.3, 0.05, clamp((lt - 1.6) / 0.6, 0, 1)) : 0.05;
    const sy = 1 - 0.42 * melt, sx = 1 + 0.22 * melt, x = SOFA.x, y = fSitY(sy);
    const ex = ph === 1 ? fEx('z뿌듯') : ph === 2 ? exprAt([[0, 'z뿌듯'], [0.5, 'z기본'], [1.4, 'z민망'], [2.3, 'z소름']], lt) : fEx('z소름');
    const holding = ph >= 2;
    back += Z({ x, y, s: 1, sx, sy, t, pose: holding ? PHONE_SIT : P['f앉기'], ex, look: holding ? [0, 0.7] : [0.3, -0.2], tilt: ph === 1 ? -6 : 0, seed: 3 });
    if (holding) back += phone(x, y + (354 - 560) * sy - 10, 0.42, { on: true, glow: 0.4 });
    if (ph === 1) { over += tag(t, t - lt + 0.2, t + 9, 300, 140, '일요일 오후 3시', '#FFE9A8', { size: 40 }); back += fT(x + 160, y - 470, '여유~', 40, '#E89A2E', { stroke: '#fff', sw: 6 }); }
    if (ph >= 2) NOTI.forEach(([n, s0], i) => { const t0 = ph === 2 ? 0.25 + i * 0.9 : -9; if (lt > t0) over += pop(t, t - lt + t0, t + 99, 1500, 260 + i * 150, `<g><rect x="-300" y="-56" width="600" height="112" rx="22" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="-240" cy="0" r="32" fill="${['#F0A0B8', '#9FC7F0', '#C7B0F0'][i]}" stroke="${INK}" stroke-width="4"/>${fT(-190, -8, n, 28, '#5B6478', { anchor: 'start', w: 700 })}${fT(-190, 32, s0, 32, INK, { anchor: 'start', w: 800 })}</g>`, {}); });
    if (ph === 3) { const [ax, ay] = [SOFA.x - 366, SOFA.S - 112], up = easeOutBack(clamp(lt / 0.5, 0, 1));
      E['_fw'] = Object.assign({}, qTalk('z히죽', env(t) * 0.6));
      front += `<defs><clipPath id="fArmClip"><rect x="${ax - 300}" y="-2000" width="600" height="${2000 + SOFA.S - 108}"/></clipPath></defs><g clip-path="url(#fArmClip)"><g transform="translate(0 ${f1((1 - up) * 160)})">` + fCoach(t, { x: ax, y: ay, s: 0.3, pose: Object.assign({}, P['서기'], { armR: [[252, 285], [300, 260], [282, 222]], hR: [278, 220] }), ex: fEx('_fw'), look: [0.9, 0.3] }) + `</g></g>`;
      for (let i = 0; i < 3; i++) { const k = (t * 0.8 + i / 3) % 1; front += `<path d="M${f1(ax + 70 + k * 160)} ${f1(ay - 120 - Math.sin(k * 6) * 10)} q12 -10 24 0 q12 10 24 0" fill="none" stroke="#B9A6E8" stroke-width="6" stroke-linecap="round" opacity="${f1((1 - k) * 100) / 100}"/>`; } }
  } else { // ph4: 벌떡 일어나 단어장을 집어 든다, 코치는 머리 위로
    const J = fJump(lt, 0.0, 0.5), x = SOFA.x - 80, y = SOFA.floor + 20;
    front += qShadow(x, y, 66) + Z({ x, y: y + J.dy, s: 1, sx: J.sx, sy: J.sy, t, pose: Object.assign({}, P['서기'], { armR: [[252, 285], [286, 330], [300, 370]], hR: [302, 372] }), ex: exprAt([[0, 'z당황'], [1.6, 'z기본']], lt), seed: 3 }) + `<g transform="translate(${x + 110} ${y + J.dy - 200}) rotate(-10)"><rect x="-44" y="-30" width="88" height="60" rx="6" fill="#fff" stroke="${INK}" stroke-width="5"/>${fT(0, 10, 'grit', 26, INK)}</g>`;
    front += fCoach(t, { x: x + 18, y: y + J.dy - 500, s: 0.3, pose: '서기', ex: fEx('z히죽'), look: [0.4, 0.4] });
    const tI = fAt(a, '안에', 4.2); if (lt > tI) over += fCard(t, lt, tI, 1440, 220, '감시자는 안에', '', '#7A6AA8');
  }
  return fRoom(cam, back, front) + fFull(ph >= 3 ? '#1C2340' : '#FFD9A0', ph >= 3 ? 0.18 : 0.1) + over;
}
// 화살이 돌아와 등에 꽂힌다
function farrowScene(t, lt, a) {
  const cam = [960, 600, 1.18], x = 760, y = 1000, ph = a.ph;
  let w = '', over = '';
  if (ph === 1) { const tO = fAt(a, '남이', 0.2), tM = fAt(a, '나라면', 3.0), boss = lt > tO && lt < tM;
    w += qShadow(x, y, 66) + Z({ x, y, s: 1, t, pose: Object.assign({}, P['서기'], { armR: [[252, 285], [320, 290], [380, 300]], hR: [388, 300] }), ex: fEx(boss ? 'z버럭' : lt > tM ? 'z기본' : 'z의심'), look: [0.9, 0], seed: 3 });
    w += `<g transform="translate(${x + 190} ${y - 260})"><line x1="-20" y1="0" x2="120" y2="0" stroke="#8A5A34" stroke-width="10"/><path d="M120 0 l-24 -14 l0 28 Z" fill="#B8C4D6" stroke="${INK}" stroke-width="4"/></g>`;
    if (boss) w += `<g opacity="${f1(clamp((lt - tO) / 0.3, 0, 1) * 100) / 100}">${fGrey(1400, 1000, 1, t, 2, { collar: true, tie: '#1E2230', ex: fEx('z히죽'), look: [-0.8, 0] })}</g>`;
    if (lt > tM) { w += `<rect x="1260" y="380" width="300" height="600" rx="20" fill="#CFE3F0" stroke="${INK}" stroke-width="10"/><g opacity=".8">${HALO(char({ goggles: 'none', vest: '#FF9A55', patch: false, tee: true, x: 1410, y: 960, s: 0.85, t, pose: '서기', ex: fEx('z기본'), look: [-0.9, 0], seed: 3 }))}</g>`; over += pop(t, t - lt + tM + 0.4, t + 9, 1100, 300, fT(0, 0, '?', 100, '#fff', { stroke: INK, sw: 12 }), {}); }
  } else if (ph === 2) { const tA = fAt(a, '화살', 0.8), tB = fAt(a, '돌아', 2.0), tP = fAt(a, '부족', 3.6), tG = fAt(a, '게을러', 6.4);
    const hit = lt > tB + 0.35, rec = hit ? Math.exp(-(lt - tB - 0.35) * 5) : 0;
    w += qShadow(x, y, 66) + Z({ x: x + rec * 30, y, s: 1, sy: hit ? 1 - 0.08 * clamp((lt - tB) / 1.5, 0, 1) : 1, rot: rec * 10, t, pose: '서기', ex: fEx(hit ? (lt > tP ? 'z울먹' : 'z충격') : 'z결심'), look: hit ? [0, 0.3] : [0.9, 0], seed: 3 });
    if (lt > tA && lt < tB + 0.35) { const k = (lt - tA) / (tB + 0.35 - tA), ang = k * Math.PI * 2, ax = x + 500 + Math.cos(ang - Math.PI) * 500, ay = y - 300 + Math.sin(ang - Math.PI) * 260;
      const dir = Math.atan2(Math.cos(ang - Math.PI) * 260, -Math.sin(ang - Math.PI) * 500) * 180 / Math.PI;
      w += `<g transform="translate(${f1(ax)} ${f1(ay)}) rotate(${f1(dir)})"><line x1="-70" y1="0" x2="70" y2="0" stroke="#8A5A34" stroke-width="10"/><path d="M70 0 l-24 -14 l0 28 Z" fill="#B8C4D6" stroke="${INK}" stroke-width="4"/><path d="M-70 0 l-18 -12 M-70 0 l-18 12" stroke="#E5484D" stroke-width="7"/></g>`; }
    if (hit) { const [ax0, ay0] = ptOf(x + rec * 30, y, 1, 136, 330); w += `<g transform="translate(${f1(ax0)} ${f1(ay0)}) rotate(${f1(205 + rec * 10)})"><line x1="0" y1="0" x2="150" y2="0" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><line x1="0" y1="0" x2="150" y2="0" stroke="#B07A44" stroke-width="9" stroke-linecap="round"/><path d="M150 0 l22 -18 l12 0 l-18 18 l18 18 l-12 0 Z" fill="#E5484D" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>`; over += lt < tB + 1.2 ? fx(t, t - lt + tB + 0.35, t + 9, 640, 340, '퍽!', '#fff', { size: 74 }) : ''; }
    if (lt > tP) w += pop(t, t - lt + tP, t + 99, x - 330, y - 520, label(0, 0, '내가 부족해서', { size: 34, bg: '#D5DAE3' }), { rot: -8 });
    if (lt > tG) w += pop(t, t - lt + tG, t + 99, x + 300, y - 400, label(0, 0, '게을러서', { size: 34, bg: '#D5DAE3' }), { rot: 8 });
  } else { const tU = fAt(a, '고유한', 2.8);
    w += qShadow(x, y, 66) + Z({ x, y: y + 20, s: 1, sy: 0.92, t, pose: '웅크림', ex: fEx('z울먹'), look: [0, 0.6], seed: 3 }) + `<g transform="translate(${x} ${f1(y - 540 + Math.sin(t) * 6)})"><ellipse cx="0" cy="0" rx="150" ry="58" fill="#9AA6B8" stroke="${INK}" stroke-width="7"/>` + [-60, -20, 20, 60].map((dx, i) => { const p2 = (t * 1.6 + i * 0.27) % 1, yy = 60 + p2 * 30; return p2 < 0.85 ? `<line x1="${dx}" y1="${f1(yy)}" x2="${dx - 3}" y2="${f1(yy + 16)}" stroke="#7EC8F0" stroke-width="6" stroke-linecap="round"/>` : `<path d="M${dx - 12} 104 l-6 -8 M${dx + 4} 104 l6 -8" stroke="#7EC8F0" stroke-width="4" stroke-linecap="round"/>`; }).join('') + `</g>`;
    if (lt > tU) over += fCard(t, lt, tU, 1360, 260, '우울', '긍정이 넘쳐 나는 사회의 병', '#7A6AA8');
  }
  return fPlate('office', cam, 0.6) + fFull('#1C2340', ph === 3 ? 0.4 : 0.2) + qCam(cam, w) + over;
}
// 다람쥐와 멀티태스킹
function fSquirrel(x, y, s, t, alert) { const look = alert ? Math.sin(t * 12) * 18 : 0;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M60 40 Q170 20 150 -120 Q140 -210 70 -200 Q120 -150 100 -80 Q90 -10 30 10 Z" fill="#B87A44" stroke="${INK}" stroke-width="8"/><ellipse cx="0" cy="20" rx="70" ry="80" fill="#C98A50" stroke="${INK}" stroke-width="8"/><ellipse cx="0" cy="40" rx="40" ry="50" fill="#F2D8B0"/>` +
    `<g transform="rotate(${f1(look)} 0 -60)"><circle cx="0" cy="-80" r="56" fill="#C98A50" stroke="${INK}" stroke-width="8"/><path d="M-40 -120 L-30 -160 L-12 -126 Z M40 -120 L30 -160 L12 -126 Z" fill="#C98A50" stroke="${INK}" stroke-width="6"/><circle cx="-20" cy="-86" r="9" fill="${INK}"/><circle cx="20" cy="-86" r="9" fill="${INK}"/><circle cx="-17" cy="-90" r="3" fill="#fff"/><circle cx="23" cy="-90" r="3" fill="#fff"/><ellipse cx="0" cy="-66" rx="8" ry="5" fill="${INK}"/></g>` +
    `<g transform="translate(0 -10)"><ellipse cx="0" cy="0" rx="22" ry="26" fill="#9A6A3E" stroke="${INK}" stroke-width="5"/><path d="M-22 -8 Q0 -30 22 -8" fill="#6A4424" stroke="${INK}" stroke-width="5"/></g></g>`; }
function fsquirrelScene(t, lt, a) {
  const ph = a.ph;
  if (ph === 2) { const tR = fAt(a, '퇴보', 2.6); return SHOT.lunch(t, 1.5, 2) + fFull('#000', 0.35) + fCard(t, lt, 0.3, 960, 190, '멀티태스킹 = 진보?', '한병철: 오히려 퇴보', '#E5484D') + (lt > tR ? pop(t, t - lt + tR, t + 9, 1380, 190, fT(0, 40, '↓', 130, '#E5484D', { stroke: '#fff', sw: 10 }), {}) : ''); }
  if (ph === 1) { const tM = fAt(a, '메일', 2.6), tL = fAt(a, '강의', 3.6); let h = SHOT.lunch(t, 1.5, 2);
    if (lt > tM) h += pop(t, t - lt + tM, t + 99, 440, 300, label(0, 0, '✉ 메일', { size: 44, bg: '#fff' }), {});
    if (lt > tL) h += pop(t, t - lt + tL, t + 99, 440, 420, label(0, 0, '▶ 강의', { size: 44, bg: '#fff' }), {});
    return h; }
  const tW = fAt(a, '경계', 2.4), alert = (lt > tW && lt < tW + 1.2) || (lt > tW + 1.6 && Math.floor(lt * 1.5) % 2 === 0);
  const lx = alert ? Math.sin(t * 12) * 10 : 0;
  const right = `<rect x="-300" y="-200" width="2600" height="1500" fill="#CFE8C4"/><rect x="-300" y="820" width="2600" height="600" fill="#9BC48A"/><path d="M-200 870 Q600 810 2200 890" stroke="#7A5634" stroke-width="40" fill="none"/>` + [500, 1420].map((tx, i) => `<rect x="${tx - 30}" y="200" width="60" height="660" fill="#8A6A4E" stroke="${INK}" stroke-width="8"/><circle cx="${tx}" cy="220" r="${200 + i * 30}" fill="#7DBB6A" stroke="${INK}" stroke-width="8"/>`).join('') + fSquirrel(960, 760, 2.2, t, alert);
  return `<svg x="-140" y="-20" width="1100" height="1240" viewBox="410 -20 1100 1240"><g transform="translate(${f1(lx)} 0)">${SHOT.lunch(t, 1.5, 2)}</g></svg><svg x="960" y="-20" width="1100" height="1240" viewBox="410 -20 1100 1240">${right}</svg><line x1="960" y1="-100" x2="960" y2="1300" stroke="${INK}" stroke-width="12"/>` + (alert ? fx(t, t - lt + tW, t + 9, 960, 200, '흠칫!', '#FFE34D', { size: 64 }) : '');
}

/* ---------- 3막 ---------- */
const DESK_TOP = 800;
function fDeskRoom(cam, w, o = {}) { return fPlate('desknight', cam, 0.6) + qCam(cam, w) + fFull('#0A1238', o.dark == null ? 0.2 : o.dark); }
function fburstScene(t, lt, a) {
  const ph = a.ph, x = 820, y = 980, cx = 1220, cy = DESK_TOP - 22;
  const cam = ph === 1 ? [1000, 620, 1.3] : qLerpCam(ph === 2 ? lt / 1.8 : 1, [1000, 620, 1.3], [cx, cy - 80, 3.0]);
  E['_fz'] = Object.assign({}, qTalk('z버럭', env(t)));
  E['_fk'] = Object.assign({}, qTalk('z코치지침', env(t) * 0.7));
  let w = qShadow(x, y, 66) + Z({ x, y, s: 1, t, pose: ph === 1 ? Object.assign({}, P['서기'], { armR: [[252, 285], [320, 260], [380, 240]], hR: [388, 238] }) : '서기', ex: ph === 1 ? fEx('_fz') : fEx('z기본'), look: [0.9, 0.2], seed: 3 });
  w += fDesk(980, 1460, DESK_TOP, '#B88A62') + fLaptop(1080, DESK_TOP - 22, 0.8, '') + [0, 1, 2].map(i => `<rect x="1300" y="${DESK_TOP - 38 - i * 18}" width="120" height="16" fill="#fff" stroke="${INK}" stroke-width="4"/>`).join('');
  const flinch = ph === 1 && lt > 0.3 ? Math.exp(-(lt - 0.3) * 4) : 0;
  const tilt = ph === 3 ? lerp(10, 70, clamp(lt / 1.2, 0, 1)) : 10;
  w += fCoach(t, { x: cx + flinch * 20, y: cy, s: 0.32, sy: 1 - flinch * 0.12, pose: '서기', ex: ph === 1 ? fEx('z충격') : ph === 2 ? fEx('z코치지침') : fEx('_fk'), look: [-0.7, 0.1], mega: true, megaSide: -1, megaTilt: tilt });
  if (ph >= 2) w += `<path d="M${cx - 64} ${cy - 128} l-8 10 l6 4 l-8 10" stroke="${INK}" stroke-width="3" fill="none"/>`;
  const over = ph === 1 && lt > 0.2 ? fx(t, t - lt + 0.2, t + 9, 760, 260, '버럭!', '#FF6B3D', { size: 70 }) : '';
  return fDeskRoom(cam, w, { dark: ph === 1 ? 0.2 : 0.35 }) + over + (ph >= 2 ? fFull('#3A4A7A', 0.12) : '');
}
// 손바닥 위의 코치: 제로가 손을 내밀면 코치가 책상에서 손바닥으로 건너와 앉는다
const PALM = { x: 820, y: 1160, s: 1.25, hand: [424, 344] }, PALM_DESK = 894; // desk top surface (PALM_DESK - 22) ≈ palm height
function fPalmBase(t, lt, o) {
  const { x, y, s } = PALM, out = o.out == null ? 1 : o.out, hl = [lerp(262, PALM.hand[0], out), lerp(400, PALM.hand[1], out)];
  const pose = Object.assign({}, P['서기'], { armR: [[252, 285], [lerp(282, 330, out), lerp(344, 340, out)], hl], hR: hl }, o.armL ? { armL: o.armL, hL: o.armL[2] } : {});
  let w = fDesk(1200, 1760, PALM_DESK, '#B88A62') + `<rect x="1540" y="${PALM_DESK - 70}" width="140" height="48" rx="6" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
  w += Z({ x, y, s, t, pose, ex: o.ex, look: o.look || [0.8, 0.6], tilt: o.tilt || 0, seed: 3 });
  const [px, py] = ptOf(x, y, s, hl[0], hl[1]);
  if (out > 0.6) w += `<path d="M${f1(px - 60)} ${f1(py - 18)} Q${f1(px)} ${f1(py - 34)} ${f1(px + 70)} ${f1(py - 20)} Q${f1(px + 82)} ${f1(py - 4)} ${f1(px + 60)} ${f1(py + 6)} Q${f1(px)} ${f1(py + 14)} ${f1(px - 60)} ${f1(py + 4)} Z" fill="#fff" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M${f1(px + 30)} ${f1(py - 22)} l0 18 M${f1(px + 50)} ${f1(py - 21)} l0 16" stroke="#C9D6E2" stroke-width="4" stroke-linecap="round"/>`;
  return { w, px, py, palmTop: py - 26 };
}
function fpalmScene(t, lt, a) {
  const ph = a.ph, cam = [1000, 760, 1.45], cs = 0.42;
  const out = ph === 1 ? easeOut(clamp((lt - 0.3) / 0.6, 0, 1)) : 1;
  const ex = ph === 1 ? exprAt([[0, 'z민망'], [0.9, 'z울먹']], lt) : ph === 2 ? exprAt([[0, 'z울먹'], [fAt(a, '마음', 3.0), 'z기본']], lt) : exprAt([[0, 'z기본'], [fAt(a, '잘못', 2.0), 'z빵긋']], lt);
  const tN = ph === 3 ? fAt(a, '없애', 6.4) : 99, nod = lt > tN ? Math.sin((lt - tN) * 12) * 6 * Math.max(0, 1 - (lt - tN)) : 0;
  const B = fPalmBase(t, lt, { out, ex, tilt: nod });
  let w = B.w; const sitY = fCoachSitY(B.palmTop, cs);
  if (ph === 1) { const deskY = PALM_DESK - 22, walk = clamp((lt - 1.0) / 0.8, 0, 1), sit = clamp((lt - 1.85) / 0.3, 0, 1);
    const cx = lerp(1440, B.px + 6, easeInOut(walk)), cy = walk < 1 ? lerp(deskY, B.palmTop, easeInOut(walk)) - Math.sin(walk * Math.PI) * 40 : lerp(B.palmTop, sitY, sit);
    w += fCoach(t, { x: cx, y: cy, s: cs, sy: sit > 0 && sit < 1 ? 1 - 0.1 * Math.sin(sit * Math.PI) : 1, pose: sit > 0.5 ? P['f앉기'] : walk > 0 && walk < 1 ? walkPose(lt * 8, 0.6) : '서기', ex: fEx(lt < 1.0 ? 'z코치지침' : 'z울먹'), look: [-0.6, -0.3] });
  } else {
    w += `<circle cx="${f1(B.px + 6)}" cy="${f1(B.palmTop - 70)}" r="${f1(150 + Math.sin(t * 2) * 8)}" fill="#FFD9A0" opacity=".18"/>`;
    w += fCoach(t, { x: B.px + 6, y: sitY, s: cs, pose: P['f앉기'], ex: ph === 2 ? exprAt([[0, 'z울먹'], [fAt(a, '마음', 3.0), 'z민망']], lt) : fEx('z기본'), look: [-0.6, -0.3] });
  }
  return fDeskRoom(cam, w, { dark: 0.3 }) + warm(ph === 1 ? 0.2 * out : ph === 2 ? 0.3 + 0.3 * prog(lt, 0, 3) : 0.6);
}
// "오늘은, 아니." — 확성기를 살며시 내려 준다
function fnoScene(t, lt, a) {
  const ph = a.ph, push = ph === 1 ? easeInOut(clamp(lt / 0.6, 0, 1)) : 1;
  E['_fz2'] = Object.assign({}, qTalk('z기본', env(t)));
  const reach = ph === 1 && lt < 1.6 ? push : ph === 1 ? 1 - clamp((lt - 1.6) / 0.5, 0, 1) : 0;
  const armL = [[148, 285], [lerp(118, 250, reach), lerp(345, 340, reach)], [lerp(112, 352, reach), lerp(400, 318, reach)]];
  const B = fPalmBase(t, lt, { ex: ph === 1 ? fEx('_fz2') : exprAt([[0, 'z기본'], [0.4, 'z빵긋']], lt), armL });
  let w = B.w; const sitY = fCoachSitY(B.palmTop, 0.42);
  const down = ph === 1 ? clamp((lt - 0.4) / 0.7, 0, 1) : 1, relief = ph > 1 || lt > 1.2;
  w += fCoach(t, { x: B.px + 6, y: sitY, s: 0.42, sy: relief ? 0.97 : 1, pose: P['f앉기'], ex: fEx(ph === 1 ? (lt < 1.2 ? 'z충격' : 'z뿌듯') : 'z기본'), look: [-0.6, -0.3], mega: true, megaSide: -1, megaTilt: lerp(-10, 75, easeInOut(down)) });
  if (ph === 1 && lt > 1.2 && lt < 2.2) w += puff(B.px + 40, B.palmTop - 170, t, t - lt + 1.2, 0.6, '#fff');
  let over = '';
  if (ph >= 2) over += fCard(t, lt, ph === 2 ? 0.2 : -9, 1500, 190, '힌트 1', '아니라고 말하는 힘', '#3DBA8A');
  if (ph === 3) { const tS = fAt(a, '보는', 2.6); if (lt > tS) over += pop(t, t - lt + tS, t + 99, 1500, 500, `<g><rect x="-330" y="-120" width="660" height="240" rx="26" fill="#fff" stroke="${INK}" stroke-width="8"/><g transform="translate(-230 96)">${HALO(NZ({ t, seed: 83, x: 0, y: 0, s: 0.4, pose: '서기' }))}</g>${fT(60, -20, '보는 법을 배운다', 36, INK)}${fT(60, 30, '= 아니라고 말하는 법', 36, '#3DBA8A')}${fT(60, 80, '니체', 26, '#5B6478', { w: 700 })}</g>`, {}); }
  return fDeskRoom([1000, 760, 1.45], w, { dark: 0.28 }) + warm(0.6) + over;
}
// 오늘 안 할 일
function fnolistScene(t, lt, a) {
  const tK = fAt(a, '하지', 2.0), items = ['영어 단어 50개', '헬스 1시간', '부업 강의', '보고서 정리', '빨래'], moving = [0, 1, 2], TOP = 250;
  let h = `<rect x="-300" y="-200" width="2600" height="1500" fill="#F3EEE3"/><rect x="-300" y="-200" width="2600" height="1500" fill="url(#paper)"/>`;
  h += `<rect x="240" y="${TOP}" width="620" height="640" rx="20" fill="#fff" stroke="${INK}" stroke-width="8"/>${fT(550, TOP + 70, '할 수 있는 일', 46, INK)}<rect x="1060" y="${TOP}" width="620" height="640" rx="20" fill="#E9F7EF" stroke="${INK}" stroke-width="8"/>${fT(1370, TOP + 70, '오늘 안 할 일', 46, '#3DBA8A')}`;
  items.forEach((s0, i) => { const mi = moving.indexOf(i), t0 = tK + mi * 0.35, k = mi < 0 ? 0 : easeInOut(clamp((lt - t0) / 0.5, 0, 1));
    const x = lerp(300, 1120, k), y = lerp(TOP + 150 + i * 100, TOP + 150 + mi * 100, k) - Math.sin(k * Math.PI) * 80;
    h += `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="0" y="-38" width="500" height="76" rx="16" fill="${k > 0.5 ? '#fff' : '#F7F9FC'}" stroke="${INK}" stroke-width="5"/><rect x="20" y="-16" width="32" height="32" rx="6" fill="#fff" stroke="${INK}" stroke-width="4"/>${fT(74, 12, s0, 34, INK, { anchor: 'start', w: 700 })}</g>`;
    if (mi >= 0 && lt > t0 && lt < t0 + 0.5) h += fx(t, t - lt + t0, t + 9, f1(x + 560), f1(y), '쏙', '#3DBA8A', { size: 40 }); });
  h += fCoach(t, { x: 1600, y: fCoachSitY(TOP, 0.3), s: 0.3, pose: P['f앉기'], ex: fEx(lt > tK + 1 ? 'z뿌듯' : 'z기본'), look: [-0.6, 0.4] });
  return h;
}
// 깊은 심심함: 의자에 앉아 멍하니, 새가 머리 위에서 알을 품는다
function fChairBack(x, y) { return `<rect x="${x - 120}" y="${y - 300}" width="240" height="250" rx="30" fill="#8A6A4E" stroke="${INK}" stroke-width="9"/>`; }
function fChairFront(x, y) { return `<rect x="${x - 140}" y="${y - 60}" width="280" height="40" rx="12" fill="#A9825E" stroke="${INK}" stroke-width="9"/><g stroke="${INK}" stroke-width="12" stroke-linecap="round"><line x1="${x - 110}" y1="${y - 20}" x2="${x - 116}" y2="${y + 110}"/><line x1="${x + 110}" y1="${y - 20}" x2="${x + 116}" y2="${y + 110}"/></g>`; }
function fbirdScene(t, lt, a) {
  const ph = a.ph, cx = 1040, seat = 880, cam = ph === 3 ? qLerpCam(lt / 4, [960, 640, 1.3], [1000, 600, 1.42]) : [960, 660, 1.25];
  let w = fChairBack(cx, seat) + fChairFront(cx, seat);
  const y0 = seat - 60 - 12 + 148;
  let ex = fEx('z기본'), look = [-0.6, -0.3];
  if (ph === 1) ex = exprAt([[0, 'z결심'], [1.0, 'z기본']], lt);
  if (ph === 2) { const fid = lt < 1.6; ex = fid ? exprAt([[0, 'z민망'], [0.8, 'z의심']], lt) : fEx('z기본'); look = fid ? [Math.sin(t * 5) * 0.9, -0.2] : [-0.6, -0.4]; }
  if (ph === 3) ex = exprAt([[0, 'z기본'], [fAt(a, '깊어', 2.6), 'z반짝']], lt);
  const tap = ph === 2 && lt < 1.6 ? (Math.floor(t * 10) % 2) * 8 : 0;
  w += Z({ x: cx, y: y0, s: 1, sy: ph >= 2 && lt > 1.6 ? 1 + 0.02 * Math.sin(t * 1.4) : 1, t, pose: Object.assign({}, P['f앉기'], { hR: [284, 396 - tap], armR: [[252, 285], [282, 344], [282, 394 - tap]] }), ex, look, seed: 3 });
  w += fDesk(420, 860, DESK_TOP, '#B88A62') + `<rect x="600" y="${DESK_TOP + 10}" width="200" height="70" rx="8" fill="#9A7050" stroke="${INK}" stroke-width="6"/><circle cx="700" cy="${DESK_TOP + 45}" r="8" fill="#5A3A22"/>`;
  if (ph === 1) { const k = clamp(lt / 0.8, 0, 1); if (k < 1) w += `<g transform="translate(${f1(lerp(cx - 120, 700, k))} ${f1(lerp(600, DESK_TOP + 40, k) - Math.sin(k * Math.PI) * 120)}) rotate(${f1(k * 300)})"><rect x="-30" y="-50" width="60" height="100" rx="10" fill="#1F2D44" stroke="${INK}" stroke-width="5"/></g>`; }
  w += fCoach(t, { x: 760, y: fCoachSitY(DESK_TOP - 22, 0.3), s: 0.3, pose: P['f앉기'], ex: fEx(ph >= 2 && lt > 1.6 ? 'z졸음' : 'z기본'), look: [0.6, -0.2] });
  const headTop = [cx, y0 - 502];
  if (ph >= 2) { const tL = ph === 2 ? fAt(a, '꿈의', 3.0) - 0.8 : -9, k = clamp((lt - tL) / 0.8, 0, 1);
    const bx = lerp(1600, headTop[0] + 10, easeOut(k)), by = lerp(200, headTop[1] - 30, easeOut(k)) - Math.sin(k * Math.PI) * 60, flap = k < 1 ? Math.sin(t * 30) * 20 : 0;
    if (k >= 1) { const glow = 0.5 + 0.5 * Math.sin(t * 3); w += `<circle cx="${headTop[0] - 40}" cy="${headTop[1] - 8}" r="${f1(34 + glow * 10)}" fill="#FFE34D" opacity=".25"/><ellipse cx="${headTop[0] - 40}" cy="${headTop[1] - 8}" rx="16" ry="20" fill="#FFF6D8" stroke="${INK}" stroke-width="4"/>`; }
    if (ph === 3 || k > 0) w += `<g transform="translate(${f1(bx)} ${f1(by)})"><ellipse cx="0" cy="0" rx="44" ry="34" fill="#7EC8F0" stroke="${INK}" stroke-width="6"/><circle cx="34" cy="-22" r="22" fill="#7EC8F0" stroke="${INK}" stroke-width="6"/><circle cx="40" cy="-26" r="4" fill="${INK}"/><path d="M54 -20 l14 4 l-14 4 Z" fill="#FFB547" stroke="${INK}" stroke-width="3"/><path d="M-10 -10 q-30 ${f1(-20 - flap)} -50 -6" fill="#5BA8D8" stroke="${INK}" stroke-width="5"/></g>`;
    if (ph === 3) { const tI = fAt(a, '깊어', 2.6); if (lt > tI) w += pop(t, t - lt + tI, t + 99, headTop[0] - 200, headTop[1] - 60, `<g><circle r="40" fill="#FFE34D" stroke="${INK}" stroke-width="6"/><rect x="-16" y="36" width="32" height="20" fill="#B8C4D6" stroke="${INK}" stroke-width="4"/></g>`, {}) + rSparks(headTop[0] - 200, headTop[1] - 60, t, 8, 110, '#FFE34D'); } }
  const over = ph === 1 ? fCard(t, lt, 0.9, 520, 200, '힌트 2', '깊은 심심함', '#7EC8F0') : '';
  return fPlate('desknight', cam, 0.6) + qCam(cam, w) + fFull('#0A1238', 0.15) + warm(0.35) + over;
}
// 편의점 앞 벤치: 함께 지치기. 두 코치는 등받이로 내려와 서로 기대어 존다
function fbenchScene(t, lt, a) {
  const ph = a.ph, bx = 960, seat = 860, cam = ph === 1 ? qLerpCam(lt / 3, [960, 640, 1.15], [960, 660, 1.25]) : [960, 650, 1.28];
  const zx = 800, hx = 1130, y0 = seat - 12 + 148 - 10, cs = 0.28, RAIL = seat - 200;
  const rail = `<rect x="${bx - 380}" y="${RAIL}" width="760" height="40" rx="14" fill="#8FB8D6" stroke="${INK}" stroke-width="8"/><rect x="${bx - 380}" y="${seat - 140}" width="760" height="40" rx="14" fill="#8FB8D6" stroke="${INK}" stroke-width="8"/>`;
  const seatG = `<rect x="${bx - 400}" y="${seat - 22}" width="800" height="40" rx="14" fill="#A9CBE4" stroke="${INK}" stroke-width="8"/><g stroke="${INK}" stroke-width="12" stroke-linecap="round"><line x1="${bx - 340}" y1="${seat + 18}" x2="${bx - 340}" y2="${seat + 120}"/><line x1="${bx + 340}" y1="${seat + 18}" x2="${bx + 340}" y2="${seat + 120}"/></g>`;
  const zEx = ph === 1 ? exprAt([[0, 'z기본'], [1.4, 'z당황'], [2.0, 'z민망']], lt) : ph === 4 ? exprAt([[0, 'z기본'], [0.4, 'z빵긋']], lt) : fEx('z기본');
  const hEx = ph === 1 ? exprAt([[0, 'z졸음'], [1.4, 'z당황'], [2.0, 'z민망']], lt) : ph === 4 ? exprAt([[0, 'z기본'], [0.5, 'z빵긋']], lt) : fEx('z기본');
  const tT = fAt(a, '나눔', 2.85) - 0.3, toast = ph === 4 && lt > tT ? easeOutBack(clamp((lt - tT) / 0.4, 0, 1)) : 0;
  const can = (x, y, c) => `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="-16" y="-34" width="32" height="56" rx="6" fill="${c}" stroke="${INK}" stroke-width="5"/><rect x="-16" y="-34" width="32" height="10" fill="#C9D3E0"/></g>`;
  const zPose = Object.assign({}, P['f앉기'], toast ? { armR: [[252, 285], [300, 260], [lerp(300, 340, toast), 220]], hR: [lerp(300, 340, toast), 216] } : {});
  const hPose = Object.assign({}, P['f앉기L'], toast ? { armL: [[148, 285], [100, 260], [lerp(100, 60, toast), 220]], hL: [lerp(100, 60, toast), 216] } : {});
  const hop = ph === 1 ? 0 : ph === 2 ? clamp((lt - 1.0) / 0.6, 0, 1) : 1, sat = hop >= 1;
  const cEx = ph === 1 ? 'z결심' : ph === 2 ? (lt < 1.0 ? 'z당황' : lt < 2.2 ? 'z하품' : 'z졸음') : 'z졸음';
  const lean = ph === 2 ? clamp((lt - 2.2) / 0.8, 0, 1) : ph > 2 ? 1 : 0;
  const LAP = y0 + (408 - 560) * 0.95 - 6; // thigh top of the L-sitting pair: the coaches hop down onto their owners' laps
  const coach = (side) => { const sx0 = side < 0 ? zx + 17 : hx - 17, sy0 = y0 - 500 * 0.95, ex0 = side < 0 ? 884 : 1046, ey0 = fCoachSitY(LAP, cs);
    const x = lerp(sx0, ex0, easeInOut(hop)), y = lerp(sy0, ey0, easeInOut(hop)) - Math.sin(hop * Math.PI) * 90;
    return fCoach(t, Object.assign({ x, y, s: cs, rot: -side * 22 * lean, pose: sat ? (side < 0 ? P['f앉기L'] : P['f앉기']) : '서기', ex: fEx(cEx), look: [-side * 0.9, 0] }, side > 0 ? { vest: '#FF7FA8' } : {})); };
  let body = rail + seatG;
  body += Z({ x: zx, y: y0, s: 0.95, t, pose: zPose, ex: zEx, look: ph === 2 && lt < 1.6 ? [0.2, -0.9] : [0.8, 0], seed: 3 });
  body += zGirl({ hairStyle: 'pony', top: '#FF9AB0', x: hx, y: y0, s: 0.95, t, pose: hPose, ex: hEx, look: ph === 2 && lt < 1.6 ? [-0.2, -0.9] : [-0.8, 0], seed: 51 });
  if (toast) { const [zhx, zhy] = ptOf(zx, y0, 0.95, lerp(300, 340, toast), 216), [hhx, hhy] = ptOf(hx, y0, 0.95, lerp(100, 60, toast), 216); body += can(zhx, zhy - 20, '#E5484D') + can(hhx, hhy - 20, '#3D7EC8'); }
  body += coach(-1) + coach(1);
  if (lean > 0.6) body += fT(965, LAP - 150, 'z z', 40, '#fff', { stroke: INK, sw: 6 });
  let over = '';
  if (ph === 1) over += fCard(t, lt, 0.2, 1500, 160, '힌트 3', '함께 지치기', '#FF9AB0');
  if (ph === 3) { const tA = fAt(a, '탈진', 1.6), tB = fAt(a, '이어', 3.4);
    if (lt > tA) over += pop(t, t - lt + tA, t + 99, 470, 220, `<g><rect x="-250" y="-90" width="500" height="180" rx="24" fill="#D5DAE3" stroke="${INK}" stroke-width="7"/>${fT(0, -20, '탈진의 피로', 40, INK)}${fT(0, 36, '혼자 가둔다', 30, '#5B6478', { w: 700 })}</g>`, {});
    if (lt > tB) over += pop(t, t - lt + tB, t + 99, 1450, 220, `<g><rect x="-250" y="-90" width="500" height="180" rx="24" fill="#FFE9A8" stroke="${INK}" stroke-width="7"/>${fT(0, -20, '이어 주는 피로', 40, INK)}${fT(0, 36, '함께 나눈다', 30, '#8A6A2E', { w: 700 })}</g>`, {}); }
  if (toast > 0 && lt < tT + 0.9) over += fx(t, t - lt + tT + 0.3, t + 9, 960, 400, '탁!', '#FFE34D', { size: 60 });
  return fPlate('cvs', cam, 0.6) + qCam(cam, body) + warm(ph === 4 ? 0.6 : 0.3) + over;
}

/* ---------- 열린 결말 ---------- */
function fcrumpleScene(t, lt, a) {
  const tP = fAt(a, '순간', 2.6), tC = fAt(a, '성과', 4.4), x = 820, y = 980, cam = [1000, 640, 1.35];
  const written = Math.min(4, Math.floor(clamp((lt - 0.3) / 1.4, 0, 1) * 4)), crush = clamp((lt - tC + 0.25) / 0.3, 0, 1), toss = clamp((lt - tC - 0.1) / 0.7, 0, 1);
  const pin = toss > 0 ? 0 : crush, hx = lerp(70, 170, pin), hx2 = lerp(330, 230, pin);
  const pose = toss > 0 ? Object.assign({}, P['서기'], { armR: [[252, 285], [320, lerp(330, 250, toss)], [360, lerp(380, 200, toss)]], hR: [364, lerp(384, 196, toss)] }) : Object.assign({}, P['서기'], { armL: [[148, 285], [100, 352], [hx, 420]], hL: [hx, 420], armR: [[252, 285], [300, 352], [hx2, 420]], hR: [hx2, 420] });
  let w = qShadow(x, y, 66) + Z({ x, y, s: 1, t, pose, ex: exprAt([[0, 'z기본'], [tP, 'z의심'], [tC, 'z빵긋']], lt), look: toss > 0 ? [0.8, 0.2] : [0, 0.8], seed: 3 }) + fDesk(1080, 1520, DESK_TOP, '#B88A62');
  const [pcx, pcy] = ptOf(x, y, 1, 200, 410);
  if (crush < 1 && toss <= 0) { const k = 1 - crush;
    w += `<g transform="translate(${f1(pcx)} ${f1(pcy)}) scale(${f1(k * 100) / 100} ${f1((0.3 + 0.7 * k) * 100) / 100})"><rect x="-130" y="-95" width="260" height="190" rx="10" fill="#FBF7EE" stroke="${INK}" stroke-width="7"/>` + ['영어 단어', '헬스', '부업 강의'].map((s0, i) => fT(-104, -52 + i * 40, '☑ ' + s0, 26, '#9AA1AE', { anchor: 'start', w: 700 })).join('') + fT(-104, 76, '□ ' + '푹 쉬기'.slice(0, written), 30, INK, { anchor: 'start' }) + `</g>`;
    w += hand(...ptOf(x, y, 1, hx, 420), 1) + hand(...ptOf(x, y, 1, hx2, 420), 1); }
  const ball = (bx, by, r) => `<g transform="translate(${f1(bx)} ${f1(by)}) rotate(${f1(r)})"><path d="M-40 -10 Q-30 -44 0 -40 Q40 -36 38 0 Q44 36 6 40 Q-36 42 -40 10 Z" fill="#FBF7EE" stroke="${INK}" stroke-width="6"/><path d="M-20 -10 L8 4 L-6 20 M12 -20 L20 10" stroke="${INK}" stroke-width="3" fill="none"/></g>`;
  if (crush >= 1 && toss <= 0) w += ball(pcx, pcy, 0);
  if (toss > 0 && toss < 1) { const [sx0, sy0] = ptOf(x, y, 1, 364, 196); w += ball(lerp(sx0, 1640, toss), lerp(sy0, 900, toss) - Math.sin(toss * Math.PI) * 260, toss * 500); }
  w += `<path d="M1580 900 L1700 900 L1684 1040 L1596 1040 Z" fill="#8E97A6" stroke="${INK}" stroke-width="8"/>`;
  w += fCoach(t, { x: 1380, y: fCoachSitY(DESK_TOP - 22, 0.3), s: 0.3, pose: P['f앉기'], ex: fEx(lt > tC + 0.8 ? 'z뿌듯' : 'z기본'), look: [-0.6, -0.1] });
  return fDeskRoom(cam, w, { dark: 0.25 }) + (toss >= 1 && lt < tC + 1.5 ? fx(t, t - lt + tC + 0.6, t + 9, 1560, 640, '쏙', '#fff', { size: 50 }) : '');
}
// 새벽 5시: 침대(정면) → 버튼 앞에서 멈춘 손가락 → 암전
function fdawn5Scene(t, lt, a) {
  const ph = a.ph, D = a._dur || 4;
  if (ph === 1) { const cam = qLerpCam(lt / 3.6, [980, 700, 1.3], [1000, 690, 1.45]);
    const ring = lt > 0.2 && lt < 3.0, eyes = lt > 0.8, reach = clamp((lt - 1.9) / 0.7, 0, 1), stop = lt > 2.6;
    let w = `<rect x="620" y="440" width="680" height="330" rx="44" fill="#5B6B9A" stroke="${INK}" stroke-width="9"/><rect x="650" y="470" width="620" height="40" rx="16" fill="#6E7EB0"/>`;
    w += `<rect x="1340" y="760" width="220" height="300" rx="10" fill="#4A3A5A" stroke="${INK}" stroke-width="8"/><line x1="1340" y1="860" x2="1560" y2="860" stroke="${INK}" stroke-width="5"/>`;
    const sh = ring ? Math.sin(t * 60) * 5 : 0;
    w += `<g transform="translate(${f1(1450 + sh)} 700) rotate(${f1(sh)}) scale(.7)"><rect x="-44" y="-74" width="88" height="148" rx="16" fill="#1F2D44" stroke="${INK}" stroke-width="6"/><rect x="-36" y="-62" width="72" height="118" rx="8" fill="${ring && Math.floor(t * 6) % 2 ? '#FFE34D' : '#BFE6FF'}"/>${fT(0, 6, '05:00', 22, INK)}</g>`;
    if (ring) for (let i = 0; i < 3; i++) w += `<path d="M${1500 + i * 22} ${660 - i * 10} q14 16 0 32" fill="none" stroke="#FFD23F" stroke-width="6" stroke-linecap="round" opacity="${f1((0.5 + 0.5 * Math.sin(t * 20 + i)) * 100) / 100}"/>`;
    w += `<ellipse cx="960" cy="660" rx="240" ry="74" fill="#fff" stroke="${INK}" stroke-width="8"/>`;
    w += Z({ x: 960, y: 1010, s: 1, t, pose: '서기', ex: fEx(eyes ? (stop ? 'z기본' : 'z당황') : 'z졸음'), look: eyes ? [0.9, 0.1] : [0, 0], tilt: 8, seed: 3 });
    w += `<path d="M590 760 Q960 704 1330 760 L1360 1120 L560 1120 Z" fill="#8FA6D8" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M640 800 Q960 760 1280 800" fill="none" stroke="#fff" stroke-width="8" opacity=".35"/>`;
    if (reach > 0) { const ex0 = 1180, ey0 = 760, hx = lerp(1200, 1400, easeOut(reach)), hy = lerp(760, 712, easeOut(reach)); w += `<path d="M${ex0} ${ey0} Q${f1((ex0 + hx) / 2)} ${f1(Math.min(ey0, hy) - 30)} ${f1(hx)} ${f1(hy)}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>` + hand(hx, hy, 1.1); }
    w += fCoach(t, { x: 1200, y: fCoachSitY(440, 0.28), s: 0.28, pose: P['f앉기'], ex: fEx(lt < 1.2 ? 'z졸음' : stop ? 'z멍' : 'z결심'), look: stop ? [0.8, 0.4] : [0, 0] });
    return fPlate('bedn', cam, 0.6) + qCam(cam, w) + fFull('#0A1238', 0.3) + (ring && lt < 1.2 ? fx(t, t - lt + 0.2, t + 9, 1400, 260, '삐비빅…', '#FFE34D', { size: 56 }) : ''); }
  // phone close-up: two buttons; a finger comes up from below and hovers — then stops right before touching
  const sway = ph === 2 ? Math.sin(lt * 1.1) : 0.15 * Math.sin(lt * 2.4), down = ph === 3 ? clamp((lt - (D - 2.0)) / 1.2, 0, 1) : 0;
  // 위에서 내려다본 이불 위에 놓인 폰(뜨지 않게): 이불 주름 + 베개 모서리 + 폰 그림자
  let h = `<rect x="-300" y="-200" width="2600" height="1500" fill="#5E6FA6"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M-300 ${120 + i * 230} Q300 ${60 + i * 230} 900 ${150 + i * 230} T2300 ${110 + i * 230}" stroke="#4E5E94" stroke-width="26" fill="none" stroke-linecap="round" opacity=".7"/>`).join('') + `<rect x="1420" y="-120" width="700" height="360" rx="90" fill="#E9EEF8" stroke="${INK}" stroke-width="8"/><rect x="1420" y="-120" width="700" height="360" rx="90" fill="#0A1238" opacity=".25"/>`;
  h += `<rect x="${960 - 336 + 24}" y="${470 - 384 + 30}" width="672" height="800" rx="56" fill="#000" opacity=".28"/>`;
  h += `<g transform="translate(960 470) scale(.8)"><rect x="-420" y="-480" width="840" height="1000" rx="70" fill="#1F2D44" stroke="${INK}" stroke-width="14"/><rect x="-386" y="-440" width="772" height="920" rx="40" fill="#EAF0F6"/>${fT(0, -280, '05:00', 120, INK)}${fT(0, -200, '알람', 36, '#5B6478', { w: 700 })}` +
    `<rect x="-330" y="20" width="300" height="140" rx="70" fill="#9FC7F0" stroke="${INK}" stroke-width="8"/>${fT(-180, 106, '다시 자기', 44, INK)}<rect x="30" y="20" width="300" height="140" rx="70" fill="#FFB27A" stroke="${INK}" stroke-width="8"/>${fT(180, 106, '일어나기', 44, INK)}</g>`;
  const fxp = 960 + 144 * sway, tipY = lerp(700, 612, easeOut(down)) + Math.sin(t * 3) * 5;
  h += `<g transform="translate(${f1(fxp)} ${f1(tipY)})"><circle cx="20" cy="430" r="150" fill="#fff" stroke="${INK}" stroke-width="10"/><rect x="-34" y="0" width="68" height="360" rx="34" fill="#fff" stroke="${INK}" stroke-width="10"/><path d="M-14 34 Q0 44 14 34" fill="none" stroke="#C9D6E2" stroke-width="6"/></g>`;
  const black = ph === 3 ? clamp((lt - (D - 0.3)) / 0.25, 0, 1) : 0;
  return h + fFull('#000', black);
}
function fendScene(t, lt, a) {
  const k = clamp(lt / 1.2, 0, 1) * 0.5;
  return fFull('#000') + `<g opacity="${f1(k * 100) / 100}"><rect x="560" y="440" width="340" height="150" rx="75" fill="none" stroke="#9FC7F0" stroke-width="8"/>${fT(730, 532, '다시 자기', 46, '#9FC7F0')}<rect x="1020" y="440" width="340" height="150" rx="75" fill="none" stroke="#FFB27A" stroke-width="8"/>${fT(1190, 532, '일어나기', 46, '#FFB27A')}</g>`;
}
FN2.forEach(k => { const f = window[k + 'Scene']; if (!f) { console.error('missing ' + k); return; } window[k + 'Scene'] = (...x) => qDefs() + fNeonDefs() + f(...x); });
