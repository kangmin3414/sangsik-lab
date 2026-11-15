"""죽음의 수용소에서 편 배경 판(xAI grok-imagine-image-2.0, 2k low). 사람 없는 판 위에 엔진 인물을 그린다.
python3 gen_bg.py [이름…] → /dev/shm/fk/ai/<이름>_1.jpg, _2.jpg (두 장 중 골라 ai/<이름>.jpg로 저장소에 둔다). 키는 ~/.xai_key(저장소에 넣지 않음)."""
import os, sys
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import xai
OUT = '/dev/shm/fk/ai'; os.makedirs(OUT, exist_ok=True)
STY = ('Background plate for a cute 2D cartoon animation in a cozy healing video-game style. NO people, NO characters, NO animals anywhere. '
       'Flat cartoon style with clean thick dark navy outlines, soft pastel colors, rounded friendly shapes and gentle soft shading, matching simple round-headed cartoon characters. '
       'Wide 16:9. Absolutely no text, letters, numbers, signs with writing, symbols or logos.')
P = {
 'citymap': 'A cute miniature town at night seen from high above at a 3/4 isometric angle, like a cozy video-game world map diorama: small rounded houses and a few small office buildings with glowing windows, tiny streetlights, little round trees, gently winding roads and a small river with a little bridge. Deep blue night palette with warm yellow window lights; about half of the windows are dark. NO people, NO cars.',
 'hospital': 'A bright, clean hospital corridor in a cute cartoon style, eye level: pale mint and white walls, large windows on the LEFT letting in soft morning sunlight, a row of plain doors on the RIGHT with no signs, a shiny light floor. The CENTER floor is EMPTY (figures will be drawn later). The floor fills the bottom 24%. No signs, no text, no crosses or medical symbols.',
 'lecture': 'Inside a warm, bright old university lecture hall, storybook illustration: a wooden lectern at the front center, a large completely blank chalkboard behind it, rows of curved wooden seats in the foreground, tall arched windows with golden sunlight, warm and hopeful atmosphere. Completely EMPTY, no people.',
 'dawnhill': 'A gentle rolling green hill seen from a little distance at dawn: one small round tree on top of the hill on the RIGHT third, a winding path leading up the hill, the sky changing from deep night blue at the top with a few last stars to soft pink and gold at the horizon. The hilltop next to the tree is EMPTY. Calm and hopeful.',
 'meadow': 'A sunny meadow on a clear day, eye level: soft rolling green hills, scattered small wildflowers (yellow, white, pink), a few fluffy clouds in a bright blue sky, one big round tree far on the LEFT. The CENTER grass is EMPTY (figures will be drawn later). The ground fills the bottom 30%. NO animals, NO birds.',
 'starry': 'A quiet residential street at night under a sky full of stars and a crescent moon: small cozy houses with a few warm windows on both sides, warm streetlights, the street leading away into the distance in the CENTER. The street in the foreground CENTER is EMPTY (figures will be drawn later). The ground fills the bottom 26%. Peaceful and cozy.',
}
for k in sys.argv[1:] or list(P):
    out = xai.image(P[k] + ' ' + STY, f'{OUT}/{k}.png', n=2)
    for p in out:
        Image.open(p).convert('RGB').resize((2400, 1350), Image.LANCZOS).save(p.replace('.png', '.jpg'), quality=88); os.remove(p)
    print(k, 'ok', flush=True)
