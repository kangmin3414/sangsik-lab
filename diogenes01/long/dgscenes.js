/* 디오게네스 편 — 인트로~1막 v2 (SCRIPT_v2 / STORYBOARD.md). 이름은 모두 dg 접두사. fatigue01의 fscenes·fscenes2를 도구로 쓴다.
   규칙: 해는 늘 화면 오른쪽 위 → 그림자는 왼쪽 · 배낭은 어깨끈이 보이고 몸 뒤에서 이어짐 · 원인 다음 결과 · 앉으면 엉덩이가 땅 위.
   v2: 장면 전체를 덮는 막은 fFull(장면 전체가 자막 자리 때문에 0.88로 줄어 그려진다) · 발과 땅은 자막 띠 위((땅 - cy) × z ≤ 400)
       · 물건을 쥔 손은 물건 위에 같은 자리로 한 번 더 그린다(손이 물건을 덮도록) · 손 없이 뜨는 물건 없음. */
Object.assign(QBG, { genkan: 'ai/genkan.png', subway: 'ai/subway2.png', corinth: 'ai/corinth.png', fount: 'ai/fount.png', street: 'ai/street.png' });
['dghall', 'dgstairs', 'dgcor', 'dgtitle', 'dgjar', 'dginv', 'dgfount', 'dgdog'].forEach(k => CAMS[k] = 'fixed');
const DG_SUN = [1820, 60];
const dgK = (t0, t1, x) => clamp((x - t0) / (t1 - t0), 0, 1);
const dgPose = (base, o) => Object.assign({}, typeof base === 'string' ? P[base] : base, o);
const dgDefs = () => `<defs>
<radialGradient id="dgSunG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE6A0" stop-opacity=".38"/><stop offset="1" stop-color="#FFE08A" stop-opacity="0"/></radialGradient>
<linearGradient id="dgBeam" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1B8" stop-opacity=".75"/><stop offset="1" stop-color="#FFF1B8" stop-opacity="0"/></linearGradient>
<filter id="dgSil" filterUnits="userSpaceOnUse" x="-800" y="-800" width="4000" height="3000"><feColorMatrix type="matrix" values="0 0 0 0 0.07 0 0 0 0 0.04 0 0 0 0 0.13 0 0 0 1 0"/></filter>
</defs>`;
// 배경 그림의 위치(카메라 깊이 depth로 따로 움직임)를 장면 좌표로 바꾼다: u, v = 그림 가로·세로 비율
const dgPB = (cam, depth) => { const [cx, cy, z] = cam, zb = 1 + (z - 1) * depth; let bx = 960 + (cx - 960) * depth, by = 560 + (cy - 560) * depth;
  const hx = 960 / 0.88 / zb; bx = clamp(bx, -150 + hx + 4, 2070 - hx - 4); by = clamp(by, -30 + 573.6 / zb + 4, 1220 - 653.6 / zb - 4); return [bx, by, zb]; };
const dgPlate = (k, cam, depth = 0.6, extra = '') => { const [bx, by, zb] = dgPB(cam, depth);
  return `<g transform="translate(960 560) scale(${f1(zb * 1000) / 1000}) translate(${f1(-bx)} ${f1(-by)})"><image href="${QBG[k]}" x="-150" y="-30" width="2220" height="1250" preserveAspectRatio="xMidYMid slice"/>${extra}</g>`; };
const dgUV = (cam, depth, u, v) => { const [bx, by, zb] = dgPB(cam, depth); return [cam[0] + (-150 + u * 2220 - bx) * zb / cam[2], cam[1] + (-30 + v * 1250 - by) * zb / cam[2]]; };
const dgScr = (cam, x, y) => [960 + (x - cam[0]) * cam[2], 560 + (y - cam[1]) * cam[2]]; // 장면 좌표 → 화면(0.88 축소 전)
const dgSunWarm = (x, y, r, k) => k > 0.01 ? `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="url(#dgSunG)" opacity="${f1(k * 0.6 * 100) / 100}"/>` : '';
const dgHand = (x, y, s = 1) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(22 * s)}" fill="#fff" stroke="${INK}" stroke-width="${f1(7 * s)}"/>`;
const dgThumb = (x, y, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><rect x="-4" y="-66" width="22" height="52" rx="11" fill="#fff" stroke="${INK}" stroke-width="7"/><circle r="27" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-14 -4 h22 M-14 9 h22" stroke="${INK}" stroke-width="4" stroke-linecap="round" opacity=".45"/></g>`;
// 볼록 껍질(그림자 다각형)
function dgHull(pts) { pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]); const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = []; for (const p of pts) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of pts.slice().reverse()) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return lo.slice(0, -1).concat(up.slice(0, -1)); }
const dgRot = (px, py, ox, oy, deg) => { const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [ox + (px - ox) * c - (py - oy) * s, oy + (px - ox) * s + (py - oy) * c]; };

/* ---------- 물건 아이콘(알림·배낭 공통). 원점 = 가운데, 폭 약 100 ---------- */
function dgItem(kind) {
  if (kind === 'remote') return `<g transform="rotate(-8)"><rect x="-20" y="-58" width="40" height="116" rx="14" fill="#2B2F3A" stroke="${INK}" stroke-width="6"/><circle cy="-36" r="9" fill="#E5484D" stroke="${INK}" stroke-width="3"/>${[-10, 8, 26].map(y => `<circle cx="-8" cy="${y}" r="5" fill="#C9CED8"/><circle cx="8" cy="${y}" r="5" fill="#C9CED8"/>`).join('')}</g>`;
  if (kind === 'phones') return `<path d="M-42 14 Q-44 -52 0 -52 Q44 -52 42 14" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M-42 14 Q-44 -52 0 -52 Q44 -52 42 14" fill="none" stroke="#7CC7FF" stroke-width="8" stroke-linecap="round"/><rect x="-60" y="-6" width="32" height="50" rx="13" fill="#7CC7FF" stroke="${INK}" stroke-width="6"/><rect x="28" y="-6" width="32" height="50" rx="13" fill="#7CC7FF" stroke="${INK}" stroke-width="6"/>`;
  if (kind === 'key') return `<g transform="rotate(-24)"><circle cx="-54" cy="0" r="14" fill="none" stroke="#9C978C" stroke-width="7"/><rect x="-42" y="-27" width="46" height="54" rx="17" fill="#2B2F3A" stroke="${INK}" stroke-width="6"/><circle cx="-19" cy="-7" r="8" fill="#F2C14E"/><path d="M4 -9 L58 -9 L58 0 L50 0 L50 9 L38 9 L38 3 L30 3 L30 9 L4 9 Z" fill="#D8D3C8" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>`;
  if (kind === 'cloud') return `<rect x="-48" y="-38" width="96" height="78" rx="8" fill="#E9F2FC" stroke="${INK}" stroke-width="6"/><path d="M-30 20 q-14 -2 -12 -16 q2 -14 18 -12 q6 -16 24 -12 q14 4 14 18 q14 2 12 14 q-2 10 -14 8 Z" fill="#7FB3E6" stroke="${INK}" stroke-width="4"/><circle cx="36" cy="-26" r="14" fill="#E5484D" stroke="${INK}" stroke-width="3"/>${fT(36, -19, '!', 20, '#fff')}`;
  if (kind === 'boxes') { const b = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-30" y="-24" width="60" height="48" rx="4" fill="#C99566" stroke="${INK}" stroke-width="5"/><path d="M-30 -7 L30 -7 M0 -24 L0 -7" stroke="#8A5A34" stroke-width="6"/></g>`; return b(-30, 18, -4) + b(30, 18, 5) + b(0, -26, -2); }
  return ''; }
const DG_NOTI = [['OTT 구독료 결제', '#E5484D', 'remote'], ['음악 구독료 결제', '#7CC7FF', 'phones'], ['자동차 할부 12/36회차', '#F2C14E', 'key'], ['클라우드 용량 부족', '#9FC7F0', 'cloud'], ['택배 3개 도착', '#C99566', 'boxes']];
function dgNotiCard(i) { const [txt, c, kind] = DG_NOTI[i];
  return `<rect x="-262" y="-44" width="540" height="88" rx="20" fill="${INK}" opacity=".25"/><rect x="-270" y="-48" width="540" height="88" rx="20" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-254" y="-36" width="64" height="64" rx="16" fill="${c}" stroke="${INK}" stroke-width="4"/><g transform="translate(-222 -4) scale(.5)">${dgItem(kind)}</g>${fT(-172, 8, txt, 34, INK, { anchor: 'start' })}`; }

/* ---------- 제로의 배낭: 몸 뒤(dgPackBack) + 어깨끈(dgPackStrap). size 0~1.3 ---------- */
const DG_PK = [[-0.27, 4, -14], [0.28, 8, 12], [0.04, -30, -6], [-0.06, 10, 8], [0.16, 16, 0]]; // 알림 순서대로: 가로 위치(폭 비율), 높이, 기울기
const dgPackGeo = size => { const w = 210 + 260 * size; return { w, top: 250 - (40 + 330 * size), bot: 436, rx: w * 0.36 }; };
function dgPackBack(x, y, s, size, o = {}) { const lean = o.lean || 0, { w, top, bot, rx } = dgPackGeo(size), cx = 200, items = Math.min(o.items || 0, 5), oy = top + 22;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000}) translate(-200 -560) rotate(${f1(lean)} 200 300)">`;
  h += `<rect x="${f1(cx - w / 2 - 34)}" y="${f1(lerp(top, bot, 0.45))}" width="60" height="${f1((bot - top) * 0.42)}" rx="22" fill="#3F5277" stroke="${INK}" stroke-width="7"/><rect x="${f1(cx + w / 2 - 26)}" y="${f1(lerp(top, bot, 0.5))}" width="60" height="${f1((bot - top) * 0.38)}" rx="22" fill="#3F5277" stroke="${INK}" stroke-width="7"/><rect x="${f1(cx + w / 2 - 14)}" y="${f1(lerp(top, bot, 0.5) - 40)}" width="34" height="56" rx="10" fill="#9ED8FF" stroke="${INK}" stroke-width="5"/>`;
  h += `<path d="M${f1(cx - w / 2)} ${bot} L${f1(cx - w / 2)} ${f1(top + w * 0.32)} Q${f1(cx - w / 2)} ${f1(top)} ${cx} ${f1(top)} Q${f1(cx + w / 2)} ${f1(top)} ${f1(cx + w / 2)} ${f1(top + w * 0.32)} L${f1(cx + w / 2)} ${bot} Q${cx} ${bot + 16} ${f1(cx - w / 2)} ${bot} Z" fill="#4F6489" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  // 윗구멍(어두운 입구) → 물건(입구 앞턱 아래는 잘라 낸다) → 앞턱
  h += `<ellipse cx="${cx}" cy="${f1(oy)}" rx="${f1(rx)}" ry="22" fill="#26324A" stroke="${INK}" stroke-width="6"/>`;
  if (items > 0) { h += `<clipPath id="dgPkC"><rect x="-400" y="-900" width="1200" height="${f1(oy + 900)}"/><ellipse cx="${cx}" cy="${f1(oy)}" rx="${f1(rx)}" ry="22"/></clipPath><g clip-path="url(#dgPkC)">`;
    for (let i = 0; i < items; i++) { const [dx, dy, r] = DG_PK[i]; h += `<g transform="translate(${f1(cx + dx * w)} ${f1(oy - 34 + dy)}) rotate(${r}) scale(1.15)">${dgItem(DG_NOTI[i][2])}</g>`; }
    h += `</g>`; }
  h += `<path d="M${f1(cx - rx)} ${f1(oy)} A${f1(rx)} 22 0 0 0 ${f1(cx + rx)} ${f1(oy)} L${f1(cx + rx + 10)} ${f1(oy + 8)} A${f1(rx + 10)} 30 0 0 1 ${f1(cx - rx - 10)} ${f1(oy + 8)} Z" fill="#3B4C70" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  return h + `</g>`; }
