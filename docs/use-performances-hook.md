# usePerformances Hook 구현 기록

## 작업 개요
TanStack Query 기반 `usePerformances` hook 구현 (Phase 2)

---

## 논리적 충돌 및 해결 과정

### 충돌 1: TanStack Query 미설치
- **상황**: TODO에 "TanStack Query 기반 hook 구현" 명시되어 있으나 `package.json`에 의존성 없음
- **선택지**: A) 설치 후 구현 / B) 네이티브 React hook으로 대체
- **결정**: 사용자 승인 후 A 선택 → `pnpm add @tanstack/react-query@5`

### 충돌 2: 테스트에서 queryFn 접근 불가
- **상황**: `useQuery()` 반환값(`UseQueryResult`)에는 `queryFn`, `queryKey` 프로퍼티가 없음
- **해결**: `getPerformancesQueryOptions` 함수를 분리 export
  - 테스트와 향후 prefetch에서도 재사용 가능
  - `usePerformances`는 내부에서 이를 호출

### 충돌 3: vi.mock 호이스팅 오류
- **상황**: `const mockFn = vi.fn()` → `vi.mock(factory)` 순서로 작성했으나 vitest가 `vi.mock`을 파일 최상단으로 호이스팅하여 `mockFn`이 초기화 전에 참조됨
- **해결**: `vi.hoisted(() => ({ mockFetchPerformances: vi.fn() }))` 사용

---

## 구현 구조

```
src/
├── shared/lib/
│   └── query-provider.tsx       # QueryClientProvider 래퍼 (클라이언트 컴포넌트)
├── entities/performance/
│   ├── use-performances.ts      # getPerformancesQueryOptions + usePerformances
│   └── use-performances.test.ts # 6개 테스트 케이스
└── app/
    └── layout.tsx               # QueryProvider로 children 래핑
```

## 설계 결정

- `getPerformancesQueryOptions` 분리: 테스트 용이성 + 서버 컴포넌트 prefetch 대비
- QueryClient는 `useState`로 생성: SSR 시 요청 간 공유 방지
