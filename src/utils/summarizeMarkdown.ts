import { remark } from 'remark';
import strip from 'strip-markdown';

/**
 * 마크다운 문자열을 한 줄의 일반 텍스트로 요약합니다.
 * @param markdown - 요약할 마크다운 문자열.
 * @returns 마크다운 내용의 한 줄 요약.
 */
export function summarizeMarkdown(markdown: string | null | undefined): string {
  if (!markdown) {
    return '설명이 없습니다.';
  }

  // 마크다운을 일반 텍스트로 변환
  const plainText = remark().use(strip).processSync(markdown).toString();

  // 줄 바꿈 및 추가 공백 제거 후 첫 번째 문장 또는 일정 길이 가져오기.
  const firstLine = plainText.replace(/(\r\n|\n|\r)/gm, ' ').trim().split('. ')[0];

  // 첫 줄이 너무 길면 자르기.
  if (firstLine.length > 100) {
    return `${firstLine.substring(0, 97)}...`;
  }

  if (firstLine) {
    return firstLine.endsWith('.') ? firstLine : `${firstLine}.`;
  }

  return '설명이 없습니다.';
}
