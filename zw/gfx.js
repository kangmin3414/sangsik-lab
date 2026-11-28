/* 제로의 세계 — 몰입 층(gfx). zw/gf.js 뒤에 읽는다. 새 이름은 모두 gfx 접두사. 엔진 본체(shorts/engine.js)·연기 층(act)·게임 감각 층(gf)은 건드리지 않는다.
   운영자(2026-11-22): "몰입감 있게 만들어 줘, 애니메이션 엔진도 향상시키고 재미있게."
   2026-11-14 엔진 점검에서 '실제로 없는 것'으로 남아 있던 빛·깊이·샷 문법을 채우고, 말하는 연기와 타격감을 한 층으로 묶는다.
     1. 화면 좌표와 카메라: gfxScreen · gfxCam(샷 키) · gfxDrift(숨 쉬는 카메라) · gfxShake · gfxLayer(깊이 + 초점 흐림) · gfxProj
     2. 빛: gfxLightDef(주변 빛 + 방향 있는 주광 + 테두리 빛을 한 필터로) · gfxLit · gfxCast(벽·바닥 그림자) · gfxGlow · gfxShafts(빛줄기) · gfxDust(먼지) · gfxGrade(색 보정) · gfxVignette
     3. 말하는 연기: gfxVoice · gfxFace(발음에 맞는 입 + 이 + 혀 + 눈썹) · gfxTalkAct · gfxListenAct
     4. 타격감: gfxStop(멈칫) · gfxImpact(충격 프레임) · gfxSticker · gfxSlap · gfxPeel(스티커처럼 넘어가는 전환)
   전/후 비교: window.GFX_OFF = 1 이면 빛·그림자·공기(빛줄기·먼지·번짐)·색 보정·초점 흐림을 끈다(카메라와 연기는 그대로).
   쓰는 법은 zw/GFX.md, 실제 예는 milinda01/long/mlgf.js. 모든 함수는 시각 t만으로 계산한다(프레임을 나눠 병렬 렌더해도 결과가 같다). */

/* ---------- 1. 화면 좌표와 카메라 ---------- */
// render()는 장면을 (960,100) 기준 0.88배로 그린다. gfxScreen 안에서는 1920×1080 화면 좌표를 그대로 쓴다(HUD·카메라·조명이 같은 좌표계).
const gfxScreen = inner => { window.GFX_MARKS = window._gfxMk2 || []; window._gfxMk2 = null; window._gfxMk = []; window.GFX_LOOKS = window._gfxLk || {}; window._gfxLk = {}; window.GFX_MOOD = window._gfxMw == null ? null : window._gfxMw; window._gfxMw = null; return `<g transform="translate(960 100) scale(${1 / 0.88}) translate(-960 -100)">${inner}</g>`; };
/* 점검용 표시: 인물 머리 같은 '화면 끝에 조금만 걸치면 안 되는 것'을 세계 좌표의 원으로 등록한다(그림에는 아무것도 더하지 않는다).
   장면이 카메라를 정한 뒤 gfxMarksProject(cam)을 부르면 그 프레임의 화면 좌표가 window.GFX_MARKS = [{ n, x, y, r, l(왼쪽 반지름), rt(오른쪽 반지름) }]에 남는다 → edge_*.py가 프레임마다 읽어 '화면 끝 조각'을 찾는다. */
const gfxMark = (name, x, y, r, depth = 1) => { (window._gfxMk = window._gfxMk || []).push([name, x, y, r, depth]); };
// 그 프레임에 그리지 않는 인물(한 사람 샷에서 hide한 상대)의 표시를 지운다. 안 그러면 edge_*.py가 화면에 없는 머리를 '조각'으로 센다
const gfxUnmark = name => { window._gfxMk = (window._gfxMk || []).filter(m => m[0] !== name); };
const gfxMarksProject = cam => { window.GFX_CAM = { x: Math.round(cam.x), y: Math.round(cam.y), z: Math.round(cam.z * 1000) / 1000, f: Math.round((cam.f == null ? 1 : cam.f) * 100) / 100, p: Math.round((cam.p || 0) * 100) / 100 }; window._gfxMk2 = (window._gfxMk || []).map(([n, x, y, r, d]) => { const p = gfxProj(cam, x, y, d), z = 1 + (cam.z - 1) * d, rr = Array.isArray(r) ? r : [r, r];      // r = [왼쪽, 오른쪽]이면 좌우가 다른 것(한쪽으로 날리는 머리띠 끝 등)
  return { n, x: Math.round(p[0]), y: Math.round(p[1]), r: Math.round(Math.max(rr[0], rr[1]) * z), l: Math.round(rr[0] * z), rt: Math.round(rr[1] * z) }; }); };
const _gfxEase = { io: easeInOut, out: easeOut, in: easeIn, lin: k => k, back: easeOutBack };
/* 샷 키로 카메라를 만든다. keys = [[t, {x, y, z, r, f, p}, {d: 걸리는 초, ease: 'io'|'out'|'in'|'lin'|'back'|'cut'}], …] → { x, y, z, r, f, p }
   x·y는 화면 가운데에 올 세계 좌표, z는 확대(1 = 그대로), r은 기울기(도). 줌은 곱으로 보간해서 속도가 고르게 느껴진다.
   f는 초점 거리(기본 1 = 인물 평면. gfxFocus가 이 값에서 먼 층을 흐린다 → f만 바꾸는 키를 넣으면 초점이 넘어간다), p는 높낮이 각도(+ 올려다봄, − 내려다봄. gfxCamT 참고).
   앞 키가 아직 움직이는 중에 다른 값만 바꾸는 키(f만, p만)를 겹쳐 넣어도 된다: 키에 적지 않은 값은 앞 키의 움직임을 그대로 따른다. */
function gfxCam(keys, t) {
  let c = Object.assign({ x: 960, y: 540, z: 1, r: 0, f: 1, p: 0 }, keys[0][1]);
  for (let i = 1; i < keys.length; i++) { const [t0, to, o = {}] = keys[i]; if (t < t0) break;
    const d = o.ease === 'cut' ? 0 : (o.d == null ? 0.8 : o.d), g = Object.assign({}, c, to), k = d <= 0 ? 1 : (_gfxEase[o.ease] || easeInOut)(clamp((t - t0) / d, 0, 1));
    c = { x: lerp(c.x, g.x, k), y: lerp(c.y, g.y, k), z: c.z * Math.pow(g.z / c.z, k), r: lerp(c.r, g.r, k), f: lerp(c.f, g.f, k), p: lerp(c.p, g.p, k) }; }
  return c;
}
// 숨 쉬는 카메라: 손으로 든 것처럼 아주 조금 떠다닌다(amp 화면 픽셀). 정지 화면이 죽어 보이지 않게 모든 샷에 얹는다.
const gfxDrift = (c, t, amp = 3, seed = 0) => Object.assign({}, c, { x: c.x + amp / c.z * (Math.sin(t * 0.41 + seed) + 0.5 * Math.sin(t * 0.97 + seed * 2.3)), y: c.y + amp * 0.7 / c.z * (Math.sin(t * 0.33 + seed * 1.7 + 1) + 0.5 * Math.sin(t * 0.79 + seed)), r: c.r + amp * 0.03 * Math.sin(t * 0.27 + seed * 3.1) });
// 충격 흔들림: hits = [[t0, 세기(px), 길이(초)], …]
function gfxShake(c, t, hits) { let dx = 0, dy = 0; for (const [t0, amp = 12, d = 0.3] of hits) { const u = t - t0; if (u < 0 || u > d) continue; const k = amp * Math.pow(1 - u / d, 2); dx += Math.sin(u * 82) * k; dy += Math.cos(u * 67) * k * 0.7; } return Object.assign({}, c, { x: c.x + dx / c.z, y: c.y + dy / c.z }); }
// 카메라 변환. depth 1 = 인물과 같은 평면, 0.3 = 먼 산(덜 움직이고 덜 커진다), 1.4 = 카메라 바로 앞(더 많이 움직인다)
// 높낮이 각도 c.p: 올려다보면(+) 먼 층이 화면 아래로 내려가고(지평선이 낮아진다) 카메라 앞 층은 위로 올라간다 → 인물이 솟아 보인다. 내려다보면(−) 반대. 인물 평면(depth 1)은 그대로다.
const GFX_PITCH = 240;
const gfxCamT = (c, depth = 1) => { const z = 1 + (c.z - 1) * depth, x = 960 + (c.x - 960) * depth, y = 540 + (c.y - 540) * depth; return `${c.p && depth !== 1 ? `translate(0 ${f1(c.p * (1 - depth) * GFX_PITCH)}) ` : ''}translate(960 540)${c.r ? ` rotate(${f1(c.r * depth * 100) / 100})` : ''} scale(${Math.round(z * 10000) / 10000}) translate(${f1(-x)} ${f1(-y)})`; };
// 깊이 층. o.blur: 초점 밖 흐림 세기(0·2·4·7·12 가운데 하나, gfxDefs가 필터를 만든다), o.op: 투명도
// 필터는 카메라 변환 바깥(화면 좌표)에 건다: 카메라가 멀리 가도 필터 영역이 화면을 벗어나지 않고, 흐림 크기도 확대와 무관하게 같다.
// 흐림은 2·4·7·12면 gfxDefs의 필터를 쓰고, 그 밖의 값(초점이 넘어가는 동안의 중간값)은 그 자리에서 필터를 만든다(0.5 단위).
const _gfxBF = b => [2, 4, 7, 12].includes(b) ? ['', 'gfxB' + b] : [`<filter id="gfxBq${Math.round(b * 2)}" x="-60" y="-60" width="2040" height="1200" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="${Math.round(b * 2) / 2}"/></filter>`, 'gfxBq' + Math.round(b * 2)];
const gfxLayer = (c, depth, inner, o = {}) => { const g = `<g transform="${gfxCamT(c, depth)}">${inner}</g>`, op = o.op != null && o.op < 1 ? ` opacity="${f1(o.op * 100) / 100}"` : ''; if (o.blur && !window.GFX_OFF) { const [df, id] = _gfxBF(o.blur); return `${df}<g filter="url(#${id})"${op}>${g}</g>`; } return op ? `<g${op}>${g}</g>` : g; };
// 세계 좌표 → 화면 좌표(조명 위치·HUD 꼬리표를 인물에 맞출 때). 기울기 r은 작다고 보고 무시한다.
const gfxProj = (c, x, y, depth = 1) => { const z = 1 + (c.z - 1) * depth, cx = 960 + (c.x - 960) * depth, cy = 540 + (c.y - 540) * depth; return [960 + (x - cx) * z, 540 + (y - cy) * z + (c.p || 0) * (1 - depth) * GFX_PITCH]; };

