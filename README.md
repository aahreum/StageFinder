# 🎭 Stage Finder

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

이 프로젝트는 단순한 기능 구현을 넘어
**AI 에이전트 기반 개발 방식(Agentic Coding)**을 실험하기 위해 만들어졌습니다.

- Self-Tasking: todo.md를 분석하여 우선순위에 따라 작업을 스스로 선택합니다.
- Implementation: 선택한 작업에 최적화된 코드를 고민하고 구현합니다.
- Git Workflow: 기능 구현 후 브랜치 생성(branch), 커밋(commit), PR(gh pr create)까지의 협업 과정을 자동화합니다.
- Iterative Refinement: 구현된 코드를 스스로 검토하고 지속적인 개선안을 제시합니다.

---

## 🧪 Harness Coding (검증 기반 개발)

신뢰할 수 있는 결과물을 위해 Harness Coding(검증 기반 개발) 방식을 엄격히 적용합니다. 모든 기능은 '구현'보다 '검증'에 무게를 둡니다.

- Pre-definition: 코드를 작성하기 전, 반드시 기대 동작과 성공 기준(Success Criteria)을 먼저 정의합니다.
- Compliance: 정의된 검증 조건을 완벽히 충족하는 방향으로 기능을 구현합니다.
- Verification & Loop: 구현 직후 실제 동작을 검증하고, 기대치에 미치지 못할 경우 즉시 개선 루프를 실행합니다.

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
