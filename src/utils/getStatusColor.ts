export const getStatusColor = (status: string) => {
  switch (status) {
    case 'not-started':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'in-progress':
      return 'bg-blue-500/20 text-blue-500';
    case 'done':
      return 'bg-green-500/20 text-green-500';
  }
};