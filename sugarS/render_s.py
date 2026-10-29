# render one Short's 16:9 frames from its own timeline: python3 render_s.py <name> <start> <end>
import sys, os, json, numpy as np, soundfile as sf
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__)); name = sys.argv[1]
tl = json.load(open(os.path.join(here, name, "timeline.json"))); FPS = 24
v, SR = sf.read(os.path.join(here, name, "voice.wav")); hop = SR // FPS; n = int(tl["duration"] * FPS) + 1
pad = np.pad(v, (0, max(0, n * hop - len(v))))[:n * hop]; rms = np.sqrt(np.mean(pad.reshape(n, hop) ** 2, axis=1))
tl["env"] = [round(float(x), 2) for x in np.clip(rms / (np.percentile(rms[rms > 1e-4], 90) + 1e-9), 0, 1)]
a, b = int(sys.argv[2]), min(int(sys.argv[3]), n)
od = os.path.join(here, name, "frames"); os.makedirs(od, exist_ok=True)
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto("file://" + os.path.join(here, "anim5.html")); pg.evaluate("tl => { window.TL = tl; window.NOFADE = true; }", tl)
    pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(300)
    for i in range(a, b):
        pg.evaluate(f"render({i / FPS})"); pg.screenshot(path=os.path.join(od, f"f{i:05d}.jpg"), type="jpeg", quality=90)
    br.close()
print("done", name, a, b, n)
