/* act2.js — 연기·표정 2단계 (engine.js + zw/face2.js + anim2.js 위에 얹어 쓴다). 모든 함수는 시간 t만으로 계산한다(병렬 렌더 가능).
   1) 얼굴 리그 ACT.face: 눈(뜨기·깜빡임·웃는 아래 눈꺼풀·크기·반짝임)·눈썹(올림·걱정·화·짝눈썹)·입(모음 입 모양)·볼터치를 매 프레임 조립한다.
   2) 립싱크 ACT.lipTrack/ACT.lip: 대본 글자 → 음절별 모음 입 모양(ㅏ·ㅓ·ㅗ·ㅜ·ㅡ·ㅣ·ㅐ) + ㅁ·ㅂ·ㅍ 입술 닫힘, 크기는 소리 크기.
   3) 눈 연기 ACT.saccade: 시선은 미끄러지지 않고 '휙' 옮겨 가서 멈춘다. 크게 옮길 땐 깜빡인다. ACT.blink: 빨리 감고 천천히 뜬다.
   4) 팝 ACT.pop: 커졌다 돌아오는 반동(눈 커짐·머리 늘어남·기호 등장).
   5) 만화 기호 ACT.sym: 머리 좌표에 붙어 같이 움직이고, 튀어나와 흔들리다 사라진다.
   7) 복잡한 감정 재료: 짝입꼬리 c=[왼,오른], 입술 떨림 wob, 삐죽·입술 깨물기, 볼 부풀림 puff, 무거운 눈꺼풀 flat, 멍한 눈 hl:false, 미간 찌푸림 knit, 눈물 tear, 한숨 ACT.sigh.
   6) 감정 몸짓 ACT.attitude: 부끄러움·시무룩·신남 같은 감정을 몸 전체 선으로. */
const ACT = {};
const MO2 = '#5A1E2A', TONG2 = '#FF8FA3';
// ---------- 시간 곡선 ----------
ACT.blinkK = (t, t0, dur = 0.17) => { const u = (t - t0) / dur; if (u <= 0 || u >= 1) return 0; return u < 0.4 ? easeIn(u / 0.4) : 1 - easeOut((u - 0.4) / 0.6); }; // 빨리 감고 천천히 뜬다
ACT.blinks = (t, times, dur) => times.reduce((m, b) => Math.max(m, ACT.blinkK(t, b, dur)), 0);
ACT.natBlink = (t, seed = 1, per = 3.4) => { const p = per + hash(seed) * 1.4, ph = (t + hash(seed + 5) * p) % p; return ACT.blinkK(ph, 0, 0.17); };
// 반동 팝: t0에 0 → peak(1+over) → 1로 안착. 반환값은 '얼마나 커졌나'(0 = 그대로, 1 = 목표, 1.x = 지나침)
ACT.pop = (t, t0, f = 2.6, z = 0.32) => A2.spring(t, t0, f, z);
// 뾰족한 일시 펄스(0→1→0): 끄덕·강조
ACT.pulse = (t, t0, dur = 0.25) => { const u = (t - t0) / dur; return u <= 0 || u >= 1 ? 0 : Math.sin(u * Math.PI) * (1 - u * 0.3); };
// 한숨: t0부터 들숨(inh초, 0→+1) → 날숨(exh초, +1→-1) → 조금 돌아와 -0.4에 머묾. 몸 높이·어깨·머리에 곱해 쓴다
ACT.sigh = (t, t0, inh = 0.5, exh = 1.0) => { if (t <= t0) return 0; if (t < t0 + inh) return easeInOut((t - t0) / inh); const u = (t - t0 - inh) / exh; if (u < 1) return lerp(1, -1, easeOut(u)); return lerp(-1, -0.4, easeInOut(clamp((u - 1) * exh / 0.6, 0, 1))); };
// 시선 '휙': keys = [[t, [x,y]], ...], 옮기는 데 sn초(0.06). 머무는 동안 아주 작은 떨림(살아 있는 눈)
ACT.saccade = (t, keys, sn = 0.06, seed = 1) => { let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
  const a = i ? keys[i - 1][1] : keys[0][1], b = keys[i][1], k = i ? easeOut(clamp((t - keys[i][0]) / sn, 0, 1)) : 1;
  const j = Math.floor(t * 3 + seed) , jx = (hash(j * 7 + seed) - 0.5) * 0.08, jy = (hash(j * 13 + seed) - 0.5) * 0.06;
  return [lerp(a[0], b[0], k) + jx, lerp(a[1], b[1], k) + jy]; };
