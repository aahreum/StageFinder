/** KOPIS genrenm 값 → URL-safe 영어 slug 매핑 */
export const GENRE_TO_SLUG: Record<string, string> = {
  연극: 'play',
  뮤지컬: 'musical',
  '무용(서양/한국무용)': 'dance',
  '서양음악(클래식)': 'classic',
  '한국음악(국악)': 'gugak',
  대중음악: 'pop',
  '서커스/마술': 'circus',
  복합: 'mixed',
};

const SLUG_TO_GENRE: Record<string, string> = Object.fromEntries(
  Object.entries(GENRE_TO_SLUG).map(([genre, slug]) => [slug, genre]),
);

/** KOPIS genrenm 값 → KOPIS shcate 코드 매핑 */
export const GENRE_TO_KOPIS_CODE: Record<string, string> = {
  연극: 'AAAA',
  뮤지컬: 'GGGA',
  '무용(서양/한국무용)': 'BBBC',
  '서양음악(클래식)': 'CCCA',
  '한국음악(국악)': 'CCCC',
  대중음악: 'CCCD',
  '서커스/마술': 'EEEB',
  복합: 'EEEA',
};

export function genreToSlug(genre: string): string {
  return GENRE_TO_SLUG[genre] ?? genre;
}

export function slugToGenre(slug: string): string {
  return SLUG_TO_GENRE[slug] ?? slug;
}
