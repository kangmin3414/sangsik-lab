/* 수능 편 — 인트로~1막 샘플 (SCRIPT_v3). fatigue01의 fscenes.js·fscenes2.js를 도구로 불러 쓰고, 새 이름은 모두 su 접두사.
   물리 규칙: 예언이는 헤드보드 윗면·서윤 머리 위에 두 발로 선다 · 벤치엔 엉덩이가 좌판 위 · 구슬·말풍선은 얼굴을 가리지 않는다 · 원인 다음 결과. */
Object.assign(QBG, { sroom: 'ai/sroom.png', cvsapt: 'ai/cvsapt.png', genkan: 'ai/genkan.png' });
['suroom', 'suwin', 'sudoor', 'sutitle', 'subench', 'suball'].forEach(k => CAMS[k] = 'fixed');
const SU_PUR = '#7B5CD6', SU_PUR_D = '#4E3A9A', SU_GOLD = '#FFD23F', SU_PAD = '#2F3A5C', SU_PAD_L = '#46557E';
const suDefs = () => `<defs>
<radialGradient id="suGlass" cx=".38" cy=".34" r=".75"><stop offset="0" stop-color="#F3ECFF"/><stop offset=".45" stop-color="#B9A2F2"/><stop offset="1" stop-color="#5A3FB0"/></radialGradient>
<radialGradient id="suGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#C9B3FF" stop-opacity=".75"/><stop offset="1" stop-color="#C9B3FF" stop-opacity="0"/></radialGradient>
<radialGradient id="suLamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF1C9" stop-opacity=".55"/><stop offset="1" stop-color="#FFF1C9" stop-opacity="0"/></radialGradient>
<linearGradient id="suSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070B22"/><stop offset="1" stop-color="#1B2550"/></linearGradient>
<linearGradient id="suNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140F2E"/><stop offset="1" stop-color="#271B52"/></linearGradient>
</defs>`;
// 배경 판 + 판에 '붙은' 소품(판과 같은 시차로 움직인다)
const suPlate = (k, cam, depth = 0.6, extra = '') => {
  const [cx, cy, z] = cam, zb = 1 + (z - 1) * depth; let bx = 960 + (cx - 960) * depth, by = 560 + (cy - 560) * depth;
  const hx = 960 / 0.88 / zb; bx = clamp(bx, -150 + hx + 4, 2070 - hx - 4); by = clamp(by, -30 + 573.6 / zb + 4, 1220 - 653.6 / zb - 4);
  return `<g transform="translate(960 560) scale(${f1(zb * 1000) / 1000}) translate(${f1(-bx)} ${f1(-by)})"><image href="${QBG[k]}" x="-150" y="-30" width="2220" height="1250" preserveAspectRatio="xMidYMid slice"/>${extra}</g>`;
};
const suT = (x, y, s, size, fill, o = {}) => fT(x, y, s, size, fill, o);
const suK = (t0, t1, x) => clamp((x - t0) / (t1 - t0), 0, 1);

