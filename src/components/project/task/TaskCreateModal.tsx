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
import { CloseCircle } from "flowbite-react-icons/solid";
import { useProject } from "@/contexts/ProjectContext";
import { useAuthStore } from "@/auth/authStore";
import { createTask } from "@/hooks/getTaskData";
import DatePicker from "@/components/ui/DatePicker";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import AssigneeSelect from "@/components/project/AssigneeSelect";

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
  const [formData, setFormData] = useState({
    project_id: project?.id,
    title: "",
    description: "",
    status: "not-started",
    startDate: "",
    endDate: "",
    assignee_id: [] as number[],
    tags: [] as string[],
    priority: "medium",
    subtasks: [] as string[],
    milestone_id: milestone_id,
    createdBy: useAuthStore.getState().user?.id || 0,
    updatedBy: useAuthStore.getState().user?.id || 0,
  });
  const [tagsInput, setTagsInput] = useState("");
  const [subtasksInput, setSubtasksInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [dateError, setDateError] = useState(false);

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
      startDate: date ? formatDateToString(date) : "",
    }));
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setFormData(prevData => ({
      ...prevData,
      endDate: date ? formatDateToString(date) : "",
    }));
  };

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      setDateError(new Date(formData.endDate) < new Date(formData.startDate));
    } else {
      setDateError(false);
    }
  }, [formData.startDate, formData.endDate]);

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

    if (formData.assignee_id.length === 0) {
      useAuthStore
        .getState()
        .setAlert("최소 한 명의 담당자는 필요합니다.", "error");
      return;
    }

    if (project?.id) {
      try {
        await createTask(project.id, {
          ...formData,
          project_id: project.id,
          milestone_id: milestone_id ?? 0,
        });
        useAuthStore
          .getState()
          .setAlert("작업이 성공적으로 생성되었습니다.", "success");

        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (error) {
        console.error(error);
        useAuthStore
          .getState()
          .setAlert(
            "작업 생성에 실패했습니다. 관리자에게 문의해주세요.",
            "error"
          );
      }
    }
  };

  const handleKeyDown = (
    type: "tags" | "subtasks",
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();

      if (type === "tags") {
        const trimmedInput = tagsInput.trim();
        if (trimmedInput && !formData.tags.includes(trimmedInput)) {
          const updatedTags = [...formData.tags, trimmedInput];
          setFormData({ ...formData, tags: updatedTags });
          setTagsInput("");
        }
      } else if (type === "subtasks") {
        const trimmedInput = subtasksInput.trim();
        if (trimmedInput && !formData.subtasks.includes(trimmedInput)) {
          const updatedSubtasks = [...formData.subtasks, trimmedInput];
          setFormData({ ...formData, subtasks: updatedSubtasks });
          setSubtasksInput("");
        }
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updatedTags = formData.tags.filter((t) => t !== tag);
    setFormData({ ...formData, tags: updatedTags });
  };

  const handleRemoveSubtask = (subtask: string) => {
    const updatedSubtasks = formData.subtasks.filter((s) => s !== subtask);
    setFormData({ ...formData, subtasks: updatedSubtasks });
  };

  const toggleAssignee = (memberId: number) => {
    setFormData((prev) => {
      if (prev.assignee_id.includes(memberId)) {
        return {
          ...prev,
          assignee_id: prev.assignee_id.filter((id) => id !== memberId),
        };
      } else {
        return {
          ...prev,
          assignee_id: [...prev.assignee_id, memberId],
        };
      }
    });
  };

  const isAssigned = (memberId: number) => {
    return formData.assignee_id.includes(memberId);
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
        if (!formData.startDate || !formData.endDate) {
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
          className="text-primary-600 text-lg"
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
        className="flex items-center gap-2 border border-component-border px-4 py-2 rounded-lg cursor-pointer active:scale-95 transition-all"
        onClick={() => setStep(step - 1)}
        disabled={step === 1}
      >
        <AngleLeft className="h-4 w-4" />
        Previous
      </button>

      {step < totalSteps ? (
        <button
          type="button"
          className="flex items-center gap-2 bg-point-color-indigo text-white px-4 py-2 rounded-lg cursor-pointer active:scale-95 transition-all"
          onClick={() => moveNextStep(step)}
          disabled={step === totalSteps}
        >
          Next
          <AngleRight className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="button"
          className="flex items-center gap-2 bg-point-color-indigo text-white px-4 py-2 rounded-lg cursor-pointer active:scale-95 transition-all"
          onClick={handleSubmit}
        >Create Task</button>
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
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                  >
                    작업 이름 <span className="text-point-color-purple ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
                    placeholder="작업 이름을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                  >
                    설명
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="resize-none w-full px-3 py-2 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
                    placeholder="작업 설명을 입력하세요"
                  />
                </div>
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
                    <label
                      htmlFor="startDate"
                      className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                    >
                      시작일 <span className="text-point-color-purple ml-1">*</span>
                    </label>
                    <DatePicker
                      value={formData.startDate ? parseStringToDate(formData.startDate) : undefined}
                      onChange={handleStartDateChange}
                      placeholder="시작일 선택"
                      className="w-full bg-input-background"
                      minDate={milestone_id ? parseStringToDate(project?.milestones.find((milestone) => milestone.id === milestone_id)?.startDate || "") : undefined}
                      maxDate={milestone_id ? parseStringToDate(project?.milestones.find((milestone) => milestone.id === milestone_id)?.endDate || "") : undefined}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="endDate"
                      className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                    >
                      종료일 <span className="text-point-color-purple ml-1">*</span>
                    </label>
                    <DatePicker
                      value={formData.endDate ? parseStringToDate(formData.endDate) : undefined}
                      onChange={handleEndDateChange}
                      placeholder="종료일 선택"
                      className="w-full bg-input-background"
                      minDate={formData.startDate ? parseStringToDate(formData.startDate) : undefined}
                      maxDate={milestone_id ? parseStringToDate(project?.milestones.find((milestone) => milestone.id === milestone_id)?.endDate || "") : undefined}
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
                  <label
                    htmlFor="subtasks"
                    className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                  >
                    하위 작업
                  </label>
                  <input
                    type="text"
                    id="subtasks"
                    name="subtasks"
                    value={subtasksInput}
                    onChange={(e) => setSubtasksInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown("subtasks", e)}
                    className="w-full px-3 py-2 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
                    placeholder="하위 작업을 입력하고 Enter 키를 누르세요"
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
                          <span className="text-text-secondary">{subtask}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(subtask)}
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
                <div className="space-y-2">
                  <label
                    htmlFor="tags"
                    className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                  >
                    태그
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown("tags", e)}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    className="w-full px-3 py-2 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
                    placeholder="태그를 입력하고 Enter 키를 누르세요"
                  />

                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        content={tag}
                        color="pink"
                        isEditable={true}
                        onRemove={() => handleRemoveTag(tag)}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="priority"
                    className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                  >
                    우선순위 <span className="text-point-color-purple ml-1">*</span>
                  </label>
                  <Select
                    options={[
                      { name: "priority", value: "low", label: "낮음" },
                      { name: "priority", value: "medium", label: "중간" },
                      { name: "priority", value: "high", label: "높음" },
                    ]}
                    value={formData.priority}
                    onChange={(value) => handleSelectChange("priority", value as string)}
                    className="w-full px-3 py-2 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
                    dropDownClassName="!w-full"
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Users className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Assignee</h3>
                  <p className="text-text-secondary">Assign this task to a team member</p>
                </div>
                <div className="space-y-2 px-1">
                  <label
                    htmlFor="assignee"
                    className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                  >
                    담당자 <span className="text-point-color-purple ml-1">*</span>
                  </label>
                  <AssigneeSelect
                    selectedAssignee={formData.assignee_id}
                    assignee={project?.milestones?.find((milestone) => formData.milestone_id === milestone.id)?.assignee || []}
                    toggleAssignee={toggleAssignee}
                    isAssigned={isAssigned}
                    label="선택된 담당자"
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
