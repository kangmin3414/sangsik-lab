/* 자소서 편 v4 — 공통 도구. ../long/rsscenes*.js, ../meet/mtscenes.js, ../../zw/act.js 뒤에 부른다. 새 이름은 v4 접두사.
   원칙(2026-11-14 엔진 점검에서 정함):
   · 연기는 끊기지 않는 장면 시계 T(runLt)로 한 번만 정하고, 컷은 카메라만 바꾼다.
   · 대화 장면 점검 목록: 고개 돌리기(turn) · 손 모양(handL/R) · 끄덕임(headDy) · 쥔 물건(holdL/R) · 배경 깊이 · 빛 방향(light) · 발음에 맞춘 입(actSay). */
const v4T = (id, first) => rsL(id).t0 - rsL(first).t0;                                   // 장면 시계에서 그 줄이 시작하는 때
const v4W = (id, first, key, fb, n) => v4T(id, first) + rsWd(rsL(id).words, key, fb, n);  // 그 줄의 낱말이 나오는 때
const v4On = (id, t) => t >= rsL(id).t0 - 0.05 && t < rsL(id).t1 + 0.12;                  // 그 줄을 말하는 중인가
const v4Say = (key, base, id, t) => actSay(key, base, v4On(id, t) ? rsL(id) : null, t, env(t));
const v4Bob = (id, t) => v4On(id, t) ? actTalk(env(t)) : { headDy: 0, hand: 0 };
const v4Cut = (T, tc) => rsVeil(T, tc, 0.08, 0.3);
function v4Shots(T, shots) { // shots: [[시작 T, (T, 시작, 끝) => SVG], …]
  let i = 0; while (i + 1 < shots.length && T >= shots[i + 1][0]) i++;
  const t0 = shots[i][0], t1 = i + 1 < shots.length ? shots[i + 1][0] : t0 + 9;
  return shots[i][1](T, t0, t1) + (i ? v4Cut(T, t0) : '') + (i + 1 < shots.length ? v4Cut(T, t1) : '');
}
const v4Sun = (right = true, op = 0.42) => `<defs><linearGradient id="v4Sun" x1="${right ? 1 : 0}" y1="0" x2="${right ? 0.35 : 0.65}" y2="0.6"><stop offset="0" stop-color="#FFE9A8" stop-opacity="${op}"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></linearGradient></defs><rect x="-200" y="-200" width="2400" height="1600" fill="url(#v4Sun)"/>`;
function v4Plate(k, cam, o = {}) { // 배경 판: depth(원근), blur(흐림), mirror(좌우 뒤집기)
  const c = o.mirror ? [1920 - cam[0], cam[1], cam[2]] : cam; let pl = qdPlate(k, c, o.depth == null ? 1.0 : o.depth);
  if (o.mirror) pl = `<g transform="translate(1920 0) scale(-1 1)">${pl}</g>`;
  return o.blur ? `<g filter="url(#rsBlur)">${pl}</g>` : pl;
}
const v4Jolt = (T, tt, A = 9) => { const u = T - tt; return u > 0 && u < 0.6 ? A * Math.exp(-9 * u) * Math.cos(38 * u) : 0; };
const v4Pose = (base, o) => Object.assign({}, base, o);
const V4SIT = () => Object.assign({}, P['서기'], rsArmType);
E['v4긴장'] = Object.assign({}, E['z기본'], zWorryBrow, { mouth: 'M190 239 L210 239', mouthFill: 'none', fxUnder: null });   // 굳은 얼굴(땀 없이, 눈썹만 걱정)
E['v4눈감음'] = Object.assign({}, E['rs평온'], { eyeL: 'M152 190 Q165 197 178 190', eyeR: 'M222 190 Q235 197 248 190', eyeFill: 'none', eyeSW: 6 });
const V4_CLK = { svg: `<rect x="-4" y="-8" width="50" height="16" rx="6" fill="#3A4252" stroke="${INK}" stroke-width="4"/><circle cx="36" cy="0" r="3.5" fill="#FF5A4A"/>`, follow: true };
const V4_PEN = { svg: `<rect x="-2" y="-5" width="58" height="10" rx="4" fill="${RS.BLUE}" stroke="${INK}" stroke-width="3"/>`, follow: true };
const V4_PAPER = (yl) => ({ svg: `<g transform="rotate(90)"><rect x="-34" y="-86" width="68" height="92" rx="4" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-24" y="-72" width="40" height="6" rx="3" fill="#C5CCD8"/><rect x="-24" y="-58" width="48" height="6" rx="3" fill="#C5CCD8"/>${yl ? `<rect x="-26" y="-44" width="52" height="11" rx="3" fill="${RS.YL}" stroke="${INK}" stroke-width="2"/>` : `<rect x="-24" y="-44" width="44" height="6" rx="3" fill="#C5CCD8"/>`}<rect x="-24" y="-24" width="36" height="6" rx="3" fill="#C5CCD8"/></g>`, follow: true });
/* 어깨에 얹힌 한 줄(서 있는 인물·앉은 인물 공통). c: char 옵션(x, y, sy), s: 크기, k: 0 어깨 ~ 1 입 */
function v4Yoke(t, c, s, o = {}) {
  const sy = c.sy || 1, sc = c.s || 1, ZP = (lx, ly) => [c.x + (lx - 200) * sc, c.y + (ly - 560) * sc * sy], a0 = ZP(206, 290), a1 = ZP(200, 238), k = clamp(o.k || 0, 0, 1), e = easeInOut(k), wob = Math.sin(t * 3.1) * 1.2 * (1 - k);
  const x = lerp(a0[0], a1[0], e), y = lerp(a0[1], a1[1], e) - 26 * Math.sin(Math.PI * e) * sc, ss = lerp(s, 0.31 * sc, e) * (1 + 0.1 * Math.sin(Math.PI * k));
  return (k <= 0 && s > 0.42 ? `<ellipse cx="${f1(x)}" cy="${f1(y + 40 * s + 6)}" rx="${f1(300 * s)}" ry="9" fill="${INK}" opacity=".2"/>` : '') + rsStrip(x, y, ss, { rot: lerp(-9 + wob - 3 * ((o.press || 0) - 0.3), 0, e) });
}
function v4Thud(T, tt, x, y, s) { // 한 줄이 '쿵' 내려앉을 때의 먼지와 충격선
  const u = T - tt; if (u <= 0 || u >= 0.5) return ''; let w = puff(x, y + 30, T, tt, 0.55, '#FFF6CF');
  for (let i = 0; i < 5; i++) { const an = -Math.PI / 2 + (i - 2) * 0.42, r0 = 150 * s + 70 + 60 * u, r1 = r0 + 34; w += `<line x1="${f1(x + Math.cos(an) * r0 * 1.5)}" y1="${f1(y - 30 + Math.sin(an) * r0 * 0.5)}" x2="${f1(x + Math.cos(an) * r1 * 1.5)}" y2="${f1(y - 30 + Math.sin(an) * r1 * 0.5)}" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity="${rsOp(1 - u / 0.5)}"/>`; }
  return w;
}
