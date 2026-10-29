import json, subprocess, sys, os
here = os.path.dirname(os.path.abspath(__file__)); tl = json.load(open(os.path.join(here, 'timeline.json'))); L = tl['lines']; N = int(tl['duration'] * 24)
lines = [int(x) for x in sys.argv[1].split(',')]
rng = []
for i in lines:
    a = int((L[i]['t0'] - 0.15) * 24) - 2; b = int((L[i + 1]['t0'] - 0.15) * 24) + 2 if i + 1 < len(L) else N + 1
    rng.append((max(0, a), min(N + 1, b)))
rng.sort(); merged = []
for a, b in rng:
    if merged and a <= merged[-1][1]: merged[-1] = (merged[-1][0], max(b, merged[-1][1]))
    else: merged.append((a, b))
tot = sum(b - a for a, b in merged); print('ranges', merged, 'frames', tot, flush=True)
# split the work into two parallel workers of equal size
flat = [f for a, b in merged for f in range(a, b)]; half = len(flat) // 2
def spans(fr):
    out = []; 
    for f in fr:
        if out and f == out[-1][1]: out[-1][1] = f + 1
        else: out.append([f, f + 1])
    return out
jobs = [spans(flat[:half]), spans(flat[half:])]
procs = [subprocess.Popen(['bash', '-c', ' && '.join(f'python3 render012.py {a} {b}' for a, b in job)], cwd=here, stdout=open(os.path.join(here, f'rr{k}.log'), 'w'), stderr=subprocess.STDOUT) for k, job in enumerate(jobs)]
for p in procs: p.wait()
print('RERENDER_DONE', tot)