/* ---------- 수정구슬과 구슬 속 장면 (구슬 반지름 100 기준 좌표) ---------- */
function suBall(x, y, R, t, inner = '', o = {}) {
  const id = 'suB' + (o.id || 'a');
  let h = `<g transform="translate(${f1(x)} ${f1(y)})">`;
  if (o.glow) h += `<circle r="${f1(R * 1.8)}" fill="url(#suGlow)" opacity="${f1(clamp(o.glow, 0, 1) * 100) / 100}"/>`;
  h += `<clipPath id="${id}"><circle r="${f1(R - 2)}"/></clipPath><circle r="${f1(R)}" fill="url(#suGlass)"/>`;
  h += `<g clip-path="url(#${id})"><g transform="scale(${f1(R / 100 * 1000) / 1000})">${inner}</g></g>`;
  if (o.bolt) h += `<g opacity="${f1(o.bolt * 100) / 100}"><circle r="${f1(R)}" fill="#FFF7C2" opacity=".45"/><path d="M${f1(R * 0.1)} ${f1(-R * 0.8)} L${f1(-R * 0.25)} ${f1(-R * 0.05)} L${f1(R * 0.08)} ${f1(-R * 0.05)} L${f1(-R * 0.18)} ${f1(R * 0.75)} L${f1(R * 0.35)} ${f1(-R * 0.2)} L${f1(R * 0.02)} ${f1(-R * 0.2)} Z" fill="${SU_GOLD}" stroke="${INK}" stroke-width="${f1(Math.max(3, R * 0.04))}" stroke-linejoin="round"/></g>`;
  h += `<circle r="${f1(R)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(4, R * 0.055))}"/>`;
  h += `<path d="M${f1(-R * 0.66)} ${f1(-R * 0.28)} A${f1(R * 0.72)} ${f1(R * 0.72)} 0 0 1 ${f1(-R * 0.2)} ${f1(-R * 0.7)}" fill="none" stroke="#fff" stroke-width="${f1(Math.max(3, R * 0.08))}" stroke-linecap="round" opacity=".75"/>`;
  return h + `</g>`;
}
const suDim = (c = '#2A2140', op = 1) => `<rect x="-120" y="-120" width="240" height="240" fill="${c}" opacity="${op}"/>`;
const suV = {
  exam: (t, k = 1) => suDim('#CFC3F2') + `<g transform="scale(${f1(k * 1000) / 1000})"><rect x="-46" y="-62" width="92" height="124" rx="4" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="-46" y="-62" width="92" height="22" fill="#E9E4F7" stroke="${INK}" stroke-width="4"/>${fT(0, -46, '국어 영역', 13, INK)}` +
    [0, 1, 2, 3, 4, 5].map(i => `<line x1="-36" y1="${-26 + i * 14}" x2="${i % 2 ? 22 : 36}" y2="${-26 + i * 14}" stroke="#9A93B4" stroke-width="4" stroke-linecap="round"/>`).join('') + `</g>`,
  x: (t, k) => suV.exam(t) + `<g stroke="#E5484D" stroke-width="14" stroke-linecap="round"><line x1="-40" y1="-50" x2="${f1(-40 + 80 * clamp(k * 2, 0, 1))}" y2="${f1(-50 + 100 * clamp(k * 2, 0, 1))}"/>${k > 0.5 ? `<line x1="40" y1="-50" x2="${f1(40 - 80 * clamp(k * 2 - 1, 0, 1))}" y2="${f1(-50 + 100 * clamp(k * 2 - 1, 0, 1))}"/>` : ''}</g>`,
  stairs: (t, k) => suDim('#C9C0EA') + [0, 1, 2, 3].map(i => { const fall = clamp(k * 1.6 - (3 - i) * 0.2, 0, 1), dy = fall * fall * 170, r = fall * (i % 2 ? 34 : -28);
    return `<g transform="translate(${-66 + i * 40} ${f1(62 - i * 34 + dy)}) rotate(${f1(r)})"><rect x="-21" y="-17" width="42" height="34" fill="#8E84BE" stroke="${INK}" stroke-width="5"/></g>`; }).join('') +
    `<g transform="translate(${f1(56 - k * 10)} ${f1(-62 + k * k * 150)}) scale(1.6)"><circle r="10" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M-10 -1 Q-11 -14 0 -14 Q11 -14 10 -1 L10 3 L-10 3 Z" fill="${GH.choco}" stroke="${INK}" stroke-width="2.5"/></g>`,
  rain: (t) => { let h = suDim('#A7B0CC') + `<ellipse cx="-36" cy="-74" rx="66" ry="30" fill="#6B728F" stroke="${INK}" stroke-width="4"/><ellipse cx="38" cy="-68" rx="60" ry="28" fill="#5E6584" stroke="${INK}" stroke-width="4"/>`;
    for (let i = 0; i < 16; i++) { const x = -90 + (i * 37) % 180, y = ((t * 220 + i * 53) % 170) - 50; h += `<line x1="${x}" y1="${f1(y)}" x2="${x - 6}" y2="${f1(y + 20)}" stroke="#3E6FB8" stroke-width="5" stroke-linecap="round"/>`; }
    const w = Math.sin(t * 6) * 5; // 우산 없이 걸어가는 뒷모습(단발)
    return h + `<rect x="-120" y="64" width="240" height="60" fill="#5B6178"/><g transform="translate(4 70) scale(1.5)"><line x1="-6" y1="0" x2="${f1(-8 + w)}" y2="24" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><line x1="6" y1="0" x2="${f1(8 - w)}" y2="24" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M-14 -40 L14 -40 L16 2 L-16 2 Z" fill="${SU_PAD}" stroke="${INK}" stroke-width="3"/><circle cy="-54" r="15" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M-17 -50 Q-18 -72 0 -72 Q18 -72 17 -50 L17 -44 L-17 -44 Z" fill="${GH.choco}" stroke="${INK}" stroke-width="3"/></g>`; },
  cal: (t, k) => { const m = Math.min(12, 1 + Math.floor(k * 12)); let h = suDim('#A7B0CC');
    for (let i = 0; i < 14; i++) { const x = -90 + (i * 41) % 180, y = ((t * 200 + i * 47) % 190) - 90; h += `<line x1="${x}" y1="${f1(y)}" x2="${x - 4}" y2="${f1(y + 14)}" stroke="#A9C8F0" stroke-width="3" stroke-linecap="round"/>`; }
    return h + `<g transform="translate(0 6) scale(1.3)"><rect x="-48" y="-50" width="96" height="104" rx="8" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="-48" y="-50" width="96" height="28" rx="8" fill="#E5484D" stroke="${INK}" stroke-width="4"/>${fT(0, -29, m + '월', 20, '#fff')}` +
      `<ellipse cx="-8" cy="12" rx="22" ry="12" fill="#8A93B0"/><ellipse cx="10" cy="8" rx="18" ry="11" fill="#8A93B0"/>` + [-14, 0, 14].map(x => `<line x1="${x}" y1="28" x2="${x - 3}" y2="40" stroke="#5E8FD6" stroke-width="3" stroke-linecap="round"/>`).join('') + `</g>`; },
};
// 장면 목록을 차례로 (각 d초, 짧게 교차)
function suSeq(t, lt, list, d = 0.6) {
  const i = Math.min(list.length - 1, Math.floor(Math.max(0, lt) / d)), k = clamp((lt - i * d) / d, 0, 1), f = list[i];
  return f(t, k);
}

