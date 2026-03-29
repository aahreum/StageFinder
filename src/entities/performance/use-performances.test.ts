import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { KopisPerformanceRaw } from '@/shared';
import type { Performance } from './model';

// vi.hoisted로 변수를 호이스팅하여 vi.mock factory에서 참조 가능하게 함
const { mockFetch } = vi.hoisted(() => ({
  mockFetch: vi.fn(),
}));

// 클라이언트 fetch 함수 mock (API Route 프록시)
vi.mock('@/shared/api/performances-client', () => ({
  fetchPerformancesClient: mockFetch,
}));

import { getPerformancesQueryOptions } from './use-performances';

const baseRaw: KopisPerformanceRaw = {
  mt20id: 'PF001',
  prfnm: '레미제라블',
  prfpdfrom: '2025.01.01',
  prfpdto: '2025.06.30',
  fcltynm: '블루스퀘어 마스터카드홀',
  poster: 'https://example.com/poster.jpg',
  area: '서울특별시',
  genrenm: '뮤지컬',
  openrun: 'N',
  prfstate: '공연중',
};

describe('getPerformancesQueryOptions', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('fetchPerformances 결과를 toPerformance로 변환해야 한다', async () => {
    // Given
    mockFetch.mockResolvedValue([baseRaw]);
    const params = { stdate: '20250101', eddate: '20250630' };

    // When
    const { queryFn } = getPerformancesQueryOptions(params);
    const result = await queryFn();

    // Then
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual<Performance>({
      id: 'PF001',
      title: '레미제라블',
      startDate: '2025.01.01',
      endDate: '2025.06.30',
      venue: '블루스퀘어 마스터카드홀',
      poster: 'https://example.com/poster.jpg',
      area: '서울특별시',
      genre: '뮤지컬',
      isOpenRun: false,
      status: '공연중',
    });
  });

  it('여러 개의 공연을 모두 변환해야 한다', async () => {
    // Given
    mockFetch.mockResolvedValue([
      baseRaw,
      {
        ...baseRaw,
        mt20id: 'PF002',
        prfnm: '오페라의 유령',
        prfstate: '공연예정',
      },
    ]);
    const params = { stdate: '20250101', eddate: '20250630' };

    // When
    const { queryFn } = getPerformancesQueryOptions(params);
    const result = await queryFn();

    // Then
    expect(result).toHaveLength(2);
    expect(result[1].title).toBe('오페라의 유령');
    expect(result[1].status).toBe('공연예정');
  });

  it('빈 배열이면 빈 배열을 반환해야 한다', async () => {
    // Given
    mockFetch.mockResolvedValue([]);
    const params = { stdate: '20250101', eddate: '20250630' };

    // When
    const { queryFn } = getPerformancesQueryOptions(params);
    const result = await queryFn();

    // Then
    expect(result).toEqual([]);
  });

  it('fetchPerformances 에러를 전파해야 한다', async () => {
    // Given
    mockFetch.mockRejectedValue(new Error('KOPIS API 오류'));
    const params = { stdate: '20250101', eddate: '20250630' };

    // When / Then
    const { queryFn } = getPerformancesQueryOptions(params);
    await expect(queryFn()).rejects.toThrow('KOPIS API 오류');
  });

  it("queryKey가 ['performances', params] 구조여야 한다", () => {
    // Given
    const params = { stdate: '20250101', eddate: '20250630', signgucode: '11' };

    // When
    const { queryKey } = getPerformancesQueryOptions(params);

    // Then
    expect(queryKey).toEqual(['performances', params]);
  });

  it('알 수 없는 공연 상태면 공연중 fallback으로 포함해야 한다', async () => {
    // Given
    mockFetch.mockResolvedValue([
      baseRaw,
      { ...baseRaw, mt20id: 'PF002', prfstate: '알수없음' },
    ]);
    const params = { stdate: '20250101', eddate: '20250630' };

    // When
    const { queryFn } = getPerformancesQueryOptions(params);
    const result = await queryFn();

    // Then: 두 항목 모두 포함, 두 번째는 fallback '공연중'
    expect(result).toHaveLength(2);
    expect(result[1].status).toBe('공연중');
  });
});
