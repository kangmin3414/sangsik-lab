/* 자소서 편 — 2막(첫 번째 세계, 대본_v3 9~24번). rsscenes.js의 헬퍼를 쓴다. 새 이름은 rs / RS 접두사.
   규칙: 벌을 주는 것은 사람이 아니라 그 한 줄(비웃음·고함·붉은 화면 없음) · 두 세계를 똑같이 밝게 · 앉은 사람은 책상 윗면에서 몸을 자른다(책상에는 앞판이 있다). */
Object.assign(QBG, { rsoffice: 'ai/office.jpg', rsmeeting: 'ai/meeting.jpg', rsinterview: 'ai/interview.jpg', rssmall: 'ai/small.jpg' });
['rsmail', 'rsoffice', 'rsnights', 'rsmask', 'rsmeet', 'rshr', 'rsreturn', 'rsleave', 'rsinterview', 'rswinter', 'rsrewind', 'rserase', 'rsregret', 'rsfourth', 'rscompare', 'rssmall', 'rsreview', 'rsquote', 'rsknow'].forEach(k => CAMS[k] = 'fixed');
const RSW1 = ['첫 번째 세계', '#D9482B'], RSW2 = ['두 번째 세계', '#2E8B6F'];
const RSZW = o => Z(Object.assign({ vest: '#F4F4F8', vshade: 'rgba(60,70,120,0.15)', collar: true, tie: '#5B6B8C' }, o));   // 출근한 제로(셔츠와 넥타이)
const rsChar = (vest, extra) => o => HALO(char(Object.assign({ goggles: 'none', vest, patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)' }, extra, o)));
const RSB = rsChar('#3F4A63', { hair: '#2B2B2B', collar: true, tie: '#8A3A2A' });    // 팀장
const RSC = rsChar('#D98A6B', { longHair: '#5A3A22', hair: '#5A3A22' });              // 고객사 담당자
const RSH = rsChar('#8FA7C9', { hair: '#3A2A22' });                                   // 인사 담당자
const RSI = rsChar('#6E7686', { hair: '#A9A9AE', collar: true, tie: '#3B4A6B' });     // 첫 번째 세계의 면접관
const RSJ = rsChar('#B7C9A8', { longHair: '#3A2A22', hair: '#3A2A22' });              // 두 번째 세계의 면접관
const RSX = (vest, hair) => rsChar(vest, hair ? { hair } : {});                        // 동료
const rsPt = (x, y, s, lx, ly) => [x + (lx - 200) * s, y + (ly - 560) * s];
E['rs평온'] = Object.assign({}, E['z기본'], { mouth: 'M190 238 L210 238', mouthFill: 'none', fxUnder: null }); // 평범한 얼굴(웃지도 노려보지도 않는다)
const rsTalk = (base, t) => { E['_rsq'] = qTalk(base, env(t)); return fEx('_rsq'); };
const rsClipY = (id, y) => `<defs><clipPath id="${id}"><rect x="-800" y="-800" width="3600" height="${y + 800}"/></clipPath></defs>`;
const rsSitY = (ty, s = 1) => ty + 10 + 148 * s;                                       // 책상 뒤에 앉은 사람의 발 위치
const rsSitPose = () => Object.assign({}, P['서기'], rsArmType);
function rsRib(k, w, text, q = 0, qk = 1) { // 달력 띠(세계 꼬리표 + 때) + 질문 딱지
  if (k <= 0) return ''; const e = easeOut(clamp(k, 0, 1));
  let g = `<g transform="translate(${f1(lerp(-1100, -60, e))} 58)"><rect x="6" y="-38" width="900" height="84" rx="16" fill="${INK}" opacity=".2"/><rect x="0" y="-44" width="900" height="84" rx="16" fill="#fff" stroke="${INK}" stroke-width="6"/><rect x="0" y="-44" width="340" height="84" rx="16" fill="${w[1]}" stroke="${INK}" stroke-width="6"/>${fT(170, 14, w[0], 42, '#fff')}${fT(620, 12, text, 34, NAVY, { w: 700 })}`;
  for (let i = 0; i < q; i++) g += `<g transform="translate(${962 + i * 84} -2) scale(${i === q - 1 ? rsSc(qk) : 1})"><circle r="34" fill="#fff" stroke="${INK}" stroke-width="6"/>${fT(0, 16, '?', 46, w[1])}</g>`;
  return g + `</g>`;
}
function rsTable(x0, x1, y, gy, o = {}) { // 앞판이 있는 책상·탁자
  return `<ellipse cx="${(x0 + x1) / 2}" cy="${gy + 8}" rx="${(x1 - x0) / 2}" ry="16" fill="#2A1A30" opacity=".16"/><rect x="${x0 + 22}" y="${y + 20}" width="${x1 - x0 - 44}" height="${gy - y - 20}" fill="${o.pcol || '#DDB88A'}" stroke="${INK}" stroke-width="7"/><rect x="${x0}" y="${y}" width="${x1 - x0}" height="30" rx="8" fill="${o.col || '#C89B6A'}" stroke="${INK}" stroke-width="7"/>`;
}
const rsLidAt = (x, y, w = 176, h = 100) => `<rect x="${x - w / 2 - 8}" y="${y - 6}" width="${w + 16}" height="12" rx="5" fill="#8E97A6" stroke="${INK}" stroke-width="5"/><rect x="${x - w / 2}" y="${y - h - 2}" width="${w}" height="${h}" rx="12" fill="#C3C9D4" stroke="${INK}" stroke-width="7"/>`;
const rsPaper = (x, y, s, rot, yl) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})"><rect x="-34" y="-46" width="68" height="92" rx="4" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-24" y="-32" width="40" height="6" rx="3" fill="#C5CCD8"/><rect x="-24" y="-18" width="48" height="6" rx="3" fill="#C5CCD8"/>${yl ? `<rect x="-26" y="-4" width="52" height="11" rx="3" fill="${RS.YL}" stroke="${INK}" stroke-width="2"/>` : `<rect x="-24" y="-4" width="44" height="6" rx="3" fill="#C5CCD8"/>`}<rect x="-24" y="16" width="36" height="6" rx="3" fill="#C5CCD8"/></g>`;
function rsBadge(x, y, s, o = {}) { // 사원증(원점은 카드 위쪽 가운데). o.strip: 뒤에 붙은 한 줄
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${s})">` + (o.strip ? rsStrip(28, 76, 0.2, { rot: -10 }) : '') + `<rect x="-46" y="0" width="92" height="124" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="-46" y="0" width="92" height="30" rx="10" fill="${o.col || RS.BLUE}" stroke="${INK}" stroke-width="5"/><rect x="-12" y="-8" width="24" height="12" rx="4" fill="#8E97A6" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="62" r="19" fill="#E9EDF4" stroke="${INK}" stroke-width="4"/>${fT(0, 112, o.title || '사원', 22, NAVY)}</g>`;
}
const rsCord = (a, b, c) => `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(c[0])} ${f1(c[1])} L${f1(b[0])} ${f1(b[1])}" fill="none" stroke="${RS.BLUE}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
function rsBag(x, y, s, o = {}) { // 어깨 가방(원점은 몸통 위쪽 가운데). o.strip: 옮겨 붙은 한 줄(0~1), o.glow
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${s})"><path d="M-70 4 Q-60 ${-(o.strap || 150)} 0 ${-(o.strap || 150)} Q60 ${-(o.strap || 150)} 70 4" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M-70 4 Q-60 ${-(o.strap || 150)} 0 ${-(o.strap || 150)} Q60 ${-(o.strap || 150)} 70 4" fill="none" stroke="#6B5A48" stroke-width="7" stroke-linecap="round"/><rect x="-100" y="0" width="200" height="150" rx="22" fill="#8A7660" stroke="${INK}" stroke-width="7"/><path d="M-100 20 Q0 86 100 20 L100 16 Q100 0 80 0 L-80 0 Q-100 0 -100 16 Z" fill="#A08B72" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="-12" y="52" width="24" height="18" rx="5" fill="#E9D9B0" stroke="${INK}" stroke-width="4"/>` +
    (o.strip ? (o.glow ? `<rect x="-96" y="82" width="192" height="44" rx="12" fill="none" stroke="${RS.YL}" stroke-width="9" opacity="${rsOp(o.glow)}"/>` : '') + rsStrip(0, 104, 0.27 * o.strip, { rot: -3 }) : '') + `</g>`;
}
const rsChrome = (title, clock) => `<rect x="250" y="40" width="1420" height="780" fill="#F4F6FA"/><rect x="250" y="40" width="1420" height="58" fill="#DDE2EA"/>` + [0, 1, 2].map(i => `<circle cx="${286 + i * 30}" cy="69" r="9" fill="${['#F08A6B', '#F5C451', '#7FD8B0'][i]}"/>`).join('') + `<rect x="400" y="50" width="760" height="38" rx="19" fill="#fff"/>` + fT(428, 79, title, 26, '#5B6478', { anchor: 'start', w: 700 }) + fT(1640, 80, clock, 28, '#3A4252', { anchor: 'end', w: 700 });
function rsMem(k, inner, o = {}) { // 기억 창: 다른 세계의 같은 장면(작고 흐리게)
  if (k <= 0) return ''; const w = RSW1;
  return `<g transform="translate(${o.x || 1560} ${o.y || 330}) scale(${rsSc(k)})" opacity="${rsOp(o.op == null ? 0.92 : o.op)}"><rect x="-252" y="-152" width="520" height="340" rx="32" fill="${INK}" opacity=".2"/><rect x="-260" y="-170" width="520" height="340" rx="32" fill="${INK}"/><g clip-path="url(#rsInset)"><rect x="-250" y="-160" width="500" height="320" fill="${o.bg || '#F4F6FA'}"/>${inner}<rect x="-250" y="-160" width="500" height="320" fill="#fff" opacity=".22"/></g><g transform="translate(-120 -168)">${label(0, 0, w[0], { size: 28, bg: w[1], color: '#fff' })}</g></g>`;
}

