import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFilter
src = cv2.imread('ai/47.png'); g = src.mean(2)
mask = np.zeros(g.shape, np.uint8)
def dark(x0, y0, x1, y1, thr=200):
    mask[y0:y1, x0:x1] |= ((g[y0:y1, x0:x1] < thr) * 255).astype(np.uint8)
dark(1366, 505, 1524, 570)          # Huizi: angry brows + eyes (+ cheek lines)
dark(472, 547, 500, 572); dark(548, 540, 580, 566)   # Zhuangzi: dot eyes
mask = cv2.dilate(mask, np.ones((5, 5), np.uint8)); mask[:546, 440:520] = 0 if False else mask[:546, 440:520]
out = cv2.inpaint(src, mask, 7, cv2.INPAINT_TELEA)
im = Image.fromarray(cv2.cvtColor(out, cv2.COLOR_BGR2RGB)).convert('RGBA')
S = 4
lay = Image.new('RGBA', (im.width * S, im.height * S), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
INK = (22, 20, 20, 255)
def quad(p0, p1, p2, w):
    pts = []
    for i in range(25):
        t = i / 24; x = (1-t)**2*p0[0] + 2*(1-t)*t*p1[0] + t*t*p2[0]; y = (1-t)**2*p0[1] + 2*(1-t)*t*p1[1] + t*t*p2[1]
        pts.append((x * S, y * S))
    d.line(pts, fill=INK, width=int(w * S), joint='curve')
    for p in (pts[0], pts[-1]): r = w * S / 2; d.ellipse([p[0]-r, p[1]-r, p[0]+r, p[1]+r], fill=INK)
# Huizi: raised, relaxed brows + happy closed eyes
quad((1376, 526), (1398, 506), (1422, 520), 9)
quad((1450, 518), (1477, 503), (1504, 520), 9)
quad((1381, 564), (1395, 540), (1410, 564), 7.5)
quad((1458, 565), (1472, 541), (1487, 565), 7.5)
# Zhuangzi: happy closed eyes
quad((474, 566), (486, 545), (499, 566), 7)
quad((550, 559), (563, 538), (577, 559), 7)
lay = lay.resize(im.size, Image.LANCZOS)
blush = Image.new('RGBA', im.size, (0, 0, 0, 0)); bd = ImageDraw.Draw(blush)
for cx, cy in [(1370, 578), (1505, 576), (466, 580), (590, 572)]:
    bd.ellipse([cx - 15, cy - 7, cx + 15, cy + 7], fill=(242, 140, 140, 110))
blush = blush.filter(ImageFilter.GaussianBlur(3))
im = Image.alpha_composite(Image.alpha_composite(im, blush), lay).convert('RGB')
im.save('ai/47h.png')
im.crop((1300, 400, 1600, 700)).resize((600, 600), Image.LANCZOS).save('qa_fix/c47h_hz.png')
im.crop((380, 430, 680, 730)).resize((600, 600), Image.LANCZOS).save('qa_fix/c47h_zh.png')
