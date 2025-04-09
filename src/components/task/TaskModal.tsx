import { Task } from '@/types/Task';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  if (!isOpen || !task) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-yellow-500/20 text-yellow-500';
      case 'in-progress': return 'bg-blue-500/20 text-blue-500';
      case 'done': return 'bg-green-500/20 text-green-500';
      default: return '';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-800 rounded-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-gray-100">Task Details</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-sm text-gray-400">Title</h4>
            <p className="text-gray-100 font-medium">{task.title}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-400">Status</h4>
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
              {task.status === 'todo' ? '예정' : task.status === 'in-progress' ? '진행중' : '완료'}
            </span>
          </div>
          <div>
            <h4 className="text-sm text-gray-400">Assignee</h4>
            <p className="text-gray-100">{task.assignee}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-400">Due Date</h4>
            <p className="text-gray-100">{task.dueDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
