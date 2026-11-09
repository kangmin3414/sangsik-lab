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
  if (it.date) return `<g opacity="${op}"><rect x="-80" y="${f1(y)}" width="160" height="40" rx="20" fill="#C9D1DC"/>${fT(0, y + 28, it.date, 20, '#fff', { w: 700 })}</g>`;
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
  if (it.time) g += fT(me ? x0 - 8 : x0 + it.w + 8, y + it.h - 4, it.time, 17, '#8A93A3', { anchor: me ? 'end' : 'start', w: 600 });
  if (it.unread) g += fT(x0 - 8, y + it.h - 26, '1', 21, '#E8A21A', { anchor: 'end', w: 900 });
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
const AI_ROWS = [{ n: 'AI', p: '언제든 이야기해 주세요.', t: '오전 2:07', av: 'ai' }, { n: '태호', p: 'ㅇㅇ 고마움', t: '3월 2일', av: 'tae' }, { n: '엄마', p: '밥은 먹었니?', t: '어제', av: ['엄', '#E58FA5'] },
  { n: '팀 공지방', p: '내일 회의 9시입니다', t: '어제', av: ['팀', '#7B8AA8'] }, { n: '헬스장', p: '회원권 만료 안내', t: '월요일', av: ['헬', '#E0A458'] }];
function aiListScreen(o) {
  let g = `<rect x="-222" y="-440" width="444" height="880" fill="#fff"/>` + aiStatus(o.time) + fT(-196, -340, '채팅', 38, INK, { anchor: 'start', w: 900 });
  AI_ROWS.forEach((r, i) => { const y = -290 + i * 104;
    if (o.press === i) g += `<rect x="-222" y="${y - 6}" width="444" height="104" fill="#E3E8F0"/>`;
    g += (r.av === 'ai' ? aiStar(-166, y + 46, 34) : r.av === 'tae' ? aiAvT(-166, y + 46, 34) : aiAv(-166, y + 46, 34, r.av[0], r.av[1])) +
      fT(-116, y + 36, r.n, 28, INK, { anchor: 'start', w: 800 }) + fT(-116, y + 74, r.p, 22, '#7A8394', { anchor: 'start', w: 500 }) + fT(204, y + 34, r.t, 18, '#9AA3B2', { anchor: 'end', w: 600 }); });
  return g;
}

/* ---------- 제로 시점(POV): 이불 속, 두 손 + 폰 ---------- */
// 이불 텐트(화면 가장자리 주름, 폰 빛을 받음)
const aiTent = glow => { const hi = f1(glow * 0.75 * 100) / 100;
  return `<path d="M-300 -200 L2300 -200 L2300 70 Q1650 -30 960 70 Q280 -30 -300 70 Z" fill="#18204A" stroke="${INK}" stroke-width="9"/>` +
    `<path d="M-300 -200 Q190 260 110 720 Q60 1010 -300 1400 Z" fill="#141B3E" stroke="${INK}" stroke-width="9"/><path d="M2300 -200 Q1730 260 1810 720 Q1860 1010 2300 1400 Z" fill="#141B3E" stroke="${INK}" stroke-width="9"/>` +
    `<g fill="none" stroke="#5D72B8" stroke-width="12" stroke-linecap="round" opacity="${hi}"><path d="M120 120 Q260 380 200 700"/><path d="M1800 120 Q1660 380 1720 700"/><path d="M420 40 Q960 110 1500 40"/></g>`; };
