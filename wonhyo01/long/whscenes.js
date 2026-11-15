/* 원효 편 — 샘플(대본_v1 1~20번). 새 이름은 모두 wh 접두사. qscenes(qCam·qShadow·qTalk), qdscenes(qdPlate·qdK), fscenes(fEx·ftitle)를 함께 쓴다.
   물리 규칙: 발은 바닥(GY)에 · 표주박은 제로 허리 끈에 매달려 한 박자 늦게 흔들린다 · 누운 사람은 바닥 위에 · 기기 화면은 제로 시점에서만.
   분위기 규칙: 무덤·귀신은 무섭지 않게(만화 해골, 그림자만) · 신라는 쪽빛·먹색, 현대는 밝은 사무실. */
Object.assign(QBG, { meeting: '../../resume01/long/ai/meeting.jpg', office: '../../resume01/long/ai/office.jpg', silla: 'ai/silla.jpg', cave: 'ai/cave.jpg', tomb: 'ai/tomb.jpg', coast: 'ai/coast.jpg' });
['whdoor', 'whsilla', 'whskull', 'whcave', 'whghost', 'whsplit', 'whcoast', 'whtitle', 'whgourd', 'whchapter', 'whsign', 'whmeet', 'whwine', 'whbrain'].forEach(k => CAMS[k] = 'fixed');
const WH = { GY: 990 };
const whOp = k => f1(clamp(k, 0, 1) * 100) / 100;
const whW = (a, key, fb, n = 0) => { const m = (a._words || []).filter(x => x.w.replace(/\s/g, '').includes(key)); return m[n] ? m[n].t + 0.15 : fb; };
const whPt = (x, y, s, lx, ly) => [x + (lx - 200) * s, y + (ly - 560) * s];
const whSay = (key, base, a, t) => { E[key] = a._words && a._words.length ? qTalk(base, env(t)) : E[base]; return fEx(key); };
const WZ = o => Z(Object.assign({ vest: '#F4F4F8', vshade: 'rgba(60,70,120,0.15)', collar: true, tie: '#5B6B8C' }, o));                                                   // 제로(셔츠 + 넥타이)
const WHO = o => HALO(char(Object.assign({ goggles: 'none', vest: '#9EA3AC', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', robe: '#80858F' }, o)));             // 원효(민머리, 회색 승복)
const UIS = o => HALO(char(Object.assign({ goggles: 'none', vest: '#B5A27E', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', robe: '#8E7B5C' }, o)));             // 의상(갈색 승복)
const WB = o => HALO(char(Object.assign({ goggles: 'none', vest: '#3F4A63', patch: false, tee: true, vshade: 'rgba(0,0,0,0.25)', hair: '#2B2B2B', collar: true, tie: '#8A3A2A' }, o))); // 팀장
const WT = o => HALO(char(Object.assign({ goggles: 'none', vest: '#D9C7E8', patch: false, tee: true, vshade: 'rgba(0,0,0,0.15)', hair: '#4A3A30' }, o)));            // 와인 실험 참가자
const whDefs = () => `<defs>
<linearGradient id="whMon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1D2B57" stop-opacity=".62"/><stop offset="1" stop-color="#0E1530" stop-opacity=".5"/></linearGradient>
<linearGradient id="whFri" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB46A" stop-opacity=".42"/><stop offset="1" stop-color="#FFE3B0" stop-opacity=".2"/></linearGradient>
<linearGradient id="whNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1230" stop-opacity=".72"/><stop offset="1" stop-color="#18224A" stop-opacity=".6"/></linearGradient>
<radialGradient id="whGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".95"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></radialGradient>
<radialGradient id="whRose" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FF7AA8" stop-opacity=".95"/><stop offset="1" stop-color="#FF7AA8" stop-opacity="0"/></radialGradient>
<clipPath id="whL"><rect x="-400" y="-400" width="1360" height="2000"/></clipPath><clipPath id="whR"><rect x="960" y="-400" width="1500" height="2000"/></clipPath>
</defs>`;
const whFull = col => `<rect x="-600" y="-600" width="3120" height="2280" fill="${col}"/>`;
const whTint = (id, k) => k > 0.001 ? `<rect x="-600" y="-600" width="3120" height="2280" fill="url(#${id})" opacity="${whOp(k)}"/>` : '';
/* 표주박: 원점은 끈을 맨 꼭지. 허리에 찰 때는 rot으로 흔들림 */
function whGourd(x, y, s, rot = 0) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><path d="M0 -12 L0 6" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    `<circle cx="0" cy="26" r="20" fill="#E8C27A" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="74" r="32" fill="#E8C27A" stroke="${INK}" stroke-width="6"/><rect x="-12" y="38" width="24" height="12" fill="#E8C27A"/>` +
    `<path d="M-14 56 Q0 50 14 56" stroke="#B88A3E" stroke-width="5" fill="none"/><path d="M-6 8 L6 8" stroke="#7A5A2A" stroke-width="8" stroke-linecap="round"/><path d="M-16 68 Q-18 86 -6 96" stroke="#fff" stroke-width="5" fill="none" opacity=".6"/></g>`;
}
/* 제로 허리의 표주박(제로 로컬 좌표 236,430 근처에 매달림) */
const whHipGourd = (x, y, s, t, swing = 0) => { const p = whPt(x, y, s, 238, 428); return whGourd(p[0], p[1], 0.62 * s, 6 * Math.sin(t * 2.2) + swing); };
const whTag = (t, t0, x, y, text, bg, rot = -3) => t < t0 ? '' : pop(t, t0, t + 99, x, y, label(0, 0, text, { size: 38, bg }), { rot, bob: 2 });
const whPill = (t, t0, x, y, text, o = {}) => t < t0 ? '' : pop(t, t0, t + 99, x, y, label(0, 0, text, { size: o.size || 34, bg: o.bg || '#FFFFFF' }), { rot: o.rot || 0, bob: 1 });

/* ---------- 1~3: 같은 회의실 문 ---------- */
function whdoorScene(t, lt, a) {
  const ph = a.ph, y = WH.GY; let cam, w = '', ex = fEx('z기본'), look = [-0.9, -0.1], sy = 1, mon = 0, fri = 0, tag = '';
  if (ph === 0) { // 숨 들이쉬기
    sy = actInhale(lt, 1.0, 0.7, 0.05); look = [-0.95, -0.15]; mon = 0.35;
    cam = qLerpCam(lt / 1.7, [420, 600, 1.12], [380, 610, 1.18]);
  } else if (ph === 1) { // 같은 문, 다른 날
    const tH = whW(a, '어떤', 3.4), tO = whW(a, '그럭저럭', 6.0);
    mon = easeInOut(qdK(tH - 0.3, tH + 0.2, lt)) * (1 - easeInOut(qdK(tO - 0.35, tO + 0.1, lt))); fri = easeInOut(qdK(tO - 0.35, tO + 0.1, lt));
    tag = lt < tH - 0.3 ? '' : lt < tO - 0.35 ? '월요일 9:00' : '금요일 17:30';
    cam = qLerpCam(lt / (a._dur || 7), [520, 560, 0.98], [470, 560, 1.04]);
    ex = fEx(fri > 0.5 ? 'z뿌듯' : mon > 0.5 ? 'z멍' : 'z기본');
  } else { // 클로즈업: "오늘은 지옥 쪽이네"
    E['_whz'] = qTalk('z멍', env(t)); ex = fEx('_whz'); mon = 0.45; look = [-0.6, 0.05];
    cam = qLerpCam(lt / (a._dur || 1.6), [430, 640, 1.55], [425, 650, 1.62]);
  }
  const zx = 430, s = 0.95;
  w += qShadow(zx, y, 90, 0.5) + WZ({ x: zx, y, s, sy, t, ex, look, seed: 3 });
  let h = whDefs() + qdPlate('meeting', cam, 0.55) + qCam(cam, w) + whTint('whMon', mon) + whTint('whFri', fri);
  if (tag) h += `<g transform="translate(1600 150)">${label(0, 0, tag, { size: 44, bg: tag[0] === '월' ? '#9DB8E8' : '#FFD27A' })}</g>`;
  return h;
}

/* ---------- 4: 신라, 원효 ---------- */
function whsillaScene(t, lt, a) {
  const tW = whW(a, '원효', (a._dur || 5) - 0.6), x = lerp(-120, 900, easeOut(qdK(0.1, 2.6, lt))), walking = lt < 2.5, y = WH.GY - 20, s = 0.9;
  const cam = qLerpCam(lt / (a._dur || 5), [900, 600, 1.0], [880, 590, 1.08]);
  const pose = walking ? walkPose(x * 0.04, 0.75) : '서기';
  let w = qShadow(x, y, 80, 0.45) + WHO({ x, y, s, t, pose, ex: fEx(lt > tW ? 'z뿌듯' : 'z기본'), look: walking ? [0.6, 0] : [0.2, -0.1], seed: 21 });
  let h = qdPlate('silla', cam, 0.45) + qCam(cam, w);
  h += whTag(t, t - lt + 1.2, 1500, 300, '617 ~ 686 · 신라', YEL, -4) + whTag(t, t - lt + 1.9, 1520, 410, '80여 편의 책', '#FF9EC4', 3) + whTag(t, t - lt + 2.6, 1500, 520, '설총의 아버지', '#D7DDE6', -2);
  if (lt > tW) h += pop(t, t - lt + tW, t + 99, 960, 200, outlined(0, 0, ['원효'], { size: 130, sw: 22 }), { bob: 2 });
  return h;
}

/* ---------- 5: 해골물? 가장 오래된 기록에는 없다 ---------- */
function whskullScene(t, lt, a) {
  const tB = whW(a, '그런데', 2.6), tX = whW(a, '나오지', (a._dur || 6) - 1.2);
  let h = whFull('#EFE3C8') + BG('url(#paper)');
  const k = easeOutBack(qdK(0.1, 0.6, lt));
  // 우리가 아는 그림: 바가지 속 해골물(만화)
  let card = `<rect x="-330" y="-240" width="660" height="480" rx="26" fill="#FBF4E2" stroke="${INK}" stroke-width="9"/>` +
    `<path d="M-200 30 Q0 210 200 30 Z" fill="#C79A5B" stroke="${INK}" stroke-width="9"/><ellipse cx="0" cy="30" rx="200" ry="34" fill="#8DB7D6" stroke="${INK}" stroke-width="7"/>` +
    `<g transform="translate(40 -10)"><path d="M-62 -10 Q-66 -92 0 -96 Q66 -92 62 -10 L44 6 L44 30 L-44 30 L-44 6 Z" fill="#fff" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><ellipse cx="-24" cy="-36" rx="16" ry="18" fill="${INK}"/><ellipse cx="24" cy="-36" rx="16" ry="18" fill="${INK}"/><path d="M-6 -6 L0 -16 L6 -6 Z" fill="${INK}"/><path d="M-22 30 L-22 16 M0 30 L0 16 M22 30 L22 16" stroke="${INK}" stroke-width="5"/></g>` +
    `<text x="0" y="-170" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="54" fill="${NAVY}">우리가 아는 해골물</text>`;
  h += `<g transform="translate(960 520) scale(${f1(k * 100) / 100}) rotate(-2)">${card}</g>`;
  if (lt > tX) { const x = easeOut(qdK(tX, tX + 0.35, lt)); h += `<path d="M${960 - 360} ${520 - 260} L${f1(960 - 360 + 720 * x)} ${f1(520 - 260 + 520 * x)}" stroke="${RED}" stroke-width="30" stroke-linecap="round"/>`; if (x >= 1) h += `<path d="M${960 + 360} ${520 - 260} L${f1(960 + 360 - 720 * easeOut(qdK(tX + 0.35, tX + 0.7, lt)))} ${f1(520 - 260 + 520 * easeOut(qdK(tX + 0.35, tX + 0.7, lt)))}" stroke="${RED}" stroke-width="30" stroke-linecap="round"/>`; }
  if (lt > tB) h += whPill(t, t - lt + tB, 960, 160, '가장 오래된 기록 · 『송고승전』', { size: 40, bg: YEL, rot: -2 });
  return h;
}

/* ---------- 6: 비 오는 밤 토굴 → 아침, 옛 무덤 ---------- */
function whSleepers(t, lt, wake, o = {}) {
  // 원효(앞)와 의상(뒤)이 바닥에 누워 잔다. wake 0~1: 원효가 일어나 앉는다
  const y = WH.GY - 6; let w = '';
  w += qShadow(1250, y, 120, 0.4) + UIS({ x: 1250, y: y - 30, s: 0.62, rot: 90, t, ex: { expr: '잠', prev: '잠', k: 1, blink: 0 }, noBlink: true, still: true, seed: 5 });
  if (wake < 0.5) w += qShadow(760, y, 120, 0.45) + WHO({ x: 760, y: y - 30, s: 0.66, rot: 90, t, ex: { expr: '잠', prev: '잠', k: 1, blink: 0 }, noBlink: true, still: true, seed: 6 });
  else { const k = easeOutBack(qdK(0.5, 1, wake)); w += qShadow(760, y, 80, 0.45) + WHO({ x: 760, y, s: 0.82, sy: lerp(0.7, 1, k), t, pose: '웅크림', ex: fEx(o.ex || 'z기본'), look: o.look || [0, 0], seed: 6 }); }
  return w;
}
function whcaveScene(t, lt, a) {
  const tM = whW(a, '아침', 5.2), tT = whW(a, '무덤', (a._dur || 9) - 1.2), day = easeInOut(qdK(tM - 0.2, tM + 0.6, lt));
  const cam = qLerpCam(lt / (a._dur || 9), [960, 640, 1.08], [960, 660, 1.16]);
  const wake = qdK(tM + 0.4, tM + 1.2, lt), sk = lt > tT - 0.2;
  let w = whSleepers(t, lt, wake, { ex: sk ? 'z충격' : 'z멍', look: sk ? [-0.9, -0.1] : [0.3, -0.2] });
  let h = whDefs() + qdPlate('cave', cam, 0.5) + (day > 0 ? `<g opacity="${whOp(day)}">${qdPlate('tomb', cam, 0.5)}</g>` : '') + qCam(cam, w);
  if (lt < tM) for (let i = 0; i < 28; i++) { const x = 1500 + hash(i * 3.1) * 520, y0 = ((t * 900 + hash(i) * 1100) % 1100) - 40; h += `<line x1="${f1(x)}" y1="${f1(y0)}" x2="${f1(x - 8)}" y2="${f1(y0 + 40)}" stroke="#CFE3FF" stroke-width="3" opacity=".55"/>`; }
  if (sk) h += whTag(t, t - lt + tT, 520, 260, '옛 무덤', '#D7DDE6', -4);
  return h;
}

/* ---------- 7: 다음 날 밤, 귀신 ---------- */
function whghostScene(t, lt, a) {
  const tG = whW(a, '귀신', (a._dur || 5) - 1.4), g = easeOut(qdK(tG - 0.4, tG + 0.6, lt));
  const cam = qLerpCam(lt / (a._dur || 5), [900, 640, 1.12], [880, 650, 1.22]);
  const shiver = g > 0 ? 3 * Math.sin(t * 40) * g : 0;
  let w = qShadow(760, WH.GY, 80, 0.45) + WHO({ x: 760 + shiver, y: WH.GY, s: 0.82, t, pose: '웅크림', ex: fEx(g > 0.3 ? 'z소름' : 'z멍'), look: [0.8, -0.4], seed: 6 });
  // 벽에 비친 귀신 그림자(무섭지 않게, 흐릿한 보라)
  if (g > 0) { const yy = 520 + 14 * Math.sin(t * 2.4); w += `<g opacity="${whOp(g * 0.75)}" transform="translate(1180 ${f1(yy)}) scale(${f1(lerp(0.6, 1, g) * 100) / 100})"><path d="M-120 120 Q-140 -60 0 -110 Q140 -60 120 120 Q90 90 60 125 Q30 90 0 125 Q-30 90 -60 125 Q-90 90 -120 120 Z" fill="#5B4A8A"/><ellipse cx="-40" cy="-30" rx="16" ry="22" fill="#2A2050"/><ellipse cx="40" cy="-30" rx="16" ry="22" fill="#2A2050"/></g>`; }
  return whDefs() + qdPlate('tomb', cam, 0.5) + whTint('whNight', 1) + qCam(cam, w);
}

/* ---------- 8: 둘이 아니다 ---------- */
function whsplitScene(t, lt, a) {
  const tD = whW(a, '사라지면', (a._dur || 7) - 3.2), tQ1 = whW(a, '마음이', 2.2), tQ2 = whW(a, '마음이', 5.2, 1), tQ3 = whW(a, '아니다', (a._dur || 7) - 0.6), m = easeInOut(qdK(tD - 0.2, tD + 0.9, lt)), cam = [960, 620, 1.05];
  const left = qdPlate('cave', cam, 0.5) + qCam(cam, qShadow(560, WH.GY - 6, 120, 0.45) + WHO({ x: 500, y: WH.GY - 36, s: 0.66, rot: 90, t, ex: { expr: '잠', prev: '잠', k: 1, blink: 0 }, noBlink: true, still: true, seed: 6 })) + `<rect x="-600" y="-600" width="3120" height="2280" fill="url(#whGlow)" opacity=".18"/>`;
  const right = qdPlate('tomb', cam, 0.5) + whTint('whNight', 1) + qCam(cam, qShadow(1240 + 3 * Math.sin(t * 40), WH.GY, 80, 0.45) + WHO({ x: 1240 + 3 * Math.sin(t * 40), y: WH.GY, s: 0.82, t, pose: '웅크림', ex: fEx('z소름'), look: [0.8, -0.4], seed: 6 }) + `<g opacity=".7" transform="translate(1640 ${f1(520 + 14 * Math.sin(t * 2.4))})"><path d="M-120 120 Q-140 -60 0 -110 Q140 -60 120 120 Q90 90 60 125 Q30 90 0 125 Q-30 90 -60 125 Q-90 90 -120 120 Z" fill="#5B4A8A"/><ellipse cx="-40" cy="-30" rx="16" ry="22" fill="#2A2050"/><ellipse cx="40" cy="-30" rx="16" ry="22" fill="#2A2050"/></g>`);
  const one = qdPlate('tomb', cam, 0.5) + qCam(cam, qShadow(960, WH.GY, 80, 0.45) + WHO({ x: 960, y: WH.GY, s: 0.86, t, pose: '웅크림', ex: { expr: '잠', prev: '잠', k: 1, blink: 0 }, noBlink: true, seed: 6 }));
  let h = whDefs() + `<g clip-path="url(#whL)">${left}</g><g clip-path="url(#whR)">${right}</g><line x1="960" y1="-100" x2="960" y2="1300" stroke="#fff" stroke-width="10" opacity="${whOp(1 - m)}"/>`;
  if (m > 0) h += `<g opacity="${whOp(m)}">${one}</g>`;
  h += `<rect x="-600" y="-600" width="3120" height="420" fill="#000" opacity=".28"/>`;
  h += pop(t, t - lt + tQ1, t + 99, 960, 110, outlined(0, 0, ['마음이 일어나면 온갖 것이 일어나고,'], { size: 56, sw: 12 }), {});
  if (lt > tQ2) h += pop(t, t - lt + tQ2, t + 99, 960, 190, outlined(0, 0, [[['마음이 사라지면 ', WHITE], ['토굴과 무덤이 둘이 아니다', YEL]]], { size: 60, sw: 12 }), {});
  if (lt > tQ3) h += whPill(t, t - lt + tQ3, 960, 270, '— 『송고승전』 의상전 · 뜻을 옮김', { size: 30 });
  return h;
}

/* ---------- 9: 바닷가, 두 갈래 길 ---------- */
function whcoastScene(t, lt, a) {
  const tB = whW(a, '돌아갑니다', 4.2), tH = whW(a, '해골물은', (a._dur || 9) - 3.2), cam = qLerpCam(lt / (a._dur || 9), [960, 600, 1.0], [960, 600, 1.06]);
  const u = qdK(0.3, a._dur || 9, lt), ux = lerp(1080, 1700, easeInOut(u)), turn = qdK(tB - 0.6, tB + 0.2, lt), wx = lerp(980, 260, easeInOut(qdK(tB, (a._dur || 9), lt)));
  let w = qShadow(ux, WH.GY - 20, 70, 0.4) + UIS({ x: ux, y: WH.GY - 20, s: 0.78, t, pose: walkPose(ux * 0.04, 0.7), look: [0.9, 0], ex: fEx('z결심'), seed: 5 });
  const wWalk = lt > tB;
  w += qShadow(wx, WH.GY - 20, 70, 0.4) + (turn > 0.5 ? flip(wx, WHO({ x: wx, y: WH.GY - 20, s: 0.8, t, pose: wWalk ? walkPose(-wx * 0.04, 0.7) : '서기', ex: fEx('z뿌듯'), look: [0.6, -0.1], seed: 6 })) : WHO({ x: wx, y: WH.GY - 20, s: 0.8, t, pose: '서기', ex: fEx('z기본'), look: [0.8, 0], seed: 6 }));
  let h = qdPlate('coast', cam, 0.45) + qCam(cam, w);
  if (lt > tH) h += whPill(t, t - lt + tH, 960, 170, '해골물 이야기 · 『종경록』의 다른 판본', { size: 40, bg: '#FFE4A8', rot: -2 });
  return h;
}

/* ---------- 10: 제목 ---------- */
function whtitleScene(t, lt, a) {
  let h = whFull(NAVY) + BG('url(#grid)') + particles(t, 7, 26, [0, 0, 1920, 1080], '#FFE4A8', { speed: 22, r: 4, op: 0.45 });
  h += pop(t, t - lt + 0.15, t + 99, 960, 360, outlined(0, 0, [[['만약에, ', WHITE], ['원효', YEL], ['처럼', WHITE]]], { size: 110, sw: 20 }), {});
  h += pop(t, t - lt + 0.7, t + 99, 960, 540, outlined(0, 0, [[["'마음먹기'", '#FFB6C8'], ['로 산다면?', WHITE]]], { size: 110, sw: 20 }), {});
  h += whGourd(1500, 700 + 8 * Math.sin(t * 2), 2.2, 8 * Math.sin(t * 1.6));
  h += Z({ t, seed: 9, x: 420, y: 1010, s: 0.62, ex: fEx('z빵긋'), look: [0.6, -0.3] }) + whHipGourd(420, 1010, 0.62, t);
  return h;
}

/* ---------- 11~12: 표주박을 허리에 ---------- */
function whgourdScene(t, lt, a) {
  const y = WH.GY, s = 0.95, zx = 820;
  let cam, w = '', ex, look = [0.4, 0.3], pose = P['서기'], swing = 0, hip = true;
  if (a.shake) { // 클로즈업: 흔들어 보기
    E['_whg'] = qTalk('z의심', env(t)); ex = fEx('_whg'); look = [0.5, 0.6]; swing = 22 * Math.sin(lt * 9) * Math.exp(-lt * 0.9);
    pose = Object.assign({}, P['서기'], { armR: [[252, 285], [292, 340], [262, 420]], hR: [256, 428] });
    cam = qLerpCam(lt / 2, [880, 760, 1.6], [880, 770, 1.68]);
  } else {
    const tG = whW(a, '표주박을', 1.2), tF = whW(a, '가지', 3.2), on = lt > tG + 0.3; hip = on;
    ex = fEx(on ? 'z빵긋' : 'z기본'); cam = qLerpCam(lt / (a._dur || 7), [900, 600, 1.0], [900, 600, 1.06]);
    if (!on) { // 서랍에서 꺼내 든다
      const k = easeOut(qdK(0.2, tG + 0.2, lt)); pose = Object.assign({}, P['서기'], { armR: [[252, 285], [300, 300], [lerp(300, 330, k), lerp(380, 250, k)]], hR: [lerp(304, 332, k), lerp(388, 242, k)] });
      const hp = whPt(zx, y, s, pose.hR[0], pose.hR[1]); w += whGourd(hp[0], hp[1] - 4, 0.9, 6 * Math.sin(lt * 3));
    }
    const items = [['① 다른 이름', '#FFE27A'], ['② 다툼 잇기', '#BDE7C9'], ['③ 쉬운 말', '#BFD7FF'], ['④ 나를 품기', '#FFC6D9']];
    items.forEach(([s0, bg], i) => { if (lt > tF + i * 0.35) w += pop(t, t - lt + tF + i * 0.35, t + 99, 1420, 300 + i * 120, label(0, 0, s0, { size: 44, bg }), { rot: i % 2 ? 2 : -2, bob: 2 }); });
  }
  w = qShadow(zx, y, 90, 0.5) + WZ({ x: zx, y, s, t, pose, ex, look, seed: 3 }) + (hip ? whHipGourd(zx, y, s, t, swing) : '') + w;
  return qdPlate('office', cam, 0.5) + qCam(cam, w);
}

/* ---------- 13: 장 배지(005 장 카드 모양) ---------- */
function whchapterScene(t, lt, a) {
  let h = whFull(NAVY) + BG('url(#grid)') + particles(t, 9, 30, [0, 0, 1920, 1080], MINT, { speed: 30, r: 4, op: 0.5 });
  const k = easeOut(prog(lt, 0, 0.6));
  h += `<g opacity="${whOp(k)}" transform="translate(${f1((1 - k) * -60)} 0)">`;
  h += outlined(960, 320, [[[String(a.n), YEL], [' / 4', MINT]]], { size: 64, sw: 12 });
  h += label(960, 440, `${a.n}일 차`, { size: 48, bg: YEL });
  h += outlined(960, 630, [a.name], { size: 116, sw: 22 });
  h += `</g>`;
  for (let i = 1; i <= 4; i++) h += `<circle cx="${960 + (i - 2.5) * 70}" cy="750" r="${i === a.n ? 16 : 11}" fill="${i <= a.n ? MINT : '#33465F'}" stroke="${INK}" stroke-width="4"/>`;
  const zx = lerp(-200, 2100, prog(lt, 0, 6));
  h += Z({ t, seed: 9, x: zx, y: 1000, s: 0.42, pose: walkPose(t * 9, 0.9), ex: fEx('z기본') }) + whHipGourd(zx, 1000, 0.42, t, 10 * Math.sin(t * 9));
  return h;
}

/* ---------- 14: 문에 새 이름 붙이기(제로 시점) ---------- */
function whsignScene(t, lt, a) {
  const tN = whW(a, '말고', 3.6), tP = whW(a, '연습', (a._dur || 6) - 1.4), cam = [260, 520, 1.45];
  let h = qdPlate('meeting', cam, 0.8);
  const flipK = easeInOut(qdK(tP - 0.4, tP + 0.1, lt)), txt = flipK < 0.5 ? '오늘의 지옥' : '오늘의 연습 경기', col = flipK < 0.5 ? '#3B3F52' : '#2E8B57', sc = Math.abs(1 - 2 * flipK);
  const bob = 4 * Math.sin(t * 2.2), x = 960, y = 470 + bob;
  h += `<g transform="translate(${x} ${f1(y)}) scale(${f1(Math.max(0.02, sc) * 100) / 100} 1) rotate(-2)"><rect x="-330" y="-140" width="660" height="280" rx="14" fill="#FFFDF5" stroke="${INK}" stroke-width="9"/>` +
    `<text x="0" y="24" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${txt.length > 6 ? 76 : 92}" fill="${col}">${txt}</text>` + (flipK > 0.5 ? `<path d="M-260 70 Q0 100 260 70" stroke="#2E8B57" stroke-width="8" fill="none"/>` : '') + `</g>`;
  if (lt > tN && flipK < 0.5) { const k = easeOut(qdK(tN, tN + 0.3, lt)); h += `<path d="M${x - 300} ${f1(y)} L${f1(x - 300 + 600 * k)} ${f1(y)}" stroke="${RED}" stroke-width="16" stroke-linecap="round"/>`; }
  // 두 손(제로 시점, 셔츠 소매)
  [[x - 360, y + 150, -1], [x + 360, y + 150, 1]].forEach(([hx, hy, sd]) => { const sl = `M${f1(hx + sd * 60)} 1180 L${f1(hx + sd * 20)} ${f1(hy + 40)}`; h += `<path d="${sl}" stroke="${INK}" stroke-width="84" stroke-linecap="round"/><path d="${sl}" stroke="#F4F4F8" stroke-width="68" stroke-linecap="round"/>` + hand(hx, hy, 1.6); });
  return h;
}

/* ---------- 15~16, 20: 회의실 ---------- */
function whTable(cx, y) { return `<path d="M${cx - 520} ${y} L${cx + 520} ${y} L${cx + 470} ${y + 60} L${cx - 470} ${y + 60} Z" fill="#B98B5E" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><rect x="${cx - 450}" y="${y + 60}" width="26" height="150" fill="#8E6A45" stroke="${INK}" stroke-width="6"/><rect x="${cx + 424}" y="${y + 60}" width="26" height="150" fill="#8E6A45" stroke="${INK}" stroke-width="6"/>`; }
function whPaper(x, y, s, rot = 0, mark = false) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})"><rect x="-60" y="-80" width="120" height="160" rx="6" fill="#fff" stroke="${INK}" stroke-width="5"/>${[-46, -22, 2, 26].map(yy => `<rect x="-42" y="${yy}" width="${yy === 2 ? 60 : 84}" height="10" rx="4" fill="#C5CCD8"/>`).join('')}${mark ? `<circle cx="34" cy="7" r="22" fill="none" stroke="${RED}" stroke-width="6"/>` : ''}</g>`; }
function whmeetScene(t, lt, a) {
  const y = WH.GY, zx = 640, bx = 1300, s = 0.92; let w = '', cam, zex = fEx('z기본'), bex = fEx('z기본'), zlook = [0.8, 0], blook = [-0.8, 0.1], bpose = P['서기'], zpose = P['서기'], bubbleK = 0;
  if (a.end) { E['_whz'] = qTalk('z빵긋', env(t)); zex = fEx('_whz'); zlook = [0.3, 0.5]; zpose = Object.assign({}, P['서기'], { armR: [[252, 285], [292, 330], [262, 370]], hR: [256, 376], armL: [[148, 285], [120, 330], [150, 370]], hL: [156, 374] }); cam = qLerpCam(lt / 3, [760, 640, 1.3], [760, 650, 1.36]); }
  else if (a.mutter) { E['_whz'] = qTalk('z결심', env(t) * 0.6); zex = fEx('_whz'); zlook = [0.2, 0.3]; bubbleK = easeOutBack(qdK(0.3, 0.8, lt)); cam = qLerpCam(lt / 2.5, [700, 600, 1.25], [690, 610, 1.32]); }
  else { E['_whb'] = qTalk('z기본', env(t)); bex = fEx('_whb'); bpose = Object.assign({}, P['서기'], { armL: [[148, 285], [100, 300], [64, 330]], hL: [58, 336] }); zex = fEx('z멍'); cam = qLerpCam(lt / 2.5, [980, 590, 1.05], [990, 590, 1.1]); }
  w += qShadow(bx, y, 90, 0.5) + WB({ x: bx, y, s, t, pose: bpose, ex: bex, look: blook, seed: 8 });
  w += qShadow(zx, y, 90, 0.5) + WZ({ x: zx, y, s, t, pose: zpose, ex: zex, look: zlook, seed: 3 }) + whHipGourd(zx, y, s, t);
  w += whTable(960, 860) + whPaper(860, 840, 0.7, -6, !a.end) + whPaper(1060, 846, 0.7, 4);
  if (a.end) { const hp = whPt(zx, y, s, 256, 376); w += whPaper(hp[0] + 30, hp[1] - 40, 0.9, -8) + `<path d="M${f1(hp[0] + 40)} ${f1(hp[1] - 30)} l40 -40" stroke="#2E5AAC" stroke-width="10" stroke-linecap="round"/>`; }
  if (bubbleK > 0) w += `<g transform="translate(${zx + 230} 520) scale(${f1(bubbleK * 100) / 100})">${bubble(0, 0, 340, 210, `<rect x="-120" y="-60" width="240" height="120" rx="10" fill="#7FD08A" stroke="${INK}" stroke-width="6"/><line x1="0" y1="-60" x2="0" y2="60" stroke="#fff" stroke-width="5"/><circle cx="0" cy="0" r="26" fill="none" stroke="#fff" stroke-width="5"/><circle cx="60" cy="20" r="14" fill="#fff" stroke="${INK}" stroke-width="4"/>`)}</g>`;
  return qdPlate('meeting', cam, 0.55) + qCam(cam, w);
}

/* ---------- 17~18: 와인 실험 ---------- */
function whGlass(x, y, fill, k = 1) { return `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M-46 -120 Q-50 -40 0 -20 Q50 -40 46 -120 Z" fill="#fff" fill-opacity=".55" stroke="${INK}" stroke-width="6"/>${k > 0 ? `<path d="M${f1(-44 + 4 * (1 - k))} ${f1(-120 + 60 * (1 - k) + 40)} Q-40 -46 0 -28 Q40 -46 ${f1(44 - 4 * (1 - k))} ${f1(-120 + 60 * (1 - k) + 40)} Z" fill="${fill}"/>` : ''}<path d="M0 -20 L0 40" stroke="${INK}" stroke-width="7"/><path d="M-36 44 L36 44" stroke="${INK}" stroke-width="8" stroke-linecap="round"/></g>`; }
function whTagPrice(x, y, text, k, col) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(-8 + 6 * Math.sin(k * 3))}) scale(${f1(easeOutBack(clamp(k, 0, 1)) * 100) / 100})"><path d="M-70 -34 L50 -34 L80 0 L50 34 L-70 34 Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><circle cx="56" cy="0" r="8" fill="#fff" stroke="${INK}" stroke-width="4"/><text x="-10" y="16" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="46" fill="${NAVY}">${text}</text></g>`; }
function whwineScene(t, lt, a) {
  const ph1 = !!a.ph; let h = whFull('#F6EEDC') + BG('url(#paper)') + `<rect x="-600" y="780" width="3120" height="600" fill="#E3D2B0"/><line x1="-600" y1="780" x2="2600" y2="780" stroke="${INK}" stroke-width="6" opacity=".4"/>`;
  const pour = ph1 ? easeInOut(qdK(0.2, 1.2, lt)) : 0, t5 = ph1 ? whW(a, '5달러', 1.8) : 99, t45 = ph1 ? whW(a, '45달러', 3.2) : 99, tM = ph1 ? whW(a, '맛있다고', 5.2) : 99, tJ = ph1 ? whW(a, '즐거움을', 7.4) : 99;
  // 병(상표 없음)과 두 잔
  const bx = 960, by = 760; h += `<g transform="translate(${bx} ${by}) rotate(${f1(ph1 ? -40 * Math.sin(Math.PI * clamp(qdK(0.2, 1.2, lt), 0, 1)) : 0)})"><rect x="-44" y="-260" width="88" height="250" rx="30" fill="#5B1E3A" stroke="${INK}" stroke-width="7"/><rect x="-18" y="-330" width="36" height="80" rx="8" fill="#5B1E3A" stroke="${INK}" stroke-width="7"/><rect x="-30" y="-180" width="60" height="70" rx="6" fill="#F4EAD5" stroke="${INK}" stroke-width="4"/></g>`;
  h += whGlass(640, 760, '#8E1E3A', pour) + whGlass(1280, 760, '#8E1E3A', pour);
  h += whTagPrice(560, 560, '$5', qdK(t5 - 0.1, t5 + 0.3, lt), '#D7DDE6') + whTagPrice(1360, 560, '$45', qdK(t45 - 0.1, t45 + 0.3, lt), '#FFD27A');
  // 맛보는 사람
  if (ph1) { const px = 1640, py = 1010; h += qShadow(px, py, 70, 0.4) + WT({ x: px, y: py, s: 0.72, t, ex: fEx(lt > tM ? 'z하트눈' : 'z기본'), look: [-0.8, -0.2], seed: 12 });
    if (lt > tM) h += pop(t, t - lt + tM, t + 99, 1640, 360, bubble(0, 0, 360, 170, `<text x="0" y="16" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="54" fill="${NAVY}">더 맛있다!</text>`), {});
    if (lt > tM) h += `<circle cx="1280" cy="660" r="${f1(110 + 10 * Math.sin(t * 5))}" fill="url(#whGlow)"/>`; }
  if (lt > tJ) { const k = easeOut(qdK(tJ, tJ + 0.5, lt)); h += `<g opacity="${whOp(k)}">` + brain(1150, 330, 0.42, null, t) + `<ellipse cx="${f1(1150 - 230 * 0.42)}" cy="${f1(330 + 60 * 0.42)}" rx="${f1(60 + 10 * Math.sin(t * 6))}" ry="40" fill="url(#whRose)"/>` + label(1150, 490, '즐거움 ↑', { size: 36, bg: '#FFC6D9' }) + `</g>`; }
  return whDefs() + h;
}

/* ---------- 19: 뇌 두 개 — 맛 영역은 같고, 즐거움 영역만 다르다 ---------- */
function whbrainScene(t, lt, a) {
  const tT = whW(a, '그대로', 1.8), tJ = whW(a, '즐거움만', (a._dur || 6) - 1.6);
  let h = whFull('#F6EEDC') + BG('url(#paper)');
  [[560, '$5', 0.35], [1360, '$45', 1]].forEach(([cx, tag, joy], i) => {
    h += brain(cx, 520, 0.62, null, t);
    const taste = easeOut(qdK(tT - 0.2, tT + 0.4, lt)), jk = easeOut(qdK(tJ - 0.2, tJ + 0.4, lt));
    h += `<ellipse cx="${cx}" cy="${f1(520 + 30 * 0.62)}" rx="${f1(70 * taste)}" ry="${f1(46 * taste)}" fill="#7FD0FF" opacity=".75"/>`;
    h += `<ellipse cx="${f1(cx - 200 * 0.62)}" cy="${f1(520 + 70 * 0.62)}" rx="${f1((50 + 60 * joy) * jk)}" ry="${f1((34 + 40 * joy) * jk)}" fill="url(#whRose)"/>`;
    h += whTagPrice(cx, 220, tag, 1, i ? '#FFD27A' : '#D7DDE6');
  });
  if (lt > tT) h += label(960, 860, '맛을 느끼는 곳: 똑같다', { size: 40, bg: '#BFE6FF' });
  if (lt > tJ) h += label(960, 950, '즐거움을 느끼는 곳: $45 쪽이 더', { size: 40, bg: '#FFC6D9' });
  return whDefs() + h;
}
