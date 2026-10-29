"""Voice the new intro lines with the episode's narrator settings (same as tts38mv.py: Schedar, base+scene style,
Whisper CER check, cap_pause, -21 dB active-RMS leveling). usage: python3 tts_new.py <ep dir> <lines json> [take offset]"""
import hashlib, json, os, sys, re
import numpy as np, soundfile as sf
G = os.path.join(os.path.dirname(os.path.abspath(sys.argv[1].rstrip('/'))), 'gtts')
sys.argv_saved = list(sys.argv)
EP = os.path.abspath(sys.argv[1]); LINES = json.load(open(sys.argv[2], encoding='utf-8')); OFF = int(sys.argv[3]) if len(sys.argv) > 3 else 0
STY = json.load(open(os.path.join(EP, 'style38.json'), encoding='utf-8'))
# reuse helper functions of tts38mv.py without running its main loop
src = open(os.path.join(G, 'tts38mv.py'), encoding='utf-8').read()
head = src[:src.index('chunks = [np.zeros')]
head = head.replace("D = os.path.abspath(sys.argv[1]); STY = json.load(open(sys.argv[2], encoding='utf-8'))", "D = EP_; STY = STY_")
head = head.replace("import script\nS = script.S\n", "S = []\n")
ns = {'__file__': os.path.join(G, 'tts38mv.py'), 'EP_': EP, 'STY_': STY}
exec(compile(head, 'tts38mv_head', 'exec'), ns)
os.chdir(EP); os.makedirs('v9/tts', exist_ok=True)
SR = ns['SR']; out = {}
for key, L in LINES.items():
    voice = STY['voices']['N']['name']
    style = STY['base'] + ' ' + STY.get('scene', {}).get(L['style_scene'], '')
    best = None
    for take in range(OFF, OFF + 3):
        h = hashlib.md5(f'{voice}|{style}|{L["spoken"]}|{take}'.encode()).hexdigest()[:12]
        w = ns['load_trim'](ns['synth'](L['spoken'], voice, style, f'v9/tts/{key}_{h}.wav'))
        if STY.get('cap_pause'): w = ns['cap_pauses'](w, STY['cap_pause'])
        c, hyp = ns['check'](w, L['text'])
        print(key, 'take', take, 'cer', round(c, 3), round(len(w) / SR, 2), hyp, flush=True)
        if best is None or c < best[0]: best = (c, w, hyp, take, h)
        if c <= 0.04: break
    c, w, hyp, take, h = best
    lv = 20 * np.log10(np.sqrt(np.mean(w[np.abs(w) > 0.01] ** 2)) + 1e-9)
    w = w * float(np.clip(10 ** ((-21.0 - lv) / 20), 0.7, 1.6))
    sf.write(f'v9/{key}.wav', w, SR, subtype='PCM_16')
    out[key] = {'cer': round(c, 3), 'take': take, 'dur': round(len(w) / SR, 3), 'hyp': hyp, 'file': f'v9/tts/{key}_{h}.wav'}
json.dump(out, open('v9/tts_new_report.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps(out, ensure_ascii=False, indent=1))
