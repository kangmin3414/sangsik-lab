"""원효 편 배경음(Lyria 3 Pro). 결과는 /dev/shm/wh/bgm/ (디스크 여유가 적어서). python3 gen_bgm.py [이름…]"""
import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts')
OUT = '/dev/shm/wh/bgm'; os.makedirs(OUT, exist_ok=True)
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration.'
P = {
 'office': 'Light, curious, slightly comic modern office underscore: plucky staccato piano, soft pizzicato strings, a gentle brushed snare, warm and playful, never sad, 96 BPM, about 90 seconds.',
 'silla': 'Calm, mysterious ancient Korean folk atmosphere: a plucked gayageum-like zither playing a sparse pentatonic melody, a soft low hand drum, a quiet held string drone, misty and storytelling, gently tense in the middle, never scary, 70 BPM, about 100 seconds.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'{OUT}/{k}')
