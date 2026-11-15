/* 죽음의 수용소에서 편 — 1막 샘플(오프닝 + 빅터 프랭클의 발견). 게임 감각 층(zw/gf.js). 새 이름은 모두 fk 접두사.
   ../../oneday01/long/odgf.js(방·침대 도구: odRoom·odBed·odZBed·odAt·odTint) 다음에 읽는다.
   한 편을 꿰는 표시: 마음 하트 게이지(5칸)와 가슴 속 노란 불씨. 프랭클 장면은 흑백 동화책 톤이고 색은 불씨의 노랑 하나뿐.
   폭력·죽음은 그리지 않는다(잃은 것은 소지품 칸이 비는 것으로만). 기기 화면 없음, 실존 상표 없음. */
window.GFR = { boil: false, vig: false, flash: false, study: false, sub: gfSubtitle,
  over: t => gfTransition(t, { o2: 'bands', o3: ['iris', 960, 540], o5: ['iris', 960, 540], k0: ['iris', 1010, 470, 960, 540], f1: ['iris', 960, 540], f3: 'bands', f4: ['iris', 1300, 520, 960, 540] }) };
['fkstreet', 'fktwo', 'fkpast', 'fksecret', 'fkfrankl', 'fkcompare', 'fkbridge'].forEach(k => CAMS[k] = 'fixed');
const FK = { FY: 900 };
const fkW = (a, key, fb, n = 0) => { const m = (a._words || []).filter(x => x.w.replace(/\s/g, '').includes(key)); return m[n] ? m[n].t + 0.15 : fb; };
const fkAt = (x, y, inner, sc = 1, rot = 0) => sc < 0.02 ? '' : `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(sc * 1000) / 1000})">${inner}</g>`;
const fkTint = (col, k) => k > 0.004 ? `<rect x="-600" y="-600" width="3120" height="2280" fill="${col}" opacity="${f1(Math.min(1, k) * 1000) / 1000}"/>` : '';
const fkOp = (inner, k) => k < 0.01 ? '' : k > 0.99 ? inner : `<g opacity="${f1(k * 1000) / 1000}">${inner}</g>`;
const GREY = '#9AA0AA';

/* ---------- 인물 ---------- */
const FKZW = o => Z(Object.assign({ vest: '#F4F4F8', vshade: 'rgba(60,70,120,0.15)', collar: true, tie: '#5B6B8C' }, o));                                  // 퇴근길·회사의 제로
const FKV = (col, o) => HALO(char(Object.assign({ goggles: 'none', vest: col, patch: false, tee: true, vshade: 'rgba(0,0,0,0.14)' }, o)));                  // 이름 없는 사람들
const FK_GLASS = (t, look) => { const lk = look || [0, 0], dx = lk[0] * 6, dy = lk[1] * 4;
  return `<g transform="translate(${f1(dx)} ${f1(dy)})" fill="none" stroke="#2A2F3A" stroke-linecap="round"><line x1="88" y1="182" x2="134" y2="186" stroke-width="7"/><line x1="312" y1="182" x2="266" y2="186" stroke-width="7"/>` +
    `<circle cx="165" cy="188" r="32" fill="#fff" fill-opacity=".14" stroke-width="8"/><circle cx="235" cy="188" r="32" fill="#fff" fill-opacity=".14" stroke-width="8"/><path d="M197 186 Q200 179 203 186" stroke-width="6"/>` +
    `<path d="M144 176 Q148 166 158 163" stroke="#fff" stroke-width="5" opacity=".7"/><path d="M214 176 Q218 166 228 163" stroke="#fff" stroke-width="5" opacity=".7"/></g>`; };
const FKF = o => HALO(char(Object.assign({ goggles: 'none', vest: '#6E737D', patch: false, tee: true, vshade: 'rgba(0,0,0,0.25)', hair: '#4B4E57', collar: true, tie: '#3A3E48', headFx: FK_GLASS, seed: 41 }, o)));   // 빅터 프랭클(동글동글, 둥근 안경)
const fkChest = (x, y, s) => [x, y - 215 * s];          // 인물(발 기준)의 가슴 자리
const fkTop = (x, y, s) => [x, y - 545 * s];            // 머리 위

