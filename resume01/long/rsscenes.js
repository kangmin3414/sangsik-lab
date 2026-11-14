/* 자소서 편 — 1막(대본_v3 1~8번). 새 이름은 모두 rs / RS 접두사.
   규칙: 기기 화면은 제로 시점(두 손 + 기기)에서만 · 누르는 손가락 없음(글자는 저절로, 버튼은 눌림 표시) · 실존 회사·서비스 이름 없음 · 새벽이지만 밝게.
   물리: 제로는 책상 뒤에 앉아 있고 책상 뒤쪽 모서리(y 977)가 몸을 가린다 · 노트북은 책상 위 · 전화기는 손 안에. */
Object.assign(QBG, { rswall: 'ai/wall.jpg' });
['rspov', 'rsintro', 'rschat', 'rsline', 'rsface', 'rssubmit'].forEach(k => CAMS[k] = 'fixed');
const RS = { YL: '#FFE14A', LINE: '프로젝트 리드, 매출 30% 기여', DESK: 977, ZY: 1175, ZS: 1.5, BLUE: '#3D5AA8' };
E['rs담담'] = Object.assign({}, E['z기본'], { mouth: 'M187 237 L213 237', mouthFill: 'none', fxUnder: null, bL: [140, 147, 163, 145, 186, 152], bR: [214, 152, 237, 145, 260, 147] }); // 조용히 마음을 정한 얼굴(웃지 않는다)
const rsK = (a, b, x) => clamp((x - a) / (b - a), 0, 1);
const rsOp = k => f1(clamp(k, 0, 1) * 100) / 100;
const rsSc = k => f1(lerp(0.3, 1, easeOutBack(clamp(k, 0, 1))) * 100) / 100;
const rsL = id => ((window.TL && TL.lines) || []).find(l => l.id === id) || { t0: 0, t1: 1, words: [] };
const rsWd = (ws, key, fb, n = 0) => { const m = (ws || []).filter(x => x.w.replace(/\s/g, '').includes(key)); return m[n] ? m[n].t + 0.15 : fb; };
const rsW = (a, key, fb, n) => rsWd(a._words, key, fb, n);
const rsTw = (s, fs) => [...String(s)].reduce((a, c) => a + (/[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.58), 0) * fs;
const rsVeil = (lt, t0, w = 0.16, mx = 0.6) => fFull('#fff', rsOp(Math.max(0, 1 - Math.abs(lt - t0) / w) * mx));
const rsDefs = () => `<defs>
<radialGradient id="rsGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#E4F3FF" stop-opacity=".9"/><stop offset=".6" stop-color="#C6E3FF" stop-opacity=".3"/><stop offset="1" stop-color="#C6E3FF" stop-opacity="0"/></radialGradient>
<radialGradient id="rsWarm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".9"/><stop offset=".55" stop-color="#FFD98A" stop-opacity=".35"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient>
<clipPath id="rsAbove"><rect x="-600" y="-600" width="3200" height="${RS.DESK + 600}"/></clipPath>
<clipPath id="rsScr"><rect x="250" y="40" width="1420" height="780"/></clipPath>
<clipPath id="rsPh"><rect x="-250" y="-440" width="500" height="880" rx="36"/></clipPath>
<clipPath id="rsInset"><rect x="-250" y="-160" width="500" height="320" rx="26"/></clipPath>
<clipPath id="rsCard"><rect x="-200" y="-150" width="400" height="300" rx="24"/></clipPath>
<filter id="rsBlur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="10"/></filter>
</defs>`;
const rsStar = (r, fill = '#7FD8B0') => { let d = ''; for (let i = 0; i < 10; i++) { const an = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.48 : r; d += (i ? 'L' : 'M') + f1(Math.cos(an) * rr) + ' ' + f1(Math.sin(an) * rr); } return `<path d="${d} Z" fill="${fill}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`; };
const rsCheck = (x, y, s, col = '#fff', sw = 6) => `<path d="M${f1(x - 10 * s)} ${f1(y)} L${f1(x - 3 * s)} ${f1(y + 8 * s)} L${f1(x + 11 * s)} ${f1(y - 9 * s)}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
const rsSparkle = (x, y, r, col) => `<path d="M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r} Z" fill="${col}"/>`;
/* 노란 한 줄(이 편의 물건). 원점은 가운데 */
function rsStrip(x, y, s, o = {}) {
  const w = 620, h = 76;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${o.rot || 0}) scale(${f1(s * 1000) / 1000})" opacity="${rsOp(o.op == null ? 1 : o.op)}">` +
    (o.empty ? `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="12" fill="#fff" fill-opacity=".55" stroke="#8B93A3" stroke-width="6" stroke-dasharray="18 14"/>`
      : `<rect x="${-w / 2 + 6}" y="${-h / 2 + 8}" width="${w}" height="${h}" rx="12" fill="${INK}" opacity=".22"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="12" fill="${RS.YL}" stroke="${INK}" stroke-width="6"/>` + fT(0, 15, RS.LINE, 42, NAVY)) + `</g>`;
}