/* ---------- 9·17·27번: 메일함 ---------- */
function rsMailUI(t, rows, o = {}) {
  let g = rsChrome('메일', o.clock || '오전 10:03') + `<rect x="250" y="98" width="236" height="722" fill="#E9EDF4"/><rect x="266" y="122" width="204" height="58" rx="12" fill="${RS.BLUE}"/>` + fT(368, 161, '받은편지함', 28, '#fff') + [0, 1, 2].map(i => `<rect x="286" y="${212 + i * 56}" width="${[150, 120, 164][i]}" height="16" rx="8" fill="#C5CCD8"/>`).join('');
  let y = 122;
  rows.forEach(r => { const k = r.k == null ? 1 : clamp(r.k, 0, 1); if (k <= 0) return; const e = easeOut(k);
    g += `<g transform="translate(0 ${f1(y)})" opacity="${rsOp(k * 2.5)}"><g transform="translate(1070 46) scale(${f1((r.k == null ? 1 : lerp(0.9, 1, easeOutBack(k))) * 1000) / 1000}) translate(-1070 -46)"><rect x="506" y="0" width="1140" height="92" rx="14" fill="${r.hot || '#fff'}" stroke="${r.hot ? INK : '#C9CED8'}" stroke-width="${r.hot ? 5 : 3}"/>` + (r.dim ? '' : `<circle cx="536" cy="46" r="9" fill="${RS.BLUE}"/>`) + fT(562, 36, r.from, 26, '#5B6478', { anchor: 'start', w: 700 }) + fT(562, 76, r.subj, 34, r.dim ? '#7A8394' : NAVY, { anchor: 'start', w: r.dim ? 700 : 900 }) + fT(1622, 38, r.time, 24, '#8B93A3', { anchor: 'end', w: 700 }) + (r.strip ? rsStrip(1452, 60, 0.42, { rot: -3 }) : '') + `</g></g>`; y += 104 * e; });
  return g + (o.extra || '');
}
const RS_OLD = [{ from: '카드 고객센터', subj: '이번 달 이용 명세서 안내', time: '어제', dim: 1 }, { from: '동기 모임', subj: '이번 달 회비 정산', time: '월요일', dim: 1 }, { from: '구립 도서관', subj: '대출 도서 반납 안내', time: '지난주', dim: 1 }];
function rsMailOpen(t, lt, tQ, tN) { // 인사팀 메일을 연 화면
  let g = rsChrome('메일', '오전 9:14') + `<rect x="290" y="118" width="1340" height="680" rx="16" fill="#fff" stroke="#C9CED8" stroke-width="3"/>` + fT(330, 182, '[인사팀] 경력 확인 서류 제출 안내', 40, NAVY, { anchor: 'start' }) + fT(330, 226, '보낸 사람  인사팀', 26, '#7A8394', { anchor: 'start', w: 700 }) + `<line x1="330" y1="246" x2="1590" y2="246" stroke="#D5DAE3" stroke-width="3"/>`;
  g += fT(330, 300, '입사지원서에 적으신 아래 경력의 확인 서류를', 34, '#2B3445', { anchor: 'start', w: 700 }) + fT(330, 350, '금요일까지 제출해 주시기 바랍니다.', 34, '#2B3445', { anchor: 'start', w: 700 });
  g += `<rect x="330" y="384" width="10" height="96" rx="5" fill="#C5CCD8"/>` + (lt > tQ ? `<g transform="translate(700 432) scale(${rsSc((lt - tQ) / 0.3)})">${rsStrip(0, 0, 1.0, {})}</g>` : '');
  const hot = rsK(tN, tN + 0.4, lt);
  g += `<rect x="330" y="520" width="1260" height="240" rx="16" fill="${hot > 0.5 ? '#FFF8E8' : '#F7F9FC'}" stroke="${hot > 0.5 ? '#F08A6B' : '#9AA3B4'}" stroke-width="5" stroke-dasharray="18 14"/>` + fT(366, 572, '첨부 파일', 30, '#5B6478', { anchor: 'start' }) + fT(1556, 572, '0개', 34, hot > 0.5 ? '#C4472A' : '#7A8394', { anchor: 'end' }) + fT(960, 668, '첨부한 파일이 없습니다', 36, '#A3AAB8', { w: 700 });
  return g;
}
function rsmailScene(t, lt, a) {
  if (a.w === 1) {
    const tM = rsW(a, '달', 5.19) - 0.75, tH = rsW(a, '최종', 7.05), tP = rsW(a, '합격', 8.39);
    if (lt < tM) return rsDefs() + rsZoom(rsLaptop(t, rsForm({ tab: 3, mins: 9, clock: '오전 2:51', body: rsEssay(t, { shown: 999, yl: RS.LINE.length, cursor: false, ylGlow: 0.5 + 0.4 * Math.sin(lt * 4) }) })), lerp(1.2, 1.34, easeInOut(rsK(0, tM, lt))), 640, 640) + rsRib(1, RSW1, '지원서를 낸 새벽') + rsVeil(lt, tM, 0.16, 0.6);
    const k = (lt - tH) / 0.35, zk = easeInOut(rsK(tH + 0.2, tH + 1.7, lt)), joy = Math.sin(Math.PI * rsK(tP + 0.1, tP + 0.75, lt)), u = lt - tH - 0.2; let ex = '';
    if (u > 0) for (let i = 0; i < 12; i++) { const an = i * 0.55 + 0.2, r = 60 + 300 * easeOut(rsK(0, 0.8, u)), x = 1070 + Math.cos(an) * r * 1.5, y = 190 + Math.sin(an) * r * 0.5; ex += `<rect x="${f1(x)}" y="${f1(y)}" width="14" height="14" rx="3" fill="${['#F08A6B', '#F5C451', '#7FD8B0', '#7C8BE0'][i % 4]}" opacity="${rsOp(1.2 - rsK(0.5, 1.6, u))}" transform="rotate(${i * 40} ${f1(x)} ${f1(y)})"/>`; }
    const rows = [{ from: '채용 담당', subj: '[전형 결과] 최종 합격을 축하드립니다', time: '오전 10:02', k, hot: '#E7F8F0', strip: 1 }].concat(RS_OLD);
    return rsDefs() + rsZoom(rsLaptop(t, rsMailUI(t, rows, { extra: ex }), { hy: -70 * joy }), lerp(1.0, 1.24, zk), lerp(900, 1040, zk), lerp(480, 210, zk)) + rsRib((lt - tM) / 0.4, RSW1, '한 달 뒤') + rsVeil(lt, tM, 0.16, 0.6);
  }
  if (a.w === 'hr') {
    const tI = rsW(a, '인사팀', 0.73), tO = rsW(a, '지원서', 4.82) - 0.45, tQ = rsW(a, '경력', 5.71), tN = rsW(a, '낼', 10.28) - 0.45;
    if (lt < tO) { const k = (lt - tI) / 0.35, zk = easeInOut(rsK(tI + 0.3, tI + 1.8, lt));
      const rows = [{ from: '인사팀', subj: '[인사팀] 경력 확인 서류 제출 안내', time: '오전 9:12', k, hot: '#FFF4E0' }, { from: '회의 참석자 전체', subj: '어제 고객사 회의록 공유', time: '어제', dim: 1 }].concat(RS_OLD.slice(0, 2));
      return rsDefs() + rsZoom(rsLaptop(t, rsMailUI(t, rows, { clock: '오전 9:13' })), lerp(1.0, 1.2, zk), lerp(900, 1040, zk), lerp(480, 220, zk)) + rsRib(lt / 0.4, RSW1, '회의 다음 날') + rsVeil(lt, tO, 0.16, 0.6); }
    const zk = easeInOut(rsK(tN - 0.3, tN + 1.6, lt));
    return rsDefs() + rsZoom(rsLaptop(t, rsMailOpen(t, lt, tQ, tN)), lerp(1.03, 1.3, zk), lerp(900, 960, zk), lerp(470, 640, zk)) + rsRib(1, RSW1, '회의 다음 날') + rsVeil(lt, tO, 0.16, 0.6);
  }
  // 두 번째 세계: 불합격 세 통
  const tB = rsW(a, '불합격', 2.95), tS = rsW(a, '세', 5.25), tT = rsW(a, '통', 5.73), t2 = Math.min(tS - 0.75, tB + 1.2), t3 = tS + 0.1;
  const mk = (from, time, tt) => ({ from, subj: '[전형 결과] 불합격 안내', time, k: (lt - tt) / 0.35, hot: '#EEF1F6' });
  const rows = [mk('채용 운영팀', '오전 11:20', t3), mk('인재채용팀', '오전 10:41', t2), mk('채용 담당', '오전 10:02', tB)].concat(RS_OLD);
  const droop = easeInOut(rsK(tT + 0.4, tT + 1.2, lt)), zk = easeInOut(rsK(tB, tT + 1.2, lt));
  const mem = `<rect x="-226" y="-96" width="452" height="92" rx="14" fill="#E7F8F0" stroke="${INK}" stroke-width="5"/>` + fT(-204, -60, '채용 담당', 24, '#5B6478', { anchor: 'start', w: 700 }) + fT(-204, -22, '최종 합격을 축하드립니다', 30, NAVY, { anchor: 'start' }) + rsStrip(40, 60, 0.6, { rot: -3 });
  return rsDefs() + rsZoom(rsLaptop(t, rsMailUI(t, rows, { clock: '오전 11:21' }), { hy: 46 * droop }), lerp(1.0, 1.16, zk), lerp(900, 1000, zk), lerp(480, 280, zk)) + rsRib(lt / 0.4, RSW2, '한 달 뒤') + rsMem(Math.min((lt - t3 - 0.5) / 0.35, (tT + 3.2 - lt) / 0.3), mem, { x: 1540, y: 600 });
}

