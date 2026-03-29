/** 공연 목록에서 중복 없는 정렬된 지역 목록 반환 */
export function getUniqueAreas(areas: string[]): string[] {
  return [...new Set(areas)].sort();
}

/** 선택된 지역으로 필터링 (null이면 전체 반환) */
export function filterByArea<T extends { area: string }>(
  items: T[],
  selected: string | null,
): T[] {
  return selected ? items.filter((item) => item.area === selected) : items;
}
