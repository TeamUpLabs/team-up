import { unified } from 'unified';
import remarkParse from 'remark-parse';

export function isMarkdown(text: string): boolean {
  const tree = unified().use(remarkParse).parse(text);
  // 마크다운 노드가 최소한 1개 이상 있는 경우
  return tree.children.length > 0;
}