/* ---------- 10~12번: 사무실(사원증 → 시연 요청 → 웃음이 멎는다) ---------- */
const RSO = { GY: 975, DY: 822, ZX: 780 };
function rsODesk(o = {}) { // 제로의 자리. 윗면 y 822
  return rsTable(520, 1040, RSO.DY, RSO.GY) + `<path d="M962 792 q20 6 0 22" fill="none" stroke="${INK}" stroke-width="5"/><rect x="930" y="786" width="34" height="38" rx="6" fill="#fff" stroke="${INK}" stroke-width="5"/>` + (o.empty ? '' : rsLidAt(RSO.ZX, RSO.DY));
}
const rsOZero = (t, o) => `<g clip-path="url(#rsT)">${RSZW(Object.assign({ x: RSO.ZX, y: rsSitY(RSO.DY), s: 1, t, pose: rsSitPose(), seed: 3 }, o))}</g>`;
function rsofficeScene(t, lt, a) {
  const ph = a.ph, GY = RSO.GY, ZX = RSO.ZX; let w = '', cam, rib = '';
  if (ph === 'badge') {
    const tS = rsW(a, '사원증', 0.87), tG = rsW(a, '걸었', 2.13), tW = rsW(a, '세상', 3.55), x = 960, s = 1.0;
    const up = easeInOut(rsK(tS - 0.2, tG - 0.3, lt)), dn = easeOut(rsK(tG, tG + 0.4, lt)), joy = Math.sin(Math.PI * rsK(tW, tW + 1.25, lt));
    const A0 = { armL: [[148, 285], [122, 330], [150, 338]], hL: [156, 336], armR: [[252, 285], [278, 330], [250, 338]], hR: [244, 336] }, A1 = { armL: [[148, 285], [112, 300], [134, 264]], hL: [140, 258], armR: [[252, 285], [288, 300], [266, 264]], hR: [260, 258] };
    const lift = Math.sin(Math.PI * rsK(tS - 0.1, tG, lt) * 0.5), mixA = k => ({ armL: A0.armL.map((p, i) => [lerp(p[0], A1.armL[i][0], k), lerp(p[1], A1.armL[i][1], k)]), hL: [lerp(A0.hL[0], A1.hL[0], k), lerp(A0.hL[1], A1.hL[1], k)], armR: A0.armR.map((p, i) => [lerp(p[0], A1.armR[i][0], k), lerp(p[1], A1.armR[i][1], k)]), hR: [lerp(A0.hR[0], A1.hR[0], k), lerp(A0.hR[1], A1.hR[1], k)] });
    const hold = Object.assign({}, P['서기'], mixA(lift)), pose = dn <= 0 ? hold : mixPose(hold, mixPose('서기', '만세', joy), dn), sy = 1 + 0.04 * Math.sin(Math.PI * rsK(tG, tG + 0.35, lt)) + 0.03 * joy;
    const Q = (lx, ly) => rsPt(x, GY, s, lx, ly), sw = dn > 0 ? 9 * Math.sin((lt - tG) * 7) * Math.exp(-(lt - tG) * 1.4) : 0, b = Q(200 + sw * 0.5, 322);
    w += qShadow(x, GY, 92, 0.5) + RSZW({ x, y: GY, s, sy, t, pose, ex: fEx(lt > tG ? 'z뿌듯' : 'z반짝'), look: lt > tG ? [0, 0] : [0, 0.7], seed: 3 });
    w += (dn <= 0 ? (lift > 0.05 ? rsCord(Q(hold.hL[0], hold.hL[1]), Q(hold.hR[0], hold.hR[1]), [b[0], b[1] + 4]) : '') : rsCord(Q(176, 264), Q(224, 264), [b[0], b[1] + 4])) + rsBadge(b[0], b[1], 0.8, { rot: sw, strip: 1 });
    if (dn <= 0) w += hand(...Q(hold.hL[0], hold.hL[1]), 0.7) + hand(...Q(hold.hR[0], hold.hR[1]), 0.7); else w += (typeof cmpSpark === 'function' ? cmpSpark(x, 760, (lt - tG) / 0.5, 110) : '');
    const ck = easeInOut(rsK(tW + 1.05, tW + 2.0, lt)); cam = [960, lerp(612, 778, ck), lerp(1.3, 2.5, ck)];
    rib = rsRib(lt / 0.4, RSW1, '입사 첫날');
  } else if (ph === 'ask') {
    const tT = rsW(a, '분석', 2.19), tSi = rsW(a, '시연', 4.43), bx = lerp(1580, 1290, easeOut(rsK(0, 0.6, lt))), walking = lt < 0.55;
    const jolt = lt > tSi ? 1 + 0.035 * Math.sin((lt - tSi) * 11) * Math.exp(-(lt - tSi) * 4) : 1;
    w += rsOZero(t, { sy: jolt, ex: fEx(lt > tSi ? 'z당황' : lt > tT ? 'z멍' : 'z히죽'), look: [0.8, -0.15] }) + rsODesk();
    const bp = Object.assign({}, walking ? walkPose(bx * 0.045, 0.7) : P['서기'], { armL: [[148, 285], [112, 330], [146, 352]], hL: [154, 354] }), hp = rsPt(bx, GY, 1, 154, 354 + (bp.dy || 0));
    w += qShadow(bx, GY, 92, 0.5) + RSB({ x: bx, y: GY, s: 1, t, pose: bp, ex: rsTalk('z기본', t), look: [-0.8, 0.1], seed: 21 }) + rsPaper(hp[0] - 30, hp[1] - 34, 1, -10, 1) + hand(hp[0], hp[1], 0.7);
    cam = qLerpCam(lt / 5.5, [1040, 612, 1.2], [1010, 608, 1.3]);
    rib = rsRib(1, RSW1, '입사 첫 주', lt > tSi + 0.75 ? 1 : 0, (lt - tSi - 0.75) / 0.3);
  } else { const dk = easeOutBack(rsK(0.35, 0.85, lt));
    w += rsOZero(t, { ex: fEx(lt > 0.3 ? 'z당황' : 'z멍'), look: lt > 1.0 ? [0, -0.8] : [0.8, -0.15], still: true }) + rsODesk() + (lt > 0.35 ? rsStrip(ZX, lerp(320, 408, dk), 0.6, {}) : '');
    cam = qLerpCam(lt / 2.6, [870, 606, 1.5], [800, 596, 1.75]); rib = rsRib(1, RSW1, '입사 첫 주', 1);
  }
  return rsDefs() + rsClipY('rsT', RSO.DY) + qdPlate('rsoffice', cam, 1.0) + qCam(cam, w) + rib;
}

