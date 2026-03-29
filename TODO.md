# TODO

## Phase 1: Setup

- [x] init-next-app
  - Next.js App Router 프로젝트 생성
  - pnpm 사용
  - ✅ 검증: dev 서버 정상 실행

- [x] setup-tailwind
  - Tailwind 설정
  - 글로벌 스타일 적용
  - ✅ 검증: Tailwind 클래스 정상 적용

- [x] setup-fsd-folder-structure
  - src/app, shared, entities, features, widgets 생성
  - ✅ 검증: 구조가 FSD 규칙에 맞음

- [x] setup-supabase-client
  - supabase client 생성
  - 환경변수 연결
  - ✅ 검증: 클라이언트 정상 생성

---

## Phase 2: 공연 리스트

- [x] fetch-performances-from-kopis
  - KOPIS API 호출 함수 구현
  - ✅ 검증: 데이터 정상 반환

- [x] create-performance-type
  - 공연 타입 정의
  - ✅ 검증: 타입 에러 없음

- [x] create-usePerformances-hook
  - TanStack Query 기반 hook 구현
  - ✅ 검증: data / loading / error 정상 동작

- [x] create-performance-card-ui
  - 공연 카드 컴포넌트 구현
  - ✅ 검증: props 기반 렌더링 정상

- [x] render-performance-list-page
  - 리스트 페이지 구현
  - ✅ 검증: API 데이터 화면 렌더링

---

## Phase 3: 필터

- [x] implement-genre-filter
  - 장르 필터 UI + 로직
  - ✅ 검증: 선택한 장르만 표시

- [x] implement-pagination-and-status
  - 20개씩 페이지네이션 (prev/next)
  - 공연예정(01) + 공연중(02) 함께 표시
  - 메인 화면 안내문구 추가 (오늘 기준 3개월치)
  - ✅ 검증: 페이지 전환 시 다음 20개 로드, 두 상태 모두 표시

- [x] improve-filter-pagination-sync
  - 필터 변경 시 페이지 초기화
  - 필터 적용 상태에서 페이지네이션 유지
  - ✅ 검증: 필터 적용 후 페이지 이동 시에도 필터 유지

- [x] persist-filter-state
  - URL query string 기반 상태 관리 (genre, page 등)
  - 새로고침 시 동일 상태 유지
  - ✅ 검증: 새로고침 후에도 동일 상태 유지

- [x] refactor-component-structure
  - FilterBar, Pagination, PerformanceList, PerformanceItem 분리
  - props 기반 구조로 리팩토링
  - ✅ 검증: 각 컴포넌트 독립적으로 동작

- [x] apply-clsx
  - 조건부 className을 clsx로 리팩토링
  - ✅ 검증: className 가독성 개선

- [x] setup-prettier
  - prettier 설치 및 설정 적용
  - 전체 코드 포맷팅
  - ✅ 검증: 일관된 코드 스타일 유지

- [x] fix-filter-url-slug
  - genre URL을 한글 대신 영어 slug로 변환 (예: 대중음악 → pop)
  - slug ↔ genrenm 양방향 매핑
  - ✅ 검증: URL에 영어 slug 표시, 필터 동작 유지

- [x] fix-filter-pagination-count
  - 전체 데이터 fetch → 클라이언트 필터 → 클라이언트 페이지네이션 순서로 변경
  - 필터 적용 후에도 항상 20개씩 표시
  - ✅ 검증: 장르 필터 후 페이지당 20개 유지

- [x] fix-filter-ui-persistence
  - FilterBar가 페이지 변경과 무관하게 항상 렌더링
  - ✅ 검증: 페이지 이동 시 FilterBar 유지

- [x] fix-pagination-button-state
  - 전체 필터된 데이터 기준으로 마지막 페이지 계산
  - lastPage에서 next 비활성화, firstPage에서 prev 비활성화
  - ✅ 검증: 마지막 페이지에서 next 버튼 비활성화

