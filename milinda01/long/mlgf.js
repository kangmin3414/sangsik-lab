/* 불교 편(수레 문답·무아) — 대본 milinda01/대본_v1.md, 화면 milinda01/화면연출_v1.md. 새 이름은 모두 ml 접두사.
   게임 감각 층(zw/gf.js) + 몰입 층(zw/gfx.js). 모든 장면은 화면 좌표(gfxScreen) 안에서 자체 카메라(gfxCam)로 그린다. 사건 시각은 절대 시각(mlAt). */
window.GFR = { boil: false, vig: false, flash: false, study: false, sub: t => mlSub(t), over: t => mlOver(t) };
['mlnight', 'mltitle', 'mloffice', 'mlsagala', 'mlsheet'].forEach(k => CAMS[k] = 'fixed');
GF.names = Object.assign({}, GF.names, { Z: ['제로', '#FF9A55'], B: ['팀장', '#6B7388'], T: ['딱지', '#22B893'], K: ['밀린다 왕', '#7A3B8C'], M: ['나가세나', '#D9822B'], S: ['서윤', '#FF7EB6'] });
const mlL = id => TL.lines.find(l => l.id === id);
// 줄 id의 낱말 key가 시작되는 절대 시각. 못 찾으면 줄 길이의 fb 비율(0~1) 자리.
const mlAt = (id, key, fb = 0.5, n = 0) => { const l = mlL(id); if (!l) return 1e9; if (key) { const k = key.replace(/\s/g, ''), m = (l.words || []).filter(x => x.w.replace(/\s/g, '').includes(k)); if (m[n]) return l.t0 + m[n].t + 0.05; } return l.t0 + fb * (l.t1 - l.t0); };
const mlT0 = id => { const l = mlL(id); return l ? l.t0 : 1e9; }, mlT1 = id => { const l = mlL(id); return l ? l.t1 : 1e9; };
const mlS = (t, t0, d = 0.8) => easeInOut(gfK(t0, t0 + d, t));
const mlOp = (k, inner) => k <= 0.004 ? '' : (k >= 0.996 ? inner : `<g opacity="${f1(k * 1000) / 1000}">${inner}</g>`);
const mlAtP = (x, y, s, inner, r = 0) => `<g transform="translate(${f1(x)} ${f1(y)})${r ? ` rotate(${f1(r)})` : ''} scale(${f1(s * 1000) / 1000})">${inner}</g>`;

/* ---------- 인물 ---------- */
Object.assign(E, {
  // 스님: 눈웃음(감은 눈) + 부드러운 눈썹
  'ml스님': { eyeL: 'M150 192 Q165 180 180 192', eyeR: 'M220 192 Q235 180 250 192', eyeFill: 'none', eyeSW: 9, bL: [146, 150, 164, 142, 182, 146], bR: [218, 146, 236, 142, 254, 150], mouth: 'M186 230 Q200 242 214 230', mouthFill: 'none', fxUnder: zBlush(0.3) },
  'ml스님뜬': Object.assign(zEyes(10, 13), { bL: [146, 150, 164, 142, 182, 146], bR: [218, 146, 236, 142, 254, 150] }, { mouth: 'M186 231 Q200 241 214 231', mouthFill: 'none', fxEye: zHL2(190, 0.8), fxUnder: zBlush(0.3) }),
  // 왕: 당당한 눈썹, 따질 때 한쪽 눈썹
  'ml왕': Object.assign(zEyes(11, 14), { bL: [142, 146, 164, 150, 186, 158], bR: [214, 158, 236, 150, 258, 146] }, { mouth: 'M188 236 Q200 232 212 236', mouthFill: 'none', fxEye: zHL2(190, 0.8) }),
  'ml왕의심': Object.assign(zEyes(11, 13), { bL: [142, 158, 164, 158, 186, 162], bR: [214, 148, 236, 130, 258, 138] }, { mouth: 'M186 238 L214 233', mouthFill: 'none', fxEye: zHL2(190, 0.8) }),
  'ml왕깨달': Object.assign(zEyes(13, 17), zUpBrow, { mouth: 'M186 232 Q200 242 214 232', mouthFill: 'none', fxEye: zHL2(189, 1) }),
  // 팀장: 표정이 적다
  'ml팀장': Object.assign(zEyes(10, 12), { bL: [144, 152, 164, 150, 184, 152], bR: [216, 152, 236, 150, 256, 152] }, { mouth: 'M190 236 L210 236', mouthFill: 'none', fxEye: zHL2(190, 0.7) }),
  // 제로: 멍함(점 없는 버전), 쓴웃음
  'ml멍': Object.assign({ eyeL: ell(165, 190, 6, 6), eyeR: ell(235, 190, 6, 6), eyeFill: EY, eyeSW: 0 }, { bL: [148, 148, 164, 148, 182, 148], bR: [218, 148, 236, 148, 252, 148] }, { mouth: 'M192 238 L208 238', mouthFill: 'none' }),
  'ml쓴웃음': Object.assign(zEyes(11, 13, 192), { bL: [146, 150, 164, 144, 182, 150], bR: [218, 144, 236, 138, 254, 146] }, { mouth: 'M184 234 Q196 242 206 234 Q212 229 216 232', mouthFill: 'none', sweat: true, fxEye: zHL2(192, 0.85) }),
});
const ML_SUIT = { vest: '#3D4F7A', vshade: 'rgba(0,0,0,0.2)', suit: true, collar: true, tie: '#E0574F', lanyard: true };
const mlZ = (o, suit) => Z(Object.assign({}, suit ? ML_SUIT : {}, o));                                                        // 제로: 집에서는 주황 티, 회사·옛이야기에서는 재킷 + 사원증
const mlB = o => HALO(char(Object.assign({ goggles: 'none', vest: '#7C8494', patch: false, tee: true, vshade: 'rgba(0,0,0,0.2)', hair: '#2B2B2B', suit: true, collar: true, tie: '#2F3E66' }, o)));   // 팀장
// 왕: 자주색 옷 + 크림색 망토(금색 줄), 짧은 곱슬머리에 흰 머리띠(끝이 옆으로 날림). 수염 없음(전해지는 동전의 젊은 왕 모습)
const ML_KHAIR = t => `<path d="M88 150 Q80 56 200 48 Q320 56 312 150 Q304 120 286 128 Q282 102 258 112 Q246 88 222 104 Q200 84 178 104 Q154 88 142 112 Q118 102 114 128 Q96 120 88 150 Z" fill="#3B2A20" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
  `<path d="M92 124 Q200 86 308 124" fill="none" stroke="${INK}" stroke-width="19" stroke-linecap="round"/><path d="M92 124 Q200 86 308 124" fill="none" stroke="#FBF7EA" stroke-width="11" stroke-linecap="round"/>` +
  `<g transform="rotate(${f1(Math.sin(t * 2.2) * 5)} 310 126)"><path d="M306 122 Q336 146 330 188 M310 128 Q348 138 354 178" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M306 122 Q336 146 330 188 M310 128 Q348 138 354 178" fill="none" stroke="#FBF7EA" stroke-width="7" stroke-linecap="round"/></g>`;
const mlK = o => HALO(char(Object.assign({ goggles: 'none', vest: '#7A3B8C', patch: false, tee: true, vshade: 'rgba(30,0,40,0.25)', toga: '#F4E8C8', togaStripe: '#F2B63C', hairFront: ML_KHAIR, dress: '#7A3B8C', browW: 15 }, o)));
// 스님: 삭발, 황토색 가사(긴 자락 + 한쪽 어깨에 걸친 천)
const mlM = o => HALO(char(Object.assign({ goggles: 'none', vest: '#E79A3C', patch: false, tee: true, vshade: 'rgba(120,50,0,0.22)', toga: '#C96F1E', dress: '#E79A3C', shade: '#EFD9C2' }, o)));

/* ---------- 딱지(속 캐릭터): 라벨 프린터 요정 ----------
   발 가운데가 (x, y). s = 1이면 키 약 150. o = { t, look: [x, y], ex: 'on'(기본) | 'proud' | 'shock' | 'sleep', talk: 0~1(입 벌림), out: 0~1(입에서 스티커가 나온 정도), label(나오는 스티커 SVG), sx, sy, rot, arm: 'up' | 'throw' | 'down' } */
