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
