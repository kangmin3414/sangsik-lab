/* 불교 편(수레 문답·무아) — 33~42번(대본_v2.md, 화면연출_v2.md): 10년 전 사진(mlphoto) · 등불 문답(mllamp) · AI 분신 연구(mlstudy). mlgf2.js 뒤에 읽는다. 새 이름은 모두 ml 접두사.
   대화 장면(등불)은 기본 연출(zw/GFX.md): gfxShots로 샷을 짜고 gfxDirect로 시선을 주고 gfxCompose로 쌓는다. 빛은 밤 → 새벽으로 이야기를 따라간다. */
['mlphoto', 'mllamp', 'mlstudy', 'mltue', 'mleve', 'mlday', 'mlend', 'mlroll', 'mlcard'].forEach(k => CAMS[k] = 'fixed');
Object.assign(ML_PEEL, { p33: 'dip', l36: 'both', r40: 'flash', t43: 'both', e48: 'dip', d51: 'flash', f52: 'both', f55: 'flash' });
const ML_DEFS3 = `<defs><clipPath id="mlScrC"><rect x="630" y="62" width="660" height="1110" rx="54"/></clipPath><clipPath id="mlPhC"><rect x="-800" y="-450" width="1600" height="900" rx="34"/></clipPath>
<linearGradient id="mlSpot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3C4" stop-opacity=".8"/><stop offset="1" stop-color="#FFF3C4" stop-opacity=".1"/></linearGradient>
<linearGradient id="mlLSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A3382"/><stop offset=".6" stop-color="#6A58A8"/><stop offset="1" stop-color="#C58CB4"/></linearGradient>
<linearGradient id="mlDSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E8AD6"/><stop offset=".6" stop-color="#D6B4D2"/><stop offset="1" stop-color="#FFE0B0"/></linearGradient>
<linearGradient id="mlRBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F1FF"/><stop offset="1" stop-color="#F7FBFF"/></linearGradient></defs>`;
P['ml마이크'] = mlPose({ armR: [[252, 285], [288, 334], [246, 306]], hR: [238, 298], armL: [[148, 285], [128, 340], [150, 392]], hL: [154, 400] });      // 오른손으로 마이크를 입 앞에
P['ml낮게'] = mlPose({ armR: [[252, 285], [300, 334], [330, 392]], hR: [336, 404] });                                                                     // 손바닥을 허리 아래로(아이 키)
P['ml등'] = mlPose({ armL: [[148, 285], [150, 340], [186, 352]], hL: [194, 354], armR: [[252, 285], [250, 340], [214, 352]], hR: [206, 354] });            // 두 손을 모아 등불 손잡이를 쥠
// 떨림 선: 떨리는 손 옆의 짧은 호 셋(34번 사진, 45번 제로, 54번 서윤에서 같은 모양으로 돌아온다)
const mlShakeLines = (x, y, t, k = 1, n = 3, side = 1) => { let h = ''; const fl = 0.6 + 0.4 * Math.sin(t * 26); for (let i = 0; i < n; i++) { const d = 14 + i * 15, a = 13 + i * 5; const pd = `M${f1(x + side * d)} ${f1(y - a)} q${side * 9} ${a} 0 ${2 * a}`, op = f1(clamp(k * (0.75 + 0.25 * fl) * (1 - i * 0.15), 0, 1) * 100) / 100; h += `<path d="${pd}" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" opacity="${op}"/><path d="${pd}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" opacity="${op}"/>`; } return h; };

/* ---------- 제로 시점 폰(화면 좌표): 몸통 + 두 손. inner는 화면 안(630~1290 × 62~1172)에 그릴 것. 손가락이 화면을 누르지 않는다 ---------- */
function mlPov(t, inner, o = {}) {
  const z = o.z || 1, dx = Math.sin(t * 0.5) * 5 + (o.dx || 0), dy = Math.sin(t * 0.37 + 1) * 4 + (o.dy || 0), ink = '#2B3350';
  let s = `<rect x="-60" y="-60" width="2040" height="1200" fill="#0F1530"/>` + gfxGlow(260, 240, 420, '#4A62C0', 0.5, { blend: false }) + gfxGlow(1700, 880, 520, '#2A3A80', 0.5, { blend: false });
  let p = `<rect x="602" y="34" width="716" height="1160" rx="78" fill="#1A2034" stroke="${INK}" stroke-width="12"/><rect x="630" y="62" width="660" height="1110" rx="54" fill="url(#mlPhoneBg)"/><g clip-path="url(#mlScrC)">${inner}</g>`;
  p += gfT(686, 124, o.clock || '11:40', 30, ink, { anchor: 'start', wt: 800 }) + `<rect x="1196" y="100" width="52" height="26" rx="7" fill="none" stroke="${ink}" stroke-width="4"/><rect x="1201" y="105" width="30" height="16" rx="3" fill="${ink}"/><rect x="1250" y="108" width="5" height="10" rx="2" fill="${ink}"/>`;
  const hand = sd => { const hx = 960 + sd * 398, hy = 640; return `<path d="M${hx + sd * 260} 1200 Q${hx + sd * 150} 1010 ${hx + sd * 30} ${hy + 40}" fill="none" stroke="${INK}" stroke-width="44" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="120" fill="#fff" stroke="${INK}" stroke-width="12"/><path d="M${hx - sd * 80} ${hy - 62} Q${hx - sd * 124} ${hy - 10} ${hx - sd * 84} ${hy + 50}" fill="none" stroke="#C9D6E2" stroke-width="10" stroke-linecap="round"/><rect x="${sd > 0 ? hx - 150 : hx + 56}" y="${hy - 110}" width="94" height="52" rx="26" fill="#fff" stroke="${INK}" stroke-width="10"/>`; };
  return s + `<g transform="translate(${f1(960 + dx)} ${f1(600 + dy)}) scale(${f1(z * 1000) / 1000}) translate(-960 -600)">` + gfxGlow(960, 560, 980, '#CFE2FF', 0.28) + p + hand(-1) + hand(1) + `</g>`;
}

