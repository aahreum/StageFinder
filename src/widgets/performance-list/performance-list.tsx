"use client";

import { useState, useMemo } from "react";
import { usePerformances, PerformanceCard, type Performance } from "@/entities/performance";
import { GenreFilter, getUniqueGenres, filterByGenre } from "@/features/genre-filter";
import type { FetchPerformancesParams } from "@/shared";

interface Props {
  params: FetchPerformancesParams;
}

export function PerformanceList({ params }: Props) {
  const { data, isPending, error, isError } = usePerformances(params);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const list = useMemo<Performance[]>(() => data ?? [], [data]);

  const genres = useMemo(() => getUniqueGenres(list.map((p) => p.genre)), [list]);
  const filtered = useMemo(() => filterByGenre(list, selectedGenre), [list, selectedGenre]);

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
      <GenreFilter genres={genres} selected={selectedGenre} onChange={setSelectedGenre} />

      {filtered.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-subtle">
          공연 정보가 없습니다.
        </div>
      ) : (
        <ul className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((performance) => (
            <li key={performance.id}>
              <PerformanceCard performance={performance} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
