# 상식실험실 — 작업 인수인계 (2026-10-30 기준)

새 Claude 세션은 이 문서를 먼저 읽으세요. 이전 대화 내용은 이전되지 않습니다.

**2026-11-01부터 새 편은 `FORMAT.md`(이야기로만 보여 주는 형식)를 따릅니다.**

- 채널: 상식실험실 (UCSNT-TsvhptVyD63_3yn2yg), 운영자 Mingyu (kangmin3414@gmail.com)
- 항상 한국어로 답합니다.
- 캐릭터: 스틱맨 주인공 '제로', 해설 캐릭터 '박사님'. 편마다 철학자 소품(가발 등)을 붙였다 떼는 구성입니다.

## 1. 복원 방법

1. 이 저장소를 받습니다.
2. 미디어(최신 편 이미지, 믹스 FLAC, 014 영상 조각)는 저장소에 같이 들어 있습니다. 014 롱폼 합치기와 FLAC → wav 변환은 MEDIA_MANIFEST.md에 있습니다. 이미 업로드한 영상은 YouTube Studio에서 다운로드합니다.
3. 스크립트 177개에 예전 작업 경로가 하드코딩돼 있습니다. 저장소를 그 경로에 심볼릭 링크로 연결하세요.
   ```
   mkdir -p /tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784
   ln -s "$PWD" /tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad
   ```
4. 인증 키는 저장소에 없습니다. 운영자가 새 환경의 비밀값(secret)으로 넣어야 합니다.
   - `~/.config/gcp/sa.json` : GCP 서비스 계정 키 (프로젝트 `mangyak-tts`). Gemini TTS(목소리), Lyria(BGM), 이미지 생성에 씁니다. `gtts/vx.py`가 토큰을 만듭니다.
   - `~/.config/gtts/key` : Google TTS용 키.
   - 클라우드 세션에서는 파일 대신 환경변수로 넣어도 됩니다: `GCP_SA_JSON`(서비스 계정 JSON 파일 내용 전체), `GTTS_API_KEY`(TTS 키). 파일이 없으면 `vx.py`·`gtts.py`가 이 값을 읽습니다.
   - 키 내용은 절대 출력하거나 공유하지 않습니다.
5. 파이썬 패키지: numpy, scipy, soundfile, librosa, pillow, playwright(크로미움 포함), supertonic, google-auth, requests. 폰트: Noto Sans CJK KR Black, Jua(`thumb3/node_modules/@fontsource/jua`).

## 2. 운영 규칙 (반드시 지킬 것)

- 인증 키를 출력·공유하지 않습니다. 새 인증 정보를 만들거나 보안 설정을 바꾸지 않습니다.
- YouTube Studio에서 '삭제'는 절대 클릭하지 않습니다. 옛 버전은 비공개로 바꾸고 '삭제 예정 (예전 버전)' 재생목록에 넣습니다. 실제 삭제는 운영자가 직접 합니다.
- 태그 칩은 키보드 Backspace로만 지웁니다. X(전체 삭제) 아이콘은 쓰지 않습니다.
- 댓글·커뮤니티 게시물은 운영자의 명시적 승인 후에만 올립니다.
- 운영자가 브라우저를 쓰는 중에는 브라우저를 쓰지 않습니다. 계정을 바꾸지 않습니다.
- 업로드가 진행 중인 탭은 이동하지 않습니다.
- 광범위한 `pkill`을 쓰지 않습니다.
- 크레딧(GCP 무료 크레딧)은 추정하지 말고 운영자가 콘솔에서 확인한 실제 값으로만 보고합니다. 원장: `credits_ledger.json` (Free Trial, 2026-12-21까지).
- 니체(005) 편은 줄이지 않기로 했습니다.
- **영상 안에 채널명을 넣지 않습니다(2026-11-01 운영자 결정).** 채널명이 바뀌면 이미 올린 영상을 고치는 데 비용이 많이 들기 때문입니다.
  - 대본 마지막 인사: "○○실험실이었습니다" 대신 "다음 이야기에서 만나요."
  - 화면 워터마크와 엔딩 카드에서 채널명을 뺍니다(`lonely014/anim014.html` 수정 완료, 새 편은 이 파일을 복사).
  - 쇼츠 태그는 "실험 N"만 씁니다(`replace/build_new12.py`, 쇼츠 표지 `thumbs22/build.py` 수정 완료).
  - 설명란 구독 링크는 핸들(@채널명) 대신 채널 ID 주소를 씁니다: https://www.youtube.com/channel/UCSNT-TsvhptVyD63_3yn2yg?sub_confirmation=1 . 해시태그와 태그에도 채널명을 넣지 않습니다.
  - 내부 파일 이름(`상식실험실_실험0NN_…`)은 시청자에게 보이지 않으므로 그대로 둬도 됩니다.

## 3. 롱폼 현황

