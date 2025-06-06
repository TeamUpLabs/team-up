"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ModalTemplete from "@/components/ModalTemplete";
import { Schedule } from "@/types/Schedule";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faCheck, faPencil, faXmark, faHourglassStart, faHourglassEnd, faVideo, faUser } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { InfoCircle, CalendarWeek, MapPin, Link as LinkIcon, User, Annotation } from "flowbite-react-icons/outline";
import { MiniLogo } from "@/components/logo";
import { useAuthStore } from "@/auth/authStore";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import Accordion from "@/components/ui/Accordion";
import { getStatusColorName } from "@/utils/getStatusColor";
import { useProject } from "@/contexts/ProjectContext";
import DateTimePicker from "@/components/ui/DateTimePicker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { getPlatformColor, getPlatformColorName } from "@/utils/getPlatformColor";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface ScheduleModalProps {
  schedule: Schedule;
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleModal({ schedule, isOpen, onClose }: ScheduleModalProps) {
  const user = useAuthStore.getState().user;
  const { project } = useProject();
  const params = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<string>("none");
  const [scheduleData, setScheduleData] = useState<Schedule>(schedule);

  const isUserAssignee = user && schedule?.assignee?.some((assi) => assi.id === user?.id);

  const handleChange = (
    e:
      | React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setScheduleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (name: string) => {
    if (user && schedule?.assignee?.some((assi) => assi.id === user?.id)) {
      setIsEditing(name);
      if (name !== "none") {
        useAuthStore.getState().setAlert("편집 모드로 전환되었습니다.", "info");
      } else {
        useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
      }
    } else {
      useAuthStore.getState().setAlert("스케줄을 수정할 권한이 없습니다.", "error");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing("none");
    setScheduleData(schedule);
    useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
  };

  const handleSave = () => {
    setIsEditing("none");
    useAuthStore.getState().setAlert("스케줄이 수정되었습니다.", "success");
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setScheduleData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleAssigneeClick = (assiId: number) => {
    localStorage.setItem('selectedAssiId', assiId.toString());

    const projectId = params?.projectId ? String(params.projectId) : 'default';
    router.push(`/platform/${projectId}/members`);

    onClose();
  };

  const headerContent = (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faBullseye} />
          {isEditing === "title" ? (
            <input
              type="text"
              name="title"
              value={scheduleData?.title}
              onChange={handleChange}
              className="text-lg font-semibold py-1 px-2 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
              placeholder={`${schedule.type === "meeting" ? "회의" : "이벤트"} 제목을 입력하세요`}
            />
          ) : (
            <div className="flex items-center gap-2 group relative">
              <span className="text-xl font-semibold text-text-primary">
                {scheduleData?.title}
              </span>
              {isUserAssignee && (
                <FontAwesomeIcon
                  icon={faPencil}
                  size="xs"
                  className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => handleEdit("title")}
                />
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            content={scheduleData?.type === "meeting" ? "회의" : "이벤트"}
            color="teal"
            isEditable={false}
            className="!rounded-full !px-2 !py-0.5"
          />
          {isEditing === "status" ? (
            <Select
              options={[
                { name: "status", value: "not-started", label: "NOT STARTED" },
                { name: "status", value: "in-progress", label: "IN PROGRESS" },
                { name: "status", value: "done", label: "Done" },
              ]}
              value={scheduleData.status}
              onChange={(value) => handleSelectChange("status", value as string)}
              color={getStatusColorName(scheduleData.status)}
              className="px-3 py-1 rounded-full text-sm"
            />
          ) : (
            <div className="flex items-center gap-2 group relative">
              <Badge
                content={scheduleData.status.replace('-', ' ').toUpperCase()}
                color={getStatusColorName(scheduleData.status)}
                isEditable={false}
                className="!rounded-full !px-2 !py-0.5"
              />
              {isUserAssignee && (
                <FontAwesomeIcon
                  icon={faPencil}
                  size="xs"
                  className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => handleEdit("status")}
                />
              )}
            </div>
          )}
        </div>
      </div>
      {(isUserAssignee && isEditing !== "none") && (
        <div className="flex items-center gap-2">
          <>
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-1.5 text-sm border border-component-border hover:bg-can text-text-primary px-4 py-2 rounded-md transition-all duration-200 font-medium"
            >
              <FontAwesomeIcon icon={faXmark} />
              취소
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-sm bg-point-color-indigo hover:bg-point-color-indigo-hover text-white px-4 py-2 rounded-md transition-all duration-200 font-medium"
            >
              <FontAwesomeIcon icon={faCheck} />
              저장
            </button>
          </>
        </div>
      )}
    </div>
  )

  return (
    <ModalTemplete
      isOpen={isOpen}
      onClose={onClose}
      header={headerContent}
    >
      <Accordion
        title="Overview"
        icon={InfoCircle}
        defaultOpen
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 group relative">
              <h4 className="font-medium">Description</h4>
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() =>
                  isEditing === "description" ? handleEdit("none") : handleEdit("description")
                }
              />
            </div>
            {isEditing === "description" ? (
              <textarea
                name="description"
                value={scheduleData.description}
                onChange={handleChange}
                className="w-full p-3 rounded-lg m-auto bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo resize-none"
                placeholder="스케줄의 설명을 작성하세요"
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">{scheduleData.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Created</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(scheduleData?.created_at).toLocaleDateString()} by {project?.members.find((member) => member.id === scheduleData?.created_by)?.name}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Last Updated</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(scheduleData?.updated_at).toLocaleDateString()} by {project?.members.find((member) => member.id === scheduleData?.updated_by)?.name}
              </p>
            </div>
          </div>
        </div>
      </Accordion>

      {/* Timeline Accordian */}
      <Accordion
        title="Timeline"
        icon={CalendarWeek}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 bg-component-secondary-background p-3 rounded-lg">
            <div className="flex items-center gap-2 group relative">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faHourglassStart} color="green" />
                <h4 className="font-medium">Start Date</h4>
              </div>
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() =>
                  isEditing === "startDate" ? handleEdit("none") : handleEdit("startDate")
                }
              />
            </div>
            {isEditing === "startDate" ? (
              <DateTimePicker
                id="start_time"
                name="start_time"
                value={scheduleData.start_time}
                onChange={handleChange}
                className="text-sm"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {format(new Date(scheduleData.start_time), "yyyy년 MM월 dd일 a hh:mm", { locale: ko })}
              </p>
            )}
          </div>
          <div className="space-y-2 bg-component-secondary-background p-3 rounded-lg">
            <div className="flex items-center gap-2 group relative">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faHourglassEnd} color="red" />
                <h4 className="font-medium">End Date</h4>
              </div>
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() =>
                  isEditing === "endDate" ? handleEdit("none") : handleEdit("endDate")
                }
              />
            </div>
            {isEditing === "endDate" ? (
              <DateTimePicker
                id="end_time"
                name="end_time"
                value={scheduleData.end_time}
                onChange={handleChange}
                minDate={scheduleData.start_time}
                minTime={scheduleData.start_time ? format(new Date(scheduleData.start_time), "hh:mm a", { locale: ko }) : undefined}
                className="text-sm"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {format(new Date(scheduleData.end_time), "yyyy년 MM월 dd일 a hh:mm", { locale: ko })}
              </p>
            )}
          </div>
        </div>
      </Accordion>

      {/* Location Accordian */}
      <Accordion
        title="Location"
        icon={MapPin}
        defaultOpen
      >
        <div className="flex flex-col gap-2 space-y-2">
          {isEditing === "location" ? (
            <Select
              options={[
                { name: "where", value: "Zoom", label: "Zoom" },
                { name: "where", value: "Google Meet", label: "Google Meet" },
                { name: "where", value: "TeamUp", label: "TeamUp" },
              ]}
              value={scheduleData?.where}
              color={getPlatformColorName(scheduleData.where)}
              onChange={(value) => handleSelectChange("where", value as string)}
              className="w-fit px-3 py-1 rounded-md"
              dropdownAlign="start"
            />
          ) : (
            <div className="flex items-center gap-2 group relative">
              <Badge
                content={
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-md ${getPlatformColor(scheduleData.where)}`}>
                    {scheduleData.where === "Zoom" ? (
                      <FontAwesomeIcon icon={faVideo} />
                    ) : scheduleData.where === "Google Meet" ? (
                      <FontAwesomeIcon icon={faGoogle} />
                    ) : (
                      <MiniLogo className="text-xs!" />
                    )}
                    <span>{scheduleData.where}</span>
                  </div>
                }
                color="none"
                isEditable={false}
                className={`!p-0 w-fit`}
              />
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() =>
                  isEditing === "location" ? handleEdit("none") : handleEdit("location")
                }
              />
            </div>
          )}
          {isEditing === "link" ? (
            <div className="flex items-center gap-2">
              <LinkIcon className="text-text-secondary" />
              <input
                type="url"
                value={scheduleData.link}
                onChange={(e) => handleSelectChange("link", e.target.value)}
                className="w-full border border-component-border rounded-lg p-2 focus:outline-none focus:border-component-border-hover"
                placeholder="링크를 입력해주세요"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 group relative">
              <div className="flex items-center gap-2">
                <LinkIcon className="text-text-secondary" />
                <p className="text-sm text-muted-foreground">
                  {scheduleData.where === "TeamUp" ? (
                    <span className="text-text-secondary">TeamUp의 화상통화를 이용하세요.</span>
                  ) : (
                    <Link
                      href={scheduleData.link || ""}
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      {scheduleData.link}
                    </Link>
                  )}
                </p>
              </div>
              {scheduleData.where !== "TeamUp" && (
                <FontAwesomeIcon
                  icon={faPencil}
                  size="xs"
                  className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() =>
                    isEditing === "link" ? handleEdit("none") : handleEdit("link")
                  }
                />
              )}
            </div>
          )}
        </div>
      </Accordion>

      {/* Assignee Accordian */}
      <Accordion
        title="Assignees"
        icon={User}
      >
        <div className="space-y-2">
          {isEditing === "assignee" ? (
            <div className="border border-component-border rounded-lg p-3 bg-component-secondary-background hover:border-component-border-hover transition-all">
              <div className="mb-3">
                <p className="text-sm text-text-secondary">
                  선택된 담당자:{" "}
                  {scheduleData.assignee?.length ?? 0 > 0
                    ? `${scheduleData.assignee?.length}명`
                    : "없음"}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project?.members?.map((member) => {
                  const isSelected = scheduleData.assignee?.some(
                    (a) => a.id === member.id
                  );
                  return (
                    <div
                      key={member.id}
                      onClick={() => {
                        if (isSelected) {
                          if (
                            scheduleData.assignee?.length &&
                            scheduleData.assignee?.length > 1
                          ) {
                            setScheduleData({
                              ...scheduleData,
                              assignee: scheduleData.assignee?.filter(
                                (a) => a.id !== member.id
                              ),
                            });
                          } else {
                            useAuthStore
                              .getState()
                              .setAlert(
                                "최소 한 명의 담당자는 필요합니다.",
                                "warning"
                              );
                          }
                        } else {
                          setScheduleData({
                            ...scheduleData,
                            assignee: [...(scheduleData.assignee ?? []), member],
                          });
                        }
                      }}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected
                        ? "bg-purple-500/20 border border-purple-500/50"
                        : "bg-component-tertiary-background border border-component-border hover:bg-component-tertiary-background/60"
                        }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-component-secondary-background flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full flex items-center justify-center border border-component-border rounded-full">
                            {member.profileImage ? (
                              <Image
                                src={member.profileImage}
                                alt="Profile"
                                className={`rounded-full absolute text-text-secondary transform transition-all duration-300 ${isSelected
                                  ? "opacity-0 rotate-90 scale-0"
                                  : "opacity-100 rotate-0 scale-100"
                                  }`}
                                quality={100}
                                width={60}
                                height={60}
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/DefaultProfile.jpg";
                                }}
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faUser}
                                className={`absolute text-text-secondary transform transition-all duration-300 ${isSelected
                                  ? "opacity-0 rotate-90 scale-0"
                                  : "opacity-100 rotate-0 scale-100"
                                  }`}
                              />
                            )}
                            <FontAwesomeIcon
                              icon={faCheck}
                              className={`absolute text-text-secondary transform transition-all duration-300 ${isSelected
                                ? "opacity-100 rotate-0 scale-100"
                                : "opacity-0 -rotate-90 scale-0"
                                }`}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-text-primary">
                          {member.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 border border-component-border rounded-lg p-3 bg-component-secondary-background hover:border-component-border-hover">
              <div className="flex items-center gap-2 group relative">
                <p className="text-sm text-text-secondary">
                  담당자:{" "}
                  {scheduleData.assignee?.length ?? 0 > 0
                    ? `${scheduleData.assignee?.length}명`
                    : "없음"}
                </p>
                <FontAwesomeIcon
                  icon={faPencil}
                  size="xs"
                  className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() =>
                    isEditing === "assignee" ? handleEdit("none") : handleEdit("assignee")
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {scheduleData?.assignee?.map((assi) => (
                  <div
                    key={assi?.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-component-tertiary-background border border-component-border transform transition-all duration-300 hover:bg-component-tertiary-background/60 hover:border-point-color-indigo cursor-pointer"
                    onClick={() => handleAssigneeClick(assi?.id ?? 0)}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-component-secondary-background flex items-center justify-center overflow-hidden">
                        <div className="relative w-full h-full flex items-center justify-center border border-component-border rounded-full">
                          {assi.profileImage ? (
                            <Image
                              src={assi.profileImage}
                              alt="Profile"
                              quality={100}
                              className="rounded-full"
                              width={60}
                              height={60}
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/DefaultProfile.jpg";
                              }}
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faUser}
                              className={`absolute text-text-secondary transform transition-all duration-300`}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-text-primary">
                        {assi.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {assi.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Accordion>

      {/* Memo Accordian */}
      <Accordion
        title="Memo"
        icon={Annotation}
      >
        {isEditing === "memo" ? (
          <textarea
            value={scheduleData.memo}
            onChange={(e) => handleSelectChange("memo", e.target.value)}
            className="w-full border border-component-border rounded-lg p-2 focus:outline-none focus:border-component-border-hover resize-none"
            placeholder="메모를 입력해주세요"
          />
        ) : (
          scheduleData.memo ? (
            <p className="text-sm text-text-secondary">
              {scheduleData.memo}
            </p>
          ) : (
            <p className="text-sm text-text-secondary">메모가 없습니다.</p>
          )
        )}
      </Accordion>
    </ModalTemplete>
  );
}