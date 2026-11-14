/* 제로의 세계 — 연기 층(act). shorts/engine.js는 건드리지 않는다. 시간(초)을 넣으면 char()에 줄 옵션을 돌려준다. 새 이름은 모두 act 접두사.
   왜: 엔진의 자세 전환은 직선 보간 하나뿐이라, 예비 동작·탄력·뒤따름·시선 순서를 장면마다 손으로 넣어야 했다(2026-11-14 엔진 점검).
   쓰는 법(장면 안에서):
     const g = actGaze([[0, 0, 0.5], [2.1, -0.9, 0]], T);            // 눈이 먼저 가고 머리가 따라온다 → { look, turn, tilt }
     const p = actPose([[0, '서기'], [2.0, 손든자세, { ant: 0.16 }]], T); // 예비 동작 → 지나쳤다 돌아옴, 팔꿈치·손은 늦게
     const h = actHit(T, 3.2, 0.1);                                    // 움찔 → { sx, sy }
     char({ pose: p, look: g.look, turn: g.turn, tilt: g.tilt, sy: h.sy, headDy: actNod(T, 4.0) })
   시간 T는 장면이 이어지는 동안 끊기지 않는 시계를 쓴다(컷이 바뀌어도 연기는 이어지게). render()가 넘기는 runLt가 그것이다. */

