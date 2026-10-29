# replace the single piano loop of an older episode with a section-aware score
import sys
ep = sys.argv[1]
HEAD = '''# ---- section-aware score: every part of the story gets its own music ----
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "shorts"))
import music as M
'''
TAIL = '''cur_ch = {}; cc = 0
for l in L:
    if l["scene"] == "chapter": cc = l["args"]["n"]
    cur_ch[l["i"]] = cc
secs = M.sections_from(L, mood_of, DUR)
for s0 in secs: print("  music %6.1f-%6.1f %s" % s0)
music = M.score(secs, DUR, MOODS, seed=SEED)
vr = np.sqrt(np.mean(voice[np.abs(voice) > 0.02] ** 2)); mr = np.sqrt(np.mean(music ** 2))
music *= vr * 10 ** (-13 / 20) / (mr + 1e-9)
'''
BODY = {
'phone': '''SEED = 31
MOODS = {
 'night':  dict(root=123.47, mode='aeolian', bpm=70, prog=[0, 5, 3, 4], lead='piano', pattern='sparse', oct=1, leadGain=.5, pad=.24, warm=.5),
 'title':  dict(root=196.0, mode='ionian', bpm=96, prog=[0, 4, 5, 3], lead='marimba', pattern='arp', oct=1, leadGain=.42, pad=.12, perc='shaker'),
 'anx':    dict(root=138.59, mode='aeolian', bpm=112, prog=[0, 0, 5, 6], lead='pizz', pattern='pulse', oct=0, leadGain=.42, drone=.16, perc='tick'),
 'focus':  dict(root=146.83, mode='dorian', bpm=96, prog=[0, 3, 6, 4], lead='marimba', pattern='arp', oct=1, leadGain=.4, perc='shaker'),
 'sleep':  dict(root=174.61, mode='ionian', bpm=60, prog=[0, 3, 4, 0], lead='musicbox', pattern='waltz', meter=3, oct=1, leadGain=.4, pad=.16),
 'happy':  dict(root=220.0, mode='ionian', bpm=100, prog=[0, 4, 5, 3], lead='kalimba', pattern='melody', oct=1, leadGain=.4, perc='shaker', density=.6),
 'free':   dict(root=164.81, mode='ionian', bpm=84, prog=[0, 5, 3, 4], lead='harp', pattern='arp', oct=1, leadGain=.44, pad=.22),
 'recap':  dict(root=130.81, mode='ionian', bpm=108, prog=[0, 4, 5, 3], lead='marimba', pattern='arp', oct=1, leadGain=.42, perc='shaker'),
 'outro':  dict(root=155.56, mode='ionian', bpm=72, prog=[0, 5, 3, 4], lead='piano', pattern='arp', oct=1, leadGain=.42, pad=.26),
}
CH = {1: 'anx', 2: 'focus', 3: 'sleep', 4: 'happy', 5: 'free'}
def mood_of(l):
    sc = l["scene"]
    if sc == "title": return "title"
    if sc == "recap": return "recap"
    if sc == "outro": return "outro"
    if cur_ch[l["i"]] == 0: return "night"
    return CH[cur_ch[l["i"]]]
''',
'sugar': '''SEED = 37
MOODS = {
 'cafe':   dict(root=174.61, mode='mixolydian', bpm=92, prog=[0, 3, 6, 4], lead='piano', pattern='arp', oct=1, leadGain=.42, pad=.12, perc='shaker'),
 'title':  dict(root=196.0, mode='ionian', bpm=88, prog=[0, 3, 4, 0], lead='bell', pattern='melody', oct=1, leadGain=.36, pad=.16, density=.5),
 'crave':  dict(root=110.0, mode='aeolian', bpm=108, prog=[0, 5, 2, 6], lead='pizz', pattern='pulse', oct=0, leadGain=.42, drone=.16, perc='tick'),
 'crash':  dict(root=164.81, mode='dorian', bpm=100, prog=[0, 3, 6, 4], lead='marimba', pattern='arp', oct=1, leadGain=.4, perc='shaker'),
 'blood':  dict(root=146.83, mode='aeolian', bpm=64, prog=[0, 5, 3, 4], lead='piano', pattern='sparse', oct=1, leadGain=.5, drone=.2, pad=.12, warm=.4),
 'liver':  dict(root=130.81, mode='ionian', bpm=90, prog=[0, 4, 5, 3], lead='kalimba', pattern='melody', oct=1, leadGain=.4, pad=.14, density=.55),
 'taste':  dict(root=220.0, mode='ionian', bpm=84, prog=[0, 5, 3, 4], lead='musicbox', pattern='melody', oct=1, leadGain=.36, pad=.12, density=.55),
 'recap':  dict(root=196.0, mode='ionian', bpm=108, prog=[0, 4, 5, 3], lead='marimba', pattern='arp', oct=1, leadGain=.42, perc='drumshaker'),
 'ending': dict(root=116.54, mode='ionian', bpm=72, prog=[0, 5, 3, 4], lead='harp', pattern='arp', oct=1, leadGain=.44, pad=.26),
 'thanks': dict(root=116.54, mode='ionian', bpm=72, prog=[3, 4, 0, 0], lead='bell', pattern='melody', oct=2, leadGain=.32, pad=.26, density=.5),
}
CH = {1: 'crave', 2: 'crash', 3: 'blood', 4: 'liver', 5: 'taste'}
def mood_of(l):
    sc = l["scene"]
    if sc == "title": return "title"
    if sc == "recap": return "recap"
    if sc in ("comfort", "moments", "tea"): return "ending"
    if sc == "thanks": return "thanks"
    if cur_ch[l["i"]] == 0: return "cafe"
    return CH[cur_ch[l["i"]]]
''',
}[ep]
p = f'{ep}/mix.py'; s = open(p).read(); lines = s.split('\n')
a = [i for i, l in enumerate(lines) if l.startswith('# ---- calm background music')][0]
b = [i for i, l in enumerate(lines) if l.startswith('# ---- sound effects tied')][0]
lines = lines[:a] + (HEAD + BODY + TAIL).rstrip('\n').split('\n') + lines[b:]
open(p, 'w').write('\n'.join(lines)); print('patched', ep)
