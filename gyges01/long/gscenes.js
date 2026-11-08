/* 기게스의 반지 편 「아무도 나를 볼 수 없다면」 — 샘플(o1~n4).
   test_q3 방식: 사람 없는 AI 배경 판 + 자체 카메라 + 단어 타이밍 + 입 모양. 시뮬레이션 편의 도구(sscenes·xscenes·yscenes_r2)를 그대로 쓴다.
   이름 규칙: 이 편의 함수·상수는 모두 g 접두사. 투명해진 제로는 시청자에게만 '푸른 반투명'으로 보인다(다른 인물은 못 본다). */
Object.assign(QBG, { meet: 'ai/meet.png', office: 'ai/office.png', alley: 'ai/alley.png', subway: 'ai/subway.png' });
['gmeet', 'galley', 'gtitle', 'gtest', 'gnight'].forEach(k => CAMS[k] = 'fixed');
const GFY = 1150;   // feet on the floor (standing)

/* ---------- characters ---------- */
const gBoss = (t, o) => HALO(char(Object.assign({ goggles: 'none', vest: '#4E5A70', patch: false, tee: true, collar: true, tie: '#B3413A', stache: '#6E6E74', vshade: 'rgba(20,30,60,0.22)', seed: 91, t,
  hairFront: `<path d="M86 166 Q82 112 116 96 Q126 126 112 172 Z M314 166 Q318 112 284 96 Q274 126 288 172 Z" fill="#A4A8B0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` }, o)));
const gKo = (t, o) => HALO(char(Object.assign({ goggles: 'none', vest: '#F2F4F8', patch: false, tee: true, collar: true, tie: '#3E6FB0', hair: '#1E1B1A', vshade: 'rgba(60,80,120,0.18)', seed: 93, t }, o)));
const gHaneul = (t, o) => zGirl(Object.assign({ hairStyle: 'bob', hairArgs: [GH.black], top: '#E9DCC2', vshade: 'rgba(90,70,30,0.16)', dress: '#7F8FA8', seed: 95, t }, o));
const gMan = (t, o) => HALO(char(Object.assign({ goggles: 'none', vest: '#7C8C5C', patch: false, tee: true, hair: '#4A4038', vshade: 'rgba(40,50,20,0.2)', seed: 97, t }, o)));
const gDefs = () => `<defs><filter id="gghost" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feColorMatrix in="SourceGraphic" type="matrix" values="0.45 0.1 0.1 0 0.28  0.1 0.5 0.1 0 0.36  0.1 0.1 0.55 0 0.48  0 0 0 1 0" result="c"/><feMorphology in="SourceAlpha" operator="dilate" radius="5" result="d"/><feFlood flood-color="#7FC0FF" result="f"/><feComposite in="f" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="c"/></feMerge></filter>` +
  `<filter id="ggray" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/></filter>` +
  `<filter id="gblack" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0.09  0 0 0 0 0.06  0 0 0 0 0.05  0 0 0 1 0"/></filter>` +
  `<filter id="gnite" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.84 0.02 0 0 0.015  0.01 0.8 0.02 0 0.02  0 0.03 0.86 0 0.05  0 0 0 1 0"/></filter>` +
  `<linearGradient id="gwetfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
const gNite = svg => `<g filter="url(#gnite)">${svg}</g>`;   // characters take the night light (no daylight-white stickers on a night plate)
const gWet = (svg, fy, op = 0.16) => `<g opacity="${op}" transform="translate(0 ${f1(2 * fy + 8)}) scale(1 -1)" filter="url(#qblur)">${svg}</g>`;   // a blurred upside-down copy on wet asphalt
// invisible: only the viewer sees a faint blue shimmer
const gGhost = (svg, t, k = 1) => k <= 0 ? svg : k >= 1 ? `<g opacity=".4" filter="url(#gghost)" transform="translate(${f1(Math.sin(t * 7) * 2)} 0)">${svg}</g>` :
  `<g opacity="${f1((1 - 0.66 * k) * 100) / 100}" filter="url(#gghost)">${svg}</g>`;
const gUmb = (hx, hy, s = 1, rot = 0, col = '#3E4A6B', rib = '#2A3350') => {   // a plain umbrella, handle at (hx,hy)
  let sc = ''; for (let i = 0; i < 6; i++) { const x0 = 220 - i * 73.3; sc += ` Q${f1(x0 - 36.6)} -30 ${f1(x0 - 73.3)} 0`; }
  return `<g transform="translate(${f1(hx)} ${f1(hy)}) rotate(${f1(rot)}) scale(${s})"><path d="M0 0 L0 -200" stroke="${INK}" stroke-width="9"/><path d="M0 0 q0 22 -18 22" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/>` +
    `<g transform="translate(0 -200)"><path d="M-220 0 Q-210 -150 0 -160 Q210 -150 220 0${sc} Z" fill="${col}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>` +
    `<path d="M-146 0 Q-120 -120 0 -160 M146 0 Q120 -120 0 -160 M-73 0 Q-50 -130 0 -160 M73 0 Q50 -130 0 -160" stroke="${rib}" stroke-width="5" fill="none"/><circle cx="0" cy="-166" r="10" fill="${INK}"/></g></g>`;
};
const gRing = (x, y, s = 1, stone = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><circle r="11" fill="none" stroke="#E0B23A" stroke-width="6"/><circle r="11" fill="none" stroke="${INK}" stroke-width="2" opacity=".6"/>${stone ? `<circle cx="0" cy="-12" r="6" fill="#D8433C" stroke="${INK}" stroke-width="2"/>` : ''}</g>`;
const gSpark = (x, y, k, s = 1) => k <= 0 ? '' : `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * (0.5 + 0.5 * Math.sin(k * Math.PI)) * 100) / 100}) rotate(${f1(k * 90)})"><path d="M0 -26 L6 -6 L26 0 L6 6 L0 26 L-6 6 L-26 0 L-6 -6 Z" fill="#FFF6C8" stroke="#E0B23A" stroke-width="3" opacity="${f1(Math.sin(k * Math.PI) * 100) / 100}"/></g>`;
const gSym = (x, y, txt, k, col = '#FFD23F', size = 64) => k <= 0 ? '' : `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(easeOutBack(clamp(k, 0, 1)) * 100) / 100})">${outlined(0, 0, [[[txt, col]]], { size, sw: 12, lh: size })}</g>`;
P['g박수A'] = smPose('서기', { armL: [[148, 285], [150, 332], [192, 316]], hL: [196, 314], armR: [[252, 285], [250, 332], [208, 316]], hR: [204, 314] });
P['g박수B'] = smPose('서기', { armL: [[148, 285], [118, 330], [150, 300]], hL: [146, 296], armR: [[252, 285], [282, 330], [250, 300]], hR: [254, 296] });
P['g손반'] = smPose('서기', { armR: [[252, 285], [300, 268], [312, 214]], hR: [314, 206] });                    // the hand, half up
P['g가리킴'] = smPose('서기', { armL: [[148, 285], [96, 266], [46, 246]], hL: [38, 242] });                       // presenting to the left
P['g인사'] = smPose('서기', { armL: [[148, 285], [146, 340], [176, 380]], hL: [180, 384], armR: [[252, 285], [254, 340], [224, 380]], hR: [220, 384] });
P['g우산'] = smPose('서기', { armR: [[252, 285], [318, 278], [348, 236]], hR: [352, 228] });   // umbrella hand held out beside the head (the shaft no longer crosses the face)
P['g비닐'] = smPose('서기', { armR: P['g우산'].armR, hR: P['g우산'].hR, armL: [[148, 285], [40, 330], [-70, 370]], hL: [-78, 374] });   // reaching down-left to the saddle
P['g반지서기'] = smPose('서기', { armR: [[252, 285], [318, 250], [322, 180]], hR: [324, 172] });   // standing, ring raised (vase figures)
P['g메모'] = smPose('서기', { armR: [[252, 285], [262, 338], [236, 360]], hR: [232, 364] });
P['g포크'] = smPose('서기', { armR: [[252, 285], [292, 330], [266, 300]], hR: [262, 296] });
P['g반지들기'] = smPose('sm랩톱', { armR: [[252, 285], [326, 318], [328, 244]], hR: [330, 236] });
P['g폰'] = smPose('서기', { armL: [[148, 285], [146, 336], [184, 322]], hL: [188, 318], armR: [[252, 285], [254, 336], [216, 322]], hR: [212, 318] });
const gRain = (t, op = 0.35, n = 80) => {   // falling rain streaks (screen space)
  let h = '';
  for (let i = 0; i < n; i++) { const x = hash(i * 3.7) * 2300 - 200, sp = 1500 + hash(i * 1.3) * 700, y = ((hash(i * 7.9) * 1500 + t * sp) % 1500) - 250; h += `<path d="M${f1(x)} ${f1(y)} l-14 52" stroke="#CFE2FF" stroke-width="3" opacity="${f1(op * (0.5 + 0.5 * hash(i)) * 100) / 100}" stroke-linecap="round"/>`; }
  return h;
};