/* ---------- 13번: 밤마다 검색창 → 동료의 눈길 ---------- */
function rsSearchUI(t, u) { // 지어낸 검색 화면
  const Q = [['매출 분석 툴 사용법', '오전 12:40'], ['분석 툴 시연 하는 법', '오전 1:35'], ['데이터 분석 3일 완성', '오전 2:20'], ['시연 안 떨고 하는 법', '오전 3:05']];
  const i = clamp(Math.floor(u / 1.1), 0, 3), uu = u - i * 1.1, cur = Q[i][0], typed = cur.slice(0, Math.floor(cur.length * rsK(0.05, 0.62, uu)));
  let g = rsChrome('검색', Q[i][1]) + `<rect x="470" y="140" width="980" height="88" rx="44" fill="#fff" stroke="${RS.BLUE}" stroke-width="6"/><circle cx="524" cy="182" r="16" fill="none" stroke="${INK}" stroke-width="6"/><line x1="536" y1="194" x2="550" y2="208" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` + fT(576, 198, typed, 40, NAVY, { anchor: 'start' });
  if (Math.floor(t * 2.2) % 2 === 0) g += `<rect x="${f1(582 + rsTw(typed, 40))}" y="162" width="4" height="44" fill="${INK}"/>`;
  g += fT(480, 296, '최근 검색', 28, '#7A8394', { anchor: 'start', w: 700 });
  for (let j = i - 1, r = 0; j >= 0; j--, r++) { const y = 326 + r * 92 + (r === 0 ? 0 : 0); g += `<g opacity="${rsOp(r === 0 ? rsK(0, 0.25, uu) + (i ? 0 : 1) : 1)}"><rect x="470" y="${y}" width="980" height="76" rx="14" fill="#fff" stroke="#C9CED8" stroke-width="3"/><circle cx="512" cy="${y + 38}" r="15" fill="none" stroke="#8B93A3" stroke-width="4"/><path d="M512 ${y + 29} V${y + 39} H520" fill="none" stroke="#8B93A3" stroke-width="4" stroke-linecap="round"/>${fT(548, y + 50, Q[j][0], 34, '#3A4252', { anchor: 'start', w: 700 })}${fT(1426, y + 49, Q[j][1], 26, '#8B93A3', { anchor: 'end', w: 700 })}</g>`; }
  return g;
}
function rsnightsScene(t, lt, a) {
  const tC = rsW(a, '동료', 5.37) - 0.4, tLook = rsW(a, '쳐다', 6.07), tH = rsW(a, '가슴', 6.99);
  if (lt < tC) return rsDefs() + rsZoom(rsLaptop(t, rsSearchUI(t, lt - 0.2)), lerp(1.03, 1.12, easeInOut(rsK(0, tC, lt))), 900, 440) + rsStrip(1500, 250, lerp(0.5, 0.82, easeInOut(rsK(0.3, tC, lt))), { rot: 3 }) + rsRib(lt / 0.4, RSW1, '그날부터 · 밤마다') + rsVeil(lt, tC, 0.16, 0.6);
  const u = lt - tC, GY = RSO.GY, cx = lerp(1560, 1300, easeOut(rsK(0, 0.7, u))), seen = lt > tLook, jk = lt > tH ? (lt - tH) : -1;
  const sy = jk >= 0 ? 1 + 0.034 * Math.abs(Math.sin(jk * 8.5)) * Math.exp(-jk * 1.3) : seen ? 1 + 0.04 * Math.sin(Math.PI * rsK(tLook + 0.15, tLook + 0.45, lt)) : 1;
  let w = rsOZero(t, { sy, ex: fEx(lt > tLook + 0.15 ? 'z당황' : 'z멍'), look: lt > tLook + 0.9 ? [0, 0.7] : lt > tLook + 0.15 ? [0.85, 0] : [0, 0.6] }) + rsODesk() + rsStrip(RSO.ZX, 402, lerp(0.62, 0.72, easeInOut(rsK(tH, tH + 0.8, lt))), {});
  const cp = Object.assign({}, u < 0.65 ? walkPose(cx * 0.045, 0.7) : P['서기'], { armL: [[148, 285], [120, 336], [150, 362]], hL: [158, 364] }), hp = rsPt(cx, GY, 1, 158, 364 + (cp.dy || 0));
  w += qShadow(cx, GY, 92, 0.5) + RSX('#9CC8F0', '#5A3A22')({ x: cx, y: GY, s: 1, t, pose: cp, ex: fEx('z기본'), look: seen ? [-0.85, 0] : [-0.2, 0.5], seed: 31 }) + `<rect x="${f1(hp[0] - 22)}" y="${f1(hp[1] - 40)}" width="36" height="42" rx="6" fill="#fff" stroke="${INK}" stroke-width="5"/>` + hand(hp[0], hp[1], 0.7);
  if (jk >= 0 && jk < 1.6) for (let i = 0; i < 2; i++) w += `<path d="M${RSO.ZX - 150 - i * 26} ${640 + i * 4} q-16 14 0 30" fill="none" stroke="#E8707F" stroke-width="7" stroke-linecap="round" opacity="${rsOp(Math.abs(Math.sin(jk * 8.5)) * (1 - jk / 1.6))}"/><path d="M${RSO.ZX + 150 + i * 26} ${640 + i * 4} q16 14 0 30" fill="none" stroke="#E8707F" stroke-width="7" stroke-linecap="round" opacity="${rsOp(Math.abs(Math.sin(jk * 8.5)) * (1 - jk / 1.6))}"/>`;
  const cam = qLerpCam(u / 4.5, [1000, 612, 1.2], [960, 606, 1.3]);
  return rsDefs() + rsClipY('rsT', RSO.DY) + qdPlate('rsoffice', cam, 1.0) + qCam(cam, w) + rsRib(1, RSW1, '그날부터 · 밤마다', 1) + rsVeil(lt, tC, 0.16, 0.6);
}

