"""Re-cut Stoic (006 v5) Shorts: two segments of the long-form in swapped order (hook first),
whole Short at 1.15x, fixed top title, no outro/CTA card, hard cut on the last word so it loops.
Output: replace/out_remix006/"""
import os, re, subprocess, json
import numpy as np, soundfile as sf
from playwright.sync_api import sync_playwright

R = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(R)
SD = os.path.join(ROOT, 'stoic3'); VID = os.path.join(SD, '상식실험실_실험006_스토아철학자처럼일주일_v5.mp4')
MIX = os.path.join(SD, 'mix_bgm2.wav'); SRT = os.path.join(SD, '상식실험실_실험006_자막_v4.srt')
OUT = os.path.join(R, 'out_remix006'); WORK = os.path.join(R, 'work_remix006')
os.makedirs(OUT, exist_ok=True); os.makedirs(WORK, exist_ok=True)
SP = 1.15; FPS = 24; SR = 44100
EP = {'theme': ['#0C0A04', '#3A2E12', '#120E06'], 'accent': '#F7D27A', 'tag': '상식실험실 · 스토아 철학', 'cta': ['', '']}

SHORTS = [
    {'name': '006r-1_걱정91', 'title': ['걱정의 91%는', '일어나지 않는다?'],
     'segs': [(89.94, 111.62), (70.63, 89.95)]},
    {'name': '006r-2_3인칭', 'title': ["나한테 화났을 때", "'3인칭'으로 불러보세요"],
     'segs': [(201.80, 219.90), (186.72, 201.30)]},
    {'name': '006r-3_컵깨기', 'title': ['소중한 것을 잃었다고', '상상해 본 결과'],
     'segs': [(237.60, 257.80), (224.03, 237.55)]},
]

def srt_cues():
    out = []
    for b in open(SRT, encoding='utf-8').read().strip().split('\n\n'):
        L = b.split('\n')
        if len(L) < 3: continue
        f = lambda s: (lambda m: int(m[1]) * 3600 + int(m[2]) * 60 + int(m[3]) + int(m[4]) / 1000)(re.match(r'(\d+):(\d+):(\d+),(\d+)', s))
        a, c = L[1].split(' --> '); out.append((f(a), f(c), ' '.join(L[2:])))
    return out
CUES = srt_cues()
HL = re.compile(r'([0-9][0-9,\.]*\s?(%|분|년|명|초|일|개|주|시간)?)')
def ts(x):
    x = max(0, x); return f"{int(x // 3600)}:{int(x % 3600 // 60):02d}:{x % 60:05.2f}"

def make_ass(segs, path):
    head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Noto Sans CJK KR Black,70,&H00FFFFFF,&H00FFFFFF,&H000E0E0E,&H99000000,0,0,0,0,100,100,0,0,1,8,4,8,70,70,1185,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    ev = []; off = 0
    for s, e in segs:
        cs = [(max(c[0], s), c[1], c[2]) for c in CUES if c[1] > s + 0.15 and c[0] < e - 0.15]
        for k, (a, b, t) in enumerate(cs):
            st = off + (a - s) / SP
            en = off + ((cs[k + 1][0] if k + 1 < len(cs) else min(b + 0.2, e)) - s) / SP - 0.02
            txt = HL.sub(lambda m: '{\\c&H33E7F7&}' + m.group(1) + '{\\c&HFFFFFF&}', t)
            ev.append(f"Dialogue: 0,{ts(st)},{ts(en)},Cap,,0,0,0,,{txt}")
        off += (e - s) / SP
    open(path, 'w').write(head + '\n'.join(ev) + '\n')
    return off

def main():
    with sync_playwright() as pw:
        br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 1080, 'height': 1920})
        pg.goto('file://' + os.path.join(ROOT, 'shorts_all', 'short_bg.html')); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(400)
        for sh in SHORTS:
            pg.evaluate('o => setup(o)', dict(EP, title=sh['title'], mode='bg')); pg.wait_for_timeout(200)
            pg.screenshot(path=os.path.join(WORK, f"bg_{sh['name']}.png"))
        br.close()
    m, msr = sf.read(MIX); assert msr == SR
    m = m if m.ndim == 2 else np.stack([m, m], 1)
    for sh in SHORTS:
        segs = sh['segs']; cap = os.path.join(WORK, f"cap_{sh['name']}.ass"); TOT = make_ass(segs, cap)
        parts = []
        for i, (s, e) in enumerate(segs):
            A = m[int(s * SR):int(e * SR)].copy(); n = int(0.06 * SR)
            A[:n] *= np.linspace(0, 1, n)[:, None]; A[-n:] *= np.linspace(1, 0, n)[:, None]
            parts.append(A)
        au = np.concatenate(parts); ap = os.path.join(WORK, f"au_{sh['name']}.wav"); sf.write(ap, au, SR)
        ins = []; fc = ''
        for i, (s, e) in enumerate(segs):
            ins += ['-ss', f'{s:.3f}', '-t', f'{e - s:.3f}', '-i', VID]
            fc += (f"[{i + 1}:v]setpts=(PTS-STARTPTS)/{SP},crop=1920:880:0:0,scale=1080:495:flags=lanczos,setsar=1,fps={FPS}[v{i}];")
        capf = cap.replace(':', '\\:')
        fc += (f"[v0][v1]concat=n=2:v=1:a=0[vv];[0:v]fps={FPS},setsar=1[bg];[bg][vv]overlay=0:623:shortest=1[b];"
               f"[b]ass='{capf}',format=yuv420p[out];[3:a]atempo={SP},loudnorm=I=-14:TP=-1.5:LRA=11[a]")
        outp = os.path.join(OUT, f"쇼츠_{sh['name']}.mp4")
        cmd = ['ffmpeg', '-y', '-v', 'error', '-loop', '1', '-t', f'{TOT + 1:.3f}', '-i', os.path.join(WORK, f"bg_{sh['name']}.png"), *ins,
               '-i', ap, '-filter_complex', fc, '-map', '[out]', '-map', '[a]',
               '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
               '-t', f'{TOT:.3f}', '-movflags', '+faststart', outp]
        subprocess.run(cmd, check=True); print(sh['name'], f'{TOT:.1f}s', flush=True)

main()
