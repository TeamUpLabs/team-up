import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Task } from '@/types/Task';
import { MileStone } from '@/types/MileStone';
import { Schedule } from '@/types/Schedule';

interface WeeklyChartProps {
  tasks: Task[];
  milestones: MileStone[];
  schedules: Schedule[];
}

interface ChartData {
  name: string;
  taskCount: number;
  milestoneCount: number;
  meetingCount: number;
  eventCount: number;
  date: Date;
}

export default function WeeklyChart({ tasks, milestones, schedules }: WeeklyChartProps) {
  // Get dates for the past 7 days
  const getPastWeekDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  // Format date to YYYY-MM-DD for comparison
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Helper function to safely parse a date string or Date object
  const safeDateParse = (dateInput: string | Date | undefined | null): Date | null => {
    if (!dateInput) return null;
    try {
      const date = new Date(dateInput);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  // Helper function to extract date from different item types
  const getDateFromItem = (item: Task | MileStone | Schedule, dateField: string): Date | null => {
    // Handle Task type
    if ('created_at' in item && dateField === 'created_at') {
      return safeDateParse(item.created_at);
    }
    
    // Handle MileStone type
    if ('start_date' in item && dateField === 'start_date') {
      return safeDateParse(item.start_date);
    }
    
    // Handle Schedule type (meeting/event)
    if ('start_time' in item && dateField === 'start_time') {
      return safeDateParse(item.start_time);
    }
    
    return null;
  };

  // Count items by a specific date field
  const countItemsByDateField = <T extends Task | MileStone | Schedule>(
    items: T[], 
    dateField: string
  ): Record<string, number> => {
    const counts: Record<string, number> = {};
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 6);

    items.forEach(item => {
      const itemDate = getDateFromItem(item, dateField);
      if (!itemDate) return;
      
      // Reset time part for date comparison
      const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
      const weekAgoDate = new Date(weekAgo.getFullYear(), weekAgo.getMonth(), weekAgo.getDate());
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      if (itemDateOnly >= weekAgoDate && itemDateOnly <= todayDate) {
        const dateStr = formatDate(itemDate);
        counts[dateStr] = (counts[dateStr] || 0) + 1;
      }
    });
    
    return counts;
  };

  // Prepare chart data
  const prepareChartData = (): ChartData[] => {
    // Count tasks by creation date
    const taskCounts = countItemsByDateField<Task>(tasks, 'created_at');
    
    // Count milestones by start date
    const milestoneCounts = countItemsByDateField<MileStone>(milestones, 'start_date');
    
    // Count meetings and events by start_time
    const meetings = schedules.filter((s): s is Schedule => s.type === 'meeting');
    const meetingCounts = countItemsByDateField<Schedule>(meetings, 'start_time');
    
    const events = schedules.filter((s): s is Schedule => s.type === 'event');
    const eventCounts = countItemsByDateField<Schedule>(events, 'start_time');

    return getPastWeekDates().map(date => {
      const dateStr = formatDate(date);
      const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
      const dayName = dayNames[date.getDay()];
      
      return {
        name: dayName,
        date: date,
        taskCount: taskCounts[dateStr] || 0,
        milestoneCount: milestoneCounts[dateStr] || 0,
        meetingCount: meetingCounts[dateStr] || 0,
        eventCount: eventCounts[dateStr] || 0,
      };
    });
  };

  const chartData = prepareChartData();

  return (
    <div className="bg-component-background shadow-sm p-6 rounded-md border border-component-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-text-primary text-base font-semibold">주간 활동 추이</h2>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--component-border)" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={20}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--component-secondary-background)',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                border: '1px solid var(--component-border)',
                fontSize: '12px',
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0] && payload[0].payload) {
                  const date = payload[0].payload.date as Date;
                  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${label})`;
                }
                return label;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="taskCount" 
              name="태스크" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="milestoneCount" 
              name="마일스톤" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="meetingCount" 
              name="회의" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="eventCount" 
              name="이벤트" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}