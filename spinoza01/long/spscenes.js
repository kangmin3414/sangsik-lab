/* 스피노자 편 — 샘플(대본_v4 1~14번). 새 이름은 모두 sp 접두사. qdscenes.js(원자 꿈 편)의 QZ·QZday·TH·qdK·qdPlate를 함께 쓴다.
   물리 규칙: 누운 제로는 베개 위에 머리, 이불은 가슴 아래 · 앉은 사람은 책상 뒤에(다리는 책상에 가림) · 전화기는 귀 옆 손 안에 · 렌즈는 손끝에 · 원인 다음 결과.
   분위기 규칙: 번쩍·흔들림 없음, 컷은 부드럽게, 밤 장면도 밝게. */
Object.assign(QBG, { bedmoon: 'ai/bedmoon.png', alley: 'ai/alley.png' });
['spbed', 'sptheater', 'spfilm', 'splens', 'spcal', 'spglow', 'spwords', 'spalley'].forEach(k => CAMS[k] = 'fixed');
const SP_PAPER = '#F6ECD9', SP_VELVET = '#C4475F', SP_WALL = '#8A4764', SP_GOLD = '#E9C46A', SP_NAVY = '#3D4780', SP_INKBLUE = '#2B2B55';
const spPt = (x, y, s, lx, ly) => [x + (lx - 200) * s, y + (ly - 560) * s];
const spOp = k => f1(clamp(k, 0, 1) * 100) / 100;
const SPZ = o => HALO(char(Object.assign({ goggles: 'none', vest: '#4A4458', patch: false, tee: true, vshade: 'rgba(0,0,0,0.28)', wig: '#3A2C26', bandCollar: true }, o))); // 스피노자(긴 곱슬머리 스틱맨, 실제 생김새는 따오지 않는다)
const ZWORK = o => Z(Object.assign({ vest: '#F2F2F6', vshade: 'rgba(60,70,120,0.15)', collar: true, tie: '#5B6B8C' }, o));                         // 작년의 제로(셔츠 + 넥타이)
const GREY = o => char(Object.assign({ goggles: 'none', vest: '#A9B1C4', patch: false, tee: true, vshade: 'rgba(0,0,0,0.15)', noMouth: true }, o));
const spDefs = () => `<defs>
<radialGradient id="spScreenGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6DC" stop-opacity=".85"/><stop offset=".6" stop-color="#FFE3B0" stop-opacity=".3"/><stop offset="1" stop-color="#FFE3B0" stop-opacity="0"/></radialGradient>
<radialGradient id="spCandle" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".95"/><stop offset=".5" stop-color="#FFD36B" stop-opacity=".35"/><stop offset="1" stop-color="#FFD36B" stop-opacity="0"/></radialGradient>
<radialGradient id="spPaperV" cx=".5" cy=".45" r=".8"><stop offset="0" stop-color="#FFF8EA"/><stop offset="1" stop-color="#EBDDC2"/></radialGradient>
<radialGradient id="spOrb" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".45" stop-color="#FFD86B" stop-opacity=".9"/><stop offset="1" stop-color="#FFD86B" stop-opacity="0"/></radialGradient>
<linearGradient id="spMorning" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9C9"/><stop offset="1" stop-color="#FFD3B0"/></linearGradient>
<clipPath id="spScr"><rect x="430" y="118" width="1060" height="566" rx="14"/></clipPath>
</defs>`;
const spPaper = () => `<rect x="-400" y="-300" width="2800" height="1700" fill="${SP_PAPER}"/><rect x="-400" y="-300" width="2800" height="1700" fill="url(#spPaperV)"/>`;

/* ---------- 1. 침대, 새벽 2:07 ---------- */
const SB = { x: 960, pil: 650, body: 1050 };
function spBedArt(t, o) {
  let w = `<rect x="600" y="440" width="720" height="320" rx="44" fill="#8E86CC" stroke="${INK}" stroke-width="9"/><rect x="630" y="468" width="660" height="40" rx="16" fill="#A8A0E0"/>`;
  w += `<ellipse cx="${SB.x}" cy="${SB.pil}" rx="236" ry="72" fill="#F4F6FC" stroke="${INK}" stroke-width="8"/>`;
  const br = 1 + 0.016 * Math.sin(t * 1.9), dx = o.dx || 0;
  const body = QZ({ x: SB.x + dx, y: SB.body, s: 0.95, t, pose: '서기', ex: o.ex, look: o.look || [0, -0.3], tilt: o.tilt || 0, seed: 3, still: true });
  w += `<g transform="translate(${SB.x} 730) scale(1 ${f1(br * 1000) / 1000}) translate(${-SB.x} -730)">${body}</g>`;
  w += `<path d="M556 818 Q${SB.x} 770 1364 818 L1396 1150 L524 1150 Z" fill="#B4C0F0" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M610 862 Q${SB.x} 824 1310 862" fill="none" stroke="#fff" stroke-width="8" opacity=".45"/>`;
  // 벽 달력: 다음 주 토요일에 동그라미
  w += `<g transform="translate(452 430) rotate(-2)"><rect x="-84" y="-100" width="168" height="200" rx="8" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="-84" y="-100" width="168" height="40" rx="8" fill="#E5737F" stroke="${INK}" stroke-width="6"/>`;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) w += `<circle cx="${-60 + c * 24}" cy="${-34 + r * 30}" r="5" fill="${c === 5 ? '#8FA3E0' : '#C9CCD8'}"/>`;
  w += `<circle cx="60" cy="56" r="15" fill="none" stroke="#E5484D" stroke-width="5"/></g>`;
  return w;
}
function spbedScene(t, lt, a) {
  const ph = a.ph; let ex, look = [0.1, -0.5], tilt = 5, dx = 0, cam, over = '';
  if (ph === 0) { const c = qdK(0.3, 1.1, lt), o = qdK(1.9, 2.25, lt);
    ex = { expr: 'z멍', prev: 'z멍', k: 1, blink: lt < 1.9 ? c : 1 - o };
    cam = qLerpCam(lt / 3.4, [960, 610, 1.0], [965, 650, 1.18]);
    over += pop(t, t - lt + 0.3, t + 99, 270, 120, label(0, 0, '새벽 2:07', { size: 46, bg: '#D9E0FF' }), { rot: -4, bob: 2 }); }
  if (ph === 1) { const k = easeInOut(qdK(0.3, 1.5, lt)); ex = fEx('z멍'); tilt = lerp(5, -13, k); dx = lerp(0, -22, k); look = [lerp(0.1, -0.7, k), lerp(-0.5, 0.3, k)]; cam = qLerpCam(lt / 1.8, [965, 650, 1.18], [940, 655, 1.3]); }
  if (ph === 2) { E['_spb'] = qTalk('z울먹', env(t) * 0.7); ex = fEx('_spb'); tilt = -13; dx = -22; look = [-0.7, 0.3]; cam = qLerpCam(lt / (a._dur || 2), [940, 655, 1.3], [930, 660, 1.4]); }
  return spDefs() + qdPlate('bedmoon', cam, 0.6) + qCam(cam, spBedArt(t, { ex, look, tilt, dx })) + over;
}

