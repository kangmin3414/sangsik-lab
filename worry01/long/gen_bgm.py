import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration.'
P = {
 'mystic': 'Mysterious, wondrous music for walking inside a glowing golden web in a dark dream world: slow harp arpeggios, soft glass bells, a warm low string pad, gentle and curious, a little magical, 70 BPM, about 90 seconds.',
 'mystic2': 'Curious, slightly suspenseful fairy-tale music for crossing a foggy bridge and facing a big shadow: soft pizzicato strings, a tiptoeing clarinet, light harp, gentle timpani swells, playful not scary, 84 BPM, about 100 seconds.',
 'tender': 'Tender, heartfelt music for comforting a small frightened friend: slow warm felt piano, soft cello melody, gentle strings swelling with warmth, intimate and moving, 62 BPM, about 80 seconds.',
 'morning': 'Hopeful quiet Monday-morning music: bright soft piano, light acoustic guitar, airy strings, calm and open-ended, a gentle sense of stepping forward, 80 BPM, about 45 seconds.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'bgm/{k}')