/* ---------- 예언이: 보라 망토, 별 모자, 제 몸보다 큰 수정구슬. 원점 = 두 발 가운데 ---------- */
function suYe(t, o) {
  const s = o.s || 1, rz = easeInOut(clamp(o.raise || 0, 0, 1)), R = o.R || 36, tk = clamp(o.talk || 0, 0, 1), eyes = o.eyes || 'norm';
  const bob = o.still ? 0 : Math.sin(t * 4.2 + (o.seed || 0)) * 2;
  let h = `<g transform="translate(${f1(o.x)} ${f1(o.y)}) rotate(${f1(o.rot || 0)}) scale(${f1(s * (o.sx || 1) * 1000) / 1000} ${f1(s * (o.sy || 1) * 1000) / 1000})">`;
  h += `<ellipse cx="-13" cy="-5" rx="11" ry="6" fill="#fff" stroke="${INK}" stroke-width="4"/><ellipse cx="13" cy="-5" rx="11" ry="6" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
  const by = bob * 0.5;
  // 구슬 위치: 내림(망토 앞) → 치켜듦(머리 왼쪽 위)
  const bx = lerp(0, -70, rz), byy = lerp(-40, -158, rz) + by;
  const shL = [-17, -72 + by], shR = [17, -72 + by];
  const handL = [bx + R * 0.72, byy + R * 0.55], handR = rz > 0.5 ? [30, lerp(-60, -96, rz) + by] : [bx - R * 0.72 + 0, byy + R * 0.55];
  const arm = (a, b, bend) => `<path d="M${f1(a[0])} ${f1(a[1])} Q${f1((a[0] + b[0]) / 2 + bend)} ${f1((a[1] + b[1]) / 2 + 6)} ${f1(b[0])} ${f1(b[1])}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  // 망토
  h += `<path d="M-21 ${f1(-80 + by)} Q0 ${f1(-88 + by)} 21 ${f1(-80 + by)} L40 -8 Q0 2 -40 -8 Z" fill="${SU_PUR}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  h += zStar(-14, -34 + by, 6, SU_GOLD, 0) + zStar(16, -22 + by, 5, SU_GOLD, 0) + zStar(4, -54 + by, 4, '#fff', 0);
  if (rz > 0.5) h += arm(shR, handR, 8);
  // 머리(세계관의 둥근 흰 머리)
  const hy = -104 + by;
  h += `<circle cx="0" cy="${f1(hy)}" r="30" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
  const lk = o.look || [0, 0], ex = lk[0] * 4, ey = lk[1] * 3;
  if (eyes === 'shut') h += `<path d="M-17 ${f1(hy - 2)} q6 6 12 0 M5 ${f1(hy - 2)} q6 6 12 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  else if (eyes === 'squint') h += `<path d="M-18 ${f1(hy - 1)} l12 -2 M6 ${f1(hy - 3)} l12 2" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-20 ${f1(hy - 13)} l14 5 M6 ${f1(hy - 8)} l14 -5" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  else { const r = eyes === 'wide' ? 9 : 6.5; h += [-1, 1].map(sd => `<circle cx="${f1(sd * 11)}" cy="${f1(hy - 3)}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="3.5"/><circle cx="${f1(sd * 11 + ex)}" cy="${f1(hy - 2 + ey)}" r="${eyes === 'wide' ? 3.5 : 4}" fill="${INK}"/>`).join('') +
    `<path d="M-19 ${f1(hy - 15)} l12 ${eyes === 'wide' ? -4 : 3} M7 ${f1(hy - 12 + (eyes === 'wide' ? -4 : 0))} l12 ${eyes === 'wide' ? 4 : -3}" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`; }
  h += `<ellipse cx="-19" cy="${f1(hy + 9)}" rx="6" ry="3.5" fill="#FF8FA8" opacity=".5"/><ellipse cx="19" cy="${f1(hy + 9)}" rx="6" ry="3.5" fill="#FF8FA8" opacity=".5"/>`;
  if (tk > 0.06 || o.mouth === 'o') { const mh = o.mouth === 'o' ? 7 : 2 + 8 * tk; h += `<ellipse cx="0" cy="${f1(hy + 13 + mh * 0.4)}" rx="${f1(6 + 3 * tk)}" ry="${f1(mh)}" fill="#5A1E2A" stroke="${INK}" stroke-width="3"/>`; }
  else if (o.mouth === 'smug') h += `<path d="M-8 ${f1(hy + 13)} q10 6 14 -3" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  else h += `<path d="M-6 ${f1(hy + 13)} q6 4 12 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  // 별 모자
  const hb = hy - 24;
  h += `<path d="M-34 ${f1(hb)} Q0 ${f1(hb - 12)} 34 ${f1(hb)} L12 ${f1(hb - 66)} Q6 ${f1(hb - 78)} -2 ${f1(hb - 70)} Z" fill="${SU_PUR_D}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  h += `<ellipse cx="0" cy="${f1(hb)}" rx="42" ry="10" fill="${SU_PUR}" stroke="${INK}" stroke-width="5"/><path d="M-26 ${f1(hb - 8)} Q0 ${f1(hb - 18)} 26 ${f1(hb - 8)}" fill="none" stroke="${SU_GOLD}" stroke-width="6"/>`;
  h += `<g transform="translate(6 ${f1(hb - 76)}) rotate(${f1(Math.sin(t * 3) * 10)})">${zStar(0, 0, 13, SU_GOLD, 3)}</g>`;
  // 구슬 + 손
  h += suBall(bx, byy, R, t, o.inner || '', { glow: o.glow == null ? 0.6 : o.glow, bolt: o.bolt || 0, id: o.id || 'ye' });
  h += arm(shL, handL, -6) + (rz <= 0.5 ? arm(shR, handR, 6) : '');
  h += `<circle cx="${f1(handL[0])}" cy="${f1(handL[1])}" r="7" fill="#fff" stroke="${INK}" stroke-width="3.5"/><circle cx="${f1(handR[0])}" cy="${f1(handR[1])}" r="7" fill="#fff" stroke="${INK}" stroke-width="3.5"/>`;
  return HALO(h + `</g>`);
}
// 뿅 등장: 0→1 탄력
const suPop = (lt, t0) => { const k = clamp((lt - t0) / 0.35, 0, 1); return k <= 0 ? 0 : easeOutBack(k); };

/* ---------- 서윤: 단발 + 남색 패딩(누빔 줄). 제로: 까치집 ---------- */
const SU_TUFT = `<g fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"><path d="M178 64 q-14 -30 4 -44"/><path d="M200 60 q2 -34 22 -40"/><path d="M220 66 q16 -22 36 -20"/></g>`;
const ZS = o => Z(Object.assign({ hairFront: SU_TUFT }, o));
function SY(o) { // 서윤
  const s = o.s || 1, x = o.x, y = o.y;
  let h = zGirl(Object.assign({ hairStyle: 'bob', top: SU_PAD, seed: 33 }, o));
  const q = (ly) => `M${f1(x + (140 - 200) * s)} ${f1(y + (ly - 560) * s)} Q${f1(x)} ${f1(y + (ly + 8 - 560) * s)} ${f1(x + (260 - 200) * s)} ${f1(y + (ly - 560) * s)}`;
  if (!o.noQuilt) h += `<path d="${q(310)} ${q(350)} ${q(390)}" fill="none" stroke="${SU_PAD_L}" stroke-width="${f1(5 * s)}" stroke-linecap="round"/>`;
  return h;
}
// 삼선 슬리퍼: 발 위치에 겹친다
function suSlip(x, y, s, pose) { const p = typeof pose === 'string' ? P[pose] : pose, dy = p.dy || 0;
  return [[p.fL, -1], [p.fR, 1]].map(([f, sd]) => { const fx0 = x + (f[0] - 200) * s, fy0 = y + (f[1] + dy + 10 - 560) * s;
    return `<g transform="translate(${f1(fx0)} ${f1(fy0)}) rotate(${f1((f[2] || 0) * 0.5)}) scale(${f1(s * 1000) / 1000})"><rect x="-34" y="-6" width="68" height="12" rx="6" fill="#2B2F3A" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M-20 -6 Q0 -26 20 -6" fill="#3C4152" stroke="${INK}" stroke-width="4"/><path d="M-12 -12 l-2 6 M0 -15 l0 8 M12 -12 l2 6" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></g>`; }).join(''); }
