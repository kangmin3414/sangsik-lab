"""Demo scene (cold open of ep.1, ~40 s): visual-novel layout with lip-sync, blinks, speaker highlight, title card and a costume flashback.
Voices: Gemini 3.8 Flash TTS (GCP free-trial credits). Images: assets.py (Grok). BGM: ../../bgm (Lyria, made for 상식실험실).
  python3 render.py  ->  tts/*.wav, 소피채널_데모_v1.mp4"""
import json, os, random, subprocess, sys, time
import numpy as np, requests, soundfile as sf
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, os.path.join(HERE, '..', '..', 'gtts'))
import vx

W, H, FPS, SR = 1920, 1080, 30, 44100
FONT = next(p for p in ('/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc', '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc') if os.path.exists(p))
OUT = '소피채널_데모_v1.mp4'
VOICE = {'sophia': 'Leda', 'haru': 'Zephyr', 'minerva': 'Algenib'}
NAME = {'sophia': '소피', 'haru': '하루', 'minerva': '미네르바'}
STYLE = {
 'sophia': "열아홉 살 여자 대학생. 차분하고 다정한 말투, 또래보다 어른스럽다. 새벽 카페라 목소리는 너무 크지 않게.",
 'haru': "스물세 살 신입 직장인 여자. 친한 동생에게 반말로 말한다.",
 'minerva': "카페에 사는 늙은 부엉이. 시큰둥하고 무뚝뚝한 낮은 목소리.",
}
# (scene, speaker, expression, on-screen text, spoken text or None, extra style)
S = [
 ('cafe', 'haru', 'sad', "소피 씨… 나 오늘 인스타 세 시간 봤어. 다들 해외여행 가고, 승진하고, 연애하고…", None, "지쳐서 투덜거리듯, 하지만 말은 너무 늘어지지 않게 보통 빠르기로."),
 ('cafe', 'haru', 'sad', "나만 동굴에 갇혀 사는 것 같아.", None, "풀 죽은 목소리로 작게."),
 ('cafe', 'sophia', 'thinking', "동굴이요? … 언니, 생각 실험 하나 해 볼까요?", None, "처음엔 고개를 갸웃하듯, 뒤에선 눈이 반짝이며 살짝 들떠서."),
 ('cafe', 'minerva', 'grumpy', "또 시작이네.", None, "귀찮은 듯 한숨 쉬며."),
 ('title', None, None, None, None, None),
 ('cave', 'sophia', 'chiton', "2,400년 전 아테네. 플라톤은 이런 이야기를 했어요.", "이천사백 년 전 아테네. 플라톤은 이런 이야기를 했어요.", "옛이야기를 들려주듯 차분하고 신비롭게."),
 ('cave', 'sophia', 'chiton', "태어날 때부터 동굴 벽만 보고 산 사람들이 있어요. 그 사람들한테는, 벽에 비친 그림자가 세상 전부예요.", None, "천천히, 낮고 진지하게."),
 ('cafe', 'haru', 'pouting', "잠깐. 그럼 내 인스타 피드가… 그림자라는 거야?", None, "의심스럽다는 듯 따지며, 살짝 장난스럽게."),
 ('cafe', 'sophia', 'flustered', "어… 반은 맞아요. 근데 진짜 무서운 건, 그다음 이야기예요.", None, "당황해서 웃으며 얼버무리다가, 뒤 문장은 의미심장하게 낮춰서."),
]
# per character: mouth centre and radii (sprite px), eye box; all sprites of a character share the base framing
FACE = {'sophia': {'mouth': (432, 308, 34, 22), 'eyes': (355, 228, 510, 292)},
        'haru': {'mouth': (420, 622, 36, 24), 'eyes': (320, 518, 520, 588)},
        'minerva': {'mouth': (430, 462, 40, 34), 'eyes': None}}
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'


