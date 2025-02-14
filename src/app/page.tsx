import { PrusaAnalysisDashboard } from "@/components/prusa-analysis-dashboard";

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Prusa Market Analysis</h1>
      <PrusaAnalysisDashboard />
    </div>
  );
}
