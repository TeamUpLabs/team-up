import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  TooltipProps,
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { getLanguageColor } from "@/utils/languageColors";

interface LanguageChartProps {
  languages: {
    [key: string]: number;
  };
}

export default function LanguageChart({ languages }: LanguageChartProps) {
  const languageData = useMemo(
    () =>
      languages
        ? Object.entries(languages).map(([name, value]) => ({ name, value }))
        : [],
    [languages]
  );

  const totalValue = useMemo(
    () => languageData.reduce((sum, entry) => sum + entry.value, 0),
    [languageData]
  );

  const CustomTooltip = ({
    active,
    payload,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = (((data.value as number) / totalValue) * 100).toFixed(2);
      return (
        <div className="rounded-lg border bg-component-background p-2 shadow-sm text-text-primary">
          <p className="font-bold">{`${data.name}: ${percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  if (languageData.length === 0) {
    return (
      <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out flex flex-col items-center justify-center h-full min-h-[300px]">
        <div className="text-center">
          <p className="text-text-primary text-lg font-semibold">언어 분포</p>
          <span className="text-text-secondary text-sm">
            분석할 레포지토리의 언어 데이터가 없습니다.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex flex-col gap-1">
        <p className="text-text-primary text-lg font-semibold">언어 분포</p>
        <span className="text-text-secondary text-sm">
          사용 중인 프로그래밍 언어
        </span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-text-secondary ml-2">{value}</span>
            )}
          />
          <Pie
            data={languageData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          >
            {languageData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={getLanguageColor(entry.name)} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}