/* ---------- 마음 하트 게이지: v(채운 칸), from(바뀌기 전 칸, tp에 바뀜), low(마지막 칸 깜빡) ---------- */
function fkHearts(t, v, o = {}) {
  const n = o.n || 5, gap = 64, w = n * gap + 36, h = 86, tp = o.tp, u = tp == null ? 9 : t - tp, from = o.from == null ? v : o.from;
  const pulse = tp != null && u >= 0 ? gfBeat(t, tp, 0.12, 4, 8) : 1, sh = tp != null && from > v ? gfShake(t, tp, 9, 0.3) : [0, 0];
  const cur = u >= 0 ? v : from;
  let s = gfPanel(w, h, { r: 43 });
  const full = (op = 1) => `<g opacity="${f1(op * 100) / 100}"><path d="${gfHeartD}" fill="${GFC.coral}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><ellipse cx="-12" cy="-15" rx="7" ry="5" fill="#fff" opacity=".65"/></g>`;
  const empty = `<path d="${gfHeartD}" fill="#E4DCCB" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  for (let i = 0; i < n; i++) {
    const cx = -w / 2 + 18 + gap / 2 + i * gap; let hh = empty;
    if (i < cur) { const blink = o.low && cur <= 1 && i === 0 ? 0.35 + 0.65 * Math.abs(Math.cos(t * 4.2)) : 1; hh += full(blink); }
    if (u >= 0 && u < 0.5 && i >= v && i < from) { const k = u / 0.5; hh += `<g transform="translate(0 ${f1(-34 * k)}) scale(${f1(1 + 0.5 * k)})">${full(1 - k)}</g>`; }   // 깨져 날아감
    if (u >= 0 && i >= from && i < v) { const k = gfIn(t, tp + (i - from) * 0.1, 3.6, 0.42); hh = empty + `<g transform="scale(${f1(k * 1000) / 1000})">${full()}</g>`; }        // 새로 참
    s += `<g transform="translate(${f1(cx)} 6) scale(.8)">${hh}</g>`;
    if (u >= 0 && i === Math.min(from, v) && from !== v) s += from > v ? gfPuff(t, tp, cx, 0, 0.6, '#FFD1D1') : gfStarBurst(t, tp, cx, 0, { r1: 90, n: 7 });
  }
  if (o.low && cur <= 1) s += `<circle cx="${f1(-w / 2 + 18 + gap / 2)}" cy="6" r="${f1(30 + 8 * Math.abs(Math.cos(t * 4.2)))}" fill="none" stroke="${GFC.coral}" stroke-width="5" opacity="${f1(0.6 * Math.abs(Math.cos(t * 4.2)) * 100) / 100}"/>`;
  return `<g transform="translate(${f1(sh[0])} ${f1(sh[1])}) scale(${f1(pulse * (o.s || 1) * 1000) / 1000})">${s}</g>`;
}
/* ---------- 머리 위 먹구름(작은 얼굴, 비가 똑똑) ---------- */
function fkCloud(x, y, s, t, o = {}) {
  const k = o.k == null ? 1 : o.k; if (k < 0.02) return ''; const col = o.col || '#8E97A8', bob = Math.sin(t * 2.2 + (o.seed || 0)) * 5, rain = o.rain == null ? 1 : o.rain;
  const C = [[0, 14, 104, 34, 'e'], [-48, -6, 38], [16, -28, 50], [62, 0, 32]];
  const shp = (fill, sw) => C.map(c => c[4] ? `<ellipse cx="${c[0]}" cy="${c[1]}" rx="${c[2]}" ry="${c[3]}" fill="${fill}"${sw ? ` stroke="${INK}" stroke-width="${sw}"` : ''}/>` : `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="${fill}"${sw ? ` stroke="${INK}" stroke-width="${sw}"` : ''}/>`).join('');
  let drops = '';
  if (rain > 0.02) for (let i = 0; i < 7; i++) { const ph = (t * 1.25 + i * 0.37 + (o.seed || 0) * 0.13) % 1, dx = -72 + i * 24 + Math.sin(i * 3.1) * 6, dy = 46 + ph * (o.fall || 170);
    drops += `<path d="M${f1(dx)} ${f1(dy - 10)} Q${f1(dx - 7)} ${f1(dy + 4)} ${f1(dx)} ${f1(dy + 8)} Q${f1(dx + 7)} ${f1(dy + 4)} ${f1(dx)} ${f1(dy - 10)} Z" fill="#A9DBFF" stroke="${INK}" stroke-width="3" opacity="${f1(Math.sin(Math.PI * ph) * rain * 100) / 100}"/>`; }
  const face = `<ellipse cx="-14" cy="0" rx="5" ry="6.5" fill="${INK}"/><ellipse cx="22" cy="0" rx="5" ry="6.5" fill="${INK}"/><path d="M-6 22 Q4 14 14 22" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-26 -12 L-8 -8 M34 -12 L16 -8" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y + bob)}) scale(${f1(s * k * 1000) / 1000})">${drops}${shp(INK, 14)}${shp(col)}<ellipse cx="-30" cy="-20" rx="16" ry="8" fill="#fff" opacity=".25"/>${face}</g>`;
}
/* ---------- 가슴 속 불씨 ---------- */
function fkEmber(x, y, s, t, o = {}) {
  const k = o.k == null ? 1 : o.k; if (k < 0.02) return ''; const sd = o.seed || 0, fl = 1 + 0.08 * Math.sin(t * 9 + sd) + 0.05 * Math.sin(t * 13.7 + sd * 2), sw = Math.sin(t * 5 + sd) * 6;
  const glow = o.glow == null ? 1 : o.glow;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * k * 1000) / 1000})"><circle r="${f1(78 * (0.9 + 0.1 * fl))}" fill="url(#fkEmberGlow)" opacity="${f1(glow * 100) / 100}"/>` +
    `<g transform="rotate(${f1(sw)}) scale(${f1(1 / fl * 1000) / 1000} ${f1(fl * 1000) / 1000})"><path d="M0 -42 Q28 -10 23 11 Q18 33 0 33 Q-18 33 -23 11 Q-28 -10 0 -42 Z" fill="#FFB12E" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M0 -14 Q13 3 10 15 Q8 25 0 25 Q-8 25 -10 15 Q-13 3 0 -14 Z" fill="#FFF07A"/></g>` +
    (o.face ? `<ellipse cx="-7" cy="10" rx="3.2" ry="4.2" fill="${INK}"/><ellipse cx="7" cy="10" rx="3.2" ry="4.2" fill="${INK}"/><path d="M-4 18 Q0 21 4 18" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>` : '') + `</g>`;
}
const fkDefs = () => gfDefs() + `<defs><radialGradient id="fkEmberGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE38A" stop-opacity=".95"/><stop offset=".45" stop-color="#FFC24A" stop-opacity=".45"/><stop offset="1" stop-color="#FFB12E" stop-opacity="0"/></radialGradient>` +
  `<linearGradient id="fkWinterSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E6573"/><stop offset="1" stop-color="#B9BEC7"/></linearGradient>` +
  `<linearGradient id="fkPaper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ECEAE4"/><stop offset="1" stop-color="#DAD7CF"/></linearGradient>` +
  `<pattern id="fkGrain" width="90" height="90" patternUnits="userSpaceOnUse"><circle cx="12" cy="20" r="2" fill="#000" opacity=".06"/><circle cx="58" cy="44" r="2.5" fill="#000" opacity=".05"/><circle cx="34" cy="76" r="1.8" fill="#000" opacity=".06"/><circle cx="80" cy="8" r="1.6" fill="#fff" opacity=".2"/></pattern></defs>`;