// 배낭 몸통 꼭짓점(장면 좌표) — 그림자 계산용
function dgPackPts(x, y, s, size, lean) { const { w, top, bot } = dgPackGeo(size);
  return [[200 - w / 2, bot], [200 - w / 2, top + w * 0.3], [200 - w * 0.3, top + 8], [200, top], [200 + w * 0.3, top + 8], [200 + w / 2, top + w * 0.3], [200 + w / 2, bot]].map(([lx, ly]) => { const [rx, ry] = dgRot(lx, ly, 200, 300, lean); return ptOf(x, y, s, rx, ry); }); }
function dgPackStrap(x, y, s) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000}) translate(-200 -560)"><path d="M156 262 Q150 330 158 404 M244 262 Q250 330 242 404" fill="none" stroke="${INK}" stroke-width="24" stroke-linecap="round"/><path d="M156 262 Q150 330 158 404 M244 262 Q250 330 242 404" fill="none" stroke="#3E4C68" stroke-width="14" stroke-linecap="round"/><rect x="146" y="338" width="108" height="10" rx="5" fill="#3E4C68" stroke="${INK}" stroke-width="4"/></g>`; }

/* ---------- 1. 현관: 폰 알림 → 알림 속 물건이 배낭으로 쿵 → 흐뭇하게 보다가 현관문으로 ---------- */
function dghallScene(t, lt, a) {
  const ph = a.ph, F = 1000, s = 1, T = [0.3, 1.1, 1.9, 2.7, 3.5], FLY = 0.35, LAND = 0.85, tGo = 1.5;
  const nIn = ph === 0 ? T.filter(v => lt > v + LAND).length : 5, size = 0.3 + 0.16 * nIn;
  let squash = 0; if (ph === 0) T.forEach(v => { const d = lt - (v + LAND); if (d > 0 && d < 0.3) squash = Math.max(squash, Math.sin(d / 0.3 * Math.PI)); });
  const go = ph === 1 ? easeInOut(dgK(tGo, tGo + 1.7, lt)) : 0, x = lerp(1000, 430, go), walking = ph === 1 && lt > tGo && lt < tGo + 1.7;
  const cam = ph === 0 ? [980, 640, 1.08] : qLerpCam((lt - tGo) / 1.7, [980, 640, 1.08], [700, 640, 1.08]);
  const phonePose = dgPose('서기', { armR: [[252, 285], [284, 342], [246, 360]], hR: [240, 358] });
  let pose = phonePose, ex, look;
  if (ph === 0) { ex = exprAt([[0, 'z기본'], [1.9, 'z멍'], [3.0, 'z당황']], lt); look = [0.5, 0.8]; }
  else { ex = lt < tGo ? fEx('z하트눈') : fEx('z결심'); look = lt < tGo ? [-0.2, -1] : [-1, 0.1]; if (walking) pose = dgPose(walkPose(lt * 7, 0.7), { armR: phonePose.armR, hR: phonePose.hR }); }
  const lean = walking ? Math.sin(lt * 14) * 4 : 0;
  let w = qShadow(x, F, 80) + dgPackBack(x, F, s, size, { items: nIn, lean });
  const sq = `translate(${f1(x)} ${F}) scale(${f1((1 + squash * 0.06) * 1000) / 1000} ${f1((1 - squash * 0.09) * 1000) / 1000}) translate(${f1(-x)} ${-F})`;
  const [hx, hy] = ptOf(x, F, s, pose.hR[0], pose.hR[1] + (walking ? 0 : 0)), flash = ph === 0 && T.some(v => lt > v && lt < v + 0.25);
  const phone = `<g transform="translate(${f1(hx)} ${f1(hy - 34)}) rotate(-10)"><rect x="-19" y="-34" width="38" height="66" rx="8" fill="#2B2F3A" stroke="${INK}" stroke-width="5"/><rect x="-13" y="-26" width="26" height="46" rx="4" fill="${flash ? '#FFFFFF' : '#9ED8FF'}"/></g>`;
  w += `<g transform="${sq}">` + Z({ x, y: F, s, t, pose, ex, look }) + dgPackStrap(x, F, s) + phone + dgHand(hx, hy, s) + `</g>`;
  let over = '';
  // 알림 카드: 폰 화면에서 튀어나와 오른쪽 위로 쌓인다(ph1 처음에 사라짐)
  const [psx, psy] = dgScr(cam, hx, hy - 40), slot = i => [1600, 96 + i * 104], fadeOut = ph === 1 ? 1 - dgK(0, 0.45, lt) : 1;
  if (fadeOut > 0) T.forEach((v, i) => { if (ph === 0 && lt < v) return; const k0 = ph === 0 ? clamp((lt - v) / FLY, 0, 1) : 1, [sx2, sy2] = slot(i);
    over += `<g opacity="${f1(fadeOut * 100) / 100}" transform="translate(${f1(lerp(psx, sx2, easeOut(k0)))} ${f1(lerp(psy, sy2, easeOut(k0)))}) scale(${f1(lerp(0.12, 1, easeOutBack(k0)) * 1000) / 1000})">${dgNotiCard(i)}</g>`; });
  // 알림 속 물건이 카드에서 빠져나와 배낭 윗구멍으로 → 쿵
  if (ph === 0) T.forEach((v, i) => { const d = lt - (v + FLY); if (d < 0 || d > LAND - FLY) return; const k = d / (LAND - FLY), [ix, iy] = slot(i);
    const wx0 = cam[0] + (ix - 222 - 960) / cam[2], wy0 = cam[1] + (iy - 4 - 560) / cam[2], g = dgPackGeo(0.3 + 0.16 * i), [tx, ty] = ptOf(x, F, s, 200 + DG_PK[i][0] * g.w, g.top + DG_PK[i][1]);
    w += `<g transform="translate(${f1(lerp(wx0, tx, k))} ${f1(lerp(wy0, ty, k) - Math.sin(k * Math.PI) * 170)}) rotate(${f1(k * 300)}) scale(${f1(lerp(0.46, 1.15, k) * 1000) / 1000})">${dgItem(DG_NOTI[i][2])}</g>`; });
  if (ph === 0) T.forEach((v, i) => { const t0 = v + LAND; if (lt < t0 || lt > t0 + 0.55) return; const g = dgPackGeo(0.3 + 0.16 * (i + 1)), [kx, ky] = dgScr(cam, ...ptOf(x, F, s, 200 - g.w / 2 - 90, g.top + 60));
    over += fx(t, t - lt + t0, t - lt + t0 + 0.55, f1(kx), f1(ky), '쿵', '#fff', { size: 66, rot: -8 }); });
  // ph1: 배낭 속 물건마다 하트 → 흐뭇
  if (ph === 1 && lt < tGo + 0.2) [0, 2, 4].forEach((i, j) => { const g = dgPackGeo(size), [px, py] = dgScr(cam, ...ptOf(x, F, s, 200 + DG_PK[i][0] * g.w, g.top - 70 + DG_PK[i][1]));
    over += fx(t, t - lt + 0.15 + j * 0.3, t - lt + tGo + 0.2, f1(px), f1(py), '♥', '#FF7A9A', { size: 46, rot: (j - 1) * 10 }); });
  return dgDefs() + dgPlate('genkan', cam, 0.6) + qCam(cam, w) + over;
}

