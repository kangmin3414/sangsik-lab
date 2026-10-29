"""Remove a copied '상식실험실' watermark from the bottom-right corner of AI pictures (the animation draws its own there).
Bright, low-saturation text pixels in the corner box are inpainted from their surroundings. usage: python3 clean_ai.py ai/*.png"""
import sys
import cv2, numpy as np
for p in sys.argv[1:]:
    im = cv2.imread(p)
    x0, y0, x1, y1 = 1660, 1020, 1920, 1080
    roi = im[y0:y1, x0:x1]
    hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
    bg = np.median(roi.reshape(-1, 3), axis=0)
    diff = np.abs(roi.astype(int) - bg).sum(2)
    m = ((diff > 40)).astype(np.uint8) * 255
    if m.sum() == 0: print(p, 'clean'); continue
    m = cv2.dilate(m, np.ones((5, 5), np.uint8))
    mask = np.zeros(im.shape[:2], np.uint8); mask[y0:y1, x0:x1] = m
    out = cv2.inpaint(im, mask, 6, cv2.INPAINT_TELEA)
    cv2.imwrite(p, out); print(p, 'inpainted', int((m > 0).sum()))
