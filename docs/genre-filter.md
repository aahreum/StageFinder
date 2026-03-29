# implement-genre-filter 구현 기록

## 작업 개요
장르 필터 UI + 클라이언트 필터링 로직 구현 (Phase 3)

---

## 설계 결정

### FSD 위치
- `features/genre-filter/` — 사용자 액션(장르 선택)이므로 features 레이어
- 필터 상태(`selectedGenre`)는 `PerformanceList` 위젯에서 관리 — 리스트와 필터가 함께 작동하는 단위

### 필터링 방식: 클라이언트 사이드
- 이미 fetch된 데이터를 `useMemo`로 필터링
- API 재호출 없음 (CLAUDE.md: "API 호출 최소화")

### 장르 목록
- 별도 API 없이 fetch된 데이터에서 `Set`으로 중복 제거 후 정렬
- 데이터가 없으면 필터 버튼 자체가 렌더링되지 않음 (자연스러운 처리)
