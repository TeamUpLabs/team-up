import { User } from "@/types/User";
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

interface MemberDetailModalProps {
  member: User;
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

  // 숫자 형식의 시간을 HH:MM 형식으로 변환
  const formatTimeFromNumber = (timeNumber: string | number): string => {
    if (!timeNumber) return "";
    const num = Number(timeNumber);
    const hours = Math.floor(num / 100);
    const minutes = num % 100;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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
          {member.profile_image ? (
            <Image
              src={member.profile_image}
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
            className="!inline-flex !px-3 !py-1.5 !rounded-full !text-sm !font-medium"
          />
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center px-2.5 py-1 rounded-full bg-component-secondary-background text-text-secondary">
            <span
              className={`w-2.5 h-2.5 rounded-full mr-2 ${statusInfo.indicator} animate-pulse`}
            />
            <span className="text-sm">{statusInfo.label}</span>
          </div>
          <span className="text-text-secondary text-sm">
            마지막 로그인: {formatRelativeTime(member.last_login)}
          </span>
        </div>
      </div>
    </div>
  )

  // Footer content for ModalTemplete
  const footerContent =
    user?.id === project?.owner.id && user?.id != member.id ? (
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
            {member.bio ? (
              <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
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
              {member.phone ? (
                <p className="text-muted-foreground">{member.phone}</p>
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
          {member.collaboration_preference?.available_time_zone ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-component-secondary-background border border-component-border p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <h4 className="font-medium">Timezone</h4>
                </div>
                <p className="text-muted-foreground">
                  {member.collaboration_preference.available_time_zone === "Asia/Seoul"
                    ? "한국 표준시 (KST)"
                    : member.collaboration_preference.available_time_zone === "UTC"
                      ? "세계 표준시 (UTC)"
                      : member.collaboration_preference.available_time_zone === "America/New_York"
                        ? "동부 표준시 (EST)"
                        : member.collaboration_preference.available_time_zone === "America/Los_Angeles"
                          ? "태평양 표준시 (PST)"
                          : member.collaboration_preference.available_time_zone}
                </p>
              </div>
              <div className="bg-component-secondary-background border border-component-border p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <h4 className="font-medium">Time</h4>
                </div>
                <p className="text-muted-foreground">
                  {formatTimeFromNumber(member.collaboration_preference.work_hours_start)} - {formatTimeFromNumber(member.collaboration_preference.work_hours_end)}
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
        title={`Current Tasks (${project?.tasks?.filter(task => task.assignees?.some(assi => assi.id === member.id)).length || 0})`}
        icon={ClipboardClean}
        defaultOpen
      >
        <div className="space-y-2">
          {project?.tasks && project?.tasks.length > 0 ? (
            project?.tasks.map((task, idx) => (
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
        title={`Skills (${member.tech_stacks && member.tech_stacks.length || 0})`}
        icon={ShieldCheck}
      >
        <div className="space-x-2">
          {member.tech_stacks && member.tech_stacks.length > 0 ? (
            member.tech_stacks.map((skill, index) => (
              <Badge
                key={index}
                content={
                  <span>
                    {skill.tech} {skill.level === 0 ? "초급" : skill.level === 1 ? "중급" : "고급"}
                  </span>
                }
                color="blue"
                fit
              />
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
        title={`Languages (${member.languages && member.languages.length || 0})`}
        icon={Language}
      >
        <div className="space-x-2">
          {member.languages && member.languages.length > 0 ? (
            member.languages.map((language: string, index: number) => (
              <Badge key={index} content={language} color="purple" fit />
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
        title={`Social Links (${member.social_links && member.social_links.length || 0})`}
        icon={LinkIcon}
      >
        <div className="flex flex-wrap gap-2">
          {member.social_links && member.social_links.length > 0 ? (
            member.social_links.map((link, index) => (
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
                      {link.platform.toLowerCase() === "github" && (
                        <Github className="w-5 h-5" />
                      )}
                      {link.platform.toLowerCase() === "linkedin" && (
                        <Linkedin className="w-5 h-5" />
                      )}
                      {link.platform.toLowerCase() === "twitter" && (
                        <Twitter className="w-5 h-5" />
                      )}
                      {link.platform.toLowerCase() === "facebook" && (
                        <Facebook className="w-5 h-5" />
                      )}
                      {link.platform.toLowerCase() === "instagram" && (
                        <Instagram className="w-5 h-5" />
                      )}
                      {link.platform.toLowerCase() === "website" && (
                        <Globe className="w-5 h-5" />
                      )}
                      {!["github", "linkedin", "twitter", "facebook", "instagram", "website"].includes(
                        link.platform.toLowerCase()
                      ) && (
                          <LinkIcon className="w-5 h-5" />
                        )}
                      <span>{link.platform}</span>
                    </div>
                  }
                  color="pink"
                  isEditable={false}
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