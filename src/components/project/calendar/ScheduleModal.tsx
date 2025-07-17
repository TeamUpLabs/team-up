"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ModalTemplete from "@/components/ModalTemplete";
import { Schedule } from "@/types/Schedule";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faCheck, faPencil, faHourglassStart, faHourglassEnd, faVideo, faUser } from "@fortawesome/free-solid-svg-icons";
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
import { updateSchedule, deleteSchedule } from "@/hooks/getScheduleData";
import CancelBtn from "@/components/ui/button/CancelBtn";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import DeleteBtn from "@/components/ui/button/DeleteBtn";
import { Input } from "@/components/ui/Input";
import { useTheme } from "@/contexts/ThemeContext";

interface ScheduleModalProps {
  schedule: Schedule;
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleModal({ schedule, isOpen, onClose }: ScheduleModalProps) {
  const user = useAuthStore.getState().user;
  const { isDark } = useTheme();
  const { project } = useProject();
  const params = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<string>("none");
  const [scheduleData, setScheduleData] = useState<Schedule>(schedule);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const isUserAssignee = user && schedule?.assignees?.some((assi) => assi.id === user?.id);

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
    if (user && schedule?.assignees?.some((assi) => assi.id === user?.id)) {
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

  const handleSelectChange = (name: string, value: string | string[]) => {
    setScheduleData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleAssigneeClick = (assiId: number) => {
    localStorage.setItem('selectedAssiId', assiId.toString());

    const projectId = params?.projectId ? String(params.projectId) : 'default';
    router.push(`/platform/${projectId}/members`);

    onClose();
  };

  const handleSave = async () => {
    setSubmitStatus('submitting');
    try {
      await updateSchedule(project?.id ? String(project.id) : "0", schedule.id, {
        ...scheduleData,
        title: scheduleData.title ?? "",
        description: scheduleData.description ?? "",
        link: scheduleData.link ?? "",
        start_time: scheduleData.start_time ?? "",
        end_time: scheduleData.end_time ?? "",
        assignee_id: scheduleData.assignees?.map((a) => a.id) ?? [],
        where: scheduleData.where ?? "",
        status: scheduleData.status ?? "",
        memo: scheduleData.memo ?? "",
      });

      useAuthStore.getState().setAlert("스케줄 수정에 성공했습니다.", "success");
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error updating schedule:", error);
      setSubmitStatus('error');
      useAuthStore.getState().setAlert("스케줄 수정에 실패했습니다.", "error");
    } finally {
      setIsEditing("none");
      setSubmitStatus('idle');
    }
  };

  const handleDelete = () => {
    useAuthStore.getState().setConfirm("스케줄을 삭제하시겠습니까?", async () => {
      try {
        await deleteSchedule(project?.id ?? "", schedule.id);
        useAuthStore.getState().setAlert("스케줄 삭제에 성공했습니다.", "success");
        useAuthStore.getState().clearConfirm();
        onClose();
      } catch (error) {
        console.error("Error deleting schedule:", error);
        useAuthStore.getState().setAlert("스케줄 삭제에 실패했습니다.", "error");
      }
    });
  };

  const headerContent = (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faBullseye} />
          {isEditing === "title" ? (
            <Input
              type="text"
              name="title"
              value={scheduleData?.title}
              onChange={handleChange}
              className="!text-lg !font-semibold !py-1 !px-2"
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
            isDark={isDark}
            fit
          />
          {isEditing === "status" ? (
            <Select
              options={[
                { name: "status", value: "not_started", label: "NOT STARTED" },
                { name: "status", value: "in_progress", label: "IN PROGRESS" },
                { name: "status", value: "completed", label: "COMPLETED" },
              ]}
              value={scheduleData.status}
              onChange={(value) => handleSelectChange("status", value as string)}
              color={getStatusColorName(scheduleData.status)}
              className="!px-2 !py-0.5 !rounded-full !text-sm"
              autoWidth
              likeBadge={true}
            />
          ) : (
            <div className="flex items-center gap-2 group relative">
              <Badge
                content={scheduleData.status.replace('-', ' ').toUpperCase()}
                color={getStatusColorName(scheduleData.status)}
                isEditable={false}
                className="!rounded-full !px-2 !py-0.5"
                isDark={isDark}
                fit
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
          <CancelBtn
            handleCancel={handleCancelEdit}
            className="!text-sm"
            withIcon
          />
          <SubmitBtn
            onClick={handleSave}
            submitStatus={submitStatus}
            buttonText="저장"
            successText="저장 완료"
            errorText="오류 발생"
            className="!text-sm"
            withIcon
          />
        </div>
      )}
    </div>
  )

  const modalFooter =
    isEditing !== "none" ? (
      <DeleteBtn
        handleDelete={handleDelete}
        className="!text-sm justify-self-end"
        text="스케줄 삭제"
        withIcon
      />
    ) : null;

  return (
    <ModalTemplete
      isOpen={isOpen}
      onClose={onClose}
      header={headerContent}
      footer={modalFooter}
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
                className="w-full p-3 rounded-md m-auto bg-component-secondary-background border border-component-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo resize-none"
                placeholder="스케줄의 설명을 작성하세요"
              />
            ) : (
              scheduleData.description ? (
                <p className="text-muted-foreground leading-relaxed">{scheduleData.description}</p>
              ) : (
                <p className="text-text-secondary">스케줄의 설명이 없습니다.</p>
              )
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Created</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(scheduleData?.created_at).toLocaleDateString()} by {scheduleData?.creator.name}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Last Updated</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(scheduleData?.updated_at).toLocaleDateString()} by {scheduleData?.updater.name}
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
          <div className="space-y-2 bg-component-secondary-background p-3 rounded-lg border border-component-border">
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
          <div className="space-y-2 bg-component-secondary-background p-3 rounded-lg border border-component-border">
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
          {scheduleData.type === "meeting" && isEditing === "location" ? (
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
            />
          ) : scheduleData.type === "event" && isEditing === "location" ? (
            <Input
              type="text"
              id="where"
              name="where"
              value={scheduleData.where}
              onChange={handleChange}
              className="!px-3 !py-2"
              placeholder="이벤트 장소를 입력해주세요"
              required
            />
          ) : (
            <div className="flex items-center gap-2 group relative">
              <Badge
                content={
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-md ${getPlatformColor(scheduleData.where)}`}>
                    {scheduleData.type === "meeting" && scheduleData.where === "Zoom" ? (
                      <FontAwesomeIcon icon={faVideo} />
                    ) : scheduleData.type === "meeting" && scheduleData.where === "Google Meet" ? (
                      <FontAwesomeIcon icon={faGoogle} />
                    ) : scheduleData.type === "meeting" && scheduleData.where === "TeamUp" ? (
                      <MiniLogo className="text-xs!" />
                    ) : scheduleData.type === "event" ? (
                      <MapPin className="h-5 w-5" />
                    ) : (
                      <MiniLogo className="text-xs!" />
                    )}
                    <span>{scheduleData.where}</span>
                  </div>
                }
                color="none"
                isEditable={false}
                className={`!p-0 w-fit`}
                isDark={isDark}
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
              <Input
                type="url"
                value={scheduleData.link}
                onChange={(e) => handleSelectChange("link", e.target.value)}
                className="!px-2 !py-1"
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
                  ) : scheduleData.type === "event" ? (
                    <span className="text-text-secondary">이벤트는 링크가 없습니다.</span>
                  ) : (
                    scheduleData.link ? (
                      <Link
                        href={scheduleData.link || ""}
                        target="_blank"
                        className="text-blue-500 hover:underline"
                      >
                        {scheduleData.link}
                      </Link>
                    ) : (
                      <span className="text-text-secondary">링크가 없습니다.</span>
                    ))}
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
        title={`Assignees (${scheduleData.assignees && scheduleData.assignees.length || 0})`}
        icon={User}
      >
        <div className="space-y-2">
          {isEditing === "assignee" ? (
            <div className="border border-component-border rounded-lg p-3 bg-component-secondary-background hover:border-component-border-hover transition-all">
              <div className="mb-3">
                <p className="text-sm text-text-secondary">
                  선택된 담당자:{" "}
                  {scheduleData.assignees?.length ?? 0 > 0
                    ? `${scheduleData.assignees?.length}명`
                    : "없음"}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project?.members?.map((member) => {
                  const isSelected = scheduleData.assignees?.some(
                    (a) => a.id === member.user.id
                  );
                  return (
                    <div
                      key={member.user.id}
                      onClick={() => {
                        if (isSelected) {
                          if (
                            scheduleData.assignees?.length &&
                            scheduleData.assignees?.length > 1
                          ) {
                            setScheduleData({
                              ...scheduleData,
                              assignees: scheduleData.assignees?.filter(
                                (a) => a.id !== member.user.id
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
                            assignees: [...(scheduleData.assignees ?? []), member.user],
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
                            {member.user.profile_image ? (
                              <Image
                                src={member.user.profile_image}
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
                          {member.user.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {member.user.role}
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
                  {scheduleData.assignees?.length ?? 0 > 0
                    ? `${scheduleData.assignees?.length}명`
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
                {scheduleData?.assignees?.map((assi) => (
                  <div
                    key={assi?.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-component-tertiary-background border border-component-border transform transition-all duration-300 hover:bg-component-tertiary-background/60 hover:border-point-color-indigo cursor-pointer"
                    onClick={() => handleAssigneeClick(assi?.id ?? 0)}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-component-secondary-background flex items-center justify-center overflow-hidden">
                        <div className="relative w-full h-full flex items-center justify-center border border-component-border rounded-full">
                          {assi.profile_image ? (
                            <Image
                              src={assi.profile_image}
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
            <div className="flex items-center gap-2 group relative">
              <p className="text-sm text-text-secondary">
                {scheduleData.memo}
              </p>
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => handleEdit("memo")}
              />
            </div>
          ) : (
            <p className="text-sm text-text-secondary">메모가 없습니다.</p>
          )
        )}
      </Accordion>
    </ModalTemplete>
  );
}