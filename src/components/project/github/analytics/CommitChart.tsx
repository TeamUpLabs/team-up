import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { CommitData } from "@/types/github/CommitData";

interface CommitChartProps {
  commits: CommitData[];
}

export default function CommitChart({ commits }: CommitChartProps) {
  if (!commits || commits.length === 0) {
    return (
      <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out flex flex-col items-center justify-center h-full min-h-[300px]">
        <div className="text-center">
          <p className="text-text-primary text-lg font-semibold">커밋 활동 추이</p>
          <span className="text-text-secondary text-sm">
            분석할 레포지토리의 커밋 데이터가 없습니다.
          </span>
        </div>
      </div>
    );
  }

  // Generate a list of the last 7 dates in 'YYYY-MM-DD' format
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  // Group commits by date
  const commitsByDay = commits.reduce((acc, commit) => {
    const commitDate = new Date(commit.commit.author.date).toISOString().split("T")[0];
    acc[commitDate] = (acc[commitDate] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Create the final data array for the chart, ensuring all of the last 7 days are included
  const commitData = last7Days.map(date => ({
    date: date,
    commits: commitsByDay[date] || 0,
  }));

  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex flex-col gap-1">
        <p className="text-text-primary text-lg font-semibold">커밋 활동 추이</p>
        <span className="text-text-secondary text-sm">최근 7일간 커밋 활동</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={commitData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--component-border)" />
          <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getDate().toString()} />
          <YAxis allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--component-secondary-background)",
              borderColor: "var(--component-border)",
              borderRadius: "0.375rem",
              boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
              padding: "8px 12px",
            }}
            labelStyle={{ color: "var(--text-primary)", marginBottom: "4px", fontWeight: "500" }}
            itemStyle={{ color: "var(--text-secondary)" }}
            labelFormatter={(value) => new Date(value).toLocaleDateString("ko-KR")}
            formatter={(value, name) => [value, name === "commits" ? "커밋" : name]}
          />
          <Line type="monotone" dataKey="commits" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}