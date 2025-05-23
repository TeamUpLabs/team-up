import { format, parseISO, isSameDay, isSameMonth, isSameYear, getHours, getMinutes, getSeconds, isEqual, addDays, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatDateTimeRange(startTimeStr: string, endTimeStr: string): string {
  const startDate = parseISO(startTimeStr);
  const endDate = parseISO(endTimeStr);

  const formatTime = (date: Date) => format(date, 'HH:mm', { locale: ko });
  const formatDateDay = (date: Date) => format(date, 'd일 (E)', { locale: ko });
  const formatDateMonthDay = (date: Date) => format(date, 'M월 d일 (E)', { locale: ko });
  const formatDateYearMonthDay = (date: Date) => format(date, 'yyyy년 M월 d일 (E)', { locale: ko });

  // Heuristic for all-day events:
  // Assumes all-day events start at 00:00:00 and end at 00:00:00 on the next day, or 23:59:xx on the event's end day.
  const isStartTimeMidnight = getHours(startDate) === 0 && getMinutes(startDate) === 0 && getSeconds(startDate) === 0;
  const isEndTimeMidnight = getHours(endDate) === 0 && getMinutes(endDate) === 0 && getSeconds(endDate) === 0;
  const isEndTimeEffectivelyEndOfDay = getHours(endDate) === 23 && getMinutes(endDate) === 59; // Ignoring seconds for simplicity

  let isAllDayEvent = false;
  let displayEndDateForAllDay = new Date(endDate);

  if (isStartTimeMidnight) {
    // Single day all-day event (e.g., 15th 00:00 to 16th 00:00, or 15th 00:00 to 15th 23:59)
    if (isEndTimeMidnight && isEqual(endDate, addDays(startDate, 1)) && isSameDay(startDate, subDays(endDate, 1))) {
      isAllDayEvent = true;
      displayEndDateForAllDay = new Date(startDate); // Event is for the startDate
    } else if (isEndTimeEffectivelyEndOfDay && isSameDay(startDate, endDate)) {
      isAllDayEvent = true;
      displayEndDateForAllDay = new Date(startDate); // Event is for the startDate
    } else if (isEndTimeMidnight && !isSameDay(startDate, endDate)) { // Multi-day all-day event ending at midnight
      isAllDayEvent = true;
      displayEndDateForAllDay = subDays(endDate, 1); // The actual last day of the event
    } else if (isEndTimeEffectivelyEndOfDay && !isSameDay(startDate, endDate)) { // Multi-day all-day event ending at 23:59
      isAllDayEvent = true;
      displayEndDateForAllDay = new Date(endDate);
    }
  }
  
  // If, after potential adjustment for end date (e.g. 16th 00:00 becomes 15th for display), it's a single day
  if (isAllDayEvent && isSameDay(startDate, displayEndDateForAllDay)) {
     return `${formatDateYearMonthDay(startDate)} (하루 종일)`;
  }
  
  if (isAllDayEvent) { // Multi-day all-day event
    const startStr = formatDateYearMonthDay(startDate);
    let endStr;
    if (isSameYear(startDate, displayEndDateForAllDay)) {
      if (isSameMonth(startDate, displayEndDateForAllDay)) {
        endStr = formatDateDay(displayEndDateForAllDay);
      } else {
        endStr = formatDateMonthDay(displayEndDateForAllDay);
      }
    } else {
      endStr = formatDateYearMonthDay(displayEndDateForAllDay);
    }
    return `${startStr} ~ ${endStr} (하루 종일)`;
  }

  // Not an all-day event, format with specific times
  if (isSameDay(startDate, endDate)) {
    if (formatTime(startDate) === formatTime(endDate)) {
        return `${formatDateYearMonthDay(startDate)} ${formatTime(startDate)}`;
    }
    return `${formatDateYearMonthDay(startDate)} ${formatTime(startDate)} ~ ${formatTime(endDate)}`;
  } else {
    // Different days, with times
    const startDateFormatted = `${formatDateYearMonthDay(startDate)} ${formatTime(startDate)}`;
    let endDateFormatted;

    if (isSameYear(startDate, endDate)) {
      if (isSameMonth(startDate, endDate)) {
        endDateFormatted = `${formatDateDay(endDate)} ${formatTime(endDate)}`;
      } else {
        endDateFormatted = `${formatDateMonthDay(endDate)} ${formatTime(endDate)}`;
      }
    } else {
      endDateFormatted = `${formatDateYearMonthDay(endDate)} ${formatTime(endDate)}`;
    }
    return `${startDateFormatted} ~ ${endDateFormatted}`;
  }
}
