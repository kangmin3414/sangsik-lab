/* 애어른 편 — 표현 방식 비교 샘플('문' 구간). 새 이름은 모두 cmp 접두사.
   cmpA = 지금 방식(종이 배경 + 아이콘 + 화면 가운데 글자). cmpB = 새 방식(은유 하나를 끝까지, 같은 구도, 세는 그림, 물건에 붙는 글자, 소화 컷, 요약 띠).
   물리 규칙(B): 걷는 사람의 발은 길 위에 · 문짝은 먼 기둥에 달려 있고 사람은 문짝 앞, 가까운 기둥 뒤로 지난다 · 갓은 머리 위에 내려앉는다 · 문턱은 길 위에 놓인다 · 원인 다음 결과. */
['cmpcard', 'cmpA', 'cmpB'].forEach(k => CAMS[k] = 'fixed');
const CM = { GY: 900, G1: 1000, G2: 3000, X0: 4600, V: 235, S: 0.62, PH: 520 };
const cmpPt = (x, y, s, lx, ly) => [x + (lx - 200) * s, y + (ly - 560) * s];
const cmpOp = k => f1(clamp(k, 0, 1) * 100) / 100;
const cmpL = id => ((window.TL && TL.lines) || []).find(l => l.id === id) || { t0: 0, t1: 1, words: [] };
const cmpWd = (ws, key, fb, n = 0) => { const m = (ws || []).filter(x => x.w.replace(/\s/g, '').includes(key)); return m[n] ? m[n].t + 0.15 : fb; };
const cmpW = (a, key, fb, n) => cmpWd(a._words, key, fb, n);
const cmpOn = (x, y, s, dy, inner) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s}) translate(-200 ${f1(-560 + (dy || 0))})">${inner}</g>`;
const cmpPose = p => (typeof p === 'string' ? P[p] : p);
const CMZ = o => Z(Object.assign({ vest: '#F4F4F8', vshade: 'rgba(60,70,120,0.15)', collar: true, tie: '#5B6B8C' }, o));                                        // 제로(셔츠 + 넥타이)
const CMBOY = o => HALO(char(Object.assign({ goggles: 'none', vest: '#F7F4EC', patch: false, tee: true, vshade: 'rgba(0,0,0,0.10)', robe: '#6E88A8' }, o)));      // 조선의 소년
const CMGF = o => HALO(char(Object.assign({ goggles: 'none', vest: '#2F3442', patch: false, tee: true, vshade: 'rgba(0,0,0,0.3)' }, o)));                          // 열일곱의 할아버지(교복)
const cmpDefs = () => `<defs>
<linearGradient id="cmpSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE4FF"/><stop offset=".62" stop-color="#EAF6FF"/><stop offset="1" stop-color="#FFF4DE"/></linearGradient>
<radialGradient id="cmpSun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF7D6"/><stop offset=".4" stop-color="#FFEFB0" stop-opacity=".7"/><stop offset="1" stop-color="#FFEFB0" stop-opacity="0"/></radialGradient>
<radialGradient id="cmpGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE39A" stop-opacity=".95"/><stop offset=".55" stop-color="#FFD36B" stop-opacity=".35"/><stop offset="1" stop-color="#FFD36B" stop-opacity="0"/></radialGradient>
<radialGradient id="cmpPaperV" cx=".5" cy=".45" r=".8"><stop offset="0" stop-color="#FFF8EA"/><stop offset="1" stop-color="#EBDDC2"/></radialGradient>
<linearGradient id="cmpSepia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4D2AC"/><stop offset="1" stop-color="#CDB98E"/></linearGradient>
<clipPath id="cmpPhoto"><rect x="-170" y="-220" width="340" height="400" rx="6"/></clipPath>
</defs>`;
const cmpPaper = () => `<rect x="-400" y="-300" width="2800" height="1700" fill="#F6ECD9"/><rect x="-400" y="-300" width="2800" height="1700" fill="url(#cmpPaperV)"/>`;
const cmpTag = s => `<g opacity=".92">${label(70 + s.length * 14, 46, s, { size: 30, bg: '#FFFFFF' })}</g>`;

/* ---------- 머리 위에 얹는 것들(자세 좌표) ---------- */
const cmpBraid = () => `<path d="M86 156 Q82 70 200 64 Q318 70 314 156 Q300 112 258 100 Q200 90 142 100 Q100 112 86 156 Z" fill="#2B2B2B" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M308 150 Q338 222 322 300" fill="none" stroke="${INK}" stroke-width="27" stroke-linecap="round"/><path d="M308 150 Q338 222 322 300" fill="none" stroke="#2B2B2B" stroke-width="17" stroke-linecap="round"/><path d="M314 298 L302 340 M326 300 L338 340" stroke="#D8443C" stroke-width="10" stroke-linecap="round"/>`;
const cmpGat = () => `<path d="M112 106 Q100 212 176 288 M288 106 Q300 212 224 288" fill="none" stroke="${INK}" stroke-width="4" opacity=".7"/><path d="M152 98 L160 8 Q200 -6 240 8 L248 98 Z" fill="#1E1E26" opacity=".84" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><ellipse cx="200" cy="100" rx="178" ry="30" fill="#1E1E26" opacity=".9" stroke="${INK}" stroke-width="6"/><path d="M78 96 Q200 76 322 96" fill="none" stroke="#fff" stroke-width="3" opacity=".25"/>`;
const cmpCap = () => `<path d="M90 124 Q90 42 200 38 Q310 42 310 124 Z" fill="#262B3D" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="88" y="110" width="224" height="26" rx="6" fill="#141826" stroke="${INK}" stroke-width="5"/><path d="M108 136 Q200 180 292 136 Q200 156 108 136 Z" fill="#0E1018" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle cx="200" cy="82" r="12" fill="#D8B25A" stroke="${INK}" stroke-width="4"/>`;
const cmpUniform = () => `<rect x="174" y="254" width="52" height="16" rx="5" fill="#2F3442" stroke="${INK}" stroke-width="4"/><path d="M180 259 L220 259" stroke="#fff" stroke-width="3" opacity=".8"/>` + [296, 330, 364, 398].map(y => `<circle cx="200" cy="${y}" r="6.5" fill="#D8B25A" stroke="${INK}" stroke-width="2.5"/>`).join('');
const cmpBundle = () => `<path d="M234 400 Q228 446 270 452 Q312 446 306 400 Q270 384 234 400 Z" fill="#E9DDBD" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M258 394 L248 372 M282 394 L294 372" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M246 424 Q270 434 294 422" fill="none" stroke="#C9B88E" stroke-width="4"/>`;
const cmpSpark = (x, y, k, r = 60) => { if (k <= 0 || k >= 1) return ''; let s = ''; for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4 + 0.3, a = r * (0.35 + 0.65 * easeOut(k)), b = a + r * 0.35 * (1 - k); s += `<line x1="${f1(x + Math.cos(an) * a)}" y1="${f1(y + Math.sin(an) * a)}" x2="${f1(x + Math.cos(an) * b)}" y2="${f1(y + Math.sin(an) * b)}" stroke="#FFC94A" stroke-width="7" stroke-linecap="round" opacity="${cmpOp(1 - k)}"/>`; } return s; };