// o: { screen(svg, 화면 좌표), thumbs: [[lx,ly],[rx,ry]](화면 좌표, 엄지 끝), glow, py, rot, zoom }
function aiPov(t, o) {
  GF_SLEEVE = AI_HD;
  const PY = o.py || 548, R = o.rot == null ? -3 : o.rot, glow = o.glow == null ? 1 : o.glow;
  let g = `<rect x="-300" y="-200" width="2600" height="1500" fill="url(#aiDark)"/>` + aiTent(glow) +
    `<ellipse cx="960" cy="${PY}" rx="760" ry="700" fill="url(#aiGlow)" opacity="${f1(0.42 * glow * 100) / 100}"/>`;
  const [[lx, ly], [rx, ry]] = o.thumbs || [[-196, 392], [196, 392]];
  const LH = [-262, 318], RH = [262, 318];
  g += `<g transform="translate(960 ${PY}) rotate(${R})"><rect x="-250" y="-470" width="500" height="940" rx="56" fill="#22262E" stroke="${INK}" stroke-width="10"/>` +
    `<g clip-path="url(#aiScr)">${o.screen}</g><rect x="-222" y="-440" width="444" height="880" rx="34" fill="none" stroke="#11141A" stroke-width="3"/>` +
    gfPovHand(-760, 1000, LH[0], LH[1], 84) + gfPovHand(760, 1000, RH[0], RH[1], 84) + gfPovFinger(LH[0] + 20, LH[1] - 24, lx, ly, 50) + gfPovFinger(RH[0] - 20, RH[1] - 24, rx, ry, 50) + `</g>`;
  const cam = o.cam || [960, 560, 1.0];
  return aiDefs() + gfDefs() + qCam(cam, g);
}
// 타이핑 엄지: i번째 글자를 칠 때 번갈아. 반환 [[왼],[오]], press
function aiTypeThumbs(lt, times) {
  let L = [-196, 392], R = [196, 392], press = null;
  const i = times.findIndex((x, j) => lt >= x && (j === times.length - 1 || lt < times[j + 1]));
  const rest = (side) => side ? [150, 300] : [-150, 300];
  L = rest(0); R = rest(1);
  if (i >= 0) { const r = Math.floor(hash(i * 3 + 1) * 3), hn = Math.ceil(AI_KR[r].length / 2), c = Math.floor(hash(i * 7 + 2) * hn) + (i % 2 ? AI_KR[r].length - hn : 0), [kx, ky] = aiKeyPos(r, c), dip = ACT.pulse(lt, times[i], 0.12);
    const pt = [kx + 6, ky + 4 + 10 * (1 - dip)]; if (i % 2) R = pt; else L = pt; if (lt < times[i] + 0.09) press = [r, c];
    const j = i + 1; if (j < times.length) { const r2 = Math.floor(hash(j * 3 + 1) * 3), hn2 = Math.ceil(AI_KR[r2].length / 2), c2 = Math.floor(hash(j * 7 + 2) * hn2) + (j % 2 ? AI_KR[r2].length - hn2 : 0), p2 = aiKeyPos(r2, c2), hv = [p2[0] + 6, p2[1] + 18]; if (j % 2) R = hv; else L = hv; } }
  return { thumbs: [L, R], press };
}
const aiOldAI = [{ date: '오늘' }, { me: false, ai: true, text: '안녕하세요, 제로님. 무엇이든 이야기해 주세요.', time: '오전 2:01' }];
const AI_Z1 = '오늘 진짜 억울해… 다 그만두고 싶다.';
const AI_A1 = '제로님, 오늘 정말 많이 힘드셨겠어요. 그건 절대 제로님 잘못이 아니에요.';

