/** 필터 버튼 스타일 (장르/지역 공통) */
export function filterBtnClass(active: boolean) {
  return `rounded-full border px-3 py-1 text-sm transition-colors cursor-pointer ${
    active
      ? "border-brand bg-brand text-white"
      : "border-border text-subtle hover:border-brand hover:text-brand"
  }`;
}
