/* 애어른 편 — 1막(대본_v1 1~7번). 새 이름은 모두 ad 접두사. cmpscenes.js(비교 샘플)의 헬퍼와 함께 쓴다.
   물리 규칙: 빵 봉지는 손에 매달려 있고 한 박자 늦게 흔들린다 · 전화기는 귀 옆 손 안에(뒷면만 보임) · 할아버지는 침대 위, 다리는 이불 아래 · 펜 끝은 종이 위 · 원인 다음 결과.
   분위기 규칙: 번쩍·흔들림 없음, 밤 장면도 밝게. */
Object.assign(QBG, { er: 'ai/er.jpg', store: 'ai/store.jpg', bay: 'ai/bay.jpg' });
['ader', 'adstore', 'adform'].forEach(k => CAMS[k] = 'fixed');
const AD = { GY: 985, ZX: 900, NX: 1480, S: 0.92 };
const adPt = (x, y, s, lx, ly) => [x + (lx - 200) * s, y + (ly - 560) * s];
const adOp = k => f1(clamp(k, 0, 1) * 100) / 100;
const adL = id => ((window.TL && TL.lines) || []).find(l => l.id === id) || { t0: 0, t1: 1, words: [] };
const adWd = (ws, key, fb, n = 0) => { const m = (ws || []).filter(x => x.w.replace(/\s/g, '').includes(key)); return m[n] ? m[n].t + 0.15 : fb; };
const adW = (a, key, fb, n) => adWd(a._words, key, fb, n);
const adOn = (x, y, s, dy, inner) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s}) translate(-200 ${f1(-560 + (dy || 0))})">${inner}</g>`;
const ADZ = o => Z(Object.assign({ vest: '#F4F4F8', vshade: 'rgba(60,70,120,0.15)', collar: true, tie: '#5B6B8C' }, o));                                         // 제로(셔츠 + 느슨한 넥타이)
const ADN = o => HALO(char(Object.assign({ goggles: 'none', vest: '#F7C8D4', patch: false, tee: true, vshade: 'rgba(120,40,60,0.15)', longHair: '#3A2A22', hair: '#3A2A22' }, o)));  // 간호사
const ADG = o => HALO(char(Object.assign({ goggles: 'none', vest: '#CFE4F4', patch: false, tee: true, vshade: 'rgba(40,70,120,0.15)', hair: '#F1F1F1' }, o)));       // 할아버지(환자복, 흰 머리)
const ADF = o => HALO(char(Object.assign({ goggles: 'none', vest: '#5F6876', patch: false, tee: true, vshade: 'rgba(0,0,0,0.25)', hair: '#6E6E72', noMouth: true }, o))); // 아버지(점퍼, 뒷모습용)
const adDefs = () => `<defs>
<radialGradient id="adWarm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".9"/><stop offset=".55" stop-color="#FFD98A" stop-opacity=".35"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient>
<linearGradient id="adNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A5BA6"/><stop offset="1" stop-color="#8FA0DC"/></linearGradient>
<linearGradient id="adDesk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DFF3EC"/><stop offset="1" stop-color="#C4E6DB"/></linearGradient>
<clipPath id="adInset"><rect x="-250" y="-160" width="500" height="320" rx="26"/></clipPath>
</defs>`;
const adStar = (r, fill = '#FFD84A') => { let d = ''; for (let i = 0; i < 10; i++) { const an = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.48 : r; d += (i ? 'L' : 'M') + f1(Math.cos(an) * rr) + ' ' + f1(Math.sin(an) * rr); } return `<path d="${d} Z" fill="${fill}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`; };
/* 스티커 든 빵 봉지(지어낸 별 캐릭터). 원점은 봉지 위쪽 가운데(손에 쥔 곳) */
function adBag(x, y, s, rot, col = '#FFF3D6') {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><path d="M-36 -6 L-28 4 L-20 -6 L-12 4 L-4 -6 L4 4 L12 -6 L20 4 L28 -6 L36 4 L40 92 L-40 92 Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><ellipse cx="0" cy="54" rx="29" ry="24" fill="#E9B878" stroke="${INK}" stroke-width="4"/><g transform="translate(0 38)">${adStar(20)}<circle cx="-6" cy="-1" r="2.6" fill="${INK}"/><circle cx="6" cy="-1" r="2.6" fill="${INK}"/><path d="M-5 6 Q0 10 5 6" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/></g></g>`;
}
const adBags = (x, y, s, rot, n = 2) => (n > 1 ? adBag(x + 16 * s, y + 4 * s, s, rot * 0.8 + 9, '#FFE7DE') : '') + adBag(x - (n > 1 ? 10 * s : 0), y, s, rot - (n > 1 ? 7 : 0));
const adPhone = (x, y, s, rot = 6) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})"><rect x="-17" y="-36" width="34" height="66" rx="8" fill="#1F2D44" stroke="${INK}" stroke-width="5"/><circle cx="-6" cy="-24" r="4" fill="#3B4A66"/></g>`;
const adCap = () => `<path d="M146 78 Q200 40 254 78 L248 104 Q200 86 152 104 Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M160 92 Q200 76 240 92" fill="none" stroke="#F08AA4" stroke-width="6" stroke-linecap="round"/>`;
const adClip = (x, y, s, rot = -8) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})"><rect x="-44" y="-62" width="88" height="118" rx="8" fill="#B9895A" stroke="${INK}" stroke-width="6"/><rect x="-36" y="-50" width="72" height="98" rx="4" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="-18" y="-70" width="36" height="18" rx="5" fill="#8E97A6" stroke="${INK}" stroke-width="4"/>${[0, 1, 2, 3].map(i => `<line x1="-26" y1="${-30 + i * 20}" x2="${i % 2 ? 14 : 26}" y2="${-30 + i * 20}" stroke="#B8BECB" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>`;
const adSpark = (x, y, k, r = 60) => (typeof cmpSpark === 'function' ? cmpSpark(x, y, k, r) : '');
/* 팔 자세 */
const adArmHold = { armR: [[252, 285], [278, 344], [270, 396]], hR: [270, 404] };                 // 봉지를 든 팔(내린 채)
const adArmEar = { armR: [[252, 285], [322, 300], [326, 226]], hR: [328, 214] };                   // 귀 옆으로 든 팔
const adMixArm = (A, B, k) => ({ armR: A.armR.map((p, i) => [lerp(p[0], B.armR[i][0], k), lerp(p[1], B.armR[i][1], k)]), hR: [lerp(A.hR[0], B.hR[0], k), lerp(A.hR[1], B.hR[1], k)] });

