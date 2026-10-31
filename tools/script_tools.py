"""Shared checks for story-format scripts (FORMAT.md).
usage: python3 tools/script_tools.py <episode_dir>/script.py [--read]
  - validates k numbering per scene run, voice letters, and estimates length (270 chars/min + 0.35 s per line + pauses)
  - --read regenerates <episode_dir>/script_read.md (outline table + script with speaker, tone and sound cues)
"""
import importlib.util, os, re, sys

VOICES = {'N': None, 'Z': '제로', 'D': '박사', 'T': '오 팀장', 'P': '박 과장', 'H': '한 주임', 'M': '민지',
          'S': '동생', 'O': '엄마', 'F': '아빠'}
TONE = dict(tense='긴장', playful='장난스럽게', whisper='속삭이듯', warm='따뜻하게', tremble='떨리게', excited='들떠서',
            deadpan='무표정하게', tired='지친 목소리로')


def load(p):
    spec = importlib.util.spec_from_file_location('s', p); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m


def check(m):
    prev = None
    for x in m.S:
        for sg in x[1].get('segs', []):
            assert sg[0] in VOICES, ('unknown voice', sg)
        k = x[1].get('k', 0)
        assert (k == 0) if x[0] != prev else (k == pk + 1), ('k order', x[0], k)
        prev, pk = x[0], k
    t = 0; marks = []
    for x in m.S:
        if x[1].get('k', 0) == 0: marks.append(f'{int(t // 60)}:{int(t % 60):02d} {x[0]}')
        a = x[1]
        t += a['silent'] if a.get('silent') else len(x[2].replace(' ', '')) / 270 * 60
        t += a.get('pause', 0) + 0.35
    chars = sum(len(x[2].replace(' ', '')) for x in m.S if not x[1].get('silent'))
    print(len(m.S), 'lines', chars, 'chars; est', f'{int(t // 60)}:{int(t % 60):02d}')
    print(' | '.join(marks))


def read_md(p, m):
    src = open(p, encoding='utf-8').read().split('\n'); a = next(i for i, l in enumerate(src) if l.startswith('S = ['))
    o = [f'# {m.TITLE} (읽기용)', '', '*(괄호 안: 감정 지시 · 🔊 효과음 · [화면] 화면에만 뜨는 글자)*', '']
    if getattr(m, 'OUTLINE', None):
        o += ['## 이야기 한눈에 보기', '', '| 구간 | 장면 | 무슨 일이 |', '|---|---|---|']
        o += [f'| {a_} | {b} | {c} |' for a_, b, c in m.OUTLINE]
        o += ['', '## 대본', '']
    i = 0
    for l in src[a + 1:]:
        t = l.strip()
        if t == ']': break
        mh = re.match(r'# -+ (.+?) -+$', t)
        if mh: o += ['', f'### {mh.group(1)}', '']; continue
        if t.startswith('# ('): o.append(f'- *{t[2:]}*'); continue
        if not t.startswith('('): continue
        sc, ar, sub, _ = m.S[i]; i += 1
        if ar.get('silent'): line = f'[화면] {sub}'
        elif ar.get('segs'):
            parts = []
            for sg in ar['segs']:
                who = VOICES.get(sg[0]); parts.append((f'**{who}**: ' if who else '') + sg[1])
            line = ' / '.join(parts)
        else: line = sub
        if ar.get('tone'): line += f' *({TONE[ar["tone"]]})*'
        if ar.get('sfx'): line += f' 🔊{ar["sfx"]}'
        if ar.get('count'): line += f' `집에 가고 싶은 사람 {ar["count"]}/5`'
        o.append('- ' + line)
    assert i == len(m.S)
    out = os.path.join(os.path.dirname(os.path.abspath(p)), 'script_read.md')
    open(out, 'w', encoding='utf-8').write('\n'.join(o) + '\n'); print('wrote', out)


if __name__ == '__main__':
    p = sys.argv[1]; m = load(p); check(m)
    if '--read' in sys.argv: read_md(p, m)