// 입김
function suBreath(x, y, t, ph = 0, dir = 1) { const k = ((t * 0.55 + ph) % 1); if (k > 0.55) return ''; const e = k / 0.55;
  return `<g opacity="${f1((1 - e) * 0.7 * 100) / 100}"><circle cx="${f1(x + dir * (10 + e * 40))}" cy="${f1(y - e * 26)}" r="${f1(8 + e * 18)}" fill="#fff"/><circle cx="${f1(x + dir * (24 + e * 56))}" cy="${f1(y - 8 - e * 34)}" r="${f1(6 + e * 12)}" fill="#fff"/></g>`; }

/* ---------- 1. 서윤의 방, 밤 11시 ---------- */
const SR_HB = 610, SR_X = 1330; // 헤드보드 윗면 y, 침대 가운데 x
function suroomScene(t, lt, a) {
  const ph = a.ph;
  const cam = ph === 0 ? qLerpCam(lt / 3.4, [980, 560, 1.0], [1250, 690, 1.32]) : qLerpCam((lt - 0.2) / 1.0, [1250, 690, 1.32], [1290, 590, 2.0]);
  // 판 위 소품: 벽시계 11:00(초침 째깍), 책상 위 수험표·컴퓨터용 사인펜
  const sec = Math.floor(t) * 6;
  let ex = `<g transform="translate(486 220)"><circle r="74" fill="#F4F1EA" stroke="${INK}" stroke-width="7"/>` + [...Array(12)].map((_, i) => `<line x1="0" y1="-62" x2="0" y2="${i % 3 ? -54 : -48}" stroke="${INK}" stroke-width="${i % 3 ? 3 : 5}" transform="rotate(${i * 30})"/>`).join('') +
    `<line x1="0" y1="0" x2="0" y2="-34" stroke="${INK}" stroke-width="8" stroke-linecap="round" transform="rotate(-30)"/><line x1="0" y1="0" x2="0" y2="-52" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><line x1="0" y1="8" x2="0" y2="-56" stroke="#E5484D" stroke-width="3" transform="rotate(${sec})"/><circle r="6" fill="${INK}"/></g>`;
  ex += `<g transform="translate(330 788) rotate(-4)"><rect x="-62" y="-40" width="124" height="80" rx="6" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-52" y="-30" width="34" height="42" rx="3" fill="#C9D3E0" stroke="${INK}" stroke-width="3"/>${fT(18, -14, '수험표', 18, INK)}<line x1="-10" y1="6" x2="48" y2="6" stroke="#9A93B4" stroke-width="4"/><line x1="-10" y1="20" x2="40" y2="20" stroke="#9A93B4" stroke-width="4"/></g>`;
  ex += `<g transform="translate(430 800) rotate(-12)"><rect x="-56" y="-7" width="112" height="14" rx="7" fill="#2B2F3A" stroke="${INK}" stroke-width="4"/><rect x="34" y="-7" width="22" height="14" rx="5" fill="#E9E4F7" stroke="${INK}" stroke-width="3"/></g>`;
  // 침대(발치에서 본 모습): 헤드보드 → 베개 → 서윤 → 이불
  let w = `<rect x="1050" y="${SR_HB}" width="560" height="260" rx="26" fill="#8E6A48" stroke="${INK}" stroke-width="8"/><rect x="1072" y="${SR_HB + 20}" width="516" height="22" rx="10" fill="#A9825C"/>`;
  w += `<ellipse cx="${SR_X}" cy="772" rx="170" ry="46" fill="#F4F1EA" stroke="${INK}" stroke-width="7"/>`;
  const tY = ph === 1 ? fAt(a, '끝', 1.6) : 99; // "끝이야" → 이불을 코끝까지
  const pull = ph === 1 ? easeInOut(suK(tY, tY + 0.5, lt)) : 0;
  const sEx = ph === 0 ? exprAt([[0, 'z멍'], [2.2, 'z기본']], lt) : exprAt([[0, 'z기본'], [0.35, 'z당황'], [tY, 'z소름']], lt);
  w += SY({ x: SR_X, y: 1046, s: 0.8, t, pose: '서기', ex: sEx, look: ph === 0 ? [0, -0.85] : [0, -1], tilt: 0, still: true, noQuilt: true });
  const bt = lerp(808, 776, pull);
  w += `<path d="M1010 ${f1(bt)} Q${SR_X} ${f1(bt - 34)} 1650 ${f1(bt)} L1720 1150 L940 1150 Z" fill="#9FB4E8" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M1060 ${f1(bt + 46)} Q${SR_X} ${f1(bt + 14)} 1600 ${f1(bt + 46)}" fill="none" stroke="#fff" stroke-width="8" opacity=".35"/>`;
  w += `<g transform="translate(${SR_X - 60} ${f1(bt + 6)})">${hand(0, 0, 0.8)}</g><g transform="translate(${SR_X + 60} ${f1(bt + 6)})">${hand(0, 0, 0.8)}</g>`; // 이불 끝을 쥔 두 손
  // 협탁 + 알람 세 개
  w += `<rect x="1660" y="800" width="220" height="200" rx="10" fill="#6E5A8A" stroke="${INK}" stroke-width="8"/><line x1="1660" y1="880" x2="1880" y2="880" stroke="${INK}" stroke-width="5"/>`;
  w += `<g transform="translate(1770 772) rotate(-90)"><rect x="-26" y="-54" width="52" height="108" rx="10" fill="#1F2D44" stroke="${INK}" stroke-width="5"/></g><g transform="translate(1770 760)">${['6:00', '6:05', '6:10'].map((s0, i) => `<g transform="translate(${-40 + i * 40} -40)"><rect x="-18" y="-12" width="36" height="22" rx="6" fill="#BFE6FF" stroke="${INK}" stroke-width="3"/>${fT(0, 4, s0, 11, INK)}</g>`).join('')}</g>`;
  // 예언이: 헤드보드 윗면에 '뿅'
  if (ph === 1) { const pk = suPop(lt, 0.15), rs = suK(0.6, 1.0, lt);
    const inner = suSeq(t, lt - 0.9, [suV.exam, suV.x, suV.stairs, suV.rain], 0.55);
    if (pk > 0) w += suYe(t, { x: SR_X + 6, y: SR_HB + 2, s: 1.2 * pk, raise: rs, R: 58, inner, talk: env(t), eyes: lt < 1.4 ? 'squint' : 'wide', glow: 0.5 + 0.4 * rs, id: 'r1' });
    if (lt > 0.15 && lt < 0.6) w += puff(SR_X + 6, SR_HB - 60, t, t - lt + 0.15, 0.8, '#E9DEFF'); }
  let over = '';
  if (ph === 1 && lt > 0.15 && lt < 0.9) over += fx(t, t - lt + 0.15, t - lt + 0.9, 1380, 260, '뿅!', '#E9DEFF', { size: 60, rot: -6 });
  return suDefs() + suPlate('sroom', cam, 0.6, ex) + qCam(cam, w) + fFull('#0A1238', 0.32) + (ph === 1 ? `<circle cx="1160" cy="300" r="380" fill="url(#suGlow)" opacity=".25"/>` : '') + over;
}