/* ---------- 제로 시점: 노트북 ---------- */
function rsLaptop(t, inner, o = {}) { // 화면 안쪽은 x 250~1670, y 40~820
  let g = `<rect x="-300" y="-200" width="2600" height="1700" fill="#F4EBD6"/><ellipse cx="-40" cy="520" rx="520" ry="620" fill="url(#rsWarm)" opacity=".55"/>`;
  g += `<rect x="-300" y="800" width="2600" height="700" fill="#E8D2A6"/><line x1="-300" y1="800" x2="2300" y2="800" stroke="${INK}" stroke-width="6" opacity=".55"/>`;
  g += `<path d="M190 866 L1730 866 L1900 1320 L20 1320 Z" fill="#C9CED8" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 13; c++) { const y = 898 + r * 58, k = (y - 866) / 454, x0 = lerp(190, 20, k) + 70, x1 = lerp(1730, 1900, k) - 70, w = (x1 - x0) / 13; g += `<rect x="${f1(x0 + c * w + 6)}" y="${y}" width="${f1(w - 12)}" height="42" rx="8" fill="#E6EAF0" stroke="#9AA3B4" stroke-width="3"/>`; }
  g += `<rect x="222" y="844" width="1476" height="26" rx="10" fill="#9AA3B4" stroke="${INK}" stroke-width="6"/><rect x="222" y="14" width="1476" height="834" rx="26" fill="#2B303B" stroke="${INK}" stroke-width="8"/>`;
  g += `<g clip-path="url(#rsScr)">${inner}</g>`;
  if (!o.noHands) { const b = Math.sin(t * 1.7) * 3, hy = o.hy || 0, lx = o.lx == null ? 560 : o.lx, rx = o.rx == null ? 1360 : o.rx;
    g += `<path d="M${lx} ${f1(968 + b + hy)} L${lx - 190} 1340" stroke="${INK}" stroke-width="30" stroke-linecap="round"/>` + hand(lx, 962 + b + hy, 2.6);
    if (!o.noRight) g += `<path d="M${rx} ${f1(968 - b + hy)} L${rx + 190} 1340" stroke="${INK}" stroke-width="30" stroke-linecap="round"/>` + hand(rx, 962 - b + hy, 2.6); }
  return g;
}
const rsZoom = (inner, z, cx, cy) => `<g transform="translate(${f1(cx)} ${f1(cy)}) scale(${f1(z * 1000) / 1000}) translate(${f1(-cx)} ${f1(-cy)})">${inner}</g>`;
function rsForm(o = {}) { // 지원서 화면(지어낸 채용 페이지)
  const tab = o.tab || 3; let g = `<rect x="250" y="40" width="1420" height="780" fill="#F4F6FA"/>`;
  g += `<rect x="250" y="40" width="1420" height="58" fill="#DDE2EA"/>` + [0, 1, 2].map(i => `<circle cx="${286 + i * 30}" cy="69" r="9" fill="${['#F08A6B', '#F5C451', '#7FD8B0'][i]}"/>`).join('') + `<rect x="400" y="50" width="760" height="38" rx="19" fill="#fff"/>` + fT(428, 79, '신입 공개채용 · 입사지원', 26, '#5B6478', { anchor: 'start', w: 700 }) + fT(1640, 80, o.clock || '오전 2:02', 28, '#3A4252', { anchor: 'end', w: 700 });
  g += fT(300, 166, '입사지원서', 48, NAVY, { anchor: 'start' });
  g += `<g transform="translate(1466 148) scale(${f1((1 + 0.08 * (o.pill || 0)) * 100) / 100})"><rect x="-164" y="-34" width="328" height="68" rx="34" fill="#FFE9DF" stroke="#F08A6B" stroke-width="5"/>${fT(0, 13, o.pillText || '마감까지 ' + (o.mins == null ? 58 : o.mins) + '분', 36, '#B23A1E')}</g>`;
  let sx = 300; ['인적사항', '학력·경력', '자기소개서'].forEach((nm, i) => { const act = i + 1 === tab, done = !act && i < 2, w = 50 + rsTw(nm, 30);
    g += `<circle cx="${sx + 18}" cy="228" r="18" fill="${act ? RS.BLUE : done ? '#7FD8B0' : '#C9CED8'}"/>` + (done ? rsCheck(sx + 18, 228, 0.9, '#fff', 5) : fT(sx + 18, 238, String(i + 1), 24, '#fff')) + fT(sx + 46, 239, nm, 30, act ? NAVY : '#7A8394', { anchor: 'start', w: act ? 900 : 700 });
    if (act) g += `<rect x="${sx}" y="254" width="${f1(w)}" height="7" rx="3" fill="${RS.BLUE}"/>`; sx += w + 56; });
  g += `<line x1="300" y1="261" x2="1620" y2="261" stroke="#D5DAE3" stroke-width="3"/>` + (o.body || '');
  if (o.noBtn) return g;
  g += `<rect x="1180" y="748" width="200" height="60" rx="12" fill="#fff" stroke="#B8BECB" stroke-width="4"/>` + fT(1280, 789, '임시 저장', 30, '#5B6478', { w: 700 });
  const pr = o.press || 0;
  g += `<g transform="translate(1510 778) scale(${f1((1 - 0.07 * pr) * 100) / 100})">${pr > 0 ? `<rect x="-122" y="-42" width="244" height="84" rx="20" fill="none" stroke="${RS.BLUE}" stroke-width="6" opacity="${rsOp(pr * 0.7)}"/>` : ''}<rect x="-110" y="-30" width="220" height="60" rx="12" fill="${pr > 0.3 ? '#2B3F7E' : RS.BLUE}" stroke="${INK}" stroke-width="4"/>${fT(0, 12, '제출하기', 32, '#fff')}</g>`;
  return g;
}
const RS_ESSAY = ['저는 물류센터에서 3개월 동안 입출고와', '재고 조사를 맡았습니다. 수량이 맞지 않는', '날에는 끝까지 남아 원인을 찾았습니다.'];
function rsEssay(t, o = {}) { // 자기소개서 입력칸. o.shown 본문 글자 수, o.yl 노란 줄 글자 수(-1이면 없음), o.draft 임시 글자
  const pw = o.pw || 1620; let g = fT(300, 306, '지원 직무와 관련된 경험을 적어 주세요. (700자 이내)', 32, '#3A4252', { anchor: 'start', w: 700 });
  g += `<rect x="300" y="326" width="${pw - 300}" height="400" rx="12" fill="#fff" stroke="#B8BECB" stroke-width="4"/>`;
  let left = o.shown || 0, cx = 334, cy = 392, n = 0;
  if (o.draft) { g += fT(330, 392, o.draft, 34, '#2B3445', { anchor: 'start', w: 700 }); cx = 334 + rsTw(o.draft, 34); n = o.draft.length; }
  (o.lines || RS_ESSAY).forEach((ln, i) => { if (left <= 0) return; const s = ln.slice(0, left); left -= ln.length; n += s.length; g += fT(330, 392 + i * 58, s, 34, '#2B3445', { anchor: 'start', w: 700 }); cx = 334 + rsTw(s, 34); cy = 392 + i * 58; });
  if (o.bracket) g += `<g opacity="${rsOp(o.bracket)}"><rect x="310" y="352" width="8" height="${f1(172 * o.bracket)}" rx="4" fill="#3CC79A"/></g><g transform="translate(492 568) scale(${rsSc(o.bracket)})">${label(0, 0, '여기까지는 해 본 일', { size: 30 })}</g>`;
  if (o.yl != null && o.yl >= 0) { const s = RS.LINE.slice(0, o.yl), w = rsTw(s, 38); n += s.length;
    if (o.yl > 0) g += (o.ylGlow ? `<rect x="312" y="614" width="${f1(w + 44)}" height="76" rx="14" fill="none" stroke="${RS.YL}" stroke-width="10" opacity="${rsOp(o.ylGlow)}"/>` : '') + `<rect x="322" y="624" width="${f1(w + 24)}" height="56" rx="8" fill="${RS.YL}"/>` + fT(334, 666, s, 38, NAVY, { anchor: 'start' });
    cx = 340 + w; cy = 666; }
  if (o.plain) { g += fT(330, 666, o.plain, 34, '#2B3445', { anchor: 'start', w: 700 }); cx = 334 + rsTw(o.plain, 34); cy = 666; n += o.plain.length; }
  if (o.cursor !== false && Math.floor(t * 2.2) % 2 === 0) g += `<rect x="${f1(cx + 4)}" y="${cy - 32}" width="4" height="40" fill="${INK}"/>`;
  const cp = o.cntPulse || 0;
  g += (cp > 0 ? `<ellipse cx="${pw - 96}" cy="696" rx="${f1(96 + 26 * cp)}" ry="${f1(30 + 12 * cp)}" fill="none" stroke="#F08A6B" stroke-width="5" opacity="${rsOp(1 - cp)}"/>` : '') + fT(pw - 24, 706, n + ' / 700자', 28, cp > 0 || o.cntHot ? '#C4472A' : '#8B93A3', { anchor: 'end', w: 700 });
  return g;
}
function rsCareer(o = {}) { // 학력·경력 탭: 경력은 한 줄
  let g = fT(300, 310, '경력 사항', 34, '#3A4252', { anchor: 'start' });
  g += `<rect x="300" y="332" width="1320" height="54" rx="10" fill="#E3E8F1"/>` + fT(330, 370, '근무처 · 담당 업무', 26, '#5B6478', { anchor: 'start', w: 700 }) + fT(1590, 370, '기간', 26, '#5B6478', { anchor: 'end', w: 700 });
  const hi = o.hi || 0;
  g += `<rect x="300" y="394" width="1320" height="112" rx="12" fill="${hi > 0.5 ? '#E7F8F0' : '#fff'}" stroke="${hi > 0.5 ? '#3CC79A' : '#B8BECB'}" stroke-width="${hi > 0.5 ? 6 : 4}"/>` + fT(334, 466, '물류창고 아르바이트', 44, NAVY, { anchor: 'start' });
  ['6월', '7월', '8월'].forEach((m, i) => { const k = rsK(0, 0.25, (o.months == null ? 9 : o.months) - i * 0.42); if (k > 0) g += `<g transform="translate(${1130 + i * 104} 450) scale(${rsSc(k)})"><rect x="-44" y="-36" width="88" height="72" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-44" y="-36" width="88" height="22" rx="10" fill="#F08A6B" stroke="${INK}" stroke-width="5"/>${fT(0, 24, m, 30, NAVY)}</g>`; });
  g += fT(1590, 464, '3개월', 38, '#3A4252', { anchor: 'end' });
  for (let i = 0; i < 2; i++) g += `<rect x="300" y="${522 + i * 100}" width="1320" height="86" rx="12" fill="#F9FAFC" stroke="#C9CED8" stroke-width="4" stroke-dasharray="14 12"/>` + fT(960, 576 + i * 100, i ? '' : '추가한 경력이 없습니다', 30, '#A3AAB8', { w: 700 });
  return g;
}
function rsAiPanel(lt, o = {}) { // 지어낸 글쓰기 도우미 창. x 1170~1640
  const k = easeOut(rsK(0, 0.4, lt)); let g = `<g transform="translate(${f1(lerp(520, 0, k))} 0)"><rect x="1170" y="276" width="470" height="450" rx="18" fill="#EEF1FF" stroke="#7C8BE0" stroke-width="5"/>` + rsSparkle(1212, 322, 20, '#5A6AD8') + fT(1244, 334, 'AI 글쓰기 도우미', 30, '#3D4BB5', { anchor: 'start' });
  g += `<rect x="1300" y="366" width="312" height="104" rx="18" fill="#fff" stroke="#B8BECB" stroke-width="4"/>` + fT(1596, 408, '물류창고 알바 3개월', 28, '#2B3445', { anchor: 'end', w: 700 }) + fT(1596, 448, '재고 세고 박스 나름', 28, '#2B3445', { anchor: 'end', w: 700 });
  if (o.busy) g += fT(1198, 520, '문장을 다듬는 중' + '.'.repeat(1 + Math.floor(lt * 3) % 3), 28, '#5A6AD8', { anchor: 'start', w: 700 });
  else if (o.done) g += `<circle cx="1214" cy="510" r="16" fill="#3CC79A"/>` + rsCheck(1214, 510, 0.8, '#fff', 5) + fT(1242, 520, '다듬었어요', 28, '#2B3445', { anchor: 'start', w: 700 });
  if (o.chip > 0) { const pr = o.chipPress || 0; g += `<g transform="translate(1405 606) scale(${f1(rsSc(o.chip) * (1 - 0.06 * pr))})">${pr > 0 ? `<rect x="-212" y="-48" width="424" height="96" rx="48" fill="none" stroke="#5A6AD8" stroke-width="6" opacity="${rsOp(0.8 * (1 - rsK(0.5, 1, pr)))}"/>` : ''}<rect x="-196" y="-36" width="392" height="72" rx="36" fill="${pr > 0.3 ? '#5A6AD8' : '#fff'}" stroke="#5A6AD8" stroke-width="5"/>${fT(0, 12, '더 돋보이게 고치기', 32, pr > 0.3 ? '#fff' : '#3D4BB5')}</g>`; }
  return g + `</g>`;
}