function mlTak(x, y, s, o = {}) {
  const t = o.t || 0, lk = o.look || [0, 0], ex = o.ex || 'on', bl = naturalBlink(t, 31), bob = Math.sin(t * 3.1) * 2.5, C = '#3DDBB4', C2 = '#22B893';
  const armA = o.arm === 'up' ? -62 : o.arm === 'throw' ? -18 : 58, sw = Math.sin(t * 6) * (o.arm === 'up' ? 6 : 3);
  const arm = (sd) => { const a = (sd > 0 ? armA : 180 - armA) + sd * sw, r = a * Math.PI / 180, x0 = sd * 60, y0 = -70, x1 = x0 + Math.cos(r) * 34, y1 = y0 + Math.sin(r) * 34; return `<path d="M${x0} ${y0} L${f1(x1)} ${f1(y1)}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><circle cx="${f1(x1)}" cy="${f1(y1)}" r="11" fill="#fff" stroke="${INK}" stroke-width="6"/>`; };
  let h = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${f1(s * (o.sx || 1) * 1000) / 1000} ${f1(s * (o.sy || 1) * 1000) / 1000})">`;
  h += `<path d="M-24 -22 L-28 -4 M24 -22 L28 -4" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><ellipse cx="-32" cy="-2" rx="17" ry="9" fill="#fff" stroke="${INK}" stroke-width="6"/><ellipse cx="32" cy="-2" rx="17" ry="9" fill="#fff" stroke="${INK}" stroke-width="6"/>`;
  h += `<g transform="translate(0 ${f1(bob)})">` + arm(-1) + arm(1);
  h += `<path d="M-10 -138 Q-14 -160 4 -166" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle cx="6" cy="-168" r="9" fill="#FFD84A" stroke="${INK}" stroke-width="5"/>`;
  h += `<rect x="-62" y="-136" width="124" height="116" rx="30" fill="${C}" stroke="${INK}" stroke-width="8"/><path d="M-58 -52 L58 -52 L58 -50 Q58 -24 32 -24 L-32 -24 Q-58 -24 -58 -50 Z" fill="${C2}"/><rect x="-46" y="-126" width="40" height="12" rx="6" fill="#fff" opacity=".45"/>`;
  // 눈
  const ey = -92, ex0 = lk[0] * 5, ey0 = lk[1] * 4;
  if (ex === 'sleep') h += `<path d="M-38 ${ey} Q-26 ${ey + 8} -14 ${ey} M14 ${ey} Q26 ${ey + 8} 38 ${ey}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  else if (ex === 'proud') h += `<path d="M-38 ${ey + 3} Q-26 ${ey - 10} -14 ${ey + 3} M14 ${ey + 3} Q26 ${ey - 10} 38 ${ey + 3}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`;
  else { const r = ex === 'shock' ? 17 : 15, pr = ex === 'shock' ? 4.5 : 8, sc = f1((1 - 0.9 * bl) * 100) / 100;
    h += `<g transform="translate(0 ${ey}) scale(1 ${sc}) translate(0 ${-ey})"><circle cx="-26" cy="${ey}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="26" cy="${ey}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="${f1(-26 + ex0)}" cy="${f1(ey + ey0)}" r="${pr}" fill="${INK}"/><circle cx="${f1(26 + ex0)}" cy="${f1(ey + ey0)}" r="${pr}" fill="${INK}"/>` + (ex === 'shock' ? '' : `<circle cx="${f1(-23 + ex0)}" cy="${f1(ey - 3 + ey0)}" r="2.6" fill="#fff"/><circle cx="${f1(29 + ex0)}" cy="${f1(ey - 3 + ey0)}" r="2.6" fill="#fff"/>`) + `</g>`; }
  h += `<ellipse cx="-46" cy="-70" rx="9" ry="5" fill="#FF9BB0" opacity=".7"/><ellipse cx="46" cy="-70" rx="9" ry="5" fill="#FF9BB0" opacity=".7"/>`;
  // 입(인쇄구): 말하면 벌어지고, 스티커가 여기서 나온다
  const mo = clamp((o.talk || 0) * 0.9 + (o.out > 0 && o.out < 1 ? 0.5 : 0) + (ex === 'shock' ? 0.9 : 0), 0, 1), mh = 7 + 15 * mo;
  h += `<rect x="-34" y="${f1(-58 - mh / 2 + 4)}" width="68" height="${f1(mh)}" rx="${f1(Math.min(7, mh / 2))}" fill="#1E2A4A" stroke="${INK}" stroke-width="5"/>`;
  if (o.label && o.out > 0) h += `<g clip-path="url(#mlTakClip)"><g transform="translate(0 ${f1(-54 + (o.outLen || 60) * (o.out - 1) + (o.outLen || 60) / 2)}) scale(${o.ls || 0.5})">${o.label}</g></g>`;
  return h + `</g></g>`;
}
const ML_TAK_CLIP = `<clipPath id="mlTakClip"><rect x="-200" y="-54" width="400" height="300"/></clipPath>`;
// 스티커(이 편의 모양): 크림색 + 빨간 띠
const mlSt = (text, fs = 30, o = {}) => gfxSticker(text, Object.assign({ fs, band: '#FF5A5A' }, o));

/* ---------- 자세 ---------- */
const mlPose = o => Object.assign({}, P['서기'], o);
P['ml폰'] = mlPose({ armL: [[148, 285], [134, 346], [176, 366]], hL: [184, 368], armR: [[252, 285], [266, 346], [224, 366]], hR: [216, 368] });            // 두 손으로 폰(가슴 앞)
P['ml앉음'] = mlPose({ armL: [[148, 285], [124, 338], [150, 370]], hL: [158, 374], armR: [[252, 285], [276, 338], [250, 370]], hR: [242, 374] });          // 탁자에 두 손
P['ml내밂R'] = mlPose({ armL: [[148, 285], [124, 338], [150, 370]], hL: [158, 374], armR: [[252, 285], [300, 330], [348, 356]], hR: [358, 360] });        // 오른손(화면 오른쪽)을 탁자 위로 뻗음
P['ml내밂L'] = mlPose({ armR: [[252, 285], [276, 338], [250, 370]], hR: [242, 374], armL: [[148, 285], [100, 330], [52, 356]], hL: [42, 360] });          // 왼손(화면 왼쪽)을 탁자 위로 뻗음
P['ml손사래'] = mlPose({ armL: [[148, 285], [124, 338], [150, 370]], hL: [158, 374], armR: [[252, 285], [300, 322], [306, 256]], hR: [308, 244] });       // 오른손을 얼굴 옆으로
P['ml가리킴R'] = mlPose({ armR: [[252, 285], [304, 296], [354, 286]], hR: [364, 284] });
P['ml가리킴L'] = mlPose({ armL: [[148, 285], [96, 296], [46, 286]], hL: [36, 284] });
P['ml으쓱'] = mlPose({ armL: [[148, 285], [104, 322], [74, 288]], hL: [68, 278], armR: [[252, 285], [296, 322], [326, 288]], hR: [332, 278] });
P['ml가슴손'] = mlPose({ armR: [[252, 285], [270, 344], [222, 334]], hR: [212, 330] });                                                                    // 오른손을 가슴에
P['ml고삐'] = mlPose({ armL: [[148, 285], [146, 342], [196, 356]], hL: [204, 358], armR: [[252, 285], [272, 338], [306, 340]], hR: [314, 340] });        // 두 손을 앞으로(고삐)
P['ml엄지뒤'] = mlPose({ armL: [[148, 285], [102, 268], [70, 236]], hL: [64, 226] });                                                                      // 왼손 엄지로 뒤(화면 왼쪽)를 가리킴
P['ml받침'] = mlPose({ armR: [[252, 285], [290, 350], [298, 408]], hR: [298, 420] });                                                                    // 오른손(화면 오른쪽)을 허리 높이로 내밀어 받침(딱지가 올라선다)
P['ml무릎'] = mlPose({ armL: [[148, 285], [130, 346], [160, 404]], hL: [166, 412], armR: [[252, 285], [270, 346], [240, 404]], hR: [234, 412] });           // 두 손을 무릎에(이불 속)
const mlCur = t => { let c = null; for (const l of TL.lines) if (t >= l.t0 - 0.15) c = l; return c; };

