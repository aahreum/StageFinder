# PerformanceCard UI 구현 기록

## 작업 개요
공연 카드 컴포넌트 구현 (Phase 2)

---

## 설계 결정

### FSD 위치: `entities/performance/`
- `PerformanceCard`는 `Performance` 도메인 엔티티의 UI 표현
- 특정 사용자 액션에 종속되지 않으므로 `features/`가 아닌 `entities/`에 위치

### 렌더링 구조
- 포스터 이미지: `next/image` 사용 (최적화)
- poster 필드가 빈 값이면 빈 박스 표시 (이미지 없음 fallback)
- `isOpenRun: true`이면 상태 대신 "오픈런" 표시

### STATUS_COLOR 상수
```ts
const STATUS_COLOR: Record<Performance["status"], string> = {
  예정: "bg-warning/10 text-warning",
  공연중: "bg-success/10 text-success",
  완료: "bg-subtle/10 text-subtle",
};
```
- `globals.css`의 CSS 변수(`--warning`, `--success`, `--subtle`)와 연동
- `Record<Performance["status"], string>` 타입으로 상태 누락 방지

---

## 테스트 전략
- `@testing-library/react` 미설치 환경
- STATUS_COLOR 로직, isOpenRun 분기, props 타입 수준에서 검증
- 렌더링 자체는 다음 작업(`render-performance-list-page`)에서 통합 확인
