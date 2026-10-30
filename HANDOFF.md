# 상식실험실 — 작업 인수인계 (2026-10-29 기준)

새 Claude 세션은 이 문서를 먼저 읽으세요. 이전 대화 내용은 이전되지 않습니다.

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

## 3. 롱폼 현황

| 편 | 영상 ID | 상태 (2026-10-29) | 최신 파일 |
|---|---|---|---|
| 005 니체 | hQU5y76kbSA | 공개 | nietzsche3/…_v4.mp4 |
| 006 스토아 | y8A1cGWRh2k | 공개 | stoic3/…_v5.mp4 |
| 007 데카르트 | Hnv5DGK-6tQ | 10/30 18:00 예약 | descartes4/…_v9.mp4 (새 인트로) |
| 008 장자 | LDiQlSjL7lE | 11/2 18:00 예약 | zhuangzi5/…_v9.mp4 (새 인트로) |
| 009 소크라테스 | koloX4KIqsU | 11/5 18:00 예약 | socrates3/…_v6.mp4 |
| 몰아보기 01 | aMiFhQmHr2k | 11/7 예약 | compile1/…철학실험4편.mp4 |
| 010 붓다 | Rw5mOgqfHVw | 11/8 18:00 예약 | buddha3/…_v6.mp4 |
| 011 시간 | NlnVZppG1d8 | 11/11 예약 | time011/…_v2.mp4 |
| 012 화 | wlCrcVEqozo | 11/14 예약 | anger012/…_v1.mp4 |
| 013 행복 | LkDF-NVtk2w | 11/17 예약 | mom013/…_v1.mp4 |
| 014 외로움(쇼펜하우어 고슴도치) | 미업로드 | 다음 순서(11/20 18:00 제안) | lonely014/…_v1.mp4 + 쇼츠 3개(replace/out_new6) |
| 015 쇼펜하우어 2탄 | 대본 단계 | 014 다음 | claude.ai 문서 "실험015 쇼펜하우어 대본 v2" |
| 016 아리스토텔레스 습관 | 대본 완성(제작 전) | 015 다음 | `aristotle016/script.py`, 제작 안내 `aristotle016/PRODUCTION.md` |
| 017 공자 · 나이 들어 배우기 | 대본 완성(제작 전) | 016 다음 | `learning017/script.py`, 제작 안내 `learning017/PRODUCTION.md` |
| (보류) 맹자 호연지기 | 운영자 피드백: 이해가 어렵고 와닿지 않음 → 보류 | — | `_shelved/mencius_draft/` |

- 003(휴대폰)·004(설탕) 편과 그 쇼츠는 채널에서 비공개 상태입니다.
- 옛 버전(삭제 예정): aK6qUwZtAbM, Ux8ePpM0Skg, BdUjt0_eXbk, jUpuaUHNPR8 외 다수, DsFAsvtRaU0.
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
