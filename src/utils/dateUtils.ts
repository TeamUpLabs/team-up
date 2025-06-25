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

 // Helper to format Date to YYYY-MM-DD string
export const formatDateToString = (date: Date | undefined): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper to parse YYYY-MM-DD string to Date object (local timezone)
export const parseStringToDate = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  const parts = dateString.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed for Date constructor
    const day = parseInt(parts[2], 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return new Date(year, month, day); // Interprets as local date
    }
  }
  return undefined;
};
