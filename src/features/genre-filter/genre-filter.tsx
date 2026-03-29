"use client";

import { filterBtnClass } from "@/shared/ui/button-class";

/** 공연 목록에서 중복 없는 정렬된 장르 목록 반환 */
export function getUniqueGenres(genres: string[]): string[] {
  return [...new Set(genres)].sort();
}

/** 선택된 장르로 필터링 (null이면 전체 반환) */
export function filterByGenre<T extends { genre: string }>(
  items: T[],
  selected: string | null,
): T[] {
  return selected ? items.filter((item) => item.genre === selected) : items;
}

interface Props {
  genres: string[];
  selected: string | null;
  onChange: (genre: string | null) => void;
}

export function GenreFilter({ genres, selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      <button
        type="button"
        aria-pressed={selected === null}
        onClick={() => onChange(null)}
        className={filterBtnClass(selected === null)}
      >
        전체
      </button>

      {genres.map((genre) => (
        <button
          key={genre}
          type="button"
          aria-pressed={selected === genre}
          onClick={() => onChange(genre)}
          className={filterBtnClass(selected === genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
