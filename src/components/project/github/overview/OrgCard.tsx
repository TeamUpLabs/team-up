import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { Book, Users, Building, MapPinAlt } from "flowbite-react-icons/outline";

interface OrgDataProps {
  isDark: boolean;
  orgData: {
    name: string;
    login: string;
    description: string;
    public_repos: number;
    collaborators: number;
    members: {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      site_admin: boolean;
    }[];
    avatar_url: string;
    html_url: string;
    company: string;
    location: string;
  };
}

export default function OrgCard({ isDark, orgData }: OrgDataProps) {
  return (
    <div className="flex flex-col gap-10 justify-between bg-component-background border border-component-border rounded-lg p-4">
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <span className="text-xl font-bold text-text-primary">Organization Overview</span>
          <span className="text-sm text-text-secondary">연결된 GitHub 조직 정보</span>
        </div>
        <div className="flex items-center justify-between border border-component-border rounded-lg p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {orgData.avatar_url ? (
                <Image
                  src={orgData.avatar_url}
                  alt="Organization Avatar"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-component-secondary-background flex items-center justify-center">
                </div>
              )}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-text-primary">{orgData.name || "이름 없음"}</span>
                  <Link
                    href={`${orgData.html_url}`}
                    target="_blank"
                    className="hover:underline"
                  >
                    <span className="text-sm font-semibold text-text-primary">@{orgData.login || "아이디 없음"}</span>
                  </Link>
                </div>
                <span className="text-sm text-text-secondary">{orgData.description || "설명 없음"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-text-secondary">
              <div className="flex items-center gap-1">
                <Book className="w-4 h-4 text-text-secondary" />
                <span>{orgData.public_repos || 0} 저장소</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-text-secondary" />
                <span>{orgData.members.length || 0} 팀원</span>
              </div>
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4 text-text-secondary" />
                <span>{orgData.company || "회사 없음"}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPinAlt className="w-4 h-4 text-text-secondary" />
                <span>{orgData.location || "위치 없음"}</span>
              </div>
            </div>
          </div>

          <Badge
            content="connected"
            color="black"
            className="!text-xs !px-3 !py-1 !rounded-full !font-semibold"
            isDark={isDark}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`flex flex-col items-center gap-1 ${isDark ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"} rounded-lg p-4`}>
          <span className="text-lg font-semibold">{orgData.public_repos || 0}</span>
          <span className="text-lg font-semibold">Total Repos</span>
        </div>
        <div className={`flex flex-col items-center gap-1 ${isDark ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800"} rounded-lg p-4`}>
          <span className="text-lg font-semibold">{orgData.collaborators || 0}</span>
          <span className="text-lg font-semibold">Team Members</span>
        </div>
      </div>
    </div>
  )
}