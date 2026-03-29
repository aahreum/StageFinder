/**
 * KOPIS 날짜 형식 YYYY.MM.DD → YYYY-MM-DD 변환
 * Date 비교를 위해 ISO 형식으로 정규화
 */
function normalizeDate(date: string): string {
  return date.replace(/\./g, '-');
}

/**
 * 공연 기간이 선택 날짜 범위와 겹치는지 확인
 * 겹침 조건: startDate <= dateTo AND endDate >= dateFrom
 */
function overlaps(
  perfStart: string,
  perfEnd: string,
  from: string,
  to: string,
): boolean {
  const start = normalizeDate(perfStart);
  const end = normalizeDate(perfEnd);
  return start <= to && end >= from;
}

/**
 * 날짜 범위로 필터링 (from/to 모두 null이면 전체 반환)
 * isOpenRun 공연은 날짜와 무관하게 항상 포함
 */
export function filterByDate<
  T extends { startDate: string; endDate: string; isOpenRun?: boolean },
>(items: T[], from: string | null, to: string | null): T[] {
  if (!from && !to) return items;
  const dateFrom = from ?? '0000-01-01';
  const dateTo = to ?? '9999-12-31';
  return items.filter(
    (item) => item.isOpenRun || overlaps(item.startDate, item.endDate, dateFrom, dateTo),
  );
}
