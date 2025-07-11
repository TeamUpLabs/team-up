import { User } from "@/types/User";
import Badge, { BadgeColor } from "@/components/ui/Badge";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faStar, faShieldAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { getStatusInfo } from "@/utils/getStatusColor";
import { useTheme } from "@/contexts/ThemeContext";
import { useProject } from "@/contexts/ProjectContext";

interface MemberCardProps {
  member: User;
  isLeader: boolean;
  isManager: boolean;
  isExplore?: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function MemberCard({
  member,
  isLeader,
  isManager,
  isExplore,
  onClick,
}: MemberCardProps) {
  const { isDark } = useTheme();
  const { project } = useProject();

  const getContributionLevel = () => {
    const milestoneCount = project?.milestones?.filter((milestone) => milestone.assignees.some((assi) => assi.id === member.id)).length || 0;
    const taskCount = project?.tasks?.filter((task) => task.assignees.some((assi) => assi.id === member.id)).length || 0;
    const contributionScore = (milestoneCount * 10) + (taskCount * 15);

    if (contributionScore > 80) return { level: "상위 기여자", class: "purple" };
    if (contributionScore > 50) return { level: "활발한 기여자", class: "blue" };
    if (contributionScore > 20) return { level: "정기 기여자", class: "green" };
    return { level: "신규 기여자", class: "gray" };
  };

  const getRoleInfo = () => {
    if (isLeader) {
      return {
        icon: <FontAwesomeIcon icon={faStar} className="text-yellow-500" />,
        text: "리더",
        className: "yellow"
      };
    }
    if (isManager) {
      return {
        icon: <FontAwesomeIcon icon={faShieldAlt} className="text-blue-500" />,
        text: "관리자",
        className: "blue"
      };
    }
    return {
      icon: <FontAwesomeIcon icon={faUser} className="text-gray-500" />,
      text: "멤버",
      className: "gray"
    };
  };

  const statusInfo = getStatusInfo(member.status);
  const roleInfo = getRoleInfo();
  const contributionInfo = getContributionLevel();

  return (
    <div
      onClick={onClick}
      className="group bg-component-background rounded-xl overflow-hidden transition-all duration-300 cursor-pointer hover:translate-y-[-4px] border border-component-border hover:border-primary-500 hover:shadow-lg relative flex flex-col h-full"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            {member.profile_image ? (
              <div className="relative">
                <Image
                  src={member.profile_image}
                  alt={`${member.name} 프로필`}
                  width={70}
                  height={70}
                  className={`rounded-full object-cover ring-2 ${statusInfo.ringColor} ring-offset-2`}
                  quality={90}
                />
                {!isExplore && (
                  <span
                    className={`absolute bottom-0 right-0 w-4 h-4 ${statusInfo.indicator} rounded-full border-2 border-white`}
                    title={statusInfo.label}
                  ></span>
                )}
              </div>
            ) : (
              <div className="relative">
                <div className={`w-[70px] h-[70px] rounded-full bg-component-secondary-background flex items-center justify-center text-2xl font-bold text-gray-700 ring-2 ${statusInfo.ringColor} ring-offset-2`}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                {!isExplore && (
                  <span
                    className={`absolute bottom-0 right-0 w-4 h-4 ${statusInfo.indicator} rounded-full border-2 border-white`}
                    title={statusInfo.label}
                  ></span>
                )}
              </div>
            )}
          </div>

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

        <div className="space-y-2 mb-5">
          <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
            {member.name}
          </h3>

          <div className="flex items-center text-text-secondary">
            <p className="text-text-secondary font-medium">
              {member.role || "역할 미지정"}
            </p>
          </div>

          {!isExplore && (
            <Badge
              content={
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faBolt} />
                  <span>{contributionInfo.level}</span>
                </div>
              }
              color={contributionInfo.class as BadgeColor}
              isDark={isDark}
              className="!inline-flex !px-3 !py-1.5 !rounded-md !text-sm !font-medium"
            />
          )}
        </div>

        <div>
          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center">
            <span className="mr-2">기술 스택</span>
            <span className="h-px flex-grow bg-component-border"></span>
          </h4>

          {member.tech_stacks && member.tech_stacks.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {member.tech_stacks.map((skill, idx) => (
                <Badge
                  key={idx}
                  content={skill.tech}
                  color="blue"
                  isDark={isDark}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-secondary italic">
              등록된 기술 스택이 없습니다.
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto border-t border-component-border bg-component-secondary-background p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4 text-xs text-text-secondary">
          <div title="참여 프로젝트 수" className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>{project?.milestones?.filter((milestone) => milestone.assignees.some((assi) => assi.id === member.id)).length || 0} 마일스톤</span>
          </div>
          <div title="진행중인 태스크" className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span>{project?.tasks?.filter((task) => task.assignees.some((assi) => assi.id === member.id)).length || 0} 작업</span>
          </div>
        </div>
        <div className="text-xs text-text-secondary font-medium hover:text-text-primary">상세보기</div>
      </div>
    </div>
  );
}
