# 시즌 1 · 1편 · 회식 2차, 아무도 가고 싶지 않았다 (대본 1차, 2026-11-01)
# Story-only format — follow FORMAT.md. No explaining narration: the narrator gives time, place and what people do or
#   think; the idea is carried by events, one line from the doctor, and the ending action.
# (scene, args, subtitle, spoken-or-None). args["segs"] = [(voice, text[, spoken])...] for character lines.
# args["silent"] = seconds with no TTS; the text is shown on screen (phone message, app, card).
# args["count"] = on-screen counter "집에 가고 싶은 사람 n/5" (the running device of this episode; hidden when absent).
# args["tone"]: tense, playful, whisper, warm, tremble, excited, deadpan, tired.  args["sfx"]: tick, ding, whoosh, page,
#   heartbeat, send, door, mic_feedback, music_stop, tambourine, crowd_laugh, subway.
# Voices (fix once, reuse all season):
#   N narrator · Z 제로 (34, 대리 7년 차) · D 박사 (78, 옆집) · T 오 팀장 (49, 남, 낮고 서글서글)
#   P 박 과장 (41, 여, 빠르고 다정, 아이 둘) · H 한 주임 (31, 남, 밝은 하이톤 / 화장실에선 지친 목소리)
#   M 민지 (25, 여, 입사 두 달 차, 조심스러운 말투)
# Hidden ingredients (never said in the video; put in the description as "이 이야기에 숨은 이야기"):
#   Prentice & Miller (1993), J. Personality and Social Psychology 64(2): pluralistic ignorance — students privately
#     less comfortable with campus drinking than they believed the average student was; everyone conformed to a norm
#     few privately held. Here: five people each think the others want the second round.
#   Kierkegaard, "That Individual" (The Point of View, 1846/1859): "the crowd is untruth" — the doctor's line, unnamed.
# Do not show song lyrics on screen or in TTS (copyright). Singing is shown with music notes only.
TITLE = "회식 2차, 아무도 가고 싶지 않았다"
OUTLINE = [
    ("1막", "10시 40분의 노래방 / 세 시간 전 고깃집", "다섯 명 모두 집에 가고 싶다. 그런데 1.5초의 정적 뒤, 모두 '좋아요'라고 한다."),
    ("2막", "화장실 · 편의점 앞 · 복도 · 비상계단", "한 명씩 '사실 나도…'. 그런데 다들 '남들은 좋아하니까'라고 믿는다. 팀장마저."),
    ("3막", "11시 38분, 연장 직전", "제로가 처음으로 '먼저 들어가 볼게요'. 네 명이 일어서고, 팀장이 웃는다. '사실 나도야.'"),
    ("끝", "자정의 벤치 · 다음 날 메신저", "박사의 한마디. 아직 못 보낸 메일 하나. 그리고 아무도 손을 들지 않은 2차 투표."),
]
S = [
 # ---------- 0:00 첫 장면 ----------
 ("hroom", {"sfx": "tick", "tone": "whisper"}, "밤 10시 40분. 노래방 5번 방.", "밤 열 시 사십 분. 노래방 오 번 방."),
 ("hroom", {"k": 1}, "이 방의 다섯 명은, 모두 같은 생각을 하고 있었습니다.", None),
 ("hroom", {"k": 2, "pause": 0.6, "tone": "whisper"}, "집에 가고 싶다.", None),
 ("hroom", {"k": 3, "tone": "whisper"}, "그리고 아무도, 그걸 몰랐습니다.", None),
 ("ctitle", {"silent": 2.2}, "회식 2차, 아무도 가고 싶지 않았다", None),
 # ---------- 1막 · 고깃집 ----------
 ("hgogi", {"sfx": "whoosh"}, "세 시간 전. 회사 앞 고깃집.", None),
 ("hgogi", {"k": 1, "segs": [("T", "자, 다들 고생 많았다! 분기 마감 끝!")], "tone": "excited"}, "자, 다들 고생 많았다! 분기 마감 끝!", None),
 ("hgogi", {"k": 2}, "7년 차 대리 제로는, 회식 자리에선 늘 집게를 잡습니다.", "칠 년 차 대리 제로는, 회식 자리에선 늘 집게를 잡습니다."),
 ("hgogi", {"k": 3, "segs": [("Z", "…아홉 시엔 끝나겠지.")], "tone": "whisper"}, "…아홉 시엔 끝나겠지.", None),
 ("hgogi", {"k": 4, "segs": [("H", "팀장님, 여기 소주 한 병 더요!")], "tone": "excited"}, "팀장님, 여기 소주 한 병 더요!", None),
 ("hgogi", {"k": 5}, "분위기는 늘 한 주임 담당.", None),
 ("hgogi", {"k": 6, "segs": [("P", "아, 네네! 고기 진짜 맛있다.")]}, "아, 네네! 고기 진짜 맛있다.", None),
 ("hgogi", {"k": 7}, "테이블 밑으로 휴대폰을 자꾸 보는, 아이 둘 엄마 박 과장.", None),
 ("hgogi", {"k": 8, "segs": [("M", "저, 저도 한 잔 주세요!")], "tone": "tremble"}, "저, 저도 한 잔 주세요!", None),
 ("hgogi", {"k": 9}, "그리고 오늘이 첫 회식인, 입사 두 달 차 막내 민지.", None),
 ("hgogi", {"k": 10, "sfx": "ding"}, "그때, 테이블 위 팀장의 휴대폰에 알림이 떴습니다. 팀장은 화면을 보더니, 휴대폰을 조용히 뒤집어 놓았습니다.", None),
 ("hgogi", {"k": 11, "segs": [("T", "자, 먹어 먹어! 오늘은 내가 쏜다!")], "tone": "excited"}, "자, 먹어 먹어! 오늘은 내가 쏜다!", None),
 ("hsecond", {"sfx": "tick", "tone": "tense"}, "밤 9시 50분. 마지막 고기가 불판에서 내려올 때쯤.", "밤 아홉 시 오십 분. 마지막 고기가 불판에서 내려올 때쯤."),
 ("hsecond", {"k": 1, "segs": [("T", "자, 2차 가야지?", "자, 이 차 가야지?")], "tone": "playful"}, "자, 2차 가야지?", "자, 이 차 가야지?"),
 ("hsecond", {"k": 2, "silent": 1.6, "sfx": "heartbeat"}, "…", None),
 ("hsecond", {"k": 3, "segs": [("H", "가시죠, 팀장님!")], "tone": "excited"}, "가시죠, 팀장님!", None),
 ("hsecond", {"k": 4, "segs": [("P", "…좋죠!"), ("M", "네, 좋아요!")]}, "…좋죠! / 네, 좋아요!", None),
 ("hsecond", {"k": 5, "count": 1, "segs": [("Z", "…네.")], "tone": "deadpan"}, "…네.", None),
 ("hinner", {"pause": 0.3}, "노래방까지 걸어가는 5분. 다섯 개의 머릿속은 이랬습니다.", "노래방까지 걸어가는 오 분. 다섯 개의 머릿속은 이랬습니다."),
 ("hinner", {"k": 1, "segs": [("P", "둘째가 열이 난다고 했는데…")], "tone": "whisper"}, "둘째가 열이 난다고 했는데…", None),
 ("hinner", {"k": 2, "segs": [("M", "막차가 11시 52분인데…", "막차가 열한 시 오십이 분인데…")], "tone": "whisper"}, "막차가 11시 52분인데…", "막차가 열한 시 오십이 분인데…"),
 ("hinner", {"k": 3, "segs": [("H", "오늘도 내가 띄워야겠지…")], "tone": "tired"}, "오늘도 내가 띄워야겠지…", None),
 ("hinner", {"k": 4, "segs": [("Z", "써 놓은 메일, 오늘은 보내려고 했는데…")], "tone": "whisper"}, "써 놓은 메일, 오늘은 보내려고 했는데…", None),
 ("hinner", {"k": 5, "pause": 0.4}, "팀장의 머릿속만은, 보이지 않았습니다.", None),
 # ---------- 2막 · 노래방 ----------
 ("hsing", {"sfx": "mic_feedback"}, "노래방 5번 방. 첫 곡은 언제나처럼 한 주임.", "노래방 오 번 방. 첫 곡은 언제나처럼 한 주임."),
 ("hsing", {"k": 1, "tone": "playful"}, "넥타이를 머리에 두르고, 목이 터져라 부릅니다.", None),
 ("hsing", {"k": 2}, "박 과장은 박수. 민지는 리모컨. 제로는 음료수 주문.", None),
 ("hsing", {"k": 3, "pause": 0.4}, "테이블 위 탬버린은, 아무도 들지 않았습니다.", None),
 ("hwash", {"sfx": "door"}, "10시 20분. 화장실 세면대 앞.", "열 시 이십 분. 화장실 세면대 앞."),
 ("hwash", {"k": 1}, "거울 속 한 주임의 얼굴에서, 웃음이 싹 사라져 있었습니다.", None),
 ("hwash", {"k": 2, "segs": [("H", "형… 저 사실 노래방 진짜 싫어해요.")], "tone": "tired"}, "형… 저 사실 노래방 진짜 싫어해요.", None),
 ("hwash", {"k": 3, "segs": [("Z", "…뭐? 너 아까 제일 신났잖아.")], "tone": "excited"}, "…뭐? 너 아까 제일 신났잖아.", None),
 ("hwash", {"k": 4, "segs": [("H", "제가 안 하면 분위기 죽잖아요. 다들 좋아하시니까.")], "tone": "tired"}, "제가 안 하면 분위기 죽잖아요. 다들 좋아하시니까.", None),
 ("hwash", {"k": 5, "count": 2, "segs": [("Z", "…다들?")], "tone": "deadpan"}, "…다들?", None),
 ("hwash", {"k": 6}, "제로는 아무 말도 못 했습니다. 자기도 아까, 꽤 즐거워 보였을 테니까요.", None),
 ("hwash", {"k": 7, "tone": "playful"}, "방으로 돌아간 한 주임은, 다시 넥타이를 머리에 둘렀습니다. 그리고 아까보다 더 신나는 노래를 골랐습니다.", None),
 ("hstore", {"sfx": "ding"}, "10시 35분. 음료수를 사러 나간 편의점 앞.", "열 시 삼십오 분. 음료수를 사러 나간 편의점 앞."),
 ("hstore", {"k": 1, "segs": [("P", "응, 엄마 금방 갈게. 약 먹고 먼저 자고 있어…")], "tone": "whisper"}, "응, 엄마 금방 갈게. 약 먹고 먼저 자고 있어…", None),
 ("hstore", {"k": 2, "tone": "whisper"}, "전화를 끊은 박 과장은, 숨을 한 번 고르더니, 다시 웃는 얼굴을 만들었습니다.", None),
 ("hstore", {"k": 3, "segs": [("Z", "과장님, 먼저 들어가셔도 될 것 같은데요.")]}, "과장님, 먼저 들어가셔도 될 것 같은데요.", None),
 ("hstore", {"k": 4, "count": 3, "segs": [("P", "에이, 팀장님이 2차 엄청 좋아하시잖아. 막내도 저렇게 신났는데, 내가 먼저 빠지면 좀 그렇지.", "에이, 팀장님이 이 차 엄청 좋아하시잖아. 막내도 저렇게 신났는데, 내가 먼저 빠지면 좀 그렇지.")]}, "에이, 팀장님이 2차 엄청 좋아하시잖아. 막내도 저렇게 신났는데, 내가 먼저 빠지면 좀 그렇지.", None),
 ("hmin", {}, "10시 50분. 방으로 돌아오니, 민지가 테이블 아래로 휴대폰을 보고 있었습니다.", "열 시 오십 분. 방으로 돌아오니, 민지가 테이블 아래로 휴대폰을 보고 있었습니다."),
 ("hmin", {"k": 1, "silent": 2.0}, "지하철 앱 · 막차 23:52 · 남은 시간 1시간 2분", None),
 ("hmin", {"k": 2, "segs": [("Z", "민지 씨, 막차 괜찮아요?")], "tone": "whisper"}, "민지 씨, 막차 괜찮아요?", None),
 ("hmin", {"k": 3, "pause": 0.4, "count": 4, "segs": [("M", "아, 괜찮아요! 다들 너무 즐거워 보여서요… 저만 집에 가고 싶은 것 같아서.")], "tone": "tremble"}, "아, 괜찮아요! 다들 너무 즐거워 보여서요… 저만 집에 가고 싶은 것 같아서.", None),
 ("hmin", {"k": 4}, "다들 좋아하니까. 오늘 밤, 제로가 세 번째로 들은 말이었습니다.", None),
 ("hstair", {"sfx": "door"}, "11시 10분. 바람을 쐬러 나간 비상계단.", "열한 시 십 분. 바람을 쐬러 나간 비상계단."),
 ("hstair", {"k": 1}, "거기, 넥타이를 푼 팀장이 혼자 앉아 있었습니다.", None),
 ("hstair", {"k": 2, "silent": 2.4}, "딸 · 아빠 오늘 내 생일인 거 안 잊었지? 🎂 12시 전엔 와", None),
 ("hstair", {"k": 3, "pause": 0.5, "segs": [("T", "어, 제로구나. 딸내미가 오늘 생일이라서.")], "tone": "tired"}, "어, 제로구나. 딸내미가 오늘 생일이라서.", None),
 ("hstair", {"k": 4, "segs": [("Z", "…그럼 2차는 왜…", "…그럼 이 차는 왜…")]}, "…그럼 2차는 왜…", "…그럼 이 차는 왜…"),
 ("hstair", {"k": 5, "segs": [("T", "나 신입 때는 말이야, 2차 안 가면 팀장님이 서운해하셨거든. 그게 팀장이 해야 하는 일인 줄 알았지.", "나 신입 때는 말이야, 이 차 안 가면 팀장님이 서운해하셨거든. 그게 팀장이 해야 하는 일인 줄 알았지.")], "tone": "warm"}, "나 신입 때는 말이야, 2차 안 가면 팀장님이 서운해하셨거든. 그게 팀장이 해야 하는 일인 줄 알았지.", None),
 ("hstair", {"k": 6, "count": 5, "segs": [("T", "다들 기다리는 눈치길래.")], "tone": "warm"}, "다들 기다리는 눈치길래.", None),
 ("hstair", {"k": 7, "pause": 0.4, "tone": "whisper"}, "다섯 명째. 이제 방 안의, 모두였습니다.", None),
 ("hstair", {"k": 8, "segs": [("Z", "팀장님, 사실 저희 다…")], "tone": "tremble"}, "팀장님, 사실 저희 다…", None),
 ("hstair", {"k": 9, "segs": [("T", "들어가자. 다들 기다리겠다.")]}, "들어가자. 다들 기다리겠다.", None),
 ("hstair", {"k": 10}, "제로는, 끝내 말하지 못했습니다.", None),
 ("hlouder", {"sfx": "mic_feedback"}, "다시 5번 방. 이제 제로의 눈에는, 다른 게 보였습니다.", "다시 오 번 방. 이제 제로의 눈에는, 다른 게 보였습니다."),
 ("hlouder", {"k": 1}, "목이 쉬어 가는 한 주임. 휴대폰을 뒤집어 놓은 박 과장. 세 번째 시계를 보는 민지. 웃으면서 문 쪽을 보는 팀장.", None),
 ("hlouder", {"k": 2, "pause": 0.8, "tone": "whisper"}, "다섯 명이, 아무도 원하지 않는 노래를, 서로를 위해 부르고 있었습니다.", None),
 ("hlouder", {"k": 3, "segs": [("T", "다들 재밌지? 우리 한 시간 연장할까?")], "tone": "excited"}, "다들 재밌지? 우리 한 시간 연장할까?", None),
 ("hlouder", {"k": 4, "segs": [("H", "네!!"), ("P", "좋아요!"), ("M", "네…!")], "tone": "excited"}, "네!! / 좋아요! / 네…!", None),
 ("hlouder", {"k": 5, "tone": "whisper"}, "고깃집에서와 똑같은 대답이었습니다. 그런데 이번엔, 제로의 귀에 전혀 다르게 들렸습니다.", None),
 # (미드롤 광고 후보: 여기, 약 5:15)
 # ---------- 3막 · 연장 직전 ----------
 ("hclimax", {"sfx": "tick", "tone": "tense"}, "11시 38분. 민지의 막차까지, 14분.", "열한 시 삼십팔 분. 민지의 막차까지, 십사 분."),
 ("hclimax", {"k": 1, "tone": "tense"}, "카운터에 연장을 말하러 나가는 팀장. 문고리에 손이 올라갑니다.", None),
 ("hclimax", {"k": 2, "sfx": "heartbeat", "segs": [("Z", "저… 팀장님.")], "tone": "tremble"}, "저… 팀장님.", None),
 ("hclimax", {"k": 3, "silent": 1.2, "sfx": "music_stop"}, "…", None),
 ("hclimax", {"k": 4, "segs": [("Z", "민지 씨 막차 시간이 다 돼서요. 저도… 오늘은 먼저 들어가 볼게요.")], "tone": "tremble"}, "민지 씨 막차 시간이 다 돼서요. 저도… 오늘은 먼저 들어가 볼게요.", None),
 ("hclimax", {"k": 5, "silent": 1.6}, "…", None),
 ("hclimax", {"k": 6, "segs": [("P", "…어, 나도. 애가 열이 좀 있어서.")]}, "…어, 나도. 애가 열이 좀 있어서.", None),
 ("hclimax", {"k": 7, "segs": [("H", "저도요! 사실 목이 다 나가서…")], "tone": "playful"}, "저도요! 사실 목이 다 나가서…", None),
 ("hclimax", {"k": 8, "segs": [("M", "죄, 죄송해요. 저도…")], "tone": "tremble"}, "죄, 죄송해요. 저도…", None),
 ("hclimax", {"k": 9}, "네 명이 거의 동시에 일어섰습니다. 그리고 모두, 팀장을 봤습니다.", None),
 ("hclimax", {"k": 10, "pause": 0.6, "segs": [("T", "…다들, 집에 가고 싶었어?")], "tone": "deadpan"}, "…다들, 집에 가고 싶었어?", None),
 ("hclimax", {"k": 11, "silent": 1.0}, "…", None),
 ("hclimax", {"k": 12, "segs": [("T", "사실 나도야.")], "tone": "warm"}, "사실 나도야.", None),
 ("hclimax", {"k": 13, "segs": [("T", "웃기지. 그때 우리 팀장님도… 사실 집에 가고 싶으셨을지 모르겠다.")], "tone": "warm"}, "웃기지. 그때 우리 팀장님도… 사실 집에 가고 싶으셨을지 모르겠다.", None),
 ("hclimax", {"k": 14, "sfx": "crowd_laugh"}, "다섯 명이 동시에 웃음을 터뜨렸습니다. 오늘 밤 처음 나온, 진짜 웃음이었습니다.", None),
 ("hclimax", {"k": 15, "segs": [("T", "가자, 가자! 나 케이크 사러 가야 돼.")], "tone": "excited"}, "가자, 가자! 나 케이크 사러 가야 돼.", None),
 ("hclimax", {"k": 16, "sfx": "tambourine", "tone": "warm"}, "밤새 아무도 들지 않던 탬버린을, 팀장이 나가면서 딱 한 번 흔들었습니다.", None),
 ("hstreet", {"sfx": "subway"}, "11시 51분. 역 계단을 뛰어 내려가는 민지.", "열한 시 오십일 분. 역 계단을 뛰어 내려가는 민지."),
 ("hstreet", {"k": 1, "silent": 2.2, "sfx": "ding"}, "민지 · 막차 탔어요!! 오늘 감사했습니다 🙇‍♀️", None),
 ("hstreet", {"k": 2}, "11시 57분. 팀장은 셔터를 내리던 빵집에서, 마지막 케이크를 샀습니다.", "열한 시 오십칠 분. 팀장은 셔터를 내리던 빵집에서, 마지막 케이크를 샀습니다."),
 ("hstreet", {"k": 3, "silent": 2.2, "sfx": "ding"}, "오 팀장 · [사진] 생일 안 놓쳤다 ㅎㅎ 다들 고마워", None),
 # ---------- 끝 · 자정의 벤치 ----------
 ("hbench", {}, "자정 무렵. 아파트 앞 벤치.", None),
 ("hbench", {"k": 1, "segs": [("D", "늦었구나, 제로야. 회식이었니?")], "tone": "warm"}, "늦었구나, 제로야. 회식이었니?", None),
 ("hbench", {"k": 2, "segs": [("Z", "박사님, 웃긴 얘기 해 드릴까요? 다섯 명이 다 집에 가고 싶었대요. 근데 아무도 말을 못 했어요.")], "tone": "playful"}, "박사님, 웃긴 얘기 해 드릴까요? 다섯 명이 다 집에 가고 싶었대요. 근데 아무도 말을 못 했어요.", None),
 ("hbench", {"k": 3, "pause": 0.4, "segs": [("D", "사람은 무리 속에 있으면, 서로의 얼굴만 보고 움직이지. 그래서 무리 속에선 아무도 자기 자신이 아니란다.")], "tone": "warm"}, "사람은 무리 속에 있으면, 서로의 얼굴만 보고 움직이지. 그래서 무리 속에선 아무도 자기 자신이 아니란다.", None),
 ("hbench", {"k": 4, "segs": [("D", "그래도 오늘 밤엔, 한 사람이 먼저 자기 자신이 됐구나.")], "tone": "warm"}, "그래도 오늘 밤엔, 한 사람이 먼저 자기 자신이 됐구나.", None),
 ("hbench", {"k": 5, "segs": [("Z", "…저 다리 엄청 떨렸어요.")], "tone": "playful"}, "…저 다리 엄청 떨렸어요.", None),
 ("hphone", {"sfx": "page"}, "집에 돌아온 제로는, 휴대폰을 열었습니다.", None),
 ("hphone", {"k": 1, "silent": 2.2}, "임시 보관함 (1) · 제안 감사합니다. 함께하…", None),
 ("hphone", {"k": 2, "tone": "whisper"}, "물론, 아직 말하지 못한 것도 하나 남아 있었지만요.", None),
 ("hphone", {"k": 3, "pause": 0.4, "tone": "warm"}, "창밖으로 불 켜진 간판들이 보였습니다. 그 밤에도 도시의 수많은 작은 방에서는, 아무도 원하지 않는 노래가 흘러나오고 있었겠죠.", None),
 ("hnext", {"sfx": "door"}, "다음 날 아침. 제로의 책상 위에, 커피 한 잔과 포스트잇이 놓여 있었습니다.", None),
 ("hnext", {"k": 1, "silent": 2.4}, "어제 먼저 말해 주셔서 감사했어요. 저는 못 했을 거예요. - 민지", None),
 ("hnext", {"k": 2, "sfx": "ding"}, "그리고 팀 메신저.", None),
 ("hnext", {"k": 3, "silent": 2.8}, "오 팀장 · 어제 다들 수고했어요. 다음 회식은 1차까지만! 2차 가고 싶은 사람은… 솔직하게 손 ✋", None),
 ("hnext", {"k": 4, "silent": 1.6}, "👍 4   ✋ 0", None),
 ("hnext", {"k": 5, "tone": "playful"}, "손을 든 사람은, 아무도 없었습니다.", None),
 # ---------- 마무리 ----------
 ("ask", {"ask": 1, "tone": "warm"}, "여러분 곁에도, 사실은 아무도 원하지 않는데 다 같이 하고 있는 일이 있나요?", None),
 ("cnext", {"tone": "playful"}, "다음 이야기. 짧은 답장 두 글자에, 하루가 무너진 제로.", None),
 ("thanks", {}, "오늘도 끝까지 함께해 주셔서 고맙습니다. 다음 이야기에서 만나요.", None),
]
