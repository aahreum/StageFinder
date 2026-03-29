"use client";

import { filterBtnClass } from "@/shared/ui/button-class";

// 지역 코드 → 표시명 매핑 (KOPIS signgucode 기준)
export const REGION_OPTIONS = [
  { code: "11", label: "서울" },
  { code: "21", label: "부산" },
  { code: "22", label: "대구" },
  { code: "23", label: "인천" },
  { code: "24", label: "광주" },
  { code: "25", label: "대전" },
  { code: "26", label: "울산" },
  { code: "29", label: "세종" },
  { code: "31", label: "경기" },
  { code: "32", label: "강원" },
  { code: "33", label: "충북" },
  { code: "34", label: "충남" },
  { code: "35", label: "전북" },
  { code: "36", label: "전남" },
  { code: "37", label: "경북" },
  { code: "38", label: "경남" },
  { code: "39", label: "제주" },
] as const;

interface Props {
  selected: string | null;
  onChange: (code: string | null) => void;
}

export function RegionFilter({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      <button
        type="button"
        aria-pressed={selected === null}
        onClick={() => onChange(null)}
        className={filterBtnClass(selected === null)}
      >
        전체
      </button>

      {REGION_OPTIONS.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          aria-pressed={selected === code}
          onClick={() => onChange(code)}
          className={filterBtnClass(selected === code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
