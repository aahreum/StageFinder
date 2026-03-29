import type { FetchPerformancesParams } from "../api/kopis";

/** 오늘 기준 n개월 후까지의 KOPIS 조회 파라미터 생성 */
export function getPerformanceDateParams(monthsAhead = 3): FetchPerformancesParams {
  const today = new Date();
  const end = new Date(today);
  end.setMonth(end.getMonth() + monthsAhead);

  const fmt = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

  return { stdate: fmt(today), eddate: fmt(end), prfstate: "02" };
}