/* ---------- [월요일 밤] 사진첩 → 10년 전 사진 ---------- */
// 사진첩의 작은 그림(204×204). 풍경 · 밥 · 셀카 · 화면 갈무리
function mlThumb(x, y, w, ty, h1) {
  const bg = [['#BFE3FF', '#8ADB6A'], ['#FFF1D6', '#FFB38A'], ['#E3EAFF', '#FFD84A'], ['#F6F7FB', '#C9D2E3']][ty], g = `<g transform="translate(${f1(x)} ${f1(y)})"><rect width="${w}" height="${w}" rx="16" fill="${bg[0]}"/>`;
  if (ty === 0) return g + `<circle cx="${f1(50 + h1 * 90)}" cy="56" r="24" fill="#FFE27A"/><path d="M0 ${w} L0 138 Q60 96 110 136 Q160 100 ${w} 128 L${w} ${w} Z" fill="${bg[1]}"/></g>`;
  if (ty === 1) return g + `<circle cx="102" cy="108" r="64" fill="#fff" stroke="#E3C9A6" stroke-width="6"/><circle cx="${f1(92 + h1 * 20)}" cy="104" r="34" fill="${bg[1]}"/><circle cx="118" cy="122" r="14" fill="#8ADB6A"/></g>`;
  if (ty === 2) return g + `<path d="M36 ${w} Q40 132 102 130 Q164 132 168 ${w} Z" fill="${h1 > 0.5 ? '#FF9A55' : '#3D4F7A'}"/><circle cx="102" cy="88" r="52" fill="#fff" stroke="#2B3350" stroke-width="5"/><circle cx="86" cy="90" r="5" fill="#2B3350"/><circle cx="118" cy="90" r="5" fill="#2B3350"/><path d="M90 108 Q102 118 114 108" fill="none" stroke="#2B3350" stroke-width="4" stroke-linecap="round"/></g>`;
  return g + [0, 1, 2, 3].map(i => `<rect x="24" y="${34 + i * 38}" width="${f1(90 + ((h1 * 7 + i * 0.37) % 1) * 66)}" height="16" rx="8" fill="${bg[1]}"/>`).join('') + `</g>`;
}
const mlThumbStage = (x, y, w, k) => `<g transform="translate(${f1(x)} ${f1(y)})"><rect width="${w}" height="${w}" rx="16" fill="#2A2046"/><path d="M82 0 L122 0 L176 ${w} L28 ${w} Z" fill="#FFF3C4" opacity=".4"/><rect x="0" y="150" width="${w}" height="54" fill="#5B4636"/><path d="M64 204 Q66 150 102 148 Q138 150 140 204 Z" fill="#FF9A55"/><circle cx="102" cy="104" r="44" fill="#fff" stroke="#2B3350" stroke-width="5"/><circle cx="90" cy="104" r="4.5" fill="#2B3350"/><circle cx="114" cy="104" r="4.5" fill="#2B3350"/><rect x="-5" y="-5" width="${w + 10}" height="${w + 10}" rx="20" fill="none" stroke="#FF9A55" stroke-width="${f1(10 * k)}" opacity="${f1(k * 100) / 100}"/></g>`;
// k: 스크롤 진행(0 → 1). 맨 아래 둘째 줄 가운데가 10년 전 공연 사진
function mlGallery(t, k) {
  const R = 38, TW = 204, RH = 216, x0 = 648, yTop = 268, yEnd = 470, S = (yTop + (R - 2) * RH - yEnd) * k, yr = 2026 - Math.round(10 * k);
  let h = `<rect x="630" y="62" width="660" height="1110" fill="#F4F6FB"/>`;
  for (let r = 0; r < R; r++) { const y = yTop + r * RH - S; if (y < -220 || y > 1200) continue;
    for (let c = 0; c < 3; c++) h += r === R - 2 && c === 1 ? mlThumbStage(x0 + c * RH, y, TW, k > 0.985 ? 0.6 + 0.4 * Math.sin(t * 7) : 0) : mlThumb(x0 + c * RH, y, TW, Math.floor(hash(r * 3.1 + c * 7.7) * 4), hash(r * 5.3 + c * 1.9)); }
  h += `<rect x="630" y="62" width="660" height="190" fill="#fff"/><path d="M630 252 H1290" stroke="#DCE2EE" stroke-width="3"/>` + gfT(688, 218, '사진', 46, '#1E2A4A', { anchor: 'start' }) + `<g transform="translate(1170 202) scale(${f1(gfBeat(t, 0, 0, 1, 1) * 1000) / 1000})">${gfChip(yr + '년', { size: 38, bg: yr === 2016 ? '#FFE9A8' : '#fff' })}</g>`;
  return h;
}
// 사진 속 그림(가운데가 원점, 1600×900): 동아리 공연 무대. sh = 마이크 쥔 손의 떨림(0~1)
function mlStagePhoto(t, sh = 0) {
  const jx = Math.sin(t * 41) * 3 * sh, jy = Math.cos(t * 37) * 2.2 * sh, zy = 262, zs = 0.92, P0 = P['ml마이크'], pose = Object.assign({}, P0, { hR: [P0.hR[0] + jx / zs, P0.hR[1] + jy / zs], armR: P0.armR.map((q, i) => i === 2 ? [q[0] + jx / zs, q[1] + jy / zs] : q) }), hd = gfHand(0, zy, zs, pose.hR);
  let p = `<rect x="-800" y="-450" width="1600" height="900" fill="#2A2046"/>` + Array.from({ length: 11 }, (_, i) => `<path d="M${-800 + i * 160} -450 Q${-760 + i * 160} -80 ${-800 + i * 160} 230" fill="none" stroke="#3A2D5E" stroke-width="26" stroke-linecap="round"/>`).join('');
  p += `<path d="M-330 -450 L-300 -372 M330 -450 L300 -372" stroke="#F4EAD0" stroke-width="5"/><g transform="translate(0 -338) rotate(-1.5)"><rect x="-330" y="-48" width="660" height="96" rx="12" fill="#F4EAD0" stroke="${INK}" stroke-width="7"/>${gfT(0, 19, '가을 정기 공연', 56, '#3B2F5C')}</g>`;
  p += `<rect x="-800" y="230" width="1600" height="220" fill="#5B4636"/><rect x="-800" y="222" width="1600" height="22" fill="#7A5E48" stroke="${INK}" stroke-width="6"/>`;
  const mate = (x, gtr) => `<g transform="translate(${x} 252) scale(.84)"><path d="M-64 0 Q-72 -176 0 -184 Q72 -176 64 0 Z" fill="#6E6A86" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><circle cy="-272" r="94" fill="#B9B6C8" stroke="${INK}" stroke-width="8"/>` +
    (gtr ? `<g transform="rotate(-24 0 -90)"><rect x="-150" y="-104" width="170" height="16" rx="8" fill="#8C5C2A" stroke="${INK}" stroke-width="6"/><ellipse cx="46" cy="-96" rx="62" ry="50" fill="#D9963F" stroke="${INK}" stroke-width="7"/><circle cx="46" cy="-96" r="16" fill="#5B4636"/></g>` : `<rect x="-130" y="-120" width="260" height="34" rx="10" fill="#E9E2D0" stroke="${INK}" stroke-width="7"/>` + Array.from({ length: 9 }, (_, i) => `<rect x="${-118 + i * 27}" y="-116" width="12" height="20" fill="#3B2F5C"/>`).join('') + `<path d="M-110 -86 L-126 0 M110 -86 L126 0" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`) + `</g>`;
  p += mate(-460, true) + mate(470, false);
  p += `<path d="M-130 -450 L90 -450 L350 300 L-350 300 Z" fill="url(#mlSpot)" style="mix-blend-mode:screen"/><ellipse cx="0" cy="270" rx="340" ry="48" fill="#FFF3C4" opacity=".3"/>`;
  // 스무 살의 제로: 후드티(목 뒤로 넘긴 모자), 재킷과 사원증은 아직 없다
  p += `<circle cx="0" cy="${f1(zy - 300 * zs)}" r="${f1(118 * zs)}" fill="#F08A3C" stroke="${INK}" stroke-width="7"/>` + shadow(0, zy + 2, 110, 0.3);
  p += mlZ({ x: 0, y: zy, s: zs, t, pose, ex: fEx('z당황'), look: [0.15, 0.3], noMark: true });
  const hx = hd[0], hy = hd[1];
  p += `<path d="M${f1(hx + 4)} ${f1(hy + 10)} L${f1(hx - 24)} ${f1(hy - 50)}" stroke="${INK}" stroke-width="17" stroke-linecap="round"/><path d="M${f1(hx + 4)} ${f1(hy + 10)} L${f1(hx - 24)} ${f1(hy - 50)}" stroke="#8E9BB8" stroke-width="8" stroke-linecap="round"/><circle cx="${f1(hx - 30)}" cy="${f1(hy - 62)}" r="21" fill="#3A4466" stroke="${INK}" stroke-width="6"/><path d="M${f1(hx - 40)} ${f1(hy - 70)} q10 -8 20 0" fill="none" stroke="#8E9BB8" stroke-width="4" stroke-linecap="round"/>` +
    `<circle cx="${f1(hx)}" cy="${f1(hy)}" r="${f1(22 * zs)}" fill="#fff" stroke="${INK}" stroke-width="${f1(7 * zs)}"/>`;
  if (sh > 0.02) p += mlShakeLines(hx + 22, hy, t, sh, 3, 1) + mlShakeLines(hx - 22, hy + 8, t, sh * 0.8, 2, -1);
  // 객석 뒷머리, 사진 날짜
  p += [-690, -470, -250, -30, 190, 410, 630].map((x, i) => `<circle cx="${x}" cy="${470 + (i % 3) * 14}" r="${92 + (i % 2) * 8}" fill="#15102A"/>`).join('') + `<path d="M-560 400 V330 M320 404 V340" stroke="#15102A" stroke-width="22" stroke-linecap="round"/><circle cx="-560" cy="318" r="20" fill="#15102A"/><circle cx="320" cy="328" r="20" fill="#15102A"/>`;
  p += gfT(590, 350, '2016. 11. 05', 42, '#FFA24A', { wt: 800 });
  return `<rect x="-818" y="-468" width="1636" height="936" rx="46" fill="#fff" stroke="${INK}" stroke-width="8"/><g clip-path="url(#mlPhC)">${p}</g>`;
}
function mlphotoScene(t, lt, a) {
  const c = mlCur(t), id = c ? c.id : 'p33', p33 = mlL('p33'), p34 = mlL('p34'), p35 = mlL('p35');
  if (id === 'p33') { const u = gfK(p33.t0 - 0.1, p33.t1 + 0.4, t), k = 1 - Math.pow(1 - u, 3); gfxMarksProject({ x: 960, y: 540, z: 1 });
    return gfxScreen(gfDefs() + ML_DEFS + ML_DEFS3 + mlPov(t, mlGallery(t, k), { clock: '11:40', z: 1 + 0.03 * u }) + gfxGrade('night', 0.25) + gfxVignette(0.55) + gfChipAt(t, p33.t0 + 0.1, 250, 96, '월요일 밤 11:40', { size: 34, icon: 'moon' })); }
  const tE = p34.t0 - 0.15, kx = gfIn(t, tE, 2.8, 0.6), tSh = mlAt('p34', '떨리는', 0.62), PX = 960, PY = 520, sh = mlS(t, tSh, 0.4);
  // 35번: 딱지가 사진에 스티커를 붙여 보지만 미끄러지고(첫 장), 튕긴다(둘째 장)
  const TX = 1622, TY = 956, TS = 1.45, mouth = [TX, TY - 84], tA = p35.t0 + 1.04, tB = mlAt('p35', '어?', 0.56) + 0.62;
  const evs = [{ t0: tA, from: mouth, to: [PX - 2, PY + 54], text: ['원래', '무대 체질 아님'], fs: 25, rot: -5, arc: 210, fly: 0.3, tp: p35.t0 - 0.1, te: p35.t0 + 0.72, off: tA + 0.2, offDx: -40 },
    { t0: tB, from: mouth, to: [PX + 26, PY + 40], text: ['원래', '무대 체질 아님'], fs: 25, rot: 6, arc: 250, fly: 0.3, print: 0.42, off: tB + 0.05, offDx: 460 }];
  const st = id === 'p35' ? mlStickers(t, evs) : { svg: '', fx: '', tak: { out: 0, arm: 'down' } };
  let cam = gfxCam([[0, { x: 960, y: 540, z: 1.0 }], [tE + 0.02, { x: 960, y: 534, z: 1.05 }, { d: tSh - tE, ease: 'lin' }], [tSh - 0.25, { x: 1004, y: 516, z: 2.0 }, { d: 0.9, ease: 'io' }], [tSh + 0.7, { x: 1006, y: 512, z: 2.14 }, { d: 2.6, ease: 'lin' }],
    [p35.t0 - 0.15, { x: 1070, y: 560, z: 1.08 }, { ease: 'cut' }], [p35.t0, { x: 1078, y: 562, z: 1.14 }, { d: 4.6, ease: 'lin' }]], t);
  cam = gfxShake(gfxDrift(cam, t, 3, 4), t, [[tA, 6, 0.2], [tB, 12, 0.3]]); gfxMarksProject(cam);
  const bo = gfBeat(t, tB, 0.035, 5, 8) * gfBeat(t, tA, 0.015, 5, 9), k1 = Math.min(1, kx);
  const photo = `<g transform="translate(${PX} ${f1(lerp(572, PY, k1))}) rotate(${f1(-1.5 * k1)}) scale(${f1((0.127 + 0.873 * kx) * bo * 1000) / 1000})">${mlStagePhoto(t, sh)}</g>`;
  const kin = gfIn(t, p35.t0 - 0.5, 3.2, 0.42), tv = gfxVoice(t, 'T');
  const tak = id !== 'p35' && t < p35.t0 - 0.5 ? '' : mlTak(TX, TY + (1 - Math.min(1, kin)) * 300, TS, Object.assign({ t, look: t > tB + 0.1 ? [-0.5, 0.5] : [-0.85, -0.35], talk: tv ? tv.e : 0, ex: t > tB + 0.12 ? 'shock' : 'on', ls: 0.72 }, st.tak, gfHop(t, tB - 0.3, 24, 0.26)));
  const bg = `<rect x="-60" y="-60" width="2040" height="1200" fill="#0F1530"/>` + gfxGlow(300, 260, 520, '#4A62C0', 0.5, { blend: false }) + gfxGlow(1700, 900, 560, '#2A3A80', 0.5, { blend: false });
  const em = gfEmote(t, tB + 0.38, TX - 16, TY - 300, 'q', { hold: 1.5, s: 1.15 });
  return gfxScreen(gfDefs() + ML_DEFS + ML_DEFS3 + gfxDefs({}) + bg + gfxLayer(cam, 1, photo + st.svg + st.fx) + gfxLayer(cam, 1.12, tak + em) + gfxGrade('warm', 0.16) + gfxVignette(0.5) +
    gfChipAt(t, p34.t0 + 0.15, 236, 96, '10년 전', { size: 36, icon: 'clock' }));
}

