import sys, numpy as np
import tts38seg as T
import librosa
tests = [(7,1),(12,1),(39,0),(2,1),(26,0),(6,1),(10,0),(36,0),(8,0)]
jobs=[]
for i,j in tests:
    v,txt,sp = T.segments(i)[j]; jobs.append((i,j,v,txt,sp,0))
T.synth_takes(jobs); T.check(jobs)
for (i,j,v,txt,sp,k) in jobs:
    w = T.load_trim(T.path_of(i,j,v,sp,k))
    f0,vf,_ = librosa.pyin(librosa.resample(w.astype(np.float32), orig_sr=44100, target_sr=16000), fmin=60, fmax=400, sr=16000)
    r = T.RES[T.key(i,j,v,sp,k)]
    print(i,j,v,T.voice_of(v),'f0 %.0f'%np.nanmedian(f0),'cer',r['cer'],'dur',r['dur'],'chars/s %.1f'%(len(T.hangul(sp))/r['dur']),'|',r['hyp'][:50])
