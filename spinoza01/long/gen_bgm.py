import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration.'
P = {
 'moon': 'Very gentle sleepless-night music: a single slow felt piano with long pauses, soft warm low string pad underneath, moonlit, tender and a little lonely but comforting, never dark or scary, 56 BPM, about 100 seconds.',
 'lens': 'Quiet, warm, contemplative healing music: slow harp and soft felt piano, a gentle cello line, candlelight feeling, patient and kind, slowly opening with hope, 60 BPM, about 100 seconds.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'bgm/{k}')
