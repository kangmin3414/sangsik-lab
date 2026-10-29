# Compose the vertical Shorts: background + 16:9 clip (subtitle band cropped) + big captions + CTA outro,
# narration over one steady music bed. Same look as shorts_all/build.py. usage: python3 compose.py [name ...]
import json, os, re, sys, subprocess
import numpy as np, soundfile as sf
from PIL import Image
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(ROOT, 'shorts'))
import music as M, theme as T
from script import SH
SR = 44100; FPS = 24
E = json.load(open(os.path.join(ROOT, 'shorts_all', 'plan.json')))['eps']['004']
MOODS = {
 'crash': dict(root=164.81, mode='dorian', bpm=100, prog=[0, 3, 6, 4], lead='marimba', pattern='arp', oct=1, leadGain=.4, perc='shaker'),
 'liver': dict(root=130.81, mode='ionian', bpm=90, prog=[0, 4, 5, 3], lead='kalimba', pattern='melody', oct=1, leadGain=.4, pad=.14, density=.55),
 'taste': dict(root=220.0, mode='ionian', bpm=84, prog=[0, 5, 3, 4], lead='musicbox', pattern='melody', oct=1, leadGain=.36, pad=.12, density=.55),
}
LONG = os.path.join(ROOT, 'sugar', E['video'])
OUTRO_T0 = json.load(open(os.path.join(ROOT, 'sugar', 'timeline.json')))['lines'][E['outro_line']]['t0'] - 0.1
OUT = os.path.join(HERE, 'out'); WORK = os.path.join(HERE, 'work'); os.makedirs(OUT, exist_ok=True); os.makedirs(WORK, exist_ok=True)

def chunks(s):
    parts = re.split(r'(?<=[,.?!])\s+', s); out = []; cur = ''
    for p in parts:
        if len((cur + ' ' + p).strip()) <= 26: cur = (cur + ' ' + p).strip()
        else:
            if cur: out.append(cur)
            cur = p
    if cur: out.append(cur)
    return out
