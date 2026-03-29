import { describe, it, expect } from 'vitest';
import { genreToSlug, slugToGenre } from './genre-slug';

describe('genreToSlug', () => {
  // 기본 매핑 테스트
  describe('정의된 장르를 slug로 변환할 때', () => {
    it('연극을 play로 변환해야 한다', () => {
      expect(genreToSlug('연극')).toBe('play');
    });

    it('뮤지컬을 musical로 변환해야 한다', () => {
      expect(genreToSlug('뮤지컬')).toBe('musical');
    });

    it('무용(서양/한국무용)을 dance로 변환해야 한다', () => {
      expect(genreToSlug('무용(서양/한국무용)')).toBe('dance');
    });

    it('서양음악(클래식)을 classic으로 변환해야 한다', () => {
      expect(genreToSlug('서양음악(클래식)')).toBe('classic');
    });

    it('한국음악(국악)을 gugak으로 변환해야 한다', () => {
      expect(genreToSlug('한국음악(국악)')).toBe('gugak');
    });

    it('대중음악을 pop으로 변환해야 한다', () => {
      expect(genreToSlug('대중음악')).toBe('pop');
    });

    it('서커스/마술을 circus로 변환해야 한다', () => {
      expect(genreToSlug('서커스/마술')).toBe('circus');
    });

    it('복합을 mixed로 변환해야 한다', () => {
      expect(genreToSlug('복합')).toBe('mixed');
    });
  });

  // 엣지 케이스
  describe('정의되지 않은 값을 처리할 때', () => {
    it('존재하지 않는 장르를 입력하면 원본 값을 반환해야 한다', () => {
      expect(genreToSlug('미정의장르')).toBe('미정의장르');
    });

    it('빈 문자열을 입력하면 빈 문자열을 반환해야 한다', () => {
      expect(genreToSlug('')).toBe('');
    });

    it('공백 문자열을 입력하면 공백을 반환해야 한다', () => {
      expect(genreToSlug(' ')).toBe(' ');
    });

    it('영어 문자열을 입력하면 원본 값을 반환해야 한다', () => {
      expect(genreToSlug('unknown')).toBe('unknown');
    });

    it('특수문자를 입력하면 원본 값을 반환해야 한다', () => {
      expect(genreToSlug('!@#$%')).toBe('!@#$%');
    });
  });

  // 대소문자 민감성
  describe('대소문자 민감성', () => {
    it('대소문자가 다른 영문 입력은 원본 값을 반환해야 한다', () => {
      expect(genreToSlug('Play')).toBe('Play');
      expect(genreToSlug('PLAY')).toBe('PLAY');
    });
  });
});

describe('slugToGenre', () => {
  // 기본 매핑 테스트
  describe('정의된 slug를 장르로 변환할 때', () => {
    it('play를 연극으로 변환해야 한다', () => {
      expect(slugToGenre('play')).toBe('연극');
    });

    it('musical을 뮤지컬로 변환해야 한다', () => {
      expect(slugToGenre('musical')).toBe('뮤지컬');
    });

    it('dance를 무용(서양/한국무용)으로 변환해야 한다', () => {
      expect(slugToGenre('dance')).toBe('무용(서양/한국무용)');
    });

    it('classic을 서양음악(클래식)으로 변환해야 한다', () => {
      expect(slugToGenre('classic')).toBe('서양음악(클래식)');
    });

    it('gugak을 한국음악(국악)으로 변환해야 한다', () => {
      expect(slugToGenre('gugak')).toBe('한국음악(국악)');
    });

    it('pop을 대중음악으로 변환해야 한다', () => {
      expect(slugToGenre('pop')).toBe('대중음악');
    });

    it('circus를 서커스/마술로 변환해야 한다', () => {
      expect(slugToGenre('circus')).toBe('서커스/마술');
    });

    it('mixed를 복합으로 변환해야 한다', () => {
      expect(slugToGenre('mixed')).toBe('복합');
    });
  });

  // 엣지 케이스
  describe('정의되지 않은 값을 처리할 때', () => {
    it('존재하지 않는 slug를 입력하면 원본 값을 반환해야 한다', () => {
      expect(slugToGenre('unknown-slug')).toBe('unknown-slug');
    });

    it('빈 문자열을 입력하면 빈 문자열을 반환해야 한다', () => {
      expect(slugToGenre('')).toBe('');
    });

    it('공백 문자열을 입력하면 공백을 반환해야 한다', () => {
      expect(slugToGenre(' ')).toBe(' ');
    });

    it('한글 문자열을 입력하면 원본 값을 반환해야 한다', () => {
      expect(slugToGenre('연극')).toBe('연극');
    });

    it('특수문자를 입력하면 원본 값을 반환해야 한다', () => {
      expect(slugToGenre('!@#$%')).toBe('!@#$%');
    });
  });

  // 대소문자 민감성
  describe('대소문자 민감성', () => {
    it('대소문자가 다르면 원본 값을 반환해야 한다', () => {
      expect(slugToGenre('Play')).toBe('Play');
      expect(slugToGenre('PLAY')).toBe('PLAY');
      expect(slugToGenre('MUSICAL')).toBe('MUSICAL');
    });
  });
});

describe('양방향 변환 일관성', () => {
  // 모든 정의된 매핑이 양방향으로 일관성 있게 동작하는지 확인
  const testCases = [
    ['연극', 'play'],
    ['뮤지컬', 'musical'],
    ['무용(서양/한국무용)', 'dance'],
    ['서양음악(클래식)', 'classic'],
    ['한국음악(국악)', 'gugak'],
    ['대중음악', 'pop'],
    ['서커스/마술', 'circus'],
    ['복합', 'mixed'],
  ];

  testCases.forEach(([genre, slug]) => {
    it(`${genre} ↔ ${slug} 왕복 변환이 일관성 있어야 한다`, () => {
      expect(genreToSlug(genre)).toBe(slug);
      expect(slugToGenre(slug)).toBe(genre);
      expect(slugToGenre(genreToSlug(genre))).toBe(genre);
      expect(genreToSlug(slugToGenre(slug))).toBe(slug);
    });
  });
});