/* ---------- 2. 작년 겨울의 사무실(필름 속) ---------- */
const SO = { zx: 640, zy: 1000, desk: 830 };
function spOfficeArt(t, o = {}) {
  const sky = o.sky || 0, night = 1 - clamp(sky * 1.6, 0, 1), dawn = clamp((sky - 0.45) * 2, 0, 1);
  const mix = (c1, c2, c3) => sky < 0.5 ? c1 : sky < 0.8 ? c2 : c3;
  let h = `<rect x="-200" y="-200" width="2400" height="1100" fill="#EEF1F8"/><rect x="-200" y="880" width="2400" height="500" fill="#CDD2E0"/><line x1="-200" y1="880" x2="2200" y2="880" stroke="${INK}" stroke-width="7"/>`;
  // 창
  h += `<rect x="1300" y="140" width="520" height="380" rx="8" fill="${mix('#4A5AA8', '#A7B2D6', '#FFD9B5')}" stroke="${INK}" stroke-width="9"/>`;
  if (night > 0.05) for (let i = 0; i < 14; i++) h += `<rect x="${1330 + (i * 97) % 460}" y="${340 + (i * 53) % 150}" width="14" height="10" fill="#FFE9A8" opacity="${spOp(night * (0.5 + 0.5 * hash(i)))}"/>`;
  if (dawn > 0) h += `<circle cx="1640" cy="${f1(540 - dawn * 150)}" r="60" fill="#FFF2C9" opacity="${spOp(dawn)}"/><rect x="1300" y="140" width="520" height="380" rx="8" fill="#FFE1B8" opacity="${spOp(dawn * 0.35)}"/>`;
  h += `<line x1="1560" y1="140" x2="1560" y2="520" stroke="${INK}" stroke-width="7"/><rect x="1300" y="140" width="520" height="380" rx="8" fill="none" stroke="${INK}" stroke-width="9"/>`;
  // 화이트보드
  h += `<rect x="150" y="150" width="440" height="300" rx="8" fill="#fff" stroke="${INK}" stroke-width="8"/>` + fT(370, 262, '오픈 D-1', 70, '#E5484D') + fT(370, 350, '담당: 제로', 46, SP_INKBLUE) + `<line x1="250" y1="382" x2="490" y2="382" stroke="#E5484D" stroke-width="5"/>`;
  // 벽시계
  const hr = o.clock == null ? 23 : o.clock, ha = (hr % 12) / 12 * 360, ma = (hr % 1) * 360;
  h += `<g transform="translate(790 250)"><circle r="74" fill="#fff" stroke="${INK}" stroke-width="8"/><line x1="0" y1="0" x2="0" y2="-40" stroke="${INK}" stroke-width="9" stroke-linecap="round" transform="rotate(${f1(ha)})"/><line x1="0" y1="0" x2="0" y2="-58" stroke="${INK}" stroke-width="6" stroke-linecap="round" transform="rotate(${f1(ma)})"/><circle r="7" fill="${INK}"/></g>`;
  if (o.inset) h += o.inset;
  if (o.behind) h += o.behind;
  // 제로(책상 뒤)
  if (o.zero) h += o.zero;
  // 책상
  h += `<rect x="330" y="${SO.desk}" width="1280" height="40" rx="10" fill="#E3BF96" stroke="${INK}" stroke-width="8"/><rect x="370" y="${SO.desk + 40}" width="1200" height="300" fill="#C99F74" stroke="${INK}" stroke-width="8"/>`;
  // 모니터 두 대(빨간 경고 → 고쳐지면 초록)
  [[960, 0], [1230, 1]].forEach(([mx, i]) => { const ok = o.fixed, bl = ok ? 1 : 0.55 + 0.45 * Math.sin(t * (o.fast ? 11 : 6) + i * 2);
    h += `<rect x="${mx - 14}" y="${SO.desk - 46}" width="28" height="48" fill="#8D93A6" stroke="${INK}" stroke-width="6"/><rect x="${mx - 120}" y="${SO.desk - 226}" width="240" height="180" rx="12" fill="#27304F" stroke="${INK}" stroke-width="8"/>`;
    h += ok ? `<circle cx="${mx}" cy="${SO.desk - 136}" r="44" fill="#57C58A" opacity=".95"/><path d="M${mx - 20} ${SO.desk - 136} l14 16 l28 -34" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`
            : `<g opacity="${spOp(bl)}"><path d="M${mx} ${SO.desk - 188} L${mx + 56} ${SO.desk - 92} L${mx - 56} ${SO.desk - 92} Z" fill="#E5484D" stroke="#fff" stroke-width="6" stroke-linejoin="round"/><rect x="${mx - 5}" y="${SO.desk - 160}" width="10" height="36" rx="4" fill="#fff"/><circle cx="${mx}" cy="${SO.desk - 108}" r="6" fill="#fff"/></g>`; });
  h += `<rect x="${SO.zx - 110}" y="${SO.desk - 14}" width="220" height="18" rx="6" fill="#DADDE8" stroke="${INK}" stroke-width="5"/>`; // 키보드
  h += `<path d="M1420 ${SO.desk} l10 -70 l70 0 l10 70 Z" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M1508 ${SO.desk - 50} q30 0 30 24 q0 22 -28 22" fill="none" stroke="${INK}" stroke-width="6"/>`; // 식은 커피
  if (o.front) h += o.front;
  return h;
}
// 통화 말풍선 속: 멀리 떨어진 장례식장 앞, 전화하는 태호의 뒷모습
function spInset(t, k) { if (k <= 0) return '';
  const cx = 1040, cy = 360, R = 190; let g = `<clipPath id="spIn"><circle cx="${cx}" cy="${cy}" r="${R - 6}"/></clipPath><circle cx="${cx}" cy="${cy}" r="${R}" fill="#6A76B8" stroke="${INK}" stroke-width="9"/><g clip-path="url(#spIn)">`;
  g += `<rect x="${cx - R}" y="${cy + 70}" width="${R * 2}" height="${R}" fill="#8F97C8"/>`;
  g += `<rect x="${cx - 40}" y="${cy - 60}" width="230" height="134" fill="#DADFF0" stroke="${INK}" stroke-width="6"/><rect x="${cx - 60}" y="${cy - 84}" width="270" height="28" fill="#BFC6E0" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < 4; i++) g += `<rect x="${cx - 16 + i * 52}" y="${cy - 34}" width="30" height="40" fill="#FFE9A8" stroke="${INK}" stroke-width="4"/>`;
  g += `<rect x="${cx + 60}" y="${cy + 26}" width="44" height="48" fill="#FFF2C9" stroke="${INK}" stroke-width="4"/>`;
  for (let i = 0; i < 9; i++) g += `<circle cx="${cx - 170 + (i * 71) % 330}" cy="${cy - 170 + (i * 37) % 120}" r="2.5" fill="#fff" opacity=".8"/>`;
  const tx = cx - 96, ty = cy + 150, ts = 0.42, hd = spPt(tx, ty, ts, 200, 170), ph = spPt(tx, ty, ts, 262, 196);
  g += TH({ x: tx, y: ty, s: ts, t, pose: Object.assign({}, P['서기'], { armR: [[252, 285], [300, 250], [264, 208]], hR: [262, 200] }), ex: fEx('z멍'), seed: 8, still: true });
  g += `<ellipse cx="${f1(hd[0])}" cy="${f1(hd[1])}" rx="${f1(110 * ts)}" ry="${f1(104 * ts)}" fill="#fff"/><rect x="${f1(ph[0] - 5)}" y="${f1(ph[1] - 16)}" width="10" height="20" rx="3" fill="#1F2D44"/>`; // 뒷모습(얼굴 없음)
  g += `</g>`;
  [[cx - 150, cy + 150, 16], [cx - 196, cy + 190, 10]].forEach(([x, y, r]) => g += `<circle cx="${x}" cy="${y}" r="${r}" fill="#6A76B8" stroke="${INK}" stroke-width="6"/>`);
  return `<g transform="translate(${cx} ${cy}) scale(${f1(easeOutBack(clamp(k, 0, 1)) * 1000) / 1000}) translate(${-cx} ${-cy})">${g}</g>`; }
// 책상 뒤의 제로: phone = 귀에 댄 전화기(뒷면), typing = 왼손 타자
function spOfficeZero(t, o = {}) { const { zx, zy } = SO, s = 0.95, ty = Math.sin(t * 22) * 3;
  const up = o.phone == null ? 1 : o.phone, lift = o.lift || 0;
  const armR = up > 0 ? [[252, 285], [lerp(278, 322, up), lerp(345, 300, up)], [lerp(256, 326, up), lerp(372, 226, up)]] : [[252, 285], [264, 340], [236, 372 + (o.typing ? -ty : 0)]];
  const hR = up > 0 ? [lerp(240, 328, up), lerp(374, 214, up)] : [236, 372];
  const armL = [[148, 285], [lerp(146, 138, lift), lerp(340, 330, lift)], [lerp(176, 168, lift), lerp(372 + (o.typing ? ty : 0), 318, lift)]], hL = [lerp(180, 172, lift), lerp(374 + (o.typing ? ty : 0), 312, lift)];
  let g = ZWORK({ x: zx, y: zy, s, t, pose: Object.assign({}, P['서기'], { armL, hL, armR, hR }), ex: o.ex, look: o.look || [0.5, 0.3], tilt: o.tilt || 0, seed: 3 });
  if (up > 0.6) { const p = spPt(zx, zy, s, hR[0] + 2, hR[1] - 26); g += `<g transform="translate(${f1(p[0])} ${f1(p[1])}) rotate(6)"><rect x="-17" y="-36" width="34" height="66" rx="8" fill="#1F2D44" stroke="${INK}" stroke-width="5"/><circle cx="-6" cy="-24" r="4" fill="#3B4A66"/></g>` + hand(p[0] + 2, p[1] + 26, 0.7); }
  return g; }
// 필름 테두리(위아래 필름 구멍). frozen이면 구멍이 멈춘다.
function spFilmFrame(t, frozen) { const off = frozen ? 0 : (t * 60) % 80; let g = `<rect x="-200" y="-200" width="2400" height="246" fill="#3A2F44"/><rect x="-200" y="1034" width="2400" height="300" fill="#3A2F44"/>`;
  for (let i = -2; i < 28; i++) g += `<rect x="${f1(i * 80 - off)}" y="2" width="44" height="30" rx="6" fill="#FFF6DC" opacity=".85"/><rect x="${f1(i * 80 - off)}" y="1048" width="44" height="30" rx="6" fill="#FFF6DC" opacity=".85"/>`;
  return g + `<rect x="-200" y="-200" width="2400" height="1600" fill="#FFE9C0" opacity=".07"/>`; }
function spTieInsert(lt) { // 책상 위: 편의점 봉투, 포장도 못 뜯은 검은 넥타이, 조의금 봉투
  let h = `<rect x="-200" y="-200" width="2400" height="1600" fill="url(#spMorning)"/><rect x="-200" y="520" width="2400" height="900" fill="#E3BF96"/><line x1="-200" y1="520" x2="2200" y2="520" stroke="${INK}" stroke-width="8"/>`;
  h += `<rect x="1180" y="160" width="620" height="330" rx="8" fill="#FFE3C2" stroke="${INK}" stroke-width="9"/><circle cx="1560" cy="330" r="64" fill="#FFF6DC"/><line x1="1490" y1="160" x2="1490" y2="490" stroke="${INK}" stroke-width="7"/>`;
  h += `<path d="M330 900 Q300 600 420 560 L880 560 Q1000 600 970 900 Z" fill="#fff" opacity=".7" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M520 560 Q560 470 610 560 M700 560 Q740 470 790 560" fill="none" stroke="${INK}" stroke-width="7"/>`;
  h += `<g transform="translate(650 760) rotate(-6)"><rect x="-120" y="-150" width="240" height="300" rx="10" fill="#F4F6FC" stroke="${INK}" stroke-width="7"/><rect x="-120" y="-150" width="240" height="54" rx="10" fill="#D9DEEC" stroke="${INK}" stroke-width="7"/><circle cx="0" cy="-124" r="10" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M-22 -70 L22 -70 L32 -40 L0 -22 L-32 -40 Z" fill="#1E1E28" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-18 -30 L18 -30 L34 110 L0 138 L-34 110 Z" fill="#1E1E28" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-70 -80 L-40 130" stroke="#fff" stroke-width="10" opacity=".5"/></g>`;
  h += `<g transform="translate(1260 800) rotate(5)"><rect x="-150" y="-96" width="300" height="192" rx="8" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-150 -96 L0 10 L150 -96" fill="none" stroke="${INK}" stroke-width="6"/><rect x="-18" y="20" width="36" height="60" fill="none" stroke="#2B2B33" stroke-width="5"/></g>`;
  return h; }
function spfilmScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 3; let art, frozen = false, flash = 0;
  if (ph === 0) { const tH = fAt(a, '가셨다', 1.0) + 0.2, lift = easeOut(qdK(tH, tH + 0.35, lt));
    const ex = lt < tH ? fEx('z멍') : { expr: 'z충격', prev: 'z멍', k: qdK(tH, tH + 0.2, lt), blink: 0 };
    art = spOfficeArt(t, { inset: spInset(t, qdK(0.25, 0.7, lt)), zero: spOfficeZero(t, { ex, look: lt < tH ? [0.7, 0.2] : [0.1, -0.1], typing: lt < tH, lift }) }); }
  if (ph === 1) { E['_spf'] = qTalk('z당황', env(t)); const glance = lt > 1.2 && lt < 2.1;
    const wav = Math.sin(t * 9) * 14, co = lt > 0.7 ? GREY({ x: 1700, y: 1040, s: 0.9, t, seed: 21, pose: Object.assign({}, P['서기'], { armL: [[148, 285], [96, 240], [78 + wav, 176]], hL: [74 + wav, 168] }), look: [-0.9, 0] }) : '';
    art = spOfficeArt(t, { fast: true, inset: spInset(t, 1), behind: co, zero: spOfficeZero(t, { ex: fEx('_spf'), look: glance ? [0.9, 0] : [0.1, 0.5], lift: 1 }) }); }
  if (ph === 2) { if (lt < 2.15) { const k = qdK(0.1, 2.0, lt), fixed = lt > 1.75;
      art = spOfficeArt(t, { sky: k, clock: lerp(23.2, 31, easeInOut(k)), fixed, zero: spOfficeZero(t, { phone: 0, typing: !fixed, ex: { expr: 'z멍', prev: 'z멍', k: 1, blink: fixed ? 0 : 0.55 }, look: fixed ? [0.9, -0.6] : [0.7, 0.3], tilt: fixed ? 0 : 6 }) });
    } else { frozen = lt > 3.0; art = qCam(qLerpCam((Math.min(lt, 3.0) - 2.15) / 0.85, [960, 600, 1.0], [800, 700, 1.22]), spTieInsert(lt)); flash = lt > 3.0 ? Math.max(0, 1 - (lt - 3.0) / 0.25) * 0.18 : 0; } }
  const cam = ph === 0 ? qLerpCam(lt / D, [960, 560, 1.0], [900, 580, 1.1]) : ph === 1 ? qLerpCam(lt / D, [900, 580, 1.1], [860, 600, 1.2]) : [960, 560, 1.0];
  return spDefs() + (ph === 2 && lt >= 2.15 ? art : qCam(cam, art)) + spFilmFrame(t, frozen) + (frozen ? `<rect x="-200" y="-200" width="2400" height="1600" fill="#B9B4D8" opacity=".16"/>` : '') + (flash ? fFull('#fff', flash) : '');
}

