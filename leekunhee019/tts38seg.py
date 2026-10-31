"""Re-voice a multi-voice long-form (narrator + characters) with Gemini 3.8 Flash TTS on Google Cloud (project credits).
Segments follow the source tts3.py: lines with args['segs'] keep their (voice, text[, spoken]) pieces; plain narrator lines
are read in ONE request per line (more natural phrasing). Each segment gets its character's prebuilt voice + a short
speechMetadata style; every take is checked with Whisper (Hangul CER) and retaken up to 3 takes. voice.wav and
timeline.json (lines with per-segment v/text/t0/t1, lip-sync env) are rebuilt with the same gaps as the source build.
usage: python3 tts38seg.py synth|build|all   (run inside the episode folder; style38.json next to it)
env RETAKE=9_1,40_0 forces extra takes for those segments (line_seg)."""
import hashlib, json, os, re, sys, time
from concurrent.futures import ThreadPoolExecutor
import numpy as np, requests, soundfile as sf
from scipy.signal import resample_poly
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'gtts'))
import vx
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D); sys.path.insert(0, D)
from script import S
STY = json.load(open('style38.json', encoding='utf-8'))
SR = 44100
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
os.makedirs('tts38', exist_ok=True)
NAME_FIX = [('만약에연구소였습니다', '상식실험실이었습니다'), ('만약에연구소', '상식실험실')]
RETAKE = set(x for x in os.environ.get('RETAKE', '').split(',') if x)
MAXT = 3


def fix(s):
    for a, b in NAME_FIX: s = s.replace(a, b)
    return s


def segments(i):
    """[(voice, written, spoken)] — written goes to subtitles, spoken to TTS."""
    scene, args, sub, spk = S[i]
    if args.get('silent'): return []   # on-screen text only (message / card), no voice
    if 'segs' in args:
        return [(s[0], fix(s[1]), fix(s[2] if len(s) > 2 else s[1])) for s in args['segs']]
    return [('N', fix(sub), fix(spk or sub))]


def style_for(i, j, v):
    scene = S[i][0]
    if v == 'N':
        s = STY.get('line', {}).get(str(i)) or STY.get('scene', {}).get(scene) or ''
        return STY['base'] + ' ' + s
    s = STY.get('seg', {}).get(f'{i}_{j}', '')
    return STY['char'][v] + (' ' + s if s else '')


def voice_of(v): return STY['voices'][v]


def key(i, j, v, sp, k):
    return '%02d_%02d_%d_%s' % (i, j, k, hashlib.md5((voice_of(v) + '|' + style_for(i, j, v) + '|' + sp).encode()).hexdigest()[:8])


def lang_of(text):  # 018: Japanese lines (kana) are read as Japanese
    return 'ja-JP' if re.search(r'[\u3040-\u30ff]', text) else 'ko-KR'


