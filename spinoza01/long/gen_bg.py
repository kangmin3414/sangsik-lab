import io, os, sys, time
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
STY = ('Background plate for a 2D cartoon animation, NO people, NO characters, NO animals anywhere. Clean flat cartoon style with thick slightly wobbly black outlines and soft painterly shading, '
       'matching a simple stick-figure cartoon. Wide 16:9. Absolutely no text, letters, numbers, signs with writing, posters with writing or logos.')
P = {
 'bedmoon': "A small cozy Korean studio apartment bedroom at 2 a.m., seen from the foot of where a bed will be, eye level, looking at the back wall. BRIGHT silvery-blue moonlight pours in from a window on the upper right of the back wall, with a round moon visible and a soft light beam falling across the room. Walls are light lavender-blue, NOT dark; overall the image is luminous and soft, like a moonlit night in a gentle picture book. A small bedside table with a softly glowing warm lamp on the far right. A small shelf with a plant on the far left. The CENTER of the back wall and center floor are EMPTY (a bed and a person will be drawn later). The floor fills the bottom 22%. Palette: lavender, periwinkle, silver, a touch of warm gold from the lamp.",
 'alley': "A 17th-century Dutch city street beside a canal in soft early-morning light, eye level: tall narrow brick gabled houses, cobblestones, a small arched bridge in the distance, bare winter trees. On the LEFT, a large old wooden double door set in a stone archway, firmly CLOSED. The CENTER and RIGHT of the street are EMPTY cobblestones leading away into the distance (a person will be drawn later). The ground fills the bottom 22%. Gentle, bright, hopeful palette: pale gold sky, soft peach and lavender shadows, NOT dark.",
}
vx.token()
for k in sys.argv[1:] or list(P):
    if os.path.exists(f'ai/{k}.png') and k not in sys.argv[1:]: continue
    body = {"contents": [{"role": "user", "parts": [{"text": P[k] + ' ' + STY}]}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}}
    for a in range(5):
        st, r = vx.generate('gemini-nano-banana-2.1', body)
        if st == 200: break
        print(k, st, str(r)[:120], flush=True); time.sleep(40)
    imgs, _ = vx.inline_parts(r) if st == 200 else ([], '')
    if not imgs: print(k, 'fail', flush=True); continue
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((2400, 1350), Image.LANCZOS).save(f'ai/{k}.png'); print(k, 'ok', flush=True); time.sleep(6)
