/* ---------- experiment 012: is anger released by letting it out? — spark, fan, wind and smoke ---------- */
// Doyun, Zero's oldest friend: short black hair, blue t-shirt
const DY = o => HALO(char(Object.assign({ goggles: 'none', vest: '#4F86C6', patch: false, tee: true, vshade: 'rgba(0,0,60,0.22)', hair: '#2B2B2B' }, o)));
E['서운함'] = Object.assign(dotEyes(9, 12), { bL: [142, 162, 164, 150, 186, 144], bR: [214, 144, 236, 150, 258, 162], mouth: 'M184 240 Q200 228 216 240', mouthFill: 'none' });
E['미안'] = Object.assign(dotEyes(9, 11), { bL: [142, 160, 164, 150, 186, 146], bR: [214, 146, 236, 150, 258, 160], mouth: 'M188 236 Q194 231 200 236 Q206 241 212 236', mouthFill: 'none', blush: true });
E['울먹'] = Object.assign(dotEyes(11, 13), { bL: [142, 164, 164, 150, 186, 142], bR: [214, 142, 236, 150, 258, 164], mouth: 'M184 238 Q192 230 200 236 Q208 242 216 234', mouthFill: 'none', blush: true });
E['비웃음'] = { eyeL: 'M152 188 L178 188 Q178 198 165 198 Q152 198 152 188 Z', eyeR: 'M222 188 L248 188 Q248 198 235 198 Q222 198 222 188 Z', eyeFill: INK, eyeSW: 0, bL: [140, 150, 163, 138, 186, 146], bR: [214, 158, 237, 152, 260, 158], mouth: 'M182 232 Q204 242 222 222', mouthFill: 'none' };
E['지친'] = { eyeL: 'M152 186 L178 186 Q178 198 165 198 Q152 198 152 186 Z', eyeR: 'M222 186 L248 186 Q248 198 235 198 Q222 198 222 186 Z', eyeFill: INK, eyeSW: 0, bL: [142, 162, 164, 152, 186, 150], bR: [214, 150, 236, 152, 258, 162], mouth: 'M188 238 Q200 232 212 238', mouthFill: 'none' };
P['펀치'] = { armL: [[148, 285], [150, 330], [186, 304]], hL: [194, 298], armR: [[252, 285], [322, 290], [384, 292]], hR: [396, 292], legL: [[180, 412], [160, 468], [140, 520]], fL: [128, 532, 0], legR: [[220, 412], [236, 470], [252, 522]], fR: [264, 534, 0], dy: 0 };
P['가드'] = { armL: [[148, 285], [146, 330], [180, 302]], hL: [188, 296], armR: [[252, 285], [268, 330], [232, 302]], hR: [224, 296], legL: [[180, 412], [160, 468], [140, 520]], fL: [128, 532, 0], legR: [[220, 412], [236, 470], [252, 522]], fR: [264, 534, 0], dy: 0 };
P['팔짱'] = Object.assign({ armL: [[148, 285], [134, 340], [230, 348]], hL: [236, 346], armR: [[252, 285], [266, 338], [170, 334]], hR: [164, 332] }, LEGS);
P['가슴'] = Object.assign({ armL: [[148, 285], [122, 345], [116, 398]], hL: [114, 406], armR: [[252, 285], [250, 340], [212, 318]], hR: [206, 314] }, LEGS);
P['설명'] = Object.assign({ armL: [[148, 285], [104, 338], [76, 306]], hL: [70, 300], armR: [[252, 285], [296, 338], [324, 306]], hR: [330, 300] }, LEGS);
P['앉기'] = { armL: [[148, 285], [124, 340], [152, 392]], hL: [158, 396], armR: [[252, 285], [276, 340], [248, 392]], hR: [242, 396], legL: [[180, 412], [150, 452], [156, 500]], fL: [150, 512, 0], legR: [[220, 412], [250, 452], [244, 500]], fR: [250, 512, 0], dy: 40 };
P['앉아폰'] = Object.assign({}, P['앉기'], { armL: P['폰보기'].armL, hL: P['폰보기'].hL, armR: P['폰보기'].armR, hR: P['폰보기'].hR });
P['앉아내밀기'] = Object.assign({}, P['앉기'], { armR: [[252, 285], [318, 300], [372, 300]], hR: [380, 298] });
P['앉아받기'] = Object.assign({}, P['앉기'], { armL: [[148, 285], [150, 344], [186, 352]], hL: [192, 352], armR: [[252, 285], [272, 344], [236, 352]], hR: [230, 352] });

Object.assign(CAMS, {
  ahook: [1.0, 1.05, 960, 520], achat: [1.0, 1.04, 960, 520], anight: [1.0, 1.05, 960, 560], agym: [1.0, 1.05, 960, 540],
  acall: [1.0, 1.05, 960, 540], atype: [1.0, 1.05, 960, 520], alab: [1.0, 1.05, 960, 540], abag: [1.0, 1.03, 960, 520],
  ameta: [1.0, 1.03, 960, 520], afire: [1.0, 1.03, 960, 520], arewind: [1.0, 1.03, 960, 520], aconfess: [1.0, 1.08, 960, 600],
  aquote: [1.0, 1.04, 960, 520], apaper: [1.0, 1.05, 960, 540], abreath: [1.0, 1.06, 960, 560], areview: [1.0, 1.05, 960, 560],
  agauge: [1.0, 1.03, 960, 520], adocq: [1.0, 1.05, 960, 540], amsg: [1.0, 1.05, 960, 520], areply: [1.0, 1.05, 960, 520],
  acard: [1.0, 1.07, 960, 500], aend: [1.0, 1.05, 960, 540], arecap: [1.0, 1.03, 960, 520]
});
const D12 = a => a._dur || 5;
const FIRE_VAL = [6, 7, 8, 6, 5, 3];

/* ---------- timing helpers ---------- */
function lineIdx12(t) { const L = TL.lines; let i = 0; while (i + 1 < L.length && t >= L[i + 1].t0 - 0.15) i++; return i; }
function segLt(t, lt, j) { // line-relative start time of segment j of the current line
  const l = TL.lines[lineIdx12(t)]; const s = l && l.segs && l.segs[j];
  return s ? s.t0 - (l.t0 - 0.15) : 0;
}
function segK(t, lt, j) { // 0..1 progress through segment j
  const l = TL.lines[lineIdx12(t)]; const s = l && l.segs && l.segs[j];
  if (!s) return 0; return prog(t, s.t0, s.t1);
}

/* ---------- the metaphor: fire, smoke, fan, wind ---------- */
function fire12(x, y, s, t, v) { // campfire; v 0..10 = flame size
  const k = clamp(v / 10, 0, 1);
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})">`;
  if (k > 0.02) h += `<ellipse cx="0" cy="${f1(-60 - 120 * k)}" rx="${f1(140 + 200 * k)}" ry="${f1(110 + 170 * k)}" fill="url(#warm)" opacity="${f1((0.35 + 0.5 * k) * 100) / 100}"/>`;
  h += `<ellipse cx="0" cy="18" rx="150" ry="22" fill="#000" opacity=".25"/>`;
  h += `<g stroke="${INK}" stroke-width="7" stroke-linejoin="round"><rect x="-120" y="-20" width="240" height="40" rx="20" fill="#7A4E2D" transform="rotate(-12)"/><rect x="-120" y="-20" width="240" height="40" rx="20" fill="#8E5D36" transform="rotate(12)"/></g>`;
  h += `<circle cx="-104" cy="22" r="10" fill="#C79A6A" stroke="${INK}" stroke-width="4"/><circle cx="104" cy="22" r="10" fill="#C79A6A" stroke="${INK}" stroke-width="4"/>`;
  if (k > 0.02) {
    const W = 34 + 74 * k, Hh = 70 + 330 * k;
    const fl = (w, hh, c, ph) => {
      const sw = Math.sin(t * 7 + ph) * w * 0.18, tip = -hh * (1 + Math.sin(t * 9 + ph) * 0.06);
      return `<path d="M${f1(-w)} -6 C${f1(-w * 1.05)} ${f1(-hh * 0.45)} ${f1(-w * 0.3 + sw)} ${f1(-hh * 0.7)} ${f1(sw)} ${f1(tip)} C${f1(w * 0.3 + sw)} ${f1(-hh * 0.7)} ${f1(w * 1.05)} ${f1(-hh * 0.45)} ${f1(w)} -6 Q0 14 ${f1(-w)} -6 Z" fill="${c}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    };
    h += fl(W, Hh, '#FF6B3D', 0) + fl(W * 0.66, Hh * 0.72, '#FFA94D', 1.3) + fl(W * 0.34, Hh * 0.44, '#FFE680', 2.1);
    const n = Math.round(3 + 9 * k);
    for (let i = 0; i < n; i++) {
      const ph = (t * 0.7 + hash(i * 3.1)) % 1, sx = (hash(i + 0.5) - 0.5) * W * 2.2, sy = -Hh * 0.45 - ph * Hh * 1.1;
      h += `<circle cx="${f1(sx + Math.sin(t * 3 + i) * 14)}" cy="${f1(sy)}" r="${f1(4 + 5 * k)}" fill="#FFD27A" opacity="${f1((1 - ph) * 100) / 100}"/>`;
    }
  } else {
    h += [-44, 0, 40].map((ex, i) => `<circle cx="${ex}" cy="-8" r="11" fill="#FF8A5C" opacity="${f1((0.45 + 0.3 * Math.sin(t * 3 + i)) * 100) / 100}"/>`).join('');
  }
  return h + '</g>';
}
function smoke12(x, y, s, t, op = 1, n = 7, seed = 1) { // grey smoke puffs drifting up
  if (op <= 0.01) return '';
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})" opacity="${f1(op * 100) / 100}">`;
  for (let i = 0; i < n; i++) {
    const ph = (t * 0.16 + i / n + hash(seed + i) * 0.1) % 1, px = Math.sin(i * 2.3 + t * 0.6) * 50 + (hash(seed + i * 2) - 0.5) * 180, py = -ph * 380, r = 55 + ph * 95;
    h += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(r)}" fill="#8E96A3" opacity="${f1(Math.sin(ph * Math.PI) * 0.6 * 100) / 100}"/>`;
  }
  return h + '</g>';
}
function smokeFace(x, y, s, t, op = 1, real = 0) { // Doyun as Zero imagines him (smirking, in smoke); real 0..1 clears the smoke to the tired real face
  if (op <= 0.01) return '';
  let h = `<g opacity="${f1(op * 100) / 100}">`;
  const puffs = [[-150, -40, 90], [140, -60, 95], [-90, -230, 80], [110, -250, 85], [0, -330, 90], [-200, -160, 70], [200, -170, 70], [0, 20, 110]];
  h += puffs.map(([px, py, r], i) => `<circle cx="${f1(x + px * s + Math.sin(t * 0.9 + i) * 8)}" cy="${f1(y + py * s)}" r="${f1(r * s * 1.4)}" fill="#7D8594" opacity="${f1((0.5 - 0.45 * real) * 100) / 100}"/>`).join('');
  h += DY({ t, seed: 212, x, y: y + 260 * s, s: s * 0.95, pose: '팔짱', ex: exprAt([[0, real > 0.5 ? '지친' : '비웃음']], t), look: [-0.3, 0.1] });
  h += puffs.slice(4).map(([px, py, r], i) => `<circle cx="${f1(x + px * s * 1.1 + Math.sin(t * 1.1 + i * 2) * 10)}" cy="${f1(y + py * s + 120 * s)}" r="${f1(r * s * 1.2)}" fill="#8E96A3" opacity="${f1((0.6 - 0.58 * real) * 100) / 100}"/>`).join('');
  return h + '</g>';
}
function fan12(x, y, s, rot) { // a hand fan (부채)
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000})">`;
  h += `<path d="M0 0 L-110 -110 A156 156 0 0 1 110 -110 Z" fill="#E2553A" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
  for (let i = -3; i <= 3; i++) { const an = (-90 + i * 12) * Math.PI / 180; h += `<line x1="0" y1="0" x2="${f1(Math.cos(an) * 148)}" y2="${f1(Math.sin(an) * 148)}" stroke="#F6C9A8" stroke-width="3" opacity=".75"/>`; }
  h += `<path d="M-92 -126 A156 156 0 0 1 92 -126" fill="none" stroke="#FFD27A" stroke-width="10" opacity=".85"/>`;
  h += `<rect x="-9" y="-8" width="18" height="74" rx="8" fill="#8E5D36" stroke="${INK}" stroke-width="6"/>`;
  return h + '</g>';
}
function wind12(x, y, s, t, op = 1, dir = 1) { // gusts of wind blowing toward the fire
  if (op <= 0.01) return '';
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(dir * s * 1000) / 1000} ${f1(s * 1000) / 1000})" opacity="${f1(op * 100) / 100}" fill="none" stroke="#DDE8F5" stroke-width="9" stroke-linecap="round">`;
  for (let i = 0; i < 3; i++) { const ph = (t * 1.6 + i / 3) % 1, ox = -160 + ph * 220; h += `<path d="M${f1(ox)} ${-50 + i * 50} q60 -22 120 0 q30 10 20 30" opacity="${f1(Math.sin(ph * Math.PI) * 100) / 100}"/>`; }
  return h + '</g>';
}
function fanBeat(t, period = 0.9) { return Math.sin(t * Math.PI * 2 / period); }
function scissors12(x, y, s, open) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  h += `<g transform="rotate(${f1(-open * 18)})"><path d="M0 0 L150 -14 L150 6 Z" fill="#C9D2DC" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle cx="-40" cy="22" r="26" fill="none" stroke="${RED}" stroke-width="12"/></g>`;
  h += `<g transform="rotate(${f1(open * 18)})"><path d="M0 0 L150 14 L150 -6 Z" fill="#E1E7EE" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle cx="-40" cy="-22" r="26" fill="none" stroke="${RED}" stroke-width="12"/></g>`;
  return h + `<circle r="7" fill="${INK}"/></g>`;
}
function tears12(x, y, s, t) { // two tear drops under Zero's eyes (char at x, y, scale s)
  return [165, 235].map((ex, i) => { const ph = (t * 0.6 + i * 0.5) % 1; const cx = x + (ex - 200) * s, cy = y + (210 - 560) * s + ph * 30 * s;
    return `<path d="M${f1(cx)} ${f1(cy - 12 * s)} Q${f1(cx + 9 * s)} ${f1(cy + 4 * s)} ${f1(cx)} ${f1(cy + 10 * s)} Q${f1(cx - 9 * s)} ${f1(cy + 4 * s)} ${f1(cx)} ${f1(cy - 12 * s)} Z" fill="#9ED8FF" stroke="${INK}" stroke-width="${f1(3 * s * 10) / 10}" opacity="${f1(Math.sin(ph * Math.PI) * 100) / 100}"/>`; }).join('');
}

