export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays === 0) {
    if (diffInHours > 0) {
      return `${diffInHours}시간 전`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes}분 전`;
    } else {
      return '방금 전';
    }
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else {
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
  }
};