/* ep.007 upgrade: Descartes-story lines are shown as AI illustrations (Nano Banana 2.1) with a slow camera (Ken Burns),
   cross-fading between pictures; the facts / quotes that used to sit in those scenes are drawn on top as before.
   Lines 1-5 keep the young man's face hidden (the animation reveals him on line 6). */
(function () {
  const MAP = { 1: '01', 2: '02', 3: '03', 4: '04', 5: '04', 35: '35', 45: '45', 46: '45', 47: '47', 48: '48' };
  const PAN = { '01': [1, 0], '02': [-1, 0], '03': [1, -1], '04': [-1, 0], '35': [1, 0], '45': [-1, 0], '47': [0, -1], '48': [1, 0] };
  const ZOOMOUT = {};
  const layer = document.getElementById('ai');
  const imgs = {};
  const uniq = [...new Set(Object.values(MAP))];
  window.AI_READY = Promise.all(uniq.map(k => new Promise(res => {
    const im = new Image();
    im.onload = () => res(k); im.onerror = () => res(k);
    im.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;object-fit:cover;opacity:0;transform-origin:50% 45%';
    im.src = 'ai/' + k + '.png';
    layer.appendChild(im); imgs[k] = im;
  }))).then(() => Promise.all(Object.values(imgs).map(im => (im.decode ? im.decode().catch(() => 0) : 0)))).then(() => uniq.length);

  const runOf = (i, L) => {
    const k = MAP[i]; let a = i, b = i;
    while (a > 0 && MAP[a - 1] === k) a--;
    while (b + 1 < L.length && MAP[b + 1] === k) b++;
    return [a, b];
  };
  const place = (k, t, t0, t1) => {
    const p = Math.min(1, Math.max(0, (t - t0) / Math.max(1, t1 - t0)));
    const e = p * p * (3 - 2 * p) * 0.5 + p * 0.5;
    const [dx, dy] = PAN[k] || [0, 0];
    const sc = ZOOMOUT[k] ? 1.16 - 0.13 * e : 1.02 + 0.07 * e;
    imgs[k].style.transform = `translate(${(dx * 30 * e).toFixed(2)}px, ${(dy * 18 * e).toFixed(2)}px) scale(${sc.toFixed(4)})`;
  };
  window.aiFrame = (i, t, L) => {
    for (const kk in imgs) { imgs[kk].style.opacity = 0; imgs[kk].style.zIndex = 0; }
    const k = MAP[i];
    if (!k) return false;
    const [a, b] = runOf(i, L);
    const t0 = L[a].t0 - 0.15, t1 = b + 1 < L.length ? L[b + 1].t0 - 0.15 : L[b].t1 + 0.4;
    place(k, t, t0, t1);
    imgs[k].style.opacity = 1; imgs[k].style.zIndex = 2;
    const pk = a > 0 ? MAP[a - 1] : null;   // cross-fade from the previous picture
    if (pk && pk !== k) {
      const f = Math.min(1, (t - t0) / 0.6);
      if (f < 1) {
        const [pa] = runOf(a - 1, L);
        place(pk, t, L[pa].t0 - 0.15, t0 + 0.6);
        imgs[pk].style.opacity = 1; imgs[pk].style.zIndex = 1; imgs[k].style.opacity = f.toFixed(3);
      }
    }
    return true;
  };

  // when the character segment of a line starts (relative to the line start), so quotes appear with his voice
  const segAt = (i, j, frac = 0) => {
    const l = TL.lines[i], s = (l.segs || [])[j];
    if (!s) return 0;
    return (s.t0 - l.t0) + 0.15 + frac * (s.t1 - s.t0);
  };
  const O = window.AI_POS || {};
  const P = (key, x, y) => (O[key] || [x, y]);
  window.aiOverlay = (i, t, lt, a) => {
    const D = a._dur || 3, at = f => t - lt + f;
    let h = '', p;
    switch (i) {
      case 1:
        p = P('1a', 1400, 230); h += pop(t, at(0.15), t + 99, p[0], p[1], big(0, 0, [[['약 ', '#fff'], ['400년 전', YEL]]], { size: 96, sw: 18 }), {});
        p = P('1b', 1400, 380); if (lt > 0.35 * D) h += pop(t, at(0.35 * D), t + 99, p[0], p[1], label(0, 0, '스물세 살 청년', { size: 42, bg: '#fff' }), { rot: -2 });
        break;
      case 2:
        p = P('2a', 1480, 160); h += pop(t, at(0.15), t + 99, p[0], p[1], label(0, 0, '유럽 최고의 학교', { size: 40, bg: '#fff' }), {});
        p = P('2b', 1480, 290); if (lt > 0.6 * D) h += pop(t, at(0.6 * D), t + 99, p[0], p[1], label(0, 0, '배울수록, 모르는 게 더 보여', { size: 40, bg: YEL }), { rot: -2, bob: 3 });
        break;
      case 3:
        p = P('3a', 1300, 130); h += pop(t, at(0.15 * D), t + 99, p[0], p[1], label(0, 0, '세상이라는 큰 책', { size: 46, bg: YEL }), {});
        p = P('3b', 1300, 250); if (lt > 0.3 * D) h += pop(t, at(0.3 * D), t + 99, p[0], p[1], label(0, 0, '프랑스 → 네덜란드 → 독일', { size: 36, bg: '#fff' }), {});
        p = P('3c', 1300, 360); if (lt > 0.66 * D) h += pop(t, at(0.66 * D), t + 99, p[0], p[1], label(0, 0, '여행 · 군대', { size: 38, bg: '#fff' }), { rot: 2 });
        break;
      case 4:
        p = P('4a', 960, 110); h += pop(t, at(0.2), t + 99, p[0], p[1], label(0, 0, '1619년 겨울 · 독일의 작은 마을', { size: 40, bg: YEL }), {});
        p = P('4b', 520, 300); if (lt > 0.42 * D) h += pop(t, at(0.42 * D), t + 99, p[0], p[1], label(0, 0, '하루 종일', { size: 36, bg: '#fff' }), { rot: -3, bob: 3 });
        break;
      case 5:
        p = P('5a', 960, 170); if (lt > segAt(5, 1)) h += pop(t, at(segAt(5, 1)), t + 99, p[0], p[1], big(0, 0, [[['조금이라도 의심되면, ', '#fff'], ['전부 의심!', YEL]]], { size: 70 }), {});
        break;
      case 35:
        p = P('35a', 1360, 430);
        h += quote(p[0], p[1], [[['나는 생각한다,', '#fff']], [['그러므로 ', '#fff'], ['나는 존재한다', YEL]]], 'Je pense, donc je suis · 『방법서설』 1637', t, lt, 0.05, { size: 76, srcDy: 150 });
        break;
      case 45:
        p = P('45a', 640, 120); h += pop(t, at(0.3), t + 99, p[0], p[1], label(0, 0, '1635년 · 딸 프랑신', { size: 46, bg: YEL }), {});
        break;
      case 46:
        p = P('45a', 640, 120); h += label(p[0], p[1], '1635년 · 딸 프랑신', { size: 46, bg: YEL });
        p = P('46a', 1450, 600); if (lt > 0.2 * D) h += pop(t, at(0.2 * D), t + 99, p[0], p[1], label(0, 0, '네덜란드 → 프랑스', { size: 36, bg: '#fff' }), {});
        p = P('46b', 1450, 720); if (lt > 0.45 * D) h += pop(t, at(0.45 * D), t + 99, p[0], p[1], label(0, 0, '함께 프랑스로, 공부시킬 계획', { size: 40, bg: YEL }), { rot: -2 });
        break;
      case 47:
        p = P('47a', 520, 160); h += pop(t, at(0.2), t + 99, p[0], p[1], label(0, 0, '1640년 가을', { size: 46, bg: '#fff' }), {});
        break;
      case 48: {
        const q1 = segAt(48, 1), q2 = segAt(48, 1, 0.5);
        p = P('48a', 1300, 250); if (lt > q1) h += pop(t, at(q1), t + 99, p[0], p[1], big(0, 0, ['나는 눈물과 슬픔을', [['부끄러운 것', YEL], ['이라 여기지 않는다', '#fff']]], { size: 58, sw: 12 }), {});
        p = P('48b', 1300, 520); if (lt > q2) h += pop(t, at(q2), t + 99, p[0], p[1], big(0, 0, ['강해 보이려고, 늘', [['아무렇지 않은 척', YEL], ['할 필요는 없다', '#fff']]], { size: 58, sw: 12 }), {});
        p = P('48c', 1300, 720); if (lt > q1 + 0.4) h += pop(t, at(q1 + 0.4), t + 99, p[0], p[1], label(0, 0, '— 데카르트, 친구에게 보낸 편지 (1641)', { size: 30, bg: '#fff' }), {});
        break;
      }
    }
    return h;
  };
})();