/* ---------- the chat phone (a made-up messenger, channel colours) ---------- */
function chatPhone(x, y, s, t, o = {}) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})">`;
  h += `<rect x="-258" y="-480" width="540" height="980" rx="64" fill="${INK}" opacity=".3"/>`;
  h += `<rect x="-270" y="-490" width="540" height="980" rx="64" fill="#1F2D44" stroke="${INK}" stroke-width="10"/>`;
  h += `<rect x="-246" y="-466" width="492" height="932" rx="46" fill="${o.dim ? '#C9D0DA' : '#EAF0F6'}"/>`;
  h += `<path d="M-246 -420 Q-246 -466 -200 -466 L200 -466 Q246 -466 246 -420 L246 -352 L-246 -352 Z" fill="#fff"/><line x1="-246" y1="-352" x2="246" y2="-352" stroke="#D5DCE6" stroke-width="3"/>`;
  h += `<circle cx="-186" cy="-404" r="30" fill="#4F86C6" stroke="${INK}" stroke-width="4"/><path d="M-210 -414 Q-208 -440 -186 -440 Q-164 -440 -162 -414 Q-174 -424 -186 -422 Q-198 -424 -210 -414 Z" fill="#2B2B2B"/><circle cx="-186" cy="-396" r="14" fill="#fff"/>`;
  h += T8(-140, -392, o.title || '도윤', { anchor: 'start', size: 34, fill: NAVY });
  if (o.clock) h += T8(220, -392, o.clock, { anchor: 'end', size: 26, fill: '#6B7A90', w: 700 });
  let yy = -322;
  for (const m of o.msgs || []) {
    const k = m.k == null ? 1 : m.k; if (k <= 0) continue;
    const fs = 30, lh = 42, w = Math.max(...m.text.map(l => l.length)) * fs * 0.98 + 46, hh = m.text.length * lh + 28;
    const bx = m.me ? 226 - w : -226, sc = easeOutBack(clamp(k, 0, 1));
    h += `<g transform="translate(${f1(bx + (m.me ? w : 0))} ${f1(yy)}) scale(${f1(sc * 1000) / 1000}) translate(${f1(m.me ? -w : 0)} 0)" opacity="${f1(clamp(k * 3, 0, 1) * 100) / 100}">`;
    h += `<rect x="0" y="0" width="${f1(w)}" height="${hh}" rx="24" fill="${m.me ? '#FFE36E' : '#fff'}" stroke="${m.hi ? RED : '#C9D2DC'}" stroke-width="${m.hi ? 6 : 3}"/>`;
    m.text.forEach((ln, j) => { h += T8(23, 18 + (j + 1) * lh - 10, ln, { anchor: 'start', size: fs, fill: m.red ? '#B3261E' : NAVY, w: 700 }); });
    if (m.me && m.unread > 0) h += `<g opacity="${f1(m.unread * 100) / 100}">${T8(-14, hh - 6, '1', { anchor: 'end', size: 30, fill: '#E0A800' })}</g>`;
    if (m.me && m.time) h += T8(-14, hh - (m.unread > 0 ? 40 : 6), m.time, { anchor: 'end', size: 20, fill: '#7A8699', w: 700 });
    h += `</g>`; yy += hh + 22;
  }
  // input bar (a draft can grow into a big box)
  const dl = o.draft || [], big = dl.length > 1;
  const top = big ? 440 - 52 - dl.length * 46 : 380;
  h += `<rect x="-226" y="${top}" width="372" height="${440 - top + 0}" rx="26" fill="#fff" stroke="#C9D2DC" stroke-width="3"/>`;
  if (dl.length) dl.forEach((ln, j) => { h += T8(-204, top + 48 + j * 46, ln, { anchor: 'start', size: 30, fill: o.draftRed ? '#B3261E' : NAVY, w: 700 }); });
  else h += T8(-204, 422, '메시지 입력', { anchor: 'start', size: 28, fill: '#A8B3C2', w: 700 });
  if (o.cursor && Math.floor(t * 2.5) % 2) { const last = dl[dl.length - 1] || ''; h += `<rect x="${f1(-204 + last.length * 29.4 + 4)}" y="${top + 18 + (Math.max(1, dl.length) - 1) * 46}" width="4" height="36" fill="${NAVY}"/>`; }
  const gl = o.sendGlow || 0;
  if (gl > 0) h += `<circle cx="198" cy="410" r="${f1(52 + 14 * Math.sin(t * 6))}" fill="${RED}" opacity="${f1(gl * 0.35 * 100) / 100}"/>`;
  h += `<circle cx="198" cy="410" r="40" fill="${gl > 0 ? '#E2553A' : '#4F86C6'}" stroke="${INK}" stroke-width="5"/><path d="M180 410 L216 410 M202 394 L218 410 L202 426" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (o.finger != null) { const fy = 330 + o.finger * 40 + Math.sin(t * 3) * 6; h += `<g transform="translate(232 ${f1(fy)})"><path d="M-30 0 L-30 120 L30 120 L30 0" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="0" cy="0" r="30" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-18 20 Q0 30 18 20" fill="none" stroke="#C9D6E2" stroke-width="5"/></g>`; }
  return h + '</g>';
}
const LONG12 = ['너는 항상 이런 식이야.', '원래 그런 애였지.', '나만 이 우정이', '소중했나 봐.'];
function typeLines(lines, k) { // reveal text lines like typing, k 0..1
  const n = lines.join('').length, shown = Math.floor(clamp(k, 0, 1) * n); let used = 0; const out = [];
  for (const ln of lines) { const take = clamp(shown - used, 0, ln.length); used += ln.length; if (take > 0) out.push(ln.slice(0, take)); }
  return out;
}