/* ---------- 2. 지하철역 계단: 커진 배낭이 출구 햇빛을 가리고, 결국 제로를 뒤로 끌어내린다 ---------- */
const DG_ST = { x0: -138, y0: 1120, w: 110, h: 58, n: 12 }; // 계단 맨 위 = 출구 창 아랫단(그림 subway2)
const dgStep = i => [DG_ST.x0 + DG_ST.w * (i + 0.5), DG_ST.y0 - DG_ST.h * (i + 1)]; // 디딤판 윗면 가운데
function dgStairs() { const { x0, y0, w, h, n } = DG_ST, xt = x0 + w * n, yt = y0 - h * n;
  let d = `M${x0 - 60} ${y0 + 400} L${x0 - 60} ${y0}`; for (let i = 0; i < n; i++) d += ` L${x0 + w * i} ${y0 - h * i} L${x0 + w * i} ${y0 - h * (i + 1)}`; d += ` L2400 ${yt} L2400 ${y0 + 400} Z`;
  let g = `<path d="${d}" fill="#98A1B3" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  for (let i = 0; i < n; i++) { const x = x0 + w * i, y = y0 - h * (i + 1); g += `<rect x="${x + 4}" y="${y + 4}" width="${w - 4}" height="12" fill="#D6DBE4"/><rect x="${x + 4}" y="${y + 4}" width="26" height="9" fill="#E9C46A"/><path d="M${x + 6} ${y + 22} L${x + 6} ${y + h - 6}" stroke="#7E8798" stroke-width="5" opacity=".6"/>`; }
  g += `<rect x="${xt + 4}" y="${yt + 4}" width="${2400 - xt}" height="12" fill="#D6DBE4"/>`;
  // 벽 손잡이: 계단 기울기와 나란히, 벽에 박힌 받침
  const r0 = [x0, y0 - h - 300], r1 = [xt, yt - 300], r2 = [xt + 160, yt - 300];
  for (let k = 0.08; k < 1; k += 0.2) { const px = lerp(r0[0], r1[0], k), py = lerp(r0[1], r1[1], k); g += `<path d="M${f1(px)} ${f1(py)} L${f1(px)} ${f1(py + 30)}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><circle cx="${f1(px)}" cy="${f1(py + 32)}" r="9" fill="#8A8F9C" stroke="${INK}" stroke-width="4"/>`; }
  g += `<path d="M${r0[0]} ${r0[1]} L${r1[0]} ${r1[1]} L${r2[0]} ${r2[1]}" fill="none" stroke="${INK}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><path d="M${r0[0]} ${r0[1]} L${r1[0]} ${r1[1]} L${r2[0]} ${r2[1]}" fill="none" stroke="#B4BAC6" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
  return g; }
const DG_LD = [-0.55, 0.835]; // 출구에서 들어오는 빛의 방향
function dgstairsScene(t, lt, a) {
  const ph = a.ph, s = 0.78;
  let step, hop = 0, size, lean, ex, rot = 0, pose = '서기', look = [0.9, -0.5], tP = 99;
  if (ph === 0) { const H = [0.25, 0.95, 1.65]; step = 3; H.forEach(v => { const f = dgK(v, v + 0.45, lt); step += easeInOut(f); hop = Math.max(hop, Math.sin(f * Math.PI) * 30); });
    size = lerp(0.9, 1.2, dgK(0, 2.4, lt)); lean = lerp(4, 26, dgK(0.7, 2.4, lt)); ex = exprAt([[0, 'z결심'], [1.5, 'z당황']], lt); }
  else { tP = fAt(a, '끌고', 2.4); const sl = easeOut(dgK(tP - 0.05, tP + 0.9, lt)); step = 6 - 2 * sl; size = 1.2;
    lean = lt < tP ? 26 + Math.sin(t * 9) * 3 : 26 - 14 * dgK(tP - 0.05, tP + 0.4, lt); rot = -13 * dgK(tP - 0.1, tP + 0.3, lt) + (lt > tP + 0.9 ? Math.sin(t * 7) * 1.5 : 0);
    ex = lt < tP ? fEx('z당황') : fEx('z울먹'); look = lt < tP ? [0.9, -0.5] : [1, -0.6];
    if (lt > tP - 0.1) pose = dgPose('서기', { armL: [[148, 285], [214, 236], [276, 214]], hL: [282, 210], armR: [[252, 285], [306, 238], [360, 210]], hR: [366, 206], legL: [[180, 412], [200, 470], [214, 522]], fL: [226, 534, -10], legR: [[220, 412], [250, 466], [276, 514]], fR: [288, 526, -14] }); }
  const i0 = Math.floor(step), fr = step - i0, [ax0, ay0] = dgStep(i0), [ax1, ay1] = dgStep(i0 + 1), x = lerp(ax0, ax1, fr), F = lerp(ay0, ay1, fr) - hop;
  const cam = ph === 0 ? [810, 520, 1.15] : [790, 500, 1.18];
  let w = dgStairs();
  w += `<path d="M1182 424 L1720 150 L${f1(1720 + DG_LD[0] * 1500)} ${f1(150 + DG_LD[1] * 1500)} L${f1(1182 + DG_LD[0] * 1000)} ${f1(424 + DG_LD[1] * 1000)} Z" fill="url(#dgBeam)" opacity=".6"/>`; // 출구에서 쏟아지는 햇빛
  w += qShadow(x, F, 52);
  w += `<g transform="rotate(${f1(rot)} ${f1(x)} ${f1(F)})">` + dgPackBack(x, F, s, size, { lean, items: 5 }) + Z({ x, y: F, s, t, pose, ex, look }) + dgPackStrap(x, F, s) + `</g>`;
  // 배낭 그림자: 배낭 몸통을 빛 방향으로 밀어 낸 영역 → 제로를 덮는다
  const shade = clamp((lean - 6) / 14, 0, 1);
  if (shade > 0) { const pts = dgPackPts(x, F, s, size, lean).map(([px, py]) => dgRot(px, py, x, F, rot)), L = 900;
    const hull = dgHull(pts.concat(pts.map(([px, py]) => [px + DG_LD[0] * L, py + DG_LD[1] * L])));
    w += `<path d="M${hull.map(p => p.map(f1).join(' ')).join(' L')} Z" fill="#100A22" opacity="${f1(shade * 0.46 * 100) / 100}"/>`; }
  let over = '';
  if (ph === 1 && lt > tP) { const [px, py] = dgScr(cam, x + 40, F - 30); over += fx(t, t - lt + tP, t + 9, f1(px + 150), f1(py - 40), '주르륵', '#fff', { size: 58, rot: 12 });
    const k = dgK(tP, tP + 0.9, lt); if (k > 0 && k < 1) for (let j = 0; j < 3; j++) { const [mx, my] = dgScr(cam, x + 70 + j * 30, F - 160 + j * 60); over += `<path d="M${f1(mx)} ${f1(my)} l${f1(70 - j * 10)} ${f1(-36 + j * 5)}" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="${f1((1 - k) * 0.9 * 100) / 100}"/>`; } }
  return dgDefs() + dgPlate('subway', cam, 1.0) + qCam(cam, w) + over;
}

/* ---------- 3. 코린토스: 왕의 그림자 → "좀 비켜 주시오. 햇빛 가리니까." ---------- */
const DG_GROUND = 1010, DG_JAR = [470, DG_GROUND], DG_DX = 760, DG_AX = 1190, DG_AX2 = 1540;
function dgJar(x, y, s = 1, o = {}) { // 커다란 항아리(피토스). 원점 = 바닥 가운데. 입구 가운데 = (0, -470)
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><path d="M-110 0 Q-190 -130 -170 -300 Q-150 -430 -96 -470 L96 -470 Q150 -430 170 -300 Q190 -130 110 0 Z" fill="#C2703F" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>` +
    `<ellipse cx="0" cy="-470" rx="104" ry="24" fill="#8E4A26" stroke="${INK}" stroke-width="8"/><ellipse cx="0" cy="-470" rx="80" ry="14" fill="#3A2216"/>` +
    `<path d="M-176 -250 Q0 -220 176 -250" fill="none" stroke="#2B1A12" stroke-width="16"/><path d="M-176 -250 Q0 -220 176 -250" fill="none" stroke="#E0A06A" stroke-width="6" stroke-dasharray="18 14"/>` +
    `<path d="M-130 -380 Q-150 -300 -140 -200" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".25"/>${o.extra || ''}</g>`; }
