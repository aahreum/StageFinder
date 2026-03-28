import type { KopisPerformanceRaw } from "@/shared";

export type PerformanceStatus = "예정" | "공연중" | "완료";

export interface Performance {
  id: string;             // 공연 ID (mt20id)
  title: string;          // 공연명
  startDate: string;      // 공연 시작일 (YYYY.MM.DD)
  endDate: string;        // 공연 종료일 (YYYY.MM.DD)
  venue: string;          // 공연시설명
  poster: string;         // 포스터 이미지 URL
  area: string;           // 지역
  genre: string;          // 장르명
  isOpenRun: boolean;     // 오픈런 여부
  status: PerformanceStatus;
}

/** KopisPerformanceRaw → Performance 변환 */
export function toPerformance(raw: KopisPerformanceRaw): Performance {
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
    status: raw.prfstate as PerformanceStatus,
  };
}
