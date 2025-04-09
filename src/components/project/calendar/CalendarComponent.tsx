import { format, isSameMonth, isToday } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Task } from '@/types/Task';
import { getStatusColor } from '@/utils/getStatusColor';

interface CalendarProps {
  currentDate: Date;
  tasks: Task[];
  days: Date[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectTask: (task: Task) => void;
}

export default function Calendar({
  currentDate,
  tasks,
  days,
  onPreviousMonth,
  onNextMonth,
  onSelectTask,
}: CalendarProps) {

  return (
    <div className="flex-1 bg-gray-800 rounded-xl shadow-lg border border-gray-700 flex flex-col">
      <div className="px-6 py-4 border-b border-gray-900">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-100">일정 관리</h1>
          <div className="flex items-center space-x-4">
            <button onClick={onPreviousMonth} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5 text-gray-300" />
            </button>
            <h2 className="text-xl font-semibold text-gray-100">
              {format(currentDate, 'yyyy년 M월')}
            </h2>
            <button onClick={onNextMonth} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-900">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className="bg-gray-800 py-2 text-center font-medium text-gray-300">
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 gap-px bg-gray-900">
        {days.map((day) => {
          const dayTasks = tasks.filter(task => task.dueDate === format(day, 'yyyy-MM-dd'));

          return (
            <div
              key={day.toString()}
              className={`p-2 transition-colors cursor-pointer
                ${!isSameMonth(day, currentDate)
                  ? ' hover:bg-slate-800/90'
                  : 'bg-gray-800 hover:bg-gray-700/90'}
                ${isToday(day) ? 'ring-2 ring-blue-400 ring-inset' : ''}`}
            >
              <p className={`text-sm font-medium
                ${!isSameMonth(day, currentDate) ? 'text-gray-500' : 'text-gray-200'}
                ${isToday(day) ? 'text-blue-300' : ''}`}>
                {format(day, 'd')}
              </p>
              <div className="mt-1 space-y-1">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className={`px-2 py-1 rounded-md text-xs ${getStatusColor(task.status)} hover:opacity-80 cursor-pointer`}
                  >
                    <p className="font-medium truncate">{task.title}</p>
                    <p className="text-xs opacity-75">{task.assignee}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
