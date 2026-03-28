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

- [ ] setup-fsd-folder-structure
  - src/app, shared, entities, features, widgets 생성
  - ✅ 검증: 구조가 FSD 규칙에 맞음

- [ ] setup-supabase-client
  - supabase client 생성
  - 환경변수 연결
  - ✅ 검증: 클라이언트 정상 생성

---

## Phase 2: 공연 리스트

- [ ] fetch-performances-from-kopis
  - KOPIS API 호출 함수 구현
  - ✅ 검증: 데이터 정상 반환

- [ ] create-performance-type
  - 공연 타입 정의
  - ✅ 검증: 타입 에러 없음

- [ ] create-usePerformances-hook
  - TanStack Query 기반 hook 구현
  - ✅ 검증: data / loading / error 정상 동작

- [ ] create-performance-card-ui
  - 공연 카드 컴포넌트 구현
  - ✅ 검증: props 기반 렌더링 정상

- [ ] render-performance-list-page
  - 리스트 페이지 구현
  - ✅ 검증: API 데이터 화면 렌더링

---

## Phase 3: 필터

- [ ] implement-genre-filter
  - 장르 필터 UI + 로직
  - ✅ 검증: 선택한 장르만 표시

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
