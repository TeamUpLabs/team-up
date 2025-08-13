/**
 * 파일 사이즈를 바이트 단위로 변환하는 함수들
 */

/**
 * 바이트를 사람이 읽기 쉬운 형태로 변환
 * @param bytes - 바이트 단위의 파일 크기
 * @param decimals - 소수점 자릿수 (기본값: 2)
 * @returns 포맷된 파일 크기 문자열 (예: "1.5 MB", "2.3 GB")
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * 파일 크기를 특정 단위로 변환
 * @param bytes - 바이트 단위의 파일 크기
 * @param unit - 변환할 단위 ('B', 'KB', 'MB', 'GB', 'TB')
 * @param decimals - 소수점 자릿수 (기본값: 2)
 * @returns 변환된 파일 크기
 */
export function convertFileSize(bytes: number, unit: 'B' | 'KB' | 'MB' | 'GB' | 'TB', decimals: number = 2): number {
  const units = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024
  };

  const divisor = units[unit];
  return parseFloat((bytes / divisor).toFixed(decimals));
}

/**
 * 파일 크기가 특정 제한을 초과하는지 확인
 * @param bytes - 바이트 단위의 파일 크기
 * @param maxSize - 최대 허용 크기 (바이트)
 * @returns 제한 초과 여부
 */
export function isFileSizeExceeded(bytes: number, maxSize: number): boolean {
  return bytes > maxSize;
}

/**
 * 파일 크기 제한을 사람이 읽기 쉬운 형태로 표시
 * @param maxSize - 최대 허용 크기 (바이트)
 * @param decimals - 소수점 자릿수 (기본값: 2)
 * @returns 포맷된 최대 파일 크기
 */
export function getMaxFileSizeText(maxSize: number, decimals: number = 2): string {
  return `최대 ${formatFileSize(maxSize, decimals)}`;
}

/**
 * 파일 크기를 간단한 형태로 표시 (긴 단위명 제거)
 * @param bytes - 바이트 단위의 파일 크기
 * @param decimals - 소수점 자릿수 (기본값: 1)
 * @returns 간단한 형태의 파일 크기 (예: "1.5M", "2.3G")
 */
export function formatFileSizeShort(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
}

/**
 * 파일 크기를 퍼센트로 표시 (최대 크기 대비)
 * @param currentSize - 현재 파일 크기 (바이트)
 * @param maxSize - 최대 허용 크기 (바이트)
 * @param decimals - 소수점 자릿수 (기본값: 1)
 * @returns 퍼센트 문자열
 */
export function getFileSizePercentage(currentSize: number, maxSize: number, decimals: number = 1): string {
  if (maxSize === 0) return '0%';
  
  const percentage = (currentSize / maxSize) * 100;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * 파일 크기 제한에 대한 경고 레벨 확인
 * @param currentSize - 현재 파일 크기 (바이트)
 * @param maxSize - 최대 허용 크기 (바이트)
 * @returns 경고 레벨 ('safe' | 'warning' | 'danger')
 */
export function getFileSizeWarningLevel(currentSize: number, maxSize: number): 'safe' | 'warning' | 'danger' {
  const percentage = (currentSize / maxSize) * 100;
  
  if (percentage >= 90) return 'danger';
  if (percentage >= 75) return 'warning';
  return 'safe';
}