const dgJarLip = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><path d="M-104 -470 A104 24 0 0 0 104 -470 L80 -470 A80 14 0 0 1 -80 -470 Z" fill="#8E4A26" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/></g>`;
const dgStaff = (x0, y0, x1, y1) => { const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  return `<path d="M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y1)} q${f1(ux * 30 + uy * 26)} ${f1(uy * 30 - ux * 26)} ${f1(uy * 40)} ${f1(-ux * 40)}" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><path d="M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y1)} q${f1(ux * 30 + uy * 26)} ${f1(uy * 30 - ux * 26)} ${f1(uy * 40)} ${f1(-ux * 40)}" fill="none" stroke="#7A5434" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`; };
const dgSackG = `<path d="M-54 0 Q-74 -52 -42 -80 Q-24 -94 -16 -100 L16 -100 Q24 -94 42 -80 Q74 -52 54 0 Q0 12 -54 0 Z" fill="#A8875A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-16 -100 Q-32 -124 -12 -120 Q0 -132 12 -120 Q32 -124 16 -100" fill="#A8875A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-20 -98 Q0 -88 20 -98" fill="none" stroke="#5A3E28" stroke-width="8" stroke-linecap="round"/><path d="M-32 -44 q10 16 4 34 M22 -62 q8 20 2 40" fill="none" stroke="${INK}" stroke-width="3" opacity=".3"/>`;
const dgSack = (x, y, s = 1, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${f1(s * 1000) / 1000})">${dgSackG}</g>`;
// 개: pose 'curl'(웅크려 잠) | 'sit'(앉음). 머리는 정면, 귀가 축 늘어진 누렁개
function dgDog(x, y, s, t, o = {}) { const pose = o.pose || 'curl', yawn = o.yawn || 0, C = '#E2B35C', D = '#B97E3A', fl = o.flip ? -1 : 1;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * fl * 1000) / 1000} ${f1(s * 1000) / 1000})">`, hx, hy, tilt = 0;
  if (pose === 'curl') {
    h += `<ellipse cx="-4" cy="-44" rx="88" ry="46" fill="${C}" stroke="${INK}" stroke-width="7"/><path d="M-50 -70 Q-30 -84 0 -84" fill="none" stroke="${D}" stroke-width="10" stroke-linecap="round" opacity=".6"/>`;
    h += `<ellipse cx="-46" cy="-30" rx="38" ry="28" fill="${C}" stroke="${INK}" stroke-width="6"/><ellipse cx="-30" cy="-6" rx="24" ry="11" fill="${C}" stroke="${INK}" stroke-width="5"/>`;
    h += `<path d="M-88 -34 Q-104 2 -56 6 Q-14 8 6 -4" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M-88 -34 Q-104 2 -56 6 Q-14 8 6 -4" fill="none" stroke="${C}" stroke-width="11" stroke-linecap="round"/>`;
    h += `<ellipse cx="44" cy="-6" rx="24" ry="11" fill="${C}" stroke="${INK}" stroke-width="5"/><ellipse cx="80" cy="-6" rx="24" ry="11" fill="${C}" stroke="${INK}" stroke-width="5"/>`;
    hx = 62; hy = -40 - 26 * yawn; tilt = 10 - 10 * yawn;
  } else {
    const wag = Math.sin(t * 9) * 14;
    h += `<path d="M-36 -40 Q-80 -50 -84 -96" fill="none" stroke="${INK}" stroke-width="18" stroke-linecap="round" transform="rotate(${f1(wag)} -36 -40)"/><path d="M-36 -40 Q-80 -50 -84 -96" fill="none" stroke="${C}" stroke-width="9" stroke-linecap="round" transform="rotate(${f1(wag)} -36 -40)"/>`;
    h += `<ellipse cx="-26" cy="-34" rx="34" ry="30" fill="${C}" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="-74" rx="44" ry="62" fill="${C}" stroke="${INK}" stroke-width="7"/>`;
    h += `<path d="M10 -70 L12 -8 M34 -70 L34 -8" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M10 -70 L12 -8 M34 -70 L34 -8" stroke="${C}" stroke-width="9" stroke-linecap="round"/><ellipse cx="12" cy="-6" rx="17" ry="9" fill="${C}" stroke="${INK}" stroke-width="5"/><ellipse cx="36" cy="-6" rx="17" ry="9" fill="${C}" stroke="${INK}" stroke-width="5"/>`;
    hx = 10; hy = -146; tilt = o.tilt || 0;
  }
  h += `<g transform="translate(${hx} ${f1(hy)}) rotate(${f1(tilt)})"><circle r="40" fill="${C}" stroke="${INK}" stroke-width="7"/><path d="M-28 -30 Q-62 -26 -58 18 Q-54 40 -38 30 Q-32 4 -22 -24 Z M28 -30 Q62 -26 58 18 Q54 40 38 30 Q32 4 22 -24 Z" fill="${D}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  h += o.eyes === 'shut' && yawn < 0.3 ? `<path d="M-22 -8 q8 7 16 0 M6 -8 q8 7 16 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` : yawn >= 0.3 ? `<path d="M-22 -10 q8 -6 16 0 M6 -10 q8 -6 16 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` : `<circle cx="-13" cy="-8" r="5.5" fill="${INK}"/><circle cx="13" cy="-8" r="5.5" fill="${INK}"/>`;
  h += `<ellipse cx="0" cy="13" rx="20" ry="14" fill="#F4E2B8" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="6" rx="8" ry="6" fill="${INK}"/>`;
  if (yawn > 0.05) h += `<ellipse cx="0" cy="${f1(24 + 6 * yawn)}" rx="${f1(10 + 6 * yawn)}" ry="${f1(4 + 16 * yawn)}" fill="#7A2A36" stroke="${INK}" stroke-width="4"/>`;
  return h + `</g></g>`; }
// 디오게네스: 벗어진 정수리, 옆머리, 턱수염(입은 보이게), 낡은 갈색 외투, 맨발
const DG_DHEAD = `<path d="M146 92 Q172 76 204 80" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".6"/>` +
  `<path d="M86 200 Q68 150 92 116 Q106 104 116 120 Q102 152 112 200 Z M314 200 Q332 150 308 116 Q294 104 284 120 Q298 152 288 200 Z" fill="#A9A39A" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
  `<path d="M110 204 Q118 262 156 294 Q178 320 200 336 Q222 320 244 294 Q282 262 290 204 Q278 238 252 250 Q236 264 222 262 Q210 274 200 274 Q190 274 178 262 Q164 264 148 250 Q122 238 110 204 Z" fill="#C9C3B8" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
  `<path d="M200 222 Q184 212 166 224 Q158 232 156 242 Q176 234 194 234 Z M200 222 Q216 212 234 224 Q242 232 244 242 Q224 234 206 234 Z" fill="#C9C3B8" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
