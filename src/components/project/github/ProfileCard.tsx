import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { Book, Users, Building, MapPinAlt } from "flowbite-react-icons/outline";
import { useTheme } from "@/contexts/ThemeContext";

interface ProfileData {
  name: string;
  login: string;
  email: string;
  html_url: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  company: string;
  location: string;
}

export default function ProfileCard({ githubUser }: { githubUser: ProfileData }) {
  const { isDark } = useTheme();

  return (
    <div className="w-full bg-component-background border border-component-border rounded-lg p-6 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-component-secondary-background rounded-full">
            {githubUser?.avatar_url ? (
              <Image
                src={githubUser.avatar_url}
                alt={githubUser.login || "User avatar"}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-component-secondary-background flex items-center justify-center">
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-text-primary text-lg font-semibold">{githubUser?.name || "이름 없음"}</span>
              <Link href={githubUser?.html_url || ""} target="_blank" className="hover:underline">
                <span className="text-text-primary text-sm font-bold">@{githubUser?.login || "아이디 없음"}</span>
              </Link>
              <Badge
                content="웹훅 활성화"
                color={isDark ? "white" : "black"}
                className="!text-xs !px-3 !py-1 !rounded-full !font-semibold"
              />
            </div>
            <p className="text-text-secondary text-sm">{githubUser?.email || "이메일 없음"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-text-secondary">
          <div className="flex items-center gap-1">
            <Book className="w-4 h-4 text-text-secondary" />
            <span>{githubUser?.public_repos || 0} 저장소</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-text-secondary" />
            <span>{githubUser?.followers || 0} 팔로워</span>
            <span className="w-1 h-1 bg-text-secondary rounded-full"></span>
            <span>{githubUser?.following || 0} 팔로잉</span>
          </div>
          <div className="flex items-center gap-1">
            <Building className="w-4 h-4 text-text-secondary" />
            <span>{githubUser?.company || "회사 없음"}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPinAlt className="w-4 h-4 text-text-secondary" />
            <span>{githubUser?.location || "위치 없음"}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => window.open(githubUser?.html_url || "", '_blank')}
          className="flex items-center gap-2 border border-component-border rounded-lg px-3 py-2 cursor-pointer bg-transparent hover:bg-component-secondary-background"
        >
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="sm" />
          <span className="text-text-primary text-sm font-semibold">Github 프로필</span>
        </button>
      </div>
    </div>
  );
}