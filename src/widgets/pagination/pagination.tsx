import clsx from 'clsx';

interface Props {
  page: number;
  hasMore: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const btnClass = (disabled: boolean) =>
  clsx(
    'rounded-lg border px-4 py-2 text-sm transition-colors',
    disabled
      ? 'cursor-not-allowed border-border opacity-40'
      : 'cursor-pointer border-border hover:border-brand hover:text-brand',
  );

export function Pagination({ page, hasMore, onPrev, onNext }: Props) {
  return (
    <div className='flex items-center justify-center gap-4 border-t border-border py-4'>
      <button
        type='button'
        onClick={onPrev}
        disabled={page === 1}
        className={btnClass(page === 1)}>
        이전
      </button>
      <span className='text-sm text-subtle'>{page} 페이지</span>
      <button
        type='button'
        onClick={onNext}
        disabled={!hasMore}
        className={btnClass(!hasMore)}>
        다음
      </button>
    </div>
  );
}
