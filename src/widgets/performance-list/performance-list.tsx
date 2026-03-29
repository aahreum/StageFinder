"use client";

import { useState, useMemo } from "react";
import { usePerformances } from "@/entities/performance";
import { PerformanceCard } from "@/entities/performance";
import { GenreFilter } from "@/features/genre-filter";
import type { FetchPerformancesParams } from "@/shared";

interface Props {
  params: FetchPerformancesParams;
}

export function PerformanceList({ params }: Props) {
  const { data, isPending, error, isError } = usePerformances(params);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // 데이터에서 장르 목록 추출 (중복 제거)
  const genres = useMemo(
    () => [...new Set((data ?? []).map((p) => p.genre))].sort(),
    [data]
  );

  // 선택된 장르로 필터링
  const filtered = useMemo(
    () => (selectedGenre ? (data ?? []).filter((p) => p.genre === selectedGenre) : (data ?? [])),
    [data, selectedGenre]
  );

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
