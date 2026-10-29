# 미디어 묶음

용량이 큰 미디어는 git에 넣지 않고, 이 저장소의 GitHub 릴리스 `media-2026-10-29`에 tar 파트로 올립니다. 2GB 넘는 묶음은 `.partNN`으로 나뉘어 있습니다.

| 묶음 | 내용 | 파일 수 | 크기 |
|---|---|---|---|
| media-longform | 편별 최신 롱폼 mp4(004~014, 몰아보기 01, 채널 트레일러) + 최신 자막 srt | 24 | 2.4GB |
| media-shorts | 편별 최신 쇼츠 mp4 + 스토아 리컷 3개 | 78 | 0.65GB |
| media-audio | 편별 최신 믹스 wav, BGM 후보 mp3, 쇼츠 아웃트로, 목소리 샘플 | 72 | 2.3GB |
| media-images | AI 장면 이미지, 캐릭터·브랜드 원본, 썸네일 (렌더 프레임·QA 이미지 제외) | 4,326 | 1.65GB |

각 묶음에 든 파일 목록은 `media_lists/*.txt`에 있습니다(저장소 루트 기준 경로).

## 받는 법

```
gh release download media-2026-10-29 -p 'media-*'
for b in longform shorts audio images; do cat media-$b.tar* | tar -xf -; done
```

## 들어 있지 않은 것

렌더 프레임, 중간 녹음 조각, 예전 버전 영상, QA 캡처는 옮기지 않았습니다. 필요하면 각 편의 스크립트로 다시 만들 수 있습니다.
