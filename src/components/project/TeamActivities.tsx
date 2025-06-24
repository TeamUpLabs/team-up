import { useState, useEffect } from "react";
import { useProject } from "@/contexts/ProjectContext";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { useTheme } from "@/contexts/ThemeContext";
import TeamActivitiesSkeleton from "@/components/skeleton/TeamActivitiesSkeleton";

export default function TeamActivities() {
  const { project } = useProject();
  const [isLoading, setIsLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    if (project && project.members) {
      setIsLoading(false);
    }
  }, [project]);

  if (isLoading) {
    return <TeamActivitiesSkeleton isPreview={false} />;
  }

  return (
    <div className="col-span-1 sm:col-span-2 bg-component-background p-4 sm:p-6 rounded-lg border border-component-border">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
          팀원 활동
        </h2>
      </div>
      <div className="max-h-[300px] overflow-y-auto divide-y divide-component-border">
        {project?.members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-2 hover:bg-component-secondary-background transition duration-200"
          >
            <div className="flex items-center">
              <div
                className={`w-10 h-10 relative border border-component-border bg-component-secondary-background rounded-full flex items-center justify-center text-text-primary font-bold`}
              >
                {member.profileImage ? (
                  <Image
                    src={member.profileImage}
                    alt="Profile"
                    className="w-full h-full object-fit rounded-full"
                    quality={100}
                    width={40}
                    height={40}
                    onError={(e) => {
                      e.currentTarget.src = "/DefaultProfile.jpg";
                    }}
                  />
                ) : (
                  <p>{member.name.charAt(0)}</p>
                )}
              </div>
              <div className="ml-3">
                <div className="flex items-center gap-2">
                  <p className="text-text-primary">{member.name}</p>
                  {member.id === project?.leader.id ? (
                    <Badge
                      content="프로젝트 리더"
                      color="yellow"
                      isDark={isDark}
                      className="!text-xs !px-2 !py-0.5"
                    />
                  ) : project?.manager.some(
                      (manager) => manager.id === member.id
                    ) ? (
                    <Badge
                      content="관리자"
                      color="blue"
                      isDark={isDark}
                      className="!text-xs !px-2 !py-0.5"
                    />
                  ) : (
                    <Badge
                      content="멤버"
                      color="green"
                      isDark={isDark}
                      className="!text-xs !px-2 !py-0.5"
                    />
                  )}
                </div>
                <p className="text-sm text-text-secondary">{member.role}</p>
                <div className="flex gap-1 align-center">
                  <p className="text-xs text-text-secondary">현재 작업: </p>
                  {member.currentTask.length > 0 ? (
                    member.currentTask.map((task, idx) => (
                      <p key={idx} className="text-xs text-text-secondary">
                        {task.title}
                      </p>
                    ))
                  ) : (
                    <p className="text-xs text-text-secondary">없음</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <span
                  className={`w-3 h-3 bg-${
                    member.status === "활성"
                      ? "green"
                      : member.status === "자리비움"
                      ? "yellow"
                      : "gray"
                  }-500 rounded-full`}
                ></span>
                <span className="ml-2 text-text-secondary">
                  {member.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