/* 계단 응답: 0에서 1로 가되 지나쳤다 돌아온다. f 빠르기(클수록 빠름), z 감쇠(0.35 출렁 ~ 1 얌전) */
const actStep = (u, f = 3.2, z = 0.5) => {
  if (u <= 0) return 0; const w = 2 * Math.PI * f;
  if (z >= 1) return 1 - Math.exp(-w * u) * (1 + w * u);
  const wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * u) * (Math.cos(wd * u) + z * w / wd * Math.sin(wd * u));
};
/* 예비 동작이 붙은 출발: t0보다 ant초 먼저 반대쪽으로 amt만큼 물러났다가 나간다. 돌려주는 값은 0 → 1(잠깐 음수, 잠깐 1 초과) */
const actGo = (t, t0, o = {}) => {
  const ant = o.ant == null ? 0.14 : o.ant, amt = ant > 0 ? (o.amt == null ? 0.12 : o.amt) : 0;
  if (t <= t0 - ant) return 0;
  if (t < t0) return -amt * Math.sin(Math.PI / 2 * (t - (t0 - ant)) / ant);
  return -amt + (1 + amt) * actStep(t - t0, o.f, o.z);
};
/* 값의 길: keys = [[t, 값, {f, z, ant, amt}], …]. 값은 수 또는 배열. 키마다 예비 동작과 탄력이 붙는다. */
function actTrack(keys, t, d = {}) {
  const v0 = keys[0][1], isA = Array.isArray(v0); let cur = isA ? v0.slice() : v0;
  for (let i = 1; i < keys.length; i++) { const k = actGo(t, keys[i][0], Object.assign({}, d, keys[i][2])); if (k === 0) continue; const a = keys[i - 1][1], b = keys[i][1];
    if (isA) cur = cur.map((c, j) => c + (b[j] - a[j]) * k); else cur += (b - a) * k; }
  return cur;
}
/* 자세의 길: keys = [[t, 자세(이름 또는 객체), {f, z, ant, amt, lag}], …]. 어깨·다리 → 팔꿈치 → 손 순서로 늦게 따라온다(뒤따름). */
function actPose(keys, t, d = {}) {
  const get = p => typeof p === 'string' ? P[p] : p, cp = v => Array.isArray(v) ? v.map(cp) : v, a0 = get(keys[0][1]);
  const cur = {}; for (const k of ['armL', 'armR', 'legL', 'legR', 'hL', 'hR', 'fL', 'fR']) cur[k] = cp(a0[k]); cur.dy = a0.dy || 0;
  for (let i = 1; i < keys.length; i++) { const o = Object.assign({ f: 3.4, z: 0.55 }, d, keys[i][2]), t0 = keys[i][0], lag = o.lag == null ? 0.05 : o.lag;
    const kS = actGo(t, t0, o), kE = actGo(t - lag, t0, Object.assign({}, o, { z: o.z * 0.9 })), kH = actGo(t - 2 * lag, t0, Object.assign({}, o, { z: o.z * 0.75 }));
    if (kS === 0 && kE === 0 && kH === 0) continue; const a = get(keys[i - 1][1]), b = get(keys[i][1]);
    for (const s of ['L', 'R']) { const A = 'arm' + s, H = 'h' + s, Lg = 'leg' + s, F = 'f' + s;
      [kS, kE, kH].forEach((k, j) => { cur[A][j][0] += (b[A][j][0] - a[A][j][0]) * k; cur[A][j][1] += (b[A][j][1] - a[A][j][1]) * k; });
      cur[H][0] += (b[H][0] - a[H][0]) * kH; cur[H][1] += (b[H][1] - a[H][1]) * kH;
      for (let j = 0; j < 3; j++) { cur[Lg][j][0] += (b[Lg][j][0] - a[Lg][j][0]) * kS; cur[Lg][j][1] += (b[Lg][j][1] - a[Lg][j][1]) * kS; cur[F][j] += (b[F][j] - a[F][j]) * kS; } }
    cur.dy += ((b.dy || 0) - (a.dy || 0)) * kS; }
  return cur;
}
/* 시선: 눈이 먼저 가고, 머리가 조금 늦게 따라 돈다. keys = [[t, x(-1 왼쪽 ~ 1 오른쪽), y(-1 위 ~ 1 아래)], …] → { look, turn, tilt } */
function actGaze(keys, t, o = {}) {
  const eye = actTrack(keys.map(k => [k[0], [k[1], k[2] || 0], { f: 7, z: 0.85, ant: 0 }]), t);
  const head = actTrack(keys.map(k => [k[0] + (o.headLag == null ? 0.09 : o.headLag), k[1], { f: o.f || 3.2, z: 0.5, ant: 0.1, amt: 0.1 }]), t);
  const amt = o.turn == null ? 0.85 : o.turn;
  return { look: [clamp(eye[0] - head * 0.4, -1, 1), clamp(eye[1], -1, 1)], turn: head * amt, tilt: head * (o.tilt == null ? 2.5 : o.tilt) };
}
/* 움찔·충격: t0에 A만큼 눌렸다가 출렁이며 돌아온다 → { sx, sy } */
const actHit = (t, t0, A = 0.08, f = 5, lam = 6) => { const u = t - t0; if (u < 0) return { sx: 1, sy: 1 }; const k = A * Math.exp(-lam * u) * Math.cos(2 * Math.PI * f * u); return { sx: 1 + k * 0.6, sy: 1 - k }; };
/* 끄덕임: t0부터 n번 → headDy(아래로 양수) */
const actNod = (t, t0, n = 2, amp = 9, per = 0.3) => { const u = t - t0; return u < 0 || u > n * per ? 0 : amp * Math.pow(Math.sin(Math.PI * u / per), 2) * (1 - 0.35 * u / (n * per)); };
/* 숨 들이쉬기(말하기 직전): t0 앞 d초 동안 몸이 살짝 늘어났다가 돌아온다 → sy */
const actInhale = (t, t0, d = 0.3, A = 0.035) => { const u = (t - (t0 - d)) / d; return u <= 0 || u >= 1.6 ? 1 : 1 + A * Math.sin(Math.PI * Math.min(u, 1) * 0.5) * (u < 1 ? 1 : Math.max(0, 1 - (u - 1) / 0.6)); };
/* 말에 실리는 몸: 목소리 크기 e(0~1) → 머리가 살짝 들리고 손이 박자를 탄다 */
const actTalk = e => ({ headDy: -5 * e, hand: -9 * e });
/* 서 있는 사람의 무게 이동: 천천히 좌우로 실린다 → { dx, rot } */
const actSway = (t, seed = 1, amp = 5) => ({ dx: Math.sin(t * 0.7 + seed * 2.1) * amp, rot: Math.sin(t * 0.7 + seed * 2.1) * 0.5 });
/* { sx, sy } 여러 개 곱하기 */
const actMul = (...xs) => xs.reduce((a, b) => ({ sx: a.sx * (b.sx == null ? 1 : b.sx), sy: a.sy * (b.sy == null ? 1 : b.sy) }), { sx: 1, sy: 1 });

