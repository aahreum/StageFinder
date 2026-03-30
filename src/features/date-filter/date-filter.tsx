"use client";

import { filterBtnClass } from "@/shared/ui/button-class";
import type { DateRange } from "./date-filter.utils";

const DATE_OPTIONS: { value: DateRange | null; label: string }[] = [
  { value: null, label: "전체" },
  { value: "week", label: "이번 주" },
  { value: "month", label: "이번 달" },
  { value: "next-month", label: "다음 달" },
];

interface Props {
  selected: DateRange | null;
  onChange: (range: DateRange | null) => void;
}

export function DateFilter({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      {DATE_OPTIONS.map(({ value, label }) => (
        <button
          key={label}
          type="button"
          aria-pressed={selected === value}
          onClick={() => onChange(value)}
          className={filterBtnClass(selected === value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
