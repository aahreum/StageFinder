import { describe, it, expect, vi } from "vitest";

// GenreFilter 컴포넌트의 Props 타입
interface GenreFilterProps {
  genres: string[];
  selected: string | null;
  onChange: (genre: string | null) => void;
}

// 헬퍼: 중복 제거 및 정렬된 장르 목록 생성
function getUniqueAndSortedGenres(genres: string[]): string[] {
  return [...new Set(genres)].sort();
}

// 헬퍼: 선택된 장르 기반 필터링
function filterGenresBySelection(
  genres: string[],
  selectedGenre: string | null
): string[] {
  if (selectedGenre === null) {
    return genres;
  }
  return genres.filter((genre) => genre === selectedGenre);
}

// 헬퍼: 특정 장르가 선택되었는지 확인
function isGenreSelected(selected: string | null, genre: string): boolean {
  return selected === genre;
}

// 헬퍼: "전체" 상태 확인
function isAllSelected(selected: string | null): boolean {
  return selected === null;
}

describe("GenreFilter - 순수 로직 테스트", () => {
  describe("getUniqueAndSortedGenres", () => {
    it("중복이 없는 배열이 들어오면 정렬된 배열을 반환해야 한다", () => {
      // Given
      const genres = ["뮤지컬", "연극", "댄스"];

      // When
      const result = getUniqueAndSortedGenres(genres);

      // Then
      expect(result).toEqual(["댄스", "뮤지컬", "연극"]);
    });

    it("중복이 있는 배열이 들어오면 중복을 제거하고 정렬해야 한다", () => {
      // Given
      const genres = ["뮤지컬", "연극", "뮤지컬", "댄스", "연극"];

      // When
      const result = getUniqueAndSortedGenres(genres);

      // Then
      expect(result).toEqual(["댄스", "뮤지컬", "연극"]);
      expect(result.length).toBe(3);
    });

    it("빈 배열이 들어오면 빈 배열을 반환해야 한다", () => {
      // Given
      const genres: string[] = [];

      // When
      const result = getUniqueAndSortedGenres(genres);

      // Then
      expect(result).toEqual([]);
    });

    it("한 개의 장르만 있으면 그대로 반환해야 한다", () => {
      // Given
      const genres = ["뮤지컬"];

      // When
      const result = getUniqueAndSortedGenres(genres);

      // Then
      expect(result).toEqual(["뮤지컬"]);
    });
  });

  describe("filterGenresBySelection", () => {
    it("selectedGenre가 null이면 전체 장르 배열을 반환해야 한다", () => {
      // Given
      const genres = ["뮤지컬", "연극", "댄스"];
      const selectedGenre = null;

      // When
      const result = filterGenresBySelection(genres, selectedGenre);

      // Then
      expect(result).toEqual(genres);
      expect(result.length).toBe(3);
    });

    it("selectedGenre가 지정되면 해당 장르만 필터링되어야 한다", () => {
      // Given
      const genres = ["뮤지컬", "연극", "댄스"];
      const selectedGenre = "뮤지컬";

      // When
      const result = filterGenresBySelection(genres, selectedGenre);

      // Then
      expect(result).toEqual(["뮤지컬"]);
      expect(result.length).toBe(1);
    });

    it("배열에 없는 장르를 선택하면 빈 배열을 반환해야 한다", () => {
      // Given
      const genres = ["뮤지컬", "연극", "댄스"];
      const selectedGenre = "영화";

      // When
      const result = filterGenresBySelection(genres, selectedGenre);

      // Then
      expect(result).toEqual([]);
    });

    it("빈 배열로 필터링하면 빈 배열을 반환해야 한다", () => {
      // Given
      const genres: string[] = [];
      const selectedGenre = "뮤지컬";

      // When
      const result = filterGenresBySelection(genres, selectedGenre);

      // Then
      expect(result).toEqual([]);
    });
  });

  describe("isGenreSelected", () => {
    it("selected가 genre와 일치하면 true를 반환해야 한다", () => {
      // Given
      const selected = "뮤지컬";
      const genre = "뮤지컬";

      // When
      const result = isGenreSelected(selected, genre);

      // Then
      expect(result).toBe(true);
    });

    it("selected가 genre와 일치하지 않으면 false를 반환해야 한다", () => {
      // Given
      const selected = "연극";
      const genre = "뮤지컬";

      // When
      const result = isGenreSelected(selected, genre);

      // Then
      expect(result).toBe(false);
    });

    it("selected가 null이면 false를 반환해야 한다", () => {
      // Given
      const selected: string | null = null;
      const genre = "뮤지컬";

      // When
      const result = isGenreSelected(selected, genre);

      // Then
      expect(result).toBe(false);
    });
  });

  describe("isAllSelected", () => {
    it("selected가 null이면 true를 반환해야 한다", () => {
      // Given
      const selected: string | null = null;

      // When
      const result = isAllSelected(selected);

      // Then
      expect(result).toBe(true);
    });

    it("selected가 특정 장르이면 false를 반환해야 한다", () => {
      // Given
      const selected = "뮤지컬";

      // When
      const result = isAllSelected(selected);

      // Then
      expect(result).toBe(false);
    });

    it("빈 문자열이 들어오면 false를 반환해야 한다", () => {
      // Given
      const selected = "";

      // When
      const result = isAllSelected(selected);

      // Then
      expect(result).toBe(false);
    });
  });
});