/* ---------- 제로 시점: 전화기(오른손에 쥠) ---------- */
function rsBub(x, y, text, o = {}) { // 말풍선. 남의 말은 왼쪽 정렬(x가 왼쪽 끝), 내 말은 오른쪽 정렬(x가 오른쪽 끝)
  const fs = 28, w = rsTw(text, fs) + 40, k = o.k == null ? 1 : o.k; if (k <= 0) return '';
  const x0 = o.mine ? x - w : x;
  return `<g transform="translate(${f1(o.mine ? x : x0)} ${y}) scale(${rsSc(k)}) translate(${f1(-(o.mine ? x : x0))} ${-y})"><rect x="${f1(x0)}" y="${y - 30}" width="${f1(w)}" height="60" rx="22" fill="${o.mine ? '#BFEFD9' : '#fff'}" stroke="${INK}" stroke-width="4"/>${fT(x0 + 20, y + 10, text, fs, '#1F2937', { anchor: 'start', w: 700 })}</g>`;
}
const rsWho = (y, name, col, k = 1) => k <= 0 ? '' : `<g opacity="${rsOp(k * 3)}"><circle cx="-208" cy="${y}" r="26" fill="${col}" stroke="${INK}" stroke-width="4"/>${fT(-172, y - 40, name, 22, '#5B6478', { anchor: 'start', w: 700 })}</g>`;
function rsChatHead(title, sub) { return `<rect x="-250" y="-440" width="500" height="560" fill="#EEF1F6"/><rect x="-250" y="120" width="500" height="320" fill="#EEF1F6"/><rect x="-250" y="-440" width="500" height="92" fill="#fff"/><line x1="-250" y1="-348" x2="250" y2="-348" stroke="#C9CED8" stroke-width="3"/><path d="M-214 -394 L-228 -380 L-214 -366" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` + fT(-186, -368, title, 34, NAVY, { anchor: 'start' }) + (sub ? fT(-186 + rsTw(title, 34) + 14, -368, sub, 28, '#8B93A3', { anchor: 'start', w: 700 }) : '') + `<rect x="-232" y="356" width="464" height="60" rx="30" fill="#fff" stroke="#C9CED8" stroke-width="3"/>`; }
function rsPhone(t, lt, content, o = {}) {
  const S = 1.75, px = 960 + Math.sin(t * 0.9) * 4, py = 836 + Math.sin(t * 1.3) * 3 + (o.buzz ? Math.sin(lt * 70) * 5 * o.buzz : 0), rise = easeOut(rsK(0, 0.35, lt));
  let g = `<g filter="url(#rsBlur)">${rsLaptop(t, rsForm({ tab: 3, body: rsEssay(t, { cursor: false }) }), { noRight: true })}</g>` + fFull('#F4EBD6', 0.35);
  g += `<g transform="translate(${f1(px)} ${f1(py + (1 - rise) * 700)}) rotate(${f1(Math.sin(t * 0.7) * 0.8)}) scale(${S})"><rect x="-266" y="-462" width="548" height="940" rx="60" fill="${INK}" opacity=".18"/><rect x="-274" y="-470" width="548" height="940" rx="60" fill="#1F2D44" stroke="${INK}" stroke-width="8"/><rect x="-250" y="-440" width="500" height="880" rx="36" fill="#EEF1F6"/><g clip-path="url(#rsPh)">${content}</g></g>`;
  const hx = px + 274 * S + 10, hy = py + 50 + (1 - rise) * 700;
  return g + `<path d="M${f1(hx + 10)} ${f1(hy + 20)} L${f1(hx + 250)} 1340" stroke="${INK}" stroke-width="30" stroke-linecap="round"/>` + hand(hx, hy, 2.6);
}

