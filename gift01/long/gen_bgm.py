import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration.'
P = {
 'calc': 'Playful sneaky cartoon comedy music about a stingy little accountant counting money late at night: plucky pizzicato strings, a bouncy bassoon, light woodblock and tiny xylophone ticks like calculator buttons, cheeky and cute, major key, 104 BPM, about 1 minute.',
 'calc2': 'Playful cheeky cartoon comedy music for a stingy little coin character counting money at night: plucky pizzicato strings, a bouncy bassoon melody, light woodblock and soft xylophone, sneaky tiptoe rhythm, cute and funny, major key, 104 BPM, about 1 minute.',
 'lab': 'Curious light documentary music for a vintage 1970s psychology experiment: soft vibraphone and a warm Rhodes electric piano, gentle upright bass, a light brushed snare, thoughtful and a little playful, 92 BPM, about 1 minute.',
 'memory': 'Tender emotional piano music for finding an old note from a friend: a single warm felt piano melody, slow and intimate, soft cello joining gently later, bittersweet and moving, 70 BPM, about 1.5 minutes.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'bgm/{k}')
