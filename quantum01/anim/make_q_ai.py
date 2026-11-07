import base64, io, json, os, sys
from PIL import Image
sys.path.insert(0, '/home/claude/sangsik-lab/gtts'); import vx
os.chdir(os.path.dirname(os.path.abspath(__file__)))
ref = base64.b64encode(open('chk/t0003.00.jpg','rb').read()).decode()
P = ('The reference image shows the channel\'s character "Zero": a round white head, simple dot eyes and brows, a plain orange t-shirt, thin stick legs, round white hands. '
     'Draw Zero exactly in that flat cartoon style (thick slightly wobbly black outlines), small-to-medium in the frame. Scene: a city sidewalk beside a tall blue construction hoarding wall. '
     'Zero stands frozen in the left-center looking down in shock, one foot lifted, an orange phone dropped slightly in his hand; a single red brick has just smashed on the pavement a hand-width in front of his sneaker: '
     'broken brick pieces and a puff of pale dust scatter across the ground; thin white motion lines. Background and setting richer and more detailed than the flat cartoon: layered city, soft early-morning light, painterly textured storybook illustration, '
     'cinematic wide composition, slightly low camera angle. Wide 16:9 frame filling the whole canvas edge to edge, no borders. The bottom fifth is plain pavement. No text, letters, numbers, signs, logos, watermarks or speech bubbles.')
body = {"contents":[{"role":"user","parts":[{"inlineData":{"mimeType":"image/jpeg","data":ref}},{"text":P}]}],
        "generationConfig":{"responseModalities":["IMAGE"],"imageConfig":{"aspectRatio":"16:9","imageSize":"2K"}}}
st, r = vx.generate('gemini-nano-banana-2.1', body)
print(st)
if st == 200:
    imgs,_ = vx.inline_parts(r)
    Image.open(io.BytesIO(imgs[-1][1])).convert('RGB').resize((1920,1080), Image.LANCZOS).save('ai/brick.png'); print('saved')
else: print(json.dumps(r,ensure_ascii=False)[:300])
