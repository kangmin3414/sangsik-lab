import json, numpy as np, soundfile as sf, supertonic as s
d = json.load(open('plan_v4.json'))
tts = s.TTS(model='supertonic-3'); st = tts.get_voice_style('M2'); SR = 44100
for ep, e in d['eps'].items():
    wav, dur = tts.synthesize(e['outro_say'], voice_style=st, lang='ko', total_steps=24, speed=0.97, silence_duration=0.2)
    w = np.asarray(wav).reshape(-1); thr = 0.01 * np.abs(w).max(); idx = np.where(np.abs(w) > thr)[0]
    w = w[max(0, idx[0] - int(0.03 * SR)):idx[-1] + int(0.06 * SR)]
    sf.write(f'outro_{ep}.wav', w, SR); print(ep, round(len(w) / SR, 2))