/* ---------- 문(길을 가로질러 선 문을 비스듬히 본 모습). 먼 기둥(왼쪽 위)·가까운 기둥(오른쪽 아래), 문짝은 먼 기둥에 달림 ---------- */
function cmpSign(x, y, l1, l2, o = {}) {
  const w = Math.max(l1.length * 44, (l2 || '').length * 27) + 44, hh = l2 ? 104 : 70;
  let s = `<rect x="${f1(x - w / 2)}" y="${y}" width="${f1(w)}" height="${hh}" rx="8" fill="${o.bg || '#2E2A28'}" stroke="${INK}" stroke-width="6"/>`;
  s += fT(x, y + 50, l1, 44, o.c1 || '#F3D98A') + (l2 ? fT(x, y + 88, l2, 27, o.c2 || '#FFF6E0', { w: 700 }) : '');
  return s;
}
function cmpGate(gx, open, kind, l1, l2, op = 1) {
  const G = CM.GY, PH = CM.PH, gh = kind === 'ghost';
  const col = kind === 'joseon' ? { post: '#B5523A', leaf: '#CC6E4C', roofT: '#5A606F', roofS: '#3F4450' } : { post: '#8E7B63', leaf: '#AE987E', roofT: '#7A6E60', roofS: '#5B5146' };
  const st = gh ? `fill="none" stroke="#6F93C9" stroke-width="6" stroke-dasharray="16 14" stroke-linecap="round"` : `stroke="${INK}" stroke-width="7" stroke-linejoin="round"`;
  const F = [gx - 88, G - 36], N = [gx + 88, G + 36];
  const post = B => `<rect x="${B[0] - 17}" y="${B[1] - PH}" width="34" height="${PH}" rx="5" ${gh ? '' : `fill="${col.post}"`} ${st}/>`;
  let back = post(F), front = post(N);
  if (!gh) { const C = [N[0] - 14, N[1] - 2], O = [F[0] + 44, F[1] - 34], e = [lerp(C[0], O[0], open), lerp(C[1], O[1], open)], LH = PH - 64, hx = F[0] + 10, hy = F[1];
    back += `<path d="M${hx} ${hy} L${f1(e[0])} ${f1(e[1])} L${f1(e[0])} ${f1(e[1] - LH)} L${hx} ${hy - LH} Z" fill="${col.leaf}" ${st}/>`;
    for (const u of [0.33, 0.66]) { const px = lerp(hx, e[0], u), py = lerp(hy, e[1], u); back += `<line x1="${f1(px)}" y1="${f1(py - 8)}" x2="${f1(px)}" y2="${f1(py - LH + 8)}" stroke="${INK}" stroke-width="3" opacity=".3"/>`; }
    const rx = lerp(hx, e[0], 0.8), ry = lerp(hy, e[1], 0.8) - LH * 0.45; back += `<circle cx="${f1(rx)}" cy="${f1(ry)}" r="11" fill="none" stroke="#E0B95A" stroke-width="5"/>`; }
  // 상인방 + 지붕
  const Ft = [F[0], F[1] - PH], Nt = [N[0], N[1] - PH];
  front += `<path d="M${Ft[0] - 20} ${Ft[1] - 12} L${Nt[0] + 20} ${Nt[1] + 8} L${Nt[0] + 20} ${Nt[1] + 40} L${Ft[0] - 20} ${Ft[1] + 20} Z" ${gh ? '' : `fill="${col.post}"`} ${st}/>`;
  const A = [Ft[0] - 40, Ft[1] - 34], B = [Nt[0] + 40, Nt[1] - 6], hw = 100;
  if (gh) front += `<path d="M${A[0] - hw} ${A[1]} L${A[0] + hw} ${A[1]} L${B[0] + hw} ${B[1]} L${B[0] + hw} ${B[1] + 26} L${B[0] - hw} ${B[1] + 26} L${B[0] - hw} ${B[1]} Z" ${st}/>`;
  else { front += `<path d="M${A[0] + hw} ${A[1]} L${B[0] + hw} ${B[1]} L${B[0] + hw} ${B[1] + 26} L${A[0] + hw} ${A[1] + 26} Z" fill="${col.roofS}" ${st}/>`;
    front += `<path d="M${A[0] - hw} ${A[1]} L${A[0] + hw} ${A[1]} L${B[0] + hw} ${B[1]} L${B[0] - hw} ${B[1]} Z" fill="${col.roofT}" ${st}/><path d="M${B[0] - hw} ${B[1]} L${B[0] + hw} ${B[1]} L${B[0] + hw} ${B[1] + 26} L${B[0] - hw} ${B[1] + 26} Z" fill="${col.roofS}" ${st}/>`;
    for (const dx of [-64, -32, 0, 32, 64]) front += `<line x1="${A[0] + dx}" y1="${A[1] + 3}" x2="${B[0] + dx}" y2="${B[1] - 3}" stroke="${INK}" stroke-width="3" opacity=".28"/>`; }
  // 가까운 기둥 윗부분에 걸린 이름판
  if (l1) front += gh ? `<g opacity=".9"><rect x="${N[0] - 46}" y="${Nt[1] + 70}" width="92" height="84" rx="8" ${st}/>${fT(N[0], Nt[1] + 134, '?', 62, '#6F93C9')}</g>` : cmpSign(N[0], Nt[1] + 62, l1, l2, kind === 'joseon' ? {} : { bg: '#4A4138', c1: '#F1E6CF' });
  const wrap = g => op >= 1 ? g : `<g opacity="${cmpOp(op)}">${g}</g>`;
  return { back: wrap(back), front: wrap(front) };
}
/* 문턱: 길 위에 낮게 놓인 나무. lit 0~1 */
function cmpSill(sx, lit, tag, tagH = 400, tk = 0) {
  const G = CM.GY, F = [sx - 72, G - 30], N = [sx + 72, G + 30], hh = 16;
  let s = '';
  if (lit > 0) s += `<ellipse cx="${sx}" cy="${G - 6}" rx="${f1(170 * lit)}" ry="${f1(70 * lit)}" fill="url(#cmpGlow)" opacity="${cmpOp(lit)}"/>`;
  const fill = lit > 0.5 ? '#FFD27A' : '#E6D6B2', stc = lit > 0.5 ? INK : '#C7B48A', sw = lit > 0.5 ? 6 : 4;
  s += `<path d="M${F[0]} ${F[1]} L${N[0]} ${N[1]} L${N[0]} ${N[1] - hh} L${F[0]} ${F[1] - hh} Z" fill="${fill}" stroke="${stc}" stroke-width="${sw}" stroke-linejoin="round"/><path d="M${F[0]} ${F[1] - hh} L${N[0]} ${N[1] - hh} L${N[0] + 16} ${N[1] - hh - 8} L${F[0] + 16} ${F[1] - hh - 8} Z" fill="${lit > 0.5 ? '#FFE6AC' : '#F1E4C6'}" stroke="${stc}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  if (tag && tk > 0) { const px = F[0] - 6, py = F[1] - 14, k = easeOutBack(clamp(tk, 0, 1)), top = py - tagH * k;
    s += `<line x1="${px}" y1="${py}" x2="${px}" y2="${f1(top)}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><g transform="translate(${px} ${f1(top - 8)}) scale(${f1(lerp(0.3, 1, k) * 100) / 100})">${label(0, 0, tag, { size: 32, bg: '#FFF1C9' })}</g>`; }
  return s;
}
/* 길가 나이 푯말(길 건너편에 꽂혀 있다) */
function cmpPostSign(x, text) {
  const G = CM.GY, y = G - 62;
  return `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 250}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><g transform="translate(${x} ${y - 262}) rotate(-2)"><rect x="${-text.length * 22 - 26}" y="-34" width="${text.length * 44 + 52}" height="68" rx="8" fill="#F7EBD0" stroke="${INK}" stroke-width="6"/>${fT(0, 15, text, 42, NAVY)}</g>`;
}

