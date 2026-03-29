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
    <div className='border-b border-border divide-y divide-border'>
      <div className='flex items-center gap-2 px-4 py-1'>
        <span className='text-xs font-medium text-subtle w-8 shrink-0'>장르</span>
        <GenreFilter
          genres={genres}
          selected={selectedGenre}
          onChange={onGenreChange}
        />
      </div>
      <div className='flex items-center gap-2 px-4 py-1'>
        <span className='text-xs font-medium text-subtle w-8 shrink-0'>지역</span>
        <RegionFilter
          areas={areas}
          selected={selectedArea}
          onChange={onAreaChange}
        />
      </div>
      <DateFilter dateFrom={dateFrom} dateTo={dateTo} onChange={onDateChange} />
    </div>
  );
}