/* ---------- 스티커 던지기 ----------
   스티커 하나의 일생: 인쇄(딱지 입에서 나옴) → 던짐(호를 그리며 돈다) → 탁(눌렸다 출렁) → (off가 있으면) 떨어져 팔랑팔랑.
   ev = { t0: 붙는 시각, from: [x, y] 딱지 입, to: [x, y] 또는 t => [x, y], text, fs, s: 붙었을 때 크기, rot, arc, off: 떨어지는 시각, peel: t => 0~1 귀퉁이 들뜸, so: 스티커 옵션 } */
function mlThrow(t, ev) {
  const fly = ev.fly || 0.26, pr = ev.print || 0.5, tT = ev.t0 - fly, tP = tT - pr, S = ev.s || 1, to = typeof ev.to === 'function' ? ev.to(t) : ev.to;
  if (t < (ev.tp != null ? ev.tp : tP)) return null;                                   // ev.tp ~ ev.te: 말하는 동안 입에서 조금씩 나온다(대사 줄). 없으면 던지기 직전에 빠르게 인쇄
  const st = pk => mlSt(ev.text, ev.fs || 30, Object.assign({}, ev.so, pk ? { peel: pk } : {}));
  if (t < tT) return { out: ev.tp != null ? clamp((t - ev.tp) / Math.max(0.2, ev.te - ev.tp), 0, 1) : clamp((t - tP) / (pr * 0.72), 0, 1), print: st(0), svg: '', arm: t > tT - 0.16 ? 'up' : 'down' };
  if (t < ev.t0) { const k = (t - tT) / fly, x = lerp(ev.from[0], to[0], k), y = lerp(ev.from[1], to[1], k) - Math.sin(Math.PI * k) * (ev.arc == null ? 130 : ev.arc); return { out: 0, svg: mlAtP(x, y, lerp(ev.s0 || 0.45, S * 1.3, easeIn(k)), st(0), lerp(-260, ev.rot == null ? -4 : ev.rot, k)), arm: 'throw' }; }
  if (ev.off != null && t > ev.off) { const u = t - ev.off; if (u > 1.6) return { out: 0, svg: '', arm: 'down' };
    return { out: 0, svg: mlOp(1 - gfK(1.1, 1.6, u), mlAtP(to[0] + Math.sin(u * 7) * 36 * Math.min(1, u * 2) + (ev.offDx || 0) * u, to[1] + 40 * u + 240 * u * u, S, st(0.6), (ev.rot || -4) + Math.sin(u * 7 + 1) * 28 + u * 40)), arm: 'down' }; }
  const j = actHit(t, ev.t0, 0.22, 5.2, 9), u = t - ev.t0; return { out: 0, svg: mlAtP(to[0], to[1], S * j.sy, st(ev.peel ? ev.peel(t) : 0), (ev.rot == null ? -4 : ev.rot) + 2 * Math.exp(-7 * u) * Math.sin(u * 30)), stuck: true, arm: 'down' };
}
// 스티커 여러 장 → { svg: 날아가는 것 + 붙은 것, tak: 딱지에게 줄 { out, label, arm }, fx: 탁 효과(세계 좌표), hits: 탁 시각들 }
function mlStickers(t, evs) {
  let svg = '', fx = '', tak = { out: 0, arm: 'down' }; const hits = [];
  for (const ev of evs) { hits.push(ev.t0); const r = mlThrow(t, ev); if (!r) continue; svg += r.svg; if (r.print) tak = { out: r.out, label: r.print, arm: r.arm, outLen: 56 + 16 * (Array.isArray(ev.text) ? ev.text.length : 1) }; else if (r.arm !== 'down') tak.arm = r.arm;
    const to = typeof ev.to === 'function' ? ev.to(t) : ev.to; fx += gfxImpact(t, ev.t0, to[0], to[1], { flash: false, r: 110 * (ev.s || 1), n: 10 }) + gfStarBurst(t, ev.t0, to[0], to[1], { n: 5, r0: 30, r1: 120 * (ev.s || 1), size: 14 }); }
  return { svg, fx, tak, hits };
}

/* ---------- 장면 틀: 층 쌓기 ----------
   L = { cam, defs, far: [[depth, svg, {blur}], …](빛을 받지 않는 배경), cast(그림자), lit(빛 받는 인물·소품), light: 조명 id, glow(빛 번짐·효과: 세계 좌표), fg(카메라 앞 층), grade, vig, hud(화면 좌표) } */
function mlCompose(L) {
  const c = L.cam; let s = '';
  for (const [d, g, o] of L.far || []) s += gfxLayer(c, d, g, o || {});
  if (L.cast) s += gfxCast(L.cast[0], Object.assign({ cam: c }, L.cast[1]));
  s += L.light ? gfxLit(L.light, gfxLayer(c, 1, L.lit)) : gfxLayer(c, 1, L.lit);
  if (L.glow) s += gfxLayer(c, 1, L.glow);
  if (L.fg) s += gfxLayer(c, L.fgDepth || 1.35, L.fg, { blur: L.fgBlur == null ? 7 : L.fgBlur });
  if (L.whip) s = `<g filter="url(#gfxMx)">${s}</g>`;                                 // 빠른 카메라 이동: 가로 번짐
  return gfxScreen(L.defs + s + (L.grade || '') + (L.vig == null ? gfxVignette(0.4) : L.vig) + (L.hud || ''));
}
const ML_DEFS = `<defs>${ML_TAK_CLIP}<clipPath id="mlPc"><circle cx="0" cy="-395" r="166"/></clipPath>
<linearGradient id="mlNSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16225A"/><stop offset="1" stop-color="#3A4E96"/></linearGradient>
<linearGradient id="mlNWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1C2550"/><stop offset="1" stop-color="#26336A"/></linearGradient>
<linearGradient id="mlOWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DCE8F2"/><stop offset="1" stop-color="#C9D9E8"/></linearGradient>
<linearGradient id="mlOSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FD6FF"/><stop offset="1" stop-color="#FFF4D6"/></linearGradient>
<linearGradient id="mlSSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3A65E"/><stop offset=".55" stop-color="#FFD08A"/><stop offset="1" stop-color="#FFEBC0"/></linearGradient>
<linearGradient id="mlSGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9C58A"/><stop offset="1" stop-color="#D2A869"/></linearGradient>
<linearGradient id="mlPhoneBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBFCFF"/><stop offset="1" stop-color="#EEF2FA"/></linearGradient>
</defs>`;

