import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration.'
P = {
 'hustle': 'Bouncy upbeat quirky cartoon montage music: plucky ukulele, pizzicato strings, glockenspiel, snappy hand claps and a tight drum groove, energetic morning routine vibe, 116 BPM, cheerful and slightly frantic, about 1 minute.' + NO,
 'mystery': 'Playful cartoon detective mystery cue: sneaky pizzicato bass walking, muted trumpet-like synth stabs (no voice), tiptoe xylophone, light brushed drums, curious and comedic, 92 BPM, about 1 minute.' + NO,
}
for k in sys.argv[1:] or P: l3.gen(P[k], f'bgm/{k}')