// 큰 시선 이동에는 깜빡임을 붙인다(사람은 고개·눈을 크게 돌릴 때 깜빡인다)
ACT.saccadeBlinks = (keys, min = 0.9) => keys.slice(1).filter((k, i) => Math.hypot(k[1][0] - keys[i][1][0], k[1][1] - keys[i][1][1]) >= min).map(k => k[0] - 0.03);

// ---------- 눈 ----------
// 위·아래 반지름이 다른 타원(ryB < 0이면 아래가 위로 휘어 웃는 눈 '∩'이 된다)
ACT.eyePath = (cx, cy, rx, ryT, ryB) => { const k = 0.5523;
  return `M${f1(cx - rx)} ${f1(cy)} C${f1(cx - rx)} ${f1(cy - k * ryT)} ${f1(cx - k * rx)} ${f1(cy - ryT)} ${f1(cx)} ${f1(cy - ryT)} C${f1(cx + k * rx)} ${f1(cy - ryT)} ${f1(cx + rx)} ${f1(cy - k * ryT)} ${f1(cx + rx)} ${f1(cy)}` +
    ` C${f1(cx + rx)} ${f1(cy + k * ryB)} ${f1(cx + k * rx)} ${f1(cy + ryB)} ${f1(cx)} ${f1(cy + ryB)} C${f1(cx - k * rx)} ${f1(cy + ryB)} ${f1(cx - rx)} ${f1(cy + k * ryB)} ${f1(cx - rx)} ${f1(cy)} Z`; };
ACT.star4 = (cx, cy, r, rot = 0, fill = '#fff') => `<path transform="rotate(${f1(rot)} ${f1(cx)} ${f1(cy)})" d="M${f1(cx)} ${f1(cy - r)} Q${f1(cx + r * 0.16)} ${f1(cy - r * 0.16)} ${f1(cx + r)} ${f1(cy)} Q${f1(cx + r * 0.16)} ${f1(cy + r * 0.16)} ${f1(cx)} ${f1(cy + r)} Q${f1(cx - r * 0.16)} ${f1(cy + r * 0.16)} ${f1(cx - r)} ${f1(cy)} Q${f1(cx - r * 0.16)} ${f1(cy - r * 0.16)} ${f1(cx)} ${f1(cy - r)} Z" fill="${fill}"/>`;
// e = { open(0~1, 1=뜸), squint(0~1 웃는 아래 눈꺼풀), size(1), sparkle(0~1), openL/openR(윙크), wet(0~1 촉촉), squeeze(>0.5면 꽉 감은 > <), flat(0~1 무거운 윗눈꺼풀), hl(false면 하이라이트 끔: 멍한 눈) }
ACT.eyes = e => { const sz = e.size || 1, sq = clamp(e.squint || 0, 0, 1); let g = '';
  [[165, -1], [235, 1]].forEach(([cx, side]) => {
    const open = clamp(side < 0 ? (e.openL != null ? e.openL : (e.open == null ? 1 : e.open)) : (e.openR != null ? e.openR : (e.open == null ? 1 : e.open)), 0, 1);
    const rx = 13 * sz, ry = 18 * sz, cy = 190 + sq * 3, ryB = ry * (1 - 1.55 * sq), ryT0 = ry * (1 - 0.15 * sq), b = 1 - open, ryT = ryT0 - (ryT0 + ryB) * b;
    if (e.squeeze > 0.5) { const y = cy + 2; g += `<path d="M${f1(cx - side * 13)} ${f1(y - 12)} L${f1(cx + side * 9)} ${f1(y)} L${f1(cx - side * 13)} ${f1(y + 12)}" fill="none" stroke="${EY}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`; return; } // 꽉 감은 눈 > <
    if (b > 0.84 || ryT + ryB < 2.2) { const bend = lerp(7, -13, sq), y = cy + ryB * 0.5; g += `<path d="M${f1(cx - rx - 3)} ${f1(y)} Q${f1(cx)} ${f1(y + bend)} ${f1(cx + rx + 3)} ${f1(y)}" fill="none" stroke="${EY}" stroke-width="8" stroke-linecap="round"/>`; return; }
    g += `<path d="${ACT.eyePath(cx, cy, rx, ryT, ryB)}" fill="${EY}"/>`;
    // 하이라이트: 큰 것(위·오른쪽) + 작은 것(아래·왼쪽). 감기는 동안 위에서부터 가려진다
    const top = cy - ryT, hy = cy - 7 * sz, sp = clamp(e.sparkle || 0, 0, 1);
    if (e.hl !== false && hy - 5 > top) g += sp > 0.05 ? ACT.star4(cx + 5 * sz, hy, (6 + 7 * sp) * sz, sp * 20) : `<circle cx="${f1(cx + 5 * sz)}" cy="${f1(hy)}" r="${f1(5.8 * sz)}" fill="#fff"/>`;
    if (e.hl !== false && cy + 6 * sz < cy + ryB - 3 && cy + 6 * sz - 3 > top) g += `<circle cx="${f1(cx - 4 * sz)}" cy="${f1(cy + 6 * sz)}" r="${f1(2.8 * sz)}" fill="#fff"/>`;
    // 무거운 윗눈꺼풀(e.flat 0~1): 위를 평평하게 잘라 '−_−' 느낌(어이없음·체념·곁눈질)
    if (e.flat > 0.02) { const ly = cy - ry + 2 * ry * e.flat * 0.55; g += `<rect x="${f1(cx - rx - 4)}" y="${f1(cy - ry - 8)}" width="${f1(2 * rx + 8)}" height="${f1(ly - (cy - ry - 8))}" fill="#fff"/><path d="M${f1(cx - rx - 4)} ${f1(ly + side * e.flat * 1.5)} L${f1(cx + rx + 4)} ${f1(ly - side * e.flat * 1.5)}" stroke="${EY}" stroke-width="7" stroke-linecap="round"/>`; }
    if (e.wet) g += `<path d="M${f1(cx - rx + 3)} ${f1(cy + ryB * 0.55)} Q${f1(cx)} ${f1(cy + ryB + 2)} ${f1(cx + rx - 3)} ${f1(cy + ryB * 0.55)}" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="${f1(e.wet * 100) / 100}"/>`;
  });
  return g; };

