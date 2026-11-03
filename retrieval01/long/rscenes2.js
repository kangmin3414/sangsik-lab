/* retrieval long-form scenes, part 2 (stages 1-4 + outro). */

/* ---------- STAGE 1: 인지적 용이성 ---------- */
function rsofa(x, y) { return `<rect x="${x - 320}" y="${y}" width="640" height="190" rx="40" fill="#7A5CD6" stroke="${INK}" stroke-width="9"/><rect x="${x - 350}" y="${y - 70}" width="140" height="260" rx="50" fill="#6A4CC6" stroke="${INK}" stroke-width="9"/><rect x="${x + 210}" y="${y - 70}" width="140" height="260" rx="50" fill="#6A4CC6" stroke="${INK}" stroke-width="9"/>`; }
function rbrainScene(t, lt, a) {
  let h = rRoom() + rFloor(880, '#C9A576');
  h += rsofa(1060, 560);
  const by = 440 + Math.sin(t * 2) * 6;
  h += rBrain(1060, by, 1.55);
  h += `<path d="M960 ${by - 6} q28 24 56 0 M1090 ${by - 6} q28 24 56 0 M1030 ${by + 50} q30 22 60 0" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
  h += `<g transform="translate(1340 560)"><path d="M-60 0 L60 0 L46 100 L-46 100 Z" fill="#E94B4B" stroke="${INK}" stroke-width="8"/><circle cx="-24" cy="-10" r="22" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="10" cy="-26" r="24" fill="#FFF3C4" stroke="${INK}" stroke-width="6"/></g>`;
  h += rz(t, lt, 360, 890, 0.9, '서기', [[0, '걱정'], [2, '기본']]);
  if (a.stamp) {
    h += rp(t, lt, 0.9, 1060, 250, `<rect x="-250" y="-90" width="500" height="180" rx="26" fill="none" stroke="#E33" stroke-width="16"/>` + outlined(0, 40, ['안다!'], { size: 140, fill: '#E33', stroke: '#fff', sw: 18, shadow: false }), { rot: -7, inDur: 0.2 });
    h += rtg(t, lt, 2.4, 1060, 780, '친숙함일 뿐', YEL, { size: 50, rot: -3 });
  } else {
    h += rtg(t, lt, 0.5, 1060, 200, '교활한 착각', PINK, { size: 66, rot: -3 });
    h += rp(t, lt, 1.6, 640, 330, bubble(0, 0, 330, 120, rtext(0, 16, '이미 알아!', 44, NAVY)), {});
  }
  return h;
}
function rreadScene(t, lt, a) {
  let h = rRoom();
  const sweepN = clamp(Math.floor(lt / 1.4) + 1, 1, 3), ph = (lt % 1.4) / 1.4;
  h += rBox0(960, 440, 760, 520);
  const lines = ['기억은 신경세포 사이의', '연결이 강해지면서', '만들어진다는 사실은', '여러 번 확인됐다'];
  lines.forEach((ln, i) => {
    const sharp = clamp((sweepN - 1 + ph * (i > 0 ? 1 : 1)) / 2.4, 0, 1);
    h += `<text x="960" y="${300 + i * 90}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="58" fill="#34414F" opacity="${f1((0.35 + 0.65 * sharp) * 100) / 100}">${esc(ln)}</text>`;
  });
  h += `<rect x="640" y="${f1(255 + ((lt * 1.5) % 4) * 90)}" width="640" height="26" fill="#FFE14D" opacity=".6"/>`;
  h += rp(t, lt, 0.1, 1560, 220, outlined(0, 0, [[['×' + sweepN, YEL]]], { size: 150, sw: 30 }), { rot: 4 });
  const ease = easeInOut(prog(lt, 0, 5));
  h += `<g transform="translate(300 480)"><rect x="-80" y="-250" width="160" height="500" rx="34" fill="#fff" stroke="${INK}" stroke-width="9"/><rect x="-62" y="${f1(232 - 464 * (0.15 + 0.8 * ease))}" width="124" height="${f1(464 * (0.15 + 0.8 * ease))}" rx="22" fill="${MINT}"/>${rtext(0, 320, '술술', 60, INK)}</g>`;
  h += rz(t, lt, 1560, 890, 0.85, '서기', [[0, '기본'], [2, '뿌듯']]);
  return h;
}
function rBox0(x, y, w, hh) { return `<rect x="${x - w / 2}" y="${y - hh / 2 + 30}" width="${w}" height="${hh}" rx="22" fill="${PAPER}" stroke="${INK}" stroke-width="9"/>`; }
function rsignalScene(t, lt, a) {
  let h = rRoom();
  h += rp(t, lt, 0.2, 600, 400, rbox(0, 0, 400, 340, '#E8FFF4', { inner: outlined(0, -20, ['읽기'], { size: 90, sw: 18 }) + outlined(0, 80, ['편하다'], { size: 90, sw: 18 }) }), { rot: -3 });
  h += rBrain(1020, 440, 1.2);
  h += rArrow(820, 420, 880, 420, INK) + rArrow(1200, 420, 1290, 420, RED);
  h += rp(t, lt, 1.6, 1580, 400, rbox(0, 0, 400, 340, '#FFF3C4', { inner: outlined(0, -20, ['마스터', '했다!'], { size: 86, sw: 18, lh: 96 }) + `<path d="M-150 150 L150 150" stroke="${RED}" stroke-width="12"/>` }), { rot: 3 });
  h += rp(t, lt, 2.4, 1200, 700, burst(110, RED).replace(/<path/, '<path').replace('stroke-width="8"', 'stroke-width="8"') + outlined(0, 12, ['오해'], { size: 70, fill: '#fff', sw: 14 }), { rot: -6, wobble: 3 });
  h += rz(t, lt, 200, 890, 0.85, '서기', [[0, '기본'], [2.4, '놀람']]);
  return h;
}
function rtermScene(t, lt, a) {
  let h = BG('#0F1B33') + `<circle cx="960" cy="500" r="${f1(430 + 20 * Math.sin(t * 2))}" fill="${GOLD}" opacity=".1"/>`;
  h += rp(t, lt, 0.2, 960, 330, rbox(0, 0, 1220, 240, '#fff', { inner: outlined(0, 40, ['인지적 용이성'], { size: 130, fill: INK, stroke: '#fff', sw: 0, shadow: false }) }), { rot: -1 });
  h += rp(t, lt, 1.6, 960, 640, rbox(0, 0, 1220, 200, YEL, { inner: outlined(0, 36, ['유창성의 착각'], { size: 110, fill: INK, stroke: YEL, sw: 0, shadow: false }) }), { rot: 1 });
  h += rtext(960, 840, 'Fluency Illusion', 52, '#9fb0cf');
  h += rSparks(960, 500, t, 12, 520);
  return h;
}
function rpaperScene(t, lt, a) {
  let h = rRoom() + rFloor(900, '#C9A576');
  h += rp(t, lt, 0.1, 900, 470, rbox(0, 0, 760, 640, '#fff', { rot: -2, inner: rtext(0, -240, 'Psychological Science', 50, '#456') + rtext(0, -170, '2006', 90, INK) + rtext(0, -70, 'Roediger & Karpicke', 54, INK) + [0, 1, 2, 3, 4].map(i => `<rect x="-300" y="${i * 46}" width="${560 - (i % 2) * 90}" height="14" rx="7" fill="#C9CED6"/>`).join('') }), {});
  h += rp(t, lt, 1.2, 1560, 230, outlined(0, 0, ['워싱턴 대학교'], { size: 76, sw: 18 }), { rot: 3, bob: 4 });
  h += rp(t, lt, 2.2, 1560, 340, label(0, 0, '대학생 대상 실험', { size: 54, bg: MINT }), { rot: -2 });
  h += rz(t, lt, 1560, 900, 0.85, '서기', [[0, '기본'], [2, '신남']]);
  return h;
}
const rYV = '#FFD23F';
function rgroupsScene(t, lt, a) {
  let h = rRoom() + rFloor(870, '#C9A576');
  const rep = a.repeat;
  // A group: reads four times
  const cnt = rep ? 4 : clamp(Math.floor(lt / 1.2) + 1, 1, 4);
  h += rch(t, lt, 520, 880, 0.95, rYV, '책상', [[0, '기본'], [2.5, '지침']]);
  h += rBook(520, 700, 300, 170, [[-90, -45, 170, 1], [-90, -15, 170, clamp(cnt / 2, 0, 1)], [20, -45, 130, 1]]);
  h += rp(t, lt, 0.1, 520, 190, outlined(0, 0, [[['×' + cnt, YEL]]], { size: 130, sw: 26 }), { rot: -3 });
  h += rtg(t, lt, 0.1, 520, 330, '4번 읽기 (A)', YEL, { size: 46 });
  // B group: reads once, closes, writes
  const written = clamp((lt - (rep ? 0.5 : 4.2)) / 2, 0, 3);
  const closed = rep ? 1 : (lt > 3.4 ? 1 : 0);
  h += rch(t, lt, 1400, 880, 0.95, '#FFFFFF', '책상', [[0, '기본'], [3.4, '결심']]);
  h += closed ? rPaper(1400, 700, 300, 190, written) : rBook(1400, 700, 300, 170, [[-90, -45, 170, 1]]);
  h += rtg(t, lt, 0.1, 1400, 330, '1번 읽고 덮고 적기 (B)', '#fff', { size: 44 });
  if (rep) { h += rp(t, lt, 0.2, 960, 400, outlined(0, 0, ['×3 반복'], { size: 130, fill: MINT, sw: 28 }), { rot: -4, bob: 5 }); h += `<g transform="translate(960 600)" opacity=".9"><path d="M-110 0 a110 110 0 1 1 40 85" fill="none" stroke="${MINT}" stroke-width="18" stroke-linecap="round"/><path d="M-96 100 l30 -32 l-40 -6 Z" fill="${MINT}" stroke="${MINT}" stroke-width="6"/></g>`; }
  return h;
}
function rbarsScene(t, lt, a) {
  const BASE = 800, MAX = 560; let h = rRoom() + rFloor(880, '#C9A576');
  let yv, wv;
  if (a.ph === 1) { const k = easeOut(prog(lt, 0.3, 1.8)); yv = 83 * k; wv = 71 * k; }
  else { const k = easeInOut(prog(lt, 0.6, 2.2)); yv = lerp(83, 40, k); wv = lerp(71, 61, k); }
  h += rBar(640, BASE, yv / 100 * MAX, rYV, Math.round(yv) + '%') + rBar(1280, BASE, wv / 100 * MAX, '#fff', Math.round(wv) + '%');
  h += rtg(t, lt, 0.1, 640, 870, '4번 읽기', YEL, { size: 44 }) + rtg(t, lt, 0.1, 1280, 870, '읽고 덮고 적기', '#fff', { size: 44 });
  h += rtext(960, 150, a.ph === 1 ? '5분 뒤 시험' : '일주일 뒤 시험', 90, INK).replace('<text', `<text stroke="#fff" stroke-width="14" paint-order="stroke"`);
  if (a.ph === 1) { h += rp(t, lt, 2.1, 940, 230, outlined(0, 0, ['이김!'], { size: 90, fill: YEL, sw: 20 }), { rot: -6 }); h += rch(t, lt, 380, 960, 0.5, rYV, [[0, '서기'], [2.1, '만세']], [[0, '신남']]); }
  else { h += rfx(t, lt, 2.4, 960, 330, '뒤집혔다!', RED, { size: 110, burst: 240, rot: -4, wobble: 3 }); h += rch(t, lt, 1540, 960, 0.5, '#fff', [[0, '서기'], [2.4, '만세']], [[0, '기본'], [2.4, '뿌듯']]); h += rch(t, lt, 380, 960, 0.5, rYV, [[0, '서기'], [2.4, '납작']], [[0, '신남'], [2.4, '지침']]); }
  return h;
}
function rcalScene(t, lt, a) {
  let h = BG('#14203A');
  const d = clamp(Math.floor(lt / 0.34) + 1, 1, 7), fl = prog(lt % 0.34, 0, 0.14);
  h += `<g transform="translate(960 520)"><rect x="-260" y="-290" width="520" height="580" rx="34" fill="#fff" stroke="${INK}" stroke-width="12"/><rect x="-260" y="-290" width="520" height="140" rx="34" fill="#E94B4B" stroke="${INK}" stroke-width="12"/><g transform="scale(1 ${f1(1 - 0.25 * (1 - fl) * (lt < 2.4 ? 1 : 0))})">${outlined(0, 100, [String(d)], { size: 320, fill: INK, stroke: '#fff', sw: 8, shadow: false })}</g></g>`;
  h += outlined(960, 150, ['일주일 뒤'], { size: 120, fill: '#fff', sw: 26 });
  return h;
}

