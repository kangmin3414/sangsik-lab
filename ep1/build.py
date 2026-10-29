import json, sys

STYLE = "Hand-drawn 2D doodle cartoon, flat colors, bold black outlines, slightly imperfect marker lines."
ZERO = ("Main character ZERO: a big round pure-white head slightly wider than tall, two small black oval eyes, "
        "thick expressive black eyebrows, a tiny single-line mouth, round mint-green lab goggles pushed up on the "
        "forehead with a dark navy strap, a bright yellow sleeveless lab vest with a center zipper and a small navy "
        "chest patch reading \"00\", thin black stick arms and legs, round white mitten hands with no fingers, small "
        "white sneakers. Same character design in every image.")
DOCTOR = ("THE DOCTOR: a friendly elderly scientist drawn in the same simple style as ZERO: a big round pure-white head with a thick black outline, "
          "fluffy white curly hair puffs on both sides and a small curl on top, large round navy-framed glasses with a light mint tint through which small black oval eyes are clearly visible, "
          "bushy grey eyebrows, a neat grey moustache, soft pink cheeks, a long white lab coat over a navy turtleneck, a plain mint name badge, holding a brown clipboard, thin black stick legs and navy shoes. "
          "His face is always clearly visible, bright and warm.")
END = ("Detailed hand-illustrated background with cinematic lighting that matches the scene, ZERO stays flat and "
       "simple, no text or numbers anywhere except the \"00\" chest patch, no photorealism, no 3D, 16:9 aspect ratio, educational YouTube "
       "explainer style.")
END_PLAIN = ("Plain off-white background, no text, no letters, no numbers, no photorealism, no 3D, 16:9 aspect ratio, "
             "educational YouTube explainer style.")

