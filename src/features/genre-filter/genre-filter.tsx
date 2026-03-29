"use client";

interface Props {
  genres: string[];
  selected: string | null;
  onChange: (genre: string | null) => void;
}

export function GenreFilter({ genres, selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      {/* 전체 버튼 */}
      <button
        onClick={() => onChange(null)}
        className={`rounded-full border px-3 py-1 text-sm transition-colors ${
          selected === null
            ? "border-brand bg-brand text-white"
            : "border-border text-subtle hover:border-brand hover:text-brand"
        }`}
      >
        전체
      </button>

      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onChange(genre)}
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
            selected === genre
              ? "border-brand bg-brand text-white"
              : "border-border text-subtle hover:border-brand hover:text-brand"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
