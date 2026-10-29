import numpy as np, soundfile as sf, supertonic as s
tts = s.TTS(model='supertonic-3'); st = tts.get_voice_style('M2'); SR = 44100
wav, dur = tts.synthesize("뇌에서 벌어지는 변화 다섯 가지, 전체 영상에서 확인해 보세요.", voice_style=st, lang='ko', total_steps=12, speed=0.96, silence_duration=0.2)
w = np.asarray(wav).reshape(-1); thr = 0.01*np.abs(w).max(); idx = np.where(np.abs(w) > thr)[0]
w = w[max(0, idx[0]-int(0.03*SR)):idx[-1]+int(0.06*SR)]
sf.write("outro.wav", w, SR); print(round(len(w)/SR, 2))
