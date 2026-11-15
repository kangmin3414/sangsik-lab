"""죽음의 수용소에서 편 배경음(Lyria 3 Pro). 결과는 /dev/shm/fk/bgm/. python3 gen_bgm.py [이름…]"""
import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts')
OUT = '/dev/shm/fk/bgm'; os.makedirs(OUT, exist_ok=True)
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration, steady and loopable.'
P = {
 'night': 'Soft, cozy, comforting late-night theme for a cute healing video game: a gentle felt piano playing a simple tender melody over warm string pad and soft rain-like music box sparkles, a little tired but kind, like walking home after a long day and being told it is okay, slow and warm, never sad or dramatic, 72 BPM, about 80 seconds.',
 'story': 'Quiet, respectful storybook theme for a cute video game, telling a gentle tale from a cold winter long ago: a slow solo music box and soft celesta over a low warm cello drone and a hushed string pad, sparse and calm, a small warm glimmer of hope in the melody, never scary, never dramatic, no drums, 64 BPM, about 80 seconds.',
 'office': 'Light, gently quirky office theme for a cute healing video game: soft marimba and pizzicato strings with a warm felt piano, a little nervous and bouncy at first, then calm and kind, mid tempo 96 BPM, playful but soft, never loud, about 80 seconds.',
 'warm': 'Hopeful, warm wide-open theme for a cute healing video game world map: gentle piano arpeggios, soft strings swelling slowly, a light glockenspiel melody like dawn light spreading over a tiny town, 84 BPM, comforting and uplifting but quiet, about 90 seconds.',
 'meadow': 'Sunny, light and airy meadow theme for a cute healing video game: acoustic guitar picking, soft flute and gentle bells, birdsong-like little melodic flourishes played by instruments only, relaxed and carefree, 100 BPM, about 80 seconds.',
 'ending': 'Tender, emotional, warm ending theme for a cute healing video game: a simple heartfelt solo piano melody joined by soft warm strings and a gentle celesta, like a quiet hug at the end of a long day, slowly building to a gentle glow and fading softly, 70 BPM, never dramatic, about 100 seconds.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'{OUT}/{k}')
