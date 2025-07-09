import { CommitData } from "@/types/github/CommitData";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeCommit } from "@fortawesome/free-solid-svg-icons";
import Badge from "@/components/ui/Badge";
import {
  User,
  Clock,
  CodeBranch,
  Plus,
  Minus,
  FileLines,
  FileCopy,
  Pen,
  ArrowsRepeat,
  Undo,
} from "flowbite-react-icons/outline";

const changedFileIcon = {
  added: <Plus className="w-3 h-3 text-green-600" />,
  removed: <Minus className="w-3 h-3 text-red-600" />,
  modified: <FileLines className="w-3 h-3 text-blue-600" />,
  copied: <FileCopy className="w-3 h-3 text-green-600" />,
  renamed: <Pen className="w-3 h-3 text-blue-600" />,
  changed: <ArrowsRepeat className="w-3 h-3 text-blue-600" />,
  unchanged: <Undo className="w-3 h-3 text-gray-600" />,
}

export default function CommitCard({ commitData }: { commitData: CommitData }) {
  const { isDark } = useTheme();

  const files = commitData.commitDetail.files;
  const MAX_INITIAL_FILES = 3;
  const MAX_FINAL_FILES = 2;
  const TOTAL_MAX_FILES = MAX_INITIAL_FILES + MAX_FINAL_FILES;

  const showTruncation = files.length > TOTAL_MAX_FILES;
  const initialFiles = showTruncation ? files.slice(0, MAX_INITIAL_FILES) : files;
  const finalFiles = showTruncation ? files.slice(files.length - MAX_FINAL_FILES) : [];

  return (
    <div
      className="flex items-start justify-between bg-component-background border border-component-border rounded-lg p-4"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCodeCommit} size="xs" className="text-blue-600" />
          <Link href={commitData.html_url} target="_blank" className="hover:underline">
            <p className="text-sm font-semibold text-text-primary">{commitData.commit.message.split("\n")[0] || "커밋 메시지 없음"}</p>
          </Link>
          <Badge
            content={`#${commitData.sha.slice(0, 7) || "커밋 없음"}`}
            color="pink"
            className="!text-xs !px-2 !py-0.5 !rounded-full"
            isDark={isDark}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <User className="w-3 h-3" />
            <span>{commitData.author.login || "사용자 없음"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <CodeBranch className="w-3 h-3" />
            <span>{commitData.html_url.split("/")[commitData.html_url.split("/").length - 3] || "저장소 없음"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <Clock className="w-3 h-3" />
            <span>{commitData.commit.author.date.split("T")[0] || "날짜 없음"}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-green-600">+{commitData.commitDetail.stats.additions || 0}</span>
          <span className="text-xs text-red-600">-{commitData.commitDetail.stats.deletions || 0}</span>
          <span className="text-xs text-text-secondary">{commitData.commitDetail.files.length || 0} 파일 변경</span>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-text-primary">변경된 파일</p>
          <ul className="text-xs space-y-1">
            {initialFiles.map((file) => (
              <li key={file.filename} className="flex items-center gap-1">
                {changedFileIcon[file.status as keyof typeof changedFileIcon]}
                <span>{file.filename}</span>
                <span className="text-xs text-green-600">+{file.additions || 0}</span>
                <span className="text-xs text-red-600">-{file.deletions || 0}</span>
              </li>
            ))}
            {showTruncation && (
              <li className="text-xs text-text-secondary">...</li>
            )}
            {finalFiles.map((file) => (
              <li key={file.filename} className="flex items-center gap-1">
                {changedFileIcon[file.status as keyof typeof changedFileIcon]}
                <span>{file.filename}</span>
                <span className="text-xs text-green-600">+{file.additions || 0}</span>
                <span className="text-xs text-red-600">-{file.deletions || 0}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}