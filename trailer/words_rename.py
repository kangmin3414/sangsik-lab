"""words.json for the renamed trailer: old word times for unchanged lines (later lines shifted), fresh Whisper times for line 6."""
import json, numpy as np, soundfile as sf
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
OLD_T = json.load(open('_bak_rename/timeline.json'))['lines']; NEW_T = json.load(open('timeline.json'))['lines']
W0 = json.load(open('_bak_rename/words.json'))
o6, o7 = OLD_T[6]['t0'], OLD_T[7]['t0']; n6a, n6b, n7 = NEW_T[6]['t0'], NEW_T[6]['t1'], NEW_T[7]['t0']
delta = n7 - o7
keep = [w for w in W0 if w[1] < o6 - 0.1]
later = [[w[0], round(w[1] + delta, 2), round(w[2] + delta, 2)] for w in W0 if w[1] >= o7 - 0.1]
voice, sr = sf.read('voice.wav'); a = max(0.0, n6a - 0.25); b = n6b + 0.25
seg = voice[int(a * sr):int(b * sr)]
w16 = resample_poly(seg, 160, 441).astype(np.float32)
m = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=2)
sg, _ = m.transcribe(w16, language='ko', beam_size=5, word_timestamps=True, condition_on_previous_text=False, vad_filter=False)
mid = []
for x in sg:
    for wd in (x.words or []): mid.append([wd.word.strip(), round(a + wd.start, 2), round(a + wd.end, 2)])
W = keep + mid + later
json.dump(W, open('words.json', 'w'), ensure_ascii=False)
print('delta', round(delta, 3)); print('line6:', mid)
for need in ('직접', '술', '잠', '커피', '건강', '주말에는', '니체', '장자', '7시', '구독'):
    hit = [w for w in W if w[0].startswith(need)]; print(need, hit[:1])