def synth_one(text, voice, style, path):
    if os.path.exists(path): return path
    body = {"contents": [{"role": "user", "parts": [{"text": text, "speechMetadata": {"style": style}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}, "languageCode": lang_of(text)}}}
    r = None
    for k in range(7):
        try:
            r = requests.post(URL, headers={'Authorization': 'Bearer ' + vx.token(), 'Content-Type': 'application/json'},
                              data=json.dumps(body), timeout=300)
            if r.status_code == 200:
                parts, _ = vx.inline_parts(r.json())
                if parts:
                    open(path, 'wb').write(parts[0][1]); return path
        except Exception as e:
            print('req err', e, flush=True)
        time.sleep(6 * (k + 1))
    raise RuntimeError(f'TTS failed {r.status_code if r is not None else "-"}: {r.text[:300] if r is not None else ""}')


def load_trim(p, cap=None):
    w, sr = sf.read(p)
    if w.ndim > 1: w = w.mean(1)
    if sr != SR: w = resample_poly(w, 441, 240) if sr == 24000 else resample_poly(w, SR, sr)
    thr = 0.01 * np.abs(w).max(); idx = np.where(np.abs(w) > thr)[0]
    w = w[max(0, idx[0] - int(0.03 * SR)):idx[-1] + int(0.06 * SR)]
    return cap_pauses(w, *cap) if cap else w


def cap_pauses(w, longer=0.75, keep=0.55):
    """Shorten silent gaps inside a take that are longer than `longer` s to `keep` s (cut from the middle, 10 ms crossfade)."""
    hop = int(0.02 * SR); n = len(w) // hop
    if n < 3: return w
    e = np.sqrt(np.mean(w[:n * hop].reshape(n, hop) ** 2, axis=1)); sil = e < 0.02 * e.max()
    cuts = []; k = 0
    while k < n:
        if sil[k]:
            j = k
            while j < n and sil[j]: j += 1
            if k > 0 and j < n and (j - k) * 0.02 > longer:
                mid = (k + j) * hop // 2; drop = int(((j - k) * 0.02 - keep) * SR)
                cuts.append((mid - drop // 2, mid + drop // 2))
            k = j
        else: k += 1
    if not cuts: return w
    out = []; prev = 0; xf = int(0.01 * SR)
    for a, b in cuts:
        seg = w[prev:a].copy(); seg[-xf:] *= np.linspace(1, 0, xf); out.append(seg); prev = b
    rest = w[prev:].copy(); rest[:xf] *= np.linspace(0, 1, xf); out.append(rest)
    return np.concatenate(out)


hangul = lambda t: re.sub(r'[^가-힣]', '', t)


def cer1(hyp, ref):
    a, b = hangul(hyp), hangul(ref); d = list(range(len(b) + 1))
    if not b: return 0.0
    for x in a:
        prev, d[0] = d[0], d[0] + 1
        for j, y in enumerate(b, 1): prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (x != y))
    return d[len(b)] / max(1, len(b))


def cer(hyp, written, spoken):
    # Whisper writes numbers either as digits or as words: compare with the spoken form and with the written form minus digits
    return min(cer1(hyp, spoken), cer1(hyp, re.sub(r'[0-9][0-9,\.]*', '', written)))


_ASR = None
def asr(w, lang='ko'):
    global _ASR
    if _ASR is None:
        from faster_whisper import WhisperModel
        _ASR = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=2)
    w16 = resample_poly(np.pad(w, (int(0.2 * SR), int(0.2 * SR))), 160, 441).astype(np.float32)
    sg, _ = _ASR.transcribe(w16, language=lang, beam_size=1, condition_on_previous_text=False, vad_filter=False)
    return ''.join(x.text for x in sg).strip()


ALL = [(i, j, v, txt, sp) for i in range(len(S)) for j, (v, txt, sp) in enumerate(segments(i))]
RES = json.load(open('asr38.json')) if os.path.exists('asr38.json') else {}


def path_of(i, j, v, sp, k): return f'tts38/{key(i, j, v, sp, k)}.wav'


def synth_takes(jobs):
    def go(job):
        i, j, v, txt, sp, k = job
        synth_one(sp, voice_of(v), style_for(i, j, v), path_of(i, j, v, sp, k))
        return job
    with ThreadPoolExecutor(4) as ex:
        for n, job in enumerate(ex.map(go, jobs)):
            if n % 10 == 0: print('synth', n, '/', len(jobs), flush=True)


def check(jobs):
    for (i, j, v, txt, sp, k) in jobs:
        kk = key(i, j, v, sp, k)
        if kk in RES: continue
        w = load_trim(path_of(i, j, v, sp, k)); hyp = asr(w, 'ja' if lang_of(sp) == 'ja-JP' else 'ko')
        RES[kk] = {'cer': round(cer(hyp, txt, sp), 3), 'hyp': hyp[:120], 'dur': round(len(w) / SR, 2)}
    json.dump(RES, open('asr38.json', 'w'), ensure_ascii=False, indent=1)


def best_take(i, j, v, txt, sp):
    ks = [k for k in range(MAXT) if key(i, j, v, sp, k) in RES]
    if not ks: return None, None
    k = min(ks, key=lambda k: RES[key(i, j, v, sp, k)]['cer'])
    return k, RES[key(i, j, v, sp, k)]['cer']


def synth():
    vx.token()
    for rnd in range(MAXT):
        jobs = []
        for (i, j, v, txt, sp) in ALL:
            have = [k for k in range(MAXT) if os.path.exists(path_of(i, j, v, sp, k))]
            if rnd == 0 and 0 not in have: jobs.append((i, j, v, txt, sp, 0)); continue
            k, c = best_take(i, j, v, txt, sp)
            need = (c is not None and c > 0.12) or (f'{i}_{j}' in RETAKE and rnd > 0 and len(have) <= rnd)
            if need and len(have) <= rnd and rnd < MAXT: jobs.append((i, j, v, txt, sp, len(have)))
        print('round', rnd, 'jobs', len(jobs), flush=True)
        if jobs: synth_takes(jobs)
        check([(i, j, v, txt, sp, k) for (i, j, v, txt, sp) in ALL for k in range(MAXT) if os.path.exists(path_of(i, j, v, sp, k))])
        if not jobs and rnd > 0: break


def gap_after(txt, nxt_v, v):
    t = txt.strip()
    g = 0.42 if t.endswith('?') else (0.4 if t.endswith('…') else (0.18 if t.endswith(',') else 0.34))
    if len(re.sub(r'[^0-9A-Za-z가-힣%]', '', t)) <= 6 and not t.endswith('?'): g -= 0.06
    if nxt_v is not None and nxt_v != v: g += 0.1
    return g


def build():
    force = json.load(open('force38.json')) if os.path.exists('force38.json') else {}
    chunks = [np.zeros(int(0.8 * SR))]; tl = []; t = 0.8; rep = []
    for i, (scene, args, sub, spk) in enumerate(S):
        segs = segments(i); parts = []; st = []; tt = t
        if args.get('silent'): parts.append(np.zeros(int(args['silent'] * SR)))
        for j, (v, txt, sp) in enumerate(segs):
            k, c = best_take(i, j, v, txt, sp)
            if f'{i}_{j}' in force: k = force[f'{i}_{j}']; c = RES[key(i, j, v, sp, k)]['cer']
            w = load_trim(path_of(i, j, v, sp, k), STY.get('cap_pause'))
            lv = 20 * np.log10(np.sqrt(np.mean(w[np.abs(w) > 0.01] ** 2)) + 1e-9); w = w * float(np.clip(10 ** ((-21.0 - lv) / 20), 0.6, 2.0))
            rep.append({'i': i, 'j': j, 'v': v, 'take': k, 'cer': c, 'dur': round(len(w) / SR, 2), 'hyp': RES[key(i, j, v, sp, k)]['hyp'][:80]})
            parts.append(w); st.append({'v': v, 'text': txt, 't0': round(tt, 3), 't1': round(tt + len(w) / SR, 3)}); tt += len(w) / SR
            if j + 1 < len(segs): g = int(gap_after(txt, segs[j + 1][0], v) * SR); parts.append(np.zeros(g)); tt += g / SR
        w = np.concatenate(parts); d = len(w) / SR
        tl.append({'i': i, 'scene': scene, 'args': args, 'sub': fix(sub), 't0': round(t, 3), 't1': round(t + d, 3), 'segs': st})
        chunks.append(w); t += d
        gap = STY.get('gap_line', 0.5)   # 019: brisk tempo — 0.3 between lines, +0.15 on a scene change
        if i + 1 < len(S) and S[i + 1][0] != scene: gap += STY.get('gap_scene', 0.2)
        gap += args.get('pause', 0)
        chunks.append(np.zeros(int(gap * SR))); t += gap
    chunks.append(np.zeros(int(2.0 * SR))); t += 2.0
    voice = np.concatenate(chunks); voice = voice / (np.abs(voice).max() + 1e-9) * 0.95; sf.write('voice.wav', voice, SR)
    FPS = 24; hop = SR // FPS; nfr = int(t * FPS) + 1
    pad = np.pad(voice, (0, max(0, nfr * hop - len(voice))))
    rms = np.sqrt(np.mean(pad[:nfr * hop].reshape(nfr, hop) ** 2, axis=1))
    envv = np.clip(rms / (np.percentile(rms[rms > 1e-4], 90) + 1e-9), 0, 1)
    json.dump({'duration': round(t, 3), 'lines': tl, 'env': [round(float(x), 2) for x in envv]}, open('timeline.json', 'w'), ensure_ascii=False, indent=1)
    json.dump(rep, open('tts38_report.json', 'w'), ensure_ascii=False, indent=1)
    bad = [(r['i'], r['j'], r['v'], r['cer']) for r in rep if (r['cer'] or 0) > 0.2]
    print('total %.1fs (%d:%02d), lines %d, segments %d, flagged %s' % (t, t // 60, t % 60, len(tl), len(rep), bad))


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd in ('synth', 'all'): synth()
    if cmd in ('build', 'all'): build()
