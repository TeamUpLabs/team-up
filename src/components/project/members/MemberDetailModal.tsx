import { Member } from "@/types/Member";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/auth/authStore";
import ModalTemplete from "@/components/ModalTemplete";
import Badge, { BadgeColor } from "@/components/ui/Badge";
import { kickOutMemberFromProject } from "@/hooks/getProjectData";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faShieldAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { InfoCircle, Clock, ClipboardClean, ShieldCheck, Language, Link as LinkIcon, UserRemove, Globe } from "flowbite-react-icons/outline";
import { Github, Linkedin, Twitter, Facebook, Instagram } from "flowbite-react-icons/solid";
import { useProject } from "@/contexts/ProjectContext";
import { formatRelativeTime } from "@/utils/dateUtils";
import Accordion from "@/components/ui/Accordion";
import { getStatusInfo } from "@/utils/getStatusColor";
import { useTheme } from "@/contexts/ThemeContext";

interface MemberDetailModalProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
  isLeader?: boolean;
  isManager?: boolean;
}

export default function MemberDetailModal({
  member,
  isOpen,
  onClose,
  isLeader,
  isManager,
}: MemberDetailModalProps) {
  const user = useAuthStore.getState().user;
  const { project } = useProject();
  const router = useRouter();
  const params = useParams();
  const { isDark } = useTheme();

  const handleTaskClick = (taskId: number) => {
    localStorage.setItem("selectedTaskId", taskId.toString());
    const projectId = params?.projectId ? String(params.projectId) : "default";
    router.push(`/platform/${projectId}/tasks`);
    onClose();
  };

  const handleKickOutMember = () => {
    useAuthStore.getState().setConfirm("팀원을 퇴출하시겠습니까?", async () => {
      try {
        await kickOutMemberFromProject(params?.projectId as string, member.id);
        useAuthStore.getState().setAlert("팀원이 퇴출되었습니다.", "success");
        useAuthStore.getState().clearConfirm();
        onClose();
      } catch (error) {
        console.error("Error kicking out member from project:", error);
        useAuthStore.getState().setAlert("팀원 퇴출에 실패했습니다.", "error");
      }
    });
  };

  const getRoleInfo = () => {
    if (isLeader) {
      return {
        icon: <FontAwesomeIcon icon={faStar} className="text-yellow-500" />,
        text: "리더",
        className: "yellow",
      };
    }
    if (isManager) {
      return {
        icon: <FontAwesomeIcon icon={faShieldAlt} className="text-blue-500" />,
        text: "관리자",
        className: "blue",
      };
    }
    return {
      icon: <FontAwesomeIcon icon={faUser} className="text-gray-500" />,
      text: "멤버",
      className: "gray",
    };
  };

  const statusInfo = getStatusInfo(member.status);
  const roleInfo = getRoleInfo();

  const headerContent = (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <div
          className={`w-16 h-16 relative rounded-full bg-component-secondary-background 
                        flex items-center justify-center text-2xl font-bold text-text-primary overflow-hidden
                        ring-2 ${statusInfo.ringColor} ring-offset-2`}
        >
          {member.profileImage ? (
            <Image
              src={member.profileImage}
              alt="Profile"
              className="rounded-full object-cover"
              quality={100}
              width={70}
              height={70}
            />
          ) : (
            <p>{member.name.charAt(0)}</p>
          )}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-text-primary">
            {member.name}
          </h2>
          <Badge
            content={
              <div className="flex items-center gap-1.5">
                {roleInfo.icon}
                <span>{roleInfo.text}</span>
              </div>
            }
            color={roleInfo.className as BadgeColor}
            isDark={isDark}
            className="!inline-flex !px-3 !py-1.5 !rounded-full !text-sm !font-medium"
          />
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center px-2.5 py-1 rounded-full bg-component-secondary-background text-text-secondary">
            <span
              className={`w-2.5 h-2.5 rounded-full mr-2 ${statusInfo.indicator} animate-pulse`}
            />
            <span className="text-sm">{member.status}</span>
          </div>
          <span className="text-text-secondary text-sm">
            마지막 로그인: {formatRelativeTime(member.lastLogin)}
          </span>
        </div>
      </div>
    </div>
  )

  // Footer content for ModalTemplete
  const footerContent =
    user?.id === project?.leader.id && user?.id != member.id ? (
      <button
        onClick={handleKickOutMember}
        className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400
          rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 cursor-pointer"
      >
        <UserRemove className="w-5 h-5" />
        <span>팀원 퇴출</span>
      </button>
    ) : null;

  return (
    <ModalTemplete
      isOpen={isOpen}
      onClose={onClose}
      header={headerContent}
      footer={footerContent}
    >
      {/* Contact Information Accordian */}
      <Accordion
        title="Information"
        icon={InfoCircle}
        defaultOpen
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Introduction</h4>
            {member.introduction ? (
              <p className="text-muted-foreground leading-relaxed">{member.introduction}</p>
            ) : (
              <p className="text-text-secondary">소개글이 없습니다.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Email</h4>
              {member.email ? (
                <p className="text-muted-foreground">{member.email}</p>
              ) : (
                <p className="text-text-secondary">이메일이 없습니다.</p>
              )}
            </div>
            <div>
              <h4 className="font-medium">Phone Number</h4>
              {member.contactNumber ? (
                <p className="text-muted-foreground">{member.contactNumber}</p>
              ) : (
                <p className="text-text-secondary">연락처가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </Accordion>

      {/* working hours Accordian */}
      <Accordion
        title="Working Hours"
        icon={Clock}
      >
        <div className="space-y-2">
          {member.workingHours ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-component-secondary-background border border-component-border p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <h4 className="font-medium">Timezone</h4>
                </div>
                <p className="text-muted-foreground">
                  {member.workingHours.timezone === "Asia/Seoul"
                    ? "한국 표준시 (KST)"
                    : member.workingHours.timezone === "UTC"
                      ? "세계 표준시 (UTC)"
                      : member.workingHours.timezone === "America/New_York"
                        ? "동부 표준시 (EST)"
                        : member.workingHours.timezone === "America/Los_Angeles"
                          ? "태평양 표준시 (PST)"
                          : member.workingHours.timezone}
                </p>
              </div>
              <div className="bg-component-secondary-background border border-component-border p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <h4 className="font-medium">Time</h4>
                </div>
                <p className="text-muted-foreground">
                  {member.workingHours.start} - {member.workingHours.end}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-text-secondary">
              연락 가능 시간 정보가 없습니다.
            </p>
          )}
        </div>
      </Accordion>

      {/* Current Tasks Accordian */}
      <Accordion
        title={`Current Tasks (${member.currentTask.length})`}
        icon={ClipboardClean}
        defaultOpen
      >
        <div className="space-y-2">
          {member.currentTask.length > 0 ? (
            member.currentTask.map((task, idx) => (
              <div
                key={idx}
                className="p-3 bg-component-secondary-background border border-component-border rounded-lg cursor-pointer transition-colors"
              >
                <p
                  onClick={() => handleTaskClick(task.id)}
                  className="text-text-primary font-medium hover:text-blue-500 transition-colors"
                >
                  {task.title}
                </p>
              </div>
            ))
          ) : (
            <p className="text-text-secondary">현재 작업이 없습니다</p>
          )}
        </div>
      </Accordion>

      {/* Skills Accordian */}
      <Accordion
        title={`Skills (${member.skills.length})`}
        icon={ShieldCheck}
      >
        <div className="space-x-2">
          {member.skills && member.skills.length > 0 ? (
            member.skills.map((skill, index) => (
              <Badge key={index} content={skill} color="blue" isDark={isDark} />
            ))
          ) : (
            <p className="text-text-secondary">
              등록된 전문 분야가 없습니다.
            </p>
          )}
        </div>
      </Accordion>

      {/* Languages Accordian */}
      <Accordion
        title={`Languages (${member.languages.length})`}
        icon={Language}
      >
        <div className="space-x-2">
          {member.languages && member.languages.length > 0 ? (
            member.languages.map((language, index) => (
              <Badge key={index} content={language} color="purple" isDark={isDark} />
            ))
          ) : (
            <p className="text-text-secondary">
              등록된 언어가 없습니다.
            </p>
          )}
        </div>
      </Accordion>

      {/* Social Links Accordian */}
      <Accordion
        title={`Social Links (${member.socialLinks.length})`}
        icon={LinkIcon}
      >
        <div className="flex flex-wrap gap-2">
          {member.socialLinks && member.socialLinks.length > 0 ? (
            member.socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex"
              >
                <Badge
                  content={
                    <div className="flex items-center gap-2">
                      {link.name.toLowerCase() === "github" && (
                        <Github className="w-5 h-5" />
                      )}
                      {link.name.toLowerCase() === "linkedin" && (
                        <Linkedin className="w-5 h-5" />
                      )}
                      {link.name.toLowerCase() === "twitter" && (
                        <Twitter className="w-5 h-5" />
                      )}
                      {link.name.toLowerCase() === "facebook" && (
                        <Facebook className="w-5 h-5" />
                      )}
                      {link.name.toLowerCase() === "instagram" && (
                        <Instagram className="w-5 h-5" />
                      )}
                      {link.name.toLowerCase() === "website" && (
                        <Globe className="w-5 h-5" />
                      )}
                      {!["github", "linkedin", "twitter", "facebook", "instagram", "website"].includes(
                        link.name.toLowerCase()
                      ) && (
                          <LinkIcon className="w-5 h-5" />
                        )}
                      <span>{link.name}</span>
                    </div>
                  }
                  color="pink"
                  isEditable={false}
                  isDark={isDark}
                />
              </Link>
            ))
          ) : (
            <p className="text-text-secondary">소셜 링크가 없습니다.</p>
          )}
        </div>
      </Accordion>
    </ModalTemplete>
  )
}