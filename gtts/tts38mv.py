"""Re-voice a MULTI-VOICE long-form (narrator + characters) with Gemini 3.8 Flash TTS on Google Cloud (project credits).
Script format (ep.007+): S = [(scene, args, subtitle, spoken-or-None)], args['segs'] = [(voice, text[, spoken])].
- Lines without segs: one request for the whole line in the narrator voice (natural prosody, like tts38.py).
- Lines with segs: one request per segment, each in its speaker's voice + style.
- Every take is checked with Whisper (Hangul CER vs the written form, digits ignored); up to 3 takes (RETAKE=i,j: fresh takes 3-5).
- voice.wav / timeline.json (with per-line 'segs' [{v,text,t0,t1}] for speaker-coloured cues) / lip-sync env are built with the
  same gaps as the episode's own tts3.py build step.
Style json: {"voices": {"N": {"name": "Schedar"}, "D": {"name": "Charon", "style": "..."}, ...}, "base": narrator base style,
             "scene": {scene: narrator style}, "line": {"i": narrator style}, "seg": {"i.j": style override}, "use_spk": true}
usage: python3 tts38mv.py <episode folder> <style json>"""
import hashlib, json, os, re, sys, time
import numpy as np, requests, soundfile as sf
from scipy.signal import resample_poly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import vx

D = os.path.abspath(sys.argv[1]); STY = json.load(open(sys.argv[2], encoding='utf-8'))
sys.path.insert(0, D); os.chdir(D)
import script
S = script.S
SR = 44100
VOICES = STY['voices']
BASE = STY['base']
URL = f'https://aiplatform.googleapis.com/v1beta1/projects/{vx.PROJECT}/locations/global/publishers/google/models/gemini-3.8-flash-tts:generateContent'
os.makedirs('tts38', exist_ok=True)
RET = [x.strip() for x in os.environ.get('RETAKE', '').split(',') if x.strip()]   # "i" (whole line) or "i.j" (one segment)
RET2 = [x.strip() for x in os.environ.get('RETAKE2', '').split(',') if x.strip()]   # a second round of fresh takes (6-8)


def segments(i):
    scene, args, sub, spk = S[i]
    if 'segs' in args:
        return [(s[0], s[1], s[2] if len(s) > 2 else s[1]) for s in args['segs']]
    spoken = spk if (spk and STY.get('use_spk')) else sub
    if STY.get('split_n'):   # sentence-level narrator segments, exactly like the episode's tts3.py (scenes time cues by segment)
        a = re.split(r'(?<=[.?!])\s+', sub.strip()); b = re.split(r'(?<=[.?!])\s+', spoken.strip())
        if len(a) != len(b): a = b
        return [('N', x, y) for x, y in zip(a, b)]
    return [('N', sub, spoken)]


def style_for(i, j, v, scene):
    o = STY.get('seg', {}).get(f'{i}.{j}')
    if v == 'N':
        s = o or STY.get('line', {}).get(str(i)) or STY.get('scene', {}).get(scene) or ''
        return BASE + ' ' + s
    return (VOICES[v].get('style', '') + ' ' + (o or '')).strip()


def synth(text, voice, style, path):
    if os.path.exists(path): return path
    body = {"contents": [{"role": "user", "parts": [{"text": text, "speechMetadata": {"style": style}}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}, "languageCode": "ko-KR"}}}
    for k in range(6):
        try:
            r = requests.post(URL, headers={'Authorization': 'Bearer ' + vx.token(), 'Content-Type': 'application/json'},
                              data=json.dumps(body), timeout=300)
        except requests.RequestException as e:
            print('net', e, flush=True); time.sleep(5 * (k + 1)); continue
        if r.status_code == 200:
            parts, _ = vx.inline_parts(r.json())
            if parts:
                open(path, 'wb').write(parts[0][1]); return path
        time.sleep(5 * (k + 1))
    raise RuntimeError(f'TTS failed {r.status_code}: {r.text[:300]}')


def load_trim(p):
    w, sr = sf.read(p)
    if w.ndim > 1: w = w.mean(1)
    if sr != SR: w = resample_poly(w, 441, 240) if sr == 24000 else resample_poly(w, SR, sr)
    thr = 0.01 * np.abs(w).max(); idx = np.where(np.abs(w) > thr)[0]
    return w[max(0, idx[0] - int(0.03 * SR)):idx[-1] + int(0.06 * SR)]


def tempo(w, f):
    import subprocess, tempfile
    with tempfile.TemporaryDirectory() as d:
        a, b = os.path.join(d, 'a.wav'), os.path.join(d, 'b.wav'); sf.write(a, w, SR)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a, '-af', f'atempo={f}', b], check=True)
        x, _ = sf.read(b)
    return x


def cap_pauses(w, cap):
    """Shorten pauses inside a take that are longer than `cap` seconds (keeps cap/2 on each side of the gap)."""
    hop = int(0.01 * SR); n = len(w) // hop
    if n < 3: return w
    e = np.sqrt(np.mean(w[:n * hop].reshape(n, hop) ** 2, axis=1)); q = e < 0.02 * e.max()
    keep = np.ones(len(w), bool); run = 0; half = int(cap / 2 * SR)
    for i in range(n + 1):
        if i < n and q[i]: run += 1; continue
        if run * 0.01 > cap: keep[(i - run) * hop + half:i * hop - half] = False
        run = 0
    return w[keep]


from faster_whisper import WhisperModel
ASR = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=2)
hangul = lambda t: re.sub(r'[^가-힣]', '', t)