/* ---------- 배경: 밝은 하늘, 먼 언덕, 시대마다 다른 먼 풍경, 길 ---------- */
const cmpHanok = (x, y) => `<g opacity=".8"><rect x="${x - 95}" y="${y - 84}" width="190" height="84" fill="#F3E9D6" stroke="#8A7F74" stroke-width="4"/><path d="M${x - 140} ${y - 78} Q${x - 70} ${y - 120} ${x} ${y - 132} Q${x + 70} ${y - 120} ${x + 140} ${y - 78} Q${x} ${y - 98} ${x - 140} ${y - 78} Z" fill="#7C8493" stroke="#5C6370" stroke-width="4" stroke-linejoin="round"/><rect x="${x - 22}" y="${y - 58}" width="44" height="58" fill="#C9A77E" stroke="#8A7F74" stroke-width="3"/></g>`;
const cmpChoga = (x, y) => `<g opacity=".8"><rect x="${x - 80}" y="${y - 62}" width="160" height="62" fill="#EFE3CB" stroke="#8A7F74" stroke-width="4"/><path d="M${x - 118} ${y - 54} Q${x} ${y - 150} ${x + 118} ${y - 54} Q${x} ${y - 74} ${x - 118} ${y - 54} Z" fill="#D9BE7C" stroke="#A88E55" stroke-width="4" stroke-linejoin="round"/><rect x="${x - 16}" y="${y - 44}" width="32" height="44" fill="#B99B74" stroke="#8A7F74" stroke-width="3"/></g>`;
const cmpPine = (x, y) => `<g opacity=".8"><line x1="${x}" y1="${y}" x2="${x + 8}" y2="${y - 150}" stroke="#8B6B4E" stroke-width="12" stroke-linecap="round"/><ellipse cx="${x - 26}" cy="${y - 150}" rx="62" ry="26" fill="#8FBF8A" stroke="#5F9461" stroke-width="4"/><ellipse cx="${x + 34}" cy="${y - 186}" rx="56" ry="24" fill="#9CCB95" stroke="#5F9461" stroke-width="4"/></g>`;
const cmpPole = (x, y) => `<g opacity=".7"><line x1="${x}" y1="${y}" x2="${x}" y2="${y - 250}" stroke="#8B7B68" stroke-width="10" stroke-linecap="round"/><line x1="${x - 46}" y1="${y - 222}" x2="${x + 46}" y2="${y - 222}" stroke="#8B7B68" stroke-width="8" stroke-linecap="round"/></g>`;
const cmpApt = (x, y, hh, c) => { let s = `<g opacity=".78"><rect x="${x - 70}" y="${y - hh}" width="140" height="${hh}" fill="${c}" stroke="#9AA6BC" stroke-width="4"/>`; for (let r = 0; r < Math.floor(hh / 46) - 1; r++) for (let q = 0; q < 3; q++) s += `<rect x="${x - 52 + q * 38}" y="${y - hh + 18 + r * 46}" width="26" height="24" rx="3" fill="#FFFDF2" opacity=".85"/>`; return s + `</g>`; };
const CMPROPS = [['hanok', -760, 0], ['pine', -380, 0], ['hanok', 520, 0], ['pine', 900, 0], ['pine', -1250, 0],
  ['pole', -1300, 1], ['choga', -820, 1], ['pole', -330, 1], ['choga', 470, 1], ['pole', 880, 1]];
