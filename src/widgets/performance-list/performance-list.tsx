'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  usePerformances,
  PerformanceCard,
  type Performance,
} from '@/entities/performance';
import {
  getUniqueGenres,
  filterByGenre,
  genreToSlug,
  slugToGenre,
} from '@/features/genre-filter';
import {
  getUniqueAreas,
  filterByArea,
} from '@/features/region-filter';
import { filterByDate } from '@/features/date-filter';
import { FilterBar } from '@/widgets/filter-bar';
import { Pagination } from '@/widgets/pagination';
import type { FetchPerformancesParams } from '@/shared';

const PAGE_SIZE = 20;
// 전체 데이터를 한 번에 가져와 클라이언트에서 필터 + 페이지네이션 적용
const FETCH_ROWS = 200;

interface Props {
  params: FetchPerformancesParams;
}

export function PerformanceList({ params }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageRaw = Number(searchParams.get('page') ?? '1');
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;
  // URL slug → KOPIS genrenm 변환
  const genreSlug = searchParams.get('genre');
  const selectedGenre = genreSlug ? slugToGenre(genreSlug) : null;
  // 지역명(한글)을 URL에 그대로 저장 — 브라우저가 자동 인코딩/디코딩 처리
  const selectedArea = searchParams.get('region');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  // URL 파라미터 일괄 업데이트
  const updateURL = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) next.delete(key);
        else next.set(key, value);
      }
      router.push(`${pathname}?${next.toString()}`);
    },
    [router, pathname, searchParams],
  );

  // 장르 변경: genrenm → slug로 URL 저장, page 초기화
  const handleGenreChange = useCallback(
    (genre: string | null) =>
      updateURL({ genre: genre ? genreToSlug(genre) : null, page: null }),
    [updateURL],
  );

  // 지역 변경: URL에 직접 저장, page 초기화
  const handleAreaChange = useCallback(
    (area: string | null) => updateURL({ region: area, page: null }),
    [updateURL],
  );

  // 날짜 변경: YYYY-MM-DD 형식으로 URL 저장, page 초기화
  const handleDateChange = useCallback(
    (from: string | null, to: string | null) =>
      updateURL({ dateFrom: from, dateTo: to, page: null }),
    [updateURL],
  );

  const handlePrev = useCallback(
    () => updateURL({ page: String(page - 1) }),
    [updateURL, page],
  );

  const handleNext = useCallback(
    () => updateURL({ page: String(page + 1) }),
    [updateURL, page],
  );

  // cpage 없이 FETCH_ROWS만큼 전체 데이터 조회 (클라이언트 페이지네이션)
  const queryParams = useMemo(
    () => ({ ...params, cpage: 1, rows: FETCH_ROWS }),
    [params],
  );

  const { data, isPending, isError, error } = usePerformances(queryParams);

  const list = useMemo<Performance[]>(() => data ?? [], [data]);

  // genres, areas는 전체 데이터 기준 — 페이지 변경 시에도 FilterBar 유지
  const genres = useMemo(
    () => getUniqueGenres(list.map((p) => p.genre)),
    [list],
  );
  const areas = useMemo(
    () => getUniqueAreas(list.map((p) => p.area)),
    [list],
  );

  // NOTE: 클라이언트 필터링 — FETCH_ROWS(200개) 내에서 동작
  // TODO: 서버 사이드 필터링(KOPIS shgenrenm 파라미터)으로 개선 필요
  const filtered = useMemo(
    () =>
      filterByDate(
        filterByArea(filterByGenre(list, selectedGenre), selectedArea),
        dateFrom,
        dateTo,
      ),
    [list, selectedGenre, selectedArea, dateFrom, dateTo],
  );

  // 전체 필터 결과 기준으로 페이지네이션
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const hasMore = page < totalPages;
  const paginatedList = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  if (isPending) {
    return (
      <div className='flex flex-1 items-center justify-center text-subtle'>
        불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-1 items-center justify-center text-error'>
        오류가 발생했습니다: {error.message}
      </div>
    );
  }

  return (
    <div className='flex flex-1 flex-col'>
      <FilterBar
        genres={genres}
        selectedGenre={selectedGenre}
        onGenreChange={handleGenreChange}
        areas={areas}
        selectedArea={selectedArea}
        onAreaChange={handleAreaChange}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateChange={handleDateChange}
      />

      {paginatedList.length === 0 ? (
        <div className='flex flex-1 items-center justify-center text-subtle'>
          공연 정보가 없습니다.
        </div>
      ) : (
        <ul className='grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3'>
          {paginatedList.map((performance) => (
            <li key={performance.id}>
              <PerformanceCard performance={performance} />
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={page}
        hasMore={hasMore}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