// ---------- 입 ----------
// 입 모양 매개변수: w(반폭), T(윗입술 높이), B(아랫입술 깊이), k(둥근 정도)
ACT.VIS = { M: [15, 0, 2, 0.7], A: [21, 5, 30, 0.95], EO: [17, 6, 22, 1], O: [12.5, 11, 16, 1], U: [9, 7, 10, 1], EU: [22, 1.5, 9, 0.75], I: [24, 2, 12, 0.8], E: [21, 4, 20, 0.9] };
ACT.vowelVis = m => [0, 2, 9].includes(m) ? 'A' : [4, 6, 14].includes(m) ? 'EO' : [8, 12, 11].includes(m) ? 'O' : [13, 17, 16].includes(m) ? 'U' : [18, 19].includes(m) ? 'EU' : m === 20 ? 'I' : 'E';
// 입 그리기(머리 좌표). v = [w,T,B,k], o = 벌림 0~1, c = 입꼬리(+웃음/-시무룩, [왼, 오른]이면 짝입꼬리), id = clipPath용 고유 이름
// x = { wob(입술 떨림 0~1), t(떨림 시간), dx(입을 옆으로), style: 'bite'(입술 깨물기) | 'pout'(삐죽 '3') }
ACT.mouth = (v, o, c = 2, id = 'm', x = {}) => { const [w0, T0, B0, k] = v, w = w0 * lerp(0.86, 1, o), T = T0 * o, B = Math.max(B0 * o, 0), y0 = 236, x0 = 200 - w, x1 = 200 + w;
  const [cL, cR] = Array.isArray(c) ? c : [c, c], cm = (cL + cR) / 2, yL = y0 - cL, yR = y0 - cR, wob = x.wob || 0, tt = x.t || 0, wv = Math.sin(tt * 27) * wob;
  const wrap = g => x.dx ? `<g transform="translate(${f1(x.dx)} 0)">${g}</g>` : g;
  if (x.style === 'bite') return wrap(`<path d="M${f1(x0 + 2)} ${f1(yL + 2)} Q200 ${f1(y0 + 1 + cm * 0.6)} ${f1(x1 - 2)} ${f1(yR + 2)}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><rect x="192" y="${f1(y0 + 1)}" width="16" height="9" rx="3" fill="#fff" stroke="${INK}" stroke-width="3.5"/>`);
  if (x.style === 'pout') return wrap(`<path d="M196 ${f1(222 + wv * 2)} Q209 224 206 231 Q203 236 208 240 Q212 249 196 250" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`);
  if (B < 3.2) { if (wob > 0.02) return wrap(`<path d="M${f1(x0)} ${f1(yL)} Q${f1(200 - w / 2)} ${f1(y0 + 3 + cm * 0.9 + 5 * wv)} 200 ${f1(y0 + 2 + cm * 0.5)} Q${f1(200 + w / 2)} ${f1(y0 + 3 + cm * 0.9 - 5 * wv)} ${f1(x1)} ${f1(yR)}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`);
    return wrap(`<path d="M${f1(x0)} ${f1(yL)} Q200 ${f1(y0 + 5 + cm * 0.9)} ${f1(x1)} ${f1(yR)}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`); }
  const hT = T * 4 / 3, hB = (B + 3 * wv) * 4 / 3, d = `M${f1(x0)} ${f1(yL)} C${f1(200 - w * k)} ${f1(y0 - hT)} ${f1(200 + w * k)} ${f1(y0 - hT)} ${f1(x1)} ${f1(yR)} C${f1(200 + w * k)} ${f1(y0 + hB)} ${f1(200 - w * k)} ${f1(y0 + hB)} ${f1(x0)} ${f1(yL)} Z`;
  let g = `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${MO2}"/><g clip-path="url(#${id})">`;
  if (B > 9) g += `<ellipse cx="200" cy="${f1(y0 + B * 0.95)}" rx="${f1(w * 0.62)}" ry="${f1(B * 0.42)}" fill="${TONG2}"/>`;
  if (T0 <= 4.5 && w0 >= 19 && o > 0.45) g += `<rect x="${f1(x0)}" y="${f1(Math.min(yL, yR, y0 - hT) - 2)}" width="${f1(2 * w)}" height="${f1(4 + T * 0.9 + Math.abs(cm) * 0.5)}" fill="#fff"/>`;
  return wrap(g + `</g><path d="${d}" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`); };
