export const getStatusColor = (status: string) => {
  switch (status) {
    case 'not_started':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'in_progress':
      return 'bg-blue-500/20 text-blue-500';
    case 'completed':
      return 'bg-emerald-500/20 text-emerald-500';
  }
};

export const getStatusColorName = (status: string) => {
  switch (status) {
    case 'not_started': return 'yellow';
    case 'in_progress': return 'blue';
    case 'completed': return 'emerald';
    default: return 'gray';
  }
};

export const getStatusColorBg = (status: string) => {
  switch (status) {
    case 'not_started': return 'bg-yellow-500';
    case 'in_progress': return 'bg-blue-500';
    case 'completed': return 'bg-emerald-500';
    default: return 'bg-gray-500';
  }
};

export const getStatusInfo = (status: string) => {
  switch (status) {
    case "active":
      return { 
        indicator: "bg-green-500", 
        label: "온라인",
        ringColor: "ring-green-500"
      };
    case "away":
      return { 
        indicator: "bg-yellow-400", 
        label: "자리비움",
        ringColor: "ring-yellow-400"
      };
    default:
      return { 
        indicator: "bg-gray-400", 
        label: "오프라인",
        ringColor: "ring-gray-400"
      };
  }
};