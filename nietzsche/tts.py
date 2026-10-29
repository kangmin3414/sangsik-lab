import json, numpy as np, soundfile as sf, supertonic as s
from script import S
tts = s.TTS(model='supertonic-3')
st = tts.get_voice_style('M2')
SR = 44100
chunks=[]; tl=[]; t=0.8
chunks.append(np.zeros(int(0.8*SR)))
for i,(scene,args,sub,spk) in enumerate(S):
    text = (spk or sub).replace("'", "")
    wav, dur = tts.synthesize(text, voice_style=st, lang='ko', total_steps=12, speed=0.96, silence_duration=0.2)
    w = np.asarray(wav).reshape(-1)
    # trim leading/trailing silence
    thr = 0.01*np.abs(w).max(); idx=np.where(np.abs(w)>thr)[0]
    w = w[max(0,idx[0]-int(0.03*SR)):idx[-1]+int(0.06*SR)]
    d = len(w)/SR
    tl.append({"i":i,"scene":scene,"args":args,"sub":sub,"t0":round(t,3),"t1":round(t+d,3)})
    chunks.append(w); t+=d
    gap = 0.95 if scene=="chapter" or (i+1<len(S) and S[i+1][0]=="chapter") else 0.42
    chunks.append(np.zeros(int(gap*SR))); t+=gap
chunks.append(np.zeros(int(2.0*SR))); t+=2.0
voice=np.concatenate(chunks)
sf.write("voice.wav", voice, SR)
json.dump({"duration":round(t,3),"lines":tl}, open("timeline.json","w"), ensure_ascii=False, indent=1)
print("total %.1fs, lines %d"%(t,len(tl)))
# lip-sync envelope for the narrator (24 fps)
FPS = 24; hop = SR // FPS
nfr = int(t * FPS) + 1
pad = np.pad(voice, (0, max(0, nfr * hop - len(voice))))
rms = np.sqrt(np.mean(pad[:nfr * hop].reshape(nfr, hop) ** 2, axis=1))
envv = np.clip(rms / (np.percentile(rms[rms > 1e-4], 90) + 1e-9), 0, 1)
d = json.load(open("timeline.json")); d["env"] = [round(float(v), 2) for v in envv]
json.dump(d, open("timeline.json", "w"), ensure_ascii=False, indent=1)
print("env frames", nfr)
