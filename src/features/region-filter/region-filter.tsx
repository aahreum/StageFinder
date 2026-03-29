'use client';

import { pillButtonClass } from '@/shared/ui/button-class';

export { getUniqueAreas, filterByArea } from './region-filter.utils';

interface Props {
  areas: string[];
  selected: string | null;
  onChange: (area: string | null) => void;
}

export function RegionFilter({ areas, selected, onChange }: Props) {
  return (
    <div className='flex flex-wrap gap-2 py-1'>
      <button
        type='button'
        aria-pressed={selected === null}
        onClick={() => onChange(null)}
        className={pillButtonClass(selected === null)}>
        전체
      </button>

      {areas.map((area) => (
        <button
          key={area}
          type='button'
          aria-pressed={selected === area}
          onClick={() => onChange(area)}
          className={pillButtonClass(selected === area)}>
          {area}
        </button>
      ))}
    </div>
  );
}
