/* 상식실험실 밝은 배경 (2026-10-30, 운영자 요청: 배경이 너무 어둡고 칙칙함). anim*.html에서 장면 파일들 다음에 읽는다.
   필요한 defs: #grid17 패턴, 밝은 #nightRoom 그라데이션 — tools/new_episode.py가 넣어 준다. */
labBg = function (t) {  // daylight lab: cream-to-mint wall, soft grid, light floor
  let h = BG('#EEF5F0') + `<rect x="-600" y="-600" width="3120" height="1480" fill="#F7F3E8" opacity=".6"/>` + BG('url(#grid)').replace('/>', ' opacity="1"/>').replace('url(#grid)', 'url(#grid17)');
  h += `<ellipse cx="960" cy="420" rx="900" ry="420" fill="url(#warm)" opacity=".45"/><rect x="-600" y="880" width="3120" height="600" fill="#CFE3DA"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="6"/>`;
  return h;
};
nightRoom12 = function (t, o = {}) {  // evening room with a warm lamp: still night, never gloomy
  let h = BG('url(#nightRoom)') + BG('url(#hatch)').replace('/>', ' opacity=".2"/>');
  h += `<ellipse cx="560" cy="560" rx="620" ry="420" fill="url(#warm)" opacity=".5"/>`;
  h += windowNight(o.wx || 1300, 150, 420, 330, t);
  h += `<rect x="-600" y="880" width="3120" height="600" fill="#6F6A8E"/><line x1="-600" y1="880" x2="2520" y2="880" stroke="${INK}" stroke-width="7"/>`;
  return h;
};
