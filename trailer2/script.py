# 상식실험실 채널 트레일러 v2 (~50 s): 지금까지의 실험 002~011 종합.
# (scene, args, subtitle, spoken-or-None). Clip args: src key + ss (source second). "cuts": extra clip cuts inside a line,
# each (word that starts the new clip, src, ss[, label]).
# Facts: walk (Erickson 2011, 1-yr aerobic walking: hippocampus +2%), phone (Ward 2017: phone in another room -> best scores),
# sugar (Mantantzis 2019 meta-analysis: within 1 h more fatigue, less alert), time (Wittmann & Lehnhoff 2005: felt speed of the
# last year did not differ by age). Stats flashed in line 4: Stoic 91% (LaFreniere & Newman 2020), Descartes 48% (Nightingale &
# Farid 2022), Nietzsche 75% (Asch), Buddha 46.9% (Killingsworth & Gilbert 2010).
S = [
 ("clip", {"src": "walk", "ss": 196.6}, "1년 동안 걷기만 했는데, 뇌가 다시 자랐고,", "일 년 동안 걷기만 했는데, 뇌가 다시 자랐고,"),
 ("clip", {"src": "phone", "ss": 112.6}, "폰을 다른 방에 두자, 집중력 점수가 가장 높았어요.", None),
 ("clip", {"src": "sugar", "ss": 91.0}, "단 걸 먹으면, 한 시간 안에 오히려 더 피곤해졌고,", None),
 ("clip", {"src": "tim", "ss": 7.4, "cuts": [("연구해", "tim", 143.0)]},
  "나이 들면 1년이 빨라진다는 말도, 연구해 보니 꼭 그렇진 않았죠.", "나이 들면 일 년이 빨라진다는 말도, 연구해 보니 꼭 그렇진 않았죠."),
 ("stats", {"src": "sto", "ss": 104.0, "flash": [("sto", 104.0), ("des", 261.0), ("nie", 147.0), ("bud", 195.0)]},
  "전부, 실제 연구에서 나온 결과예요.", None),
 ("card", {"kind": "logo"}, "알던 상식, 직접 실험합니다. 상식실험실.", None),
 ("card", {"kind": "phil"}, "주말엔, 철학자처럼 살아 봐요.", None),
 ("clip", {"src": "nie", "ss": 87.4, "label": "니체",
           "cuts": [("스토아", "sto", 75.4, "스토아"), ("데카르트", "des", 297.6, "데카르트"), ("장자", "zhu", 528.4, "장자"),
                    ("소크라테스", "soc", 155.6, "소크라테스"), ("붓다", "bud", 171.6, "붓다")]},
  "니체처럼 걷고, 스토아처럼 걱정을 덜고, 데카르트처럼 의심하고, 장자처럼 잣대를 내려놓고, 소크라테스처럼 묻고, 붓다처럼 지금 여기에 머물기.", None),
 ("clip", {"src": "tim", "ss": 309.9}, "실험이 끝나면, 오늘을 조금 더 잘 사는 방법 하나가 남습니다.", None),
 ("card", {"kind": "sub"}, "다음 실험이 궁금하다면, 구독해 주세요.", None),
]