/* ---------- 3. 머릿속 극장 ---------- */
function spSeat(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-96" y="-120" width="192" height="230" rx="40" fill="${SP_VELVET}" stroke="${INK}" stroke-width="8"/><path d="M-70 -92 Q0 -112 70 -92" fill="none" stroke="#E27D90" stroke-width="10" stroke-linecap="round"/></g>`; }
function spTheater(t, screen, o = {}) {
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="${SP_WALL}"/><circle cx="960" cy="400" r="${f1(900 + 20 * Math.sin(t * 3))}" fill="url(#spScreenGlow)" opacity="${spOp(0.25 + 0.6 * (o.on == null ? 1 : o.on))}"/>`;
  [-1, 1].forEach(sd => { h += `<path d="M${960 + sd * 1300} -200 L${960 + sd * 610} -200 Q${960 + sd * 660} 400 ${960 + sd * 600} 900 L${960 + sd * 1300} 900 Z" fill="#B5384E" stroke="${INK}" stroke-width="8"/>`;
    for (let i = 0; i < 4; i++) h += `<path d="M${960 + sd * (700 + i * 140)} -200 Q${960 + sd * (730 + i * 140)} 400 ${960 + sd * (690 + i * 140)} 900" fill="none" stroke="#8E2A3E" stroke-width="7"/>`; });
  h += `<rect x="404" y="92" width="1112" height="618" rx="26" fill="${SP_GOLD}" stroke="${INK}" stroke-width="9"/><rect x="430" y="118" width="1060" height="566" rx="14" fill="#FFF8E7" stroke="${INK}" stroke-width="7"/>`;
  h += `<g clip-path="url(#spScr)">${screen || ''}<rect x="430" y="118" width="1060" height="566" fill="#3A2F44" opacity="${spOp(0.72 * (1 - (o.on == null ? 1 : o.on)))}"/></g>`;
  h += label(960, 52, '오늘의 상영: 작년 겨울', { size: 40, bg: '#FFF2C2' });
  for (let i = 0; i < 9; i++) h += spSeat(240 + i * 180, 860, 0.8);
  // 가운데 자리의 제로(뒷모습) + 앞줄 좌석
  const zx = 960, zy = 1240, s = 1.0, hd = spPt(zx, zy, s, 200, 170);
  h += QZ({ x: zx, y: zy, s, t, pose: '서기', ex: fEx('z멍'), seed: 3, still: true }) + `<ellipse cx="${hd[0]}" cy="${hd[1]}" rx="111" ry="105" fill="#fff"/>`;
  for (let i = 0; i < 7; i++) h += spSeat(120 + i * 280, 1130, 1.25);
  return h; }
const spScreenFilm = (inner) => `<g transform="translate(430 118) scale(0.5521)">${inner}</g>`;
function spBooth(t, lt) { // 영사실: 필름을 되감아 다시 거는 제로, 쌓인 필름 통
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#B98A6A"/><rect x="-400" y="900" width="2800" height="600" fill="#8E6448"/><line x1="-400" y1="900" x2="2400" y2="900" stroke="${INK}" stroke-width="8"/>`;
  h += `<rect x="150" y="330" width="250" height="150" rx="10" fill="#FFF6DC" stroke="${INK}" stroke-width="9"/><path d="M400 370 L1010 500 L1010 600 L400 440 Z" fill="#FFF6DC" opacity=".35"/>`;
  h += `<rect x="1010" y="640" width="60" height="260" fill="#6B5A52" stroke="${INK}" stroke-width="7"/><rect x="900" y="470" width="300" height="180" rx="20" fill="#5E6B8C" stroke="${INK}" stroke-width="9"/><rect x="860" y="520" width="50" height="70" rx="8" fill="#3A4466" stroke="${INK}" stroke-width="7"/>`;
  [[980, 400, 1], [1130, 400, -1]].forEach(([x, y, d]) => { h += `<g transform="translate(${x} ${y}) rotate(${f1(t * 140 * d)})"><circle r="78" fill="#2F3550" stroke="${INK}" stroke-width="8"/><circle r="16" fill="#C9CCD8"/>${[0, 120, 240].map(r => `<circle cx="${f1(44 * Math.cos(r * Math.PI / 180))}" cy="${f1(44 * Math.sin(r * Math.PI / 180))}" r="15" fill="#B98A6A"/>`).join('')}</g>`; });
  const cr = t * 6, hx = 67 + Math.cos(cr) * 14, hy = 238 + Math.sin(cr) * 14, cw = spPt(1330, 930, 0.9, hx, hy);
  h += `<circle cx="1210" cy="640" r="12" fill="#C9CCD8" stroke="${INK}" stroke-width="5"/><line x1="1210" y1="640" x2="${f1(cw[0])}" y2="${f1(cw[1])}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
  h += QZ({ x: 1330, y: 930, s: 0.9, t, pose: Object.assign({}, P['서기'], { armL: [[148, 285], [104, 276], [hx, hy]], hL: [hx - 4, hy] }), ex: { expr: 'z멍', prev: 'z멍', k: 1, blink: 0.5 }, look: [-0.8, -0.2], seed: 3 });
  // 필름 통 탑(날짜가 다 다르다)
  ['12.14', '1.03', '2.11', '3.27', '5.09', '6.30', '8.18', '9.02', '10.25', '11.13'].forEach((d, i) => { const k = qdK(0.2 + i * 0.16, 0.45 + i * 0.16, lt); if (k <= 0) return; const y = 880 - i * 52, x = 560 + (i % 2 ? 10 : -10);
    h += `<g transform="translate(${x} ${f1(y - (1 - easeOut(k)) * 200)})" opacity="${spOp(k * 2)}"><ellipse cx="0" cy="0" rx="130" ry="30" fill="#D8DCEA" stroke="${INK}" stroke-width="7"/><rect x="-130" y="-34" width="260" height="34" fill="#C2C7DA"/><ellipse cx="0" cy="-34" rx="130" ry="30" fill="#E9ECF6" stroke="${INK}" stroke-width="7"/><line x1="-130" y1="-34" x2="-130" y2="0" stroke="${INK}" stroke-width="7"/><line x1="130" y1="-34" x2="130" y2="0" stroke="${INK}" stroke-width="7"/>${fT(0, -22, d, 30, SP_INKBLUE)}</g>`; });
  return h; }
function spPub(t, lt, tB) { // 요즘의 제로와 태호: 둘 사이 탁자 위에, 둘 다 보지 않는 작은 검은 상자
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="#F7D9A8"/><rect x="-400" y="-300" width="2800" height="1700" fill="url(#spScreenGlow)" opacity=".6"/><rect x="-400" y="900" width="2800" height="600" fill="#D9A56C"/>`;
  [[380, 250], [960, 200], [1540, 250]].forEach(([x, y]) => h += `<line x1="${x}" y1="-300" x2="${x}" y2="${y - 60}" stroke="${INK}" stroke-width="6"/><path d="M${x - 70} ${y} Q${x} ${y - 120} ${x + 70} ${y} Z" fill="#FFB36B" stroke="${INK}" stroke-width="7"/><circle cx="${x}" cy="${y + 30}" r="150" fill="url(#spCandle)" opacity=".7"/>`);
  const cl = Math.max(0, Math.sin(lt * 2.2)) * 14;
  const mug = (x, y) => `<rect x="${f1(x - 30)}" y="${f1(y - 80)}" width="60" height="80" rx="8" fill="#FFD36B" stroke="${INK}" stroke-width="6"/><rect x="${f1(x - 30)}" y="${f1(y - 80)}" width="60" height="22" rx="8" fill="#fff" stroke="${INK}" stroke-width="6"/>`;
  const zp = Object.assign({}, P['서기'], { armR: [[252, 285], [320, 290], [380 + cl, 250]], hR: [388 + cl, 246] }), tp = Object.assign({}, P['서기'], { armL: [[148, 285], [80, 290], [20 - cl, 250]], hL: [12 - cl, 246] });
  h += QZday({ x: 620, y: 1010, s: 1.0, t, pose: zp, ex: fEx('z빵긋'), look: [0.7, -0.1], seed: 3 }) + TH({ x: 1300, y: 1010, s: 1.0, t, pose: tp, ex: fEx('z히죽'), look: [-0.7, -0.1], seed: 8 });
  const m1 = spPt(620, 1010, 1, 388 + cl, 246), m2 = spPt(1300, 1010, 1, 12 - cl, 246);
  h += mug(m1[0] + 30, m1[1] + 30) + mug(m2[0] - 30, m2[1] + 30) + (cl > 12 ? zStar(960, 640, 22, '#fff', 3) : '');
  h += `<rect x="380" y="840" width="1160" height="46" rx="12" fill="#B9794A" stroke="${INK}" stroke-width="8"/><rect x="440" y="886" width="1040" height="300" fill="#9C6238" stroke="${INK}" stroke-width="8"/>`;
  const k = qdK(tB - 0.5, tB + 0.2, lt), pulse = 0.5 + 0.5 * Math.sin(t * 3);
  h += `<circle cx="960" cy="800" r="${f1(70 + 14 * pulse)}" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="10 14" opacity="${spOp(k * 0.9)}"/><rect x="920" y="778" width="80" height="62" rx="8" fill="#2A2732" stroke="${INK}" stroke-width="6"/><line x1="920" y1="800" x2="1000" y2="800" stroke="#4A4658" stroke-width="5"/>`;
  return h; }
function spSeatFront(t, o) { // 객석의 제로(앞모습): 화면 빛이 얼굴에 닿는다
  let h = `<rect x="-400" y="-300" width="2800" height="1700" fill="${SP_WALL}"/>`;
  for (let r = 0; r < 3; r++) for (let i = 0; i < 9 - r; i++) h += spSeat(200 + r * 60 + i * (190 + r * 12), 300 + r * 170, 0.7 + r * 0.15);
  h += `<path d="M700 -300 L1220 -300 L1700 1300 L220 1300 Z" fill="#FFF6DC" opacity="${spOp(0.13 + 0.03 * Math.sin(t * 7))}"/>`;
  h += `<rect x="640" y="560" width="640" height="700" rx="110" fill="${SP_VELVET}" stroke="${INK}" stroke-width="10"/><path d="M720 610 Q960 570 1200 610" fill="none" stroke="#E27D90" stroke-width="14" stroke-linecap="round"/>`;
  h += QZ({ x: 960, y: 1190, s: 1.25, t, pose: '서기', ex: o.ex, look: o.look, tilt: o.tilt || 0, seed: 3 });
  h += `<rect x="560" y="900" width="120" height="400" rx="40" fill="#A8384E" stroke="${INK}" stroke-width="9"/><rect x="1240" y="900" width="120" height="400" rx="40" fill="#A8384E" stroke="${INK}" stroke-width="9"/>`;
  return h + `<circle cx="960" cy="420" r="700" fill="url(#spScreenGlow)" opacity=".45"/>`; }
function sptheaterScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 6;
  if (ph === 0) { const tOn = fAt(a, '켜집니다', 2.4) - 0.9, tF = fAt(a, '작년', D * 0.72) - 0.2, on = easeInOut(qdK(tOn, tOn + 0.8, lt)), fk = qdK(tF, tF + 0.6, lt);
    const still = spOfficeArt(t, { zero: spOfficeZero(t, { phone: 0, typing: true, ex: fEx('z멍'), look: [0.7, 0.3] }) });
    const cam = qLerpCam(lt / D, [960, 600, 1.0], [960, 520, 1.12]);
    const th = qCam(cam, spTheater(t, fk > 0 ? `<g opacity="${spOp(fk)}">${spScreenFilm(still)}</g>` : '', { on }));
    const r = easeInOut(qdK(0.15, 1.15, lt)) * 1500; if (r >= 1499) return spDefs() + th;
    const bcam = [965, 650, 1.18];
    return spDefs() + qdPlate('bedmoon', bcam, 0.6) + qCam(bcam, spBedArt(t, { ex: fEx('z멍'), look: [0.1, -0.5], tilt: 5 })) + `<clipPath id="spIris"><circle cx="960" cy="330" r="${f1(r)}"/></clipPath><g clip-path="url(#spIris)">${th}</g><circle cx="960" cy="330" r="${f1(r)}" fill="none" stroke="#fff" stroke-width="10" opacity=".7"/>`; }
  if (ph === 1) { const tT = fAt(a, '태호와는', D * 0.36) - 0.25, tB = fAt(a, '꺼낸', D * 0.85);
    if (lt < tT) return spDefs() + qCam(qLerpCam(lt / tT, [900, 650, 1.25], [880, 650, 1.42]), spBooth(t, lt));
    const k = lt - tT; return spDefs() + qCam(lt < tB - 0.6 ? qLerpCam(k / (tB - 0.6 - tT), [960, 600, 1.0], [960, 640, 1.1]) : qLerpCam((lt - tB + 0.6) / 1.2, [960, 640, 1.1], [960, 760, 1.55]), spPub(t, k, tB - tT)) + pop(t, t - lt + tT + 0.3, t - lt + tB - 0.6, 330, 150, label(0, 0, '요즘의 제로와 태호', { size: 42, bg: '#FFF2C2' }), { rot: -3, bob: 2 }) + fFull('#FFF6DC', Math.max(0, 1 - k / 0.4) * 0.8); }
  E['_spt'] = qTalk('z당황', env(t)); const out = ph === 3 ? qdK(0.8, 1.6, lt) : 0;
  const cam = ph === 2 ? qLerpCam(lt / D, [960, 640, 1.0], [960, 600, 1.12]) : qLerpCam(lt / 1.6, [960, 600, 1.12], [960, 590, 1.18]);
  return spDefs() + qCam(cam, spSeatFront(t, { ex: fEx(ph === 2 ? '_spt' : 'z멍'), look: [0, -0.8], tilt: ph === 3 ? -3 : 0 })) + fFull('#FFF6DC', out);
}

