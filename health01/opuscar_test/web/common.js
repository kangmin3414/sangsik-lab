/* 세 화풍 시험 페이지의 공통 도구. 타임라인(tl.json)은 목소리에서 만들었다. 페이지는 window.render(t)로 그 시각의 한 장을 그린다(같은 t면 늘 같은 그림). */
const W = 1920, H = 1080;
const TL = (() => { const x = new XMLHttpRequest(); x.open('GET', 'tl.json', false); x.send(); return JSON.parse(x.responseText); })();
window.DUR = TL.dur;
const LN = id => TL.lines.find(l => l.id === id);
const WT = (id, key, fb) => { const l = LN(id), w = l.words.find(w => w.w.includes(key)); return l.t0 + (w ? w.t : fb); };   // 그 줄에서 낱말이 나오는 절대 시각
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const K = (a, b, t) => clamp((t - a) / (b - a));
const expoOut = k => k >= 1 ? 1 : 1 - Math.pow(2, -10 * k);
const expoInOut = k => k <= 0 ? 0 : k >= 1 ? 1 : k < .5 ? Math.pow(2, 20 * k - 10) / 2 : (2 - Math.pow(2, -20 * k + 10)) / 2;
const easeInOut = k => k * k * (3 - 2 * k);
const backOut = k => { const c = 1.7; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let x = Math.imul(seed ^ seed >>> 15, 1 | seed); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };
const comma = n => Math.round(n).toLocaleString('en-US');
/* 자막: 긴 내레이션은 두 덩이로 나눴다. 붙잡아 두는 시간은 max(1.8초, 말 + 0.6초) */
const CUES = (() => { const n = LN('n11'), c = LN('c12'), z = LN('z12'), cut = WT('n11', '하루', 9.46) - 0.3;
  return [[n.t0, cut, ['2019년, 평균 일흔두 살 여성 만 육천여 명의', '걸음을 4년 남짓 지켜봤습니다.']],
          [cut + 0.05, n.t1 + 0.45, ['하루 4,400보쯤 걷는 사람은 2,700보쯤 걷는 사람보다', '사망률이 41퍼센트 낮았습니다.']],
          [c.t0, Math.max(c.t1 + 0.4, c.t0 + 1.8), ['7,500보쯤부터는… 더 안 낮아졌대.']],
          [z.t0, TL.dur, ['나 오늘 9,400인데.']]]; })();
const cueAt = t => CUES.find(c => t >= c[0] && t < c[1]) || null;
const FONTS = ['400 100px "Black Han Sans"', '400 100px "Do Hyeon"', '500 100px "IBM Plex Mono"', '700 100px "Gaegu"', '400 100px "Gaegu"', '400 100px "Jua"'];
const SAMPLE = '0123456789,.%−+·…?!/ 걸음수하루몇보면될까평균일흔두살여성만육천여명의을년남짓지켜봤습니다는걷사람은보다사망률이퍼센트낮았쯤부터더안낮아졌대나오늘인데꼭채워야할여기서평평한구간제로의세계이미쪽과비교추적칠천오백대략적인모양곡선은그림오늘의만보사천사백이천칠백구천사백주연구이야기날마다게기준그리고채점하다지켜본것명년보쯤사람평지언덕길느리게빠르게건강편시험화풍픽토그램모션리소그래프마커종이STEPSJAMAINTERNMEDCHAPTER';
window.READY = false;
Promise.all(FONTS.map(f => document.fonts.load(f, SAMPLE))).then(() => document.fonts.ready).then(() => { window.READY = true; });
