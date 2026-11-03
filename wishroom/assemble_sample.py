"""Quick picture-book sample (no SVG engine): timeline.json + ai/*.png + voice.wav + 2 checked Lyria tracks
-> sample/소원의방_샘플_v1.mp4 (1920x1080, 24fps, AAC 48k stereo).
Ken Burns per shot, crossfades, ASS subtitles (speaker-colored), title card, the '방에 들어온 지 ○' counter."""
import json, os, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs('sample/clips', exist_ok=True)
TL = json.load(open('timeline.json')); L = TL['lines']; DUR = TL['duration']
SHOT = {0: 'A1', 3: 'A2', 6: 'A3', 11: 'A4', 12: 'A5', 13: 'A6', 15: 'A7', 16: 'A8', 19: 'A9', 23: 'A10'}
XF = 0.7; FPS = 24
starts = [(0.0 if i == 0 else L[i]['t0'] - 0.35, k) for i, k in sorted(SHOT.items())]
shots = [(k, s, (starts[n + 1][0] if n + 1 < len(starts) else DUR)) for n, (s, k) in enumerate(starts)]
MOVES = ['in', 'in', 'out', 'left', 'in', 'up', 'in', 'out', 'right', 'in']


def clip(n, k, d):
    out = f'sample/clips/{n:02d}_{k}.mp4'
    fr = int(round((d + XF) * FPS)); m = MOVES[n % len(MOVES)]
    z = {'in': f"1+0.07*on/{fr}", 'out': f"1.07-0.07*on/{fr}"}.get(m, '1.07')
    x = {'right': f"(iw-iw/zoom)*on/{fr}", 'left': f"(iw-iw/zoom)*(1-on/{fr})"}.get(m, 'iw/2-(iw/zoom/2)')
    y = {'up': f"(ih-ih/zoom)*(1-on/{fr})"}.get(m, 'ih/2-(ih/zoom/2)')
    vf = f"scale=3840:2160,zoompan=z='{z}':x='{x}':y='{y}':d={fr}:s=1920x1080:fps={FPS},format=yuv420p"
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-loop', '1', '-i', f'ai/{k}.png', '-vf', vf, '-frames:v', str(fr),
                    '-c:v', 'libx264', '-crf', '16', '-preset', 'veryfast', out], check=True)
    return out


def ts(t):
    t = max(0, t); h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f'{h}:{m:02d}:{s:05.2f}'


def ass():
    col = {'N': '&H00FFFFFF', 'Z': '&H00F5E6A8', 'D': '&H00A8D8F5', 'R': '&H00F5C8E6'}   # BGR: N white, Z light sky, D warm peach, R lavender
    hdr = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Noto Sans CJK KR,56,&H00FFFFFF,&H00FFFFFF,&H00201810,&H80000000,1,0,0,0,100,100,0,0,1,4.5,1.5,2,160,160,64,1
Style: Title,Noto Sans CJK KR,84,&H00FFFFFF,&H00FFFFFF,&H00302010,&H00000000,1,0,0,0,100,100,0,0,1,6,3,5,120,120,0,1
Style: Count,Noto Sans CJK KR,40,&H00FFFFFF,&H00FFFFFF,&H90503A2A,&H90503A2A,1,0,0,0,100,100,0,0,3,14,0,9,0,60,50,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    ev = []
    for n, ln in enumerate(L):
        a = ln['args']
        if a.get('silent') and ln['scene'] == 'ctitle':
            ev.append(f"Dialogue: 1,{ts(ln['t0'])},{ts(ln['t1'] + 0.4)},Title,,0,0,0,,{{\\fad(400,400)}}{ln['sub'].replace(', ', ',\\N')}"); continue
        if ln['segs']:
            for s in ln['segs']:
                ev.append(f"Dialogue: 0,{ts(s['t0'] - 0.05)},{ts(s['t1'] + 0.25)},Sub,,0,0,0,,{{\\c{col.get(s['v'], col['N'])}}}{s['text']}")
        else:
            ev.append(f"Dialogue: 0,{ts(ln['t0'] - 0.05)},{ts(ln['t1'] + 0.25)},Sub,,0,0,0,,{ln['sub']}")
    # counter: from the first counted line to the end of its block
    cur = None; c0 = None
    for n, ln in enumerate(L + [None]):
        c = ln['args'].get('count') if ln else None
        if c != cur:
            if cur: ev.append(f"Dialogue: 2,{ts(c0)},{ts(t_end)},Count,,0,0,0,,{{\\fad(300,300)}}방에 들어온 지  {cur}")
            cur = c; c0 = ln['t0'] - 0.3 if ln else None
        if ln: t_end = ln['t1'] + 0.6
    open('sample/sample.ass', 'w', encoding='utf-8').write(hdr + '\n'.join(ev) + '\n')


def main():
    clips = [clip(n, k, e - s) for n, (k, s, e) in enumerate(shots)]
    ins = sum([['-i', c] for c in clips], []); fc = []; prev = '0:v'; off = 0.0
    for n in range(1, len(clips)):
        off += shots[n - 1][2] - shots[n - 1][1]
        o = f'v{n}'; fc.append(f'[{prev}][{n}:v]xfade=transition=fade:duration={XF}:offset={off - XF / 2:.3f}[{o}]'); prev = o
    ass()
    fc.append(f"[{prev}]ass=sample/sample.ass,fade=t=in:st=0:d=0.8,fade=t=out:st={DUR - 1.5:.2f}:d=1.5[vout]")
    door = L[15]['t0'] - 1.0
    na = len(clips)
    fc.append(f"[{na}:a]aresample=48000,pan=stereo|c0=c0|c1=c0,volume=1.0,asplit[vo][vo2]")
    fc.append(f"[{na + 1}:a]aresample=48000,atrim=0:{door + 2:.2f},afade=t=out:st={door:.2f}:d=2,volume=0.20[b1]")
    fc.append(f"[{na + 2}:a]aresample=48000,atrim=0:{DUR - door + 1:.2f},afade=t=in:st=0:d=2.5,afade=t=out:st={DUR - door - 2.5:.2f}:d=2.5,volume=0.22,adelay={int(door * 1000)}|{int(door * 1000)}[b2]")
    fc.append("[b1][b2]amix=inputs=2:normalize=0[bg]")
    fc.append("[bg][vo]sidechaincompress=threshold=0.04:ratio=4:attack=60:release=500[bgd]")
    fc.append("[bgd][vo2]amix=inputs=2:normalize=0,alimiter=limit=0.95,loudnorm=I=-16:TP=-1.5:LRA=11[aout]")
    cmd = ['ffmpeg', '-y', '-v', 'error'] + ins + ['-i', 'voice.wav', '-i', '../bgm/cand_1_piano_b.mp3', '-i', '../bgm/cand_4_celesta_b.mp3',
           '-filter_complex', ';'.join(fc), '-map', '[vout]', '-map', '[aout]', '-t', f'{DUR:.2f}',
           '-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
           '-movflags', '+faststart', 'sample/소원의방_샘플_v1.mp4']
    subprocess.run(cmd, check=True); print('ok', DUR)


if __name__ == '__main__':
    main()
