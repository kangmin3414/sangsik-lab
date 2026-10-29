/* ep.008 upgrade: Zhuangzi's story lines are shown as AI illustrations (Nano Banana 2.1) with a slow camera (Ken Burns),
   cross-fading between pictures; the facts / headlines that used to sit in those scenes are drawn on top as before
   (spoken lines stay in the subtitles, tinted for characters). */
(function () {
  const MAP = { 4: '04', 5: '04', 6: '06', 7: '06', 8: '08', 9: '08', 10: '08', 11: '11', 12: '11', 17: '17', 18: '18', 19: '19', 20: '19', 21: '21', 23: '23', 35: '35', 36: '35',
                33: '33', 34: '33', 37: '37', 38: '37', 39: '37', 47: '47', 48: '47', 49: '47', 55: '55', 56: '56', 57: '57', 58: '58',
                59: '57', 60: '56', 61: '55' };
  const PAN = { '04': [1, 0], '06': [-1, 0], '08': [1, -1], '11': [0, -1], '17': [-1, 0], '18': [1, 0], '19': [-1, 0], '21': [1, 0], '23': [-1, 0],
                '33': [1, -1], '35': [-1, 0], '37': [0, 1], '47': [1, 0], '55': [-1, 0], '56': [1, -1], '57': [-1, 0], '58': [1, 0] };
  const ZOOMOUT = { '21': 1, '35': 1 };   // wide establishing shots: the camera pulls back instead of pushing in
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
    const sc = ZOOMOUT[k] ? 1.13 - 0.10 * e : 1.02 + 0.07 * e;
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

  const head = (txt, o = {}) => outlined(0, 0, txt, Object.assign({ size: 76, sw: 15 }, o));
  const ptr = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="4" stroke-dasharray="8 8"/>`;
  const cloud = (txt) => bubble(0, 0, Math.max(240, txt.length * 34 + 70), 110, `<text x="0" y="14" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="38" fill="${NAVY}">${esc(txt)}</text>`);
  window.aiOverlay = (i, t, lt, a) => {
    const D = a._dur || 3, at = f => t - lt + f;
    let h = '';
    switch (i) {
      case 4:
        h += pop(t, at(0.2), t + 99, 1380, 250, head([[['약 ', '#fff'], ['2,300년 전', YEL]]], { size: 92, sw: 18 }), {});
        if (lt > 0.62 * D) h += pop(t, at(0.62 * D), t + 99, 1380, 420, label(0, 0, '장자 (莊子)', { size: 54, bg: YEL }), {});
        if (lt > 0.7 * D) h += pop(t, at(0.7 * D), t + 99, 1380, 520, label(0, 0, '기원전 4세기 · 중국 전국시대', { size: 32, bg: '#fff' }), {});
        break;
      case 5:
        h += pop(t, at(0.1), t + 99, 1240, 170, label(0, 0, '옻나무 밭 관리인 · 칠원리(漆園吏)', { size: 40, bg: YEL }), {});
        if (lt > 0.55 * D) h += pop(t, at(0.55 * D), t + 99, 1240, 290, label(0, 0, '평생 가난', { size: 40, bg: '#fff' }), { rot: -2 });
        if (lt > 0.35 * D) h += pop(t, at(0.35 * D), t + 99, 0, 0, ptr(470, 640, 700, 560) + label(780, 560, '기운 옷', { size: 34, bg: '#fff' }), { noPop: true, inDur: 0.3 });
        break;
      case 6:
        h += pop(t, at(0.1), t + 99, 1470, 250, label(0, 0, '위나라 왕', { size: 36, bg: '#fff' }), {});
        if (lt > 0.2 * D) h += pop(t, at(0.2 * D), t + 99, 0, 0, ptr(520, 640, 720, 560) + label(800, 560, '기운 옷', { size: 34, bg: '#fff' }), { noPop: true, inDur: 0.3 });
        if (lt > 0.35 * D) h += pop(t, at(0.35 * D), t + 99, 0, 0, ptr(520, 930, 760, 800) + label(880, 800, '끈으로 동여맨 신발', { size: 34, bg: '#fff' }), { noPop: true, inDur: 0.3 });
        break;
      case 7:
        h += label(1470, 250, '위나라 왕', { size: 36, bg: '#fff' });
        if (lt > 0.55 * D) h += pop(t, at(0.55 * D), t + 99, 960, 150, head([[['가난', '#fff'], [' ≠ ', YEL], ['고달픔', '#fff']]], { size: 84 }), {});
        break;
      case 8:
        h += pop(t, at(0.1), t + 99, 1420, 150, label(0, 0, '초나라 왕의 신하들', { size: 36, bg: '#D9826B', color: '#fff' }), {});
        if (lt > 0.4 * D) h += pop(t, at(0.4 * D), t + 99, 1420, 260, label(0, 0, '“나라를 맡아 주십시오”', { size: 34, bg: '#fff' }), { rot: 2 });
        break;
      case 9:
        h += pop(t, at(0.15), t + 99, 1420, 150, label(0, 0, '죽은 지 3천 년 · 사당에 모셔진 거북', { size: 34, bg: YEL }), {});
        if (lt > 0.55 * D) h += pop(t, at(0.55 * D), t + 99, 1560, 760, label(0, 0, '살아서 진흙 속에서', { size: 36, bg: MINT }), { rot: -2, bob: 3 });
        break;
      case 10:
        h += label(1560, 760, '살아서 진흙 속에서', { size: 36, bg: MINT });
        if (lt > 0.62 * D) h += pop(t, at(0.62 * D), t + 99, 1380, 180, head([[['진흙 속의 ', '#fff'], ['자유', YEL]]], { size: 80 }), {});
        break;
      case 11:
        h += pop(t, at(0.05), t + 99, 960, 120, head([[['평생의 ', '#fff'], ['단짝이자 맞수', YEL]]], { size: 76 }), {});
        if (lt > 0.35 * D) h += pop(t, at(0.35 * D), t + 99, 1120, 330, label(0, 0, '혜자 · 위나라 재상', { size: 40, bg: '#9DB8D9' }), {});
        break;
      case 12:
        h += label(1120, 330, '혜자 · 위나라 재상', { size: 40, bg: '#9DB8D9' });
        if (lt > 0.3 * D) h += pop(t, at(0.3 * D), t + 99, 1500, 180, label(0, 0, '혜자의 잣대 = 쓸모', { size: 38, bg: YEL }), { rot: 2, bob: 3 });
        break;
      case 17:
        h += pop(t, at(0.1), t + 99, 470, 210, label(0, 0, '위나라 왕에게 받은 박씨', { size: 36, bg: '#fff' }), {});
        if (lt > 0.75 * D) h += pop(t, at(0.75 * D), t + 99, 1280, 260, label(0, 0, '다섯 섬(五石)이 들어가는 크기!', { size: 38, bg: YEL }), { rot: 3 });
        break;
      case 18:
        h += pop(t, at(0.1 * D), t + 99, 1500, 300, label(0, 0, '물 담기엔 너무 약하고', { size: 38, bg: '#fff' }), { rot: 2 });
        if (lt > 0.35 * D) h += pop(t, at(0.35 * D), t + 99, 1500, 410, label(0, 0, '바가지로 쓰기엔 너무 넓적', { size: 38, bg: '#fff' }), { rot: -2 });
        if (lt > 0.78 * D) h += pop(t, at(0.78 * D), t + 99, 980, 170, head(['쓸모없어!'], { size: 70, sw: 13, fill: YEL }), { rot: -5 });
        break;
      case 19:
        h += pop(t, at(0.45 * D), t + 99, 960, 150, label(0, 0, '송나라 · 대대로 솜 빨래', { size: 40, bg: '#fff' }), {});
        if (lt > 0.62 * D) h += pop(t, at(0.62 * D), t + 99, 1040, 700, label(0, 0, '손 안 트는 약', { size: 36, bg: YEL }), { rot: -2 });
        break;
      case 20:
        h += label(960, 150, '송나라 · 대대로 솜 빨래', { size: 40, bg: '#fff' }) + label(1040, 700, '손 안 트는 약', { size: 36, bg: YEL });
        if (lt > 0.15 * D) h += pop(t, at(0.15 * D), t + 99, 1420, 270, label(0, 0, '비법을 백 금에', { size: 38, bg: YEL }), { rot: 2 });
        if (lt > 0.55 * D) h += pop(t, at(0.55 * D), t + 99, 1420, 380, label(0, 0, '→ 오나라 왕에게', { size: 38, bg: '#fff' }), { rot: -2 });
        break;
      case 21:
        h += pop(t, at(0.05 * D), t + 99, 960, 110, head([[['한겨울, ', '#fff'], ['강 위의 싸움', YEL]]], { size: 70 }), {});
        if (lt > 0.18 * D) h += pop(t, at(0.18 * D), t + 99, 430, 330, label(0, 0, '손이 멀쩡한 오나라', { size: 36, bg: MINT }), {});
        if (lt > 0.28 * D) h += pop(t, at(0.28 * D), t + 99, 1500, 330, label(0, 0, '손이 튼 월나라', { size: 36, bg: '#fff' }), {});
        if (lt > 0.78 * D) h += pop(t, at(0.78 * D), t + 99, 960, 230, label(0, 0, '그 사람, 땅을 받다', { size: 42, bg: YEL }), {});
        break;
      case 23:
        h += pop(t, at(0.3 * D), t + 99, 960, 130, head([[['큰 박 = ', '#fff'], ['허리에 묶는 튜브!', YEL]]], { size: 76 }), {});
        break;
      case 33:
        h += pop(t, at(0.05), t + 99, 530, 560, label(0, 0, '혜자', { size: 40, bg: '#9DB8D9' }), {});
        if (lt > 0.35 * D) h += pop(t, at(0.35 * D), t + 99, 1320, 150, label(0, 0, '줄기는 울퉁불퉁, 가지는 비비 꼬여', { size: 38, bg: YEL }), { rot: 2 });
        if (lt > 0.62 * D) h += pop(t, at(0.66 * D), t + 99, 1660, 500, cloud('쓸 데가 없군'), {});
        break;
      case 34:
        h += label(530, 560, '혜자', { size: 40, bg: '#9DB8D9' }) + label(1320, 150, '줄기는 울퉁불퉁, 가지는 비비 꼬여', { size: 38, bg: YEL });
        if (lt > 0.4 * D) h += pop(t, at(0.4 * D), t + 99, 1320, 270, label(0, 0, '크기만 하고 쓸모없는 나무', { size: 38, bg: '#fff' }), { rot: -2 });
        break;
      case 35:
        h += pop(t, at(0.1 * D), t + 99, 360, 350, label(0, 0, '목수 석(匠石)', { size: 40, bg: YEL }), {});
        if (lt > 0.45 * D) h += pop(t, at(0.45 * D), t + 99, 700, 150, label(0, 0, '사당 옆 거대한 상수리나무', { size: 38, bg: '#fff' }), {});
        break;
      case 36: {
        h += label(360, 350, '목수 석(匠石)', { size: 40, bg: YEL });
        const rows = [['배를 만들면 가라앉고', 0.08], ['그릇을 만들면 깨지고', 0.3], ['기둥을 세우면 벌레 먹고', 0.52]];
        let g = `<rect x="-300" y="-150" width="600" height="300" rx="24" fill="#FFFDF5" stroke="${INK}" stroke-width="6" opacity=".96"/>`;
        rows.forEach(([txt, f], k) => { if (lt > f * D) g += `<text x="-250" y="${-62 + k * 82}" font-family="${FONT}" font-weight="900" font-size="38" fill="${RED}">✕</text><text x="-200" y="${-62 + k * 82}" font-family="${FONT}" font-weight="900" font-size="38" fill="${NAVY}">${esc(txt)}</text>`; });
        h += pop(t, at(0.05 * D), t + 99, 780, 230, g, {});
        if (lt > 0.76 * D) h += pop(t, at(0.76 * D), t + 99, 780, 440, label(0, 0, '쓸모없는 나무(散木)', { size: 44, bg: YEL }), { rot: -2 });
        break; }
      case 37:
        if (lt > 0.1 * D) h += pop(t, at(0.1 * D), t + 99, 420, 160, label(0, 0, '그날 밤, 목수의 꿈', { size: 38, bg: '#C3CDD8' }), { rot: -2 });
        break;
      case 38:
        h += label(420, 160, '그날 밤, 목수의 꿈', { size: 38, bg: '#C3CDD8' });
        if (lt > 0.3 * D) h += pop(t, at(0.3 * D), t + 99, 560, 300, label(0, 0, '열매는 따이고, 가지는 꺾이고', { size: 38, bg: '#fff' }), { rot: 2 });
        if (lt > 0.68 * D) h += pop(t, at(0.68 * D), t + 99, 560, 420, label(0, 0, '쓸모 때문에 제 삶을 괴롭힌다', { size: 42, bg: YEL }), {});
        break;
      case 39:
        h += pop(t, at(0.2 * D), t + 99, 700, 190, head(['내가 쓸모 있었다면,', [['이렇게 클 수 있었을까?', YEL]]], { size: 70, sw: 14 }), {});
        break;
      case 48:
        h += pop(t, at(0.12 * D), t + 99, 560, 190, label(0, 0, '짧다고 늘여 주면 → 근심', { size: 40, bg: '#fff' }), {});
        if (lt > 0.5 * D) h += pop(t, at(0.5 * D), t + 99, 1380, 190, label(0, 0, '길다고 잘라 주면 → 슬픔', { size: 40, bg: '#fff' }), {});
        break;
      case 49:
        if (lt < 0.6 * D) h += pop(t, at(0.05), at(0.6 * D), 960, 150, head(['긴 것은 남는 게 아니고,', [['짧은 것은 모자란 게 아니다', YEL]]], { size: 62, sw: 13 }), {});
        else h += pop(t, at(0.6 * D), t + 99, 960, 150, head([[['오늘도 ', '#fff'], ['티격태격', YEL]]], { size: 76 }), {});
        break;
      case 55:
        if (lt < 0.5 * D) h += pop(t, at(0.05), at(0.5 * D), 960, 150, head(['티격태격…'], { size: 60, sw: 12 }), { wobble: 2 });
        break;
      case 56:
        if (lt > 0.35 * D) h += pop(t, at(0.35 * D), t + 99, 0, 0, ptr(1500, 520, 1330, 640) + label(1500, 470, '혜자의 무덤', { size: 40, bg: '#fff' }), { noPop: true, inDur: 0.3 });
        break;
      case 60:
        h += label(1500, 470, '혜자의 무덤', { size: 40, bg: '#fff' });
        if (lt > 0.25 * D) h += pop(t, at(0.25 * D), t + 99, 1330, 130, head(['혜자가 죽은 뒤로,', [['더불어 이야기할 사람', YEL], ['을 잃었다', '#fff']]], { size: 60, sw: 13 }), {});
        break;
      case 61:
        if (lt > 0.35 * D) h += pop(t, at(0.35 * D), t + 99, 960, 150, head([[['쓸모없던 말다툼 = ', '#fff'], ['가장 소중한 시간', YEL]]], { size: 66 }), {});
        break;
      case 57:
        if (lt > 0.12 * D) h += pop(t, at(0.12 * D), t + 99, 1560, 300, label(0, 0, '코끝에 파리 날개만큼 얇은 흙', { size: 34, bg: '#fff' }), { rot: 2 });
        if (lt > 0.35 * D) h += pop(t, at(0.35 * D), t + 99, 470, 300, label(0, 0, '도끼질의 달인, 목수 석', { size: 36, bg: YEL }), {});
        if (lt > 0.6 * D) h += pop(t, at(0.6 * D), t + 99, 900, 200, head(['휘익—'], { size: 64, sw: 12 }), { rot: -6 });
        break;
      case 58:
        if (lt > 0.4 * D) h += pop(t, at(0.4 * D), t + 99, 1240, 330, label(0, 0, '짝이 없으면, 솜씨도 없다', { size: 42, bg: '#fff' }), {});
        break;
      case 59:
        h += label(470, 300, '도끼질의 달인, 목수 석', { size: 36, bg: YEL });
        if (lt > 0.4 * D) h += pop(t, at(0.4 * D), t + 99, 960, 150, label(0, 0, '끝까지 믿고 코를 내밀어 줄 상대', { size: 46, bg: YEL }), { bob: 3 });
        break;
    }
    return h;
  };
})();
