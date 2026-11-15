"""원효 편 v2(게임 감각) 배경음(Lyria 3 Pro). 결과는 /dev/shm/wh/bgm2/. python3 gen_bgm2.py [이름…]"""
import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts')
OUT = '/dev/shm/wh/bgm2'; os.makedirs(OUT, exist_ok=True)
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration, steady and loopable.'
P = {
 'town': 'Cute, bouncy, cozy town theme for a cheerful life-sim video game: marimba and pizzicato strings playing a simple catchy melody, soft glockenspiel sparkles, light ukulele chords, gentle shaker and a soft kick, relaxed and friendly, never sad, 104 BPM, about 90 seconds.',
 'town2': 'Cute, light, curious workday theme for a cheerful life-sim video game, a different melody from a typical town theme: plucky kalimba and pizzicato strings, soft clarinet answering phrases, light hand claps and shaker, playful and relaxed, never sad, 100 BPM, about 90 seconds.',
 'ending': 'Warm, gentle, heartfelt ending theme for a cute cozy video game: a simple tender piano melody with soft strings and a few glockenspiel notes, hopeful and comforting, slowly opening up, never sad, 78 BPM, about 70 seconds.',
 'oldtale': 'Gentle, curious storybook theme for a cute adventure video game set in ancient Korea: a plucked gayageum-like zither with soft marimba, a light wood block and a small hand drum, sparse pentatonic melody, calm and a little mysterious in the middle, never scary, 84 BPM, about 100 seconds.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'{OUT}/{k}')
