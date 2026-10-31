# 실험 016 · 남들 앞에서 기죽는다면 — 맹자의 호연지기 (대본 1차, 2026-10-29)
# (scene, args, subtitle, spoken-or-None). args["segs"] = [(voice, text[, spoken])...] when a line mixes voices.
# args["silent"] = seconds of silence (no TTS); the text is shown on screen (message / card), not as a subtitle.
# args["study"] = source chip on screen; args["n"/"when"/"name"] = day card (실험 n/5); args["ask"] = comment question card.
# Voices: N narrator, Z Zero, D doctor (박사, 013·014와 같은 할아버지 과학자), B 상무님 (새 인물, 무뚝뚝한 50대).
# One image all the way: a red hero cape. Zero puts it on to look bold; by Friday he folds it away —
#   호연지기 is not something you wear, it fills you as straight deeds pile up (集義).
# Story: Monday, Zero freezes at the meeting-room door (상무님 report on Friday) → five days, one Mencius practice a day →
#   Friday report: the 상무 questions a number Zero had almost inflated on Wednesday; Zero answers plainly → cape folded.
# Prop: red hero cape (붉은 망토) + arms crossed. Ep. length target 8:20–8:40 (≈2,200 chars without spaces at 014's pace).
# Facts (checked 2026-10-29):
#   맹자 公孫丑下 2: Mencius declined the 齊 king's summons; to 景丑 he quoted 曾子: 晉楚之富不可及也 彼以其富 我以吾仁
#     彼以其爵 我以吾義 吾何慊乎哉. (The line is 曾子's, quoted by Mencius — say "증자의 말을 빌려".)
#   公孫丑上 2: 我四十不動心 / 我善養吾浩然之氣 / 其爲氣也 至大至剛 以直養而無害 則塞于天地之間 / 夫志 氣之帥也 氣 體之充也 /
#     曾子 relaying 孔子 on 大勇: 自反而不縮 雖褐寬博 吾不惴焉 自反而縮 雖千萬人 吾往矣 /
#     宋人揠苗: 今日病矣 予助苗長矣 其子趨而往視之 苗則槁矣 / 必有事焉而勿正 心勿忘 勿助長也 / 是集義所生者.
#   盡心下 34: 說大人則藐之 勿視其巍巍然 … 堂高數仞 … 侍妾數百人 我得志弗爲也 在彼者皆我所不爲也 在我者皆古之制也 吾何畏彼哉.
#   離婁上 21: 有不虞之譽 有求全之毁.
#   Power pose: Carney, Cuddy & Yap 2010 Psych Sci, N=42, claimed testosterone up / cortisol down after 2 one-minute poses.
#     Ranehill et al. 2015 Psych Sci, N=200: felt more powerful, no hormonal or behavioural effects. Carney 2016 statement:
#     does not believe the effects are real. Körner et al. 2022 meta-analysis, 88 studies, N=9,779: self-reported feeling of
#     power yes, no reliable physiological effects. (Do NOT claim hormone changes.)
#   Boothby, Cooney, Sandstrom & Clark 2018 Psych Sci (liking gap): after first conversations people underestimated how much
#     their partner liked them.
#   Creswell et al. 2005 Psych Sci, N=85: writing about one's most important values before a lab stress task (speech +
#     mental arithmetic) → significantly lower cortisol responses than controls.
#   Lally, van Jaarsveld, Potts & Wardle 2010 Eur J Soc Psychol: 96 volunteers, 12 weeks; median 66 days to automaticity
#     (range 18–254); missing one opportunity did not materially affect the process.
# Overlap check (001–015 scripts): no Mencius, power pose, liking gap, values affirmation or Lally before. Avoided:
#   天將降大任 (same idea as Nietzsche ep. "시련이 사람을 강하게?"), Stoic "내 것/아닌 것" wording, Zhuangzi "남의 잣대".
# Zero's week, the 상무님 and the report are fiction.
S = [
 # ---------- 회의실 문 앞 ----------
 ("mdoor", {}, "월요일 아침, 회의실 앞. 제로는 문고리를 잡은 채, 30초째 서 있습니다.", "월요일 아침, 회의실 앞. 제로는 문고리를 잡은 채, 삼십 초째 서 있습니다."),
 ("mdoor", {"k": 1, "segs": [("Z", "저 안에… 상무님이 계신단 말이지.")]}, "저 안에… 상무님이 계신단 말이지.", None),
 ("mdoor", {"k": 2}, "나보다 훨씬 커 보이는 사람 앞에 서면, 왜 우리는 이렇게 작아질까요?", None),
 ("mshrink", {}, "어깨는 말리고, 목소리는 기어들어 가고, 시선은 자꾸 바닥으로.", None),
 ("mmeng", {}, "2,300년 전, 왕 앞에서도 고개를 숙이지 않은 사상가가 있었습니다. 맹자.", "이천삼백 년 전, 왕 앞에서도 고개를 숙이지 않은 사상가가 있었습니다. 맹자."),
 ("mmeng", {"k": 1}, "그는 그 힘을, 하늘과 땅 사이를 가득 채우는 기운, 호연지기라고 불렀습니다.", None),
 ("mtitle", {}, "오늘의 실험. 금요일 임원 보고까지 닷새. 제로는 맹자처럼, 기죽지 않을 수 있을까?", None),
 ("mtitle", {"k": 1, "segs": [("Z", "좋아. 망토도 둘렀고!")]}, "좋아. 망토도 둘렀고!", None),
 # ---------- 맹자는 정말 그렇게 살았을까 ----------
 ("mking", {}, "어느 날, 제나라 왕이 맹자를 불렀습니다. 그런데 맹자는, 가지 않았죠.", None),
 ("mking", {"k": 1}, "왕의 신하가 무례하다고 따지자, 맹자는 증자의 말을 빌려 답했습니다.", None),
 ("mking", {"k": 2, "pause": 0.3}, "저들이 부유함을 내세우면 나는 어짊으로, 저들이 벼슬을 내세우면 나는 의로움으로. 내가 무엇이 모자라겠는가.", None),
 ("mking", {"k": 3, "segs": [("D", "제로야, 호연지기는 큰소리치는 배짱이 아니란다. 떳떳함에서 나오는 기운이지.")]}, "제로야, 호연지기는 큰소리치는 배짱이 아니란다. 떳떳함에서 나오는 기운이지.", None),
 ("mking", {"k": 4, "segs": [("Z", "떳떳함… 일단 해 볼게요!")]}, "떳떳함… 일단 해 볼게요!", None),
 # ---------- [1일 차] 자세부터 펴 보기 ----------
 ("mday", {"n": 1, "when": "월요일", "name": "자세부터 펴 보기"}, "첫째 날. 자세부터 펴 보기.", None),
 ("mpose", {}, "맹자는 뜻이 기운을 이끌고, 기운이 몸을 채운다고 했습니다. 마음과 몸이 이어져 있다는 거죠.", None),
 ("mpose", {"k": 1}, "제로는 회의 전, 화장실 거울 앞에서 허리에 손을 얹고 2분을 버텼습니다. 한때 전 세계에 유행한, 파워 포즈예요.", "제로는 회의 전, 화장실 거울 앞에서 허리에 손을 얹고 이 분을 버텼습니다. 한때 전 세계에 유행한, 파워 포즈예요."),
 ("mposes", {"study": "Carney 외 (2010)"}, "2010년의 한 연구는, 이 자세만으로 자신감 호르몬이 오르고 스트레스 호르몬이 내려간다고 발표했습니다. 참가자는 42명이었죠.", "이천십 년의 한 연구는, 이 자세만으로 자신감 호르몬이 오르고 스트레스 호르몬이 내려간다고 발표했습니다. 참가자는 마흔두 명이었죠."),
 ("mposes", {"k": 1, "study": "Ranehill 외 (2015)"}, "그런데 5년 뒤, 200명으로 다시 해 보자 호르몬 변화는 나타나지 않았습니다. 원래 연구자 한 명도, 이 효과를 더는 믿지 않는다고 밝혔고요.", "그런데 오 년 뒤, 이백 명으로 다시 해 보자 호르몬 변화는 나타나지 않았습니다. 원래 연구자 한 명도, 이 효과를 더는 믿지 않는다고 밝혔고요."),
 ("mposes", {"k": 2, "study": "Körner 외 (2022)"}, "88개 연구를 모아 보니 남은 건 하나. 스스로 느끼는 힘이 조금 커진다는 것뿐이었어요.", "팔십팔 개 연구를 모아 보니 남은 건 하나. 스스로 느끼는 힘이 조금 커진다는 것뿐이었어요."),
 ("mpose", {"k": 2, "segs": [("Z", "호르몬은 그대로라도… 어깨를 펴니까 숨은 좀 쉬어지네요.")]}, "호르몬은 그대로라도… 어깨를 펴니까 숨은 좀 쉬어지네요.", None),
 ("mpose", {"k": 3}, "자세가 사람을 바꿔 주진 않아도, 문을 여는 첫 손은 떼게 해 줍니다. 제로는 그날, 회의실 문을 3초 만에 열었습니다.", "자세가 사람을 바꿔 주진 않아도, 문을 여는 첫 손은 떼게 해 줍니다. 제로는 그날, 회의실 문을 삼 초 만에 열었습니다."),
 # ---------- [2일 차] 껍데기 걷어 내기 ----------
 ("mday", {"n": 2, "when": "화요일", "name": "껍데기 걷어 내기"}, "둘째 날. 상대의 껍데기 걷어 내기.", None),
 ("mshell", {}, "맹자는 높은 사람을 설득하러 갈 때는, 그를 가볍게 보고 그 위세를 올려다보지 말라고 했습니다.", None),
 ("mshell", {"k": 1}, "몇 길 높이의 집, 수백 명의 시녀. 그건 내가 뜻을 이뤄도 하지 않을 것들이니, 내가 어찌 그를 두려워하랴.", None),
 ("mshell", {"k": 2}, "제로는 상무님의 직함을 잠시 지우고 떠올려 봤습니다. 아침 알람에 괴로워하고, 퇴근길 지하철에서 꾸벅 조는 한 사람을.", None),
 ("mgap", {"study": "Boothby 외 (2018)"}, "우리가 주눅 드는 데는 착각도 한몫합니다. 미국 연구팀은 처음 만난 사람들끼리 대화를 나누게 한 뒤, 상대가 나를 얼마나 좋아했을지 짐작하게 했습니다.", None),
 ("mgap", {"k": 1}, "사람들은 대부분, 그 마음을 실제보다 낮게 짐작했어요. 내가 얼마나 별로였을까 곱씹는 동안, 상대는 이미 나를 꽤 좋게 보고 있었던 거죠.", None),
 ("mgap", {"k": 2, "segs": [("Z", "상무님도… 생각보다 저를 나쁘게 보시진 않을지도.")]}, "상무님도… 생각보다 저를 나쁘게 보시진 않을지도.", None),
 # ---------- [3일 차] 스스로 돌아보아 곧게 ----------
 ("mday", {"n": 3, "when": "수요일", "name": "스스로 돌아보아 곧게"}, "그런데 셋째 날, 제로는 더 깊은 벽을 만납니다.", None),
 ("mnum", {}, "금요일 보고서의 숫자 하나. 좋아 보이려고, 슬쩍 부풀려 두었거든요.", None),
 ("mnum", {"k": 1, "segs": [("Z", "이거 물어보시면… 어떡하지.")]}, "이거 물어보시면… 어떡하지.", None),
 ("mnum", {"k": 2}, "망토를 둘러도, 어깨를 펴도, 가슴 한구석이 계속 두근거립니다.", None),
 ("mstraight", {}, "맹자가 전한 공자의 말이 있습니다. 스스로 돌아보아 곧지 못하면, 허름한 옷을 입은 사람 앞에서도 두렵다.", None),
 ("mstraight", {"k": 1, "pause": 0.3}, "스스로 돌아보아 곧다면, 천만 명이 막아서도 나는 간다.", "스스로 돌아보아 곧다면, 천만 명이 막아서도 나는 간다."),
 ("mstraight", {"k": 2}, "호연지기는 어깨가 아니라, 떳떳함에서 나온다는 거죠.", None),
 ("mfix", {}, "제로는 숫자를 원래대로 고쳤습니다. 덜 멋져 보여도, 누가 물어보면 그대로 답할 수 있는 숫자로.", None),
 ("mvalue", {"study": "Creswell 외 (2005)"}, "미국 UCLA 연구팀은 사람들에게 발표와 암산이 기다리는 스트레스 과제를 주기 전에, 자기가 가장 소중히 여기는 가치에 대해 잠깐 글을 쓰게 했습니다.", "미국 유씨엘에이 연구팀은 사람들에게 발표와 암산이 기다리는 스트레스 과제를 주기 전에, 자기가 가장 소중히 여기는 가치에 대해 잠깐 글을 쓰게 했습니다."),
 ("mvalue", {"k": 1}, "그러자 그러지 않은 사람들보다, 스트레스 호르몬이 덜 올라갔습니다. 85명 규모의 실험이지만, 내가 무엇을 지키는 사람인지 떠올리는 것만으로 압박 앞에서 덜 흔들린 거예요.", "그러자 그러지 않은 사람들보다, 스트레스 호르몬이 덜 올라갔습니다. 팔십오 명 규모의 실험이지만, 내가 무엇을 지키는 사람인지 떠올리는 것만으로 압박 앞에서 덜 흔들린 거예요."),
 ("mvalue", {"k": 2}, "제로는 모니터 옆에 포스트잇 한 장을 붙였습니다. 정직.", None),
 # (미드롤 광고 후보: 여기, 약 4:40)
 # ---------- [4일 차] 조급함 내려놓기 ----------
 ("mday", {"n": 4, "when": "목요일", "name": "억지로 당기지 않기"}, "넷째 날. 억지로 당기지 않기.", None),
 ("mrush", {"segs": [("Z", "내일이 보고인데… 오늘 밤에 말 잘하는 법, 다 외워 버릴까?")]}, "내일이 보고인데… 오늘 밤에 말 잘하는 법, 다 외워 버릴까?", None),
 ("mfarm", {}, "맹자가 들려준 송나라 농부 이야기가 있습니다. 벼가 빨리 자라지 않아 안달이 난 농부가, 하루 종일 싹을 하나하나 잡아당겼죠.", None),
 ("mfarm", {"k": 1}, "집에 와서 말했습니다. 오늘은 싹이 자라는 걸 돕느라 너무 피곤하구나.", None),
 ("mfarm", {"k": 2, "pause": 0.3}, "아들이 논으로 달려가 보니, 싹은 모두 말라 있었습니다. 억지로 돕는다는 말, 조장이 여기서 나왔어요.", None),
 ("mfarm", {"k": 3}, "맹자는 말했습니다. 늘 힘쓰되 결과를 미리 재지 말고, 잊지도 말고, 억지로 키우지도 말라. 호연지기는 옳은 일이 하루하루 쌓여서 생긴다고.", None),
 ("mhabit", {"study": "Lally 외 (2010)"}, "영국 연구팀이 96명에게 새 습관 하나를 매일 하게 하고 12주 동안 지켜봤습니다.", "영국 연구팀이 구십육 명에게 새 습관 하나를 매일 하게 하고 십이 주 동안 지켜봤습니다."),
 ("mhabit", {"k": 1}, "습관이 자리 잡기까지 걸린 날은, 중간값이 66일. 빠른 사람은 18일, 느린 사람은 254일이었어요.", "습관이 자리 잡기까지 걸린 날은, 중간값이 육십육 일. 빠른 사람은 십팔 일, 느린 사람은 이백오십사 일이었어요."),
 ("mhabit", {"k": 2}, "그리고 하루쯤 빼먹어도, 큰 차이는 없었습니다.", None),
 ("mseed", {}, "그래서 제로는 밤샘 대신, 보고 첫 문장만 세 번 소리 내어 읽고 잠들었습니다. 이 연습은 보고가 끝나도, 매일 하기로 했죠.", None),
 # ---------- [5일 차] 칭찬과 비난 앞에서 ----------
 ("mday", {"n": 5, "when": "금요일", "name": "칭찬과 비난 앞에서"}, "다섯째 날. 금요일, 보고 날.", None),
 ("mreport", {}, "보고 중간, 상무님이 숫자 하나를 짚었습니다. 수요일에 제로가 고친, 바로 그 숫자였어요.", None),
 ("mreport", {"k": 1, "segs": [("B", "이거, 목표보다 낮네요. 왜 그렇죠?")]}, "이거, 목표보다 낮네요. 왜 그렇죠?", None),
 ("mreport", {"k": 2, "segs": [("Z", "네, 실제 숫자 그대로입니다. 대신 다음 달에 메울 방법을 말씀드려도 될까요?")]}, "네, 실제 숫자 그대로입니다. 대신 다음 달에 메울 방법을 말씀드려도 될까요?", None),
 ("mreport", {"k": 3}, "보고가 끝나자, 칭찬과 지적이 한꺼번에 쏟아졌습니다.", None),
 ("mcalm", {}, "맹자는 마흔에 마음이 흔들리지 않게 되었다고 했습니다. 부동심이죠.", None),
 ("mcalm", {"k": 1}, "그리고 이렇게도 말했습니다. 뜻밖의 칭찬도 있고, 잘하려 애쓰다가 듣는 비난도 있다.", None),
 ("mcalm", {"k": 2}, "칭찬도 비난도, 내가 다 고를 수는 없다는 거예요. 고를 수 있는 건, 그다음에 무엇을 할지뿐.", None),
 ("mcalm", {"k": 3, "segs": [("Z", "지적받았는데… 이상하게 하나도 안 무섭네요.")]}, "지적받았는데… 이상하게 하나도 안 무섭네요.", None),
 # ---------- 망토를 접다 ----------
 ("mcape", {}, "퇴근길. 제로는 망토를 벗어, 가방에 접어 넣습니다.", None),
 ("mcape", {"k": 1, "segs": [("D", "망토는 벗어도 된단다, 제로야. 호연지기는 입는 게 아니라, 쌓이는 거니까.")]}, "망토는 벗어도 된단다, 제로야. 호연지기는 입는 게 아니라, 쌓이는 거니까.", None),
 ("mcape", {"k": 2}, "맹자의 호연지기는, 하루 만에 두르는 망토가 아니었습니다. 곧은 일 하나하나가 쌓여서, 사람을 안에서부터 채우는 기운이었죠.", None),
 # ---------- 마무리 ----------
 ("mrecap", {}, "어깨를 펴서 첫걸음을 떼고, 상대의 껍데기를 걷어 내고, 떳떳하게 고치고, 조급해하지 않고, 칭찬과 비난 앞에서 다음 할 일을 고르기.", None),
 ("mrecap", {"k": 1, "ask": 1}, "여러분이 요즘 기가 죽는 자리는 어디인가요? 그 자리에서 지키고 싶은 가치 하나를, 댓글로 남겨 주세요.", None),
 ("thanks", {}, "오늘도 끝까지 함께해 주셔서 고맙습니다. 상식실험실이었습니다.", None),
]
