"""휴머노이드·여가·놀이 편 배경음(Lyria 3 Pro). 결과는 /dev/shm/ls/bgm/. python3 gen_bgm.py [이름…]
운영자 톤: 담백하고 묵직하게. 앞쪽은 차갑게, 뒤로 갈수록 따뜻하게."""
import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts')
OUT = '/dev/shm/ls/bgm'; os.makedirs(OUT, exist_ok=True)
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no spoken words, no whistling. Background music under calm narration, steady, sparse and loopable.'
P = {
 'dawn': 'Minimal cold ambient drone in E minor: a single sustained analog pad that slowly swells and fades, a quiet soft ticking pulse, occasional glassy bell-like tones far apart, wintry blue atmosphere, motionless and lonely, no melody hooks, no drums, about 50 seconds.',
 'table': 'Sparse single-line felt piano for a quiet kitchen-table conversation between two tired friends at night: slow simple melody, lots of space between notes, soft low cello drone underneath, restrained, intimate, melancholic but gentle, no drums, 62 BPM, about 120 seconds.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'{OUT}/{k}')
