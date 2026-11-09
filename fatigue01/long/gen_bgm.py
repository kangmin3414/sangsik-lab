import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration.'
P = {
 'ragtime': 'Old silent-film style honky-tonk piano ragtime, slightly stiff and mechanical like a factory rhythm, with a ticking woodblock, sepia old-timey comedy mood, 100 BPM, about 1 minute.' + NO,
 'uneasy': 'Subtle uneasy lo-fi electronic bed: soft muted synth pulses, a gentle ticking clock-like hi-hat, low warm bass, slightly anxious but calm, minor key, 80 BPM, sparse, about 2 minutes.' + NO,
 'warm': 'Warm gentle healing music: soft felt piano melody with a light acoustic guitar and soft strings, tender, hopeful and comforting, slow 72 BPM, about 2 minutes.' + NO,
}
for k in sys.argv[1:] or P: l3.gen(P[k], f'bgm/{k}')