def cer(hyp, ref):
    a, b = hangul(hyp), hangul(ref); d = list(range(len(b) + 1))
    for x in a:
        prev, d[0] = d[0], d[0] + 1
        for j, y in enumerate(b, 1): prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (x != y))
    return d[len(b)] / max(1, len(b))


def check(w, text):
    w16 = resample_poly(np.pad(w, (int(0.2 * SR), int(0.2 * SR))), 160, 441).astype(np.float32)
    sg, _ = ASR.transcribe(w16, language='ko', beam_size=1, condition_on_previous_text=False, vad_filter=False)
    hyp = ''.join(x.text for x in sg).strip()
    hyp = re.sub(r'[0-9][0-9,\.]*', '', hyp)   # digits read as words but transcribed as digits: drop on both sides
    ref = re.sub(r'[0-9][0-9,\.]*', '', text)
    return cer(hyp, ref), hyp


def norm(t): return re.sub(r"[^0-9A-Za-z가-힣%]", "", t)


def gap_after(txt, nxt_v, v):   # identical to the episode's tts3.py
    t = txt.strip()
    g = 0.42 if t.endswith('?') else (0.4 if t.endswith('…') else (0.18 if t.endswith(',') else 0.34))
    if len(norm(t)) <= 6 and not t.endswith('?'): g -= 0.06
    if nxt_v is not None and nxt_v != v: g += 0.1
    return g


chunks = [np.zeros(int(0.8 * SR))]; tl = []; t = 0.8; report = []
for i, (scene, args, sub, spk) in enumerate(S):
    segs = segments(i); parts = []; st = []; tt = t
    for j, (v, txt, sp) in enumerate(segs):
        voice = VOICES[v]['name']; style = style_for(i, j, v, scene)
        retake2 = str(i) in RET2 or f'{i}.{j}' in RET2
        retake = retake2 or str(i) in RET or f'{i}.{j}' in RET
        best = None
        plan = list(range(6, 9) if retake2 else range(3, 6) if retake else range(3))
        key = lambda tk: f'tts38/{i:03d}_{j}_' + hashlib.md5(f'{voice}|{style}|{sp}|{tk}'.encode()).hexdigest()[:12] + '.wav'
        cached = [tk for tk in range(9) if tk not in plan and os.path.exists(key(tk))]   # earlier retakes stay in the running
        for take in cached + plan:
            h = hashlib.md5(f'{voice}|{style}|{sp}|{take}'.encode()).hexdigest()[:12]
            w = load_trim(synth(sp, voice, style, f'tts38/{i:03d}_{j}_{h}.wav'))
            if STY.get('cap_pause'): w = cap_pauses(w, STY['cap_pause'])
            c, hyp = check(w, txt)
            if best is None or c < best[0]: best = (c, w, hyp, take)
            if c <= (0.04 if retake else 0.12): break
        c, w, hyp, take = best
        if VOICES[v].get('tempo'): w = tempo(w, VOICES[v]['tempo'])   # pitch-preserving speed-up for a voice that reads slowly
        lv = 20 * np.log10(np.sqrt(np.mean(w[np.abs(w) > 0.01] ** 2)) + 1e-9)
        w = w * float(np.clip(10 ** ((-21.0 - lv) / 20), 0.7, 1.6))   # even out the voices (as tts3.py)
        report.append({'i': i, 'j': j, 'v': v, 'cer': round(c, 3), 'take': take, 'dur': round(len(w) / SR, 2), 'hyp': hyp[:90]})
        print(f'{i:02d}.{j} {v} {scene:9s} cer {c:.2f} take {take} {len(w) / SR:5.1f}s', flush=True)
        parts.append(w); st.append({"v": v, "text": txt, "t0": round(tt, 3), "t1": round(tt + len(w) / SR, 3)}); tt += len(w) / SR
        if j + 1 < len(segs):
            g = int(gap_after(txt, segs[j + 1][0], v) * SR); parts.append(np.zeros(g)); tt += g / SR
    w = np.concatenate(parts); d = len(w) / SR
    tl.append({"i": i, "scene": scene, "args": args, "sub": sub, "t0": round(t, 3), "t1": round(t + d, 3), "segs": st})
    chunks.append(w); t += d
    gap = 0.95 if scene == "chapter" or (i + 1 < len(S) and S[i + 1][0] == "chapter") else 0.5
    if i + 1 < len(S) and S[i + 1][0] != scene: gap += 0.2
    gap += args.get("pause", 0)
    chunks.append(np.zeros(int(gap * SR))); t += gap
chunks.append(np.zeros(int(2.0 * SR))); t += 2.0
voice = np.concatenate(chunks); sf.write("voice.wav", voice, SR)
FPS = 24; hop = SR // FPS; nfr = int(t * FPS) + 1
pad = np.pad(voice, (0, max(0, nfr * hop - len(voice))))
rms = np.sqrt(np.mean(pad[:nfr * hop].reshape(nfr, hop) ** 2, axis=1))
envv = np.clip(rms / (np.percentile(rms[rms > 1e-4], 90) + 1e-9), 0, 1)
json.dump({"duration": round(t, 3), "lines": tl, "env": [round(float(x), 2) for x in envv]}, open("timeline.json", "w"), ensure_ascii=False, indent=1)
json.dump(report, open('tts38_report.json', 'w'), ensure_ascii=False, indent=1)
bad = [(r['i'], r['j'], r['cer']) for r in report if r['cer'] > 0.2]
print(f'total {t:.1f}s ({int(t // 60)}:{int(t % 60):02d}), lines {len(tl)}, segments {len(report)}, flagged {len(bad)}:', bad)
