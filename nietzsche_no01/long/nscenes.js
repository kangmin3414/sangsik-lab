/* 니체 거절 편 scenes. 1920x1080 world. Signature: nXxxScene(t, lt, a, run). lt = seconds into this line (starts 0.15 s before the voice). */
Object.assign(CAMS, { ndrop: [1.0, 1.06, 900, 540], nsplit: 'fixed', nnight: [1.0, 1.1, 960, 520], nbed: [1.0, 1.12, 1000, 640], nnz: [1.0, 1.06, 960, 540] });
const NLEGS = { legL: P['서기'].legL, legR: P['서기'].legR, fL: P['서기'].fL, fR: P['서기'].fR, dy: 0 };
P['주먹'] = Object.assign({ armL: [[148, 285], [112, 334], [150, 312]], hL: [158, 306], armR: [[252, 285], [288, 334], [250, 312]], hR: [242, 306] }, NLEGS);
P['들기'] = Object.assign({ armL: [[148, 285], [146, 340], [166, 362]], hL: [170, 364], armR: [[252, 285], [254, 340], [234, 362]], hR: [230, 364] }, NLEGS);
P['비비기'] = Object.assign({ armL: [[148, 285], [150, 344], [190, 330]], hL: [194, 326], armR: [[252, 285], [250, 344], [210, 330]], hR: [206, 326] }, NLEGS);
P['가리킴'] = Object.assign({ armL: [[148, 285], [124, 342], [112, 392]], hL: [110, 400], armR: [[252, 285], [312, 268], [366, 248]], hR: [374, 244] }, NLEGS);
const TJ = o => char(Object.assign({ goggles: 'none', patch: false, tee: true, vest: '#5D6B82', vshade: 'rgba(0,0,0,0.2)', hair: '#2F2F33', collar: true, tie: '#8A2D2D', seed: 5 }, o)); // 팀장
const darkC = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s}) translate(-200 -560)"><path d="M148 210 Q165 224 182 210 M218 210 Q235 224 252 210" stroke="#6F6390" stroke-width="7" fill="none" stroke-linecap="round" opacity=".75"/></g>`;
const ptOf = (x, y, s, lx, ly) => [x + (lx - 200) * s, y + (ly - 560) * s];
const nStack = (x, yb, n, o = {}) => { // a pile of papers / folders sitting on y = yb
  let g = `<g transform="translate(${f1(x)} ${f1(yb)}) rotate(${f1(o.rot || 0)})"><ellipse cx="6" cy="6" rx="${(o.w || 190) / 2 + 10}" ry="10" fill="#000" opacity=".25"/>`;
  const cols = ['#FFFFFF', '#F3F0E6', '#FFFFFF', '#E7EEF8', '#F7E9C8'];
  for (let i = 0; i < n; i++) {
    const w = (o.w || 190) - (hash(i * 7.1) * 14), dx = (hash(i * 3.3) - 0.5) * 16, y = -14 * (i + 1);
    g += `<rect x="${f1(-w / 2 + dx)}" y="${y}" width="${f1(w)}" height="14" rx="3" fill="${i % 5 === 3 ? '#D9C18A' : cols[i % 5]}" stroke="${INK}" stroke-width="4"/>`;
  }
  return g + `</g>`;
};
const digiClock = (x, y, txt, night) => `<g transform="translate(${x} ${y})"><rect x="-130" y="-58" width="260" height="116" rx="18" fill="${night ? '#0A0C14' : '#2B2F3A'}" stroke="${INK}" stroke-width="8"/><text x="0" y="26" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="74" fill="${night ? '#FF5A5A' : '#7CFFB2'}">${txt}</text></g>`;
function nOffice(t, night) {
  let h = BG(night ? '#161C36' : '#C7D2DB');
  // window
  h += `<rect x="1290" y="140" width="480" height="380" rx="12" fill="${night ? '#0A0F2A' : 'url(#sunset)'}" stroke="${INK}" stroke-width="9"/>`;
  for (let i = 0; i < 6; i++) { const bx = 1300 + i * 80, bh = 120 + hash(i * 5.7) * 160; h += `<rect x="${bx}" y="${520 - bh}" width="70" height="${bh}" fill="${night ? '#1D2550' : '#6E6A8E'}" opacity=".95"/>`; if (night) for (let j = 0; j < 4; j++) if (hash(i * 11 + j) > 0.45) h += `<rect x="${bx + 14 + (j % 2) * 26}" y="${530 - bh + 24 + Math.floor(j / 2) * 40}" width="14" height="18" fill="#FFE28A" opacity=".8"/>`; }
  h += `<line x1="1530" y1="140" x2="1530" y2="520" stroke="${INK}" stroke-width="7"/>`;
  // back partitions with monitors (other desks)
  for (let i = 0; i < 3; i++) { const px = -100 + i * 420; h += `<rect x="${px}" y="560" width="380" height="200" rx="8" fill="${night ? '#20284A' : '#9AA8B6'}" stroke="${INK}" stroke-width="6"/><rect x="${px + 120}" y="500" width="140" height="70" rx="6" fill="${night ? '#151A30' : '#3C4558'}" stroke="${INK}" stroke-width="5"/>`; }
  h += `<rect x="-600" y="860" width="3120" height="600" fill="${night ? '#20263F' : '#8E9AA8'}" stroke="${INK}" stroke-width="6"/>`;
  return h;
}
function nMonitor(x, y, night, t) { // screen centre x, desk top y
  return `<rect x="${x - 18}" y="${y - 70}" width="36" height="60" fill="#3A4254" stroke="${INK}" stroke-width="6"/><ellipse cx="${x}" cy="${y - 8}" rx="80" ry="12" fill="#3A4254" stroke="${INK}" stroke-width="6"/>` +
    `<rect x="${x - 150}" y="${y - 260}" width="300" height="196" rx="12" fill="#1A2233" stroke="${INK}" stroke-width="8"/><rect x="${x - 134}" y="${y - 244}" width="268" height="164" rx="6" fill="${night ? '#BFE6FF' : '#DCEBFA'}"/>` +
    [0, 1, 2, 3].map(i => `<rect x="${x - 118}" y="${y - 230 + i * 34}" width="${[200, 150, 220, 120][i]}" height="12" rx="6" fill="#7E97B8" opacity=".7"/>`).join('');
}
function nZeroDesk(t, lt, x, ex, o = {}) { // Zero seated behind a desk at x; returns svg (desk drawn in front)
  let h = rz(t, lt, x, 830, 0.95, o.pose || '책상', ex, Object.assign({ look: o.look || [0.2, 0.2] }, o.zo || {}));
  h += darkC(x, 830, 0.95);
  h += o.behind || '';
  h += rDesk(x, 700, o.w || 900);
  return h;
}