# ---------- TTS ----------
def tts(i, who, text, style):
    path = f'tts/{i:02d}_{who}.wav'
    if os.path.exists(path): return path
    body = {"contents": [{"role": "user", "parts": [{"text": text, "speechMetadata": {"style": STYLE[who] + ' ' + style}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOICE[who]}}, "languageCode": "ko-KR"}}}
    for k in range(5):
        r = requests.post(URL, headers={'Authorization': 'Bearer ' + vx.token(), 'Content-Type': 'application/json'}, data=json.dumps(body), timeout=300)
        if r.status_code == 200:
            parts, _ = vx.inline_parts(r.json())
            if parts: open(path, 'wb').write(parts[0][1]); return path
        time.sleep(6 * (k + 1))
    raise RuntimeError(f'TTS {r.status_code}: {r.text[:200]}')


def load(p):
    w, sr = sf.read(p)
    if w.ndim > 1: w = w.mean(1)
    if sr != SR: w = resample_poly(w, 441, 240) if sr == 24000 else resample_poly(w, SR, sr)
    thr = 0.01 * np.abs(w).max(); idx = np.where(np.abs(w) > thr)[0]
    return w[max(0, idx[0] - int(0.03 * SR)):idx[-1] + int(0.08 * SR)]


# ---------- images ----------
def key(im):
    """Alpha from distance to the corner (screen) colour, soft edge + magenta despill on the rim."""
    a = np.asarray(im.convert('RGB')).astype(np.float32)
    bg = np.median(np.concatenate([a[:8, :8].reshape(-1, 3), a[:8, -8:].reshape(-1, 3)]), 0)
    d = np.sqrt(((a - bg) ** 2).sum(2))
    al = np.clip((d - 70) / 60, 0, 1)
    rim = (al > 0) & (al < 1)
    a[..., 0] = np.where(rim, np.minimum(a[..., 0], (a[..., 0] + a[..., 1]) / 2 + 20), a[..., 0])
    a[..., 2] = np.where(rim, np.minimum(a[..., 2], (a[..., 2] + a[..., 1]) / 2 + 20), a[..., 2])
    fade = np.clip((a.shape[0] - np.arange(a.shape[0])) / (a.shape[0] * 0.14), 0, 1)[:, None]  # soft bottom edge (shows through the box)
    return Image.fromarray(np.dstack([a, al * fade * 255]).astype(np.uint8), 'RGBA')


def patch(base, var, box, ellipse):
    """Paste `var` into `base` only inside a feathered ellipse/rect (mouth or eyes)."""
    m = Image.new('L', base.size, 0); d = ImageDraw.Draw(m)
    (d.ellipse if ellipse else d.rectangle)(box, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(6))
    return Image.composite(var, base, m)


SPR = {}


def sprite(who, expr, state):
    """state: closed | open | blink -> keyed RGBA (variants are patched into the closed base)."""
    k = (who, expr, state)
    if k in SPR: return SPR[k]
    base = Image.open(f'sprites/{who}_{expr}_closed.png').convert('RGB')
    im = base
    f = FACE[who]
    if state == 'open' and os.path.exists(f'sprites/{who}_{expr}_open.png'):
        x, y, rx, ry = f['mouth']
        im = patch(base, Image.open(f'sprites/{who}_{expr}_open.png').convert('RGB').resize(base.size), (x - rx, y - ry, x + rx, y + ry), True)
    if state == 'blink' and f['eyes'] and os.path.exists(f'sprites/{who}_{expr}_blink.png'):
        im = patch(base, Image.open(f'sprites/{who}_{expr}_blink.png').convert('RGB').resize(base.size), f['eyes'], False)
    SPR[k] = key(im); return SPR[k]


# ---------- layout ----------
LAYOUT = {  # who: (centre x, screen y of the mouth, scale); sprites are anchored by the mouth so faces line up whatever the framing
 'cafe': {'minerva': (410, 425, 0.45), 'haru': (740, 470, 1.0), 'sophia': (1420, 450, 1.25)},
 'cave': {'sophia': (1300, 450, 1.25)},
}
FIRST = {'sophia': 'smile', 'haru': 'sad', 'minerva': 'grumpy'}  # expression before a character's first line
BOX = (90, 790, W - 90, 1050)
F_TEXT, F_NAME = ImageFont.truetype(FONT, 46), ImageFont.truetype(FONT, 40)
BGI = {}


