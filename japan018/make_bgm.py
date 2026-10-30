"""Ep.018 music with Lyria 3 Pro (free-trial credits): one track per chapter/season, 2 takes each. python3 make_bgm.py [key ...]"""
import sys, os, time
sys.path.insert(0, '../bgm'); sys.path.insert(0, '../gtts')
from l3 import gen
COMMON = (' Background score for a warm, gentle narrated picture-book documentary; leaves space for a speaking voice; steady even dynamics, one consistent '
          'mood from start to end; strictly instrumental — no voice, no singing, no humming, no whispering, no choir, no spoken words, no vocal samples; '
          'no drums. About 3 minutes long.')
P = {
 'spring': 'Light, bright and playful chamber piece in G major, 96 BPM: clear felt piano melody, pizzicato strings and a soft glockenspiel; curious, hopeful and a little clumsy, like a newcomer arriving in a new city in cherry-blossom season.',
 'summer': 'Easy-going warm summer-afternoon piece in D major, 88 BPM: fingerpicked acoustic guitar with soft marimba and a gentle woodblock pulse; relaxed, slightly playful and witty, like a puzzle that slowly makes sense.',
 'autumn': 'Tender, reflective autumn piece in A minor moving to C major, 72 BPM: warm solo cello over soft piano chords; bittersweet and a little lonely at first, gradually becoming warmer and hopeful toward the end.',
 'winter': 'Gentle winter-to-spring piece in F major, 66 BPM: sparse soft piano with a warm clarinet, slowly joined by a small string ensemble that swells into a moving, luminous, heartfelt warmth; wonder, homecoming and quiet realisation.',
}
only = sys.argv[1:]
for k, p in P.items():
    if only and k not in only: continue
    for tk in 'ab':
        if os.path.exists(f'bgm/{k}_{tk}.mp3') or os.path.exists(f'bgm/{k}_{tk}.wav'): continue
        gen(p + COMMON, f'bgm/{k}_{tk}'); time.sleep(5)
