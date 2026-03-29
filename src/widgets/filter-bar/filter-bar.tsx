import { GenreFilter } from '@/features/genre-filter';
import { RegionFilter } from '@/features/region-filter';

interface Props {
  genres: string[];
  selectedGenre: string | null;
  onGenreChange: (genre: string | null) => void;
  selectedRegion: string | null;
  onRegionChange: (code: string | null) => void;
}

export function FilterBar({
  genres,
  selectedGenre,
  onGenreChange,
  selectedRegion,
  onRegionChange,
}: Props) {
  return (
    <div className='border-b border-border'>
      <GenreFilter
        genres={genres}
        selected={selectedGenre}
        onChange={onGenreChange}
      />
      <RegionFilter
        selected={selectedRegion}
        onChange={onRegionChange}
      />
    </div>
  );
}
