/* ep.009 upgrade: Socrates-story lines are shown as AI illustrations (Nano Banana 2.1) with a slow camera (Ken Burns),
   cross-fading between pictures; the facts / quotes / speech that used to sit in those scenes are drawn on top as before.
   Timing follows the recorded segments (FS / SG from scenes11.js), exactly like the original scenes. */
(function () {
  const MAP = { 4: '04', 5: '04', 6: '06', 29: '29', 51: '51', 52: '51', 54: '51', 55: '55', 56: '55', 57: '57' };
  const PAN = { '04': [1, 0], '06': [-1, 0], '29': [1, 0], '51': [0, -1], '55': [-1, 0], '57': [1, 0] };
  const ZOOMOUT = {};
  const layer = document.getElementById('ai');
  const imgs = {};
  const uniq = [...new Set(Object.values(MAP))];
  window.AI_READY = Promise.all(uniq.map(k => new Promise(res => {
    const im = new Image();
    im.onload = () => res(k); im.onerror = () => res(k);
    im.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;object-fit:cover;opacity:0;transform-origin:50% 45%';
    im.src = 'ai/' + k + '.png';
    layer.appendChild(im); imgs[k] = im;
  }))).then(() => Promise.all(Object.values(imgs).map(im => (im.decode ? im.decode().catch(() => 0) : 0)))).then(() => uniq.length);

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
    const sc = ZOOMOUT[k] ? 1.16 - 0.13 * e : 1.02 + 0.07 * e;
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

  const O = window.AI_POS || {};
  const P = (key, x, y) => (O[key] || [x, y]);
  // speaker heads in the pictures (tail targets for speech bubbles), screen coordinates
  const HEAD = { soc04: [400, 520], chaer: [520, 570], soc51: [960, 500], juror54: [300, 420], crito: [1220, 380], soc55: [660, 390] };
  window.aiOverlay = (i, t, lt, a) => {
    const D = a._dur || 3;
    let h = '', p, q;
    switch (i) {
      case 4: {
        h += PA(t, lt, D, 0.04, 960, 90, big(0, 0, [[['약 ', '#fff'], ['2,400년 전', YEL], [' · 아테네', '#fff']]], { size: 72 }), {});
        const fq = FS(a, 1, 0.5); p = P('4q', 820, 300); q = HEAD.soc04;
        h += QSPK(t, lt, D, fq, null, p[0], p[1], 500, 110, '그게, 정확히 뭔가?', q[0] + 40, q[1] - 90, { size: 44 });
        p = P('4b', 190, 845); h += PA(t, lt, D, FS(a, 1, 0), p[0], p[1], label(0, 0, '맨발', { size: 40, bg: YEL }), { rot: -4 });
        break;
      }
      case 5:
        p = P('5a', 1000, 250); h += PA(t, lt, D, 0.05, p[0], p[1], label(0, 0, '철학자 소크라테스', { size: 48, bg: YEL }), {});
        h += PA(t, lt, D, 0.1, p[0], p[1] + 80, label(0, 0, '기원전 470년경 ~ 399년', { size: 30, bg: '#fff' }), {});
        p = P('5b', 1000, 430); h += PA(t, lt, D, FS(a, 1, 0.05), p[0], p[1], label(0, 0, '남긴 책 0권', { size: 38, bg: '#fff' }), { rot: -2 });
        p = P('5c', 1000, 520); h += PA(t, lt, D, FS(a, 2, 0), p[0], p[1], label(0, 0, '제자 플라톤의 대화편으로 전해짐', { size: 38, bg: MINT }), {});
        break;
      case 6: {
        p = P('6a', 1350, 80); h += PA(t, lt, D, 0.08, p[0], p[1], label(0, 0, '델포이 신전', { size: 40, bg: '#fff' }), {});
        p = P('6b', 290, 400); h += PA(t, lt, D, FS(a, 0, 0.3), p[0], p[1], label(0, 0, '친구 카이레폰', { size: 40, bg: YEL }), {});
        p = P('6c', 1580, 520); h += PA(t, lt, D, FS(a, 0, 0.75), p[0], p[1], label(0, 0, '무녀', { size: 34, bg: '#fff' }), {});
        p = P('6s', 560, 250); q = HEAD.chaer;
        h += SPK(t, lt, D, FS(a, 1, 0), null, p[0], p[1], 640, 156, ['소크라테스보다', '지혜로운 사람이 있습니까?'], q[0] + 40, q[1] - 100, { size: 44 });
        break;
      }
      case 29:
        p = P('29a', 960, 80); h += PA(t, lt, D, 0.02, p[0], p[1], label(0, 0, '다시, 아테네', { size: 40, bg: '#fff' }), {});
        p = P('29b', 360, 420); h += PA(t, lt, D, FS(a, 1, 0.1), p[0], p[1], label(0, 0, '두 아버지', { size: 38, bg: YEL }), {});
        p = P('29c', 720, 600); h += PA(t, lt, D, FS(a, 1, 0.5), p[0], p[1], label(0, 0, '아들들', { size: 30, bg: '#fff' }), {});
        p = P('29d', 1430, 260); h += PA(t, lt, D, FS(a, 2, 0.25), p[0], p[1], label(0, 0, '갑옷 입고 싸우는 기술', { size: 36, bg: '#fff' }), {});
        break;
      case 51: {
        p = P('51a', 1400, 700); h += PA(t, lt, D, 0.05, p[0], p[1], label(0, 0, '일흔이 넘은 나이', { size: 38, bg: '#fff' }), {});
        const k1 = easeOut(prog(lt, SG(a, 1, -0.05), SG(a, 1, 0.1)));
        p = P('51s', 420, 300);
        if (k1 > 0) {
          h += `<g transform="translate(${p[0]} ${p[1]}) scale(${r3(k1)} 1)"><rect x="-300" y="-120" width="600" height="300" rx="10" fill="#F4E9D0" stroke="${INK}" stroke-width="7"/><rect x="-320" y="-136" width="30" height="332" rx="12" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/><rect x="290" y="-136" width="30" height="332" rx="12" fill="${WALNUT}" stroke="${INK}" stroke-width="5"/>`;
          h += T8(0, -60, '고발장', { size: 46, fill: '#8A2E26' }) + `<line x1="-220" y1="-36" x2="220" y2="-36" stroke="#8A2E26" stroke-width="4"/>`;
          if (lt > SG(a, 1, 0.08)) h += T8(-250, 30, '① 젊은이들을 타락시킴', { anchor: 'start', size: 38 });
          if (lt > SG(a, 1, 0.38)) h += T8(-250, 110, '② 나라의 신을 믿지 않음', { anchor: 'start', size: 38 });
          h += `</g>`;
        }
        break;
      }
      case 52: {
        const fs1 = FS(a, 1, 0); p = P('52s', 960, 200); q = HEAD.soc51;
        h += SPK(t, lt, D, fs1, null, p[0], p[1], 1060, 170, ['질문을 그만두는 조건으로 풀어 준다 해도,', '나는 멈추지 않을 것이오.'], q[0], q[1] - 100, { size: 44 });
        if (at(lt, FS(a, 1, 0.75), D)) for (const [x, y] of [[300, 420], [1640, 420], [520, 560], [1460, 560]]) h += PA(t, lt, D, FS(a, 1, 0.75) + (x % 7) * 0.01, x, y, T8(0, 0, '!', { size: 64, fill: RED, stroke: INK, sw: 8 }), { bob: 3 });
        p = P('52a', 1420, 760); h += PA(t, lt, D, 0.04, p[0], p[1], label(0, 0, '배심원들 앞에서', { size: 34, bg: '#fff' }), { f2: fs1 });
        break;
      }
      case 54: {
        const f4 = FS(a, 1, 0); p = P('54q', 520, 250); q = HEAD.juror54;
        h += SPK(t, lt, D, 0.04, f4 - 0.02, p[0], p[1], 620, 156, ['조용히 입 다물고', '살면 되지 않소?'], q[0], q[1] - 60, { size: 44, bg: '#EDEDED' });
        h += PA(t, lt, D, f4, 960, 210, `<rect x="-640" y="-110" width="1280" height="230" rx="34" fill="#1B2A44" fill-opacity=".92" stroke="${YEL}" stroke-width="6"/>` + big(0, -16, ['성찰하지 않는 삶은'], { size: 70, sw: 13 }) + big(0, 76, [[['살 가치가 없다', YEL]]], { size: 70, sw: 13 }), {});
        h += PA(t, lt, D, FS(a, 1, 0.55), 960, 420, `<g>${label(0, 0, '성찰 = 삶을 살피는 일', { size: 40, bg: YEL })}<circle cx="-302" cy="0" r="30" fill="${NAVY}" stroke="${INK}" stroke-width="4"/>${T8(-302, 15, '?', { size: 42, fill: YEL })}</g>`, {});
        p = P('54r', 1500, 520); h += PA(t, lt, D, FS(a, 1, 0.7), p[0], p[1], label(0, 0, '『소크라테스의 변명』 38a', { size: 30, bg: '#fff' }), {});
        break;
      }
      case 55: {
        h += PA(t, lt, D, 0.04, 1520, 70, label(0, 0, '사형 선고 · 감옥', { size: 36, bg: '#fff' }), {});
        p = P('55a', 1520, 150); h += PA(t, lt, D, FS(a, 0, 0.55), p[0], p[1], label(0, 0, '친구 크리톤 · 새벽', { size: 36, bg: YEL }), {});
        p = P('55s', 1600, 275); q = HEAD.crito;
        h += SPK(t, lt, D, FS(a, 1, 0), null, p[0], p[1], 500, 156, ['탈출 준비는', '다 해 뒀네.'], q[0], q[1] - 90, { size: 46 });
        break;
      }
      case 56: {
        p = P('56s', 560, 190); q = HEAD.soc55;
        h += SPK(t, lt, D, FS(a, 1, 0), FS(a, 2, 0), p[0], p[1], 540, 156, ['잘못을 잘못으로', '갚을 수는 없네.'], q[0], q[1] - 90, { size: 46 });
        h += PA(t, lt, D, FS(a, 2, 0.45), 1460, 90, label(0, 0, '마지막 날까지, 질문과 대화', { size: 38, bg: YEL }), {});
        break;
      }
      case 57:
        h += PA(t, lt, D, 0.1, 1500, 90, label(0, 0, '해 질 무렵', { size: 36, bg: '#fff' }), {});
        break;
    }
    return h;
  };
})();
