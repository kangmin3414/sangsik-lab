from concurrent.futures import ThreadPoolExecutor
from l3 import gen
from batch_prompts import P, COMMON
P2 = {
 '1_piano': "Solo acoustic piano, modern classical, in D-flat major at 66 BPM. Tender, nostalgic and hopeful. Soft sustained chords with a simple, sparse melody, intimate and warm, gentle room reverb.",
 '5_ambient': "Ambient soundscape in E-flat major at 60 BPM: warm slowly evolving synth pads, distant soft piano notes and a quiet string drone. Calm, peaceful and quietly hopeful, spacious, like early morning light.",
}
jobs = [('1_piano', 'a', P['1_piano']), ('1_piano', 'b', P2['1_piano']), ('5_ambient', 'a', P['5_ambient']), ('5_ambient', 'b', P2['5_ambient']), ('3_guitar', 'b', P['3_guitar'])]
def run(j):
    k, t, p = j
    for attempt in range(3):
        r = gen(p + COMMON, f'cand_{k}_{t}')
        if r: return r
    return None
with ThreadPoolExecutor(2) as ex:
    print('DONE', list(ex.map(run, jobs)))