/* 눈송이 */
function fkSnow(t, n = 40, seed = 3, o = {}) { const sp = o.sp || 60, x0 = o.x0 == null ? -200 : o.x0, w = o.w || 2400, y0 = o.y0 == null ? -100 : o.y0, hgt = o.h || 1100; let h = '';
  for (let i = 0; i < n; i++) { const r = 5 + hash(seed + i * 1.3) * 7, ph = hash(seed + i * 2.1), y = y0 + ((ph * hgt + t * sp * (0.6 + hash(seed + i * 3.7) * 0.8)) % hgt), x = x0 + hash(seed + i * 4.9) * w + Math.sin(t * 1.2 + i) * 18 + (o.wind || 0) * ((y - y0) / hgt) * 120;
    h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#fff" opacity="${f1((0.55 + 0.4 * hash(seed + i * 5.5)) * 100) / 100}"/>`; }
  return h; }

/* ===== o1: 퇴근길 밤거리 ===== */
function fkStreet(t, cam) {
  let far = gfFull('url(#gfNight)');
  for (let i = 0; i < 26; i++) far += `<circle cx="${f1(-200 + hash(i * 2.3) * 2400)}" cy="${f1(-40 + hash(i * 5.1) * 380)}" r="${f1(2.5 + hash(i * 7.7) * 3)}" fill="#FFF6C8" opacity="${f1((0.35 + 0.6 * Math.abs(Math.sin(t * 1.4 + i))) * 100) / 100}"/>`;
  far += gfMoon(1640, 150, 30, t);
  for (let i = 0; i < 16; i++) { const x = -420 + i * 180 + hash(i * 3.3) * 40, bh = 260 + hash(i * 1.9) * 260, y = 640 - bh;
    far += `<rect x="${f1(x)}" y="${f1(y)}" width="150" height="${f1(bh + 300)}" rx="10" fill="${i % 2 ? '#26315F' : '#2E3A6E'}" stroke="${INK}" stroke-width="5"/>`;
    for (let r = 0; r < Math.floor(bh / 70); r++) for (let c = 0; c < 2; c++) { const on = hash(i * 9.1 + r * 3.7 + c * 1.1) > 0.55; far += `<rect x="${f1(x + 28 + c * 56)}" y="${f1(y + 28 + r * 70)}" width="36" height="38" rx="5" fill="${on ? '#FFE29A' : '#3B4780'}" opacity="${on ? 0.85 : 1}"/>`; } }
  let mid = '';
  const SH = [['#E9A3A3', '#4E5A93'], ['#A3C9E9', '#55609A'], ['#E9D9A3', '#4A568F'], ['#B9E3B0', '#525E98'], ['#E3B9E9', '#4E5A93']];
  for (let i = 0; i < 5; i++) { const x = -330 + i * 560, [aw, wall] = SH[i];
    mid += `<rect x="${x}" y="560" width="440" height="340" rx="14" fill="${wall}" stroke="${INK}" stroke-width="7"/><rect x="${x + 30}" y="520" width="380" height="64" rx="16" fill="#3B4570" stroke="${INK}" stroke-width="6"/>` +
      `<g transform="translate(${x + 220} 552)">${gfIcon(['star', 'heart', 'note', 'sun', 'moon'][i], 0.62, t)}</g>`;
    for (let k = 0; k < 6; k++) mid += `<path d="M${x + 20 + k * 67} 600 h67 v34 q-33.5 22 -67 0 Z" fill="${k % 2 ? '#F4ECDC' : aw}" stroke="${INK}" stroke-width="5" stroke-linejoin="round" opacity=".92"/>`;
    mid += `<rect x="${x + 40}" y="660" width="210" height="150" rx="10" fill="#FFE7A8" stroke="${INK}" stroke-width="6" opacity=".9"/><line x1="${x + 145}" y1="660" x2="${x + 145}" y2="810" stroke="${INK}" stroke-width="5" opacity=".5"/>` +
      `<rect x="${x + 290}" y="690" width="110" height="210" rx="10" fill="#36406E" stroke="${INK}" stroke-width="6"/><circle cx="${x + 380}" cy="800" r="7" fill="${GFC.sun}"/>`; }
  for (let i = 0; i < 5; i++) { const x = -60 + i * 560; mid += `<circle cx="${x}" cy="500" r="120" fill="url(#gfGlow)" opacity=".6"/><rect x="${x - 9}" y="500" width="18" height="400" rx="6" fill="#3B4570" stroke="${INK}" stroke-width="5"/><path d="M${x - 34} 500 h68 l-12 -42 h-44 Z" fill="#FFF3B8" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`; }
  const near = `<rect x="-700" y="${FK.FY}" width="3400" height="700" fill="#5A6496" stroke="${INK}" stroke-width="7"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="${-400 + i * 360}" y1="${FK.FY}" x2="${-440 + i * 360}" y2="${FK.FY + 120}" stroke="${INK}" stroke-width="4" opacity=".25"/>`).join('') +
    `<rect x="-700" y="${FK.FY + 120}" width="3400" height="26" fill="#7A84B6" stroke="${INK}" stroke-width="6"/><rect x="-700" y="${FK.FY + 146}" width="3400" height="600" fill="#3A4272"/>`;
  return gfLayer(cam, 0.3, far) + gfLayer(cam, 0.65, mid) + gfLayer(cam, 1, near);
}
fkstreetScene = function (t, lt, a) {
  const D = a._dur || 8, tN = fkW(a, '눈치', 1.6), tC = fkW(a, '처리', 2.7), tB = fkW(a, '바닥', 4.6), tV = fkW(a, '버티', 5.7), tStop = Math.min(D - 0.6, tV + 0.25);
  const zx0 = 360, zx1 = 1020, zx = lerp(zx0, zx1, Math.min(1, lt / tStop)), walking = lt < tStop, s = 0.84;
  const cam = qLerpCam(lt / D, [800, 580, 1.32], [1060, 560, 1.45]);
  const wk = walking ? gfWalk(zx * 2.3, 0.5) : null, sigh = walking ? 1 : 1 - 0.035 * easeInOut(gfK(tStop + 0.1, tStop + 0.7, lt));
  const ex = fEx(lt > tB ? 'z졸음' : 'z멍');
  let w = gfActor(FKZW, { x: zx, y: FK.FY, s, t, pose: wk ? wk.pose : '서기', ex, look: [0.35, 0.55], tilt: -4, seed: 3 }, wk ? { sy: wk.sy * 0.99, dy: wk.dy * 0.7 } : { sy: sigh });
  const [hx, hy] = fkTop(zx, FK.FY, s);
  w += fkCloud(hx + 8, hy - 92, 0.82, t, { seed: 1 });
  if (!walking) w += gfEmote(lt, tStop + 0.55, hx + 120, hy + 10, 'dots', { hold: 9, s: 0.9 });
  // 눈치·일 처리 꼬리표가 날아와 하트를 깬다
  const gx = zx + 330, gy = hy + 70;
  const FL = 0.64;   // 꼬리표가 톡 나타나 잠깐 떠 있다가(0.3초) 날아가 부딪히는 시각
  const fly = (t0, text, icon, fromX, fromY) => { const u = gfK(t0 + 0.3, t0 + FL, lt); if (lt < t0 || u >= 1) return ''; const p = easeIn(u), x = lerp(fromX, gx - 110, p), y = lerp(fromY, gy, p) - Math.sin(Math.PI * p) * 60;
    return fkAt(x, y + (u <= 0 ? Math.sin((lt - t0) * 9) * 4 : 0), gfChip(text, { size: 36, icon, bg: '#EDE8FF' }), gfIn(lt, t0, 3.4, 0.45) * (1 - 0.3 * p), -6 + 12 * p); };
  w += fly(tN, '눈치 보기', 'eq', zx - 230, hy - 110) + fly(tC, '일 처리', 'building', zx - 260, hy + 60);
  const v = lt < tN + FL ? 3 : lt < tC + FL ? 2 : 1, from = lt < tC + FL ? 3 : 2, tp = lt < tC + FL ? tN + FL : tC + FL;
  w += fkAt(gx, gy, fkHearts(lt, v, { from, tp: lt < tN + FL ? null : tp, low: lt > tB }), 0.8 * gfIn(lt, 0.25, 3.2, 0.45));
  w += gfRing(lt, tB, gx - 128, gy, 20, 120, GFC.coral, 9, 0.45);
  return fkDefs() + fkStreet(t, cam) + qCam(cam, w);
};