const DIO = o => HALO(char(Object.assign({ goggles: 'none', vest: '#CDB892', patch: false, tee: true, vshade: 'rgba(0,0,0,0.16)', toga: '#7A5A3E', dress: o.sit ? null : '#7A5A3E', hairFront: DG_DHEAD }, o)));
const dgGreek = (c, o) => HALO(char(Object.assign({ goggles: 'none', vest: c.v, patch: false, tee: true, vshade: 'rgba(0,0,0,0.16)', toga: c.t, dress: c.d }, c.x || {}, o)));
// 한쪽 눈만 뜬 얼굴(콧방울 없음) — 말할 때는 qTalk('_dg1')
E['_dg1'] = Object.assign({}, E['z졸음'], { eyeR: 'M231 190 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0', fx: null, bR: [218, 150, 236, 144, 254, 150] });
// 알렉산더: 금빛 투구(붉은 깃털), 붉은 망토
const DG_HELM = (crest = '#C9302C') => `<path d="M80 150 Q78 40 200 30 Q322 40 320 150 L300 150 Q290 90 200 84 Q110 90 100 150 Z" fill="#E3B341" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M110 40 Q200 -60 290 40 Q240 10 200 12 Q160 10 110 40 Z" fill="${crest}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M130 22 Q200 -30 270 22" fill="none" stroke="${INK}" stroke-width="3" opacity=".4"/>`;
const ALEX = o => HALO(char(Object.assign({ goggles: 'none', vest: '#E3C26B', patch: false, tee: true, vshade: 'rgba(0,0,0,0.16)', toga: '#B33A3A', dress: '#B33A3A', hairFront: DG_HELM() }, o)));
const dgCape = (x, y, s, sw) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000}) translate(-200 -560)"><path d="M136 266 Q200 248 264 266 L${f1(340 + sw)} 522 Q${f1(200 + sw)} 546 ${f1(60 + sw)} 522 Z" fill="#8E2424" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M176 280 L${f1(130 + sw)} 524 M224 280 L${f1(270 + sw)} 524" stroke="${INK}" stroke-width="4" opacity=".35"/></g>`;
const dgAlex = (o, walking) => dgCape(o.x, o.y, o.s, Math.sin(o.t * (walking ? 9 : 2.5)) * (walking ? 12 : 4)) + ALEX(o);
const SOLD = (o, i) => HALO(char(Object.assign({ goggles: 'none', vest: '#B88A4A', patch: false, tee: true, vshade: 'rgba(0,0,0,0.18)', dress: '#7A4E2A', hairFront: DG_HELM(['#5A3A2A', '#2B2B2B', '#5A3A2A'][i % 3]), seed: 50 + i }, o)));
const DG_SPEAR_ARM = { armR: [[252, 285], [292, 330], [298, 372]], hR: [300, 376] };
function dgSoldier(x, y, ss, t, pose, ex, i) { const p = dgPose(pose, DG_SPEAR_ARM), [hx] = ptOf(x, y, ss, 300, 376), top = y - (560 + 110) * ss;
  return `<line x1="${f1(hx)}" y1="${f1(y - 4)}" x2="${f1(hx)}" y2="${f1(top)}" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><line x1="${f1(hx)}" y1="${f1(y - 4)}" x2="${f1(hx)}" y2="${f1(top)}" stroke="#7A5434" stroke-width="9" stroke-linecap="round"/><path d="M${f1(hx - 16)} ${f1(top + 6)} L${f1(hx)} ${f1(top - 58)} L${f1(hx + 16)} ${f1(top + 6)} Z" fill="#C9C3B8" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    SOLD({ x, y, s: ss, t, pose: p, ex, look: [-0.8, 0.1] }, i); }
// 앉아 기대기(땅에): 엉덩이가 땅, 다리는 오른쪽으로 쭉, 팔은 배 위
const DG_RECL = dgPose('서기', { armL: [[148, 285], [150, 350], [190, 362]], hL: [194, 362], armR: [[252, 285], [252, 350], [212, 356]], hR: [208, 356], legL: [[188, 412], [290, 420], [390, 424]], fL: [400, 420, 70], legR: [[212, 408], [310, 412], [404, 414]], fR: [414, 408, 70], dy: 0 });
const dgRecY = s => DG_GROUND - 4 + (560 - 420) * s; // 엉덩이(local 420)가 땅에 닿는 원점 y
// 왕의 그림자: 해가 오른쪽 위에서 낮게 → 발에서 왼쪽 위로 비스듬히 길게 눕는다(디오게네스를 덮도록)
const dgCast = (inner, fx0, op) => `<g opacity="${op}"><g filter="url(#dgSil)" transform="translate(${f1(fx0)} ${DG_GROUND}) matrix(1 0 1.21 0.6 0 0) translate(${f1(-fx0)} ${-DG_GROUND})">${inner}</g></g>`;
const dgCorProps = () => dgStaff(196, DG_GROUND, 318, DG_GROUND - 440) + dgSack(262, DG_GROUND, 0.9);
function dgcorScene(t, lt, a) {
  const ph = a.ph, s = 0.95, dy = dgRecY(s);
  E['_dga'] = qTalk('z결심', env(t)); E['_dgd'] = qTalk('_dg1', env(t) * 0.8);
  let ax = DG_AX, aPose = '서기', aEx = fEx('z결심'), aLook = [-0.8, 0.3], aWalk = false;
  if (ph === 0) { const k = easeOut(dgK(0.5, 2.6, lt)); ax = lerp(2250, DG_AX, k); aWalk = lt < 2.45; if (aWalk) aPose = walkPose(lt * 7.5, 0.9); }
  if (ph === 1) { aEx = fEx('_dga'); const tW = fAt(a, '무엇이든', 2.8); aPose = lt > tW - 0.2 ? dgPose('서기', { armL: [[148, 285], [90, 250], [40, 230]], hL: [34, 226], armR: [[252, 285], [310, 250], [360, 230]], hR: [366, 226] }) : '서기'; }
  if (ph === 3) aEx = exprAt([[0, 'z결심'], [fAt(a, '비켜', 1.4), 'z충격']], lt);
  if (ph === 4) { const k = easeInOut(dgK(0.15, 0.95, lt)); ax = lerp(DG_AX, DG_AX2, k); aWalk = k > 0 && k < 1; if (aWalk) aPose = walkPose(lt * 7.5, 0.6); aEx = fEx('z멍'); aLook = [-0.9, 0.2]; }
  if (ph === 5) { ax = DG_AX2; aEx = fEx('z멍'); }
  // 디오게네스: 햇볕에 졸다 → 그림자 → 한쪽 눈 → "비켜" 손짓 → 햇볕이 돌아오면 흐뭇
  let dEx = fEx('z졸음'), dPose = DG_RECL, dLook = [0.1, -0.6], tB = -1;
  if (ph === 0) dEx = exprAt([[0, 'z뿌듯'], [2.3, 'z졸음']], lt);
  if (ph === 2) { dEx = lt < 0.5 ? fEx('z졸음') : fEx('_dg1'); dLook = [0.8, -0.3]; }
  if (ph === 3) { dEx = fEx('_dgd'); dLook = [0.8, -0.3]; tB = fAt(a, '비켜', 1.4); if (lt > tB - 0.1 && lt < tB + 1.5) { const wv = (Math.sin((lt - tB) * 13) + 1) / 2; dPose = dgPose(DG_RECL, { armR: [[252, 285], [306, 250], [lerp(330, 372, wv), lerp(214, 230, wv)]], hR: [lerp(334, 378, wv), lerp(208, 226, wv)] }); } }
  if (ph >= 4) { dEx = ph === 4 && lt < 0.9 ? fEx('_dg1') : fEx('z뿌듯'); dLook = [0.2, -0.6]; }
  const CM = { 0: qLerpCam(lt / 3.0, [1000, 640, 1.0], [980, 650, 1.05]), 1: qLerpCam(lt / 3.5, [980, 650, 1.05], [1100, 720, 1.25]), 2: [900, 700, 1.7], 3: [900, 720, 1.4], 4: qLerpCam(lt / 2.4, [940, 700, 1.3], [960, 690, 1.1]), 5: qLerpCam(lt / 4, [930, 735, 1.3], [920, 740, 1.36]) };
  const cam = CM[ph];
  let w = dgCorProps() + dgJar(DG_JAR[0], DG_JAR[1], 1.05);
  w += dgDog(470, DG_GROUND, 0.8, t, { pose: 'curl', eyes: 'shut', yawn: ph === 4 ? Math.sin(dgK(0.9, 2.1, lt) * Math.PI) : 0 });
  w += qShadow(DG_DX + 90, DG_GROUND, 150, 0.5) + DIO({ x: DG_DX, y: dy, s, t, pose: dPose, ex: dEx, look: dLook, rot: -8, sit: true });
  if (tB > 0 && lt > tB - 0.1 && lt < tB + 1.5) { const [hx, hy] = ptOf(DG_DX, dy, s, 360, 214); w += `<path d="M${f1(hx + 36)} ${f1(hy - 40)} q24 24 0 52 M${f1(hx + 56)} ${f1(hy - 56)} q34 36 0 80" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity=".75"/>`; }
  // 병사 셋(앞줄 둘, 뒷줄 하나)이 창을 손에 쥐고 들어와 선다
  const sx0 = ph === 0 ? lerp(1500, 0, easeOut(dgK(0.8, 2.8, lt))) : ph === 5 ? 170 : 0, frozen = ph >= 4; // ph5(n3)는 화면 밖으로 조금 물러나 있음
  [[1870, 0.8, -26, 2], [1800, 0.86, 0, 0], [1940, 0.88, 0, 1]].forEach(([x0, ss, oy, i]) => { const x = x0 + sx0, p = ph === 0 && lt < 2.8 ? walkPose(lt * 7 + i, 0.6) : '서기';
    w += qShadow(x, DG_GROUND + oy, 50) + dgSoldier(x, DG_GROUND + oy, ss, t, p, fEx(frozen ? 'z충격' : 'z기본'), i); });
  // 왕의 그림자(망토까지) → 왕
  const aO = { x: ax, y: DG_GROUND, s: 1.02, t, pose: aPose, ex: aEx, look: aLook, seed: 7 };
  w += dgCast(dgAlex(aO, aWalk), ax, f1(0.46 * (1 - 0.75 * clamp((ax - 1250) / 200, 0, 1)) * 100) / 100) + qShadow(ax, DG_GROUND, 60) + dgAlex(aO, aWalk);
  // 햇볕이 드는 얼굴: 왕이 해를 가리지 않을 때만
  const sunK = clamp((ax - 1250) / 150, 0, 1), [hx, hy] = ptOf(DG_DX, dy, s, 200, 170);
  w += dgSunWarm(hx - 40, hy, 230, sunK * 0.9);
  if (ph === 2 && lt > 0.45 && lt < 1.0) { const [bx, by] = ptOf(DG_DX, dy, s, 250, 226); w += fx(t, t - lt + 0.45, t - lt + 1.0, f1(bx + 30), f1(by - 20), '팡', '#CFEFFF', { size: 40, rot: 8 }); }
  if (ph === 5) { const tN = fAt(a, '디오게', 3.4); if (lt > tN - 0.2) { const lx = hx + 20, ly = hy - 250; w += pop(t, t - lt + tN - 0.2, t + 99, f1(hx), f1(hy - 175), `<path d="M-22 -40 L22 -40 L0 0 Z" fill="${YEL}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`, {}) + pop(t, t - lt + tN - 0.2, t + 99, f1(lx), f1(ly), label(0, 0, '디오게네스 · 기원전 4세기', { size: 34, bg: YEL }), { rot: -2, bob: 2 }); } }
  let over = `<circle cx="${DG_SUN[0]}" cy="${DG_SUN[1]}" r="300" fill="url(#dgSunG)" opacity=".9"/>`;
  if (ph === 0) over += pop(t, t - lt + 0.3, t - lt + 2.8, 330, 110, label(0, 0, '이천삼백여 년 전, 코린토스', { size: 38, bg: '#fff' }), { rot: -3 });
  const fade = ph === 0 ? 1 - dgK(0, 0.5, lt) : 0;
  return dgDefs() + dgPlate('corinth', cam, 0.55) + qCam(cam, w) + over + (fade > 0 ? fFull('#E9C98A', f1(fade * 100) / 100) : '');
}
function dgtitleScene(t, lt, a) { return window.ftitleScene(t, lt, a); }

