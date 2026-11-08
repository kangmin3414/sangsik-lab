import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration.'
P = {
 'rush': 'Busy comic morning-commute cartoon music: a bouncy tuba and pizzicato bass line, quick ticking woodblock, a cheeky clarinet melody that gets heavier and slower as if carrying a weight, playful, 112 BPM, about 1 minute.',
 'greek': 'Relaxed sunny ancient Greek cartoon music: a plucked lyre and a breathy wooden flute, light frame drum, lazy and warm like an afternoon nap in the sun, gently humorous, 84 BPM, about 1.5 minutes.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'bgm/{k}')
