# 실험 014 · 혼자가 편한데 외로운 이유 — 쇼펜하우어의 고슴도치 거리 (대본 1차, 2026-10-26)
# (scene, args, subtitle, spoken-or-None). args["segs"] = [(voice, text[, spoken])...] when a line mixes voices.
# args["silent"] = seconds of silence (no TTS); the text is shown on screen (message / card), not as a subtitle.
# Voices: N narrator, Z Zero, D doctor (박사, 013과 같은 할아버지 과학자), S 서준 (대학 동기, 새 인물).
# One image all the way: people = porcupines on a winter night; too close = thorns, too far = cold;
#   the right distance = warmth you can bear. Inner warmth = time alone you chose; sharing it = one step first.
# Story: Friday night alone ("혼자가 편해… 근데 왜 허전하지?") → three methods over a week → Zero texts 서준 (3 years silent),
#   no reply that night; Schopenhauer's 1831 letter to his mother; next morning 서준 replies; Sunday walk by the river.
# Facts (checked 2026-10-26, see 기획서 출처):
#   2025 사회조사(국가데이터처): 13세 이상 38.2% 외롭다(자주+가끔), 나이가 많을수록 높음.
#   Hawkley & Cacioppo 2010 Ann Behav Med: "Loneliness is not simply being alone" (perceived social isolation).
#   Holt-Lunstad, Smith & Layton 2010 PLoS Med: 148 studies, 308,849 people, avg 7.5 y; stronger relationships → 50% higher
#     likelihood of survival; "comparable with quitting smoking".
#   Schopenhauer: lectures at the same hour as Hegel in Berlin, 5 students; after 1814 never met his mother again;
#     July 1833–1860 Frankfurt, alone with poodles (Atman, Butz); 1831 Arthur took the first step to resume letters
#     (books not selling, bodily ailments). Pendulum between pain and boredom (WWV I §57).
#   Aphorismen V Nr. 9: "Ganz er selbst sein darf jeder nur so lange er allein ist: wer also nicht die Einsamkeit liebt,
#     der liebt auch nicht die Freiheit"; "Man kann auch die Gesellschaft einem Feuer vergleichen, an welchem der Kluge
#     sich in gehöriger Entfernung wärmt".
#   Parerga II, last chapter: porcupines on a cold winter day; the middle distance = "Höflichkeit und feine Sitte";
#     "Wer jedoch viel eigene, innere Wärme hat, bleibt lieber aus der Gesellschaft weg".
#   Nguyen, Ryan & Deci 2018 PSPB: 15 min alone without devices lowers high-arousal affect (calmer); chosen solitude calmer,
#     low autonomy → more low-arousal negative affect (lonely, sad).
#   Epley & Schroeder 2014 JEP:G: Chicago commuters who talked to a stranger had a more positive commute; predicted the
#     opposite; nobody in the train study was rebuffed; we underestimate others' interest in connecting.
#   Liu, Rim, Min & Min 2022 JPSP: 5,900+ participants; senders underestimate how much a short reach-out is appreciated,
#     more so when it is surprising.
# Zero's week, the guard, 서준 and the river walk are fiction.
S = [
 # ---------- 거울: 금요일 밤 ----------
 ("lroom", {}, "금요일 밤. 제로는 오늘도 혼자입니다.", None),
 ("lroom", {"k": 1, "segs": [("Z", "아, 편하다. 역시 주말엔 혼자가 최고야.")]}, "아, 편하다. 역시 주말엔 혼자가 최고야.", None),
 ("lroom", {"k": 2}, "배달 음식, 좋아하는 드라마, 아무도 부르지 않는 저녁.", None),
 ("lroom", {"k": 3}, "그런데 밤 열한 시. 조용한 단톡방을 한참 내리던 손가락이, 멈춥니다.", None),
 ("lroom", {"k": 4, "pause": 0.3, "segs": [("Z", "…근데 왜 이렇게 허전하지?")]}, "…근데 왜 이렇게 허전하지?", None),
 ("lhook", {}, "혼자가 편한데, 왜 외로울까요? 여러분도 이런 밤, 있지 않나요?", None),
 ("lstat", {"study": "2025년 사회조사"}, "2025년 사회조사에서, 열세 살 이상 열 명 중 네 명이 외롭다고 답했습니다.",
  "이천이십오 년 사회조사에서, 열세 살 이상 열 명 중 네 명이 외롭다고 답했습니다."),
 ("lstat", {"k": 1}, "나이가 들수록, 이 비율은 더 높아졌고요.", None),
 # ---------- 왜 그럴까 ----------
 ("lwhy", {"segs": [("D", "제로야, 혼자 있는 거랑 외로운 건, 같은 게 아니란다.")]}, "제로야, 혼자 있는 거랑 외로운 건, 같은 게 아니란다.", None),
 ("lwhy", {"k": 1, "study": "Hawkley & Cacioppo (2010)"}, "외로움을 오래 연구한 심리학자들은 말합니다. 외로움은 그냥 혼자 있는 게 아니라, 연결이 끊겼다고 느끼는 마음이라고.", None),
 ("lwhy", {"k": 2}, "그래서 사람들 속에서도 외로울 수 있고, 혼자서도 외롭지 않을 수 있죠.", None),
 ("lhealth", {"study": "Holt-Lunstad 외 (2010)"}, "연구 148개, 30만 명이 넘는 사람을 평균 7년 반 동안 지켜본 분석에서는, 관계가 튼튼한 사람의 생존 가능성이 50% 더 높았습니다.",
  "연구 백사십팔 개, 삼십만 명이 넘는 사람을 평균 칠 년 반 동안 지켜본 분석에서는, 관계가 튼튼한 사람의 생존 가능성이 오십 퍼센트 더 높았습니다."),
 ("lhealth", {"k": 1}, "연구진은 이 차이가, 담배를 끊는 것과 비슷한 크기라고 했죠.", None),
 ("lhealth", {"k": 2, "segs": [("Z", "그럼… 사람을 많이 만나라는 거예요? 그건 너무 피곤한데.")]}, "그럼… 사람을 많이 만나라는 거예요? 그건 너무 피곤한데.", None),
 ("lhealth", {"k": 3, "segs": [("D", "허허. 그 마음을, 누구보다 잘 아는 철학자가 있지.")]}, "허허. 그 마음을, 누구보다 잘 아는 철학자가 있지.", None),
 # ---------- 쇼펜하우어 ----------
 ("lsch", {}, "19세기 독일의 철학자, 아르투어 쇼펜하우어.", "십구 세기 독일의 철학자, 아르투어 쇼펜하우어."),
 ("lsch", {"k": 1}, "젊은 시절 그는 베를린대학에서, 당대 최고의 스타 철학자 헤겔과 일부러 같은 시간에 강의를 열었습니다.", None),
 ("lsch", {"k": 2, "pause": 0.3}, "결과는… 학생 다섯 명.", None),
 ("lsch", {"k": 3}, "어머니와는 크게 다툰 뒤, 다시는 얼굴을 보지 못했고,", None),
 ("lsch", {"k": 4}, "마흔다섯 살부터는 프랑크푸르트에서 푸들과 함께, 혼자 살았습니다.", None),
 ("lquote", {}, "그가 남긴 말입니다. 누구나 혼자 있을 때만, 온전히 자기 자신일 수 있다.", None),
 ("lquote", {"k": 1}, "고독을 사랑하지 않는 사람은, 자유도 사랑하지 않는다.", None),
 ("lquote", {"k": 2, "segs": [("Z", "와… 완전 제 편이네요.")]}, "와… 완전 제 편이네요.", None),
 # ---------- 고슴도치 우화 ----------
 ("lporc", {}, "그런 그가 남긴, 짧은 우화가 있습니다.", None),
 ("lporc", {"k": 1}, "어느 추운 겨울날, 고슴도치들이 얼지 않으려고 서로 바짝 붙었습니다.", None),
 ("lporc", {"k": 2}, "그러자 서로의 가시에 찔려, 다시 떨어졌죠.", None),
 ("lporc", {"k": 3}, "추우면 붙고, 찔리면 떨어지고. 그렇게 오가다, 마침내 견딜 만한 거리를 찾았습니다.", None),
 ("lporc", {"k": 4}, "쇼펜하우어는 그 거리를, 예의라고 불렀습니다.", None),
 ("lporc", {"k": 5}, "그리고 덧붙였죠. 안에 온기가 많은 사람은, 차라리 떨어져 지낸다고.", None),
 ("lporc", {"k": 6}, "삶은 고통과 지루함 사이를 오가는 시계추라고 말한, 이름난 비관주의자다운 결론이었습니다.", None),
 ("lporc", {"k": 7, "pause": 0.3, "segs": [("Z", "그럼 저는… 안이 따뜻해서 혼자인 걸까요, 그냥 추운 걸까요?")]},
  "그럼 저는… 안이 따뜻해서 혼자인 걸까요, 그냥 추운 걸까요?", None),
 # ---------- 오늘의 실험 ----------
 ("llab", {"segs": [("D", "그건 직접 재 보면 알 수 있지. 일주일 동안, 사람과의 거리를 다시 재 보자꾸나.")]},
  "그건 직접 재 보면 알 수 있지. 일주일 동안, 사람과의 거리를 다시 재 보자꾸나.", None),
 ("ltitle", {}, "오늘의 실험. 혼자가 편한 제로는, 외롭지 않을 수 있을까?", None),
 ("ltitle", {"k": 1}, "방법은 세 가지. 혼자를 고르기. 가까이 있는 낯선 사람에게 한마디. 그리고 연락이 끊긴 한 사람에게, 먼저 한 줄.", None),
 # ---------- [방법 1] 혼자를 고르기 ----------
 ("lsolo", {}, "방법 1. 혼자를, 고르기.", "방법 일. 혼자를, 고르기."),
 ("lsolo", {"k": 1}, "제로는 매일 저녁 15분, 휴대폰을 서랍에 넣고 혼자 앉아 봅니다.", "제로는 매일 저녁 십오 분, 휴대폰을 서랍에 넣고 혼자 앉아 봅니다."),
 ("lsolo", {"k": 2, "segs": [("Z", "폰이 없으니까… 손이 심심하네.")]}, "폰이 없으니까… 손이 심심하네.", None),
 ("lsolo", {"k": 3}, "사흘째 되던 날, 창밖의 빗소리와 찻잔의 온기가 먼저 느껴지기 시작합니다.", None),
 ("lsolos", {"study": "Nguyen 외 (2018)"}, "실제로 사람들에게, 아무것도 없이 혼자 15분을 보내게 한 연구가 있습니다.", "실제로 사람들에게, 아무것도 없이 혼자 십오 분을 보내게 한 연구가 있습니다."),
 ("lsolos", {"k": 1}, "들뜬 마음도, 짜증도 가라앉고, 마음이 차분해졌죠.", None),
 ("lsolos", {"k": 2}, "그런데 재미있는 건 여기부터예요. 스스로 원해서 고른 혼자일수록 더 차분해졌고, 떠밀린 혼자에서는 오히려 외로움이 커지기도 했습니다.", None),
 ("lsolos", {"k": 3, "pause": 0.3}, "혼자는, 내가 고를 때 쉼이 되고, 떠밀릴 때 외로움이 됩니다.", None),
 ("lfire", {}, "쇼펜하우어도 비슷한 말을 남겼습니다. 사람들 사이는 불과 같아서, 지혜로운 사람은 알맞은 거리에서 불을 쬔다.", None),
 ("lfire", {"k": 1, "segs": [("Z", "알맞은 거리… 그럼 저는, 불에서 너무 멀리 와 있었던 거네요.")]}, "알맞은 거리… 그럼 저는, 불에서 너무 멀리 와 있었던 거네요.", None),
 # ---------- [방법 2] 가까이 있는 낯선 사람에게 한마디 ----------
 ("lguard", {}, "방법 2. 가까이 있는 낯선 사람에게, 한마디.", "방법 이. 가까이 있는 낯선 사람에게, 한마디."),
 ("lguard", {"k": 1}, "수요일 아침. 2년 동안 매일 지나친 경비실 앞에서, 제로가 처음으로 인사 말고 한마디를 건넵니다.", "수요일 아침. 이 년 동안 매일 지나친 경비실 앞에서, 제로가 처음으로 인사 말고 한마디를 건넵니다."),
 ("lguard", {"k": 2, "segs": [("Z", "오늘 많이 춥죠? 따뜻한 거 드세요.")]}, "오늘 많이 춥죠? 따뜻한 거 드세요.", None),
 ("lguard", {"k": 3}, "아저씨가 환하게 웃으며, 귤 하나를 건넵니다. 2년 동안 몰랐던 얼굴이었습니다.", "아저씨가 환하게 웃으며, 귤 하나를 건넵니다. 이 년 동안 몰랐던 얼굴이었습니다."),
 ("ltrain", {"study": "Epley & Schroeder (2014)"}, "미국 시카고의 출근 기차에서 이런 실험이 있었습니다. 옆자리 낯선 사람과 이야기하며 가기, 그리고 혼자 조용히 가기.", None),
 ("ltrain", {"k": 1}, "사람들은 혼자 가는 쪽이 더 편할 거라고 예상했죠. 결과는 정반대였습니다. 이야기한 사람들의 출근길이 더 즐거웠어요.", None),
 ("ltrain", {"k": 2}, "그리고 말을 건 사람 중에, 거절당한 사람은 한 명도 없었습니다.", None),
 ("ltrain", {"k": 3, "segs": [("D", "우리는 남들이 나와 이야기하고 싶어 하는 마음을, 늘 작게 어림잡는단다.")]},
  "우리는 남들이 나와 이야기하고 싶어 하는 마음을, 늘 작게 어림잡는단다.", None),
 # ---------- [방법 3] 연락이 끊긴 한 사람에게 먼저 한 줄 ----------
 ("lmsg", {}, "방법 3. 연락이 끊긴 한 사람에게, 먼저 한 줄.", "방법 삼. 연락이 끊긴 한 사람에게, 먼저 한 줄."),
 ("lmsg", {"k": 1}, "금요일 밤, 연락처를 내리던 제로가 한 이름에서 멈춥니다. 대학 동기, 서준.", None),
 ("lmsg", {"k": 2}, "매일 붙어 다니던 친구. 언제부터인지, 3년째 연락이 없습니다.", "매일 붙어 다니던 친구. 언제부터인지, 삼 년째 연락이 없습니다."),
 ("lmsg", {"k": 3, "segs": [("Z", "이제 와서 연락하면… 이상하게 생각하지 않을까?")]}, "이제 와서 연락하면… 이상하게 생각하지 않을까?", None),
 ("lmsg", {"k": 4, "silent": 2.6}, "잘 지내? 갑자기 생각나서.", None),
 ("lwait", {}, "전송. 숫자 1은 금방 사라졌는데, 답이 없습니다.", "전송. 숫자 일은 금방 사라졌는데, 답이 없습니다."),
 ("lwait", {"k": 1, "segs": [("Z", "괜히 보냈나…")]}, "괜히 보냈나…", None),
 ("lwait", {"k": 2, "pause": 0.3}, "그 밤, 제로는 휴대폰을 뒤집어 놓고, 오래 잠들지 못했습니다.", None),
 # ---------- 두 이야기가 만나는 순간 ----------
 ("lletter", {}, "고독의 철학자에게도, 이런 밤이 있었습니다.", None),
 ("lletter", {"k": 1}, "1831년. 어머니를 마지막으로 본 지 17년. 책은 팔리지 않았고, 몸도 아팠던 해.",
  "천팔백삼십일 년. 어머니를 마지막으로 본 지 십칠 년. 책은 팔리지 않았고, 몸도 아팠던 해."),
 ("lletter", {"k": 2}, "끊어진 편지를 다시 이은 건, 아들 쪽이었습니다.", None),
 ("lletter", {"k": 3, "pause": 0.4}, "혼자를 그렇게 사랑한 철학자도, 먼저 손을 내밀었습니다.", None),
 ("lreply", {}, "다음 날 아침. 휴대폰이 울립니다.", None),
 ("lreply", {"k": 1, "silent": 4.4}, "와… 나 너한테 연락할까 말까, 몇 번이나 망설였는데. 먼저 해 줘서 고마워.", None),
 ("lreply", {"k": 2, "silent": 2.4}, "주말에 시간 돼? 그 강변, 아직 있더라.", None),
 ("lreach", {"study": "Liu 외 (2022)"}, "5,900명이 넘는 사람이 참여한 실험들이 있습니다. 오랜만에 짧은 안부를 보낸 사람들은, 받는 사람이 얼마나 반가워할지를 크게 낮춰 잡았습니다.",
  "오천구백 명이 넘는 사람이 참여한 실험들이 있습니다. 오랜만에 짧은 안부를 보낸 사람들은, 받는 사람이 얼마나 반가워할지를 크게 낮춰 잡았습니다."),
 ("lreach", {"k": 1}, "뜻밖의 연락일수록, 받는 사람의 반가움은 더 컸고요.", None),
 ("lwalk", {}, "일요일 저녁, 강변. 두 사람은 3년의 거리를, 천천히 걸으며 좁힙니다.", "일요일 저녁, 강변. 두 사람은 삼 년의 거리를, 천천히 걸으며 좁힙니다."),
 ("lwalk", {"k": 1, "segs": [("S", "난 네가 바빠서 연락 안 하는 줄 알았어."), ("Z", "난 네가 나 잊은 줄 알았지.")]},
  "난 네가 바빠서 연락 안 하는 줄 알았어. 난 네가 나 잊은 줄 알았지.", None),
 ("lwalk", {"k": 2, "pause": 0.4}, "찔릴까 봐, 둘 다 조금씩 멀리 서 있었던 겁니다.", None),
 # ---------- 마음에 남는 한 문장 ----------
 ("lend", {}, "고슴도치들이 찾은 건, 혼자도 아니고 바짝 붙는 것도 아닌, 견딜 만한 거리였습니다.", None),
 ("lend", {"k": 1}, "혼자서 나를 데우는 시간이 있어야, 가시를 세우지 않고 다가갈 수 있고,", None),
 ("lend", {"k": 2}, "먼저 한 걸음 다가가야, 그 온기를 나눌 수 있습니다.", None),
 ("lend", {"k": 3, "pause": 0.5, "segs": [("Z", "혼자가 편한 건 그대로예요. 근데 이제… 외롭진 않아요.")]}, "혼자가 편한 건 그대로예요. 근데 이제… 외롭진 않아요.", None),
 # ---------- 마무리 ----------
 ("lrecap", {}, "오늘의 실험을 한 줄로 정리하면, 혼자서 나를 데우고, 한 걸음 먼저.", None),
 ("lrecap", {"k": 1}, "오늘 밤 15분, 휴대폰 없이 혼자 있어 보세요. 그리고 내일, 떠오르는 한 사람에게 먼저 한 줄을 보내 보세요.",
  "오늘 밤 십오 분, 휴대폰 없이 혼자 있어 보세요. 그리고 내일, 떠오르는 한 사람에게 먼저 한 줄을 보내 보세요."),
 ("lrecap", {"k": 2, "ask": 1}, "여러분이 먼저 연락하고 싶은 한 사람은 누구인가요? 이름 대신 관계만 댓글로 남겨 주셔도 좋아요.", None),
 ("lcare", {}, "외로움이 오래 이어지고 하루하루가 버거울 만큼 힘들다면, 혼자 견디지 말고 가까운 사람이나 전문가에게 도움을 청해 주세요.", None),
 ("thanks", {}, "오늘도 끝까지 함께해 주셔서 고맙습니다. 상식실험실이었습니다.", None),
]
