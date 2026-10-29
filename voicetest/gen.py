# narration A/B samples for the user: current vs rewritten styles, voice lineup, character voices
import json, numpy as np, soundfile as sf, supertonic as s
SR = 44100
tts = s.TTS(model='supertonic-3')
V = {n: tts.get_voice_style(n) for n in tts.voice_style_names}
def trim(w):
    thr = 0.01 * np.abs(w).max(); idx = np.where(np.abs(w) > thr)[0]
    return w[max(0, idx[0] - int(0.03 * SR)):idx[-1] + int(0.08 * SR)]
def say(text, voice='M2', speed=0.95):
    w, _ = tts.synthesize(text, voice_style=V[voice], lang='ko', total_steps=24, speed=speed, silence_duration=0.2)
    return trim(np.asarray(w).reshape(-1))
def sil(t): return np.zeros(int(t * SR))
def norm(x): return x / (np.abs(x).max() + 1e-9) * 0.9
def save(name, parts): sf.write(name, norm(np.concatenate(parts)), SR); print(name, round(sum(len(p) for p in parts) / SR, 1))
# 1) current narration, cut from the finished Buddha voice track (lines 4..9)
tl = json.load(open('../buddha/timeline.json'))['lines']; v, _ = sf.read('../buddha/voice.wav')
a, b = tl[4]['t0'] - 0.1, tl[9]['t1'] + 0.3
save('1_지금방식.wav', [v[int(a * SR):int(b * SR)]])
# sentence-level synthesis with designed breathing: (text, pause after)
DOC = [("이 문제를 평생 붙잡고 산 사람이 있습니다.", 0.55), ("약 2,500년 전, 히말라야 아래 작은 나라의 왕자.", 0.3), ("싯다르타.", 0.7),
       ("아버지는 아들 눈에 슬픈 건 하나도 보이지 않게 했습니다.", 0.35), ("궁 안엔 꽃과 음악, 맛있는 음식뿐.", 0.7),
       ("그런데 성 밖으로 나간 날, 왕자는 처음으로 봅니다.", 0.4), ("늙은 사람.", 0.3), ("병든 사람.", 0.3), ("그리고, 장례 행렬.", 0.7),
       ("마지막으로, 한 수행자.", 0.3), ("가진 건 아무것도 없는데, 얼굴이 이상할 만큼 평온했죠.", 0.8),
       ("스물아홉 살.", 0.35), ("왕자는 궁을 나섭니다.", 0.4), ("좋은 것도 결국 다 지나간다면, 진짜 평온은 어디에 있을까.", 0.5)]
TALK = [("그런데 이 문제를 평생 붙잡고 산 사람이 있거든요.", 0.55), ("약 2,500년 전, 히말라야 아래 작은 나라의 왕자, 싯다르타.", 0.7),
        ("아버지는 아들이 슬픈 걸 하나도 못 보게 했대요.", 0.3), ("궁 안엔 꽃이랑 음악, 맛있는 음식만 가득.", 0.7),
        ("근데 성 밖에 나간 날, 처음 보게 되죠.", 0.35), ("늙은 사람, 병든 사람, 그리고 장례 행렬까지.", 0.7),
        ("마지막엔 수행자 한 명.", 0.3), ("가진 건 하나도 없는데, 표정이 너무 편안한 거예요.", 0.8),
        ("스물아홉, 왕자는 결국 궁을 나옵니다.", 0.4), ("좋은 것도 다 지나간다면, 진짜 평온은 대체 어디 있을까?", 0.5)]
fix = lambda t: t.replace('2,500년', '이천오백 년')
save('2_다큐체.wav', sum([[say(fix(t)), sil(p)] for t, p in DOC], []))
save('3_대화체.wav', sum([[say(fix(t)), sil(p)] for t, p in TALK], []))
# 4) voice lineup: one line in every voice
line = "스물아홉 살. 왕자는 궁을 나섭니다."
parts = []
for n in ['M1', 'M2', 'M3', 'M4', 'M5', 'F1', 'F2', 'F3', 'F4', 'F5']:
    w = say(line, n); parts += [w, sil(1.0)]
    seg = w[len(w) // 4: 3 * len(w) // 4]
    # rough pitch: autocorrelation on 40 ms frames
    f0s = []
    for i in range(0, len(seg) - 1764, 1764):
        fr = seg[i:i + 1764] * np.hanning(1764)
        if np.sqrt(np.mean(fr ** 2)) < 0.02: continue
        ac = np.correlate(fr, fr, 'full')[1763:]; lo, hi = SR // 400, SR // 70
        k = lo + np.argmax(ac[lo:hi]); f0s.append(SR / k)
    print(n, 'median f0 %.0f Hz' % np.median(f0s))
save('4_목소리후보10종.wav', parts)
