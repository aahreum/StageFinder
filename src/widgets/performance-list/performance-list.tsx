'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  usePerformances,
  PerformanceCard,
  type Performance,
} from '@/entities/performance';
import { getUniqueGenres, filterByGenre } from '@/features/genre-filter';
import { FilterBar } from '@/widgets/filter-bar';
import { Pagination } from '@/widgets/pagination';
import type { FetchPerformancesParams } from '@/shared';

const PAGE_SIZE = 20;

interface Props {
  params: FetchPerformancesParams;
}

export function PerformanceList({ params }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page') ?? '1');
  const selectedGenre = searchParams.get('genre');

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

  // 장르 변경 시 page 초기화
  const handleGenreChange = useCallback(
    (genre: string | null) => updateURL({ genre, page: null }),
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

  // PAGE_SIZE + 1개 요청으로 다음 페이지 존재 여부 확인
  const queryParams = useMemo(
    () => ({ ...params, cpage: page, rows: PAGE_SIZE + 1 }),
    [params, page],
  );

  const { data, isPending, error, isError } = usePerformances(queryParams);

  const rawList = useMemo<Performance[]>(() => data ?? [], [data]);
  const hasMore = rawList.length > PAGE_SIZE;
  const list = useMemo<Performance[]>(() => rawList.slice(0, PAGE_SIZE), [rawList]);
  const genres = useMemo(
    () => getUniqueGenres(list.map((p) => p.genre)),
    [list],
  );
  // NOTE: 클라이언트 필터링 — 현재 페이지(20개) 내에서만 동작함
  // 다른 페이지에 같은 장르의 데이터가 있어도 표시되지 않음
  // TODO: 서버 사이드 필터링(KOPIS genrenm 파라미터)으로 개선 필요
  const filtered = useMemo(
    () => filterByGenre(list, selectedGenre),
    [list, selectedGenre],
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
      />

      {filtered.length === 0 ? (
        <div className='flex flex-1 items-center justify-center text-subtle'>
          공연 정보가 없습니다.
        </div>
      ) : (
        <ul className='grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3'>
          {filtered.map((performance) => (
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
