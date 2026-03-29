import { describe, it, expect } from 'vitest';
import { toPerformance } from './model';
import type { KopisPerformanceRaw } from '@/shared';

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

describe('toPerformance', () => {
  it('raw 데이터를 Performance로 정상 변환해야 한다', () => {
    // Given
    const raw = baseRaw;

    // When
    const result = toPerformance(raw);

    // Then
    expect(result).toEqual({
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

  it('openrun "Y"일 때 isOpenRun이 true여야 한다', () => {
    // Given
    const raw: KopisPerformanceRaw = { ...baseRaw, openrun: 'Y' };

    // When
    const result = toPerformance(raw);

    // Then
    expect(result.isOpenRun).toBe(true);
  });

  it('openrun "N"일 때 isOpenRun이 false여야 한다', () => {
    // Given
    const raw: KopisPerformanceRaw = { ...baseRaw, openrun: 'N' };

    // When
    const result = toPerformance(raw);

    // Then
    expect(result.isOpenRun).toBe(false);
  });

  it('prfstate가 그대로 status에 매핑되어야 한다', () => {
    // Given
    const statuses = ["공연예정", "공연중", "공연완료"] as const;

    statuses.forEach((prfstate) => {
      // When
      const result = toPerformance({ ...baseRaw, prfstate });

      // Then
      expect(result.status).toBe(prfstate);
    });
  });

  it('알 수 없는 prfstate일 때 에러를 던져야 한다', () => {
    // Given
    const raw: KopisPerformanceRaw = { ...baseRaw, prfstate: '알수없음' };

    // When / Then
    expect(() => toPerformance(raw)).toThrow('알 수 없는 공연 상태: 알수없음');
  });
});