# (time, type, korean scene, english scene sentence or card text, flags)
# type: AI = image to generate, CARD = text card made in the editor
# flags: z = ZERO appears, d = DOCTOR appears, p = plain background
CUTS = [
 ("0:00","AI","새벽 3시 연구소, 장치 위의 제로","Wide shot of a dark laboratory at 3 a.m., ZERO standing on a round metal platform in the center, cables across the floor, mint monitor glow, calm face.","z"),
 ("0:06","AI","동의서를 든 제로 (“가벼운 체험이라고…”)","Close-up of ZERO holding a consent form with both mitten hands, eyebrows tilted up in the middle, wavy mouth, one blue sweat drop.","z"),
 ("0:12","AI","레버 앞에서 돌아보는 박사","THE DOCTOR at a control desk with a large lever, turning toward the camera with a calm smile, ZERO small on the platform in the background, mint monitor glow.","zd"),
 ("0:18","AI","장치가 켜지고 발뒤꿈치가 뜬다","Close-up of ZERO's white sneakers as the heels lift a few centimeters off the platform, a ring of mint light glowing under the platform.","z"),
 ("0:24","AI","고글이 내려온다: 실험 시작","Medium shot of ZERO with the mint goggles pulled down over the eyes, wide white eyes with tiny pupils, hovering just above the platform, mint light rising around him.","z"),
 ("0:30","CARD","타이틀 카드","만약에 나만 중력이 1/6이라면?",""),
 ("0:40","AI","1일차 아침, 일어나다 천장에 머리를 박는다","A small bedroom in a Korean apartment in morning sunlight, ZERO launched upward out of bed with the blanket flying, head bumping the ceiling, wide white eyes with tiny pupils.","z"),
 ("0:48","AI","천장에 붙어 머리를 문지르는 제로","ZERO pressed against the bedroom ceiling rubbing his head with one mitten hand, eyebrows tilted up in the middle, wavy mouth, morning light.","z"),
 ("0:56","AI","체중계 위에서 신난 제로 (화면 숫자는 편집에서)","A bright small bathroom, ZERO standing on a digital bathroom scale with a blank display, looking down, happy closed curved eyes, big open smile, pink blush.","z"),
 ("1:04","CARD","설명 카드: 체중과 질량","체중계 = 바닥을 누르는 힘 · 10kg / 질량 = 그대로 60kg",""),
 ("1:14","AI","휴대폰 영상통화 속 박사","ZERO holding a smartphone showing a video call with THE DOCTOR in silhouette, ZERO's eyebrows angled sharply down in confusion, bedroom background.","zd"),
 ("1:30","AI","출근길, 걸을 때마다 통통 튄다","Wide shot of a Seoul apartment-complex street during the morning commute, ZERO bouncing high with each step like on the moon, office workers turning to stare.","z"),
 ("1:38","AI","균형 잡느라 팔을 벌린 제로","Side view of ZERO mid-bounce with arms spread for balance, eyebrows tilted up in the middle, a delivery scooter passing underneath.","z"),
 ("1:46","AI","달에서 캥거루처럼 뛰는 우주비행사","A simple doodle of an astronaut in a white spacesuit hopping like a kangaroo on the gray moon surface, Earth hanging in the black sky.","p"),
 ("1:54","AI","깜빡이는 신호, 점프 준비","A Seoul crosswalk with the green pedestrian signal blinking, ZERO crouching to jump, eyebrows angled sharply down in determination, pedestrians crossing.","z"),
 ("2:00","AI","슬로모션 3m 점프 (HUD는 편집에서)","Wide low-angle shot of ZERO three meters above the crosswalk with both arms up, happy closed curved eyes, big open smile, people below looking up.","z"),
 ("2:08","CARD","비교 카드","지구 50cm · 0.6초 → 1/6 G 3m · 3.8초",""),
 ("2:16","AI","박수 치는 아이, 허공에서 손 흔드는 제로","A small child on the sidewalk clapping, ZERO waving from mid-air with one mitten hand, happy closed curved eyes, pink blush.","z"),
 ("2:24","AI","착지하자마자 미끄러져 넘어짐","ZERO landing on the crosswalk and his feet sliding out from under him, falling backward, wide white eyes with tiny pupils.","z"),
 ("2:40","AI","지각할까 봐 달리는 제로","ZERO running along a busy sidewalk while checking a wristwatch, eyebrows angled sharply down in determination, office buildings behind.","z"),
 ("2:48","AI","모퉁이에서 빙판처럼 미끄러짐","At a dry street corner, ZERO trying to stop but skidding sideways as if on ice, motion lines behind his sneakers, wide white eyes with dot pupils, zigzag trembling mouth.","z"),
 ("2:58","CARD","설명 카드: 마찰력","마찰력 ∝ 바닥을 누르는 힘 → 브레이크 1/6 · 제동 거리 6배",""),
 ("3:08","AI","편의점 유리문으로 미끄러져 간다","ZERO sliding toward a convenience store glass door with arms out, wide white eyes with dot pupils, the store clerk inside looking up.","z"),
 ("3:16","AI","유리문에 납작 붙은 제로","ZERO's face and body pressed flat against the convenience store glass door, half-closed droopy eyes, the clerk staring through the glass.","z"),
 ("3:30","AI","점심시간 옥상 난간 위의 제로","An office rooftop at lunchtime, ZERO standing on a low railing at the edge, a coworker reaching out to stop him, ZERO's eyebrows angled sharply down in determination.","z"),
 ("3:38","CARD","설명 카드: 지구에서 10m 낙하","10m 낙하 · 지구: 1.4초, 시속 50km",""),
 ("3:46","AI","옥상에서 천천히 내려가는 제로","Wide shot of ZERO stepping off the rooftop and drifting down slowly with arms spread, calm face, city skyline behind.","z"),
 ("3:54","AI","사무실 창문을 지나가며 떨어진다","Medium shot of ZERO floating down past an office window, workers inside spilling coffee in surprise, ZERO giving a small wave.","z"),
 ("4:02","CARD","설명 카드: 1/6 G 낙하","1/6 G · 3.5초, 시속 21km = 지구 1.7m에서 뛴 것",""),
 ("4:10","AI","화단에 사뿐히 착지, 환호하는 동료들","ZERO landing softly in a flower bed at the foot of the building, happy closed curved eyes, coworkers cheering from the rooftop above.","z"),
 ("4:20","AI","박사 얼굴 클로즈업 (“오늘은요”)","Close-up of THE DOCTOR's face with a serious expression and slightly lowered eyebrows, a mint monitor graph reflected on his round glasses, dark lab.","d"),
 ("4:30","CARD","날짜 카드","3일차",""),
 ("4:34","AI","거울 속 부은 얼굴, 가는 다리","A bathroom mirror, ZERO looking at his reflection with a round puffy face and very thin legs, eyebrows tilted up in the middle, one blue sweat drop.","z"),
 ("4:44","AI","체액이 위로 올라가는 도해","A simple educational doodle of a plain white stick-figure body outline with blue arrows showing body fluids rising from the legs to the head.","p"),
 ("4:56","AI","코막힘으로 휴지를 든 제로","ZERO holding a tissue to his nose with puffy cheeks, half-closed droopy eyes, a pile of used tissues beside him.","z"),
 ("5:06","AI","호빵처럼 부은 볼을 만지는 제로","Close-up of ZERO pressing his puffy cheeks with both mitten hands, eyebrows tilted up in the middle, wavy mouth.","z"),
 ("5:20","CARD","날짜 카드","5일차",""),
 ("5:24","AI","모래주머니 배낭을 메고 평범하게 걷는다","ZERO proudly walking normally on a sidewalk wearing a huge backpack stuffed with sandbags, one eyebrow raised, small confident smirk.","z"),
 ("5:34","AI","모니터로 제로를 지켜보는 박사","THE DOCTOR at a desk, seen from a three-quarter angle, stroking his moustache while watching a monitor that shows ZERO with the sandbag backpack, mint monitor glow.","zd"),
 ("5:44","AI","배낭을 내려놓자 다시 떠오른다","Subway station stairs, ZERO setting down the heavy backpack and immediately floating upward, wide white eyes with tiny pupils, commuters staring.","z"),
 ("6:00","CARD","날짜 카드","7일차",""),
 ("6:04","AI","다리뼈 스캔을 보는 두 사람","The lab, a large monitor showing a glowing mint X-ray of leg bones, THE DOCTOR pointing at it with his clipboard while ZERO looks on worried.","zd"),
 ("6:14","CARD","설명 카드: 골밀도","우주정거장 골밀도 −1~1.5% / 한 달 · 1/6 G는 아직 아무도 모른다",""),
 ("6:24","AI","자기 스캔을 바라보는 제로, 침묵","Close-up of ZERO staring at the bone scan, mint light on his face, eyebrows tilted up in the middle, mouth a flat line.","z"),
 ("6:34","AI","실험 종료 버튼을 누르는 박사","THE DOCTOR's hand pressing a big red button on the control desk, ZERO on the platform in the background with goggles pushed up.","zd"),
 ("6:50","AI","안도하며 체중계에 오르는 제로","ZERO stepping onto a digital scale in the lab with a blank display, relieved happy closed curved eyes, goggles pushed up.","z"),
 ("6:58","AI","체중계 위로 발이 뜨기 시작 (숫자는 편집에서)","Close-up of the scale's blank display glowing red, ZERO's white sneakers starting to rise off it.","z"),
 ("7:06","AI","붉은 경고등, 떠오르는 제로","Wide shot of the lab flashing with red warning lights, ZERO beginning to float with wide white eyes, dot pupils and a zigzag trembling mouth, THE DOCTOR frozen at the desk.","zd"),
 ("7:16","AI","당황한 박사 얼굴 (“설정값을 바꾼 적이 없습니다”)","Close-up of THE DOCTOR's face, eyes wide behind his round glasses, one blue sweat drop, flashing red warning lights reflected on the lenses.","d"),
 ("7:22","AI","바닥에서 멀어지는 발과 작아지는 그림자","Low-angle close-up of ZERO's sneakers slowly leaving the lab floor, his shadow shrinking beneath him, red light fading to dark.","z"),
 ("7:30","CARD","다음 실험 예고 카드","실험 기록 001, 2부 · 만약에 중력이 매일 절반씩 줄어든다면?",""),
 ("7:40","CARD","댓글 의뢰 카드","다음 실험은 여러분이 고릅니다 · 걸어 보고 싶은 ‘만약에’를 댓글로",""),
]

def full_prompt(t, scene, flags):
    parts = [STYLE]
    if "z" in flags:
        parts.append(ZERO)
    if "d" in flags:
        parts.append(DOCTOR)
    parts.append(scene)
    parts.append(END_PLAIN if "p" in flags else END)
    return "[" + t + "] " + " ".join(parts)

def esc(s):
    return s.replace("|", "\\|")

if sys.argv[1] == "txt":
    lines = [full_prompt(t, s, f) for (t, ty, k, s, f) in CUTS if ty == "AI"]
    print("\n\n".join(lines))
elif sys.argv[1] == "md":
    rows = ["| # | 시간 | 유형 | 장면 | 장면 문장 (②) 또는 카드 문구 |", "| --- | --- | --- | --- | --- |"]
    for i, (t, ty, k, s, f) in enumerate(CUTS, 1):
        rows.append("| %d | %s | %s | %s | %s |" % (i, t, "AI 이미지" if ty == "AI" else "텍스트 카드", esc(k), esc(s)))
    print("\n".join(rows))
elif sys.argv[1] == "count":
    ai = sum(1 for c in CUTS if c[1] == "AI")
    print(len(CUTS), ai, len(CUTS) - ai)
