'use client';

import { pillButtonClass } from '@/shared/ui/button-class';

export { getUniqueGenres, filterByGenre } from './genre-filter.utils';

interface Props {
  genres: string[];
  selected: string | null;
  onChange: (genre: string | null) => void;
}

export function GenreFilter({ genres, selected, onChange }: Props) {
  return (
    <div className='flex flex-wrap gap-2 px-4 py-2'>
      <button
        type='button'
        aria-pressed={selected === null}
        onClick={() => onChange(null)}
        className={pillButtonClass(selected === null)}>
        전체
      </button>

      {genres.map((genre) => (
        <button
          key={genre}
          type='button'
          aria-pressed={selected === genre}
          onClick={() => onChange(genre)}
          className={pillButtonClass(selected === genre)}>
          {genre}
        </button>
      ))}
    </div>
  );
}
