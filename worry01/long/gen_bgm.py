import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration.'
P = {
 'mystic': 'Mysterious, wondrous music for walking inside a glowing golden web in a dark dream world: slow harp arpeggios, soft glass bells, a warm low string pad, gentle and curious, a little magical, 70 BPM, about 90 seconds.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'bgm/{k}')
