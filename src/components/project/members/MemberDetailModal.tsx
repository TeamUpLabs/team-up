"use client";

import { Member } from "@/types/Member";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/auth/authStore";
import ModalTemplete from "@/components/ModalTemplete";
import Badge from "@/components/ui/Badge";
import { kickOutMemberFromProject } from "@/hooks/getProjectData";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faShieldAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { Envelope, Clock, ClipboardClean, ShieldCheck, Language, User, Link, UserRemove } from "flowbite-react-icons/outline";
import { Github, Linkedin, Twitter, Facebook, Instagram, Globe } from "flowbite-react-icons/solid";
import { useProject } from "@/contexts/ProjectContext";
import { formatRelativeTime } from "@/utils/dateUtils";

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
        className: "bg-yellow-100 text-yellow-700 border-yellow-200",
      };
    }
    if (isManager) {
      return {
        icon: <FontAwesomeIcon icon={faShieldAlt} className="text-blue-500" />,
        text: "관리자",
        className: "bg-blue-100 text-blue-700 border-blue-200",
      };
    }
    return {
      icon: <FontAwesomeIcon icon={faUser} className="text-gray-500" />,
      text: "멤버",
      className: "bg-gray-100 text-gray-700 border-gray-200",
    };
  };

  const roleInfo = getRoleInfo();

  // Header content for ModalTemplete
  const headerContent = (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <div
          className="w-16 h-16 relative border-2 rounded-full border-component-border bg-component-secondary-background 
                    flex items-center justify-center text-2xl font-bold text-text-primary overflow-hidden"
        >
          {member.profileImage ? (
            <Image
              src={member.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
              quality={100}
              fill
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
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${roleInfo.className} border`}
          >
            {roleInfo.icon}
            <span>{roleInfo.text}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center px-2.5 py-1 rounded-full bg-component-secondary-background text-text-secondary">
            <span
              className={`w-2.5 h-2.5 rounded-full mr-2 ${
                member.status === "활성"
                  ? "bg-emerald-500"
                  : member.status === "자리비움"
                  ? "bg-amber-500"
                  : "bg-gray-500"
              } animate-pulse`}
            />
            <span className="text-sm">{member.status}</span>
          </div>
          <span className="text-text-secondary text-sm">
            마지막 로그인: {formatRelativeTime(member.lastLogin)}
          </span>
        </div>
      </div>
    </div>
  );

  // Footer content for ModalTemplete
  const footerContent =
    user?.id === project?.leader.id && user?.id != member.id ? (
      <button
        onClick={handleKickOutMember}
        className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400
          rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
      >
        <UserRemove className="w-5 h-5" />
        <span>팀원 퇴출</span>
      </button>
    ) : null;

  return (
    <ModalTemplete
      header={headerContent}
      footer={footerContent}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-6">
        {/* Contact Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-component-secondary-background rounded-xl p-4">
            <div className="flex items-center gap-2 border-b border-component-border pb-2 mb-4">
              <Envelope className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-text-primary">
                연락처 정보
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="font-medium">이메일:</span>
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="font-medium">전화번호:</span>
                <span>{member.contactNumber || "정보 없음"}</span>
              </div>
            </div>
          </div>

          <div className="bg-component-secondary-background rounded-xl p-4">
            <div className="flex items-center gap-2 border-b border-component-border pb-2 mb-4">
              <Clock className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-text-primary">
                연락 가능 시간
              </h3>
            </div>
            <div className="space-y-2">
              {member.workingHours ? (
                <>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <span className="font-medium">시간대:</span>
                    <span>
                      {member.workingHours.timezone === "Asia/Seoul"
                        ? "한국 표준시 (KST)"
                        : member.workingHours.timezone === "UTC"
                        ? "세계 표준시 (UTC)"
                        : member.workingHours.timezone === "America/New_York"
                        ? "동부 표준시 (EST)"
                        : member.workingHours.timezone === "America/Los_Angeles"
                        ? "태평양 표준시 (PST)"
                        : member.workingHours.timezone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <span className="font-medium">시간:</span>
                    <span>
                      {member.workingHours.start} - {member.workingHours.end}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-text-secondary">
                  연락 가능 시간 정보가 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Current Tasks Section */}
        <div className="bg-component-secondary-background rounded-xl p-4">
          <div className="flex items-center gap-2 border-b border-component-border pb-2 mb-4">
            <ClipboardClean className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-text-primary">
              현재 작업
            </h3>
          </div>
          <div className="space-y-2">
            {member.currentTask.length > 0 ? (
              member.currentTask.map((task, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-component-tertiary-background rounded-lg cursor-pointer transition-colors"
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
        </div>

        {/* Skills and Languages Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Skills Section */}
          <div className="bg-component-secondary-background rounded-xl p-4">
            <div className="flex items-center gap-2 border-b border-component-border pb-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-text-primary">
                전문 분야
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {member.skills && member.skills.length > 0 ? (
                member.skills.map((skill, index) => (
                  <Badge key={index} content={skill} color="blue" />
                ))
              ) : (
                <p className="text-text-secondary">
                  등록된 전문 분야가 없습니다.
                </p>
              )}
            </div>
          </div>

          {/* Languages Section */}
          <div className="bg-component-secondary-background rounded-xl p-4">
            <div className="flex items-center gap-2 border-b border-component-border pb-2 mb-4">
              <Language className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-text-primary">언어</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {member.languages && member.languages.length > 0 ? (
                member.languages.map((language, index) => (
                  <Badge key={index} content={language} color="purple" />
                ))
              ) : (
                <p className="text-text-secondary">등록된 언어가 없습니다.</p>
              )}
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="bg-component-secondary-background rounded-xl p-4">
          <div className="flex items-center gap-2 border-b border-component-border pb-2 mb-4">
            <User className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-semibold text-text-primary">소개</h3>
          </div>
          <p className="text-text-secondary whitespace-pre-wrap">
            {member.introduction || "소개 정보가 없습니다."}
          </p>
        </div>

        {/* Social Links Section */}
        <div className="bg-component-secondary-background rounded-xl p-4">
          <div className="flex items-center gap-2 border-b border-component-border pb-2 mb-4">
            <Link className="w-5 h-5 text-cyan-500" />
            <h3 className="text-lg font-semibold text-text-primary">
              소셜 링크
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {member.socialLinks && member.socialLinks.length > 0 ? (
              member.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-component-tertiary-background hover:bg-component-hover rounded-lg text-text-secondary transition-colors flex items-center gap-2"
                >
                  {link.name.toLowerCase() === "github" && (
                    <Github className="w-5 h-5 text-text-secondary" />
                  )}
                  {link.name.toLowerCase() === "linkedin" && (
                    <Linkedin className="w-5 h-5 text-text-secondary" />
                  )}
                  {link.name.toLowerCase() === "twitter" && (
                    <Twitter className="w-5 h-5 text-text-secondary" />
                  )}
                  {link.name.toLowerCase() === "facebook" && (
                    <Facebook className="w-5 h-5 text-text-secondary" />
                  )}
                  {link.name.toLowerCase() === "instagram" && (
                    <Instagram className="w-5 h-5 text-text-secondary" />
                  )}
                  {link.name.toLowerCase() === "website" && (
                    <Globe className="w-5 h-5 text-text-secondary" />
                  )}
                  {!["github", "linkedin", "twitter", "facebook", "instagram", "website"].includes(
                    link.name.toLowerCase()
                  ) && (
                    <Link className="w-5 h-5 text-text-secondary" />
                  )}
                  {link.name}
                </a>
              ))
            ) : (
              <p className="text-text-secondary">소셜 링크가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </ModalTemplete>
  );
}
