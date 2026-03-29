'use client';

import clsx from 'clsx';

export { getUniqueGenres, filterByGenre } from './genre-filter.utils';

interface Props {
  genres: string[];
  selected: string | null;
  onChange: (genre: string | null) => void;
}

const btnClass = (active: boolean) =>
  clsx(
    'cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors',
    active
      ? 'border-brand bg-brand text-white'
      : 'border-border text-subtle hover:border-brand hover:text-brand',
  );

export function GenreFilter({ genres, selected, onChange }: Props) {
  return (
    <div className='flex flex-wrap gap-2 px-4 py-2'>
      <button
        type='button'
        aria-pressed={selected === null}
        onClick={() => onChange(null)}
        className={btnClass(selected === null)}>
        전체
      </button>

      {genres.map((genre) => (
        <button
          key={genre}
          type='button'
          aria-pressed={selected === genre}
          onClick={() => onChange(genre)}
          className={btnClass(selected === genre)}>
          {genre}
        </button>
      ))}
    </div>
  );
}