/* ---------- 2. 많은 방에서 같은 예언 (아파트 단지 밤 풍경) ---------- */
function suwinScene(t, lt, a) {
  const cam = qLerpCam((lt - 0.4) / 4.4, [1024, 584, 5.2], [960, 560, 1.0]);
  const tM = fAt(a, '망하면', 99), flash = lt > tM ? Math.exp(-(lt - tM) * 1.5) : 0;
  let w = `<rect x="-300" y="-200" width="2600" height="1500" fill="url(#suSky)"/>`;
  for (let i = 0; i < 40; i++) w += `<circle cx="${(i * 197) % 2200 - 120}" cy="${(i * 83) % 380 - 60}" r="${1.5 + (i % 3)}" fill="#fff" opacity="${f1((0.3 + 0.5 * Math.abs(Math.sin(t * 1.1 + i))) * 100) / 100}"/>`;
  w += `<circle cx="1640" cy="120" r="52" fill="#FFF2C0"/><circle cx="1660" cy="108" r="48" fill="url(#suSky)"/>`;
  const B = [[-80, 380, 420, 9], [380, 250, 400, 9], [820, 330, 420, 9], [1280, 220, 420, 9], [1720, 360, 380, 8]];
  B.forEach(([bx, top, bw, cols], bi) => { const rows = Math.floor((1060 - top - 40) / 64);
    w += `<rect x="${bx}" y="${top}" width="${bw}" height="${1140 - top}" fill="${bi % 2 ? '#1E2A4E' : '#24305A'}" stroke="${INK}" stroke-width="7"/><rect x="${bx}" y="${top}" width="${bw}" height="16" fill="#2E3B68"/>`;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const wx = bx + 22 + c * ((bw - 44) / cols), wy = top + 40 + r * 64, seed = (bi * 131 + r * 17 + c * 7) % 11, lit = seed < 5 || (bi === 2 && r === 3 && c === 4);
      w += `<rect x="${f1(wx)}" y="${wy}" width="${f1((bw - 44) / cols - 12)}" height="40" rx="3" fill="${lit ? '#FFD98A' : '#141B36'}" opacity="${lit ? 0.9 : 1}"/>`;
      if (lit && seed < 3 || (bi === 2 && r === 3 && c === 4)) { const gx = wx + ((bw - 44) / cols - 12) / 2, tw = 0.5 + 0.5 * Math.sin(t * 3 + seed * 2.3 + c), g = clamp(tw * 0.7 + flash, 0, 1);
        w += `<circle cx="${f1(gx)}" cy="${wy + 26}" r="${f1(5 + 4 * g)}" fill="#B9A2F2" stroke="${INK}" stroke-width="2"/><circle cx="${f1(gx)}" cy="${wy + 26}" r="${f1(14 + 10 * g)}" fill="url(#suGlow)" opacity="${f1(g * 100) / 100}"/>`; } } });
  // 서윤의 창: 단발 실루엣 + 구슬 (카메라가 여기서 시작해 물러난다)
  w += `<g transform="translate(1016 568)"><path d="M-9 22 Q-10 4 0 2 Q10 4 9 22 Z" fill="#3A2E28"/><circle cx="0" cy="6" r="7" fill="#3A2E28"/><path d="M-8 8 Q-9 -3 0 -3 Q9 -3 8 8" fill="#3A2E28"/></g>`;
  w += `<rect x="-300" y="1040" width="2600" height="400" fill="#0B1024"/>`;
  return suDefs() + qCam(cam, w);
}

/* ---------- 3. 현관을 살며시 나선다 ---------- */
function sudoorScene(t, lt, a) {
  const cam = [900, 600, 1.12], k = easeInOut(suK(0.0, 2.1, lt)), x = lerp(1420, 330, k), ph = lt * 4.2;
  const pose = lt < 2.1 ? walkPose(ph, 0.55) : '서기';
  let w = qShadow(x, 1000, 60) + SY({ x, y: 1000 + (pose.dy || 0) * 0, s: 0.92, t, pose, ex: fEx('z결심'), look: [-0.9, 0.1], seed: 33 });
  w = flip(x, w); // 왼쪽(문)으로 걷는다
  const open = suK(2.0, 2.3, lt) * (1 - suK(2.65, 2.95, lt));
  let over = '';
  if (lt > 0.4 && lt < 1.9) over += fx(t, t - lt + 0.4, t - lt + 1.9, 1240, 300, '살금살금', '#E9DEFF', { size: 46, rot: -4 });
  if (lt > 2.6) over += fx(t, t - lt + 2.6, t + 9, 420, 330, '딸깍', '#FFE34D', { size: 50, rot: 6 });
  const fadeOut = suK(2.05, 2.35, lt);
  return suDefs() + suPlate('genkan', cam, 0.6, `<rect x="40" y="250" width="300" height="760" fill="#FFE9B0" opacity="${f1(open * 0.55 * 100) / 100}"/>`) +
    qCam(cam, `<g opacity="${f1((1 - fadeOut) * 100) / 100}">${w}</g>`) + fFull('#0A1238', 0.5) + over;
}
function sutitleScene(t, lt, a) { return window.ftitleScene(t, lt, a); }

