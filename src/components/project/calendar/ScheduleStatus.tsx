import { Task } from '@/types/Task';
import { getStatusColor } from '@/utils/getStatusColor';

interface ScheduleStatusProps {
  tasks?: Task[];
}

export default function ScheduleStatus({ tasks }: ScheduleStatusProps) {
  return (
    <div className="mt-4 bg-component-background rounded-xl shadow-lg border border-gray-700/50 p-4">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">일정 현황</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['not-started', 'in-progress', 'done'].map((status) => (
          <div key={status} className={`p-4 rounded-lg border border-gray-700 ${getStatusColor(status)}`}>
            <h4 className="font-medium capitalize mb-2">
              {status === 'not-started' ? '시작 전' : status === 'in-progress' ? '진행중' : '완료'}
            </h4>
            <p className="text-2xl font-bold">
              {tasks?.filter(task => task.status === status).length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}