import ModalTemplete from "@/components/ModalTemplete";
import { useState, KeyboardEvent, useEffect } from "react";
import { InfoCircle, CalendarWeek, Layers, UsersGroup, MapPin, AngleLeft, AngleRight } from "flowbite-react-icons/outline";
import { useAuthStore } from "@/auth/authStore";
import DatePicker from "@/components/ui/DatePicker";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { createProject } from '@/hooks/getProjectData';
import { updateProjectMember } from '@/hooks/getMemberData';
import SubmitBtn from "@/components/ui/SubmitBtn";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const [step, setStep] = useState(1);

  const totalSteps = 5
  const progress = (step / totalSteps) * 100

  const stepIcons = [InfoCircle, CalendarWeek, Layers, UsersGroup, MapPin]
  const stepTitles = ["Basic Info", "Timeline", "Category", "Team", "Presence"]

  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    leader_id: user?.id,
    projectType: '',
    roles: [] as string[],
    techStack: [] as string[],
    location: '',
    teamSize: 1,
    startDate: '',
    endDate: '',
  });

  const [roleInput, setRoleInput] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      setDateError(new Date(formData.endDate) < new Date(formData.startDate));
    } else {
      setDateError(false);
    }
  }, [formData.startDate, formData.endDate]);

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

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // New functions to handle role and tech stack inputs
  const handleRoleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoleInput(e.target.value);
  };

  const handleTechStackInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTechStackInput(e.target.value);
  };

  const handleKeyDown = (type: "role" | "techStack", e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();

      if (type === "role") {
        const trimmedInput = roleInput.trim();
        if (trimmedInput && !formData.roles.includes(trimmedInput)) {
          const updatedRoles = [...formData.roles, trimmedInput];
          setFormData({ ...formData, roles: updatedRoles });
          setRoleInput("");
        }
      } else if (type === "techStack") {
        const trimmedInput = techStackInput.trim();
        if (trimmedInput && !formData.techStack.includes(trimmedInput)) {
          const updatedTechStack = [...formData.techStack, trimmedInput];
          setFormData({ ...formData, techStack: updatedTechStack });
          setTechStackInput("");
        }
      }
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    const updatedRoles = formData.roles.filter(role => role !== roleToRemove);
    setFormData({ ...formData, roles: updatedRoles });
  };

  const handleRemoveTechStack = (techToRemove: string) => {
    const updatedTechStack = formData.techStack.filter(tech => tech !== techToRemove);
    setFormData({ ...formData, techStack: updatedTechStack });
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
      try {
        setSubmitStatus('submitting');
        const projectId = await createProject({ ...formData, leader_id: user.id });
        await updateProjectMember(projectId, user.id);
        useAuthStore.getState().setAlert("프로젝트가 생성되었습니다.", "success");
        setSubmitStatus('success');

        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error(error);
        useAuthStore.getState().setAlert("프로젝트 생성에 실패했습니다. 관리자에게 문의해주세요.", "error");
        setSubmitStatus('error');
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
        if (!formData.startDate || !formData.endDate) {
          useAuthStore.getState().setAlert("시작일과 종료일을 입력해주세요.", "error");
          return;
        }
        break;
      case 3:
        if (!formData.projectType) {
          useAuthStore.getState().setAlert("프로젝트 유형을 선택해주세요.", "error");
          return;
        }
        break;
      case 4:
        if (!formData.roles.length || !formData.techStack.length) {
          useAuthStore.getState().setAlert("역할과 기술 스택을 입력해주세요.", "error");
          return;
        }
        break;
      case 5:
        if (!formData.location || !formData.teamSize) {
          useAuthStore.getState().setAlert("위치와 팀 규모를 입력해주세요.", "error");
          return;
        }
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
        <SubmitBtn
          submitStatus={submitStatus}
          onClick={handleSubmit}
          buttonText="프로젝트 생성"
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
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                  >
                    프로젝트 이름 <span className="text-point-color-purple ml-1">*</span>
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
                    프로젝트 설명
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
                <div className="space-y-2">
                  <label
                    htmlFor="projectType"
                    className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                  >
                    프로젝트 유형 <span className="text-point-color-purple ml-1">*</span>
                  </label>
                  <Select
                    value={formData.projectType}
                    onChange={(value) => handleSelectChange("projectType", value as string)}
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
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-input-border hover:border-input-border-hover focus:border-point-color-indigo focus:outline-none transition-colors"
                    dropDownClassName="!w-full"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <UsersGroup className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Team</h3>
                  <p className="text-text-secondary">Who is on this project?</p>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="roles"
                    className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                  >
                    필요한 역할 <span className="text-point-color-purple ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="roles"
                    name="roles"
                    value={roleInput}
                    onChange={handleRoleInput}
                    onKeyDown={(e) => handleKeyDown("role", e)}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-input-border hover:border-input-border-hover focus:border-point-color-indigo focus:outline-none transition-colors"
                    placeholder="역할을 입력하고 Enter 키를 누르세요"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.roles.map((role, index) => (
                      <Badge key={index} content={role} color="purple" isEditable={true} onRemove={() => handleRemoveRole(role)} />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="techStack"
                    className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                  >
                    필요한 기술 <span className="text-point-color-purple ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="techStack"
                    name="techStack"
                    value={techStackInput}
                    onChange={handleTechStackInput}
                    onKeyDown={(e) => handleKeyDown("techStack", e)}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-input-border hover:border-input-border-hover focus:border-point-color-indigo focus:outline-none transition-colors"
                    placeholder="기술을 입력하고 Enter 키를 누르세요"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.techStack.map((tech, index) => (
                      <Badge key={index} content={tech} color="orange" isEditable={true} onRemove={() => handleRemoveTechStack(tech)} />
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
                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                  >
                    위치 <span className="text-point-color-purple ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-input-border hover:border-input-border-hover focus:border-point-color-indigo focus:outline-none transition-colors"
                    placeholder="예) 원격, 서울"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="teamSize"
                    className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                  >
                    인원 수 <span className="text-point-color-purple ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    id="teamSize"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleChange}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-input-border hover:border-input-border-hover focus:border-point-color-indigo focus:outline-none transition-colors placeholder:text-text-secondary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="5"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalTemplete>
  );
}
