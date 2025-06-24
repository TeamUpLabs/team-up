import { IssueData } from "@/types/IssueData";
import Badge from "@/components/ui/Badge";
import { hexToRgba, isColorDark } from "@/utils/hexToRgba";
import { summarizeMarkdown } from "@/utils/summarizeMarkdown";
import {
  ExclamationCircle,
  CheckCircle,
  CodeBranch,
  Clock,
  User,
  Messages,
  Clipboard
} from "flowbite-react-icons/outline";
import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";

export default function IssueCard({ issueData }: { issueData: IssueData }) {
  const { isDark } = useTheme();

  return (
    <div
      className="flex items-start justify-between bg-component-background border border-component-border rounded-lg p-4"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {issueData.state === "open" ? (
            <ExclamationCircle className="w-5 h-5 text-red-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-purple-500" />
          )}
          <Link href={issueData.html_url} target="_blank" className="hover:underline">
            <p className="text-sm font-semibold text-text-primary">
              {issueData.title || "제목 없음"}
            </p>
          </Link>
          <Badge
            content={`#${issueData.number || 0}`}
            color="pink"
            className="!text-xs !px-2 !py-0.5 !rounded-full"
            isDark={isDark}
          />
        </div>
        <p className="text-sm text-text-secondary">
          {summarizeMarkdown(issueData.body)}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <CodeBranch className="w-3 h-3" />
            <span>{issueData.repository_url.split('/').pop() || "저장소 없음"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <Clock className="w-3 h-3" />
            <span>{issueData.created_at.split('T')[0] || "날짜 없음"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <User className="w-3 h-3" />
            <span>{issueData.user.login || "사용자 없음"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <Messages className="w-3 h-3" />
            <span>{issueData.comments || 0}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {issueData.labels.map((label, index) => (
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
      <button
        onClick={() => {

        }}
        className="flex flex-shrink-0 items-center gap-2 font-semibold border border-component-border p-2 text-xs md:text-sm rounded-md hover:bg-component-secondary-background cursor-pointer"
      >
        <Clipboard className="w-5 h-5" />
        Task 변환
      </button>
    </div>
  );
}