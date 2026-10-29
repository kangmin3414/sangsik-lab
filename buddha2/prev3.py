# previews + automatic text-overlap / off-screen check
# usage: python3 prev2.py timeline.json [i,j,k] [page.html]
import os, json, sys
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
here = os.path.dirname(os.path.abspath(__file__))
tl = json.load(open(os.path.join(here, sys.argv[1] if len(sys.argv) > 1 else "timeline.json")))
only = [int(x) for x in sys.argv[2].split(",")] if len(sys.argv) > 2 and sys.argv[2] else None
page = sys.argv[3] if len(sys.argv) > 3 else "anim10.html"
od = os.path.join(here, "prev"); os.makedirs(od, exist_ok=True)
FR = [0.25, 0.65, 0.97]
JS = """() => {
  const out = [];
  document.querySelectorAll('#v text').forEach(el => {
    const r = el.getBoundingClientRect(); const s = (el.textContent || '').trim();
    if (!s || r.width < 2) return;
    out.push([s, Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]);
  });
  return out;
}"""
SKIP = {"?", "z", "Z", "!!", "♪", "만약에연구소", "x", "y"}
def issues(boxes, t, sub_on):
    seen = {}; B = []
    for s, l, tp, r, b in boxes:
        k = (s, l // 6, tp // 6)
        if k in seen or s in SKIP: continue
        seen[k] = 1; ih = (b - tp) * 0.24; B.append((s, l + 2, tp + ih, r - 2, b - ih))
    out = []
    for s, l, tp, r, b in B:
        if l < -4 or r > 1924 or tp < -4 or b > 1084: out.append("OFF '%s' (%d,%d,%d,%d)" % (s[:16], l, tp, r, b))
    # subtitle text = boxes whose top > 900 and centred (drawn last); compare scene text vs others
    for i in range(len(B)):
        for j in range(i + 1, len(B)):
            a, c = B[i], B[j]
            if a[0] == c[0]: continue
            ix = max(0, min(a[3], c[3]) - max(a[1], c[1])); iy = max(0, min(a[4], c[4]) - max(a[2], c[2]))
            if ix * iy == 0: continue
            sm = min((a[3] - a[1]) * (a[4] - a[2]), (c[3] - c[1]) * (c[4] - c[2]))
            if ix * iy > 0.12 * sm: out.append("OVERLAP '%s' x '%s'" % (a[0][:16], c[0][:16]))
    return out
rep = []
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    pg.goto("file://" + os.path.join(here, page)); pg.evaluate("tl => { window.TL = tl; }", tl)
    L = tl["lines"]
    for n, l in enumerate(L):
        if only and l["i"] not in only: continue
        end = L[n + 1]["t0"] - 0.2 if n + 1 < len(L) else l["t1"]
        ims = []
        for k, fr in enumerate(FR):
            tt = l["t0"] + fr * (end - l["t0"])
            pg.evaluate(f"render({tt})")
            path = os.path.join(od, f"p{l['i']:02d}_{k}.jpg")
            pg.screenshot(path=path, type="jpeg", quality=80)
            for msg in issues(pg.evaluate(JS), tt, True): rep.append("#%d %s @%.1f %s" % (l["i"], l["scene"], tt, msg))
            ims.append(path)
        sh = Image.new("RGB", (1920, 400), "white")
        for k, pth in enumerate(ims): sh.paste(Image.open(pth).resize((640, 360)), (k * 640, 0))
        d = ImageDraw.Draw(sh)
        try: f = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc", 24)
        except Exception: f = ImageFont.load_default()
        d.text((8, 366), ("#%d [%s] %s" % (l["i"], l["scene"], l["sub"]))[:90], fill="black", font=f)
        sh.save(os.path.join(od, f"row{l['i']:02d}.jpg"), quality=82)
    br.close()
open(os.path.join(here, "qa_text.txt"), "w").write("\n".join(rep))
print("errors:", errs[:8]); print("text issues:", len(rep)); print("\n".join(rep[:60]))