/* ================= o1~o4: the meeting room ================= */
// the projected slide sits on the plate's screen (perspective quad); a flat copy for the close-up
const GSCR = [[-165, -61], [339, 123], [327, 609], [-172, 775]];
const gSlideFlat = (k = 1) => `<g><rect x="0" y="0" width="1000" height="600" rx="10" fill="#F7FAFF"/><text x="60" y="110" font-family="${FONT}" font-weight="900" font-size="74" fill="#1A3E8C">동네 분식 지도</text>` +
  `<rect x="60" y="150" width="560" height="330" rx="16" fill="#DDEBD5" stroke="#9DB592" stroke-width="5"/><path d="M60 300 Q300 260 620 330 M300 150 Q330 300 280 480" stroke="#FFFFFF" stroke-width="22" fill="none"/>` +
  [[180, 240], [420, 220], [360, 390], [520, 300]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><path d="M0 0 C-22 -30 -22 -54 0 -54 C22 -54 22 -30 0 0 Z" fill="${['#E5484D', '#F2A65A', '#E5484D', '#3E6FB0'][i]}" stroke="${INK}" stroke-width="4"/><circle cy="-38" r="8" fill="#fff"/></g>`).join('') +
  [0, 1, 2].map(i => `<rect x="660" y="${180 + i * 70}" width="${280 - i * 40}" height="26" rx="13" fill="#C9D4E6"/>`).join('') +
  `<text x="960" y="560" text-anchor="end" font-family="${FONT}" font-weight="900" font-size="${f1(30 + 10 * k)}" fill="${k > 0.5 ? '#B3413A' : '#5A6474'}">기획: 고 과장</text></g>`;
const gSlideQuad = () => {   // a rough projected image on the plate's screen (clip to the quad)
  const q = GSCR, id = 'gsq' + (smClipN++);
  // the flat slide mapped onto the screen with an affine fit of its four corners (clipped to the quad)
  return `<defs><clipPath id="${id}"><path d="M${q.map(p => p.join(' ')).join(' L')} Z"/></clipPath></defs><g clip-path="url(#${id})"><path d="M${q.map(p => p.join(' ')).join(' L')} Z" fill="#F7FAFF" opacity=".92"/>` +
    `<g transform="matrix(0.504 0.184 -0.0095 0.92 -165 -61)" opacity=".9">${gSlideFlat(0)}</g></g>`;
};
const gChairB = (x, y, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-150" y="-330" width="300" height="200" rx="40" fill="#3A4252" stroke="${INK}" stroke-width="8"/><rect x="-124" y="-308" width="248" height="30" rx="15" fill="#4C566B"/></g>`;
const GTX0 = 800, GTX1 = 2260, GTY = 1024, GSY = GFY + 70;   // the long table (top line at seated-elbow height) · seated anchor: ~a chair seat lower than standing
const gTable = () => {
  let h = `<ellipse cx="${(GTX0 + GTX1) / 2}" cy="${GFY + 70}" rx="${(GTX1 - GTX0) / 2 + 60}" ry="26" fill="#2A2E38" opacity=".28"/>`;
  h += `<rect x="${GTX0 + 30}" y="${GTY + 24}" width="${GTX1 - GTX0 - 60}" height="${GFY + 60 - GTY - 24}" fill="#C9C2B4" stroke="${INK}" stroke-width="7"/>`;
  h += `<path d="M${GTX0 + 24} ${GTY - 22} L${GTX1 - 24} ${GTY - 22} L${GTX1} ${GTY + 2} L${GTX0} ${GTY + 2} Z" fill="#ECE6DA" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  h += `<rect x="${GTX0}" y="${GTY}" width="${GTX1 - GTX0}" height="26" rx="5" fill="#D8D0C0" stroke="${INK}" stroke-width="7"/>`;
  return h;
};
const GBX = 1180, GHX = 1560, GZX = 1880, GKX = 520;   // 팀장 · 하늘 · 제로 (seated), 고 과장 (standing by the screen)
const gNote = (x) => `<g transform="translate(${x} ${GTY - 14}) rotate(-4)"><rect x="-58" y="-12" width="116" height="20" rx="3" fill="#F7F3E8" stroke="${INK}" stroke-width="4"/></g>`;
function gMeetSet(t, o = {}) {   // seated people behind the table (+ 고 과장 standing). o.boss/o.han/o.zero/o.ko = options
  const seat = (x, fn, oo) => gChairB(x, GSY) + fn(t, Object.assign({ x, y: GSY, s: 1.0, pose: '서기', look: [-0.85, 0.05] }, oo));
  let h = '';
  if (o.ko !== false) h += qShadow(o.ko && o.ko.x || GKX, GFY, 70) + gKo(t, Object.assign({ x: GKX, y: GFY, s: 1.0, pose: 'g가리킴', look: [0.8, 0] }, o.ko || {}));
  h += seat(GBX, gBoss, o.boss || {}) + seat(GHX, gHaneul, Object.assign({ look: [-0.3, 0.7], pose: smPose('g메모', { hR: [232 + 6 * Math.sin(t * 13), 364] }) }, o.han || {}));
  const hp = ptOf(GHX, GSY, 1.0, 232, 364); h += `<path d="M${f1(hp[0] + 6 * Math.sin(t * 13))} ${f1(hp[1] - 4)} l18 -46" stroke="#3E6FB0" stroke-width="7" stroke-linecap="round"/>`;
  const zs = gChairB(GZX, GSY) + xZero(t, Object.assign({ x: GZX, y: GSY, s: 1.0, pose: '서기', look: [-0.85, 0.05] }, o.zero || {}));
  h += o.zeroGray ? `<g filter="url(#ggray)" opacity="${f1((1 - 0.35 * o.zeroGray) * 100) / 100}">${zs}</g>` : zs;
  h += gTable() + gNote(GHX) + gNote(GZX);
  if (o.proj !== false) h += `<g><path d="M1000 ${GTY - 50} L339 123 L327 609 Z" fill="#FFFBE0" opacity=".09"/><rect x="930" y="${GTY - 74}" width="130" height="60" rx="10" fill="#3A4252" stroke="${INK}" stroke-width="6"/><circle cx="948" cy="${GTY - 44}" r="16" fill="#FFF6C8" stroke="${INK}" stroke-width="5"/></g>`;   // the projector on the table and its faint beam
  return h;
}
const gMeet = (t, cam, ch, o = {}) => smDefs() + gDefs() + smPlate('meet', cam, 0.55, Object.assign({ extra: o.slide !== false ? gSlideQuad() : '' }, o.blur ? { blur: true } : {})) + qCam(cam, ch) + warm(0.12);   // the slide rides on the plate (same parallax)
function gmeetScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 2;
  if (id === 'o1') {
    if (lt < 0.95) {   // CU: the slide — and the credit line at the bottom
      const k = clamp((lt - 0.35) / 0.3, 0, 1), z = lerp(1.0, 1.08, lt / 0.95);
      return smDefs() + smFull('#1E2430') + `<g transform="translate(960 520) scale(${f1(z * 1000) / 1000}) translate(-500 -300)">${gSlideFlat(k)}</g>` + `<rect x="${f1(960 + (560 - 500) * z - 20)}" y="${f1(520 + (520 - 300) * z)}" width="${f1(440 * z)}" height="${f1(60 * z * k)}" fill="none" stroke="#B3413A" stroke-width="6" rx="10" opacity="${k}"/>`;
    }
    const k = lt - 0.95, cam = qLerpCam(k / (D - 0.95), [290, 620, 1.48], [310, 614, 1.56]), bow = clamp((k - (D - 0.95) + 0.7) / 0.35, 0, 1);
    const ko = { pose: bow > 0 ? mixPose('g가리킴', 'g인사', bow) : 'g가리킴', rot: 8 * Math.sin(bow * Math.PI), ex: xTalk(a, 'G', 'z히죽', t), look: [0.6, 0] };
    return gMeet(t, cam, gMeetSet(t, { ko, boss: { ex: xEx('z기본') }, zero: { ex: xEx('z기본') } }));
  }
  if (id === 'o2') {   // MCU 팀장: big laugh and clapping
    const cam = qLerpCam(lt / D, [GBX + 40, 870, 2.0], [GBX + 40, 866, 2.08]), cl = Math.abs(Math.sin(t * 9));
    return gMeet(t, cam, gMeetSet(t, { boss: { pose: mixPose('g박수A', 'g박수B', cl), ex: xTalk(a, 'T', 'z빵긋', t), look: [-0.8, -0.05] } }), { blur: true });
  }
  if (id === 'o3') {   // MS: Zero's hand rises halfway… nobody turns… it comes down. 하늘 keeps her eyes on her notes.
    const cam = qLerpCam(lt / D, [GZX - 180, 890, 1.75], [GZX - 170, 888, 1.82]);
    const up = easeOut(clamp(lt / 0.45, 0, 1)) * (1 - easeInOut(clamp((lt - 1.4) / 0.7, 0, 1))), cl = Math.abs(Math.sin(t * 9));
    const zero = { pose: mixPose('서기', 'g손반', up), ex: exprAt([[0, 'z기본'], [1.2, 'z민망']], lt), look: up > 0.5 ? [-0.9, -0.1] : [-0.3, 0.6] };
    return gMeet(t, cam, gMeetSet(t, { zero, han: { look: [-0.2, 0.75], ex: xEx('z기본') }, boss: { pose: mixPose('g박수A', 'g박수B', cl), ex: xEx('z빵긋') } }), { blur: true });
  }
  // o4 wide: the room; at '보이지' Zero drains to grey; slow push to the corner
  const tG = smAt(a, '보이지', 0.6 * D), g = easeInOut(clamp((lt - tG + 0.2) / 0.6, 0, 1)), cam = qLerpCam(clamp((lt - 1.0) / (D - 1.0), 0, 1), [1040, 660, 1.0], [1580, 830, 1.3]);
  const ko = { pose: 'g인사', ex: xEx('z히죽'), look: [0.6, 0], rot: 3 };
  return gMeet(t, cam, gMeetSet(t, { ko, boss: { pose: 'g박수B', ex: xEx('z빵긋'), look: [-0.85, 0] }, zero: { ex: xEx('z민망'), look: [-0.3, 0.6] }, zeroGray: g }));
}

/* ================= a1~a4: the rainy alley · the ring ================= */
const GAX = 860;   // Zero in the alley, beside the store window (the bike to his left, the far end of the alley behind)
const gBike = (x, y, s = 1, bag = 0) => {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><circle cx="-110" cy="-70" r="70" fill="none" stroke="${INK}" stroke-width="9"/><circle cx="110" cy="-70" r="70" fill="none" stroke="${INK}" stroke-width="9"/>` +
    `<path d="M-110 -70 L-30 -70 L30 -170 L-60 -170 Z M30 -170 L110 -70 M-30 -70 L-70 -190" stroke="#3E8E9E" stroke-width="12" fill="none" stroke-linejoin="round"/><path d="M30 -170 L40 -210 L80 -214" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/>` +
    `<path d="M-110 -200 Q-70 -214 -36 -200" stroke="${INK}" stroke-width="20" stroke-linecap="round" fill="none"/>`;
  if (bag > 0) { const yb = -212; h += `<path d="M-128 ${yb + 50} Q-124 ${yb} -74 ${yb - 6} Q-26 ${yb} -22 ${yb + 50} Q-74 ${yb + 64} -128 ${yb + 50} Z" fill="#F4F8FF" fill-opacity=".85" stroke="${INK}" stroke-width="5"/><path d="M-96 ${yb + 6} q-10 -24 4 -30 M-52 ${yb + 6} q10 -24 -4 -30" stroke="${INK}" stroke-width="4" fill="none"/>`; }
  return `<ellipse cx="${f1(x)}" cy="${f1(y + 2)}" rx="${f1(200 * s)}" ry="${f1(16 * s)}" fill="#05060C" opacity=".3"/>` + h + `</g>`;
};
const gBagHand = (x, y) => `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M-26 6 Q-30 50 0 58 Q30 50 26 6 Z" fill="#F4F8FF" fill-opacity=".85" stroke="${INK}" stroke-width="5"/><path d="M-14 6 q-4 -16 6 -18 M14 6 q4 -16 -6 -18" stroke="${INK}" stroke-width="4" fill="none"/></g>`;   // the bag hanging from his hand
const gNoop = () => {
};
const GSIGN = `<rect x="300" y="52" width="150" height="166" fill="#E7E1D6"/><rect x="300" y="52" width="150" height="166" fill="none" stroke="#3A3430" stroke-width="4" opacity=".5"/>`;   // covers the brand-like '7' on the plate's sign
const gAlley = (t, cam, ch, o = {}) => smDefs() + gDefs() + smPlate('alley', cam, 0.5, Object.assign({ extra: GSIGN }, o.blur ? { blur: true } : {})) + gRain(t, o.rain == null ? 0.3 : o.rain) + qCam(cam, gNite(ch)) + gRain(t + 3.3, 0.08, 18) + smFull('#0B1230', 0.1);   // rain mostly behind the people (none falling under the umbrella)
// the store window close-up: the glass, the bright shelves behind it, and Zero's reflection (vis 1 → 0 gone; the umbrella stays)
function gWindow(t, vis, o = {}) {
  const wid = 'gwin' + (smClipN++);
  let h = smDefs() + gDefs() + `<defs><clipPath id="${wid}"><rect x="120" y="40" width="1680" height="980"/></clipPath></defs>` + smFull('#0E1424') + `<rect x="120" y="40" width="1680" height="980" rx="10" fill="#C59A62" stroke="#1A1E28" stroke-width="22"/><rect x="120" y="40" width="1680" height="980" fill="#FFE7B8" opacity=".35"/>`;
  for (let r = 0; r < 3; r++) { h += `<rect x="180" y="${150 + r * 260}" width="1560" height="20" fill="#C9D6E8" opacity=".5"/>`; for (let i = 0; i < 12; i++) h += `<rect x="${200 + i * 128}" y="${80 + r * 260}" width="${70 + (i * 13) % 40}" height="${50 + (i * 7) % 30}" rx="8" fill="${['#F2A65A', '#8CCB9B', '#F7A8C0', '#9FD8FF', '#FFD27A'][(i + r) % 5]}" opacity=".45"/>`; }
  h += smFull('#2A3A5C', 0.22);   // night outside: the glass is a dark mirror over the warm shelves
  h += `<g clip-path="url(#${wid})" opacity=".3"><g transform="translate(1920 0) scale(-1 1)">${smPlate('alley', [700, 560, 1.15], 0.5, { blur: true, extra: GSIGN })}</g></g>`;   // the street behind him, mirrored in the glass
  const zx = 960 + (o.dx || 0), zy = 1230 + (o.dy || 0), s = 1.55, hp = ptOf(zx, zy, s, P['g우산'].hR[0], P['g우산'].hR[1]);
  let refl = '';
  if (vis > 0) refl += `<g opacity="${f1(vis * 100) / 100}">` + xZero(t, { x: zx, y: zy, s, pose: 'g우산', ex: o.ex || xEx('z기본'), look: [0, 0.2], tilt: o.tilt || 0, sy: o.sy || 1 }) + `</g>`;
  refl += gUmb(hp[0], hp[1] + (o.umbDy || 0), 1.45, Math.sin(t * 2) * 2 + (o.umbRot || 0));
  h += `<rect x="120" y="40" width="1680" height="980" fill="#1A2440" opacity=".42"/><g clip-path="url(#${wid})" opacity=".7">${refl}</g>` + [520, 960, 1400].map(x => `<rect x="${x - 10}" y="40" width="20" height="980" fill="#2A2E38" stroke="${INK}" stroke-width="4"/>`).join('');
  if (vis > 0 && vis < 1) h += smGlitch(t, 0.35 * Math.sin(vis * Math.PI), 13);
  for (let i = 0; i < 26; i++) { const x = 160 + hash(i * 2.3) * 1600, y = ((hash(i * 5.1) * 1000 + t * (90 + 60 * hash(i))) % 1000) + 40; h += `<path d="M${f1(x)} ${f1(y)} q-6 14 0 20 q6 -6 0 -20" fill="#DDEBFF" opacity=".5"/>`; }
  return h + `<path d="M120 40 L620 40 L240 1020 L120 1020 Z" fill="#fff" opacity=".05"/>` + gRain(t, 0.18, 40);
}
// close-up of the hand: a fist with the index finger up, the ring on it; ang 0 = stone facing us, π = turned inward (hidden)
function gRingCU(t, ang, o = {}) {
  const fx = 880, fy = o.fy || 0, s = Math.sin(ang), c = Math.cos(ang), ry = 430 + fy, sx = fx + 62 * s;
  let h = smDefs() + gDefs() + (o.bg || (smFull('#141C2E') + `<ellipse cx="960" cy="1100" rx="900" ry="380" fill="#22324E" opacity=".8"/>`));
  h += `<path d="M740 1400 L800 ${800 + fy} L1180 ${800 + fy} L1300 1400 Z" fill="${SM_ORANGE}" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/><path d="M796 ${846 + fy} L1186 ${846 + fy}" stroke="#C9661F" stroke-width="10"/>`;   // the sleeve runs on out of the frame (an arm, not a box)
  const stone = `<g transform="translate(${f1(sx)} ${f1(ry - 4)}) scale(${f1(Math.max(0.2, Math.abs(c)) * 100) / 100} 1)"><path d="M0 -36 L28 -8 L0 24 L-28 -8 Z" fill="#D8433C" stroke="${INK}" stroke-width="6"/><path d="M-9 -16 L4 -25" stroke="#fff" stroke-width="5" opacity=".7"/></g>`;
  if (c < 0) h += stone;
  h += `<path d="M${fx - 64} ${ry} A64 22 0 0 0 ${fx + 64} ${ry}" stroke="#B8902A" stroke-width="24" fill="none"/>`;
  h += `<rect x="${fx - 58}" y="${230 + fy}" width="116" height="380" rx="58" fill="#fff" stroke="${INK}" stroke-width="12"/>`;   // index finger
  h += `<rect x="${fx - 70}" y="${520 + fy}" width="400" height="320" rx="120" fill="#fff" stroke="${INK}" stroke-width="12"/>`;   // fist
  h += `<rect x="${fx - 46}" y="${510 + fy}" width="92" height="60" fill="#fff"/>`;
  for (let i = 0; i < 3; i++) h += `<path d="M${fx + 70 + i * 82} ${560 + fy} q36 -26 72 0" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/>`;   // curled fingers
  h += `<path d="M${fx - 64} ${ry} A64 22 0 0 1 ${fx + 64} ${ry}" stroke="#E0B23A" stroke-width="24" fill="none"/><path d="M${fx - 64} ${ry} A64 22 0 0 1 ${fx + 64} ${ry}" stroke="${INK}" stroke-width="4" fill="none" opacity=".5"/>`;
  if (c >= 0) h += stone;
  const th = o.thumb == null ? 0 : o.thumb, tx = lerp(fx + 150, fx + 110, th), ty = lerp(690 + fy, ry + 90, th);
  h += `<rect x="${f1(tx - 40)}" y="${f1(ty - 44)}" width="190" height="88" rx="44" fill="#fff" stroke="${INK}" stroke-width="12" transform="rotate(${f1(-150 + 25 * th)} ${f1(tx)} ${f1(ty)})"/><path d="M${f1(tx + 6)} ${f1(ty - 26)} q-20 26 0 52" stroke="${INK}" stroke-width="6" fill="none" opacity=".35" transform="rotate(${f1(-150 + 25 * th)} ${f1(tx)} ${f1(ty)})"/>`;   // thumb, lying across the fist, its tip reaching for the ring
  return h;
}
function galleyScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 2;
  if (id === 'a1') {   // wide: he covers a stranger's bicycle saddle with a plastic bag — and across the street a yellow umbrella stops
    const cam = qLerpCam(lt / D, [880, 660, 1.08], [870, 650, 1.12]), lean = Math.sin(clamp((lt - 0.5) / 1.6, 0, 1) * Math.PI), placed = lt > 1.28;
    const zp = mixPose('g우산', 'g비닐', lean), zero = { x: GAX, y: GFY, s: 1.0, pose: zp, ex: xEx('z기본'), look: [-0.8, 0.5], rot: -8 * lean };
    const hp = ptOf(GAX, GFY, 1.0, P['g우산'].hR[0], P['g우산'].hR[1]), lh = ptOf(GAX, GFY, 1.0, zp.hL[0], zp.hL[1]);
    const zs = xZero(t, zero) + (placed ? '' : gBagHand(lh[0] - 8 * lean, lh[1] + 4)) + gUmb(hp[0], hp[1], 0.95, -4 - 8 * lean);
    let ch = gBike(GAX - 250, GFY + 10, 1.0, placed ? 1 : 0) + gWet(zs, GFY) + qShadow(GAX, GFY, 70) + zs;
    const sx = 1200, sy = 838, ss = 0.32;   // far away at the end of the alley, feet on the ground: Sora under a yellow umbrella — walks, stops, watches
    const walk = lt < 1.0 ? lt : 1.0, sxx = sx + 60 * (1 - walk), sp = ptOf(sxx, sy, ss, 302, 196);
    ch = qShadow(sxx, sy, 70 * ss, 0.6) + flip(sxx, xSora(t, { x: sxx, y: sy, s: ss, pose: Object.assign({}, lt < 1.0 ? walkPose(lt * 9, 0.4) : P['서기'], { armR: P['y우산'].armR, hR: P['y우산'].hR }), ex: xEx('z빵긋'), look: [-0.9, 0] })) + yUmbrella(2 * sxx - sp[0], sp[1], 0.95 * ss, 0) + ch;
    return gAlley(t, cam, ch);
  }
  if (id === 'a2') {
    if (lt < 0.9) {   // the puddle: something glints
      const k = lt / 0.9;
      const px = GAX - 120, py = 1130;
      let pud = `<path d="M${px - 240} ${py} C${px - 230} ${py - 40} ${px - 120} ${py - 52} ${px - 20} ${py - 44} C${px + 90} ${py - 56} ${px + 236} ${py - 36} ${px + 222} ${py + 4} C${px + 210} ${py + 44} ${px + 60} ${py + 50} ${px - 40} ${py + 42} C${px - 150} ${py + 50} ${px - 250} ${py + 36} ${px - 240} ${py} Z" fill="#16203A" opacity=".72"/>`;
      pud += `<path d="M${px - 60} ${py - 30} L${px + 40} ${py - 30} L${px + 20} ${py + 30} L${px - 50} ${py + 30} Z" fill="#FFD98A" opacity=".22"/>`;   // the street lamp, reflected
      for (let i = 0; i < 4; i++) { const k2 = ((t * 1.3 + i * 0.27) % 1), rx = px - 160 + hash(i * 3.1 + Math.floor(t * 1.3 + i * 0.27)) * 320; pud += `<ellipse cx="${f1(rx)}" cy="${py + 10 - 20 * hash(i)}" rx="${f1(8 + 40 * k2)}" ry="${f1(2 + 9 * k2)}" fill="none" stroke="#C9DCF5" stroke-width="3" opacity="${f1((1 - k2) * 0.7 * 100) / 100}"/>`; }   // raindrop rings
      return gAlley(t, [px, 1080, 2.6], pud + gRing(px + 30, py - 2, 1.1) + gSpark(px + 42, py - 18, (k * 2) % 1, 1.5), { rain: 0.22 });
    }
    if (lt < 2.2) {   // the hand: ring on the finger — the thumb turns the stone inward
      const k = lt - 0.9, ang = easeInOut(clamp((k - 0.5) / 0.6, 0, 1)) * Math.PI;
      const bg = smPlate('alley', [GAX - 200, 600, 1.6], 0.5, { blur: true, extra: GSIGN }) + smFull('#0B1230', 0.45);
      return gRingCU(t, ang, { bg, thumb: clamp((k - 0.4) / 0.3, 0, 1) - clamp((k - 1.1) / 0.2, 0, 1), fy: 30 * (1 - easeOut(clamp(k / 0.35, 0, 1))) }) + gRain(t, 0.15, 30);
    }
    const k = lt - 2.2, vis = 1 - easeIn(clamp((k - 0.15) / 0.35, 0, 1));   // the store window: his reflection fades — the umbrella stays
    return gWindow(t, vis, { ex: exprAt([[0, 'z기본'], [0.4, 'z멍']], k), umbDy: vis < 0.5 ? -6 * Math.sin(k * 12) * (1 - vis) : 0 });
  }
  if (id === 'a3') {   // MS: invisible — the umbrella jumps in the air (깜짝 7단계), "…나, 어디 갔어?"
    const cam = qLerpCam(lt / D, [GAX + 60, 760, 1.55], [GAX + 60, 754, 1.62]), J = xJump(lt, 0.05, 0.7);
    const pose = J.ph >= 2 && J.ph <= 4 ? '만세' : J.ph <= 1 ? '웅크림' : 'g우산';
    const zero = xZero(t, { x: GAX, y: GFY + J.dy, s: 1.0, sx: J.sx, sy: J.sy, pose, ex: xTalk(a, 'Z', 'z충격', t), look: [0, 0.4] });
    const hp = ptOf(GAX, GFY + J.dy, 1.0, P['g우산'].hR[0], P['g우산'].hR[1]), umb = gUmb(hp[0], hp[1] - (pose === '만세' ? 60 : 0), 0.95, Math.sin(lt * 14) * 10 * Math.exp(-lt * 2));
    let ch = gGhost(zero, t) + umb + gSym(GAX + 230, GFY - 560, '!', clamp((lt - 0.2) / 0.2, 0, 1), '#FFD23F', 90);
    return gAlley(t, cam, ch, { blur: true });
  }
  // a4: the window — out: there; in: gone; out: there
  const tg = [0.25, 0.95, 1.6], st = lt < tg[0] ? 0 : lt < tg[1] ? 1 : lt < tg[2] ? 0 : 1;
  const near = Math.min(...tg.map(x => Math.abs(lt - x))), vis = st;
  return gWindow(t, vis, { ex: xEx(lt > tg[2] ? 'z반짝' : 'z멍'), sy: 1 + (near < 0.12 ? 0.04 : 0) }) + (near < 0.06 ? smFull('#fff', 0.15) : '');
}
function gtitleScene(t, lt, a) {
  const fade = 0.15 + 0.85 * Math.abs(Math.cos(lt * 2.2));
  let h = smDefs() + gDefs() + smPlate('alley', [960, 560, 1.15], 0.5, { blur: true, extra: GSIGN }) + smFull('#0A0E1C', 0.55) + gRain(t, 0.25);
  const bar = easeOut(clamp(lt / 0.4, 0, 1));
  h += `<rect x="-400" y="-300" width="2800" height="${f1(300 + 120 * bar)}" fill="#000"/><rect x="-400" y="${f1(1214 - 132 * bar)}" width="2800" height="400" fill="#000"/>`;
  h += outlined(960, 440, [[['아무도 나를', '#fff']]], { size: 110, sw: 18, lh: 132 }) + `<g opacity="${f1(fade * 100) / 100}">` + outlined(960, 590, [[['볼 수 없다면', '#BFD8FF']]], { size: 110, sw: 18, lh: 132 }) + `</g>`;
  return h;
}

