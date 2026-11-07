/* AI illustration scenes: the line's scene name maps to ai/<key>.png, shown with a slow push-in (Ken Burns). */
(function () {
  const AIMAP = { nsheep: 'sheep', nmercy: 'mercy', ndog: 'dog', ncamel: 'camel', nlion: 'lion', ndragon: 'dragon', nroar: 'roar', nproud: 'proud', nwindow: 'window', nend: 'window' };
  const PAN = { sheep: [0.6, -0.4], mercy: [-0.6, 0], dog: [0, -0.5], camel: [0.8, 0], lion: [0, -0.6], dragon: [0.7, -0.3], roar: [-0.5, 0], proud: [0, -0.5], window: [0.6, 0] };
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
    let b = i; while (b + 1 < L.length && AIMAP[L[b + 1].scene] === k) b++;
    const t0 = L[a].t0 - 0.15, t1 = b + 1 < L.length ? L[b + 1].t0 - 0.15 : TL.duration;
    let a0 = a; while (a0 > 0 && AIMAP[L[a0 - 1].scene] === k) a0--;
    const T0 = L[a0].t0 - 0.15;
    const p = clamp((t - T0) / Math.max(1, t1 - T0), 0, 1), e = p * p * (3 - 2 * p) * 0.4 + p * 0.6;
    const [dx, dy] = PAN[k] || [0, 0];
    imgs[k].style.transform = `translate(${(dx * 40 * e).toFixed(2)}px, ${(dy * 24 * e).toFixed(2)}px) scale(${(1.0 + 0.12 * e).toFixed(4)})`;
    imgs[k].style.opacity = clamp((t - T0) / 0.5, 0, 1).toFixed(3);
    return true;
  };
  window.aiOverlay = (i, t, lt, a) => {
    const l = TL.lines[i], D = a._dur || 3, A = d => t - lt + d;
    switch (l.scene) {
      case 'nmercy': return a.eq ? pop(t, A(0.2), t + 99, 960, 150, outlined(0, 0, [[['힘', YEL], [' + ', WHITE], ['절제', MINT], [' = 자비', '#FFB26B']]], { size: 96, sw: 18 }), { rot: -2 }) : pop(t, A(0.3), t + 99, 360, 150, label(0, 0, '맹수의 자비', { size: 50, bg: YEL }), { rot: -4 });
      case 'ndog': return pop(t, A(0.4), t + 99, 360, 150, label(0, 0, '물지 못하는 개', { size: 50, bg: '#fff' }), { rot: -4 }) + (lt > 0.6 * D ? fx(t, A(0.6 * D), t + 99, 1500, 260, '노예', RED, { size: 110, burst: 200, rot: 6 }) : '');
      case 'ncamel': return pop(t, A(0.2), t + 99, 360, 150, label(0, 0, '1단계 · 낙타', { size: 50, bg: YEL }), { rot: -4 });
      case 'nlion': return pop(t, A(0.6 * D), t + 99, 360, 150, label(0, 0, '2단계 · 사자', { size: 50, bg: YEL }), { rot: -4 });
      case 'ndragon': { let h = pop(t, A(0.2), t + 99, 420, 150, label(0, 0, '용 = 세상이 요구하는 의무', { size: 46, bg: '#fff' }), { rot: -3 });
        [[1250, 330], [1560, 470], [1380, 640], [1700, 260]].forEach(([x, y], k) => { h += pop(t, A(0.35 * D + k * 0.35), t + 99, x, y, label(0, 0, '너는 해야 한다', { size: 36, bg: GOLD }), { rot: (k % 2 ? 6 : -6), bob: 3 }); }); return h; }
      case 'nroar': return pop(t, A(0.05), t + 99, 1300, 230, outlined(0, 0, ['싫어!'], { size: 210, sw: 30, fill: YEL }), { rot: -5 }) + pop(t, A(0.4), t + 99, 1300, 400, label(0, 0, 'I will not', { size: 54, bg: '#fff' }), { rot: 3 });
      default: return '';
    }
  };
})();
