# 실험 018 · 3주째 결정을 못 하고 있다 — 키르케고르의 이것이냐 저것이냐 (대본 4차, 2026-10-31)
# v4: rewritten for clarity after the operator found v3 hard to follow (weak cause-and-effect, too many studies).
#   One question per day, and each day's answer raises the next day's question:
#     Mon  "나는 왜 못 고를까?"      → maximisers choose worse; three must-haves leave two good options.
#     Tue  "철학자는 뭐라고 했을까?"  → Kierkegaard: choose with your whole heart → "but what is my heart?"
#     Wed  "머리로만 고를 수 있을까?" → Damasio: without feeling, reason never finishes → "why is my heart silent?"
#     Thu  "마음은 뭐라고 할까?"      → the coin: "please, heads" is the answer → "but what if it's just a mood?"
#     Fri  "그 마음, 믿어도 될까?"    → the childhood picture book: it's an old wish, not a mood → decisions are recognised.
#   Studies cut for clarity: Gilbert & Ebert (photos), Levitt (coin study). Lines cut: "dizziness of freedom", pseudonym.
#   Bookend: the opening draft "제안 감사합니다. 함께하겠습니다." is exactly what Zero sends at 5:58 on Friday.
# (scene, args, subtitle, spoken-or-None). args["segs"] = [(voice, text[, spoken])...] when a line mixes voices.
# args["silent"] = seconds of silence (no TTS); the text is shown on screen (message / card), not as a subtitle.
# args["study"] = source chip; args["n"/"when"/"name"] = day card (실험 n/5, name = the day's question);
# args["ask"] = comment question card; args["quiz"] = on-screen self-test item;
# args["rows"] = running-gag counter on the pros/cons sheet (47 → 52 → 61 → 0).
# args["tone"] = TTS delivery cue (Gemini TTS style prompt): tense (조금 빠르고 긴장된), playful (장난스럽고 가벼운),
#   whisper (낮고 조용한), warm (따뜻하고 느린), tremble (살짝 떨리는), excited (들뜬), deadpan (무표정하게 툭).
#   No tone = the episode's default narrator style.
# args["sfx"] = sound cue at the start of the line: tick, typing, ding, whoosh, coin_flip, coin_land, page, heartbeat, send.
# Voices: N narrator, Z Zero, D doctor (박사).
# Facts (checked 2026-10-30/31):
#   Schwartz et al. 2002 JPSP: Maximization Scale; maximizers less happy, more regret (and depression). Quiz items adapted.
#     "최고파 / 충분파" are our plain labels for maximizers / satisficers.
#   Kierkegaard, Either/Or I (1843), Diapsalmata: "Marry, and you will regret it; do not marry, you will also regret it…
#     marry or do not marry, you will regret it either way." Either/Or II (Judge William): what matters in choosing is less
#     choosing the right thing than the energy, earnestness and pathos with which one chooses (paraphrase).
#   Regine Olsen: engaged Sept 1840 (K. 27); he broke it off Oct 1841; Either/Or was written 1841–42, right after.
#     He kept writing about it for the rest of his life; his will named her heir.
#   Journals 1843: life must be understood backwards, but it must be lived forwards.
#   Damasio, Descartes' Error (1994): a patient with ventromedial prefrontal damage, intact reasoning, blunted emotion, asked
#     to pick one of two dates for his next visit, spent "the better part of a half-hour" on pros and cons (other
#     engagements, possible weather…); told which date, he simply said "That's fine" and left. (Say "좋다며", not "고맙다며".)
#   Freud as reported by Theodor Reik, Listening with the Third Ear (1948): minor decisions — weigh pros and cons; vital
#     ones such as a mate or a profession — should come from the unconscious. Reported speech: "했다고 전해지는 말".
# Overlap check (001–017): no lunch menu, no "548 graduates" (007), no inaction-regret study (005); Damasio, Freud,
#   the unconscious were never used before (grep 2026-10-31).
# Zero's offer, the publisher and the week are fiction. The series teaser (019: Zero's first week at the publisher) is a
#   promise to keep — plan 019 accordingly, or cut the cnext line before production.
OUTLINE = [
    ("월", "나는 왜 못 고를까?", "최고만 찾으면 더 못 고르고 더 후회한다. 꼭 지킬 세 가지로 좁혔더니, 두 길 다 괜찮았다."),
    ("화", "철학자는 뭐라고 했을까?", "키르케고르: 어느 쪽이 옳은지보다, 온 마음으로 고르는 게 중요하다. → 그런데 내 진심은 뭐지?"),
    ("수", "머리로만 고를 수 있을까?", "감정이 없으면 날짜 하나도 못 고른다. 마지막 버튼은 마음이 누른다. → 그런데 내 마음은 왜 조용하지?"),
    ("목", "마음은 뭐라고 할까?", "동전이 공중에 있을 때 '제발 앞면'. 그게 마음의 답. → 그런데 그냥 오늘 기분이면?"),
    ("금", "그 마음, 믿어도 될까?", "아홉 살 때 그린 그림책. 하루 기분이 아니라 오래된 마음이었다. 결정은 만드는 게 아니라 알아차리는 것."),
]
S = [
 # ---------- 0:00 첫 장면 ----------
 ("cmail", {"sfx": "tick", "tone": "tense"}, "보내기 버튼 위에서, 손가락이 3주째 멈춰 있습니다.", "보내기 버튼 위에서, 손가락이 삼 주째 멈춰 있습니다."),
 ("cmail", {"k": 1, "segs": [("Z", "보낼까… 말까… 보낼까…")], "tone": "whisper"}, "보낼까… 말까… 보낼까…", None),
 ("cmail", {"k": 2}, "출판사에 보낼 답장은 딱 한 줄. 제안 감사합니다, 함께하겠습니다.", None),
 ("cfork", {"sfx": "whoosh"}, "작은 그림책 출판사에서 온 제안. 제로가 어릴 때부터 꿈꾸던 일이죠.", None),
 ("cfork", {"k": 1}, "하지만 지금 회사는, 7년을 다닌 안정된 곳.", "하지만 지금 회사는, 칠 년을 다닌 안정된 곳."),
 ("cfork", {"k": 2, "silent": 2.0, "sfx": "ding"}, "답장 마감: 이번 주 금요일 오후 6시", None),
 ("cfork", {"k": 3, "rows": 47, "segs": [("Z", "장단점을 47줄이나 썼는데… 쓸수록 더 모르겠어요.", "장단점을 사십칠 줄이나 썼는데… 쓸수록 더 모르겠어요.")], "tone": "playful"}, "장단점을 47줄이나 썼는데… 쓸수록 더 모르겠어요.", "장단점을 사십칠 줄이나 썼는데… 쓸수록 더 모르겠어요."),
 ("chook", {}, "목요일, 동전 하나가 '회사'를 골라 줍니다. 그런데 금요일, 제로는 반대쪽 길을 고르죠.", None),
 ("chook", {"k": 1}, "닷새 동안, 제로는 무엇을 알게 된 걸까요?", None),
 ("ctitle", {}, "오늘의 실험. 금요일 6시까지, 제로는 길 하나를 고를 수 있을까?", "오늘의 실험. 금요일 여섯 시까지, 제로는 길 하나를 고를 수 있을까?"),
 # ---------- [월] 나는 왜 못 고를까? ----------
 ("cday", {"n": 1, "when": "월요일", "name": "나는 왜 못 고를까?"}, "월요일. 먼저, 나는 왜 못 고르는 걸까?", None),
 ("cquiz", {"tone": "playful"}, "같이 해 봐요. 해당되면 손가락 하나씩 접기.", None),
 ("cquiz", {"k": 1, "quiz": 1, "sfx": "ding"}, "하나. OTT에서 볼 영화를 고르다가, 30분이 지나간다.", "하나. 오티티에서 볼 영화를 고르다가, 삼십 분이 지나간다."),
 ("cquiz", {"k": 2, "quiz": 2, "sfx": "ding"}, "둘. 친구 선물 하나 사는 게, 유난히 어렵다.", None),
 ("cquiz", {"k": 3, "quiz": 3, "sfx": "ding"}, "셋. 두 번째로 좋은 건, 절대 싫다.", None),
 ("cquiz", {"k": 4, "segs": [("Z", "…세 개 다요. 어젯밤엔 영화 고르다가 그냥 잤어요.")], "tone": "deadpan"}, "…세 개 다요. 어젯밤엔 영화 고르다가 그냥 잤어요.", None),
 ("cmax", {"study": "Schwartz 외 (2002)"}, "이 질문들은 미국 심리학자 배리 슈워츠 연구팀의 검사에서 따왔습니다.", None),
 ("cmax", {"k": 1}, "연구팀은 사람을 둘로 나눴어요. 끝까지 최고를 찾는 최고파. 내 기준만 넘으면 고르는 충분파.", None),
 ("cmax", {"k": 2, "pause": 0.3}, "누가 더 행복했을까요? 최고파가 오히려 덜 행복했고, 더 자주 후회했습니다.", None),
 ("cmax", {"k": 3}, "최고를 찾느라 지쳐서, 고른 걸 즐길 힘이 안 남는 거죠.", None),
 ("cmax", {"k": 4, "segs": [("Z", "저… 완전 최고파네요.")], "tone": "deadpan"}, "저… 완전 최고파네요.", None),
 ("cthree", {"segs": [("D", "그럼 최고 말고, 꼭 지키고 싶은 것 세 개만 적어 보렴.")], "tone": "warm"}, "그럼 최고 말고, 꼭 지키고 싶은 것 세 개만 적어 보렴.", None),
 ("cthree", {"k": 1, "rows": 3, "sfx": "page"}, "제로가 적은 세 줄. 사람, 배움, 저녁이 있는 삶.", None),
 ("cthree", {"k": 2, "segs": [("Z", "어? 두 길 다… 세 개를 다 통과하는데요?")], "tone": "excited"}, "어? 두 길 다… 세 개를 다 통과하는데요?", None),
 ("cthree", {"k": 3}, "둘 다 충분히 좋은 길이었던 거예요. 머리로 따져서는, 더 이상 가릴 수가 없었죠.", None),
 ("cthree", {"k": 4, "rows": 52, "segs": [("Z", "…그럼 더 어려운 거잖아요!")], "tone": "playful"}, "…그럼 더 어려운 거잖아요!", None),
 # ---------- [화] 철학자는 뭐라고 했을까? ----------
 ("cday", {"n": 2, "when": "화요일", "name": "철학자는 뭐라고 했을까?"}, "화요일. 박사님이 책 한 권을 내밀었습니다.", None),
 ("ckier", {"segs": [("D", "180년 전에도, 너처럼 고민한 사람이 있었단다.", "백팔십 년 전에도, 너처럼 고민한 사람이 있었단다.")], "tone": "warm"}, "180년 전에도, 너처럼 고민한 사람이 있었단다.", "백팔십 년 전에도, 너처럼 고민한 사람이 있었단다."),
 ("ckier", {"k": 1}, "덴마크의 철학자, 키르케고르. 그가 쓴 책 제목이 바로, 이것이냐 저것이냐.", None),
 ("ckier", {"k": 2, "pause": 0.3, "sfx": "page"}, "그 책엔 이런 문장이 있어요. 결혼해도 후회하고, 안 해도 후회한다.", None),
 ("ckier", {"k": 3, "tone": "deadpan"}, "어느 쪽이든, 너는 후회할 것이다.", None),
 ("ckier", {"k": 4, "segs": [("Z", "아니, 그럼 뭘 하라는 거예요!")], "tone": "playful"}, "아니, 그럼 뭘 하라는 거예요!", None),
 ("cregine", {"tone": "warm"}, "그런데 이건 그냥 농담이 아니었습니다. 키르케고르는 스물일곱에 약혼했다가, 1년 만에 스스로 파혼했거든요.", "그런데 이건 그냥 농담이 아니었습니다. 키르케고르는 스물일곱에 약혼했다가, 일 년 만에 스스로 파혼했거든요."),
 ("cregine", {"k": 1}, "이 책은 그 파혼 직후에 쓴 책이에요. 그리고 그는 평생, 그 선택을 돌아보며 글을 썼습니다.", None),
 ("cwill", {"segs": [("D", "그런데 이 책 뒷부분엔, 다른 목소리가 나온단다.")]}, "그런데 이 책 뒷부분엔, 다른 목소리가 나온단다.", None),
 ("cwill", {"k": 1, "pause": 0.4, "tone": "warm"}, "어느 쪽이 옳은지보다 중요한 건, 얼마나 진지하게, 온 마음을 다해 고르느냐다.", None),
 ("cwill", {"k": 2, "segs": [("Z", "온 마음으로… 근데 제 진심이 뭔지를 모르겠다고요.")], "tone": "whisper"}, "온 마음으로… 근데 제 진심이 뭔지를 모르겠다고요.", None),
 ("cwill", {"k": 3, "rows": 61, "tone": "playful"}, "그날 밤, 제로는 표에 '진심 항목'을 추가했습니다. 61줄이 됐죠.", "그날 밤, 제로는 표에 진심 항목을 추가했습니다. 육십일 줄이 됐죠."),
 ("cwill", {"k": 4}, "그래서 남은 사흘, 제로는 자기 진심을 찾아 나섭니다.", None),
 # ---------- [수] 머리로만 고를 수 있을까? ----------
 ("cday", {"n": 3, "when": "수요일", "name": "머리로만 고를 수 있을까?"}, "수요일. 박사님이 이상한 이야기를 꺼냅니다.", None),
 ("cbrain", {"study": "Damasio (1994)"}, "뇌과학자 안토니오 다마지오가 만난, 한 환자가 있었어요.", None),
 ("cbrain", {"k": 1}, "뇌 앞쪽을 다친 뒤, 머리는 멀쩡한데 감정을 거의 못 느끼게 된 사람이었죠.", None),
 ("cbrain", {"k": 2}, "다음에 올 날짜를, 두 개 중에 하나 골라 달라고 하자", None),
 ("cbrain", {"k": 3}, "그는 30분 가까이 장단점만 늘어놓았습니다. 다른 약속은 없는지, 날씨는 어떨지…", "그는 삼십 분 가까이 장단점만 늘어놓았습니다. 다른 약속은 없는지, 날씨는 어떨지…"),
 ("cbrain", {"k": 4, "segs": [("Z", "…저네요?")], "tone": "deadpan"}, "…저네요?", None),
 ("cbrain", {"k": 5}, "결국 의사가 날짜를 골라 주자, 그는 좋다며 바로 일어섰습니다.", None),
 ("cbrain", {"k": 6, "pause": 0.3, "tone": "warm"}, "다마지오의 결론은 이렇습니다. 감정은 결정을 방해하는 게 아니라, 결정을 끝내 주는 신호다.", None),
 ("cbrain", {"k": 7}, "머리는 비교를 하고, 마지막 버튼은 마음이 누르는 거예요.", None),
 ("cbrain", {"k": 8, "segs": [("Z", "그럼 제 마음은, 왜 아무 말도 안 해요?")]}, "그럼 제 마음은, 왜 아무 말도 안 해요?", None),
 ("cbrain", {"k": 9, "segs": [("D", "하고 있단다. 네가 표를 쓰느라 못 듣는 거지. 내일은 그 소리를 들어 보자.")], "tone": "warm"}, "하고 있단다. 네가 표를 쓰느라 못 듣는 거지. 내일은 그 소리를 들어 보자.", None),
 # (미드롤 광고 후보: 여기, 약 4:45)
 # ---------- [목] 마음은 뭐라고 할까? ----------
 ("cday", {"n": 4, "when": "목요일", "name": "마음은 뭐라고 할까?"}, "목요일. 박사님이 동전 하나를 건넸습니다.", None),
 ("cflip", {"segs": [("D", "앞면이면 출판사, 뒷면이면 회사.")]}, "앞면이면 출판사, 뒷면이면 회사.", None),
 ("cflip", {"k": 1, "segs": [("Z", "동전으로 인생을 정하라고요?")], "tone": "playful"}, "동전으로 인생을 정하라고요?", None),
 ("cflip", {"k": 2, "segs": [("D", "아니. 동전이 공중에 떠 있는 동안, 네가 어느 쪽을 바라는지 보라는 거야.")], "tone": "warm"}, "아니. 동전이 공중에 떠 있는 동안, 네가 어느 쪽을 바라는지 보라는 거야.", None),
 ("cflip", {"k": 3, "pause": 0.5, "sfx": "coin_flip", "tone": "tense"}, "동전이 공중에서 도는, 그 1초.", "동전이 공중에서 도는, 그 일 초."),
 ("cflip", {"k": 4, "segs": [("Z", "앞면… 제발 앞면…")], "tone": "whisper", "sfx": "heartbeat"}, "앞면… 제발 앞면…", None),
 ("cflip", {"k": 5, "sfx": "coin_land", "pause": 0.4}, "뒷면. 회사였습니다.", None),
 ("cflip", {"k": 6, "segs": [("Z", "…서운해요. 엄청.")], "tone": "tremble"}, "…서운해요. 엄청.", None),
 ("cflip", {"k": 7, "segs": [("D", "방금 제발 앞면이라고 했지? 그게 네 마음이란다. 동전은 답을 정해 주는 게 아니라, 이미 있던 답을 꺼내 줄 뿐이야.")], "tone": "warm"}, "방금 '제발 앞면'이라고 했지? 그게 네 마음이란다. 동전은 답을 정해 주는 게 아니라, 이미 있던 답을 꺼내 줄 뿐이야.", None),
 ("cflip", {"k": 8, "segs": [("Z", "근데요… 이게 그냥 오늘 기분이면요? 기분으로 인생을 정해도 돼요?")], "tone": "tense"}, "근데요… 이게 그냥 오늘 기분이면요? 기분으로 인생을 정해도 돼요?", None),
 ("cflip", {"k": 9}, "그날도 제로는, 보내기를 누르지 못했습니다.", None),
 # ---------- [금] 그 마음, 믿어도 될까? ----------
 ("cday", {"n": 5, "when": "금요일", "name": "그 마음, 믿어도 될까?"}, "금요일, 오후 5시 40분. 마감까지 20분.", "금요일, 오후 다섯 시 사십 분. 마감까지 이십 분."),
 ("cdrawer", {"segs": [("D", "제로야, 어릴 때 제일 오래 붙잡고 놀던 게 뭐였니?")], "tone": "warm"}, "제로야, 어릴 때 제일 오래 붙잡고 놀던 게 뭐였니?", None),
 ("cdrawer", {"k": 1, "sfx": "page"}, "제로는 책상 맨 아래 서랍을 열었습니다. 낡은 공책 한 권.", None),
 ("cdrawer", {"k": 2, "tone": "warm"}, "아홉 살 제로가 크레파스로 그린 그림책. 제목은, 길을 찾는 작은 제로.", None),
 ("cdrawer", {"k": 3, "segs": [("Z", "…이걸 아직 갖고 있었네.")], "tone": "tremble"}, "…이걸 아직 갖고 있었네.", None),
 ("cdrawer", {"k": 4}, "동전 앞에서 느낀 서운함은, 하루 기분이 아니었습니다. 이십 년 넘게, 제로 안에 조용히 있던 마음이었죠.", None),
 ("cdeep", {"study": "Reik (1948)"}, "프로이트가 제자에게 했다고 전해지는 말이 있습니다.", None),
 ("cdeep", {"k": 1, "pause": 0.3}, "작은 일은 장단점을 따져서 정하라. 하지만 직업이나 결혼처럼 인생이 걸린 일은, 마음 깊은 곳에서 나오게 하라.", None),
 ("cdeep", {"k": 2, "pause": 0.6, "tone": "whisper"}, "어쩌면 결정은, 머리로 새로 만드는 게 아니라, 마음속에 이미 있던 답을 알아차리는 일인지도 모릅니다.", None),
 ("cdeep", {"k": 3, "tone": "warm"}, "61줄짜리 표는 그 답을 덮고 있었고, 동전 한 번이 그 답을 꺼내 준 거죠.", "육십일 줄짜리 표는 그 답을 덮고 있었고, 동전 한 번이 그 답을 꺼내 준 거죠."),
 ("cdeep", {"k": 4}, "물론 마음이 늘 옳은 건 아니에요. 그래서 순서가 중요합니다. 머리로 충분히 좋은 길을 추리고, 마지막 하나는 마음에게 묻기.", None),
 ("cdeep", {"k": 5, "pause": 0.3, "tone": "warm"}, "키르케고르는 일기에 이렇게 썼습니다. 삶은 뒤를 돌아볼 때 이해되지만, 살아가는 건 앞을 향해서다.", None),
 ("cdeep", {"k": 6}, "어느 길이 정답인지는, 걸어 본 뒤에야 압니다. 지금 할 수 있는 건, 마음이 가리키는 쪽으로 걷는 것.", None),
 ("csend", {"sfx": "tick", "tone": "tense"}, "5시 58분.", "다섯 시 오십팔 분."),
 ("csend", {"k": 1, "sfx": "send"}, "3주 동안 못 누르던 버튼을, 제로가 눌렀습니다.", "삼 주 동안 못 누르던 버튼을, 제로가 눌렀습니다."),
 ("csend", {"k": 2, "segs": [("Z", "무서워요. 근데… 이상하게 가벼워요.")], "tone": "tremble"}, "무서워요. 근데… 이상하게 가벼워요.", None),
 ("csend", {"k": 3, "segs": [("D", "무서운 건, 진짜로 골랐다는 뜻이란다.")], "tone": "warm"}, "무서운 건, 진짜로 골랐다는 뜻이란다.", None),
 ("csend", {"k": 4, "silent": 2.4, "sfx": "ding"}, "환영합니다! 월요일에 뵐게요 :)", None),
 ("csend", {"k": 5, "rows": 0, "sfx": "page"}, "그날 밤, 61줄짜리 장단점 표는 휴지통으로 들어갔습니다.", "그날 밤, 육십일 줄짜리 장단점 표는 휴지통으로 들어갔습니다."),
 # ---------- 마무리 ----------
 ("crecap", {"tone": "warm"}, "최고 말고, 충분히 좋은 길을 추리기. 그리고 마지막 한 걸음은, 동전이 떨어지는 순간의 내 마음에게.", None),
 ("crecap", {"k": 1, "ask": 1}, "여러분도 동전이 떨어지는 순간, 서운했던 적 있나요? 그때 마음이 알려 준 답을, 댓글로 들려주세요.", None),
 ("cnext", {"tone": "playful"}, "다음 실험. 그림책 출판사에 들어간 제로의 첫 일주일. 과연, 고른 길은 정답이 될까요?", None),
 ("thanks", {}, "오늘도 끝까지 함께해 주셔서 고맙습니다. 상식실험실이었습니다.", None),
]
