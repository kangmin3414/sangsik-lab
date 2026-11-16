/* 화풍 전환 층 (zw/gfstyle.js) — 같은 장면을 다른 화풍으로 바꿔 그린다. 2026-11-16 운영자: "2D 기준으로 갑자기 도트 세계처럼 됐다가 다른 형식으로 됐다가".
   SVG 필터만 쓴다(외부 그림·글꼴·남의 화면 없음). zw/gf.js 다음에 읽는다. 새 이름은 모두 gs/gfStyle 접두사.
   쓰는 법: 장면이 배경(bg)과 인물(fg)을 따로 만들면  gfStyleDefs(종류, 옵션) + gfStyled(종류, bg, fg, t, 옵션)
   종류: vector(기본) pixel(도트 게임) gameboy(초록 4색 도트) cave(동굴 벽화) shadow(그림자극) relief(돌판 부조) woodblock(목판화)
         chalk(칠판 분필) holo(홀로그램) water(수채화) paper(종이 오리기)
   o.fgOnly = true면 인물만 화풍이 바뀐다(배경은 그대로).
   전환: gfStyleMosaic(t, tSwitch, d) → 바뀌는 순간 앞뒤로 도트 크기가 커졌다 작아지는 모자이크 값(0이면 끄기). */
const gsF = (id, body, o = {}) => `<filter id="${id}" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" x="${o.x == null ? -20 : o.x}" y="${o.y == null ? -20 : o.y}" width="${o.w || 1960}" height="${o.h || 1120}" color-interpolation-filters="sRGB">${body}</filter>`;
const gsTurb = (f, oct, seed, res, type = 'fractalNoise') => `<feTurbulence type="${type}" baseFrequency="${f}" numOctaves="${oct}" seed="${seed}" result="${res}"/>`;
const gsGrey = (inp, lo, hi, res, tint = [1, 1, 1]) => `<feColorMatrix in="${inp}" type="matrix" values="${[0, 1, 2].map(i => `${f1((hi - lo) * tint[i] * 1000) / 1000} 0 0 0 ${f1(lo * tint[i] * 1000) / 1000}`).join('  ')}  0 0 0 0 1" result="${res}"/>`;
const gsLv = n => Array.from({ length: n }, (_, i) => f1(i / (n - 1) * 1000) / 1000).join(' ');
/* 어두운 선(외곽선)만 골라 낸 알파 → result 'line' */
const gsLine = (thr = [1, 1, 0.3, 0, 0, 0, 0, 0]) => `<feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="la"/><feComponentTransfer in="la" result="line"><feFuncA type="table" tableValues="${thr.join(' ')}"/></feComponentTransfer>`;
/* 도트: 먼저 어두운 선을 굵혀(erode) 칸 가운데 표본이 선을 놓치지 않게 하고, 칸마다 가운데 2×2 점을 뽑아 칸 크기만큼 넓힌다(이웃 칸과 겹치지 않게 반지름 = 칸/2 - 1). */
const gsPixBody = (px, thick) => { const b = Math.max(4, Math.round(px / 2) * 2), h = Math.floor(b / 2), er = thick ? Math.max(1, Math.round(b / 4)) : 0;
  return (er ? `<feMorphology in="SourceGraphic" operator="erode" radius="${er}" result="src"/>` : '') + `<feFlood x="${h - 1}" y="${h - 1}" width="2" height="2"/><feComposite width="${b}" height="${b}"/><feTile result="a"/><feComposite in="${er ? 'src' : 'SourceGraphic'}" in2="a" operator="in"/><feMorphology operator="dilate" radius="${h - 1}" result="p"/>`; };
