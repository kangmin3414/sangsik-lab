import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under narration.'
P = {
 'night': 'Quiet late-night ambient music for someone alone in bed at 2 am staring at a phone: soft warm synth pads, a slow sparse glassy electric piano, faint low hum, lonely and intimate but gentle, 66 BPM, about 1 minute.',
 'pizz': 'Playful deadpan cartoon comedy music about waiting hours for a friend to text back: plucky pizzicato strings, a bouncy tuba, light woodblock and tiny glockenspiel, cheeky and funny, major key, 100 BPM, about 1 minute.',
 'epiano': 'Minimal thoughtful electric piano music for a modern psychology experiment explainer: a warm Rhodes electric piano with soft repeating chords, light pulsing synth bass, gentle and curious, slightly reflective, 84 BPM, about 1.5 minutes.',
 'guitar': 'Warm tender acoustic guitar music for two old friends sharing hot soup on an early morning: fingerpicked nylon guitar, soft cello later, gentle and heartfelt, morning sunlight feeling, 76 BPM, about 1.5 minutes.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'bgm/{k}')
