import { describe, it, expect } from 'vitest';
// 테스트 파일 내 재구현 대신 실제 export 함수를 import
import { GenreFilter } from './genre-filter';
import { getUniqueGenres, filterByGenre } from './genre-filter.utils';

describe('getUniqueGenres', () => {
  it('중복 없는 배열은 정렬된 배열을 반환해야 한다', () => {
    expect(getUniqueGenres(['뮤지컬', '연극', '댄스'])).toEqual([
      '댄스',
      '뮤지컬',
      '연극',
    ]);
  });

  it('중복이 있으면 제거하고 정렬해야 한다', () => {
    expect(getUniqueGenres(['뮤지컬', '연극', '뮤지컬', '댄스'])).toEqual([
      '댄스',
      '뮤지컬',
      '연극',
    ]);
  });

  it('빈 배열이면 빈 배열을 반환해야 한다', () => {
    expect(getUniqueGenres([])).toEqual([]);
  });
});

describe('filterByGenre', () => {
  const items = [
    { id: '1', genre: '뮤지컬' },
    { id: '2', genre: '연극' },
    { id: '3', genre: '뮤지컬' },
  ];

  it('selected가 null이면 전체 반환해야 한다', () => {
    expect(filterByGenre(items, null)).toHaveLength(3);
  });

  it('특정 장르를 선택하면 해당 장르만 반환해야 한다', () => {
    const result = filterByGenre(items, '뮤지컬');
    expect(result).toHaveLength(2);
    expect(result.every((i) => i.genre === '뮤지컬')).toBe(true);
  });

  it('없는 장르를 선택하면 빈 배열을 반환해야 한다', () => {
    expect(filterByGenre(items, '오페라')).toEqual([]);
  });
});

describe('GenreFilter', () => {
  it('함수로 export되어야 한다', () => {
    expect(typeof GenreFilter).toBe('function');
  });
});