/* ---------- STAGE 2 ---------- */
function rterm2Scene(t, lt, a) {
  let h = rRoom() + rFloor(890, '#C9A576');
  h += `<g transform="translate(560 560)">${[0, 1, 2].map(i => `<rect x="-200" y="${-250 + i * 170}" width="400" height="150" rx="14" fill="#B9C3CE" stroke="${INK}" stroke-width="9"/><rect x="-60" y="${-196 + i * 170}" width="120" height="30" rx="10" fill="#6E7A89" stroke="${INK}" stroke-width="6"/>`).join('')}</g>`;
  const k = easeOutBack(prog(lt, 0.6, 1.4)), cx = lerp(0, 330, k);
  h += `<rect x="${f1(360 + cx)}" y="388" width="400" height="150" rx="14" fill="#DDE5EE" stroke="${INK}" stroke-width="9"/>`;
  const card = easeOut(prog(lt, 1.4, 2.6));
  h += `<g transform="translate(${f1(lerp(760, 1200, card))} ${f1(lerp(430, 420, card))}) rotate(${f1(-6 * card)})"><rect x="-200" y="-90" width="400" height="180" rx="14" fill="#FFF8D0" stroke="${INK}" stroke-width="8"/>${rtext(0, 12, '기억', 80, INK)}</g>`;
  h += rp(t, lt, 2.4, 1330, 650, outlined(0, 0, [[['인출', YEL]]], { size: 190, sw: 36 }), { rot: -5, bob: 5 });
  h += rtext(1330, 780, 'Retrieval', 54, '#456');
  h += rch(t, lt, 1700, 890, 0.7, '#FF9A55', [[0, '서기'], [1.4, '손인사']], [[0, '기본'], [1.6, '신남']]);
  return h;
}
function rdiskScene(t, lt, a) {
  let h = rRoom() + rFloor(890, '#C9A576');
  h += rbox(1400, 520, 520, 360, '#CBD3DE', { inner: rtext(0, -90, '머릿속', 64, INK) + `<circle cx="0" cy="30" r="90" fill="#aeb8c6" stroke="${INK}" stroke-width="8"/><circle cx="0" cy="30" r="22" fill="${INK}"/>` });
  for (let i = 0; i < 6; i++) { const k = ((lt * 0.7 + i / 6) % 1), x = lerp(250, 1150, k), y = 520 + Math.sin(i * 2) * 50 + (1 - k) * 0; h += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${i * 7 - 12})" opacity="${f1(Math.min(1, k * 4))}"><rect x="-50" y="-36" width="100" height="72" rx="8" fill="#fff" stroke="${INK}" stroke-width="6"/><line x1="-30" y1="-8" x2="30" y2="-8" stroke="#9aa" stroke-width="5"/><line x1="-30" y1="14" x2="14" y2="14" stroke="#9aa" stroke-width="5"/></g>`; }
  h += rp(t, lt, 0.2, 700, 250, outlined(0, 0, ['입력은 쉽다'], { size: 96, sw: 20 }), { rot: -3 });
  h += `<g transform="translate(1400 240)"><rect x="-190" y="-34" width="380" height="68" rx="34" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="-176" y="-22" width="${f1(36 + 12 * Math.sin(t * 3))}" height="44" rx="22" fill="#FF8A8A"/>${rtext(0, -64, '에너지', 46, INK)}</g>`;
  h += rz(t, lt, 360, 890, 0.85, '서기', [[0, '기본'], [2.4, '졸림']]);
  return h;
}
function rstruggleScene(t, lt, a) {
  let h = rRoom() + rFloor(880, '#C9A576');
  if (a.glow) h += `<circle cx="960" cy="470" r="${f1(420 + 30 * Math.sin(t * 3))}" fill="url(#glow)"/>`;
  h += rDesk(960, 700, 900);
  h += rClosedBook(960, 660, 320, 70, '#4F86C6');
  h += rz(t, lt, 960, 890, 0.95, [[0, '서기'], [1.2, '턱괴기']], a.glow ? [[0, '걱정'], [2.5, '신남']] : [[0, '걱정'], [1.2, '겁먹음']]);
  h += rDesk(960, 700, 900).slice(0, 0);
  h += rSweat(1050, 330, t) + rSweat(870, 360, t + 0.5);
  if (!a.glow) {
    h += rp(t, lt, 0.6, 1480, 300, bubble(0, 0, 560, 190, rtext(0, 22, '그 공식이 뭐였더라?', 54, NAVY)), { rot: 2 });
    h += rp(t, lt, 1.4, 560, 250, outlined(0, 0, ['끙…'], { size: 110, fill: '#fff', sw: 22 }), { rot: -6, wobble: 3 });
  } else {
    h += rp(t, lt, 0.4, 560, 250, outlined(0, 0, ['지끈…'], { size: 110, fill: '#fff', sw: 22 }), { rot: -6, wobble: 3 });
    h += rBrain(1500, 320, 1.0) + rSparks(1500, 320, t, 10, 200);
    h += rp(t, lt, 2.0, 1500, 540, label(0, 0, '기억이 만들어지는 중', { size: 50, bg: GOLD }), { rot: 3 });
  }
  return h;
}
function rneuronScene(t, lt, a) {
  let h = BG('#14203A');
  const w = 8 + 26 * easeInOut(prog(lt, 0.8, 5));
  const nn = (x, y) => `<g transform="translate(${x} ${y})"><circle r="95" fill="#FFB5C8" stroke="${INK}" stroke-width="9"/><circle r="32" fill="#E4688D" stroke="${INK}" stroke-width="7"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M0 0 L${f1(Math.cos(i * 1.05 + (x > 900 ? 3.2 : 0)) * 180)} ${f1(Math.sin(i * 1.05 + (x > 900 ? 3.2 : 0)) * 180)}" stroke="#FFB5C8" stroke-width="10" stroke-linecap="round"/>`).join('')}</g>`;
  h += nn(520, 460) + nn(1400, 460);
  h += `<line x1="615" y1="460" x2="1305" y2="460" stroke="${GOLD}" stroke-width="${f1(w)}" stroke-linecap="round"/>`;
  for (let i = 0; i < 3; i++) { const k = (lt * 0.9 + i / 3) % 1; h += `<circle cx="${f1(lerp(615, 1305, k))}" cy="460" r="${f1(12 + w * 0.3)}" fill="#fff" opacity=".9"/>`; }
  h += rp(t, lt, 0.4, 960, 190, outlined(0, 0, [[['연결이 ', WHITE], ['굵어진다', GOLD]]], { size: 100, sw: 22 }), { rot: -2 });
  h += rp(t, lt, 2.6, 960, 720, label(0, 0, '장기강화 (LTP)', { size: 66, bg: MINT }), { rot: 2, bob: 3 });
  return h;
}
function rnobelScene(t, lt, a) {
  let h = BG('#14203A') + `<circle cx="960" cy="480" r="420" fill="${GOLD}" opacity=".12"/>`;
  h += rp(t, lt, 0.2, 960, 460, `<circle r="250" fill="${GOLD}" stroke="${INK}" stroke-width="12"/><circle r="205" fill="none" stroke="#B88A1D" stroke-width="8"/>` + outlined(0, -60, ['2000'], { size: 130, fill: INK, stroke: GOLD, sw: 0, shadow: false }) + outlined(0, 40, ['노벨 생리의학상'], { size: 54, fill: INK, stroke: GOLD, sw: 0, shadow: false }) + outlined(0, 120, ['에릭 캔델'], { size: 64, fill: INK, stroke: GOLD, sw: 0, shadow: false }), { rot: -3, bob: 4 });
  h += rSparks(960, 460, t, 14, 330);
  return h;
}
function rresearchScene(t, lt, a) {
  let h = rRoom() + rFloor(880, '#C9A576');
  h += rp(t, lt, 0.2, 520, 420, rbox(0, 0, 640, 460, '#FFF', { inner: outlined(0, -90, ['어떻게 돕나?'], { size: 74, fill: INK, stroke: '#fff', sw: 0, shadow: false }) + outlined(0, 40, ['연구 중'], { size: 110, fill: '#E58A1F', stroke: '#fff', sw: 0, shadow: false }) + rtext(0, 150, '🔍', 80, INK) }), { rot: -2 });
  h += rp(t, lt, 2.6, 1400, 420, rbox(0, 0, 640, 460, '#E8FFF4', { inner: outlined(0, -90, ['효과는?'], { size: 74, fill: INK, stroke: '#E8FFF4', sw: 0, shadow: false }) + outlined(0, 40, ['여러 번 확인'], { size: 92, fill: '#1E9E5A', stroke: '#E8FFF4', sw: 0, shadow: false }) }), { rot: 2 });
  for (let i = 0; i < 3; i++) if (lt > 3.4 + i * 0.4) h += rp(t, lt, 3.4 + i * 0.4, 1230 + i * 170, 590, rCheck(0, 0, 1.2), { rot: 0 });
  h += rz(t, lt, 960, 900, 0.8, '서기', [[0, '기본'], [2.6, '뿌듯']]);
  return h;
}

/* ---------- STAGE 3 ---------- */
function rposeScene(t, lt, a) {
  let h = rRoom() + rFloor(880, '#C9A576');
  h += rz(t, lt, 960, 900, 1.05, [[0, '서기'], [1, '턱괴기']], [[0, '기본'], [1, '결심']]);
  h += rp(t, lt, 0.3, 1400, 280, bubble(0, 0, 560, 190, rtext(0, 22, '일상에서 어떻게?', 54, NAVY)), { rot: 2 });
  h += rp(t, lt, 1.2, 520, 280, outlined(0, 0, ['?'], { size: 200, fill: YEL, sw: 36 }), { rot: -10, bob: 6 });
  return h;
}
function rfeynmanScene(t, lt, a) {
  let h = rRoom() + rFloor(880, '#C9A576');
  h += `<g transform="translate(1200 400)"><rect x="-470" y="-290" width="940" height="560" rx="20" fill="#2E5A44" stroke="#8C6638" stroke-width="24"/>${rtext(0, -90, '파인만 테크닉', 120, '#F4F7F2')}<path d="M-300 20 q60 -40 120 0 t120 0 t120 0 t120 0" fill="none" stroke="#F4F7F2" stroke-width="8" stroke-linecap="round"/>${rtext(0, 150, '쉽게 가르치면 보인다', 52, '#CFE6D6')}</g>`;
  h += rp(t, lt, 0.3, 460, 450, rbox(0, 0, 500, 330, '#fff', { rot: -3, inner: rtext(0, -80, '리처드 파인만', 62, INK) + rtext(0, 0, '1918 – 1988', 44, '#456') + rtext(0, 80, '노벨 물리학상', 52, '#E58A1F') }), {});
  h += rz(t, lt, 1790, 900, 0.8, '서기', [[0, '기본'], [2.5, '신남']]);
  return h;
}
function rstepsScene(t, lt, a) {
  let h = rRoom() + rFloor(900, '#C9A576');
  const steps = [['1', '개념 고르기'], ['2', '아이에게 설명'], ['3', '막힌 곳 찾기'], ['4', '책으로 채우기']];
  const base = a.to === 2 ? 0 : 2;
  steps.forEach((s, i) => {
    const show = i < a.to, appear = i >= base ? 0.3 + (i - base) * 1.6 : 0;
    if (!show) return;
    h += rp(t, lt, appear, 280 + i * 450, 330, rbox(0, 0, 400, 340, i % 2 ? '#FFF3C4' : '#E8FFF4', { rot: i % 2 ? 2 : -2, inner: `<circle cx="-130" cy="-100" r="52" fill="${GOLD}" stroke="${INK}" stroke-width="7"/>${rtext(-130, -80, s[0], 66, INK)}${outlined(0, 60, [s[1]], { size: 56, fill: INK, stroke: '#fff', sw: 0, shadow: false })}` }), {});
  });
  h += rz(t, lt, 760, 930, 0.7, '서기', [[0, '기본'], [1.5, '신남']]);
  h += rBear(1280, 770, 0.62, { happy: lt > 2.2 }) + (lt > 2.4 ? rBulb(1280, 560, 0.8, 1) : '');
  return h;
}
function rteachScene(t, lt, a) {
  let h = rRoom() + rFloor(880, '#C9A576');
  h += `<g transform="translate(960 380)"><rect x="-360" y="-210" width="720" height="360" rx="14" fill="#2E5A44" stroke="#8C6638" stroke-width="20"/>${rtext(0, 20, '인출 연습', 110, '#F4F7F2')}</g>`;
  h += rz(t, lt, 560, 900, 0.95, [[0, '서기'], [0.8, '손인사']], [[0, '신남']]);
  h += rBear(1360, 790, 0.8, { happy: 1 });
  h += rfx(t, lt, 1.6, 960, 680, '가장 강력!', RED, { size: 96, burst: 220, rot: -4, wobble: 3 });
  return h;
}
function rjargonScene(t, lt, a) {
  let h = rRoom() + rFloor(880, '#C9A576');
  h += rz(t, lt, 520, 900, 0.9, '서기', [[0, '기본'], [1.6, '걱정'], [4, '신남']]);
  h += rp(t, lt, 0.4, 480, 250, bubble(0, 0, 640, 200, rtext(0, 12, '시냅스 가소성의…', 50, NAVY) + rtext(0, 70, '어, 그러니까…', 44, '#7a8'), {}), { rot: -2 });
  h += rp(t, lt, 1.4, 840, 270, rCross(0, 0, 1.1), {});
  h += rBear(1400, 780, 0.75, { happy: lt > 4.2 });
  h += rp(t, lt, 4.2, 1400, 330, bubble(0, 0, 620, 170, rtext(0, 12, '택배 상자를', 48, NAVY) + rtext(0, 64, '쌓는 거야!', 48, NAVY)), { rot: 2 });
  if (lt > 4.6) h += rBulb(1560, 520, 0.9, 1) + rp(t, lt, 4.6, 1180, 300, rCheck(0, 0, 1.1), {});
  return h;
}
function rprotegeScene(t, lt, a) {
  let h = rRoom() + rFloor(880, '#C9A576');
  h += rp(t, lt, 0.2, 640, 200, outlined(0, 0, ['제자 효과'], { size: 110, fill: GOLD, sw: 24 }), { rot: -3 });
  h += rp(t, lt, 0.6, 640, 330, label(0, 0, '2009 · 스탠퍼드', { size: 54, bg: '#fff' }), { rot: 2 });
  const k = easeOut(prog(lt, 2.4, 4)), BASE = 800;
  h += rBar(1180, BASE, 190 * k, '#C9CED6', '', { size: 1 }) + rBar(1580, BASE, 420 * k, GOLD, '', { size: 1 });
  h += rtg(t, lt, 2.4, 1180, 860, '그냥 공부', '#fff', { size: 40 }) + rtg(t, lt, 2.4, 1580, 860, '가르친다 생각', YEL, { size: 40 });
  h += rch(t, lt, 640, 900, 0.9, '#FF9A55', [[0, '서기'], [2, '턱괴기']], [[0, '기본'], [2, '결심']]);
  h += rSweat(700, 470, t);
  h += rp(t, lt, 4.4, 1380, 270, outlined(0, 0, ['더 열심히!'], { size: 100, fill: RED, sw: 22 }), { rot: -4, wobble: 3 });
  return h;
}

/* ---------- STAGE 4 ---------- */
function rthreeScene(t, lt, a) {
  let h = rRoom() + rFloor(900, '#C9A576');
  const cards = [['Day 1', '백지 테스트', '#E8FFF4', () => rPaper(0, 70, 190, 130, 2.2, { rot: -4 })], ['Day 3', '곰 인형 기법', '#FFF3C4', () => rBear(0, 80, 0.5, { happy: 1 })], ['Day 5', '구멍 메우기', '#FFE8EF', () => `<g transform="translate(0 70) rotate(-35)"><rect x="-12" y="-60" width="24" height="100" rx="8" fill="#FFE14D" stroke="${INK}" stroke-width="6"/></g>`]];
  cards.forEach((c, i) => h += rp(t, lt, 0.8 + i * 1.5, 420 + i * 540, 470, rbox(0, 0, 440, 600, c[2], { rot: (i - 1) * 3, inner: rtext(0, -210, c[0], 76, INK) + outlined(0, -130, [c[1]], { size: 50, fill: INK, stroke: c[2], sw: 0, shadow: false }) + c[3]() }), {}));
  h += rz(t, lt, 960, 1000, 0.5, '서기', [[0, '기본'], [1, '신남']], { still: false });
  return h;
}
function rblankScene(t, lt, a) {
  let h = rRoom() + rFloor(880, '#C9A576');
  h += rz(t, lt, 760, 890, 0.95, '책상', [[0, '기본'], [2.2, '결심']]);
  h += rDesk(760, 700, 800);
  const close = easeInOut(prog(lt, 0.8, 1.6));
  h += close < 1 ? `<g transform="translate(560 650) scale(${f1(1 - close * 0.0)} 1)">${rBook(0, 0, 300 * (1 - close * 0.4), 150, [[-100, -30, 100, 1]])}</g>` : rClosedBook(500, 664, 220, 60, '#4F86C6', { rot: -4 });
  const wr = clamp((lt - 2.2) / 2.8, 0, 3);
  h += rPaper(980, 650, 300, 180, wr, { rot: -3 });
  h += rp(t, lt, 0.2, 1500, 260, outlined(0, 0, ['30분 읽기'], { size: 90, fill: YEL, sw: 20 }), { rot: -3 });
  if (lt > 1.6) h += rp(t, lt, 1.6, 1500, 400, outlined(0, 0, ['덮고 적기'], { size: 100, fill: MINT, sw: 22 }), { rot: 3 });
  [0, 1, 2].forEach(i => { if (lt > 2.6 + i * 0.8) h += rp(t, lt, 2.6 + i * 0.8, 1500, 530 + i * 90, label(0, 0, (i + 1) + '. 핵심', { size: 46, bg: '#fff' }), { rot: i - 1 }); });
  return h;
}
function rmindmapScene(t, lt, a) {
  let h = rRoom() + rFloor(900, '#C9A576');
  const mm = () => `<g>${[[-120, -80], [130, -70], [-130, 80], [140, 80]].map(([x, y]) => `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="#6BAA6B" stroke-width="8"/><circle cx="${x}" cy="${y}" r="40" fill="#C9F0C9" stroke="${INK}" stroke-width="6"/>`).join('')}<circle r="52" fill="#FFE27A" stroke="${INK}" stroke-width="7"/></g>`;
  h += rp(t, lt, 0.2, 500, 400, rbox(0, 0, 560, 420, '#fff', { inner: `<g transform="translate(0 30)">${mm()}</g>` + rtext(0, -150, '마인드맵 그리기', 50, INK) }), { rot: -2 });
  h += rp(t, lt, 1.0, 1420, 400, rbox(0, 0, 560, 420, '#fff', { inner: `<g transform="translate(-170 -10)">${[0, 1, 2].map(i => `<path d="M0 ${i * 80} q60 -16 120 0 t120 0 t100 0" fill="none" stroke="#2a58d6" stroke-width="8" stroke-linecap="round"/>`).join('')}</g>` + rtext(0, -150, '덮고 떠올리기', 50, INK) }), { rot: 2 });
  const k = easeOut(prog(lt, 2.8, 4.4));
  h += rBar(1180, 880, 100 * k, '#C9CED6', '', { size: 1 }) + rBar(1660, 880, 150 * k, GOLD, '', { size: 1 });
  h += rp(t, lt, 4.4, 1420, 640, outlined(0, 0, ['일주일 뒤 약 50% ↑'], { size: 70, fill: RED, sw: 18 }), { rot: -3, wobble: 2 });
  h += rz(t, lt, 360, 920, 0.7, '서기', [[0, '기본'], [4.4, '뿌듯']]);
  return h;
}
function rbeardayScene(t, lt, a) {
  let h = rRoom() + rFloor(880, '#C9A576');
  h += rz(t, lt, 640, 900, 0.95, '손인사'.length ? [[0, '서기'], [1, '손인사']] : '서기', [[0, '신남']], {});
  h += rBear(1300, 770, 0.8, { happy: 1 });
  for (let i = 0; i < 3; i++) { const k = ((lt * 0.9 + i / 3) % 1); h += `<circle cx="1000" cy="420" r="${f1(30 + k * 120)}" fill="none" stroke="${MINT}" stroke-width="8" opacity="${f1((1 - k) * 0.9 * 100) / 100}"/>`; }
  h += rbox(1650, 800, 150, 170, '#3A3F4E', { inner: `<circle cy="-30" r="30" fill="${RED}" stroke="#fff" stroke-width="5"/>${rtext(0, 56, 'REC', 30, '#fff')}` });
  h += rp(t, lt, 0.3, 960, 190, outlined(0, 0, ['1분 소리 내어 설명'], { size: 96, fill: YEL, sw: 22 }), { rot: -2 });
  const sec = Math.min(59, Math.floor(lt * 10));
  h += rp(t, lt, 0.4, 1650, 560, label(0, 0, '0:' + String(sec).padStart(2, '0'), { size: 54, bg: '#fff' }), { rot: 3 });
  return h;
}
function rduckScene(t, lt, a) {
  let h = rRoom() + rFloor(880, '#C9A576');
  h += rDesk(1100, 700, 1100);
  h += `<rect x="820" y="360" width="540" height="300" rx="16" fill="#1B2438" stroke="${INK}" stroke-width="9"/>` + [0, 1, 2, 3].map(i => `<rect x="${860}" y="${400 + i * 54}" width="${[260, 340, 200, 300][i]}" height="16" rx="8" fill="${[MINT, '#9CC9EA', PINK, '#FFE27A'][i]}" opacity=".85"/>`).join('');
  h += `<g transform="translate(1470 640)"><ellipse cx="0" cy="40" rx="90" ry="64" fill="#FFD83A" stroke="${INK}" stroke-width="8"/><circle cx="52" cy="-40" r="52" fill="#FFD83A" stroke="${INK}" stroke-width="8"/><path d="M96 -34 l56 10 l-56 18 Z" fill="#FF8A3D" stroke="${INK}" stroke-width="7"/><circle cx="64" cy="-52" r="9" fill="${INK}"/></g>`;
  h += rz(t, lt, 420, 900, 0.95, [[0, '서기'], [1, '손인사']], [[0, '기본'], [2.4, '놀람']]);
  h += rp(t, lt, 0.3, 700, 250, outlined(0, 0, ['고무오리 디버깅'], { size: 80, fill: YEL, sw: 20 }), { rot: -3 });
  if (lt > 3.0) { h += rfx(t, lt, 3.0, 1000, 700, '막힘!', RED, { size: 100, burst: 190, rot: -5, wobble: 3 }); h += rp(t, lt, 3.2, 1100, 330, label(0, 0, '놓친 곳 발견', { size: 52, bg: MINT }), { rot: 3 }); }
  return h;
}
function rgapScene(t, lt, a) {
  let h = rRoom() + rFloor(880, '#C9A576');
  h += rz(t, lt, 960, 890, 0.95, '책상', [[0, '기본'], [2, '결심'], [4, '뿌듯']]);
  h += rDesk(960, 700, 900);
  const hl = (i) => clamp((lt - 2.2 - i * 0.9) / 0.7, 0, 1);
  h += rBook(960, 650, 420, 130, [[-110, -30, 70, hl(0)], [10, 0, 80, hl(1)]]);
  h += rp(t, lt, 0.3, 560, 270, outlined(0, 0, ['설명 못 한 곳만'], { size: 84, fill: YEL, sw: 20 }), { rot: -3 });
  h += rp(t, lt, 4.2, 1450, 320, outlined(0, 0, ['밑줄은 그때'], { size: 90, fill: MINT, sw: 20 }), { rot: 3 });
  h += `<g transform="translate(${f1(840 + 130 * ((lt * 0.5) % 1))} ${f1(610)}) rotate(-35)"><rect x="-9" y="-44" width="18" height="70" rx="6" fill="#FFE14D" stroke="${INK}" stroke-width="5"/></g>`.replace(/^/, lt > 2 ? '' : '');
  return h;
}

/* ---------- OUTRO ---------- */
function reaseScene(t, lt, a) {
  let h = rRoom() + rFloor(880, '#C9A576');
  h += rz(t, lt, 760, 890, 0.95, '책상', [[0, '기본'], [2, '졸림']]);
  h += rDesk(760, 700, 800);
  h += rBook(760, 650, 340, 120, [[-100, -30, 80, 1]]);
  const pg = (lt * 0.7) % 1; h += `<g transform="translate(760 650) scale(${f1(Math.cos(pg * Math.PI) * 100) / 100} 1)"><rect x="0" y="-60" width="170" height="120" fill="#fff" stroke="${INK}" stroke-width="5"/></g>`;
  h += rBrain(1450, 420, 1.2, { fill: '#D9C9EC' });
  h += `<path d="M1390 ${f1(420 - 6)} q22 18 44 0 M1470 ${f1(414)} q22 18 44 0" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`;
  h += rtext(1620, 280 - Math.sin(t * 2) * 8, 'Z', 70, '#6A4CC6') + rtext(1680, 220 - Math.sin(t * 2 + 1) * 8, 'z', 54, '#6A4CC6');
  h += `<g transform="translate(1450 700)"><rect x="-190" y="-34" width="380" height="68" rx="34" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="-176" y="-22" width="${f1(24 + 8 * Math.sin(t * 2))}" height="44" rx="22" fill="#FF8A8A"/>${rtext(0, -64, '뇌의 노력', 44, INK)}</g>`;
  h += rp(t, lt, 0.3, 760, 250, outlined(0, 0, ['쏙쏙 들어온다?'], { size: 90, fill: YEL, sw: 20 }), { rot: -3 });
  return h;
}
function rgymScene(t, lt, a) {
  let h = BG('#2A2F3E') + rFloor(880, '#454B5E');
  const lift = easeInOut(prog(lt % 2.4, 0, 1.2)) * (lt % 2.4 < 2.0 ? 1 : 0);
  const by = lerp(520, 330, lift);
  h += rz(t, lt, 760, 900, 1.0, [[0, '서기'], [0.6, '만세']], [[0, '결심'], [2, '지침']]);
  h += `<g transform="translate(760 ${f1(by - 40)})"><rect x="-300" y="-8" width="600" height="16" rx="8" fill="#9aa" stroke="${INK}" stroke-width="6"/><rect x="-330" y="-60" width="46" height="120" rx="10" fill="#555" stroke="${INK}" stroke-width="7"/><rect x="284" y="-60" width="46" height="120" rx="10" fill="#555" stroke="${INK}" stroke-width="7"/></g>`;
  h += rBrain(760, by - 140, 0.6) + rSparks(760, by - 140, t, 8, 130);
  h += rSweat(840, 380, t);
  h += rp(t, lt, 0.3, 1480, 280, outlined(0, 0, ['꺼내려고 애쓰는 중'], { size: 84, fill: YEL, sw: 20 }), { rot: 2 });
  h += rp(t, lt, 2.0, 1480, 460, outlined(0, 0, ['단단해진다'], { size: 110, fill: GOLD, sw: 24 }), { rot: -3, bob: 4 });
  return h;
}
function rno10Scene(t, lt, a) {
  let h = rRoom() + rFloor(880, '#C9A576');
  h += rz(t, lt, 520, 900, 1.0, [[0, '서기'], [0.8, '손인사']], [[0, '결심']]);
  h += `<g transform="translate(1250 440)">${[0, 1, 2, 3, 4].map(i => rClosedBook(0, 200 - i * 64, 340, 56, ['#C45A3A', '#4F86C6', '#6BAA6B', '#E0A83A', '#9B6BC6'][i], { rot: (i % 2 ? 2 : -3) })).join('')}${outlined(0, -80, ['×10'], { size: 200, fill: '#fff', sw: 36 })}</g>`;
  const k = prog(lt, 0.8, 1.2);
  h += `<g transform="translate(1250 440)"><circle r="${f1(300 * k)}" fill="none" stroke="${RED}" stroke-width="30" opacity="${f1(k)}"/><line x1="${f1(-210 * k)}" y1="${f1(210 * k)}" x2="${f1(210 * k)}" y2="${f1(-210 * k)}" stroke="${RED}" stroke-width="30" stroke-linecap="round"/></g>`;
  return h;
}
function rdoScene(t, lt, a) {
  let h = rRoom() + rFloor(880, '#C9A576');
  h += rz(t, lt, 960, 900, 0.95, '책상', [[0, '기본'], [2.2, '신남']]);
  h += rDesk(960, 700, 900);
  h += lt < 2 ? rBook(960, 650, 340, 120, [[-100, -30, 80, 1]]) : rClosedBook(960, 664, 260, 60, '#4F86C6');
  const steps = [['1', '한 번 제대로 읽기'], ['2', '책 덮기'], ['3', '쉬운 말로 소리 내 설명']];
  steps.forEach((s, i) => h += rp(t, lt, 0.2 + i * 1.8, 360 + i * 600, 250, rbox(0, 0, 520, 150, ['#E8FFF4', '#FFF3C4', '#FFE8EF'][i], { rot: (i - 1) * 2, inner: `<circle cx="-200" cy="0" r="40" fill="${GOLD}" stroke="${INK}" stroke-width="6"/>${rtext(-200, 18, s[0], 50, INK)}${rtext(30, 14, s[1], 42, INK)}` }), {}));
  if (lt > 4.2) h += rBear(1560, 790, 0.7, { happy: 1 }) + [0, 1].map(i => `<circle cx="1260" cy="560" r="${f1(30 + ((lt * 0.9 + i / 2) % 1) * 100)}" fill="none" stroke="${MINT}" stroke-width="8" opacity="${f1((1 - ((lt * 0.9 + i / 2) % 1)) * 100) / 100}"/>`).join('');
  return h;
}
function rcommentScene(t, lt, a) {
  let h = rRoom() + rFloor(900, '#C9A576');
  const full = '인출 = 책 덮고 내 말로 꺼내 보기', n = Math.floor(clamp((lt - 1.2) / 6, 0, 1) * full.length);
  h += rp(t, lt, 0.1, 960, 330, rbox(0, 0, 1260, 300, '#fff', { rx: 30, inner: rtext(-540, -90, '댓글', 40, '#456', { anchor: 'start' }) + `<circle cx="-520" cy="30" r="40" fill="#FF9A55" stroke="${INK}" stroke-width="6"/><rect x="-440" y="-20" width="940" height="90" rx="14" fill="#F3F5F8" stroke="#C7CDD6" stroke-width="5"/>` + `<text x="-420" y="42" font-family="${FONT}" font-weight="900" font-size="46" fill="${INK}">${esc(full.slice(0, n))}</text>` + (Math.floor(t * 2) % 2 ? `<rect x="${f1(-420 + n * 46 * 0.98)}" y="-4" width="5" height="56" fill="${INK}"/>` : '') }), { rot: 0 });
  h += rtg(t, lt, 0.6, 1500, 190, '예시', YEL, { size: 40, rot: 5 });
  h += rz(t, lt, 960, 920, 0.85, '서기', [[0, '기본'], [4, '뿌듯']]);
  if (lt > 5.5) h += rBrain(1550, 700, 0.9, { fill: '#FFE9A8', line: '#E0A83A' }) + rSparks(1550, 700, t, 10, 160) + rp(t, lt, 5.6, 1550, 880, label(0, 0, '인출 시작', { size: 54, bg: GOLD }), { rot: -2 });
  return h;
}
function rendScene(t, lt, a) {
  let h = BG('#0F1B33') + `<circle cx="960" cy="520" r="${f1(450 + 20 * Math.sin(t * 2))}" fill="${GOLD}" opacity=".12"/>`;
  h += rBrain(960, 440, 1.6, { fill: '#FFE9A8', line: '#E0A83A' }) + rSparks(960, 440, t, 14, 330);
  h += outlined(960, 800, ['책을 덮고, 꺼내 보기'], { size: 100, fill: GOLD, sw: 24 });
  return h;
}
