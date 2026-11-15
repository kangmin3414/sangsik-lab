"""원효 편 배경 판(xAI grok-imagine-image-2.0, 2k low). 사람 없는 판 위에 엔진 인물을 그린다. python3 gen_bg.py [이름…] → ai/<이름>_1.jpg, _2.jpg (두 장 중 고른다)"""
import os, sys
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import xai
STY = ('Background plate for a 2D cartoon animation, NO people, NO characters, NO animals anywhere. Clean flat cartoon style with thick slightly wobbly black outlines and soft painterly shading, '
       'matching a simple stick-figure cartoon. Wide 16:9. Absolutely no text, letters, numbers, signs with writing or logos.')
OLD = ' Ancient Korea, Silla kingdom, 7th century: no modern objects at all. Palette: soft ink-wash indigo, misty blue-green, warm parchment highlights.'
P = {
 'silla': 'A misty mountain path in ancient Korea at early morning, eye level. Layered blue mountains fading into mist in the back, a few crooked pine trees on the left and right, a tiny stone pagoda far away on a ridge. A dirt path starts at the bottom left and winds to the center. The CENTER and the path are EMPTY (figures will be drawn later). The ground fills the bottom 22%.' + OLD,
 'cave': 'Inside a shallow earthen cave on a rainy night, eye level, readable soft blue night light, NOT pitch dark. The cave mouth is on the RIGHT third with heavy rain falling outside. Rough earthen walls and ceiling. The CENTER floor is a flat EMPTY dirt floor (two sleeping travelers will be drawn later). The floor fills the bottom 24%.' + OLD,
 'tomb': 'The same kind of shallow earthen cave seen in warm early morning light, now clearly an ancient burial chamber: old flat stone slabs along the back wall, a broken clay jar, and a few small simple cartoon skulls and bones resting at the far LEFT and far RIGHT edges only (cute and simple, not gory, not scary). Morning sunlight streams in from the cave mouth on the RIGHT. The CENTER floor is EMPTY. The floor fills the bottom 24%.' + OLD,
 'coast': 'An ancient Korean seaside at dawn, eye level. On the RIGHT third: a small wooden pier with an old wooden sailing ship with a plain cloth sail. On the LEFT: green hills and a dirt path leading back inland toward mountains. A calm sea and a pale pink-gold sky in the back. The CENTER shore is EMPTY (two figures will be drawn later). The ground fills the bottom 22%.' + OLD,
}
for k in sys.argv[1:] or list(P):
    out = xai.image(P[k] + ' ' + STY, f'ai/{k}.png', n=2)
    for p in out:
        Image.open(p).convert('RGB').resize((2400, 1350), Image.LANCZOS).save(p.replace('.png', '.jpg'), quality=88); os.remove(p)
    print(k, 'ok', flush=True)
