"use client";

import { usePerformances } from "@/entities/performance";
import { PerformanceCard } from "@/entities/performance";
import type { FetchPerformancesParams } from "@/shared";

interface Props {
  params: FetchPerformancesParams;
}

export function PerformanceList({ params }: Props) {
  const { data, isLoading, error } = usePerformances(params);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-subtle">
        불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center text-error">
        오류가 발생했습니다: {error.message}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-subtle">
        공연 정보가 없습니다.
      </div>
    );
  }

  return (
    <ul className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((performance) => (
        <li key={performance.id}>
          <PerformanceCard performance={performance} />
        </li>
      ))}
    </ul>
  );
}
