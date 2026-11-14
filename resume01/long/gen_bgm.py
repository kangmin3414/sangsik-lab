"""자소서 편 배경음(Lyria 3 Pro). 결과는 /dev/shm/rs/bgm/ (디스크가 차서). python3 gen_bgm.py [이름…]"""
import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts')
OUT = '/dev/shm/rs/bgm'; os.makedirs(OUT, exist_ok=True)
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration.'
P = {
 'night': 'Quiet late-night study-desk underscore: sparse felt piano notes with long gaps, a soft warm synth pad, a faint slow pulse, slightly restless yet tender and bright, never dark, 58 BPM, about 100 seconds.',
 'first': 'Calm, neutral slow piano music that starts light and a little proud, then very gradually grows uneasy: a repeating soft felt piano figure, quiet low pizzicato pulse, a thin held string note, restrained and observational, never dramatic, never scary, no big hits, 64 BPM, about 120 seconds.',
 'second': 'Humble, warm, quietly hopeful music: slow felt piano and soft acoustic guitar, a gentle clarinet line, like starting over on an ordinary morning, modest and sincere, slowly brightening, 66 BPM, about 100 seconds.',
 'seven': 'Reflective, warm, open-ended music for a quiet office afternoon years later: slow felt piano melody with soft strings, thoughtful and kind, ends unresolved on a gentle held note like an open question, 60 BPM, about 100 seconds.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'{OUT}/{k}')
