/* 화풍 전환 시험: 같은 장면(낮 들판의 제로·하나·게임 지폐·하트)을 화풍만 바꿔 그린다. 사피엔스 편 개선안용. */
const ST_BILL = `<g><rect x="-110" y="-56" width="220" height="112" rx="12" fill="#BFE6B0" stroke="${INK}" stroke-width="6"/><circle cx="-52" cy="0" r="30" fill="#E8F6E0" stroke="${INK}" stroke-width="4"/><text x="40" y="14" font-family="sans-serif" font-weight="900" font-size="36" text-anchor="middle" fill="#2E6B3A">10000</text></g>`;
function stScene(t) {
  const bg = gfFull('url(#gfDay)') + gfSun(1600, 170, 70, t) + gfClouds(t, 210, 3, 2) + gfHill(700, 70, 260, '#A9DB86', 0) + gfHill(780, 50, 200, '#8FCF6E', 300) + gfTree(280, 900, 1.15, t) + gfTree(1720, 900, 0.9, t) +
    `<rect x="-100" y="880" width="2200" height="300" fill="#82C764" stroke="${INK}" stroke-width="7"/>` + [0, 1, 2, 3, 4, 5].map(i => `<circle cx="${300 + i * 260}" cy="${960 + (i % 2) * 30}" r="10" fill="${['#FFE38A', '#FF9AB0', '#fff'][i % 3]}" stroke="${INK}" stroke-width="3"/>`).join('');
  const s = 0.95;
  let fg = gfActor(FKZW, { x: 820, y: 900, s, t, pose: '손인사', ex: fEx('z빵긋'), look: [0.3, 0], seed: 3 }, { dy: -Math.abs(Math.sin(t * 3)) * 8 }) +
    gfActor(FKH, { x: 1140, y: 900, s: s * 0.95, t, pose: '서기', ex: fEx('z기본'), look: [-0.5, 0], seed: 81 });
  fg += fkAt(560, 470 + Math.sin(t * 2) * 10, ST_BILL, 1, -8) + fkAt(820, 300, fkHearts(t, 3), 0.8) + fkCloud(1140, 300, 0.6, t, { seed: 4 });
  return { bg, fg };
}
window.ST = (t, style, o = {}) => { const { bg, fg } = stScene(t); const lab = o.label === false ? '' : gfChipAt(9, 0, 960, 70, GS_NAME[style] || style, { size: 44, bg: '#fff' });
  document.getElementById('v').innerHTML = fkDefs() + gfStyleDefs(style, o) + gfStyled(style, bg, fg, t, o) + lab; };
