"""편 폴더의 script.py로 읽기용 script_read.md를 만든다. usage: python3 tools/script_read.py <편 폴더> [화자=이름,...]
화자 이름은 script.py 머리의 '# Voices:' 줄에서 읽는다(예: 'Z Zero' → Zero). 한국어 이름을 쓰려면 Z=제로,D=박사 처럼 넘긴다."""
import importlib.util, os, re, sys
d = sys.argv[1]; p = os.path.join(d, 'script.py')
sp = importlib.util.spec_from_file_location('s', p); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
src = open(p, encoding='utf-8').read()
names = {'Z': '제로', 'D': '박사'}
v = re.search(r'# Voices:(.*)', src)
if v:
    for code, nm in re.findall(r'\b([A-Z])\s+([^\s,(]+)', v.group(1)): names.setdefault(code, nm)
for kv in sys.argv[2:]: k, nm = kv.split('='); names[k] = nm
title = src.splitlines()[0].lstrip('# ').split(' (대본')[0]
out = [f'# {title} (읽기용, script.py에서 생성)', '']; i = 0
for line in src.split('S = [', 1)[1].splitlines():
    h = re.match(r'\s*# -+ (.+?) -+', line)
    if h: out += ['', f'### {h.group(1).split(" — ")[0]}', '']; continue
    if line.strip().startswith('("'):
        sc, args, sub, _ = m.S[i]; i += 1
        st = f" *({args['study']})*" if 'study' in args else ''
        if args.get('silent'): out.append(f'- 📱 *(화면 메시지)* {sub}'); continue
        if 'segs' in args:
            for seg in args['segs']: out.append(f'- **{names.get(seg[0], seg[0])}**: {seg[1]}' if seg[0] != 'N' else f'- {seg[1]}')
        else: out.append(f'- {sub}{st}')
assert i == len(m.S), (i, len(m.S))
open(os.path.join(d, 'script_read.md'), 'w', encoding='utf-8').write(re.sub(r'\n{3,}', '\n\n', '\n'.join(out)) + '\n')
print('ok', i, 'lines')