/* o1: 퇴근 10분 전, 팀장이 서류 뭉치를 툭 얹는다 */
function ndropScene(t, lt, a) {
  const u = t; // first scene of the video: use absolute time
  let h = nOffice(t, false);
  h += digiClock(560, 210, '17:50', false);
  h += rtg(t, lt, -1.3, 560, 330, '퇴근 10분 전', YEL, { size: 44, rot: -4 });
  const dropT0 = 1.95, dropT1 = 2.35, land = u >= dropT1;
  const zx = 760;
  const ex = [[-9, '지침'], [dropT1 - 1.55, '놀람'], [dropT1 - 1.55 + 0.9, '걱정']];
  h += nZeroDesk(t, lt, zx, ex, { w: 820, look: land ? [0.9, 0.3] : [0.6, 0.1], behind: nMonitor(500, 640, false, t) });
  // typing forearms + keyboard
  h += `<rect x="${zx - 130}" y="636" width="260" height="30" rx="6" fill="#E9EDF2" stroke="${INK}" stroke-width="6"/>`;
  const ty = land ? 0 : Math.sin(t * 22) * 3;
  h += rArm(zx + 48, 590, zx + 66, 640 + ty) + rArm(zx - 48, 590, zx - 62, 640 - ty);
  // the team leader walks in from the right carrying the pile, tosses it on the desk
  const tx = lerp(2150, 1270, easeOut(prog(u, 0.15, 1.7))), walking = u < 1.7, s = 0.95, ty0 = 860;
  let pose;
  if (walking) pose = Object.assign({}, walkPose(u * 9, 0.8), { armL: P['들기'].armL, hL: P['들기'].hL, armR: P['들기'].armR, hR: P['들기'].hR });
  else pose = poseAt([[0, '들기'], [dropT0 + 0.1, '서기'], [dropT1 + 0.5, '손인사']], u, 0.25);
  const tex = exprAt([[0, '기본'], [1.6, '신남']], u);
  h += shadow(tx, ty0 + 4, 70 * s) + flip(tx, TJ({ t, x: tx, y: ty0, s, pose, ex: tex, look: [0.6, 0] }));
  // pile: in hands -> arc -> desk
  const hold = ptOf(tx, ty0, s, 200, 364), deskP = [1010, 668];
  const k = prog(u, dropT0, dropT1), ke = easeIn(k);
  let px = lerp(hold[0], deskP[0], k), py = lerp(hold[1] + 6, deskP[1], ke) - Math.sin(k * Math.PI) * 70;
  let rot = land ? Math.sin((u - dropT1) * 18) * 3 * Math.exp(-(u - dropT1) * 4) : -6 * k;
  if (land) { px = deskP[0]; py = deskP[1]; }
  h += nStack(px, py, 11, { rot });
  if (land) h += rfx(t, lt, dropT1 - 1.55, 1110, 430, '툭', WHITE, { size: 110, burst: 150, rot: -8 });
  if (u > 1.7) h += rtg(t, lt, 1.7 - 1.55, 1270, 280, '팀장님', '#fff', { size: 40, rot: 3 });
  return h;
}

