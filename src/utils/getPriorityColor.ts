export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500/20 text-red-500';
    case 'medium': return 'bg-yellow-500/20 text-yellow-500';
    case 'low': return 'bg-green-500/20 text-green-500';
    default: return 'bg-gray-500/20 text-gray-500';
  }
};