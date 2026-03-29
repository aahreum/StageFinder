import { describe, it, expect } from "vitest";
import type { PerformanceStatus } from "./model";
// 실제 컴포넌트 상수를 import하여 컴포넌트 변경 시 테스트가 실패하도록 함
import { STATUS_COLOR } from "./performance-card";

describe("STATUS_COLOR", () => {
  const statuses: PerformanceStatus[] = ["공연예정", "공연중", "공연완료"];

  it("모든 PerformanceStatus에 대해 색상 클래스가 정의되어야 한다", () => {
    // Given / When / Then
    statuses.forEach((status) => {
      expect(STATUS_COLOR[status]).toBeDefined();
    });
  });

  it("공연예정 상태는 warning 색상이어야 한다", () => {
    expect(STATUS_COLOR["공연예정"]).toBe("bg-warning/10 text-warning");
  });

  it("공연중 상태는 success 색상이어야 한다", () => {
    expect(STATUS_COLOR["공연중"]).toBe("bg-success/10 text-success");
  });

  it("공연완료 상태는 subtle 색상이어야 한다", () => {
    expect(STATUS_COLOR["공연완료"]).toBe("bg-subtle/10 text-subtle");
  });

  it("STATUS_COLOR 키가 PerformanceStatus 목록과 일치해야 한다", () => {
    // STATUS_COLOR에 누락되거나 잘못된 키가 없는지 검증
    expect(Object.keys(STATUS_COLOR).sort()).toEqual([...statuses].sort());
  });
});