def bg(scene, t):
    if scene not in BGI:
        im = Image.open(f'bg_{scene}.png').convert('RGB')
        if scene == 'cafe': im = im.transpose(Image.FLIP_LEFT_RIGHT)  # owl perch on the left, counter on the right
        im = im.resize((int(W * 1.08), int(H * 1.08)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
        if scene == 'cave': im = ImageEnhance.Brightness(im).enhance(0.8)
        BGI[scene] = im
    im = BGI[scene]; dx = int((im.width - W) * (0.5 + 0.4 * np.sin(t / 9)))  # slow drift
    return im.crop((dx, (im.height - H) // 2, dx + W, (im.height - H) // 2 + H)).copy()


def wrap(text, font, width):
    lines, cur = [], ''
    for ch in text:
        if font.getlength(cur + ch) > width and cur:
            cut = cur.rfind(' ')
            if cut > 0: lines.append(cur[:cut]); cur = cur[cut + 1:] + ch
            else: lines.append(cur); cur = ch
        else: cur += ch
    return lines + [cur] if cur else lines


def dialogue(fr, who, text, shown):
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    d.rounded_rectangle(BOX, 28, fill=(22, 18, 34, 205), outline=(235, 210, 170, 160), width=3)
    col = {'sophia': (120, 110, 200), 'haru': (235, 140, 70), 'minerva': (140, 125, 100)}[who]
    nw = int(F_NAME.getlength(NAME[who])) + 60
    d.rounded_rectangle((BOX[0] + 40, BOX[1] - 34, BOX[0] + 40 + nw, BOX[1] + 30), 20, fill=col + (255,))
    d.text((BOX[0] + 70, BOX[1] - 30), NAME[who], font=F_NAME, fill=(255, 255, 255))
    for j, line in enumerate(wrap(text[:shown], F_TEXT, BOX[2] - BOX[0] - 120)):
        d.text((BOX[0] + 60, BOX[1] + 58 + j * 66), line, font=F_TEXT, fill=(250, 246, 238))
    fr.alpha_composite(ov)


def title(fr, a):
    ov = Image.new('RGBA', (W, H), (10, 8, 20, int(170 * a))); d = ImageDraw.Draw(ov)
    f1, f2 = ImageFont.truetype(FONT, 56), ImageFont.truetype(FONT, 96)
    for txt, f, y, c in (("새벽 철학 카페 #1", f1, 400, (235, 210, 170)), ("남들 피드가 동굴 벽 그림자라면", f2, 490, (255, 255, 255))):
        x = (W - f.getlength(txt)) / 2; d.text((x, y), txt, font=f, fill=c + (int(255 * a),))
    fr.alpha_composite(ov)


# ---------- timeline ----------
def build():
    os.makedirs('tts', exist_ok=True); vx.token()
    ev, audio, t = [], [np.zeros(int(0.6 * SR))], 0.6
    for i, (scene, who, expr, text, spoken, style) in enumerate(S):
        if scene == 'title':
            ev.append(dict(scene='title', t0=t, t1=t + 2.6)); audio.append(np.zeros(int(2.6 * SR))); t += 2.6; continue
        w = load(tts(i, who, spoken or text, style))
        hop = SR // FPS; env = np.array([np.sqrt(np.mean(w[k:k + hop] ** 2)) for k in range(0, len(w), hop)])
        ev.append(dict(scene=scene, who=who, expr=expr, text=text, t0=t, t1=t + len(w) / SR, env=env / (env.max() + 1e-9)))
        gap = 0.45 if i + 1 < len(S) and S[i + 1][0] == scene else 0.7
        audio += [w, np.zeros(int(gap * SR))]; t += len(w) / SR + gap
    audio.append(np.zeros(int(1.2 * SR))); t += 1.2
    voice = np.concatenate(audio)
    return ev, voice, t


def render(ev, total):
    random.seed(3)
    blinks = {w: sorted(random.uniform(0.5, total) for _ in range(int(total / 3.2))) for w in NAME}
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                           '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '_video.mp4'], stdin=subprocess.PIPE)
    speech = [e for e in ev if e['scene'] != 'title']
    for n in range(int(total * FPS)):
        t = n / FPS
        cur = next((e for e in ev if e['t0'] <= t < e['t1']), None)
        if cur is None: cur = max((e for e in ev if e['t0'] <= t), key=lambda e: e['t0'], default=ev[0])
        scene = cur['scene'] if cur['scene'] != 'title' else 'cafe'
        last = max((e for e in speech if e['t0'] <= t), key=lambda e: e['t0'], default=speech[0])
        fr = bg(scene, t).convert('RGBA')
        for who, (cx, my, sc) in LAYOUT[scene].items():
            # each character keeps the expression of its most recent line in this scene
            mine = [e for e in speech if e['who'] == who and e['scene'] == scene and e['t0'] <= t]
            expr = mine[-1]['expr'] if mine else FIRST[who]
            if scene == 'cave': expr = 'chiton'
            talking = cur.get('who') == who and cur['t0'] <= t < cur['t1']
            state = 'closed'
            if talking:
                k = int((t - cur['t0']) * FPS); state = 'open' if k < len(cur['env']) and cur['env'][k] > 0.18 else 'closed'
            elif any(b <= t < b + 0.13 for b in blinks[who]): state = 'blink'
            im = sprite(who, expr, state)
            breath = 1 + 0.006 * np.sin(t * 2.1 + hash(who) % 7)
            pop = 1 + 0.02 * max(0, 1 - (t - cur['t0']) / 0.25) if talking else 1
            s = sc * breath * pop
            im2 = im.resize((int(im.width * s), int(im.height * s)), Image.BILINEAR)
            if last.get('who') != who and who != 'minerva':
                im2 = Image.merge('RGBA', [*ImageEnhance.Brightness(im2.convert('RGB')).enhance(0.62).split(), im2.split()[3]])
            fr.alpha_composite(im2, (int(cx - im2.width / 2), int(my - FACE[who]['mouth'][1] * s)))
        if cur['scene'] == 'title':
            a = min(1, (t - cur['t0']) / 0.4, (cur['t1'] - t) / 0.4); title(fr, max(0, a))
        else:
            ln = last; shown = int(len(ln['text']) * min(1, (t - ln['t0']) / max(0.6, (ln['t1'] - ln['t0']) * 0.7)))
            if t < ln['t1'] + 0.45: dialogue(fr, ln['who'], ln['text'], max(1, shown))
        # white flash around scene changes
        for e0, e1 in zip(ev, ev[1:]):
            if e1['scene'] != e0['scene'] and 'title' not in (e0['scene'], e1['scene']):
                dt = abs(t - (e1['t0'] - 0.2))
                if dt < 0.25: fr.alpha_composite(Image.new('RGBA', (W, H), (255, 255, 255, int(255 * (1 - dt / 0.25)))))
        fade = min(1, t / 0.6, (total - t) / 0.8)
        if fade < 1: fr.alpha_composite(Image.new('RGBA', (W, H), (0, 0, 0, int(255 * (1 - fade)))))
        ff.stdin.write(fr.convert('RGB').tobytes())
    ff.stdin.close(); ff.wait()


if __name__ == '__main__':
    ev, voice, total = build()
    sf.write('_voice.wav', voice, SR)
    print('total', round(total, 1), 's')
    render(ev, total)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '_video.mp4', '-i', '_voice.wav', '-i', '../../bgm/cand_1_piano_a.mp3',
                    '-filter_complex', f'[2:a]volume=0.12,afade=t=in:d=1.5,afade=t=out:st={total - 2:.2f}:d=2[b];[1:a][b]amix=inputs=2:duration=first:normalize=0[a]',
                    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', OUT], check=True)
    print(OUT)