| 편 | 영상 ID | 상태 (2026-10-29) | 최신 파일 |
|---|---|---|---|
| 005 니체 | hQU5y76kbSA | 공개 | nietzsche3/…_v4.mp4 |
| 006 스토아 | y8A1cGWRh2k | 공개 | stoic3/…_v5.mp4 |
| 007 데카르트 | Hnv5DGK-6tQ | 10/30 18:00 예약 | descartes4/…_v9.mp4 (새 인트로) |
| 008 장자 | LDiQlSjL7lE | 11/2 18:00 예약 | zhuangzi5/…_v9.mp4 (새 인트로) |
| 009 소크라테스 | koloX4KIqsU | 11/5 18:00 예약 | socrates3/…_v6.mp4 |
| 몰아보기 01 | rb3sjnqgHmI | 11/5 08:30 예약 (10/31 최신본으로 재업로드, 옛 aMiFhQmHr2k는 비공개·삭제 예정) | compile1/…철학실험4편_v2.mp4 (006 v5·007 v9·008 v9·009 v6) |
| 010 붓다 | Rw5mOgqfHVw | 11/8 18:00 예약 | buddha3/…_v6.mp4 |
| 011 시간 | NlnVZppG1d8 | 11/11 예약 | time011/…_v2.mp4 |
| 012 화 | wlCrcVEqozo | 11/14 예약 | anger012/…_v1.mp4 |
| 013 행복 | LkDF-NVtk2w | 11/17 예약 | mom013/…_v1.mp4 |
| 014 외로움(쇼펜하우어 고슴도치) | 미업로드 | 다음 순서(11/20 18:00 제안) | lonely014/…_v1.mp4 + 쇼츠 3개(replace/out_new6) |
| 015 쇼펜하우어 2탄 | 대본 단계 | 014 다음 | claude.ai 문서 "실험015 쇼펜하우어 대본 v2" |
| 016 아리스토텔레스 습관 | 대본 완성(제작 전) | 015 다음 | `aristotle016/script.py`, 제작 안내 `aristotle016/PRODUCTION.md` |
| 017 공자 · 나이 들어 배우기 | 대본 완성(제작 전) | 016 다음 | `learning017/script.py`, 제작 안내 `learning017/PRODUCTION.md` |
| 018 키르케고르 · 결정 장애 | 대본 v4 완성(제작 전, 약 8:20) | 017 다음 | `choice018/script.py`, 제작 안내 `choice018/PRODUCTION.md` |
| (보류) 맹자 호연지기 | 운영자 피드백: 이해가 어렵고 와닿지 않음 → 보류 | — | `_shelved/mencius_draft/` |

### 특별편 (다른 세션, 제작 완료 · 번호 미정 · 2026-11-01 운영자: 버리지 않고 별도로 살림)
번호는 위 정규 편(016~018)과 겹치지 않게 공개 때 정합니다. 영상 안 채널명은 11/1 규칙에 맞춰 제거 작업 중(워터마크·엔딩 카드·마지막 인사).
| 특별편 | 상태 | 파일 |
|---|---|---|
| 맹자 (호연지기, 주눅) — 제작 완료본 | main에서 보류 결정 → 공개하지 않음(참고용) | mencius016/…_v1.mp4 (media/016) |
| 공자 · 호감 가는 대화법(캐치볼) | 제작 완료(8:37) | confucius017/ (media/017) |
| 만약에 한국 사람이 일본에서 30년을 산다면 (그림책 다큐) | 제작 완료(8:42) | japan018/ (media/018) · 인스타 instagram/018 |
| 이건희 일대기 (기업가 전기, 계단 5칸) | 제작 완료(v2 8:05, 제목=썸네일=훅) | leekunhee019/ (media/019) · 인스타 instagram/019 |
| 10억 년 버튼 (제로가 버튼 안 10억 년을 겪는 이야기, 그림책) | 기획 v1 (2026-11-02) | billionbutton/기획_v1.md |
| 소원이 다 이루어지는 방 (1,000년의 권태 → 반지하를 고른 제로) | 대본 1차 (2026-11-03, 2,771자) | wishroom/script.py · script_read.md |
- 이 세션의 교훈(새 형식에도 적용): 제목·썸네일·훅은 같은 장면 / 장면마다 첫 문장이 앞 장면을 이어받기 / 너무 빠르지 않게(초당 7자 안팎, 줄 사이 0.7초) / 밝은 배경 / Lyria 곡은 쓰기 전 `tools/bgm_voice_check.py` 로 목소리 검사 / 탁자·의자·손 위치 등 장면 논리(`sangsik-scene-qa`).
- 인스타그램 운영안: `instagram/인스타_운영안_v1.md`.

- 003(휴대폰)·004(설탕) 편과 그 쇼츠는 채널에서 비공개 상태입니다.
- 옛 버전(삭제 예정): aMiFhQmHr2k(몰아보기 01 구버전), aK6qUwZtAbM, Ux8ePpM0Skg, BdUjt0_eXbk, jUpuaUHNPR8 외 다수, DsFAsvtRaU0.
- 메타데이터·ID 기록: `replace/lf_repl.json`, `replace/shorts_repl7.json`, `replace/shorts_repl8.json`, `replace/remix006_repl.json`, `abthumb/ab_plan.json`.

## 4. 썸네일 A/B 테스트 (진행 중)