/* ---------- 1~4번: 응급실 ---------- */
function adNurse(t, o = {}) {
  const x = AD.NX, y = AD.GY, s = 0.93, pose = Object.assign({}, P['서기'], { armL: [[148, 285], [118, 336], [150, 356]], hL: [158, 358] });
  const hp = adPt(x, y, s, 158, 358);
  return qShadow(x, y, 88, 0.5) + ADN({ x, y, s, t, pose, ex: o.ex || fEx('z기본'), look: o.look || [-0.6, 0], seed: 11, still: true }) + adOn(x, y, s, 0, adCap()) + adClip(hp[0] - 6, hp[1] - 28, 0.8, -10) + hand(hp[0], hp[1], 0.7 * s);
}
function aderScene(t, lt, a) {
  const ph = a.ph, y = AD.GY, s = AD.S; let cam, w = '', zx = AD.ZX, pose, ex = fEx('z멍'), look = [0.6, 0], sy = 1, sx = 1, tilt = 0, bagRot = 0, bagBehind = 0, arm = adArmHold, walking = false;
  if (ph === 0) { const k = easeOut(qdK(0.15, 1.55, lt)); zx = lerp(330, AD.ZX, k); walking = lt > 0.15 && lt < 1.45;
    const u = lt - 1.5; if (u > 0) { sy = 1 + 0.03 * Math.sin(u * 8.5) * Math.exp(-u * 0.45); bagRot = 14 * Math.sin(u * 6) * Math.exp(-u * 2.2); look = u > 0.5 ? [0.75, -0.05] : [0.3, 0.2]; } else { bagRot = -14; ex = fEx('z당황'); }
    cam = qLerpCam(lt / 2.9, [860, 560, 1.0], [960, 570, 1.14]);
  } else if (ph === 1) { const tB = adW(a, '보호자', 1.3), up = easeInOut(qdK(tB - 0.25, tB + 0.1, lt)); E['_adg'] = qTalk('z기본', env(t));
    w += adNurse(t, { ex: fEx('_adg'), look: [lerp(-0.25, -0.85, up), lerp(0.55, -0.1, up)] });
    sy = 1 + 0.015 * Math.sin(lt * 8.5); look = [0.8, 0]; cam = qLerpCam(lt / (a._dur || 2), [1240, 545, 1.28], [1210, 545, 1.36]);
  } else if (ph === 2) { const k = easeInOut(qdK(0.35, 0.75, lt)) * (1 - easeInOut(qdK(1.95, 2.35, lt))); look = [lerp(0.8, -1.5, k), lerp(0, 0.05, k)]; tilt = -10 * k; sx = 1 - 0.14 * Math.sin(Math.PI * qdK(0.35, 0.75, lt)) - 0.14 * Math.sin(Math.PI * qdK(1.95, 2.35, lt)); bagRot = 12 * Math.sin((lt - 0.4) * 5) * Math.exp(-Math.max(0, lt - 0.4) * 1.6) * (lt > 0.4 ? 1 : 0);
    w += adNurse(t, { look: [-0.85, -0.1] });
    const c1 = easeInOut(qdK(0.45, 1.35, lt)), c2 = easeInOut(qdK(2.0, 2.8, lt)); cam = [lerp(lerp(1040, 600, c1), 900, c2), 545, lerp(1.2, 1.26, c2)];
  } else { const up = easeOut(qdK(0.05, 0.45, lt)) * (1 - easeInOut(qdK(0.95, 1.4, lt))), hide = easeInOut(qdK(0.95, 1.4, lt)); E['_adz'] = qTalk(lt > 0.7 ? 'z민망' : 'z멍', env(t)); ex = fEx('_adz');
    const chest = { armR: [[252, 285], [304, 334], [252, 330]], hR: [244, 328] }, back = { armR: [[252, 285], [282, 346], [262, 392]], hR: [258, 398] };
    arm = hide > 0 ? adMixArm(adArmHold, back, hide) : adMixArm(adArmHold, chest, up); bagBehind = hide; bagRot = 10 * Math.sin(lt * 7) * Math.exp(-lt * 1.5) + 18 * hide;
    look = lt > 0.5 && lt < 1.0 ? [0.35, 0.85] : [0.7, -0.05]; w += adNurse(t, { look: [-0.85, -0.1] });
    cam = qLerpCam(lt / 1.2, [AD.ZX + 40, 680, 1.5], [AD.ZX + 30, 690, 1.62]);
  }
  pose = walking ? Object.assign({}, walkPose(zx * 0.042, 0.8), arm) : Object.assign({}, P['서기'], arm);
  const hp = adPt(zx, y, s, arm.hR[0], arm.hR[1] + (pose.dy || 0)), bags = adBags(hp[0], hp[1] + 4, 0.92, bagRot, 2);
  const zero = ADZ({ x: zx, y, s, sx, sy, t, pose, ex, look, tilt, seed: 3, still: true });
  w += qShadow(zx, y, 92, 0.5) + (bagBehind > 0.5 ? `<g transform="translate(${f1(22 * bagBehind)} 0)">${bags}</g>` + zero : zero + bags + hand(hp[0], hp[1], 0.7 * s));
  return adDefs() + qdPlate('er', cam, 0.5) + qCam(cam, w);
}

