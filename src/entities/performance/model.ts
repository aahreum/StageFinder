import type { KopisPerformanceRaw } from "@/shared";

export type PerformanceStatus = "공연예정" | "공연중" | "공연완료";

const STATUS_MAP: Record<string, PerformanceStatus> = {
  공연예정: "공연예정",
  공연중: "공연중",
  공연완료: "공연완료",
};

export interface Performance {
  id: string;
  title: string;
  startDate: string; // YYYY.MM.DD
  endDate: string; // YYYY.MM.DD
  venue: string;
  poster: string;
  area: string;
  genre: string;
  isOpenRun: boolean;
  status: PerformanceStatus;
}

/** KopisPerformanceRaw → Performance 변환 */
export function toPerformance(raw: KopisPerformanceRaw): Performance {
  const status = STATUS_MAP[raw.prfstate];
  if (!status) throw new Error(`알 수 없는 공연 상태: ${raw.prfstate}`);

  return {
    id: raw.mt20id,
    title: raw.prfnm,
    startDate: raw.prfpdfrom,
    endDate: raw.prfpdto,
    venue: raw.fcltynm,
    poster: raw.poster,
    area: raw.area,
    genre: raw.genrenm,
    isOpenRun: raw.openrun === "Y",
    status,
  };
}
