/* ep.011: story pictures (Nano Banana 2.1) for the cave, the free fall, the resort and the photo studio, with a slow camera;
   facts are drawn on top; spoken lines stay in the subtitles. */
(function () {
  const MAP = { 5: '05', 6: '06', 7: '06', 8: '08', 9: '08', 14: '14', 15: '14', 16: '14', 37: '37', 38: '37', 39: '37', 40: '40', 41: '41', 42: '41' };
  const PAN = { '05': [1, 0], '06': [-1, 0], '08': [0, -1], '14': [0, -1], '37': [1, 0], '40': [-1, 0], '41': [0, 0] };
  const BASE = {};
  const ZOOMOUT = { '05': 1, '37': 1 };
  const layer = document.getElementById('ai');
  const imgs = {};
  window.AI_MAP = MAP;
  const uniq = [...new Set(Object.values(MAP))];
  window.AI_READY = Promise.all(uniq.map(k => new Promise(res => {
    const im = new Image();
    im.onload = () => res(k); im.onerror = () => res(k);
    im.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;object-fit:cover;opacity:0;transform-origin:50% 45%';
    im.src = 'ai/' + k + '.png';
    layer.appendChild(im); imgs[k] = im;
  }))).then(() => Promise.all(Object.values(imgs).map(im => (im.decode ? im.decode().catch(() => 0) : 0)))).then(() => uniq.filter(k => imgs[k].naturalWidth > 0).length);

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
    const [ty, s0] = BASE[k] || [0, 1.02];
    const sc = ZOOMOUT[k] ? 1.13 - 0.10 * e : s0 + 0.07 * e;
    imgs[k].style.transform = `translate(${(dx * 30 * e).toFixed(2)}px, ${(dy * 18 * e + ty).toFixed(2)}px) scale(${sc.toFixed(4)})`;
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

  const head = (txt, o = {}) => outlined(0, 0, txt, Object.assign({ size: 76, sw: 15 }, o));
  const page = (mon, day, o = {}) => `<g><rect x="-110" y="-120" width="220" height="240" rx="14" fill="${INK}" opacity=".3" transform="translate(8 10)"/><rect x="-110" y="-120" width="220" height="240" rx="14" fill="#FFFDF7" stroke="${INK}" stroke-width="7"/><rect x="-110" y="-120" width="220" height="64" rx="14" fill="${o.c || '#E2553A'}" stroke="${INK}" stroke-width="7"/>${T8(0, -74, mon, { size: 40, fill: '#fff' })}${T8(0, 70, day, { size: 110, fill: NAVY })}${o.q ? T8(84, -10, '?', { size: 70, fill: RED }) : ''}${o.x ? `<path d="M-90 -40 L90 100 M90 -40 L-90 100" stroke="${RED}" stroke-width="14" stroke-linecap="round" opacity=".85"/>` : ''}</g>`;
  window.aiOverlay = (i, t, lt, a) => {
    const D = a._dur || 3, at = f => t - lt + f;
    let h = '';
    switch (i) {
      case 5:
        h += pop(t, at(0.05), t + 99, 1240, 110, head([[['1962년 · ', YEL], ['프랑스 알프스', '#fff']]], { size: 64, sw: 13 }), {});
        if (lt > 0.5 * D) h += pop(t, at(0.5 * D), t + 99, 820, 560, label(0, 0, '땅속 130m 동굴', { size: 44, bg: YEL }), { rot: -3 });
        break;
      case 6:
        h += pop(t, at(0.1), t + 99, 1480, 170, label(0, 0, '시계 없음', { size: 44, bg: '#fff' }), { rot: 3 });
        if (lt > 0.18 * D) h += pop(t, at(0.18 * D), t + 99, 1480, 260, label(0, 0, '햇빛 없음', { size: 44, bg: '#fff' }), { rot: -2 });
        if (lt > 0.7 * D) h += pop(t, at(0.7 * D), t + 99, 420, 200, label(0, 0, '두 달', { size: 56, bg: YEL }), { rot: -4 });
        break;
      case 7:
        h += label(1480, 170, '시계 없음', { size: 44, bg: '#fff' }) + label(1480, 260, '햇빛 없음', { size: 44, bg: '#fff' });
        if (lt > 0.55 * D) h += pop(t, at(0.55 * D), t + 99, 600, 300, page('8월', '20', { q: 1, c: '#8A97B0' }), { wobble: 3 });
        break;
      case 8:
        h += pop(t, at(0.05), t + 99, 1380, 150, `<g transform="scale(.72)">${page('8월', '20', { x: 1, c: '#8A97B0' })}</g>`, { rot: -4 });
        if (lt > 0.2 * D) h += pop(t, at(0.2 * D), t + 99, 1700, 150, `<g transform="scale(.72)">${page('9월', '14')}</g>`, { rot: 3 });
        if (lt > 0.5 * D) h += pop(t, at(0.5 * D), t + 99, 1540, 310, label(0, 0, '25일이 사라졌다', { size: 48, bg: YEL }), { wobble: 2 });
        break;
      case 9:
        h += pop(t, at(0.25 * D), t + 99, 1440, 120, head(['시간은 머릿속에서도', [['만들어진다', YEL]]], { size: 64, sw: 13, lh: 80 }), {});
        break;
      case 14:
        if (lt > 0.45 * D) { h += pop(t, at(0.45 * D), t + 99, 0, 0, `<path d="M1600 130 L1600 800" stroke="${YEL}" stroke-width="8" stroke-dasharray="20 14"/><path d="M1570 130 L1630 130 M1570 800 L1630 800" stroke="${YEL}" stroke-width="8" stroke-linecap="round"/>`, { noPop: true }); h += pop(t, at(0.5 * D), t + 99, 1440, 450, label(0, 0, '약 30m', { size: 52, bg: YEL }), { rot: -3 }); }
        break;
      case 15: {
        h += `<path d="M1600 130 L1600 800" stroke="${YEL}" stroke-width="8" stroke-dasharray="20 14"/>` + label(1440, 450, '약 30m', { size: 52, bg: YEL });
        const k1 = prog(lt, 0.25 * D, 0.45 * D), k2 = prog(lt, 0.5 * D, 0.75 * D);
        h += pop(t, at(0.1), t + 99, 0, 0, `<rect x="120" y="110" width="900" height="300" rx="24" fill="#0F1E33" opacity=".82" stroke="${MINT}" stroke-width="4"/>` + T8(150, 170, '떨어진 3초를 기억한 길이', { size: 36, fill: '#fff', anchor: 'start' }), { noPop: true });
        h += T8(150, 250, '남이 떨어질 때', { size: 32, fill: '#C9D2DC', anchor: 'start' }) + `<rect x="410" y="222" width="${f1(400 * k1)}" height="40" rx="10" fill="#8A97B0"/>`;
        h += T8(150, 340, '내가 떨어질 때', { size: 32, fill: YEL, anchor: 'start' }) + `<rect x="410" y="312" width="${f1(544 * k2)}" height="40" rx="10" fill="${YEL}"/>`;
        if (k2 >= 1) h += pop(t, at(0.75 * D), t + 99, 900, 290, label(0, 0, '+36%', { size: 44, bg: RED }), { wobble: 3 });
        break; }
      case 16: {
        h += pop(t, at(0.05), t + 99, 960, 130, head([[['뇌가 ', '#fff'], ['사진을 더 많이', YEL], [' 찍었다', '#fff']]], { size: 66, sw: 13 }), {});
        for (let n = 0; n < 6; n++) { const f = 0.25 + n * 0.08; if (lt > f * D) h += pop(t, at(f * D), t + 99, 260 + (n % 3) * 170, 330 + Math.floor(n / 3) * 150, `<g transform="scale(.8)"><rect x="-60" y="-34" width="120" height="78" rx="14" fill="#3B3F4E" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="5" r="25" fill="#9CC9DE" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="5" r="11" fill="#2A3550"/></g>` + T8(0, 76, '찰칵', { size: 30, fill: '#fff', stroke: INK, sw: 6 }), { rot: (n % 2 ? 6 : -6) }); }
        break; }
      case 37:
        h += pop(t, at(0.1), t + 99, 1350, 140, label(0, 0, '휴양지 손님 41명', { size: 48, bg: YEL }), { rot: 2 });
        break;
      case 38: {
        h += pop(t, at(0.05), t + 99, 0, 0, `<rect x="230" y="90" width="1460" height="330" rx="24" fill="#0F1E33" opacity=".8" stroke="${MINT}" stroke-width="4"/>`, { noPop: true });
        const segs = [['처음', 560, 3, YEL], ['중간', 420, 2, '#9CC9DE'], ['마지막', 300, 1, '#8A97B0']];
        let x = 290;
        segs.forEach(([nm, w, n, c], j) => {
          const f = 0.12 + j * 0.15; if (lt < f * D) { x += w + 20; return; }
          h += pop(t, at(f * D), t + 99, 0, 0, `<rect x="${x}" y="300" width="${w}" height="70" rx="16" fill="${c}" stroke="${INK}" stroke-width="5"/>` + T8(x + w / 2, 348, nm, { size: 38, fill: NAVY }) +
            [...Array(n)].map((_, m) => `<g transform="translate(${x + w / 2 + (m - (n - 1) / 2) * 110} 200) rotate(${(m - 1) * 6}) scale(.55)"><rect x="-90" y="-106" width="180" height="214" rx="6" fill="#FFFDF7" stroke="${INK}" stroke-width="6"/><rect x="-75" y="-91" width="150" height="150" fill="#7FC8E8"/><circle cx="30" cy="-50" r="18" fill="#FFF3B0"/><rect x="-75" y="20" width="150" height="39" fill="#F4E2B8"/></g>`).join(''), { noPop: true, inDur: 0.3 });
          x += w + 20;
        });
        if (lt > 0.62 * D) h += pop(t, at(0.62 * D), t + 99, 570, 470, label(0, 0, '가장 길게 기억', { size: 40, bg: YEL }), { rot: -2 });
        if (lt > 0.72 * D) h += pop(t, at(0.72 * D), t + 99, 1530, 470, label(0, 0, '가장 짧게', { size: 40, bg: '#fff' }), { rot: 2 });
        break; }
      case 39:
        h += pop(t, at(0.1), t + 99, 960, 140, head([[['휴가 마지막 날 = ', '#fff'], ['순삭', YEL]]], { size: 80, sw: 15 }), {});
        break;
      case 40:
        h += pop(t, at(0.05), t + 99, 330, 110, `<rect x="-230" y="-44" width="460" height="88" rx="44" fill="${NAVY}" opacity=".88" stroke="${YEL}" stroke-width="5"/>` + T8(0, 16, '토요일 · 할아버지와 처음', { size: 38, fill: YEL }), { noPop: true });
        break;
      case 41:
        h += pop(t, at(0.3 * D), t + 99, 960, 110, label(0, 0, '둘이 찍는 첫 사진', { size: 50, bg: YEL }), { rot: -2 });
        break;
      case 42: {
        h += label(960, 110, '둘이 찍는 첫 사진', { size: 50, bg: YEL });
        const fk = prog(lt, 0.05, 0.6);
        if (fk > 0 && fk < 1) h += `<rect width="1920" height="1080" fill="#fff" opacity="${f1(Math.sin(fk * Math.PI) * 85) / 100}"/>` + flashBurst(1700, 330, fk);
        if (lt > 0.35) h += pop(t, at(0.35), t + 99, 1460, 300, outlined(0, 0, ['찰칵!'], { size: 90, sw: 16, fill: YEL }), { wobble: 4 });
        break; }
    }
    return h;
  };
})();
