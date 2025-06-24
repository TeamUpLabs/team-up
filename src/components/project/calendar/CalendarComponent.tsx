import { format, isSameMonth, isToday } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Task } from '@/types/Task';
import { Schedule } from '@/types/Schedule';
import { getScheduleColor } from '@/utils/getScheduleColor';
import Tooltip from '@/components/ui/Tooltip';

interface CalendarProps {
  currentDate: Date;
  tasks?: Task[];
  meetings?: Schedule[];
  events?: Schedule[];
  days: Date[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectTask: (task: Task) => void;
  onSelectSchedule: (schedule: Schedule) => void;
}

export default function Calendar({
  currentDate,
  tasks,
  meetings,
  events,
  days,
  onPreviousMonth,
  onNextMonth,
  onSelectTask,
  onSelectSchedule,
}: CalendarProps) {

  return (
    <div className="flex-1 bg-component-background rounded-lg border border-component-border flex flex-col overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-component-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">일정 관리</h1>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={onPreviousMonth}
              className="p-2 hover:bg-component-secondary-background active:bg-component-secondary-background rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="이전 달"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary" />
            </button>
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary min-w-[140px] text-center">
              {format(currentDate, 'yyyy년 M월')}
            </h2>
            <button
              onClick={onNextMonth}
              className="p-2 hover:bg-component-secondary-background active:bg-component-secondary-background rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="다음 달"
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-component-border">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <div
            key={day}
            className={`py-2 text-center font-medium text-sm sm:text-base border-r last:border-r-0 border-component-border ${index === 0 ? 'text-red-300' : index === 6 ? 'text-blue-300' : 'text-text-secondary'}`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 overflow-y-auto">
        {days.map((day, index) => {
          const dayTasks = tasks?.filter(task => task?.endDate === format(day, 'yyyy-MM-dd'));
          const dayMeetings = meetings?.filter(meeting => meeting?.start_time.split('T')[0] === format(day, 'yyyy-MM-dd'));
          const dayEvents = events?.filter(event => event?.start_time.split('T')[0] === format(day, 'yyyy-MM-dd'));
          const isWeekend = index % 7 === 0 || index % 7 === 6;
          const isSameMonthDay = isSameMonth(day, currentDate);
          const isTodayDay = isToday(day);
          const isLastInRow = (index + 1) % 7 === 0;
          const isLastRow = index >= days.length - 7;

          return (
            <div
              key={day.toString()}
              className={`relative min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 transition-colors
                border-r border-b ${isLastInRow ? 'border-r-0' : ''} ${isLastRow ? 'border-b-0' : ''} border-component-border
                ${!isSameMonthDay
                  ? 'bg-component-secondary-background'
                  : 'bg-component-background hover:bg-component-background/80'}
                ${isTodayDay ? 'ring-2 ring-blue-500 ring-inset rounded-lg' : ''}
                ${isWeekend && isSameMonthDay ? 'bg-component-background' : ''}`}
            >
              <p className={`text-xs sm:text-sm font-medium
                ${!isSameMonthDay ? 'text-text-secondary' : ''}
                ${isTodayDay ? 'text-point-color-purple font-bold' : ''}
                ${index % 7 === 0 && isSameMonthDay ? 'text-red-300' : ''}
                ${index % 7 === 6 && isSameMonthDay ? 'text-blue-300' : ''}
                ${isSameMonthDay && !isWeekend && !isTodayDay ? 'text-text-secondary' : ''}`}>
                {format(day, 'd')}
              </p>
              <div className="mt-1 space-y-1 max-h-[60px] sm:max-h-[80px] overflow-y-auto">
                {dayTasks?.map((task) => (
                  <Tooltip content="작업" key={task?.id}>
                    <div
                      onClick={() => onSelectTask(task)}
                      className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs ${getScheduleColor("task")} hover:opacity-60 transition-all cursor-pointer`}
                    >
                      <p className="font-medium truncate">{task?.title}</p>
                      {task?.assignee && task?.assignee.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {task?.assignee.slice(0, 2).map(assi => (
                            <span key={assi?.id} className="text-[10px] sm:text-xs opacity-75 truncate max-w-full inline-block">{assi?.name}</span>
                          ))}
                          {task?.assignee.length > 2 && (
                            <span className="text-[10px] sm:text-xs opacity-75 truncate">+{task?.assignee.length - 2}명</span>
                          )}
                        </div>
                      )}
                    </div>
                  </Tooltip>
                ))}

                {dayMeetings?.map(meeting => (
                  <Tooltip content="회의" key={meeting?.id}>
                    <div
                      onClick={() => onSelectSchedule(meeting)}
                      className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs ${getScheduleColor("meeting")} hover:opacity-60 transition-all cursor-pointer`}
                    >
                      <p className="font-medium truncate">{meeting?.title}</p>
                      {meeting?.assignee && meeting?.assignee.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {meeting?.assignee.slice(0, 2).map(assi => (
                          <span key={assi?.id} className="text-[10px] sm:text-xs opacity-75 truncate max-w-full inline-block">{assi?.name}</span>
                        ))}
                        {meeting?.assignee.length > 2 && (
                          <span className="text-[10px] sm:text-xs opacity-75 truncate">+{meeting?.assignee.length - 2}명</span>
                        )}
                      </div>
                    )}
                  </div>
                </Tooltip>
                ))}

                {dayEvents?.map(event => (
                  <Tooltip content="이벤트" key={event?.id}>
                    <div
                      onClick={() => onSelectSchedule(event)}
                      className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs ${getScheduleColor("event")} hover:opacity-60 transition-all cursor-pointer`}
                  >
                    <p className="font-medium truncate">{event?.title}</p>
                    {event?.assignee && event?.assignee.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {event?.assignee.slice(0, 2).map(assi => (
                          <span key={assi?.id} className="text-[10px] sm:text-xs opacity-75 truncate max-w-full inline-block">{assi?.name}</span>
                        ))}
                        {event?.assignee.length > 2 && (
                          <span className="text-[10px] sm:text-xs opacity-75 truncate">+{event?.assignee.length - 2}명</span>
                        )}
                      </div>
                    )}
                  </div>
                </Tooltip>
                ))}
              </div>
              {dayTasks && dayTasks.length > 3 && (
                <div className="absolute bottom-0 right-0 text-[10px] sm:text-xs text-text-secondary px-1 bg-component-background/80 rounded-tl-md">
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
