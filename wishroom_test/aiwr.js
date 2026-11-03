/* ④ 테스트: 방 안은 그림. 흰 빛에서 그림이 떠오르고(1.4초), 천천히 확대. 오른쪽 위 '방에 들어온 지 ○' 배지. */
(function () {
  const layer = document.getElementById('ai'), imgs = {};
  const SHOTS = ['A9'];
  window.AI_READY = Promise.all(SHOTS.map(k => new Promise(res => {
    const im = new Image(); im.onload = () => res(k); im.onerror = () => res(k);
    im.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;opacity:0;transform-origin:50% 50%';
    im.src = 'ai/' + k + '.png'; layer.appendChild(im); imgs[k] = im;
  })));
  const shotOf = i => { const l = TL.lines[i]; return l && l.args && l.args.shot; };
  const runStart = i => { let a = i; while (a > 0 && shotOf(a - 1) === shotOf(i)) a--; return a; };
  window.aiFrame = (i, t, L) => {
    for (const k in imgs) imgs[k].style.opacity = 0;
    const k = shotOf(i); if (!k || !imgs[k]) return false;
    const a = runStart(i), t0 = L[a].t0 - 0.9, p = clamp((t - t0) / 14, 0, 1);
    imgs[k].style.opacity = 1; imgs[k].style.transform = `scale(${(1.0 + 0.09 * p).toFixed(4)})`;
    window.__aiT0 = t0; return true;
  };
  window.aiOverlay = (i, t, lt, a) => {
    const w = 1 - clamp((t - window.__aiT0) / 1.6, 0, 1);
    let h = w > 0 ? `<rect width="1920" height="1080" fill="#FFFDF6" opacity="${(w * w).toFixed(3)}"/>` : '';
    if (a.count) h += pop(t, window.__aiT0 + 1.2, t + 99, 1690, 80, `<rect x="-200" y="-36" width="400" height="72" rx="36" fill="${NAVY}" opacity=".82"/>` +
      T8(0, 13, '방에 들어온 지  ' + a.count, { size: 34, fill: '#fff' }), { inDur: 0.3 });
    return h;
  };
})();
