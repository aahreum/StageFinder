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
    <div className='divide-y divide-border border-b border-border'>
      <div className='flex items-center gap-2 px-4 py-1'>
        <span className='w-8 shrink-0 text-xs font-medium text-subtle'>장르</span>
        <GenreFilter
          genres={genres}
          selected={selectedGenre}
          onChange={onGenreChange}
        />
      </div>
      <div className='flex items-center gap-2 px-4 py-1'>
        <span className='w-8 shrink-0 text-xs font-medium text-subtle'>지역</span>
        <RegionFilter
          areas={areas}
          selected={selectedArea}
          onChange={onAreaChange}
        />
      </div>
    </div>
  );
}