/* ---------- 5~6번: 40분 전, 편의점 ---------- */
function adClock(x, y, hr, mn) {
  const ah = (hr % 12 + mn / 60) * Math.PI / 6, am = mn * Math.PI / 30;
  let s = `<g transform="translate(${x} ${y})"><circle r="74" fill="#fff" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 12; i++) s += `<line x1="${f1(Math.sin(i * Math.PI / 6) * 58)}" y1="${f1(-Math.cos(i * Math.PI / 6) * 58)}" x2="${f1(Math.sin(i * Math.PI / 6) * 66)}" y2="${f1(-Math.cos(i * Math.PI / 6) * 66)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  return s + `<line x1="0" y1="0" x2="${f1(Math.sin(ah) * 36)}" y2="${f1(-Math.cos(ah) * 36)}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><line x1="0" y1="0" x2="${f1(Math.sin(am) * 54)}" y2="${f1(-Math.cos(am) * 54)}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle r="6" fill="${INK}"/></g>`;
}
function adInsetFather(t, k) { // 밤의 휴게소에서 전화하는 아버지(뒷모습)
  if (k <= 0) return '';
  let g = `<g transform="translate(1500 300) scale(${f1(lerp(0.3, 1, easeOutBack(clamp(k, 0, 1))) * 100) / 100})"><rect x="-258" y="-168" width="516" height="336" rx="30" fill="${INK}"/><g clip-path="url(#adInset)"><rect x="-250" y="-160" width="500" height="320" fill="url(#adNight)"/><circle cx="-170" cy="-100" r="26" fill="#FFF6CF"/>`;
  g += `<rect x="-250" y="70" width="500" height="100" fill="#6C78A8"/><rect x="60" y="-70" width="200" height="140" fill="#E9EEF9" stroke="${INK}" stroke-width="5"/><rect x="80" y="-46" width="60" height="50" rx="4" fill="#FFE9A8"/><rect x="156" y="-46" width="60" height="50" rx="4" fill="#FFE9A8"/><rect x="40" y="-88" width="240" height="24" rx="6" fill="#F08A6B" stroke="${INK}" stroke-width="5"/>`;
  g += `<g transform="translate(-150 96)"><rect x="-74" y="-34" width="148" height="44" rx="14" fill="#C9D2E8" stroke="${INK}" stroke-width="5"/><path d="M-44 -34 Q-30 -66 0 -66 Q30 -66 44 -34 Z" fill="#DDE5F5" stroke="${INK}" stroke-width="5"/><circle cx="-42" cy="12" r="15" fill="#2B2F3A"/><circle cx="42" cy="12" r="15" fill="#2B2F3A"/></g>`;
  const x = -10, y = 250, s = 0.5, pose = Object.assign({}, P['서기'], adArmEar), hp = adPt(x, y, s, 330, 188), hd = adPt(x, y, s, 200, 170);
  g += ADF({ x, y, s, t, pose, ex: fEx('z기본'), seed: 9, still: true }) + `<ellipse cx="${f1(hd[0])}" cy="${f1(hd[1] + 4)}" rx="${f1(112 * s)}" ry="${f1(104 * s)}" fill="#fff"/><path d="M${f1(hd[0] - 114 * s)} ${f1(hd[1] - 6)} Q${f1(hd[0])} ${f1(hd[1] - 150 * s)} ${f1(hd[0] + 114 * s)} ${f1(hd[1] - 6)} Q${f1(hd[0])} ${f1(hd[1] - 40 * s)} ${f1(hd[0] - 114 * s)} ${f1(hd[1] - 6)} Z" fill="#6E6E72" stroke="${INK}" stroke-width="4"/>` + adPhone(hp[0], hp[1], 0.52) + hand(hp[0] + 1, hp[1] + 14, 0.36);
  return g + `</g></g>`;
}
function adstoreScene(t, lt, a) {
  const ph = a.ph, y = AD.GY, s = 0.98, D = a._dur || 8; let cam, w = '', over = '', zx = 900;
  if (ph === 0) { const tTag = adW(a, '40', adW(a, '사십', 2.4)), tB = adW(a, '스티커', 5.6), tS = adW(a, '흔들어', 8.2), up = easeInOut(qdK(tS - 0.55, tS - 0.05, lt));
    const chest = { armR: [[252, 285], [300, 338], [262, 322]], hR: [256, 318] }, arm = adMixArm(chest, adArmEar, up), shake = lt > tS && lt < tS + 1.5 ? Math.sin((lt - tS) * 26) * 13 * Math.sin(Math.PI * qdK(tS, tS + 1.5, lt)) : 0;
    const armL = { armL: [[148, 285], [122, 344], [130, 396]], hL: [130, 404] }, pose = Object.assign({}, P['서기'], arm, armL);
    const ex = fEx(lt > tS + 1.5 ? 'z히죽' : lt > tS - 0.1 ? 'z의심' : lt > tB ? 'z반짝' : 'z기본'), look = lt > tS - 0.3 ? [0.5, -0.5] : lt > tB - 0.3 ? [0.45, 0.5] : [Math.sin(lt * 1.6) * 0.6, -0.2];
    const hp = adPt(zx, y, s, arm.hR[0], arm.hR[1]), lp = adPt(zx, y, s, 130, 404);
    w += qShadow(zx, y, 94, 0.5) + ADZ({ x: zx, y, s, t, pose, ex, look, tilt: 5 * up, seed: 3 }) + adBag(lp[0], lp[1] + 4, 0.92, 6 * Math.sin(t * 1.3), '#FFE7DE') + hand(lp[0], lp[1], 0.7 * s);
    w += adBag(hp[0] + 4, hp[1] - 66 * up, 0.92, lerp(-6, -14, up) + shake) + hand(hp[0], hp[1], 0.7 * s) + adSpark(hp[0], hp[1] + 40, (lt - tB) / 0.5, 90);
    if (lt > tS && lt < tS + 1.5) for (let i = 0; i < 3; i++) w += `<path d="M${f1(hp[0] + 70 + i * 18)} ${f1(hp[1] - 60 + i * 26)} q14 10 0 22" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity="${adOp(0.5 + 0.5 * Math.sin((lt - tS) * 26 + i))}"/>`;
    w = `<g transform="translate(640 150) scale(.8) translate(-640 -150)">${adClock(640, 150, 23, 40)}</g>` + (lt > tTag ? `<g transform="translate(812 150) scale(${f1(lerp(0.3, 1, easeOutBack(qdK(tTag, tTag + 0.3, lt))) * 100) / 100})"><line x1="-112" y1="0" x2="-84" y2="0" stroke="${INK}" stroke-width="5"/>${label(0, 0, '40분 전', { size: 36, bg: '#FFF1C9' })}</g>` : '') + w;
    cam = lt < tB - 0.6 ? qLerpCam(lt / (tB - 0.6), [900, 560, 1.0], [880, 556, 1.06]) : qLerpCam((lt - tB + 0.6) / 1.3, [880, 556, 1.06], [960, 575, 1.5]);
  } else { const tF = adW(a, '넘어지', 1.9), tG = adW(a, '먼저', 5.6), run = easeIn(qdK(tG + 0.35, tG + 1.7, lt)); zx = 900 + 1500 * run;
    const jolt = lt > tF ? 1 + 0.04 * Math.sin((lt - tF) * 10) * Math.exp(-(lt - tF) * 4) : 1, walking = run > 0.001;
    const armL = { armL: [[148, 285], [122, 344], [130, 396]], hL: [130, 404] }, base = walking ? walkPose(zx * 0.04, 1.0) : P['서기'], pose = Object.assign({}, base, adArmEar, walking ? {} : armL);
    const ex = fEx(lt > tF ? 'z당황' : 'z기본'), look = lt > tG ? [0.8, 0] : [0.3, lt > tF ? 0.1 : -0.2];
    const hp = adPt(zx, y, s, 330, 188 + (pose.dy || 0)), lp = adPt(zx, y, s, pose.hL[0], pose.hL[1] + (pose.dy || 0)), sw = walking ? -22 + 10 * Math.sin(zx * 0.04) : 8 * Math.sin(t * 1.3) * (lt > tF ? 0.2 : 1);
    w += qShadow(zx, y, 94, 0.5) + ADZ({ x: zx, y, s, sy: jolt, t, pose, ex, look, seed: 3, still: lt > tF }) + adBags(lp[0], lp[1] + 4, 0.92, sw, 2) + hand(lp[0], lp[1], 0.7 * s) + adPhone(hp[0], hp[1], 1.0) + hand(hp[0] + 2, hp[1] + 26, 0.7 * s);
    cam = qLerpCam(lt / D, [930, 580, 1.36], [900, 590, 1.44]);
    over += adInsetFather(t, (lt - 0.2) / 0.4);
  }
  return adDefs() + qdPlate('store', cam, 0.5) + qCam(cam, w) + over;
}