/* o2 + n1: 겉은 웃는데 속은 불바다 */
function nsplitScene(t, lt, a, run) {
  const D = a._dur || 3;
  let L = BG('#E9EEF2') + `<rect x="-600" y="880" width="1560" height="600" fill="#B9C4CE" stroke="${INK}" stroke-width="6"/>`;
  const nod = Math.max(0, Math.sin(run * 6.2));
  L += shadow(480, 934, 80) + Z({ t, seed: 11, x: 480, y: 930 + nod * 10, s: 1.05, rot: nod * 6, pose: P['비비기'], ex: exprAt([[0, '신남']], lt), look: [0.4, 0.3], sweat: true });
  L += rSweat(600, 390, t);
  if (a.say) L += pop(t, t - lt + 0.2, t + 99, 480, 230, `<rect x="-300" y="-62" width="600" height="124" rx="40" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-30 60 L0 112 L30 60" fill="#fff" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-28" y="54" width="56" height="12" fill="#fff"/>` + rtext(0, 18, '네! 해둘게요!', 54, NAVY), { rot: -2, bob: 3 });
  else if (lt > 0.72 * D) L += pop(t, t - lt + 0.72 * D, t + 99, 480, 230, `<rect x="-300" y="-62" width="600" height="124" rx="40" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-30 60 L0 112 L30 60" fill="#fff" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-28" y="54" width="56" height="12" fill="#fff"/>` + rtext(0, 18, '네, 괜찮아요', 58, NAVY), { rot: -2, bob: 3 });
  let R = BG('#3A0C12');
  for (let i = 0; i < 9; i++) { const fx0 = 1000 + i * 115, fh = 260 + Math.sin(t * 7 + i * 1.7) * 60 + hash(i) * 120; R += `<path d="M${fx0 - 70} 1100 Q${fx0 - 60} ${1100 - fh * 0.5} ${fx0 + Math.sin(t * 5 + i) * 20} ${1100 - fh} Q${fx0 + 60} ${1100 - fh * 0.5} ${fx0 + 70} 1100 Z" fill="${i % 2 ? '#FF6A2A' : '#FF3B2F'}" opacity=".85"/><path d="M${fx0 - 36} 1100 Q${fx0 - 30} ${1100 - fh * 0.3} ${fx0} ${1100 - fh * 0.55} Q${fx0 + 30} ${1100 - fh * 0.3} ${fx0 + 36} 1100 Z" fill="#FFC23A" opacity=".9"/>`; }
  R += `<circle cx="1440" cy="520" r="420" fill="url(#redglow)"/>`;
  R += shadow(1440, 934, 80) + Z({ t, seed: 12, x: 1440, y: 930, s: 1.05, pose: '주먹', ex: exprAt([[0, '화남']], lt), look: [-0.2, 0], shiver: true });
  for (let i = 0; i < 3; i++) { const k = ((t * 0.9 + i / 3) % 1); R += `<circle cx="${1440 + (i - 1) * 90 + Math.sin(t * 3 + i) * 10}" cy="${f1(330 - k * 180)}" r="${f1(26 + k * 30)}" fill="#fff" opacity="${f1((1 - k) * 0.7 * 100) / 100}"/>`; }
  if (!a.say) { // the word "싫어요" climbs up the throat ... and gets swallowed
    const up = easeInOut(prog(lt, 0.12 * D, 0.62 * D)), gone = prog(lt, 0.66 * D, 0.74 * D);
    if (gone < 1) R += `<g transform="translate(${f1(1440 + Math.sin(t * 40) * 4 * up)} ${f1(lerp(740, 610, up))}) scale(${f1((1 - gone) * (0.6 + 0.5 * up) * 100) / 100})">${label(0, 0, '싫어요!', { size: 84, bg: '#fff' })}</g>`;
  }
  let h = `<g clip-path="url(#leftHalf)">${L}</g><g clip-path="url(#rightHalf)">${R}</g>`;
  h += `<path d="M960 -40 L930 120 L990 260 L930 420 L990 580 L930 740 L990 900 L960 1120" fill="none" stroke="${INK}" stroke-width="22" stroke-linejoin="round"/><path d="M960 -40 L930 120 L990 260 L930 420 L990 580 L930 740 L990 900 L960 1120" fill="none" stroke="#fff" stroke-width="10" stroke-linejoin="round"/>`;
  h += pop(t, t - run + 0.1, t + 99, 220, 120, label(0, 0, '겉', { size: 56, bg: '#fff' }), { rot: -4 });
  h += pop(t, t - run + 0.3, t + 99, 1700, 120, label(0, 0, '속마음', { size: 56, bg: RED }), { rot: 4 });
  return h;
}

