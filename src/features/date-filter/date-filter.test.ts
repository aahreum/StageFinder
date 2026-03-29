import { describe, it, expect } from 'vitest';
import { filterByDate } from './date-filter.utils';

interface TestPerformance {
  startDate: string;
  endDate: string;
  isOpenRun?: boolean;
  id: string;
}

describe('filterByDate', () => {
  const performances: TestPerformance[] = [
    { id: '1', startDate: '2026.03.01', endDate: '2026.03.10', isOpenRun: false },
    { id: '2', startDate: '2026.03.15', endDate: '2026.03.25', isOpenRun: false },
    { id: '3', startDate: '2026.04.01', endDate: '2026.04.10', isOpenRun: false },
    { id: '4', startDate: '2026.05.01', endDate: '2026.05.31', isOpenRun: true },
  ];

  describe('from과 to 모두 null일 때', () => {
    it('전체 공연을 반환해야 한다', () => {
      const result = filterByDate(performances, null, null);
      expect(result).toHaveLength(4);
      expect(result).toEqual(performances);
    });
  });

  describe('from만 있을 때', () => {
    it('from 이후의 공연을 반환해야 한다', () => {
      const result = filterByDate(performances, '2026-03-20', null);
      expect(result).toHaveLength(3);
      expect(result.map((p) => p.id)).toEqual(['2', '3', '4']);
    });

    it('from과 정확히 같은 시작 날짜 공연도 포함해야 한다', () => {
      const result = filterByDate(performances, '2026-03-01', null);
      expect(result).toHaveLength(4);
    });
  });

  describe('to만 있을 때', () => {
    it('시작일이 to 이전인 공연을 반환해야 한다', () => {
      // id '2' (3/15~3/25): startDate(3/15) <= to(3/20) → 포함
      const result = filterByDate(performances, null, '2026-03-20');
      expect(result).toHaveLength(3);
      expect(result.map((p) => p.id)).toEqual(['1', '2', '4']);
    });

    it('to와 정확히 같은 종료 날짜 공연도 포함해야 한다', () => {
      const result = filterByDate(performances, null, '2026-03-10');
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toEqual(['1', '4']);
    });
  });

  describe('from과 to 모두 있을 때', () => {
    it('범위에 겹치는 공연을 반환해야 한다', () => {
      const result = filterByDate(performances, '2026-03-05', '2026-03-20');
      expect(result).toHaveLength(3);
      expect(result.map((p) => p.id)).toEqual(['1', '2', '4']);
    });

    it('범위 밖의 공연은 제외해야 한다', () => {
      const result = filterByDate(performances, '2026-03-26', '2026-03-31');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('4');
    });

    it('범위 시작과 공연 종료가 겹칠 때 포함해야 한다', () => {
      // from=2026-03-10, to=2026-03-15 (공연1 endDate=2026-03-10과 겹침)
      const result = filterByDate(performances, '2026-03-10', '2026-03-15');
      expect(result.map((p) => p.id)).toContain('1');
      expect(result.map((p) => p.id)).toContain('2');
    });
  });

  describe('isOpenRun이 true인 공연', () => {
    it('날짜 범위와 무관하게 항상 포함되어야 한다', () => {
      const result = filterByDate(performances, '2026-01-01', '2026-02-28');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('4');
    });

    it('극도로 제한된 범위에서도 포함되어야 한다', () => {
      const result = filterByDate(performances, '2026-06-01', '2026-06-30');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('4');
    });
  });

  describe('겹침 조건 검증: start <= to AND end >= from', () => {
    it('공연 시작이 범위 끝과 같을 때 포함해야 한다', () => {
      const result = filterByDate(performances, '2026-03-01', '2026-03-15');
      expect(result.map((p) => p.id)).toContain('2'); // 공연2: 2026.03.15 시작
    });

    it('공연 종료가 범위 시작과 같을 때 포함해야 한다', () => {
      const result = filterByDate(performances, '2026-03-10', '2026-03-20');
      expect(result.map((p) => p.id)).toContain('1'); // 공연1: 2026.03.10 종료
    });

    it('공연이 범위를 완전히 포함할 때 포함해야 한다', () => {
      const longRun: TestPerformance = {
        id: '5',
        startDate: '2026.01.01',
        endDate: '2026.12.31',
      };
      const result = filterByDate([longRun], '2026-03-01', '2026-03-31');
      expect(result[0].id).toBe('5');
    });

    it('범위가 공연을 완전히 포함할 때 포함해야 한다', () => {
      const result = filterByDate(performances, '2026-02-01', '2026-06-30');
      expect(result).toHaveLength(4);
    });
  });

  describe('엣지 케이스', () => {
    it('빈 배열을 전달받으면 빈 배열을 반환해야 한다', () => {
      const result = filterByDate([], '2026-03-01', '2026-03-31');
      expect(result).toEqual([]);
    });

    it('isOpenRun이 undefined인 경우 false로 처리되어야 한다', () => {
      const perf: TestPerformance = {
        id: '6',
        startDate: '2026.04.01',
        endDate: '2026.04.10',
      };
      const result = filterByDate([perf], '2026-05-01', '2026-05-31');
      expect(result).toHaveLength(0);
    });

    it('isOpenRun이 명시적으로 false인 경우 날짜로 필터링되어야 한다', () => {
      const perf: TestPerformance = {
        id: '7',
        startDate: '2026.03.01',
        endDate: '2026.03.10',
        isOpenRun: false,
      };
      const result = filterByDate([perf], '2026-04-01', '2026-04-30');
      expect(result).toHaveLength(0);
    });

    it('KOPIS 날짜 형식(점)을 정상 처리해야 한다', () => {
      const perf: TestPerformance = {
        id: '8',
        startDate: '2026.03.01',
        endDate: '2026.03.10',
      };
      const result = filterByDate([perf], '2026-03-05', '2026-03-07');
      expect(result).toHaveLength(1);
    });
  });
});
