import { Task } from '@/types/Task';
import { getScheduleColor } from '@/utils/getScheduleColor';
import { Schedule } from '@/types/Schedule';
import { MileStone } from '@/types/MileStone';

interface ScheduleStatusProps {
  tasks?: Task[];
  meetings?: Schedule[];
  events?: Schedule[];
  milestones?: MileStone[];
}

export default function ScheduleStatus({ tasks, meetings, events, milestones }: ScheduleStatusProps) {
  return (
    <div className="mt-4 bg-component-background rounded-lg border border-component-border p-4">
      <h3 className="text-lg font-semibold text-text-primary mb-4">일정 현황</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['meeting', 'event', 'task', 'milestone'].map((schedule) => (
          <div key={schedule} className={`p-4 rounded-lg border ${getScheduleColor(schedule)}`}>
            <h4 className="font-medium capitalize mb-2">
              {schedule === 'meeting' ? '회의' : schedule === 'event' ? '이벤트' : schedule === 'task' ? '작업' : schedule === 'milestone' ? '마일스톤' : ''}
            </h4>
            <p className="text-2xl font-bold">
              {schedule === 'meeting' ? meetings?.length : schedule === 'event' ? events?.length : schedule === 'task' ? tasks?.length : schedule === 'milestone' ? milestones?.length : 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}