/* ---------- 14번: 가면 증후군 ---------- */
const rsPaperBg = () => { let w = `<rect x="-3000" y="-3000" width="8000" height="7000" fill="#F7F2E6"/>`; for (let i = 0; i < 26; i++) for (let j = 0; j < 14; j++) w += `<circle cx="${-160 + i * 90}" cy="${-20 + j * 90}" r="3" fill="#D9D0BC"/>`; return w; };
const rsMaskIcon = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 -34 Q0 -50 40 -34 Q46 10 26 36 Q0 54 -26 36 Q-46 10 -40 -34 Z" fill="#fff" stroke="${INK}" stroke-width="6"/><ellipse cx="-16" cy="-8" rx="9" ry="6" fill="${INK}"/><ellipse cx="16" cy="-8" rx="9" ry="6" fill="${INK}"/><path d="M-14 18 Q0 30 14 18" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/></g>`;
function rsCardBox(x, y, w, h, title, col, inner, o = {}) {
  return `<g transform="translate(${x} ${y}) scale(${o.sc == null ? 1 : o.sc})" opacity="${rsOp(o.op == null ? 1 : o.op)}"><rect x="${-w / 2 + 8}" y="${-h / 2 + 10}" width="${w}" height="${h}" rx="30" fill="${INK}" opacity=".18"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="30" fill="${o.bg || '#fff'}" stroke="${INK}" stroke-width="7"/>${inner}<g transform="translate(0 ${-h / 2})">${label(0, 0, title, { size: 36, bg: col, color: o.tcol || NAVY })}</g></g>`;
}
const rsRow = (x, y, done, k = 1) => k <= 0 ? '' : `<g transform="translate(${x} ${y}) scale(${rsSc(k)})"><rect x="0" y="-32" width="320" height="64" rx="14" fill="${done ? '#F1FBF6' : '#fff'}" stroke="${done ? INK : '#9AA3B4'}" stroke-width="${done ? 5 : 4}"${done ? '' : ' stroke-dasharray="14 10"'}/>${done ? `<circle cx="34" cy="0" r="17" fill="#3CC79A" stroke="${INK}" stroke-width="4"/>` + rsCheck(34, 0, 0.8, '#fff', 5) + `<rect x="66" y="-9" width="210" height="18" rx="9" fill="#C5CCD8"/>` : ''}</g>`;
function rsmaskScene(t, lt, a) {
  const tF = rsW(a, '가짜', 2.33), tM = rsW(a, '가면', 3.79), tZ = rsW(a, '제로는', 7.29) - 0.35, tN = rsW(a, '아니었', 9.47), tJ = rsW(a, '지어낸', 11.63);
  let w = rsPaperBg(), L = '', R = '';
  L += [0, 1, 2].map(i => rsRow(20, -150 + i * 86, true, (lt - 0.2 - i * 0.22) / 0.25)).join('') + fT(180, 110, '실제로 해낸 일', 28, '#5B6478', { w: 700 });
  L += RSX('#9CC8F0', '#3A2A22')({ x: -170, y: 262, s: 0.74, t, pose: '서기', ex: fEx(lt > tF ? 'z민망' : 'z기본'), look: lt > tF ? [-0.2, 0.5] : [0.6, -0.2], seed: 41 });
  if (lt > tF) L += `<g transform="translate(-150 -176) scale(${rsSc((lt - tF) / 0.3)})">${bubble(0, 0, 170, 96, rsMaskIcon(0, 0, 0.72), {})}</g>`;
  w += rsCardBox(540, 540, 760, 560, '해낸 사람', '#DCE9FB', L);
  if (lt > tM) w += `<g transform="translate(540 858) scale(${rsSc((lt - tM) / 0.3)})">${label(0, 0, '가면 증후군', { size: 44, bg: '#FFD9C9' })}</g>` + (lt > tM + 0.4 ? fT(540, 920, '가면 현상 · Clance & Imes, 1978', 26, '#7A8394', { w: 700 }) : '');
  if (lt > tZ) { const k = (lt - tZ) / 0.35;
    R += [0, 1, 2].map(i => rsRow(20, -150 + i * 86, false, (lt - tZ - 0.25 - i * 0.2) / 0.25)).join('') + (lt > tZ + 0.3 ? fT(180, 110, '실제로 해낸 일', 28, '#5B6478', { w: 700 }) : '') + (lt > tZ + 0.95 ? `<g transform="translate(180 -150) scale(${rsSc((lt - tZ - 0.95) / 0.3)})">${rsStrip(0, 0, 0.56, { rot: -2 })}</g>` : '');
    R += RSZW({ x: -170, y: 262, s: 0.74, t, pose: '서기', ex: fEx('z멍'), look: [0.5, -0.3], seed: 3 });
    w += rsCardBox(1380, 540, 760, 560, '제로', '#FFF1B8', R, { sc: rsSc(k) });
    if (lt > tN - 0.5) { const sk = rsK(tN, tN + 0.5, lt); w += `<g transform="translate(1380 858) scale(${rsSc((lt - tN + 0.5) / 0.3)})" opacity="${rsOp(1 - 0.45 * sk)}">${label(0, 0, '가면 증후군', { size: 44, bg: '#FFD9C9' })}<line x1="-150" y1="2" x2="${f1(-150 + 300 * sk)}" y2="2" stroke="${INK}" stroke-width="7" stroke-linecap="round"/></g>`; }
    if (lt > tJ) w += `<g transform="translate(1380 938) rotate(-2) scale(${rsSc((lt - tJ) / 0.3)})">${label(0, 0, '정말로 지어낸 것', { size: 40, bg: RS.YL })}</g>`;
  }
  const cam = qLerpCam((lt - tZ + 0.5) / 1.3, [620, 560, 1.15], [960, 566, 1.0]);
  return rsDefs() + qCam(cam, w) + rsRib(1, RSW1, '입사 첫 주');
}

/* ---------- 15~16번: 고객사 회의 ---------- */
function rsDash(x, y, w, h) { // 벽의 발표 화면(지어낸 툴)
  let g = `<rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" rx="14" fill="#2B303B" stroke="${INK}" stroke-width="7"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#F7F9FC"/><rect x="${x}" y="${y}" width="${w}" height="56" fill="#DDE2EA"/>` + fT(x + 24, y + 40, '매출 분석 툴', 32, NAVY, { anchor: 'start' });
  [90, 130, 110, 170, 150, 215].forEach((bh, i) => g += `<rect x="${x + 44 + i * 60}" y="${y + h - 36 - bh}" width="40" height="${bh}" rx="6" fill="${i === 5 ? '#F08A6B' : '#9DB7E8'}" stroke="${INK}" stroke-width="3"/>`);
  g += `<polyline points="${[0, 1, 2, 3, 4, 5].map(i => `${x + 64 + i * 60},${y + h - 150 - [0, 30, 18, 70, 60, 120][i]}`).join(' ')}" fill="none" stroke="#3CC79A" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  for (let i = 0; i < 4; i++) g += `<rect x="${x + w - 200}" y="${y + 96 + i * 54}" width="${[160, 120, 150, 100][i]}" height="18" rx="9" fill="#C5CCD8"/>`;
  return g;
}
function rsmeetScene(t, lt, a) {
  const ph = a.ph, GY = 985, TY = 852, zx = 250; let w = rsDash(430, 150, 620, 380), cam, q = 1, qk = 1;
  const tJ = rsW(a, '직접', 1.09), end = ph === 0 ? rsW(a, '맞죠', 2.61) + 0.75 : -9;
  const u = ph === 1 ? lt : -1, e1 = u > 0.45, e2 = u > 0.85, low = ph === 1 ? easeInOut(rsK(1.2, 2.3, u)) : 0, fold = ph === 1 ? easeInOut(rsK(2.2, 2.95, u)) : 0;
  const up = { armR: [[252, 285], [300, 296], [334, 262]], hR: [342, 254] }, dnA = { armR: P['서기'].armR, hR: P['서기'].hR };
  const zp = Object.assign({}, P['서기'], { armR: up.armR.map((p, i) => [lerp(p[0], dnA.armR[i][0], low), lerp(p[1], dnA.armR[i][1], low)]), hR: [lerp(up.hR[0], dnA.hR[0], low), lerp(up.hR[1], dnA.hR[1], low)] });
  const hp = rsPt(zx, GY, 1, zp.hR[0], zp.hR[1]);
  w += qShadow(zx, GY, 92, 0.5) + RSZW({ x: zx, y: GY, s: 1, t, pose: zp, ex: fEx(ph === 1 ? 'z당황' : lt > tJ ? 'z멍' : 'z히죽'), look: ph === 1 ? (u > 1.4 ? [0.2, 0.7] : [0.8, 0]) : [0.8, -0.1], seed: 3, still: ph === 1 }) + `<rect x="${f1(hp[0] - 8)}" y="${f1(hp[1] - 34)}" width="16" height="44" rx="6" fill="#3A4252" stroke="${INK}" stroke-width="4"/>` + hand(hp[0], hp[1], 0.7);
  if (ph === 1) w += rsStrip(zx + 40, lerp(330, 396, easeOutBack(rsK(0.2, 0.7, u))), lerp(0.7, 0.98, easeInOut(rsK(0.7, 3.4, u))), {});
  // 탁자 뒤의 세 사람
  const sit = rsSitY(TY), toZ = [-0.9, -0.05], toS = [-0.75, -0.5];
  let ppl = RSC({ x: 1170, y: sit, s: 1, t, pose: rsSitPose(), ex: ph === 0 ? rsTalk('rs평온', t) : fEx('rs평온'), look: ph === 0 ? (lt > 0.1 ? toZ : toS) : toZ, seed: 51 });
  ppl += RSX('#B7C9A8', '#5A3A22')({ x: 1440, y: sit, s: 1, t, pose: rsSitPose(), ex: fEx('rs평온'), look: e1 ? toZ : toS, seed: 52 });
  ppl += RSB({ x: 1710, y: sit, s: 1, t, pose: rsSitPose(), ex: fEx('rs평온'), look: fold > 0.3 ? [-0.3, 0.8] : e2 ? toZ : toS, seed: 21 });
  w += `<g clip-path="url(#rsT)">${ppl}</g>` + rsTable(960, 2010, TY, GY);
  w += `<rect x="1120" y="${TY - 10}" width="96" height="10" rx="3" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="1392" y="${TY - 12}" width="96" height="12" rx="4" fill="#8E97A6" stroke="${INK}" stroke-width="4"/>`;
  w += `<rect x="1640" y="${TY - 10}" width="70" height="10" rx="3" fill="${RS.BLUE}" stroke="${INK}" stroke-width="4"/><g transform="rotate(${f1(-180 * fold)} 1710 ${TY})"><rect x="1710" y="${TY - 10}" width="70" height="10" rx="3" fill="${RS.BLUE}" stroke="${INK}" stroke-width="4"/></g>` + (fold < 0.5 ? `<rect x="1648" y="${TY - 16}" width="124" height="6" rx="2" fill="#fff" stroke="${INK}" stroke-width="3"/>` : '');
  if (ph === 0) { cam = qLerpCam(lt / 3.6, [990, 592, 1.12], [1010, 598, 1.17]); if (lt > end) { q = 2; qk = (lt - end) / 0.3; } }
  else { cam = qLerpCam((u - 0.9) / 2.6, [1010, 598, 1.17], [650, 584, 1.36]); q = 2; }
  return rsDefs() + rsClipY('rsT', TY) + qdPlate('rsmeeting', cam, 1.0) + qCam(cam, w) + rsRib(ph === 0 ? lt / 0.4 : 1, RSW1, '석 달째 · 고객사 회의', q, qk);
}

/* ---------- 18번: 인사팀 ---------- */
function rshrScene(t, lt, a) {
  const tC = rsW(a, '확인이', 2.47), GY = 985, TY = 852, cam = qLerpCam(lt / 5, [960, 598, 1.14], [960, 600, 1.2]), camM = [1920 - cam[0], cam[1], cam[2]];
  let ppl = RSZW({ x: 700, y: rsSitY(TY), s: 1, t, pose: rsSitPose(), ex: fEx('z멍'), look: [0.25, 0.75], tilt: 3, seed: 3, still: true });
  ppl += RSH({ x: 1220, y: rsSitY(TY), s: 1, t, pose: rsSitPose(), ex: rsTalk('rs평온', t), look: lt > tC ? [-0.8, 0] : [-0.3, 0.7], seed: 61 });
  const w = `<g clip-path="url(#rsT)">${ppl}</g>` + rsTable(480, 1440, TY, GY) + `<rect x="1100" y="${TY - 10}" width="110" height="10" rx="3" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
  const uk = rsK(tC, tC + 0.9, lt), px = -300 + 540 * uk, py = 64 + 8 * Math.sin(uk * Math.PI);
  let over = `<g transform="translate(1060 288) scale(${rsSc((lt - 0.25) / 0.35)})"><rect x="-374" y="-142" width="760" height="300" rx="20" fill="${INK}" opacity=".2"/><rect x="-380" y="-150" width="760" height="300" rx="20" fill="#fff" stroke="${INK}" stroke-width="7"/>` + fT(-344, -94, '입사지원서 · 경력', 30, '#5B6478', { anchor: 'start', w: 700 }) + `<rect x="-344" y="-64" width="520" height="16" rx="8" fill="#D9DEE8"/><rect x="-344" y="100" width="420" height="16" rx="8" fill="#D9DEE8"/>` + rsStrip(-34, 12, 0.92, {});
  if (uk > 0) over += `<path d="M-300 64 Q-30 78 ${f1(px)} ${f1(py)}" fill="none" stroke="#4A4A4A" stroke-width="6" stroke-linecap="round"/>` + (uk < 1 ? `<g transform="translate(${f1(px)} ${f1(py)}) rotate(38)"><rect x="-7" y="-150" width="14" height="128" rx="5" fill="#F5C451" stroke="${INK}" stroke-width="4"/><path d="M-7 -22 L0 0 L7 -22 Z" fill="#E9D9B0" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>` : '');
  over += `</g>`;
  return rsDefs() + rsClipY('rsT', TY) + `<g transform="translate(1920 0) scale(-1 1)">${qdPlate('rsinterview', camM, 1.0)}</g>` + qCam(cam, w) + over + rsRib(lt / 0.4, RSW1, '그 주 금요일 · 인사팀');
}

