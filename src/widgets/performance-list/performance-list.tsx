"use client";

import { useState, useMemo } from "react";
import {
  usePerformances,
  PerformanceCard,
  type Performance,
} from "@/entities/performance";
import {
  GenreFilter,
  GENRE_TO_SLUG,
  GENRE_TO_KOPIS_CODE,
} from "@/features/genre-filter";
import { RegionFilter } from "@/features/region-filter";
import type { FetchPerformancesParams } from "@/shared";

// region이 바뀌어도 항상 고정 표시할 장르 목록
const FIXED_GENRES = Object.keys(GENRE_TO_SLUG);

const PAGE_SIZE = 20;

interface Props {
  params: FetchPerformancesParams;
}

export function PerformanceList({ params }: Props) {
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const queryParams = useMemo(
    () => ({
      ...params,
      cpage: page,
      rows: PAGE_SIZE,
      ...(selectedRegion && { signgucode: selectedRegion }),
      // 장르 필터를 서버사이드로 전달 (클라이언트 필터링 대신 KOPIS shcate 사용)
      ...(selectedGenre && { shcate: GENRE_TO_KOPIS_CODE[selectedGenre] }),
    }),
    [params, page, selectedRegion, selectedGenre],
  );

  const { data, isPending, error, isError } = usePerformances(queryParams);

  const list = useMemo<Performance[]>(() => data ?? [], [data]);

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center text-subtle">
        불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center text-error">
        오류가 발생했습니다: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <RegionFilter
        selected={selectedRegion}
        onChange={(code) => {
          setSelectedRegion(code);
          setPage(1);
        }}
      />
      <GenreFilter
        genres={FIXED_GENRES}
        selected={selectedGenre}
        onChange={(genre) => {
          setSelectedGenre(genre);
          setPage(1);
        }}
      />

      {list.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-subtle">
          공연 정보가 없습니다.
        </div>
      ) : (
        <ul className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((performance) => (
            <li key={performance.id}>
              <PerformanceCard performance={performance} />
            </li>
          ))}
        </ul>
      )}

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-4 border-t border-border py-4">
        <button
          type="button"
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="cursor-pointer disabled:cursor-not-allowed rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40 enabled:hover:border-brand enabled:hover:text-brand"
        >
          이전
        </button>
        <span className="text-sm text-subtle">{page} 페이지</span>
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={list.length < PAGE_SIZE}
          className="cursor-pointer disabled:cursor-not-allowed rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40 enabled:hover:border-brand enabled:hover:text-brand"
        >
          다음
        </button>
      </div>
    </div>
  );
}
