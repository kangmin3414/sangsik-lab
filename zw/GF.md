# 게임 감각 층 (zw/gf.js · zw/gf_sfx.py)

운영자 요청(2026-11-15): "닌텐도 게임처럼 귀엽고 단순한데 직관적이며 센스 있게 시청자들에게 인식시키는 애니메이션 엔진".
남의 캐릭터·화면·효과음은 쓰지 않는다. 그런 게임들이 쓰는 **표현 원리**만 우리 그림과 우리 소리로 옮겼다.
엔진 본체(`shorts/engine.js`)와 연기 층(`zw/act.js`)은 그대로 두고, 그 위에 얹는 층이다. 새 이름은 모두 `gf`로 시작한다.

## 원칙 여덟 가지
1. 한 화면에 한 가지. 큰 실루엣, 밝은 단색, 둥근 모서리, 굵은 외곽선.
2. 모든 움직임은 예비 동작 → 본 동작 → 출렁임. 빨리 들어오고 부드럽게 멈춘다.
3. 상태는 글자 대신 게이지·아이콘·도장으로 보여 준다.
4. 일이 생기면 바로 반응한다. 화면의 톡(고리·별·떠오르는 글자)과 소리가 같은 시각에 난다.
5. 감정은 머리 위 기호로.
6. 장면 전환은 장난스럽게(동그랗게 닫히기, 색 띠).
7. 보상 연출(아이템 카드, 단계 카드, 도장, 색종이).
8. 세계가 살아 있다. 구름·화분·나무·물결이 늘 조금씩 움직인다.

## 켜는 법
- 페이지(`anim_*.html`)에서 `zw/act.js` 다음에 `zw/gf.js`를 읽고, 그 편의 장면 파일을 읽는다(예: `wonhyo01/long/anim_wh2.html`).
- 장면 파일 맨 위에 `window.GFR = { boil: false, vig: false, flash: false, study: false, sub: gfSubtitle, over: t => gfTransition(t, { 줄id: 'iris' | 'bands' | ['iris', 닫히는 x, y, 열리는 x, y] }) }`.
  - `boil`(손그림 떨림)·`vig`(가장자리 어둡게)를 끄면 깨끗한 게임 화면이 되고 렌더도 빨라진다(원효 샘플 3,126프레임이 약 3분).
  - `sub: gfSubtitle`은 자막을 대사 상자로 그린다. 인물 대사에는 이름표가 붙는다(`GF.names = { Z: ['제로', 색], … }`).
  - render()의 이 갈고리는 `anim_wh2.html`에만 들어 있다. 다른 편에 쓰려면 그 페이지의 render() 끝부분을 같은 모양으로 바꾼다.

## 무엇이 있나
| 묶음 | 함수 | 쓰임 |
|---|---|---|
| 탄력 | `gfIn`(톡 튀어나옴) `gfOut` `gfBeat`(강조) `gfJelly` `gfShake` `gfHop`(깡충) `gfWalk`(통통 걷기) `gfM`(움직임 합치기) | 시간 → 크기·위치 |
| 인물 | `gfActor(인물함수, 옵션, 움직임)` `gfBlob`(뜨면 작아지는 그림자) `gfAbove`(머리 위 자리) | 인물 + 그림자를 한 번에 |
| 감정 기호 | `gfEmote(t, 시각, x, y, 종류)` — bang(!) q(?) dots(…) note(♪) sweat heart idea zzz spark gloom vein shock | 머리 위 |
| 톡·반짝 | `gfPuff`(먼지) `gfRing` `gfStarBurst` `gfTwinkle` `gfConfetti` `gfPlus`("장착!") `gfRays`(햇살) | 일이 생긴 자리 |
| 화면 표시 | `gfPanel` `gfChip`·`gfChipAt`(아이콘 꼬리표) `gfMood`(마음 게이지) `gfFace` `gfBar` `gfStamp`(도장 쾅) `gfQuest`(할 일 목록) `gfItem`(아이템 카드) `gfStage`(단계 카드) `gfBounceText`(글자가 하나씩 톡톡) | UI |
| 아이콘 | `gfIcon(이름)` — heart star spark sun moon skull ghost ball check cross scroll book pin calendar eq flask rain flag bulb note family tie door building | 원점 가운데, 크기 약 52 |
| 전환 | `gfIris` `gfBands` `gfTransition(t, 표)` | 화면 좌표 |
| 자막 | `gfSubtitle(t)` | 대사 상자 |
| 무대 | `gfDefs` `gfRoom` `gfDoor` `gfWindow` `gfDesk` `gfPlant` `gfClock` / `gfClouds` `gfHill` `gfSun` `gfMoon` `gfTree` `gfPine` `gfGrass` / `gfLayer(cam, depth, 그림)` | 단순한 세트 |
| 소리 | `gf_sfx.py`: pop blip tick boing land step coin ding sparkle flip stamp strike gauge(v0, v1) hurt bang question heart ghost iris_close iris_open bands letters / item equip stage clear morning | 화면 반응과 같은 시각에 |

## 장면을 짤 때
- **한 편을 꿰는 표시 하나**를 먼저 정한다. 원효 편은 '마음 게이지'다: 같은 문·같은 자리·같은 와인에서 게이지만 달라진다.
- 설명할 말이 생기면 먼저 "게임이라면 어떻게 보여 줄까"를 묻는다: 비교 = 카드 두 장 + `=`, 변화 = 게이지, 아님 = 도장, 얻음 = 아이템 카드, 차례 = 할 일 목록, 시간 = 해·달 눈금.
- 화면에 뜨는 것은 낱말 시각에 맞춘다(`whW`). 같은 시각을 `build_*.py`에서도 써서 소리를 넣는다.
- 말을 덮지 않게: 낱말 위의 소리는 짧고 작게(0.3 안팎), 가락(`item`·`clear`)은 말이 끝난 뒤에. 끝나면 `qa_wh.py`로 줄마다 음성 인식을 돌린다.
- 숫자가 없는 막대(맛·즐거움)는 크기 비교만 보여 주는 그림이다. 연구에 없는 숫자를 붙이지 않는다.
- HUD는 카메라 밖(장면 뿌리)에 그린다. 인물과 소품은 `qCam(cam, …)`, 무대는 `gfLayer(cam, depth, …)`.
- 실제 예: `wonhyo01/long/whgf.js`(장면), `build_wh2.py`(소리).

## 아직 없는 것
- 둥근 한글 글꼴(지금은 Noto Sans 굵은 글씨에 둥근 외곽선). 글꼴 파일을 내려받으려면 운영자 허락이 필요하다.
- 3·4등신 인물 변형, 배경 세트 묶음(집·카페·지하철)은 편을 만들며 늘린다.
