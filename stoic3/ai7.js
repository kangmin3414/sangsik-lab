/* ep.006 upgrade: philosopher-story lines are shown as AI illustrations (Nano Banana 2.1) with a slow camera (Ken Burns),
   cross-fading between pictures; the facts / quotes that used to sit in those scenes are drawn on top as before. */
(function () {
  const MAP = { 1: '01', 9: '09', 15: '15', 16: '15', 19: '19', 20: '19', 24: '24', 28: '28', 32: '32', 36: '36' };
  const PAN = { '01': [1, 0], '09': [-1, 0], '15': [1, -1], '19': [-1, 0], '24': [0, 1], '28': [1, 0], '32': [-1, -1], '36': [1, 0] };
  const ZOOMOUT = { '24': 1 };   // "look down from above": the camera rises (zoom out) instead of pushing in
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

  const src = (x, y, txt) => label(x, y, txt, { size: 28, bg: '#fff' });
  window.aiOverlay = (i, t, lt, a) => {
    const D = a._dur || 3, at = f => t - lt + f;
    let h = '';
    switch (i) {
      case 1:
        h += pop(t, at(0.2), t + 99, 1460, 300, outlined(0, 0, [[['2천 년 전', YEL]]], { size: 110, sw: 20 }), {});
        if (lt > 0.62 * D) h += pop(t, at(0.62 * D), t + 99, 1460, 450, outlined(0, 0, ['스토아 철학자들'], { size: 80, sw: 15 }), {});
        if (lt > 0.75 * D) h += pop(t, at(0.75 * D), t + 99, 1440, 570, label(0, 0, '스토아 = 아테네의 ‘기둥 회랑’에서 가르친 데서 온 이름', { size: 30, bg: '#fff' }), {});
        break;
      case 9:
        h += pop(t, at(0.15), t + 99, 420, 150, label(0, 0, '에픽테토스 · 노예 출신 철학자', { size: 38, bg: '#E8D2B0' }), { rot: -2, bob: 3 });
        h += quote(1250, 230, [[['“우리에게 ', '#fff'], ['달린 것', MINT], ['과', '#fff']], [['달리지 않은 것', '#C3CDD8'], ['이 있다”', '#fff']]], '— 에픽테토스, 『엥케이리디온』 1', t, lt, 0.38 * D, { size: 64 });
        break;
      case 15:
        h += pop(t, at(0.15), t + 99, 470, 150, label(0, 0, '마르쿠스 아우렐리우스 · 『명상록』 2권 1절', { size: 34, bg: '#D9C6F0' }), { rot: -2, bob: 3 });
        if (lt > 0.4 * D) {
          h += pop(t, at(0.4 * D), t + 99, 1640, 520, `<rect x="-170" y="-200" width="340" height="400" fill="#FFF6A8" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="-200" r="14" fill="${RED}" stroke="${INK}" stroke-width="4"/><text x="0" y="-130" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="34" fill="${NAVY}">오늘 만날 사람</text>`, { rot: 4 });
          [['참견하는 사람', 0.5], ['고마워할 줄 모르는 사람', 0.62], ['무례한 사람', 0.78]].forEach(([txt, f], k) => { if (lt > f * D) h += pop(t, at(f * D), t + 99, 1640, 430 + k * 90, `<text x="0" y="10" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${txt.length > 8 ? 25 : 32}" fill="${RED}">✓ ${esc(txt)}</text>`, { rot: 4 }); });
        }
        break;
      case 16:
        h += label(470, 150, '마르쿠스 아우렐리우스 · 『명상록』 2권 1절', { size: 34, bg: '#D9C6F0' });
        if (lt > 0.45 * D) h += pop(t, at(0.45 * D), t + 99, 1240, 250, outlined(0, 0, [[['“우리는 ', '#fff'], ['서로 돕기 위해', YEL]], '태어났다”'], { size: 76, sw: 14 }), {});
        break;
      case 19:
        h += pop(t, at(0.1), t + 99, 560, 150, label(0, 0, '세네카 · 로마의 큰 부자 · 네로의 스승', { size: 36, bg: YEL }), { rot: -2, bob: 3 });
        if (lt > 0.3 * D) h += pop(t, at(0.3 * D), t + 99, 1560, 330, label(0, 0, '며칠씩', { size: 40, bg: '#fff' }), { rot: 3, bob: 3 });
        if (lt > 0.5 * D) h += pop(t, at(0.5 * D), t + 99, 1560, 450, label(0, 0, '가장 싼 음식', { size: 38, bg: '#FFC56E' }), { rot: -2 });
        if (lt > 0.7 * D) h += pop(t, at(0.7 * D), t + 99, 1560, 570, label(0, 0, '거친 옷', { size: 38, bg: '#C9B89A' }), { rot: 3 });
        break;
      case 20:
        h += label(560, 150, '세네카 · 로마의 큰 부자 · 네로의 스승', { size: 36, bg: YEL });
        h += quote(1180, 300, [[['“이게 내가 ', '#fff'], ['두려워하던', YEL]], [['그것인가?”', '#fff']]], '— 세네카, 『도덕 서한』 18', t, lt, 0.25 * D, { size: 66 });
        break;
      case 24:
        h += quote(960, 130, [[['“높은 곳에서 ', '#fff'], ['내려다보라', YEL], ['”', '#fff']]], '— 마르쿠스 아우렐리우스, 『명상록』', t, lt, 0.12 * D, { size: 70 });
        if (lt > 0.66 * D) {   // the tiny city far below
          const k = Math.min(1, (lt - 0.66 * D) / 0.4);
          h += `<g opacity="${(k).toFixed(2)}"><line x1="1450" y1="548" x2="1462" y2="672" stroke="#fff" stroke-width="5"/><circle cx="1462" cy="680" r="11" fill="${RED}" stroke="#fff" stroke-width="4"/></g>`;
          h += pop(t, at(0.66 * D), t + 99, 1450, 520, label(0, 0, '여기 어딘가의 작은 짜증', { size: 34, bg: '#fff' }), { rot: -2 });
        }
        break;
      case 28:
        h += pop(t, at(0.1), t + 99, 470, 150, label(0, 0, '에픽테토스 · 『엥케이리디온』 3', { size: 36, bg: '#E8D2B0' }), { rot: -2, bob: 3 });
        if (lt > 0.24 * D) {
          const g = `<g opacity=".85">${mug(-40, 10, 1.2, 0)}</g><path d="M-60 -40 L-40 0 L-62 30 L-38 70" fill="none" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M-90 80 L-110 100 M20 76 L40 104" stroke="${INK}" stroke-width="6"/>`;
          h += pop(t, at(0.24 * D), t + 99, 1380, 400, bubble(0, 0, 420, 300, g + `<text x="0" y="128" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="32" fill="${NAVY}">깨질 수 있는 컵</text>`), { rot: 2, bob: 4 });
        }
        break;
      case 32:
        h += pop(t, at(0.2), t + 99, 1250, 430, label(0, 0, 'MEMENTO MORI', { size: 44, bg: '#fff' }), { bob: 3 });
        h += quote(1180, 110, [[['“지금 당장이라도', '#fff']], [['삶을 떠날 수 있다는 듯이', YEL], ['”', '#fff']]], '— 마르쿠스 아우렐리우스, 『명상록』 2권 11절', t, lt, 0.3 * D, { size: 58, sw: 12, srcDy: 150 });
        break;
      case 36:
        h += pop(t, at(0.1), t + 99, 470, 150, label(0, 0, '세네카 · 『분노에 대하여』 3권 36절', { size: 34, bg: '#fff' }), { rot: -2, bob: 3 });
        [['오늘 고친 나쁜 습관은?', 0.32], ['내일은 어디서 더 나아질까?', 0.66]].forEach(([q, f], k) => { if (lt > f * D) h += pop(t, at(f * D), t + 99, 1380, 300 + k * 110, label(0, 0, q, { size: 38, bg: k ? MINT : YEL }), { rot: k ? 2 : -2, bob: 3 }); });
        break;
    }
    return h;
  };
})();
