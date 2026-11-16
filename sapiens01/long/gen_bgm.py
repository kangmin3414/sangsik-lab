"""사피엔스 편 배경음(Lyria 3 Pro). 결과는 /dev/shm/sp/bgm/. python3 gen_bgm.py [이름…]"""
import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts')
OUT = '/dev/shm/sp/bgm'; os.makedirs(OUT, exist_ok=True)
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration, steady and loopable.'
P = {
 'commute': 'Bouncy, quick and funny morning-rush theme for a cute 2D side-scrolling video game: an original chiptune-flavored lead on square-wave synth over plucky bass, light snare and claps, playful and slightly frantic like running late for work, major key, 132 BPM, about 60 seconds.',
 'savanna': 'Wondrous, gentle theme for a cute video game world map of an ancient grassland seen from above: warm kalimba and soft marimba melody, light hand percussion, airy flute pad, a sense of discovery and togetherness, 92 BPM, about 70 seconds.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'{OUT}/{k}')