- [x] document-filter-data-flow
  - 필터 적용 전/후 데이터 흐름을 docs/filter-data-flow.md로 문서화
  - ✅ 검증: 데이터 흐름 명확하게 문서화

- [ ] implement-region-filter
  - 지역 필터
  - ✅ 검증: 지역 기준 필터링

- [ ] implement-date-filter
  - 날짜 필터
  - ✅ 검증: 날짜 기준 필터링

---

## Phase 4: 검색

- [ ] implement-search-input
  - 검색 input UI
  - ✅ 검증: 입력 상태 관리

- [ ] implement-search-logic
  - 공연명/출연진 검색
  - ✅ 검증: 키워드 기반 필터링

---

## Phase 5: 위치 기반

- [ ] get-user-location
  - Geolocation API 사용
  - ✅ 검증: 위치 정상 반환

- [ ] implement-haversine-distance
  - 거리 계산 함수 구현
  - ✅ 검증: 거리 계산 정확

- [ ] sort-by-distance
  - 가까운 순 정렬
  - ✅ 검증: 거리 기준 정렬

---

## Phase 6: 알림

- [ ] create-user-preference-table
  - Supabase 테이블 생성
  - ✅ 검증: 데이터 저장 가능

- [ ] save-user-preference
  - 관심 조건 저장
  - ✅ 검증: DB 저장 성공

- [ ] setup-cron-job
  - 스케줄링 설정
  - ✅ 검증: cron 실행됨

- [ ] compare-new-performances
  - 신규 데이터 비교
  - ✅ 검증: 차이 감지 가능

- [ ] send-email-with-resend
  - 이메일 발송
  - ✅ 검증: 메일 수신 확인

---

## Notes

- API 호출 최소화
- KOPIS 응답 정규화 필요
- FSD 구조 준수

---

## 현재 아키텍처 (2026-03-29 기준)

```
KOPIS API (rows=200, cpage=1)
  ↓
usePerformances (TanStack Query 캐싱)
  ↓
list (전체 데이터, 최대 200개)
  ↓ getUniqueGenres → genres → FilterBar (항상 렌더링)
  ↓ filterByGenre(selectedGenre) → filtered
  ↓ slice((page-1)*20, page*20) → paginatedList → PerformanceCard × 20
  ↓ Math.ceil(filtered.length / 20) → totalPages → Pagination
```

URL 상태: `/?genre=musical&page=2` (genre는 영어 slug)

---

## 테스트 현황

| 파일 | 주요 내용 |
|---|---|
| `shared/api/kopis.test.ts` | 날짜 형식, API 파라미터 검증 |
| `features/genre-filter/genre-filter.test.ts` | getUniqueGenres, filterByGenre, GenreFilter |
| `features/genre-filter/genre-slug.test.ts` | genreToSlug, slugToGenre, 양방향 일관성 |
| `widgets/performance-list/performance-list.test.ts` | 날짜 파라미터, 로딩/에러/빈 데이터/정상 상태 |

총 **84개** 테스트 통과

---

## 주요 수정 이력

- **KOPIS API 키 노출** → `/api/performances` API Route 프록시로 해결
- **PR #26 코드리뷰 개선**
  - `handlePrev`/`handleNext` → `useCallback` 분리
  - 클라이언트 필터링 한계 NOTE/TODO 주석 추가
  - `genre-filter.utils.ts` 분리 (`'use client'` 번들 제외)
  - `shared/ui/button-class.ts`로 버튼 className 통합
  - PerformanceList 상태별 테스트 추가 (로딩/에러/빈 데이터/정상)
- **hasMore 오탐지** → `PAGE_SIZE+1` 요청 후 `data.length > PAGE_SIZE` 판단
- **필터 + 페이지네이션 개수 불일치** → 전체 200개 fetch 후 클라이언트에서 필터·슬라이싱으로 해결