const GS = {
  pixel: (o = {}) => gsF('gs_pixel', gsPixBody(o.px || 12, o.thick == null ? 1 : o.thick) + `<feComponentTransfer in="p"><feFuncR type="discrete" tableValues="${gsLv(o.levels || 5)}"/><feFuncG type="discrete" tableValues="${gsLv(o.levels || 5)}"/><feFuncB type="discrete" tableValues="${gsLv(o.levels || 4)}"/></feComponentTransfer>`, { x: 0, y: 0, w: 1920, h: 1080 }),
  gameboy: (o = {}) => gsF('gs_gameboy', gsPixBody(o.px || 10, 1) + `<feColorMatrix in="p" type="saturate" values="0" result="g"/><feComponentTransfer in="g" result="g2"><feFuncR type="linear" slope="1.35" intercept="-0.12"/><feFuncG type="linear" slope="1.35" intercept="-0.12"/><feFuncB type="linear" slope="1.35" intercept="-0.12"/></feComponentTransfer><feComponentTransfer in="g2"><feFuncR type="discrete" tableValues="0.06 0.19 0.55 0.61"/><feFuncG type="discrete" tableValues="0.22 0.38 0.67 0.74"/><feFuncB type="discrete" tableValues="0.06 0.19 0.06 0.06"/></feComponentTransfer>`, { x: 0, y: 0, w: 1920, h: 1080 }),
  cave: () => gsF('gs_cave', `<feColorMatrix in="SourceGraphic" type="saturate" values="0" result="g"/>` +
    `<feComponentTransfer in="g" result="o"><feFuncR type="table" tableValues="0.18 0.52 0.70 0.86"/><feFuncG type="table" tableValues="0.12 0.27 0.46 0.76"/><feFuncB type="table" tableValues="0.10 0.14 0.26 0.62"/></feComponentTransfer>` +
    gsTurb(0.03, 2, 3, 'w') + `<feDisplacementMap in="o" in2="w" scale="10" xChannelSelector="R" yChannelSelector="G" result="d"/>` +
    gsTurb(0.011, 4, 7, 'r') + gsGrey('r', 0.62, 1.12, 'st', [1, 0.94, 0.86]) + gsTurb(0.5, 1, 9, 'gr') + gsGrey('gr', 0.82, 1.08, 'gr2') +
    `<feBlend in="d" in2="st" mode="multiply" result="m"/><feBlend in="m" in2="gr2" mode="multiply"/>`),
  shadow: () => gsF('gs_shadow', `<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0.09  0 0 0 0 0.06  0 0 0 0 0.05  0 0 0 1 0" result="s"/><feGaussianBlur in="s" stdDeviation="1.6"/>`),
  relief: () => gsF('gs_relief', `<feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="la"/><feComponentTransfer in="la" result="inv"><feFuncA type="table" tableValues="1 0.35 0"/></feComponentTransfer>` +
    `<feGaussianBlur in="inv" stdDeviation="2.4" result="b"/><feDiffuseLighting in="b" surfaceScale="6" diffuseConstant="1.05" lighting-color="#F4F0E8" result="lit"><feDistantLight azimuth="225" elevation="48"/></feDiffuseLighting>` +
    gsTurb(0.018, 4, 11, 'r') + gsGrey('r', 0.55, 1.0, 'st', [1, 0.97, 0.9]) + `<feBlend in="lit" in2="st" mode="multiply"/>`),
  woodblock: () => gsF('gs_woodblock', `<feColorMatrix in="SourceGraphic" type="saturate" values="0.6" result="s"/>` +
    `<feComponentTransfer in="s" result="p"><feFuncR type="discrete" tableValues="0.13 0.58 0.95"/><feFuncG type="discrete" tableValues="0.10 0.44 0.90"/><feFuncB type="discrete" tableValues="0.11 0.34 0.80"/></feComponentTransfer>` +
    `<feOffset in="p" dx="4" dy="3" result="off"/><feColorMatrix in="off" type="matrix" values="1 0 0 0 0.1  0 0.85 0 0 0.05  0 0 0.8 0 0.05  0 0 0 0.35 0" result="mis"/>` +
    gsTurb('0.002 0.09', 2, 4, 'wd') + gsGrey('wd', 0.8, 1.05, 'wd2', [1, 0.95, 0.88]) + gsTurb(0.9, 1, 6, 'gr') + gsGrey('gr', 0.85, 1.05, 'gr2') +
    `<feBlend in="p" in2="mis" mode="multiply" result="m1"/><feBlend in="m1" in2="wd2" mode="multiply" result="m2"/><feBlend in="m2" in2="gr2" mode="multiply"/>`),
  chalk: () => gsF('gs_chalk', gsLine() + `<feColorMatrix in="line" type="matrix" values="0 0 0 0 0.97  0 0 0 0 0.96  0 0 0 0 0.92  0 0 0 1 0" result="w"/>` +
    gsTurb(0.9, 2, 12, 'n') + `<feComponentTransfer in="n" result="nm"><feFuncA type="discrete" tableValues="0 0.6 1 1 1"/></feComponentTransfer><feComposite in="w" in2="nm" operator="in" result="wc"/>` +
    `<feColorMatrix in="SourceGraphic" type="matrix" values="0.5 0 0 0 0.45  0 0.5 0 0 0.45  0 0 0.5 0 0.45  0 0 0 0.22 0" result="fill"/>` +
    `<feFlood flood-color="#2E4A3B" result="bd"/>` + gsTurb(0.006, 3, 2, 'sm') + `<feColorMatrix in="sm" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.25 0 0 0 -0.06" result="smudge"/>` +
    `<feMerge><feMergeNode in="bd"/><feMergeNode in="smudge"/><feMergeNode in="fill"/><feMergeNode in="wc"/></feMerge>`),
  holo: (o = {}) => gsF('gs_holo', gsLine([1, 1, 0.5, 0.1, 0, 0, 0, 0]) + `<feColorMatrix in="line" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.98  0 0 0 0 1  0 0 0 1 0" result="cy"/><feGaussianBlur in="cy" stdDeviation="7" result="gl"/>` +
    `<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0.3  0.3 0.3 0.3 0 0.4  0.3 0.3 0.3 0 0.55  0 0 0 0.16 0" result="fill"/><feFlood flood-color="#06111F" result="bg"/>` +
    `<feMerge><feMergeNode in="bg"/><feMergeNode in="fill"/><feMergeNode in="gl"/><feMergeNode in="gl"/><feMergeNode in="cy"/></feMerge>`),
  water: () => gsF('gs_water', gsTurb(0.018, 3, 5, 'w') + `<feDisplacementMap in="SourceGraphic" in2="w" scale="9" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="1.8" result="b"/>` +
    `<feColorMatrix in="b" type="saturate" values="0.8" result="s"/><feComponentTransfer in="s" result="lt"><feFuncR type="linear" slope="0.88" intercept="0.12"/><feFuncG type="linear" slope="0.88" intercept="0.11"/><feFuncB type="linear" slope="0.88" intercept="0.1"/></feComponentTransfer>` +
    gsTurb(0.045, 3, 8, 'bl') + gsGrey('bl', 0.86, 1.06, 'bl2') + gsTurb(0.75, 1, 3, 'gr') + gsGrey('gr', 0.88, 1.04, 'gr2', [1, 0.98, 0.94]) +
    `<feBlend in="lt" in2="bl2" mode="multiply" result="m"/><feBlend in="m" in2="gr2" mode="multiply"/>`),
  paper: () => gsF('gs_paper', `<feDropShadow dx="8" dy="10" stdDeviation="3.5" flood-color="#2A2018" flood-opacity=".38" result="ds"/>` + gsTurb(0.65, 2, 4, 'gr') + gsGrey('gr', 0.86, 1.04, 'gr2', [1, 0.98, 0.95]) +
    `<feBlend in="ds" in2="gr2" mode="multiply" result="m"/><feComposite in="m" in2="ds" operator="in"/>`),
  paperbg: () => gsF('gs_paperbg', `<feColorMatrix in="SourceGraphic" type="saturate" values="0.75" result="s"/>` + gsTurb(0.65, 2, 9, 'gr') + gsGrey('gr', 0.84, 1.03, 'gr2', [1, 0.97, 0.92]) + `<feBlend in="s" in2="gr2" mode="multiply"/>`),
};
const GS_NAME = { vector: '기본', pixel: '도트 게임', gameboy: '초록 도트', cave: '동굴 벽화', shadow: '그림자극', relief: '돌판 부조', woodblock: '목판화', chalk: '칠판 분필', holo: '홀로그램', water: '수채화', paper: '종이 오리기' };
function gfStyleDefs(style, o = {}) {
  let d = '';
  if (GS[style]) d += GS[style](o);
  if (style === 'paper') d += GS.paperbg();
  if (o.mosaic > 0) d += gsF('gs_mosaic', gsPixBody(o.mosaic, 0), { x: 0, y: 0, w: 1920, h: 1080 });
  d += `<pattern id="gs_scan" width="8" height="6" patternUnits="userSpaceOnUse"><rect width="8" height="2" fill="#9FF6FF" opacity=".10"/></pattern>` +
    `<radialGradient id="gs_lamp" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#FFE2A6"/><stop offset=".55" stop-color="#F2A657"/><stop offset="1" stop-color="#7A3A1C"/></radialGradient>`;
  return `<defs>${d}</defs>`;
}
/* bg·fg를 화풍대로 묶는다. o.mosaic > 0이면 전체에 모자이크를 한 겹 더 씌운다(전환용). */
function gfStyled(style, bg, fg, t = 0, o = {}) {
  let s;
  if (style === 'shadow') s = `<rect x="-40" y="-40" width="2000" height="1160" fill="url(#gs_lamp)"/><g filter="url(#gs_shadow)">${fg}</g><rect x="-40" y="-40" width="2000" height="1160" fill="#FFB347" opacity="${f1((0.05 + 0.03 * Math.sin(t * 7)) * 100) / 100}"/>`;
  else if (style === 'paper') s = `<g filter="url(#gs_paperbg)">${bg}</g><g filter="url(#gs_paper)">${fg}</g>`;
  else if (style === 'vector' || !GS[style]) s = bg + fg;
  else if (o.fgOnly) s = bg + `<g filter="url(#gs_${style})">${fg}</g>`;          // 인물만 화풍이 바뀜(예: 제로만 도트로 빨려 들어감)
  else s = `<g filter="url(#gs_${style})">${bg + fg}</g>`;
  if (style === 'holo') s += `<rect x="0" y="${f1((t * 90) % 6)}" width="1920" height="1080" fill="url(#gs_scan)"/><rect width="1920" height="1080" fill="#7FF" opacity="${f1((0.02 + 0.02 * (Math.sin(t * 31) > 0.85 ? 1 : 0)) * 100) / 100}"/>`;
  if (o.mosaic > 0) s = `<g filter="url(#gs_mosaic)">${s}</g>`;
  return s;
}
/* 화풍이 바뀌는 순간(tSwitch) 앞뒤 d초 동안 모자이크 크기(0이면 없음) */
const gfStyleMosaic = (t, tSwitch, d = 0.28, max = 56) => { const u = 1 - Math.abs(t - tSwitch) / d; return u <= 0 ? 0 : Math.round(4 + (max - 4) * u * u); };