/* ---------- 얼굴 샷: 벽 앞, 책상 뒤의 제로(노트북은 뒷면만) ---------- */
const rsArmType = { armL: [[148, 285], [128, 340], [158, 392]], hL: [164, 398], armR: [[252, 285], [272, 340], [242, 392]], hR: [236, 398] };
const rsDeskClock = (x, y, txt) => `<g transform="translate(${x} ${y})"><rect x="-70" y="-34" width="140" height="68" rx="14" fill="#2B303B" stroke="${INK}" stroke-width="6"/>${fT(0, 14, txt, 40, '#8FF0C8')}</g>`;
const rsLid = () => `<rect x="744" y="1030" width="432" height="20" rx="9" fill="#8E97A6" stroke="${INK}" stroke-width="6"/><rect x="760" y="812" width="400" height="226" rx="18" fill="#C3C9D4" stroke="${INK}" stroke-width="8"/><path d="M780 832 H1140" stroke="#fff" stroke-width="6" opacity=".6" stroke-linecap="round"/><g transform="translate(960 928)">${rsStar(26)}</g>`;
function rsFaceShot(t, cam, o = {}) {
  const tz = o.tz == null ? t : o.tz, g = o.ghost || 0;
  const zo = Object.assign({ x: 960, y: RS.ZY, s: RS.ZS, t: tz, pose: Object.assign({}, P['서기'], rsArmType), ex: fEx('z멍'), look: [0, 0.5], seed: 3 }, o.z || {});
  let zs = '';
  if (g > 0) { const d = 44 * g + (o.shake || 0); zs += `<g opacity="${rsOp(0.5 * g * (o.ghostL == null ? 1 : o.ghostL))}" transform="translate(${f1(-d - (o.drift || 0))} 0)">${Z(zo)}</g><g opacity="${rsOp(0.5 * g * (o.ghostR == null ? 1 : o.ghostR))}" transform="translate(${f1(d + (o.driftR || 0))} 0)">${Z(zo)}</g>`; }
  let w = `<g clip-path="url(#rsAbove)">${zs + Z(zo)}</g><ellipse cx="960" cy="780" rx="340" ry="260" fill="url(#rsGlow)" opacity="${rsOp(o.glow == null ? 0.6 : o.glow)}"/>` + rsLid() + rsDeskClock(1320, 1002, o.clock || '2:02');
  if (o.tag) w += `<g transform="translate(580 846) scale(${rsSc(o.tagK == null ? 1 : o.tagK)})"><line x1="140" y1="10" x2="182" y2="26" stroke="${INK}" stroke-width="5"/>${label(0, 0, o.tag, { size: 34, bg: '#FFE9DF', color: '#B23A1E' })}</g>`;
  if (o.extra) w += o.extra;
  return rsDefs() + qdPlate('rswall', cam, 1.0) + qCam(cam, w);
}
function rsStripAir(k, o = {}) { // 노트북에서 떠올라 머리 위에 서는 한 줄. dbl: 두 겹(0~1)
  if (k <= 0) return ''; const e = easeOut(clamp(k, 0, 1)), x = 960, y = lerp(800, 322, e), s = lerp(0.25, 0.7, e), d = (o.dbl || 0) * 20 + (o.shake || 0);
  return (d ? rsStrip(x - d * 0.8, y - d, s, { op: 0.45 }) + rsStrip(x + d * 0.8, y + d, s, { op: 0.45 }) : '') + rsStrip(x, y, s, { op: d ? 0.9 : 1 });
}
function rsInsetWare(t, k, cnt, o = {}) { // 회상 창: 창고에서 재고를 세는 제로
  if (k <= 0) return '';
  let g = `<g transform="translate(${o.x || 1570} ${o.y || 330}) scale(${rsSc(k)})"><rect x="-260" y="-170" width="520" height="340" rx="32" fill="${INK}"/><g clip-path="url(#rsInset)"><rect x="-250" y="-160" width="500" height="320" fill="#E6ECF5"/><rect x="-250" y="92" width="500" height="80" fill="#C5CBD6"/><line x1="-250" y1="92" x2="250" y2="92" stroke="${INK}" stroke-width="4" opacity=".5"/>`;
  g += `<rect x="-236" y="-132" width="12" height="226" fill="#7A8394"/><rect x="48" y="-132" width="12" height="226" fill="#7A8394"/>` + [-34, 82].map(y => `<rect x="-240" y="${y}" width="304" height="12" rx="4" fill="#7A8394" stroke="${INK}" stroke-width="3"/>`).join('');
  let n = 0; for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) { const bx = -220 + c * 68, by = r ? 24 : -92, done = n < cnt, pk = rsK(0, 0.2, cnt - n); n++;
    g += `<rect x="${bx}" y="${by}" width="60" height="58" rx="5" fill="#DDAE74" stroke="${INK}" stroke-width="4"/><line x1="${bx + 30}" y1="${by}" x2="${bx + 30}" y2="${by + 22}" stroke="#B98950" stroke-width="6"/>` + (done ? `<g transform="translate(${bx + 30} ${by + 38}) scale(${rsSc(pk)})"><circle r="15" fill="#3CC79A" stroke="${INK}" stroke-width="3"/>${rsCheck(0, 0, 0.75, '#fff', 4)}</g>` : ''); }
  const x = 150, y = 236, s = 0.56, pose = Object.assign({}, P['서기'], { armL: [[148, 285], [118, 336], [150, 356]], hL: [158, 358], armR: [[252, 285], [226, 330], [186, 322]], hR: [178, 320] }), hp = [x + (158 - 200) * s, y + (358 - 560) * s];
  g += Z({ x, y, s, t, pose, vest: '#7FD8B0', vshade: 'rgba(0,80,60,0.18)', ex: fEx('z기본'), look: [-0.7, 0.1 + 0.25 * Math.sin(cnt * 2.2)], seed: 5 });
  g += `<g transform="translate(${f1(hp[0] - 4)} ${f1(hp[1] - 18)}) rotate(-8) scale(.5)"><rect x="-44" y="-62" width="88" height="118" rx="8" fill="#B9895A" stroke="${INK}" stroke-width="7"/><rect x="-36" y="-50" width="72" height="98" rx="4" fill="#fff" stroke="${INK}" stroke-width="4"/></g>` + hand(hp[0], hp[1], 0.42);
  return g + (o.night ? `<rect x="-250" y="-160" width="500" height="320" fill="#22306B" opacity=".3"/><circle cx="196" cy="-112" r="22" fill="#FFF6CF"/>` : '') + `</g><g transform="translate(0 196)">${label(0, 0, o.label || '석 달 동안 한 일', { size: 30 })}</g></g>`;
}

