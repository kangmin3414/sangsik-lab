/* ep.010 upgrade: the Buddha's story lines are shown as AI illustrations (Nano Banana 2.1) with a slow camera (Ken Burns),
   cross-fading between pictures; the facts / headlines that used to sit in those scenes are drawn on top as before
   (spoken lines stay in the subtitles, tinted for characters). */
(function () {
  const MAP = { 5: '05', 6: '05', 7: '07', 8: '08', 9: '09', 10: '10', 11: '10', 12: '12', 14: '14', 15: '14', 45: '45', 46: '46',
                54: '54', 55: '55', 56: '56', 57: '56', 58: '58', 59: '59' };
  const PAN = { '05': [1, 0], '07': [-1, 0], '08': [1, -1], '09': [-1, 0], '10': [0, -1], '12': [1, 0], '14': [0, -1], '45': [-1, 0],
                '46': [1, 0], '54': [-1, 0], '55': [1, -1], '56': [-1, 0], '58': [0, -1], '59': [1, 0] };
  const BASE = { '14': [-90, 1.17], '59': [-80, 1.16] };   // lift low subjects above the subtitle band (scaled so no edge shows)
  const ZOOMOUT = { '07': 1, '56': 1 };   // wide establishing shots: the camera pulls back instead of pushing in
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
  const ptr = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="4" stroke-dasharray="8 8"/>`;
  const cloud = (txt) => bubble(0, 0, Math.max(240, txt.length * 34 + 70), 110, `<text x="0" y="14" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="38" fill="${NAVY}">${esc(txt)}</text>`);
  window.aiOverlay = (i, t, lt, a) => {
    const D = a._dur || 3, at = f => t - lt + f;
    let h = '';
    switch (i) {
      case 5:
        h += pop(t, at(0.05), t + 99, 900, 110, head([[['히말라야 아래 ', '#fff'], ['작은 나라', YEL]]], { size: 62, sw: 13 }), {});
        if (lt > 0.45 * D) h += pop(t, at(0.45 * D), t + 99, 1340, 340, label(0, 0, '왕자 싯다르타', { size: 46, bg: YEL }), { rot: -3 });
        break;
      case 6:
        h += label(1340, 340, '왕자 싯다르타', { size: 46, bg: YEL });
        h += pop(t, at(0.05 * D), t + 99, 640, 210, label(0, 0, '슬픈 건 하나도 보이지 않게', { size: 38, bg: '#fff' }), { rot: -2 });
        if (lt > 0.5 * D) h += pop(t, at(0.5 * D), t + 99, 1500, 120, label(0, 0, '꽃 · 음악 · 맛있는 음식', { size: 36, bg: YEL }), { rot: 2 });
        break;
      case 7: {
        h += pop(t, at(0.05), t + 99, 1200, 120, label(0, 0, '성 밖에서 만난 것들', { size: 40, bg: YEL }), {});
        [['늙은 사람', 0.52, 1000, 540], ['병든 사람', 0.68, 1290, 430], ['장례 행렬', 0.84, 1720, 510]].forEach(([n, f, x, y]) => { if (lt > f * D) h += pop(t, at(f * D), t + 99, x, y, label(0, 0, n, { size: 38, bg: '#fff' }), {}); });
        break; }
      case 8:
        h += label(1200, 120, '성 밖에서 만난 것들', { size: 40, bg: YEL });
        h += pop(t, at(0.1), t + 99, 1220, 370, label(0, 0, '떠돌이 수행자', { size: 38, bg: '#fff' }), {});
        if (lt > 0.55 * D) h += pop(t, at(0.55 * D), t + 99, 1220, 260, label(0, 0, '가진 것 없이도 평온', { size: 42, bg: YEL }), { rot: -2 });
        break;
      case 9:
        h += pop(t, at(0.08), t + 99, 960, 110, head([[['스물아홉', YEL], [', 궁을 떠나다', '#fff']]], { size: 68, sw: 13 }), {});
        if (lt > 0.62 * D) h += pop(t, at(0.62 * D), t + 99, 1190, 360, cloud('진짜 평온은 어디에 있을까?'), { bob: 4 });
        break;
      case 10:
        h += pop(t, at(0.1), t + 99, 1380, 300, label(0, 0, '고행 6년', { size: 44, bg: '#fff' }), { rot: 2 });
        if (lt > 0.6 * D) h += pop(t, at(0.6 * D), t + 99, 1160, 720, label(0, 0, '하루에 쌀 한 톨', { size: 38, bg: YEL }), { rot: -2 });
        break;
      case 11:
        h += label(1160, 720, '하루에 쌀 한 톨', { size: 38, bg: YEL });
        if (lt > 0.5 * D) h += pop(t, at(0.5 * D), t + 99, 1350, 200, head(['이렇게 해서는', [['답이 안 나온다', YEL]]], { size: 66, sw: 13, lh: 84 }), {});
        break;
      case 12:
        if (lt > 0.35 * D) h += pop(t, at(0.35 * D), t + 99, 1250, 450, label(0, 0, '우유죽 한 그릇', { size: 42, bg: '#fff' }), { rot: 3 });
        break;
      case 14:
        if (lt > 0.25 * D) h += pop(t, at(0.25 * D), t + 99, 1500, 300, label(0, 0, '보리수', { size: 40, bg: '#fff' }), { rot: 3 });
        if (lt > 0.7 * D) h += pop(t, at(0.7 * D), t + 99, 420, 300, label(0, 0, '35세', { size: 52, bg: YEL }), { rot: -4 });
        break;
      case 15:
        h += label(1500, 300, '보리수', { size: 40, bg: '#fff' });
        h += pop(t, at(0.1), t + 99, 960, 140, head([[['붓다 = ', '#fff'], ['깨어난 사람', YEL]]], { size: 82, sw: 16 }), {});
        break;
      case 45:
        h += pop(t, at(0.08), t + 99, 900, 170, label(0, 0, '붓다의 제자 소나', { size: 42, bg: YEL }), {});
        if (lt > 0.3 * D) h += pop(t, at(0.3 * D), t + 99, 1400, 330, label(0, 0, '발바닥이 갈라질 만큼 걷기 명상', { size: 34, bg: '#fff' }), { rot: 3 });
        if (lt > 0.78 * D) h += pop(t, at(0.78 * D), t + 99, 1150, 470, cloud('다 그만둘까…'), { bob: 4 });
        break;
      case 46:
        h += pop(t, at(0.1), t + 99, 640, 440, label(0, 0, '현악기를 잘 타던 소나', { size: 36, bg: '#fff' }), { rot: -2 });
        break;
      case 54:
        h += pop(t, at(0.12 * D), t + 99, 800, 360, label(0, 0, '젊은 엄마 고타미', { size: 40, bg: '#F7C6D9' }), { rot: -3 });
        break;
      case 55:
        if (lt > 0.15 * D) h += pop(t, at(0.15 * D), t + 99, 1500, 300, label(0, 0, '겨자씨 한 줌', { size: 40, bg: YEL }), { rot: 2 });
        if (lt > 0.5 * D) h += pop(t, at(0.5 * D), t + 99, 1500, 410, label(0, 0, '단, 아무도 죽은 적 없는 집에서', { size: 36, bg: '#FFF3B0' }), { rot: -2 });
        break;
      case 56:
        if (lt > 0.4 * D) h += pop(t, at(0.4 * D), t + 99, 1000, 150, label(0, 0, '겨자씨는 어느 집에나 있었다', { size: 40, bg: '#fff' }), {});
        break;
      case 57:
        h += label(1000, 150, '겨자씨는 어느 집에나 있었다', { size: 40, bg: '#fff' });
        if (lt > 0.62 * D) h += pop(t, at(0.62 * D), t + 99, 1000, 270, label(0, 0, '단 한 곳도 없었다', { size: 46, bg: YEL }), {});
        break;
      case 58:
        if (lt < 0.6 * D) h += pop(t, at(0.1 * D), at(0.6 * D), 960, 150, head([[['이 슬픔은 ', '#fff'], ['나 혼자만의 것', YEL], ['이 아니구나', '#fff']]], { size: 56, sw: 12 }), {});
        else h += pop(t, at(0.6 * D), t + 99, 960, 150, head([[['모든 것은 ', '#fff'], ['변하고, 지나가는구나', YEL]]], { size: 60, sw: 12 }), {});
        break;
      case 59:
        h += pop(t, at(0.1), t + 99, 960, 130, label(0, 0, '붓다의 마지막 말 · 『디가 니카야』 16', { size: 34, bg: '#fff' }), {});
        if (lt > 0.35 * D) h += pop(t, at(0.35 * D), t + 99, 960, 330, head([[['“모든 것은 ', '#fff'], ['변한다', YEL], ['.', '#fff']], [['게으르지 말고, ', '#fff'], ['깨어 있으라', YEL], ['.”', '#fff']]], { size: 70, sw: 14 }), {});
        break;
    }
    return h;
  };
})();
