"use client";

import Image from "next/image";
import ModalTemplete from "@/components/ModalTemplete";
import { MileStone } from "@/types/MileStone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faPencil, faCheck, faXmark, faHourglassStart, faHourglassEnd, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/auth/authStore";
import { useParams, useRouter } from "next/navigation";
import { useProject } from "@/contexts/ProjectContext";
import { useState } from "react";
import Badge from "@/components/ui/Badge";
import { Flag, InfoCircle, CalendarWeek, FileCheck, User, Tag, TrashBin } from "flowbite-react-icons/outline";
import Accordion from "@/components/ui/Accordion";
import { updateMilestone, deleteMilestone } from "@/hooks/getMilestoneData";
import Select from "@/components/ui/Select";
import { getStatusColorName } from "@/utils/getStatusColor";
import { getPriorityColorName } from "@/utils/getPriorityColor";

interface MilestoneModalProps {
  milestone: MileStone;
  isOpen: boolean;
  onClose: () => void;
}

export default function MilestoneModal({ milestone, isOpen, onClose }: MilestoneModalProps) {
  const user = useAuthStore.getState().user;
  const params = useParams();
  const { project } = useProject();
  const router = useRouter();
  const [milestoneData, setMilestoneData] = useState<MileStone>(milestone);
  const [isEditing, setIsEditing] = useState<string>("none");
  const [newTag, setNewTag] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  if (!isOpen) return null;

  const calculateProgress = () => {
    let totalTasks = 0;
    let completedTasks = 0;

    milestoneData?.subtasks.forEach(task => {
      // Count the main task
      totalTasks++;
      if (task.status === 'done') {
        completedTasks++;
      }

      // Count subtasks
      if (task.subtasks.length > 0) {
        totalTasks += task.subtasks.length;
        completedTasks += task.subtasks.filter(st => st.completed).length;
      }
    });

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const progressPercentage = calculateProgress();

  // Calculate if user is assignee inside the component body to ensure it's always up-to-date
  const isUserAssignee = user && milestoneData?.assignee?.some(assi => assi.id === user.id);

  const handleAssigneeClick = (assiId: number) => {
    localStorage.setItem('selectedAssiId', assiId.toString());

    const projectId = params?.projectId ? String(params.projectId) : 'default';
    router.push(`/platform/${projectId}/members`);

    onClose();
  };

  const handleTaskClick = (taskId: number) => {
    localStorage.setItem('selectedTaskId', taskId.toString());

    const projectId = params?.projectId ? String(params.projectId) : 'default';
    router.push(`/platform/${projectId}/tasks`);

    onClose();
  };

  const handleRemoveTag = (tagIndex: number) => {
    const updatedTags = milestoneData.tags.filter((_, index) => index !== tagIndex);
    setMilestoneData({ ...milestoneData, tags: updatedTags });
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setMilestoneData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Validate end date is not earlier than start date
    if (name === 'endDate') {
      const startDate = milestoneData.startDate;
      if (startDate && value && new Date(value) < new Date(startDate)) {
        useAuthStore.getState().setAlert("종료일은 시작일보다 빠를 수 없습니다.", "warning");
        setMilestoneData({ ...milestoneData, [name]: milestoneData[name] });
        return;
      }
    }

    // Validate start date is not later than end date
    if (name === 'startDate') {
      const endDate = milestoneData.endDate;
      if (endDate && value && new Date(endDate) < new Date(value)) {
        useAuthStore.getState().setAlert("시작일은 종료일보다 늦을 수 없습니다.", "warning");
        setMilestoneData({ ...milestoneData, [name]: milestoneData[name] });
        return;
      }
    }

    setMilestoneData({ ...milestoneData, [name]: value });
  };

  const handleDelete = () => {
    useAuthStore.getState().setConfirm("마일스톤을 삭제하시겠습니까?", async () => {
      try {
        await deleteMilestone(project?.id ?? "", milestone.id);
        useAuthStore.getState().setAlert("마일스톤 삭제에 성공했습니다.", "success");
        useAuthStore.getState().clearConfirm();
        onClose();
      } catch (error) {
        console.error("Error deleting milestone:", error);
        useAuthStore.getState().setAlert("마일스톤 삭제에 실패했습니다.", "error");
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();
      if (newTag.trim() !== '') {
        setMilestoneData({
          ...milestoneData,
          tags: [...milestoneData.tags, newTag.trim()]
        });
        setNewTag('');
      }
    }
  };

  const handleEdit = (name: string) => {
    if (user && milestoneData.assignee?.some(a => a.id === user?.id)) {
      setIsEditing(name);
      if (name !== "none") {
        useAuthStore.getState().setAlert("편집 모드로 전환되었습니다.", "info");
      } else {
        useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
      }
    } else {
      useAuthStore.getState().setAlert("담당자가 아니므로 수정할 수 없습니다.", "warning");
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateMilestone(params?.projectId ? String(params.projectId) : 'default', milestone.id, {
        ...milestoneData,
        assignee_id: milestoneData.assignee.map(a => a.id)
      });
      useAuthStore.getState().setAlert("마일스톤이 성공적으로 수정되었습니다.", "success");
      setIsEditing("none");
    } catch (error) {
      console.error("Error updating milestone:", error);
      useAuthStore.getState().setAlert("마일스톤 수정에 실패했습니다.", "error");
    } finally {
      setIsEditing("none");
    }
  };

  const handleCancelEdit = () => {
    setMilestoneData(milestone);
    setIsEditing("none");
    useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
  };

  const modalHeader = (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faBullseye} />
          {isEditing === "title" ? (
            <input
              type="text"
              name="title"
              value={milestoneData?.title}
              onChange={handleChange}
              className="text-xl font-semibold py-1 px-2 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
              placeholder="작업 제목을 입력하세요"
            />
          ) : (
            <div className="flex items-center gap-2 group relative">
              <span className="text-xl font-semibold text-text-primary">
                {milestoneData?.title}
              </span>
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() =>
                  isEditing === "title" ? handleEdit("none") : handleEdit("title")
                }
              />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {isEditing === "status" ? (
            <Select
              options={[
                { name: "status", value: "not-started", label: "NOT STARTED" },
                { name: "status", value: "in-progress", label: "IN PROGRESS" },
                { name: "status", value: "done", label: "DONE" },
              ]}
              value={milestoneData.status}
              onChange={(value) => handleSelectChange("status", value as string)}
              color={getStatusColorName(milestoneData.status)}
              className="px-3 py-1 rounded-full text-sm"
            />
          ) : (
            <div className="flex items-center gap-2 group relative">
              <Badge
                content={milestoneData.status.replace('-', ' ').toUpperCase()}
                color={getStatusColorName(milestoneData.status)}
                isEditable={false}
                className="!rounded-full !px-2 !py-0.5"
              />
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() =>
                  isEditing === "status" ? handleEdit("none") : handleEdit("status")
                }
              />
            </div>
          )}
          {isEditing === "priority" ? (
            <Select
              options={[
                { name: "priority", value: "high", label: "HIGH" },
                { name: "priority", value: "medium", label: "MEDIUM" },
                { name: "priority", value: "low", label: "LOW" },
              ]}
              value={milestoneData.priority}
              onChange={(value) => handleSelectChange("priority", value as string)}
              color={getPriorityColorName(milestoneData.priority)}
              className="px-3 py-1 rounded-full text-sm"
            />
          ) : (
            <div className="flex items-center gap-2 group relative">
              <Badge
                content={
                  <div className="flex items-center gap-1">
                    <Flag className="w-4 h-4" />
                    {milestoneData.priority.toUpperCase()}
                  </div>
                }
                color={getPriorityColorName(milestoneData.priority)}
                isEditable={false}
                className="!rounded-full !px-2 !py-0.5"
              />
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() =>
                  isEditing === "priority" ? handleEdit("none") : handleEdit("priority")
                }
              />
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
              onClick={handleSaveEdit}
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

  // Footer content (conditionally rendered)
  const modalFooter =
    isEditing !== "none" ? (
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-md transition-all duration-200 font-medium cursor-pointer"
          aria-label="작업 삭제"
        >
          <TrashBin />
          작업 삭제
        </button>
      </div>
    ) : null;

  return (
    <ModalTemplete
      header={modalHeader}
      footer={modalFooter}
      isOpen={isOpen}
      onClose={onClose}
    >
      {/* Overview Accordian */}
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
                value={milestoneData.description}
                onChange={handleChange}
                className="w-full p-3 rounded-lg m-auto bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo resize-none"
                placeholder="마일스톤의 설명을 작성하세요"
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">{milestoneData.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Created</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(milestone.createdAt).toLocaleDateString()} by {project?.members.find((member) => member.id === milestone.createdBy)?.name}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Last Updated</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(milestone.updatedAt).toLocaleDateString()} by {project?.members.find((member) => member.id === milestone.updatedBy)?.name}
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
              <input
                type="date"
                name="startDate"
                value={milestoneData.startDate}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {milestoneData.startDate}
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
              <input
                type="date"
                name="endDate"
                value={milestoneData.endDate}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {milestoneData.endDate}
              </p>
            )}
          </div>
        </div>
      </Accordion>

      {/* Progress & tasks Accordian */}
      <Accordion
        title={`Progress & Tasks (${milestoneData.subtasks.filter(st => st.status === "done").length}/${milestoneData.subtasks.length})`}
        icon={FileCheck}
        defaultOpen
      >
        <div className="space-y-4">
          <div className="bg-component-secondary-background border border-component-border p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-point-color-indigo rounded-full" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            {milestoneData.subtasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-6">
                <span className="text-text-secondary">하위 작업이 없습니다.</span>
              </div>
            ) : (
              milestoneData.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex flex-col bg-component-secondary-background border border-component-border p-3 rounded-lg">
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      readOnly
                      checked={
                        subtask.subtasks.length > 0 &&
                        subtask.subtasks.every((st) => st.completed) ||
                        subtask.status === 'done'
                      }
                      className='rounded bg-component-secondary-background border-component-border'
                    />
                    <span className={`text-sm cursor-pointer hover:text-blue-400 ${subtask.subtasks.length > 0 && subtask.subtasks.every(st => st.completed) || subtask.status === 'done' ?
                      'text-text-secondary line-through' : 'text-text-primary'
                      }`}
                      onClick={() => handleTaskClick(subtask.id)}
                    >
                      {subtask.title}
                    </span>
                  </div>
                  <div className="ml-8 mt-2">
                    {
                      subtask.subtasks.map((sub, idx) => (
                        <div key={idx} className='space-x-2'>
                          <input
                            type="checkbox"
                            readOnly
                            checked={sub.completed}
                            className='rounded bg-component-secondary-background border-component-border'
                          />
                          <span className={`text-sm ${sub.completed ? 'text-text-secondary line-through' : 'text-text-primary'}`}>{sub.title}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Accordion>

      {/* Assignees Accordian */}
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
                  {milestoneData.assignee?.length ?? 0 > 0
                    ? `${milestoneData.assignee?.length}명`
                    : "없음"}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project?.members.map((member) => {
                  const isSelected = milestoneData.assignee?.some(
                    (a) => a.id === member.id
                  );
                  return (
                    <div
                      key={member.id}
                      onClick={() => {
                        if (isSelected) {
                          if (
                            milestoneData.assignee?.length &&
                            milestoneData.assignee?.length > 1
                          ) {
                            setMilestoneData({
                              ...milestoneData,
                              assignee: milestoneData.assignee?.filter(
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
                          setMilestoneData({
                            ...milestoneData,
                            assignee: [...(milestoneData.assignee ?? []), member],
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
                                width={40}
                                height={40}
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
                  {milestoneData.assignee?.length ?? 0 > 0
                    ? `${milestoneData.assignee?.length}명`
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
                {milestoneData?.assignee?.map((assi) => (
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

      {/* Tags Accordian */}
      <Accordion
        title="Tags & Labels"
        icon={Tag}
      >
        <div className="flex flex-wrap gap-2 py-1">
          {isEditing === "tags" ? (
            <>
              {milestoneData.tags.map((tag, index) => (
                <Badge
                  key={index}
                  content={tag}
                  color="pink"
                  isEditable={true}
                  onRemove={() => handleRemoveTag(index)}
                />
              ))}
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  placeholder="새 태그 추가"
                  className="px-2 rounded-md bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
                />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 group relative">
              {milestoneData?.tags.map((tag, index) => (
                <Badge key={index} content={tag} color="pink" />
              ))}
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() =>
                  isEditing === "tags" ? handleEdit("none") : handleEdit("tags")
                }
              />
            </div>
          )}
        </div>
      </Accordion>
    </ModalTemplete>
  );
}

