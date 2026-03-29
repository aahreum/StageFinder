import { PerformanceList } from "@/widgets";
import { getPerformanceDateParams } from "@/shared";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="border-b border-border px-4 py-3">
        <h1 className="text-lg font-semibold text-brand">StageFinder</h1>
        <p className="mt-0.5 text-xs text-subtle">
          오늘부터 3개월간 공연 예정·공연 중인 공연을 보여드립니다.
        </p>
      </header>
      <PerformanceList params={getPerformanceDateParams()} />
    </main>
  );
}
