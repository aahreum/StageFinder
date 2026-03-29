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

  const queryParams = useMemo(
    () => ({ ...params, cpage: page, rows: PAGE_SIZE }),
    [params, page],
  );

  const { data, isPending, error, isError } = usePerformances(queryParams);

  const list = useMemo<Performance[]>(() => data ?? [], [data]);
  const genres = useMemo(
    () => getUniqueGenres(list.map((p) => p.genre)),
    [list],
  );
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
        hasMore={list.length >= PAGE_SIZE}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
