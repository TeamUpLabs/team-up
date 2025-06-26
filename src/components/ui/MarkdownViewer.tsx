import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github.css'; // 코드 하이라이트 스타일

export default function MarkdownViewer({ value }: { value: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
      {value}
    </ReactMarkdown>
  );
}