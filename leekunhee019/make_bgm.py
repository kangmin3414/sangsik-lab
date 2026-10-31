"""Ep.019 music with Lyria 3 Pro (free-trial credits): one track per chapter/season, 2 takes each. python3 make_bgm.py [key ...]"""
import sys, os, time
sys.path.insert(0, '../bgm'); sys.path.insert(0, '../gtts')
from l3 import gen
COMMON = (' Background score for a fast-paced, emotional narrated biography documentary; leaves space for a speaking voice; steady even dynamics, one consistent '
          'mood from start to end; strictly instrumental — no voice, no singing, no humming, no whispering, no choir, no spoken words, no vocal samples; '
          'no drums. About 3 minutes long.')
P = {
 'boy': 'Tender, intimate solo felt piano in E-flat major, 76 BPM: a simple, slightly lonely melody that slowly grows warmer and more curious, like a child alone in an old cinema discovering wonder; light, flowing, not slow or sleepy.',
 'rise': 'Driven, hopeful cinematic piece in D minor moving to F major, 104 BPM: steady pulsing piano eighth notes and staccato strings, building determination and forward momentum, like a long uphill climb toward a breakthrough; energetic but not aggressive.',
 'fire': 'Epic, emotional orchestral climax in C minor resolving to E-flat major, 90 BPM: strings and piano swell in powerful waves with deep cello lines, sacrifice and resolve turning into triumph and release; big but warm.',
 'legacy': 'Warm, moving and hopeful piano and string ensemble in E-flat major, 80 BPM: the gentle piano theme returns with rich legato strings, gratitude and quiet pride, like light filling a museum hall; uplifting, flowing.',
}
only = sys.argv[1:]
for k, p in P.items():
    if only and k not in only: continue
    for tk in 'ab':
        if os.path.exists(f'bgm/{k}_{tk}.mp3') or os.path.exists(f'bgm/{k}_{tk}.wav'): continue
        gen(p + COMMON, f'bgm/{k}_{tk}'); time.sleep(5)
