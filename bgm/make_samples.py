import sys, subprocess, json, numpy as np, soundfile as sf
from mixer import mix, load_music, SR
T0, T1 = 0.0, 76.0
V = '../nietzsche3/상식실험실_실험005_현대에서니체처럼살기_v3.mp4'
voice, sr = sf.read('../nietzsche3/voice.wav'); assert sr == SR
voice = voice[int(T0 * SR):int(T1 * SR)]
voice = voice / (np.abs(voice).max() + 1e-9) * 0.9
PICK = [('1', '피아노', 'cand_1_piano_b.mp3'), ('2', '피아노와현악', 'cand_2_strings_b.mp3'), ('3', '기타와첼로', 'cand_3_guitar_a.mp3'),
        ('4', '오르골', 'cand_4_celesta_a.mp3'), ('5', '앰비언트', 'cand_5_ambient_a.mp3')]
LABEL = {'0': '지금 버전 (장면마다 음악이 바뀜)', '1': '후보 1 · 따뜻한 피아노', '2': '후보 2 · 피아노와 현악',
         '3': '후보 3 · 기타와 첼로', '4': '후보 4 · 오르골과 패드', '5': '후보 5 · 잔잔한 앰비언트'}
import os; os.makedirs('out', exist_ok=True)
for n, name, fn in PICK:
    sf.write(f'out/mix_{n}.wav', mix(voice, load_music(fn)), SR)
# current version audio for comparison
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', str(T0), '-t', str(T1 - T0), '-i', V, '-vn', '-ac', '2', '-ar', str(SR), 'out/mix_0.wav'], check=True)
FONT = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
names = {'0': '지금버전'} | {n: nm for n, nm, _ in PICK}
for n in ['0'] + [p[0] for p in PICK]:
    # two-pass loudnorm to -16 LUFS, linear
    r = subprocess.run(['ffmpeg', '-v', 'info', '-i', f'out/mix_{n}.wav', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    js = json.loads(r[r.rfind('{'):r.rfind('}') + 1])
    ln = f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true"
    lab = LABEL[n].replace(':', '\\:')
    vf = (f"scale=1280:-2,drawbox=x=24:y=20:w=iw*0.42:h=58:color=black@0.55:t=fill,"
          f"drawtext=fontfile={FONT}:text='{lab}':x=40:y=34:fontsize=30:fontcolor=white")
    out = f'out/BGM샘플_{n}_{names[n]}.mp4'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', str(T0), '-t', str(T1 - T0), '-i', V, '-i', f'out/mix_{n}.wav',
                    '-map', '0:v', '-map', '1:a', '-vf', vf, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24',
                    '-af', ln, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], check=True)
    print('made', out)
