import supertonic as s, inspect, numpy as np
tts = s.TTS(model='supertonic-3')
print(inspect.signature(tts.get_voice_style))
import os
md = getattr(tts, 'model_dir', None); print('dir', md)
for root, ds, fs in os.walk(str(md) if md else os.path.expanduser('~/.cache')):
    for f in fs:
        if 'voice' in root.lower() or f.endswith('.json'): print(os.path.join(root, f))