- 니체·스토아·소크라테스·붓다: 기존 / U(공감형) / T(궁금증형)
- 데카르트·장자(새 업로드): U(대표) / 예전 D1 / T
- 파일: `thumbS/U_*.jpg`, `thumbS/T_*.jpg`, `abthumbD/D_*_1.jpg`. 생성 스크립트 `thumbS/mk3~6.py`.

## 5. 쇼츠

- 하루 1~2개, 11/30까지 예약돼 있습니다. 편별 최신 파일은 각 `replace/out_new*` 폴더의 가장 최근 파일입니다(이름 규칙 `쇼츠_<편>[vN]-<번호>_<이름>.mp4`).
- 2026-10-29 스토아 리컷 3개(`replace/build_remix006.py`, 결론 구간 먼저 + 1.15배속 + 엔딩 카드 없음):
  - xgiTgobfJTI (공개, 옛 I7INlBVr9lE 대체)
  - RhBRD3ypSaE (10/30 12:00, 옛 F5nQoXnB27U 대체)
  - d4laRzFAg0g (11/1 19:00, 옛 _QrDpjHAc-8 대체)
  - 할 일: 10/30쯤 xgiTgobfJTI 반응을 확인해 리컷 효과를 운영자에게 보고.
- 분석: 잘된 쇼츠는 조회의 약 95%가 쇼츠 피드에서 옵니다. 썸네일보다 첫 1~2초 훅이 중요합니다.

## 6. 주요 결정과 배경

- 롱폼 시청 지속률이 50% 미만 → 핵심 질문을 20초 안에 꺼내는 인트로로 재구성(007·008 v9 적용, 009·010은 대본만 준비).
- 일본어 채널은 별도 채널로 니체 편 파일럿을 검토했지만 보류 중입니다.
- 새 대본을 쓸 때는 001~014 대본(`*/script.py`)과 내용이 겹치지 않는지 grep으로 먼저 확인합니다. 015는 014와 겹치던 헤겔 일화, 푸들, 고독 인용, 혼자 15분을 뺐습니다.

## 7. 작업 절차 요약

- 제작: 각 편 폴더의 `script.py`(대본 튜플) → TTS(`gtts/`) → `render*.py`/`anim*.html`(Playwright) → `mix*.py` → 최종 mp4 + srt. 품질 점검은 `qa_review/FIX_RECIPE.md`.
- 쇼츠: `replace/build_newN.py` + `plan_newN.json`을 복사해 씁니다. 아웃트로 음성은 `replace/outro_keep`.
- Studio 업로드 (Claude in Chrome):
  - 10MB 이하 파일은 업로드 대화상자의 file input에 바로 올립니다.
  - 더 큰 파일은 `replace/split_upload.py`로 9.4MB 조각으로 나눈 뒤 브라우저에서 Blob으로 합치고 sha256을 확인합니다.
  - 업로드 페이지는 Trusted Types 때문에 eval이 막혀 있습니다. 헬퍼 코드는 직접 붙여 넣어야 합니다.
  - 제목과 설명은 `execCommand('insertText')`로 넣습니다. '아동용 아님'을 확인합니다.
  - 예약: 다음 ×3 → 예약 펼치기 → 날짜 입력(`2026. MM. DD.` + Enter) → 시간 항목 클릭 → 값 확인 → '예약'. 시간이 '오전 12:00'(자정)으로 기본 설정되는 함정에 주의합니다.
- 옛 버전 비공개: 편집 페이지에서 `eval(localStorage.getItem('__privsrc'))`를 실행합니다(브라우저 localStorage에 저장된 스크립트). 반드시 활성 탭에서 실행합니다.
- 재생목록: 제로의 실험 전체(처음부터 보기) + 🏛️ 철학자처럼 살아 보기 + (흔들리는 마음 | 관계와 외로움 | 시간과 습관).
- 엔딩 화면: 템플릿 '동영상 1개, 구독 1개'. 예약된 영상은 직접 고를 수 없어 템플릿을 씁니다.
- 자막: 자막 편집 → ⋮ → 파일 업로드 → 타이밍 포함 → srt → 게시.
- A/B: 'A/B 테스팅' → '썸네일만' 탭 → 2·3번 칸 업로드 → 테스트 설정 → 저장.

## 8. 작업용 스킬 (2026-10-30 추가)

저장소 `.claude/skills/`에 이 채널 전용 스킬이 있습니다. 새 세션에서 자동으로 불러옵니다.
- `sangsik-script` — 대본 작성·평가·사실 확인(원문 인용, 연구 재현 여부, 겹침 grep, 20초 훅, 분량 2,850~2,950자)
- `sangsik-scene-qa` — 장면 논리 점검(peek3.py 세 시점 캡처 + 016에서 나온 오류 체크리스트)
- `sangsik-production` — 대본→TTS→장면→믹스→렌더→자막 순서와 명령, 키·크레딧 규칙
- `sangsik-upload` — 업로드 문구 형식, Studio 운영 규칙, 썸네일, 쇼츠

새 편 폴더는 `python3 tools/new_episode.py <폴더> <번호> <파일용제목>`으로 016 틀을 복사해 시작합니다.
