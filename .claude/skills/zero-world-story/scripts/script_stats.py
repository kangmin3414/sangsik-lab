#!/usr/bin/env python3
"""제로의 세계 대본(대본_vN.md)의 글자 수·예상 길이·화자·구간을 계산한다.

대본 줄 형식: `12. **나레이션** 말` 또는 `5. **태호** "말"`, 구간 제목: `## [00:15 ~ 00:45] 재미: ...`
사용법: python3 script_stats.py 대본_v1.md [--silent 30] [--rate 255] [--voices]

- 글자 수는 공백·문장부호를 뺀 값(HANDOFF 기준과 같다).
- 말하는 속도 기본 255자/분: ai01·gift01 실제 타임라인에서 잰 값(줄 사이 쉼 포함).
- --silent: 말 없는 장면 초(기본 30). 총 길이 = 말 + 말 없는 장면.
- --voices: 화자별 목소리 배정 표(아래 VOICES)와 맞는지 확인.
"""
import argparse
import re
import sys

LINE = re.compile(r"^\s*(\d+)\.\s*\*\*([^*]+)\*\*\s*(.*)$")
SECTION = re.compile(r"^##\s*(\[[^\]]*\])?\s*(.*)$")

# 고정 목소리(HANDOFF·zero-world-longform). 편마다 새 인물은 lines_*.py에서 정한다.
VOICES = {"나레이션": "Schedar", "내레이션": "Schedar", "제로": "Puck", "팀장": "Charon", "박사": "Sadaltager"}


def count(s):
    return len(re.sub(r"[\s\W_]", "", s))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--silent", type=float, default=30)
    ap.add_argument("--rate", type=float, default=255)
    ap.add_argument("--voices", action="store_true")
    a = ap.parse_args()
    sections, cur, speakers, total, nums = [], None, {}, 0, []
    for raw in open(a.file, encoding="utf-8"):
        sm = SECTION.match(raw)
        if sm and raw.startswith("## "):
            cur = [(sm.group(2) or "").strip() or raw.strip(), 0, 0]
            sections.append(cur)
            continue
        m = LINE.match(raw)
        if not m:
            continue
        n, who, body = int(m.group(1)), m.group(2).strip(), m.group(3).strip().strip('"“”')
        who = re.sub(r"\(.*?\)", "", who).strip()
        c = count(body)
        total += c
        nums.append(n)
        speakers[who] = speakers.get(who, 0) + c
        if cur:
            cur[1] += c
            cur[2] += 1
    if not nums:
        print("대본 줄을 찾지 못했다. 형식: `1. **화자** 말`")
        sys.exit(2)
    speech = total / a.rate * 60
    tot = speech + a.silent
    print(f"줄 {len(nums)}개 · 말 {total}자(공백·문장부호 제외)")
    print(f"예상: 말 {speech/60:.0f}분 {speech%60:02.0f}초 + 말 없는 장면 {a.silent:.0f}초 = 약 {tot//60:.0f}분 {tot%60:02.0f}초 ({a.rate:.0f}자/분 기준)")
    gaps = [b for a_, b in zip(nums, nums[1:]) if b != a_ + 1]
    if gaps or nums[0] != 1:
        print(f"주의: 줄 번호가 1부터 이어지지 않는다(끊긴 곳 다음 번호: {gaps or [nums[0]]})")
    print("\n구간별:")
    for name, c, k in sections:
        print(f"  - {name}: {k}줄, {c}자, 약 {c/a.rate*60:.0f}초")
    print("\n화자별:")
    for who, c in sorted(speakers.items(), key=lambda x: -x[1]):
        v = VOICES.get(who)
        tag = f" → {v}" if v else (" → (편별 배정 필요)" if a.voices else "")
        print(f"  - {who}: {c}자 ({c/total*100:.0f}%){tag}")
    if a.voices:
        print("\n목소리 규칙: 박사는 Sadaltager(칠십 대 할아버지), 여자 목소리 금지. 새 인물은 lines_*.py에 고정하고 HANDOFF에 적는다.")


if __name__ == "__main__":
    main()
