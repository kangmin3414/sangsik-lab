import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Loopable, steady, background music under narration, about 2 minutes.'
P = {
 'myst_a': 'Curious, playful mystery underscore for a cartoon about a man who notices tiny glitches in reality: soft pizzicato strings, light marimba, gentle retro computer bleeps and a soft bit-crushed synth arpeggio, muted kick, quirky but slightly eerie, 92 BPM.' + NO,
 'cosmic_a': 'Calm, awe-inspiring cosmic ambient underscore for a science documentary about the universe: wide warm synth pads, a slow twinkling arpeggio, soft deep bass swells, gentle and thoughtful, 70 BPM, sparse.' + NO,
}
for k in sys.argv[1:] or P:
    if not sys.argv[1:] and any(os.path.exists(f'bgm/{k}.{e}') for e in ('mp3', 'wav')): continue
    l3.gen(P[k], f'bgm/{k}')
