"""사피엔스 편 배경 판(xAI grok-imagine-image-2.0, 2k low). 사람 없는 판 위에 엔진 인물을 그린다.
python3 gen_bg.py [이름…] → /dev/shm/sp/ai/<이름>_1.jpg, _2.jpg (두 장 중 골라 ai/<이름>.jpg로 저장소에 둔다). 키는 ~/.xai_key(저장소에 넣지 않음)."""
import os, sys
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import xai
OUT = '/dev/shm/sp/ai'; os.makedirs(OUT, exist_ok=True)
STY = ('Background plate for a cute 2D cartoon animation in a cozy healing video-game style. NO people, NO characters, NO animals anywhere. '
       'Flat cartoon style with clean thick dark navy outlines, soft pastel colors, rounded friendly shapes and gentle soft shading, matching simple round-headed cartoon characters. '
       'Wide 16:9. Absolutely no text, letters, numbers, signs with writing, symbols or logos.')
P = {
 'savanna_top': 'A wide ancient grassland seen from directly above like a cute miniature diorama board: soft green grass with lighter patches, a gentle blue river winding from left to right across the middle, small round bushes, a few round trees seen from above, scattered rocks and a sandy riverbank. Bright soft daylight. The grass areas on both sides of the river are EMPTY open space (small figures will be drawn later). No people, no animals, no buildings, no bridges.',
 'wheat_low': 'A golden wheat field seen from a very low camera angle near the ground, looking UP: tall golden wheat stalks in the front edges, the field rising to a LOW horizon line in the bottom fifth of the image, a huge dramatic sky with warm golden-hour light and big soft clouds filling most of the frame, a few wheat ears silhouetted against the sky. Grand, a little dramatic but still cute. No people, no animals, no buildings.',
 'meadow_wide': 'A very wide open pastel meadow panorama: soft rolling hills of light green grass with little pastel flowers, a few round trees far away, a gentle path, a huge bright pastel blue sky with fluffy clouds, the horizon around the middle of the image, open and free feeling. The foreground grass in the lower part is EMPTY open space (characters will be drawn later). No people, no animals, no buildings.',
 'meadow_sunset': 'The same kind of wide pastel meadow at sunset: soft rolling hills, a gentle path winding toward the horizon, warm orange and pink sunset sky with a big soft glowing sun near the horizon, long soft shadows, calm and emotional. The foreground in the lower part is EMPTY open space. No people, no animals, no buildings.',
}
for k in sys.argv[1:] or list(P):
    out = xai.image(P[k] + ' ' + STY, f'{OUT}/{k}.png', n=2)
    for p in out:
        Image.open(p).convert('RGB').resize((2400, 1350), Image.LANCZOS).save(p.replace('.png', '.jpg'), quality=88); os.remove(p)
    print(k, 'ok', flush=True)
