"use client";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="px-4 py-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="공연명 검색"
        className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-subtle focus:border-brand"
      />
    </div>
  );
}
