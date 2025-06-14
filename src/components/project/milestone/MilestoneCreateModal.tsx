import { useState, useEffect } from "react";
import {
  AngleLeft,
  AngleRight,
  InfoCircle,
  CalendarWeek,
  Flag,
  Star,
  Tag,
  Users
} from "flowbite-react-icons/outline";
import { useProject } from "@/contexts/ProjectContext";
import { createMilestone } from "@/hooks/getMilestoneData";
import { useAuthStore } from "@/auth/authStore";
import ModalTemplete from "@/components/ModalTemplete";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import AssigneeSelect from "@/components/project/AssigneeSelect";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { useTheme } from "@/contexts/ThemeContext";
import { formatDateToString, parseStringToDate } from "@/utils/dateUtils";

interface MilestoneCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MilestoneCreateModal({
  isOpen,
  onClose,
}: MilestoneCreateModalProps) {
  const [step, setStep] = useState(1);
  const { isDark } = useTheme();

  const totalSteps = 5
  const progress = (step / totalSteps) * 100

  const stepIcons = [InfoCircle, CalendarWeek, Star, Tag, Users]
  const stepTitles = ["Basic Info", "Timeline", "Status & Priority", "Tags & Labels", "Assignee"]

  const { project } = useProject();
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    project_id: project?.id || "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
    priority: "",
    tags: [] as string[],
    assignee_id: [] as number[],
    createdBy: user?.id || 0,
    updatedBy: user?.id || 0,
  });
  const [tagsInput, setTagsInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const [priorityError, setPriorityError] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      setDateError(new Date(formData.endDate) < new Date(formData.startDate));
    } else {
      setDateError(false);
    }
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = async () => {
    let hasError = false;

    if (!project?.id) {
      console.error("Project ID is missing. Cannot create milestone.")
      useAuthStore.getState().setAlert("프로젝트 정보를 찾을 수 없습니다. 페이지를 새로고침하거나 문제가 지속되면 관리자에게 문의해주세요.", "error")
      return;
    }

    if (dateError) {
      hasError = true;
    }

    if (formData.status === "") {
      setStatusError(true);
      hasError = true;
    } else {
      setStatusError(false);
    }

    if (formData.priority === "") {
      setPriorityError(true);
      hasError = true;
    } else {
      setPriorityError(false);
    }

    if (formData.assignee_id.length === 0) {
      useAuthStore.getState().setAlert("최소 한 명의 담당자는 필요합니다.", "error");
      return;
    }

    if (hasError) {
      return;
    }

    if (project?.id) {
      try {
        setSubmitStatus('submitting');
        await createMilestone(project.id, formData);
        useAuthStore.getState().setAlert("마일스톤이 성공적으로 생성되었습니다.", "success");
        setSubmitStatus('success');

        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (error) {
        console.error(error);
        setSubmitStatus('error');
        useAuthStore.getState().setAlert("마일스톤 생성에 실패했습니다. 관리자에게 문의해주세요.", "error");
      } finally {
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 1000);
      }
    }
  };

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

    // Reset errors when user changes values
    if (name === "status") {
      setStatusError(false);
    }
    if (name === "priority") {
      setPriorityError(false);
    }
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

  const handleKeyDown = (type: "tags", e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();

      const trimmedInput = tagsInput.trim();
      if (trimmedInput && !formData.tags.includes(trimmedInput)) {
        const updatedTags = [...formData.tags, trimmedInput];
        setFormData({ ...formData, tags: updatedTags });
        setTagsInput("");
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
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
          useAuthStore.getState().setAlert("마일스톤 이름을 입력해주세요.", "error");
          return;
        }
        break;
      case 2:
        if (!formData.startDate || !formData.endDate) {
          useAuthStore.getState().setAlert("시작일과 종료일을 입력해주세요.", "error");
          return;
        }
        break;
      case 3:
        if (!formData.status || !formData.priority) {
          useAuthStore.getState().setAlert("상태와 우선순위를 선택해주세요.", "error");
          return;
        }
        break;
    }
    setStep(step + 1);
  };

  // Header content for the modal
  const headerContent = (
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-100">
        <Flag
          className="text-text-primary text-lg"
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-text-primary">
          새로운 마일스톤 추가
        </h3>
        <p className="text-sm text-point-color-indigo mt-0.5">
          프로젝트 마일스톤을 관리하세요
        </p>
      </div>
    </div>
  );

  const footerContent = (
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
          buttonText="마일스톤 생성"
          successText="생성 완료"
          errorText="생성 실패"
        />
      )}
    </div>
  )

  // Form content for the modal
  const formContent = (
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
                label="마일스톤 이름"
                isRequired
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="마일스톤 이름을 입력하세요"
              />
              <TextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="마일스톤 설명을 입력하세요"
                label="마일스톤 설명"
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
                  />
                </div>
                <div className="space-y-2">
                  <DatePicker
                    label="종료일"
                    isRequired
                    value={formData.endDate ? parseStringToDate(formData.endDate) : undefined}
                    onChange={handleEndDateChange}
                    placeholder="종료일 선택"
                    className="w-full bg-input-background"
                    minDate={formData.startDate ? parseStringToDate(formData.startDate) : undefined}
                    maxDate={project?.endDate ? parseStringToDate(project.endDate) : undefined}
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
                <Flag className="h-12 w-12 mx-auto text-primary mb-2" />
                <h3 className="text-lg font-semibold">Status & Priority</h3>
                <p className="text-text-secondary">Select status and priority to this milestone</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Select
                    options={[
                      { name: "status", value: "not-started", label: "준비" },
                      { name: "status", value: "in-progress", label: "진행중" },
                      { name: "status", value: "done", label: "완료" },
                    ]}
                    value={formData.status}
                    onChange={(value) => handleSelectChange("status", value as string)}
                    dropDownClassName="!w-full"
                    placeholder="상태를 선택해주세요"
                    label="상태"
                    isRequired
                  />
                  {statusError && (
                    <p className="text-red-500 text-sm mt-2">상태를 선택해주세요.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Select
                    options={[
                      { name: "priority", value: "low", label: "낮음" },
                      { name: "priority", value: "medium", label: "중간" },
                      { name: "priority", value: "high", label: "높음" },
                    ]}
                    value={formData.priority}
                    onChange={(value) => handleSelectChange("priority", value as string)}
                    dropDownClassName="!w-full"
                    placeholder="우선순위를 선택해주세요"
                    label="우선순위"
                    isRequired
                  />
                  {priorityError && (
                    <p className="text-red-500 text-sm mt-2">
                      우선순위를 선택해주세요.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Tag className="h-12 w-12 mx-auto text-primary mb-2" />
                <h3 className="text-lg font-semibold">Tag</h3>
                <p className="text-text-secondary">Add tags</p>
              </div>
              <div className="space-y-2">
                <Input
                  type="text"
                  label="태그"
                  id="tags"
                  name="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown("tags", e)}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  className="w-full px-3 py-2 rounded-md bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
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
                      isDark={isDark}
                    />
                  ))}
                </div>
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
              <div className="px-1">
                <AssigneeSelect
                  selectedAssignee={formData.assignee_id}
                  assignee={project?.members || []}
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
  );

  return (
    <ModalTemplete
      isOpen={isOpen}
      onClose={onClose}
      header={headerContent}
      footer={footerContent}
    >
      {formContent}
    </ModalTemplete>
  );
}