/* =========== 0. 이불 덩어리 + 새어 나오는 푸른 빛 =========== */
function aiBedBack() {
  return `<rect x="600" y="688" width="720" height="320" rx="28" fill="#6B5848" stroke="${INK}" stroke-width="9"/><rect x="630" y="716" width="660" height="40" rx="12" fill="#7D6957"/>` +
    `<path d="M640 860 L1280 860 L1405 1004 L515 1004 Z" fill="#E6E1D6" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>` +
    `<rect x="815" y="780" width="290" height="104" rx="48" fill="#DCE3EE" stroke="${INK}" stroke-width="8"/>`;
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
// 이불 두건(머리 위로 덮은 이불) 뒷면/앞테. 제로 로컬 좌표(머리 가운데 200,170)
const aiHoodBack = (X, Y, S, c = AI_BL) => `<g transform="translate(${f1(X)} ${f1(Y)}) scale(${S}) translate(-200 -560)"><path d="M26 700 Q14 330 66 176 Q116 34 200 30 Q284 34 334 176 Q386 330 374 700 Z" fill="${c}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/></g>`;
const aiHoodRim = (X, Y, S, c = AI_BL, tilt = 0, dy = 0) => `<g transform="translate(${f1(X)} ${f1(Y)}) scale(${S}) translate(-200 -560) translate(0 ${f1(dy)}) rotate(${f1(tilt)} 200 330)"><path d="M78 226 Q62 44 200 38 Q338 44 322 226 Q312 116 200 100 Q88 116 78 226 Z" fill="${c}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>` +
  `<path d="M120 84 Q200 62 280 84" fill="none" stroke="${AI_BL2}" stroke-width="8" stroke-linecap="round"/></g>`;
// 침대 위 제로(두건 이불 + 폰 뒷면). face: ACT.face 옵션, o: { pose, look, glow, headDy, tilt, sy, noPhone, x, y, s }
function aiBedZero(key, t, face, o = {}) {
  const X = o.x || AB.X, Y = o.y || AB.Y, S = o.s || AB.S;
  const pose = o.pose || A2.pose({ hL: [178, 352], hR: [222, 362] });
  const zero = gfZero(key, face, { t, x: X, y: Y, s: S, pose, look: o.look, vest: AI_HD, vshade: 'rgba(30,40,70,0.22)', headDy: o.headDy || 0, tilt: o.tilt || 0, sy: o.sy, sx: o.sx,
    holdL: o.noPhone ? undefined : { svg: GF_PHBACK, rot: -8 }, handL: o.noPhone ? undefined : 'grip' });
  return aiHoodBack(X, Y, S) + zero + aiHoodRim(X, Y, S, AI_BL, o.tilt || 0, o.headDy || 0);
}
// 폰 화면 빛(얼굴·가슴). 장면 마지막에 screen 합성
const aiFaceGlow = (x, y, k, r = 1) => k > 0.01 ? `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(300 * r)}" ry="${f1(270 * r)}" fill="url(#aiGlow)" opacity="${f1(0.85 * k * 100) / 100}" style="mix-blend-mode:screen"/>` : '';
const aiNightTint = (k = 1) => fFull('#0A1238', 0.34 * k);

function aibedScene(t, lt, a) {
  const run = a._run, br = Math.sin(run * 2.4) * 6, fl = 0.75 + 0.25 * Math.sin(run * 23) * Math.sin(run * 7.3);
  const cam = qLerpCam(run / 1.3, [1010, 640, 1.02], [1000, 760, 1.3]);
  // 이불 덩어리(제로가 통째로 들어가 있음)
  const lump = `<path d="M600 ${930 - br} Q640 ${760 - br} 820 ${742 - br} Q900 ${700 - br} 1010 ${716 - br} Q1180 ${730 - br} 1270 ${830 - br} Q1340 ${880} 1410 1000 Q1440 1090 1386 1102 Q960 1124 534 1102 Q474 1090 494 1010 Q520 960 600 ${930 - br} Z" fill="${AI_BL}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>` +
    `<g fill="none" stroke="#3E4A72" stroke-width="7" stroke-linecap="round" opacity=".7"><path d="M780 ${770 - br} Q850 900 760 1060"/><path d="M1120 ${740 - br} Q1100 880 1220 1070"/></g>`;
  // 이불 틈(베개 쪽)에서 새어 나오는 빛
  const leak = `<path d="M790 ${800 - br} Q860 ${780 - br} 930 ${792 - br}" fill="none" stroke="#BDE6FF" stroke-width="${f1(6 + 4 * fl)}" stroke-linecap="round" opacity="${f1(0.9 * fl * 100) / 100}"/>` +
    `<ellipse cx="860" cy="${770 - br}" rx="220" ry="120" fill="url(#aiGlow)" opacity="${f1(0.9 * fl * 100) / 100}" style="mix-blend-mode:screen"/>`;
  const w = qPlate('ainight', cam, 0.5) + qCam(cam, aiBedBack() + lump + aiBedFrame() + aiClock('02:07')) + aiNightTint(1) + qCam(cam, leak);
  return aiDefs() + gfDefs() + qDefs() + w;
}

/* =========== 1. 제로 시점: AI에게 타이핑 → 전송 → 1초 만의 장문 답장 =========== */
function aiphoneScene(t, lt, a) {
  const ph = a.ph, run = a._run;
  if (ph === 0) {
    // 말에 맞춰 한 글자씩(목소리 시작 0.05 ~ 끝 -0.2)
    const D = a._dur || 4.2, n = AI_Z1.length, times = [...Array(n)].map((_, i) => 0.05 + (D - 0.3) * i / n).filter((_, i) => AI_Z1[i] !== ' ');
    const typedN = Math.round(n * clamp((lt - 0.05) / (D - 0.3), 0, 1)), typed = AI_Z1.slice(0, typedN);
    const { thumbs, press } = aiTypeThumbs(lt, times.slice(0, Math.max(0, times.length)));
    const S = aiChatScreen({ who: 'ai', msgs: aiOldAI, typed, kb: 1, press, caret: Math.floor(lt * 2.4) % 2 === 0, time: '2:07' });
    return aiPov(t, { screen: S.svg, thumbs, cam: qLerpCam((lt - 0.4) / (D - 1.2), [960, 430, 1.28], [960, 560, 1.38]) });
  }
  const sent = { me: true, text: AI_Z1, time: '오전 2:07' };
  if (ph === 1) {
    const run = lt - 0.15;
    // 0.18 전송 → 0.4~0.7 점 세 개 → 0.72 장문 답장
    const tap = 0.18, kSent = aiK(run, tap, tap + 0.18), kb = 1 - easeInOut(aiK(run, 0.28, 0.55)), dots = run > 0.4 && run < 0.72, kRep = aiK(run, 0.72, 0.86);
    const msgs = aiOldAI.concat([Object.assign({ k: kSent }, sent)]);
    if (dots) msgs.push({ me: false, ai: true, dots: true, ph: run });
    if (run >= 0.72) msgs.push({ me: false, ai: true, text: AI_A1, bars: 12, time: '오전 2:07', k: kRep });
    let scroll = null;
    if (run >= 0.72) { const L = aiLayout(msgs), last = L.items[L.items.length - 1], auto0 = Math.max(0, aiLayout(msgs.slice(0, -1)).H + 16 - 684); scroll = lerp(auto0, last.y - 10, easeInOut(aiK(run, 0.74, 1.05))); }
    const S = aiChatScreen({ who: 'ai', msgs, typed: run < tap ? AI_Z1 : '', kb, send: Math.abs(run - tap) < 0.07, time: '2:07', scroll });
    const toSend = easeInOut(aiK(run, 0, tap)), sendPt = [184 + 4, S.yIn + 50];
    const R = run < tap + 0.12 ? [lerp(150, sendPt[0], toSend), lerp(300, sendPt[1] + 10 * (1 - ACT.pulse(run, tap - 0.04, 0.14)), toSend)] : [lerp(sendPt[0], 196, aiK(run, tap + 0.12, 0.5)), lerp(sendPt[1], 392, aiK(run, tap + 0.12, 0.5))];
    return aiPov(t, { screen: S.svg, thumbs: [[lerp(-150, -196, aiK(run, 0.2, 0.5)), lerp(300, 392, aiK(run, 0.2, 0.5))], R], cam: qLerpCam(run / 1.1, [960, 560, 1.38], [960, 470, 1.3]) });
  }
  // ph2(a1): 답장을 읽는 동안 천천히 아래로 스크롤(오른손 엄지가 쓸어 올림)
  const msgs = aiOldAI.concat([sent, { me: false, ai: true, text: AI_A1, bars: 12, time: '오전 2:07' }]);
  const L = aiLayout(msgs), last = L.items[L.items.length - 1], D = a._dur || 6.4;
  const sw = [D - 1.6, D - 0.6], sc = last.y - 10 + sw.reduce((s, x) => s + 60 * easeInOut(aiK(lt, x, x + 0.5)), 0);
  const swipe = sw.map(x => aiK(lt, x - 0.05, x + 0.45)).find(k => k > 0 && k < 1);
  const R = swipe != null ? [120, lerp(260, 80, swipe)] : [196, 392];
  const S = aiChatScreen({ who: 'ai', msgs, kb: 0, time: '2:07', scroll: sc });
  return aiPov(t, { screen: S.svg, thumbs: [[-196, 392], R], cam: qLerpCam(lt / D, [960, 470, 1.3], [960, 430, 1.36]) });
}

/* =========== 2. 얼굴: 위로받은 얼굴 + 화내지도·졸지도·귀찮아하지도 ✕ =========== */
const aiEmo = (kind, x, y, r, kX, kIn) => {
  if (kIn <= 0.01) return '';
  const s = f1(easeOutBack(clamp(kIn, 0, 1)) * 100) / 100;
  let g = `<g transform="translate(${x} ${y}) scale(${s})"><circle r="${r}" fill="${kind === 'angry' ? '#FF8A65' : kind === 'sleep' ? '#9FC5F8' : '#C7CCD6'}" stroke="${INK}" stroke-width="7"/>`;
  if (kind === 'angry') g += `<path d="M-34 -22 L-10 -10 M34 -22 L10 -10" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><circle cx="-18" cy="2" r="6" fill="${INK}"/><circle cx="18" cy="2" r="6" fill="${INK}"/><path d="M-22 32 Q0 16 22 32" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`;
  else if (kind === 'sleep') g += `<path d="M-30 0 Q-18 10 -6 0 M6 0 Q18 10 30 0" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><ellipse cx="0" cy="26" rx="8" ry="10" fill="${INK}"/>` + fT(44, -34, 'z', 34, '#fff', { stroke: INK, sw: 5 });
  else g += `<path d="M-30 -2 L-8 -2 M8 -2 L30 -2" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M-16 28 L16 28" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M30 22 Q56 14 66 30 Q60 46 40 40" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
  if (kX > 0.01) { const d = 120, p1 = f1(d * clamp(kX * 2, 0, 1)), p2 = f1(d * clamp(kX * 2 - 1, 0, 1));
    g += `<g stroke-linecap="round"><path d="M-42 -42 L42 42" stroke="${INK}" stroke-width="30" stroke-dasharray="${p1} 200"/><path d="M-42 -42 L42 42" stroke="#E5484D" stroke-width="18" stroke-dasharray="${p1} 200"/>` +
      `<path d="M42 -42 L-42 42" stroke="${INK}" stroke-width="30" stroke-dasharray="${p2} 200"/><path d="M42 -42 L-42 42" stroke="#E5484D" stroke-width="18" stroke-dasharray="${p2} 200"/></g>`; }
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
  const W = qPlate('ainight', cam, 0.45, { blur: true }) + qCam(cam, aiBedBack() + zero + aiBlanketFront(905) + aiBedFrame() + aiClock('02:07')) + aiNightTint(1) + qCam(cam, aiFaceGlow(955, 700, 0.9 + 0.08 * Math.sin(lt * 9)));
  return aiDefs() + gfDefs() + qDefs() + W + ov;
}

/* =========== 3. 태호에게도 보냄 → 세 시간(몽타주) =========== */
const AI_TOLD = [{ date: '3월 2일' }, { me: true, text: '생일 축하한다', time: '오후 9:12' }, { me: false, text: 'ㅇㅇ 고마움', time: '오후 11:40' }];
// 침대 몽타주(세 시간): u = 몽타주 시작 뒤 시간, U = 전체 길이
function aiLapse(t, u, U) {
  const k = clamp(u / U, 0, 1), mins = Math.round(lerp(2 * 60 + 8, 5 * 60 + 12, Math.pow(k, 0.9))), clk = `0${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;
  // 박자: 폰 확인(빛 켜짐/꺼짐) → 천장 보기 → 양 세기 → 꾸벅
  const B = [0, U * 0.22, U * 0.42, U * 0.66, U];
  const glow = u < B[1] ? ((u % 0.5) < 0.32 ? 1 : 0) : 0, stare = u >= B[1] && u < B[2], sheep = u >= B[2] && u < B[3], doze = u >= B[3];
  const dozeK = easeInOut(aiK(u, B[3], B[3] + 0.6)), nod = doze ? 10 * Math.max(0, Math.sin((u - B[3]) * 5)) : 0;
  const face = { eyes: { open: doze ? lerp(0.55, 0, dozeK) : sheep ? 0.6 - 0.15 * Math.sin(u * 3) : 1 - ACT.natBlink(u, 44), flat: sheep ? 0.4 : 0.15, size: stare ? 1.05 : 1 }, brow: { worry: 0.4 }, mouth: { v: ACT.VIS.M, o: 0, c: -1 }, blush: 0.2,
    hfx: tt => doze ? `<g opacity="${f1(dozeK * 100) / 100}">${fT(330 + Math.sin(u * 2) * 6, 70 - (u * 40) % 40, 'z', 48, '#fff', { stroke: INK })}${fT(366, 24 - (u * 40 + 20) % 40, 'z', 36, '#fff', { stroke: INK })}</g>` : '' };
  const look = u < B[1] ? [0, 0.8] : stare ? [0.1, -1] : sheep ? [lerp(-0.8, 0.8, ((u - B[2]) / 0.55) % 1), -0.8] : [0, 0.6];
  const zero = aiBedZero('_ai2', t, face, { look, headDy: 26 * dozeK + nod, tilt: 8 * dozeK });
  let sh = '';
  if (sheep) for (let i = 0; i < 4; i++) { const s0 = B[2] + i * 0.55, q = (u - s0) / 0.8; if (q > 0 && q < 1) sh += aiSheep(lerp(740, 1190, q), 600 - 150 * Math.sin(q * Math.PI), 1.15, lerp(-14, 14, q)); }
  const cam = qLerpCam(u / U, [1220, 740, 1.48], [1240, 760, 1.56]);
  const ff = `<g transform="translate(150 140)" opacity=".92"><path d="M-40 -30 L0 0 L-40 30 Z M0 -30 L40 0 L0 30 Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></g>`;
  return aiDefs() + gfDefs() + qDefs() + qPlate('ainight', cam, 0.45) + qCam(cam, aiBedBack() + zero + aiBlanketFront(905) + aiBedFrame() + aiClock(clk, { big: true }) + sh) + aiNightTint(1) +
    qCam(cam, aiFaceGlow(955, 700, glow * 0.9)) + ff;
}
function aisendScene(t, lt, a) {
  const ph = a.ph, run = a._run;
  if (ph === 0) {
    // 목록으로 → '태호' 누름 → 태호 방(오래된 대화) → 자판 → 입력칸 꾹 → 붙여넣기
    const kL = easeInOut(aiK(run, 0, 0.3)), tap = 0.78, kRoom = easeInOut(aiK(run, 0.98, 1.28));
    let scr;
    if (run < 0.98) { const prevS = aiChatScreen({ who: 'ai', msgs: aiOldAI.concat([{ me: true, text: AI_Z1, time: '오전 2:07' }, { me: false, ai: true, text: AI_A1, bars: 12, time: '오전 2:07' }]), time: '2:07' }).svg;
      scr = `<g transform="translate(${f1(444 * kL)} 0)">${prevS}</g><g transform="translate(${f1(-444 * (1 - kL))} 0)">${aiListScreen({ time: '2:07', press: run > tap && run < tap + 0.2 ? 1 : -1 })}</g>`; }
    else { const kb = easeInOut(aiK(run, 1.4, 1.7));
      const room = aiChatScreen({ who: 'tae', msgs: AI_TOLD, kb, time: '2:07', paste: easeOutBack(aiK(run, 2.0, 2.22)) }).svg;
      scr = `<g transform="translate(${f1(-444 * kRoom)} 0)">${aiListScreen({ time: '2:07', press: 1 })}</g><g transform="translate(${f1(444 * (1 - kRoom))} 0)">${room}</g>`; }
    const row = [-60, -290 + 104 + 46], mv = easeInOut(aiK(run, 0.35, tap)), dip = ACT.pulse(run, tap - 0.03, 0.16);
    let R = run < 1.0 ? [lerp(196, row[0], mv), lerp(392, row[1] + 8 * (1 - dip) + 10, mv)] : [lerp(row[0], 196, aiK(run, 1.0, 1.3)), lerp(row[1], 392, aiK(run, 1.0, 1.3))];
    const inY = 440 - 300 - 37;
    if (run > 1.6) R = [lerp(196, -60, easeInOut(aiK(run, 1.6, 1.85))), lerp(392, inY + 8, easeInOut(aiK(run, 1.6, 1.85)))];
    return aiPov(t, { screen: scr, thumbs: [[-196, 392], R], cam: qLerpCam(run / 2.3, [960, 470, 1.26], [960, 520, 1.3]) });
  }
  const tAns = ph === 1 ? gfW(a, ['답은'], 4.6) - 0.15 : -1;
  if (ph === 1 && lt < tAns) {
    // 붙여넣기 → (혹시 몰라…) → '보냈습니다'에 전송, 숫자 1이 남는다
    const tPaste = 0.35, tSend = gfW(a, ['보냈'], 3.6);
    const typed = lt < tPaste ? '' : lt < tSend ? AI_Z1 : '', kSent = aiK(lt, tSend, tSend + 0.18), kb = lt < tSend + 0.1 ? 1 : 1 - easeInOut(aiK(lt, tSend + 0.1, tSend + 0.4));
    const msgs = AI_TOLD.concat([{ date: '오늘' }]); if (lt >= tSend) msgs.push({ me: true, text: AI_Z1, time: '오전 2:08', unread: true, k: kSent });
    const S = aiChatScreen({ who: 'tae', msgs, typed, kb, time: lt < tSend ? '2:07' : '2:08', paste: lt < tPaste ? 1 - aiK(lt, tPaste - 0.08, tPaste) : 0, send: Math.abs(lt - tSend) < 0.07 });
    const pasteBtn = [-120, S.yIn - 44], sendPt = [188, S.yIn + S.yIn * 0 + 50];
    let R;
    if (lt < tPaste + 0.1) R = [lerp(-60, pasteBtn[0], aiK(lt, 0, tPaste - 0.05)), lerp(440 - 337 + 8, pasteBtn[1] + 6 * (1 - ACT.pulse(lt, tPaste - 0.05, 0.14)), aiK(lt, 0, tPaste - 0.05))];
    else if (lt < tSend + 0.15) { const mv = easeInOut(aiK(lt, tSend - 0.55, tSend - 0.05)), hes = lt < tSend - 0.55 ? 0 : 1; R = [lerp(150, sendPt[0], mv), lerp(300, sendPt[1] + 8 * (1 - ACT.pulse(lt, tSend - 0.04, 0.14)), mv)]; if (!hes) R = [lerp(pasteBtn[0], 150, aiK(lt, tPaste + 0.1, tPaste + 0.5)), lerp(pasteBtn[1], 300, aiK(lt, tPaste + 0.1, tPaste + 0.5))]; }
    else R = [lerp(sendPt[0], 196, aiK(lt, tSend + 0.15, tSend + 0.5)), lerp(sendPt[1], 392, aiK(lt, tSend + 0.15, tSend + 0.5))];
    return aiPov(t, { screen: S.svg, thumbs: [[-196, 392], R], cam: qLerpCam(lt / tAns, [960, 520, 1.3], [960, 640, 1.38]) });
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
    // 띵(진동) → 벌떡: 눈 번쩍, 몸이 늘었다 돌아옴
    const j = A2.spring(run, 0.08, 3.2, 0.3), wake = run > 0.08;
    const face = { eyes: { open: wake ? 1 : 0, size: wake ? 1.25 - 0.2 * aiK(run, 0.3, 0.7) : 1 }, brow: { raise: wake ? 14 : 0 }, mouth: wake ? { v: ACT.VIS.O, o: 0.7 } : { v: ACT.VIS.M, o: 0, c: -1 }, blush: 0.25,
      fx: tt => wake ? ACT.sym('burst', 330, 70, run, 0.1, 0.8) : '' };
    const zero = aiBedZero('_ai3', t, face, { look: [0, 0.7], headDy: wake ? -6 * j : 26, tilt: wake ? 0 : 8, sy: 1 + 0.07 * j });
    const cam = qLerpCam(run / 0.7, [1100, 720, 1.6], [1020, 700, 1.9]), buzz = run < 0.5 ? Math.sin(run * 90) * 4 : 0;
    return aiDefs() + gfDefs() + qDefs() + `<g transform="translate(${f1(buzz)} 0)">` + qPlate('ainight', cam, 0.45) + qCam(cam, aiBedBack() + zero + aiBlanketFront(905) + aiBedFrame() + aiClock('05:12', { big: true })) + aiNightTint(1) + qCam(cam, aiFaceGlow(955, 700, 1)) + `</g>` +
      (run > 0.06 && run < 0.7 ? fx(t, t - run + 0.06, t - run + 0.7, 1500, 300, '띵!', '#FFE34D', { size: 100, rot: 8 }) : '');
  }
  if (ph === 0 || ph === 1) {
    const k = ph === 0 ? easeOutBack(aiK(run, 0.82, 1.05)) : 1, D = a._dur || 3.2;
    const S = aiChatScreen({ who: 'tae', msgs: tMsgs(k), kb: 0, time: '5:12' });
    const cam = ph === 0 ? [960, 560, 1.28] : qLerpCam(lt / D, [960, 560, 1.28], [960, 700, 1.48]);
    return aiPov(t, { screen: S.svg, cam });
  }
  // ph2(s5): 나란히 비교(기기 없이 말풍선만): 왼쪽 AI 장문은 끝없이 내려가고, 오른쪽 태호는 한 줄
  const run2 = lt - 0.15, unroll = easeInOut(aiK(run2, 0.05, 1.3)), kR = easeOutBack(aiK(run2, 0.45, 0.7));
  let g = `<rect x="-300" y="-200" width="2600" height="1500" fill="#1B2448"/><line x1="960" y1="-200" x2="960" y2="1400" stroke="#3B4C86" stroke-width="6" stroke-dasharray="20 18"/>`;
  // 왼쪽
  g += aiStar(330, 150, 46) + fT(400, 168, 'AI', 54, '#fff', { anchor: 'start' }) + `<g transform="translate(560 124)">${label(0, 0, '답장 1초', { size: 34, bg: '#BFE3FF' })}</g>`;
  const LW = 640, lx = 170, lH = lerp(180, 1500, unroll);
  g += `<rect x="${lx}" y="230" width="${LW}" height="${f1(lH)}" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>`;
  aiWrap(AI_A1, 16).forEach((l, i) => { g += fT(lx + 34, 300 + i * 56, l, 40, INK, { anchor: 'start', w: 700 }); });
  for (let b = 0; b < 26; b++) { const y = 300 + 56 * 3 + b * 50; if (y > 230 + lH - 30) break; g += `<rect x="${lx + 34}" y="${y - 6}" width="${f1((LW - 68) * (b % 5 === 4 ? 0.45 : 0.7 + 0.3 * hash(b * 7 + 3)))}" height="20" rx="10" fill="#D5DAE2"/>`; }
  g += `<rect x="${lx + LW - 26}" y="250" width="12" height="${f1(Math.max(40, lH - 40))}" rx="6" fill="#E6E9EF"/><rect x="${lx + LW - 26}" y="250" width="12" height="40" rx="6" fill="#9AA3B2"/>`;
  // 오른쪽
  g += aiAvT(1150, 150, 46) + fT(1220, 168, '태호', 54, '#fff', { anchor: 'start' }) + `<g transform="translate(1470 124)">${label(0, 0, '답장 3시간', { size: 34, bg: '#FFE14A' })}</g>`;
  if (kR > 0.01) g += `<g transform="translate(1110 230) scale(${f1(kR * 100) / 100})"><rect x="0" y="0" width="${f1(aiTW(AI_T1, 40) + 68)}" height="88" rx="30" fill="#fff" stroke="${INK}" stroke-width="7"/>${fT(34, 58, AI_T1, 40, INK, { anchor: 'start', w: 700 })}` +
    `<g transform="translate(64 160)">${aiChicken(0, 0, 1.3)}</g></g>`;
  const cam = qLerpCam(run2 / 1.9, [960, 470, 1.12], [960, 520, 1.16]);
  return aiDefs() + gfDefs() + qCam(cam, g);
}

/* =========== 5. 어이없음 → 절레절레 → AI 창으로 돌아가 뿌듯 =========== */
function aideadScene(t, lt, a) {
  const ph = a.ph, run = a._run;
  if (ph === 0) {
    const face = { eyes: { flat: 0.5, hl: false, open: 1 - ACT.blinks(run, [0.4, 0.85], 0.4), size: 0.97 }, brow: { asymR: 12 * ACT.pulse(run, 0.9, 0.3) }, mouthPath: 'M184 238 L216 238', blush: 0.15, fx: tt => ACT.sym('dots', 318, 92, run, 0.15, 1.2) };
    const zero = aiBedZero('_ai4', t, face, { look: [0, 0.75] });
    const cam = qLerpCam(run / 1.1, [960, 690, 2.1], [960, 690, 2.2]);
    return aiDefs() + gfDefs() + qDefs() + qPlate('ainight', cam, 0.45, { blur: true }) + qCam(cam, aiBedBack() + zero + aiBlanketFront(905) + aiBedFrame()) + aiNightTint(1) + qCam(cam, aiFaceGlow(955, 700, 0.9));
  }
  const D = a._dur || 3.4, tAI = gfW(a, ['AI', '에이'], 1.7), shake = lt > 0.15 && lt < 1.3 ? Math.sin((lt - 0.15) * 15) * 9 * (1 - aiK(lt, 0.9, 1.3)) : 0, proud = easeInOut(aiK(lt, tAI - 0.2, tAI + 0.5));
  const mouth = gfMouth(t, { v: ACT.VIS.M, o: 0, c: lerp(-1, 5, proud) }, lerp(-1, 4, proud));
  const face = { eyes: { flat: lerp(0.45, 0.1, proud), open: 1 - ACT.blinks(lt, [1.4], 0.18), squint: 0.35 * proud }, brow: { worry: 0.3 * (1 - proud) }, mouth, blush: 0.2 + 0.35 * proud };
  const look = lt < 1.3 ? [Math.sin((lt - 0.15) * 15) * 0.6, 0.5] : [0, 0.8];
  const zero = aiBedZero('_ai5', t, face, { look, tilt: shake, headDy: -4 * proud });
  const cam = qLerpCam(lt / D, [960, 690, 2.2], [960, 700, 2.35]);
  return aiDefs() + gfDefs() + qDefs() + qPlate('ainight', cam, 0.45, { blur: true }) + qCam(cam, aiBedBack() + zero + aiBlanketFront(905) + aiBedFrame()) + aiNightTint(1) + qCam(cam, aiFaceGlow(955, 700, 0.95 + 0.1 * proud));
}

/* =========== 6. 요즘 사람들(지하철·사무실·카페): 모두 폰 뒷면 + 푸른 빛 =========== */
// 화면 빛을 받는 사람(폰 뒷면). 작은 말풍선(별 아이콘)이 폰 위에서 깜빡
function aiCrowdP(key, t, x, y, s, o) {
  const nod = Math.max(0, Math.sin(t * 3.1 + o.seed)) * 7;
  const face = { eyes: { open: 1 - ACT.natBlink(t, o.seed), squint: 0.3, size: 0.95 }, brow: { worry: 0.15 }, mouth: { v: ACT.VIS.M, o: 0, c: 3 }, blush: 0.3 };
  const p = gfP(key, face, Object.assign({ x, y, s, t, seed: o.seed, pose: A2.pose({ hL: [178, 352], hR: [222, 362] }), look: [0.05, 0.8], headDy: nod, holdL: { svg: GF_PHBACK, rot: -8 }, handL: 'grip', vshade: 'rgba(0,0,0,0.18)' }, o));
  const hx = x + (178 - 200) * s, hy = y + (300 - 560) * s, pulse = 0.6 + 0.4 * Math.sin(t * 4 + o.seed);
  const bub = `<g transform="translate(${f1(x + 150 * s)} ${f1(y - 570 * s)}) scale(${f1(s * 1.25 * 100) / 100})" opacity="${f1(pulse * 100) / 100}"><path d="M-62 -40 Q-62 -60 -42 -60 L42 -60 Q62 -60 62 -40 L62 10 Q62 30 42 30 L-20 30 L-44 54 L-36 30 L-42 30 Q-62 30 -62 10Z" fill="#fff" stroke="${INK}" stroke-width="6"/>${aiStar(0, -15, 26)}</g>`;
  return { svg: p + bub, glow: aiFaceGlow(x - 10 * s, y - 380 * s, 1, 0.62 * s) };
}
function aicrowdScene(t, lt, a) {
  const t2 = gfW(a, ['친구보다'], 2.8) - 0.2, t3 = gfW(a, ['마음을'], 5.0) - 0.45;
  if (lt < t2) {
    const cam = qLerpCam(lt / t2, [960, 600, 1.0], [960, 620, 1.08]);
    const A = aiCrowdP('_ac1', t, 680, 1180, 1.3, { seed: 3, vest: '#9AA3B0', hair: '#2F2F33', collar: true }), B = aiCrowdP('_ac2', t, 1300, 1180, 1.3, { seed: 7, vest: '#A9927C', hair: '#4A3A2E', longHair: '#4A3A2E', lashes: true });
    return aiDefs() + gfDefs() + qDefs() + qPlate('aisubway', cam, 0.5) + qCam(cam, qShadow(680, 1180, 130, 0.6) + qShadow(1300, 1180, 130, 0.6) + A.svg + B.svg) + fFull('#0A1238', 0.12) + qCam(cam, A.glow + B.glow);
  }
  if (lt < t3) {
    const u = lt - t2, cam = qLerpCam(u / (t3 - t2), [1000, 600, 1.15], [990, 610, 1.22]);
    const A = aiCrowdP('_ac3', t, 960, 1170, 1.35, { seed: 11, vest: '#7E8CA0', hair: '#2F2F33', collar: true, tie: '#3D5A80' });
    return aiDefs() + gfDefs() + qDefs() + qPlate('aioffice', cam, 0.5) + qCam(cam, qShadow(960, 1170, 140, 0.6) + A.svg) + qCam(cam, A.glow);
  }
  const u = lt - t3, D = (a._dur || 6.6) - t3, cam = qLerpCam(u / D, [1060, 620, 1.2], [1070, 630, 1.28]);
  const A = aiCrowdP('_ac4', t, 1090, 1110, 1.1, { seed: 17, vest: '#C9B8A6', hair: '#5A4030', longHair: '#5A4030', lashes: true });
  // 카페 탁자(앞판이 있어 다리를 가림)
  const table = `<rect x="820" y="905" width="560" height="26" rx="10" fill="#8A5C34" stroke="${INK}" stroke-width="8"/><rect x="845" y="931" width="510" height="220" fill="#6E4626" stroke="${INK}" stroke-width="8"/>` +
    `<g transform="translate(1270 905)"><rect x="-26" y="-58" width="52" height="58" rx="8" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M26 -44 Q46 -40 44 -24 Q42 -12 26 -14" fill="none" stroke="${INK}" stroke-width="6"/><path d="M-10 -72 Q-4 -84 -10 -96 M8 -72 Q14 -84 8 -96" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/></g>`;
  return aiDefs() + gfDefs() + qDefs() + qPlate('aicafe', cam, 0.5) + qCam(cam, A.svg + table) + qCam(cam, A.glow);
}