/* ---------- 4. 항아리가 집: 고개와 두 손만 입구 위로 ---------- */
function dgjarScene(t, lt, a) {
  const cam = qLerpCam(lt / 5.5, [560, 670, 1.1], [540, 680, 1.18]), jx = DG_JAR[0], js = 1.05, s = 0.95, rimY = DG_GROUND - 470 * js;
  const pk = easeOutBack(dgK(0.4, 1.0, lt)), tJ = fAt(a, '항아리', 4.0), oy = rimY + 8 + (560 - 290) * s + (1 - pk) * 330;
  let w = dgCorProps() + dgJar(jx, DG_GROUND, js);
  // 입구 아래(항아리 속)는 잘라 낸다 → 몸통은 보이지 않고 고개·어깨·두 손만
  const rim = 115, arms = dgPose('서기', { armL: [[148, 285], [112, 262], [200 - rim + 2, 272]], hL: [200 - rim, 275], armR: [[252, 285], [288, 262], [200 + rim - 2, 272]], hR: [200 + rim, 275] });
  w += `<clipPath id="dgJarC"><rect x="-500" y="-500" width="3000" height="${f1(rimY + 510)}"/></clipPath><g clip-path="url(#dgJarC)">` + DIO({ x: jx, y: oy, s, t, pose: arms, ex: exprAt([[0, 'z기본'], [1.0, 'z빵긋']], lt), look: [0.3, 0], sit: true }) + `</g>`;
  w += dgJarLip(jx, DG_GROUND, js);
  if (pk > 0.6) { const [l0, l1] = [ptOf(jx, oy, s, 200 - rim, 275), ptOf(jx, oy, s, 200 + rim, 275)]; if (l0[1] < rimY + 6) w += dgHand(l0[0], l0[1], s) + dgHand(l1[0], l1[1], s); }
  w += dgDog(jx + 250, DG_GROUND, 0.8, t, { pose: 'curl', eyes: 'shut' });
  if (lt > tJ - 0.2) { const lx = jx + 330, ly = DG_GROUND - 330; w += `<path d="M${lx - 60} ${ly + 10} Q${lx - 110} ${ly + 30} ${jx + 170} ${ly + 40}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${jx + 170} ${ly + 40} l26 -16 l2 30 Z" fill="${INK}"/>` + pop(t, t - lt + tJ - 0.2, t + 99, lx, ly, label(0, 0, '집', { size: 52, bg: YEL }), { rot: -4 }); }
  let over = `<circle cx="${DG_SUN[0]}" cy="${DG_SUN[1]}" r="300" fill="url(#dgSunG)" opacity=".9"/>`;
  return dgDefs() + dgPlate('corinth', cam, 0.55) + qCam(cam, w) + over;
}

/* ---------- 5. 전 재산: 디오게네스가 카드를 하나씩 가리킨다 ---------- */
const DG_INV = [['외투', 'cloak'], ['지팡이', 'staff'], ['자루', 'sack'], ['컵', 'cup']];
function dgInvIcon(kind, s = 1) { let g = '';
  if (kind === 'cloak') g = `<path d="M-50 -46 Q0 -64 50 -46 L64 56 Q0 70 -64 56 Z" fill="#7A5A3E" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-20 -50 L0 10 L20 -50" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="-26" cy="20" r="5" fill="#5A3E28"/><circle cx="30" cy="34" r="6" fill="#5A3E28"/>`;
  if (kind === 'staff') g = dgStaff(-30, 64, 26, -52);
  if (kind === 'sack') g = `<g transform="translate(0 56) scale(.95)">${dgSackG}</g>`;
  if (kind === 'cup') g = `<path d="M-40 -30 L40 -30 L30 40 Q0 52 -30 40 Z" fill="#C2703F" stroke="${INK}" stroke-width="6"/><path d="M40 -10 q24 6 0 30" fill="none" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="-30" rx="40" ry="10" fill="#8E4A26" stroke="${INK}" stroke-width="5"/>`;
  return `<g transform="scale(${s})">${g}</g>`; }
function dgInvPanel(x, y, sc, n, o = {}) { // n칸까지 찼음, o.cross: 컵 칸 X, o.big: 글자 크게(작게 띄울 때)
  const ts = o.big ? 54 : 44, ls = o.big ? 44 : 32;
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc * 1000) / 1000})"><rect x="-470" y="-190" width="940" height="380" rx="28" fill="#2A2238" stroke="${INK}" stroke-width="8"/>${fT(-430, -124, o.title || '디오게네스의 전 재산', ts, '#FFE9A8', { anchor: 'start' })}`;
  for (let i = 0; i < 4; i++) { const cx = -330 + i * 220, cy = 50, k = clamp(n - i, 0, 1);
    h += `<rect x="${cx - 95}" y="${cy - 95}" width="190" height="190" rx="18" fill="#3E3452" stroke="#7A6C96" stroke-width="5"/>`;
    if (k > 0) h += `<g transform="translate(${cx} ${cy - 20}) scale(${f1(easeOutBack(k) * 1000) / 1000})">${dgInvIcon(DG_INV[i][1], 0.9)}</g>${fT(cx, cy + 84, DG_INV[i][0], ls, '#fff')}`;
    if (o.cross && i === 3) h += `<path d="M${cx - 80} ${cy - 80} L${cx + 80} ${cy + 80} M${cx + 80} ${cy - 80} L${cx - 80} ${cy + 80}" stroke="#E5484D" stroke-width="18" stroke-linecap="round" opacity="${f1(o.cross * 100) / 100}"/>`; }
  return h + `</g>`; }
function dginvScene(t, lt, a) {
  const keys = ['외투', '항이', '자루', '컵'], ts = keys.map((k, i) => fAt(a, k, 0.6 + i * 1.1)), cam = [960, 610, 1.0], x = 330, F = DG_GROUND, s = 0.95;
  const n = ts.reduce((acc, tk) => acc + clamp((lt - tk + 0.1) / 0.3, 0, 1), 0), cur = Math.max(0, Math.min(3, Math.ceil(n) - 1));
  const PX = 1130, PY = 470, [tx, ty] = [PX - 330 + cur * 220, PY + 50], aim = Math.atan2(ty - (F - (560 - 285) * s), tx - (x + 52 * s));
  const ax = Math.cos(aim), ay = Math.sin(aim), point = dgPose('서기', { armR: [[252, 285], [252 + 58 * ax, 285 + 58 * ay], [252 + 112 * ax, 285 + 112 * ay]], hR: [252 + 118 * ax, 285 + 118 * ay] });
  let w = dgCorProps() + dgJar(DG_JAR[0] - 260, DG_GROUND, 1.05);
  w += fFull('#140E22', 0.5);
  w += dgDog(x - 190, F, 0.75, t, { pose: 'sit' }) + qShadow(x, F, 60) + DIO({ x, y: F, s, t, pose: n > 0.3 ? point : '서기', ex: fEx('z뿌듯'), look: [0.8, -0.2] });
  w += dgInvPanel(PX, PY, 1.0, n);
  return dgDefs() + dgPlate('corinth', cam, 0.55) + qCam(cam, w);
}