/* n2 + n3: 불 꺼진 사무실, 혼자 야근 */
function nnightScene(t, lt, a, run) {
  const D = a._dur || 3;
  let h = nOffice(t, true);
  h += digiClock(300, 200, '22:47', true);
  const sad = a.sad;
  const ex = sad ? [[0, '걱정']] : [[0, '지침']];
  h += nZeroDesk(t, lt, 960, ex, { w: 960, pose: sad ? '턱괴기' : '책상', look: sad ? [-0.3, 0.5] : [-0.6, 0.2], behind: nMonitor(640, 640, true, t) });
  h += nStack(1250, 668, 22, { w: 200 });
  h += `<rect x="830" y="636" width="260" height="30" rx="6" fill="#B9C2D8" stroke="${INK}" stroke-width="6"/>`;
  if (!sad) { const j = Math.sin(t * 22) * 3; h += rArm(1008, 590, 1026, 640 + j) + rArm(912, 590, 898, 640 - j); }
  else {
    h += rArm(912, 590, 880, 646);
    for (const ex0 of [926, 994]) { const k = (t * 0.8 + (ex0 > 960 ? 0.5 : 0)) % 1; h += `<path d="M${ex0} ${f1(492 + k * 80)} q-10 18 0 28 q10 -10 0 -28 Z" fill="#8EDCFF" stroke="${INK}" stroke-width="4" opacity="${f1((1 - k) * 100) / 100}"/>`; }
    // thought cloud: "착하면 복이 온다?" -> 쓰레기통
    const ph2 = lt > 0.58 * D;
    let inner = '';
    if (!ph2) inner = rtext(0, -10, '착하게 살면', 46, NAVY) + rtext(0, 50, '복이 온다?', 52, '#C98A00');
    else {
      inner = `<path d="M-80 -30 L80 -30 L66 110 L-66 110 Z" fill="#9AA3AE" stroke="${INK}" stroke-width="7"/><rect x="-92" y="-48" width="184" height="26" rx="8" fill="#7D8794" stroke="${INK}" stroke-width="7"/><rect x="-74" y="30" width="148" height="26" fill="${TEE}" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i < 4; i++) { const k = ((t * 0.9 + i * 0.25) % 1); inner += `<g transform="translate(${-110 + i * 70 + k * 40} ${f1(-150 + k * 120)}) rotate(${f1(k * 120 + i * 30)})" opacity="${f1(Math.min(1, (1 - k) * 2) * 100) / 100}"><rect x="-24" y="-30" width="48" height="60" fill="#fff" stroke="${INK}" stroke-width="4"/></g>`; }
    }
    h += pop(t, t - lt + (ph2 ? 0.58 * D : 0.25), t + 99, 1450, 300, bubble(0, 0, 520, ph2 ? 330 : 220, ph2 ? `<g transform="translate(0 0) scale(.9)">${inner}</g>` : inner, { right: true }), { bob: 3 });
  }
  h += `<ellipse cx="760" cy="520" rx="460" ry="330" fill="url(#screenGlow)" opacity=".55"/>`;
  return h;
}

/* n4: 새벽 2시 47분, 잠 못 드는 밤 */
function nbedScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('url(#nightRoom)');
  h += `<rect x="1240" y="150" width="380" height="330" rx="12" fill="#0A1030" stroke="${INK}" stroke-width="9"/><circle cx="1500" cy="250" r="54" fill="#F4F1D0"/><circle cx="1520" cy="236" r="52" fill="#0A1030"/><line x1="1430" y1="150" x2="1430" y2="480" stroke="${INK}" stroke-width="7"/>`;
  h += `<polygon points="1240,480 1620,480 1500,900 900,900" fill="#9EB6FF" opacity=".08"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#1A2040" stroke="${INK}" stroke-width="6"/>`;
  // bed
  h += `<rect x="600" y="560" width="70" height="320" rx="14" fill="#5A4A6E" stroke="${INK}" stroke-width="8"/><rect x="640" y="760" width="900" height="80" rx="16" fill="#E9E4F4" stroke="${INK}" stroke-width="8"/><rect x="650" y="836" width="880" height="44" fill="#4A3D5E" stroke="${INK}" stroke-width="7"/>`;
  h += `<rect x="720" y="700" width="250" height="80" rx="36" fill="#FFFFFF" stroke="${INK}" stroke-width="7"/>`;
  const toss = Math.sin(t * 0.8) * 2.5;
  h += Z({ t, seed: 13, x: 1300, y: 712, s: 0.82, rot: -90 + toss, pose: '서기', ex: exprAt([[0, '걱정']], lt), look: [1, 0.2] });
  h += `<path d="M1020 676 Q1060 600 1180 610 L1540 640 Q1560 700 1540 780 L1010 790 Z" fill="#7F8FD8" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/><path d="M1080 650 Q1200 640 1300 660 M1100 720 Q1260 700 1460 720" stroke="#6474C0" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  // nightstand + clock
  h += `<rect x="380" y="700" width="200" height="180" rx="10" fill="#4A3D5E" stroke="${INK}" stroke-width="8"/>`;
  h += `<g transform="translate(480 650) scale(.62)">${digiClock(0, 0, '02:47', true).replace(/^<g transform="translate\(0 0\)">/, '<g>')}</g>`;
  h += `<circle cx="480" cy="650" r="120" fill="url(#redglow)" opacity=".5"/>`;
  h += rtg(t, lt, 0.2, 480, 470, '새벽 2:47', '#fff', { size: 42, rot: -4 });
  for (let i = 0; i < 3; i++) { const k = (t * 0.5 + i / 3) % 1; h += `<text x="${920 + i * 70}" y="${f1(560 - k * 160)}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${54 + i * 8}" fill="#fff" stroke="${INK}" stroke-width="6" paint-order="stroke" opacity="${f1((1 - k) * 0.9 * 100) / 100}">?</text>`; }
  // the blade glint near the end ("날카로운 칼날")
  const g = prog(lt, 0.8 * D, 0.8 * D + 0.45);
  if (g > 0 && g < 1) { const gx = lerp(-400, 2400, easeInOut(g)); h += `<polygon points="${gx - 60},-100 ${gx + 20},-100 ${gx - 280},1200 ${gx - 360},1200" fill="#fff" opacity="${f1(Math.sin(g * Math.PI) * 0.85 * 100) / 100}"/>`; }
  return h;
}

/* n5: 140년 전 니체의 진단 */
function nnzScene(t, lt, a) {
  const D = a._dur || 3;
  let h = BG('#0E0E16') + `<rect x="-600" y="880" width="3120" height="600" fill="#17171F" stroke="${INK}" stroke-width="6"/>`;
  h += `<polygon points="560,-60 820,-60 1000,900 380,900" fill="#FFF3C4" opacity=".12"/><ellipse cx="690" cy="900" rx="320" ry="40" fill="#FFF3C4" opacity=".16"/>`;
  const op = prog(lt, 0, 0.9), point = lt > 0.68 * D;
  const s = 1.05, x = 690, y = 900;
  const pose = poseAt([[0, '서기'], [0.68 * D, '가리킴']], lt, 0.3);
  let nz = shadow(x, y + 4, 80) + NZ({ t, seed: 21, x, y, s, pose, ex: exprAt([[0, '결심']], lt), look: point ? [0.9, 0] : [0.3, 0.1] });
  const hl = ptOf(x, y, s, 110, 400);
  nz += `<path d="M${f1(hl[0])} ${f1(hl[1] - 8)} q-30 -28 -4 -50 q22 -14 34 12" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><line x1="${f1(hl[0])} " y1="${f1(hl[1] - 8)}" x2="${f1(hl[0] - 14)}" y2="${y}" stroke="#2A1E16" stroke-width="13" stroke-linecap="round"/>`;
  h += `<g opacity="${f1(op * 100) / 100}">${nz}</g>`;
  h += rtg(t, lt, 0.3, 380, 170, '140년 전', YEL, { size: 50, rot: -4 });
  h += rp(t, lt, 0.7, 690, 270, outlined(0, 0, ['프리드리히 니체'], { size: 70, sw: 14 }), {});
  // the "kind" people, halos on, pleased with themselves
  const shock = lt > 0.74 * D;
  const cols = ['#8FC8A8', '#E9B4C8', '#A9C1E6', '#F2D18B', '#C7B2E6'];
  for (let i = 0; i < 5; i++) {
    const cx = 1180 + i * 140, cy = 880 - (i % 2) * 14, k = prog(lt, 0.22 * D + i * 0.08, 0.22 * D + i * 0.08 + 0.4);
    if (k <= 0) continue;
    const pc = ptOf(cx, cy, 0.42, 200, 50);
    h += `<g opacity="${f1(k * 100) / 100}">` + shadow(cx, cy + 4, 30) + char({ goggles: 'none', patch: false, tee: true, vest: cols[i], vshade: 'rgba(0,0,0,0.15)', t, seed: 30 + i, x: cx, y: cy, s: 0.42, pose: shock ? '서기' : '손인사', ex: exprAt([[0, '뿌듯'], [shock ? 0.0001 : 99, '놀람']], lt), look: [-0.6, 0] }) +
      `<ellipse cx="${f1(pc[0])}" cy="${f1(pc[1] - 6 + Math.sin(t * 3 + i) * 4)}" rx="40" ry="11" fill="none" stroke="${GOLD}" stroke-width="9"/></g>`;
  }
  h += rtg(t, lt, 0.3 * D, 1460, 600, '착한 사람들', '#fff', { size: 40, rot: 3 });
  if (shock) h += rfx(t, lt, 0.74 * D, 1460, 380, '잔인한 진단', RED, { size: 92, burst: 210, rot: -6 });
  return h;
}
