# 화풍 시험: 건강 편 11~12번(걸음 수)을 세 화풍으로 (2026-11-15)

운영자 요청("Lemo Opuscar가 뭐야" → 설치해서 시험해 보자 "ㅇㅋ")으로 만든 30초짜리 세 클립 비교.
- 화풍 문법: Lemo-Opuscar(github.com/lemomo-ai/lemo-opuscar, lemomo-ai)의 `styles/pictogram-motion`, `styles/risograph`, `styles/marker-paper` STYLE.md를 읽고 따랐다. 그 저장소의 코드·문서는 이 저장소에 넣지 않았다(문서는 CC BY-NC 4.0, 영화 제작에는 상업 이용 포함 허용). 아래 코드는 직접 쓴 것이다.
- 그리는 방식은 우리 파이프라인과 같다: 페이지가 `window.render(t)`로 한 장을 그리고(`web/*.html`), `capture_op.py`가 찍고, ffmpeg로 묶는다.

순서: `voice_op.py`(녹음, 테이크는 /dev/shm/op/takes) → `tl_op.py`(타임라인 web/tl.json, 목소리 트랙) → web 폴더에서 `python3 -m http.server 8765` + 글꼴(`npm i @fontsource/black-han-sans @fontsource/gaegu @fontsource/do-hyeon @fontsource/ibm-plex-mono`) → `capture_op.py <page> <out> 24 [a b]` → `mix_op.py <pg|riso|marker>`.

- 픽토그램: 카드마다 격자 무늬, 둥근 막대 사람, 큰 글자가 아래에서 올라옴, 100bpm 박자에 컷. 프레임당 약 0.3초.
- 리소: 판 세 장(청록·형광 주황·노랑)의 농도로 그린 뒤 인쇄 단계(판 어긋남, 망점, 결, 핀홀). 프레임당 2~3초(두 갈래로 나눠 렌더).
- 마커: 종이 한 장, 검정=뼈대·파랑=아는 것·빨강=답, 획과 글자는 그려진 만큼만, 다 그린 획은 12fps로 살짝 떤다.

연구 사실: 시험 중에 "4,400보 쪽 = 빠르게 걷는다"는 꼬리표를 넣었다가 뺐다. 이 연구는 걸음 '수'를 봤고, 걸음 수를 맞추면 걷는 세기는 뚜렷한 관련이 없었다(Lee 등, JAMA Internal Medicine 2019).