/* ---------- 2. 빛 ---------- */
const _gfxRGB = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16) / 255);
/* 조명 필터(화면 좌표). 인물·소품 층에 gfxLit으로 씌운다. 배경은 처음부터 그 색으로 그리고 gfxGlow로 빛 웅덩이만 얹는다(필터가 싸다).
   L = { id, amb: '#667' 그늘에서 곱해지는 색, key: { x, y, z(높이: 클수록 넓게 퍼짐), col, k(세기) }, rim: { dx, dy, col, k } 빛이 오는 쪽 가장자리, bump: 모서리 둥글림(px), relief: 볼록한 정도 }
   원리: 알파를 흐려 높이 지도로 삼고 점광원으로 비춘다 → 가까운 곳이 밝고 가장자리가 둥글게 살아난다(스티커 같던 인물에 부피가 생긴다). */
function gfxLightDef(L) {
  const a = _gfxRGB(L.amb || '#8088A8'), K = L.key, R = L.rim; let h = `<filter id="${L.id}" x="-40" y="-40" width="2000" height="1160" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">`;
  h += `<feColorMatrix in="SourceGraphic" type="matrix" values="${a[0]} 0 0 0 0  0 ${a[1]} 0 0 0  0 0 ${a[2]} 0 0  0 0 0 1 0" result="am"/>`;
  if (K) h += `<feGaussianBlur in="SourceAlpha" stdDeviation="${L.bump || 5}" result="hm"/><feDiffuseLighting in="hm" surfaceScale="${L.relief == null ? 9 : L.relief}" diffuseConstant="${K.k == null ? 1 : K.k}" lighting-color="${K.col || '#FFF2D8'}" result="dl"><fePointLight x="${f1(K.x)}" y="${f1(K.y)}" z="${f1(K.z || 260)}"/></feDiffuseLighting>` +
    `<feComposite in="SourceGraphic" in2="dl" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="kd"/><feComposite in="am" in2="kd" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="sm"/><feComposite in="sm" in2="SourceAlpha" operator="in" result="lit"/>`;
  else h += `<feComposite in="am" in2="SourceAlpha" operator="in" result="lit"/>`;
  if (R) h += `<feOffset in="SourceAlpha" dx="${f1(-R.dx)}" dy="${f1(-R.dy)}" result="so"/><feComposite in="SourceAlpha" in2="so" operator="out" result="ed"/><feFlood flood-color="${R.col || '#FFE9B8'}" flood-opacity="${R.k == null ? 0.8 : R.k}" result="rc"/><feComposite in="rc" in2="ed" operator="in" result="ri"/><feGaussianBlur in="ri" stdDeviation="${R.soft == null ? 1.6 : R.soft}" result="rb"/><feComposite in="rb" in2="SourceAlpha" operator="in" result="rr"/><feBlend in="rr" in2="lit" mode="screen"/>`;
  return h + `</filter>`;
}
const gfxLit = (id, inner) => window.GFX_OFF ? `<g>${inner}</g>` : `<g filter="url(#${id})">${inner}</g>`;
/* 드리운 그림자: 같은 그림을 한 번 더, 검게 물들이고 흐려서 그린다. 인물이 배경에 붙어 있다는 느낌(깊이)을 준다.
   벽 그림자: gfxCast(inner, { cam, dx, dy, s, cx, cy })  — 빛 반대쪽으로 밀고 조금 키운다.
   바닥 그림자: gfxCast(inner, { cam, floor: 발 높이 y, skew: 기울기(도), len: 길이 비율 }) — 발 선을 축으로 눕힌다. */
function gfxCast(inner, o = {}) {
  if (window.GFX_OFF) return '';
  const f = `filter="url(#gfxSh${o.soft || 2})" opacity="${o.op == null ? 0.3 : o.op}"`, ct = o.cam ? `<g transform="${gfxCamT(o.cam, o.depth || 1)}">` : '<g>';   // o.cam을 주면 세계 좌표의 그림을 받아 화면 좌표에서 흐린다
  if (o.floor != null) return `<g ${f}>${ct}<g transform="translate(0 ${f1(o.floor)}) skewX(${f1(o.skew == null ? -35 : o.skew)}) scale(1 ${f1(-(o.len == null ? 0.45 : o.len) * 100) / 100}) translate(0 ${f1(-o.floor)})">${inner}</g></g></g>`;
  const sc = o.s || 1.06, cx = o.cx == null ? 960 : o.cx, cy = o.cy == null ? 540 : o.cy;
  return `<g ${f}>${ct}<g transform="translate(${f1((o.dx || 0) + cx)} ${f1((o.dy || 0) + cy)}) scale(${sc}) translate(${f1(-cx)} ${f1(-cy)})">${inner}</g></g></g>`;
}
// 빛 번짐(광원·화면·창): 같은 색이면 같은 그라디언트를 쓴다. blend 'screen'이면 뒤 그림을 밝힌다.
const gfxGlow = (x, y, r, col = '#FFF3B8', op = 0.8, o = {}) => { if (window.GFX_OFF) return ''; const id = 'gfxG' + col.slice(1); return `<radialGradient id="${id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${col}" stop-opacity="1"/><stop offset=".45" stop-color="${col}" stop-opacity=".42"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * (o.ry || 1))}" fill="url(#${id})" opacity="${f1(op * 100) / 100}"${o.blend === false || window.GFX_NOBLEND ? '' : ' style="mix-blend-mode:screen"'}/>`; };
/* 빛줄기: (x, y)에서 ang(도, 0 = 아래) 쪽으로 n개. 창살·나뭇잎 사이로 드는 빛. 천천히 숨 쉰다. */
function gfxShafts(t, o = {}) { if (window.GFX_OFF) return ''; const n = o.n || 4, w = o.w || 90, gap = o.gap || 150, len = o.len || 900, col = o.col || '#FFF1C4', id = 'gfxS' + col.slice(1);
  let h = `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".9"/><stop offset=".7" stop-color="${col}" stop-opacity=".25"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient><g transform="translate(${f1(o.x || 0)} ${f1(o.y || 0)}) rotate(${f1(o.ang == null ? 24 : o.ang)})"${window.GFX_NOBLEND ? '' : ' style="mix-blend-mode:screen"'}>`;
  for (let i = 0; i < n; i++) { const k = 0.72 + 0.28 * Math.sin(t * 0.5 + i * 1.9 + (o.seed || 0)), ww = w * (0.6 + 0.8 * hash(i * 3.3 + (o.seed || 0))); h += `<path d="M${f1(i * gap)} 0 L${f1(i * gap + ww)} 0 L${f1(i * gap + ww * (o.spread || 1.9))} ${len} L${f1(i * gap - ww * ((o.spread || 1.9) - 1))} ${len} Z" fill="url(#${id})" opacity="${f1((o.op == null ? 0.3 : o.op) * k * 100) / 100}"/>`; }
  return h + `</g>`; }
