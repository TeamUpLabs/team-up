import ModalTemplete from "@/components/ModalTemplete";
import { useState, KeyboardEvent, useEffect } from "react";
import { InfoCircle, CalendarWeek, Layers, Tag, MapPin, AngleLeft, AngleRight } from "flowbite-react-icons/outline";
import { useAuthStore } from "@/auth/authStore";
import DatePicker from "@/components/ui/DatePicker";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { createProject } from '@/hooks/getProjectData';
import { updateProjectMember } from '@/hooks/getMemberData';
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { ProjectFormData, blankProjectFormData } from "@/types/Project";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const [step, setStep] = useState(1);

  const totalSteps = 5
  const progress = (step / totalSteps) * 100

  const stepIcons = [InfoCircle, CalendarWeek, Layers, Tag, MapPin]
  const stepTitles = ["Basic Info", "Timeline", "Category", "Tags", "Presence"]

  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState<ProjectFormData>(blankProjectFormData);

  const [tagInput, setTagInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      setDateError(new Date(formData.end_date) < new Date(formData.start_date));
    } else {
      setDateError(false);
    }
  }, [formData.start_date, formData.end_date]);

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
      end_date: date ? formatDateToString(date) : "",
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // New functions to handle tag inputs
  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleKeyDown = (type: "tags", e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();

      if (type === "tags") {
        const trimmedInput = tagInput.trim();
        if (trimmedInput && !formData.tags.includes(trimmedInput)) {
          const updatedTags = [...formData.tags, trimmedInput];
          setFormData({ ...formData, tags: updatedTags });
          setTagInput("");
        }
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = formData.tags.filter(tag => tag !== tagToRemove);
    setFormData({ ...formData, tags: updatedTags });
  };

  const handleSubmit = async () => {
    let hasError = false;

    if (dateError) {
      hasError = true;
    }

    if (hasError) {
      return;
    }

    if (user?.id) {
      setSubmitStatus('submitting');
      try {
        const projectId = await createProject(formData);
        await updateProjectMember(projectId, user.id);
        setSubmitStatus('success');
        useAuthStore.getState().setAlert("프로젝트가 생성되었습니다.", "success");
      } catch (error) {
        console.error(error);
        setSubmitStatus('error');
        useAuthStore.getState().setAlert("프로젝트 생성에 실패했습니다. 관리자에게 문의해주세요.", "error");
      } finally {
        setTimeout(() => {
          onClose();
          setFormData(blankProjectFormData);
          setSubmitStatus('idle');
          window.location.reload();
        }, 1000);
      }
    }
  };

  const moveNextStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.title) {
          useAuthStore.getState().setAlert("프로젝트 이름을 입력해주세요.", "error");
          return;
        }
        break;
      case 2:
        if (!formData.start_date || !formData.end_date) {
          useAuthStore.getState().setAlert("시작일과 종료일을 입력해주세요.", "error");
          return;
        }
        break;
      case 3:
        if (!formData.project_type) {
          useAuthStore.getState().setAlert("프로젝트 유형을 선택해주세요.", "error");
          return;
        }
        break;
      case 4:
        if (!formData.tags.length) {
          useAuthStore.getState().setAlert("태그를 입력해주세요.", "error");
          return;
        }
        break;
      case 5:
        if (!formData.location)
          return;
        break;
    }
    setStep(step + 1);
  };

  const modalHeader = (
    <div>
      <h3 className="text-xl font-bold text-text-primary">새로운 프로젝트 생성</h3>
      <p className="text-point-color-indigo text-sm mt-1">팀원들과 함께할 새로운 프로젝트를 만들어보세요</p>
    </div>
  );

  const modalFooter = (
    <div className="flex justify-between">
      <button
        type="button"
        className="flex items-center gap-2 border border-component-border px-4 py-2 rounded-lg cursor-pointer active:scale-95 transition-all"
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
          buttonText="프로젝트 생성"
          successText="생성 완료"
          errorText="생성 실패"
          withIcon
          fit
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
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="!px-3 !py-2"
                  fullWidth
                  placeholder="작업 이름을 입력하세요"
                  label="프로젝트 이름"
                  isRequired
                />
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="작업 설명을 입력하세요"
                  label="프로젝트 설명"
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
                  <DatePicker
                    label="시작일"
                    isRequired
                    value={formData.start_date ? parseStringToDate(formData.start_date) : undefined}
                    onChange={handleStartDateChange}
                    placeholder="시작일 선택"
                    calendarPosition="bottom"
                  />
                  <div className="space-y-2">
                    <DatePicker
                      label="종료일"
                      isRequired
                      value={formData.end_date ? parseStringToDate(formData.end_date) : undefined}
                      onChange={handleEndDateChange}
                      placeholder="종료일 선택"
                      minDate={formData.start_date ? parseStringToDate(formData.start_date) : undefined}
                      calendarPosition="bottom"
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
                  <Layers className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Category</h3>
                  <p className="text-text-secondary">What is this project about?</p>
                </div>
                <Select
                  label="프로젝트 유형"
                  isRequired
                  value={formData.project_type}
                  onChange={(value) => handleSelectChange("project_type", value as string)}
                  options={[
                    { name: "projectType", value: "웹 개발", label: "웹 개발" },
                    { name: "projectType", value: "프론트엔드 개발", label: "프론트엔드 개발" },
                    { name: "projectType", value: "백엔드 개발", label: "백엔드 개발" },
                    { name: "projectType", value: "모바일 개발", label: "모바일 개발" },
                    { name: "projectType", value: "AI", label: "AI" },
                    { name: "projectType", value: "IoT", label: "IoT" },
                    { name: "projectType", value: "토이", label: "토이 프로젝트" },
                    { name: "projectType", value: "기타", label: "기타" },
                  ]}
                />
                <Select
                  label="상태"
                  isRequired
                  value={formData.status}
                  onChange={(value) => handleSelectChange("status", value as string)}
                  options={[
                    { name: "status", value: "planning", label: "계획" },
                    { name: "status", value: "in_progress", label: "진행 중" },
                    { name: "status", value: "completed", label: "완료" },
                    { name: "status", value: "on_hold", label: "보류" },
                  ]}
                />

                <Select
                  label="공개 여부"
                  isRequired
                  value={formData.visibility}
                  onChange={(value) => handleSelectChange("visibility", value as string)}
                  options={[
                    { name: "visibility", value: "public", label: "공개" },
                    { name: "visibility", value: "private", label: "비공개" },
                  ]}
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Tag className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Tags</h3>
                  <p className="text-text-secondary">What is this project about?</p>
                </div>
                <div className="space-y-2">
                  <Input
                    type="text"
                    id="tags"
                    name="tags"
                    value={tagInput}
                    onChange={handleTagInput}
                    onKeyDown={(e) => handleKeyDown("tags", e)}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    placeholder="태그를 입력하고 Enter 키를 누르세요"
                    label="태그"
                    isRequired
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} content={tag} color="purple" isEditable={true} onRemove={() => handleRemoveTag(tag)} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <MapPin className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Presence</h3>
                  <p className="text-text-secondary">Where will this project happen?</p>
                </div>
                <Input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="예) 원격, 서울"
                  label="위치"
                  isRequired
                />
                <Input
                  type="number"
                  id="team_size"
                  name="team_size"
                  value={formData.team_size}
                  onChange={handleChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  placeholder="인원 수"
                  label="인원 수"
                  isRequired
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalTemplete>
  );
}
