import { GenreFilter } from '@/features/genre-filter';
import { RegionFilter } from '@/features/region-filter';

interface Props {
  genres: string[];
  selectedGenre: string | null;
  onGenreChange: (genre: string | null) => void;
  areas: string[];
  selectedArea: string | null;
  onAreaChange: (area: string | null) => void;
}

export function FilterBar({
  genres,
  selectedGenre,
  onGenreChange,
  areas,
  selectedArea,
  onAreaChange,
}: Props) {
  return (
    <div className='border-b border-border'>
      <GenreFilter
        genres={genres}
        selected={selectedGenre}
        onChange={onGenreChange}
      />
      <RegionFilter
        areas={areas}
        selected={selectedArea}
        onChange={onAreaChange}
      />
    </div>
  );
}
