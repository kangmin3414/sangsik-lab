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
const gfxScreen = inner => `<g transform="translate(960 100) scale(${1 / 0.88}) translate(-960 -100)">${inner}</g>`;
const _gfxEase = { io: easeInOut, out: easeOut, in: easeIn, lin: k => k, back: easeOutBack };
/* 샷 키로 카메라를 만든다. keys = [[t, {x, y, z, r}, {d: 걸리는 초, ease: 'io'|'out'|'in'|'lin'|'back'|'cut'}], …] → { x, y, z, r }
   x·y는 화면 가운데에 올 세계 좌표, z는 확대(1 = 그대로), r은 기울기(도). 줌은 곱으로 보간해서 속도가 고르게 느껴진다. */
function gfxCam(keys, t) {
  let c = Object.assign({ x: 960, y: 540, z: 1, r: 0 }, keys[0][1]);
  for (let i = 1; i < keys.length; i++) { const [t0, to, o = {}] = keys[i]; if (t < t0) break;
    const d = o.ease === 'cut' ? 0 : (o.d == null ? 0.8 : o.d), g = Object.assign({}, c, to), k = d <= 0 ? 1 : (_gfxEase[o.ease] || easeInOut)(clamp((t - t0) / d, 0, 1));
    c = { x: lerp(c.x, g.x, k), y: lerp(c.y, g.y, k), z: c.z * Math.pow(g.z / c.z, k), r: lerp(c.r, g.r, k) }; }
  return c;
}
// 숨 쉬는 카메라: 손으로 든 것처럼 아주 조금 떠다닌다(amp 화면 픽셀). 정지 화면이 죽어 보이지 않게 모든 샷에 얹는다.
const gfxDrift = (c, t, amp = 3, seed = 0) => Object.assign({}, c, { x: c.x + amp / c.z * (Math.sin(t * 0.41 + seed) + 0.5 * Math.sin(t * 0.97 + seed * 2.3)), y: c.y + amp * 0.7 / c.z * (Math.sin(t * 0.33 + seed * 1.7 + 1) + 0.5 * Math.sin(t * 0.79 + seed)), r: c.r + amp * 0.03 * Math.sin(t * 0.27 + seed * 3.1) });
// 충격 흔들림: hits = [[t0, 세기(px), 길이(초)], …]
function gfxShake(c, t, hits) { let dx = 0, dy = 0; for (const [t0, amp = 12, d = 0.3] of hits) { const u = t - t0; if (u < 0 || u > d) continue; const k = amp * Math.pow(1 - u / d, 2); dx += Math.sin(u * 82) * k; dy += Math.cos(u * 67) * k * 0.7; } return Object.assign({}, c, { x: c.x + dx / c.z, y: c.y + dy / c.z }); }
// 카메라 변환. depth 1 = 인물과 같은 평면, 0.3 = 먼 산(덜 움직이고 덜 커진다), 1.4 = 카메라 바로 앞(더 많이 움직인다)
const gfxCamT = (c, depth = 1) => { const z = 1 + (c.z - 1) * depth, x = 960 + (c.x - 960) * depth, y = 540 + (c.y - 540) * depth; return `translate(960 540)${c.r ? ` rotate(${f1(c.r * depth * 100) / 100})` : ''} scale(${Math.round(z * 10000) / 10000}) translate(${f1(-x)} ${f1(-y)})`; };
// 깊이 층. o.blur: 초점 밖 흐림 세기(0·2·4·7·12 가운데 하나, gfxDefs가 필터를 만든다), o.op: 투명도
// 필터는 카메라 변환 바깥(화면 좌표)에 건다: 카메라가 멀리 가도 필터 영역이 화면을 벗어나지 않고, 흐림 크기도 확대와 무관하게 같다.
const gfxLayer = (c, depth, inner, o = {}) => { const g = `<g transform="${gfxCamT(c, depth)}">${inner}</g>`, op = o.op != null && o.op < 1 ? ` opacity="${f1(o.op * 100) / 100}"` : ''; return o.blur && !window.GFX_OFF ? `<g filter="url(#gfxB${o.blur})"${op}>${g}</g>` : (op ? `<g${op}>${g}</g>` : g); };
// 세계 좌표 → 화면 좌표(조명 위치·HUD 꼬리표를 인물에 맞출 때). 기울기 r은 작다고 보고 무시한다.
const gfxProj = (c, x, y, depth = 1) => { const z = 1 + (c.z - 1) * depth, cx = 960 + (c.x - 960) * depth, cy = 540 + (c.y - 540) * depth; return [960 + (x - cx) * z, 540 + (y - cy) * z]; };

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
