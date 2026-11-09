import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration.'
P = {
 'office': 'Light quirky cartoon comedy music for a tired office worker on a crowded morning subway: plucky pizzicato strings, a muted trumpet, soft woodblock clock ticks, a repeating mechanical little rhythm like a daily routine, cheeky and a bit weary, major key, 108 BPM, about 1 minute.',
 'myth': 'Slow mysterious ancient Greek myth music: a lyre-like plucked harp, a low warm cello drone, a soft frame drum heartbeat, a sense of an endless uphill struggle, thoughtful and solemn but not scary, D minor, 72 BPM, about 1 minute.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'bgm/{k}')
