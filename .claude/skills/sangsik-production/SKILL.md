---
name: sangsik-production
description: 상식실험실 롱폼을 실제로 만드는(대본 → 목소리 → 장면 → 믹스 → 렌더 → 자막) 순서와 명령어. "영상 만들어", "렌더링", "TTS", "목소리", "새 편 시작", "다시 렌더" 를 할 때 먼저 읽는다. 키 설정, 비용(무료 크레딧) 기록, 디스크·CPU 주의점 포함.
---

# 상식실험실 롱폼 제작 파이프라인

기준 편: `mencius016/` (2026-10-29 완성, 8:25). 새 편은 이 틀을 복사해서 시작한다.

## 0. 환경 준비 (새 세션마다)
1. HANDOFF.md 복원 절차: 예전 경로 심볼릭 링크
   `mkdir -p /tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784 && ln -sfn "$PWD" /tmp/claude-0/-home-claude/8ea42618-92c7-5880-934a-1a398f438784/scratchpad`
2. 패키지: `pip install scipy soundfile librosa google-auth supertonic faster-whisper "playwright==<노드 playwright 버전>"`
   - 파이썬 playwright 버전은 미리 깔린 크로미움과 맞춰야 한다: `node -p "require('playwright/package.json').version"` 의 버전으로 설치. `playwright install` 은 하지 않는다.
3. 폰트: `apt-get update && apt-get install -y fonts-noto-cjk fonts-noto-cjk-extra` (Noto Sans CJK KR Black).
4. 키 (절대 출력·커밋 금지):
   - `~/.config/gcp/sa.json` (GCP 서비스 계정, 프로젝트 mangyak-tts) 또는 환경변수 `GCP_SA_JSON`(JSON 내용 전체). `gtts/vx.py`가 둘 다 읽는다.
   - 확인: `cd gtts && python3 -c "import vx; vx.token(); print('ok')"`
   - 운영자가 키 파일을 채팅에 올리면 `~/.config/gcp/sa.json`에 복사하고 `chmod 600`. 저장소 안에 두지 않는다.
5. 비용: **GCP 무료 크레딧(Free Trial, 2026-12-21까지)만** 쓴다. 쓸 때마다 `credits_ledger.json`의 `estimates`에 추정치를 적고, 남은 크레딧은 운영자가 콘솔에서 본 값으로만 보고한다(추정해서 말하지 않는다). Gemini TTS 롱폼 1편 ≈ $0.2, Nano Banana 2K 그림 1장 ≈ $0.07, Lyria 곡 1개 ≈ $0.08.
   유료 서비스(vidIQ·TubeAlfred 크레딧 등)는 운영자 허락 없이 쓰지 않는다.

## 1. 새 편 폴더
```bash
python3 tools/new_episode.py <폴더> <번호> <파일용제목>     # 예: xunzi017 017 순자_환경이사람을만든다
```
script.py(빈 틀), anim/scenes/render/mix/srt/tts 스크립트, peek 도구, .gitignore, 폰트까지 만든다.

