# 🎪 Stage Finder

공연 정보를 탐색하고, 관심 조건에 맞는 신규 공연이 등록되면 알림을 받을 수 있는 웹 서비스입니다.

---

## ✨ 주요 기능

- 공연 리스트 조회
- 공연 검색 및 필터 (장르, 지역, 날짜)
- 사용자 위치 기반 공연 추천
- 관심 키워드 기반 공연 알림 (이메일)

---

## 🛠️ 기술 스택

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (DB + Edge Functions + Cron)
- KOPIS Open API
- Resend

---

## 🤖 Agentic Coding

이 프로젝트는 AI 에이전트 기반 개발(Agentic Coding)을 실험하기 위해 설계되었습니다.

- Self-Tasking: todo.md를 분석해 우선순위에 따라 작업을 스스로 선택
- Implementation: 선택한 작업에 최적화된 코드를 작성
- Git Workflow: 브랜치 생성, 커밋, PR까지 자동화
- Iterative Refinement: 구현한 코드를 검토하고 개선안 제시

---

## 🧪 Harness Coding (검증 중심 개발)

신뢰할 수 있는 결과물을 위해 검증 중심 개발(Harness Coding) 방식을 적용했습니다.

- Pre-definition: 기능 구현 전 기대 동작과 성공 기준 정의
- Compliance: 정의된 검증 조건을 충족하도록 기능 구현
- Verification & Loop: 구현 직후 동작 검증, 미충족 시 즉시 개선

---

## 📂 프로젝트 구조 (FSD)

```bash
/root
  ├── README.md
  ├── CLAUDE.md
  ├── todo.md
  └── src/
       ├── app/        # Next.js App Router (route, layout 전용)
       ├── shared/     # 공통 코드 (ui, lib, api 등)
       ├── entities/   # 도메인 모델 (performance 등)
       ├── features/   # 기능 단위 (filter, search 등)
       ├── widgets/    # UI 조합 단위
       └── pages/      # 페이지 조합 레이어 (optional)
```

### 구조 설명

- **app/**
  Next.js App Router 전용 레이어로, 라우팅과 레이아웃만 담당합니다.
- **shared/**
  재사용 가능한 공통 코드들을 관리합니다. (UI, API, 유틸 등)
- **entities/**
  핵심 도메인 데이터 모델을 정의합니다. (예: 공연)
- **features/**
  사용자 인터랙션 단위 기능을 구현합니다. (검색, 필터 등)
- **widgets/**
  여러 feature를 조합한 UI 블록을 구성합니다.
- **pages/**
  페이지 단위 조합 레이어 (필요 시 사용)

---

## ⚙️ 개발 방식

이 프로젝트는 다음과 같은 흐름으로 개발됩니다.

1. `todo.md`에서 작업 선택
2. 최소 단위로 기능 구현
3. 검증 (Harness)
4. Git workflow 수행 (PR 생성)
5. 개선 및 리팩토링

---

## 📌 특징

- 서버리스 기반 구조 (Supabase)
- 외부 API(KOPIS) 연동
- 위치 기반 데이터 처리
- 이메일 알림 시스템
- 에이전틱 개발 방식 적용

---
