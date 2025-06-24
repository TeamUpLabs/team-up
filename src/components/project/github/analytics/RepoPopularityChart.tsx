import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RepoPopularityChartProps {
  stars: number;
  forks: number;
  watchers: number;
}

export default function RepoPopularityChart({ stars, forks, watchers }: RepoPopularityChartProps) {
  const data = [
    { name: "Stars", count: stars || 0 },
    { name: "Forks", count: forks || 0 },
    { name: "Watchers", count: watchers || 0 },
  ];

  if (stars === 0 || forks === 0 || watchers === 0) {
    return (
      <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out flex flex-col items-center justify-center h-full min-h-[300px]">
        <div className="text-center">
          <p className="text-text-primary text-lg font-semibold">저장소 인기 지표</p>
          <span className="text-text-secondary text-sm">
            분석할 레포지토리의 인기 지표 데이터가 없습니다.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex flex-col gap-1">
        <p className="text-text-primary text-lg font-semibold">저장소 인기 지표</p>
        <span className="text-text-secondary text-sm">Stars / Forks / Watchers</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-component-secondary-background)",
              borderColor: "var(--color-component-border)",
              borderRadius: "0.375rem",
              boxShadow:
                "0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
              padding: "8px 12px",
            }}
            labelStyle={{ color: "var(--color-text-primary)", marginBottom: 4, fontWeight: 500 }}
            itemStyle={{ color: "var(--color-text-secondary)" }}
          />
          <Legend formatter={(value) => <span className="text-text-secondary ml-2">{value}</span>} />
          <Bar dataKey="count" fill="#60A5FA" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
