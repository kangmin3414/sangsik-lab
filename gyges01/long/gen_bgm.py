"""기게스 편 배경음(Lyria 3 Pro). 결과는 /dev/shm/gy/bgm/. python3 gen_bgm.py [이름…]
대본 사운드 포인트: 0:00~0:35 긴장감 있는 8비트 펄스 → 0:35~2:55 리드미컬하고 경쾌한 추리·정보 비트 → 2:55 정적 1초 뒤 따뜻한 피아노."""
import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts')
OUT = '/dev/shm/gy/bgm'; os.makedirs(OUT, exist_ok=True)
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration, steady and loopable.'
P = {
 'exam': 'Tense but cute exam-countdown theme for a retro 8-bit video game: original chiptune square-wave arpeggios, a pulsing synth bass on steady eighth notes, a soft ticking hi-hat like a clock, small rising tension every four bars, minor key, 120 BPM, about 50 seconds.',
 'myth': 'Rhythmic, playful detective-and-discovery theme for a cute cartoon storybook video game set in ancient Greece: plucked lyre-like harp and pizzicato strings over a light bouncy beat with woodblock and soft kick, a curious sneaky melody on clarinet, upbeat and clever, 108 BPM, about 80 seconds.',
 'warm': 'Warm, tender piano theme for a healing cartoon: soft felt piano melody, gentle strings swelling slowly, light celesta sparkles, calm and hopeful, major key, 72 BPM, about 60 seconds.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'{OUT}/{k}')
