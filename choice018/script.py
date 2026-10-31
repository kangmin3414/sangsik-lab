# 실험 018 · 3주째 결정을 못 하고 있다 — 키르케고르의 이것이냐 저것이냐 (대본 2차, 2026-10-31)
# v2: faster, one story, first-5-second scene, open loop at 0:20 (the coin — and Zero won't follow it), a turn every 30–40 s,
#   running gag (the pros-and-cons sheet keeps growing: 47 → 52 → 61 rows), emotional TTS cues, series teaser at the end.
# (scene, args, subtitle, spoken-or-None). args["segs"] = [(voice, text[, spoken])...] when a line mixes voices.
# args["silent"] = seconds of silence (no TTS); the text is shown on screen (message / card), not as a subtitle.
# args["study"] = source chip; args["n"/"when"/"name"] = day card (실험 n/5); args["ask"] = comment question card;
# args["quiz"] = on-screen self-test item; args["rows"] = running-gag counter on the pros/cons sheet.
# NEW in v2 — args["tone"] = TTS delivery cue for this line (Gemini TTS style prompt), one of:
#   tense (조금 빠르고 긴장된), playful (장난스럽고 가벼운), whisper (낮고 조용한), warm (따뜻하고 느린),
#   tremble (살짝 떨리는), excited (들뜬), deadpan (무표정하게 툭). No tone = the episode's default narrator style.
#   args["sfx"] = sound cue at the start of the line: tick, typing, ding, whoosh, coin_flip, coin_land, page, heartbeat, send.
# Voices: N narrator, Z Zero, D doctor (박사).
# One image all the way: a two-way signpost. Left: the safe company. Right: a small picture-book publisher's offer.
# Facts (checked 2026-10-30; unchanged from v1):
#   Kierkegaard, Either/Or I (1843), "Ecstatic Lecture" (Diapsalmata): "Marry, and you will regret it; do not marry, you will
#     also regret it…" — the aesthete's voice. Either/Or II (Judge William): in choosing, what matters is less choosing the
#     right thing than the energy, earnestness and pathos with which one chooses (paraphrase).
#   Journals 1843: life must be understood backwards, but it must be lived forwards.
#   Regine Olsen: engaged Sept 1840 (K. was 27); he broke it off Oct 1841; she married Schlegel 1847; K. died 1855 at 42;
#     his will named her his heir (she declined the estate).
#   Schwartz et al. 2002 JPSP: Maximization Scale; maximizers less happy and optimistic, more depression and regret, more
#     upward social comparison. Quiz items adapted from the scale.
#   Gilbert & Ebert 2002 JPSP: photography students; those who could swap their print later liked it less than those whose
#     choice was final; yet people prefer keeping the option to change. Gilbert: "I'm getting married in the spring…".
#   Levitt 2021 Rev Econ Stud (NBER w22487): ~20,000 online coin tosses on stuck decisions (quit a job, end a relationship);
#     those whom the coin told to make the change were happier six months later. Self-selected participants — say so.
# Overlap check (001–017): no lunch menu, no "548 graduates" study (007), no inaction-regret study (005).
# Zero's offer, the publisher and the week are fiction. The series teaser (019: Zero's first week at the publisher) is a
#   promise to keep — plan 019 accordingly, or cut the last teaser line before production.
S = [
 # ---------- 0:00 첫 장면 ----------
 ("cmail", {"sfx": "tick", "tone": "tense"}, "보내기 버튼 위에서, 손가락이 3주째 멈춰 있습니다.", "보내기 버튼 위에서, 손가락이 삼 주째 멈춰 있습니다."),
 ("cmail", {"k": 1, "segs": [("Z", "보낼까… 말까… 보낼까…")], "tone": "whisper"}, "보낼까… 말까… 보낼까…", None),
 ("cfork", {"sfx": "whoosh"}, "왼쪽은 7년 다닌 회사. 오른쪽은 어릴 때부터 꿈꾸던, 작은 그림책 출판사의 제안.", "왼쪽은 칠 년 다닌 회사. 오른쪽은 어릴 때부터 꿈꾸던, 작은 그림책 출판사의 제안."),
 ("cfork", {"k": 1, "silent": 2.2, "sfx": "ding"}, "답변 마감: 이번 주 금요일 오후 6시", None),
 ("cfork", {"k": 2, "rows": 47, "segs": [("Z", "장단점 표가 47줄인데… 쓸수록 더 모르겠어요.")], "tone": "playful"}, "장단점 표가 47줄인데… 쓸수록 더 모르겠어요.", "장단점 표가 사십칠 줄인데… 쓸수록 더 모르겠어요."),
 ("chook", {}, "결국 금요일, 동전 하나가 이 고민을 끝냅니다. 그런데 제로는, 동전이 정해 준 쪽으로 가지 않아요.", None),
 ("chook", {"k": 1}, "왜 그랬는지는, 180년 전 한 철학자의 실패한 약혼 이야기에 답이 있습니다.", "왜 그랬는지는, 백팔십 년 전 한 철학자의 실패한 약혼 이야기에 답이 있습니다."),
 ("ctitle", {}, "오늘의 실험. 결정 못 하는 제로의 닷새. 금요일 6시까지, 길 하나를 고를 수 있을까?", "오늘의 실험. 결정 못 하는 제로의 닷새. 금요일 여섯 시까지, 길 하나를 고를 수 있을까?"),
 # ---------- [월] 나는 어떤 사람일까 ----------
 ("cday", {"n": 1, "when": "월요일", "name": "나는 어떤 사람일까"}, "월요일. 먼저, 나는 어떤 사람일까.", None),
 ("cquiz", {"tone": "playful"}, "여러분도 같이 해 보세요. 해당되면, 손가락 하나씩 접는 겁니다.", None),
 ("cquiz", {"k": 1, "quiz": 1, "sfx": "ding"}, "하나. 영화 한 편 보려고 OTT를 켰는데, 고르다가 30분이 지나간다.", "하나. 영화 한 편 보려고 오티티를 켰는데, 고르다가 삼십 분이 지나간다."),
 ("cquiz", {"k": 2, "quiz": 2, "sfx": "ding"}, "둘. 친구 선물 하나 사는 게, 유난히 어렵다.", None),
 ("cquiz", {"k": 3, "quiz": 3, "sfx": "ding"}, "셋. 두 번째로 좋은 건, 절대 싫다.", None),
 ("cquiz", {"k": 4, "segs": [("Z", "…세 개 다요. 어젯밤엔 영화 고르다가 그냥 잤어요.")], "tone": "deadpan"}, "…세 개 다요. 어젯밤엔 영화 고르다가 그냥 잤어요.", None),
 ("cmax", {"study": "Schwartz 외 (2002)"}, "이 질문들은 미국 심리학자 배리 슈워츠 연구팀의 검사에서 따왔습니다. 연구팀은 사람을 둘로 나눴죠.", None),
 ("cmax", {"k": 1}, "모든 걸 다 비교해서 최고를 찾아야 하는 극대화형. 내 기준만 넘으면 고르는 만족형.", None),
 ("cmax", {"k": 2, "pause": 0.3}, "누가 더 행복했을까요? 최고를 찾는 쪽이 오히려 덜 행복했고, 더 자주 후회했고, 더 우울했습니다.", None),
 ("cmax", {"k": 3}, "남과 더 자주 비교했고, 나보다 잘된 사람을 보면 더 크게 흔들렸죠. 최고를 찾느라, 고른 걸 즐길 힘이 남지 않는 거예요.", None),
 ("cthree", {"rows": 3, "sfx": "page"}, "그래서 제로는 47줄짜리 표를 접고, 딱 세 줄만 적었습니다. 내가 꼭 지키고 싶은 것. 사람, 배움, 저녁이 있는 삶.", "그래서 제로는 사십칠 줄짜리 표를 접고, 딱 세 줄만 적었습니다. 내가 꼭 지키고 싶은 것. 사람, 배움, 저녁이 있는 삶."),
 ("cthree", {"k": 1, "segs": [("Z", "어? 두 길 다… 세 줄을 통과하네요?")], "tone": "excited"}, "어? 두 길 다… 세 줄을 통과하네요?", None),
 ("cthree", {"k": 2}, "정답은 하나가 아니었습니다. 충분히 좋은 답이, 두 개였을 뿐.", None),
 ("cthree", {"k": 3, "rows": 52, "segs": [("Z", "…그럼 더 어려운 거잖아요!")], "tone": "playful"}, "…그럼 더 어려운 거잖아요!", None),
 # ---------- [화] 철학자의 농담 ----------
 ("cday", {"n": 2, "when": "화요일", "name": "철학자의 농담"}, "화요일. 박사님이 책 한 권을 내밀었습니다.", None),
 ("ckier", {"segs": [("D", "180년 전에, 너랑 똑같은 고민으로 책을 쓴 사람이 있단다.", "백팔십 년 전에, 너랑 똑같은 고민으로 책을 쓴 사람이 있단다.")], "tone": "warm"}, "180년 전에, 너랑 똑같은 고민으로 책을 쓴 사람이 있단다.", "백팔십 년 전에, 너랑 똑같은 고민으로 책을 쓴 사람이 있단다."),
 ("ckier", {"k": 1}, "덴마크의 철학자, 쇠렌 키르케고르. 책 제목부터, 이것이냐 저것이냐.", None),
 ("ckier", {"k": 2}, "실존주의의 아버지로 불리는 사람이죠. 남이 정해 준 정답이 아니라, 내가 고른 선택이 나를 만든다고 본 철학자.", None),
 ("ckier", {"k": 3, "pause": 0.3, "sfx": "page"}, "그 책엔 이런 문장이 나옵니다. 결혼하라, 후회할 것이다. 결혼하지 마라, 그래도 후회할 것이다.", None),
 ("ckier", {"k": 4, "tone": "deadpan"}, "결혼하든 안 하든, 너는 후회할 것이다.", None),
 ("ckier", {"k": 5, "segs": [("Z", "아니, 그럼 뭘 하라는 거예요!")], "tone": "playful"}, "아니, 그럼 뭘 하라는 거예요!", None),
 ("ckier", {"k": 6, "segs": [("D", "허허, 그 책을 뒷장까지 읽어야지.")]}, "허허, 그 책을 뒷장까지 읽어야지.", None),
 ("ckier", {"k": 7}, "그 문장은 책 속 인물의 비꼬는 농담이었습니다. 같은 책의 뒷부분에서, 다른 목소리가 이렇게 답하죠.", None),
 ("ckier", {"k": 8, "pause": 0.4, "tone": "warm"}, "선택에서 중요한 건, 옳은 것을 고르는 게 아니다. 얼마나 진지하게, 온 마음으로 고르느냐다.", None),
 ("ckier", {"k": 9, "segs": [("Z", "옳은 걸 고르는 게 아니라… 온 마음으로 고르는 거.")], "tone": "whisper"}, "옳은 걸 고르는 게 아니라… 온 마음으로 고르는 거.", None),
 ("ckier", {"k": 10, "segs": [("D", "재밌는 건, 키르케고르가 이 책을 가명으로 냈다는 거야. 어느 목소리가 진짜인지, 독자가 직접 고르라고.")], "tone": "playful"}, "재밌는 건, 키르케고르가 이 책을 가명으로 냈다는 거야. 어느 목소리가 진짜인지, 독자가 직접 고르라고.", None),
 # ---------- [수] 도망칠 문 ----------
 ("cday", {"n": 3, "when": "수요일", "name": "도망칠 문 닫기"}, "그런데 수요일, 제로는 꾀를 냅니다.", None),
 ("cdelay", {"sfx": "typing", "tone": "playful"}, "출판사에 보낼 메일. 마감을, 2주만 미뤄 주실 수 있을까요.", "출판사에 보낼 메일. 마감을, 이 주만 미뤄 주실 수 있을까요."),
 ("cdelay", {"k": 1, "segs": [("Z", "문을 둘 다 열어 두면, 나중에 언제든 고를 수 있잖아요. 완벽한 작전!")], "tone": "excited"}, "문을 둘 다 열어 두면, 나중에 언제든 고를 수 있잖아요. 완벽한 작전!", None),
 ("cdelay", {"k": 2, "segs": [("D", "그것도 선택이란다, 제로야. 아무것도 고르지 않는 선택.")]}, "그것도 선택이란다, 제로야. 아무것도 고르지 않는 선택.", None),
 ("cphoto", {"study": "Gilbert & Ebert (2002)"}, "하버드대 연구팀은 사진 수업 학생들에게, 직접 찍은 사진 두 장 중 한 장만 가져가게 했습니다.", None),
 ("cphoto", {"k": 1}, "한 그룹에겐 며칠 안에 바꿀 수 있다고 했고, 다른 그룹에겐 한 번 고르면 끝이라고 했죠.", None),
 ("cphoto", {"k": 2, "pause": 0.3}, "며칠 뒤, 자기 사진을 더 좋아한 건 바꿀 수 없던 쪽이었습니다. 바꿀 수 있는 쪽은, 자꾸 다른 사진이 떠올랐거든요.", None),
 ("cphoto", {"k": 3}, "그런데도 사람들은 바꿀 수 있는 쪽을 더 원했습니다. 열어 둔 문은 편해 보이지만, 사실은 그 앞에서 계속 서성이게 만들어요.", None),
 ("cphoto", {"k": 4}, "이 연구를 한 심리학자 대니얼 길버트는, 결혼을 앞두고 이렇게 말했습니다. 이 사람이 나를 평생 행복하게 해 줄 거라는 걸, 나는 안다.", None),
 ("cphoto", {"k": 5, "sfx": "whoosh"}, "제로는 메일을 지웠습니다. 마감은, 그대로 금요일 6시.", "제로는 메일을 지웠습니다. 마감은, 그대로 금요일 여섯 시."),
 ("cphoto", {"k": 6, "rows": 61, "segs": [("Z", "…근데 표는 61줄이 됐어요.")], "tone": "deadpan"}, "…근데 표는 61줄이 됐어요.", "…근데 표는 육십일 줄이 됐어요."),
 # (미드롤 광고 후보: 여기, 약 4:30)
 # ---------- [목] 동전 ----------
 ("cday", {"n": 4, "when": "목요일", "name": "동전 던지기"}, "목요일. 이제 정말, 동전에게 맡기기로 했습니다.", None),
 ("ccoin", {"study": "Levitt (2021)"}, "미국 경제학자 스티븐 레빗은, 큰 결정을 못 내리던 사람들이 웹사이트에서 동전을 던지게 했습니다. 2만 번이 넘는 동전 던지기였죠.", "미국 경제학자 스티븐 레빗은, 큰 결정을 못 내리던 사람들이 웹사이트에서 동전을 던지게 했습니다. 이만 번이 넘는 동전 던지기였죠."),
 ("ccoin", {"k": 1}, "회사를 그만둘까, 이 관계를 끝낼까. 동전이 바꿔 보라고 한 사람들은, 여섯 달 뒤 더 행복하다고 답했습니다.", None),
 ("ccoin", {"k": 2}, "스스로 찾아온 사람들이라 모두에게 그대로 맞진 않지만, 오래 서성이던 사람에겐 한 걸음이 생각보다 괜찮았던 거죠.", None),
 ("cflip", {"sfx": "coin_flip"}, "앞면이면 출판사. 뒷면이면 회사.", None),
 ("cflip", {"k": 1, "pause": 0.5, "sfx": "heartbeat", "tone": "tense"}, "동전이 공중에서 도는, 그 1초.", "동전이 공중에서 도는, 그 일 초."),
 ("cflip", {"k": 2, "segs": [("Z", "앞면… 제발 앞면…")], "tone": "whisper"}, "앞면… 제발 앞면…", None),
 ("cflip", {"k": 3, "sfx": "coin_land", "pause": 0.4}, "뒷면이었습니다.", None),
 ("cflip", {"k": 4, "segs": [("Z", "…서운해요. 엄청.")], "tone": "tremble"}, "…서운해요. 엄청.", None),
 ("cflip", {"k": 5, "segs": [("D", "그게 답이란다. 동전은 답을 주는 게 아니라, 네가 뭘 바라는지 꺼내 줄 뿐이지.")], "tone": "warm"}, "그게 답이란다. 동전은 답을 주는 게 아니라, 네가 뭘 바라는지 꺼내 줄 뿐이지.", None),
 # ---------- [금] 앞을 향해 ----------
 ("cday", {"n": 5, "when": "금요일", "name": "앞을 향해 걷기"}, "금요일, 오후 5시 50분.", "금요일, 오후 다섯 시 오십 분."),
 ("cregine", {"tone": "warm"}, "키르케고르에게도, 평생 붙들고 산 선택이 하나 있었습니다.", None),
 ("cregine", {"k": 1}, "스물일곱 살, 레기네라는 여인과 약혼했습니다. 그리고 1년 만에, 스스로 파혼했죠.", "스물일곱 살, 레기네라는 여인과 약혼했습니다. 그리고 일 년 만에, 스스로 파혼했죠."),
 ("cregine", {"k": 2}, "그 뒤로 그는 그 선택을 수없이 돌아보며 글을 썼습니다. 마흔둘에 세상을 떠날 때, 유언장엔 재산을 그녀에게 남긴다고 적었고요.", None),
 ("cregine", {"k": 3, "pause": 0.4, "tone": "whisper"}, "그런 그가, 일기에 이렇게 남겼습니다.", None),
 ("cregine", {"k": 4, "pause": 0.5, "tone": "warm"}, "삶은 뒤를 돌아볼 때 이해되지만, 살아가는 건 앞을 향해서다.", None),
 ("cregine", {"k": 5}, "어느 길이 맞았는지는, 걸어 본 뒤에야 알 수 있다는 거죠. 그러니 지금 할 수 있는 건 하나. 고른 길을, 온 마음으로 걷는 것.", None),
 ("cdrawer", {"sfx": "page"}, "5시 55분. 책상 서랍을 정리하던 제로의 손에, 낡은 공책 한 권이 걸렸습니다.", "다섯 시 오십오 분. 책상 서랍을 정리하던 제로의 손에, 낡은 공책 한 권이 걸렸습니다."),
 ("cdrawer", {"k": 1, "tone": "warm"}, "초등학생 제로가 크레파스로 그린 그림책. 제목은, 길을 찾는 작은 제로.", None),
 ("cdrawer", {"k": 2, "segs": [("Z", "…이걸 아직 갖고 있었네.")], "tone": "tremble"}, "…이걸 아직 갖고 있었네.", None),
 ("csend", {"sfx": "tick", "tone": "tense"}, "5시 58분.", "다섯 시 오십팔 분."),
 ("csend", {"k": 1, "sfx": "typing", "silent": 2.6}, "제안 감사합니다. 함께하겠습니다.", None),
 ("csend", {"k": 2, "sfx": "send"}, "제로는, 동전과 반대쪽 길을 골랐습니다.", None),
 ("csend", {"k": 3, "segs": [("Z", "무서워요. 근데… 이상하게 가벼워요.")], "tone": "tremble"}, "무서워요. 근데… 이상하게 가벼워요.", None),
 ("csend", {"k": 4, "silent": 2.4, "sfx": "ding"}, "환영합니다! 월요일에 뵐게요 :)", None),
 ("csend", {"k": 5, "segs": [("D", "제로야, 그 길이 정답이 되게 하는 건, 이제부터 네 몫이란다.")], "tone": "warm"}, "제로야, 그 길이 정답이 되게 하는 건, 이제부터 네 몫이란다.", None),
 ("csend", {"k": 6, "rows": 0, "sfx": "page"}, "그날 밤, 61줄짜리 장단점 표는 처음으로 휴지통에 들어갔습니다.", "그날 밤, 육십일 줄짜리 장단점 표는 처음으로 휴지통에 들어갔습니다."),
 # ---------- 마무리 ----------
 ("crecap", {"tone": "warm"}, "최고 대신, 충분히 좋은 세 줄. 도망칠 문은 닫고, 동전으로 내 마음 꺼내 보기. 그리고 고른 길은, 앞을 향해 걷기.", None),
 ("crecap", {"k": 1, "ask": 1}, "여러분이 지금 서 있는 갈림길은 뭔가요? 꼭 지키고 싶은 세 줄을, 댓글로 같이 적어 봐요.", None),
 ("cnext", {"tone": "playful"}, "다음 실험. 그림책 출판사에 들어간 제로의 첫 일주일. 과연, 고른 길은 정답이 될까요?", None),
 ("thanks", {}, "오늘도 끝까지 함께해 주셔서 고맙습니다. 상식실험실이었습니다.", None),
]