/* ================= s1~s5: testing it ================= */
function gtestScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 2;
  if (id === 's1') {   // the subway: a man staring at his phone walks right into invisible Zero — 퍽 — and looks around at nothing
    const cam = qLerpCam(lt / D, [960, 680, 1.1], [960, 676, 1.14]), tB = 1.3, mx = lt < tB ? lerp(1900, 1130, lt / tB) : 1130 + 60 * easeOut(clamp((lt - tB) / 0.3, 0, 1));
    const zx = 980 - (lt > tB ? 50 * easeOut(clamp((lt - tB) / 0.25, 0, 1)) : 0);
    let ch = gGhost(xZero(t, { x: zx, y: GFY, s: 1.0, pose: lt > tB ? '만세' : '서기', ex: xEx(lt > tB ? 'z충격' : 'z히죽'), look: [0.7, 0], rot: lt > tB ? -8 * Math.exp(-(lt - tB) * 4) : 0 }), t);
    const man = { x: mx, y: GFY, s: 1.0, pose: lt < tB ? Object.assign({}, walkPose(lt * 8, 0.5), { armL: P['g폰'].armL, hL: P['g폰'].hL }) : 'g폰', ex: exprAt([[0, 'z기본'], [tB, 'z충격'], [tB + 0.6, 'z의심']], lt), look: lt > tB + 0.5 ? [Math.sin((lt - tB) * 6) * 0.9, 0] : [-0.3, 0.6] };
    ch += qShadow(mx, GFY, 66) + flip(mx, gMan(t, Object.assign(man, { rot: lt > tB ? 6 * Math.exp(-(lt - tB) * 4) : 0 })));
    const hp = ptOf(mx, GFY, 1.0, 2 * 200 - P['g폰'].hL[0], P['g폰'].hL[1]); ch += xPhone(hp[0], hp[1] - 10, 0.22, { lit: 1 });
    if (lt > tB) ch += gSym(1060, GFY - 520, '퍽!', clamp((lt - tB) / 0.15, 0, 1) * (lt < tB + 0.9 ? 1 : 0), '#FFFFFF', 70) + gSym(mx + 120, GFY - 560, '?', clamp((lt - tB - 0.7) / 0.2, 0, 1), '#FFD23F', 80);
    return smDefs() + gDefs() + smPlate('subway', cam) + qCam(cam, ch) + smFull('#E8F2FF', 0.06);
  }
  // bunsik: Sora's little dish; tteok vanish one by one (a floating fork carries them to an empty seat)
  const dish = (n, fork) => {
    let h = `<g transform="translate(1262 948)"><ellipse cx="0" cy="0" rx="110" ry="30" fill="#fff" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="-2" rx="84" ry="18" fill="#D8433C" opacity=".85"/>`;
    for (let i = 0; i < n; i++) h += `<rect x="${-62 + i * 30}" y="${-14 - (i % 2) * 6}" width="34" height="14" rx="7" fill="#F7EEDC" stroke="${INK}" stroke-width="3" transform="rotate(${(i * 23) % 30 - 15} ${-45 + i * 30} -8)"/>`;
    h += `</g>`;
    if (fork) h += `<g transform="translate(${f1(fork[0])} ${f1(fork[1])}) rotate(${f1(fork[2])})"><path d="M0 0 L0 -90 M-8 -90 L-8 -120 M8 -90 L8 -120 M0 -90 L0 -122" stroke="#8A93A6" stroke-width="7" stroke-linecap="round"/>${fork[3] ? `<rect x="-17" y="-140" width="34" height="14" rx="7" fill="#F7EEDC" stroke="${INK}" stroke-width="3"/>` : ''}</g>`;
    return h;
  };
  const GZB = 1060, zHead = ptOf(GZB, SMBY, 1.0, 200, 236);   // invisible Zero stands right beside Sora's dish (within arm's reach)
  const gFork = (x, y, rot, tt) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><path d="M0 0 L0 -90 M-8 -90 L-8 -120 M8 -90 L8 -120 M0 -90 L0 -122" stroke="#8A93A6" stroke-width="7" stroke-linecap="round"/>${tt ? `<rect x="-17" y="-140" width="34" height="14" rx="7" fill="#F7EEDC" stroke="${INK}" stroke-width="3"/>` : ''}</g>`;
  const mouthSmear = (x) => { const mp = ptOf(x, SMBY, 1.0, 226, 236); return `<path d="M${f1(mp[0])} ${f1(mp[1])} q14 4 22 -8" stroke="#D8433C" stroke-width="9" stroke-linecap="round" fill="none"/>`; };
  if (id === 's2') {   // Sora on her phone; invisible Zero, right beside her, forks a tteok from her dish into his mouth. Twice. (The viewer sees his hand carry the fork.)
    const cam = qLerpCam(lt / D, [1120, 740, 1.4], [1120, 736, 1.45]), per = 1.1, k = (lt % per) / per, trips = lt < 2 * per, n = trips ? Math.max(0, 2 - Math.floor(lt / per) - (k > 0.35 ? 1 : 0)) : 0;
    // the hand: down to the dish (0→0.35), up to the mouth (0.35→0.7), rest (0.7→1)
    const dishL = [1262 - 30, 930], mouth = [zHead[0] + 26, zHead[1] + 10], rest = ptOf(GZB, SMBY, 1.0, 262, 330);
    const hw = !trips ? rest : k < 0.35 ? [lerp(rest[0], dishL[0], easeInOut(k / 0.35)), lerp(rest[1], dishL[1], easeInOut(k / 0.35))] : k < 0.7 ? [lerp(dishL[0], mouth[0], easeInOut((k - 0.35) / 0.35)), lerp(dishL[1], mouth[1], easeInOut((k - 0.35) / 0.35)) - 60 * Math.sin((k - 0.35) / 0.35 * Math.PI)] : [lerp(mouth[0], rest[0], easeInOut((k - 0.7) / 0.3)), lerp(mouth[1], rest[1], easeInOut((k - 0.7) / 0.3))];
    const hl = [200 + (hw[0] - GZB), 560 + (hw[1] - SMBY)], pose = smPose('서기', { armR: [[252, 285], [lerp(252, hl[0], 0.6) + 20, lerp(285, hl[1], 0.5) + 20], hl], hR: hl });
    const chew = trips && k > 0.66 && k < 0.95;
    let ghost = xZero(t, { x: GZB, y: SMBY, s: 1.0, pose, ex: xEx(chew ? 'z빵긋' : 'z히죽'), look: [0.8, 0.4], rot: 4 * Math.sin(k * Math.PI) });
    if (trips && k > 0.68 && k < 0.98) { const sw = (k - 0.68) / 0.3, b = ptOf(GZB, SMBY, 1.0, 200, 260 + 120 * sw); ghost += `<rect x="${f1(b[0] - 17)}" y="${f1(b[1])}" width="34" height="14" rx="7" fill="#F7EEDC" stroke="${INK}" stroke-width="3"/>`; }   // the swallowed tteok, visible inside him for a moment
    let ch = gGhost(ghost, t) + xSoraSeat(t, { pose: 'sm폰', ex: xEx('z기본'), look: [-0.2, 0.6] });
    const hp = ptOf(SMBF, SMBY, 1.0, P['sm폰'].hR[0], P['sm폰'].hR[1]); ch += xPhone(hp[0], hp[1] - 8, 0.24, { lit: 1 });
    return yBun(t, cam, ch) + qCam(cam, dish(n, null) + gFork(hw[0], hw[1] + 6, -20, trips && k > 0.33 && k < 0.66));
  }
  if (id === 's3') {   // CU Sora: the dish is empty
    const cam = qLerpCam(lt / D, [SMBF - 40, 760, 1.9], [SMBF - 40, 756, 1.96]);
    return yBun(t, cam, xSoraSeat(t, { ex: xTalk(a, 'S', 'z당황', t), look: [-0.4, 0.75], tilt: 6 }), { blur: true }) + qCam(cam, dish(0, null));
  }
  if (id === 's4') {   // Zero blinks into view right beside her — fork still in hand, sauce on his mouth; she flinches
    const cam = qLerpCam(lt / D, [GZB + 110, 760, 1.6], [GZB + 110, 756, 1.66]), app = easeOut(clamp(lt / 0.25, 0, 1)), fh = ptOf(GZB, SMBY, 1.0, P['g포크'].hR[0], P['g포크'].hR[1]);
    let z = xZero(t, { x: GZB, y: SMBY, s: 1.0, pose: 'g포크', sy: xPop(lt, 0.05), ex: xTalk(a, 'Z', 'z빵긋', t), look: [0.8, 0.1] }) + mouthSmear(GZB) + gFork(fh[0], fh[1] + 4, 0, false);
    const so = xSoraSeat(t, { y: SMBY - 18 * Math.sin(clamp((lt - 0.1) / 0.3, 0, 1) * Math.PI), ex: xEx(lt > 0.1 ? 'z충격' : 'z기본'), look: [-0.85, 0.1] });
    return yBun(t, cam, gGhost(z, t, 1 - app) + so, { blur: true }) + qCam(cam, dish(0, null)) + gSpark(960, 300, clamp(lt / 0.4, 0, 1), 1.8);
  }
  // s5: two-shot — she narrows her eyes, points; he sweats
  const tP = smAt(a, '먹었', 0.7 * D), cam = qLerpCam(lt / D, [1110, 730, 1.35], [1110, 722, 1.42]);
  const fh = ptOf(GZB, SMBY, 1.0, P['g포크'].hR[0], P['g포크'].hR[1]);
  let ch = xZero(t, { x: GZB, y: SMBY, s: 1.0, pose: 'g포크', ex: xEx(lt > tP ? 'z당황' : 'z빵긋'), look: [0.8, 0.1], sweat: lt > tP }) + mouthSmear(GZB) + gFork(fh[0], fh[1] + 4, lt > tP ? 10 * Math.sin(lt * 20) : 0, false);
  ch += xSoraSeat(t, { pose: lt > tP - 0.1 ? '가리킴' : '서기', sy: xPop(lt, tP - 0.1), ex: xTalk(a, 'S', 'z의심', t), look: [-0.85, 0.05], rot: lt > tP ? -4 : 0 });
  return yBun(t, cam, ch, { pan: true }) + qCam(cam, dish(0, null));
}

/* ================= n1~n4: that night · one question ================= */
// black-figure vase frieze (Glaucon's story): terracotta band with meander borders, black silhouettes
const gFrieze = (inner, t) => {
  let h = smFull('#1A120C') + `<rect x="-300" y="150" width="2600" height="780" fill="#C8693A"/>`;
  for (const y of [150, 880]) { h += `<rect x="-300" y="${y}" width="2600" height="50" fill="#1A120C"/>`; for (let i = -3; i < 28; i++) h += `<path d="M${i * 90} ${y + 40} l0 -30 l60 0 l0 20 l-30 0" stroke="#C8693A" stroke-width="7" fill="none"/>`; }
  return h + `<g filter="url(#gblack)">${inner}</g>` + `<rect x="-300" y="150" width="2600" height="780" fill="url(#qgrain)" opacity=".0"/>`;
};
const gCrook = (x, y) => `<path d="M${x} ${y} L${x} ${y - 330} q0 -50 40 -50 q34 0 34 36" stroke="#000" stroke-width="14" fill="none" stroke-linecap="round"/>`;
const gSheep = (x, y, s = 1, g = 0) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-60" rx="70" ry="44" fill="#000"/><circle cx="62" cy="${f1(-82 + 34 * g)}" r="24" fill="#000"/><path d="M-40 -30 L-44 0 M-14 -26 L-14 0 M18 -26 L18 0 M42 -30 L46 0" stroke="#000" stroke-width="10"/></g>`;
const gCrown = (x, y, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M-50 0 L-56 -50 L-26 -24 L0 -60 L26 -24 L56 -50 L50 0 Z" fill="#000"/></g>`;
const gColumns = () => [140, 520, 1400, 1780].map(x => `<rect x="${x - 40}" y="250" width="80" height="560" fill="#000"/><rect x="${x - 64}" y="230" width="128" height="34" fill="#000"/><rect x="${x - 64}" y="800" width="128" height="34" fill="#000"/>`).join('');
function gnightScene(t, lt, a) {
  const id = a._id || '', D = a._dur || 3;
  if (id === 'n1') {
    const tS = smAt(a, '몸을', 0.4 * D) - 0.15, tQ = smAt(a, '왕비', 0.62 * D) - 0.1, tK = smAt(a, '죽여', 0.8 * D), tW = smAt(a, '되었', 0.9 * D);
    const tV = Math.min(3.1, smAt(a, '국가', 3.0) + 0.1);
    if (lt < tV) {   // MCU at the desk: he holds the ring up to the lamp
      const cam = qLerpCam(lt / tV, [YX + 40, 712, 1.8], [YX + 40, 706, 1.88]), hp = ptOf(YX, YY, 1.0, 330, 236);
      return smDefs() + gDefs() + yNightRoom(t, cam, { blur: true, depth: 0.3 }) + qCam(cam, yDesk(t, { z: { pose: 'g반지들기', ex: xEx('z의심'), look: [0.8, -0.35] }, rim: ['L', '#FFD9A0', 0.3], lid: 0, lit: 0, phone: {} }) + gRing(hp[0] - 4, hp[1] - 26, 1.3) + gSpark(hp[0] + 6, hp[1] - 40, (lt * 0.8) % 1, 1.1));
    }
    if (lt < tS) {   // the vase: a slow reveal of the frieze
      const k = (lt - tV) / Math.max(0.5, tS - tV), z = lerp(0.8, 1.0, easeOut(k));
      const gz = i => Math.max(0, Math.sin(t * 1.6 + i * 2.1));   // grazing
      return smDefs() + gDefs() + `<g transform="translate(960 540) scale(${f1(z * 1000) / 1000}) translate(-960 -540)">` + gFrieze(gSheep(400, 820, 1, gz(0)) + gSheep(620, 830, 0.9, gz(1)) + gCrook(1055, 830) + char({ x: 960, y: 830, s: 0.9, pose: smPose('서기', { armR: [[252, 285], [300, 300], [316, 290]], hR: [318, 288] }), goggles: 'none', look: [0.5, 0], t }) + gSheep(1450, 825, 1, gz(2)), t) + gSpark(1050, 700, (lt * 0.7) % 1, 1.0) + `</g>`;
    }
    if (lt < tQ) {   // the shepherd turns the ring — and is gone (only a faint outline)
      const k = lt - tS, gone = clamp((k - 0.6) / 0.4, 0, 1);
      let inner = gSheep(400, 820) + gSheep(620, 830, 0.9) + gSheep(1450, 825) + `<g opacity="${f1((1 - 0.85 * gone) * 100) / 100}">` + gCrook(860, 830) + char({ x: 960, y: 830, s: 0.9, pose: 'g반지서기', goggles: 'none', look: [0.6, -0.3], t }) + `</g>`;
      return smDefs() + gDefs() + gFrieze(inner, t) + gSpark(1050, 560, clamp((k - 0.2) / 0.5, 0, 1), 1.6);
    }
    // the palace: the queen; the king falls; the faint shape takes the crown
    const k = lt - tQ, fall = easeIn(clamp((lt - tK) / 0.4, 0, 1)), crown = clamp((lt - tW + 0.2) / 0.5, 0, 1);
    let inner = gColumns() + zGirl({ x: 700, y: 830, s: 0.9, hairStyle: 'long', pose: '서기', look: [0.6, 0], seed: 5, t });
    inner += `<g transform="translate(0 ${f1(-100 * fall)}) rotate(${f1(fall * 90)} 1230 830)">` + char({ x: 1230, y: 830, s: 0.9, pose: '서기', goggles: 'none', look: [-0.6, 0], t }) + (fall < 0.5 ? gCrown(1230, 830 - 0.9 * 470, 0.9) : '') + `</g>`;   // lying ON the ground line, not through it
    if (fall >= 0.5 && crown < 1) inner += gCrown(lerp(1380, 990, crown), lerp(820, 830 - 0.9 * 470, easeOut(crown)) - 120 * Math.sin(crown * Math.PI), 0.9);
    const thrust = clamp((lt - tK + 0.45) / 0.3, 0, 1) * (1 - clamp((lt - tK - 0.3) / 0.3, 0, 1));   // the faint shape strikes, then the king falls
    inner += `<g opacity="${f1((0.15 + 0.85 * crown) * 100) / 100}">` + char({ x: 990, y: 830, s: 0.9, pose: mixPose('서기', smPose('서기', { armR: [[252, 285], [330, 292], [400, 296]], hR: [410, 296] }), thrust), goggles: 'none', look: [0.5, 0], t }) + (crown >= 1 ? gCrown(990, 830 - 0.9 * 470, 0.9) : '') + `</g>`;
    return smDefs() + gDefs() + gFrieze(inner, t);
  }
  if (id === 'n2') {
    const tA = smAt(a, '보지', 0.35 * D) - 0.1, tJ = smAt(a, '똑같이', 0.7 * D), tE = Math.max(1.2, smAt(a, '아무도', 0.12 * D) + 0.9);
    if (lt >= tE) {   // two men, one with a laurel wreath; both turn rings; both fade; both reach for the same crown
      const gone = clamp((lt - tA) / 0.5, 0, 1), reach = easeInOut(clamp((lt - tJ) / 0.5, 0, 1));
      const man = (x, wreath, dir) => `<g opacity="${f1((1 - 0.7 * gone) * 100) / 100}">` + char({ x, y: 830, s: 0.9, pose: reach > 0 ? smPose('서기', dir > 0 ? { armR: [[252, 285], [320, 290], [380 * 1, 300]], hR: [388, 300] } : { armL: [[148, 285], [80, 290], [20, 300]], hL: [12, 300] }) : '서기', goggles: 'none', wreath, look: [dir * 0.6, 0], t }) + `</g>`;
      let inner = man(620 + 80 * reach, true, 1) + man(1300 - 80 * reach, false, -1) + `<rect x="900" y="680" width="120" height="150" fill="#000"/><rect x="880" y="666" width="160" height="24" fill="#000"/>` + gCrown(960, 664, 1.0);   // the crown rests on an altar
      return smDefs() + gDefs() + gFrieze(inner, t);
    }
    const cam = qLerpCam(lt / tE, [YX + 20, 690, 2.25], [YX + 20, 684, 2.35]);   // first: CU — he looks at the ring on his finger
    return smDefs() + gDefs() + yNightRoom(t, cam, { blur: true, depth: 0.3 }) + qCam(cam, yDesk(t, { z: { pose: 'g반지들기', ex: xEx('z멍'), look: [0.8, -0.3] }, rim: ['L', '#FFD9A0', 0.32], lid: 0, lit: 0, phone: {} }) + gRing(ptOf(YX, YY, 1, 330, 236)[0] - 4, ptOf(YX, YY, 1, 330, 236)[1] - 26, 1.3));
  }
  if (id === 'n3') {   // MCU: "…난 그렇게까진 안 해." — a little laugh, shakes his head
    const cam = qLerpCam(lt / D, [YX - 140, 724, 1.7], [YX - 140, 718, 1.76]), sh = Math.sin(lt * 9) * 6 * clamp(1 - lt / D, 0, 1);
    return smDefs() + gDefs() + yNightRoom(t, cam, { blur: true, depth: 0.3 }) + qCam(cam, yDesk(t, { z: { pose: 'sm랩톱', tilt: sh, ex: xTalk(a, 'Z', 'z히죽', t), look: [0, 0.4] }, rim: ['L', '#FFD9A0', 0.3], lid: 0, lit: 0, phone: {} }));
  }
  // n4: insert — despite himself, his thumb keeps nudging the stone
  const ang = 0.5 * Math.sin(lt * 3.2) * clamp(lt / 0.5, 0, 1) + (lt > 1.5 ? easeInOut(clamp((lt - 1.5) / 0.4, 0, 1)) * 0.9 : 0);
  return gRingCU(t, ang, { thumb: 0.6 + 0.4 * Math.sin(lt * 3.2), bg: yNightRoom(t, [YX - 300, 680, 2.0], { blur: true, depth: 0.3 }) + smFull('#0B0E18', 0.45) + `<ellipse cx="560" cy="200" rx="700" ry="500" fill="#FFD9A0" opacity=".12"/>` }) + smFull('#0B1230', 0.15 * clamp((lt - 1.2) / 0.8, 0, 1));
}