function cmpBack(cam) {
  const [cx, cy, z] = cam, G = CM.GY, hw = 1150 / z + 80, x0 = cx - hw, x1 = cx + hw, top = cy - 640 / z, bot = cy + 760 / z;
  let h = `<rect x="${f1(x0)}" y="${f1(top)}" width="${f1(2 * hw)}" height="${f1(G - 100 - top)}" fill="url(#cmpSky)"/>`;
  h += `<circle cx="${f1(cx + 640 / z)}" cy="${f1(cy - 400 / z)}" r="${f1(240 / z)}" fill="url(#cmpSun)"/><circle cx="${f1(cx + 640 / z)}" cy="${f1(cy - 400 / z)}" r="${f1(66 / z)}" fill="#FFF6CF"/>`;
  const hills = (d, base, A, fill, sh) => { let p = `M${f1(x0)} ${base + 40}`; for (let X = x0; X <= x1 + 60; X += 60) { const f = X - cx * (1 - d); p += ` L${f1(X)} ${f1(base - A * (0.55 + 0.45 * Math.sin(f * 0.0031 + sh)) - 0.25 * A * Math.sin(f * 0.0083 + sh * 2))}`; } return `<path d="${p} L${f1(x1 + 60)} ${base + 40} Z" fill="${fill}"/>`; };
  h += hills(0.18, G - 108, 210, '#CFE3F2', 1.3) + hills(0.3, G - 104, 130, '#C9E6C2', 4.1);
  const d = 0.55, py = G - 106, P2 = X => cx + (X - cx) * d;
  CMPROPS.forEach(([k, off, era]) => { if (era ? (cx < 1900 || cx > 4000) : cx > 1900) return; const X = P2((era ? CM.G2 : CM.G1) + off); if (X < x0 - 200 || X > x1 + 200) return; h += k === 'hanok' ? cmpHanok(X, py) : k === 'choga' ? cmpChoga(X, py) : k === 'pine' ? cmpPine(X, py) : cmpPole(X, py); });
  if (cx > 4000) for (let i = 0; i < 14; i++) { const X = P2(CM.X0 - 500 + i * 430); if (X < x0 - 200 || X > x1 + 200) continue; h += cmpApt(X, py, 230 + ((i * 97) % 150), ['#DCE6F5', '#F1E2DA', '#E2EEDD'][i % 3]); }
  h += `<rect x="${f1(x0)}" y="${G - 110}" width="${f1(2 * hw)}" height="52" fill="#DDF0C6"/>`;
  h += `<rect x="${f1(x0)}" y="${G - 60}" width="${f1(2 * hw)}" height="140" fill="#F3E6C9"/><line x1="${f1(x0)}" y1="${G - 60}" x2="${f1(x1)}" y2="${G - 60}" stroke="#D2BF94" stroke-width="5"/><line x1="${f1(x0)}" y1="${G + 80}" x2="${f1(x1)}" y2="${G + 80}" stroke="#D2BF94" stroke-width="5"/>`;
  h += `<rect x="${f1(x0)}" y="${G + 82}" width="${f1(2 * hw)}" height="${f1(Math.max(10, bot - G - 82))}" fill="#CFE8AE"/>`;
  for (let X = Math.floor(x0 / 260) * 260; X < x1; X += 260) h += `<ellipse cx="${X + 90}" cy="${G + 20 + ((X / 260) % 2 ? 26 : -18)}" rx="26" ry="5" fill="#E2D2AC"/>`;
  return h;
}
function cmpLay() {
  if (cmpLay.c) return cmpLay.c;
  const l = cmpL('b3'), w = l.words, D = l.t1 - l.t0 + 0.15, t20 = cmpWd(w, '스무', 2.9), t30 = cmpWd(w, '서른', 4.5), tAny = cmpWd(w, '어디', D - 3.4), tNo = cmpWd(w, '문이', D - 1.8), tStop = tNo + 0.2;
  const xs = CM.X0 + CM.V * tStop, s20 = CM.X0 + CM.V * t20 + 80, s30 = CM.X0 + CM.V * t30 + 80;
  return (cmpLay.c = { D, t20, t30, tAny, tNo, tStop, xs, s20, s30, pg: xs + 240, sill: [(s20 + s30) / 2, s30 + (xs - 95 - s30) * 0.47, xs - 95], board: xs + 520 });
}
const CMTAGS = ['첫 월급', '부모님 검진 예약', '보호자 칸의 내 이름'], CMTAGH = [400, 330, 440];

