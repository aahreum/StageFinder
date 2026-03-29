import { PerformanceList } from "@/widgets";
import { getPerformanceDateParams } from "@/shared";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="border-b border-border px-4 py-3">
        <h1 className="text-lg font-semibold text-brand">StageFinder</h1>
      </header>
      <PerformanceList params={getPerformanceDateParams()} />
    </main>
  );
}
