import { describe, it, expect, vi } from "vitest";

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
// shared barrel을 거치지 않고 직접 import하여 Supabase 초기화 우회
import { getPerformanceDateParams } from "../../shared/lib/date-params";

describe("getPerformanceDateParams 날짜 형식 검증", () => {
  it("stdate가 YYYYMMDD 8자리여야 한다", () => {
    expect(getPerformanceDateParams().stdate).toMatch(/^\d{8}$/);
  });

  it("eddate가 YYYYMMDD 8자리여야 한다", () => {
    expect(getPerformanceDateParams().eddate).toMatch(/^\d{8}$/);
  });

  it("eddate가 stdate보다 미래여야 한다", () => {
    const { stdate, eddate } = getPerformanceDateParams();
    expect(parseInt(eddate)).toBeGreaterThan(parseInt(stdate));
  });

  it("prfstate가 '02'(공연중)여야 한다", () => {
    expect(getPerformanceDateParams().prfstate).toBe("02");
  });

  it("eddate가 stdate 기준 3개월 후여야 한다", () => {
    const { eddate } = getPerformanceDateParams();
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
