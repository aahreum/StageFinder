import { GenreFilter } from '@/features/genre-filter';

interface Props {
  genres: string[];
  selectedGenre: string | null;
  onGenreChange: (genre: string | null) => void;
}

export function FilterBar({ genres, selectedGenre, onGenreChange }: Props) {
  return (
    <div className='border-b border-border'>
      <GenreFilter
        genres={genres}
        selected={selectedGenre}
        onChange={onGenreChange}
      />
    </div>
  );
}
