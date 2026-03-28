import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchPerformances } from "./kopis";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeXml(dbContent: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?><dbs>${dbContent}</dbs>`;
}

const SINGLE_DB = `
  <db>
    <mt20id>PF279014</mt20id>
    <prfnm>테스트 공연</prfnm>
    <prfpdfrom>2025.01.11</prfpdfrom>
    <prfpdto>2026.06.28</prfpdto>
    <fcltynm>테스트 공연장</fcltynm>
    <poster>http://example.com/poster.jpg</poster>
    <area>서울특별시</area>
    <genrenm>연극</genrenm>
    <openrun>N</openrun>
    <prfstate>공연중</prfstate>
  </db>
`;

const SECOND_DB = `
  <db>
    <mt20id>PF279015</mt20id>
    <prfnm>두 번째 공연</prfnm>
    <prfpdfrom>2025.02.01</prfpdfrom>
    <prfpdto>2026.07.31</prfpdto>
    <fcltynm>두 번째 공연장</fcltynm>
    <poster>http://example.com/poster2.jpg</poster>
    <area>부산광역시</area>
    <genrenm>뮤지컬</genrenm>
    <openrun>Y</openrun>
    <prfstate>공연예정</prfstate>
  </db>
`;

function mockOkResponse(body: string): Response {
  return {
    ok: true,
    text: () => Promise.resolve(body),
  } as unknown as Response;
}

function mockErrorResponse(status: number, body = "Internal Server Error"): Response {
  return {
    ok: false,
    status,
    text: () => Promise.resolve(body),
  } as unknown as Response;
}

const VALID_PARAMS = { stdate: "20250101", eddate: "20251231" };

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("fetchPerformances", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    process.env.KOPIS_API_KEY = "test-api-key";
  });

  // -------------------------------------------------------------------------
  // 1. 정상 응답 - 복수 결과 배열 반환
  // -------------------------------------------------------------------------
  describe("복수의 공연 결과가 있을 때", () => {
    it("각 항목을 배열로 반환해야 한다", async () => {
      // Given
      const xml = makeXml(SINGLE_DB + SECOND_DB);
      vi.mocked(fetch).mockResolvedValue(mockOkResponse(xml));

      // When
      const result = await fetchPerformances(VALID_PARAMS);

      // Then
      expect(result).toHaveLength(2);
      expect(result[0].mt20id).toBe("PF279014");
      expect(result[1].mt20id).toBe("PF279015");
    });
  });

  // -------------------------------------------------------------------------
  // 2. 정상 응답 - 단일 결과도 배열로 반환
  // -------------------------------------------------------------------------
  describe("단일 공연 결과가 있을 때", () => {
    it("단일 결과도 배열로 반환해야 한다", async () => {
      // Given
      const xml = makeXml(SINGLE_DB);
      vi.mocked(fetch).mockResolvedValue(mockOkResponse(xml));

      // When
      const result = await fetchPerformances(VALID_PARAMS);

      // Then
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0].mt20id).toBe("PF279014");
      expect(result[0].prfnm).toBe("테스트 공연");
    });
  });

  // -------------------------------------------------------------------------
  // 3. 빈 결과 (db 없음) - 빈 배열 반환
  // -------------------------------------------------------------------------
  describe("공연 결과가 없을 때", () => {
    it("빈 배열을 반환해야 한다", async () => {
      // Given
      const xml = makeXml(""); // <dbs></dbs>
      vi.mocked(fetch).mockResolvedValue(mockOkResponse(xml));

      // When
      const result = await fetchPerformances(VALID_PARAMS);

      // Then
      expect(result).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // 4. API_KEY 없을 때 에러
  // -------------------------------------------------------------------------
  describe("KOPIS_API_KEY 환경변수가 없을 때", () => {
    it("환경변수 관련 에러를 던져야 한다", async () => {
      // Given
      delete process.env.KOPIS_API_KEY;

      // When / Then
      await expect(fetchPerformances(VALID_PARAMS)).rejects.toThrow(
        "KOPIS_API_KEY 환경변수가 설정되지 않았습니다."
      );
    });

    it("빈 문자열인 경우에도 에러를 던져야 한다", async () => {
      // Given
      process.env.KOPIS_API_KEY = "   "; // 공백만 있는 경우 (.trim() 후 빈 문자열)

      // When / Then
      await expect(fetchPerformances(VALID_PARAMS)).rejects.toThrow(
        "KOPIS_API_KEY 환경변수가 설정되지 않았습니다."
      );
    });
  });

  // -------------------------------------------------------------------------
  // 5. 날짜 형식이 잘못됐을 때 에러
  // -------------------------------------------------------------------------
  describe("날짜 형식이 YYYYMMDD가 아닐 때", () => {
    it("stdate 형식이 잘못됐을 때 에러를 던져야 한다", async () => {
      // Given
      const params = { stdate: "2025-01-01", eddate: "20251231" };

      // When / Then
      await expect(fetchPerformances(params)).rejects.toThrow(
        "날짜 형식이 올바르지 않습니다. YYYYMMDD 형식으로 입력하세요."
      );
    });

    it("eddate 형식이 잘못됐을 때 에러를 던져야 한다", async () => {
      // Given
      const params = { stdate: "20250101", eddate: "2025/12/31" };

      // When / Then
      await expect(fetchPerformances(params)).rejects.toThrow(
        "날짜 형식이 올바르지 않습니다. YYYYMMDD 형식으로 입력하세요."
      );
    });

    it("날짜가 8자리 숫자가 아닐 때 에러를 던져야 한다", async () => {
      // Given
      const params = { stdate: "202501", eddate: "20251231" };

      // When / Then
      await expect(fetchPerformances(params)).rejects.toThrow(
        "날짜 형식이 올바르지 않습니다. YYYYMMDD 형식으로 입력하세요."
      );
    });
  });

  // -------------------------------------------------------------------------
  // 6. HTTP 에러 응답 시 에러
  // -------------------------------------------------------------------------
  describe("HTTP 에러 응답이 올 때", () => {
    it("500 응답일 때 에러를 던져야 한다", async () => {
      // Given
      vi.mocked(fetch).mockResolvedValue(mockErrorResponse(500, "Internal Server Error"));

      // When / Then
      await expect(fetchPerformances(VALID_PARAMS)).rejects.toThrow(
        "KOPIS API 오류: 500 - Internal Server Error"
      );
    });

    it("401 응답일 때 에러를 던져야 한다", async () => {
      // Given
      vi.mocked(fetch).mockResolvedValue(mockErrorResponse(401, "Unauthorized"));

      // When / Then
      await expect(fetchPerformances(VALID_PARAMS)).rejects.toThrow(
        "KOPIS API 오류: 401 - Unauthorized"
      );
    });
  });

  // -------------------------------------------------------------------------
  // 7. 잘못된 XML 응답 시 처리
  //    fast-xml-parser는 잘못된 XML도 파싱을 시도하므로,
  //    dbs 노드가 없는 경우 빈 배열을 반환한다.
  // -------------------------------------------------------------------------
  describe("잘못된 XML 응답이 올 때", () => {
    it("dbs 노드가 없는 XML 응답일 때 빈 배열을 반환해야 한다", async () => {
      // Given
      const malformedXml = "<unexpected><data>값</data></unexpected>";
      vi.mocked(fetch).mockResolvedValue(mockOkResponse(malformedXml));

      // When
      const result = await fetchPerformances(VALID_PARAMS);

      // Then
      expect(result).toEqual([]);
    });

    it("완전히 깨진 XML(plain text)이 올 때 빈 배열을 반환해야 한다", async () => {
      // Given – fast-xml-parser는 일반 텍스트도 예외 없이 파싱하므로 dbs 없음 → []
      const plainText = "not xml at all !!!";
      vi.mocked(fetch).mockResolvedValue(mockOkResponse(plainText));

      // When
      const result = await fetchPerformances(VALID_PARAMS);

      // Then
      expect(result).toEqual([]);
    });
  });
});
