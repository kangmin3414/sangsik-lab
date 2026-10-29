"""Same pipeline as ../bgm/remix_all.py (strings bed looped with 6 s crossfades, ending on the song's ending; narration-first
mixer with ducking; 2-pass linear loudnorm I=-16 TP=-1.5 LRA=11) applied to the reordered voice. usage: mix_v9.py <voice wav> <dur s> <out wav>"""
import sys, os, json, subprocess, numpy as np, soundfile as sf
B = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'bgm')
src = open(os.path.join(B, 'remix_all.py')).read(); src = src[:src.index("EP = {")]
ns = {'__file__': os.path.join(B, 'remix_all.py')}; exec(compile(src, 'remix_head', 'exec'), ns)
voice_f, dur, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
SR = ns['SR']; voice, sr = sf.read(voice_f); assert sr == SR
N = int(dur * SR); voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]; voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
m = ns['mix'](voice, ns['bed'](dur), fade_in=1.5, fade_out=0.3); sf.write(out, m, SR)
r = subprocess.run(['ffmpeg', '-v', 'info', '-i', out, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
js = json.loads(r[r.rfind('{'):r.rfind('}') + 1])
ln = (f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}"
      f":measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true")
open(out + '.af', 'w').write(ln); print(ln)