/* ---------- 입 모양(발음에 맞춤) ---------- */
/* 한글 음절의 모음에 따라 입 모양을 고른다. 음성 인식이 준 단어 시각(words: [{w, t}], t는 줄 시작부터의 초)을 음절 수로 나눠 쓴다.
   [가로 반지름, 세로 반지름]: 아(크게) · 어 · 에/애(옆으로) · 오(동그랗게) · 우(작게) · 으(납작) · 이(옆으로 얇게). ㅁ·ㅂ·ㅍ으로 시작하면 음절 앞에서 입을 다문다. */
const ACT_VOW = [[13, 15], [15, 9], [13, 15], [15, 9], [11, 12], [15, 9], [11, 12], [15, 9], [8, 10], [12, 13], [14, 10], [12, 9], [8, 10], [6, 7], [10, 10], [13, 9], [9, 6], [6, 7], [13, 4], [13, 5], [15, 5]];
const actSyl = w => { const out = []; for (const ch of String(w)) { const c = ch.charCodeAt(0); if (c >= 0xAC00 && c <= 0xD7A3) { const k = c - 0xAC00, cho = Math.floor(k / 588), jung = Math.floor((k % 588) / 28); out.push({ v: ACT_VOW[jung], lip: cho === 6 || cho === 7 || cho === 8 || cho === 17 }); } else if (/[0-9]/.test(ch)) { out.push({ v: [12, 11], lip: false }); out.push({ v: [11, 8], lip: false }); } else if (/[A-Za-z]/.test(ch)) out.push({ v: [12, 10], lip: false }); } return out; };
function actMouthShape(words, u, e) { // u: 줄 시작부터의 초, e: 목소리 크기(0~1). 돌려주는 값 [rx, ry] 또는 null(다문 입)
  if (!words || !words.length || e < 0.05) return null;
  let i = -1; for (let k = 0; k < words.length; k++) if (u >= words[k].t - 0.03) i = k; if (i < 0) return null;
  const syl = actSyl(words[i].w); if (!syl.length) return null;
  const nxt = i + 1 < words.length ? words[i + 1].t : words[i].t + 0.2 * syl.length + 0.25, d = Math.max(0.12, Math.min(nxt - words[i].t, 0.24 * syl.length + 0.1));
  const p = (u - words[i].t) / d * syl.length; if (p >= syl.length + 0.35) return null;
  const j = clamp(Math.floor(p), 0, syl.length - 1), f = p - j, cur = syl[j], prev = j > 0 ? syl[j - 1].v : [9, 3], nx = j + 1 < syl.length ? syl[j + 1].v : [9, 3];
  let rx = cur.v[0], ry = cur.v[1];
  if (f < 0.3) { const k = f / 0.3 * 0.5 + 0.5; rx = lerp(prev[0], rx, k); ry = lerp(cur.lip ? 1.5 : prev[1], ry, k); } else if (f > 0.7) { const k = (f - 0.7) / 0.3 * 0.5; rx = lerp(rx, nx[0], k); ry = lerp(ry, nx[1], k); }
  const g = 0.55 + 0.6 * Math.min(1, e * 1.6); return [rx, Math.max(2, ry * g)];
}
/* 표정 base에 지금 발음의 입을 얹은 표정을 E[key]에 넣고 fEx(key)를 돌려준다. line: 타임라인의 줄({t0, words}), t: 지금 시각 */
function actSay(key, base, line, t, e) {
  const m = line ? actMouthShape(line.words, t - line.t0, e) : null;
  E[key] = m ? Object.assign({}, E[base], { mouth: ell(200, 238, f1(m[0]), f1(m[1])), mouthFill: '#5A1E2A' }) : E[base];
  return fEx(key);
}
/* 지금 시각에 말하고 있는 줄(없으면 null). 줄 끝난 뒤 0.15초까지는 그 줄로 본다 */
const actLineAt = t => ((window.TL && TL.lines) || []).find(l => l.words && l.words.length && t >= l.t0 - 0.05 && t < l.t1 + 0.15) || null;