/* ---------- backgrounds ---------- */
function chair12(x, y, s) { // a simple chair whose seat meets a seated character drawn at (x, y, s)
  const sy = y + (452 - 560) * s + 8 * s;
  return `<rect x="${f1(x - 110 * s)}" y="${f1(sy - 190 * s)}" width="${f1(22 * s)}" height="${f1(190 * s)}" rx="6" fill="#6E4628" stroke="${INK}" stroke-width="5"/><rect x="${f1(x - 115 * s)}" y="${f1(sy)}" width="${f1(230 * s)}" height="${f1(26 * s)}" rx="8" fill="#8A5A34" stroke="${INK}" stroke-width="6"/><rect x="${f1(x - 100 * s)}" y="${f1(sy + 26 * s)}" width="${f1(18 * s)}" height="${f1(880 - sy - 26 * s)}" fill="#6E4628" stroke="${INK}" stroke-width="5"/><rect x="${f1(x + 82 * s)}" y="${f1(sy + 26 * s)}" width="${f1(18 * s)}" height="${f1(880 - sy - 26 * s)}" fill="#6E4628" stroke="${INK}" stroke-width="5"/>`;
}
function nightRoom12(t, o = {}) {
  let h = BG('url(#nightRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".3"/>');
  h += windowNight(o.wx || 1300, 150, 420, 330, t);
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#10152B"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  return h;
}
function desk12(x, y, t, lamp = 1) {
  let h = `<rect x="${x - 300}" y="${y}" width="600" height="34" rx="8" fill="#8A5A34" stroke="${INK}" stroke-width="7"/><rect x="${x - 270}" y="${y + 34}" width="26" height="${880 - y - 34}" fill="#6E4628" stroke="${INK}" stroke-width="6"/><rect x="${x + 244}" y="${y + 34}" width="26" height="${880 - y - 34}" fill="#6E4628" stroke="${INK}" stroke-width="6"/>`;
  if (lamp) h += `<ellipse cx="${x + 200}" cy="${y - 40}" rx="260" ry="160" fill="url(#warm)" opacity=".55"/><path d="M${x + 180} ${y} L${x + 200} ${y - 120} L${x + 250} ${y - 150}" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${x + 222} ${y - 186} L${x + 300} ${y - 150} L${x + 262} ${y - 110} Z" fill="${YEL}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><ellipse cx="${x + 196}" cy="${y - 2}" rx="40" ry="10" fill="#3B3F4E" stroke="${INK}" stroke-width="5"/>`;
  return h;
}
function streetNight12(t) {
  let h = BG('#18203F');
  h += particles(t, 31, 30, [0, 0, 1920, 500], '#fff', { speed: 6, r: 3, op: 0.5 });
  h += `<circle cx="1560" cy="170" r="54" fill="#FFF2C0"/><circle cx="1580" cy="158" r="50" fill="#18203F"/>`;
  const cols = ['#2A3560', '#31407A', '#27305A'];
  for (let i = 0; i < 9; i++) { const x = -260 + i * 280, hh = 300 + (i * 67 % 4) * 60; h += `<rect x="${x}" y="${820 - hh}" width="250" height="${hh}" fill="${cols[i % 3]}" stroke="${INK}" stroke-width="6"/>`; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (hash(i * 9 + r * 3 + c) > 0.45) h += `<rect x="${x + 30 + c * 70}" y="${820 - hh + 40 + r * 80}" width="40" height="44" rx="4" fill="#FFD98A" opacity=".85"/>`; }
  h += `<rect x="-600" y="820" width="3120" height="700" fill="#2B3352"/><rect x="-600" y="880" width="3120" height="600" fill="#3A4466"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 4; i++) { const x = 160 + i * 520; h += `<rect x="${x - 8}" y="520" width="16" height="360" fill="#596480" stroke="${INK}" stroke-width="5"/><ellipse cx="${x}" cy="520" rx="44" ry="18" fill="#FFE9A8" stroke="${INK}" stroke-width="5"/><ellipse cx="${x}" cy="760" rx="170" ry="300" fill="url(#warm)" opacity=".25"/><ellipse cx="${x}" cy="930" rx="90" ry="14" fill="#FFE9A8" opacity=".25"/>`; }
  return h;
}
function gymBg(t) {
  let h = BG('#2F3550') + BG('url(#hatch)').replace('/>', ' opacity=".25"/>');
  h += `<rect x="-600" y="600" width="3120" height="40" fill="#E2553A" opacity=".8"/><rect x="-600" y="660" width="3120" height="18" fill="#F7E733" opacity=".7"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#4A3B3B"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 6; i++) h += `<rect x="${-200 + i * 420}" y="880" width="400" height="60" fill="${i % 2 ? '#3E5C84' : '#2E4A6A'}" opacity=".8"/>`;
  return h;
}
function sandbag12(x, y, s, sw) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(sw)}) scale(${s})"><line x1="0" y1="-420" x2="0" y2="-300" stroke="#9AA3B0" stroke-width="8"/><rect x="-70" y="-300" width="140" height="330" rx="40" fill="#C0392B" stroke="${INK}" stroke-width="8"/><rect x="-70" y="-250" width="140" height="22" fill="#2B2B2B" opacity=".6"/><rect x="-70" y="-30" width="140" height="22" fill="#2B2B2B" opacity=".6"/></g>`;
}
function labBg(t) {
  let h = BG('url(#labG)') + BG('url(#grid)');
  h += `<ellipse cx="960" cy="900" rx="760" ry="80" fill="url(#glow)" opacity=".5"/><rect x="-600" y="880" width="3120" height="600" fill="#132036"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${MINT}" stroke-width="4" opacity=".5"/>`;
  return h;
}
function morningRoom12(t) {
  let h = BG('url(#dayRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".25"/>');
  h += `<rect x="1180" y="140" width="460" height="360" rx="12" fill="url(#morning)" stroke="${INK}" stroke-width="10"/><circle cx="1480" cy="420" r="70" fill="#FFE29A"/><circle cx="1480" cy="420" r="200" fill="url(#warm)" opacity=".6"/><line x1="1410" y1="140" x2="1410" y2="500" stroke="${INK}" stroke-width="8"/><line x1="1180" y1="320" x2="1640" y2="320" stroke="${INK}" stroke-width="8"/>`;
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#C9AE8C"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  return h;
}
function parchment12() {
  let h = BG('#EADDC2') + BG('url(#hatch)').replace('/>', ' opacity=".18"/>');
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#CDB892"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  return h;
}

/* ---------- HUD: tonight's anger (top right, outside the camera) ---------- */
const HUD12 = { 11: [1, 0, 0], 12: [1, 0, 6], 13: [2, 6, 6], 14: [2, 6, 7], 15: [3, 7, 7], 16: [3, 7, 7], 17: [3, 7, 8], 40: [4, 8, 8], 41: [4, 8, 6], 42: [5, 6, 6], 43: [5, 6, 5], 44: [6, 5, 5], 45: [6, 5, 5], 46: [6, 5, 5], 47: [6, 5, 3] };
function hud12(t) {
  const i = lineIdx12(t), c = HUD12[i]; if (!c) return '';
  const l = TL.lines[i], lt = t - (l.t0 - 0.15), D = l.t1 - l.t0;
  let k;
  if (l.segs && l.segs.length > 1) { const s = l.segs[l.segs.length - 1]; k = prog(t, s.t0, s.t0 + 0.9); }
  else k = prog(lt, 0.55 * D, 0.55 * D + 0.9);
  const v = lerp(c[1], c[2], easeInOut(k));
  const first = !HUD12[i - 1], op = first ? prog(lt, 0, 0.4) : 1;
  let h = `<g transform="translate(1612 92)" opacity="${f1(op * 100) / 100}"><rect x="-282" y="-58" width="564" height="150" rx="26" fill="${NAVY}" opacity=".88" stroke="${YEL}" stroke-width="4"/>`;
  h += T8(-256, -12, `${c[0]}일 차 · 화의 크기`, { anchor: 'start', size: 30, fill: YEL });
  for (let n = 0; n < 10; n++) { const f = clamp(v - n, 0, 1); h += `<rect x="${-256 + n * 36}" y="12" width="30" height="58" rx="7" fill="#2A3A52" stroke="${INK}" stroke-width="3"/>`; if (f > 0) h += `<rect x="${-256 + n * 36}" y="${f1(12 + 58 * (1 - f))}" width="30" height="${f1(58 * f)}" rx="7" fill="${n < 4 ? '#FFB347' : n < 7 ? '#FF7A3D' : '#FF4D4D'}"/>`; }
  h += fire12(200, 66, 0.2, t, v) + T8(240, 4, `${Math.round(v)}`, { size: 54, fill: '#fff', stroke: INK, sw: 6 });
  return h + '</g>';
}

