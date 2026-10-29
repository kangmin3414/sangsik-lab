import json, re, os, hashlib
from PIL import Image
SP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(SP, 'up6')
NEWLINE = '🔔 사흘마다 저녁 6시에 새 실험이 올라와요. 쇼츠는 매일 올라옵니다.'
meta = json.load(open(os.path.join(SP, 'lf_upload/meta_new.json')))
def sec(t):
    return dict(re.findall(r'\[([^\]]+)\]\n(.*?)(?=\n\[[^\]]+\]\n|\Z)', t, re.S))
for ep, d in [('011', 'time011/유튜브_업로드_실험011_v1.txt'), ('012', 'anger012/유튜브_업로드_실험012_v1.txt')]:
    s = sec(open(os.path.join(SP, d)).read())
    meta[ep] = {'title': s['제목 · 추천'].strip().split('\n')[0], 'desc': s['설명란'].strip(),
                'tags': [x.strip() for x in s['태그'].strip().split(',') if x.strip()]}
FILES = {
 '007': ('descartes3/상식실험실_실험007_데카르트처럼모든걸의심하기_v5.mp4', 'descartes3/상식실험실_실험007_자막_v5.srt', 'descartes3/상식실험실_실험007_썸네일_명화.png'),
 '008': ('zhuangzi4/상식실험실_실험008_장자처럼남의잣대내려놓기_v5.mp4', 'zhuangzi4/상식실험실_실험008_자막_v5.srt', 'zhuangzi4/상식실험실_실험008_썸네일_명화.png'),
 '009': ('socrates2/상식실험실_실험009_소크라테스처럼질문하며살기_v3.mp4', 'socrates2/상식실험실_실험009_자막_v3.srt', 'socrates2/상식실험실_실험009_썸네일_명화.png'),
 '010': ('buddha2/상식실험실_실험010_붓다처럼지금여기에살기_v3.mp4', 'buddha2/상식실험실_실험010_자막_v3.srt', 'buddha2/상식실험실_실험010_썸네일_명화.png'),
 '011': ('time011/상식실험실_실험011_1년이빨라진게아니었다_v2.mp4', 'time011/상식실험실_실험011_자막_v1.srt', 'time011/상식실험실_실험011_썸네일.jpg'),
 '012': ('anger012/상식실험실_실험012_화는풀어야산다_v1.mp4', 'anger012/상식실험실_실험012_자막_v1.srt', 'anger012/상식실험실_실험012_썸네일.jpg')}
SCHED = {'007': '2026. 10. 30.', '008': '2026. 11. 2.', '009': '2026. 11. 5.', '010': '2026. 11. 8.', '011': '2026. 11. 11.', '012': '2026. 11. 14.'}
res = {}
for ep, (v, s, th) in FILES.items():
    m = meta[ep]
    lines = m['desc'].split('\n')
    n = 0
    for i, l in enumerate(lines):
        if l.startswith('🔔'):
            lines[i] = NEWLINE; n += 1
    assert n == 1, (ep, n)
    desc = '\n'.join(lines)
    d = os.path.join(OUT, ep); os.makedirs(d, exist_ok=True)
    im = Image.open(os.path.join(SP, th)).convert('RGB').resize((1280, 720), Image.LANCZOS)
    tj = os.path.join(d, f'thumb_{ep}.jpg'); im.save(tj, quality=90)
    # chunks
    src = os.path.join(SP, v); CH = 9_400_000; h = hashlib.sha256(); parts = []
    with open(src, 'rb') as fh:
        k = 0
        while True:
            b = fh.read(CH)
            if not b: break
            h.update(b); p = os.path.join(d, f'part_{k:02d}.bin'); open(p, 'wb').write(b); parts.append(p); k += 1
    import shutil; srt = os.path.join(d, f'subs_{ep}.srt'); shutil.copy(os.path.join(SP, s), srt)
    tags = m['tags']; 
    while len(','.join(tags)) > 480: tags = tags[:-1]
    res[ep] = {'title': m['title'], 'desc': desc, 'tags': tags, 'thumb': tj, 'srt': srt, 'parts': parts,
               'size': os.path.getsize(src), 'sha': h.hexdigest(), 'name': os.path.basename(src), 'date': SCHED[ep], 'time': '오후 6:00'}
    print(ep, len(m['title']), len(desc), len(tags), len(parts), os.path.getsize(tj), m['title'])
json.dump(res, open(os.path.join(OUT, 'meta.json'), 'w'), ensure_ascii=False, indent=1)