/* ---------- 1번: 빈 지원서 ---------- */
function rspovScene(t, lt, a) {
  const z = lerp(1.0, 1.07, easeInOut(rsK(0, 3.4, lt)));
  return rsDefs() + rsZoom(rsLaptop(t, rsForm({ tab: 3, body: rsEssay(t, {}) })), z, 900, 480);
}
/* ---------- 2번: 새벽 두 시 → 빈칸 → 단톡방 → 이력 한 줄 ---------- */
function rsintroScene(t, lt, a) {
  const tTag = rsW(a, '마감', 1.95), tHr = rsW(a, '시간', 3.07), tA = rsW(a, '제로의', 4.57) - 0.3, tBl = rsW(a, '빈칸', 6.93), tP = rsW(a, '단톡방', 9.31) - 0.45, tH = rsW(a, '합격', 10.17), tI = rsW(a, '인증', 10.75), tO = rsW(a, '올라오', 11.21), tR = rsW(a, '이력', 13.03) - 0.75, tS = rsW(a, '석', 13.65), tOne = rsW(a, '하나뿐', 15.77);
  if (lt < tA) { const cam = qLerpCam(lt / tA, [960, 628, 1.12], [960, 612, 1.3]), gl = lt > tHr - 0.2 && lt < tHr + 1.0;
    const pose = Object.assign({}, P['턱괴기'], { armL: rsArmType.armL, hL: rsArmType.hL });
    return rsFaceShot(t, cam, { z: { pose, ex: fEx(gl ? 'z당황' : 'z멍'), look: gl ? [-0.75, 0.55] : [0, 0.55], tilt: 4 }, tag: lt > tTag ? '마감까지 58분' : null, tagK: (lt - tTag) / 0.3 }) + rsVeil(lt, tA, 0.14, 0.5); }
  if (lt < tP) { const u = lt - tA, ty = u > 0.5 && u < 1.9 ? '저는'.slice(0, Math.min(2, Math.floor((u - 0.5) / 0.3) + 1)).slice(0, u > 1.5 ? (u > 1.7 ? 0 : 1) : 2) : '';
    const z = lerp(1.05, 1.16, easeInOut(rsK(0, tP - tA, u)));
    return rsDefs() + rsZoom(rsLaptop(t, rsForm({ tab: 3, body: rsEssay(t, { draft: ty, cntPulse: lt > tBl ? rsK(tBl, tBl + 0.7, lt) % 1 : 0, cntHot: lt > tBl }) })), z, 760, 520) + rsVeil(lt, tA, 0.14, 0.5) + rsVeil(lt, tP, 0.14, 0.5); }
  if (lt < tR) { const u = lt - tP; let c = rsChatHead('동기 모임', '5');
    const k1 = (u - 0.35) / 0.25, k2 = (lt - tH) / 0.25, k3 = (lt - tI) / 0.25, k4 = (lt - tO) / 0.25;
    c += rsWho(-282, '수빈', '#F7C8D4', k1); if (k1 > 0) { c += `<g transform="translate(-172 -250) scale(${rsSc(k1)}) translate(172 250)"><rect x="-172" y="-300" width="300" height="150" rx="18" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="-172" y="-300" width="300" height="46" rx="18" fill="#DCE6FA"/>${fT(-22, -268, '전형 결과 안내', 24, '#5B6478', { w: 700 })}${fT(-22, -206, '최종 합격', 44, RS.BLUE)}${fT(-22, -170, '축하드립니다', 24, '#5B6478', { w: 700 })}</g>`;
      for (let i = 0; i < 9; i++) { const an = i * 0.7 + 0.3, r = 40 + 130 * easeOut(rsK(0, 0.6, u - 0.4)); c += `<rect x="${f1(-22 + Math.cos(an) * r * 1.3)}" y="${f1(-226 + Math.sin(an) * r * 0.7)}" width="12" height="12" rx="3" fill="${['#F08A6B', '#F5C451', '#7FD8B0', '#7C8BE0'][i % 4]}" opacity="${rsOp(1.2 - rsK(0.4, 1.4, u))}" transform="rotate(${i * 40} ${f1(-22 + Math.cos(an) * r * 1.3)} ${f1(-226 + Math.sin(an) * r * 0.7)})"/>`; } }
    c += rsBub(-172, -112, '나 붙었어ㅠㅠㅠ', { k: k2 }) + rsWho(-24, '도현', '#CFE4F4', k3) + rsBub(-172, -24, '와 축하해!!', { k: k3 }) + rsWho(62, '지호', '#D9E8C6', k4) + rsBub(-172, 62, '나도 어제 연락 옴', { k: k4 });
    return rsDefs() + rsPhone(t, u, c, { buzz: 1 - rsK(0.3, 0.9, u) }) + rsVeil(lt, tP, 0.14, 0.5) + rsVeil(lt, tR, 0.14, 0.5); }
  const u = lt - tR, z = lerp(1.08, 1.2, easeInOut(rsK(0, 4.5, u)));
  return rsDefs() + rsZoom(rsLaptop(t, rsForm({ tab: 2, body: rsCareer({ months: (lt - tS) / 1 * 1.0 + 0.0, hi: rsK(tOne, tOne + 0.3, lt) }) })), z, 860, 470) + rsVeil(lt, tR, 0.14, 0.5);
}
/* ---------- 3번: 친구의 메시지 ---------- */
function rschatScene(t, lt, a) {
  const t1 = 0.15, t2 = rsW(a, 'AI', 2.23), t3 = rsW(a, '붙으면', 4.63) - 0.84;
  let c = rsChatHead('민재', '') + fT(0, -306, '오전 2:03', 22, '#8B93A3', { w: 700 }) + rsBub(232, -250, '자소서 아직 한 줄도 못 썼다', { mine: true });
  const dots = (y, k) => k > 0 && k < 1 ? `<rect x="-172" y="${y - 30}" width="96" height="60" rx="22" fill="#fff" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2].map(i => `<circle cx="${-146 + i * 22}" cy="${f1(y + Math.sin(lt * 9 - i) * 4)}" r="6" fill="#8B93A3"/>`).join('') : '';
  c += rsWho(-150, '민재', '#F5D7A8', 1) + rsBub(-172, -150, '야, 요즘 누가 쌩으로 쓰냐', { k: (lt - t1) / 0.22 });
  c += dots(-70, rsK(t2 - 0.7, t2, lt)) + rsBub(-172, -70, 'AI한테 맡기고 좀 부풀려', { k: (lt - t2) / 0.22 });
  c += dots(10, rsK(t3 - 0.6, t3, lt)) + rsBub(-172, 10, '서류만 붙으면 다 똑같아', { k: (lt - t3) / 0.22 });
  return rsDefs() + rsZoom(rsPhone(t, lt + 1, c, {}), lerp(1.0, 1.08, easeInOut(rsK(0, 6, lt))), 960, 500);
}
/* ---------- 4번: 매끄러워진 글 → 그다음 줄 → 창고의 석 달 ---------- */
function rsFaceLate(t, lt, o = {}) { // 4번 뒤쪽부터 8번 앞까지 같은 구도
  return rsFaceShot(t, o.cam, Object.assign({ tag: '마감까지 10분', clock: '2:50' }, o));
}
function rslineScene(t, lt, a) {
  const tIn = rsW(a, '넣자', 0.79), tOk = rsW(a, '괜찮', 5.15), tPb = rsW(a, '문제는', 7.41), tPL = rsW(a, '프로젝트', 10.75), tMe = rsW(a, '매출', 11.81), tGi = rsW(a, '기여', 13.63), tF = rsW(a, '석', 15.09) - 0.5, tWa = rsW(a, '창고', 16.31), tNo = rsW(a, '해본', 18.83), tEnd = rsW(a, '일이었', 20.49) + 1.0;
  if (lt < tF) { const total = RS_ESSAY.join('').length, shown = Math.floor(total * rsK(tIn + 0.3, tIn + 2.5, lt));
    const yl = lt < tPL ? -1 : Math.floor(lerp(0, 8, rsK(tPL, tPL + 0.8, lt)) + lerp(0, RS.LINE.length - 8, rsK(tMe, tGi + 0.45, lt)));
    const chip = (lt - tPb - 0.2) / 0.3, cp = rsK(tPb + 1.5, tPb + 2.3, lt);
    const body = rsEssay(t, { pw: 1140, shown, yl, bracket: lt > tOk ? rsK(tOk, tOk + 0.35, lt) : 0, ylGlow: lt > tGi + 0.5 ? 0.5 + 0.5 * Math.sin((lt - tGi) * 5) : 0 }) + rsAiPanel(lt, { busy: lt > tIn && shown < total, done: shown >= total, chip: lt > tPb + 0.2 ? chip : 0, chipPress: cp });
    const zk = easeInOut(rsK(tPb + 1.4, tPL + 0.4, lt)), z = lerp(1.04, 1.36, zk);
    return rsDefs() + rsZoom(rsLaptop(t, rsForm({ tab: 3, mins: lt > tPb ? 12 : 31, clock: lt > tPb ? '오전 2:48' : '오전 2:29', body })), z, lerp(900, 640, zk), lerp(480, 640, zk)) + rsVeil(lt, tF, 0.14, 0.5); }
  const u = lt - tF, cnt = Math.max(0, (lt - tWa) / 0.34), sk = (lt - tNo) / 0.6, inh = rsK(tEnd, tEnd + 0.55, lt);
  const cam = qLerpCam(u / 6.5, [960, 606, 1.38], [960, 598, 1.48]);
  const look = lt > tNo + 0.2 ? [0, -0.75] : lt > tWa - 0.2 ? [0.75, -0.55] : [0, 0.55];
  return rsFaceLate(t, lt, { cam, z: { ex: inh > 0 ? { expr: 'z멍', prev: 'z멍', k: 1, blink: easeInOut(inh) } : fEx(lt > tNo + 0.3 ? 'z당황' : 'z멍'), look: inh > 0 ? [0, 0.3] : look, sy: 1 + 0.045 * easeInOut(inh) }, extra: rsStripAir(sk) }) + rsInsetWare(t, (lt - tF - 0.35) / 0.35 * (1 - rsK(tEnd - 0.2, tEnd + 0.15, lt)), cnt) + rsVeil(lt, tF, 0.14, 0.5);
}
/* ---------- 5~7번: 결심 → 멈춤 → 다세계 해석 두 줄 ---------- */
function rsMini(x, y, s, tz, mode, o = {}) { // 작은 카드: 멈춘 제로와 그 한 줄. mode 'both' | 'keep' | 'erase'
  const zo = { x: 0, y: 236, s: 0.62, t: tz, still: true, noBlink: true, pose: Object.assign({}, P['서기'], rsArmType), ex: fEx('rs담담'), look: [0, 0.2], seed: 3 }, d = mode === 'both' ? 9 + (o.shake || 0) : 0;
  let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><rect x="-204" y="-146" width="416" height="308" rx="28" fill="${INK}" opacity=".2"/><rect x="-210" y="-160" width="420" height="320" rx="30" fill="${INK}"/><g clip-path="url(#rsCard)"><rect x="-200" y="-150" width="400" height="300" fill="#F6EBD3"/><rect x="96" y="-120" width="80" height="110" rx="6" fill="#3F58A8" stroke="${INK}" stroke-width="4"/><circle cx="150" cy="-92" r="12" fill="#FFF6CF"/><rect x="-200" y="98" width="400" height="60" fill="#E6CFA0"/><line x1="-200" y1="98" x2="200" y2="98" stroke="${INK}" stroke-width="4" opacity=".6"/>`;
  if (d) g += `<g opacity=".4" transform="translate(${-d} 0)">${Z(zo)}</g><g opacity=".4" transform="translate(${d} 0)">${Z(zo)}</g>`;
  g += Z(zo) + `<rect x="-62" y="78" width="124" height="74" rx="8" fill="#C3C9D4" stroke="${INK}" stroke-width="5"/>`;
  g += mode === 'erase' ? rsStrip(0, -116, 0.52, { empty: true }) : (d ? rsStrip(-d * 0.6, -116 - d * 0.6, 0.52, { op: 0.45 }) + rsStrip(d * 0.6, -116 + d * 0.6, 0.52, { op: 0.45 }) : '') + rsStrip(0, -116, 0.52, {});
  return g + `</g>` + (o.glow ? `<rect x="-216" y="-166" width="432" height="332" rx="34" fill="none" stroke="#FFD23F" stroke-width="10" opacity="${rsOp(o.glow)}"/>` : '') + `</g>`;
}
function rsWorlds(t, lt, a, TF) { // 7번의 그림: 선 하나가 두 갈래로
  const tE = rsW(a, '에버렛', 2.85), tQ = rsW(a, '양자', 3.45), tC = rsW(a, '가능한', 7.31), tSp = rsW(a, '갈라진', 8.51), tU = rsW(a, '세계에서', 9.69), tD = rsW(a, '저마다', 10.33), tAll = rsW(a, '일어난', 11.55), tN = rsW(a, '지금도', 13.93), tH = rsW(a, '사람의', 16.05), tIm = rsW(a, '상상입니다', 18.75), tT = rsW(a, '오늘은', 21.23);
  const F = [800, 505], U = [1400, 290], D = [1400, 720], mv = easeInOut(rsK(tC - 0.4, tC + 0.5, lt)), c1x = lerp(960, 520, mv);
  let cam = [960, 560, 1];
  if (lt > tH - 0.3) cam = qLerpCam((lt - tH + 0.3) / 1.6, [960, 560, 1], [1060, 548, 1.1]);
  if (lt > tT - 0.1) { const k = easeIn(rsK(tT - 0.1, tT + 2.5, lt)); cam = [lerp(1060, U[0], rsK(0, 0.6, k) ), lerp(548, U[1] + 6, rsK(0, 0.6, k)), lerp(1.1, 5.0, k)]; }
  let w = `<rect x="-3000" y="-3000" width="8000" height="7000" fill="#F7F2E6"/>`;
  for (let i = 0; i < 26; i++) for (let j = 0; j < 14; j++) w += `<circle cx="${-160 + i * 90}" cy="${-20 + j * 90}" r="3" fill="#D9D0BC"/>`;
  // 세계선
  const ln = (d, k = 1, col = '#3A4A6B') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="13" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${f1((1 - clamp(k, 0, 1)) * 1000) / 1000}"/>`;
  w += ln(`M-200 505 L${F[0]} 505`, rsK(0.5, 1.5, lt));
  const dU = `M${F[0]} ${F[1]} C${F[0] + 220} ${F[1]} ${U[0] - 420} ${U[1]} ${U[0] - 200} ${U[1]}`, dD = `M${F[0]} ${F[1]} C${F[0] + 220} ${F[1]} ${D[0] - 420} ${D[1]} ${D[0] - 200} ${D[1]}`, sp = rsK(tSp, tU - 0.1, lt);
  w += ln(dU, sp) + ln(dD, sp);
  if (lt > tSp - 0.05 && sp < 1) { const bz = (p0, p1, p2, p3, u) => { const m = 1 - u; return [m * m * m * p0[0] + 3 * m * m * u * p1[0] + 3 * m * u * u * p2[0] + u * u * u * p3[0], m * m * m * p0[1] + 3 * m * m * u * p1[1] + 3 * m * u * u * p2[1] + u * u * u * p3[1]]; };
    [[U, 1], [D, 1]].forEach(([E2]) => { const p = bz(F, [F[0] + 220, F[1]], [E2[0] - 420, E2[1]], [E2[0] - 200, E2[1]], sp); w += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="17" fill="${RS.BLUE}" stroke="${INK}" stroke-width="5"/>`; }); }
  w += `<circle cx="${F[0]}" cy="${F[1]}" r="${f1(13 * rsK(tC, tC + 0.3, lt))}" fill="#fff" stroke="${INK}" stroke-width="6"/>`;
  // 처음 카드(겹친 제로)
  { const dx = lt < tC + 0.4 ? lerp(-150, c1x - 440, easeInOut(rsK(1.0, 4.2, lt))) : lerp(c1x + 215, F[0], easeInOut(rsK(tC + 0.4, tSp - 0.05, lt))), wob = Math.sin(t * 9) * 3;
    if (lt > 1.0 && lt < tSp) w += `<circle cx="${f1(dx - 9 - wob)}" cy="505" r="17" fill="${RS.BLUE}" stroke="${INK}" stroke-width="5" opacity=".6"/><circle cx="${f1(dx + 9 + wob)}" cy="505" r="17" fill="${RS.BLUE}" stroke="${INK}" stroke-width="5" opacity=".6"/>`; }
  w += rsMini(c1x, 505, lerp(1.9, 1, mv), TF, 'both', { shake: Math.sin(t * 30) * 1.2 });
  // 갈라진 두 세계
  const kU = (lt - tU) / 0.35, kD = (lt - tD) / 0.35, gl = lt > tAll ? Math.max(0, Math.sin((lt - tAll) * 5)) * (1 - rsK(tAll + 1.2, tAll + 1.9, lt)) : 0;
  if (kU > 0) w += rsMini(U[0], U[1], rsSc(kU), TF, 'keep', { glow: gl }) + `<g transform="translate(${U[0]} ${U[1] + 190}) scale(${rsSc(kU - 0.4)})" opacity="${rsOp(1 - rsK(tT, tT + 0.4, lt))}">${kU > 0.4 ? label(0, 0, '그 줄을 남긴 세계', { size: 32, bg: '#FFF1B8' }) : ''}</g>`;
  if (kD > 0) w += rsMini(D[0], D[1], rsSc(kD), TF, 'erase', { glow: gl }) + `<g transform="translate(${D[0]} ${D[1] + 190}) scale(${rsSc(kD - 0.4)})">${kD > 0.4 ? label(0, 0, '그 줄을 지운 세계', { size: 32, bg: '#fff' }) : ''}</g>`;
  // 꼬리표
  if (lt > 0.75) w += `<g transform="translate(476 132) scale(${rsSc((lt - 0.75) / 0.3)})">${label(0, 0, '다세계 해석 · 휴 에버렛, 1957', { size: 40, bg: '#fff' })}</g>`;
  if (lt > tN) w += `<g transform="translate(400 222) rotate(-2) scale(${rsSc((lt - tN) / 0.3)})">${label(0, 0, '여러 해석 가운데 하나', { size: 36, bg: '#FFD9C9' })}</g>`;
  if (lt > tIm - 0.1) { const k = rsK(tIm - 0.1, tIm + 0.7, lt), fo = 1 - rsK(tT, tT + 0.4, lt); w += `<g opacity="${rsOp(fo)}"><rect x="1150" y="96" width="500" height="880" rx="36" fill="none" stroke="#C4472A" stroke-width="7" stroke-dasharray="26 18" pathLength="1" opacity="${rsOp(k * 1.5)}"/><g transform="translate(1400 96) scale(${rsSc((lt - tIm) / 0.3)})">${lt > tIm ? label(0, 0, '여기부터는 상상', { size: 36, bg: '#FFE9DF', color: '#B23A1E' }) : ''}</g></g>`; }
  return rsDefs() + qCam(cam, w) + fFull('#fff', rsOp(rsK(tT + 1.9, tT + 2.45, lt) * 0.9)) + fFull('#fff', rsOp((1 - rsK(0.55, 0.95, lt)) * 0.9));
}
function rsfaceScene(t, lt, a) {
  const ph = a.ph, TF = rsL('s2').t0 - 0.15, camF = [960, 588, 1.56];
  if (ph === 0) { const tG = rsW(a, '그래', 0.15), tK = rsW(a, '결심', 1.33), op = rsK(0.02, 0.28, lt); E['_rsz'] = qTalk(lt > tK - 0.1 ? 'rs담담' : 'z멍', env(t));
    const cam = qLerpCam(lt / 2.7, [960, 598, 1.48], camF);
    return rsFaceLate(t, lt, { cam, z: { ex: Object.assign({}, fEx('_rsz'), { blink: 1 - easeOut(op) }), look: lt > tK - 0.2 ? [0, 0.35] : [0, 0.15], sy: 1 + 0.045 * (1 - easeOut(rsK(0.05, 0.5, lt))) - 0.012 * Math.sin(Math.PI * rsK(tK, tK + 0.5, lt)), still: lt > tK + 0.9 }, extra: rsStripAir(1) }); }
  const zF = { ex: fEx('rs담담'), look: [0, 0.35], still: true, noBlink: true };
  if (ph === 1) { const g = easeOut(rsK(0.12, 0.75, lt)), sh = Math.sin(t * 34) * 2.2 * g;
    return rsFaceLate(TF, lt, { cam: camF, tz: TF, z: zF, ghost: g, shake: sh, extra: rsStripAir(1, { dbl: g, shake: sh * 0.5 }) }) + fFull('#fff', rsOp(0.1 * g)); }
  if (lt < 0.56) { const sh = Math.sin(t * 34) * 2.2; return rsFaceLate(TF, lt, { cam: camF, tz: TF, z: zF, ghost: 1, shake: sh, extra: rsStripAir(1, { dbl: 1, shake: sh * 0.5 }) }) + fFull('#fff', rsOp(0.1 + rsK(0.15, 0.55, lt) * 0.8)); }
  return rsWorlds(t, lt, a, TF);
}
/* ---------- 8번: 다시 움직인다 → 제출 완료(첫 번째 세계) ---------- */
function rsRibbon(k, tag, text) { if (k <= 0) return ''; const e = easeOut(clamp(k, 0, 1));
  return `<g transform="translate(${f1(lerp(-1100, -60, e))} 58)"><rect x="6" y="-38" width="900" height="84" rx="16" fill="${INK}" opacity=".2"/><rect x="0" y="-44" width="900" height="84" rx="16" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="0" y="-44" width="340" height="84" rx="16" fill="#D9482B" stroke="${INK}" stroke-width="6"/>${fT(170, 14, tag, 42, '#fff')}${fT(620, 11, text, 32, NAVY, { w: 700 })}</g>`; }
function rssubmitScene(t, lt, a) {
  const TF = rsL('s2').t0 - 0.15, tC = 1.35;
  if (lt < tC) { const g = 1 - easeInOut(rsK(0.15, 0.95, lt)), ex = rsK(0.75, 1.3, lt);
    return rsFaceLate(t, lt, { cam: qLerpCam(lt / tC, [960, 588, 1.56], [960, 592, 1.5]), z: { ex: fEx('rs담담'), look: [0, 0.45], sy: 1 - 0.03 * Math.sin(Math.PI * ex), still: lt < 0.3 }, ghost: g, ghostL: 1 - rsK(0.15, 0.6, lt), drift: 90 * easeIn(rsK(0.15, 0.9, lt)), extra: rsStripAir(1, { dbl: g }) }) + fFull('#fff', rsOp((1 - rsK(0, 0.3, lt)) * 0.9)) + rsVeil(lt, tC, 0.14, 0.5); }
  const u = lt - tC, pr = rsK(0.35, 0.5, u) * (1 - rsK(0.62, 0.8, u)), dn = (u - 0.8) / 0.3, total = RS_ESSAY.join('').length;
  let body = rsEssay(t, { shown: total, yl: RS.LINE.length, cursor: false, ylGlow: 0.5 + 0.4 * Math.sin(u * 4) });
  if (dn > 0) body += `<rect x="250" y="262" width="1420" height="560" fill="#fff" opacity="${rsOp(rsK(0, 1, dn) * 0.45)}"/><g transform="translate(960 470) scale(${rsSc(dn)})"><rect x="-286" y="-104" width="584" height="220" rx="26" fill="${INK}" opacity=".2"/><rect x="-292" y="-112" width="584" height="220" rx="26" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="-190" cy="-4" r="46" fill="#3CC79A" stroke="${INK}" stroke-width="6"/>${rsCheck(-190, -4, 2.2, '#fff', 11)}${fT(60, 2, '제출 완료', 64, NAVY)}${fT(60, 58, '오전 2:51 접수되었습니다', 28, '#5B6478', { w: 700 })}</g>`;
  const z = lerp(1.1, 1.16, easeInOut(rsK(0, 2.8, u)));
  return rsDefs() + rsZoom(rsLaptop(t, rsForm({ tab: 3, mins: 9, clock: '오전 2:51', press: pr, body })), z, 900, 500) + rsRibbon((u - 1.25) / 0.45, '첫 번째 세계', '지원서를 낸 새벽') + rsVeil(lt, tC, 0.14, 0.5);
}
