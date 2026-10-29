"""Voice the new intro lines with ep.008's narrator settings (tts38seg.py: Schedar, base+scene style, cap_pause [0.75,0.55],
Whisper CER, -21 dB active-RMS leveling clip 0.6..2.0). usage: python3 v9/tts_new8.py v9/new_lines.json [take offset]"""
import json, os, sys, hashlib
import numpy as np, soundfile as sf
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LINES = json.load(open(sys.argv[1], encoding='utf-8')); OFF = int(sys.argv[2]) if len(sys.argv) > 2 else 0
src = open(os.path.join(EP, 'tts38seg.py'), encoding='utf-8').read()
head = src[:src.index('ALL = [')].replace('from script import S', 'S = []')
ns = {'__file__': os.path.join(EP, 'tts38seg.py'), '__name__': 'tts38seg_head'}; exec(compile(head, 'tts38seg_head', 'exec'), ns)
os.chdir(EP); SR = ns['SR']; STY = ns['STY']; out = {}
for key, L in LINES.items():
    voice = STY['voices']['N']; style = STY['base'] + ' ' + STY['scene'][L['style_scene']]
    best = None
    for take in range(OFF, OFF + 3):
        h = hashlib.md5(f'{voice}|{style}|{L["spoken"]}|{take}'.encode()).hexdigest()[:10]
        p = ns['synth_one'](L['spoken'], voice, style, f'v9/tts/{key}_{h}.wav')
        w = ns['load_trim'](p, STY.get('cap_pause')); hyp = ns['asr'](w); c = ns['cer'](hyp, L['text'], L['spoken'])
        print(key, 'take', take, 'cer', round(c, 3), round(len(w) / SR, 2), hyp, flush=True)
        if best is None or c < best[0]: best = (c, w, hyp, take, p)
        if c <= 0.04: break
    c, w, hyp, take, p = best
    lv = 20 * np.log10(np.sqrt(np.mean(w[np.abs(w) > 0.01] ** 2)) + 1e-9); w = w * float(np.clip(10 ** ((-21.0 - lv) / 20), 0.6, 2.0))
    sf.write(f'v9/{key}.wav', w, SR, subtype='PCM_16')
    out[key] = {'cer': round(c, 3), 'take': take, 'dur': round(len(w) / SR, 3), 'hyp': hyp, 'file': p}
json.dump(out, open('v9/tts_new_report.json', 'w'), ensure_ascii=False, indent=1); print(json.dumps(out, ensure_ascii=False))
