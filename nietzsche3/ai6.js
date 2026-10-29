/* ep.005 upgrade: story lines are shown as AI illustrations (Nano Banana 2.1) with a slow camera (Ken Burns),
   cross-fading between pictures; the facts / quotes that used to sit in those scenes are drawn on top as before. */
(function () {
  const MAP = { 1: '01', 2: '02', 3: '03', 4: '03', 9: '09', 10: '10', 21: '21', 22: '21', 28: '28', 38: '38', 39: '39' };
  const PAN = { '01': [-1, 0], '02': [1, 0], '03': [-1, -1], '09': [1, -1], '10': [-1, 0], '21': [0, -1], '28': [1, 0], '38': [-1, 0], '39': [1, -1] };
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
    imgs[k].style.transform = `translate(${(dx * 30 * e).toFixed(2)}px, ${(dy * 18 * e).toFixed(2)}px) scale(${(1.02 + 0.07 * e).toFixed(4)})`;
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

  const bubble = txt => `<path d="M-310 -70 L310 -70 Q340 -70 340 -40 L340 40 Q340 70 310 70 L40 70 L0 120 L-10 70 L-310 70 Q-340 70 -340 40 L-340 -40 Q-340 -70 -310 -70 Z" fill="#fff" stroke="${INK}" stroke-width="7"/><text x="0" y="14" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="42" fill="${NAVY}">${txt}</text>`;
  window.aiOverlay = (i, t, lt, a) => {
    const D = a._dur || 3, at = f => t - lt + f;
    let h = '';
    switch (i) {
      case 1:
        h += pop(t, at(0.1), t + 99, 1380, 220, label(0, 0, '140년 전', { size: 46, bg: YEL }), { rot: -3, bob: 3 });
        if (lt > 0.6 * D) {
          h += pop(t, at(0.6 * D), t + 99, 1380, 400, outlined(0, 0, ['프리드리히 니체'], { size: 92, sw: 16 }), {});
          h += pop(t, at(0.6 * D + 0.3), t + 99, 1380, 530, label(0, 0, '1844 – 1900 · 독일 철학자', { size: 38, bg: '#fff' }), {});
        }
        break;
      case 2:
        h += pop(t, at(0.2), t + 99, 1380, 300, label(0, 0, '24세 · 바젤대학 교수', { size: 44, bg: YEL }), { rot: -2, bob: 3 });
        if (lt > 0.42 * D) h += pop(t, at(0.42 * D), t + 99, 1380, 440, label(0, 0, '심한 두통 · 눈병', { size: 44, bg: PINK }), { rot: 2, bob: 3 });
        if (lt > 0.74 * D) h += pop(t, at(0.74 * D), t + 99, 1380, 580, label(0, 0, '34세 · 교수직 사임', { size: 44, bg: '#C3CDD8' }), { rot: -2, bob: 3 });
        break;
      case 3:
        h += pop(t, at(0.35), t + 99, 1260, 210, outlined(0, 0, ['“신은 죽었다”'], { size: 104, sw: 18 }), {});
        h += pop(t, at(0.6), t + 99, 1260, 320, label(0, 0, '— 니체, 『즐거운 학문』(1882)', { size: 30, bg: '#fff' }), {});
        break;
      case 4:
        h += outlined(1260, 210, ['“신은 죽었다”'], { size: 72, sw: 14, fill: '#E8E2D6' });
        if (lt > 0.62 * D) h += pop(t, at(0.62 * D), t + 99, 1300, 340, label(0, 0, '의미는, 스스로 만든다', { size: 42, bg: MINT }), { rot: -2, bob: 3 });
        break;
      case 9:
        if (lt > 0.32 * D) {
          h += pop(t, at(0.32 * D), t + 99, 960, 200, outlined(0, 0, [[['“걸으면서 얻은 생각만이', '#fff']], [['가치가 있다', YEL], ['”', '#fff']]], { size: 74, sw: 14 }), {});
          h += pop(t, at(0.32 * D + 0.3), t + 99, 960, 360, label(0, 0, '— 니체, 『우상의 황혼』(1888)', { size: 30, bg: '#fff' }), {});
        }
        break;
      case 10:
        h += pop(t, at(0.15), t + 99, 420, 150, label(0, 0, '실스마리아 · 스위스', { size: 40, bg: MINT }), {});
        if (lt > 0.7 * D) h += pop(t, at(0.7 * D), t + 99, 1420, 300, label(0, 0, '떠오른 생각은 수첩에', { size: 38, bg: YEL }), { rot: 3, bob: 3 });
        break;
      case 21:
        if (lt > 0.25 * D) {
          h += pop(t, at(0.25 * D), t + 99, 960, 170, outlined(0, 0, [[['“나를 죽이지 못하는 것은', '#fff']], [['나를 ', '#fff'], ['더 강하게', YEL], [' 만든다”', '#fff']]], { size: 66, sw: 13 }), {});
          h += pop(t, at(0.25 * D + 0.3), t + 99, 960, 320, label(0, 0, '— 니체, 『우상의 황혼』(1888)', { size: 30, bg: '#fff' }), {});
        }
        break;
      case 22:
        h += pop(t, at(0.2), t + 99, 470, 260, label(0, 0, '두통 · 구토 · 나빠지는 시력', { size: 36, bg: PINK, color: '#fff' }), { rot: -3, bob: 3 });
        if (lt > 0.55 * D) h += pop(t, at(0.55 * D), t + 99, 1380, 300, label(0, 0, '교수직을 내려놓은 뒤 10년', { size: 40, bg: YEL }), { rot: -2, bob: 3 });
        break;
      case 28:
        if (lt > 0.55 * D) h += pop(t, at(0.55 * D), t + 99, 1340, 180, bubble('이 삶을, 똑같이, 영원히!'), { rot: -2, bob: 4 });
        break;
      case 38:
        if (lt > 0.18 * D) h += pop(t, at(0.18 * D), t + 99, 470, 250, label(0, 0, '아프고 · 외롭고 · 안 팔리고', { size: 36, bg: '#C3CDD8' }), { rot: 3, bob: 3 });
        if (lt > 0.45 * D) h += pop(t, at(0.45 * D), t + 99, 760, 380, label(0, 0, '『차라투스트라』 4부 · 자비 출판 40권', { size: 36, bg: YEL }), { rot: -2, bob: 3 });
        break;
      case 39:
        if (lt > 0.35 * D) h += pop(t, at(0.35 * D), t + 99, 1300, 300, label(0, 0, '1889 · 토리노에서 쓰러짐', { size: 38, bg: '#C3CDD8' }), {});
        break;
    }
    return h;
  };
})();
