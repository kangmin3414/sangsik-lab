/* AI 위로 편(ai01) 장면 1: 훅(새벽 2시, 1초 만의 위로) + 재미(태호의 "치킨 ㄱ?").
   gift01/long/gfscenes.js·gfscenes2.js 도우미(gfW·gfK·gfZero·gfP·gfMouth·gfPovHand·gfPovFinger·GF_PHBACK)를 쓴다. 이름 접두사 ai.
   연출 규칙: 폰 화면은 제로 시점(두 손 + 폰)에서만. 얼굴 샷에서는 폰 뒷면 + 얼굴에 푸른 빛. */
Object.assign(CAMS, { aibed: 'fixed', aiphone: 'fixed', aiface: 'fixed', aisend: 'fixed', aireply: 'fixed', aidead: 'fixed', aicrowd: 'fixed' });
Object.assign(QBG, { ainight: 'ai/night.png', aimorning: 'ai/morning.png', aisubway: 'ai/subway.png', aioffice: 'ai/office.png', aicafe: 'ai/cafe.png', ailab: 'ai/lab.png', aisoup: 'ai/soup.png', aihall: 'ai/hall.png' });
const AI_HD = '#8E9AAF', AI_BL = '#5A6894', AI_BL2 = '#7482AE';   // 회색 후드 잠옷, 이불(밤)
const AB = { X: 960, Y: 1040, S: 1.0, TX: 1555, TT: 892 };       // 침대 위 제로 원점·크기, 협탁 x·윗선
const aiDefs = () => `<defs><radialGradient id="aiGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#B4E2FF" stop-opacity=".9"/><stop offset=".5" stop-color="#7CC4FF" stop-opacity=".38"/><stop offset="1" stop-color="#7CC4FF" stop-opacity="0"/></radialGradient>
<linearGradient id="aiStarG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8FB8FF"/><stop offset="1" stop-color="#9B7BFF"/></linearGradient>
<radialGradient id="aiDark" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#25336A"/><stop offset="1" stop-color="#060A1C"/></radialGradient>
<clipPath id="aiScr"><rect x="-222" y="-440" width="444" height="880" rx="34"/></clipPath></defs>`;
const aiK = (lt, a, b) => clamp((lt - a) / (b - a), 0, 1);

/* ---------- 아이콘·작은 그림 ---------- */
const aiStar = (x, y, r) => { const q = v => f1(v * r); return `<g transform="translate(${f1(x)} ${f1(y)})"><circle r="${f1(r)}" fill="url(#aiStarG)" stroke="${INK}" stroke-width="${f1(Math.max(2, r * 0.11))}"/>` +
  `<path d="M0 ${q(-0.62)} Q${q(0.1)} ${q(-0.1)} ${q(0.62)} 0 Q${q(0.1)} ${q(0.1)} 0 ${q(0.62)} Q${q(-0.1)} ${q(0.1)} ${q(-0.62)} 0 Q${q(-0.1)} ${q(-0.1)} 0 ${q(-0.62)}Z" fill="#fff"/></g>`; };
const aiAv = (x, y, r, ch, c) => `<g transform="translate(${f1(x)} ${f1(y)})"><circle r="${f1(r)}" fill="${c}" stroke="${INK}" stroke-width="${f1(Math.max(2, r * 0.11))}"/>${fT(0, r * 0.37, ch, f1(r * 1.02), '#fff')}</g>`;
const aiAvT = (x, y, r) => aiAv(x, y, r, '태', '#3FA56B');
// 닭다리(치킨 이모티콘)
const aiChicken = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 100) / 100}) rotate(-35)"><rect x="-58" y="-7" width="40" height="14" rx="7" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-60" cy="-9" r="9" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-60" cy="9" r="9" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-58" y="-5" width="36" height="10" fill="#fff"/>` +
  `<path d="M-24 -10 Q-6 -40 30 -34 Q62 -26 60 4 Q56 34 22 36 Q-8 36 -24 10 Z" fill="#D98A2B" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M8 -20 Q30 -24 44 -10" fill="none" stroke="#F5C27A" stroke-width="6" stroke-linecap="round"/></g>`;
// 양(숫자 세기)
const aiSheep = (x, y, s, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 100) / 100})"><path d="M-12 18 L-16 40 M14 18 L18 40" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` +
  `<path d="M-40 6 Q-48 -16 -26 -22 Q-20 -40 0 -34 Q18 -44 30 -26 Q50 -22 44 0 Q50 20 26 22 Q8 32 -10 22 Q-38 28 -40 6Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><ellipse cx="48" cy="-10" rx="15" ry="13" fill="#3A3A44" stroke="${INK}" stroke-width="5"/><circle cx="52" cy="-13" r="3" fill="#fff"/></g>`;

