import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

interface RepoData {
  full_name?: string;
  html_url?: string;
}

export default function RepoCard({ repoData }: { repoData: RepoData }) {
  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">연결된 저장소</span>
        <span className="fa-layers">
          <FontAwesomeIcon icon={faGithub} className="text-text-primary" />
        </span>
      </div>
      <div>
        <Link href={repoData.html_url || ""} target="_blank" className="hover:underline">
          <span className="text-text-primary text-lg font-bold">
            {repoData.full_name || "저장소 없음"}
          </span>
        </Link>
        <p className="text-xs text-text-secondary">활성 저장소</p>
      </div>
    </div>
  );
}