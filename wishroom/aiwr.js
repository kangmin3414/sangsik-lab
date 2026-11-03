/* 소원이 다 이루어지는 방 — picture layer.
   Room years (lines 19~52): pictures that slowly lose their colour (saturate/brightness by the year), entering from white.
   Same morning → colour comes back (line 72 on): the real world is painted for the first time, warm and vivid.
   Lines without a picture (현실 1막, 1,000년째 흰 공간, 같은 아침의 쪽지) are drawn by sceneswr.js. */
(function () {
  const SHOT = {};
  const put = (a, b, k) => { for (let i = a; i <= b; i++) SHOT[i] = k; };
  put(19, 22, 'A9'); put(23, 26, 'A10'); put(27, 30, 'B1'); put(31, 33, 'B2'); put(34, 36, 'B3'); put(37, 39, 'B4'); put(40, 42, 'B5');
  put(43, 46, 'B6'); put(47, 48, 'B7'); put(49, 52, 'B8'); put(72, 72, 'C1'); put(73, 74, 'C2'); put(75, 75, 'C3'); put(76, 76, 'C4'); put(77, 77, 'C3');
  put(78, 83, 'C5'); put(84, 86, 'C6'); put(87, 87, 'C5');
  // colour drain by year: [saturate, brightness]
  const DRAIN = { '1일': [1, 1], '10년': [1, 1], '50년': [0.9, 1.02], '100년': [0.75, 1.05], '200년': [0.62, 1.07], '300년': [0.5, 1.09], '500년': [0.36, 1.12], '700년': [0.22, 1.16] };
  const KB = { A9: [1, 0, 1], A10: [0, -1, 1], B1: [0, 0, 1], B2: [0, 0, -1], B3: [0, 0, 1], B4: [0, 1, 1], B5: [0, 0, -1], B6: [0, 0, 1], B7: [0, 0, 1], B8: [1, 0, 1],
    C1: [0, 0, 1], C2: [0, 0, 1], C3: [1, 0, 1], C4: [0, 0, 1], C5: [0, 0, 1], C6: [0, 0, -1] };
  const KEYS = [...new Set(Object.values(SHOT))];
  const layer = document.getElementById('ai'), imgs = {};
  window.AI_READY = Promise.all(KEYS.map(k => new Promise(res => {
    const im = new Image(); im.onload = () => res(k); im.onerror = () => res(k);
    im.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;opacity:0;transform-origin:50% 48%';
    im.src = 'ai/' + k + '.png'; layer.appendChild(im); imgs[k] = im;
  })));
  const shotOf = i => SHOT[TL.lines[i] ? TL.lines[i].i : -1];
  const runOf = i => { const k = shotOf(i), L = TL.lines; let a = i, b = i; while (a > 0 && shotOf(a - 1) === k) a--; while (b + 1 < L.length && shotOf(b + 1) === k) b++; return [a, b]; };
  const filt = (i, t) => {
    const l = TL.lines[i], c = l && l.args && l.args.count, src = l ? l.i : -1;
    if (src === 72) { const p = clamp((t - (l.t0 - 0.15)) / 2.6, 0, 1); return `saturate(${(0.45 + 0.55 * p).toFixed(3)}) brightness(${(0.96 + 0.04 * p).toFixed(3)})`; }   // colour floods back
    if (src > 72) return 'saturate(1.08)';
    const d = DRAIN[c] || [1, 1]; return `saturate(${d[0]}) brightness(${d[1]})`;
  };
  const place = (k, t, t0, t1) => {
    const p = clamp((t - t0) / Math.max(1, t1 - t0), 0, 1), e = p * p * (3 - 2 * p) * 0.5 + p * 0.5;
    const [dx, dy, z] = KB[k] || [0, 0, 1], sc = z < 0 ? 1.12 - 0.09 * e : 1.03 + 0.08 * e;
    imgs[k].style.transform = `translate(${(dx * 34 * (e - 0.5)).toFixed(2)}px, ${(dy * 22 * (e - 0.5)).toFixed(2)}px) scale(${sc.toFixed(4)})`;
  };
  let info = null;
  window.aiFrame = (i, t, L) => {
    for (const kk in imgs) { imgs[kk].style.opacity = 0; imgs[kk].style.zIndex = 0; }
    const k = shotOf(i); info = null; if (!k || !imgs[k]) return false;
    const [a, b] = runOf(i), t0 = L[a].t0 - 0.15, t1 = b + 1 < L.length ? L[b + 1].t0 - 0.15 : L[b].t1 + 0.6;
    place(k, t, t0, t1); imgs[k].style.zIndex = 2; imgs[k].style.filter = filt(i, t);
    const pk = a > 0 ? shotOf(a - 1) : null, fade = clamp((t - t0) / 0.7, 0, 1);
    if (pk && imgs[pk] && fade < 1) { const [pa] = runOf(a - 1); place(pk, t, L[pa].t0 - 0.15, t0 + 0.7); imgs[pk].style.zIndex = 1; imgs[pk].style.opacity = 1; imgs[pk].style.filter = filt(a - 1, t); imgs[k].style.opacity = fade.toFixed(3); }
    else imgs[k].style.opacity = 1;
    info = { k, t0, first: !pk, src: L[a].i };
    return true;
  };
  window.aiOverlay = (i, t, lt, a) => {
    let h = '';
    if (info && info.src === 19) { const w = 1 - clamp((t - (info.t0 - 0.75)) / 1.6, 0, 1); if (w > 0) h += `<rect width="1920" height="1080" fill="#FFFDF6" opacity="${(w * w).toFixed(3)}"/>`; }   // out of the white light of the door
    if (info && info.src === 72) { const w = 1 - clamp((t - info.t0) / 0.9, 0, 1); if (w > 0) h += `<rect width="1920" height="1080" fill="#FFF3D6" opacity="${(0.5 * w).toFixed(3)}"/>`; }
    const src = TL.lines[i] && TL.lines[i].i;
    if (src === 42) h += pop(t, t - lt + 0.1, t + 99, 430, 300, `<circle r="170" fill="#FFF8E8" stroke="${INK}" stroke-width="5" opacity=".92"/>` + `<g transform="scale(.42) translate(-960 -560)">${goBoardWR(960, 640, 1.2, 0, t)}</g>`, { inDur: 0.4 });   // the memory: the doctor's baduk board
    if (src === 86) h += pop(t, t - lt + 0.2, t + 99, 960, 220, outlined(0, 0, [[['모든 소원이 이루어지는 방', '#fff']], [['vs 오늘 이 하루', YEL]]], { size: 72, sw: 15, lh: 96 }), {});
    if (src === 87) h += pop(t, t - lt + 0.2, t + 99, 960, 220, outlined(0, 0, [[['다음 이야기에서', '#fff']], [['만나요', YEL]]], { size: 92, sw: 18 }), {});
    return h;
  };
})();