/* ---------- [옛이야기 2] 등불(사갈라의 밤) ---------- */
const ML_LP = { GY: 890, KX: 760, MX: 1620, ZX: 1190, ZS: 0.84, ZY: 868, LX: 1190, LY: 752 };
// 불꽃(가운데 아래가 원점). k: 크기, fl: 흔들림(-1~1)
const mlFlame = (k = 1, fl = 0, cols = ['#FF9A3D', '#FFE27A', '#FFF8D6']) => `<g transform="scale(${f1(k * (1 + 0.05 * fl) * 1000) / 1000} ${f1(k * (1 - 0.06 * fl) * 1000) / 1000}) skewX(${f1(fl * 7)})"><path d="M0 0 Q-34 -18 -24 -58 Q-16 -84 2 -112 Q10 -84 24 -62 Q38 -24 0 0 Z" fill="${cols[0]}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M0 -6 Q-18 -18 -12 -46 Q-6 -62 2 -78 Q8 -60 14 -46 Q20 -20 0 -6 Z" fill="${cols[1]}"/><path d="M0 -8 Q-8 -16 -4 -32 Q0 -40 2 -46 Q6 -36 8 -30 Q10 -16 0 -8 Z" fill="${cols[2]}"/></g>`;
// 손에 든 등(손잡이 끝이 원점): 고리 + 흙 등잔
const mlLantern = () => `<path d="M0 0 V34" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-46 62 Q-40 34 0 34 Q40 34 46 62 Q50 92 0 96 Q-50 92 -46 62 Z" fill="#B9825A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-30 58 Q0 48 30 58" fill="none" stroke="#E0B48A" stroke-width="6" stroke-linecap="round" opacity=".7"/><ellipse cx="0" cy="62" rx="20" ry="7" fill="#3B2A20"/>`;
function mlLampCard(text, cols, fl) { return gfPanel(250, 250, {}) + `<g transform="translate(0 62)">${mlFlame(1.25, fl, cols)}</g><g transform="translate(0 150)">${gfChip(text, { size: 32, bg: '#FFF6D8' })}</g>`; }
function mllampScene(t, lt, a) {
  const { GY, KX, MX, ZX, ZS, ZY, LX, LY } = ML_LP, c = mlCur(t), id = c ? c.id : 'l36', L = k => mlL('l' + k), l36 = L(36), l37 = L(37), l38 = L(38), l39 = L(39);
  /* --- 사건 시각 --- */
  const tKid = mlAt('l36', '어릴', 0.06), tAsk = mlAt('l36', '같은', 0.5), tLamp = mlAt('l37', '등불', 0.12), tC1 = mlAt('l37', '초저녁', 0.42), tC2 = mlAt('l37', '새벽', 0.6), tEq = mlAt('l37', '같은', 0.77);
  const tX = l38.t0 + 0.4, tBut = mlAt('l38', '하지만', 0.31), tOne = mlAt('l38', '한', 0.42), tTh = mlAt('l38', '밤새', 0.72), tNe = mlAt('l39', '같지도', 0.38), tSa = mlAt('l39', '다르지도', 0.64);
  const kD = 0.7 * mlS(t, tC2 - 0.2, 2.0) + 0.3 * mlS(t, tSa - 0.2, 1.6);      // 밤 → 새벽(이야기를 따라가는 빛)
  /* --- 샷 계획(기본 연출): 36번 두 사람 → 왕, 37번 등불 → 전체(불꽃 카드), 38번 전체 → 왕 → 등불과 카드, 39번 어깨 너머 → 스님 얼굴 --- */
  const CAST = { K: { x: KX, y: GY - 390, r: 162, to: 'M', status: tt => tt < tBut ? 0.7 : 0, seed: 5 }, M: { x: MX, y: GY - 382, r: 136, to: 'K', seed: 7 }, Z: { x: ZX, y: ZY - 390 * ZS, r: 118, seed: 2 } };
  if (!window._mlPlanL) { const W = { x: LX, y: 472, z: 1.17, r: 0, f: 1, p: 0 }, kc = _gfxFrame(CAST, ['K'], 'mcu', { lead: 130 }), d37 = tC1 - 0.3 - l37.t0;
    const plan = gfxShots([l36, l37, l38, l39], CAST, { wide: W, noReact: ['l39'], over: {
      l37: [[-0.15, { x: LX, y: 640, z: 2.2, r: 0, f: 1, p: 0 }, { ease: 'cut' }], [-0.13, { y: 648, z: 2.36 }, { d: d37, ease: 'lin' }], [d37, W, { ease: 'cut' }], [d37 + 0.02, { z: W.z * 1.05 }, { d: l37.t1 - l37.t0 - d37 + 0.75, ease: 'lin' }]],
      l38: [[-0.15, { x: LX, y: 470, z: 1.22, r: 0, f: 1, p: 0 }, { ease: 'cut' }], [-0.13, { z: 1.26 }, { d: tBut - l38.t0, ease: 'lin' }], [tBut - 0.14 - l38.t0, { x: kc.x, y: kc.y, z: kc.z, p: 0.3 }, { ease: 'cut' }], [tBut - 0.12 - l38.t0, { z: kc.z * 1.05, p: 0 }, { d: tTh - tBut, ease: 'lin' }],
        [tTh - 0.12 - l38.t0, { x: LX, y: 500, z: 1.26 }, { ease: 'cut' }], [tTh - 0.1 - l38.t0, { z: 1.33, y: 506 }, { d: l38.t1 - tTh + 0.7, ease: 'lin' }]] } });
    window._mlPlanL = { plan, kHide: kc.hide, tCut37: l37.t0 + d37 }; }
  const PL = window._mlPlanL, sh = gfxShotAt(PL.plan, t);
  const hide = sh.type === 'manual' ? (sh.line === 'l37' && t < PL.tCut37 ? ['K', 'M'] : (sh.line === 'l38' && t >= tBut - 0.14 && t < tTh - 0.12 ? PL.kHide : [])) : sh.hide;
  const tWake = tC2 + 0.05, asleep = t > l36.t0 + 3.0 && t < tWake;
  const D = gfxDirect(t, CAST, { focus: [[tLamp - 0.1, tC1 - 0.3, LX, LY - 40], [tC1 - 0.3, tEq + 0.5, LX, 260], [tOne - 0.1, l38.t1 + 0.4, LX, LY - 40, ['K', 'Z']]], lid: [[l38.t0 - 0.2, tBut - 0.1, 'K', 0.42], [l36.t1 + 0.1, l37.t0 + 0.9, 'K', 0.3]] });
  let cam = gfxShake(gfxDrift(gfxCam(PL.plan.keys, t), t, 3, 6), t, [[tX, 7, 0.2], [tWake, 6, 0.22]]);
  const mood = gfxMood(t, [[tSa - 0.1, 0.5, 1.8]]), fl = Math.sin(t * 13) * 0.5 + Math.sin(t * 7.3 + 1) * 0.5;
  /* --- 왕 --- */
  const kta = gfxTalkAct(t, 'K', 5), kBase = id === 'l36' ? 'ml왕의심' : id === 'l37' ? 'ml왕' : id === 'l38' ? (t < tOne ? 'ml왕의심' : 'ml왕깨달') : (t < tNe + 1.2 ? 'ml왕깨달' : 'ml왕');
  const kPose = actPose([[0, '서기'], [tKid - 0.1, 'ml낮게', { f: 3, z: 0.6 }], [tAsk - 0.15, 'ml으쓱', { f: 3.2, z: 0.55 }], [l36.t1 + 0.3, '서기', { f: 2.4, z: 0.8 }], [l38.t0 - 0.3, '턱괴기', { f: 2.6, z: 0.7 }], [tOne - 0.1, 'ml가리킴R', { f: 3.2, z: 0.55 }], [l38.t1 + 0.4, '서기', { f: 2.4, z: 0.8 }]], t);
  const king = mlK(Object.assign({ x: KX, y: GY, s: 1.0, t, pose: kPose }, gfxAct(D.K), { ex: gfxEx(gfxFace('mlkf', kBase, t, 'K', { brow: 6 }), D.K), sy: kta.sy, light: 1 }));
  /* --- 스님 --- */
  const mta = gfxTalkAct(t, 'M', 7), mTalk = !!gfxVoice(t, 'M');
  const mPose = actPose([[0, '서기'], [tLamp - 0.2, 'ml가리킴L', { f: 3, z: 0.6 }], [tC1 - 0.4, '서기', { f: 2.4, z: 0.8 }], [mlAt('l39', '사람도', 0.02) + 0.1, 'ml가슴손', { f: 2.6, z: 0.7 }], [l39.t1 + 0.5, '서기', { f: 2.2, z: 0.85 }]], t);
  const monk = mlM(Object.assign({ x: MX, y: GY, s: 0.98, t, pose: mPose }, gfxAct(D.M), { ex: gfxEx(gfxFace('mlmf', mTalk && t < tSa ? 'ml스님뜬' : 'ml스님', t, 'M', { brow: 3 }), D.M), sy: mta.sy, light: 1 }));
  /* --- 제로(등불지기): 하품 → 꾸벅 → '새벽'에서 번쩍 깸 --- */
  const yawn = t > l36.t0 + 0.7 && t < l36.t0 + 2.3, zj = actHit(t, tWake, 0.09, 5, 7), droop = asleep ? 16 * mlS(t, l36.t0 + 3.0, 1.2) + 5 * Math.sin(t * 1.6) : 0;
  const zBase = yawn ? 'z하품' : asleep ? 'z졸음' : t < tWake + 1.3 ? 'z당황' : t > tSa + 0.3 ? 'z반짝' : 'z기본';
  const zAct = asleep || yawn ? { look: [0, 0.5], turn: 0, headDy: droop, tilt: asleep ? 5 + 2 * Math.sin(t * 1.6) : 0, sy: 1, rot: 0 } : gfxAct(D.Z);
  const zero = mlZ(Object.assign({ x: ZX, y: ZY, s: ZS, t, pose: P['ml등'] }, zAct, { ex: asleep || yawn ? fEx(zBase) : gfxEx(fEx(zBase), D.Z), sx: zj.sx, sy: zj.sy, light: 1 }), true);
  const hd = gfHand(ZX, ZY, ZS, [200, 354]), sway = Math.sin(t * 1.3) * 3 + (asleep ? 4 * Math.sin(t * 1.6) : 0);
  const lantern = `<g transform="translate(${f1(hd[0])} ${f1(hd[1] + droop * 0.5)}) rotate(${f1(sway)})">${mlLantern()}</g>`;
  const fx0 = hd[0] - Math.sin(sway * Math.PI / 180) * 60, fy0 = hd[1] + droop * 0.5 + 60;                 // 불꽃 자리(심지)
  /* --- 무대: 낮 사갈라를 밤으로(하늘을 바꾸고 배경에 푸른 막) --- */
  const set = mlSagalaSet(t), stars = [[-300, 120], [80, 60], [420, 200], [900, 90], [1250, 170], [1600, 70], [1980, 150], [2400, 90], [2700, 220], [640, 300], [1420, 300], [2150, 320]].map(([x, y], i) => gfTwinkle(t, x, y, 7 + (i % 3) * 2, i * 1.7, i % 2 ? '#FFF3B8' : '#fff')).join('');
  const sky = `<rect x="-900" y="-500" width="4400" height="1900" fill="url(#mlLSky)"/>` + mlOp(kD, `<rect x="-900" y="-500" width="4400" height="1900" fill="url(#mlDSky)"/>`) + mlOp(1 - kD, stars + `<g transform="translate(330 170)"><circle r="56" fill="#FFF3C4"/><circle cx="24" cy="-12" r="50" fill="#2A3382"/></g>`);
  const veil = `<rect x="-900" y="-500" width="4400" height="2200" fill="${gfMix('#1B2158', '#566CA6', kD)}" opacity="${f1(lerp(0.6, 0.3, kD) * 100) / 100}"/>`;
  /* --- 불꽃 카드(37~38번): 초저녁 불꽃 / 새벽 불꽃, 가운데 =? → ✕ → 한 심지로 이어짐 --- */
  // 왕의 한 사람 샷(하지만 ~ 밤새)에서는 카드를 숨긴다: 넓은 샷에 맞춘 카드가 화면 위에서 잘린다
  let info = ''; const kOut = 1 - mlS(t, l39.t0 - 0.35, 0.3);
  if (t > tC1 - 0.1 && kOut > 0.01 && !(t >= tBut - 0.14 && t < tTh - 0.12)) { const c1 = [LX - 215, 250], c2 = [LX + 215, 250], k1 = gfIn(t, tC1, 3.2, 0.42) * kOut, k2 = gfIn(t, tC2, 3.2, 0.42) * kOut, ke = gfIn(t, tEq, 3.4, 0.4) * kOut, kt = mlS(t, tTh, 0.8);
    if (kt > 0.01) { const th = (x0, sg) => `<path d="M${x0} 380 C${x0 - sg * 40} 560 ${LX - sg * 190} 770 ${f1(fx0)} ${f1(fy0 - 30)}" fill="none" stroke="#FFD27A" stroke-width="9" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${f1((1 - kt) * 1000) / 1000}" opacity="${f1(kOut * 100) / 100}"/>`; info += th(c1[0], 1) + th(c2[0], -1); }
    info += `<g transform="translate(${c1[0]} ${c1[1]}) scale(${f1(k1 * 1000) / 1000})">${mlLampCard('초저녁 불꽃', ['#FF8A2D', '#FFD05A', '#FFF3C4'], fl)}</g>` + (t > tC2 ? `<g transform="translate(${c2[0]} ${c2[1]}) scale(${f1(k2 * 1000) / 1000})"><g transform="translate(0 0)">${gfPanel(250, 250, {})}<g transform="translate(0 62) scale(.86 1.12)">${mlFlame(1.25, -fl, ['#FFB45A', '#FFF0A8', '#EAF4FF'])}</g><g transform="translate(0 150)">${gfChip('새벽 불꽃', { size: 32, bg: '#EAF4FF' })}</g></g></g>` : '');
    if (ke > 0.01) info += `<g transform="translate(${LX} 250) scale(${f1(ke * gfBeat(t, tX, 0.12, 5, 9) * 1000) / 1000})">${gfT(0, 28, t > tTh + 0.5 ? '~' : '=?', 84, '#fff', { stroke: INK, sw: 12 })}</g>` + (t > tTh + 0.5 ? '' : mlX(t, tX, LX, 250, 0.62)) + gfStarBurst(t, tTh + 0.75, fx0, fy0 - 50, { n: 7, r0: 30, r1: 150 }); }
  const em = gfEmote(t, l36.t0 + 0.35, KX + 170, GY - 560, 'q', { hold: 1.2, s: 0.9 }) + (hide.includes('Z') ? '' : gfEmote(t, l36.t0 + 2.9, ZX + 110, ZY - 500 * ZS, 'zzz', { hold: tWake - l36.t0 - 3.1, s: 0.8 }) + gfEmote(t, tWake + 0.05, ZX + 120, ZY - 500 * ZS, 'bang', { hold: 0.9, s: 0.85 })) + gfEmote(t, tOne + 0.5, KX + 170, GY - 560, 'idea', { hold: 1.3 });
  /* --- 층 쌓기 --- */
  const vis = k => !hide.includes(k) && !(sh.ots && sh.ots.who === k); if (!vis('K')) gfxUnmark('왕'); if (!vis('M')) gfxUnmark('스님'); if (!vis('Z')) gfxUnmark('제로');
  const kp = gfxProj(cam, fx0, fy0 - 40), OTSC = { K: { cloth: '#7A3B8C', hair: '#3B2A20', band: '#FBF7EA' }, M: { cloth: '#E79A3C', sash: '#C96F1E' } };
  const zG = vis('Z') ? shadow(ZX, ZY + 2, 100, 0.26) + zero + lantern : '', kmG = (vis('K') ? shadow(KX, GY + 2, 120, 0.28) + king : '') + (vis('M') ? shadow(MX, GY + 2, 116, 0.28) + monk : '');
  const flame = vis('Z') ? `<g transform="translate(${f1(fx0)} ${f1(fy0)})">${mlFlame(0.62, fl)}</g>` : '';
  let hud = gfChipAt(t, l36.t0 + 0.1, 258, 96, '사갈라의 밤', { size: 34, icon: 'moon' });
  if (t > tC1 - 0.05 && t < l38.t0 + 0.2) hud += `<g transform="translate(960 96) scale(${f1(gfIn(t, tC1 - 0.05, 3.2, 0.42) * gfBeat(t, tC2, 0.14, 5, 9) * (1 - mlS(t, l38.t0 - 0.1, 0.3)) * 1000) / 1000})">${gfChip(t < tC2 ? '초저녁' : '새벽', { size: 36, icon: t < tC2 ? 'moon' : 'sun', bg: t < tC2 ? '#E3EAFF' : '#FFF1C8' })}</g>`;
  // 39번: 구석의 [나] — 스무 살의 제로와 지금의 제로. "같지도 않고" ≠, "다르지도 않습니다" 이어짐
  if (t > tNe - 0.1) { const face = (x, key, suit) => `<g transform="translate(${x} 0)"><circle r="92" cy="7" fill="#1E2A4A" opacity=".25"/><circle r="88" fill="#FFF1D0" stroke="${INK}" stroke-width="8"/><svg x="-88" y="-88" width="176" height="176" viewBox="-170 -565 340 340"><g clip-path="url(#mlPc)">${mlZ({ x: 0, y: 0, s: 1, t, pose: P['서기'], ex: fEx(key), look: [0, 0.05], noMark: true }, suit)}</g></svg><circle r="88" fill="none" stroke="${INK}" stroke-width="8"/></g>`;
    const kk = gfIn(t, tNe, 3.2, 0.42), kl = mlS(t, tSa, 0.6);
    hud += `<g transform="translate(1560 196) scale(${f1(kk * 1000) / 1000})">` + (kl > 0.01 ? `<path d="M-52 0 H52" stroke="#FFD27A" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${f1((1 - kl) * 1000) / 1000}"/>` : `<path d="M-52 0 H52" stroke="#fff" stroke-width="6" stroke-dasharray="6 12" stroke-linecap="round"/>`) + face(-140, 'z당황', false) + face(140, 'z빵긋', true) +
      `<g transform="translate(-140 116)">${gfChip('스무 살', { size: 26, bg: '#FFF6D8' })}</g><g transform="translate(140 116)">${gfChip('지금', { size: 26, bg: '#FFF6D8' })}</g>` + (kl < 0.5 ? `<g transform="scale(${f1(gfBeat(t, tNe + 0.3, 0.2, 5, 9) * 1000) / 1000})">${gfT(0, 20, '≠', 60, '#fff', { stroke: INK, sw: 10 })}</g>` : '') + `</g>` + gfStarBurst(t, tSa + 0.5, 1560, 196, { n: 7, r0: 40, r1: 190 }); }
  return gfxCompose({ cam, defs: gfDefs() + ML_DEFS + ML_DEFS3 + gfxDefs({ shadow: '#141840', lights: [{ id: 'mlLl', amb: gfMix('#454A8C', '#A2A8D2', kD), key: { x: kp[0], y: kp[1], z: 300 * cam.z, col: '#FFB45A', k: (1.2 + 0.12 * fl) * mood.light }, rim: { dx: 0, dy: 6, col: '#FFC27A', k: 0.6 }, bump: 5, relief: 8 }] }),
    far: [[0.12, sky + set.mount], [0.5, set.town], [0.82, set.colon + set.tree], [1, set.ground + set.dais + veil]],
    lit: [[zG, 0.84], [kmG, 1]], light: 'mlLl', ots: sh.ots ? gfxOTS(sh.ots.side, Object.assign({ t, cam, dark: 0.34 }, OTSC[sh.ots.who])) : '',
    glow: (vis('Z') ? gfxGlow(fx0, fy0 - 40, 330 + 24 * fl, '#FFB45A', 0.5 * (1 - 0.35 * kD)) : '') + flame + info + em, fg: set.fg, fgDepth: 1.3, fgFd: 1.9,
    grade: gfxGrade('night', 0.3 * (1 - kD)) + gfxGrade('dawn', 0.3 * kD), mood: mood.over, vig: gfxVignette(lerp(0.6, 0.4, kD), '#0B1030'), hud });
}

