"""(rename build: new channel name 상식실험실 in the tag, plan_rename.json, out_rename/)
Cut every episode into vertical Shorts: background + cropped clip + big captions + CTA outro
with an episode-specific music bed, plus one vertical thumbnail per Short.
2026-10-22: no fade-in (frame 0 shows the hook; leading black clip frames are cloned over); a Short may carry 'next': {cta: [line1, line2], say: text}
so its last seconds tease the next day's experiment ("다음 실험: … 내일 저녁 7시") instead of the episode CTA."""
import json, os, re, sys, subprocess
import numpy as np, soundfile as sf
from PIL import Image
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'shorts'))
import music as M, theme as T

def synth_outro(text, path):
    """Spoken next-experiment teaser for one Short (narrator voice M2), trimmed."""
    import supertonic as stn
    tts = stn.TTS(model='supertonic-3'); st = tts.get_voice_style('M2')
    wav, _ = tts.synthesize(text, voice_style=st, lang='ko', total_steps=24, speed=0.97, silence_duration=0.2)
    w = np.asarray(wav).reshape(-1); thr = 0.01 * np.abs(w).max(); idx = np.where(np.abs(w) > thr)[0]
    sf.write(path, w[max(0, idx[0] - int(0.03 * SR)):idx[-1] + int(0.06 * SR)], SR)

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
P = json.load(open(os.path.join(HERE, 'plan_rename.json')))
LAB = lambda ep: re.match(r'\d+', ep).group(0)
SR = 44100; FPS = 24
only = sys.argv[1:]
OUT = os.path.join(HERE, 'out_rename'); WORK = os.path.join(HERE, 'work_rename'); os.makedirs(OUT, exist_ok=True); os.makedirs(WORK, exist_ok=True)

def lead_dark_frames(vid, s, maxk=6, thr=16):
    """Number of near-black frames at the start of the clip (a scene fade or cut frame at s).
    Those frames are replaced by a clone of the first real frame so the Short never opens on black."""
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{s:.3f}', '-i', vid, '-frames:v', str(maxk + 1),
                          '-vf', f'fps={FPS},crop=1920:880:0:0,scale=192:88', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'],
                         capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, 88 * 192)
    for k, f in enumerate(fr):
        if f.mean() > thr: return k
    return 0

def chunks(s):
    parts = re.split(r'(?<=[,.?!])\s+', s); out = []; cur = ''
    for p in parts:
        if len((cur + ' ' + p).strip()) <= 34: cur = (cur + ' ' + p).strip()
        else:
            if cur: out.append(cur)
            cur = p
    if cur: out.append(cur)
    return out
def ts(x):
    x = max(0, x); h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60
    return f"{h}:{m:02d}:{s:05.2f}"
HL = re.compile(r'([0-9][0-9,\.]*\s?(%|분|년|명|초|일|권|개|주|시간|그램|점)?)')

def seg_bounds(L, a, b):
    s = L[a]['t0'] - 0.13
    e = L[b]['t1'] + 0.45
    if b + 1 < len(L): e = min(e, L[b + 1]['t0'] - 0.17)
    return s, e

def make_ass(L, a, b, s, path):
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
    ev = []
    for l in L[a:b + 1]:
        ch = chunks(l['sub']); tot = sum(len(c) for c in ch); acc = l['t0']
        for c in ch:
            d = (l['t1'] - l['t0']) * len(c) / tot
            t0, t1 = acc - s, acc + d - s + (0.25 if c is ch[-1] else 0)
            txt = HL.sub(lambda m: '{\\c&H33E7F7&}' + m.group(1) + '{\\c&HFFFFFF&}', c)
            ev.append(f"Dialogue: 0,{ts(t0)},{ts(t1)},Cap,,0,0,0,,{txt}")
            acc += d
    open(path, 'w').write(head + '\n'.join(ev) + '\n')