/* ---------- 19번: 사원증 반납 ---------- */
const rsSleeve = (x0, y0, x1, y1, col = '#F4F4F8') => `<path d="M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y1)}" stroke="${INK}" stroke-width="64" stroke-linecap="round"/><path d="M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y1)}" stroke="${col}" stroke-width="50" stroke-linecap="round"/>`;
function rsreturnScene(t, lt, a) {
  const bx = 800, by = 640, dn = easeInOut(rsK(0.35, 1.5, lt)), drop = easeIn(rsK(1.6, 1.95, lt)), cx = bx + 6, cy = lerp(210, 520, dn) + 136 * drop, rel = easeOut(rsK(1.6, 2.3, lt));
  let w = `<rect x="-300" y="880" width="2600" height="500" fill="#C89B6A"/><rect x="-300" y="880" width="2600" height="28" fill="#DDB88A" stroke="${INK}" stroke-width="6"/>`;
  w += `<path d="M${bx - 250} ${by} L${bx - 206} ${by - 50} L${bx + 206} ${by - 50} L${bx + 250} ${by} Z" fill="#AEB8C8" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  const hx = cx + 96 + 520 * rel, hy = cy - 190 - 420 * rel, sway = Math.sin(lt * 4) * 3 * (1 - drop);
  if (lt < 1.62) w += rsCord([hx - 30, hy + 16], [hx + 6, hy + 20], [cx, cy + 4]);
  w += rsBadge(cx, cy, 1.7, { rot: sway, strip: lt < 1.3 });
  w += `<rect x="${bx - 250}" y="${by}" width="500" height="244" rx="10" fill="#E3E8F1" stroke="${INK}" stroke-width="8"/><rect x="${bx - 176}" y="${by + 74}" width="352" height="100" rx="12" fill="#fff" stroke="${INK}" stroke-width="5"/>` + fT(bx, by + 142, '사원증 반납', 50, NAVY);
  w += rsSleeve(hx + 20, hy - 10, hx + 520, hy - 520) + hand(hx, hy, 2.4);
  // 가방(오른쪽, 계산대 위)
  const land = rsK(3.0, 3.25, lt), gl = lt > 3.05 ? 0.5 + 0.5 * Math.sin((lt - 3.05) * 6) : 0;
  w += rsBag(1500, 682, 1.3, { strip: lt >= 3.05 ? 1 + 0.12 * Math.sin(Math.PI * land) : 0, glow: gl, strap: 210 });
  // 떨어져 나온 한 줄
  if (lt >= 1.3 && lt < 3.05) { const s0 = [cx + 52, lerp(210, 520, easeInOut(rsK(0.35, 1.5, 1.3))) + 130], fl = easeInOut(rsK(1.85, 3.05, lt)), hov = Math.sin(lt * 5) * 5 * (1 - fl);
    w += rsStrip(lerp(s0[0], 1500, fl), lerp(s0[1], 817, fl) - 150 * Math.sin(Math.PI * fl) + hov, lerp(0.34, 0.35, fl), { rot: lerp(-10, -3, fl) }); }
  const cam0 = [960, 560, 1.15];
  return rsDefs() + `<g filter="url(#rsBlur)">${qdPlate('rsoffice', cam0, 1.0)}</g>` + fFull('#F4EBD6', 0.3) + rsZoom(w, lerp(1.0, 1.06, easeInOut(rsK(0, 4, lt))), 1000, 640) + rsRib(lt / 0.4, RSW1, '수습 석 달이 끝나는 날', 2);
}

/* ---------- 20번: 계약은 거기까지 ---------- */
function rsleaveScene(t, lt, a) {
  const tB = rsW(a, '그런데', 3.49), GY = RSO.GY, D = a._dur || 8.5, zx = lerp(560, 1240, rsK(0, D + 0.6, lt));
  const pose = walkPose(zx * 0.034, 0.55), hp = rsPt(zx, GY, 1, pose.hR[0], pose.hR[1] + (pose.dy || 0)), bg = lt > tB ? 0.5 + 0.5 * Math.sin((lt - tB) * 5) : 0;
  let w = rsODesk({ empty: 1 }) + qShadow(zx, GY, 92, 0.5) + RSZW({ x: zx, y: GY, s: 1, t, pose, ex: fEx('z멍'), look: [0.6, 0.6], tilt: 5, seed: 3 });
  w += rsBag(hp[0] + 4, hp[1] + 96, 0.62, { strip: 1, glow: bg, rot: Math.sin(zx * 0.034 - 0.6) * 5, strap: 150 });
  const ck = easeInOut(rsK(tB - 0.2, tB + 1.5, lt)), cam = [lerp(zx + 120, hp[0] + 10, ck), lerp(606, 800, ck), lerp(1.22, 2.3, ck)];
  return rsDefs() + qdPlate('rsoffice', cam, 1.0) + qCam(cam, w) + rsRib(1, RSW1, '수습 석 달이 끝나는 날', 2);
}

/* ---------- 21·30·31번: 면접(같은 구도) ---------- */
function rsShelfBubble(lt, tA, tB) { // 31번: 날짜가 다른 상자를 한 칸에 → 칸마다 날짜
  const k = easeInOut(rsK(tB, tB + 0.8, lt)), box = (x, y, col) => `<rect x="${f1(x - 34)}" y="${f1(y - 30)}" width="68" height="60" rx="6" fill="#DDAE74" stroke="${INK}" stroke-width="5"/><rect x="${f1(x - 18)}" y="${f1(y - 12)}" width="36" height="22" rx="4" fill="${col}" stroke="${INK}" stroke-width="3"/>`;
  let g = `<g transform="translate(960 250) scale(${rsSc((lt - tA) / 0.3)})"><path d="M-250 150 L-300 214 L-190 150 Z" fill="#fff" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-400" y="-160" width="800" height="316" rx="40" fill="#fff" stroke="${INK}" stroke-width="7"/><rect x="-252" y="144" width="66" height="12" fill="#fff"/>`;
  const one = 1 - k; // 처음에는 한 칸, 나중에는 두 칸
  g += `<rect x="${f1(lerp(-170, -330, k))}" y="-100" width="${f1(lerp(340, 300, k))}" height="210" rx="10" fill="#EEF1F6" stroke="${INK}" stroke-width="6"/>` + (k > 0.02 ? `<rect x="30" y="-100" width="300" height="210" rx="10" fill="#EEF1F6" stroke="${INK}" stroke-width="6" opacity="${rsOp(k * 2)}"/>` : '');
  const B = '#7CB2F0', O = '#F5A45C', P0 = [[-110, 76, B], [-36, 76, O], [38, 76, B], [112, 76, O], [-74, 14, O], [0, 14, B]], P1 = [[-254, 76], [106, 76], [-180, 76], [180, 76], [143, 14], [-217, 14]];
  const tg = [[-180, B, '3일'], [180, O, '7일']];
  P0.forEach((p, i) => { const q = P1[i]; g += box(lerp(p[0], q[0], k), lerp(p[1], q[1], k) - 40 * Math.sin(Math.PI * k), p[2]); });
  if (k > 0.6) tg.forEach(([x, c, s]) => g += `<g transform="translate(${x} -100) scale(${rsSc((k - 0.6) / 0.3)})"><rect x="-58" y="-26" width="116" height="52" rx="12" fill="${c}" stroke="${INK}" stroke-width="5"/>${fT(0, 13, s, 34, NAVY)}</g>`);
  else if (one > 0.9 && lt > tA + 0.5) g += `<g transform="translate(232 0) scale(${rsSc((lt - tA - 0.5) / 0.3)})"><circle r="34" fill="#fff" stroke="${INK}" stroke-width="6"/>${fT(0, 16, '?', 46, '#C4472A')}</g>`;
  return g + `</g>`;
}
function rsinterviewScene(t, lt, a) {
  const w1 = a.w === 1, ph = a.ph || 0, GY = 985, TY = 852, sit = rsSitY(TY); let cam, over = '', rib, zo, io, extra = '';
  if (w1) { const tS = rsW(a, '석', 2.25), rk = easeOut(rsK(tS, tS + 0.7, lt));
    zo = { ex: fEx(lt > tS ? 'z당황' : 'rs담담'), look: lt > tS + 0.5 ? [0.2, 0.75] : [0.8, 0] }; io = { ex: rsTalk('rs평온', t), look: lt > 0.9 ? [-0.8, 0] : [-0.4, 0.6] };
    extra = lt > tS ? rsStrip(lerp(520, 700, rk), lerp(800, 404, rk), lerp(0.3, 0.78, rk), { rot: lerp(-3, 0, rk) }) : '';
    cam = qLerpCam((lt - 0.8) / 3.2, [960, 598, 1.14], [840, 594, 1.3]); rib = rsRib(lt / 0.4, RSW1, '그 뒤의 면접', lt > tS + 1.3 ? 3 : 2, (lt - tS - 1.3) / 0.3);
  } else if (ph === 0) { const tH = rsW(a, '세셨', 1.71), tQ = rsW(a, '숫자는', 3.48), end = rsW(a, '맞았', 4.99) + 0.9;
    zo = { ex: fEx(lt > tQ ? 'z기본' : 'rs담담'), look: [0.8, 0] }; io = { ex: rsTalk(lt > tH ? 'z반짝' : 'z기본', t), look: lt > tH ? [-0.8, 0] : [-0.4, 0.6], tilt: lt > tQ ? -5 : 0 };
    cam = qLerpCam(lt / 6, [960, 598, 1.14], [1060, 598, 1.24]); rib = rsRib(lt / 0.4, RSW2, '네 번째 지원 · 면접', lt > end ? 1 : 0, (lt - end) / 0.3);
  } else { const tA = rsW(a, '들어온', 0.15), tB = rsW(a, '뒤로는', 4.63) - 0.3, nod = lt > tB + 1.0 ? Math.sin((lt - tB - 1.0) * 6) * 3 * Math.exp(-(lt - tB - 1.0) * 0.8) : 0;
    zo = { ex: rsTalk('z기본', t), look: [0.8, -0.1], pose: Object.assign({}, rsSitPose(), { armR: [[252, 285], [296, 318], [322, 276 + 6 * Math.sin(lt * 4)]], hR: [328, 268 + 6 * Math.sin(lt * 4)] }) }; io = { ex: fEx(lt > tB + 0.9 ? 'z빵긋' : 'z반짝'), look: [-0.8, 0], tilt: -3 + nod };
    over = rsShelfBubble(lt, tA + 0.1, tB); cam = qLerpCam(lt / 7, [900, 610, 1.16], [880, 612, 1.22]); rib = rsRib(1, RSW2, '네 번째 지원 · 면접', 1);
  }
  let ppl = RSZW(Object.assign({ x: 700, y: sit, s: 1, t, pose: rsSitPose(), seed: 3 }, zo)) + (w1 ? RSI : RSJ)(Object.assign({ x: 1220, y: sit, s: 1, t, pose: Object.assign({}, rsSitPose(), { armL: [[148, 285], [124, 330], [156, 350]], hL: [164, 352] }), seed: w1 ? 71 : 72 }, io));
  const hp = rsPt(1220, sit, 1, 164, 352);
  let w = (w1 ? rsBag(520, 742, 0.62, { strip: lt > rsW(a, '석', 2.25) ? 0 : 1, strap: 120 }) : '') + `<g clip-path="url(#rsT)">${ppl}${rsPaper(hp[0] - 26, hp[1] - 30, 1, 8, false)}</g>` + rsTable(480, 1440, TY, GY) + extra;
  return rsDefs() + rsClipY('rsT', TY) + qdPlate('rsinterview', cam, 1.0) + qCam(cam, w) + over + rib;
}

