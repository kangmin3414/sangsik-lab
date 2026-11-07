import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration.'
P = {
 'quirky': 'Playful quirky comedy music: bouncy pizzicato strings, a cheeky bassoon, light glockenspiel accents and soft claps, mischievous and cute like a cartoon about a small everyday obsession, major key, 112 BPM, about 1 minute.',
 'flute': 'Elegant early-19th-century German chamber music: a solo wooden flute melody over soft string quartet and a gentle fortepiano, slightly grumpy but charming, Biedermeier salon mood, moderate 88 BPM, about 1 minute.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'bgm/{k}')
