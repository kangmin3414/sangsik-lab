"""성경과 불경 편 배경음(Lyria 3 Pro). 결과는 /dev/shm/tb/bgm/. python3 gen_bgm.py [이름…]
진지한 인문 에세이: 새벽 방(오프닝) → 1장 이후 잔잔한 피아노·현. 종교 음악(오르간·성가·염불·목탁·범종) 느낌은 피한다."""
import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts')
OUT = '/dev/shm/tb/bgm'; os.makedirs(OUT, exist_ok=True)
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no chanting, no spoken words, no whistling, no church organ, no temple bells, no religious music. Background music under calm narration, steady, sparse and loopable.'
P = {
 'dawn': 'Minimal ambient intro for a quiet early-morning scene: warm analog pad drone in D, occasional single soft piano tones far apart, gentle tape hiss texture, slow and spacious, reflective, a little lonely, no rhythm, about 50 seconds.',
 'essay': 'Gentle, thoughtful underscore for a calm documentary essay about meaning in life: soft felt piano playing a simple slow motif, warm cello and viola sustaining long notes, very light textures, hopeful but restrained, no drums, no big swells, 66 BPM, about 120 seconds.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'{OUT}/{k}')
