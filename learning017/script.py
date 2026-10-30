# 실험 017 · 이 나이에 뭘 배워? — 공자와 75세 박사님의 저글링 석 달 (대본 1차, 2026-10-30)
# (scene, args, subtitle, spoken-or-None). args["segs"] = [(voice, text[, spoken])...] when a line mixes voices.
# args["silent"] = seconds of silence (no TTS); the text is shown on screen (message / card), not as a subtitle.
# args["study"] = source chip on screen; args["n"/"when"/"name"] = week card (실험 n/5); args["ask"] = comment question card.
# Voices: N narrator, Z Zero, D doctor (박사, 75세 할아버지 과학자 — 이번 편의 주인공), K 하람 (9살, 저글링 교실 친구, 새 인물).
# One image all the way: three balls. 박사 has never thrown three balls in his life; in 12 weeks, among children,
#   he learns. 習 = a young bird flapping again and again (說文: 習 數飛也) — and 說 (joy) is the point of 學而時習之.
# Story: Zero says "서른넷에 수영은 늦었죠" → 박사 (75) quietly signs up for a children's juggling class →
#   week 1 kids laugh (Socrates' lyre lessons) / week 3 balls everywhere (Boyke 2008) / week 6 "old brains can't" (Hartshorne 2015),
#   박사 turns scientist and draws the throw pattern, teaches 하람 → week 9 why hard new things (Park 2014, Cato's Greek) →
#   week 12 recital: one drop, picks it up, 30 seconds → "배우는 사람이 이렇게 설레는 줄 잊고 살았구나" → Zero signs up for swimming.
# Prop: 박사's old lab coat + three bean bags (빨강·노랑·파랑). Length target 8:20–8:40 (≈2,200 chars without spaces).
# Facts (checked 2026-10-30):
#   논어 學而 1: 學而時習之 不亦說乎. 說文解字: 習 數飛也 (a bird flying again and again).
#   논어 述而 19: 其爲人也 發憤忘食 樂以忘憂 不知老之將至云爾.
#   Solon fr. 18 (quoted in Plato, Laches 188b): γηράσκω δ' αἰεὶ πολλὰ διδασκόμενος — "I grow old always learning many things".
#   Plato, Euthydemus 272c: old Socrates takes lyre lessons from Connus alongside boys; the boys laugh and call Connus
#     "the old men's teacher"; Socrates is not ashamed to learn.
#   Cicero, De Senectute 26 (Cato): learned Greek letters as an old man ("Graecas litteras senex didici").
#   Boyke, Driemeyer, Gaser, Büchel & May 2008 J Neurosci: older adults (50–67, juggling group n=44, controls n=25), 3 months
#     of juggling → gray matter increase (visual motion area hMT/V5, also hippocampus, nucleus accumbens); 25 of 44 could
#     juggle 60 s; increases were transient (declined after training stopped).
#   Hartshorne & Germine 2015 Psych Sci: ~48,500 online + earlier data; processing speed peaks ~18–19, short-term memory
#     ~25–35, reading emotions 40s–50s, vocabulary late 60s–early 70s.
#   Park et al. 2014 Psych Sci (Synapse Project): 221 adults aged 60–90, 3 months, 15 h/week; only those learning demanding new
#     skills (digital photography, quilting, or both) improved episodic memory, not the social group or the familiar
#     at-home activities group (music, word puzzles).
# Overlap check (001–016): no 공자/논어, Solon, Cicero, Euthydemus, Boyke, Hartshorne, Park before. Avoided photography
#   (011 사진관) and "하다 보면 된다" as the main message (016) — here the point is joy and age, not habit.
# The class, 하람 and the recital are fiction.
S = [
 # ---------- 서른넷은 늦었다? ----------
 ("lpool", {}, "수영장 앞을 지나던 제로가, 유리창 너머 레인을 한참 바라봅니다.", None),
 ("lpool", {"k": 1, "segs": [("Z", "저도 수영 배우고 싶었는데… 서른넷에 시작하긴 좀 늦었죠?")]}, "저도 수영 배우고 싶었는데… 서른넷에 시작하긴 좀 늦었죠?", None),
 ("lpool", {"k": 2, "segs": [("D", "서른넷이 늦으면, 일흔다섯은 어쩌라고?")]}, "서른넷이 늦으면, 일흔다섯은 어쩌라고?", None),
 ("lsign", {}, "그다음 주, 박사님이 동네 문화센터에 등록한 수업은, 어린이 저글링 교실이었습니다.", None),
 ("lsign", {"k": 1, "segs": [("D", "평생 공 세 개를 한 번도 못 던져 봤거든.")]}, "평생 공 세 개를 한 번도 못 던져 봤거든.", None),
 ("ltitle", {}, "나이 들어 새로 배우는 거, 정말 늦은 걸까요? 오늘의 실험. 일흔다섯 박사님은 석 달 만에, 공 세 개를 던질 수 있을까?", None),
 # ---------- 공자가 말한 배움 ----------
 ("lkong", {}, "배움 하면 떠오르는 말이 있죠. 배우고 때때로 익히면, 기쁘지 아니한가. 공자의 논어, 첫 문장입니다.", None),
 ("lkong", {"k": 1}, "그런데 여기서 익힐 습 자는, 원래 어린 새가 날기 위해 날갯짓을 거듭하는 모습이라고 풀이됩니다.", None),
 ("lkong", {"k": 2}, "그리고 이 문장의 마지막 말은, 공부해라가 아니라 기쁘다예요. 공자에게 배움은 의무보다, 즐거움에 가까웠습니다.", None),
 ("lkong", {"k": 3}, "공자는 자기 삶을 이렇게 돌아봤습니다. 열다섯에 배움에 뜻을 두었고, 서른에 섰고, 마흔에 흔들리지 않았고, 쉰에 하늘의 뜻을 알았고, 예순에 귀가 순해졌고, 일흔에 마음 가는 대로 해도 선을 넘지 않았다.", None),
 ("lkong", {"k": 4, "segs": [("Z", "일흔까지… 계속 자라고 있었다는 거네요?")]}, "일흔까지… 계속 자라고 있었다는 거네요?", None),
 # ---------- [1주 차] 아이들 틈에서 ----------
 ("lweek", {"n": 1, "when": "1주 차", "name": "아이들 틈에서"}, "1주 차. 아이들 틈에서.", "일 주 차. 아이들 틈에서."),
 ("lclass", {}, "교실에 들어서자, 아홉 살 아이들이 일제히 박사님을 쳐다봅니다. 그리고 킥킥.", None),
 ("lclass", {"k": 1, "segs": [("K", "할아버지도 저글링 배워요?")]}, "할아버지도 저글링 배워요?", None),
 ("lclass", {"k": 2, "segs": [("D", "그럼. 오늘부터 너랑 같은 반이다.")]}, "그럼. 오늘부터 너랑 같은 반이다.", None),
 ("lclass", {"k": 3}, "첫 시도. 공 하나는 천장으로, 하나는 박사님 머리 위로. 아이들이 더 크게 웃자, 박사님도 같이 웃어 버렸습니다.", None),
 ("llyre", {}, "2,400년 전 아테네에도 이런 장면이 있었습니다. 나이 든 소크라테스가 아이들과 함께, 리라라는 악기를 배우러 다녔거든요.", "이천사백 년 전 아테네에도 이런 장면이 있었습니다. 나이 든 소크라테스가 아이들과 함께, 리라라는 악기를 배우러 다녔거든요."),
 ("llyre", {"k": 1}, "아이들은 웃었고, 선생님은 노인들 선생이라는 놀림까지 받았죠. 그래도 소크라테스는, 배우는 걸 부끄러워하지 않았습니다.", None),
 ("llyre", {"k": 2}, "아테네의 현자 솔론은 이렇게 노래했습니다. 나는 늘 많은 것을 배우며, 늙어 간다.", None),
 # ---------- [3주 차] 공은 바닥에 ----------
 ("lweek", {"n": 2, "when": "3주 차", "name": "공은 바닥에"}, "3주 차. 공은 여전히, 바닥에.", "삼 주 차. 공은 여전히, 바닥에."),
 ("ldrop", {}, "던지고, 떨어뜨리고, 줍고. 하루에 공을 줍는 횟수만 수백 번.", None),
 ("ldrop", {"k": 1, "segs": [("Z", "박사님, 허리 괜찮으세요?"), ("D", "허리는 괜찮다. 자존심이 좀 아프지.")]}, "박사님, 허리 괜찮으세요? 허리는 괜찮다. 자존심이 좀 아프지.", None),
 ("lbrain", {"study": "Boyke 외 (2008)"}, "독일 연구팀이 50대에서 60대 사이 44명에게, 석 달 동안 저글링을 배우게 하고 뇌를 촬영했습니다.", "독일 연구팀이 오십 대에서 육십 대 사이 마흔네 명에게, 석 달 동안 저글링을 배우게 하고 뇌를 촬영했습니다."),
 ("lbrain", {"k": 1}, "석 달 뒤, 움직임을 보는 시각 영역과 기억을 맡는 해마 같은 곳에서, 회색질이 늘어나 있었어요. 나이 든 뇌도, 배우면 모양이 바뀐다는 거죠.", None),
 ("lbrain", {"k": 2}, "석 달 뒤 1분 넘게 저글링에 성공한 사람은 44명 중 25명. 절반 남짓이었어요.", "석 달 뒤 일 분 넘게 저글링에 성공한 사람은 마흔네 명 중 스물다섯 명. 절반 남짓이었어요."),
 ("lbrain", {"k": 3, "pause": 0.3}, "그런데 연습을 그만두고 석 달이 지나자, 늘었던 부분은 다시 줄어들었습니다. 뇌는 쓰는 만큼, 자라는 셈이에요.", None),
 # ---------- [6주 차] 늙은 뇌는 안 된다? ----------
 ("lweek", {"n": 3, "when": "6주 차", "name": "늙은 뇌는 안 된다?"}, "그런데 6주 차, 박사님이 처음으로 수업에 빠졌습니다.", "그런데 육 주 차, 박사님이 처음으로 수업에 빠졌습니다."),
 ("lquit", {}, "하람이는 벌써 공 세 개를 던지는데, 박사님은 아직 두 개.", None),
 ("lquit", {"k": 1, "segs": [("D", "역시 이 나이엔 머리가 안 따라 주는구나.")]}, "역시 이 나이엔 머리가 안 따라 주는구나.", None),
 ("lpeak", {"study": "Hartshorne & Germine (2015)"}, "미국 연구팀이 5만 명 가까운 사람의 능력을 나이별로 비교해 봤습니다.", "미국 연구팀이 오만 명 가까운 사람의 능력을 나이별로 비교해 봤습니다."),
 ("lpeak", {"k": 1}, "처리 속도는 열여덟, 열아홉 살쯤 정점. 그런데 남의 감정을 읽는 능력은 40대에서 50대, 어휘력은 60대 후반에서 70대 초반에 정점을 찍었어요.", "처리 속도는 열여덟, 열아홉 살쯤 정점. 그런데 남의 감정을 읽는 능력은 사십 대에서 오십 대, 어휘력은 육십 대 후반에서 칠십 대 초반에 정점을 찍었어요."),
 ("lpeak", {"k": 2}, "나이는 내리막길 하나가 아니라, 봉우리가 여러 개인 산맥에 가깝다는 거죠.", None),
 ("lpeak", {"k": 3, "segs": [("Z", "박사님, 빠른 손은 하람이가 이겨도, 박사님만 잘하는 게 있잖아요.")]}, "박사님, 빠른 손은 하람이가 이겨도, 박사님만 잘하는 게 있잖아요.", None),
 ("lpeak", {"k": 4, "segs": [("D", "내가 잘하는 거라… 계산이라면, 자신 있지.")]}, "내가 잘하는 거라… 계산이라면, 자신 있지.", None),
 ("lgraph", {}, "그날 밤, 박사님은 공책을 폈습니다. 공이 그리는 궤적을 그려 보고, 던지는 높이와 박자를 계산했죠.", None),
 ("lgraph", {"k": 1}, "다음 수업, 하람이가 공을 자꾸 놓치자 박사님이 공책을 내밀었습니다.", None),
 ("lgraph", {"k": 2, "segs": [("D", "하람아, 공을 눈높이까지만 던져 보렴. 그럼 박자가 맞는단다.")]}, "하람아, 공을 눈높이까지만 던져 보렴. 그럼 박자가 맞는단다.", None),
 ("lgraph", {"k": 3, "segs": [("K", "와, 된다! 할아버지 천재다!")]}, "와, 된다! 할아버지 천재다!", None),
 ("lgraph", {"k": 4}, "그 공책은 금세 아이들 사이에서 박사님 비법 노트가 됐습니다. 배우러 간 교실에서, 박사님은 다시 선생님이 되기도 한 거죠.", None),
 # (미드롤 광고 후보: 여기, 약 4:40)
 # ---------- [9주 차] 편한 것 말고 낯선 것 ----------
 ("lweek", {"n": 4, "when": "9주 차", "name": "편한 것 말고 낯선 것"}, "9주 차. 편한 것 말고, 낯선 것.", "구 주 차. 편한 것 말고, 낯선 것."),
 ("lsynapse", {"study": "Park 외 (2014)"}, "미국 연구팀은 60세에서 90세 사이 221명을 나눠, 석 달 동안 일주일에 15시간씩 서로 다른 활동을 하게 했습니다.", "미국 연구팀은 육십 세에서 구십 세 사이 이백이십일 명을 나눠, 석 달 동안 일주일에 열다섯 시간씩 서로 다른 활동을 하게 했습니다."),
 ("lsynapse", {"k": 1}, "한 그룹은 처음 해 보는 디지털 사진이나 퀼트를 배웠고, 다른 그룹은 친구들과 어울리거나, 집에서 익숙한 음악과 낱말 퍼즐을 즐겼죠.", None),
 ("lsynapse", {"k": 2, "pause": 0.3}, "석 달 뒤 기억력이 좋아진 건, 낯설고 어려운 걸 새로 배운 그룹뿐이었습니다.", None),
 ("lsynapse", {"k": 3}, "어울리고 쉬는 시간도 즐거웠지만, 기억력까지 바꾸진 못한 거죠.", None),
 ("lcato", {}, "로마의 정치가 카토는 늙어서 그리스어를 배웠다고 합니다. 친구 키케로가 노년에 관해 쓴 책에, 그 이야기를 남겼죠.", None),
 ("lcato", {"k": 1}, "익숙한 걸 반복하면 편합니다. 하지만 뇌에 새 길을 내는 건, 늘 조금 버거운 쪽이었어요.", None),
 ("lcato", {"k": 2, "segs": [("K", "할아버지는 왜 이렇게 열심히 해요?"), ("D", "궁금하거든. 공 세 개가 어떻게 하늘에 떠 있는지.")]}, "할아버지는 왜 이렇게 열심히 해요? 궁금하거든. 공 세 개가 어떻게 하늘에 떠 있는지.", None),
 ("lcato", {"k": 3}, "9주 차 마지막 날. 박사님의 손에서, 공 세 개가 처음으로 다섯 바퀴를 돌았습니다.", "구 주 차 마지막 날. 박사님의 손에서, 공 세 개가 처음으로 다섯 바퀴를 돌았습니다."),
 ("lcato", {"k": 4, "segs": [("D", "제로야! 봤니? 다섯 번이다, 다섯 번!")]}, "제로야! 봤니? 다섯 번이다, 다섯 번!", None),
 # ---------- [12주 차] 발표회 ----------
 ("lweek", {"n": 5, "when": "12주 차", "name": "발표회"}, "12주 차. 어린이 저글링 교실, 발표회 날.", "십이 주 차. 어린이 저글링 교실, 발표회 날."),
 ("lshow", {}, "무대에 선 건 아이들 열 명, 그리고 일흔다섯 살 박사님 한 명.", None),
 ("lshow", {"k": 1}, "시작한 지 10초. 빨간 공이, 바닥으로 떨어졌습니다.", "시작한 지 십 초. 빨간 공이, 바닥으로 떨어졌습니다."),
 ("lshow", {"k": 2, "segs": [("K", "할아버지, 다시! 다시!")]}, "할아버지, 다시! 다시!", None),
 ("lshow", {"k": 3, "pause": 0.4}, "박사님은 공을 주워, 웃으면서 다시 던졌습니다. 그리고 30초.", "박사님은 공을 주워, 웃으면서 다시 던졌습니다. 그리고 삼십 초."),
 ("lshow", {"k": 4, "silent": 2.4}, "👏👏👏", None),
 ("lold", {}, "공자는 제자에게 자신을 이렇게 소개했습니다. 배움에 빠지면 밥 먹는 것도 잊고, 즐거워서 근심도 잊고, 늙어 가는 줄도 모르는 사람.", None),
 ("lold", {"k": 1, "segs": [("D", "평생 가르치기만 했는데… 배우는 사람이 이렇게 설레는 줄, 잊고 살았구나.")]}, "평생 가르치기만 했는데… 배우는 사람이 이렇게 설레는 줄, 잊고 살았구나.", None),
 ("lold", {"k": 2}, "석 달 동안 박사님이 얻은 건, 공 세 개만이 아니었습니다. 아홉 살 친구 한 명, 공책 한 권, 그리고 다시 설레는 마음.", None),
 # ---------- 제로의 등록 ----------
 ("lswim", {}, "그날 저녁, 제로의 휴대폰에 문자 한 통이 도착했습니다.", None),
 ("lswim", {"k": 1, "silent": 2.6}, "[수영장] 성인 초급반 등록이 완료되었습니다.", None),
 ("lswim", {"k": 2, "segs": [("Z", "서른넷이면… 아직 한참 젊은 거였네요.")]}, "서른넷이면… 아직 한참 젊은 거였네요.", None),
 ("lswim", {"k": 3}, "첫 수업. 킥판을 붙잡은 제로가 겨우 5미터를 가는 동안, 옆 레인에서 일흔쯤 돼 보이는 할머니가 유유히 지나갑니다.", "첫 수업. 킥판을 붙잡은 제로가 겨우 오 미터를 가는 동안, 옆 레인에서 일흔쯤 돼 보이는 할머니가 유유히 지나갑니다."),
 ("lswim", {"k": 4, "segs": [("Z", "와… 저분도 언젠가는, 오늘 처음 오셨겠지?")]}, "와… 저분도 언젠가는, 오늘 처음 오셨겠지?", None),
 # ---------- 마무리 ----------
 ("lrecap", {}, "새는 날 수 있어서 날갯짓하는 게 아니라, 날갯짓을 거듭하다 날게 됩니다. 그리고 그 날갯짓에는, 정해진 나이가 없었습니다.", None),
 ("lrecap", {"k": 1}, "배우기에 늦은 나이는 없었습니다. 늦었다고 생각하고 멈추는 순간이 있었을 뿐.", None),
 ("lrecap", {"k": 2, "ask": 1}, "여러분이 나이 때문에 미뤄 둔 배움은 뭔가요? 댓글로 남겨 주시면, 박사님이 응원해 드릴게요.", None),
 ("thanks", {}, "오늘도 끝까지 함께해 주셔서 고맙습니다. 상식실험실이었습니다.", None),
]