/* ---------- 4. 스피노자의 작업대 ---------- */
function splensScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 9, tS = fAt(a, '스피노자는', D * 0.5) - 0.3, tQ = fAt(a, '후회하는', D * 0.75) - 0.35;
  const down = ph === 1 ? easeInOut(qdK(0.4, 1.6, lt)) : 0, fl = Math.sin(t * 13) * 3 + Math.sin(t * 7.3) * 2;
  let h = spPaper();
  h += `<rect x="150" y="170" width="250" height="360" rx="120" fill="#DCEBFA" stroke="${INK}" stroke-width="9"/><line x1="275" y1="170" x2="275" y2="530" stroke="${INK}" stroke-width="6"/><line x1="150" y1="360" x2="400" y2="360" stroke="${INK}" stroke-width="6"/><path d="M400 200 L1000 900 L400 900 Z" fill="#fff" opacity=".22"/>`;
  const sx = 1160, sy = 950, s = 0.95;
  const hx = lerp(336, 300, down), hy = lerp(196, 372, down), pose = Object.assign({}, P['서기'], { armR: [[252, 285], [lerp(312, 290, down), lerp(268, 340, down)], [hx - 4, hy + 8]], hR: [hx, hy] });
  h += SPZ({ x: sx, y: sy, s, t, pose, ex: fEx(ph === 1 ? 'z기본' : 'z멍'), look: ph === 1 ? [lerp(0.5, -0.8, down), lerp(-0.4, -0.3, down)] : [0.6, -0.4], seed: 14 });
  // 탁자
  h += `<rect x="380" y="790" width="1180" height="44" rx="10" fill="#B9794A" stroke="${INK}" stroke-width="8"/><rect x="440" y="834" width="1060" height="400" fill="#9C6238" stroke="${INK}" stroke-width="8"/>`;
  h += `<circle cx="560" cy="${680 + fl * 0.3}" r="210" fill="url(#spCandle)" opacity=".85"/><rect x="540" y="700" width="40" height="90" rx="6" fill="#FFF8E7" stroke="${INK}" stroke-width="6"/><path d="M560 ${640 + fl} Q584 676 560 700 Q536 676 560 ${640 + fl} Z" fill="#FFC94A" stroke="${INK}" stroke-width="5"/><ellipse cx="560" cy="790" rx="56" ry="12" fill="#C9A04A" stroke="${INK}" stroke-width="6"/>`;
  h += `<rect x="760" y="750" width="150" height="40" rx="6" fill="#7E8FC0" stroke="${INK}" stroke-width="6"/><rect x="776" y="716" width="130" height="36" rx="6" fill="#C98F6B" stroke="${INK}" stroke-width="6"/>`;
  [[980, 0.8], [1420, 1]].forEach(([x, k]) => h += `<ellipse cx="${x}" cy="776" rx="${40 * k}" ry="${12 * k}" fill="#DCEBFA" opacity=".85" stroke="${INK}" stroke-width="5"/>`);
  // 손끝의 렌즈
  const lp2 = spPt(sx, sy, s, hx + lerp(6, 40, down), hy - lerp(52, -8, down)), lr = 50, lry = lerp(50, 13, down); // 내려놓으면 탁자 위에 눕는다
  h += `<ellipse cx="${f1(lp2[0])}" cy="${f1(lp2[1])}" rx="${lr}" ry="${f1(lry)}" fill="#DCEBFA" opacity=".6"/><ellipse cx="${f1(lp2[0])}" cy="${f1(lp2[1])}" rx="${lr}" ry="${f1(lry)}" fill="none" stroke="${SP_GOLD}" stroke-width="9"/><ellipse cx="${f1(lp2[0])}" cy="${f1(lp2[1])}" rx="${lr + 5}" ry="${f1(lry + 5)}" fill="none" stroke="${INK}" stroke-width="4"/>` + (down < 0.5 ? `<path d="M${f1(lp2[0] - 26)} ${f1(lp2[1] - 20)} q16 -18 34 -14" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>` : '');
  let over = '';
  if (ph === 0) { if (lt > tS) over += pop(t, t - lt + tS, t - lt + tQ, 620, 300, label(0, 0, '바뤼흐 스피노자 · 1632~1677', { size: 44, bg: '#FFF2C2' }), { rot: -3, bob: 2 });
    if (lt > tQ) { const tT = fAt(a, '아프다', D - 0.5) - 1.05; over += `<g opacity="${spOp(qdK(tQ, tQ + 0.5, lt))}">${outlined(560, 300, ['후회하는 사람은,'], { size: 80, sw: 15, fill: '#fff' })}</g>` + (lt > tT ? `<g opacity="${spOp(qdK(tT, tT + 0.5, lt))}">${outlined(560, 425, ['두 번 아프다'], { size: 104, sw: 18, fill: '#FFE9A8' })}</g>` : ''); } }
  const cam = ph === 0 ? qLerpCam(lt / D, [980, 620, 1.22], [1030, 610, 1.36]) : qLerpCam(lt / D, [1030, 610, 1.36], [960, 610, 1.26]);
  return spDefs() + qCam(cam, h) + over;
}

