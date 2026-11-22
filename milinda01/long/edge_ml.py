"""화면 끝 조각 찾기: 인물 머리(장면이 gfxMark로 등록한 원)가 화면 왼쪽·오른쪽 끝에 '조금만' 걸친 프레임을 찾는다.
   python3 edge_ml.py            # 전체 프레임(그림은 그리지 않고 장면 코드만 돌린다. 1분 안팎)
   머리가 0.5%~45%만 보이는 상태가 0.4초 넘게 이어지면 알려 준다(휙 지나가는 이동은 뺀다). 다 넣거나 다 빼야 한다. 45%~90%로 1.25초 넘게 잘린 머리는 참고로 따로 적는다.
   조각이 하나라도 있으면 종료 코드 1.
   2026-11-22: 머리 반지름을 95로 어림해 손으로 계산했을 때는 조각이 여럿 남았고, 고친 뒤 이 도구를 처음 돌리자 넷이 더 나왔다(14번 첫 샷의 스님, 11번의 제로와 팀장, 8번의 제로). 눈으로만 찾지 않는다.
   머리는 장면이 mlHead → gfxMark로 등록한다(반지름 118s + 후광 18 = 136s. 왕은 머리띠 끝 때문에 [136, 184]). 손 · 소품은 아직 등록하지 않는다."""
import json, os, sys
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
TL = json.load(open('timeline_ml.json')); FPS = 24; N = round(TL['duration'] * FPS) + 1
def line_at(t):
    cur = None
    for l in TL['lines']:
        if t >= l['t0'] - 0.15: cur = l['id']
    return cur
with sync_playwright() as p:
    br = p.chromium.launch(args=['--disable-gpu']); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    pg.goto('file://' + os.path.join(HERE, 'anim_ml.html')); pg.evaluate('(tl) => { window.TL = tl; }', TL); pg.evaluate('window.AI_READY')
    data = pg.evaluate('''(n) => { const out = []; const v = document.getElementById('v'); const set = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
        Object.defineProperty(v, 'innerHTML', { set(x) {}, get() { return ''; }, configurable: true });      // 그림은 넣지 않는다(빠르게)
        for (let i = 0; i < n; i++) { window.GFX_MARKS = []; try { render(i / 24); } catch (e) { out.push([i, 'ERR ' + e.message]); continue; } out.push([i, (window.GFX_MARKS || []).map(m => [m.n, m.x, m.y, m.r, m.l, m.rt])]); }
        return out; }''', N)
    br.close()
runs = {}; found = []
for i, marks in data:
    if isinstance(marks, str): print('error', i, marks); continue
    for n, x, y, r, l, rt in marks:
        if y + r < 0 or y - r > 1080: continue
        vis = (min(1920, x + rt) - max(0, x - l)) / (l + rt)                    # 가로로 보이는 비율(좌우 반지름이 다를 수 있다)
        side = 'L' if x < 960 else 'R'
        if 0.005 < vis < 0.45: runs.setdefault((n, 'sliver'), []).append((i, round(vis, 3), side))        # 조금만 걸침(0.5%~45%)
        elif 0.45 <= vis < 0.9: runs.setdefault((n, 'cut'), []).append((i, round(vis, 3), side))          # 머리가 잘림(45%~90%): 참고용
for (n, kind), fr in runs.items():
    seg = [fr[0]]; need = 10 if kind == 'sliver' else 30
    for a in fr[1:] + [None]:
        if a is not None and a[0] - seg[-1][0] <= 2: seg.append(a); continue
        vs = [s[1] for s in seg]; rate = (max(vs) - min(vs)) / max(1 / FPS, (seg[-1][0] - seg[0][0]) / FPS)      # 초당 보이는 비율 변화: 0.5를 넘으면 카메라가 옮겨 가며 인물을 드러내는 중(조각이 아니다)
        if len(seg) >= need and rate < 0.5: found.append((seg[0][0] / FPS, seg[-1][0] / FPS, n, seg[0][2], max(vs), kind))
        seg = [a] if a else []
found.sort(); sl = [f for f in found if f[5] == 'sliver']; cut = [f for f in found if f[5] == 'cut']
print(f'프레임 {N}, 조각 {len(sl)}곳, 잘린 머리(참고) {len(cut)}곳')
for t0, t1, n, side, vis, kind in found: print(f'  {t0:7.2f}~{t1:7.2f}s  {line_at(t0 + 0.2):4s} {n} 머리가 {"왼쪽" if side == "L" else "오른쪽"} 끝에 {vis * 100:.1f}%까지 ' + ('걸침' if kind == 'sliver' else '보임(잘린 머리, 의도인지 확인)'))
json.dump(found, open('/dev/shm/ml/edges.json', 'w'), ensure_ascii=False)
sys.exit(1 if sl else 0)