/* ---------- 4. 편의점 앞 벤치 ---------- */
const SB = { x: 950, S: 852, F: 1012, hw: 300 }; // 벤치 가운데, 좌판 윗면, 바닥
const SB_SIT = s => SB.S - 12 + 148 * s; // 엉덩이가 좌판 위에 닿는 원점 y
function suBenchBack() { const { x, S, hw } = SB; return `<rect x="${x - hw}" y="${S - 168}" width="${hw * 2}" height="34" rx="10" fill="#B5845A" stroke="${INK}" stroke-width="7"/><rect x="${x - hw}" y="${S - 116}" width="${hw * 2}" height="34" rx="10" fill="#B5845A" stroke="${INK}" stroke-width="7"/>` +
  [-1, 1].map(sd => `<rect x="${x + sd * (hw - 40) - 9}" y="${S - 176}" width="18" height="190" rx="6" fill="#5B4636" stroke="${INK}" stroke-width="6"/>`).join(''); }
function suBenchSeat() { const { x, S, F, hw } = SB; return `<rect x="${x - hw - 14}" y="${S - 20}" width="${hw * 2 + 28}" height="36" rx="12" fill="#C99566" stroke="${INK}" stroke-width="8"/>` +
  [-1, 1].map(sd => `<path d="M${x + sd * (hw - 30)} ${S + 14} L${x + sd * (hw - 22)} ${F}" stroke="#5B4636" stroke-width="16" stroke-linecap="round"/><path d="M${x + sd * (hw - 30)} ${S + 14} L${x + sd * (hw - 22)} ${F}" stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity=".5"/>`).join(''); }
