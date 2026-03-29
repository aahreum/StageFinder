import type { KopisPerformanceRaw } from '@/shared';

export type PerformanceStatus = '공연예정' | '공연중' | '공연완료';

// KOPIS 응답의 prfstate 값 매핑 (한글 / 숫자 코드 모두 대응)
const STATUS_MAP: Record<string, PerformanceStatus> = {
  공연예정: '공연예정',
  '01': '공연예정',
  공연중: '공연중',
  '02': '공연중',
  공연완료: '공연완료',
  완료: '공연완료',
  '03': '공연완료',
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

/** KopisPerformanceRaw → Performance 변환. prfstate 미매핑 시 '공연중' fallback */
export function toPerformance(raw: KopisPerformanceRaw): Performance {
  const status: PerformanceStatus =
    STATUS_MAP[raw.prfstate] ?? '공연중';

  return {
    id: raw.mt20id,
    title: raw.prfnm,
    startDate: raw.prfpdfrom,
    endDate: raw.prfpdto,
    venue: raw.fcltynm,
    poster: raw.poster,
    area: raw.area,
    genre: raw.genrenm,
    isOpenRun: raw.openrun === 'Y',
    status,
  };
}
