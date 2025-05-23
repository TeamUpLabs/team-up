export const getStatusColor = (status: string) => {
  switch (status) {
    case 'not-started':
      return 'bg-neutral-500/20 text-neutral-500';
    case 'in-progress':
      return 'bg-blue-500/20 text-blue-500';
    case 'done':
      return 'bg-emerald-500/20 text-emerald-500';
  }
};