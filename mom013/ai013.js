/* ep.013: story pictures (Nano Banana 2.1) — the surgery waiting room, Epicurus' garden, the 1998 room (sepia),
   the notebook handed over in the ward, and the last night by the window; small labels on top, the constellation drawn over the window. */
(function () {
  const MAP = { 26: '01', 27: '01', 28: '01', 42: '03', 43: '03', 44: '03', 50: '02', 53: '05', 54: '05', 55: '06', 56: '06', 57: '04', 58: '04', 59: '04' };
  const PAN = { '01': [0, -1], '02': [1, 0], '03': [-1, 0], '04': [0, 1], '05': [1, 0], '06': [-1, 0] };
  const ZOOMOUT = { '04': 1 };
  const FILTER = { '02': 'sepia(.45) saturate(.85) brightness(.96)' };
  const layer = document.getElementById('ai');
  const imgs = {};
  window.AI_MAP = MAP;
  const uniq = [...new Set(Object.values(MAP))];
  window.AI_READY = Promise.all(uniq.map(k => new Promise(res => {
    const im = new Image();
    im.onload = () => res(k); im.onerror = () => res(k);
    im.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;object-fit:cover;opacity:0;transform-origin:50% 45%' + (FILTER[k] ? ';filter:' + FILTER[k] : '');
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
  const pill = (txt) => `<rect x="-310" y="-44" width="620" height="88" rx="44" fill="${NAVY}" opacity=".88" stroke="${YEL}" stroke-width="5"/>` + T8(0, 16, txt, { size: 38, fill: YEL });
  const quote = (lines, src) => `<rect x="-560" y="-150" width="1120" height="${130 + lines.length * 74}" rx="26" fill="#FFFDF4" opacity=".95" stroke="${INK}" stroke-width="7"/>` +
    lines.map((l, j) => T8(0, -64 + j * 74, l, { size: 50, fill: NAVY })).join('') + T8(500, -64 + lines.length * 74 + 4, src, { anchor: 'end', size: 28, fill: '#8A6A44', w: 700 });
  const lineIdx = t => { const L = TL.lines; let i = 0; while (i + 1 < L.length && t >= L[i + 1].t0 - 0.15) i++; return i; };
  window.aiOverlay = (i, t, lt, a) => {
    const D = a._dur || 3, at = f => t - lt + f, L = TL.lines;
    let h = '';
    switch (i) {
      case 26: case 27: case 28: {
        if (i === 26) h += pop(t, at(0.1), t + 99, 380, 110, pill('수요일 · 수술 대기실'), { noPop: true });
        else h += `<g transform="translate(380 110)">${pill('수요일 · 수술 대기실')}</g>`;
        const r0 = L[26].t0, r1 = L[28].t0, hrs = Math.min(6, Math.max(0, (t - r0) / Math.max(1, r1 - r0) * 6));
        const dk = i === 28 ? Math.min(1, Math.max(0, (lt - 0.15 * D) / 0.8)) : 0;
        h += `<g transform="translate(380 250)"><rect x="-150" y="-62" width="300" height="124" rx="22" fill="${NAVY}" opacity=".85" stroke="${MINT}" stroke-width="4"/>` + T8(0, -12, '기다린 시간', { size: 28, fill: MINT, w: 700 }) + T8(0, 44, `${Math.floor(hrs)}시간`, { size: 52, fill: '#fff' }) + `</g>`;
        if (i === 28) {
          h += `<rect width="1920" height="1080" fill="#FFF6D8" opacity="${(0.32 * dk * (1 - 0.6 * Math.min(1, Math.max(0, lt - 0.15 * D - 0.8)))).toFixed(2)}"/>`;
          h += `<ellipse cx="1650" cy="560" rx="${(300 * dk).toFixed(0)}" ry="${(420 * dk).toFixed(0)}" fill="url(#warm)" opacity="${(0.9 * dk).toFixed(2)}"/>`;
          if (lt > 0.45 * D) h += pop(t, at(0.45 * D), t + 99, 960, 300, label(0, 0, '"수술이 잘 끝났습니다"', { size: 50, bg: YEL }), { rot: -2, bob: 3 });
        }
        break; }
      case 42:
        h += pop(t, at(0.2), t + 99, 1450, 120, outlined(0, 0, [[['그리스의 철학자 · ', '#fff'], ['에피쿠로스', YEL]]], { size: 58, sw: 13 }), {});
        if (lt > 0.55 * D) h += pop(t, at(0.55 * D), t + 99, 1500, 260, label(0, 0, '소박한 정원, 친구들과 한 끼', { size: 36, bg: '#fff' }), { rot: 2 });
        break;
      case 43:
        h += outlined(1450, 120, [[['그리스의 철학자 · ', '#fff'], ['에피쿠로스', YEL]]], { size: 58, sw: 13 });
        h += pop(t, at(0.15), t + 99, 960, 330, quote(['갖지 못한 것을 바라느라, 가진 것을 망치지 마라.', '지금 가진 것도, 한때는 바라던 것이었다.'], '에피쿠로스, 바티칸 어록 35'), { rot: -1 });
        break;
      case 44:
        h += outlined(1450, 120, [[['그리스의 철학자 · ', '#fff'], ['에피쿠로스', YEL]]], { size: 58, sw: 13 });
        h += pop(t, at(0.15), t + 99, 960, 330, quote(['어제의 좋은 것을 잊는 사람은,', '오늘 늙은이가 된다.'], '에피쿠로스, 바티칸 어록 19'), { rot: 1 });
        break;
      case 50: {
        h += `<rect width="1920" height="1080" fill="#3A2A14" opacity=".12"/>`;
        h += pop(t, at(0.1), t + 99, 690, 70, label(0, 0, '1998', { size: 42, bg: '#E9D7B4', color: '#5A3E26' }), { rot: -4 });
        const lines = ['제로가 혼자 일어섰다.', '제로가 아빠 품에서 잠들었다.', '아빠가 오늘, 제로를 보고 처음 웃었다.'];
        lines.forEach((ln, j) => { const k = Math.min(1, Math.max(0, (lt - 0.6 - j * 2.2) / 1.6)); if (k <= 0) return;
          const shown = typeLines([ln], k)[0] || '', y = 112 + j * 88, x = 64 + j * 34;
          h += `<g opacity="${Math.min(1, k * 3).toFixed(2)}" transform="rotate(${-1.5 + j * 1.2} ${x} ${y})"><rect x="${x - 22}" y="${y - 58}" width="${(ln.length * 30 + 60).toFixed(0)}" height="80" rx="10" fill="#F1DFBA" stroke="${INK}" stroke-width="4" opacity=".94"/>` +
            `<text x="${x}" y="${y}" font-family="'Nanum Pen Script', ${FONT}" font-weight="700" font-size="52" fill="#4A3424">${esc(shown)}</text></g>`; });
        break; }
      case 53:
        h += pop(t, at(0.1), t + 99, 380, 110, pill('토요일 오후 · 병실'), { noPop: true });
        break;
      case 54: {
        h += `<g transform="translate(380 110)">${pill('토요일 오후 · 병실')}</g>`;
        const g = Math.min(1, lt / 1.2), bx = 1030, by = 690;
        h += `<ellipse cx="${bx}" cy="${by}" rx="230" ry="150" fill="url(#warm)" opacity="${(0.85 * g).toFixed(2)}"/>`;
        for (let n = 0; n < 7; n++) { const ph = (t * 0.45 + n / 7) % 1, an = n * 0.9 + t * 0.3, x = bx + Math.cos(an) * (120 + 30 * Math.sin(n)), y = by + 10 + Math.sin(an) * 80;
          h += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(0.28 + 0.14 * Math.sin(ph * Math.PI)).toFixed(2)})" opacity="${(Math.sin(ph * Math.PI) * g).toFixed(2)}"><path d="${starPath13(40)}" fill="#FFE680" stroke="${INK}" stroke-width="6"/></g>`; }
        break; }
      case 55: {
        const l = L[55], s1 = (l.segs && l.segs[1]) ? l.segs[1].t0 : l.t0 + 4;
        if (t > s1) h += pop(t, s1, t + 99, 1150, 190, bubble(0, 0, 380, 116, T8(0, 14, '밥은 먹었니?', { size: 44 })), {});
        break; }
      case 56:
        h += `<g transform="translate(1150 190)">${bubble(0, 0, 380, 116, T8(0, 14, '밥은 먹었니?', { size: 44 }))}</g>`;
        h += pop(t, at(0.15), t + 99, 470, 300, label(0, 0, '응. 먹었어.', { size: 50, bg: YEL }), { rot: -3, bob: 3 });
        break;
      case 57: case 58: case 59: {
        if (i === 57) h += pop(t, at(0.1), t + 99, 380, 110, pill('일요일 밤 · 퇴원 전날'), { noPop: true });
        let kSun = 0, lines = 0;
        if (i === 58) { const l = L[58], sg = l.segs || []; kSun = 0; for (let j = 1; j <= 3; j++) if (sg[j]) kSun += Math.min(1, Math.max(0, (t - sg[j].t0 - 0.2) / 0.6)) / 3; }
        if (i === 59) { kSun = 1; lines = Math.min(1, Math.max(0, (lt - 0.3) / Math.max(1, D - 0.6))); }
        h += `<g opacity="${i === 57 ? Math.min(1, lt / 1.0).toFixed(2) : 1}">` + constellation13(560, 70, 0.8, t, 7, kSun, { lines }) + `</g>`;
        if (i === 59 && lines > 0.95) h += pop(t, at(Math.max(0.5, D - 1.4)), t + 99, 1215, 420, label(0, 0, '우리 가족 별자리', { size: 40, bg: YEL }), { rot: -2, bob: 3 });
        break; }
    }
    return h;
  };
})();
