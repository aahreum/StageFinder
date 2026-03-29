import { describe, it, expect, vi } from "vitest";
import type { FetchPerformancesParams } from "@/shared";

// 트랜지티브 Supabase 초기화 에러 방지를 위해 의존성 모킹
vi.mock("@/entities/performance", () => ({
  usePerformances: vi.fn(),
  PerformanceCard: vi.fn(),
}));
vi.mock("@/shared", () => ({
  supabase: {},
  fetchPerformances: vi.fn(),
}));

import { PerformanceList } from "./performance-list";

// ---------------------------------------------------------------------------
// app/page.tsx의 getTodayParams 로직 재현 (날짜 포맷 검증용)
// ---------------------------------------------------------------------------
function getTodayParams(): FetchPerformancesParams {
  const today = new Date();
  const end = new Date(today);
  end.setMonth(end.getMonth() + 3);
  const fmt = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return { stdate: fmt(today), eddate: fmt(end), prfstate: "02" as const };
}

describe("getTodayParams 날짜 형식 검증", () => {
  it("stdate가 YYYYMMDD 8자리여야 한다", () => {
    expect(getTodayParams().stdate).toMatch(/^\d{8}$/);
  });

  it("eddate가 YYYYMMDD 8자리여야 한다", () => {
    expect(getTodayParams().eddate).toMatch(/^\d{8}$/);
  });

  it("eddate가 stdate보다 미래여야 한다", () => {
    const { stdate, eddate } = getTodayParams();
    expect(parseInt(eddate)).toBeGreaterThan(parseInt(stdate));
  });

  it("prfstate가 '02'(공연중)여야 한다", () => {
    expect(getTodayParams().prfstate).toBe("02");
  });

  it("eddate가 stdate 기준 3개월 후여야 한다", () => {
    const { eddate } = getTodayParams();
    const future = new Date();
    future.setMonth(future.getMonth() + 3);
    const expected = `${future.getFullYear()}${String(future.getMonth() + 1).padStart(2, "0")}`;
    expect(eddate.substring(0, 6)).toBe(expected);
  });
});

describe("PerformanceList", () => {
  it("함수로 export되어야 한다", () => {
    expect(typeof PerformanceList).toBe("function");
  });
});
