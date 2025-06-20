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

export const getStatusColorName = (status: string) => {
  switch (status) {
    case 'not-started': return 'yellow';
    case 'in-progress': return 'blue';
    case 'done': return 'emerald';
    default: return 'gray';
  }
};

export const getStatusInfo = (status: string) => {
  switch (status) {
    case "활성":
      return { 
        indicator: "bg-green-500", 
        label: "온라인",
        ringColor: "ring-green-500"
      };
    case "자리비움":
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