/* ================= scenes ================= */
// 0-2 hook: the long message, a finger over "send"
function ahookScene(t, lt, a) {
  const D = D12(a), k = a.k || 0;
  let h = nightRoom12(t, { wx: 1360 }) + desk12(1300, 700, t);
  h += chatPhone(640, 470, 0.84, t, { msgs: [{ me: 1, text: ['어디쯤이야?'], time: '오후 7:02' }], draft: LONG12, draftRed: true, sendGlow: 1, finger: 0.2 + 0.2 * Math.sin(t * 2) });
  h += fire12(1400, 520, 0.42, t, 6 + 1.5 * Math.sin(t * 0.7));
  h += chair12(1400, 880, 0.5) + Z({ t, seed: 1201, x: 1400, y: 880, s: 0.5, pose: '앉아폰', ex: exprAt([[0, '화남']], t), look: [-0.4, 0.4] });
  if (k === 0 && lt > 0.35 * D) h += pop(t, t - lt + 0.35 * D, t + 99, 1460, 170, label(0, 0, '화는 참으면 병?', { size: 44, bg: '#fff' }), { rot: 3 });
  if (k === 1) h += pop(t, t - lt + 0.1, t + 99, 1460, 170, big(0, 0, [[['화는, ', '#fff']], [['풀어야 사라질까?', YEL]]], { size: 62, sw: 13, lh: 76 }), {});
  if (k === 2) { h += big(1460, 170, [[['화는, ', '#fff']], [['풀어야 사라질까?', YEL]]], { size: 62, sw: 13, lh: 76 }); h += pop(t, t - lt + 0.3, t + 99, 1460, 330, label(0, 0, '제로의 7일 실험', { size: 40, bg: MINT }), { rot: -2 }); }
  return h;
}
// 4-5 the chat: "어디쯤이야?", the 1 disappears, no reply
function achatScene(t, lt, a) {
  const k = a.k || 0, D = D12(a);
  let unread = 1, bubbleK = 1, clock = '오후 7:05';
  if (k === 0) { bubbleK = prog(lt, segLt(t, lt, 1) - 0.05, segLt(t, lt, 1) + 0.3); const s2 = segLt(t, lt, 2); unread = 1 - prog(lt, s2 + 1.3, s2 + 1.7); }
  else { unread = 0; const mm = Math.round(lerp(10, 40, prog(lt, 0.2 * D, D))); clock = `오후 7:${mm}`; }
  let h = BG('#1B2340') + particles(t, 41, 18, [0, 0, 1920, 1080], '#8FDBFF', { speed: 8, r: 3, op: 0.35 });
  h += `<ellipse cx="900" cy="500" rx="560" ry="460" fill="url(#screenGlow)" opacity=".5"/>`;
  h += chatPhone(900, 500, 0.88, t, { clock, msgs: [{ me: 1, text: ['어디쯤이야?'], k: bubbleK, unread, time: '오후 7:02' }] });
  if (k === 0 && unread < 1 && unread > 0) h += `<circle cx="${f1(900 + 0.88 * 18)}" cy="${f1(500 + 0.88 * (-322 + 70))}" r="${f1(60 * (1 - unread))}" fill="#FFE36E" opacity="${f1(unread * 100) / 100}"/>`;
  if (k === 0 && lt > segLt(t, lt, 2) + 1.7) h += pop(t, t - lt + segLt(t, lt, 2) + 1.7, t + 99, 1460, 300, label(0, 0, '읽음', { size: 44, bg: YEL }), { rot: 4 });
  if (k === 1) {
    h += label(1460, 300, '읽음', { size: 44, bg: YEL });
    if (lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 1460, 420, label(0, 0, '답장 없음', { size: 44, bg: '#fff' }), { rot: -3 });
    h += Z({ t, seed: 1202, x: 1520, y: 900, s: 0.5, pose: '폰보기', ex: exprAt([[0, '걱정'], [0.5 * D, '서운함']], lt), look: [-0.4, 0.3] });
  }
  return h;
}
// 7-8 walking home at night: sadness turns into anger, a spark lands
function anightScene(t, lt, a, run) {
  const k = a.k || 0;
  let h = streetNight12(t);
  const x = 520 + (run || lt) * 40;
  h += shadow(x, 884, 70) + Z({ t, seed: 1203, x, y: 880, s: 0.6, pose: walkPose((run || lt) * 3.2, 0.55), ex: exprAt(k === 0 ? [[0, '서운함']] : [[0, '서운함'], [0.6, '화남']], lt), look: [0.3, 0.4] });
  if (k === 1) {
    const fk = prog(lt, 0.4, 1.4);
    h += fire12(x + 10, 470 - 60 * (1 - fk), 0.22 * easeOutBack(fk), t, 4 * fk + 1);
    if (fk >= 1) h += pop(t, t - lt + 1.4, t + 99, x + 210, 330, label(0, 0, '불씨', { size: 40, bg: '#FFB347' }), { rot: 4 });
  }
  return h;
}
// 9-10 title
titleScene = function (t, lt, a) {
  let h = labBg(t) + particles(t, 12, 36, [0, 0, 1920, 1080], '#FFB347', { speed: 40, r: 4, op: 0.5 });
  if (a.list) {
    h += big(960, 130, [[['매일 밤, ', '#fff'], ['화의 크기', YEL], [' 기록', '#fff']]], { size: 62, sw: 13 });
    // a 0..10 ruler with growing flames
    for (let n = 0; n <= 10; n++) { const kk = prog(lt, 0.2 + n * 0.12, 0.5 + n * 0.12); const x = 300 + n * 132; h += `<g opacity="${f1(kk * 100) / 100}">${fire12(x, 470, 0.18 + n * 0.012, t + n, n)}${T8(x, 560, String(n), { size: 44, fill: '#fff' })}</g>`; }
    h += T8(300, 620, '평온', { size: 30, fill: '#9CC9DE' }) + T8(1620, 620, '폭발', { size: 30, fill: RED });
    for (let d = 0; d < 7; d++) { const kk = prog(lt, 1.6 + d * 0.12, 1.9 + d * 0.12); h += `<g opacity="${f1(kk * 100) / 100}"><rect x="${330 + d * 190}" y="680" width="160" height="150" rx="18" fill="#16294A" stroke="${MINT}" stroke-width="4"/>${T8(410 + d * 190, 730, `${d + 1}일 차`, { size: 30, fill: MINT })}${T8(410 + d * 190, 805, '?', { size: 60, fill: '#fff' })}</g>`; }
    return h;
  }
  h += `<ellipse cx="960" cy="900" rx="320" ry="70" fill="url(#glow)"/><ellipse cx="960" cy="900" rx="260" ry="54" fill="#2E4260" stroke="${INK}" stroke-width="8"/>`;
  h += doctor(520, 960, 0.55, { t, expr: '미소', talk: 0 });
  h += pop(t, t - lt + 0.1, t + 99, 960, 120, label(0, 0, '오늘의 실험', { size: 42, bg: MINT }), {});
  h += pop(t, t - lt + 0.4, t + 99, 960, 270, big(0, 0, [[['화는 정말, ', '#fff']], [['풀어야 사라질까?', YEL]]], { size: 88, sw: 17, lh: 104 }), {});
  h += Z({ t, seed: 7, x: 960, y: 890, s: 0.6, pose: '서기', ex: exprAt([[0, '결심']], lt) });
  h += fire12(1420, 860, 0.38, t, 5);
  return h;
};
// 11-12 day 1: punching the bag = fanning the fire
function agymScene(t, lt, a, run) {
  const k = a.k || 0, rr = run || lt;
  const beat = (rr * 2.2) % 1, hit = beat < 0.35;
  let h = gymBg(t);
  const sw = hit ? 0 : Math.sin((beat - 0.35) / 0.65 * Math.PI) * 10;
  h += smokeFace(1080, 250, 0.6, t, 0.92);
  h += sandbag12(860, 860, 1.0, sw);
  h += shadow(560, 884, 90) + Z({ t, seed: 1204, x: 560, y: 880, s: 0.66, pose: hit ? '펀치' : '가드', ex: exprAt([[0, '화남']], t), look: [0.6, 0] });
  if (hit) h += `<g transform="translate(790 640)"><path d="M0 -40 L14 -12 L44 -16 L20 6 L34 34 L4 18 L-22 38 L-14 8 L-40 -10 L-10 -14 Z" fill="${YEL}" stroke="${INK}" stroke-width="5"/></g>`;
  const fanRot = -30 + 26 * fanBeat(rr, 0.45);
  const fv = k === 0 ? 3 + 2 * prog(rr, 0, 8) : 5 + 2.5 * prog(lt, 0, D12(a));
  h += fire12(1500, 840, 0.62, t, fv) + fan12(1300, 640, 0.75, fanRot) + wind12(1380, 640, 0.8, t, 0.9);
  h += pop(t, t - rr + 0.6, t + 99, 1300, 440, label(0, 0, '샌드백 한 번 = 부채질 한 번', { size: 34, bg: '#fff' }), { rot: -2 });
  return h;
}
// 13-14 day 2: venting on the phone
function acallScene(t, lt, a, run) {
  const k = a.k || 0, rr = run || lt, D = D12(a);
  let h = BG('url(#sunset)') + BG('url(#hatch)').replace('/>', ' opacity=".2"/>');
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#6E5A6E"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  h += windowDay(1200, 150, 420, 330, t);
  const ex = k === 0 ? [[0, '화남']] : [[0, '서운함']];
  h += shadow(620, 884, 90) + Z({ t, seed: 1205, x: 620 + Math.sin(rr * 0.8) * 30, y: 880, s: 0.66, pose: '폰통화', ex: exprAt(ex, lt), look: [0.5, 0] });
  const n = Math.min(6, Math.floor(rr * 1.3));
  const marks = ['!@#', '$%&', '!!', '어떻게', '나한테', '!?'];
  for (let i = 0; i < n; i++) { const ph = (rr * 0.5 + i * 0.17) % 1; h += `<g opacity="${f1((k === 0 ? 1 : 0.5) * Math.sin(ph * Math.PI) * 100) / 100}">${T8(820 + i * 30 + ph * 120, 420 - ph * 200 + (i % 2) * 40, marks[i], { size: 40 + (i % 3) * 8, fill: RED, stroke: INK, sw: 6 })}</g>`; }
  const fv = k === 0 ? 5 + 1.5 * prog(rr, 0, 6) : 6.5 + 1.5 * prog(lt, 0.5 * D, D);
  h += fire12(1540, 850, 0.6, t, fv) + fan12(1340, 640, 0.7, -30 + 24 * fanBeat(rr, 0.55)) + wind12(1420, 640, 0.8, t, 0.8);
  if (k === 0) h += pop(t, t - lt + 0.4 * D, t + 99, 820, 160, label(0, 0, '30분 통화', { size: 40, bg: YEL }), { rot: -3 });
  return h;
}
// 15-17 day 3 night: the long message
function atypeScene(t, lt, a, run) {
  const k = a.k || 0, D = D12(a);
  let h = nightRoom12(t, { wx: 1360 }) + desk12(1360, 700, t);
  let draft = [], finger = null, glow = 0;
  if (k === 0) draft = typeLines(LONG12, prog(lt, 0.4 * D, D) * 0.25);
  if (k === 1) { const s0 = segLt(t, lt, 0), s1 = segLt(t, lt, 1); draft = typeLines(LONG12, 0.25 + 0.75 * prog(lt, s0, s1 - 0.2)); if (lt > s1) { finger = 0.25; glow = 1; } }
  if (k === 2) { draft = LONG12; finger = 0.25; glow = 1; }
  h += chatPhone(640, 470, 0.84, t, { msgs: [{ me: 1, text: ['어디쯤이야?'], time: '오후 7:02' }], draft, draftRed: true, cursor: k < 2, sendGlow: glow, finger });
  h += chair12(1380, 880, 0.5) + Z({ t, seed: 1206, x: 1380, y: 880, s: 0.5, pose: '앉아폰', ex: exprAt(k === 2 ? [[0, '화남'], [0.4 * D, '걱정']] : [[0, '화남']], lt), look: [-0.4, 0.4] });
  h += fire12(1640, 860, 0.42, t, k === 2 ? 7 + prog(lt, 0, 1.2) : 7);
  if (k === 2 && lt > 0.45 * D) h += pop(t, t - lt + 0.45 * D, t + 99, 1340, 230, big(0, 0, [[['풀수록 ', '#fff'], ['더 커진다?', YEL]]], { size: 58, sw: 12 }), {});
  return h;
}
// 18 the doctor steps in
function alabScene(t, lt, a) {
  let h = labBg(t);
  h += `<rect x="980" y="170" width="640" height="380" rx="20" fill="#0E1E33" stroke="${MINT}" stroke-width="5"/>` + T8(1300, 230, '실험 파일', { size: 34, fill: MINT });
  h += sandbag12(1180, 520, 0.6, Math.sin(t * 3) * 6) + `<g transform="translate(1420 400)">${T8(0, 0, '?', { size: 140, fill: YEL, stroke: INK, sw: 8 })}</g>`;
  h += doctor(560, 960, 0.6, { t, expr: '미소', talk: env(t) });
  h += Z({ t, seed: 1207, x: 1500, y: 890, s: 0.56, pose: '서기', ex: exprAt([[0, '놀람']], lt), look: [-0.6, 0] });
  return h;
}
// 19-23 Bushman (2002): three groups, then a podium of anger
function essay12(x, y, s, t, stampK) {
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s}) rotate(-3)"><rect x="-200" y="-260" width="400" height="520" rx="10" fill="${INK}" opacity=".25" transform="translate(10 12)"/><rect x="-200" y="-260" width="400" height="520" rx="10" fill="#FFFDF7" stroke="${INK}" stroke-width="7"/>`;
  for (let i = 0; i < 9; i++) h += `<line x1="-160" y1="${-200 + i * 50}" x2="${140 - (i % 3) * 40}" y2="${-200 + i * 50}" stroke="#B9C4D4" stroke-width="10" stroke-linecap="round"/>`;
  if (stampK > 0) { const sc = lerp(2.2, 1, easeOut(stampK)); h += `<g transform="translate(20 40) rotate(-12) scale(${f1(sc * 100) / 100})" opacity="${f1(Math.min(1, stampK * 2) * 100) / 100}"><rect x="-190" y="-60" width="380" height="120" rx="14" fill="none" stroke="${RED}" stroke-width="10"/>${T8(0, 20, '최악의 글!', { size: 66, fill: RED })}</g>`; }
  return h + '</g>';
}
function groupCol(x, y, t, n, o = {}) { // one of the three experimental groups
  let h = `<g transform="translate(${x} ${y})"><rect x="-250" y="-430" width="500" height="560" rx="30" fill="#16294A" opacity=".85" stroke="${o.hi ? YEL : MINT}" stroke-width="${o.hi ? 8 : 4}"/>`;
  h += `<circle cx="-200" cy="-380" r="34" fill="${YEL}" stroke="${INK}" stroke-width="5"/>` + T8(-200, -366, String(n), { size: 40, fill: NAVY });
  if (n < 3) {
    const hit = ((t + n * 0.3) * 2) % 1 < 0.35;
    h += sandbag12(110, 60, 0.55, hit ? 0 : 6 * Math.sin(t * 6));
    h += Z({ t, seed: 1210 + n, x: -60, y: 100, s: 0.42, pose: hit ? '펀치' : '가드', ex: exprAt([[0, n === 1 ? '화남' : '결심']], t), look: [0.6, 0] });
    h += `<g transform="translate(40 -290)"><ellipse cx="0" cy="0" rx="120" ry="70" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="-90" cy="70" r="12" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="-112" cy="96" r="7" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
    if (n === 1) h += `<circle cx="0" cy="0" r="40" fill="#FFF3E0" stroke="${INK}" stroke-width="4"/><path d="M-22 -14 L-6 -6 M22 -14 L6 -6" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M-14 18 Q0 8 14 18" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>${T8(70, -24, '!', { size: 44, fill: RED })}`;
    else h += `<rect x="-60" y="-10" width="120" height="20" rx="8" fill="#56607A" stroke="${INK}" stroke-width="4"/><rect x="-80" y="-34" width="28" height="68" rx="8" fill="#3B3F4E" stroke="${INK}" stroke-width="4"/><rect x="52" y="-34" width="28" height="68" rx="8" fill="#3B3F4E" stroke="${INK}" stroke-width="4"/>`;
    h += `</g>`;
  } else {
    h += `<rect x="-90" y="-20" width="180" height="20" rx="6" fill="#8A5A34" stroke="${INK}" stroke-width="5"/><rect x="-80" y="0" width="14" height="100" fill="#6E4628"/><rect x="66" y="0" width="14" height="100" fill="#6E4628"/><rect x="66" y="-150" width="14" height="140" fill="#6E4628" stroke="${INK}" stroke-width="4"/>`;
    h += Z({ t, seed: 1213, x: 0, y: 70, s: 0.42, pose: '앉기', ex: exprAt([[0, '기본']], t) });
    h += `<g transform="translate(130 -290)"><circle r="56" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M0 0 L0 -36 M0 0 L24 10" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g>` + T8(130, -200, '2분', { size: 34, fill: '#fff' });
  }
  return h + T8(0, 170, o.cap, { size: 32, fill: '#fff', stroke: INK, sw: 6 }) + '</g>';
}
function abagScene(t, lt, a) {
  const k = a.k || 0, D = D12(a);
  let h = labBg(t);
  if (k === 0) {
    h += essay12(820, 450, 0.95, t, prog(lt, 0.55 * D, 0.55 * D + 0.35));
    h += pop(t, t - lt + 0.2 * D, t + 99, 1380, 300, label(0, 0, '대학생 600명', { size: 48, bg: YEL }), { rot: 3 });
    h += Z({ t, seed: 1214, x: 1400, y: 880, s: 0.5, pose: '서기', ex: exprAt([[0, '기본'], [0.6 * D, '화남']], lt), look: [-0.6, -0.2] });
    return h;
  }
  if (k === 1 || k === 2) {
    const shows = [1, k === 2 ? 1 : 0, k === 2 ? prog(lt, 0.5 * D, 0.5 * D + 0.4) : 0];
    const caps = ['치면서 상대 생각', '치면서 운동 생각', '가만히 앉아 있기'];
    for (let n = 0; n < 3; n++) { const kk = n === 0 && k === 1 ? prog(lt, 0.15 * D, 0.15 * D + 0.4) : (n === 1 && k === 2 ? prog(lt, 0.05, 0.45) : shows[n]); if (kk > 0) h += `<g opacity="${f1(clamp(kk * 2, 0, 1) * 100) / 100}">${groupCol(380 + n * 580, 610, t, n + 1, { cap: caps[n] })}</g>`; }
    return h;
  }
  // k 3-4: the podium
  h += big(960, 120, [[['가장 ', '#fff'], ['화가 난', YEL], [' 그룹은?', '#fff']]], { size: 60, sw: 12 });
  const P3 = [[960, 1, 340, '치면서 상대 생각', '화남'], [520, 2, 240, '치면서 운동 생각', '결심'], [1400, 3, 150, '가만히 앉아 있기', '기본']];
  P3.forEach(([x, n, ph, cap, ex], j) => {
    const kk = k === 3 ? prog(lt, 0.25 * D + j * 0.3, 0.25 * D + j * 0.3 + 0.4) : 1; if (kk <= 0) return;
    const hi = (k === 3 && n === 1) || (k === 4 && n === 3);
    h += `<g opacity="${f1(kk * 100) / 100}"><rect x="${x - 190}" y="${880 - ph}" width="380" height="${ph}" fill="${n === 1 ? '#E2553A' : n === 2 ? '#8A97B0' : '#5B8FD6'}" stroke="${hi ? YEL : INK}" stroke-width="${hi ? 10 : 7}"/>${T8(x, 880 - ph + 80, `${n}등`, { size: 60, fill: '#fff', stroke: INK, sw: 6 })}`;
    h += Z({ t, seed: 1220 + n, x, y: 880 - ph, s: 0.42, pose: n === 1 ? '펀치' : n === 2 ? '가드' : '서기', ex: exprAt([[0, ex]], t) });
    h += fire12(x + 150, 880 - ph - 10, 0.2, t, n === 1 ? 9 : n === 2 ? 6 : 2);
    h += T8(x, 880 - ph - 270, cap, { size: 30, fill: '#fff', stroke: INK, sw: 6 }) + '</g>';
  });
  if (k === 3 && lt > 0.62 * D) h += pop(t, t - lt + 0.62 * D, t + 99, 960, 230, label(0, 0, '가장 화남 · 가장 공격적', { size: 40, bg: RED, color: '#fff' }), { rot: -2 });
  if (k === 4) h += pop(t, t - lt + 0.35 * D, t + 99, 1400, 600, label(0, 0, '가장 덜 화남', { size: 44, bg: YEL }), { rot: 3, wobble: 2 });
  return h;
}
// 24-27 154 studies: cool the body; venting = fanning
function ametaScene(t, lt, a) {
  const k = a.k || 0, D = D12(a);
  let h = labBg(t);
  if (k === 0) {
    const n = Math.round(154 * easeOut(prog(lt, 0.2 * D, 0.85 * D)));
    for (let i = 0; i < n; i++) { const c = i % 26, r = Math.floor(i / 26); h += `<rect x="${136 + c * 64}" y="${300 + r * 76}" width="52" height="64" rx="6" fill="#FFFDF7" stroke="${INK}" stroke-width="3"/><line x1="${144 + c * 64}" y1="${320 + r * 76}" x2="${180 + c * 64}" y2="${320 + r * 76}" stroke="#B9C4D4" stroke-width="5"/>`; }
    h += big(1300, 230, [[['연구 ', '#fff'], [`${n}`, YEL], ['개', '#fff']]], { size: 80, sw: 15 });
    if (lt > 0.75 * D) h += pop(t, t - lt + 0.75 * D, t + 99, 1500, 820, label(0, 0, '참가자 1만 명+', { size: 46, bg: YEL }), { rot: -3 });
    return h;
  }
  if (k === 1) {
    const items = ['느린 호흡', '명상', '천천히 하는 요가', '잠깐 멈추기'];
    h += big(700, 150, [[['화를 줄인 것: ', '#fff'], ['몸 식히기', MINT]]], { size: 58, sw: 12 });
    items.forEach((it, i) => { const kk = prog(lt, 0.35 * D + i * 0.12 * D, 0.35 * D + i * 0.12 * D + 0.4); if (kk <= 0) return; h += `<g opacity="${f1(kk * 100) / 100}" transform="translate(${f1(lerp(-80, 0, easeOut(kk)))} 0)"><circle cx="320" cy="${330 + i * 130}" r="40" fill="${MINT}" stroke="${INK}" stroke-width="5"/><path d="M300 ${330 + i * 130} L316 ${346 + i * 130} L344 ${312 + i * 130}" fill="none" stroke="${NAVY}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>${T8(390, 348 + i * 130, it, { anchor: 'start', size: 50, fill: '#fff' })}</g>`; });
    h += fire12(1450, 800, 0.8, t, 7 - 5 * prog(lt, 0.35 * D, D));
    return h;
  }
  if (k === 2) {
    const rr = lt;
    h += `<rect x="300" y="820" width="760" height="60" rx="20" fill="#2E4260" stroke="${INK}" stroke-width="6"/>`;
    h += shadow(680, 824, 80) + Z({ t, seed: 1230, x: 680, y: 820, s: 0.6, pose: walkPose(rr * 9, 1.0), ex: exprAt([[0, '화남']], t), look: [0.6, 0] });
    for (let i = 0; i < 3; i++) h += `<line x1="${470 - i * 30}" y1="${560 + i * 50}" x2="${380 - i * 30}" y2="${560 + i * 50}" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".6"/>`;
    h += fire12(1450, 800, 0.8, t, 5 + 3 * prog(lt, 0.1 * D, 0.5 * D));
    h += pop(t, t - lt + 0.15 * D, t + 99, 1450, 200, label(0, 0, '화난 순간 달리기 → 불 ↑', { size: 40, bg: '#fff' }), { rot: 2 });
    if (lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 680, 230, label(0, 0, '운동은 좋아요! 화 빼기용으론 ✕', { size: 36, bg: MINT }), { rot: -2 });
    return h;
  }
  // k 3: venting = fanning
  h += fire12(1180, 840, 0.95, t, 8 + Math.sin(t * 3)) + fan12(820, 600, 1.1, -30 + 28 * fanBeat(t, 0.5)) + wind12(960, 600, 1.1, t, 1);
  h += pop(t, t - lt + 0.2, t + 99, 960, 170, big(0, 0, [[['쏟아내기 = ', '#fff'], ['부채질', YEL]]], { size: 96, sw: 18 }), {});
  return h;
}
// 30-33 Seneca's three movements: spark -> fan -> wildfire
function stagePanel(x, y, n, t, on, hi) {
  const titles = ['울컥', '맞장구', '폭주'], subs = ['불씨가 떨어진다', '부채질', '산불'];
  let h = `<g transform="translate(${x} ${y})" opacity="${on ? 1 : 0.35}"><rect x="-250" y="-300" width="500" height="560" rx="30" fill="#16294A" stroke="${hi ? YEL : '#3A5070'}" stroke-width="${hi ? 10 : 5}"/>`;
  h += T8(0, -230, `${n + 1}. ${titles[n]}`, { size: 52, fill: hi ? YEL : '#fff' });
  if (n === 0) { const f = (t * 0.7) % 1; h += `<g stroke="${INK}" stroke-width="6"><rect x="-110" y="120" width="220" height="30" rx="14" fill="#8E5D36" transform="rotate(-8)"/><rect x="-110" y="120" width="220" height="30" rx="14" fill="#7A4E2D" transform="rotate(8)"/></g><circle cx="${f1(Math.sin(t * 3) * 10)}" cy="${f1(-80 + f * 190)}" r="16" fill="#FFB347" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="${f1(-80 + f * 190)}" r="34" fill="url(#warm)"/>`; }
  if (n === 1) h += fire12(40, 160, 0.38, t, 5) + fan12(-120, 20, 0.62, -34 + 24 * fanBeat(t, 0.6)) + wind12(-40, 30, 0.6, t, 0.9);
  if (n === 2) { h += fire12(-110, 170, 0.36, t + 1, 9) + fire12(110, 170, 0.4, t, 10) + fire12(0, 190, 0.3, t + 2, 8); }
  h += T8(0, 236, subs[n], { size: 38, fill: '#C9D6E2' });
  return h + '</g>';
}
function afireScene(t, lt, a) {
  const k = a.k || 0, D = D12(a);
  let h = labBg(t);
  h += big(960, 110, [[['화가 오는 ', '#fff'], ['세 단계', YEL]]], { size: 60, sw: 12 });
  for (let n = 0; n < 3; n++) h += stagePanel(380 + n * 580, 520, n, t, k === 0 || k >= n + 1, k === n + 1);
  if (k === 1 && lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 380, 860, label(0, 0, '의지와 상관없음 · 내 탓 아님', { size: 32, bg: MINT }), { rot: -2 });
  if (k === 2) { h += `<path d="M960 220 L700 860 L1220 860 Z" fill="${YEL}" opacity="${f1((0.08 + 0.04 * Math.sin(t * 4)) * 100) / 100}"/>`; if (lt > 0.65 * D) h += pop(t, t - lt + 0.65 * D, t + 99, 960, 860, label(0, 0, '여기서 고른다!', { size: 44, bg: YEL }), { rot: 2, wobble: 2 }); }
  if (k === 3 && lt > 0.5 * D) h += pop(t, t - lt + 0.5 * D, t + 99, 1540, 860, label(0, 0, '멈추기 어려움', { size: 36, bg: RED, color: '#fff' }), { rot: 2 });
  return h;
}
// 34-35 rewind: everything Zero did was fanning
function rewindFrame(x, y, n, t, k) {
  let h = `<g transform="translate(${x} ${y})"><rect x="-230" y="-170" width="460" height="340" rx="16" fill="#0E1726" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 6; i++) h += `<rect x="${-210 + i * 76}" y="-160" width="40" height="18" rx="4" fill="#3A4A66"/><rect x="${-210 + i * 76}" y="142" width="40" height="18" rx="4" fill="#3A4A66"/>`;
  h += `<rect x="-210" y="-130" width="420" height="260" fill="${['#3A2F4A', '#5A4A6A', '#18203F'][n]}"/>`;
  if (n === 0) h += sandbag12(70, 120, 0.42, 0) + Z({ t, seed: 1250, x: -60, y: 120, s: 0.34, pose: '펀치', ex: exprAt([[0, '화남']], t) });
  if (n === 1) h += Z({ t, seed: 1251, x: 0, y: 120, s: 0.34, pose: '폰통화', ex: exprAt([[0, '화남']], t) }) + T8(110, -40, '!@#', { size: 40, fill: RED, stroke: INK, sw: 5 });
  if (n === 2) h += `<g transform="translate(0 0) scale(.6)"><rect x="-150" y="-180" width="300" height="340" rx="30" fill="#1F2D44" stroke="${INK}" stroke-width="8"/><rect x="-128" y="-158" width="256" height="296" rx="18" fill="#EAF0F6"/>${LONG12.map((l, i) => T8(-110, -110 + i * 52, l, { anchor: 'start', size: 30, fill: '#B3261E' })).join('')}</g>`;
  if (k > 0) h += `<g transform="translate(150 -100) scale(${f1(easeOutBack(clamp(k, 0, 1)) * 100) / 100})">${fan12(0, 40, 0.5, -20)}<g transform="translate(-10 130) rotate(-8)"><rect x="-110" y="-34" width="220" height="68" rx="14" fill="none" stroke="${RED}" stroke-width="8"/>${T8(0, 16, '부채질', { size: 44, fill: RED })}</g></g>`;
  return h + '</g>';
}
function arewindScene(t, lt, a) {
  const k = a.k || 0, D = D12(a);
  let h = labBg(t);
  if (k === 0) {
    h += `<g transform="translate(960 160)">${T8(0, 0, '◀◀ 되감기', { size: 50, fill: '#fff', stroke: INK, sw: 7 })}</g>`;
    for (let n = 0; n < 3; n++) h += rewindFrame(380 + n * 580, 520, n, t, prog(lt, (0.3 + n * 0.18) * D, (0.3 + n * 0.18) * D + 0.35));
    return h;
  }
  h += doctor(560, 960, 0.6, { t, expr: '미소', talk: env(t) });
  h += Z({ t, seed: 1252, x: 1480, y: 890, s: 0.56, pose: '서기', ex: exprAt([[0, '걱정'], [0.6 * D, '결심']], lt), look: [-0.6, 0] });
  h += pop(t, t - lt + 0.2, t + 99, 1040, 200, label(0, 0, '울컥 = 내 잘못 아님', { size: 44, bg: '#fff' }), { rot: -2 });
  if (lt > 0.5 * D) h += pop(t, t - lt + 0.5 * D, t + 99, 1040, 320, label(0, 0, '부채질 = 내가 고름', { size: 44, bg: YEL }), { rot: 2 });
  return h;
}
// 36-37 the confession: under the fire, hurt
function aconfessScene(t, lt, a) {
  const k = a.k || 0, D = D12(a);
  let h = bedroom(t, { clock: '23:40' });
  const x = 880, y = 830;
  h += Z({ t, seed: 1260, x, y, s: 0.62, pose: '앉기', ex: exprAt([[0, '서운함']], t), look: [0.2, 0.5] });
  const lift = k === 1 ? easeInOut(prog(lt, 0.1 * D, 0.5 * D)) : 0;
  const cx = x + 330, cy = 360;
  h += `<g transform="translate(0 ${f1(-lift * 140)})" opacity="${f1((1 - 0.6 * lift) * 100) / 100}">${fire12(cx, cy + 90, 0.4, t, 6)}</g>`;
  if (k === 1) {
    const kk = prog(lt, 0.35 * D, 0.6 * D);
    h += `<g opacity="${f1(kk * 100) / 100}" transform="translate(${cx} ${cy + 40}) scale(${f1(lerp(0.6, 1, easeOutBack(kk)) * 100) / 100})"><circle r="120" fill="#7CC7FF" opacity=".25"/><path d="M0 -70 Q52 -6 46 30 Q38 76 0 80 Q-38 76 -46 30 Q-52 -6 0 -70 Z" fill="#7CC7FF" stroke="${INK}" stroke-width="7"/><path d="M-16 6 Q-14 30 4 44" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".7"/></g>`;
    if (kk >= 1) h += pop(t, t - lt + 0.6 * D, t + 99, cx, cy + 190, label(0, 0, '서운함', { size: 44, bg: '#7CC7FF' }), { rot: -2 });
  }
  return h;
}
// 38-39 Seneca's remedy: delay = cut the wind
function aquoteScene(t, lt, a) {
  const k = a.k || 0, D = D12(a);
  let h = parchment12();
  h += SE({ t, seed: 1270, x: 400, y: 880, s: 0.66, pose: '설명', ex: exprAt([[0, '기본']], t), look: [0.5, 0] });
  if (k === 0) {
    if (lt > 0.42 * D) h += pop(t, t - lt + 0.42 * D, t + 99, 1160, 360, outlined(0, 0, [[['화의 가장 큰 약은,', NAVY]], [['늦추는 것.', '#C8423A']]], { size: 88, sw: 0, lh: 120, shadow: false, stroke: 'none' }), { noPop: true, inDur: 0.5 });
    if (lt > 0.7 * D) h += pop(t, t - lt + 0.7 * D, t + 99, 1160, 620, T8(0, 0, '세네카, 『분노에 관하여』 2권', { size: 34, fill: '#6B5A3A' }), { noPop: true });
    return h;
  }
  const cut = prog(lt, 0.15 * D, 0.45 * D);
  h += T8(1160, 210, '늦추기 = 바람 끊기', { size: 60, fill: NAVY });
  h += fire12(1260, 800, 0.8, t, lerp(7, 1.5, easeInOut(prog(lt, 0.3 * D, D))));
  h += wind12(960, 560, 1.0, t, 1 - cut) + scissors12(860 + 120 * cut, 460, 0.9, Math.abs(Math.sin(t * 8)) * (1 - cut));
  return h;
}
// 40-41 day 4: write it down, tear it up
function apaperScene(t, lt, a) {
  const k = a.k || 0, D = D12(a);
  let h = BG('url(#dayRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".25"/>');
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#C9AE8C"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  if (k === 0) {
    h += desk12(860, 700, t, 0);
    h += Z({ t, seed: 1280, x: 640, y: 880, s: 0.6, pose: '책상', ex: exprAt([[0, '결심']], t), look: [0.5, 0.6] });
    const tear = prog(lt, 0.62 * D, 0.72 * D), fly = prog(lt, 0.72 * D, 0.95 * D);
    if (tear < 1) { h += `<g transform="translate(900 640) rotate(-4)"><rect x="-120" y="-60" width="240" height="120" rx="6" fill="#FFFDF7" stroke="${INK}" stroke-width="5"/>${typeLines(['너는 항상 이런', '식이야…'], prog(lt, 0.1 * D, 0.55 * D)).map((l, i) => T8(-100, -16 + i * 40, l, { anchor: 'start', size: 30, fill: '#B3261E', w: 700 })).join('')}</g>`; if (tear > 0) h += `<path d="M900 580 L908 610 L894 640 L910 670 L900 700" stroke="${INK}" stroke-width="5" fill="none"/>`; }
    else for (let i = 0; i < 8; i++) { const sx = 900 + (hash(i) - 0.5) * 200, ex = 1330, ey = 780; const px = lerp(sx, ex, easeIn(fly)), py = lerp(640, ey, easeIn(fly)) - Math.sin(fly * Math.PI) * 180; h += `<rect x="${f1(px - 28)}" y="${f1(py - 20)}" width="56" height="40" rx="4" fill="#FFFDF7" stroke="${INK}" stroke-width="4" transform="rotate(${f1(i * 40 + fly * 300)} ${f1(px)} ${f1(py)})"/>`; }
    h += `<path d="M1260 740 L1400 740 L1386 880 L1274 880 Z" fill="#8A97B0" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="1248" y="724" width="164" height="22" rx="8" fill="#6E7A90" stroke="${INK}" stroke-width="6"/>`;
    return h;
  }
  // the study: throw away vs keep
  const bars = (x, title, icon, after) => {
    let g = `<g transform="translate(${x} 0)"><rect x="-330" y="180" width="660" height="640" rx="30" fill="#FFFDF7" stroke="${INK}" stroke-width="7"/>` + T8(0, 260, title, { size: 46, fill: NAVY }) + icon;
    const kk = prog(lt, 0.3 * D, 0.7 * D);
    [['처음', 2], ['혹평 뒤', 8], ['그 뒤', lerp(8, after, kk)]].forEach(([lab, v], i) => { const bx = -200 + i * 200, hh = v * 34; g += `<rect x="${bx - 50}" y="${780 - hh}" width="100" height="${f1(hh)}" rx="10" fill="${i === 2 ? (v < 4 ? MINT : '#FF7A3D') : i === 1 ? '#FF4D4D' : '#9CC9DE'}" stroke="${INK}" stroke-width="5"/>` + T8(bx, 810, lab, { size: 28, fill: '#56607A' }); });
    return g + '</g>';
  };
  const bin = `<path d="M-50 300 L50 300 L42 400 L-42 400 Z" fill="#8A97B0" stroke="${INK}" stroke-width="6"/><rect x="-60" y="286" width="120" height="18" rx="6" fill="#6E7A90" stroke="${INK}" stroke-width="5"/>`;
  const box = `<rect x="-60" y="300" width="120" height="90" rx="8" fill="#C79A6A" stroke="${INK}" stroke-width="6"/><rect x="-30" y="290" width="60" height="30" rx="4" fill="#FFFDF7" stroke="${INK}" stroke-width="4"/>`;
  h += bars(560, '적고 버린 사람', bin, 2.2) + bars(1360, '적고 간직한 사람', box, 6.4);
  if (lt > 0.72 * D) h += pop(t, t - lt + 0.72 * D, t + 99, 560, 140, label(0, 0, '원래대로!', { size: 44, bg: MINT }), { rot: -3 });
  return h;
}
// 42-43 day 5: a long breath, "not yet known"
function abreathScene(t, lt, a, run) {
  const k = a.k || 0;
  let h = BG('url(#morning)');
  h += `<rect x="-600" y="700" width="3120" height="200" fill="#9CCB8A"/><rect x="-600" y="880" width="3120" height="600" fill="#7DAE6E"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  h += trees2 ? trees2(0, 880, t) : '';
  const ph = ((run || lt) / 6) % 1, br = 0.5 - 0.5 * Math.cos(ph * Math.PI * 2);
  h += `<circle cx="760" cy="560" r="${f1(220 + 120 * br)}" fill="${MINT}" opacity="${f1((0.12 + 0.1 * br) * 100) / 100}" stroke="${MINT}" stroke-width="6" stroke-opacity=".5"/>`;
  h += T8(760, 180, br > 0.5 && ph < 0.5 ? '들이쉬고…' : '길게 내쉬고…', { size: 44, fill: NAVY });
  h += Z({ t, seed: 1290, x: 760, y: 880, s: 0.64, pose: '서기', ex: exprAt([[0, '잠']], t) });
  h += fire12(1450, 860, 0.55, t, 6 - 1.2 * prog(run || lt, 0, 10));
  if (k === 1) h += pop(t, t - lt + 0.8, t + 99, 1150, 330, label(0, 0, '아직, 모른다', { size: 50, bg: '#fff' }), { rot: -3 });
  return h;
}
// 44-47 day 6 night: the nightly review, and Zero's own mistake
function areviewScene(t, lt, a) {
  const k = a.k || 0, D = D12(a);
  let h = nightRoom12(t, { wx: 1360 }) + desk12(760, 700, t);
  h += Z({ t, seed: 1300, x: 600, y: 880, s: 0.6, pose: '책상', ex: exprAt(k >= 2 ? [[0, '미안']] : [[0, '기본']], t), look: [0.5, 0.5] });
  h += `<g transform="translate(860 682) rotate(-6)"><rect x="-90" y="-16" width="180" height="32" rx="4" fill="#FFFDF7" stroke="${INK}" stroke-width="4"/></g>`;
  if (k === 1) h += pop(t, t - lt + 0.1, t + 99, 1340, 640, `<rect x="-420" y="-90" width="840" height="180" rx="24" fill="#FFFDF7" stroke="${INK}" stroke-width="7"/>` + T8(0, -10, '오늘 나는, 어떤 나쁜 습관을', { size: 44, fill: NAVY }) + T8(0, 50, '고쳤나?', { size: 44, fill: '#C8423A' }), { rot: -2 });
  if (k === 2) {
    const kk = prog(lt, 0.2 * D, 0.45 * D);
    h += `<g opacity="${f1(kk * 100) / 100}">` + bubble(1260, 420, 640, 420, '', {}) + `</g>`;
    if (kk > 0) {
      h += `<g opacity="${f1(kk * 100) / 100}"><rect x="1000" y="250" width="520" height="330" rx="20" fill="#F2E3C9"/>` + DY({ t, seed: 1301, x: 1140, y: 540, s: 0.36, pose: '서기', ex: exprAt([[0, '서운함']], t) });
      h += `<rect x="1220" y="430" width="200" height="22" rx="6" fill="#8A5A34" stroke="${INK}" stroke-width="5"/><g transform="translate(1400 330)"><circle r="40" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M0 0 L0 -26 M0 0 L18 8" stroke="${INK}" stroke-width="5" stroke-linecap="round"/></g>` + label(1260, 600, '작년 · 제로가 늦었던 날', { size: 30, bg: YEL }) + '</g>';
    }
  }
  if (k === 3) {
    h += `<g transform="translate(1170 530)"><rect x="-470" y="-320" width="940" height="620" rx="30" fill="#16294A" opacity=".92" stroke="${MINT}" stroke-width="5"/>`;
    h += T8(0, -250, '남의 잘못은 눈앞에,', { size: 44, fill: '#fff' }) + T8(0, -190, '내 잘못은 등 뒤에', { size: 44, fill: YEL });
    h += `<g transform="translate(-300 -20)"><rect x="-80" y="-110" width="160" height="200" rx="34" fill="#8A6A44" stroke="${INK}" stroke-width="7"/><rect x="-60" y="-20" width="120" height="70" rx="14" fill="#7A5A38" stroke="${INK}" stroke-width="5"/>${T8(0, -46, '내 잘못', { size: 34, fill: '#fff' })}</g>`;
    h += Z({ t, seed: 1302, x: -150, y: 270, s: 0.62, pose: '서기', ex: exprAt([[0, '놀람']], t), look: [0.7, -0.2] });
    h += `<g transform="translate(230 30)"><circle r="120" fill="#CDEBFF" opacity=".55" stroke="${INK}" stroke-width="9"/><line x1="-86" y1="86" x2="-170" y2="170" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>${DY({ t, seed: 1303, x: 0, y: 80, s: 0.26, pose: '서기', ex: exprAt([[0, '지친']], t) })}${T8(0, 160, '남의 잘못', { size: 34, fill: YEL, stroke: INK, sw: 6 })}</g>`;
    h += '</g>';
  }
  return h;
}
// 48 the week as a mountain of fire; the smoke clears
function agaugeScene(t, lt, a) {
  const D = D12(a);
  let h = labBg(t);
  h += big(960, 110, [[['7일간 ', '#fff'], ['화의 크기', YEL]]], { size: 58, sw: 12 });
  const x0 = 360, dx = 200, base = 780;
  const pts = FIRE_VAL.map((v, d) => [x0 + d * dx, base - v * 50, prog(lt, d * 0.35, d * 0.35 + 0.4)]).filter(p => p[2] > 0);
  if (pts.length > 1) h += `<path d="${pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ')}" fill="none" stroke="${MINT}" stroke-width="6" stroke-dasharray="14 10" opacity=".7"/>`;
  FIRE_VAL.forEach((v, d) => { const kk = prog(lt, d * 0.35, d * 0.35 + 0.4); if (kk <= 0) return; const x = x0 + d * dx, y = base - v * 50; h += `<g opacity="${f1(kk * 100) / 100}">${fire12(x, y + 10, 0.12 + v * 0.02, t + d, v)}${T8(x, base + 60, `${d + 1}일`, { size: 34, fill: '#fff' })}${T8(x, y - 30 - v * 16, String(v), { size: 40, fill: v >= 7 ? RED : YEL, stroke: INK, sw: 6 })}</g>`; });
  h += smokeFace(1600, 330, 0.36, t, 1, prog(lt, 0.5 * D, D));
  return h;
}
// 49-50 "then should I just hold it in?"
function adocqScene(t, lt, a) {
  const k = a.k || 0, D = D12(a);
  let h = labBg(t);
  if (k === 0) {
    const s1 = segLt(t, lt, 1);
    h += doctor(560, 960, 0.6, { t, expr: lt > s1 ? '미소' : '기본', talk: lt > s1 ? env(t) : 0 });
    h += Z({ t, seed: 1310, x: 1420, y: 890, s: 0.58, pose: lt > s1 ? '서기' : '설명', ex: exprAt([[0, '걱정'], [s1 + 1.5, '결심']], lt), look: [-0.6, 0] });
    if (lt > s1 + 0.5) h += pop(t, t - lt + s1 + 0.5, t + 99, 980, 220, label(0, 0, '참기 ✕', { size: 44, bg: '#fff' }), { rot: -3 });
    if (lt > s1 + 2.6) h += pop(t, t - lt + s1 + 2.6, t + 99, 980, 340, label(0, 0, '할 말은, 불이 꺼진 다음에', { size: 44, bg: YEL }), { rot: 2 });
    return h;
  }
  h += fire12(960, 820, 0.95, t, lerp(5, 0, easeInOut(prog(lt, 0.1, D))));
  h += pop(t, t - lt + 0.1, t + 99, 960, 200, big(0, 0, [[['바람을 끊으면, ', '#fff']], [['불은 혼자 꺼진다', YEL]]], { size: 76, sw: 15, lh: 96 }), {});
  return h;
}
// 51-53 day 7 morning: Doyun's message
const DYMSG = [['그날 아빠가 쓰러지셔서', '응급실에 있었어.'], ['단톡방은 열었는데,', '손이 떨려서', '아무것도 못 쓰겠더라.'], ['생일 망쳐서 미안.']];
function amsgScene(t, lt, a) {
  const k = a.k || 0, D = D12(a);
  if (k === 0) {
    let h = morningRoom12(t) + desk12(820, 700, t, 0);
    const buzz = lt > 0.3 * D ? Math.sin(t * 60) * 4 : 0;
    h += `<g transform="translate(${f1(900 + buzz)} 676) rotate(-4)"><rect x="-70" y="-14" width="140" height="28" rx="10" fill="#1F2D44" stroke="${INK}" stroke-width="5"/><rect x="-60" y="-10" width="120" height="16" rx="6" fill="#8FDBFF"/></g>`;
    if (lt > 0.3 * D) for (let i = 0; i < 2; i++) h += `<path d="M${830 - i * 24} ${640 - i * 10} q-14 20 0 40 M${970 + i * 24} ${640 - i * 10} q14 20 0 40" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity="${f1(Math.abs(Math.sin(t * 8)) * 100) / 100}"/>`;
    h += Z({ t, seed: 1320, x: 560, y: 880, s: 0.6, pose: '서기', ex: exprAt([[0, '기본'], [0.6 * D, '놀람']], lt), look: [0.6, 0.4] });
    if (lt > 0.6 * D) h += pop(t, t - lt + 0.6 * D, t + 99, 1060, 480, label(0, 0, '도윤', { size: 48, bg: '#4F86C6', color: '#fff' }), { rot: 3, wobble: 2 });
    return h;
  }
  let h = BG('#E9EEF5');
  const msgs = [{ me: 1, text: ['어디쯤이야?'], time: '금 오후 7:02', hi: k === 2 }];
  DYMSG.forEach((m, j) => msgs.push({ text: m, k: k === 1 ? prog(lt, 0.3 + j * 2.6, 0.7 + j * 2.6) : 1 }));
  h += chatPhone(960, 500, 0.9, t, { msgs, clock: '오전 7:12' });
  if (k === 2 && lt > 0.55 * D) h += pop(t, t - lt + 0.55 * D, t + 99, 1500, 240, label(0, 0, '무시가 아니었다', { size: 44, bg: YEL }), { rot: 3 });
  if (k === 2) h += Z({ t, seed: 1321, x: 1560, y: 900, s: 0.5, pose: '가슴', ex: exprAt([[0, '울먹']], t), look: [-0.5, 0.2] }) + tears12(1560, 900, 0.5, t);
  return h;
}
// 55 the short reply
function areplyScene(t, lt, a) {
  const D = D12(a), s1 = segLt(t, lt, 1);
  let h = BG('#E9EEF5');
  const sent = lt > s1 + 2.6;
  const msgs = [{ me: 1, text: ['어디쯤이야?'], time: '금 오후 7:02' }];
  DYMSG.forEach(m => msgs.push({ text: m }));
  const reply = ['아버님은 괜찮으셔?', '필요한 거 있으면 말해.'];
  if (sent) msgs.push({ me: 1, text: reply, k: prog(lt, s1 + 2.6, s1 + 3.0), time: '오전 7:31' });
  h += chatPhone(960, 500, 0.9, t, { msgs, clock: '오전 7:31', draft: sent ? [] : typeLines(reply, prog(lt, s1, s1 + 2.4)), cursor: !sent, sendGlow: !sent && lt > s1 + 2.2 ? 1 : 0 });
  h += Z({ t, seed: 1322, x: 1560, y: 900, s: 0.5, pose: '폰보기', ex: exprAt([[0, '미안']], t), look: [-0.5, 0.2] });
  return h;
}
// 58-60 the card in the box
function acardScene(t, lt, a) {
  const k = a.k || 0, D = D12(a);
  let h = BG('#F6E7CF') + `<circle cx="960" cy="500" r="620" fill="url(#warm)" opacity=".7"/>` + particles(t, 52, 24, [0, 0, 1920, 1080], '#FFD27A', { speed: 18, r: 5, op: 0.6 });
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#D9B98C"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  const open = k === 0 ? prog(lt, 0.3 * D, 0.8 * D) : 1;
  // the box
  h += `<g transform="translate(960 760)"><rect x="-200" y="-110" width="400" height="200" rx="14" fill="#E2553A" stroke="${INK}" stroke-width="8"/><rect x="-24" y="-110" width="48" height="200" fill="${YEL}" stroke="${INK}" stroke-width="5"/>`;
  h += `<g transform="translate(0 ${f1(-110 - open * 140)}) rotate(${f1(-open * 18)})"><rect x="-216" y="-40" width="432" height="56" rx="12" fill="#F06A4E" stroke="${INK}" stroke-width="8"/><rect x="-24" y="-40" width="48" height="56" fill="${YEL}" stroke="${INK}" stroke-width="5"/><path d="M0 -40 Q-60 -110 -90 -60 Q-60 -30 0 -40 Q60 -110 90 -60 Q60 -30 0 -40 Z" fill="${YEL}" stroke="${INK}" stroke-width="5"/></g></g>`;
  // the card rises
  const rise = k === 0 ? prog(lt, 0.65 * D, D) : 1;
  if (rise > 0) {
    const cy = lerp(700, 380, easeOutBack(rise));
    h += `<g transform="translate(960 ${f1(cy)}) rotate(-3)"><rect x="-430" y="-200" width="860" height="400" rx="14" fill="${INK}" opacity=".2" transform="translate(10 12)"/><rect x="-430" y="-200" width="860" height="400" rx="14" fill="#FFFDF7" stroke="${INK}" stroke-width="7"/>`;
    h += heart(380, -150, 1.4, PINK);
    if (k >= 1) {
      const lines = ['생일 축하해.', '15년 동안 내 편이 되어 줘서', '고마워.'];
      const shown = k === 1 ? typeLines(lines, prog(lt, 0.2, 0.85 * D)) : lines;
      shown.forEach((ln, i) => { h += `<text x="-360" y="${-70 + i * 90}" font-family="'Nanum Pen Script', ${FONT}" font-weight="700" font-size="64" fill="#2B3A55">${esc(ln)}</text>`; });
      if (k === 2 || lt > 0.85 * D) h += `<text x="330" y="160" text-anchor="end" font-family="'Nanum Pen Script', ${FONT}" font-weight="700" font-size="52" fill="#4F86C6">- 도윤</text>`;
    }
    h += '</g>';
  }
  if (k === 2) h += Z({ t, seed: 1330, x: 1600, y: 900, s: 0.52, pose: '받기', ex: exprAt([[0, '울먹']], t), look: [-0.5, -0.3] }) + tears12(1600, 900, 0.52, t);
  return h;
}
// 61-62 the smoke has cleared: two friends, morning
function aendScene(t, lt, a, run) {
  const k = a.k || 0, rr = run || lt;
  let h = BG('url(#morning)');
  h += `<circle cx="1500" cy="300" r="90" fill="#FFE29A"/><circle cx="1500" cy="300" r="260" fill="url(#warm)" opacity=".6"/>`;
  h += clouds(t, 120, 12, 3, 5);
  h += `<rect x="-600" y="760" width="3120" height="140" fill="#A9D18E"/><rect x="-600" y="880" width="3120" height="600" fill="#8DBE74"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  const x = 420 + rr * 55;
  h += shadow(x, 884, 70) + Z({ t, seed: 1340, x, y: 880, s: 0.58, pose: walkPose(rr * 2.8, 0.5), ex: exprAt([[0, '신남']], t), look: [0.5, -0.1] });
  h += shadow(x + 200, 884, 70) + DY({ t, seed: 1341, x: x + 200, y: 880, s: 0.58, pose: walkPose(rr * 2.8 + 1.2, 0.5), ex: exprAt([[0, '뿌듯']], t), look: [-0.4, -0.1] });
  h += fire12(1560, 860, 0.4, t, 0);
  if (k === 0) h += pop(t, t - lt + 0.3, t + 99, 960, 170, outlined(0, 0, ['화가 나 있을 땐, 내 이야기만'], { size: 56, sw: 12 }), { noPop: true, inDur: 0.6 });
  if (k === 1) { h += outlined(960, 170, ['화가 나 있을 땐, 내 이야기만'], { size: 56, sw: 12 }); h += pop(t, t - lt + 0.3, t + 99, 960, 260, outlined(0, 0, [[['늦추면, ', '#fff'], ['상대의 이야기가 도착한다', YEL]]], { size: 56, sw: 12 }), { noPop: true, inDur: 0.6 }); }
  return h;
}
// 63-65 recap
function arecapScene(t, lt, a) {
  const k = a.k || 0, D = D12(a);
  let h = labBg(t);
  if (k === 0) {
    h += pop(t, t - lt + 0.1, t + 99, 960, 160, label(0, 0, '오늘의 실험 · 한 줄 정리', { size: 40, bg: MINT }), {});
    h += pop(t, t - lt + 0.4 * D, t + 99, 960, 330, big(0, 0, [[['화는 ', '#fff'], ['쏟으면 커지고,', '#FF7A3D']], [['늦추면 ', '#fff'], ['꺼진다', YEL]]], { size: 84, sw: 16, lh: 110 }), {});
    h += fire12(560, 860, 0.5, t, 8) + fan12(380, 700, 0.5, -30 + 24 * fanBeat(t, 0.5)) + fire12(1360, 860, 0.5, t, 0.3);
    h += `<g transform="translate(960 760)">${T8(0, 0, '→', { size: 120, fill: '#fff', stroke: INK, sw: 8 })}</g>`;
    return h;
  }
  if (k === 1) {
    h += chatPhone(760, 500, 0.8, t, { msgs: [], draft: ['…', '(보내지 않고 저장)'], clock: '오후 11:40' });
    h += `<g transform="translate(1340 330)"><circle r="110" fill="#FFF2C0" stroke="${INK}" stroke-width="7"/><circle cx="46" cy="-30" r="104" fill="#16294A"/></g>`;
    h += pop(t, t - lt + 0.4 * D, t + 99, 1340, 560, label(0, 0, '하룻밤 재우기', { size: 48, bg: YEL }), { rot: -3, bob: 3 });
    h += Z({ t, seed: 1350, x: 1420, y: 900, s: 0.48, pose: '서기', ex: exprAt([[0, '잠']], t) });
    return h;
  }
  h += pop(t, t - lt + 0.2, t + 99, 960, 250, big(0, 0, [[['보내지 않아서 ', '#fff'], ['다행이었던', YEL]], [['메시지, 있나요?', '#fff']]], { size: 74, sw: 15, lh: 96 }), {});
  h += pop(t, t - lt + 0.5 * D, t + 99, 960, 500, label(0, 0, '댓글로 들려주세요', { size: 46, bg: MINT }), { bob: 3 });
  h += Z({ t, seed: 1351, x: 960, y: 900, s: 0.52, pose: '손인사', ex: exprAt([[0, '신남']], t) });
  return h;
}

/* ---------- no subtitle for silent lines (the message / the card are on screen); HUD outside the camera ---------- */
const _subtitle12 = subtitle;
subtitle = function (t) { const l = TL.lines[lineIdx12(t)]; if (l && l.args && l.args.silent && t >= l.t0 - 0.1 && t <= l.t1 + 0.2) return ''; return _subtitle12(t); };
const _render12 = render;
render = function (t) { _render12(t); const h = hud12(t); if (h) document.getElementById('v').insertAdjacentHTML('beforeend', h); };
window.render = render;

thanksScene = function (t, lt) {
  let h = labBg(t) + particles(t, 77, 30, [0, 0, 1920, 1080], YEL, { speed: 30, r: 5, op: 0.6 });
  h += pop(t, t - lt + 0.2, t + 99, 960, 220, outlined(0, 0, [[['끝까지 함께해 주셔서', '#fff']], [['고맙습니다', YEL]]], { size: 92, sw: 17 }), {});
  h += doctor(560, 960, 0.5, { t, expr: '미소', talk: env(t) });
  h += Z({ t, seed: 78, x: 960, y: 890, s: 0.56, pose: '손인사', ex: exprAt([[0, '신남']], t) });
  h += DY({ t, seed: 79, x: 1240, y: 890, s: 0.56, pose: '손인사', ex: exprAt([[0, '뿌듯']], t), look: [-0.3, 0] });
  h += fire12(1560, 870, 0.32, t, 2);
  h += pop(t, t - lt + 1.2, t + 99, 960, 450, label(0, 0, '상식실험실', { size: 46, bg: MINT }), {});
  return h;
};
