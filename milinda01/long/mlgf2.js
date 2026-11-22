/* 불교 편(수레 문답·무아) — 옛이야기 1: 사갈라의 수레 문답(mlsagala, 대본 14~32번). mlgf.js 뒤에 읽는다. 새 이름은 모두 ml 접두사.
   세계 좌표: 땅 GY, 수레 CX, 왕 KX, 스님 MX. 카메라가 가로로 흐르므로 배경은 x -500 ~ 2900을 덮는다. 붓다·종교 상징 없음(성벽·기둥·나무·평지붕 집만). */
const ML_S = { GY: 890, CX: 560, KX: 1170, MX: 1720, ZG: 230, S: 0.95, SC: 0.9 };
const ML_WOOD = '#B07A3E', ML_WOOD2 = '#8C5C2A', ML_GOLD = '#F2B63C', ML_PURP = '#7A3B8C';

/* ---------- 수레 부품(수레 원점 = 몸통 가운데 아래, 땅 높이. 오른쪽을 본다) ---------- */
function mlWheel(cx, cy, r, rot, far) {
  const c = far ? '#96652F' : ML_WOOD, rim = r * 0.17; let h = `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(rot)})"><circle r="${f1(r - rim / 2 - 3)}" fill="none" stroke="${INK}" stroke-width="${f1(rim + 13)}"/><circle r="${f1(r - rim / 2 - 3)}" fill="none" stroke="${c}" stroke-width="${f1(rim)}"/>`;
  for (let i = 0; i < 8; i++) h += `<path d="M0 ${f1(-r * 0.2)} V${f1(-r + rim + 4)}" stroke="${INK}" stroke-width="16" stroke-linecap="round" transform="rotate(${i * 45})"/>`;
  for (let i = 0; i < 8; i++) h += `<path d="M0 ${f1(-r * 0.2)} V${f1(-r + rim + 4)}" stroke="${far ? '#B88648' : '#D8A460'}" stroke-width="8" stroke-linecap="round" transform="rotate(${i * 45})"/>`;
  return h + `<circle r="${f1(r * 0.21)}" fill="${ML_GOLD}" stroke="${INK}" stroke-width="7"/><circle r="${f1(r * 0.07)}" fill="${INK}"/></g>`;
}
const mlAxle = (x, y, len, rot) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><rect x="${f1(-len / 2)}" y="-13" width="${f1(len)}" height="26" rx="13" fill="${ML_WOOD2}" stroke="${INK}" stroke-width="7"/><path d="M${f1(-len / 2 + 30)} -5 H${f1(len / 2 - 40)}" stroke="#fff" stroke-width="4" opacity=".28" stroke-linecap="round"/>` + [-1, 1].map(sd => `<rect x="${f1(sd * (len / 2 - 6) - 14)}" y="-19" width="28" height="38" rx="9" fill="${ML_GOLD}" stroke="${INK}" stroke-width="6"/>`).join('') + `</g>`;
const mlPole = () => `<path d="M112 -150 L470 -242" stroke="${INK}" stroke-width="32" stroke-linecap="round"/><path d="M112 -150 L470 -242" stroke="${ML_WOOD}" stroke-width="19" stroke-linecap="round"/><path d="M150 -166 L420 -235" stroke="#fff" stroke-width="4" opacity=".3" stroke-linecap="round"/>` +
  `<g transform="translate(470 -242) rotate(-14)"><rect x="-13" y="-70" width="26" height="140" rx="13" fill="${ML_WOOD2}" stroke="${INK}" stroke-width="7"/><path d="M-4 -58 Q-40 -42 -36 -8 M-4 58 Q-40 42 -36 8" fill="none" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="M-4 -58 Q-40 -42 -36 -8 M-4 58 Q-40 42 -36 8" fill="none" stroke="${ML_GOLD}" stroke-width="8" stroke-linecap="round"/></g>` +
  `<g transform="translate(176 -166) rotate(-14)"><rect x="-12" y="-17" width="24" height="34" rx="6" fill="${ML_GOLD}" stroke="${INK}" stroke-width="6"/></g>`;
const ML_BODY_D = 'M-170 -134 L-170 -272 Q-170 -300 -142 -300 L20 -306 Q94 -312 112 -372 Q128 -396 142 -370 L152 -134 Z';
const mlBody = () => `<path d="${ML_BODY_D}" fill="${ML_PURP}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><rect x="-136" y="-262" width="196" height="92" rx="14" fill="#8E4FA0" stroke="${INK}" stroke-width="5"/>` +
  [-88, -38, 12].map(x => `<path d="M${x} -216 l18 -22 l18 22 l-18 22 Z" fill="${ML_GOLD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`).join('') +
  `<path d="M-170 -272 Q-170 -300 -142 -300 L20 -306 Q94 -312 112 -372" fill="none" stroke="${INK}" stroke-width="21" stroke-linecap="round"/><path d="M-170 -272 Q-170 -300 -142 -300 L20 -306 Q94 -312 112 -372" fill="none" stroke="${ML_GOLD}" stroke-width="11" stroke-linecap="round"/>` +
  `<rect x="-188" y="-150" width="356" height="30" rx="11" fill="${ML_WOOD}" stroke="${INK}" stroke-width="8"/>`;
const mlStand = () => `<path d="M404 0 L434 -206 M464 0 L434 -206" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M404 0 L434 -206 M464 0 L434 -206" stroke="${ML_WOOD2}" stroke-width="10" stroke-linecap="round"/><path d="M410 -214 Q434 -190 458 -214" fill="none" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M410 -214 Q434 -190 458 -214" fill="none" stroke="${ML_WOOD}" stroke-width="9" stroke-linecap="round"/>`;
// 큰 ✕ 도장: 쾅 내려찍힌다(세계 좌표)
function mlX(t, t0, x, y, s = 1) { const u = t - t0; if (u < -0.1) return ''; const k = u < 0 ? lerp(2.8, 1, easeIn(gfK(-0.1, 0, u))) : gfBeat(t, t0, 0.2, 5, 10), j = gfShake(t, t0, 6, 0.2);
  return `<g transform="translate(${f1(x + j[0])} ${f1(y + j[1])}) rotate(-8) scale(${f1(s * k * 1000) / 1000})" opacity="${f1(Math.min(1, (u + 0.1) * 14) * 100) / 100}"><circle r="50" fill="#fff" fill-opacity=".92" stroke="#E5484D" stroke-width="10"/><path d="M-22 -22 L22 22 M22 -22 L-22 22" stroke="#E5484D" stroke-width="15" stroke-linecap="round"/></g>` + gfRing(t, t0, x, y, 40 * s, 130 * s, '#E5484D', 10, 0.35); }