// 빛 속을 떠다니는 먼지. box = [x, y, w, h]
function gfxDust(t, o = {}) { if (window.GFX_OFF) return ''; const [bx, by, bw, bh] = o.box || [0, 0, 1920, 1080], n = o.n || 40, sd = o.seed || 0, col = o.col || '#FFF6D8'; let h = '';
  for (let i = 0; i < n; i++) { const a = hash(sd + i * 1.31), b = hash(sd + i * 2.77), c = hash(sd + i * 4.19), sp = 6 + 16 * c, x = bx + ((a * bw + t * sp * (0.4 + b)) % bw), y = by + ((b * bh + Math.sin(t * 0.3 + i) * 18 - t * sp * 0.35 + 5 * bh) % bh), r = 1.4 + 3.6 * c * c, tw = 0.35 + 0.65 * Math.abs(Math.sin(t * (0.6 + a) + i * 2.1));
    h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${col}" opacity="${f1((o.op == null ? 0.7 : o.op) * tw * (0.4 + 0.6 * c) * 100) / 100}"/>`; }
  return window.GFX_NOBLEND ? `<g>${h}</g>` : `<g style="mix-blend-mode:screen">${h}</g>`; }
/* 색 보정(화면 전체에 얹는 덮개, 화면 좌표): 필터 대신 섞기 모드를 써서 싸다. k로 세기를 조절하면 장면 안에서 시간이 흐르는 것도 그릴 수 있다. */
const GFX_GRADE = { night: [['multiply', '#7C8FD0', 0.55], ['screen', '#101B4A', 0.22]], cool: [['multiply', '#C5D6F2', 0.5], ['screen', '#0F2040', 0.1]], warm: [['multiply', '#FFE3B5', 0.55], ['screen', '#40200A', 0.1]], gold: [['multiply', '#FFD79A', 0.6], ['screen', '#4A1E08', 0.16]], old: [['multiply', '#F2D9A8', 0.7], ['screen', '#3A2412', 0.2]], dawn: [['multiply', '#FFD2C2', 0.45], ['screen', '#1E2A5A', 0.14]] };
const GFX_FLAT = { night: ['#16225A', 0.3], cool: ['#BFD3F2', 0.1], warm: ['#FFD9A0', 0.1], gold: ['#FFB25C', 0.13], old: ['#D9B37A', 0.2], dawn: ['#FFC4B0', 0.1] };   // 섞기 모드를 끈 빠른 길(window.GFX_NOBLEND): 색 한 겹
const gfxGrade = (kind, k = 1) => window.GFX_OFF ? '' : window.GFX_NOBLEND ? (GFX_FLAT[kind] ? `<rect x="-40" y="-40" width="2000" height="1160" fill="${GFX_FLAT[kind][0]}" opacity="${f1(GFX_FLAT[kind][1] * k * 100) / 100}"/>` : '') : (GFX_GRADE[kind] || []).map(([m, c, a]) => `<rect x="-40" y="-40" width="2000" height="1160" fill="${c}" opacity="${f1(a * k * 100) / 100}" style="mix-blend-mode:${m}"/>`).join('');
const gfxVignette = (k = 0.5, col = '#060A1C') => window.GFX_OFF ? '' : `<radialGradient id="gfxV${col.slice(1)}" cx=".5" cy=".5" r=".75"><stop offset=".52" stop-color="${col}" stop-opacity="0"/><stop offset="1" stop-color="${col}" stop-opacity="1"/></radialGradient><rect x="-40" y="-40" width="2000" height="1160" fill="url(#gfxV${col.slice(1)})" opacity="${f1(k * 100) / 100}"/>`;
/* 층에 쓸 필터 묶음: 초점 흐림(gfxB2·4·7·12), 그림자(gfxSh1·2·3 = 또렷·보통·퍼짐), 움직임 번짐(gfxMx: 가로), lights: gfxLightDef에 넘길 조명들 */
function gfxDefs(o = {}) { const sc = _gfxRGB(o.shadow || '#101630');
  return `<defs>` + [2, 4, 7, 12].map(b => `<filter id="gfxB${b}" x="-60" y="-60" width="2040" height="1200" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="${b}"/></filter>`).join('') +
    [[1, 4], [2, 9], [3, 18]].map(([i, b]) => `<filter id="gfxSh${i}" x="-200" y="-200" width="2320" height="1480" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 ${sc[0]}  0 0 0 0 ${sc[1]}  0 0 0 0 ${sc[2]}  0 0 0 1 0"/><feGaussianBlur stdDeviation="${b}"/></filter>`).join('') +
    `<filter id="gfxMx" x="-200" y="-60" width="2320" height="1200" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="${o.mx || 22} 0"/></filter>` +
    (o.lights || []).map(gfxLightDef).join('') + `</defs>`; }

/* ---------- 3. 말하는 연기 ---------- */
// 지금 이 목소리(v)가 말하고 있으면 { line, e(목소리 크기 0~1), u(줄 시작부터의 초) }, 아니면 null. TL.env는 gen_tl이 넣는 24fps 음량.
const gfxVoice = (t, v) => { const l = actLineAt(t); if (!l || l.v !== v || t > l.t1 + 0.12) return null; return { line: l, e: clamp(((window.TL && TL.env || [])[Math.floor(t * 24)] || 0) * 1.15, 0, 1), u: t - l.t0 }; };
// 입 안: 크게 벌리면 윗니, 더 크게 벌리면 혀가 보인다(머리 좌표, 입 중심 200,238)
const gfxMouthIn = (rx, ry) => (ry >= 6.5 ? `<path d="M${f1(200 - rx * 0.78)} ${f1(238 - ry * 0.5)} Q200 ${f1(238 - ry * 1.02)} ${f1(200 + rx * 0.78)} ${f1(238 - ry * 0.5)} Q200 ${f1(238 - ry * 0.3)} ${f1(200 - rx * 0.78)} ${f1(238 - ry * 0.5)} Z" fill="#fff"/>` : '') + (ry >= 9.5 ? `<ellipse cx="200" cy="${f1(238 + ry * 0.52)}" rx="${f1(rx * 0.56)}" ry="${f1(ry * 0.36)}" fill="#FF8FA3"/>` : '');
/* 표정 base 위에 지금 발음의 입(모음에 따라 모양이 다름: act.js의 actMouthShape) + 이·혀 + 강세에서 올라가는 눈썹을 얹어 E[key]에 넣고 fEx(key)를 돌려준다.
   말하지 않을 때는 base 그대로. 인물마다 key를 다르게 준다(같은 프레임에 두 사람이 말하는 표정을 따로 가질 수 있게). */
function gfxFace(key, base, t, v, o = {}) {
  const B = E[base] || E['z기본'], s = v ? gfxVoice(t, v) : null; let ex = B;
  if (s) { const m = actMouthShape(s.line.words, s.u, s.e), up = (o.brow == null ? 5 : o.brow) * s.e;
    ex = Object.assign({}, B, { bL: B.bL.map((q, i) => i % 2 ? q - up : q), bR: B.bR.map((q, i) => i % 2 ? q - up : q) });
    if (m) { const rx = m[0] * (o.mouth || 1), ry = m[1] * (o.mouth || 1), bf = B.fx; Object.assign(ex, { mouth: ell(200, 238, f1(rx), f1(ry)), mouthFill: '#5A1E2A', fx: (tt, lk) => (typeof bf === 'function' ? bf(tt, lk) : (bf || '')) + gfxMouthIn(rx, ry) }); } }
  E[key] = ex; return fEx(key);
}
// 말하는 몸: 큰 소리에 고개가 살짝 들리고 까딱인다, 말 시작 전 들숨 → char()에 줄 { headDy, tilt, sy }
function gfxTalkAct(t, v, seed = 0) { const s = gfxVoice(t, v); if (!s) { const l = (window.TL && TL.lines || []).find(x => x.v === v && t < x.t0 && t > x.t0 - 0.4); return { headDy: 0, tilt: 0, sy: l ? actInhale(t, l.t0, 0.3, 0.03) : 1, e: 0 }; }
  return { headDy: -6 * s.e, tilt: 2.2 * Math.sin(s.u * 3.1 + seed) * (0.4 + 0.6 * s.e), sy: 1 + 0.012 * s.e, e: s.e }; }
// 듣는 몸: 가끔 느리게 끄덕인다(seed마다 박자가 다르다) → { headDy, tilt }
const gfxListenAct = (t, seed = 0, per = 2.6) => { const u = (t + seed * 1.37) % per; return { headDy: u < 0.5 ? 7 * Math.pow(Math.sin(Math.PI * u / 0.5), 2) : 0, tilt: 1.2 * Math.sin(t * 0.6 + seed) }; };

/* ---------- 4. 타격감 ---------- */
/* 멈칫(히트스톱): 연기 시계를 hits에서 d초 멈췄다가 r초 동안 따라잡는다. 소리는 그대로 흐르므로 '쾅' 하는 순간 그림만 얼어붙는다.
   hits = [[t0, d = 0.1, r = 0.25], …] → 장면이 연기에 쓸 시각 */
function gfxStop(t, hits) { let tt = t; for (const [t0, d = 0.1, r = 0.25] of hits) { if (t <= t0) continue; if (t < t0 + d) tt -= (t - t0); else if (t < t0 + d + r) tt -= d * (1 - easeOut((t - t0 - d) / r)); } return tt; }
// 충격 프레임(화면 좌표): 한 프레임 번쩍 + 바깥으로 튀는 선 + 고리. 스티커를 '탁' 붙이는 순간, 부품이 '철컥' 맞는 순간에.
function gfxImpact(t, t0, x, y, o = {}) { const u = t - t0; if (u < 0 || u > 0.34) return ''; const col = o.col || '#fff', n = o.n || 12, R = o.r || 150; let h = '';
  if (u < 0.045 && o.flash !== false) h += `<rect x="-40" y="-40" width="2000" height="1160" fill="${col}" opacity="${o.flash == null ? 0.5 : o.flash}"/>`;
  const k = u / 0.34, r0 = R * (0.35 + 0.9 * easeOut(k)), r1 = r0 + R * 0.55 * (1 - k);
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + hash(i * 7.1 + t0) * 0.4, w = 5 + 8 * hash(i * 3.7 + t0); h += `<line x1="${f1(x + Math.cos(a) * r0)}" y1="${f1(y + Math.sin(a) * r0)}" x2="${f1(x + Math.cos(a) * r1)}" y2="${f1(y + Math.sin(a) * r1)}" stroke="${col}" stroke-width="${f1(w * (1 - k))}" stroke-linecap="round"/>`; }
  return h + `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(R * (0.3 + 0.8 * easeOut(k)))}" fill="none" stroke="${col}" stroke-width="${f1(10 * (1 - k))}" opacity="${f1((1 - k) * 100) / 100}"/>`; }
