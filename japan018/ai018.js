/* ep.018: picture-book documentary layer — one illustration per beat (ai/<shot>.png, Nano Banana 2.1),
   slow Ken Burns, 0.6 s cross-fade between pictures, seasonal particles, small labels, and the depth HUD. */
(function () {
  const SHOTS = ['P1', 'P2', '1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-8', '1-9', '2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '2-8', '2-9',
    '3-1', '3-2', '3-3', '3-3b', '3-4', '3-5', '3-6', '3-7', '3-10', '4-1', '4-2', '4-3', '4-4', '4-11', '4-5', '4-6', '4-7', '4-8', '4-9', '4-10', '4-13',
    '5-1', '5-2', '5-3', '5-4', '5-5'];
  // camera: [dx, dy, zoom] — dx/dy = drift direction, zoom +1 push in, -1 pull out
  const KB = { 'P1': [0, 0, 1], 'P2': [-1, 0, -1], '1-1': [1, 0, 1], '1-2': [1, 0, 1], '1-3': [0, 0, 1], '1-4': [1, 0, 1], '1-5': [0, 0, 1], '1-6': [0, 0, 1],
    '1-8': [0, 0, 1], '1-9': [-1, 0, -1], '2-1': [1, 0, 1], '2-2': [0, 0, 1], '2-3': [-1, 0, 1], '2-4': [0, 0, 1], '2-5': [0, 0, -1], '2-6': [1, 0, 1], '2-8': [0, 0, 1],
    '2-9': [0, -1, -1], '3-1': [0, 0, 1], '3-2': [-1, 0, 1], '3-3': [0, 0, 1], '3-3b': [0, 0, 1], '3-4': [0, 0, -1], '3-5': [0, 0, 1], '3-6': [1, 0, 1], '3-7': [0, 0, 1],
    '3-10': [0, 0, 1], '4-1': [1, 0, 1], '4-2': [0, 0, 1], '4-3': [0, 0, 1], '4-4': [-1, 0, 1], '4-11': [0, -1, -1], '4-5': [0, 0, 1], '4-6': [0, 0, 1], '4-7': [0, 0, -1],
    '4-8': [0, 0, 1], '4-9': [1, 0, 0], '4-10': [0, 0, -1], '4-13': [0, -1, -1], '5-1': [0, 0, 1], '5-2': [0, 0, 1], '5-3': [0, 0, 1], '5-4': [1, 0, 1], '5-5': [0, 0, -1] };
  const layer = document.getElementById('ai'), imgs = {};
  window.AI_READY = Promise.all(SHOTS.map(k => new Promise(res => {
    const im = new Image(); im.onload = () => res(k); im.onerror = () => res(k);
    im.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;object-fit:cover;opacity:0;transform-origin:50% 48%';
    im.src = 'ai/' + k + '.png'; layer.appendChild(im); imgs[k] = im;
  }))).then(() => SHOTS.filter(k => imgs[k].naturalWidth > 0).length);
  const shotOf = i => { const l = TL.lines[i]; return l && l.args && l.args.shot; };
  const runOf = i => { const L = TL.lines, k = shotOf(i); let a = i, b = i; while (a > 0 && shotOf(a - 1) === k) a--; while (b + 1 < L.length && shotOf(b + 1) === k) b++; return [a, b]; };
  const place = (k, t, t0, t1) => {
    const p = Math.min(1, Math.max(0, (t - t0) / Math.max(1, t1 - t0))), e = p * p * (3 - 2 * p) * 0.5 + p * 0.5;
    const [dx, dy, z] = KB[k] || [0, 0, 1], sc = z < 0 ? 1.12 - 0.09 * e : z > 0 ? 1.03 + 0.08 * e : 1.06;
    imgs[k].style.transform = `translate(${(dx * 34 * (e - 0.5)).toFixed(2)}px, ${(dy * 22 * (e - 0.5)).toFixed(2)}px) scale(${sc.toFixed(4)})`;
  };
  window.aiFrame = (i, t, L) => {
    for (const kk in imgs) { imgs[kk].style.opacity = 0; imgs[kk].style.zIndex = 0; }
    const k = shotOf(i); if (!k || !imgs[k]) return false;
    const [a, b] = runOf(i), t0 = L[a].t0 - 0.15, t1 = b + 1 < L.length ? L[b + 1].t0 - 0.15 : L[b].t1 + 0.6;
    place(k, t, t0, t1); imgs[k].style.zIndex = 2;
    const fade = Math.min(1, Math.max(0, (t - t0) / 0.6)), pk = a > 0 ? shotOf(a - 1) : null;
    if (pk && imgs[pk] && fade < 1) {          // cross-fade from the previous picture
      const [pa, pb] = runOf(a - 1); place(pk, t, L[pa].t0 - 0.15, t0 + 0.6); imgs[pk].style.zIndex = 1; imgs[pk].style.opacity = 1;
      imgs[k].style.opacity = fade.toFixed(3);
    } else imgs[k].style.opacity = 1;
    return true;
  };

  // ---------- overlays ----------
  const SEASON = i => i < 2 ? 'spring' : i <= 13 ? 'spring' : i <= 25 ? 'summer' : i <= 37 ? 'autumn' : i <= 54 ? 'winter' : 'spring';
  const NOFX = { '1-3': 1, '1-4': 1, '2-2': 1, '2-3': 1, '2-4': 1, '2-5': 1, '2-6': 1, '2-8': 1, '3-3b': 1, '3-5': 1, '3-6': 1, '3-7': 1, '4-2': 1, '4-3': 1, '4-4': 1,
    '4-5': 1, '4-6': 1, '4-7': 1, '4-8': 1, '4-9': 1, '4-10': 1, '4-13': 1, 'P1': 1, '1-2': 1, '5-5': 1 };   // indoor or busy pictures: no falling petals
  function fx(season, t) {
    let h = '';
    for (let n = 0; n < 14; n++) {
      const sp = 0.05 + (n % 5) * 0.012, ph = (t * sp + n * 0.137) % 1, x = (n * 151 + Math.sin(t * 0.6 + n) * 60) % 1920, y = -40 + ph * 1000, r = n % 3;
      if (season === 'spring') h += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${7 + r * 2}" ry="${4 + r}" fill="#FFC9D9" opacity=".85" transform="rotate(${((t * 80 + n * 40) % 360).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
      if (season === 'autumn') h += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l8 -10 l8 10 l-8 10 z" fill="${['#E8893A', '#D9A23A', '#C8573A'][r]}" opacity=".85" transform="rotate(${((t * 60 + n * 50) % 360).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
      if (season === 'winter') h += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${3 + r}" fill="#fff" opacity=".85"/>`;
    }
    return h;
  }
  const tag = (x, y, txt, o = {}) => pop(o.t, o.t0, o.t + 99, x, y, label(0, 0, txt, { size: o.size || 38, bg: o.bg || '#FFFDF4' }), { rot: o.rot || -2, bob: 3 });
  const jp = (x, y, ja, ko, o = {}) => pop(o.t, o.t0, o.t + 99, x, y,
    `<rect x="-${o.w || 420}" y="-62" width="${2 * (o.w || 420)}" height="124" rx="26" fill="#FFFDF4" stroke="${INK}" stroke-width="6"/>` +
    T8(0, -6, ja, { size: o.js || 44, fill: o.jc || NAVY }) + T8(0, 42, ko, { size: 30, fill: '#8A6A44', w: 700 }), { rot: o.rot || -1.5, bob: 3 });
  // depth HUD: chapter, depth, and the "몰랐던 것" counter (renamed "몰랐던 한국" at year 30)
  const CH = [[3, 13, '1년 차', '수심 1m'], [14, 25, '5년 차', '수심 10m'], [26, 37, '10년 차', '수심 100m'], [38, 54, '30년 차', '해저']];
  const UNK = { 6: 1, 7: 2, 8: 3, 11: 4, 17: 5, 20: 6, 21: 7, 27: 8, 30: 9 }, UNK_KR = { 42: 1, 44: 2, 45: 3, 48: 4, 49: 5 };
  function hud(i, t, lt) {
    const c = CH.find(c => i >= c[0] && i <= c[1]); if (!c || TL.lines[i].scene === 'jcard') return '';
    const kr = i >= 38; let n = 0, last = -1;
    for (const [k, v] of Object.entries(kr ? UNK_KR : UNK)) if (i >= +k) { n = v; last = +k; }
    const bump = last === i ? Math.max(0, 1 - Math.abs(lt - 0.9) / 0.5) : 0;
    let h = `<g transform="translate(1660 74)"><rect x="-230" y="-44" width="460" height="128" rx="30" fill="${NAVY}" opacity=".9" stroke="${kr ? '#FF9A7A' : MINT}" stroke-width="4"/>`;
    h += T8(-200, 2, `${c[2]} · ${c[3]}`, { anchor: 'start', size: 30, fill: '#fff' });
    h += T8(-200, 56, kr ? '몰랐던 한국' : '몰랐던 것', { anchor: 'start', size: 26, fill: kr ? '#FFB8A0' : '#9FE3C8' });
    h += `<g transform="translate(150 46) scale(${(1 + 0.35 * bump).toFixed(3)})">` + T8(0, 12, String(n), { size: 44, fill: YEL }) + '</g>';
    return h + '</g>';
  }
  window.aiOverlay = (i, t, lt, a) => {
    const k = a.shot, D = a._dur || 3, T0 = t - lt, at = f => T0 + f, o = (f, x) => Object.assign({ t, t0: at(f) }, x || {});
    let h = '';
    if (!NOFX[k]) h += fx(SEASON(i), t);
    switch (k) {
      case '1-3': h += jp(1420, 230, '礼金 (れいきん)', '레이킨 · 돌려받지 않는 사례금', o(0.35 * D, { w: 380 })); break;
      case '1-4': h += pop(t, at(0.45 * D), t + 99, 1500, 260, `<rect x="-260" y="-110" width="520" height="220" rx="28" fill="#FFFDF4" stroke="${INK}" stroke-width="6"/>` +
        T8(0, -38, '집을 구한 외국인 중', { size: 32, fill: '#6B6255' }) + T8(0, 30, '열 명 중 네 명꼴', { size: 52, fill: RED }) + T8(0, 82, '"외국인이라서" 거절 (39.3%)', { size: 28, fill: NAVY }), { rot: 2 }); break;
      case '1-6': if (lt > 0.62 * D) h += jp(1350, 230, 'これは、木曜日ですよ。', '이건, 목요일이에요.', o(0.62 * D, { w: 360 })); break;
      case '1-8': if (lt > 0.55 * D) h += tag(1380, 250, '틀렸다 → 달랐다', o(0.55 * D, { size: 44, bg: YEL })); break;
      case '2-2': if (lt > 0.35 * D) h += jp(960, 200, '社長は、ただいま、いらっしゃいません！', '사장님께서는 지금 자리에 안 계십니다! ✗', o(0.35 * D, { w: 520, js: 38, jc: RED })); break;
      case '2-3': h += jp(960, 200, '社長の田中は、席を外しております。', '사장 다나카는 자리에 없습니다 ✓ (바깥사람 앞에선 우리 쪽을 낮춘다)', o(0.45 * D, { w: 560, js: 38, jc: '#2E8B57' })); break;
      case '2-4': if (lt > 0.5 * D) h += jp(1350, 210, '考えておきます。', '생각해 보겠습니다', o(0.5 * D, { w: 330 })); break;
      case '2-5': h += tag(1400, 230, '= 정중한 거절일 때가 많다', o(0.5 * D, { size: 40, bg: YEL })); break;
      case '2-6': h += jp(960, 190, '〇〇さん', '5년이 지나도, 성 + さん(상)', o(0.3 * D, { w: 330 })); break;
      case '2-8': h += tag(500, 230, '실험 2 · 말끝, 표정, 다음 행동', o(0.1, { size: 38, bg: MINT })); break;
      case '3-1': h += jp(1400, 230, '回覧板 (かいらんばん)', '회람판 · 동네 소식을 돌리는 판', o(0.5 * D, { w: 380 })); break;
      case '3-3b': h += jp(1380, 220, '甘え (あまえ)', '아마에 · 기대고 싶은 마음', o(0.55 * D, { w: 330 })); break;
      case '3-5': h += tag(560, 220, '실험 3 · 완벽한 일본 사람 되기', o(0.35 * D, { size: 40, bg: '#FFB8A0' })); break;
      case '4-3': if (i === 41) h += tag(700, 260, '"이모!"', o(0.1, { size: 56, bg: YEL, rot: -6 })); else h += tag(1420, 230, '처음 본 사람도 이모 · 삼촌 · 언니', o(0.4 * D, { size: 36 })); break;
      case '4-4': if (i === 43) h += tag(760, 250, '"너 몇 살이야?"', o(0.1, { size: 52, bg: YEL, rot: -5 })); else h += tag(1400, 230, '나이 → 반말·존댓말, 형·동생', o(0.2 * D, { size: 36 })); break;
      case '4-11': if (i === 45) h += jp(1420, 220, '高麗神社 (こまじんじゃ)', '고마 신사 · 716년 고마군', o(0.35 * D, { w: 380 })); break;
      case '4-5': if (lt > 0.7 * D) h += tag(700, 260, '"すみません!"', o(0.7 * D, { size: 54, bg: YEL, rot: -6 })); break;
      case '4-6': if (lt > 0.62 * D) h += tag(1350, 260, '"그냥 드시는 거예요~"', o(0.62 * D, { size: 46, bg: '#FFD9C9', rot: 4 })); break;
      case '4-9': h += pop(t, at(0.1), t + 99, 480, 120, label(0, 0, '폐를 끼치지 않는 배려', { size: 40, bg: '#FFFDF4' }), {}) +
        (lt > 0.5 * D ? pop(t, at(0.5 * D), t + 99, 1440, 120, label(0, 0, '폐를 끼쳐도 되는 사이', { size: 40, bg: '#FFE3D6' }), {}) : ''); break;
      case '5-2': if (lt > 0.8 * D) h += tag(1350, 260, '"밥은 먹었어요?"', o(0.8 * D, { size: 52, bg: YEL, rot: 4 })); break;
      case '5-3': if (a.end) {
          h += pop(t, at(0.1), t + 99, 960, 230, outlined(0, 0, [[['다음 실험에서', '#fff']], [['또 만나요', YEL]]], { size: 92, sw: 18 }), {});
          h += pop(t, at(0.5), t + 99, 960, 420, label(0, 0, '상식실험실', { size: 40, bg: MINT }), {});
        } else h += pop(t, at(0.3), t + 99, 960, 250, `<rect x="-500" y="-120" width="1000" height="230" rx="28" fill="#FFFDF4" opacity=".96" stroke="${INK}" stroke-width="6"/>` +
          T8(0, -40, '和而不同', { size: 64, fill: NAVY }) + T8(0, 30, '어울리되, 같아지지 않는다', { size: 44, fill: NAVY }) + T8(440, 92, '『논어』 자로', { anchor: 'end', size: 26, fill: '#8A6A44', w: 700 }), {}); break;
      case '5-4': if (lt > 0.6 * D) h += tag(960, 220, '가장 늦게 알게 된 건, 우리 자신', o(0.6 * D, { size: 46, bg: YEL })); break;
      case '5-5': if (a.ask) h += tag(960, 230, '외국인 친구가 신기해했던 한국은?', o(0.2, { size: 46, bg: MINT })); else h += tag(960, 230, "오늘 하나: 익숙한 습관을 '밖의 눈'으로", o(0.3 * D, { size: 42, bg: YEL })); break;
    }
    h += hud(i, t, lt);
    return h;
  };
})();
