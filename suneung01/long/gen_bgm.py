import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration.'
P = {
 'eve': 'Quiet tense late-night music for a sleepless student the night before a big exam: a soft felt piano repeating a gentle uneasy motif, a steady quiet clock-tick percussion, a low warm cello drone, hushed and intimate, slightly anxious but tender, 72 BPM, about 1 minute.',
 'oracle': 'Comic mysterious fortune-teller cartoon music: a twinkling celesta and harp glissandos, a sneaky bass clarinet and pizzicato strings, a little dramatic timpani roll, spooky but cute and silly, minor key, 90 BPM, about 1 minute.',
 'memory': 'Tender nostalgic montage music looking back over many years: a warm felt piano melody that slowly grows, soft strings joining halfway, a gentle music-box sparkle, bittersweet and comforting, 80 BPM, about 1 minute.',
 'morning': 'Hopeful but nervous early-morning music on a big exam day: a light ticking pizzicato, a gentle clarinet and soft piano, quietly brave and warm, 92 BPM, about 1 minute.',
 'dusk': 'Emotional open-ended music at sunset after a long day: slow warm piano with soft strings swelling gently, hopeful but unresolved, moving and quiet, 68 BPM, about 1.5 minutes.',
 'bench': 'Warm gentle late-night music outside a convenience store in winter: soft electric piano chords, a light brushed beat, mellow upright bass, a hint of vinyl warmth, cozy and comforting with a small ache, 76 BPM, about 2 minutes.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'bgm/{k}')
