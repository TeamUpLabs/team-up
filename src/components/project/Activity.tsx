import { useProject } from "@/contexts/ProjectContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'; 
import { useEffect, useState } from 'react';

interface ChartDataItem {
  date: string;
  '생성된 작업': number;
  '시작된 마일스톤': number;
  '전체': number; // Added the total as a new property
}

export default function Activity() {
  const { project } = useProject();
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (project && project.tasks && project.milestones) {
      setIsLoading(true);
      const processData = () => {
        const aggregatedData: { [key: string]: { tasks: number; milestones: number; total: number } } = {};

        project.tasks.forEach(task => {
          if (task.createdAt) {
            const d = new Date(task.createdAt);
            const year = d.getFullYear();
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const day = d.getDate().toString().padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`;

            if (!aggregatedData[dateKey]) {
              aggregatedData[dateKey] = { tasks: 0, milestones: 0, total: 0 };
            }
            aggregatedData[dateKey].tasks++;
            aggregatedData[dateKey].total++;
          }
        });

        project.milestones.forEach(milestone => {
          if (milestone.startDate) {
            const d = new Date(milestone.startDate);
            const year = d.getFullYear();
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const day = d.getDate().toString().padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`;

            if (!aggregatedData[dateKey]) {
              aggregatedData[dateKey] = { tasks: 0, milestones: 0, total: 0 };
            }
            aggregatedData[dateKey].milestones++;
            aggregatedData[dateKey].total++;
          }
        });

        const formattedData: ChartDataItem[] = Object.keys(aggregatedData)
          .map(dateKey => ({
            date: dateKey, // Store YYYY-MM-DD string
            '생성된 작업': aggregatedData[dateKey].tasks,
            '시작된 마일스톤': aggregatedData[dateKey].milestones,
            '전체': aggregatedData[dateKey].total,
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); 
        
        setChartData(formattedData);
        setIsLoading(false);
      };
      processData();
    } else if (project) { 
        setChartData([]);
        setIsLoading(false);
    }
  }, [project]);

  return (
    <div className="col-span-1 sm:col-span-2 bg-component-background p-4 sm:p-6 rounded-lg shadow-md border border-component-border">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary">일별 활동량</h2>
      </div>

      <div className="h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-secondary">차트 데이터 로딩 중...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-secondary">표시할 활동 데이터가 없습니다.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-component-border)" horizontal={true} vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-text-secondary)" 
                tickFormatter={(tick) => {
                  // tick is YYYY-MM-DD, format to 'M월 D일'
                  const dateObj = new Date(tick);
                  return dateObj.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="var(--color-text-secondary)" 
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-component-secondary-background)', 
                  borderColor: 'var(--color-component-border)',
                  borderRadius: '0.375rem', 
                  boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.05)', 
                  padding: '8px 12px', 
                }}
                labelStyle={{ color: 'var(--color-text-primary)', marginBottom: '4px', fontWeight: '500' }}
                itemStyle={{ color: 'var(--color-text-secondary)' }}
                labelFormatter={(label) => {
                  // label is YYYY-MM-DD, format to 'YYYY년 M월 D일'
                  const dateObj = new Date(label);
                  return dateObj.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
                }}
              />
              {/* Display the total as the main area */}
              <Line 
                type="monotoneX" 
                dataKey="전체" 
                name="전체" 
                stroke="#22c55e" 
                strokeWidth={2} 
                activeDot={{ r: 5, strokeWidth: 1.5, fill: 'var(--color-component-background)', stroke: '#22c55e' }} 
              />
              
              <Line type="monotoneX" dataKey="생성된 작업" name="생성된 작업" stroke="var(--color-accent-primary)" strokeWidth={1} activeDot={{ r: 4, strokeWidth: 1, fill: 'var(--color-component-background)', stroke: 'var(--color-accent-primary)' }} strokeDasharray="5 5" />
              <Line type="monotoneX" dataKey="시작된 마일스톤" name="시작된 마일스톤" stroke="var(--color-accent-secondary)" strokeWidth={1} activeDot={{ r: 4, strokeWidth: 1, fill: 'var(--color-component-background)', stroke: 'var(--color-accent-secondary)' }} strokeDasharray="5 5" />
              <Legend verticalAlign="top" align="right" height={36} iconSize={10} wrapperStyle={{ top: -5, right: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}