/* ---------- [훅] 일요일 밤 11시, 제로의 방 ---------- */
const ML_N = { ZX: 1100, ZY: 936, S: 1.0, FY: 946 };
// 제로 시점 폰(화면 좌표). 글자는 저절로 써지고, 보내기 단추는 눌림 표시만. 손가락이 화면을 누르지 않는다.
function mlPhonePOV(t) {
  const n1 = mlL('n1'), n3 = mlL('n3'), q = '나는 어떤 사람이야?', kT = gfK(n1.t0 + 0.05, n1.t1 - 0.25, t), nch = Math.round(kT * q.length), tSend = n1.t1 + 0.12, sent = t >= tSend;
  const z = 1 + 0.035 * gfK(n1.t0, n1.t1 + 1, t) + (t >= n3.t0 - 0.2 ? 0.02 : 0), dx = Math.sin(t * 0.5) * 5, dy = Math.sin(t * 0.37 + 1) * 4;
  let s = `<rect x="-60" y="-60" width="2040" height="1200" fill="#0F1530"/>` + gfxGlow(260, 240, 420, '#4A62C0', 0.5, { blend: false }) + gfxGlow(1700, 880, 520, '#2A3A80', 0.5, { blend: false });
  let p = `<rect x="602" y="34" width="716" height="1160" rx="78" fill="#1A2034" stroke="${INK}" stroke-width="12"/><rect x="630" y="62" width="660" height="1110" rx="54" fill="url(#mlPhoneBg)"/>`;
  p += gfT(686, 124, '11:00', 30, '#2B3350', { anchor: 'start', wt: 800 }) + `<rect x="1196" y="100" width="52" height="26" rx="7" fill="none" stroke="#2B3350" stroke-width="4"/><rect x="1201" y="105" width="30" height="16" rx="3" fill="#2B3350"/><rect x="1250" y="108" width="5" height="10" rx="2" fill="#2B3350"/>`;
  p += `<rect x="630" y="150" width="660" height="92" fill="#fff"/><path d="M630 242 H1290" stroke="#DCE2EE" stroke-width="3"/><circle cx="700" cy="196" r="30" fill="#6C8CFF" stroke="${INK}" stroke-width="5"/><g transform="translate(700 196) scale(.62)">${gfStar4(26, '#fff', 0)}</g>` + gfT(750, 210, 'AI', 40, '#1E2A4A', { anchor: 'start' });
  // 보낸 말풍선
  if (sent) { const k = gfIn(t, tSend, 3.6, 0.5), w = gfTextW(q, 36, 800) + 64; p += `<g transform="translate(${f1(1250 - w / 2)} ${f1(318 + (1 - Math.min(1, k)) * 40)}) scale(${f1(Math.min(1.06, k) * 1000) / 1000})"><rect x="${f1(-w / 2)}" y="-42" width="${f1(w)}" height="84" rx="38" fill="#FF9A55" stroke="${INK}" stroke-width="5"/>${gfT(0, 13, q, 36, '#fff', { wt: 800 })}</g>`; }
  // 답: 점 셋 → 칩 세 개
  if (t >= n3.t0 - 0.9) { const tA = [mlAt('n3', '신중', 0.05), mlAt('n3', '내향', 0.38), mlAt('n3', '무대', 0.66)], items = [['신중함', '#DDF7EE', 'check'], ['내향적', '#E3EAFF', 'moon'], ['무대에는 약한 편', '#FFE6EE', 'rain']];
    const kc = gfIn(t, n3.t0 - 0.9, 3.4, 0.55), ch = 96 + 3 * 104; p += `<g transform="translate(672 ${f1(400)})"><rect x="0" y="0" width="${f1(480 * Math.min(1, kc))}" height="${f1(t < tA[0] ? 96 : lerp(96, ch, mlS(t, tA[0] - 0.1, 0.3)))}" rx="34" fill="#fff" stroke="${INK}" stroke-width="5"/>`;
    if (t < tA[0]) p += [0, 1, 2].map(i => `<circle cx="${70 + i * 44}" cy="${f1(48 - 9 * Math.max(0, Math.sin((t - n3.t0) * 9 - i * 0.9)))}" r="11" fill="#8E9BB8"/>`).join('');
    items.forEach(([tx, bg, ic], i) => { if (t < tA[i]) return; const k = gfIn(t, tA[i], 3.4, 0.42); p += `<g transform="translate(${f1(30 + (gfTextW(tx, 38) + 106) / 2)} ${f1(74 + i * 104)}) scale(${f1(k * 1000) / 1000})">${gfChip(tx, { size: 38, bg, icon: ic })}</g>`; });
    p += `</g>`; }
  // 입력칸 + 보내기(자막 자리 위에 둔다) + 자판(글쇠는 눌리지 않는다)
  const IY = 742, txt = sent ? '' : q.slice(0, nch), car = !sent && (Math.floor(t * 2.4) % 2 === 0 || kT < 1) ? `<rect x="${f1(712 + gfTextW(txt, 36, 700) + 4)}" y="${IY + 30}" width="4" height="44" fill="#FF9A55"/>` : '';
  p += `<rect x="630" y="${IY}" width="660" height="440" fill="#fff"/><path d="M630 ${IY} H1290" stroke="#DCE2EE" stroke-width="3"/><rect x="666" y="${IY + 16}" width="486" height="74" rx="37" fill="#F3F5FA" stroke="#C9D2E3" stroke-width="4"/>` + (txt ? gfT(712, IY + 66, txt, 36, '#1E2A4A', { anchor: 'start', wt: 700 }) : (sent ? gfT(712, IY + 66, '무엇이든 물어보세요', 32, '#A9B3C8', { anchor: 'start', wt: 600 }) : '')) + car;
  const prs = gfK(tSend - 0.1, tSend, t) * (1 - gfK(tSend + 0.1, tSend + 0.3, t)); p += `<g transform="translate(1214 ${IY + 53}) scale(${f1((1 - 0.14 * prs) * 1000) / 1000})"><circle r="40" fill="${prs > 0.3 ? '#E07A35' : (nch > 0 && !sent ? '#FF9A55' : '#C9D2E3')}" stroke="${INK}" stroke-width="5"/><path d="M-12 8 L0 -12 L12 8 M0 -12 V18" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>` + gfRing(t, tSend, 1214, IY + 53, 30, 90, '#FF9A55', 9, 0.35);
  p += `<rect x="630" y="${IY + 108}" width="660" height="340" fill="#E4E8F1"/>` + [0, 1, 2, 3].map(r => { const n = r === 3 ? 5 : 10 - (r === 2 ? 1 : 0), w = r === 3 ? 0 : 56, x0 = 960 - (n * 62 - 6) / 2; return r === 3 ? `<rect x="800" y="${IY + 126 + r * 74}" width="320" height="60" rx="12" fill="#fff" stroke="#C3CAD9" stroke-width="3"/>` : Array.from({ length: n }, (_, i) => `<rect x="${f1(x0 + i * 62)}" y="${IY + 126 + r * 74}" width="${w}" height="60" rx="12" fill="#fff" stroke="#C3CAD9" stroke-width="3"/>`).join(''); }).join('');
  // 두 손(폰 옆을 잡고 있다)
  const hand = sd => { const hx = 960 + sd * 398, hy = 640; return `<path d="M${hx + sd * 260} 1200 Q${hx + sd * 150} 1010 ${hx + sd * 30} ${hy + 40}" fill="none" stroke="${INK}" stroke-width="44" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="120" fill="#fff" stroke="${INK}" stroke-width="12"/><path d="M${hx - sd * 80} ${hy - 62} Q${hx - sd * 124} ${hy - 10} ${hx - sd * 84} ${hy + 50}" fill="none" stroke="#C9D6E2" stroke-width="10" stroke-linecap="round"/><rect x="${sd > 0 ? hx - 150 : hx + 56}" y="${hy - 110}" width="94" height="52" rx="26" fill="#fff" stroke="${INK}" stroke-width="10"/>`; };
  s += `<g transform="translate(${f1(960 + dx)} ${f1(600 + dy)}) scale(${f1(z * 1000) / 1000}) translate(-960 -600)">` + gfxGlow(960, 560, 980, '#CFE2FF', 0.28) + p + hand(-1) + hand(1) + `</g>`;
  return gfxScreen(ML_DEFS + s + gfxGrade('night', 0.25) + gfxVignette(0.55));
}
function mlNightSet(t) {
  const { ZX, FY } = ML_N, sw = Math.sin(t * 0.7) * 3;
  let wall = `<rect x="-300" y="-300" width="2520" height="1700" fill="url(#mlNWall)"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${-200 + i * 330} -200 V${FY}" stroke="#2A3872" stroke-width="5" opacity=".5"/>`).join('') + `<rect x="-300" y="${FY}" width="2520" height="600" fill="#131A3C"/><rect x="-300" y="${FY - 16}" width="2520" height="20" fill="#2F3D7A"/>`;
  // 창(달): 빛을 내는 것이라 조명 필터 밖에 둔다
  wall += `<rect x="156" y="140" width="368" height="436" rx="22" fill="#101838" stroke="#0B1030" stroke-width="12"/><rect x="176" y="160" width="328" height="396" rx="10" fill="url(#mlNSky)"/>` + gfTwinkle(t, 236, 230, 9, 1, '#FFF3B8') + gfTwinkle(t, 450, 420, 8, 3, '#fff') + gfTwinkle(t, 280, 470, 7, 5, '#FFF3B8') +
    `<circle cx="402" cy="282" r="50" fill="#FFF3C4"/><circle cx="386" cy="270" r="9" fill="#F2E3A6"/><circle cx="420" cy="300" r="6" fill="#F2E3A6"/><path d="M340 160 V556 M176 358 H504" stroke="#0B1030" stroke-width="10"/>` +
    `<path d="M146 130 Q${f1(196 + sw)} 330 ${f1(170 + sw)} 590 L120 590 L120 130 Z" fill="#33407C" stroke="#0B1030" stroke-width="7"/><path d="M534 130 Q${f1(486 - sw)} 330 ${f1(510 - sw)} 590 L560 590 L560 130 Z" fill="#33407C" stroke="#0B1030" stroke-width="7"/><rect x="100" y="112" width="480" height="26" rx="13" fill="#3F4E92" stroke="#0B1030" stroke-width="7"/>`;
  // 벽시계 11시, 작은 액자(무대 위 세 사람 실루엣 — 뒤에 나올 10년 전 사진의 씨앗)
  wall += `<g opacity=".95"><circle cx="1600" cy="250" r="66" fill="#D9E2F5" stroke="#0B1030" stroke-width="9"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<line x1="1600" y1="194" x2="1600" y2="${i % 3 ? 200 : 206}" stroke="#0B1030" stroke-width="${i % 3 ? 3 : 5}" transform="rotate(${i * 30} 1600 250)"/>`).join('') + `<line x1="1600" y1="250" x2="1600" y2="216" stroke="#0B1030" stroke-width="8" stroke-linecap="round" transform="rotate(-30 1600 250)"/><line x1="1600" y1="250" x2="1600" y2="202" stroke="#E5484D" stroke-width="6" stroke-linecap="round"/><line x1="1600" y1="250" x2="1600" y2="198" stroke="#0B1030" stroke-width="2.5" transform="rotate(${Math.floor(t) * 6} 1600 250)"/><circle cx="1600" cy="250" r="6" fill="#0B1030"/></g>`;
  wall += `<g transform="rotate(-3 1290 300)"><rect x="1210" y="244" width="160" height="116" rx="8" fill="#E9E2D0" stroke="#0B1030" stroke-width="8"/><rect x="1224" y="258" width="132" height="88" fill="#3B2F5C"/><path d="M1224 330 H1356 V346 H1224 Z" fill="#231B3C"/>` + [[1256, 0], [1290, 1], [1324, 2]].map(([x, i]) => `<circle cx="${x}" cy="${306 - (i === 1 ? 6 : 0)}" r="9" fill="#F4EAD0"/><path d="M${x} ${316 - (i === 1 ? 6 : 0)} V332" stroke="#F4EAD0" stroke-width="6" stroke-linecap="round"/>`).join('') + `<path d="M1240 262 L1262 300 M1340 262 L1318 300" stroke="#FFE9A8" stroke-width="5" opacity=".5"/></g>`;
  // 뒤(제로 뒤): 침대 머리판, 베개, 협탁 + 스탠드
  let back = `<rect x="800" y="560" width="720" height="290" rx="34" fill="#8A6A4E" stroke="${INK}" stroke-width="9"/><rect x="830" y="590" width="660" height="60" rx="20" fill="#A07E5E" opacity=".7"/>` +
    `<g transform="rotate(-4 1100 760)"><rect x="930" y="690" width="340" height="150" rx="56" fill="#F3F0E8" stroke="${INK}" stroke-width="8"/><path d="M970 730 Q1100 716 1230 730" fill="none" stroke="#D9D4C6" stroke-width="5" stroke-linecap="round"/></g>` +
    `<rect x="590" y="740" width="170" height="206" rx="12" fill="#7A5C42" stroke="${INK}" stroke-width="8"/><rect x="606" y="770" width="138" height="60" rx="8" fill="#8E6E52" stroke="${INK}" stroke-width="5"/><circle cx="675" cy="800" r="8" fill="#F2C14E" stroke="${INK}" stroke-width="4"/>` +
    `<rect x="664" y="640" width="22" height="100" fill="#C9CEDA" stroke="${INK}" stroke-width="6"/><ellipse cx="675" cy="740" rx="44" ry="10" fill="#C9CEDA" stroke="${INK}" stroke-width="6"/><path d="M620 560 L730 560 L754 648 L596 648 Z" fill="#F0E6C8" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  // 앞(제로 앞): 이불(무릎 언덕) + 침대 앞판
  let front = `<path d="M780 946 L780 836 Q780 806 812 804 L960 796 Q1040 742 1100 742 Q1160 742 1240 796 L1508 804 Q1540 806 1540 836 L1540 946 Z" fill="#6E86D6" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M800 846 Q1160 822 1520 846" fill="none" stroke="#8CA2EA" stroke-width="10" stroke-linecap="round" opacity=".8"/>` + [[880, 880], [1020, 900], [1220, 892], [1400, 884]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#9DB1F0" opacity=".7"/>`).join('') +
    `<rect x="770" y="916" width="784" height="36" rx="12" fill="#7A5C42" stroke="${INK}" stroke-width="8"/>`;
  return { wall, back, front };
}
function mlnightScene(t, lt, a) {
  const c = mlCur(t), id = c ? c.id : 'n1';
  if (id === 'n1' || id === 'n3') return mlPhonePOV(t);
  const { ZX, ZY, S } = ML_N, n2 = mlL('n2'), n4 = mlL('n4'), n5 = mlL('n5'), n6 = mlL('n6');
  // 스티커: 가슴에 한 장(n5), 그리고 방 안 물건들(n6)
  const tak0 = [ZX + 30, ZY - 494 * S], mouth = [tak0[0], tak0[1] - 36], tS = n5.t1 + 0.34, tG = mlAt('n6', '모든', 0.42);
  const evs = [{ t0: tS, from: mouth, to: [ZX - 2, ZY - 226 * S], text: ['원래', '무대 체질 아님'], fs: 21, rot: -5, arc: -60, fly: 0.2, tp: n5.t0 - 0.1, te: n5.t1 - 0.1 },
    { t0: tG + 0.25, from: mouth, to: [675, 610], text: '원래 스탠드', fs: 28, rot: 6, arc: 150 }, { t0: tG + 0.8, from: mouth, to: [985, 742], text: '원래 베개', fs: 28, rot: -8, arc: 60 }, { t0: tG + 1.35, from: mouth, to: [402, 372], text: '원래 달', fs: 30, rot: 4, arc: 220 }];
  const tt = gfxStop(t, [[tS, 0.1, 0.22]]), st = mlStickers(t, evs);
  // 카메라
  let cam = gfxCam([[0, { x: 960, y: 560, z: 1.0 }], [n2.t0 - 0.15, { x: 960, y: 566, z: 1.0 }, { ease: 'cut' }], [n2.t0 + 0.2, { x: 1040, y: 590, z: 1.24 }, { d: n2.t1 - n2.t0 + 0.4, ease: 'io' }],
    [n4.t0 - 0.15, { x: 1104, y: 560, z: 1.95 }, { ease: 'cut' }], [n4.t0, { x: 1104, y: 556, z: 2.05 }, { d: 2.4 }], [n5.t0 - 0.15, { x: 1110, y: 590, z: 1.5 }, { ease: 'cut' }], [n6.t0 - 0.1, { x: 960, y: 566, z: 1.0 }, { d: 1.3, ease: 'io' }]], t);
  cam = gfxShake(gfxDrift(cam, t, 3, 1), t, [[tS, 16, 0.3], [tG + 0.25, 5, 0.2], [tG + 0.8, 5, 0.2], [tG + 1.35, 5, 0.2]]);
  const close = cam.z > 1.7;
  // 제로
  const nod = id === 'n4' ? actNod(t, mlAt('n4', '맞아', 0.35), 2, 10, 0.3) : 0, ta = gfxTalkAct(t, 'Z', 2), jz = actHit(tt, tS, 0.07, 5, 7);
  const base = id === 'n2' ? 'z기본' : (id === 'n4' ? (t > mlAt('n4', '맞아', 0.35) ? 'z뿌듯' : 'z반짝') : (id === 'n5' ? (t > tS ? 'z뿌듯' : 'z기본') : (t > n6.t1 - 1.2 ? 'z졸음' : 'z뿌듯')));
  const look = id === 'n2' || id === 'n4' ? [0, 0.75] : (id === 'n5' ? (t < tS ? [0.5, -0.2] : [0, 0.85]) : [0, 0.8]);
  const kd = actGo(t, n5.t0 - 0.05, { f: 2.6, z: 0.7 }), pose = actPose([[0, 'ml폰'], [n5.t0 - 0.05, 'ml무릎', { f: 2.6, z: 0.7 }]], t), py = lerp(ZY - 196 * S, ZY - 150 * S, clamp(kd, 0, 1.1));
  const zero = mlZ({ x: ZX, y: ZY, s: S, t: tt, pose, ex: gfxFace('mlzf', base, t, 'Z'), look, headDy: nod + ta.headDy, tilt: ta.tilt, sx: jz.sx, sy: jz.sy * ta.sy, light: 1 });
  const phone = `<g transform="translate(${ZX} ${f1(py)}) rotate(-4)"><rect x="-37" y="-62" width="74" height="124" rx="13" fill="#232A42" stroke="${INK}" stroke-width="7"/><circle cx="-18" cy="-42" r="7" fill="#3A4466" stroke="${INK}" stroke-width="3"/></g>`;
  // 딱지: n5에서 어깨 뒤에서 톡
  const tIn = n5.t0 - 0.12, kin = gfIn(t, tIn, 3.2, 0.42), tv = gfxVoice(t, 'T');
  const tak = t < tIn ? '' : mlTak(tak0[0], tak0[1] + (1 - Math.min(1, kin)) * 40 + nod + ta.headDy, 0.62 * Math.min(1.08, kin), Object.assign({ t, look: t < tS ? [-0.3, 0.9] : [-0.2, 0.6], talk: tv ? tv.e : 0, ex: t > tS + 0.2 && id === 'n5' ? 'proud' : (id === 'n6' && t > tG + 1.9 ? 'proud' : 'on'), ls: 0.72 }, st.tak, gfHop(tt, tS - 0.2, 14, 0.2)));
  const set = mlNightSet(t), kp = gfxProj(cam, ZX, py - 12), actors = set.back + zero + phone + set.front + tak + st.svg;
  const moon = gfxProj(cam, 402, 282, 0.94);
  return mlCompose({ cam, defs: gfDefs() + ML_DEFS + gfxDefs({ shadow: '#070B20', lights: [{ id: 'mlLn', amb: '#3A4576', key: { x: kp[0], y: kp[1], z: 150 * cam.z, col: '#CFEAFF', k: 1.2 }, rim: { dx: -7, dy: -3, col: '#8FB0FF', k: 0.7 }, bump: 5, relief: 9 }] }),
    far: [[0.94, set.wall, close ? { blur: 4 } : {}]], cast: [zero, { dx: -30, dy: -70, s: 1.32, cx: ZX, cy: ZY - 200, op: 0.42, soft: 3 }], lit: actors, light: 'mlLn',
    glow: gfxGlow(ZX, py - 20, 250, '#CFEAFF', 0.36) + st.fx, grade: gfxGrade('night', 0.42) + `<g>${gfxGlow(moon[0], moon[1], 300 * cam.z, '#BFD0FF', 0.3)}</g>`, vig: gfxVignette(0.55),
    hud: gfChipAt(t, n2.t0 + 0.1, 250, 96, '일요일 밤 11:00', { size: 34, icon: 'moon' }) });
}
/* ---------- 제목 카드: 딱지가 뽑은 큰 스티커 ---------- */
function mltitleScene(t, lt, a) {
  const l = mlL('k0'), t0 = l.t0 + 0.28, sl = gfxSlap(t, t0, { fly: 0.2, s0: 2.6, r0: -18 }), sh = gfShake(t, t0, 12, 0.3);
  let s = gfDefs() + ML_DEFS + `<rect x="-60" y="-60" width="2040" height="1200" fill="#FFF6D8"/><rect x="-60" y="-60" width="2040" height="1200" fill="url(#gfDots)" opacity=".5"/>`;
  s += `<g transform="translate(${f1(sh[0])} ${f1(sh[1])})">` + (sl.op > 0 ? `<g opacity="${sl.op}">${mlAtP(960, 520, 1.0 * sl.s, mlSt('제로의 세계', 150, { band: '#FF9A55' }), -3 + sl.rot)}</g>` : '') + gfxImpact(t, t0, 960, 520, { col: '#FF9A55', r: 420, n: 16, flash: false }) + gfStarBurst(t, t0, 960, 520, { n: 9, r0: 200, r1: 640, size: 30 }) + `</g>`;
  s += mlTak(1560, 860, 1.25, Object.assign({ t, look: [-0.7, -0.5], ex: t > t0 + 0.15 ? 'proud' : 'on', arm: t < t0 ? 'throw' : 'up' }, gfHop(t, t0 + 0.2, 34, 0.34)));
  return gfxScreen(s);
}