/* ---------- 세는 그림: 길가의 판(어른이 하는 일의 칸) ---------- */
function cmpMini(x, y, age, col, op = 1) {
  return `<g opacity="${cmpOp(op)}"><line x1="${x - 8}" y1="${y - 22}" x2="${x - 11}" y2="${y}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><line x1="${x + 8}" y1="${y - 22}" x2="${x + 11}" y2="${y}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><rect x="${x - 17}" y="${y - 52}" width="34" height="34" rx="9" fill="${col}" stroke="${INK}" stroke-width="5"/><circle cx="${x}" cy="${y - 70}" r="20" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="${x - 7}" cy="${y - 71}" r="3" fill="${INK}"/><circle cx="${x + 7}" cy="${y - 71}" r="3" fill="${INK}"/>` +
    `<g transform="translate(${x + 54} ${y - 62})"><rect x="-34" y="-22" width="68" height="44" rx="10" fill="#fff" stroke="${INK}" stroke-width="4"/>${fT(0, 11, age, 28, NAVY)}</g></g>`;
}
function cmpBoard(lt, a, grow) {
  const L = cmpLay(), bx = L.board, G = CM.GY, by = G - 44, tY = cmpW(a, '요즘', 0.25), tO = cmpW(a, '예전', 1.9), t15 = cmpW(a, '15', cmpW(a, '열다섯', 3.0)), tS = cmpW(a, '조사', 4.7);
  const ry = r => by - 120 - r * 86, k = easeOutBack(clamp(grow, 0, 1));
  let s = `<g transform="translate(${bx} ${by}) scale(1 ${f1(k * 1000) / 1000}) translate(${-bx} ${-by})">`;
  s += `<line x1="${bx - 150}" y1="${by}" x2="${bx - 150}" y2="${by - 80}" stroke="${INK}" stroke-width="10"/><line x1="${bx + 150}" y1="${by}" x2="${bx + 150}" y2="${by - 80}" stroke="${INK}" stroke-width="10"/>`;
  s += `<rect x="${bx - 215}" y="${by - 620}" width="430" height="560" rx="14" fill="#FFF9EA" stroke="${INK}" stroke-width="8"/><rect x="${bx - 215}" y="${by - 620}" width="430" height="62" rx="14" fill="#F2C76B" stroke="${INK}" stroke-width="8"/>${fT(bx, by - 576, '어른이 하는 일', 36, NAVY)}`;
  for (let r = 0; r < 5; r++) s += `<line x1="${bx - 190}" y1="${ry(r)}" x2="${bx + 190}" y2="${ry(r)}" stroke="#B9A88A" stroke-width="5" stroke-linecap="round"/>`;
  // 칸의 뜻: 일(가방) · 운전(바퀴) · 연애(하트)
  s += `<g transform="translate(${bx} ${ry(2) - 30})"><rect x="-20" y="-12" width="40" height="28" rx="5" fill="#C99A62" stroke="${INK}" stroke-width="4"/><path d="M-9 -12 V-21 H9 V-12" fill="none" stroke="${INK}" stroke-width="4"/></g>`;
  s += `<g transform="translate(${bx} ${ry(3) - 30})"><circle r="19" fill="#DDE3EE" stroke="${INK}" stroke-width="5"/><circle r="5" fill="${INK}"/><path d="M-19 0 H-5 M5 0 H19 M0 5 V19" stroke="${INK}" stroke-width="4"/></g>`;
  s += `<g transform="translate(${bx} ${ry(4) - 30})"><path d="M0 16 C-30 -6 -14 -24 0 -8 C14 -24 30 -6 0 16 Z" fill="#F08A9B" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>`;
  s += fT(bx - 118, by - 76, '예전', 30, '#8A6E3C') + fT(bx + 118, by - 76, '요즘', 30, '#3C6E8A');
  const kO = clamp((lt - tO) / 0.35, 0, 1), kY = clamp((lt - tY) / 0.35, 0, 1), sl = easeInOut(clamp((lt - t15 + 0.25) / 0.9, 0, 1));
  if (kO > 0) s += cmpMini(bx - 130, ry(4), '18', '#D9C6A0', kO * 0.45) + cmpMini(bx - 130, ry(1), '15', '#D9A441', kO);
  if (kY > 0) { const yy = lerp(ry(4), ry(1), sl); s += cmpMini(bx + 96, yy, '18', '#5AA9D6', kY);
    if (sl > 0 && sl < 1) s += `<line x1="${bx + 96}" y1="${f1(yy - 110)}" x2="${bx + 96}" y2="${f1(ry(4) - 96)}" stroke="#5AA9D6" stroke-width="5" stroke-dasharray="6 10" stroke-linecap="round" opacity=".7"/>`; }
  const kL = clamp((lt - t15 - 0.75) / 0.4, 0, 1);
  if (kL > 0) s += `<line x1="${bx - 108}" y1="${ry(1) - 8}" x2="${f1(lerp(bx - 108, bx + 74, easeOut(kL)))}" y2="${ry(1) - 8}" stroke="#E5484D" stroke-width="6" stroke-dasharray="4 12" stroke-linecap="round"/><g transform="translate(${bx - 14} ${ry(1) + 30}) scale(${f1(lerp(0.4, 1, easeOutBack(kL)) * 100) / 100})">${label(0, 0, '같은 칸', { size: 28, bg: '#FFE3E0' })}</g>`;
  s += `</g>`;
  const kS = clamp((lt - tS) / 0.45, 0, 1);
  if (kS > 0) { const sw = Math.sin((lt - tS) * 5) * 4 * Math.exp(-(lt - tS) * 1.4); s += `<g transform="translate(${bx} ${by - 60}) rotate(${f1(sw)})" opacity="${cmpOp(kS * 2)}"><line x1="-120" y1="0" x2="-120" y2="${f1(30 * easeOut(kS))}" stroke="${INK}" stroke-width="4"/><line x1="120" y1="0" x2="120" y2="${f1(30 * easeOut(kS))}" stroke="${INK}" stroke-width="4"/><g transform="translate(0 ${f1(52 * easeOut(kS))})"><rect x="-212" y="-24" width="424" height="48" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/>${fT(0, 10, '미국 십 대 830만 명 · 1976–2016년', 26, '#4A4A55', { w: 700 })}</g></g>`; }
  return s;
}