## 2. 순서
| 단계 | 명령 (편 폴더에서) | 비고 |
|---|---|---|
| 대본 | `script.py` 작성 | **sangsik-script 스킬** 먼저 |
| 장면 초안 | `python3 fake_tl.py` → scenes<번호>.js 작성 → `python3 peek.py timeline_fake.json _p.jpg` | 목소리 없이 글자 수 타임라인으로 개발 |
| 목소리(최종) | `python3 tts38seg.py all > tts38.log 2>&1` (백그라운드) | Gemini 3.8 Flash TTS. 77줄 ≈ 15분. Whisper(CER)로 검사, 0.12 넘으면 최대 3번 재녹음. 결과 `tts38_report.json`, `timeline.json`, `voice.wav` |
| 목소리(키 없을 때 초벌) | `python3 tts_st.py all > tts.log 2>&1` | supertonic 로컬·무료. 느림(77줄 ≈ 70분), 말이 빨라 Gemini보다 약 15% 짧다 |
| 발음 확인 | `tts38_report.json`에서 cer > 0.1 인 줄 확인 | 대부분 Whisper 받아쓰기 차이. 진짜 오발음은 script.py 4번째 칸(spoken)에 발음 표기를 넣고 그 줄만 다시. 자막과 발음이 달라지면 자막도 맞춘다 |
| 장면 점검 | `python3 peek3.py timeline.json _a1.jpg 0 12` … | **sangsik-scene-qa 스킬** 필수 |
| 곡 검사 | `python3 tools/bgm_voice_check.py bgm/<곡>.mp3` | **새 곡은 쓰기 전에 반드시.** Lyria가 "no vocals"여도 희미한 영어 속삭임을 넣는다. `cand_1_piano_a`, `cand_4_celesta_a` 는 쓰지 않는다(017에서 운영자가 발견) |
| 믹스 | `python3 mix<번호>.py` | 곡: `bgm/cand_*.mp3`(Lyria). 전환 줄 번호·효과음 위치를 편에 맞게. 결과 `mix.wav` |
| 렌더 | `P=4 ./render_all.sh > render.log 2>&1` (백그라운드) | 24fps, 4개 병렬. 8분 영상 ≈ 65분 |
| 합치기 | `./finalize.sh` | loudnorm -16 LUFS, x264 crf 19 |
| 자막 | `python3 srt<번호>.py` | srt + 장면별 시작 시각 출력(타임라인용) |
| 확인 | 완성본에서 프레임 8장 뽑아 보기, `ffmpeg -af ebur128`로 음량 | |
| 보관 | `ffmpeg -i mix.wav -c:a flac mix.flac`, 영상은 `split -b 90m` 으로 `media/<번호>/`에 조각 커밋 | GitHub 100MB 제한 |

- 백그라운드 작업이 끝나길 기다릴 땐 `until grep -q ... log; do sleep 10; done` 을 run_in_background로. foreground sleep 금지.
- 장면만 고친 경우: 목소리·타임라인은 그대로 두고 렌더부터 다시. 일부 줄만 고쳤다면 그 줄의 프레임 범위(`(t0-0.3)*24 ~ t1*24`)만 `python3 render<번호>.py A B frames` 로 다시 그리고 `./finalize.sh`.
- 초벌 → 최종 목소리로 바꿀 땐 `timeline.json`을 `timeline_st.json`으로 보관 후 진행. 믹스·렌더·자막을 모두 다시.

## 3. 장면 엔진 요약
- `anim<번호>.html`이 `../shorts/engine.js`와 001~014 장면 파일을 순서대로 읽는다(공용 도구가 그 안에 있음). `render(t)`가 한 프레임을 그린다.
- 장면 함수 이름 = scene + `Scene`, 인자 `(t, lt, a)`: t=절대 시간, lt=줄 시작 기준 시간, a=args(+`_dur`).
- 문장 속 단어 위치로 타이밍: `fracOf13(t, '단어') * D` (016의 `at16`).
- 캐릭터: `char({x, y(발 위치), s, pose, ex: exprAt([[0,'표정']], t), look})`. 포즈 `P[...]`, 표정 `E[...]`를 늘려 쓸 수 있다. 박사 `doctor(x, y, s, {t, expr, talk: env(t)})`.
- 오른쪽 위 HUD는 `render`를 감싸서 덧그린다(016 `hud16`).

## 4. 하지 말 것
- 배경을 어둡고 칙칙하게 만들지 않는다(운영자 요청, 017부터). 연구실은 밝은 크림·민트(`shorts/bright.js`의 `labBg`), 밤 방은 연보라 남색에 따뜻한 스탠드 빛, 실험 카드·마무리 화면은 크림색. 비네트는 약하게(.18), 자막 띠는 그라데이션. new_episode.py가 자동으로 넣는다. 슬픈 장면도 화면 전체를 어둡게 덮지 말고(dim은 0.3 이하) 표정·음악으로.
- 화면이 이글거리는 boil 필터(`anim*.html`의 `<g filter="url(#boil)">`)는 쓰지 않는다(운영자 요청, 017부터). new_episode.py가 자동으로 뺀다.
- 광범위한 `pkill`/`killall` 금지(다른 작업의 ffmpeg·chromium도 죽는다). 내가 띄운 PID만.
- 프레임 폴더·wav·mp4·node_modules·segs/tts38 은 커밋하지 않는다(.gitignore). 영상은 media 조각으로만.
- 커밋 메시지·코드에 모델 이름을 쓰지 않는다.