/* ===== o2: 똑같이 힘든 일 → 그날 밤 무너짐 / 다음 날 다시 일어남 ===== */
fktwoScene = function (t, lt, a) {
  const tS = fkW(a, '똑같이', 0.4), tH = fkW(a, '힘든', 1.0), tL = fkW(a, '그날', 3.0), tX = fkW(a, '무너지', 4.0), tR = fkW(a, '다음', 5.4), tU = fkW(a, '일어납', 6.8);
  let h = fkDefs() + gfFull('#E9ECF7') + gfFull('url(#gfDots)');
  const card = (cx, side) => {
    const W2 = 720, H2 = 620, x0 = cx - W2 / 2, y0 = 240, gy = y0 + H2 - 90, id = 'fkTwo' + side, k = gfIn(lt, side ? 0.22 : 0.08, 3, 0.45);
    const fell = side === 0 && lt > tX, rose = side === 1 && lt > tU, dawn = side === 1 ? easeInOut(gfK(tR, tR + 1.2, lt)) : 0;
    let inner = `<rect x="${x0}" y="${y0}" width="${W2}" height="${H2}" fill="url(#gfNight)"/>`;
    if (dawn > 0) inner += fkOp(`<rect x="${x0}" y="${y0}" width="${W2}" height="${H2}" fill="url(#gfDawn)"/>`, dawn) + gfSun(cx + 230, lerp(gy + 60, y0 + 175, dawn), 46, t);
    else for (let i = 0; i < 9; i++) inner += `<circle cx="${f1(x0 + 40 + hash(i * 3.1 + side) * (W2 - 80))}" cy="${f1(y0 + 30 + hash(i * 1.7 + side) * 200)}" r="3.5" fill="#FFF6C8" opacity="${f1((0.4 + 0.5 * Math.abs(Math.sin(t * 1.5 + i))) * 100) / 100}"/>`;
    if (side === 0) inner += gfMoon(cx - 250, y0 + 95, 24, t);
    inner += `<rect x="${x0}" y="${gy}" width="${W2}" height="${H2}" fill="${side === 1 ? gfMix('#3E4A86', '#F4DC9E', dawn) : '#3E4A86'}"/><line x1="${x0}" y1="${gy}" x2="${x0 + W2}" y2="${gy}" stroke="${INK}" stroke-width="6"/>`;
    const px = cx - 40, s = 0.74, col = side ? '#8FE3C8' : '#C3B3F0';
    const hit = lt > tH, crouch = hit && !rose;
    let m = {}; if (hit && lt < tH + 0.6) m = gfJelly(lt, tH, 0.16, 5, 8); if (rose) m = gfM(gfHop(lt, tU, 26, 0.36));
    const pose = crouch ? '웅크림' : '서기', ex = fEx(fell ? 'z울먹' : rose ? 'z빵긋' : 'z기본');
    inner += gfActor(o => FKV(col, o), { x: px, y: gy, s, t, pose, ex, look: crouch ? [0.1, 0.7] : [0.4, -0.1], seed: 20 + side * 7 }, m);
    const top = fkTop(px, gy, s), cy = top[1] - 70 + (crouch ? 30 : 0);
    const ck = side === 1 && rose ? 1 - gfK(tU, tU + 0.35, lt) : gfIn(lt, tH - 0.25, 3, 0.45);
    inner += fkCloud(px + 6, cy - 40, 0.62, t, { k: ck, seed: side * 3 + 2, fall: 140 }) + (side === 1 && rose ? gfPuff(lt, tU, px + 6, cy - 40, 1.4, '#C7CEDB') : '');
    if (fell) inner += gfEmote(lt, tX + 0.1, top[0] + 100, top[1] + 60, 'gloom', { hold: 9, s: 0.9 });
    if (rose) inner += gfEmote(lt, tU + 0.4, top[0] + 80, top[1] - 10, 'spark', { hold: 9, s: 0.9 });
    // 카드 안 하트(3칸)
    const hv = rose ? 2 : fell ? 0 : hit ? 1 : 2, hfrom = rose ? 1 : fell ? 1 : hit ? 2 : 2, htp = rose ? tU : fell ? tX : hit ? tH : null;
    inner += fkAt(cx + 200, y0 + 70, fkHearts(lt, hv, { n: 3, from: hfrom, tp: htp }), 0.72);
    if (fell) inner += fkTint('#0B1230', 0.3 * gfK(tX, tX + 0.6, lt));
    let c = `<clipPath id="${id}"><rect x="${x0}" y="${y0}" width="${W2}" height="${H2}" rx="34"/></clipPath><rect x="${x0 + 10}" y="${y0 + 14}" width="${W2}" height="${H2}" rx="34" fill="${GFC.navy}" opacity=".22"/>` +
      `<g clip-path="url(#${id})">${inner}</g><rect x="${x0}" y="${y0}" width="${W2}" height="${H2}" rx="34" fill="none" stroke="${INK}" stroke-width="8"/>`;
    const tl = side ? tR : tL, beat = lt > tl ? gfBeat(lt, tl, 0.06, 4, 8) : 1;
    c = fkAt(cx, y0 + H2 / 2, `<g transform="translate(${-cx} ${-(y0 + H2 / 2)})">${c}</g>`, k * beat);
    c += gfChipAt(lt, tl, x0 + 150, y0 - 6, side ? '다음 날' : '그날 밤', { size: 38, icon: side ? 'sun' : 'moon', bg: side ? '#FFE9A8' : '#C9CFFF', rot: -3 });
    return c;
  };
  h += card(530, 0) + card(1390, 1);
  h += gfChipAt(lt, tS, 960, 118, '똑같이 힘든 일', { size: 44, icon: 'rain', bg: '#fff', rot: -2 });
  return h;
};