/* 스티커(이름 딱지): 원점 가운데. o = { fs, bg, ink, band(왼쪽 색 띠), peel(0~1: 오른쪽 위 귀퉁이가 들뜬 정도), w(너비를 직접) }
   글자는 한 줄 또는 두 줄(배열). 테두리가 굵고 모서리가 둥글어 멀리서도 읽힌다. */
function gfxSticker(text, o = {}) { const ls = Array.isArray(text) ? text : [text], fs = o.fs || 40, w = o.w || Math.max(...ls.map(s => gfTextW(s, fs, 900))) + fs * 1.5 + (o.band ? fs * 0.5 : 0), h = ls.length * fs * 1.18 + fs * 0.62, bg = o.bg || '#FFF6D8', ink = o.ink || INK, p = clamp(o.peel || 0, 0, 1), c = fs * (0.35 + 1.5 * p), x0 = -w / 2, x1 = w / 2, y0 = -h / 2, y1 = h / 2, r = fs * 0.32;
  const body = p > 0.02 ? `M${f1(x0 + r)} ${f1(y0)} L${f1(x1 - c)} ${f1(y0)} L${f1(x1)} ${f1(y0 + c)} L${f1(x1)} ${f1(y1 - r)} Q${f1(x1)} ${f1(y1)} ${f1(x1 - r)} ${f1(y1)} L${f1(x0 + r)} ${f1(y1)} Q${f1(x0)} ${f1(y1)} ${f1(x0)} ${f1(y1 - r)} L${f1(x0)} ${f1(y0 + r)} Q${f1(x0)} ${f1(y0)} ${f1(x0 + r)} ${f1(y0)} Z` : `M${f1(x0 + r)} ${f1(y0)} L${f1(x1 - r)} ${f1(y0)} Q${f1(x1)} ${f1(y0)} ${f1(x1)} ${f1(y0 + r)} L${f1(x1)} ${f1(y1 - r)} Q${f1(x1)} ${f1(y1)} ${f1(x1 - r)} ${f1(y1)} L${f1(x0 + r)} ${f1(y1)} Q${f1(x0)} ${f1(y1)} ${f1(x0)} ${f1(y1 - r)} L${f1(x0)} ${f1(y0 + r)} Q${f1(x0)} ${f1(y0)} ${f1(x0 + r)} ${f1(y0)} Z`;
  let s = (o.shadow === false ? '' : `<path d="${body}" fill="#1E2A4A" opacity=".22" transform="translate(${f1(3 + 5 * p)} ${f1(5 + 7 * p)})"/>`) + `<path d="${body}" fill="${bg}" stroke="${ink}" stroke-width="${f1(fs * 0.13)}" stroke-linejoin="round"/>`;
  if (o.band) s += `<path d="M${f1(x0 + r)} ${f1(y0)} L${f1(x0 + fs * 0.62)} ${f1(y0)} L${f1(x0 + fs * 0.62)} ${f1(y1)} L${f1(x0 + r)} ${f1(y1)} Q${f1(x0)} ${f1(y1)} ${f1(x0)} ${f1(y1 - r)} L${f1(x0)} ${f1(y0 + r)} Q${f1(x0)} ${f1(y0)} ${f1(x0 + r)} ${f1(y0)} Z" fill="${o.band}" stroke="${ink}" stroke-width="${f1(fs * 0.13)}" stroke-linejoin="round"/>`;
  ls.forEach((ln, i) => { s += gfT((o.band ? fs * 0.3 : 0), y0 + fs * 0.31 + (i + 0.82) * fs * 1.18 - fs * 0.08, ln, fs, ink, { wt: 900 }); });
  if (p > 0.02) s += `<path d="M${f1(x1 - c)} ${f1(y0)} L${f1(x1)} ${f1(y0 + c)} L${f1(x1 - c * 0.92)} ${f1(y0 + c * 0.92)} Z" fill="${o.back || '#E9DDB8'}" stroke="${ink}" stroke-width="${f1(fs * 0.1)}" stroke-linejoin="round"/>`;
  else s += `<path d="M${f1(x0 + r * 1.2)} ${f1(y0 + fs * 0.2)} L${f1(x1 - r * 1.6)} ${f1(y0 + fs * 0.2)}" stroke="#fff" stroke-width="${f1(fs * 0.09)}" stroke-linecap="round" opacity=".7"/>`;
  return s; }
// '탁' 붙는 움직임: 크게 날아와(1.9배, 기울어) 눌렸다가 출렁이며 자리 잡는다 → { s, rot, op, on(붙었는가) }. 붙는 순간이 t0.
function gfxSlap(t, t0, o = {}) { const u = t - t0, fly = o.fly || 0.16; if (u < -fly) return { s: 0, rot: 0, op: 0, on: false, k: 0 };
  if (u < 0) { const k = (u + fly) / fly; return { s: lerp(o.s0 || 2.1, 1.12, easeIn(k)), rot: lerp(o.r0 == null ? -22 : o.r0, 0, k), op: clamp(k * 3, 0, 1), on: false, k }; }
  const j = actHit(t, t0, 0.2, 5.2, 9); return { s: j.sy, rot: 1.6 * Math.exp(-7 * u) * Math.sin(u * 30), op: 1, on: true, k: 1 }; }
/* 스티커처럼 넘어가는 전환(화면 좌표): k 0 → 1 종이 뒷면이 화면을 덮고(왼쪽 아래에서 오른쪽 위로), 1 → 2 같은 방향으로 벗겨진다.
   GFR.over에서 줄 경계에 맞춰 부른다. 장면이 바뀌는 순간은 k = 1(다 덮였을 때). */
function gfxPeel(k, o = {}) { if (k <= 0 || k >= 2) return ''; const bg = o.bg || '#FFF6D8', sh = o.shade || '#E3D4A6', D = 2600, e = k < 1 ? easeInOut(k) : 1 + easeInOut(k - 1);
  const p = -320 + D * (k < 1 ? e : e - 1), nx = 0.8, ny = -0.6;            // 가장자리가 지나가는 직선: 법선 (nx, ny), 원점 (0,1080)에서 p만큼
  const line = (q, m) => [0 + nx * q - ny * m, 1080 + ny * q + nx * m], a = line(p, -2600), b = line(p, 2600), far = k < 1 ? -900 : D + 900, c = line(far, 2600), d = line(far, -2600), pt = v => `${f1(v[0])} ${f1(v[1])}`;
  const sg = k < 1 ? -1 : 1, fa = line(p + sg * 150, -2600), fb = line(p + sg * 150, 2600), sa = line(p - sg * 70, -2600), sb = line(p - sg * 70, 2600);   // sg: 종이가 있는 쪽
  const grad = (id, q, cols) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(a[0] + nx * q)}" y2="${f1(a[1] + ny * q)}">${cols}</linearGradient>`;
  return grad('gfxPl', sg * 150, `<stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="${sh}"/><stop offset="1" stop-color="${bg}" stop-opacity="0"/>`) + grad('gfxPs', -sg * 70, `<stop offset="0" stop-color="#101630" stop-opacity=".4"/><stop offset="1" stop-color="#101630" stop-opacity="0"/>`) +
    `<path d="M${pt(a)} L${pt(b)} L${pt(sb)} L${pt(sa)} Z" fill="url(#gfxPs)"/><path d="M${pt(a)} L${pt(b)} L${pt(c)} L${pt(d)} Z" fill="${bg}"/>` + (o.dots === false ? '' : `<path d="M${pt(a)} L${pt(b)} L${pt(c)} L${pt(d)} Z" fill="url(#gfDots)" opacity=".5"/>`) +
    `<path d="M${pt(a)} L${pt(b)} L${pt(fb)} L${pt(fa)} Z" fill="url(#gfxPl)"/><path d="M${pt(a)} L${pt(b)}" stroke="${INK}" stroke-width="7"/>`; }

/* ---------- 5. 자막: 말을 따라가는 대사 상자 ----------
   gfSubtitle(게임 감각 층)과 같은 상자 · 이름표. 아직 말하지 않은 글자는 옅게(#727C9A: 흰 상자 위 대비 약 4:1, 미리 읽는 사람도 읽힌다) 두었다가 목소리를 따라 진하게 채운다(게임 대화창처럼 눈이 말을 따라간다).
   글자 시각은 줄의 낱말 시각(TL.lines[i].words)에서 글자 수 비례로 구한다: 표기와 음성 인식 낱말이 조금 달라도 문장 안에서의 진행 비율은 거의 같다.
   조각(cue)이 바뀌는 때도 실제 말이 그 조각에 닿는 때로 잡는다(gfSubtitle은 글자 수 비례). o.follow === false면 따라가지 않고 처음부터 진하다.
   자막은 장면과 따로 그릴 수 있다: 장면은 자막 없이(깨끗한 판), 자막은 투명 그림으로 뽑아 인코딩 때 얹는다 → 자막만 바꿀 때 장면을 다시 그리지 않는다(milinda01/long/sub_ml.py). */
