import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration.'
P = {
 'night': 'Dreamy late-night bedroom music as someone drifts off to sleep: a soft music box and warm felt piano, a slow airy synth pad, gentle shimmering bells, hushed and magical like the start of a fairy-tale dream, 66 BPM, about 1 minute.',
 'vessel': 'Busy comic cartoon music for a tiny worker rushing nonstop through a bustling tunnel: bouncy pizzicato strings, a quick woodblock tick, a playful bassoon and bubbly marimba, hurried but cute, 128 BPM, about 1.5 minutes.',
 'void': 'Quiet floating ambient piece for drifting alone in darkness: soft sustained cello harmonics, airy glass harmonica tones, a few lonely celesta notes far apart, slow and tender, gently sad, 58 BPM, about 90 seconds.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'bgm/{k}')
