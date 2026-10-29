import json, numpy as np, soundfile as sf, supertonic as s
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
from script import S
import tts2
tts = s.TTS(model='supertonic-3'); st = tts.get_voice_style('M2')
m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=2)
force = json.load(open('force.json')) if __import__('os').path.exists('force.json') else {}
for i in (6, 8, 17):
    sc, a, sub, spk = S[i]
    best = None
    for k in range(3, 11):
        sp = tts2.speed_for(i, sc, a) + [0, -0.02, 0.02, -0.035, 0.01, -0.01, 0.03, -0.025][k - 3]
        w, _ = tts.synthesize(spk.replace("'", ""), voice_style=st, lang='ko', total_steps=24, speed=sp, silence_duration=0.25)
        w = tts2.trim(np.asarray(w).reshape(-1))
        segs, _ = m.transcribe(resample_poly(w, 160, 441).astype(np.float32), language='ko', beam_size=1)
        txt = ''.join(x.text for x in segs); c = tts2.cer(txt, sub)
        print(i, k, round(c, 3), txt[:70], flush=True)
        if '회자' not in txt and ('해자' in txt or '혜자' in txt) and c < 0.075:
            sf.write('takes/%02d_%d.wav' % (i, k), w, 44100); force[str(i)] = k; best = k; break
    print('line', i, '->', best, flush=True)
json.dump(force, open('force.json', 'w'))
