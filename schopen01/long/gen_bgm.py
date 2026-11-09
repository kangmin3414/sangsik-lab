import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration.'
P = {
 'quirky': 'Playful quirky comedy music: bouncy pizzicato strings, a cheeky bassoon, light glockenspiel accents and soft claps, mischievous and cute like a cartoon about a small everyday obsession, major key, 112 BPM, about 1 minute.',
 'flute': 'Elegant early-19th-century German chamber music: a solo wooden flute melody over soft string quartet and a gentle fortepiano, slightly grumpy but charming, Biedermeier salon mood, moderate 88 BPM, about 1 minute.',
 'tick': 'Curious contemplative cartoon music built on a steady clock tick: a wooden tick-tock percussion, music-box celesta motifs, soft pizzicato bass and a light clarinet, swinging back and forth like a pendulum, a little wistful, 96 BPM, about 2 minutes.',
 'sunset': 'Warm gentle healing music for a riverside sunset: soft felt piano melody, a light acoustic guitar, airy soft strings, tender and hopeful, slow 70 BPM, about 2 minutes.',
 'musicbox': 'A quiet lonely late-night music box lullaby with soft warm synth pad underneath, slow and tender, slightly unresolved and open-ended, 64 BPM, about 1 minute.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'bgm/{k}')
