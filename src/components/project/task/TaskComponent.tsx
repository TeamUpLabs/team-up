import type { Task } from '@/types/Task';
import Image from 'next/image';
import Tooltip from '@/components/ui/Tooltip';
import Badge from '@/components/ui/Badge';
import { Flag } from 'flowbite-react-icons/outline';
import { getPriorityColorName } from '@/utils/getPriorityColor';
import { useTheme } from '@/contexts/ThemeContext';

export default function TaskComponent({ task }: { task: Task }) {
  const { isDark } = useTheme();

  return (
    <div
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task?.id.toString() ?? '0');
      }}
      className="p-3 mb-2 bg-component-secondary-background rounded-lg hover:bg-component-tertiary-background cursor-move transition-colors border border-component-border"
      draggable
    >
      <div className="flex flex-col gap-1 font-medium mb-2">
        <div className="flex items-center justify-between">
          <span className="text-base text-text-primary">
            {task?.title}
          </span>
          <Badge
            content={
              <div className="flex items-center gap-1">
                <Flag className="w-4 h-4" />
                {task.priority.toUpperCase()}
              </div>
            }
            color={getPriorityColorName(task.priority)}
            isEditable={false}
            className="!rounded-full !px-2 !py-0.5"
            isDark={isDark}
          />
        </div>
        {task?.description && (
          <span className="text-sm text-text-secondary">
            {task?.description}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 text-sm text-text-secondary">
        {task?.assignees && task.assignees.length > 0 && (
          <div className="flex -space-x-2.5">
            {task.assignees.slice(0, 2).map((assi) => (
              <Tooltip content={assi.name} key={assi.id} placement="bottom">
                <div className="w-8 h-8 relative rounded-full bg-component-background border-2 border-component-border text-xs flex items-center justify-center">
                  {assi?.profile_image ? (
                    <Image src={assi.profile_image} alt="Profile" className="object-fit rounded-full" quality={100} width={32} height={32} />
                  ) : (
                    <p>{assi?.name.charAt(0)}</p>
                  )}
                </div>
              </Tooltip>
            ))}
            {task.assignees.length > 2 && (
              <div className="w-8 h-8 rounded-full bg-component-background border-2 border-component-border text-sm flex items-center justify-center">
                +{task.assignees.length - 2}
              </div>
            )}
          </div>
        )}
        {task?.due_date && (
          <span>
            마감일: {task?.due_date.split('T')[0].replace(/-/g, '.')}
          </span>
        )}
      </div>
    </div>
  )
}