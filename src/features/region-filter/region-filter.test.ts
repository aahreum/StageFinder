import { describe, it, expect } from 'vitest';
import { RegionFilter } from './region-filter';
import { getUniqueAreas, filterByArea } from './region-filter.utils';

describe('getUniqueAreas', () => {
  it('중복 없는 배열은 정렬된 배열을 반환해야 한다', () => {
    expect(getUniqueAreas(['서울', '부산', '대구'])).toEqual([
      '대구',
      '부산',
      '서울',
    ]);
  });

  it('중복이 있으면 제거하고 정렬해야 한다', () => {
    expect(getUniqueAreas(['서울', '부산', '서울', '대구'])).toEqual([
      '대구',
      '부산',
      '서울',
    ]);
  });

  it('빈 배열이면 빈 배열을 반환해야 한다', () => {
    expect(getUniqueAreas([])).toEqual([]);
  });
});

describe('filterByArea', () => {
  const items = [
    { id: '1', area: '서울' },
    { id: '2', area: '부산' },
    { id: '3', area: '서울' },
  ];

  it('selected가 null이면 전체 반환해야 한다', () => {
    expect(filterByArea(items, null)).toHaveLength(3);
  });

  it('특정 지역을 선택하면 해당 지역만 반환해야 한다', () => {
    const result = filterByArea(items, '서울');
    expect(result).toHaveLength(2);
    expect(result.every((i) => i.area === '서울')).toBe(true);
  });

  it('없는 지역을 선택하면 빈 배열을 반환해야 한다', () => {
    expect(filterByArea(items, '제주')).toEqual([]);
  });
});

describe('RegionFilter', () => {
  it('함수로 export되어야 한다', () => {
    expect(typeof RegionFilter).toBe('function');
  });
});