/* ---------- 22~23번: 그해 겨울, 새벽 2시 ---------- */
const RS_GRAY = '영업지원팀(수습) · 3개월';
const rsStripG = (x, y, s, o = {}) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${o.rot || 0}) scale(${f1(s * 1000) / 1000})" opacity="${rsOp(o.op == null ? 1 : o.op)}"><rect x="-304" y="-30" width="620" height="76" rx="12" fill="${INK}" opacity=".22"/><rect x="-310" y="-38" width="620" height="76" rx="12" fill="#C9CED8" stroke="${INK}" stroke-width="6"/>${fT(0, 15, RS_GRAY, 42, '#3A4252')}</g>`;
function rsCareer2(t, u) { // 겨울의 지원서: 지워지지 않는 한 줄과 '퇴사 사유' 칸
  let g = fT(300, 310, '경력 사항', 34, '#3A4252', { anchor: 'start' }) + `<rect x="300" y="332" width="1320" height="88" rx="12" fill="#fff" stroke="#B8BECB" stroke-width="4"/>` + fT(334, 390, '물류창고 아르바이트', 38, NAVY, { anchor: 'start' }) + fT(1590, 390, '3개월', 34, '#3A4252', { anchor: 'end' });
  g += `<rect x="300" y="434" width="1320" height="88" rx="12" fill="#D5D9E0" stroke="${INK}" stroke-width="5"/>` + fT(334, 492, '영업지원팀 (수습)', 38, '#3A4252', { anchor: 'start' }) + fT(1590, 492, '3개월', 34, '#3A4252', { anchor: 'end' });
  const ty = u > 1.2 && u < 3.0 ? '개인 사정'.slice(0, u < 2.5 ? Math.min(5, Math.floor((u - 1.2) / 0.16) + 1) : Math.max(0, 5 - Math.floor((u - 2.5) / 0.09) - 1)) : '';
  g += fT(300, 584, '퇴사 사유', 34, '#3A4252', { anchor: 'start' }) + `<rect x="300" y="604" width="1320" height="100" rx="12" fill="#fff" stroke="${RS.BLUE}" stroke-width="6"/>` + (ty ? fT(332, 668, ty, 38, '#2B3445', { anchor: 'start', w: 700 }) : fT(332, 668, '', 38, '#2B3445'));
  if (Math.floor(t * 2.2) % 2 === 0) g += `<rect x="${f1(338 + rsTw(ty, 38))}" y="634" width="4" height="44" fill="${INK}"/>`;
  return g;
}
function rswinterScene(t, lt, a) {
  if (a.ph === 0) return rsDefs() + rsZoom(rsLaptop(t, rsForm({ tab: 2, mins: 58, clock: '오전 2:02', body: rsCareer2(t, lt) + rsStrip(520, 776, 0.42, { rot: -4 }), noBtn: 1 })), lerp(1.0, 1.09, easeInOut(rsK(0, 4.2, lt))), 900, 520) + rsRib(lt / 0.4, RSW1, '그해 겨울 · 새벽 2시', 3);
  const tJ = rsW(a, '지어낸', 1.01), tV = rsW(a, '값으로', 1.63), tG = rsW(a, '지울', 2.11), tE = rsW(a, '세계는', 7.29) - 0.45, fz = lt > tE, TF = (a._t0 || 0);
  const yk = (lt - tJ) / 0.4, gk = (lt - tG) / 0.4, ak = rsK(tV, tV + 0.5, lt);
  let ex = '';
  if (yk > 0) ex += `<g transform="translate(700 318) scale(${rsSc(yk)})">${rsStrip(0, 0, 0.66, {})}</g>`;
  if (ak > 0) ex += `<path d="M${920} 318 L${f1(920 + 76 * ak)} 318" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>` + (ak > 0.9 ? `<path d="M984 300 L1006 318 L984 336" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>` : '');
  if (gk > 0) ex += `<g transform="translate(1230 318) scale(${rsSc(gk)})">${rsStripG(0, 0, 0.66, {})}</g>`;
  const pull = easeInOut(rsK(tE, tE + 2.6, lt)), cam = lt < tE ? qLerpCam(lt / tE, [960, 606, 1.3], [960, 600, 1.38]) : [960, lerp(600, 620, pull), lerp(1.38, 1.14, pull)];
  const tz = fz ? t - (lt - tE) : t;
  return rsFaceShot(t, cam, { tz, clock: '2:02', z: { ex: fEx('z멍'), look: lt > tJ ? [lt > tG ? 0.45 : -0.45, -0.7] : [0, 0.55], still: fz, noBlink: fz }, extra: ex }) + rsRib(1, RSW1, '그해 겨울 · 새벽 2시', 3) + fFull('#F7F2E6', rsOp(rsK(tE + 1.5, tE + 2.9, lt)));
}