/* ---------- 5. 달력: 한 번은 그날, 또 한 번은 오늘 밤 ---------- */
const spBandage = (x, y, r, k) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${r}) scale(${f1(easeOutBack(clamp(k, 0, 1)) * 1000) / 1000})"><rect x="-44" y="-15" width="88" height="30" rx="15" fill="#F2C9A0" stroke="${INK}" stroke-width="5"/><rect x="-15" y="-15" width="30" height="30" fill="#FBE6CF" stroke="${INK}" stroke-width="4"/><circle cx="-30" cy="0" r="2.5" fill="${INK}"/><circle cx="30" cy="0" r="2.5" fill="${INK}"/></g>`;
function spCalPage(x, y, title, col, k, cellHot) { if (k <= 0) return '';
  let g = `<g transform="translate(${x} ${y}) rotate(${x < 960 ? -3 : 3}) scale(${f1(easeOutBack(clamp(k, 0, 1)) * 1000) / 1000})"><rect x="-190" y="-220" width="380" height="440" rx="16" fill="#000" opacity=".12" transform="translate(8 10)"/><rect x="-190" y="-220" width="380" height="440" rx="16" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="-190" y="-220" width="380" height="96" rx="16" fill="${col}" stroke="${INK}" stroke-width="8"/>${fT(0, -154, title, 52, '#fff')}`;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) { const hot = r * 5 + c === cellHot; g += `<rect x="${-160 + c * 66}" y="${-96 + r * 74}" width="54" height="60" rx="8" fill="${hot ? '#FFE9A8' : '#EEF0F6'}" stroke="${hot ? INK : 'none'}" stroke-width="4"/>`; }
  return g + `</g>`; }
