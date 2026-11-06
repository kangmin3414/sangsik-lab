import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Loopable, steady, background music under narration, about 2 minutes.'
P = {
 'noir_a': 'Late-night lo-fi noir jazz for a cozy, slightly mischievous cartoon: soft brushed drums, upright bass walking slowly, muted Rhodes chords, light vinyl crackle, a little playful pizzicato now and then, rainy city at 2am mood, 84 BPM.' + NO,
 'noir_b': 'Quirky late-night jazz-hop for a comedic cartoon repair shop: dusty boom-bap drums, warm upright bass, muted electric piano, occasional clarinet-like synth lead phrases (no voice), rain ambience, sly and cheeky, 88 BPM.' + NO,
 'warm_a': 'Warm gentle healing piano with soft strings and a felt piano melody, tender and comforting, like a kind hand on the shoulder late at night, slow 70 BPM, simple and quiet.' + NO,
}
for k in sys.argv[1:] or P: l3.gen(P[k], f'bgm/{k}')
