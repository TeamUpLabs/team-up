import type { Task } from '@/types/Task';

export default function TaskComponent({ task }: { task: Task }) {
  return (
    <div
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task?.id ?? '');
      }}
      className="p-3 mb-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 cursor-move transition-colors"
      draggable
    >
      <div className="text-sm font-medium text-gray-100 mb-2">
        {task?.title}
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        {task?.assignee && (
          task?.assignee.map((assi, idx) => (
            <span key={assi?.id ?? idx} className="flex items-center">
              <span className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center mr-1 text-[10px]">
                {assi?.name.charAt(0)}
              </span>
              {assi?.name}
            </span>
          ))
        )}
        {task?.dueDate && (
          <span>
            마감일: {task?.dueDate}
          </span>
        )}
      </div>
    </div>
  )
}