/* ---------- B: 새 방식 ---------- */
function cmpWalker(kind, x, t, walking, o = {}) {
  const s = o.s || CM.S, y = CM.GY + 8, ph = x * 0.045, wp = walking ? walkPose(ph, 0.72) : cmpPose('서기');
  const base = { x, y, s, t, seed: o.seed || 3, still: true, look: o.look || [0.5, 0], ex: o.ex || fEx('z기본') };
  let pose = wp, body = '', on = '';
  if (kind === 'boy') { body = CMBOY(Object.assign(base, { pose, topknot: o.knot ? '#2B2B2B' : false }));
    if (!o.knot) on += cmpBraid(); if (o.gat != null) on += `<g transform="translate(0 ${f1(o.gat)})" opacity="${cmpOp(1 + o.gat / 400 * 1.6 + 0.6)}">${cmpGat()}</g>`; }
  else if (kind === 'gf') { pose = Object.assign({}, wp, { armR: [[252, 285], [272, 340], [268, 392]], hR: [268, 400] }); body = CMGF(Object.assign(base, { pose })); on += cmpUniform() + cmpCap() + cmpBundle(); }
  else { pose = o.pose || wp; body = CMZ(Object.assign(base, { pose })); }
  return qShadow(x, CM.GY + 2, 62 * s / 0.62, 0.55) + body + (on ? cmpOn(x, y, s, pose.dy || 0, on) : '');
}
function cmpBScene(t, lt, a) {
  const ph = a.ph, G = CM.GY, L = cmpLay(), D = a._dur || 6;
  let cam, w = '', mid = '', fr = '', over = '';
  const sills = (lits, tks) => L.sill.map((sx, i) => cmpSill(sx, lits[i] || 0, CMTAGS[i], CMTAGH[i], tks ? tks[i] : 0)).join('');
  const signs = () => cmpPostSign(L.s20, '스무 살') + cmpPostSign(L.s30, '서른');
  if (ph === 0) { // 조선의 문: 상투 → 갓 → 문이 열리고 → 지나가면 '어른'
    const tD = cmpW(a, '문이', 2.4), tS = cmpW(a, '상투', 6.3), tG = cmpW(a, '가슬', cmpW(a, '갓', 8.3)), tA = cmpW(a, '어른이', 9.8, 1);
    const k1 = clamp((lt - 0.2) / (tS - 0.9), 0, 1), k2 = clamp((lt - tA - 0.15) / 2.7, 0, 1), bx = lerp(CM.G1 - 660, CM.G1 - 200, k1) + 640 * k2, walking = (lt > 0.2 && k1 < 1) || (k2 > 0 && k2 < 1);
    const knot = lt >= tS, gk = clamp((lt - tG + 0.3) / 0.55, 0, 1), gat = lt >= tG - 0.3 ? lerp(-300, 0, easeOutBack(gk)) : null, open = easeInOut(clamp((lt - tA + 0.55) / 0.6, 0, 1));
    const g = cmpGate(CM.G1, open, 'joseon', '관례', '열다섯~스무 살');
    const glow = clamp((lt - tD) / 0.4, 0, 1) * (1 - clamp((lt - tD - 1.3) / 0.6, 0, 1));
    if (glow > 0) mid += `<ellipse cx="${CM.G1}" cy="${G - 260}" rx="330" ry="360" fill="url(#cmpGlow)" opacity="${cmpOp(glow * 0.75)}"/>`;
    if (open > 0) mid += `<ellipse cx="${CM.G1 + 10}" cy="${G - 250}" rx="150" ry="300" fill="url(#cmpGlow)" opacity="${cmpOp(open * 0.55)}"/>`;
    mid += g.back + cmpWalker('boy', bx, t, walking, { knot, gat, ex: fEx(lt > tG + 0.3 ? 'z히죽' : lt >= tS ? 'z반짝' : 'z기본'), look: [0.6, lt > tS && lt < tA ? -0.5 : 0] }) + g.front;
    const hp = cmpPt(bx, G + 8, CM.S, 200, 60); mid += cmpSpark(hp[0], hp[1] - 6, (lt - tS) / 0.5, 70) + cmpSpark(hp[0], hp[1] - 30, (lt - tG - 0.1) / 0.5, 90);
    if (bx > CM.G1 + 285) { const k = easeOutBack(clamp((bx - CM.G1 - 285) / 80, 0, 1)); mid += `<g transform="translate(${f1(bx)} ${f1(hp[1] - 128)}) scale(${f1(lerp(0.3, 1, k) * 100) / 100})"><line x1="0" y1="34" x2="0" y2="62" stroke="${INK}" stroke-width="5"/>${label(0, 0, '어른', { size: 42, bg: YEL })}</g>`; }
    cam = [bx + 300, 560, lerp(1.0, 1.05, clamp(lt / D, 0, 1))];
  } else if (ph === 1) { // 1950년의 문: 다가가기도 전에 열린다
    const tE = cmpW(a, '너무', 3.1), k1 = clamp((lt - 0.1) / (tE - 0.3), 0, 1), k2 = easeInOut(clamp((lt - tE - 1.5) / (D - tE - 0.6), 0, 1)), gx = lerp(CM.G2 - 660, CM.G2 - 470, k1) + 250 * k2, walking = (k1 > 0 && k1 < 1) || (k2 > 0 && k2 < 1);
    const dt = lt - tE + 0.1, open = dt < 0 ? 0 : clamp(easeOutBack(clamp(dt / 0.5, 0, 1)) + 0.05 * Math.sin(dt * 7) * Math.exp(-dt * 1.5), 0, 1.08);
    const g = cmpGate(CM.G2, open, 'y1950', '1950년', '열일곱 살');
    for (let i = 0; i < 6; i++) { const u = (lt - tE + 0.4 - i * 0.16) / 1.3; if (u <= 0 || u >= 1) continue; const yy = G - 150 - i * 62, x0 = gx - 260 + u * 620; mid += `<path d="M${f1(x0)} ${yy} q70 ${i % 2 ? -18 : 18} 150 0" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="${cmpOp(Math.sin(u * Math.PI) * 0.85)}"/>`; }
    const lookBack = lt > tE + 0.55 && lt < tE + 1.35;
    mid += g.back + cmpWalker('gf', gx, t, walking, { s: 0.57, seed: 5, ex: fEx(lt > tE ? 'z멍' : 'z기본'), look: lookBack ? [-0.8, 0.1] : [0.7, -0.2] }) + g.front;
    cam = [gx + 300, 560, lerp(1.0, 1.05, clamp(lt / D, 0, 1))];
  } else { // 제로의 길
    let zx = L.xs, walking = false, look = [0.5, 0], ex = 'z기본', pose = null, lits = [0, 0, 0], tks = null;
    if (ph === 2) { const f = lt < L.tStop - 0.4 ? Math.max(0, lt) : L.tStop - 0.4 + 0.4 * easeOut(clamp((lt - L.tStop + 0.4) / 1.2, 0, 1)); zx = CM.X0 + CM.V * f; walking = lt > 0.02 && lt < L.tStop + 0.6;
      const gin = clamp((lt - L.tAny + 0.3) / 0.6, 0, 1), gout = clamp((lt - L.tNo + 0.1) / 1.0, 0, 1), gop = gin * (1 - gout) * 0.9;
      if (gop > 0.01) { const g = cmpGate(L.pg, 0, 'ghost', '?', null, gop); fr += g.back + g.front; }
      if (!walking) { const u = lt - L.tStop - 0.6; look = u < 0.7 ? [0.8, -0.2] : [-0.7, 0]; ex = 'z멍'; }
      cam = [zx + 300, 560, 1.0];
    } else if (ph === 3) { const kc = clamp(lt / 1.3, 0, 1), t15 = cmpW(a, '15', 3.0); cam = qLerpCam(kc, [L.xs + 300, 560, 1.0], [L.xs + 300, 566, 1.3]); look = [0.85, lt > t15 ? 0.05 : -0.35]; ex = lt > t15 + 0.5 ? 'z민망' : 'z멍';
      if (lt > t15 + 0.7) pose = mixPose('서기', '턱괴기', easeInOut(clamp((lt - t15 - 0.7) / 0.4, 0, 1)));
      fr += cmpBoard(lt, a, lt / 0.55);
    } else if (ph === 4) { cam = qLerpCam(lt / 1.7, [L.xs + 300, 566, 1.3], [L.xs - 220, G - 60, 2.0]); look = [-0.25, 0.95]; ex = 'z멍'; lits = [0, 0, clamp((lt - 0.9) / 0.9, 0, 1) * 0.9];
      fr += cmpBoard(99, { _words: cmpL('b4').words }, 1 - lt / 0.45);
    } else { const tT = cmpW(a, '문턱', 1.2), tLow = cmpW(a, '낮아서', 4.2), run = ph === 6 ? 99 : lt;
      cam = ph === 6 ? qLerpCam(lt / 1.2, [L.xs - 700, 560, 1.0], [L.xs - 700, 668, 1.0]) : qLerpCam((lt - 0.1) / 1.9, [L.xs - 220, G - 60, 2.0], [L.xs - 700, 560, 1.0]);
      lits = [0, 1, 2].map(i => i === 2 ? Math.max(0.9, clamp((run - tT - 0.8) / 0.45, 0, 1)) : clamp((run - tT - i * 0.4) / 0.45, 0, 1)); tks = [0, 1, 2].map(i => clamp((run - tT - i * 0.4 - 0.1) / 0.45, 0, 1));
      look = run > tT - 0.2 ? [-0.85, 0.25] : [-0.25, 0.95]; ex = run > tLow + 0.7 ? 'z히죽' : 'z멍';
      const gf = ph === 6 ? 0 : clamp((lt - 0.7) / 0.5, 0, 1) * (1 - clamp((lt - tT + 0.25) / 0.5, 0, 1)) * 0.5;
      if (gf > 0.01) { const g = cmpGate(L.pg, 0, 'ghost', '?', null, gf); fr += g.back + g.front; }
      const n = 13; for (let i = 0; i < n; i++) { const k = clamp((run - tLow - i * 0.09) / 0.25, 0, 1); if (k <= 0) continue; const X = lerp(L.sill[0] - 170, L.xs - 70, i / (n - 1)); w += `<ellipse cx="${f1(X)}" cy="${G + (i % 2 ? 22 : -6)}" rx="20" ry="9" fill="#B79C6E" opacity="${cmpOp(k * 0.75)}" transform="rotate(-8 ${f1(X)} ${G + (i % 2 ? 22 : -6)})"/>`; }
      if (ph === 6) over += cmpRecap(lt);
    }
    w = signs() + sills(lits, tks) + w;
    mid += cmpWalker('zero', zx, t, walking, { look, ex: fEx(ex), pose });
  }
  return cmpDefs() + qCam(cam, cmpBack(cam) + w + mid + fr) + over + cmpTag('B · 새 방식');
}
/* 막 끝 요약 띠: 그 막의 그림 셋 */
function cmpRecap(lt) {
  const k = easeOutBack(clamp((lt - 0.25) / 0.6, 0, 1)), G = CM.GY, y = lerp(1320, 972, k);
  let s = `<g transform="translate(0 ${f1(y)})"><rect x="330" y="-124" width="1260" height="248" rx="30" fill="#FFFBEF" stroke="${INK}" stroke-width="8"/>`;
  const card = (x, inner, cap, kk) => `<g opacity="${cmpOp(kk)}"><rect x="${x - 150}" y="-104" width="300" height="208" rx="20" fill="#EEF6FF" stroke="${INK}" stroke-width="5"/>${inner}${fT(x, 92, cap, 32, NAVY)}</g>`;
  const mini = (x, kind) => { const g = cmpGate(0, 0, kind, kind === 'ghost' ? '?' : null, null); return `<g transform="translate(${x} 52) scale(.25) translate(0 ${-G})">${g.back}${g.front}</g>`; };
  const k1 = clamp((lt - 0.6) / 0.3, 0, 1), k2 = clamp((lt - 1.0) / 0.3, 0, 1), k3 = clamp((lt - 1.4) / 0.3, 0, 1);
  s += card(560, mini(560, 'joseon'), '문', k1) + card(960, mini(960, 'ghost'), '문 없는 길', k2);
  s += card(1360, `<g transform="translate(1360 22) scale(.85) translate(0 ${-G})">${cmpSill(0, 1)}</g>`, '문턱', k3);
  const arrow = (x, kk) => `<path d="M${x - 26} 0 H${x + 18} M${x + 4} -16 L${x + 22} 0 L${x + 4} 16" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="${cmpOp(kk)}"/>`;
  return s + arrow(760, k2) + arrow(1160, k3) + `</g>`;
}

