export const getScheduleColor = (schedule: string) => {
  switch (schedule) {
    case 'meeting':
      return 'bg-green-500/20 text-green-500';
    case 'event':
      return 'bg-blue-500/20 text-blue-500';
    case 'task':
      return 'bg-rose-500/20 text-rose-500';
  }
};