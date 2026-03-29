import { useQuery } from '@tanstack/react-query';
import type { FetchPerformancesParams } from '@/shared';
import { fetchPerformancesClient } from '@/shared/api/performances-client';
import { toPerformance, type Performance } from './model';

/** 테스트 및 prefetch에서 재사용 가능한 query 옵션 */
export function getPerformancesQueryOptions(params: FetchPerformancesParams) {
  return {
    queryKey: ['performances', params] as const,
    queryFn: async (): Promise<Performance[]> => {
      const raw = await fetchPerformancesClient(params);
      return raw
        .map(toPerformance)
        .filter((p): p is Performance => p !== null);
    },
  };
}

export function usePerformances(params: FetchPerformancesParams) {
  return useQuery(getPerformancesQueryOptions(params));
}
