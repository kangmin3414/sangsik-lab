import json, re, importlib.util
for ep in ["nietzsche", "descartes", "zhuangzi"]:
    b = "../%s/" % ep
    spec = importlib.util.spec_from_file_location("s", b + "script.py"); mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    tl = json.load(open(b + "timeline.json"))
    L = tl["lines"]
    syl = sum(len(re.findall(r"[가-힣]", (s[3] or s[2]))) for s in mod.S)
    speech = sum(l["t1"] - l["t0"] for l in L)
    nums = sum(len(re.findall(r"\d[\d,\.]*", s[2])) for s in mod.S)
    studies = sum(1 for s in mod.S if "study" in s[1])
    stats = sum(1 for s in mod.S if s[0] == "stat")
    zero = sum(1 for s in mod.S if "제로" in s[2])
    longest = sorted(((l["t1"] - l["t0"], l["sub"][:30]) for l in L), reverse=True)[:3]
    print(ep, "dur %.0fs lines %d syl/s %.2f numbers %d studies %d stats %d zero-lines %d" % (tl["duration"], len(L), syl / speech, nums, studies, stats, zero))
    for d, s in longest: print("   long %.1fs %s" % (d, s))
