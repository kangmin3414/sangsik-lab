import sys, json, time
sys.path.insert(0, '../gtts')
import vx
def gen(prompt, out, model='lyria-3-pro-preview'):
    t = time.time()
    code, js = vx.generate(model, {'contents': [{'role': 'user', 'parts': [{'text': prompt}]}],
                                   'generationConfig': {'responseModalities': ['AUDIO', 'TEXT']}}, location='global', retries=2)
    if code != 200:
        print(out, code, str(js)[:400]); return None
    parts, text = vx.inline_parts(js)
    for m, b in parts:
        ext = 'wav' if 'wav' in m else ('mp3' if 'mpeg' in m or 'mp3' in m else m.split('/')[-1])
        fn = f'{out}.{ext}'; open(fn, 'wb').write(b)
        print(out, m, len(b), 'in %.0fs' % (time.time() - t), '|', (text or '')[:300].replace('\n', ' '))
        return fn
    print(out, 'no audio', str(js)[:400])
if __name__ == '__main__':
    gen(sys.argv[1], sys.argv[2], *(sys.argv[3:4]))
