import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const getCurrentKoreanTime = () => {
  const timeZone = 'Asia/Seoul';
  const utcDate = new Date();
  const koreanDate = toZonedTime(utcDate, timeZone);
  return format(koreanDate, "yyyy-MM-dd'T'HH:mm:ss");
};

export const getCurrentKoreanTimeDate = () => {
  const timeZone = 'Asia/Seoul';
  const utcDate = new Date();
  const koreanDate = toZonedTime(utcDate, timeZone);
  return format(koreanDate, 'yyyy-MM-dd');
}

export const formatRelativeTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 6); // Corrected to 6 days ago to include 7 full days period

  const notificationDateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const timeString = date.toLocaleTimeString("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (notificationDateOnly.getTime() === today.getTime()) {
    return `오늘 ${timeString}`;
  }
  if (notificationDateOnly.getTime() === yesterday.getTime()) {
    return `어제 ${timeString}`;
  }
  if (notificationDateOnly >= oneWeekAgo) {
    // Greater than or equal to one week ago (within the last 7 days)
    const dayOfWeek = date.toLocaleDateString("ko-KR", { weekday: "short" }); // Using short for brevity
    return `${dayOfWeek} ${timeString}`;
  }
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.toLocaleDateString("ko-KR", {
      month: "numeric",
      day: "numeric",
    })} ${timeString}`;
  }
  return `${date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })} ${timeString}`;
};
