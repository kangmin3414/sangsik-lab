"""Render a short stretch of a long-form animation (e.g. the closing thanks scene) to a silent 1920x1080 clip.
usage: python3 render_clip.py <folder> <anim.html> <timeline.json> <t_start> <dur> <out.mp4>"""
import json, os, shutil, subprocess, sys, tempfile
from playwright.sync_api import sync_playwright

SP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d, anim, tlp, t0, dur, out = sys.argv[1:7]
t0, dur = float(t0), float(dur)
FPS = 24
tl = json.load(open(tlp))
tmp = tempfile.mkdtemp(dir=os.path.join(SP, 'replace'), prefix='clip_')
n = int(round(dur * FPS)) + 2
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={'width': 1920, 'height': 1080})
    pg.goto('file://' + os.path.join(SP, d, anim)); pg.evaluate('tl => { window.TL = tl; }', tl)
    for k in range(n):
        pg.evaluate(f'render({t0 + k / FPS})')
        pg.screenshot(path=os.path.join(tmp, f'f{k:05d}.jpg'), type='jpeg', quality=92)
    br.close()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', os.path.join(tmp, 'f%05d.jpg'),
                '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', out], check=True)
shutil.rmtree(tmp)
print('clip', out, n, 'frames')
