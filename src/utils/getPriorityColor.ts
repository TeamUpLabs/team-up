export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500/20 text-red-500';
    case 'medium': return 'bg-violet-500/20 text-violet-500';
    case 'low': return 'bg-cyan-500/20 text-cyan-500';
    default: return 'bg-gray-500/20 text-gray-500';
  }
};