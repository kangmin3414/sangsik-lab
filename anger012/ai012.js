/* ep.012: story pictures (Nano Banana 2.1) for the birthday dinner, Seneca's study, the ER corridor and the hospital bench,
   with a slow camera; small labels on top; spoken lines stay in the subtitles. */
(function () {
  const MAP = { 3: '01', 6: '01', 28: '02', 29: '02', 54: '03', 56: '04', 57: '04' };
  const PAN = { '01': [1, 0], '02': [-1, 0], '03': [0, -1], '04': [0, 0] };
  const ZOOMOUT = { '04': 1 };
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
  const runOf = (i, L) => { const k = MAP[i]; let a = i, b = i; while (a > 0 && MAP[a - 1] === k) a--; while (b + 1 < L.length && MAP[b + 1] === k) b++; return [a, b]; };
  const place = (k, t, t0, t1) => {
    const p = Math.min(1, Math.max(0, (t - t0) / Math.max(1, t1 - t0)));
    const e = p * p * (3 - 2 * p) * 0.5 + p * 0.5;
    const [dx, dy] = PAN[k] || [0, 0];
    const sc = ZOOMOUT[k] ? 1.12 - 0.10 * e : 1.02 + 0.07 * e;
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
  const pill = (txt) => `<rect x="-300" y="-44" width="600" height="88" rx="44" fill="${NAVY}" opacity=".88" stroke="${YEL}" stroke-width="5"/>` + T8(0, 16, txt, { size: 38, fill: YEL });
  window.aiOverlay = (i, t, lt, a) => {
    const D = a._dur || 3, at = f => t - lt + f;
    let h = '';
    switch (i) {
      case 3:
        h += pop(t, at(0.1), t + 99, 360, 110, pill('금요일 저녁 · 제로의 생일'), { noPop: true });
        if (lt > 0.55 * D) h += pop(t, at(0.55 * D), t + 99, 1360, 560, label(0, 0, '도윤 자리', { size: 36, bg: '#fff' }), { rot: 3 });
        break;
      case 6: {
        const dk = Math.min(1, lt / D);
        h += `<rect width="1920" height="1080" fill="#0B1020" opacity="${(0.05 + 0.3 * dk).toFixed(2)}"/>`;
        h += pop(t, at(0.1), t + 99, 1500, 160, `<circle r="70" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M0 0 L0 -44 M0 0 L${(30 * Math.cos(dk * 4)).toFixed(1)} ${(30 * Math.sin(dk * 4)).toFixed(1)}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`, {});
        h += pop(t, at(0.3), t + 99, 1500, 280, label(0, 0, '40분 뒤', { size: 44, bg: YEL }), { rot: -3 });
        break; }
      case 28:
        h += pop(t, at(0.2), t + 99, 1460, 120, outlined(0, 0, [[['로마의 철학자 · ', '#fff'], ['세네카', YEL]]], { size: 60, sw: 13 }), {});
        break;
      case 29:
        h += outlined(1460, 120, [[['로마의 철학자 · ', '#fff'], ['세네카', YEL]]], { size: 60, sw: 13 });
        h += pop(t, at(0.15), t + 99, 1500, 300, `<rect x="-300" y="-70" width="600" height="140" rx="20" fill="#FFFDF7" stroke="${INK}" stroke-width="6"/>` + T8(0, -12, '형의 질문', { size: 30, fill: '#8A6A44' }) + T8(0, 40, '"화는 어떻게 달래나요?"', { size: 40, fill: NAVY }), { rot: 2 });
        if (lt > 0.72 * D) h += pop(t, at(0.72 * D), t + 99, 1500, 480, label(0, 0, '『분노에 관하여』', { size: 48, bg: YEL }), { rot: -2, wobble: 2 });
        break;
      case 54: {
        h += `<rect width="1920" height="1080" fill="#0A1A2A" opacity=".28"/>`;
        h += pop(t, at(0.1), t + 99, 420, 120, label(0, 0, '만약 그 장문을 보냈다면…', { size: 44, bg: '#fff' }), { rot: -2 });
        const kk = Math.min(1, Math.max(0, (lt - 0.4 * D) / 0.5));
        if (kk > 0) {
          h += `<g opacity="${kk.toFixed(2)}"><path d="M1230 620 Q1300 470 1420 400" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="10 10"/>`;
          h += `<g transform="translate(1640 300) rotate(3)"><rect x="-250" y="-130" width="500" height="260" rx="24" fill="#FFE36E" stroke="${RED}" stroke-width="6"/>` + LONG12.map((l, j) => T8(-220, -70 + j * 52, l, { anchor: 'start', size: 34, fill: '#B3261E' })).join('') + `</g></g>`;
        }
        break; }
      case 56:
        h += pop(t, at(0.1), t + 99, 360, 110, pill('며칠 뒤 · 병원 앞 벤치'), { noPop: true });
        break;
      case 57:
        for (let n = 0; n < 4; n++) { const an = t * 1.2 + n * 1.57; h += `<g transform="translate(${(1010 + Math.cos(an) * 90).toFixed(1)} ${(640 + Math.sin(an) * 60).toFixed(1)}) scale(${(0.5 + 0.2 * Math.sin(t * 4 + n)).toFixed(2)})"><path d="M0 -30 L8 -8 L30 0 L8 8 L0 30 L-8 8 L-30 0 L-8 -8 Z" fill="${YEL}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>`; }
        break;
    }
    return h;
  };
})();
