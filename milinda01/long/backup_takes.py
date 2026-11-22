"""고른 테이크(takes.json)를 takes_opus/에 맞춰 둔다: 없는 것 · 다시 녹음해 더 새로운 것은 opus로 저장하고, 더는 안 쓰는 opus는 지운다.
/dev/shm/ml/takes는 작업 공간이 꺼지면 사라진다. 2026-11-22에 다시 녹음한 테이크 셋(s16 · s26 · s30)을 백업하기 전에 꺼져서 잃었다.
→ voice_ml.py와 gen_tl.py가 끝날 때마다 이 파일을 부른다(손으로 takes.json을 고친 뒤에도 gen_tl.py만 돌리면 맞춰진다).
   python3 backup_takes.py"""
import json, os, subprocess
HERE = os.path.dirname(os.path.abspath(__file__))
def sync(quiet=False):
    rep = json.load(open(f'{HERE}/takes.json')); D = f'{HERE}/takes_opus'; os.makedirs(D, exist_ok=True); keep = set(); made = []; lost = []
    for lid, r in rep.items():
        src = r['take']; name = os.path.basename(src).rsplit('.', 1)[0] + '.opus'; dst = f'{D}/{name}'; keep.add(name)
        if not os.path.exists(src): lost.append(lid) if not os.path.exists(dst) else None; continue
        if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src) - 1:
            subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', src, '-c:a', 'libopus', '-b:a', '64k', dst], check=True); made.append(name)
    gone = [f for f in os.listdir(D) if f.endswith('.opus') and f not in keep]
    for f in gone: os.remove(f'{D}/{f}')
    if not quiet or made or gone or lost: print(f'takes_opus: 새로 {len(made)} {made}, 지움 {len(gone)} {gone}, 원본도 백업도 없는 줄 {lost}')
    return lost
if __name__ == '__main__': sync()