/* ---------- [월요일] 오전 10시, 회의실 ---------- */
const ML_O = { BX: 590, ZX: 1340, Y: 884, S: 0.95, TY: 716, FY: 936 };
const mlRemote = (x, y, r = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(r)})"><rect x="-46" y="-15" width="92" height="30" rx="13" fill="#2B3148" stroke="${INK}" stroke-width="6"/><circle cx="-22" cy="0" r="7" fill="#FF5A5A" stroke="${INK}" stroke-width="3"/><rect x="-4" y="-6" width="16" height="12" rx="4" fill="#8E9BB8"/><rect x="18" y="-6" width="16" height="12" rx="4" fill="#8E9BB8"/><path d="M-38 -9 H30" stroke="#fff" stroke-width="3" opacity=".25" stroke-linecap="round"/></g>`;
function mlOfficeSet(t) {
  const { TY, FY } = ML_O;
  let wall = `<rect x="-300" y="-300" width="2520" height="1700" fill="url(#mlOWall)"/><rect x="-300" y="${FY - 110}" width="2520" height="110" fill="#B4C6D8"/><rect x="-300" y="${FY}" width="2520" height="600" fill="#8FA3BA"/><rect x="-300" y="${FY - 6}" width="2520" height="18" fill="#E8F0F7" stroke="${INK}" stroke-width="5"/>`;
  // 창 + 블라인드(빛을 내는 것)
  wall += `<rect x="96" y="126" width="496" height="500" rx="18" fill="#fff" stroke="${INK}" stroke-width="9"/><rect x="118" y="148" width="452" height="456" fill="url(#mlOSky)"/>` + Array.from({ length: 13 }, (_, i) => `<rect x="118" y="${154 + i * 35}" width="452" height="17" fill="#F7FAFD" stroke="#B9C8D8" stroke-width="2.5"/>`).join('') + `<path d="M344 148 V604" stroke="#C9D6E2" stroke-width="5"/><rect x="100" y="112" width="488" height="30" rx="8" fill="#E3EBF3" stroke="${INK}" stroke-width="7"/>`;
  // 벽에 떨어진 블라인드 빛무늬
  wall += `<g opacity=".5" style="mix-blend-mode:screen">` + Array.from({ length: 7 }, (_, i) => `<path d="M${680 + i * 26} ${250 + i * 46} L${1080 + i * 26} ${250 + i * 46} L${1060 + i * 26} ${272 + i * 46} L${660 + i * 26} ${272 + i * 46} Z" fill="#FFF4D0"/>`).join('') + `</g>`;
  // 벽시계 10시, 화이트보드
  wall += `<circle cx="866" cy="216" r="60" fill="#fff" stroke="${INK}" stroke-width="8"/>` + [0, 3, 6, 9].map(i => `<line x1="866" y1="166" x2="866" y2="178" stroke="${INK}" stroke-width="5" transform="rotate(${i * 30} 866 216)"/>`).join('') + `<line x1="866" y1="216" x2="866" y2="186" stroke="${INK}" stroke-width="8" stroke-linecap="round" transform="rotate(-60 866 216)"/><line x1="866" y1="216" x2="866" y2="172" stroke="#E5484D" stroke-width="6" stroke-linecap="round"/><circle cx="866" cy="216" r="6" fill="${INK}"/>`;
  wall += `<rect x="1120" y="150" width="640" height="390" rx="16" fill="#FDFEFF" stroke="${INK}" stroke-width="9"/><rect x="1120" y="532" width="640" height="20" rx="8" fill="#C9D2DE" stroke="${INK}" stroke-width="6"/>` + [[1190, 430, 60, '#8FD3FF'], [1270, 380, 110, '#FFB38A'], [1350, 330, 160, '#3DDBB4'], [1430, 400, 90, '#FFD84A']].map(([x, y, h, c]) => `<rect x="${x}" y="${y}" width="50" height="${h}" rx="6" fill="${c}" opacity=".75"/>`).join('') + `<path d="M1170 492 H1500" stroke="#9AA6B8" stroke-width="5" stroke-linecap="round"/><path d="M1560 230 H1710 M1560 270 H1690 M1560 310 H1710 M1560 350 H1660" stroke="#C3CCD6" stroke-width="9" stroke-linecap="round"/><rect x="1300" y="536" width="60" height="12" rx="5" fill="#E5484D"/><rect x="1380" y="536" width="60" height="12" rx="5" fill="#3E7BFA"/>`;
  // 의자 등받이(인물 뒤), 탁자(인물 앞)
  const chair = x => `<rect x="${x - 96}" y="560" width="192" height="330" rx="40" fill="#4C5674" stroke="${INK}" stroke-width="9"/><rect x="${x - 70}" y="586" width="140" height="80" rx="24" fill="#5C6888" opacity=".8"/>`;
  const back = chair(ML_O.BX) + chair(ML_O.ZX);
  const table = `<rect x="300" y="${TY + 24}" width="1320" height="${FY - TY - 24}" rx="10" fill="#C99A62" stroke="${INK}" stroke-width="9"/><path d="M330 ${TY + 70} H1590" stroke="#B5864F" stroke-width="6" opacity=".6"/><path d="M268 ${TY + 30} L300 ${TY - 14} L1620 ${TY - 14} L1652 ${TY + 30} Z" fill="#E6BC83" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/><path d="M330 ${TY - 2} H1100" stroke="#fff" stroke-width="5" opacity=".35" stroke-linecap="round"/>`;
  // 화분(오른쪽 구석) — 뒤에서 스티커가 붙는다
  const plant = gfPlant(1780, FY, 1.05, t);
  const fg = `<g transform="translate(90 1150) rotate(14)">` + [-50, -20, 12, 44].map((a, i) => `<g transform="rotate(${f1(a + Math.sin(t * 1.1 + i) * 2.5)})"><path d="M0 0 Q-70 -160 0 -340 Q70 -160 0 0 Z" fill="${i % 2 ? '#3F9A62' : '#55B877'}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/></g>`).join('') + `</g>`;
  return { wall, back, table, plant, fg };
}
function mlofficeScene(t, lt, a) {
  const { BX, ZX, Y, S, TY } = ML_O, c = mlCur(t), id = c ? c.id : 'o7', L = k => mlL(k), o7 = L('o7'), o8 = L('o8'), o9 = L('o9'), o10 = L('o10'), o11 = L('o11'), o12 = L('o12'), o13 = L('o13');
  // 리모컨: 팀장이 밀어 보냄(o7) → 제로가 되민다(o9 끝)
  const tR1 = mlAt('o7', '리모', 0.62) + 0.1, tR2 = mlAt('o9', '아니라', 0.72) + 0.25, xA = BX + 190, xB = ZX - 200, k1 = easeOut(gfK(tR1, tR1 + 0.75, t)), k2 = easeOut(gfK(tR2, tR2 + 0.9, t));
  const rx = lerp(lerp(xA, xB, k1), xA + 16, k2), rr = (1 - k1) * -8 + Math.sin(k1 * 9) * 4 * (1 - k1) + Math.sin(k2 * 8) * 5 * (1 - k2) * (k2 > 0 ? 1 : 0), remote = mlRemote(rx, TY - 2, rr);
  // 딱지와 스티커
  const tak0 = [ZX + 28 * S, Y - 494 * S], mouth = [tak0[0], tak0[1] - 36], tB = o11.t1 + 0.42, tG = mlAt('o12', '편한', 0.14) + 0.2, tPe = mlAt('o13', '뜯어', 0.68);
  const evs = [{ t0: -99, from: mouth, to: [ZX - 2, Y - 226 * S], text: ['원래', '무대 체질 아님'], fs: 20, rot: -5, peel: tt => 0.62 * mlS(tt, tPe, 0.35) * (0.8 + 0.2 * Math.sin(tt * 9)) },
    { t0: tB, from: mouth, to: [BX + 66 * S, Y - 262 * S], text: ['원래', '차가운 사람'], fs: 20, rot: 7, arc: 230, fly: 0.36, tp: o11.t0 - 0.1, te: o11.t1 - 0.1 },
    { t0: tG + 0.3, from: mouth, to: [866, 300], text: '원래 월요일', fs: 28, rot: -6, arc: 120 }, { t0: tG + 0.85, from: mouth, to: [1780, 700], text: '원래 화분', fs: 28, rot: 8, arc: 160 }, { t0: tG + 1.4, from: mouth, to: [1440, 196], text: '원래 회의', fs: 30, rot: -3, arc: 60 }];
  const tt = gfxStop(t, [[tB, 0.1, 0.22]]), st = mlStickers(t, evs);
  // 카메라: 전체 → 리모컨 따라가기 → 팀장 → 제로 → 탁자 → 전체 → 제로 가슴
  let cam = gfxCam([[0, { x: 960, y: 548, z: 1.02 }], [o7.t0, { x: 960, y: 552, z: 1.07 }, { d: tR1 - o7.t0 }], [tR1 - 0.1, { x: 1010, y: 626, z: 1.38 }, { d: 0.95, ease: 'io' }],
    [o8.t0 - 0.15, { x: 615, y: 566, z: 1.6 }, { ease: 'cut' }], [o8.t0, { x: 637, y: 562, z: 1.66 }, { d: 3 }], [o9.t0 - 0.15, { x: 1350, y: 566, z: 1.58 }, { ease: 'cut' }], [o9.t0, { x: 1340, y: 562, z: 1.64 }, { d: 2.4 }], [tR2 - 0.05, { x: 1080, y: 640, z: 1.42 }, { d: 0.7 }],
    [o10.t0 - 0.15, { x: 940, y: 640, z: 1.46 }, { d: 0.9 }], [o10.t0 + 1.0, { x: 880, y: 590, z: 1.3 }, { d: 1.2 }], [o11.t0 - 0.15, { x: 1300, y: 545, z: 1.58 }, { ease: 'cut' }], [o11.t0, { x: 1304, y: 541, z: 1.62 }, { d: 2.2 }], [tB - 0.38, { x: 660, y: 566, z: 1.7 }, { d: 0.4, ease: 'io' }], [o12.t0 + 0.5, { x: 990, y: 536, z: 1.04 }, { d: 0.62, ease: 'io' }],
    [o13.t0 - 0.1, { x: ZX - 20, y: 600, z: 1.72 }, { d: 1.6, ease: 'io' }]], t);
  cam = gfxShake(gfxDrift(cam, t, 3, 2), t, [[tB, 14, 0.3], [tG + 0.3, 4, 0.2], [tG + 0.85, 4, 0.2], [tG + 1.4, 4, 0.2]]);
  // 팀장
  const bt = gfxTalkAct(t, 'B', 4), bPose = actPose([[0, 'ml앉음'], [tR1 - 0.25, 'ml내밂R', { f: 3.4, z: 0.7 }], [tR1 + 0.5, 'ml앉음', { f: 2.4, z: 0.8 }], [mlAt('o8', '제로', 0.45), 'ml내밂R', { f: 2.8, z: 0.6 }], [o8.t1 + 0.2, 'ml앉음', { f: 2.4, z: 0.8 }]], t);
  const bLook = t < o9.t0 ? [0.75, 0.05] : (t < o10.t0 ? [0.7, 0.1] : (t < o10.t0 + 1.2 ? [0.3, 0.9] : [0.5, 0.2])), jb = actHit(tt, tB, 0.06, 5, 7);
  const boss = mlB({ x: BX, y: Y, s: S, t: tt, pose: bPose, ex: gfxFace('mlbf', 'ml팀장', t, 'B', { brow: 3 }), look: bLook, turn: 0.35, headDy: bt.headDy, tilt: bt.tilt, sx: jb.sx, sy: jb.sy * bt.sy, light: -1 });
  // 제로
  const zt = gfxTalkAct(t, 'Z', 2), arr = tR1 + 0.7, wav = id === 'o9' && t < tR2 ? Math.sin((t - o9.t0) * 15) * 14 : 0;
  const zPose0 = actPose([[0, 'ml앉음'], [mlAt('o9', '원래', 0.3) - 0.1, 'ml손사래', { f: 3.6, z: 0.6 }], [tR2 - 0.22, 'ml내밂L', { f: 3.2, z: 0.7 }], [tR2 + 0.75, 'ml앉음', { f: 2.4, z: 0.8 }]], t);
  const zPose = wav ? Object.assign({}, zPose0, { armR: zPose0.armR.map((q, i) => i === 2 ? [q[0] + wav, q[1]] : q), hR: [zPose0.hR[0] + wav * 1.2, zPose0.hR[1]] }) : zPose0;
  const zBase = t < arr ? 'z기본' : (t < o8.t1 + 0.3 ? 'z당황' : (t < tR2 + 0.9 ? 'ml쓴웃음' : (t < o11.t0 ? 'z민망' : (t < tPe ? 'z뿌듯' : 'ml멍'))));
  const zLook = t < arr ? [-0.6, 0.1] : (t < o8.t0 ? [-0.5, 0.9] : (t < tR2 ? [-0.75, 0.05] : (t < o10.t1 ? [-0.6, 0.7] : (t < tPe ? [-0.3, 0] : [0, 0.9])))), jz = actHit(tt, arr, 0.07, 5, 7);
  const zero = mlZ({ x: ZX, y: Y, s: S, t: tt, pose: zPose, ex: gfxFace('mlzf', zBase, t, 'Z'), look: zLook, turn: t < tPe ? -0.35 : 0, headDy: zt.headDy, tilt: zt.tilt + (id === 'o9' ? 3 : 0), sx: jz.sx, sy: jz.sy * zt.sy, light: -1 }, true);
  const tv = gfxVoice(t, 'T'), hop = gfHop(tt, tB - 0.4, 22, 0.3);
  const tak = mlTak(tak0[0], tak0[1] + zt.headDy, 0.6, Object.assign({ t, look: t < o11.t0 - 0.3 ? [-0.6, 0.5] : (t < tB + 0.4 ? [-0.9, 0.2] : (t > tPe ? [0.2, 0.95] : [-0.3, 0.3])), talk: tv ? tv.e : 0, ex: t > tPe + 0.25 ? 'shock' : (t > tB + 0.25 && t < o12.t0 ? 'proud' : 'on'), ls: 0.72 }, st.tak, hop));
  const em = gfEmote(t, arr, ZX + 150, Y - 520 * S, 'bang', { hold: 1.0, s: 0.9 }) + gfEmote(t, o10.t0 + 1.5, BX - 20, Y - 590 * S, 'dots', { hold: 1.6, s: 0.9 }) + gfEmote(t, tPe + 0.3, ZX + 170, Y - 470 * S, 'q', { hold: 1.6, s: 0.85 });
  const set = mlOfficeSet(t), actors = set.back + boss + zero + set.table + remote + set.plant + tak + st.svg, kp = gfxProj(cam, 340, 300);
  return mlCompose({ cam, defs: gfDefs() + ML_DEFS + gfxDefs({ shadow: '#2A3655', lights: [{ id: 'mlLo', amb: '#C4C9DC', key: { x: kp[0], y: kp[1], z: 700 * cam.z, col: '#FFF0CC', k: 0.62 }, rim: { dx: -6, dy: -3, col: '#FFF4D0', k: 0.55 }, bump: 5, relief: 7 }] }),
    far: [[0.93, set.wall, cam.z > 1.45 ? { blur: 2 } : {}]], cast: [boss + zero, { dx: 44, dy: 6, s: 1.03, cx: 960, cy: 700, op: 0.2, soft: 2 }], lit: actors, light: 'mlLo',
    glow: gfxShafts(t, { x: 330, y: 150, ang: -52, n: 4, gap: 86, w: 60, len: 1500, op: 0.2, col: '#FFF3CC', spread: 1.5 }) + gfxDust(t, { box: [420, 180, 1000, 560], n: 26, seed: 5, op: 0.55 }) + em + st.fx,
    fg: set.fg, fgDepth: 1.4, fgBlur: 7, grade: gfxGrade('warm', 0.28), vig: gfxVignette(0.3, '#1A2440'), whip: t > tB - 0.34 && t < tB - 0.04,
    hud: gfChipAt(t, o7.t0 + 0.1, 286, 96, '월요일 오전 10:00', { size: 34, icon: 'sun' }) });
}

