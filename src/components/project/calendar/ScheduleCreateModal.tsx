import { useState, useEffect } from "react";
import ModalTemplete from "@/components/ModalTemplete";
import {
  CalendarMonth,
  CalendarWeek,
  UsersGroup,
  CalendarPlus,
  Layers,
  InfoCircle,
  MapPin,
  Users,
  FilePen,
  Check,
  AngleLeft,
  AngleRight,
  VideoCamera,
  Link
} from "flowbite-react-icons/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { MiniLogo } from "@/components/logo";
import { useProject } from "@/contexts/ProjectContext";
import { useAuthStore } from "@/auth/authStore";
import DateTimePicker from "@/components/ui/DateTimePicker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { getPlatformColor } from "@/utils/getPlatformColor";
import AssigneeSelect from "@/components/project/AssigneeSelect";
import { createSchedule } from "@/hooks/getScheduleData";
import SubmitBtn from "@/components/ui/button/SubmitBtn";

type ScheduleType = "meeting" | "event";
type MeetingPlatform = "Zoom" | "Google Meet" | "TeamUp";

interface ScheduleCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleCreateModal({
  isOpen,
  onClose,
}: ScheduleCreateModalProps) {
  const user = useAuthStore((state) => state.user);
  const { project } = useProject();
  const [step, setStep] = useState(1);

  const totalSteps = 6
  const progress = (step / totalSteps) * 100

  const stepIcons = [Layers, InfoCircle, CalendarWeek, MapPin, Users, FilePen];
  const stepTitles = ["Type", "Basic Info", "Timeline", "Platform", "Assignee", "Memo"];

  const [selectedPlatform, setSelectedPlatform] = useState<MeetingPlatform>();
  const [activeTab, setActiveTab] = useState<ScheduleType>("meeting");
  const [dateError, setDateError] = useState(false);
  const [formData, setFormData] = useState({
    project_id: project?.id || "",
    type: activeTab,
    title: "",
    description: "",
    where: selectedPlatform || "",
    link: "",
    start_time: "",
    end_time: "",
    status: "not-started",
    created_by: user?.id || 0,
    updated_by: user?.id || 0,
    memo: "",
    assignee_id: [] as number[],
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (formData.start_time && formData.end_time) {
      setDateError(new Date(formData.end_time) < new Date(formData.start_time));
    } else {
      setDateError(false);
    }
  }, [formData.start_time, formData.end_time]);

  const handleTabChange = (tabId: ScheduleType) => {
    setActiveTab(tabId);
    setFormData((prev) => ({ ...prev, type: tabId }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlatformSelect = (platform: MeetingPlatform) => {
    setSelectedPlatform(platform);
    setFormData((prev) => ({
      ...prev,
      where: platform,
      link: platform === "TeamUp" ? "" : prev.link,
    }));
  };

  const handleSubmit = async () => {
    if (dateError) {
      console.warn("Date validation error detected, preventing submission.");
      return;
    }

    if (formData.assignee_id.length === 0) {
      useAuthStore.getState().setAlert("참석자를 최소 한 명 이상 선택해주세요.", "error");
      return;
    }

    if (
      selectedPlatform !== "TeamUp" &&
      formData.link === "" &&
      formData.type === "meeting"
    ) {
      useAuthStore.getState().setAlert("외부 화상회의 또는 직접 링크 입력 시 링크를 입력해주세요.", "error");
      return;
    }

    if (!project?.id) {
      console.error("Project ID is missing. Cannot create schedule.");
      useAuthStore.getState().setAlert("프로젝트 정보를 찾을 수 없습니다. 페이지를 새로고침하거나 문제가 지속되면 관리자에게 문의해주세요.", "error");
      return;
    }

    try {
      setSubmitStatus('submitting');
      await createSchedule(project.id, formData);
      useAuthStore.getState().setAlert("일정이 성공적으로 생성되었습니다.", "success");
      setSubmitStatus('success');

      setFormData({
        project_id: project.id,
        type: activeTab,
        title: "",
        description: "",
        where: selectedPlatform || "",
        link: "",
        start_time: "",
        end_time: "",
        status: "not-started",
        created_by: user?.id || 0,
        updated_by: user?.id || 0,
        memo: "",
        assignee_id: [] as number[],
      });

      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error("Failed to create schedule:", error);
      let errorMessage = "일정 생성에 실패했습니다. 잠시 후 다시 시도해주세요.";
      if (error instanceof Error && error.message) {
        errorMessage = `일정 생성 중 오류가 발생했습니다. 입력값을 확인하거나 문제가 지속되면 관리자에게 문의해주세요. (상세: ${error.message})`;
      } else {
        errorMessage = "일정 생성 중 알 수 없는 오류가 발생했습니다. 입력값을 확인하거나 관리자에게 문의해주세요.";
      }
      setSubmitStatus('error');
      useAuthStore.getState().setAlert(errorMessage, "error");
    }
  };

  const tabs = [
    {
      id: "meeting" as ScheduleType,
      label: "회의",
      icon: UsersGroup,
      description: "팀 회의 및 미팅 일정을 등록합니다.",
    },
    {
      id: "event" as ScheduleType,
      label: "이벤트",
      icon: CalendarPlus,
      description: "프로젝트 이벤트 및 중요 행사를 등록합니다.",
    },
  ];

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
        if (!formData.type) {
          useAuthStore.getState().setAlert("일정 유형을 선택해주세요.", "error");
          return;
        }
        break;
      case 2:
        if (!formData.title) {
          useAuthStore.getState().setAlert("일정 이름을 입력해주세요.", "error");
          return;
        }
        break;
      case 3:
        if (!formData.start_time || !formData.end_time || dateError) {
          useAuthStore.getState().setAlert("시작일과 종료일을 입력해주세요.", "error");
          return;
        }
        break;
      case 4:
        if ((formData.type === "meeting" && formData.where !== "TeamUp" && formData.link === "") ||
          (formData.type === "event" && formData.where === "")) {
          useAuthStore.getState().setAlert("위치를 입력해주세요.", "error");
          return;
        }
        break;
      case 5:
        if (formData.assignee_id.length === 0) {
          useAuthStore.getState().setAlert("최소 한 명의 담당자는 필요합니다.", "error");
          return;
        }
        break;
    }
    setStep(step + 1);
  };

  const modalHeader = (
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-100">
        <CalendarMonth
          className="text-primary-600 text-lg"
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-text-primary">
          새로운 일정 추가
        </h3>
        <p className="text-sm text-point-color-indigo mt-0.5">
          프로젝트 일정을 관리하세요
        </p>
      </div>
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
          buttonText="일정 생성"
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
                  <Layers className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Type</h3>
                  <p className="text-text-secondary">Select type of schedule</p>
                </div>
                <div className="grid grid-cols-2 gap-4 p-1">
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`flex flex-col gap-2 border border-component-border rounded-lg 
                        items-center px-4 py-10 cursor-pointer relative
                        ${activeTab === tab.id ? "bg-point-color-indigo/20 border-point-color-indigo" : ""}
                        hover:bg-point-color-indigo/20 hover:border-point-color-indigo transition-all duration-200`}
                      onClick={() => handleTabChange(tab.id)}
                    >
                      {activeTab === tab.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-point-color-indigo rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <tab.icon className="text-primary-600 text-lg" />
                      <h3 className="text-xl font-bold text-text-primary">
                        {tab.label}
                      </h3>
                      <p className="text-sm text-text-tertiary mt-0.5">
                        {tab.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <InfoCircle className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <p className="text-text-secondary">Type the essentials</p>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                  >
                    일정 이름 <span className="text-point-color-purple ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
                    placeholder="일정 이름을 입력하세요"
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
                    placeholder="일정 설명을 입력하세요"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <CalendarWeek className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Date and Time</h3>
                  <p className="text-text-secondary">Select the date and time</p>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="start_time"
                    className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                  >
                    시작일 <span className="text-point-color-purple ml-1">*</span>
                  </label>
                  <DateTimePicker
                    id="start_time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="end_time"
                    className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                  >
                    종료일 <span className="text-point-color-purple ml-1">*</span>
                  </label>
                  <DateTimePicker
                    id="end_time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    minDate={formData.start_time}
                    minTime={formData.start_time ? format(new Date(formData.start_time), "hh:mm a", { locale: ko }) : undefined}
                    required
                  />
                  {dateError && (
                    <p className="text-red-500 text-sm">
                      종료일은 시작일 이후여야 합니다.
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <MapPin className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Location</h3>
                  <p className="text-text-secondary">Enter the location</p>
                </div>
                <div className="space-y-2">
                  {activeTab === "meeting" ? (
                    <>
                      <label
                        htmlFor="where"
                        className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                      >
                        화상 회의 플랫폼 <span className="text-point-color-purple ml-1">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                        {/* Zoom */}
                        <div
                          onClick={() => handlePlatformSelect("Zoom")}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedPlatform === "Zoom"
                            ? getPlatformColor("Zoom")
                            : "bg-component-secondary-background border border-component-border"
                            }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <VideoCamera className="text-blue-600" />
                          </div>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-text-primary">Zoom</p>
                          </div>
                        </div>

                        {/* Google Meet */}
                        <div
                          onClick={() => handlePlatformSelect("Google Meet")}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedPlatform === "Google Meet"
                            ? getPlatformColor("Google Meet")
                            : "bg-component-secondary-background border border-component-border"
                            }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <FontAwesomeIcon icon={faGoogle} className="text-red-600" />
                          </div>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-text-primary">
                              Google Meet
                            </p>
                          </div>
                        </div>

                        {/* TeamUp */}
                        <div
                          onClick={() => handlePlatformSelect("TeamUp")}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedPlatform === "TeamUp"
                            ? getPlatformColor("TeamUp")
                            : "bg-component-secondary-background border border-component-border"
                            }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                            <MiniLogo className="text-sm!" />
                          </div>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-text-primary">
                              TeamUp
                            </p>
                          </div>
                        </div>
                      </div>
                      {selectedPlatform !== "TeamUp" && (
                        <div>
                          <label
                            htmlFor="link"
                            className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                          >
                            회의 링크{" "}
                            <span className="text-point-color-purple ml-1">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Link
                                className="text-text-tertiary text-sm"
                              />
                            </div>
                            <input
                              type="text"
                              id="link"
                              name="link"
                              value={formData.link}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
                              placeholder={
                                selectedPlatform === "Zoom"
                                  ? "Zoom 회의 링크를 입력하세요"
                                  : selectedPlatform === "Google Meet"
                                    ? "Google Meet 링크를 입력하세요"
                                    : "화상 회의 링크를 입력하세요"
                              }
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <label
                        htmlFor="where"
                        className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                      >
                        이벤트 장소 <span className="text-point-color-purple ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        id="where"
                        name="where"
                        value={formData.where}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
                        placeholder="이벤트 장소를 입력해주세요"
                        required
                      />
                    </>
                  )}
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
                    assignee={project?.members || []}
                    toggleAssignee={toggleAssignee}
                    isAssigned={isAssigned}
                    label="선택된 담당자"
                  />
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <FilePen className="h-12 w-12 mx-auto text-primary mb-2" />
                  <h3 className="text-lg font-semibold">Memo</h3>
                  <p className="text-text-secondary">Add a memo</p>
                </div>
                <div className="space-y-2 p-1">
                  <label
                    htmlFor="memo"
                    className="flex items-center text-sm font-medium mb-2 text-text-secondary"
                  >
                    메모
                  </label>
                  <textarea
                    id="memo"
                    name="memo"
                    value={formData.memo}
                    onChange={handleChange}
                    rows={3}
                    className="resize-none w-full px-3 py-2 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
                    placeholder="메모를 입력해주세요"
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