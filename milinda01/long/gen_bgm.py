"""불교 편(수레 문답) 배경음(Lyria 3 Pro). 결과는 /dev/shm/ml/bgm/. python3 gen_bgm.py [이름…]
톤: 귀엽고 장난스러운 게임 느낌. 밤(조용함) → 회의실(멋쩍음) → 사갈라(금빛 오후, 수수께끼)."""
import sys, os
sys.path.insert(0, '/home/claude/sangsik-lab/bgm'); sys.path.insert(0, '/home/claude/sangsik-lab/gtts')
OUT = '/dev/shm/ml/bgm'; os.makedirs(OUT, exist_ok=True)
import l3
NO = ' Instrumental only: no vocals, no choir, no humming, no chanting, no spoken words, no whistling. Background music under narration, steady and loopable.'
P = {
 'night': 'Cozy late-night bedroom lo-fi for a cute game: soft electric piano chords, warm mellow bass, very quiet brushed beat, a tiny curious marimba motif now and then, sleepy but playful, 74 BPM, about 50 seconds.',
 'office': 'Light awkward office comedy underscore for a cute game: tiptoeing pizzicato strings, soft clarinet answering, small woodblock ticks, a little embarrassed and funny, gentle, 98 BPM, about 60 seconds.',
 'lamp': 'Original calm night-time puzzle theme for a cute adventure game, lit by one small lamp: slow gentle harp-like plucks, a low warm drone, a soft wooden flute answering now and then, tiny bell sparkles, intimate and thoughtful, cozy, not sad, 72 BPM, about 45 seconds.',
 'study': 'Light curious science-explainer underscore for a cute game: bouncy soft synth plucks, mellow marimba pattern, small shaker groove, bright and tidy, a little playful, 104 BPM, about 45 seconds.',
 'hope': 'Gentle hopeful everyday theme for the ending of a cute story game: warm felt piano melody, soft acoustic guitar picking, light glockenspiel touches, a simple brushed beat that enters after a quiet start, tender and encouraging, slowly brightening, 86 BPM, about 120 seconds.',
 'sagala': 'Golden-hour courtyard puzzle theme for a cute adventure game: soft sustained string drone, gentle bamboo flute melody, light hand drum groove, plucked hammered-dulcimer sparkles, curious and playful with a hint of wonder, warm, not solemn, 88 BPM, about 130 seconds.',
}
for k in sys.argv[1:] or P: l3.gen(P[k] + NO, f'{OUT}/{k}')
