"""하루는 작은 일생 편 배경음(Lyria 3 Pro). 결과는 /dev/shm/od/bgm/. python3 gen_bgm.py [이름…]"""
import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts')
OUT = '/dev/shm/od/bgm'; os.makedirs(OUT, exist_ok=True)
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration, steady and loopable.'
P = {
 'morning': 'Bright, cute, fresh morning theme for a cozy life-sim video game: sparkling glockenspiel and soft marimba playing a simple rising melody, light pizzicato strings, gentle ukulele strums, soft shaker, feels like opening a window on a sunny morning, playful and warm, never sad, 108 BPM, about 80 seconds.',
 'night': 'Soft, cozy bedtime theme for a cute video game at night: a gentle music box melody over warm felt piano chords and a soft string pad, slow and tender, a little sleepy, comforting, never sad, 70 BPM, about 70 seconds.',
 'day': 'Cute, bouncy, cheerful daytime theme for a cozy life-sim video game, a lunch-break and office feeling: plucky kalimba and pizzicato strings playing a catchy simple melody, soft clarinet answering phrases, light hand claps and shaker, playful and relaxed, never sad, 102 BPM, about 90 seconds.',
 'ending': 'Warm, gentle, heartfelt bedtime ending theme for a cute cozy video game: a simple tender piano melody with soft strings and a music box joining later, a little nostalgic, about a family saying good night, hopeful and comforting, slowly opening up, never sad, 74 BPM, about 80 seconds.',
 'story': 'Curious, gently humorous storybook theme for a cute video game, telling the tale of an old grumpy but kind philosopher from 19th-century Germany: plucked harpsichord-like strings and pizzicato, a playful bassoon answering phrases, soft glockenspiel, light and charming, never scary, 92 BPM, about 80 seconds.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'{OUT}/{k}')
