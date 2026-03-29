import { PerformanceList } from "@/widgets";

// 오늘 기준 3개월간 공연 중인 공연 조회
function getTodayParams() {
  const today = new Date();
  const end = new Date(today);
  end.setMonth(end.getMonth() + 3);

  const fmt = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

  return { stdate: fmt(today), eddate: fmt(end), prfstate: "02" as const };
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="border-b border-border px-4 py-3">
        <h1 className="text-lg font-semibold text-brand">StageFinder</h1>
      </header>
      <PerformanceList params={getTodayParams()} />
    </main>
  );
}
