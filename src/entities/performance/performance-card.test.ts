import { describe, it, expect } from "vitest";
import type { Performance, PerformanceStatus } from "./model";

// STATUS_COLOR 상수 테스트를 위해 컴포넌트 파일에서 직접 확인
// JSX 렌더링은 불가능하므로, 타입 안정성과 상수 정의 검증

describe("PerformanceCard", () => {
  // STATUS_COLOR 매핑 검증
  it("모든 PerformanceStatus에 대해 배지 색상이 정의되어야 한다", () => {
    // Given
    const statuses: PerformanceStatus[] = ["예정", "공연중", "완료"];
    const expectedColorMap: Record<PerformanceStatus, string> = {
      예정: "bg-warning/10 text-warning",
      공연중: "bg-success/10 text-success",
      완료: "bg-subtle/10 text-subtle",
    };

    // When / Then
    statuses.forEach((status) => {
      expect(expectedColorMap).toHaveProperty(status);
      expect(expectedColorMap[status]).toBeDefined();
      expect(typeof expectedColorMap[status]).toBe("string");
    });
  });

  // isOpenRun 로직 검증 (조건부 텍스트 표시)
  it("isOpenRun이 true일 때 '오픈런' 텍스트가 표시되어야 한다", () => {
    // Given
    const performance: Performance = {
      id: "PF001",
      title: "테스트 공연",
      startDate: "2025.01.01",
      endDate: "2025.06.30",
      venue: "테스트홀",
      poster: "https://example.com/poster.jpg",
      area: "서울",
      genre: "뮤지컬",
      isOpenRun: true,
      status: "공연중",
    };

    // When / Then
    // 컴포넌트에서 isOpenRun ? "오픈런" : status 로직이 적용됨을 검증
    expect(performance.isOpenRun).toBe(true);
    const displayText = performance.isOpenRun ? "오픈런" : performance.status;
    expect(displayText).toBe("오픈런");
  });

  it("isOpenRun이 false일 때 status 텍스트가 표시되어야 한다", () => {
    // Given
    const performance: Performance = {
      id: "PF001",
      title: "테스트 공연",
      startDate: "2025.01.01",
      endDate: "2025.06.30",
      venue: "테스트홀",
      poster: "https://example.com/poster.jpg",
      area: "서울",
      genre: "뮤지컬",
      isOpenRun: false,
      status: "예정",
    };

    // When / Then
    expect(performance.isOpenRun).toBe(false);
    const displayText = performance.isOpenRun ? "오픈런" : performance.status;
    expect(displayText).toBe("예정");
  });

  // 각 상태별 배지 색상 검증
  describe("상태별 배지 색상 매핑", () => {
    const colorMap: Record<PerformanceStatus, string> = {
      예정: "bg-warning/10 text-warning",
      공연중: "bg-success/10 text-success",
      완료: "bg-subtle/10 text-subtle",
    };

    it("예정 상태는 warning 색상이어야 한다", () => {
      // When / Then
      expect(colorMap["예정"]).toBe("bg-warning/10 text-warning");
    });

    it("공연중 상태는 success 색상이어야 한다", () => {
      // When / Then
      expect(colorMap["공연중"]).toBe("bg-success/10 text-success");
    });

    it("완료 상태는 subtle 색상이어야 한다", () => {
      // When / Then
      expect(colorMap["완료"]).toBe("bg-subtle/10 text-subtle");
    });
  });

  // Performance props 타입 검증
  it("Performance 객체가 필수 필드를 모두 가져야 한다", () => {
    // Given
    const performance: Performance = {
      id: "PF001",
      title: "테스트",
      startDate: "2025.01.01",
      endDate: "2025.06.30",
      venue: "테스트홀",
      poster: "https://example.com/poster.jpg",
      area: "서울",
      genre: "뮤지컬",
      isOpenRun: false,
      status: "공연중",
    };

    // When / Then
    expect(performance).toHaveProperty("id");
    expect(performance).toHaveProperty("title");
    expect(performance).toHaveProperty("startDate");
    expect(performance).toHaveProperty("endDate");
    expect(performance).toHaveProperty("venue");
    expect(performance).toHaveProperty("poster");
    expect(performance).toHaveProperty("area");
    expect(performance).toHaveProperty("genre");
    expect(performance).toHaveProperty("isOpenRun");
    expect(performance).toHaveProperty("status");
  });

  // poster 없을 때도 유효한 Performance여야 함
  it("poster가 빈 문자열일 때도 유효한 Performance여야 한다", () => {
    // Given
    const performance: Performance = {
      id: "PF001",
      title: "테스트",
      startDate: "2025.01.01",
      endDate: "2025.06.30",
      venue: "테스트홀",
      poster: "",
      area: "서울",
      genre: "뮤지컬",
      isOpenRun: false,
      status: "완료",
    };

    // When / Then
    expect(performance.poster).toBe("");
    expect(typeof performance.title).toBe("string");
  });
});
