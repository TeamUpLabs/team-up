import { PrData } from "@/types/PrData";
import { CodePullRequest, CodeMerge, CodeBranch, Clock, User, Messages } from "flowbite-react-icons/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeCommit } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { useTheme } from "@/contexts/ThemeContext";
import { summarizeMarkdown } from "@/utils/summarizeMarkdown";
import { hexToRgba, isColorDark } from "@/utils/hexToRgba";

export default function PRCard({ prData }: { prData: PrData }) {
  const { isDark } = useTheme();

  return (
    <div
      className="flex flex-row items-start justify-between gap-4 bg-component-background border border-component-border rounded-lg p-4"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2">
          {prData.state === "open" ? (
            <CodePullRequest className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <CodeMerge className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          )}
          <Link href={prData.html_url} target="_blank" className="hover:underline">
            <p className="text-sm font-semibold text-text-primary break-all">
              {prData.title || "제목 없음"}
            </p>
          </Link>
          <Badge
            content={`#${prData.number || 0}`}
            color="pink"
            className="!text-xs !px-2 !py-0.5 !rounded-full"
            isDark={isDark}
          />
        </div>

        <p className="text-sm text-text-secondary">
          {summarizeMarkdown(prData.body)}
        </p>

        <div className="flex items-center gap-x-3 gap-y-1 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <CodeBranch className="w-3 h-3" />
            <span>{prData.html_url.split('/')[prData.html_url.split('/').length - 3] || "저장소 없음"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <User className="w-3 h-3" />
            <span>{prData.user.login || "사용자 없음"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <Clock className="w-3 h-3" />
            <span>{prData.created_at.split('T')[0] || "날짜 없음"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <FontAwesomeIcon icon={faCodeCommit} size="xs" />
            <span>{prData.commits.length || 0} 커밋</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <Messages className="w-3 h-3" />
            <span>{prData.comments.length || 0} 댓글</span>
          </div>
        </div>
        <div className="flex items-center gap-x-3 gap-y-1 flex-wrap">
          <span className="text-xs text-green-600">+{Array.isArray(prData.files) ? prData.files.reduce((total, file) => total + file.additions, 0) : 0}</span>
          <span className="text-xs text-red-600">-{Array.isArray(prData.files) ? prData.files.reduce((total, file) => total + file.deletions, 0) : 0}</span>
          <span className="text-xs text-text-secondary">{Array.isArray(prData.files) ? prData.files.length : 0} 파일 변경</span>
          <span className="text-xs text-text-secondary">{prData.head.ref}</span>
          <span className="text-xs text-text-secondary">→</span>
          <span className="text-xs text-text-secondary">{prData.base.ref}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {prData.labels.map((label, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded-full text-xs border font-semibold"
              style={{
                backgroundColor: isDark
                  ? hexToRgba(`#${label.color}`, 0.2)
                  : hexToRgba(`#${label.color}`, 0.4),
                borderColor: hexToRgba(`#${label.color}`, 1),
                color: isDark ? `#${label.color}` : (isColorDark(`#${label.color}`) ? "#fff" : "#000"),
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}