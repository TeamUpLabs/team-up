import { format, isSameMonth, isToday } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Task } from '@/types/Task';
import { getStatusColor } from '@/utils/getStatusColor';

interface CalendarProps {
  currentDate: Date;
  tasks?: Task[];
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
    <div className="flex-1 bg-gray-800 rounded-xl shadow-lg border border-gray-700 flex flex-col overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-100">일정 관리</h1>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button 
              onClick={onPreviousMonth} 
              className="p-2 hover:bg-gray-700 active:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="이전 달"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
            </button>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-100 min-w-[140px] text-center">
              {format(currentDate, 'yyyy년 M월')}
            </h2>
            <button 
              onClick={onNextMonth} 
              className="p-2 hover:bg-gray-700 active:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="다음 달"
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-900">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <div 
            key={day} 
            className={`bg-gray-800 py-2 text-center font-medium text-sm sm:text-base ${index === 0 ? 'text-red-300' : index === 6 ? 'text-blue-300' : 'text-gray-300'}`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 gap-px bg-gray-900 overflow-y-auto">
        {days.map((day, index) => {
          const dayTasks = tasks?.filter(task => task?.dueDate === format(day, 'yyyy-MM-dd'));
          const isWeekend = index % 7 === 0 || index % 7 === 6;
          const isSameMonthDay = isSameMonth(day, currentDate);
          const isTodayDay = isToday(day);

          return (
            <div
              key={day.toString()}
              className={`relative min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 transition-colors
                ${!isSameMonthDay
                  ? 'bg-gray-850'
                  : 'bg-gray-800 hover:bg-gray-700'}
                ${isTodayDay ? 'ring-2 ring-blue-500 ring-inset' : ''}
                ${isWeekend && isSameMonthDay ? 'bg-gray-780' : ''}`}
            >
              <p className={`text-xs sm:text-sm font-medium
                ${!isSameMonthDay ? 'text-gray-500' : ''}
                ${isTodayDay ? 'text-blue-300 font-bold' : ''}
                ${index % 7 === 0 && isSameMonthDay ? 'text-red-300' : ''}
                ${index % 7 === 6 && isSameMonthDay ? 'text-blue-300' : ''}
                ${isSameMonthDay && !isWeekend && !isTodayDay ? 'text-gray-200' : ''}`}>
                {format(day, 'd')}
              </p>
              <div className="mt-1 space-y-1 max-h-[60px] sm:max-h-[80px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {dayTasks?.map((task) => (
                  <div
                    key={task?.id}
                    onClick={() => onSelectTask(task)}
                    className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs ${getStatusColor(task?.status ?? '')} hover:opacity-80 hover:shadow-md transition-all cursor-pointer`}
                  >
                    <p className="font-medium truncate">{task?.title}</p>
                    {task?.assignee && task?.assignee.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {task?.assignee.map(assi => (
                          <span key={assi?.id} className="text-[10px] sm:text-xs opacity-75 truncate max-w-full inline-block">{assi?.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {dayTasks && dayTasks.length > 3 && (
                <div className="absolute bottom-0 right-0 text-[10px] sm:text-xs text-gray-400 px-1 bg-gray-800/80 rounded-tl-md">
                  +{dayTasks.length - 3}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