/* ---------- 자막·전환 덮개(화면 좌표) ---------- */
function mlSub(t) { return gfSubtitle(t); }
// 줄 경계에서 스티커 종이가 화면을 덮거나 벗겨진다. 장면이 바뀌는 순간(줄 시작 0.15초 전)에 다 덮인다.
const ML_PEEL = { k0: 'cover', o7: 'reveal', s14: 'both' };
function mlOver(t) { let h = '';
  for (const id in ML_PEEL) { const l = mlL(id); if (!l) continue; const tc = l.t0 - 0.15, u = t - tc, m = ML_PEEL[id], a = 0.5, b = 0.55; if (u < -a || u > b) continue;
    if (u < 0 && m !== 'reveal') h += gfxPeel(gfK(-a, 0, u)); else if (u >= 0 && m !== 'cover') h += gfxPeel(1 + gfK(0, b, u)); }
  return h ? gfDefs() + h : ''; }

/* ---------- 인물 시트(점검용) ---------- */
function mlsheetScene(t, lt, a) {
  const defs = gfDefs() + gfxDefs({ lights: [{ id: 'mlLs', amb: '#B9B2C8', key: { x: 1500, y: 80, z: 520, col: '#FFE9BE', k: 0.95 }, rim: { dx: 6, dy: -4, col: '#FFDF9A', k: 0.7 } }] }) + `<defs>${ML_TAK_CLIP}</defs>`;
  const bg = `<rect x="-200" y="-200" width="2320" height="1480" fill="#E9DFC6"/><rect x="-200" y="880" width="2320" height="400" fill="#D3C39C"/>`;
  const Y = 880, lit = a.lit !== 0;
  let fg = '';
  fg += gfActor(o => mlZ(o), { x: 190, y: Y, s: 0.72, t, pose: P['서기'], ex: fEx('z기본'), look: [0.3, 0] });
  fg += gfActor(o => mlZ(o, true), { x: 470, y: Y, s: 0.72, t, pose: P['서기'], ex: fEx('ml쓴웃음'), look: [0.3, 0] });
  fg += gfActor(mlB, { x: 750, y: Y, s: 0.74, t, pose: P['서기'], ex: fEx('ml팀장'), look: [0.2, 0] });
  fg += gfActor(mlK, { x: 1050, y: Y, s: 0.78, t, pose: P['손인사'], ex: fEx('ml왕의심'), look: [0.4, 0] });
  fg += gfActor(mlM, { x: 1360, y: Y, s: 0.74, t, pose: P['서기'], ex: fEx('ml스님'), look: [-0.3, 0] });
  fg += mlTak(1620, Y, 1, { t, look: [-0.5, 0.2] }) + mlTak(1800, Y, 1, { t, ex: 'proud', arm: 'up' });
  fg += mlTak(1620, 520, 1, { t, ex: 'shock' }) + mlTak(1800, 520, 1, { t, ex: 'sleep' }) + mlTak(1440, 520, 1, { t, out: 0.7, label: mlSt('원래 수레', 44), outLen: 70, talk: 0.5 });
  fg += mlAtP(300, 200, 1, mlSt(['원래', '무대 체질 아님'], 34)) + mlAtP(760, 200, 1, mlSt('원래 차가운 사람', 34, { peel: 0.5 })) + mlAtP(1150, 200, 1, mlSt('원래 수레', 40, { peel: 1 })) + mlAtP(1150, 330, 1, mlSt('아직', 44, { band: '#3DDBB4' }));
  return gfxScreen(defs + bg + (lit ? gfxCast(fg, { dx: -26, dy: 8, s: 1.0, op: 0.2, soft: 2 }) + gfxLit('mlLs', fg) : fg));
}
