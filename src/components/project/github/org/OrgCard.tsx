import { OrgData } from "@/types/OrgData";
import Image from "next/image";
import Link from "next/link";
import { Book, Users, CalendarWeek } from "flowbite-react-icons/outline";
import Badge from "@/components/ui/Badge";

interface OrgCardProps {
  orgData: OrgData;
}

export default function OrgCard({ orgData }: OrgCardProps) {
  return (
    <div
      className="flex items-start justify-between bg-component-background border border-component-border rounded-lg p-4"
    >
      <div className="flex items-center gap-2">
        {orgData.avatar_url ? (
          <Image
            src={orgData.avatar_url}
            alt={orgData.name}
            width={50}
            height={50}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-component-border"></div>
        )}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-text-primary">{orgData.name || "이름 없음"}</span>
            <Link
              href={`${orgData.html_url}`}
              target="_blank"
              className="hover:underline"
            >
              <span className="text-sm font-semibold text-text-primary">@{orgData.login || "아이디 없음"}</span>
            </Link>
          </div>
          <p className="text-sm text-text-secondary">{orgData.description || "설명 없음"}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Book className="w-4 h-4 text-text-secondary" />
              <span className="text-xs text-text-secondary">{orgData.public_repos || 0} 저장소</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-text-secondary" />
              <span className="text-xs text-text-secondary">{orgData.members.length || 0} 팀원</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarWeek className="w-4 h-4 text-text-secondary" />
              <span className="text-xs text-text-secondary">{orgData.created_at.split("T")[0] + " 생성" || "생성일 없음"}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        className="flex flex-wrap self-center cursor-pointer active:scale-95"
      >
        <Badge
          content={
            <div className="flex items-center gap-2">
              <Users />
              <span className="font-semibold">연결</span>
            </div>
          }
          color="black"
        />
      </button>
    </div>
  );
}