// 볼 부풀리기(머리 좌표, fxUnder 층): 얼굴 윤곽이 볼 자리에서 바깥으로 불룩
ACT.cheekPuff = (pL = 0, pR = 0, shade = '#D5E2EE') => { let g = '';
  if (pL > 0.03) { const c = `M84 188 C${f1(84 - 26 * pL)} 206 ${f1(100 - 26 * pL)} 250 120 253`; g += `<path d="${c} L132 253 L132 188 Z" fill="#fff"/><path d="${c}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`; }
  if (pR > 0.03) { const c = `M316 188 C${f1(316 + 26 * pR)} 206 ${f1(300 + 26 * pR)} 250 280 253`; g += `<path d="${c} L268 253 L268 188 Z" fill="${shade}"/><path d="${c}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`; }
  return g; };
const lerpV = (a, b, k) => a.map((x, i) => lerp(x, b[i], k));

// ---------- 립싱크 ----------
// text: 대본 그대로(띄어쓰기 기준 단어), words: [{w, t}] 음성 인식 단어 시작 시각, t0: 이 대사 음성이 시작되는 영상 시각, voiced(t): 소리가 나는지(0~1)
// 반환: 음절 목록 [{a, b, vis, closeA, closeB}]
ACT.lipTrack = (text, words, t0, endT, voiced) => { const clean = text.replace(/[“”"]/g, ''), ws = clean.split(/\s+/).filter(Boolean), out = [];
  const info = ch => { const c = ch.charCodeAt(0) - 0xAC00, ini = Math.floor(c / 588), med = Math.floor((c % 588) / 28), fin = c % 28; return { vis: ACT.vowelVis(med), closeA: [6, 7, 8, 17].includes(ini), closeB: [16, 17, 18, 26].includes(fin) }; };
  // 1) 소리 나는 구간 찾기(0.22초보다 짧은 쉼은 이어 붙임)
  let reg = []; if (voiced) { let on = null; for (let tt = t0; tt <= endT + 0.3; tt += 0.01) { const v = voiced(tt) > 0.5; if (v && on == null) on = tt; if (!v && on != null) { reg.push([on, tt]); on = null; } } if (on != null) reg.push([on, endT]);
    reg = reg.reduce((m, r) => { if (m.length && r[0] - m[m.length - 1][1] < 0.22) m[m.length - 1][1] = r[1]; else m.push(r); return m; }, []).filter(r => r[1] - r[0] > 0.08); }
  // 2) 문장부호로 나눈 말 덩어리 수와 소리 구간 수가 같으면, 덩어리마다 그 구간에 음절을 고르게 놓는다(음성 인식 시각보다 정확)
  const phrases = []; let cur = []; ws.forEach((w, i) => { cur.push(i); if (/[?？.!,…]$/.test(w)) { phrases.push(cur); cur = []; } }); if (cur.length) phrases.push(cur);
  if (reg.length === phrases.length) { phrases.forEach((ph, pi) => { const syl = []; ph.forEach(wi => [...ws[wi]].forEach((ch, j, arr) => { if (ch >= '가' && ch <= '힣') syl.push({ ch, wi, last: !arr.slice(j + 1).some(c => c >= '가' && c <= '힣') }); }));
      const [a, b] = reg[pi], d = (b - a) / syl.length; let pw = -1;
      syl.forEach((s, j) => { out.push(Object.assign({ a: a + j * d, b: a + (j + 1) * d, q: s.last && /[?？]/.test(ws[s.wi]), word: s.wi, first: s.wi !== pw }, info(s.ch))); pw = s.wi; }); });
    return out; }
  // 3) 아니면 음성 인식 단어 시작 시각으로
  const starts = ws.map((w, i) => t0 + (words[i] ? words[i].t : (i / ws.length) * (endT - t0)));
  ws.forEach((w, i) => { const syl = [...w].filter(ch => ch >= '가' && ch <= '힣'); if (!syl.length) return;
    let a = starts[i], lim = i + 1 < ws.length ? starts[i + 1] : endT; const dur = Math.min(lim - a, syl.length * 0.2), d = dur / syl.length;
    syl.forEach((ch, j) => out.push(Object.assign({ a: a + j * d, b: a + (j + 1) * d, q: j === syl.length - 1 && /[?？]/.test(w), word: i, first: j === 0 }, info(ch)))); });
  return out; };
// 지금 입 모양: {v:[w,T,B,k], o}
ACT.lip = (track, t, amp) => { const i = track.findIndex(s => t >= s.a - 0.03 && t < s.b + 0.03); if (i < 0) return { v: ACT.VIS.M, o: 0, s: null };
  const s = track[i], u = clamp((t - s.a) / (s.b - s.a), 0, 1); let v = ACT.VIS[s.vis];
  const prev = track[i - 1]; if (prev && prev.b > s.a - 0.06 && u < 0.35) v = lerpV(ACT.VIS[prev.vis], v, easeInOut(u / 0.35));
  let close = 0; if (s.closeA) close = Math.max(close, 1 - clamp(u / 0.3, 0, 1)); if (s.closeB) close = Math.max(close, clamp((u - 0.72) / 0.2, 0, 1));
  const o = (0.3 + 0.7 * clamp(amp, 0, 1)) * (1 - close) * Math.min(1, Math.sin(clamp(u, 0, 1) * Math.PI) * 1.8 + 0.3);
  return { v, o, s }; };

// ---------- 눈썹 ----------
// base: [x0,y0,cx,cy,x1,y1] 두 개. b = { raise, worry, angry, asymL, asymR, knit(미간 찌푸림) }
ACT.brows = (bL, bR, b = {}) => { const r = b.raise || 0, w = b.worry || 0, a = b.angry || 0;
  const L = bL.slice(), R = bR.slice();
  [L, R].forEach((B, s) => { const al = s ? (b.asymR || 0) : (b.asymL || 0); for (let i = 1; i < 6; i += 2) B[i] -= r + al; });
  // 안쪽 끝: L의 x1(4,5) / R의 x0(0,1)
  L[5] += -w * 12 + a * 11; L[1] += w * 5 - a * 5; R[1] += -w * 12 + a * 11; R[5] += w * 5 - a * 5;
  L[3] += -w * 3; R[3] += -w * 3;
  const kn = b.knit || 0; L[4] += kn * 7; L[5] += kn * 4; R[0] -= kn * 7; R[1] += kn * 4; // 미간 찌푸림: 안쪽 끝이 가운데로 모이며 살짝 내려옴
  return { bL: L, bR: R }; };

// ---------- 얼굴 조립 ----------
// o = { base:'z기본', eyes:{...}, brow:{...}, mouth:{v,o,c,wob,dx,style} 또는 null(기본 입), mouthPath, blush(0~1), lines(볼 빗금 0~1), puff:[왼,오른](볼 부풀림), tear(0~1 눈물), t(떨림용 시간), fx: 추가 머리 좌표 SVG(함수 가능), id }
// 반환한 객체를 E['_키']에 넣고 char({ex: fEx('_키'), noBlink:true, noMouth:true})로 그린다(입은 이 층에서 그림)
ACT.face = o => { const base = E[o.base || 'z기본'] || E['z기본'], br = ACT.brows(base.bL, base.bR, o.brow || {}), bl = o.blush == null ? 0.35 : o.blush;
  const fxU = `<ellipse cx="146" cy="218" rx="${f1(18 + 4 * bl)}" ry="${f1(9 + 2 * bl)}" fill="${BLUSH}" opacity="${f1(clamp(bl, 0, 1) * 85) / 100}"/><ellipse cx="254" cy="218" rx="${f1(18 + 4 * bl)}" ry="${f1(9 + 2 * bl)}" fill="${BLUSH}" opacity="${f1(clamp(bl, 0, 1) * 85) / 100}"/>`;
  const lines = o.lines ? `<g opacity="${f1(clamp(o.lines, 0, 1) * 100) / 100}">${zBlushLines}</g>` : '';
  const mx = o.mouth ? { wob: o.mouth.wob, t: o.t, dx: o.mouth.dx, style: o.mouth.style } : {};
  const m = o.mouth ? ACT.mouth(o.mouth.v || ACT.VIS.M, o.mouth.o || 0, o.mouth.c == null ? 2 : o.mouth.c, 'mc' + (o.id || 'a'), mx) : `<path d="${o.mouthPath || base.mouth}" fill="${o.mouthPath ? (o.mouthFill || 'none') : base.mouthFill}" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  const pf = o.puff ? ACT.cheekPuff(o.puff[0], o.puff[1]) : '', kn = (o.brow && o.brow.knit) || 0;
  const wr = kn > 0.3 ? `<path d="M194 ${f1(150 - 2 * kn)} l-2 ${f1(10 * kn)} M206 ${f1(150 - 2 * kn)} l2 ${f1(10 * kn)}" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" opacity="${f1(kn * 70) / 100}"/>` : '';
  const tear = o.tear > 0.05 ? (t, lk) => `<g opacity="${f1(clamp(o.tear, 0, 1) * 100) / 100}">${zTear(t, lk, -1, 0, 0.95)}${zTear(t, lk, 1, 0.45, 0.95)}</g>` : null;
  return Object.assign({}, br, { eyeL: 'M0 0', eyeR: 'M0 0', eyeFill: 'none', eyeSW: 0, mouth: base.mouth, mouthFill: base.mouthFill,
    fxUnder: pf + fxU, fxEye: ACT.eyes(o.eyes || {}), fx: (t, lk) => wr + m + lines + (tear ? tear(t, lk) : '') + (typeof o.fx === 'function' ? o.fx(t, lk) : (o.fx || '')) }); };

// ---------- 만화 기호(머리 좌표, 머리 중심 200,170 / 반지름 약 118) ----------
// 등장: 튀어나와 커졌다 안착, 머무는 동안 살짝 흔들림, 끝: 작아지며 사라짐
ACT.symK = (t, t0, t1) => { if (t < t0 || t > t1 + 0.18) return 0; const a = clamp((t - t0) / 0.28, 0, 1), inn = a < 1 ? easeOutBack(a) : 1, out = t > t1 ? 1 - (t - t1) / 0.18 : 1; return inn * out; };
ACT.sym = (kind, x, y, t, t0, t1, s = 1) => { const k = ACT.symK(t, t0, t1); if (k <= 0.01) return ''; const wob = Math.sin((t - t0) * 9) * 6 * Math.exp(-(t - t0) * 2.5);
  let g = '';
  if (kind === '!') g = `<path d="M-9 -58 L9 -58 L5 2 L-5 2 Z" fill="#FF5A5F" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><circle cy="20" r="9" fill="#FF5A5F" stroke="${INK}" stroke-width="6"/>`;
  else if (kind === '?') g = `<text x="0" y="22" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="104" fill="#fff" stroke="${INK}" stroke-width="10" paint-order="stroke">?</text>`;
  else if (kind === 'sweat') { const sl = clamp((t - t0) / 0.9, 0, 1) * 26; g = `<g transform="translate(0 ${f1(sl)})">${zDrop(0, 0, 1.5)}</g>`; }
  else if (kind === 'bulb') { const r = (t - t0) * 4; g = [0, 1, 2, 3, 4].map(i => { const a = -Math.PI / 2 + (i - 2) * 0.55, L = 16 + 6 * Math.sin(r * 3 + i); return `<line x1="${f1(Math.cos(a) * 46)}" y1="${f1(Math.sin(a) * 46 - 6)}" x2="${f1(Math.cos(a) * (46 + L))}" y2="${f1(Math.sin(a) * (46 + L) - 6)}" stroke="#FFC93C" stroke-width="7" stroke-linecap="round"/>`; }).join('') +
    `<path d="M0 -42 C24 -42 34 -22 30 -6 C27 6 17 12 15 22 L-15 22 C-17 12 -27 6 -30 -6 C-34 -22 -24 -42 0 -42 Z" fill="#FFE34D" stroke="${INK}" stroke-width="6"/><rect x="-14" y="22" width="28" height="16" rx="5" fill="#B9C2CC" stroke="${INK}" stroke-width="5"/><path d="M-8 4 Q0 -8 8 4" fill="none" stroke="#F2A900" stroke-width="5" stroke-linecap="round"/>`; }
  else if (kind === 'spark') g = [[-30, -10, 0], [26, -30, 1.7], [30, 20, 3.1]].map(([dx, dy, p]) => zStar(dx, dy, 15 * (0.55 + 0.45 * Math.abs(Math.sin((t - t0) * 6 + p))), '#FFE34D', 3)).join('');
  else if (kind === 'heart') g = [0, 1].map(i => { const ph = ((t - t0) * 0.9 + i * 0.5) % 1; return `<path d="${zHeartP(i * 30 - 15 + Math.sin(ph * 6) * 6, -ph * 70, 0.42)}" fill="#FF6B8B" stroke="${INK}" stroke-width="3.5" opacity="${f1((1 - ph * 0.8) * 100) / 100}"/>`; }).join('');
  else if (kind === 'dots') g = [0, 1, 2].map(i => { const kk = clamp(((t - t0) - i * 0.25) / 0.2, 0, 1); return kk > 0 ? `<circle cx="${(i - 1) * 26}" cy="${f1(-i * 12)}" r="${f1(8 * easeOutBack(kk))}" fill="#fff" stroke="${INK}" stroke-width="4"/>` : ''; }).join('');
  else if (kind === 'burst') g = [...Array(10)].map((_, i) => { const a = i / 10 * Math.PI * 2; return `<line x1="${f1(Math.cos(a) * 128)}" y1="${f1(Math.sin(a) * 120)}" x2="${f1(Math.cos(a) * 158)}" y2="${f1(Math.sin(a) * 148)}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`; }).join('');
  else if (kind === 'gloom') g = `<g opacity=".75">${zGloom}</g>`;
  else if (kind === 'sigh') { const u = clamp((t - t0) / Math.max(0.3, t1 - t0), 0, 1); g = [0, 1, 2].map(i => { const uu = clamp(u * 1.3 - i * 0.12, 0, 1); return uu > 0 ? `<circle cx="${f1(uu * 110 + i * 12)}" cy="${f1(-uu * 18 + (i - 1) * 9)}" r="${f1(7 + uu * 16 - i * 2)}" fill="#fff" stroke="${INK}" stroke-width="4" opacity="${f1((1 - uu * 0.85) * 100) / 100}"/>` : ''; }).join(''); }
  else if (kind === 'storm') { const z = Math.sin((t - t0) * 5) * 3; g = `<g transform="translate(${f1(z)} 0)"><circle cx="-26" cy="0" r="22" fill="#6B6B8F" stroke="${INK}" stroke-width="5"/><circle cx="2" cy="-12" r="27" fill="#6B6B8F" stroke="${INK}" stroke-width="5"/><circle cx="30" cy="2" r="20" fill="#6B6B8F" stroke="${INK}" stroke-width="5"/><rect x="-30" y="0" width="64" height="20" fill="#6B6B8F"/><path d="M-36 20 L40 20" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    ((t - t0) % 0.9 < 0.25 ? `<path d="M2 22 L-8 42 L4 42 L-6 64" fill="none" stroke="#FFD43B" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` : '') + `</g>`; }
  else if (kind === 'memory') g = [[-62, 58, 7], [-46, 40, 10]].map(([dx, dy, r]) => `<circle cx="${dx}" cy="${dy}" r="${r}" fill="#FFF8E7" stroke="${INK}" stroke-width="4"/>`).join('') +
    `<path d="M-40 0 Q-46 -30 -16 -30 Q-8 -52 20 -44 Q44 -56 56 -30 Q82 -26 74 0 Q80 26 50 26 Q34 42 8 30 Q-20 40 -30 22 Q-50 20 -40 0 Z" fill="#FFF8E7" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
    `<circle cx="-8" cy="-6" r="13" fill="#FFD66B"/><path d="${zHeartP(32, 0, 0.42)}" fill="#FF8FAB" stroke="${INK}" stroke-width="3"/>`;
  else if (kind === 'vein') g = zVein(0, 0, 0.9 + 0.15 * Math.abs(Math.sin((t - t0) * 9)));
  else if (kind === 'note') g = `<text x="0" y="16" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="54" fill="#7C6CF0" stroke="${INK}" stroke-width="5" paint-order="stroke">♪</text>`;
  if (kind === 'gloom' || kind === 'burst') return `<g opacity="${f1(clamp(k, 0, 1) * 100) / 100}">${kind === 'burst' ? `<g transform="translate(200 170) scale(${f1((0.9 + 0.1 * k) * 100) / 100})">${g}</g>` : g}</g>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(wob)}) scale(${f1(k * 100) / 100})">${g}</g>`; };

// ---------- 감정 몸짓(A2.pose 기반) ----------
// 반환 { pose, rot, tilt, headDy, sx, sy, look, hop } — k(0~1)로 서기에서 섞어 들어간다
ACT.attitude = (name, t, k = 1) => { const st = A2.pose({}); let o;
  if (name === 'shy') { const sw = Math.sin(t * 2.4), tw = Math.sin(t * 5.2);
    o = { pose: A2.pose({ hL: [186, 402], hR: [214, 402], fL: [184, 534, 12], fR: [226 + tw * 3, 528, -24 + tw * 10], dy: 4, bend: { aL: 1, aR: -1, lL: 1, lR: -1 } }), rot: sw * 3, tilt: 9 + sw * 2, headDy: 6, look: [0.7, 0.55], sx: 1, sy: 0.98 }; }
  else if (name === 'sad') { const br = Math.sin(t * 1.3);
    o = { pose: A2.pose({ hL: [164, 414], hR: [236, 414], dy: 1 + br }), rot: 0, tilt: -5, headDy: 9, look: [-0.2, 0.9], sx: 1.02, sy: 0.95 + br * 0.006 }; }
  else if (name === 'joy') { const ph = (t * 2.3) % 1, up = Math.sin(ph * Math.PI);
    o = { pose: A2.pose({ hL: [46, 232 - up * 16], hR: [354, 232 - up * 16], dy: ph < 0.12 ? (1 - ph / 0.12) * 14 : 0, bend: { aL: -1, aR: 1, lL: -1, lR: 1 } }), rot: Math.sin(t * 4.6) * 3, tilt: Math.sin(t * 4.6) * 5, headDy: -up * 4, look: [0, -0.2], hop: up * 46, sx: ph < 0.12 ? 1.06 : 1 - up * 0.03, sy: ph < 0.12 ? 0.93 : 1 + up * 0.05 }; }
  else o = { pose: st, rot: 0, tilt: 0, headDy: 0, look: [0, 0], sx: 1, sy: 1 };
  if (k < 1) { o.pose = A2.blend(st, o.pose, k, 0.2); o.rot *= k; o.tilt *= k; o.headDy *= k; o.look = o.look.map(v => v * k); o.sx = lerp(1, o.sx, k); o.sy = lerp(1, o.sy, k); o.hop = (o.hop || 0) * k; }
  return o; };
window.ACT = ACT;
