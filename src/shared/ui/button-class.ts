import clsx from 'clsx';

/** 활성/비활성 상태에 따른 pill 버튼 className */
export const pillButtonClass = (active: boolean) =>
  clsx(
    'cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors',
    active
      ? 'border-brand bg-brand text-white'
      : 'border-border text-subtle hover:border-brand hover:text-brand',
  );

/** 활성/비활성 상태에 따른 사각형 버튼 className */
export const squareButtonClass = (disabled: boolean) =>
  clsx(
    'rounded-lg border px-4 py-2 text-sm transition-colors',
    disabled
      ? 'cursor-not-allowed border-border opacity-40'
      : 'cursor-pointer border-border hover:border-brand hover:text-brand',
  );
