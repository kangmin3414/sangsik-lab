import json, sys
from concurrent.futures import ThreadPoolExecutor
from l3 import gen
COMMON = (" Background score for a heartwarming narrated YouTube documentary: gentle and understated, steady even dynamics,"
          " one consistent mood from start to end, warm low-mid register that leaves space for a speaking voice, slow gentle pulse."
          " Instrumental only, no vocals, no drums. 3 minutes long.")
P = {
 '1_piano':   "Modern classical felt piano solo in D-flat major, 66 BPM. Tender, nostalgic and hopeful, like remembering a kind moment with family. Soft sustained chords and a simple sparse melody, intimate close-miked felt piano with gentle room reverb.",
 '2_strings': "Restrained cinematic piano and string ensemble in C major, 70 BPM. Heartwarming and moving, soft legato violins and a warm cello holding long chords under a simple piano melody, slow gentle swells, like a touching family documentary.",
 '3_guitar':  "Fingerpicked nylon-string acoustic guitar with a warm solo cello in G major, 76 BPM. Cozy, sincere and comforting, like a quiet Sunday afternoon at home, soft and intimate chamber-folk.",
 '4_celesta': "Gentle celesta and music box over warm soft pads and quiet piano in F major, 72 BPM. Wonder, curiosity and warmth, like a bedtime story read by a grandparent, delicate, dreamy and light.",
 '5_ambient': "Ambient warm pads that slowly evolve, with distant soft piano notes and a faint string drone in E-flat major, 60 BPM. Calm, peaceful and quietly hopeful, spacious and immersive, like early morning light.",
}
jobs = [(k, t) for k in P for t in ('a', 'b')]
def run(kt):
    k, t = kt
    return gen(P[k] + COMMON, f'cand_{k}_{t}')
with ThreadPoolExecutor(5) as ex:
    res = list(ex.map(run, jobs))
json.dump({'prompts': P, 'common': COMMON, 'files': res}, open('cands.json', 'w'), ensure_ascii=False, indent=1)
print('DONE', res)
