import type { Task } from '@/types/Task';
import Image from 'next/image';
import Tooltip from '@/components/ui/Tooltip';

export default function TaskComponent({ task }: { task: Task }) {
  return (
    <div
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task?.id.toString() ?? '');
      }}
      className="p-3 mb-2 bg-component-secondary-background rounded-lg hover:bg-component-secondary-background/60 cursor-move transition-colors border border-component-border"
      draggable
    >
      <div className="flex flex-col gap-1 font-medium mb-2">
        <span className="text-base text-text-primary">
          {task?.title}
        </span>
        {task?.description && (
          <span className="text-sm text-text-secondary">
            {task?.description}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 text-sm text-text-secondary">
        {task?.assignee && task.assignee.length > 0 && (
          <div className="flex -space-x-2.5">
            {task.assignee.slice(0, 2).map((assi) => (
              <Tooltip content={assi.name} key={assi.id} placement="bottom">
                <div className="w-8 h-8 relative rounded-full bg-component-background border-2 border-component-border text-xs flex items-center justify-center">
                  {assi?.profileImage ? (
                    <Image src={assi.profileImage} alt="Profile" className="w-full h-full object-fit rounded-full" quality={100} width={32} height={32} />
                  ) : (
                    <p>{assi?.name.charAt(0)}</p>
                  )}
                </div>
              </Tooltip>
            ))}
            {task.assignee.length > 2 && (
              <div className="w-8 h-8 rounded-full bg-component-background border-2 border-component-border text-sm flex items-center justify-center">
                +{task.assignee.length - 2}
              </div>
            )}
          </div>
        )}
        {task?.endDate && (
          <span>
            마감일: {task?.endDate}
          </span>
        )}
      </div>
    </div>
  )
}