# render-performance-list-page 구현 기록

## 작업 개요
공연 리스트 페이지 구현 (Phase 2 마지막)

---

## 논리적 충돌 및 해결 과정

### 충돌 1: Vitest `@/` 경로 alias 미설정
- **상황**: `vitest.config.ts`가 없어서 `@/entities/performance` 등을 resolve하지 못함
- **해결**: `vitest.config.ts` 생성 후 `resolve.alias`에 `@` → `./src` 매핑

### 충돌 2: 트랜지티브 Supabase 초기화 에러
- **상황**: `PerformanceList` import → `usePerformances` → `@/shared` → `supabase.ts` → 환경변수 없어 throw
- **해결**: 테스트에서 `@/entities/performance`, `@/shared` mock 처리

---

## 구현 구조

```
src/
├── app/page.tsx                          # 라우팅만 담당 (getTodayParams + PerformanceList 조합)
└── widgets/performance-list/
    ├── performance-list.tsx              # usePerformances + PerformanceCard 조합 위젯
    ├── performance-list.test.ts          # 날짜 로직 + export 검증
    └── index.ts
```

## 설계 결정

- `app/page.tsx`는 비즈니스 로직 없이 위젯만 호출 (CLAUDE.md: "Do NOT put business logic in app/")
- `PerformanceList`는 `widgets/`에 위치: entities의 card + hook을 조합하는 UI 조합 컴포넌트
- 기본 파라미터: 오늘 ~ 3개월 후, 공연중(`prfstate: "02"`)