const SB_SX = 1130, SB_ZX = 790, SB_ZST = 560; // 서윤 자리, 제로 앉을 자리, 제로 서 있는 자리
function subenchScene(t, lt, a) {
  if (a.ph >= 10) return suBench2(t, lt, a);
  const ph = a.ph, s = 0.95, wy = SB_SIT(s), zs = 1.0;
  E['_suz'] = qTalk('z기본', env(t)); E['_suz2'] = qTalk('z빵긋', env(t)); E['_suz3'] = qTalk('z민망', env(t) * 0.8);
  E['_suw'] = qTalk('z기본', env(t) * 0.7); E['_suw2'] = qTalk('z울먹', env(t) * 0.6);
  const yeTop = wy + (40 - 560) * s; // 서윤 머리 위(단발 윗면)
  // --- 카메라 ---
  const CAMS_B = { 0: qLerpCam(lt / 2.6, [930, 640, 1.0], [880, 660, 1.1]), 1: [830, 640, 1.22], 2: [1090, 650, 1.5], 3: [640, 620, 1.45], 4: [1130, 560, 1.8], 5: [1110, 640, 1.62],
    6: qLerpCam(lt / 0.6, [1110, 600, 1.7], [1080, yeTop - 120, 2.2]), 7: [880, 640, 1.2], 8: qLerpCam(lt / 5, [950, 690, 1.12], [960, 670, 1.3]), 9: qLerpCam((lt - 0.8) / 1.6, [960, 670, 1.3], [1120, yeTop - 90, 2.25]) };
  const cam = CAMS_B[ph];
  // --- 제로: 걸어 들어옴 → 서서 말함 → 말풍선 쏙 → 걸어가 앉음 ---
  let zx = SB_ZST, zy = SB.F, zPose = '서기', zEx = fEx('z기본'), zLook = [0.8, 0], zFlip = false, zSit = 0;
  if (ph === 0) { const k = easeOut(suK(0, 2.0, lt)); zx = lerp(-120, SB_ZST, k); zPose = lt < 2.0 ? walkPose(lt * 7.5, 0.8) : '서기'; zEx = exprAt([[0, 'z기본'], [1.7, 'z당황'], [2.2, 'z기본']], lt); zLook = lt < 1.6 ? [1, 0] : [0.9, 0.1]; }
  if (ph === 1) zEx = fEx('_suz');
  if (ph === 3) { const tQ = fAt(a, '요즘', 2.0); zEx = lt < tQ - 0.2 ? fEx('_suz2') : fEx('_suz3');
    zPose = lt < tQ - 0.2 ? Object.assign({}, P['서기'], { armR: [[252, 285], [306, 236], [330, 176]], hR: [334, 168] }) : Object.assign({}, P['서기'], { armR: [[252, 285], [310, 250], [292, 150]], hR: [288, 140] }); }
  if (ph === 4) { zEx = fEx('z당황'); zPose = Object.assign({}, P['서기'], { armR: [[252, 285], [292, 300], [232, 252]], hR: [226, 246] }); zLook = [0.6, 0.2]; }
  if (ph === 5 || ph === 6) { zEx = fEx(ph === 6 ? 'z당황' : 'z기본'); zLook = ph === 6 ? [0.7, -0.4] : [0.8, 0.1]; }
  if (ph === 7) { const wk = suK(1.35, 2.05, lt), sit = suK(2.05, 2.55, lt);
    zEx = exprAt([[0, 'z빵긋'], [1.0, 'z민망'], [2.3, 'z기본']], lt);
    if (wk > 0 && sit === 0) { zx = lerp(SB_ZST, SB_ZX, easeInOut(wk)); zPose = walkPose(lt * 7, 0.6); }
    if (sit > 0) { zx = SB_ZX; zSit = sit; } }
  if (ph >= 8) { zx = SB_ZX; zSit = 1; zEx = fEx(ph === 9 ? 'z기본' : 'z기본'); zLook = ph === 8 ? [0.6, 0.35] : [0.7, 0.1]; }
  // --- 서윤: 앉아 있다(왼쪽을 향해 앉음) ---
  let wEx = fEx('z멍'), wLook = [-0.2, 0.45], wTilt = 0, wJit = 0;
  if (ph === 0) { wEx = exprAt([[0, 'z멍'], [1.9, 'z당황'], [2.3, 'z기본']], lt); wLook = lt < 1.9 ? [-0.1, 0.5] : [-0.9, 0]; }
  if (ph === 1) { wEx = fEx('z기본'); wLook = [-0.9, -0.1]; }
  if (ph === 2) { wEx = fEx('_suw'); wLook = lt < 0.6 ? [-0.8, 0] : [-0.3, 0.5]; }
  if (ph === 3) { const tN = fAt(a, '3번', 1.28); wEx = exprAt([[0, 'z기본'], [tN + 0.1, 'z멍']], lt); wLook = [-0.9, 0]; }
  if (ph === 4) { wEx = fEx('z소름'); wLook = [-0.6, 0.2]; wJit = Math.sin(t * 50) * 1.5; }
  if (ph === 5) { wEx = fEx('_suw2'); wLook = [-0.1, 0.6]; wJit = Math.sin(t * 38) * 0.8; wTilt = -4; }
  if (ph === 6) { wEx = fEx('z울먹'); wLook = [0, 0.6]; wTilt = -4; }
  if (ph === 7) { wEx = exprAt([[0, 'z울먹'], [1.0, 'z멍']], lt); wLook = lt < 2.1 ? [-0.6, 0.2] : [-0.7, 0.3]; }
  if (ph >= 8) { wEx = fEx('z멍'); wLook = [-0.1, 0.5]; }
  // --- 그리기: 판 → 벤치 등받이 → 앉은 사람 → 좌판 → 선 사람 ---
  let w = suBenchBack();
  w += qShadow(SB_SX, SB.F, 70, 0.6);
  w += SY({ x: SB_SX + wJit, y: wy, s, t, pose: P['f앉기L'], ex: wEx, look: wLook, tilt: wTilt });
  const zSY = zSit > 0 ? lerp(zy, SB_SIT(zs), easeInOut(zSit)) - Math.sin(zSit * Math.PI) * 50 : zy;
  if (zSit > 0) { const zpp = zSit >= 1 ? P['f앉기'] : '서기'; w += ZS({ x: zx, y: zSY, s: zs, t, pose: zpp, ex: zEx, look: zLook, seed: 3 }) + suPants(zx, zSY, zs, zpp) + suSlip(zx, zSY, zs, zpp); }
  w += suBenchSeat();
  if (zSit === 0) { const zp = typeof zPose === 'string' ? P[zPose] : zPose; w += qShadow(zx, SB.F, 62) + ZS({ x: zx, y: zy, s: zs, t, pose: zPose, ex: zEx, look: zLook, seed: 3 }) + suPants(zx, zy, zs, zp) + suSlip(zx, zy, zs, zp); }
  // 입김
  const [wmx, wmy] = ptOf(SB_SX, wy, s, 190, 236), [zmx, zmy] = ptOf(zx, zSit >= 1 ? SB_SIT(zs) : zy, zs, 214, 236);
  w += suBreath(wmx - 14, wmy, t, 0.1, -1) + (ph !== 4 ? suBreath(zmx + 10, zmy, t, 0.6, 1) : '');
  // 예언이(서윤 머리 위): 1막 내내 머리 위에 있다. ph4 번개, ph6 치켜들고 예언, ph9 구슬 클로즈업 전
  { const rz = ph === 6 ? suK(0.05, 0.4, lt) : 0;
    const inner = ph === 6 ? suSeq(t, lt - 0.35, [suV.cal, suV.cal, suV.rain, suV.rain], 0.7) : ph === 4 ? suV.x(t, 1) : suV.exam(t, 0.8);
    const yEyes = ph === 6 ? 'wide' : ph === 4 ? 'wide' : ph >= 8 ? 'norm' : 'squint';
    w += suYe(t, { x: SB_SX + 4, y: yeTop + 4, s: ph === 6 ? 0.9 : 0.82, raise: rz, R: ph === 6 ? 62 : 34, inner, talk: ph === 6 ? env(t) : 0, eyes: yEyes, bolt: ph === 4 ? Math.max(0, 1 - lt / 0.6) : 0, glow: ph === 9 ? 0.5 + 0.4 * suK(0.8, 2.0, lt) : 0.45, mouth: ph === 9 ? 'smug' : null, id: 'b' + ph }); }
  // --- 효과: "3번!" · "?" · 번쩍 · 말풍선 쏙 ---
  let over = '';
  if (ph === 3) { const tN = fAt(a, '3번', 1.28), tQ = fAt(a, '요즘', 2.0);
    if (lt > tN) over += fx(t, t - lt + tN, t - lt + tQ, 760, 250, '3번!', '#FFE34D', { size: 72, rot: -8 });
    if (lt > tQ) over += fx(t, t - lt + tQ, t + 9, 860, 230, '?', '#fff', { size: 80, rot: 8 }); }
  if (ph === 4 && lt < 0.9) over += fx(t, t - lt + 0.02, t - lt + 0.9, 1250, 230, '번쩍!', '#FFE34D', { size: 66, rot: -6 });
  if (ph === 7) { const g = suK(0.1, 0.35, lt), back = suK(0.95, 1.15, lt), k = g * (1 - back);
    if (k > 0.01) { const [mx, my] = ptOf(SB_ZST, SB.F, zs, 214, 236), bx = lerp(mx, mx + 210, k), by = lerp(my, my - 190, k);
      w += `<g transform="translate(${f1(bx)} ${f1(by)}) scale(${f1(k * 1000) / 1000})"><path d="M-40 52 L${f1(mx - bx)} ${f1(my - by)} L4 52 Z" fill="#fff" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-200" y="-56" width="400" height="112" rx="44" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-196" y="40" width="392" height="14" fill="#fff"/>${fT(0, 16, '괜찮아, 별거 아…', 40, INK)}</g>`; }
    if (lt > 1.0 && lt < 1.6) over += fx(t, t - lt + 1.0, t - lt + 1.6, 700, 300, '쏙', '#fff', { size: 56, rot: -6 }); }
  const light = `<circle cx="1500" cy="760" r="900" fill="url(#suLamp)" opacity=".55"/>`;
  return suDefs() + qDefs() + suPlate('cvsapt', cam, 0.6) + qCam(cam, w + light) + fFull('#0A1238', ph === 4 ? 0.34 : 0.22) + warm(ph >= 8 ? 0.18 : 0.08) + over;
}