/* ===== o3·o4: 80년 전, 흑백 동화책 겨울 ===== */
function fkWinter(t, cam, o = {}) {
  const dark = o.dark || 0, snowN = o.snow || 36;
  let far = gfFull('url(#fkWinterSky)') + fkTint('#1F2430', dark) + gfHill(640, 70, 900, '#8D939D', 0) + gfHill(700, 50, 600, '#A3A8B1', 240);
  for (let i = 0; i < 4; i++) { const x = -260 + i * 640; far += `<path d="M${x} 700 V610 L${x + 120} 560 L${x + 500} 560 L${x + 620} 610 V700 Z" fill="#6E747E" stroke="${INK}" stroke-width="5" stroke-linejoin="round" opacity=".55"/>`; }
  let mid = '';
  for (let i = 0; i < 22; i++) { const x = -500 + i * 140; mid += `<rect x="${x}" y="690" width="16" height="130" rx="5" fill="#585E68" stroke="${INK}" stroke-width="4"/>`; }
  mid += `<line x1="-500" y1="730" x2="2600" y2="730" stroke="#585E68" stroke-width="7"/><line x1="-500" y1="730" x2="2600" y2="730" stroke="${INK}" stroke-width="2" opacity=".5"/>`;
  const near = `<path d="M-700 ${FK.FY + 10} Q300 ${FK.FY - 26} 960 ${FK.FY} T2700 ${FK.FY - 6} V1700 H-700 Z" fill="#E6E8EC" stroke="${INK}" stroke-width="7"/>` + [0, 1, 2, 3, 4, 5].map(i => `<ellipse cx="${-200 + i * 450}" cy="${FK.FY + 70 + (i % 2) * 40}" rx="120" ry="16" fill="#CDD1D8"/>`).join('');
  return gfLayer(cam, 0.3, far) + gfLayer(cam, 0.6, mid) + gfLayer(cam, 1, near) + gfLayer(cam, 0.9, fkSnow(t, snowN, 7, { sp: 70 + dark * 40, wind: o.wind || 0 })) + gfFull('url(#fkGrain)');
}
const FK_PEOPLE = [[560, '#E8A07A'], [760, '#8FB8E8'], [960, '#E8D27A'], [1160, '#A8D89A'], [1360, '#C8A0E0']];
fkpastScene = function (t, lt, a, run) {
  const ph = a.ph;
  if (ph === 0) {
    const t80 = fkW(a, '80', 0.4), tT = fkW(a, '빼앗긴', 2.2), tH = fkW(a, '지옥', 3.7), tE = fkW(a, '불씨', 5.6), tP = fkW(a, '사람들', 7.0), D = a._dur || 8.5;
    const cam = qLerpCam(gfK(tE - 1, D, lt), [960, 640, 1.22], [960, 670, 1.34]), old = easeInOut(gfK(t80, t80 + 1.1, lt)), drain = easeInOut(gfK(tT, tT + 0.8, lt)), dk = 0.35 * easeInOut(gfK(tH, tH + 0.6, lt));
    let h = fkDefs() + fkWinter(t, cam, { dark: dk, snow: lt > tH ? 60 : 36, wind: lt > tH ? 0.6 : 0.2 });
    let w = '';
    FK_PEOPLE.forEach(([x, col], i) => { const s = 0.6, col2 = gfMix(gfMix(col, GREY, 0.45), GREY, drain), sh = lt > tH ? Math.sin(t * 40 + i) * 1.5 : 0, lit = gfIn(lt, tE + i * 0.16, 3.2, 0.45);
      w += gfActor(o => FKV(col2, o), { x: x + sh, y: FK.FY, s, t, pose: '서기', ex: fEx('z기본'), look: lit > 0.5 ? [0, -0.25] : [0, 0.5], seed: 30 + i * 3 }, { sy: 1 - 0.02 * Math.sin(t * 1.6 + i) });
      if (drain > 0 && drain < 1) w += gfPuff(lt, tT + i * 0.05, x, FK.FY - 230, 0.8, '#D9DCE2');
      const [cx, cy] = fkChest(x, FK.FY, s); w += fkEmber(cx, cy, 0.42, t, { k: lit, seed: i * 1.7 }) + gfRing(lt, tE + i * 0.16, cx, cy, 10, 90, '#FFE38A', 7, 0.4); });
    h += qCam(cam, w);
    // 앞쪽 색(현재) → 흑백 동화책: 처음엔 색 안개가 남았다가 빠진다
    h += fkTint('#5B6BC9', 0.4 * (1 - old));
    // 거꾸로 도는 시계 → "80년 전" 꼬리표
    const ck = gfIn(lt, 0.05, 3, 0.45) * (1 - easeIn(gfK(t80 + 0.9, t80 + 1.25, lt)));
    if (ck > 0.02) { const mm = (720 - lt * 900) % 720; h += fkAt(960, 330, `<circle r="150" fill="url(#gfGlow)" opacity=".6"/>` + gfClock(0, 0, 120, Math.floor((mm + 720) % 720 / 60), Math.floor((mm + 720) % 60)) + `<path d="M-150 -40 A160 160 0 0 1 -60 -150" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/><path d="M-60 -150 l-8 26 M-60 -150 l-26 -6" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`, ck); }
    h += gfChipAt(lt, t80, 330, 150, '80년 전', { size: 46, icon: 'clock', bg: '#F2F0EA', rot: -3 });
    return h;
  }
  // o4: 거창한 각오가 아니었어요
  const tG = fkW(a, '거창', 0.9), tN = fkW(a, '아니었', 1.8), D = a._dur || 3;
  const cam = [960, 670, 1.34];
  let h = fkDefs() + fkWinter(t, cam, { dark: 0.35, snow: 60, wind: 0.6 }), w = '';
  FK_PEOPLE.forEach(([x], i) => { const s = 0.6; w += gfActor(o => FKV(GREY, o), { x, y: FK.FY, s, t, pose: '서기', ex: fEx('z기본'), look: [0, -0.25], seed: 30 + i * 3 }, { sy: 1 - 0.02 * Math.sin(t * 1.6 + i) });
    const [cx, cy] = fkChest(x, FK.FY, s); w += fkEmber(cx, cy, 0.42 * (lt > tN + 0.5 ? gfBeat(lt, tN + 0.5 + i * 0.08, 0.25, 3, 5) : 1), t, { seed: i * 1.7 }); });
  h += qCam(cam, w);
  const out = 1 - easeIn(gfK(tN + 0.75, tN + 1.05, lt));
  h += fkTint('#1F2430', 0.35 * out);
  if (out > 0.02) {
    const flag = `<g transform="translate(0 30) scale(1.25)"><rect x="-8" y="-150" width="14" height="190" rx="6" fill="${GFC.wood2}" stroke="${INK}" stroke-width="6"/><path d="M6 -146 Q70 -170 130 -140 Q100 -112 130 -84 Q70 -112 6 -92 Z" fill="${GFC.sun}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><g transform="translate(66 -118)">${gfStar5(18, '#fff', 4)}</g></g>`;
    h += fkAt(960, 560, gfItem(lt, tG, { name: '거창한 각오', w: 560, svg: flag }), 1.2 * out);
    if (lt > tN - 0.15) h += fkAt(1250, 450, gfStamp(lt, tN, '아님', { size: 86, rot: -12 }), out);
  }
  return h;
};

