# 필터 데이터 흐름

> 작성일: 2026-03-29

---

## 개요

공연 리스트의 필터 + 페이지네이션은 아래 순서로 동작한다.

```
KOPIS API → 전체 데이터(200개) → 장르 필터 → 클라이언트 페이지네이션 → 렌더링
```

---

## 단계별 흐름

### 1. 전체 데이터 fetch

`usePerformances`가 KOPIS API를 한 번 호출한다.

```
params: { stdate, eddate, cpage: 1, rows: 200 }
→ KopisPerformanceRaw[] (최대 200개)
→ Performance[] (toPerformance로 정규화)
```

- `cpage`는 고정값 `1` (클라이언트 페이지네이션 사용)
- `rows: 200`으로 3개월치 데이터를 한 번에 조회
- TanStack Query가 캐싱 — 페이지 이동 시 재요청 없음

### 2. 장르 목록 추출

전체 데이터에서 중복 없는 정렬된 장르 목록 생성.

```
list (200개) → getUniqueGenres(list.map(p => p.genre))
→ ['뮤지컬', '서양음악(클래식)', '연극', ...]
```

- 페이지 변경과 무관하게 항상 동일한 genres 유지 → FilterBar 항상 렌더링

### 3. 장르 필터 적용

선택된 장르로 전체 데이터를 필터링한다.

```
list (200개) + selectedGenre ('뮤지컬')
→ filterByGenre(list, selectedGenre)
→ filtered (예: 45개)
```

- `selectedGenre`는 URL slug에서 변환: `slugToGenre(searchParams.get('genre'))`
- `selectedGenre === null`이면 전체 반환

### 4. 클라이언트 페이지네이션

필터된 결과를 20개씩 슬라이싱한다.

```
filtered (45개) + page (2)
→ totalPages = Math.ceil(45 / 20) = 3
→ paginatedList = filtered.slice(20, 40)  → 20개
→ hasMore = page(2) < totalPages(3) = true
```

- `totalPages` 기준으로 next 버튼 비활성화
- `page === 1`이면 prev 버튼 비활성화

### 5. 렌더링

```
paginatedList (20개) → PerformanceCard × 20
genres → FilterBar (항상 렌더링)
page, hasMore → Pagination
```

---

## URL 상태

| 파라미터 | 값 예시 | 설명 |
|---|---|---|
| `genre` | `musical` | 영어 slug (genreToSlug 변환) |
| `page` | `2` | 현재 페이지 번호 |

장르 변경 시 `page`는 `null`로 초기화 (1페이지로 리셋).

---

## 한계

- KOPIS API에서 최대 `rows: 200`만 조회하므로 200개 초과 데이터는 미포함
- 클라이언트 필터링이므로 서버에서 장르별 총 개수를 알 수 없음
- 개선 방향: KOPIS `shgenrenm` 파라미터로 서버 사이드 필터링