function spcalScene(t, lt, a) {
  const D = a._dur || 10, t1 = 0.35, t2 = fAt(a, '또', D * 0.28) - 0.15, t3 = fAt(a, '틀', D * 0.8) - 1.3;
  let h = spPaper();
  h += spCalPage(470, 500, '작년 겨울', '#E5737F', qdK(t1, t1 + 0.4, lt), 7) + spCalPage(1450, 500, '오늘 밤', SP_NAVY, qdK(t2, t2 + 0.4, lt), 12);
  if (lt > t1 + 0.5) h += spBandage(470 - 160 * 0.98 + 2 * 66 + 27 - 14, 500 - 96 + 74 + 30 + 4, -24, qdK(t1 + 0.5, t1 + 0.8, lt));
  if (lt > t2 + 0.5) h += spBandage(1450 - 160 + 2 * 66 + 27 + 20, 500 - 96 + 2 * 74 + 30 - 2, 18, qdK(t2 + 0.5, t2 + 0.8, lt));
  // 그 사이의 밤들: 틀 때마다 하나씩
  const n = 8; for (let i = 0; i < n; i++) { const u = (i + 0.5) / n, x = 720 + u * 480, y = 560 - Math.sin(u * Math.PI) * 190, k = qdK(t2 + 0.2 + i * 0.07, t2 + 0.5 + i * 0.07, lt); if (k <= 0) continue;
    h += `<g opacity="${spOp(k)}"><circle cx="${f1(x)}" cy="${f1(y)}" r="30" fill="#C9D2F5" stroke="${INK}" stroke-width="5"/><path d="M${f1(x - 6)} ${f1(y - 18)} a18 18 0 1 0 14 30 a14 14 0 1 1 -14 -30Z" fill="#FFF2C9" stroke="${INK}" stroke-width="3"/></g>`;
    if (lt > t3) h += spBandage(x, y + 44, (i % 2 ? 14 : -14), qdK(t3 + i * 0.22, t3 + 0.3 + i * 0.22, lt)); }
  let over = '';
  if (lt > t1 + 0.6) over += pop(t, t - lt + t1 + 0.6, t + 99, 430, 850, label(0, 0, '첫 번째', { size: 40, bg: '#FFD9DE' }), { rot: -3, bob: 2 });
  if (lt > t2 + 0.6) over += pop(t, t - lt + t2 + 0.6, t + 99, 1490, 850, label(0, 0, '두 번째', { size: 40, bg: '#D9E0FF' }), { rot: 3, bob: 2 });
  return spDefs() + qCam(qLerpCam(lt / D, [960, 540, 1.1], [960, 550, 1.16]), h) + over;
}

