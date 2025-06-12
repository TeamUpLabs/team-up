export const getScheduleColor = (schedule: string) => {
  switch (schedule) {
    case 'meeting':
      return 'bg-green-500/20 text-green-500 border border-green-500/50';
    case 'event':
      return 'bg-blue-500/20 text-blue-500 border border-blue-500/50';
    case 'task':
      return 'bg-rose-500/20 text-rose-500 border border-rose-500/50';
  }
};