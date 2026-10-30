"""새 롱폼 편 폴더를 016(맹자) 제작 틀로 만든다.
usage: python3 tools/new_episode.py <폴더> <번호3자리> <파일용 짧은 제목>
  예) python3 tools/new_episode.py xunzi017 017 순자_환경이사람을만든다
만드는 것: script.py(빈 틀), anim<번호>.html, scenes<번호>.js(빈 틀), render<번호>.py, render_all.sh, finalize.sh,
srt<번호>.py, mix<번호>.py(016 믹스를 틀로), tts38seg.py + style38.json(Gemini TTS), tts_st.py(로컬 초벌), fake_tl.py, peek.py, peek3.py, .gitignore
그리고 폰트(@fontsource/nanum-pen-script)를 설치한다."""
import os, re, shutil, subprocess, sys, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); T = os.path.join(ROOT, 'mencius016')
d, num, slug = sys.argv[1], sys.argv[2], sys.argv[3]
D = os.path.join(ROOT, d)
if os.path.exists(os.path.join(D, 'script.py')): sys.exit(f'이미 있음: {D}/script.py')  # 기획 문서만 있는 폴더는 이어서 쓴다
os.makedirs(os.path.join(D, 'thumb'), exist_ok=True)
rd = lambda f: open(os.path.join(T, f), encoding='utf-8').read()
wr = lambda f, s: open(os.path.join(D, f), 'w', encoding='utf-8').write(s)
# html: same engine chain as 016 (helpers of 012~014 stay available), episode scenes instead of 016's
h = rd('anim016.html').replace('<script src="scenes016.js"></script>\n<script src="scenes016_2.js"></script>', f'<script src="scenes{num}.js"></script>')
h = h.replace('<g filter="url(#boil)">', '<g>')  # 운영자 요청(017): 화면이 이글거리는 boil 필터는 쓰지 않는다
wr(f'anim{num}.html', h)
wr(f'scenes{num}.js', f"""/* ---------- experiment {num}: <주제> ---------- */
// One image all the way: <한 가지 비유>.
// 장면 함수 이름 = script.py의 scene + 'Scene'. CAMS에 카메라 [z0, z1, cx, cy]를 등록한다.
// 쓸 수 있는 도구: char/Z/doctor/pop/label/outlined/big/T8/card14/quote14/labBg/desk12/chair12/nightRoom12/streetNight12/flip/shadow/walkPose 등.
// 016의 망토·요일 HUD·회의실 같은 부품이 필요하면 ../mencius016/scenes016*.js에서 함수를 복사해 이름 끝을 {num}로 바꿔 쓴다.
Object.assign(CAMS, {{}});
""")
wr(f'render{num}.py', rd('render016.py').replace('anim016.html', f'anim{num}.html').replace('render frames a..b of anim016.html', f'render frames a..b of anim{num}.html'))
wr('render_all.sh', rd('render_all.sh').replace('render016.py', f'render{num}.py'))
wr('finalize.sh', rd('finalize.sh').replace('상식실험실_실험016_맹자_주눅들지않는법_v1.mp4', f'상식실험실_실험{num}_{slug}_v1.mp4'))
wr(f'srt{num}.py', rd('srt016.py').replace('실험016_자막_v1', f'실험{num}_자막_v1'))
wr(f'mix{num}.py', '# TEMPLATE copied from 016 — 곡 선택, 전환 줄 번호(st(44) 등), 효과음 위치를 이 편에 맞게 바꿀 것\n' + rd('mix016.py'))
for f in ['tts38seg.py', 'tts_st.py', 'fake_tl.py', 'peek.py', 'peek3.py', '.gitignore']: shutil.copy(os.path.join(T, f), os.path.join(D, f))
for f in ['peek.py', 'peek3.py']: wr(f, open(os.path.join(D, f), encoding='utf-8').read().replace('anim016.html', f'anim{num}.html'))
wr('peekz.py', open(os.path.join(os.path.dirname(T), 'confucius017', 'peekz.py'), encoding='utf-8').read().replace('anim017.html', f'anim{num}.html'))
for f in ['render_all.sh', 'finalize.sh']: os.chmod(os.path.join(D, f), 0o755)
st = json.load(open(os.path.join(T, 'style38.json'), encoding='utf-8')); st['scene'] = {}; st['line'] = {}; st['seg'] = {}
json.dump(st, open(os.path.join(D, 'style38.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
wr('script.py', f"""# 실험 {num} · <제목> — <철학자/연구> (대본 1차)
# (scene, args, subtitle, spoken-or-None). args["segs"] = [(voice, text[, spoken])...] when a line mixes voices.
# args["silent"] = seconds of silence (no TTS); the text is shown on screen (message / card), not as a subtitle.
# Voices: N narrator, Z Zero, D doctor, ... (style38.json의 voices와 맞출 것)
# One image all the way: <비유>
# Story: <월~금 흐름, 반전 위치>
# Facts (checked YYYY-MM-DD): <원문 인용·연구: 저자 연도 학술지, 표본, 결과. 재현 실패 여부>
# <등장인물·사건 중 연출(허구)인 것>
S = [
]
""")
subprocess.run(['npm', 'i', '--silent', '--prefix', D, '@fontsource/nanum-pen-script'], check=False)
print('만듦:', D); print('\n'.join(sorted(os.listdir(D))))
