'use client';

import { filterBtnClass } from '@/shared/ui/button-class';

// 지역 코드 → 표시명 매핑 (KOPIS signgucode = 법정동코드 앞 2자리)
export const REGION_OPTIONS = [
  { code: '11', label: '서울' },
  { code: '26', label: '부산' },
  { code: '27', label: '대구' },
  { code: '28', label: '인천' },
  { code: '29', label: '광주' },
  { code: '30', label: '대전' },
  { code: '31', label: '울산' },
  { code: '36', label: '세종' },
  { code: '41', label: '경기' },
  { code: '51', label: '강원' },
  { code: '43', label: '충북' },
  { code: '44', label: '충남' },
  { code: '52', label: '전북' },
  { code: '46', label: '전남' },
  { code: '47', label: '경북' },
  { code: '48', label: '경남' },
  { code: '50', label: '제주' },
] as const;

interface Props {
  selected: string | null;
  onChange: (code: string | null) => void;
}

export function RegionFilter({ selected, onChange }: Props) {
  return (
    <div className='flex flex-wrap gap-2 px-4 py-2'>
      <button
        type='button'
        aria-pressed={selected === null}
        onClick={() => onChange(null)}
        className={filterBtnClass(selected === null)}>
        전체
      </button>

      {REGION_OPTIONS.map(({ code, label }) => (
        <button
          key={code}
          type='button'
          aria-pressed={selected === code}
          onClick={() => onChange(code)}
          className={filterBtnClass(selected === code)}>
          {label}
        </button>
      ))}
    </div>
  );
}