/* ---------- A: 지금 방식(종이 배경, 아이콘, 가운데 글자) ---------- */
function cmpAScene(t, lt, a) {
  const ph = a.ph, D = a._dur || 6, G = CM.GY; let h = cmpPaper(), over = '', cam = qLerpCam(lt / Math.max(D, 3), [960, 560, 1.0], [960, 568, 1.05]);
  const T0 = t - lt, big = (x, y, s, size, t0) => lt > t0 ? pop(t, T0 + t0, t + 99, x, y, outlined(0, 0, [s], { size, sw: size * 0.17, fill: '#FFE9A8' }), {}) : '';
  const lab = (x, y, s, t0, bg, rot = 0) => lt > t0 ? pop(t, T0 + t0, t + 99, x, y, label(0, 0, s, { size: 40, bg }), { rot, bob: 2 }) : '';
  if (ph === 0) { const tD = cmpW(a, '문이', 2.4), tS = cmpW(a, '상투', 6.3), tG = cmpW(a, '가슬', cmpW(a, '갓', 8.3)), tA = cmpW(a, '어른이', 9.8, 1);
    const g = cmpGate(0, 0, 'joseon', null, null); h += `<g transform="translate(330 950) scale(.6) translate(0 ${-G})" opacity=".9">${g.back}${g.front}</g>`;
    const x = 640, y = 960, s = 0.92; h += qShadow(x, y - 6, 92, 0.5) + CMBOY({ x, y, s, t, pose: '서기', topknot: '#2B2B2B', ex: fEx('z기본'), seed: 3, still: true }) + cmpOn(x, y, s, 0, cmpGat());
    over += big(1290, 330, '관례(冠禮)', 110, tD) + lab(1240, 500, '상투를 틀고', tS, '#FFE3C2', -2) + lab(1340, 620, '갓을 쓰는 날', tG, '#D9E8FF', 2) + big(1290, 820, '어른', 130, tA);
  } else if (ph === 1) { const t17 = cmpW(a, '열일곱', 1.6), tE = cmpW(a, '너무', 3.1);
    h += `<g transform="translate(780 520) rotate(-4)"><rect x="-200" y="-250" width="400" height="480" rx="8" fill="#FBF6EA" stroke="${INK}" stroke-width="8"/><rect x="-170" y="-220" width="340" height="400" rx="6" fill="url(#cmpSepia)" stroke="${INK}" stroke-width="5"/><g clip-path="url(#cmpPhoto)">${CMGF({ x: 0, y: 330, s: 0.92, t: 0, pose: '서기', ex: fEx('z기본'), seed: 5, still: true, noBlink: true })}${cmpOn(0, 330, 0.92, 0, cmpUniform() + cmpCap())}<rect x="-170" y="-220" width="340" height="400" fill="#C9A86A" opacity=".22"/></g></g>`;
    over += lab(470, 300, '1950년', 0.5, '#EADBB8', -3) + big(1380, 420, '열일곱', 150, t17) + lab(1380, 610, '너무 일찍 열린 문', tE, '#FFD9DE', 2);
  } else if (ph === 2) { const L = cmpLay(); const x = 960, y = 965, s = 0.92;
    h += qShadow(x, y - 6, 92, 0.5) + CMZ({ x, y, s, t, pose: '서기', ex: fEx('z멍'), seed: 3, look: [0, -0.3] });
    over += lab(470, 520, '스무 살', L.t20, '#D9E8FF', -3) + lab(1450, 520, '서른', L.t30, '#D9E8FF', 3) + big(960, 300, '문이 없다', 130, L.tNo);
  } else if (ph === 3 || ph === 4) { const hold = ph === 4, tY = hold ? -9 : 0.25, t15 = hold ? -9 : cmpW(a, '15', 3.0), tS = hold ? -9 : cmpW(a, '조사', 4.7), kk = hold ? 1 : easeOut(clamp((lt - tY) / 0.6, 0, 1)), k2 = hold ? 1 : clamp((lt - t15) / 0.4, 0, 1), k3 = hold ? 1 : clamp((lt - tS) / 0.4, 0, 1);
    h += `<g opacity="${cmpOp(kk)}" transform="translate(900 450) scale(${f1(lerp(0.88, 1, kk) * 1000) / 1000})">${fT(-330, 40, '요즘 18살', 150, NAVY)}<g opacity="${cmpOp(k2)}">${fT(40, 34, '=', 150, '#E5484D')}${fT(430, 40, '예전 15살', 150, NAVY)}</g></g>`;
    h += `<rect x="340" y="560" width="${f1(1120 * k2)}" height="10" rx="5" fill="${PINK}"/><g opacity="${cmpOp(k2)}">${fT(900, 660, '어른이 하는 일을 기준으로 보면', 50, NAVY, { w: 700 })}</g><g opacity="${cmpOp(k3)}">${fT(900, 740, '미국 십 대 830만 명 조사 · 1976–2016년', 30, '#6B6255', { w: 500 })}</g>`;
    h += CMZ({ x: 1700, y: 980, s: 0.5, t, pose: '서기', ex: fEx('z멍'), seed: 3, look: [-0.6, -0.4] });
    cam = hold ? [960, 568, 1.05] : cam;
  } else { const hold = ph === 6, tT = hold ? -9 : cmpW(a, '문턱', 1.2), tLow = hold ? -9 : cmpW(a, '낮아서', 4.2), x = 640, y = 965, s = 0.92;
    h += qShadow(x, y - 6, 92, 0.5) + CMZ({ x, y, s, t, pose: '서기', ex: fEx(hold || lt > tLow + 0.7 ? 'z히죽' : 'z멍'), seed: 3, look: [0.5, 0.1] });
    if (hold) over += `<g transform="translate(1290 400) rotate(-2)">${label(0, 0, '문 ✕', { size: 46, bg: '#E3E3E8' })}</g><g transform="translate(1290 550) rotate(2)">${label(0, 0, '문턱 ○', { size: 46, bg: YEL })}</g>` + `<g transform="translate(1290 740)">${outlined(0, 0, ['낮아서 몰랐을 뿐'], { size: 78, sw: 13, fill: '#FFE9A8' })}</g>`;
    else over += (lt > 0.2 ? pop(t, T0 + 0.2, t + 99, 1290, 400, label(0, 0, '문 ✕', { size: 46, bg: '#E3E3E8' }), { rot: -2, bob: 2 }) : '') + (lt > tT ? pop(t, T0 + tT, t + 99, 1290, 550, label(0, 0, '문턱 ○', { size: 46, bg: YEL }), { rot: 2, bob: 2 }) : '') + big(1290, 740, '낮아서 몰랐을 뿐', 78, tLow);
    cam = hold ? [960, 568, 1.05] : cam;
  }
  return cmpDefs() + qCam(cam, h) + over + cmpTag('A · 지금 방식');
}
function cmpcardScene(t, lt, a) {
  const A = a.k === 'A', k = easeOutBack(clamp(lt / 0.5, 0, 1));
  let h = cmpPaper() + `<g transform="translate(960 400) scale(${f1(lerp(0.6, 1, k) * 100) / 100})"><circle r="150" fill="${A ? '#E3E3E8' : YEL}" stroke="${INK}" stroke-width="10"/>${fT(0, 62, a.k, 180, NAVY)}</g>`;
  h += fT(960, 700, A ? '지금 방식' : '새 방식', 96, NAVY) + fT(960, 800, A ? '글자와 아이콘이 내레이션을 받아 적는다' : '은유 하나 · 같은 구도 · 세는 그림 · 물건에 붙는 글자', 46, '#5B5566', { w: 700 });
  return cmpDefs() + h;
}