def ts(x): x = max(0, x); return f"{int(x // 3600)}:{int(x % 3600 // 60):02d}:{x % 60:05.2f}"
HL = re.compile(r'([0-9][0-9,\.]*\s?(%|분|년|명|초|일|권|개|주|시간|그램|점|시)?)')
HEAD = """[Script Info]
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
def make_ass(L, D, path):
    cues = []
    for l in L:
        for sg in l['segs']:
            ch = chunks(sg['text']); tot = sum(len(c) for c in ch) or 1; acc = sg['t0']
            for c in ch: cues.append([c, acc]); acc += (sg['t1'] - sg['t0']) * len(c) / tot
    ev = []
    for k, (c, a) in enumerate(cues):
        e = cues[k + 1][1] - 0.02 if k + 1 < len(cues) else D - 0.05
        txt = HL.sub(lambda m: '{\\c&H33E7F7&}' + m.group(1) + '{\\c&HFFFFFF&}', c)
        ev.append(f"Dialogue: 0,{ts(a)},{ts(e)},Cap,,0,0,0,,{txt}")
    open(path, 'w').write(HEAD + '\n'.join(ev) + '\n')

def main():
    names = [n for n in SH if len(sys.argv) < 2 or n in sys.argv[1:]]
    outro, osr = sf.read(os.path.join(HERE, 'outro.wav')); assert osr == SR
    OD = max(5.0, len(outro) / SR + 1.25)
    with sync_playwright() as pw:
        br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 1080, 'height': 1920})
        pg.goto('file://' + os.path.join(ROOT, 'shorts_all', 'short_bg.html')); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(400)
        tp = br.new_page(viewport={'width': 1080, 'height': 1920})
        tp.goto('file://' + os.path.join(ROOT, 'shorts_all', 'short_thumb.html')); tp.evaluate('document.fonts.ready'); tp.wait_for_timeout(400)
        base = {'theme': E['theme'], 'accent': E['accent'], 'tag': '만약에연구소 · 실험 004', 'cta': E['cta']}
        pg.evaluate('o => setup(o)', dict(base, title=['', ''], mode='cta')); pg.wait_for_timeout(150)
        pg.screenshot(path=os.path.join(WORK, 'cta.png'), omit_background=True)
        for n in names:
            sh = SH[n]; o = dict(base, title=sh['title'], mode='bg')
            pg.evaluate('o => setup(o)', o); pg.wait_for_timeout(150); pg.screenshot(path=os.path.join(WORK, f'bg_{n}.png'))
            L = json.load(open(os.path.join(HERE, n, 'timeline.json')))['lines']; l = L[sh['thumb']]
            fr = Image.open(os.path.join(HERE, n, 'frames', f"f{int((l['t0'] + 0.8 * (l['t1'] - l['t0'])) * FPS):05d}.jpg")).crop((330, 0, 1590, 880))
            fp = os.path.join(WORK, f'tf_{n}.jpg'); fr.save(fp, quality=92)
            tp.evaluate('o => setup(o)', dict(o, img='file://' + fp)); tp.wait_for_timeout(250)
            tp.screenshot(path=os.path.join(OUT, f'썸네일_004s-{n}.png'))
        br.close()
    for n in names:
        sh = SH[n]; tl = json.load(open(os.path.join(HERE, n, 'timeline.json'))); D = tl['duration']; TOT = D + OD
        make_ass(tl['lines'], D, os.path.join(WORK, f'cap_{n}.ass'))
        v, _ = sf.read(os.path.join(HERE, n, 'voice.wav')); N = int(TOT * SR)
        V = np.zeros(N); V[:len(v)] += v / (np.abs(v).max() + 1e-9) * 0.9
        i0 = int((D + 0.35) * SR); V[i0:i0 + len(outro)] += outro / (np.abs(outro).max() + 1e-9) * 0.9
        bed = T.static_dip(M.render_mood(MOODS[sh['mood']], TOT + 0.5, 7)[:N])
        bed = bed / (np.sqrt(np.mean(bed ** 2)) + 1e-9)
        vr = np.sqrt(np.mean(V[np.abs(V) > 0.02] ** 2))
        A = V + bed * vr * 10 ** (-15 / 20) * T.gentle_sidechain(V, depth_db=2.0)
        fi = int(0.05 * SR); A[:fi] *= np.linspace(0, 1, fi); fo = int(1.0 * SR); A[-fo:] *= np.linspace(1, 0, fo)
        A = A / (np.abs(A).max() + 1e-9) * 0.95
        ap = os.path.join(WORK, f'au_{n}.wav'); sf.write(ap, np.stack([A, A], 1), SR)
        cap = os.path.join(WORK, f'cap_{n}.ass').replace(':', '\\:')
        fc = (f"[1:v]crop=1920:880:0:0,scale=1080:495:flags=lanczos,setsar=1,fps={FPS}[a];"
              f"[2:v]crop=1920:880:0:0,scale=1080:495:flags=lanczos,setsar=1,fps={FPS}[b];"
              f"[a][b]concat=n=2:v=1:a=0[vv];[0:v]fps={FPS},setsar=1[bgv];[bgv][vv]overlay=0:623[base];"
              f"[base]ass='{cap}'[c];[3:v]fps={FPS},format=rgba[ct];[c][ct]overlay=0:0:enable='gte(t,{D:.3f})'[o];"
              f"[o]fade=t=in:st=0:d=0.12,fade=t=out:st={TOT - 0.6:.3f}:d=0.6,format=yuv420p[out]")
        outp = os.path.join(OUT, f'쇼츠_004s-{n}.mp4')
        cmd = ['ffmpeg', '-y', '-v', 'error', '-loop', '1', '-t', f'{TOT:.3f}', '-i', os.path.join(WORK, f'bg_{n}.png'),
               '-framerate', str(FPS), '-t', f'{D:.3f}', '-i', os.path.join(HERE, n, 'frames', 'f%05d.jpg'),
               '-ss', f'{OUTRO_T0:.3f}', '-t', f'{OD:.3f}', '-i', LONG,
               '-loop', '1', '-t', f'{TOT:.3f}', '-i', os.path.join(WORK, 'cta.png'), '-i', ap,
               '-filter_complex', fc, '-map', '[out]', '-map', '4:a', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
               '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
               '-t', f'{TOT:.3f}', '-movflags', '+faststart', outp]
        subprocess.run(cmd, check=True)
        print(n, f'{TOT:.1f}s', flush=True)

main()