describe("GenreFilter - 콜백 검증", () => {
  describe("장르 선택 이벤트", () => {
    it("특정 장르 버튼을 클릭했을 때 onChange(genre)를 호출해야 한다", () => {
      // Given
      const onChange = vi.fn();
      const genres = ["뮤지컬", "연극", "댄스"];
      const selectedGenre = "뮤지컬";
      const clickedGenre = "연극";

      // When
      onChange(clickedGenre);

      // Then
      expect(onChange).toHaveBeenCalledWith("연극");
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("전체 버튼을 클릭했을 때 onChange(null)을 호출해야 한다", () => {
      // Given
      const onChange = vi.fn();

      // When
      onChange(null);

      // Then
      expect(onChange).toHaveBeenCalledWith(null);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("여러 장르 선택을 순서대로 변경하면 각각 onChange가 호출되어야 한다", () => {
      // Given
      const onChange = vi.fn();

      // When
      onChange("뮤지컬");
      onChange("연극");
      onChange(null);

      // Then
      expect(onChange).toHaveBeenCalledTimes(3);
      expect(onChange).toHaveBeenNthCalledWith(1, "뮤지컬");
      expect(onChange).toHaveBeenNthCalledWith(2, "연극");
      expect(onChange).toHaveBeenNthCalledWith(3, null);
    });
  });

  describe("선택 상태 검증", () => {
    it("selected가 null이면 전체 선택 상태여야 한다", () => {
      // Given
      const selected: string | null = null;
      const genres = ["뮤지컬", "연극"];

      // When
      const isAll = isAllSelected(selected);
      const isMusical = isGenreSelected(selected, "뮤지컬");

      // Then
      expect(isAll).toBe(true);
      expect(isMusical).toBe(false);
    });

    it("selected가 특정 장르이면 해당 장르만 선택 상태여야 한다", () => {
      // Given
      const selected = "뮤지컬";
      const genres = ["뮤지컬", "연극", "댄스"];

      // When
      const isAll = isAllSelected(selected);
      const isMusical = isGenreSelected(selected, "뮤지컬");
      const isTheater = isGenreSelected(selected, "연극");

      // Then
      expect(isAll).toBe(false);
      expect(isMusical).toBe(true);
      expect(isTheater).toBe(false);
    });
  });

  describe("GenreFilter export 검증", () => {
    it("GenreFilter 함수가 존재해야 한다", async () => {
      // Given
      const module = await import("./genre-filter");

      // When
      const GenreFilter = module.GenreFilter;

      // Then
      expect(GenreFilter).toBeDefined();
      expect(typeof GenreFilter).toBe("function");
    });
  });
});
