"""죽음의 수용소에서 편 배경음(Lyria 3 Pro). 결과는 /dev/shm/fk/bgm/. python3 gen_bgm.py [이름…]"""
import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts')
OUT = '/dev/shm/fk/bgm'; os.makedirs(OUT, exist_ok=True)
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration, steady and loopable.'
P = {
 'night': 'Soft, cozy, comforting late-night theme for a cute healing video game: a gentle felt piano playing a simple tender melody over warm string pad and soft rain-like music box sparkles, a little tired but kind, like walking home after a long day and being told it is okay, slow and warm, never sad or dramatic, 72 BPM, about 80 seconds.',
 'story': 'Quiet, respectful storybook theme for a cute video game, telling a gentle tale from a cold winter long ago: a slow solo music box and soft celesta over a low warm cello drone and a hushed string pad, sparse and calm, a small warm glimmer of hope in the melody, never scary, never dramatic, no drums, 64 BPM, about 80 seconds.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'{OUT}/{k}')
