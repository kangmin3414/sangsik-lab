"""기본 연출 점검: 대사 줄마다 기본 연출(zw/GFX.md '기본 연출')을 쓰고 있는지 숫자로 본다. 그림은 그리지 않고 장면 코드만 돌린다(1~2분).
   python3 dir_ml.py [t0 t1]        # 구간을 주면 그 사이 줄만
   줄마다:  시선  말하는 사람이 gfxDirect에 등록돼 있는가(자동 시선 · 고개 · 깜박임)
            마주  말하는 동안 고개가 상대 쪽으로 돌아가 있는가(|turn| 평균 0.25 이상). 정면만 보고 말하면 '정면'
            컷    줄 안의 컷 수와 가장 긴 컷(초). 4.6초 넘는 대사에 컷이 없으면 '긴 컷'
            초점  줄 안에서 초점 거리(cam.f)가 움직였는가(어깨 너머 → 말하는 사람)
            각도  높낮이 각도(cam.p)의 최댓값
   장면마다: 빛(gfxMood)이 얼마나 움직였는가. 한 번도 안 바뀌면 '빛 고정'
   기본 연출은 대화 장면의 기본값이고, 일부러 예전처럼 둔 줄(도해 · 몸 개그 · 한 사람 장면)은 그대로 둬도 된다. 그래서 종료 코드는 늘 0이고, 목록만 준다."""
import json, os, sys
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TL = json.load(open('timeline_ml.json')); FPS = 24; PAGE = os.environ.get('ML_PAGE', 'anim_ml.html')
a = [float(x) for x in sys.argv[1:3]]; T0, T1 = (a + [0, TL['duration']])[:2] if len(a) == 2 else (0, TL['duration'])
f0, f1 = int(T0 * FPS), int(T1 * FPS)
with sync_playwright() as p:
    br = p.chromium.launch(args=['--disable-gpu']); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    pg.goto('file://' + os.path.join(HERE, PAGE)); pg.evaluate('(tl) => { window.TL = tl; }', TL); pg.evaluate('window.AI_READY')
    if os.environ.get('ML_EVAL'): pg.evaluate(os.environ['ML_EVAL'])
    data = pg.evaluate('''([a, b]) => { const out = []; const v = document.getElementById('v');
        Object.defineProperty(v, 'innerHTML', { set(x) {}, get() { return ''; }, configurable: true });      // 그림은 넣지 않는다(빠르게)
        for (let i = a; i <= b; i++) { window.GFX_LOOKS = {}; window.GFX_CAM = null; window.GFX_MOOD = null; window._gfxLk = {}; window._gfxMw = null;
          try { render(i / 24); } catch (e) { out.push([i, 'ERR ' + e.message]); continue; } out.push([i, window.GFX_LOOKS || {}, window.GFX_CAM, window.GFX_MOOD]); }
        return out; }''', [f0, f1])
    br.close()
F = {}
for row in data:
    if isinstance(row[1], str): print('error', row[0], row[1]); continue
    F[row[0]] = row[1:]
def cut(c0, c1): return c0 and c1 and (abs(c1['x'] - c0['x']) * c0['z'] > 150 or abs(c1['y'] - c0['y']) * c0['z'] > 110 or max(c1['z'], c0['z']) / min(c1['z'], c0['z']) > 1.1)
rows = []; scenes = {}
for l in TL['lines']:
    a, b = max(f0, int(l['t0'] * FPS)), min(f1, int(l['t1'] * FPS)); fr = [F[i] for i in range(a, b + 1) if i in F]
    if not fr or l['t1'] < T0 or l['t0'] > T1: continue
    sc = scenes.setdefault(l['scene'], {'w': [], 'n': 0}); sc['w'] += [x[2] for x in fr if x[2] is not None]; sc['n'] += len(fr)
    v = l.get('v')
    if not v or v == 'N': continue
    D = l['t1'] - l['t0']; mine = [x[0][v] for x in fr if v in x[0]]; cov = len(mine) / len(fr)
    turn = sum(abs(m[1]) for m in mine) / len(mine) if mine else 0
    cams = [x[1] for x in fr]; cuts = [i for i in range(1, len(cams)) if cut(cams[i - 1], cams[i])]
    seg = [0] + cuts + [len(cams)]; longest = max(seg[i + 1] - seg[i] for i in range(len(seg) - 1)) / FPS
    fs = [c['f'] for c in cams if c]; ps = [c['p'] for c in cams if c]
    flags = []
    if cov < 0.5: flags.append('시선 없음')
    elif turn < 0.25: flags.append('정면')
    if D > 4.6 and not cuts: flags.append('긴 컷')
    rows.append((l['id'], v, l['t0'], D, cov, turn, len(cuts), longest, (max(fs) - min(fs)) if fs else 0, max(ps, key=abs) if ps else 0, flags))
ok = [r for r in rows if not r[10]]
print(f'대사 {len(rows)}줄 가운데 기본 연출 {len(ok)}줄, 살펴볼 줄 {len(rows) - len(ok)}줄')
print('  줄    목소리  시작   길이  시선  고개  컷  긴컷  초점  각도')
for i, v, t0, D, cov, turn, nc, lg, df, pp, fl in rows:
    print(f'  {i:5s} {v:3s} {t0:7.2f} {D:5.1f}  {cov * 100:3.0f}%  {turn:4.2f}  {nc:2d}  {lg:4.1f}  {"옮김" if df > 0.3 else " -  "}  {pp:+.1f}  ' + (' · '.join(fl) if fl else 'ok'))
for s, d in scenes.items():
    w = d['w']
    if not d['n']: continue
    print(f'  장면 {s}: ' + (f'빛 {min(w):+.2f} ~ {max(w):+.2f}' + (' (빛 고정)' if max(w) - min(w) < 0.3 else '') if w else '빛 고정(gfxMood를 쓰지 않음)'))