/* ---------- 6. 샘터: 아이가 손으로 떠 마심 → 자루에서 컵을 꺼내 던짐 → "꼬마한테 졌구먼" → 엄지 ---------- */
const DG_FCAM = [1000, 640, 1.1], DG_FD = 0.55;
function dgCup(x, y, s, rot) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000})">${dgInvIcon('cup', 0.6)}</g>`; }
// 아이가 물을 떠 마시는 한 번(약 2.2초): 0 물줄기로 손 → 0.5~0.8 받기 → 1.3 입으로 → 1.7 꿀꺽 → 2.1 내림
function dgSip(u) { if (u < 0 || u > 2.2) return { reach: 0, mouth: 0, water: 0 };
  const reach = u < 0.5 ? easeInOut(u / 0.5) : u < 0.8 ? 1 : u < 1.3 ? 1 - easeInOut((u - 0.8) / 0.5) : 0;
  const mouth = u < 0.8 ? 0 : u < 1.3 ? easeInOut((u - 0.8) / 0.5) : u < 1.7 ? 1 : 1 - easeInOut(clamp((u - 1.7) / 0.4, 0, 1));
  return { reach, mouth, water: u > 0.55 && u < 1.75 ? 1 : 0, gulp: u > 1.3 && u < 1.7 }; }
function dgfountScene(t, lt, a) {
  const ph = a.ph, cam = DG_FCAM, [stX, stY] = dgUV(cam, DG_FD, 0.778, 0.585), [, gY] = dgUV(cam, DG_FD, 0.5, 0.80), [, F] = dgUV(cam, DG_FD, 0.4, 0.848);
  const ks = 0.74, kF = gY - 4, block = 92, kFeet = kF - block, kx = stX - 92 * ks, dx = 700, ds = 0.95;
  E['_dgd3'] = qTalk('z빵긋', env(t) * 0.9);
  // 아이: 디딤돌 위에서 물줄기에 손을 모아 받고 → 입으로
  const tS = ph === 0 ? 0 : ph === 1 ? 0.8 : -99, sp = dgSip(lt - tS), thumbs = ph === 3 && lt > 0.3;
  const reachP = [[148, 285], [210, 300], [lerp(236, 292, sp.reach), lerp(330, 296, sp.reach)]], reachQ = [[252, 285], [282, 310], [lerp(250, 306, sp.reach), lerp(338, 306, sp.reach)]];
  const hL = [lerp(lerp(236, 292, sp.reach), 196, sp.mouth), lerp(lerp(330, 296, sp.reach), 262, sp.mouth)], hR = [lerp(lerp(252, 312, sp.reach), 214, sp.mouth), lerp(lerp(340, 300, sp.reach), 264, sp.mouth)];
  let kPose = dgPose('서기', { armL: [reachP[0], [lerp(210, 170, sp.mouth), lerp(300, 300, sp.mouth)], hL], hL, armR: [reachQ[0], [lerp(282, 246, sp.mouth), lerp(310, 316, sp.mouth)], hR], hR });
  if (thumbs) kPose = dgPose('서기', { armL: [[148, 285], [100, 250], [86, 206]], hL: [84, 200] });
  const kEx = ph === 2 ? exprAt([[0, 'z멍'], [1.6, 'z빵긋']], lt) : thumbs ? fEx('z빵긋') : sp.gulp ? fEx('z뿌듯') : fEx('z기본');
  let w = `<path d="M${f1(kx - 70)} ${f1(kF + 6)} L${f1(kx - 62)} ${f1(kFeet)} L${f1(kx + 64)} ${f1(kFeet)} L${f1(kx + 72)} ${f1(kF + 6)} Z" fill="#CDBB96" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M${f1(kx - 62)} ${f1(kFeet + 14)} L${f1(kx + 64)} ${f1(kFeet + 14)}" stroke="${INK}" stroke-width="3" opacity=".3"/>`;
  w += dgGreek({ v: '#DCE6F2', t: '#5A8FBF', d: '#5A8FBF', x: { hair: '#4A3A2A' } }, { x: kx, y: kFeet, s: ks, t, pose: kPose, ex: kEx, look: thumbs ? [-0.9, 0] : sp.reach > 0.3 ? [0.8, 0.2] : [0.3, 0.3], seed: 9 });
  if (sp.water) { const [wx, wy] = ptOf(kx, kFeet, ks, (hL[0] + hR[0]) / 2, (hL[1] + hR[1]) / 2 - 14); w += `<ellipse cx="${f1(wx)}" cy="${f1(wy)}" rx="${f1(20 * ks + 4)}" ry="${f1(9 * ks + 3)}" fill="#9ED8FF" stroke="${INK}" stroke-width="3"/>`;
    if (sp.reach > 0.9) w += `<path d="M${f1(wx - 26)} ${f1(wy - 6)} q-10 -14 -2 -24 M${f1(wx + 24)} ${f1(wy - 8)} q12 -12 4 -24" fill="none" stroke="#CFEFFF" stroke-width="6" stroke-linecap="round"/>`; }
  if (thumbs) { const [tx2, ty2] = ptOf(kx, kFeet, ks, 84, 200); w += dgThumb(tx2, ty2, ks * 1.05); }
  // 디오게네스: 왼손에 지팡이, 오른쪽 허리에 자루. 보고 → 자루에서 컵 → 던짐 → 머리 긁으며 웃음 → 엄지
  // (왼손으로 왼쪽에 던진다: 지팡이는 오른손, 자루는 왼쪽 허리)
  const staffP = { armR: [[252, 285], [282, 340], [286, 386]], hR: [288, 390] }, rest = { armL: [[148, 285], [118, 334], [108, 378]], hL: [108, 382] };
  let dPose = dgPose('서기', Object.assign({}, staffP, rest)), dEx = exprAt([[0, 'z멍'], [1.0, 'z의심']], lt), dLook = [0.9, -0.1], cup = null, cupInSack = true, after = '';
  const SACK = [74, 420], tSee = fAt(a, '보고', 2.8), tCup = fAt(a, '컵', 3.9), tThrow = fAt(a, '던져', 4.45), tRel = tThrow + 0.15;
  if (ph === 1) { dEx = exprAt([[0, 'z의심'], [tCup - 0.1, 'z충격'], [tThrow - 0.35, 'z결심'], [tRel + 0.1, 'z빵긋']], lt);
    const kGrab = dgK(tSee, tSee + 0.4, lt), kLift = dgK(tSee + 0.45, tSee + 0.9, lt), kWind = dgK(tThrow - 0.45, tThrow, lt), kSw = dgK(tThrow, tThrow + 0.22, lt), rel = lt > tRel;
    let hand = [lerp(108, SACK[0], kGrab), lerp(382, SACK[1] - 30, kGrab)];
    if (kLift > 0) hand = [lerp(SACK[0], 114, kLift), lerp(SACK[1] - 30, 300, kLift)];
    if (kWind > 0) hand = [lerp(114, 240, easeInOut(kWind)), 300];
    if (kSw > 0) hand = [lerp(240, 40, easeOut(kSw)), lerp(300, 236, kSw)];
    const el = [lerp(148, hand[0], 0.5) - 30, lerp(285, hand[1], 0.5) + 12];
    dPose = dgPose('서기', Object.assign({}, staffP, { armL: [[148, 285], el, hand], hL: hand })); dLook = lt < tCup - 0.1 ? [0.9, -0.1] : lt < tThrow ? [-0.2, 0.6] : [-0.9, 0.2];
    if (kLift > 0 && !rel) { cupInSack = false; const [cx2, cy2] = ptOf(dx, F, ds, hand[0], hand[1] - 26); cup = dgCup(cx2, cy2, 1, -kSw * 60); }
    if (rel) { cupInSack = false; const d = lt - tRel, [h0x, h0y] = ptOf(dx, F, ds, 104, 230), gx = dx - 520, gy = F - 22;
      if (d < 0.75) { const k = d / 0.75; cup = dgCup(lerp(h0x, gx, k), lerp(h0y, gy, k) - Math.sin(k * Math.PI) * 200, 1, -d * 760); }
      else { const d2 = d - 0.75, bx = gx - 110 * (1 - Math.exp(-d2 * 2.6)), by = gy - Math.abs(Math.sin(d2 * 9)) * 46 * Math.exp(-d2 * 4); cup = dgCup(bx, by, 1, -570 - 300 * (1 - Math.exp(-d2 * 2))); } } }
  if (ph >= 2) { cupInSack = false; cup = dgCup(dx - 630, F - 22, 1, -870); }
  if (ph === 2) { dEx = fEx('_dgd3'); dLook = [0.6, -0.3]; const scr = Math.sin(lt * 11) * 8; dPose = dgPose('서기', Object.assign({}, staffP, { armL: [[148, 285], [82, 220], [132 + scr, 118]], hL: [138 + scr, 112] })); }
  if (ph === 3) { dEx = fEx('z뿌듯'); dLook = [0.9, 0]; dPose = dgPose('서기', Object.assign({}, staffP, lt > 0.15 ? { armL: [[148, 285], [94, 250], [70, 206]], hL: [68, 200] } : rest)); if (lt > 0.15) { const [tx3, ty3] = ptOf(dx, F, ds, 68, 200); after += dgThumb(tx3, ty3, ds * 1.05); } }
  // 지팡이(손 뒤) → 몸 → 허리 자루 → 컵 → 손
  const [sx1, sy1] = ptOf(dx, F, ds, 288, 390);
  w += dgDog(dx - 250, F, 0.72, t, { pose: 'sit', tilt: ph === 1 && lt > tRel ? -18 : ph >= 2 ? -10 : 0 });
  w += `<line x1="${f1(sx1)}" y1="${f1(F - 4)}" x2="${f1(sx1)}" y2="${f1(F - 640 * ds)}" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><line x1="${f1(sx1)}" y1="${f1(F - 4)}" x2="${f1(sx1)}" y2="${f1(F - 640 * ds)}" stroke="#7A5434" stroke-width="12" stroke-linecap="round"/>`;
  w += qShadow(dx, F, 64) + DIO({ x: dx, y: F, s: ds, t, pose: dPose, ex: dEx, look: dLook });
  const [skx, sky] = ptOf(dx, F, ds, SACK[0], SACK[1] + 70); w += dgSack(skx, sky, 0.62, 6);
  if (cupInSack) { const [ux, uy] = ptOf(dx, F, ds, SACK[0] - 4, SACK[1] + 70 - 66 * 0.62 * 1.4); w += `<path d="M${f1(ux - 14)} ${f1(uy + 4)} q14 -14 28 0" fill="#C2703F" stroke="${INK}" stroke-width="4"/>`; }
  if (cup) w += cup;
  w += dgHand(...ptOf(dx, F, ds, ...dPose.hL), ds) + dgHand(sx1, sy1, ds) + after;
  let over = `<circle cx="${DG_SUN[0]}" cy="${DG_SUN[1]}" r="300" fill="url(#dgSunG)" opacity=".9"/>`;
  if (sp.gulp) { const [gx2, gy2] = dgScr(cam, ...ptOf(kx, kFeet, ks, 40, 90)); over += fx(t, t - lt + tS + 1.3, t - lt + tS + 1.75, f1(gx2), f1(gy2), '꿀꺽', '#fff', { size: 62, rot: -8 }); }
  if (ph === 1 && lt > tCup - 0.1 && lt < tThrow) { const [ex2, ey2] = dgScr(cam, dx + 60, F - 700 * ds); over += fx(t, t - lt + tCup - 0.1, t - lt + tThrow, f1(ex2), f1(ey2), '!', '#FFE34D', { size: 70 }); }
  if (ph >= 2) { const k = ph === 2 ? dgK(0, 0.3, lt) : 1, cr = ph === 2 ? dgK(fAt(a, '구먼', 2.3) - 0.1, fAt(a, '구먼', 2.3) + 0.3, lt) : 1; if (k > 0) over += `<g opacity="${f1(k * 100) / 100}">${dgInvPanel(330, 130, 0.62, 4, { cross: cr, big: true })}</g>`; }
  return dgDefs() + dgPlate('fount', cam, DG_FD) + qCam(cam, w) + over;
}