/* ---------- 5. 구슬 클로즈업: 한 장면만 크게 / 영향력 편향 ---------- */
// 구슬 속 '하루': 작은 시험지 하나 + 다른 일들(급식·떡볶이·친구·웹툰). zoom이 커질수록 시험지만 남는다
function suDay(t, zoom) {
  const it = (x, y, g) => `<g transform="translate(${x} ${y})">${g}</g>`;
  let h = `<rect x="-120" y="-120" width="240" height="240" fill="#F7EEDC"/>`;
  h += it(-58, -50, `<rect x="-24" y="-14" width="48" height="28" rx="6" fill="#C9D3E0" stroke="${INK}" stroke-width="3"/><circle cx="-10" cy="0" r="7" fill="#FFB547"/><rect x="2" y="-6" width="14" height="12" rx="3" fill="#9BD08A"/>`); // 급식
  h += it(56, -48, `<path d="M-20 -6 Q0 18 20 -6 Z" fill="#E5484D" stroke="${INK}" stroke-width="3"/><rect x="-10" y="-12" width="5" height="10" rx="2" fill="#FF8A5B"/><rect x="2" y="-14" width="5" height="12" rx="2" fill="#FF8A5B"/>`); // 떡볶이
  h += it(-56, 50, `<circle cx="-9" cy="-4" r="9" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="11" cy="-4" r="9" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M-18 14 Q-9 6 0 14 M2 14 Q11 6 20 14" fill="none" stroke="${INK}" stroke-width="3"/>`); // 친구
  h += it(58, 52, `<rect x="-12" y="-20" width="24" height="40" rx="5" fill="#1F2D44" stroke="${INK}" stroke-width="3"/><rect x="-8" y="-15" width="16" height="12" fill="#FFD98A"/><rect x="-8" y="0" width="16" height="12" fill="#9ED8FF"/>`); // 웹툰
  return `<g transform="scale(${f1(zoom * 1000) / 1000})">${h}<g transform="scale(.42)">${suV.exam(t).replace(suDim('#CFC3F2'), '')}</g></g>`;
}
function suballScene(t, lt, a) {
  const ph = a.ph, tE = ph === 2 ? fAt(a, '영향력', 1.4) : 99, tB = ph === 2 ? fAt(a, '크고', 4.8) : 99, tL = ph === 2 ? fAt(a, '길게', 5.4) : 99;
  let w = `<rect x="-300" y="-200" width="2600" height="1500" fill="url(#suNight)"/>`;
  for (let i = 0; i < 36; i++) w += zStar((i * 211) % 2000 - 40, (i * 97) % 1080, 4 + (i % 3) * 2, '#fff', 0).replace('<path', `<path opacity="${f1((0.3 + 0.5 * Math.abs(Math.sin(t * 1.4 + i))) * 100) / 100}"`);
  let inner;
  if (ph === 1) { const z = 1 + 3.2 * easeInOut(suK(0.9, 2.2, lt)); inner = suDay(t, z); }
  else { const big = ph === 3 ? 1 : easeOutBack(suK(tB - 0.1, tB + 0.35, lt));
    inner = `<g transform="scale(${f1((1.35 + 0.35 * big + 0.04 * Math.sin(t * 6) * big) * 1000) / 1000})">${suV.x(t, 1)}</g>`; }
  const cx = 960, cy = 520, R = 330;
  // 예언이의 큰 손 두 개 + 모자 끝이 구슬 뒤에서 보인다
  w += `<g transform="translate(${cx} ${cy + R + 40})"><path d="M-120 140 Q0 60 120 140 L160 400 L-160 400 Z" fill="${SU_PUR}" stroke="${INK}" stroke-width="10"/></g>`;
  w += suBall(cx, cy, R, t, inner, { glow: 0.65, id: 'cu' + ph });
  w += [-1, 1].map(sd => `<circle cx="${cx + sd * (R - 30)}" cy="${cy + R * 0.62}" r="52" fill="#fff" stroke="${INK}" stroke-width="10"/>`).join('');
  let over = '';
  if (ph === 2 && lt > tE) over += pop(t, t - lt + tE, t + 99, 960, 120, label(0, 0, '영향력 편향', { size: 54, bg: YEL }), { rot: -3, bob: 3 });
  if (ph === 2 && lt > tB) over += pop(t, t - lt + tB, t + 99, 330, 330, label(0, 0, '더 크게', { size: 44, bg: '#fff' }), { rot: -6 });
  const calCard = (x, y, m) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(1.3)"><rect x="-34" y="-40" width="68" height="80" rx="7" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-34" y="-40" width="68" height="22" rx="7" fill="#E5484D" stroke="${INK}" stroke-width="5"/>${fT(0, -23, m + '월', 17, '#fff')}<ellipse cx="-4" cy="8" rx="20" ry="11" fill="#8A93B0"/><ellipse cx="10" cy="4" rx="15" ry="9" fill="#8A93B0"/><path d="M-10 22 l-2 8 M2 22 l-2 8 M14 22 l-2 8" stroke="#5E8FD6" stroke-width="3" stroke-linecap="round"/></g>`;
  const strip = k => { let h = ''; const n = Math.max(1, Math.round(k * 12)); for (let m = 1; m <= n; m++) h += calCard(1300 + (m - 1) * 96 * Math.min(1, k * 1.2), 760 + Math.sin(m * 0.9 + t * 2) * 6, m); return h; };
  if (ph === 2 && lt > tL) { const k = easeOut(suK(tL, tL + 1.0, lt)); over += strip(k) + pop(t, t - lt + tL, t + 99, 1640, 620, label(0, 0, '더 길게', { size: 44, bg: '#fff' }), { rot: 6 }); }
  if (ph === 3) over += pop(t, t - lt - 9, t + 99, 960, 120, label(0, 0, '영향력 편향', { size: 54, bg: YEL }), { rot: -3, bob: 3 }) + pop(t, t - lt - 9, t + 99, 330, 330, label(0, 0, '더 크게', { size: 44, bg: '#fff' }), { rot: -6 }) + strip(1) + pop(t, t - lt - 9, t + 99, 1640, 620, label(0, 0, '더 길게', { size: 44, bg: '#fff' }), { rot: 6 });
  const cam = ph === 1 ? qLerpCam(lt / 3, [960, 540, 1.0], [960, 530, 1.08]) : [960, 540, 1.05];
  return suDefs() + qCam(cam, w) + over;
}
