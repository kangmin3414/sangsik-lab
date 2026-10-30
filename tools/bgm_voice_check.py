"""배경음악·완성본에 사람 목소리(영어·한국어 속삭임 등)가 섞였는지 10초 단위로 검사한다. python3 tools/bgm_voice_check.py bgm/cand_*.mp3
   (완성본을 검사할 땐 내레이션이 한국어라 en만 보면 된다.) 2026-10-30: cand_1_piano_a, cand_4_celesta_a 에서 영어 속삭임 발견."""
import sys, subprocess, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel('base', device='cpu', compute_type='int8', cpu_threads=2)
for f in sys.argv[1:]:
    a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
    hits = []
    for st in range(0, len(a) // 16000, 10):
        segs, info = m.transcribe(a[st * 16000:(st + 10) * 16000], language=None, vad_filter=False, condition_on_previous_text=False, beam_size=1)
        txt = ' '.join(s.text.strip() for s in segs if s.no_speech_prob < 0.5)
        if info.language in ('en', 'ko') and info.language_probability > 0.8 and len(txt) > 3: hits.append(f'{st}s {info.language} {info.language_probability:.2f} {txt[:50]}')
    print('==', f.split('/')[-1], 'CLEAN' if not hits else 'VOICE?', *hits, sep='\n  ', flush=True)
