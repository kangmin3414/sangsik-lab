import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration.'
P = {
 'guitar': 'Quiet late-night acoustic music for two old friends talking softly at a table outside a convenience store: a gentle fingerpicked nylon-string guitar, soft warm bass, faint vinyl warmth, tender and a little sad, 72 BPM, about 90 seconds.',
 'curious': 'Light curious science-explainer music: soft pizzicato strings, a ticking clock-like marimba, gentle celesta sparkles, a warm low cello, wondering and calm, 88 BPM, about 90 seconds.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'bgm/{k}')
