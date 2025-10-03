export const convertJobName = (job: string) => {
  switch (job) {
    case 'developer': return '개발자';
    case 'designer': return '디자이너';
    case 'planner': return '기획자';
    default: return '알 수 없음';
  }
};