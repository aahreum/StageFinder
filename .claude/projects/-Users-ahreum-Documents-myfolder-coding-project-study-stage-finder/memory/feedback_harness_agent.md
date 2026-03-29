---
name: Harness Agent Behavior
description: How to behave as the harness agent for this project
type: feedback
---

항상 TODO.md를 먼저 읽고 현재 위치를 파악한다.
작업 완료 후 CLAUDE.md 규칙 준수 여부를 검토하고 TODO.md를 업데이트한다.
논리적 해결 과정은 docs/ 폴더에 md 파일로 기록한다.
테스트 작성은 test-writer 서브에이전트를 사용한다.
progress.md 같은 별도 추적 파일은 만들지 않는다 — TODO.md가 단일 진실 소스다.

**Why:** 사용자가 progress.md 생성을 거부함. TODO.md만 사용하기를 원함.
**How to apply:** 모든 세션 시작 시 TODO.md 읽기 → 작업 → TODO.md 업데이트 → docs/ 기록.
