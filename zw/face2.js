/* 제로의 세계 — 표정 v3 (face2). shorts/engine.js의 E에 'z'로 시작하는 표정을 더한다.
   새 엔진 훅: fxUnder(볼 아래층), fxEye(눈과 함께 움직이고 깜빡이는 층), fx(얼굴 위층). 모두 머리 로컬 좌표(머리 중심 200,170).
   눈 색 EY는 INK와 달라야 엔진 기본 하이라이트가 겹치지 않는다. */
const EY = '#1E1E26', MO = '#5A1E2A', TONGUE = '#FF8FA3', BLUSH = '#FF9BB0', TEARC = '#8FD3FF', GLOOM = '#6F6FD8';
const zEyes = (rx, ry, cy = 190, dx = 0) => ({ eyeL: ell(165 + dx, cy, rx, ry), eyeR: ell(235 + dx, cy, rx, ry), eyeFill: EY, eyeSW: 0 });
const zHL = (cx, cy, k = 1) => `<circle cx="${f1(cx + 5 * k)}" cy="${f1(cy - 7 * k)}" r="${f1(5.5 * k)}" fill="#fff"/><circle cx="${f1(cx - 4 * k)}" cy="${f1(cy + 6 * k)}" r="${f1(2.6 * k)}" fill="#fff"/>`;
const zHL2 = (cy = 190, k = 1, dx = 0) => zHL(165 + dx, cy, k) + zHL(235 + dx, cy, k);
const zStar = (cx, cy, r, fill = '#fff', sw = 0) => `<path d="M${f1(cx)} ${f1(cy - r)} Q${f1(cx + r * 0.18)} ${f1(cy - r * 0.18)} ${f1(cx + r)} ${f1(cy)} Q${f1(cx + r * 0.18)} ${f1(cy + r * 0.18)} ${f1(cx)} ${f1(cy + r)} Q${f1(cx - r * 0.18)} ${f1(cy + r * 0.18)} ${f1(cx - r)} ${f1(cy)} Q${f1(cx - r * 0.18)} ${f1(cy - r * 0.18)} ${f1(cx)} ${f1(cy - r)} Z" fill="${fill}"${sw ? ` stroke="${INK}" stroke-width="${sw}"` : ''}/>`;
const zHeartP = (cx, cy, s) => `M${f1(cx)} ${f1(cy + 20 * s)} C${f1(cx - 28 * s)} ${f1(cy)} ${f1(cx - 38 * s)} ${f1(cy - 12 * s)} ${f1(cx - 38 * s)} ${f1(cy - 26 * s)} C${f1(cx - 38 * s)} ${f1(cy - 42 * s)} ${f1(cx - 24 * s)} ${f1(cy - 48 * s)} ${f1(cx - 14 * s)} ${f1(cy - 48 * s)} C${f1(cx - 6 * s)} ${f1(cy - 48 * s)} ${f1(cx)} ${f1(cy - 42 * s)} ${f1(cx)} ${f1(cy - 36 * s)} C${f1(cx)} ${f1(cy - 42 * s)} ${f1(cx + 6 * s)} ${f1(cy - 48 * s)} ${f1(cx + 14 * s)} ${f1(cy - 48 * s)} C${f1(cx + 24 * s)} ${f1(cy - 48 * s)} ${f1(cx + 38 * s)} ${f1(cy - 42 * s)} ${f1(cx + 38 * s)} ${f1(cy - 26 * s)} C${f1(cx + 38 * s)} ${f1(cy - 12 * s)} ${f1(cx + 28 * s)} ${f1(cy)} ${f1(cx)} ${f1(cy + 20 * s)} Z`;
const zSpiral = (cx, cy) => { let d = `M${cx} ${cy}`; for (let i = 1; i <= 26; i++) { const a = i * 0.62, r = i * 0.82; d += ` L${f1(cx + Math.cos(a) * r)} ${f1(cy + Math.sin(a) * r)}`; } return d; };
const zBlush = (op = 0.55, r = 1) => `<ellipse cx="146" cy="216" rx="${18 * r}" ry="${9 * r}" fill="${BLUSH}" opacity="${op}"/><ellipse cx="254" cy="216" rx="${18 * r}" ry="${9 * r}" fill="${BLUSH}" opacity="${op}"/>`;
const zBlushLines = `<path d="M134 220 l8 -12 M146 222 l8 -12 M158 224 l8 -12 M242 224 l8 -12 M254 222 l8 -12 M266 220 l8 -12" stroke="#FF6F8E" stroke-width="4" stroke-linecap="round"/>`;
const zGloom = `<g clip-path="url(#headClip)">` + [128, 148, 168, 188, 208, 228, 248, 268].map((x, i) => `<line x1="${x}" y1="58" x2="${x}" y2="${f1(118 + (i % 3) * 10)}" stroke="${GLOOM}" stroke-width="5" opacity=".6"/>`).join('') + `</g>`;
const zDrop = (x, y, s = 1, c = TEARC) => `<path d="M${f1(x)} ${f1(y - 14 * s)} Q${f1(x - 10 * s)} ${f1(y + 2 * s)} ${f1(x)} ${f1(y + 8 * s)} Q${f1(x + 10 * s)} ${f1(y + 2 * s)} ${f1(x)} ${f1(y - 14 * s)} Z" fill="${c}" stroke="${INK}" stroke-width="${f1(4 * s)}"/>`;
const zVein = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="#E5484D" stroke-width="7" stroke-linecap="round"><path d="M-22 -6 Q-8 -8 -6 -22"/><path d="M6 -22 Q8 -8 22 -6"/><path d="M22 6 Q8 8 6 22"/><path d="M-6 22 Q-8 8 -22 6"/></g>`;
const zSoftBrow = (y = 146) => ({ bL: [146, y + 2, 164, y - 4, 182, y + 1], bR: [218, y + 1, 236, y - 4, 254, y + 2] });
const zWorryBrow = { bL: [144, 152, 164, 140, 184, 136], bR: [216, 136, 236, 140, 256, 152] };
const zAngryBrow = { bL: [140, 144, 164, 154, 190, 170], bR: [210, 170, 236, 154, 260, 144] };
const zUpBrow = { bL: [142, 136, 164, 122, 186, 132], bR: [214, 132, 236, 122, 258, 136] };

Object.assign(E, {
  // ---- 기쁨 계열 ----
  'z기본': Object.assign(zEyes(12, 17), zSoftBrow(), { mouth: 'M188 230 Q200 241 212 230', mouthFill: 'none', fxEye: zHL2(), fxUnder: zBlush(0.35) }),
  'z반짝': Object.assign(zEyes(15, 20, 188), zUpBrow, { mouth: 'M182 226 Q200 254 218 226 Z', mouthFill: MO, fxUnder: zBlush(0.6),
    fxEye: zStar(169, 182, 10) + zStar(239, 182, 10) + `<circle cx="160" cy="197" r="3" fill="#fff"/><circle cx="230" cy="197" r="3" fill="#fff"/>`,
    fx: t => [[78, 92, 0], [326, 80, 1.3], [336, 196, 2.4]].map(([x, y, p]) => { const k = 0.6 + 0.4 * Math.abs(Math.sin(t * 4 + p)); return zStar(x, y, 16 * k, '#FFE34D', 3); }).join('') }),
  'z하트눈': Object.assign({ eyeL: zHeartP(165, 196, 0.62), eyeR: zHeartP(235, 196, 0.62), eyeFill: '#FF4D6D', eyeSW: 5 }, zUpBrow, { mouth: 'M180 226 Q200 252 220 226 Z', mouthFill: MO, fxUnder: zBlush(0.7),
    fxEye: `<circle cx="154" cy="180" r="4" fill="#fff"/><circle cx="224" cy="180" r="4" fill="#fff"/>`,
    fx: t => [0, 1].map(i => { const ph = (t * 0.7 + i * 0.5) % 1; return `<path d="${zHeartP(300 + i * 26 + Math.sin(ph * 6) * 6, 120 - ph * 90, 0.38)}" fill="#FF4D6D" stroke="${INK}" stroke-width="3" opacity="${f1((1 - ph) * 100) / 100}"/>`; }).join('') }),
  'z빵긋': Object.assign({ eyeL: 'M149 197 Q165 175 181 197', eyeR: 'M219 197 Q235 175 251 197', eyeFill: 'none', eyeSW: 11 }, zUpBrow, { mouth: 'M174 222 Q200 268 226 222 Z', mouthFill: MO, fxUnder: zBlush(0.75, 1.1),
    fx: `<path d="M186 240 Q200 254 214 240 Q200 232 186 240 Z" fill="${TONGUE}"/>` }),
  'z설렘': Object.assign(zEyes(13, 18), zUpBrow, { mouth: 'M188 231 Q194 238 200 231 Q206 238 212 231', mouthFill: 'none', fxUnder: zBlush(0.6),
    fxEye: zHL2(190, 1.1) + zStar(158, 196, 4) + zStar(228, 196, 4), fx: zBlushLines }),
  'z뿌듯': Object.assign({ eyeL: 'M150 194 Q165 180 180 194', eyeR: 'M220 194 Q235 180 250 194', eyeFill: 'none', eyeSW: 9 }, { bL: [142, 138, 164, 126, 186, 134], bR: [214, 134, 236, 126, 258, 138] },
    { mouth: 'M180 228 Q204 246 222 222', mouthFill: 'none', fxUnder: zBlush(0.45),
      fx: t => zStar(318, 108, 14 * (0.6 + 0.4 * Math.abs(Math.sin(t * 5))), '#FFE34D', 3) + zStar(340, 150, 8 * (0.6 + 0.4 * Math.abs(Math.sin(t * 5 + 1))), '#FFE34D', 2) }),
  // ---- 장난 계열 ----
  'z히죽': Object.assign({ eyeL: 'M151 186 Q165 180 179 186 Q179 201 165 201 Q151 201 151 186 Z', eyeR: 'M221 186 Q235 180 249 186 Q249 201 235 201 Q221 201 221 186 Z', eyeFill: EY, eyeSW: 0 },
    { bL: [146, 154, 164, 152, 182, 154], bR: [218, 142, 236, 128, 254, 136] }, { mouth: 'M180 230 Q190 243 200 231 Q210 243 220 230', mouthFill: 'none', fxEye: zHL(165, 192, 0.7) + zHL(235, 192, 0.7), fxUnder: zBlush(0.35) }),
  'z메롱': Object.assign({ eyeL: 'M165 190 Z', eyeR: ell(235, 190, 12, 17), eyeFill: EY, eyeSW: 0 }, zSoftBrow(), { mouth: 'M184 228 Q200 238 216 228', mouthFill: 'none', fxUnder: zBlush(0.5),
    fxEye: `<path d="M150 194 Q165 180 180 194" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/>` + zHL(235, 190), fx: `<path d="M190 233 Q189 262 202 262 Q215 262 212 233 Z" fill="${TONGUE}" stroke="${INK}" stroke-width="5"/><path d="M201 238 L201 252" stroke="#E46A82" stroke-width="3"/>` }),
  // ---- 당황 계열 ----
  'z당황': Object.assign({ eyeL: ell(165, 190, 7, 8), eyeR: ell(235, 190, 7, 8), eyeFill: INK, eyeSW: 0, whites: true }, zWorryBrow,
    { mouth: 'M176 238 Q182 230 188 238 Q194 246 200 238 Q206 230 212 238 Q218 246 224 238', mouthFill: 'none', sweat: true, fx: zBlushLines + zDrop(92, 120, 0.8) + zDrop(76, 154, 0.6) }),
  'z민망': Object.assign(zEyes(11, 16, 192, 9), { bL: [146, 150, 164, 144, 182, 150], bR: [218, 144, 236, 138, 254, 146] },
    { mouth: 'M186 234 Q194 240 200 234 Q206 228 214 234', mouthFill: 'none', sweat: true, fxEye: zHL2(192, 0.9, 9), fx: zBlushLines }),
  'z의심': Object.assign({ eyeL: 'M152 188 L178 188 Q178 201 165 201 Q152 201 152 188 Z', eyeR: ell(235, 190, 11, 15), eyeFill: EY, eyeSW: 0 },
    { bL: [146, 162, 164, 160, 184, 163], bR: [218, 140, 236, 126, 254, 134] }, { mouth: 'M186 238 L214 232', mouthFill: 'none', fxEye: zHL(235, 190, 0.9),
      fx: `<text x="306" y="96" font-family="${FONT}" font-weight="900" font-size="62" fill="#fff" stroke="${INK}" stroke-width="8" paint-order="stroke">?</text>` }),
  'z멍': Object.assign({ eyeL: ell(165, 190, 6, 6), eyeR: ell(235, 190, 6, 6), eyeFill: EY, eyeSW: 0 }, { bL: [148, 150, 164, 150, 182, 150], bR: [218, 150, 236, 150, 252, 150] },
    { mouth: ell(200, 240, 6, 7), mouthFill: MO, fx: t => [0, 1, 2].map(i => `<circle cx="${170 + i * 30}" cy="34" r="${f1(7 + 4 * Math.max(0, Math.sin(t * 5 - i * 0.8)))}" fill="#fff" stroke="${INK}" stroke-width="4"/>`).join('') }),
  // ---- 슬픔 계열 ----
  'z울먹': Object.assign(zEyes(14, 19), zWorryBrow, { mouth: 'M182 238 Q191 230 200 238 Q209 246 218 238', mouthFill: 'none', fxUnder: zBlush(0.5),
    fxEye: zHL2(188, 1.15) + `<path d="M153 199 Q165 207 177 199 M223 199 Q235 207 247 199" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/>`, fx: zDrop(184, 206, 0.6) }),
  'z엉엉': Object.assign({ eyeL: 'M148 184 Q165 200 182 184', eyeR: 'M218 184 Q235 200 252 184', eyeFill: 'none', eyeSW: 10 }, zWorryBrow,
    { mouth: 'M172 224 Q200 214 228 224 Q222 264 200 264 Q178 264 172 224 Z', mouthFill: MO,
      fx: t => { const o = f1((t * 120) % 40); return [[160, -1], [240, 1]].map(([x, s]) => `<path d="M${x} 196 Q${x + s * 26} 250 ${x + s * 10} 320" stroke="${TEARC}" stroke-width="16" fill="none" stroke-linecap="round" stroke-dasharray="26 14" stroke-dashoffset="${-o}" opacity=".9"/>`).join(''); } }),
  'z삐짐': Object.assign({ eyeL: 'M150 188 L180 194', eyeR: 'M220 194 L250 188', eyeFill: 'none', eyeSW: 9 }, { bL: [144, 158, 164, 150, 186, 156], bR: [214, 156, 236, 150, 256, 158] },
    { mouth: 'M190 238 Q200 230 210 238', mouthFill: 'none', fxUnder: `<circle cx="146" cy="214" r="26" fill="${BLUSH}" opacity=".75"/><circle cx="254" cy="214" r="26" fill="${BLUSH}" opacity=".75"/>`,
      fx: t => { const k = 0.6 + 0.4 * Math.abs(Math.sin(t * 3)); return `<g transform="translate(258 262) scale(${f1(k * 100) / 100})"><circle cx="0" cy="0" r="14" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="16" cy="-6" r="10" fill="#fff" stroke="${INK}" stroke-width="4"/></g>`; } }),
  // ---- 화·충격 계열 ----
  'z버럭': Object.assign({ eyeL: 'M150 182 L180 191 Q180 204 165 204 Q150 204 150 182 Z', eyeR: 'M250 182 L220 191 Q220 204 235 204 Q250 204 250 182 Z', eyeFill: EY, eyeSW: 0 }, zAngryBrow,
    { mouth: 'M176 226 L224 226 L218 254 L182 254 Z', mouthFill: '#fff',
      fx: t => `<path d="M178 240 L222 240 M192 227 L192 253 M208 227 L208 253" stroke="${INK}" stroke-width="3.5"/>` + zVein(288, 96, 1 + 0.12 * Math.abs(Math.sin(t * 8))) +
        [-1, 1].map(s => { const ph = (t * 1.5 + (s > 0 ? 0.5 : 0)) % 1; return `<circle cx="${f1(200 + s * (130 + ph * 40))}" cy="${f1(80 - ph * 60)}" r="${f1(14 + ph * 16)}" fill="#fff" stroke="${INK}" stroke-width="4" opacity="${f1((1 - ph) * 100) / 100}"/>`; }).join('') }),
  'z충격': Object.assign({ eyeL: ell(165, 192, 4, 5), eyeR: ell(235, 192, 4, 5), eyeFill: INK, eyeSW: 0, whites: true }, { bL: [140, 128, 164, 112, 186, 124], bR: [214, 124, 236, 112, 260, 128] },
    { mouth: ell(200, 244, 12, 20), mouthFill: MO, fx: zGloom + [[-1, 0], [1, 0]].map(([s]) => `<path d="M${200 + s * 136} 110 l${s * 26} -14 M${200 + s * 140} 150 l${s * 30} 0 M${200 + s * 136} 190 l${s * 26} 14" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`).join('') }),
  'z소름': Object.assign({ eyeL: ell(165, 190, 5, 6), eyeR: ell(235, 190, 5, 6), eyeFill: INK, eyeSW: 0, whites: true }, zWorryBrow,
    { mouth: 'M178 244 L186 236 L194 244 L202 236 L210 244 L218 236', mouthFill: 'none', fx: zGloom + `<path d="M76 120 l10 -8 l10 8 M66 170 l10 -8 l10 8 M304 120 l10 -8 l10 8 M314 170 l10 -8 l10 8" stroke="${INK}" stroke-width="4" fill="none"/>` }),
  'z멘붕': Object.assign({ eyeL: zSpiral(165, 190), eyeR: zSpiral(235, 190), eyeFill: 'none', eyeSW: 5 }, zWorryBrow,
    { mouth: 'M182 232 Q190 224 200 234 Q210 244 218 232 Q212 252 200 250 Q188 252 182 232 Z', mouthFill: MO,
      fx: t => zGloom + [0, 1, 2].map(i => { const a = t * 3 + i * 2.09; return zStar(200 + Math.cos(a) * 110, 36 + Math.sin(a) * 22, 13, '#FFE34D', 3); }).join('') }),
  'z기절': Object.assign({ eyeL: 'M152 178 L178 202 M178 178 L152 202', eyeR: 'M222 178 L248 202 M248 178 L222 202', eyeFill: 'none', eyeSW: 9 }, zWorryBrow,
    { mouth: 'M186 238 Q200 228 214 238', mouthFill: 'none', fx: `<path d="M206 236 Q206 254 214 254 Q222 254 220 236 Z" fill="${TONGUE}" stroke="${INK}" stroke-width="4"/>` }),
  // ---- 기타 ----
  'z결심': Object.assign(zEyes(12, 16), { bL: [140, 148, 164, 156, 188, 166], bR: [212, 166, 236, 156, 260, 148] }, { mouth: 'M182 232 Q200 242 218 228', mouthFill: 'none',
    fxEye: t => [165, 235].map(x => `<path d="M${x} ${f1(200 - 4 * Math.sin(t * 9))} Q${x - 9} 190 ${x - 2} 178 Q${x + 2} 188 ${x + 6} 184 Q${x + 9} 194 ${x} ${f1(200 - 4 * Math.sin(t * 9))} Z" fill="#FF8A3D"/>`).join('') + zHL2(190, 0.6) }),
  'z졸음': Object.assign({ eyeL: 'M152 194 Q165 200 178 194', eyeR: 'M222 194 Q235 200 248 194', eyeFill: 'none', eyeSW: 8 }, { bL: [146, 160, 164, 158, 182, 160], bR: [218, 160, 236, 158, 254, 160] },
    { mouth: ell(200, 240, 8, 6), mouthFill: MO, fxUnder: zBlush(0.35),
      fx: t => { const r = 6 + 16 * (0.5 + 0.5 * Math.sin(t * 2.2)); return `<circle cx="${f1(224 + r * 0.6)}" cy="226" r="${f1(r)}" fill="#CFEFFF" fill-opacity=".8" stroke="${INK}" stroke-width="4"/><circle cx="${f1(220 + r * 0.6)}" cy="${f1(222 - r * 0.3)}" r="${f1(r * 0.25)}" fill="#fff"/>`; } }),
  'z하품': Object.assign({ eyeL: 'M150 182 L176 190 L150 198', eyeR: 'M250 182 L224 190 L250 198', eyeFill: 'none', eyeSW: 8 }, zUpBrow,
    { mouth: ell(200, 246, 22, 28), mouthFill: MO, fx: `<ellipse cx="200" cy="262" rx="12" ry="8" fill="${TONGUE}"/>` + zDrop(142, 206, 0.5) }),
});
// 눈 깜빡임에 쓰는 '반쯤 감은 눈' 사이 단계: 큰 눈 표정에서 자연스러운 깜빡임은 엔진의 blink가 처리한다.
const Z_EXPR = ['z기본', 'z반짝', 'z하트눈', 'z빵긋', 'z설렘', 'z뿌듯', 'z히죽', 'z메롱', 'z당황', 'z민망', 'z의심', 'z멍', 'z울먹', 'z엉엉', 'z삐짐', 'z버럭', 'z충격', 'z소름', 'z멘붕', 'z기절', 'z결심', 'z졸음', 'z하품'];