/* ---------- 7번: 손목 깁스 → 보호자 칸 → 빈 의자와 자동문 ---------- */
function adBed(t, lt, tW, tD) {
  const bx = 1250, by = 900; let g = '';
  g += `<rect x="${bx - 430}" y="${by - 96}" width="26" height="150" rx="8" fill="#AEB8C8" stroke="${INK}" stroke-width="6"/><rect x="${bx + 404}" y="${by - 300}" width="28" height="354" rx="8" fill="#AEB8C8" stroke="${INK}" stroke-width="6"/>`;
  g += `<path d="M${bx + 250} ${by - 120} L${bx + 400} ${by - 330} L${bx + 420} ${by - 120} Z" fill="#fff" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><ellipse cx="${bx + 352}" cy="${by - 262}" rx="74" ry="46" fill="#F6F8FC" stroke="${INK}" stroke-width="6" transform="rotate(-54 ${bx + 352} ${by - 262})"/>`;
  // 할아버지: 등받이에 기대앉음. 다리는 이불 아래
  const x = bx + 236, y = by + 44, s = 0.92, pose = Object.assign({}, P['서기'], { armL: [[148, 285], [112, 338], [148, 386]], hL: [156, 392], armR: [[252, 285], [280, 344], [262, 392]], hR: [258, 398] });
  g += `<g transform="rotate(6 ${x} ${y - 140})">` + ADG({ x, y, s, t, pose, ex: { expr: 'z히죽', prev: 'z히죽', k: 1, blink: 0 }, look: [-0.6, 0.1], seed: 14, tilt: -3 });
  const e = adPt(x, y, s, 112, 338), h = adPt(x, y, s, 156, 392), sh = adPt(x, y, s, 236, 268); // 깁스(팔뚝에서 손까지) + 팔걸이
  g += `<path d="M${f1(sh[0])} ${f1(sh[1])} L${f1(h[0] + 8)} ${f1(h[1] + 6)}" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M${f1(sh[0])} ${f1(sh[1])} L${f1(h[0] + 8)} ${f1(h[1] + 6)}" stroke="#7FA8DC" stroke-width="12" stroke-linecap="round"/>`;
  g += `<line x1="${f1(e[0])}" y1="${f1(e[1])}" x2="${f1(h[0])}" y2="${f1(h[1])}" stroke="${INK}" stroke-width="54" stroke-linecap="round"/><line x1="${f1(e[0])}" y1="${f1(e[1])}" x2="${f1(h[0])}" y2="${f1(h[1])}" stroke="#FFFFFF" stroke-width="40" stroke-linecap="round"/><line x1="${f1(lerp(e[0], h[0], 0.3))}" y1="${f1(lerp(e[1], h[1], 0.3) - 14)}" x2="${f1(lerp(e[0], h[0], 0.3) + 10)}" y2="${f1(lerp(e[1], h[1], 0.3) + 14)}" stroke="#D5D5CF" stroke-width="3"/><line x1="${f1(lerp(e[0], h[0], 0.65))}" y1="${f1(lerp(e[1], h[1], 0.65) - 14)}" x2="${f1(lerp(e[0], h[0], 0.65) + 10)}" y2="${f1(lerp(e[1], h[1], 0.65) + 14)}" stroke="#D5D5CF" stroke-width="3"/>`;
  g += adSpark(h[0] - 10, h[1] - 16, (lt - tW) / 0.55, 80) + `</g>`;
  g += `<path d="M${bx - 410} ${by - 86} Q${bx - 100} ${by - 130} ${bx + 180} ${by - 96} Q${bx + 330} ${by - 110} ${bx + 410} ${by - 60} L${bx + 410} ${by + 4} L${bx - 410} ${by + 4} Z" fill="#BFD9F2" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M${bx - 340} ${by - 50} Q${bx - 60} ${by - 86} ${bx + 220} ${by - 54}" fill="none" stroke="#fff" stroke-width="7" opacity=".5"/>`;
  g += `<rect x="${bx - 440}" y="${by}" width="880" height="34" rx="12" fill="#E3E8F1" stroke="${INK}" stroke-width="7"/><line x1="${bx - 390}" y1="${by + 34}" x2="${bx - 390}" y2="${by + 64}" stroke="${INK}" stroke-width="9"/><line x1="${bx + 390}" y1="${by + 34}" x2="${bx + 390}" y2="${by + 64}" stroke="${INK}" stroke-width="9"/><circle cx="${bx - 390}" cy="${by + 72}" r="12" fill="#5B6270"/><circle cx="${bx + 390}" cy="${by + 72}" r="12" fill="#5B6270"/>`;
  // 침대 발치의 기록판과 꼬리표
  g += adClip(bx - 417, by - 20, 0.72, 4);
  if (lt > tD) g += `<g transform="translate(${bx - 360} ${by - 170}) scale(${f1(lerp(0.3, 1, easeOutBack(qdK(tD, tD + 0.3, lt))) * 100) / 100})"><line x1="-40" y1="26" x2="-56" y2="92" stroke="${INK}" stroke-width="5"/>${label(0, 0, '하루 지켜보기', { size: 34, bg: '#FFF1C9' })}</g>`;
  return g;
}
function adFormPov(t, lt, tBox, tName) {
  const glow = qdK(tBox - 0.1, tBox + 0.4, lt), wr = qdK(tName + 0.35, tName + 2.3, lt), z = lerp(1.0, 1.07, easeInOut(qdK(0, tName + 2.5, lt)));
  let g = `<rect x="-300" y="-200" width="2600" height="1500" fill="url(#adDesk)"/><g transform="translate(1040 610) scale(${f1(z * 1000) / 1000}) translate(-1040 -610)">`;
  g += `<g transform="rotate(-3 960 560)"><rect x="470" y="90" width="980" height="1120" rx="26" fill="#B9895A" stroke="${INK}" stroke-width="10"/><rect x="820" y="56" width="280" height="84" rx="18" fill="#8E97A6" stroke="${INK}" stroke-width="8"/><rect x="520" y="160" width="880" height="1040" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
  g += `<rect x="580" y="216" width="330" height="34" rx="8" fill="#9AA3B4"/>`;
  for (let i = 0; i < 4; i++) g += `<rect x="580" y="${300 + i * 56}" width="${[700, 560, 660, 420][i]}" height="18" rx="9" fill="#D9DEE8"/>`;
  // 보호자 칸
  g += `<ellipse cx="960" cy="640" rx="${f1(520 * glow)}" ry="${f1(150 * glow)}" fill="url(#adWarm)" opacity="${adOp(glow * 0.9)}"/><rect x="580" y="570" width="760" height="140" rx="12" fill="${glow > 0.5 ? '#FFFBEA' : '#fff'}" stroke="${INK}" stroke-width="7"/><rect x="580" y="570" width="210" height="140" rx="12" fill="#E8EDF6" stroke="${INK}" stroke-width="7"/>${fT(685, 660, '보호자', 54, NAVY)}<line x1="830" y1="676" x2="1300" y2="676" stroke="#B8BECB" stroke-width="4"/>`;
  g += `<rect x="580" y="740" width="210" height="96" rx="12" fill="#E8EDF6" stroke="${INK}" stroke-width="5"/>${fT(685, 804, '관계', 40, '#5B6270', { w: 700 })}<rect x="790" y="740" width="300" height="96" rx="12" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
  if (lt > tName + 2.5) g += `<g opacity="${adOp(qdK(tName + 2.5, tName + 2.9, lt))}">${fT(940, 806, '손자', 46, '#2B3A8C', { w: 700 })}</g>`;
  for (let i = 0; i < 3; i++) g += `<rect x="580" y="${890 + i * 56}" width="${[640, 700, 380][i]}" height="18" rx="9" fill="#D9DEE8"/>`;
  // 이름(읽히지 않는 흘림 글씨)
  const N = 46, x0 = 850, x1 = 1230; let d = ''; const n = Math.floor(N * wr);
  for (let i = 0; i <= n; i++) { const u = i / N, X = lerp(x0, x1, u), Y = 648 + Math.sin(u * 30) * 16 * (0.6 + 0.4 * Math.sin(u * 7)) - 6 * Math.sin(u * 3); d += (i ? 'L' : 'M') + f1(X) + ' ' + f1(Y); }
  if (n > 0) g += `<path d="${d}" fill="none" stroke="#2B3A8C" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  g += `</g>`;
  // 펜과 두 손(제로 시점)
  const wait = lt < tName + 0.35, tr = wait ? Math.sin(lt * 17) * 2.5 * qdK(tBox, tBox + 0.4, lt) : 0, u = n / N;
  const px = wr > 0 ? lerp(x0, x1, u) - 16 : lerp(1000, 842, easeInOut(qdK(tBox - 0.6, tBox + 0.2, lt))) + tr, py = wr > 0 ? 648 + Math.sin(u * 30) * 14 - 12 : lerp(560, 630, easeInOut(qdK(tName - 0.1, tName + 0.35, lt))) + tr;
  g += `<g transform="translate(${f1(px)} ${f1(py)}) rotate(32)"><rect x="-9" y="-250" width="18" height="226" rx="8" fill="#3D5AA8" stroke="${INK}" stroke-width="5"/><path d="M-9 -26 L0 0 L9 -26 Z" fill="#E9EEF9" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="-11" y="-250" width="22" height="26" rx="8" fill="#2B3A8C" stroke="${INK}" stroke-width="5"/></g>`;
  g += hand(px + 78, py + 108, 2.5) + `<path d="M${f1(px + 120)} ${f1(py + 160)} L${f1(px + 420)} ${f1(py + 620)}" stroke="${INK}" stroke-width="92" stroke-linecap="round"/><path d="M${f1(px + 120)} ${f1(py + 160)} L${f1(px + 420)} ${f1(py + 620)}" stroke="#F4F4F8" stroke-width="76" stroke-linecap="round"/>`;
  g += `<path d="M430 1010 L250 1500" stroke="${INK}" stroke-width="92" stroke-linecap="round"/><path d="M430 1010 L250 1500" stroke="#F4F4F8" stroke-width="76" stroke-linecap="round"/>` + hand(452, 960, 2.5);
  return g + `</g>`;
}
function adformScene(t, lt0, a) {
  const L = adL('n2'), ws = L.words, lt = t - (L.t0 - 0.15), y = AD.GY;
  const tW = adWd(ws, '손목', 1.0), tD = adWd(ws, '하루', 2.8), tF = adWd(ws, '서류', 5.4) - 0.4, tBox = adWd(ws, '보호자', 8.4), tName = adWd(ws, '이름', 9.9), tBack = adWd(ws, '뒤가', 12.9) - 0.7, tA = adWd(ws, '어른이', 14.9);
  if (lt < tF) { const ex = lt > tW + 0.3 ? 'z히죽' : 'z울먹', rel = lt > tW ? 1 - 0.035 * Math.sin(Math.PI * qdK(tW, tW + 0.9, lt)) : 1, cam = qLerpCam(lt / tF, [1000, 540, 1.06], [1230, 550, 1.42]);
    const w = adBed(t, lt, tW, tD) + qShadow(560, y, 90, 0.5) + ADZ({ x: 560, y, s: 0.95, sy: rel, t, pose: '서기', ex: fEx(ex), look: [0.85, -0.1], seed: 3 });
    return adDefs() + qdPlate('bay', cam, 0.5) + qCam(cam, w) + fFull('#fff', Math.max(0, (lt - tF + 0.25) / 0.25) * 0.85); }
  if (lt < tBack) return adDefs() + adFormPov(t, lt - tF, tBox - tF, tName - tF) + fFull('#fff', Math.max(0, 1 - (lt - tF) / 0.3) * 0.85 + Math.max(0, (lt - tBack + 0.25) / 0.25) * 0.85);
  // 접수대 앞의 제로가 한 번 더 뒤를 본다 → 빈 의자와 자동문
  const u = lt - tBack, zx = 1160, s = AD.S, k = easeInOut(qdK(0.5, 0.95, u)), sx = 1 - 0.14 * Math.sin(Math.PI * qdK(0.5, 0.95, u));
  const pose = Object.assign({}, P['서기'], { armR: [[252, 285], [300, 338], [262, 322]], hR: [256, 318] }), hp = adPt(zx, y, s, 256, 318);
  const c = easeInOut(qdK(1.0, tA - tBack + 1.2, u)), cam = [lerp(1130, 800, c), lerp(555, 545, c), lerp(1.3, 1.06, c)];
  let w = adNurse(t, { look: [-0.3, 0.5] }) + qShadow(zx, y, 92, 0.5) + ADZ({ x: zx, y, s, sx, t, pose, ex: fEx('z멍'), look: [lerp(0.6, -1.5, k), 0.05], tilt: -10 * k, seed: 3, still: true });
  w += `<g transform="translate(${f1(hp[0] + 6)} ${f1(hp[1] - 6)}) rotate(28)"><rect x="-5" y="-70" width="10" height="74" rx="4" fill="#3D5AA8" stroke="${INK}" stroke-width="4"/></g>` + hand(hp[0], hp[1], 0.7 * s);
  const g = qdK(tA - tBack, tA - tBack + 1.2, u);
  w = `<ellipse cx="320" cy="560" rx="270" ry="380" fill="url(#adWarm)" opacity="${adOp(g * 0.5)}"/>` + w;
  return adDefs() + qdPlate('er', cam, 0.5) + qCam(cam, w) + fFull('#fff', Math.max(0, 1 - u / 0.3) * 0.85);
}
