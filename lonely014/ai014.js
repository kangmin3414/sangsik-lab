/* ep.014: story pictures (Nano Banana 2.1) — the empty Berlin lecture hall, the porcupines in the snow, Frankfurt with the poodle,
   the 1831 letter by candlelight, and Zero and Seojun by the river; small labels on top (screen coordinates). */
(function () {
  const MAP = { 16: '01', 17: '01', 19: '03', 27: '02', 62: '04', 63: '04', 64: '04', 68: '05', 69: '05', 70: '05' };
  const PAN = { '01': [1, 0], '02': [0, -1], '03': [-1, 0], '04': [0, 0], '05': [1, 0] };
  const ZOOMIN = { '04': 1 };
  const layer = document.getElementById('ai');
  const imgs = {};
  window.AI_MAP = MAP;
  const uniq = [...new Set(Object.values(MAP))];
  window.AI_READY = Promise.all(uniq.map(k => new Promise(res => {
    const im = new Image();
    im.onload = () => res(k); im.onerror = () => res(k);
    im.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;object-fit:cover;opacity:0;transform-origin:' + (k === '04' ? '62% 52%' : '50% 45%');
    im.src = 'ai/' + k + '.png';
    layer.appendChild(im); imgs[k] = im;
  }))).then(() => Promise.all(Object.values(imgs).map(im => (im.decode ? im.decode().catch(() => 0) : 0)))).then(() => uniq.filter(k => imgs[k].naturalWidth > 0).length);
  const runOf = (i, L) => { const k = MAP[i]; let a = i, b = i; while (a > 0 && MAP[a - 1] === k) a--; while (b + 1 < L.length && MAP[b + 1] === k) b++; return [a, b]; };
  const place = (k, t, t0, t1) => {
    const p = Math.min(1, Math.max(0, (t - t0) / Math.max(1, t1 - t0)));
    const e = p * p * (3 - 2 * p) * 0.5 + p * 0.5;
    const [dx, dy] = PAN[k] || [0, 0];
    const sc = ZOOMIN[k] ? 1.02 + 0.16 * e : 1.02 + 0.07 * e;
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
    return true;
  };
  const pill = (txt, w = 620) => `<rect x="${-w / 2}" y="-44" width="${w}" height="88" rx="44" fill="${NAVY}" opacity=".88" stroke="${YEL}" stroke-width="5"/>` + T8(0, 16, txt, { size: 38, fill: YEL });
  const fr = (t, ph) => fracOf13(t, ph);
  const hogMini = (x, y, s, t, flip) => hog14(x, y, s, t, { flip, ex: 'happy' });
  window.aiOverlay = (i, t, lt, a) => {
    const D = a._dur || 3, at = f => t - lt + f, L = TL.lines;
    let h = '';
    switch (i) {
      case 16:
        h += pop(t, at(0.1), t + 99, 380, 110, pill('베를린대학 · 1820년'), { noPop: true });
        h += pop(t, at(fr(t, '헤겔') * D), t + 99, 1380, 220, label(0, 0, '같은 시간, 헤겔의 강의', { size: 38, bg: '#fff' }), { rot: 2 });
        break;
      case 17: {
        h += `<g transform="translate(380 110)">${pill('베를린대학 · 1820년')}</g>`;
        const n = Math.min(5, Math.floor(Math.max(0, lt - 0.5) / 0.32) + (lt > 0.5 ? 1 : 0));
        h += pop(t, at(0.4), t + 99, 1560, 300, `<circle r="120" fill="${YEL}" stroke="${INK}" stroke-width="8"/>` + T8(0, -16, '학생', { size: 40, fill: NAVY }) + T8(0, 54, `${n}명`, { size: 72, fill: NAVY }), { rot: -4, wobble: n >= 5 ? 1.5 : 0 });
        break; }
      case 19:
        h += pop(t, at(0.1), t + 99, 420, 110, pill('프랑크푸르트 · 1833~1860', 700), { noPop: true });
        h += pop(t, at(fr(t, '푸들') * D), t + 99, 820, 600, label(0, 0, '반려견 푸들', { size: 36, bg: '#fff' }), { rot: 3, bob: 2 });
        break;
      case 27:
        h += pop(t, at(0.1), t + 99, 600, 520, label(0, 0, '너무 가까우면: 찔림', { size: 36, bg: '#FFB0A0' }), { rot: -3 });
        h += pop(t, at(Math.max(0.5, fr(t, '예의') * D)), t + 99, 1390, 470, label(0, 0, '이 거리 = 예의', { size: 50, bg: YEL }), { rot: 2, bob: 3 });
        break;
      case 62:
        h += pop(t, at(0.1), t + 99, 330, 110, pill('1831년', 380), { noPop: true });
        h += pop(t, at(fr(t, '17년') * D), t + 99, 1290, 160, label(0, 0, '어머니를 못 본 지 17년', { size: 38, bg: '#fff' }), { rot: 2 });
        h += pop(t, at(fr(t, '책은') * D), t + 99, 1580, 560, label(0, 0, '팔리지 않는 책', { size: 34, bg: '#E9D7B4' }), { rot: -3 });
        h += pop(t, at(fr(t, '몸도') * D), t + 99, 560, 400, label(0, 0, '아픈 몸', { size: 34, bg: '#E9D7B4' }), { rot: 3 });
        break;
      case 63: {
        h += `<g transform="translate(330 110)">${pill('1831년', 380)}</g>`;
        const k = Math.min(1, Math.max(0, (lt - 0.3) / 0.6));
        if (k > 0) h += `<g transform="translate(560 560) rotate(-4) scale(${(0.6 + 0.4 * easeOutBack(k)).toFixed(3)})" opacity="${k.toFixed(2)}"><rect x="-230" y="-170" width="460" height="320" rx="10" fill="#F6E7C8" stroke="${INK}" stroke-width="6"/>` +
          hand13(-190, -96, '어머니께,', { size: 60, fill: '#4A3424' }) + [0, 1, 2].map(j => `<path d="M-190 ${-20 + j * 56} q40 -14 80 0 t80 0 t80 0 t80 0" fill="none" stroke="#8A6A44" stroke-width="5" stroke-linecap="round" opacity=".7"/>`).join('') + `</g>`;
        h += pop(t, at(0.45 * D), t + 99, 1250, 180, label(0, 0, '먼저 편지를 쓴 건, 아들', { size: 40, bg: YEL }), { rot: -2 });
        break; }
      case 64: {
        const g = Math.min(1, lt / Math.max(1, D));
        h += `<ellipse cx="1150" cy="560" rx="${(380 + 260 * g).toFixed(0)}" ry="${(260 + 160 * g).toFixed(0)}" fill="url(#warm)" opacity="${(0.25 + 0.45 * g).toFixed(2)}"/>`;
        break; }
      case 68:
        h += pop(t, at(0.1), t + 99, 420, 110, pill('일요일 저녁 · 강변', 560), { noPop: true });
        h += pop(t, at(fr(t, '3년') * D), t + 99, 1420, 260, label(0, 0, '3년의 거리를, 천천히', { size: 38, bg: '#fff' }), { rot: 2 });
        break;
      case 70: {
        const k = Math.min(1, Math.max(0, (lt - 0.3) / Math.max(1, D - 1)));
        const ee = k * k * (3 - 2 * k), d = 260 - 100 * ee;
        h += `<ellipse cx="1600" cy="700" rx="${(120 + 120 * ee).toFixed(0)}" ry="${(70 + 60 * ee).toFixed(0)}" fill="url(#warm)" opacity="${(0.3 + 0.6 * ee).toFixed(2)}"/>`;
        h += hogMini(1600 - d / 2, 760, 0.36, t, false) + hogMini(1600 + d / 2, 760, 0.36, t, true);
        break; }
    }
    return h;
  };
})();