def main():
    shorts = [x for x in P['shorts'] if not only or any(x['name'].startswith(o) for o in only)]
    TL = {ep: json.load(open(os.path.join(ROOT, e['dir'], 'timeline.json')))['lines'] for ep, e in P['eps'].items()}
    MIX = {}
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        pg = br.new_page(viewport={'width': 1080, 'height': 1920})
        pg.goto('file://' + os.path.join(HERE, 'short_bg.html')); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(400)
        tp = br.new_page(viewport={'width': 1080, 'height': 1920})
        tp.goto('file://' + os.path.join(HERE, 'short_thumb.html')); tp.evaluate('document.fonts.ready'); tp.wait_for_timeout(400)
        for ep, e in P['eps'].items():
            o = {'theme': e['theme'], 'accent': e['accent'], 'tag': f'상식실험실 · 실험 {LAB(ep)}', 'title': ['', ''], 'cta': e['cta'], 'mode': 'cta'}
            pg.evaluate('o => setup(o)', o); pg.wait_for_timeout(150)
            pg.screenshot(path=os.path.join(WORK, f'cta_{ep}.png'), omit_background=True)
        for sh in shorts:
            e = P['eps'][sh['ep']]; L = TL[sh['ep']]
            if sh.get('next'):   # e.g. {"cta": ["다음 실험", "혈압엔 유산소가 최고?"], "say": "다음 실험. 혈압엔 유산소가 최고일까요? 내일 저녁 일곱 시에 확인하세요."}
                oc = {'theme': e['theme'], 'accent': e['accent'], 'tag': f"상식실험실 · 실험 {LAB(sh['ep'])}", 'title': ['', ''], 'cta': sh['next']['cta'], 'mode': 'cta'}
                pg.evaluate('o => setup(o)', oc); pg.wait_for_timeout(150)
                pg.screenshot(path=os.path.join(WORK, f"cta_{sh['name']}.png"), omit_background=True)
            o = {'theme': e['theme'], 'accent': e['accent'], 'tag': f"상식실험실 · 실험 {LAB(sh['ep'])}", 'title': sh['title'], 'cta': e['cta'], 'mode': 'bg'}
            pg.evaluate('o => setup(o)', o); pg.wait_for_timeout(150)
            pg.screenshot(path=os.path.join(WORK, f"bg_{sh['name']}.png"))
            # thumbnail frame from the rendered frames (cut off the subtitle band, centre crop)
            l = L[sh['thumb']]; tt = l['t0'] + 0.75 * (l['t1'] - l['t0'])
            ff = os.path.join(ROOT, e['dir'], 'frames', f'f{int(tt * FPS):05d}.jpg')
            if not os.path.exists(ff):   # rendered frames may have been cleaned up: grab the frame from the episode video
                ff = os.path.join(WORK, f"src_{sh['name']}.png")
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{tt:.3f}', '-i', os.path.join(ROOT, e['dir'], e['video']), '-frames:v', '1', ff], check=True)
            fr = Image.open(ff).convert('RGB').crop((330, 0, 1590, 880))
            fp = os.path.join(WORK, f"tf_{sh['name']}.jpg"); fr.save(fp, quality=92)
            o2 = dict(o, img='file://' + fp)
            tp.evaluate('o => setup(o)', o2); tp.wait_for_timeout(250)
            tp.screenshot(path=os.path.join(OUT, f"썸네일_{sh['name']}.png"))
        br.close()
    for sh in shorts:
        e = P['eps'][sh['ep']]; L = TL[sh['ep']]; ep = sh['ep']
        a, b = sh['lines']; s, en = seg_bounds(L, a, b); D = en - s
        ol = L[e['outro_line']]; os_ = ol['t0'] - 0.1
        nx = sh.get('next')
        owav = os.path.join(HERE, f"outro_{sh['name']}.wav") if nx else os.path.join(HERE, f'outro_{ep}.wav')
        if nx and not os.path.exists(owav): synth_outro(nx['say'], owav)
        narr, nsr = sf.read(owav); assert nsr == SR
        OD = max(5.0, len(narr) / SR + 1.25)
        if ep == '003': OD = min(OD, 5.15)
        TOT = D + OD
        make_ass(L, a, b, s, os.path.join(WORK, f"cap_{sh['name']}.ass"))
        # audio: the episode mix for the clip, then outro narration over this episode's own bed
        if ep not in MIX:
            m, msr = sf.read(os.path.join(ROOT, e['dir'], 'mix.wav')); assert msr == SR
            MIX[ep] = m if m.ndim == 2 else np.stack([m, m], 1)
        m = MIX[ep]; A = m[int(s * SR):int(en * SR)].copy(); n = int(0.05 * SR)
        A[:n] *= np.linspace(0, 1, n)[:, None]; A[-n:] *= np.linspace(1, 0, n)[:, None]
        nC = int(OD * SR); C = np.zeros(nC)
        C[int(0.35 * SR):int(0.35 * SR) + len(narr)] += narr / (np.abs(narr).max() + 1e-9) * 0.9
        if e.get('bed_theme'):   # same one theme as the episode's v3 mix
            bed = T.static_dip(T.render_theme(OD + 0.5, lambda t: e['bed_theme'].get('level', 1.4), **{k: v for k, v in e['bed_theme'].items() if k != 'level'}))
        else: bed = M.render_mood(e['bed'], OD, 7)
        bed = bed / (np.sqrt(np.mean(bed ** 2)) + 1e-9)
        vr = np.sqrt(np.mean(C[np.abs(C) > 0.02] ** 2)); C = C + bed[:nC] * vr * 10 ** (-14 / 20)
        fo = int(1.0 * SR); C[-fo:] *= np.linspace(1, 0, fo); fi = int(0.15 * SR); C[:fi] *= np.linspace(0, 1, fi)
        ref = np.sqrt(np.mean(A[:, 0] ** 2)); C = C * ref / (np.sqrt(np.mean(C ** 2)) + 1e-9)
        au = np.concatenate([A, np.stack([C, C], 1)]); au = au / (np.abs(au).max() + 1e-9) * 0.95
        ap = os.path.join(WORK, f"au_{sh['name']}.wav"); sf.write(ap, au, SR)
        vid = os.path.join(ROOT, e['dir'], e['video']); outp = os.path.join(OUT, f"쇼츠_{sh['name']}.mp4")
        k = lead_dark_frames(vid, s); ks = k / FPS; tp = f',tpad=start={k}:start_mode=clone' if k else ''
        cap = os.path.join(WORK, f"cap_{sh['name']}.ass").replace(':', '\\:')
        fc = (f"[1:v]setpts=PTS-STARTPTS,crop=1920:880:0:0,scale=1080:495:flags=lanczos,setsar=1,fps={FPS}{tp}[a];"
              f"[2:v]setpts=PTS-STARTPTS,crop=1920:880:0:0,scale=1080:495:flags=lanczos,setsar=1,fps={FPS}[b];"
              f"[a][b]concat=n=2:v=1:a=0[vv];[0:v]fps={FPS},setsar=1[bgv];[bgv][vv]overlay=0:623[base];"
              f"[base]ass='{cap}'[c];[3:v]fps={FPS},format=rgba[ct];[c][ct]overlay=0:0:enable='gte(t,{D:.3f})'[o];"
              f"[o]fade=t=out:st={TOT - 0.6:.3f}:d=0.6,format=yuv420p[out]")   # no fade-in: frame 0 shows the hook
        cmd = ['ffmpeg', '-y', '-v', 'error', '-loop', '1', '-t', f'{TOT:.3f}', '-i', os.path.join(WORK, f"bg_{sh['name']}.png"),
               '-ss', f'{s + ks:.3f}', '-t', f'{D - ks:.3f}', '-i', vid, '-ss', f'{os_:.3f}', '-t', f'{OD:.3f}', '-i', vid,
               '-loop', '1', '-t', f'{TOT:.3f}', '-i', os.path.join(WORK, f"cta_{sh['name']}.png" if nx else f'cta_{ep}.png'), '-i', ap,
               '-filter_complex', fc, '-map', '[out]', '-map', '4:a', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
               '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
               '-t', f'{TOT:.3f}', '-movflags', '+faststart', outp]
        subprocess.run(cmd, check=True)
        print(sh['name'], f'{TOT:.1f}s', f'(lead dark frames cloned: {k})' if k else '', flush=True)

main()