/* ---------- [2026년] 나를 흉내 내는 AI(연구 하나) ---------- */
// 회색 사람 그림(발 가운데가 원점). o.dash: 아직 윤곽뿐
const mlSil = (x, y, s, col = '#B9C0CF', o = {}) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"${o.op != null ? ` opacity="${f1(o.op * 100) / 100}"` : ''}><path d="M-70 0 Q-80 -190 0 -198 Q80 -190 70 0 Z" fill="${o.dash ? 'none' : col}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"${o.dash ? ' stroke-dasharray="16 12"' : ''}/><circle cy="-292" r="100" fill="${o.dash ? 'none' : (o.head || '#fff')}" stroke="${INK}" stroke-width="9"${o.dash ? ' stroke-dasharray="16 12"' : ''}/>${o.face || ''}</g>`;
const ML_ANS = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1], ML_AI = [1, 0, 0, 1, 0, 1, 1, 0, 1, 0], ML_ME2 = [1, 0, 1, 1, 1, 1, 0, 0, 0, 1];      // 처음의 나 · AI가 푼 나(일곱 칸이 같다) · 2주 뒤의 나(여덟 칸이 같다)
function mlstudyScene(t, lt, a) {
  const c = mlCur(t), id = c ? c.id : 'r40', r40 = mlL('r40'), r41 = mlL('r41'), r42 = mlL('r42'); gfxMarksProject({ x: 960, y: 540, z: 1 });
  const tPp = mlAt('r40', '천여', 0.31), tIv = mlAt('r40', '시간', 0.41), tRec = mlAt('r40', '기록', 0.57), tTw = mlAt('r40', '흉내', 0.78), tAI = mlAt('r40', 'AI', 0.84);
  let s = `<rect x="-60" y="-60" width="2040" height="1200" fill="url(#mlRBg)"/><rect x="-60" y="-60" width="2040" height="1200" fill="url(#gfDots)" opacity=".35"/>`;
  const zo = 1 + 0.03 * gfK(r40.t0, r42.t1, t), wrap = inner => `<g transform="translate(960 540) scale(${f1(zo * 1000) / 1000}) translate(-960 -540)">${inner}</g>`;
  let g = '';
  if (id === 'r40') {
    // 첫머리: 사갈라에서 오늘까지 2,100년을 건너오는 눈금(사람들이 나오기 전의 빈 화면을 채운다)
    { const k0 = gfIn(t, r40.t0 - 0.05, 3, 0.5) * (1 - mlS(t, tPp - 0.75, 0.35)), kr = easeInOut(gfK(r40.t0 + 0.1, r40.t0 + 1.7, t)), xa = 430, xb = 1490, xm = lerp(xa, xb, kr);
      if (k0 > 0.01) g += `<g opacity="${f1(Math.min(1, k0) * 100) / 100}"><path d="M${xa} 560 H${xb}" stroke="#C3CCE0" stroke-width="12" stroke-linecap="round"/><path d="M${xa} 560 H${f1(xm)}" stroke="#6C8CFF" stroke-width="12" stroke-linecap="round"/>` + Array.from({ length: 22 }, (_, i) => `<path d="M${f1(xa + (xb - xa) * i / 21)} 578 v${i % 7 ? 14 : 26}" stroke="#9AA6C0" stroke-width="5" stroke-linecap="round"/>`).join('') +
        `<g transform="translate(${xa} 474) scale(.24)">${mlWheel(44, -126, 108, 0, true)}${mlBody()}${mlPole()}${mlWheel(-10, -118, 118, 0, false)}</g><g transform="translate(${xa} 656)">${gfChip('사갈라', { size: 30, bg: '#FFF1C8' })}</g><g transform="translate(${xb} 656) scale(${f1(gfIn(t, r40.t0 + 1.6, 3.2, 0.42) * 1000) / 1000})">${gfChip('오늘', { size: 30, bg: '#E3EAFF' })}</g>` +
        `<circle cx="${f1(xm)}" cy="560" r="20" fill="#fff" stroke="${INK}" stroke-width="7"/><g transform="translate(960 420) scale(${f1(k0 * 1000) / 1000})">${gfChip('2,100년', { size: 56, icon: 'clock', bg: '#fff' })}</g></g>` + gfStarBurst(t, r40.t0 + 1.7, xb, 560, { n: 7, r0: 30, r1: 150 }); }
    // 천여 명: 작은 사람들이 줄줄이
    const N = 44; for (let i = 0; i < N; i++) { const k = gfIn(t, tPp - 0.5 + i * 0.022, 3.6, 0.45); if (k <= 0) continue; const col = i % 22, row = Math.floor(i / 22); g += mlSil(190 + col * 73.5 + (row ? 36 : 0), 226 + row * 92, 0.2 * k, ['#B9C0CF', '#C9CFDC', '#AEB6C8'][i % 3]); }
    g += `<g transform="translate(960 384) scale(${f1(gfIn(t, tPp + 0.15, 3.2, 0.42) * 1000) / 1000})">${gfChip('천여 명', { size: 40, bg: '#FFF6D8' })}</g>`;
    // 한 사람 → 말풍선(인터뷰 기록) → 윤곽 → AI 분신
    const PXA = 470, PXB = 1450, PY0 = 800, kp = gfIn(t, tIv - 0.45, 3.2, 0.42), wave = t > tTw ? Math.sin((t - tTw) * 9) * 0.5 + 0.5 : 0;
    const face = `<circle cx="-34" cy="-296" r="9" fill="${INK}"/><circle cx="34" cy="-296" r="9" fill="${INK}"/><path d="M-22 -258 Q0 -242 22 -258" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
    const arm = (sg, k) => `<path d="M${sg * 66} -150 Q${sg * 130} ${f1(-170 - 60 * k)} ${sg * 150} ${f1(-230 - 50 * k)}" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><circle cx="${sg * 152}" cy="${f1(-240 - 50 * k)}" r="20" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
    if (kp > 0) g += mlSil(PXA, PY0, 0.86 * kp, '#B9C0CF', { face: face + (t > tTw ? arm(1, wave) : '') }) + `<g transform="translate(${PXA} ${PY0 + 44}) scale(${f1(kp * 1000) / 1000})">${gfChip('한 사람', { size: 30 })}</g>`;
    if (t > tIv - 0.1) { g += `<g transform="translate(${PXA + 10} 458) scale(${f1(gfIn(t, tIv, 3.2, 0.42) * (1 - mlS(t, tRec + 1.4, 0.3)) * 1000) / 1000})">${gfChip('두 시간 인터뷰', { size: 34, icon: 'clock', bg: '#E3EAFF' })}</g>`;
      for (let i = 0; i < 9; i++) { const t0 = tIv + 0.1 + i * 0.3, u = (t - t0) / 1.5; if (u <= 0 || u >= 1) continue; const e = easeInOut(u), x = lerp(PXA + 150, 960, e), y = lerp(520, 560 + (i % 3) * 16, e) - Math.sin(Math.PI * e) * 110, w = 96 + (i % 3) * 22;
        g += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(lerp(1, 0.6, e) * 1000) / 1000})" opacity="${f1(Math.min(1, u * 5, (1 - u) * 5) * 100) / 100}"><rect x="${-w / 2}" y="-26" width="${w}" height="52" rx="22" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M${-w / 2 + 18} -6 H${w / 2 - 18} M${-w / 2 + 18} 10 H${w / 2 - 34}" stroke="#9AA6B8" stroke-width="6" stroke-linecap="round"/></g>`; }
      // 쌓이는 기록 뭉치
      const nPg = clamp(Math.floor((t - tIv - 1.3) / 0.3) + 1, 0, 7), kg = 1 - mlS(t, tTw - 0.5, 0.5); for (let i = 0; i < nPg; i++) g += `<g transform="translate(${960 + (i % 2 ? 5 : -5)} ${f1(640 - i * 13)}) rotate(${(i % 3 - 1) * 3})" opacity="${f1((0.35 + 0.65 * kg) * 100) / 100}"><rect x="-74" y="-40" width="148" height="80" rx="10" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M-50 -14 H50 M-50 4 H50 M-50 22 H20" stroke="#C3CCD6" stroke-width="6" stroke-linecap="round"/></g>`;
      if (nPg > 0) g += `<g transform="translate(960 716) scale(${f1(gfIn(t, tRec - 0.1, 3.2, 0.42) * 1000) / 1000})">${gfChip('인터뷰 기록', { size: 30, bg: '#FFF6D8' })}</g>`; }
    // 기록 → 윤곽(점선) → 채워짐(AI 분신)
    if (t > tRec) { const kf = mlS(t, tTw - 0.45, 0.6), ko = gfIn(t, tRec + 0.2, 3, 0.45);
      for (let i = 0; i < 5; i++) { const t0 = tRec + 0.35 + i * 0.22, u = (t - t0) / 0.9; if (u <= 0 || u >= 1) continue; g += `<circle cx="${f1(lerp(1040, PXB - 120, easeInOut(u)))}" cy="${f1(600 - Math.sin(Math.PI * u) * 70)}" r="${f1(11 * (1 - 0.4 * u))}" fill="#6C8CFF" opacity="${f1(Math.min(1, u * 4, (1 - u) * 4) * 100) / 100}"/>`; }
      g += mlSil(PXB, PY0, 0.86 * ko, '#BFE3FF', { dash: kf < 0.5, head: '#EAF4FF', face: kf >= 0.5 ? face + (t > tTw ? arm(-1, wave) : '') : '' });
      if (t > tAI) g += `<g transform="translate(${PXB + 96} ${PY0 - 372}) scale(${f1(gfIn(t, tAI, 3.4, 0.4) * 1000) / 1000})"><circle r="44" fill="#6C8CFF" stroke="${INK}" stroke-width="7"/><g transform="scale(.8)">${gfStar4(30, '#fff', 0)}</g></g><g transform="translate(${PXB} ${PY0 + 44}) scale(${f1(gfIn(t, tAI + 0.1, 3.2, 0.42) * 1000) / 1000})">${gfChip('흉내 내는 AI', { size: 30, bg: '#E3EAFF' })}</g>` + gfStarBurst(t, tAI, PXB, PY0 - 300, { n: 8, r0: 60, r1: 240 }); }
  } else {
    // 답안지: 칸 열 개씩 세 줄. 같은 칸은 초록으로 켜진다
    const X0 = 620, CW = 104, RY = [330, 520, 710], tA0 = mlAt('r41', '설문', 0.06), tA1 = mlAt('r41', 'ai', 0.25), tL1 = mlAt('r41', '10개', 0.57), tE1 = mlAt('r41', '7개', 0.74) + 0.35;
    const tB0 = mlAt('r42', '본인이', 0.06), tB1 = mlAt('r42', '다시', 0.25), tL2 = mlAt('r42', '10개', 0.49), tE2 = mlAt('r42', '8개', 0.58) + 0.45, tMd = mlAt('r42', '기분', 0.77), tMs = mlAt('r42', '실수', 0.82);
    const mark = (v, col) => v ? `<circle r="24" fill="none" stroke="${col}" stroke-width="10"/>` : `<path d="M-20 -20 L20 20 M20 -20 L-20 20" stroke="${col}" stroke-width="10" stroke-linecap="round"/>`;
    const row = (ri, label, bg, ans, tIn, tFill, cmp, tL, tE) => { const kr = gfIn(t, tIn, 3.2, 0.42); if (kr <= 0) return ''; let h = `<g transform="translate(0 ${RY[ri]})"><g transform="translate(360 0) scale(${f1(kr * 1000) / 1000})">${gfChip(label, { size: 34, bg })}</g>`;
      for (let i = 0; i < 10; i++) { const kc = gfIn(t, tIn + 0.1 + i * 0.03, 3.4, 0.45), same = cmp && ans[i] === ML_ANS[i], nth = cmp ? ML_ANS.slice(0, i + 1).filter((v, j) => v === ans[j]).length : 0, tot = cmp ? ML_ANS.filter((v, j) => v === ans[j]).length : 0;
        const tOn = cmp && same ? lerp(tL, tE, tot > 1 ? (nth - 1) / (tot - 1) : 0) : 1e9, on = t >= tOn, km = gfIn(t, tFill + i * 0.07, 3.6, 0.42), blink = cmp && !same && t > tE ? 0.5 + 0.5 * Math.sin(t * 6 + i) : 0;
        h += `<g transform="translate(${X0 + i * CW} 0) scale(${f1(kc * (on ? gfBeat(t, tOn, 0.16, 5, 9) : 1) * 1000) / 1000})"><rect x="-44" y="-44" width="88" height="88" rx="18" fill="${on ? '#C9F2D8' : (blink ? gfMix('#ffffff', '#FFE0E0', blink) : '#fff')}" stroke="${on ? '#22B893' : INK}" stroke-width="${on ? 9 : 6}"/>${km > 0 ? `<g transform="scale(${f1(km * 1000) / 1000})">${mark(ans[i], on ? '#178A6E' : '#8E9BB8')}</g>` : ''}</g>` + (on ? gfRing(t, tOn, X0 + i * CW, 0, 30, 80, '#3DDBB4', 8, 0.3) : ''); }
      return h + `</g>`; };
    g += `<g transform="translate(960 176) scale(${f1(gfIn(t, r41.t0 - 0.05, 3.2, 0.42) * 1000) / 1000})">${gfChip('같은 설문', { size: 40, icon: 'scroll', bg: '#FFF6D8' })}</g>`;
    g += `<rect x="250" y="250" width="1420" height="540" rx="36" fill="#fff" opacity=".55"/>`;
    g += row(0, '처음의 나', '#fff', ML_ANS, tA0, tA0 + 0.25, false) + row(1, 'AI가 푼 나', '#E3EAFF', ML_AI, tA1, tA1 + 0.3, true, tL1, tE1);
    if (t > tE1) g += `<g transform="translate(1700 ${RY[1]}) scale(${f1(gfIn(t, tE1 + 0.1, 3.2, 0.4) * 1000) / 1000})">${gfChip('일곱 개쯤', { size: 34, bg: '#C9F2D8' })}</g>`;
    if (id === 'r42') { g += row(2, '2주 뒤의 나', '#FFF1C8', ML_ME2, tB0, tB1, true, tL2, tE2);
      if (t > tE2) g += `<g transform="translate(1700 ${RY[2]}) scale(${f1(gfIn(t, tE2 + 0.1, 3.2, 0.4) * 1000) / 1000})">${gfChip('여덟 개', { size: 34, bg: '#C9F2D8' })}</g>`;
      g += gfEmote(t, tMd, X0 + 4 * CW, RY[2] - 76, 'heart', { hold: 1.6, s: 0.8 }) + gfEmote(t, tMs, X0 + 8 * CW, RY[2] - 76, 'sweat', { hold: 1.6, s: 0.8 }); }
  }
  s += wrap(g);
  // 42번 끝: 첫 장면의 답(신중함 · 내향적 · 무대에는 약한 편)이 다시 뜨고, 이번에는 '원래' 대신 시각 꼬리표가 붙는다
  const tCd = r42.t1 + 0.25, tSl = tCd + 0.62;
  if (t > tCd) { const kc = gfIn(t, tCd, 3, 0.5), sl = gfxSlap(t, tSl, { fly: 0.2, s0: 2.4, r0: -16 }), sk = gfShake(t, tSl, 9, 0.28), items = [['신중함', '#DDF7EE', 'check'], ['내향적', '#E3EAFF', 'moon'], ['무대에는 약한 편', '#FFE6EE', 'rain']];
    s += `<rect x="-60" y="-60" width="2040" height="1200" fill="#1E2A4A" opacity="${f1(0.5 * Math.min(1, kc) * 100) / 100}"/><g transform="translate(${f1(960 + sk[0])} ${f1(500 + sk[1] + (1 - Math.min(1, kc)) * 500)})"><rect x="-300" y="-250" width="600" height="486" rx="44" fill="#fff" stroke="${INK}" stroke-width="9"/><circle cx="-232" cy="-186" r="34" fill="#6C8CFF" stroke="${INK}" stroke-width="6"/><g transform="translate(-232 -186) scale(.66)">${gfStar4(26, '#fff', 0)}</g>${gfT(-182, -170, 'AI가 정리해 준 나', 40, '#1E2A4A', { anchor: 'start' })}` +
      items.map(([tx, bg, ic], i) => `<g transform="translate(${f1(-262 + (gfTextW(tx, 40) + 110) / 2)} ${-74 + i * 104})">${gfChip(tx, { size: 40, bg, icon: ic })}</g>`).join('') +
      (sl.op > 0 ? `<g opacity="${sl.op}" transform="translate(120 -268) rotate(${f1(-6 + sl.rot)}) scale(${f1(sl.s * 1000) / 1000})">${gfxSticker('일요일 밤 11:00 기준', { fs: 38, band: '#6C8CFF' })}</g>` : '') + `</g>` + gfxImpact(t, tSl, 1080, 232, { col: '#6C8CFF', r: 230, n: 12, flash: false }) + gfStarBurst(t, tSl, 1080, 232, { n: 7, r0: 80, r1: 320, size: 20 }); }
  s += gfChipAt(t, r40.t0 + 0.1, 232, 96, '2,100년 뒤', { size: 34, icon: 'clock' }) + `<g transform="translate(1610 96) scale(${f1(gfIn(t, tIv, 3, 0.45) * (t > tCd ? 0 : 1) * 1000) / 1000})">${gfChip('Park 외 · arXiv 2411.10109 (프리프린트)', { size: 24, bg: '#F3F5FA' })}</g>`;
  return gfxScreen(gfDefs() + ML_DEFS + ML_DEFS3 + s + gfxVignette(0.22, '#3A4A7A'));
}