/* ---------- 24~25번: 되감기 → 다른 쪽 가지 ---------- */
const rsBz = (p0, p1, p2, p3, u) => { const m = 1 - u; return [m * m * m * p0[0] + 3 * m * m * u * p1[0] + 3 * m * u * u * p2[0] + u * u * u * p3[0], m * m * m * p0[1] + 3 * m * m * u * p1[1] + 3 * m * u * u * p2[1] + u * u * u * p3[1]]; };
function rsPicto(i) { // 되감기에 스쳐 가는 장면들(반납함·회의·사원증·메일·제출)
  const s = `stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;
  return [`<rect x="-20" y="-8" width="40" height="26" rx="3" fill="#E3E8F1" ${s}/><path d="M-20 -8 L-12 -18 L12 -18 L20 -8" fill="none" ${s}/>`,
    `<rect x="-24" y="-6" width="48" height="8" rx="3" fill="#C89B6A" ${s}/><path d="M-16 2 V18 M16 2 V18" fill="none" ${s}/>`,
    `<rect x="-13" y="-14" width="26" height="34" rx="4" fill="#fff" ${s}/><rect x="-13" y="-14" width="26" height="10" rx="4" fill="${RS.BLUE}" ${s}/><path d="M-8 -22 L0 -14 L8 -22" fill="none" ${s}/>`,
    `<rect x="-22" y="-14" width="44" height="30" rx="4" fill="#fff" ${s}/><path d="M-22 -12 L0 4 L22 -12" fill="none" ${s}/>`,
    `<circle r="18" fill="#3CC79A" ${s}/>` + rsCheck(0, 0, 0.9, '#fff', 5)][i];
}
function rsrewindScene(t, lt, a) {
  const TF = rsL('s2').t0 - 0.15, F = [800, 505], U = [1400, 290], D = [1400, 720], cU = [F, [F[0] + 220, F[1]], [U[0] - 420, U[1]], [U[0] - 200, U[1]]], cD = [F, [F[0] + 220, F[1]], [D[0] - 420, D[1]], [D[0] - 200, D[1]]];
  const ph = a.ph, back = ph === 0 ? rsK(0.75, 2.0, lt) : 1, fwd = ph === 0 ? easeInOut(rsK(2.1, 2.9, lt)) : 1;
  let cam = [960, 560, 1], w = rsPaperBg();
  const path = c => `M${c[0][0]} ${c[0][1]} C${c[1][0]} ${c[1][1]} ${c[2][0]} ${c[2][1]} ${c[3][0]} ${c[3][1]}`, ln = (d, col, sw = 13) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/>`;
  w += ln(`M-200 505 L${F[0]} 505`, '#3A4A6B') + ln(path(cU), fwd > 0.3 ? '#A9B1C2' : '#3A4A6B') + ln(path(cD), '#3A4A6B') + (fwd > 0 ? ln(path(cD), '#2E8B6F', 7) : '');
  if (ph === 0) { [0.86, 0.69, 0.52, 0.35, 0.18].forEach((u, i) => { const p = rsBz(...cU, u), gone = rsK(u + 0.02, u - 0.1, 1 - back), k = 1 - rsK(0, 1, (1 - back < u ? (u - (1 - back)) / 0.12 : 0)); if (k > 0.02) w += `<g transform="translate(${f1(p[0])} ${f1(p[1] - 62)}) scale(${f1(k * 100) / 100})"><circle r="40" fill="#fff" stroke="${INK}" stroke-width="5"/>${rsPicto(i)}</g>`; });
    const dp = fwd > 0 ? rsBz(...cD, fwd) : rsBz(...cU, 1 - back); if (lt > 0.6 && fwd < 1) w += `<circle cx="${f1(dp[0])}" cy="${f1(dp[1])}" r="18" fill="${fwd > 0 ? '#2E8B6F' : RS.BLUE}" stroke="${INK}" stroke-width="5"/>`;
    if (back < 1 && lt > 0.6) for (let i = 0; i < 7; i++) { const x = ((i * 337 + t * 2600) % 2400) - 200, y = 130 + i * 122; w += `<rect x="${f1(x)}" y="${y}" width="170" height="7" rx="3" fill="#8B93A3" opacity=".35"/>`; }
    const pk = easeInOut(rsK(0, 0.7, lt)); cam = [lerp(U[0], 960, pk), lerp(U[1] + 6, 560, pk), lerp(4.6, 1, pk)];
  } else { const tJ = rsW(a, '지운', 2.25), zk = easeIn(rsK(tJ - 0.5, tJ + 2.0, lt)); cam = [lerp(960, D[0], rsK(0, 0.6, zk)), lerp(560, D[1] + 6, rsK(0, 0.6, zk)), lerp(1, 5.0, zk)]; }
  w += `<circle cx="${F[0]}" cy="${F[1]}" r="13" fill="#fff" stroke="${INK}" stroke-width="6"/>` + rsMini(520, 505, 1, TF, 'both', { shake: Math.sin(t * 30) * 1.2 });
  const dim = ph === 0 ? 1 - 0.5 * fwd : 0.5, gl = ph === 0 ? (fwd >= 1 ? 0.6 + 0.4 * Math.sin((lt - 2.9) * 7) : 0) : 0.7;
  w += `<g opacity="${rsOp(dim)}">${rsMini(U[0], U[1], 1, TF, 'keep', {})}<g transform="translate(${U[0]} ${U[1] + 190})">${label(0, 0, '그 줄을 남긴 세계', { size: 32, bg: '#FFF1B8' })}</g></g>`;
  w += rsMini(D[0], D[1], 1, TF, 'erase', { glow: gl }) + `<g transform="translate(${D[0]} ${D[1] + 190})" opacity="${rsOp(ph === 1 ? 1 - rsK(1.6, 2.2, lt) : 1)}">${label(0, 0, '그 줄을 지운 세계', { size: 32, bg: '#CDEFE0' })}</g>`;
  let over = '';
  if (ph === 0 && lt > 0.55 && back < 1) over += `<g transform="translate(1700 150)" opacity="${rsOp(0.55 + 0.45 * Math.sin(t * 14))}"><path d="M0 -34 L-44 0 L0 34 Z M52 -34 L8 0 L52 34 Z" fill="${INK}"/></g>`;
  return rsDefs() + qCam(cam, w) + over + (ph === 0 ? fFull('#F7F2E6', rsOp(1 - rsK(0, 0.3, lt))) : fFull('#fff', rsOp(rsK(rsW(a, '지운', 2.25) + 1.35, rsW(a, '지운', 2.25) + 1.9, lt) * 0.9)));
}
