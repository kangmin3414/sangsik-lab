# 실험 018 · 결정을 못 내리는 사람에게 — 키르케고르의 이것이냐 저것이냐 (대본 1차, 2026-10-30)
# (scene, args, subtitle, spoken-or-None). args["segs"] = [(voice, text[, spoken])...] when a line mixes voices.
# args["silent"] = seconds of silence (no TTS); the text is shown on screen (message / card), not as a subtitle.
# args["study"] = source chip on screen; args["n"/"when"/"name"] = day card (실험 n/5); args["ask"] = comment question card.
# args["quiz"] = on-screen self-test item (viewer answers in their head).
# Voices: N narrator, Z Zero, D doctor (박사).
# One image all the way: a two-way signpost. Zero has stood in front of it for three weeks (stay at the company vs. go to a
#   small picture-book publisher, deadline Friday 6 pm). By Friday he walks one road — and the point turns out to be the walking.
# Story: Monday, a 47-row pros-and-cons sheet → am I a maximizer? (Schwartz 2002 + 3-item self quiz) → Kierkegaard's joke
#   "marry or not, you'll regret it" and his real answer in the same book → Wednesday Zero asks for an extension (Gilbert & Ebert
#   2002: reversible choices satisfy less) → Thursday coin toss (Levitt) — in the air he knows what he hopes → Friday he chooses;
#   Kierkegaard's own broken engagement with Regine and the will → "life is understood backwards, lived forwards".
# Prop: a small two-way signpost Zero carries (or stands before) + a coin. Length target 8:20–8:40 (≈2,200 chars).
# Facts (checked 2026-10-30):
#   Kierkegaard, Either/Or I (1843), "Ecstatic Lecture" in Diapsalmata: "Marry, and you will regret it; do not marry, you will
#     also regret it; marry or do not marry, you will regret it either way." The aesthete's voice, not K.'s final word.
#   Either/Or II (Judge William): in choosing, what matters is less choosing the right thing than the energy, earnestness and
#     pathos with which one chooses (paraphrase).
#   Journals 1843 (JJ:167): life must be understood backwards, but it must be lived forwards.
#   Regine Olsen: engaged Sept 1840; K. broke it off Oct 1841; she married Schlegel 1847; K.'s will named her his heir
#     (she declined the estate, accepted some letters/personal items).
#   Schwartz, Ward, Monterosso, Lyubomirsky, White & Lehman 2002 JPSP: Maximization Scale; maximizing correlated with lower
#     happiness, optimism, self-esteem, life satisfaction and with more depression, perfectionism, regret; maximizers less
#     satisfied with purchases and more affected by upward social comparison. Quiz items adapted from the scale (radio
#     station-switching → OTT browsing; gift shopping; "never settle for second best").
#   Gilbert & Ebert 2002 JPSP: Harvard photography students; those who could exchange their chosen print later liked it less
#     than those whose choice was final; yet people tend to prefer keeping the option to change. Gilbert: "I'm getting married
#     in the spring…" (no more shopping).
#   Levitt 2021 Rev Econ Stud ("Heads or Tails", NBER w22487): large online field experiment, ~20,000 coin tosses on decisions
#     people were stuck on (e.g., quitting a job, ending a relationship); those whom the coin told to make the change were happier
#     six months later. Participants self-selected — say so.
# Overlap check (001–017): Descartes 007 already used the "548 graduates, +20% salary, less satisfied" study and Zero picking a
#   menu in 3 minutes → NOT used here (no lunch-menu scene). Nietzsche 005 used inaction-regret (Gilovich) → not used.
#   Kierkegaard, Schwartz 2002 scale, Gilbert & Ebert, Levitt, Regine: first time.
# Zero's offer, the publisher and the week are fiction.
S = [
 # ---------- 갈림길 앞에서 3주째 ----------
 ("cfork", {}, "월요일 밤. 제로 앞에는 3주째 같은 갈림길이 서 있습니다.", "월요일 밤. 제로 앞에는 삼 주째 같은 갈림길이 서 있습니다."),
 ("cfork", {"k": 1}, "왼쪽은 지금 다니는 안정적인 회사. 오른쪽은 늘 꿈꾸던, 작은 그림책 출판사의 제안.", None),
 ("cfork", {"k": 2, "silent": 2.6}, "답변 마감: 이번 주 금요일 오후 6시", None),
 ("cfork", {"k": 3, "segs": [("Z", "장단점 표가 벌써 47줄인데… 왜 더 모르겠지?")]}, "장단점 표가 벌써 47줄인데… 왜 더 모르겠지?", None),
 ("ctitle", {}, "고를수록 더 못 고르겠는 마음. 오늘의 실험. 결정 장애 제로는 금요일 6시까지, 길 하나를 고를 수 있을까?", None),
 # ---------- [1일 차] 나는 최고를 찾는 사람일까 ----------
 ("cday", {"n": 1, "when": "월요일", "name": "나는 어떤 사람일까"}, "첫째 날. 먼저, 나는 어떤 사람일까.", None),
 ("cquiz", {}, "잠깐, 여러분도 같이 해 보세요. 그렇다면 속으로 하나씩 세어 보는 겁니다.", None),
 ("cquiz", {"k": 1, "quiz": 1}, "하나. 영화 한 편 보려고 OTT를 켰다가, 고르기만 하다 30분이 지나간다.", "하나. 영화 한 편 보려고 오티티를 켰다가, 고르기만 하다 삼십 분이 지나간다."),
 ("cquiz", {"k": 2, "quiz": 2}, "둘. 친구 선물 하나 사는 게 유난히 어렵다.", None),
 ("cquiz", {"k": 3, "quiz": 3}, "셋. 나는 두 번째로 좋은 것엔, 절대 만족하지 않는다.", None),
 ("cquiz", {"k": 4, "segs": [("Z", "세 개 다요…")]}, "세 개 다요…", None),
 ("cquiz", {"k": 5}, "어젯밤에도 40분 동안 영화를 고르다가, 결국 아무것도 안 보고 잠들었거든요.", "어젯밤에도 사십 분 동안 영화를 고르다가, 결국 아무것도 안 보고 잠들었거든요."),
 ("cmax", {"study": "Schwartz 외 (2002)"}, "이 질문들은 미국 심리학자 배리 슈워츠 연구팀이 만든 검사에서 따왔습니다. 연구팀은 사람을 두 부류로 나눴죠.", None),
 ("cmax", {"k": 1}, "모든 선택지를 다 비교해서 최고를 찾아야 하는 극대화형. 그리고 내 기준을 넘는 첫 번째 걸 고르는 만족형.", None),
 ("cmax", {"k": 2, "pause": 0.3}, "결과는 의외였어요. 최고를 찾는 사람일수록 덜 행복했고, 더 자주 후회했고, 우울감도 더 높았습니다.", None),
 ("cmax", {"k": 3}, "극대화형은 남과 더 자주 비교했고, 나보다 잘된 사람을 볼 때 더 크게 흔들렸어요.", None),
 ("cmax", {"k": 4}, "최고를 고르려 애쓰는 동안, 고른 것을 즐길 마음이 다 닳아 버리는 거죠.", None),
 ("cmax", {"k": 5}, "제로는 47줄짜리 표를 접고, 새 종이에 딱 세 줄만 적었습니다. 내가 꼭 지키고 싶은 것. 사람, 배움, 저녁이 있는 삶.", None),
 ("cmax", {"k": 6, "segs": [("Z", "어… 두 길 다, 세 줄을 넘네요?")]}, "어… 두 길 다, 세 줄을 넘네요?", None),
 ("cmax", {"k": 7}, "최고의 답은 없었습니다. 충분히 좋은 답이, 두 개 있었을 뿐.", None),
 # ---------- [2일 차] 키르케고르의 농담 ----------
 ("cday", {"n": 2, "when": "화요일", "name": "철학자의 농담"}, "둘째 날. 철학자의 농담.", None),
 ("ckier", {}, "180년 전 덴마크에, 이 고민으로 책 한 권을 쓴 철학자가 있습니다. 쇠렌 키르케고르. 책 제목부터, 이것이냐 저것이냐.", "백팔십 년 전 덴마크에, 이 고민으로 책 한 권을 쓴 철학자가 있습니다. 쇠렌 키르케고르. 책 제목부터, 이것이냐 저것이냐."),
 ("ckier", {"k": 1}, "그는 실존주의의 아버지로 불립니다. 남이 정해 준 정답이 아니라, 내가 고른 선택이 나를 만든다고 본 사람이죠.", None),
 ("ckier", {"k": 2, "pause": 0.3}, "그 책엔 이런 문장이 나옵니다. 결혼하라, 그러면 후회할 것이다. 결혼하지 마라, 그래도 후회할 것이다.", None),
 ("ckier", {"k": 3}, "결혼하든 안 하든, 너는 후회할 것이다.", None),
 ("ckier", {"k": 4, "segs": [("Z", "아니, 그럼 뭘 하라는 거예요!")]}, "아니, 그럼 뭘 하라는 거예요!", None),
 ("ckier", {"k": 5, "segs": [("D", "허허, 그 책 뒷부분까지 읽어야지.")]}, "허허, 그 책 뒷부분까지 읽어야지.", None),
 ("ckier", {"k": 6}, "그 문장은 책 속 인물의 비꼬는 농담이었습니다. 같은 책의 뒷부분에서, 다른 목소리가 이렇게 답하죠.", None),
 ("ckier", {"k": 7, "pause": 0.4}, "선택에서 중요한 건, 옳은 것을 고르는 것보다, 얼마나 진지하게, 온 마음으로 고르느냐다.", None),
 ("ckier", {"k": 8, "segs": [("Z", "옳은 걸 고르는 게 아니라… 진지하게 고르는 거라고요?")]}, "옳은 걸 고르는 게 아니라… 진지하게 고르는 거라고요?", None),
 # ---------- [3일 차] 마감을 미루고 싶은 날 ----------
 ("cday", {"n": 3, "when": "수요일", "name": "도망칠 문 닫기"}, "그런데 셋째 날, 제로는 꾀를 냅니다.", None),
 ("cdelay", {}, "출판사에 보낼 메일을 쓰고 있었거든요. 마감을, 2주만 미뤄 주실 수 있을까요.", "출판사에 보낼 메일을 쓰고 있었거든요. 마감을, 이 주만 미뤄 주실 수 있을까요."),
 ("cdelay", {"k": 1, "segs": [("Z", "문을 둘 다 열어 두면, 나중에 언제든 고를 수 있잖아.")]}, "문을 둘 다 열어 두면, 나중에 언제든 고를 수 있잖아.", None),
 ("cdelay", {"k": 2, "segs": [("D", "문을 열어 두는 것도 선택이란다, 제로야. 아무것도 고르지 않는 선택.")]}, "문을 열어 두는 것도 선택이란다, 제로야. 아무것도 고르지 않는 선택.", None),
 ("cphoto", {"study": "Gilbert & Ebert (2002)"}, "하버드대 연구팀은 사진 수업을 듣는 학생들에게, 직접 찍은 사진 두 장 중 한 장만 가져가게 했습니다.", None),
 ("cphoto", {"k": 1}, "한 그룹은 며칠 안에 바꿀 수 있다고 했고, 다른 그룹은 한 번 고르면 끝이라고 했죠.", None),
 ("cphoto", {"k": 2, "pause": 0.3}, "며칠 뒤, 자기 사진을 더 좋아한 건 바꿀 수 없던 쪽이었습니다. 바꿀 수 있는 쪽은, 계속 다른 사진을 떠올렸거든요.", None),
 ("cphoto", {"k": 3}, "그런데도 사람들은, 바꿀 수 있는 쪽을 더 원했습니다. 문을 열어 두면 마음이 편할 것 같지만, 실은 그 문 앞에서 계속 서성이게 되는 거죠.", None),
 ("cphoto", {"k": 4}, "이 연구를 한 심리학자 대니얼 길버트는 결혼을 앞두고 이렇게 말했습니다. 이 사람이 나를 평생 행복하게 해 줄 거라는 걸, 나는 안다.", None),
 ("cphoto", {"k": 5}, "제로는 메일을 지웠습니다. 마감은, 그대로 금요일 6시.", "제로는 메일을 지웠습니다. 마감은, 그대로 금요일 여섯 시."),
 # (미드롤 광고 후보: 여기, 약 4:40)
 # ---------- [4일 차] 동전이 공중에 있을 때 ----------
 ("cday", {"n": 4, "when": "목요일", "name": "동전 던지기"}, "넷째 날. 이번엔 정말, 동전에게 맡겨 보기로 했습니다.", None),
 ("ccoin", {"study": "Levitt (2021)"}, "미국 경제학자 스티븐 레빗은, 큰 결정을 못 내리던 사람들이 웹사이트에서 동전을 던지게 했습니다. 2만 번이 넘는 동전 던지기였죠.", "미국 경제학자 스티븐 레빗은, 큰 결정을 못 내리던 사람들이 웹사이트에서 동전을 던지게 했습니다. 이만 번이 넘는 동전 던지기였죠."),
 ("ccoin", {"k": 1}, "회사를 그만둘까, 이 관계를 끝낼까. 동전이 바꿔 보라고 한 사람들은, 여섯 달 뒤 더 행복하다고 답했습니다.", None),
 ("ccoin", {"k": 2}, "스스로 찾아온 사람들의 결과라 모두에게 그대로 맞진 않지만, 오래 고민하던 사람에게 한 걸음이 생각보다 괜찮았던 셈이에요.", None),
 ("cflip", {}, "제로는 동전을 들었습니다. 앞면이면 출판사, 뒷면이면 지금 회사.", None),
 ("cflip", {"k": 1, "segs": [("Z", "출판사 가면 월급이 줄고, 남으면 꿈이 줄고…")]}, "출판사 가면 월급이 줄고, 남으면 꿈이 줄고…", None),
 ("cflip", {"k": 2, "pause": 0.5}, "동전이 공중에서 빙글빙글 도는, 그 1초.", "동전이 공중에서 빙글빙글 도는, 그 일 초."),
 ("cflip", {"k": 3, "segs": [("Z", "앞면… 앞면 나와라.")]}, "앞면… 앞면 나와라.", None),
 ("cflip", {"k": 4}, "동전은, 뒷면이었습니다. 그런데 제로는 웃었어요. 결과보다 먼저, 자기가 무엇을 바랐는지 들어 버렸거든요.", None),
 ("cflip", {"k": 5, "segs": [("D", "동전은 답을 주는 게 아니란다. 네 마음을 꺼내 줄 뿐이지.")]}, "동전은 답을 주는 게 아니란다. 네 마음을 꺼내 줄 뿐이지.", None),
 ("cflip", {"k": 6, "segs": [("Z", "뒷면 보자마자 서운했어요. 그게… 답이었네요.")]}, "뒷면 보자마자 서운했어요. 그게… 답이었네요.", None),
 # ---------- [5일 차] 앞을 향해 걷기 ----------
 ("cday", {"n": 5, "when": "금요일", "name": "앞을 향해 걷기"}, "다섯째 날. 금요일 오후 5시 50분.", "다섯째 날. 금요일 오후 다섯 시 오십 분."),
 ("cregine", {}, "키르케고르에게도, 평생 붙들고 산 선택이 하나 있었습니다. 스물일곱 살에 레기네라는 여인과 약혼했다가, 1년 만에 스스로 파혼했거든요.", "키르케고르에게도, 평생 붙들고 산 선택이 하나 있었습니다. 스물일곱 살에 레기네라는 여인과 약혼했다가, 일 년 만에 스스로 파혼했거든요."),
 ("cregine", {"k": 1}, "그 뒤로 그는 그 선택을 수없이 돌아보며 글을 썼고, 유언장에는 자기 재산을 그녀에게 남긴다고 적었습니다.", None),
 ("cregine", {"k": 2, "pause": 0.4}, "그런 그가 일기에 남긴 문장이 있습니다. 삶은 뒤를 돌아볼 때 이해되지만, 살아가는 건 앞을 향해서다.", None),
 ("cregine", {"k": 3}, "어느 길이 맞았는지는, 걸어 본 뒤에야 알 수 있다는 거죠. 그러니 지금 할 수 있는 건, 고른 길을 온 마음으로 걷는 것.", None),
 ("cregine", {"k": 4}, "제로는 마지막으로 세 줄짜리 종이를 펼쳤습니다. 사람, 배움, 저녁이 있는 삶. 어느 길이든 지킬 수 있는 세 줄이었어요. 남은 건, 어느 쪽으로 걸어갈지 고르는 일뿐.", None),
 ("csend", {}, "5시 58분. 제로는 메일을 보냈습니다.", "다섯 시 오십팔 분. 제로는 메일을 보냈습니다."),
 ("csend", {"k": 1, "silent": 2.8}, "제안 감사합니다. 함께하겠습니다.", None),
 ("csend", {"k": 2, "segs": [("Z", "무서워요. 근데… 이상하게 가벼워요.")]}, "무서워요. 근데… 이상하게 가벼워요.", None),
 ("csend", {"k": 3}, "제로가 고른 게 정답인지는, 아직 아무도 모릅니다. 하지만 3주 동안 서 있던 갈림길에서, 처음으로 발이 앞으로 나갔어요.", "제로가 고른 게 정답인지는, 아직 아무도 모릅니다. 하지만 삼 주 동안 서 있던 갈림길에서, 처음으로 발이 앞으로 나갔어요."),
 ("csend", {"k": 4, "segs": [("D", "제로야, 그 길이 정답이 되게 하는 건, 이제부터 네 몫이란다.")]}, "제로야, 그 길이 정답이 되게 하는 건, 이제부터 네 몫이란다.", None),
 ("csend", {"k": 5, "silent": 2.6}, "환영합니다! 월요일에 뵐게요 :)", None),
 ("csend", {"k": 6}, "그날 저녁, 제로는 47줄짜리 장단점 표를 처음으로 휴지통에 넣었습니다.", "그날 저녁, 제로는 사십칠 줄짜리 장단점 표를 처음으로 휴지통에 넣었습니다."),
 # ---------- 마무리 ----------
 ("crecap", {}, "최고 대신 충분히 좋은 기준 세 줄. 결혼해도 후회, 안 해도 후회라면, 온 마음으로 고르기. 도망칠 문은 닫고, 동전으로 내 마음 꺼내 보기. 그리고 고른 길은, 앞을 향해 걷기.", None),
 ("crecap", {"k": 1, "ask": 1}, "여러분이 지금 서 있는 갈림길은 뭔가요? 충분히 좋은 기준 세 줄을, 댓글로 같이 적어 봐요.", None),
 ("thanks", {}, "오늘도 끝까지 함께해 주셔서 고맙습니다. 상식실험실이었습니다.", None),
]
