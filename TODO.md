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

- [x] implement-region-filter
  - 지역 필터 (서버사이드 signgucode)
  - STATUS_MAP "완료" → "공연완료" 버그 수정
  - ✅ 검증: 지역 선택 시 KOPIS에 signgucode 전달, 전체 선택 시 전체 표시

- [x] implement-booking-url
  - PerformanceCard 클릭 시 KOPIS 상세 API로 예매처 URL 조회 후 새 탭 이동
  - ✅ 검증: 카드 클릭 → 예매처 URL 새 탭 오픈

- [x] fix-filter-bugs
  - region signgucode 매핑 수정 (법정동코드 기준)
  - region 변경 시 genre 초기화 제거
  - genre 필터 고정 목록으로 변경 (데이터 기반 → 정적 목록)
  - ✅ 검증: 전남 선택 → 전남 데이터, genre는 region 무관하게 고정

- [x] fix-genre-filter-pagination
  - 장르 필터를 클라이언트사이드 → KOPIS shcate 파라미터 서버사이드로 전환
  - 20개씩 정확히 페이지네이션 되도록 수정
  - ✅ 검증: 장르 선택 시 20개 표시, 다음 페이지도 20개

- [x] implement-date-filter
  - 날짜 필터 (이번 주 / 이번 달 / 다음 달)
  - KOPIS stdate/eddate 서버사이드 파라미터로 구현
  - ✅ 검증: 날짜 선택 시 해당 범위 공연만 표시

- [x] fix-shcate-not-forwarded
  - performances-client.ts, route.ts에서 shcate 파라미터 누락 수정
  - ✅ 검증: genre + region, genre + date 동시 적용 시 장르 필터링 동작

- [x] fix-genre-kopis-code-mapping
  - GENRE_TO_KOPIS_CODE 잘못된 코드 수정
  - 뮤지컬: CCCG → GGGA, 대중음악: GGGA → CCCE
  - ✅ 검증: 뮤지컬 필터 결과 표시, 대중음악 필터에 뮤지컬 미표시

---

## Phase 4: 검색

- [x] implement-search-input
  - 검색 input UI
  - ✅ 검증: 입력 상태 관리

- [x] implement-search-logic
  - 공연명/출연진 검색
  - ✅ 검증: 키워드 기반 필터링

---

## Phase 5: 위치 기반

- [x] get-user-location
  - Geolocation API 사용
  - useUserLocation hook: location / isLoading / error / getLocation
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
