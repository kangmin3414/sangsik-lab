/* ep.019: picture-book biography layer — one illustration per beat (ai/<shot>.png), slow Ken Burns, 0.6 s cross-fade,
   firelight flicker, small labels, quote card, and the HUD: stairs (top right), decision cards (top left), year. */
(function () {
  const SHOTS = ['H1', 'H2', 'H3', '1-1', '1-2', '1-3', '1-4', '1-5', '2-1', '2-2', '2-2b', '2-3', '2-4', '2-5', '2-5b', '2-6', '3-1', '3-2', '3-3', '3-4', '3-5', '3-6', '3-6b', '3-7',
    '3-8', '3-9', '3-9b', '3-10', '4-2', '4-3', '4-4', '5-0', '6-1', '6-2', '6-3', '6-4', '7-2', '7-3'];
  const KB = { 'H1': [0, 0, -1], 'H2': [0, 0, 1], 'H3': [0, 0, 1], '1-1': [1, 0, 1], '1-2': [0, 0, 1], '1-3': [1, 0, 1], '1-4': [0, -1, 1], '1-5': [0, 0, 1], '2-1': [-1, 0, 1], '2-2': [1, 0, 1],
    '2-2b': [0, 0, 1], '2-3': [1, 0, 1], '2-4': [0, 0, -1], '2-5': [0, 0, 1], '2-5b': [0, 0, -1], '2-6': [0, 0, 1], '3-1': [-1, 0, 1], '3-2': [1, 0, 1], '3-3': [0, 0, 1], '3-4': [0, 0, 1],
    '3-5': [0, 0, 1], '3-6': [0, 0, 1], '3-6b': [1, 0, 1], '3-7': [0, 0, 1], '3-8': [1, 0, 1], '3-9': [-1, 0, 1], '3-9b': [1, 0, 1], '3-10': [0, 0, 1], '4-2': [0, -1, 1], '4-3': [0, 0, -1],
    '4-4': [0, 0, -1], '5-0': [0, 0, 1], '6-1': [0, 0, 1], '6-2': [1, 0, 1], '6-3': [-1, 0, -1], '6-4': [0, 0, -1], '7-2': [0, 0, 1], '7-3': [0, 0, -1] };
  const layer = document.getElementById('ai'), imgs = {};
  window.AI_READY = Promise.all(SHOTS.map(k => new Promise(res => {
    const im = new Image(); im.onload = () => res(k); im.onerror = () => res(k);
    im.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;object-fit:cover;opacity:0;transform-origin:50% 48%';
    im.src = 'ai/' + k + '.png'; layer.appendChild(im); imgs[k] = im;
  }))).then(() => SHOTS.filter(k => imgs[k].naturalWidth > 0).length);
  const shotOf = i => { const l = TL.lines[i]; return l && l.args && l.args.shot; };
  const runOf = i => { const L = TL.lines, k = shotOf(i); let a = i, b = i; while (a > 0 && shotOf(a - 1) === k) a--; while (b + 1 < L.length && shotOf(b + 1) === k) b++; return [a, b]; };
  const place = (k, t, t0, t1) => {
    const p = Math.min(1, Math.max(0, (t - t0) / Math.max(1, t1 - t0))), e = p * p * (3 - 2 * p) * 0.5 + p * 0.5;
    const near = k === 'H1' && TL.lines[window.__i] && TL.lines[window.__i].args && TL.lines[window.__i].args.near;
    const [dx, dy, z] = near ? [0, 1, 1] : (KB[k] || [0, 0, 1]), sc = near ? 1.22 + 0.08 * e : z < 0 ? 1.12 - 0.09 * e : z > 0 ? 1.03 + 0.08 * e : 1.06;
    imgs[k].style.transform = `translate(${(dx * 34 * (e - 0.5)).toFixed(2)}px, ${(dy * 22 * (e - 0.5)).toFixed(2)}px) scale(${sc.toFixed(4)})`;
  };
  window.aiFrame = (i, t, L) => {
    window.__i = i;
    for (const kk in imgs) { imgs[kk].style.opacity = 0; imgs[kk].style.zIndex = 0; }
    const k = shotOf(i); if (!k || !imgs[k]) return false;
    const [a, b] = runOf(i), t0 = L[a].t0 - 0.15, t1 = b + 1 < L.length ? L[b + 1].t0 - 0.15 : L[b].t1 + 0.6;
    place(k, t, t0, t1); imgs[k].style.zIndex = 2;
    const fade = Math.min(1, Math.max(0, (t - t0) / 0.6)), pk = a > 0 ? shotOf(a - 1) : null;
    if (pk && imgs[pk] && fade < 1) {          // cross-fade from the previous picture
      const [pa, pb] = runOf(a - 1); place(pk, t, L[pa].t0 - 0.15, t0 + 0.6); imgs[pk].style.zIndex = 1; imgs[pk].style.opacity = 1;
      imgs[k].style.opacity = fade.toFixed(3);
    } else imgs[k].style.opacity = 1;
    return true;
  };


  function lineIdx19() { const L = TL.lines; let i = 0; while (i + 1 < L.length && window.__t >= L[i + 1].t0 - 0.15) i++; return i; }
  const YEAR = { 0: 1995, 5: 1953, 12: 1974, 16: 1983, 19: 1992, 22: 1992, 27: 1987, 28: 1993, 32: 1993, 36: 1993, 38: 1990, 41: 1995, 43: 1995, 49: 2018, 50: 2008, 54: 2014, 55: 2021 };
  const DEC_AT = { 1: 15, 2: 18, 3: 21, 4: 35, 5: 40, 6: 46 };   // decision k appears at line index
  const STEP_AT = [4, 11, 26, 42, 53];                          // step n starts at line index
  function hud(i, t, lt) {
    const L = TL.lines; if (!L[i] || L[i].scene === 'kstep' || i < 4 || i >= 58) return '';
    let n = 0; STEP_AT.forEach((s, k) => { if (i >= s) n = k + 1; });
    let h = `<g transform="translate(1590 70)"><rect x="-290" y="-50" width="580" height="150" rx="28" fill="${NAVY}" opacity=".88" stroke="#F2B84B" stroke-width="4"/>`;
    for (let k = 1; k <= 5; k++) { const x = -250 + (k - 1) * 70, y = 70 - (k - 1) * 18, on = n >= k, cur = n === k;
      h += `<rect x="${x}" y="${y - 22}" width="64" height="${22 + (k - 1) * 18 + 8}" fill="${cur ? '#F2B84B' : on ? '#8A7A50' : '#3A4660'}" stroke="#1A2235" stroke-width="2"/>`; }
    h += T8(110, 8, `${n}단계`, { size: 26, fill: '#F2B84B' }) + T8(110, 52, ['', '보는 눈', '믿는 힘', '부끄러움', '버리는 용기', '나누는 마음'][n] || '', { size: 32, fill: '#fff' });
    let yr = null; for (const [k, v] of Object.entries(YEAR)) if (i >= +k) yr = v;
    h += '</g>';
    if (yr) h += `<g transform="translate(1590 196)"><rect x="-90" y="-26" width="180" height="52" rx="26" fill="#FFFDF4" stroke="${INK}" stroke-width="4"/>` + T8(0, 12, String(yr), { size: 32, fill: NAVY }) + '</g>';
    // decision cards stack (top left)
    const got = Object.entries(DEC_AT).filter(([k, at]) => i >= at && i < 49).map(([k]) => +k);
    got.forEach((k, j) => { const fresh = DEC_AT[k] === i ? Math.min(1, lt / 0.4) : 1;
      h += `<g transform="translate(${70 + j * 64} 70) rotate(${-4 + j * 2})" opacity="${fresh.toFixed(2)}"><rect x="-28" y="-34" width="56" height="68" rx="8" fill="#FFE29A" stroke="${INK}" stroke-width="4"/>` + T8(0, 14, '①②③④⑤⑥'[k - 1], { size: 34, fill: NAVY }) + '</g>'; });
    return h;
  }
  const tag = (x, y, txt, o = {}) => pop(o.t, o.t0, o.t + 99, x, y, label(0, 0, txt, { size: o.size || 38, bg: o.bg || '#FFFDF4' }), { rot: o.rot || -2, bob: 3 });
  function fire(t) { // flicker + rising sparks on the bonfire pictures
    let h = `<rect width="1920" height="1080" fill="#FF8A3A" opacity="${(0.05 + 0.04 * Math.sin(t * 9) + 0.03 * Math.sin(t * 23)).toFixed(3)}"/>`;
    for (let n = 0; n < 22; n++) { const ph = (t * (0.25 + (n % 5) * 0.05) + n * 0.137) % 1, x = (n * 87 + Math.sin(t * 2 + n) * 30) % 1920, y = 900 - ph * 900;
      h += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(2 + (n % 3)).toFixed(1)}" fill="#FFD27A" opacity="${(Math.sin(ph * Math.PI) * 0.9).toFixed(2)}"/>`; }
    return h;
  }
  window.aiOverlay = (i, t, lt, a) => {
    window.__t = t;
    const k = a.shot, D = a._dur || 3, T0 = t - lt, at = f => T0 + f, o = (f, x) => Object.assign({ t, t0: at(f) }, x || {});
    let h = '';
    if (k === 'H1' || k === 'H2' || k === '4-2') h += fire(t);
    switch (k) {
      case 'H1': if (i === 0) h += pop(t, at(0.2), t + 99, 960, 160, outlined(0, 0, [[['1995년 3월 · ', '#fff'], ['15만 대', YEL]]], { size: 84, sw: 16 }), { noPop: true, inDur: 0.35 });
        else h += tag(560, 230, '휴대폰 · 무선전화기 · 팩스 15만 대', o(0.4 * D, { size: 36 })); break;
      case 'H2': h += tag(960, 200, '자기 손으로 만든 걸, 자기 손으로', o(0.4 * D, { size: 40, bg: YEL })); break;
      case 'H3': if (lt > 0.1) h += pop(t, at(0.1), t + 99, 960, 180, outlined(0, 0, [[['도대체 ', '#fff'], ['왜', YEL], ['?', '#fff']]], { size: 96, sw: 18 }), { inDur: 0.3 }); break;
      case '1-3': h += tag(1400, 230, '3년 · 영화 1,200편+ (알려진 이야기)', o(0.55 * D, { size: 34 })); break;
      case '1-4': if (i === 8) ['주인공의 눈', '조연의 눈'].forEach((s, j) => h += tag(560 + j * 800, 300, s, o(fracOf13(t, j ? '조연' : '주인공') * D - 0.1, { size: 36, bg: j ? '#CFE8F3' : '#FFE29A' }))); break;
      case '2-1': h += tag(1400, 230, '망해 가던 작은 반도체 회사', o(0.3 * D, { size: 36 })); break;
      case '2-3': h += tag(1420, 220, '1983 · 64K D램 (세계 세 번째)', o(0.65 * D, { size: 36, bg: MINT })); break;
      case '2-4': h += pop(t, at(0.3 * D), t + 99, 960, 190, outlined(0, 0, [[['D램 세계 ', '#fff'], ['1위', YEL], [' · 18년 만에', '#fff']]], { size: 66, sw: 13 }), {}); break;
      case '3-3': h += pop(t, at(0.35 * D), t + 99, 1320, 240, `<rect x="-330" y="-80" width="660" height="160" rx="24" fill="#FFFDF4" opacity=".96" stroke="${INK}" stroke-width="6"/>` + T8(0, -12, '"하루에 3~5시간밖에', { size: 40, fill: NAVY }) + T8(0, 44, '잠이 안 왔습니다"', { size: 40, fill: NAVY }), { rot: -1.5 }); break;
      case '3-4': h += tag(1400, 230, '규격이 안 맞는 뚜껑 → 칼로 깎아 조립', o(0.5 * D, { size: 34, bg: '#FFB8A0' })); break;
      case '3-6': h += tag(560, 230, '1993.6.7 · 프랑크푸르트 · 임원 200여 명', o(0.3 * D, { size: 34 })); break;
      case '3-7': h += pop(t, at(0.15), t + 99, 960, 330, `<rect x="-640" y="-150" width="1280" height="300" rx="28" fill="#FFFDF4" opacity=".96" stroke="${INK}" stroke-width="7"/>` +
        T8(0, -40, '"변하지 않으면 영원히 2류다.', { size: 54, fill: NAVY }) + T8(0, 50, '마누라와 자식 빼고, 다 바꿔라."', { size: 60, fill: RED }) + T8(600, 124, '1993년 신경영 선언', { anchor: 'end', size: 26, fill: '#8A6A44', w: 700 }), { inDur: 0.35 }); break;
      case '3-8': if (i === 36) h += tag(960, 220, '7·4제 · 아침 7시 출근, 오후 4시 퇴근', o(0.2, { size: 40, bg: YEL })); break;
      case '3-9': h += tag(1380, 230, '1990 · 지역전문가 제도', o(0.6 * D, { size: 38, bg: MINT })); break;
      case '3-10': h += pop(t, at(0.45 * D), t + 99, 1420, 260, outlined(0, 0, [[['불량률 ', '#fff'], ['11.8%', '#FF8A7A']]], { size: 70, sw: 14 }), {}); break;
      case '4-4': if (lt > 0.6 * D) h += tag(960, 220, '결정 ⑥ · 아까워도 버리기', o(0.6 * D, { size: 44, bg: YEL })); break;
      case '5-0': if (i === 51) h += pop(t, at(0.2), t + 99, 960, 230, `<rect x="-560" y="-90" width="1120" height="180" rx="22" fill="#F4EFE4" stroke="${INK}" stroke-width="5"/>` +
          T8(0, -26, '1996 비자금 사건 유죄(사면) · 2008 조세포탈·배임 유죄, 퇴진', { size: 32, fill: NAVY }) + T8(0, 34, '2009 특별사면 · 2010 복귀', { size: 32, fill: NAVY }), {}); break;
      case '6-2': h += tag(1400, 230, '미술품 2만 3천여 점 · 조건 없는 기증', o(0.35 * D, { size: 36, bg: YEL })); break;
      case '6-4': if (lt > 0.5 * D) h += pop(t, at(0.5 * D), t + 99, 960, 200, outlined(0, 0, [[['모두가 ', '#fff'], ['함께 보는 것', YEL]]], { size: 72, sw: 14 }), {}); break;
      case '7-2': h += tag(1380, 230, "오늘 하나: 내 삶의 '세탁기 뚜껑' 적기", o(0.3 * D, { size: 38, bg: YEL })); break;
      case '7-3': if (a.ask) h += tag(960, 220, '지금 여러분은 몇 번째 계단에?', o(0.2, { size: 46, bg: MINT }));
        if (a.end) { h += pop(t, at(0.1), t + 99, 960, 220, outlined(0, 0, [[['다음 실험에서', '#fff']], [['또 만나요', YEL]]], { size: 92, sw: 18 }), {}) + pop(t, at(0.5), t + 99, 960, 410, label(0, 0, '상식실험실', { size: 40, bg: MINT }), {}); }
        break;
    }
    h += hud(i, t, lt);
    return h;
  };
})();
