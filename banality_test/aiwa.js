/* 샘플 그림 레이어: 1961 재판정·도장과 열차는 흑백 기록 영상 질감(필름 그레인·스크래치·깜빡임), 실험실은 그림 배경 위에 기계·사람·계기판(milgramOverlay). */
(function () {
  const SHOT = { 3: 'H1', 4: 'H2', 5: 'H1', 6: 'H3', 7: 'H3', 8: 'H3', 9: 'H3', 10: 'H3' };
  const FILT = { H1: 'grayscale(1) sepia(.25) contrast(1.08)', H2: 'grayscale(.9) sepia(.35)', H3: 'saturate(.55) brightness(.95)' };
  const layer = document.getElementById('ai'), imgs = {};
  window.AI_READY = Promise.all(['H1', 'H2', 'H3'].map(k => new Promise(res => {
    const im = new Image(); im.onload = () => res(k); im.onerror = () => res(k);
    im.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;opacity:0;transform-origin:50% 50%';
    im.src = 'ai/' + k + '.png'; layer.appendChild(im); imgs[k] = im;
  })));
  const shotOf = i => SHOT[TL.lines[i] ? TL.lines[i].i : -1];
  const runOf = i => { const k = shotOf(i); let a = i, b = i; while (a > 0 && shotOf(a - 1) === k) a--; while (b + 1 < TL.lines.length && shotOf(b + 1) === k) b++; return [a, b]; };
  let info = null;
  window.aiFrame = (i, t, L) => {
    for (const k in imgs) { imgs[k].style.opacity = 0; imgs[k].style.zIndex = 0; }
    const k = shotOf(i); info = null; if (!k) return false;
    const [a, b] = runOf(i), t0 = L[a].t0 - 0.15, t1 = b + 1 < L.length ? L[b + 1].t0 - 0.15 : L[b].t1 + 0.6, p = clamp((t - t0) / Math.max(1, t1 - t0), 0, 1);
    const sc = k === 'H3' ? 1.0 + 0.03 * p : 1.03 + 0.08 * p;   // the lab stays almost still (things are drawn on it)
    const flick = k === 'H3' ? 1 : 0.94 + 0.06 * Math.sin(t * 47) * Math.sin(t * 13);
    imgs[k].style.transform = `scale(${sc.toFixed(4)})`; imgs[k].style.filter = FILT[k] + ` brightness(${flick.toFixed(3)})`; imgs[k].style.opacity = 1; imgs[k].style.zIndex = 2;
    info = { k, t0, D: L[i].t1 - L[i].t0 };
    return true;
  };
  window.aiOverlay = (i, t, lt, a) => {
    if (!info) return '';
    let h = '';
    const w = 1 - clamp((t - info.t0) / 0.6, 0, 1);   // dissolve in
    if (info.k !== 'H3') {   // archive film: grain + scratches
      const seed = Math.floor(t * 24) % 50;
      h += `<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="${seed}"/><feColorMatrix type="saturate" values="0"/></filter><rect width="1920" height="1080" filter="url(#grain)" opacity=".13"/>`;
      for (let s = 0; s < 3; s++) { const x = (hash(seed * 3 + s) * 1920) | 0; h += `<path d="M${x} 0 V1080" stroke="#fff" stroke-width="${1 + (s % 2)}" opacity="${(0.15 + hash(seed + s) * 0.2).toFixed(2)}"/>`; }
    } else h += milgramOverlay(t, lt, a, a._dur || 3);
    if (w > 0) h += `<rect width="1920" height="1080" fill="#C9CCD0" opacity="${(w * w).toFixed(3)}"/>`;
    return h;
  };
})();
