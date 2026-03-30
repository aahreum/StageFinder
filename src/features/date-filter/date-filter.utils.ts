export type DateRange = 'week' | 'month' | 'next-month';

/** Date → YYYYMMDD 문자열 */
function fmt(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

/** 선택한 DateRange에 맞는 stdate/eddate 반환 */
export function getDateRangeParams(range: DateRange): { stdate: string; eddate: string } {
  const today = new Date();

  if (range === 'week') {
    const end = new Date(today);
    end.setDate(end.getDate() + 6);
    return { stdate: fmt(today), eddate: fmt(end) };
  }

  if (range === 'month') {
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0); // 이번 달 말일
    return { stdate: fmt(today), eddate: fmt(end) };
  }

  // next-month
  const start = new Date(today.getFullYear(), today.getMonth() + 1, 1); // 다음 달 1일
  const end = new Date(today.getFullYear(), today.getMonth() + 2, 0);   // 다음 달 말일
  return { stdate: fmt(start), eddate: fmt(end) };
}
