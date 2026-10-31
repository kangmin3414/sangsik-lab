# 실험 018 · 3주째 결정을 못 하고 있다 — 키르케고르의 이것이냐 저것이냐 (대본 3차, 2026-10-31)
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
#     choice was final; yet people prefer keeping the option to change. (Gilbert's marriage quote dropped in v3.)
#   Levitt 2021 Rev Econ Stud (NBER w22487): ~20,000 online coin tosses on stuck decisions (quit a job, end a relationship);
#     those whom the coin told to make the change were happier six months later. Self-selected participants — say so.
# v3 (2026-10-31): the ending's realisation is tied to the unconscious — we recognise decisions more than we make them.
#   Order on Friday: Regine + "understood backwards" → Damasio (reason alone can't close a choice) → looking back, the
#   signals were already there (the coin's disappointment, the mail never deleted, the childhood picture book) →
#   Freud via Reik → realisation → send → "anxiety is the dizziness of freedom".
#   Damasio, Descartes' Error (1994): a patient with frontal (ventromedial) damage, intact reasoning and blunted emotion spent
#     "the better part of a half-hour" listing pros and cons of two dates for his next visit; told which one, he simply said
#     "That's fine" and left. (Not "thanked" — the line says "좋다며".)
#   Freud as reported by Theodor Reik (Listening with the Third Ear, 1948): minor decisions — weigh pros and cons; vital ones
#     such as the choice of a mate or a profession — "should come from the unconscious, from somewhere within ourselves".
#     Reported speech — say "라이크가 전합니다".
#   Kierkegaard, The Concept of Anxiety (1844): anxiety is the dizziness of freedom. (Anxiety ≠ fear in K.; the line says
#     "떨림/불안", not "두려움".)
#   Caveat line kept: the inner voice is not always right — narrow with the three lines first, then ask the heart.
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
 ("chook", {"k": 1}, "왜 그랬을까요? 답은 180년 전 한 철학자의 실패한 약혼, 그리고 우리 마음 깊은 곳에 숨어 있습니다.", "왜 그랬을까요? 답은 백팔십 년 전 한 철학자의 실패한 약혼, 그리고 우리 마음 깊은 곳에 숨어 있습니다."),
 ("ctitle", {}, "오늘의 실험. 금요일 6시까지, 제로는 길 하나를 고를 수 있을까?", "오늘의 실험. 금요일 여섯 시까지, 제로는 길 하나를 고를 수 있을까?"),
 # ---------- [월] 나는 어떤 사람일까 ----------
 ("cday", {"n": 1, "when": "월요일", "name": "나는 어떤 사람일까"}, "월요일. 먼저, 나는 어떤 사람일까.", None),
 ("cquiz", {"tone": "playful"}, "여러분도 같이 해 보세요. 해당되면 손가락 하나씩 접기.", None),
 ("cquiz", {"k": 1, "quiz": 1, "sfx": "ding"}, "하나. 영화 한 편 보려고 OTT를 켰는데, 고르다가 30분이 지나간다.", "하나. 영화 한 편 보려고 오티티를 켰는데, 고르다가 삼십 분이 지나간다."),
 ("cquiz", {"k": 2, "quiz": 2, "sfx": "ding"}, "둘. 친구 선물 하나 사는 게, 유난히 어렵다.", None),
 ("cquiz", {"k": 3, "quiz": 3, "sfx": "ding"}, "셋. 두 번째로 좋은 건, 절대 싫다.", None),
 ("cquiz", {"k": 4, "segs": [("Z", "…세 개 다요. 어젯밤엔 영화 고르다가 그냥 잤어요.")], "tone": "deadpan"}, "…세 개 다요. 어젯밤엔 영화 고르다가 그냥 잤어요.", None),
 ("cmax", {"study": "Schwartz 외 (2002)"}, "이 질문들은 심리학자 배리 슈워츠 연구팀의 검사에서 따왔습니다. 연구팀은 사람을 둘로 나눴죠.", None),
 ("cmax", {"k": 1}, "모든 걸 비교해 최고를 찾아야 하는 극대화형. 내 기준만 넘으면 고르는 만족형.", None),
 ("cmax", {"k": 2, "pause": 0.3}, "누가 더 행복했을까요? 최고를 찾는 쪽이 오히려 덜 행복했고, 더 자주 후회했고, 더 우울했습니다.", None),
 ("cthree", {"rows": 3, "sfx": "page"}, "그래서 제로는 47줄짜리 표를 접고, 딱 세 줄만 적었습니다. 내가 꼭 지키고 싶은 것. 사람, 배움, 저녁이 있는 삶.", "그래서 제로는 사십칠 줄짜리 표를 접고, 딱 세 줄만 적었습니다. 내가 꼭 지키고 싶은 것. 사람, 배움, 저녁이 있는 삶."),
 ("cthree", {"k": 1, "segs": [("Z", "어? 두 길 다… 세 줄을 통과하네요?")], "tone": "excited"}, "어? 두 길 다… 세 줄을 통과하네요?", None),
 ("cthree", {"k": 2}, "정답은 하나가 아니었습니다. 충분히 좋은 답이, 두 개였을 뿐.", None),
 ("cthree", {"k": 3, "rows": 52, "segs": [("Z", "…그럼 더 어려운 거잖아요!")], "tone": "playful"}, "…그럼 더 어려운 거잖아요!", None),
 # ---------- [화] 철학자의 농담 ----------
 ("cday", {"n": 2, "when": "화요일", "name": "철학자의 농담"}, "화요일. 박사님이 책 한 권을 내밀었습니다.", None),
 ("ckier", {"segs": [("D", "180년 전에, 너랑 똑같은 고민으로 책을 쓴 사람이 있단다.", "백팔십 년 전에, 너랑 똑같은 고민으로 책을 쓴 사람이 있단다.")], "tone": "warm"}, "180년 전에, 너랑 똑같은 고민으로 책을 쓴 사람이 있단다.", "백팔십 년 전에, 너랑 똑같은 고민으로 책을 쓴 사람이 있단다."),
 ("ckier", {"k": 1}, "덴마크의 철학자, 실존주의의 아버지 쇠렌 키르케고르. 책 제목부터, 이것이냐 저것이냐.", None),
 ("ckier", {"k": 2, "pause": 0.3, "sfx": "page"}, "그 책엔 이런 문장이 나옵니다. 결혼하라, 후회할 것이다. 결혼하지 마라, 그래도 후회할 것이다.", None),
 ("ckier", {"k": 3, "tone": "deadpan"}, "결혼하든 안 하든, 너는 후회할 것이다.", None),
 ("ckier", {"k": 4, "segs": [("Z", "아니, 그럼 뭘 하라는 거예요!")], "tone": "playful"}, "아니, 그럼 뭘 하라는 거예요!", None),
 ("ckier", {"k": 5, "segs": [("D", "허허, 그 책을 뒷장까지 읽어야지.")]}, "허허, 그 책을 뒷장까지 읽어야지.", None),
 ("ckier", {"k": 6}, "사실 그건 책 속 인물의 비꼬는 농담이었고, 뒷부분에서 다른 목소리가 이렇게 답합니다.", None),
 ("ckier", {"k": 7, "pause": 0.4, "tone": "warm"}, "선택에서 중요한 건, 옳은 것을 고르는 게 아니다. 얼마나 진지하게, 온 마음으로 고르느냐다.", None),
 # ---------- [수] 도망칠 문 ----------
 ("cday", {"n": 3, "when": "수요일", "name": "도망칠 문 닫기"}, "그런데 수요일, 제로는 꾀를 냅니다.", None),
 ("cdelay", {"sfx": "typing", "tone": "playful"}, "출판사에 보낼 메일. 마감을, 2주만 미뤄 주실 수 있을까요.", "출판사에 보낼 메일. 마감을, 이 주만 미뤄 주실 수 있을까요."),
 ("cdelay", {"k": 1, "segs": [("Z", "문을 둘 다 열어 두면, 언제든 고를 수 있잖아요. 완벽한 작전!")], "tone": "excited"}, "문을 둘 다 열어 두면, 언제든 고를 수 있잖아요. 완벽한 작전!", None),
 ("cdelay", {"k": 2, "segs": [("D", "그것도 선택이란다, 제로야. 아무것도 고르지 않는 선택.")]}, "그것도 선택이란다, 제로야. 아무것도 고르지 않는 선택.", None),
 ("cphoto", {"study": "Gilbert & Ebert (2002)"}, "하버드대 연구팀은 사진 수업 학생들에게, 직접 찍은 사진 두 장 중 한 장만 가져가게 했습니다.", None),
 ("cphoto", {"k": 1}, "한 그룹에겐 며칠 안에 바꿀 수 있다고 했고, 다른 그룹에겐 한 번 고르면 끝이라고 했죠.", None),
 ("cphoto", {"k": 2, "pause": 0.3}, "며칠 뒤, 자기 사진을 더 좋아한 건 바꿀 수 없던 쪽이었습니다. 바꿀 수 있는 쪽은, 자꾸 다른 사진이 떠올랐거든요. 그런데도 사람들은 바꿀 수 있는 쪽을 더 원했죠.", None),
 ("cphoto", {"k": 3}, "열어 둔 문은 편해 보이지만, 그 앞에서 계속 서성이게 만듭니다.", None),
 ("cphoto", {"k": 4, "sfx": "whoosh"}, "제로는 메일을 지웠습니다. 마감은, 그대로 금요일 6시.", "제로는 메일을 지웠습니다. 마감은, 그대로 금요일 여섯 시."),
 ("cphoto", {"k": 5, "rows": 61, "segs": [("Z", "…근데 표는 61줄이 됐어요.")], "tone": "deadpan"}, "…근데 표는 61줄이 됐어요.", "…근데 표는 육십일 줄이 됐어요."),
 # (미드롤 광고 후보: 여기, 약 4:25)
 # ---------- [목] 동전 ----------
 ("cday", {"n": 4, "when": "목요일", "name": "동전 던지기"}, "목요일. 이제 정말, 동전에게 맡기기로 했습니다.", None),
 ("ccoin", {"study": "Levitt (2021)"}, "경제학자 스티븐 레빗은, 큰 결정을 못 내리던 사람들에게 웹사이트에서 동전을 던지게 했습니다. 2만 번이 넘게요.", "경제학자 스티븐 레빗은, 큰 결정을 못 내리던 사람들에게 웹사이트에서 동전을 던지게 했습니다. 이만 번이 넘게요."),
 ("ccoin", {"k": 1}, "회사를 그만둘까, 이 관계를 끝낼까. 동전이 바꿔 보라고 한 사람들은, 여섯 달 뒤 더 행복하다고 답했습니다.", None),
 ("ccoin", {"k": 2}, "물론 스스로 찾아온 사람들이라, 모두에게 그대로 맞진 않아요.", None),
 ("cflip", {"sfx": "coin_flip"}, "앞면이면 출판사. 뒷면이면 회사.", None),
 ("cflip", {"k": 1, "pause": 0.5, "sfx": "heartbeat", "tone": "tense"}, "동전이 공중에서 도는, 그 1초.", "동전이 공중에서 도는, 그 일 초."),
 ("cflip", {"k": 2, "segs": [("Z", "앞면… 제발 앞면…")], "tone": "whisper"}, "앞면… 제발 앞면…", None),
 ("cflip", {"k": 3, "sfx": "coin_land", "pause": 0.4}, "뒷면이었습니다.", None),
 ("cflip", {"k": 4, "segs": [("Z", "…서운해요. 엄청.")], "tone": "tremble"}, "…서운해요. 엄청.", None),
 ("cflip", {"k": 5, "segs": [("D", "그 서운함, 잘 기억해 두렴. 동전은 답을 주는 게 아니라, 네 안에 있던 걸 꺼내 줄 뿐이거든.")], "tone": "warm"}, "그 서운함, 잘 기억해 두렴. 동전은 답을 주는 게 아니라, 네 안에 있던 걸 꺼내 줄 뿐이거든.", None),
 # ---------- [금] 마음이 이미 알던 것 ----------
 ("cday", {"n": 5, "when": "금요일", "name": "마음이 이미 알던 것"}, "금요일, 오후 5시 40분. 아직도 못 정했습니다.", "금요일, 오후 다섯 시 사십 분. 아직도 못 정했습니다."),
 ("cregine", {"tone": "warm"}, "키르케고르도 스물일곱에 레기네와 약혼했다가, 1년 만에 스스로 파혼했습니다.", "키르케고르도 스물일곱에 레기네와 약혼했다가, 일 년 만에 스스로 파혼했습니다."),
 ("cregine", {"k": 1}, "그리고 평생, 그 선택을 돌아보며 글을 썼죠. 마흔둘에 세상을 떠날 때, 유언장엔 그녀의 이름이 있었습니다.", None),
 ("cregine", {"k": 2, "pause": 0.4, "tone": "warm"}, "그가 일기에 남긴 말. 삶은 뒤를 돌아볼 때 이해되지만, 살아가는 건 앞을 향해서다.", None),
 ("cbrain", {"tone": "tense"}, "그런데 제로는 왜, 61줄을 쓰고도 한 걸음을 못 뗄까요?", "그런데 제로는 왜, 육십일 줄을 쓰고도 한 걸음을 못 뗄까요?"),
 ("cbrain", {"k": 1, "study": "Damasio (1994)"}, "신경과학자 다마지오의 한 환자는, 뇌 앞쪽을 다친 뒤 논리는 멀쩡한데 감정이 무뎌졌습니다.", None),
 ("cbrain", {"k": 2}, "다음 방문 날짜 두 개 중 하나를 고르라고 하자, 그는 30분 가까이 장단점만 늘어놓았죠.", "다음 방문 날짜 두 개 중 하나를 고르라고 하자, 그는 삼십 분 가까이 장단점만 늘어놓았죠."),
 ("cbrain", {"k": 3, "segs": [("Z", "…저네요?")], "tone": "deadpan"}, "…저네요?", None),
 ("cbrain", {"k": 4}, "결국 의사가 날짜를 정해 주자, 좋다며 바로 일어섰습니다. 감정이라는 신호가 없으면, 이성은 비교만 하다 끝을 못 낸다는 거예요.", None),
 ("csignal", {"pause": 0.3}, "돌아보면, 제로의 마음은 이미 신호를 보내고 있었습니다.", None),
 ("csignal", {"k": 1, "sfx": "coin_land"}, "동전이 뒷면으로 떨어졌을 때의, 그 서운함.", None),
 ("csignal", {"k": 2}, "3주 동안 매일 다시 열어 본, 출판사의 메일.", "삼 주 동안 매일 다시 열어 본, 출판사의 메일."),
 ("cdrawer", {"sfx": "page"}, "5시 55분. 서랍을 정리하던 제로의 손에, 낡은 공책 한 권이 걸립니다.", "다섯 시 오십오 분. 서랍을 정리하던 제로의 손에, 낡은 공책 한 권이 걸립니다."),
 ("cdrawer", {"k": 1, "tone": "warm"}, "초등학생 제로가 크레파스로 그린 그림책. 제목은, 길을 찾는 작은 제로.", None),
 ("cdrawer", {"k": 2, "segs": [("Z", "…이걸 아직 갖고 있었네.")], "tone": "tremble"}, "…이걸 아직 갖고 있었네.", None),
 ("cdrawer", {"k": 3, "segs": [("D", "제로야, 그건 이번 주에 고른 게 아니란다. 아주 오래전부터, 네 안에 있던 거지.")], "tone": "warm"}, "제로야, 그건 이번 주에 고른 게 아니란다. 아주 오래전부터, 네 안에 있던 거지.", None),
 ("cdeep", {"pause": 0.3, "study": "Reik (1948)"}, "프로이트는 제자 라이크에게 이렇게 말했다고 합니다. 작은 결정은 장단점을 따져 보는 게 좋다. 하지만 배우자나 직업 같은 중요한 일은, 무의식에서, 내 안 깊은 곳에서 나와야 한다.", None),
 ("cdeep", {"k": 1, "pause": 0.6, "tone": "whisper"}, "어쩌면 우리는 결정을 내리는 게 아니라, 마음 깊은 곳에서 이미 내려진 결정을, 알아차리는 건지도 모릅니다.", None),
 ("cdeep", {"k": 2, "tone": "warm"}, "61줄짜리 표는 그 목소리를 덮는 소음이었고, 동전과 서운함과 서랍 속 그림책은, 그 목소리를 꺼내 준 열쇠였죠.", "육십일 줄짜리 표는 그 목소리를 덮는 소음이었고, 동전과 서운함과 서랍 속 그림책은, 그 목소리를 꺼내 준 열쇠였죠."),
 ("cdeep", {"k": 3}, "물론 마음의 소리가 늘 옳진 않아요. 그래서 세 줄로 길을 좁히고, 마지막 한 걸음만 마음에게 묻는 겁니다.", None),
 ("csend", {"sfx": "tick", "tone": "tense"}, "5시 58분.", "다섯 시 오십팔 분."),
 ("csend", {"k": 1, "sfx": "typing", "silent": 2.6}, "제안 감사합니다. 함께하겠습니다.", None),
 ("csend", {"k": 2, "sfx": "send"}, "제로는, 동전과 반대쪽 길을 골랐습니다. 아니, 처음부터 알고 있던 길을.", None),
 ("csend", {"k": 3, "segs": [("Z", "무서워요. 근데… 이상하게 가벼워요.")], "tone": "tremble"}, "무서워요. 근데… 이상하게 가벼워요.", None),
 ("csend", {"k": 4, "tone": "warm"}, "키르케고르는 말했습니다. 불안은, 자유의 현기증이라고. 떨린다는 건, 내가 정말로 고르고 있다는 증거예요.", None),
 ("csend", {"k": 5, "silent": 2.4, "sfx": "ding"}, "환영합니다! 월요일에 뵐게요 :)", None),
 ("csend", {"k": 6, "segs": [("D", "그 길이 정답이 되게 하는 건, 이제부터 네 몫이란다.")], "tone": "warm"}, "그 길이 정답이 되게 하는 건, 이제부터 네 몫이란다.", None),
 ("csend", {"k": 7, "rows": 0, "sfx": "page"}, "그날 밤, 61줄짜리 장단점 표는 처음으로 휴지통에 들어갔습니다.", "그날 밤, 육십일 줄짜리 장단점 표는 처음으로 휴지통에 들어갔습니다."),
 # ---------- 마무리 ----------
 ("crecap", {"tone": "warm"}, "최고 대신 충분히 좋은 세 줄. 도망칠 문은 닫고, 동전으로 마음 꺼내 보기. 마지막 한 걸음은, 이미 알고 있던 내 마음에게.", None),
 ("crecap", {"k": 1, "ask": 1}, "동전이 떨어지는 순간, 앗 하고 서운했던 적 있나요? 그때 마음이 알려 준 답을, 댓글로 들려주세요.", None),
 ("cnext", {"tone": "playful"}, "다음 실험. 그림책 출판사에 들어간 제로의 첫 일주일. 과연, 고른 길은 정답이 될까요?", None),
 ("thanks", {}, "오늘도 끝까지 함께해 주셔서 고맙습니다. 상식실험실이었습니다.", None),
]
