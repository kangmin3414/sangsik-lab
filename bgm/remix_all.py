import sys, os, re, json, glob, subprocess, numpy as np, soundfile as sf, librosa
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mixer import mix, SR
TRACK = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cand_2_strings_b.mp3')
BODY_END, XF = 171.0, 6.0
song, _ = librosa.load(TRACK, sr=SR, mono=False); song = song.T

def bed(dur):
    """loop the song with 6 s crossfades; the last pass ends on the song's own ending at the video's end."""
    N = int(dur * SR); out = np.zeros((N, 2)); L = len(song)
    start = N - L - int(0.3 * SR)           # last copy: natural ending lands 0.3 s before the end
    starts = [start]; step = int((BODY_END - XF) * SR)
    while starts[0] > 0: starts.insert(0, starts[0] - step)
    for k, s in enumerate(starts):
        seg = song.copy() if k == len(starts) - 1 else song[:int(BODY_END * SR)].copy()
        if k < len(starts) - 1:             # fade out tail into next copy
            x = int(XF * SR); seg[-x:] *= np.linspace(1, 0, x)[:, None] ** 0.5
        if k > 0:
            x = int(XF * SR); seg[:x] *= np.linspace(0, 1, x)[:, None] ** 0.5
        a, b = max(0, s), min(N, s + len(seg))
        if b > a: out[a:b] += seg[a - s:b - s]
    return out

EP = {'nietzsche3': 'v3', 'stoic3': 'v4', 'descartes4': 'v6', 'zhuangzi5': 'v6', 'socrates3': 'v4', 'buddha3': 'v4'}
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for d in (sys.argv[1:] or EP):
    v = EP[d]
    src = [f for f in glob.glob(f'{root}/{d}/상식실험실_*_{v}.mp4')][0]
    dst = src[:-len(v) - 4] + 'v' + str(int(v[1:]) + 1) + '.mp4'
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src]))
    voice, sr = sf.read(f'{root}/{d}/voice.wav'); assert sr == SR
    if voice.ndim > 1: voice = voice.mean(1)
    N = int(dur * SR); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
    voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
    m = mix(voice, bed(dur), fade_in=1.5, fade_out=0.3)
    wav = f'{root}/{d}/mix_bgm2.wav'; sf.write(wav, m, SR)
    r = subprocess.run(['ffmpeg', '-v', 'info', '-i', wav, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    js = json.loads(r[r.rfind('{'):r.rfind('}') + 1])
    ln = (f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}"
          f":measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true")
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                    '-af', ln, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-t', str(dur), '-movflags', '+faststart', dst], check=True)
    print('done', d, '%.1fs' % dur, os.path.basename(dst), flush=True)
