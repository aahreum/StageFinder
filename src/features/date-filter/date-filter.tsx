'use client';

export { filterByDate } from './date-filter.utils';

interface Props {
  dateFrom: string | null;
  dateTo: string | null;
  onChange: (from: string | null, to: string | null) => void;
}

export function DateFilter({ dateFrom, dateTo, onChange }: Props) {
  return (
    <div className='flex flex-wrap items-center gap-2 px-4 py-2'>
      <span className='text-sm text-subtle'>날짜</span>
      <input
        type='date'
        aria-label='시작 날짜'
        value={dateFrom ?? ''}
        onChange={(e) => onChange(e.target.value || null, dateTo)}
        className='rounded border border-border bg-surface px-2 py-1 text-sm'
      />
      <span className='text-sm text-subtle'>~</span>
      <input
        type='date'
        aria-label='종료 날짜'
        value={dateTo ?? ''}
        min={dateFrom ?? undefined}
        onChange={(e) => onChange(dateFrom, e.target.value || null)}
        className='rounded border border-border bg-surface px-2 py-1 text-sm'
      />
      {(dateFrom || dateTo) && (
        <button
          type='button'
          onClick={() => onChange(null, null)}
          className='text-sm text-subtle underline'>
          초기화
        </button>
      )}
    </div>
  );
}