// 매달린 이름표(끈 + 꼬리표): 원점 = 끈이 묶인 곳. hollow면 속이 빈 점선
function mlTag(text, o = {}) { const fs = o.fs || 34, w = gfTextW(text, fs) + fs * 1.5, h = fs * 1.7, sw = (o.sway || 0), L = o.len || 46;
  return `<g transform="rotate(${f1(sw)})"><path d="M0 0 V${L}" stroke="${INK}" stroke-width="5"/><g transform="translate(0 ${L + h / 2 - 4})">` + (o.hollow ? `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="14" fill="#fff" fill-opacity=".12" stroke="${o.dash || '#fff'}" stroke-width="6" stroke-dasharray="14 10"/>` :
    `<rect x="${f1(-w / 2)}" y="${f1(-h / 2 + 6)}" width="${f1(w)}" height="${f1(h)}" rx="14" fill="#1E2A4A" opacity=".2"/><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="14" fill="${o.bg || '#FFF6D8'}" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="${f1(-h / 2 + 12)}" r="6" fill="#fff" stroke="${INK}" stroke-width="4"/>` + gfT(0, fs * 0.42, text, fs, o.col || GFC.navy)) + `</g></g>`; }

/* ---------- 무대 ---------- */
function mlSagalaSet(t) {
  const { GY } = ML_S;
  const sky = `<rect x="-900" y="-500" width="4400" height="1900" fill="url(#mlSSky)"/>` + gfxGlow(1980, 250, 620, '#FFF1C0', 0.75, { blend: false }) + `<circle cx="1980" cy="250" r="92" fill="#FFF6D6"/>` + [[300, 150, 1.1], [1100, 90, 0.8], [2500, 190, 1.2]].map(([x, y, s]) => `<g opacity=".7">${gfCloud(x + Math.sin(t * 0.05) * 30, y, s, 0.9)}</g>`).join('');
  const hill = (y, amp, wl, col, off) => { let d = `M-900 1500 L-900 ${y}`; for (let x = -900; x <= 3500; x += 70) d += ` L${x} ${f1(y - amp * (0.5 + 0.5 * Math.sin((x + off) / wl * 6.283)) - amp * 0.35 * Math.sin((x + off * 1.7) / (wl * 0.41)))}`; return `<path d="${d} L3500 1500 Z" fill="${col}"/>`; };
  const mount = hill(600, 230, 1500, '#EDB98A', 200) + hill(660, 150, 900, '#E2A777', 900);
  // 성벽과 평지붕 집들
  let town = `<rect x="-900" y="560" width="4400" height="400" fill="#D9A671"/>` + Array.from({ length: 44 }, (_, i) => `<rect x="${-900 + i * 100}" y="536" width="56" height="30" fill="#D9A671"/>`).join('') + `<path d="M-900 566 H3500" stroke="#B9824E" stroke-width="5" opacity=".6"/>`;
  [[-200, 190], [900, 150], [2300, 210]].forEach(([x, h]) => { town += `<rect x="${x}" y="${566 - h}" width="190" height="${h + 300}" fill="#CF9A64"/><rect x="${x - 14}" y="${566 - h - 30}" width="218" height="34" fill="#C28C56"/>` + [0, 1, 2].map(i => `<rect x="${x + 30 + i * 50}" y="${566 - h + 40}" width="24" height="46" rx="12" fill="#8E5F36" opacity=".7"/>`).join(''); });
  [[320, 120, 260], [640, 90, 200], [1300, 130, 300], [1700, 100, 220], [2700, 120, 260]].forEach(([x, h, w]) => { town += `<rect x="${x}" y="${640 - h}" width="${w}" height="${h + 300}" fill="#E4B682"/><rect x="${x - 10}" y="${640 - h - 16}" width="${w + 20}" height="20" fill="#CE9C66"/><rect x="${x + w * 0.36}" y="${640 - h + 34}" width="${w * 0.22}" height="${h}" rx="8" fill="#9A6B40" opacity=".65"/>`; });
  // 기둥 줄(가운데 깊이): 그리스풍 기둥 + 가로대
  const col = x => `<rect x="${x - 34}" y="250" width="68" height="${GY - 250}" fill="#F0DDBB" stroke="#8A6238" stroke-width="6"/>` + [-16, 0, 16].map(d => `<path d="M${x + d} 270 V${GY - 30}" stroke="#D9C198" stroke-width="5"/>`).join('') + `<rect x="${x - 52}" y="222" width="104" height="34" rx="8" fill="#F6E7CB" stroke="#8A6238" stroke-width="6"/><rect x="${x - 50}" y="${GY - 34}" width="100" height="34" rx="6" fill="#F6E7CB" stroke="#8A6238" stroke-width="6"/>`;
  const colon = `<rect x="-420" y="150" width="1260" height="78" fill="#EBD5AE" stroke="#8A6238" stroke-width="6"/><path d="M-420 190 H840" stroke="#CDB388" stroke-width="5"/>` + [-340, -60, 220, 500, 780].map(col).join('');
  // 큰 나무(오른쪽) + 돌 단
  const sw = Math.sin(t * 0.8) * 1.4, tree = `<path d="M2060 ${GY} Q2040 640 2090 430 L2190 430 Q2230 640 2210 ${GY} Z" fill="#8A5A34" stroke="#5E3B1E" stroke-width="7"/><path d="M2110 620 Q2130 520 2120 450" stroke="#6E4526" stroke-width="7" fill="none" opacity=".6"/><g transform="rotate(${f1(sw)} 2140 430)">` +
    [[1900, 330, 250, '#5FA35A'], [2180, 250, 290, '#6DB368'], [2420, 360, 240, '#559650'], [2080, 150, 230, '#7CC074'], [2330, 170, 210, '#69AE63']].map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="#3E7240" stroke-width="7"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.35}" r="${r * 0.28}" fill="#fff" opacity=".12"/>`).join('') + `</g>`;
  const ground = `<rect x="-900" y="${GY}" width="4400" height="700" fill="url(#mlSGround)"/><path d="M-900 ${GY} H3500" stroke="#A9793F" stroke-width="7"/>` + Array.from({ length: 16 }, (_, i) => `<path d="M${-700 + i * 260} ${GY + 46 + (i % 3) * 38} h${90 + (i % 4) * 30}" stroke="#C49556" stroke-width="7" stroke-linecap="round" opacity=".7"/>`).join('');
  const dais = `<path d="M1560 ${GY} L1590 ${GY - 46} L2360 ${GY - 46} L2390 ${GY} Z" fill="#DCC7A0" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><rect x="1600" y="${GY - 64}" width="250" height="22" rx="9" fill="#C96F1E" stroke="${INK}" stroke-width="6"/>` +
    `<g transform="translate(1990 ${GY - 46})"><path d="M-36 0 Q-50 -70 -18 -86 L18 -86 Q50 -70 36 0 Z" fill="#B9825A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-24" y="-98" width="48" height="16" rx="7" fill="#A06E48" stroke="${INK}" stroke-width="6"/></g>`;
  // 카메라 앞: 나뭇잎(위 오른쪽), 기둥 모서리(왼쪽)
  const fg = `<g transform="rotate(${f1(Math.sin(t * 0.9) * 2)} 2300 -100)">` + [[1900, -40, 210], [2180, 30, 250], [2460, -30, 230], [2700, 60, 240]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#3F7F46" stroke="#2B5A31" stroke-width="9"/>`).join('') + `</g>`;
  return { sky, mount, town, colon, tree, ground, dais, fg };
}