/* ---------- 6. 작아지는 기운 ---------- */
function spglowScene(t, lt, a) {
  const D = a._dur || 12, tS = fAt(a, '작은', D * 0.25) - 0.4, t2 = fAt(a, '그래서', D * 0.48) - 0.2, tE = fAt(a, '줄어', D * 0.9) - 0.3;
  const day = easeInOut(qdK(t2, t2 + 1.0, lt)), R = lerp(84, 36, easeInOut(qdK(tS, t2 + 0.6, lt))) * (1 + 0.05 * Math.sin(t * 4));
  let h = spPaper() + `<rect x="-400" y="-300" width="2800" height="1700" fill="#C9CFFF" opacity="${spOp(0.4 * (1 - day))}"/><rect x="-400" y="-300" width="2800" height="1700" fill="url(#spMorning)" opacity="${spOp(day * 0.8)}"/>`;
  // 밤이 지나간다(달이 건너감) → 아침 해
  const mk = qdK(0.2, t2 + 0.4, lt), mx = lerp(360, 1560, mk), my = 440 - Math.sin(mk * Math.PI) * 150;
  h += `<g opacity="${spOp(1 - day)}"><circle cx="${f1(mx)}" cy="${f1(my)}" r="56" fill="#FFF8DC" stroke="${INK}" stroke-width="6"/><circle cx="${f1(mx - 16)}" cy="${f1(my - 10)}" r="9" fill="#EFE3B4"/><circle cx="${f1(mx + 18)}" cy="${f1(my + 14)}" r="6" fill="#EFE3B4"/></g>`;
  for (let i = 0; i < 10; i++) h += `<g opacity="${spOp((1 - day) * (0.5 + 0.5 * Math.sin(t * 2 + i)))}">${zStar(380 + (i * 173) % 1160, 270 + (i * 97) % 240, 9, '#fff', 0)}</g>`;
  h += `<g opacity="${spOp(day)}"><circle cx="1440" cy="380" r="70" fill="#FFE08A" stroke="${INK}" stroke-width="6"/></g>`;
  h += `<rect x="-400" y="930" width="2800" height="500" fill="#E6D7BC" opacity=".8"/><line x1="-400" y1="930" x2="2400" y2="930" stroke="${INK}" stroke-width="6" opacity=".5"/>`;
  const zx = 960, zy = 940, s = 1.0, up = easeInOut(qdK(t2 + 0.8, t2 + 1.5, lt)) * (1 - easeInOut(qdK(tE, tE + 0.8, lt)));
  const hx = lerp(284, 262, up), hy = lerp(398, 318, up), pose = Object.assign({}, P['서기'], { armR: [[252, 285], [lerp(278, 300, up), lerp(345, 340, up)], [hx, hy]], hR: [hx + 2, hy + 6] });
  const ex = lt < t2 ? fEx('z졸음') : lt < tE ? fEx('z멍') : fEx('z민망');
  h += qShadow(zx, zy, 80, 0.6) + QZ({ x: zx, y: zy, s, t, pose, ex, look: up > 0.5 ? [0.5, 0.6] : lt > tE ? [-0.6, 0.2] : [0, 0.2], seed: 3 });
  const c = spPt(zx, zy, s, 200, 336);
  h += `<circle cx="${c[0]}" cy="${c[1]}" r="${f1(R * 1.9)}" fill="url(#spOrb)"/><circle cx="${c[0]}" cy="${c[1]}" r="${f1(R * 0.42)}" fill="#FFF6C8" stroke="${INK}" stroke-width="4"/>`;
  if (up > 0.02) { const p = spPt(zx, zy, s, hx + 6, hy - 30); h += `<g transform="translate(${f1(p[0])} ${f1(p[1])}) rotate(10)"><rect x="-26" y="-48" width="52" height="92" rx="11" fill="#1F2D44" stroke="${INK}" stroke-width="6"/><circle cx="-10" cy="-32" r="5" fill="#3B4A66"/></g>`; }
  let over = '';
  if (lt > t2 + 1.4 && lt < tE + 0.2) over += pop(t, t - lt + t2 + 1.4, t - lt + tE + 0.2, 1340, 520, label(0, 0, '태호에게…', { size: 42, bg: '#fff' }), { rot: 3, bob: 3 });
  if (lt > tS && lt < t2) over += pop(t, t - lt + tS, t - lt + t2, 600, 600, label(0, 0, '기운', { size: 42, bg: '#FFF2A8' }), { rot: -4, bob: 3 });
  return spDefs() + qCam(qLerpCam(lt / D, [960, 640, 1.32], [960, 660, 1.46]), h) + over;
}

/* ---------- 7. 이해할 것 ---------- */
function spwordsScene(t, lt, a) {
  const D = a._dur || 8, ts = [fAt(a, '비웃지도', 1.6), fAt(a, '한탄하지도', 2.8), fAt(a, '저주하지도', 4.0)], tU = fAt(a, '이해할', D - 1.4) - 0.1;
  let h = spPaper(), dim = lerp(1, 0.38, qdK(tU - 0.2, tU + 0.4, lt));
  ['비웃지 않고', '한탄하지 않고', '저주하지 않고'].forEach((w, i) => { if (lt < ts[i] - 0.1) return; const k = qdK(ts[i] - 0.1, ts[i] + 0.35, lt);
    h += `<g opacity="${spOp(k * dim)}" transform="translate(0 ${f1((1 - easeOut(k)) * 16)})">${fT(960, 260 + i * 124, w, 92, '#8A84A6')}</g>`; });
  if (lt > tU) { const k = qdK(tU, tU + 0.7, lt); h += `<circle cx="960" cy="690" r="${f1(420 * easeOut(k))}" fill="url(#spCandle)" opacity="${spOp(k * 0.9)}"/><g opacity="${spOp(k)}" transform="translate(960 730) scale(${f1(lerp(0.9, 1, easeOut(k)) * 1000) / 1000}) translate(-960 -730)">${outlined(960, 730, ['이해할 것'], { size: 150, sw: 24, fill: '#FFE9A8' })}</g>`; }
  return spDefs() + qCam(qLerpCam(lt / D, [960, 560, 1.0], [960, 580, 1.07]), h);
}

/* ---------- 8. 닫힌 문 앞에서 ---------- */
function spalleyScene(t, lt, a) {
  const D = a._dur || 10, tK = fAt(a, '쫓겨난', D * 0.5) + 0.5, tU = fAt(a, '이해였습니다', D - 1.2) - 0.3;
  const k = easeInOut(qdK(tK, D + 0.6, lt)), x = lerp(650, 1130, k), y = lerp(985, 820, k), s = lerp(0.74, 0.4, k), walking = lt > tK;
  const cam = qLerpCam(lt / D, [900, 620, 1.0], [1000, 600, 1.12]);
  const bag = (hx, hy) => { const p = spPt(x, y, s, hx, hy); return `<g transform="translate(${f1(p[0])} ${f1(p[1])}) scale(${f1(s * 1000) / 1000})"><path d="M-22 0 Q0 -40 22 0" fill="none" stroke="${INK}" stroke-width="7"/><rect x="-44" y="0" width="88" height="64" rx="12" fill="#B9794A" stroke="${INK}" stroke-width="7"/></g>`; };
  const pose = walking ? walkPose(lt * 6.2, 0.75) : P['서기'];
  const ps = typeof pose.armL === 'string' ? pose : pose, hL = pose.hL || [114, 400];
  let w = qShadow(x, y, 70 * s, 0.7) + SPZ({ x, y: y - (walking ? Math.abs(Math.sin(lt * 6.2)) * 8 * s : 0), s, t, pose, ex: fEx('z기본'), seed: 14, still: true, tilt: 0 });
  const hd = spPt(x, y - (walking ? Math.abs(Math.sin(lt * 6.2)) * 8 * s : 0), s, 200, 170);
  w += `<ellipse cx="${f1(hd[0])}" cy="${f1(hd[1] - 4 * s)}" rx="${f1(112 * s)}" ry="${f1(108 * s)}" fill="#3A2C26"/>`; // 뒷모습: 머리카락만
  for (let i = 0; i < 5; i++) w += `<path d="M${f1(hd[0] + (-70 + i * 35) * s)} ${f1(hd[1] - 50 * s)} q${f1(10 * s)} ${f1(40 * s)} 0 ${f1(80 * s)}" fill="none" stroke="#5A463C" stroke-width="${f1(5 * s)}" stroke-linecap="round"/>`;
  w += bag(hL[0], hL[1] + 16);
  if (lt > tU) { const p = spPt(x, y, s, (pose.hR || [286, 400])[0], (pose.hR || [286, 400])[1]), g = qdK(tU, tU + 0.6, lt); w += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(70 * g)}" fill="url(#spCandle)"/>` + zStar(p[0], p[1] - 4, 12 * g, '#FFF6DC', 0); }
  let over = pop(t, t - lt + 0.3, t - lt + tK + 0.5, 1330, 170, label(0, 0, '1656년 · 암스테르담', { size: 44, bg: '#FFF2C2' }), { rot: 3, bob: 2 });
  return spDefs() + qdPlate('alley', cam, 0.6) + qCam(cam, w) + over;
}
