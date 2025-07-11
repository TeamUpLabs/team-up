import ModalTemplete from "@/components/ModalTemplete";
import { useState, useEffect } from "react";
import {
  ClipboardList,
  AngleLeft,
  AngleRight,
  InfoCircle,
  CalendarWeek,
  Users,
  Tag,
  FileLines
} from "flowbite-react-icons/outline";
import { TaskCreateFormData, blankTaskCreateFormData } from "@/types/Task";
import { CloseCircle } from "flowbite-react-icons/solid";
import { useProject } from "@/contexts/ProjectContext";
import { useAuthStore } from "@/auth/authStore";
import { createTask } from "@/hooks/getTaskData";
import DatePicker from "@/components/ui/DatePicker";
import Select from "@/components/ui/Select";

import AssigneeSelect from "@/components/project/AssigneeSelect";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";


interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone_id: number | null;
}

export default function TaskCreateModal({
  isOpen,
  onClose,
  milestone_id,
}: TaskCreateModalProps) {

  const [step, setStep] = useState(1);

  const totalSteps = 5
  const progress = (step / totalSteps) * 100

  const stepIcons = [InfoCircle, CalendarWeek, FileLines, Tag, Users]
  const stepTitles = ["Basic Info", "Timeline", "Subtasks", "Tags & Priority", "Assignee"]

  const { project } = useProject();
  const [formData, setFormData] = useState<TaskCreateFormData>(blankTaskCreateFormData);
  const [subtasksInput, setSubtasksInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Helper to format Date to YYYY-MM-DD string
  const formatDateToString = (date: Date | undefined): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper to parse YYYY-MM-DD string to Date object (local timezone)
  const parseStringToDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed for Date constructor
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day); // Interprets as local date
      }
    }
    return undefined;
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setFormData(prevData => ({
      ...prevData,
      start_date: date ? formatDateToString(date) : "",
    }));
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setFormData(prevData => ({
      ...prevData,
      due_date: date ? formatDateToString(date) : "",
    }));
  };

  useEffect(() => {
    if (formData.start_date && formData.due_date) {
      setDateError(new Date(formData.due_date) < new Date(formData.start_date));
    } else {
      setDateError(false);
    }
  }, [formData.start_date, formData.due_date]);

  const handleSelectChange = (name: string, value: string | string[]) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    let hasError = false;

    if (dateError) {
      hasError = true;
    }

    if (hasError) {
      return;
    }

    if (formData.assignee_ids.length === 0) {
      useAuthStore.getState().setAlert("최소 한 명의 담당자는 필요합니다.", "error");
      return;
    }

    if (!project?.id) {
      console.error("Project ID is missing. Cannot create task.")
      useAuthStore.getState().setAlert("프로젝트 정보를 찾을 수 없습니다. 페이지를 새로고침하거나 문제가 지속되면 관리자에게 문의해주세요.", "error")
      return;
    }

    console.log("formData", {
      ...formData,
      project_id: project.id,
      milestone_id: milestone_id ?? 0,
      created_by: useAuthStore.getState().user?.id || 0,
      estimated_hours: Math.floor((formData.due_date ? new Date(formData.due_date).getTime() - new Date(formData.start_date).getTime() : 0) / (24 * 60 * 60 * 1000)),
      subtasks: formData.subtasks.map(subtask => ({
        title: subtask.title,
        is_completed: false,
      })),
      assignee_ids: formData.assignee_ids,
    })

    if (project?.id) {
      setSubmitStatus('submitting');
      try {
        await createTask({
          ...formData,
          project_id: project.id,
          milestone_id: milestone_id ?? 0,
          created_by: useAuthStore.getState().user?.id || 0,
          estimated_hours: Math.floor((formData.due_date ? new Date(formData.due_date).getTime() - new Date(formData.start_date).getTime() : 0) / (24 * 60 * 60 * 1000)),
          subtasks: formData.subtasks.map(subtask => ({
            title: subtask.title,
            is_completed: false,
          })),
          assignee_ids: formData.assignee_ids,
        });
        setSubmitStatus('success');
        useAuthStore.getState().setAlert("작업이 성공적으로 생성되었습니다.", "success");
        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (error) {
        console.error(error);
        setSubmitStatus('error');
        useAuthStore.getState().setAlert("작업 생성에 실패했습니다. 관리자에게 문의해주세요.", "error");
      } finally {
        setTimeout(() => {
          onClose();
          setFormData(blankTaskCreateFormData);
          setStep(1);
          setSubmitStatus('idle');
        }, 1000);
      }
    }
  };

  const handleKeyDown = (type: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();

      if (type === "subtasks") {
        const trimmedInput = subtasksInput.trim();
        if (trimmedInput && !formData.subtasks.some(subtask => subtask.title === trimmedInput)) {
          const updatedSubtasks = [...formData.subtasks, { title: trimmedInput, is_completed: false }];
          setFormData({ ...formData, subtasks: updatedSubtasks });
          setSubtasksInput("");
        }
      }
    }
  };


  const handleRemoveSubtask = (subtaskTitle: string) => {
    const updatedSubtasks = formData.subtasks.filter((s) => s.title !== subtaskTitle);
    setFormData({ ...formData, subtasks: updatedSubtasks });
  };

  const toggleAssignee = (memberId: number) => {
    setFormData((prev) => {
      if (prev.assignee_ids.includes(memberId)) {
        return {
          ...prev,
          assignee_ids: prev.assignee_ids.filter((id) => id !== memberId),
        };
      } else {
        return {
          ...prev,
          assignee_ids: [...prev.assignee_ids, memberId],
        };
      }
    });
  };

  const isAssigned = (memberId: number) => {
    return formData.assignee_ids.includes(memberId);
  };

  const moveNextStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.title) {
          useAuthStore
            .getState()
            .setAlert("작업 이름을 입력해주세요.", "error");
          return;
        }
        break;
      case 2:
        if (!formData.start_date || !formData.due_date) {
          useAuthStore
            .getState()
            .setAlert("시작일과 종료일을 입력해주세요.", "error");
          return;
        }
        break;
      case 4:
        if (!formData.priority) {
          useAuthStore
            .getState()
            .setAlert("우선순위를 선택해주세요.", "error");
          return;
        }
        break;
    }
    setStep(step + 1);
  };

  const modalHeader = (
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-100">
        <ClipboardList
          className="text-text-primary text-lg"
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-text-primary">
          새로운 작업 추가
        </h3>
        <p className="text-sm text-point-color-indigo mt-0.5">
          프로젝트 작업을 관리하세요
        </p>
      </div>
    </div>
  )

  const modalFooter = (
    <div className="flex justify-between">
      <button
        type="button"
        className="flex items-center gap-2 border border-component-border px-4 py-2 rounded-lg cursor-pointer active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setStep(step - 1)}
        disabled={step === 1}
      >
        <AngleLeft className="h-4 w-4" />
        이전
      </button>

      {step < totalSteps ? (
        <button
          type="button"
          className="flex items-center gap-2 bg-point-color-indigo text-white px-4 py-2 rounded-lg cursor-pointer active:scale-95 transition-all"
          onClick={() => moveNextStep(step)}
          disabled={step === totalSteps}
        >
          다음
          <AngleRight className="h-4 w-4" />
        </button>
      ) : (
        <SubmitBtn
          submitStatus={submitStatus}
          onClick={handleSubmit}
          buttonText="작업 생성"
          successText="생성 완료"
          errorText="생성 실패"
        />
      )}
    </div>
  )

  return (
    <ModalTemplete
      isOpen={isOpen}
      onClose={onClose}
      header={modalHeader}
      footer={modalFooter}
    >
      <div className="flex flex-col">
        <div className="space-y-2">
          <div className="w-full h-4 bg-component-secondary-background rounded-full">
            <div className="h-full bg-point-color-indigo rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-sm text-text-secondary">
            {stepTitles.map((title, index) => {
              const Icon = stepIcons[index]
              return (
                <div
                  key={title}
                  className={`flex items-center gap-1 ${step === index + 1 ? "text-text-primary font-medium" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  {title}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col justify-center min-h-[300px] py-6">
          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <InfoCircle className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <p className="text-text-secondary">Let&apos;s start with the essentials</p>
                </div>
                <Input
                  type="text"
                  label="작업 이름"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="!px-3 !py-2"
                  placeholder="작업 이름을 입력하세요"
                  isRequired
                />
                <TextArea
                  id="description"
                  name="description"
                  label="설명"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="작업 설명을 입력하세요"
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <CalendarWeek className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Timeline</h3>
                  <p className="text-text-secondary">When will this milestone happen?</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <DatePicker
                      label="시작일"
                      value={formData.start_date ? parseStringToDate(formData.start_date) : undefined}
                      onChange={handleStartDateChange}
                      placeholder="시작일 선택"
                      className="w-full bg-input-background"
                      minDate={milestone_id ? parseStringToDate(project?.milestones.find((milestone) => milestone.id === milestone_id)?.start_date || "") : undefined}
                      maxDate={milestone_id ? parseStringToDate(project?.milestones.find((milestone) => milestone.id === milestone_id)?.due_date || "") : undefined}
                    />
                  </div>
                  <div className="space-y-2">
                    <DatePicker
                      label="종료일"
                      value={formData.due_date ? parseStringToDate(formData.due_date) : undefined}
                      onChange={handleEndDateChange}
                      placeholder="종료일 선택"
                      className="w-full bg-input-background"
                      minDate={formData.start_date ? parseStringToDate(formData.start_date) : undefined}
                      maxDate={milestone_id ? parseStringToDate(project?.milestones.find((milestone) => milestone.id === milestone_id)?.due_date || "") : undefined}
                    />
                    {dateError && (
                      <p className="text-sm text-red-500 mt-1">
                        종료일은 시작일보다 빠를 수 없습니다.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <FileLines className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">SubTasks</h3>
                  <p className="text-text-secondary">Add subtasks to this task</p>
                </div>
                <div className="space-y-2">
                  <Input
                    type="text"
                    id="subtasks"
                    name="subtasks"
                    label="하위 작업"
                    value={subtasksInput}
                    onChange={(e) => setSubtasksInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown("subtasks", e)}
                    className="!px-3 !py-2"
                    placeholder="하위 작업을 입력하고 Enter 키를 누르세요"
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                  />

                  <div className="mt-2 flex flex-col gap-2">
                    {formData.subtasks.map((subtask, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2 bg-point-color-indigo/20 px-3 py-2 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={false}
                            readOnly
                            className="rounded"
                          />
                          <span className="text-text-secondary">{subtask.title}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(subtask.title)}
                          className="text-point-color-indigo hover:text-point-color-indigo-hover ml-1 focus:outline-none"
                        >
                          <CloseCircle />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Tag className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Tags & Priority</h3>
                  <p className="text-text-secondary">Add tags and set priority</p>
                </div>
                <Select
                  options={[
                    { name: "priority", value: "low", label: "낮음" },
                    { name: "priority", value: "medium", label: "중간" },
                    { name: "priority", value: "high", label: "높음" },
                  ]}
                  value={formData.priority}
                  onChange={(value) => handleSelectChange("priority", value as string)}
                  dropDownClassName="!w-full"
                  label="우선순위"
                  isRequired
                />
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Users className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Assignee</h3>
                  <p className="text-text-secondary">Assign this task to a team member</p>
                </div>
                <div className="px-1">
                  <AssigneeSelect
                    selectedAssignee={formData.assignee_ids}
                    assignee={project?.milestones?.find((milestone) => formData.milestone_id === milestone.id)?.assignees || project?.members?.map(member => member.user) || []}
                    toggleAssignee={toggleAssignee}
                    isAssigned={isAssigned}
                    label="담당자"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalTemplete>
  )
}
