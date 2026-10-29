"""Re-make an older long-form (sugar / nietzsche pipeline: tts.py one take per line) with the new channel name.
Only the closing line is re-synthesised and spliced into the existing narration; everything else stays as it was.
usage: python3 lf_old_rename.py <folder> <anim.html> <render.py> <out.mp4> <srt name>"""
import json, os, re, shutil, subprocess, sys
import numpy as np, soundfile as sf

SP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d, ANIM, RENDER, OUT, SRT = sys.argv[1:6]
os.chdir(os.path.join(SP, d)); sys.path.insert(0, os.getcwd())
SR = 44100
OLD, NEW = '만약에연구소였습니다.', '상식실험실이었습니다.'


def log(*a): print('[%s]' % d, *a, flush=True)


# 1) backups (once)
for f in ('voice.wav', 'timeline.json', 'mix.wav', 'script.py', ANIM):
    b = f + '.bak_rename'
    if not os.path.exists(b): shutil.copy2(f, b)

# 2) text swaps: closing line + watermark / 'next experiment' label in the animation
s = open('script.py', encoding='utf-8').read()
if OLD in s: open('script.py', 'w', encoding='utf-8').write(s.replace(OLD, NEW))
a = open(ANIM, encoding='utf-8').read()
if '만약에연구소' in a: open(ANIM, 'w', encoding='utf-8').write(a.replace('만약에연구소', '상식실험실'))
import importlib, script; importlib.reload(script)
S = script.S
scene, args, sub, spk = S[-1]
assert NEW in sub, sub
text = (spk or sub).replace("'", "")

# 3) closing line: 3 takes, Whisper picks the clearest
import supertonic as stn
tts = stn.TTS(model='supertonic-3'); st = tts.get_voice_style('M2')
takes = []
for k in range(3):
    w, _ = tts.synthesize(text, voice_style=st, lang='ko', total_steps=12, speed=0.96 + (0, -0.02, 0.02)[k], silence_duration=0.2)
    w = np.asarray(w).reshape(-1); thr = 0.01 * np.abs(w).max(); idx = np.where(np.abs(w) > thr)[0]
    takes.append(w[max(0, idx[0] - int(0.03 * SR)):idx[-1] + int(0.06 * SR)])
from faster_whisper import WhisperModel
from scipy.signal import resample_poly
m = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=2)
norm = lambda t: re.sub(r'[^0-9A-Za-z가-힣%]', '', t)
def cer(a, b):
    a, b = norm(a), norm(b); dd = list(range(len(b) + 1))
    for x in a:
        prev, dd[0] = dd[0], dd[0] + 1
        for j, y in enumerate(b, 1): prev, dd[j] = dd[j], min(dd[j] + 1, dd[j - 1] + 1, prev + (x != y))
    return dd[len(b)] / max(1, len(b))
scores = []
for w in takes:
    w16 = resample_poly(np.pad(w, (int(0.2 * SR), int(0.2 * SR))), 160, 441).astype(np.float32)
    sg, _ = m.transcribe(w16, language='ko', beam_size=1, condition_on_previous_text=False, vad_filter=False)
    txt = ''.join(x.text for x in sg).strip(); scores.append((cer(txt, text), txt))
best = min(range(3), key=lambda k: scores[k][0])
log('closing line takes', [round(c, 3) for c, _ in scores], '->', best, scores[best][1])
line = takes[best]

# 4) splice into the narration (same gaps as tts.py: 0.42 s after the last line + 2.0 s tail)
tl = json.load(open('timeline.json.bak_rename')); L = tl['lines']
voice, vsr = sf.read('voice.wav.bak_rename'); assert vsr == SR
t0 = L[-1]['t0']
new_voice = np.concatenate([voice[:int(round(t0 * SR))], line, np.zeros(int(0.42 * SR)), np.zeros(int(2.0 * SR))])
sf.write('voice.wav', new_voice, SR)
L[-1]['t1'] = round(t0 + len(line) / SR, 3)
tl['duration'] = round(t0 + len(line) / SR + 0.42 + 2.0, 3)
FPS = 24; hop = SR // FPS; nfr = int(tl['duration'] * FPS) + 1
pad = np.pad(new_voice, (0, max(0, nfr * hop - len(new_voice))))
rms = np.sqrt(np.mean(pad[:nfr * hop].reshape(nfr, hop) ** 2, axis=1))
tl['env'] = [round(float(v), 2) for v in np.clip(rms / (np.percentile(rms[rms > 1e-4], 90) + 1e-9), 0, 1)]
json.dump(tl, open('timeline.json', 'w'), ensure_ascii=False, indent=1)
log('duration', json.load(open('timeline.json.bak_rename'))['duration'], '->', tl['duration'])

# 5) music mix (mix.py reproduces the published mix exactly), subtitles
subprocess.run(['nice', '-n', '5', 'python3', 'mix.py'], check=True, stdout=subprocess.DEVNULL)
srt_src = open('srt.py' if os.path.exists('srt.py') else os.path.join(SP, 'nietzsche', 'srt.py'), encoding='utf-8').read()
srt_src = re.sub(r'open\("[^"]+\.srt"', 'open("%s"' % SRT, srt_src)
open('_srt_rename.py', 'w', encoding='utf-8').write(srt_src)
subprocess.run(['python3', '_srt_rename.py'], check=True, stdout=subprocess.DEVNULL)

# 6) frames (2 processes) + encode
N = int(tl['duration'] * 24); H = N // 2
shutil.rmtree('frames', ignore_errors=True); os.makedirs('frames')
log('render', N, 'frames')
p1 = subprocess.Popen(['nice', '-n', '5', 'python3', RENDER, '0', str(H)], stdout=open('r1_rename.log', 'w'), stderr=subprocess.STDOUT)
p2 = subprocess.Popen(['nice', '-n', '5', 'python3', RENDER, str(H), str(N + 1)], stdout=open('r2_rename.log', 'w'), stderr=subprocess.STDOUT)
assert p1.wait() == 0 and p2.wait() == 0, 'render failed'
log('encode')
subprocess.run(['nice', '-n', '5', 'ffmpeg', '-v', 'error', '-y', '-framerate', '24', '-i', 'frames/f%05d.jpg', '-i', 'mix.wav',
                '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '44100', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19',
                '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', OUT], check=True)
shutil.rmtree('frames', ignore_errors=True)
dur = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', OUT], capture_output=True, text=True).stdout.strip()
log('DONE', OUT, dur)