/* ---------- 채팅 화면(화면 좌표: 가운데 0,0, 444x880) ---------- */
const aiTW = (s, fs) => { let w = 0; for (const c of s) w += /[가-힣ㄱ-ㅎㅏ-ㅣ…]/.test(c) ? fs * 0.98 : c === ' ' ? fs * 0.3 : /[0-9A-Za-z]/.test(c) ? fs * 0.6 : fs * 0.36; return w; };
const aiWrap = (s, n) => { const out = []; let cur = ''; for (const w of s.split(' ')) { if (cur && (cur + ' ' + w).length > n) { out.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; while (cur.length > n) { out.push(cur.slice(0, n)); cur = cur.slice(n); } } if (cur) out.push(cur); return out; };
const AI_FS = 27, AI_LH = 38;
// 말풍선 배치: msgs = [{me, text, bars, time, unread, k, emoji} | {date}]
function aiLayout(msgs) {
  let y = 0; const out = [];
  for (const m of msgs) {
    if (m.date) { out.push(Object.assign({ y, h: 44 }, m)); y += 62; continue; }
    if (m.dots) { out.push(Object.assign({ y, h: 62, w: 110 }, m)); y += 80; continue; }
    if (m.emoji) { out.push(Object.assign({ y, h: 96, w: 110 }, m)); y += 112; continue; }
    const lines = m.text ? aiWrap(m.text, 11) : [], bars = m.bars || 0;
    const w = bars ? 330 : Math.min(330, Math.max(...lines.map(l => aiTW(l, AI_FS))) + 44), h = 30 + (lines.length + bars) * AI_LH;
    out.push(Object.assign({ y, h, w, lines }, m)); y += h + 18;
  }
  return { items: out, H: y };
}
function aiBubble(it, top) {
  const k = it.k == null ? 1 : it.k; if (k <= 0.01) return '';
  const y = top + it.y + (1 - k) * 24, op = f1(clamp(k * 1.4, 0, 1) * 100) / 100;
  if (it.date) return `<g opacity="${op}"><rect x="-84" y="${f1(y)}" width="168" height="42" rx="21" fill="#8E99AB"/>${fT(0, y + 30, it.date, 23, '#fff', { w: 800 })}</g>`;
  const me = it.me, x0 = me ? 200 - it.w : -150;
  let g = `<g opacity="${op}">`;
  if (!me) g += it.ai ? aiStar(-185, y + 24, 23) : aiAvT(-185, y + 24, 23);
  if (it.dots) { g += `<rect x="${x0}" y="${f1(y)}" width="${it.w}" height="${it.h}" rx="22" fill="#fff" stroke="#C9CED6" stroke-width="3"/>`;
    [0, 1, 2].forEach(i => { const b = Math.sin((it.ph || 0) * 14 - i * 1.1); g += `<circle cx="${x0 + 30 + i * 25}" cy="${f1(y + 31 - 6 * Math.max(0, b))}" r="8" fill="#9AA3B2"/>`; }); return g + '</g>'; }
  if (it.emoji) { g += aiChicken(x0 + 52, y + 50, 1.0); }
  else {
    g += `<rect x="${f1(x0)}" y="${f1(y)}" width="${f1(it.w)}" height="${f1(it.h)}" rx="22" fill="${me ? '#BFE3FF' : '#fff'}" stroke="${me ? '#8CC2EA' : '#C9CED6'}" stroke-width="3"/>`;
    it.lines.forEach((l, i) => { g += fT(x0 + 22, y + 15 + AI_LH * (i + 0.72), l, AI_FS, INK, { anchor: 'start', w: 600 }); });
    for (let b = 0; b < (it.bars || 0); b++) { const bw = (it.w - 44) * (b % 5 === 4 ? 0.45 : 0.72 + 0.28 * hash(b * 13 + 5)); g += `<rect x="${f1(x0 + 22)}" y="${f1(y + 15 + AI_LH * (it.lines.length + b) + 10)}" width="${f1(bw)}" height="16" rx="8" fill="#D5DAE2"/>`; }
  }
  if (it.time) g += fT(me ? x0 - 8 : x0 + it.w + 8, y + it.h - 4, it.time, 20, '#6E7787', { anchor: me ? 'end' : 'start', w: 600 });
  if (it.unread) g += fT(x0 - 8, y + it.h - 26, '1', 30, '#F2A20C', { anchor: 'end', w: 900 });
  return g + '</g>';
}
// 자판(두벌식 모양, 글자 장식). kb: 0~1 올라온 정도. press: 눌린 키 [줄, 칸]
const AI_KR = ['ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔ', 'ㅁㄴㅇㄹㅎㅗㅓㅏㅣ', 'ㅋㅌㅊㅍㅠㅜㅡ'];
const aiKeyPos = (r, c) => { const n = AI_KR[r].length, kw = 40, gap = 4, x0 = -(n * kw + (n - 1) * gap) / 2; return [x0 + c * (kw + gap) + kw / 2, 440 - 300 + 30 + r * 62]; };
function aiKeyboard(kb, press) {
  if (kb <= 0.01) return '';
  const dy = (1 - kb) * 300; let g = `<g transform="translate(0 ${f1(dy)})"><rect x="-222" y="140" width="444" height="300" fill="#CDD2DA"/>`;
  AI_KR.forEach((row, r) => [...row].forEach((ch, c) => { const [x, y] = aiKeyPos(r, c), pr = press && press[0] === r && press[1] === c;
    g += `<rect x="${f1(x - 20)}" y="${f1(y - 27)}" width="40" height="54" rx="7" fill="${pr ? '#AEB6C2' : '#fff'}"/>` + fT(x, y + 9, ch, 22, '#3A4150', { w: 600 }); }));
  g += `<rect x="-120" y="${440 - 300 + 30 + 3 * 62 - 27}" width="240" height="54" rx="7" fill="#fff"/><rect x="-210" y="${440 - 300 + 30 + 3 * 62 - 27}" width="80" height="54" rx="7" fill="#AEB6C2"/><rect x="130" y="${440 - 300 + 30 + 3 * 62 - 27}" width="80" height="54" rx="7" fill="#AEB6C2"/>`;
  return g + '</g>';
}
// 채팅방 화면. o: { who:'ai'|'tae', msgs, typed, kb, press, send(눌림), time, scroll(숫자|null=맨 아래), paste(0~1) }
function aiChatScreen(o) {
  const kb = o.kb || 0, typed = o.typed || '', tl = typed ? aiWrap(typed, 12) : [''], fh = 26 + 32 * tl.length, ih = fh + 24;
  const yIn = 440 - 300 * kb - ih, areaTop = -326, areaH = yIn - areaTop;
  const L = aiLayout(o.msgs), sc = o.scroll == null ? Math.max(0, L.H + 16 - areaH) : o.scroll, top = areaTop + 16 - sc;
  let g = `<rect x="-222" y="-440" width="444" height="880" fill="#E1E8F0"/><g>` + L.items.map(it => aiBubble(it, top)).join('') + `</g>`;
  // 머리줄
  g += `<rect x="-222" y="-440" width="444" height="114" fill="#F7F9FC"/><line x1="-222" y1="-326" x2="222" y2="-326" stroke="#C9CED6" stroke-width="3"/>` + aiStatus(o.time) +
    fT(-196, -350, '‹', 46, '#3A4150', { anchor: 'start', w: 400 }) + (o.who === 'ai' ? aiStar(-136, -364, 25) : aiAvT(-136, -364, 25)) + fT(-100, -353, o.who === 'ai' ? 'AI' : '태호', 30, INK, { anchor: 'start', w: 800 });
  // 입력줄
  const on = typed.length > 0, sp = o.send ? 0.88 : 1;
  g += `<rect x="-222" y="${f1(yIn)}" width="444" height="${f1(ih)}" fill="#fff"/><rect x="-206" y="${f1(yIn + 12)}" width="350" height="${f1(fh)}" rx="${f1(Math.min(26, fh / 2))}" fill="#F1F3F6" stroke="#D5DAE2" stroke-width="2"/>`;
  if (o.flash > 0.01) g += `<rect x="-206" y="${f1(yIn + 12)}" width="350" height="${f1(fh)}" rx="${f1(Math.min(26, fh / 2))}" fill="#BFE3FF" opacity="${f1(o.flash * 80) / 100}"/>`;
  if (on) tl.forEach((l, i) => { g += fT(-188, yIn + 12 + 13 + 32 * (i + 0.78), l, 25, INK, { anchor: 'start', w: 600 }); });
  else g += fT(-188, yIn + 12 + 13 + 32 * 0.78, '메시지 입력', 25, '#A0A6B0', { anchor: 'start', w: 500 });
  if (o.caret) { const lw = aiTW(tl[tl.length - 1], 25); g += `<rect x="${f1(-186 + lw)}" y="${f1(yIn + 12 + 13 + 32 * (tl.length - 1) + 2)}" width="3" height="28" fill="#3D7BF7"/>`; }
  g += `<g transform="translate(184 ${f1(yIn + ih / 2)}) scale(${sp})"><circle r="27" fill="${on ? '#3D7BF7' : '#C9CED6'}"/><path d="M0 12 L0 -12 M-10 -2 L0 -12 L10 -2" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  if (o.paste > 0.01) g += `<g transform="translate(-120 ${f1(yIn - 44)}) scale(${f1(o.paste * 100) / 100})"><rect x="-80" y="-30" width="160" height="56" rx="12" fill="#2B2F3A"/><path d="M-10 26 L0 40 L10 26 Z" fill="#2B2F3A"/>${fT(0, 9, '붙여넣기', 24, '#fff', { w: 700 })}</g>`;
  g += aiKeyboard(kb, o.press);
  return { svg: g, yIn, top, L };
}
const aiStatus = time => fT(-190, -410, time || '2:07', 22, INK, { anchor: 'start', w: 800 }) + `<g transform="translate(150 -418)"><rect x="0" y="0" width="38" height="18" rx="4" fill="none" stroke="${INK}" stroke-width="3"/><rect x="3" y="3" width="${f1(22)}" height="12" rx="2" fill="${INK}"/><rect x="39" y="6" width="4" height="7" rx="1" fill="${INK}"/></g>` +
  [0, 1, 2, 3].map(i => `<rect x="${110 + i * 8}" y="${-404 - i * 4}" width="5" height="${6 + i * 4}" rx="1" fill="${INK}"/>`).join('');
// 대화 목록 화면. press: 눌린 줄 번호
const AI_ROWS = [{ n: 'AI', p: '언제든 이야기해 주세요.', t: '오전 2:07', av: 'ai' }, { n: '엄마', p: '밥은 먹었니?', t: '어제', av: ['엄', '#E58FA5'] }, { n: '팀 공지방', p: '내일 회의 9시입니다', t: '어제', av: ['팀', '#7B8AA8'] },
  { n: '헬스장', p: '회원권 만료 안내', t: '월요일', av: ['헬', '#E0A458'] }, { n: '태호', p: 'ㅇㅇ 고마움', t: '3월 2일', av: 'tae' }];
const AI_TROW = 4;
function aiListScreen(o) {
  let g = `<rect x="-222" y="-440" width="444" height="880" fill="#fff"/>` + aiStatus(o.time) + fT(-196, -340, '채팅', 38, INK, { anchor: 'start', w: 900 });
  AI_ROWS.forEach((r, i) => { const y = -290 + i * 104;
    if (o.press === i) g += `<rect x="-222" y="${y - 6}" width="444" height="104" fill="#E3E8F0"/>`;
    g += (r.av === 'ai' ? aiStar(-166, y + 46, 34) : r.av === 'tae' ? aiAvT(-166, y + 46, 34) : aiAv(-166, y + 46, 34, r.av[0], r.av[1])) +
      fT(-116, y + 36, r.n, 28, INK, { anchor: 'start', w: 800 }) + fT(-116, y + 74, r.p, 22, '#7A8394', { anchor: 'start', w: 500 }) + fT(204, y + 34, r.t, 18, '#9AA3B2', { anchor: 'end', w: 600 }); });
  return g;
}

/* ---------- 제로 시점(POV): 침대에 앉아 내려다본 폰. 두 손은 폰을 쥐기만 한다(손가락으로 누르는 장면 없음) ---------- */
// 무릎 위 이불(내려다본 모습, 폰 빛을 받음)
const aiPovHand = (sx, sy, hx, hy, r) => `<path d="M${f1(sx)} ${f1(sy)} L${f1(hx)} ${f1(hy)}" stroke="${INK}" stroke-width="${f1(r * 0.42)}" stroke-linecap="round"/><circle cx="${f1(hx)}" cy="${f1(hy)}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="9"/>`;
const aiLap = glow => { const hi = f1(glow * 0.8 * 100) / 100;
  return `<g filter="url(#gfBlur)"><image href="${QBG.ainight}" x="-150" y="-30" width="2220" height="1250" preserveAspectRatio="xMidYMid slice"/></g>` + fFull('#070B1E', 0.55) +
    `<path d="M-300 1400 L-300 760 Q-60 560 300 640 Q560 700 700 900 L760 1400 Z" fill="#3A4570" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>` +
    `<path d="M2300 1400 L2300 760 Q1980 560 1620 640 Q1360 700 1220 900 L1160 1400 Z" fill="#3A4570" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>` +
    `<g fill="none" stroke="#283158" stroke-width="9" stroke-linecap="round"><path d="M-100 860 Q160 760 420 840"/><path d="M80 1000 Q320 900 600 1000"/><path d="M2020 860 Q1760 760 1500 840"/><path d="M1840 1000 Q1600 900 1320 1000"/></g>` +
    `<g fill="none" stroke="#7F95D6" stroke-width="8" stroke-linecap="round" opacity="${hi}"><path d="M300 650 Q520 700 660 860"/><path d="M1620 650 Q1400 700 1260 860"/></g>`; };
// o: { screen(화면 좌표 svg), glow, py, rot, cam }
function aiPov(t, o) {
  GF_SLEEVE = AI_HD;
  const PY = o.py || 548, R = o.rot == null ? -3 : o.rot, glow = o.glow == null ? 1 : o.glow;
  let g = aiLap(glow) + `<ellipse cx="960" cy="${PY}" rx="760" ry="700" fill="url(#aiGlow)" opacity="${f1(0.42 * glow * 100) / 100}"/>`;
  // 손: 폰 아래쪽을 양손으로 받쳐 쥠(손가락 없음, 화면은 가리지 않음)
  g += `<g transform="translate(960 ${PY}) rotate(${R})"><rect x="-250" y="-470" width="500" height="940" rx="56" fill="#22262E" stroke="${INK}" stroke-width="10"/>` +
    `<g clip-path="url(#aiScr)">${o.screen}</g><rect x="-222" y="-440" width="444" height="880" rx="34" fill="none" stroke="#11141A" stroke-width="3"/>` +
    aiPovHand(-700, 1250, -268, 386, 84) + aiPovHand(700, 1250, 268, 386, 84) + `</g>`;
  const cam = o.cam || [960, 560, 1.0];
  return aiDefs() + gfDefs() + qCam(cam, g);
}
const aiOldAI = [{ date: '오늘' }, { me: false, ai: true, text: '안녕하세요, 제로님. 무엇이든 이야기해 주세요.', time: '오전 2:01' }];
const AI_Z1 = '오늘 진짜 억울해… 다 그만두고 싶다.';
const AI_A1 = '제로님, 오늘 정말 많이 힘드셨겠어요. 그건 절대 제로님 잘못이 아니에요.';

/* =========== 0. 이불 덩어리 + 새어 나오는 푸른 빛 =========== */
function aiBedBack() {
  return `<rect x="600" y="688" width="720" height="320" rx="28" fill="#6B5848" stroke="${INK}" stroke-width="9"/><rect x="630" y="716" width="660" height="40" rx="12" fill="#7D6957"/>` +
    `<path d="M640 860 L1280 860 L1405 1004 L515 1004 Z" fill="#E6E1D6" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>` ;
}
function aiBedFrame() { return `<rect x="505" y="1000" width="910" height="120" rx="12" fill="#5A4838" stroke="${INK}" stroke-width="9"/><rect x="530" y="1120" width="40" height="70" fill="#4A3A2C" stroke="${INK}" stroke-width="7"/><rect x="1350" y="1120" width="40" height="70" fill="#4A3A2C" stroke="${INK}" stroke-width="7"/>`; }
// 이불 앞쪽(무릎 위 ~ 침대 앞으로 늘어짐). top: 윗선 y
function aiBlanketFront(top = 905, c = AI_BL) {
  return `<path d="M585 ${top + 26} Q690 ${top - 26} 810 ${top - 8} Q930 ${top + 14} 1060 ${top - 26} Q1210 ${top - 40} 1320 ${top + 16} Q1400 ${top + 60} 1428 1010 Q1446 1090 1386 1102 Q960 1124 534 1102 Q474 1090 494 1010 Q520 ${top + 60} 585 ${top + 26} Z" fill="${c}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>` +
    `<g fill="none" stroke="#3E4A72" stroke-width="7" stroke-linecap="round" opacity=".7"><path d="M720 ${top + 40} Q760 ${top + 110} 700 1060"/><path d="M1130 ${top + 20} Q1180 ${top + 100} 1250 1070"/><path d="M930 ${top + 60} Q960 ${top + 120} 940 1090"/></g>`;
}
// 협탁 + 디지털 시계(시계는 방 소품이라 정면도 괜찮다)
function aiClock(txt, o = {}) {
  const x = AB.TX, T = AB.TT;
  return `<rect x="${x - 120}" y="${T}" width="240" height="196" rx="8" fill="#6B5848" stroke="${INK}" stroke-width="8"/><rect x="${x - 132}" y="${T - 16}" width="264" height="24" rx="6" fill="#7D6957" stroke="${INK}" stroke-width="7"/><line x1="${x - 100}" y1="${T + 90}" x2="${x + 100}" y2="${T + 90}" stroke="${INK}" stroke-width="5"/><circle cx="${x}" cy="${T + 54}" r="7" fill="${INK}"/>` +
    `<g transform="translate(${x} ${T - 66})"><rect x="-104" y="-52" width="208" height="104" rx="18" fill="#1C1F26" stroke="${INK}" stroke-width="8"/><rect x="-88" y="-38" width="176" height="76" rx="8" fill="#0B0D12"/>` +
    `<text x="0" y="24" text-anchor="middle" font-family="'DejaVu Sans Mono', monospace" font-weight="700" font-size="${o.big ? 62 : 58}" fill="#FF5A5A">${txt}</text>` +
    `<ellipse cx="0" cy="0" rx="130" ry="80" fill="#FF5A5A" opacity=".1"/></g>`;
}
// 폰 뒷면: 두 손이 아래 양 모서리를 잡는다(왼손 기준으로 오른쪽에 붙임)
const AI_PHB = GF_PHBACK.replace('translate(0 -50)', 'translate(27 -40)');
// 침대에 앉은 제로(회색 후드 잠옷, 허리까지 이불). face: ACT.face 옵션, o: { pose, look, headDy, tilt, sy, noPhone, x, y, s }
function aiBedZero(key, t, face, o = {}) {
  const X = o.x || AB.X, Y = o.y || AB.Y, S = o.s || AB.S;
  const pose = o.pose || A2.pose({ hL: [173, 378], hR: [227, 378] });
  return gfZero(key, face, { t, x: X, y: Y, s: S, pose, look: o.look, vest: AI_HD, vshade: 'rgba(30,40,70,0.22)', headDy: o.headDy || 0, tilt: o.tilt || 0, sy: o.sy, sx: o.sx,
    holdL: o.noPhone ? undefined : { svg: AI_PHB, rot: 0 }, handL: o.noPhone ? undefined : 'grip', handR: o.noPhone ? undefined : 'grip' });
}
// 폰 화면 빛(얼굴·가슴). 장면 마지막에 screen 합성
const aiFaceGlow = (x, y, k, r = 1) => k > 0.01 ? `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(300 * r)}" ry="${f1(270 * r)}" fill="url(#aiGlow)" opacity="${f1(0.85 * k * 100) / 100}" style="mix-blend-mode:screen"/>` : '';
const aiNightTint = (k = 1) => fFull('#0A1238', 0.34 * k);

function aibedScene(t, lt, a) {
  // 불 꺼진 원룸: 침대에 앉은 제로, 얼굴만 폰 빛을 받는다(전체 → 천천히 다가감)
  const run = a._run, fl = 0.85 + 0.15 * Math.sin(run * 23) * Math.sin(run * 7.3);
  const cam = qLerpCam(run / 1.3, [1010, 640, 1.02], [990, 700, 1.22]);
  const face = { eyes: { open: 1 - ACT.blinks(run, [0.7], 0.18), flat: 0.35 }, brow: { worry: 0.65, knit: 0.3 }, mouth: { v: ACT.VIS.M, o: 0, c: -3 }, blush: 0.15 };
  const zero = aiBedZero('_ai0', t, face, { look: [0, 0.8], headDy: 6 });
  const w = qPlate('ainight', cam, 0.5) + qCam(cam, aiBedBack() + zero + aiBlanketFront(885) + aiBedFrame() + aiClock('02:07')) + aiNightTint(1.15) + qCam(cam, aiFaceGlow(960, 720, fl));
  return aiDefs() + gfDefs() + qDefs() + w;
}

/* =========== 1. 제로 시점: AI에게 타이핑 → 전송 → 1초 만의 장문 답장 =========== */
function aiphoneScene(t, lt, a) {
  const ph = a.ph;
  if (ph === 0) {
    // 말에 맞춰 입력칸에 한 글자씩 써진다(손가락은 보이지 않음)
    const D = a._dur || 4.2, n = AI_Z1.length, typedN = Math.round(n * clamp((lt - 0.05) / (D - 0.3), 0, 1)), typed = AI_Z1.slice(0, typedN);
    const S = aiChatScreen({ who: 'ai', msgs: aiOldAI, typed, kb: 1, caret: Math.floor(lt * 2.4) % 2 === 0, time: '2:07' });
    return aiPov(t, { screen: S.svg, cam: qLerpCam((lt - 0.4) / (D - 1.2), [960, 430, 1.28], [960, 540, 1.36]) });
  }
  const sent = { me: true, text: AI_Z1, time: '오전 2:07' };
  if (ph === 1) {
    const run = lt - 0.15;
    // 0.18 전송(말풍선이 올라감) → 0.4~0.7 점 세 개 → 0.72 장문 답장
    const tap = 0.18, kSent = aiK(run, tap, tap + 0.18), kb = 1 - easeInOut(aiK(run, 0.28, 0.55)), dots = run > 0.4 && run < 0.72, kRep = aiK(run, 0.72, 0.86);
    const msgs = aiOldAI.concat([Object.assign({ k: kSent }, sent)]);
    if (dots) msgs.push({ me: false, ai: true, dots: true, ph: run });
    if (run >= 0.72) msgs.push({ me: false, ai: true, text: AI_A1, bars: 12, time: '오전 2:07', k: kRep });
    let scroll = null;
    if (run >= 0.72) { const L = aiLayout(msgs), last = L.items[L.items.length - 1], auto0 = Math.max(0, aiLayout(msgs.slice(0, -1)).H + 16 - 684); scroll = lerp(auto0, last.y - 10, easeInOut(aiK(run, 0.74, 1.05))); }
    const S = aiChatScreen({ who: 'ai', msgs, typed: run < tap ? AI_Z1 : '', kb, time: '2:07', scroll });
    return aiPov(t, { screen: S.svg, cam: qLerpCam(run / 1.1, [960, 520, 1.32], [960, 470, 1.3]) });
  }
  // ph2(a1): 답장을 읽는 동안 끝에서 화면이 천천히 위로 흐른다
  const msgs = aiOldAI.concat([sent, { me: false, ai: true, text: AI_A1, bars: 12, time: '오전 2:07' }]);
  const L = aiLayout(msgs), last = L.items[L.items.length - 1], D = a._dur || 6.4;
  const sc = last.y - 10 + 50 * easeInOut(aiK(lt, D - 0.7, D));
  const S = aiChatScreen({ who: 'ai', msgs, kb: 0, time: '2:07', scroll: sc });
  return aiPov(t, { screen: S.svg, cam: qLerpCam(lt / D, [960, 470, 1.3], [960, 430, 1.36]) });
}

/* =========== 2. 얼굴: 위로받은 얼굴 + 화내지도·졸지도·귀찮아하지도 ✕ =========== */
const aiEmo = (kind, x, y, r, kX, kIn) => {
  if (kIn <= 0.01) return '';
  const s = f1(easeOutBack(clamp(kIn, 0, 1)) * 100) / 100;
  let g = `<g transform="translate(${x} ${y}) scale(${s})"><circle r="${r}" fill="${kind === 'angry' ? '#FF8A65' : kind === 'sleep' ? '#9FC5F8' : '#C7CCD6'}" stroke="${INK}" stroke-width="7"/>`;
  if (kind === 'angry') g += `<path d="M-34 -22 L-10 -10 M34 -22 L10 -10" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><circle cx="-18" cy="2" r="6" fill="${INK}"/><circle cx="18" cy="2" r="6" fill="${INK}"/><path d="M-22 32 Q0 16 22 32" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`;
  else if (kind === 'sleep') g += `<path d="M-30 0 Q-18 10 -6 0 M6 0 Q18 10 30 0" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><ellipse cx="0" cy="26" rx="8" ry="10" fill="${INK}"/>` + fT(44, -34, 'z', 34, '#fff', { stroke: INK, sw: 5 });
  else g += `<path d="M-30 -2 L-8 -2 M8 -2 L30 -2" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M-16 28 L16 28" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M30 22 Q56 14 66 30 Q60 46 40 40" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
  g += fT(0, r + 46, kind === 'angry' ? '화' : kind === 'sleep' ? '졸음' : '귀찮음', 44, '#fff', { stroke: INK, sw: 8 });
  if (kX > 0.01) { const d = 190, p1 = f1(d * clamp(kX * 2, 0, 1)), p2 = f1(d * clamp(kX * 2 - 1, 0, 1)), e = r * 1.08;
    g += `<g stroke-linecap="round" opacity=".88"><path d="M${-e} ${-e} L${e} ${e}" stroke="${INK}" stroke-width="17" stroke-dasharray="${p1} 400"/><path d="M${-e} ${-e} L${e} ${e}" stroke="#E5484D" stroke-width="9" stroke-dasharray="${p1} 400"/>` +
      `<path d="M${e} ${-e} L${-e} ${e}" stroke="${INK}" stroke-width="17" stroke-dasharray="${p2} 400"/><path d="M${e} ${-e} L${-e} ${e}" stroke="#E5484D" stroke-width="9" stroke-dasharray="${p2} 400"/></g>`; }
  return g + '</g>';
};
function aifaceScene(t, lt, a) {
  const D = a._dur || 5.7, t1 = gfW(a, ['1초', '일초', '초'], 0.8), tA = gfW(a, ['화내'], 1.35), tS = gfW(a, ['졸지', '좋을'], 3.0), tB = gfW(a, ['귀찮'], 3.85);
  const moved = aiK(lt, 0.3, 2.2), smile = easeInOut(aiK(lt, 0.6, 2.4));
  const face = { eyes: { open: 1 - ACT.blinks(lt, [0.25, 2.6, 4.6], 0.2), size: 1.02, wet: 0.55 * moved }, brow: { worry: 0.55 - 0.25 * smile }, mouth: { v: ACT.VIS.M, o: 0, c: lerp(-1, 4, smile), wob: 0.25 * moved }, blush: 0.35 + 0.25 * smile };
  const look = ACT.saccade(lt, [[0, [0.05, 0.75]], [tA - 0.2, [0.15, 0.7]], [tB + 0.5, [0, 0.8]]], 0.05, 33);
  const zero = aiBedZero('_ai1', t, face, { look, headDy: 2 * Math.sin(lt * 1.6), tilt: lerp(-2, 3, smile) });
  const cam = qLerpCam(lt / D, [960, 690, 2.05], [960, 700, 2.3]);
  let ov = '';
  // 1초 스톱워치 → ✕ 아이콘 세 개
  const kT = ACT.symK(lt, t1 - 0.1, D);
  if (kT > 0.01) ov += `<g transform="translate(330 250) scale(${f1(kT * 125) / 100})"><circle r="74" fill="#fff" stroke="${INK}" stroke-width="8"/><rect x="-14" y="-98" width="28" height="22" rx="5" fill="${INK}"/><path d="M0 0 L0 -50" stroke="#E5484D" stroke-width="8" stroke-linecap="round" transform="rotate(${f1(36 * Math.min(1, (lt - t1 + 0.1) * 4))})"/><circle r="8" fill="${INK}"/>${fT(0, 120, '1초', 54, '#fff', { stroke: INK, sw: 8 })}</g>`;
  ov += aiEmo('angry', 1320, 250, 82, aiK(lt, tA + 0.15, tA + 0.45), aiK(lt, tA - 0.25, tA + 0.05)) + aiEmo('sleep', 1560, 250, 82, aiK(lt, tS + 0.1, tS + 0.4), aiK(lt, tS - 0.3, tS)) + aiEmo('sigh', 1800, 250, 82, aiK(lt, tB + 0.15, tB + 0.45), aiK(lt, tB - 0.3, tB));
  const W = qPlate('ainight', cam, 0.45, { blur: true }) + qCam(cam, aiBedBack() + zero + aiBlanketFront(885) + aiBedFrame()) + aiNightTint(1) + qCam(cam, aiFaceGlow(955, 700, 0.9 + 0.08 * Math.sin(lt * 9)));
  return aiDefs() + gfDefs() + qDefs() + W + ov;
}

/* =========== 3. 태호에게도 보냄 → 세 시간(몽타주) =========== */
const AI_TOLD = [{ date: '3월 2일' }, { me: true, text: '생일 축하한다', time: '오후 9:12' }, { me: false, text: 'ㅇㅇ 고마움', time: '오후 11:40' }];
// 침대 몽타주(세 시간): u = 몽타주 시작 뒤 시간, U = 전체 길이
function aiLapse(t, u, U) {
  const k = clamp(u / U, 0, 1), mins = Math.round(lerp(2 * 60 + 8, 5 * 60 + 12, Math.pow(k, 0.9))), clk = `0${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;
  // 박자: 폰 확인(빛 켜짐/꺼짐) → 천장 보기 → 양 세기(생각 구름) → 꾸벅
  const B = [0, U * 0.22, U * 0.42, U * 0.66, U];
  const glow = u < B[1] ? ((u % 0.5) < 0.32 ? 1 : 0.35) : 0.3, stare = u >= B[1] && u < B[2], sheep = u >= B[2] && u < B[3], doze = u >= B[3];
  const dozeK = easeInOut(aiK(u, B[3], B[3] + 0.6)), nod = doze ? 6 * Math.max(0, Math.sin((u - B[3]) * 5)) : 0;
  const face = { eyes: { open: doze ? lerp(0.55, 0, dozeK) : sheep ? 0.6 - 0.15 * Math.sin(u * 3) : 1 - ACT.natBlink(u, 44), flat: sheep ? 0.4 : 0.15, size: stare ? 1.05 : 1 }, brow: { worry: 0.4 }, mouth: { v: ACT.VIS.M, o: 0, c: -1 }, blush: 0.2,
    hfx: tt => doze ? `<g opacity="${f1(dozeK * 100) / 100}">${fT(330 + Math.sin(u * 2) * 6, 70 - (u * 40) % 40, 'z', 48, '#fff', { stroke: INK })}${fT(366, 24 - (u * 40 + 20) % 40, 'z', 36, '#fff', { stroke: INK })}</g>` : '' };
  const look = u < B[1] ? [0, 0.8] : stare ? [0.1, -1] : sheep ? [0.6, -0.8] : [0, 0.6];
  const lap = doze ? dozeK : 0, hy = lerp(378, 420, lap);
  const zero = aiBedZero('_ai2', t, face, { look, headDy: 12 * dozeK + nod, tilt: 7 * dozeK, pose: A2.pose({ hL: [173, hy], hR: [227, hy] }) });
  let sh = '';
  if (sheep) { const kc = ACT.symK(u, B[2], B[3] - 0.15), cx = 1170, cy = 470;
    if (kc > 0.01) { sh += `<g transform="translate(${cx} ${cy}) scale(${f1(kc * 100) / 100})"><circle cx="-150" cy="150" r="14" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-112" cy="112" r="22" fill="#fff" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-120 40 Q-150 -40 -80 -60 Q-60 -120 10 -100 Q70 -140 120 -80 Q190 -70 170 10 Q190 80 110 80 Q60 120 0 90 Q-60 120 -100 80 Q-140 80 -120 40Z" fill="#fff" stroke="${INK}" stroke-width="7"/>` +
      `<g stroke="${INK}" stroke-width="5" fill="#C98B4E"><path d="M-30 74 L-30 14 L-22 4 L-14 14 L-14 74 Z"/><path d="M14 74 L14 14 L22 4 L30 14 L30 74 Z"/><rect x="-50" y="28" width="100" height="12" rx="3"/><rect x="-50" y="52" width="100" height="12" rx="3"/></g>`;
      for (let i = 0; i < 3; i++) { const q = ((u - B[2]) / 0.6 - i * 0.55); if (q > 0 && q < 1) sh += aiSheep(lerp(-120, 120, q), 30 - 100 * Math.sin(q * Math.PI), 0.78, lerp(-14, 14, q)); }
      sh += '</g>'; } }
  const cam = qLerpCam(u / U, [1220, 740, 1.48], [1240, 760, 1.56]);
  const ff = `<g transform="translate(170 150)"><rect x="-74" y="-46" width="148" height="92" rx="20" fill="#000" opacity=".45"/><path d="M-52 -28 L-4 0 L-52 28 Z M0 -28 L48 0 L0 28 Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`;
  return aiDefs() + gfDefs() + qDefs() + qPlate('ainight', cam, 0.45) + qCam(cam, aiBedBack() + zero + aiBlanketFront(885) + aiBedFrame() + aiClock(clk, { big: true })) + aiNightTint(1) +
    qCam(cam, aiFaceGlow(955, 700, glow * 0.9) + sh) + ff;
}
function aisendScene(t, lt, a) {
  const ph = a.ph, run = a._run;
  if (ph === 0) {
    // 목록으로 → '태호' 줄이 눌린 표시 → 태호 방(오래된 대화) → 자판이 올라옴
    const kL = easeInOut(aiK(run, 0, 0.3)), tap = 0.78, kRoom = easeInOut(aiK(run, 0.98, 1.28));
    let scr;
    if (run < 0.98) { const prevS = aiChatScreen({ who: 'ai', msgs: aiOldAI.concat([{ me: true, text: AI_Z1, time: '오전 2:07' }, { me: false, ai: true, text: AI_A1, bars: 12, time: '오전 2:07' }]), time: '2:07' }).svg;
      scr = `<g transform="translate(${f1(444 * kL)} 0)">${prevS}</g><g transform="translate(${f1(-444 * (1 - kL))} 0)">${aiListScreen({ time: '2:07', press: run > tap ? AI_TROW : -1 })}</g>`; }
    else { const kb = easeInOut(aiK(run, 1.5, 1.8));
      const room = aiChatScreen({ who: 'tae', msgs: AI_TOLD, kb, time: '2:07' }).svg;
      scr = `<g transform="translate(${f1(-444 * kRoom)} 0)">${aiListScreen({ time: '2:07', press: AI_TROW })}</g><g transform="translate(${f1(444 * (1 - kRoom))} 0)">${room}</g>`; }
    return aiPov(t, { screen: scr, cam: qLerpCam(run / 2.3, [960, 470, 1.26], [960, 520, 1.3]) });
  }
  const tAns = ph === 1 ? gfW(a, ['답은'], 4.6) - 0.15 : -1;
  if (ph === 1 && lt < tAns) {
    // 같은 문장이 붙여넣어짐(입력칸 반짝) → '보냈습니다'에 전송, 숫자 1이 남는다
    const tPaste = 0.35, tSend = gfW(a, ['보냈'], 3.6);
    const typed = lt < tPaste ? '' : lt < tSend ? AI_Z1 : '', kSent = aiK(lt, tSend, tSend + 0.18), kb = lt < tSend + 0.1 ? 1 : 1 - easeInOut(aiK(lt, tSend + 0.1, tSend + 0.4));
    const msgs = AI_TOLD.concat([{ date: '오늘' }]); if (lt >= tSend) msgs.push({ me: true, text: AI_Z1, time: '오전 2:08', unread: true, k: kSent });
    const S = aiChatScreen({ who: 'tae', msgs, typed, kb, time: lt < tSend ? '2:07' : '2:08', flash: ACT.pulse(lt, tPaste, 0.4) });
    return aiPov(t, { screen: S.svg, cam: qLerpCam(lt / tAns, [960, 520, 1.3], [960, 640, 1.38]) });
  }
  // 몽타주: n2 '답은'부터 s3 끝까지
  const n2 = TL.lines.find(l => l.id === 'n2'), s3 = TL.lines.find(l => l.id === 's3'), wa = (n2.words || []).find(w => w.w.includes('답은')), st = n2.t0 - 0.15 + (wa ? wa.t : 4.6);
  return aiLapse(t, t - st, s3.t1 - st);
}

/* =========== 4. 띵! → 태호 답장 → 장문 vs 한 줄 =========== */
const AI_T1 = 'ㅋㅋ 그 부장 원래 그래. 치킨 ㄱ?';
function aireplyScene(t, lt, a) {
  const ph = a.ph, run = a._run;
  const tMsgs = (k) => AI_TOLD.concat([{ date: '오늘' }, { me: true, text: AI_Z1, time: '오전 2:08' }, { me: false, text: AI_T1, time: '오전 5:12', k }, { me: false, emoji: 'chicken', k }]);
  if (ph === 0 && run < 0.78) {
    // 띵(진동) → 벌떡: 눈 번쩍, 몸이 늘었다 돌아옴, 무릎의 폰을 들어 올림
    const j = A2.spring(run, 0.08, 3.2, 0.3), wake = run > 0.08, up = easeOut(aiK(run, 0.12, 0.4)), hy = lerp(420, 378, up);
    const face = { eyes: { open: wake ? 1 : 0, size: wake ? 1.25 - 0.2 * aiK(run, 0.3, 0.7) : 1 }, brow: { raise: wake ? 14 : 0 }, mouth: wake ? { v: ACT.VIS.O, o: 0.7 } : { v: ACT.VIS.M, o: 0, c: -1 }, blush: 0.25 };
    const zero = aiBedZero('_ai3', t, face, { look: [0, 0.7], headDy: wake ? -6 * j : 12, tilt: wake ? 0 : 7, sy: 1 + 0.07 * j, pose: A2.pose({ hL: [173, hy], hR: [227, hy] }) });
    const cam = qLerpCam(run / 0.6, [1240, 760, 1.56], [1060, 730, 1.85]), buzz = run < 0.5 ? Math.sin(run * 90) * 4 : 0;
    const kD = ACT.symK(run, 0.06, 0.7), kE = ACT.symK(run, 0.12, 0.7);
    const fxs = (kD > 0.01 ? `<g transform="translate(1110 860) rotate(-8) scale(${f1(kD * 100) / 100})">${fT(0, 0, '띵!', 62, '#FFE34D', { stroke: INK, sw: 10 })}</g>` : '') +
      (kE > 0.01 ? `<g transform="translate(1090 560) rotate(12) scale(${f1(kE * 100) / 100})">${fT(0, 0, '!', 96, '#fff', { stroke: INK, sw: 12 })}</g>` : '');
    return aiDefs() + gfDefs() + qDefs() + `<g transform="translate(${f1(buzz)} 0)">` + qPlate('ainight', cam, 0.45) + qCam(cam, aiBedBack() + zero + aiBlanketFront(885) + aiBedFrame() + aiClock('05:12', { big: true })) + aiNightTint(1) + qCam(cam, aiFaceGlow(955, 700, 1) + fxs) + `</g>`;
  }
  if (ph === 0 || ph === 1) {
    const k = ph === 0 ? easeOutBack(aiK(run, 0.82, 1.05)) : 1, D = a._dur || 3.2;
    const S = aiChatScreen({ who: 'tae', msgs: tMsgs(k), kb: 0, time: '5:12' });
    const cam = ph === 0 ? [960, 560, 1.28] : qLerpCam(lt / D, [960, 560, 1.28], [960, 700, 1.48]);
    return aiPov(t, { screen: S.svg, cam });
  }
  // ph2(s5): 나란히 비교(기기 없이 말풍선만): 왼쪽 AI 장문은 끝없이 내려가고, 오른쪽 태호는 한 줄 + 닭다리
  const run2 = lt - 0.15, unroll = easeInOut(aiK(run2, 0.05, 1.3)), kR = easeOutBack(aiK(run2, 0.35, 0.6)), kC = easeOutBack(aiK(run2, 0.55, 0.8));
  let g = `<rect x="-300" y="-200" width="2600" height="1500" fill="#1B2448"/><line x1="960" y1="-200" x2="960" y2="1400" stroke="#3B4C86" stroke-width="6" stroke-dasharray="20 18"/>`;
  g += aiStar(220, 120, 46) + fT(282, 140, 'AI', 58, '#fff', { anchor: 'start' }) + `<g transform="translate(560 116)">${label(0, 0, '답장 1초', { size: 38, bg: '#BFE3FF' })}</g>`;
  const LW = 700, lx = 140, lH = lerp(200, 1500, unroll);
  g += `<rect x="${lx}" y="200" width="${LW}" height="${f1(lH)}" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
  aiWrap(AI_A1, 14).forEach((l, i) => { g += fT(lx + 36, 270 + i * 60, l, 44, INK, { anchor: 'start', w: 700 }); });
  const nL = aiWrap(AI_A1, 14).length;
  for (let b = 0; b < 26; b++) { const y = 270 + 60 * nL + b * 52; if (y > 200 + lH - 30) break; g += `<rect x="${lx + 36}" y="${y - 22}" width="${f1((LW - 72) * (b % 5 === 4 ? 0.45 : 0.7 + 0.3 * hash(b * 7 + 3)))}" height="22" rx="11" fill="#D5DAE2"/>`; }
  g += aiAvT(1040, 120, 46) + fT(1102, 140, '태호', 58, '#fff', { anchor: 'start' }) + `<g transform="translate(1430 116)">${label(0, 0, '답장 3시간', { size: 38, bg: '#FFE14A' })}</g>`;
  if (kR > 0.01) g += `<g transform="translate(1000 200) scale(${f1(kR * 100) / 100})"><rect x="0" y="0" width="${f1(aiTW(AI_T1, 44) + 72)}" height="96" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>${fT(36, 64, AI_T1, 44, INK, { anchor: 'start', w: 700 })}</g>`;
  if (kC > 0.01) g += `<g transform="translate(1000 320) scale(${f1(kC * 100) / 100})"><rect x="0" y="0" width="170" height="140" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>${aiChicken(88, 72, 1.25)}</g>`;
  const cam = qLerpCam(run2 / 1.9, [960, 455, 1.24], [960, 490, 1.27]);
  return aiDefs() + gfDefs() + qCam(cam, g);
}

/* =========== 5. 어이없음 → 절레절레 → AI 창으로 돌아가 뿌듯 =========== */
function aideadScene(t, lt, a) {
  const ph = a.ph, run = a._run;
  if (ph === 0) {
    const face = { eyes: { flat: 0.5, hl: false, open: 1 - ACT.blinks(run, [0.4, 0.85], 0.4), size: 0.97 }, brow: { asymR: 12 * ACT.pulse(run, 0.9, 0.3) }, mouthPath: 'M184 238 L216 238', blush: 0.15 };
    const zero = aiBedZero('_ai4', t, face, { look: [0, 0.75] });
    const cam = qLerpCam(run / 1.1, [960, 690, 2.1], [960, 690, 2.2]);
    return aiDefs() + gfDefs() + qDefs() + qPlate('ainight', cam, 0.45, { blur: true }) + qCam(cam, aiBedBack() + zero + aiBlanketFront(885) + aiBedFrame()) + aiNightTint(1) + qCam(cam, aiFaceGlow(955, 700, 0.9));
  }
  const D = a._dur || 3.4, tAI = gfW(a, ['AI', '에이'], 1.7), shake = lt > 0.15 && lt < 1.3 ? Math.sin((lt - 0.15) * 15) * 9 * (1 - aiK(lt, 0.9, 1.3)) : 0, proud = easeInOut(aiK(lt, tAI - 0.2, tAI + 0.5));
  const mouth = gfMouth(t, { v: ACT.VIS.M, o: 0, c: lerp(-1, 5, proud) }, lerp(-1, 4, proud));
  const face = { eyes: { flat: lerp(0.45, 0.1, proud), open: 1 - ACT.blinks(lt, [1.4], 0.18), squint: 0.35 * proud }, brow: { worry: 0.3 * (1 - proud) }, mouth, blush: 0.2 + 0.35 * proud };
  const look = lt < 1.3 ? [Math.sin((lt - 0.15) * 15) * 0.6, 0.5] : [0, 0.8];
  const zero = aiBedZero('_ai5', t, face, { look, tilt: shake, headDy: -4 * proud });
  const cam = qLerpCam(lt / D, [960, 690, 2.2], [960, 700, 2.35]);
  return aiDefs() + gfDefs() + qDefs() + qPlate('ainight', cam, 0.45, { blur: true }) + qCam(cam, aiBedBack() + zero + aiBlanketFront(885) + aiBedFrame()) + aiNightTint(1) + qCam(cam, aiFaceGlow(955, 700, 0.95 + 0.1 * proud));
}

/* =========== 6. 요즘 사람들(지하철·사무실·카페): 모두 폰 뒷면 + 푸른 빛 =========== */
// 화면 빛을 받는 사람(폰 뒷면). 작은 말풍선(별 아이콘)이 폰 위에서 깜빡
const AI_SPEC = `<g fill="none" stroke="${INK}" stroke-width="7"><circle cx="165" cy="190" r="27"/><circle cx="235" cy="190" r="27"/><path d="M192 188 Q200 182 208 188"/></g>`;
function aiCrowdP(key, t, x, y, s, o) {
  const nod = Math.max(0, Math.sin(t * 3.1 + o.seed)) * 6;
  const face = { eyes: { open: 1 - ACT.natBlink(t, o.seed), squint: 0.3, size: 0.95 }, brow: { worry: 0.15 }, mouth: { v: ACT.VIS.M, o: 0, c: 3 }, blush: 0.3, fx: o.glasses ? AI_SPEC : '' };
  const p = gfP(key, face, Object.assign({ x, y, s, t, seed: o.seed, pose: A2.pose({ hL: [173, 378], hR: [227, 378] }), look: [0.05, 0.8], headDy: nod, holdL: { svg: AI_PHB, rot: 0 }, handL: 'grip', handR: 'grip', vshade: 'rgba(0,0,0,0.18)' }, o));
  const pop = 1 + 0.06 * Math.sin(t * 4 + o.seed);
  const bub = `<g transform="translate(${f1(x + 165 * s)} ${f1(y - 560 * s)}) scale(${f1(s * 1.15 * pop * 100) / 100})"><path d="M-62 -40 Q-62 -60 -42 -60 L42 -60 Q62 -60 62 -40 L62 10 Q62 30 42 30 L-20 30 L-44 54 L-36 30 L-42 30 Q-62 30 -62 10Z" fill="#fff" stroke="${INK}" stroke-width="6"/>${aiStar(0, -15, 26)}</g>`;
  return { svg: p + bub, glow: aiFaceGlow(x, y - 380 * s, 1, 0.62 * s) };
}
function aicrowdScene(t, lt, a) {
  const t2 = gfW(a, ['친구보다'], 2.8) - 0.2, t3 = gfW(a, ['마음을'], 5.0) - 0.45;
  if (lt < t2) {
    const cam = qLerpCam(lt / t2, [990, 700, 1.42], [990, 710, 1.5]);
    const A = aiCrowdP('_ac1', t, 690, 1180, 1.3, { seed: 3, vest: '#4E8F6A', hair: '#3B2A20', glasses: true }), B = aiCrowdP('_ac2', t, 1290, 1180, 1.3, { seed: 7, vest: '#D9776B', hair: '#2A1E18', longHair: '#2A1E18', lashes: true });
    return aiDefs() + gfDefs() + qDefs() + qPlate('aisubway', cam, 0.5, { blur: true }) + qCam(cam, A.svg + B.svg) + fFull('#0A1238', 0.14) + qCam(cam, A.glow + B.glow);
  }
  if (lt < t3) {
    const u = lt - t2, cam = qLerpCam(u / (t3 - t2), [960, 700, 1.42], [960, 710, 1.5]);
    const A = aiCrowdP('_ac3', t, 960, 1180, 1.3, { seed: 11, vest: '#F2F4F7', vshade: 'rgba(0,0,0,0.12)', hair: '#4A3A2E', collar: true, tie: '#3D5A80' });
    return aiDefs() + gfDefs() + qDefs() + qPlate('aioffice', cam, 0.5, { blur: true }) + qCam(cam, A.svg) + qCam(cam, A.glow);
  }
  const u = lt - t3, D = (a._dur || 6.6) - t3, cam = qLerpCam(u / D, [1040, 700, 1.42], [1050, 710, 1.5]);
  const A = aiCrowdP('_ac4', t, 1080, 1180, 1.3, { seed: 17, vest: '#E8C15A', hair: '#6A4A30', longHair: '#6A4A30', lashes: true, glasses: true });
  // 카페 탁자: 윗면 가장자리와 컵만(앞쪽은 화면 아래로 이어짐)
  const table = `<path d="M560 1000 Q1050 960 1560 1000 L1600 1400 L520 1400 Z" fill="#6E4626"/><path d="M560 1000 Q1050 960 1560 1000" fill="none" stroke="${INK}" stroke-width="9"/><path d="M570 1012 Q1050 974 1550 1012" fill="none" stroke="#9A6A40" stroke-width="10"/>` +
    `<g transform="translate(1330 990)"><rect x="-30" y="-66" width="60" height="66" rx="9" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M30 -50 Q54 -46 52 -26 Q50 -12 30 -14" fill="none" stroke="${INK}" stroke-width="7"/><path d="M-12 -80 Q-5 -94 -12 -108 M10 -80 Q17 -94 10 -108" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/></g>`;
  return aiDefs() + gfDefs() + qDefs() + qPlate('aicafe', cam, 0.5, { blur: true }) + qCam(cam, A.svg + table) + qCam(cam, A.glow);
}
