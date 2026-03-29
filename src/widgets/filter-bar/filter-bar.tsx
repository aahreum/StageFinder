import { GenreFilter } from '@/features/genre-filter';
import { RegionFilter } from '@/features/region-filter';
import { DateFilter } from '@/features/date-filter';

interface Props {
  genres: string[];
  selectedGenre: string | null;
  onGenreChange: (genre: string | null) => void;
  areas: string[];
  selectedArea: string | null;
  onAreaChange: (area: string | null) => void;
  dateFrom: string | null;
  dateTo: string | null;
  onDateChange: (from: string | null, to: string | null) => void;
}

export function FilterBar({
  genres,
  selectedGenre,
  onGenreChange,
  areas,
  selectedArea,
  onAreaChange,
  dateFrom,
  dateTo,
  onDateChange,
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
      <DateFilter dateFrom={dateFrom} dateTo={dateTo} onChange={onDateChange} />
    </div>
  );
}
