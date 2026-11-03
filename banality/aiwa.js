/* 본편 그림 레이어.
   역사(1961 재판정·열차·녹음기·철도 사무원)는 흑백 기록 영상 질감, 실험실(H3)은 그림 위에 기계·사람·계기판(milgramOverlay),
   현대(출근 행렬·참사의 물건·지하철)는 색을 덜어 낸 톤. 아이히만 대사엔 '재연' 표시. */
(function () {
  const SHOT = {};
  const put = (a, b, k) => { for (let i = a; i <= b; i++) SHOT[i] = k; };
  put(5, 5, 'H1'); put(6, 6, 'H2'); put(7, 8, 'H1'); put(12, 13, 'H4'); put(14, 16, 'H2'); put(17, 17, 'H4'); put(18, 18, 'H2'); put(19, 19, 'H7'); put(20, 20, 'H8');
  put(22, 23, 'H9'); put(24, 31, 'H3'); put(32, 32, 'H9'); put(33, 33, 'H10'); put(34, 34, 'H3'); put(40, 40, 'H11'); put(44, 44, 'H13'); put(45, 45, 'H11'); put(58, 63, 'H14');
  const ARCH = { H1: 1, H2: 1, H4: 1, H7: 1, H8: 1 };
  const FILT = { H1: 'grayscale(1) sepia(.25) contrast(1.08)', H2: 'grayscale(.9) sepia(.35)', H4: 'grayscale(1) sepia(.2)', H7: 'grayscale(.85) sepia(.4)', H8: 'grayscale(.95) sepia(.3)',
    H3: 'saturate(.55) brightness(.95)', H9: 'saturate(.6) sepia(.2)', H10: 'saturate(.55)', H11: 'saturate(.35)', H13: 'saturate(.45) brightness(1.02)', H14: 'saturate(1)' };
  const KEYS = [...new Set(Object.values(SHOT))];
  const layer = document.getElementById('ai'), imgs = {};
  window.AI_READY = Promise.all(KEYS.map(k => new Promise(res => {
    const im = new Image(); im.onload = () => res(k); im.onerror = () => res(k);
    im.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;opacity:0;transform-origin:50% 50%';
    im.src = 'ai/' + k + '.png'; layer.appendChild(im); imgs[k] = im;
  })));
  const shotOf = i => SHOT[TL.lines[i] ? TL.lines[i].i : -1];
  const runOf = i => { const k = shotOf(i); let a = i, b = i; while (a > 0 && shotOf(a - 1) === k) a--; while (b + 1 < TL.lines.length && shotOf(b + 1) === k) b++; return [a, b]; };
  let info = null;
  window.aiFrame = (i, t, L) => {
    for (const k in imgs) { imgs[k].style.opacity = 0; imgs[k].style.zIndex = 0; }
    const k = shotOf(i); info = null; if (!k || !imgs[k]) return false;
    const [a, b] = runOf(i), t0 = L[a].t0 - 0.15, t1 = b + 1 < L.length ? L[b + 1].t0 - 0.15 : L[b].t1 + 0.6, p = clamp((t - t0) / Math.max(1, t1 - t0), 0, 1);
    const sc = k === 'H3' ? 1.0 + 0.02 * p : 1.03 + 0.08 * p;
    const flick = ARCH[k] ? 0.94 + 0.06 * Math.sin(t * 47) * Math.sin(t * 13) : 1;
    imgs[k].style.transform = `scale(${sc.toFixed(4)})`; imgs[k].style.filter = FILT[k] + ` brightness(${flick.toFixed(3)})`; imgs[k].style.opacity = 1; imgs[k].style.zIndex = 2;
    const pk = a > 0 ? shotOf(a - 1) : null;
    info = { k, t0, first: !pk, src: L[i].i };
    return true;
  };
  function dots(t, lt) {   // 40 people, 26 of them went to 450 V
    let h = `<g transform="translate(960 470)"><rect x="-470" y="-250" width="940" height="470" rx="30" fill="#14161E" opacity=".88"/>`;
    for (let n = 0; n < 40; n++) { const c = n % 10, r = Math.floor(n / 10), on = n < 26 && lt > 0.4 + n * 0.05;
      h += `<g transform="translate(${-360 + c * 80} ${-150 + r * 90})"><circle r="26" fill="${on ? '#FF5A4A' : '#5A6070'}"/><rect x="-18" y="26" width="36" height="34" rx="10" fill="${on ? '#FF5A4A' : '#5A6070'}"/></g>`; }
    return h + T8(0, 200, '40명 중 26명 · 65%', { size: 52, fill: '#FFD27A' }) + '</g>';
  }
  window.aiOverlay = (i, t, lt, a) => {
    if (!info) return '';
    let h = '';
    const src = info.src;
    if (ARCH[info.k]) {
      const seed = Math.floor(t * 24) % 50;
      h += `<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="${seed}"/><feColorMatrix type="saturate" values="0"/></filter><rect width="1920" height="1080" filter="url(#grain)" opacity=".13"/>`;
      for (let s = 0; s < 3; s++) { const x = (hash(seed * 3 + s) * 1920) | 0; h += `<path d="M${x} 0 V1080" stroke="#fff" stroke-width="${1 + (s % 2)}" opacity="${(0.15 + hash(seed + s) * 0.2).toFixed(2)}"/>`; }
    }
    if (info.k === 'H3') {
      const aa = Object.assign({}, a);
      if (src === 31 || src === 34) aa.volt = 450;
      if (src === 34) aa.k = 5;
      h += milgramOverlay(t, lt, aa, a._dur || 3);
      if (src === 31) h += dots(t, lt);
    }
    if (src === 8) h += pop(t, t - lt + 0.1, t + 99, 1720, 90, label(0, 0, '재연 · 법정 변론의 요지', { size: 30, bg: '#E8E2D0' }), { rot: 0 });
    if (src === 16) h += pop(t, t - lt + 0.3, t + 99, 960, 300, outlined(0, 0, [[['악의 ', '#fff'], ['평범성', '#FFD27A']]], { size: 110, sw: 18 }), { inDur: 0.35 });
    if (src === 17) h += pop(t, t - lt + fracOf13(t, '생각의 부재') * (a._dur || 3), t + 99, 960, 260, outlined(0, 0, [[['생각의 부재', '#FFD27A']]], { size: 96, sw: 16 }), { inDur: 0.3 });
    if (src === 19) h += pop(t, t - lt + 0.3, t + 99, 1500, 200, label(0, 0, '1957~ 아르헨티나 · 사센 녹음', { size: 30, bg: '#E8E2D0' }), {});
    if (src === 32) h += ['우체국 직원', '교사', '영업사원'].map((s, j) => pop(t, t - lt + fracOf13(t, s) * (a._dur || 3), t + 99, 520 + j * 440, 230, label(0, 0, s, { size: 40, bg: '#FFE29A' }), { rot: (j - 1) * 3 })).join('');
    if (src === 33) h += pop(t, t - lt + 0.3, t + 99, 960, 200, label(0, 0, '학생 역할 = 배우 · 실제 전기 없음', { size: 40, bg: '#CDEBD9' }), {});
    if (src === 62) h += pop(t, t - lt + 0.2, t + 99, 960, 230, outlined(0, 0, [[['부품', '#9AA3B2'], [' 이었나요, ', '#fff'], ['사람', '#F28C38'], [' 이었나요?', '#fff']]], { size: 74, sw: 15 }), {});
    if (src === 63) h += pop(t, t - lt + 0.2, t + 99, 960, 230, outlined(0, 0, [[['다음 이야기에서', '#fff']], [['만나요', '#F28C38']]], { size: 92, sw: 18 }), {});
    if (info.first || (lt < 0.6 && i > 0 && !shotOf(i - 1))) { const w = 1 - clamp(lt / 0.6, 0, 1); if (w > 0) h += `<rect width="1920" height="1080" fill="#C9CCD0" opacity="${(w * w).toFixed(3)}"/>`; }
    return h;
  };
})();