/* ---------- 본 장면 ---------- */
function mlsagalaScene(t, lt, a) {
  const { GY, CX, KX, MX, ZG, S, SC } = ML_S, c = mlCur(t), id = c ? c.id : 's14', n = parseInt(id.slice(1)) || 14, L = k => mlL('s' + k), T0 = k => mlT0('s' + k), T1 = k => mlT1('s' + k);
  /* --- 사건 시각 --- */
  const tArr = T0(14) + 2.0, tKH = mlAt('s14', '밀린다', 0.62) - 0.1;                                   // 수레가 멈춤, 왕이 내려섬
  const tSt1 = T1(16) + 0.1;                                                         // "원래 수레" 탁
  const tTagA = mlAt('s18', '나가', 0.02) + 0.3, tTagH = mlAt('s18', '알맹이', 0.82) + 0.2;             // 이름표 → 속이 빔
  const tI = [mlAt('s19', '옷', 0.38), mlAt('s19', '밥', 0.5), mlAt('s19', '수행', 0.72)];
  const tWhip = T1(20) + 0.02;
  const tP = mlAt('s22', '끌채', 0.72) + 0.1, tX1 = T1(23) + 0.1;                   // 끌채 분리, ✕
  const tA = mlAt('s24', '굴대', 0.02) + 0.15, tW = mlAt('s24', '바퀴', 0.56) + 0.15;                   // 굴대, 바퀴(+ 몸통 쿵)
  const tSt2 = T1(25) + 0.36, tX2 = T1(26) + 0.1;                    // 바퀴에 탁, ✕ 둘
  const tGh = mlAt('s27', '어디', 0.36);
  const rP = mlAt('s29', '끌채', 0.02) + 0.1, rA = mlAt('s29', '굴대', 0.19) + 0.1, rW = mlAt('s29', '바퀴', 0.32) + 0.1, tName = mlAt('s29', '수레라고', 0.7) + 0.2, SN = 0.26;   // 돌아와 철컥(SN초 뒤)
  const tTagF = mlAt('s30', '나가', 0.42) + 0.3;
  const tHop = T0(31) - 0.55, tC = [mlAt('s31', '몸', 0.01), mlAt('s31', '기분', 0.08), mlAt('s31', '기억', 0.19), mlAt('s31', '버릇', 0.3), mlAt('s31', '생각', 0.4)], tMe = mlAt('s31', '나도', 0.92);
  const tWave = mlAt('s32', '대답', 0.32), tPush = mlAt('s32', '변하지', 0.64), tPe = mlAt('s32', '어디에도', 0.84), tPress = tPe + 0.75, tPop = tPress + 0.7;
  const hits = [[tSt1, 0.09, 0.2], [tSt2, 0.08, 0.2], [rP + SN, 0.06, 0.16], [rA + SN, 0.06, 0.16], [rW + SN, 0.08, 0.2]], tt = gfxStop(t, hits);
  /* --- 수레 상태 --- */
  const pop = t0 => gfIn(tt, t0, 2.4, 0.5), ret = r => easeIn(gfK(r, r + SN, tt)), snap = r => actHit(tt, r + SN, 0.1, 5.5, 9);
  const kP = pop(tP) * (1 - ret(rP)), kA = pop(tA) * (1 - ret(rA)), kW = pop(tW) * (1 - ret(rW));
  const cx = CX, roll = 0, brake = { sx: 1, sy: 1 };   // 수레는 처음부터 서 있다(말을 풀고 끌채를 받침대에 올려 둔 상태). 말 없이 혼자 굴러 들어오면 이상하다(2026-11-22 점검)
  const fall = gfK(tW + 0.05, tW + 0.27, tt), dropK = (tt < tW + 0.05 ? 0 : fall * fall) * (1 - easeInOut(gfK(rW, rW + SN, tt))), dropY = 134 * dropK, jb = gfM(actHit(tt, tW + 0.27, 0.12, 5, 8), snap(rW), { sx: brake.sx, sy: brake.sy });
  const ex = (k, dx, dy, r, px, py, inner) => `<g transform="translate(${f1(dx * k)} ${f1(dy * k)}) rotate(${f1(r * k)} ${px} ${py})">${inner}</g>`;
  const PT = { pole: [150, -380, -14], axle: [-290, -360], wn: [-380, -52, -170], wf: [330, -40, 150] };       // 분해도에서 부품이 가는 곳(수레 좌표)
  const nearW = ex(kW, PT.wn[0], PT.wn[1], 0, 0, 0, mlWheel(-10, -118, 118, roll + PT.wn[2] * kW, false)), farW = ex(kW, PT.wf[0], PT.wf[1], 0, 0, 0, mlWheel(44, -126, 108, roll * 1.09 + PT.wf[2] * kW, true));
  const axle = kA > 0.02 ? mlAxle(lerp(-10, -10 + PT.axle[0], kA), lerp(-118, -118 + PT.axle[1], kA), 300 * Math.min(1, kA * 1.4), -6 * kA) : '';
  const pole = ex(kP, PT.pole[0], PT.pole[1], PT.pole[2], 290, -196, mlPole());
  const bodyG = inner => `<g transform="translate(0 ${f1(dropY)}) translate(0 -134) scale(${f1(jb.sx * 1000) / 1000} ${f1(jb.sy * 1000) / 1000}) translate(0 134)">${inner}</g>`;
  const W2 = (x, y) => [cx + x, GY + y];                                                                  // 수레 좌표 → 세계 좌표
  /* --- 제로: 수레 위(몸통 안) → 31번에서 땅으로 깡충 --- */
  const hk = gfK(tHop, tHop + 0.5, tt), onG = tt >= tHop + 0.5, zx = tt < tHop ? cx + 30 : lerp(CX + 30, ZG, easeInOut(hk)), zy = tt < tHop ? GY - 150 + dropY : lerp(GY - 150, GY, hk) - Math.sin(Math.PI * hk) * 150, zs = lerp(SC, S, hk);
  const zta = gfxTalkAct(t, 'Z', 2), zj = gfM(actHit(tt, tW + 0.27, 0.1, 5, 7), actHit(tt, tHop + 0.5, 0.1, 5, 8), actHit(tt, tSt1, 0.05, 5, 8), snap(rW));
  const zBase = n < 15 ? 'z기본' : n === 15 ? (t < mlAt('s15', '제로', 0.75) ? 'ml멍' : 'ml쓴웃음') : n <= 20 ? 'z기본' : n === 21 ? 'z뿌듯' : (tt < tP ? 'z기본' : tt < tW + 0.27 ? 'z당황' : tt < tW + 1.25 ? 'z충격' : tt < T0(27) ? 'z당황' : tt < rP ? 'ml멍' : tt < tName ? 'z당황' : n <= 30 ? 'z반짝' : tt < tPe ? 'z기본' : 'z당황');
  const zSw = 1 - mlS(t, tKH - 0.7, 0.5), zLook = n <= 14 ? [0.6 + 0.3 * Math.sin((t - T0(14)) * 1.4) * zSw, 0.06 * Math.sin((t - T0(14)) * 2.3) * zSw] : n === 15 ? (t < mlAt('s15', '제로', 0.75) ? [Math.sin((t - T0(15)) * 3.5) * 0.9, 0] : [0, 0.1]) : n <= 21 ? [0.8, 0.05] : tt < rP ? [0.3, 0.6] : n <= 30 ? [0.7, 0] : tt < tWave ? [0.15, 0.1] : tt < tPush ? [0.85, 0] : [0, 0.9];
  const zPose = onG ? actPose([[0, '서기'], [tWave + 0.3, '손인사', { f: 3, z: 0.6 }], [tPush - 0.2, '서기', { f: 2.6, z: 0.8 }], [tPress - 0.4, 'ml받침', { f: 3.4, z: 0.7 }], [tPop + 0.5, '서기', { f: 2.6, z: 0.8 }]], tt) : (hk > 0 ? P['점프'] : actPose([[0, 'ml고삐'], [mlAt('s21', '수레', 0.3), '손인사', { f: 3.2, z: 0.55 }], [T1(21) + 0.4, 'ml고삐', { f: 2.6, z: 0.8 }], [T0(28) - 0.2, 'ml으쓱', { f: 3, z: 0.6 }], [rP, 'ml고삐', { f: 3, z: 0.7 }]], tt));
  const wv = (n === 21 && tt > mlAt('s21', '수레', 0.3)) || (onG && tt > tWave + 0.3 && tt < tPush - 0.2) ? Math.sin(tt * 13) * 10 : 0, zP2 = wv ? Object.assign({}, zPose, { hR: [zPose.hR[0] + wv, zPose.hR[1]], armR: zPose.armR.map((q, i) => i === 2 ? [q[0] + wv, q[1]] : q) }) : zPose;
  const zero = mlZ({ x: zx, y: zy, s: zs, t: tt, pose: zP2, ex: gfxFace('mlzf', zBase, t, 'Z'), look: zLook, turn: zLook[0] * 0.4, headDy: zta.headDy, tilt: zta.tilt, sx: zj.sx, sy: zj.sy * zta.sy, light: 1 }, true);
  const hand = (hx, hy) => [zx + (hx - 200) * zs, zy + (hy - 560) * zs], hl = hand(204, 358), hr = hand(314, 340), ye = [cx + 470 + PT.pole[0] * kP, GY - 242 + PT.pole[1] * kP];
  const reins = onG || hk > 0 ? '' : (kP < 0.25 ? `<path d="M${f1(hl[0])} ${f1(hl[1])} Q${f1((hl[0] + ye[0]) / 2)} ${f1(hl[1] + 70)} ${f1(ye[0] - 8)} ${f1(ye[1] + 34)} M${f1(hr[0])} ${f1(hr[1])} Q${f1((hr[0] + ye[0]) / 2)} ${f1(hr[1] + 50)} ${f1(ye[0] - 8)} ${f1(ye[1] - 30)}" fill="none" stroke="#5E3B1E" stroke-width="6" stroke-linecap="round"/>` :
    `<path d="M${f1(hl[0])} ${f1(hl[1])} Q${f1(hl[0] + 60)} ${f1(hl[1] + 90)} ${f1(hl[0] + 150)} ${f1(GY + dropY * 0 - 6)} q30 8 60 -4 M${f1(hr[0])} ${f1(hr[1])} Q${f1(hr[0] + 50)} ${f1(hr[1] + 110)} ${f1(hr[0] + 110)} ${f1(GY - 4)} q30 6 50 -6" fill="none" stroke="#5E3B1E" stroke-width="6" stroke-linecap="round"/>`);
  /* --- 왕 --- */
  const kHk = gfK(tKH, tKH + 0.55, t), kOn = t >= tKH + 0.55, kx = t < tKH ? cx - 116 : lerp(CX - 116, KX, easeInOut(kHk)), ky = t < tKH ? GY - 150 : lerp(GY - 150, GY, kHk) - Math.sin(Math.PI * kHk) * 170;
  const kta = gfxTalkAct(t, 'K', 5), kj = actHit(t, tKH + 0.55, 0.11, 5, 8);
  const kBase = n <= 18 ? 'ml왕' : n <= 20 ? 'ml왕의심' : n === 21 ? 'ml왕' : n <= 28 ? (t > tX2 + 0.5 ? 'ml왕의심' : 'ml왕') : n === 29 ? (t < mlAt('s29', '모였', 0.42) ? 'ml왕의심' : 'ml왕깨달') : 'ml왕깨달';
  const kLook = n <= 21 ? [0.85, 0] : n <= 29 ? (t > rP && n === 29 ? [-0.8, 0.1] : [-0.7, 0.15]) : n === 30 ? [0.85, 0] : (t > tWave ? [0.6, 0] : [-0.85, 0.05]);
  const kPose = !kOn ? (kHk > 0 ? P['점프'] : P['서기']) : actPose([[0, '서기'], [T0(17) - 0.1, '손인사', { f: 3, z: 0.6 }], [T1(17) + 0.3, '서기', { f: 2.4, z: 0.8 }], [mlAt('s19', '없다', 0.12), 'ml으쓱', { f: 3.2, z: 0.55 }], [T1(19) + 0.3, '서기', { f: 2.4, z: 0.8 }], [mlAt('s21', '수레', 0.1) - 0.1, 'ml엄지뒤', { f: 3.4, z: 0.6 }], [T1(21) + 0.5, '서기', { f: 2.4, z: 0.8 }],
    [T0(26) - 0.5, '턱괴기', { f: 2.6, z: 0.7 }], [T1(26) + 0.5, '서기', { f: 2.4, z: 0.8 }], [mlAt('s29', '모였', 0.42), 'ml가리킴L', { f: 3.2, z: 0.55 }], [T1(29) + 0.4, '서기', { f: 2.4, z: 0.8 }]], t);
  const king = mlK({ x: kx, y: ky, s: kOn || kHk > 0 ? 1.0 : 0.94, t, pose: kPose, ex: gfxFace('mlkf', kBase, t, 'K', { brow: 6 }), look: kLook, turn: kLook[0] * 0.45, headDy: kta.headDy + (n >= 30 ? actNod(t, T1(30) - 0.6, 2, 9, 0.3) : 0) + (n === 23 || (n === 26 && t > tX2 - 0.3) ? 0 : 0), tilt: kta.tilt + (n === 23 || (n === 26 && t > tX2 - 0.4) ? Math.sin(t * 11) * 3.5 : 0), sx: kj.sx, sy: kj.sy * kta.sy, light: 1 });
  /* --- 스님 --- */
  const mta = gfxTalkAct(t, 'M', 7), mla = gfxListenAct(t, 3, 3.1), mTalk = !!gfxVoice(t, 'M');
  const mPose = actPose([[0, '서기'], [mlAt('s18', '하지만', 0.3), 'ml가슴손', { f: 2.6, z: 0.7 }], [T1(18) + 0.3, '서기', { f: 2.2, z: 0.85 }], [mlAt('s20', '수레', 0.62) - 0.15, 'ml가리킴L', { f: 3, z: 0.6 }], [tWhip + 0.02, '서기', { f: 5, z: 0.9 }],
    [mlAt('s22', '끌채', 0.72), 'ml가리킴L', { f: 3, z: 0.6 }], [T1(24) + 0.4, '서기', { f: 2.2, z: 0.85 }], [mlAt('s30', '나가', 0.42), 'ml가슴손', { f: 2.6, z: 0.7 }], [T1(30) + 0.6, '서기', { f: 2.2, z: 0.85 }], [tWave, '손인사', { f: 3, z: 0.6 }], [tPush, '서기', { f: 2.2, z: 0.85 }]], t);
  const mwv = t > tWave + 0.2 && t < tPush ? Math.sin(t * 12) * 10 : 0, mP2 = mwv ? Object.assign({}, mPose, { hR: [mPose.hR[0] + mwv, mPose.hR[1]], armR: mPose.armR.map((q, i) => i === 2 ? [q[0] + mwv, q[1]] : q) }) : mPose;
  const monk = mlM({ x: MX, y: GY, s: 0.98, t, pose: mP2, ex: gfxFace('mlmf', mTalk && n !== 30 ? 'ml스님뜬' : 'ml스님', t, 'M', { brow: 3 }), look: n >= 31 ? [-0.8, 0] : [-0.8, 0.05], turn: -0.4, headDy: mTalk ? mta.headDy : mla.headDy, tilt: mTalk ? mta.tilt : mla.tilt, sy: mta.sy, light: 1 });
  /* --- 딱지(제로 머리 위)와 스티커 --- */
  const tak0 = [zx + 26 * zs, zy - 494 * zs + zta.headDy], mouth = [tak0[0], tak0[1] - 36], chest = tx => [zx - 2, zy - 226 * zs];
  const wnW = W2(-10 + PT.wn[0] * kW, -118 + PT.wn[1] * kW), pressK = gfK(tPress, tPress + 0.2, t) * (1 - gfK(tPop - 0.12, tPop, t));
  const evs = [{ t0: -99, from: mouth, to: () => [zx - 2, zy - 226 * zs], text: ['원래', '무대 체질 아님'], fs: 20, rot: -5, peel: q => q < tPe ? 0 : (q < tPop ? 0.7 * mlS(q, tPe, 0.3) * (1 - 0.93 * gfK(tPress, tPress + 0.2, q)) : 0.05 + 0.75 * gfIn(q, tPop, 3.2, 0.35)) },
    { t0: tSt1, from: mouth, to: () => W2(-40, -216 + dropY), text: '원래 수레', fs: 24, rot: -4, arc: 30, fly: 0.22, tp: T0(16) - 0.1, te: T1(16) - 0.1, off: tX2 + 0.12, offDx: -60 },
    { t0: tSt2, from: mouth, to: () => W2(-10 + PT.wn[0] * kW, -118 + PT.wn[1] * kW), text: '원래 수레', fs: 22, rot: 8, arc: 140, fly: 0.3, tp: T0(25) - 0.1, te: T1(25) - 0.05, off: tX2 + 0.05, offDx: 40 }];
  const st = mlStickers(t, evs), tv = gfxVoice(t, 'T');
  const kPr = mlS(t, tPress - 0.25, 0.25) * (1 - mlS(t, tPop + 0.2, 0.3)), takPos = [lerp(tak0[0], zx + 96 * zs, kPr), lerp(tak0[1], zy - 150 * zs, kPr) - Math.sin(Math.PI * gfK(tPress - 0.25, tPress, t)) * 60 * (t < tPress ? 1 : 0)];
  const takEx = (t > tX1 && t < tX1 + 1.2) || (t > tX2 && t < T0(27) + 1) || t > tPop ? 'shock' : ((t > tSt1 + 0.12 && t < T0(17) + 0.5) || (t > tSt2 + 0.2 && t < tX2) ? 'proud' : 'on');
  const tak = mlTak(takPos[0], takPos[1], 0.58, Object.assign({ t, look: t > tPe ? [-0.5, 0.9] : (n >= 22 && n <= 29 ? [0.4, 0.8] : [0.7, 0.3]), talk: tv ? tv.e : 0, ex: takEx, ls: 0.72 }, st.tak, t >= tPress - 0.05 && t < tPop ? { arm: 'throw' } : {}, gfM(gfHop(tt, tSt1 - 0.25, 16, 0.2), gfHop(tt, tSt2 - 0.3, 16, 0.2), actHit(tt, tW + 0.27, 0.12, 5, 7))));
  /* --- 꼬리표·도장·점선(빛 받지 않는 층) --- */
  const lab = (t0, x, y, text) => t < t0 || (t >= T0(28) - 0.15 && t < T0(29) - 0.15) ? '' : `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(gfIn(t, t0, 3.2, 0.42) * (1 - mlS(t, rW + SN, 0.25)) * 1000) / 1000})">${gfChip(text, { size: 34 })}</g>`;
  const pP = W2(290 + PT.pole[0] * kP, -196 + PT.pole[1] * kP), pA = W2(-10 + PT.axle[0] * kA, -118 + PT.axle[1] * kA), pF = W2(44 + PT.wf[0] * kW, -126 + PT.wf[1] * kW), orig = W2(0, -200);
  let info = ''; const cu28 = t >= T0(28) - 0.15 && t < T0(29) - 0.15;
  if (t > tP && t < rW + SN + 0.3) { const dl = (p, k) => k < 0.5 || t > rP || cu28 ? '' : `<path d="M${f1(p[0])} ${f1(p[1])} L${f1(orig[0])} ${f1(orig[1])}" stroke="#fff" stroke-width="5" stroke-dasharray="6 14" stroke-linecap="round" opacity="${f1(0.75 * mlS(t, T0(27) - 0.3, 0.5) * 100) / 100}"/>`;
    info += dl(pP, kP) + dl(pA, kA) + dl(wnW, kW) + dl(pF, kW);
    if (t > tGh - 0.4 && t < rP + 0.2 && !cu28) { const g = mlS(t, tGh - 0.4, 0.5) * (1 - mlS(t, rP - 0.1, 0.3)) * (0.75 + 0.25 * Math.sin(t * 6)); info += `<g transform="translate(${f1(cx)} ${GY})" opacity="${f1(g * 100) / 100}" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="16 12" stroke-linecap="round"><path d="${ML_BODY_D}"/><circle cx="-10" cy="-118" r="112"/><path d="M112 -150 L470 -242"/></g>` + (t > tGh ? `<g transform="translate(${f1(cx + 10)} ${GY - 706}) scale(${f1(gfIn(t, tGh, 3, 0.4) * (1 - mlS(t, rP - 0.1, 0.3)) * 1000) / 1000})">${gfChip('수레?', { size: 46, bg: '#FFF6D8' })}</g>` : ''); }
    info += lab(tP + 0.3, pP[0] + 30, pP[1] - 92, '끌채') + lab(tA + 0.3, pA[0], pA[1] - 96, '굴대') + lab(tW + 0.35, wnW[0] - 10, wnW[1] - 168, '바퀴') + lab(tW + 0.45, pF[0] + 10, pF[1] - 160, '바퀴');
    if (t < rP) info += mlOp(1 - mlS(t, rP - 0.35, 0.3), (cu28 ? '' : mlX(t, tX1, pP[0] - 40, pP[1] + 10, 1.15)) + mlX(t, tX2, pA[0], pA[1], 1.1) + mlX(t, tX2 + 0.12, wnW[0], wnW[1], 1.35) + mlX(t, tX2 + 0.2, pF[0], pF[1], 1.25)); }
  [[rP, pP], [rA, [cx - 10, GY - 118]], [rW, [cx, GY - 120]]].forEach(([r, p]) => { const o = W2(290, -196); info += gfxImpact(t, r + SN, r === rP ? o[0] : p[0], r === rP ? o[1] : p[1], { flash: false, r: 150, n: 12, col: '#FFF3C4' }); });
  if (t > tName - 0.3) info += `<g transform="translate(${f1(cx + 300)} ${f1(GY - 420 + (1 - Math.min(1, gfIn(t, tName - 0.3, 2.6, 0.45))) * -300)})">${mlTag('수레', { fs: 46, len: 60, sway: 6 * Math.exp(-(t - tName) * 1.5) * Math.sin((t - tName) * 7) })}</g>` + gfStarBurst(t, tName, cx + 300, GY - 310, { n: 7, r0: 40, r1: 190 });
  // 스님의 이름표(18번: 생김 → 속이 빔, 30번: 다시 채워짐)
  if (t > tTagA && n >= 18) { const hollow = t > tTagH && t < tTagF, vis = n <= 19 || n >= 30 ? 1 : 0; if (vis) info += `<g transform="translate(${n >= 31 ? MX - 185 : MX + 250} ${n >= 31 ? GY - 590 : GY - 560}) scale(${f1(gfIn(t, tTagA, 3, 0.42) * 1000) / 1000})">${mlTag('나가세나', { fs: 40, hollow, dash: '#FFF6D8', sway: 2 * Math.sin(t * 1.6) })}</g>` + gfPuff(t, tTagH, MX + 250, GY - 470, 1.3, '#FFF6D8') + gfStarBurst(t, tTagF, MX + 250, GY - 480, { n: 6, r0: 30, r1: 150 }); }
  // 왕의 따짐(19번): 옷·밥·수행 + ?
  if (n === 19) { const ic = [`<path d="M-20 -22 L20 -22 L30 24 L-30 24 Z" fill="#E79A3C" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-20 -22 L8 24" stroke="#C96F1E" stroke-width="8"/>`, `<path d="M-28 -4 Q-28 26 0 26 Q28 26 28 -4 Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-22 -6 Q0 -34 22 -6 Z" fill="#FFF6D8" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`, `<circle cy="-16" r="12" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M-24 26 Q-22 -2 0 -2 Q22 -2 24 26 Z" fill="#E79A3C" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`];
    tI.forEach((t0, i) => { if (t < t0) return; const k = gfIn(t, t0, 3.2, 0.42); info += `<g transform="translate(${KX + 135 + i * 104} ${GY - 545 + Math.sin(t * 2.4 + i) * 4}) scale(${f1(k * 1000) / 1000})"><circle r="50" fill="#fff" stroke="${INK}" stroke-width="6"/>${ic[i]}<g transform="translate(36 -36)"><circle r="20" fill="${GFC.grape}" stroke="${INK}" stroke-width="5"/>${gfT(0, 11, '?', 30, '#fff')}</g></g>`; }); }
  // 31번: 다섯 부품 칩 → '나' 이름표
  if (n >= 31) { const names = [['몸', 'hand', -250, -400], ['기분', 'heart', -290, -200], ['기억', 'book', 250, -470], ['버릇', 'clock', 300, -90], ['생각', 'bulb', 70, -440]], zc = [ZG, GY - 300], km = mlS(t, tMe - 0.1, 0.35);
    names.forEach(([tx, icn, dx, dy], i) => { if (t < tC[i] || km >= 1) return; const k = gfIn(t, tC[i], 3.2, 0.42) * (1 - km), px = zc[0] + dx * (1 - km), py = zc[1] + dy * (1 - km) + Math.sin(t * 2.2 + i) * 4;
      info += `<path d="M${f1(px)} ${f1(py)} L${f1(zc[0] + dx * 0.25)} ${f1(zc[1] + dy * 0.25)}" stroke="#fff" stroke-width="5" stroke-dasharray="6 12" stroke-linecap="round" opacity="${f1(0.8 * (1 - km) * 100) / 100}"/><g transform="translate(${f1(px)} ${f1(py)}) scale(${f1(k * 1000) / 1000})">${gfChip(tx, { size: 38, icon: icn })}</g>`; });
    if (t > tMe + 0.1 && t < tPush + 0.4) info += `<g transform="translate(${ZG + 230} ${f1(GY - 520)}) scale(${f1(gfIn(t, tMe + 0.1, 3, 0.42) * (1 - mlS(t, tPush, 0.4)) * 1000) / 1000})">${mlTag('제로', { fs: 44, sway: 5 * Math.exp(-(t - tMe) * 1.5) * Math.sin((t - tMe) * 7) })}</g>` + gfStarBurst(t, tMe + 0.1, ZG, GY - 320, { n: 8, r0: 60, r1: 260 }); }
  const em = gfEmote(t, mlAt('s15', '제로', 0.75) + 0.1, zx + 150, zy - 500 * zs, 'q', { hold: 1.4, s: 0.9 }) + gfEmote(t, tP + 0.15, zx + 150, zy - 500 * zs, 'bang', { hold: 0.9, s: 0.9 }) + gfEmote(t, tW + 0.4, zx - 150, zy - 470 * zs, 'shock', { hold: 0.8 }) + gfEmote(t, T0(28) - 0.5, zx + 150, zy - 480 * zs, 'dots', { hold: 1.2, s: 0.85 }) + gfEmote(t, tName + 0.2, KX + 130, GY - 560, 'idea', { hold: 1.5 }) + gfEmote(t, tTagF + 0.4, KX + 130, GY - 560, 'bang', { hold: 1.0, s: 0.9 });
  const dust = gfPuff(t, tKH + 0.55, KX, GY - 4, 1.2, '#F2DDB0') + gfPuff(t, tW + 0.27, cx - 60, GY - 4, 1.6, '#F2DDB0') + gfPuff(t, tW + 0.27, cx + 90, GY - 4, 1.3, '#F2DDB0') + gfPuff(t, tHop + 0.5, ZG, GY - 4, 1.2, '#F2DDB0');
  /* --- 카메라 ---
     14번: 먼 도시에서 물러나며 내려와 서 있는 수레를 보여 준다. 15번: 왕이 화면 끝에 걸치지 않게. 16번: 수레 전체가 보이게 물러나 '탁'을 화면 안에서 보여 주고 왕 쪽으로 넘어간다.
     19번: 왼쪽의 수레 몸통(~722)·제로 머리와 오른쪽의 스님(1627~)이 모두 화면 밖에 있도록 [734, 1606]. 키 목록 안에는 // 주석을 달지 않는다(같은 줄의 뒤 키가 지워진다). */
  const CH = [CX + 70, GY - 330];
  let cam = gfxCam([[0, { x: 800, y: 412, z: 1.38 }], [T0(14) - 0.25, { x: 660, y: 548, z: 1.0 }, { d: 3.2, ease: 'out' }], [T0(14) + 3.0, { x: 700, y: 548, z: 1.03 }, { d: Math.max(0.5, tKH - T0(14) - 3.2) }], [tKH + 0.2, { x: 1400, y: 540, z: 1.06 }, { d: Math.max(1.6, T1(14) - tKH - 0.3), ease: 'io' }],
    [T0(15) - 0.15, { x: CX - 80, y: 470, z: 1.74 }, { ease: 'cut' }], [T0(15), { x: CX - 70, y: 464, z: 1.82 }, { d: 4 }], [T0(16) - 0.2, { x: 720, y: 540, z: 1.28 }, { d: 0.55 }],
    [tSt1 + 0.2, { x: 1445, y: 545, z: 1.3 }, { d: 0.38, ease: 'io' }], [T0(17) + 0.35, { x: 1445, y: 540, z: 1.34 }, { d: 2.15 }], [T0(18) - 0.15, { x: MX + 140, y: 500, z: 1.72 }, { ease: 'cut' }], [T0(18), { x: MX + 150, y: 494, z: 1.8 }, { d: 7 }],
    [T0(19) - 0.15, { x: KX, y: 512, z: 2.2 }, { ease: 'cut' }], [T0(19), { x: KX, y: 508, z: 2.26 }, { d: 5 }], [T0(20) - 0.15, { x: 1445, y: 545, z: 1.3 }, { ease: 'cut' }], [tWhip, { x: 790, y: 540, z: 1.17 }, { d: 0.34, ease: 'io' }],
    [T0(21) + 0.1, { x: 830, y: 540, z: 1.19 }, { d: 1.2 }], [T0(22) - 0.15, { x: 800, y: 520, z: 1.22 }, { d: 1.0 }], [tP - 0.5, { x: CH[0] + 130, y: CH[1] + 40, z: 1.3 }, { d: 0.9 }], [tA - 0.3, { x: CH[0] + 60, y: CH[1] + 30, z: 1.2 }, { d: 0.8 }],
    [T0(27) - 0.15, { x: CH[0] + 40, y: CH[1] + 20, z: 1.12, r: -1.2 }, { d: 1.0 }], [T0(27) + 0.8, { x: CH[0] + 40, y: CH[1] + 20, z: 1.16, r: 1.4 }, { d: 5 }], [T0(28) - 0.15, { x: CX - 20, y: GY - 300, z: 1.88, r: 0 }, { ease: 'cut' }], [T0(28), { x: CX - 20, y: GY - 304, z: 1.95, r: 0 }, { d: 2.5 }],
    [T0(29) - 0.15, { x: CH[0] + 160, y: CH[1] + 30, z: 1.16, r: 0 }, { ease: 'cut' }], [tName - 0.2, { x: CH[0] + 60, y: CH[1] + 10, z: 1.3 }, { d: 0.8 }], [T0(30) - 0.15, { x: MX + 130, y: 480, z: 1.86 }, { ease: 'cut' }], [T0(30), { x: MX + 140, y: 474, z: 1.95 }, { d: 4 }],
    [T0(31) - 0.15, { x: ZG + 30, y: 470, z: 1.22 }, { ease: 'cut' }], [T0(31), { x: ZG + 50, y: 464, z: 1.28 }, { d: 7 }], [T0(32) - 0.15, { x: 985, y: 540, z: 1.0 }, { d: 1.2, ease: 'io' }], [tPush, { x: ZG + 30, y: 600, z: 1.9 }, { d: 1.3, ease: 'io' }]], t);
  cam = gfxShake(gfxDrift(cam, t, 3, 3), t, [[tKH + 0.55, 6, 0.25], [tSt1, 12, 0.28], [tW + 0.27, 16, 0.4], [tSt2, 8, 0.25], [tX1, 6, 0.2], [tX2, 8, 0.25], [rP + SN, 7, 0.2], [rA + SN, 7, 0.2], [rW + SN, 14, 0.35], [tPop, 6, 0.2]]);
  const whip = t > tWhip + 0.03 && t < tWhip + 0.3;
  /* --- 층 쌓기 --- */
  const set = mlSagalaSet(t), chariotBack = `<g transform="translate(${f1(cx)} ${GY})">${mlStand()}${farW}${axle}</g>`, chariotFront = `<g transform="translate(${f1(cx)} ${GY})">${bodyG(mlBody())}${pole}${nearW}</g>`;
  const riders = (onG || hk > 0 ? '' : zero + reins) + (kOn || kHk > 0 ? '' : king);
  const actors = set.dais + chariotBack + riders + chariotFront + (kOn || kHk > 0 ? king : '') + monk + (onG || hk > 0 ? zero : '') + tak + st.svg;
  const sun = gfxProj(cam, 2250, 60), close = cam.z > 1.6;
  // 말하는 사람이 화면 밖이면 구석에 얼굴 창
  let hud = gfChipAt(t, T0(14) + 0.5, 300, 96, '사갈라 · 2,100여 년 전', { size: 34, icon: 'scroll' });
  const sp = c && c.v && t < c.t1 + 0.2 ? c.v : null, spX = sp === 'K' ? gfxProj(cam, kx, GY - 390)[0] : sp === 'M' ? gfxProj(cam, MX, GY - 390)[0] : 960;
  if ((sp === 'K' || sp === 'M') && (spX < -40 || spX > 1960)) hud += mlPortrait(t, sp === 'K' ? mlK : mlM, sp === 'K' ? 'mlkf' : 'mlmf', c.t0, sp === 'K' ? ['밀린다 왕', '#7A3B8C'] : ['나가세나', '#D9822B'], sp === 'K' ? -1 : -1);
  hud += mlCartHud(t, tMe + 0.25);
  const s = mlCompose({ cam, defs: gfDefs() + ML_DEFS + gfxDefs({ shadow: '#4A2E1C', lights: [{ id: 'mlLs', amb: '#C6B3C2', key: { x: sun[0], y: sun[1], z: 900 * cam.z, col: '#FFE3A6', k: 0.78 }, rim: { dx: 7, dy: -4, col: '#FFE28A', k: 0.8 }, bump: 5, relief: 8 }] }),
    far: [[0.12, set.sky + set.mount], [0.5, set.town, close ? { blur: 4 } : {}], [0.82, set.colon + set.tree, close ? { blur: 4 } : {}], [1, set.ground]],
    cast: [chariotBack + riders + chariotFront + (kOn ? king : '') + monk + (onG ? zero : ''), { floor: GY, skew: -38, len: 0.36, op: 0.2, soft: 2 }], lit: actors, light: 'mlLs',
    glow: gfxShafts(t, { x: 1500, y: -140, ang: 36, n: 5, gap: 150, w: 80, len: 1500, op: 0.2, col: '#FFEDB8', spread: 1.6, seed: 2 }) + gfxDust(t, { box: [300, 120, 1900, 700], n: 46, seed: 9, op: 0.6, col: '#FFF1C8' }) + dust + info + em + st.fx,
    fg: set.fg, fgDepth: 1.3, fgBlur: 7, grade: gfxGrade('gold', 0.42), vig: gfxVignette(0.34, '#3A1E0C'), hud, whip });
  return s;
}
/* 화면 밖에서 말하는 사람의 얼굴 창(화면 좌표, 오른쪽 위). fn: 인물 함수, key: gfxFace 열쇠 */
function mlPortrait(t, fn, key, t0, who, look = 0) { const k = gfIn(t, t0 - 0.1, 3.4, 0.5), R = 118, cx = 1726, cy = 190;
  return `<g transform="translate(${cx} ${cy}) scale(${f1(k * 1000) / 1000})"><circle r="${R + 10}" cy="8" fill="#1E2A4A" opacity=".25"/><circle r="${R}" fill="#FFF1D0" stroke="${INK}" stroke-width="9"/><svg x="${-R}" y="${-R}" width="${2 * R}" height="${2 * R}" viewBox="-170 -565 340 340"><g clip-path="url(#mlPc)">${fn({ x: 0, y: 0, s: 1, t, pose: P['서기'], ex: fEx(key), look: [look * 0.6, 0.05], turn: look * 0.3 })}</g></svg><circle r="${R}" fill="none" stroke="${INK}" stroke-width="9"/>` +
    `<g transform="translate(0 ${R + 6})">${gfChip(who[0], { size: 30, bg: who[1], col: '#fff' })}</g></g>`; }
/* 한 편을 꿰는 표시: 화면 오른쪽 위의 작은 수레 = '나'. 부품 칸 다섯. t0에 톡 생긴다. */
function mlCartHud(t, t0) { if (t < t0) return ''; const k = gfIn(t, t0, 3, 0.42) * 1.12, cols = ['hand', 'heart', 'book', 'clock', 'bulb'];
  return `<g transform="translate(1706 162) scale(${f1(k * 1000) / 1000})">${gfPanel(300, 190, { head: '나', headSize: 36, headBg: '#FF9A55', headCol: '#fff' })}<g transform="translate(-10 34) scale(.3)"><g transform="translate(0 0)">${mlWheel(44, -126, 108, t * 40, true)}${mlBody()}${mlPole()}${mlWheel(-10, -118, 118, t * 40, false)}</g></g>` +
    cols.map((c, i) => `<g transform="translate(${-104 + i * 52} 60) scale(${f1(gfIn(t, t0 + 0.15 + i * 0.08, 3.4, 0.4) * 1000) / 1000})"><circle r="22" fill="#fff" stroke="${INK}" stroke-width="5"/>${gfIcon(c, 0.5, t)}</g>`).join('') + `</g>`; }
