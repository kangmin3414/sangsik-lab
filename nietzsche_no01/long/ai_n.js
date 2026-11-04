/* AI illustration scenes: the line's scene name maps to ai/<key>.png, shown with a slow push-in (Ken Burns). */
(function () {
  const AIMAP = { nsheep: 'sheep' };
  const PAN = { sheep: [0.6, -0.4] };
  const layer = document.getElementById('ai'), imgs = {};
  const uniq = [...new Set(Object.values(AIMAP))];
  window.AI_READY = Promise.all(uniq.map(k => new Promise(res => {
    const im = new Image();
    im.onload = () => res(k); im.onerror = () => res(k);
    im.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;object-fit:cover;opacity:0;transform-origin:62% 48%';
    im.src = 'ai/' + k + '.png'; layer.appendChild(im); imgs[k] = im;
  }))).then(() => Promise.all(Object.values(imgs).map(im => (im.decode ? im.decode().catch(() => 0) : 0))));
  window.aiFrame = (i, t, L) => {
    for (const k in imgs) imgs[k].style.opacity = 0;
    const l = L[i], k = l && AIMAP[l.scene];
    if (!k) return false;
    let a = i; while (a > 0 && L[a - 1].scene === l.scene) a--;
    const t0 = L[a].t0 - 0.15, t1 = (TL.duration || t0 + 8);
    const p = clamp((t - t0) / Math.max(1, t1 - t0), 0, 1), e = p * p * (3 - 2 * p) * 0.4 + p * 0.6;
    const [dx, dy] = PAN[k] || [0, 0];
    imgs[k].style.transform = `translate(${(dx * 40 * e).toFixed(2)}px, ${(dy * 24 * e).toFixed(2)}px) scale(${(1.0 + 0.12 * e).toFixed(4)})`;
    imgs[k].style.opacity = clamp((t - t0) / 0.7, 0, 1).toFixed(3);
    return true;
  };
  window.aiOverlay = () => '';
})();