/* ===== o5: 오늘 밤 잠들기 전에 — 작은 비밀 다섯 ===== */
function fkSecrets(t, t0, tTell, o = {}) {
  const W2 = 640, H2 = 300; let s = gfPanel(W2, H2, { head: '작은 비밀', headBg: GFC.sun, bg: '#FFFDF6' });
  s += gfT(W2 / 2 - 60, -H2 / 2 + 50, '0/5', 34, '#8D93A6', { wt: 900 });
  for (let i = 0; i < 5; i++) { const k = gfIn(t, t0 + i * 0.13, 3.6, 0.42); if (k < 0.02) continue; const x = -W2 / 2 + 80 + i * 120, y = 30, glow = i === 0 && t > tTell;
    s += fkAt(x, y, `<rect x="-48" y="-48" width="96" height="96" rx="22" fill="${glow ? '#FFF3C4' : '#E9E2D0'}" stroke="${INK}" stroke-width="6"/>` +
      (glow ? fkEmber(0, 6, 0.42, t, { k: gfIn(t, tTell, 3, 0.45), glow: 0.7, face: true }) : gfT(0, 18, '?', 54, '#B3A98F')) + (glow ? gfTwinkle(t, 40, -42, 12, 2, GFC.sun) : ''), k * (glow ? gfBeat(t, tTell, 0.18, 3, 5) : 1)); }
  return s;
}
fksecretScene = function (t, lt, a) {
  const tS = fkW(a, '잠들기', 0.9), tR = fkW(a, '떠올려', 2.4), tL = fkW(a, '가벼워', 3.6), tF = fkW(a, '다섯', 5.0), tT = fkW(a, '이야기', 6.6);
  const cam = qLerpCam(lt / (a._dur || 8), [1010, 520, 1.25], [980, 520, 1.3]);
  const light = easeInOut(gfK(tL, tL + 0.8, lt)), br = lt > tL ? gfBeat(lt, tL + 0.1, 0.03, 2, 3) : 1;
  const zz = odZBed(t, { pose: 'f앉기', ex: fEx(lt > tL ? 'z기본' : 'z멍'), look: lt > tF ? [-0.6, -0.1] : [0.1, 0.4], m: { sy: br } });
  const bed = odBedSit(1);
  let w = bed.back + zz.body + bed.front;
  w += fkCloud(zz.top[0] + 6, zz.top[1] - 60, 0.66 * (1 - 0.25 * light), t, { rain: 1 - 0.7 * light, seed: 4, fall: 120 });
  if (lt > tR && lt < tL + 0.6) w += gfEmote(lt, tR, zz.top[0] + 110, zz.top[1] + 30, 'dots', { hold: tL - tR + 0.4, s: 0.8 });
  w += fkAt(zz.top[0] + 300, zz.top[1] + 110, fkHearts(lt, 1, { low: true }), 0.62);
  let h = fkDefs() + odRoom(t, cam, { night: 1, noClock: true }) + qCam(cam, w);
  h += gfChipAt(lt, tS, 760, 130, '잠들기 전', { size: 42, icon: 'moon', bg: '#C9CFFF', rot: -3 });
  const pk = gfIn(lt, tF - 0.1, 3, 0.45); if (pk > 0.02) h += fkAt(430, 560, fkSecrets(lt, tF, tT), pk);
  return h;
};

