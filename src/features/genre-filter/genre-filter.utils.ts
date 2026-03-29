/** 공연 목록에서 중복 없는 정렬된 장르 목록 반환 */
export function getUniqueGenres(genres: string[]): string[] {
  return [...new Set(genres)].sort();
}

/** 선택된 장르로 필터링 (null이면 전체 반환) */
export function filterByGenre<T extends { genre: string }>(
  items: T[],
  selected: string | null,
): T[] {
  return selected ? items.filter((item) => item.genre === selected) : items;
}
