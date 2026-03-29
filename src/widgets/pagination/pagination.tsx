import { squareButtonClass } from '@/shared/ui/button-class';

interface Props {
  page: number;
  hasMore: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function Pagination({ page, hasMore, onPrev, onNext }: Props) {
  return (
    <div className='flex items-center justify-center gap-4 border-t border-border py-4'>
      <button
        type='button'
        onClick={onPrev}
        disabled={page === 1}
        className={squareButtonClass(page === 1)}>
        이전
      </button>
      <span className='text-sm text-subtle'>{page} 페이지</span>
      <button
        type='button'
        onClick={onNext}
        disabled={!hasMore}
        className={squareButtonClass(!hasMore)}>
        다음
      </button>
    </div>
  );
}
