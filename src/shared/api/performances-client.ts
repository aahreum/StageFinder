import type { FetchPerformancesParams, KopisPerformanceRaw } from "./kopis";

/** 클라이언트에서 내부 API Route를 통해 공연 데이터 조회 */
export async function fetchPerformancesClient(
  params: FetchPerformancesParams
): Promise<KopisPerformanceRaw[]> {
  const query = new URLSearchParams({
    stdate: params.stdate,
    eddate: params.eddate,
    cpage: String(params.cpage ?? 1),
    rows: String(params.rows ?? 20),
    ...(params.signgucode && { signgucode: params.signgucode }),
    ...(params.prfstate && { prfstate: params.prfstate }),
  });

  const res = await fetch(`/api/performances?${query}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(body.error ?? `API 오류: ${res.status}`);
  }

  return res.json();
}
