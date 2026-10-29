# 실험 016 · 머리로는 아는데 몸이 안 움직일 때 — 아리스토텔레스의 습관 (대본 1차, 2026-10-29)
# (scene, args, subtitle, spoken-or-None). args["segs"] = [(voice, text[, spoken])...] when a line mixes voices.
# args["silent"] = seconds of silence (no TTS); the text is shown on screen (message / card), not as a subtitle.
# args["study"] = source chip on screen; args["n"/"when"/"name"] = day card (실험 n/5); args["ask"] = comment question card.
# Voices: N narrator, Z Zero, D doctor (박사, 013·014와 같은 할아버지 과학자).
# One image all the way: a dusty guitar. Three years of New Year notes "올해는 꼭 기타" → by Friday Zero plays one
#   clumsy song for 박사. Excellence is not a feeling you wait for; it is what you keep doing.
# Story: Sunday night, the guitar in its case under dust + three yellowed notes → Aristotle named this (akrasia) →
#   the famous quote is not his (Durant) → five days: when-where plan / guitar out of the case / play without waiting for the
#   mood / Thursday he skips (overtime) and nearly quits / Friday a short song for 박사 → "the crown goes to who competes".
# Prop: Greek toga over one shoulder + small hourglass. Length target 8:20–8:40 (≈2,200 chars without spaces at 014's pace).
# Facts (checked 2026-10-29):
#   "We are what we repeatedly do. Excellence, then, is not an act, but a habit" = Will Durant, The Story of Philosophy (1926),
#     summarising Aristotle; not Aristotle's own words.
#   Nicomachean Ethics II.1 (1103a): ēthikē (character/ethics) comes from ethos (habit); we become builders by building,
#     lyre-players by playing, just by doing just acts. VII: akrasia = acting against what one judges best (contra Socrates).
#   NE I.7 (1098a): one swallow does not make a spring, nor one day a happy man.
#   NE I.8 (1099a): at the Olympic Games it is not the finest and strongest who are crowned but those who compete;
#     happiness is an activity (energeia), not a state one merely has.
#   Milne, Orbell & Sheeran 2002 Br J Health Psychol: 248 students, 2 weeks; exercised at least once — control 38%,
#     motivation only 35%, motivation + day/time/place plan 91%. Gollwitzer & Sheeran 2006: 94 tests, d = 0.65.
#   Hagger et al. 2016 Perspect Psychol Sci: ego-depletion multilab replication, 23 labs, N = 2,141, d = 0.04 (n.s.).
#   Hofmann, Baumeister, Förster & Vohs 2012 JPSP: 205 people beeped 7×/day for a week; high trait self-control people
#     reported weaker desires, less conflict and resisted less often — they avoid temptations rather than out-resist them.
#   Behavioural activation (Martell, Addis & Jacobson): act according to a plan, not the mood; motivation often follows action.
#     Used in depression treatment. Do NOT claim dopamine numbers.
#   Lally et al. 2010 Eur J Soc Psychol: 96 volunteers, 12 weeks; median 66 days (18–254); missing one opportunity did not
#     materially affect habit formation.
# Overlap check (001–015): Descartes "책상 위 5분 → 방 전체" (small pieces) — so the 2-minute start is NOT the hero here; Day 3
#   is framed as "plan over mood" instead. No earlier use of akrasia, Durant, Milne, Hagger, Hofmann, Lally.
# Zero's week, the guitar and the song are fiction.
S = [
 # ---------- 먼지 쌓인 기타 ----------
 ("aguitar", {}, "일요일 밤. 제로 방 구석, 먼지 쌓인 기타 케이스.", None),
 ("aguitar", {"k": 1}, "그 위엔 노랗게 바랜 메모 세 장. 3년 동안 1월 1일마다 쓴 같은 다짐이에요. 올해는, 꼭 기타.", "그 위엔 노랗게 바랜 메모 세 장. 삼 년 동안 일월 일일마다 쓴 같은 다짐이에요. 올해는, 꼭 기타."),
 ("aguitar", {"k": 2, "segs": [("Z", "하고 싶은 건 맞는데… 왜 몸이 안 움직이지?")]}, "하고 싶은 건 맞는데… 왜 몸이 안 움직이지?", None),
 ("aname", {}, "머리로는 아는데 몸이 안 움직이는 것. 2,300년 전 아리스토텔레스는 여기에 이름까지 붙였습니다. 아크라시아.", "머리로는 아는데 몸이 안 움직이는 것. 이천삼백 년 전 아리스토텔레스는 여기에 이름까지 붙였습니다. 아크라시아."),
 ("aname", {"k": 1}, "그의 스승의 스승, 소크라테스는 말했습니다. 무엇이 옳은지 정말 안다면, 그렇게 하지 않을 수가 없다고.", None),
 ("aname", {"k": 2}, "아리스토텔레스는 고개를 저었죠. 알면서도 안 하는 일, 우리 삶에 너무 흔하지 않냐고.", None),
 ("aname", {"k": 3}, "그리고 해법도 남겼죠. 오늘의 실험. 아리스토텔레스처럼 닷새를 살면, 제로는 3년 묵은 기타를 칠 수 있을까?", "그리고 해법도 남겼죠. 오늘의 실험. 아리스토텔레스처럼 닷새를 살면, 제로는 삼 년 묵은 기타를 칠 수 있을까?"),
 # ---------- 그 명언, 사실은 ----------
 ("aquote", {}, "그런데 먼저, 아리스토텔레스 하면 떠오르는 이 명언. 탁월함은 행동이 아니라 습관이다.", None),
 ("aquote", {"k": 1, "pause": 0.3}, "사실 그는 이 말을 한 적이 없습니다. 1926년, 미국 작가 윌 듀런트가 그의 생각을 한 줄로 요약한 문장이에요.", "사실 그는 이 말을 한 적이 없습니다. 천구백이십육 년, 미국 작가 윌 듀런트가 그의 생각을 한 줄로 요약한 문장이에요."),
 ("aquote", {"k": 2}, "진짜 아리스토텔레스는 더 단순하게 말했습니다. 우리는 집을 지으면서 건축가가 되고, 악기를 연주하면서 연주자가 된다.", None),
 ("aquote", {"k": 3}, "심지어 윤리라는 뜻의 그리스어 에티케도, 습관을 뜻하는 에토스에서 왔다고 했죠.", None),
 ("aquote", {"k": 4, "segs": [("D", "제로야, 기타리스트가 돼서 기타를 치는 게 아니란다. 치다 보면 되는 거지.")]}, "제로야, 기타리스트가 돼서 기타를 치는 게 아니란다. 치다 보면 되는 거지.", None),
 ("aquote", {"k": 5, "segs": [("Z", "좋아요. 토가도 둘렀으니, 시작!")]}, "좋아요. 토가도 둘렀으니, 시작!", None),
 # ---------- [1일 차] 동기 대신 '언제·어디서' ----------
 ("aday", {"n": 1, "when": "월요일", "name": "동기 대신 언제·어디서"}, "첫째 날. 동기 대신, 언제 어디서.", None),
 ("amotiv", {}, "제로는 먼저 의욕부터 채우기로 했습니다. 기타 고수 영상, 동기 부여 영상, 한 시간째.", None),
 ("amotiv", {"k": 1, "segs": [("Z", "와, 의욕 충전 완료! …근데 벌써 열한 시네.")]}, "와, 의욕 충전 완료! …근데 벌써 열한 시네.", None),
 ("aplan", {"study": "Milne 외 (2002)"}, "영국 연구팀은 대학생 248명을 세 그룹으로 나눠, 2주 동안 운동을 하는지 지켜봤습니다.", "영국 연구팀은 대학생 이백사십팔 명을 세 그룹으로 나눠, 이 주 동안 운동을 하는지 지켜봤습니다."),
 ("aplan", {"k": 1}, "아무것도 안 한 그룹은 38%가 운동을 했습니다. 운동이 왜 좋은지 동기를 북돋운 그룹은, 35%. 오히려 조금 낮았죠.", "아무것도 안 한 그룹은 삼십팔 퍼센트가 운동을 했습니다. 운동이 왜 좋은지 동기를 북돋운 그룹은, 삼십오 퍼센트. 오히려 조금 낮았죠."),
 ("aplan", {"k": 2, "pause": 0.3}, "그런데 언제, 어디서 할지까지 한 줄로 적은 그룹은, 91%가 운동을 했습니다.", "그런데 언제, 어디서 할지까지 한 줄로 적은 그룹은, 구십일 퍼센트가 운동을 했습니다."),
 ("aplan", {"k": 3}, "제로도 메모를 바꿨습니다. 올해는 꼭 기타, 대신 이렇게. 저녁 설거지가 끝나면, 거실 의자에서 기타를 든다.", None),
 ("aplan", {"k": 4, "segs": [("Z", "언제, 어디서… 적고 보니 생각보다 할 만한데요?")]}, "언제, 어디서… 적고 보니 생각보다 할 만한데요?", None),
 # ---------- [2일 차] 의지력 대신 자리 바꾸기 ----------
 ("aday", {"n": 2, "when": "화요일", "name": "의지력 대신 자리 바꾸기"}, "둘째 날. 의지력 대신, 자리 바꾸기.", None),
 ("acase", {}, "설거지는 끝났는데, 기타는 장롱 위 케이스 안. 꺼내러 가는 길이, 오늘따라 멀게만 느껴집니다.", None),
 ("acase", {"k": 1, "segs": [("Z", "오늘은 의지력이 바닥났어. 내일 하자.")]}, "오늘은 의지력이 바닥났어. 내일 하자.", None),
 ("adeplete", {"study": "Hagger 외 (2016)"}, "의지력은 쓰면 닳는 배터리 같다는 이론이 있었습니다. 그런데 23개 연구실, 2,141명이 같은 실험을 다시 해 보니, 그 효과는 거의 0이었어요.", "의지력은 쓰면 닳는 배터리 같다는 이론이 있었습니다. 그런데 스물세 개 연구실, 이천백사십일 명이 같은 실험을 다시 해 보니, 그 효과는 거의 영이었어요."),
 ("aavoid", {"study": "Hofmann 외 (2012)"}, "더 놀라운 건 따로 있습니다. 205명에게 일주일 동안 하루 일곱 번씩, 지금 무엇을 참고 있는지 물어본 연구에서,", "더 놀라운 건 따로 있습니다. 이백오 명에게 일주일 동안 하루 일곱 번씩, 지금 무엇을 참고 있는지 물어본 연구에서,"),
 ("aavoid", {"k": 1, "pause": 0.3}, "자제력이 강한 사람들은 유혹을 더 잘 참는 게 아니라, 참아야 할 순간 자체가 적었습니다. 연구진은 이들이 유혹을 미리 피해 간다고 봤죠.", None),
 ("astand", {}, "제로는 기타를 케이스에서 꺼내, 거실 의자 옆에 세워 두었습니다. 리모컨은 서랍 안으로.", None),
 ("astand", {"k": 1}, "그날 밤, 의자에 앉으니 손이 닿는 자리에 기타가 있었습니다. 의지력은, 거의 필요 없었어요.", None),
 ("astand", {"k": 2, "segs": [("Z", "눈에 보이니까, 지나갈 때마다 자꾸 한 번씩 튕기게 되네요.")]}, "눈에 보이니까, 지나갈 때마다 자꾸 한 번씩 튕기게 되네요.", None),
 # ---------- [3일 차] 기분 대신 계획 ----------
 ("aday", {"n": 3, "when": "수요일", "name": "기분 대신 계획"}, "그런데 셋째 날, 진짜 적이 나타납니다. 기분.", None),
 ("amood", {}, "야근 직전까지 간 하루. 소파에 눕자, 아무것도 하기 싫습니다.", None),
 ("amood", {"k": 1, "segs": [("Z", "오늘은 기분이 영 안 나. 기분 날 때 제대로 치는 게 낫지 않아?")]}, "오늘은 기분이 영 안 나. 기분 날 때 제대로 치는 게 낫지 않아?", None),
 ("aactive", {}, "우울증 치료에도 쓰이는 행동 활성화라는 방법이 있습니다. 핵심은 하나예요. 기분이 아니라, 정해 둔 계획을 따라 움직일 것.", None),
 ("aactive", {"k": 1}, "의욕이 생겨서 움직이는 게 아니라, 움직이고 나면 의욕이 따라오는 경우가 많다는 거죠.", None),
 ("aactive", {"k": 2, "segs": [("D", "마음이 먼저 문을 열어 주진 않는단다. 손이 먼저 문고리를 잡는 거지.")]}, "마음이 먼저 문을 열어 주진 않는단다. 손이 먼저 문고리를 잡는 거지.", None),
 ("aactive", {"k": 3}, "제로는 기분과 상관없이, 기타를 무릎에 올리고 줄 하나만 튕겼습니다. 띵.", None),
 ("aactive", {"k": 4, "pause": 0.3}, "정신 차려 보니, 20분이 지나 있었습니다.", "정신 차려 보니, 이십 분이 지나 있었습니다."),
 ("aactive", {"k": 5, "segs": [("Z", "어? 하기 싫었던 거 맞나?")]}, "어? 하기 싫었던 거 맞나?", None),
 # (미드롤 광고 후보: 여기, 약 4:30)
 # ---------- [4일 차] 하루를 놓친 날 ----------
 ("aday", {"n": 4, "when": "목요일", "name": "하루를 놓친 날"}, "넷째 날. 이번엔 정말 야근이었습니다.", None),
 ("amiss", {}, "밤 열한 시 반. 달력의 목요일 칸이, 처음으로 비었습니다.", None),
 ("amiss", {"k": 1, "segs": [("Z", "망했다. 역시 난 3일이 한계야. 올해도 끝이네.", "망했다. 역시 난 삼 일이 한계야. 올해도 끝이네.")]}, "망했다. 역시 난 3일이 한계야. 올해도 끝이네.", "망했다. 역시 난 삼 일이 한계야. 올해도 끝이네."),
 ("ahabit", {"study": "Lally 외 (2010)"}, "영국 연구팀이 96명에게 새 습관 하나를 정해 12주 동안 지켜봤습니다. 습관이 자리 잡기까지 걸린 날은, 중간값이 66일.", "영국 연구팀이 구십육 명에게 새 습관 하나를 정해 십이 주 동안 지켜봤습니다. 습관이 자리 잡기까지 걸린 날은, 중간값이 육십육 일."),
 ("ahabit", {"k": 1}, "빠른 사람은 18일, 느린 사람은 254일이었죠. 그리고 하루쯤 빼먹어도, 습관이 만들어지는 데 큰 차이는 없었습니다.", "빠른 사람은 십팔 일, 느린 사람은 이백오십사 일이었죠. 그리고 하루쯤 빼먹어도, 습관이 만들어지는 데 큰 차이는 없었습니다."),
 ("ahabit", {"k": 2}, "중요한 건 끊기지 않는 기록이 아니라, 다시 돌아오는 거예요.", None),
 ("aswallow", {}, "아리스토텔레스는 말했습니다. 제비 한 마리가 봄을 만들지 않고, 하루가 사람을 행복하게 만들지도 않는다.", None),
 ("aswallow", {"k": 1, "segs": [("D", "거꾸로도 마찬가지란다, 제로야. 하루 빠졌다고 겨울이 오지는 않아.")]}, "거꾸로도 마찬가지란다, 제로야. 하루 빠졌다고 겨울이 오지는 않아.", None),
 ("aswallow", {"k": 2}, "작심삼일이 무서운 건, 하루를 놓쳐서가 아니라 하루를 놓쳤다고 다 그만둬서입니다. 제로는 목요일 칸에, 내일이라고 적었습니다.", None),
 # ---------- [5일 차] 무대에 서는 사람 ----------
 ("aday", {"n": 5, "when": "금요일", "name": "무대에 서기"}, "다섯째 날. 금요일.", None),
 ("abday", {}, "오늘은 박사님 생신. 제로가 고른 곡은, 닷새 동안 연습한 생일 축하 노래 한 곡입니다.", None),
 ("abday", {"k": 1, "segs": [("Z", "아직 엄청 서툰데… 그냥 다음에 더 잘 치게 되면 들려 드릴까?")]}, "아직 엄청 서툰데… 그냥 다음에 더 잘 치게 되면 들려 드릴까?", None),
 ("acrown", {}, "아리스토텔레스는 이런 말도 남겼습니다. 올림픽에서 월계관을 쓰는 건, 가장 잘생기고 힘센 사람이 아니라 경기에 나선 사람이다.", None),
 ("acrown", {"k": 1}, "행복은 가지고 있는 상태가 아니라, 하고 있는 활동이라는 거죠. 그는 이걸 에네르게이아라고 불렀습니다.", None),
 ("acrown", {"k": 2}, "완벽해질 때까지 기다리면, 무대는 영영 오지 않습니다.", None),
 ("aplay", {}, "제로는 기타를 들고, 박사님 앞에 섰습니다. 코드 두 번 틀리고, 박자 한 번 놓치고.", None),
 ("aplay", {"k": 1, "silent": 3.0}, "♪ 생일 축하합니다 ♪", None),
 ("aplay", {"k": 2, "segs": [("D", "허허… 3년 걸렸구나. 내가 들어 본 생일 노래 중에 제일 좋다.", "허허… 삼 년 걸렸구나. 내가 들어 본 생일 노래 중에 제일 좋다.")]}, "허허… 3년 걸렸구나. 내가 들어 본 생일 노래 중에 제일 좋다.", "허허… 삼 년 걸렸구나. 내가 들어 본 생일 노래 중에 제일 좋다."),
 ("aplay", {"k": 3}, "잘 친 연주는 아니었습니다. 하지만 3년 만에 처음으로, 다짐이 아니라 연주였어요.", "잘 친 연주는 아니었습니다. 하지만 삼 년 만에 처음으로, 다짐이 아니라 연주였어요."),
 # ---------- 메모를 떼다 ----------
 ("anote", {}, "그날 밤, 제로는 노랗게 바랜 메모 세 장을 떼어 냈습니다. 그 자리에 새로 붙인 메모는 한 줄.", None),
 ("anote", {"k": 1, "silent": 2.6}, "저녁 설거지 끝나면, 거실 의자에서.", None),
 ("anote", {"k": 2}, "탁월함이 습관이라는 말은, 아리스토텔레스의 말이 아니었습니다. 하지만 그가 정말 하고 싶었던 말은 이거였죠. 우리는, 우리가 매일 하는 그것이 된다.", None),
 # ---------- 마무리 ----------
 ("arecap", {}, "동기 대신 언제 어디서. 의지력 대신 자리. 기분 대신 계획. 하루를 놓쳐도 다음 날 다시. 그리고 잘하기 전에, 무대에 서기.", None),
 ("arecap", {"k": 1, "ask": 1}, "여러분이 몇 년째 미뤄 둔 다짐은 뭔가요? 언제, 어디서 할지 한 줄로 바꿔서 댓글에 적어 주세요.", None),
 ("thanks", {}, "오늘도 끝까지 함께해 주셔서 고맙습니다. 상식실험실이었습니다.", None),
]