/* ===== f1·f2: 빅터 프랭클 ===== */
function fkInv(t, items) { // 소지품 칸: items [[이름, 그림, 사라지는 시각, 나타나는 시각]]
  const W2 = 560, H2 = 290; let s = gfPanel(W2, H2, { head: '소지품', headBg: '#E4E1DA', bg: '#F7F6F2' });
  items.forEach(([name, svg, tOff, tOn], i) => { const x = -W2 / 2 + 100 + i * 180, y = 0, gone = t > tOff, k = gfIn(t, tOn, 3.4, 0.45);
    s += `<rect x="${x - 70}" y="${y - 78}" width="140" height="140" rx="24" fill="${gone ? 'none' : '#ECEAE4'}" stroke="${gone ? '#A3A8B1' : INK}" stroke-width="6"${gone ? ' stroke-dasharray="14 10"' : ''}/>`;
    if (!gone) s += fkAt(x, y - 8, svg, k * gfBeat(t, tOff - 0.2, 0.1, 3, 6));
    else { const u = gfK(tOff, tOff + 0.45, t); if (u < 1) s += fkAt(x, y - 8 - 40 * u, svg, (1 + 0.3 * u) * (1 - u)); s += gfPuff(t, tOff, x, y - 8, 1, '#D9DCE2'); }
    s += gfT(x, y + 112, name, 30, gone ? '#A3A8B1' : GFC.navy, { wt: 800 }); });
  return s;
}
const FK_TAG = `<g transform="rotate(-8)"><rect x="-50" y="-30" width="100" height="62" rx="12" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-30" cy="-12" r="6" fill="none" stroke="${INK}" stroke-width="4"/><rect x="-14" y="-14" width="48" height="8" rx="4" fill="#6B7280"/><rect x="-36" y="6" width="70" height="7" rx="3.5" fill="#A3A8B1"/></g>`;
const FK_FAM = `<g transform="scale(1.35)">${GF_ICON.family ? GF_ICON.family(0) : ''}</g>`;
const FK_PAGES = `<g transform="rotate(6)"><rect x="-40" y="-46" width="80" height="96" rx="8" fill="#fff" stroke="${INK}" stroke-width="5" transform="rotate(-10) translate(-8 4)"/><rect x="-40" y="-46" width="80" height="96" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/>${[0, 1, 2, 3, 4].map(i => `<rect x="-26" y="${-30 + i * 16}" width="${i === 4 ? 30 : 52}" height="6" rx="3" fill="#A3A8B1"/>`).join('')}</g>`;
fkfranklScene = function (t, lt, a, run) {
  const ph = a.ph, s = 0.92, fx = 700;
  if (ph === 0) {
    const D = a._dur || 15, tV = fkW(a, '빅터', 2.4), t42 = fkW(a, '1942', 4.6), tC = fkW(a, '끌려', 6.0), t3 = fkW(a, '3년', 6.8), tNm = fkW(a, '이름', 8.0), tFm = fkW(a, '가족', 8.9), tMs = fkW(a, '원고', 10.6), tLo = fkW(a, '잃었', 11.8);
    const cam = qLerpCam(lt / D, [900, 560, 1.12], [960, 580, 1.2]);
    const sad = lt > tLo, ex = fEx(sad ? 'z울먹' : 'z기본');
    let w = gfActor(FKF, { x: fx, y: FK.FY, s, t, pose: '서기', ex, look: sad ? [0.1, 0.6] : [0.3, 0], seed: 41 }, { sy: 1 - 0.015 * Math.sin(t * 1.5) - (sad ? 0.03 * easeInOut(gfK(tLo, tLo + 0.6, lt)) : 0) });
    const [cx, cy] = fkChest(fx, FK.FY, s), [hx, hy] = fkTop(fx, FK.FY, s);
    w += fkEmber(cx, cy, 0.4, t, { k: 0.85, glow: sad ? 0.9 + 0.1 * Math.sin(t * 3) : 0.8 });
    if (sad) w += gfEmote(lt, tLo + 0.2, hx + 110, hy + 40, 'gloom', { hold: 9, s: 0.9 });
    let h = fkDefs() + fkWinter(t, cam, { dark: 0.12 + 0.12 * gfK(tC, tC + 1, lt), snow: 40 }) + qCam(cam, w);
    h += gfChipAt(lt, tV, 380, 140, '빅터 프랭클', { size: 50, bg: '#F7F6F2', rot: -3 }) + gfChipAt(lt, tV + 0.5, 380, 232, '빈 · 정신과 의사', { size: 32, icon: 'book', bg: '#E4E1DA', rot: -3 });
    h += gfChipAt(lt, t42, 1000, 140, '1942', { size: 44, icon: 'calendar', bg: '#F7F6F2', rot: 2 }) + gfChipAt(lt, t3, 1220, 140, '3년', { size: 44, icon: 'clock', bg: '#F7F6F2', rot: -2 });
    const ik = gfIn(lt, tC, 3, 0.45);
    if (ik > 0.02) h += fkAt(1430, 540, fkInv(lt, [['이름', FK_TAG, tNm, tC + 0.15], ['가족', FK_FAM, tFm, tC + 0.28], ['원고', FK_PAGES, tMs, tC + 0.41]]), ik);
    return h;
  }
  // f2: 춥고 어두운 곳 → 뜻밖의 장면
  const D = a._dur || 5, tC = fkW(a, '춥고', 1.4), tDk = fkW(a, '어두운', 2.0), tU = fkW(a, '뜻밖', 3.0);
  const cam = qLerpCam(gfK(tU - 0.1, tU + 0.9, lt), [960, 580, 1.2], [1080, 560, 1.16]);
  const shiv = lt > tC && lt < tU ? Math.sin(t * 46) * 2.2 : 0, turned = lt > tU;
  let w = gfActor(FKF, { x: fx + shiv, y: FK.FY, s, t, pose: '서기', ex: fEx(turned ? '놀람' : 'z울먹'), look: turned ? [0.9, -0.1] : [0.1, 0.5], seed: 41 }, turned ? gfJelly(lt, tU, 0.12, 5, 8) : { sy: 0.97 });
  const [cx, cy] = fkChest(fx, FK.FY, s), [hx, hy] = fkTop(fx, FK.FY, s);
  w += fkEmber(cx, cy, 0.4, t, { k: 0.85, glow: 0.9 });
  if (lt > tC) { const u = ((lt - tC) * 0.9) % 1; w += `<g opacity="${f1(Math.sin(Math.PI * u) * 0.7 * 100) / 100}"><ellipse cx="${f1(fx + 70 + u * 60)}" cy="${f1(hy + 300 - u * 30)}" rx="${f1(16 + u * 20)}" ry="${f1(10 + u * 12)}" fill="#fff"/></g>`; }
  if (turned) w += gfEmote(lt, tU, hx + 100, hy + 20, 'bang', { hold: 9 });
  const ik = 1 - easeIn(gfK(0, 0.3, lt));
  let h = fkDefs() + fkWinter(t, cam, { dark: 0.24 + 0.22 * easeInOut(gfK(tDk, tDk + 0.6, lt)), snow: lt > tC ? 70 : 40, wind: lt > tC ? 0.7 : 0.2 }) + qCam(cam, w);
  if (ik > 0.02) h += fkAt(1430, 540, fkInv(lt + 99, [['이름', FK_TAG, 0, 0], ['가족', FK_FAM, 0, 0], ['원고', FK_PAGES, 0, 0]]), ik);
  return h;
};

/* ===== f3: 건장한 겉모습 vs 작은 이유 하나 ===== */
fkcompareScene = function (t, lt, a) {
  const tS = fkW(a, '건장', 0.7), tR = fkW(a, '작은', 2.6), tE = fkW(a, '끝까지', 5.0), tN = fkW(a, '않았', 5.9);
  let h = fkDefs() + gfFull('url(#fkPaper)') + gfFull('url(#fkGrain)') + gfRays(t, 960, 540, 1500, '#fff', 14, 0.18, 4);
  const card = (cx, side) => {
    const W2 = 680, H2 = 620, x0 = cx - W2 / 2, y0 = 240, gy = y0 + H2 - 120, id = 'fkCmp' + side, t0 = side ? tR : tS, k = gfIn(lt, side ? tR - 0.1 : 0.05, 3, 0.45);
    if (k < 0.02) return '';
    const win = side === 1 && lt > tE, lose = side === 0 && lt > tE, lk = lose ? easeInOut(gfK(tE, tE + 0.7, lt)) : 0;
    let inner = `<rect x="${x0}" y="${y0}" width="${W2}" height="${H2}" fill="url(#fkWinterSky)"/>` + fkSnow(t, 16, 11 + side * 5, { x0, w: W2, y0, h: H2, sp: 50 }) +
      `<path d="M${x0} ${gy + 6} Q${cx} ${gy - 16} ${x0 + W2} ${gy + 4} V${y0 + H2} H${x0} Z" fill="#E6E8EC" stroke="${INK}" stroke-width="6"/>`;
    if (win) inner += gfRays(t, cx, gy - 220, 520, '#FFF3C4', 12, 0.55 * gfK(tE, tE + 0.4, lt), 10);
    const px = cx, s = side ? 0.7 : 0.8;
    if (side === 0) inner += gfActor(o => FKV(GREY, o), { x: px, y: gy, s, t, pose: lose ? mixPose('주먹', '웅크림', lk) : '주먹', ex: fEx(lose ? 'z울먹' : 'z결심'), look: lose ? [0, 0.7] : [0.2, -0.1], sx: 1.32, seed: 52 }, lt < tS + 0.6 ? gfJelly(lt, tS, 0.1, 5, 8) : {});
    else { inner += gfActor(o => FKV(GREY, o), { x: px, y: gy, s, t, pose: '서기', ex: fEx(win ? 'z빵긋' : 'z기본'), look: win ? [0, -0.3] : [0.2, 0], sx: 0.92, seed: 57 }, win ? gfHop(lt, tE + 0.05, 22, 0.32) : {});
      const [cx2, cy2] = fkChest(px, gy, s); inner += fkEmber(cx2, cy2, 0.5 * (win ? gfBeat(lt, tE, 0.3, 3, 4) : 1), t, { k: gfIn(lt, tR + 0.2, 3, 0.45), seed: 2 }) + gfRing(lt, tR + 0.2, cx2, cy2, 10, 110, '#FFE38A', 8, 0.45); }
    if (lose) inner += fkTint('#3A3F4A', 0.3 * lk);
    let c = `<clipPath id="${id}"><rect x="${x0}" y="${y0}" width="${W2}" height="${H2}" rx="34"/></clipPath><rect x="${x0 + 10}" y="${y0 + 14}" width="${W2}" height="${H2}" rx="34" fill="${GFC.navy}" opacity=".2"/>` +
      `<g clip-path="url(#${id})">${inner}</g><rect x="${x0}" y="${y0}" width="${W2}" height="${H2}" rx="34" fill="none" stroke="${INK}" stroke-width="8"/>`;
    c = fkAt(cx, y0 + H2 / 2, `<g transform="translate(${-cx} ${-(y0 + H2 / 2)})">${c}</g>`, k * (win ? gfBeat(lt, tE, 0.05, 3, 6) : 1));
    c += gfChipAt(lt, t0, cx, y0 - 4, side ? '작은 이유 하나' : '건장한 겉모습', { size: 40, bg: side ? '#FFF3C4' : '#E4E1DA', rot: side ? 2 : -2 });
    if (side === 1 && lt > tN - 0.15) c += fkAt(cx + 170, y0 + 150, gfStamp(lt, tN, '끝까지', { size: 60, col: '#2E9E6B', rot: 10 }));
    return c;
  };
  h += card(540, 0) + card(1380, 1);
  return h;
};