const _gfxCnt = s => s.replace(/[\s.,!?…'"“”‘’·~\-]/g, '').length;
function gfxSubtitle(t, o = {}) {
  const L = TL.lines; let cur = null; for (const l of L) if (t >= l.t0 - 0.05 && t <= l.t1 + 0.25) cur = l; if (!cur || !cur.sub) return '';
  if (!cur._gx) { const cs = cuesOf(cur), N = cs.reduce((a, c) => a + _gfxCnt(c.text), 0) || 1, ws = cur.words || [], M = ws.reduce((a, w) => a + _gfxCnt(w.w), 0) || 1, D = cur.t1 - cur.t0, pts = [[0, 0]]; let acc = 0;
    ws.forEach(w => { if (w.t > pts[pts.length - 1][0] + 0.01) pts.push([w.t, acc / M]); acc += _gfxCnt(w.w); }); pts.push([Math.max(D - 0.1, pts[pts.length - 1][0] + 0.05), 1]);
    const timeAt = x => { for (let i = 1; i < pts.length; i++) if (x <= pts[i][1]) { const [t0, f0] = pts[i - 1], [t1, f1b] = pts[i]; return f1b > f0 ? t0 + (t1 - t0) * (x - f0) / (f1b - f0) : t0; } return D; };
    let a = 0; const cues = cs.map((c, i) => { const q = { text: c.text.replace(/^[“"]|[”"]$/g, ''), v: c.v, a, n: _gfxCnt(c.text) }; q.t0 = i === 0 ? 0 : Math.max(0, timeAt(a / N) - 0.1); a += q.n; return q; });
    cur._gx = { cues, N, frac: u => { if (u <= 0) return 0; for (let i = 1; i < pts.length; i++) if (u <= pts[i][0]) { const [t0, f0] = pts[i - 1], [t1, f1b] = pts[i]; return f0 + (f1b - f0) * (u - t0) / Math.max(1e-6, t1 - t0); } return 1; } }; }
  const G = cur._gx, u = t - cur.t0; let cue = G.cues[0]; for (const c of G.cues) if (u >= c.t0 - 0.02) cue = c;
  const text = cue.text, fs = 46, done = o.follow === false ? cue.n : clamp(G.frac(u + 0.08) * G.N - cue.a, 0, cue.n);
  const lines = gfTextW(text, fs, 800) > 1180 ? (() => { const m = Math.floor(text.length / 2); let sp = text.indexOf(' ', m); if (sp < 0 || sp - m > 8) sp = text.lastIndexOf(' ', m); return sp > 0 ? [text.slice(0, sp), text.slice(sp + 1)] : [text]; })() : [text];
  const who = cue.v && cue.v !== 'N' ? (GF.names[cue.v] || null) : null, w = Math.max(...lines.map(s => gfTextW(s, fs, 800))) + 110, h = lines.length * 62 + 40, cy = 1046 - h / 2, k = gfIn(t, cur.t0 + cue.t0 - 0.05, 4.5, 0.6);
  let s = `<g transform="translate(960 ${f1(cy)}) scale(1 ${f1((0.86 + 0.14 * k) * 1000) / 1000})"><rect x="${f1(-w / 2)}" y="${-h / 2 + 8}" width="${f1(w)}" height="${h}" rx="30" fill="${GFC.navy}" opacity=".25"/><rect x="${f1(-w / 2)}" y="${-h / 2}" width="${f1(w)}" height="${h}" rx="30" fill="#FFFDF6" fill-opacity=".97" stroke="${INK}" stroke-width="6"/>`;
  let left = Math.floor(done + 1e-6);
  lines.forEach((ln, i) => { let cut = ln.length, c = 0; for (let j = 0; j < ln.length; j++) { if (_gfxCnt(ln[j])) { if (c >= left) { cut = j; break; } c++; } } left -= c;
    s += `<text x="0" y="${f1(-h / 2 + 64 + i * 62 - 4)}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${fs}" xml:space="preserve"><tspan fill="${GFC.navy}">${esc(ln.slice(0, cut))}</tspan>${cut < ln.length ? `<tspan fill="${o.dim || '#727C9A'}">${esc(ln.slice(cut))}</tspan>` : ''}</text>`; });
  if (who) { const tw = gfTextW(who[0], 30) + 48; s += `<rect x="${f1(-w / 2 + 30)}" y="${-h / 2 - 36}" width="${f1(tw)}" height="48" rx="24" fill="${who[1]}" stroke="${INK}" stroke-width="6"/>` + gfT(-w / 2 + 30 + tw / 2, -h / 2 - 1, who[0], 30, '#fff'); }
  return s + `</g>`;
}

/* ---------- 6. 기본 연출 ----------
   운영자(2026-11-28): "개선된 표현이나 연출 기법들을 기본으로 쓰게 해 줘." → 새 장면은 아래를 따로 켜지 않고 쓴다(쓰는 법 · 점검은 zw/GFX.md '기본 연출', 실제 예는 milinda01/long/mlgf2.js의 dir2, 점검은 milinda01/long/dir_ml.py).
     gfxDirect    시선 · 고개 · 깜박임 · 끄덕임 · 기울임을 '지금 말하는 사람'에 맞춰 자동으로. 눈이 먼저 가고 고개가 뒤따른다
     gfxShots     대사 줄에서 샷 계획을 자동으로 짠다(두 사람 → 어깨 너머 → 반응 컷 → 클로즈업, 샷마다 천천히 다가감). 옆 사람이 화면 끝에 조금만 걸치는 틀은 고르지 않는다
     gfxFocus     초점 거리(cam.f)에서 먼 층일수록, 확대가 클수록 흐리다 → cam.f를 움직이면 초점이 넘어간다
     gfxOTS       어깨 너머 샷의 앞사람(카메라 바로 앞의 뒷머리 + 어깨)
     cam.p        높낮이 각도(gfxCam · gfxCamT). 힘이 센 쪽은 올려다보고, 힘이 빠지면 눈높이로
     gfxMatchCam  모양으로 잇는 장면 전환: 앞 장면의 둥근 것과 뒤 장면의 둥근 것을 화면 같은 자리 · 같은 크기에 놓고 컷
     gfxMood      이야기를 따라가는 빛(구름 그늘 ↔ 햇살)
     gfxLand      무게: 떨어져 눌렸다가 낮게 한 번 튀고 멈춘다
   모두 시각 t만으로 계산한다(상태를 들고 다니지 않는다 → 프레임을 나눠 그려도 결과가 같다). */
const GFX_DIR = { eye: 1, turn: 0.95, turnK: 40, turnSq: 0.13 };      // 기본 세기: 눈 · 고개 돌림 · 얼굴 부위가 옮겨 가는 거리(엔진 turnK) · 돌린 만큼 눌림(엔진 turnSq)
const _gfxSpeaker = (t, cast) => { const L = (window.TL && TL.lines) || []; let cur = null; for (const l of L) { if (l.t0 - 0.12 > t) break; if (l.v && cast[l.v] && t <= l.t1 + 0.3) cur = l; } return cur; };
// A가 tau에 바라보는 곳 → [x, y, 무엇]. 순서: 모두가 보는 것(o.focus) → 말하는 사람 → (내가 말하는 중이면) 듣는 사람
function _gfxTarget(tau, A, cast, o) {
  const me = cast[A], my = me.y || 0;
  for (const f of o.focus || []) if (tau >= f[0] && tau <= f[1] && (!f[4] || f[4].includes(A))) return [f[2], f[3], 'focus'];
  const sp = _gfxSpeaker(tau, cast); let who = null;
  if (sp && sp.v !== A) who = sp.v;
  else { who = (o.to && o.to[A]) || me.to || null;
    if (!who || !cast[who]) { const L = (window.TL && TL.lines) || []; who = null; for (let i = L.length - 1; i >= 0; i--) if (L[i].t0 <= tau && L[i].v && L[i].v !== A && cast[L[i].v]) { who = L[i].v; break; } }
    if (!who) who = Object.keys(cast).find(k => k !== A); }
  const c = cast[who];
  if (sp && sp.v === A && o.think !== false && sp.t1 - sp.t0 > 4 && !/[?!]\s*["”’']?\s*$/.test(sp.sub || '') && tau - sp.t0 > 0.05 && tau - sp.t0 < 0.55) return [me.x + (c ? Math.sign(c.x - me.x) : 1) * 120, my - 150, 'think'];      // 긴 설명 첫머리: 말을 고르며 잠깐 위를 본다(묻거나 외치는 줄은 상대를 똑바로 본다)
  return c ? [c.x, c.y == null ? my : c.y, who] : [me.x, my, null];
}
/* 시선과 듣는 연기를 자동으로.
   cast = { 목소리 id: { x, y(머리 가운데의 세계 좌표), to(말할 때 바라볼 상대의 id. 없으면 마지막으로 말한 다른 사람), seed } }
   o = { focus: [[t0, t1, x, y, [id…]], …] 그동안 모두(또는 적힌 사람만) 그곳을 본다(뜯기는 수레 부품, 내민 물건),
         lid: [[t0, t1, id, 0~1], …] 눈꺼풀을 반쯤 내림(의심 · 생각 · 졸림), to: { id: 상대 id }, think: false면 '말 고르며 위 보기'를 끈다, k: GFX_DIR 덮어쓰기 }
   → { id: { look, turn, turnK, turnSq, blink, headDy, tilt, sy, rot, speaking, target } }  → gfxAct · gfxEx로 char()에 넘긴다 */
function gfxDirect(t, cast, o = {}) {
  const out = {}, G = Object.assign({}, GFX_DIR, o.k || {});
  Object.keys(cast).forEach((A, ai) => { const me = cast[A], my = me.y || 0, sd = me.seed == null ? ai * 2.7 + 1 : me.seed, dl = 0.08 + 0.2 * hash(sd * 3.1);      // 사람마다 반응이 조금씩 늦다(다 같이 한꺼번에 돌아보면 인형 같다)
    const dirAt = tau => { const g = _gfxTarget(tau, A, cast, o), dx = g[0] - me.x, dy = g[1] - my, d = Math.hypot(dx, dy) || 1, m = Math.min(1, d / 260); return [dx / d * m, clamp(dy / d * m, -0.7, 0.7), g[2]]; };
    const avg = (lag, n, step) => { let x = 0, y = 0; for (let j = 0; j < n; j++) { const q = dirAt(t - lag - j * step); x += q[0]; y += q[1]; } return [x / n, y / n]; };
    const eye = avg(dl, 6, 0.04), head = avg(dl + 0.14, 9, 0.05), a = dirAt(t - dl), b = dirAt(t - dl - 0.13), sw = Math.hypot(a[0] - b[0], a[1] - b[1]) > 0.5 ? 0.95 : 0;      // 시선이 넘어가는 순간 깜박인다
    const seg = Math.floor((t + sd * 1.9) / 2.7), ph = (t + sd * 1.9) - seg * 2.7, dart = hash(seg * 7.7 + sd) > 0.55 && ph < 0.3 ? [(hash(seg * 3.3 + sd) - 0.5) * 0.5, 0.16 + 0.2 * hash(seg + sd)] : [0, 0];      // 가끔 눈만 잠깐 딴 데로(못 박힌 시선 방지)
    let lid = 0; for (const q of o.lid || []) if (q[2] === A && t >= q[0] && t <= q[1]) lid = Math.max(lid, (q[3] == null ? 0.42 : q[3]) * clamp((t - q[0]) / 0.25, 0, 1) * clamp((q[1] - t) / 0.25, 0, 1));
    const sp = gfxVoice(t, A), ta = gfxTalkAct(t, A, sd), la = gfxListenAct(t, sd, 2.4 + hash(sd) * 1.2);
    out[A] = { look: [clamp(eye[0] * G.eye + dart[0], -1, 1), clamp(eye[1] * G.eye + dart[1], -1, 1)], turn: head[0] * G.turn, turnK: G.turnK, turnSq: G.turnSq, blink: Math.max(sw, lid),
      headDy: (sp ? ta.headDy : la.headDy) + 7 * head[1], tilt: (sp ? ta.tilt : la.tilt) + head[0] * 1.5, sy: ta.sy, rot: head[0] * (sp ? 1.5 * (0.4 + 0.6 * ta.e) : 0.5), speaking: !!sp, target: a[2] };
    (window._gfxLk = window._gfxLk || {})[A] = [Math.round(out[A].look[0] * 100) / 100, Math.round(out[A].turn * 100) / 100, a[2], sp ? 1 : 0];
  });
  return out;
}
// gfxDirect의 결과를 char() 옵션으로: mlK(Object.assign({ x, y, s, t, pose }, gfxAct(D.K), { ex: gfxEx(gfxFace(…), D.K) }))
const gfxAct = (d, more) => Object.assign({ look: d.look, turn: d.turn, turnK: d.turnK, turnSq: d.turnSq, headDy: d.headDy, tilt: d.tilt, sy: d.sy, rot: d.rot }, more || {});
const gfxEx = (ex, d) => Object.assign({}, ex, { blink: Math.max(ex.blink || 0, d.blink || 0) });

// 초점: 층의 초점 거리 fd가 cam.f에서 멀수록, 확대가 클수록 흐리다(넓은 샷에서는 모두 또렷하다). → gfxLayer의 blur에 넣는다. 배경 층은 fd = depth, 인물은 서 있는 깊이대로 준다(앞사람 1.6, 뒷사람 0.7처럼)
const GFX_OTS_FD = 1.9;      // 어깨 너머 샷에서 앞사람(카메라 바로 앞)의 초점 거리
const gfxFocus = (cam, fd, k = 11) => { const b = Math.abs(fd - (cam.f == null ? 1 : cam.f)) * k * Math.max(0, cam.z - 1.15); return b < 0.75 ? 0 : Math.min(16, Math.round(b * 2) / 2); };

/* 샷 틀 잡기: subj(주인공들)가 다 들어오고 o.marks(소품)는 '다 들어오거나 다 빠지는' 카메라를 찾는다. 없으면 null.
   주인공이 아닌 인물이 화면 끝에 걸치면 그 인물을 hide에 적는다 → 장면은 그 샷 동안 그 인물을 그리지 않는다(카메라 각도가 바뀌어 화면에서 빠진 것으로 친다. 실사 촬영의 '따로 찍는 한 사람 샷'과 같다).
   그래야 주인공을 시선 반대쪽에 비켜 세울 수 있다(평면 무대에서는 옆 사람을 빼려고 주인공을 화면 끝으로 미는 일이 생긴다).
   type: wide · two · mcu(가슴 위) · ots(어깨 너머) · cu(얼굴) · react(듣는 사람 얼굴). o = { zk: 조임 배율, lead: 시선 쪽 여백(화면 px, 부호 = 바라보는 쪽), ignore: [틀을 잡을 때 없는 셈 치는 id] } */
function _gfxFrame(cast, subj, type, o = {}) {
  const R = c => c.r || 136, S = subj.map(v => cast[v]), xs = S.map(c => c.x), lo = Math.min(...xs), hi = Math.max(...xs), y = S.reduce((q, c) => q + (c.y || 0), 0) / S.length;
  const oth = Object.keys(cast).filter(v => !subj.includes(v) && !(o.ignore || []).includes(v));
  const part = (c, x, z) => { const hw = 960 / z, m = 16 / z, l = c.x - R(c), r = c.x + R(c); return !(l >= x - hw + m && r <= x + hw - m) && !(r <= x - hw - m || l >= x + hw + m); };
  const ok = (x, z) => { const hw = 960 / z; for (const c of S) if (c.x - R(c) < x - hw + 40 / z || c.x + R(c) > x + hw - 40 / z) return false; for (const c of o.marks || []) if (part(c, x, z)) return false; return true; };
  const z0 = (S.length > 1 ? Math.min(1.45, 1920 / (hi - lo + 2 * 136 + 380)) : { wide: 1.0, two: 1.3, mcu: 1.62, ots: 1.78, cu: 2.2, react: 2.3 }[type] || 1.5) * (o.zk || 1), cx = (lo + hi) / 2 + (o.lead || 0) / z0;      // 바라보는 쪽에 여백: 카메라가 그쪽으로 가고 주인공은 반대쪽에 선다
  for (const dz of [0, 0.1, -0.1, 0.22, -0.2, 0.36, 0.5, -0.3]) for (const dx of [0, 50, -50, 100, -100, 160, -160, 230, -230]) { const z = z0 * (1 + dz), x = cx + dx / z; if (!ok(x, z)) continue;
    return { x: Math.round(x), y: Math.round(y + (S.length > 1 ? 42 : type === 'cu' || type === 'react' ? 16 : 30)), z: Math.round(z * 1000) / 1000, hide: oth.filter(v => part(cast[v], x, z)) }; }
  return null;
}
/* 대사 줄 → 샷 계획(기본 카메라). 손으로 짜기 전에 이것부터 돌리고, 마음에 안 드는 줄만 o.over로 덮는다.
   lines: 이 장면의 줄들(순서대로). cast = { 목소리 id: { x, y(머리 가운데), r(머리 반지름, 기본 136), fd(초점 거리, 기본 1), status(−1~1: 힘. + 면 올려다보는 각도), to } }
   o = { wide: { x, y, z } 전체 샷(해설 줄 · 장면 첫머리), over: { 줄 id: 'wide' | 'two' | 'mcu' | 'ots' | 'cu' | 'hold'(앞 샷 그대로) | [[줄 시작부터의 초, {x, y, z, …}, {d, ease}], …] },
         to: { id: 상대 }, marks: [{ x, r }] 잘리면 안 되는 소품, tight: 뒤로 갈수록 조이는 정도(기본 0.1), react: false면 반응 컷 없음, noReact: [줄 id…] 그 줄만 반응 컷 없이 한 단계 더 가까이, push: 샷 안에서 다가가는 비율(기본 1.045) }
   규칙: 해설 뒤 첫 대사는 두 사람 샷(누가 어디 있는지) → 다음부터 어깨 너머와 가슴 샷을 번갈아 → 2.3초보다 짧은 대사는 얼굴 → 4.6초보다 긴 대사는 중간의 쉼에서 듣는 사람 얼굴로 갔다가 더 가까이 돌아온다.
   모든 샷은 줄 시작 0.15초 전에 컷하고(말하기 전 들숨이 보인다) 끝까지 천천히 다가간다.
   → { keys(gfxCam에 그대로), shots: [{ t0, t1, type, who, ots: { who, side } | null, line }] } */
function gfxShots(lines, cast, o = {}) {
  const keys = [], shots = [], W = o.wide || { x: 960, y: 540, z: 1 }, T0 = lines[0].t0, T1 = lines[lines.length - 1].t1, turn = {}, push = o.push || 1.045; let first = true, lastOther = {}, lastV = null;
  const stat = (v, t) => { const s = cast[v] && cast[v].status; return typeof s === 'function' ? s(t) : (s || 0); };
  const shot = (t0, t1, c, meta) => { const cc = Object.assign({ r: 0, f: 1, p: 0 }, c), hide = cc.hide || []; delete cc.hide; const wide = meta.type === 'wide';
    if (meta.ots) { keys.push([t0, Object.assign({}, cc, { f: GFX_OTS_FD }), { ease: 'cut' }]); keys.push([t0 + 0.2, { f: cc.f }, { d: 0.5, ease: 'io' }]); } else keys.push([t0, cc, { ease: 'cut' }]);      // 어깨 너머: 앞사람 어깨에 맞았던 초점이 말하는 사람에게 넘어간다
    if (t1 - t0 > 0.3) keys.push([t0 + 0.02, { z: cc.z * (wide ? 1 + (push - 1) * 0.6 : push), y: cc.y - (wide ? 0 : 4) }, { d: t1 - t0, ease: 'lin' }]);
    shots.push(Object.assign({ t0, t1, hide: hide.concat(meta.ots ? [meta.ots.who] : []) }, meta)); };
  const single = (A, B, type, zk) => { const sg = B && cast[B] ? Math.sign(cast[B].x - cast[A].x) : 0, lead = sg * (type === 'ots' ? 250 : type === 'mcu' ? 130 : 90), ig = type === 'ots' && B ? [B] : [];
    return _gfxFrame(cast, [A], type, { zk, lead, marks: o.marks, ignore: ig }) || _gfxFrame(cast, [A], type === 'cu' ? 'mcu' : 'cu', { zk, lead, marks: o.marks, ignore: ig }); };
  lines.forEach((l, i) => { const D = l.t1 - l.t0, tc = l.t0 - 0.15, te = (lines[i + 1] ? lines[i + 1].t0 : l.t1 + 0.6) - 0.15, A = l.v && cast[l.v] ? l.v : null, ov = (o.over || {})[l.id];
    const zk = 1 + (o.tight == null ? 0.1 : o.tight) * (l.t0 - T0) / Math.max(1, T1 - T0);
    if (Array.isArray(ov)) { ov.forEach(([dt, c, e]) => keys.push([l.t0 + dt, c, e || {}])); shots.push({ t0: tc, t1: te, type: 'manual', who: A, ots: null, hide: [], line: l.id }); first = !A; return; }
    if (ov === 'hold' && shots.length) { shots[shots.length - 1].t1 = te; return; }
    if (!A || ov === 'wide') { shot(tc, te, W, { type: 'wide', who: null, ots: null, line: l.id }); first = true; return; }
    const B = (o.to && o.to[A]) || cast[A].to || lastOther[A] || (lastV && lastV !== A ? lastV : Object.keys(cast).find(v => v !== A)); if (lastV && lastV !== A) lastOther[A] = lastV; lastV = A;
    let type = ov || (first ? 'two' : D < 2.3 ? 'cu' : (turn[A] || 0) % 2 ? 'mcu' : 'ots'); first = false; if (type === 'ots' || type === 'mcu') turn[A] = (turn[A] || 0) + 1;
    const two = () => _gfxFrame(cast, B && cast[B] ? [A, B] : [A], 'two', { zk: 1, marks: o.marks }) || W;
    const one = ty => { const c = single(A, B, ty, zk); if (!c) return null; return Object.assign(c, { f: cast[A].fd || 1, p: stat(A, l.t0) * 0.5 }); };
    const meta = ty => ({ type: ty, who: A, ots: ty === 'ots' && B ? { who: B, side: cast[B].x < cast[A].x ? 'L' : 'R' } : null, line: l.id });
    // 긴 대사: 낱말 사이가 가장 벌어진 곳(줄의 38~66%)에서 듣는 사람의 얼굴로
    let cutT = null; if (D > 4.6 && o.react !== false && B && cast[B]) { const ws = l.words || []; let best = 0; for (let k = 1; k < ws.length; k++) { const f = ws[k].t / D; if (f < 0.38 || f > 0.66) continue; const gap = ws[k].t - ws[k - 1].t; if (gap > best) { best = gap; cutT = l.t0 + ws[k].t - 0.12; } } if (cutT == null) cutT = l.t0 + D * 0.52; }
    if (type === 'two') { const c2 = two(); if (D > 4.2) { const tm = l.t0 + D * 0.42, c1 = one('mcu'); shot(tc, tm, c2, { type: 'two', who: A, ots: null, line: l.id }); if (c1) shot(tm, te, c1, meta('mcu')); else shots[shots.length - 1].t1 = te; } else shot(tc, te, c2, { type: 'two', who: A, ots: null, line: l.id }); return; }
    const c1 = one(type); if (!c1) { shot(tc, te, two(), { type: 'two', who: A, ots: null, line: l.id }); return; }
    if (cutT != null) { const rl = Math.min(1.5, Math.max(1.1, D * 0.2)), cr = _gfxFrame(cast, [B], 'react', { zk, lead: Math.sign(cast[A].x - cast[B].x) * 90, marks: o.marks }), c3 = one('cu');
      if ((o.noReact || []).includes(l.id)) { if (c3 && type !== 'cu') { shot(tc, cutT, c1, meta(type)); shot(cutT, te, c3, meta('cu')); return; } }      // 반응 컷 없이: 같은 사람에게 한 단계 더 가까이(말하는 사람 곁에 화면 표시가 뜨는 줄)
      else if (cr && c3 && cutT + rl < l.t1 - 0.9) { shot(tc, cutT, c1, meta(type)); shot(cutT, cutT + rl, Object.assign(cr, { f: cast[B].fd || 1, p: stat(B, cutT) * 0.5 }), { type: 'react', who: B, ots: null, line: l.id }); shot(cutT + rl, te, c3, meta('cu')); return; } }
    shot(tc, te, c1, meta(type));
  });
  keys.sort((p, q) => p[0] - q[0]); return { keys, shots };
}
const gfxShotAt = (plan, t) => { let s = plan.shots[0]; for (const q of plan.shots) if (t >= q.t0) s = q; return s; };

/* 어깨 너머 샷의 앞사람(화면 좌표, 색 보정 앞에 그린다). side: 'L' | 'R'(화면 어느 쪽 아래에 서는가)
   o = { cloth, hair(색. 없으면 민머리), band(머리띠 색), skin, s, t, k(0~1: 나타난 정도), blur } — 뒤통수와 어깨뿐이라 어느 인물이든 색만 바꿔 쓴다. 초점 밖이라 흐리고 조금 어둡다. */
function gfxOTS(side, o = {}) {
  const sg = side === 'L' ? -1 : 1, s = o.s || 1, t = o.t || 0, k = o.k == null ? 1 : o.k, R = 196 * s, x = 960 + sg * (716 + (1 - k) * 600) + Math.sin(t * 0.5) * 6, y = 1080 + Math.sin(t * 0.37 + 1) * 5, hy = -R * 1.52, n = v => f1(v), skin = o.skin || '#fff';
  const back = `M${n(-R * 2.3)} ${n(R * 0.8)} Q${n(-R * 2.2)} ${n(-R * 0.42)} ${n(-R * 0.7)} ${n(-R * 0.62)} Q0 ${n(-R * 0.46)} ${n(R * 0.7)} ${n(-R * 0.62)} Q${n(R * 2.2)} ${n(-R * 0.42)} ${n(R * 2.3)} ${n(R * 0.8)} Z`;
  const hair = `M${n(-R)} ${n(hy + R * 0.1)} A${n(R)} ${n(R)} 0 0 1 ${n(R)} ${n(hy + R * 0.1)} Q${n(R * 0.86)} ${n(hy + R * 0.78)} 0 ${n(hy + R * 0.9)} Q${n(-R * 0.86)} ${n(hy + R * 0.78)} ${n(-R)} ${n(hy + R * 0.1)} Z`;
  const ear = e => `<ellipse cx="${n(e * R * 0.99)}" cy="${n(hy + R * 0.16)}" rx="${n(R * 0.16)}" ry="${n(R * 0.24)}" fill="${skin}" stroke="${INK}" stroke-width="12"/>`;
  let h = `<path d="${back}" fill="${o.cloth || '#6B7388'}" stroke="${INK}" stroke-width="14" stroke-linejoin="round"/>` + (o.sash ? `<path d="M${n(-R * 0.7)} ${n(-R * 0.62)} Q${n(-R * 0.2)} ${n(R * 0.1)} ${n(R * 0.9)} ${n(R * 0.8)} L${n(R * 1.7)} ${n(R * 0.8)} Q${n(R * 0.5)} ${n(-R * 0.1)} ${n(-R * 0.1)} ${n(-R * 0.58)} Z" fill="${o.sash}" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>` : '') +
    `<rect x="${n(-R * 0.3)}" y="${n(hy + R * 0.8)}" width="${n(R * 0.6)}" height="${n(R * 0.36)}" fill="${skin}" stroke="${INK}" stroke-width="12"/>` + ear(-1) + ear(1) + `<circle cx="0" cy="${n(hy)}" r="${n(R)}" fill="${skin}" stroke="${INK}" stroke-width="14"/>`;
  if (o.hair) h += `<path d="${hair}" fill="${o.hair}" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/>`;
  else h += `<path d="M${n(-R * 0.55)} ${n(hy + R * 0.62)} Q0 ${n(hy + R * 0.86)} ${n(R * 0.55)} ${n(hy + R * 0.62)}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round" opacity=".22"/>`;      // 민머리: 뒤통수 아래 주름 한 줄
  if (o.band) h += `<path d="M${n(-R * 0.97)} ${n(hy - R * 0.2)} Q0 ${n(hy - R * 0.02)} ${n(R * 0.97)} ${n(hy - R * 0.2)}" fill="none" stroke="${INK}" stroke-width="${n(R * 0.2)}" stroke-linecap="round"/><path d="M${n(-R * 0.97)} ${n(hy - R * 0.2)} Q0 ${n(hy - R * 0.02)} ${n(R * 0.97)} ${n(hy - R * 0.2)}" fill="none" stroke="${o.band}" stroke-width="${n(R * 0.12)}" stroke-linecap="round"/>`;
  h += `<g opacity="${o.dark == null ? 0.2 : o.dark}"><path d="${back}" fill="#1B2440"/><circle cx="0" cy="${n(hy)}" r="${n(R)}" fill="#1B2440"/></g>`;
  const g = `<g transform="translate(${n(x)} ${n(y)})">${h}</g>`, bl = o.blur != null ? o.blur : (o.cam ? gfxFocus(o.cam, GFX_OTS_FD) : 7); if (window.GFX_OFF || !bl) return g; const [df, id] = _gfxBF(bl); return `${df}<g filter="url(#${id})">${g}</g>`;      // o.cam을 주면 초점 거리에 따라 또렷해졌다 흐려진다
}

// 모양으로 잇는 전환: 세계 좌표의 둥근 것 obj { x, y, r }이 화면의 to { x, y, r } 자리 · 크기로 보이는 카메라. 앞 장면의 끝과 뒤 장면의 처음을 같은 to로 맞추고 컷한다(시계 → 바퀴, 폰 불빛 → 해).
const gfxMatchCam = (obj, to = { x: 960, y: 520, r: 230 }) => { const z = to.r / obj.r; return { x: obj.x - (to.x - 960) / z, y: obj.y - (to.y - 540) / z, z }; };

/* 이야기를 따라가는 빛. keys = [[t, w, d], …]  w: −1 구름 그늘 … 0 평소 … +1 햇살이 든다. d: 바뀌는 데 걸리는 초(기본 1.8)
   → { w, light(주광 세기에 곱한다), shafts(빛줄기 세기에 곱한다), over(화면 좌표 덮개: 색 보정 다음에 얹는다) }
   바뀌는 동안에는 가장자리가 화면 왼쪽에서 오른쪽으로 지나간다(o.dir = -1이면 반대): 그냥 어두워지는 것보다 '구름이 지나갔다 · 해가 났다'로 읽힌다. */
function gfxMood(t, keys, o = {}) {
  let w0 = 0, w1 = 0, k = 1; for (const [t0, w, d = 1.8] of keys) { if (t < t0) break; const kk = clamp((t - t0) / d, 0, 1); w0 = lerp(w0, w1, easeInOut(k)); w1 = w; k = kk; }
  const dir = o.dir || 1, at = u => lerp(w0, w1, easeInOut(clamp(k * 1.7 - (dir > 0 ? u : 1 - u) * 0.7, 0, 1))), w = at(0.5); window._gfxMw = Math.round(w * 100) / 100;
  if (window.GFX_OFF) return { w, light: 1, shafts: 1, over: '' };
  const us = [0, 0.2, 0.4, 0.6, 0.8, 1], vs = us.map(at), id = 'gfxMd' + Math.round(t * 24), grad = (sfx, col, f) => `<linearGradient id="${id}${sfx}" x1="0" y1="0" x2="1" y2="0">${us.map((u, i) => `<stop offset="${u}" stop-color="${col}" stop-opacity="${f1(f(vs[i]) * 1000) / 1000}"/>`).join('')}</linearGradient>`;
  let over = ''; const rect = (sfx, mode) => `<rect x="-40" y="-40" width="2000" height="1160" fill="url(#${id}${sfx})"${mode && !window.GFX_NOBLEND ? ` style="mix-blend-mode:${mode}"` : ''}/>`;
  if (vs.some(v => v < -0.01)) over += grad('c', o.cool || '#96A1C6', v => Math.max(0, -v) * (window.GFX_NOBLEND ? 0.3 : 0.56)) + rect('c', 'multiply');
  if (vs.some(v => v > 0.01)) over += grad('w', o.warm || '#FFD98A', v => Math.max(0, v) * (window.GFX_NOBLEND ? 0.14 : 0.26)) + rect('w', 'screen');
  return { w, light: 1 + (w < 0 ? 0.45 : 0.3) * w, shafts: clamp(1 + 1.6 * w, 0, 2.6), over };
}

/* 무게: t0에 땅에 닿는다. 닿기 전에는 떨어지며 길어지고(dy는 위로 음수), 닿으면 눌렸다가 낮게 한 번 튀고 멈춘다.
   o = { h: 떨어지는 높이(px), fall: 떨어지는 시간(없으면 높이에서 계산), bounce: 튀는 높이 비율(기본 0.14, 무거울수록 작게) }
   → { dy, sx, sy, on } — 같은 t0에 먼지(gfPuff) · 카메라 흔들림(gfxShake) · '쿵' 소리를 건다. 꼬리표처럼 공중에 띄워 두지 말고 바닥에 놓는다. */
function gfxLand(t, t0, o = {}) { const h = o.h || 300, T = o.fall || Math.sqrt(h / 1500), u = t - t0, b = o.bounce == null ? 0.14 : o.bounce;
  if (u < -T) return { dy: -h, sx: 1, sy: 1, on: false };
  if (u < 0) { const k = (u + T) / T; return { dy: -h * (1 - k * k), sx: 1 - 0.05 * k, sy: 1 + 0.09 * k, on: false }; }
  const Tb = 2 * T * Math.sqrt(b), j = actHit(t, t0, 0.17, 4.6, 8); return { dy: u < Tb ? -h * b * 4 * (u / Tb) * (1 - u / Tb) : 0, sx: j.sx, sy: j.sy, on: true }; }

/* 층 쌓기(기본 틀. 편마다 따로 만들지 않고 이것을 쓴다).
   L = { cam, defs, far: [[depth, svg, { fd, blur, op }], …] 빛을 받지 않는 배경(흐림은 초점에서 자동. blur를 적으면 그 값),
         cast: [그림자 원본, 옵션], lit: svg 또는 [[svg, fd], …](초점 거리가 다른 인물 묶음 → cam.f를 옮기면 초점이 넘어간다), light: 조명 id,
         glow(빛 번짐 · 효과: 세계 좌표), fg(카메라 앞 층) · fgDepth · fgFd, ots(gfxOTS), whip(빠른 이동 번짐), grade, mood(gfxMood의 over), vig, hud(화면 좌표) } */
function gfxCompose(L) {
  const c = L.cam; let s = ''; gfxMarksProject(c);
  for (const [d, g, o] of L.far || []) { const oo = o || {}; s += gfxLayer(c, d, g, { blur: oo.blur != null ? oo.blur : gfxFocus(c, oo.fd == null ? d : oo.fd), op: oo.op }); }
  if (L.cast) s += gfxCast(L.cast[0], Object.assign({ cam: c }, L.cast[1]));
  for (const [g, fd] of Array.isArray(L.lit) ? L.lit : [[L.lit, 1]]) { if (!g) continue; const lay = gfxLayer(c, 1, g), lit = L.light ? gfxLit(L.light, lay) : lay, b = window.GFX_OFF ? 0 : gfxFocus(c, fd == null ? 1 : fd); if (b) { const [df, id] = _gfxBF(b); s += `${df}<g filter="url(#${id})">${lit}</g>`; } else s += lit; }
  if (L.glow) s += gfxLayer(c, 1, L.glow);
  if (L.fg) s += gfxLayer(c, L.fgDepth || 1.35, L.fg, { blur: L.fgBlur == null ? Math.max(4, gfxFocus(c, L.fgFd || 1.8)) : L.fgBlur });
  if (L.ots) s += L.ots;
  if (L.whip) s = `<g filter="url(#gfxMx)">${s}</g>`;
  return gfxScreen((L.defs || '') + s + (L.grade || '') + (L.mood || '') + (L.vig == null ? gfxVignette(0.4) : L.vig) + (L.hud || ''));
}
