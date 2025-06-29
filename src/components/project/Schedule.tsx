import Image from "next/image";
import Link from "next/link";
import { useProject } from "@/contexts/ProjectContext";
import { formatDateTimeRange } from "@/utils/formatDateTimeRange";
import { useState, useEffect } from "react";
import ScheduleSkeleton from "@/components/skeleton/ScheduleSkeleton";
import { Task } from "@/types/Task";
import { getStatusColorName } from "@/utils/getStatusColor";
import { getPriorityColorName } from "@/utils/getPriorityColor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCalendarAlt,
  faTasks,
  faClock,
  faMapMarkerAlt,
  faCalendarCheck,
  faTag,
  faInfoCircle,
  faExclamationCircle,
  faVideo,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Tooltip from "@/components/ui/Tooltip";
import { MiniLogo } from "@/components/logo";
import Badge, { BadgeColor } from "@/components/ui/Badge";
import { useTheme } from "@/contexts/ThemeContext";

export default function Schedule() {
  const { project } = useProject();
  const [activeTab, setActiveTab] = useState<"meetings" | "events" | "tasks">(
    "meetings"
  );
  const [isLoading, setIsLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    if (project && project.schedules) {
      setIsLoading(false);
    }
  }, [project]);

  if (isLoading) {
    return <ScheduleSkeleton isPreview={false} />;
  }

  return (
    <div className="col-span-1 sm:col-span-2 bg-component-background p-3 md:p-4 lg:p-6 rounded-lg border border-component-border">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-text-primary">
          일정
        </h2>
      </div>
      {/* 탭 UI */}
      <div className="flex mb-4 bg-component-secondary-background rounded-lg overflow-x-auto whitespace-nowrap p-1 w-fit scrollbar-hide">
        <button
          className={`px-3 sm:px-4 md:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors relative flex-shrink-0 ${
            activeTab === "meetings"
              ? "bg-component-tertiary-background text-text-primary"
              : "text-text-secondary"
          } `}
          onClick={() => {
            setActiveTab("meetings");
          }}
        >
          <FontAwesomeIcon icon={faUsers} className="mr-1 sm:mr-2" /> 회의{" "}
          <span
            className={`ml-1 text-xs font-bold ${
              activeTab === "meetings" ? "text-red-500" : "text-text-secondary"
            }`}
          >
            {project?.schedules?.filter(
              (schedule) => schedule.type === "meeting"
            ).length ?? 0}
          </span>
        </button>
        <button
          className={`px-3 sm:px-4 md:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors relative flex-shrink-0 ${
            activeTab === "events"
              ? "bg-component-tertiary-background text-text-primary"
              : "text-text-secondary"
          } `}
          onClick={() => {
            setActiveTab("events");
          }}
        >
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 sm:mr-2" />{" "}
          이벤트{" "}
          <span
            className={`ml-1 text-xs font-bold ${
              activeTab === "events" ? "text-red-500" : "text-text-secondary"
            }`}
          >
            {project?.schedules?.filter((schedule) => schedule.type === "event")
              .length ?? 0}
          </span>
        </button>
        <button
          className={`px-3 sm:px-4 md:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors relative flex-shrink-0 ${
            activeTab === "tasks"
              ? "bg-component-tertiary-background text-text-primary"
              : "text-text-secondary"
          } `}
          onClick={() => {
            setActiveTab("tasks");
          }}
        >
          <FontAwesomeIcon icon={faTasks} className="mr-1 sm:mr-2" /> 작업{" "}
          <span
            className={`ml-1 text-xs font-bold ${
              activeTab === "tasks" ? "text-red-500" : "text-text-secondary"
            }`}
          >
            {project?.tasks?.length ?? 0}
          </span>
        </button>
      </div>

      {/* 탭별 내용 */}
      {activeTab === "meetings" && (
        <div className="space-y-4">
          {project?.schedules?.filter((schedule) => schedule.type === "meeting")
            .length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="text-4xl text-text-secondary-color mb-3"
              />
              <span className="text-text-secondary-color">
                예정된 회의가 없습니다.
              </span>
            </div>
          ) : (
            project?.schedules
              ?.filter((schedule) => schedule.type === "meeting")
              .map((meeting) => (
                <div
                  key={meeting.id}
                  className="bg-component-secondary-background border border-component-border rounded-xl p-3 sm:p-4 flex flex-col gap-2"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-semibold text-text-primary">
                          {meeting.title}
                        </span>
                        <Badge
                          content={
                            <span className='flex items-center gap-1 self-start'>
                              <FontAwesomeIcon icon={faInfoCircle} />
                              <span>
                                {meeting.status === 'not-started' ? '예정' :
                                  meeting.status === 'in-progress' ? '진행중' : '완료'}
                              </span>
                            </span>
                          }
                          color={getStatusColorName(meeting.status ?? '') as BadgeColor}
                          isDark={isDark}
                          className="!text-xs !px-2 !py-0.5"
                        />
                      </div>
                      <span className="text-xs sm:text-sm text-text-secondary font-medium flex items-center gap-1 self-start sm:self-center">
                        <FontAwesomeIcon
                          icon={faClock}
                          className="w-3 h-3 sm:w-auto sm:h-auto"
                        />
                        <span className="text-text-primary font-bold">
                          {formatDateTimeRange(
                            meeting.start_time,
                            meeting.end_time
                          )}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-text-secondary">
                        {meeting.description}
                      </span>
                      {meeting.memo && (
                        <span className="text-xs sm:text-sm text-text-secondary">
                          메모: {meeting.memo}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {meeting.link !== "" ? (
                      <Link href={`${meeting.link}`}>
                        <span className="flex items-center gap-1 text-xs font-medium text-text-secondary bg-component-tertiary-background px-2 py-1 rounded hover:bg-point-color-purple-hover/20">
                          {meeting.where === "zoom" ? (
                            <FontAwesomeIcon icon={faVideo} className="mr-1" />
                          ) : meeting.where === "google" ? (
                            <FontAwesomeIcon icon={faGoogle} className="mr-1" />
                          ) : (
                            <MiniLogo className="text-xs" />
                          )}
                          {meeting.where === "zoom"
                            ? "Zoom"
                            : meeting.where === "google"
                            ? "Google Meet"
                            : "TeamUp"}
                        </span>
                      </Link>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-medium text-text-secondary bg-component-tertiary-background px-2 py-1 rounded">
                        {meeting.where === "zoom" ? (
                          <FontAwesomeIcon icon={faVideo} className="mr-1" />
                        ) : meeting.where === "google" ? (
                          <FontAwesomeIcon icon={faGoogle} className="mr-1" />
                        ) : (
                          <MiniLogo className="text-xs!" />
                        )}
                        {meeting.where === "zoom"
                          ? "Zoom"
                          : meeting.where === "google"
                          ? "Google Meet"
                          : "TeamUp"}
                      </span>
                    )}
                    <div className="flex ml-auto items-center">
                      {meeting.assignee?.map((member, idx) => (
                        <Tooltip
                          content={member.name}
                          key={idx}
                          className="-ml-2"
                          placement="bottom"
                        >
                          {member.profileImage ? (
                            <Image
                              src={member.profileImage || "/DefaultProfile.jpg"}
                              alt="member"
                              className="w-7 h-7 rounded-full border-2 border-component-border -ml-2 first:ml-0"
                              width={28}
                              height={28}
                              onError={(e) => {
                                e.currentTarget.src = "/DefaultProfile.jpg";
                              }}
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faUser}
                              className="w-7 h-7 rounded-full border-2 border-component-border -ml-2 first:ml-0"
                            />
                          )}
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {activeTab === "events" && (
        <div className="space-y-4">
          {project?.schedules?.filter((schedule) => schedule.type === "event")
            .length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="text-4xl text-text-secondary-color mb-3"
              />
              <span className="text-text-secondary-color">
                예정된 이벤트가 없습니다.
              </span>
            </div>
          ) : (
            project?.schedules
              ?.filter((schedule) => schedule.type === "event")
              .map((event) => (
                <div
                  key={event.id}
                  className="bg-component-secondary-background border border-component-border rounded-xl p-3 sm:p-4 flex flex-col gap-2"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-semibold text-text-primary">
                          {event.title}
                        </span>
                        <Badge
                          content={
                            <span className='flex items-center gap-1 self-start'>
                              <FontAwesomeIcon icon={faInfoCircle} />
                              {event.status === 'not-started' ? '예정' :
                                event.status === 'in-progress' ? '진행중' : '완료'}
                            </span>
                          }
                          color={getStatusColorName(event.status ?? '') as BadgeColor}
                          isDark={isDark}
                          className="!text-xs !px-2 !py-0.5"
                        />
                      </div>
                      <span className="text-xs sm:text-sm text-text-secondary font-medium flex items-center gap-1 self-start sm:self-center">
                        <FontAwesomeIcon
                          icon={faClock}
                          className="w-3 h-3 sm:w-auto sm:h-auto"
                        />
                        <span className="text-text-primary font-bold">
                          {formatDateTimeRange(
                            event.start_time,
                            event.end_time
                          )}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-text-secondary">
                        {event.description}
                      </span>
                      {event.memo && (
                        <span className="text-xs sm:text-sm text-text-secondary">
                          메모: {event.memo}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex items-center gap-1 text-xs font-medium text-text-secondary bg-component-tertiary-background px-2 py-1 rounded">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                      {event.where}
                    </span>
                    <div className="flex ml-auto items-center">
                      {event.assignee?.map((member, idx) => (
                        <Tooltip
                          content={member.name}
                          key={idx}
                          className="-ml-2"
                          placement="bottom"
                        >
                          {member.profileImage ? (
                            <Image
                              src={member.profileImage || "/DefaultProfile.jpg"}
                              alt="member"
                              className="w-7 h-7 rounded-full border-2 border-component-border -ml-2 first:ml-0"
                              width={28}
                              height={28}
                              onError={(e) => {
                                e.currentTarget.src = "/DefaultProfile.jpg";
                              }}
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faUser}
                              className="w-7 h-7 rounded-full border-2 border-component-border -ml-2 first:ml-0"
                            />
                          )}
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="space-y-4">
          {project?.tasks?.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="text-4xl text-text-secondary-color mb-3"
              />
              <span className="text-text-secondary-color">
                진행 중인 작업이 없습니다.
              </span>
            </div>
          ) : (
            ((project?.tasks?.slice(0, 3) as Task[]) ?? []).map((task) => (
              <div
                key={task.id}
                className="bg-component-secondary-background border border-component-border rounded-xl p-3 sm:p-4 flex flex-col gap-2"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-semibold text-text-primary">
                      {task.title}
                    </span>
                    <span className="text-xs sm:text-sm text-text-secondary font-medium flex items-center gap-1 self-start sm:self-center">
                      <FontAwesomeIcon
                        icon={faCalendarCheck}
                        className="w-3 h-3 sm:w-auto sm:h-auto"
                      />{" "}
                      Due{" "}
                      <span className="text-text-primary font-bold">
                        {task.endDate
                          ? new Date(task.endDate).toLocaleDateString()
                          : "-"}
                      </span>
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-text-secondary">
                    {task.description}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    content={
                      <span className='flex items-center gap-1 self-start'>
                        <FontAwesomeIcon icon={faTag} />
                        {task.status === 'not-started' ? '예정' :
                          task.status === 'in-progress' ? '진행중' : '완료'}
                      </span>
                    }
                    color={getStatusColorName(task.status ?? '') as BadgeColor}
                    isDark={isDark}
                    className="!text-xs !px-2 !py-0.5"
                  />
                  <Badge
                    content={
                      <span className='flex items-center gap-1 self-start'>
                        <FontAwesomeIcon icon={faTag} />
                        {task.priority === "high"
                          ? "높음"
                          : task.priority === "medium"
                          ? "중간"
                          : "낮음"}
                      </span>
                    }
                    color={getPriorityColorName(task.priority ?? '') as BadgeColor}
                    isDark={isDark}
                    className="!text-xs !px-2 !py-0.5"
                  />
                  <div className="flex ml-auto items-center">
                    {task.assignee?.slice(0, 2).map((member, idx) => (
                      <Tooltip
                        content={member.name}
                        key={idx}
                        className="-ml-2"
                        placement="bottom"
                      >
                        {member.profileImage ? (
                          <Image
                            src={member.profileImage || "/DefaultProfile.jpg"}
                            alt="assignee"
                            className="w-7 h-7 rounded-full border-2 border-component-border -ml-2 first:ml-0"
                            width={28}
                            height={28}
                            onError={(e) => {
                              e.currentTarget.src = "/DefaultProfile.jpg";
                            }}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faUser}
                            className="w-7 h-7 rounded-full border-2 border-component-border -ml-2 first:ml-0"
                          />
                        )}
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
