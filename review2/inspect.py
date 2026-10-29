import re, os, json, glob, subprocess, importlib.util
EP = [("002","walk"),("003","phone"),("004","sugar"),("005","nietzsche"),("006","stoic"),("007","descartes2"),("008","zhuangzi3"),("009","socrates2"),("010","buddha2")]
QUOTE = re.compile(r"(말했|물었|답했|썼습니다|적었|속삭|외쳤|가르쳤|말합니다|묻습니다|답합니다|권했|덧붙였|불렀)")
def load(d):
    spec = importlib.util.spec_from_file_location("s_"+d, d+"/script.py"); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m.S
out = {}
for ep, d in EP:
    S = load(d); r = {"dir": d}
    ends = []; dlg = 0; voiced = 0
    for x in S:
        sc, a, sub = x[0], x[1], x[2]
        segs = a.get("segs")
        if segs: voiced += any(s[0] != "N" for s in segs)
        narr = " ".join(s[1] for s in segs if s[0] == "N") if segs else sub
        sents = [s for s in re.split(r'(?<=[.?!])\s+', narr.strip()) if re.sub(r"[^가-힣]", "", s)]
        for s in sents: ends.append(("요" if re.sub(r"[^가-힣]", "", s).endswith("요") else "x", s.endswith("?")))
        if not segs and QUOTE.search(sub) and len(sents) >= 2: dlg += 1
    n = len(ends); y = sum(e == "요" for e, q in ends); yq = sum(e == "요" and q for e, q in ends)
    run = mx = 0
    for e, q in ends: run = run + 1 if e == "요" else 0; mx = max(mx, run)
    r.update(lines=len(S), sents=n, yo=round(100*y/n), yo_noq=round(100*(y-yq)/n), yo_run=mx, narr_reads_dialogue=dlg, voiced_lines=voiced,
             chapters=sum(x[0] == "chapter" for x in S), studies=sum(1 for x in S if x[1].get("study") or x[1].get("src")))
    # costume flags in the episode's own page/scene files
    own = glob.glob(d + "/anim*.html") + glob.glob(d + "/scenes*.js")
    cos = []
    for f in own:
        for i, L in enumerate(open(f), 1):
            if re.search(r"(const Z = |Z\(\{)", L) and re.search(r"(wreath|toga|stache|hat:|beret|crown|costume|wig)\s*:\s*(?!false)", L):
                cos.append(f"{os.path.basename(f)}:{i}")
            if re.search(r"let (STACHE|ROMAN|COSTUME)", L): cos.append(f"{os.path.basename(f)}:{i} {L.strip()[:90]}")
    r["costume"] = cos[:6]; r["costume_n"] = len(cos)
    # on-screen text ending in 요 (own files only)
    yo_txt = set()
    for f in own:
        for m in re.finditer(r"'([^'\n]{2,40}[가-힣]요[.?!…]*)'", open(f).read()): yo_txt.add(m.group(1))
    r["onscreen_yo"] = sorted(yo_txt)
    # final video, loudness, srt and upload text
    vids = sorted(glob.glob(d + "/만약에연구소_실험*.mp4"), key=os.path.getmtime); v = vids[-1]; r["video"] = os.path.basename(v)
    dur = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",v],capture_output=True,text=True).stdout)
    lo = subprocess.run(["ffmpeg","-nostats","-i",v,"-vn","-af","ebur128","-f","null","-"],capture_output=True,text=True).stderr
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", lo); r["lufs"] = float(m[-1]) if m else None; r["dur"] = round(dur, 1)
    tl = json.load(open(d + "/timeline.json")); r["tl_dur"] = tl["duration"]
    srts = sorted(glob.glob(d + "/*.srt"), key=os.path.getmtime)
    if srts:
        s = open(srts[-1]).read(); ends_ = re.findall(r"--> (\d+):(\d+):(\d+),(\d+)", s)
        last = int(ends_[-1][0])*3600+int(ends_[-1][1])*60+int(ends_[-1][2]) if ends_ else 0
        r["srt"] = os.path.basename(srts[-1]); r["srt_last"] = last; r["srt_older_than_tl"] = os.path.getmtime(srts[-1]) < os.path.getmtime(d + "/timeline.json") - 5
    ups = sorted(glob.glob(d + "/유튜브_업로드*.txt"), key=os.path.getmtime)
    if ups:
        u = open(ups[-1]).read(); r["upload"] = os.path.basename(ups[-1]); r["upload_placeholder"] = bool(re.search(r"\{[A-Z_]+\}", u))
        tsl = re.findall(r"^(\d\d):(\d\d) ", u, re.M); r["upload_last_ts"] = (int(tsl[-1][0])*60+int(tsl[-1][1])) if tsl else None
        r["upload_len_line"] = (re.findall(r"길이:.*", u) or [""])[0]
    out[ep] = r
    print(ep, json.dumps(r, ensure_ascii=False))
json.dump(out, open("review2/inspect.json", "w"), ensure_ascii=False, indent=1)
