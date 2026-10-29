"""Upload texts for the unreleased long-forms under the new channel name (re-runnable after renders to refresh durations)."""
import json, os, re
SP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CH = 'https://www.youtube.com/channel/UCSNT-TsvhptVyD63_3yn2yg?sub_confirmation=1'
SUB_BLOCK = '🔔 평일엔 몸·뇌 실험, 주말엔 철학자처럼 살아 보기. 매일 저녁 7시에 새 실험이 올라와요.\n구독하기 → ' + CH
JOBS = [  # folder, old text, new text, old srt, new srt, old video, new video
    ('descartes3', '유튜브_업로드_실험007_v4.txt', '유튜브_업로드_실험007_v5.txt', '만약에연구소_실험007_자막_v4.srt', '상식실험실_실험007_자막_v5.srt',
     '만약에연구소_실험007_데카르트처럼모든걸의심하기_v4.mp4', '상식실험실_실험007_데카르트처럼모든걸의심하기_v5.mp4'),
    ('zhuangzi4', '유튜브_업로드_실험008_v4.txt', '유튜브_업로드_실험008_v5.txt', '만약에연구소_실험008_자막_v4.srt', '상식실험실_실험008_자막_v5.srt',
     '만약에연구소_실험008_장자처럼남의잣대내려놓기_v4.mp4', '상식실험실_실험008_장자처럼남의잣대내려놓기_v5.mp4'),
    ('socrates2', '유튜브_업로드_실험009_v2.txt', '유튜브_업로드_실험009_v3.txt', '만약에연구소_실험009_자막_v2.srt', '상식실험실_실험009_자막_v3.srt',
     '만약에연구소_실험009_소크라테스처럼질문하며살기_v2.mp4', '상식실험실_실험009_소크라테스처럼질문하며살기_v3.mp4'),
    ('buddha2', '유튜브_업로드_실험010_v2.txt', '유튜브_업로드_실험010_v3.txt', '만약에연구소_실험010_자막_v2.srt', '상식실험실_실험010_자막_v3.srt',
     '만약에연구소_실험010_붓다처럼지금여기에살기_v2.mp4', '상식실험실_실험010_붓다처럼지금여기에살기_v3.mp4'),
]


def tags_line(line):
    tags = [t.strip() for t in line.split(',') if t.strip()]
    tags = [t for t in tags if t not in ('만약에', '만약에연구소')]
    for t in ('상식실험실', '상식'):
        if t not in tags: tags.append(t)
    return ', '.join(tags)


APPLY = json.load(open(os.path.join(SP, 'portraits', 'apply.json')))
BYDIR = {v['folder']: v for v in APPLY.values() if v['folder'] != 'lf_upload'}

for d, old, new, osrt, nsrt, ovid, nvid in JOBS:
    src = open(os.path.join(SP, d, old), encoding='utf-8').read().split('\n')
    dur = json.load(open(os.path.join(SP, d, 'timeline.json')))['duration']
    out = []; sec = None
    for line in src:
        if line.startswith('['): sec = line
        if sec == '[태그]' and line and not line.startswith('['):
            line = tags_line(line)
        elif sec == '[업로드 설정]':
            line = line.replace(osrt, nsrt).replace(ovid, nvid)
            line = re.sub(r'\d+분 \d+초', f'{int(dur // 60)}분 {int(dur % 60)}초', line)
            if line.startswith('썸네일:'):
                line = f"썸네일: {os.path.basename(BYDIR[d]['thumb'])} (명화 초상 + 이름 + 궁금증 문구 · 이전 안: {line[4:].strip()})"
        else:
            line = line.replace('#만약에연구소', '#상식실험실').replace('만약에연구소', '상식실험실')
        out.append(line)
        if line.startswith('💬') and sec == '[설명란]' and CH not in '\n'.join(src):
            out.append(SUB_BLOCK)
    txt = '\n'.join(out)
    txt = f"[제목 · 확정 (궁금증형)]\n{BYDIR[d]['title']}\n\n" + txt
    if nvid not in txt:  # make the new video file explicit in the settings block
        txt = txt.rstrip('\n') + f'\n영상 파일: {nvid} ({int(dur // 60)}분 {int(dur % 60)}초)\n'
    txt = txt.rstrip('\n') + '\n※ 채널 이름 변경(만약에연구소 → 상식실험실)에 맞춰 해시태그·태그·구독 링크·영상 끝인사를 새 이름으로 바꾼 판입니다.\n'
    open(os.path.join(SP, d, new), 'w', encoding='utf-8').write(txt)
    body = txt.split('[업로드 설정]')[0]
    print(d, new, 'old name left in public text:', '만약에연구소' in body, '| sub link:', CH in body, '| dur', round(dur, 1))
