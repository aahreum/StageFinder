import { XMLParser } from 'fast-xml-parser';

const BASE_URL = "https://kopis.or.kr/openApi/restful/pblprfr";
// parseTagValue: false — 숫자/불리언 자동 변환 방지 (prfstate 등 문자열 필드 보호)
const parser = new XMLParser({ parseTagValue: false });

const DATE_REGEX = /^\d{8}$/;

export interface KopisPerformanceRaw {
  mt20id: string; // 공연 ID
  prfnm: string; // 공연명
  prfpdfrom: string; // 공연 시작일
  prfpdto: string; // 공연 종료일
  fcltynm: string; // 공연시설명
  poster: string; // 포스터 이미지 URL
  area: string; // 지역
  genrenm: string; // 장르명
  openrun: string; // 오픈런 여부
  prfstate: string; // 공연 상태
}

export interface FetchPerformancesParams {
  stdate: string; // YYYYMMDD
  eddate: string; // YYYYMMDD
  cpage?: number;
  rows?: number;
  signgucode?: string; // 지역 코드
  prfstate?: '01' | '02' | '03'; // 01:예정 02:공연중 03:완료
}

export async function fetchPerformances(
  params: FetchPerformancesParams,
): Promise<KopisPerformanceRaw[]> {
  const apiKey = process.env.KOPIS_API_KEY?.trim();
  if (!apiKey) throw new Error('KOPIS_API_KEY 환경변수가 설정되지 않았습니다.');

  if (!DATE_REGEX.test(params.stdate) || !DATE_REGEX.test(params.eddate)) {
    throw new Error(
      '날짜 형식이 올바르지 않습니다. YYYYMMDD 형식으로 입력하세요.',
    );
  }

  const query = new URLSearchParams({
    service: apiKey,
    stdate: params.stdate,
    eddate: params.eddate,
    cpage: String(params.cpage ?? 1),
    rows: String(params.rows ?? 20),
    ...(params.signgucode && { signgucode: params.signgucode }),
    ...(params.prfstate && { prfstate: params.prfstate }),
  });

  const res = await fetch(`${BASE_URL}?${query}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    const errorBody = await res.text().catch(() => 'Unknown error');
    throw new Error(`KOPIS API 오류: ${res.status} - ${errorBody}`);
  }

  const xml = await res.text();

  let parsed: ReturnType<typeof parser.parse>;
  try {
    parsed = parser.parse(xml);
  } catch {
    throw new Error('KOPIS API 응답 파싱 실패: 유효하지 않은 XML 형식');
  }

  const db = parsed?.dbs?.db;
  if (!db) return [];

  // 단일 결과는 객체, 복수 결과는 배열로 반환됨
  const items = Array.isArray(db) ? db : [db];
  // prfstate 없는 항목 제외 (KOPIS 응답에서 간헐적으로 누락되는 경우 방어)
  return items.filter((item) => item.prfstate);
}
