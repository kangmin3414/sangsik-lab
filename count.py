items = {
 "T1 hook1": "하루 한두 잔은 약?",
 "T1 hook2": "보정하니 사라졌다",
 "T1 narr": "하루 한두 잔은 몸에 좋다고들 하죠.",
 "T2 hook1": "달리면 무릎 나간다?",
 "T2 hook2": "안 뛴 쪽이 더 많았다",
 "T2 narr": "달리기는 무릎을 갉아먹는다고들 하죠.",
 "T3 hook1": "근력운동은 다다익선?",
 "T3 hook2": "정점은 주 40분",
 "T3 narr": "근력운동은 많이 할수록 좋다고들 하죠.",
 "T4 hook1": "악력은 그냥 손힘?",
 "T4 hook2": "혈압보다 센 신호",
 "T4 narr": "악력, 그냥 손아귀 힘이라고 생각하시죠?",
 "T5 hook1": "1분 걷기, 소용없다?",
 "T5 hook2": "혈압은 내려갔다",
 "T5 narr": "잠깐 걷는다고 뭐가 달라지겠어요?",
 "T6 hook1": "혈압엔 유산소가 최고?",
 "T6 hook2": "1위는 '버티기'",
 "T6 narr": "혈압 낮추려면 걷기·달리기라고들 하죠.",
}
for k,v in items.items():
    lim = 12 if 'hook' in k else 25
    n_all = len(v); n_nospace = len(v.replace(' ',''))
    print(f"{k}: {v} | with spaces={n_all} no-spaces={n_nospace} limit={lim} {'OK' if n_all<=lim else 'OVER'}")