/* ---------- 7. '개'라 불린 사람 → 따르는 사람들, 견유학파 ---------- */
function dgdogScene(t, lt, a) {
  const ph = a.ph, dx = 960, dyS = dgRecY(0.95), G = DG_GROUND;
  const cam = ph === 1 ? [900, 680, 1.05] : ph === 2 ? qLerpCam(lt / 6, [940, 690, 1.1], [960, 700, 1.18]) : [960, 700, 1.18];
  const tF = ph === 2 ? fAt(a, '따르는', 2.7) : ph === 3 ? -9 : 99, tOff = ph === 2 ? 1.4 : ph === 3 ? -9 : 99;
  let w = '';
  // 놀리던 사람 셋: 손가락질 → (ph2) 시큰둥해져 떠난다
  [[250, '#DCE6F2', '#3E5C84', 0, -1], [560, '#F2E2D0', '#B5523A', 1, -1], [1620, '#E4E9EF', '#5C6B82', 2, 1]].forEach(([x0, v, c, i, dir]) => {
    const k = dgK(tOff + i * 0.15, tOff + 1.3 + i * 0.15, lt), x = x0 + dir * 1000 * easeInOut(k); if (k >= 1) return;
    const point = x0 < dx ? dgPose('서기', { armR: [[252, 285], [300, 260], [350, 250]], hR: [356, 248] }) : dgPose('서기', { armL: [[148, 285], [100, 260], [50, 250]], hL: [44, 248] });
    const pose = k > 0 ? walkPose(lt * 7 + i, 0.8) : ph === 1 ? point : '서기';
    w += qShadow(x, G, 50) + dgGreek({ v, t: c, d: c, x: { hair: ['#2B2B2B', '#6B4A2E', '#8A8A8A'][i], beard: i === 1 ? '#6B4A2E' : null } }, { x, y: G, s: 0.85, t, pose, ex: fEx(ph === 1 ? 'z버럭' : 'z삐짐'), look: [k > 0 ? dir : x0 < dx ? 0.8 : -0.8, 0], seed: 20 + i }); });
  // 따르는 사람 둘: 같은 낡은 외투로 걸어 들어와 옆에 서서 같이 햇볕
  [[650, '#5A4636', null, 0], [380, '#3A3A3A', '#6B4A2E', 1]].forEach(([x1, hair, beard, i]) => { const k = easeOut(dgK(tF + i * 0.25, tF + 1.3 + i * 0.25, lt)); if (k <= 0) return; const x = lerp(-250, x1, k), walking = k < 1;
    w += qShadow(x, G, 50) + dgGreek({ v: '#CDB892', t: '#7A5A3E', d: '#7A5A3E', x: { hair, beard } }, { x, y: G, s: 0.82, t, pose: walking ? walkPose(lt * 7 + i, 0.7) : '서기', ex: fEx(walking ? 'z빵긋' : 'z뿌듯'), look: walking ? [1, 0] : [0, -0.9], seed: 40 + i }); });
  const same = ph >= 2;
  w += qShadow(dx + 90, G, 150, 0.5) + DIO({ x: dx, y: dyS, s: 0.95, t, pose: DG_RECL, ex: fEx(same ? 'z뿌듯' : 'z졸음'), look: same ? [0, -0.9] : [0.2, -0.3], rot: same ? -4 : -8, sit: true });
  w += dgDog(1300, G, 0.85, t, { pose: 'sit', eyes: same ? 'shut' : null, tilt: same ? -8 : 0 });
  const [hx, hy] = ptOf(dx, dyS, 0.95, 200, 170); w += dgSunWarm(hx, hy, 240, 0.7) + dgSunWarm(1310, G - 150, 140, same ? 0.7 : 0.3);
  if (ph === 1) { const tD = fAt(a, '개', 1.2); if (lt > tD - 0.2) { const bx = 700, by = G - 720; w += pop(t, t - lt + tD - 0.2, t + 9, bx, by, `<g><path d="M-120 34 L-150 96 L-60 40 Z" fill="#fff" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-200" y="-50" width="400" height="100" rx="40" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-118 38 L-62 38" stroke="#fff" stroke-width="10"/>${fT(0, 14, '개 같은 영감!', 40, INK)}</g>`, { rot: -3 }); } }
  let over = `<circle cx="${DG_SUN[0]}" cy="${DG_SUN[1]}" r="300" fill="url(#dgSunG)" opacity=".9"/>`;
  if (ph >= 2) { const tK = ph === 2 ? fAt(a, '견유', 5.2) : -1; if (lt > tK - 0.1) over += pop(t, t - lt + tK - 0.1, t + 99, 960, 140, label(0, 0, '견유학파 = 개 같은 사람들', { size: 46, bg: YEL }), { rot: -2, bob: 3 }); }
  return dgDefs() + dgPlate('street', cam, 0.55) + qCam(cam, w) + over;
}