/* ===== f4: 제로의 평범한 하루로 ===== */
fkbridgeScene = function (t, lt, a) {
  const D = a._dur || 7, tA = fkW(a, '이야기를', 0.3), tZ = fkW(a, '제로의', 2.2), tT = fkW(a, '지친', 4.4), tQ = fkW(a, '회복', 5.5);
  const cam = qLerpCam(gfK(tT - 0.5, D, lt), [980, 560, 1.25], [1020, 540, 1.36]), zx = 1060, s = 0.86;
  let set = gfRoom({ wall: '#DDEBFF', wall2: '#C9DCF7', floor: '#C7B79A', fy: FK.FY, base: '#F4F8FF', dots: true }) + gfWindow(180, 200, 400, 300, t, { sky: 'gfDay' }) + gfPlant(1780, FK.FY, 0.9, t) + gfClock(1400, 250, 56, 9, 5);
  const ty = FK.FY - 190;
  set += `<rect x="470" y="${ty}" width="360" height="28" rx="10" fill="${GFC.wood}" stroke="${INK}" stroke-width="7"/><rect x="496" y="${ty + 28}" width="24" height="${FK.FY - ty - 28}" rx="8" fill="${GFC.wood2}" stroke="${INK}" stroke-width="6"/><rect x="780" y="${ty + 28}" width="24" height="${FK.FY - ty - 28}" rx="8" fill="${GFC.wood2}" stroke="${INK}" stroke-width="6"/>` +
    `<g transform="translate(590 ${ty})"><rect x="-70" y="-26" width="140" height="26" rx="6" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-62" y="-50" width="124" height="26" rx="6" fill="#F4F1EA" stroke="${INK}" stroke-width="5"/><rect x="-54" y="-74" width="108" height="26" rx="6" fill="#fff" stroke="${INK}" stroke-width="5"/></g>` +
    `<g transform="translate(730 ${ty})"><rect x="-26" y="-56" width="52" height="56" rx="10" fill="#FF9AA8" stroke="${INK}" stroke-width="5"/><path d="M26 -42 q24 4 0 26" fill="none" stroke="${INK}" stroke-width="5"/></g>`;
  let w = gfActor(FKZW, { x: zx, y: FK.FY, s, t, pose: '서기', ex: fEx(lt > tQ ? 'z멍' : 'z졸음'), look: lt > tA + 1.4 ? [-0.6, -0.1] : [0.2, 0.4], seed: 3 }, { sy: 1 - 0.02 * Math.sin(t * 1.3) });
  const [hx, hy] = fkTop(zx, FK.FY, s), [cx, cy] = fkChest(zx, FK.FY, s);
  w += fkCloud(hx + 8, hy - 90, 0.8, t, { seed: 1 });
  const gx = zx + 320, gy = hy + 70; w += fkAt(gx, gy, fkHearts(lt, 1, { low: true, tp: tT }), 0.8 * gfIn(lt, 0.3, 3, 0.45));
  if (lt > tQ) w += gfEmote(lt, tQ, hx - 110, hy + 10, 'q', { hold: 9 });
  // 동화책의 불씨가 날아와 제로 곁에 머문다
  const u = gfK(tA, tA + 1.4, lt), p = easeInOut(u), ex0 = -60, ey0 = 120, ex1 = zx - 230, ey1 = cy - 30;
  const ex = lerp(ex0, ex1, p), ey = lerp(ey0, ey1, p) - Math.sin(Math.PI * p) * 160;
  if (lt > tA) { for (let i = 1; i <= 5; i++) { const q = Math.max(0, p - i * 0.05); if (q <= 0 || u >= 1) continue; w += `<circle cx="${f1(lerp(ex0, ex1, q))}" cy="${f1(lerp(ey0, ey1, q) - Math.sin(Math.PI * q) * 160)}" r="${f1(10 - i * 1.5)}" fill="#FFE38A" opacity="${f1((0.7 - i * 0.12) * 100) / 100}"/>`; }
    w += fkEmber(ex, ey + (u >= 1 ? Math.sin(t * 2.4) * 8 : 0), 0.5, t, { face: true, glow: 1 }) + (u >= 1 ? gfTwinkle(t, ex + 46, ey - 46, 12, 1, '#FFE38A') : ''); }
  let h = fkDefs() + gfLayer(cam, 0.85, set) + qCam(cam, w);
  h += gfChipAt(lt, tZ, 960, 140, '제로의 평범한 하루', { size: 44, icon: 'calendar', bg: '#fff', rot: -2 });
  return h;
};
