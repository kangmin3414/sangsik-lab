import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); os.chdir(os.path.dirname(os.path.abspath(__file__)))
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Loopable, steady, background music under narration, about 2 minutes.'
P = {
 'tense_a': 'Quiet, cool suspense underscore for a modern office drama cartoon: soft ticking pulse, low muted piano notes, cold airy synth pad, a faint heartbeat-like bass, sparse and unsettling but restrained, 76 BPM.' + NO,
 'tense_b': 'Minimal suspense lo-fi for a sly office villain: muted plucked strings, low clarinet-like synth (no voice), soft brushed snare, slightly sinister and sneaky, 80 BPM, sparse.' + NO,
 'cool_a': 'Confident, cool and steady underscore for a calm comeback: tight minimal hip-hop drums, deep warm bass, clean electric piano stabs, poised and in control, not aggressive, 90 BPM.' + NO,
 'warm_a': 'Warm gentle healing piano with soft strings, tender and comforting, quiet and hopeful, slow 70 BPM, simple.' + NO,
}
for k in sys.argv[1:] or P:
    if not sys.argv[1:] and any(os.path.exists(f'bgm/{k}.{e}') for e in ('mp3', 'wav')): continue
    l3.gen(P[k], f'bgm/{k}')
