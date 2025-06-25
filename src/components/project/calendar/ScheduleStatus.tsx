import { Task } from '@/types/Task';
import { getScheduleColor } from '@/utils/getScheduleColor';
import { Schedule } from '@/types/Schedule';

interface ScheduleStatusProps {
  tasks?: Task[];
  meetings?: Schedule[];
  events?: Schedule[];
}

export default function ScheduleStatus({ tasks, meetings, events }: ScheduleStatusProps) {
  return (
    <div className="mt-4 bg-component-background rounded-lg border border-component-border p-4">
      <h3 className="text-lg font-semibold text-text-primary mb-4">일정 현황</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['meeting', 'event', 'task'].map((schedule) => (
          <div key={schedule} className={`p-4 rounded-lg border ${getScheduleColor(schedule)}`}>
            <h4 className="font-medium capitalize mb-2">
              {schedule === 'meeting' ? '회의' : schedule === 'event' ? '이벤트' : schedule === 'task' ? '작업' : ''}
            </h4>
            <p className="text-2xl font-bold">
              {schedule === 'meeting' ? meetings?.length : schedule === 'event' ? events?.length : schedule === 'task' ? tasks?.length : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}